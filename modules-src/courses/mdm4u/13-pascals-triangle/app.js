// MDM4U 13 Pascal's Triangle & Patterns: hero (rows 0–6 grow by adding the two entries above; C(6, 2) lights up), Triangle
// explorer (Explore: D5 Pascal's triangle explorer with Build / Explore / Pattern modes), Paths and Pascal (Part 3: label a
// street grid, relabel it with a closed corner, a Galton board), Hockey stick hunt task.
(function(){
"use strict";
var $ = MV.$;
function M(s){ return MV.m(s); }
var MEMO = {};
function C(n, r){ if (n < 0 || r < 0 || r > n) return 0; var k = n + "," + r; if (MEMO[k] == null) MEMO[k] = Number(MV.mdm.nCr(n, r)); return MEMO[k]; }
function big(v){ return MV.mdm.fmt(v); }
function cTxt(n, r){ return M("C(" + n + ", " + r + ")"); }
function clampInt(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }
function obj(o){ return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }
var repaint = {};

// @component radioGroup (copied from MDM4U 08 / 05; setOptions(list) for option sets that change with other controls)
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

// @component D5 pascalExplorer — Pascal's triangle (course plan D5), self-contained: rows 0–15 as HTML cells (buttons when
// interactive, spans when static) centred row by row, so each row sits half a cell over from the one above. Row numbers in
// a left gutter, optional row sums in a right gutter, an optional dashed line of symmetry, and an optional row being built
// (end 1s fill automatically, inner boxes are number inputs). The cell width and font follow the box width (font ≥ 12 px,
// cells ≥ 28 px); wide triangles scroll sideways inside their box (.pt-box).
//   PT.html({rows, width, interactive, focus:"n,r", cls(n, r) -> "pt-sel pt-ab …", aria(n, r) -> ", extra words",
//            val(n, r) -> html | null, sums:true, sumTxt(n), sym:true, rowOn:n, newRow:n, label,
//            build:{row, vals:{r:"typed"}, marks:{r:"ok"|"bad"}}}) -> html
//   Cell classes (app.css): pt-sel (ringed --pen), pt-ab (teal: the two entries above), pt-mir, pt-rw / pt-dg / pt-fi /
//   pt-hs (--hi-soft shading), pt-bl (blade, --ink outline), pt-od / pt-ev (remainder colouring), pt-dim, pt-glow, pt-cur.
//   Interactive cells carry data-n, data-r and data-k="ptc{n}_{r}"; the explorer adds arrow-key moves (roving tabindex).
var PT = (function(){
  // narrow boxes (phones) get slim gutters and 1 px cell margins so rows 0–10 fit at 390 px; wider rows scroll sideways
  function size(avail, last, sums){
    var nar = avail < 520, gl = nar ? 19 : 34, gr = sums ? (nar ? 44 : 64) : (nar ? 2 : 34), d = String(C(last, last >> 1)).length;
    var minW = nar ? (d >= 4 ? 36 : Math.max(25, Math.ceil(d * 6.6 + 5))) : Math.max(28, d * 8 + 10);
    var cw = Math.max(minW, Math.min(54, Math.floor((avail - gl - gr) / (last + 1))));
    var fs = Math.max(12, Math.min(18, Math.floor((cw - (nar ? 6 : 8)) / (0.6 * Math.max(d, 2)))));
    return { cw:cw, rh:Math.max(28, Math.round(cw * 0.78)), fs:fs, gl:gl, gr:gr, cm:nar && cw < 34 ? 1 : 2 };
  }
  function bcell(b, n, r){
    if (r === 0 || r === n) return '<span class="pt-c pt-auto" title="The end 1s fill automatically">1</span>';
    var v = b.vals[r] == null ? "" : b.vals[r], mk = b.marks ? b.marks[r] : null;
    return '<span class="pt-c pt-iw' + (mk ? " pt-" + mk : "") + '"><input class="pt-inp" type="text" inputmode="numeric" autocomplete="off" maxlength="5" data-br="' + r + '" data-k="ptb' + r + '" value="' + MV.esc(v) + '" aria-label="' +
      MV.esc("Row " + n + ", position " + r + ": type the sum of the two entries above" + (mk === "ok" ? " (correct)" : mk === "bad" ? " (not right yet)" : "")) + '"></span>';
  }
  function html(o){
    var N = o.rows, B = o.build ? o.build.row : -1, last = Math.max(N, B);
    var z = size(o.width || 600, last, !!o.sums), gl = z.gl, gr = z.gr, h = '<div class="pt-hd" aria-hidden="true"><span>row</span>' + (o.sums ? "<span>row sum</span>" : "") + "</div>";
    for (var n = 0; n <= last; n++) {
      var cells = "";
      for (var r = 0; r <= n; r++) {
        if (n === B) { cells += bcell(o.build, n, r); continue; }
        var c = o.cls ? o.cls(n, r) : "", vv = o.val ? o.val(n, r) : null, v = vv == null ? big(C(n, r)) : vv;
        if (o.interactive) {
          var k = n + "," + r;
          cells += '<button type="button" class="pt-c' + (c ? " " + c : "") + '" data-n="' + n + '" data-r="' + r + '" data-k="ptc' + n + "_" + r + '" tabindex="' + (k === o.focus ? 0 : -1) + '" aria-label="' +
            MV.esc("Row " + n + ", position " + r + ": " + C(n, r) + (o.aria ? o.aria(n, r) : "")) + '">' + v + "</button>";
        } else cells += '<span class="pt-c' + (c ? " " + c : "") + '">' + v + "</span>";
      }
      var rs = o.sums ? '<span class="pt-rs">' + (o.sumTxt ? o.sumTxt(n) : big(Math.pow(2, n))) + "</span>" : "";
      h += '<div class="pt-row' + (n === o.newRow ? " pt-new" : "") + (n === o.rowOn ? " on" : "") + (n === B ? " pt-brow" : "") + '"><span class="pt-rl" aria-hidden="true">' + n + "</span>" + cells + rs + "</div>";
    }
    var w = gl + gr + (last + 1) * z.cw;
    return '<div class="pt-in' + (o.sym ? " pt-symon" : "") + '" style="--cw:' + z.cw + "px;--rh:" + z.rh + "px;--fs:" + z.fs + "px;--gl:" + gl + "px;--gr:" + gr + "px;--cm:" + z.cm + "px;min-width:" + w + 'px" ' +
      (o.interactive ? 'role="group"' : 'role="img"') + ' aria-label="' + MV.esc(o.label || "Pascal’s triangle") + '">' + h + "</div>";
  }
  return { html:html, size:size };
})();
// hockey sticks: {n, r, dir:"L" (down-left: same position r) | "R" (down-right: same n − r), len}
function stickCells(hs){ var out = []; for (var i = 0; i < hs.len; i++) out.push(hs.dir === "L" ? [hs.n + i, hs.r] : [hs.n + i, hs.r + i]); return out; }
function stickEdge(hs){ return hs.dir === "L" ? hs.n === hs.r : hs.r === 0; }
function stickBlade(hs){ var e = stickCells(hs).pop(); return hs.dir === "L" ? [e[0] + 1, e[1] + 1] : [e[0] + 1, e[1]]; }
function stickVals(hs){ return stickCells(hs).map(function(c){ return C(c[0], c[1]); }); }
function stickSum(hs){ return stickVals(hs).reduce(function(a, b){ return a + b; }, 0); }
function fibCells(d, rows){ var out = []; for (var j = 0; j <= d - j; j++) if (d - j <= rows) out.push([d - j, j]); return out; }
function plusTxt(list){ return list.map(big).join(" + "); }

// ---------- Explore: Triangle explorer ----------
var MODES = [{ id:"build", t:"Build" }, { id:"explore", t:"Explore" }, { id:"pattern", t:"Pattern" }];
var PATS = [{ id:"sym", t:"Symmetry" }, { id:"sums", t:"Row sums" }, { id:"diag", t:"Diagonals" }, { id:"hockey", t:"Hockey stick" }, { id:"fib", t:"Fibonacci diagonals" }, { id:"mod", t:"Colour by remainder" }];
var DIAGS = ["1s", "counting numbers", "triangular numbers", "tetrahedral numbers"];
function diagName(r){ return DIAGS[r] || "position-" + r + " diagonal"; }
function explore(host, api){
  var S = api.S;
  if (!MODES.some(function(m){ return m.id === S.mode; })) S.mode = "explore";
  if (!PATS.some(function(p){ return p.id === S.pat; })) S.pat = "sums";
  S.rows = clampInt(S.rows, 0, 15, 7);
  if ([2, 3, 5].indexOf(S.mod) < 0) S.mod = 2;
  S.diag = clampInt(S.diag, 0, 15, 2);
  S.hsDir = S.hsDir === "R" ? "R" : "L";
  S.bv = obj(S.bv); S.made = obj(S.made);
  function cellOk(c){ return c && typeof c === "object" && Number.isInteger(c.n) && Number.isInteger(c.r) && c.n >= 0 && c.n <= 15 && c.r >= 0 && c.r <= c.n; }
  if (!("sel" in S)) S.sel = { n:7, r:3 };
  if (!cellOk(S.sel)) S.sel = null;
  if (S.hs && !(cellOk(S.hs) && (S.hs.dir === "L" || S.hs.dir === "R") && Number.isInteger(S.hs.len) && S.hs.len >= 1)) S.hs = null;
  S.fib = S.fib == null ? null : clampInt(S.fib, 0, 30, null);
  var pv = {}, anim = null, pick = null, msg = "", marks = {}, boxW = 0;
  clampState();

  host.innerHTML =
    '<div class="pt-top"><div id="pt-mode"></div><div id="pt-pat"></div><div id="pt-sub"></div></div>' +
    '<div class="pt-pg"><div class="pt-gr" data-mv="graph"><div class="eq-cap pt-cap" id="pt-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="pt-box" id="pt-box"></div><div id="pt-leg" class="pt-leg"></div><p class="pt-msg" id="pt-msg" aria-live="polite"></p></div>' +
    '<div class="pt-ctl"><div id="pt-rows"></div><div id="pt-bctl"></div><p class="tiny muted pt-how" id="pt-how"></p></div>' +
    '<div class="pt-rd"><dl class="read" id="pt-read" aria-live="polite"></dl></div></div>';

  var modeR = radios($("#pt-mode", host), { label:"Mode", options:MODES, value:S.mode, cls:"seg",
    onChange:function(v){ user(); S.mode = v; pick = null; marks = {}; msg = ""; save(); render(); MV.changed(); } });
  var patR = radios($("#pt-pat", host), { label:"Pattern", options:PATS, value:S.pat, cls:"chips",
    onChange:function(v){ user(); S.pat = v; msg = ""; save(); render(); MV.changed(); } });
  var rowsSl = MV.sliders($("#pt-rows", host), [{ id:"ptrows", label:"Rows shown", min:0, max:15, step:1, value:S.rows, fmt:function(v){ return v ? "0–" + v : "0"; } }],
    function(id, v){ user(); S.rows = v; marks = {}; msg = ""; clampState(); save(); render(); MV.changed(); });

  function save(){ api.save(); }
  function user(){ cancelAnim(); pv = {}; MV.banner("", ""); }
  function clampState(){
    if (S.sel && S.sel.n > S.rows) S.sel = null;
    if (S.hs) { if (S.hs.n > S.rows) S.hs = null; else S.hs.len = Math.max(1, Math.min(S.hs.len, S.rows - S.hs.n + 1)); }
    if (pick && pick.n !== S.rows) pick = null;
  }
  function bvals(){ var row = S.rows + 1; return S.bv[row] = obj(S.bv[row]); }
  function rowVals(row){
    var v = obj(S.bv[row]), out = [];
    for (var r = 0; r <= row; r++) { if (r === 0 || r === row) { out.push(1); continue; } var s = String(v[r] == null ? "" : v[r]).trim(); out.push(/^\d+$/.test(s) ? +s : null); }
    return out;
  }
  function rowRight(row){ return rowVals(row).every(function(x, r){ return x === C(row, r); }); }
  function building(){ return S.mode === "build" && S.rows < 15; }

  // --- animation bookkeeping (predictions); any user action cancels and finishes it ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], fin:fin || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(MV.reduceMotion ? 0 : ms, function(){ if (anim === a) fn(); })); }
  function endAnim(){ var a = anim; anim = null; render(); if (a && a.fin) { var f = a.fin; a.fin = null; f(); } }
  function cancelAnim(){
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout);
    if (a.fin) { var f = a.fin; a.fin = null; f(); }
    pv = {}; render(); MV.changed();
  }

  // --- cell classes and labels ---
  function cls(n, r){
    var c = [], sel = S.sel && S.sel.n === n && S.sel.r === r;
    if (S.mode === "explore") {
      if (sel) c.push("pt-sel");
      if (S.sel && n === S.sel.n - 1 && (r === S.sel.r - 1 || r === S.sel.r)) c.push("pt-ab");
    } else if (S.mode === "build") {
      if (pick && pick.n === n && pick.r === r) c.push("pt-ab");
    } else {
      var p = S.pat;
      if (p === "sym") { if (S.sel && S.sel.n === n && (r === S.sel.r || r === n - S.sel.r)) c.push(r === S.sel.r ? "pt-sel" : "pt-mir"); }
      else if (p === "sums") { if (S.sel && S.sel.n === n) c.push("pt-rw"); }
      else if (p === "diag") {
        if (pv.glow && pv.glow.n === n && pv.glow.r === r) c.push("pt-glow");
        else if (r === S.diag && n !== pv.pend) c.push("pt-dg");
      }
      else if (p === "hockey" && S.hs) {
        var cs = stickCells(S.hs), b = stickBlade(S.hs);
        cs.forEach(function(q, i){ if (q[0] === n && q[1] === r) { c.push("pt-hs"); if (pv.k != null && i === pv.k - 1) c.push("pt-cur"); } });
        if (!pv.hide && stickEdge(S.hs) && b[0] === n && b[1] === r) c.push(pv.k === null ? "pt-bl pt-glow" : "pt-bl");
      }
      else if (p === "fib") { if (S.fib != null && n + r === S.fib && r <= n) c.push("pt-fi"); }
      else if (p === "mod") {
        if (!(pv.unc === n && r >= (pv.colN || 0))) c.push(C(n, r) % S.mod ? "pt-od" : "pt-ev");
        if (sel) c.push("pt-sel");
      }
    }
    return c.join(" ");
  }
  function aria(n, r){
    var c = " " + cls(n, r) + " ", out = [];
    if (/ pt-sel /.test(c)) out.push("selected");
    if (/ pt-ab /.test(c)) out.push(S.mode === "build" ? "picked" : "one of the two entries above the selected entry");
    if (/ pt-mir /.test(c)) out.push("mirror image of the selected entry");
    if (/ pt-rw /.test(c)) out.push("in the selected row");
    if (/ pt-dg /.test(c)) out.push("on the shaded diagonal");
    if (/ pt-hs /.test(c)) out.push("in the hockey stick");
    if (/ pt-bl /.test(c)) out.push("blade: equals the stick’s sum");
    if (/ pt-fi /.test(c)) out.push("on the shaded shallow diagonal");
    if (/ pt-od /.test(c)) out.push(S.mod === 2 ? "odd" : "remainder " + (C(n, r) % S.mod) + " when divided by " + S.mod);
    if (/ pt-ev /.test(c)) out.push(S.mod === 2 ? "even" : "divisible by " + S.mod);
    return out.length ? ", " + out.join(", ") : "";
  }
  function focusKey(){
    var f = typeof S.foc === "string" ? S.foc.split(",").map(Number) : null;
    if (f && f.length === 2 && f[0] <= S.rows && f[1] >= 0 && f[1] <= f[0]) return S.foc;
    return S.sel ? S.sel.n + "," + S.sel.r : "0,0";
  }

  // --- painting ---
  function render(){
    modeR.set(S.mode); patR.set(S.pat); rowsSl.set("ptrows", S.rows);
    $("#pt-pat", host).hidden = S.mode !== "pattern";
    paintSub(); paintTri(); paintLeg(); paintCtl(); paintCap(); paintRead();
    $("#pt-msg", host).innerHTML = msg;
  }
  repaint.explore = function(){ if (!anim) paintTri(); };
  var sub = { key:null };
  function paintSub(){
    var key = S.mode === "pattern" ? S.pat : S.mode, box = $("#pt-sub", host);
    if (key !== sub.key) {
      sub = { key:key };
      if (key === "mod") box.innerHTML = '<div id="pt-smod"></div>';
      else if (key === "diag") box.innerHTML = '<div id="pt-sdg"></div>';
      else if (key === "hockey") box.innerHTML = '<div class="pt-hsc"><div id="pt-sdir"></div><div class="pt-stp" role="group" aria-label="Length of the stick"><span class="pt-stl">Length</span>' +
        '<button type="button" class="btn ghost sm pt-stb" data-hl="-1" data-k="pthlm" aria-label="Shorter stick">−</button><output class="pt-sto" id="pt-hlen" aria-live="polite"></output>' +
        '<button type="button" class="btn ghost sm pt-stb" data-hl="1" data-k="pthlp" aria-label="Longer stick">+</button></div><button type="button" class="btn ghost sm" data-hc="1" data-k="pthc">Clear the stick</button></div>';
      else box.innerHTML = "";
      if (key === "mod") sub.r = radios($("#pt-smod", box), { label:"Divide by", options:[{ id:"2", t:"÷ 2" }, { id:"3", t:"÷ 3" }, { id:"5", t:"÷ 5" }], value:String(S.mod), cls:"seg",
        onChange:function(v){ user(); S.mod = +v; save(); render(); MV.changed(); } });
      if (key === "diag") sub.r = radios($("#pt-sdg", box), { label:"Diagonal", options:DIAGS.map(function(t, i){ return { id:String(i), t:"Position " + i + ": " + t }; }), value:String(S.diag), cls:"chips",
        onChange:function(v){ user(); S.diag = +v; save(); render(); MV.changed(); } });
      if (key === "hockey") sub.r = radios($("#pt-sdir", box), { label:"Direction", options:[{ id:"L", t:"↙ Down-left" }, { id:"R", t:"↘ Down-right" }], value:S.hs ? S.hs.dir : S.hsDir, cls:"seg",
        onChange:function(v){ user(); S.hsDir = v; if (S.hs) { S.hs.dir = v; clampState(); } save(); render(); MV.changed(); } });
    }
    if (key === "mod") sub.r.set(String(S.mod));
    if (key === "diag") sub.r.set(String(S.diag));
    if (key === "hockey") {
      sub.r.set(S.hs ? S.hs.dir : S.hsDir);
      var o = $("#pt-hlen", box); o.textContent = S.hs ? S.hs.len : "—";
      $('[data-hl="-1"]', box).disabled = !S.hs || S.hs.len <= 1;
      $('[data-hl="1"]', box).disabled = !S.hs || S.hs.n + S.hs.len > S.rows;
      $("[data-hc]", box).disabled = !S.hs;
    }
  }
  function paintTri(){
    var box = $("#pt-box", host), w = box.clientWidth || boxW || host.clientWidth || 640;
    boxW = w;
    var mp = S.mode === "pattern", b = building() ? { row:S.rows + 1, vals:bvals(), marks:marks } : null;
    var o = { rows:S.rows, build:b, interactive:true, focus:focusKey(), width:w - 4, cls:cls, aria:aria, newRow:pv.newRow,
      sums:mp && S.pat === "sums", sumTxt:function(n){ return pv.sumHide === n ? "?" : big(Math.pow(2, n)); }, sym:mp && S.pat === "sym",
      rowOn:mp && (S.pat === "sums" || S.pat === "mod") && S.sel ? S.sel.n : -1,
      label:"Pascal’s triangle, rows 0 to " + S.rows + (b ? ", with row " + b.row + " to build" : "") + ". Arrow keys move between entries; Enter selects." };
    var sx = box.scrollLeft, oldIn = $(".pt-in", box), oldW = oldIn ? oldIn.style.minWidth : "";
    MV.keepFocus(box, function(){ box.innerHTML = PT.html(o); });
    var inn = $(".pt-in", box);
    box.scrollLeft = inn && inn.style.minWidth !== oldW ? Math.max(0, (box.scrollWidth - box.clientWidth) / 2) : sx;
    pv.newRow = null;
  }
  function lc(c, t){ return '<span class="pt-c pt-lc ' + c + '" aria-hidden="true">' + t + "</span>"; }
  function paintLeg(){
    var h = "", L = $("#pt-leg", host);
    if (S.mode === "explore") h = lc("pt-sel", "35") + " selected entry " + lc("pt-ab", "15") + " the two entries above it";
    else if (S.mode === "build") h = lc("pt-ab", "6") + " picked entry " + '<span class="pt-c pt-lc pt-iw" aria-hidden="true"></span> box to fill ' + lc("pt-auto", "1") + " end 1 (fills automatically)";
    else if (S.pat === "sym") h = '<span class="pt-lline" aria-hidden="true"></span> line of symmetry ' + lc("pt-sel", "21") + " an entry " + lc("pt-mir", "21") + " its mirror image";
    else if (S.pat === "sums") h = "Each row’s sum is in the right-hand column. " + lc("pt-rw", "7") + " selected row";
    else if (S.pat === "diag") h = lc("pt-dg", "6") + " the position-" + S.diag + " diagonal: " + diagName(S.diag);
    else if (S.pat === "hockey") h = lc("pt-hs", "6") + " the stick " + lc("pt-bl", "20") + " the blade (equals the sum)";
    else if (S.pat === "fib") {
      var list = []; for (var d = 0; d <= Math.min(S.rows, 15); d++) list.push(d === S.fib ? "<strong>" + big(stickSumFib(d)) + "</strong>" : big(stickSumFib(d)));
      h = lc("pt-fi", "5") + " a shallow diagonal. Shallow-diagonal sums, starting from row 0: " + list.join(", ") + ", …";
    }
    else if (S.pat === "mod") h = S.mod === 2 ? lc("pt-od", "7") + " odd (remainder 1) " + lc("pt-ev", "6") + " even (remainder 0)"
      : lc("pt-od", "7") + " remainder 1" + (S.mod === 3 ? " or 2" : " to 4") + " (not divisible by " + S.mod + ") " + lc("pt-ev", S.mod === 3 ? "6" : "10") + " remainder 0 (divisible by " + S.mod + ")";
    L.innerHTML = h;
  }
  function stickSumFib(d){ var s = 0; for (var j = 0; j <= d - j; j++) s += C(d - j, j); return s; }
  function paintCtl(){
    var c = $("#pt-bctl", host), how = $("#pt-how", host);
    if (S.mode === "build") {
      var row = S.rows + 1, made = row === 1 || !!S.made[row] || (row <= 15 && marksAllOk(row));
      MV.keepFocus(c, function(){
        c.innerHTML = row > 15 ? "" : '<div class="q-actions"><button type="button" class="btn primary sm" data-bc="check" data-k="ptbcheck"' + (row === 1 ? " disabled" : "") + ">Check row " + row + "</button>" +
          '<button type="button" class="btn ghost sm" data-bc="clear" data-k="ptbclear"' + (row === 1 ? " disabled" : "") + ">Clear the boxes</button>" +
          '<button type="button" class="btn sm" data-bc="next" data-k="ptbnext"' + (made && row < 15 ? "" : " disabled") + ">Build the next row</button></div>";
      });
      how.innerHTML = S.rows >= 15 ? "All 16 rows are showing. Lower <strong>Rows shown</strong> to build a row." :
        "Tap two neighbouring entries in row " + S.rows + " to fill the box between them below, or type the sum in a box. The 1s at the ends fill automatically. Then press <strong>Check row " + row + "</strong>.";
      return;
    }
    c.innerHTML = "";
    if (S.mode === "explore") how.innerHTML = "Tap any entry (or move with the arrow keys and press Enter) to see which combination it is and the two entries above it.";
    else how.innerHTML = {
      sym:"Tap an entry to ring it and its mirror image across the dashed line.",
      sums:"Tap any entry to pick its row. Each row’s sum is in the right-hand column.",
      diag:"Choose a diagonal above, or tap an entry to shade the diagonal at its position.",
      hockey:"Tap a start cell, then tap a cell further down one of its two diagonals, or use <strong>Length</strong>. With an entry focused, Shift + arrow keys extend the stick (Shift + ↑ shortens it).",
      fib:"Tap an entry: its shallow diagonal (up one row and over one position at each step) is shaded and added.",
      mod:"Choose ÷ 2, ÷ 3 or ÷ 5. Tap an entry to count the colours in its row."
    }[S.pat];
  }
  function marksAllOk(row){ if (row !== S.rows + 1) return false; for (var r = 1; r < row; r++) if (marks[r] !== "ok") return false; return row > 1; }
  function stickTxt(){
    var hs = S.hs; if (!hs) return null;
    var vals = stickVals(hs), sum = stickSum(hs), b = stickBlade(hs), edge = stickEdge(hs);
    if (pv.hide && pv.k == null) return plusTxt(vals) + " = ?";
    if (pv.k != null) { var part = vals.slice(0, pv.k); return plusTxt(part) + " = " + big(part.reduce(function(a, x){ return a + x; }, 0)) + (pv.k < vals.length ? " …" : ""); }
    return plusTxt(vals) + " = <strong>" + big(sum) + "</strong>" + (edge ? " = " + cTxt(b[0], b[1]) : "");
  }
  function paintCap(){
    var c = $("#pt-cap", host), h = "", sel = S.sel;
    if (S.mode === "build") h = S.rows >= 15 ? "All 16 rows" : "Build row " + (S.rows + 1);
    else if (S.mode === "explore") h = sel ? M("C(" + sel.n + ", " + sel.r + ") = " + C(sel.n, sel.r)) : "Tap an entry";
    else if (S.pat === "sym") h = sel ? M("C(" + sel.n + ", " + sel.r + ") = C(" + sel.n + ", " + (sel.n - sel.r) + ") = " + C(sel.n, sel.r)) : M("C(n, r) = C(n, n - r)");
    else if (S.pat === "sums") h = sel ? (pv.sumHide === sel.n ? "Row " + sel.n + ": ?" : M("2^" + sel.n + " = " + Math.pow(2, sel.n))) : "Row " + M("n") + " sums to " + M("2^n");
    else if (S.pat === "diag") {
      var vals = []; for (var n = S.diag; n <= S.rows && vals.length < 7; n++) { if (n === pv.pend) break; vals.push(big(C(n, S.diag))); }
      h = vals.length ? vals.join(", ") + (pv.hide ? ", ?" : ", …") : "Show more rows";
    }
    else if (S.pat === "hockey") h = S.hs ? stickTxt() : "Shade a stick";
    else if (S.pat === "fib") { var fc = S.fib != null ? fibCells(S.fib, S.rows) : []; h = fc.length ? plusTxt(fc.map(function(q){ return C(q[0], q[1]); })) + " = " + big(stickSumFib(S.fib)) : "Tap an entry"; }
    else if (S.pat === "mod") h = sel && !pv.hide ? modTxt(sel.n, true) : (sel ? "Row " + sel.n + ": ?" : "Tap an entry");
    c.innerHTML = h;
  }
  function modCount(n){ var k = 0; for (var r = 0; r <= n; r++) if (C(n, r) % S.mod) k++; return k; }
  function modTxt(n, short){
    var k = modCount(n);
    if (S.mod === 2) return "Row " + n + ": " + k + " odd " + (k === 1 ? "entry" : "entries") + (short ? "" : (k === n + 1 ? " (all odd)" : ", " + (n + 1 - k) + " even"));
    return "Row " + n + ": " + k + " not divisible by " + S.mod + (short ? "" : ", " + (n + 1 - k) + " divisible");
  }
  function paintRead(){
    var rows = [], sel = S.sel;
    rows.push(["Selected entry", sel ? "Row " + sel.n + ", position " + sel.r + ": " + cTxt(sel.n, sel.r) + " = <strong>" + big(C(sel.n, sel.r)) + "</strong>" : '<span class="muted">tap an entry</span>']);
    if (S.mode === "build") {
      if (S.rows >= 15) rows.push(["Building", '<span class="muted">lower Rows shown to build a row</span>']);
      else {
        var row = S.rows + 1, v = rowVals(row), f = v.filter(function(x, r){ return r > 0 && r < row && x != null; }).length;
        rows.push(["Building", "Row " + row + ": " + (row === 1 ? "1 1 (both ends)" : f + " of " + (row - 1) + " boxes filled; " + (row + 1) + " entries in all")]);
      }
      rows.push(["Rule", "each entry is the sum of the two entries directly above it"]);
    } else if (S.mode === "explore") {
      var ab = '<span class="muted">tap an entry</span>';
      if (sel) {
        if (sel.n === 0) ab = "none: row 0 is the starting 1";
        else if (sel.r === 0 || sel.r === sel.n) ab = "only " + cTxt(sel.n - 1, sel.r === 0 ? 0 : sel.n - 1) + " = 1: the ends are always 1";
        else ab = cTxt(sel.n - 1, sel.r - 1) + " + " + cTxt(sel.n - 1, sel.r) + " = " + big(C(sel.n - 1, sel.r - 1)) + " + " + big(C(sel.n - 1, sel.r));
      }
      rows.push(["Entries above", ab]);
    } else if (S.pat === "sym") rows.push(["Symmetry", sel ? cTxt(sel.n, sel.r) + " = " + cTxt(sel.n, sel.n - sel.r) + " = " + big(C(sel.n, sel.r)) + ': <span class="muted">choosing ' + sel.r + " is the same as leaving out " + (sel.n - sel.r) + "</span>" : '<span class="muted">tap an entry</span>']);
    else if (S.pat === "sums") rows.push(["Row sum", sel ? (pv.sumHide === sel.n ? "Row " + sel.n + ": ?" : "Row " + sel.n + ": " + big(Math.pow(2, sel.n)) + " = " + M("2^" + sel.n)) : '<span class="muted">tap an entry to pick its row</span>']);
    else if (S.pat === "diag") {
      var dv = []; for (var n = S.diag; n <= S.rows && dv.length < 6; n++) { if (n === pv.pend) break; dv.push(big(C(n, S.diag))); }
      rows.push(["Diagonal", "Position " + S.diag + ": " + (dv.length ? dv.join(", ") + ", … " : "") + '<span class="muted">(' + diagName(S.diag) + ")</span>"]);
    }
    else if (S.pat === "hockey") rows.push(["Shaded sum", S.hs ? stickTxt() + (pv.hide || pv.k != null ? "" : hockeyNote()) : '<span class="muted">tap a start cell</span>']);
    else if (S.pat === "fib") { var fc = S.fib != null ? fibCells(S.fib, S.rows) : []; rows.push(["Shaded sum", fc.length ? plusTxt(fc.map(function(q){ return C(q[0], q[1]); })) + " = <strong>" + big(stickSumFib(S.fib)) + "</strong>" + (S.fib > S.rows ? ' <span class="muted">(part of the diagonal is below row ' + S.rows + ")</span>" : ' <span class="muted">(a Fibonacci number)</span>') : '<span class="muted">tap an entry</span>']); }
    else if (S.pat === "mod") rows.push(["Remainder colouring", sel ? (pv.hide ? "Row " + sel.n + ": ?" : modTxt(sel.n)) : '<span class="muted">tap an entry to count its row</span>']);
    $("#pt-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function hockeyNote(){
    var hs = S.hs, b = stickBlade(hs);
    if (!stickEdge(hs)) return '<br><span class="muted">This run doesn’t start at the 1 on the edge, so its sum isn’t one entry.</span>';
    if (b[0] > 15) return '<br><span class="muted">The blade, ' + cTxt(b[0], b[1]) + ", is in row " + b[0] + ", beyond this triangle.</span>";
    if (b[0] > S.rows) return '<br><span class="muted">The blade, ' + cTxt(b[0], b[1]) + ", is in row " + b[0] + ": show more rows to see it.</span>";
    return '<br><span class="muted">Blade: one row below the last cell, one step over.</span>';
  }

  // --- taps ---
  function tap(n, r){
    user(); S.foc = n + "," + r;
    if (S.mode === "build") { tapBuild(n, r); return; }
    S.sel = { n:n, r:r };
    if (S.mode === "pattern") {
      if (S.pat === "diag") S.diag = r;
      else if (S.pat === "hockey") tapStick(n, r);
      else if (S.pat === "fib") S.fib = n + r;
    }
    msg = ""; save(); render(); MV.changed();
  }
  function tapStick(n, r){
    var hs = S.hs;
    if (hs) {
      if (r === hs.r && n > hs.n) { hs.dir = "L"; S.hsDir = "L"; hs.len = n - hs.n + 1; return; }
      if (n - r === hs.n - hs.r && n > hs.n) { hs.dir = "R"; S.hsDir = "R"; hs.len = n - hs.n + 1; return; }
      if (n === hs.n && r === hs.r) { hs.len = 1; return; }
    }
    S.hs = { n:n, r:r, dir:S.hsDir, len:1 };
  }
  function tapBuild(n, r){
    var top = S.rows;
    if (top >= 15) { msg = "All 16 rows are showing. Lower <strong>Rows shown</strong> to build a row."; render(); return; }
    if (n !== top) { pick = null; msg = "Tap two neighbouring entries in row " + top + ", just above the empty boxes."; render(); return; }
    if (!pick) { pick = { n:n, r:r }; msg = "Now tap a neighbour of " + big(C(n, r)) + " in row " + n + "."; render(); return; }
    if (pick.r === r) { pick = null; msg = ""; render(); return; }
    if (Math.abs(pick.r - r) !== 1) { pick = { n:n, r:r }; msg = "Those two aren’t neighbours. Now tap a neighbour of " + big(C(n, r)) + "."; render(); return; }
    var a = Math.min(pick.r, r), pos = a + 1, s = C(n, a) + C(n, a + 1);
    bvals()[pos] = String(s); delete marks[pos]; pick = null;
    msg = big(C(n, a)) + " + " + big(C(n, a + 1)) + " = " + big(s) + " fills row " + (n + 1) + ", position " + pos + ".";
    save(); render(); MV.changed();
  }
  function stepLen(d){
    if (!S.hs) return;
    S.hs.len = Math.max(1, Math.min(S.rows - S.hs.n + 1, S.hs.len + d));
    var e = stickCells(S.hs).pop(); S.sel = { n:e[0], r:e[1] };
    save(); render(); MV.changed();
  }
  function extendStick(key, n, r){
    user();
    if (!S.hs) S.hs = { n:n, r:r, dir:S.hsDir, len:1 };
    var hs = S.hs;
    if (key === "ArrowUp") hs.len = Math.max(1, hs.len - 1);
    else { var d = key === "ArrowRight" ? "R" : "L"; if (d !== hs.dir) { hs.dir = d; S.hsDir = d; } else hs.len++; }
    clampState();
    if (!S.hs) return;
    var e = stickCells(S.hs).pop(); S.sel = { n:e[0], r:e[1] }; S.foc = e[0] + "," + e[1];
    save(); render(); MV.changed();
    var nb = host.querySelector('[data-k="ptc' + e[0] + "_" + e[1] + '"]'); if (nb) nb.focus();
  }
  function checkRow(){
    var row = S.rows + 1, v = bvals(), bad = 0, empty = 0;
    marks = {};
    for (var r = 1; r < row; r++) {
      var s = String(v[r] == null ? "" : v[r]).trim();
      if (!s) { empty++; continue; }
      if (/^\d+$/.test(s) && +s === C(row, r)) marks[r] = "ok"; else { marks[r] = "bad"; bad++; }
    }
    if (!bad && !empty) { S.made[row] = true; msg = "<strong>✓ Row " + row + " is complete:</strong> " + rowTxt(row) + ". " + (row + 1) + " entries, each the sum of the two above."; }
    else if (bad) msg = "<strong>✗ Not yet.</strong> Check the boxes marked ✗. Each entry adds the two entries directly above it.";
    else msg = "Fill every box first: row " + row + " has " + (row + 1) + " entries, and the two end 1s are already there.";
    save(); render(); MV.changed();
  }
  function rowTxt(n){ var a = []; for (var r = 0; r <= n; r++) a.push(big(C(n, r))); return a.join(" "); }

  // --- events ---
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.n != null && b.classList.contains("pt-c")) { tap(+b.dataset.n, +b.dataset.r); return; }
    if (b.dataset.hl) { user(); stepLen(+b.dataset.hl); return; }
    if (b.dataset.hc) { user(); S.hs = null; save(); render(); MV.changed(); return; }
    if (b.dataset.bc) {
      user(); var row = S.rows + 1;
      if (b.dataset.bc === "check") checkRow();
      else if (b.dataset.bc === "clear") { S.bv[row] = {}; marks = {}; msg = ""; save(); render(); MV.changed(); }
      else if (b.dataset.bc === "next" && S.rows < 14) { if (row === 1) S.made[1] = true; S.rows++; marks = {}; pick = null; msg = ""; clampState(); save(); render(); MV.changed(); var f = host.querySelector(".pt-inp"); if (f) f.focus(); }
    }
  });
  host.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset || t.dataset.br == null || !building()) return;
    var clean = t.value.replace(/[^\d]/g, "").slice(0, 5); if (clean !== t.value) t.value = clean;
    var r = +t.dataset.br; bvals()[r] = clean; delete marks[r];
    var w = t.parentNode; if (w) w.classList.remove("pt-ok", "pt-bad");
    if (anim) cancelAnim();
    save(); paintRead(); paintCtl(); MV.changed();
  });
  host.addEventListener("keydown", function(e){
    var t = e.target;
    if (t.dataset && t.dataset.br != null && e.key === "Enter") {
      e.preventDefault();
      var nx = host.querySelector('.pt-inp[data-br="' + (+t.dataset.br + 1) + '"]');
      if (nx) nx.focus(); else checkRow();
      return;
    }
    var b = t.closest && t.closest("button.pt-c[data-n]"); if (!b) return;
    var n = +b.dataset.n, r = +b.dataset.r, k = e.key;
    if (e.shiftKey && S.mode === "pattern" && S.pat === "hockey" && /^Arrow/.test(k)) { e.preventDefault(); extendStick(k, n, r); return; }
    var nn = n, rr = r;
    if (k === "ArrowLeft") rr--; else if (k === "ArrowRight") rr++;
    else if (k === "ArrowUp") { nn--; rr = Math.min(r, nn); } else if (k === "ArrowDown") nn++;
    else if (k === "Home") rr = 0; else if (k === "End") rr = n; else return;
    e.preventDefault();
    var nb = host.querySelector('button.pt-c[data-n="' + nn + '"][data-r="' + rr + '"]'); if (!nb) return;
    host.querySelectorAll("button.pt-c").forEach(function(x){ x.tabIndex = -1; });
    nb.tabIndex = 0; nb.focus(); S.foc = nn + "," + rr;
  });
  if (window.ResizeObserver) new ResizeObserver(function(){ var bx = $("#pt-box", host), w = bx ? bx.clientWidth : 0; if (w && Math.abs(w - boxW) > 3) paintTri(); }).observe($("#pt-box", host));

  render();

  // --- predictions ---
  function startPred(p){
    cancelAnim(); pick = null; msg = ""; marks = {};
    var s = p.start || {};
    S.mode = s.mode; S.pat = s.pat; S.rows = s.rows; S.sel = null;
    if (s.mod) S.mod = s.mod;
    if (s.diag != null) S.diag = s.diag;
    if (s.hs) { S.hs = { n:s.hs.n, r:s.hs.r, dir:s.hs.dir, len:s.hs.len }; S.hsDir = s.hs.dir; }
    pv = { hide:true };
    if (p.id === "p3") { S.sel = { n:8, r:0 }; pv.unc = 8; pv.colN = 0; }
    clampState(); save(); render();
  }
  function runPred(p, done){
    newAnim(done);
    if (p.id === "p1") {
      later(350, function(){
        S.rows = 5; S.sel = { n:5, r:0 }; pv = { hide:true, sumHide:5, newRow:5 }; render();
        later(1400, function(){ pv = {}; save(); render(); later(1000, function(){ endAnim(); MV.changed(); }); });
      });
      return;
    }
    if (p.id === "p2") {
      pv = { hide:true, k:0 };
      (function tick(){
        pv.k++; render();
        if (pv.k < S.hs.len) later(750, tick);
        else later(800, function(){ pv = { k:null }; var b = stickBlade(S.hs); S.sel = { n:b[0], r:b[1] }; render(); later(1400, function(){ pv = {}; save(); endAnim(); MV.changed(); }); });
      })();
      return;
    }
    if (p.id === "p3") {
      pv = { hide:true, unc:8, colN:0 };
      (function tick(){
        pv.colN++; render();
        if (pv.colN < 9) later(280, tick);
        else later(500, function(){ pv = {}; render(); later(900, function(){ save(); endAnim(); MV.changed(); }); });
      })();
      return;
    }
    // p4: row 6 appears, then C(6, 2) = 15 lights up on the position-2 diagonal
    later(350, function(){
      S.rows = 6; pv = { hide:true, pend:6, newRow:6 }; render();
      later(1100, function(){ pv = { glow:{ n:6, r:2 } }; S.sel = { n:6, r:2 }; save(); render(); later(1500, function(){ endAnim(); MV.changed(); }); });
    });
  }

  return {
    predict:{ start:startPred, run:runPred },
    challenge:function(id){ return chal(id); }
  };

  function chal(id){
    if (id === "tc1") {
      if (S.mode !== "build") return { ok:false, msg:"Switch to Build mode first." };
      if (S.made[7] || (S.rows === 6 && rowRight(7))) return { ok:true };
      var row = S.rows + 1;
      if (row === 7) {
        var v = rowVals(7), filled = v.filter(function(x){ return x != null; }).join(" ");
        if (filled === "1 7 21 35 21 7 1") return { ok:false, msg:"Row 7 has 8 entries: 35 appears twice in the middle." };
        if (filled === "1 6 15 20 15 6 1") return { ok:false, msg:"That’s row 6; the top 1 is row 0." };
        for (var r = 1; r < 7; r++) if (v[r] != null && v[r] !== C(7, r)) for (var j = 1; j <= 6; j++) if (j !== r && C(6, j - 1) + C(6, j) === v[r]) return { ok:false, msg:"Each entry adds the two entries directly above it." };
        if (v.some(function(x){ return x == null; })) return { ok:false, msg:"Fill every box in row 7: it has 8 entries, and the two end 1s are already there." };
        return { ok:false, msg:"Each entry adds the two entries directly above it. Check the boxes that don’t match." };
      }
      if (row === 6 && rowRight(6)) return { ok:false, msg:"That’s row 6; the top 1 is row 0." };
      return { ok:false, msg:"Set <strong>Rows shown</strong> to 0–6 so that row 7 appears as empty boxes, then fill it in." };
    }
    if (id === "tc2") {
      if (S.mode !== "pattern" || S.pat !== "hockey") return { ok:false, msg:"Choose Pattern mode, then Hockey stick, and shade a run of cells." };
      if (!S.hs) return { ok:false, msg:"Tap a start cell, then a cell further down its diagonal." };
      var sum = stickSum(S.hs), edge = stickEdge(S.hs);
      if (sum === 56 && edge) return { ok:true };
      if (sum === 56) return { ok:false, msg:"A hockey stick starts at the 1 on the edge." };
      if (sum === 35 || sum === 84) return { ok:false, msg:"Close: lengthen or shorten the run by one cell." };
      return { ok:false, msg:"Your run sums to " + big(sum) + ", not 56." + (edge ? "" : " A hockey stick starts at the 1 on the edge.") };
    }
    if (id === "tc3") {
      if (S.mode !== "pattern" || S.pat !== "mod" || S.mod !== 2) return { ok:false, msg:"Switch to Pattern mode, Colour by remainder, ÷ 2." };
      if (!S.sel) return { ok:false, msg:"Tap an entry in the row you choose." + (S.rows < 15 ? " Show more rows: the slider goes up to 15." : "") };
      var n = S.sel.n;
      if (n === 15) return { ok:true };
      if (n === 8) return { ok:false, msg:"Only its ends are odd." };
      if (n === 14) return { ok:false, msg:"It has even entries; look at " + M("C(14, 1) = 14") + "." };
      if (n === 9) return { ok:false, msg:M("C(9, 2) = 36") + " is even." };
      if (n === 7) return { ok:false, msg:"Row 7 is the one given. Find the next all-odd row below it." };
      if (n < 7) return { ok:false, msg:"Row " + n + " comes before row 7. Look further down." + (S.rows < 15 ? " Show more rows: the slider goes up to 15." : "") };
      for (var q = 1; q < n; q++) if (C(n, q) % 2 === 0) return { ok:false, msg:"Row " + n + " has even entries, such as " + M("C(" + n + ", " + q + ") = " + C(n, q)) + "." };
      return { ok:false };
    }
    return { ok:false };
  }
}

// ---------- hero: rows 0–6 grow by adding the two entries above; C(6, 2) = 15 lights up ----------
function hero(f){
  var svg = $("#pt-hsvg"), cap = f.cap;
  if (!svg) return;
  var W = 46, n, r;
  function X(nn, rr){ return 180 + (rr - nn / 2) * W; }
  function Y(nn){ return 24 + nn * 34; }
  function arrow(x1, y1, x2, y2){
    var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L;
    var sx = x1 + ux * 12, sy = y1 + uy * 12, ex = x2 - ux * 13, ey = y2 - uy * 13;
    return '<line x1="' + sx.toFixed(1) + '" y1="' + sy.toFixed(1) + '" x2="' + (ex - ux * 4).toFixed(1) + '" y2="' + (ey - uy * 4).toFixed(1) + '"/>' +
      '<path d="M' + ex.toFixed(1) + " " + ey.toFixed(1) + "L" + (ex - ux * 7 - uy * 4).toFixed(1) + " " + (ey - uy * 7 + ux * 4).toFixed(1) + "L" + (ex - ux * 7 + uy * 4).toFixed(1) + " " + (ey - uy * 7 - ux * 4).toFixed(1) + 'Z"/>';
  }
  var h = '<text class="pt-hlab" id="pt-hl0" x="' + (X(0, 0) + 24) + '" y="' + (Y(0) + 4) + '">row 0</text>';
  for (n = 2; n <= 6; n++) for (r = 1; r < n; r++) h += '<g class="pt-har" id="pt-ha' + n + "_" + r + '">' + arrow(X(n - 1, r - 1), Y(n - 1), X(n, r), Y(n)) + arrow(X(n - 1, r), Y(n - 1), X(n, r), Y(n)) + "</g>";
  for (n = 0; n <= 6; n++) for (r = 0; r <= n; r++) h += '<rect class="pt-hbx" id="pt-hb' + n + "_" + r + '" x="' + (X(n, r) - 17) + '" y="' + (Y(n) - 12) + '" width="34" height="24" rx="6"/><text class="pt-hn" id="pt-hn' + n + "_" + r + '" x="' + X(n, r) + '" y="' + (Y(n) + 1) + '">' + C(n, r) + "</text>";
  h += '<text class="pt-hcl" id="pt-hcl" x="' + X(6, 2) + '" y="' + (Y(6) + 30) + '"><tspan font-style="italic">C</tspan>(6, 2)</text>';
  svg.innerHTML = h;
  function el(id){ return svg.querySelector("#" + id); }
  function on(id, b){ var e = el(id); if (e) e.classList.toggle("on", b !== false); }
  function cell(nn, rr){ on("pt-hb" + nn + "_" + rr); on("pt-hn" + nn + "_" + rr); }
  function hit(){ el("pt-hb6_2").classList.add("hit"); el("pt-hn6_2").classList.add("hit"); on("pt-hcl"); on("pt-ha6_2"); cap.innerHTML = "Row 6, position 2: " + M("C(6, 2) = 15"); }
  if (MV.reduceMotion) { for (n = 0; n <= 6; n++) for (r = 0; r <= n; r++) cell(n, r); on("pt-hl0"); hit(); return; }
  on("pt-hl0"); cell(0, 0); cap.textContent = "Row 0: a single 1";
  var order = [], i = 0, prev = null;
  for (n = 1; n <= 6; n++) for (r = 0; r <= n; r++) order.push([n, r]);
  function step(){
    if (prev) { on(prev, false); prev = null; }
    if (i >= order.length) { MV.wait(500, hit); return; }
    var nn = order[i][0], rr = order[i][1]; i++;
    if (rr === 0 || rr === nn) { cell(nn, rr); if (rr === 0 && nn <= 2) cap.textContent = "Row " + nn + ": each row starts and ends with 1"; MV.wait(nn < 3 ? 320 : 120, step); return; }
    prev = "pt-ha" + nn + "_" + rr; on(prev);
    cap.textContent = "Row " + nn + ": " + C(nn - 1, rr - 1) + " + " + C(nn - 1, rr) + " = " + C(nn, rr);
    MV.wait(nn < 4 ? 480 : 220, function(){ cell(nn, rr); MV.wait(nn < 4 ? 520 : 200, step); });
  }
  MV.wait(1000, step);
}

// ---------- Part 3: Paths and Pascal (label a 4 × 3 street grid, a closed corner, a Galton board) ----------
// @component D5 gridPaths — label-the-grid version (adapted from MDM4U 08's gridPaths): an R × U street grid in SVG with an
// HTML layer on top. Given or solved route counts sit on the corners as number pills; open corners are number inputs; a closed
// corner gets an --ink-2 cross and a "Closed" tag (never colour alone). Corners are "x,y": x blocks right and y up from A.
//   GL.html({R, U, block:[x, y], given:{"x,y":v}, solved:{"x,y":v}, open:{"x,y":"typed"}, bad:{"x,y":1}, fresh:"x,y", aria}) -> html
//   GL.count(R, U, block) -> {"x,y": routes from A}   (a closed corner counts 0)
var GL = (function(){
  var CELL = 66, PL = 34, PR = 34, PT = 44, PB = 44;
  function geo(R, U){ return { W:PL + PR + R * CELL, H:PT + PB + U * CELL, X:function(x){ return PL + x * CELL; }, Y:function(y){ return PT + (U - y) * CELL; } }; }
  function count(R, U, block){
    var v = {};
    for (var s = 0; s <= R + U; s++) for (var x = 0; x <= R; x++) {
      var y = s - x; if (y < 0 || y > U) continue;
      v[x + "," + y] = block && block[0] === x && block[1] === y ? 0 : !x && !y ? 1 : (x ? v[(x - 1) + "," + y] : 0) + (y ? v[x + "," + (y - 1)] : 0);
    }
    return v;
  }
  function html(o){
    var R = o.R, U = o.U, g = geo(R, U), h = "", lay = "", x, y;
    for (x = 0; x <= R; x++) h += '<line class="gl-st" x1="' + g.X(x) + '" y1="' + g.Y(0) + '" x2="' + g.X(x) + '" y2="' + g.Y(U) + '"/>';
    for (y = 0; y <= U; y++) h += '<line class="gl-st" x1="' + g.X(0) + '" y1="' + g.Y(y) + '" x2="' + g.X(R) + '" y2="' + g.Y(y) + '"/>';
    if (o.block) { var bx = g.X(o.block[0]), by = g.Y(o.block[1]); h += '<path class="gl-bk" d="M' + (bx - 27) + " " + (by - 23) + "L" + (bx + 27) + " " + (by + 23) + "M" + (bx + 27) + " " + (by - 23) + "L" + (bx - 27) + " " + (by + 23) + '"/><text class="gl-tag" x="' + (bx + 4) + '" y="' + (by + 36) + '">Closed</text>'; }
    h += '<text class="gl-lab" x="' + (g.X(0) - 26) + '" y="' + (g.Y(0) + 30) + '">A</text><text class="gl-lab" x="' + (g.X(R) + 14) + '" y="' + (g.Y(U) - 22) + '">B</text>';
    function pos(xx, yy){ return "left:" + (g.X(xx) / g.W * 100).toFixed(3) + "%;top:" + (g.Y(yy) / g.H * 100).toFixed(3) + "%"; }
    for (y = U; y >= 0; y--) for (x = 0; x <= R; x++) {
      var k = x + "," + y, isB = o.block && o.block[0] === x && o.block[1] === y, where = "Corner (" + x + ", " + y + ")" + (!x && !y ? ", A" : "") + (x === R && y === U ? ", B" : "") + (isB ? ", closed for construction" : "");
      if (o.given[k] != null || o.solved[k] != null) {
        var v = o.given[k] != null ? o.given[k] : o.solved[k];
        lay += '<span class="gl-v' + (o.given[k] != null ? " given" : " ok") + (isB ? " blk" : "") + (o.fresh === k ? " fresh" : "") + '" style="' + pos(x, y) + '" role="img" aria-label="' + MV.esc(where + ": " + v + (v === 1 ? " route" : " routes")) + '">' + v + "</span>";
      } else if (k in o.open) {
        lay += '<input class="gl-in' + (o.bad[k] ? " bad" : "") + (isB ? " blk" : "") + '" type="text" inputmode="numeric" maxlength="3" autocomplete="off" data-gk="' + k + '" data-k="gl' + x + "_" + y + '" value="' + MV.esc(o.open[k]) + '" style="' + pos(x, y) + '" aria-label="' + MV.esc(where + ": number of routes from A") + '">';
      }
    }
    return '<div class="gl" style="max-width:' + Math.round(g.W * 1.3) + 'px"><svg class="gl-svg" viewBox="0 0 ' + g.W + " " + g.H + '" role="img" aria-label="' + MV.esc(o.aria || "Street grid") + '">' + h + '</svg><div class="gl-lay">' + lay + "</div></div>";
  }
  return { geo:geo, count:count, html:html };
})();

// @component galtonBoard — Galton board (a preview of module 21's D7 view): balls fall through ROWS rows of pegs, bouncing left
// or right at each one; bin k collects the balls with k right bounces. SVG in a 360 × 330 box; solid bars are the balls
// collected, dashed outlines the theoretical share N × C(6, k)/64 ("Show route counts"); peg route counts are Pascal's triangle.
//   GB.svg({bins:[7 counts], show}) -> html    GB.path(word) -> polyline of a ball's fall    GB.at(path, t) -> [x, y]
//   GB.bars(g, bins, show) redraws the bars and counts in place    GB.random(n, rnd) / GB.every() -> route words ("LRRLRL")
var GB = (function(){
  var ROWS = 6, DX = 40, X0 = 180, Y0 = 42, DY = 28, BT = 216, BB = 298;
  function px(i, j){ return X0 + (j - i / 2) * DX; }
  function py(i){ return Y0 + i * DY; }
  function bx(k){ return X0 + (k - ROWS / 2) * DX; }
  function path(word){ var p = [[X0, 8]], j = 0; for (var i = 0; i < ROWS; i++) { p.push([px(i, j), py(i) - 11]); if (word[i] === "R") j++; } p.push([bx(j), BT + 4]); return p; }
  function at(p, t){ var segs = p.length - 1, u = Math.min(segs - 1e-9, Math.max(0, t * segs)), i = Math.floor(u), f = u - i; return [p[i][0] + (p[i + 1][0] - p[i][0]) * f, p[i][1] + (p[i + 1][1] - p[i][1]) * f]; }
  function binOf(w){ return (w.match(/R/g) || []).length; }
  function barsHTML(bins, show){
    var tot = bins.reduce(function(a, b){ return a + b; }, 0), mx = Math.max.apply(null, bins.concat([1]));
    if (show && tot) mx = Math.max(mx, tot * 20 / 64);
    var sc = Math.min(5, (BB - BT - 10) / mx), h = "";
    for (var k = 0; k <= ROWS; k++) {
      var hg = bins[k] * sc;
      if (hg > 0) h += '<rect class="gb-bar" x="' + (bx(k) - 13) + '" y="' + (BB - hg).toFixed(1) + '" width="26" height="' + hg.toFixed(1) + '" rx="2"/>';
      if (show && tot) { var e = tot * C(ROWS, k) / 64 * sc; h += '<rect class="gb-th" x="' + (bx(k) - 16) + '" y="' + (BB - e).toFixed(1) + '" width="32" height="' + e.toFixed(1) + '"/>'; }
      h += '<text class="gb-cnt" x="' + bx(k) + '" y="' + (BB + 17) + '">' + bins[k] + "</text>";
    }
    return h;
  }
  function svg(o){
    var h = "", i, j, k;
    for (i = 0; i < ROWS; i++) for (j = 0; j <= i; j++) {
      h += '<circle class="gb-peg" cx="' + px(i, j) + '" cy="' + py(i) + '" r="4.5"/>';
      if (o.show) h += '<text class="gb-pc" x="' + px(i, j) + '" y="' + (py(i) + 15) + '">' + C(i, j) + "</text>";
    }
    for (k = 0; k <= ROWS + 1; k++) h += '<line class="gb-div" x1="' + (bx(k) - DX / 2) + '" y1="' + (BT - 6) + '" x2="' + (bx(k) - DX / 2) + '" y2="' + BB + '"/>';
    h += '<line class="gb-div" x1="' + (bx(0) - DX / 2) + '" y1="' + BB + '" x2="' + (bx(ROWS) + DX / 2) + '" y2="' + BB + '"/>';
    if (o.show) for (k = 0; k <= ROWS; k++) h += '<text class="gb-bc" x="' + bx(k) + '" y="' + (BT + 6) + '">' + C(ROWS, k) + "</text>";
    h += '<g class="gb-bars">' + barsHTML(o.bins, o.show) + '</g><g class="gb-balls"></g>';
    h += '<text class="gb-lab" x="' + (bx(0) - DX / 2) + '" y="' + (BB + 30) + '">bin 0 (no right bounces)</text><text class="gb-lab" text-anchor="end" x="' + (bx(ROWS) + DX / 2) + '" y="' + (BB + 30) + '">bin 6 (6 right)</text>';
    return '<svg class="gb-svg" viewBox="0 0 360 332" role="img" aria-label="' + MV.esc("Galton board with 6 rows of pegs and 7 bins. Bin counts: " + o.bins.join(", ") + "." + (o.show ? " Route counts: pegs show rows 0 to 5 of Pascal’s triangle; bins 1, 6, 15, 20, 15, 6, 1." : "")) + '">' + h + "</svg>";
  }
  function random(n, rnd){ var out = []; for (var b = 0; b < n; b++) { var w = ""; for (var i = 0; i < ROWS; i++) w += rnd() < 0.5 ? "L" : "R"; out.push(w); } return out; }
  function every(){ var out = []; for (var m = 0; m < 64; m++) { var w = ""; for (var i = 0; i < ROWS; i++) w += (m >> (ROWS - 1 - i)) & 1 ? "R" : "L"; out.push(w); } return out; }
  return { svg:svg, path:path, at:at, binOf:binOf, bars:function(g, bins, show){ if (g) g.innerHTML = barsHTML(bins, show); }, random:random, every:every };
})();

var GRID = { R:4, U:3 }, BLOCK = [2, 1];
function innerKeys(){ var out = []; for (var s = 2; s <= GRID.R + GRID.U; s++) for (var x = 1; x <= GRID.R; x++) { var y = s - x; if (y >= 1 && y <= GRID.U) out.push(x + "," + y); } return out; }
function part3(host, api){
  var S = api.S, ST = (api.content || {}).stations || [];
  if (!ST.length) return {};
  S.st = obj(S.st);
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = ST[0].id;
  var msg = {}, fresh = null, galt = null, NS = "http://www.w3.org/2000/svg";
  function sst(id){
    var x = S.st[id] = obj(S.st[id]);
    if (id === "s3") {
      x.bins = Array.isArray(x.bins) && x.bins.length === 7 ? x.bins.map(function(v){ return clampInt(v, 0, 1e6, 0); }) : [0, 0, 0, 0, 0, 0, 0];
      x.n = x.bins.reduce(function(a, b){ return a + b; }, 0); x.show = !!x.show; x.drops = clampInt(x.drops, 0, 1e6, 0);
      if (typeof x.last !== "string" || !/^[LR]{6}$/.test(x.last)) x.last = "";
    } else { x.v = obj(x.v); x.ok = obj(x.ok); x.bad = obj(x.bad); }
    return x;
  }
  function isDone(s){ var x = sst(s.id); return s.id === "s3" ? !!x.done : innerKeys().every(function(k){ return x.ok[k]; }); }
  host.innerHTML = '<div id="pq-tabs" class="pq-tabs"></div><div id="pq-body" class="pq-body"></div>';
  var tabOpts = ST.map(function(s){ return { id:s.id, t:"" }; });
  function tabText(){ ST.forEach(function(s, i){ tabOpts[i].t = "S" + (i + 1) + ": " + s.name + (isDone(s) ? ' <span class="pq-tick" aria-label="done">✓</span>' : ""); }); }
  tabText();
  var tabs = radios($("#pq-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ stopG(); S.cur = v; fresh = null; api.save(); paint(); } });
  function cur(){ return ST.filter(function(s){ return s.id === S.cur; })[0]; }
  function setMsg(id, kind, html){ msg[id] = { kind:kind, html:html }; }
  function known(x, k){ var p = k.split(","); return +p[0] === 0 || +p[1] === 0 || !!x.ok[k]; }

  function paint(){
    tabText(); tabs.refresh();
    var s = cur(), x = sst(s.id), body = $("#pq-body", host), i = ST.indexOf(s), dOld = $("details.alg", body), algOpen = dOld ? dOld.open : isDone(s);
    var h = '<div class="pq-card"><span class="pq-lab">Station ' + (i + 1) + '</span><span class="pq-name">' + s.name + '</span></div><p class="pq-task">' + s.task + "</p>";
    h += '<div class="pq-two"><div class="pq-gcol">' + (s.id === "s3" ? galtonCol(x) : gridCol(s, x)) + '</div><div class="pq-icol">' + (s.id === "s3" ? galtonInfo(x) : gridInfo(s, x));
    if (msg[s.id]) h += MV.fbHTML(msg[s.id].kind, msg[s.id].html);
    h += '<details class="alg"' + (algOpen ? " open" : "") + "><summary>Check it with algebra</summary><div class=\"alg-lines\">" + s.alg.map(function(l){ return "<span>" + l + "</span>"; }).join("") + "</div></details>";
    if (s.id === "s1") h += tiltHTML(x);
    if (isDone(s)) h += '<p class="pq-done"><strong>✓ Station ' + (i + 1) + " complete.</strong> " + (ST.every(isDone) ? "All three stations done. Try the quick check below." : "Choose another station above.") + "</p>";
    h += "</div></div>";
    MV.keepFocus(body, function(){ body.innerHTML = h; });
    fresh = null;
  }
  repaint.paths = function(){ if (!galt) paint(); };

  // --- stations 1 and 2: label the grid ---
  function gridCol(s, x){
    var block = s.id === "s2" ? BLOCK : null, val = GL.count(GRID.R, GRID.U, block), o = { R:GRID.R, U:GRID.U, block:block, given:{}, solved:{}, open:{}, bad:x.bad, fresh:fresh };
    for (var gx = 0; gx <= GRID.R; gx++) for (var gy = 0; gy <= GRID.U; gy++) {
      var k = gx + "," + gy;
      if (!gx || !gy) o.given[k] = val[k]; else if (x.ok[k]) o.solved[k] = val[k]; else o.open[k] = x.v[k] == null ? "" : String(x.v[k]);
    }
    o.aria = "Street grid from A to B, 4 blocks right and 3 blocks up" + (block ? ", with the corner (2, 1) closed" : "") + ". The left and bottom edges are labelled 1. " + Object.keys(o.solved).length + " of 12 inside corners labelled.";
    return GL.html(o) + '<div class="q-actions"><button type="button" class="btn ghost sm" data-pa="one" data-k="pqone"' + (isDone(s) ? " disabled" : "") + '>Fill one for me</button>' +
      '<button type="button" class="btn ghost sm" data-pa="clear" data-k="pqclear"' + (Object.keys(x.ok).length || Object.keys(x.v).length ? "" : " disabled") + ">Clear my labels</button></div>" +
      '<p class="tiny muted">Type a number in a box and press Enter (or Tab to the next box). A corner is the sum of the corner to its left and the corner below it.</p>';
  }
  function gridInfo(s, x){
    var n = innerKeys().filter(function(k){ return x.ok[k]; }).length, h = '<p class="tiny">Corners labelled: <strong>' + n + "</strong> of 12.</p>";
    if (x.ok["4,3"]) h += "<p>B: <strong>" + (s.id === "s1" ? "35" : "17") + "</strong> routes" + (s.id === "s1" ? ", the same as " + M("{7!}/{4! 3!}") + "." : " avoid the closed corner: 35 − 18.") + "</p>";
    return h;
  }
  function tiltHTML(x){
    var hw = host.clientWidth || 600, w = hw > 760 ? Math.min(430, Math.round(hw * 0.42)) : Math.min(430, hw - 8);
    var lab = "Pascal’s triangle, rows 0 to 7, with the grid laid on it: corner (x, y) is row x + y, position y. Labelled corners show their route counts; the rest show question marks.";
    return '<div class="pt-tilt"><h4 class="pq-h">The grid, tilted 45°, on the triangle</h4><div class="pt-box pt-tbox">' + PT.html({ rows:7, width:w - 4, interactive:false, label:lab,
      cls:function(n, r){ var gx = n - r, gy = r; if (gx > GRID.R || gy > GRID.U) return "pt-dim"; return known(x, gx + "," + gy) ? "pt-hs" : "pt-q"; },
      val:function(n, r){ var gx = n - r, gy = r; return gx <= GRID.R && gy <= GRID.U && !known(x, gx + "," + gy) ? "?" : null; } }) +
      '</div><p class="tiny">Corner (x, y) lands on row x + y, position y, so B = (4, 3) sits on row 7, position 3: ' + M("C(7, 3) = 35") + ".</p></div>";
  }
  function judge(s, k){
    var x = sst(s.id), block = s.id === "s2" ? BLOCK : null, val = GL.count(GRID.R, GRID.U, block), raw = String(x.v[k] == null ? "" : x.v[k]).trim();
    var p = k.split(","), gx = +p[0], gy = +p[1], L = (gx - 1) + "," + gy, D = gx + "," + (gy - 1), isB = !!block && gx === block[0] && gy === block[1], where = "(" + gx + ", " + gy + ")";
    if (!raw) return false;
    if (!/^\d+$/.test(raw)) { x.bad[k] = 1; setMsg(s.id, "bad", "<strong>✗ Not quite.</strong> Type a whole number for corner " + where + "."); return false; }
    var t = +raw, want = val[k], bk = block ? block.join(",") : "";
    if (t === want) {
      x.ok[k] = 1; delete x.bad[k]; delete x.v[k]; fresh = k;
      var why = isB ? "closed for construction: no route can pass through it, so it gets 0." : want + " = " + val[L] + " (left) + " + val[D] + " (below)" + (L === bk || D === bk ? ": the closed corner adds 0" : "") + ".";
      if (k === "4,3") why += s.id === "s1" ? " B shows 35, the same as " + M("{7!}/{4! 3!} = C(7, 3)") + "." : " B shows 17 = 35 − 18: the routes that avoid the closed corner.";
      setMsg(s.id, "good", "<strong>✓ " + where + ":</strong> " + why + (isDone(s) ? " Every corner is labelled." : ""));
      return true;
    }
    x.bad[k] = 1;
    var m;
    if (isB) m = "Corner " + where + " is closed for construction: no route can pass through it, so it gets 0.";
    else if (!known(x, L) || !known(x, D)) m = "Label the corner to the left of " + where + " and the corner below it first.";
    else if (block && t === GL.count(GRID.R, GRID.U, null)[k]) m = "That’s the count with the corner open. Redo the sum: the closed corner counts 0.";
    else if (s.id === "s2" && k === "4,3" && t === 18) m = "18 routes go <strong>through</strong> the closed corner. B counts the routes that avoid it.";
    else if (s.id === "s2" && k === "4,3" && t === 26) m = "35 − (3 + 6) adds the routes in and out. Routes through a point: (routes to it) × (routes from it).";
    else if (val[L] > 1 && val[D] > 1 && t === val[L] * val[D]) m = "Corners add, they don’t multiply: every route arrives from the left <strong>or</strong> from below.";
    else m = where + ": not " + t + ". Each corner is the sum of the corner to its left and the corner below it.";
    setMsg(s.id, "bad", "<strong>✗ Not quite.</strong> " + m);
    return false;
  }
  function submit(k, viaEnter){
    var s = cur(); if (s.id === "s3") return;
    var ok = judge(s, k); api.save(); paint(); MV.changed();
    if (ok && viaEnter) { var x = sst(s.id), nk = innerKeys().filter(function(q){ return !x.ok[q]; })[0]; var f = nk ? host.querySelector('[data-gk="' + nk + '"]') : null; if (f) f.focus(); }
  }
  function fillOne(){
    var s = cur(), x = sst(s.id), block = s.id === "s2" ? BLOCK : null, val = GL.count(GRID.R, GRID.U, block);
    var k = innerKeys().filter(function(q){ if (x.ok[q]) return false; var p = q.split(","); return known(x, (p[0] - 1) + "," + p[1]) && known(x, p[0] + "," + (p[1] - 1)); })[0];
    if (!k) return;
    var p = k.split(","), isB = block && +p[0] === block[0] && +p[1] === block[1];
    x.ok[k] = 1; delete x.bad[k]; delete x.v[k]; fresh = k;
    setMsg(s.id, "", "(" + p[0] + ", " + p[1] + "): " + (isB ? "closed, so 0." : val[k] + " = " + val[(p[0] - 1) + "," + p[1]] + " (left) + " + val[p[0] + "," + (p[1] - 1)] + " (below)."));
    api.save(); paint(); MV.changed();
  }

  // --- station 3: the Galton board ---
  function galtonCol(x){
    var busy = !!galt;
    return '<div class="gb">' + GB.svg({ bins:x.bins, show:x.show }) + "</div>" +
      '<div class="q-actions"><button type="button" class="btn sm" data-pa="g1" data-k="pqg1"' + (busy ? " disabled" : "") + '>Drop 1 ball</button><button type="button" class="btn sm" data-pa="g64" data-k="pqg64"' + (busy ? " disabled" : "") + ">Drop 64 balls</button>" +
      '<button type="button" class="btn primary sm" data-pa="gall" data-k="pqgall"' + (busy ? " disabled" : "") + ">Every route once</button>" +
      '<button type="button" class="btn ghost sm" data-pa="gclr" data-k="pqgclr"' + (busy || !x.n ? " disabled" : "") + ">Empty the bins</button></div>" +
      '<div class="q-actions"><button type="button" class="chip pq-chip" data-pa="gshow" data-k="pqgshow" aria-pressed="' + x.show + '">Show route counts</button></div>';
  }
  function galtonInfo(x){
    var last = x.last ? '<span class="pq-rw">' + x.last + "</span>: " + GB.binOf(x.last) + " right bounce" + (GB.binOf(x.last) === 1 ? "" : "s") + " → bin " + GB.binOf(x.last) : '<span class="muted">none yet</span>';
    return '<dl class="read pq-read">' + MV.readoutHTML([
      ["Balls in the bins", "<strong>" + x.n + "</strong>"],
      ["Bin counts (bins 0 to 6)", x.bins.join(", ")],
      ["Routes into each bin", "1, 6, 15, 20, 15, 6, 1 " + '<span class="muted">(' + M("C(6, k)") + "), out of " + M("2^6 = 64") + "</span>"],
      ["Last ball", last]]) + "</dl>";
  }
  function stopG(){
    if (!galt) return;
    var g = galt; galt = null;
    if (g.cancel) g.cancel();
    g.list.forEach(function(w, b){ if (!g.inBin[b]) { g.x.bins[GB.binOf(w)]++; g.x.n++; } });
    g.x.last = g.list[g.list.length - 1]; if (g.every) g.x.done = true;
    api.save();
  }
  function drop(list, every){
    stopG();
    var x = sst("s3"); x.drops++;
    galt = { list:list, inBin:list.map(function(){ return false; }), every:every, x:x, cancel:null };
    setMsg("s3", "", list.length === 1 ? "Watch the ball bounce …" : "Watch the balls fall …");
    paint();
    var g = galt, layer = $(".gb-balls", host), bars = $(".gb-bars", host), els = [], paths = list.map(GB.path);
    var per = list.length === 1 ? 0 : 70, fall = list.length === 1 ? 1600 : 1000, dur = per * (list.length - 1) + fall;
    list.forEach(function(){ var c = document.createElementNS(NS, "circle"); c.setAttribute("r", "5"); c.setAttribute("class", "gb-ball"); c.style.display = "none"; if (layer) layer.appendChild(c); els.push(c); });
    g.cancel = MV.tween({ dur:dur, ease:function(t){ return t; }, step:function(t){
      if (galt !== g) return;
      var ms = t * dur, changed = false;
      for (var b = 0; b < list.length; b++) {
        var u = (ms - b * per) / fall;
        if (u < 0) continue;
        if (u >= 1) { if (!g.inBin[b]) { g.inBin[b] = true; els[b].style.display = "none"; x.bins[GB.binOf(list[b])]++; x.n++; changed = true; } continue; }
        var q = GB.at(paths[b], u); els[b].style.display = ""; els[b].setAttribute("cx", q[0].toFixed(1)); els[b].setAttribute("cy", q[1].toFixed(1));
      }
      if (changed) GB.bars(bars, x.bins, x.show);
    }, done:function(){
      if (galt !== g) return;
      galt = null; x.last = list[list.length - 1];
      if (every) { x.done = true; setMsg("s3", "good", "<strong>✓ Every one of the 64 routes, once:</strong> the bins hold " + x.bins.join(", ") + ". That’s row 6 of Pascal’s triangle: " + M("C(6, k)") + " routes end in bin " + M("k") + "."); }
      else if (list.length === 1) setMsg("s3", "", "<strong>" + list[0] + "</strong>: " + GB.binOf(list[0]) + " right bounce" + (GB.binOf(list[0]) === 1 ? "" : "s") + ", so the ball lands in bin " + GB.binOf(list[0]) + ".");
      else { setMsg("s3", "", "64 random balls: " + list.reduce(function(a, w){ a[GB.binOf(w)]++; return a; }, [0, 0, 0, 0, 0, 0, 0]).join(", ") + ". Close to 1 : 6 : 15 : 20 : 15 : 6 : 1, but chance makes the counts wobble. Press <strong>Every route once</strong> to see the exact pattern."); if (x.n >= 64) x.done = true; }
      api.save(); paint(); MV.changed();
    } });
  }

  // --- events ---
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !$("#pq-body", host).contains(b)) return;
    var a = b.dataset.pa; if (!a) return;
    var s = cur(), x = sst(s.id);
    if (a === "one") { fillOne(); return; }
    if (a === "clear") { x.ok = {}; x.v = {}; x.bad = {}; msg[s.id] = null; api.save(); paint(); MV.changed(); return; }
    if (a === "g1") { drop(GB.random(1, MV.mdm.seededRandom("mdm4u-13-galton-" + x.drops)), false); return; }
    if (a === "g64") { drop(GB.random(64, MV.mdm.seededRandom("mdm4u-13-galton-" + x.drops)), false); return; }
    if (a === "gall") { x.bins = [0, 0, 0, 0, 0, 0, 0]; x.n = 0; drop(MV.shuffle(GB.every(), "mdm4u-13-every"), true); return; }
    if (a === "gclr") { x.bins = [0, 0, 0, 0, 0, 0, 0]; x.n = 0; x.last = ""; msg.s3 = null; api.save(); paint(); return; }
    if (a === "gshow") { x.show = !x.show; api.save(); if (galt) { var sv = $(".gb-svg", host); b.setAttribute("aria-pressed", String(x.show)); GB.bars($(".gb-bars", host), x.bins, x.show); if (sv) sv.querySelectorAll(".gb-pc, .gb-bc").forEach(function(t){ t.style.display = x.show ? "" : "none"; }); } else paint(); }
  });
  host.addEventListener("input", function(e){
    var k = e.target.dataset && e.target.dataset.gk; if (!k) return;
    var x = sst(cur().id); x.v[k] = e.target.value;
    if (x.bad[k]) { delete x.bad[k]; e.target.classList.remove("bad"); }
    api.save();
  });
  host.addEventListener("keydown", function(e){ var k = e.target.dataset && e.target.dataset.gk; if (!k || e.key !== "Enter") return; e.preventDefault(); submit(k, true); });
  host.addEventListener("change", function(e){ var k = e.target.dataset && e.target.dataset.gk; if (!k || !e.target.isConnected) return; submit(k, false); });
  paint();
  return {};
}

// ---------- Performance task: Hockey stick hunt (diagonal k, length L) ----------
var task = (function(){
  var api = null;
  function st(){ var s = api ? api.S : {}; s.k = clampInt(s.k, 1, 5, 2); s.L = clampInt(s.L, 2, 8, 3); return s; }
  function read(){ var s = st(); return { k:s.k, L:s.L }; }
  function vals(d){ var out = []; for (var i = 0; i < d.L; i++) out.push(C(d.k + i, d.k)); return out; }
  function sum(d){ return C(d.k + d.L, d.k + 1); }
  function stepper(id, lab, v, lo, hi){
    return '<div class="pt-stp" role="group" aria-label="' + MV.esc(MV.plain(lab)) + '"><span class="pt-stl">' + lab + '</span><button type="button" class="btn ghost sm pt-stb" data-tk="' + id + '" data-d="-1" data-k="hh' + id + 'm" aria-label="' + MV.esc(MV.plain(lab)) + ': less"' + (v <= lo ? " disabled" : "") + ">−</button>" +
      '<output class="pt-sto" aria-live="polite">' + v + '</output><button type="button" class="btn ghost sm pt-stb" data-tk="' + id + '" data-d="1" data-k="hh' + id + 'p" aria-label="' + MV.esc(MV.plain(lab)) + ': more"' + (v >= hi ? " disabled" : "") + ">+</button></div>";
  }
  function keyTxt(key, html){
    var p = key.split(","), d = { k:+p[0], L:+p[1] };
    return (html ? "(" + M("k") + ", " + M("L") + ") = " : "(k, L) = ") + "(" + d.k + ", " + d.L + "): " + vals(d).join(" + ") + " = " + sum(d);
  }
  function paint(){
    var d = read(), inp = $("#hh-in"), pvh = $("#hh-pv"); if (!inp || !pvh) return;
    MV.keepFocus(inp, function(){
      inp.innerHTML = stepper("k", "Diagonal " + M("k"), d.k, 1, 5) + stepper("L", "Length " + M("L"), d.L, 2, 8) +
        '<p class="tiny muted">Diagonal ' + M("k") + " starts at the 1 " + M("C(k, k)") + " and runs down-left: diagonal 1 is 1, 2, 3, …, diagonal 2 is 1, 3, 6, …</p>";
    });
    var rows = Math.max(8, d.k + d.L), w = pvh.clientWidth || 420, bl = [d.k + d.L, d.k + 1], s = sum(d), v = vals(d);
    pvh.innerHTML = '<div class="pt-box pt-tbox">' + PT.html({ rows:rows, width:w - 8, interactive:false,
        label:"Pascal’s triangle, rows 0 to " + rows + ". Shaded: the stick " + v.join(", ") + " on diagonal " + d.k + ". Outlined: the blade C(" + bl[0] + ", " + bl[1] + ") = " + s + ".",
        cls:function(n, r){ if (n === bl[0] && r === bl[1]) return "pt-bl"; return r === d.k && n >= d.k && n < d.k + d.L ? "pt-hs" : ""; } }) + "</div>" +
      '<dl class="read">' + MV.readoutHTML([
        ["Stick", cTxt(d.k, d.k) + " to " + cTxt(d.k + d.L - 1, d.k) + " (" + d.L + " cells)"],
        ["Added up", v.join(" + ") + " = " + s],
        ["Blade", cTxt(bl[0], bl[1]) + " = <strong>" + s + '</strong> <span class="muted">(one row below the last cell, one step over)</span>']]) + "</dl>";
  }
  return {
    render:function(inp, pvh, a){
      api = a; st();
      inp.innerHTML = '<div id="hh-in" class="hh-in"></div>'; pvh.innerHTML = '<div id="hh-pv" class="hh-pv"></div>';
      $("#hh-in").addEventListener("click", function(e){
        var b = e.target.closest("button[data-tk]"); if (!b || b.disabled) return;
        var s = st(), id = b.dataset.tk; s[id] += +b.dataset.d; st(); api.save(); paint(); api.update();
      });
      paint();
      repaint["final-check"] = paint;
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var s = sum(d); return [s >= 30 && s <= 80, s % 2 === 0, d.k >= 2]; },
    key:function(d){ return d.k + "," + d.L; },
    label:function(k){ return keyTxt(k, true); },
    text:function(k){ return keyTxt(k, false); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task,
  onShow:function(v){ if (repaint[v]) MV.wait(30, repaint[v]); }
});
})();
