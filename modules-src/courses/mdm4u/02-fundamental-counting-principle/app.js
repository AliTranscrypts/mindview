// MDM4U 02 The Fundamental Counting Principle: hero (café tree shrinks into slots), Choice chain (Explore: D3 counting slots
// + D1 tree; Build / Scenarios / List vs multiply), "Multiply or add?" stations (Part 3: sorter, unequal branches, listing),
// N4 count entry with factor forms (Practice 1 and 2), "Code system" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
function big(v){ return MV.mdm.fmt(v).replace(/ /g, " "); }        // 65 000 with a no-break space
function ordinal(n){ return n + (n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th"); }
function lc(s){ return String(s).charAt(0).toLowerCase() + String(s).slice(1); }

// @component radioGroup (copied from MDM4U 01 / MHF4U 25) — segmented control or chip row as a real radio group
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

// @component D3 countingSlots — counting slots (course plan D3), self-contained: positions to fill as Letter / Digit / Item
// slots. Each slot is a group: a counting-order badge flanked by Move left / Move right (counting order only; positions never
// move), the live count, a pool bar (restricted values dimmed, values taken by earlier slots hatched), a type menu, a choices
// stepper (pool size: first n letters, digits 0…n − 1, or n items) and a restriction menu (not 0, odd only, even only, vowel
// only, fixed value with a value stepper). Repetition is per type. Warning outline when a count depends on an earlier choice.
// Model (pure):
//   D3.allowed(ch, i) -> [{id, t}]   D3.analyse(ch) -> {steps:[{slot, k, count, base, sub, dep:[slot…]}] (counting order),
//     bySlot, factors, product, ok, bad:{slot, on}}   (count = |allowed| − earlier same-type slots whose set lies inside it;
//     a partly overlapping earlier set makes the count depend on that choice: the counting check fails)
//   D3.trueCount(ch, limit) -> exact number of outcomes by memoized listing (null if over the work limit)
//   D3.tree(ch, cap) -> {kids:{pathKey:[{id, t, more}]}, shown}  the first `cap` outcomes in counting order, "…" (id "_more")
//     for the rest; feed it to D1 as children(path). D3.outcomes(ch, cap) -> [[value per slot, position order]…]
//   D3.text(ch, vals) outcome text (codes run together; item outcomes joined with " · ")
// chain ch = { slots:[{ type:"L"|"D"|"I", n, r:""|"not0"|"odd"|"even"|"vowel"|"fixed", v, name, labels:[item names] }],
//   rep:{ L:bool, D:bool }, order:[slot indices in counting order] }
// UI: ui = D3.ui(host, { chain:() -> ch, lock:() -> {type, n, r, order} (true hides that control), onChange(what, slot) })
//   ui.render(pv)  pv = { hide (counts "?"), shown (first k counting steps revealed), hi (slot being counted: highlighter),
//   hatch:{slot:k} (hatched count while animating) }
var D3 = (function(){
  var AZ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", MAX = { L:26, D:10, I:26 }, DEF = { L:26, D:10, I:3 };
  var RESTR = { L:["", "vowel", "fixed"], D:["", "not0", "odd", "even", "fixed"], I:["", "fixed"] };
  var RNAME = { "":"no restriction", not0:"not 0", odd:"odd only", even:"even only", vowel:"vowel only", fixed:"fixed (must be one value)" };
  var TNAME = { L:"Letter", D:"Digit", I:"Item" };
  function rOf(s){ return RESTR[s.type] && RESTR[s.type].indexOf(s.r || "") >= 0 ? (s.r || "") : ""; }
  function nOf(s){ var n = Math.round(+s.n); return Math.max(1, Math.min(MAX[s.type] || 26, isFinite(n) && n > 0 ? n : DEF[s.type])); }
  function pool(ch, i){
    var s = ch.slots[i], n = nOf(s), out = [];
    for (var k = 0; k < n; k++) out.push(s.type === "L" ? { id:AZ[k], t:AZ[k] } : s.type === "D" ? { id:String(k), t:String(k) } : { id:"i" + i + "." + k, t:(s.labels && s.labels[k]) || String.fromCharCode(97 + i % 26) + (k + 1) });
    return out;
  }
  function allowed(ch, i){
    var s = ch.slots[i], p = pool(ch, i), r = rOf(s);
    if (r === "not0") return p.filter(function(v){ return v.id !== "0"; });
    if (r === "odd") return p.filter(function(v){ return +v.id % 2 === 1; });
    if (r === "even") return p.filter(function(v){ return +v.id % 2 === 0; });
    if (r === "vowel") return p.filter(function(v){ return "AEIOU".indexOf(v.id) >= 0; });
    if (r === "fixed") return [p[Math.max(0, Math.min(p.length - 1, s.v | 0))]];
    return p;
  }
  function tracked(ch, i){ var t = ch.slots[i].type; return t !== "I" && !ch.rep[t]; }
  function analyse(ch){
    var sets = ch.slots.map(function(_, i){ return allowed(ch, i).map(function(v){ return v.id; }); });
    var steps = [], bySlot = {}, product = 1, bad = null;
    ch.order.forEach(function(si, k){
      var base = sets[si].length, sub = 0, dep = [];
      if (tracked(ch, si)) for (var q = 0; q < k; q++) {
        var sj = ch.order[q]; if (ch.slots[sj].type !== ch.slots[si].type) continue;
        var inside = sets[sj].filter(function(x){ return sets[si].indexOf(x) >= 0; }).length;
        if (inside === sets[sj].length) sub++; else if (inside > 0) dep.push(sj);
      }
      sub = Math.min(sub, base);
      var st = { slot:si, k:k, count:base - sub, base:base, sub:sub, dep:dep };
      steps.push(st); bySlot[si] = st; product *= st.count;
      if (dep.length && !bad) bad = { slot:si, on:dep[0] };
    });
    return { steps:steps, bySlot:bySlot, factors:steps.map(function(s){ return s.count; }), product:product, ok:!bad, bad:bad, sets:sets };
  }
  function trueCount(ch, limit){
    var sets = analyse(ch).sets, n = ch.order.length, memo = {}, work = 0;
    function rec(k, used){
      if (k === n) return 1;
      var key = k + "|" + used.join(","); if (memo[key] != null) return memo[key];
      if (++work > (limit || 150000)) throw new Error("limit");
      var si = ch.order[k], tr = tracked(ch, si), tot = 0;
      sets[si].forEach(function(v){ if (tr && used.indexOf(v) >= 0) return; tot += rec(k + 1, tr ? used.concat([v]).sort() : used); });
      return (memo[key] = tot);
    }
    try { return rec(0, []); } catch (e) { return null; }
  }
  function tree(ch, cap){
    var vals = ch.slots.map(function(_, i){ return allowed(ch, i); }), n = ch.order.length, kids = {}, shown = 0;
    (function rec(path, used, k){
      if (k === n) { shown++; return; }
      var si = ch.order[k], tr = tracked(ch, si), av = vals[si].filter(function(v){ return !(tr && used.indexOf(v.id) >= 0); });
      var arr = kids[path.join(",")] = [];
      for (var i = 0; i < av.length; i++) {
        if (shown >= cap) { arr.push({ id:"_more", t:"…", more:av.length - i }); return; }
        arr.push({ id:av[i].id, t:av[i].t });
        rec(path.concat([av[i].id]), tr ? used.concat([av[i].id]) : used, k + 1);
      }
    })([], [], 0);
    return { kids:kids, shown:shown };
  }
  function outcomes(ch, cap){
    var vals = ch.slots.map(function(_, i){ return allowed(ch, i); }), n = ch.order.length, out = [], cur = [];
    (function rec(used, k){
      if (out.length >= cap) return;
      if (k === n) { out.push(cur.slice()); return; }
      var si = ch.order[k], tr = tracked(ch, si);
      vals[si].forEach(function(v){ if (out.length >= cap || (tr && used.indexOf(v.id) >= 0)) return; cur[si] = v; rec(tr ? used.concat([v.id]) : used, k + 1); });
    })([], 0);
    return out;
  }
  function text(ch, vals){ var items = ch.slots.some(function(s){ return s.type === "I"; }); return vals.map(function(v){ return v ? v.t : "?"; }).join(items ? " · " : ""); }
  function label(ch, i, id){ var p = pool(ch, i); for (var k = 0; k < p.length; k++) if (p[k].id === id) return p[k]; return { id:id, t:id }; }
  function poolBar(ch, i, hatch){
    var s = ch.slots[i], p = pool(ch, i), ok = allowed(ch, i).map(function(v){ return v.id; }), idx = [];
    p.forEach(function(v, j){ if (ok.indexOf(v.id) >= 0) idx.push(j); });
    var hset = {}; hatch = Math.max(0, Math.min(idx.length, hatch | 0)); idx.slice(idx.length - hatch).forEach(function(j){ if (hatch) hset[j] = 1; });
    return '<div class="cc-pool t' + s.type + '" aria-hidden="true">' + p.map(function(v, j){ var c = ok.indexOf(v.id) < 0 ? "x" : hset[j] ? "u" : "a"; return '<i class="' + c + '">' + (s.type === "D" ? v.t : "") + "</i>"; }).join("") + "</div>";
  }
  function poolText(s){ var n = nOf(s); return s.type === "L" ? (n > 1 ? "A–" + AZ[n - 1] : "A") : s.type === "D" ? (n > 1 ? "0–" + (n - 1) : "0") : String(n); }
  function ui(host, o){
    var pvNow = {};
    host.classList.add("cc-host");
    function render(pv){
      pv = pv || pvNow; pvNow = pv;
      var ch = o.chain(), L = (o.lock && o.lock()) || {}, a = analyse(ch), n = ch.slots.length;
      host.style.setProperty("--cc-c", n <= 5 ? n : Math.ceil(n / 2)); host.style.setProperty("--cc-cm", Math.min(n, 4));
      var h = '<div class="cc-slots">' + ch.slots.map(function(s, i){
        var st = a.bySlot[i], k = st.k, rev = !pv.hide || (pv.shown != null && k < pv.shown);
        var hatching = pv.hatch && pv.hatch[i] != null, hatch = hatching ? Math.min(pv.hatch[i], st.sub) : st.sub;
        var cnt = rev ? st.base - hatch : "?", warn = rev && st.dep.length > 0, r = rOf(s), nm = s.name;
        var aria = nm + ", counted " + ordinal(k + 1) + ": " + (rev ? cnt + " choice" + (cnt === 1 ? "" : "s") : "count hidden") + (r ? ", " + RNAME[r] : "") +
          (rev && st.sub ? ", " + st.sub + " already used by earlier slots" : "") + (warn ? ". Warning: this count depends on the " + lc(ch.slots[st.dep[0]].name) + " choice" : "");
        var x = '<div class="cc-slot' + (warn ? " warn" : "") + (pv.hi === i ? " hi" : "") + '" role="group" aria-label="' + MV.esc(aria) + '">';
        x += '<div class="cc-ord">' + (L.order ? "" : '<button type="button" class="cc-mv" data-k="ml' + i + '" data-mv="-1" data-s="' + i + '" aria-label="Move ' + MV.esc(lc(nm)) + ' left in the counting order"' + (k === 0 ? " disabled" : "") + '><span aria-hidden="true">◀</span></button>') +
          '<span class="cc-badge" title="Counting order">' + (k + 1) + "</span>" +
          (L.order ? "" : '<button type="button" class="cc-mv" data-k="mr' + i + '" data-mv="1" data-s="' + i + '" aria-label="Move ' + MV.esc(lc(nm)) + ' right in the counting order"' + (k === n - 1 ? " disabled" : "") + '><span aria-hidden="true">▶</span></button>') + "</div>";
        x += '<div class="cc-name">' + nm + '</div><div class="cc-n">' + cnt + (warn ? '<span class="cc-wi" aria-hidden="true">⚠</span>' : "") + "</div>";
        x += poolBar(ch, i, rev ? hatch : 0);
        if (warn) x += '<div class="cc-wt">depends on ' + lc(ch.slots[st.dep[0]].name) + "</div>";
        else if (rev && st.sub) x += '<div class="cc-ut">' + st.sub + " used earlier</div>";
        else if (L.r && r) x += '<div class="cc-ut">' + RNAME[r] + "</div>";
        if (!L.type) x += '<select class="cc-sel" data-k="ty' + i + '" data-f="type" data-s="' + i + '" aria-label="' + MV.esc(nm) + ': type">' + ["L", "D", "I"].map(function(t){ return '<option value="' + t + '"' + (s.type === t ? " selected" : "") + ">" + TNAME[t] + "</option>"; }).join("") + "</select>";
        if (!L.n) x += '<div class="cc-step"><button type="button" data-k="nd' + i + '" data-f="n" data-d="-1" data-s="' + i + '" aria-label="' + MV.esc(nm) + ': fewer choices"' + (nOf(s) <= 1 ? " disabled" : "") + '>−</button><span class="cc-pl">' + poolText(s) + '</span><button type="button" data-k="nu' + i + '" data-f="n" data-d="1" data-s="' + i + '" aria-label="' + MV.esc(nm) + ': more choices"' + (nOf(s) >= MAX[s.type] ? " disabled" : "") + ">+</button></div>";
        if (!L.r) {
          x += '<select class="cc-sel" data-k="rs' + i + '" data-f="r" data-s="' + i + '" aria-label="' + MV.esc(nm) + ': restriction">' + RESTR[s.type].map(function(q){ return '<option value="' + q + '"' + (r === q ? " selected" : "") + ">" + RNAME[q] + "</option>"; }).join("") + "</select>";
          if (r === "fixed") { var fv = allowed(ch, i)[0]; x += '<div class="cc-step"><button type="button" data-k="vd' + i + '" data-f="v" data-d="-1" data-s="' + i + '" aria-label="' + MV.esc(nm) + ': previous value">−</button><span class="cc-pl">' + fv.t + '</span><button type="button" data-k="vu' + i + '" data-f="v" data-d="1" data-s="' + i + '" aria-label="' + MV.esc(nm) + ': next value">+</button></div>'; }
        }
        return x + "</div>";
      }).join("") + "</div>";
      MV.keepFocus(host, function(){ host.innerHTML = h; });
    }
    host.addEventListener("click", function(e){
      var b = e.target.closest("button"); if (!b || b.disabled || b.dataset.s == null) return;
      var ch = o.chain(), i = +b.dataset.s, s = ch.slots[i]; if (!s) return;
      if (b.dataset.mv) { var k = ch.order.indexOf(i), j = k + +b.dataset.mv; if (j < 0 || j >= ch.order.length) return; ch.order[k] = ch.order[j]; ch.order[j] = i; o.onChange("order", i); return; }
      if (b.dataset.f === "n") { s.n = Math.max(1, Math.min(MAX[s.type], nOf(s) + +b.dataset.d)); s.v = Math.min(s.v | 0, s.n - 1); o.onChange("n", i); return; }
      if (b.dataset.f === "v") { var m = nOf(s); s.v = (((s.v | 0) + +b.dataset.d) % m + m) % m; o.onChange("v", i); }
    });
    host.addEventListener("change", function(e){
      var t = e.target; if (!t.dataset || !t.dataset.f || t.dataset.s == null) return;
      var ch = o.chain(), i = +t.dataset.s, s = ch.slots[i]; if (!s) return;
      if (t.dataset.f === "type") { s.type = t.value; s.n = DEF[s.type]; s.r = ""; s.v = 0; }
      else if (t.dataset.f === "r") { s.r = t.value; s.v = s.r === "fixed" ? (s.type === "D" ? Math.min(9, nOf(s) - 1) : 0) : 0; }
      o.onChange(t.dataset.f, i);
    });
    return { render:render };
  }
  return { allowed:allowed, analyse:analyse, trueCount:trueCount, tree:tree, outcomes:outcomes, text:text, label:label, ui:ui, rOf:rOf, RNAME:RNAME, MAX:MAX };
})();

// ---------- chain helpers ----------
function slotI(n, name, labels){ return { type:"I", n:n, r:"", v:0, name:name, labels:labels || null }; }
function slotL(name){ return { type:"L", n:26, r:"", v:0, name:name }; }
function slotD(name){ return { type:"D", n:10, r:"", v:0, name:name }; }
function mkChain(slots, rep){ return { slots:slots, rep:rep || { L:true, D:true }, order:slots.map(function(_, i){ return i; }) }; }
function goodChain(c){
  if (!c || !Array.isArray(c.slots) || !c.slots.length || !c.rep || !Array.isArray(c.order) || c.order.length !== c.slots.length) return false;
  var seen = {}; for (var i = 0; i < c.order.length; i++) { var v = c.order[i]; if (typeof v !== "number" || v < 0 || v >= c.slots.length || seen[v]) return false; seen[v] = 1; }
  return c.slots.every(function(s){ return s && (s.type === "L" || s.type === "D" || s.type === "I"); });
}
var SCEN = {
  cafe:{ t:"Café meal", note:"3 sandwiches, 4 drinks and 2 desserts.", make:function(){ return mkChain([slotI(3, "Sandwich", ["Ham", "Egg", "Veg"]), slotI(4, "Drink", ["Milk", "Juice", "Tea", "Water"]), slotI(2, "Dessert", ["Cookie", "Fruit"])]); } },
  plate:{ t:"Ontario licence plate", note:"4 letters, then 3 digits.", make:function(){ return mkChain([slotL("Letter 1"), slotL("Letter 2"), slotL("Letter 3"), slotL("Letter 4"), slotD("Digit 1"), slotD("Digit 2"), slotD("Digit 3")]); } },
  lock:{ t:"Bike lock", note:"3 dials, each 0–9.", make:function(){ return mkChain([slotD("Dial 1"), slotD("Dial 2"), slotD("Dial 3")]); } },
  pass:{ t:"Password", note:"2 letters, then 2 digits.", make:function(){ return mkChain([slotL("Letter 1"), slotL("Letter 2"), slotD("Digit 1"), slotD("Digit 2")]); } },
  num:{ t:"Number builder", note:"Three-digit numbers. Use each digit’s restriction menu, the switches and the counting order.", make:function(){ return mkChain([slotD("Hundreds"), slotD("Tens"), slotD("Units")]); } }
};
var SCEN_ORDER = ["cafe", "plate", "lock", "pass", "num"];
var SOUPS = ["Tomato soup", "Lentil soup", "Corn soup"], SANDS = ["Ham sandwich", "Egg sandwich", "Veg sandwich", "Tuna sandwich"];
var STOPWATCH = '<svg class="cc-sw-ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="13.5" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 13.5V9M9.5 2.5h5M12 2.5v3M18.5 6.5l1.6-1.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

// ---------- Explore: the Choice chain ----------
function explore(host, api){
  var S = api.S;
  if (["build", "scen", "list"].indexOf(S.mode) < 0) S.mode = "build";
  if (!goodChain(S.build)) S.build = mkChain([slotI(3, "Stage 1"), slotI(4, "Stage 2")]);
  if (!SCEN[S.scen]) S.scen = "cafe";
  S.sc = S.sc && typeof S.sc === "object" ? S.sc : {};
  Object.keys(S.sc).forEach(function(k){ if (!SCEN[k] || !goodChain(S.sc[k])) delete S.sc[k]; });
  if (S.src !== "scen") S.src = "build";
  var pv = {}, anim = null, race = null;
  host.innerHTML =
    '<div class="cc-top"><div id="cc-modes"></div><div id="cc-scen" class="cc-scen"><div id="cc-scen-r"></div><p class="tiny muted cc-note" id="cc-scen-note"></p></div><p class="tiny muted cc-note" id="cc-src" hidden></p></div>' +
    '<div class="pg cc-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap cc-cap" id="cc-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="cc-menus" class="cc-menus" hidden></div><div id="cc-slots"></div><div id="cc-treewrap"><p class="tiny muted cc-tnote" id="cc-tnote"></p><div id="cc-tree"></div></div><div id="cc-list" hidden></div></div>' +
    '<div class="pg-ctrl"><div class="cc-sws" id="cc-sws"></div><div class="cc-bld" id="cc-bld"><button type="button" class="btn sm" id="cc-add">Add a stage</button><button type="button" class="btn ghost sm" id="cc-rem">Remove the last stage</button></div>' +
      '<p class="tiny muted cc-how">Each slot’s small number is its counting order. Use ◀ and ▶ to count a slot earlier or later; the positions don’t move.</p></div>' +
    '<div class="pg-read"><dl class="read" id="cc-read" aria-live="polite"></dl></div></div>';
  var slotsHost = $("#cc-slots", host), treeHost = $("#cc-tree", host), listHost = $("#cc-list", host);
  var tree = treeDiagram(treeHost, { tap:false, orient:"auto", maxH:430, minLeaf:58, label:"Tree diagram of the chain", children:function(){ return []; } });
  var treeData = null, lastSig = "";
  var slotsUI = D3.ui(slotsHost, { chain:chain, lock:locks, onChange:function(){ user(); save(); render(); MV.changed(); } });

  // --- controls ---
  var modeR = radios($("#cc-modes", host), { label:"Mode", options:[{ id:"build", t:"Build" }, { id:"scen", t:"Scenarios" }, { id:"list", t:"List vs multiply" }], value:S.mode, cls:"seg",
    onChange:function(v){ user(); S.mode = v; if (v !== "list") S.src = v; save(); render(); MV.changed(); } });
  var scenR = radios($("#cc-scen-r", host), { label:"Scenario", options:SCEN_ORDER.map(function(k){ return { id:k, t:SCEN[k].t }; }), value:S.scen, cls:"chips",
    onChange:function(v){ user(); S.scen = v; S.src = "scen"; save(); render(); MV.changed(); } });
  $("#cc-sws", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-rep]"); if (!b || b.disabled) return;
    user(); var ch = chain(), t = b.dataset.rep; ch.rep[t] = !ch.rep[t]; save();
    if (!ch.rep[t]) dimAnim(t); else { render(); MV.changed(); }
  });
  $("#cc-add", host).addEventListener("click", function(){ user(); var c = S.build; if (c.slots.length >= 5) return; c.slots.push(slotI(3, "")); c.order.push(c.slots.length - 1); nameBuild(); save(); render(); MV.changed(); });
  $("#cc-rem", host).addEventListener("click", function(){ user(); var c = S.build; if (c.slots.length <= 1) return; var last = c.slots.length - 1; c.slots.pop(); c.order = c.order.filter(function(x){ return x !== last; }); save(); render(); MV.changed(); });
  listHost.addEventListener("click", function(e){ if (e.target.closest("#cc-race-go")) { user(); runRace(); } });

  function save(){ api.save(); }
  function src(){ return S.mode === "list" ? S.src : S.mode; }
  function scChain(id){ if (!goodChain(S.sc[id])) S.sc[id] = SCEN[id].make(); return S.sc[id]; }
  function chain(){ return src() === "scen" ? scChain(S.scen) : S.build; }
  function locks(){ return src() === "build" ? {} : { type:true, n:true, r:S.scen !== "num", order:false }; }
  function nameBuild(){ S.build.slots.forEach(function(s, i){ s.name = "Stage " + (i + 1); s.labels = null; }); }
  function user(){ cancelAnim(); if (pv.menus || pv.hide) { pv = {}; } MV.banner("", ""); }

  // --- animation bookkeeping (predictions and the dimming storyboard); any user action cancels and finishes it ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], stops:[], fin:fin || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function endAnim(){ var a = anim; anim = null; if (a && a.fin) { var f = a.fin; a.fin = null; f(); } }
  function cancelAnim(){
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} });
    pv = {}; tree.reveal(null);
    if (a.fin) { var f = a.fin; a.fin = null; f(); }
    render(); MV.changed();
  }
  // storyboard: switching repetition off dims one more value in each later slot of that type
  function dimAnim(t){
    var ch = chain(), a = D3.analyse(ch), hit = a.steps.filter(function(s){ return ch.slots[s.slot].type === t && s.sub > 0; });
    if (!hit.length || MV.reduceMotion) { render(); MV.changed(); return; }
    newAnim(null); pv = { hatch:{} }; hit.forEach(function(s){ pv.hatch[s.slot] = 0; }); render();
    var step = 0, maxSub = Math.max.apply(null, hit.map(function(s){ return s.sub; }));
    (function tick(){ step++; hit.forEach(function(s){ pv.hatch[s.slot] = Math.min(s.sub, step); }); render({ noTree:step < maxSub });
      if (step < maxSub) later(380, tick); else later(200, function(){ pv = {}; render(); MV.changed(); endAnim(); }); })();
  }

  // --- painting ---
  function render(o){
    o = o || {};
    var mode = S.mode, s = src(), menusOnly = pv.menus === "split" || pv.menus === "merging";
    modeR.set(mode); scenR.set(S.scen);
    $("#cc-scen", host).hidden = mode !== "scen";
    $("#cc-scen-note", host).textContent = SCEN[S.scen].t + ": " + SCEN[S.scen].note;
    var sn = $("#cc-src", host); sn.hidden = mode !== "list"; sn.textContent = "Listing the chain from " + (s === "scen" ? "the " + SCEN[S.scen].t + " scenario" : "Build mode") + ". Change it here or in that mode.";
    paintMenus();
    slotsHost.hidden = menusOnly;
    if (!menusOnly) slotsUI.render(pv);
    $("#cc-treewrap", host).hidden = mode === "list" || menusOnly;
    listHost.hidden = mode !== "list" || menusOnly;
    if (mode !== "list" && !menusOnly && !o.noTree) paintTree();
    if (mode === "list" && !menusOnly && !o.noList) runRace();
    if (mode !== "list") stopRace();
    paintCtrl(); paintRead(); paintCap();
  }
  function paintCtrl(){
    var ch = chain(), has = { L:false, D:false };
    ch.slots.forEach(function(sl){ if (sl.type !== "I") has[sl.type] = true; });
    var box = $("#cc-sws", host);
    MV.keepFocus(box, function(){
      box.innerHTML = [["L", "Letters may repeat"], ["D", "Digits may repeat"]].map(function(x){
        var on = !!ch.rep[x[0]];
        return '<button type="button" class="cc-switch" role="switch" aria-checked="' + on + '" data-rep="' + x[0] + '" data-k="rep' + x[0] + '"' + (has[x[0]] ? "" : ' disabled title="No ' + (x[0] === "L" ? "letter" : "digit") + ' slots in this chain"') + '><span class="cc-track" aria-hidden="true"><span class="cc-knob"></span></span>' + x[1] + "</button>";
      }).join("");
    });
    var b = src() === "build" && pv.menus !== "split" && pv.menus !== "merging";
    $("#cc-bld", host).hidden = !b;
    $("#cc-add", host).disabled = S.build.slots.length >= 5; $("#cc-rem", host).disabled = S.build.slots.length <= 1;
  }
  // factors as shown right now (a dimming animation shows each later slot losing its used values one at a time)
  function shownFactors(a){ return a.steps.map(function(st){ return pv.hatch && pv.hatch[st.slot] != null ? st.base - Math.min(st.sub, pv.hatch[st.slot]) : st.count; }); }
  function factorText(a, upto){ var f = shownFactors(a); return f.slice(0, upto == null ? f.length : upto).join(" × "); }
  function shownProduct(a){ return shownFactors(a).reduce(function(p, c){ return p * c; }, 1); }
  function total(ch, a){ return a.ok ? a.product : D3.trueCount(ch); }
  function badMsg(ch, a){ return "The " + lc(ch.slots[a.bad.slot].name) + " count depends on the " + lc(ch.slots[a.bad.on].name) + " choice: change the fill order."; }
  function paintCap(){
    var cap = $("#cc-cap", host), ch = chain(), a = D3.analyse(ch), f = a.factors, P = shownProduct(a);
    cap.classList.toggle("long", f.length > 4);
    if (pv.menus === "split" || pv.menus === "merging") { cap.textContent = "Lunches = ?"; return; }
    if (pv.menus === "merged") { cap.textContent = "3 + 4 = 7"; return; }
    if (pv.hide) { var k = pv.shown || 0; cap.textContent = k ? factorText(a, k) + (k === f.length ? " = " + big(P) : " × …") : "?"; return; }
    cap.textContent = f.length > 1 ? factorText(a) + " = " + big(P) + (a.ok ? "" : " ⚠") : big(P) + " choice" + (P === 1 ? "" : "s");
  }
  function paintRead(){
    var ch = chain(), a = D3.analyse(ch), hide = !!pv.hide || pv.menus === "split" || pv.menus === "merging", tc = a.ok || hide ? null : D3.trueCount(ch);
    var rows = [["Product (counting order)", hide ? "?" : factorText(a)]];
    rows.push(["Total", hide ? "?" : "<strong>" + big(shownProduct(a)) + "</strong>" + (a.ok ? "" : ' <span class="cc-bad">not a valid count</span>')]);
    var rep = [];
    if (ch.slots.some(function(s){ return s.type === "L"; })) rep.push("Letters: " + (ch.rep.L ? "repeats allowed" : "no repeats"));
    if (ch.slots.some(function(s){ return s.type === "D"; })) rep.push("Digits: " + (ch.rep.D ? "repeats allowed" : "no repeats"));
    rows.push(["Repetition", rep.length ? rep.join(" · ") : "Items only: each stage has its own choices"]);
    if (S.mode !== "list") {
      var T = treeData, tot = hide ? null : a.ok ? a.product : tc;
      rows.push(["Leaves shown", hide || !T ? "?" : (tot != null && T.shown >= tot ? "All " + big(tot) : "First " + T.shown + (tot != null ? " of " + big(tot) : ""))]);
    }
    rows.push(["Counting check", hide ? "?" : a.ok ? "Each slot’s count is the same whatever was chosen before <span class=\"cc-ok\">✓</span>" :
      '<span class="cc-bad">✗</span> ' + badMsg(ch, a) + (tc != null && tc !== a.product ? " <span class=\"muted\">(Listing every outcome gives " + big(tc) + ", not " + big(a.product) + ".)</span>" : "")]);
    $("#cc-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function leafW(ch){ var o = D3.outcomes(ch, 1)[0]; var len = o ? D3.text(ch, o).length : 4; return Math.min(190, Math.max(74, 18 + 8.6 * Math.max(len, 8))); }
  function paintTree(){
    var ch = chain(), T = D3.tree(ch, 60); treeData = T;
    tree.set({ stages:ch.order.map(function(si){ return { name:ch.slots[si].name, branches:[] }; }),
      children:function(p){ return T.kids[p.join(",")] || []; },
      leafText:function(p){
        if (p[p.length - 1] === "_more") { var par = T.kids[p.slice(0, -1).join(",")] || [], m = par.length ? par[par.length - 1].more : 0; return "+" + m + " more"; }
        if (p.length < ch.order.length) return "none left";
        var vals = []; p.forEach(function(id, k){ vals[ch.order[k]] = D3.label(ch, ch.order[k], id); }); return D3.text(ch, vals);
      },
      leafW:leafW(ch), minLeaf:leafW(ch) + 6, colW:ch.slots.some(function(s){ return s.type === "I"; }) ? 96 : 64,
      label:"Tree diagram: one level per slot, in counting order. " + (T.shown) + " outcomes shown." });
    tree.reveal(pv.rev == null ? null : pv.rev); tree.render();
    // a new chain (or a reveal starting) scrolls the root into view: big trees are taller than their box
    var sig = JSON.stringify([ch.slots.map(function(x){ return [x.type, x.n, x.r, x.v]; }), ch.rep, ch.order]);
    if (sig !== lastSig || pv.rev === 0) {
      lastSig = sig;
      var rt = treeHost.querySelector(".d1-root"), sc = treeHost.querySelector(".d1-scroll");
      if (rt && sc) sc.scrollTop = Math.max(0, parseFloat(rt.style.top) - sc.clientHeight / 2);
    }
    $("#cc-tnote", host).textContent = "Tree: one level per slot, in counting order. Up to 60 leaves are drawn; “…” stands for the rest.";
  }

  // --- List vs multiply (A2.1): the full list for totals up to 24, raced against the multiplication steps ---
  function stopRace(){ if (race && race.t) clearTimeout(race.t); race = null; }
  function runRace(){
    stopRace();
    var ch = chain(), a = D3.analyse(ch), N = total(ch, a), f = a.factors, m = Math.max(0, f.length - 1);
    var list = N != null && N <= 24 ? D3.outcomes(ch, 24) : null, steps = [], acc = f[0];
    for (var k = 1; k < f.length; k++) { steps.push(big(acc) + " × " + f[k] + " = " + big(acc * f[k])); acc *= f[k]; }
    var cap = list ? list.length : Math.min(24, N == null ? 24 : N);
    var html = '<div class="cc-race"><div class="cc-race-h">' + STOPWATCH + '<strong>List vs multiply</strong></div>' +
      '<div class="cc-lane"><span class="cc-lab">Listing</span><span class="cc-bar"><i id="cc-bl"></i></span><span class="cc-ct" id="cc-cl"></span></div>' +
      '<div class="cc-lane"><span class="cc-lab">Multiplying</span><span class="cc-bar"><i id="cc-bm"></i></span><span class="cc-ct" id="cc-cm"></span></div>' +
      '<p class="cc-race-sum" id="cc-rsum" aria-live="polite"></p></div>' +
      '<div class="cc-lv"><h4>Multiplying</h4><ol class="cc-msteps" id="cc-ms">' + (steps.length ? steps.map(function(s, i){ return '<li data-i="' + i + '">' + s + "</li>"; }).join("") : "<li>One stage: nothing to multiply</li>") + "</ol>" +
      (a.ok ? "" : '<p class="cc-bad">The counting check fails, so the product isn’t the true count' + (N != null ? " (" + big(N) + ")" : "") + ".</p>") +
      '<h4>' + (list ? "The full list (" + list.length + ")" : "The list") + '</h4>' +
      (list ? '<ol class="cc-items" id="cc-items">' + list.map(function(o, i){ return '<li data-i="' + i + '">' + D3.text(ch, o) + "</li>"; }).join("") + "</ol>" :
        '<p class="cc-too">' + (N == null ? "Too many outcomes to list here." : big(N) + " outcomes: too many to list here. The full list appears only for totals up to 24.") + "</p>") +
      '<div class="q-actions"><button type="button" class="btn ghost sm" id="cc-race-go" data-k="racego">Race again</button></div></div>';
    MV.keepFocus(listHost, function(){ listHost.innerHTML = html; });
    var r = race = { li:0, mi:0, t:null };
    var items = $$("#cc-items li", listHost), ms = $$("#cc-ms li", listHost);
    function paint(){
      items.forEach(function(el, i){ el.classList.toggle("on", i < r.li); });
      ms.forEach(function(el, i){ el.classList.toggle("on", i < r.mi || !steps.length); });
      $("#cc-bl", listHost).style.width = (N ? Math.min(1, r.li / (list ? list.length : N)) * 100 : 0) + "%";
      $("#cc-bm", listHost).style.width = (m ? r.mi / m * 100 : 100) + "%";
      $("#cc-cl", listHost).textContent = r.li + " item" + (r.li === 1 ? "" : "s") + (list || N == null ? "" : " of " + big(N));
      $("#cc-cm", listHost).textContent = r.mi + " step" + (r.mi === 1 ? "" : "s");
      var doneL = list && r.li >= list.length, doneM = r.mi >= m;
      $("#cc-rsum", listHost).textContent = doneL && doneM ? "Listing: " + list.length + " item" + (list.length === 1 ? "" : "s") + "; multiplying: " + m + " step" + (m === 1 ? "" : "s") + "." :
        !list && r.li >= cap && doneM ? "Listing: " + big(r.li) + " items so far, " + (N == null ? "many" : big(N - r.li)) + " to go; multiplying: done in " + m + " step" + (m === 1 ? "" : "s") + "." : "";
    }
    if (MV.reduceMotion) { r.li = cap; r.mi = m; paint(); return; }
    paint();
    (function tick(){ if (race !== r) return; if (r.li < cap) r.li++; if (r.mi < m) r.mi++; paint(); if (r.li < cap || r.mi < m) r.t = setTimeout(tick, 150); })();
  }

  // --- P4: two menus merge into one ---
  function paintMenus(){
    var box = $("#cc-menus", host), m = pv.menus;
    box.hidden = !m; if (!m) { box.innerHTML = ""; return; }
    if (m === "merged") {
      box.innerHTML = '<div class="cc-mn merged"><div class="cc-mcol"><h4>Lunch: one item from 7</h4><ol>' + SOUPS.concat(SANDS).map(function(x, i){ return '<li style="animation-delay:' + (i * 90) + 'ms">' + x + "</li>"; }).join("") + "</ol></div></div>" +
        '<p class="cc-mnote">You choose <strong>one</strong> lunch, so the menus join into a single stage: 3 + 4 = 7 choices.</p>';
      return;
    }
    if (box.querySelector(".cc-mn:not(.merged)")) { box.querySelector(".cc-mn").classList.toggle("merging", m === "merging"); return; }
    box.innerHTML = '<div class="cc-mn' + (m === "merging" ? " merging" : "") + '"><div class="cc-mcol a"><h4>Soup menu (3)</h4><ul>' + SOUPS.map(function(x){ return "<li>" + x + "</li>"; }).join("") + '</ul></div><span class="cc-or">or</span><div class="cc-mcol b"><h4>Sandwich menu (4)</h4><ul>' + SANDS.map(function(x){ return "<li>" + x + "</li>"; }).join("") + "</ul></div></div>";
  }

  // --- start ---
  render();

  // --- predictions ---
  function startPred(p){
    cancelAnim(); stopRace(); pv = {};
    var s = p.start || {};
    if (s.mode === "scen") {
      S.mode = "scen"; S.src = "scen"; S.scen = s.scen;
      var c = S.sc[s.scen] = SCEN[s.scen].make(); if (s.repD != null) c.rep.D = !!s.repD;
      pv = { hide:true, shown:0, rev:0 };
    } else { S.mode = "build"; S.src = "build"; pv = { menus:"split", hide:true }; }
    save(); render();
  }
  function runPred(p, done){
    var a0 = newAnim(done);
    if (p.id === "p4") {
      pv.menus = "merging"; paintMenus();
      later(MV.reduceMotion ? 0 : 1100, function(){
        S.build = mkChain([slotI(7, "Lunch", SOUPS.concat(SANDS))]); save();
        pv = { menus:"merged" }; render(); MV.changed(); later(500, endAnim);
      });
      return;
    }
    var ch = chain(), a = D3.analyse(ch), D = ch.order.length;
    var stop = tree.grow(0, D, function(){ if (anim !== a0) return; pv = {}; render(); MV.changed(); later(150, endAnim); }, function(lvl){
      var st = a.steps[lvl]; pv.rev = lvl; pv.hi = st.slot; pv.shown = lvl + 1;
      if (st.sub > 0 && !MV.reduceMotion) {
        pv.hatch = {}; pv.hatch[st.slot] = 0; render({ noTree:true });
        for (var q = 1; q <= st.sub; q++) (function(q){ later(q * 300, function(){ pv.hatch[st.slot] = q; render({ noTree:true }); }); })(q);
      } else { pv.hatch = null; render({ noTree:true }); }
    });
    a0.stops.push(stop);
  }

  return {
    predict:{ start:startPred, run:runPred },
    challenge:function(id){ return chal(id); }
  };

  function chal(id){
    var ch = chain(), a = D3.analyse(ch), sc = src() === "scen";
    if (id === "tc1") {
      if (a.factors.length !== 3) return { ok:false, msg:"Use three stages." };
      if (a.factors.some(function(c){ return c < 2; })) return { ok:false, msg:"Each stage needs at least 2 choices." };
      if (!a.ok) return { ok:false, msg:badMsg(ch, a) };
      if (a.product !== 60) return { ok:false, msg:"Your product is " + big(a.product) + "." };
      return { ok:true };
    }
    if (id === "tc2") {
      if (!sc || S.scen !== "pass") return { ok:false, msg:"Open Scenarios and choose Password first." };
      var L = !!ch.rep.L, Dg = !!ch.rep.D;
      if (!L && Dg) return { ok:true };
      if (!L && !Dg) return { ok:false, msg:"26 × 25 × 10 × 9 = 58 500." };
      if (L && Dg) return { ok:false, msg:"26 × 26 × 10 × 10 = 67 600." };
      return { ok:false, msg:"26 × 26 × 10 × 9 = 60 840." };
    }
    if (id === "tc3") {
      if (!sc || S.scen !== "num") return { ok:false, msg:"Open Scenarios and choose Number builder first." };
      var H = ch.slots[0], T = ch.slots[1], U = ch.slots[2], ord = ch.order.join("");
      if (ch.rep.D) return { ok:false, msg:"No repeated digits: switch “Digits may repeat” off." };
      if (D3.rOf(U) !== "odd") return { ok:false, msg:a.product === 648 ? "648 counts all three-digit numbers with no repeats." : "An odd number ends in an odd digit: set the units to “odd only”." };
      if (!a.ok) return { ok:false, msg:ord === "012" ? "The units count depends on whether the hundreds digit was odd. Count the units first." : badMsg(ch, a) };
      if (D3.rOf(H) !== "not0") return { ok:false, msg:a.bySlot[0].count === 9 ? "The hundreds digit can’t be 0 <strong>or</strong> the odd digit already used: 8 choices." : "The hundreds digit can be any digit except 0 (and the digit already used): set it to “not 0”." };
      if (D3.rOf(T)) return { ok:false, msg:"The tens digit has no restriction of its own: set it back to “no restriction”." };
      if (ord === "201" && a.product === 320) return { ok:true };
      return { ok:false, msg:"Your total is " + big(a.product) + ". Count the units first, then the hundreds, then the tens." };
    }
    return { ok:false };
  }
}

// ---------- hero: café board, a tree that triples, quadruples and doubles, then shrinks into three slots ----------
function hero(f){
  var svg = $("#fcp-svg"), stage = $(".fcp-stage"), slots = $("#fcp-slots"), board = $$(".fcp-b"), cap = f.cap;
  if (!svg) return;
  var Y = [14, 64, 114, 162], L3 = [], L2 = [], L1 = [], root = { x:180, y:Y[0] }, i;
  for (i = 0; i < 24; i++) L3.push({ x:7.5 + 15 * i, y:Y[3], p:Math.floor(i / 2) });
  for (i = 0; i < 12; i++) L2.push({ x:(L3[2 * i].x + L3[2 * i + 1].x) / 2, y:Y[2], p:Math.floor(i / 4) });
  for (i = 0; i < 3; i++) L1.push({ x:(L2[4 * i].x + L2[4 * i + 3].x) / 2, y:Y[1] });
  var levels = [L1.map(function(n){ return [root, n]; }), L2.map(function(n){ return [L1[n.p], n]; }), L3.map(function(n){ return [L2[n.p], n]; })];
  var r1 = function(v){ return Math.round(v * 10) / 10; };
  function draw(lvl, t){
    var h = "", dots = '<circle class="fcp-root" cx="' + root.x + '" cy="' + root.y + '" r="5"/>';
    levels.forEach(function(L, k){
      var f2 = k < lvl ? 1 : k === lvl ? t : 0; if (f2 <= 0) return;
      L.forEach(function(e){ var a = e[0], b = e[1], x = a.x + (b.x - a.x) * f2, y = a.y + (b.y - a.y) * f2; h += "M" + r1(a.x) + " " + r1(a.y) + "L" + r1(x) + " " + r1(y);
        if (f2 >= 1) dots += '<circle class="' + (k === 2 ? "fcp-leaf" : "fcp-node") + '" cx="' + r1(b.x) + '" cy="' + r1(b.y) + '" r="' + (k === 2 ? 4 : 3.5) + '"/>'; });
    });
    svg.innerHTML = '<path class="fcp-e" d="' + h + '"/>' + dots;
  }
  var CAPS = ["3 sandwiches: 3 branches", "Each sandwich splits into 4 drinks: 3 × 4 = 12 leaves", "Each meal splits into 2 desserts: 3 × 4 × 2 = 24 leaves", "Multiply the choices: 3 × 4 × 2 = 24"];
  function lightBoard(k){ board.forEach(function(b, j){ b.classList.toggle("on", j === k); b.classList.toggle("was", j < k); }); }
  function last(){ draw(3, 1); lightBoard(3); stage.classList.add("shrunk"); slots.classList.add("on"); cap.textContent = CAPS[3]; }
  if (MV.reduceMotion) { last(); return; }
  draw(0, 0);
  function grow(k, done){ lightBoard(k); cap.textContent = CAPS[k]; MV.tween({ dur:900, ease:function(x){ return x; }, step:function(x){ draw(k, x); }, done:done }); }
  MV.wait(600, function(){ grow(0, function(){ MV.wait(900, function(){ grow(1, function(){ MV.wait(1000, function(){ grow(2, function(){ MV.wait(1500, function(){ last(); }); }); }); }); }); }); });
}

// ---------- Part 3: Multiply or add? ----------
var PASTA = { pa:{ t:"Pasta", kids:[["to", "Tomato"], ["cr", "Cream"]] }, pz:{ t:"Pizza", kids:[["ch", "Cheese"], ["mu", "Mushroom"], ["pe", "Pepper"]] } };
var DRINKS = [["mi", "Milk"], ["ju", "Juice"], ["wa", "Water"], ["te", "Tea"]];
function part3(host, api){
  var S = api.S, P = api.content || {};
  S.st = ["1", "2", "3"].indexOf(S.st) >= 0 ? S.st : "1"; S.s2 = S.s2 || {}; S.s3 = S.s3 || {};
  host.innerHTML = '<div id="wm-st" class="wm-st"></div>' +
    '<div class="wm-station" data-st="1"><h3>Station 1: “and then” or “or”?</h3><p>Six scenario cards. Sort each one into <strong>Multiply</strong> or <strong>Add</strong>. The feedback names the word that decides.</p><div id="wm-sort"></div></div>' +
    '<div class="wm-station" data-st="2"><div class="sym"><div><div id="wm-tree2"></div><div class="q-actions"><button type="button" class="btn sm" id="wm-try">Try 2 × 3 × 4</button><button type="button" class="btn sm" id="wm-cases">Count by cases</button><button type="button" class="btn primary sm" id="wm-list2">Check it by listing</button></div></div>' +
      '<div><h3>Station 2: unequal branches</h3><p>Choose pasta (2 sauces) or pizza (3 toppings), then a drink (4).</p><dl class="read" id="wm-read2" aria-live="polite"></dl>' +
      '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines"><span>Pasta case: 2 × 4 = 8</span><span>Pizza case: 3 × 4 = 12</span><span>8 + 12 = 20 = (2 + 3) × 4 <small>“Or” adds the cases; “then a drink” multiplies.</small></span><span><small>2 × 3 × 4 = 24 would need every main to split into 2 <strong>and then</strong> 3. Pasta and pizza split differently, so there’s no single count to multiply by.</small></span></div></details></div></div></div>' +
    '<div class="wm-station" data-st="3"><div class="sym"><div><div id="wm-tree3"></div><div class="q-actions"><button type="button" class="btn primary sm" id="wm-list3">List them</button><button type="button" class="btn ghost sm" id="wm-clear3">Clear the list</button></div></div>' +
      '<div><h3>Station 3: check it by listing</h3><p>Two-digit codes from the digits 1, 2 and 3, with no repeats.</p><div class="wm-codes" id="wm-codes" aria-live="polite"></div><dl class="read" id="wm-read3"></dl>' +
      '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines"><span>First digit: 3 choices</span><span>Second digit: 2 choices (not the first digit)</span><span>3 × 2 = 6 <small>The list has 3 groups of 2, one group for each first digit.</small></span></div></details></div></div></div>';
  radios($("#wm-st", host), { label:"Station", options:[{ id:"1", t:"1. “And then” or “or”?" }, { id:"2", t:"2. Unequal branches" }, { id:"3", t:"3. Check it by listing" }], value:S.st, cls:"chips",
    onChange:function(v){ S.st = v; api.save(); showSt(); } });
  function showSt(){ $$(".wm-station", host).forEach(function(d){ d.hidden = d.dataset.st !== S.st; }); t2.render(); t3.render(); }

  // station 1: the toolkit's K12 sorter with the plan's six cards (state in MV.S.sort.p3sort)
  try { if (P.sort && MV.activityTypes && MV.activityTypes.sorter) MV.activityTypes.sorter($("#wm-sort", host), P.sort); } catch (e) { console.error(e); }

  // station 2: unequal branches
  var timer2 = null, timer3 = null;
  var leaves2 = [];
  Object.keys(PASTA).forEach(function(m){ PASTA[m].kids.forEach(function(k){ DRINKS.forEach(function(d){ leaves2.push([m, k[0], d[0]].join(",")); }); }); });
  var t2 = treeDiagram($("#wm-tree2", host), { tap:false, orient:"right", maxH:520, colW:92, leafW:56, rowH:30,
    stages:[{ name:"Main", branches:[] }, { name:"Sauce or topping", branches:[] }, { name:"Drink", branches:[] }],
    children:function(p){ if (!p.length) return [{ id:"pa", t:"Pasta" }, { id:"pz", t:"Pizza" }]; if (p.length === 1) return PASTA[p[0]].kids.map(function(k){ return { id:k[0], t:k[1] }; }); if (p.length === 2) return DRINKS.map(function(d){ return { id:d[0], t:d[1] }; }); return []; },
    leafText:function(p){ var i = leaves2.indexOf(p.join(",")), n = S.s2.n || 0; return i < n ? String(i + 1) : "·"; },
    leafAria:function(p){ var i = leaves2.indexOf(p.join(",")); return "Meal " + (i + 1); },
    label:"Tree: pasta splits into 2 sauces, pizza into 3 toppings, then every meal splits into 4 drinks." });
  function paint2(){
    var m = S.s2.m || "", n = S.s2.n || 0, rows = [];
    t2.mark(m === "pasta" ? leaves2.slice(0, 8) : m === "pizza" ? leaves2.slice(8) : []); t2.render();
    rows.push(["Second stage", "Pasta splits into <strong>2</strong> sauces; pizza splits into <strong>3</strong> toppings."]);
    if (m === "try") rows.push(["Try 2 × 3 × 4 = 24?", '<span class="cc-bad">✗</span> There’s no single count for the second stage: the branches differ, so the tree doesn’t have 24 leaves.']);
    if (m === "pasta" || m === "pizza" || m === "sum") rows.push(["Pasta case", "2 × 4 = 8 meals" + (m === "pasta" ? " <span class=\"muted\">(highlighted)</span>" : "")]);
    if (m === "pizza" || m === "sum") rows.push(["Pizza case", "3 × 4 = 12 meals" + (m === "pizza" ? " <span class=\"muted\">(highlighted)</span>" : "")]);
    if (m === "sum") rows.push(["Add the cases", "<strong>8 + 12 = 20</strong>, which is (2 + 3) × 4"]);
    rows.push(["Leaves numbered", n ? n + " of 20" + (n >= 20 ? ": the list agrees with (2 + 3) × 4 = 20 ✓" : "") : '<span class="muted">Press “Check it by listing”.</span>']);
    $("#wm-read2", host).innerHTML = MV.readoutHTML(rows);
    $("#wm-cases", host).textContent = m === "pasta" ? "Next: the pizza case" : m === "pizza" ? "Next: add the cases" : "Count by cases";
  }
  $("#wm-try", host).addEventListener("click", function(){ S.s2.m = "try"; api.save(); paint2(); });
  $("#wm-cases", host).addEventListener("click", function(){ var m = S.s2.m; S.s2.m = m === "pasta" ? "pizza" : m === "pizza" ? "sum" : "pasta"; api.save(); paint2(); });
  $("#wm-list2", host).addEventListener("click", function(){
    clearTimeout(timer2); S.s2.n = 0; api.save();
    if (MV.reduceMotion) { S.s2.n = 20; api.save(); paint2(); return; }
    (function tick(){ S.s2.n++; paint2(); if (S.s2.n < 20) timer2 = setTimeout(tick, 140); else api.save(); })();
  });

  // station 3: listing two-digit codes from 1, 2, 3 with no repeats
  var CODES = ["1,2", "1,3", "2,1", "2,3", "3,1", "3,2"];
  var t3 = treeDiagram($("#wm-tree3", host), { tap:false, orient:"down", maxH:300, levelH:54,
    stages:[{ name:"First digit", branches:[] }, { name:"Second digit", branches:[] }],
    children:function(p){ if (!p.length) return ["1", "2", "3"].map(function(d){ return { id:d, t:d }; }); if (p.length === 1) return ["1", "2", "3"].filter(function(d){ return d !== p[0]; }).map(function(d){ return { id:d, t:d }; }); return []; },
    leafText:function(p){ return p.join(""); }, label:"Tree: 3 first digits, each splitting into the 2 digits left." });
  function paint3(){
    var n = S.s3.n || 0;
    t3.mark(CODES.slice(0, n)); t3.render();
    $("#wm-codes", host).innerHTML = '<div class="wm-grp">' + ["1", "2", "3"].map(function(d, g){
      return '<div class="wm-row"><span class="wm-gl">First digit ' + d + ":</span>" + CODES.slice(2 * g, 2 * g + 2).map(function(c, j){ var i = 2 * g + j; return '<span class="wm-code' + (i < n ? " on" : "") + '">' + (i < n ? c.replace(",", "") : "?") + "</span>"; }).join("") + "</div>";
    }).join("") + "</div>";
    $("#wm-read3", host).innerHTML = MV.readoutHTML([["Listed", n + " of 6 codes"], ["Multiplied", "3 × 2 = 6" + (n >= 6 ? " ✓ the list agrees" : "")]]);
  }
  $("#wm-list3", host).addEventListener("click", function(){
    clearTimeout(timer3); S.s3.n = 0;
    if (MV.reduceMotion) { S.s3.n = 6; api.save(); paint3(); return; }
    (function tick(){ S.s3.n++; paint3(); if (S.s3.n < 6) timer3 = setTimeout(tick, 420); else api.save(); })();
  });
  $("#wm-clear3", host).addEventListener("click", function(){ clearTimeout(timer3); S.s3.n = 0; api.save(); paint3(); });

  paint2(); paint3(); showSt();
  return {};
}

// @component N4 countEntry — one-box number entry for counts: whole numbers with spaces or commas ("10 000"), products and
// powers in any factor order (26 × 26, 26*26, 26x26, 26^4, 26⁴), sums that equal the answer (72 + 256); named wrong answers by
// value ({match:n}) or for any sum ({plus:true}); "fill in the factors" items (factors:true) take a product with a text keypad.
// First-try scoring like the toolkit's N4 (right on the first check and the worked solution not shown).
// activity a: {id, title, summary, prefix:"S" (item labels S1, S2, …), items:[{id, goal, prompt, answer, why, display, label,
//   placeholder, factors, star, wrong:[{match | plus, fb}], hints:[3]}]}  ->  {stats(), missed()}
var SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
function parseCount(raw){
  var s = String(raw == null ? "" : raw).trim(); if (!s) return null;
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, function(m){ return "^" + m.split("").map(function(c){ return SUP.indexOf(c); }).join(""); });
  s = s.replace(/\*\*/g, "^").replace(/[xX·•∙]/g, "×");
  var r = MV.parseNum(s);
  return r && r.length === 1 && isFinite(r[0]) ? { v:r[0], plus:/\+/.test(s) } : null;
}
function countEntry(host, api, a){
  var st = api.S; st.items = st.items || {};
  var msgs = {};
  function ist(id){ return st.items[id] || (st.items[id] = { val:"", tries:0, hint:0, solved:false, first:null }); }
  function judge(it, raw){
    var p = parseCount(raw); if (!p) return { bad:true };
    var ans = MV.ans(it);
    if (Math.abs(p.v - ans) <= 1e-9 * Math.max(1, Math.abs(ans))) return { ok:true };
    var named = (it.wrong || []).filter(function(w){ return (w.plus && p.plus) || (w.match != null && Math.abs(p.v - w.match) < 1e-9 * Math.max(1, Math.abs(w.match))); })[0];
    return { ok:false, fb:named ? named.fb : null };
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = (a.how === "" ? "" : '<p class="how">' + (a.how || "Type your answer, then press Check.") + "</p>") + a.items.map(function(it, i){
        var x = ist(it.id), ans = MV.ans(it), text = it.factors || ans >= 10000;
        var h = '<div class="q" data-ce="' + it.id + '"><div class="q-head"><span class="qn ce-qn" aria-hidden="true">' + (a.prefix || "") + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        h += '<div class="numrow ce-row"><label for="ce-' + it.id + '">' + (it.label || "Number of ways:") + '</label><input class="numin' + (it.factors ? " ce-wide" : "") + '" id="ce-' + it.id + '" data-cin="' + it.id + '" type="text" inputmode="' + (text ? "text" : "decimal") + '" autocomplete="off" spellcheck="false"' + (it.placeholder ? ' placeholder="' + MV.esc(MV.plain(it.placeholder)) + '"' : "") + ' value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + "></div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + MV.hintsHTML(it.hints, x.hint);
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + (it.display || big(ans)) + ".</strong> " + (it.why || "") + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.cin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.cin) { var b = host.querySelector('[data-k="' + e.target.dataset.cin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ce]"); if (!box) return;
    var it = a.items.filter(function(x){ return x.id === box.dataset.ce; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x.val);
      if (r.bad) { msgs[it.id] = "Enter a whole number such as 720 or 10 000, or a product such as 10 × 9 × 8 or 26^4."; paint(); MV.focusFb(host.querySelector('[data-ce="' + it.id + '"]')); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (r.fb ? r.fb + " Try again." : "Check the number of choices at each stage, then try again."); }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ce="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; });
      return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Code system ----------
var task = (function(){
  var api = null;
  function read(){ var s = api ? api.S : {}; return { L:s.L == null ? 2 : s.L, D:s.D == null ? 2 : s.D, rep:s.rep !== false }; }
  function count(d){ var f = [], n = 1, i; for (i = 0; i < d.L; i++) f.push(26 - i); for (i = 0; i < d.D; i++) f.push(d.rep ? 10 : 10 - i); f.forEach(function(x){ n *= x; }); return { f:f, n:f.length ? n : 0 }; }
  function paint(){
    var d = read(), c = count(d);
    $("#cs-L").textContent = d.L; $("#cs-D").textContent = d.D;
    $('[data-cs="L"][data-d="-1"]').disabled = d.L <= 0; $('[data-cs="L"][data-d="1"]').disabled = d.L >= 4;
    $('[data-cs="D"][data-d="-1"]').disabled = d.D <= 0; $('[data-cs="D"][data-d="1"]').disabled = d.D >= 5;
    var sw = $("#cs-rep"); sw.setAttribute("aria-checked", d.rep);
    var cells = []; for (var i = 0; i < d.L; i++) cells.push('<span class="cs-cell l"><small>letter</small><b>' + c.f[i] + "</b></span>");
    for (var j = 0; j < d.D; j++) cells.push('<span class="cs-cell d"><small>digit</small><b>' + c.f[d.L + j] + "</b></span>");
    $("#cs-strip").innerHTML = cells.length ? cells.join("") : '<span class="muted">No positions yet.</span>';
    $("#cs-prod").innerHTML = c.f.length ? c.f.join(" × ") + " = <strong>" + big(c.n) + "</strong>" : "No positions: no codes";
    $("#cs-sum").textContent = (d.L + d.D) + " character" + (d.L + d.D === 1 ? "" : "s") + " · " + big(c.n) + " possible code" + (c.n === 1 ? "" : "s") + (d.D >= 2 ? (d.rep ? " · digits repeat" : " · no digit repeats") : d.D === 1 ? " · one digit, so the switch makes no difference" : "");
  }
  function keyText(k){
    var p = k.split(","), L = +p[0], D = +p[1];
    return L + " letter" + (L === 1 ? "" : "s") + " + " + D + " digit" + (D === 1 ? "" : "s") + (p[2] === "r" ? ", digits repeat" : p[2] === "n" ? ", no repeats" : "");
  }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.L == null) a.S.L = 2; if (a.S.D == null) a.S.D = 2; if (a.S.rep == null) a.S.rep = true;
      var row = function(id, lab, aria){ return '<div class="cs-row" role="group" aria-label="' + aria + '"><span class="cs-lab">' + lab + '</span><button type="button" class="btn ghost sm cs-b" data-cs="' + id + '" data-d="-1" aria-label="Fewer ' + aria.toLowerCase() + '">−</button><output class="cs-out" id="cs-' + id + '" aria-live="polite"></output><button type="button" class="btn ghost sm cs-b" data-cs="' + id + '" data-d="1" aria-label="More ' + aria.toLowerCase() + '">+</button></div>'; };
      inp.innerHTML = '<div class="cs-in">' + row("L", "Letter positions " + MV.m("L"), "Letter positions") + row("D", "Digit positions " + MV.m("D"), "Digit positions") +
        '<button type="button" class="cc-switch" role="switch" id="cs-rep" aria-checked="true"><span class="cc-track" aria-hidden="true"><span class="cc-knob"></span></span>Digits may repeat</button>' +
        '<p class="tiny muted">Letters never repeat in a code.</p></div>';
      pv.innerHTML = '<div class="cs-pv"><p class="tiny muted" style="margin:0 0 4px">Your code system</p><div class="cs-strip" id="cs-strip" aria-hidden="true"></div><p class="cs-prod" id="cs-prod" aria-live="polite"></p><p class="tiny muted" id="cs-sum"></p></div>';
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || b.disabled) return;
        if (b.id === "cs-rep") a.S.rep = !(a.S.rep !== false);
        else if (b.dataset.cs) { var id = b.dataset.cs, mx = id === "L" ? 4 : 5; a.S[id] = Math.max(0, Math.min(mx, (a.S[id] | 0) + +b.dataset.d)); }
        else return;
        a.save(); paint(); a.update();
      });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var n = count(d).n; return [d.L >= 1 && d.D >= 1, d.L + d.D <= 5, n >= 100000, n < 1000000]; },
    key:function(d){
      var k = d.L + "," + d.D + "," + (d.D >= 2 ? (d.rep ? "r" : "n") : "-"), st = MV.taskState(), n = st.found.length + (st.found.indexOf(k) < 0 ? 1 : 0);
      MV.C.task.after3 = n >= 5 ? MV.C.task.afterAll : "";
      return k;
    },
    label:function(k){ return keyText(k); },
    text:function(k){ return keyText(k); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ count:countEntry, cases:countEntry },
  task:task
});
})();
