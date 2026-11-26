// MDM4U 29 Population, Sample & Sampling Methods: hero (a 400-dot school; a random ticker lights 40 scattered dots and a bar
// rises to 47.5%; then 40 dots by the gym door light up and a second bar rises to 72.5%), Sampling lab (Explore: D12 400-dot
// grid with six methods, seeded single and repeated draws, a histogram of 100 sample proportions), Margins of error (Part 3:
// four stations and a repeated-polls panel), Plan it (N4 numEntry), Town survey task (6000-dot map). Every draw is seeded
// (MV.mdm.seededRandom), so the same seed and settings give the same samples on any device. The school is model data.
(function(){
"use strict";
var $ = MV.$, css = MV.css;
function M(s){ return MV.m(s); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? clamp(v, lo, hi) : def; }
function obj(o){ return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }
function mi(s){ return String(s).replace(/-/g, MV.MINUS); }
function d1(v){ var s = (Math.round(v * 10) / 10).toFixed(1); return mi(s === "-0.0" ? "0.0" : s); }
function pc(v){ return mi((Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, "")) + "%"; }
function sum(a, b){ return a + b; }
function byNum(a, b){ return a - b; }
function range(n){ var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }
function rng(s){ return MV.mdm.seededRandom(s); }

// ---------- D12 model school (model data): 400 students in 20 homerooms of 20; each homeroom is one grade ----------
// Grade 9: 6 homerooms, 12 of 20 play a sport (60%); Grade 10: 5, 10 of 20 (50%); Grade 11: 5, 8 of 20 (40%); Grade 12: 4, 6 of 20 (30%).
var GRADES = [{ g:9, rooms:6, per:12 }, { g:10, rooms:5, per:10 }, { g:11, rooms:5, per:8 }, { g:12, rooms:4, per:6 }];
var GSIZE = [120, 100, 100, 80], N_POP = 400, N_SPORT = 186, P0 = 0.465, PAR = 46.5;
var ROOMG = [], POP = [], GIDX = [[], [], [], []], SPORT = [], NON = [];
(function(){
  var r = rng("mdm29-school"), room = 0;
  GRADES.forEach(function(G, gi){
    for (var k = 0; k < G.rooms; k++, room++) {
      ROOMG.push(gi);
      var seats = range(20);
      for (var i = 19; i > 0; i--) { var j = r.int(i + 1), t = seats[i]; seats[i] = seats[j]; seats[j] = t; }
      var sp = {}; for (var q = 0; q < G.per; q++) sp[seats[q]] = 1;
      for (var c = 0; c < 20; c++) { var idx = room * 20 + c; POP.push({ i:idx, room:room, g:gi, c:c, sport:!!sp[c] }); GIDX[gi].push(idx); (sp[c] ? SPORT : NON).push(idx); }
    }
  });
})();
var ALL = range(N_POP);
// behaviour rules (model data): sport players are 3× as likely to be in the gym, 2× as likely to answer an online poll
var WEIGHT = { conv:3, vol:2 };

function pickK(arr, k, r){ var a = arr.slice(), out = []; k = Math.min(k, a.length); for (var i = 0; i < k; i++) { var j = i + r.int(a.length - i), t = a[i]; a[i] = a[j]; a[j] = t; out.push(a[i]); } return out; }
// each pick is a sport player with probability w·186 ÷ (w·186 + 214) (72.3% for the gym, 63.5% online), then a random such student
function biased(n, w, r){
  var ps = w * N_SPORT / (w * N_SPORT + N_POP - N_SPORT), sp = SPORT.slice(), no = NON.slice(), out = [];
  for (var i = 0; i < n; i++) {
    var useS = r() < ps; if (useS && !sp.length) useS = false; if (!useS && !no.length) useS = true;
    var a = useS ? sp : no, j = r.int(a.length); out.push(a[j]); a[j] = a[a.length - 1]; a.pop();
  }
  return out;
}
function sysPicks(k, s){ var out = []; for (var id = s; id <= N_POP; id += k) out.push(id - 1); return out; }
function stratAlloc(n){
  var raw = GSIZE.map(function(g){ return g * n / N_POP; }), base = raw.map(Math.floor), left = n - base.reduce(sum, 0);
  var order = [0, 1, 2, 3].sort(function(a, b){ return (raw[b] - base[b]) - (raw[a] - base[a]) || a - b; });
  for (var i = 0; i < left; i++) base[order[i]]++;
  return base;
}
function roomsRandom(k, r){ return pickK(range(20), k, r).sort(byNum); }
// one sample for a configuration c = {m, n, k, s, st[4], cl[rooms]}; rep: a repeated-mode draw (random systematic start,
// random homerooms)
function drawOne(c, r, rep){
  if (c.m === "srs") return pickK(ALL, c.n, r);
  if (c.m === "sys") return sysPicks(c.k, rep ? 1 + r.int(c.k) : c.s);
  if (c.m === "strat") { var out = []; c.st.forEach(function(cnt, g){ out = out.concat(pickK(GIDX[g], cnt, r)); }); return out; }
  if (c.m === "clus") { var rooms = rep ? roomsRandom(c.cl.length, r) : c.cl, o2 = []; rooms.forEach(function(rm){ for (var q = 0; q < 20; q++) o2.push(rm * 20 + q); }); return o2; }
  return biased(c.n, WEIGHT[c.m], r);
}
function stat(sample){ var k = 0; sample.forEach(function(i){ if (POP[i].sport) k++; }); return { k:k, n:sample.length, p:sample.length ? 100 * k / sample.length : null }; }
function moe(n){ return 200 * Math.sqrt(P0 * (1 - P0) / n); }
function moeTxt(v){ var s = v.toFixed(1); if (v < 10 && s === "10.0") s = v.toFixed(2); return "±" + s + "%"; }
function cfgKey(c){ return [c.m, c.n, c.k, c.s, c.st.join("."), c.cl.length].join("|"); }
var repCache = {};
function repProps(c, seed){
  var key = cfgKey(c) + "#" + seed;
  if (!repCache[key]) { var r = rng("mdm29-rep|" + key), out = []; for (var i = 0; i < 100; i++) out.push(stat(drawOne(c, r, true)).p); repCache[key] = out; }
  return repCache[key];
}
function spread(arr){
  var v = arr.filter(function(x){ return x != null; }).sort(byNum), n = v.length; if (!n) return null;
  var drop = Math.floor(n * 0.025);
  return { mean:v.reduce(sum, 0) / n, lo:v[drop], hi:v[n - 1 - drop] };
}
function sizeOf(c){ return c.m === "sys" ? sysPicks(c.k, c.s).length : c.m === "strat" ? c.st.reduce(sum, 0) : c.m === "clus" ? 20 * c.cl.length : c.n; }
var RANDOM = { srs:1, sys:1, strat:1, clus:1 };

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

// @component D12 schoolGrid — the 400-dot school as inline SVG: one row per homeroom (20 seats), rows banded by grade with
// "Gr 9" … labels and homeroom numbers on the right; sport players are filled dots, others rings; chosen dots turn --pen and
// grow. schoolGrid(host) -> {svg, light(list of indices, count), label(text)}
var CELL = 12, GL = 36, GT = 3, GW = GL + 20 * CELL + 18, GH = GT + 20 * CELL + 3;
function schoolGrid(host){
  var h = '<svg class="sm-svg" viewBox="0 0 ' + GW + " " + GH + '" role="img" aria-label="The school: 400 students in 20 homerooms">', row = 0;
  GRADES.forEach(function(G, gi){
    h += '<rect class="sm-band sm-b' + gi + '" x="' + (GL - 4) + '" y="' + (GT + row * CELL) + '" width="' + (20 * CELL + 6) + '" height="' + (G.rooms * CELL) + '" rx="3"/>' +
      '<text class="sm-gl" x="' + (GL - 8) + '" y="' + (GT + (row + G.rooms / 2) * CELL) + '">Gr ' + G.g + "</text>";
    row += G.rooms;
  });
  for (var rm = 0; rm < 20; rm++) h += '<text class="sm-rn" x="' + (GL + 20 * CELL + 5) + '" y="' + (GT + (rm + 0.5) * CELL) + '">' + (rm + 1) + "</text>";
  POP.forEach(function(p){ h += '<circle class="sm-d' + (p.sport ? " sp" : "") + '" cx="' + (GL + (p.c + 0.5) * CELL) + '" cy="' + (GT + (p.room + 0.5) * CELL) + '" r="3.7"/>'; });
  host.innerHTML = h + "</svg>";
  var svg = host.querySelector("svg"), dots = Array.prototype.slice.call(svg.querySelectorAll("circle.sm-d")), lit = {};
  return {
    svg:svg,
    light:function(list, count){
      var want = {}, n = count == null ? list.length : Math.min(count, list.length);
      for (var i = 0; i < n; i++) want[list[i]] = 1;
      Object.keys(lit).forEach(function(k){ if (!want[k]) { dots[k].classList.remove("on"); dots[k].setAttribute("r", "3.7"); } });
      Object.keys(want).forEach(function(k){ if (!lit[k]) { dots[k].classList.add("on"); dots[k].setAttribute("r", "4.9"); } });
      lit = want;
    },
    label:function(t){ svg.setAttribute("aria-label", t); }
  };
}

// @component D12 propHist — histogram of 100 sample proportions (0–100%, bins of width w centred on multiples of w) in --pen,
// an optional dashed --ink outline of an earlier run (ghost) for comparison, and a teal (--f3) line at the parameter.
// drawHist(plot, {props, count, label, ghost:{props, label}, w, par, describe})
function drawHist(plot, o){
  var r = plot.c.getBoundingClientRect(), W0 = Math.max(200, r.width), H0 = Math.max(120, r.height);
  plot.draw({ view:{ xmin:0, xmax:W0, ymin:0, ymax:H0 }, grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var W = p.W, H = p.H, L = 34, R = 12, T = o.ghost ? 46 : 30, B = 24, w = o.w || 5, narrow = W < 420;
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), teal = css("--f3"), sheet = css("--sheet"), grid = css("--plot-grid");
    var X = function(v){ return L + (v + 5) / 110 * (W - L - R); };
    function bins(arr, n){ var c = {}; for (var i = 0; i < n && i < arr.length; i++) { var v = arr[i]; if (v == null) continue; var b = Math.round(v / w); c[b] = (c[b] || 0) + 1; } return c; }
    var cm = bins(o.props, o.count == null ? 100 : o.count), full = bins(o.props, 100), cg = o.ghost ? bins(o.ghost.props, 100) : {}, mx = 1;
    [full, cg].forEach(function(c){ Object.keys(c).forEach(function(k){ mx = Math.max(mx, c[k]); }); });
    var ymax = Math.max(10, Math.ceil(mx / 10) * 10), ystep = ymax <= 20 ? 5 : ymax <= 50 ? 10 : 20, base = H - B, hs = (base - T) / ymax;
    ctx.save(); ctx.font = "12px " + p.fontUI; ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (var y = 0; y <= ymax; y += ystep) { var py = base - y * hs; ctx.strokeStyle = grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, py); ctx.lineTo(W - R, py); ctx.stroke(); ctx.fillStyle = ink2; ctx.fillText(String(y), L - 5, py); }
    Object.keys(cm).forEach(function(k){ var b = +k, x1 = X(b * w - w / 2) + 1, x2 = X(b * w + w / 2) - 1, h = cm[k] * hs; ctx.fillStyle = pen; ctx.fillRect(x1, base - h, Math.max(1, x2 - x1), h); });
    if (o.ghost) { ctx.strokeStyle = ink; ctx.lineWidth = 1.6; ctx.setLineDash([4, 3]); Object.keys(cg).forEach(function(k){ var b = +k, x1 = X(b * w - w / 2) + 1.5, x2 = X(b * w + w / 2) - 1.5, h = cg[k] * hs; ctx.strokeRect(x1, base - h, x2 - x1, h); }); ctx.setLineDash([]); }
    ctx.strokeStyle = ink2; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, base + 0.5); ctx.lineTo(W - R, base + 0.5); ctx.stroke();
    ctx.fillStyle = ink2; ctx.textAlign = "center"; ctx.textBaseline = "top";
    for (var t = 0; t <= 100; t += narrow ? 20 : 10) ctx.fillText(t + "%", clamp(X(t), 14, W - 16), base + 5);
    var px = X(o.par == null ? PAR : o.par); ctx.strokeStyle = teal; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(px, base); ctx.lineTo(px, T - 6); ctx.stroke();
    var pl = "parameter " + pc(o.par == null ? PAR : o.par); ctx.font = "700 12px " + p.fontUI; var lw = ctx.measureText(pl).width, lx = px + 5 + lw > W - 2 ? px - 5 - lw : px + 5;
    ctx.fillStyle = sheet; ctx.fillRect(lx - 2, T - 6, lw + 4, 16); ctx.fillStyle = teal; ctx.textAlign = "left"; ctx.fillText(pl, lx, T - 4);
    // legend (top left)
    ctx.font = "600 12px " + p.fontUI; ctx.textBaseline = "middle"; ctx.fillStyle = pen; ctx.fillRect(L, 6, 12, 10); ctx.fillStyle = ink; ctx.fillText(o.label || "", L + 18, 11);
    if (o.ghost) { ctx.strokeStyle = ink; ctx.lineWidth = 1.4; ctx.setLineDash([4, 3]); ctx.strokeRect(L + 0.5, 22.5, 11, 9); ctx.setLineDash([]); ctx.fillStyle = ink; ctx.fillText(o.ghost.label + " (dashed)", L + 18, 27); }
    ctx.fillStyle = ink2; ctx.font = "italic 12px " + p.fontM; ctx.textAlign = "right"; ctx.fillText("number of samples", W - R, 11);
    ctx.restore();
  } });
}

// ---------- Explore: Sampling lab ----------
var METHODS = [{ id:"srs", t:"Simple random" }, { id:"sys", t:"Systematic" }, { id:"strat", t:"Stratified" }, { id:"clus", t:"Cluster" },
  { id:"conv", t:"Convenience (gym after school)" }, { id:"vol", t:"Voluntary (online poll)" }];
function explore(host, api){
  var S = api.S;
  function sanitize(){
    if (!METHODS.some(function(m){ return m.id === S.m; })) S.m = "srs";
    S.n = Math.round(clampI(S.n, 10, 100, 40) / 10) * 10;
    S.k = clampI(S.k, 1, 100, 10); S.s = clampI(S.s, 1, 100, 3);
    if (!Array.isArray(S.st) || S.st.length !== 4) S.st = [10, 10, 10, 10];
    S.st = S.st.map(function(v, g){ return clampI(v, 0, GSIZE[g], 0); });
    var seen = {}; S.cl = (Array.isArray(S.cl) ? S.cl : []).map(function(v){ return clampI(v, 0, 19, 0); }).filter(function(v){ if (seen[v]) return false; seen[v] = 1; return true; }).slice(0, 5).sort(byNum);
    if (!S.cl.length) S.cl = roomsRandom(2, rng("mdm29-cl0"));
    S.seed = clampI(S.seed, 1, 1e6, 1); S.d = clampI(S.d, 0, 1e9, 0); S.rep = !!S.rep;
  }
  sanitize();
  var pv = {}, ghost = null, anim = null, sizeBuilt = "", curC = { key:"", arr:[] };
  host.innerHTML =
    '<div class="pg sm-pg"><div class="pg-graph" data-mv="graph"><p class="eq-cap sm-cap" id="sm-cap" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="sm-gridwrap" id="sm-grid"></div>' +
      '<p class="tiny muted sm-legend"><span class="sm-key"><svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.2" class="sm-kf"/></svg> plays a sport</span><span class="sm-key"><svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.2" class="sm-kr"/></svg> doesn’t</span><span class="sm-key"><svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="5" class="sm-kon"/></svg> in the sample</span> <span class="mdm-model">model data</span></p>' +
      '<div class="sm-bar" id="sm-bar"></div>' +
      '<div class="sm-histbox" id="sm-histbox" hidden><canvas class="plot sm-hist" id="sm-hist" role="img" aria-label="Histogram of 100 sample proportions"></canvas></div>' +
      '<p class="sm-aha" id="sm-aha"></p>' +
      '<details class="alg sm-about"><summary>About this model</summary><p class="tiny"><span class="mdm-model">model data</span> 400 students in 20 homerooms of 20; each homeroom is a single grade.</p>' +
        MV.tableHTML({ head:["Grade", "Students", "Homerooms", "Play a sport"], caption:"The model school", rows:[["9", "120", "6", "60% (72)"], ["10", "100", "5", "50% (50)"], ["11", "100", "5", "40% (40)"], ["12", "80", "4", "30% (24)"], ["<strong>School</strong>", "<strong>400</strong>", "<strong>20</strong>", "<strong>46.5% (186)</strong>: the parameter"]] }) +
        '<ul class="tiny"><li><strong>Convenience:</strong> sport players are 3 times as likely to be in the gym, so the expected gym sample is 72.3% sport players.</li><li><strong>Voluntary:</strong> sport players are twice as likely to answer an online poll, so the expected result is 63.5%.</li></ul></details>' +
    '</div><div class="pg-ctrl"><div id="sm-meth"></div><div id="sm-size"></div>' +
      '<details class="sm-set" open><summary>Method settings</summary><div id="sm-setb"></div></details>' +
      '<div class="q-actions sm-btns"><button type="button" class="btn primary sm" id="sm-one" data-k="smone">Draw one sample</button><button type="button" class="btn sm" id="sm-rep" data-k="smrep">Draw 100 samples</button><button type="button" class="btn ghost sm" id="sm-new" data-k="smnew">New seed</button></div>' +
      '<p class="tiny muted" id="sm-seed"></p></div>' +
    '<div class="pg-read"><dl class="read" id="sm-read" aria-live="polite"></dl></div></div>';
  var grid = schoolGrid($("#sm-grid", host));
  var hplot = new MV.Plot($("#sm-hist", host), { xmin:0, xmax:1, ymin:0, ymax:1 }); hplot.render = paintHist;
  var methR = radios($("#sm-meth", host), { label:"Method", options:METHODS, value:S.m, cls:"chips",
    onChange:function(v){ user(); S.m = v; save(); render(); MV.changed(); } });

  function save(){ api.save(); }
  function cfg(){ return { m:S.m, n:S.n, k:S.k, s:S.s, st:S.st.slice(), cl:S.cl.slice() }; }
  function current(){
    var c = cfg(), key = cfgKey(c) + "|" + c.cl.join(".") + "|" + S.seed + "|" + S.d;
    if (curC.key !== key) curC = { key:key, arr:drawOne(c, rng("mdm29-one|" + key), false) };
    return curC.arr;
  }
  function user(){ cancelAnim(); ghost = null; pv = {}; MV.banner("", ""); }

  // --- animation bookkeeping: any user action finishes the running animation at once ---
  function newAnim(fin){ cancelAnim(); anim = { stops:[], fin:fin || null }; return anim; }
  function cancelAnim(){ if (!anim) return; var a = anim; anim = null; a.stops.forEach(function(f){ try { f(); } catch (e) {} }); pv = {}; render(); MV.changed(); if (a.fin) a.fin(); }
  function endAnim(){ var a = anim; anim = null; pv = {}; render(); MV.changed(); if (a && a.fin) a.fin(); }
  function later(ms, fn){ var a = anim; if (!a) return; var t = MV.wait(ms, function(){ if (anim === a) fn(); }); a.stops.push(function(){ clearTimeout(t); }); }
  function tw(dur, step, done){ var a = anim; if (!a) return; var stop = MV.tween({ dur:dur, step:function(t){ if (anim === a) step(t); }, done:function(){ if (anim === a) done(); } }); a.stops.push(stop); }
  function lightUp(dur, fin){ var n = current().length; pv.lit = 0; paintAll(); tw(dur, function(t){ pv.lit = Math.round(t * n); paintGrid(); }, fin || endAnim); }
  function fillHist(dur, fin){ pv.hc = 0; paintAll(); tw(dur, function(t){ pv.hc = Math.round(t * 100); paintHist(); }, fin || endAnim); }

  // --- painting ---
  function render(){ sanitize(); methR.set(S.m); paintSize(); paintSet(); paintAll(); }
  function paintAll(){ paintGrid(); paintBar(); paintHist(); paintRead(); paintCap(); paintAha(); paintSeed(); }
  function hidden(){ return !!pv.hide; }
  function busyLit(){ return pv.lit != null; }
  function byGrade(sample){ var c = [0, 0, 0, 0]; sample.forEach(function(i){ c[POP[i].g]++; }); return c; }
  function mName(){
    var c = cfg();
    if (c.m === "sys") return "Systematic (interval " + c.k + ", start " + c.s + ")";
    if (c.m === "strat") { var T = c.st.reduce(sum, 0); return T && stratAlloc(T).join() === c.st.join() ? "Stratified, proportional" : "Stratified"; }
    if (c.m === "clus") return "Cluster (homeroom" + (c.cl.length > 1 ? "s " : " ") + listAnd(c.cl.map(function(x){ return x + 1; })) + ")";
    return METHODS.filter(function(m){ return m.id === c.m; })[0].t;
  }
  function listAnd(a){ return a.length <= 1 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
  function histLab(c){ return c.m === "sys" ? "Systematic, interval " + c.k : c.m === "clus" ? "Cluster, " + c.cl.length + " homeroom" + (c.cl.length > 1 ? "s" : "") : METHODS.filter(function(m){ return m.id === c.m; })[0].t.replace(/ \(.*\)/, "") + ", n = " + sizeOf(c); }
  function binW(c){ return sizeOf(c) <= 10 ? 10 : 5; }
  function paintGrid(){
    var smp = current(), st = stat(smp), g = byGrade(smp);
    if (hidden()) grid.light([], 0); else grid.light(smp, pv.lit);
    grid.label(hidden() ? "The school: 400 students in 20 homerooms. The sample is hidden until the reveal." :
      mName() + " sample of " + st.n + ": " + g.join(", ").replace(/, (\d+)$/, " and $1") + " by grade; " + (st.n ? pc(st.p) : "none") + " play a sport; the true value is 46.5%.");
  }
  function paintBar(){
    var st = stat(current()), hide = hidden() || busyLit(), w = hide || st.p == null ? 0 : st.p;
    $("#sm-bar", host).innerHTML = '<div class="sm-brow"><span class="sm-blab">Plays a sport</span><div class="sm-track" role="img" aria-label="' + (hide ? "Sample proportion hidden" : "Sample proportion " + (st.p == null ? "none" : pc(st.p))) + '; parameter 46.5%"><div class="sm-fill" style="width:' + w + '%"></div><div class="sm-par" style="left:' + PAR + '%"></div></div><span class="sm-bval">' + (hide ? "?" : st.p == null ? "—" : pc(st.p)) + "</span></div>" +
      '<div class="sm-scale" aria-hidden="true"><span>0%</span><span class="sm-pl" style="left:' + PAR + '%">parameter 46.5%</span><span>100%</span></div>';
  }
  function paintHist(){
    var box = $("#sm-histbox", host), show = !hidden() && (S.rep || !!pv.hist);
    var was = box.hidden; box.hidden = !show; if (!show) return;
    var c = cfg(), main = pv.hist || { props:repProps(c, S.seed), label:histLab(c), w:binW(c) }, g = pv.hist || pv.noGhost ? null : ghost;
    var sp = spread(main.props);
    drawHist(hplot, { props:main.props, count:pv.hc, label:main.label, ghost:g, w:main.w, describe:"Histogram of 100 sample proportions, " + MV.plain(main.label) +
      (sp ? ": centred near " + pc(sp.mean) + ", middle 95% from " + pc(sp.lo) + " to " + pc(sp.hi) : "") + (g ? ". Dashed outline: " + MV.plain(g.label) + "." : "") + " The teal line marks the parameter, 46.5%." });
    if (was) MV.wait(0, function(){ if (!box.hidden) paintHist(); });
  }
  function paintRead(){
    var c = cfg(), smp = current(), st = stat(smp), hide = hidden() || busyLit(), Q = '<span class="sm-q">?</span>', rows = [];
    rows.push(["Method", mName()]);
    rows.push(["Sample size", String(st.n)]);
    rows.push(["Sample by grade", hide ? Q : byGrade(smp).map(function(v, g){ return "Gr " + GRADES[g].g + ": " + v; }).join(" · ")]);
    rows.push(["Statistic: sample proportion", hide ? Q : st.n ? "<strong>" + pc(st.p) + "</strong> (" + st.k + " of " + st.n + ")" : "— (empty sample)"]);
    rows.push(["Parameter: population proportion", "46.5% (186 of 400)"]);
    rows.push(["Difference", hide ? Q : st.n ? (st.p - PAR > 0.04 ? "+" : "") + d1(st.p - PAR) + " percentage points" : "—"]);
    if (c.m === "sys") { var pk = sysPicks(c.k, c.s).map(function(i){ return i + 1; }); rows.push(["Systematic picks", hide && !busyLit() ? Q : (pk.length > 3 ? pk.slice(0, 3).join(", ") + ", …" : pk.join(", ")) + " (interval " + c.k + ")"]); }
    if (S.rep && !hidden()) {
      var sp = spread(repProps(c, S.seed)), gs = ghost && !pv.hist ? spread(ghost.props) : null;
      rows.push(["Repeated samples", sp ? "Centre of 100 results ≈ <strong>" + pc(sp.mean) + "</strong>; middle 95%: " + pc(sp.lo) + " to " + pc(sp.hi) + (gs ? ' <span class="tiny muted">(dashed, ' + ghost.label + ": " + pc(gs.lo) + " to " + pc(gs.hi) + ")</span>" : "") : "—"]);
    }
    rows.push(["Margin of error (95%)", !RANDOM[c.m] ? "not meaningful: non-random" : st.n ? "<strong>" + moeTxt(moe(st.n)) + "</strong> " + '<span class="tiny muted">(≈ ' + M("2√{p(1 - p)/n}") + ", with " + M("p") + " = 0.465" + (c.m === "clus" ? "; the simple-random formula: cluster samples vary more" : "") + ")</span>" : "—"]);
    var rd = $("#sm-read", host); MV.keepFocus(rd, function(){ rd.innerHTML = MV.readoutHTML(rows); });
  }
  function paintCap(){ var st = stat(current()); $("#sm-cap", host).innerHTML = "Statistic " + (hidden() || busyLit() ? "?" : st.p == null ? "—" : pc(st.p)) + " vs parameter 46.5%"; }
  function paintAha(){
    var a = $("#sm-aha", host), t = "";
    if (S.rep && !hidden()) t = RANDOM[S.m] ? "Random methods scatter around the truth, and bigger samples scatter less." : "This method centres on the wrong value: a bigger sample just makes it confidently wrong.";
    a.innerHTML = t; a.hidden = !t;
  }
  function paintSeed(){ $("#sm-seed", host).textContent = "Seed " + S.seed + ", draw " + (S.d + 1) + ". The same seed and settings give the same samples on any device; New seed gives fresh draws."; }
  function paintSize(){
    var box = $("#sm-size", host), want = S.m === "sys" ? "sys" : S.m === "clus" ? "clus" : "n";
    if (sizeBuilt !== want) {
      sizeBuilt = want;
      box.innerHTML = want === "sys" ? '<p class="tiny sm-note">In a systematic sample, the interval and the start set the sample size.</p>' :
        '<label class="slider sm-slider"><span class="slider-top"><span>' + (want === "clus" ? "Homerooms (20 students each)" : "Sample size") + '</span><output id="sm-nout"></output></span><input type="range" id="sm-n" data-k="smn" min="' + (want === "clus" ? 1 : 10) + '" max="' + (want === "clus" ? 5 : 100) + '" step="' + (want === "clus" ? 1 : 10) + '"></label>';
    }
    if (want === "sys") return;
    var v = want === "clus" ? S.cl.length : S.n, inp = $("#sm-n", box);
    if (+inp.value !== v) inp.value = v;
    inp.setAttribute("aria-valuetext", want === "clus" ? v + " homeroom" + (v > 1 ? "s" : "") + ", " + 20 * v + " students" : v + " students");
    $("#sm-nout", box).textContent = want === "clus" ? v + " (" + 20 * v + " students)" : String(v);
  }
  function stepperHTML(id, lab, v, lo, hi){
    return '<div class="sm-step"><span class="sm-sl" id="sm-l-' + id + '">' + lab + '</span><button type="button" class="btn ghost sm sm-stb" data-sp="' + id + '|-1" data-k="sm' + id + 'm" aria-label="' + lab + ' down"' + (v <= lo ? " disabled" : "") + ">−</button>" +
      '<span class="sm-spin" role="spinbutton" tabindex="0" data-spin="' + id + '" data-k="sm' + id + 'v" aria-labelledby="sm-l-' + id + '" aria-valuenow="' + v + '" aria-valuemin="' + lo + '" aria-valuemax="' + hi + '">' + v + "</span>" +
      '<button type="button" class="btn ghost sm sm-stb" data-sp="' + id + '|1" data-k="sm' + id + 'p" aria-label="' + lab + ' up"' + (v >= hi ? " disabled" : "") + ">+</button></div>";
  }
  function paintSet(){
    var box = $("#sm-setb", host), h = "";
    if (S.m === "srs") h = '<p class="tiny">A random number generator picks ' + M("n") + " different student numbers from 1 to 400: every student, and every group of " + M("n") + ", has the same chance.</p>";
    else if (S.m === "sys") {
      var pk = sysPicks(S.k, S.s).map(function(i){ return i + 1; });
      h = stepperHTML("k", "Interval", S.k, 1, 100) + stepperHTML("s", "Start", S.s, 1, 100) +
        '<p class="tiny">Picks: ' + (pk.length > 4 ? pk.slice(0, 3).join(", ") + ", …, " + pk[pk.length - 1] : pk.join(", ")) + " (" + pk.length + " student" + (pk.length > 1 ? "s" : "") + '). <span class="muted">Draw one sample picks a random start.</span></p>';
    } else if (S.m === "strat") {
      var T = S.st.reduce(sum, 0);
      h = S.st.map(function(v, g){ return stepperHTML("g" + g, "Gr " + GRADES[g].g, v, 0, GSIZE[g]); }).join("") +
        '<p class="tiny">Total: <strong>' + T + '</strong>. Within each grade, students are chosen at random.</p><div class="q-actions"><button type="button" class="btn ghost sm" id="sm-alloc" data-k="smalloc">Allocate proportionally</button><span class="tiny muted">(for the slider’s ' + S.n + ")</span></div>";
    } else if (S.m === "clus") {
      var row = 0;
      h = '<div class="sm-rooms" role="group" aria-label="Homerooms in the sample">' + GRADES.map(function(G, gi){
        var s = '<div class="sm-rrow"><span class="sm-rl">Gr ' + G.g + "</span>";
        for (var k = 0; k < G.rooms; k++, row++) { var on = S.cl.indexOf(row) >= 0; s += '<button type="button" class="sm-room" data-room="' + row + '" data-k="smr' + row + '" aria-pressed="' + on + '" aria-label="Homeroom ' + (row + 1) + ", Grade " + G.g + '"' + ((!on && S.cl.length >= 5) || (on && S.cl.length <= 1) ? " disabled" : "") + ">" + (row + 1) + "</button>"; }
        return s + "</div>";
      }).join("") + '</div><div class="q-actions"><button type="button" class="btn ghost sm" id="sm-pick" data-k="smpick">Pick randomly</button></div><p class="tiny muted">Up to 5 homerooms; everyone in a chosen homeroom is surveyed.</p>';
    } else if (S.m === "conv") h = '<p class="tiny">Survey ' + M("n") + ' students in the gym after school. <span class="mdm-model">model data</span> Sport players are 3 times as likely to be there.</p>';
    else h = '<p class="tiny">Post an online poll and take the first ' + M("n") + ' replies. <span class="mdm-model">model data</span> Sport players are twice as likely to answer.</p>';
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }

  // --- actions ---
  function changed(){ save(); render(); MV.changed(); }
  function stepVal(id, d){
    user();
    if (id === "k") S.k = clamp(S.k + d, 1, 100);
    else if (id === "s") S.s = clamp(S.s + d, 1, 100);
    else { var g = +id.slice(1); S.st[g] = clamp(S.st[g] + d, 0, GSIZE[g]); }
    changed();
  }
  function setRooms(k){
    var cl = S.cl.slice();
    if (k < cl.length) cl = cl.slice(0, k);
    else if (k > cl.length) { var free = range(20).filter(function(x){ return cl.indexOf(x) < 0; }); cl = cl.concat(pickK(free, k - cl.length, rng("mdm29-add|" + S.seed + "|" + S.d + "|" + cl.join(".")))); }
    S.cl = cl.sort(byNum);
  }
  function drawSample(){
    user(); S.d++;
    var r = rng("mdm29-pick|" + S.seed + "|" + S.d);
    if (S.m === "clus") S.cl = roomsRandom(S.cl.length, r);
    if (S.m === "sys") S.s = 1 + r.int(S.k);
    save(); render(); MV.changed();
    newAnim(); lightUp(MV.reduceMotion ? 0 : Math.min(900, 22 * current().length));
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.closest(".rg")) return;
    if (b.dataset.sp) { var q = b.dataset.sp.split("|"); stepVal(q[0], +q[1]); return; }
    if (b.id === "sm-alloc") { user(); S.st = stratAlloc(S.n); changed(); return; }
    if (b.dataset.room != null) {
      user(); var rm = +b.dataset.room, i = S.cl.indexOf(rm);
      if (i >= 0) { if (S.cl.length > 1) S.cl.splice(i, 1); } else if (S.cl.length < 5) { S.cl.push(rm); S.cl.sort(byNum); }
      changed(); return;
    }
    if (b.id === "sm-pick" || b.id === "sm-one") { drawSample(); return; }
    if (b.id === "sm-rep") { user(); S.rep = true; save(); newAnim(); fillHist(MV.reduceMotion ? 0 : 1200); return; }
    if (b.id === "sm-new") { user(); S.seed = S.seed % 999 + 1; S.d = 0; changed(); return; }
  });
  host.addEventListener("keydown", function(e){
    var t = e.target.closest && e.target.closest("[data-spin]"); if (!t) return;
    var id = t.dataset.spin, d = { ArrowUp:1, ArrowRight:1, ArrowDown:-1, ArrowLeft:-1, PageUp:10, PageDown:-10 }[e.key];
    if (e.key === "Home" || e.key === "End") { var lo = +t.getAttribute("aria-valuemin"), hi = +t.getAttribute("aria-valuemax"), now = +t.getAttribute("aria-valuenow"); d = (e.key === "Home" ? lo : hi) - now; }
    if (!d) return; e.preventDefault(); stepVal(id, d);
  });
  host.addEventListener("input", function(e){
    if (e.target.id !== "sm-n") return;
    user(); var v = +e.target.value;
    if (S.m === "clus") setRooms(clamp(v, 1, 5)); else S.n = clamp(Math.round(v / 10) * 10, 10, 100);
    changed();
  });

  render();

  // --- predictions ---
  function startPred(p){
    user();
    var st = p.start || {};
    S.m = st.m; S.rep = false;
    if (st.n) S.n = st.n;
    if (st.m === "sys") { S.k = st.k; S.s = st.s; }
    if (st.m === "clus") S.cl = roomsRandom(st.rooms, rng("mdm29-p4"));
    pv = { hide:true }; save(); render();
  }
  function runPred(p, done){
    newAnim(done);
    var c = cfg(), fast = MV.reduceMotion;
    if (p.id === "p1") { S.rep = true; save(); pv = {}; fillHist(fast ? 0 : 1500); return; }
    if (p.id === "p3") { pv = {}; lightUp(fast ? 0 : 2000); return; }
    // p2 / p4: a first histogram fills, then stays as a dashed outline while the second fills
    var first = p.id === "p2" ? { m:"srs", n:25, k:10, s:1, st:[0, 0, 0, 0], cl:[] } : { m:"srs", n:40, k:10, s:1, st:[0, 0, 0, 0], cl:[] };
    var fl = p.id === "p2" ? "n = 25" : "Simple random, n = 40", props = repProps(first, S.seed);
    ghost = { props:props, label:fl }; S.rep = true; save();
    pv = { hist:{ props:props, label:fl, w:5 }, hc:0 }; paintAll();
    tw(fast ? 0 : 1100, function(t){ pv.hc = Math.round(t * 100); paintHist(); }, function(){
      later(fast ? 0 : 900, function(){ pv = { hc:0 }; paintAll(); tw(fast ? 0 : 1100, function(t){ pv.hc = Math.round(t * 100); paintHist(); }, endAnim); });
    });
  }

  // --- challenges ---
  function chal(id){
    var R = function(m){ return { ok:false, msg:MV.md(m) }; };
    if (id === "tc1") {
      if (S.m !== "strat") return R("Choose <strong>Stratified</strong>.");
      var st = S.st, T = st.reduce(sum, 0);
      if (st.join() === "12,10,10,8") return { ok:true };
      if (st.join() === "10,10,10,10") return R("Equal numbers over-represent Grade 12 (80 students) and under-represent Grade 9 (120).");
      if (T !== 40) return R("The four groups must add to 40. Right now they add to " + T + ".");
      return R("Not proportional yet. Grade 9 is 120 ÷ 400 = 30% of the school, so it needs 30% of 40; do the same for each grade.");
    }
    if (id === "tc2") {
      if (S.m !== "sys") return R("Choose <strong>Systematic</strong>.");
      if (S.k === 8 && S.s >= 1 && S.s <= 8) return { ok:true };
      if (S.k === 50) return R("That’s the sample size. Interval = 400 ÷ 50 = 8.");
      if (S.k === 8) return R("Start within the first interval (1 to 8) so every student can be chosen.");
      if (S.k === 10) return R("That gives 40, not 50.");
      return R("Interval " + S.k + " with start " + S.s + " gives " + sysPicks(S.k, S.s).length + " students, not 50. " + "Interval = population ÷ sample size.");
    }
    if (id === "tc3") {
      if (S.m === "conv" || S.m === "vol") return R("A margin of error only means something for random samples.");
      if (S.m !== "srs") return R("Use <strong>Simple random</strong> samples.");
      if (S.n === 100) return { ok:true };
      if (S.n === 90) return R("Close, but the readout shows 10.5%.");
      if (S.n === 50) return R("The margin is about 14%.");
      return R("At " + M("n") + " = " + S.n + " the margin is " + moeTxt(moe(S.n)) + ": more than 10 points.");
    }
    return { ok:false };
  }

  return { predict:{ start:startPred, run:runPred }, challenge:function(id){ return chal(id); } };
}

// ---------- hero: random 40 (47.5%) vs 40 by the gym door (72.5%) ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var plot = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }), aria = cv.getAttribute("aria-label") || "", cap = f.cap;
  // a simple random sample of 40 with exactly 19 sport players (seed found by a fixed search, so it never changes)
  var rand40 = null;
  for (var s = 1; s < 500 && !rand40; s++) { var smp = pickK(ALL, 40, rng("mdm29-hero|" + s)); if (stat(smp).k === 19) rand40 = smp; }
  // the gym door is at the top left: the 29 sport players and 11 others nearest to it
  function dist(i){ var p = POP[i]; return Math.hypot(p.c + 0.5, p.room + 0.5); }
  var near = ALL.slice().sort(function(a, b){ return dist(a) - dist(b) || a - b; });
  var gym40 = near.filter(function(i){ return POP[i].sport; }).slice(0, 29).concat(near.filter(function(i){ return !POP[i].sport; }).slice(0, 11));
  gym40.sort(function(a, b){ return dist(a) - dist(b); });
  var st = { lit:[], litN:0, b1:null, b2:null, door:false, tick:"", cap:"" };
  plot.render = function(){
    var r = plot.c.getBoundingClientRect(), W0 = Math.max(200, r.width), H0 = Math.max(110, r.height);
    plot.draw({ view:{ xmin:0, xmax:W0, ymin:0, ymax:H0 }, grid:false, axes:false, ticks:false, describe:aria, after:function(ctx, p){
      var W = p.W, H = p.H, top = 18, side = Math.min(H - top - 6, W * 0.52), cell = side / 20, L = 30, x0 = L, y0 = top;
      var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), teal = css("--f3"), sheet = css("--sheet"), fs = Math.max(10, Math.min(13, cell * 1.1));
      var tints = ["--ev-a-soft", "--ev-b-soft", "--ev-c-soft", "--hi-soft"].map(css), row = 0;
      ctx.save(); ctx.font = fs + "px " + p.fontUI; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      GRADES.forEach(function(G, gi){ ctx.fillStyle = tints[gi]; ctx.fillRect(x0 - 2, y0 + row * cell, side + 4, G.rooms * cell); ctx.fillStyle = ink; ctx.fillText("Gr " + G.g, x0 - 5, y0 + (row + G.rooms / 2) * cell); row += G.rooms; });
      var on = {}; for (var i = 0; i < st.litN && i < st.lit.length; i++) on[st.lit[i]] = 1;
      var rr = Math.max(1.6, cell * 0.3);
      POP.forEach(function(q){
        var cx = x0 + (q.c + 0.5) * cell, cy = y0 + (q.room + 0.5) * cell, lit = !!on[q.i];
        ctx.beginPath(); ctx.arc(cx, cy, lit ? rr * 1.35 : rr, 0, Math.PI * 2);
        if (lit) { ctx.fillStyle = pen; ctx.fill(); } else { ctx.globalAlpha = 0.6; ctx.fillStyle = ink2; ctx.fill(); ctx.globalAlpha = 1; }
      });
      // gym door (top left)
      ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.font = "700 " + fs + "px " + p.fontUI;
      ctx.fillStyle = st.door ? css("--p-k") : ink2; ctx.fillRect(x0 - 2, y0 - 5, cell * 3, 3);
      ctx.fillText(st.door ? "gym door: open" : "gym door", x0 + cell * 3 + 4, y0 - 1);
      if (st.tick) { ctx.textAlign = "right"; ctx.fillStyle = ink; ctx.fillText(st.tick, x0 + side, y0 - 1); }
      // bars
      var bx0 = x0 + side + 26, bw = Math.min(64, (W - bx0 - 10) / 2.6), gap = bw * 0.5, bt = y0 + 16, bb = y0 + side - 16, bh = bb - bt;
      var Y = function(v){ return bb - v / 100 * bh; };
      ctx.strokeStyle = ink2; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(bx0 - 6, bb + 0.5); ctx.lineTo(bx0 + 2 * bw + gap + 6, bb + 0.5); ctx.stroke();
      [[st.b1, "random 40"], [st.b2, "gym 40"]].forEach(function(b, k){
        var x = bx0 + k * (bw + gap);
        ctx.font = fs + "px " + p.fontUI; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillStyle = ink; ctx.fillText(b[1], x + bw / 2, bb + 4);
        if (b[0] == null) return;
        ctx.fillStyle = k === 0 ? pen : css("--p-k"); ctx.fillRect(x, Y(b[0]), bw, bb - Y(b[0]));
        ctx.font = "700 " + fs + "px " + p.fontUI; ctx.textBaseline = "bottom"; ctx.fillStyle = ink; ctx.fillText(pc(b[0]), x + bw / 2, Y(b[0]) - 2);
      });
      var py = Y(PAR); ctx.strokeStyle = teal; ctx.lineWidth = 2.4; ctx.setLineDash([7, 5]); ctx.beginPath(); ctx.moveTo(bx0 - 8, py); ctx.lineTo(bx0 + 2 * bw + gap + 8, py); ctx.stroke(); ctx.setLineDash([]);
      ctx.font = "700 " + fs + "px " + p.fontUI; ctx.textAlign = "left"; ctx.textBaseline = "middle"; var tx = bx0 + 2 * bw + gap + 12;
      if (tx + 40 < W) { ctx.fillStyle = teal; ctx.fillText("46.5%?", tx, py); ctx.font = fs + "px " + p.fontUI; ctx.fillText("parameter", tx, py + fs + 2); }
      if (st.cap) { ctx.font = "700 " + (fs + 2) + "px " + p.fontUI; ctx.textAlign = "right"; ctx.textBaseline = "top"; var cw = ctx.measureText(st.cap).width; ctx.fillStyle = sheet; ctx.fillRect(W - cw - 10, 2, cw + 8, fs + 8); ctx.fillStyle = ink; ctx.fillText(st.cap, W - 6, 4); }
      ctx.restore();
    } });
  };
  function last(){
    st = { lit:gym40, litN:40, b1:47.5, b2:72.5, door:true, tick:"", cap:"Same size. Very different answer." };
    plot.render(); cap.textContent = "Same size. Very different answer: a random 40 gives 47.5%, close to the true 46.5%; the 40 students by the gym door give 72.5%.";
  }
  if (MV.reduceMotion) { last(); return; }
  plot.render(); cap.textContent = "The school: 400 students, one row per homeroom, banded by grade";
  function tw(dur, fn, done){ MV.tween({ dur:dur, step:fn, done:done }); }
  MV.wait(800, function(){
    cap.textContent = "A random number generator lights 40 students scattered across the school";
    st.lit = rand40;
    tw(1800, function(t){ st.litN = Math.round(t * 40); var k = st.lit[Math.max(0, st.litN - 1)]; st.tick = "#" + (k + 1); plot.render(); }, function(){
      st.tick = ""; cap.textContent = "Sample statistic: 47.5% play a sport. The parameter is 46.5%";
      tw(900, function(t){ st.b1 = 47.5 * t; plot.render(); }, function(){
        MV.wait(1200, function(){
          cap.textContent = "Now the gym door opens: ask 40 students nearby";
          st.door = true; st.lit = gym40; st.litN = 0;
          tw(700, function(t){ st.litN = Math.round(t * 40); plot.render(); }, function(){
            tw(900, function(t){ st.b2 = 72.5 * t; plot.render(); }, function(){ MV.wait(400, last); });
          });
        });
      });
    });
  });
}

// ---------- Part 3: Margins of error (four stations and Check it with data) ----------
function polls(seed){ var r = rng("mdm29-polls|" + seed), out = []; for (var i = 0; i < 20; i++) { var k = 0; for (var j = 0; j < 400; j++) if (r() < 0.5) k++; out.push(k / 4); } return out; }
function hit(p){ return Math.abs(p - 50) <= 5 + 1e-9; }
var DEMO = null;
function demoSeed(){ if (DEMO == null) { for (var s = 0; s < 400; s++) if (polls(s).filter(hit).length === 19) { DEMO = s; break; } if (DEMO == null) DEMO = 0; } return DEMO; }

function part3(host, api){
  var S = api.S, P3 = api.content || {}, ST = P3.stations || [];
  if (!ST.length) return {};
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = ST[0].id;
  S.x = obj(S.x); S.n2 = clampI(S.n2, 100, 2500, 400); S.run = clampI(S.run, -1, 1e6, -1);
  var msgs = {}, tabsR = null, pollT = null, shown = S.run >= 0 ? 20 : 0;
  function xs(id){ var x = S.x[id] = obj(S.x[id]); x.tries = x.tries || 0; if (!Array.isArray(x.b)) x.b = [null, null, null]; x.sel = clampI(x.sel, 0, 2, 0); return x; }
  function st(id){ return ST.filter(function(s){ return s.id === id; })[0]; }
  var tabOpts = ST.map(function(s){ return { id:s.id, t:"" }; });
  function tabText(){ ST.forEach(function(s, i){ tabOpts[i].t = "Station " + (i + 1) + ": " + s.title + (xs(s.id).solved ? ' <span class="mo-tick" aria-label="done">✓</span>' : ""); }); }
  host.innerHTML = '<div id="mo-tabs"></div><div id="mo-body" class="mo-body"></div>' +
    '<details class="alg mo-data" id="mo-data"' + (S.open ? " open" : "") + '><summary>Check it with data</summary><p class="tiny">Each run takes 20 random samples of 400 from a population with 50% support and draws each poll’s interval, statistic ± 5% (' + M("1/√400") + '). <span class="mdm-model">model data</span></p>' +
    '<div class="q-actions"><button type="button" class="btn sm" id="mo-run" data-k="morun"></button></div><div id="mo-polls"></div><p class="tiny" id="mo-pr" aria-live="polite"></p></details>';
  tabText();
  tabsR = radios($("#mo-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; api.save(); paint(); } });

  function fbOf(s, x){
    if (x.solved) return MV.fbHTML("good", "<strong>✓ Correct.</strong> " + x.why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    return msgs[s.id] ? MV.fbHTML("bad", msgs[s.id]) : "";
  }
  function s1HTML(s){
    var x = xs(s.id), blank = function(k){
      var v = x.b[k];
      return '<button type="button" class="mo-blank' + (x.sel === k && !x.solved ? " sel" : "") + '" data-blank="' + k + '" data-k="mob' + k + '" aria-pressed="' + (x.sel === k && !x.solved) + '" aria-label="Blank ' + (k + 1) + ": " + (v ? MV.esc(v) : "empty") + '"' + (x.solved ? " disabled" : "") + ">" + (v || "&nbsp;?&nbsp;") + "</button>";
    };
    var h = '<p class="mo-text">' + s.text + "</p>" +
      '<p class="mo-sent">' + s.parts[0] + " " + blank(0) + " " + s.parts[1] + " " + blank(1) + s.parts[2] + " " + blank(2) + " " + s.parts[3] + "</p>";
    if (!x.solved) h += '<div class="mo-bank" role="group" aria-label="Chips">' + s.bank.map(function(c, j){ return '<button type="button" class="chip mo-chip" data-chip="' + j + '" data-k="moc' + j + '">' + c + "</button>"; }).join("") + "</div>" +
      '<div class="q-actions"><button type="button" class="btn primary sm" data-mochk="s1" data-k="mos1chk">Check</button><button type="button" class="btn ghost sm" id="mo-clear" data-k="moclr">Clear</button></div>';
    return h + fbOf(s, x);
  }
  function choiceHTML(s, list, prompt){
    var x = xs(s.id);
    return '<p class="mo-q">' + prompt + '</p><div class="mo-opts" role="group" aria-label="' + MV.esc(MV.plain(prompt)) + '">' + list.map(function(o, j){
      return '<button type="button" class="btn ghost sm mo-opt' + (x.solved && MV.ok(o) ? " right" : "") + '" data-opt="' + s.id + "|" + j + '" data-k="mo' + s.id + "o" + j + '"' + (x.solved ? " disabled" : "") + ">" + MV.md(o.t) + "</button>"; }).join("") + "</div>" + fbOf(s, x);
  }
  function mTxt(n){ var v = 100 / Math.sqrt(n), ex = Math.abs(v * 10 - Math.round(v * 10)) < 1e-9; return (ex ? "±" : "≈ ±") + pc(v); }
  function s2HTML(s){
    var n = S.n2, rows = [100, 400, 1000, 2500];
    return '<p class="mo-text">' + MV.md(s.text) + "</p>" +
      '<label class="slider mo-sl"><span class="slider-top"><span>Sample size ' + M("n") + '</span><output id="mo-nout">' + MV.mdm.fmt(n) + '</output></span><input type="range" id="mo-n" data-k="mon" min="100" max="2500" step="100" value="' + n + '" aria-valuetext="' + n + ' people"></label>' +
      '<dl class="read" id="mo-r2" aria-live="polite">' + MV.readoutHTML([["Margin ≈ " + M("1/√n"), "<strong>" + mTxt(n) + "</strong>"]]) + "</dl>" +
      MV.tableHTML({ head:[M("n"), "Margin"], caption:"Margin of error by sample size", hiRow:rows.indexOf(n) >= 0 ? rows.indexOf(n) : null, rows:rows.map(function(v){ return [MV.mdm.fmt(v), mTxt(v).replace("±", "")]; }) }) +
      choiceHTML(s, s.options, s.prompt);
  }
  function s3HTML(s){
    var X = function(v){ return 30 + (v - 30) * 12.5; };
    var svg = '<svg class="mo-iv" viewBox="0 0 300 116" role="img" aria-label="Two intervals on a scale from 30% to 50%: Party A from 37% to 45% with its estimate 41%, Party B from 34% to 42% with its estimate 38%. They overlap from 37% to 42%.">' +
      '<rect class="mo-ov" x="' + X(37) + '" y="8" width="' + (X(42) - X(37)) + '" height="70"/>' +
      [[41, 37, 45, 26, "A"], [38, 34, 42, 60, "B"]].map(function(q){ return '<line class="mo-ivl" x1="' + X(q[1]) + '" x2="' + X(q[2]) + '" y1="' + q[3] + '" y2="' + q[3] + '"/><line class="mo-ivl" x1="' + X(q[1]) + '" x2="' + X(q[1]) + '" y1="' + (q[3] - 6) + '" y2="' + (q[3] + 6) + '"/><line class="mo-ivl" x1="' + X(q[2]) + '" x2="' + X(q[2]) + '" y1="' + (q[3] - 6) + '" y2="' + (q[3] + 6) + '"/><circle class="mo-ivd" cx="' + X(q[0]) + '" cy="' + q[3] + '" r="4.5"/><text class="mo-ivt" x="' + (X(q[1]) - 6) + '" y="' + (q[3] + 4) + '" text-anchor="end">' + q[4] + "</text><text class=\"mo-ivs\" x=\"" + X(q[0]) + '" y="' + (q[3] - 9) + '" text-anchor="middle">' + q[0] + "%</text>"; }).join("") +
      '<line class="mo-ax" x1="30" x2="280" y1="88" y2="88"/>' + [30, 35, 40, 45, 50].map(function(v){ return '<line class="mo-ax" x1="' + X(v) + '" x2="' + X(v) + '" y1="85" y2="91"/><text class="mo-axt" x="' + X(v) + '" y="106" text-anchor="middle">' + v + "%</text>"; }).join("") + "</svg>";
    return '<p class="mo-text">' + s.text + "</p>" + svg + '<p class="tiny muted">Shaded: where the two intervals overlap (37% to 42%).</p>' + choiceHTML(s, s.choices, s.prompt);
  }
  function s4HTML(s){ return '<p class="mo-text">' + s.text + "</p>" + choiceHTML(s, s.options, s.prompt); }
  function paint(){
    tabText(); tabsR.refresh();
    var s = st(S.cur), body = $("#mo-body", host), inner = s.id === "s1" ? s1HTML(s) : s.id === "s2" ? s2HTML(s) : s.id === "s3" ? s3HTML(s) : s4HTML(s);
    MV.keepFocus(body, function(){ body.innerHTML = '<div class="mo-card"><span class="mo-lab">Station ' + (ST.indexOf(s) + 1) + " · " + s.title + "</span>" + inner + "</div>"; });
    paintPolls();
  }
  function judgeS1(s){
    var x = xs("s1"), A = MV.ans(s);
    if (x.b.some(function(v){ return !v; })) { msgs.s1 = "Fill all three blanks first."; return; }
    var bad = []; x.b.forEach(function(v, k){ if (v !== A[k]) bad.push((s.fb || {})[v] || "Check blank " + (k + 1) + "."); });
    if (!bad.length) { x.solved = true; x.first = x.tries === 0; x.why = s.why; msgs.s1 = null; }
    else { x.tries++; msgs.s1 = "<strong>✗ Not quite.</strong> " + bad.filter(function(v, i, a){ return a.indexOf(v) === i; }).join(" ") + " Try again."; }
  }
  // Check it with data
  function pollsNow(){ return polls(S.run <= 0 ? demoSeed() : 1000 + S.run); }
  function paintPolls(){
    var b = $("#mo-run", host); b.textContent = S.run < 0 ? "Run 20 polls" : "Run again"; b.disabled = !!pollT;
    var el = $("#mo-polls", host), pr = $("#mo-pr", host);
    if (S.run < 0) { el.innerHTML = ""; pr.textContent = ""; return; }
    var ps = pollsNow(), X = function(v){ return 20 + (v - 35) * 9; }, h = '<svg class="mo-pv" viewBox="0 0 300 ' + (20 * 11 + 34) + '" role="img" aria-label="' + MV.esc(ps.slice(0, shown).map(function(p, i){ return "Poll " + (i + 1) + ": " + pc(p - 5) + " to " + pc(p + 5) + (hit(p) ? "" : ", misses 50%"); }).join("; ") || "No polls yet") + '">';
    ps.forEach(function(p, i){ if (i >= shown) return; var y = 10 + i * 11, ok = hit(p);
      h += '<line class="mo-pl ' + (ok ? "in" : "out") + '" x1="' + X(p - 5) + '" x2="' + X(p + 5) + '" y1="' + y + '" y2="' + y + '"/><circle class="mo-pd ' + (ok ? "in" : "out") + '" cx="' + X(p) + '" cy="' + y + '" r="2.6"/>' + (ok ? "" : '<text class="mo-px" x="' + (X(p + 5) + 5) + '" y="' + (y + 4) + '">✗ misses</text>'); });
    var ya = 20 * 11 + 6;
    h += '<line class="mo-pt" x1="' + X(50) + '" x2="' + X(50) + '" y1="2" y2="' + ya + '"/><line class="mo-ax" x1="20" x2="290" y1="' + ya + '" y2="' + ya + '"/>' +
      [35, 40, 45, 50, 55, 60, 65].map(function(v){ return '<text class="mo-axt" x="' + X(v) + '" y="' + (ya + 16) + '" text-anchor="middle">' + v + "%</text>"; }).join("") + "</svg>";
    el.innerHTML = h;
    var k = ps.slice(0, shown).filter(hit).length;
    pr.innerHTML = shown < 20 ? "Polling… " + shown + " of 20" : "<strong>" + k + " of 20</strong> intervals contain the true 50%" + (S.run === 0 ? " (the seeded demonstration run)" : "") + ". At 95% confidence, about 19 in 20 should: runs usually give 18 to 20.";
  }
  function runPolls(){
    S.run++; S.open = true; api.save(); shown = 0;
    if (MV.reduceMotion) { shown = 20; paintPolls(); return; }
    (function next(){ shown++; pollT = shown < 20 ? MV.wait(90, next) : null; paintPolls(); })();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest(".rg")) return;
    var s1 = st("s1"), x1 = xs("s1");
    if (b.dataset.blank != null) { x1.sel = +b.dataset.blank; api.save(); paint(); return; }
    if (b.dataset.chip != null) {
      x1.b[x1.sel] = s1.bank[+b.dataset.chip]; msgs.s1 = null;
      for (var k = 1; k <= 3; k++) { var nx = (x1.sel + k) % 3; if (!x1.b[nx]) { x1.sel = nx; break; } }
      api.save(); paint(); return;
    }
    if (b.id === "mo-clear") { x1.b = [null, null, null]; x1.sel = 0; msgs.s1 = null; api.save(); paint(); return; }
    if (b.dataset.mochk === "s1") { judgeS1(s1); api.save(); paint(); MV.focusFb($("#mo-body", host)); return; }
    if (b.dataset.opt) {
      var q = b.dataset.opt.split("|"), s = st(q[0]), list = s.options || s.choices, o = list[+q[1]], x = xs(s.id);
      if (MV.ok(o)) { x.solved = true; x.first = x.tries === 0; x.why = MV.md(o.why || ""); msgs[s.id] = null; }
      else { x.tries++; msgs[s.id] = "<strong>✗ Not quite.</strong> " + MV.md(o.why || "") + " Try again."; }
      api.save(); paint(); MV.focusFb($("#mo-body", host)); return;
    }
    if (b.id === "mo-run") { runPolls(); return; }
  });
  host.addEventListener("input", function(e){
    if (e.target.id !== "mo-n") return;
    S.n2 = clamp(Math.round(+e.target.value / 100) * 100, 100, 2500); api.save();
    e.target.setAttribute("aria-valuetext", S.n2 + " people");
    $("#mo-nout", host).textContent = MV.mdm.fmt(S.n2);
    $("#mo-r2", host).innerHTML = MV.readoutHTML([["Margin ≈ " + M("1/√n"), "<strong>" + mTxt(S.n2) + "</strong>"]]);
    var rows = [100, 400, 1000, 2500], i = rows.indexOf(S.n2);
    Array.prototype.forEach.call(host.querySelectorAll(".mo-card tbody tr"), function(tr, j){ tr.classList.toggle("hi", j === i); });
  });
  host.addEventListener("toggle", function(e){ if (e.target.id === "mo-data") { S.open = e.target.open; api.save(); } }, true);
  paint();
  return {};
}

// ---------- Practice: Plan it ----------
// @component N4 numEntry (copied from MDM4U 20) — number entry: one box per part, or a chip choice for a part given as
// {t, choices:[…]}; numbers within tol (default 0.01); named wrong answers ({part, match, fb}, match a number or a choice);
// an item-level fb for any other wrong answer; three-level hints when the item has them; first-try scoring as the toolkit's N4.
function num(v){ var s = String(v == null ? "" : v).replace(/[\s  ,]/g, ""); if (!s) return null; var r = MV.parseNum(s); return r && r.length === 1 && isFinite(r[0]) ? r[0] : null; }
function numEntry(host, api, a){
  var st = api.S; st.items = st.items || {};
  var msgs = {};
  function ist(id){ var x = st.items[id] || (st.items[id] = { val:[], tries:0, hint:0, solved:false, first:null }); if (!Array.isArray(x.val)) x.val = []; return x; }
  function partsOf(it){ return it.parts || [it.label || "Your answer:"]; }
  function isCh(p){ return p && typeof p === "object"; }
  function judge(it, vals){
    var ans = MV.ans(it), A = Array.isArray(ans) ? ans : [ans], P = partsOf(it), tol = it.tol || 0.01;
    var got = A.map(function(_, k){ return isCh(P[k]) ? (vals[k] || null) : num(vals[k]); });
    if (got.some(function(v){ return v == null; })) return { bad:true };
    var oks = got.map(function(g, k){ return typeof A[k] === "string" ? g === A[k] : Math.abs(g - A[k]) <= tol + 1e-9; });
    if (oks.every(Boolean)) return { ok:true };
    var named = (it.wrong || []).filter(function(w){ var k = w.part || 0, g = got[k]; return !oks[k] && (typeof w.match === "string" ? g === w.match : typeof g === "number" && Math.abs(g - w.match) <= tol + 1e-9); })[0];
    var fb = named ? named.fb : null;
    if (!fb && A.length > 1) {
      var lab = function(k){ var p = P[k]; return (isCh(p) ? p.t : p).replace(/\s*[=:]\s*$/, ""); };
      var right = oks.map(function(o, k){ return o ? lab(k) : null; }).filter(Boolean), wrong = oks.map(function(o, k){ return o ? null : lab(k); }).filter(Boolean);
      if (right.length) fb = right.join(" and ") + (right.length > 1 ? " are" : " is") + " right. Check " + wrong.join(" and ") + ".";
    }
    return { ok:false, fb:fb || it.fb || null };
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = (a.how === "" ? "" : '<p class="how">' + (a.how || "Type your answer, then press Check.") + "</p>") + a.items.map(function(it, i){
        var x = ist(it.id), P = partsOf(it);
        var h = '<div class="q" data-ne="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + MV.md(it.prompt) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        h += '<div class="ne-row">' + P.map(function(p, k){
          if (isCh(p)) return '<span class="ne-ch"><span class="ne-l">' + p.t + '</span><span class="ne-chips" role="group" aria-label="' + MV.esc(MV.plain(p.t)) + '">' + p.choices.map(function(c, j){
            return '<button type="button" class="ne-c" data-nc="' + it.id + "|" + k + "|" + j + '" data-k="' + it.id + "c" + k + "_" + j + '" aria-pressed="' + (x.val[k] === c) + '"' + (x.solved ? " disabled" : "") + ">" + c + "</button>"; }).join("") + "</span></span>";
          return '<label class="ne-lab" for="ne-' + it.id + k + '"><span>' + p + '</span><input class="numin ne-in" id="ne-' + it.id + k + '" data-nin="' + it.id + '" data-nk="' + k + '" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" value="' + MV.esc(x.val[k] || "") + '"' + (x.solved ? " disabled" : "") + "></label>";
        }).join("") + "</div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + MV.md(it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.nin; if (!id) return; ist(id).val[+e.target.dataset.nk] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.nin) { var b = host.querySelector('[data-k="' + e.target.dataset.nin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ne]"); if (!box) return;
    var it = a.items.filter(function(y){ return y.id === box.dataset.ne; })[0], x = ist(it.id);
    if (b.dataset.nc) { var q = b.dataset.nc.split("|"), part = partsOf(it)[+q[1]]; x.val[+q[1]] = part.choices[+q[2]]; api.save(); paint(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x.val);
      if (r.bad) { msgs[it.id] = (partsOf(it).length > 1 ? "Fill in every part. " : "") + "Enter a whole number, or tap a choice."; paint(); MV.focusFb(host.querySelector('[data-ne="' + it.id + '"]')); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (r.fb ? MV.md(r.fb) + " " : "") + "Try again."; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ne="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; });
      return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Town survey (6000-dot map) ----------
var task = (function(){
  var api = null, plot = null, howR = null, ORD = {};
  var NB = [{ id:"N", t:"North", pop:3000, r0:0, rows:30 }, { id:"C", t:"Centre", pop:2000, r0:30, rows:20 }, { id:"S", t:"South", pop:1000, r0:50, rows:10 }];
  var HOW = [{ id:"addr", t:"random from the town’s address list" }, { id:"mall", t:"the first people met at the mall" }, { id:"flyer", t:"people who reply to a mailed flyer" }];
  var MALL = [72, 31];   // the mall (column, row) sits in Centre, near North
  function st(){ var s = api ? api.S : {}; if (!Array.isArray(s.v) || s.v.length !== 3) s.v = ["", "", ""]; s.v = s.v.map(function(v){ return v == null ? "" : String(v); }); if (!HOW.some(function(h){ return h.id === s.how; })) s.how = ""; return s; }
  function pv(x){ var s = String(x).trim(); return /^\d+$/.test(s) ? +s : null; }
  function read(){ var s = st(), v = s.v.map(pv); return { N:v[0], C:v[1], S:v[2], how:s.how }; }
  function okV(v){ return v != null && v >= 0 && v <= 600 && v % 10 === 0; }
  // the order in which each neighbourhood's dots light up: seeded shuffle, or nearest the mall first
  function order(b, how){
    var k = b + "|" + how; if (ORD[k]) return ORD[k];
    var nb = NB[b], cells = range(nb.pop);
    if (how === "mall") cells.sort(function(p, q){ return dd(p) - dd(q) || p - q; });
    else { var r = rng("mdm29-town|" + how + "|" + b); for (var i = cells.length - 1; i > 0; i--) { var j = r.int(i + 1), t = cells[i]; cells[i] = cells[j]; cells[j] = t; } }
    function dd(c){ var x = c % 100, y = nb.r0 + Math.floor(c / 100); return Math.hypot(x - MALL[0], y - MALL[1]); }
    return (ORD[k] = cells);
  }
  function drawMap(){
    if (!plot) return;
    var d = read(), cnt = [d.N, d.C, d.S].map(function(v){ return okV(v) ? v : 0; }), how = d.how || "addr";
    var r = plot.c.getBoundingClientRect(), W0 = Math.max(200, r.width), H0 = Math.max(120, r.height);
    plot.draw({ view:{ xmin:0, xmax:W0, ymin:0, ymax:H0 }, grid:false, axes:false, ticks:false,
      describe:"Map of the town’s 6000 adults: North 3000, Centre 2000, South 1000. Lit: " + NB.map(function(nb, b){ return cnt[b] + " in " + nb.t; }).join(", ") + (d.how === "mall" ? ", bunched around the mall." : d.how === "flyer" ? ", wherever people chose to reply." : "."),
      after:function(ctx, p){
        var W = p.W, H = p.H, cw = W / 100, ch = H / 60, pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), sheet = css("--sheet");
        var tints = ["--ev-a-soft", "--ev-b-soft", "--ev-c-soft"].map(css);
        ctx.save();
        NB.forEach(function(nb, b){
          ctx.fillStyle = tints[b]; ctx.fillRect(0, nb.r0 * ch, W, nb.rows * ch);
          var on = {}, o = order(b, how); for (var i = 0; i < cnt[b]; i++) on[o[i]] = 1;
          ctx.fillStyle = ink2; ctx.globalAlpha = 0.3;
          for (var c = 0; c < nb.pop; c++) if (!on[c]) ctx.fillRect((c % 100) * cw + cw * 0.25, (nb.r0 + Math.floor(c / 100)) * ch + ch * 0.25, cw * 0.5, ch * 0.5);
          ctx.globalAlpha = 1; ctx.fillStyle = pen;
          Object.keys(on).forEach(function(k){ k = +k; ctx.fillRect((k % 100) * cw + cw * 0.05, (nb.r0 + Math.floor(k / 100)) * ch + ch * 0.05, cw * 0.9, ch * 0.9); });
        });
        ctx.font = "700 13px " + p.fontUI; ctx.textBaseline = "top"; ctx.textAlign = "left";
        NB.forEach(function(nb, b){ var t = nb.t + " · " + MV.mdm.fmt(nb.pop) + ": " + cnt[b] + " asked", w = ctx.measureText(t).width; ctx.fillStyle = sheet; ctx.globalAlpha = 0.9; ctx.fillRect(4, nb.r0 * ch + 3, w + 8, 18); ctx.globalAlpha = 1; ctx.fillStyle = ink; ctx.fillText(t, 8, nb.r0 * ch + 5); });
        if (d.how === "mall") { var mx = MALL[0] * cw, my = MALL[1] * ch; ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.strokeRect(mx - 9, my - 7, 18, 14); ctx.fillStyle = sheet; ctx.fillRect(mx + 12, my - 9, 36, 18); ctx.fillStyle = ink; ctx.textBaseline = "middle"; ctx.fillText("mall", mx + 14, my); }
        ctx.restore();
      } });
  }
  function paint(){
    var d = read(), el = $("#ts-read"); if (!el) return;
    var vals = [d.N, d.C, d.S], all = vals.every(okV), tot = all ? vals.reduce(sum, 0) : null, rows = [];
    rows.push(["Total interviews", all ? "<strong>" + tot + "</strong>" : '<span class="muted">enter multiples of 10 from 0 to 600</span>']);
    rows.push(["Margin ≈ " + M("1/√n"), all && tot > 0 ? "<strong>±" + d1(100 / Math.sqrt(tot)) + "%</strong>" : "—"]);
    NB.forEach(function(nb, b){ rows.push([nb.t + "’s share", all && tot > 0 ? pc(100 * vals[b] / tot) + " of the sample " + '<span class="tiny muted">(' + pc(100 * nb.pop / 6000) + " of the town)</span>" : "—"]); });
    MV.keepFocus(el, function(){ el.innerHTML = MV.readoutHTML(rows); });
    drawMap();
  }
  function setV(k, raw){ st().v[k] = raw; api.save(); paint(); api.update(); }
  return {
    render:function(inp, pvw, a){
      api = a; var s = st();
      inp.innerHTML = '<div class="ts-in">' + NB.map(function(nb, k){
        return '<div class="ts-row"><label for="ts-' + k + '" class="ts-l">' + nb.t + ' <span class="tiny muted">(' + MV.mdm.fmt(nb.pop) + ' adults)</span></label><span class="ts-ctl"><button type="button" class="btn ghost sm ts-stb" data-ts="' + k + '|-1" data-k="ts' + k + 'm" aria-label="' + nb.t + ' down 10">−</button>' +
          '<input class="numin ts-num" id="ts-' + k + '" data-tsi="' + k + '" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" value="' + MV.esc(s.v[k]) + '"><button type="button" class="btn ghost sm ts-stb" data-ts="' + k + '|1" data-k="ts' + k + 'p" aria-label="' + nb.t + ' up 10">+</button></span></div>';
      }).join("") + '<div id="ts-how" class="ts-how"></div></div>';
      pvw.innerHTML = '<div class="ts-pv"><canvas class="plot ts-map" id="ts-map" role="img" aria-label="Map of the town"></canvas><p class="tiny muted">Each dot is an adult; lit dots are the people asked. <span class="mdm-model">model town</span></p><dl class="read" id="ts-read" aria-live="polite"></dl></div>';
      plot = new MV.Plot($("#ts-map"), { xmin:0, xmax:1, ymin:0, ymax:1 }); plot.render = drawMap;
      howR = radios($("#ts-how"), { label:"How people are chosen", options:HOW, value:s.how, cls:"chips", onChange:function(v){ st().how = v; api.save(); paint(); api.update(); } });
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tsi; if (k == null) return; setV(+k, e.target.value); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-ts]"); if (!b) return;
        var q = b.dataset.ts.split("|"), k = +q[0], cur = pv(st().v[k]), nv = clamp((cur == null ? 0 : Math.round(cur / 10) * 10) + 10 * (+q[1]), 0, 600);
        $("#ts-" + k).value = String(nv); setV(k, String(nv));
      });
      paint();
    },
    read:read,
    valid:function(d){
      if (![d.N, d.C, d.S].every(okV)) return "Enter North, Centre and South as multiples of 10 from 0 to 600.";
      if (!d.how) return "Choose how people are chosen.";
      return true;
    },
    checks:function(d){
      var all = [d.N, d.C, d.S].every(okV), tot = all ? d.N + d.C + d.S : 0;
      return [all && tot >= 400, all && tot <= 600, all && d.S > 0 && d.N === 3 * d.S && d.C === 2 * d.S, d.how === "addr"];
    },
    key:function(d){ return d.N + "," + d.C + "," + d.S; },
    label:function(k){ return "(" + k.split(",").join(", ") + ")"; },
    text:function(k){ return "(" + k.split(",").join(", ") + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ plan:numEntry },
  task:task
});
})();
