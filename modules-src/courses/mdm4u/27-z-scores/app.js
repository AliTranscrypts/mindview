// MDM4U 27 Standardizing & z-Scores: hero (heights and test marks morph into N(0, 1); 182 cm and 83 land at z = 1.5),
// z-converter (Explore: D8 normal curve on a raw axis with an aligned z axis; Left / Right / Between / Inverse / Compare;
// D8 z-table dialog), Percentiles and positions (Part 3: three stations with a D9 model data set), number entry practice
// (N4 zEntry), Grade boundaries task. Every area is a 4-decimal table value at a 2-decimal z, as students would read it.
(function(){
"use strict";
var $ = MV.$, css = MV.css;
function M(s){ return MV.m(s); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? clamp(v, lo, hi) : def; }
function obj(o){ return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }
function mi(s){ return String(s).replace(/-/g, MV.MINUS); }
function r2(v){ return Math.round(v * 100) / 100 + 0; }
// a number with up to dp decimals (zeros trimmed), true minus
function dN(v, dp){ dp = dp == null ? 2 : dp; var p = Math.pow(10, dp), s = (Math.round(v * p) / p).toFixed(dp).replace(/\.?0+$/, ""); if (s === "-0" || s === "") s = "0"; return mi(s); }
function z2(v){ var s = r2(v).toFixed(2); if (s === "-0.00") s = "0.00"; return mi(s); }
function a4(v){ return v.toFixed(4); }
function ord(n){ var s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
function pctTxt(L){ var n = Math.floor(L * 100 + 1e-9); return n < 1 ? "below the 1st percentile" : ord(n) + " percentile"; }
function swHTML(id, lab, on){ return '<button type="button" class="cc-switch zc-sw" role="switch" id="' + id + '" data-k="' + id + '" aria-checked="' + !!on + '"><span class="cc-track" aria-hidden="true"><span class="cc-knob"></span></span>' + lab + "</button>"; }
function readNum(raw){ var s = String(raw == null ? "" : raw).replace(/[%$\s  ]/g, "").replace(/(cm|mL|ml|g|h|ms)$/i, ""); if (!s) return null; var r = MV.parseNum(s); return r && r.length === 1 && isFinite(r[0]) ? r[0] : null; }

// @component D8 zTable — standard normal table (course plan D8): left areas for z from −3.49 to 3.49 at 2 decimals, rounded
// to 4 decimals (erf by its Taylor series, exact to ~1e−14 here). ZT.left(z) rounds z to 2 decimals first, as students do;
// ZT.inv(area) returns the nearest table z (ties toward the smaller |z|); ZT.cell(z) -> {row label, col, neg}.
// The full table (sticky row/column heads; the row and column of z highlighted) opens inline;
// ZT.excerpt(z, flash) is a 3-column strip of the row for readouts. Any button with class "zt-open" opens the table
// (ZPanel, below; data-z highlights a z).
var ZT = (function(){
  function erf(x){ var x2 = x * x, term = x, sum = x; for (var n = 1; n < 200; n++) { term *= -x2 / n; var add = term / (2 * n + 1); sum += add; if (Math.abs(add) < 1e-17) break; } return 2 / Math.sqrt(Math.PI) * sum; }
  var T = [];
  for (var k = -349; k <= 349; k++) T.push(Math.round(0.5 * (1 + erf(k / 100 / Math.SQRT2)) * 10000) / 10000);
  function kOf(z){ return clamp(Math.round(z * 100), -349, 349); }
  function left(z){ return T[kOf(z) + 349]; }
  function inv(a){ var best = 0, bd = Infinity; for (var k = -349; k <= 349; k++) { var d = Math.abs(T[k + 349] - a); if (d < bd - 1e-12 || (Math.abs(d - bd) <= 1e-12 && Math.abs(k) < Math.abs(best))) { bd = d; best = k; } } return best / 100; }
  function cell(z){ var k = kOf(z), a = Math.abs(k), row = Math.floor(a / 10); return { neg:k < 0, row:row, col:a % 10, lab:(k < 0 ? MV.MINUS : "") + (row / 10).toFixed(1) }; }
  function val(neg, row, col){ var k = row * 10 + col; return T[(neg ? -k : k) + 349]; }
  function excerpt(z, flash){
    var c = cell(z), cols = c.col <= 0 ? [0, 1, 2] : c.col >= 9 ? [7, 8, 9] : [c.col - 1, c.col, c.col + 1];
    return '<table class="zt zt-mini" aria-label="Table row ' + c.lab + '"><tr><th scope="col">' + M("z") + "</th>" + cols.map(function(q){ return '<th scope="col"' + (q === c.col ? ' class="zt-hc"' : "") + ">0.0" + q + "</th>"; }).join("") + "</tr>" +
      '<tr><th scope="row" class="zt-hr">' + c.lab + "</th>" + cols.map(function(q){ return "<td" + (q === c.col ? ' class="zt-hot' + (flash ? " zt-flash" : "") + '"' : "") + ">" + a4(val(c.neg, c.row, q)) + "</td>"; }).join("") + "</tr></table>";
  }
  return { left:left, inv:inv, cell:cell, val:val, excerpt:excerpt };
})();
// The table opens as an inline panel under the button that asked for it (a modal dialog would make the rest of the page
// inert); one panel at a time; the same button closes it. ZPanel.refresh(owner, z) re-highlights an open panel.
var ZPanel = (function(){
  var el = null, owner = null;
  function tableHTML(z){
    var c = z == null ? null : ZT.cell(z), rows = [], r, q;
    for (r = 34; r >= 0; r--) rows.push({ neg:true, row:r });
    for (r = 0; r <= 34; r++) rows.push({ neg:false, row:r });
    var h = '<table class="zt zt-full"><thead><tr><th scope="col">' + M("z") + "</th>";
    for (q = 0; q < 10; q++) h += '<th scope="col"' + (c && c.col === q ? ' class="zt-hc"' : "") + ">0.0" + q + "</th>";
    h += "</tr></thead><tbody>";
    rows.forEach(function(R){
      var hitRow = !!c && c.neg === R.neg && c.row === R.row;
      h += "<tr" + (hitRow ? ' class="zt-hrow"' : "") + '><th scope="row"' + (hitRow ? ' class="zt-hr"' : "") + ">" + (R.neg ? MV.MINUS : "") + (R.row / 10).toFixed(1) + "</th>";
      for (q = 0; q < 10; q++) h += "<td" + (hitRow && c.col === q ? ' class="zt-hot"' : c && c.col === q ? ' class="zt-hc"' : "") + ">" + a4(ZT.val(R.neg, R.row, q)) + "</td>";
      h += "</tr>";
    });
    return h + "</tbody></table>";
  }
  function fill(z){
    el.innerHTML = '<div class="zt-head"><p class="zt-ttl"><strong>Standard normal table:</strong> area to the <strong>left</strong> of ' + M("z") + '</p><button type="button" class="btn ghost sm" data-zt-close data-k="zt-close">Close the table</button></div>' +
      '<p class="tiny muted zt-note">Row: ' + M("z") + " to one decimal. Column: the second decimal. For a negative " + M("z") + ", use the negative row: " + M("z = -1.53") + " is row −1.5, column 0.03." + (z != null ? " Highlighted: " + M("z = " + z2(z)) + "." : "") + "</p>" +
      '<div class="zt-scroll" tabindex="0" role="region" aria-label="Standard normal table, left areas. Use the arrow keys to scroll.">' + tableHTML(z) + "</div>";
    var hot = el.querySelector(".zt-hot"), sc = el.querySelector(".zt-scroll");
    if (hot && sc) sc.scrollTop = Math.max(0, hot.offsetTop - sc.clientHeight / 2);
  }
  function close(){ if (el) { el.remove(); el = null; } if (owner) { owner.setAttribute("aria-expanded", "false"); var o = owner; owner = null; if (document.activeElement === document.body || !document.activeElement) o.focus({ preventScroll:true }); } }
  function open(btn, z){
    if (owner === btn) { close(); return; }
    close();
    var anchor = btn.closest("p, .how, .zc-tools, li") || btn;
    el = document.createElement("div"); el.className = "zt-panel"; el.setAttribute("role", "region"); el.setAttribute("aria-label", "Standard normal table");
    anchor.parentNode.insertBefore(el, anchor.nextSibling);
    owner = btn; btn.setAttribute("aria-expanded", "true");
    fill(z);
    el.addEventListener("click", function(e){ if (e.target.closest("[data-zt-close]")) { var o = owner; close(); if (o) o.focus({ preventScroll:true }); } });
  }
  function refresh(btn, z){ if (el && owner === btn) fill(z); }
  return { open:open, close:close, refresh:refresh };
})();
document.addEventListener("click", function(e){ var b = e.target.closest && e.target.closest(".zt-open"); if (b && !b.disabled) ZPanel.open(b, b.dataset.z != null && b.dataset.z !== "" ? +b.dataset.z : null); });

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

// ---------- presets (model data) ----------
var PRE = {
  heights:{ t:"Heights", mu:170, sg:8, x:182, unit:"cm", noun:"Height", nouns:"heights", axis:"height (cm)" },
  marks:{ t:"Test marks", mu:65, sg:12, x:83, unit:"", noun:"Mark", nouns:"marks", axis:"test mark" },
  react:{ t:"Reaction times", mu:250, sg:20, x:290, unit:"ms", noun:"Reaction time", nouns:"reaction times", axis:"reaction time (ms)" },
  bags:{ t:"Bag masses", mu:500, sg:4, x:500, unit:"g", noun:"Bag mass", nouns:"bags", axis:"bag mass (g)" },
  math:{ t:"Math class", mu:70, sg:5, x:78, unit:"", noun:"Math mark", nouns:"math marks", axis:"math mark", cmp:true },
  eng:{ t:"English class", mu:75, sg:8, x:85, unit:"", noun:"English mark", nouns:"English marks", axis:"English mark", cmp:true }
};
var MAIN = ["heights", "marks", "react", "bags"], CMP = ["heights", "marks", "react", "bags", "math", "eng"];
var GEN = { noun:"Value", nouns:"values", unit:"", axis:"x" };
var MODES = [{ id:"left", t:"Left" }, { id:"right", t:"Right" }, { id:"between", t:"Between" }, { id:"inverse", t:"Inverse" }, { id:"compare", t:"Compare" }];
function withU(p, x){ return dN(x, 2) + (p.unit ? " " + p.unit : ""); }
function parseInv(raw){
  var s = String(raw == null ? "" : raw).trim(), pc = /%/.test(s), v = readNum(s);
  if (v == null) return null;
  if (pc || v >= 1) { if (v < 1 || v > 99) return null; return { area:v / 100, pct:v, txt:Number.isInteger(v) ? ord(v) + " percentile" : dN(v, 2) + "% below" }; }
  if (v <= 0) return null;
  return { area:v, txt:"area " + v + " to the left" };
}

// ---------- Explore: z-converter ----------
function explore(host, api){
  var S = api.S, pv = {}, anim = null, flashZ = null;
  function sanitize(){
    if (!MODES.some(function(m){ return m.id === S.mode; })) S.mode = "left";
    if (S.mu == null || !isFinite(+S.mu)) { var p = PRE.heights; S.pre = "heights"; S.mu = p.mu; S.sg = p.sg; S.vs = p.sg; S.x = p.x; S.x2 = p.mu - p.sg; }
    S.mu = clampI(S.mu, 0, 600, 170); S.sg = clampI(S.sg, 1, 40, 8);
    S.vs = clamp(+S.vs || S.sg, 1, 40); if (S.vs < S.sg) S.vs = S.sg;
    if (MAIN.indexOf(S.pre) < 0) S.pre = "";
    var lo = S.mu - 4 * S.vs, hi = S.mu + 4 * S.vs;
    S.x = isFinite(+S.x) ? clamp(r2(+S.x), lo, hi) : S.mu; S.x2 = isFinite(+S.x2) ? clamp(r2(+S.x2), lo, hi) : S.mu - S.sg;
    if (typeof S.inv !== "string") S.inv = "90";
    S.rule = !!S.rule;
    if (CMP.indexOf(S.ca) < 0) S.ca = "heights"; if (CMP.indexOf(S.cb) < 0) S.cb = "marks";
    [["ca", "xa"], ["cb", "xb"]].forEach(function(k){ var p = PRE[S[k[0]]]; S[k[1]] = isFinite(+S[k[1]]) ? clamp(r2(+S[k[1]]), p.mu - 3.49 * p.sg, p.mu + 3.49 * p.sg) : p.x; });
  }
  sanitize();
  function pre(){ return S.pre ? PRE[S.pre] : GEN; }
  function zOf(x, mu, sg){ return r2((x - (mu == null ? S.mu : mu)) / (sg == null ? S.sg : sg)); }
  function save(){ api.save(); }

  host.innerHTML =
    '<div class="pg zc-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap zc-cap" id="zc-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="plot-wrap"><canvas class="plot zc-plot" id="zc-plot" role="img" aria-label="Normal curve with a raw axis and an aligned z axis"></canvas></div><p class="zc-aha" id="zc-aha"></p></div>' +
    '<div class="pg-ctrl"><div id="zc-mode"></div>' +
      '<div class="zc-panel" id="zc-dist"><p class="zc-sh">Distribution <span class="mdm-model">model data</span></p><div id="zc-pre"></div>' +
        '<div class="zc-sl"><label class="slider"><span class="slider-top"><span><span class="zc-mu">μ</span> (mean)</span><output id="zc-mu-o"></output></span><input type="range" id="zc-mu" class="zc-rmu" min="0" max="600" step="1"></label>' +
          '<span class="zc-pm"><button type="button" class="btn ghost sm zc-stb" data-step="mu|-1" data-k="zcmum" aria-label="Mean down 1">−</button><button type="button" class="btn ghost sm zc-stb" data-step="mu|1" data-k="zcmup" aria-label="Mean up 1">+</button></span></div>' +
        '<div class="zc-sl"><label class="slider"><span class="slider-top"><span><span class="zc-sg">σ</span> (standard deviation)</span><output id="zc-sg-o"></output></span><input type="range" id="zc-sg" class="zc-rsg" min="1" max="40" step="1"></label>' +
          '<span class="zc-pm"><button type="button" class="btn ghost sm zc-stb" data-step="sg|-1" data-k="zcsgm" aria-label="Standard deviation down 1">−</button><button type="button" class="btn ghost sm zc-stb" data-step="sg|1" data-k="zcsgp" aria-label="Standard deviation up 1">+</button></span></div></div>' +
      '<div class="zc-panel" id="zc-val"><p class="zc-sh">Value</p><div class="numrow"><label for="zc-x" id="zc-xl">' + M("x") + " =</label>" + '<input class="numin zc-in" id="zc-x" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" data-k="zcx"></div>' +
        '<div class="numrow" id="zc-x2r"><label for="zc-x2">second value =</label><input class="numin zc-in" id="zc-x2" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" data-k="zcx2"></div>' +
        '<p class="tiny muted zc-how">Drag the marker along the raw scale, use the arrow keys on it (0.5; Shift: 5), or type a value.</p></div>' +
      '<div class="zc-panel" id="zc-invp"><p class="zc-sh">Work backwards</p><div class="numrow"><label for="zc-inv">Percentile (1 to 99) or area:</label><input class="numin zc-in" id="zc-inv" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" data-k="zcinv"></div>' +
        '<p class="tiny muted">Type 90 for the 90th percentile, or 0.9 for an area of 0.9. The tool finds the nearest table ' + M("z") + ', then ' + M("x = μ + zσ") + '.</p><p class="tiny zc-msg" id="zc-invmsg" aria-live="polite"></p></div>' +
      '<div class="zc-panel" id="zc-cmpp"><p class="zc-sh">Compare two values</p><div id="zc-ca"></div><div class="numrow"><label for="zc-xa"><span class="ev-a">A</span>: ' + M("x") + ' =</label><input class="numin zc-in" id="zc-xa" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" data-k="zcxa"></div>' +
        '<div id="zc-cb"></div><div class="numrow"><label for="zc-xb"><span class="ev-c">B</span>: ' + M("x") + ' =</label><input class="numin zc-in" id="zc-xb" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" data-k="zcxb"></div></div>' +
      '<div class="zc-tools">' + swHTML("zc-rule", "68–95–99.7 rule", S.rule) + '<button type="button" class="btn ghost sm zt-open" id="zc-tbl" aria-expanded="false" data-k="zc-table">Table</button></div></div>' +
    '<div class="pg-read"><dl class="read" id="zc-read" aria-live="polite"></dl></div></div>';
  var plot = new MV.Plot($("#zc-plot", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  plot.render = paintChart;
  var modeR = radios($("#zc-mode", host), { label:"Mode", options:MODES, value:S.mode, cls:"seg",
    onChange:function(v){ user(); S.mode = v; if (v === "between" && Math.abs(S.x2 - S.x) < 1e-9) S.x2 = r2(S.mu - S.sg); save(); render(); MV.changed(); } });
  var preR = radios($("#zc-pre", host), { label:"Preset", options:MAIN.map(function(k){ return { id:k, t:PRE[k].t }; }).concat([{ id:"", t:"Your own", aria:"Your own (use the sliders)" }]), value:S.pre, cls:"chips",
    disabled:function(id){ return id === ""; },
    onChange:function(v){ if (!v) return; user(); var p = PRE[v]; S.pre = v; S.mu = p.mu; S.sg = p.sg; S.vs = p.sg; S.x = p.x; S.x2 = p.mu - p.sg; save(); render(); MV.changed(); } });
  function cmpOpts(){ return CMP.map(function(k){ return { id:k, t:PRE[k].t }; }); }
  var caR = radios($("#zc-ca", host), { label:'<span class="ev-a">A</span>', aria:"Distribution A", options:cmpOpts(), value:S.ca, cls:"chips",
    onChange:function(v){ user(); S.ca = v; S.xa = PRE[v].x; save(); render(); MV.changed(); } });
  var cbR = radios($("#zc-cb", host), { label:'<span class="ev-c">B</span>', aria:"Distribution B", options:cmpOpts(), value:S.cb, cls:"chips",
    onChange:function(v){ user(); S.cb = v; S.xb = PRE[v].x; save(); render(); MV.changed(); } });

  // --- animation bookkeeping: any user action finishes the running animation ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], stops:[], fin:fin || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function cancelAnim(){
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} });
    pv = {}; render(); MV.changed();
    if (a.fin) { var f = a.fin; a.fin = null; f(); }
  }
  function endAnim(){ var a = anim; anim = null; pv = {}; render(); MV.changed(); if (a && a.fin) { var f = a.fin; a.fin = null; f(); } }
  function user(){ cancelAnim(); pv = {}; flashZ = null; MV.banner("", ""); }

  function setSg(v){ S.sg = clamp(Math.round(v), 1, 40); if (S.sg > S.vs || S.sg < S.vs / 2.5) S.vs = S.sg; }
  function invState(){ return parseInv(S.inv); }
  function applyInverse(){ if (S.mode !== "inverse") return; var q = invState(); if (!q) return; var z = ZT.inv(q.area); S.x = r2(S.mu + z * S.sg); }
  function clampXs(){ var lo = S.mu - 4 * S.vs, hi = S.mu + 4 * S.vs; S.x = clamp(S.x, lo, hi); S.x2 = clamp(S.x2, lo, hi); }

  // --- painting ---
  function render(){
    sanitize(); applyInverse();
    modeR.set(S.mode); preR.set(S.pre); caR.set(S.ca); cbR.set(S.cb);
    var m = S.mode;
    $("#zc-dist", host).hidden = m === "compare"; $("#zc-val", host).hidden = m === "compare" || m === "inverse"; $("#zc-x2r", host).hidden = m !== "between";
    $("#zc-invp", host).hidden = m !== "inverse"; $("#zc-cmpp", host).hidden = m !== "compare";
    $("#zc-xl", host).innerHTML = m === "between" ? "first value =" : M("x") + " =";
    $("#zc-mu", host).value = S.mu; $("#zc-mu-o", host).textContent = S.mu; $("#zc-mu", host).setAttribute("aria-valuetext", "mean " + S.mu);
    $("#zc-sg", host).value = S.sg; $("#zc-sg-o", host).textContent = S.sg; $("#zc-sg", host).setAttribute("aria-valuetext", "standard deviation " + S.sg);
    [["zc-x", S.x], ["zc-x2", S.x2], ["zc-xa", S.xa], ["zc-xb", S.xb]].forEach(function(q){ var el = $("#" + q[0], host); if (document.activeElement !== el) el.value = mi(dN(q[1], 2)); });
    var iv = $("#zc-inv", host); if (document.activeElement !== iv) iv.value = S.inv;
    $("#zc-invmsg", host).textContent = m === "inverse" && !invState() ? "Enter a percentile from 1 to 99, or an area between 0 and 1." : "";
    $("#zc-rule", host).setAttribute("aria-checked", String(S.rule));
    $("#zc-rule", host).hidden = m === "compare";
    var tb = $("#zc-tbl", host); tb.dataset.z = m === "compare" ? "" : String(zOf(S.mode === "between" ? Math.max(S.x, S.x2) : S.x));
    ZPanel.refresh(tb, tb.dataset.z === "" ? null : +tb.dataset.z);
    paintChart(); paintRead(); paintCap();
  }
  function paintCap(){
    var c = $("#zc-cap", host), hide = pv.hide || pv.hideRead;
    if (S.mode === "compare") { c.innerHTML = M("z_A = " + z2(zOf(S.xa, PRE[S.ca].mu, PRE[S.ca].sg)) + ",  z_B = " + z2(zOf(S.xb, PRE[S.cb].mu, PRE[S.cb].sg))); return; }
    if (S.mode === "between") { var a = Math.min(S.x, S.x2), b = Math.max(S.x, S.x2); c.innerHTML = M("P(" + dN(a) + " < X < " + dN(b) + ")") + (hide ? " = ?" : " = " + a4(ZT.left(zOf(b)) - ZT.left(zOf(a)))); return; }
    var L = ZT.left(zOf(S.x));
    c.innerHTML = M(S.mode === "right" ? "P(X > " + dN(S.x) + ")" : "P(X < " + dN(S.x) + ")") + (hide ? " = ?" : " = " + a4(S.mode === "right" ? 1 - L : L));
  }
  function belowY(px){ var H = plot.c.getBoundingClientRect().height || 300; return -1.22 * px / Math.max(60, H - px); }
  function ticksDraw(ctx, p, list, y, color, font){
    var used = [];
    function free(a, b){ for (var i = 0; i < used.length; i++) if (a < used[i][1] && b > used[i][0]) return false; return true; }
    ctx.font = font || "12px " + p.fontUI; ctx.textAlign = "center"; ctx.textBaseline = "top";
    list.slice().sort(function(a, b){ return (b.w || 0) - (a.w || 0); }).forEach(function(t){
      var w = ctx.measureText(t.t).width, x = clamp(p.X(t.x), w / 2 + 2, p.W - w / 2 - 2); if (!free(x - w / 2 - 4, x + w / 2 + 4)) return; used.push([x - w / 2 - 4, x + w / 2 + 4]);
      ctx.fillStyle = t.c || color; ctx.fillText(t.t, x, y);
    });
  }
  function boxText(ctx, p, txt, x, y, o){
    o = o || {}; ctx.font = (o.font || "700 13px ") + p.fontUI; var w = ctx.measureText(txt).width, cx = clamp(x, w / 2 + 5, p.W - w / 2 - 5);
    ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.92; ctx.fillRect(cx - w / 2 - 4, y - 9, w + 8, 18); ctx.globalAlpha = 1;
    if (o.border) { ctx.strokeStyle = o.border; ctx.lineWidth = 1.5; ctx.strokeRect(cx - w / 2 - 4 + 0.5, y - 9 + 0.5, w + 7, 17); }
    ctx.fillStyle = o.color || css("--ink"); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(txt, cx, y + 0.5);
  }
  function describe(){
    var p = pre(), hide = pv.hide || pv.hideRead;
    if (S.mode === "compare") { var A = PRE[S.ca], B = PRE[S.cb], za = zOf(S.xa, A.mu, A.sg), zb = zOf(S.xb, B.mu, B.sg); return "Standard normal curve with two raw axes and a shared z axis. A: " + A.noun + " " + withU(A, S.xa) + ", z = " + z2(za) + ". B: " + B.noun + " " + withU(B, S.xb) + ", z = " + z2(zb) + "."; }
    var d = "Normal curve N(" + S.mu + ", " + S.sg + " squared) with the raw axis and the z axis aligned below. ";
    if (S.mode === "between") { var a = Math.min(S.x, S.x2), b = Math.max(S.x, S.x2); return d + "Shaded between " + withU(p, a) + " and " + withU(p, b) + (hide ? "; the area is hidden until the reveal." : ": z from " + z2(zOf(a)) + " to " + z2(zOf(b)) + ", " + dN(100 * (ZT.left(zOf(b)) - ZT.left(zOf(a))), 2) + "% of " + p.nouns + " lie between."); }
    var z = zOf(S.x), L = ZT.left(z);
    if (hide) return d + p.noun + " " + withU(p, S.x) + "; the z-score and area are hidden until the reveal.";
    return d + p.noun + " " + withU(p, S.x) + ", z = " + z2(z) + ", " + dN(100 * (S.mode === "right" ? 1 - L : L), 2) + "% of " + p.nouns + " are " + (S.mode === "right" ? "above." : "below.");
  }
  function paintChart(){
    if (S.mode === "compare") { paintCmp(); return; }
    var mu = S.mu, sg = pv.sg || S.sg, vs = S.vs, lo = mu - 4 * vs, hi = mu + 4 * vs, pad = 0.25 * vs, hide = !!pv.hide;
    var bw = S.mode === "between", A = bw ? Math.min(S.x, S.x2) : S.x, B = bw ? Math.max(S.x, S.x2) : null;
    var shade = pv.shade || (S.mode === "right" ? [S.x, hi] : bw ? [A, B] : [lo, S.x]);
    plot.draw({ view:{ xmin:lo - pad, xmax:hi + pad, ymin:belowY(84), ymax:1.22 }, grid:false, axes:false, ticks:false, describe:describe(), after:function(ctx, p){
      var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), soft = css("--hi-soft"), muC = css("--p-d"), sgC = css("--p-k"), N = 260, i, x;
      var f = function(x){ var z = (x - mu) / sg; return Math.exp(-z * z / 2); };
      var y0 = p.Y(0), yz = y0 + 38;
      var s0 = clamp(shade[0], lo, hi), s1 = clamp(shade[1], lo, hi);
      if (s1 > s0) { ctx.beginPath(); ctx.moveTo(p.X(s0), y0); for (i = 0; i <= N; i++) { x = s0 + (s1 - s0) * i / N; ctx.lineTo(p.X(x), p.Y(f(x))); } ctx.lineTo(p.X(s1), y0); ctx.closePath(); ctx.fillStyle = soft; ctx.fill(); }
      ctx.beginPath(); for (i = 0; i <= N; i++) { x = lo + (hi - lo) * i / N; if (i) ctx.lineTo(p.X(x), p.Y(f(x))); else ctx.moveTo(p.X(x), p.Y(f(x))); } ctx.strokeStyle = pen; ctx.lineWidth = 3; ctx.stroke();
      // σ bracket (orange) from μ to μ + σ just above the raw axis
      var bx0 = p.X(mu), bx1 = p.X(mu + sg), by = y0 - 9;
      ctx.strokeStyle = sgC; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx0, by - 4); ctx.lineTo(bx0, by + 4); ctx.moveTo(bx0, by); ctx.lineTo(bx1, by); ctx.moveTo(bx1, by - 4); ctx.lineTo(bx1, by + 4); ctx.stroke();
      ctx.fillStyle = sgC; ctx.font = "700 12px " + p.fontUI; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText("σ = " + dN(sg, 1), (bx0 + bx1) / 2, by - 4);
      // axes
      ctx.strokeStyle = ink; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(p.X(lo), y0 + 0.5); ctx.lineTo(p.X(hi), y0 + 0.5); ctx.stroke();
      ctx.strokeStyle = ink2; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(p.X(lo), yz + 0.5); ctx.lineTo(p.X(hi), yz + 0.5); ctx.stroke();
      var rawT = [], zT = [];
      for (var k = -6; k <= 6; k++) {
        var tx = mu + k * sg; if (tx < lo - 1e-9 || tx > hi + 1e-9) continue;
        ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.X(tx), y0 - 3); ctx.lineTo(p.X(tx), y0 + 4); ctx.stroke();
        ctx.strokeStyle = ink2; ctx.beginPath(); ctx.moveTo(p.X(tx), yz - 3); ctx.lineTo(p.X(tx), yz + 4); ctx.stroke();
        rawT.push({ x:tx, t:mi(dN(tx, 1)), w:k === 0 ? 9 : 4 - Math.abs(k), c:k === 0 ? muC : null });
        if (!hide) zT.push({ x:tx, t:mi(String(k)), w:k === 0 ? 9 : 4 - Math.abs(k) });
      }
      ticksDraw(ctx, p, rawT, y0 + 5, ink, "12px " + p.fontUI);
      ticksDraw(ctx, p, zT, yz + 5, ink2, "12px " + p.fontUI);
      ctx.font = "italic 12px " + p.fontM; ctx.fillStyle = ink2; ctx.textAlign = "left"; ctx.textBaseline = "bottom";
      ctx.fillText((S.pre ? PRE[S.pre].axis : "x") + "  (raw)", 4, y0 - 2 - (p.X(lo) < 60 && f(lo) > 0.3 ? 0 : 0));
      ctx.fillText("z", 4, yz - 2);
      // markers
      var marks = [{ x:S.x, lab:bw ? "a" : "x" }]; if (bw) marks.push({ x:S.x2, lab:"b" });
      if (bw) marks.forEach(function(m){ m.lab = m.x === A ? "a" : "b"; });
      var lastZx = null;
      marks.forEach(function(m, j){
        var mx = p.X(clamp(m.x, lo, hi)), cy = p.Y(f(m.x)), zx = pv.zMark != null && j === 0 ? p.X(mu + pv.zMark * sg) : mx;
        ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mx, cy); ctx.lineTo(mx, y0); ctx.stroke();
        ctx.setLineDash([4, 3]); ctx.strokeStyle = ink2; ctx.beginPath(); ctx.moveTo(mx, y0); ctx.lineTo(zx, yz); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(mx, cy, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(zx, yz, 4.5, 0, Math.PI * 2); ctx.fillStyle = pen; ctx.fill();
        boxText(ctx, p, (bw ? m.lab + " = " : "x = ") + mi(dN(m.x, 2)), mx, Math.max(12, cy - 16));
        var zv = pv.zMark != null && j === 0 ? pv.zMark : (m.x - mu) / sg;
        var zy = yz + 30; if (lastZx != null && Math.abs(lastZx - zx) < 84) zy = yz - 16;
        boxText(ctx, p, hide ? "z = ?" : "z = " + z2(zv), zx, zy, { border:pen, color:ink });
        lastZx = zx;
      });
    } });
  }
  function paintCmp(){
    var A = PRE[S.ca], B = PRE[S.cb], za = (S.xa - A.mu) / A.sg, zb = (S.xb - B.mu) / B.sg;
    plot.draw({ view:{ xmin:-4.25, xmax:4.25, ymin:belowY(132), ymax:1.22 }, grid:false, axes:false, ticks:false, describe:describe(), after:function(ctx, p){
      var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), ca = css("--ev-a"), cb = css("--ev-c"), N = 240, i, x;
      var f = function(z){ return Math.exp(-z * z / 2); };
      var y0 = p.Y(0), y1 = y0 + 38, yz = y0 + 76;
      ctx.beginPath(); for (i = 0; i <= N; i++) { x = -4 + 8 * i / N; if (i) ctx.lineTo(p.X(x), p.Y(f(x))); else ctx.moveTo(p.X(x), p.Y(f(x))); } ctx.strokeStyle = pen; ctx.lineWidth = 3; ctx.stroke();
      [[y0, A, ca], [y1, B, cb], [yz, null, ink2]].forEach(function(q){
        ctx.strokeStyle = q[2]; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(p.X(-4), q[0] + 0.5); ctx.lineTo(p.X(4), q[0] + 0.5); ctx.stroke();
        var T = [];
        for (var k = -3; k <= 3; k++) { ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.X(k), q[0] - 3); ctx.lineTo(p.X(k), q[0] + 4); ctx.stroke(); T.push({ x:k, t:q[1] ? mi(dN(q[1].mu + k * q[1].sg, 1)) : mi(String(k)), w:k === 0 ? 9 : 4 - Math.abs(k) }); }
        ticksDraw(ctx, p, T, q[0] + 5, q[2] === ink2 ? ink2 : ink);
        ctx.font = "italic 12px " + p.fontM; ctx.fillStyle = q[2]; ctx.textAlign = "left"; ctx.textBaseline = "bottom";
        ctx.fillText(q[1] ? (q[1] === A ? "A: " : "B: ") + q[1].axis : "z (shared)", 4, q[0] - 2);
      });
      var last = null;
      [[za, S.xa, ca, "A", y0], [zb, S.xb, cb, "B", y1]].forEach(function(m){
        var mx = p.X(clamp(m[0], -4, 4)), cy = p.Y(f(m[0]));
        ctx.strokeStyle = m[2]; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(mx, cy); ctx.lineTo(mx, yz); ctx.stroke();
        ctx.fillStyle = m[2]; ctx.beginPath(); ctx.arc(mx, m[4], 5, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(mx, yz, 4.5, 0, Math.PI * 2); ctx.fill();
        var ty = Math.max(12, cy - 16); if (last != null && Math.abs(last - mx) < 90) ty = Math.max(12, cy - 36);
        boxText(ctx, p, m[3] + ": " + mi(dN(m[1], 2)) + ", z = " + z2(m[0]), mx, ty, { color:m[2], border:m[2] });
        last = mx;
      });
    } });
  }
  function ruleRow(z){
    var R = { "-3":"0.15%", "-2":"2.5%", "-1":"16%", "0":"50%", "1":"84%", "2":"97.5%", "3":"99.85%" }, L = ZT.left(z);
    if (Math.abs(z - Math.round(z)) < 1e-9 && Math.abs(z) <= 3) return "Rule: about " + R[String(Math.round(z))] + " below " + M("x") + ". Table: " + a4(L) + ".";
    return "<strong>Not a whole number of σ: use the table.</strong> For " + M("z = " + z2(z)) + " the table gives " + a4(L) + ".";
  }
  function paintRead(){
    var rd = $("#zc-read", host), hide = pv.hide || pv.hideRead, Q = '<span class="zc-q">?</span>', rows = [];
    if (S.mode === "compare") {
      var A = PRE[S.ca], B = PRE[S.cb], za = zOf(S.xa, A.mu, A.sg), zb = zOf(S.xb, B.mu, B.sg), La = ZT.left(za), Lb = ZT.left(zb);
      rows.push(['<span class="ev-a">A</span>: ' + A.t, M("X ~ N(" + A.mu + ", " + A.sg + "^2)")]);
      rows.push(['<span class="ev-a">A</span>: ' + M("z"), M("z = (" + dN(S.xa) + " - " + A.mu + ") ÷ " + A.sg + " = " + z2(za)) + " → " + a4(La) + ", the " + pctTxt(La)]);
      rows.push(['<span class="ev-c">B</span>: ' + B.t, M("X ~ N(" + B.mu + ", " + B.sg + "^2)")]);
      rows.push(['<span class="ev-c">B</span>: ' + M("z"), M("z = (" + dN(S.xb) + " - " + B.mu + ") ÷ " + B.sg + " = " + z2(zb)) + " → " + a4(Lb) + ", the " + pctTxt(Lb)]);
      rows.push(["Verdict", Math.abs(za - zb) < 1e-9 ? "Same " + M("z") + ": each is equally far from its own mean, in standard deviations." :
        "<strong>" + (za > zb ? "A" : "B") + "</strong> sits higher in its own group (" + M("z = " + z2(Math.max(za, zb))) + " vs " + z2(Math.min(za, zb)) + ")" + ((za > zb) !== (S.xa > S.xb) ? ", even though its raw value is smaller." : ".")]);
      MV.keepFocus(rd, function(){ rd.innerHTML = MV.readoutHTML(rows); });
      $("#zc-aha", host).innerHTML = "Raw values in different units can’t be compared; " + M("z") + "-scores put both on one scale.";
      return;
    }
    var mu = S.mu, sg = S.sg, p = pre();
    rows.push(["Distribution", M("X ~ N(@d{" + mu + "}, @k{" + sg + "}^2)")]);
    function zLine(x){ var z = zOf(x); return hide ? Q : M("z = (" + dN(x) + " - @d{" + mu + "}) ÷ @k{" + sg + "} = " + z2(z)) + (Math.abs((x - mu) / sg) > 3.49 ? ' <span class="tiny muted">(beyond the table: read 3.49)</span>' : ""); }
    var tblZ;
    if (S.mode === "between") {
      var a = Math.min(S.x, S.x2), b = Math.max(S.x, S.x2), La2 = ZT.left(zOf(a)), Lb2 = ZT.left(zOf(b));
      rows.push(["Values", M("a = " + dN(a) + ",  b = " + dN(b))]);
      rows.push([M("z") + "-scores", zLine(a) + "<br>" + zLine(b)]);
      rows.push(["Table areas (left)", hide ? Q : a4(La2) + " and " + a4(Lb2)]);
      rows.push(["Area between", hide ? Q : "<strong>" + a4(Lb2) + " − " + a4(La2) + " = " + a4(Lb2 - La2) + "</strong>"]);
      rows.push(["Percentiles", hide ? Q : M("a") + ": " + pctTxt(La2) + "; " + M("b") + ": " + pctTxt(Lb2)]);
      tblZ = zOf(b);
    } else {
      var z = zOf(S.x), L = ZT.left(z), q = invState();
      if (S.mode === "inverse") rows.push(["Inverse", q ? (hide ? Q : q.txt + " → " + M("z ≈ " + z2(ZT.inv(q.area))) + " → " + M("x = @d{" + mu + "} + " + z2(ZT.inv(q.area)) + " × @k{" + sg + "} = " + dN(S.x)) ) : '<span class="muted">Enter a percentile or an area.</span>']);
      rows.push(["Value", M("x = " + dN(S.x))]);
      rows.push([M("z") + "-score", zLine(S.x)]);
      rows.push(["Table area (left)", hide ? Q : (S.mode === "left" || S.mode === "inverse" ? "<strong>" + a4(L) + "</strong>" : a4(L))]);
      rows.push(["Area right", hide ? Q : S.mode === "right" ? "<strong>1 − " + a4(L) + " = " + a4(1 - L) + "</strong>" : '<span class="muted">1 − ' + a4(L) + " = " + a4(1 - L) + "</span>"]);
      rows.push(["Percentile", hide ? Q : S.mode === "inverse" && q ? "target: " + q.txt + "; the table area at " + M("z = " + z2(z)) + " is " + a4(L) : pctTxt(L)]);
      tblZ = z;
    }
    if (S.rule && !hide) rows.push(["Rule check", ruleRow(tblZ)]);
    rows.push(["Table lookup", hide ? Q : ZT.excerpt(tblZ, flashZ != null && Math.abs(flashZ - tblZ) < 1e-9)]);
    MV.keepFocus(rd, function(){ rd.innerHTML = MV.readoutHTML(rows); });
    var aha = $("#zc-aha", host);
    aha.innerHTML = hide ? "" : S.mode === "inverse" ? "Backwards: find the area <strong>inside</strong> the table, read its " + M("z") + ", then " + M("x = μ + zσ") + "." :
      S.mode === "between" ? "Between two values: the larger left area minus the smaller one." :
      S.mode === "right" ? "The table gives the area to the left; for ‘more than’, subtract it from 1." : "Standardizing turns every normal question into the same question about " + M("N(0, 1)") + ".";
  }

  // --- drag (raw axis markers; compare mode works in z units) ---
  MV.drag(plot, { axis:"x", step:{ x:0.5, y:0 }, big:10,
    handles:function(){
      if (anim) return [];
      if (S.mode === "compare") { var A = PRE[S.ca], B = PRE[S.cb]; return [{ id:"A", x:clamp((S.xa - A.mu) / A.sg, -4, 4), y:0, label:"Value A, " + A.noun + " " + withU(A, S.xa) + ". Arrow keys move it by 0.5; Shift + arrow by 5." }, { id:"B", x:clamp((S.xb - B.mu) / B.sg, -4, 4), y:0, label:"Value B, " + B.noun + " " + withU(B, S.xb) + ". Arrow keys move it by 0.5; Shift + arrow by 5." }]; }
      if (S.mode === "inverse") return [];
      var p = pre(), L = [{ id:"x", x:S.x, y:0, label:(S.mode === "between" ? "First value " : "Value ") + withU(p, S.x) + ". Arrow keys move it by 0.5; Shift + arrow by 5." }];
      if (S.mode === "between") L.push({ id:"x2", x:S.x2, y:0, label:"Second value " + withU(p, S.x2) + ". Arrow keys move it by 0.5; Shift + arrow by 5." });
      return L;
    },
    key:function(id, e){
      var d = (e.key === "ArrowRight" || e.key === "ArrowUp") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowDown") ? -1 : 0; if (!d) return false;
      var step = (e.shiftKey ? 5 : 0.5) * d; user();
      if (id === "A" || id === "B") { var P = PRE[id === "A" ? S.ca : S.cb], k = id === "A" ? "xa" : "xb"; S[k] = clamp(r2(S[k] + step), P.mu - 3.49 * P.sg, P.mu + 3.49 * P.sg); }
      else S[id] = r2(S[id] + step);
      save(); render(); MV.changed(); return true;
    },
    move:function(id, x, y, how){
      if (how !== "drag") return;
      if (anim) cancelAnim();
      if (id === "A" || id === "B") { var P = PRE[id === "A" ? S.ca : S.cb], k = id === "A" ? "xa" : "xb", v = clamp(Math.round((P.mu + x * P.sg) * 2) / 2, P.mu - 3.49 * P.sg, P.mu + 3.49 * P.sg); if (v === S[k]) return; S[k] = v; }
      else { var v2 = Math.round(x * 2) / 2; if (v2 === S[id]) return; S[id] = v2; }
      pv = {}; flashZ = null; save(); render(); MV.changed();
    } });

  // --- events ---
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.closest(".rg")) return;
    if (b.id === "zc-rule") { user(); S.rule = !S.rule; save(); render(); MV.changed(); return; }
    if (b.dataset.step) { user(); var q = b.dataset.step.split("|"); if (q[0] === "mu") S.mu = clamp(S.mu + +q[1], 0, 600); else setSg(S.sg + +q[1]); S.pre = ""; clampXs(); save(); render(); MV.changed(); }
  });
  host.addEventListener("input", function(e){
    var t = e.target, v;
    if (t.id === "zc-mu") { user(); S.mu = +t.value; S.pre = ""; clampXs(); save(); render(); MV.changed(); return; }
    if (t.id === "zc-sg") { user(); setSg(+t.value); S.pre = ""; clampXs(); save(); render(); MV.changed(); return; }
    if (t.id === "zc-inv") { user(); S.inv = t.value; save(); render(); MV.changed(); return; }
    var map = { "zc-x":"x", "zc-x2":"x2", "zc-xa":"xa", "zc-xb":"xb" }[t.id];
    if (map) { v = readNum(t.value); if (v == null) return; user(); S[map] = r2(v); save(); render(); MV.changed(); }
  });
  host.addEventListener("change", function(e){ if (/^zc-(x|x2|xa|xb|inv)$/.test(e.target.id)) render(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && /^zc-(x|x2|xa|xb|inv)$/.test(e.target.id)) { e.preventDefault(); render(); } });

  render();

  // --- predictions ---
  function startPred(p){
    cancelAnim(); flashZ = null;
    var st = p.start || {};
    S.mode = st.mode; S.pre = ""; S.mu = st.mu; S.sg = st.sg; S.vs = st.sgTo || st.sg; S.x = st.x; S.x2 = st.x2 != null ? st.x2 : st.mu - st.sg; S.rule = false;
    pv = { hide:true }; save(); render();
  }
  function runPred(p, done){
    newAnim(done);
    var st = p.start || {}, lo = S.mu - 4 * S.vs;
    if (p.id === "p1") {
      pv = { zMark:0, hideRead:true }; render();
      later(350, function(){ anim.stops.push(MV.tween({ dur:1300, step:function(t){ pv.zMark = 2 * t; paintChart(); }, done:function(){ pv = {}; render(); MV.changed(); later(250, endAnim); } })); });
    } else if (p.id === "p2") {
      pv = { shade:[lo, lo], hideRead:true }; render();
      later(300, function(){ anim.stops.push(MV.tween({ dur:1200, step:function(t){ pv.shade = [lo, lo + (S.x - lo) * t]; paintChart(); }, done:function(){ flashZ = zOf(S.x); pv = {}; render(); MV.changed(); later(500, endAnim); } })); });
    } else if (p.id === "p3") {
      var a = Math.min(S.x, S.x2), b = Math.max(S.x, S.x2);
      pv = { shade:[lo, b], hideRead:true }; render();
      later(MV.reduceMotion ? 0 : 1000, function(){ anim.stops.push(MV.tween({ dur:1000, step:function(t){ pv.shade = [lo + (a - lo) * t, b]; paintChart(); }, done:function(){ flashZ = zOf(b); pv = {}; render(); MV.changed(); later(500, endAnim); } })); });
    } else {
      var from = S.sg, to = st.sgTo || 10;
      S.sg = to; save(); pv = { sg:from, hideRead:true }; render();
      later(300, function(){ anim.stops.push(MV.tween({ dur:1700, step:function(t){ pv.sg = from + (to - from) * t; paintChart(); }, done:function(){ pv = {}; render(); MV.changed(); later(250, endAnim); } })); });
    }
  }

  // --- challenges ---
  function near(a, b, t){ return Math.abs(a - b) <= (t || 1e-9); }
  function chal(id){
    var R = function(m){ return { ok:false, msg:MV.md(m) }; };
    if (S.mode === "compare") return R("Leave <strong>Compare</strong> mode first: use Left, Right, Between or Inverse.");
    if (id === "tc1") {
      if (S.mu !== 60 || S.sg !== 5) return R("Set μ = 60 and σ = 5 first (sliders or − / +).");
      var x = S.x, L = ZT.left(zOf(x));
      if (near(x, 65)) return { ok:true };
      if (near(x, 55)) return R("That leaves 84.13% <strong>above</strong>; you need it below.");
      if (near(x, 64.2)) return R("You used 0.84 as the `z`-score. Find 0.8413 inside the table: `z = 1.00`.");
      return R("Below " + mi(dN(x)) + " the table gives " + a4(L) + ", not 0.8413.");
    }
    if (id === "tc2") {
      if (S.mu !== 100 || S.sg !== 15) return R("Set μ = 100 and σ = 15 first.");
      if (S.mode !== "between") return R("Use <strong>Between</strong> mode to shade between two values.");
      var a = Math.min(S.x, S.x2), b = Math.max(S.x, S.x2), D = ZT.left(zOf(b)) - ZT.left(zOf(a));
      if (near(a, 89.95, 0.1 + 1e-9) && near(b, 110.05, 0.1 + 1e-9)) return { ok:true };
      if (near(a, 85) && near(b, 115)) return R("±1σ holds about 68%.");
      if (near(a, 92.5) && near(b, 107.5)) return R("That holds 0.6915 − 0.3085 = 0.3830.");
      if (!near((a + b) / 2, 100, 0.1)) return R("The middle 50% is centred on the mean: 25% on each side.");
      return R("Between " + mi(dN(a)) + " and " + mi(dN(b)) + " the area is " + a4(D) + ". Aim for 25% in each tail.");
    }
    if (id === "tc3") {
      if (S.sg !== 4) return R("Keep σ = 4 g (the <strong>Bag masses</strong> preset sets it).");
      if (S.mu === 508) return { ok:true };
      if (S.mu === 492) return R("That puts 500 two standard deviations <strong>above</strong> the mean, so 97.72% of bags would be under.");
      if (S.mu === 504) return R("500 would be only 1σ below: 15.87% under.");
      if (S.mu === 500) return R("Half the bags would be under.");
      var z = zOf(500), L2 = ZT.left(z);
      return R("With μ = " + S.mu + ", 500 g has `z = " + z2(z) + "` and the table gives " + a4(L2) + " under, not 0.0228.");
    }
    return { ok:false };
  }
  return { predict:{ start:startPred, run:runPred }, challenge:function(id){ return chal(id); } };
}

// ---------- hero: heights and test marks squeeze onto N(0, 1); 182 cm and 83 both land at z = 1.5 ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var plot = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }), aria = cv.getAttribute("aria-label") || "";
  var st = { t:0, sh:0, cell:0 };
  function lerp(a, b, t){ return a + (b - a) * t; }
  plot.render = function(){
    plot.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false, describe:aria, after:function(ctx, p){
      var W = p.W, H = p.H, t = st.t, pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), soft = css("--hi-soft");
      var bF = H - 46, hF = (bF - 30) * 0.92, sF = W * 0.105, k = W * 0.0085;
      var C = [
        { mu:170, sg:8, x:182, lab:"182 cm", name:"heights " + MV.plain("N(170, 8²)"), cx0:W * 0.25, s0:8 * k, b0:H * 0.44, h0:H * 0.3, col:pen, dash:[] },
        { mu:65, sg:12, x:83, lab:"mark 83", name:"test marks " + MV.plain("N(65, 12²)"), cx0:W * 0.64, s0:12 * k, b0:bF, h0:H * 0.3, col:ink2, dash:[7, 5] }];
      // shading under the final curve (left of z = 1.5)
      if (st.sh > 0) {
        ctx.save(); ctx.globalAlpha = st.sh; ctx.beginPath(); ctx.moveTo(W / 2 - 3.8 * sF, bF);
        for (var i = 0; i <= 200; i++) { var z = -3.8 + 5.3 * i / 200; ctx.lineTo(W / 2 + z * sF, bF - hF * Math.exp(-z * z / 2)); }
        ctx.lineTo(W / 2 + 1.5 * sF, bF); ctx.closePath(); ctx.fillStyle = soft; ctx.fill(); ctx.restore();
      }
      C.slice().reverse().forEach(function(c, j){
        var cx = lerp(c.cx0, W / 2, t), s = lerp(c.s0, sF, t), b = lerp(c.b0, bF, t), h = lerp(c.h0, hF, t), col = t >= 1 && c.col === ink2 ? pen : c.col;
        ctx.strokeStyle = ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx - 3.8 * s, b + 0.5); ctx.lineTo(cx + 3.8 * s, b + 0.5); ctx.stroke();
        ctx.beginPath(); for (var i2 = 0; i2 <= 160; i2++) { var z2v = -3.8 + 7.6 * i2 / 160, px = cx + z2v * s, py = b - h * Math.exp(-z2v * z2v / 2); if (i2) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
        ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.setLineDash(c.dash); ctx.stroke(); ctx.setLineDash([]);
        // tick labels: raw values fade out, z values fade in
        ctx.font = "12px " + p.fontUI; ctx.textAlign = "center"; ctx.textBaseline = "top";
        for (var q = -2; q <= 2; q++) {
          var tx = cx + q * s; ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(tx, b - 3); ctx.lineTo(tx, b + 4); ctx.stroke();
          if (t < 1) { ctx.globalAlpha = 1 - t; ctx.fillStyle = ink; ctx.fillText(String(c.mu + q * c.sg), tx, b + 5); }
          if (t > 0 && j === 0) { ctx.globalAlpha = t; ctx.fillStyle = ink2; ctx.fillText(mi(String(q)), tx, b + 20); }
          ctx.globalAlpha = 1;
        }
        if (t < 1) { ctx.globalAlpha = 1 - t; ctx.fillStyle = col; ctx.font = "italic 13px " + p.fontM; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(c.name, cx, b - h - 6); ctx.globalAlpha = 1; }
        // the marked value at +1.5σ
        var mx = cx + 1.5 * s, my = b - h * Math.exp(-1.125);
        ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx, b); ctx.stroke();
        ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(mx, my, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.font = "700 13px " + p.fontUI; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(c.lab, mx + 8, my - (t > 0.6 ? (c.mu === 170 ? 18 : 0) : 6));
      });
      if (t > 0) {
        ctx.globalAlpha = t; ctx.fillStyle = pen; ctx.font = "italic 700 15px " + p.fontM; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(MV.plain("N(0, 1)"), W / 2, bF - hF - 6);
        ctx.fillStyle = ink2; ctx.font = "italic 12px " + p.fontM; ctx.textAlign = "left"; ctx.fillText("z", W / 2 - 3.8 * sF, bF + 34); ctx.globalAlpha = 1;
      }
      if (t >= 1) { ctx.fillStyle = ink; ctx.font = "700 13px " + p.fontUI; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText("z = 1.5", W / 2 + 1.5 * sF, bF + 34); }
      // the table cell
      if (st.cell > 0) {
        var cw = 62, ch = 22, x0 = W - 2 * cw - 12, y0 = 10;
        ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.font = "13px " + p.fontUI; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        [["z", "0.00"], ["1.5", "0.9332"]].forEach(function(r, ri){ r.forEach(function(tx2, ci){
          var hot = ri === 1 && ci === 1; ctx.fillStyle = hot ? css("--hi") : css("--sheet"); ctx.fillRect(x0 + ci * cw, y0 + ri * ch, cw, ch); ctx.strokeRect(x0 + ci * cw + 0.5, y0 + ri * ch + 0.5, cw, ch);
          ctx.fillStyle = hot ? css("--hi-ink") : ink; ctx.font = (hot || ci === 0 ? "700 " : "") + "13px " + p.fontUI; ctx.fillText(tx2, x0 + ci * cw + cw / 2, y0 + ri * ch + ch / 2 + 1); }); });
      }
    } });
  };
  var cap = f.cap;
  function last(){ st = { t:1, sh:1, cell:1 }; plot.render(); cap.textContent = "Both land on N(0, 1) at z = 1.5: the table gives 0.9332 to the left, so each is at the 93rd percentile of its own group."; }
  if (MV.reduceMotion) { last(); return; }
  plot.render(); cap.textContent = "Heights N(170, 8²) and test marks N(65, 12²), each on its own axis";
  MV.wait(900, function(){
    cap.textContent = "Standardize: each curve slides and squeezes onto N(0, 1)";
    MV.tween({ dur:2400, step:function(t){ st.t = t; plot.render(); }, done:function(){
      MV.wait(500, function(){
        cap.textContent = "182 cm and a mark of 83 both land at z = 1.5";
        MV.tween({ dur:800, step:function(t){ st.sh = t; plot.render(); }, done:function(){
          MV.wait(500, function(){ st.cell = 1; plot.render(); MV.wait(700, last); });
        } });
      });
    } });
  });
}

// ---------- number entry (N4) shared by Part 3 and practice ----------
// @component N4 zEntry — number entry for areas, cutoffs and percents (adapted from MDM4U 19's moneyEntry): one box, or one
// box per part (answer:[a, b] with label:[…]); tol absolute; named wrong answers {match: n | [n…], fb}; an optional choice
// row (pick:[{t, ok, why}], read with MV.ok) — with no answer, the choice alone is the item; first try = right on the first
// check without the worked solution.
function zJudge(it, raws, pick){
  var ans = MV.ans(it), multi = Array.isArray(ans), tol = it.tol || 1e-6;
  if (it.pick && pick == null) return { bad:"Choose an answer" + (it.pickLabel ? " for “" + MV.plain(it.pickLabel).replace(/:$/, "") + "”" : "") + " first." };
  var pickOk = !it.pick || MV.ok(it.pick[pick]);
  if (ans == null) return pickOk ? { ok:true } : { ok:false, fb:it.pick[pick].why || "Check your choice." };
  var target = multi ? ans : [ans], vals = target.map(function(_, i){ return readNum(raws[i]); });
  if (vals.some(function(v){ return v == null; })) return { bad:"Enter a number" + (multi ? " in each box" : "") + ", such as 180.2 or 0.0228." };
  var numOk = target.every(function(t, i){ return Math.abs(vals[i] - t) <= tol + 1e-9; });
  if (numOk && pickOk) return { ok:true };
  var fb = [];
  if (!pickOk) fb.push(it.pick[pick].why || "Check your choice.");
  if (!numOk) { var w = (it.wrong || []).filter(function(q){ var m = Array.isArray(q.match) ? q.match : [q.match]; return m.length === vals.length && m.every(function(t, i){ return Math.abs(vals[i] - t) <= Math.max(tol, 1e-6) + 1e-9; }); })[0]; fb.push(w ? w.fb : it.general || "Check your work."); }
  return { ok:false, fb:fb.join(" ") };
}
function entryHTML(it, x, pre, solved){
  var ans = MV.ans(it), multi = Array.isArray(ans), labs = Array.isArray(it.label) ? it.label : [it.label || "Your answer:"], h = "";
  if (it.pick) h += '<div class="zc-pick" role="radiogroup" aria-label="' + MV.esc(MV.plain(it.pickLabel || "Choose")) + '"><span class="rg-lab">' + (it.pickLabel || "Choose:") + "</span>" + it.pick.map(function(o, k){
    return '<button type="button" role="radio" class="zc-pk" aria-checked="' + (x.pick === k) + '" data-pk="' + k + '" data-k="' + pre + it.id + "pk" + k + '"' + (solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
  if (ans != null) (multi ? ans : [0]).forEach(function(_, i){
    h += '<div class="numrow"><label for="' + pre + it.id + "-" + i + '">' + (labs[i] || labs[0]) + '</label><input class="numin" id="' + pre + it.id + "-" + i + '" data-zin="' + it.id + '" data-zi="' + i + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + MV.esc(x.vals[i] || "") + '"' + (solved ? " disabled" : "") + ">" + (it.unit ? '<span class="m">' + it.unit + "</span>" : "") + "</div>";
  });
  return h;
}
function zItemState(store, id){ var x = store[id] = obj(store[id]); x.vals = Array.isArray(x.vals) ? x.vals.map(String) : []; x.tries = x.tries || 0; x.hint = x.hint || 0; return x; }
function zEntry(host, api, a){
  var st = api.S; st.items = obj(st.items);
  var msgs = {};
  function ist(id){ return zItemState(st.items, id); }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = (a.how === "" ? "" : '<p class="how">' + (a.how || "Type your answer, then press Check.") + "</p>") + a.items.map(function(it, i){
        var x = ist(it.id), h = '<div class="q" data-ze="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        h += entryHTML(it, x, "ze-", x.solved);
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.zin) return; ist(t.dataset.zin).vals[+t.dataset.zi] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.zin) { e.preventDefault(); var b = host.querySelector('[data-k="' + e.target.dataset.zin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ze]"); if (!box) return;
    var it = a.items.filter(function(z){ return z.id === box.dataset.ze; })[0], x = ist(it.id);
    if (b.dataset.pk != null) { x.pick = +b.dataset.pk; api.save(); paint(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = zJudge(it, x.vals, x.pick);
      if (r.bad) { msgs[it.id] = r.bad; paint(); MV.focusFb(host.querySelector('[data-ze="' + it.id + '"]')); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + r.fb + " Try again."; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ze="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Part 3: Percentiles and positions ----------
// @component D9 dataPanel — a model data set as a sorted strip of value chips (buttons once the station's task is done),
// with summary statistics computed in the page (mean, sample s, Q1/Q3 as medians of the halves: the course method).
function stats(xs){
  var a = xs.slice().sort(function(p, q){ return p - q; }), n = a.length, mean = a.reduce(function(s, v){ return s + v; }, 0) / n;
  var ss = a.reduce(function(s, v){ return s + (v - mean) * (v - mean); }, 0), med = function(L){ var m = L.length; return m % 2 ? L[(m - 1) / 2] : (L[m / 2 - 1] + L[m / 2]) / 2; };
  return { a:a, n:n, mean:mean, s:Math.sqrt(ss / (n - 1)), q1:med(a.slice(0, Math.floor(n / 2))), q3:med(a.slice(Math.ceil(n / 2))) };
}
function part3(host, api){
  var S = api.S, P3 = api.content || {}, ST = P3.stations || [];
  if (!ST.length) return {};
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = ST[0].id;
  S.items = obj(S.items); S.z1 = isFinite(+S.z1) && S.z1 !== null ? clamp(r2(+S.z1), -2.5, 2.5) : 1.28;
  var msgs = {}, plot1 = null;
  function st(id){ return ST.filter(function(s){ return s.id === id; })[0]; }
  function ist(id){ return zItemState(S.items, id); }
  function done(s){ if (s.items) return s.items.every(function(it){ return ist(it.id).solved; }); if (s.choices) return !!ist(s.id).solved; return !!S.seen1; }
  var tabOpts = ST.map(function(s){ return { id:s.id, t:"" }; });
  function tabText(){ ST.forEach(function(s, i){ tabOpts[i].t = "Station " + (i + 1) + ": " + s.title + (done(s) ? ' <span class="pp-tick" aria-label="done">✓</span>' : ""); }); }
  host.innerHTML = '<div id="pp-tabs" class="pp-tabs"></div><div id="pp-body" class="pp-body"></div>';
  tabText();
  var tabsR = radios($("#pp-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; api.save(); paint(); } });
  function retab(){ tabText(); tabsR.refresh(); }

  // Station 1
  var KEYS = [{ z:-0.67, t:"`Q_1` ↔ `z ≈ -0.67`" }, { z:0, t:"Median ↔ `z = 0`" }, { z:0.67, t:"`Q_3` ↔ `z ≈ 0.67`" }, { z:1.28, t:"90th percentile ↔ `z ≈ 1.28`" }];
  function region(z){
    if (near2(z, -0.67)) return "at " + M("Q_1"); if (near2(z, 0)) return "at the median"; if (near2(z, 0.67)) return "at " + M("Q_3");
    return z < -0.67 ? "below " + M("Q_1") + " (the bottom quarter)" : z < 0 ? "between " + M("Q_1") + " and the median" : z < 0.67 ? "between the median and " + M("Q_3") : "above " + M("Q_3") + " (the top quarter)";
  }
  function near2(a, b){ return Math.abs(a - b) < 1e-9; }
  function s1Read(){
    var z = S.z1, L = ZT.left(z), pc = Math.round(L * 100);
    return MV.readoutHTML([["Percentile (from the table)", a4(L) + " lies to the left: about the <strong>" + ord(Math.max(1, Math.min(99, pc))) + " percentile</strong>"],
      ["Quartile region", region(z)],
      ["In words", z === 0 ? "At the mean, higher than about 50% of values." : z2(Math.abs(z)) + " standard deviations " + (z > 0 ? "above" : "below") + " the mean, higher than about " + pc + "% of values."]]);
  }
  function s1Plot(){
    if (!plot1) return;
    var z = S.z1;
    plot1.draw({ view:{ xmin:-3.6, xmax:3.6, ymin:-0.3, ymax:1.25 }, grid:false, axes:false, ticks:false,
      describe:"Standard normal curve shaded to the left of z = " + z2(z) + " (area " + a4(ZT.left(z)) + "), with dashed lines at Q1 (z = −0.67), the median (0) and Q3 (0.67).",
      after:function(ctx, p){
        var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), soft = css("--hi-soft"), f = function(x){ return Math.exp(-x * x / 2); }, i, x, y0 = p.Y(0);
        ctx.beginPath(); ctx.moveTo(p.X(-3.5), y0); for (i = 0; i <= 160; i++) { x = -3.5 + (z + 3.5) * i / 160; ctx.lineTo(p.X(x), p.Y(f(x))); } ctx.lineTo(p.X(z), y0); ctx.closePath(); ctx.fillStyle = soft; ctx.fill();
        ctx.beginPath(); for (i = 0; i <= 200; i++) { x = -3.5 + 7 * i / 200; if (i) ctx.lineTo(p.X(x), p.Y(f(x))); else ctx.moveTo(p.X(x), p.Y(f(x))); } ctx.strokeStyle = pen; ctx.lineWidth = 3; ctx.stroke();
        ctx.strokeStyle = ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(p.X(-3.5), y0 + 0.5); ctx.lineTo(p.X(3.5), y0 + 0.5); ctx.stroke();
        ctx.font = "12px " + p.fontUI; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillStyle = ink2;
        for (var k = -3; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(p.X(k), y0 - 3); ctx.lineTo(p.X(k), y0 + 4); ctx.stroke(); ctx.fillText(mi(String(k)), p.X(k), y0 + 6); }
        [[-0.67, "Q₁"], [0, "median"], [0.67, "Q₃"]].forEach(function(q){ ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = ink2; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(p.X(q[0]), y0); ctx.lineTo(p.X(q[0]), p.Y(1.12)); ctx.stroke(); ctx.restore(); ctx.fillStyle = ink2; ctx.font = "600 12px " + p.fontUI; ctx.textBaseline = "bottom"; ctx.fillText(q[1], p.X(q[0]) + (q[0] < 0 ? -6 : q[0] > 0 ? 6 : 0), p.Y(1.12) - 2); });
        ctx.strokeStyle = ink; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(p.X(z), y0); ctx.lineTo(p.X(z), p.Y(f(z))); ctx.stroke();
        ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(p.X(z), p.Y(f(z)), 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.font = "700 13px " + p.fontUI; ctx.textBaseline = "middle"; var tx = "z = " + z2(z), w = ctx.measureText(tx).width, cx = clamp(p.X(z), w / 2 + 4, p.W - w / 2 - 4); ctx.fillStyle = css("--sheet"); ctx.fillRect(cx - w / 2 - 3, y0 + 22, w + 6, 18); ctx.fillStyle = ink; ctx.fillText(tx, cx, y0 + 31);
      } });
  }
  function s1HTML(s){
    return '<p class="pp-text">' + s.text + "</p>" +
      '<label class="slider pp-sl"><span class="slider-top"><span>' + M("z") + '-score</span><output id="pp-zo">' + z2(S.z1) + '</output></span><input type="range" id="pp-z" min="-2.5" max="2.5" step="0.01" value="' + S.z1 + '" aria-valuetext="z = ' + z2(S.z1) + '"></label>' +
      '<div class="pp-tiles" role="group" aria-label="Key positions">' + KEYS.map(function(k, i){ return '<button type="button" class="btn ghost sm pp-tile" data-kz="' + k.z + '" data-k="ppkz' + i + '">' + MV.md(k.t) + "</button>"; }).join("") + "</div>" +
      '<div class="plot-wrap"><canvas class="plot wide pp-plot" id="pp-plot" role="img" aria-label="Standard normal curve shaded to the left of z"></canvas></div>' +
      '<dl class="read" id="pp-read" aria-live="polite">' + s1Read() + "</dl>";
  }
  function s1Upd(){ var o = $("#pp-zo", host), sl = $("#pp-z", host), rd = $("#pp-read", host); if (!o) return; o.textContent = z2(S.z1); sl.value = S.z1; sl.setAttribute("aria-valuetext", "z = " + z2(S.z1)); rd.innerHTML = s1Read(); s1Plot(); }

  // Station 2
  function itemHTML(it){
    var x = ist(it.id), h = '<div class="pp-item" data-pi="' + it.id + '"><p class="pp-ip">' + it.prompt + "</p>" + entryHTML(it, x, "pi-", x.solved);
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-pchk="' + it.id + '" data-k="pp' + it.id + 'chk">Check</button></div>';
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + it.why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML("bad", msgs[it.id]);
    return h + "</div>";
  }
  function s2Cmp(s, m){
    var D = stats(s.marks), below = D.a.filter(function(v){ return v < m; }).length, z = r2((m - 70) / 7.8), L = ZT.left(z);
    return MV.readoutHTML([["Data", below + " of 20 marks below " + m + ": " + M("(" + below + " ÷ 20) × 100") + " = the " + (below ? ord(below * 5) + " percentile" : "0th percentile (no marks below)")],
      ["Normal model", M("z = (" + m + " - 70) ÷ 7.8 ≈ " + z2(z)) + "; the table gives " + a4(L) + ": about the " + ord(Math.max(1, Math.min(99, Math.round(L * 100)))) + " percentile"]]);
  }
  function s2HTML(s){
    var D = stats(s.marks), sel = S.m2, open = ist(s.items[0].id).solved;
    var chips = '<div class="pp-marks" role="group" aria-label="The 20 marks, smallest to largest">' + D.a.map(function(v, i){
      return open ? '<button type="button" class="pp-mk" data-mk="' + v + '" data-k="ppmk' + i + '" aria-pressed="' + (sel === v) + '">' + v + "</button>" : '<span class="pp-mk">' + v + "</span>"; }).join("") + "</div>";
    var h = '<p class="pp-text">' + s.text + ' <span class="mdm-model">model data</span></p>' + chips +
      '<dl class="read pp-stats">' + MV.readoutHTML([["Mean", dN(D.mean, 1).replace(/^(\d+)$/, "$1.0")], [M("s") + " (sample)", "≈ " + dN(D.s, 1) + ' <span class="tiny muted">(' + dN(D.s, 3) + ")</span>"], [M("Q_1") + " and " + M("Q_3"), dN(D.q1, 2) + " and " + dN(D.q3, 2) + ' <span class="tiny muted">(the median of each half)</span>']]) + "</dl>" +
      itemHTML(s.items[0]);
    if (open) h += '<details class="alg pp-data" id="pp-d2"' + (S.d2 !== false ? " open" : "") + '><summary>Check it with data</summary><p>' + s.model + '</p><p class="tiny muted">Tap any mark above to compare its data percentile with the normal model’s.</p>' +
      '<dl class="read" id="pp-cmp" aria-live="polite">' + (sel != null ? s2Cmp(s, sel) : s2Cmp(s, 79)) + "</dl></details>";
    h += itemHTML(s.items[1]);
    return h;
  }
  // Station 3
  function s3HTML(s){
    var x = ist(s.id), h = '<p class="pp-text">' + s.text + '</p><div class="pp-ch" role="group" aria-label="Statements">' + s.choices.map(function(c, k){
      return '<button type="button" class="btn ghost pp-c" data-ch="' + k + '" data-k="ppch' + k + '"' + (x.solved ? " disabled" : "") + (x.solved && MV.ok(c) ? ' aria-pressed="true"' : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
    if (x.solved) { var good = s.choices.filter(function(c){ return MV.ok(c); })[0]; h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + good.why + (x.first ? "" : ' <span class="muted">(not first try)</span>')); }
    else if (msgs[s.id]) h += MV.fbHTML("bad", msgs[s.id]);
    return h;
  }
  function paint(){
    var s = st(S.cur), body = $("#pp-body", host);
    if (s.id === "s1") S.seen1 = true;
    retab();
    var inner = s.id === "s1" ? s1HTML(s) : s.id === "s2" ? s2HTML(s) : s3HTML(s);
    MV.keepFocus(body, function(){ body.innerHTML = '<div class="pp-card0"><span class="pp-lab">Station ' + (ST.indexOf(s) + 1) + " · " + s.title + "</span>" + inner + "</div>"; });
    plot1 = null;
    var cv = $("#pp-plot", host); if (cv) { plot1 = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }); plot1.render = s1Plot; s1Plot(); }
  }
  function check(id){
    var s2 = st("s2"), it = s2.items.filter(function(z){ return z.id === id; })[0], x = ist(id), r = zJudge(it, x.vals);
    if (r.bad) { msgs[id] = r.bad; paint(); MV.focusFb(host.querySelector('[data-pi="' + id + '"]')); return; }
    if (r.ok) { x.solved = true; x.first = x.tries === 0; msgs[id] = null; } else { x.tries++; msgs[id] = "<strong>✗ Not quite.</strong> " + r.fb + " Try again."; }
    api.save(); paint(); MV.focusFb(host.querySelector('[data-pi="' + id + '"]'));
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest(".rg")) return;
    if (b.dataset.pchk) { check(b.dataset.pchk); return; }
    if (b.dataset.kz != null) { S.z1 = +b.dataset.kz; api.save(); s1Upd(); return; }
    if (b.dataset.mk != null) { S.m2 = +b.dataset.mk; api.save(); var c = $("#pp-cmp", host); if (c) c.innerHTML = s2Cmp(st("s2"), S.m2); host.querySelectorAll("[data-mk]").forEach(function(q){ q.setAttribute("aria-pressed", String(+q.dataset.mk === S.m2)); }); return; }
    if (b.dataset.ch != null) {
      var s3 = st("s3"), x = ist(s3.id), c3 = s3.choices[+b.dataset.ch];
      if (MV.ok(c3)) { x.solved = true; x.first = x.tries === 0; msgs[s3.id] = null; } else { x.tries++; msgs[s3.id] = "<strong>✗ Not quite.</strong> " + c3.why + " Try another statement."; }
      api.save(); paint(); MV.focusFb(host.querySelector(".pp-body")); return;
    }
  });
  host.addEventListener("toggle", function(e){ if (e.target.id === "pp-d2") { S.d2 = e.target.open; api.save(); } }, true);
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.dataset && t.dataset.zin) { ist(t.dataset.zin).vals[+t.dataset.zi] = t.value; api.save(); return; }
    if (t.id === "pp-z") { S.z1 = r2(+t.value); api.save(); s1Upd(); }
  });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.zin) { e.preventDefault(); check(e.target.dataset.zin); } });
  paint();
  return {};
}

// ---------- Performance task: Grade boundaries ----------
var task = (function(){
  var api = null, AS = [78, 80, 82, 84, 86, 88, 90], PS = [45, 48, 50, 52, 55, 58], plot = null;
  function st(){ var s = api ? api.S : {}; if (AS.indexOf(+s.a) < 0) s.a = 78; if (PS.indexOf(+s.p) < 0) s.p = 58; s.a = +s.a; s.p = +s.p; return s; }
  function read(){ var s = st(); return { a:s.a, p:s.p }; }
  function calc(d){ var za = r2((d.a - 68) / 10), zp = r2((d.p - 68) / 10), La = ZT.left(za), Lp = ZT.left(zp), aT = 10000 - Math.round(La * 10000), fT = Math.round(Lp * 10000); return { za:za, zp:zp, La:La, Lp:Lp, aT:aT, fT:fT, mT:10000 - aT - fT }; }
  function pc(t){ return dN(t / 100, 2) + "%"; }
  function drawPlot(){
    if (!plot) return; var d = read(), c = calc(d);
    plot.draw({ view:{ xmin:27, xmax:109, ymin:-0.42, ymax:1.22 }, grid:false, axes:false, ticks:false,
      describe:"Normal curve of exam marks N(68, 10 squared). The fail tail below the pass mark " + d.p + " (" + pc(c.fT) + ") and the A tail above " + d.a + " (" + pc(c.aT) + ") are shaded; " + pc(c.mT) + " lie between.",
      after:function(ctx, p){
        var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), soft = css("--hi-soft"), f = function(x){ var z = (x - 68) / 10; return Math.exp(-z * z / 2); }, i, x, y0 = p.Y(0), yz = y0 + 30;
        function fill(a, b){ ctx.beginPath(); ctx.moveTo(p.X(a), y0); for (i = 0; i <= 120; i++) { x = a + (b - a) * i / 120; ctx.lineTo(p.X(x), p.Y(f(x))); } ctx.lineTo(p.X(b), y0); ctx.closePath(); ctx.fillStyle = soft; ctx.fill(); }
        fill(30, d.p); fill(d.a, 106);
        ctx.beginPath(); for (i = 0; i <= 240; i++) { x = 30 + 76 * i / 240; if (i) ctx.lineTo(p.X(x), p.Y(f(x))); else ctx.moveTo(p.X(x), p.Y(f(x))); } ctx.strokeStyle = pen; ctx.lineWidth = 3; ctx.stroke();
        ctx.strokeStyle = ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(p.X(30), y0 + 0.5); ctx.lineTo(p.X(106), y0 + 0.5); ctx.stroke();
        ctx.strokeStyle = ink2; ctx.beginPath(); ctx.moveTo(p.X(30), yz + 0.5); ctx.lineTo(p.X(106), yz + 0.5); ctx.stroke();
        ctx.font = "12px " + p.fontUI; ctx.textAlign = "center"; ctx.textBaseline = "top";
        for (var k = -3; k <= 3; k++) { var tx = 68 + 10 * k; ctx.strokeStyle = ink; ctx.beginPath(); ctx.moveTo(p.X(tx), y0 - 3); ctx.lineTo(p.X(tx), y0 + 4); ctx.stroke(); ctx.fillStyle = ink; ctx.fillText(String(tx), p.X(tx), y0 + 5); ctx.fillStyle = ink2; ctx.fillText(mi(String(k)), p.X(tx), yz + 5); }
        ctx.font = "italic 12px " + p.fontM; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillStyle = ink2; ctx.fillText("z", 4, yz - 2); ctx.fillText("mark", 4, y0 - 2);
        [[d.p, "pass " + d.p, "fail " + pc(c.fT), -1], [d.a, "A " + d.a, "A " + pc(c.aT), 1]].forEach(function(q){
          var px = p.X(q[0]); ctx.strokeStyle = ink; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(px, yz); ctx.lineTo(px, p.Y(1.08)); ctx.stroke();
          ctx.fillStyle = ink; ctx.font = "700 13px " + p.fontUI; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(q[1], px, p.Y(1.08) - 2);
          ctx.font = "600 12px " + p.fontUI; ctx.textAlign = q[3] < 0 ? "right" : "left"; ctx.textBaseline = "bottom"; ctx.fillText(q[2], px + q[3] * 6, p.Y(0.42));
        });
        ctx.font = "600 12px " + p.fontUI; ctx.textAlign = "center"; ctx.fillStyle = ink; ctx.fillText("between " + pc(c.mT), p.X((d.a + d.p) / 2), p.Y(0.55));
      } });
  }
  function paintRead(){
    var d = read(), c = calc(d), el = $("#gb-read"); if (!el) return;
    el.innerHTML = MV.readoutHTML([
      ["A percent", M("z = (" + d.a + " - 68) ÷ 10 = " + z2(c.za)) + "; 1 − " + a4(c.La) + " = " + a4(c.aT / 10000) + " → <strong>" + pc(c.aT) + "</strong>"],
      ["Fail percent", M("z = (" + d.p + " - 68) ÷ 10 = " + z2(c.zp)) + "; table area " + a4(c.Lp) + " → <strong>" + pc(c.fT) + "</strong>"],
      ["Middle percent", "1 − " + a4(c.aT / 10000) + " − " + a4(c.fT / 10000) + " = " + a4(c.mT / 10000) + " → <strong>" + pc(c.mT) + "</strong>"]]);
  }
  function paint(){ drawPlot(); paintRead(); }
  return {
    render:function(inp, pvw, a){
      api = a; st();
      inp.innerHTML = '<div class="gb-in"><div id="gb-a"></div><div id="gb-p"></div></div>';
      pvw.innerHTML = '<div class="plot-wrap"><canvas class="plot wide gb-plot" id="gb-plot" role="img" aria-label="Exam marks curve with the pass mark and A cutoff"></canvas></div><dl class="read" id="gb-read" aria-live="polite"></dl>';
      radios($("#gb-a"), { label:"A cutoff", options:AS.map(function(v){ return { id:v, t:String(v) }; }), value:api.S.a, cls:"chips", onChange:function(v){ api.S.a = +v; api.save(); paint(); api.update(); } });
      radios($("#gb-p"), { label:"Pass mark", options:PS.map(function(v){ return { id:v, t:String(v) }; }), value:api.S.p, cls:"chips", onChange:function(v){ api.S.p = +v; api.save(); paint(); api.update(); } });
      plot = new MV.Plot($("#gb-plot"), { xmin:0, xmax:1, ymin:0, ymax:1 }); plot.render = drawPlot;
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var c = calc(d); return [c.aT >= 500 && c.aT <= 1500, c.fT >= 200 && c.fT <= 1000, c.aT + c.fT <= 1500]; },
    key:function(d){ return d.a + "|" + d.p; },
    label:function(k){ var q = k.split("|"); return "A cutoff " + q[0] + ", pass mark " + q[1]; },
    text:function(k){ var q = k.split("|"); return "(A " + q[0] + ", pass " + q[1] + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ backwards:zEntry },
  task:task
});
})();
