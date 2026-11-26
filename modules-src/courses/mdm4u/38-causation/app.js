// MDM4U 38 Two-Variable Analysis & Causation: hero (shoe size vs reading, r = 0.90; the dots recolour by grade and the
// pattern vanishes within each grade; a "grade (age)" circle drives both), Causation detective (Explore: Case files,
// Hidden-variable lab = D11 scatter with "Colour by" grouping and per-group r, Study designer with fixed seeded runs),
// Headlines on trial (Part 3: three news stations with "Check it with data" panels and verdicts), Hidden variables
// practice (N4 number entry + chips, Simpson's paradox), Honest headline task (N29-style chip headline builder).
// All datasets and news items are model data / model news; study runs are seeded and repeatable.
(function(){
"use strict";
var $ = MV.$, css = MV.css;
function obj(o){ return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }
function mi(s){ return String(s).replace(/-/g, MV.MINUS); }
function dN(v, dp){ dp = dp == null ? 2 : dp; var p = Math.pow(10, dp), s = (Math.round(v * p) / p).toFixed(dp).replace(/\.?0+$/, ""); if (s === "-0" || s === "") s = "0"; return mi(s); }
function fix(v, dp){ var s = (Math.round(v * Math.pow(10, dp)) / Math.pow(10, dp)).toFixed(dp); if (/^-0\.?0*$/.test(s)) s = s.slice(1); return mi(s); }
// r shown to 2 places, or 3 when 2 places would round to ±1.00
function rTxt(r){ var s = fix(r, 2); return Math.abs(Math.round(r * 100)) === 100 && Math.abs(r) < 0.9995 ? fix(r, 3) : s; }
function swHTML(id, lab, on, dis){ return '<button type="button" class="cc-switch cz-sw" role="switch" id="' + id + '" data-k="' + id + '" aria-checked="' + !!on + '"' + (dis ? " disabled" : "") + '><span class="cc-track" aria-hidden="true"><span class="cc-knob"></span></span>' + lab + "</button>"; }
var M3 = "Size and strength don’t fix self-selection. Only random assignment balances hidden variables.";
var TYPES = [{ id:"ce", t:"Cause and effect" }, { id:"cc", t:"Common cause" }, { id:"rev", t:"Reverse cause and effect" }, { id:"acc", t:"Accidental" }, { id:"pre", t:"Presumed" }];
function typeName(id){ var t = TYPES.filter(function(x){ return x.id === id; })[0]; return t ? t.t : ""; }

// ---------- statistics ----------
function mean(a){ return a.reduce(function(s, v){ return s + v; }, 0) / a.length; }
function corr(pts){
  if (pts.length < 3) return null;
  var mx = mean(pts.map(function(p){ return p[0]; })), my = mean(pts.map(function(p){ return p[1]; })), sxy = 0, sxx = 0, syy = 0;
  pts.forEach(function(p){ sxy += (p[0] - mx) * (p[1] - my); sxx += (p[0] - mx) * (p[0] - mx); syy += (p[1] - my) * (p[1] - my); });
  return sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0;
}

// ---------- model data ----------
var SHOE = [[10, 42], [11, 38], [12, 44], [13, 40], [13, 61], [14, 57], [15, 63], [16, 59], [16, 78], [17, 82], [18, 76], [19, 80]];
var NAMES = ["Amara", "Liam", "Zoe", "Kenji", "Priya", "Mateo", "Hana", "Rosa", "Sofia", "Arjun", "Tariq", "Ethan"];
var HEIGHT = [121, 126, 124, 129, 131, 128, 138, 140, 143, 149, 152, 147];   // cm, model data
var HOOD = [[22, 40], [31, 62], [45, 80], [57, 106], [64, 124], [77, 146]], TEMP = [14, 11, 6, 2, -1, -5];   // weekly temperature, °C
var SETS = {
  shoe:{ name:"Shoe size vs reading", cap:"Shoe size vs reading score (12 students)", pts:SHOE, xLab:"shoe size (cm)", yLab:"reading score", yName:"reading",
    cols:[{ id:"none", t:"none" }, { id:"grade", t:"grade" }, { id:"height", t:"height" }, { id:"letter", t:"first letter of name" }],
    groups:{
      grade:{ g:[0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2], names:["grade 2", "grade 4", "grade 6"] },
      height:{ g:HEIGHT.map(function(h){ return h < 130 ? 0 : h < 145 ? 1 : 2; }), names:["under 130 cm", "130–144 cm", "145 cm or taller"] },
      letter:{ g:NAMES.map(function(n){ return n[0] <= "H" ? 0 : n[0] <= "P" ? 1 : 2; }), names:["names A–H", "names I–P", "names Q–Z"] } } },
  hood:{ name:"Hoodies vs hot chocolate", cap:"Hoodie sales vs hot-chocolate sales (6 weeks)", pts:HOOD, xLab:"hoodies sold", yLab:"hot chocolates sold", yName:"hot chocolate",
    cols:[{ id:"none", t:"none" }, { id:"temp", t:"weekly temperature" }],
    groups:{ temp:{ g:TEMP.map(function(t){ return t >= 10 ? 0 : t > 0 ? 1 : 2; }), names:["10 °C or warmer", "1 to 9 °C", "0 °C or colder"] } } }
};
var GCOL = ["--ev-a", "--ev-b", "--ev-c"], GSHAPE = ["●", "■", "▲"];

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

// @component D11 groupScatter — scatter plot on the toolkit's Plot engine with its own framed axes (so data far from the
// origin keeps its tick labels), optional grouping by a third variable: each group gets a colour (--ev-a/b/c) AND a shape
// (circle, square, triangle; colour-key rule 2). mix (0–1) cross-fades plain --pen dots into the group shapes; k draws only the
// first k points (hero build-up). drawScatter(plot, {pts:[[x, y]], g:[group index] | null, mix, k, xLab, yLab, describe,
// labels:[{x, y, text, color}] (data units), after(ctx, m)}); m = {px(x), py(y), L, T, R, B, W, H}.
function niceRange(vals){
  var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals), st = MV.niceStep(((hi - lo) || 1) / 5);
  return { lo:Math.floor(lo / st) * st - (lo % st === 0 ? st : 0), hi:Math.ceil(hi / st) * st + (hi % st === 0 ? st : 0), st:st };
}
function shape(ctx, i, x, y, s){
  ctx.beginPath();
  if (i === 1) ctx.rect(x - s * 0.85, y - s * 0.85, s * 1.7, s * 1.7);
  else if (i === 2) { ctx.moveTo(x, y - s * 1.1); ctx.lineTo(x + s, y + s * 0.75); ctx.lineTo(x - s, y + s * 0.75); ctx.closePath(); }
  else ctx.arc(x, y, s, 0, 2 * Math.PI);
}
function drawScatter(plot, o){
  var pts = o.pts, xr = niceRange(pts.map(function(p){ return p[0]; })), yr = niceRange(pts.map(function(p){ return p[1]; }));
  plot.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, describe:o.describe, after:function(ctx){
    var W = plot.W, H = plot.H, L = 50, R = 14, T = 26, B = 40, f = plot.fontUI;
    var m = { L:L, R:R, T:T, B:B, W:W, H:H, px:function(x){ return L + (x - xr.lo) / (xr.hi - xr.lo) * (W - L - R); }, py:function(y){ return H - B - (y - yr.lo) / (yr.hi - yr.lo) * (H - T - B); } };
    ctx.save();
    ctx.lineWidth = 1; ctx.strokeStyle = css("--plot-grid"); ctx.fillStyle = css("--ink-2"); ctx.font = "12px " + f;
    var v, x, y;
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    for (v = xr.lo; v <= xr.hi + 1e-9; v += xr.st) { x = m.px(v); ctx.beginPath(); ctx.moveTo(x, T); ctx.lineTo(x, H - B); ctx.stroke(); ctx.fillText(dN(v, 2), x, H - B + 5); }
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (v = yr.lo; v <= yr.hi + 1e-9; v += yr.st) { y = m.py(v); ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(W - R, y); ctx.stroke(); ctx.fillText(dN(v, 2), L - 6, y); }
    ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, H - B); ctx.lineTo(W - R, H - B); ctx.stroke();
    ctx.font = "italic 13px " + f; ctx.fillStyle = css("--ink-2");
    ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText(o.xLab || "", W - R, H - 2);
    ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(o.yLab || "", L - 40 < 2 ? 2 : L - 40, 4);
    var k = o.k == null ? pts.length : o.k, mix = o.g ? (o.mix == null ? 1 : o.mix) : 0;
    pts.slice(0, k).forEach(function(p, i){
      var X = m.px(p[0]), Y = m.py(p[1]);
      if (mix < 1) { ctx.globalAlpha = 1 - mix; ctx.fillStyle = css("--pen"); shape(ctx, 0, X, Y, 6); ctx.fill(); }
      if (mix > 0) { var g = o.g[i]; ctx.globalAlpha = mix; ctx.fillStyle = css(GCOL[g]); ctx.strokeStyle = css("--sheet"); ctx.lineWidth = 1.2; shape(ctx, g, X, Y, 6.5); ctx.fill(); ctx.stroke(); }
    });
    ctx.globalAlpha = 1;
    (o.labels || []).forEach(function(l){ ctx.font = "700 13px " + f; ctx.fillStyle = l.color || css("--ink"); ctx.textAlign = l.align || "left"; ctx.textBaseline = "middle"; ctx.globalAlpha = l.alpha == null ? 1 : l.alpha; ctx.fillText(l.text, m.px(l.x) + (l.dx || 0), m.py(l.y) + (l.dy || 0)); });
    ctx.globalAlpha = 1;
    ctx.restore();
    if (o.after) { ctx.save(); o.after(ctx, m); ctx.restore(); }
  } });
}
function arrow(ctx, x1, y1, x2, y2, col, w, dash){
  var a = Math.atan2(y2 - y1, x2 - x1), h = 9;
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w || 2; ctx.setLineDash(dash || []);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - h * 0.6 * Math.cos(a), y2 - h * 0.6 * Math.sin(a)); ctx.stroke(); ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - h * Math.cos(a - 0.42), y2 - h * Math.sin(a - 0.42)); ctx.lineTo(x2 - h * Math.cos(a + 0.42), y2 - h * Math.sin(a + 0.42)); ctx.closePath(); ctx.fill();
}

// @component causeDiagram — the five relationship types as a small SVG: x and y boxes, arrows for the direction of cause,
// the hidden variable as a dashed --ink-2 circle with arrows to both (common cause), "?" on an unproven arrow (presumed).
function causeSVG(type, xl, yl, z){
  var ah = function(x1, y1, x2, y2, cls){ return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="' + (cls || "cz-ar") + '" marker-end="url(#cz-ah)"/>'; };
  var h = '<defs><marker id="cz-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="cz-ahp"/></marker></defs>';
  h += '<rect x="6" y="112" width="128" height="34" rx="6" class="cz-box"/><text x="70" y="133" class="cz-bt">' + MV.esc(xl) + "</text>";
  h += '<rect x="226" y="112" width="128" height="34" rx="6" class="cz-box"/><text x="290" y="133" class="cz-bt">' + MV.esc(yl) + "</text>";
  if (type === "ce") h += ah(136, 129, 222, 129) + '<text x="180" y="118" class="cz-st">causes</text>';
  else if (type === "rev") h += ah(224, 129, 138, 129) + '<text x="180" y="118" class="cz-st">drives</text>';
  else if (type === "pre") h += ah(136, 129, 222, 129, "cz-ar cz-ard") + '<text x="180" y="118" class="cz-q">?</text>';
  else if (type === "acc") h += '<text x="180" y="133" class="cz-st">coincidence</text>';
  if (type === "cc") h += '<ellipse cx="180" cy="34" rx="62" ry="24" class="cz-hid"/><text x="180" y="39" class="cz-bt">' + MV.esc(z || "?") + "</text>" + ah(140, 50, 90, 108) + ah(220, 50, 270, 108);
  var lab = { ce:"x causes y", rev:"y drives x", pre:"x may drive y, unproven", acc:"no link: coincidence", cc:(z || "a third variable") + " drives both x and y" }[type];
  return '<svg class="cz-svg" viewBox="0 0 360 150" role="img" aria-label="' + MV.esc(xl + " and " + yl + ": " + lab) + '">' + h + "</svg>";
}

// ---------- study designer model (exact, deterministic) ----------
function studyDiff(asg, n){ return asg === "choose" ? 8 : n === "200" ? 2 : n === "50" ? 2.6 : 4.5; }
function studyData(asg, ctl, n){
  var N = +n, rng = MV.mdm.seededRandom("mdm38-study-" + asg + "-" + ctl + "-" + n);
  function zs(k){ var a = [], i; for (i = 0; i < k; i++) { var u = 1 - rng(), v = rng(); a.push(Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)); } var mu = mean(a); return a.map(function(z){ return z - mu; }); }
  if (ctl === "no") { var base = 66 + 2 + (asg === "choose" ? 6 : 0); return { app:zs(N).map(function(z){ return base + 7 * z; }), ctl:null }; }
  var d = studyDiff(asg, n);
  return { app:zs(N / 2).map(function(z){ return 66 + d + 7 * z; }), ctl:zs(N / 2).map(function(z){ return 66 + 7 * z; }), diff:d };
}
function drawStudy(plot, o){
  plot.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, describe:o.describe, after:function(ctx){
    var W = plot.W, H = plot.H, L = 18, R = 18, f = plot.fontUI, lo = 35, hi = 100, px = function(v){ return L + (Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo) * (W - L - R); };
    var rows = [{ lab:o.ctl === "no" ? "App users (no control group)" : o.asg === "choose" ? "App group (chose the app)" : "App group (assigned)", col:"--pen", s:0, d:o.data && o.data.app },
      { lab:o.ctl === "no" ? "No control group" : o.asg === "choose" ? "No-app group (chose not to)" : "Control group (assigned)", col:"--f3", s:1, d:o.data && o.data.ctl }];
    var axY = H - 34;
    ctx.font = "12px " + f; ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, axY); ctx.lineTo(W - R, axY); ctx.stroke();
    ctx.fillStyle = css("--ink-2"); ctx.textAlign = "center"; ctx.textBaseline = "top";
    for (var v = 40; v <= 100; v += 10) { var x = px(v); ctx.beginPath(); ctx.moveTo(x, axY); ctx.lineTo(x, axY + 5); ctx.stroke(); ctx.fillText(String(v), x, axY + 7); }
    ctx.font = "italic 13px " + f; ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText("mark", W - R, H - 1);
    rows.forEach(function(r, i){
      var y0 = 18 + i * (axY - 18) / 2, yc = y0 + (axY - 18) / 4 + 6;
      ctx.font = "700 13px " + f; ctx.fillStyle = css("--ink"); ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(r.lab, L, y0 - 8);
      if (!r.d) { if (o.ctl === "no" && i === 1) { ctx.font = "italic 13px " + f; ctx.fillStyle = css("--ink-2"); ctx.fillText("Nobody to compare with", L, yc - 6); } return; }
      var k = Math.min(r.d.length, Math.round(r.d.length * (o.t == null ? 1 : o.t))), rng = MV.mdm.seededRandom("mdm38-jit-" + i + "-" + r.d.length), s = r.d.length > 60 ? 3.2 : 5;
      ctx.fillStyle = css(r.col); ctx.globalAlpha = r.d.length > 60 ? 0.75 : 1;
      for (var j = 0; j < r.d.length; j++) { var jy = (rng() - 0.5) * 22; if (j < k) { shape(ctx, r.s, px(r.d[j]), yc + jy, s); ctx.fill(); } }
      ctx.globalAlpha = 1;
      if (k === r.d.length) { var mu = mean(r.d), mx = px(mu); ctx.strokeStyle = css("--ink"); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(mx, yc - 18); ctx.lineTo(mx, yc + 18); ctx.stroke();
        ctx.font = "700 12px " + f; ctx.fillStyle = css("--ink"); ctx.textAlign = mx > W - 90 ? "right" : "left"; ctx.textBaseline = "bottom"; ctx.fillText("mean " + dN(mu, 1), mx + (mx > W - 90 ? -4 : 4), yc - 12); }
    });
  } });
}

// ---------- Explore: Causation detective ----------
function explore(host, api){
  var S = api.S, C = api.content || {}, CASES = C.cases || (C.explore && C.explore.cases) || [];
  function sanitize(){
    if (["cases", "lab", "study"].indexOf(S.mode) < 0) S.mode = "cases";
    S.ci = Math.max(0, Math.min(CASES.length - 1, Math.round(+S.ci) || 0));
    S.picks = obj(S.picks); S.rev = obj(S.rev);
    S.lab = obj(S.lab); if (!SETS[S.lab.set]) S.lab.set = "shoe";
    S.lab.col = obj(S.lab.col);
    Object.keys(SETS).forEach(function(k){ if (!SETS[k].cols.some(function(c){ return c.id === S.lab.col[k]; })) S.lab.col[k] = "none"; });
    S.lab.within = !!S.lab.within; if (["hc", "ch", "temp", "acc"].indexOf(S.lab.claim) < 0) S.lab.claim = null;
    S.st = obj(S.st); if (S.st.asg !== "random") S.st.asg = "choose"; if (S.st.ctl !== "no") S.st.ctl = "yes"; if (["10", "50", "200"].indexOf(String(S.st.n)) < 0) S.st.n = "200"; S.st.n = String(S.st.n); S.st.ran = !!S.st.ran;
  }
  sanitize();
  var anim = null, mix = 1, mixStop = null, studyT = null, built = "";
  host.innerHTML =
    '<div class="cz-top"><div id="cz-mode"></div></div>' +
    '<div class="pg cz-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap cz-cap" id="cz-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="plot-wrap"><canvas class="plot cz-plot" id="cz-plot" role="img" aria-label="Scatter plot"></canvas></div>' +
      '<div id="cz-legend" class="cz-legend"></div><div id="cz-below"></div></div>' +
    '<div class="pg-ctrl"><div id="cz-ctrl"></div><p class="tiny cz-msg" id="cz-msg" aria-live="polite"></p></div>' +
    '<div class="pg-read"><dl class="read" id="cz-read" aria-live="polite"></dl></div></div>';
  var plot = new MV.Plot($("#cz-plot", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  plot.render = paintPlot;
  var modeR = radios($("#cz-mode", host), { label:"Mode", options:[{ id:"cases", t:"Case files" }, { id:"lab", t:"Hidden-variable lab" }, { id:"study", t:"Study designer" }], value:S.mode, cls:"seg",
    onChange:function(v){ user(); S.mode = v; save(); render(); MV.changed(); } });
  var typeR = null, setR = null, colR = null, claimR = null, asgR = null, ctlR = null, nR = null;

  function save(){ api.save(); }
  function user(){ cancelAnim(); MV.banner("", ""); }
  // --- animation bookkeeping: any user action finishes the running animation ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], stops:[], fin:fin || null }; lock(true); return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function cancelAnim(){
    stopMix(); if (studyT) { studyT(); studyT = null; }
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} });
    lock(false); mix = 1;
    if (a.fin) { var f = a.fin; a.fin = null; f(); }
    render(); MV.changed();
  }
  function endAnim(){ var a = anim; anim = null; lock(false); if (a && a.fin) { var f = a.fin; a.fin = null; f(); } }
  function lock(b){ var r = $("#cz-run", host); if (r) r.disabled = b; }
  function stopMix(){ if (mixStop) { mixStop(); mixStop = null; } mix = 1; }
  function recolour(fromNone, done){
    stopMix();
    if (!fromNone || MV.reduceMotion) { mix = 1; paintPlot(); if (done) done(); return; }
    mix = 0; paintPlot();
    mixStop = MV.tween({ dur:900, step:function(t){ mix = t; paintPlot(); }, done:function(){ mixStop = null; mix = 1; paintPlot(); if (done) done(); } });
  }

  // --- controls, built once per mode ---
  function build(){
    var c = $("#cz-ctrl", host); typeR = setR = colR = claimR = asgR = ctlR = nR = null;
    if (S.mode === "cases") {
      c.innerHTML = '<div class="cz-nav" role="group" aria-label="Case files"><button type="button" class="btn ghost sm" id="cz-prev" data-k="czprev">← Previous</button>' +
        '<span class="cz-dots" id="cz-dots"></span><button type="button" class="btn ghost sm" id="cz-next" data-k="cznext">Next →</button></div>' +
        '<div id="cz-type"></div><div class="q-actions"><button type="button" class="btn sm" id="cz-reveal" data-k="czrev">Reveal</button></div>';
      typeR = radios($("#cz-type", c), { label:"Type of relationship", options:TYPES, value:S.picks[CASES[S.ci].id] || "", cls:"chips",
        onChange:function(v){ user(); S.picks[CASES[S.ci].id] = v; save(); render(); MV.changed(); } });
    } else if (S.mode === "lab") {
      c.innerHTML = '<div id="cz-set"></div><div id="cz-col"></div><div class="cz-sws">' + swHTML("cz-within", "Show `r` within each group".replace("`r`", MV.m("r")), S.lab.within) + "</div><div id=\"cz-claim\"></div>";
      setR = radios($("#cz-set", c), { label:"Data", options:[{ id:"shoe", t:SETS.shoe.name }, { id:"hood", t:SETS.hood.name }], value:S.lab.set, cls:"seg",
        onChange:function(v){ user(); S.lab.set = v; save(); colR.setOptions(SETS[v].cols); colR.set(S.lab.col[v]); render(); MV.changed(); } });
      colR = radios($("#cz-col", c), { label:"Colour by", options:SETS[S.lab.set].cols, value:S.lab.col[S.lab.set], cls:"chips",
        onChange:function(v){ user(); var was = S.lab.col[S.lab.set]; S.lab.col[S.lab.set] = v; save(); render(); recolour(was === "none"); MV.changed(); } });
      claimR = radios($("#cz-claim", c), { label:"What explains it?", options:[{ id:"hc", t:"Hoodies cause hot chocolate" }, { id:"ch", t:"Hot chocolate causes hoodies" }, { id:"temp", t:"Temperature drives both" }, { id:"acc", t:"Coincidence" }], value:S.lab.claim || "", cls:"chips",
        onChange:function(v){ user(); S.lab.claim = v; save(); render(); MV.changed(); } });
    } else {
      c.innerHTML = '<p class="cz-model">Model study: “Does the FocusUp study app raise marks?” <span class="mdm-model">model data</span></p><div id="cz-asg"></div><div id="cz-ctl"></div><div id="cz-n"></div>' +
        '<div class="q-actions"><button type="button" class="btn primary sm" id="cz-run" data-k="czrun">Run study</button></div>';
      function ch(k){ return function(v){ user(); S.st[k] = v; S.st.ran = false; save(); render(); MV.changed(); }; }
      asgR = radios($("#cz-asg", c), { label:"Assignment", options:[{ id:"choose", t:"Students choose" }, { id:"random", t:"Random" }], value:S.st.asg, cls:"seg", onChange:ch("asg") });
      ctlR = radios($("#cz-ctl", c), { label:"Control group", options:[{ id:"yes", t:"Yes" }, { id:"no", t:"No" }], value:S.st.ctl, cls:"seg", onChange:ch("ctl") });
      nR = radios($("#cz-n", c), { label:"Sample size", options:[{ id:"10", t:"10" }, { id:"50", t:"50" }, { id:"200", t:"200" }], value:S.st.n, cls:"seg", onChange:ch("n") });
    }
    built = S.mode;
  }

  // --- painting ---
  function curGroups(){ var set = SETS[S.lab.set], col = S.lab.col[S.lab.set]; return col === "none" ? null : set.groups[col]; }
  function paintPlot(){
    if (S.mode === "cases") {
      var cs = CASES[S.ci], r = corr(cs.pts);
      drawScatter(plot, { pts:cs.pts, xLab:cs.xLab, yLab:cs.yLab, describe:"Scatter plot, case " + (S.ci + 1) + ": " + MV.plain(cs.title) + ", " + cs.pts.length + " points, r = " + MV.plain(rTxt(r)) + "." });
    } else if (S.mode === "lab") {
      var set = SETS[S.lab.set], G = curGroups();
      drawScatter(plot, { pts:set.pts, g:G ? G.g : null, mix:mix, xLab:set.xLab, yLab:set.yLab,
        describe:"Scatter plot: " + set.cap + ", r = " + MV.plain(rTxt(corr(set.pts))) + (G ? ". Points coloured and shaped by " + G.names.join(", ") + "." : ".") });
    } else {
      var d = S.st.ran ? studyData(S.st.asg, S.st.ctl, S.st.n) : null;
      drawStudy(plot, { data:d, asg:S.st.asg, ctl:S.st.ctl, t:studyT ? studyT.t : 1, describe:"Dot strips of marks: " + (d ? "app group mean " + dN(mean(d.app), 1) + (d.ctl ? ", comparison group mean " + dN(mean(d.ctl), 1) : ", no comparison group") : "the study hasn’t been run yet") + "." });
    }
  }
  function groupStats(){
    var set = SETS[S.lab.set], G = curGroups(); if (!G) return null;
    return G.names.map(function(nm, k){ var P = set.pts.filter(function(_, i){ return G.g[i] === k; }); return { name:nm, n:P.length, r:corr(P), my:P.length ? mean(P.map(function(p){ return p[1]; })) : null }; });
  }
  function studyText(){
    var s = S.st, d = studyDiff(s.asg, s.n);
    if (s.ctl === "no") return { res:"No comparison possible.", cause:"No: there’s no comparison group" };
    if (s.asg === "choose") return { res:"App group − no-app group = <strong>+" + fix(d, 1) + " marks</strong> (students chose)", cause:"No: groups chose themselves" };
    var tail = s.n === "10" ? ": too few, so chance swamps the effect" : "";
    return { res:"App group − control group = <strong>+" + fix(d, 1) + " marks</strong> (random, control, `n` = " + s.n + ")" + tail,
      cause:s.n === "10" ? "Not reliably: with 10 students, chance swamps the effect" : "Yes: random assignment with a control" };
  }
  function render(){
    if (built !== S.mode) build();
    modeR.set(S.mode);
    var cap = $("#cz-cap", host), below = $("#cz-below", host), leg = $("#cz-legend", host), rows = [];
    leg.innerHTML = "";
    if (S.mode === "cases") {
      var cs = CASES[S.ci], pick = S.picks[cs.id], rv = !!S.rev[cs.id], r = corr(cs.pts);
      cap.innerHTML = "Case " + (S.ci + 1) + ": " + cs.title;
      $("#cz-dots", host).innerHTML = CASES.map(function(c, i){ return '<button type="button" class="cz-dot" data-ci="' + i + '" data-k="czd' + i + '" aria-pressed="' + (i === S.ci) + '" aria-label="Case ' + (i + 1) + (S.picks[c.id] ? ", classified" : "") + '">' + (i + 1) + (S.picks[c.id] ? "<span aria-hidden=\"true\">•</span>" : "") + "</button>"; }).join("");
      $("#cz-prev", host).disabled = S.ci === 0; $("#cz-next", host).disabled = S.ci === CASES.length - 1;
      if (typeR) typeR.set(pick || "");
      $("#cz-reveal", host).disabled = !pick || rv;
      below.innerHTML = '<p class="cz-note"><span class="mdm-model">model data</span> ' + cs.note + "</p>" +
        (rv ? '<div class="cz-rev">' + causeSVG(MV.ans(cs), cs.xLab.replace(/ \(.*\)$/, ""), cs.yLab.replace(/ \(.*\)$/, ""), cs.z) + '<p class="cz-verdict">' + MV.md(cs.verdict) + "</p></div>" : "");
      rows = [[MV.m("r") + " (all data)", "<strong>" + rTxt(r) + "</strong>"], ["Your type", pick ? typeName(pick) : '<span class="muted">not chosen yet</span>'],
        ["Case verdict", rv ? MV.md(cs.verdict) + (pick === MV.ans(cs) ? " ✓" : ' <span class="muted">(your pick: ' + typeName(pick) + ")</span>") : '<span class="muted">choose a type, then tap Reveal</span>'],
        ["Cards classified", CASES.filter(function(c){ return S.picks[c.id]; }).length + " of " + CASES.length]];
    } else if (S.mode === "lab") {
      var set = SETS[S.lab.set], G = curGroups(), gs = groupStats(), hood = S.lab.set === "hood";
      cap.innerHTML = set.cap + (G && S.lab.within && !hood && S.lab.col.shoe === "grade" ? " · within each grade: " + MV.m("r") + " = 0" : "");
      if (G) leg.innerHTML = '<span class="cz-lg-h">Colour by ' + MV.esc(SETS[S.lab.set].cols.filter(function(c){ return c.id === S.lab.col[S.lab.set]; })[0].t) + ":</span> " + G.names.map(function(nm, k){ return '<span class="cz-lg"><span class="cz-sh cz-g' + k + '" aria-hidden="true">' + GSHAPE[k] + "</span>" + nm + "</span>"; }).join("");
      var sw = $("#cz-within", host); if (sw) { sw.setAttribute("aria-checked", String(S.lab.within)); sw.disabled = hood; }
      var cl = $("#cz-claim", host); if (cl) cl.hidden = !hood;
      if (claimR) claimR.set(S.lab.claim || "");
      below.innerHTML = '<p class="cz-note"><span class="mdm-model">model data</span> ' + (hood ? "Six weeks of sales at a school store, with each week’s average temperature." : "Twelve students from grades 2, 4 and 6: shoe size, reading score, height and first name.") + "</p>";
      var within;
      if (hood) within = '<span class="muted">only 2 weeks per group: compare each variable with temperature instead</span>';
      else if (!G) within = '<span class="muted">choose a “Colour by” first</span>';
      else if (!S.lab.within) within = '<span class="muted">turn on “Show ' + MV.m("r") + ' within each group”</span>';
      else within = gs.map(function(g){ return g.name + ": <strong>" + (g.r == null ? "—" : fix(g.r, 2)) + "</strong>"; }).join(" · ");
      rows = [[MV.m("r") + " (all data)", "<strong>" + rTxt(corr(set.pts)) + "</strong>"], [MV.m("r") + " within groups", within],
        ["Group means", gs ? set.yName + ": " + gs.map(function(g){ return dN(g.my, 1); }).join(", ") : '<span class="muted">choose a “Colour by” first</span>']];
      if (hood && G) rows.push([MV.m("r") + " with temperature", "hoodies: <strong>" + fix(corr(HOOD.map(function(p, i){ return [p[0], TEMP[i]]; })), 2) + "</strong> · hot chocolate: <strong>" + fix(corr(HOOD.map(function(p, i){ return [p[1], TEMP[i]]; })), 2) + "</strong>"]);
    } else {
      var t = studyText(), ran = S.st.ran && !studyT;
      cap.innerHTML = "Does the FocusUp app raise marks?";
      leg.innerHTML = '<span class="cz-lg"><span class="cz-sh cz-g0" aria-hidden="true">●</span>app group</span><span class="cz-lg"><span class="cz-sh cz-g1" aria-hidden="true">■</span>' + (S.st.asg === "random" ? "control group" : "no-app group") + "</span>";
      below.innerHTML = '<p class="cz-note">In this model the app’s <strong>true effect is +2 marks</strong>. Students who choose the app are also more motivated, which adds +6 on its own.' + (S.st.asg === "random" && S.st.ctl === "yes" ? " Each run is a fixed seeded run: a different random run would give a different number." : "") + "</p>";
      rows = [["Study result", ran ? MV.md(t.res) : '<span class="muted">press Run study</span>'], ["Can it show cause?", ran ? t.cause : '<span class="muted">run the study first</span>']];
      var rb = $("#cz-run", host); if (rb) rb.disabled = !!anim || !!studyT;
    }
    MV.keepFocus($("#cz-read", host), function(){ $("#cz-read", host).innerHTML = MV.readoutHTML(rows); });
    paintPlot();
  }
  function runStudy(done){
    if (studyT) { studyT(); studyT = null; }
    S.st.ran = true; save();
    if (MV.reduceMotion) { render(); MV.changed(); if (done) done(); return; }
    var h = function(){ stop(); }, stop = MV.tween({ dur:1100, step:function(t){ h.t = t; paintPlot(); }, done:function(){ studyT = null; render(); MV.changed(); if (done) done(); } });
    h.t = 0; studyT = h; render();
  }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest(".rg")) return;
    if (b.id === "cz-prev" || b.id === "cz-next" || b.dataset.ci != null) {
      user(); S.ci = b.dataset.ci != null ? +b.dataset.ci : Math.max(0, Math.min(CASES.length - 1, S.ci + (b.id === "cz-next" ? 1 : -1))); save(); render(); MV.changed(); return;
    }
    if (b.id === "cz-reveal") { user(); S.rev[CASES[S.ci].id] = true; save(); render(); MV.changed(); return; }
    if (b.id === "cz-within") { user(); S.lab.within = !S.lab.within; save(); render(); MV.changed(); return; }
    if (b.id === "cz-run") { user(); runStudy(); return; }
  });

  render();

  // --- predictions ---
  function startPred(p){
    cancelAnim(); MV.banner("", "");
    var st = p.start || {};
    S.mode = st.mode;
    if (st.mode === "lab") { S.lab.set = st.set; S.lab.col[st.set] = st.col; S.lab.within = false; }
    else if (st.mode === "study") { S.st.asg = st.asg; S.st.ctl = st.ctl; S.st.n = st.n; S.st.ran = false; }
    else { S.ci = st.card - 1; S.rev[CASES[S.ci].id] = false; }
    built = ""; save(); render();
  }
  function runPred(p, done){
    newAnim(done);
    if (p.id === "p1") later(500, function(){ S.lab.col.shoe = "grade"; save(); if (colR) colR.set("grade"); render(); recolour(true, function(){ MV.changed(); later(300, endAnim); }); });
    else if (p.id === "p2") later(500, function(){ S.lab.within = true; save(); render(); MV.changed(); later(400, endAnim); });
    else if (p.id === "p3") later(300, function(){ runStudy(function(){ later(300, endAnim); }); });
    else later(500, function(){ S.rev[CASES[S.ci].id] = true; save(); render(); MV.changed(); later(400, endAnim); });
  }

  // --- challenges ---
  function chal(id){
    var R = function(m){ return { ok:false, msg:MV.md(m) }; };
    if (id === "tc1") {
      var miss = CASES.filter(function(c){ return !S.picks[c.id]; });
      if (miss.length) return R("Choose a type for every card in <strong>Case files</strong>: " + miss.length + " still to do.");
      var pk = function(i){ return S.picks[CASES[i].id]; };
      if (pk(2) === "ce") return R("Check the direction: the `x`-variable is umbrellas sold. Selling umbrellas can’t cause rain.");
      if (pk(5) === "cc") return R("The note says no common cause was found. Logical but unproven is ‘presumed’.");
      if (pk(3) === "pre") return R("There’s no logical link at all: accidental.");
      var bad = CASES.map(function(c, i){ return S.picks[c.id] === MV.ans(c) ? -1 : i; }).filter(function(i){ return i >= 0; });
      if (!bad.length) return { ok:true };
      return R((CASES.length - bad.length) + " of " + CASES.length + " are right. Read the note on card " + (bad[0] + 1) + " again: what has been checked?");
    }
    if (id === "tc2") {
      if (S.mode !== "lab" || S.lab.set !== "hood") return R("Use the <strong>Hidden-variable lab</strong> with <strong>Hoodies vs hot chocolate</strong>.");
      var col = S.lab.col.hood, cl = S.lab.claim;
      if (col === "temp" && cl === "temp") return { ok:true };
      if (col === "none" && cl === "hc") return R("Buying a hoodie doesn’t make you buy a drink. What changes week to week?");
      if (col !== "temp") return R("Choose a “Colour by” that could make both go up together.");
      if (!cl) return R("Now tap the explanation the colouring supports.");
      if (cl === "acc") return R("A clear third variable lines up with both: it isn’t coincidence.");
      return R("Neither purchase makes you buy the other. The colouring shows what drives both.");
    }
    if (id === "tc3") {
      if (S.mode !== "study") return R("Use the <strong>Study designer</strong>.");
      if (S.st.ctl === "no") return R("No comparison, so no effect can be measured.");
      if (S.st.asg === "choose") return R("+8.0: motivation is mixed in. " + M3);
      if (S.st.n === "10") return R("+4.5: with so few students, chance swamps the effect.");
      if (S.st.n === "50") return R("+2.6: close, but with only 50 the chance error is still visible; try more.");
      return { ok:true };
    }
    return { ok:false };
  }
  return { predict:{ start:startPred, run:runPred }, challenge:function(id){ return chal(id); } };
}

// ---------- hero: r = 0.90 overall; recolour by grade; r = 0 within each grade; grade (age) drives both ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var plot = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }), aria = cv.getAttribute("aria-label") || "", G = SETS.shoe.groups.grade;
  var st = { k:0, rA:0, arr:0, arrA:0, mix:0, circ:0, cap:"" };
  plot.render = function(){
    drawScatter(plot, { pts:SHOE, g:G.g, mix:st.mix, k:st.k, xLab:"shoe size (cm)", yLab:"reading score", describe:aria,
      labels:st.mix > 0 ? [{ x:11.5, y:50, text:"grade 2", color:css("--ev-a"), alpha:st.mix, align:"center" }, { x:14.5, y:69, text:"grade 4", color:css("--ev-b"), alpha:st.mix, align:"center" }, { x:17.5, y:88, text:"grade 6", color:css("--ev-c"), alpha:st.mix, align:"center" }] : [],
      after:function(ctx, m){
        var fnt = plot.fontUI;
        ctx.font = "700 16px " + fnt; ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.fillStyle = css("--ink");
        if (st.cap) ctx.fillText(st.cap, m.W - m.R - 4, m.T - 20);
        else if (st.rA > 0) { ctx.globalAlpha = st.rA; ctx.fillText("r = 0.90", m.W - m.R - 4, m.T - 20); ctx.globalAlpha = 1; }
        var ax = m.L + 30, ay = m.T + 36;
        if (st.arrA > 0 && st.arr > 0) {
          ctx.globalAlpha = st.arrA; var x2 = ax + 40 + 120 * st.arr;
          ctx.font = "700 14px " + fnt; ctx.fillStyle = css("--ink"); ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText("shoe size", ax + 36, ay);
          arrow(ctx, ax + 42, ay, x2, ay, css("--ink"), 2.2);
          if (st.arr >= 1) { ctx.textAlign = "left"; ctx.fillText("reading?", x2 + 6, ay); ctx.font = "700 26px " + fnt; ctx.textAlign = "center"; ctx.fillText("?", ax + 100, ay - 22); }
          ctx.globalAlpha = 1;
        }
        if (st.circ > 0) {
          ctx.globalAlpha = st.circ; var cx = m.L + 95, cy = m.T + 44;
          ctx.setLineDash([6, 5]); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 2; ctx.fillStyle = css("--sheet");
          ctx.beginPath(); ctx.ellipse(cx, cy, 70, 24, 0, 0, 2 * Math.PI); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
          ctx.font = "700 14px " + fnt; ctx.fillStyle = css("--ink"); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("grade (age)", cx, cy);
          arrow(ctx, cx, cy + 25, cx, m.H - m.B - 3, css("--ink-2"), 2, [5, 4]);
          arrow(ctx, cx - 71, cy, m.L + 3, cy, css("--ink-2"), 2, [5, 4]);
          ctx.globalAlpha = 1;
        }
      } });
  };
  var cap = f.cap;
  function last(){ st = { k:12, rA:0, arr:0, arrA:0, mix:1, circ:1, cap:"r = 0.90 overall · r = 0 within each grade" }; plot.render(); cap.textContent = "Grade (age) drives both shoe size and reading score: r = 0.90 overall, but r = 0 within each grade."; }
  if (MV.reduceMotion) { last(); return; }
  plot.render(); cap.textContent = "Shoe size vs reading score for 12 students (model data)";
  function tw(dur, fn, done){ MV.tween({ dur:dur, step:fn, done:done }); }
  MV.wait(500, function(){
    tw(1400, function(t){ st.k = Math.round(12 * t); plot.render(); }, function(){
      cap.textContent = "A strong pattern: r = 0.90";
      tw(500, function(t){ st.rA = t; plot.render(); }, function(){
        MV.wait(700, function(){
          cap.textContent = "Do bigger feet help reading?";
          st.arrA = 1; tw(900, function(t){ st.arr = t; plot.render(); }, function(){
            MV.wait(1200, function(){
              tw(600, function(t){ st.arrA = 1 - t; plot.render(); }, function(){
                st.arr = 0; cap.textContent = "Colour by grade: within each grade, r = 0";
                tw(1000, function(t){ st.mix = t; plot.render(); }, function(){
                  st.rA = 0; st.cap = "Within each grade: r = 0"; plot.render();
                  MV.wait(1200, function(){
                    cap.textContent = "Grade (age) drives both";
                    tw(800, function(t){ st.circ = t; plot.render(); }, function(){ MV.wait(800, last); });
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

// ---------- Part 3: Headlines on trial ----------
function part3(host, api){
  var S = api.S, P3 = api.content || {}, ST = P3.stations || [], V = P3.verdicts || [], msgs = {};
  S.x = obj(S.x);
  function ist(id){ var x = S.x[id] = obj(S.x[id]); if (!Array.isArray(x.sel)) x.sel = []; x.vt = x.vt | 0; x.ft = x.ft | 0; return x; }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = ST.map(function(s, si){
        var x = ist(s.id), ans = MV.ans(s);
        var h = '<section class="hl-st" data-st="' + s.id + '"><p class="hl-lab">Station ' + (si + 1) + ' <span class="mdm-model">model news</span></p><p class="hl-head">' + s.headline + "</p>" +
          '<details class="alg hl-data" data-open="' + s.id + '"' + (x.open ? " open" : "") + '><summary>Check it with data</summary><dl class="read">' + MV.readoutHTML(s.study.map(function(r){ return [r[0], MV.md(r[1])]; })) + "</dl></details>" +
          '<p class="hl-q">Your verdict:</p><div class="hl-chips" role="group" aria-label="Verdict for station ' + (si + 1) + '">' + V.map(function(v){
            var on = x.v === v.id; return '<button type="button" class="hl-c" data-v="' + v.id + '" data-k="hl' + s.id + v.id + '" aria-pressed="' + on + '"' + (x.vok ? " disabled" : "") + ">" + v.t + "</button>"; }).join("") + "</div>";
        if (x.vok) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + MV.md(s.why) + (x.vt ? ' <span class="muted">(not first try)</span>' : ""));
        else if (msgs[s.id + "v"]) h += MV.fbHTML("bad", msgs[s.id + "v"]);
        if (x.vok) {
          h += '<p class="hl-q">' + s.followPrompt + '</p><div class="hl-chips hl-opts" role="group" aria-label="Follow-up for station ' + (si + 1) + '">' + s.options.map(function(o, i){
            var on = s.multi ? x.sel.indexOf(i) >= 0 : x.pick === i;
            return '<button type="button" class="hl-c hl-o" data-o="' + i + '" data-k="hl' + s.id + "o" + i + '" aria-pressed="' + on + '"' + (x.fok ? " disabled" : "") + ">" + MV.md(o.t) + "</button>"; }).join("") + "</div>";
          if (s.multi && !x.fok) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-fchk="1" data-k="hl' + s.id + 'chk">Check</button></div>';
          if (x.fok) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + MV.md(s.followWhy) + (x.ft ? ' <span class="muted">(not first try)</span>' : "")) + '<p class="hl-after">' + MV.md(s.after) + "</p>";
          else if (msgs[s.id + "f"]) h += MV.fbHTML("bad", msgs[s.id + "f"]);
        }
        return h + "</section>";
      }).join("");
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var sec = b.closest("[data-st]"); if (!sec) return;
    var s = ST.filter(function(z){ return z.id === sec.dataset.st; })[0], x = ist(s.id);
    if (b.dataset.v) {
      x.v = b.dataset.v;
      if (x.v === MV.ans(s)) { x.vok = true; msgs[s.id + "v"] = null; }
      else { x.vt++; msgs[s.id + "v"] = "<strong>✗ Not quite.</strong> " + MV.md((s.wrong || {})[x.v] || "Check the study behind the headline.") + " Try again."; }
    } else if (b.dataset.o != null) {
      var i = +b.dataset.o;
      if (s.multi) { var k = x.sel.indexOf(i); if (k >= 0) x.sel.splice(k, 1); else x.sel.push(i); msgs[s.id + "f"] = null; }
      else {
        x.pick = i; var o = s.options[i];
        if (MV.ok(o)) { x.fok = true; msgs[s.id + "f"] = null; }
        else { x.ft++; msgs[s.id + "f"] = "<strong>✗ Not quite.</strong> " + MV.md(o.why || "") + " Try again."; }
      }
    } else if (b.dataset.fchk) {
      var good = s.options.map(function(o, j){ return MV.ok(o) ? j : -1; }).filter(function(j){ return j >= 0; });
      var extra = x.sel.filter(function(j){ return good.indexOf(j) < 0; }), found = x.sel.filter(function(j){ return good.indexOf(j) >= 0; }).length;
      if (!extra.length && found === good.length) { x.fok = true; msgs[s.id + "f"] = null; }
      else {
        x.ft++;
        msgs[s.id + "f"] = "<strong>✗ Not quite.</strong> " + (extra.length ? MV.md(s.options[extra[0]].why || "One of your choices isn’t a reason.") + " " : "") + "You’ve found " + found + " of the " + good.length + ". Try again.";
      }
    } else return;
    api.save(); paint(); MV.focusFb(host.querySelector('[data-st="' + s.id + '"]'));
  });
  host.addEventListener("toggle", function(e){ var d = e.target; if (d.dataset && d.dataset.open) { ist(d.dataset.open).open = d.open; api.save(); } }, true);
  paint();
  return {};
}

// ---------- Practice: Hidden variables ----------
// @component N4 numEntry — number entry (copied from MDM4U 20; percentages accept 76 or 76%): one box per part, or a chip choice
// for a part given as {t, choices:[…]}; within tol (default 0.05); named wrong answers ({part, match, fb}); an item-level fb for
// any other wrong answer; three-level hints when the item has them; first-try scoring as the toolkit's N4. Adds a.table (model
// data shown above the items) and it.investigate (an unscored written follow-up once the item is solved).
function num(raw){ var s = String(raw == null ? "" : raw).replace(/[$%\s,]/g, ""); if (!s) return null; var r = MV.parseNum(s); return r && r.length === 1 ? r[0] : null; }
function numEntry(host, api, a){
  var st = api.S; st.items = st.items || {}; st.inv = obj(st.inv);
  var msgs = {};
  function ist(id){ var x = st.items[id] || (st.items[id] = { val:[], tries:0, hint:0, solved:false, first:null }); if (!Array.isArray(x.val)) x.val = []; return x; }
  function partsOf(it){ return it.parts || [it.label || "Your answer:"]; }
  function isCh(p){ return p && typeof p === "object"; }
  function judge(it, vals){
    var ans = MV.ans(it), A = Array.isArray(ans) ? ans : [ans], P = partsOf(it), tol = it.tol || 0.05;
    var got = A.map(function(_, k){ return isCh(P[k]) ? (vals[k] || null) : num(vals[k]); });
    if (got.some(function(v){ return v == null; })) return { bad:true };
    var oks = got.map(function(g, k){ return typeof A[k] === "string" ? g === A[k] : Math.abs(g - A[k]) <= tol + 1e-9; });
    if (oks.every(Boolean)) return { ok:true };
    var fb = it.fb || null;
    if (A.length > 1 && oks.some(Boolean)) {
      var lab = function(k){ return String(P[k]).replace(/\s*\(.*$/, "").replace(/\s*[=:]\s*$/, ""); };
      fb = oks.map(function(o, k){ return o ? lab(k) : null; }).filter(Boolean).join(" and ") + " is right. " + (fb || "");
    }
    return { ok:false, fb:fb };
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">' + (a.how || "Type your answer, then press Check.") + "</p>" +
        (a.table ? '<div class="hv-tbl"><p class="tiny"><span class="mdm-model">model data</span></p>' + MV.tableHTML({ head:a.table.head, rows:a.table.rows, caption:"Recovery at two clinics, by severity" }) + "</div>" : "") +
        a.items.map(function(it, i){
          var x = ist(it.id), P = partsOf(it);
          var h = '<div class="q" data-ne="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">H' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
          h += '<div class="ne-row">' + P.map(function(p, k){
            if (isCh(p)) return '<span class="ne-ch"><span class="ne-l">' + p.t + '</span><span class="ne-chips" role="group" aria-label="' + MV.esc(MV.plain(p.t)) + '">' + p.choices.map(function(c, j){
              return '<button type="button" class="ne-c" data-nc="' + it.id + "|" + k + "|" + j + '" data-k="' + it.id + "c" + k + j + '" aria-pressed="' + (x.val[k] === c) + '"' + (x.solved ? " disabled" : "") + ">" + c + "</button>"; }).join("") + "</span></span>";
            return '<label class="ne-lab" for="ne-' + it.id + k + '"><span>' + p + '</span><input class="numin ne-in" id="ne-' + it.id + k + '" data-nin="' + it.id + '" data-nk="' + k + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + MV.esc(x.val[k] || "") + '"' + (x.solved ? " disabled" : "") + "></label>";
          }).join("") + "</div>";
          if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
          if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
          else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
          if (x.solved && it.investigate) h += '<div class="hv-inv"><label for="hv-inv-' + it.id + '"><strong>Investigate</strong> (not scored): ' + it.investigate + '</label><textarea id="hv-inv-' + it.id + '" data-inv="' + it.id + '" rows="2">' + MV.esc(st.inv[it.id] || "") + "</textarea></div>";
          return h + "</div>";
        }).join("");
    });
  }
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.dataset && t.dataset.inv) { st.inv[t.dataset.inv] = t.value; api.save(); return; }
    var id = t.dataset && t.dataset.nin; if (!id) return; ist(id).val[+t.dataset.nk] = t.value; api.save();
  });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.nin) { var b = host.querySelector('[data-k="' + e.target.dataset.nin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ne]"); if (!box) return;
    var it = a.items.filter(function(y){ return y.id === box.dataset.ne; })[0], x = ist(it.id);
    if (b.dataset.nc) { var q = b.dataset.nc.split("|"), part = partsOf(it)[+q[1]]; x.val[+q[1]] = part.choices[+q[2]]; api.save(); paint(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x.val);
      if (r.bad) { msgs[it.id] = (partsOf(it).length > 1 ? "Fill in every part. " : "") + "Enter a percentage such as 76 or 76%, or tap a choice."; paint(); MV.focusFb(host.querySelector('[data-ne="' + it.id + '"]')); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (r.fb ? r.fb + " " : "") + "Try again."; }
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

// ---------- Performance task: Honest headline ----------
// @component N29 headlineBuilder — chip slots that build one sentence (after MDM4U 12's N29 sentenceBuilder): one radio chip row
// per slot, a live preview sentence, and a design object {v, s, c, o} for the checklist.
var task = (function(){
  var api = null;
  var VERB = [{ id:"causes", t:"causes" }, { id:"linked", t:"is linked to" }, { id:"proves", t:"proves" }, { id:"assoc", t:"is associated with" }];
  var STR = [{ id:"strongly", t:"strongly" }, { id:"moderately", t:"moderately" }, { id:"weakly", t:"weakly" }];
  var CAV = [{ id:"time", t:"Teens who play sports may also have more free time or friends" }, { id:"rev", t:"Happier teens may be more likely to join teams" }, { id:"ath", t:"The survey asked only athletes" }, { id:"none", t:"(none)" }];
  var SRC = [{ id:"survey", t:"Survey of 400 teens" }, { id:"teen", t:"A teen told us" }, { id:"none", t:"(none)" }];
  function pickOk(L, v, d){ return L.some(function(x){ return x.id === v; }) ? v : d; }
  function read(){ var s = api ? api.S : {}; return { v:pickOk(VERB, s.v, "causes"), s:pickOk(STR, s.s, "strongly"), c:pickOk(CAV, s.c, "none"), o:pickOk(SRC, s.o, "none") }; }
  function t(L, id){ return L.filter(function(x){ return x.id === id; })[0].t; }
  function sentence(d, html){
    var b = html ? function(x){ return "<strong>" + x + "</strong>"; } : function(x){ return x; };
    return "Sports " + b(t(VERB, d.v)) + " " + b(t(STR, d.s)) + " higher happiness" + (d.c !== "none" ? ": " + b(t(CAV, d.c)) : "") + (d.o !== "none" ? " (" + b(t(SRC, d.o)) + ")" : "");
  }
  function fromKey(k){ var q = String(k).split("|"); return { v:q[0], s:q[1], c:q[2], o:q[3] }; }
  function paint(){ var pv = $("#hh-pv"); if (pv) pv.innerHTML = '<p class="hh-lab">Live preview</p><p class="hh-line">“' + sentence(read(), true) + "”</p>"; }
  return {
    render:function(inp, pvw, a){
      api = a; var d = read(); api.S.v = d.v; api.S.s = d.s; api.S.c = d.c; api.S.o = d.o;
      inp.innerHTML = '<div class="hh-in"><div id="hh-v"></div><div id="hh-s"></div><div id="hh-c"></div><div id="hh-o"></div></div>';
      pvw.innerHTML = '<div id="hh-pv" class="hh-pv"></div>';
      [["v", "Verb", VERB], ["s", "Strength word", STR], ["c", "Caveat", CAV], ["o", "Source tag", SRC]].forEach(function(q){
        radios($("#hh-" + q[0]), { label:q[1], options:q[2], value:api.S[q[0]], cls:"chips", onChange:function(v){ api.S[q[0]] = v; api.save(); paint(); api.update(); } });
      });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return [d.v === "linked" || d.v === "assoc", d.s === "moderately", d.c === "time" || d.c === "rev", d.o === "survey"]; },
    key:function(d){ return [d.v, d.s, d.c, d.o].join("|"); },
    label:function(k){ return "“" + sentence(fromKey(k), false) + "”"; },
    text:function(k){ return "“" + sentence(fromKey(k), false) + "”"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ hidden:numEntry },
  task:task
});
})();
