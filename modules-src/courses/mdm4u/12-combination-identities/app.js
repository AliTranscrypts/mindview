// MDM4U 12 Combination Identities: hero (15 committees of 2 drop into a grid, then sort into "with Sam" and "without Sam"),
// Identity prover (Explore: D5 Pascal's triangle explorer + a people panel; Symmetry / With or without Sam / Row sum;
// Show committees; algebra panel), Counting proofs (Part 3: N29 sentence-builder story stations with algebra beside),
// "Use the identities" (number entry that also accepts "no solution"), "Sam's fair split" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
var NS = " ";                                                     // narrow no-break space: 48 620
function big(v){ return MV.mdm.fmt(v).replace(/ /g, NS); }
function M(s){ return MV.m(s); }
function clampInt(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }
function C(n, r){ return r < 0 || r > n || n < 0 ? 0 : MV.mdm.nCr(n, r); }
function lin(t){ return t; }

// @component radioGroup (copied from MDM4U 10) — segmented control or chip row as a real radio group
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

// @component D5 pascalExplorer — Pascal's triangle explorer (course plan D5), self-contained. Rows and positions both start
// at 0 (row 4 is 1 4 6 4 1; C(4, 2) = 6 is position 2). Rows 0–15 (largest entry C(15, 7) = 6435), exact values from
// MV.mdm.nCr. Every entry is a button: tap (or arrow keys + Enter; one tab stop, roving focus) -> onTap(n, r).
//   D5.val(n, r) -> C(n, r), 0 outside 0 ≤ r ≤ n      D5.row(n) -> [C(n, 0) … C(n, n)]
//   D5.hockey(r, n) -> {cells:[[r, r] … [n, r]], sum:[n + 1, r + 1]} (hockey stick)   D5.fib(k) -> cells of shallow diagonal k
//   (path counting on a grid lives in MDM4U 08's D5 gridPaths.)
//   t = D5.view(host, {rows:10, label:"…", onTap(n, r)})
//   t.render({marks:{"n,r":"sel" | "mir" | "up1" | "up2" | "pick" (space-separated)}, row:n (shade a whole row), sums:true (row-sum
//            column, 2ⁿ), mod:k (entries not divisible by k get class nz), hide:true (numbers hidden), say:{"n,r":"role words"}})
//   Mark styles (app.css): sel = highlighter, mir = dashed mirror, up1 = blue --pen, up2 = teal --f3, row = --hi-soft.
//   Keep a worded legend beside it: colour is never the only signal.
var D5 = (function(){
  function val(n, r){ return C(n, r); }
  function row(n){ var a = []; for (var r = 0; r <= n; r++) a.push(val(n, r)); return a; }
  function hockey(r, n){ var c = []; for (var i = r; i <= n; i++) c.push([i, r]); return { cells:c, sum:[n + 1, r + 1] }; }
  function fib(k){ var c = []; for (var j = 0; 2 * j <= k; j++) c.push([k - j, j]); return c; }
  function view(host, o){
    var rows = Math.max(0, Math.min(15, o.rows == null ? 10 : o.rows)), cur = [0, 0], st = {};
    var h = '<div class="d5-wrap"><div class="d5-tri" role="group" aria-label="' + MV.esc(o.label || "Pascal’s triangle") + ", rows 0 to " + rows + '. Arrow keys move between entries.">';
    for (var n = 0; n <= rows; n++) {
      h += '<div class="d5-row"><span class="d5-cells">';
      for (var r = 0; r <= n; r++) h += '<button type="button" class="d5-c" data-n="' + n + '" data-r="' + r + '" tabindex="' + (n === 0 ? 0 : -1) + '"></button>';
      h += '</span><span class="d5-sum" aria-hidden="true"></span></div>';
    }
    host.innerHTML = h + "</div></div>";
    var tri = $(".d5-tri", host);
    function btn(n, r){ return tri.querySelector('[data-n="' + n + '"][data-r="' + r + '"]'); }
    function rove(n, r, focus){
      var b0 = btn(cur[0], cur[1]); if (b0) b0.tabIndex = -1;
      cur = [n, r]; var b = btn(n, r); if (!b) return; b.tabIndex = 0;
      if (focus) b.focus({ preventScroll:false });
    }
    tri.addEventListener("click", function(e){
      var b = e.target.closest(".d5-c"); if (!b) return;
      rove(+b.dataset.n, +b.dataset.r, false);
      if (o.onTap) o.onTap(+b.dataset.n, +b.dataset.r);
    });
    tri.addEventListener("keydown", function(e){
      var b = e.target.closest(".d5-c"); if (!b) return;
      var n = +b.dataset.n, r = +b.dataset.r, k = e.key;
      if (k === "ArrowLeft") r = Math.max(0, r - 1); else if (k === "ArrowRight") r = Math.min(n, r + 1);
      else if (k === "ArrowUp") { n = Math.max(0, n - 1); r = Math.min(r, n); } else if (k === "ArrowDown") n = Math.min(rows, n + 1);
      else if (k === "Home") r = 0; else if (k === "End") r = n; else return;
      e.preventDefault(); rove(n, r, true);
    });
    function render(s){
      st = s || {};
      var marks = st.marks || {}, say = st.say || {};
      tri.classList.toggle("sums", !!st.sums);
      tri.classList.toggle("hid", !!st.hide);
      for (var n = 0; n <= rows; n++) {
        for (var r = 0; r <= n; r++) {
          var b = btn(n, r), v = val(n, r), k = n + "," + r, m = marks[k] || "";
          b.className = "d5-c" + (m ? " " + m : "") + (st.row === n ? " row" : "") + (st.mod && v % st.mod !== 0 ? " nz" : "");
          b.textContent = st.hide ? "" : big(v);
          b.setAttribute("aria-label", "Row " + n + ", position " + r + ": C(" + n + ", " + r + ")" + (st.hide ? "" : " = " + v) + (say[k] ? ", " + say[k] : ""));
        }
        var sm = btn(n, 0).parentNode.nextSibling;
        sm.textContent = st.sums && !st.hide ? "= " + big(Math.pow(2, n)) : "";
        sm.classList.toggle("on", st.row === n);
      }
    }
    return { render:render, focus:function(n, r){ rove(n, r, true); }, el:tri };
  }
  return { val:val, row:row, hockey:hockey, fib:fib, view:view };
})();

// ---------- people and committees (the people panel) ----------
var NAMES = ["Sam", "Tia", "Ana", "Ben", "Dev", "Eli", "Fay", "Gus", "Hana", "Jo"];
var INIT = ["S", "T", "A", "B", "D", "E", "F", "G", "H", "J"];
var CMB = {};
// every committee of r from people 0 … n − 1, as bitmasks in dictionary order (Sam = bit 0 comes first)
function combos(n, r){
  var key = n + "," + r; if (CMB[key]) return CMB[key];
  var out = [];
  (function rec(start, left, mask){ if (!left) { out.push(mask); return; } for (var i = start; i <= n - left; i++) rec(i + 1, left - 1, mask | (1 << i)); })(0, r, 0);
  return (CMB[key] = out);
}
function members(mask, n){ var a = []; for (var i = 0; i < n; i++) if (mask & (1 << i)) a.push(i); return a; }
function av(i){ return '<i class="ci-av' + (i === 0 ? " ci-sam" : "") + '">' + INIT[i] + "</i>"; }
function cmHTML(mask, n, cls, attrs){
  var m = members(mask, n);
  return '<span class="ci-cm' + (m.length ? "" : " ci-empty") + (cls ? " " + cls : "") + '"' + (attrs || "") + ">" + (m.length ? m.map(av).join("") : "nobody") + "</span>";
}
function nameList(mask, n){ var m = members(mask, n); return m.length ? m.map(function(i){ return NAMES[i]; }).join(", ") : "nobody"; }

// ---------- Explore: Identity prover ----------
var MODES = [{ id:"sym", t:"Symmetry" }, { id:"pas", t:"With or without Sam" }, { id:"row", t:"Row sum" }];
var MNAME = { sym:"Symmetry", pas:"With or without Sam", row:"Row sum" };
function explore(host, api){
  var S = api.S;
  if (!MODES.some(function(x){ return x.id === S.mode; })) S.mode = "sym";
  S.n = clampInt(S.n, 2, 10, 6); S.r = clampInt(S.r, 0, S.n, 2);
  S.show = S.show !== false; S.alg = !!S.alg;
  S.guess = typeof S.guess === "string" ? S.guess : "";
  S.sw = (S.sw == null ? 5 : S.sw | 0) & ((1 << S.n) - 1);
  var pv = { hide:false }, anim = null, tapMsg = "";

  host.innerHTML =
    '<div class="ci-top" id="ci-mode"></div>' +
    '<div class="pg ci-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap ci-cap" id="ci-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="ci-people" id="ci-people"></div><p class="ci-swl" id="ci-swl" aria-live="polite"></p>' +
      '<div class="ci-panel" id="ci-panel"></div></div>' +
    '<div class="pg-ctrl"><div class="ci-sls" id="ci-sls"></div>' +
      '<div class="q-actions"><button type="button" class="btn sm" id="ci-show" data-k="cishow"></button></div>' +
      '<div class="ci-guess"><div class="numrow"><label for="ci-gin">Challenge 3: ' + M("C(n + 1, r + 1) =") + '</label><input class="numin short" id="ci-gin" type="text" inputmode="numeric" autocomplete="off"></div>' +
      '<p class="tiny muted ci-gnote">While this box has a value, the triangle panel is hidden.</p></div>' +
      '<p class="tiny muted" id="ci-how"></p></div>' +
    '<div class="pg-read"><div class="ci-tribox"><p class="ci-trih">Pascal’s triangle <span class="tiny muted">(rows 0 to 10; tap an entry)</span></p><div id="ci-tri"></div><div id="ci-trihid" class="ci-trihid" hidden></div>' +
      '<p class="ci-legend" id="ci-legend"></p><p class="tiny ci-tap" id="ci-tap" aria-live="polite"></p></div>' +
      '<dl class="read" id="ci-read" aria-live="polite"></dl>' +
      '<details class="alg" id="ci-alg"><summary>Check it with algebra</summary><div id="ci-algb"></div></details></div></div>';

  var modeR = radios($("#ci-mode", host), { label:"Identity", options:MODES, value:S.mode, cls:"seg",
    onChange:function(v){ user(); S.mode = v; tapMsg = ""; save(); render(); MV.changed(); } });
  $("#ci-sls", host).innerHTML =
    '<label class="slider"><span class="slider-top"><span>People ' + M("n") + '</span><output id="ci-n-out"></output></span><input type="range" id="ci-n-in" min="2" max="10" step="1"></label>' +
    '<label class="slider"><span class="slider-top"><span>Committee size ' + M("r") + '</span><output id="ci-r-out"></output></span><input type="range" id="ci-r-in" min="0" max="10" step="1"></label>';
  var nIn = $("#ci-n-in", host), rIn = $("#ci-r-in", host), gin = $("#ci-gin", host), alg = $("#ci-alg", host);
  var tri = D5.view($("#ci-tri", host), { rows:10, label:"Pascal’s triangle", onTap:function(n, r){
    user();
    if (n < 2) { tapMsg = M("C(" + n + ", " + r + ") = 1") + ". The " + M("n") + " slider starts at 2, so this entry isn’t a committee setting here."; paintTap(); return; }
    S.n = n; S.r = r; S.sw &= (1 << n) - 1;
    tapMsg = "Tapped " + M("C(" + n + ", " + r + ") = " + big(C(n, r))) + ": now " + M("n = " + n) + " and " + M("r = " + r) + ".";
    save(); render(); MV.changed();
  } });
  gin.value = S.guess; alg.open = S.alg;
  nIn.addEventListener("input", function(){ user(); S.n = +nIn.value; S.r = Math.min(S.r, S.n); S.sw &= (1 << S.n) - 1; tapMsg = ""; save(); render(); MV.changed(); });
  rIn.addEventListener("input", function(){ user(); S.r = Math.min(+rIn.value, S.n); tapMsg = ""; save(); render(); MV.changed(); });
  gin.addEventListener("input", function(){ S.guess = gin.value; save(); paintTri(); MV.changed(); });
  alg.addEventListener("toggle", function(){ S.alg = alg.open; save(); });
  $("#ci-show", host).addEventListener("click", function(){
    user(); S.show = !S.show; save();
    if (S.show) { newAnim(null, null); revealItems(paintPanel(true), finish); }
    else render();
    MV.changed();
  });
  $("#ci-people", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-sw]"); if (!b) return;
    user(); S.sw ^= 1 << +b.dataset.sw; save(); paintPeople(); paintMe();
  });

  function save(){ api.save(); }
  function user(){ if (anim) finish(); pv.hide = false; MV.banner("", ""); }

  // --- animation bookkeeping: any user action finishes the running animation at once (end() sets the final state) ---
  function newAnim(end, done){ if (anim) finish(); anim = { timers:[], stops:[], end:end || null, done:done || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function tween(o){ var a = anim; if (!a) return; a.stops.push(MV.tween({ dur:o.dur, ease:o.ease, step:function(t){ if (anim === a) o.step(t); }, done:function(){ if (anim === a) o.done(); } })); }
  function finish(){
    var a = anim; if (!a) return; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} });
    if (a.end) a.end();
    save(); render(); MV.changed();
    if (a.done) a.done();
  }
  // reveal committees one at a time (items in reveal order); counters tick as they appear
  function revealItems(items, next){
    var N = items.length, shown = 0, dur = Math.min(1900, 350 + N * 55);
    tween({ dur:dur, ease:lin, step:function(t){ var k = Math.round(t * N); while (shown < k) { tick(items[shown], shown + 1); shown++; } }, done:function(){ if (next) next(); } });
  }
  function tick(el, k){
    el.classList.remove("ci-hid");
    var c, box = $("#ci-panel", host);
    if (S.mode === "sym") { c = $("#ci-pcnt", box); if (c) c.textContent = String(k); }
    else if (S.mode === "pas") { c = $('[data-bc="' + el.dataset.b + '"]', box); if (c) c.textContent = String(+c.textContent + 1 || 1); }
    else {
      c = $('[data-cc="' + el.dataset.k + '"]', box); if (c) c.textContent = String((+c.textContent || 0) + 1);
      var tt = $("#ci-total", box); if (tt) tt.innerHTML = "Running total: <strong>" + big(k) + "</strong>";
    }
  }

  // --- painting ---
  function render(){
    modeR.set(S.mode); paintSliders(); paintShow(); paintPeople(); paintPanel(false); paintTri(); paintRead(); paintCap(); paintAlg(); paintHow(); paintTap();
  }
  function paintSliders(){
    nIn.value = S.n; nIn.setAttribute("aria-valuetext", "n = " + S.n); $("#ci-n-out", host).textContent = String(S.n);
    rIn.max = S.n; rIn.value = S.r; rIn.setAttribute("aria-valuetext", "r = " + S.r); $("#ci-r-out", host).textContent = String(S.r);
  }
  function paintShow(){ var b = $("#ci-show", host); b.textContent = S.show ? "Hide committees" : "Show committees"; b.setAttribute("aria-pressed", String(S.show)); }
  function paintPeople(){
    var n = S.n, box = $("#ci-people", host), row = S.mode === "row";
    MV.keepFocus(box, function(){
      var h = '<p class="ci-plab">' + (row ? "In/out switches: tap a person to put them in or out" : n + " people") + '</p><div class="ci-prow' + (row ? " ci-swrow" : "") + '"' + (row ? ' role="group" aria-label="In or out switches"' : "") + ">";
      for (var i = 0; i < n; i++) {
        var on = !!(S.sw & (1 << i));
        if (row) h += '<button type="button" class="ci-sw' + (on ? " on" : "") + '" data-sw="' + i + '" data-k="sw' + i + '" aria-pressed="' + on + '" aria-label="' + NAMES[i] + ": " + (on ? "in" : "out") + '">' + av(i) + '<span class="ci-swt" aria-hidden="true">' + (on ? "in" : "out") + "</span></button>";
        else h += '<span class="ci-p">' + av(i) + '<span class="ci-pn">' + NAMES[i] + "</span></span>";
      }
      box.innerHTML = h + "</div>";
    });
    var sl = $("#ci-swl", host);
    if (row) { var k = members(S.sw, n).length; sl.innerHTML = "This switch pattern is one committee: <strong>" + nameList(S.sw, n) + "</strong> (size " + k + "), marked in column " + k + "."; }
    else sl.innerHTML = "";
  }
  function paintMe(){ $$("[data-m]", $("#ci-panel", host)).forEach(function(el){ el.classList.toggle("ci-me", +el.dataset.m === S.sw); }); }
  // the people panel's committee display for the mode; hid = start every committee hidden (for a reveal). Returns the
  // committee elements in reveal order.
  function paintPanel(hid){
    var n = S.n, r = S.r, box = $("#ci-panel", host), h = "", q = pv.hide || hid, items = [];
    var showC = S.show || hid;
    if (S.mode === "sym") {
      var L = combos(n, r), full = (1 << n) - 1;
      h += '<p class="ci-phead">' + (showC ? '<strong id="ci-pcnt">' + (q ? (hid ? "0" : "?") : big(L.length)) + "</strong> " : (q ? "? " : big(L.length) + " ")) + "committee" + (L.length === 1 && !q ? "" : "s") + " of " + r + ", each joined to the group of " + (n - r) + " it leaves out</p>";
      if (showC) {
        h += '<div class="ci-box"><div class="ci-symh" aria-hidden="true"><span>On the committee</span><span>Left out</span></div><ol class="ci-pairs" aria-hidden="true">' +
          L.map(function(m){ return '<li class="ci-pair' + (hid ? " ci-hid" : "") + '">' + cmHTML(m, n) + '<span class="ci-ln"></span>' + cmHTML(full & ~m, n, "ci-out") + "</li>"; }).join("") + "</ol></div>";
      } else h += '<p class="muted tiny">Press <strong>Show committees</strong> to list them.</p>';
    } else if (S.mode === "pas") {
      var P = combos(n, r), w = P.filter(function(m){ return m & 1; }), wo = P.filter(function(m){ return !(m & 1); });
      var bin = function(key, cls, title, list){
        return '<section class="ci-bin ' + cls + '"><h4 class="ci-binh">' + title + ' <span class="ci-bc" data-bc="' + key + '">' + (hid ? "0" : q ? "?" : big(list.length)) + "</span></h4>" +
          (showC ? '<div class="ci-binl" aria-hidden="true">' + list.map(function(m){ return cmHTML(m, n, hid ? "ci-hid" : "", ' data-b="' + key + '" data-i="' + P.indexOf(m) + '"'); }).join("") + "</div>" : '<p class="muted tiny">Press <strong>Show committees</strong> to sort them.</p>') + "</section>";
      };
      h += '<p class="ci-phead">Every committee of ' + r + " from " + n + " people goes into exactly one bin.</p>";
      h += '<div class="ci-bins">' + bin("w", "ci-bw", "With Sam", w) + bin("wo", "ci-bwo", "Without Sam", wo) + "</div>";
    } else {
      var dots = n >= 6, tot = 0, terms = [];
      h += '<p class="ci-phead">Committees of every size, from 0 to ' + n + (dots ? " (each dot is one committee)" : "") + "</p>";
      h += '<div class="ci-box ci-colbox"><div class="ci-cols' + (dots ? " ci-dots" : "") + '" style="--dpr:' + Math.max(3, n - 4) + '" aria-hidden="true">';
      for (var k = 0; k <= n; k++) {
        var Lk = combos(n, k); tot += Lk.length; terms.push(big(Lk.length));
        h += '<div class="ci-col"><span class="ci-colc" data-cc="' + k + '">' + (hid ? "0" : q ? "?" : big(Lk.length)) + '</span><div class="ci-colb">' +
          (showC ? Lk.map(function(m){ var a = ' data-k="' + k + '" data-m="' + m + '"', c = (hid ? "ci-hid" : "") + (m === S.sw ? " ci-me" : ""); return dots ? '<i class="ci-dot ' + c + '"' + a + "></i>" : cmHTML(m, n, c, a); }).join("") : "") +
          '</div><span class="ci-colk">size ' + k + "</span></div>";
      }
      h += "</div></div>";
      h += '<p class="ci-total" id="ci-total" aria-live="polite">' + (hid ? "Running total: <strong>0</strong>" : q ? "Running total: ?" : terms.join(" + ") + " = " + big(tot) + " = " + M("2^" + n)) + "</p>";
      if (!showC) h += '<p class="muted tiny">Press <strong>Show committees</strong> to fill the columns.</p>';
    }
    box.innerHTML = h;
    if (hid) {
      items = $$(".ci-hid", box);
      if (S.mode === "pas") items.sort(function(a, b){ return +a.dataset.i - +b.dataset.i; });
    }
    return items;
  }
  function triHidden(){ return pv.hide || S.guess.trim() !== ""; }
  function paintTri(){
    var n = S.n, r = S.r, marks = {}, say = {}, hide = triHidden(), hb = $("#ci-trihid", host);
    $("#ci-tri", host).hidden = hide; hb.hidden = !hide;
    hb.innerHTML = pv.hide ? "The triangle is hidden until the reveal." : "The triangle is hidden while the Challenge 3 box has a value. Clear the box to see it again.";
    function mk(a, b, cls, words){ var k = a + "," + b; marks[k] = (marks[k] ? marks[k] + " " : "") + cls; say[k] = (say[k] ? say[k] + "; " : "") + words; }
    mk(n, r, "sel", "C(n, r)");
    var lg = '<span class="ci-lg"><i class="d5-c sel" aria-hidden="true"></i> ' + M("C(" + n + ", " + r + ")") + "</span>";
    if (S.mode === "sym") {
      if (n - r !== r) mk(n, n - r, "mir", "its mirror C(n, n − r)");
      lg += ' <span class="ci-lg"><i class="d5-c mir" aria-hidden="true"></i> mirror ' + M("C(" + n + ", " + (n - r) + ")") + (n - r === r ? " (the same entry: it’s in the middle)" : "") + "</span>";
    } else if (S.mode === "pas") {
      if (r >= 1) mk(n - 1, r - 1, "up1", "with Sam");
      if (r <= n - 1) mk(n - 1, r, "up2", "without Sam");
      lg += ' <span class="ci-lg"><i class="d5-c up1" aria-hidden="true"></i> with Sam ' + (r >= 1 ? M("C(" + (n - 1) + ", " + (r - 1) + ")") : "(none)") + '</span> <span class="ci-lg"><i class="d5-c up2" aria-hidden="true"></i> without Sam ' + (r <= n - 1 ? M("C(" + (n - 1) + ", " + r + ")") : "(none)") + "</span>";
    } else lg += ' <span class="ci-lg"><i class="d5-c row" aria-hidden="true"></i> row ' + n + "; the column at the right gives each row’s sum</span>";
    tri.render({ marks:marks, say:say, row:S.mode === "row" ? n : null, sums:S.mode === "row" });
    $("#ci-legend", host).innerHTML = hide ? "" : lg;
  }
  function paintTap(){ $("#ci-tap", host).innerHTML = triHidden() ? "" : tapMsg; }
  function paintRead(){
    var n = S.n, r = S.r, q = pv.hide, rows = [], v = C(n, r), hv = function(x){ return q ? "?" : x; };
    rows.push([M("C(n, r)"), q ? M("C(" + n + ", " + r + ") = ?") : M("C(" + n + ", " + r + ") = " + big(v))]);
    if (S.mode === "sym") rows.push(["Mirror", M("C(" + n + ", " + (n - r) + ") = " + hv(big(C(n, n - r))))]);
    else if (S.mode === "pas") {
      var w = C(n - 1, r - 1), wo = C(n - 1, r);
      rows.push(['<span class="ci-kw">With Sam</span>', r >= 1 ? M("C(" + (n - 1) + ", " + (r - 1) + ") = " + hv(big(w))) : hv("0: a committee of nobody can’t include Sam")]);
      rows.push(['<span class="ci-kwo">Without Sam</span>', r <= n - 1 ? M("C(" + (n - 1) + ", " + r + ") = " + hv(big(wo))) : hv("0: everyone, Sam included, is on it")]);
      rows.push(["Total two ways", q ? "?" : M(big(w) + " + " + big(wo) + " = " + big(v) + " = C(" + n + ", " + r + ")")]);
    } else {
      var terms = D5.row(n).map(big).join(" + ");
      rows.push(["All sizes", q ? "?" : M(terms + " = " + big(Math.pow(2, n)) + " = 2^" + n)]);
    }
    $("#ci-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(){
    var n = S.n, r = S.r, cap = $("#ci-cap", host), v = C(n, r);
    if (pv.hide) { cap.innerHTML = '<span class="ci-capq">Watch the committees…</span>'; return; }
    if (S.mode === "sym") cap.innerHTML = M("C(" + n + ", " + r + ") = C(" + n + ", " + (n - r) + ") = " + big(v));
    else if (S.mode === "pas") {
      if (r === 0) cap.innerHTML = M("C(" + n + ", 0) = C(" + (n - 1) + ", 0) = 1") + ' <span class="ci-capn">(no committee of nobody includes Sam)</span>';
      else if (r === n) cap.innerHTML = M("C(" + n + ", " + n + ") = C(" + (n - 1) + ", " + (n - 1) + ") = 1") + ' <span class="ci-capn">(everyone is on it, Sam included)</span>';
      else cap.innerHTML = M("C(" + n + ", " + r + ") = C(" + (n - 1) + ", " + (r - 1) + ") + C(" + (n - 1) + ", " + r + ")") + ": " + M(big(v) + " = " + big(C(n - 1, r - 1)) + " + " + big(C(n - 1, r)));
    } else cap.innerHTML = M("C(" + n + ", 0) + … + C(" + n + ", " + n + ") = 2^" + n + " = " + big(Math.pow(2, n)));
  }
  function line(s){ return "<div>" + s + "</div>"; }
  function paintAlg(){
    var n = S.n, r = S.r, h = "";
    if (pv.hide) { $("#ci-algb", host).innerHTML = '<p class="tiny muted" style="margin:8px 0 0">The algebra appears after the reveal.</p>'; return; }
    if (S.mode === "sym") {
      h = line(M("C(n, n - r) = {n!}/{(n - r)! (n - (n - r))!}")) + line(M("= {n!}/{(n - r)! r!} = C(n, r)")) + line("<small>The two factorials below the line just swap places.</small>") +
        line("<small>Now:</small> " + M("C(" + n + ", " + (n - r) + ") = {" + n + "!}/{" + (n - r) + "! " + r + "!} = " + big(C(n, r)) + " = C(" + n + ", " + r + ")"));
    } else if (S.mode === "pas") {
      h = line(M("C(n - 1, r - 1) + C(n - 1, r) = {(n - 1)!}/{(r - 1)! (n - r)!} + {(n - 1)!}/{r! (n - r - 1)!}")) +
        line("<small>Common denominator " + M("r!(n - r)!") + ":</small>") +
        line(M("= {r(n - 1)!}/{r!(n - r)!} + {(n - r)(n - 1)!}/{r!(n - r)!}")) +
        line(M("= {(r + (n - r))(n - 1)!}/{r!(n - r)!} = {n!}/{r!(n - r)!} = C(n, r)")) +
        line("<small>(For " + M("1 <= r <= n - 1") + "; at the ends both sides are 1.)</small>") +
        line("<small>Now:</small> " + (r >= 1 && r <= n - 1 ?
          M("C(" + (n - 1) + ", " + (r - 1) + ") + C(" + (n - 1) + ", " + r + ") = " + big(C(n - 1, r - 1)) + " + " + big(C(n - 1, r)) + " = " + big(C(n, r)) + " = C(" + n + ", " + r + ")") :
          M("C(" + n + ", " + r + ") = 1") + " <small>(only one of the two groups has a committee)</small>"));
    } else {
      h = line("<small>Each of the " + M("n") + " people is in or out: 2 choices each.</small>") + line(M("2 × 2 × … × 2 = 2^n") + " <small>(" + M("n") + " factors)</small>") +
        line("<small>Grouping the in/out patterns by how many people are in gives " + M("C(n, 0) + C(n, 1) + … + C(n, n)") + ".</small>") +
        line("<small>Now:</small> " + M(D5.row(n).map(big).join(" + ") + " = " + big(Math.pow(2, n)) + " = 2^" + n));
    }
    $("#ci-algb", host).innerHTML = '<div class="alg-lines">' + h + "</div>";
  }
  function paintHow(){
    $("#ci-how", host).innerHTML = "Drag the sliders or tap an entry in the triangle. <strong>Show committees</strong> lists every committee (up to 252 in one list" + (S.mode === "row" ? "; from 6 people on, each dot is one committee" : "") + ")." +
      (S.mode === "row" ? " Tap a person’s switch to put them in or out: their committee is marked in its column." : "");
  }

  render();

  // --- predictions ---
  function startPred(p){
    if (anim) finish();
    var s = p.start || {};
    S.mode = s.mode; S.n = s.n; S.r = s.r; S.show = false; S.sw &= (1 << S.n) - 1; tapMsg = "";
    pv = { hide:true }; save(); render(); MV.changed();
  }
  function runPred(p, done){
    S.show = true; save(); paintShow();
    newAnim(function(){ S.show = true; pv.hide = false; }, done);
    var items = paintPanel(true);
    later(250, function(){
      revealItems(items, function(){ later(550, function(){ pv.hide = false; render(); later(800, finish); }); });
    });
  }

  return {
    predict:{ start:startPred, run:runPred },
    challenge:function(id, opt){ return chal(id, opt || {}); }
  };

  function chal(id, opt){
    var n = S.n, r = S.r;
    if (id === "tc1") {
      if (n !== 9) return { ok:false, msg:"Set " + M("n = 9") + " first: the challenge is about " + M("C(9, r)") + "." };
      if (r === 6) return { ok:true };
      if (r === 3) return { ok:false, msg:"Find a <strong>different</strong> " + M("r") + "." };
      if (r === 4) return { ok:false, msg:M("C(9, 4) = 126") + ", but " + M("C(9, 3) = 84") + "." };
      return { ok:false, msg:M("C(9, " + r + ") = " + big(C(9, r))) + ", but " + M("C(9, 3) = 84") + "." };
    }
    if (id === "tc2") {
      var w = C(n - 1, r - 1), wo = C(n - 1, r);
      if (S.mode !== "pas") return { ok:false, msg:"Switch the identity to <strong>With or without Sam</strong> first." };
      if (n === 6 && r === 3) return { ok:true };
      if (n === 6 && r === 2) return { ok:false, msg:"With Sam 5, without 10." };
      if (n === 5 && r === 3) return { ok:false, msg:"With Sam " + M("C(4, 2) = 6") + "." };
      return { ok:false, msg:"With Sam " + big(w) + ", without " + big(wo) + ". Both need to be 10." };
    }
    if (id === "tc3") {
      if (opt.live) return { ok:false };                         // a typed value gets no live tick
      var raw = S.guess.trim().replace(/[\s,  ]/g, ""), v = /^\d+$/.test(raw) ? parseInt(raw, 10) : null;
      if (n === 15 && r === 1) return { ok:false, msg:M("C(15, 1) = 15") + " but " + M("C(15, 2) = 105") + "." };
      if (v == null) return { ok:false, msg:"Type your value of " + M("C(n + 1, r + 1)") + " in the <strong>Challenge 3</strong> box first, as a whole number." };
      if (v === 300) return { ok:false, msg:"Pascal’s identity adds the two values: 15 + 20." };
      var nrOk = n === 6 && r === 2;
      if (v === 35 && !nrOk) return { ok:false, msg:"The value is right; now set " + M("n") + " and " + M("r") + " to match." };
      if (nrOk && v === 35) return { ok:true };
      if (!nrOk) return { ok:false, msg:"Set " + M("n") + " and " + M("r") + " so that " + M("C(n, r) = 15") + " and " + M("C(n, r + 1) = 20") + ". Now they are " + big(C(n, r)) + " and " + big(C(n, r + 1)) + "." };
      return { ok:false, msg:"Use Pascal’s identity: " + M("C(n + 1, r + 1) = C(n, r) + C(n, r + 1)") + "." };
    }
    return { ok:false };
  }
}

// ---------- hero: 15 committees of 2 drop into a grid, then sort into "with Sam" (5) and "without Sam" (10) ----------
function hero(f){
  var svg = $("#ci-h-svg"), cap = f.cap;
  if (!svg) return;
  var L = combos(6, 2), wi = 0, woi = 0;
  var grid = L.map(function(_, i){ return [60 + (i % 5) * 70, 92 + Math.floor(i / 5) * 32]; });
  var bins = L.map(function(m){ if (m & 1) { var k = wi++; return [52 + (k % 2) * 70, 238 + Math.floor(k / 2) * 29]; } var j = woi++; return [206 + (j % 4) * 52, 238 + Math.floor(j / 4) * 29]; });
  var h = "";
  for (var i = 0; i < 6; i++) {
    var x = 50 + i * 60;
    if (!i) h += '<circle class="ci-hring" cx="' + x + '" cy="30" r="19"/>';
    h += '<circle class="ci-hav" cx="' + x + '" cy="30" r="14.5"/><text class="ci-hin" x="' + x + '" y="30">' + INIT[i] + '</text><text class="ci-hnm" x="' + x + '" y="60">' + NAMES[i] + "</text>";
  }
  h += '<rect class="ci-hbw" x="10" y="192" width="154" height="132" rx="10"/><rect class="ci-hbwo" x="172" y="192" width="218" height="132" rx="10"/>' +
    '<text class="ci-hbt ci-hbtw" id="ci-hbtw" x="87" y="212">with Sam</text><text class="ci-hbt ci-hbtwo" id="ci-hbtwo" x="281" y="212">without Sam</text>';
  L.forEach(function(m, k){
    var a = members(m, 6), g = '<g class="ci-hp" data-k="' + k + '"><rect x="-23" y="-12" width="46" height="24" rx="12"/>';
    a.forEach(function(p, j){ var cx = j ? 11 : -11; g += (p === 0 ? '<circle class="ci-hring sm" cx="' + cx + '" cy="0" r="10.5"/>' : "") + '<circle class="ci-hav" cx="' + cx + '" cy="0" r="8.5"/><text class="ci-hin sm" x="' + cx + '" y="0">' + INIT[p] + "</text>"; });
    h += g + "</g>";
  });
  svg.innerHTML = h;
  var pills = $$(".ci-hp", svg), tw = $("#ci-hbtw", svg), two = $("#ci-hbtwo", svg);
  function place(k, x, y, op){ pills[k].setAttribute("transform", "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ")"); pills[k].style.opacity = op; }
  function easeOut(t){ return 1 - Math.pow(1 - t, 3); }
  function finalFrame(){
    L.forEach(function(_, k){ place(k, bins[k][0], bins[k][1], 1); });
    tw.textContent = "with Sam: 5"; two.textContent = "without Sam: 10";
    cap.innerHTML = M("C(6, 2) = C(5, 1) + C(5, 2)") + ": " + M("15 = 5 + 10");
  }
  if (MV.reduceMotion) { finalFrame(); return; }
  L.forEach(function(_, k){ place(k, grid[k][0], grid[k][1] - 40, 0); });
  cap.textContent = "Six people. Sam wears the yellow ring.";
  MV.wait(900, function(){
    cap.innerHTML = "Every committee of 2: " + M("C(6, 2) = 15");
    var D = 15 * 110 + 420;
    MV.tween({ dur:D, ease:lin, step:function(t){
      var el = t * D;
      L.forEach(function(_, k){ var p = Math.max(0, Math.min(1, (el - k * 110) / 420)); place(k, grid[k][0], grid[k][1] - 40 * (1 - easeOut(p)), p); });
    }, done:function(){
      MV.wait(800, function(){
        cap.textContent = "Sort: does the committee include Sam?";
        MV.tween({ dur:1500, step:function(t){
          L.forEach(function(_, k){ place(k, grid[k][0] + (bins[k][0] - grid[k][0]) * t, grid[k][1] + (bins[k][1] - grid[k][1]) * t, 1); });
        }, done:function(){
          tw.textContent = "with Sam: 5"; two.textContent = "without Sam: 10";
          cap.innerHTML = M("C(6, 2) = C(5, 1) + C(5, 2)");
          MV.wait(900, finalFrame);
        } });
      });
    } });
  });
}

// ---------- Part 3: Counting proofs (story stations) ----------
// @component N29 sentenceBuilder (copied from MHF4U 08; adds o.order, a display order for each slot's chips) — a sentence
// with chip slots: tap a blank, then a chip from its bank; judge() checks each slot (chips marked ok:true), mark() colours
// slots, lock() freezes it. value maps slot id -> chip index in the content's list.
function sentenceBuilder(host, o){
  var val = Object.assign({}, o.value || {}), ids = [], active = null, locked = !!o.locked, marks = {};
  o.tpl.replace(/\{(\w+)\}/g, function(_, id){ ids.push(id); return ""; });
  function order(id){ return (o.order && o.order[id]) || o.slots[id].chips.map(function(_, i){ return i; }); }
  function nextEmpty(after){
    var i0 = after ? ids.indexOf(after) + 1 : 0;
    for (var k = 0; k < ids.length; k++) { var id = ids[(i0 + k) % ids.length]; if (val[id] == null) return id; }
    return null;
  }
  function paint(focusSel){
    var h = '<p class="sb-line">' + o.tpl.split(/(\{\w+\})/).map(function(pt){
      var m = /^\{(\w+)\}$/.exec(pt);
      if (!m) return pt;
      var id = m[1], sl = o.slots[id], c = val[id] != null ? sl.chips[val[id]] : null, n = ids.indexOf(id) + 1;
      return '<button type="button" class="sb-slot' + (c ? " full" : "") + (active === id ? " on" : "") + (marks[id] ? " " + marks[id] : "") + '" data-sb-slot="' + id + '" data-k="' + o.key + "s" + id + '" aria-pressed="' + (active === id) + '" aria-label="Blank ' + n + " of " + ids.length + ", " + MV.esc(sl.label) + ": " + (c ? MV.esc(MV.plain(c.t)) : "empty") + (marks[id] === "bad" ? " (needs another look)" : "") + '"' + (locked ? " disabled" : "") + ">" + (c ? c.t : "<span class=\"vh\">empty</span>") + "</button>";
    }).join("") + "</p>";
    if (active && !locked) {
      var sl = o.slots[active];
      h += '<div class="sb-bank" role="group" aria-label="Choices for ' + MV.esc(sl.label) + '"><span class="sb-bank-lab">' + MV.cap(sl.label) + ":</span>" + order(active).map(function(i){
        var c = sl.chips[i];
        return '<button type="button" class="chip' + (val[active] === i ? " on" : "") + '" data-sb-chip="' + i + '" data-k="' + o.key + "c" + active + i + '" aria-pressed="' + (val[active] === i) + '">' + c.t + "</button>";
      }).join("") + "</div>";
    } else if (!locked) h += '<p class="tiny muted sb-tip">Tap a blank, then choose the words for it.</p>';
    MV.keepFocus(host, function(){ host.innerHTML = h; });
    if (focusSel) { var f = host.querySelector(focusSel); if (f) f.focus({ preventScroll:true }); }
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || locked) return;
    if (b.dataset.sbSlot) { active = active === b.dataset.sbSlot ? null : b.dataset.sbSlot; paint(active ? ".sb-bank .chip" : null); return; }
    if (b.dataset.sbChip != null && active) {
      var cur = active; val[cur] = +b.dataset.sbChip; marks[cur] = null;
      active = nextEmpty(cur);
      paint(active ? ".sb-bank .chip" : '[data-sb-slot="' + cur + '"]');
      if (o.onChange) o.onChange(Object.assign({}, val));
    }
  });
  paint();
  return {
    get:function(){ return Object.assign({}, val); },
    set:function(v){ val = Object.assign({}, v || {}); marks = {}; active = null; paint(); },
    judge:function(){
      var empty = [], bad = [], mk = {};
      ids.forEach(function(id){ var c = val[id] != null ? o.slots[id].chips[val[id]] : null; if (!c) empty.push(id); else if (!MV.ok(c)) { bad.push({ id:id, fb:c.fb || "" }); mk[id] = "bad"; } else mk[id] = "good"; });
      return { ok:!empty.length && !bad.length, empty:empty, bad:bad, marks:mk };
    },
    mark:function(m){ marks = m || {}; active = null; paint(); },
    lock:function(on){ locked = !!on; active = null; paint(); }
  };
}

function part3(host, api){
  var S = api.S, ST = api.content.stations;
  S.st = S.st && typeof S.st === "object" ? S.st : {};
  ST.forEach(function(s){ var x = S.st[s.id] || (S.st[s.id] = {}); x.val = x.val && typeof x.val === "object" ? x.val : {}; x.tries = x.tries | 0; x.solved = !!x.solved; });
  host.innerHTML = ST.map(function(s, i){
    return '<div class="ci3-st' + (i ? " part" : "") + '" data-st="' + s.id + '"><h3 class="ci3-h">' + s.title + '</h3><p class="ci3-id">' + s.identity + "</p>" +
      '<div class="sym ci3-grid"><div><div class="ci3-body"></div><div class="q-actions"><button type="button" class="btn primary sm" data-act="stcheck" data-k="' + s.id + 'chk">Check my story</button><button type="button" class="btn ghost sm" data-act="streset" data-k="' + s.id + 'rst">Start again</button></div><div class="ci3-fb" aria-live="polite"></div></div>' +
      '<div><details class="alg ci3-alg"><summary>Check it with algebra</summary><div class="alg-lines">' + s.alg.map(function(l){ return "<div>" + l + "</div>"; }).join("") + "</div></details></div></div></div>";
  }).join("");
  var sbs = {}, msg = {};
  ST.forEach(function(s){
    var el = $('[data-st="' + s.id + '"]', host), x = S.st[s.id], body = $(".ci3-body", el);
    if (s.slots) {
      var ord = {};
      Object.keys(s.slots).forEach(function(k){ ord[k] = MV.shuffle(s.slots[k].chips.map(function(_, i){ return i; }), "mdm4u-12-" + s.id + k); });
      sbs[s.id] = sentenceBuilder(body, { tpl:s.tpl, slots:s.slots, order:ord, value:x.val, key:s.id, locked:x.solved, onChange:function(v){ x.val = v; msg[s.id] = ""; paintFb(s); api.save(); } });
    } else paintStories(s);
    paintFb(s);
  });
  function storyOrder(s){ return MV.shuffle(s.stories.map(function(_, i){ return i; }), "mdm4u-12-" + s.id); }
  function paintStories(s){
    var el = $('[data-st="' + s.id + '"]', host), x = S.st[s.id], body = $(".ci3-body", el);
    MV.keepFocus(body, function(){
      body.innerHTML = '<p class="ci3-ask">' + s.ask + '</p><div class="ci3-stories" role="radiogroup" aria-label="Stories">' + storyOrder(s).map(function(i){
        var on = x.pick === i, c = "ci3-story" + (on ? " on" : "") + (on && x.mark ? " " + x.mark : "");
        return '<button type="button" role="radio" class="' + c + '" data-story="' + i + '" data-k="' + s.id + "y" + i + '" aria-checked="' + on + '"' + (x.solved ? " disabled" : "") + ">" + s.stories[i].t + "</button>";
      }).join("") + "</div>";
    });
  }
  function paintFb(s){
    var el = $('[data-st="' + s.id + '"]', host), x = S.st[s.id], fb = $(".ci3-fb", el);
    $('[data-act="stcheck"]', el).disabled = x.solved;
    $('[data-act="streset"]', el).disabled = x.solved;
    var extra = s.stories ? s.stories[MV.right(s.stories)].fb + " " : "";
    if (x.solved) fb.innerHTML = '<div class="fb good" role="status"><p><strong>✓ Story complete.</strong> ' + extra + s.done + (x.tries ? ' <span class="muted">(not first try)</span>' : "") + "</p></div>";
    else fb.innerHTML = msg[s.id] || "";
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var el = b.closest("[data-st]"); if (!el) return;
    var s = ST.filter(function(z){ return z.id === el.dataset.st; })[0], x = S.st[s.id];
    if (b.dataset.story != null) { x.pick = +b.dataset.story; x.mark = null; msg[s.id] = ""; api.save(); paintStories(s); paintFb(s); return; }
    if (b.dataset.act === "streset") {
      x.val = {}; x.pick = null; x.mark = null; msg[s.id] = "";
      if (sbs[s.id]) sbs[s.id].set({}); else paintStories(s);
      api.save(); paintFb(s); return;
    }
    if (b.dataset.act === "stcheck") check(s, x, el);
  });
  function check(s, x, el){
    if (x.solved) return;
    if (!s.slots) {
      if (x.pick == null) { msg[s.id] = MV.fbHTML("", "Choose a story first."); paintFb(s); return; }
      var st = s.stories[x.pick];
      if (MV.ok(st)) { x.solved = true; x.mark = "good"; msg[s.id] = ""; }
      else { x.tries++; x.mark = "bad"; msg[s.id] = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + st.fb); }
      api.save(); paintStories(s); paintFb(s); MV.focusFb(el); return;
    }
    var sb = sbs[s.id], j = sb.judge();
    sb.mark(j.marks);
    if (j.empty.length) { msg[s.id] = MV.fbHTML("bad", "<strong>Fill every blank first.</strong> " + j.empty.length + " still empty."); paintFb(s); MV.focusFb(el); return; }
    if (j.ok) { x.solved = true; sb.lock(true); }
    else {
      x.tries++;
      var seen = {}, list = [];
      j.bad.forEach(function(bd){ if (seen[bd.fb]) return; seen[bd.fb] = 1; list.push("<li><strong>" + MV.cap(s.slots[bd.id].label) + ":</strong> " + bd.fb + "</li>"); });
      msg[s.id] = '<div class="fb bad" role="status"><p><strong>✗ Not quite. Fix the marked blanks:</strong></p><ul>' + list.join("") + "</ul></div>";
    }
    api.save(); paintFb(s); MV.focusFb(el);
  }
}

// ---------- Practice: "Use the identities" ----------
// @component N4 numEntryWords — number entry (copied from the toolkit's N4 numeric activity) that also takes word answers
// such as "no solution": items[].words = [{re:"regex source", fb}] give named feedback for typed words; "r = 5" is read as 5.
function numWords(host, api, a){
  var st = api.S; st.items = st.items || {};
  var msgs = {};
  function ist(id){ return st.items[id] || (st.items[id] = { val:"", tries:0, hint:0, solved:false, first:null }); }
  function judge(it, raw){
    var s = String(raw == null ? "" : raw).trim();
    var w = (it.words || []).filter(function(x){ return new RegExp(x.re, "i").test(s); })[0];
    if (w) return { ok:false, fb:w.fb };
    s = s.replace(/^[a-z]\s*=\s*/i, "").replace(/[  ]/g, "");
    var vals = MV.parseNum(s);
    if (!vals || vals.length !== 1 || !isFinite(vals[0])) return { bad:true };
    var ans = MV.ans(it);
    if (Math.abs(vals[0] - ans) < 1e-9) return { ok:true };
    var named = (it.wrong || []).filter(function(x){ return Math.abs(vals[0] - x.match) < 1e-9; })[0];
    return { ok:false, fb:named ? named.fb : null };
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">' + (a.how || "Type your answer, then press Check.") + "</p>" + a.items.map(function(it, i){
        var x = ist(it.id);
        var h = '<div class="q" data-ni="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        h += '<div class="numrow"><label for="nw-' + it.id + '">' + (it.label || "Your answer:") + '</label><input class="numin" id="nw-' + it.id + '" data-nin="' + it.id + '" type="text" inputmode="' + (it.words ? "text" : "decimal") + '" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + "></div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + MV.hintsHTML(it.hints, x.hint);
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct' + (it.display ? ": " + it.display : "") + ".</strong> " + (it.why || "") + "</p></div>";
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
    var it = a.items.filter(function(z){ return z.id === box.dataset.ni; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x.val);
      if (r.bad) { msgs[it.id] = "Enter a whole number, such as 12" + (it.words ? ", or type “no solution”." : "."); paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (r.fb || "Check your work and try again."); }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ni="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Sam's fair split ----------
var task = (function(){
  var api = null, S = null, pv = null;
  function d(){ return { n:S.n, r:S.r }; }
  function vals(n, r){ return { tot:C(n, r), w:C(n - 1, r - 1), wo:C(n - 1, r), st:r < 2 ? 0 : C(n - 2, r - 2) }; }
  function paint(){
    var n = S.n, r = S.r, v = vals(n, r), rowv = D5.row(n - 1);
    $("#ci-tk-n-out").textContent = String(n); $("#ci-tk-r-out").textContent = String(r);
    var ni = $("#ci-tk-n"), ri = $("#ci-tk-r");
    ni.value = n; ni.setAttribute("aria-valuetext", "n = " + n); ri.max = n; ri.value = r; ri.setAttribute("aria-valuetext", "r = " + r);
    pv.innerHTML = '<dl class="read ci-tk-read" aria-live="polite">' + MV.readoutHTML([
      ["Total " + M("C(n, r)"), M("C(" + n + ", " + r + ") = " + big(v.tot))],
      ['<span class="ci-kw">With Sam</span> ' + M("C(n - 1, r - 1)"), r >= 1 ? M("C(" + (n - 1) + ", " + (r - 1) + ") = " + big(v.w)) : "0"],
      ['<span class="ci-kwo">Without Sam</span> ' + M("C(n - 1, r)"), r <= n - 1 ? M("C(" + (n - 1) + ", " + r + ") = " + big(v.wo)) : "0"],
      ["With Sam and Tia " + M("C(n - 2, r - 2)"), r >= 2 ? M("C(" + (n - 2) + ", " + (r - 2) + ") = " + big(v.st)) : "0 (" + M("r < 2") + ")"]
    ]) + "</dl>" +
      '<p class="ci-tk-rh">Row ' + (n - 1) + " of the triangle (the two entries above " + M("C(" + n + ", " + r + ")") + " are marked):</p>" +
      '<div class="ci-tk-row" role="img" aria-label="Row ' + (n - 1) + ": " + rowv.join(", ") + (r >= 1 ? "; with Sam entry " + v.w : "") + (r <= n - 1 ? "; without Sam entry " + v.wo : "") + '">' +
      rowv.map(function(x, k){ return '<span class="d5-c' + (k === r - 1 ? " up1" : k === r ? " up2" : "") + '">' + big(x) + "</span>"; }).join("") + "</div>" +
      '<p class="ci-legend"><span class="ci-lg"><i class="d5-c up1" aria-hidden="true"></i> with Sam</span> <span class="ci-lg"><i class="d5-c up2" aria-hidden="true"></i> without Sam</span></p>';
  }
  return {
    render:function(inHost, pvHost, a){
      api = a; S = a.S; pv = pvHost;
      S.n = clampInt(S.n, 2, 12, 6); S.r = clampInt(S.r, 0, S.n, 2);
      inHost.innerHTML = '<div class="ci-tk-in"><label class="slider"><span class="slider-top"><span>Club size ' + M("n") + '</span><output id="ci-tk-n-out"></output></span><input type="range" id="ci-tk-n" min="2" max="12" step="1"></label>' +
        '<label class="slider"><span class="slider-top"><span>Committee size ' + M("r") + '</span><output id="ci-tk-r-out"></output></span><input type="range" id="ci-tk-r" min="0" max="12" step="1"></label></div>';
      $("#ci-tk-n").addEventListener("input", function(e){ S.n = +e.target.value; S.r = Math.min(S.r, S.n); api.save(); paint(); api.update(); });
      $("#ci-tk-r").addEventListener("input", function(e){ S.r = Math.min(+e.target.value, S.n); api.save(); paint(); api.update(); });
      paint();
    },
    read:function(){ return d(); },
    valid:function(x){ return x.n >= 2 && x.n <= 12 && x.r >= 0 && x.r <= x.n ? true : "Choose " + M("n") + " from 2 to 12 and " + M("r") + " from 0 to " + M("n") + "."; },
    checks:function(x){ var v = vals(x.n, x.r); return [v.w === v.wo, v.tot >= 10 && v.tot <= 1000, v.st >= 6]; },
    key:function(x){ return x.n + "," + x.r; },
    label:function(k){ var p = k.split(","); return M("(n, r) = (" + p[0] + ", " + p[1] + ")"); },
    text:function(k){ var p = k.split(","); return "(n, r) = (" + p[0] + ", " + p[1] + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ uses:numWords },
  task:task
});
})();
