// MDM4U 39 Culminating Data-Management Investigation: hero (the investigation cycle draws step by step), Investigation
// planner (Explore: D13 with stage tabs, question builder, plan, analysis menu, conclusion builder; D9 summaries with the
// course quartile method; D10 box plots and histograms; D11 scatter, regression and residual plots; M3 own-data table),
// Critique (Part 3: two model investigations rated on a 5-criterion rubric, improvements, Check it with data, comment
// builder), Stage 2 analysis practice (custom), the Stage 1 plan follow-up, and the Investigation report builder task.
// Built-in data are model data. Data a student types stays in the module's saved state on this device.
(function(){
"use strict";
var $ = MV.$, css = MV.css;
function M(s){ return MV.m(s); }
function obj(o){ return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }
function mi(s){ return String(s).replace(/-/g, MV.MINUS); }
function fx(v, dp){ var s = (Math.round(v * Math.pow(10, dp)) / Math.pow(10, dp)).toFixed(dp); if (/^-0(\.0+)?$/.test(s)) s = s.slice(1); return mi(s); }
function dN(v, dp){ dp = dp == null ? 2 : dp; var p = Math.pow(10, dp), s = (Math.round(v * p) / p).toFixed(dp); if (s.indexOf(".") >= 0) s = s.replace(/\.?0+$/, ""); if (s === "-0" || s === "") s = "0"; return mi(s); }
function words(s){ return (String(s || "").trim().match(/\S+/g) || []).length; }
function cap(s){ s = String(s || ""); return s.charAt(0).toUpperCase() + s.slice(1); }
function esc(s){ return MV.esc(String(s == null ? "" : s)); }
// plain report text -> html with italic r, x and ŷ
function rich(t){ return esc(t).replace(/\br = /g, "<i>r</i> = ").replace(/ŷ/g, "<i>ŷ</i>").replace(/(\d)x\b/g, "$1<i>x</i>").replace(/\bs = /g, "<i>s</i> = ").replace(/\bn = /g, "<i>n</i> = "); }
function pnum(s){ s = String(s == null ? "" : s).trim().replace(/[−–]/g, "-"); if (s.indexOf(".") < 0) s = s.replace(",", "."); return /^[-+]?(\d+\.?\d*|\.\d+)$/.test(s) ? parseFloat(s) : null; }
function rgbOf(c){
  c = String(c || "").trim(); var m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(c);
  if (m) return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
  m = /rgba?\(([^)]+)\)/.exec(c); if (m) { var p = m[1].split(",").map(parseFloat); return [p[0], p[1], p[2]]; }
  return [128, 128, 128];
}
function mix(a, b, t){ var A = rgbOf(a), B = rgbOf(b); return "rgb(" + [0, 1, 2].map(function(i){ return Math.round(A[i] + (B[i] - A[i]) * t); }).join(",") + ")"; }

// @component radioGroup (copied from MDM4U 19 / 18; adds o.key for data-k so MV.keepFocus can restore focus after repaints)
// radios(host, {label, aria, options:[{id, t, aria}], value, cls:"seg"|"chips", key, disabled(id) -> bool, onChange(id)}) -> {set, get, refresh}
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), key = o.key || "rg";
  function off(id){ return !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = off(val) || ids.indexOf(val) < 0 ? ids.filter(function(id){ return !off(id); })[0] : val;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + id + '" data-k="' + key + id + '"' + (x.aria ? ' aria-label="' + esc(x.aria) + '"' : "") + (off(id) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
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
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, refresh:paint, setOptions:function(list){ o.options = list; paint(); } };
}

// ---------- model data (plan §4, D13) ----------
var M1R = [[2, 8.5, 84, "Y"], [5, 7.0, 71, "N"], [3, 8.0, 78, "Y"], [7, 6.0, 65, "N"], [4, 7.5, 80, "Y"], [6, 6.5, 70, "N"], [1, 9.0, 88, "Y"], [8, 5.5, 62, "N"], [3, 7.5, 74, "N"], [5, 7.5, 76, "Y"],
  [2, 8.0, 79, "N"], [6, 7.0, 68, "Y"], [4, 8.0, 82, "N"], [7, 6.5, 73, "Y"], [3, 8.5, 77, "N"], [5, 6.5, 69, "N"], [4, 7.0, 75, "Y"], [6, 6.0, 66, "Y"], [2, 7.5, 81, "Y"], [8, 6.5, 70, "N"]];
var M2T = [-8, -5, -3, 0, 2, 4, 5, 7, 9, 10, 12, 14, 15, 17, 18, 20, 22, 24, 25, 27];
var M2S = [62, 58, 60, 51, 49, 47, 50, 42, 40, 41, 35, 33, 30, 28, 30, 24, 22, 20, 21, 18];
var M2D = [10, 14, 12, 15, 18, 20, 17, 24, 25, 22, 30, 28, 34, 36, 33, 40, 44, 41, 47, 50];
function col(i){ return M1R.map(function(r){ return r[i]; }); }
var DSB = {
  m1:{ id:"m1", code:"M1", pop:"s20", n:20, vars:[
    { id:"screen", name:"screen time", unit:"h/day", type:"num", vals:col(0) },
    { id:"sleep", name:"sleep", unit:"h/night", type:"num", vals:col(1) },
    { id:"mark", name:"mark", unit:"%", type:"num", vals:col(2) },
    { id:"sport", name:"plays a school sport", short:"Sport", unit:"Y/N", type:"cat", vals:col(3), groups:["Y", "N"], gname:{ Y:"sport players", N:"non-players" } }] },
  m2:{ id:"m2", code:"M2", pop:"d20", n:20, vars:[
    { id:"temp", name:"daily high temperature", unit:"°C", type:"num", vals:M2T },
    { id:"soup", name:"soup sold", unit:"bowls", type:"num", vals:M2S },
    { id:"drinks", name:"cold drinks sold", unit:"drinks", type:"num", vals:M2D }] }
};
var DSOPT = [{ id:"m1", t:"M1: 20 model students" }, { id:"m2", t:"M2: 20 model school days" }, { id:"m3", t:"M3: your own data" }];
var POPS = [{ id:"s20", t:"these 20 model students" }, { id:"d20", t:"these 20 model school days" }, { id:"ont", t:"all Ontario teens" }, { id:"can", t:"all Canadians" }, { id:"own", t:"my own data’s group" }];
var TPL = [{ id:"rel", t:"relationship", q:"Is there a relationship between [numerical variable] and [numerical variable] for [population]?" },
  { id:"diff", t:"differ", q:"Do [group] and [group] differ in [numerical variable] for [population]?" },
  { id:"one", t:"one variable", q:"What is the distribution of [numerical variable] for [population]?" }];
var SRC = [{ id:"pri", t:"primary" }, { id:"sec", t:"secondary" }];
var SAMP = [{ id:"all", t:"every row of the data set" }, { id:"srs", t:"a simple random sample" }, { id:"strat", t:"a stratified random sample" }, { id:"conv", t:"a convenience sample" }, { id:"vol", t:"a voluntary-response sample" }];
var AN = [["scatter", "scatter plot"], ["r", "<i>r</i>"], ["line", "line of best fit"], ["resid", "residual plot"], ["box", "side-by-side box plots"], ["means", "group means"], ["medians", "group medians"], ["iqr", "IQRs"], ["sd", "standard deviations"], ["hist", "histogram"], ["table", "summary table"]];
var AN1 = { means:"mean", medians:"median", iqr:"IQR", sd:"standard deviation" };
var STR = [{ id:"strong", t:"strong" }, { id:"moderate", t:"moderate" }, { id:"weak", t:"weak" }];
var VERB = [{ id:"assoc", t:"is associated with" }, { id:"linked", t:"is linked to" }, { id:"causes", t:"causes" }, { id:"proves", t:"proves" }];
var LIM = [["size", "sample size"], ["rep", "representativeness"], ["hidden", "hidden variable"], ["meas", "measurement"], ["model", "model data"]];
var HV = { m1:[["sleep", "sleep"], ["homework", "homework load"], ["motivation", "motivation"], ["work", "part-time work"], ["shoe", "shoe size"]],
  m2:[["temp", "temperature"], ["menu", "menu changes"], ["holidays", "holidays"], ["dow", "day of the week"], ["present", "number of students present"]] };
var FI = [{ id:"bigger", t:"a larger random sample" }, { id:"places", t:"data from several schools or places" }, { id:"longer", t:"data over a longer time" }, { id:"exp", t:"an experiment to test cause" }, { id:"other", t:"another variable that could explain the pattern" }];
var STAGES = ["Question", "Plan", "Analysis", "Conclusion"];
function tOf(list, id){ var x = list.filter(function(o){ return o.id === id; })[0]; return x ? x.t : ""; }

// ---------- statistics (D9; quartiles by the course method: medians of the lower and upper halves, median excluded when n is odd) ----------
function mean(a){ return a.length ? a.reduce(function(x, y){ return x + y; }, 0) / a.length : 0; }
function sdev(a){ if (a.length < 2) return 0; var m = mean(a); return Math.sqrt(a.reduce(function(s, x){ return s + (x - m) * (x - m); }, 0) / (a.length - 1)); }
function medS(a){ var n = a.length; return !n ? 0 : n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2; }
function quart(v){ var a = v.slice().sort(function(x, y){ return x - y; }), n = a.length, h = Math.floor(n / 2);
  return { min:a[0], max:a[n - 1], med:medS(a), q1:n > 1 ? medS(a.slice(0, h)) : a[0], q3:n > 1 ? medS(a.slice(n % 2 ? h + 1 : h)) : a[0] }; }
function regr(x, y){
  var mx = mean(x), my = mean(y), sxy = 0, sxx = 0, syy = 0;
  x.forEach(function(v, i){ sxy += (v - mx) * (y[i] - my); sxx += (v - mx) * (v - mx); syy += (y[i] - my) * (y[i] - my); });
  if (!sxx || !syy) return null;
  var b = sxy / sxx; return { r:sxy / Math.sqrt(sxx * syy), b:b, a:my - b * mx };
}
function lineTxt(R){ return "ŷ = " + fx(R.b, 2) + "x " + (R.a < 0 ? "− " : "+ ") + fx(Math.abs(R.a), 2); }

// ---------- own data (M3) ----------
function ownCfg(S){
  var o = S.own = obj(S.own);
  if (!Array.isArray(o.cols) || o.cols.length !== 4) o.cols = [0, 1, 2, 3].map(function(){ return { name:"", type:"num" }; });
  o.cols = o.cols.map(function(c){ c = obj(c); return { name:typeof c.name === "string" ? c.name.slice(0, 40) : "", type:c.type === "cat" ? "cat" : "num" }; });
  if (!Array.isArray(o.rows)) o.rows = [];
  o.rows = o.rows.slice(0, 60).map(function(r){ r = Array.isArray(r) ? r : []; return [0, 1, 2, 3].map(function(i){ return typeof r[i] === "string" ? r[i].slice(0, 30) : ""; }); });
  while (o.rows.length < 5) o.rows.push(["", "", "", ""]);
  return o;
}
function cellOk(v, type){ v = String(v).trim(); return !!v && (type === "cat" || pnum(v) != null); }
function ownRowState(o, r){ var named = o.cols.map(function(c, i){ return c.name.trim() ? i : -1; }).filter(function(i){ return i >= 0; });
  var filled = named.filter(function(i){ return r[i].trim(); }).length; if (!named.length || !filled) return "empty";
  return named.every(function(i){ return cellOk(r[i], o.cols[i].type); }) ? "ok" : "bad"; }
function ownDS(S){
  var o = ownCfg(S), good = [], bad = 0;
  o.rows.forEach(function(r){ var s = ownRowState(o, r); if (s === "ok") good.push(r); else if (s === "bad") bad++; });
  var vars = [];
  o.cols.forEach(function(c, i){
    var nm = c.name.trim(); if (!nm) return;
    var v = { id:"c" + i, name:nm, short:nm, unit:"", type:c.type, vals:good.map(function(r){ return c.type === "num" ? pnum(r[i]) : r[i].trim(); }) };
    if (c.type === "cat") { v.groups = []; v.gname = {}; v.vals.forEach(function(x){ if (v.groups.indexOf(x) < 0) v.groups.push(x); }); v.groups.forEach(function(g){ v.gname[g] = "“" + g + "”"; }); }
    vars.push(v);
  });
  return { id:"m3", code:"own data", pop:"own", n:good.length, bad:bad, vars:vars, own:true };
}
function dsOf(S){ return S.ds === "m3" ? ownDS(S) : DSB[S.ds] || DSB.m1; }
function varOf(ds, id){ return ds.vars.filter(function(v){ return v.id === id; })[0] || null; }
function catName(v){ return v.short || cap(v.name); }

// ---------- planner logic ----------
function norm(S){
  S.ds = ["m1", "m2", "m3"].indexOf(S.ds) >= 0 ? S.ds : "m1";
  S.tpl = ["rel", "diff", "one"].indexOf(S.tpl) >= 0 ? S.tpl : "";
  ["v1", "v2", "pop", "src", "samp", "dir", "str", "verb", "hv", "fi"].forEach(function(k){ S[k] = typeof S[k] === "string" ? S[k] : ""; });
  S.hvTxt = typeof S.hvTxt === "string" ? S.hvTxt.slice(0, 60) : "";
  S.an = obj(S.an); S.lim = obj(S.lim);
  S.stage = clampI(S.stage, 0, 3, 0); S.unl = clampI(S.unl, 0, 3, 0);
  S.col = !!S.col; S.colour = !!S.colour; S.p4 = !!S.p4; S.showAll = !!S.showAll;
  ownCfg(S);
  return S;
}
function calc(S){
  var ds = dsOf(S), v1 = varOf(ds, S.v1), v2 = varOf(ds, S.v2), out = { ds:ds, v1:v1, v2:v2, kind:S.tpl };
  if (S.tpl === "rel" && v1 && v2 && v1 !== v2 && v1.type === "num" && v2.type === "num" && ds.n >= 3) out.rel = regr(v1.vals, v2.vals);
  if (S.tpl === "diff" && v1 && v2 && v1.type === "cat" && v2.type === "num" && v1.groups.length === 2) {
    out.groups = v1.groups.map(function(g){ var vals = v2.vals.filter(function(_, i){ return v1.vals[i] === g; }); return { g:g, name:v1.gname[g], vals:vals, n:vals.length, mean:mean(vals), sd:sdev(vals), q:quart(vals) }; });
    if (out.groups.some(function(G){ return !G.n; })) out.groups = null;
  }
  if (S.tpl === "one" && v1 && v1.type === "num" && ds.n) out.one = { vals:v1.vals, n:v1.vals.length, mean:mean(v1.vals), sd:sdev(v1.vals), q:quart(v1.vals) };
  return out;
}
function popT(id){ return tOf(POPS, id); }
function qText(S, ds){
  ds = ds || dsOf(S);
  var v1 = varOf(ds, S.v1), v2 = varOf(ds, S.v2), pop = popT(S.pop) || "[population]", n1 = v1 ? v1.name : "[variable]", n2 = v2 ? v2.name : "[variable]";
  if (S.tpl === "rel") return "Is there a relationship between " + n1 + " and " + n2 + " for " + pop + "?";
  if (S.tpl === "diff") { var g = v1 ? (v1.type === "cat" && v1.groups.length === 2 ? v1.gname[v1.groups[0]] + " and " + v1.gname[v1.groups[1]] : "the groups of " + v1.name) : "[group] and [group]"; return "Do " + g + " differ in " + n2 + " for " + pop + "?"; }
  if (S.tpl === "one") return "What is the distribution of " + n1 + " for " + pop + "?";
  return "";
}
function twoCat(ds){ return ds.id === "m1" ? "There’s only one categorical variable in M1." : "Use one categorical (grouping) variable and one numerical variable."; }
// TC1's three tests, for any template: variables exist, template matches the types, population matches the data
function qTest(S){
  var ds = dsOf(S), v1 = varOf(ds, S.v1), v2 = varOf(ds, S.v2), T = S.tpl;
  if (!T) return { ok:false, msg:"Choose a question template first." };
  if (!ds.vars.length) return { ok:false, msg:"Name your data’s columns (in “Your data”), then choose your variables." };
  if (!v1 || (T !== "one" && !v2)) return { ok:false, msg:"Choose " + (T === "one" ? "a variable" : "both variables") + " from your data set." };
  if (T !== "one" && v1 === v2) return { ok:false, msg:"Choose two different variables." };
  if (T === "rel") {
    if (v1.type === "cat" && v2.type === "cat") return { ok:false, msg:twoCat(ds) };
    var c = v1.type === "cat" ? v1 : v2.type === "cat" ? v2 : null;
    if (c) return { ok:false, msg:catName(c) + " is categorical. Use the ‘differ’ template." };
  } else if (T === "diff") {
    if (v1.type === "cat" && v2.type === "cat") return { ok:false, msg:twoCat(ds) };
    if (v1.type !== "cat" && v2.type !== "cat") return { ok:false, msg:"The ‘differ’ template needs a grouping (categorical) variable. Two numerical variables: use the ‘relationship’ template." };
    if (v1.type !== "cat") return { ok:false, msg:"Put the categorical variable in the groups slot and the numerical one in the compare slot." };
    if (v1.groups.length !== 2) return { ok:false, msg:"Use a grouping variable with exactly two groups." };
  } else if (v1.type === "cat") return { ok:false, msg:"A distribution question here needs a numerical variable, so you can draw a histogram." };
  if (!S.pop) return { ok:false, msg:"Choose a population." };
  if (S.pop !== ds.pop) return { ok:false, msg:ds.id === "m1" ? "Your data are 20 model students; match the population to the data." : ds.id === "m2" ? "Your data are 20 model school days at one cafeteria; match the population to the data." : "Your own data represent only your own data’s group; match the population to the data." };
  return { ok:true };
}
function tc1(S){
  if (S.ds === "m3") return { ok:false, msg:"For this milestone, use M1 or M2." };
  var q = qTest(S); if (!q.ok) return q;
  if (S.tpl === "one") return { ok:false, msg:"A distribution question is investigable, but this milestone asks for a question that links two variables: use the ‘relationship’ or ‘differ’ template." };
  return { ok:true };
}
function aTest(S){
  if (!qTest(S).ok) return { ok:false, msg:"First build an investigable question (Question tab)." };
  var a = S.an, T = S.tpl, any = AN.some(function(x){ return a[x[0]]; }), cen = a.means || a.medians, spr = a.iqr || a.sd;
  if (!any) return { ok:false, msg:"Tick the analysis items your question needs." };
  if (T !== "one" && a.hist && !a.scatter && !a.r && !a.line && !a.box && !cen && !spr) return { ok:false, msg:"A histogram shows one variable; your question links two." };
  if (T === "rel") {
    if (a.scatter && a.r && a.line) return { ok:true };
    if (a.box && !a.scatter) return { ok:false, msg:"Box plots compare groups; your question links two numerical variables." };
    return { ok:false, msg:"A relationship needs its pattern (scatter plot), its strength (" + M("r") + ") and a line of best fit." };
  }
  if (T === "diff") {
    if (a.box && cen && spr) return { ok:true };
    if (a.box && !spr) return { ok:false, msg:"Report a spread, so readers can judge the overlap." };
    if (a.scatter && !a.box) return { ok:false, msg:"One variable is categorical, so a scatter plot doesn’t fit. Use side-by-side box plots." };
    return { ok:false, msg:"Groups: show each group’s distribution (side-by-side box plots), with a centre and a spread for each group." };
  }
  if (a.hist && cen && spr) return { ok:true };
  return { ok:false, msg:"One variable: a histogram, a centre (mean or median) and a spread (IQR or standard deviation)." };
}
function hvName(S){ if (S.ds === "m3") return S.hvTxt.trim(); var L = HV[S.ds] || [], x = L.filter(function(h){ return h[0] === S.hv; })[0]; return x ? x[1] : ""; }
function tc3(S){
  var isQ = S.ds === "m1" && S.tpl === "rel" && ((S.v1 === "screen" && S.v2 === "mark") || (S.v1 === "mark" && S.v2 === "screen")) && S.pop === "s20";
  if (!isQ) return { ok:false, msg:"Set the question to “Is there a relationship between screen time and mark for these 20 model students?” first (Question tab)." };
  if (!S.dir) return { ok:false, msg:"Choose a direction." };
  if (S.dir !== "neg") return { ok:false, msg:S.dir === "pos" ? "The sign of " + M("r") + " is negative, so the direction is negative." : S.dir === "none" ? M("r = -0.86") + " shows a clear pattern. Read its sign." : "This is a relationship question: choose positive or negative." };
  if (!S.str) return { ok:false, msg:"Choose a strength word." };
  if (S.str !== "strong") return { ok:false, msg:S.str === "moderate" ? "0.86 is strong." : "0.86 is strong: |" + M("r") + "| ≥ 0.67." };
  if (!S.verb) return { ok:false, msg:"Choose a verb." };
  if (S.verb === "causes" || S.verb === "proves") return { ok:false, msg:"Observational data can’t show cause." };
  var L = S.lim;
  if (!(L.size || L.rep || L.hidden || L.model)) return { ok:false, msg:"Add a specific limitation: sample size, representativeness, a hidden variable or model data." };
  if (!L.hidden || !S.hv) return { ok:false, msg:"Tick ‘hidden variable’ and choose one that could drive both screen time and marks." };
  if (["sleep", "homework", "motivation"].indexOf(S.hv) < 0) return { ok:false, msg:"Name a variable that could plausibly drive both screen time and marks." };
  return { ok:true };
}
function strengthOf(r){ var a = Math.abs(r); return a >= 0.67 ? "strong" : a >= 0.33 ? "moderate" : "weak"; }
function taskApp(){ try { return MV.taskState().app; } catch (e) { return {}; } }
function taskExpl(){ try { return MV.taskState().explain || ""; } catch (e) { return ""; } }
// the performance task's 7 checks (also the planner's "Report readiness")
function repChecks(S){
  var C = calc(S), a = S.an, kind = S.tpl, ds = C.ds, L = S.lim, t = taskApp();
  var c1 = qTest(S).ok;
  var c2 = ds.own ? (S.src === (S.col ? "pri" : "sec") && ds.n >= 15) : S.src === "sec";
  var cen = a.means || a.medians, spr = a.iqr || a.sd;
  var c3 = kind === "rel" ? !!(a.r && a.line) : (kind === "diff" || kind === "one") ? !!(cen && spr) : false;
  var c4 = kind === "rel" ? !!a.scatter : kind === "diff" ? !!a.box : kind === "one" ? !!a.hist : false;
  var noCause = S.verb !== "causes" && S.verb !== "proves", c5 = false;
  if (kind === "rel" && C.rel) { var sw = strengthOf(C.rel.r); c5 = !!S.verb && noCause && ((S.str === sw && S.dir === (C.rel.r > 0 ? "pos" : "neg")) || (sw === "weak" && S.dir === "none" && (!S.str || S.str === "weak"))); }
  else if (kind === "diff" && C.groups) { var mA = C.groups[0].q.med, mB = C.groups[1].q.med; c5 = !!S.verb && noCause && (mA > mB ? S.dir === "ga" : mB > mA ? S.dir === "gb" : S.dir === "none"); }
  else if (kind === "one" && C.one) c5 = noCause;
  var nl = LIM.filter(function(x){ return L[x[0]]; }).length;
  var c6 = nl >= 2 && (kind === "one" || (!!L.hidden && !!hvName(S)));
  var c7 = words(taskExpl()) >= 50 && words(t.intro) >= 25;
  return [c1, c2, c3, c4, c5, c6, c7];
}
function groupNames(C){ return C.groups ? [C.groups[0].name, C.groups[1].name] : C.v1 && C.v1.type === "cat" && C.v1.groups && C.v1.groups.length === 2 ? [C.v1.gname[C.v1.groups[0]], C.v1.gname[C.v1.groups[1]]] : ["group A", "group B"]; }
function draftTxt(S, C){
  var v1 = C.v1, v2 = C.v2, verb = tOf(VERB, S.verb) || "[verb]";
  if (!S.tpl || !v1) return "";
  if (S.tpl === "rel" && v2) {
    var s = cap(v1.name) + " " + verb + " " + v2.name;
    if (S.dir === "none") s += ": no clear pattern"; else s += ": a " + (S.str || "[strength]") + " " + (S.dir === "pos" ? "positive" : S.dir === "neg" ? "negative" : "[direction]") + " linear relationship";
    return s + (C.rel ? " (r = " + fx(C.rel.r, 2) + ")" : "") + ".";
  }
  if (S.tpl === "diff" && v2) {
    var gn = groupNames(C), s2 = cap(v1.name) + " " + verb + " " + v2.name + ": ";
    if (S.dir === "ga" || S.dir === "gb") { var i = S.dir === "ga" ? 0 : 1; s2 += gn[i] + " had the higher median " + v2.name + (C.groups ? " (" + dN(C.groups[i].q.med) + " vs " + dN(C.groups[1 - i].q.med) + ")" : ""); }
    else if (S.dir === "none") s2 += "no clear difference between the groups"; else s2 += "[which group is higher]";
    return s2 + ".";
  }
  if (S.tpl === "one" && C.one) return "The " + v1.name + " values centre near " + dN(C.one.q.med) + " (median), with an IQR of " + dN(C.one.q.q3 - C.one.q.q1) + " and s = " + dN(C.one.sd) + ".";
  return "";
}
function sumList(S, C){
  var a = S.an, L = [];
  if (S.tpl === "rel" && C.rel) { if (a.r) L.push("r = " + fx(C.rel.r, 3)); if (a.line) L.push(lineTxt(C.rel)); }
  if (S.tpl === "diff" && C.groups) {
    var G = C.groups, f = function(fn){ return G.map(function(g){ return g.name + " " + fn(g); }).join(", "); };
    if (a.means) L.push("means: " + f(function(g){ return dN(g.mean, 2); }));
    if (a.medians) L.push("medians: " + f(function(g){ return dN(g.q.med, 2); }));
    if (a.iqr) L.push("IQRs: " + f(function(g){ return dN(g.q.q3 - g.q.q1, 2) + " (" + dN(g.q.q1, 2) + "–" + dN(g.q.q3, 2) + ")"; }));
    if (a.sd) L.push("standard deviations: " + f(function(g){ return dN(g.sd, 2); }));
  }
  if (S.tpl === "one" && C.one) {
    var o = C.one;
    if (a.means) L.push("mean " + dN(o.mean, 2)); if (a.medians) L.push("median " + dN(o.q.med, 2));
    if (a.iqr) L.push("IQR " + dN(o.q.q3 - o.q.q1, 2) + " (" + dN(o.q.q1, 2) + "–" + dN(o.q.q3, 2) + ")"); if (a.sd) L.push("s = " + dN(o.sd, 2));
  }
  return L;
}
function graphList(S){ var a = S.an, L = []; if (a.scatter) L.push("scatter plot"); if (a.resid) L.push("residual plot"); if (a.box) L.push("side-by-side box plots"); if (a.hist) L.push("histogram"); if (a.table) L.push("summary table"); return L; }
function dataLine(S, ds){ ds = ds || dsOf(S); return ds.code + ", n = " + ds.n + ", " + (S.src === "pri" ? "primary" : S.src === "sec" ? "secondary" : "source not chosen") + (ds.own ? "" : " (model data)"); }
function limList(S){ return LIM.filter(function(x){ return S.lim[x[0]]; }).map(function(x){ return x[0] === "hidden" ? "hidden variable" + (hvName(S) ? " (" + hvName(S) + ")" : "") : x[1]; }); }

// ---------- charts (D10, D11): drawn in pixel space inside a Plot's after() hook ----------
function niceStep(r){ var p = Math.pow(10, Math.floor(Math.log10(r))), m = r / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; }
function rng(vals, k){ var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals); if (lo === hi) { lo -= 1; hi += 1; } var st = niceStep((hi - lo) / (k || 5)); return [Math.floor(lo / st - 1e-9) * st, Math.ceil(hi / st + 1e-9) * st, st]; }
function frame(ctx, W, H, o){
  var fu = css("--font-ui") || "sans-serif", L = o.left || 54, R = W - 14, T = 14, B = H - 38;
  var f = { L:L, R:R, T:T, B:B, X:function(x){ return L + (x - o.x[0]) / (o.x[1] - o.x[0]) * (R - L); }, Y:function(y){ return B - (y - o.y[0]) / (o.y[1] - o.y[0]) * (B - T); } };
  var nx = Math.round((o.x[1] - o.x[0]) / o.x[2]), ny = o.y ? Math.round((o.y[1] - o.y[0]) / o.y[2]) : 0, k, v;
  ctx.lineWidth = 1; ctx.strokeStyle = css("--plot-grid"); ctx.beginPath();
  for (k = 0; k <= nx; k++) { v = Math.round(f.X(o.x[0] + k * o.x[2])) + 0.5; ctx.moveTo(v, T); ctx.lineTo(v, B); }
  if (o.y) for (k = 0; k <= ny; k++) { v = Math.round(f.Y(o.y[0] + k * o.y[2])) + 0.5; ctx.moveTo(L, v); ctx.lineTo(R, v); }
  ctx.stroke();
  ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
  ctx.fillStyle = css("--ink-2"); ctx.font = "12px " + fu; ctx.textAlign = "center"; ctx.textBaseline = "top";
  var last = -1e9;
  if (!o.noXt) for (k = 0; k <= nx; k++) { var x = o.x[0] + k * o.x[2], lab = dN(x, 2), w = ctx.measureText(lab).width, px = f.X(x); if (px - w / 2 < last + 4) continue; ctx.fillText(lab, px, B + 4); last = px + w / 2; }
  if (o.y) { ctx.textAlign = "right"; ctx.textBaseline = "middle"; var lastY = 1e9; for (k = 0; k <= ny; k++) { var py = f.Y(o.y[0] + k * o.y[2]); if (py > lastY - 14) continue; ctx.fillText(dN(o.y[0] + k * o.y[2], 2), L - 5, py); lastY = py; } }
  if (o.xLab) { ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(o.xLab, (L + R) / 2, H - 2); }
  if (o.yLab) { ctx.save(); ctx.translate(12, (T + B) / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(o.yLab, 0, 0); ctx.restore(); }
  return f;
}
function dot(ctx, x, y, r, fill){ ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = css("--sheet"); ctx.stroke(); }
function axLab(v){ return v.name + (v.unit ? " (" + v.unit + ")" : ""); }
// scatter: o = {x, y, xv, yv, R (regression or null), line:bool, prog 0..1, colourBy:[values] | null, cp 0..1}
function drawScatter(plot, o){
  plot.draw({ grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var xr = rng(o.x), yr = rng(o.y), f = frame(ctx, p.W, p.H, { x:xr, y:yr, xLab:axLab(o.xv), yLab:axLab(o.yv) });
    if (o.line && o.R) {
      ctx.save(); ctx.beginPath(); ctx.rect(f.L, f.T, f.R - f.L, f.B - f.T); ctx.clip();
      ctx.strokeStyle = css("--ink"); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(f.X(xr[0]), f.Y(o.R.a + o.R.b * xr[0])); ctx.lineTo(f.X(xr[1]), f.Y(o.R.a + o.R.b * xr[1])); ctx.stroke(); ctx.restore();
    }
    var n = Math.round(o.x.length * (o.prog == null ? 1 : o.prog)), cA = css("--ev-a"), cC = css("--ev-c"), pen = css("--pen");
    var lo = o.colourBy ? Math.min.apply(null, o.colourBy) : 0, hi = o.colourBy ? Math.max.apply(null, o.colourBy) : 1, cp = o.cp == null ? 1 : o.cp;
    for (var i = 0; i < n; i++) { var c = o.colourBy ? mix(pen, mix(cA, cC, (o.colourBy[i] - lo) / (hi - lo || 1)), cp) : pen; dot(ctx, f.X(o.x[i]), f.Y(o.y[i]), 4.5, c); }
    if (o.colourBy && cp > 0) {
      var gw = 90, gx = f.R - gw - 6, gy = f.T + 6, g = ctx.createLinearGradient(gx, 0, gx + gw, 0);
      ctx.globalAlpha = cp; g.addColorStop(0, cA); g.addColorStop(1, cC); ctx.fillStyle = g; ctx.fillRect(gx, gy, gw, 8);
      ctx.fillStyle = css("--ink-2"); ctx.font = "11px " + (css("--font-ui") || "sans-serif"); ctx.textBaseline = "top"; ctx.textAlign = "left"; ctx.fillText("colder", gx, gy + 11); ctx.textAlign = "right"; ctx.fillText("hotter", gx + gw, gy + 11); ctx.globalAlpha = 1;
    }
  } });
}
function drawResid(plot, o){
  plot.draw({ grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var res = o.x.map(function(x, i){ return o.y[i] - (o.R.a + o.R.b * x); }), m = Math.max.apply(null, res.map(Math.abs)) || 1, st = niceStep(m / 2), top = Math.ceil(m / st + 1e-9) * st;
    var f = frame(ctx, p.W, p.H, { x:rng(o.x), y:[-top, top, st], xLab:axLab(o.xv), yLab:"residual" });
    ctx.setLineDash([6, 5]); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(f.L, f.Y(0)); ctx.lineTo(f.R, f.Y(0)); ctx.stroke(); ctx.setLineDash([]);
    var c = css("--ev-c");
    res.forEach(function(r, i){ ctx.strokeStyle = c; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(f.X(o.x[i]), f.Y(0)); ctx.lineTo(f.X(o.x[i]), f.Y(r)); ctx.stroke(); dot(ctx, f.X(o.x[i]), f.Y(r), 4, c); });
  } });
}
// side-by-side box plots: o = {groups:[{name, q}], xv, prog}
function drawBoxes(plot, o){
  plot.draw({ grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var fu = css("--font-ui") || "sans-serif"; ctx.font = "600 12px " + fu;
    var lw = Math.max.apply(null, o.groups.map(function(g){ return ctx.measureText(g.name).width; }));
    var all = []; o.groups.forEach(function(g){ all.push(g.q.min, g.q.max); });
    var f = frame(ctx, p.W, p.H, { x:rng(all), y:null, xLab:axLab(o.xv), left:Math.min(p.W * 0.4, lw + 16) }), n = o.groups.length, rowH = (f.B - f.T) / n, bh = Math.min(44, rowH * 0.5), pr = o.prog == null ? 1 : o.prog;
    var cols = [[css("--ev-a"), css("--ev-a-soft")], [css("--ev-b"), css("--ev-b-soft")]];
    if (n === 2 && pr >= 1) {
      var lo = Math.max(o.groups[0].q.q1, o.groups[1].q.q1), hi = Math.min(o.groups[0].q.q3, o.groups[1].q.q3);
      if (hi > lo) { ctx.fillStyle = css("--hi-soft"); ctx.fillRect(f.X(lo), f.T, f.X(hi) - f.X(lo), f.B - f.T); ctx.fillStyle = css("--ink-2"); ctx.font = "11px " + fu; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText("overlap " + dN(lo) + "–" + dN(hi), (f.X(lo) + f.X(hi)) / 2, f.T + 2); }
    }
    o.groups.forEach(function(g, i){
      var q = g.q, cy = f.T + (i + 0.5) * rowH + (n === 2 ? 6 : 0), c = cols[i % 2], s = function(v){ return f.X(q.med + (v - q.med) * pr); };
      ctx.strokeStyle = c[0]; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(s(q.min), cy); ctx.lineTo(s(q.q1), cy); ctx.moveTo(s(q.q3), cy); ctx.lineTo(s(q.max), cy);
      ctx.moveTo(s(q.min), cy - bh / 4); ctx.lineTo(s(q.min), cy + bh / 4); ctx.moveTo(s(q.max), cy - bh / 4); ctx.lineTo(s(q.max), cy + bh / 4); ctx.stroke();
      ctx.fillStyle = c[1]; ctx.fillRect(s(q.q1), cy - bh / 2, s(q.q3) - s(q.q1), bh); ctx.strokeRect(s(q.q1), cy - bh / 2, s(q.q3) - s(q.q1), bh);
      ctx.strokeStyle = css("--ink"); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(f.X(q.med), cy - bh / 2); ctx.lineTo(f.X(q.med), cy + bh / 2); ctx.stroke();
      ctx.fillStyle = c[0]; ctx.font = "600 12px " + fu; ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(g.name, f.L - 8, cy);
    });
  } });
}
function drawHist(plot, o){
  plot.draw({ grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var v = o.vals, lo = Math.min.apply(null, v), hi = Math.max.apply(null, v), w = niceStep((hi - lo || 1) / 6), x0 = Math.floor(lo / w + 1e-9) * w, nb = Math.max(1, Math.ceil((hi - x0) / w + 1e-9)), cnt = [], k;
    if (x0 + nb * w <= hi) nb++;
    for (k = 0; k < nb; k++) cnt.push(0);
    v.forEach(function(x){ cnt[Math.min(nb - 1, Math.floor((x - x0) / w + 1e-9))]++; });
    var mx = Math.max.apply(null, cnt), ys = mx <= 8 ? 1 : niceStep(mx / 5);
    var f = frame(ctx, p.W, p.H, { x:[x0, x0 + nb * w, w], y:[0, Math.ceil(mx / ys) * ys, ys], xLab:axLab(o.xv), yLab:"frequency" }), pr = o.prog == null ? 1 : o.prog;
    ctx.lineWidth = 1.5;
    cnt.forEach(function(c, i){ var X0 = f.X(x0 + i * w), X1 = f.X(x0 + (i + 1) * w), Y = f.Y(c * pr); ctx.fillStyle = css("--ev-a-soft"); ctx.fillRect(X0, Y, X1 - X0, f.B - Y); ctx.strokeStyle = css("--ev-a"); ctx.strokeRect(X0 + 0.5, Y, X1 - X0 - 1, f.B - Y); });
  } });
}
// Part 3: Investigation A's bar graph (axis from base)
function drawBars(plot, base){
  plot.draw({ grid:false, axes:false, ticks:false, describe:"Bar graph of mean marks: breakfast 81%, no breakfast 74%, with the y-axis starting at " + base + ".", after:function(ctx, p){
    var top = base ? 84 : 90, f = frame(ctx, p.W, p.H, { x:[0, 4, 4], y:[base, top, base ? 2 : 10], yLab:"mean mark (%)", noXt:true }), fu = css("--font-ui") || "sans-serif";
    [["breakfast", 81, 1], ["no breakfast", 74, 3]].forEach(function(b, i){
      var cx = f.X(b[2]), bw = (f.R - f.L) * 0.26, Y = f.Y(b[1]);
      ctx.fillStyle = i ? css("--ev-b-soft") : css("--ev-a-soft"); ctx.fillRect(cx - bw / 2, Y, bw, f.B - Y); ctx.strokeStyle = i ? css("--ev-b") : css("--ev-a"); ctx.lineWidth = 2; ctx.strokeRect(cx - bw / 2, Y, bw, f.B - Y);
      ctx.fillStyle = css("--ink"); ctx.font = "600 13px " + fu; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(b[1] + "%", cx, Y - 3);
      ctx.fillStyle = css("--sheet"); ctx.fillRect(cx - 50, f.B + 2, 100, 16); ctx.fillStyle = css("--ink-2"); ctx.font = "12px " + fu; ctx.textBaseline = "top"; ctx.fillText(b[0], cx, f.B + 4);
    });
  } });
}

// ---------- Explore: investigation planner (D13) ----------
var PL = null, plannerRefresh = function(){};
function explore(host, api){
  var S = norm(api.S); PL = S;
  var anim = null, plots = [], gKey = "";
  host.innerHTML =
    '<div class="ci-top"><div id="ci-ds"></div><p class="tiny ci-dsnote" id="ci-dsnote"></p>' +
    '<details class="alg ci-data" id="ci-data"><summary id="ci-data-sum">See the data</summary><div id="ci-data-in"></div></details></div>' +
    '<div class="pg ci-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p><div id="ci-graphs" class="ci-graphs"></div></div>' +
    '<div class="pg-ctrl"><div id="ci-tabs" class="ci-tabs"></div><div id="ci-stage" class="ci-stage"></div></div>' +
    '<div class="pg-read"><dl class="read ci-read" id="ci-read" aria-live="polite"></dl><button type="button" class="btn ghost sm ci-all" id="ci-all" data-k="ciall" aria-expanded="false">Show all</button></div></div>';
  var dsR = radios($("#ci-ds", host), { label:"Data set", options:DSOPT, value:S.ds, cls:"chips", key:"cids", onChange:function(v){
    S.ds = v; S.v1 = ""; S.v2 = ""; S.hv = ""; if (v === "m3") $("#ci-data", host).open = true; api.save(); paintData(); paintAll(); } });
  var tabsR = null;
  function unlocked(i){ return i <= S.unl; }
  function autoUnlock(){
    var u = S.unl;
    if (qTest(S).ok) u = Math.max(u, 1);
    if (u >= 1 && S.src) u = Math.max(u, 2);
    if (u >= 2 && aTest(S).ok) u = Math.max(u, 3);
    if (u !== S.unl) { S.unl = u; api.save(); return true; }
    return false;
  }
  function stageDone(i){ return i === 0 ? qTest(S).ok : i === 1 ? !!S.src : i === 2 ? aTest(S).ok : (function(){ var c = repChecks(S); return c[4] && c[5]; })(); }
  function paintTabs(){
    var opts = STAGES.map(function(n, i){ return { id:i, t:n + (stageDone(i) ? ' <span aria-hidden="true">✓</span>' : !unlocked(i) ? ' <span aria-hidden="true">🔒</span>' : ""), aria:n + (stageDone(i) ? ", done" : !unlocked(i) ? ", locked" : "") }; });
    if (tabsR) { tabsR.setOptions(opts); tabsR.set(S.stage); return; }
    tabsR = radios($("#ci-tabs", host), { label:"Stage", options:opts, value:S.stage, cls:"seg", key:"citab", disabled:function(id){ return !unlocked(+id); },
      onChange:function(v){ S.stage = +v; api.save(); paintStage(); paintRead(); } });
  }
  function skipHTML(i){ return i < 3 ? '<div class="q-actions ci-skip"><button type="button" class="btn ghost sm" data-ci="skip" data-k="ciskip">' + (unlocked(i + 1) ? "Go to " + STAGES[i + 1] + " →" : "Skip ahead to " + STAGES[i + 1]) + "</button></div>" : ""; }
  function sec(id, cls){ return '<div class="ci-sec' + (cls ? " " + cls : "") + '" id="' + id + '"></div>'; }
  function paintStage(){
    var box = $("#ci-stage", host), ds = dsOf(S), i = S.stage, h = "";
    if (i === 0) h = sec("ci-tpl") + '<p class="ci-tplq tiny muted">' + esc(tOf(TPL, S.tpl) ? TPL.filter(function(t){ return t.id === S.tpl; })[0].q : "Choose a template.") + "</p>" + (S.tpl ? sec("ci-v1") + (S.tpl !== "one" ? sec("ci-v2") : "") : "") + sec("ci-pop") +
      (S.p4 && !ds.own ? '<p class="tiny muted ci-p4">Greyed: your data don’t represent these populations. Conclusions extend only to the population the sample represents.</p>' : "") + skipHTML(0);
    else if (i === 1) {
      h = sec("ci-src") + (ds.own ? '<label class="ci-cb"><input type="checkbox" id="ci-col" data-k="cicol"' + (S.col ? " checked" : "") + "> I collected this</label>" : "") + sec("ci-samp", "ci-chips") +
        '<h4 class="ci-h">Variables</h4>' + (ds.vars.length ? MV.tableHTML({ head:["Variable", "Type", "Unit", "In your question"], rows:ds.vars.map(function(v){ return [esc(v.name), v.type === "num" ? "numerical" : "categorical", esc(v.unit || "—"), v.id === S.v1 || v.id === S.v2 ? "✓" : ""]; }) }) : '<p class="tiny muted">Name your columns in “Your data” first.</p>') +
        '<p class="tiny">Data: ' + rich(dataLine(S, ds)) + "</p>" + skipHTML(1);
    } else if (i === 2) {
      var one = S.tpl === "one";
      h = '<fieldset class="ci-an"><legend>Analysis menu</legend>' + AN.map(function(x){ return '<label class="ci-cb"><input type="checkbox" data-an="' + x[0] + '" data-k="cian' + x[0] + '"' + (S.an[x[0]] ? " checked" : "") + "> " + (one && AN1[x[0]] ? AN1[x[0]] : x[1]) + "</label>"; }).join("") + "</fieldset>" +
        (S.ds === "m2" && S.tpl === "rel" && S.an.scatter ? '<label class="ci-cb ci-colour"><input type="checkbox" id="ci-colour" data-k="cicolour"' + (S.colour ? " checked" : "") + "> Colour by temperature</label>" : "") + skipHTML(2);
    } else {
      h = sec("ci-dir", "ci-chips") + sec("ci-str", "ci-chips") + sec("ci-verb", "ci-chips") +
        '<fieldset class="ci-an ci-lim"><legend>Limitations</legend>' + LIM.map(function(x){ return '<label class="ci-cb"><input type="checkbox" data-lim="' + x[0] + '" data-k="cilim' + x[0] + '"' + (S.lim[x[0]] ? " checked" : "") + "> " + x[1] + "</label>"; }).join("") + "</fieldset>" +
        (S.lim.hidden ? (ds.own ? '<div class="numrow"><label for="ci-hvtxt">Hidden variable:</label><input class="numin ci-txt" id="ci-hvtxt" type="text" autocomplete="off" maxlength="60" value="' + esc(S.hvTxt) + '"></div>' : sec("ci-hv", "ci-chips")) : "") +
        sec("ci-fi", "ci-chips");
    }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
    if (i === 0) {
      radios($("#ci-tpl", box), { label:"Template", options:TPL, value:S.tpl, cls:"chips", key:"citpl", onChange:function(v){ S.tpl = v; api.save(); paintStage(); refresh(); } });
      var vo = ds.vars.map(function(v){ return { id:v.id, t:esc(v.name) }; });
      if (S.tpl && $("#ci-v1", box)) radios($("#ci-v1", box), { label:S.tpl === "rel" ? "First variable" : S.tpl === "diff" ? "Groups" : "Variable", options:vo, value:S.v1, cls:"chips", key:"civ1", onChange:function(v){ S.v1 = v; api.save(); refresh(); } });
      if ($("#ci-v2", box)) radios($("#ci-v2", box), { label:S.tpl === "rel" ? "Second variable" : "Compare", options:vo, value:S.v2, cls:"chips", key:"civ2", onChange:function(v){ S.v2 = v; api.save(); refresh(); } });
      if (!vo.length && S.tpl) $("#ci-v1", box).innerHTML = '<p class="tiny muted">Name your data’s columns in “Your data” (above) first.</p>';
      radios($("#ci-pop", box), { label:"Population", options:POPS.map(function(p){ var g = S.p4 && !ds.own && p.id !== ds.pop; return { id:p.id, t:g ? '<span class="ci-dim">' + p.t + "</span>" : p.t, aria:p.t + (g ? " (greyed: beyond your data)" : "") }; }), value:S.pop, cls:"chips", key:"cipop", onChange:function(v){ S.pop = v; api.save(); refresh(); } });
    } else if (i === 1) {
      radios($("#ci-src", box), { label:"Source", options:SRC, value:S.src, cls:"seg", key:"cisrc", onChange:function(v){ S.src = v; api.save(); refresh(); } });
      radios($("#ci-samp", box), { label:"Sampling", options:SAMP, value:S.samp, cls:"chips", key:"cisamp", onChange:function(v){ S.samp = v; api.save(); refresh(); } });
    } else if (i === 3) {
      var C2 = calc(S), g2 = groupNames(C2);
      radios($("#ci-dir", box), { label:"Direction", options:[{ id:"pos", t:"positive" }, { id:"neg", t:"negative" }, { id:"none", t:"no clear pattern" }, { id:"ga", t:esc(g2[0]) + " higher" }, { id:"gb", t:esc(g2[1]) + " higher" }], value:S.dir, cls:"chips", key:"cidir", onChange:function(v){ S.dir = v; api.save(); refresh(); } });
      radios($("#ci-str", box), { label:"Strength", options:STR, value:S.str, cls:"chips", key:"cistr", onChange:function(v){ S.str = v; api.save(); refresh(); } });
      radios($("#ci-verb", box), { label:"Verb", options:VERB, value:S.verb, cls:"chips", key:"civerb", onChange:function(v){ S.verb = v; api.save(); refresh(); } });
      if ($("#ci-hv", box)) radios($("#ci-hv", box), { label:"Hidden variable", options:(HV[S.ds] || []).map(function(x){ return { id:x[0], t:x[1] }; }), value:S.hv, cls:"chips", key:"cihv", onChange:function(v){ S.hv = v; api.save(); refresh(); } });
      radios($("#ci-fi", box), { label:"Further investigation", options:FI, value:S.fi, cls:"chips", key:"cifi", onChange:function(v){ S.fi = v; api.save(); refresh(); } });
    }
  }
  function graphSpecs(){
    var C = calc(S), a = S.an, L = [];
    if (S.tpl === "rel" && C.rel) { if (a.scatter) L.push("sc"); if (a.resid) L.push("res"); if (a.hist) L.push("hist2"); }
    if (S.tpl === "diff" && C.groups) { if (a.box) L.push("box"); if (a.hist) L.push("hist2"); }
    if (S.tpl === "one" && C.one) { if (a.hist) L.push("hist1"); if (a.box) L.push("box1"); }
    return { C:C, L:L };
  }
  function scOpts(C, a){
    var x = C.v1.vals, y = C.v2.vals, colourOn = S.ds === "m2" && S.colour, cp = anim && anim.id === "p3" ? anim.t : 1;
    return { x:x, y:y, xv:C.v1, yv:C.v2, R:C.rel, line:!!a.line, prog:anim && anim.id === "p1" ? anim.t : 1, colourBy:colourOn || (anim && anim.id === "p3") ? M2T : null, cp:cp,
      describe:"Scatter plot of " + C.v2.name + " against " + C.v1.name + ", " + x.length + " points; r = " + fx(C.rel.r, 3) + (a.line ? "; line " + lineTxt(C.rel) : "") + (colourOn ? "; points coloured from blue (colder days) to orange (hotter days)" : "") + "." };
  }
  function renderGraphs(){
    var G = graphSpecs(), C = G.C, a = S.an, box = $("#ci-graphs", host), key = G.L.join(",") + "|" + (a.table ? 1 : 0) + "|" + S.ds + S.tpl + S.v1 + S.v2;
    if (key !== gKey) {
      gKey = key; plots = [];
      var h = "";
      if (!G.L.length) h = '<p class="ci-empty muted">' + (S.tpl && (C.rel || C.groups || C.one) ? "Tick graph items in the Analysis tab to draw them here." : "Build a question and choose analysis items: your graphs and summaries appear here.") + "</p>";
      G.L.forEach(function(g){ h += '<div class="plot-wrap"><canvas class="plot' + (g === "sc" ? "" : " wide") + '" data-g="' + g + '" role="img" aria-label="Graph"></canvas></div>'; });
      h += '<div id="ci-tbl"></div>';
      box.innerHTML = h;
      Array.prototype.forEach.call(box.querySelectorAll("canvas[data-g]"), function(cv){ var p = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }), g = cv.dataset.g; p.render = function(){ drawG(p, g); }; plots.push(p); });
    }
    plots.forEach(function(p){ p.render(); });
    var tb = $("#ci-tbl", box); if (tb) tb.innerHTML = a.table ? summaryTable(C) : "";
  }
  function drawG(p, g){
    var C = calc(S), a = S.an;
    if (g === "sc" && C.rel) drawScatter(p, scOpts(C, a));
    else if (g === "res" && C.rel) drawResid(p, { x:C.v1.vals, y:C.v2.vals, xv:C.v1, R:C.rel, describe:"Residual plot: residuals of " + C.v2.name + " against " + C.v1.name + " scatter above and below zero." });
    else if (g === "box" && C.groups) drawBoxes(p, { groups:C.groups, xv:C.v2, prog:anim && anim.id === "p2" ? anim.t : 1,
      describe:"Side-by-side box plots of " + C.v2.name + ": " + C.groups.map(function(G){ return G.name + " " + dN(G.q.min) + ", " + dN(G.q.q1) + ", " + dN(G.q.med) + ", " + dN(G.q.q3) + ", " + dN(G.q.max); }).join("; ") + " (minimum, Q1, median, Q3, maximum)." });
    else if (g === "box1" && C.one) drawBoxes(p, { groups:[{ name:C.v1.name, q:C.one.q }], xv:C.v1, describe:"Box plot of " + C.v1.name + "." });
    else if (g === "hist2" && C.v2 && C.v2.type === "num" && C.v2.vals.length) drawHist(p, { vals:C.v2.vals, xv:C.v2, describe:"Histogram of " + C.v2.name + " for all " + C.v2.vals.length + " rows." });
    else if (g === "hist1" && C.one) drawHist(p, { vals:C.one.vals, xv:C.v1, describe:"Histogram of " + C.v1.name + "." });
  }
  function summaryTable(C){
    var rows = [], row = function(lab, v){ var q = quart(v); return [esc(lab), String(v.length), dN(mean(v), 2), dN(sdev(v), 2), dN(q.min, 2), dN(q.q1, 2), dN(q.med, 2), dN(q.q3, 2), dN(q.max, 2)]; };
    if (S.tpl === "rel" && C.rel) { rows.push(row(C.v1.name, C.v1.vals)); rows.push(row(C.v2.name, C.v2.vals)); }
    else if (S.tpl === "diff" && C.groups) C.groups.forEach(function(G){ rows.push(row(C.v2.name + ": " + G.name, G.vals)); });
    else if (S.tpl === "one" && C.one) rows.push(row(C.v1.name, C.one.vals));
    if (!rows.length) return "";
    return MV.tableHTML({ head:["", M("n"), "mean", M("s"), "min", M("Q_1"), "median", M("Q_3"), "max"], rows:rows, caption:"Summary table (quartiles by the course method)" });
  }
  function paintRead(){
    var C = calc(S), chk = repChecks(S), met = chk.filter(Boolean).length, sl = sumList(S, C), q = qText(S, C.ds);
    var stat = STAGES.map(function(n, i){ return n + (stageDone(i) ? " ✓" : i === S.stage ? " …" : ""); }).join(" · ");
    var rows = [["Stage status", stat, 0], ["Your question", q ? rich(q) : '<span class="muted">Choose a template.</span>', 1], ["Data", rich(dataLine(S, C.ds)), 1],
      ["Live summaries", sl.length ? rich(sl.join("; ")) : '<span class="muted">Only items you choose in the Analysis menu appear here.</span>', 1],
      ["Conclusion draft", draftTxt(S, C) ? rich(draftTxt(S, C)) : '<span class="muted">Build it in the Conclusion tab.</span>', 1],
      ["Report readiness", met + " of 7 report checks met", 0]];
    var el = $("#ci-read", host); el.className = "read ci-read" + (S.showAll ? " all" : "");
    el.innerHTML = rows.map(function(r){ return '<div class="' + (r[2] ? "ci-opt" : "") + '"><dt>' + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("");
    var b = $("#ci-all", host); b.textContent = S.showAll ? "Show less" : "Show all"; b.setAttribute("aria-expanded", String(S.showAll));
  }
  function paintDsNote(){
    var ds = dsOf(S);
    $("#ci-dsnote", host).innerHTML = ds.own ? '<strong>Saved on this device only. Don’t enter names.</strong> ' + ds.n + " complete row" + (ds.n === 1 ? "" : "s") + (ds.bad ? " · " + ds.bad + " row" + (ds.bad === 1 ? "" : "s") + " with blanks excluded" : "") + " (the report needs at least 15)."
      : '<span class="mdm-model">Model data: made-up people and days</span> ' + (ds.id === "m1" ? "20 Grade 12 students at a model school." : "20 school days at a model cafeteria.") + " Real data are usually messier.";
    $("#ci-data-sum", host).textContent = ds.own ? "Your data (edit here)" : "See the data";
  }
  // own-data table (M3) or a read-only view of M1 / M2
  function paintData(){
    var box = $("#ci-data-in", host), ds = dsOf(S);
    paintDsNote();
    if (!ds.own) {
      box.innerHTML = S.ds === "m1" ? MV.tableHTML({ head:["#", "Screen (h/day)", "Sleep (h/night)", "Mark (%)", "Sport (Y/N)"], rows:M1R.map(function(r, i){ return [String(i + 1), String(r[0]), r[1].toFixed(1), String(r[2]), r[3]]; }), caption:"M1: 20 Grade 12 students at a model school (model data)" })
        : MV.tableHTML({ head:["Day", "Temperature (°C)", "Soup (bowls)", "Cold drinks"], rows:M2T.map(function(t, i){ return [String(i + 1), mi(String(t)), String(M2S[i]), String(M2D[i])]; }), caption:"M2: 20 school days at a model cafeteria (model data)" });
      return;
    }
    var o = ownCfg(S);
    var h = '<p class="ci-priv"><strong>Saved on this device only. Don’t enter names.</strong> Name up to 4 columns and mark each numerical or categorical. Use the arrow keys to move between cells.</p>' +
      '<div class="tbl-wrap ci-ownwrap"><table class="ci-own"><thead><tr><th scope="col">Row</th>' + o.cols.map(function(c, i){
        return '<th scope="col"><input class="ci-cn" type="text" data-oc="' + i + '" aria-label="Column ' + (i + 1) + ' name" placeholder="Column ' + (i + 1) + ' name" maxlength="40" autocomplete="off" value="' + esc(c.name) + '">' +
          '<select data-ot="' + i + '" aria-label="Column ' + (i + 1) + ' type"><option value="num"' + (c.type === "num" ? " selected" : "") + '>numerical</option><option value="cat"' + (c.type === "cat" ? " selected" : "") + ">categorical</option></select></th>"; }).join("") + "</tr></thead><tbody>" +
      o.rows.map(function(r, ri){ var st = ownRowState(o, r);
        return '<tr data-row="' + ri + '"' + (st === "bad" ? ' class="ci-bad"' : "") + '><th scope="row"><span class="ci-flag" aria-label="' + (st === "bad" ? "Row " + (ri + 1) + " has blanks: excluded" : "Row " + (ri + 1)) + '">' + (ri + 1) + (st === "bad" ? " ⚠" : "") + "</span></th>" + r.map(function(v, ci){
          return '<td><input type="text" data-r="' + ri + '" data-c="' + ci + '"' + (o.cols[ci].type === "num" ? ' inputmode="decimal"' : "") + ' aria-label="Row ' + (ri + 1) + ", column " + (ci + 1) + '" maxlength="30" autocomplete="off" value="' + esc(v) + '"></td>'; }).join("") + "</tr>"; }).join("") +
      '</tbody></table></div><div class="q-actions"><button type="button" class="btn sm" data-ci="addrow" data-k="ciadd"' + (o.rows.length >= 60 ? " disabled" : "") + '>Add a row</button><button type="button" class="btn ghost sm" data-ci="add5" data-k="ciadd5"' + (o.rows.length >= 60 ? " disabled" : "") + ">Add 5 rows</button></div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  function flagRow(ri){
    var o = ownCfg(S), tr = host.querySelector('tr[data-row="' + ri + '"]'); if (!tr) return;
    var st = ownRowState(o, o.rows[ri]); tr.classList.toggle("ci-bad", st === "bad");
    var fl = tr.querySelector(".ci-flag"); fl.textContent = (ri + 1) + (st === "bad" ? " ⚠" : ""); fl.setAttribute("aria-label", st === "bad" ? "Row " + (ri + 1) + " has blanks: excluded" : "Row " + (ri + 1));
  }
  function refresh(){
    autoUnlock(); paintTabs();
    paintRead(); renderGraphs(); MV.changed();
  }
  function paintAll(){ dsR.set(S.ds); paintTabs(); paintStage(); paintRead(); renderGraphs(); paintDsNote(); MV.changed(); }
  plannerRefresh = function(){ if ($("#ci-read", host)) { paintRead(); if (S.stage === 3) paintStage(); paintTabs(); } };

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.id === "ci-all") { S.showAll = !S.showAll; api.save(); paintRead(); return; }
    var act = b.dataset.ci;
    if (act === "skip") { var nx = Math.min(3, S.stage + 1); S.unl = Math.max(S.unl, nx); S.stage = nx; api.save(); paintTabs(); paintStage(); paintRead(); var t = host.querySelector('[data-k="citab' + nx + '"]'); if (t) t.focus(); return; }
    if (act === "addrow" || act === "add5") { var o = ownCfg(S), k = act === "add5" ? 5 : 1; while (k-- > 0 && o.rows.length < 60) o.rows.push(["", "", "", ""]); api.save(); paintData(); return; }
  });
  host.addEventListener("change", function(e){
    var t = e.target;
    if (t.dataset.an) { S.an[t.dataset.an] = t.checked; api.save(); if (t.dataset.an === "scatter") paintStage(); refresh(); return; }
    if (t.dataset.lim) { S.lim[t.dataset.lim] = t.checked; api.save(); if (t.dataset.lim === "hidden") paintStage(); refresh(); return; }
    if (t.id === "ci-colour") { S.colour = t.checked; api.save(); refresh(); return; }
    if (t.id === "ci-col") { S.col = t.checked; api.save(); refresh(); return; }
    if (t.dataset.ot != null) { var o = ownCfg(S), ci = +t.dataset.ot; o.cols[ci].type = t.value === "cat" ? "cat" : "num"; api.save(); paintData(); paintStage(); refresh(); }
  });
  host.addEventListener("input", function(e){
    var t = e.target, o;
    if (t.id === "ci-hvtxt") { S.hvTxt = t.value.slice(0, 60); api.save(); paintRead(); MV.changed(); return; }
    if (t.dataset.oc != null) { o = ownCfg(S); o.cols[+t.dataset.oc].name = t.value.slice(0, 40); api.save(); for (var i = 0; i < o.rows.length; i++) flagRow(i); paintDsNote(); paintStage(); refresh(); return; }
    if (t.dataset.r != null) { o = ownCfg(S); o.rows[+t.dataset.r][+t.dataset.c] = t.value.slice(0, 30); api.save(); flagRow(+t.dataset.r); paintDsNote(); refresh(); }
  });
  host.addEventListener("keydown", function(e){
    var t = e.target; if (t.dataset.r == null) return;
    var r = +t.dataset.r, c = +t.dataset.c, n = null, len = t.value.length;
    if (e.key === "ArrowDown" || e.key === "Enter") n = [r + 1, c]; else if (e.key === "ArrowUp") n = [r - 1, c];
    else if (e.key === "ArrowLeft" && t.selectionStart === 0 && t.selectionEnd === 0) n = [r, c - 1];
    else if (e.key === "ArrowRight" && t.selectionStart === len) n = [r, c + 1];
    if (!n) return;
    var nx = host.querySelector('input[data-r="' + n[0] + '"][data-c="' + n[1] + '"]'); if (nx) { e.preventDefault(); nx.focus(); }
  });
  paintData(); paintAll();
  if (S.ds === "m3") $("#ci-data", host).open = true;

  function applyStart(p){
    var s = p.start || {};
    if (s.ds) { S.ds = s.ds; dsR.set(S.ds); paintData(); }
    if (s.tpl) { S.tpl = s.tpl; S.v1 = s.v1 || ""; S.v2 = s.v2 || ""; S.pop = s.pop || ""; }
    if (s.an) { S.an = {}; s.an.forEach(function(k){ S.an[k] = true; }); }
    if (p.id === "p3") S.colour = false;
    if (p.id === "p4") S.p4 = false;
    S.stage = s.stage || 0; S.unl = Math.max(S.unl, S.stage);
    api.save();
  }
  return {
    predict:{
      start:function(p){ applyStart(p); anim = p.id === "p4" ? null : { id:p.id, t:0 }; gKey = ""; paintAll(); },
      run:function(p, done){
        if (p.id === "p4") { MV.wait(600, function(){ S.p4 = true; api.save(); paintStage(); done(); }); return; }
        MV.tween({ dur:p.id === "p3" ? 1400 : 1700, step:function(t){ if (anim) anim.t = t; plots.forEach(function(q){ q.render(); }); },
          done:function(){ anim = null; if (p.id === "p3") S.colour = true; api.save(); paintStage(); renderGraphs(); done(); } });
      }
    },
    challenge:function(id){ return id === "tc1" ? tc1(S) : id === "tc2" ? aTest(S) : tc3(S); }
  };
}

// ---------- hero: the investigation cycle draws step by step ----------
function hero(f){
  if (f.cap) f.cap.textContent = "Every report raises new questions.";
  if (!f.canvas) return;
  var p = new MV.Plot(f.canvas, { xmin:0, xmax:1, ymin:0, ymax:1 }), s = MV.reduceMotion ? 7 : 0;
  var N = [["Question", .14, .17], ["Plan", .5, .1], ["Data", .86, .17], ["Analysis", .86, .83], ["Conclusion", .5, .9], ["Report", .14, .83]];
  var SENT = "strong negative association (r = −0.99)", PTS = [[.1, .9], [.25, .75], [.35, .8], [.5, .55], [.6, .5], [.72, .3], [.85, .25], [.95, .1]];
  function box(ctx, x, y, t, on, fs){ ctx.font = "600 " + fs + "px " + (css("--font-ui") || "sans-serif"); var w = ctx.measureText(t).width + 16, h = fs + 12;
    ctx.fillStyle = on ? css("--hi-soft") : css("--sheet"); ctx.strokeStyle = on ? css("--pen") : css("--ink-2"); ctx.lineWidth = on ? 2.2 : 1.4;
    ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x - w / 2, y - h / 2, w, h, 8); else ctx.rect(x - w / 2, y - h / 2, w, h); ctx.fill(); ctx.stroke();
    ctx.fillStyle = css("--ink"); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(t, x, y + 0.5); return [w / 2, h / 2]; }
  function arrow(ctx, x0, y0, x1, y1, t, col){
    var x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t, a = Math.atan2(y1 - y0, x1 - x0);
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke();
    if (t > 0.95) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 9 * Math.cos(a - 0.45), y - 9 * Math.sin(a - 0.45)); ctx.lineTo(x - 9 * Math.cos(a + 0.45), y - 9 * Math.sin(a + 0.45)); ctx.closePath(); ctx.fill(); }
  }
  function edge(cx, cy, hw, hh, dx, dy){ var d = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / d, uy = dy / d, t = Math.min(Math.abs(ux) > 1e-6 ? (hw + 4) / Math.abs(ux) : 1e9, Math.abs(uy) > 1e-6 ? (hh + 4) / Math.abs(uy) : 1e9); return [cx + ux * t, cy + uy * t]; }
  function draw(ctx, W, H){
    var fs = W < 440 ? 11 : 13, fu = css("--font-ui") || "sans-serif", half = [], ink2 = css("--ink-2"), pen = css("--pen");
    ctx.font = "600 " + fs + "px " + fu;
    N.forEach(function(n){ half.push([ctx.measureText(n[0]).width / 2 + 8, (fs + 12) / 2]); });
    for (var i = 0; i < 6; i++) {
      var j = (i + 1) % 6, t = Math.max(0, Math.min(1, (s - i - 0.55) / 0.45)); if (t <= 0 || (i === 5 && s < 6)) continue;
      var A = N[i], B = N[j], ax = A[1] * W, ay = A[2] * H, bx = B[1] * W, by = B[2] * H, e0 = edge(ax, ay, half[i][0], half[i][1], bx - ax, by - ay), e1 = edge(bx, by, half[j][0], half[j][1], ax - bx, ay - by);
      arrow(ctx, e0[0], e0[1], e1[0], e1[1], i === 5 ? Math.min(1, (s - 6) / 0.6) : t, i === 5 ? css("--f3") : ink2);
      if (i === 5 && s >= 6.4) { ctx.fillStyle = css("--f3"); ctx.font = "italic 600 " + fs + "px " + fu; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText("new questions", ax + 10, (ay + by) / 2); }
    }
    N.forEach(function(n, k){ if (s < k) return; ctx.globalAlpha = Math.min(1, s - k + 0.3); box(ctx, n[1] * W, n[2] * H, n[0], s >= k && s < k + 1 && s < 6, fs); ctx.globalAlpha = 1; });
    var fold = Math.max(0, Math.min(1, s - 5)), cx0 = .3 * W, cy0 = .32 * H, cw = .16 * W, ch = .3 * H;
    if (s >= 2 && fold < 1) { // mini table (Data)
      ctx.globalAlpha = 1 - fold; var cells = Math.floor(Math.min(1, s - 2) * 10);
      ctx.strokeStyle = ink2; ctx.lineWidth = 1; for (var r = 0; r < 5; r++) for (var c = 0; c < 2; c++) { var x = cx0 + c * cw / 2, y = cy0 + r * ch / 5; ctx.strokeRect(x, y, cw / 2, ch / 5); if (r * 2 + c < cells) { ctx.fillStyle = css("--ev-a-soft"); ctx.fillRect(x + 1, y + 1, cw / 2 - 2, ch / 5 - 2); ctx.fillStyle = css("--ink-2"); ctx.fillRect(x + 6, y + ch / 10 - 1, cw / 2 - 16, 2); } }
      ctx.globalAlpha = 1;
    }
    if (s >= 3 && fold < 1) { // mini scatter (Analysis)
      ctx.globalAlpha = 1 - fold; var sx = .54 * W, sw = .16 * W;
      ctx.strokeStyle = ink2; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(sx, cy0); ctx.lineTo(sx, cy0 + ch); ctx.lineTo(sx + sw, cy0 + ch); ctx.stroke();
      var np = Math.floor(Math.min(1, s - 3) * PTS.length); for (var q = 0; q < np; q++) dot(ctx, sx + PTS[q][0] * sw, cy0 + PTS[q][1] * ch, 3.2, pen);
      ctx.globalAlpha = 1;
    }
    if (fold > 0) { // page icon (Report)
      var pw = .09 * W * fold + 6, ph = pw * 1.3, px = .5 * W - pw / 2, py = .47 * H - ph / 2;
      ctx.fillStyle = css("--sheet"); ctx.strokeStyle = pen; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + pw * .72, py); ctx.lineTo(px + pw, py + pw * .28); ctx.lineTo(px + pw, py + ph); ctx.lineTo(px, py + ph); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = ink2; ctx.lineWidth = 1.2; ctx.beginPath(); for (var l = 1; l <= 4; l++) { ctx.moveTo(px + pw * .16, py + ph * (.25 + l * .14)); ctx.lineTo(px + pw * .84, py + ph * (.25 + l * .14)); } ctx.stroke();
    }
    if (s >= 4) { var nc = Math.floor(Math.min(1, (s - 4) / 0.8) * SENT.length); ctx.fillStyle = css("--ink"); ctx.font = "600 " + fs + "px " + fu; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(SENT.slice(0, nc), .5 * W, .73 * H); }
  }
  p.render = function(){ p.draw({ grid:false, axes:false, ticks:false, describe:"The investigation cycle: Question, Plan, Data, Analysis, Conclusion, Report, then an arrow labelled new questions back to Question. The conclusion reads: strong negative association (r = −0.99). The report is a page icon.", after:function(ctx, pl){ draw(ctx, pl.W, pl.H); } }); };
  p.render();
  if (!MV.reduceMotion) MV.tween({ dur:8000, step:function(t){ s = 7 * t; p.render(); }, done:function(){ s = 7; p.render(); } });
}

// ---------- Part 3: Critique an investigation ----------
function part3(host, api){
  var S = api.S, P = api.content || {}, INV = P.investigations || [], CM = P.comment || {};
  if (!INV.length) return {};
  S.cur = S.cur === "B" ? "B" : "A"; S.rate = obj(S.rate); S.imp = obj(S.imp); S.cm = obj(S.cm);
  var msg = {}, barPlots = [];
  host.innerHTML = '<div id="cr-tabs"></div><div id="cr-body" class="cr-body"></div>' +
    '<div class="part cr-cmw"><h3>Constructive comment builder</h3><p>Build a comment on Investigation A or B with all three parts: a <strong>criterion</strong>, the <strong>evidence</strong>, and a <strong>suggestion</strong>.</p><div id="cr-cm"></div></div>';
  radios($("#cr-tabs", host), { label:"Investigation", options:INV.map(function(v){ return { id:v.id, t:"Investigation " + v.id }; }), value:S.cur, cls:"seg", key:"crtab", onChange:function(v){ S.cur = v; api.save(); paint(); } });
  function inv(){ return INV.filter(function(v){ return v.id === S.cur; })[0]; }
  function rates(v){ var r = S.rate[v.id]; if (!Array.isArray(r) || r.length !== 5) r = S.rate[v.id] = [0, 0, 0, 0, 0]; return r; }
  function paint(){
    var v = inv(), r = rates(v), body = $("#cr-body", host), h = '<div class="cr-card"><h3 class="cr-title">' + v.title + ' <span class="mdm-model">model</span></h3><dl class="cr-parts">' +
      v.parts.map(function(p){ return "<div><dt>" + p[0] + "</dt><dd>" + MV.md(p[1]) + (v.id === "A" && p[0] === "Analysis" ? '<div class="plot-wrap cr-bar"><canvas class="plot" data-bar="70" role="img" aria-label="Bar graph"></canvas></div>' : "") + "</dd></div>"; }).join("") + "</dl></div>";
    h += '<h4 class="ci-h">Rate it on the rubric</h4><div class="cr-rub">' + (P.rubric || []).map(function(c, i){ return '<div class="cr-row"><p class="cr-crit"><strong>' + (i + 1) + ".</strong> " + c + '</p><div data-rr="' + i + '"></div></div>'; }).join("") + "</div>" +
      '<div class="q-actions"><button type="button" class="btn primary sm" data-cr="rate" data-k="crrate">Check my ratings</button></div><div id="cr-rfb">' + (msg.rate && msg.rate.id === v.id ? msg.rate.html : "") + "</div>";
    var imp = S.imp[v.id];
    h += '<h4 class="ci-h">The single most important improvement</h4><div class="cr-imp" role="radiogroup" aria-label="Most important improvement">' + v.improve.map(function(o, k){
      return '<button type="button" role="radio" class="ci-pk" aria-checked="' + (imp === k) + '" data-imp="' + k + '" data-k="crimp' + v.id + k + '">' + o.t + "</button>"; }).join("") + "</div>" +
      (imp != null && v.improve[imp] ? MV.fbHTML(MV.ok(v.improve[imp]) ? "good" : "bad", (MV.ok(v.improve[imp]) ? "<strong>✓ Right.</strong> " : "<strong>✗ Not quite.</strong> ") + v.improve[imp].why + (MV.ok(v.improve[imp]) ? "" : " Try another.")) : "");
    if (v.id === "A") h += '<details class="alg cr-data"><summary>Check it with data</summary><p class="tiny">The same two means, redrawn with the axis starting at 0. The 7-point gap shrinks visually.</p><div class="plot-wrap cr-bar"><canvas class="plot" data-bar="0" role="img" aria-label="Bar graph"></canvas></div></details>';
    MV.keepFocus(body, function(){ body.innerHTML = h; });
    (P.rubric || []).forEach(function(_, i){
      radios(body.querySelector('[data-rr="' + i + '"]'), { label:"", aria:(P.rubricShort || [])[i] + " level", options:[1, 2, 3, 4].map(function(L){ return { id:L, t:"L" + L, aria:(P.levels || [])[L - 1] || "Level " + L }; }), value:r[i] || "", cls:"seg", key:"crr" + v.id + i,
        onChange:function(val){ r[i] = +val; api.save(); } });
    });
    barPlots = [];
    Array.prototype.forEach.call(body.querySelectorAll("canvas[data-bar]"), function(cv){ var pl = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }), base = +cv.dataset.bar; pl.render = function(){ drawBars(pl, base); }; pl.render(); barPlots.push(pl); });
  }
  function rateCheck(){
    var v = inv(), r = rates(v), T = MV.ans(v) || [], ok = 0;
    if (r.some(function(x){ return !x; })) { msg.rate = { id:v.id, html:MV.fbHTML("bad", "Rate all five criteria first.") }; return; }
    var lines = r.map(function(x, i){ var good = i < 3 ? Math.abs(x - T[i]) <= 1 : x === T[i]; if (good) ok++;
      return "<li>" + (good ? "✓ " : "✗ ") + "<strong>" + (P.rubricShort || [])[i] + ":</strong> " + (good ? "" : (i < 3 ? "more than one level away. " : "rate this one exactly. ")) + MV.md(v.reasons[i]) + "</li>"; });
    msg.rate = { id:v.id, html:MV.fbHTML(ok === 5 ? "good" : "bad", "<strong>" + (ok === 5 ? "✓ Your ratings match a careful reader’s." : "✗ " + ok + " of 5 ratings fit.") + '</strong></p><ul class="cr-list">' + lines.join("") + "</ul><p>" + (ok === 5 ? "Criteria 1–3 accept a level either side; criteria 4–5 need the exact level." : "Adjust the ✗ ratings and check again.")) };
  }
  var cmR = [];
  function paintCm(){
    var box = $("#cr-cm", host), c = S.cm, crit = CM.criteria || [], ev = CM.evidence || [], sg = CM.suggestions || [];
    var et = (ev.filter(function(x){ return x.id === c.e; })[0] || {}).t, st = (sg.filter(function(x){ return x.id === c.s; })[0] || {}).t;
    var built = (c.c != null && crit[c.c] ? crit[c.c] : "[criterion]") + ": " + (et ? MV.md(et) : "[evidence]") + ". Suggestion: " + (st ? MV.md(st) : "[suggestion]") + ".";
    MV.keepFocus(box, function(){ box.innerHTML = '<div id="cr-c" class="ci-chips"></div><div id="cr-e" class="ci-chips"></div><div id="cr-s" class="ci-chips"></div><p class="cr-built" aria-live="polite"><strong>Your comment:</strong> “' + built + "”</p>" +
      '<div class="q-actions"><button type="button" class="btn primary sm" data-cr="cm" data-k="crcm">Check my comment</button></div>' + (msg.cm || ""); });
    cmR = [radios($("#cr-c", box), { label:"Criterion", options:crit.map(function(t, i){ return { id:i, t:t }; }), value:c.c == null ? "" : c.c, cls:"chips", key:"crc", onChange:function(v){ c.c = +v; msg.cm = ""; api.save(); paintCm(); } }),
      radios($("#cr-e", box), { label:"Evidence", options:ev.map(function(x){ return { id:x.id, t:MV.md(x.t) }; }), value:c.e || "", cls:"chips", key:"cre", onChange:function(v){ c.e = v; msg.cm = ""; api.save(); paintCm(); } }),
      radios($("#cr-s", box), { label:"Suggestion", options:sg.map(function(x){ return { id:x.id, t:MV.md(x.t) }; }), value:c.s || "", cls:"chips", key:"crs", onChange:function(v){ c.s = v; msg.cm = ""; api.save(); paintCm(); } })];
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest(".rg")) return;
    if (b.dataset.cr === "rate") { rateCheck(); paint(); MV.focusFb($("#cr-rfb", host)); return; }
    if (b.dataset.imp != null) { S.imp[S.cur] = +b.dataset.imp; api.save(); paint(); MV.focusFb($("#cr-body", host)); return; }
    if (b.dataset.cr === "cm") {
      var c = S.cm;
      if (c.c == null || !c.e || !c.s) msg.cm = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> A constructive comment needs all three parts: a criterion, the evidence and a suggestion.");
      else if (c.e !== c.s) msg.cm = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> Make your suggestion fix the problem named in your evidence.");
      else msg.cm = MV.fbHTML("good", "<strong>✓ Constructive.</strong> Criterion, evidence, suggestion: the reader knows what to fix and how.");
      paintCm(); MV.focusFb($("#cr-cm", host));
    }
  });
  paint(); paintCm();
  return {};
}

// ---------- Practice: Stage 2 analysis (custom: check boxes, chips, number entry, text + chips) ----------
function parseN(raw){ var s = String(raw == null ? "" : raw).replace(/[\s  ]/g, ""); if (!s) return null; var r = MV.parseNum(s); return r && r.length === 1 && isFinite(r[0]) ? r[0] : null; }
function analysisAct(host, api, a){
  var st = api.S; st.items = obj(st.items);
  var msgs = {};
  function ist(id){ var x = st.items[id] = obj(st.items[id]); x.val = typeof x.val === "string" ? x.val : ""; x.sel = obj(x.sel); x.tries = x.tries || 0; x.hint = x.hint || 0; return x; }
  function pickHTML(it, x, lab){ return '<div class="ci-pick" role="radiogroup" aria-label="' + esc(MV.plain(lab || "Choose an answer")) + '">' + (lab ? '<span class="rg-lab">' + lab + "</span>" : "") + it.options.map(function(o, k){
    return '<button type="button" role="radio" class="ci-pk" aria-checked="' + (x.pick === k) + '" data-pk="' + k + '" data-k="' + it.id + "pk" + k + '"' + (x.solved ? " disabled" : "") + ">" + MV.md(o.t) + "</button>"; }).join("") + "</div>"; }
  function bodyHTML(it, x){
    var dis = x.solved ? " disabled" : "";
    if (it.kind === "multi") return '<fieldset class="ci-ms"><legend class="vh">Choose all that apply</legend>' + it.options.map(function(o, k){ return '<label class="ci-cb"><input type="checkbox" data-ms="' + k + '" data-k="' + it.id + "ms" + k + '"' + (x.sel[k] ? " checked" : "") + dis + "> " + MV.md(o.t) + "</label>"; }).join("") + "</fieldset>";
    if (it.kind === "chips") return pickHTML(it, x);
    var inp = '<div class="numrow"><label for="an-' + it.id + '">' + (it.label || "Your answer:") + '</label><input class="numin' + (it.kind === "textchips" ? " ci-txt" : "") + '" id="an-' + it.id + '" data-anin="' + it.id + '" type="text"' + (it.kind === "num" ? ' inputmode="decimal"' : "") + ' autocomplete="off" spellcheck="false" value="' + esc(x.val) + '"' + dis + "></div>";
    return it.kind === "num" ? inp : inp + pickHTML(it, x, it.pickLabel);
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = (a.how === "" ? "" : '<p class="how">' + (a.how || "Choose or type your answer, then press Check.") + "</p>") + a.items.map(function(it, i){
        var x = ist(it.id), h = '<div class="q" data-an="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + MV.md(it.prompt) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>" + bodyHTML(it, x);
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints.map(function(z){ return MV.md(z); }), x.hint);
        if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + MV.md(it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
        else if (msgs[it.id]) h += MV.fbHTML("bad", msgs[it.id]);
        return h + "</div>";
      }).join("");
    });
  }
  function judge(it, x){
    if (it.kind === "multi") {
      var sel = it.options.map(function(_, k){ return !!x.sel[k]; });
      if (!sel.some(Boolean)) return { bad:"Tick at least one item." };
      var wp = it.options.filter(function(o, k){ return sel[k] && !MV.ok(o); })[0], miss = it.options.some(function(o, k){ return MV.ok(o) && !sel[k]; });
      return !wp && !miss ? { ok:true } : { ok:false, fb:wp ? wp.why : it.general };
    }
    if (it.kind === "chips") { if (x.pick == null) return { bad:"Choose an answer." }; return MV.ok(it.options[x.pick]) ? { ok:true } : { ok:false, fb:it.options[x.pick].why }; }
    if (it.kind === "num") {
      var v = parseN(x.val), ans = MV.ans(it); if (v == null) return { bad:"Enter a number, such as 39." };
      if (Math.abs(v - ans) < 1e-9) return { ok:true };
      var w = (it.wrong || []).filter(function(q){ return Math.abs(v - q.match) < 0.006; })[0]; return { ok:false, fb:w ? w.fb : it.general };
    }
    var t = x.val.trim().toLowerCase(), key = String(MV.ans(it) || "").toLowerCase();
    if (!t) return { bad:"Enter the variable you’d colour by." };
    if (x.pick == null) return { bad:"Choose the expected pattern as well." };
    var tOk = t.length >= 4 && key.indexOf(t.slice(0, 4)) === 0, pOk = MV.ok(it.options[x.pick]), fb = [];
    if (tOk && pOk) return { ok:true };
    if (!tOk) fb.push(it.textWrong); if (!pOk) fb.push(it.options[x.pick].why);
    return { ok:false, fb:fb.join(" ") };
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.anin; if (!id) return; ist(id).val = e.target.value.slice(0, 40); api.save(); });
  host.addEventListener("change", function(e){ var t = e.target; if (t.dataset.ms == null) return; var it = t.closest("[data-an]"); ist(it.dataset.an).sel[t.dataset.ms] = t.checked; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.anin) { var b = host.querySelector('[data-k="' + e.target.dataset.anin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-an]"); if (!box) return;
    var it = a.items.filter(function(z){ return z.id === box.dataset.an; })[0], x = ist(it.id);
    if (b.dataset.pk != null) { x.pick = +b.dataset.pk; api.save(); paint(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.bad) msgs[it.id] = r.bad;
      else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + MV.md(r.fb || "") + " Try again."; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-an="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}
// Stage 1's unscored plan follow-up, added under the sorter
function followUp(){
  var act = (((MV.C.practice || {}).activities) || []).filter(function(a){ return a.id === "sort"; })[0], F = act && act.followUp;
  var sheet = document.querySelector('[data-act-id="sort"]'); if (!F || !sheet || sheet.querySelector(".ci-fu")) return;
  var d = document.createElement("div"); d.className = "part ci-fu"; sheet.appendChild(d);
  var st = MV.S.app.c39fu = obj(MV.S.app.c39fu);
  function fb(opts, k){ if (k == null || !opts[+k]) return ""; var o = opts[+k]; return MV.fbHTML(MV.ok(o) ? "good" : "bad", (MV.ok(o) ? "<strong>✓ Right.</strong> " : "<strong>✗ Not quite.</strong> ") + o.why); }
  function paint(){
    d.innerHTML = "<h4>" + F.prompt + '</h4><div id="fu-a" class="ci-chips"></div><div id="fu-afb">' + fb(F.options, st.a) + "</div><h4>" + F.prompt2 + '</h4><div id="fu-b" class="ci-chips"></div><div id="fu-bfb">' + fb(F.options2, st.b) + "</div>";
    radios($("#fu-a", d), { label:"", aria:"Sampling method", options:F.options.map(function(o, k){ return { id:k, t:o.t }; }), value:st.a == null ? "" : st.a, cls:"chips", key:"fua", onChange:function(v){ st.a = +v; MV.save(); $("#fu-afb", d).innerHTML = fb(F.options, st.a); } });
    radios($("#fu-b", d), { label:"", aria:"Primary data?", options:F.options2.map(function(o, k){ return { id:k, t:o.t }; }), value:st.b == null ? "" : st.b, cls:"chips", key:"fub", onChange:function(v){ st.b = +v; MV.save(); $("#fu-bfb", d).innerHTML = fb(F.options2, st.b); } });
  }
  paint();
}

// ---------- Performance task: Investigation report builder ----------
var task = (function(){
  var api = null, fiR = null;
  function T(){ var s = api ? api.S : {}; ["intro", "fiTxt", "limTxt"].forEach(function(k){ s[k] = typeof s[k] === "string" ? s[k] : ""; }); if (!Array.isArray(s.rate) || s.rate.length !== 5) s.rate = [0, 0, 0, 0, 0]; return s; }
  var RUB = ["Question", "Data", "Analysis", "Conclusion", "Limitations"];
  function lines(){
    var S = PL || norm({}), C = calc(S), t = T(), q = qText(S, C.ds), sl = sumList(S, C), gl = graphList(S);
    var one = S.tpl === "rel" && C.rel ? "r = " + fx(C.rel.r, 2) : S.tpl === "diff" && C.groups ? "medians " + C.groups.map(function(G){ return dN(G.q.med); }).join(" vs ") : S.tpl === "one" && C.one ? "median " + dN(C.one.q.med) : "your key number";
    return { q:q || "(not built yet)", data:dataLine(S, C.ds), sum:sl.length ? sl.join("; ") : "(none chosen)", graphs:gl.length ? gl.join(", ") : "(none chosen)", concl:draftTxt(S, C) || "(not built yet)",
      lim:(limList(S).join(", ") || "(none chosen)") + (t.limTxt.trim() ? ". " + t.limTxt.trim() : ""), fi:(tOf(FI, S.fi) || "(none chosen)") + (t.fiTxt.trim() ? ". " + t.fiTxt.trim() : ""),
      intro:t.intro.trim(), self:RUB.map(function(r, i){ return r + " L" + (t.rate[i] || "?"); }).join(", "),
      outline:["Question and why it matters", "Key graph and the one number that matters (" + one + ")", "Conclusion, strength of evidence, one limitation"] };
  }
  function paintPv(){
    var pv = $("#rb-pv"); if (!pv) return;
    var L = lines(), ex = taskExpl().trim(), t = T();
    pv.innerHTML = '<div class="ci-rep"><h4>Your report</h4><dl class="read ci-reptext">' + MV.readoutHTML([["Question", rich(L.q)], ["Data", rich(L.data)], ["Summaries", rich(L.sum)], ["Graph(s)", esc(L.graphs)], ["Conclusion", rich(L.concl)],
      ["Limitations", esc(L.lim)], ["Further investigation", esc(L.fi)], ["Introduction", L.intro ? esc(L.intro) : '<span class="muted">(write it on the left)</span>'], ["Explanation", ex ? esc(ex) : '<span class="muted">(write it below the checklist)</span>'], ["Self-rating", esc(L.self)]]) + "</dl>" +
      '<h4>Presentation outline (3 slides)</h4><ol class="ci-outline">' + L.outline.map(function(x){ return "<li>" + rich(x) + "</li>"; }).join("") + "</ol>" +
      '<p class="tiny muted">You give the presentation and answer questions in class.</p></div>';
    var wc = $("#rb-wc"); if (wc) wc.textContent = "Introduction: " + words(t.intro) + " words (25 needed) · Explanation: " + words(ex) + " words (50 needed)";
  }
  function upd(){ paintPv(); if (api) api.update(); plannerRefresh(); }
  return {
    render:function(inp, pvw, a){
      api = a; var t = T();
      inp.innerHTML = '<div class="ci-from"><p class="tiny">Your question, data source, analysis and conclusion come from the <strong>Investigation planner</strong>. <a href="#explore">Open the planner</a> to change them.</p></div>' +
        '<div class="jq"><label for="rb-intro">Introduction: why your question matters (at least 25 words)</label><textarea id="rb-intro" data-k="rbintro" maxlength="3000"></textarea></div>' +
        '<div id="rb-fi" class="ci-chips"></div>' +
        '<div class="jq"><label for="rb-fitxt">Further investigation: one sentence (optional)</label><textarea id="rb-fitxt" class="ci-short" maxlength="600"></textarea></div>' +
        '<div class="jq"><label for="rb-lim">Limitations in your own words (optional)</label><textarea id="rb-lim" class="ci-short" maxlength="1200"></textarea></div>' +
        '<h4 class="ci-h">Self-rating (the Part 3 rubric)</h4><div class="cr-rub">' + RUB.map(function(r, i){ return '<div class="cr-row"><p class="cr-crit">' + r + '</p><div data-sr="' + i + '"></div></div>'; }).join("") + "</div>" +
        '<p class="tiny muted" id="rb-wc" aria-live="polite"></p>';
      pvw.innerHTML = '<div id="rb-pv"></div>';
      $("#rb-intro").value = t.intro; $("#rb-fitxt").value = t.fiTxt; $("#rb-lim").value = t.limTxt;
      fiR = radios($("#rb-fi"), { label:"Further investigation", options:FI, value:PL ? PL.fi : "", cls:"chips", key:"rbfi", onChange:function(v){ if (PL) { PL.fi = v; MV.save(); } upd(); } });
      RUB.forEach(function(r, i){ radios(inp.querySelector('[data-sr="' + i + '"]'), { label:"", aria:r + " self-rating", options:[1, 2, 3, 4].map(function(L){ return { id:L, t:"L" + L, aria:"Level " + L }; }), value:t.rate[i] || "", cls:"seg", key:"rbsr" + i,
        onChange:function(v){ T().rate[i] = +v; api.save(); paintPv(); } }); });
      inp.addEventListener("input", function(e){
        var id = e.target.id, s = T();
        if (id === "rb-intro") s.intro = e.target.value; else if (id === "rb-fitxt") s.fiTxt = e.target.value; else if (id === "rb-lim") s.limTxt = e.target.value; else return;
        api.save(); upd();
      });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ upd(); });
      paintPv();
    },
    refresh:function(){ if (!api) return; if (fiR && PL) fiR.set(PL.fi); paintPv(); api.update(); },
    read:function(){ var S = PL || norm({}); return { checks:repChecks(S), q:qText(S) }; },
    valid:function(){ return true; },
    checks:function(d){ return d.checks; },
    key:function(d){ return d.q; },
    label:function(k){ return esc(k); },
    text:function(k){ return k; },
    summary:function(){
      var S = PL || norm({}), n = repChecks(S).filter(Boolean).length, L = lines();
      return ["Investigation report: " + n + "/7 checks met",
        "  Question: " + L.q, "  Data: " + L.data, "  Summaries: " + L.sum, "  Graph(s): " + L.graphs, "  Conclusion: " + L.concl, "  Limitations: " + L.lim, "  Further investigation: " + L.fi,
        "  Self-rating (Part 3 rubric): " + L.self,
        "  Presentation outline (3 slides)", "    1. " + L.outline[0], "    2. " + L.outline[1], "    3. " + L.outline[2],
        "  Introduction: " + (L.intro || "(not written yet)")];
    }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ analysis:analysisAct },
  task:task,
  onShow:function(){ followUp(); task.refresh(); }
});
})();
