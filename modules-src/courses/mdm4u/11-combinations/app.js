// MDM4U 11 Combinations: hero (20 ordered pairs of A–E slide into 10 stacks of 2!), Order eraser (Explore: D4 arrangement
// tiles in List mode with the "Erase order" collapse into stacks, Formula mode with factor tiles and a step-through, Compare
// mode with D3 slate slots beside the committee list), At least and at most (Part 3: three stations; cases, complement and the
// double-count trap), The fair committee task. Every count comes from MV.mdm (exact BigInt arithmetic).
(function(){
"use strict";
var $ = MV.$;
function M(s){ return MV.m(s); }
var NNB = "\u202f";   // narrow no-break space (thousands)
function big(v){ return MV.mdm.fmt(v).replace(/ /g, NNB); }
function C(n, r){ var v = MV.mdm.nCr(n, r); return typeof v === "bigint" ? Number(v) : v; }
function P(n, r){ var v = MV.mdm.nPr(n, r); return typeof v === "bigint" ? Infinity : v; }      // for comparisons
function fact(n){ var v = MV.mdm.fact(n); return typeof v === "bigint" ? Infinity : v; }
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }
var LET = "ABCDEFGHIJKLMNOPQRST".split("");
var ROLES = ["President", "VP", "Treasurer", "Secretary", "Social rep", "Events lead", "Webmaster", "Historian"];
function ncrHTML(n, r){ return '<span class="m cb-ncr"><sub>' + n + "</sub>C<sub>" + r + "</sub></span>"; }
function binomHTML(n, r){ return '<span class="m cb-bn" aria-hidden="true"><span class="cb-bnp">(</span><span class="cb-bns"><span>' + n + "</span><span>" + r + '</span></span><span class="cb-bnp">)</span></span><span class="vh">' + n + " choose " + r + "</span>"; }
function setTxt(ids){ return "{" + ids.map(function(i){ return LET[i]; }).join(", ") + "}"; }

// @component radioGroup (copied from MDM4U 09 / 07) — segmented control or chip row as a real radio group
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

// @component D3 countingSlots — case-row version (copied from MDM4U 09): rows of counting slots, one per stage (a role, a
// case's group); each slot shows its badge, the count and a word; a row can carry a label and shows its product.
// D3.html(rows, o) -> html.  rows: [{lab, slots:[{b, n, w, lk, note}]}]   o: {shown: number of slots revealed (null = all), hi}
var D3 = {
  html:function(rows, o){
    o = o || {};
    var seen = 0;
    return rows.map(function(row){
      var prod = row.slots.reduce(function(a, s){ return a * s.n; }, 1), allShown = true;
      var h = '<div class="cb-srow">' + (row.lab ? '<p class="cb-slab">' + row.lab + "</p>" : "") + '<div class="cb-slots">';
      h += row.slots.map(function(s){
        var show = o.shown == null || seen < o.shown; seen++; if (!show) allShown = false;
        var cnt = show ? big(s.n) : "?", w = s.w || (s.n === 1 ? "choice" : "choices");
        return '<div class="cb-slot' + (s.lk ? " lk" : "") + (o.hi === seen - 1 ? " hi" : "") + '" role="group" aria-label="' + MV.esc(MV.plain(s.b) + ": " + (show ? s.n + " " + w : "count hidden") + (s.note ? ", " + s.note : "")) + '">' +
          '<span class="cb-badge">' + s.b + '</span><span class="cb-n" aria-hidden="true">' + cnt + '</span><span class="cb-cw" aria-hidden="true">' + (s.note || w) + "</span></div>";
      }).join("");
      return h + '</div><p class="cb-sprod" aria-hidden="true">' + (allShown && row.slots.length > 1 ? row.slots.map(function(s){ return big(s.n); }).join(" × ") + " = " + big(prod) : "") + "</p></div>";
    }).join("");
  }
};

// @component D4 arrangementTiles — order-eraser version (adapted from MDM4U 09 / 07): perms(n, r) lists every ordered
// selection of r of n objects in dictionary order, combos(n, r) every unordered group; tileView(scroll, box) lays the ordered
// selections out as tiles in a wrapping grid ("List ordered selections" fades them in one by one) and "Erase order" slides
// every tile into the stack of its group (same letters, any order), each stack with a "×r!" badge. Tiles are display only
// (absolutely placed, transform transitions; reduced motion or a resize jumps straight to the end). A glow key highlights one
// group's tiles. The ResizeObserver re-lays the grid when the box changes width (including when the Explore view opens).
//   tv = tileView(scrollEl, boxEl) -> { show(n, r, stage, {glow}), appear(done), erase(done), unerase(done), glow(key), clear(), stop(), geom() }
var D4 = {
  perms:function(n, r){
    var out = [];
    (function rec(cur, used){
      if (cur.length === r) { out.push(cur.slice()); return; }
      for (var i = 0; i < n; i++) if (!used[i]) { used[i] = 1; cur.push(i); rec(cur, used); cur.pop(); used[i] = 0; }
    })([], {});
    return out;
  },
  combos:function(n, r){
    var out = [];
    (function rec(start, cur){
      if (cur.length === r) { out.push(cur.slice()); return; }
      for (var i = start; i < n; i++) { cur.push(i); rec(i + 1, cur); cur.pop(); }
    })(0, []);
    return out;
  },
  key:function(p){ return p.slice().sort(function(a, b){ return a - b; }).join(","); }
};
function tileView(scroll, box){
  var sig = "", n = 0, r = 0, list = [], info = [], per = 1, nC = 0, tiles = [], badges = [], stage = 0, bOn = false, glowKey = null, timers = [], pending = false;
  function later(ms, fn){ timers.push(setTimeout(fn, ms)); }
  function stop(){ if (timers.length) pending = true; timers.forEach(clearTimeout); timers = []; tiles.forEach(function(t){ t.style.transitionDelay = ""; }); }
  function build(nn, rr){
    var s = nn + "|" + rr; if (s === sig) return false;
    sig = s; n = nn; r = rr; list = D4.perms(n, r);
    var combos = D4.combos(n, r), map = {}, cnt = {};
    combos.forEach(function(c, k){ map[c.join(",")] = k; });
    info = list.map(function(p){ var key = D4.key(p), k = map[key], j = cnt[k] || 0; cnt[k] = j + 1; return { k:k, j:j, key:key }; });
    per = fact(r); nC = combos.length;
    var h = "";
    list.forEach(function(p, i){ h += '<span class="cb-t" style="z-index:' + (per - info[i].j + 1) + '">' + p.map(function(x){ return LET[x]; }).join("") + "</span>"; });
    combos.forEach(function(){ h += '<span class="cb-bdg">×' + r + "!</span>"; });
    box.innerHTML = h;
    tiles = MV.$$(".cb-t", box); badges = MV.$$(".cb-bdg", box);
    return true;
  }
  function geom(){
    var W = scroll.clientWidth - 14; if (W < 120) W = 620;
    var tw = Math.max(36, 14 + 11 * r), th = 28, gap = 6, cols = Math.max(1, Math.floor((W + gap) / (tw + gap)));
    var sw = tw + 14, sh = th + 22, scols = Math.max(1, Math.floor((W + gap) / (sw + gap)));
    return { W:W, tw:tw, th:th, gap:gap, cols:cols, sw:sw, sh:sh, scols:scols,
      hO:Math.ceil(list.length / cols) * (th + gap), hS:Math.ceil(nC / scols) * (sh + gap) };
  }
  function place(){
    if (!tiles.length) { box.style.height = "0px"; return; }
    var g = geom();
    tiles.forEach(function(t, i){
      var x, y, f = info[i];
      if (stage === 2) { var c = f.k % g.scols, rw = Math.floor(f.k / g.scols), off = Math.min(f.j, 4) * 2; x = c * (g.sw + g.gap) + off; y = rw * (g.sh + g.gap) + 12 + off; }
      else { x = (i % g.cols) * (g.tw + g.gap); y = Math.floor(i / g.cols) * (g.th + g.gap); }
      t.style.width = g.tw + "px";
      t.style.transform = "translate(" + x + "px," + y + "px)";
      t.classList.toggle("glow", !!glowKey && f.key === glowKey);
    });
    badges.forEach(function(b, k){
      var c = k % g.scols, rw = Math.floor(k / g.scols);
      b.style.transform = "translate(" + (c * (g.sw + g.gap) + g.tw - 16) + "px," + (rw * (g.sh + g.gap)) + "px)";
      b.classList.toggle("in", stage === 2 && bOn);
    });
    box.style.height = (stage === 0 ? 0 : stage === 1 ? g.hO : g.hS) + "px";
  }
  function still(fn){ box.classList.add("still"); fn(); void box.offsetWidth; box.classList.remove("still"); }
  function vis(on){ tiles.forEach(function(t){ t.classList.toggle("in", on); }); }
  if (window.ResizeObserver) { var lastW = 0; new ResizeObserver(function(){ var w = scroll.clientWidth; if (w && w !== lastW) { var first = !lastW; lastW = w; if (!first || !timers.length) still(place); } }).observe(scroll); }
  return {
    geom:geom,
    show:function(nn, rr, st, o){
      o = o || {};
      var changed = build(nn, rr), gk = o.glow || null;
      if (changed || st !== stage || pending || o.force) { stop(); pending = false; stage = st; bOn = st === 2; still(function(){ vis(st >= 1); place(); }); }
      if (gk !== glowKey) { glowKey = gk; tiles.forEach(function(t, i){ t.classList.toggle("glow", !!gk && info[i].key === gk); }); }
    },
    glow:function(gk){ glowKey = gk || null; tiles.forEach(function(t, i){ t.classList.toggle("glow", !!glowKey && info[i].key === glowKey); }); },
    appear:function(done){
      stop(); stage = 1; bOn = false;
      still(function(){ vis(false); place(); });
      if (MV.reduceMotion) { still(function(){ vis(true); }); if (done) done(); return; }
      var step = Math.max(6, Math.min(45, 1300 / tiles.length));
      tiles.forEach(function(t, i){ t.style.transitionDelay = "0ms, " + Math.round(i * step) + "ms"; });
      void box.offsetWidth; vis(true);
      later(Math.round(tiles.length * step) + 300, function(){ tiles.forEach(function(t){ t.style.transitionDelay = ""; }); if (done) done(); });
    },
    erase:function(done){
      stop(); stage = 2; bOn = false;
      if (MV.reduceMotion) { bOn = true; still(function(){ vis(true); place(); }); if (done) done(); return; }
      var g = geom(); vis(true); place(); box.style.height = Math.max(g.hO, g.hS) + "px";
      later(780, function(){ bOn = true; place(); if (done) done(); });
    },
    unerase:function(done){
      stop(); stage = 1; bOn = false;
      if (MV.reduceMotion) { still(function(){ vis(true); place(); }); if (done) done(); return; }
      var g = geom(); place(); box.style.height = Math.max(g.hO, g.hS) + "px";
      later(780, function(){ place(); if (done) done(); });
    },
    clear:function(){ stop(); sig = ""; tiles = []; badges = []; list = []; info = []; stage = 0; box.innerHTML = ""; box.style.height = "0px"; },
    stop:stop,
    stage:function(){ return stage; }
  };
}

// @component factorTiles — read-only version (adapted from MDM4U 06): a fraction of factorials as two right-aligned rows of
// factor tiles; cancelled pairs are struck through with a highlighter band. top/bot: [{k, t} | {sep:"×"}]; done: {key:1}.
function factorHTML(top, bot, done, label){
  function row(list){ return list.map(function(x){ return x.sep ? '<span class="cb-fsep" aria-hidden="true">' + x.sep + "</span>" : '<span class="cb-ft' + (done[x.k] ? " x" : "") + '">' + x.t + "</span>"; }).join(""); }
  return '<div class="cb-fwrap"><div class="cb-frac" role="img" aria-label="' + MV.esc(label) + '"><div class="cb-frow">' + row(top) + '</div><div class="cb-fbar" aria-hidden="true"></div><div class="cb-frow">' + row(bot) + "</div></div></div>";
}
// C(n, r) worked by cancelling the larger factorial below: {lines (math source), top, bot, cancel (key set), big}
function cancelWork(n, r){
  var bg = Math.max(r, n - r), sm = Math.min(r, n - r), k, top = [], bot = [], keep = [], under = [];
  for (k = n; k >= 1; k--) top.push({ k:"f" + k, t:String(k) });
  var rKeys = r === bg ? "f" : "s", qKeys = r === bg ? "s" : "f";
  if (r === n - r) { rKeys = "s"; qKeys = "f"; }
  for (k = r; k >= 1; k--) bot.push({ k:rKeys + k, t:String(k) });
  if (r >= 1 && n - r >= 1) bot.push({ sep:"×" });
  for (k = n - r; k >= 1; k--) bot.push({ k:qKeys + k, t:String(k) });
  if (n - r === 0) bot.push({ k:"zero", t:"0!" });
  var cancel = {}; for (k = bg; k >= 1; k--) cancel["f" + k] = 1;
  for (k = n; k > bg; k--) keep.push(k);
  for (k = sm; k >= 1; k--) under.push(k);
  var T = keep.reduce(function(a, b){ return a * b; }, 1), B = under.reduce(function(a, b){ return a * b; }, 1), c = C(n, r);
  var L = ["C(" + n + ", " + r + ") = {" + n + "!}/{" + r + "! " + (n - r) + "!}"], notes = ["Write " + M("C(n, r)") + " as " + M("{n!}/{r! (n - r)!}") + "."];
  if (sm === 0) { L.push("= {1}/{0!} = {1}/{1}"); notes.push("The " + M(n + "!") + " cancels top and bottom, and " + M("0! = 1") + "."); L.push("= 1"); notes.push("One way to choose everyone."); }
  else {
    L.push("= {" + keep.join(" × ") + "}/{" + under.join(" × ") + "}"); notes.push("The " + M(bg + "!") + " cancels: it’s on the top and the bottom.");
    if (keep.length > 1 || under.length > 1) { L.push("= {" + big(T) + "}/{" + big(B) + "}"); notes.push("Multiply the top and the bottom."); }
    L.push("= " + big(c)); notes.push("Divide: " + big(c) + (c === 1 ? " committee." : " committees."));
  }
  return { lines:L, notes:notes, top:top, bot:bot, cancel:cancel, bg:bg, sm:sm };
}

// ---------- Explore: Order eraser ----------
var MODES = [{ id:"list", t:"List" }, { id:"formula", t:"Formula" }, { id:"compare", t:"Compare" }];
function explore(host, api){
  var S = api.S;
  if (["list", "formula", "compare"].indexOf(S.mode) < 0) S.mode = "list";
  S.n = clampI(S.n, 3, S.mode === "formula" ? 20 : 8, 5);
  S.r = clampI(S.r, 1, S.n, 2);
  S.stage = clampI(S.stage, 0, 2, 0);
  S.roles = S.roles === "roles" ? "roles" : "comm";
  S.pick = clampI(S.pick, 0, 1e4, 0);
  S.found = (Array.isArray(S.found) ? S.found : []).filter(function(k, i, a){ return /^\d{1,2},\d{1,2}$/.test(k) && a.indexOf(k) === i; }).slice(0, 8);
  var pv = {}, anim = null, msg = "", fstep = null;

  host.innerHTML =
    '<div class="cb-top" id="cb-mode"></div>' +
    '<div class="pg cb-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap cb-cap" id="cb-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="cb-av" class="cb-av" role="img"></div>' +
      '<div id="cb-lv"><p class="cb-lnote" id="cb-lnote"></p><div class="cb-scroll" id="cb-scroll"><div class="cb-tiles" id="cb-tiles" role="img" aria-label="Ordered selections"></div></div></div>' +
      '<div id="cb-fv" class="cb-fv" hidden></div>' +
      '<div id="cb-cv" class="cb-cv" hidden></div>' +
      '<p class="cb-aha" id="cb-aha"></p></div>' +
    '<div class="pg-ctrl"><div id="cb-sl" class="cb-sl"></div>' +
      '<div id="cb-nrow" class="numrow cb-nrow" hidden><label for="cb-nbox">Or type ' + M("n") + " (3 to 20)</label>" +
        '<input class="numin short" id="cb-nbox" data-k="cbnbox" type="text" inputmode="numeric" autocomplete="off"></div>' +
      '<div id="cb-roles" class="cb-roles" hidden></div>' +
      '<div class="cb-btns"><button type="button" class="btn primary sm" id="cb-listb" data-k="cblist">List ordered selections</button>' +
        '<button type="button" class="btn sm" id="cb-erase" data-k="cberase">Erase order</button>' +
        '<button type="button" class="btn ghost sm" id="cb-reset" data-k="cbreset">Reset</button></div>' +
      '<p class="tiny cb-msg" id="cb-msg" aria-live="polite"></p>' +
      '<div class="cb-found" id="cb-found"></div></div>' +
    '<div class="pg-read"><dl class="read" id="cb-read" aria-live="polite"></dl></div></div>';

  var tv = tileView($("#cb-scroll", host), $("#cb-tiles", host));
  var modeR = radios($("#cb-mode", host), { label:"Mode", options:MODES, value:S.mode, cls:"seg",
    onChange:function(v){ user(); setMode(v); save(); render(); MV.changed(); } });
  var sl = MV.sliders($("#cb-sl", host), [
    { id:"cbn", label:"People " + M("n"), min:3, max:8, step:1, value:Math.min(S.n, 8) },
    { id:"cbr", label:"Chosen " + M("r"), min:1, max:S.n, step:1, value:S.r }], function(id, v){
    user();
    if (id === "cbn") { S.n = v; if (S.r > S.n) S.r = S.n; } else S.r = Math.min(v, S.n);
    nrChanged(); save(); render(); MV.changed();
  });
  var rolesR = radios($("#cb-roles", host), { label:"Read", aria:"Compare: which count to read", options:[{ id:"roles", t:"Roles: President, VP, Treasurer" }, { id:"comm", t:"Committee (no roles)" }], value:S.roles, cls:"chips",
    onChange:function(v){ user(); S.roles = v; save(); render(); MV.changed(); } });

  function save(){ api.save(); }
  function user(){ cancelAnim(); pv = {}; MV.banner("", ""); }
  function setMode(v){
    S.mode = v; msg = ""; fstep = null;
    if (v !== "formula" && S.n > 8) { S.n = 8; if (S.r > 8) S.r = 8; msg = "List and Compare modes go up to " + M("n = 8") + ", so " + M("n") + " is now 8."; }
  }
  function nrChanged(){ msg = ""; fstep = null; S.pick = 0; }
  function many(){ return P(S.n, S.r) > 120; }

  // --- animation bookkeeping (predictions and the list buttons); any user action cancels and finishes it ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], stops:[tv.stop], fin:fin || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(setTimeout(function(){ if (anim === a) fn(); }, MV.reduceMotion ? 0 : ms)); }
  function guard(fn){ var a = anim; return function(){ if (anim === a && a) fn(); }; }
  function endAnim(){ var a = anim; anim = null; if (a && a.fin) { var f = a.fin; a.fin = null; f(); } paintBtns(); }
  function cancelAnim(){
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} });
    pv = {};
    if (a.fin) { var f = a.fin; a.fin = null; f(); }
    render(); MV.changed();
  }

  // --- painting ---
  function render(){
    modeR.set(S.mode); rolesR.set(S.roles);
    var nEl = $("#sl-cbn", host), rEl = $("#sl-cbr", host);
    nEl.max = S.mode === "formula" ? 20 : 8; rEl.max = S.n;
    sl.set("cbn", S.n); sl.set("cbr", S.r);
    $("#cb-nrow", host).hidden = S.mode !== "formula";
    var nb = $("#cb-nbox", host); if (document.activeElement !== nb) nb.value = S.n;
    $("#cb-roles", host).hidden = S.mode !== "compare";
    $("#cb-lv", host).hidden = S.mode !== "list"; $("#cb-fv", host).hidden = S.mode !== "formula"; $("#cb-cv", host).hidden = S.mode !== "compare";
    paintAv(); paintList(); paintForm(); paintCmp(); paintBtns(); paintCap(); paintRead(); paintAha(); paintFound();
    $("#cb-msg", host).innerHTML = msg;
  }
  function chosen(){
    var on = {}, i;
    if (S.mode === "compare") { var cs = D4.combos(S.n, S.r), cm = cs[Math.min(S.pick, cs.length - 1)] || []; cm.forEach(function(x){ on[x] = 1; }); }
    else if (S.mode === "formula") { for (i = 0; i < S.r; i++) on[i] = 1; }
    else if (pv.glow) pv.glow.split(",").forEach(function(x){ on[+x] = 1; });
    return on;
  }
  function paintAv(){
    var box = $("#cb-av", host), n = S.n, on = chosen(), ins = [], outs = [], i;
    for (i = 0; i < n; i++) (on[i] ? ins : outs).push(i);
    function av(i){ return '<span class="cb-p' + (on[i] ? " on" : "") + (n > 10 ? " sm" : "") + '">' + LET[i] + "</span>"; }
    var split = S.mode === "formula" && !pv.noSplit;
    if (split) {
      box.innerHTML = '<div class="cb-split' + (pv.splitFresh ? " fresh" : "") + '"><div class="cb-grp in"><p class="cb-gl">Chosen: ' + M("r = " + ins.length) + '</p><div class="cb-ps">' + ins.map(av).join("") + "</div></div>" +
        '<div class="cb-grp out"><p class="cb-gl">Left out: ' + M("n - r = " + outs.length) + '</p><div class="cb-ps">' + outs.map(av).join("") + "</div></div></div>";
      box.setAttribute("aria-label", "People " + LET.slice(0, n).join(", ") + ". Chosen: " + (ins.map(function(x){ return LET[x]; }).join(", ") || "nobody") + ". Left out: " + (outs.map(function(x){ return LET[x]; }).join(", ") || "nobody") + ".");
    } else {
      box.innerHTML = '<div class="cb-ps">' + LET.slice(0, n).map(function(_, i){ return av(i); }).join("") + "</div>";
      box.setAttribute("aria-label", "People " + LET.slice(0, n).join(", ") + (ins.length ? ". Ringed: " + ins.map(function(x){ return LET[x]; }).join(", ") : "") + ".");
    }
  }
  function paintList(){
    if (S.mode !== "list") return;
    var note = $("#cb-lnote", host), n = S.n, r = S.r, Pv = MV.mdm.nPrB(n, r), stage = pv.stage != null ? pv.stage : S.stage, tiles = $("#cb-tiles", host);
    $("#cb-scroll", host).hidden = many() || stage === 0;
    if (many()) {
      tv.clear();
      note.innerHTML = "<strong>Too many to list: switch to Formula mode.</strong> Here " + M("P(" + n + ", " + r + ")") + " = " + big(Pv) + "; List mode shows up to 120 tiles. " +
        '<button type="button" class="btn ghost sm cb-tofm" id="cb-tofm" data-k="cbtofm">Switch to Formula mode</button>';
      tiles.setAttribute("aria-label", "Too many ordered selections to list.");
      return;
    }
    var per = fact(r), cnt = C(n, r);
    note.innerHTML = stage === 0 ? "Press <strong>List ordered selections</strong> to list all " + big(Pv) + " ordered selections of " + r + " from " + n + "." :
      stage === 1 ? "All " + big(Pv) + " ordered selections, in dictionary order." :
      big(Pv) + " ordered selections, erased into " + big(cnt) + " stack" + (cnt === 1 ? "" : "s") + " of " + M(r + "! = " + per) + ".";
    if (!anim || pv.stage == null) tv.show(n, r, stage, { glow:pv.glow });
    else tv.glow(pv.glow);
    tiles.setAttribute("aria-label", stage === 0 ? "No tiles listed yet." : stage === 1 ? "Grid of " + Pv + " ordered selections of " + r + " letters from A to " + LET[n - 1] + ", such as " + D4.perms(n, r).slice(0, 4).map(function(p){ return p.map(function(x){ return LET[x]; }).join(""); }).join(", ") + "." :
      "The " + Pv + " ordered selections collapsed into " + cnt + " stacks, one per committee, each holding " + per + " orderings.");
  }
  function paintForm(){
    if (S.mode !== "formula") return;
    var box = $("#cb-fv", host), n = S.n, r = S.r, w = cancelWork(n, r), K = w.lines.length;
    var i = pv.hide ? 0 : fstep == null ? K - 1 : Math.min(fstep, K - 1);
    var done = i >= 1 ? w.cancel : {};
    var h = '<p class="cb-fhead">' + M("C(" + n + ", " + r + ")") + " = " + ncrHTML(n, r) + " = " + binomHTML(n, r) + "</p>";
    h += '<p class="cb-fcap">' + M(n + "!") + " on top; " + M(r + "!") + " and " + M((n - r) + "!") + " below" + (w.sm ? ". The " + M(w.bg + "!") + " cancels." : ".") + "</p>";
    h += factorHTML(w.top, w.bot, done, n + " factorial over " + r + " factorial times " + (n - r) + " factorial" + (i >= 1 ? ", with " + w.bg + " factorial cancelled" : ""));
    h += '<ol class="cb-steps">' + w.lines.map(function(l, j){ return j <= i ? '<li class="' + (j === i ? "on" : "") + '"><span class="cb-sl1">' + M(l) + '</span><span class="cb-snote">' + w.notes[j] + "</span></li>" : ""; }).join("") + "</ol>";
    h += '<div class="cb-stepper"><button type="button" class="btn ghost sm" data-fs="back" data-k="fsback"' + (i === 0 || pv.hide ? " disabled" : "") + '>Back</button><button type="button" class="btn primary sm" data-fs="step" data-k="fsstep"' + (i >= K - 1 || pv.hide ? " disabled" : "") + '>Step</button>' +
      '<button type="button" class="btn ghost sm" data-fs="start" data-k="fsstart"' + (pv.hide ? " disabled" : "") + '>From the start</button><span class="tiny muted" aria-live="polite">Step ' + (i + 1) + " of " + K + "</span></div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  function paintCmp(){
    if (S.mode !== "compare") return;
    var box = $("#cb-cv", host), n = S.n, r = S.r, cs = D4.combos(n, r), k = Math.min(S.pick, cs.length - 1), cm = cs[k], per = fact(r), Pv = MV.mdm.nPrB(n, r), roles = S.roles === "roles";
    var slots = [{ slots:ROLES.slice(0, r).map(function(nm, i){ return { b:nm, n:n - i }; }) }];
    var h = '<div class="cb-cmp"><section class="cb-pan' + (roles ? " act" : "") + '" aria-label="Officer slates"><h4>Officer slates <span class="cb-tagp">order matters</span></h4>' +
      '<p class="cb-pv">' + M("P(" + n + ", " + r + ")") + " = " + big(Pv) + "</p>" + D3.html(slots);
    h += '<p class="cb-sfor">Slates for ' + setTxt(cm) + ":</p>";
    if (per <= 24) {
      var ps = D4.perms(r, r).map(function(p){ return p.map(function(j){ return LET[cm[j]]; }); });
      h += '<div class="cb-stbl">' + MV.tableHTML({ head:ROLES.slice(0, r), rows:ps, caption:"The " + per + " slates for committee " + setTxt(cm) }) + "</div>";
    } else h += '<p class="tiny muted">' + M(r + "! = " + per) + " slates: too many to list here.</p>";
    h += "</section>";
    h += '<div class="cb-brk"><span>each committee ↔ ' + M(r + "!") + " = " + big(per) + " slate" + (per === 1 ? "" : "s") + "</span></div>";
    h += '<section class="cb-pan' + (!roles ? " act" : "") + '" aria-label="Committees"><h4>Committees <span class="cb-tagp">no roles</span></h4>' +
      '<p class="cb-pv">' + M("C(" + n + ", " + r + ")") + " = " + big(Pv) + " ÷ " + big(per) + " = " + big(cs.length) + "</p>" +
      '<p class="tiny muted">Tap a committee to see its slates.</p><div class="cb-cl" role="group" aria-label="Committees">' + cs.map(function(c, j){
        return '<button type="button" class="cb-cb' + (j === k ? " on" : "") + '" data-cpick="' + j + '" data-k="cp' + j + '" aria-pressed="' + (j === k) + '">' + setTxt(c) + "</button>";
      }).join("") + "</div></section></div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  function paintBtns(){
    var list = S.mode === "list", lb = $("#cb-listb", host), eb = $("#cb-erase", host), mm = many();
    lb.hidden = !list; eb.hidden = !list;
    lb.disabled = mm || (S.stage === 1 && !anim); eb.disabled = mm || (S.stage === 2 && !anim);
  }
  function paintCap(){
    var c = $("#cb-cap", host), n = S.n, r = S.r, t;
    if (pv.cap != null) t = pv.cap;
    else if (S.mode === "list") {
      if (many() || S.stage < 2) t = "`P(" + n + ", " + r + ") = " + big(MV.mdm.nPrB(n, r)) + "` ordered";
      else { var cc = C(n, r); t = big(MV.mdm.nPrB(n, r)) + " ÷ `" + r + "!` = " + big(cc) + (cc === 1 ? " committee" : " committees"); }
    } else if (S.mode === "formula") t = pv.hide ? "`C(" + n + ", " + r + ")` = ?" : "`C(" + n + ", " + r + ") = " + big(C(n, r)) + "`";
    else t = S.roles === "roles" ? "Slates: `P(" + n + ", " + r + ") = " + big(MV.mdm.nPrB(n, r)) + "`" : "Committees: `C(" + n + ", " + r + ") = " + big(C(n, r)) + "`";
    c.innerHTML = MV.md(t); c.classList.toggle("long", MV.plain(c.innerHTML).length > 24);
  }
  function paintRead(){
    var n = S.n, r = S.r, hide = !!pv.hide, Pv = MV.mdm.nPrB(n, r), per = MV.mdm.factB(r), cc = C(n, r), rows = [];
    rows.push(["Ordered selections", M("P(" + n + ", " + r + ")") + " = " + big(Pv)]);
    rows.push(["Orderings of each group", M(r + "!") + " = " + big(per)]);
    rows.push(["Committees", hide ? M("C(" + n + ", " + r + ")") + " = ?" : M("C(" + n + ", " + r + ")") + " = " + big(Pv) + " ÷ " + big(per) + " = <strong>" + big(cc) + "</strong>" +
      '<span class="cb-also">also written ' + ncrHTML(n, r) + " or " + binomHTML(n, r) + "</span>"]);
    rows.push(["Factorial form", M("{" + n + "!}/{" + r + "! " + (n - r) + "!}")]);
    if (r !== n - r) rows.push(["Partner", hide || pv.hideP ? M("C(" + n + ", " + (n - r) + ")") + " = ?" : '<span class="' + (pv.partner ? "cb-hl" : "") + '">' + M("C(" + n + ", " + (n - r) + ")") + " = " + big(C(n, n - r)) + " too</span>" +
      '<span class="cb-also">Choosing ' + r + " to serve = choosing " + (n - r) + " to leave out.</span>"]);
    $("#cb-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintAha(){
    var a = $("#cb-aha", host), show = !pv.hide && ((S.mode === "list" && S.stage === 2 && !many()) || S.mode === "compare");
    a.hidden = !show;
    if (!show) return;
    a.innerHTML = S.r <= 1 ? "With " + M("r = 1") + ", each committee is one person: there’s no order to erase, so " + M("C(" + S.n + ", 1) = P(" + S.n + ", 1)") + "." :
      "Dividing by " + M(S.r + "!") + " erases order, so there are fewer committees than slates (" + big(C(S.n, S.r)) + " vs " + big(MV.mdm.nPrB(S.n, S.r)) + ").";
  }
  function paintFound(){
    var box = $("#cb-found", host);
    var h = '<p class="cb-flab">Your 28 list <span class="tiny muted">(challenge 3)</span></p>' +
      '<button type="button" class="btn sm" id="cb-add" data-k="cbadd">Add this setting ' + M("(n, r) = (" + S.n + ", " + S.r + ")") + "</button>" +
      '<div class="cb-fchips" role="group" aria-label="Your 28 list">' + (S.found.length ? S.found.map(function(k){
        var p = k.split(","); return '<button type="button" class="chip cb-fc" data-rm="' + k + '" data-k="rm' + p.join("-") + '" aria-label="' + MV.esc("Remove (" + p[0] + ", " + p[1] + ")") + '">' + M("(" + p[0] + ", " + p[1] + ")") + ' <span aria-hidden="true">✕</span></button>';
      }).join("") : '<span class="tiny muted">Empty. Set ' + M("n") + " and " + M("r") + ", then add the setting.</span>") + "</div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }

  // --- user animations: list / erase ---
  function doList(){
    user();
    if (many()) return;
    var from = S.stage; S.stage = 1; save();
    if (from === 1) { render(); return; }
    newAnim(null); pv.stage = 1; render();
    var fin = guard(function(){ pv = {}; endAnim(); render(); MV.changed(); });
    if (from === 0) tv.appear(fin); else tv.unerase(fin);
    paintBtns();
  }
  function doErase(){
    user();
    if (many() || S.stage === 2) return;
    var from = S.stage; S.stage = 2; save();
    newAnim(null);
    function erase(){ pv.stage = 2; render(); tv.erase(guard(function(){ pv = {}; endAnim(); render(); MV.changed(); })); }
    if (from === 0) { pv.stage = 1; render(); tv.appear(guard(function(){ later(350, erase); })); }
    else erase();
    paintBtns();
  }

  // --- events ---
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.closest("#cb-mode") || b.closest("#cb-roles")) return;
    if (b.id === "cb-listb") { doList(); return; }
    if (b.id === "cb-erase") { doErase(); return; }
    if (b.id === "cb-reset") { user(); S.mode = "list"; S.n = 5; S.r = 2; S.stage = 0; S.roles = "comm"; S.pick = 0; msg = ""; fstep = null; save(); render(); MV.changed(); return; }
    if (b.id === "cb-tofm") { user(); setMode("formula"); save(); render(); MV.changed(); var fb = $('#cb-mode [data-rg="formula"]', host); if (fb) fb.focus(); return; }
    if (b.dataset.cpick != null) { user(); S.pick = +b.dataset.cpick; save(); render(); MV.changed(); return; }
    if (b.dataset.fs) {
      user(); var K = cancelWork(S.n, S.r).lines.length, i = fstep == null ? K - 1 : fstep;
      if (b.dataset.fs === "back") i = Math.max(0, i - 1); else if (b.dataset.fs === "step") i = Math.min(K - 1, i + 1); else i = 0;
      fstep = i; render(); return;
    }
    if (b.id === "cb-add") {
      user(); var k = S.n + "," + S.r;
      if (S.found.indexOf(k) >= 0) msg = "(" + S.n + ", " + S.r + ") is already on your list.";
      else if (S.found.length >= 8) msg = "Your list is full. Remove a setting first.";
      else { S.found.push(k); msg = "Added (" + S.n + ", " + S.r + ")."; }
      save(); render(); MV.changed(); return;
    }
    if (b.dataset.rm) { user(); var j = S.found.indexOf(b.dataset.rm); if (j >= 0) S.found.splice(j, 1); msg = "Removed (" + b.dataset.rm.replace(",", ", ") + ")."; save(); render(); MV.changed(); var ab = $("#cb-add", host); if (ab) ab.focus(); return; }
  });
  host.addEventListener("input", function(e){
    if (e.target.id !== "cb-nbox") return;
    var v = parseInt(String(e.target.value).replace(/\s/g, ""), 10);
    if (!(v >= 3 && v <= 20)) { msg = "Type a whole number from 3 to 20."; $("#cb-msg", host).innerHTML = msg; return; }
    user(); S.n = v; if (S.r > S.n) S.r = S.n; nrChanged(); save(); render(); MV.changed();
  });

  render();

  // --- predictions ---
  function startPred(p){
    cancelAnim();
    var s = p.start || {};
    S.mode = s.mode; S.n = s.n; S.r = s.r; S.stage = 0; S.pick = 0; S.roles = "comm"; msg = ""; fstep = null;
    pv = { hide:true, stage:0 };
    if (p.id === "p3") { pv.noSplit = true; pv.hideP = true; }
    save(); render();
  }
  function reveal(keep){ pv = keep || {}; render(); MV.changed(); later(300, endAnim); }
  function runPred(p, done){
    newAnim(done);
    var n = S.n, r = S.r, Pv = P(n, r), cc = C(n, r);
    if (p.id === "p3") {
      later(300, function(){ pv.hide = false; pv.cap = "`C(6, 2) = 15`"; render(); });
      later(1700, function(){ pv.noSplit = false; pv.splitFresh = true; pv.cap = "2 chosen ↔ 4 left out"; render(); });
      later(3100, function(){ pv.splitFresh = false; pv.hideP = false; pv.partner = true; pv.cap = "`C(6, 2) = C(6, 4) = 15`"; render(); });
      later(4300, function(){ reveal({ partner:true }); });
      return;
    }
    S.stage = 2; save();          // where the reveal ends (a cancelled animation jumps here)
    later(200, function(){
      pv.stage = 1; pv.cap = "`P(" + n + ", " + r + ") = " + Pv + "` ordered"; render();
      tv.appear(guard(function(){
        if (p.id === "p2") {
          later(300, function(){ pv.glow = "0,1,2"; pv.cap = "{A, B, C}: ABC, ACB, BAC, BCA, CAB, CBA"; render(); });
          later(1900, erase);
        } else later(500, erase);
      }));
    });
    function erase(){
      pv.stage = 2; pv.cap = "Erasing order…"; render();
      tv.erase(guard(function(){
        pv.cap = p.id === "p2" ? "{A, B, C} appears `3! = 6` times" : Pv + " ordered ÷ `" + r + "!` = " + cc + (cc === 1 ? " committee" : " committees");
        render();
        later(900, function(){ reveal(p.id === "p2" ? { glow:"0,1,2" } : null); });
      }));
    }
  }

  return {
    predict:{ start:startPred, run:runPred },
    challenge:function(id){ return chal(id); }
  };

  function chal(id){
    var n = S.n, r = S.r, cc = C(n, r);
    if (id === "tc1") {
      if (cc === 35) return { ok:true };
      if (n === 7 && r === 2) return { ok:false, msg:"Close: try one more person on the committee." };
      if (S.mode === "compare" && S.roles === "roles") return { ok:false, msg:"That’s the slate count; read the committee row." };
      return { ok:false, msg:"Your setting gives " + M("C(" + n + ", " + r + ")") + " = " + big(cc) + " committees, not 35." };
    }
    if (id === "tc2") {
      if (n === 6 && r === 3) return { ok:true };
      if (n === 6 && r === 2) return { ok:false, msg:"15 committees, not 20." };
      if (r === 2) return { ok:false, msg:"Each committee then matches " + M("2! = 2") + " slates." };
      if (r === 3) return { ok:false, msg:"Each committee matches " + M("3! = 6") + " slates, but there are " + big(cc) + " committees, not 20." };
      return { ok:false, msg:"Each committee then matches " + M(r + "! = " + big(MV.mdm.factB(r))) + " slate" + (r <= 1 ? "" : "s") + ", not 6." };
    }
    if (id === "tc3") {
      var L = S.found.map(function(k){ var p = k.split(","); return [+p[0], +p[1]]; });
      if (!L.length) return { ok:false, msg:"Put each setting you find on <strong>Your 28 list</strong> with <strong>Add this setting</strong>." };
      for (var i = 0; i < L.length; i++) {
        var a = L[i][0], b = L[i][1], v = C(a, b), nm = "(" + a + ", " + b + ")";
        if (a < 2 || a > 8 || b < 1 || b > a - 1) return { ok:false, msg:"Stay within " + M("2 <= n <= 8") + " and " + M("1 <= r <= n - 1") + ": remove " + nm + " from your list." };
        if (v !== 28) return { ok:false, msg:nm + " gives " + big(v) + " committees: " + (v > 28 ? "too many." : "too few.") + " Remove it from your list." };
      }
      var has = function(a, b){ return S.found.indexOf(a + "," + b) >= 0; };
      if (has(8, 2) && has(8, 6)) return { ok:true };
      if (has(8, 2)) return { ok:false, msg:"There’s a partner setting: what does choosing 2 of 8 to serve also mean?" };
      return { ok:false, msg:"There’s a partner setting: what does choosing 6 of 8 to serve also mean?" };
    }
    return { ok:false };
  }
}

// ---------- hero: 20 ordered pairs of A–E slide together into 10 stacks of 2!, "20 ordered pairs ÷ 2! = 10 committees" ----------
function hero(f){
  var svg = $("#cb-hsvg"), cap = f.cap;
  if (!svg) return;
  var PR = [], CM = {}, ci = 0, a, b;
  for (a = 0; a < 5; a++) for (b = 0; b < 5; b++) if (a !== b) PR.push([a, b]);
  for (a = 0; a < 5; a++) for (b = a + 1; b < 5; b++) CM[a + "," + b] = ci++;
  var TW = 50, TH = 22;
  function gridPos(i){ return { x:30 + (i % 4) * 78, y:48 + Math.floor(i / 4) * 30 }; }
  function stackPos(i){ var p = PR[i], k = CM[Math.min(p[0], p[1]) + "," + Math.max(p[0], p[1])], j = p[0] < p[1] ? 0 : 1; return { x:16 + (k % 5) * 68 + j * 5, y:70 + Math.floor(k / 5) * 62 + j * 5, j:j, k:k }; }
  var st = { pos:PR.map(function(_, i){ return gridPos(i); }), op:PR.map(function(){ return 0; }), badge:0, cnt:"" };
  function r1(v){ return Math.round(v * 10) / 10; }
  function draw(){
    var h = "", i;
    for (i = 0; i < 5; i++) h += '<g class="cb-hav"><circle cx="' + (100 + i * 40) + '" cy="20" r="13"/><text x="' + (100 + i * 40) + '" y="24.5">' + LET[i] + "</text></g>";
    var order = PR.map(function(_, i){ return i; }).sort(function(x, y){ return stackPos(y).j - stackPos(x).j; });
    order.forEach(function(i){
      if (st.op[i] <= 0) return;
      var p = st.pos[i];
      h += '<g class="cb-htile" style="opacity:' + st.op[i].toFixed(2) + '"><rect x="' + r1(p.x) + '" y="' + r1(p.y) + '" width="' + TW + '" height="' + TH + '" rx="5"/><text x="' + r1(p.x + TW / 2) + '" y="' + r1(p.y + 15.5) + '">' + LET[PR[i][0]] + LET[PR[i][1]] + "</text></g>";
    });
    if (st.badge > 0) for (var k = 0; k < 10; k++) {
      var bx = 16 + (k % 5) * 68 + 34, by = 70 + Math.floor(k / 5) * 62 - 12;
      h += '<g class="cb-hbdg" style="opacity:' + st.badge.toFixed(2) + '"><rect x="' + bx + '" y="' + by + '" width="30" height="16" rx="8"/><text x="' + (bx + 15) + '" y="' + (by + 12) + '">×2!</text></g>';
    }
    if (st.cnt) h += '<text class="cb-hcnt" x="180" y="216">' + st.cnt + "</text>";
    svg.innerHTML = h;
  }
  function last(){ st.pos = PR.map(function(_, i){ return stackPos(i); }); st.op = PR.map(function(){ return 1; }); st.badge = 1; st.cnt = "20 ordered pairs ÷ 2! = 10 committees"; draw(); cap.textContent = "Each stack is one committee: its 2! = 2 orders, erased"; }
  if (MV.reduceMotion) { last(); return; }
  draw(); cap.textContent = "Five people, A to E";
  MV.wait(800, function(){
    cap.textContent = "One tile for each ordered pair: AB, BA, AC, CA, …";
    MV.tween({ dur:1500, step:function(t){ st.op = PR.map(function(_, i){ return Math.max(0, Math.min(1, t * 20 - i * 0.95)); }); st.cnt = Math.min(20, Math.round(t * 20)) + " ordered pairs"; draw(); }, done:function(){
      st.op = PR.map(function(){ return 1; }); st.cnt = "20 ordered pairs"; draw();
      MV.wait(1300, function(){
        cap.textContent = "AB and BA are the same committee: same letters slide together";
        var from = st.pos.map(function(p){ return { x:p.x, y:p.y }; }), to = PR.map(function(_, i){ return stackPos(i); });
        MV.tween({ dur:1200, step:function(t){ var e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; st.pos = from.map(function(p, i){ return { x:p.x + (to[i].x - p.x) * e, y:p.y + (to[i].y - p.y) * e }; }); draw(); }, done:function(){
          st.pos = to; draw();
          MV.tween({ dur:500, step:function(t){ st.badge = t; draw(); }, done:function(){ last(); } });
        } });
      });
    } });
  });
}

// ---------- Part 3: At least and at most (three stations) ----------
var G11 = ["Ana", "Ben", "Cy", "Dee", "Eli"], G12 = ["Kim", "Leo", "Mo", "Nia", "Oz", "Pat"];
var S1C = [   // committee of 4 from 5 grade 11s and 6 grade 12s, by number of grade 11s
  { k:0, lab:"0 grade 11s", f:"C(6, 4)", v:15 },
  { k:1, lab:"1 grade 11", f:"C(5, 1) × C(6, 3)", fv:"5 × 20", v:100 },
  { k:2, lab:"2 grade 11s", f:"C(5, 2) × C(6, 2)", fv:"10 × 15", v:150 },
  { k:3, lab:"3 grade 11s", f:"C(5, 3) × C(6, 1)", fv:"10 × 6", v:60 },
  { k:4, lab:"4 grade 11s", f:"C(5, 4)", v:5 }];
var S2C = [   // committee of 3 from 4 teachers and 6 students, by number of teachers
  { k:0, lab:"0 teachers", f:"C(6, 3)", v:20 },
  { k:1, lab:"1 teacher", f:"C(4, 1) × C(6, 2)", fv:"4 × 15", v:60 },
  { k:2, lab:"2 teachers", f:"C(4, 2) × C(6, 1)", fv:"6 × 6", v:36 },
  { k:3, lab:"3 teachers", f:"C(4, 3)", v:4 }];
function tok(name, g, o){
  o = o || {};
  var cls = "al-tok " + (g === 11 ? "a" : "b") + (o.on ? " on" : "") + (o.dim ? " dim" : "");
  if (o.btn) return '<button type="button" class="' + cls + '" data-tk="' + o.btn + '" data-k="tk' + o.btn + '" aria-pressed="' + !!o.on + '" aria-label="' + MV.esc(name + ", grade " + g) + '">' + name + "<small>" + g + "</small></button>";
  return '<span class="' + cls + '">' + name + "<small>" + g + "</small></span>";
}
function caseRow(c){ return '<li><span class="al-cl">' + c.lab + ":</span> " + M(c.f) + (c.fv ? " = " + c.fv : "") + " = <strong>" + c.v + "</strong></li>"; }
function barHTML(segs, max, label){
  return '<div class="al-bar" role="img" aria-label="' + MV.esc(label) + '">' + segs.map(function(s){ return s.v ? '<span class="al-seg ' + s.cls + '" style="width:' + (100 * s.v / max).toFixed(2) + '%"><span>' + (s.t || s.v) + "</span></span>" : ""; }).join("") + "</div>";
}
function part3(host, api){
  var S = api.S, P3 = api.content || {}, ST = P3.stations || [];
  if (!ST.length) return {};
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = ST[0].id;
  S.s1 = S.s1 && typeof S.s1 === "object" ? S.s1 : {}; S.s1.cases = Array.isArray(S.s1.cases) ? S.s1.cases.filter(function(k){ return k >= 1 && k <= 4; }) : [];
  S.s2 = S.s2 && typeof S.s2 === "object" ? S.s2 : {}; S.s2.cases = Array.isArray(S.s2.cases) ? S.s2.cases.filter(function(k){ return k === 0 || k === 1; }) : [];
  S.s3 = S.s3 && typeof S.s3 === "object" ? S.s3 : {}; if (!Array.isArray(S.s3.sel)) S.s3.sel = ["a0", "a1", "b0", "b1"];
  var msg = {};
  host.innerHTML = '<div id="al-tabs" class="al-tabs"></div><div id="al-body" class="al-body"></div>';
  function st(id){ return ST.filter(function(s){ return s.id === id; })[0]; }
  function done(id){
    if (id === "s1") return S.s1.cases.length === 4 && S.s1.all && S.s1.none;
    if (id === "s2") return S.s2.cases.length === 2;
    return !!S.s3.own;
  }
  var tabOpts = ST.map(function(s){ return { id:s.id, t:"" }; });
  function tabText(){ ST.forEach(function(s, i){ tabOpts[i].t = "Station " + (i + 1) + (done(s.id) ? ' <span class="al-tick" aria-label="done">✓</span>' : ""); }); }
  tabText();
  var tabs = radios($("#al-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; api.save(); paint(); } });

  function card(s, i){ return '<div class="al-card"><span class="al-lab">Station ' + (i + 1) + " · " + s.title + '</span><p class="al-prob">' + (s.problem || "") + "</p></div>"; }
  function club(a, b, aLab, bLab, sel){
    return '<div class="al-club"><div class="al-side a"><p class="al-sl"><i class="mdm-sw" style="background:var(--ev-a)"></i> ' + aLab + '</p><div class="al-toks">' + a.join("") + "</div></div>" +
      '<div class="al-side b"><p class="al-sl"><i class="mdm-sw" style="background:var(--ev-b)"></i> ' + bLab + '</p><div class="al-toks">' + b.join("") + "</div></div></div>";
  }
  function s1HTML(s){
    var x = S.s1, tot = 0, h = card(s, 0);
    h += club(G11.map(function(nm){ return tok(nm, 11); }), G12.map(function(nm){ return tok(nm, 12); }), "Grade 11 (5)", "Grade 12 (6)");
    h += '<div class="al-routes"><section class="al-route"><h4>Cases route</h4><p class="tiny muted">Tap each case to add it (tap again to remove it).</p><div class="al-cchips" role="group" aria-label="Cases by number of grade 11s">' +
      S1C.map(function(c){ var on = x.cases.indexOf(c.k) >= 0; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-c1="' + c.k + '" data-k="c1' + c.k + '" aria-pressed="' + on + '">' + c.lab + "</button>"; }).join("") + "</div>";
    if (msg.s1) h += MV.fbHTML("bad", msg.s1);
    var added = S1C.filter(function(c){ return x.cases.indexOf(c.k) >= 0; });
    added.forEach(function(c){ tot += c.v; });
    h += '<ol class="al-rows">' + added.map(caseRow).join("") + "</ol>";
    h += '<p class="al-tot">Cases total: ' + (added.length ? (added.length > 1 ? added.map(function(c){ return c.v; }).join(" + ") + " = " : "") + "<strong>" + tot + "</strong>" : "—") + (added.length && added.length < 4 ? ' <span class="tiny muted">(' + (4 - added.length) + " more case" + (added.length === 3 ? "" : "s") + " with at least one grade 11)</span>" : "") + "</p></section>";
    h += '<section class="al-route"><h4>Complement route</h4><p class="tiny muted">Count everything, then remove the committees you don’t want.</p><div class="al-cbtns">' +
      '<button type="button" class="chip' + (x.all ? " on" : "") + '" data-c1x="all" data-k="c1all" aria-pressed="' + !!x.all + '">All committees</button>' +
      '<button type="button" class="chip' + (x.none ? " on" : "") + '" data-c1x="none" data-k="c1none" aria-pressed="' + !!x.none + '">Remove: no grade 11s</button></div><ol class="al-rows">' +
      (x.all ? "<li><span class=\"al-cl\">All committees:</span> " + M("C(11, 4)") + " = <strong>330</strong></li>" : "") +
      (x.none ? "<li><span class=\"al-cl\">No grade 11s:</span> " + M("C(6, 4)") + " = <strong>15</strong></li>" : "") + "</ol>" +
      '<p class="al-tot">Complement: ' + (x.all && x.none ? "330 − 15 = <strong>315</strong>" : x.all ? "330 − ?" : x.none ? "? − 15" : "—") + "</p></section></div>";
    var segs = [1, 2, 3, 4].map(function(k){ var c = S1C[k]; return { v:x.cases.indexOf(k) >= 0 ? c.v : 0, cls:"a" + k, t:c.v }; });
    h += '<div class="al-bars"><p class="al-bl">Cases route</p>' + barHTML(segs, 330, "Cases route bar: " + (tot ? tot + " committees so far" : "empty") + ", on a scale of 330") +
      '<p class="al-bl">Complement route</p>' + barHTML([{ v:x.all ? (x.none ? 315 : 330) : 0, cls:"all", t:x.none ? 315 : 330 }, { v:x.all && x.none ? 15 : 0, cls:"none", t:"−15" }], 330, "Complement route bar: " + (x.all ? (x.none ? "330 minus 15 = 315" : "330") : "empty")) + "</div>";
    if (done("s1")) h += '<p class="al-done"><strong>✓ ' + s.done + "</strong> Cases add up the committees you want; the complement removes the ones you don’t.</p>";
    h += '<details class="alg"><summary>Check it with algebra</summary><p>' + M("C(5, 1)C(6, 3) + C(5, 2)C(6, 2) + C(5, 3)C(6, 1) + C(5, 4)") + "</p><p>" + M("= 100 + 150 + 60 + 5 = 315") + "</p><p>" + M("C(11, 4) - C(6, 4) = 330 - 15 = 315") + "</p><p>" + M("100 + 150 + 60 + 5 = 330 - 15") + "</p></details>";
    return h;
  }
  function s2HTML(s){
    var x = S.s2, tot = 0, h = card(s, 1);
    h += club(["T1", "T2", "T3", "T4"].map(function(t){ return '<span class="al-tok a">' + t + "</span>"; }), ["S1", "S2", "S3", "S4", "S5", "S6"].map(function(t){ return '<span class="al-tok b">' + t + "</span>"; }), "Teachers (4)", "Students (6)");
    h += '<section class="al-route wide"><h4>Cases</h4><p class="tiny muted">Tap each case that “at most one teacher” allows.</p><div class="al-cchips" role="group" aria-label="Cases by number of teachers">' +
      S2C.map(function(c){ var on = x.cases.indexOf(c.k) >= 0; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-c2="' + c.k + '" data-k="c2' + c.k + '" aria-pressed="' + on + '">' + c.lab + "</button>"; }).join("") + "</div>";
    if (msg.s2) h += MV.fbHTML("bad", msg.s2);
    var added = S2C.filter(function(c){ return x.cases.indexOf(c.k) >= 0; });
    added.forEach(function(c){ tot += c.v; });
    h += '<ol class="al-rows">' + added.map(caseRow).join("") + "</ol>";
    h += '<p class="al-tot">Total: ' + (added.length ? (added.length > 1 ? added.map(function(c){ return c.v; }).join(" + ") + " = " : "") + "<strong>" + tot + "</strong> (out of " + M("C(10, 3)") + " = 120)" : "—") + "</p>";
    if (added.length === 1 && x.cases[0] === 1) h += '<p class="al-nudge">' + s.missing + "</p>";
    h += "</section>";
    h += '<div class="al-bars"><p class="al-bl">All 120 committees</p>' + barHTML([{ v:x.cases.indexOf(0) >= 0 ? 20 : 0, cls:"a1", t:20 }, { v:x.cases.indexOf(1) >= 0 ? 60 : 0, cls:"a2", t:60 }, { v:120 - tot, cls:"rest", t:120 - tot === 40 ? "40: 2 or 3 teachers" : "" }], 120,
      "Bar of 120 committees: " + (tot ? tot + " with at most one teacher counted" : "nothing counted yet")) + "</div>";
    if (done("s2")) h += '<p class="al-done"><strong>✓ ' + MV.md(s.done) + "</strong> " + "“At most one” includes none.</p>";
    h += '<details class="alg"><summary>Check it with algebra</summary><p>' + M("C(6, 3) + C(4, 1)C(6, 2) = 20 + 60 = 80") + "</p><p>Complement check: the committees with 2 or 3 teachers are " + M("C(4, 2)C(6, 1) + C(4, 3) = 36 + 4 = 40") + ", and " + M("120 - 40 = 80") + ".</p></details>";
    return h;
  }
  function s3HTML(s){
    var x = S.s3, sel = x.sel, h = card(s, 2);
    var a = sel.filter(function(k){ return k[0] === "a"; }).map(function(k){ return +k.slice(1); }).sort(), b = sel.filter(function(k){ return k[0] === "b"; }).map(function(k){ return +k.slice(1); }).sort();
    h += '<blockquote class="al-claim"><p><strong>A student says:</strong> “' + s.claim + "”</p></blockquote>";
    h += '<p class="al-step"><strong>Build a committee of 4.</strong> Tap names to choose them (' + sel.length + " of 4 chosen).</p>";
    h += club(G11.map(function(nm, i){ return tok(nm, 11, { btn:"a" + i, on:sel.indexOf("a" + i) >= 0 }); }), G12.map(function(nm, i){ return tok(nm, 12, { btn:"b" + i, on:sel.indexOf("b" + i) >= 0 }); }), "Grade 11 (5)", "Grade 12 (6)");
    if (msg.s3) h += '<p class="tiny al-msg" role="status">' + msg.s3 + "</p>";
    var names = a.map(function(i){ return G11[i]; }).concat(b.map(function(i){ return G12[i]; }));
    h += '<div class="al-trace" aria-live="polite"><h4>Where {' + names.join(", ") + "} appears in the student’s 600</h4>";
    if (sel.length !== 4) h += '<p class="muted">Choose exactly 4 people.</p>';
    else if (!a.length) h += "<p>This committee has no grade 11, so it isn’t in the student’s list at all (and it shouldn’t be).</p>";
    else {
      h += '<ol class="al-lines">' + a.map(function(g){
        var rest = names.filter(function(nm){ return nm !== G11[g]; });
        return '<li class="' + (a.length > 1 ? "dbl" : "") + '"><strong>' + G11[g] + "</strong> <span class=\"al-gtag\">guaranteed</span> + " + rest.join(", ") + "</li>";
      }).join("") + "</ol>";
      h += '<p class="al-verdict' + (a.length > 1 ? " bad" : "") + '">' + (a.length === 1 ? "Counted once: with one grade 11, there’s only one way to “guarantee” it." : "<strong>Counted " + a.length + " times.</strong> " + (a.length === 2 ? "Once with " + G11[a[0]] + " “guaranteed” and once with " + G11[a[1]] + "." : "Once for each grade 11 who could be the “guaranteed” one.")) + "</p>";
    }
    h += "</div>";
    h += '<div class="al-bars"><p class="al-bl">The student’s count</p>' + barHTML([{ v:600, cls:"over", t:"600" }], 600, "The student's count: 600") +
      '<p class="al-bl">Every committee of 4, any grades</p>' + barHTML([{ v:330, cls:"all", t:"330" }], 600, "All committees: 330") +
      '<p class="al-bl">At least one grade 11 (true count)</p>' + barHTML([{ v:315, cls:"a1", t:"315" }], 600, "True count: 315") + "</div>";
    h += '<p class="al-imp"><strong>' + s.impossible + "</strong> " + s.m3 + "</p>";
    var kk = sel.length === 4 ? a.length : -1;
    h += '<details class="alg"' + (S.s3.alg ? " open" : "") + '><summary>Check it with algebra</summary>' + MV.tableHTML({ head:["Grade 11s on the committee", "Committees", "Times in the 600", "Count in the 600"], hiRow:kk >= 1 ? kk - 1 : null, caption:"How the 600 overcounts",
      rows:[[1, 100, "× 1", 100], [2, 150, "× 2", 300], [3, 60, "× 3", 180], [4, 5, "× 4", 20], ["Total", "<strong>315</strong>", "", "<strong>600</strong>"]] }) +
      "<p>" + M("100 + 2(150) + 3(60) + 4(5) = 600") + ", but only " + M("100 + 150 + 60 + 5 = 315") + " committees exist with at least one grade 11.</p></details>";
    if (done("s3")) h += '<p class="al-done"><strong>✓ ' + s.done + "</strong> Use cases or the complement instead.</p>";
    return h;
  }
  function paint(){
    tabText(); tabs.refresh();
    var s = st(S.cur), body = $("#al-body", host), i = ST.indexOf(s);
    var old = $("details.alg", body), open = old ? old.open : false;
    var h = s.id === "s1" ? s1HTML(s) : s.id === "s2" ? s2HTML(s) : s3HTML(s);
    MV.keepFocus(body, function(){ body.innerHTML = h; });
    var d = $("details.alg", body); if (d && open) d.open = true;
    void i;
  }
  host.addEventListener("toggle", function(e){ if (e.target.matches && e.target.matches("details.alg") && S.cur === "s3") { S.s3.alg = e.target.open; api.save(); } }, true);
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !$("#al-body", host).contains(b)) return;
    var wasDone = ST.map(function(s){ return done(s.id); }).join(",");
    if (b.dataset.c1 != null) {
      var k = +b.dataset.c1, s = st("s1");
      if (k === 0) msg.s1 = s.zero;
      else { var j = S.s1.cases.indexOf(k); if (j >= 0) S.s1.cases.splice(j, 1); else { S.s1.cases.push(k); S.s1.cases.sort(); } msg.s1 = null; }
    } else if (b.dataset.c1x) { S.s1[b.dataset.c1x] = !S.s1[b.dataset.c1x]; }
    else if (b.dataset.c2 != null) {
      var k2 = +b.dataset.c2;
      if (k2 >= 2) msg.s2 = st("s2").tooMany;
      else { var j2 = S.s2.cases.indexOf(k2); if (j2 >= 0) S.s2.cases.splice(j2, 1); else { S.s2.cases.push(k2); S.s2.cases.sort(); } msg.s2 = null; }
    } else if (b.dataset.tk) {
      var id = b.dataset.tk, sel = S.s3.sel, j3 = sel.indexOf(id);
      if (j3 >= 0) { sel.splice(j3, 1); msg.s3 = null; }
      else if (sel.length >= 4) msg.s3 = "A committee has 4 people. Tap a chosen name to remove it first.";
      else { sel.push(id); msg.s3 = null; }
      var dflt = sel.length === 4 && ["a0", "a1", "b0", "b1"].every(function(x){ return sel.indexOf(x) >= 0; });
      if (sel.length === 4 && !dflt) S.s3.own = true;
    } else return;
    api.save(); paint();
    if (wasDone !== ST.map(function(s){ return done(s.id); }).join(",")) MV.focusFb($("#al-body", host));
  });
  paint();
  return {};
}

// ---------- Performance task: The fair committee ----------
var task = (function(){
  var api = null;
  function read(){ var s = api ? api.S : {}; return { g:clampI(s.g, 1, 8, 3), b:clampI(s.b, 1, 8, 4) }; }
  function vals(d){ var tot = C(d.g + d.b, 3), nb = C(d.b, 3); return { tot:tot, all11:C(d.g, 3), no11:nb, least:tot - nb }; }
  function paint(){
    var d = read(), v = vals(d), pvw = $("#fc-pv");
    if (!pvw) return;
    var h = '<p class="tiny muted" style="margin:0 0 4px">Your club: ' + (d.g + d.b) + " members</p>";
    h += '<div class="al-toks fc-toks" role="img" aria-label="' + MV.esc(d.g + " grade 11s and " + d.b + " grade 12s") + '">';
    for (var i = 0; i < d.g; i++) h += '<span class="al-tok a sm">11</span>';
    for (i = 0; i < d.b; i++) h += '<span class="al-tok b sm">12</span>';
    h += "</div>";
    h += '<dl class="read fc-read">' + MV.readoutHTML([
      ["Total", M("C(" + d.g + " + " + d.b + ", 3) = C(" + (d.g + d.b) + ", 3)") + " = <strong>" + v.tot + "</strong>"],
      ["All grade 11", M("C(" + d.g + ", 3)") + " = <strong>" + v.all11 + "</strong>"],
      ["No grade 11", M("C(" + d.b + ", 3)") + " = <strong>" + v.no11 + "</strong>"],
      ["At least one grade 11", v.tot + " − " + v.no11 + " = <strong>" + v.least + "</strong>"]]) + "</dl>";
    pvw.innerHTML = h;
  }
  function info(k){ var p = k.split(","), d = { g:+p[0], b:+p[1] }, v = vals(d); return { d:d, v:v }; }
  return {
    render:function(inp, pv, a){
      api = a; var d = read(); a.S.g = d.g; a.S.b = d.b;
      inp.innerHTML = '<div id="fc-sl" class="cb-sl fc-sl"></div>';
      MV.sliders($("#fc-sl"), [
        { id:"fcg", label:"Grade 11s " + M("g"), param:"n", min:1, max:8, step:1, value:d.g },
        { id:"fcb", label:"Grade 12s " + M("b"), param:"d", min:1, max:8, step:1, value:d.b }], function(id, v){
        if (id === "fcg") a.S.g = v; else a.S.b = v;
        a.save(); paint(); a.update();
      });
      pv.innerHTML = '<div class="fc-pv" id="fc-pv" aria-live="polite"></div>';
      paint();
    },
    read:read,
    valid:function(d){ return d.g >= 1 && d.g <= 8 && d.b >= 1 && d.b <= 8 ? true : "Choose whole numbers from 1 to 8."; },
    checks:function(d){ var v = vals(d); return [v.all11 < 10, v.least >= 100, v.tot <= 200]; },
    key:function(d){ return d.g + "," + d.b; },
    label:function(k){ var x = info(k); return M("(g, b) = (" + x.d.g + ", " + x.d.b + ")") + ": " + x.v.tot + " total, " + x.v.least + " with a grade 11"; },
    text:function(k){ var x = info(k); return "g = " + x.d.g + ", b = " + x.d.b + " (" + x.v.tot + " total, " + x.v.least + " with a grade 11)"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
