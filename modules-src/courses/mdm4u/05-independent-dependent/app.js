// MDM4U 05 Independent vs Dependent Events: hero (bag + replacement switch tree), Replacement switch (Explore: bag, cards and
// two-way table modes; D1 tree with live branch fractions; D6 simulator; coin history), Test for independence stations
// (Part 3: two-way tables, mosaic square and step player), Bag designer task.
(function(){
"use strict";
var $ = MV.$, css = MV.css, F = MV.mdm.frac;

// @component radioGroup (copied from MDM4U 04; adds setOptions(list) for option sets that change with other controls)
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id)})
//   -> {set, get, lock, refresh, setOptions}
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), locked = false;
  function off(id){ return locked || !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = ids.indexOf(val) >= 0 && !off(val) ? val : ids.filter(function(id){ return !off(id); })[0];
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + id + '"' + (off(id) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + tab + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
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

// @component D1 treeDiagram — copied from MDM4U 01; grow() gains an onLevel(level) callback (fires as each level starts).
// Sample-space tree diagram (HTML labels and leaf buttons over SVG branches): stages of branches with labels and optional
// branch probabilities; leaves are buttons (tap to toggle; arrow keys, Home/End; roving tabindex) or plain labels (tap:false);
// "down" or "right" layout ("auto" picks "down" when every leaf gets minLeaf px); grow animation one level at a time;
// marked leaves and their paths in highlighter yellow; leafNote for path products.
// t = treeDiagram(host, { stages:[{ name, branches:[{ id, t, p }] }], children(path) -> branches (overrides stages' branches),
//   leafText(path), leafAria(path), leafNote(path), showP, tap:true, onTap(key, path), orient:"auto"|"down"|"right", minLeaf:58,
//   levelH:58, rowH:36, colW:96, leafW:92, maxH:460, bare:false, stageNames:true, label })
// Keys are path ids joined with ",". t.mark(keys); t.reveal(r); t.grow(from, to, done, onLevel) -> cancel(); t.set(opts); t.render(); t.leaves()
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
  inner.addEventListener("click", function(ev){ var b = ev.target.closest("button.d1-leaf"); if (!b) return; fk = b.dataset.key; if (o.onTap) o.onTap(b.dataset.key, b.dataset.key.split(",")); });
  inner.addEventListener("focusin", function(ev){ var b = ev.target.closest("button.d1-leaf"); if (!b) return; fk = b.dataset.key; Array.prototype.forEach.call(inner.querySelectorAll("button.d1-leaf"), function(x){ x.tabIndex = x === b ? 0 : -1; }); });
  inner.addEventListener("keydown", function(ev){
    var b = ev.target.closest("button.d1-leaf"); if (!b) return;
    var list = Array.prototype.slice.call(inner.querySelectorAll("button.d1-leaf")), i = list.indexOf(b), j = i;
    if (ev.key === "ArrowDown" || ev.key === "ArrowRight") j = Math.min(list.length - 1, i + 1);
    else if (ev.key === "ArrowUp" || ev.key === "ArrowLeft") j = Math.max(0, i - 1);
    else if (ev.key === "Home") j = 0; else if (ev.key === "End") j = list.length - 1; else return;
    ev.preventDefault(); list[j].focus(); list[j].scrollIntoView({ block:"nearest", inline:"nearest" });
  });
  if (window.ResizeObserver) new ResizeObserver(function(){ var w = Math.floor(scroll.clientWidth); if (w && Math.abs(w - lastW) > 2) render(); }).observe(scroll);
  return {
    mark:function(keys){ marked = {}; (keys || []).forEach(function(k){ marked[k] = 1; }); },
    reveal:function(r){ rev = r == null ? Infinity : r; },
    grow:function(from, to, done, onLevel){
      var live = true, stop = null, lvl = from;
      function next(){
        if (!live) return;
        if (lvl >= to) { rev = Infinity; render(); if (done) done(); return; }
        var a = lvl; if (onLevel) onLevel(a);
        stop = MV.tween({ dur:620, ease:function(t){ return t; }, step:function(t){ rev = a + t; render(); }, done:function(){ lvl = a + 1; rev = lvl; render(); setTimeout(next, MV.reduceMotion ? 0 : 380); } });
      }
      next();
      return function(){ live = false; if (stop) stop(); };
    },
    set:function(n){ Object.keys(n).forEach(function(k){ o[k] = n[k]; }); },
    render:render,
    leaves:function(){ return build().leaves.map(function(l){ return { key:key(l.path), path:l.path }; }); }
  };
}

// @component D6 simulator — repeatable trials, running tallies and a running relative-frequency graph.
// sim = makeSim({ trial:function(rng) -> outcome key, seed:"…", repeatable:true })
//   sim.reset(); sim.setRepeatable(bool) (resets); sim.run(n, {step(sim), done(sim)}) (animated over ≤ 40 frames; instant with
//   reduced motion); sim.seq (outcome keys in order), sim.counts {key: n}, sim.hits(pred) -> count; sim.stop().
//   Repeatable runs use MV.mdm.seededRandom(seed), so every device gets the same sequence (model data, challenges).
// drawRelFreq(plot, { seq, series:[{ pred(key) -> bool, color, theory }], describe })  running relative frequency of each
//   series (solid, 2.6 px) against the number of trials, with its theoretical value as a dashed line in the same colour.
function makeSim(o){
  var s = { seq:[], counts:{}, rep:o.repeatable !== false, seed:o.seed, rng:null, raf:null };
  function stop(){ if (s.raf) cancelAnimationFrame(s.raf); s.raf = null; }
  function one(){ var k = o.trial(s.rng); s.seq.push(k); s.counts[k] = (s.counts[k] || 0) + 1; }
  s.reset = function(){ stop(); s.seq = []; s.counts = {}; s.rng = MV.mdm.seededRandom(s.rep ? s.seed : Math.floor(Math.random() * 4294967296)); };
  s.setRepeatable = function(b){ s.rep = !!b; s.reset(); };
  s.run = function(n, cb){
    stop(); cb = cb || {};
    if (MV.reduceMotion) { for (var i = 0; i < n; i++) one(); if (cb.step) cb.step(s); if (cb.done) cb.done(s); return; }
    var left = n, frames = Math.min(40, Math.max(5, Math.ceil(n / 12))), per = Math.ceil(n / frames);
    (function tick(){ var m = Math.min(per, left); for (var j = 0; j < m; j++) one(); left -= m; if (cb.step) cb.step(s);
      if (left > 0) s.raf = requestAnimationFrame(tick); else { s.raf = null; if (cb.done) cb.done(s); } })();
  };
  s.hits = function(pred){ var h = 0; for (var i = 0; i < s.seq.length; i++) if (pred(s.seq[i])) h++; return h; };
  s.stop = stop; s.busy = function(){ return !!s.raf; };
  s.reset();
  return s;
}

// ---------- small helpers ----------
function Pw(words){ return '<span class="m"><i>P</i>(' + words + ")</span>"; }      // P(words) with upright words
function mm(s){ return MV.m(s); }
function muted(h){ return '<span class="muted">' + h + "</span>"; }
function q(){ return '<span class="ix-q" aria-label="hidden until the reveal">?</span>'; }
function relText(h, n){ var f = F.of(h, n); return h + "/" + n + (F.exactDec(f, 4) ? " = " : " ≈ ") + F.dec(f, 4); }
function dec(v){ return MV.num(Math.round(v * 10000) / 10000); }
function dec2(v){ return (Math.round(v * 100) / 100).toFixed(2); }
var NAME = { B:"blue", Y:"yellow", P:"purple" };
function Lt(id){ return '<span class="ix-l ix-' + id.toLowerCase() + '">' + id + "</span>"; }      // colour letter (colour + letter)
function marble(id, cls){ return '<span class="ix-mb ix-mb-' + id.toLowerCase() + (cls ? " " + cls : "") + '">' + id + "</span>"; }
// a bag of marbles (shrinks to a row of counters on phones)
function bagHTML(c, lift){
  var h = '<span class="ix-mbs">', done = false;
  ["B", "Y", "P"].forEach(function(id){ for (var i = 0; i < (c[id] || 0); i++) { var up = !done && lift === id; if (up) done = true; h += marble(id, up ? "ix-lift" : ""); } });
  h += '</span><span class="ix-cnts">' + ["B", "Y", "P"].map(function(id){ return '<span class="ix-cnt">' + Lt(id) + " × " + (c[id] || 0) + "</span>"; }).join("") + "</span>";
  return h;
}

// ---------- the draw model ----------
// @component drawModel — draws from a pool of classes, with or without replacement (D1 + D6 support for modules 05, 17, 21–23).
// mdl = { ids:["B","Y","P"], count:{B:3, Y:2, P:0}, rep:true|false, draws:2 }
//   dmKids(mdl, path) -> [{id, n, d}] branches after path (count left of that class, total left; classes at 0 are left out)
//   dmPaths(mdl) -> [{path, fs:[{n, d}], pr:frac}] every full path with its exact probability (MV.mdm.frac)
//   dmValid(mdl) -> the bag can be drawn from draws times; dmTrial(mdl) -> D6 trial function (outcome key "B,Y")
function dmKids(mdl, path){
  if (path.length >= mdl.draws) return [];
  var k = {}, n = 0;
  mdl.ids.forEach(function(x){ k[x] = mdl.count[x] || 0; });
  if (!mdl.rep) path.forEach(function(x){ k[x]--; });
  mdl.ids.forEach(function(x){ n += Math.max(0, k[x]); });
  if (n <= 0) return [];
  return mdl.ids.filter(function(x){ return k[x] > 0; }).map(function(x){ return { id:x, n:k[x], d:n }; });
}
function dmPaths(mdl){
  var out = [];
  (function rec(p, fs){
    var ks = dmKids(mdl, p);
    if (!ks.length) { if (p.length === mdl.draws) out.push({ path:p, fs:fs, pr:fs.reduce(function(a, f){ return F.mul(a, F.of(f.n, f.d)); }, F.of(1, 1)) }); return; }
    ks.forEach(function(k){ rec(p.concat([k.id]), fs.concat([{ n:k.n, d:k.d }])); });
  })([], []);
  return out;
}
function dmTotal(mdl){ var n = 0; mdl.ids.forEach(function(x){ n += mdl.count[x] || 0; }); return n; }
function dmValid(mdl){ var n = dmTotal(mdl); return n > 0 && (mdl.rep || n >= mdl.draws); }
function dmTrial(mdl){
  return function(rng){
    var k = {}, out = [];
    mdl.ids.forEach(function(x){ k[x] = mdl.count[x] || 0; });
    for (var i = 0; i < mdl.draws; i++) { var j = rng.pick(mdl.ids.map(function(x){ return Math.max(0, k[x]); })), id = mdl.ids[j]; out.push(id); if (!mdl.rep) k[id]--; }
    return out.join(",");
  };
}
function sumF(list){ return list.reduce(function(a, l){ return F.add(a, l.pr); }, F.of(0, 1)); }
function prodTxt(l){ return l.fs.map(function(f){ return f.n + "/" + f.d; }).join(" × "); }
function pathInfo(mdl, path){
  var fs = [];
  for (var i = 0; i < path.length; i++) { var k = dmKids(mdl, path.slice(0, i)).filter(function(x){ return x.id === path[i]; })[0]; if (!k) return null; fs.push({ n:k.n, d:k.d }); }
  return { path:path, fs:fs, pr:fs.reduce(function(a, f){ return F.mul(a, F.of(f.n, f.d)); }, F.of(1, 1)) };
}
// "3/5 × 2/4 + 2/5 × 3/4 = 3/10 + 3/10 = 3/5": multiply along each path, then add across paths
function evCalc(L){
  if (!L.length) return "0";
  var sum = F.txt(sumF(L));
  if (L.length === 1) return prodTxt(L[0]) + " = " + sum;
  if (L.length <= 3) return L.map(prodTxt).join(" + ") + " = " + L.map(function(l){ return F.txt(l.pr); }).join(" + ") + " = " + sum;
  return L.map(function(l){ return F.txt(l.pr); }).join(" + ") + " = " + sum;
}
function evCalcHTML(L){
  if (L.length > 6) return MV.m("= " + F.txt(sumF(L))) + ' <span class="ix-capw">(the ' + L.length + " highlighted paths, added)</span>";
  return MV.m("= " + evCalc(L));
}

// ---------- events ----------
var BAG_EV = [
  { id:"fb", t:"First blue", f:function(p){ return p[0] === "B"; } },
  { id:"sb", t:"Second blue", f:function(p){ return p[1] === "B"; } },
  { id:"bb", t:"Both blue", t3:"All blue", f:function(p){ return p.every(function(x){ return x === "B"; }); } },
  { id:"oe", t:"One of each (blue and yellow)", t3:"One of each colour", pn:"one of each", pn3:"one of each colour", f:function(p){ return p.slice().sort().join("") === (p.length === 2 ? "BY" : "BPY"); } },
  { id:"al", t:"At least one blue", f:function(p){ return p.indexOf("B") >= 0; } },
  { id:"sc", t:"Both the same colour", t3:"All the same colour", f:function(p){ return p.every(function(x){ return x === p[0]; }); } }
];
var CARD_EV = [
  { id:"fa", t:"First ace", fam:"ace", f:function(p){ return p[0] === "X"; } },
  { id:"sa", t:"Second ace", fam:"ace", f:function(p){ return p[1] === "X"; } },
  { id:"ba", t:"Both aces", fam:"ace", f:function(p){ return p[0] === "X" && p[1] === "X"; } },
  { id:"fh", t:"First heart", fam:"heart", f:function(p){ return p[0] === "X"; } },
  { id:"sh", t:"Second heart", fam:"heart", f:function(p){ return p[1] === "X"; } }
];
var SUITS = [{ s:"♠", n:"spades" }, { s:"♥", n:"hearts", red:true }, { s:"♦", n:"diamonds", red:true }, { s:"♣", n:"clubs" }];
var RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var TW = { total:200, nA:120, nB:80 };     // TC3 two-way table: sport 120, job 80, of 200

// @component bagSliders — three marble-count sliders (blue b, yellow y, purple p) in the course event colours with letters
function bagSliders(host, vals, max, onChange){
  var defs = [["b", "B", "Blue", "--ev-a"], ["y", "Y", "Yellow", "--ev-b"], ["p", "P", "Purple", "--ev-c"]];
  host.innerHTML = defs.map(function(d){
    return '<label class="slider ix-sl"><span class="slider-top"><span>' + Lt(d[1]) + " " + d[2] + ", " + mm(d[0]) + '</span><output data-bo="' + d[0] + '" style="color:var(' + d[3] + ')">' + vals[d[0]] + "</output></span>" +
      '<input type="range" data-bs="' + d[0] + '" min="0" max="' + max + '" step="1" value="' + vals[d[0]] + '" style="accent-color:var(' + d[3] + ')" aria-label="' + d[2] + " marbles, " + d[0] + '"></label>';
  }).join("");
  host.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.bs; if (!k) return; var v = Math.round(+e.target.value); host.querySelector('[data-bo="' + k + '"]').textContent = v; onChange(k, v); });
  return { set:function(k, v){ var el = host.querySelector('[data-bs="' + k + '"]'); if (el) el.value = v; var o = host.querySelector('[data-bo="' + k + '"]'); if (o) o.textContent = v; } };
}

// ---------- Explore: the Replacement switch ----------
function explore(host, api){
  var S = api.S;
  if (["bag", "cards", "table"].indexOf(S.mode) < 0) S.mode = "bag";
  ["b", "y", "p"].forEach(function(k, i){ if (typeof S[k] !== "number") S[k] = [3, 2, 0][i]; });
  S.draws = S.draws === 3 ? 3 : 2; S.rep = !!S.rep; S.simRep = S.simRep !== false;
  if (!BAG_EV.some(function(e){ return e.id === S.ev; })) S.ev = "bb";
  if (!CARD_EV.some(function(e){ return e.id === S.cev; })) S.cev = "ba";
  S.coin = !!S.coin; S.pair = !!S.pair; if (S.both == null) S.both = "";
  var pv = {}, anim = null, sims = {}, openC = null, coin = null;

  host.innerHTML =
    '<div class="ix-modes" id="ix-modes"></div>' +
    '<div class="pg ix-pg"><div class="pg-graph" data-mv="graph"><p class="ix-cap" id="ix-cap" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="ix-bagv"><div class="ix-pic"><div class="ix-box"><span class="ix-plab">Bag</span><div class="ix-bag" id="ix-bag"></div></div><div class="ix-box ix-shelfbox"><span class="ix-plab">Set aside</span><div class="ix-shelf" id="ix-shelf"></div></div></div><p class="tiny muted ix-pictxt" id="ix-bagtxt" aria-live="polite"></p></div>' +
      '<div id="ix-cardv" hidden><div class="ix-deckwrap"><div class="ix-deck" id="ix-deck" role="img"></div></div><p class="tiny muted ix-pictxt" id="ix-decktxt"></p></div>' +
      '<div id="ix-coinv" hidden><p class="ix-plab">History</p><div class="ix-coins" id="ix-hist"></div><p class="ix-plab">Next flip</p><div class="ix-coins"><span class="ix-coin ix-next" id="ix-next">?</span></div><div id="ix-cbar"></div><p class="tiny muted" id="ix-cointxt"></p></div>' +
      '<div id="ix-treev"><p class="tiny muted ix-treelab" id="ix-treelab"></p><div id="ix-tree"></div></div>' +
      '<div id="ix-tabv" hidden><p class="ix-twcap">Two-way table <span class="tiny muted">(counts of students)</span></p><div id="ix-tab"></div></div></div>' +
    '<div class="pg-ctrl"><div id="ix-ctl-bag"><div id="ix-sl"></div><div id="ix-draws"></div></div>' +
      '<div class="ix-reprow" id="ix-ctl-rep"><label class="ix-switch"><input type="checkbox" role="switch" id="ix-rep"><span class="ix-track" aria-hidden="true"></span><span>Replacement: <strong id="ix-repst"></strong></span></label><button type="button" class="btn ghost sm" id="ix-demo">Show the first draw</button></div>' +
      '<div id="ix-evbag"></div><div id="ix-evcard"></div>' +
      '<div class="q-actions" id="ix-ctl-coin" hidden><button type="button" class="btn primary sm" id="ix-coinrun">Simulate 1000 flips after 5 heads</button><button type="button" class="btn ghost sm" id="ix-coinback">Back to the cards</button></div>' +
      '<div id="ix-ctl-tab" hidden><label class="ix-numlab" for="ix-both">Number who play a sport <strong>and</strong> have a job</label><div class="ix-numrow"><button type="button" class="btn ghost sm" data-both="-1" aria-label="One fewer">−</button><input class="numin" id="ix-both" type="number" min="0" max="200" step="1" autocomplete="off"><button type="button" class="btn ghost sm" data-both="1" aria-label="One more">+</button></div></div>' +
      '<div class="ix-simrow" id="ix-sim"><span class="rg-lab">Simulate</span><button type="button" class="btn sm" data-run="100">Run 100</button><button type="button" class="btn sm" data-run="1000">Run 1000</button><button type="button" class="btn ghost sm" id="ix-simreset">Reset</button><label class="ix-check"><input type="checkbox" id="ix-simrep"> Repeatable run</label></div></div>' +
    '<div class="pg-read"><dl class="read" id="ix-read" aria-live="polite"></dl></div></div>';

  var tree = treeDiagram($("#ix-tree", host), { stages:[{ name:"Draw 1" }, { name:"Draw 2" }], children:treeKids, showP:true, tap:true, orient:"right",
    colW:110, get leafW(){ return narrow() ? (S.draws === 3 ? 100 : 84) : 158; }, rowH:38, maxH:460, label:"Tree diagram: each leaf is one path", leafText:leafText, leafAria:leafAria, onTap:tapLeaf });

  // --- controls ---
  var modeR = radios($("#ix-modes", host), { label:"Mode", options:[{ id:"bag", t:"Bag" }, { id:"cards", t:"Cards" }, { id:"table", t:"Two-way table" }], value:S.mode, cls:"seg",
    onChange:function(v){ user(); S.mode = v; S.coin = false; S.pair = false; save(); render(); MV.changed(); } });
  var sl = bagSliders($("#ix-sl", host), S, 10, function(k, v){ user(); S[k] = v; save(); render(); MV.changed(); });
  var drawsR = radios($("#ix-draws", host), { label:"Draws", options:[{ id:"2", t:"2" }, { id:"3", t:"3" }], value:String(S.draws), cls:"seg",
    onChange:function(v){ user(); S.draws = +v; save(); evBagR.setOptions(bagEvOpts()); render(); MV.changed(); } });
  var evBagR = radios($("#ix-evbag", host), { label:"Event", options:bagEvOpts(), value:S.ev, cls:"chips",
    onChange:function(v){ user(); S.ev = v; save(); render(); MV.changed(); } });
  var evCardR = radios($("#ix-evcard", host), { label:"Event", options:CARD_EV.map(function(e){ return { id:e.id, t:e.t }; }), value:S.cev, cls:"chips",
    onChange:function(v){ user(); S.cev = v; S.pair = false; save(); render(); MV.changed(); } });
  var repEl = $("#ix-rep", host), bothEl = $("#ix-both", host), simRepEl = $("#ix-simrep", host);
  repEl.addEventListener("change", function(){
    user(); S.rep = repEl.checked; save();
    var c = S.mode === "bag" && dmValid(model()) ? firstCol() : null;
    if (c) { newAnim(); pv.stale = { rep:!S.rep, done:{} }; demoDraw(c, endAnim); } else render();
    MV.changed();
  });
  simRepEl.addEventListener("change", function(){ S.simRep = simRepEl.checked; save(); Object.keys(sims).forEach(function(k){ sims[k].setRepeatable(S.simRep); }); coin = null; render(); });
  bothEl.addEventListener("input", function(){ user(); S.both = bothEl.value; save(); render(); MV.changed(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.run) { runSim(+b.dataset.run); return; }
    if (b.id === "ix-simreset") { var s = sim(); if (s) s.reset(); render(); return; }
    if (b.id === "ix-demo") { user(); var c = firstCol(); if (c && dmValid(model())) { newAnim(); demoDraw(c, endAnim); } return; }
    if (b.id === "ix-coinrun") { user(); newAnim(); runCoin(endAnim); return; }
    if (b.id === "ix-coinback") { user(); S.coin = false; save(); render(); return; }
    if (b.dataset.both) { user(); var x = bothVal(); x = Math.max(0, Math.min(200, (x == null ? 0 : x) + +b.dataset.both)); S.both = String(x); bothEl.value = x; save(); render(); MV.changed(); }
  });

  function save(){ api.save(); }
  function bagEvOpts(){ return BAG_EV.map(function(e){ return { id:e.id, t:S.draws === 3 && e.t3 ? e.t3 : e.t }; }); }
  function syncControls(){
    modeR.set(S.mode); drawsR.set(String(S.draws)); evBagR.setOptions(bagEvOpts()); evBagR.set(S.ev); evCardR.set(S.pair ? "" : S.cev);
    sl.set("b", S.b); sl.set("y", S.y); sl.set("p", S.p);
    repEl.checked = S.rep; simRepEl.checked = S.simRep; if (bothEl.value !== String(S.both)) bothEl.value = S.both;
  }

  // --- model ---
  function evDef(){ return S.mode === "cards" ? CARD_EV.filter(function(e){ return e.id === S.cev; })[0] : BAG_EV.filter(function(e){ return e.id === S.ev; })[0]; }
  function evName(){ var e = evDef(), d3 = S.mode === "bag" && S.draws === 3; return d3 && e.pn3 ? e.pn3 : e.pn ? e.pn : (d3 && e.t3 ? e.t3 : e.t).toLowerCase(); }
  function cardFam(){ return CARD_EV.filter(function(e){ return e.id === S.cev; })[0].fam; }
  function model(){
    if (S.mode === "bag") return { ids:["B", "Y", "P"], count:{ B:S.b, Y:S.y, P:S.p }, rep:S.rep, draws:S.draws };
    if (S.mode === "cards") { var a = cardFam() === "ace"; return { ids:["X", "O"], count:{ X:a ? 4 : 13, O:a ? 48 : 39 }, rep:S.rep, draws:2 }; }
    return null;
  }
  function firstCol(){ return ["B", "Y", "P"].filter(function(c){ return S[c.toLowerCase()] > 0; })[0] || null; }
  function evPaths(){ var mdl = model(), e = evDef(); return mdl && dmValid(mdl) ? dmPaths(mdl).filter(function(l){ return e.f(l.path); }) : []; }
  function invalidMsg(){
    var n = S.b + S.y + S.p;
    if (!n) return "The bag is empty. Add some marbles.";
    return "Without replacement, the bag needs at least " + S.draws + " marbles to draw " + S.draws + " times.";
  }
  function bothVal(){ var s = String(S.both == null ? "" : S.both).trim(); if (!/^\d+$/.test(s)) return null; return parseInt(s, 10); }

  // --- tree ---
  function brLabel(id){ if (S.mode === "bag") return Lt(id); var L = cardFam() === "heart" ? "H" : "A"; return "<i>" + L + "</i>" + (id === "X" ? "" : "′"); }
  function narrow(){ return ($("#ix-tree", host).clientWidth || 600) < 520; }
  function brWord(id){ if (S.mode === "bag") return NAME[id]; var h = cardFam() === "heart"; return id === "X" ? (h ? "heart" : "ace") : (h ? "not a heart" : "not an ace"); }
  function collapsed(){ return S.mode === "bag" && S.draws === 3 && ($("#ix-tree", host).clientWidth || 600) < 560; }
  function openCol(){ var k = dmKids(model(), []).map(function(x){ return x.id; }); return k.indexOf(openC) >= 0 ? openC : k[0]; }
  function treeKids(p){
    var mdl = model(); if (!mdl) return [];
    if (collapsed() && p.length === 1 && p[0] !== openCol()) return [];
    var stale = pv.stale && p.length >= 1 ? { ids:mdl.ids, count:mdl.count, rep:pv.stale.rep, draws:mdl.draws } : null, real = dmKids(mdl, p);
    var ks = stale ? dmKids(stale, p) : real;
    return ks.map(function(k){
      var key = p.concat([k.id]).join(","), r = stale && pv.stale.done[key] ? real.filter(function(x){ return x.id === k.id; })[0] : null, use = r || k;
      var txt = use.n + "/" + use.d;
      return { id:k.id, t:brLabel(k.id), p:pv.flash && pv.flash[key] ? '<span class="ix-fl">' + txt + "</span>" : txt };
    });
  }
  function isCollapsedNode(path){ return collapsed() && path.length === 1 && path[0] !== openCol(); }
  function leafText(path){
    var lets = path.map(brLabel).join("");
    if (isCollapsedNode(path)) return lets + ' <small class="ix-more">show more</small>';
    var mdl = model(); if (path.length < mdl.draws || pv.hide) return lets;
    var l = pathInfo(mdl, path); return l ? lets + " <small>" + (narrow() ? "" : prodTxt(l) + " = ") + F.txt(l.pr) + "</small>" : lets;
  }
  function leafAria(path){
    var w = MV.cap(path.map(brWord).join(" then "));
    if (isCollapsedNode(path)) return w + " first: its branches are hidden. Activate to show them.";
    var mdl = model(); if (path.length < mdl.draws || pv.hide) return w;
    var l = pathInfo(mdl, path); return l ? w + ": " + prodTxt(l) + " = " + F.txt(l.pr) : w;
  }
  function tapLeaf(key, path){
    if (isCollapsedNode(path)) { openC = path[0]; render(); var b = $('#ix-tree [data-key^="' + path[0] + '"]', host); if (b) b.focus(); return; }
    if (pv.hide) return;
    var keep = pv.pick === key ? null : key; user(); pv.pick = keep; render();
  }
  function markKeys(){
    if (pv.marks) return pv.marks;
    if (pv.hide) return [];
    var keys = evPaths().map(function(l){ return l.path.join(","); });
    if (pv.pick) keys.push(pv.pick);
    if (collapsed()) { var oc = openCol(); keys = keys.map(function(k){ var a = k.split(","); return a[0] === oc ? k : a[0]; }); }
    return keys.filter(function(k, i){ return keys.indexOf(k) === i; });
  }

  // --- animation bookkeeping; any user action cancels and finishes it ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], stops:[], fin:fin || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function endAnim(){ var a = anim; anim = null; if (a && a.fin) { var f = a.fin; a.fin = null; f(); } }
  function cancelAnim(){
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} });
    if (a.fin) { var f = a.fin; a.fin = null; f(); }
  }
  function user(){ var had = !!anim || Object.keys(pv).length > 0; cancelAnim(); pv = {}; MV.banner("", ""); if (had) render(); }

  // storyboard: draw one marble; with replacement it drops back, without it waits on the shelf and the counts tick down;
  // then each second-level fraction recomputes in turn
  function demoDraw(col, then){
    pv.lift = col; pv.shelf = null; pv.out = null; render();
    later(MV.reduceMotion ? 0 : 650, function(){
      pv.lift = null; pv.shelf = col; if (!S.rep) pv.out = col; render();
      if (S.rep) later(700, function(){ pv.shelf = null; pv.back = col; render(); recompute(then); });
      else later(450, function(){ recompute(then); });
    });
  }
  function recompute(then){
    var mdl = model(), keys = [];
    dmKids(mdl, []).forEach(function(k){ dmKids(mdl, [k.id]).forEach(function(k2){ keys.push(k.id + "," + k2.id); }); });
    var i = 0;
    (function step(){
      if (i < keys.length) { pv.flash = {}; pv.flash[keys[i]] = 1; if (pv.stale) pv.stale.done[keys[i]] = 1; i++; render(); later(380, step); return; }
      pv.flash = null; pv.stale = null; render(); if (then) then();
    })();
  }

  // --- simulator (D6) ---
  function simKey(){ return S.mode === "bag" ? "bag|" + [S.b, S.y, S.p, S.draws, S.rep ? 1 : 0].join(",") : S.mode === "cards" ? "cards|" + cardFam() + "|" + (S.rep ? 1 : 0) : null; }
  function sim(){ var k = simKey(), mdl = model(); if (!k || !mdl || !dmValid(mdl)) return null; return sims[k] || (sims[k] = makeSim({ seed:"mdm4u-05-" + k, repeatable:S.simRep, trial:dmTrial(mdl) })); }
  function runSim(n){ var s = sim(); if (!s || s.busy()) return; s.run(n, { step:paintRead, done:paintRead }); }
  function simText(){
    var s = sim();
    if (!s) return muted("—");
    if (!s.seq.length) return muted("Press Run 100 or Run 1000.");
    var e = evDef(), h = s.hits(function(k){ return e.f(k.split(",")); });
    return mm(relText(h, s.seq.length)) + " " + muted("(" + MV.esc(evName()) + ", " + (S.simRep ? "repeatable run" : "random run") + ")");
  }

  // --- coin (P3): flips that come right after 5 heads in a row ---
  function coinSim(){
    var r = MV.mdm.seededRandom(S.simRep ? "mdm4u-05-coin" : Math.floor(Math.random() * 4294967296)), run = 0, got = [], flips = 0;
    while (got.length < 1000) { var hd = r() < 0.5; flips++; if (run >= 5) got.push(hd); run = hd ? run + 1 : 0; }
    return { got:got, flips:flips, shown:0 };
  }
  function runCoin(then){
    coin = coinSim(); var a = anim;
    var stop = MV.tween({ dur:1500, ease:function(t){ return t; }, step:function(t){ coin.shown = Math.round(1000 * t); paintCoin(); paintRead(); }, done:function(){ coin.shown = 1000; if (anim === a) { pv.hideCoin = false; render(); if (then) then(); } } });
    if (a) a.stops.push(stop);
  }
  function coinHeads(){ var h = 0; for (var i = 0; i < coin.shown; i++) if (coin.got[i]) h++; return h; }

  // --- painting ---
  function render(){
    var mode = S.mode, cv = mode === "cards" && S.coin, pair = mode === "cards" && S.pair && !cv, drawn = mode === "bag" || (mode === "cards" && !cv && !pair);
    modeR.set(mode);
    $("#ix-bagv", host).hidden = mode !== "bag"; $("#ix-cardv", host).hidden = !(mode === "cards" && !cv); $("#ix-coinv", host).hidden = !cv;
    $("#ix-treev", host).hidden = !drawn; $("#ix-tabv", host).hidden = mode !== "table";
    $("#ix-ctl-bag", host).hidden = mode !== "bag"; $("#ix-ctl-rep", host).hidden = !drawn; $("#ix-demo", host).hidden = mode !== "bag";
    $("#ix-evbag", host).hidden = mode !== "bag"; $("#ix-evcard", host).hidden = !(mode === "cards" && !cv);
    $("#ix-ctl-coin", host).hidden = !cv; $("#ix-ctl-tab", host).hidden = mode !== "table"; $("#ix-sim", host).hidden = !drawn;
    $("#ix-repst", host).textContent = S.rep ? "with replacement" : "without replacement";
    $("#ix-ctl-rep", host).classList.toggle("ix-swfl", !!pv.stale);
    evCardR.set(pair ? "" : S.cev);
    if (mode === "bag") paintBag();
    if (mode === "cards" && !cv) paintDeck(pair);
    if (cv) paintCoin();
    if (drawn) paintTree();
    if (mode === "table") paintTable();
    var mdl = model(), ok = !mdl || dmValid(mdl);
    Array.prototype.forEach.call(host.querySelectorAll("[data-run]"), function(b){ b.disabled = !ok; });
    $("#ix-demo", host).disabled = mode !== "bag" || !ok;
    paintCap(); paintRead();
  }
  function paintBag(){
    var c = { B:S.b, Y:S.y, P:S.p }, n = S.b + S.y + S.p;
    if (pv.out) c[pv.out]--;
    $("#ix-bag", host).innerHTML = n ? bagHTML(c, pv.lift) : muted("empty");
    $("#ix-shelf", host).innerHTML = pv.shelf ? marble(pv.shelf, "ix-in") : "";
    var t = "Bag: " + n + " marble" + (n === 1 ? "" : "s") + " (" + S.b + " blue, " + S.y + " yellow, " + S.p + " purple).";
    if (pv.out) t = "A " + NAME[pv.out] + " marble is set aside: " + c.B + " blue, " + c.Y + " yellow, " + c.P + " purple left (" + (n - 1) + " marbles).";
    else if (pv.shelf && S.rep) t = "A " + NAME[pv.shelf] + " marble is drawn …";
    else if (pv.back) t = "The " + NAME[pv.back] + " marble drops back in: the bag still holds " + n + ".";
    $("#ix-bagtxt", host).textContent = t;
  }
  function paintDeck(pair){
    var fam = cardFam(), e = evDef(), second = !pair && /^s|^b/.test(e.id), aside = second && !S.rep ? (fam === "ace" ? "0,0" : "1,0") : null, st = pv.pairStep;
    var h = '<span class="ix-dh"></span>' + RANKS.map(function(r){ return '<span class="ix-dh">' + r + "</span>"; }).join("");
    SUITS.forEach(function(su, si){
      var rowCls = "";
      if (pair) rowCls = si === 1 ? " ix-ra" + (st === 1 ? " ix-pulse" : "") : si === 0 ? " ix-rb" + (st === 2 ? " ix-pulse" : "") : "";
      h += '<span class="ix-ds' + (su.red ? " ix-red" : "") + '">' + su.s + (pair && si === 1 ? ' <b class="ev-a">A</b>' : pair && si === 0 ? ' <b class="ev-b">B</b>' : "") + "</span>";
      RANKS.forEach(function(r, ri){
        var on = !pair && (fam === "ace" ? ri === 0 : si === 1), gone = aside === si + "," + ri;
        h += '<span class="ix-cd' + (su.red ? " ix-red" : "") + (on ? " on" : "") + rowCls + (gone ? " ix-gone" : "") + '">' + r + "</span>";
      });
    });
    var deck = $("#ix-deck", host); deck.innerHTML = h;
    var X = fam === "ace" ? "ace" : "heart", cnt = fam === "ace" ? 4 : 13, txt;
    if (pair) txt = "One card. " + "Row " + "A: the 13 hearts. Row B: the 13 spades. No card is in both rows.";
    else if (second && !S.rep) txt = "If the first card is " + (fam === "ace" ? "an ace" : "a heart") + " and it’s set aside: " + (cnt - 1) + " " + X + "s among 51 cards.";
    else if (second) txt = "The first card goes back and the deck is shuffled: " + cnt + " " + X + "s among 52 cards again.";
    else txt = MV.cap(X) + "s: " + cnt + " of the 52 cards.";
    $("#ix-decktxt", host).textContent = txt;
    deck.setAttribute("aria-label", "Standard deck, 4 suits by 13 ranks. " + txt);
  }
  function paintCoin(){
    var hide = !!pv.hideCoin;
    $("#ix-hist", host).innerHTML = "HHHHH".split("").map(function(){ return '<span class="ix-coin">H</span>'; }).join("");
    $("#ix-next", host).textContent = hide || !coin || coin.shown < 1000 ? "?" : "H or T";
    var bar = $("#ix-cbar", host), txt = $("#ix-cointxt", host);
    if (!coin) { bar.innerHTML = ""; txt.textContent = "Press Simulate to flip a coin many times and keep only the flips that come right after 5 heads in a row."; return; }
    var h = coinHeads(), n = coin.shown, w = n ? (h / n * 100).toFixed(1) : 0;
    bar.innerHTML = '<div class="ix-cbar" role="img" aria-label="' + h + " heads in " + n + ' flips after 5 heads"><i style="width:' + w + '%"></i><span class="ix-cmark" aria-hidden="true"></span></div><div class="ix-cleg tiny"><span>heads ' + h + "</span><span>½</span><span>tails " + (n - h) + "</span></div>";
    txt.innerHTML = n + " flips that came right after 5 heads in a row" + (n === 1000 ? " (from " + MV.mdm.fmt(coin.flips) + " flips in all)" : "") + ": " + h + " heads. " + (S.simRep ? '<span class="mdm-model">model data</span>' : "");
  }
  function paintTree(){
    var mdl = model(), coll = collapsed();
    tree.set({ stages:S.mode === "bag" ? [{ name:"Draw 1" }, { name:"Draw 2" }, { name:"Draw 3" }].slice(0, S.draws) : [{ name:"Card 1" }, { name:"Card 2" }] });
    tree.mark(markKeys()); tree.render();
    var X = cardFam() === "heart" ? "H" : "A", lab = S.mode === "bag" ? "Each branch shows " + (S.rep ? "the same bag every time (the marble goes back)." : "what’s left in the bag after the draws before it.") :
      X + " = " + (X === "H" ? "a heart" : "an ace") + ", " + X + "′ = " + (X === "H" ? "not a heart" : "not an ace") + ". Each branch shows " + (S.rep ? "a full deck every time." : "what’s left of the deck after the first card.");
    if (coll) lab += " One first branch at a time: tap “show more” to open another.";
    else lab += " Highlighted paths make up the event; tap a leaf to highlight one path.";
    $("#ix-treelab", host).textContent = dmValid(mdl) ? lab : "";
  }
  function paintTable(){
    var x = bothVal(), A = TW.nA, B = TW.nB, N = TW.total;
    function cell(v){ return v == null ? "?" : v < 0 ? '<span class="ix-neg">' + MV.num(v) + "</span>" : MV.num(v); }
    var c = x == null ? [null, null, null, null] : [x, A - x, B - x, N - A - B + x];
    $("#ix-tab", host).innerHTML = '<div class="tbl-wrap"><table class="ix-tw"><caption class="vh">Students by sport and part-time job</caption><thead><tr><th scope="col"></th><th scope="col">Has a job</th><th scope="col">No job</th><th scope="col">Total</th></tr></thead><tbody>' +
      '<tr><th scope="row">Plays a sport</th><td class="ix-now">' + cell(c[0]) + "</td><td>" + cell(c[1]) + "</td><td>" + A + "</td></tr>" +
      '<tr><th scope="row">No sport</th><td>' + cell(c[2]) + "</td><td>" + cell(c[3]) + "</td><td>" + (N - A) + "</td></tr>" +
      '<tr class="ix-tot"><th scope="row">Total</th><td>' + B + "</td><td>" + (N - B) + "</td><td>" + N + "</td></tr></tbody></table></div>" +
      (x != null && (x > B || x > A) ? '<p class="ix-warn">A count can’t be negative: only ' + B + " students have a job, so at most " + B + " can do both.</p>" : "");
  }
  function paintCap(){
    var cap = $("#ix-cap", host), mode = S.mode;
    if (mode === "table") {
      var x = bothVal();
      cap.innerHTML = Pw("sport and job") + " " + mm("= " + (x == null ? "?" : F.dec(F.of(x, TW.total), 4))) + "<br>" + Pw("sport") + " × " + Pw("job") + " " + mm("= 0.6 × 0.4 = 0.24");
      return;
    }
    if (mode === "cards" && S.coin) { cap.innerHTML = Pw("heads on the next flip") + " " + mm("= " + (pv.hideCoin ? "?" : "1/2")); return; }
    if (mode === "cards" && S.pair) { cap.innerHTML = mm("A") + " = heart, " + mm("B") + " = spade, on the same card"; return; }
    var mdl = model();
    if (!dmValid(mdl)) { cap.innerHTML = '<span class="ix-warn">' + invalidMsg() + "</span>"; return; }
    if (pv.hide) { cap.innerHTML = Pw(MV.esc(evName())) + " " + mm("= ?"); return; }
    if (pv.pick) { var l = pathInfo(mdl, pv.pick.split(",")); if (l) { cap.innerHTML = '<span class="ix-capw">' + MV.cap(l.path.map(brWord).join(" then ")) + ":</span> " + mm(prodTxt(l) + " = " + F.txt(l.pr)); return; } }
    cap.innerHTML = Pw(MV.esc(evName())) + " " + evCalcHTML(evPaths());
  }
  function paintRead(){
    var rows, mode = S.mode;
    if (mode === "table") rows = readTable();
    else if (mode === "cards" && S.coin) rows = [["History", "H H H H H"], [Pw("heads") + " on the next flip", pv.hideCoin ? q() : mm("1/2") + " " + muted("(the coin has no memory)")],
      ["Simulated", coin && coin.shown ? mm(relText(coinHeads(), coin.shown)) + " " + muted("(heads among flips right after 5 heads)") : muted("Press Simulate.")]];
    else if (mode === "cards" && S.pair) rows = readPair();
    else rows = readDraws();
    $("#ix-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function readDraws(){
    var mdl = model();
    if (!dmValid(mdl)) return [[S.mode === "bag" ? "Bag" : "Deck", '<span class="ix-warn">' + invalidMsg() + "</span>"]];
    var bag = S.mode === "bag", X = bag ? "B" : "X", nm = bag ? "blue" : cardFam(), H = !!pv.hide;
    var bothW = bag ? (S.draws === 3 ? "first two blue" : "both blue") : "both " + cardFam() + "s";
    var m2 = { ids:mdl.ids, count:mdl.count, rep:mdl.rep, draws:2 }, L2 = dmPaths(m2), N = dmTotal(mdl);
    var k0 = dmKids(m2, []).filter(function(k){ return k.id === X; })[0], after = k0 ? dmKids(m2, [X]) : [], k1 = after.filter(function(k){ return k.id === X; })[0];
    var first = k0 ? F.of(k0.n, k0.d) : F.of(0, 1), secL = L2.filter(function(l){ return l.path[1] === X; }), second = sumF(secL);
    var both = k0 && k1 ? F.mul(first, F.of(k1.n, k1.d)) : F.of(0, 1), prod = F.mul(first, second), indep = F.eq(both, prod);
    var afterTxt = k1 ? F.prob(k1.n, k1.d, { dec:false }) : k0 && after.length ? F.prob(0, after[0].d, { dec:false }) : muted("— (no " + nm + " can be drawn first)");
    var rows = [
      [Pw("first " + nm), F.prob(k0 ? k0.n : 0, k0 ? k0.d : N, { dec:false })],
      [Pw("second " + nm + " after first " + nm), afterTxt],
      [Pw("second " + nm) + ", overall", H ? q() : mm((secL.length > 1 ? secL.map(function(l){ return F.txt(l.pr); }).join(" + ") + " = " : "") + F.txt(second))],
      [Pw(bothW), H ? q() : mm(k0 && k1 ? k0.n + "/" + k0.d + " × " + k1.n + "/" + k1.d + " = " + F.txt(both) : "0")],
      [Pw("first " + nm) + " × " + Pw("second " + nm), H ? q() : mm(F.txt(first) + " × " + F.txt(second) + " = " + F.txt(prod))],
      ["Independent?", H ? q() : (indep ? "<strong>Yes:</strong> " + mm(F.txt(both) + " = " + F.txt(prod)) : "<strong>No:</strong> " + mm(F.txt(both) + " ≠ " + F.txt(prod))) + (k0 ? "" : " " + muted("(no " + nm + " in the " + (bag ? "bag" : "deck") + ")"))],
      [Pw(MV.esc(evName())), H ? q() : mm(F.txt(sumF(evPaths()))) + (S.mode === "bag" && S.draws === 3 ? " " + muted("(3 draws)") : "")],
      ["Simulated", H ? q() : simText()]
    ];
    if ((S.mode === "bag" && S.ev === "bb" && S.draws === 2) || (S.mode === "cards" && S.cev === "ba")) rows.splice(6, 1);   // the event is the both row
    return rows;
  }
  function readPair(){
    var st = pv.pairStep == null ? 9 : pv.pairStep;
    return [[mm("P(A)") + " (heart)", mm("13/52 = 1/4")], [mm("P(B)") + " (spade)", mm("13/52 = 1/4")],
      [mm("P(A and B)"), st >= 2 ? mm("0") + ": no card is both a heart and a spade" : q()],
      [mm("P(A) × P(B)"), st >= 3 ? mm("1/4 × 1/4 = 1/16") : q()],
      ["Independent?", st >= 3 ? "<strong>No:</strong> " + mm("0 ≠ 1/16") : q()],
      ["If the card is a heart", st >= 3 ? Pw("spade") + " drops from " + mm("1/4") + " to 0" : q()]];
  }
  function readTable(){
    var x = bothVal(), N = TW.total, rows = [[Pw("sport"), mm(F.prob(TW.nA, N))], [Pw("job"), mm(F.prob(TW.nB, N))]];
    rows.push([Pw("sport and job"), x == null ? muted("Enter the number who do both.") : mm(F.prob(x, N))]);
    rows.push([Pw("sport") + " × " + Pw("job"), mm("0.6 × 0.4 = 0.24")]);
    var ind;
    if (x == null) ind = muted("Enter the number who do both.");
    else if (x > TW.nB) ind = '<span class="ix-warn">Impossible: only ' + TW.nB + " students have a job.</span>";
    else if (x === 48) ind = "<strong>Yes:</strong> " + mm("0.24 = 0.24");
    else ind = "<strong>No:</strong> " + mm(F.dec(F.of(x, N), 4) + " ≠ 0.24");
    rows.push(["Independent?", ind]);
    return rows;
  }

  // --- start ---
  syncControls(); render();

  // --- predictions ---
  function startPred(p){
    cancelAnim(); pv = {}; openC = null; coin = null;
    if (p.id === "p1" || p.id === "p2") { S.mode = "bag"; S.b = 3; S.y = 2; S.p = 0; S.draws = 2; S.rep = true; S.ev = "bb"; S.coin = false; S.pair = false; pv.hide = true; pv.marks = []; }
    else if (p.id === "p3") { S.mode = "cards"; S.coin = true; S.pair = false; pv.hideCoin = true; }
    else if (p.id === "p4") { S.mode = "cards"; S.coin = false; S.pair = true; pv.pairStep = 0; }
    save(); syncControls(); render(); MV.changed();
  }
  function finish(){ pv = {}; render(); MV.changed(); endAnim(); }
  function runPred(p, done){
    newAnim(done);
    if (p.id === "p1") later(250, function(){ pv.marks = ["B"]; pv.flash = { B:1 }; render(); later(700, function(){ pv.marks = ["B,B"]; pv.flash = { "B,B":1 }; render(); later(900, finish); }); });
    else if (p.id === "p2") later(300, function(){
      S.rep = false; save(); syncControls(); pv.stale = { rep:true, done:{} }; render();
      demoDraw("B", function(){ pv.marks = ["B,B"]; render(); later(800, finish); });
    });
    else if (p.id === "p3") later(300, function(){ runCoin(function(){ later(300, finish); }); });
    else if (p.id === "p4") later(300, function(){ pv.pairStep = 1; render(); later(850, function(){ pv.pairStep = 2; render(); later(850, function(){ pv.pairStep = 3; render(); later(700, finish); }); }); });
    else finish();
  }

  return {
    predict:{ start:startPred, run:runPred },
    challenge:function(id){ return chal(id); }
  };

  function chal(id){
    var n = S.b + S.y + S.p;
    if (id === "tc1") {
      if (S.mode !== "bag") return { ok:false, msg:"Switch to Bag mode first." };
      if (!S.rep) return { ok:false, msg:"Switch replacement on; this one is about independent draws." };
      if (S.p !== 0) return { ok:false, msg:"Set purple to 0: this bag has no purple." };
      if (S.b === S.y && S.b >= 1) return { ok:true };
      if (S.b === 2 && S.y === 1) return { ok:false, msg:mm("(2/3)^2 = 4/9") + "." };
      if (!S.b) return { ok:false, msg:"Add blue marbles: with no blue, " + Pw("both blue") + " = 0." };
      return { ok:false, msg:Pw("both blue") + " " + mm("= (" + S.b + "/" + n + ")^2 = " + F.txt(F.of(S.b * S.b, n * n))) + ", not " + mm("1/4") + "." };
    }
    if (id === "tc2") {
      if (S.mode !== "bag") return { ok:false, msg:"Switch to Bag mode first." };
      if (S.p !== 0) return { ok:false, msg:"Set purple to 0: this bag has no purple." };
      if (S.rep) return S.b === 3 && S.y === 3 ? { ok:false, msg:"That’s " + mm("1/4") + ": switch replacement off." } : { ok:false, msg:"Switch replacement off; this one is about dependent draws." };
      var num = S.b * (S.b - 1), den = n * (n - 1);
      if (den > 0 && 5 * num === den) return { ok:true };
      if (S.b === 2 && S.y === 3) return { ok:false, msg:mm("2/5 × 1/4 = 1/10") + "." };
      if (S.b === 4 && S.y === 4) return { ok:false, msg:mm("4/8 × 3/7 = 3/14") + "." };
      if (n < 2) return { ok:false, msg:"Put at least 2 marbles in the bag: two are drawn." };
      return { ok:false, msg:Pw("both blue") + " " + mm("= " + S.b + "/" + n + " × " + (S.b ? S.b - 1 : 0) + "/" + (n - 1) + " = " + F.txt(F.of(num, den))) + ", not " + mm("1/5") + "." };
    }
    if (id === "tc3") {
      if (S.mode !== "table") return { ok:false, msg:"Switch to Two-way table mode first." };
      var x = bothVal();
      if (x == null) return { ok:false, msg:"Enter the number of students who do both." };
      if (x === 48) return { ok:true };
      if (x === 40) return { ok:false, msg:"Half of 80 isn’t the test. Use " + Pw("sport") + " × " + Pw("job") + "." };
      if (x === 0) return { ok:false, msg:"Then they’d be mutually exclusive, and so dependent." };
      if (x === 96) return { ok:false, msg:"0.6 × 0.4 × 400? Use the 200 students." };
      if (x > TW.nB) return { ok:false, msg:"Only " + TW.nB + " students have a job, so at most " + TW.nB + " can do both." };
      return { ok:false, msg:Pw("sport and job") + " " + mm("= " + F.prob(x, TW.total)) + ", but " + Pw("sport") + " × " + Pw("job") + " = 0.24." };
    }
    return { ok:false };
  }
}

// ---------- hero: draw with replacement (3/5, 9/25), rewind, draw without (2/4, 3/10) ----------
function hero(f){
  var bagEl = $("#ixh-bag"), shelf = $("#ixh-shelf"), sw = $("#ixh-sw"), cap = f.cap;
  if (!bagEl) return;
  var st = { rep:true, stale:null, out:false, shelf:false, lift:false, marks:[], flash:null, cap:"" };
  function mdl(rep){ return { ids:["B", "Y"], count:{ B:3, Y:2 }, rep:rep, draws:2 }; }
  var t = treeDiagram($("#ixh-tree"), { tap:false, orient:"down", bare:true, levelH:62, minLeaf:44, showP:true,
    children:function(p){ var r = p.length && st.stale != null ? st.stale : st.rep; return dmKids(mdl(r), p).map(function(k){ var key = p.concat([k.id]).join(","), tx = k.n + "/" + k.d; return { id:k.id, t:Lt(k.id), p:st.flash === key ? '<span class="ix-fl">' + tx + "</span>" : tx }; }); },
    leafText:function(p){ return p.map(Lt).join(""); } });
  function paint(){
    bagEl.innerHTML = bagHTML({ B:st.out ? 2 : 3, Y:2 }, st.lift ? "B" : null);
    shelf.innerHTML = st.shelf ? marble("B", "ix-in") : "";
    sw.innerHTML = '<span class="ixh-swi' + (st.rep ? " on" : "") + '"></span> Replacement: <strong>' + (st.rep ? "with" : "without") + "</strong>";
    t.mark(st.marks); t.render();
    cap.innerHTML = st.cap;
  }
  var C1 = Pw("both blue") + " " + MV.m("= 3/5 × 3/5 = 9/25"), C2 = Pw("both blue") + " " + MV.m("= 3/5 × 2/4 = 3/10");
  if (MV.reduceMotion) { st.rep = false; st.out = true; st.shelf = true; st.marks = ["B,B"]; st.cap = C2; paint(); return; }
  paint();
  var seq = [
    [700, function(){ st.lift = true; }],
    [700, function(){ st.lift = false; st.shelf = true; }],
    [800, function(){ st.shelf = false; st.flash = "B,B"; st.marks = ["B,B"]; st.cap = C1; }],
    [2200, function(){ st.flash = null; st.marks = []; st.cap = ""; st.stale = true; st.rep = false; }],
    [700, function(){ st.lift = true; }],
    [700, function(){ st.lift = false; st.shelf = true; st.out = true; }],
    [600, function(){ st.stale = null; st.flash = "B,B"; }],
    [500, function(){ st.flash = "B,Y"; }],
    [600, function(){ st.flash = null; st.marks = ["B,B"]; st.cap = '<span class="ixh-old">' + Pw("both blue") + " " + MV.m("= 9/25") + "</span> " + C2; }],
    [1800, function(){ st.cap = C2; }]
  ], i = 0;
  (function next(){ if (i >= seq.length) return; var s = seq[i++]; MV.wait(s[0], function(){ s[1](); paint(); next(); }); })();
}

// ---------- Part 3: Test for independence (two-way tables, a mosaic square and a step player) ----------
function part3(host, api){
  var C = api.content, S = api.S, ST = C.stations;
  if (!ST.some(function(s){ return s.id === S.st; })) S.st = ST[0].id;
  S.call = S.call || {};
  function data(s){ return s.data ? ST.filter(function(x){ return x.id === s.data; })[0] : s; }
  function truth(s){ var d = data(s); return d.nAB * d.total === d.nA * d.nB ? "ind" : "dep"; }
  host.innerHTML = '<div id="tw-st" class="tw-st"></div>' + ST.map(function(s){
    return '<div class="tw-station" data-st="' + s.id + '"><h3>' + s.title + "</h3><p>" + s.text + ' <span class="mdm-model">model data</span></p><div class="sym"><div>' +
      '<div id="tw-tbl-' + s.id + '"></div><div class="plot-wrap"><canvas class="plot" id="tw-mo-' + s.id + '" role="img" aria-label="Mosaic square"></canvas></div>' +
      '<p class="legend tiny tw-leg"><span><i class="sw" style="background:var(--ev-b-soft);border:1px solid var(--ev-b)"></i>' + data(s).colB + "</span><span><i class=\"sw\" style=\"background:var(--hi-soft);border:1.5px solid var(--sel-bd)\"></i>both (" + data(s).a + " and " + data(s).b + ")</span><span><i class=\"sw dash\"></i>" + (s.data ? "everyone" : "test line") + "</span></p></div>" +
      '<div><div id="tw-call-' + s.id + '"></div><div id="tw-pl-' + s.id + '"></div><ol class="tw-steps" id="tw-steps-' + s.id + '" aria-live="polite"></ol><div id="tw-res-' + s.id + '" aria-live="polite"></div>' +
      (s.alg ? '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' + s.alg.map(function(l){ return "<span>" + l + "</span>"; }).join("") + "</div></details>" : "") +
      "</div></div></div>";
  }).join("");
  radios($("#tw-st", host), { label:"Station", options:ST.map(function(s){ return { id:s.id, t:s.chip }; }), value:S.st, cls:"chips", onChange:function(v){ S.st = v; api.save(); showSt(); } });
  function showSt(){ Array.prototype.forEach.call(host.querySelectorAll(".tw-station"), function(d){ d.hidden = d.dataset.st !== S.st; }); MV.redrawAll(); }

  ST.forEach(function(s){
    var d = data(s), st3 = !!s.data, step = 0, tw = 1, stop = null;
    var pA = d.nA / d.total, pB = d.nB / d.total, pAB = d.nAB / d.total, hA = d.nAB / d.nA, hN = (d.nB - d.nAB) / (d.total - d.nA);
    var steps = st3 ? ["Make your call, then press <strong>Step</strong> to run the test."].concat(s.steps) : [
      "Make your call, then press <strong>Step</strong> to run the test.",
      Pw(d.a) + " " + mm("= " + d.nA + "/" + d.total + " = " + dec(pA)),
      Pw(d.b) + " " + mm("= " + d.nB + "/" + d.total + " = " + dec(pB)),
      Pw(d.a) + " × " + Pw(d.b) + " " + mm("= " + dec(pA) + " × " + dec(pB) + " = " + dec2(pA * pB)),
      Pw(d.a + " and " + d.b) + " " + mm("= " + d.nAB + "/" + d.total + " = " + dec2(pAB)),
      s.verdict + (s.note ? " " + s.note : "")];
    var plot = new MV.Plot($("#tw-mo-" + s.id, host), { xmin:-0.06, xmax:1.2, ymin:-0.22, ymax:1.06 });
    plot.render = function(){ drawMosaic(plot, d, step, tw, st3, pA, pB, hA, hN); };
    radios($("#tw-call-" + s.id, host), { label:"Your call", options:[{ id:"ind", t:"Independent" }, { id:"dep", t:"Dependent" }], value:S.call[s.id] || "", cls:"chips",
      onChange:function(v){ S.call[s.id] = v; api.save(); paintRes(); } });
    function paintTbl(){
      var nNA = d.total - d.nA, c = [[d.nAB, d.nA - d.nAB, d.nA], [d.nB - d.nAB, nNA - (d.nB - d.nAB), nNA], [d.nB, d.total - d.nB, d.total]];
      var used = {};
      if (!st3) { if (step >= 1) used["0,2"] = 1; if (step >= 2) used["2,0"] = 1; if (step >= 1) used["2,2"] = 1; if (step >= 4) used["0,0"] = 1; }
      else { if (step >= 1) { used["0,0"] = 1; used["0,2"] = 1; } if (step >= 2) { used["2,0"] = 1; used["2,2"] = 1; } }
      var dim = st3 && step === 1, now = {};
      if (!st3) now[{ 1:"0,2", 2:"2,0", 4:"0,0" }[step]] = 1;
      var rows = [d.rowA, d.rowNotA, "Total"];
      $("#tw-tbl-" + s.id, host).innerHTML = '<div class="tbl-wrap"><table class="ix-tw"><caption class="vh">' + MV.esc(MV.plain(s.text)) + '</caption><thead><tr><th scope="col"></th><th scope="col">' + d.colB + '</th><th scope="col">' + d.colNotB + '</th><th scope="col">Total</th></tr></thead><tbody>' +
        rows.map(function(r, ri){ return '<tr class="' + (ri === 2 ? "ix-tot" : "") + (dim && ri === 1 ? " ix-dim" : "") + '"><th scope="row">' + r + "</th>" + c[ri].map(function(v, ci){ var k = ri + "," + ci; return '<td class="' + (used[k] ? "ix-used" : "") + (now[k] ? " ix-now" : "") + '">' + v + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
    }
    function paintSteps(){ $("#tw-steps-" + s.id, host).innerHTML = steps.slice(1, step + 1).map(function(x){ return "<li>" + x + "</li>"; }).join("") || '<li class="tw-intro">' + steps[0] + "</li>"; }
    function paintRes(){
      var box = $("#tw-res-" + s.id, host), last = step === steps.length - 1, call = S.call[s.id], tr = truth(s);
      if (!last) { box.innerHTML = ""; return; }
      var word = tr === "ind" ? "independent" : "dependent";
      box.innerHTML = call ? MV.fbHTML(call === tr ? "good" : "bad", call === tr ? "✓ Your call matches the test: " + word + "." : "✗ Your call was " + (call === "ind" ? "independent" : "dependent") + ", but the numbers say " + word + ".") : '<p class="tiny muted">Make your call above to compare it with the test.</p>';
    }
    function go(i){
      var from = step; step = i; if (stop) { stop(); stop = null; }
      var animAt = st3 ? 1 : 4;
      if (i === animAt && from < i) { tw = 0; stop = MV.tween({ dur:900, step:function(t){ tw = t; plot.render(); }, done:function(){ tw = 1; stop = null; plot.render(); } }); }
      else tw = 1;
      paintTbl(); paintSteps(); paintRes(); plot.render();
    }
    MV.player($("#tw-pl-" + s.id, host), { count:steps.length, render:go, label:function(i){ return i ? "Step " + i + " of " + (steps.length - 1) : "Ready"; } });
  });
  showSt();
  return {};
}
// @component mosaicSquare — a unit square split into columns A | not A (widths P(A), P(A′)); inside each column the B part
// rises from the bottom (height P(B after that column)). A dashed line at P(B) is the test: independent when both columns
// reach it. The A-and-B cell is highlighted; an outlined rectangle shows P(A) × P(B). (Part 3 of module 05; also 17.)
function drawMosaic(plot, d, step, tw, st3, pA, pB, hA, hN){
  var desc;
  plot.draw({ view:{ xmin:-0.06, xmax:1.2, ymin:-0.22, ymax:1.06 }, grid:false, axes:false, after:function(ctx, P){
    var ink = css("--ink"), ink2 = css("--ink-2"), sheet = css("--sheet"), bSoft = css("--ev-b-soft"), bCol = css("--ev-b"), hiS = css("--hi-soft"), sel = css("--sel-bd"), dimC = css("--plot-grid");
    var ui = css("--font-ui") || "sans-serif";
    function R(x0, y0, x1, y1){ ctx.beginPath(); ctx.rect(P.X(x0), P.Y(y1), P.X(x1) - P.X(x0), P.Y(y0) - P.Y(y1)); }
    function txt(s, x, y, al, col, wt){ ctx.font = (wt || 600) + " 12px " + ui; ctx.textAlign = al || "center"; ctx.textBaseline = "middle"; ctx.fillStyle = col || ink; ctx.fillText(s, P.X(x), P.Y(y)); }
    R(0, 0, 1, 1); ctx.fillStyle = sheet; ctx.fill();
    var showCols = st3 || step >= 1, fillA = 0, fillN = 0, line = false, rect = false, gap = false;
    if (!st3) { line = step >= 2; rect = step >= 3; if (step >= 4) { fillA = pB + (hA - pB) * tw; fillN = pB + (hN - pB) * tw; } }
    else { if (step >= 1) fillA = hA * (step === 1 ? tw : 1); if (step >= 2) { fillN = hN; line = true; } gap = step >= 3; }
    if (fillN) { R(pA, 0, 1, fillN); ctx.fillStyle = bSoft; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = bCol; ctx.stroke(); }
    if (fillA) { R(0, 0, pA, fillA); ctx.fillStyle = bSoft; ctx.fill(); ctx.fillStyle = hiS; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = sel; ctx.stroke(); }
    if (st3 && step === 1) { R(pA, 0, 1, 1); ctx.globalAlpha = 0.7; ctx.fillStyle = dimC; ctx.fill(); ctx.globalAlpha = 1; }
    if (rect) {
      ctx.beginPath(); ctx.rect(P.X(0) + 4, P.Y(pB) + 4, P.X(pA) - P.X(0) - 8, P.Y(0) - P.Y(pB) - 8); ctx.setLineDash([5, 4]); ctx.lineWidth = 2; ctx.strokeStyle = ink; ctx.stroke(); ctx.setLineDash([]);
      txt("test: " + dec2(pA * pB), pA / 2, 0.08, "center", ink, 600);
      if (fillA) txt("both: " + dec2(pA * fillA), pA / 2, fillA * 0.55, "center", ink, 700);
    }
    if (line) { ctx.setLineDash([8, 6]); ctx.lineWidth = 2; ctx.strokeStyle = ink2; ctx.beginPath(); ctx.moveTo(P.X(0), P.Y(pB)); ctx.lineTo(P.X(1.02), P.Y(pB)); ctx.stroke(); ctx.setLineDash([]); txt(st3 ? F.txt(F.of(d.nB, d.total)) : dec(pB), 1.03, pB, "left", ink2); }
    if (st3 && fillA) txt(F.txt(F.of(d.nAB, d.nA)), pA / 2, Math.min(0.97, fillA + 0.05), "center", ink, 700);
    if (gap) { ctx.lineWidth = 2; ctx.strokeStyle = css("--red"); ctx.beginPath(); ctx.moveTo(P.X(pA * 0.82), P.Y(pB)); ctx.lineTo(P.X(pA * 0.82), P.Y(hA)); ctx.stroke(); txt("≠", pA * 0.82 + 0.05, (pB + hA) / 2, "left", css("--red"), 700); }
    R(0, 0, 1, 1); ctx.lineWidth = 2; ctx.strokeStyle = ink; ctx.stroke();
    if (showCols) { ctx.beginPath(); ctx.moveTo(P.X(pA), P.Y(0)); ctx.lineTo(P.X(pA), P.Y(1)); ctx.lineWidth = 2; ctx.strokeStyle = ink; ctx.stroke();
      txt(d.rowA, pA / 2, -0.06, "center", ink); txt(d.rowNotA, (1 + pA) / 2, -0.06, "center", ink);
      txt("width " + dec(pA), pA / 2, -0.15, "center", ink2, 400); txt("width " + dec(1 - pA), (1 + pA) / 2, -0.15, "center", ink2, 400); }
    else txt("all " + d.total + " students", 0.5, -0.08, "center", ink2, 400);
  }, describe:(function(){
    if (st3) desc = ["Unit square split into " + d.rowA.toLowerCase() + " (width " + dec(pA) + ") and " + d.rowNotA.toLowerCase() + "."][0] + (step >= 1 ? " In the " + d.rowA.toLowerCase() + " column, " + d.colB.toLowerCase() + " fills 5/6 of the height." : "") + (step >= 2 ? " A dashed line marks " + d.colB.toLowerCase() + " for everyone at 3/4." : "") + (step >= 3 ? " 5/6 is above 3/4: dependent." : "");
    else desc = (step >= 1 ? "Unit square split into " + d.rowA.toLowerCase() + " (width " + dec(pA) + ") and " + d.rowNotA.toLowerCase() + " (width " + dec(1 - pA) + ")." : "Unit square for all " + d.total + " students.") +
      (step >= 2 ? " Dashed test line at " + dec(pB) + ", the probability of " + d.colB.toLowerCase() + "." : "") + (step >= 3 ? " Outlined rectangle " + dec(pA) + " by " + dec(pB) + ", area " + dec2(pA * pB) + "." : "") +
      (step >= 4 ? " The both cell rises to " + dec(hA) + " in the " + d.rowA.toLowerCase() + " column (area " + dec2(pA * hA) + ")" + (Math.abs(hA - pB) < 1e-9 ? ", exactly on the line: independent." : ", above the line: dependent.") : "");
    return desc;
  })() });
}

// ---------- Performance task: Bag designer ----------
var task = (function(){
  var api = null, tr = null, MORE0 = null;
  function nn(v, d){ return typeof v === "number" && isFinite(v) ? v : d; }
  function read(){ var s = api ? api.S : {}; return { b:nn(s.b, 3), y:nn(s.y, 2), p:nn(s.p, 1) }; }
  function checks(d){ var n = d.b + d.y + d.p, den = n * (n - 1), num = d.b * (d.b - 1); return [d.b >= 1 && d.y >= 1 && d.p >= 1, n > 0 && 4 * d.p === n, n <= 12, den > 0 && den <= 10 * num && 5 * num <= den]; }
  function mdl(){ var d = read(); return { ids:["B", "Y", "P"], count:{ B:d.b, Y:d.y, P:d.p }, rep:false, draws:2 }; }
  function tkNarrow(){ var el = $("#tk-tree"); return (el && el.clientWidth || 600) < 520; }
  function paint(){
    var d = read(), n = d.b + d.y + d.p, rows = [["Marbles in the bag, " + mm("n"), String(n)]];
    rows.push([Pw("first purple"), n ? mm(F.prob(d.p, n, { dec:false })) : muted("—")]);
    if (n >= 2) { var f = F.of(d.b * (d.b - 1), n * (n - 1)); rows.push([Pw("both blue"), mm(d.b + "/" + n + " × " + Math.max(0, d.b - 1) + "/" + (n - 1) + " = " + F.txt(f) + (f.n && f.d !== 1 ? (F.exactDec(f, 4) ? " = " : " ≈ ") + F.dec(f, 4) : ""))]); }
    else rows.push([Pw("both blue"), muted("Two marbles are drawn: put at least 2 in the bag.")]);
    $("#tk-read").innerHTML = MV.readoutHTML(rows);
    if (tr) { tr.mark(["B,B"]); tr.render(); }
  }
  return {
    render:function(inp, pvh, a){
      api = a; var d = read(); a.S.b = d.b; a.S.y = d.y; a.S.p = d.p;
      inp.innerHTML = '<div class="tk-in" id="tk-sl"></div>';
      pvh.innerHTML = '<dl class="read tk-read" id="tk-read" aria-live="polite"></dl><p class="tiny muted tk-treelab">Tree for two draws without replacement (the blue–blue path is highlighted).</p><div id="tk-tree"></div>';
      bagSliders($("#tk-sl"), d, 10, function(k, v){ a.S[k] = v; a.save(); paint(); a.update(); });
      tr = treeDiagram($("#tk-tree"), { stages:[{ name:"Draw 1" }, { name:"Draw 2" }], children:function(p){ return dmKids(mdl(), p).map(function(k){ return { id:k.id, t:Lt(k.id), p:k.n + "/" + k.d }; }); },
        showP:true, tap:false, orient:"right", colW:104, get leafW(){ return tkNarrow() ? 84 : 158; }, rowH:34, maxH:420,
        leafText:function(p){ var l = pathInfo(mdl(), p); return p.map(Lt).join("") + (l && p.length === 2 ? " <small>" + (tkNarrow() ? "" : prodTxt(l) + " = ") + F.txt(l.pr) + "</small>" : ""); } });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:checks,
    key:function(d){
      var k = d.b + "," + d.y + "," + d.p, st = MV.taskState(), n = st.found.length + (st.found.indexOf(k) < 0 ? 1 : 0);
      if (MORE0 == null) MORE0 = MV.C.task.more;
      MV.C.task.more = n >= 3 ? "You’ve found all three answers." : MORE0;
      return k;
    },
    label:function(k){ return "(" + k.split(",").join(", ") + ")"; },
    text:function(k){ var p = k.split(","); return p[0] + " blue, " + p[1] + " yellow, " + p[2] + " purple"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
