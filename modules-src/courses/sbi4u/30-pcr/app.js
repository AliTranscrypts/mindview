// SBI4U 30 PCR: hero (one cycle, then the doubling counter), Thermocycler (S9 procedure lab with an S2-style molecule view,
// a copy-count table and chart, and a troubleshoot preset), Design the primers (S5 sequence workbench with a zoom panel,
// S7 fair test, S12 claim–evidence–reasoning), Design the run (task).
// Colour roles (plan build notes): template strands top --ink, bottom --ink-2; new strands --pen; primers magenta --bio-h;
// target region --hi-soft; the temperature strip is neutral with the current step outlined.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small helpers (from SBI4U 21 / 15) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "pcr-lab", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function fmt(v){ return MV.num(v, 0); }
var SUPD = { "0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹" };
function pow10(k){ return "10" + String(k).split("").map(function(d){ return SUPD[d]; }).join(""); }
function sqH(s){ return '<span class="pcr-sq">' + s + "</span>"; }
function words(s){ return String(s || "").trim().split(/\s+/).filter(function(w){ return /[a-z0-9]/i.test(w); }).length; }

// base pairing (from SBI4U 21's S5 dnaDraw helpers)
var PAIR = { A:"T", T:"A", G:"C", C:"G" };
function comp(b){ return PAIR[b] || ""; }
function compS(s){ return s.split("").map(comp).join(""); }
function revS(s){ return s.split("").reverse().join(""); }
function revComp(s){ return revS(compS(s)); }
function hb(a, b){ return PAIR[a] === b ? (a === "G" || a === "C" ? 3 : 2) : 0; }

// ---------- @component radioGroup (copied from SBI4U 21 / 15 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list), disable(b)}
function radios(host, o){
  var val = String(o.value), off = false;
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, dis = x.dis || off, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (dis ? -1 : tab) + '" data-rg="' + x.id + '" data-k="rg' + (o.key || "") + x.id + '"' + (dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
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

// ---------- PCR model (plan "Model rules"; deterministic, all model values) ----------
var VIS = 1e6, MAXC = 40, STEPN = ["Denaturation", "Annealing", "Extension"];
// s: { den, ann, pol:"taq"|"human", pri:"both"|"fwd"|"rev"|"none", n0, real }
function model(s){
  var r = { growth:"double", why:"" };
  if (s.den < 90) { r.growth = "none"; r.why = "Strands stay paired: nothing can be copied."; }
  else if (s.pol === "human") { r.growth = "none"; r.why = "Human DNA polymerase is destroyed by the first heating step, so there are no new copies at all."; }
  else if (s.ann >= 61) { r.growth = "none"; r.why = "At this annealing temperature the primers can’t stay attached, so there is no product."; }
  else if (s.pri === "none") { r.growth = "none"; r.why = "With no primers, the polymerase has no 3′ end to start from, so nothing is copied."; }
  else if (s.pri !== "both") { r.growth = "linear"; r.why = "With one primer, only one original strand can be copied, once per cycle: linear growth."; }
  else r.why = s.ann <= 49 ? "The primers pair at their sites and also at partly matching sites, so extra products are made." : "Both primers pair only at their sites, and the copies double each cycle.";
  r.loose = r.growth !== "none" && s.ann <= 49;
  return r;
}
// copies after c completed cycles: total = N₀ × 2ⁿ; exact = N₀ × (2ⁿ − 2n) for n ≥ 1; longer = N₀ × 2n
function counts(s, c){
  var m = model(s), n0 = s.n0, ce = s.real ? Math.min(c, 30) : c, pl = !!s.real && c > 30 && m.growth !== "none";
  if (m.growth === "double") { var p = Math.pow(2, ce); return { total:n0 * p, exact:ce >= 1 ? n0 * (p - 2 * ce) : 0, longer:n0 * 2 * ce, newS:0, m:m, plateau:pl }; }
  if (m.growth === "linear") return { total:n0, exact:0, longer:n0 * ce, newS:n0 * ce, m:m, plateau:pl };
  return { total:n0, exact:0, longer:0, newS:0, m:m, plateau:false };
}
function visible(C){ return C.m.growth === "double" && C.exact >= VIS; }

// ---------- @component moleculeTray — every molecule after c cycles from one starting molecule (c ≤ 5), drawn as two
// strands over a shaded target: originals --ink / --ink-2, copies --pen. Strand kinds: T, B originals; R1, F1 first copies
// (run past the target at one end); Fe, Re exact length. ----------
var NEWOF = { T:"R1", B:"F1", R1:"Fe", F1:"Re", Fe:"Re", Re:"Fe" };
var EXT = { T:[0, 1], B:[0, 1], R1:[0, 0.75], F1:[0.25, 1], Fe:[0.25, 0.75], Re:[0.25, 0.75] };
var SENSE = { T:1, F1:1, Fe:1, B:0, R1:0, Re:0 };
function population(c){
  var mols = [["T", "B"]];
  for (var i = 0; i < c; i++) { var nx = []; mols.forEach(function(m){ m.forEach(function(st){ nx.push([st, NEWOF[st]]); }); }); mols = nx; }
  return mols;
}
function isExact(m){ return (m[0] === "Fe" || m[0] === "Re") && (m[1] === "Fe" || m[1] === "Re"); }
function miniMol(m, x, y, w){
  var up = SENSE[m[0]] ? m[0] : m[1], dn = up === m[0] ? m[1] : m[0], h = sv("rect", { x:x + w * 0.25, y:y - 3, width:w * 0.5, height:12, "class":"pcr-tg" });
  [[up, y], [dn, y + 6]].forEach(function(p){
    var e = EXT[p[0]], cls = p[0] === "T" ? "pcr-st top" : p[0] === "B" ? "pcr-st bot" : "pcr-st new";
    h += sv("line", { x1:x + e[0] * w, y1:p[1], x2:x + e[1] * w, y2:p[1], "class":cls + " thin" });
  });
  return h;
}
function traySVG(c){
  var mols = population(c), ex = mols.filter(isExact), lo = mols.filter(function(m){ return !isExact(m); }), h = "", y = 16, W = 88, COLS = 4;
  [["Exact length: " + ex.length, ex], ["Longer (a strand runs past the target): " + lo.length, lo]].forEach(function(g){
    h += txt(8, y, g[0], "pcr-lab pcr-b"); y += 14;
    g[1].forEach(function(m, i){ h += miniMol(m, 14 + (i % COLS) * (W + 18), y + Math.floor(i / COLS) * 18, W); });
    y += Math.max(1, Math.ceil(g[1].length / COLS)) * 18 + 10;
  });
  return { svg:h, h:y };
}

// ---------- hero: one cycle (95 → 55 → 72 °C), two molecules, then the doubling counter (storyboard);
// reduced motion: the final frame with the counter ----------
function strip(h, on, y){
  ["95 °C", "55 °C", "72 °C"].forEach(function(s, i){ var x = 22 + i * 122; h.push(sv("rect", { x:x, y:y, width:112, height:24, rx:6, "class":"pcr-ts" + (on === i ? " on" : "") }) + txt(x + 56, y + 17, s, "pcr-tst" + (on === i ? " on" : ""), "middle")); });
}
function primerSVG(x0, x1, y, dir, op, cls){
  var a = dir === "r" ? x1 : x0, s = dir === "r" ? 1 : -1;
  return sv("g", { opacity:op < 1 ? f1(op * 100) / 100 : null }, sv("line", { x1:x0, y1:y, x2:x1, y2:y, "class":"pcr-pri" + (cls ? " " + cls : "") }) +
    sv("path", { d:"M" + f1(a) + " " + f1(y - 5) + " L" + f1(a + s * 7) + " " + f1(y) + " L" + f1(a) + " " + f1(y + 5) + " Z", "class":"pcr-prh" + (cls ? " " + cls : "") }));
}
function heroSVG(t){
  var h = [], XL = 40, XR = 360, T0 = 110, T1 = 290, PL = 42, e = MV.ease;
  var on = t >= 1 && t < 4 ? Math.floor(t) - 1 : t >= 5 && t < 6 ? Math.floor((t - 5) * 40) % 3 : -1;
  strip(h, on, 6);
  if (t < 5) {
    var sep = e(clamp(t - 1, 0, 1)), pr = e(clamp(t - 2, 0, 1)), ex = e(clamp(t - 3, 0, 1)), sp = e(clamp(t - 4, 0, 1)) * 8;
    var yT = lerp(100, 76, sep) - sp, yB = lerp(118, 142, sep) + sp, yR = 86 - sp, yF = 132 + sp;
    h.push(sv("rect", { x:T0, y:44, width:T1 - T0, height:122, "class":"pcr-tg" }) + txt((T0 + T1) / 2, 160, "target", "pcr-sm", "middle"));
    for (var x = XL + 6; x < XR; x += 10) {
      if (sep < 0.98) h.push(sv("line", { x1:x, y1:yT + 2, x2:x, y2:yB - 2, "class":"pcr-hb", opacity:f1((1 - sep) * 100) / 100 }));
      if (t >= 4) {
        if (x <= T1) h.push(sv("line", { x1:x, y1:yT + 2, x2:x, y2:yR - 2, "class":"pcr-hb" }));
        if (x >= T0) h.push(sv("line", { x1:x, y1:yF + 2, x2:x, y2:yB - 2, "class":"pcr-hb" }));
      }
    }
    if (ex > 0) {
      h.push(sv("line", { x1:T1 - PL, y1:yR, x2:lerp(T1 - PL, XL, ex), y2:yR, "class":"pcr-st new" }));
      h.push(sv("line", { x1:T0 + PL, y1:yF, x2:lerp(T0 + PL, XR, ex), y2:yF, "class":"pcr-st new" }));
    }
    if (pr > 0) {
      h.push(primerSVG(T0, T0 + PL, lerp(109, yF, pr), "r", pr));
      h.push(primerSVG(T1 - PL, T1, lerp(109, yR, pr), "l", pr));
    }
    h.push(sv("line", { x1:XL, y1:yT, x2:XR, y2:yT, "class":"pcr-st top" }) + sv("line", { x1:XL, y1:yB, x2:XR, y2:yB, "class":"pcr-st bot" }));
    h.push(txt(XL - 6, yT + 4, "5′", "pcr-sm", "end") + txt(XR + 6, yT + 4, "3′", "pcr-sm") + txt(XL - 6, yB + 4, "3′", "pcr-sm", "end") + txt(XR + 6, yB + 4, "5′", "pcr-sm"));
    h.push(txt(200, 204, t >= 4 ? "Copies: 2" : "Copies: 1", "pcr-ctr", "middle"));
  } else {
    var u = clamp(t - 5, 0, 1), fin = t >= 6, cyc = fin ? 30 : 2 + Math.floor(Math.pow(u, 1.7) * 28), nIc = Math.min(64, Math.pow(2, Math.min(6, cyc)));
    for (var i = 0; i < nIc; i++) { var gx = 44 + (i % 8) * 40, gy = 52 + Math.floor(i / 8) * 17; h.push(sv("rect", { x:gx + 7, y:gy - 3, width:16, height:11, "class":"pcr-tg" }) + sv("line", { x1:gx + 7, y1:gy, x2:gx + 23, y2:gy, "class":"pcr-st new thin" }) + sv("line", { x1:gx + 7, y1:gy + 5, x2:gx + 23, y2:gy + 5, "class":"pcr-st new thin" })); }
    h.push(txt(200, 204, fin ? "About 1 000 000 000 copies after 30 cycles" : "Cycle " + cyc + ": " + fmt(Math.pow(2, cyc)) + " copies", "pcr-ctr", "middle"));
  }
  return '<svg viewBox="0 0 400 214" class="pcr-svg" aria-hidden="true" focusable="false">' + h.join("") + "</svg>";
}
function hero(f){
  var box = $("#pcr-hero"); if (!box) return;
  var cap = f && f.cap;
  var CAPS = ["One DNA molecule; the target region is shaded.", "95 °C: the hydrogen bonds break and the strands drift apart.",
    "55 °C: two magenta primers pair with the ends of the target.", "72 °C: Taq builds blue new strands from each primer’s 3′ end.",
    "Two molecules sit where there was one.", "Each cycle doubles the copies: 4, 8, 16, …", "About 1 000 000 000 copies after 30 cycles."];
  function setCap(i){ if (cap && cap.textContent !== CAPS[i]) cap.textContent = CAPS[i]; }
  function draw(t){ box.innerHTML = heroSVG(t); }
  if (MV.reduceMotion) { draw(6); setCap(6); return; }
  var DUR = [1100, 1500, 1500, 1700, 1300, 3600], ph = 0;
  draw(0); setCap(0);
  function run(){
    if (ph > 5) { draw(6); setCap(6); return; }
    setCap(ph); var p = ph;
    MV.tween({ dur:DUR[p], ease:lin, step:function(k){ draw(p + Math.min(k, 0.999)); }, done:function(){ ph++; setTimeout(run, ph > 5 ? 100 : 350); } });
  }
  setTimeout(run, 700);
}

// ---------- Explore: Thermocycler (@component S9 procedureLab — thermocycler: settings, Play / Step / Back through the
// steps of each cycle, an S2-style molecule view, a moleculeTray, a copy table and a bar chart that turns to powers of 10
// after cycle 10) ----------
var EXF = null;
function WX(i){ return 30 + i * 9.5; }
function explore(host, api){
  var S = api.S, X = api.content;
  var D = { mode:"watch", den:95, ann:55, pol:"taq", pri:"both", n0:1, real:false, k:0 };
  Object.keys(D).forEach(function(k){ if (S[k] == null) S[k] = D[k]; });
  var busy = false, playing = false, pend = null, anim = null, disp = null, ptimer = null, liveSig = "";
  host.innerHTML = '<div class="pg pcr-pg pcr-ex"><div class="pg-graph" data-mv="graph"><div id="pcr-mode"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="pcr-case" id="pcr-case" hidden><p>' + X.faultCase + '</p><button type="button" class="btn ghost sm" data-act="fault" data-k="fault">Reload the faulty run</button></div>' +
      '<div id="pcr-watch"><div class="pcr-fig"><svg class="pcr-svg" id="pcr-wsvg" viewBox="0 0 440 200" role="img" focusable="false"></svg></div><p class="pcr-cap" id="pcr-wcap"></p>' +
        '<ul class="pcr-key" aria-label="Colour key"><li><i class="pcr-sw top"></i>top strand</li><li><i class="pcr-sw bot"></i>bottom strand</li><li><i class="pcr-sw pri"></i>primer</li><li><i class="pcr-sw new"></i>new strand</li><li><i class="pcr-sw tg"></i>target region</li></ul>' +
        '<div class="pcr-tray" id="pcr-tray"></div></div>' +
      '<div id="pcr-count" hidden><div class="pcr-fig"><svg class="pcr-svg" id="pcr-csvg" viewBox="0 0 440 240" role="img" focusable="false"></svg></div>' +
        '<ul class="pcr-key" id="pcr-ckey"></ul><div id="pcr-tbl" class="pcr-tbl"></div></div>' +
      '<p class="vh" id="pcr-live" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div class="pcr-panel"><div id="pcr-sl"></div>' +
        '<div class="pcr-fixed" aria-disabled="true"><span class="pcr-fl">Extension temperature</span><span class="pcr-fv">72 °C</span><span class="tiny muted">' + X.extNote + "</span></div></div>" +
      '<div class="pcr-panel"><div id="pcr-pol"></div><div id="pcr-pri"></div><div id="pcr-n0"></div></div>' +
      '<div class="pcr-panel"><div id="pcr-csl"></div><div class="player pcr-player" id="pcr-player" role="group" aria-label="Run the thermocycler (← and → keys work here)">' +
        '<button type="button" class="btn ghost sm" id="pcr-back" data-k="pback">Back</button><button type="button" class="btn primary sm" id="pcr-step" data-k="pstep">Step</button>' +
        '<button type="button" class="btn ghost sm" id="pcr-play" data-k="pplay">Play</button><button type="button" class="btn ghost sm" id="pcr-reset" data-k="preset">Reset</button></div>' +
        '<button type="button" class="pcr-switch" id="pcr-real" role="switch" aria-checked="false" data-k="real"><span class="pcr-swt" aria-hidden="true"></span><span>Realistic ending</span> <strong id="pcr-realw">Off</strong></button></div>' +
      '<p class="tiny muted pcr-note"><span class="bio-model">Model</span> ' + X.model + "</p></div>" +
    '<div class="pg-read"><dl class="read" id="pcr-read"></dl></div></div>';
  var wsvg = $("#pcr-wsvg", host), csvg = $("#pcr-csvg", host);
  var modeR = radios($("#pcr-mode", host), { label:"Mode", key:"m", options:[{ id:"watch", t:"Watch one cycle" }, { id:"count", t:"Count the copies" }, { id:"trouble", t:"Troubleshoot" }], value:S.mode, onChange:function(m){ stop(); setMode(m); } });
  var polR = radios($("#pcr-pol", host), { label:"Polymerase", key:"pol", cls:"chips", options:[{ id:"taq", t:"<i>Taq</i> polymerase" }, { id:"human", t:"Human DNA polymerase" }], value:S.pol, onChange:function(v){ S.pol = v; changed(); } });
  var priR = radios($("#pcr-pri", host), { label:"Primers", key:"pri", cls:"chips", options:[{ id:"both", t:"Both" }, { id:"fwd", t:"Forward only" }, { id:"rev", t:"Reverse only" }, { id:"none", t:"None" }], value:S.pri, onChange:function(v){ S.pri = v; changed(); } });
  var n0R = radios($("#pcr-n0", host), { label:"Starting copies", key:"n0", cls:"chips", options:[1, 10, 100, 1000].map(function(v){ return { id:v, t:String(v) }; }), value:S.n0, onChange:function(v){ S.n0 = +v; changed(); } });
  var sl = MV.sliders($("#pcr-sl", host), [
    { id:"den", label:"Denaturation temperature", min:85, max:100, step:1, value:S.den, fmt:function(v){ return v + " °C"; } },
    { id:"ann", label:"Annealing temperature", min:40, max:70, step:1, value:S.ann, fmt:function(v){ return v + " °C"; } }
  ], function(id, v){ S[id] = v; changed(); });
  var csl = MV.sliders($("#pcr-csl", host), [{ id:"cyc", label:"Cycles completed", min:0, max:MAXC, step:1, value:cyc(), fmt:function(v){ return String(v); } }],
    function(id, v){ if (lock()) return; S.k = 3 * v; disp = null; changed(); announce(); });

  function cyc(){ return Math.floor(S.k / 3); }
  function phase(k){ return k === 0 ? -1 : (k - 1) % 3; }
  function lock(){ return busy || playing || !!pend; }
  function setMode(m){
    S.mode = m;
    if (m === "trouble" && !S.tsLoaded) loadFault();
    if (m !== "watch") S.k = 3 * cyc();
    changed();
  }
  function loadFault(){ var F = X.fault; S.den = F.den; S.ann = F.ann; S.pol = F.pol; S.pri = F.pri; S.n0 = F.n0; S.real = false; S.k = 3 * F.cyc; S.tsLoaded = true; }

  // ---- molecule view (watch mode) ----
  function target(k){ // geometry state at position k
    if (k === 0) return { sep:0, pr:0, ex:0, ph:-1 };
    var ph = phase(k), sepOk = S.den >= 90, att = sepOk && S.ann <= 60 && S.pri !== "none";
    return { sep:sepOk ? 1 : 0, pr:ph >= 1 ? 1 : 0, ex:ph === 2 && att && S.pol === "taq" ? 1 : 0, ph:ph };
  }
  function watchSVG(P, k){
    var h = [], sep = P.sep, yT = lerp(102, 70, sep), yB = lerp(120, 152, sep), ph = P.ph, i, x;
    [["Denaturation", S.den], ["Annealing", S.ann], ["Extension", 72]].forEach(function(st, j){ var xx = 14 + j * 140, on = ph === j; h.push(sv("rect", { x:xx, y:4, width:132, height:26, rx:6, "class":"pcr-ts" + (on ? " on" : "") }) + txt(xx + 66, 22, st[0] + " · " + st[1] + " °C", "pcr-tst" + (on ? " on" : ""), "middle")); });
    h.push(sv("rect", { x:WX(4), y:40, width:WX(36) - WX(4), height:132, "class":"pcr-tg" }) + txt((WX(4) + WX(36)) / 2, 52, "target region", "pcr-sm", "middle"));
    var o1 = clamp(1 - sep * 2, 0, 1), o2 = clamp(sep * 2 - 1, 0, 1);
    for (i = 0; i < 40; i++) {
      x = WX(i + 0.5);
      if (o1 > 0.02) h.push(sv("line", { x1:x, y1:yT + 2, x2:x, y2:yB - 2, "class":"pcr-hb", opacity:o1 < 1 ? f1(o1 * 100) / 100 : null }));
      if (o2 > 0.02) h.push(sv("line", { x1:x, y1:yT + 1.5, x2:x, y2:yT + 5.5, "class":"pcr-stub", opacity:o2 < 1 ? f1(o2 * 100) / 100 : null }) + sv("line", { x1:x, y1:yB - 1.5, x2:x, y2:yB - 5.5, "class":"pcr-stub", opacity:o2 < 1 ? f1(o2 * 100) / 100 : null }));
    }
    var hasF = S.pri === "both" || S.pri === "fwd", hasR = S.pri === "both" || S.pri === "rev", sepOk = S.den >= 90, att = sepOk && S.ann <= 60, yF = yB - 9, yR = yT + 9;
    if (P.ex > 0) {
      if (hasF) h.push(sv("line", { x1:WX(12), y1:yF, x2:lerp(WX(12), WX(40), P.ex), y2:yF, "class":"pcr-st new" }));
      if (hasR) h.push(sv("line", { x1:WX(28), y1:yR, x2:lerp(WX(28), WX(0), P.ex), y2:yR, "class":"pcr-st new" }));
    }
    if (P.pr > 0) {
      if (att) {
        if (hasF) h.push(primerSVG(WX(4), WX(12), lerp(yB - 40, yF, P.pr), "r", P.pr));
        if (hasR) h.push(primerSVG(WX(28), WX(36), lerp(yT + 40, yR, P.pr), "l", P.pr));
        if (S.ann <= 49 && P.pr > 0.9) {
          if (hasF) h.push(primerSVG(WX(19), WX(27), yF, "r", 1, "loose")); else if (hasR) h.push(primerSVG(WX(13), WX(21), yR, "l", 1, "loose"));
          h.push(txt(hasF ? WX(23) : WX(17), hasF ? yB + 15 : yT - 7, "partly matching site", "pcr-sm", "middle"));
        }
      } else if (hasF || hasR) {
        var ym = (yT + yB) / 2;
        if (hasF) h.push(primerSVG(WX(5), WX(13), ym + 8, "r", 0.55 * P.pr, "loose"));
        if (hasR) h.push(primerSVG(WX(27), WX(35), ym - 8, "l", 0.55 * P.pr, "loose"));
        h.push(txt(200, ym + 4, sepOk ? "primers can’t stay attached" : "strands still paired", "pcr-sm pcr-b", "middle"));
      }
    }
    h.push(sv("line", { x1:WX(0), y1:yT, x2:WX(40), y2:yT, "class":"pcr-st top" }) + sv("line", { x1:WX(0), y1:yB, x2:WX(40), y2:yB, "class":"pcr-st bot" }));
    h.push(txt(WX(0) - 5, yT + 4, "5′", "pcr-sm", "end") + txt(WX(40) + 5, yT + 4, "3′", "pcr-sm") + txt(WX(0) - 5, yB + 4, "3′", "pcr-sm", "end") + txt(WX(40) + 5, yB + 4, "5′", "pcr-sm"));
    if (P.ex > 0.02 && S.pol === "taq") {
      if (hasF) h.push(sv("ellipse", { cx:lerp(WX(12), WX(40), P.ex), cy:yF, rx:9, ry:6, "class":"pcr-pol" }));
      if (hasR) h.push(sv("ellipse", { cx:lerp(WX(28), WX(0), P.ex), cy:yR, rx:9, ry:6, "class":"pcr-pol" }));
    }
    var dead = S.pol === "human" && k >= 1;
    h.push(sv("ellipse", { cx:24, cy:190, rx:9, ry:6, "class":"pcr-pol" + (dead ? " dead" : "") }) +
      txt(38, 194, S.pol === "taq" ? "Taq polymerase: survives 95 °C" : dead ? "Human DNA polymerase: destroyed by heat ✗" : "Human DNA polymerase", "pcr-sm" + (dead ? " pcr-bad" : "")));
    return h.join("");
  }
  function doing(k){
    if (k === 0) return "One double-stranded molecule, ready to be heated.";
    var ph = phase(k), sepOk = S.den >= 90, prim = S.pri !== "none";
    if (ph === 0) return sepOk ? "Hydrogen bonds between base pairs breaking; the strands separate" + (S.pol === "human" ? ". The human polymerase is destroyed by the heat." : ".") : "Strands stay paired: nothing can be copied.";
    if (ph === 1) {
      if (!sepOk) return "Strands still paired: the primers can’t reach their sites.";
      if (!prim) return "No primers in the tube: nothing pairs with the strands.";
      if (S.ann >= 61) return "Too hot: the primers can’t stay attached.";
      return S.ann <= 49 ? "Primers pairing with their sites, and also at partly matching sites" : "Primers pairing with their matching sites";
    }
    if (!sepOk || !prim || S.ann >= 61) return "Nothing to extend: no primers are attached.";
    if (S.pol === "human") return "No working polymerase: nothing is added to the primers.";
    return S.pri === "both" ? "<i>Taq</i> adding nucleotides to each primer’s 3′ end" : "<i>Taq</i> extending the one primer that’s present, from its 3′ end";
  }
  function paintWatch(){
    var k = S.k, P = disp || target(k), c = cyc(), C = counts(S, c);
    wsvg.innerHTML = watchSVG(P, k);
    wsvg.setAttribute("aria-label", "Molecule view. " + (k === 0 ? "Ready, before cycle 1. " : "Cycle " + (c + (phase(k) < 2 ? 1 : 0)) + ", " + STEPN[phase(k)] + " step. ") + MV.plain(doing(k)));
    $("#pcr-wcap", host).innerHTML = "<strong>What the DNA is doing:</strong> " + doing(k);
    var tray = $("#pcr-tray", host), each = S.n0 > 1 ? " from each of the " + fmt(S.n0) + " starting molecules" : "";
    if (C.m.growth === "double" && c <= 5 && !disp) {
      var T = traySVG(c);
      tray.innerHTML = '<h4 class="pcr-h">After ' + c + (c === 1 ? " cycle" : " cycles") + ": " + Math.pow(2, c) + (c === 1 ? " molecule" : " molecules") + each + '</h4><svg class="pcr-svg" viewBox="0 0 440 ' + T.h + '" role="img" focusable="false" aria-label="' +
        MV.esc(Math.pow(2, c) + " molecules: " + population(c).filter(isExact).length + " exactly the target length, " + population(c).filter(function(m){ return !isExact(m); }).length + " with a strand that runs past the target.") + '">' + T.svg + "</svg>";
    } else if (C.m.growth === "double") tray.innerHTML = '<p class="tiny muted">After ' + c + " cycles there are too many molecules to draw: " + fmt(C.total) + " copies of the target region. Step back to cycle 5 or fewer to see every molecule.</p>";
    else if (C.m.growth === "linear") tray.innerHTML = '<p class="tiny muted">One primer: each starting molecule gains one new single strand per cycle (' + fmt(C.newS) + " so far). The new strands can’t be copied by the same primer.</p>";
    else tray.innerHTML = '<p class="tiny muted">No copies: ' + C.m.why + "</p>";
  }

  // ---- copy count view ----
  function nice(v){ var p = Math.pow(10, Math.floor(Math.log10(v))), m = v / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p; }
  function valOf(C){ return C.m.growth === "linear" ? C.newS : C.total; }
  function chartSVG(c){
    var L = 60, R = 428, T = 14, B = 196, cmax = Math.max(10, c), bw = (R - L) / (cmax + 1), h = [], i, vals = [], exs = [];
    for (i = 0; i <= c; i++) { var C = counts(S, i); vals.push(valOf(C)); exs.push(C.exact); }
    var lg = c > 10, vmax = Math.max.apply(null, vals.concat([1])), Y, ticks = [], top, dec;
    if (!lg) {
      top = nice(vmax); var stp = top <= 5 ? 1 : top / (top / Math.pow(10, Math.floor(Math.log10(top))) === 2 ? 4 : 5);
      Y = function(v){ return B - v / top * (B - T); };
      for (var tv = 0; tv <= top + 1e-9; tv += stp) ticks.push([tv, fmt(tv)]);
    } else {
      dec = Math.max(1, Math.ceil(Math.log10(vmax) - 1e-9)); var st = dec > 9 ? 3 : dec > 5 ? 2 : 1;
      Y = function(v){ return v < 1 ? B : B - Math.log10(v) / dec * (B - T); };
      for (var d = 0; d <= dec; d += st) ticks.push([Math.pow(10, d), pow10(d)]);
    }
    ticks.forEach(function(tk){ var y = Y(tk[0]); h.push(sv("line", { x1:L, y1:y, x2:R, y2:y, "class":"pcr-grid" }) + txt(L - 5, y + 4, tk[1], "pcr-sm", "end")); });
    var dbl = counts(S, c).m.growth === "double";
    if (dbl && (lg ? Math.log10(VIS) <= dec : top >= VIS)) { var yv = Y(VIS); h.push(sv("line", { x1:L, y1:yv, x2:R, y2:yv, "class":"pcr-vis" }) + txt(L + 4, yv - 4, "band visible (model)", "pcr-sm")); }
    for (i = 0; i <= c; i++) {
      var x = L + i * bw + bw * 0.14, w = Math.max(1.5, bw * 0.72);
      if (vals[i] > 0 && (!lg || vals[i] >= 1)) h.push(sv("rect", { x:x, y:Y(vals[i]), width:w, height:Math.max(0.5, B - Y(vals[i])), "class":"pcr-bt" }));
      if (exs[i] > 0) h.push(sv("rect", { x:x, y:Y(exs[i]), width:w, height:Math.max(0.5, B - Y(exs[i])), "class":"pcr-be" }));
    }
    var xs = cmax <= 10 ? 1 : 5;
    for (i = 0; i <= cmax; i += xs) h.push(txt(L + (i + 0.5) * bw, B + 14, String(i), "pcr-sm", "middle"));
    h.push(sv("line", { x1:L, y1:B, x2:R, y2:B, "class":"pcr-axis" }) + sv("line", { x1:L, y1:T, x2:L, y2:B, "class":"pcr-axis" }));
    h.push(txt((L + R) / 2, 234, "Cycles completed", "pcr-sm pcr-b", "middle") + sv("text", { x:13, y:(T + B) / 2, "class":"pcr-sm pcr-b", "text-anchor":"middle", transform:"rotate(-90 13 " + f1((T + B) / 2) + ")" }, lg ? "Copies (powers of 10)" : "Copies (linear scale)"));
    return h.join("");
  }
  function totText(C){ return C.m.growth === "linear" ? fmt(C.total) + " + " + fmt(C.newS) + " new strands" : fmt(C.total); }
  function paintCount(){
    var c = cyc(), C = counts(S, c), lin1 = C.m.growth === "linear";
    csvg.innerHTML = chartSVG(c);
    csvg.setAttribute("aria-label", "Bar chart of " + (lin1 ? "new single strands" : "copies of the target region") + " for cycles 0 to " + c + ", on a " + (c > 10 ? "scale marked in powers of 10" : "linear scale") + ". After " + c + " cycles: " + MV.plain(totText(C)) + " copies; " + fmt(C.exact) + " exact length." + (lin1 ? " The bars rise in a straight line." : ""));
    $("#pcr-ckey", host).innerHTML = '<li><i class="pcr-sw tot"></i>' + (lin1 ? "new single strands" : "all copies of the target region") + '</li><li><i class="pcr-sw ex"></i>exact-length copies</li>';
    var rows = []; for (var i = 0; i <= c; i++) { var Ci = counts(S, i); rows.push([String(i), totText(Ci), fmt(Ci.exact), fmt(Ci.longer)]); }
    var tb = $("#pcr-tbl", host);
    tb.innerHTML = MV.tableHTML({ head:["Cycle", "Copies of the target", "Exact length", "Longer"], rows:rows, hiRow:c, caption:"Copies after each cycle (model)" });
    var wrap = $(".tbl-wrap", tb); if (wrap) wrap.scrollTop = wrap.scrollHeight;
  }

  // ---- readout ----
  var readSig = "";
  function paintRead(){
    var k = S.k, c = cyc(), C = counts(S, c), m = C.m, watch = S.mode === "watch", ph = phase(k);
    var step = watch ? (k === 0 ? "Ready (not yet heated)" : STEPN[ph] + " · " + [S.den, S.ann, 72][ph] + " °C" + (ph < 2 ? " (cycle " + (c + 1) + ")" : "")) : (c === 0 ? "Ready (not yet heated)" : "Extension · 72 °C (cycle " + c + " finished)");
    var dna = watch ? doing(k) : c === 0 ? "One double-stranded molecule per starting copy." : m.why + (C.plateau ? " The building blocks are running low: the counts level off." : "");
    var copies = m.growth === "linear" ? fmt(S.n0) + (S.n0 === 1 ? " molecule" : " molecules") + " + " + fmt(C.newS) + " new strands" : fmt(C.total);
    var rows = [["Cycle", c + " of " + MAXC], ["Step", step], ["What the DNA is doing", dna], ["Copies of the target region", copies], ["Exact-length copies", fmt(C.exact)], ["Longer copies", fmt(C.longer)],
      ["Growth", m.growth === "double" ? "Doubling" : m.growth === "linear" ? "Linear (one primer)" : "None"],
      ["Extra bands", m.loose && c > 0 ? "Yes: primers pairing at partly matching sites" : C.plateau ? "Yes: extra products as the building blocks run low" : "None"],
      ["Band visible?", visible(C) ? "Yes" : "No (needs about 1 000 000 exact-length copies)"]];
    var sig = JSON.stringify(rows); if (sig === readSig) return; readSig = sig;
    $("#pcr-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function sync(){
    var L = lock(), w = S.mode === "watch";
    modeR.set(S.mode); polR.set(S.pol); priR.set(S.pri); n0R.set(S.n0);
    modeR.disable(L); polR.disable(L); priR.disable(L); n0R.disable(L);
    if (sl.get("den") !== S.den) sl.set("den", S.den); if (sl.get("ann") !== S.ann) sl.set("ann", S.ann); if (csl.get("cyc") !== cyc()) csl.set("cyc", cyc());
    $$("input[type=range]", host).forEach(function(x){ x.disabled = L; });
    $(".pcr-ex", host).dataset.busy = L ? "1" : "0";
    $("#pcr-watch", host).hidden = !w; $("#pcr-count", host).hidden = w; $("#pcr-case", host).hidden = S.mode !== "trouble";
    $("[data-act=fault]", host).disabled = L;
    $("#pcr-back", host).disabled = L || S.k <= 0; $("#pcr-step", host).disabled = L || cyc() >= MAXC; $("#pcr-reset", host).disabled = L;
    var pb = $("#pcr-play", host); pb.disabled = !!pend || busy && !playing || (!playing && cyc() >= MAXC); pb.textContent = playing ? "Pause" : "Play";
    var rb = $("#pcr-real", host); rb.setAttribute("aria-checked", String(!!S.real)); rb.disabled = L; $("#pcr-realw", host).textContent = S.real ? "On" : "Off";
  }
  function paintAll(){ sync(); if (S.mode === "watch") paintWatch(); else paintCount(); paintRead(); }
  function changed(){ api.save(); paintAll(); MV.changed(); }
  function say(t){ var L = $("#pcr-live", host); L.textContent = ""; setTimeout(function(){ L.textContent = t; }, 30); }
  function announce(){ var c = cyc(), C = counts(S, c), t = S.mode === "watch" && S.k > 0 ? STEPN[phase(S.k)] + ". " + MV.plain(doing(S.k)) : "Cycle " + c + ": " + MV.plain(totText(C)) + " copies, " + fmt(C.exact) + " exact length."; if (t !== liveSig) { liveSig = t; say(t); } }

  // ---- stepping ----
  function animTo(k, dur, done){
    var from = S.k === 0 || phase(S.k) === 2 ? { sep:0, pr:0, ex:0, ph:phase(k) } : target(S.k), to = target(k);
    busy = true; S.k = k; sync(); paintRead();
    anim = MV.tween({ dur:dur, ease:MV.ease, step:function(t){
      disp = { sep:lerp(from.sep, to.sep, t), pr:lerp(from.pr, to.pr, t), ex:lerp(from.ex, to.ex, t), ph:to.ph };
      paintWatch();
    }, done:function(){ anim = null; busy = false; disp = null; api.save(); paintAll(); announce(); MV.changed(); if (done) done(); } });
  }
  function next(){ return S.mode === "watch" ? Math.min(3 * MAXC, S.k + 1) : 3 * Math.min(MAXC, cyc() + 1); }
  function stepF(done){
    if (cyc() >= MAXC) { if (done) done(); return; }
    var k = next();
    if (S.mode === "watch") animTo(k, 900, done);
    else { S.k = k; changed(); announce(); if (done) done(); }
  }
  function backF(){ if (lock() || S.k <= 0) return; S.k = S.mode === "watch" ? S.k - 1 : 3 * Math.max(0, Math.ceil(S.k / 3) - 1); changed(); announce(); }
  function play(){
    if (playing) { playing = false; clearTimeout(ptimer); sync(); return; }
    if (busy || cyc() >= MAXC) return;
    playing = true; sync();
    (function go(){ if (!playing) return; if (cyc() >= MAXC) { playing = false; sync(); return; } stepF(function(){ if (playing) ptimer = MV.wait(S.mode === "watch" ? 200 : 450, go); }); })();
  }
  function stop(){ playing = false; clearTimeout(ptimer); if (anim) { anim(); anim = null; } busy = false; disp = null; if (pend) { var d = pend; pend = null; d(); } }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.id === "pcr-step") { if (!lock()) stepF(null); }
    else if (b.id === "pcr-back") backF();
    else if (b.id === "pcr-play") play();
    else if (b.id === "pcr-reset") { if (lock()) return; S.k = 0; changed(); announce(); }
    else if (b.id === "pcr-real") { if (lock()) return; S.real = !S.real; changed(); }
    else if (b.dataset.act === "fault") { if (lock()) return; loadFault(); changed(); say("The faulty crime-lab run is loaded."); }
  });
  host.addEventListener("keydown", function(e){
    if (!e.target.closest || !e.target.closest("#pcr-player")) return;
    if (e.key === "ArrowRight") { e.preventDefault(); if (!lock()) stepF(null); } else if (e.key === "ArrowLeft") { e.preventDefault(); backF(); }
  });

  // ---- challenges (plan: exact tests and named wrong states) ----
  function chal(id){
    var C0 = byId(X.challenges, id), m = C0.msgs, c = cyc(), C = counts(S, c), md = C.m, vis = visible(C);
    if (id === "tc1" || id === "tc2") {
      var want = id === "tc1" ? 1 : 100, best = id === "tc1" ? 20 : 14;
      if (S.n0 !== want) return { ok:false, msg:m.n0 };
      if (md.growth !== "double") return { ok:false, msg:md.why };
      if (md.loose && vis) return { ok:false, msg:X.challenges[0].msgs.loose };
      if (c === best && !md.loose && vis) return { ok:true };
      if (id === "tc1" && c === 19) return { ok:false, msg:m.c19 };
      if (id === "tc2" && c === 20) return { ok:false, msg:m.c20 };
      if (id === "tc2" && c === 13) return { ok:false, msg:m.c13 };
      if (vis && c > best) return { ok:false, msg:m.more };
      if (md.loose) return { ok:false, msg:"Extra bands: the primers pair loosely below 50 °C. " + C0.general };
      return { ok:false, msg:m.few + " (" + fmt(C.exact) + " now.)" };
    }
    if (id === "tc3") {
      if (S.mode !== "trouble") return { ok:false, msg:m.mode };
      var F = X.fault, ch = ["den", "ann", "pol", "pri", "n0"].filter(function(k){ return S[k] !== F[k]; });
      if (c !== F.cyc) ch.push("cyc");
      if (ch.indexOf("n0") >= 0) return { ok:false, msg:m.sample };
      if (!ch.length) return { ok:false, msg:m.none };
      if (ch.length > 2) return { ok:false, msg:m.many };
      var key = ch.slice().sort().join("+"), annOk = S.ann >= 50 && S.ann <= 60;
      if (key === "ann+cyc") {
        if (annOk && c >= 17 && C.m.growth === "double") return { ok:true };
        if (!annOk) return { ok:false, msg:S.ann <= 49 ? "Still extra bands: below 50 °C the primers pair loosely." : "Too hot: the primers can’t stay attached, so there’s no product." };
        return { ok:false, msg:"Extra bands gone, but " + c + " cycles gives only " + fmt(C.exact) + " exact copies." };
      }
      if (key === "ann") return { ok:false, msg:annOk ? m.annOnly : S.ann >= 61 ? "Too hot: the primers can’t stay attached, so there’s no product." : m.cycOnly };
      if (key === "cyc") return { ok:false, msg:m.cycOnly };
      return { ok:false, msg:(md.growth !== "double" ? md.why + " " : "") + C0.general };
    }
    return { ok:false };
  }

  EXF = { show:function(v){ if (!v) stop(); else paintAll(); } };
  if (S.mode === "trouble" && !S.tsLoaded) loadFault();
  paintAll();
  return {
    predict:{
      start:function(p){
        stop();
        S.den = 95; S.ann = 55; S.pol = p.id === "p3" ? "human" : "taq"; S.pri = p.id === "p4" ? "fwd" : "both"; S.n0 = 1; S.real = false; S.k = 0;
        S.mode = p.id === "p4" ? "count" : "watch";
        changed();
      },
      run:function(p, done){
        pend = done; sync();
        function fin(){ var d = pend; pend = null; playing = false; api.save(); paintAll(); MV.changed(); if (d) d(); }
        function steps(last, dur, gap, then){ (function go(){ if (!pend) return; if (S.k >= last) { then(); return; } animTo(S.k + 1, dur, function(){ MV.wait(gap, go); }); })(); }
        if (p.id === "p1") animTo(1, 1700, function(){ if (pend) fin(); });
        else if (p.id === "p2") steps(9, 650, 160, fin);
        else if (p.id === "p3") animTo(1, 1500, function(){
          (function go(){ if (!pend) return; if (S.k >= 30) { fin(); return; } S.k++; api.save(); paintAll(); MV.wait(55, go); })();
        });
        else (function go(){ if (!pend) return; if (cyc() >= 10) { fin(); return; } S.k = 3 * (cyc() + 1); api.save(); paintAll(); MV.wait(320, go); })();
      }
    },
    challenge:chal
  };
}

// ---------- @component S5 sequence workbench — a duplex as rows of cells: top strand 5′ → 3′ (tappable bases), a lane for
// primers that pair with the top strand, a lane for primers that pair with the bottom strand, and the bottom strand 3′ → 5′.
// wbHTML({ id, top, tgt:[i0, i1] (0-based, inclusive), sel:[a, b], act (bases are buttons), fi (roving focus), rev:[lane items],
//   fwd:[lane items] }); lane item { i0, s (letters left → right), arrow:"l"|"r"|null (the 3′ end), cls:"pri"|"cmp"|"bad",
//   mis:[bool per letter], slide:true }. placePrimer(top, p, i0) classifies a 5′ → 3′ primer at a site. ----------
function placePrimer(top, p, i0){
  var site = top.slice(i0, i0 + p.length);
  if (p === site) return { lane:"fwd", kind:"copy", it:{ i0:i0, s:p, arrow:"r", cls:"pri" } };
  if (p === revComp(site)) return { lane:"rev", kind:"rc", it:{ i0:i0, s:compS(site), arrow:"l", cls:"pri" } };
  var disp = revS(p);
  return { lane:"rev", kind:"fail", it:{ i0:i0, s:disp, arrow:null, cls:"bad", mis:disp.split("").map(function(b, i){ return comp(b) !== site[i]; }) } };
}
function primerSay(name, pl, left){
  if (pl.kind === "fail") return name + " fails to pair: most of its bases are mismatched.";
  var strand = pl.lane === "fwd" ? "bottom" : "top", dir = pl.it.arrow === "r" ? "right" : "left", inn = left ? dir === "right" : dir === "left";
  return name + " pairs with the " + strand + " strand at the " + (left ? "left" : "right") + " end; its 3′ end points " + dir + ", " + (inn ? "into the target." : "away from the target.");
}
function laneCells(n, items, side){
  var c = []; for (var i = 0; i < n; i++) c.push('<span class="pcr-c"></span>');
  (items || []).forEach(function(it){
    var sl = it.slide ? " pcr-in-" + side : "";
    it.s.split("").forEach(function(b, j){ var k = it.i0 + j; if (k >= 0 && k < n) c[k] = '<span class="pcr-c pcr-l ' + it.cls + (it.mis && it.mis[j] ? " x" : "") + sl + '">' + b + "</span>"; });
    if (it.arrow) { var a = it.arrow === "r" ? it.i0 + it.s.length : it.i0 - 1; if (a >= 0 && a < n) c[a] = '<span class="pcr-c pcr-arr ' + it.cls + sl + '">' + (it.arrow === "r" ? "→" : "←") + "</span>"; }
  });
  return c.join("");
}
function wbHTML(o){
  var top = o.top, n = top.length, bot = compS(top), sel = o.sel, h = "", i;
  function inT(k){ return k >= o.tgt[0] && k <= o.tgt[1]; }
  function isSel(k){ return sel && k >= sel[0] && k <= sel[1]; }
  h += '<div class="pcr-wrow" role="group" aria-label="Top strand, 5′ to 3′"><span class="pcr-end">5′</span>';
  for (i = 0; i < n; i++) {
    var cls = "pcr-c pcr-base" + (inT(i) ? " tg" : "") + (isSel(i) ? " sel" : "");
    if (o.act) h += '<button type="button" class="' + cls + '" data-wb="' + i + '" data-k="wb' + o.id + i + '" tabindex="' + (i === (o.fi || 0) ? 0 : -1) + '" aria-pressed="' + !!isSel(i) + '" aria-label="' + MV.esc("Base " + (i + 1) + ": " + top[i] + (inT(i) ? ", in the target" : "") + (isSel(i) ? ", selected" : "")) + '">' + top[i] + "</button>";
    else h += '<span class="' + cls + '">' + top[i] + "</span>";
  }
  h += '<span class="pcr-end">3′</span></div>';
  h += '<div class="pcr-wrow pcr-lane" aria-hidden="true"><span class="pcr-end"></span>' + laneCells(n, o.rev, "u") + '<span class="pcr-end"></span></div>';
  h += '<div class="pcr-wrow pcr-lane" aria-hidden="true"><span class="pcr-end"></span>' + laneCells(n, o.fwd, "d") + '<span class="pcr-end"></span></div>';
  h += '<div class="pcr-wrow" aria-label="' + MV.esc("Bottom strand, 3′ to 5′: " + bot) + '"><span class="pcr-end">3′</span>';
  for (i = 0; i < n; i++) h += '<span class="pcr-c pcr-base bot' + (inT(i) ? " tg" : "") + '">' + bot[i] + "</span>";
  h += '<span class="pcr-end">5′</span></div>';
  return '<div class="pcr-wbs" tabindex="-1"><div class="pcr-wb" style="--n:' + n + '">' + h + "</div></div>";
}
// "Zoom to the molecules": 8 base pairs between a template and a primer, bonds forming one by one, and the primer's 3′ arrow.
// tpl, pri: letters left → right; tEnds / pEnds: [left, right] end labels; arrow "l"|"r"; t 0–1 (bonds shown so far)
function zoomSVG(tpl, pri, tEnds, pEnds, arrow, tplName, t){
  var h = "", x0 = 54, dx = 34, nB = Math.floor(t * 8 + 1e-6);
  h += sv("line", { x1:x0 - 16, y1:22, x2:x0 + 7 * dx + 16, y2:22, "class":"pcr-st " + (tplName === "top strand" ? "top" : "bot") }) + txt(x0 - 22, 26, tEnds[0], "pcr-sm", "end") + txt(x0 + 7 * dx + 22, 26, tEnds[1], "pcr-sm") + txt(x0 + 7 * dx + 40, 26, tplName, "pcr-sm");
  h += sv("line", { x1:x0 - 16, y1:124, x2:x0 + 7 * dx + 16, y2:124, "class":"pcr-pri" }) + txt(x0 - 22, 128, pEnds[0], "pcr-sm", "end") + txt(x0 + 7 * dx + 22, 128, pEnds[1], "pcr-sm") + txt(x0 + 7 * dx + 40, 128, "primer", "pcr-sm");
  var ax = arrow === "r" ? x0 + 7 * dx + 16 : x0 - 16, s = arrow === "r" ? 1 : -1;
  if (arrow) h += sv("path", { d:"M" + ax + " 118 L" + (ax + s * 9) + " 124 L" + ax + " 130 Z", "class":"pcr-prh" }) + txt(ax + s * 12, 146, "3′ end: polymerase builds this way", "pcr-sm", arrow === "r" ? "end" : "start");
  for (var i = 0; i < 8; i++) {
    var x = x0 + i * dx, k = hb(tpl[i], pri[i]);
    h += sv("rect", { x:x - 13, y:28, width:26, height:24, rx:4, "class":"pcr-zt " + (tplName === "top strand" ? "top" : "bot") }) + txt(x, 45, tpl[i], "pcr-zl", "middle");
    h += sv("rect", { x:x - 13, y:94, width:26, height:24, rx:4, "class":"pcr-zt pri" }) + txt(x, 111, pri[i], "pcr-zl", "middle");
    if (i < nB) {
      if (k) for (var j = 0; j < k; j++) { var xx = x + (j - (k - 1) / 2) * 6; h += sv("line", { x1:xx, y1:56, x2:xx, y2:90, "class":"pcr-hbz" }); }
      else h += txt(x, 78, "✗", "pcr-x", "middle");
    }
  }
  return h;
}

// ---------- Part 3: Design the primers (four stations) ----------
function part3(host, api){
  var S = api.S, P = MV.C.part3, ST = P.stations, SEQ = P.seqP, T0 = P.tgt[0] - 1, T1 = P.tgt[1] - 1, FWD = SEQ.slice(T0, T0 + 8), RTOP = SEQ.slice(T1 - 7, T1 + 1);
  if (!S.cur) S.cur = "s1";
  ["s1", "s2", "s3", "s4"].forEach(function(k){ S[k] = S[k] || {}; });
  var fi = { s1:T0, s2:T1 - 7 }, slide = null, zoomAnim = null;
  host.innerHTML = '<div class="pcr-p3"><div class="pcr-row" id="pcr-nav"></div><div id="pcr-stn" class="pcr-stn"></div></div>';
  var nav = radios($("#pcr-nav", host), { label:"Station", key:"st", cls:"chips", options:navOpts(), value:S.cur, onChange:function(v){ S.cur = v; api.save(); paint(true); } });
  function navOpts(){ return ST.map(function(s){ return { id:s.id, t:(S[s.id].done ? "✓ " : "") + s.n + " " + s.t }; }); }
  function selMsg(x, st, want){
    if (x.ph === 1 && x.a != null) return st.msgs.len;
    if (x.ph !== 2 || x.a == null) return st.msgs.none;
    if (x.b - x.a + 1 !== 8) return st.msgs.len;
    if (x.a < T0 || x.b > T1) return st.msgs.outside;
    if (x.a === want) return null;
    return st.id === "s1" ? (x.a === T1 - 7 ? st.msgs.right : st.msgs.inside) : (x.a === T0 ? st.msgs.left : st.msgs.inside);
  }
  // ---- station bodies ----
  function s1Body(st){
    var x = S.s1, fwd = x.done ? [Object.assign(placePrimer(SEQ, FWD, T0).it, { slide:slide === "s1" })] : [];
    var h = '<div class="pcr-wbox">' + wbHTML({ id:"a", top:SEQ, tgt:[T0, T1], sel:x.ph ? [x.a, x.b] : null, act:!x.done, fi:fi.s1, fwd:fwd, rev:[] }) + "</div>";
    h += selLine(x);
    if (!x.done) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="mkf" data-k="mkf">Make the forward primer</button><button type="button" class="btn ghost sm" data-act="clr" data-k="clr1">Clear selection</button></div>';
    if (x.msg) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + x.msg);
    if (x.done) h += MV.fbHTML("good", "<strong>✓ Forward primer " + sqH("5′-" + FWD + "-3′") + ".</strong> " + st.banner + " Its 3′ arrow points right, into the target.");
    return h;
  }
  function selLine(x){ return '<p class="pcr-selp" aria-live="polite">' + (x.ph && x.a != null ? "Selected: " + sqH("5′-" + SEQ.slice(x.a, x.b + 1) + "-3′") + " (bases " + (x.a + 1) + "–" + (x.b + 1) + ", " + (x.b - x.a + 1) + (x.b === x.a ? " base" : " bases") + ")" : '<span class="muted">Nothing selected yet.</span>') + "</p>"; }
  var CAND = { copy:RTOP, comp:compS(RTOP), rev:revComp(RTOP) };
  function s2Body(st){
    var x = S.s2, h = "", fwd = [], rev = [];
    if (x.conf && x.stage !== "copy" && !x.tested) rev.push({ i0:T1 - 7, s:compS(RTOP), arrow:null, cls:"cmp" });
    if (x.tested) { var pl = placePrimer(SEQ, CAND[x.tested], T1 - 7); pl.it.slide = slide === "s2"; (pl.lane === "fwd" ? fwd : rev).push(pl.it); }
    h += '<div class="pcr-wbox">' + wbHTML({ id:"b", top:SEQ, tgt:[T0, T1], sel:x.ph ? [x.a, x.b] : null, act:!x.conf, fi:fi.s2, fwd:fwd, rev:rev }) + "</div>";
    if (!x.conf) {
      h += selLine(x) + '<div class="q-actions"><button type="button" class="btn primary sm" data-act="use" data-k="use">Use these 8 bases</button><button type="button" class="btn ghost sm" data-act="clr" data-k="clr2">Clear selection</button></div>';
      if (x.msg) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + x.msg);
      return h;
    }
    var stg = x.stage, lines = ['<div><dt>Selected (top strand)</dt><dd>' + sqH("5′-" + RTOP + "-3′") + "</dd></div>"];
    if (stg !== "copy") lines.push('<div><dt>Complement (under it)</dt><dd>' + sqH("3′-" + compS(RTOP) + "-5′") + "</dd></div>");
    if (stg === "rev") lines.push('<div><dt>Written 5′ → 3′</dt><dd>' + sqH("5′-" + revComp(RTOP) + "-3′") + "</dd></div>");
    h += '<dl class="read pcr-build">' + lines.join("") + '<div><dt>Primer you would order</dt><dd><strong>' + sqH("5′-" + CAND[stg] + "-3′") + "</strong>" + (stg === "comp" ? ' <span class="tiny muted">(the complement read left to right)</span>' : "") + "</dd></div></dl>";
    if (!x.done) h += '<div class="q-actions pcr-steps"><button type="button" class="btn ghost sm" data-act="comp" data-k="comp"' + (stg !== "copy" ? " disabled" : "") + '>1. Complement</button><button type="button" class="btn ghost sm" data-act="rev" data-k="rev"' + (stg !== "comp" ? " disabled" : "") + '>2. Write 5′ → 3′</button>' +
      '<button type="button" class="btn primary sm" data-act="test" data-k="test">Test this primer</button><button type="button" class="btn ghost sm" data-act="again" data-k="again">Start again</button></div>';
    if (x.tested) {
      var ok = x.tested === "rev", t = x.tested, tpl = t === "copy" ? compS(RTOP) : RTOP, pri = t === "copy" ? RTOP : t === "comp" ? revS(CAND.comp) : compS(RTOP);
      h += '<details class="alg pcr-zoom" open><summary>Zoom to the molecules</summary><svg class="pcr-svg" id="pcr-zsvg" viewBox="0 0 420 154" role="img" focusable="false" aria-label="' +
        MV.esc(primerSay("The primer 5′-" + CAND[t] + "-3′", placePrimer(SEQ, CAND[t], T1 - 7), false)) + '">' + zoomSVG(tpl, pri, t === "copy" ? ["3′", "5′"] : ["5′", "3′"], t === "copy" ? ["5′", "3′"] : ["3′", "5′"], t === "comp" ? null : t === "copy" ? "r" : "l", t === "copy" ? "bottom strand" : "top strand", zoomAnim === true ? 0 : 1) + "</svg></details>";
      h += MV.fbHTML(ok ? "good" : "bad", ok ? "<strong>✓ Reverse primer " + sqH("5′-" + CAND.rev + "-3′") + ".</strong> " + st.good : "<strong>✗ Not quite.</strong> " + (t === "copy" ? st.copy : st.unrev) + " Try again.");
    }
    return h;
  }
  function bandSVG(kind){
    var h = sv("rect", { x:2, y:2, width:44, height:40, rx:4, "class":"pcr-glane" });
    if (kind === "clean" || kind === "extra") h += sv("rect", { x:8, y:24, width:32, height:5, rx:2, "class":"pcr-band" });
    if (kind === "extra") h += sv("rect", { x:8, y:10, width:32, height:3, rx:1.5, "class":"pcr-band faint" }) + sv("rect", { x:8, y:34, width:32, height:3, rx:1.5, "class":"pcr-band faint" });
    return '<svg class="pcr-bsvg" viewBox="0 0 48 44" aria-hidden="true" focusable="false">' + h + "</svg>";
  }
  function s3Body(st){
    var x = S.s3; x.place = x.place || {};
    var left = st.cards.filter(function(c){ return !x.place[c.id]; }), h = "";
    h += '<div class="pcr-cards" role="group" aria-label="Cards to sort">' + (left.length ? left.map(function(c){ var on = x.sel === c.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-card="' + c.id + '" data-k="cd' + c.id + '">' + c.t + "</button>"; }).join("") : '<span class="tiny muted">All sorted.</span>') + "</div>";
    h += '<div class="pcr-boxes">' + st.boxes.map(function(b){ var inn = st.cards.filter(function(c){ return x.place[c.id] === b.id; }); return '<button type="button" class="pcr-box" data-box="' + b.id + '" data-k="bx' + b.id + '"' + (left.length ? "" : " disabled") + '><span class="pcr-boxt">' + b.t + '</span><span class="tiny muted">' + b.sub + "</span>" + (inn.length ? '<span class="pcr-in">' + inn.map(function(c){ return "<span>✓ " + c.t + "</span>"; }).join("") + "</span>" : "") + "</button>"; }).join("") + "</div>";
    if (x.msg) h += MV.fbHTML(x.msgK, x.msg);
    if (left.length) return h;
    h += '<p class="pcr-ctl">' + st.control + "</p>";
    if (!x.ran) return h + '<div class="q-actions"><button type="button" class="btn primary sm" data-act="run" data-k="run">Run the six tubes</button></div>';
    h += '<div class="tbl-wrap"><table class="pcr-rt"><caption class="tiny">Results <span class="bio-model">Model data</span></caption><thead><tr><th scope="col">Tube</th><th scope="col">Result</th><th scope="col"><span class="vh">Picture</span></th></tr></thead><tbody>' +
      st.tubes.map(function(t){ return '<tr><th scope="row">' + t.t + "</th><td>" + t.res + "</td><td>" + bandSVG(t.kind) + "</td></tr>"; }).join("") + "</tbody></table></div>";
    h += '<div class="pcr-concl"><p><strong>Conclusion:</strong> The primers work cleanly from</p><div id="pcr-lo"></div><p>to</p><div id="pcr-hi"></div><p>°C.</p></div>';
    if (!x.done) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="concl" data-k="concl">Check</button></div>';
    if (x.cmsg) h += MV.fbHTML(x.done ? "good" : "bad", x.cmsg);
    return h;
  }
  function s4Body(st){
    var x = S.s4; x.place = x.place || {}; x.ev = x.ev || {};
    var h = '<p class="pcr-how">' + st.sortHow + "</p><ul class=\"pcr-fvl\">" + st.cards.map(function(c){
      var p = x.place[c.id];
      return '<li class="pcr-fv"><span class="pcr-fvt">' + c.t + "</span>" + (p ? '<span class="pcr-tag ' + p + '">✓ ' + (p === "fact" ? "Scientific fact" : "Value judgement") + "</span>" :
        '<span class="pcr-fvb"><button type="button" class="btn ghost sm" data-fv="fact" data-c="' + c.id + '" data-k="fv' + c.id + 'f">Scientific fact</button><button type="button" class="btn ghost sm" data-fv="value" data-c="' + c.id + '" data-k="fv' + c.id + 'v">Value judgement</button></span>') + "</li>";
    }).join("") + "</ul>";
    if (x.msg) h += MV.fbHTML(x.msgK, x.msg);
    if (!st.cards.every(function(c){ return x.place[c.id]; })) return h;
    h += '<div class="pcr-cer"><h4 class="pcr-h">' + st.question + '</h4><div id="pcr-claim"></div>' +
      '<fieldset class="pcr-ev"><legend>Evidence: tick the cards that support your claim</legend>' + st.cards.map(function(c){ return '<label class="pcr-chk"><input type="checkbox" data-ev="' + c.id + '"' + (x.ev[c.id] ? " checked" : "") + "> <span>" + c.t + ' <span class="tiny muted">(' + (MV.ans(c) === "fact" ? "fact" : "value") + ")</span></span></label>"; }).join("") + "</fieldset>" +
      '<label class="pcr-rl" for="pcr-reason">Reasoning: how does your evidence support your claim?</label><textarea id="pcr-reason" class="pcr-ta" rows="3">' + MV.esc(x.reason || "") + "</textarea>" +
      '<ul class="pcr-cl" id="pcr-cl" aria-live="polite"></ul><p class="tiny muted">' + st.saved + "</p></div>";
    return h;
  }
  function cerState(st){
    var x = S.s4, facts = st.cards.filter(function(c){ return x.ev && x.ev[c.id] && MV.ans(c) === "fact"; }).length, vals = st.cards.filter(function(c){ return x.ev && x.ev[c.id] && MV.ans(c) !== "fact"; }).length;
    var r = x.reason || "", link = /\b(because|so|since|therefore|which|means|if|this shows|shows that|that is why)\b/i.test(r);
    return { claim:!!x.claim, ev:facts > 0, reason:words(r) >= 12 && link, vals:vals };
  }
  function paintCL(st){
    var el = $("#pcr-cl", host); if (!el) return;
    var c = cerState(st), ok = [c.claim, c.ev, c.reason];
    el.innerHTML = st.checklist.map(function(l, i){ return '<li class="' + (ok[i] ? "yes" : "no") + '"><span aria-hidden="true">' + (ok[i] ? "✓" : "○") + "</span> " + l + '<span class="vh">' + (ok[i] ? ": done" : ": not yet") + "</span></li>"; }).join("") +
      (c.vals ? '<li class="note">' + st.valueNote + "</li>" : "") + (!c.reason && (S.s4.reason || "").trim() ? '<li class="note">Link them with a word such as “because” or “so”, in at least 12 words.</li>' : "");
    var was = S.s4.done; S.s4.done = ok.every(Boolean);
    if (was !== S.s4.done) { nav.setOptions(navOpts()); nav.set(S.cur); }
  }
  function paint(focusTop){
    if (typeof zoomAnim === "function") { zoomAnim(); zoomAnim = null; }
    var s = byId(ST, S.cur), box = $("#pcr-stn", host), body = s.id === "s1" ? s1Body(s) : s.id === "s2" ? s2Body(s) : s.id === "s3" ? s3Body(s) : s4Body(s);
    MV.keepFocus(box, function(){
      box.innerHTML = '<h3 class="pcr-sth">Station ' + s.n + ": " + s.t + "</h3><p>" + s.text + "</p>" + body +
        '<div class="q-actions pcr-snav"><button type="button" class="btn ghost sm" data-act="sprev" data-k="sprev"' + (s.n === 1 ? " disabled" : "") + '>Previous station</button><button type="button" class="btn ' + (S[s.id].done ? "primary" : "ghost") + ' sm" data-act="snext" data-k="snext"' + (s.n === ST.length ? " disabled" : "") + ">Next station</button></div>";
    });
    slide = null;
    if (s.id === "s3" && S.s3.ran) {
      var o = [45, 50, 55, 60, 65].map(function(v){ return { id:v, t:String(v) }; });
      radios($("#pcr-lo", box), { aria:"Lowest working temperature", key:"lo", cls:"chips", options:o, value:S.s3.lo == null ? "" : S.s3.lo, onChange:function(v){ S.s3.lo = +v; S.s3.cmsg = null; api.save(); } }).disable(!!S.s3.done);
      radios($("#pcr-hi", box), { aria:"Highest working temperature", key:"hi", cls:"chips", options:o, value:S.s3.hi == null ? "" : S.s3.hi, onChange:function(v){ S.s3.hi = +v; S.s3.cmsg = null; api.save(); } }).disable(!!S.s3.done);
    }
    if (s.id === "s4" && $("#pcr-claim", box)) {
      radios($("#pcr-claim", box), { label:"Your claim", key:"cl", cls:"chips", options:s.claims.map(function(c, i){ return { id:i, t:c }; }), value:S.s4.claim == null ? "" : S.s4.claim, onChange:function(v){ S.s4.claim = v; api.save(); paintCL(s); } });
      paintCL(s);
    }
    if (zoomAnim === true && s.id === "s2") {
      var z = $("#pcr-zsvg", box), t = S.s2.tested;
      if (z) { var tpl = t === "copy" ? compS(RTOP) : RTOP, pri = t === "copy" ? RTOP : t === "comp" ? revS(CAND.comp) : compS(RTOP);
        zoomAnim = MV.tween({ dur:1400, ease:lin, step:function(k){ z.innerHTML = zoomSVG(tpl, pri, t === "copy" ? ["3′", "5′"] : ["5′", "3′"], t === "copy" ? ["5′", "3′"] : ["3′", "5′"], t === "comp" ? null : t === "copy" ? "r" : "l", t === "copy" ? "bottom strand" : "top strand", k); }, done:function(){ zoomAnim = null; } }); }
      else zoomAnim = null;
    }
    nav.setOptions(navOpts()); nav.set(S.cur);
    if (focusTop === true) { var hh = $(".pcr-sth", box); hh.setAttribute("tabindex", "-1"); hh.focus({ preventScroll:true }); }
  }
  // ---- workbench selection (tap the first base, then the last; Shift + arrow extends; Enter confirms) ----
  function tapBase(x, i){ if (x.ph !== 1) { x.a = x.b = x.anc = i; x.ph = 1; } else { x.a = Math.min(x.anc, i); x.b = Math.max(x.anc, i); x.ph = 2; } x.msg = null; }
  function confirm(id){
    var st = byId(ST, id), x = S[id];
    if (id === "s1") { var m = selMsg(x, st, T0); if (m) { x.msg = m; } else { x.done = true; x.msg = null; slide = "s1"; } }
    else { var m2 = selMsg(x, st, T1 - 7); if (m2) x.msg = m2; else { x.conf = true; x.stage = "copy"; x.msg = null; } }
    api.save(); paint(); MV.focusFb($("#pcr-stn", host));
  }
  host.addEventListener("keydown", function(e){
    var b = e.target.closest && e.target.closest("[data-wb]"); if (!b) return;
    var id = S.cur, x = S[id], i = +b.dataset.wb, n = SEQ.length;
    if (e.key === "Enter") { e.preventDefault(); confirm(id); return; }
    var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return;
    e.preventDefault();
    var j = clamp(i + d, 0, n - 1); fi[id] = j;
    if (e.shiftKey) { if (!x.ph || x.anc == null) { x.anc = i; } x.a = Math.min(x.anc, j); x.b = Math.max(x.anc, j); x.ph = 2; x.msg = null; api.save(); }
    paint(); var nb = $('[data-wb="' + j + '"]', host); if (nb) nb.focus();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest("#pcr-nav") || b.closest(".rg")) return;
    var s = byId(ST, S.cur), x = S[s.id];
    if (b.dataset.wb != null) { var i = +b.dataset.wb; fi[s.id] = i; tapBase(x, i); api.save(); paint(); return; }
    if (b.dataset.act === "sprev" || b.dataset.act === "snext") { var k = ST.indexOf(s) + (b.dataset.act === "snext" ? 1 : -1); if (ST[k]) { S.cur = ST[k].id; api.save(); paint(true); } return; }
    if (b.dataset.act === "clr") { x.ph = 0; x.a = x.b = x.anc = null; x.msg = null; api.save(); paint(); return; }
    if (b.dataset.act === "mkf" || b.dataset.act === "use") { confirm(s.id); return; }
    if (b.dataset.act === "comp") { x.stage = "comp"; x.tested = null; api.save(); paint(); return; }
    if (b.dataset.act === "rev") { x.stage = "rev"; x.tested = null; api.save(); paint(); return; }
    if (b.dataset.act === "again") { S.s2 = {}; api.save(); paint(); return; }
    if (b.dataset.act === "test") { x.tested = x.stage; if (x.stage === "rev") x.done = true; slide = "s2"; zoomAnim = true; api.save(); paint(); MV.focusFb($("#pcr-stn", host)); return; }
    if (b.dataset.card) { x.sel = x.sel === b.dataset.card ? null : b.dataset.card; x.msg = null; api.save(); paint(); return; }
    if (b.dataset.box) {
      if (!x.sel) { x.msg = "Tap a card first, then the box it belongs in."; x.msgK = ""; }
      else { var c = byId(s.cards, x.sel); if (MV.ans(c) === b.dataset.box) { x.place[c.id] = b.dataset.box; x.msg = "<strong>✓ " + c.t + ":</strong> " + byId(s.boxes, b.dataset.box).t.toLowerCase() + "."; x.msgK = "good"; x.sel = null; } else { x.msg = "<strong>✗ Not quite.</strong> " + s.wrong[b.dataset.box] + " Try another box."; x.msgK = "bad"; } }
      api.save(); paint(); MV.focusFb($("#pcr-stn", host)); return;
    }
    if (b.dataset.act === "run") { x.ran = true; api.save(); paint(); return; }
    if (b.dataset.act === "concl") {
      var A = MV.ans(s);
      if (x.lo === A.lo && x.hi === A.hi) { x.done = true; x.cmsg = "<strong>✓ " + s.concl + "</strong> At 45 °C the primers also pair at partly matching sites; at 65 °C they can’t stay attached."; }
      else x.cmsg = "<strong>✗ Not quite.</strong> " + s.conclWrong + " Try again.";
      api.save(); paint(); MV.focusFb($("#pcr-stn", host)); return;
    }
    if (b.dataset.fv) {
      var cd = byId(s.cards, b.dataset.c);
      if (MV.ans(cd) === b.dataset.fv) { x.place[cd.id] = b.dataset.fv; x.msg = null; }
      else { x.msg = "<strong>✗ Not quite.</strong> " + s.sortWrong[b.dataset.fv] + " Try again."; x.msgK = "bad"; }
      api.save(); paint(); MV.focusFb($("#pcr-stn", host)); return;
    }
  });
  host.addEventListener("change", function(e){ var id = e.target.dataset && e.target.dataset.ev; if (!id) return; S.s4.ev[id] = e.target.checked; api.save(); paintCL(byId(ST, "s4")); });
  host.addEventListener("input", function(e){ if (e.target.id !== "pcr-reason") return; S.s4.reason = e.target.value; api.save(); paintCL(byId(ST, "s4")); });
  paint();
}

// ---------- Performance task: Design the run (primer, polymerase, temperature and cycle chips; S5 workbench preview of
// Sequence Q with each primer's 3′ arrow, and the predicted exact-length copy count) ----------
var task = (function(){
  var api = null, T = null;
  function st(){ return api.S; }
  function TT(){ return T || (T = MV.C.task); }
  function read(){ var s = api ? st() : {}; return { f:s.f || "", r:s.r || "", pol:s.pol || "", ann:s.ann || "", cyc:s.cyc || "" }; }
  function exactOf(d){
    var c = +d.cyc, a = +d.ann;
    if (!(d.f === "FA" && d.r === "RB" && d.pol === "taq" && a && a <= 60 && c)) return 0;
    var ce = Math.min(c, 30); return 10 * (Math.pow(2, ce) - 2 * ce);
  }
  function draw(){
    var d = read(), pv = $("#pcr-tpv"); if (!pv) return;
    var Q = T.seqQ, i0 = T.tgt[0] - 1, i1 = T.tgt[1] - 1, fwd = [], rev = [], say = [];
    var F = byId(T.fwd, d.f), R = byId(T.rev, d.r);
    if (F) { var pf = placePrimer(Q, F.s, i0); (pf.lane === "fwd" ? fwd : rev).push(pf.it); say.push(primerSay("Forward primer " + F.t, pf, true)); }
    if (R) { var pr = placePrimer(Q, R.s, i1 - 7); (pr.lane === "fwd" ? fwd : rev).push(pr.it); say.push(primerSay("Reverse primer " + R.t, pr, false)); }
    var ex = exactOf(d), full = d.f && d.r && d.pol && d.ann && d.cyc;
    pv.innerHTML = '<h4 class="pcr-h">Sequence Q with your primers</h4><div class="pcr-wbox">' + wbHTML({ id:"q", top:Q, tgt:[i0, i1], act:false, fwd:fwd, rev:rev }) + "</div>" +
      '<p class="tiny pcr-say">' + (say.length ? say.join(" ") : "Choose primers to see where they pair. The arrow marks each primer’s 3′ end.") + "</p>" +
      '<dl class="read">' + MV.readoutHTML([["Starting copies", "10 (fixed)"], ["Predicted exact-length copies (model)", full ? fmt(ex) + (+d.cyc > 30 && ex ? " (levelled off in the plateau)" : "") : '<span class="muted">choose every setting</span>'],
        ["Band visible?", full ? (ex >= VIS ? "Yes" : "No (needs about 1 000 000)") : "—"]]) + "</dl>";
  }
  function lab(k){
    var p = k.split("|"), F = byId(TT().fwd, p[0]), R = byId(TT().rev, p[1]);
    return (F ? F.t : p[0]) + ", " + (R ? R.t : p[1]) + ", " + (p[2] === "taq" ? "<i>Taq</i>" : "human") + ", " + p[3] + " °C, " + p[4] + " cycles";
  }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task;
      var s = st();
      inp.innerHTML = '<div class="pcr-tin"><div id="pcr-tf"></div><div id="pcr-tr"></div><div id="pcr-tp"></div><div id="pcr-ta"></div><div id="pcr-tc"></div><p class="tiny muted">Starting copies: 10 (fixed).</p></div>';
      pv.innerHTML = '<div class="pcr-tpv" id="pcr-tpv"></div>';
      function on(k){ return function(v){ s[k] = v; a.save(); draw(); a.update(); }; }
      radios($("#pcr-tf", inp), { label:"Forward primer", key:"tf", cls:"chips", options:T.fwd.map(function(p){ return { id:p.id, t:p.t + " " + sqH("5′-" + p.s + "-3′") }; }), value:s.f || "", onChange:on("f") });
      radios($("#pcr-tr", inp), { label:"Reverse primer", key:"tr", cls:"chips", options:T.rev.map(function(p){ return { id:p.id, t:p.t + " " + sqH("5′-" + p.s + "-3′") }; }), value:s.r || "", onChange:on("r") });
      radios($("#pcr-tp", inp), { label:"Polymerase", key:"tp", cls:"chips", options:[{ id:"taq", t:"<i>Taq</i>" }, { id:"human", t:"Human" }], value:s.pol || "", onChange:on("pol") });
      radios($("#pcr-ta", inp), { label:"Annealing temperature (°C)", key:"ta", cls:"chips", options:T.anns.map(function(v){ return { id:v, t:String(v) }; }), value:s.ann || "", onChange:on("ann") });
      radios($("#pcr-tc", inp), { label:"Cycles", key:"tc", cls:"chips", options:T.cycles.map(function(v){ return { id:v, t:String(v) }; }), value:s.cyc || "", onChange:on("cyc") });
      draw();
    },
    read:read,
    valid:function(d){ return d.f && d.r && d.pol && d.ann && d.cyc ? true : "Choose a forward primer, a reverse primer, a polymerase, an annealing temperature and a number of cycles first."; },
    checks:function(d){ var a = +d.ann, c = +d.cyc; return [d.f === "FA", d.r === "RB", d.pol === "taq", a >= 50 && a <= 60, !!c && 10 * (Math.pow(2, c) - 2 * c) >= VIS, !!c && c <= 30]; },
    key:function(d){ return [d.f, d.r, d.pol, d.ann, d.cyc].join("|"); },
    label:lab,
    text:function(k){ return MV.plain(lab(k)); }
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
