// MDM4U 06 Factorial Notation: hero (four tiles fill four slots, then shuffle through all 24 line-ups), Line-up builder
// (Explore: D4 arrangement tiles in Build / List them all modes, a log-scale Growth bar chart, a Pattern-down ladder),
// Factorial algebra (Part 3: factor-tile strips that cancel, a consecutive-products ladder, write-it-as-factorials chips),
// Factorial puzzles (custom practice: number entry and chips), "Factorial target" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
var NS = " ";                                                    // narrow no-break space: 3 628 800
function big(v){ return MV.mdm.fmt(v).replace(/ /g, NS); }
function fact(n){ return MV.mdm.fact(n); }
function zeros(n){ var s = String(MV.mdm.factB(n)); return s.length - s.replace(/0+$/, "").length; }
function clampInt(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }
function plural(n, w){ return n + " " + w + (n === 1 ? "" : "s"); }
function downFrom(a, b){ var f = []; for (var k = a; k > b; k--) f.push(k); return f; }   // a × (a − 1) × … × (b + 1)

// @component radioGroup (copied from MDM4U 02 / 04) — segmented control or chip row as a real radio group
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id)}) -> {set, get, lock, refresh}
function radios(host, o){
  var val = String(o.value), locked = false;
  function off(id){ return locked || !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = off(val) || ids.indexOf(val) < 0 ? ids.filter(function(id){ return !off(id); })[0] : val;
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
// arrow keys (and Home/End) move focus inside a group of buttons with a roving tabindex
function rove(box, sel){
  box.addEventListener("keydown", function(e){
    var b = e.target.closest(sel); if (!b || !box.contains(b)) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0;
    var list = Array.prototype.slice.call(box.querySelectorAll(sel)), i = list.indexOf(b), j;
    if (e.key === "Home") j = 0; else if (e.key === "End") j = list.length - 1; else if (d) j = Math.max(0, Math.min(list.length - 1, i + d)); else return;
    e.preventDefault(); list.forEach(function(x){ x.tabIndex = -1; }); list[j].tabIndex = 0; list[j].focus();
  });
}

// @component D4 arrangementTiles — arrangement tiles (course plan D4), self-contained. n distinct tiles (letters A–H, people
// icons or coloured flags; every tile keeps its letter, so colour is never the only signal) and n slots filled from left to
// right: tap a tile, then the glowing slot (arrow keys move within the tiles or within the slots; Enter selects and places;
// tap the last filled slot to take its tile back). Each slot shows "k choices" (k = n − position). Also a "list them all"
// grid of every line-up, grouped by first object and then by second (a tree view), for small n. Identical tiles and the
// circular-table mode (08–10) are not built here yet.
//   D4.tile(i, set) -> inner html    D4.name(i, set) -> plain name    D4.perms(n) -> [[i…]] in lexicographic order
//   D4.listHTML(n, set, shown) -> html (the first `shown` line-ups drawn, the rest as "?")
//   ui = D4.ui(host, { state:() -> {n, set, slots:[i…], sel, drop:k | −1 (all) | null}, onTile(i), onSlot(k) })  ui.render()
var D4 = (function(){
  var AZ = "ABCDEFGH", COL = ["--pen", "--f3", "--p-k", "--p-c", "--p-b", "--p-t", "--acol", "--red"];
  var PERSON = '<svg class="d4-ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="7.2" r="4.3"/><path d="M3.4 22.5c0-5.4 3.9-8.9 8.6-8.9s8.6 3.5 8.6 8.9z"/></svg>';
  function flag(i){ return '<svg class="d4-ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 2.5v20" fill="none" stroke="var(--ink)" stroke-width="2" stroke-linecap="round"/><path d="M6 3.5h14l-3.4 4.7 3.4 4.7H6z" style="fill:var(' + COL[i % 8] + ')"/></svg>'; }
  function tile(i, set){
    if (set === "people") return '<span class="d4-in d4-p" style="color:var(' + COL[i % 8] + ')">' + PERSON + '<b class="d4-l">' + AZ[i] + "</b></span>";
    if (set === "flags") return '<span class="d4-in d4-p">' + flag(i) + '<b class="d4-l">' + AZ[i] + "</b></span>";
    return '<span class="d4-in"><b class="d4-L">' + AZ[i] + "</b></span>";
  }
  function name(i, set){ return (set === "people" ? "person " : set === "flags" ? "flag " : "") + AZ[i]; }
  function perms(n){
    var out = [], base = []; for (var i = 0; i < n; i++) base.push(i);
    (function rec(pre, rest){ if (!rest.length) { out.push(pre); return; } rest.forEach(function(x, j){ rec(pre.concat([x]), rest.slice(0, j).concat(rest.slice(j + 1))); }); })([], base);
    return out;
  }
  function mini(p, set){ return '<span class="d4-mini" aria-hidden="true">' + p.map(function(i){ return '<span class="d4-m">' + tile(i, set) + "</span>"; }).join("") + '</span><span class="vh">' + p.map(function(i){ return AZ[i]; }).join(" ") + "</span>"; }
  function listHTML(n, set, shown){
    var P = perms(n), per = P.length / n, sub = n > 2 ? per / (n - 1) : per, k = 0, h = '<div class="d4-list">';
    for (var f = 0; f < n; f++) {
      h += '<div class="d4-lcol"><p class="d4-lh">' + mini([f], set) + " first <span class=\"muted\">(" + per + ")</span></p><ul class=\"d4-lul\">";
      for (var j = 0; j < per; j++, k++) h += '<li class="' + (k < shown ? "on" : "off") + (j && j % sub === 0 ? " d4-sub" : "") + '">' + (k < shown ? mini(P[k], set) : '<span class="d4-q" aria-hidden="true">?</span><span class="vh">not shown yet</span>') + "</li>";
      h += "</ul></div>";
    }
    return h + "</div>";
  }
  function ui(host, o){
    host.classList.add("d4");
    host.innerHTML = '<div class="d4-pool" role="group" aria-label="Objects to place"></div><div class="d4-slots" role="group" aria-label="Slots, filled from left to right"></div>';
    var pool = host.querySelector(".d4-pool"), slots = host.querySelector(".d4-slots");
    function render(){
      var s = o.state(), n = s.n, used = {}, f = s.slots.length, i, k;
      s.slots.forEach(function(x){ used[x] = 1; });
      var free = []; for (i = 0; i < n; i++) if (!used[i]) free.push(i);
      var tabT = s.sel != null && !used[s.sel] ? s.sel : free[0];
      MV.keepFocus(pool, function(){
        var h = "";
        for (i = 0; i < n; i++) h += used[i] ? '<span class="d4-t d4-gh" aria-hidden="true"></span>' :
          '<button type="button" class="d4-t" data-t="' + i + '" data-k="d4t' + i + '" aria-pressed="' + (s.sel === i) + '" aria-label="' + name(i, s.set) + '" tabindex="' + (i === tabT ? 0 : -1) + '">' + tile(i, s.set) + "</button>";
        pool.innerHTML = h;
      });
      var tabS = f < n ? f : n - 1;
      MV.keepFocus(slots, function(){
        var h = "";
        for (k = 0; k < n; k++) {
          var full = k < f, next = k === f, ch = n - k, live = next || k === f - 1;
          var lab = "Slot " + (k + 1) + ", " + plural(ch, "choice") + ": " + (full ? name(s.slots[k], s.set) + (k === f - 1 ? ". Press to take it back." : "") : next ? "empty, next to fill" : "empty, filled later");
          var anim = full && (s.drop === k || s.drop === -1) ? " d4-drop" : "";
          h += '<div class="d4-sw"><button type="button" class="d4-s' + (full ? " full" : "") + (next ? " next" : "") + anim + '"' + (anim && s.drop === -1 ? ' style="animation-delay:' + (k * 70) + 'ms"' : "") +
            ' data-s="' + k + '" data-k="d4s' + k + '" aria-label="' + lab + '"' + (live ? "" : ' aria-disabled="true"') + ' tabindex="' + (k === tabS ? 0 : -1) + '">' + (full ? tile(s.slots[k], s.set) : "") +
            '</button><span class="d4-c" aria-hidden="true">' + plural(ch, "choice") + "</span></div>";
        }
        slots.innerHTML = h;
      });
    }
    pool.addEventListener("click", function(e){ var b = e.target.closest("[data-t]"); if (b) o.onTile(+b.dataset.t, b); });
    slots.addEventListener("click", function(e){ var b = e.target.closest("[data-s]"); if (b) o.onSlot(+b.dataset.s, b); });
    rove(pool, "button[data-t]"); rove(slots, "button[data-s]");
    return { render:render, focusPool:function(){ var b = pool.querySelector('button[tabindex="0"]') || pool.querySelector("button"); if (b) b.focus(); } };
  }
  return { AZ:AZ, tile:tile, name:name, perms:perms, listHTML:listHTML, ui:ui };
})();

// ---------- Explore: Line-up builder ----------
var MODES = ["build", "list", "growth", "down"];
var SETS = [{ id:"letters", t:"Letters A–H" }, { id:"people", t:"People" }, { id:"flags", t:"Flags" }];
var TEN10 = 10000000000;
function explore(host, api){
  var S = api.S;
  if (MODES.indexOf(S.mode) < 0) S.mode = "build";
  S.n = clampInt(S.n, 0, 15, 4); if (S.mode !== "growth") S.n = Math.max(1, Math.min(8, S.n));
  if (!SETS.some(function(x){ return x.id === S.set; })) S.set = "letters";
  S.slots = Array.isArray(S.slots) ? S.slots.filter(function(i, k, a){ return i === (i | 0) && i >= 0 && i < S.n && a.indexOf(i) === k; }) : [];
  S.marks = Array.isArray(S.marks) ? S.marks.filter(function(v, k, a){ return v === (v | 0) && v >= 0 && v <= 15 && a.indexOf(v) === k; }) : [];
  S.rung = clampInt(S.rung, 0, 5, 5); S.shuf = S.shuf | 0;
  var pv = {}, anim = null, sel = null, msg = "", drop = null;

  host.innerHTML =
    '<div class="fac-top"><div id="fac-modes"></div><div id="fac-sets"></div></div>' +
    '<div class="pg fac-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap fac-cap" id="fac-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="fac-v" data-v="build"><div id="fac-d4"></div><p class="fac-prod" id="fac-prod" aria-live="polite"></p><p class="fac-msg" id="fac-msg" aria-live="polite"></p></div>' +
      '<div class="fac-v" data-v="list"><div class="fac-lbox" id="fac-list"></div></div>' +
      '<div class="fac-v" data-v="growth"><div class="fac-gbox" id="fac-growth" role="group" aria-label="Bar chart of n factorial for n = 0 to 15 on a log scale. Each bar is a button: press it to mark it."></div></div>' +
      '<div class="fac-v" data-v="down"><div id="fac-down"></div></div></div>' +
    '<div class="pg-ctrl"><div id="fac-n"></div><div class="q-actions fac-btns" id="fac-btns"></div><p class="tiny muted fac-how" id="fac-how"></p></div>' +
    '<div class="pg-read"><dl class="read" id="fac-read" aria-live="polite"></dl></div></div>';

  var d4 = D4.ui($("#fac-d4", host), { state:function(){ return { n:S.n, set:S.set, slots:S.slots, sel:sel, drop:drop }; }, onTile:onTile, onSlot:onSlot });
  var modeR = radios($("#fac-modes", host), { label:"Mode", options:[{ id:"build", t:"Build" }, { id:"list", t:"List them all" }, { id:"growth", t:"Growth" }, { id:"down", t:"Pattern down" }], value:S.mode, cls:"seg",
    onChange:function(v){ user(); setMode(v); } });
  var setR = radios($("#fac-sets", host), { label:"Tile set", options:SETS, value:S.set, cls:"chips", onChange:function(v){ user(); S.set = v; save(); render(); } });
  $("#fac-n", host).innerHTML = '<label class="slider"><span class="slider-top"><span>Objects ' + MV.m("n") + '</span><output id="fac-n-out"></output></span><input type="range" id="fac-n-in" min="1" max="8" step="1"></label>';
  var nIn = $("#fac-n-in", host);
  nIn.addEventListener("input", function(){ user(); S.n = +nIn.value; S.slots = []; sel = null; msg = ""; save(); render(); MV.changed(); });
  $("#fac-btns", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-b]"); if (!b || b.disabled) return;
    user(); var a = b.dataset.b;
    if (a === "shuffle") {
      var r = MV.mdm.seededRandom("mdm4u-06-shuffle-" + (S.shuf++)), p = []; for (var i = 0; i < S.n; i++) p.push(i);
      for (var j = p.length - 1; j > 0; j--) { var q = r.int(j + 1), t = p[j]; p[j] = p[q]; p[q] = t; }
      S.slots = p; sel = null; msg = ""; drop = -1;
    } else if (a === "undo") { S.slots.pop(); msg = ""; }
    else if (a === "reset") { if (S.mode === "down") { S.rung = 5; pv.arr = 5; } else { S.slots = []; sel = null; msg = ""; } }
    else if (a === "clear") S.marks = [];
    else if (a === "div") { if (S.rung > 0) { S.rung--; pv.arr = S.rung; } }
    else if (a === "relist") { save(); render(); fillList(null); return; }
    save(); render(); drop = null; pv.arr = null; MV.changed();
  });
  $("#fac-growth", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-g]"); if (!b) return;
    user(); var n = +b.dataset.g, i = S.marks.indexOf(n);
    if (i >= 0) S.marks.splice(i, 1); else S.marks.push(n);
    S.marks.sort(function(x, y){ return x - y; }); save(); render(); MV.changed();
  });
  rove($("#fac-growth", host), "button[data-g]");

  function save(){ api.save(); }
  function user(){ cancelAnim(); if (pv.hide || pv.gMax != null || pv.listShown != null || pv.cmp || pv.tag) pv = {}; MV.banner("", ""); }
  function setMode(v){
    S.mode = v;
    if (v !== "growth") { S.n = Math.max(1, Math.min(8, S.n)); S.slots = S.slots.filter(function(i){ return i < S.n; }); if (S.slots.length > S.n) S.slots = []; }
    sel = null; msg = ""; save(); render(); MV.changed();
  }
  function onTile(i){ user(); sel = sel === i ? null : i; msg = sel == null ? "" : D4.name(i, S.set).replace(/^./, function(c){ return c.toUpperCase(); }) + " selected. Now tap the glowing slot."; render(); }
  function onSlot(k, btn){
    user(); var f = S.slots.length, hadFocus = btn === document.activeElement;
    if (k < f) {
      if (k === f - 1) { var back = S.slots.pop(); msg = D4.name(back, S.set).replace(/^./, function(c){ return c.toUpperCase(); }) + " is back with the other tiles."; save(); render(); MV.changed(); }
      else { msg = "Take tiles back from the last filled slot first."; render(); }
      return;
    }
    if (k > f) { msg = "Fill the slots from left to right: the glowing slot is next."; render(); return; }
    if (sel == null) { msg = "Tap a tile first, then tap the glowing slot."; render(); return; }
    S.slots.push(sel); drop = k; sel = null; msg = "";
    save(); render(); drop = null; MV.changed();
    if (hadFocus && S.slots.length < S.n) d4.focusPool();
  }

  // --- animation bookkeeping (predictions); any user action cancels the animation and finishes it ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], stops:[], fin:fin || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function endAnim(){ var a = anim; anim = null; render(); if (a && a.fin) { var f = a.fin; a.fin = null; f(); } }
  function cancelAnim(){
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} });
    pv = {}; if (a.fin) { var f = a.fin; a.fin = null; f(); }
    render(); MV.changed();
  }

  // --- painting ---
  function render(){
    modeR.set(S.mode); setR.set(S.set);
    $$(".fac-v", host).forEach(function(d){ d.hidden = d.dataset.v !== S.mode; });
    $("#fac-sets", host).hidden = S.mode === "growth" || S.mode === "down";
    paintN(); paintBtns();
    if (S.mode === "build") paintBuild(); else if (S.mode === "list") paintList(); else if (S.mode === "growth") paintGrowth(); else paintDown();
    paintRead(); paintCap();
  }
  function paintN(){
    var box = $("#fac-n", host), g = S.mode === "growth";
    box.hidden = S.mode === "down";
    nIn.min = g ? 0 : 1; nIn.max = g ? 15 : 8; nIn.value = S.n;
    nIn.setAttribute("aria-valuetext", "n = " + S.n);
    $("#fac-n-out", host).textContent = String(S.n);
  }
  function paintBtns(){
    var m = S.mode, b = [];
    if (m === "build") b = [["shuffle", "Shuffle", "", false], ["undo", "Take back the last tile", " ghost", !S.slots.length], ["reset", "Reset", " ghost", !S.slots.length && sel == null]];
    else if (m === "list") b = [["relist", "List them again", " ghost", S.n > 4]];
    else if (m === "growth") b = [["clear", "Clear marks", " ghost", !S.marks.length]];
    else b = [["div", S.rung > 0 ? "Divide by " + S.rung : "You’ve reached " + "0!", " primary", S.rung === 0], ["reset", "Start again at 5!", " ghost", S.rung === 5]];
    var box = $("#fac-btns", host);
    MV.keepFocus(box, function(){ box.innerHTML = b.map(function(x){ return '<button type="button" class="btn sm' + x[2] + '" data-b="' + x[0] + '" data-k="fb' + x[0] + '"' + (x[3] || anim ? " disabled" : "") + ">" + x[1] + "</button>"; }).join(""); });
    var how = {
      build:"Tap a tile, then tap the glowing slot. Arrow keys move between tiles or between slots; Enter selects and places. Tap the last filled slot to take its tile back.",
      list:"Every line-up, grouped by the first object and then by the second. Lists are drawn for up to 4 objects.",
      growth:"The slider picks " + MV.m("n") + " (its bar is outlined). Tap bars to mark them. The scale is logarithmic: each grid line is 100 times the one below it.",
      down:"Each press divides by the rung’s number: " + MV.m("n! ÷ n = (n - 1)!") + "."
    };
    $("#fac-how", host).innerHTML = how[m];
  }
  function factorLine(n, f){ var x = []; for (var k = 0; k < f; k++) x.push(n - k); return x.join(" × "); }
  function paintBuild(){
    d4.render();
    var n = S.n, f = S.slots.length, prod;
    if (!f) prod = '<span class="muted">Product: place the first tile.</span>';
    else if (f < n) prod = MV.m(factorLine(n, f) + " × …");
    else prod = MV.m(n === 1 ? "1 = 1!" : factorLine(n, n) + " = " + big(fact(n)) + " = " + n + "!");
    $("#fac-prod", host).innerHTML = prod;
    $("#fac-msg", host).textContent = msg;
  }
  function fillList(done){
    var tot = fact(S.n);
    if (MV.reduceMotion || S.n > 4) { pv.listShown = null; pv.hide = false; render(); if (done) done(); return; }
    pv.listShown = 0; render();
    var a0 = anim || newAnim(null);
    (function tick(){ pv.listShown++; paintList(); paintRead(); paintCap();
      if (pv.listShown < tot) later(Math.max(60, 1800 / tot), tick); else later(250, function(){ pv.listShown = null; pv.hide = false; render(); if (done) done(); else endAnim(); }); })();
    void a0;
  }
  function paintList(){
    var n = S.n, box = $("#fac-list", host);
    if (n > 4) { box.innerHTML = '<p class="fac-too">' + MV.m(n + "! = " + big(fact(n))) + " line-ups: too many to list here. List them all draws every line-up for up to 4 objects. Each extra object multiplies the list: " + MV.m(n + " × " + big(fact(n - 1)) + " = " + big(fact(n))) + ".</p>"; return; }
    box.innerHTML = D4.listHTML(n, S.set, pv.listShown == null ? Infinity : pv.listShown);
  }
  // Growth: n! for n = 0 … 15 as HTML bars on a log scale (each bar is a button so it can be marked)
  var GH = 228, GX = 24, GTOP = 13;
  function paintGrowth(){
    var cols = [], n;
    for (n = 0; n <= 15; n++) { cols.push({ n:n, v:fact(n) }); if (n === 10 && pv.cmp) cols.push({ cmp:true, v:TEN10 }); }
    var tab = S.marks.length ? S.marks[0] : S.n;
    var grid = "";
    for (var g = 0; g <= 12; g += 2) {
      var y = GX + g / GTOP * GH;
      grid += '<span class="fac-gl" style="bottom:' + y.toFixed(1) + 'px"></span><span class="fac-gy" style="bottom:' + (y - 7).toFixed(1) + 'px">' + (g === 0 ? "1" : g === 2 ? "100" : "10<sup>" + g + "</sup>") + "</span>";
    }
    var h = '<div class="fac-gch" style="height:' + (GH + GX + 10) + 'px">' + grid + '<div class="fac-gcols">' + cols.map(function(c){
      var key = c.cmp ? "cmp" : c.n, full = Math.log10(c.v) / GTOP * GH, f = 1, hideVal = false, gone = !c.cmp && pv.gMax != null && c.n > pv.gMax;
      if (pv.gHide && pv.gHide[key]) { f = pv.rise ? pv.rise.f : 0; hideVal = !(pv.rise && pv.rise.f >= 1); }
      if (pv.rise && pv.rise.k === key && !(pv.gHide && pv.gHide[key])) { f = pv.rise.f; hideVal = f < 1; }
      var hpx = Math.max(3, full * f), txt = c.cmp ? big(TEN10) : big(c.v), len = txt.length * 6.3 + 6;
      var inside = full * f > len + 6, mk = !c.cmp && S.marks.indexOf(c.n) >= 0, cur = !c.cmp && c.n === S.n;
      var inner = gone ? '<span class="fac-gq" style="bottom:' + (GX + 6) + 'px">?</span>' :
        '<span class="fac-gf' + (c.cmp ? " cmp" : "") + '" style="height:' + hpx.toFixed(1) + "px;bottom:" + GX + 'px"></span>' +
        '<span class="fac-gv' + (inside ? " in" : "") + (c.cmp && inside ? " cmp" : "") + '" style="bottom:' + (GX + (inside ? 5 : hpx + 5)).toFixed(1) + 'px">' + (hideVal ? "?" : txt) + "</span>";
      if (pv.tag && pv.tag.k === key && !gone) inner += '<span class="fac-gtag" style="bottom:' + (GX + hpx + (inside ? 8 : len + 10)).toFixed(1) + 'px">' + pv.tag.t + "</span>";
      inner += '<span class="fac-gx">' + (c.cmp ? "10<sup>10</sup>" : c.n) + "</span>" + (mk ? '<span class="fac-gm" aria-hidden="true">✓</span>' : "");
      if (c.cmp) return '<span class="fac-gc cmp" aria-label="10 to the power 10 = ' + (hideVal ? "hidden" : "10 000 000 000") + '" role="img">' + inner + "</span>";
      var aria = c.n + " factorial" + (gone || hideVal ? " (hidden)" : " = " + txt.replace(/ /g, " ") + ", ends in " + plural(zeros(c.n), "zero")) + (mk ? ", marked" : "");
      return '<button type="button" class="fac-gc' + (mk ? " mk" : "") + (cur ? " cur" : "") + '" data-g="' + c.n + '" data-k="g' + c.n + '" aria-pressed="' + mk + '" aria-label="' + aria + '" tabindex="' + (c.n === tab ? 0 : -1) + '"' + (anim ? " disabled" : "") + ">" + inner + "</button>";
    }).join("") + "</div></div>";
    var box = $("#fac-growth", host);
    MV.keepFocus(box, function(){ box.innerHTML = h; });
    if (lastGN !== S.n) {                                             // keep the selected bar in view when the box scrolls (phones)
      lastGN = S.n;
      var cur = box.querySelector(".fac-gc.cur");
      if (cur && box.clientWidth) { var l = cur.offsetLeft + cur.parentNode.offsetLeft, r = l + cur.offsetWidth; if (r > box.scrollLeft + box.clientWidth || l < box.scrollLeft) box.scrollLeft = Math.max(0, r - box.clientWidth + 30); }
    }
  }
  var lastGN = null;
  function paintDown(){
    var h = '<ol class="fac-lad" aria-label="Pattern-down ladder from 5 factorial to 0 factorial">';
    for (var k = 5; k >= 0; k--) {
      var passed = k > S.rung, cur = k === S.rung, seen = k >= S.rung;
      h += '<li class="fac-rung' + (cur ? " cur" : "") + (seen ? "" : " fut") + (pv.arr === k && !MV.reduceMotion ? " arr" : "") + '"><span class="fac-rl">' + MV.m(k + "!") + '</span><span class="fac-req" aria-hidden="true">=</span><span class="fac-rv">' + (seen ? big(fact(k)) : "?") + "</span>" +
        (k === 0 && seen ? '<span class="fac-rn">exactly one way to arrange nothing: the empty line-up</span>' : "") + (cur ? '<span class="vh"> (current rung)</span>' : "") + "</li>";
      if (k > 0) h += '<li class="fac-step' + (passed ? " on" : "") + '" aria-hidden="true">' + (passed ? MV.m(big(fact(k)) + " ÷ " + k + " = " + big(fact(k - 1))) : MV.m("÷ " + k)) + "</li>";
    }
    $("#fac-down", host).innerHTML = h + "</ol>";
  }
  function paintRead(){
    var n = S.n, rows = [], hide = !!pv.hide;
    if (S.mode === "build") {
      var f = S.slots.length;
      rows.push(["Objects", String(n)]);
      rows.push(["Slots filled", f + " of " + n]);
      rows.push(["Choices for the next slot", f < n ? String(n - f) : "—"]);
      rows.push(["Product so far", f ? MV.m(factorLine(n, f) + (f < n ? " × …" : "")) : "…"]);
      rows.push(["Ways to finish", MV.m((n - f) + "! = " + big(fact(n - f)))]);
      rows.push(["Total line-ups", MV.m(n + "! = " + big(fact(n)))]);
    } else if (S.mode === "list") {
      rows.push(["Objects", String(n)]);
      rows.push(["Line-ups listed", n > 4 ? "Too many to list (up to 4 objects only)" : (pv.listShown == null ? fact(n) : pv.listShown) + " of " + (hide ? "?" : fact(n))]);
      rows.push(["Total line-ups", hide ? "?" : MV.m(n + "! = " + big(fact(n)))]);
    } else if (S.mode === "growth") {
      rows.push(["Objects", String(n)]);
      rows.push(["Total line-ups", hide ? "?" : MV.m(n + "! = " + big(fact(n)))]);
      rows.push(["Trailing zeros of " + MV.m("n!"), hide ? "?" : String(zeros(n))]);
      rows.push(["Marked bars", S.marks.length ? S.marks.map(function(v){ return MV.m("n = " + v); }).join(", ") : '<span class="muted">none</span>']);
      if (pv.cmp && !hide) rows.push([MV.m("10!") + " vs " + MV.m("10^{10}"), MV.m(big(fact(10)) + " < " + big(TEN10))]);
    } else {
      var k = S.rung;
      rows.push(["Current rung", MV.m(k + "! = " + big(fact(k)))]);
      rows.push(["Next step", k > 0 ? MV.m(big(fact(k)) + " ÷ " + k + " = " + big(fact(k - 1))) + ", which is " + MV.m((k - 1) + "!") : "None: " + MV.m("0! = 1") + " is the bottom rung"]);
      rows.push(["Why it works", MV.m("n! = n × (n - 1)!") + ", so " + MV.m("(n - 1)! = n! ÷ n") + ". With " + MV.m("n = 1") + ": " + MV.m("0! = 1! ÷ 1 = 1") + "."]);
    }
    $("#fac-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(){
    var cap = $("#fac-cap", host), n = S.n;
    if (S.mode === "build") cap.innerHTML = "Line up " + plural(n, "object");
    else if (S.mode === "list") cap.innerHTML = n > 4 ? "Too many to list" : "Every line-up: " + MV.m(n + "! = " + (pv.hide ? "?" : fact(n)));
    else if (S.mode === "growth") cap.innerHTML = MV.m("n!") + " for " + MV.m("n") + " = 0 to 15";
    else cap.innerHTML = MV.m("5! → 4! → 3! → 2! → 1! → 0!");
  }

  render();

  // --- predictions ---
  function startPred(p){
    cancelAnim(); sel = null; msg = ""; pv = {};
    var s = p.start || {};
    S.mode = s.mode;
    if (s.mode === "list") { S.n = s.n; pv = { listShown:0, hide:true }; }
    else if (s.mode === "growth" && !s.cmp) { S.n = s.n; pv = { gMax:5 }; }
    else if (s.mode === "growth") { S.n = s.n; pv = { cmp:true, gHide:{ 10:1, cmp:1 }, hide:true }; }
    else { S.rung = 5; }
    save(); render(); MV.changed();
  }
  function runPred(p, done){
    var a0 = newAnim(done); render();
    if (p.id === "p1") { fillList(function(){ if (anim === a0) { render(); endAnim(); } }); return; }
    if (p.id === "p2") {
      pv.gMax = 6; pv.rise = { k:6, f:0 }; render();
      a0.stops.push(MV.tween({ dur:1100, step:function(t){ pv.rise.f = t; paintGrowth(); }, done:function(){
        if (anim !== a0) return; pv.rise = null; pv.tag = { k:6, t:"× 6" }; S.n = 6; save(); render(); MV.changed();
        later(700, function(){ pv.gMax = null; render(); later(200, endAnim); });
      } }));
      return;
    }
    if (p.id === "p3") {
      if (MV.reduceMotion) { S.rung = 0; save(); render(); MV.changed(); later(50, endAnim); return; }
      (function step(){ S.rung--; pv.arr = S.rung; save(); render(); MV.changed(); if (S.rung > 0) later(850, step); else later(700, function(){ pv.arr = null; render(); endAnim(); }); })();
      return;
    }
    pv.rise = { k:"both", f:0 }; render();
    a0.stops.push(MV.tween({ dur:1300, step:function(t){ pv.rise.f = t; paintGrowth(); }, done:function(){
      if (anim !== a0) return; pv.rise = null; pv.gHide = null; pv.hide = false; render(); later(300, endAnim);
    } }));
  }

  return {
    predict:{ start:startPred, run:runPred },
    challenge:function(id){ return chal(id); }
  };

  function chal(id){
    var n = S.n;
    if (id === "tc1") {
      if (S.mode === "down") return { ok:false, msg:"Pattern down has no Total line-ups readout. Switch to Build, List them all or Growth." };
      if (n === 6) return { ok:true };
      if (n === 5) return { ok:false, msg:MV.m("5! = 120") + ". One more object multiplies by 6." };
      if (n === 7) return { ok:false, msg:MV.m("7! = 5040") + ": one object too many." };
      return { ok:false, msg:"The total is " + MV.m(n + "! = " + big(fact(n))) + (n < 6 ? ": add objects." : ": remove objects.") };
    }
    if (id === "tc2") {
      if (S.mode !== "build") return { ok:false, msg:"Switch to Build mode first." };
      if (n !== 7) return { ok:false, msg:"Set Objects to 7 first." };
      var f = S.slots.length;
      if (f === 3) return { ok:true };
      if (f === 4) return { ok:false, msg:"6 is " + MV.m("3!") + ": you’ve placed one too many." };
      if (f === 2) return { ok:false, msg:"120 is " + MV.m("5!") + ": place one more." };
      return { ok:false, msg:"Ways to finish is " + MV.m((7 - f) + "! = " + big(fact(7 - f))) + (f < 3 ? ": place more tiles." : ": take some tiles back.") };
    }
    if (id === "tc3") {
      var m = S.marks.slice().sort(function(x, y){ return x - y; });
      if (!m.length) return { ok:false, msg:"Open Growth mode and tap bars to mark them." };
      if (m.indexOf(9) >= 0) return { ok:false, msg:"Each zero needs a factor 10 = 2 × 5. " + MV.m("9!") + " contains only one factor 5 (from the 5)." };
      if (m.indexOf(15) >= 0) return { ok:false, msg:"15 = 3 × 5 brings a third factor 5, so " + MV.m("15!") + " ends in three zeros." };
      var bad = m.filter(function(v){ return zeros(v) !== 2; });
      if (bad.length) { var z = zeros(bad[0]); return { ok:false, msg:MV.m(bad[0] + "! = " + big(fact(bad[0]))) + " ends in " + (z ? plural(z, "zero") : "no zeros") + ", not two." }; }
      if (m.length < 5) return { ok:false, msg:"You’ve found some. Is there a pattern for when a new zero appears?" };
      return { ok:true };
    }
    return { ok:false };
  }
}

// ---------- hero: four tiles fill four slots (4, 3, 2, 1 choices), then shuffle through all 24 line-ups ----------
function hero(f){
  var pool = $("#fac-h-pool"), slotsEl = $("#fac-h-slots"), prod = $("#fac-h-prod"), ctr = $("#fac-h-ctr"), cap = f.cap;
  if (!pool) return;
  var AZ = "ABCD", ORDER = [0, 2, 1, 3], CH = ["4 choices", "3 choices", "2 choices", "1 choice"], FAC = ["4", "4 × 3", "4 × 3 × 2", "4 × 3 × 2 × 1 = 24 = 4!"];
  var P = D4.perms(4).filter(function(p){ return p.join("") !== ORDER.join(""); }); P.unshift(ORDER);
  var placed = [], glow = -1, labs = 0;
  function paint(lineup, dropK, shuf){
    pool.innerHTML = [0, 1, 2, 3].map(function(i){ return '<span class="fac-ht' + (placed.indexOf(i) >= 0 ? " gone" : "") + '">' + AZ[i] + "</span>"; }).join("");
    slotsEl.innerHTML = [0, 1, 2, 3].map(function(k){
      var v = lineup ? lineup[k] : placed[k];
      return '<span class="fac-hsw"><span class="fac-hs' + (k === glow ? " glow" : "") + (v != null ? " full" : "") + '">' + (v != null ? '<span class="fac-ht' + (k === dropK ? " drop" : "") + (shuf ? " shuf" : "") + '">' + AZ[v] + "</span>" : "") + "</span><small" + (k < labs ? "" : ' class="off"') + ">" + CH[k] + "</small></span>";
    }).join("");
  }
  function finalFrame(){ placed = ORDER.slice(); glow = -1; labs = 4; paint(P[23]); prod.innerHTML = MV.m(FAC[3]); ctr.textContent = "24 of 24 line-ups"; cap.innerHTML = "Every order is a different line-up: " + MV.m("4! = 24"); }
  if (MV.reduceMotion) { finalFrame(); return; }
  paint(); prod.innerHTML = "&nbsp;"; ctr.innerHTML = "&nbsp;"; cap.textContent = "Four friends, four spots";
  function slot(k, next){
    glow = k; labs = k + 1; paint(); cap.textContent = "Spot " + (k + 1) + ": " + CH[k];
    MV.wait(900, function(){ placed.push(ORDER[k]); glow = -1; paint(null, k); prod.innerHTML = MV.m(FAC[k]); MV.wait(650, next); });
  }
  function shuffle(i){
    if (i >= P.length) { MV.wait(400, finalFrame); return; }
    paint(P[i], null, i > 0); ctr.textContent = (i + 1) + " of 24 line-ups";
    if (i === 0) cap.textContent = "One line-up. Now the others…";
    MV.wait(i === 0 ? 1300 : 330, function(){ shuffle(i + 1); });
  }
  MV.wait(700, function(){ slot(0, function(){ slot(1, function(){ slot(2, function(){ slot(3, function(){ MV.wait(500, function(){ shuffle(0); }); }); }); }); }); });
}

// ---------- Part 3: Factorial algebra ----------
// @component factorTiles — a fraction of factorials as two right-aligned rows of factor tiles (numbers, or symbols such as
// (n − 1) and ⋯). Tap a tile to cancel it with its partner on the other row (same key) or to restore the pair; "Cancel"
// strikes every matching pair one at a time from the tail (highlighter strike band); unmatched tiles stay and form the
// result. A read-only mode shows a finished cancellation.
// ft = factorTiles(host, { top:[{k, t}], bot:[{k, t} | {sep:"×"}], done:{key:1} (persisted), label, onChange(), readOnly })
//   -> { render(), cancelAll(after) -> stop(), pairs() -> [keys], complete() }
function num(n){ var r = []; for (var k = n; k >= 1; k--) r.push({ k:String(k), t:String(k) }); return r; }
function sym(list){ return list.map(function(x){ return { k:x[0], t:x[1] }; }); }
function factorTiles(host, o){
  var busy = false, note = "";
  host.classList.add("fac-ftw");
  function pairs(){ var top = {}; o.top.forEach(function(x){ if (x.k) top[x.k] = 1; }); return o.bot.filter(function(x){ return x.k && top[x.k]; }).map(function(x){ return x.k; }).reverse(); }
  function complete(){ return pairs().every(function(k){ return o.done[k]; }); }
  function row(list, r){
    return list.map(function(x){
      if (x.sep) return '<span class="fac-fsep" aria-hidden="true">' + x.sep + "</span>";
      var x2 = !!o.done[x.k], t = MV.m(x.t);
      if (o.readOnly) return '<span class="fac-ft' + (x2 ? " x" : "") + '">' + t + "</span>";
      return '<button type="button" class="fac-ft' + (x2 ? " x" : "") + '" data-row="' + r + '" data-key="' + MV.esc(x.k) + '" data-k="ft' + r + MV.esc(x.k) + '" aria-pressed="' + x2 + '" aria-label="' + MV.esc(MV.plain(t)) + (x2 ? ", cancelled" : "") + '"' + (busy ? " disabled" : "") + ">" + t + "</button>";
    }).join("");
  }
  function render(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<div class="fac-fwrap"><div class="fac-frac" role="group" aria-label="' + MV.esc(o.label || "Factor tiles") + '"><div class="fac-frow">' + row(o.top, "t") + '</div><div class="fac-fbar" aria-hidden="true"></div><div class="fac-frow">' + row(o.bot, "b") + "</div></div></div>" +
        (note ? '<p class="fac-fnote" role="status">' + note + "</p>" : "");
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-key]"); if (!b || o.readOnly || busy) return;
    var k = b.dataset.key, other = b.dataset.row === "t" ? o.bot : o.top, has = other.some(function(x){ return x.k === k; });
    var tile = (b.dataset.row === "t" ? o.top : o.bot).filter(function(x){ return x.k === k; })[0];
    if (!has) note = MV.m(tile.t) + (b.dataset.row === "t" ? " has no partner below: it stays on top." : " has no partner above: it stays below, so you divide by it.");
    else if (o.done[k]) { delete o.done[k]; note = "Pair restored."; }
    else { o.done[k] = 1; note = ""; }
    render(); if (o.onChange) o.onChange();
  });
  return {
    render:render, pairs:pairs, complete:complete,
    cancelAll:function(after){
      var todo = pairs().filter(function(k){ return !o.done[k]; }), live = true, t = null;
      note = "";
      if (!todo.length || MV.reduceMotion) { todo.forEach(function(k){ o.done[k] = 1; }); render(); if (o.onChange) o.onChange(); if (after) after(); return function(){}; }
      busy = true;
      (function step(i){
        if (!live) return;
        o.done[todo[i]] = 1; if (i === todo.length - 1) busy = false;
        render(); if (o.onChange) o.onChange();
        if (i < todo.length - 1) t = setTimeout(function(){ step(i + 1); }, 170); else if (after) after();
      })(0);
      return function(){ live = false; clearTimeout(t); busy = false; todo.forEach(function(k){ o.done[k] = 1; }); render(); };
    }
  };
}

var FR = {
  s1a:{ label:"10 factorial over 8 factorial", top:num(10), bot:num(8),
    res:"`{10!}/{8!} = 10 × 9 = 90`",
    alg:["`10! = 10 × 9 × 8!`", "`{10!}/{8!} = {10 × 9 × 8!}/{8!} = 10 × 9 = 90` <small>The shared tail `8!` cancels.</small>"] },
  s1b:{ label:"12 factorial over 10 factorial times 2 factorial", top:num(12), bot:[{ k:"2!", t:"2!" }, { sep:"×" }].concat(num(10)),
    res:"`{12!}/{10! × 2!} = {12 × 11}/{2!} = {132}/{2} = 66`",
    alg:["`12! = 12 × 11 × 10!`", "`{12!}/{10! × 2!} = {12 × 11 × 10!}/{10! × 2!} = {12 × 11}/{2!}`", "`= {132}/{2} = 66` <small>The extra `2!` stays below: divide by it.</small>"] },
  s2:{ label:"n plus 1 factorial over n minus 1 factorial", top:sym([["n+1", "(n + 1)"], ["n", "n"], ["n-1", "(n - 1)"], ["n-2", "(n - 2)"], ["dots", "⋯"], ["1", "1"]]), bot:sym([["n-1", "(n - 1)"], ["n-2", "(n - 2)"], ["dots", "⋯"], ["1", "1"]]),
    res:"`{(n + 1)!}/{(n - 1)!} = (n + 1)n`",
    alg:["`(n + 1)! = (n + 1) × n × (n - 1)!`", "`{(n + 1)!}/{(n - 1)!} = {(n + 1) × n × (n - 1)!}/{(n - 1)!} = (n + 1)n`"] },
  s3:{ label:"n factorial over n minus 2 factorial", top:sym([["n", "n"], ["n-1", "(n - 1)"], ["n-2", "(n - 2)"], ["dots", "⋯"], ["1", "1"]]), bot:sym([["n-2", "(n - 2)"], ["dots", "⋯"], ["1", "1"]]),
    res:"`{n!}/{(n - 2)!} = n(n - 1)`, so `n(n - 1) = 30`.",
    alg:["`{n!}/{(n - 2)!} = n(n - 1) = 30`", "`n^2 - n - 30 = 0`", "`(n - 6)(n + 5) = 0`", "`n = 6` or `n = -5` <small>Reject `n = -5`: `n` counts objects.</small>"] }
};
function md(s){ return MV.md(s); }
function part3(host, api){
  var S = api.S;
  S.st = ["1", "2", "3", "4"].indexOf(S.st) >= 0 ? S.st : "1";
  S.c = S.c && typeof S.c === "object" ? S.c : {}; ["s1a", "s1b", "s2", "s3"].forEach(function(k){ if (!S.c[k] || typeof S.c[k] !== "object") S.c[k] = {}; });
  S.s4 = S.s4 && typeof S.s4 === "object" ? S.s4 : {};
  S.s3 = typeof S.s3 === "number" ? S.s3 : null;
  var stops = [];
  function fracBlock(id, title){
    return '<div class="fac-fb" data-fr="' + id + '">' + (title ? '<p class="fac-ft-h">' + md(title) + "</p>" : "") + '<div class="fac-ft-host" id="fac-ft-' + id + '"></div>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" data-cancel="' + id + '">Cancel the shared tail</button><button type="button" class="btn ghost sm" data-redo="' + id + '">Start over</button></div>' +
      '<p class="fac-res" id="fac-res-' + id + '" aria-live="polite"></p>' +
      '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' + FR[id].alg.map(function(l){ return "<span>" + md(l) + "</span>"; }).join("") + "</div></details></div>";
  }
  var LAD = [2, 3, 4, 5, 6, 7, 8];
  host.innerHTML = '<div id="fac-st"></div>' +
    '<div class="fac-station" data-st="1"><h3>Station 1: numbers</h3><p>Each row is a factorial written out as factors. Cancel the shared tail; what’s left is the answer.</p>' + fracBlock("s1a", "`{10!}/{8!}`") + fracBlock("s1b", "`{12!}/{10! × 2!}` <span class=\"tiny muted\">(the extra `2!` stays as a tile to divide by)</span>") + "</div>" +
    '<div class="fac-station" data-st="2"><h3>Station 2: letters</h3><p>The same cancelling works with letters. ' + md("`(n + 1)!`") + " starts at " + md("`n + 1`") + " and runs down to 1.</p>" + fracBlock("s2", "`{(n + 1)!}/{(n - 1)!}`") + "</div>" +
    '<div class="fac-station" data-st="3"><h3>Station 3: solve</h3><p>Solve ' + md("`{n!}/{(n - 2)!} = 30`") + ". Step 1: cancel. Step 2: find the consecutive product. Step 3: check it with algebra.</p>" + fracBlock("s3", "") +
      '<div id="fac-lad3" class="fac-lad3"></div><p class="fac-res" id="fac-lad3-fb" aria-live="polite"></p></div>' +
    '<div class="fac-station" data-st="4"><h3>Station 4: write it as factorials</h3><p>Write ' + md("`9 × 8 × 7`") + " as one factorial divided by another. Choose a top and a bottom, then press Check.</p>" +
      '<div id="fac-s4n"></div><div id="fac-s4d"></div><div class="q-actions"><button type="button" class="btn primary sm" id="fac-s4c">Check</button></div><div id="fac-s4fb" aria-live="polite"></div><div id="fac-s4t" class="fac-ft-host"></div>' +
      '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines"><span>' + md("`9! = 9 × 8 × 7 × 6!`") + "</span><span>" + md("`{9!}/{6!} = 9 × 8 × 7`") + " <small>" + md("To keep the 7, divide by `6!`, not `7!`.") + "</small></span></div></details></div>";

  radios($("#fac-st", host), { label:"Station", options:[{ id:"1", t:"1. Numbers" }, { id:"2", t:"2. Letters" }, { id:"3", t:"3. Solve" }, { id:"4", t:"4. Write it as factorials" }], value:S.st, cls:"chips",
    onChange:function(v){ S.st = v; api.save(); showSt(); } });
  function showSt(){ $$(".fac-station", host).forEach(function(d){ d.hidden = d.dataset.st !== S.st; }); }

  var ft = {};
  Object.keys(FR).forEach(function(id){
    ft[id] = factorTiles($("#fac-ft-" + id, host), { top:FR[id].top, bot:FR[id].bot, done:S.c[id], label:FR[id].label, onChange:function(){ api.save(); paintRes(id); } });
    ft[id].render(); paintRes(id);
  });
  function paintRes(id){
    var el = $("#fac-res-" + id, host), p = ft[id].pairs(), left = p.filter(function(k){ return !S.c[id][k]; }).length;
    el.innerHTML = left ? '<span class="muted">' + plural(left, "matching pair") + " still to cancel.</span>" : "✓ " + md(FR[id].res);
    if (id === "s3") paintLad();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.cancel) { var id = b.dataset.cancel; stops.push(ft[id].cancelAll(function(){ api.save(); paintRes(id); })); return; }
    if (b.dataset.redo) { var id2 = b.dataset.redo; Object.keys(S.c[id2]).forEach(function(k){ delete S.c[id2][k]; }); if (id2 === "s3") S.s3 = null; api.save(); ft[id2].render(); paintRes(id2); return; }
    if (b.dataset.lad) { S.s3 = +b.dataset.lad; api.save(); paintLad(); MV.focusFb($("#fac-lad3-fb", host).parentNode); return; }
    if (b.id === "fac-s4c") { checkS4(); return; }
  });

  // station 3: consecutive-products ladder
  function paintLad(){
    var box = $("#fac-lad3", host), fb = $("#fac-lad3-fb", host);
    if (!ft.s3.complete()) { box.innerHTML = ""; fb.innerHTML = ""; return; }
    var pick = S.s3;
    MV.keepFocus(box, function(){
      box.innerHTML = '<p class="fac-ft-h">Step 2: which consecutive product is 30? Tap it.</p><div class="fac-ladr" role="group" aria-label="Consecutive products n(n − 1)">' + LAD.map(function(n){
        var on = pick === n;
        return '<button type="button" class="fac-lr' + (on ? (n === 6 ? " good" : " bad") : "") + '" data-lad="' + n + '" data-k="lad' + n + '" aria-pressed="' + on + '"><span class="tiny">' + MV.m("n = " + n) + "</span><span>" + MV.m(n + " × " + (n - 1) + " = " + n * (n - 1)) + "</span></button>";
      }).join("") + '<span class="fac-lr dots" aria-hidden="true">…</span></div>';
    });
    if (pick == null) fb.innerHTML = "";
    else if (pick === 6) fb.innerHTML = MV.fbHTML("good", "<strong>✓ 6 × 5 = 30, so " + MV.m("n = 6") + ".</strong> " + md("Step 3: the algebra gives `n^2 - n - 30 = 0`, so `(n - 6)(n + 5) = 0`. Reject `n = -5`: `n` counts objects."));
    else fb.innerHTML = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + MV.m(pick + " × " + (pick - 1) + " = " + pick * (pick - 1)) + ", not 30. Try another rung.");
  }

  // station 4: choose the top and bottom factorials for 9 × 8 × 7
  var nR = radios($("#fac-s4n", host), { label:"Top", aria:"Top factorial", options:[7, 8, 9, 10].map(function(v){ return { id:String(v), t:MV.m(v + "!") }; }), value:S.s4.num == null ? "" : S.s4.num, cls:"chips",
    onChange:function(v){ S.s4.num = v; S.s4.res = null; api.save(); paintS4(); } });
  var dR = radios($("#fac-s4d", host), { label:"Bottom", aria:"Bottom factorial", options:[5, 6, 7, 8].map(function(v){ return { id:String(v), t:MV.m(v + "!") }; }), value:S.s4.den == null ? "" : S.s4.den, cls:"chips",
    onChange:function(v){ S.s4.den = v; S.s4.res = null; api.save(); paintS4(); } });
  void nR; void dR;
  function checkS4(){
    if (S.s4.num == null || S.s4.den == null) { S.s4.res = "pick"; api.save(); paintS4(); return; }
    S.s4.res = S.s4.num + "/" + S.s4.den; api.save(); paintS4(); MV.focusFb($("#fac-s4fb", host));
  }
  function paintS4(){
    var fb = $("#fac-s4fb", host), tl = $("#fac-s4t", host), r = S.s4.res;
    tl.innerHTML = ""; tl.className = "fac-ft-host";
    if (!r) { fb.innerHTML = ""; return; }
    if (r === "pick") { fb.innerHTML = MV.fbHTML("", "Choose a top factorial and a bottom factorial first."); return; }
    var a = +S.s4.num, b = +S.s4.den, frac = MV.m("{" + a + "!}/{" + b + "!}");
    if (a === 9 && b === 6) {
      fb.innerHTML = MV.fbHTML("good", "<strong>✓ " + frac + " = 9 × 8 × 7.</strong> Dividing by " + MV.m("6!") + " cancels 6 down to 1 and keeps the 7.");
      var done = {}; num(6).forEach(function(x){ done[x.k] = 1; });
      factorTiles(tl, { top:num(9), bot:num(6), done:done, readOnly:true, label:"9 factorial over 6 factorial, with 6 down to 1 cancelled" }).render();
      return;
    }
    var why;
    if (a <= b) why = "The top must be the bigger factorial, or nothing is left on top.";
    else if (a === 9 && b === 7) why = "That keeps only 9 × 8.";
    else { var kept = downFrom(a, b); why = frac + " = " + (kept.length > 1 ? kept.join(" × ") + " = " + big(MV.mdm.nPr(a, a - b)) : String(kept[0])) + "." + (a !== 9 ? " The product has to start at 9." : b < 6 ? " That keeps " + (b + 1) + " too." : ""); }
    fb.innerHTML = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + why + " Try another pair.");
  }

  showSt(); paintS4(); paintLad();
  return {};
}

// ---------- Practice 2: Factorial puzzles (number entry and chips) ----------
function puzzles(host, api, a){
  var st = api.S; st.items = st.items || {};
  var msgs = {};
  function ist(id){ return st.items[id] || (st.items[id] = { val:"", tries:0, hint:0, solved:false, first:null, pick:null }); }
  function parseWhole(raw){ var s = String(raw == null ? "" : raw).trim().replace(/^[a-z]\s*=\s*/i, "").replace(/[\s,   ]/g, "").replace(/−/g, "-"); return /^-?\d+$/.test(s) ? parseInt(s, 10) : null; }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = (a.how === "" ? "" : '<p class="how">' + (a.how || "") + "</p>") + a.items.map(function(it, i){
        var x = ist(it.id), h = '<div class="q" data-pz="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        if (it.kind === "chips") {
          h += '<div class="chips fac-pzc" role="group" aria-label="Choices">' + it.choices.map(function(c, ci){
            var on = x.pick === ci, cls = "chip" + (on ? " on" : "");
            return '<button type="button" class="' + cls + '" data-ch="' + ci + '" data-k="' + it.id + "c" + ci + '" aria-pressed="' + on + '"' + (x.solved ? " disabled" : "") + ">" + c.t + "</button>";
          }).join("") + "</div>";
        } else {
          h += '<div class="numrow"><label for="pz-' + it.id + '">' + (it.label || "Your answer:") + '</label><input class="numin" id="pz-' + it.id + '" data-pin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + "></div>";
        }
        if (!x.solved) h += '<div class="q-actions">' + (it.kind === "chips" ? "" : '<button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>') + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct' + (it.display ? ": " + it.display : "") + ".</strong> " + (it.why || "") + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  function find(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.pin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.pin) { var b = host.querySelector('[data-k="' + e.target.dataset.pin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-pz]"); if (!box) return;
    var it = find(box.dataset.pz), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.ch != null) {
      var ci = +b.dataset.ch, c = it.choices[ci]; x.pick = ci;
      if (MV.ok(c)) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (c.fb || "") + " Try another chip."; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-pz="' + it.id + '"]')); return;
    }
    if (b.dataset.act === "check") {
      var v = parseWhole(x.val);
      if (v == null) { msgs[it.id] = "Enter a whole number, such as 7."; paint(); MV.focusFb(host.querySelector('[data-pz="' + it.id + '"]')); return; }
      if (v === MV.ans(it)) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else {
        x.tries++;
        var w = (it.wrong || []).filter(function(w){ return w.match === v; })[0];
        msgs[it.id] = "<strong>✗ Not quite.</strong> " + (w ? w.fb : v < 0 ? "Factorials count objects, so the answer is a whole number of at least 0." : "Cancel first, then test your value in the equation.") + " Try again.";
      }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-pz="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; });
      return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Factorial target ----------
var task = (function(){
  var api = null;
  function read(){ var s = api ? api.S : {}; return { a:s.a == null ? 5 : s.a, b:s.b == null ? 2 : s.b }; }
  function val(d){ return d.b < d.a ? MV.mdm.nPr(d.a, d.a - d.b) : null; }
  function line(d){ var f = downFrom(d.a, d.b), v = val(d); return f.length > 1 ? f.join(" × ") + " = " + big(v) : String(v); }
  function paint(){
    var d = read(), v = val(d);
    $("#ft-a").textContent = d.a; $("#ft-b").textContent = d.b;
    $('[data-ft="a"][data-d="-1"]').disabled = d.a <= 0; $('[data-ft="a"][data-d="1"]').disabled = d.a >= 12;
    $('[data-ft="b"][data-d="-1"]').disabled = d.b <= 0; $('[data-ft="b"][data-d="1"]').disabled = d.b >= 12;
    var strip = "";
    for (var k = d.a; k >= 1; k--) strip += '<span class="fac-tc' + (k <= d.b ? " x" : "") + '">' + k + "</span>";
    $("#ft-strip").innerHTML = d.a ? strip : '<span class="muted">' + MV.m("0! = 1") + ": no factors</span>";
    $("#ft-frac").innerHTML = MV.m("{" + d.a + "!}/{" + d.b + "!}");
    $("#ft-prod").innerHTML = v == null ? '<span class="muted">Choose ' + MV.m("b") + " smaller than " + MV.m("a") + ".</span>" : "= " + MV.m(line(d)) + ' <span class="tiny muted">(' + plural(d.a - d.b, "factor") + ")</span>";
  }
  function keyText(k){ var p = k.split(","), d = { a:+p[0], b:+p[1] }; return d.a + "!/" + d.b + "! = " + line(d).replace(/ /g, " "); }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.a == null) a.S.a = 5; if (a.S.b == null) a.S.b = 2;
      var row = function(id, lab){ return '<div class="fac-trow" role="group" aria-label="Choose ' + id + '"><span class="fac-tlab">' + lab + '</span><button type="button" class="btn ghost sm fac-tb" data-ft="' + id + '" data-d="-1" aria-label="Decrease ' + id + '">−</button><output class="fac-tout" id="ft-' + id + '" aria-live="polite"></output><button type="button" class="btn ghost sm fac-tb" data-ft="' + id + '" data-d="1" aria-label="Increase ' + id + '">+</button></div>'; };
      inp.innerHTML = '<div class="fac-tin">' + row("a", MV.m("a")) + row("b", MV.m("b")) + '<p class="tiny muted">Whole numbers from 0 to 12, with ' + MV.m("b < a") + ".</p></div>";
      pv.innerHTML = '<div class="fac-tpv"><p class="tiny muted" style="margin:0 0 6px">' + MV.m("a!") + " written out; the struck tiles are the " + MV.m("b!") + ' that cancels</p><div class="fac-tstrip" id="ft-strip" aria-hidden="true"></div><p class="fac-tprod"><span id="ft-frac"></span> <span id="ft-prod" aria-live="polite"></span></p></div>';
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-ft]"); if (!b || b.disabled) return;
        var id = b.dataset.ft; a.S[id] = Math.max(0, Math.min(12, (a.S[id] | 0) + +b.dataset.d)); a.save(); paint(); a.update();
      });
      paint();
    },
    read:read,
    valid:function(d){ return d.b < d.a ? true : "Choose " + MV.m("b") + " smaller than " + MV.m("a") + ": " + MV.m("0 <= b < a <= 12") + "."; },
    checks:function(d){ var v = val(d); if (v == null) return [false, false, false]; return [d.a - d.b === 3, v >= 100 && v <= 1000, v % 10 === 0]; },
    key:function(d){
      var k = d.a + "," + d.b, st = MV.taskState(), n = st.found.length + (st.found.indexOf(k) < 0 ? 1 : 0);
      MV.C.task.after3 = n >= 4 ? MV.C.task.afterAll : "";
      return k;
    },
    label:function(k){ var p = k.split(","), d = { a:+p[0], b:+p[1] }; return MV.m("{" + d.a + "!}/{" + d.b + "!} = " + line(d)); },
    text:keyText
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ puzzles:puzzles },
  task:task
});
})();
