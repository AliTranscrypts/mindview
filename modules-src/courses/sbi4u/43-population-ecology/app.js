// SBI4U 43 Population ecology: hero (a deer herd multiplies while the graph traces a J-curve, then bends under K = 500),
// S10 population model (Exponential · Logistic · Cycle, "Population vs time" and "Growth vs population" views, births and
// deaths bars), "Measure a population" (quadrat woodlot, mark–recapture pond, distribution maps, survivorship cards, r/K table),
// standard practice (sorter, number entry, Spot the Error), "Plan a reintroduction" task (logistic preview graph).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small helpers (SVG helpers from SBI4U 20 / 08) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "po-lab", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function seg(k, a, b){ return clamp((k - a) / (b - a), 0, 1); }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (String(list[i].id) === String(id)) return list[i]; return null; }
function minus(s){ return String(s).replace(/-/g, MV.MINUS); }
// whole number with a space between thousands from 10 000 up (Canadian style), true minus sign
function fmt(v){ var n = Math.round(v), a = String(Math.abs(n)); if (Math.abs(n) >= 10000) a = a.replace(/\B(?=(\d{3})+(?!\d))/g, " "); return (n < 0 ? MV.MINUS : "") + a; }
function sgn(v){ var n = Math.round(v); return (n > 0 ? "+" : n < 0 ? MV.MINUS : "") + fmt(Math.abs(n)); }
function dec(v, dp){ var s = (Math.round(v * Math.pow(10, dp)) / Math.pow(10, dp)).toFixed(dp); return minus(s); }
function trim(v, dp){ return minus(String(Math.round(v * Math.pow(10, dp)) / Math.pow(10, dp))); }
var I = function(s){ return MV.m(s); };
function niceStep(raw){ if (raw <= 0) return 1; var p = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), m = raw / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; }

// ---------- @component radioGroup (copied from SBI4U 20 / 14 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list), disable(b)}
function radios(host, o){
  var val = String(o.value), off = false;
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, dis = x.dis || off, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (dis ? -1 : tab) + '" data-rg="' + x.id + '" data-k="rg' + (o.key || "") + x.id + '"' + (x.aria ? ' aria-label="' + MV.esc(x.aria) + '"' : "") + (dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function firstFree(){ for (var i = 0; i < o.options.length; i++) if (!o.options[i].dis) return i; return 0; }
  function choose(id){ id = String(id); var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b || off) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); e.stopPropagation();
    var ids = o.options.filter(function(x){ return !x.dis; }).map(function(x){ return String(x.id); }); if (!ids.length) return;
    var i = ids.indexOf(String(b.dataset.rg)); choose(ids[(i + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; },
    setOptions:function(list){ o.options = list; paint(); }, disable:function(b){ if (b !== off) { off = b; paint(); } } };
}
// range slider with output (from SBI4U 20): slider(host, {id, label, min, max, step, value, unit(v), onChange(v)}) -> {set(v), range(min, max), disable(b)}
// Shift + arrow moves 5 steps (plan: keyboard).
function slider(host, o){
  host.innerHTML = '<label class="slider po-sl"><span class="slider-top"><span>' + o.label + '</span><output id="' + o.id + '-out" for="' + o.id + '"></output></span><input type="range" id="' + o.id + '" min="' + o.min + '" max="' + o.max + '" step="' + o.step + '" value="' + o.value + '"></label>';
  var inp = $("#" + o.id, host), out = $("#" + o.id + "-out", host);
  function show(v){ out.innerHTML = o.unit(v); inp.setAttribute("aria-valuetext", MV.plain(o.unit(v))); }
  inp.addEventListener("input", function(){ show(+inp.value); o.onChange(+inp.value); });
  inp.addEventListener("keydown", function(e){
    if (!e.shiftKey) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowUp") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowDown") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var v = clamp(+inp.value + d * 5 * o.step, +inp.min, +inp.max); v = Math.round(v / o.step) * o.step;
    if (v !== +inp.value) { inp.value = v; show(v); o.onChange(v); }
  });
  show(o.value);
  return { set:function(v){ inp.value = v; show(v); }, range:function(a, b){ inp.min = a; inp.max = b; }, disable:function(b){ inp.disabled = b; } };
}

// ---------- @component S10 populationModel (plan: Explore model; deterministic, one step per year) ----------
// S: {model:"exp"|"log"|"cyc", n0, r10 (r × 10, so tests stay exact), K, avg, swing, len}. series(S) -> exact N for years 0–20.
function series(S){
  var N = [], i, r = S.r10 / 10;
  if (S.model === "cyc") { for (i = 0; i <= 20; i++) N.push(S.avg + S.swing * Math.sin(2 * Math.PI * i / S.len)); return N; }
  var n = S.n0; N.push(n);
  for (i = 1; i <= 20; i++) { n = S.model === "exp" ? n * (1 + r) : n + r * n * (S.K - n) / S.K; N.push(n); }
  return N;
}
// logistic demography (plan): births = (r + 0.1)N − (r/2)N²/K; deaths = 0.1N + (r/2)N²/K; difference = the logistic gain
function demog(S, n){ var r = S.r10 / 10; return { b:(r + 0.1) * n - (r / 2) * n * n / S.K, d:0.1 * n + (r / 2) * n * n / S.K }; }
function cycAt(S, t){ return S.avg + S.swing * Math.sin(2 * Math.PI * t / S.len); }

// plot frame: area {L, R, T, B}, ranges -> mapping functions + axes SVG
var GW = 480, GH = 300, GA = { L:62, R:466, T:18, B:256 };
function frame(xr, yr, o){
  var A = GA, X = function(v){ return A.L + (A.R - A.L) * (v - xr[0]) / (xr[1] - xr[0]); }, Y = function(v){ return A.B - (A.B - A.T) * (v - yr[0]) / (yr[1] - yr[0]); };
  var h = "", div = o.ydiv || 1, ys = niceStep((yr[1] - yr[0]) / 5), v;
  for (v = Math.ceil(yr[0] / ys - 1e-9) * ys; v <= yr[1] + 1e-9; v += ys) {
    var yy = Y(v); h += sv("path", { d:"M" + A.L + " " + f1(yy) + " H" + A.R, "class":Math.abs(v) < 1e-9 ? "po-zero" : "po-grid" });
    h += txt(A.L - 6, yy + 4, fmtTick(v / div), "po-tick", "end");
  }
  var xs = o.xstep || niceStep((xr[1] - xr[0]) / 5);
  for (v = Math.ceil(xr[0] / xs - 1e-9) * xs; v <= xr[1] + 1e-9; v += xs) {
    var xx = X(v); h += sv("path", { d:"M" + f1(xx) + " " + A.B + " v5", "class":"po-axis" }) + txt(xx, A.B + 18, fmtTick(v / (o.xdiv || 1)), "po-tick", "middle");
  }
  h += sv("path", { d:"M" + A.L + " " + A.T + " V" + A.B + " H" + A.R, "class":"po-axis" });
  h += txt((A.L + A.R) / 2, GH - 6, o.xlab, "po-axl", "middle") + sv("text", { x:14, y:(A.T + A.B) / 2, "class":"po-axl", "text-anchor":"middle", transform:"rotate(-90 14 " + f1((A.T + A.B) / 2) + ")" }, o.ylab);
  return { X:X, Y:Y, svg:h };
}
function fmtTick(v){ var r = Math.round(v * 100) / 100; return Math.abs(r - Math.round(r)) < 1e-9 ? fmt(r) : minus(String(r)); }
function scaleDiv(max){ return max >= 2e6 ? [1e6, " (millions)"] : max >= 2e4 ? [1000, " (thousands)"] : [1, ""]; }
function poly(pts){ return pts.map(function(p, i){ return (i ? "L" : "M") + f1(p[0]) + " " + f1(p[1]); }).join(" "); }

var EXF = null;
function explore(host, api){
  var C = api.content, S = api.S;
  var D = { model:"exp", n0:50, r10:5, K:500, avg:500, swing:200, len:8, year:0, view:"time", ext:false };
  Object.keys(D).forEach(function(k){ if (S[k] === undefined) S[k] = D[k]; });
  S.year = clamp(Math.round(+S.year || 0), 0, 20);
  var Yf = S.year, anim = null, timer = null, playing = false, busy = false, pend = null, cap = "", more = false, readSig = "";
  host.innerHTML = '<div class="po-ex"><div class="pg po-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="po-view"></div><div class="po-gbox"><svg id="po-svg" viewBox="0 0 ' + GW + " " + GH + '" role="img" focusable="false"></svg></div>' +
      '<div class="po-bd" id="po-bd" aria-live="polite"></div><p class="po-cap" id="po-cap" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div id="po-model"></div>' +
      '<div class="po-panel" id="po-gp"><div id="po-n0"></div><div id="po-r"></div><div id="po-k"></div></div>' +
      '<div class="po-panel" id="po-cp"><div id="po-avg"></div><div id="po-sw"></div><div id="po-len"></div></div>' +
      '<div class="po-panel po-time"><div id="po-yr"></div><div class="po-player" role="group" aria-label="Year controls"><button type="button" class="btn ghost sm" data-pa="play" data-k="poplay">Play</button><button type="button" class="btn primary sm" data-pa="step" data-k="postep">Step 1 year</button></div></div></div>' +
    '<div class="pg-read"><dl class="read po-read" id="po-read" aria-live="polite"></dl><button type="button" class="btn ghost sm po-more" id="po-more" aria-expanded="false" data-k="pomore">More</button>' +
      '<p class="tiny muted po-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p><p class=\"tiny muted po-note\" id=\"po-dnote\">" + C.demoNote + "</p></div></div></div>";
  var svg = $("#po-svg", host), player = $(".po-player", host);
  var viewR = radios($("#po-view", host), { label:"View", key:"v", options:[{ id:"time", t:"Population vs time" }, { id:"growth", t:"Growth vs population" }], value:S.view, onChange:function(v){ setting({ view:v }); } });
  var modelR = radios($("#po-model", host), { label:"Model", key:"m", options:[{ id:"exp", t:"Exponential" }, { id:"log", t:"Logistic" }, { id:"cyc", t:"Cycle" }], value:S.model, onChange:function(v){ setting({ model:v }); } });
  var n0S = slider($("#po-n0", host), { id:"po-n0r", label:"Starting population " + I("N_0"), min:10, max:S.ext ? 700 : 200, step:10, value:S.n0, unit:function(v){ return String(v); }, onChange:function(v){ setting({ n0:v }); } });
  var rS = slider($("#po-r", host), { id:"po-rr", label:"Per-capita growth rate " + I("r"), min:0, max:10, step:1, value:S.r10, unit:function(v){ return dec(v / 10, 1) + " per year"; }, onChange:function(v){ setting({ r10:v }); } });
  var kS = slider($("#po-k", host), { id:"po-kr", label:"Carrying capacity " + I("K"), min:100, max:1000, step:50, value:S.K, unit:function(v){ return String(v); }, onChange:function(v){ setting({ K:v }); } });
  var avgS = slider($("#po-avg", host), { id:"po-avgr", label:"Average population", min:200, max:1000, step:100, value:S.avg, unit:function(v){ return String(v); }, onChange:function(v){ setting({ avg:v }); } });
  var swS = slider($("#po-sw", host), { id:"po-swr", label:"Swing", min:0, max:Math.min(500, S.avg), step:50, value:S.swing, unit:function(v){ return "± " + v; }, onChange:function(v){ setting({ swing:v }); } });
  var lenS = slider($("#po-len", host), { id:"po-lenr", label:"Cycle length", min:4, max:12, step:1, value:S.len, unit:function(v){ return v + " years"; }, onChange:function(v){ setting({ len:v }); } });
  var yrS = slider($("#po-yr", host), { id:"po-yrr", label:"Year", min:0, max:20, step:1, value:S.year, unit:function(v){ return String(v); }, onChange:function(v){ stopPlay(); S.year = v; Yf = v; cap = ""; api.save(); paintAll(); MV.changed(); } });
  player.addEventListener("click", function(e){ var b = e.target.closest("[data-pa]"); if (!b || b.disabled || busy) return; if (b.dataset.pa === "play") play(); else step(); });
  $("#po-more", host).addEventListener("click", function(){ more = !more; paintRead(); });

  // ---- years ----
  function stopPlay(){
    if (anim) { anim(); anim = null; } if (timer) { clearTimeout(timer); timer = null; }
    if (playing) { playing = false; S.year = clamp(Math.floor(Yf + 1e-6), 0, 20); Yf = S.year; api.save(); }
  }
  function tick(v){ Yf = v; var it = clamp(Math.floor(v + 1e-6), 0, 20); if (it !== S.year) { S.year = it; yrS.set(it); paintRead(); paintBD(); MV.changed(); } paintGraph(); }
  function play(){
    if (playing) { stopPlay(); paintAll(); MV.changed(); return; }
    if (S.year >= 20) { S.year = 0; Yf = 0; }
    var from = S.year; playing = true; cap = ""; paintPlayer(); paintCap();
    if (MV.reduceMotion) {   // plan: reduced motion jumps year by year, without in-between frames
      var hop = function(){ timer = null; if (!playing) return; tick(S.year + 1); if (S.year >= 20) { playing = false; api.save(); paintAll(); MV.changed(); } else timer = setTimeout(hop, 450); };
      timer = setTimeout(hop, 450); return;
    }
    anim = MV.tween({ dur:(20 - from) * 380, ease:lin, step:function(k){ tick(lerp(from, 20, k)); }, done:function(){ anim = null; playing = false; S.year = 20; Yf = 20; api.save(); paintAll(); MV.changed(); } });
  }
  function step(){
    stopPlay(); if (S.year >= 20) return;
    var from = S.year; S.year = from + 1; api.save(); cap = ""; paintPlayer();
    anim = MV.tween({ dur:320, ease:lin, step:function(k){ Yf = from + k; paintGraph(); }, done:function(){ anim = null; Yf = S.year; paintAll(); MV.changed(); } });
    yrS.set(S.year); paintRead(); paintBD(); paintCap(); MV.changed();
  }
  function setting(p){
    stopPlay();
    Object.keys(p).forEach(function(k){ S[k] = p[k]; });
    if (p.n0 != null && S.ext && p.n0 <= 200) { S.ext = false; n0S.range(10, 200); }
    if (p.model && S.ext) { S.ext = false; S.n0 = Math.min(S.n0, 200); n0S.range(10, 200); n0S.set(S.n0); }
    if (p.avg != null) { swS.range(0, Math.min(500, S.avg)); if (S.swing > S.avg) { S.swing = S.avg; swS.set(S.swing); } }
    if (p.model) cap = { exp:"Exponential: the same per-capita rate every year, with nothing to stop it.", log:"Logistic: growth slows as " + I("N") + " nears the carrying capacity " + I("K") + ".", cyc:"Cycle: the population rises and falls around an average, as many predator and prey populations do." }[p.model];
    else if (p.view) cap = p.view === "growth" ? "Growth vs population: each dot is one year’s gain " + I("ΔN") + " plotted against the population " + I("N") + " at the start of that year." : "";
    else cap = "";
    api.save(); paintAll(); MV.changed();
  }

  // ---- numbers for the current year ----
  function info(){
    var N = series(S), y = S.year, r = { N:N, n:N[y], y:y };
    if (y > 0) { r.gain = N[y] - N[y - 1]; r.pc = N[y - 1] ? r.gain / N[y - 1] : 0; if (S.model === "log") r.bd = demog(S, N[y - 1]); }
    var best = null; for (var i = 1; i <= y; i++) { var g = N[i] - N[i - 1]; if (best === null || g > best.g + 1e-9) best = { y:i, g:g }; }
    r.best = best;
    return r;
  }
  function paintRead(){
    var m = info(), rows = [["Year", String(m.y)], ["Population " + I("N"), fmt(m.n)], ["Added this year (" + I("ΔN") + ")", m.y ? sgn(m.gain) : "— (year 0)"]];
    if (S.model === "log") rows.push(["Fraction of " + I("K"), Math.round(100 * m.n / S.K) + "% of " + I("K")]);
    var extra = [["Per-capita rate (" + I("ΔN") + " ÷ previous " + I("N") + ")", m.y ? dec(m.pc, 2) + " per year" : "—"]];
    if (S.model === "log") extra.push(["Births / deaths this year", m.y ? fmt(m.bd.b) + " born / " + fmt(m.bd.d) + " died" : "—"]);
    extra.push(["Fastest year so far", !m.best ? "—" : m.best.g <= 0 ? "None: the population hasn’t grown" : "Year " + m.best.y + " (" + sgn(m.best.g) + ")"]);
    if (S.model === "exp") {
      var r = S.r10 / 10;
      extra.push(["Doubling time", r > 0 ? "≈ " + trim(Math.log(2) / Math.log(1 + r), 1) + " years (rule of 70: ≈ " + trim(70 / (r * 100), 1) + ")" : "Never: " + I("r") + " = 0"]);
    }
    var h = MV.readoutHTML(rows) + extra.map(function(x){ return '<div class="po-x' + (more ? " on" : "") + '"><dt>' + x[0] + "</dt><dd>" + x[1] + "</dd></div>"; }).join("");
    if (h !== readSig) { readSig = h; $("#po-read", host).innerHTML = h; }
    var mb = $("#po-more", host); mb.textContent = more ? "Less" : "More"; mb.setAttribute("aria-expanded", String(more));
  }
  function paintBD(){
    var el = $("#po-bd", host);
    if (S.model !== "log") { el.innerHTML = ""; el.hidden = true; return; }
    el.hidden = false;
    var m = info();
    if (!m.y) { el.innerHTML = '<p class="tiny muted">Births and deaths appear after year 1: step or play the years.</p>'; return; }
    var top = Math.max(m.bd.b, m.bd.d, 1);
    function row(lab, v, cls){ return '<div class="po-bdrow"><span class="po-bdl">' + lab + '</span><span class="po-bdt"><i class="' + cls + '" style="width:' + f1(100 * Math.max(0, v) / top) + '%"></i></span><b>' + fmt(v) + "</b></div>"; }
    el.innerHTML = '<p class="po-bdh">This year (year ' + m.y + ")</p>" + row("Born", m.bd.b, "po-bb") + row("Died", m.bd.d, "po-bx");
  }
  function paintPlayer(){
    $$("[data-pa]", player).forEach(function(b){
      if (b.dataset.pa === "play") { b.textContent = playing ? "Pause" : "Play"; b.disabled = busy; }
      else b.disabled = busy || S.year >= 20;
    });
  }
  function capFor(){
    var m = info();
    if (S.view === "growth" && S.model === "log") return "The hump: the gain is largest at " + I("N") + " = " + I("K") + "/2 = " + fmt(S.K / 2) + ", and zero at " + I("K") + ".";
    if (S.model === "exp") return S.r10 ? "Each year adds " + I("r") + " × " + I("N") + ": the same fraction of a bigger population, so the gains grow (a J-curve)." : "With " + I("r") + " = 0 the population stays the same.";
    if (S.model === "log") return m.n > S.K + 0.5 ? "Above " + I("K") + ", deaths outnumber births, so the population falls back toward " + I("K") + "." : m.n > 0.97 * S.K ? "Near " + I("K") + ", births and deaths balance, so growth stops (an S-curve)." : "Growth slows as " + I("N") + " nears " + I("K") + "; it is fastest near " + I("K") + "/2 = " + fmt(S.K / 2) + ".";
    return "A cycle of " + S.len + " years: up and down by " + S.swing + " around " + S.avg + ".";
  }
  function paintCap(){ $("#po-cap", host).innerHTML = cap || capFor(); }

  // ---- graph ----
  function graphSVG(){
    var N = series(S), yi = clamp(Math.floor(Yf + 1e-6), 0, 20), fr = Yf - yi, h = "", F;
    var nAt = function(t){ if (S.model === "cyc") return cycAt(S, t); var i = Math.floor(t); return i >= 20 ? N[20] : lerp(N[i], N[i + 1], t - i); };
    if (S.view === "growth") {
      // growth vs population: ΔN (the gain of the year that starts at N) against N
      var pts = []; for (var i = 0; i < yi; i++) pts.push([N[i], N[i + 1] - N[i]]);
      var r = S.r10 / 10, xmaxRaw, ymin = 0, ymaxRaw;
      if (S.model === "log") { xmaxRaw = Math.max(S.K, S.n0) * 1.06; ymaxRaw = Math.max(r * S.K / 4, 1); }
      else if (S.model === "exp") { xmaxRaw = Math.max(N[yi], S.n0) * 1.1; ymaxRaw = Math.max(r * xmaxRaw, 1); }
      else { xmaxRaw = (S.avg + S.swing) * 1.08; ymaxRaw = Math.max(1, S.swing * 2 * Math.PI / S.len); ymin = -ymaxRaw; }
      pts.forEach(function(p){ ymaxRaw = Math.max(ymaxRaw, p[1]); ymin = Math.min(ymin, p[1]); });
      if (ymin < 0) ymin = ymin * 1.15;
      var xd = scaleDiv(xmaxRaw), yd = scaleDiv(Math.max(ymaxRaw, -ymin));
      F = frame([0, xmaxRaw], [ymin, ymaxRaw * 1.18], { xlab:"population N" + xd[1], ylab:"added that year, ΔN" + yd[1], xdiv:xd[0], ydiv:yd[0] });
      h += F.svg;
      if (S.model !== "cyc") {
        var cv = []; for (var k = 0; k <= 80; k++) { var x = xmaxRaw * k / 80, g = S.model === "log" ? r * x * (S.K - x) / S.K : r * x; if (g >= ymin) cv.push([F.X(x), F.Y(g)]); }
        h += sv("path", { d:poly(cv), "class":"po-hump" });
      }
      if (S.model === "log" && r > 0) {
        var px = F.X(S.K / 2), py = F.Y(r * S.K / 4);
        h += sv("path", { d:"M" + f1(px) + " " + GA.B + " V" + f1(py), "class":"po-kl" }) + sv("circle", { cx:px, cy:py, r:5.5, "class":"po-peak" });
        h += txt(px + 8, py - 8, "peak " + sgn(r * S.K / 4) + " at K/2 = " + fmt(S.K / 2), "po-lab");
        h += sv("path", { d:"M" + f1(F.X(S.K)) + " " + GA.T + " V" + GA.B, "class":"po-kl" }) + txt(F.X(S.K) - 4, GA.T + 12, "K = " + fmt(S.K), "po-klab", "end");
      }
      if (pts.length > 1) h += sv("path", { d:poly(pts.map(function(p){ return [F.X(p[0]), F.Y(p[1])]; })), "class":"po-trail" });
      pts.forEach(function(p, j){ h += sv("circle", { cx:F.X(p[0]), cy:F.Y(p[1]), r:j === pts.length - 1 ? 6 : 3.6, "class":j === pts.length - 1 ? "po-dot" : "po-pt" }); });
      if (!pts.length) h += txt((GA.L + GA.R) / 2, GA.T + 30, "Step or play the years to plot each year’s gain.", "po-lab", "middle");
      return h;
    }
    // population vs time
    var top = 0; for (var j = 0; j <= yi; j++) top = Math.max(top, N[j]); top = Math.max(top, nAt(Yf));
    if (S.model === "log") top = Math.max(top, S.K, S.n0);
    if (S.model === "cyc") top = S.avg + S.swing;
    top = Math.max(top, 10) * 1.12;
    var dv = scaleDiv(top);
    F = frame([0, 20], [0, top], { xlab:"year", ylab:"population N" + dv[1], xstep:5, ydiv:dv[0] });
    for (j = 1; j <= 20; j++) h += sv("path", { d:"M" + f1(F.X(j)) + " " + GA.B + " v3", "class":"po-axis" });
    h += F.svg;
    // gains as bars (plan P1: the year's gain stacked under the curve)
    for (j = 1; j <= yi; j++) {
      var g2 = N[j] - N[j - 1]; if (g2 <= 0) continue;
      var bx = F.X(j), by = F.Y(g2);
      h += sv("rect", { x:bx - 5, y:by, width:10, height:GA.B - by, "class":"po-gbar" });
      if (yi <= 6) h += txt(bx, by - 4, sgn(g2), "po-gl", "middle");
    }
    if (S.model === "log") { var ky = F.Y(S.K); h += sv("path", { d:"M" + GA.L + " " + f1(ky) + " H" + GA.R, "class":"po-kl" }) + txt(GA.R - 4, ky - 6, "K = " + fmt(S.K), "po-klab", "end"); }
    if (S.model === "cyc") h += sv("path", { d:"M" + GA.L + " " + f1(F.Y(S.avg)) + " H" + GA.R, "class":"po-kl" }) + txt(GA.R - 4, F.Y(S.avg) - 6, "average " + S.avg, "po-klab", "end");
    var cp = [];
    if (S.model === "cyc") { for (var t = 0; t <= Yf + 1e-9; t += 0.1) cp.push([F.X(t), F.Y(cycAt(S, t))]); cp.push([F.X(Yf), F.Y(cycAt(S, Yf))]); }
    else { for (j = 0; j <= yi; j++) cp.push([F.X(j), F.Y(N[j])]); if (fr > 1e-6) cp.push([F.X(Yf), F.Y(nAt(Yf))]); }
    if (cp.length > 1) h += sv("path", { d:poly(cp), "class":"po-curve" });
    if (S.model !== "cyc") for (j = 0; j <= yi; j++) h += sv("circle", { cx:F.X(j), cy:F.Y(N[j]), r:2.6, "class":"po-pt" });
    h += sv("circle", { cx:F.X(Yf), cy:F.Y(nAt(Yf)), r:6, "class":"po-dot" });
    return h;
  }
  function describe(){
    var m = info(), name = { exp:"Exponential", log:"Logistic", cyc:"Cycle" }[S.model];
    var set = S.model === "cyc" ? "average " + S.avg + ", swing " + S.swing + ", cycle length " + S.len + " years" : "N₀ = " + S.n0 + ", r = " + dec(S.r10 / 10, 1) + (S.model === "log" ? ", K = " + S.K : "");
    var vals = m.N.slice(0, m.y + 1).map(function(v){ return fmt(v); }).join(", ");
    return name + " model, " + set + ". " + (S.view === "growth" ? "Growth vs population view. " : "Population vs time. ") + "Population by year, from year 0 to year " + m.y + ": " + MV.plain(vals) + "." + (S.model === "log" && S.view === "growth" ? " The gain peaks at N = " + S.K / 2 + "." : "");
  }
  function paintGraph(){ svg.innerHTML = graphSVG(); }
  function sync(){
    modelR.set(S.model); viewR.set(S.view); n0S.set(S.n0); rS.set(S.r10); kS.set(S.K); avgS.set(S.avg); swS.set(S.swing); lenS.set(S.len); yrS.set(S.year);
    $("#po-gp", host).hidden = S.model === "cyc"; $("#po-cp", host).hidden = S.model !== "cyc"; $("#po-k", host).hidden = S.model !== "log"; $("#po-dnote", host).hidden = S.model !== "log";
    [modelR, viewR].forEach(function(x){ x.disable(busy); }); [n0S, rS, kS, avgS, swS, lenS, yrS].forEach(function(x){ x.disable(busy); });
  }
  function paintAll(){ sync(); paintPlayer(); paintGraph(); paintRead(); paintBD(); paintCap(); svg.setAttribute("aria-label", describe()); }
  paintAll();

  // ---- target challenges (plan: exact tests on exact steps; r is kept as whole tenths) ----
  function chal(id){
    var c = byId(C.challenges, id), Nm = c.named || {};
    if (id === "tc1") {
      if (S.model !== "exp") return { ok:false, msg:Nm.mode };
      if (S.n0 * Math.pow(10 + S.r10, 3) === 640000) return { ok:true };
      if (S.n0 === 160 && S.r10 === 10) return { ok:false, msg:Nm.n160 };
      if (S.n0 === 80 && S.r10 === 5) return { ok:false, msg:Nm.r05 };
      return { ok:false, msg:c.general + " Year 3 now: " + fmt(series(S)[3]) + "." };
    }
    if (S.model !== "log") return { ok:false, msg:Nm.mode };
    if (id === "tc2") {
      var rk = S.r10 * S.K;   // = 10 rK
      if (rk === 2000) return { ok:true };
      if (rk === 1000) return { ok:false, msg:Nm.rk100 };
      if (rk === 500) return { ok:false, msg:Nm.rk50 };
      return { ok:false, msg:c.general + " Now: " + I("rK") + "/4 = " + trim(rk / 40, 2) + "." };
    }
    if (id === "tc3") {
      var g90 = S.r10 * S.n0 * (S.K - S.n0) === 900 * S.K;   // r·N₀(K − N₀)/K = 90, exactly
      if (g90 && 2 * S.n0 < S.K) return { ok:true };
      if (g90 && S.n0 === 200 && S.r10 === 9 && S.K === 400) return { ok:false, msg:Nm.half };
      if (g90) return { ok:false, msg:Nm.halfAny };
      if (S.r10 * S.n0 === 900) return { ok:false, msg:Nm.crowd };
      return { ok:false, msg:c.general + " First-year gain now: " + trim(S.r10 * S.n0 * (S.K - S.n0) / (10 * S.K), 2) + "." };
    }
    return { ok:false };
  }
  EXF = { show:function(v){ if (v) paintAll(); else if (playing) { stopPlay(); paintAll(); } } };
  function finishPred(p){
    busy = false; cap = p.reveal; api.save(); paintAll(); MV.changed();
    var d = pend; pend = null; if (d) MV.wait(250, d);
  }
  return {
    predict:{
      start:function(p){
        stopPlay(); busy = true;
        var s = p.start; S.model = s.model; S.n0 = s.n0; S.r10 = s.r10; if (s.K) S.K = s.K; S.year = s.year; Yf = s.year; S.view = s.view;
        S.ext = s.n0 > 200; n0S.range(10, S.ext ? 700 : 200);
        cap = ""; api.save(); paintAll(); MV.changed();
      },
      run:function(p, done){
        pend = done;
        var from = S.year;
        anim = MV.tween({ dur:(p.to - from) * (p.to > 10 ? 160 : 520), ease:lin, step:function(k){ tick(lerp(from, p.to, k)); }, done:function(){ anim = null; S.year = p.to; Yf = p.to; finishPred(p); } });
      }
    },
    challenge:chal
  };
}

// ---------- hero (plan storyboard): 10 deer dots multiply on a map while the graph traces a J-curve; a dashed K = 500 line
// fades in, the curve bends, passes K/2 at its steepest and levels off just under K; the equation gains (K − N)/K.
// Reduced motion: the final frame. ----------
function hero(f){
  var box = $("#po-hero"); if (!box) return;
  var cap = f && f.cap, last = -1, HW = 440, HH = 240, K = 500, R = 0.55, N0 = 10;
  var fac = document.querySelector(".po-fac");
  var CAPS = ["10 deer, with plenty of food and space.", "Each year the herd adds more than the last: a J-curve.", "But the habitat can support only so many: " + I("K") + " = 500.",
    "Growth is fastest at half of " + I("K") + ", 250 deer…", "…then slows and levels off just under " + I("K") + "."];
  var rng = MV.bio.rng("po-deer"), P = [];
  for (var i = 0; i < 500; i++) { var a = rng() * Math.PI * 2, d = Math.sqrt(rng()) * (0.18 + 0.82 * Math.min(1, i / 300)); P.push([96 + Math.cos(a) * d * 78, 124 + Math.sin(a) * d * 92]); }
  box.innerHTML = '<svg viewBox="0 0 ' + HW + " " + HH + '" class="po-hsvg" aria-hidden="true" focusable="false"></svg>';
  var svg = $("svg", box);
  function Nt(t){ return K / (1 + (K / N0 - 1) * Math.exp(-R * t)); }
  var gx0 = 214, gx1 = 426, gy0 = 26, gy1 = 206, X = function(t){ return gx0 + (gx1 - gx0) * t / 16; }, Y = function(n){ return gy1 - (gy1 - gy0) * n / 560; };
  function scene(T){
    var t = clamp((T - 0.8) / 9.6, 0, 1) * 16, n = Nt(t), kA = seg(T, 4.6, 5.6), h = "";
    h += sv("rect", { x:8, y:14, width:180, height:218, rx:16, "class":"po-hmap" }) + txt(18, 32, "deer range", "po-sm");
    var d = ""; for (var j = 0; j < Math.round(n); j++) d += "M" + f1(P[j][0]) + " " + f1(P[j][1]) + "h0";
    h += sv("path", { d:d, "class":"po-deer" }) + txt(98, 226, "N = " + Math.round(n), "po-hn", "middle");
    h += sv("path", { d:"M" + gx0 + " " + gy0 + " V" + gy1 + " H" + gx1, "class":"po-axis" }) + txt(gx1, gy1 + 16, "years", "po-sm", "end") + txt(gx0 + 6, gy0 + 2, "N", "po-hn");
    if (kA > 0) h += '<g opacity="' + f1(kA) + '">' + sv("path", { d:"M" + gx0 + " " + f1(Y(K)) + " H" + gx1, "class":"po-kl" }) + txt(gx1, Y(K) - 6, "K = 500", "po-klab", "end") + "</g>";
    var pts = []; for (var s = 0; s <= t + 1e-9; s += 0.2) pts.push([X(s), Y(Nt(s))]); pts.push([X(t), Y(n)]);
    h += sv("path", { d:poly(pts), "class":"po-curve" }) + sv("circle", { cx:X(t), cy:Y(n), r:5, "class":"po-dot" });
    var th = Math.log(K / N0 - 1) / R, hA = seg(T, 6.6, 7.4);
    if (t >= th && hA > 0) h += '<g opacity="' + f1(hA) + '">' + sv("path", { d:"M" + f1(X(th)) + " " + f1(Y(250)) + " H" + gx0, "class":"po-kl" }) + txt(X(th) + 8, Y(250) + 14, "steepest at K/2", "po-sm") + "</g>";
    if (fac) fac.classList.toggle("po-off", kA < 0.5);
    var ci = T < 1.6 ? 0 : kA < 0.5 ? 1 : T < 6.6 ? 2 : T < 8.6 ? 3 : 4;
    if (cap && ci !== last) { cap.innerHTML = CAPS[ci]; last = ci; }
    return h;
  }
  function draw(T){ svg.innerHTML = scene(T); }
  if (MV.reduceMotion) { draw(11); return; }
  draw(0);
  MV.tween({ dur:11000, ease:lin, step:function(k){ draw(k * 11); }, done:function(){ draw(11); } });
}

// ---------- Part 3: Measure a population ----------
// Station 1 woodlot: 50 × 40 cells of 1 m²; trilliums grow in clumps (fixed model field). The 10 "random" quadrats sit on
// cells whose counts are forced to the plan's 6, 3, 5, 4, 2 (then 4, 3, 5, 4, 4), so everyone sees the same counts.
var CL = [[7, 7, 11, 3.4], [21, 11, 10.5, 3.6], [37, 6, 11, 3.4], [44, 22, 11, 3.6], [31, 29, 10.5, 4], [11, 28, 11, 3.6], [23, 22, 8, 3], [5, 37, 8, 2.8], [41, 36, 9, 3.2], [16, 17, 7, 2.8], [47, 9, 7, 2.6], [26, 37, 7, 2.8]];
var RCOUNT = [6, 3, 5, 4, 2, 4, 3, 5, 4, 4], AREA = 2000;
function fieldModel(rand){
  var G = [], i, j;
  for (i = 0; i < 50; i++) { G.push([]); for (j = 0; j < 40; j++) { var s = 0.25; CL.forEach(function(c){ var dx = i - c[0], dy = j - c[1]; s += c[2] * Math.exp(-(dx * dx + dy * dy) / (2 * c[3] * c[3])); }); G[i].push(Math.min(10, Math.round(s))); } }
  rand.forEach(function(q, k){ G[q[0]][q[1]] = RCOUNT[k]; });
  return G;
}
function part3(host, api){
  var C = api.content, S = api.S, S1 = C.st1, S2 = C.st2, S3 = C.st3;
  var D = { qMode:"rand", qN:5, qShown:0, qSelf:[], cur:[25, 20], pStep:0, worn:false, cards:{}, maps:{}, place:{}, sel:null };
  Object.keys(D).forEach(function(k){ if (S[k] === undefined) S[k] = Array.isArray(D[k]) ? D[k].slice() : D[k] && typeof D[k] === "object" ? {} : D[k]; });
  var G = fieldModel(S1.random), qAnim = null, qMsg = "", orgMsg = null, pAnim = null;
  host.innerHTML = '<div class="po-p3">' +
    // station 1
    '<section class="po-sta" aria-labelledby="po-s1h"><h3 id="po-s1h">' + S1.title + "</h3><p>" + S1.text + '</p>' +
      '<div class="po-qctl"><div id="po-qmode"></div><div id="po-qn"></div></div>' +
      '<div class="po-wood" id="po-wood" tabindex="0" role="group" aria-label="Woodlot. In Place them yourself mode, use the arrow keys to move the quadrat (Shift moves 5 m) and Enter to place it."><svg id="po-wsvg" viewBox="0 0 520 440" role="img" focusable="false"></svg></div>' +
      '<div class="q-actions" id="po-qbtns"></div><p class="banner" id="po-qban" aria-live="polite"></p>' +
      '<details class="alg" open><summary>Check it with data</summary><div id="po-qdata" aria-live="polite"></div></details></section>' +
    // station 2
    '<section class="po-sta part" aria-labelledby="po-s2h"><h3 id="po-s2h">' + S2.title + "</h3><p>" + S2.text + '</p>' +
      '<div class="po-two"><div class="po-fig"><svg id="po-psvg" viewBox="0 0 520 300" role="img" focusable="false"></svg></div>' +
      '<div><div class="q-actions" id="po-pbtns"></div><p class="po-scap" id="po-pcap" aria-live="polite"></p><div id="po-wear"></div></div></div>' +
      '<details class="alg" open><summary>Check it with data</summary><div id="po-pdata" aria-live="polite"></div></details>' +
      '<h4>The assumptions</h4><p class="how">Tap each assumption to see what breaking it does.</p><div class="po-cards" id="po-cards"></div></section>' +
    // station 3
    '<section class="po-sta part" aria-labelledby="po-s3h"><h3 id="po-s3h">' + S3.title + '</h3><h4>Distribution patterns</h4><p class="how">Classify each map.</p><div class="po-maps" id="po-maps"></div>' +
      '<h4>Survivorship curves</h4><p class="how">Tap an organism card, then tap the curve it belongs on.</p><p class="po-lognote">' + S3.logNote + '</p>' +
      '<div class="po-fig po-svfig"><svg id="po-svsvg" viewBox="0 0 480 300" role="img" focusable="false"></svg></div>' +
      '<div class="po-orgs" id="po-orgs"></div><div id="po-orgfb" aria-live="polite"></div><div class="po-zones" id="po-zones"></div>' +
      '<h4>r-selected and K-selected strategies</h4><div class="po-tblw" id="po-tbl"></div></section></div>';

  // ---- station 1: quadrats ----
  var qModeR = radios($("#po-qmode", host), { label:"Placement", key:"qm", options:[{ id:"rand", t:"Random" }, { id:"self", t:"Place them yourself" }], value:S.qMode, onChange:function(v){ stopQ(); S.qMode = v; qMsg = ""; api.save(); paintQ(); } });
  var qNR = radios($("#po-qn", host), { label:"Quadrats", key:"qn", options:[{ id:5, t:"5 quadrats" }, { id:10, t:"10 quadrats" }], value:S.qN, onChange:function(v){ stopQ(); S.qN = +v; S.qShown = Math.min(S.qShown, S.qN); if (S.qShown && S.qShown < S.qN) S.qShown = 0; api.save(); paintQ(); } });
  var dots = (function(){ var r = MV.bio.rng("po-trillium"), d = ""; for (var i = 0; i < 50; i++) for (var j = 0; j < 40; j++) for (var k = 0; k < G[i][j]; k++) d += "M" + f1(10 + i * 10 + 1.4 + r() * 7.2) + " " + f1(10 + j * 10 + 1.4 + r() * 7.2) + "h0"; return d; })();
  var woodBase = sv("rect", { x:10, y:10, width:500, height:400, rx:4, "class":"po-wbg" }) +
    [1, 2, 3, 4].map(function(k){ return sv("path", { d:"M" + (10 + k * 100) + " 10 V410", "class":"po-wgrid" }); }).join("") + [1, 2, 3].map(function(k){ return sv("path", { d:"M10 " + (10 + k * 100) + " H510", "class":"po-wgrid" }); }).join("") +
    sv("path", { d:dots, "class":"po-tril" }) + sv("path", { d:"M10 424 H110 M10 420 V428 M110 420 V428", "class":"po-axis" }) + txt(60, 438, "10 m", "po-sm", "middle") + txt(510, 432, "50 m × 40 m = 2000 m²", "po-sm", "end");
  function placed(){ return S.qMode === "rand" ? S1.random.slice(0, S.qShown) : S.qSelf; }
  function quadSVG(q, n, k){ var x = 10 + q[0] * 10, y = 10 + q[1] * 10, lx = q[0] > 45 ? x - 4 : x + 14, an = q[0] > 45 ? "end" : "start"; return sv("rect", { x:x - 0.5, y:y - 0.5, width:11, height:11, "class":"po-quad" }) + sv("text", { x:lx, y:y + 9, "class":"po-qlab", "text-anchor":an === "end" ? "end" : null }, String(n)) + (k == null ? "" : ""); }
  function paintWood(){
    var h = woodBase, P = placed();
    P.forEach(function(q){ h += quadSVG(q, G[q[0]][q[1]]); });
    if (S.qMode === "self" && S.qSelf.length < 5) h += sv("rect", { x:10 + S.cur[0] * 10 - 1, y:10 + S.cur[1] * 10 - 1, width:12, height:12, "class":"po-cur" });
    var w = $("#po-wsvg", host); w.innerHTML = h;
    w.setAttribute("aria-label", "Woodlot map with trilliums growing in clumps. " + (P.length ? "Quadrats placed: " + P.length + ", counts " + P.map(function(q){ return G[q[0]][q[1]]; }).join(", ") + "." : "No quadrats placed yet.") + (S.qMode === "self" && S.qSelf.length < 5 ? " Quadrat cursor at " + S.cur[0] + " m across, " + S.cur[1] + " m down." : ""));
  }
  function stats(P){ var c = P.map(function(q){ return G[q[0]][q[1]]; }), tot = c.reduce(function(a, b){ return a + b; }, 0); return { c:c, tot:tot, mean:P.length ? tot / P.length : 0 }; }
  function paintQData(){
    var P = placed(), s = stats(P), el = $("#po-qdata", host), ban = $("#po-qban", host);
    ban.className = "banner"; ban.textContent = "";
    if (!P.length) { el.innerHTML = '<p class="tiny muted">' + (S.qMode === "rand" ? "Press the button to place the quadrats." : "Tap 5 spots in the woodlot (or use the arrow keys and Enter).") + "</p>"; return; }
    var run = [], t = 0; s.c.forEach(function(v, i){ t += v; run.push(fmt(AREA * t / (i + 1))); });
    var meanT = trim(s.mean, 2), h = '<dl class="read po-qread">' + MV.readoutHTML([
      ["Counts in the quadrats", s.c.join(", ")],
      ["Total", s.tot + " trilliums in " + P.length + " m²"],
      ["Mean density", meanT + " per m²"],
      ["Estimate for the woodlot", meanT + " × 2000 ≈ <strong>" + fmt(AREA * s.mean) + " trilliums</strong>"],
      ["Running estimate, quadrat by quadrat", run.join(" → ")]]) + "</dl>";
    if (S.qMode === "rand" && S.qN === 10 && S.qShown === 10) h += '<p class="po-note2">' + S1.steady + "</p>";
    el.innerHTML = h;
    if (S.qMode === "self" && P.length === 5) {
      ban.className = "banner " + (Math.abs(s.mean - 4) >= 1.5 ? "bad" : "good");
      ban.textContent = (s.mean >= 5.5 ? "Your quadrats landed mostly in dense clumps, so the estimate jumped to " + MV.plain(fmt(AREA * s.mean)) + ". " : s.mean <= 2.5 ? "Your quadrats landed mostly in bare patches, so the estimate fell to " + MV.plain(fmt(AREA * s.mean)) + ". " : "Your estimate is close to the random one this time, but chosen spots can easily steer it. ") + S1.bias;
    }
  }
  function paintQBtns(){
    var b = $("#po-qbtns", host), h;
    if (S.qMode === "rand") h = '<button type="button" class="btn primary sm" data-q="place" data-k="poqplace"' + (qAnim || S.qShown === S.qN ? " disabled" : "") + ">Place " + S.qN + " random quadrats</button>";
    else h = '<button type="button" class="btn primary sm" data-q="here" data-k="poqhere"' + (S.qSelf.length >= 5 ? " disabled" : "") + ">Place a quadrat here (" + S.qSelf.length + " of 5)</button>";
    h += '<button type="button" class="btn ghost sm" data-q="clear" data-k="poqclear"' + (qAnim || !placed().length ? " disabled" : "") + ">Clear</button>";
    if (qMsg) h += '<span class="tiny muted">' + qMsg + "</span>";
    MV.keepFocus(b, function(){ b.innerHTML = h; });
  }
  function paintQ(){ qModeR.set(S.qMode); qNR.set(S.qN); $("#po-qn", host).hidden = S.qMode !== "rand"; paintWood(); paintQData(); paintQBtns(); }
  function stopQ(){ if (qAnim) { clearTimeout(qAnim); qAnim = null; } }
  function placeRandom(){
    stopQ(); S.qShown = 0;
    if (MV.reduceMotion) { S.qShown = S.qN; api.save(); paintQ(); return; }
    var nx = function(){ S.qShown++; paintWood(); paintQData(); if (S.qShown < S.qN) qAnim = setTimeout(nx, 380); else { qAnim = null; api.save(); paintQBtns(); } };
    paintQBtns(); qAnim = setTimeout(nx, 120); paintQBtns();
  }
  function placeSelf(i, j){
    if (S.qSelf.length >= 5) { qMsg = "All 5 are placed. Clear to try again."; paintQBtns(); return; }
    if (S.qSelf.some(function(q){ return q[0] === i && q[1] === j; })) { qMsg = "There’s already a quadrat there."; paintQBtns(); return; }
    qMsg = ""; S.qSelf.push([i, j]); api.save(); paintQ();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-q]"); if (!b || b.disabled) return;
    if (b.dataset.q === "place") placeRandom();
    else if (b.dataset.q === "here") placeSelf(S.cur[0], S.cur[1]);
    else if (b.dataset.q === "clear") { stopQ(); qMsg = ""; if (S.qMode === "rand") S.qShown = 0; else S.qSelf = []; api.save(); paintQ(); }
  });
  var wood = $("#po-wood", host);
  $("#po-wsvg", host).addEventListener("click", function(e){
    if (S.qMode !== "self") return;
    var r = e.currentTarget.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 520, y = (e.clientY - r.top) / r.height * 440;
    var i = Math.floor((x - 10) / 10), j = Math.floor((y - 10) / 10); if (i < 0 || i > 49 || j < 0 || j > 39) return;
    S.cur = [i, j]; placeSelf(i, j);
  });
  wood.addEventListener("keydown", function(e){
    if (S.qMode !== "self") return;
    var s = e.shiftKey ? 5 : 1, d = { ArrowLeft:[-s, 0], ArrowRight:[s, 0], ArrowUp:[0, -s], ArrowDown:[0, s] }[e.key];
    if (d) { e.preventDefault(); S.cur = [clamp(S.cur[0] + d[0], 0, 49), clamp(S.cur[1] + d[1], 0, 39)]; paintWood(); return; }
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); placeSelf(S.cur[0], S.cur[1]); }
  });
  if (S.qShown && S.qShown < S.qN) S.qShown = S.qN;
  paintQ();

  // ---- station 2: mark–recapture pond (150 turtles in the model pond; the net catches 30, 8 of them marked) ----
  var TN = 150, rp = MV.bio.rng("po-pond"), T1 = [], T2 = [], NET = { x:330, y:96, w:150, h:124 };
  function inPond(x, y){ var dx = (x - 250) / 232, dy = (y - 150) / 128; return dx * dx + dy * dy < 0.86; }
  function inNet(x, y){ return x > NET.x + 6 && x < NET.x + NET.w - 6 && y > NET.y + 6 && y < NET.y + NET.h - 6; }
  function rpos(test){ for (var g = 0; g < 400; g++) { var x = rp.range(30, 470), y = rp.range(30, 270); if (test(x, y)) return [x, y]; } return [250, 150]; }
  for (var q = 0; q < TN; q++) T1.push(rpos(function(x, y){ return inPond(x, y); }));
  // after mixing: turtles 0–39 are marked; the net holds 8 marked (0–7) and 22 unmarked (40–61); everyone else is outside it
  for (q = 0; q < TN; q++) { var inside = q < 8 || (q >= 40 && q < 62); T2.push(rpos(function(x, y){ return inPond(x, y) && (inside ? inNet(x, y) : !(x > NET.x - 4 && x < NET.x + NET.w + 4 && y > NET.y - 4 && y < NET.y + NET.h + 4)); })); }
  var WORN = { 3:1, 6:1 };   // two of the 8 recaptured marks have worn off when "Some paint wears off" is on
  function pondSVG(k){
    var h = sv("ellipse", { cx:250, cy:150, rx:232, ry:128, "class":"po-pond" }), st = S.pStep;
    if (st >= 3) h += sv("rect", { x:NET.x, y:NET.y, width:NET.w, height:NET.h, rx:10, "class":"po-net" }) + txt(NET.x + NET.w / 2, NET.y - 8, "second capture: 30 caught", "po-sm", "middle");
    for (var i = 0; i < TN; i++) {
      var p = st >= 2 ? (st === 2 && k < 1 ? [lerp(T1[i][0], T2[i][0], k), lerp(T1[i][1], T2[i][1], k)] : T2[i]) : T1[i];
      var marked = st >= 1 && i < 40, faded = st >= 3 && S.worn && WORN[i], caught = st >= 3 && (i < 8 || (i >= 40 && i < 62));
      var cls = "po-tur" + (st >= 3 && !caught ? " dim" : "");
      h += sv("ellipse", { cx:p[0], cy:p[1], rx:7, ry:5, "class":cls });
      if (marked && !faded) h += sv("circle", { cx:p[0], cy:p[1], r:2.6, "class":"po-paint" });
    }
    if (st === 1) h += txt(250, 290, "40 turtles marked with paint and released", "po-sm", "middle");
    return h;
  }
  var PCAP = ["A pond of painted turtles. How many live here? You can’t count them all.", "First capture: 40 turtles get a dab of paint on the shell (" + I("M") + " = 40), then are released.", "The marked turtles mix back in with the rest.", "Second capture: 30 are caught (" + I("n") + " = 30). Count the painted ones: that’s " + I("m") + "."];
  function paintPond(k){
    var p = $("#po-psvg", host); p.innerHTML = pondSVG(k == null ? 1 : k);
    var m = S.worn ? S2.mWorn : S2.m;
    p.setAttribute("aria-label", ["A pond with painted turtles.", "40 of the turtles are marked with paint.", "The marked turtles have mixed back in with the rest.", "A net holds the second sample: 30 turtles, " + m + " with visible paint."][S.pStep]);
    $("#po-pcap", host).innerHTML = PCAP[S.pStep];
    var b = $("#po-pbtns", host);
    MV.keepFocus(b, function(){ b.innerHTML = '<button type="button" class="btn ghost sm" data-ps="-1" data-k="popb"' + (S.pStep === 0 || pAnim ? " disabled" : "") + '>Back</button><button type="button" class="btn primary sm" data-ps="1" data-k="popn"' + (S.pStep === 3 || pAnim ? " disabled" : "") + ">" + ["First capture", "Release and mix", "Second capture", "Done"][S.pStep] + "</button>"; });
    var w = $("#po-wear", host);
    MV.keepFocus(w, function(){ w.innerHTML = '<button type="button" class="po-sw" role="switch" aria-checked="' + S.worn + '" data-wear="1" data-k="powear"><span class="po-swt" aria-hidden="true"></span>Some paint wears off<span class="po-swv">' + (S.worn ? "On" : "Off") + "</span></button>"; });
    paintPData();
  }
  function paintPData(){
    var el = $("#po-pdata", host), m = S.worn ? S2.mWorn : S2.m, N = S2.M * S2.n / m;
    if (S.pStep < 3) { el.innerHTML = '<p class="tiny muted">Finish the second capture to calculate the estimate.</p>'; return; }
    var h = "<p>Fraction marked in the second sample: <strong>" + m + "/" + S2.n + "</strong>. It should match the fraction marked in the whole pond: " + S2.M + "/" + I("N") + ".</p>" +
      "<p>" + m + "/" + S2.n + " = " + S2.M + "/" + I("N") + ", so " + I("N") + " = " + S2.M + " × " + S2.n + " ÷ " + m + " = <strong>" + fmt(N) + "</strong></p>";
    h += S.worn ? MV.fbHTML("bad", "<strong>Too high.</strong> The model pond holds 150 turtles. With 2 marks worn off, " + I("m") + " drops to 6 and the estimate becomes 200. Lost marks make " + I("m") + " too small, so " + I("N") + " comes out too big.") : MV.fbHTML("good", "<strong>✓ Spot on.</strong> The model pond holds 150 turtles: with every assumption met, the estimate matches.");
    el.innerHTML = h;
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-ps],[data-wear]"); if (!b || b.disabled) return;
    if (b.dataset.wear) { S.worn = !S.worn; api.save(); paintPond(); return; }
    var d = +b.dataset.ps; S.pStep = clamp(S.pStep + d, 0, 3); api.save();
    if (d > 0 && S.pStep === 2) { pAnim = MV.tween({ dur:1400, step:function(k){ $("#po-psvg", host).innerHTML = pondSVG(k); }, done:function(){ pAnim = null; paintPond(); } }); paintPond(0); }
    else paintPond();
  });
  paintPond();
  function paintCards(){
    var el = $("#po-cards", host);
    MV.keepFocus(el, function(){ el.innerHTML = S2.cards.map(function(c){ var on = !!S.cards[c.id]; return '<div class="po-card' + (on ? " on" : "") + '"><button type="button" class="po-cardb" aria-expanded="' + on + '" data-card="' + c.id + '" data-k="pocard' + c.id + '">' + c.t + "</button>" + (on ? '<p class="po-broke"><strong>If it breaks:</strong> ' + c.broke + "</p>" : "") + "</div>"; }).join(""); });
  }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-card]"); if (!b) return; S.cards[b.dataset.card] = !S.cards[b.dataset.card]; api.save(); paintCards(); });
  paintCards();

  // ---- station 3a: distribution maps ----
  function mapDots(id){
    var r = MV.bio.rng("po-map-" + id), P = [], i;
    if (id === "uniform") for (i = 0; i < 6; i++) for (var j = 0; j < 4; j++) P.push([20 + i * 28 + r.range(-2, 2), 18 + j * 28 + r.range(-2, 2)]);
    else if (id === "random") for (i = 0; i < 24; i++) P.push([r.range(12, 168), r.range(10, 110)]);
    else [[40, 34], [128, 46], [74, 92], [150, 100]].forEach(function(c, k){ for (var m = 0; m < (k === 3 ? 4 : 7); m++) { var a = r() * 6.283, d = Math.sqrt(r()) * 14; P.push([c[0] + Math.cos(a) * d, c[1] + Math.sin(a) * d]); } });
    return P.map(function(p){ return sv("circle", { cx:p[0], cy:p[1], r:3.6, "class":"po-mdot" }); }).join("");
  }
  var MAPW = { clumped:"Look again: the dots gather in groups, with empty space between.", uniform:"Look again: the dots are evenly spaced, about the same distance apart.", random:"Look again: no groups and no even spacing; the dots fall anywhere." };
  var PAT = [{ id:"clumped", t:"Clumped" }, { id:"uniform", t:"Uniform" }, { id:"random", t:"Random" }];
  function paintMaps(){
    var el = $("#po-maps", host);
    MV.keepFocus(el, function(){
      el.innerHTML = S3.maps.map(function(m, k){
        var ch = S.maps[m.id], ok = ch === m.id;
        return '<div class="po-map"><svg viewBox="0 0 180 120" role="img" aria-label="Map ' + (k + 1) + ": " + MV.esc(MV.plain(m.t)) + '. Dots show where individuals are." focusable="false">' + sv("rect", { x:2, y:2, width:176, height:116, rx:8, "class":"po-mbg" }) + mapDots(m.id) + "</svg>" +
          '<p class="po-mt">Map ' + (k + 1) + ": " + m.t + '</p><div class="sq-c" role="group" aria-label="Pattern for map ' + (k + 1) + '">' + PAT.map(function(p){ return '<button type="button" class="chip' + (ch === p.id ? " on" : "") + '" aria-pressed="' + (ch === p.id) + '" data-map="' + m.id + '" data-pat="' + p.id + '" data-k="pomap' + m.id + p.id + '"' + (ok ? " disabled" : "") + ">" + p.t + "</button>"; }).join("") + "</div>" +
          (ch ? MV.fbHTML(ok ? "good" : "bad", ok ? "<strong>✓</strong> " + m.fb : "<strong>✗ Not quite.</strong> " + MAPW[m.id]) : "") + "</div>";
      }).join("");
    });
  }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-map]"); if (!b || b.disabled) return; S.maps[b.dataset.map] = b.dataset.pat; api.save(); paintMaps(); MV.focusFb(b.closest(".po-map")); });
  paintMaps();

  // ---- station 3b: survivorship curves (log scale), tap a card then a curve ----
  var SVT = { I:{ f:function(x){ return 3 - 3 * Math.pow(x / 100, 8); }, cls:"po-s1", lab:[60, "Type I"] }, II:{ f:function(x){ return 3 - 3 * x / 100; }, cls:"po-s2", lab:[52, "Type II"] },
    III:{ f:function(x){ return 3 - 2.4 * (1 - Math.exp(-x / 6)) - 0.6 * x / 100; }, cls:"po-s3", lab:[40, "Type III"] } };
  var SA = { L:62, R:462, T:16, B:254 };
  function svX(x){ return SA.L + (SA.R - SA.L) * x / 100; } function svY(l){ return SA.B - (SA.B - SA.T) * l / 3.2; }
  function survSVG(){
    var h = "";
    [0, 1, 2, 3].forEach(function(l){ h += sv("path", { d:"M" + SA.L + " " + f1(svY(l)) + " H" + SA.R, "class":"po-grid" }) + txt(SA.L - 6, svY(l) + 4, String(Math.pow(10, l)), "po-tick", "end"); });
    [0, 25, 50, 75, 100].forEach(function(x){ h += txt(svX(x), SA.B + 18, x + "%", "po-tick", "middle"); });
    h += sv("path", { d:"M" + SA.L + " " + SA.T + " V" + SA.B + " H" + SA.R, "class":"po-axis" });
    h += txt((SA.L + SA.R) / 2, 294, "age (% of maximum lifespan)", "po-axl", "middle") + sv("text", { x:14, y:135, "class":"po-axl", "text-anchor":"middle", transform:"rotate(-90 14 135)" }, "survivors (of 1000, log scale)");
    ["I", "II", "III"].forEach(function(k){
      var c = SVT[k], pts = []; for (var x = 0; x <= 100; x += 1) pts.push([svX(x), svY(c.f(x))]);
      var on = S.sel ? " sel" : "";
      h += sv("path", { d:poly(pts), "class":"po-sc " + c.cls + on }) + sv("path", { d:poly(pts), "class":"po-shit", "data-st":k });
      var lx = c.lab[0], ly = svY(c.f(lx));
      h += sv("text", { x:svX(lx) + (k === "III" ? 4 : 6), y:ly + (k === "I" ? -8 : k === "II" ? -8 : -6), "class":"po-sl2 " + c.cls + "t" }, c.lab[1]);
    });
    return h;
  }
  function paintSurv(){
    var s = $("#po-svsvg", host); s.innerHTML = survSVG();
    s.setAttribute("aria-label", "Survivorship graph, log scale from 1 to 1000 survivors against age. Type I stays near 1000 until late in life, then drops steeply. Type II falls in a straight line on the log scale: a constant risk. Type III drops steeply at the start, then levels off.");
    var o = $("#po-orgs", host), left = S3.orgs.filter(function(x){ return !S.place[x.id]; });
    MV.keepFocus(o, function(){
      o.innerHTML = (left.length ? '<div class="po-ocards" role="group" aria-label="Organism cards">' + left.map(function(x){ return '<button type="button" class="chip' + (S.sel === x.id ? " on" : "") + '" aria-pressed="' + (S.sel === x.id) + '" data-org="' + x.id + '" data-k="poorg' + x.id + '">' + x.t + "</button>"; }).join("") + "</div>" : '<p class="po-note2">✓ All five organisms are on their curves.</p>') +
        '<div class="po-tgts" role="group" aria-label="Curves">' + ["I", "II", "III"].map(function(k){ return '<button type="button" class="btn ghost sm po-tgt ' + SVT[k].cls + 'b" data-st="' + k + '" data-k="post' + k + '"' + (S.sel ? "" : " disabled") + ">Put on " + SVT[k].lab[1] + "</button>"; }).join("") + "</div>";
    });
    $("#po-orgfb", host).innerHTML = orgMsg ? MV.fbHTML(orgMsg[0], orgMsg[1]) : "";
    $("#po-zones", host).innerHTML = ["I", "II", "III"].map(function(k){ var on = S3.orgs.filter(function(x){ return S.place[x.id] === k; }); return '<div class="po-zone ' + SVT[k].cls + 'z"><b>' + SVT[k].lab[1] + "</b><span>" + (on.length ? on.map(function(x){ return x.t; }).join(", ") : "—") + "</span></div>"; }).join("");
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-org]"); if (b) { S.sel = S.sel === b.dataset.org ? null : b.dataset.org; orgMsg = null; paintSurv(); return; }
    var t = e.target.closest("[data-st]"); if (!t || t.disabled || !S.sel || !host.contains(t)) return;
    var o = byId(S3.orgs, S.sel), k = t.getAttribute("data-st");
    if (o.type === k) { S.place[o.id] = k; S.sel = null; orgMsg = ["good", "<strong>✓ " + o.t + ": type " + k + ".</strong> " + S3.typeWhy[k]]; }
    else orgMsg = ["bad", "<strong>✗ Not type " + k + ".</strong> " + S3.m8 + " Try another curve."];
    api.save(); paintSurv(); MV.focusFb($("#po-orgfb", host));
  });
  paintSurv();
  var tb = S3.table;
  $("#po-tbl", host).innerHTML = '<table class="po-tbl"><thead><tr>' + tb.head.map(function(c, i){ return i ? '<th scope="col">' + c + "</th>" : '<td></td>'; }).join("") + "</tr></thead><tbody>" + tb.rows.map(function(r){ return '<tr><th scope="row">' + r[0] + "</th><td>" + r[1] + "</td><td>" + r[2] + "</td></tr>"; }).join("") + "</tbody></table>";
}

// ---------- Performance task: Plan a reintroduction (logistic model, yearly steps; plan inputs) ----------
var RS = [2, 4, 6, 8, 10], KS = [200, 300, 400, 500, 600];
function runLog(n0, r10, K, y){ var n = n0; for (var i = 0; i < y; i++) n = n + (r10 / 10) * n * (K - n) / K; return n; }
var task = (function(){
  var api = null, T = null;
  function read(){ var s = api ? api.S : {}; return { n0:s.n0 == null ? 10 : +s.n0, r10:s.r10 == null ? 2 : +s.r10, K:s.K == null ? 500 : +s.K }; }
  function gain(d){ return (d.r10 / 10) * d.n0 * (d.K - d.n0) / d.K; }
  function parse(k){ var p = String(k).split("-"); return { n0:+p[0], r10:+p[1], K:+p[2] }; }
  function text(d){ return d.n0 + " foxes, r = " + dec(d.r10 / 10, 1) + ", K = " + d.K; }
  function paintPv(){
    var el = $("#po-tpv"); if (!el) return;
    var d = read(), g = gain(d), n5 = runLog(d.n0, d.r10, d.K, 5), A = { L:52, R:300, T:14, B:196 };
    var X = function(t){ return A.L + (A.R - A.L) * t / 10; }, Y = function(n){ return A.B - (A.B - A.T) * n / 650; }, h = "";
    [0, 200, 400, 600].forEach(function(v){ h += sv("path", { d:"M" + A.L + " " + f1(Y(v)) + " H" + A.R, "class":"po-grid" }) + txt(A.L - 6, Y(v) + 4, String(v), "po-tick", "end"); });
    [0, 5, 10].forEach(function(t){ h += txt(X(t), A.B + 16, String(t), "po-tick", "middle"); });
    h += sv("path", { d:"M" + A.L + " " + A.T + " V" + A.B + " H" + A.R, "class":"po-axis" }) + txt((A.L + A.R) / 2, 232, "year", "po-axl", "middle");
    h += sv("path", { d:"M" + A.L + " " + f1(Y(d.K)) + " H" + A.R, "class":"po-kl" }) + txt(A.R, Y(d.K) - 5, "K = " + d.K, "po-klab", "end");
    h += sv("path", { d:"M" + A.L + " " + f1(Y(200)) + " H" + A.R, "class":"po-tgtl" });
    var pts = []; for (var t = 0; t <= 10; t++) pts.push([X(t), Y(runLog(d.n0, d.r10, d.K, t))]);
    h += sv("path", { d:poly(pts), "class":"po-curve" }) + pts.map(function(p){ return sv("circle", { cx:p[0], cy:p[1], r:2.6, "class":"po-pt" }); }).join("");
    var y1 = runLog(d.n0, d.r10, d.K, 1);
    h += sv("path", { d:"M" + f1(X(1) + 7) + " " + f1(Y(d.n0)) + " V" + f1(Y(y1)), "class":"po-gain" }) + txt(X(1) + 11, (Y(d.n0) + Y(y1)) / 2 + 4, "+" + trim(g, 2), "po-glab");
    h += sv("circle", { cx:X(5), cy:Y(n5), r:5.5, "class":"po-dot" }) + txt(X(5) + 8, Y(n5) + 16, "year 5: " + fmt(n5), "po-glab");
    var s = $("#po-tsvg"); s.innerHTML = h;
    s.setAttribute("aria-label", "Logistic graph for years 0 to 10: " + text(d) + ". Year-1 gain " + trim(g, 2) + "; population at year 5 about " + Math.round(n5) + ". The dashed line marks K; a dotted line marks the 200-fox target.");
    el.innerHTML = MV.readoutHTML([["Year-1 gain", "+" + trim(g, 2) + " foxes"], ["Population at year 5", fmt(n5) + " foxes"], ["Carrying capacity " + I("K"), String(d.K)]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content; var s = a.S;
      if (s.n0 == null) s.n0 = 10; if (s.r10 == null) s.r10 = 2; if (s.K == null) s.K = 500;
      inp.innerHTML = '<div class="po-tin"><div id="po-tg-n"></div><div id="po-tg-r"></div><div id="po-tg-k"></div></div>';
      function upd(){ a.save(); paintPv(); a.update(); }
      radios($("#po-tg-n"), { label:T.inputs.n0, key:"tn", options:[10, 20, 30, 40, 50, 60].map(function(n){ return { id:n, t:String(n) }; }), value:s.n0, onChange:function(v){ s.n0 = +v; upd(); } });
      radios($("#po-tg-r"), { label:T.inputs.r, key:"tr", cls:"chips", options:RS.map(function(r, i){ return { id:r, t:T.plans[i] + " (" + I("r") + " = " + dec(r / 10, 1) + ")" }; }), value:s.r10, onChange:function(v){ s.r10 = +v; upd(); } });
      radios($("#po-tg-k"), { label:T.inputs.K, key:"tk", cls:"chips", options:KS.map(function(k, i){ return { id:k, t:T.sites[i] + " (" + I("K") + " = " + k + ")" }; }), value:s.K, onChange:function(v){ s.K = +v; upd(); } });
      pv.innerHTML = '<div class="po-tpvw"><h4>Your plan</h4><div class="po-fig"><svg id="po-tsvg" viewBox="0 0 320 240" role="img" focusable="false"></svg></div><dl class="read" id="po-tpv" aria-live="polite"></dl><p class="tiny muted"><span class="bio-model">Model</span> ' + T.modelNote + "</p></div>";
      paintPv();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return [d.n0 <= 30, gain(d) >= 15 - 1e-9, runLog(d.n0, d.r10, d.K, 5) >= 200 - 1e-9, d.K <= 400]; },
    key:function(d){ return d.n0 + "-" + d.r10 + "-" + d.K; },
    label:function(k){ var d = parse(k); return "(" + d.n0 + ", " + dec(d.r10 / 10, 1) + ", " + d.K + ")"; },
    text:function(k){ return text(parse(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task,
  onShow:function(v){ if (EXF) EXF.show(v === "explore"); }
});
})();
