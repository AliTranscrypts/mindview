// MDM4U 08 Permutations with Identical Objects: hero (labelled BANANA line-ups stack and merge, 720 → 120 → 60), Word scrambler
// (Explore: D4 arrangement tiles with identical-tile highlighting, label toggle, Count / Group identical / Shuffle views, Make
// your own keyboard; Grid paths mode on the D5 grid-path view), Paths on a grid (Part 3: four stations), Design a word task.
(function(){
"use strict";
var $ = MV.$;
function M(s){ return MV.m(s); }
function fact(n){ var v = MV.mdm.fact(n); return typeof v === "bigint" ? Number(v) : v; }
function big(v){ return MV.mdm.fmt(v).replace(/ /g, " "); }
var SUBD = "₀₁₂₃₄₅₆₇₈₉";
function subTxt(k){ return String(k).split("").map(function(d){ return SUBD[+d]; }).join(""); }
function plural(n, w){ return n + " " + w + (n === 1 ? "" : "s"); }
function clampInt(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }

// @component radioGroup (copied from MDM4U 05; setOptions(list) for option sets that change with other controls)
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

// @component D4 arrangementTiles — identical-objects version (adapted from MDM4U 06 / 07): letter tiles where every repeated
// letter is highlighted (highlighter fill and a heavier ink border; the letter itself stays the main signal) and can carry a
// label subscript (A₁, A₂, A₃: "label the twins"). Helpers count letters, list distinct words (multiset permutations in
// dictionary order), list the labelled versions of a word (one per shuffle of each repeated letter's labels) and shuffle a
// labelled line-up with a seeded random.
//   D4.tally(w) -> [{ch, n}] in first-appearance order    D4.count(w) -> n!/(a! b! ⋯)    D4.pattern(w) -> "3,2,1"
//   D4.labels(w) -> [k | 0] per position (occurrence number of a repeated letter, 0 for a single letter)
//   D4.tile(ch, lab, o) -> html (o: {rep, sm})    D4.row(w, labs, o) -> html row with an aria-label (o: {sm, cls})
//   D4.words(w, limit, first) -> distinct words (first: put this one first)    D4.versions(d, cap) -> [labs] for word d
//   D4.shuffle(w, rnd) -> {word, labs}    D4.txt(w, labs) -> "B A₁ N₁ …" plain text    D4.verHTML(w, labs) -> compact html
var D4 = (function(){
  function tally(w){
    var order = [], c = {};
    for (var i = 0; i < w.length; i++) { var ch = w[i]; if (!c[ch]) { c[ch] = 0; order.push(ch); } c[ch]++; }
    return order.map(function(ch){ return { ch:ch, n:c[ch] }; });
  }
  function count(w){ var d = 1; tally(w).forEach(function(x){ d *= fact(x.n); }); return fact(w.length) / d; }
  function pattern(w){ return tally(w).map(function(x){ return x.n; }).sort(function(a, b){ return b - a; }).join(","); }
  function reps(w){ var r = {}; tally(w).forEach(function(x){ if (x.n > 1) r[x.ch] = true; }); return r; }
  function labels(w){ var r = reps(w), k = {}; return w.split("").map(function(ch){ if (!r[ch]) return 0; k[ch] = (k[ch] || 0) + 1; return k[ch]; }); }
  function tile(ch, lab, o){ o = o || {}; return '<span class="pi-t' + (o.rep ? " rep" : "") + (o.sm ? " sm" : "") + '">' + ch + (lab ? "<sub>" + lab + "</sub>" : "") + "</span>"; }
  function txt(w, labs){ return w.split("").map(function(ch, i){ return ch + (labs && labs[i] ? subTxt(labs[i]) : ""); }).join(" "); }
  function row(w, labs, o){
    o = o || {}; var r = reps(w);
    return '<span class="pi-row' + (o.cls ? " " + o.cls : "") + '" role="img" aria-label="' + MV.esc(txt(w, labs)) + '">' + w.split("").map(function(ch, i){ return tile(ch, labs ? labs[i] : 0, { rep:r[ch], sm:o.sm }); }).join("") + "</span>";
  }
  function verHTML(w, labs){ return w.split("").map(function(ch, i){ return ch + (labs[i] ? "<sub>" + labs[i] + "</sub>" : ""); }).join(""); }
  function permsK(c, limit){
    var out = [];
    (function rec(cur, used){
      if (out.length >= limit) return;
      if (cur.length === c) { out.push(cur.slice()); return; }
      for (var i = 1; i <= c && out.length < limit; i++) if (!used[i]) { used[i] = 1; cur.push(i); rec(cur, used); cur.pop(); used[i] = 0; }
    })([], {});
    return out;
  }
  function words(w, limit, first){
    var keys = [], cnt = {}, out = [], n = w.length;
    w.split("").sort().forEach(function(ch){ if (!cnt[ch]) { cnt[ch] = 0; keys.push(ch); } cnt[ch]++; });
    if (first) out.push(first);
    (function rec(cur){
      if (out.length >= limit) return;
      if (cur.length === n) { var s = cur.join(""); if (s !== first) out.push(s); return; }
      for (var i = 0; i < keys.length && out.length < limit; i++) { var k = keys[i]; if (cnt[k]) { cnt[k]--; cur.push(k); rec(cur); cur.pop(); cnt[k]++; } }
    })([]);
    return out;
  }
  function versions(d, cap){
    var groups = tally(d).filter(function(x){ return x.n > 1; }), out = [];
    var pos = groups.map(function(g){ var p = []; for (var i = 0; i < d.length; i++) if (d[i] === g.ch) p.push(i); return p; });
    var P = groups.map(function(g){ return permsK(g.n, cap); });
    (function rec(gi, labs){
      if (out.length >= cap) return;
      if (gi === groups.length) { out.push(labs.slice()); return; }
      for (var k = 0; k < P[gi].length && out.length < cap; k++) { var p = P[gi][k]; pos[gi].forEach(function(ix, j){ labs[ix] = p[j]; }); rec(gi + 1, labs); }
    })(0, d.split("").map(function(){ return 0; }));
    return out;
  }
  function shuffle(w, rnd){
    var labs = labels(w), t = w.split("").map(function(ch, i){ return [ch, labs[i]]; });
    for (var i = t.length - 1; i > 0; i--) { var j = rnd.int(i + 1), x = t[i]; t[i] = t[j]; t[j] = x; }
    return { word:t.map(function(x){ return x[0]; }).join(""), labs:t.map(function(x){ return x[1]; }) };
  }
  return { tally:tally, count:count, pattern:pattern, reps:reps, labels:labels, tile:tile, row:row, txt:txt, verHTML:verHTML, words:words, versions:versions, shuffle:shuffle };
})();
// the formula for a word: n!/(a! b! ⋯) as MV.m source, and its pieces
function formula(w){
  var n = w.length, rp = D4.tally(w).filter(function(x){ return x.n > 1; }), d = 1;
  rp.forEach(function(x){ d *= fact(x.n); });
  var den = rp.map(function(x){ return x.n + "!"; }).join(" × ");
  return { n:n, rp:rp, d:d, den:den, all:fact(n), count:fact(n) / d, src:rp.length ? "{" + n + "!}/{" + den + "}" : n + "!" };
}

// @component D5 gridPaths — shortest-path grid (course plan D5's path mode; module-specific here, promoted for module 13): an
// R × U street grid drawn in SVG with HTML point buttons on top (points at least 24 px apart up to 6 × 6 at 390 px). Draws the
// current route in --pen, faded ghost routes (--ink-2 at 40%), highlighted leg rectangles (--hi-soft), a checkpoint (--ink
// ring), a blocked point (--ink-2 cross, never colour alone) and route counts beside the points. A route is a word "RRURU…";
// points are [x, y], x blocks east and y blocks north of Start.
//   GP.html({R, U, path, ghosts:[word | {w, x0, y0}], legs:[[x0, y0, x1, y1]], cp:[x, y], cpLab, block:[x, y], blockLab,
//            nums:{"x,y": n}, fresh:{"x,y":1}, mode:"path"|"all"|"none", focus:"x,y", aria, startLab, endLab}) -> html
//   GP.pts(word, x0, y0)   GP.end(word)   GP.count(R, U)   GP.all(R, U, limit) -> words in dictionary order (R before U)
//   GP.through(word, x, y)   GP.step(word, move, {R, U, block}) -> {word} | {err}   GP.mini(R, U, word, o) -> small svg
//   Point buttons carry data-gx / data-gy; in "path" mode only the next corners are tab stops; in "all" mode GP.rove(box)
//   moves focus between corners with the arrow keys.
var GP = (function(){
  var CELL = 56, PL = 30, PR = 30, PT = 40, PB = 34;
  function geo(R, U){ return { W:PL + PR + R * CELL, H:PT + PB + U * CELL, X:function(x){ return PL + x * CELL; }, Y:function(y){ return PT + (U - y) * CELL; } }; }
  function pts(word, x0, y0){ var x = x0 || 0, y = y0 || 0, p = [[x, y]]; for (var i = 0; i < word.length; i++) { if (word[i] === "R") x++; else y++; p.push([x, y]); } return p; }
  function end(word, x0, y0){ var p = pts(word, x0, y0); return p[p.length - 1]; }
  function count(R, U){ return fact(R + U) / (fact(R) * fact(U)); }
  function all(R, U, limit){
    var out = []; limit = limit || 1e9;
    (function rec(cur, r, u){ if (out.length >= limit) return; if (!r && !u) { out.push(cur); return; } if (r) rec(cur + "R", r - 1, u); if (u) rec(cur + "U", r, u - 1); })("", R, U);
    return out;
  }
  function through(word, x, y){ return pts(word).some(function(p){ return p[0] === x && p[1] === y; }); }
  function step(word, m, o){
    var e = end(word), nx = e[0] + (m === "R" ? 1 : 0), ny = e[1] + (m === "U" ? 1 : 0);
    if (nx > o.R || ny > o.U) return { err:m === "R" ? "You’re already at the east edge: only U moves are left." : "You’re already at the north edge: only R moves are left." };
    if (o.block && nx === o.block[0] && ny === o.block[1]) return { err:"Road work at (" + nx + ", " + ny + ")! That corner is blocked. Try the other direction." };
    return { word:word + m };
  }
  function line(p, g){ return p.map(function(q){ return g.X(q[0]) + "," + g.Y(q[1]); }).join(" "); }
  function html(o){
    var R = o.R, U = o.U, g = geo(R, U), path = o.path || "", e = end(path), x, y, h = "";
    (o.legs || []).forEach(function(L){ h += '<rect class="gp-leg" x="' + (g.X(L[0]) - 10) + '" y="' + (g.Y(L[3]) - 10) + '" width="' + ((L[2] - L[0]) * CELL + 20) + '" height="' + ((L[3] - L[1]) * CELL + 20) + '" rx="10"/>'; });
    for (x = 0; x <= R; x++) h += '<line class="gp-st" x1="' + g.X(x) + '" y1="' + g.Y(0) + '" x2="' + g.X(x) + '" y2="' + g.Y(U) + '"/>';
    for (y = 0; y <= U; y++) h += '<line class="gp-st" x1="' + g.X(0) + '" y1="' + g.Y(y) + '" x2="' + g.X(R) + '" y2="' + g.Y(y) + '"/>';
    (o.ghosts || []).forEach(function(gh){ var w = typeof gh === "string" ? gh : gh.w; h += '<polyline class="gp-gh" points="' + line(pts(w, gh.x0, gh.y0), g) + '"/>'; });
    if (o.hot) h += '<polyline class="gp-hot" points="' + line(pts(o.hot.w, o.hot.x0, o.hot.y0), g) + '"/>';
    if (path) h += '<polyline class="gp-path" points="' + line(pts(path), g) + '"/>';
    for (x = 0; x <= R; x++) for (y = 0; y <= U; y++) h += '<circle class="gp-dot" cx="' + g.X(x) + '" cy="' + g.Y(y) + '" r="3.5"/>';
    if (o.cp) h += '<circle class="gp-cp" cx="' + g.X(o.cp[0]) + '" cy="' + g.Y(o.cp[1]) + '" r="12"/><text class="gp-lab" x="' + (g.X(o.cp[0]) + 15) + '" y="' + (g.Y(o.cp[1]) + 25) + '">' + (o.cpLab || "Checkpoint") + "</text>";
    if (o.block) { var bx = g.X(o.block[0]), by = g.Y(o.block[1]); h += '<path class="gp-bk" d="M' + (bx - 10) + " " + (by - 10) + "L" + (bx + 10) + " " + (by + 10) + "M" + (bx + 10) + " " + (by - 10) + "L" + (bx - 10) + " " + (by + 10) + '"/><text class="gp-lab" x="' + (bx + 15) + '" y="' + (by + 25) + '">' + (o.blockLab || "Blocked") + "</text>"; }
    h += '<circle class="gp-start" cx="' + g.X(0) + '" cy="' + g.Y(0) + '" r="7"/><text class="gp-lab" x="' + (g.X(0) - 6) + '" y="' + (g.Y(0) + 26) + '">' + (o.startLab || "Start") + "</text>";
    h += '<circle class="gp-end" cx="' + g.X(R) + '" cy="' + g.Y(U) + '" r="8"/><text class="gp-lab" text-anchor="end" x="' + (g.X(R) + 8) + '" y="' + (g.Y(U) - 24) + '">' + (o.endLab || "End") + "</text>";
    if (path) h += '<circle class="gp-cur" cx="' + g.X(e[0]) + '" cy="' + g.Y(e[1]) + '" r="6.5"/>';
    if (o.nums) Object.keys(o.nums).forEach(function(k){ var p = k.split(","), v = o.nums[k]; h += '<text class="gp-num' + (o.fresh && o.fresh[k] ? " fresh" : "") + (v === 0 ? " zero" : "") + '" x="' + (g.X(+p[0]) + 7) + '" y="' + (g.Y(+p[1]) - 8) + '">' + v + "</text>"; });
    var b = "", mode = o.mode || "path", fk = o.focus || "0,0", fresh = o.restart && path.length === R + U, en = fresh ? [0, 0] : e;
    if (mode !== "none") for (y = U; y >= 0; y--) for (x = 0; x <= R; x++) {
      var k = x + "," + y, nxt = mode === "path" && (fresh || path.length < R + U) && ((x === en[0] + 1 && y === en[1]) || (x === en[0] && y === en[1] + 1)) && !(o.block && o.block[0] === x && o.block[1] === y);
      var tab = mode === "all" ? (k === fk ? 0 : -1) : (nxt ? 0 : -1);
      var lab = "Corner (" + x + ", " + y + ")" + (x === 0 && y === 0 ? ", Start" : "") + (x === R && y === U ? ", End" : "") + (o.cp && o.cp[0] === x && o.cp[1] === y ? ", " + (o.cpLab || "checkpoint") : "") + (o.block && o.block[0] === x && o.block[1] === y ? ", " + (o.blockLab || "blocked") : "") +
        (o.nums && o.nums[k] != null ? ": " + o.nums[k] + " route" + (o.nums[k] === 1 ? "" : "s") : "") + (nxt ? (x > en[0] ? ": next, one block right" : ": next, one block up") + (fresh ? " (starts a new route)" : "") : "");
      b += '<button type="button" class="gp-pt' + (nxt ? " nx" : "") + '" style="left:' + (g.X(x) / g.W * 100).toFixed(3) + "%;top:" + (g.Y(y) / g.H * 100).toFixed(3) + '%" data-gx="' + x + '" data-gy="' + y + '" data-k="gp' + x + "_" + y + '" tabindex="' + tab + '" aria-label="' + MV.esc(lab) + '"></button>';
    }
    return '<div class="gp" data-mode="' + mode + '" style="max-width:' + Math.round(g.W * 1.2) + 'px"><svg class="gp-svg" viewBox="0 0 ' + g.W + " " + g.H + '" role="img" aria-label="' + MV.esc(o.aria || "Street grid") + '">' + h + '</svg><div class="gp-pts" role="group" aria-label="Corners of the grid">' + b + "</div></div>";
  }
  function mini(R, U, word, o){
    o = o || {}; var g = geo(R, U), h = "";
    for (var x = 0; x <= R; x++) h += '<line class="gp-st" x1="' + g.X(x) + '" y1="' + g.Y(0) + '" x2="' + g.X(x) + '" y2="' + g.Y(U) + '"/>';
    for (var y = 0; y <= U; y++) h += '<line class="gp-st" x1="' + g.X(0) + '" y1="' + g.Y(y) + '" x2="' + g.X(R) + '" y2="' + g.Y(y) + '"/>';
    h += '<polyline class="gp-path" points="' + line(pts(word), g) + '"/>';
    if (o.block) { var bx = g.X(o.block[0]), by = g.Y(o.block[1]); h += '<path class="gp-bk" d="M' + (bx - 13) + " " + (by - 13) + "L" + (bx + 13) + " " + (by + 13) + "M" + (bx + 13) + " " + (by - 13) + "L" + (bx - 13) + " " + (by + 13) + '"/>'; }
    return '<svg class="gp-mini" viewBox="0 0 ' + g.W + " " + g.H + '" aria-hidden="true" focusable="false">' + h + "</svg>";
  }
  function rove(box){
    box.addEventListener("keydown", function(e){
      var b = e.target.closest(".gp-pt"); if (!b || !box.contains(b) || !b.closest('.gp[data-mode="all"]')) return;
      var dx = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0, dy = e.key === "ArrowUp" ? 1 : e.key === "ArrowDown" ? -1 : 0;
      if (!dx && !dy) return;
      var nb = box.querySelector('.gp-pt[data-gx="' + (+b.dataset.gx + dx) + '"][data-gy="' + (+b.dataset.gy + dy) + '"]');
      e.preventDefault(); if (!nb) return;
      box.querySelectorAll(".gp-pt").forEach(function(x){ x.tabIndex = -1; }); nb.tabIndex = 0; nb.focus();
    });
  }
  return { geo:geo, pts:pts, end:end, count:count, all:all, through:through, step:step, html:html, mini:mini, rove:rove };
})();
// "R × 4, U × 3" and the paths formula for an R × U grid
function movesTxt(R, U){ return "R × " + R + ", U × " + U; }
function pathsSrc(R, U){ return "{" + (R + U) + "!}/{" + R + "! " + U + "!}"; }
function pathWordHTML(word, len){
  var h = word.split("").map(function(m){ return D4.tile(m, 0, { rep:true, sm:true }); }).join("");
  for (var i = word.length; i < len; i++) h += '<span class="pi-t sm pend" aria-hidden="true"></span>';
  return '<span class="pi-row" role="img" aria-label="' + MV.esc(word ? "Path word " + word.split("").join(" ") + (word.length < len ? ", " + (len - word.length) + " moves to go" : "") : "No moves yet") + '">' + h + "</span>";
}

// ---------- Explore: Word scrambler ----------
var WORDS = ["CANADA", "OTTAWA", "BANANA", "TORONTO", "KAYAK", "QUEBEC"];
var KEYS = "ABCDEFGH".split("");
var VIEWS = [{ id:"count", t:"Count" }, { id:"group", t:"Group identical" }, { id:"shuffle", t:"Shuffle" }];
function explore(host, api){
  var S = api.S;
  if (S.mode !== "grid") S.mode = "words";
  if (WORDS.indexOf(S.word) < 0 && S.word !== "custom") S.word = "BANANA";
  S.custom = typeof S.custom === "string" ? S.custom.replace(/[^A-H]/g, "").slice(0, 8) : "";
  S.labels = !!S.labels;
  if (!VIEWS.some(function(v){ return v.id === S.view; })) S.view = "count";
  S.R = clampInt(S.R, 1, 6, 4); S.U = clampInt(S.U, 1, 6, 3);
  S.path = typeof S.path === "string" && /^[RU]*$/.test(S.path) ? S.path : "";
  if (!pathOk(S.path)) S.path = "";
  var pv = {}, anim = null, shuf = null, found = {}, rnd = 0, gmsg = "", kmsg = "";

  host.innerHTML =
    '<div class="pi-top"><div id="pi-mode"></div>' +
      '<div id="pi-wtop"><div id="pi-wchips"></div><div class="pi-trow"><div id="pi-vseg"></div><button type="button" class="chip pi-lt" id="pi-lt" data-k="pilt" aria-pressed="false">Label the twins (A₁, A₂, …)</button></div></div>' +
      '<div id="pi-gtop" class="pi-steps" hidden></div></div>' +
    '<div class="pg pi-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap pi-cap" id="pi-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="pi-wbox"><div id="pi-tiles" class="pi-tiles"></div><div id="pi-kb"></div><div id="pi-panel" class="pi-panel"></div></div>' +
      '<div id="pi-gwrap" hidden><div id="pi-gbox"></div><div id="pi-gword" class="pi-gword"></div><p class="tiny pi-gmsg" id="pi-gmsg" aria-live="polite"></p><div id="pi-gal" class="pi-gal"></div></div></div>' +
    '<div class="pg-ctrl"><div id="pi-ctrl"></div></div>' +
    '<div class="pg-read"><dl class="read" id="pi-read" aria-live="polite"></dl></div></div>';

  var modeR = radios($("#pi-mode", host), { label:"Mode", options:[{ id:"words", t:"Words" }, { id:"grid", t:"Grid paths" }], value:S.mode, cls:"seg",
    onChange:function(v){ user(); S.mode = v; save(); render(); MV.changed(); } });
  var wordR = radios($("#pi-wchips", host), { label:"Word", options:WORDS.map(function(w){ return { id:w, t:w }; }).concat([{ id:"custom", t:"Make your own" }]), value:S.word, cls:"chips",
    onChange:function(v){ user(); S.word = v; kmsg = ""; save(); render(); MV.changed(); } });
  var viewR = radios($("#pi-vseg", host), { label:"View", options:VIEWS, value:S.view, cls:"seg",
    onChange:function(v){ user(); S.view = v; save(); render(); MV.changed(); } });

  function save(){ api.save(); }
  function pathOk(p){ var r = 0, u = 0; for (var i = 0; i < p.length; i++) { if (p[i] === "R") r++; else u++; } return r <= S.R && u <= S.U; }
  function word(){ return S.word === "custom" ? S.custom : S.word; }
  function user(){ cancelAnim(); pv = {}; MV.banner("", ""); }

  // --- animation bookkeeping (predictions, random path, every path); any user action cancels and finishes it ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], fin:fin || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function endAnim(){ var a = anim; anim = null; render(); if (a && a.fin) { var f = a.fin; a.fin = null; f(); } }
  function cancelAnim(){
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout);
    if (a.fin) { var f = a.fin; a.fin = null; f(); }
    render(); MV.changed();
  }

  // --- painting ---
  function render(){
    var g = S.mode === "grid";
    modeR.set(S.mode); wordR.set(S.word); viewR.set(S.view);
    $("#pi-wtop", host).hidden = g; $("#pi-gtop", host).hidden = !g; $("#pi-wbox", host).hidden = g; $("#pi-gwrap", host).hidden = !g;
    var lt = $("#pi-lt", host); lt.setAttribute("aria-pressed", String(S.labels));
    if (g) { paintSteps(); paintGrid(); } else { paintTiles(); paintKb(); paintPanel(); }
    paintCtrl(); paintCap(); paintRead();
  }
  function hidden(){ return !!pv.hide; }
  function paintTiles(){
    var w = word(), t = $("#pi-tiles", host);
    if (!w) { t.innerHTML = '<p class="muted pi-empty">Your word appears here. Tap letters below to build it (up to 8).</p>'; return; }
    var sh = S.view === "shuffle" && shuf && shuf.src === w ? shuf : null;
    var ww = sh ? sh.word : w, labs = S.labels ? (sh ? sh.labs : D4.labels(w)) : null;
    t.innerHTML = D4.row(ww, labs, { cls:"pi-big" + (sh && pv.pop ? " pop" : "") }) +
      '<p class="tiny muted pi-legend"><span class="pi-t sm rep" aria-hidden="true">A</span> repeated letter (identical tiles)' + (S.labels ? "; the small numbers label the twins so you can tell them apart" : "") + "</p>";
  }
  function paintKb(){
    var k = $("#pi-kb", host);
    if (S.word !== "custom") { k.innerHTML = ""; return; }
    var full = S.custom.length >= 8;
    MV.keepFocus(k, function(){
      k.innerHTML = '<div class="pi-kbw"><p class="pi-plab">Make your own: tap letters (up to 8)</p><div class="pi-keys" role="group" aria-label="Letter keyboard">' +
        KEYS.map(function(ch){ return '<button type="button" class="pi-key" data-key="' + ch + '" data-k="pik' + ch + '" aria-label="Add ' + ch + '"' + (full ? " disabled" : "") + ">" + ch + "</button>"; }).join("") +
        '</div><div class="q-actions"><button type="button" class="btn ghost sm" data-kb="del" data-k="pikdel"' + (S.custom ? "" : " disabled") + '>Delete last</button><button type="button" class="btn ghost sm" data-kb="clr" data-k="pikclr"' + (S.custom ? "" : " disabled") + ">Clear</button></div>" +
        (kmsg ? '<p class="tiny pi-msg">' + kmsg + "</p>" : "") + "</div>";
    });
  }
  function paintPanel(){
    var p = $("#pi-panel", host), w = word();
    if (!w) { p.innerHTML = ""; return; }
    if (S.view === "count") p.innerHTML = countHTML(w);
    else if (S.view === "group") p.innerHTML = groupHTML(w);
    else MV.keepFocus(p, function(){ p.innerHTML = shuffleHTML(w); });
  }
  function countHTML(w){
    var f = formula(w), hide = hidden(), k = pv.build == null ? 3 : pv.build, single = D4.tally(w).filter(function(x){ return x.n === 1; });
    var l1 = "If all were different: " + M(f.n + "! = " + big(f.all)) + " labelled line-ups";
    var chips = f.rp.map(function(x){ return '<span class="pi-rc">' + x.ch + " × " + x.n + " → " + M(x.n + "! = " + fact(x.n)) + "</span>"; }).join("");
    var l2 = f.rp.length ? "Repeated letters: " + chips + (single.length ? ' <span class="muted">single: ' + single.map(function(x){ return x.ch; }).join(", ") + " (" + M("1! = 1") + ")</span>" : "")
      : "No letter repeats: every letter contributes " + M("1! = 1") + ".";
    var l3 = f.rp.length ? "Divide: " + big(f.all) + " ÷ (" + M(f.den) + ") = " + big(f.all) + " ÷ " + big(f.d) + " = <strong>" + big(f.count) + "</strong> distinct " + (f.count === 1 ? "word" : "words")
      : "Nothing to divide by: <strong>" + big(f.count) + "</strong> distinct " + (f.count === 1 ? "word" : "words");
    var L = [l1, hide ? "Repeated letters: ?" : l2, hide ? "Divide: ?" : l3];
    return '<div class="pi-cv">' + L.map(function(l, i){ return '<p class="pi-cl' + (i < k ? "" : " off") + (pv.build != null && i === k - 1 ? " fresh" : "") + '">' + l + "</p>"; }).join("") + "</div>";
  }
  function groupHTML(w){
    var n = w.length, f = formula(w), small = n <= 5, nW = small ? f.count : Math.min(4, f.count), cap = small ? 120 : 24;
    var list = D4.words(w, nW, w), per = f.d, shown = pv.stackN == null ? list.length : pv.stackN, rowsMax = pv.rowN == null ? Infinity : pv.rowN;
    var h = '<p class="tiny muted pi-gnote">' + (small ? "Each distinct word with its stack of labelled line-ups: " + plural(f.count, "stack") + " of " + per + "." : "Showing " + nW + " of " + big(f.count) + " stacks (Group view lists every stack for words of 5 letters or fewer). Each stack holds " + per + " labelled line-ups.") + "</p>";
    h += '<div class="pi-stks' + (per > 12 ? " wide" : "") + '">' + list.map(function(d, i){
      if (i >= shown) return "";
      var vs = D4.versions(d, cap), more = per - vs.length;
      return '<div class="pi-stk' + (pv.stackN != null && i === shown - 1 ? " fresh" : "") + '"><div class="pi-sh">' + D4.row(d, null, { sm:true, cls:"xs" }) + '<span class="pi-sx">× ' + per + '</span></div><ul class="pi-sl" aria-label="' + MV.esc(per + " labelled line-ups that spell " + d) + '">' +
        vs.map(function(l, j){ return j < rowsMax ? '<li class="pi-v">' + D4.verHTML(d, l) + "</li>" : ""; }).join("") + (more > 0 ? '<li class="pi-v more">+ ' + big(more) + " more</li>" : "") + "</ul></div>";
    }).join("") + "</div>";
    return h;
  }
  function shuffleHTML(w){
    var f = formula(w), fk = found[w] || [], sh = shuf && shuf.src === w ? shuf : null;
    var h = '<div class="q-actions"><button type="button" class="btn primary sm" data-sh="1" data-k="pishuf">Shuffle</button>' + (fk.length ? '<button type="button" class="btn ghost sm" data-sh="reset" data-k="pishr">Forget the words seen</button>' : "") + "</div>";
    if (sh) h += '<p class="pi-shl">This line-up spells <strong>' + sh.word + "</strong>" + (f.d > 1 ? (S.labels ? ". Ignore the labels: " + plural(f.d - 1, "other labelled line-up") + " spell" + (f.d - 1 === 1 ? "s" : "") + " the same word." : ". Turn on <em>Label the twins</em> to see which identical tiles moved.") : ".") + "</p>";
    else h += '<p class="tiny muted pi-shl">Each tap shuffles the tiles into a random line-up.</p>';
    h += '<p class="pi-shc">Distinct words seen: <strong>' + fk.length + "</strong> of " + big(f.count) + "</p>";
    if (fk.length) h += '<div class="pi-found" aria-label="Words seen">' + fk.slice(-60).map(function(x){ return '<span class="pi-fw' + (sh && x === sh.word ? " on" : "") + '">' + x + "</span>"; }).join("") + (fk.length > 60 ? '<span class="pi-fw more">(last 60 shown)</span>' : "") + "</div>";
    return h;
  }
  function paintSteps(){
    var b = $("#pi-gtop", host);
    function row(id, lab, v){ return '<div class="pi-stp" role="group" aria-label="' + MV.esc(lab) + '"><span class="pi-stl">' + lab.slice(0, -1) + M(id) + '</span><button type="button" class="btn ghost sm pi-stb" data-st="' + id + '" data-d="-1" data-k="pist' + id + 'm" aria-label="' + lab + ': fewer"' + (v <= 1 ? " disabled" : "") + '>−</button><output class="pi-sto" aria-live="polite">' + v + '</output><button type="button" class="btn ghost sm pi-stb" data-st="' + id + '" data-d="1" data-k="pist' + id + 'p" aria-label="' + lab + ': more"' + (v >= 6 ? " disabled" : "") + ">+</button></div>"; }
    MV.keepFocus(b, function(){ b.innerHTML = row("R", "Right moves R", S.R) + row("U", "Up moves U", S.U); });
  }
  function paintGrid(){
    var box = $("#pi-gbox", host), gal = pv.gal || null, n = pv.galN == null ? (gal ? gal.length : 0) : pv.galN;
    var ghosts = gal && pv.galN != null ? gal.slice(0, Math.max(0, n - 1)) : [];
    MV.keepFocus(box, function(){
      box.innerHTML = GP.html({ R:S.R, U:S.U, path:S.path, ghosts:ghosts, mode:"path", aria:"Street grid " + S.R + " blocks right and " + S.U + " blocks up. " + (S.path ? "Current path " + S.path.split("").join(" ") + "." : "No path drawn yet.") });
    });
    $("#pi-gword", host).innerHTML = '<span class="pi-plab">Path word</span>' + pathWordHTML(S.path, S.R + S.U);
    $("#pi-gmsg", host).innerHTML = gmsg;
    var gh = $("#pi-gal", host);
    if (!gal) { gh.innerHTML = ""; return; }
    gh.innerHTML = '<p class="pi-plab">' + (hidden() ? "Paths so far: " + n : "Every path: " + n + " of " + gal.length) + '</p><div class="pi-galg">' + gal.slice(0, n).map(function(w, i){ return '<span class="pi-gi' + (i === n - 1 && pv.galN != null ? " cur" : "") + '">' + GP.mini(S.R, S.U, w) + "<small>" + w + "</small></span>"; }).join("") + "</div>";
  }
  function paintCtrl(){
    var c = $("#pi-ctrl", host);
    if (S.mode !== "grid") { c.innerHTML = '<p class="tiny muted pi-how">Choose a word, or <strong>Make your own</strong>. <strong>Count</strong> builds the formula, <strong>Group identical</strong> stacks the labelled line-ups that spell the same word, and <strong>Shuffle</strong> scrambles the tiles.</p>'; return; }
    var e = GP.end(S.path), busy = false, many = GP.count(S.R, S.U) > 70;
    MV.keepFocus(c, function(){
      c.innerHTML = '<div class="q-actions pi-gm"><button type="button" class="btn sm" data-gm="R" data-k="pigmR"' + (busy || e[0] >= S.R ? " disabled" : "") + ' aria-label="Move one block right (R)">R →</button>' +
        '<button type="button" class="btn sm" data-gm="U" data-k="pigmU"' + (busy || e[1] >= S.U ? " disabled" : "") + ' aria-label="Move one block up (U)">U ↑</button>' +
        '<button type="button" class="btn ghost sm" data-ga="undo" data-k="piga-undo"' + (busy || !S.path ? " disabled" : "") + ">Undo</button>" +
        '<button type="button" class="btn ghost sm" data-ga="clear" data-k="piga-clear"' + (busy || !S.path ? " disabled" : "") + ">Clear</button></div>" +
        '<div class="q-actions"><button type="button" class="btn primary sm" data-ga="random" data-k="piga-rnd"' + (busy ? " disabled" : "") + ">Random path</button>" +
        '<button type="button" class="btn ghost sm" data-ga="every" data-k="piga-all"' + (busy || many ? " disabled" : "") + ">Show every path</button></div>" +
        '<p class="tiny muted pi-how">Tap <strong>R</strong> or <strong>U</strong>, press → or ↑, or tap the next corner (dashed ring). Backspace undoes a move.' + (many ? " <em>Show every path</em> works up to 70 paths." : "") + "</p>";
    });
  }
  function paintCap(){
    var c = $("#pi-cap", host), hide = hidden();
    if (S.mode === "grid") { c.innerHTML = hide ? M(pathsSrc(S.R, S.U)) + " = ?" : M(pathsSrc(S.R, S.U) + " = " + big(GP.count(S.R, S.U))) + " paths"; return; }
    var w = word();
    if (!w) { c.textContent = "Build a word"; return; }
    var f = formula(w);
    c.innerHTML = hide ? M(f.n + "! = " + big(f.all)) + " line-ups ÷ ? = ?" : M(f.src + " = " + big(f.count));
  }
  function paintRead(){
    var hide = hidden(), rows = [];
    if (S.mode === "grid") {
      var L = S.R + S.U;
      rows.push(["Moves", movesTxt(S.R, S.U)]);
      rows.push(["Shortest paths", hide ? "?" : M(pathsSrc(S.R, S.U)) + " = <strong>" + big(GP.count(S.R, S.U)) + "</strong>"]);
      rows.push(["Current path", S.path ? '<span class="pi-pw">' + S.path + "</span>" + (S.path.length < L ? ' <span class="muted">(' + S.path.length + " of " + L + " moves)</span>" : "") : '<span class="muted">none yet</span>']);
      rows.push(["A path is a word", "of " + S.R + " R" + (S.R === 1 ? "" : "’s") + " and " + S.U + " U" + (S.U === 1 ? "" : "’s") + ': <span class="muted">' + M(pathsSrc(S.R, S.U)) + " counts its arrangements</span>"]);
    } else {
      var w = word();
      if (!w) rows.push(["Letters", '<span class="muted">build a word first</span>']);
      else {
        var f = formula(w), single = D4.tally(w).filter(function(x){ return x.n === 1; });
        rows.push(["Letters", String(f.n)]);
        rows.push(["Repeated letters", (f.rp.length ? f.rp.map(function(x){ return x.ch + " × " + x.n; }).join(", ") : "none") + (single.length ? '; <span class="muted">single: ' + single.map(function(x){ return x.ch; }).join(", ") + "</span>" : "")]);
        rows.push(["If all were different", M(f.n + "! = " + big(f.all))]);
        rows.push(["Divide by", hide ? "?" : f.rp.length ? M(f.den) + " = " + big(f.d) : '1 <span class="muted">(no repeats)</span>']);
        rows.push(["Distinct arrangements", hide ? "?" : "<strong>" + big(f.count) + "</strong>"]);
      }
    }
    $("#pi-read", host).innerHTML = MV.readoutHTML(rows);
  }

  // --- grid moves ---
  function move(m){
    if (anim) return;
    var r = GP.step(S.path, m, { R:S.R, U:S.U });
    if (r.err) { gmsg = r.err; render(); return; }
    S.path = r.word; gmsg = S.path.length === S.R + S.U ? "✓ Path complete: <strong>" + S.path + "</strong>, one of " + big(GP.count(S.R, S.U)) + " shortest paths." : "";
    save(); render(); MV.changed();
  }
  function randomPath(){
    var r = MV.mdm.seededRandom("mdm4u-08-path-" + S.R + "-" + S.U + "-" + (rnd++)), L = [], i;
    for (i = 0; i < S.R; i++) L.push("R"); for (i = 0; i < S.U; i++) L.push("U");
    for (i = L.length - 1; i > 0; i--) { var j = r.int(i + 1), t = L[i]; L[i] = L[j]; L[j] = t; }
    var target = L.join(""), k = 0;
    newAnim(null); pv = {}; S.path = ""; gmsg = "";
    if (MV.reduceMotion) k = target.length - 1; else render();
    (function tick(){
      k++; S.path = target.slice(0, k); render();
      if (k < target.length) later(MV.reduceMotion ? 0 : 260, tick);
      else { gmsg = "Random path: <strong>" + target + "</strong>, one of " + big(GP.count(S.R, S.U)) + "."; save(); later(MV.reduceMotion ? 0 : 200, function(){ endAnim(); MV.changed(); }); }
    })();
  }
  function everyPath(done, keepHide){
    var list = GP.all(S.R, S.U), per = Math.max(140, Math.min(700, Math.round(5200 / list.length)));
    newAnim(done); pv = { gal:list, galN:0, hide:!!keepHide }; gmsg = "";
    if (MV.reduceMotion) pv.galN = list.length - 1;   // reduced motion: jump to the final state
    (function tick(){
      pv.galN++; S.path = list[pv.galN - 1]; render();
      if (pv.galN < list.length) later(MV.reduceMotion ? 0 : per, tick);
      else later(MV.reduceMotion ? 0 : 450, function(){
        pv = { gal:list }; S.path = ""; gmsg = "All " + list.length + " paths: every one is an arrangement of " + "R".repeat(S.R) + "U".repeat(S.U) + "."; save();
        endAnim(); MV.changed();
      });
    })();
  }

  // --- events ---
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.id === "pi-lt") { user(); S.labels = !S.labels; save(); render(); return; }
    if (b.dataset.key) { user(); if (S.custom.length < 8) { S.custom += b.dataset.key; kmsg = ""; } else kmsg = "Your word is full: 8 letters at most."; save(); render(); MV.changed(); return; }
    if (b.dataset.kb) { user(); if (b.dataset.kb === "del") S.custom = S.custom.slice(0, -1); else S.custom = ""; kmsg = ""; save(); render(); MV.changed(); return; }
    if (b.dataset.sh) {
      user(); var w = word();
      if (b.dataset.sh === "reset") { found[w] = []; shuf = null; render(); return; }
      var s = D4.shuffle(w, MV.mdm.seededRandom("mdm4u-08-shuffle-" + w + "-" + (rnd++)));
      shuf = { src:w, word:s.word, labs:s.labs };
      var fk = found[w] || (found[w] = []); if (fk.indexOf(s.word) < 0) fk.push(s.word); if (fk.length > 400) fk.splice(0, fk.length - 400);
      pv.pop = true; render(); pv.pop = false;
      var sb = host.querySelector('[data-k="pishuf"]'); if (sb) sb.focus({ preventScroll:true });
      return;
    }
    if (b.dataset.st) {
      user(); var id = b.dataset.st; S[id] = Math.max(1, Math.min(6, S[id] + +b.dataset.d));
      if (!pathOk(S.path)) { S.path = ""; gmsg = ""; } else if (S.path.length < S.R + S.U) gmsg = "";
      save(); render(); MV.changed(); return;
    }
    if (b.dataset.gm) { user(); move(b.dataset.gm); return; }
    if (b.dataset.ga) {
      var a = b.dataset.ga;
      if (a === "undo") { user(); S.path = S.path.slice(0, -1); gmsg = ""; save(); render(); MV.changed(); }
      else if (a === "clear") { user(); S.path = ""; gmsg = ""; save(); render(); MV.changed(); }
      else if (a === "random") { MV.banner("", ""); randomPath(); }
      else if (a === "every") { MV.banner("", ""); everyPath(null); }
      return;
    }
    if (b.dataset.gx != null && S.mode === "grid") {
      user(); var x = +b.dataset.gx, y = +b.dataset.gy, en = GP.end(S.path);
      if (x === en[0] + 1 && y === en[1]) move("R");
      else if (x === en[0] && y === en[1] + 1) move("U");
      else if (!(x === en[0] && y === en[1])) { gmsg = "Tap the corner one block right of, or one block up from, the end of your path."; render(); }
    }
  });
  host.addEventListener("keydown", function(e){
    if (S.mode !== "grid" || !e.target.closest || !e.target.closest("#pi-gbox, .pi-gm")) return;
    if (e.key === "ArrowRight") { e.preventDefault(); user(); move("R"); }
    else if (e.key === "ArrowUp") { e.preventDefault(); user(); move("U"); }
    else if (e.key === "Backspace") { e.preventDefault(); user(); if (S.path) { S.path = S.path.slice(0, -1); gmsg = ""; save(); render(); MV.changed(); } }
    else return;
    var ae = document.activeElement;
    if (!ae || ae === document.body || !host.contains(ae)) { var f = host.querySelector("#pi-gbox .gp-pt.nx") || host.querySelector('[data-k="pigmR"]:not(:disabled)') || host.querySelector('[data-k="pigmU"]:not(:disabled)') || host.querySelector('[data-k="piga-undo"]'); if (f) f.focus(); }
  });

  render();

  // --- predictions ---
  function startPred(p){
    cancelAnim();
    var s = p.start || {};
    S.mode = s.mode;
    if (s.mode === "grid") { S.R = s.R; S.U = s.U; S.path = ""; gmsg = ""; }
    else { S.word = s.word; if (s.custom != null) S.custom = s.custom; S.labels = !!s.labels; S.view = s.view || "count"; kmsg = ""; }
    pv = { hide:true }; save(); render();
  }
  function runPred(p, done){
    if (p.id === "p3") { everyPath(function(){ pv.hide = false; render(); done(); }, true); return; }
    newAnim(done);
    if (p.id === "p2") {
      pv = { build:1 }; render();
      (function tick(){ if (pv.build < 3) { later(MV.reduceMotion ? 0 : 1100, function(){ pv.build++; render(); tick(); }); } else later(MV.reduceMotion ? 0 : 700, function(){ pv = {}; render(); MV.changed(); endAnim(); }); })();
      return;
    }
    // p1 and p4: the Group view fills stack by stack (p4: one stack, row by row)
    S.view = "group"; save();
    if (p.id === "p4") {
      pv = { hide:true, rowN:0 }; render();
      (function tick(){ pv.rowN++; render(); if (pv.rowN < 24) later(MV.reduceMotion ? 0 : 90, tick); else later(MV.reduceMotion ? 0 : 500, function(){ pv = {}; render(); MV.changed(); endAnim(); }); })();
      return;
    }
    pv = { hide:true, stackN:0 }; render();
    (function tick(){ pv.stackN++; render(); if (pv.stackN < 4) later(MV.reduceMotion ? 0 : 750, tick); else later(MV.reduceMotion ? 0 : 700, function(){ pv = {}; render(); MV.changed(); endAnim(); }); })();
  }

  return {
    predict:{ start:startPred, run:runPred },
    challenge:function(id){ return chal(id); }
  };

  function chal(id){
    if (id === "tc2") {
      if (S.mode !== "grid") return { ok:false, msg:"Switch to Grid paths mode first." };
      var c = GP.count(S.R, S.U);
      if (c === 35) return { ok:true };
      if (S.R === 3 && S.U === 3) return { ok:false, msg:"(3, 3) gives 20 paths. One more move." };
      if (S.R + S.U === 7 && (S.R === 5 || S.U === 5)) return { ok:false, msg:"(" + S.R + ", " + S.U + ") gives 21 paths. Same 7 moves, but split differently." };
      return { ok:false, msg:M("R = " + S.R) + " and " + M("U = " + S.U) + " give " + big(c) + " shortest paths, not 35." };
    }
    if (S.mode !== "words") return { ok:false, msg:"Switch to Words mode first." };
    var w = word();
    if (id === "tc1") {
      if (!w) return { ok:false, msg:"Build a word first, or choose one from the list." };
      var n = D4.count(w), pat = D4.pattern(w);
      if (n === 180) return { ok:true };
      if (w.length === 6 && pat === "2,1,1,1,1") return { ok:false, msg:w + " gives 360. Only " + D4.tally(w).filter(function(x){ return x.n > 1; })[0].ch + " repeats: one more repeated pair halves the count." };
      if (w.length === 6 && pat === "3,2,1") return { ok:false, msg:w + " gives 60. Three of a kind divides by 6. Try two pairs." };
      return { ok:false, msg:w + " gives " + big(n) + " distinct arrangements, not 180." };
    }
    if (id === "tc3") {
      if (S.word !== "custom") return { ok:false, msg:"Choose <strong>Make your own</strong> and build a 6-letter word." };
      if (w.length !== 6) return { ok:false, msg:"Your word has " + plural(w.length, "letter") + ". Use exactly 6." };
      var t = D4.tally(w), c3 = D4.count(w), p3 = D4.pattern(w);
      if (t.length < 3) return { ok:false, msg:"Use at least three different letters." };
      if (c3 === 30) return { ok:true };
      if (p3 === "3,2,1") return { ok:false, msg:"60 arrangements. Closer! Piling more letters into one group shrinks the count more." };
      if (p3 === "2,2,2") return { ok:false, msg:"90 arrangements. Three pairs: 720 ÷ 8." };
      return { ok:false, msg:big(c3) + " arrangements. Can you make the product of the factorials larger?" };
    }
    return { ok:false };
  }
}

// ---------- hero: labelled BANANA line-ups stack (÷ 3!) and merge (÷ 2!) ----------
function hero(f){
  var svg = $("#pi-hsvg"), cnt = $("#pi-hcnt"), cap = f.cap;
  if (!svg) return;
  var PA = [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]], W = "BANANA";
  function letters(x0, y, step, aL, nL, cls){
    var h = "", ai = 0, ni = 0;
    for (var i = 0; i < 6; i++) {
      var ch = W[i], x = x0 + i * step, sub = ch === "A" ? aL[ai++] : ch === "N" ? nL[ni++] : 0;
      h += '<text class="' + cls + '" x="' + (x - (cls === "pi-hbl" ? 3 : 2)) + '" y="' + y + '">' + ch + "</text>";
      if (sub) h += '<text class="pi-hs ' + (cls === "pi-hbl" ? "big " : "") + (ch === "A" ? "hs-a" : "hs-n") + '" x="' + (x + (cls === "pi-hbl" ? 6 : 3.5)) + '" y="' + (y + (cls === "pi-hbl" ? 6 : 4)) + '">' + sub + "</text>";
    }
    return h;
  }
  var h = '<g class="pi-htop">';
  for (var i = 0; i < 6; i++) { var rep = W[i] !== "B"; h += '<rect class="pi-htile' + (rep ? " rep" : "") + '" x="' + (57 + i * 42) + '" y="4" width="36" height="36" rx="6"/>'; }
  h += letters(75, 30, 42, [1, 2, 3], [1, 2], "pi-hbl") + "</g>";
  var cards = [];
  for (var k = 0; k < 12; k++) {
    var gN = k < 6 ? 0 : 1, ix = k % 6, r = gN * 2 + Math.floor(ix / 3), c = ix % 3;
    cards.push({ x:10 + c * 118, y:58 + r * 32, g:gN, j:ix });
    h += '<g class="pi-hc" id="pi-hc' + k + '"><rect class="pi-hcr" width="104" height="26" rx="5"/>' + letters(14, 18, 15.4, PA[ix], gN ? [2, 1] : [1, 2], "pi-hcl") + "</g>";
  }
  h += '<text class="pi-hb" id="pi-hb0" x="88" y="174">÷ 3!</text><text class="pi-hb" id="pi-hb1" x="272" y="174">÷ 3!</text><text class="pi-hb" id="pi-hb2" x="186" y="174">÷ 3!  then  ÷ 2!</text>';
  svg.innerHTML = h;
  var els = cards.map(function(cd, k){ return $("#pi-hc" + k); });
  var pos = cards.map(function(cd){ return { x:cd.x, y:cd.y }; });
  function place(){ els.forEach(function(e, k){ e.setAttribute("transform", "translate(" + pos[k].x.toFixed(1) + " " + pos[k].y.toFixed(1) + ")"); }); }
  function stackPos(k, stage){ var cd = cards[k]; if (stage === 1) return { x:(cd.g ? 220 : 36) + cd.j * 1.6, y:114 - cd.j * 1.6 }; return { x:128 + k * 1.1, y:114 - k * 1.1 }; }
  function setCount(v, lab){ cnt.innerHTML = '<b class="pi-hn">' + v + '</b> <span class="pi-hl">' + lab + "</span>"; }
  function show(id, on){ var e = $("#" + id); if (e) e.classList.toggle("on", on); }
  function last(){
    for (var k = 0; k < 12; k++) pos[k] = stackPos(k, 2);
    place(); svg.classList.add("on", "cards", "noA", "noN"); show("pi-hb2", true);
    setCount("60", "distinct words: 720 ÷ (3! × 2!)");
    cap.textContent = "720 labelled line-ups ÷ 3! ÷ 2! = 60 distinct arrangements of BANANA";
  }
  if (MV.reduceMotion) { last(); return; }
  place(); setCount("720", "labelled line-ups (6!)");
  cap.textContent = "Label the twins: A₁, A₂, A₃ and N₁, N₂";
  MV.wait(200, function(){ svg.classList.add("on"); });
  function tweenTo(stage, dur, done){
    var from = pos.map(function(p){ return { x:p.x, y:p.y }; }), to = cards.map(function(cd, k){ return stackPos(k, stage); });
    MV.tween({ dur:dur, step:function(t){ for (var k = 0; k < 12; k++) pos[k] = { x:from[k].x + (to[k].x - from[k].x) * t, y:from[k].y + (to[k].y - from[k].y) * t }; place(); }, done:done });
  }
  function countTo(a, b, lab, dur){ MV.tween({ dur:dur, step:function(t){ setCount(String(Math.round(a + (b - a) * t)), lab); } }); }
  MV.wait(1500, function(){
    svg.classList.add("cards"); cap.textContent = "12 of the 720 labelled line-ups. Remove the labels and they all spell BANANA.";
    MV.wait(2600, function(){
      svg.classList.add("noA"); cap.textContent = "Line-ups that differ only in their A-labels merge: groups of 3! = 6, so ÷ 3!";
      tweenTo(1, 1100, function(){ show("pi-hb0", true); show("pi-hb1", true); });
      countTo(720, 120, "line-ups once the A’s look alike", 1100);
      MV.wait(3000, function(){
        svg.classList.add("noN"); show("pi-hb0", false); show("pi-hb1", false);
        cap.textContent = "Pairs that differ only in their N-labels merge: ÷ 2!";
        tweenTo(2, 1000, function(){ show("pi-hb2", true); });
        countTo(120, 60, "distinct words: 720 ÷ (3! × 2!)", 1000);
        MV.wait(1900, function(){ cap.textContent = "720 labelled line-ups ÷ 3! ÷ 2! = 60 distinct arrangements of BANANA"; });
      });
    });
  });
}

// ---------- Part 3: Paths on a grid (four stations on a 4 × 3 city grid) ----------
var CITY = { R:4, U:3 }, SHOP = [2, 1];
function part3(host, api){
  var S = api.S, ST = (api.content || {}).stations || [];
  if (!ST.length) return {};
  S.st = S.st && typeof S.st === "object" ? S.st : {};
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = ST[0].id;
  var msg = {}, anim = null, pv = {};
  function sst(id){
    var x = S.st[id] || (S.st[id] = {});
    x.routes = Array.isArray(x.routes) ? x.routes.filter(function(w){ return typeof w === "string" && w.length === 7; }) : [];
    if (typeof x.path !== "string" || !/^[RU]{0,7}$/.test(x.path)) x.path = "";
    x.fill = x.fill && typeof x.fill === "object" ? x.fill : {};
    return x;
  }
  function done(s){
    var x = sst(s.id);
    if (s.id === "s1") return x.routes.length >= 3;
    if (s.id === "s2") return !!x.to && !!x.on && x.routes.some(function(w){ return GP.through(w, SHOP[0], SHOP[1]); });
    if (s.id === "s3") return !!x.all && x.routes.length >= 1;
    return Object.keys(x.fill).length >= (CITY.R + 1) * (CITY.U + 1);
  }
  host.innerHTML = '<div id="pq-tabs" class="pq-tabs"></div><div id="pq-body" class="pq-body"></div>';
  var tabOpts = ST.map(function(s){ return { id:s.id, t:"" }; });
  function tabText(){ ST.forEach(function(s, i){ tabOpts[i].t = "S" + (i + 1) + ": " + s.name + (done(s) ? ' <span class="pq-tick" aria-label="done">✓</span>' : ""); }); }
  tabText();
  var tabs = radios($("#pq-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ stop(); S.cur = v; pv = {}; api.save(); paint(); } });
  function cur(){ return ST.filter(function(s){ return s.id === S.cur; })[0]; }

  function stop(){ if (anim) { anim.timers.forEach(clearTimeout); anim = null; } }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }

  // values for station 4: routes from Start to each corner (road work makes (2, 1) a 0)
  function val(x, y, road){
    var memo = {};
    function v(a, b){ var k = a + "," + b; if (memo[k] != null) return memo[k]; var r; if (road && a === SHOP[0] && b === SHOP[1]) r = 0; else if (!a && !b) r = 1; else r = (a ? v(a - 1, b) : 0) + (b ? v(a, b - 1) : 0); return (memo[k] = r); }
    return v(x, y);
  }
  function canFill(x, y, fill){ return (!x || fill[(x - 1) + "," + y]) && (!y || fill[x + "," + (y - 1)]); }

  function paint(){
    tabText(); tabs.refresh();
    var s = cur(), x = sst(s.id), body = $("#pq-body", host), i = ST.indexOf(s), dOld = $("details.alg", body), algOpen = dOld ? dOld.open : done(s);
    var h = '<div class="pq-card"><span class="pq-lab">Station ' + (i + 1) + '</span><span class="pq-name">' + s.name + '</span></div><p class="pq-task">' + s.task + "</p>";
    var g = { R:CITY.R, U:CITY.U, path:x.path, mode:"path", restart:true, startLab:"Start", endLab:"End" };
    if (s.id === "s2") { g.cp = SHOP; g.cpLab = "Coffee shop"; }
    if (s.id === "s3") { g.block = SHOP; g.blockLab = "Road work"; }
    if (s.id === "s4") {
      g.mode = "all"; g.path = ""; g.focus = x.focus || "0,0"; g.nums = {}; g.fresh = pv.fresh || {};
      Object.keys(x.fill).forEach(function(k){ var p = k.split(","); g.nums[k] = val(+p[0], +p[1], !!x.road); });
      if (x.road) { g.block = SHOP; g.blockLab = "Road work"; }
    }
    if (pv.legs) g.legs = pv.legs;
    if (pv.ghosts) g.ghosts = pv.ghosts;
    if (pv.hot) g.hot = pv.hot;
    if (anim) g.mode = s.id === "s4" ? "all" : "none";
    g.aria = "City grid, 4 blocks east and 3 blocks north" + (g.cp ? ", with a coffee shop at (2, 1)" : "") + (g.block ? ", with road work blocking (2, 1)" : "") + "." + (x.path && s.id !== "s4" ? " Current route " + x.path.split("").join(" ") + "." : "");
    h += '<div class="pq-two"><div class="pq-gcol"><div class="pq-grid" data-pq="grid">' + GP.html(g) + "</div>";
    if (s.id !== "s4") {
      var e = GP.end(x.path.length >= 7 ? "" : x.path), busy = !!anim;
      h += '<div class="pi-gword"><span class="pi-plab">Route word</span>' + pathWordHTML(x.path, 7) + "</div>";
      h += '<div class="q-actions pq-moves"><button type="button" class="btn sm" data-pm="R" data-k="pqR"' + (busy || e[0] >= CITY.R ? " disabled" : "") + ' aria-label="Move one block east (R)">R →</button><button type="button" class="btn sm" data-pm="U" data-k="pqU"' + (busy || e[1] >= CITY.U ? " disabled" : "") + ' aria-label="Move one block north (U)">U ↑</button>' +
        '<button type="button" class="btn ghost sm" data-pa="undo" data-k="pqundo"' + (busy || !x.path ? " disabled" : "") + '>Undo</button><button type="button" class="btn ghost sm" data-pa="clear" data-k="pqclear"' + (busy || !x.path ? " disabled" : "") + ">Clear</button></div>";
    } else {
      h += '<div class="q-actions"><button type="button" class="btn primary sm" data-pa="fillall" data-k="pqfill"' + (anim ? " disabled" : "") + '>Fill every corner</button><button type="button" class="btn ghost sm" data-pa="clearfill" data-k="pqcf"' + (anim || !Object.keys(x.fill).length ? " disabled" : "") + '>Clear the numbers</button>' +
        '<button type="button" class="chip" data-pa="road" data-k="pqroad" aria-pressed="' + !!x.road + '">Road work at (2, 1)</button></div>' +
        '<p class="tiny muted">Tap a corner, or use the arrow keys to move between corners and press Enter.</p>';
    }
    h += '</div><div class="pq-icol">' + side(s, x);
    if (msg[s.id]) h += MV.fbHTML(msg[s.id].kind, msg[s.id].html);
    h += '<details class="alg"' + (algOpen ? " open" : "") + "><summary>" + (s.id === "s4" ? "Zoom to the counting" : "Check it with algebra") + '</summary><div class="alg-lines">' + s.alg.map(function(l){ return "<span>" + l + "</span>"; }).join("") + "</div></details>";
    if (done(s)) h += '<p class="pq-done"><strong>✓ Station ' + (i + 1) + " complete.</strong> " + (ST.every(done) ? "All four stations done. Try the quick check below." : "Choose another station above.") + "</p>";
    h += "</div></div>";
    MV.keepFocus(body, function(){ body.innerHTML = h; });
  }
  function side(s, x){
    var h = "";
    if (s.id !== "s4") {
      h += '<h4 class="pq-h">Your routes</h4>';
      h += x.routes.length ? '<ol class="pq-routes">' + x.routes.map(function(w){ var t = s.id === "s2" ? (GP.through(w, SHOP[0], SHOP[1]) ? ' <span class="pq-ok">✓ stops for coffee</span>' : ' <span class="muted">misses the shop</span>') : ""; return '<li><span class="pq-rw">' + w + "</span>" + t + "</li>"; }).join("") + "</ol>"
        : '<p class="muted tiny">No routes yet. A route is finished after 7 moves.</p>';
    }
    if (s.id === "s1") h += '<p class="tiny">' + (x.routes.length >= 3 ? "Three different routes, three different words, each with 4 R’s and 3 U’s." : "Routes traced: " + x.routes.length + " of 3.") + "</p>";
    if (s.id === "s2") {
      h += '<h4 class="pq-h">Two legs</h4><div class="q-actions"><button type="button" class="btn sm" data-pa="leg1" data-k="pqleg1"' + (anim ? " disabled" : "") + '>Routes to the shop</button><button type="button" class="btn sm" data-pa="leg2" data-k="pqleg2"' + (anim ? " disabled" : "") + ">Routes onward</button></div>";
      h += '<dl class="read pq-read">' + MV.readoutHTML([
        ["To the shop", x.to ? M("{3!}/{2! 1!}") + " = <strong>3</strong>" : '<span class="muted">press “Routes to the shop”</span>'],
        ["Onward to the end", x.on ? M("{4!}/{2! 2!}") + " = <strong>6</strong>" : '<span class="muted">press “Routes onward”</span>'],
        ["Through the shop", x.to && x.on ? "3 × 6 = <strong>18</strong>" : "?"]]) + "</dl>";
    }
    if (s.id === "s3") {
      h += '<div class="q-actions"><button type="button" class="chip" data-pa="all" data-k="pqall" aria-pressed="' + !!x.all + '">Show every route</button></div>';
      if (x.all) {
        var list = GP.all(CITY.R, CITY.U), ok = list.filter(function(w){ return !GP.through(w, SHOP[0], SHOP[1]); }).length;
        h += '<p class="tiny"><strong>' + ok + "</strong> routes survive (blue); <strong>" + (list.length - ok) + "</strong> pass the road work and fade.</p>" +
          '<div class="pq-minis' + (pv.fade ? "" : " gone") + '" role="img" aria-label="' + MV.esc("All 35 routes as small grids: 17 avoid (2, 1) and stay blue; 18 pass through it and fade.") + '">' + list.map(function(w){ var bad = GP.through(w, SHOP[0], SHOP[1]); return '<span class="pq-mi' + (bad ? " bad" : "") + '">' + GP.mini(CITY.R, CITY.U, w, { block:SHOP }) + "</span>"; }).join("") + "</div>";
      }
    }
    if (s.id === "s4") {
      var n = Object.keys(x.fill).length, tot = (CITY.R + 1) * (CITY.U + 1);
      h += '<p class="tiny">Corners labelled: <strong>' + n + "</strong> of " + tot + ".</p>";
      if (x.fill[CITY.R + "," + CITY.U]) h += '<p>End: <strong>' + val(CITY.R, CITY.U, !!x.road) + "</strong> routes" + (x.road ? " avoid the road work (35 − 18)." : ", the same as " + M("{7!}/{4! 3!}") + ".") + "</p>";
    }
    return h;
  }
  function setMsg(id, kind, html){ msg[id] = { kind:kind, html:html }; }

  // --- tracing ---
  function move(m){
    var s = cur(), x = sst(s.id);
    if (anim || s.id === "s4") return;
    if (x.path.length >= 7) x.path = "";
    var r = GP.step(x.path, m, { R:CITY.R, U:CITY.U, block:s.id === "s3" ? SHOP : null });
    pv = {};
    if (r.err) { setMsg(s.id, "bad", r.err); api.save(); paint(); return; }
    x.path = r.word; msg[s.id] = null;
    if (x.path.length === 7) finish(s, x);
    api.save(); paint();
  }
  function finish(s, x){
    var w = x.path, dup = x.routes.indexOf(w) >= 0;
    if (dup) { setMsg(s.id, "bad", "You already traced <strong>" + w + "</strong>. Try a different route."); return; }
    x.routes.push(w);
    if (s.id === "s1") setMsg(s.id, "good", "<strong>✓ Route " + x.routes.length + ": " + w + ".</strong> " + (x.routes.length >= 3 ? "Every route is an arrangement of RRRRUUU: " + M("{7!}/{4! 3!}") + " = 35. Open the algebra below." : "Now trace a different one."));
    else if (s.id === "s2") setMsg(s.id, GP.through(w, SHOP[0], SHOP[1]) ? "good" : "bad", GP.through(w, SHOP[0], SHOP[1]) ? "<strong>✓ " + w + " stops for coffee.</strong> Its first 3 moves reach the shop and its last 4 finish the trip." : "<strong>" + w + " misses the coffee shop.</strong> Trace a route through (2, 1).");
    else setMsg(s.id, "good", "<strong>✓ " + w + " avoids the road work.</strong> " + (sst(s.id).all ? "" : "Now show every route."));
    MV.changed();
  }
  function legAnim(which){
    var s = cur(), x = sst(s.id);
    stop(); anim = { timers:[] };
    var list = which === 1 ? GP.all(2, 1) : GP.all(2, 2), x0 = which === 1 ? 0 : SHOP[0], y0 = which === 1 ? 0 : SHOP[1];
    var legs = which === 1 ? [[0, 0, SHOP[0], SHOP[1]]] : [[SHOP[0], SHOP[1], CITY.R, CITY.U]], k = 0;
    msg[s.id] = null;
    (function tick(){
      pv = { legs:legs, ghosts:list.slice(0, k).map(function(w){ return { w:w, x0:x0, y0:y0 }; }), hot:{ w:list[k], x0:x0, y0:y0 } };
      setMsg(s.id, "", (which === 1 ? "To the shop" : "Onward") + ": route " + (k + 1) + " of " + list.length + ", <strong>" + list[k] + "</strong>");
      paint(); k++;
      if (k < list.length) later(MV.reduceMotion ? 0 : 700, tick);
      else later(MV.reduceMotion ? 0 : 600, function(){
        anim = null; if (which === 1) x.to = true; else x.on = true;
        pv = { legs:legs, ghosts:list.map(function(w){ return { w:w, x0:x0, y0:y0 }; }) };
        setMsg(s.id, "good", which === 1 ? "<strong>3 routes to the shop:</strong> RRU, RUR, URR, the arrangements of RRU." : "<strong>6 routes onward:</strong> the arrangements of RRUU." + (x.to ? " Each of the 3 routes to the shop can continue in 6 ways: 3 × 6 = 18." : ""));
        api.save(); paint(); MV.changed();
      });
    })();
  }
  function fillAll(){
    var s = cur(), x = sst(s.id), d = 0;
    stop(); anim = { timers:[] }; msg[s.id] = null;
    (function tick(){
      var fresh = {};
      for (var a = 0; a <= CITY.R; a++) { var b = d - a; if (b >= 0 && b <= CITY.U) { x.fill[a + "," + b] = 1; fresh[a + "," + b] = 1; } }
      pv = { fresh:fresh }; paint(); d++;
      if (d <= CITY.R + CITY.U) later(MV.reduceMotion ? 0 : 450, tick);
      else { anim = null; pv = {}; setMsg(s.id, "good", "<strong>Every corner labelled.</strong> The end shows " + val(CITY.R, CITY.U, !!x.road) + ". Read a diagonal: 1, 3, 3, 1 is a row of Pascal’s triangle."); api.save(); paint(); MV.changed(); }
    })();
  }
  function tapFill(gx, gy){
    var s = cur(), x = sst(s.id), k = gx + "," + gy;
    x.focus = k;
    if (x.fill[k]) { setMsg(s.id, "", "(" + gx + ", " + gy + ") is already labelled: " + val(gx, gy, !!x.road) + "."); paint(); return; }
    if (!canFill(gx, gy, x.fill)) { setMsg(s.id, "bad", "Label the corner to the left of (" + gx + ", " + gy + ") and the corner below it first."); paint(); return; }
    x.fill[k] = 1; pv = { fresh:{} }; pv.fresh[k] = 1;
    var v = val(gx, gy, !!x.road), road = x.road && gx === SHOP[0] && gy === SHOP[1];
    var why = road ? "Road work: no route can pass here, so 0." : !gx && !gy ? "Start: 1 way to be here (stay put)." : !gx || !gy ? "On the edge: 1 straight route." : v + " = " + val(gx - 1, gy, !!x.road) + " (left) + " + val(gx, gy - 1, !!x.road) + " (below).";
    setMsg(s.id, "good", "(" + gx + ", " + gy + "): " + why);
    api.save(); paint(); pv = {}; MV.changed();
  }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !$("#pq-body", host).contains(b)) return;
    var s = cur(), x = sst(s.id);
    if (b.dataset.pm) { move(b.dataset.pm); return; }
    if (b.dataset.gx != null) {
      var gx = +b.dataset.gx, gy = +b.dataset.gy;
      if (s.id === "s4") { if (!anim) tapFill(gx, gy); return; }
      if (anim) return;
      var en = GP.end(x.path.length >= 7 ? "" : x.path);
      if (gx === en[0] + 1 && gy === en[1]) move("R");
      else if (gx === en[0] && gy === en[1] + 1) move("U");
      else if (!(gx === en[0] && gy === en[1])) { setMsg(s.id, "bad", "Tap the corner one block east of, or one block north of, the end of your route."); paint(); }
      return;
    }
    var a = b.dataset.pa; if (!a) return;
    if (a === "undo") { pv = {}; x.path = x.path.slice(0, -1); msg[s.id] = null; }
    else if (a === "clear") { pv = {}; x.path = ""; msg[s.id] = null; }
    else if (a === "leg1" || a === "leg2") { legAnim(a === "leg1" ? 1 : 2); return; }
    else if (a === "all") {
      x.all = !x.all; pv = {};
      if (x.all) { pv.fade = true; api.save(); paint(); MV.wait(700, function(){ var m = $(".pq-minis", host); if (m) m.classList.add("gone"); pv.fade = false; }); MV.changed(); return; }
    }
    else if (a === "fillall") { fillAll(); return; }
    else if (a === "clearfill") { x.fill = {}; pv = {}; msg[s.id] = null; }
    else if (a === "road") { x.road = !x.road; pv = {}; setMsg(s.id, "", x.road ? "Road work at (2, 1): that corner now counts 0 routes, and every corner after it changes." : "Road work cleared."); }
    api.save(); paint(); MV.changed();
  });
  host.addEventListener("keydown", function(e){
    var s = cur(); if (s.id === "s4" || anim) return;
    if (!e.target.closest || !e.target.closest('[data-pq="grid"], .pq-moves')) return;
    if (e.key === "ArrowRight") { e.preventDefault(); move("R"); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move("U"); }
    else if (e.key === "Backspace") { e.preventDefault(); var x = sst(s.id); x.path = x.path.slice(0, -1); msg[s.id] = null; pv = {}; api.save(); paint(); }
    else return;
    if (!$("#pq-body", host).contains(document.activeElement)) { var f = host.querySelector(".gp-pt.nx") || host.querySelector(".pq-moves button:not(:disabled)"); if (f) f.focus(); }
  });
  GP.rove($("#pq-body", host));
  paint();
  return {};
}

// ---------- Performance task: Design a word (7 slots, tiles A–G) ----------
var EXAMPLE = { "4,2,1":"AAAABBC", "3,3,1":"AAABBBC", "3,2,2":"AAABBCC" };
var task = (function(){
  var api = null, sel = null, tmsg = "";
  var TILES = "ABCDEFG".split("");
  function slots(){ var s = api ? api.S : {}; if (!Array.isArray(s.slots) || s.slots.length !== 7) s.slots = ["", "", "", "", "", "", ""]; s.slots = s.slots.map(function(c){ return TILES.indexOf(c) >= 0 ? c : ""; }); return s.slots; }
  function read(){ var sl = slots(); return { slots:sl.slice(), word:sl.join("") }; }
  function paint(){
    var sl = slots(), d = read(), w = d.word, inp = $("#dw-in");
    MV.keepFocus(inp, function(){
      inp.innerHTML = '<p class="pi-plab">Letter tiles: tap one, then tap a slot</p><div class="pi-keys" role="group" aria-label="Letter tiles A to G">' +
        TILES.map(function(ch){ return '<button type="button" class="pi-key" data-dt="' + ch + '" data-k="dwt' + ch + '" aria-pressed="' + (sel === ch) + '">' + ch + "</button>"; }).join("") + "</div>" +
        '<p class="pi-plab">Your word (7 slots)</p><div class="dw-slots" role="group" aria-label="Seven slots">' +
        sl.map(function(c, i){ return '<button type="button" class="dw-slot' + (c ? " full" : "") + '" data-ds="' + i + '" data-k="dws' + i + '" aria-label="' + MV.esc("Slot " + (i + 1) + ": " + (c ? c + (sel ? ". Tap to put " + sel + " here instead." : ". Tap to empty it.") : "empty" + (sel ? ". Tap to put " + sel + " here." : ". Choose a tile first."))) + '">' + (c || '<span class="dw-n" aria-hidden="true">' + (i + 1) + "</span>") + "</button>"; }).join("") + "</div>" +
        '<div class="q-actions"><button type="button" class="btn ghost sm" data-da="clear" data-k="dwclear"' + (w ? "" : " disabled") + '>Clear the slots</button></div>' +
        '<p class="tiny muted dw-msg" aria-live="polite">' + (tmsg || (sel ? sel + " selected: tap slots to place it. Tap " + sel + " again to put it down." : "Tip: with a slot focused, you can also type a letter A–G, or press Delete to empty it.")) + "</p>";
    });
    var f = w ? formula(w) : null, t = D4.tally(w);
    $("#dw-pv").innerHTML = '<div class="dw-pv"><p class="pi-plab">Live readout</p>' + (w ? D4.row(w, null, { cls:"pi-big" }) : '<p class="muted">Your word appears here.</p>') +
      '<dl class="read">' + MV.readoutHTML([
        ["Letters", w.length + " of 7"],
        ["Letter counts", w ? t.map(function(x){ return x.ch + " × " + x.n; }).join(", ") + ' <span class="muted">(' + plural(t.length, "different letter") + ")</span>" : '<span class="muted">none yet</span>'],
        ["Formula", w ? M("{" + w.length + "!}/{" + t.map(function(x){ return x.n + "!"; }).join(" × ") + "}") + " = " + big(f.all) + " ÷ " + big(f.d) : "—"],
        ["Distinct arrangements", w ? "<strong>" + big(f.count) + "</strong>" : "—"]]) + "</dl></div>";
  }
  function put(i, ch){ var sl = slots(); sl[i] = ch; tmsg = ""; api.save(); paint(); api.update(); }
  function keyText(k){ var p = k.split(","), c = 5040 / p.reduce(function(a, n){ return a * fact(+n); }, 1); return "{" + p.join(", ") + "}: " + c + " arrangements, e.g. " + (EXAMPLE[k] || ""); }
  return {
    render:function(inp, pv, a){
      api = a; slots();
      inp.innerHTML = '<div id="dw-in" class="dw-in"></div>'; pv.innerHTML = '<div id="dw-pv"></div>';
      var box = $("#dw-in");
      box.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || b.disabled) return;
        if (b.dataset.dt) { sel = sel === b.dataset.dt ? null : b.dataset.dt; tmsg = ""; paint(); return; }
        if (b.dataset.ds != null) {
          var i = +b.dataset.ds, sl = slots();
          if (sel) put(i, sel);
          else if (sl[i]) put(i, "");
          else { tmsg = "Tap a letter tile first, then tap a slot."; paint(); }
          return;
        }
        if (b.dataset.da === "clear") { api.S.slots = ["", "", "", "", "", "", ""]; tmsg = ""; api.save(); paint(); api.update(); }
      });
      box.addEventListener("keydown", function(e){
        var b = e.target.closest("[data-ds]"); if (!b) return;
        var i = +b.dataset.ds, L = (e.key || "").toUpperCase();
        if (TILES.indexOf(L) >= 0 && L.length === 1) { e.preventDefault(); put(i, L); var nb = $('[data-ds="' + Math.min(6, i + 1) + '"]'); if (nb) nb.focus(); }
        else if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); put(i, ""); }
      });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var w = d.word, n = w.length, c = n ? D4.count(w) : 0; return [n === 7, D4.tally(w).length === 3, n > 0 && c >= 100 && c <= 250]; },
    key:function(d){ return D4.pattern(d.word); },
    label:function(k){ return keyText(k); },
    text:function(k){ return keyText(k); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
