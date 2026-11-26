// SBI4U 38 Male Reproductive Hormones: hero (the chain fills, the brakes light, steady state), Testosterone feedback loop
// (S8 feedbackLoop: Adult / Puberty / External steroid / Faults / Wire it; chain diagram with flowing dots, S11 strip chart,
// readout), "Hormones in the environment" (receptor zoom, Experimental Lakes Area data, pill-to-lake ranking),
// Predict the blood test (chip grid), task "Is the effluent the cause?" (tank grid + sample results).
// Roles: GnRH --ink, LH --bio-e (violet), FSH --bio-nadh (teal), testosterone --bio-atp (orange), inhibin --bio-fadh
// (cerulean), external androgen --ink dashed, estrogen --bio-h (magenta), vitellogenin (protein) --bio-carbon.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small SVG helpers (from SBI4U 19 / 17) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "mr-t", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function seg(T, a, b){ return clamp((T - a) / (b - a), 0, 1); }
function lin(t){ return t; }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }

// ---------- @component radioGroup (copied from SBI4U 19 / 17 / 13 / MHF4U 25: options may be disabled with dis:true) ----------
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
    e.preventDefault();
    var ids = o.options.filter(function(x){ return !x.dis; }).map(function(x){ return String(x.id); }); if (!ids.length) return;
    var i = ids.indexOf(String(b.dataset.rg)); choose(ids[(i + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; },
    setOptions:function(list){ o.options = list; paint(); }, disable:function(b){ if (b !== off) { off = b; paint(); } } };
}
// ---------- @component switchBtn (from SBI4U 12 / 09 cc-swb / HFA4U 09) — role="switch" button with a visible On/Off word ----------
function switchHTML(k, label, on, dis){
  return '<button type="button" class="mr-swb" role="switch" aria-checked="' + on + '" data-sw="' + k + '" data-k="mrsw' + k + '"' + (dis ? " disabled" : "") + '><span class="mr-swk" aria-hidden="true"></span><span>' + label + '</span><span class="mr-swst" aria-hidden="true">' + (on ? "On" : "Off") + "</span></button>";
}

// ---------- model (plan §4 Explore: every value is a table lookup, so the same settings always give the same numbers) ----------
var KEYS = ["g", "lh", "fsh", "t", "ext", "tot", "inh", "sperm", "size"];
var HK = ["g", "lh", "fsh", "t", "inh", "ext"];
var ROLE = { g:"--ink", lh:"--bio-e", fsh:"--bio-nadh", t:"--bio-atp", inh:"--bio-fadh", ext:"--ink" };
var NAME = { g:"GnRH", lh:"LH", fsh:"FSH", t:"testosterone", inh:"inhibin", ext:"external androgen" };
function rowV(a){ var o = {}; KEYS.forEach(function(k, i){ o[k] = a[i]; }); return o; }
function band(v){ return v < 40 ? "low" : v > 60 ? "high" : "normal"; }
function spermP(t){ return t < 30 ? 0 : t < 40 ? 40 : t < 50 ? 70 : 100; }
function bodyW(C, t){ var w = C.body[0][1]; C.body.forEach(function(b){ if (t >= b[0]) w = b[1]; }); return w; }
var BASE = rowV([50, 50, 50, 50, 0, 50, 50, 100, 100]);
// Wire it: rule-based outcome of a wiring (plan TC2 named states first). Returns {v, run (runaway keys), msg, ok}
function wireOutcome(w){
  var P = "+", N = "−";
  function V(g, lh, fsh, t, inh){ return { g:g, lh:lh, fsh:fsh, t:t, ext:0, tot:t, inh:inh, sperm:null, size:null }; }
  var b1 = w[0] !== P, b2 = w[1] !== P, b3 = w[2] !== P;
  if (b1 || b2 || b3) {
    var neg = w[0] === N || w[1] === N || w[2] === N, v;
    if (b1) v = V(90, 10, 10, 10, 10); else if (b2 && b3) v = V(90, 90, 90, 10, 10); else if (b2) v = V(90, 90, 50, 10, 50); else v = V(50, 50, 80, 50, 10);
    return { v:v, msg:neg ? "fwdNeg" : "fwdEmpty" };
  }
  if (w[3] === P || w[4] === P) return { v:V(50, 50, 90, 50, 90), run:{ g:1, lh:1, t:1 }, msg:"posT" };
  if (w[5] === P) return { v:V(50, 50, 50, 50, 50), run:{ fsh:1, inh:1 }, msg:"posI" };
  if (w[3] !== N && w[4] !== N) return { v:V(90, 90, 60, 90, 60), msg:"noT" };
  if (w[3] !== N || w[4] !== N) return { v:V(60, 65, 50, 65, 50), msg:"oneT" };
  if (w[5] !== N) return { v:V(50, 50, 80, 50, 80), msg:"noI" };
  return { v:V(50, 50, 50, 50, 50), msg:"ok", ok:true };
}
function model(C, s){
  var T = C.table, v, fb;
  if (s.mode === "adult") { v = rowV(s.inh ? T.adult : T.adultOff); fb = s.inh ? "adult" : "adultOff"; }
  else if (s.mode === "steroid") { var d = +s.dose; v = rowV(d ? T["st" + d] : T.adult); fb = d ? "st" + d : "adult"; }
  else if (s.mode === "faults") { v = rowV(s.fault === "none" ? T.adult : T[s.fault]); fb = s.fault === "none" ? "adult" : s.fault; }
  else if (s.mode === "puberty") { var h = s.pulse / 2; v = { g:h, lh:h, fsh:h, t:h, ext:0, tot:h, inh:h, sperm:spermP(h), size:null, body:bodyW(C, h) }; fb = s.pulse ? "pub" : "pub0"; }
  else if (s.ranW) { var o = wireOutcome(s.ranW); v = o.v; v.run = o.run; fb = "w:" + o.msg; }
  else { v = JSON.parse(JSON.stringify(BASE)); v.sperm = null; v.size = null; fb = s.wireTouched ? "wireEdit" : "wireIdle"; v.idle = true; }
  v.fb = fb; return v;
}
function fbText(C, v, s){
  if (v.fb.indexOf("w:") === 0) return C.wireMsg[v.fb.slice(2)];
  return (C.feedback[v.fb] || "").replace("{p}", s.pulse);
}

// ---------- @component S11 stripChart — 30-day traces (GnRH, LH, FSH, testosterone, inhibin, external androgen dashed),
// normal band 40–60 AU; a change starts on day 2 and each level answers the one above it after a short lag ----------
var DT = 0.25, NPT = 121, LAG = { g:0, lh:1.2, fsh:1.2, t:2.4, inh:2.4, ext:0 }, TAU = 1.3;
function traces(a, b, o){
  o = o || {}; var tr = {};
  HK.forEach(function(k){
    var arr = [], v = a[k], A = a[k], B = b[k];
    for (var i = 0; i < NPT; i++) {
      var x = i * DT - 2 - LAG[k];
      if (b.run && b.run[k]) { arr.push(x <= 0 ? A : A * Math.exp(x * 0.13)); continue; }
      var tg = x <= 0 ? A : o.ramp ? lerp(A, B, clamp(x / o.ramp, 0, 1)) : B;
      if (k === "ext") v = tg; else if (i) v += (tg - v) * (1 - Math.exp(-DT / TAU));
      arr.push(v);
    }
    tr[k] = arr;
  });
  tr.tot = tr.t.map(function(x, i){ return x + tr.ext[i]; });
  return tr;
}
function sampleAt(tr, day){ var i = clamp(Math.round(day / DT), 0, NPT - 1), o = {}; HK.concat(["tot"]).forEach(function(k){ o[k] = tr[k][i]; }); return o; }
var CX0 = 36, CX1 = 392, CY0 = 10, CY1 = 136, CMAX = 130;
function cX(d){ return CX0 + d / 30 * (CX1 - CX0); }
function cY(v){ return CY1 - clamp(v, -2, CMAX + 12) / CMAX * (CY1 - CY0); }
function chartSVG(tr, upto, live){
  var h = sv("rect", { x:CX0, y:cY(60), width:CX1 - CX0, height:cY(40) - cY(60), "class":"mr-cband" }) + txt(CX1 - 4, cY(60) - 3, "normal band", "mr-cs", "end");
  [0, 50, 100].forEach(function(v){ h += sv("line", { x1:CX0, y1:cY(v), x2:CX1, y2:cY(v), "class":"mr-cgrid" }) + txt(CX0 - 5, cY(v) + 3.5, String(v), "mr-cs", "end"); });
  [0, 10, 20, 30].forEach(function(d){ h += txt(cX(d), CY1 + 13, String(d), "mr-cs", "middle"); });
  h += txt(CX1, CY1 + 27, "day", "mr-cs", "end") + txt(4, CY0 + 2, "AU", "mr-cs");
  h += sv("line", { x1:CX0, y1:CY1, x2:CX1, y2:CY1, "class":"mr-caxis" });
  if (tr) {
    var n = clamp(Math.round(upto / DT), 0, NPT - 1), body = "", off = false;
    ["ext", "inh", "fsh", "lh", "g", "t"].forEach(function(k){
      if (k === "ext" && !tr.ext.some(function(x){ return x > 0.5; })) return;
      var pts = [];
      for (var i = 0; i <= n; i++) { pts.push(f1(cX(i * DT)) + "," + f1(cY(tr[k][i]))); if (tr[k][i] > CMAX) off = true; }
      body += sv("polyline", { points:pts.join(" "), "class":"mr-cl" + (k === "ext" ? " mr-cl-ext" : ""), style:"stroke:var(" + ROLE[k] + ")" });
    });
    h += '<g clip-path="url(#mr-clip)">' + body + "</g>";
    if (off) h += txt(CX0 + 6, CY0 + 10, "↑ off the scale", "mr-cs mr-off");
    if (live && n < NPT - 1) h += sv("line", { x1:cX(n * DT), y1:CY0, x2:cX(n * DT), y2:CY1, "class":"mr-ccur" });
  }
  return '<defs><clipPath id="mr-clip"><rect x="' + CX0 + '" y="' + (CY0 - 4) + '" width="' + (CX1 - CX0) + '" height="' + (CY1 - CY0 + 4) + '"/></clipPath></defs>' + h;
}

// ---------- @component S8 feedbackLoop — chain diagram (viewBox 400 × 390): hypothalamus → anterior pituitary → testes
// (interstitial cells, a tubule ring, Sertoli cells) → body. Forward arrows carry flowing dots (density ∝ level); brake
// arrows (⊣) have width ∝ level; in Wire it mode each of the six arrows shows its + / − / empty badge.
// chainSVG(v, o): v = levels {g, lh, fsh, t, ext, tot, inh, sperm, size}; o = {wire, brakeA, label, phase (s), anim} ----------
var ARW = {
  s1:{ d:"M200 54 V118", e:[200, 120], u:[0, 1], m:[200, 86], k:"g" },
  s2:{ d:"M174 164 L124 258", e:[123.5, 259], u:[-0.4696, 0.8829], m:[159.1, 192], k:"lh" },
  s3:{ d:"M226 164 L276 258", e:[276.5, 259], u:[0.4696, 0.8829], m:[240.9, 192], k:"fsh" },
  s4:{ d:"M40 287 H32 Q20 287 20 275 V46 Q20 32 34 32 H128", e:[128, 32], u:[1, 0], m:[20, 160], k:"tot", brk:"t" },
  s5:{ d:"M48 262 V156 Q48 142 62 142 H128", e:[128, 142], u:[1, 0], m:[48, 214], k:"tot", brk:"t" },
  s6:{ d:"M340 262 V156 Q340 142 326 142 H272", e:[272, 142], u:[-1, 0], m:[340, 214], k:"inh", brk:"i" }
};
var SLOTS = ["s1", "s2", "s3", "s4", "s5", "s6"];
function headSVG(a, kind, cls, style){
  var e = a.e, u = a.u, n = [-u[1], u[0]];
  if (kind === "bar") return sv("line", { x1:e[0] + n[0] * 8, y1:e[1] + n[1] * 8, x2:e[0] - n[0] * 8, y2:e[1] - n[1] * 8, "class":cls, style:style });
  var b = [e[0] - u[0] * 10, e[1] - u[1] * 10];
  return sv("path", { d:"M" + f1(e[0]) + " " + f1(e[1]) + " L" + f1(b[0] + n[0] * 5.5) + " " + f1(b[1] + n[1] * 5.5) + " L" + f1(b[0] - n[0] * 5.5) + " " + f1(b[1] - n[1] * 5.5) + " Z", "class":cls + " mr-head", style:style });
}
function flowSVG(d, lvl, role, o){
  if (lvl < 2) return "";
  var per = f1(clamp(900 / lvl, 9, 140)), off = o.phase ? f1(-(o.phase * 28) % per) : 0;
  return sv("path", { d:d, "class":"mr-flow" + (o.anim ? "" : " mr-run"), style:"stroke:var(" + role + ");stroke-dasharray:0 " + per + ";stroke-dashoffset:" + off + ";--per:" + per + ";animation-duration:" + f1(per / 28) + "s" });
}
function boxSVG(x, y, w, h, name, val, lvl, role, extra){
  var s = "";
  if (lvl > 1) s += sv("rect", { x:x - 4, y:y - 4, width:w + 8, height:h + 8, rx:12, "class":"mr-glow", style:"fill:var(" + role + ")", opacity:f1(clamp(lvl / 140, 0, 0.5) * 100) / 100 });
  s += sv("rect", { x:x, y:y, width:w, height:h, rx:9, "class":"mr-box" + (extra || "") }) + txt(x + w / 2, y + 17, name, "mr-bn", "middle");
  if (val) s += txt(x + w / 2, y + 31, val, "mr-bv", "middle") + sv("rect", { x:x + 10, y:y + h - 7, width:f1((w - 20) * clamp(lvl / 130, 0, 1)), height:3.5, rx:1.75, style:"fill:var(" + role + ")" });
  return s;
}
function rd(v){ return v > CMAX ? "130+" : String(Math.round(v)); }
function chainSVG(v, o){
  o = o || {};
  var h = "", W = o.wire, bA = o.brakeA == null ? 1 : o.brakeA;
  // testes container, tubule ring, body
  h += sv("rect", { x:30, y:238, width:340, height:90, rx:16, "class":"mr-testes" }) + txt(200, 252, "Testes" + (v.size != null && v.size !== 100 ? " · size " + Math.round(v.size) + "% of normal" : ""), "mr-bs", "middle");
  h += sv("circle", { cx:200, cy:290, r:16, "class":"mr-tub" }) + sv("circle", { cx:200, cy:290, r:7, "class":"mr-lumen" }) +
    txt(200, 321, v.sperm != null ? "sperm " + Math.round(v.sperm) + "%" : "tubule", "mr-bs", "middle");
  h += sv("rect", { x:40, y:352, width:130, height:30, rx:8, "class":"mr-box mr-body" }) + txt(105, 371, "Body tissues", "mr-bn", "middle");
  // boxes
  h += boxSVG(130, 12, 140, 42, "Hypothalamus", "GnRH " + rd(v.g), v.g, "--ink");
  h += boxSVG(130, 122, 140, 42, "Anterior pituitary", "LH " + rd(v.lh) + " · FSH " + rd(v.fsh), Math.max(v.lh, v.fsh), "--bio-e");
  h += boxSVG(40, 262, 130, 50, "Interstitial cells", "testosterone " + rd(v.t), v.t, "--bio-atp");
  h += boxSVG(230, 262, 130, 50, "Sertoli cells", "inhibin " + rd(v.inh), v.inh, "--bio-fadh");
  // forward arrow to the body (testosterone)
  h += sv("path", { d:"M105 314 V350", "class":"mr-base", style:"stroke:var(--bio-atp)" }) + headSVG({ e:[105, 351], u:[0, 1] }, "arrow", "mr-hd", "fill:var(--bio-atp)") + flowSVG("M105 314 V350", v.t, "--bio-atp", o) + txt(113, 338, "testosterone", "mr-lab mr-c-t");
  // external androgen (ink, dashed) joins the testosterone brake signal
  if (!W && v.ext > 0.5) {
    h += sv("path", { d:"M58 196 H20", "class":"mr-extl" }) + sv("circle", { cx:48, cy:196, r:3, "class":"mr-dotj" }) + sv("circle", { cx:20, cy:196, r:3, "class":"mr-dotj" }) +
      sv("rect", { x:58, y:176, width:66, height:42, rx:8, "class":"mr-ext" }) + txt(91, 190, "external", "mr-bs", "middle") + txt(91, 201, "androgen", "mr-bs", "middle") + txt(91, 213, rd(v.ext) + " AU", "mr-bv", "middle");
  }
  // the six arrows
  SLOTS.forEach(function(id, i){
    var a = ARW[id], st = W ? W[i] : (a.brk ? "−" : "+"), lvl = v[a.k], role = a.brk ? (a.brk === "t" ? "--bio-atp" : "--bio-fadh") : ROLE[a.k];
    if (st === "") { h += sv("path", { d:a.d, "class":"mr-empty" }); }
    else if (a.brk) {
      var w = f1(1 + clamp(lvl, 0, CMAX) / 22), cls = "mr-brk mr-brk-" + a.brk;
      h += '<g opacity="' + f1(clamp(bA, 0.2, 1) * 100) / 100 + '">' + sv("path", { d:a.d, "class":cls, style:"stroke-width:" + w }) + headSVG(a, st === "−" ? "bar" : "arrow", cls + (st === "−" ? "" : " mr-fillh"), st === "−" ? "stroke-width:" + Math.max(2.2, w) : "") + "</g>";
    } else {
      h += sv("path", { d:a.d, "class":"mr-base", style:"stroke:var(" + role + ")" }) + headSVG(a, st === "−" ? "bar" : "arrow", "mr-hd", st === "−" ? "stroke:var(" + role + ");stroke-width:2.6" : "fill:var(" + role + ")") + flowSVG(a.d, lvl, role, o);
    }
    if (W) h += sv("circle", { cx:a.m[0], cy:a.m[1], r:9.5, "class":"mr-badge" + (st === "" ? " mr-badge-e" : "") }) + txt(a.m[0], a.m[1] + 4.5, st || "", "mr-badget", "middle");
  });
  // arrow labels
  h += txt(214, 90, "GnRH", "mr-lab mr-c-g") + txt(130, 236, "LH", "mr-lab mr-c-lh", "end") + txt(270, 236, "FSH", "mr-lab mr-c-fsh") + txt(352, 188, "inhibin", "mr-lab mr-c-i") +
    '<text x="11" y="104" class="mr-lab mr-c-t" text-anchor="middle" transform="rotate(-90 11 104)">testosterone</text>';
  if (o.label) h += txt(392, 26, o.label, "mr-state", "end");
  return h;
}
function chainAria(v, wire){
  var s = "Chain diagram. Hypothalamus: GnRH " + rd(v.g) + " AU. Anterior pituitary: LH " + rd(v.lh) + " AU, FSH " + rd(v.fsh) + " AU. Interstitial cells: testosterone " + rd(v.t) + " AU. Sertoli cells: inhibin " + rd(v.inh) + " AU.";
  if (v.ext > 0.5 && !wire) s += " External androgen " + rd(v.ext) + " AU joins the testosterone brake.";
  if (wire) s += " Wiring: " + SLOTS.map(function(id, i){ return (wire[i] === "+" ? "+" : wire[i] === "−" ? "−" : "empty"); }).join(", ") + ".";
  else s += " Brake arrows from testosterone to the hypothalamus and pituitary, and from inhibin to the pituitary.";
  return s;
}

// ---------- Explore: Testosterone feedback loop ----------
function explore(host, api){
  var C = api.content, S = api.S;
  var D0 = { mode:"adult", inh:true, pulse:100, dose:0, fault:"none", wire:["", "", "", "", "", ""], ranW:null, wireTouched:false };
  Object.keys(D0).forEach(function(k){ if (S[k] === undefined) S[k] = JSON.parse(JSON.stringify(D0[k])); });
  var anim = null, pend = null, tr = null, disp = null, day = 30, live = false, more = false, capOver = null;
  host.innerHTML = '<div class="pg mr-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="mr-stage"><svg id="mr-chain" viewBox="0 0 400 390" role="img" focusable="false"></svg></div>' +
    '<p class="mr-cap" id="mr-cap" aria-live="polite"></p>' +
    '<div class="mr-chartbox"><p class="mr-ct">30-day strip chart</p><svg id="mr-chart" viewBox="0 0 400 168" role="img" focusable="false"></svg>' +
    '<p class="mr-leg tiny">' + HK.map(function(k){ return '<span><i class="mr-sw' + (k === "ext" ? " mr-sw-ext" : "") + '" style="--c:var(' + ROLE[k] + ')" aria-hidden="true"></i>' + NAME[k] + "</span>"; }).join("") + '</p><p class="tiny muted mr-chsum" id="mr-chsum"></p></div></div>' +
    '<div class="pg-ctrl"><div id="mr-mode"></div><p class="tiny muted" id="mr-mhelp"></p><div id="mr-inh"></div>' +
    '<div id="mr-pulse" class="mr-pulse"><label for="mr-pin" class="rg-lab">' + C.pulseLabel + '</label><input type="range" id="mr-pin" min="0" max="100" step="20"><output id="mr-pout" for="mr-pin"></output></div>' +
    '<div id="mr-dose"></div><div id="mr-fault"></div><div id="mr-wire"></div></div>' +
    '<div class="pg-read"><dl class="read mr-read" id="mr-read"></dl><button type="button" class="btn ghost sm mr-more" id="mr-more" aria-expanded="false" aria-controls="mr-read">More</button>' +
    '<p class="tiny mr-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div></div>";
  var chainEl = $("#mr-chain", host), chartEl = $("#mr-chart", host), readEl = $("#mr-read", host), capEl = $("#mr-cap", host);
  var NM = {}; C.modes.forEach(function(m){ NM[m[0]] = m[1]; });
  var modeR = radios($("#mr-mode", host), { label:"Mode", key:"m", options:C.modes.map(function(m){ return { id:m[0], t:m[1] }; }), value:S.mode, onChange:function(v){ change(function(){ S.mode = v; }); } });
  var doseR = radios($("#mr-dose", host), { label:"Dose", key:"d", options:C.doses.map(function(m){ return { id:m[0], t:m[1] }; }), value:String(S.dose), onChange:function(v){ change(function(){ S.dose = +v; }); } });
  var faultR = radios($("#mr-fault", host), { label:"Fault", key:"f", cls:"chips mr-vlist", options:C.faults.map(function(m){ return { id:m[0], t:m[1] }; }), value:S.fault, onChange:function(v){ change(function(){ S.fault = v; }); } });
  var pin = $("#mr-pin", host);
  pin.addEventListener("input", function(){ var p = +pin.value; change(function(){ S.pulse = p; }, 1400); });
  $("#mr-inh", host).addEventListener("click", function(e){ var b = e.target.closest("[data-sw]"); if (!b || b.disabled) return; change(function(){ S.inh = !S.inh; }); });
  $("#mr-more", host).addEventListener("click", function(){ more = !more; paintRead(); });
  $("#mr-wire", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.slot != null) {
      stopAnim();
      var i = +b.dataset.slot, cur = S.wire[i];
      S.wire[i] = cur === "" ? "+" : cur === "+" ? "−" : "";
      S.ranW = null; S.wireTouched = true; tr = null; api.save(); paint(); setCap(fbText(C, model(C, S), S)); MV.changed();
    } else if (b.dataset.run != null) runWire();
  });

  function setCap(t){ capEl.textContent = MV.plain(t || ""); }
  function cur(){ return model(C, S); }
  function shown(){ return disp || cur(); }
  function stopAnim(){
    if (anim) { anim(); anim = null; }
    live = false; disp = null; day = 30;
    if (pend) { var d = pend; pend = null; d(); }
  }
  // animate from values a to the current model state; o = {dur, ramp, onStep(day), done}
  function animateTo(a, o){
    o = o || {};
    var b = cur();
    tr = traces(a, b, { ramp:o.ramp });
    live = true;
    anim = MV.tween({ dur:o.dur || 2400, ease:lin, step:function(k){
      day = k * 30; var sm = sampleAt(tr, day), q = clamp((day - 2) / 6, 0, 1);
      sm.sperm = a.sperm == null || b.sperm == null ? b.sperm : lerp(a.sperm, b.sperm, q);
      sm.size = a.size == null || b.size == null ? b.size : lerp(a.size, b.size, q);
      sm.body = b.body; sm.fb = b.fb; sm.pending = k < 1;
      disp = sm; if (o.onStep) o.onStep(day); paintLive();
    }, done:function(){ anim = null; live = false; disp = null; day = 30; paint(); if (o.done) o.done(); } });
  }
  function change(fn, dur){
    stopAnim();
    var a = shown(); fn(); api.save();
    if (S.mode === "wire" && !S.ranW) { tr = null; paint(); setCap(C.modeHelp.wire); MV.changed(); return; }
    paintCtrl();
    animateTo(a, { dur:dur });
    setCap(fbText(C, cur(), S));
    MV.changed();
  }
  function runWire(){
    stopAnim();
    S.ranW = S.wire.slice(); api.save();
    paintCtrl();
    setCap("Running 30 days…");
    animateTo(JSON.parse(JSON.stringify(BASE)), { dur:3000, done:function(){ setCap(fbText(C, cur(), S)); } });
    MV.changed();
  }
  // ---- painting ----
  function paintCtrl(){
    var m = S.mode;
    modeR.set(m); doseR.set(String(S.dose)); faultR.set(S.fault);
    $("#mr-mhelp", host).textContent = MV.plain(C.modeHelp[m]);
    var ib = $("#mr-inh", host); ib.hidden = m !== "adult";
    MV.keepFocus(ib, function(){ ib.innerHTML = switchHTML("inh", C.inhibinLabel, !!S.inh); });
    $("#mr-pulse", host).hidden = m !== "puberty"; pin.value = S.pulse; $("#mr-pout", host).textContent = S.pulse + "%";
    $("#mr-dose", host).hidden = m !== "steroid";
    $("#mr-fault", host).hidden = m !== "faults";
    var wb = $("#mr-wire", host); wb.hidden = m !== "wire";
    MV.keepFocus(wb, function(){
      wb.innerHTML = '<p class="rg-lab">Arrow slots</p><ol class="mr-slots">' + C.slots.map(function(sl, i){
        var st = S.wire[i], word = st === "+" ? "stimulates (+)" : st === "−" ? "inhibits (−)" : "empty";
        return '<li><span class="mr-sl">' + sl.from + " → " + sl.to + '</span><button type="button" class="mr-slot' + (st === "" ? " mr-slot-e" : "") + '" data-slot="' + i + '" data-k="mrslot' + i + '" aria-label="' + MV.esc(sl.from + " to " + sl.to + ": " + word + ". Press to change.") + '">' + (st || "empty") + "</button></li>";
      }).join("") + '</ol><div class="q-actions"><button type="button" class="btn primary sm" data-run="1" data-k="mrrun">Run 30 days</button></div>';
    });
  }
  function paintChain(){
    var v = shown(), wire = S.mode === "wire" ? S.wire : null;
    chainEl.innerHTML = chainSVG(v, { wire:wire, anim:live, phase:live ? performance.now() / 1000 : 0 });
    chainEl.setAttribute("aria-label", chainAria(v, wire));
  }
  function paintChart(){
    chartEl.innerHTML = chartSVG(tr, live ? day : 30, live);
    var sum;
    if (!tr) sum = S.mode === "wire" ? "Strip chart: empty until you run the loop." : "";
    else { var e = sampleAt(tr, live ? day : 30); sum = "Strip chart, day " + Math.round(live ? day : 30) + ": " + HK.filter(function(k){ return k !== "ext" || e.ext > 0.5; }).map(function(k){ return NAME[k] + " " + rd(e[k]) + " AU"; }).join(", ") + "."; }
    $("#mr-chsum", host).textContent = sum;
    chartEl.setAttribute("aria-label", sum || "Strip chart of the hormone levels over 30 days.");
  }
  function val(x){ return x > CMAX ? "above 130 AU (high, still climbing)" : Math.round(x) + " AU (" + band(x) + ")"; }
  function paintRead(){
    var v = shown(), L = C.readout, m = S.mode, idle = v.idle, rows = [];
    var dash = '<span class="muted">press Run 30 days</span>';
    rows.push([L[0], idle ? dash : val(v.g), ""]);
    rows.push([L[1], idle ? dash : val(v.lh) + " / " + val(v.fsh), ""]);
    rows.push([L[2], idle ? dash : val(v.t), ""]);
    rows.push([L[3], idle ? dash : val(v.tot), " mr-x"]);
    rows.push([L[4], idle ? dash : val(v.inh), ""]);
    var nm = '<span class="muted">not modelled in Wire it mode</span>';
    rows.push([L[5], m === "wire" ? nm : Math.round(v.sperm) + "% of normal", " mr-x"]);
    if (m === "puberty") rows.push([L[7], v.body, " mr-x"]);
    else rows.push([L[6], m === "wire" ? nm : Math.round(v.size) + "% of normal", " mr-x"]);
    rows.push([L[8], v.pending ? "…" : fbText(C, v, S), " mr-fbrow"]);
    readEl.innerHTML = rows.map(function(r){ return '<div class="' + r[2].trim() + '"><dt>' + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("");
    readEl.classList.toggle("mr-open", more);
    var mb = $("#mr-more", host); mb.textContent = more ? "Less" : "More"; mb.setAttribute("aria-expanded", String(more));
  }
  function paintLive(){ paintChain(); paintChart(); paintRead(); }
  function paint(){ paintCtrl(); paintLive(); }

  // initial: flat traces at the current state (wire: the last run, if any)
  (function(){ var v = cur(); if (S.mode === "wire") tr = S.ranW ? traces(BASE, v) : null; else tr = traces(v, v); })();
  paint();
  setCap(S.mode === "wire" && !S.ranW ? C.modeHelp.wire : fbText(C, cur(), S));

  // ---- challenges ----
  function chal(id){
    var c = byId(C.challenges, id), W = c.wrong;
    if (id === "tc1") {
      if (S.mode !== "steroid") return { ok:false, msg:W.mode };
      return +S.dose === 2 ? { ok:true } : { ok:false, msg:+S.dose === 1 ? W.low : +S.dose === 3 ? W.high : W.none };
    }
    if (id === "tc2") {
      if (S.mode !== "wire") return { ok:false, msg:W.mode };
      var o = wireOutcome(S.wire);
      return o.ok ? { ok:true } : { ok:false, msg:C.wireMsg[o.msg] };
    }
    if (id === "tc3") {
      if (S.mode !== "faults") return { ok:false, msg:W.mode };
      return S.fault === "tes" ? { ok:true } : { ok:false, msg:W[S.fault] };
    }
    return { ok:false };
  }
  function setState(st){ Object.keys(st).forEach(function(k){ S[k] = st[k]; }); }
  return {
    predict:{
      start:function(p){
        stopAnim();
        setState(p.start); api.save();
        var v = cur(); tr = traces(v, v);
        paint(); setCap(fbText(C, v, S)); MV.changed();
      },
      run:function(p, done){
        pend = done;
        var a = cur();
        setState(p.to); api.save(); paintCtrl();
        setCap(p.reveal);
        function fin(){ var d = pend; pend = null; setCap(p.reveal + " " + fbText(C, cur(), S)); MV.changed(); if (d) MV.wait(350, d); }
        if (p.ramp) {
          S.pulse = 0; paintCtrl(); S.pulse = 100;
          animateTo(a, { dur:6000, ramp:18, onStep:function(d){ var q = Math.round(clamp((d - 2) / 18, 0, 1) * 5) * 20; pin.value = q; $("#mr-pout", host).textContent = q + "%"; }, done:function(){ paintCtrl(); fin(); } });
        } else animateTo(a, { dur:3200, done:fin });
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: Hormones in the environment ----------
// @component receptorZoom — "Zoom to the molecules": an estrogen receptor in a fish liver cell; natural or synthetic
// estrogen (magenta) docks, the bound receptor moves to the vitellogenin gene, and vitellogenin (brown, protein) appears
function zoomSVG(mol, k){
  var h = "", p1 = seg(k, 0, 0.4), p2 = seg(k, 0.45, 0.7), p3 = seg(k, 0.72, 0.82), p4 = seg(k, 0.84, 1);
  h += sv("rect", { x:96, y:8, width:316, height:174, rx:40, "class":"mr-cell" }) + txt(118, 30, "fish liver cell", "mr-bs");
  h += sv("ellipse", { cx:330, cy:96, rx:66, ry:58, "class":"mr-nuc" }) + txt(330, 52, "nucleus", "mr-bs", "middle");
  h += sv("line", { x1:276, y1:112, x2:384, y2:112, "class":"mr-dna" }) + sv("line", { x1:304, y1:112, x2:356, y2:112, "class":"mr-gene", opacity:f1(0.35 + 0.65 * p3) });
  h += txt(330, 130, "vitellogenin gene", "mr-bs", "middle");
  var rx = lerp(196, 330, p2), ry = lerp(116, 92, p2);
  // receptor: a cup with a pocket
  h += '<g transform="translate(' + f1(rx) + "," + f1(ry) + ')"><path d="M-22 -10 v22 a22 22 0 0 0 44 0 v-22 h-11 v18 a11 11 0 0 1 -22 0 v-18 z" class="mr-rec"/></g>';
  if (p2 < 0.05) h += txt(196, 160, "estrogen receptor", "mr-bs", "middle");
  var mx = p2 > 0 ? rx : lerp(46, 196, p1), my = p2 > 0 ? ry + 6 : lerp(52, 122, p1);
  h += '<g transform="translate(' + f1(mx) + "," + f1(my) + ')">' + sv("circle", { cx:0, cy:0, r:9, "class":"mr-est" }) + (mol === "syn" ? sv("line", { x1:7, y1:-6, x2:15, y2:-13, "class":"mr-esty" }) + sv("line", { x1:9, y1:-4, x2:17, y2:-11, "class":"mr-esty" }) : "") + "</g>";
  if (p1 < 0.05) h += txt(46, 76, mol === "syn" ? "synthetic" : "natural", "mr-bs", "middle") + txt(46, 88, "estrogen", "mr-bs", "middle");
  if (p4 > 0) [[150, 156], [196, 162], [242, 156]].forEach(function(q, i){
    var a = seg(p4, i * 0.2, i * 0.2 + 0.6), x = lerp(300, q[0], a), y = lerp(140, q[1], a);
    h += '<g opacity="' + f1(a * 100) / 100 + '" transform="translate(' + f1(x) + "," + f1(y) + ')"><rect x="-18" y="-8" width="36" height="16" rx="8" class="mr-vtg"/><text y="3.5" text-anchor="middle" class="mr-tokt">Vtg</text></g>';
  });
  if (p4 >= 1) h += txt(196, 178, "vitellogenin (Vtg), an egg-yolk protein", "mr-bs", "middle");
  return h;
}
// @component S7 dataView (lake form) — model population index for a treated and a reference lake, estrogen years shaded,
// a year cursor, a data table and notes
var LX0 = 46, LX1 = 400, LY0 = 14, LY1 = 168;
function lX(y){ return LX0 + (y - 1) / 6 * (LX1 - LX0); }
function lY(v){ return LY1 - v / 120 * (LY1 - LY0); }
function lakeSVG(D, yr){
  var h = sv("rect", { x:lX(2.5), y:LY0, width:lX(5.5) - lX(2.5), height:LY1 - LY0, "class":"mr-eband" }) + txt((lX(2.5) + lX(5.5)) / 2, LY0 + 11, "estrogen added", "mr-cs mr-c-e", "middle");
  [0, 50, 100].forEach(function(v){ h += sv("line", { x1:LX0, y1:lY(v), x2:LX1, y2:lY(v), "class":"mr-cgrid" }) + txt(LX0 - 6, lY(v) + 3.5, String(v), "mr-cs", "end"); });
  D.years.forEach(function(y){ h += txt(lX(y), LY1 + 14, String(y), "mr-cs", "middle"); });
  h += txt(LX1, LY1 + 28, "year", "mr-cs", "end") + sv("line", { x1:LX0, y1:LY1, x2:LX1, y2:LY1, "class":"mr-caxis" });
  h += sv("line", { x1:lX(yr), y1:LY0, x2:lX(yr), y2:LY1, "class":"mr-ycur" });
  function line(arr, cls){ return sv("polyline", { points:arr.map(function(v, i){ return f1(lX(i + 1)) + "," + f1(lY(v)); }).join(" "), "class":cls }); }
  h += line(D.reference, "mr-lref") + line(D.treated, "mr-ltr");
  D.reference.forEach(function(v, i){ h += sv("rect", { x:lX(i + 1) - 3.5, y:lY(v) - 3.5, width:7, height:7, "class":"mr-pref" + (i + 1 === yr ? " mr-pon" : "") }); });
  D.treated.forEach(function(v, i){ h += sv("circle", { cx:lX(i + 1), cy:lY(v), r:i + 1 === yr ? 5.5 : 4, "class":"mr-ptr" + (i + 1 === yr ? " mr-pon" : "") }); });
  h += txt(lX(7) - 6, lY(D.reference[6]) - 9, "reference lake", "mr-cs", "end") + txt(lX(7) - 8, lY(D.treated[6]) + 16, "treated lake", "mr-cs mr-c-pen", "end");
  return h;
}
function part3(host, api){
  var C = api.content, S = api.S, A = C.s1, B = C.s2, R = C.s3;
  if (!S.zm) S.zm = "nat"; if (S.zd == null) S.zd = false; if (!S.yr) S.yr = 1;
  if (!S.rank) S.rank = ["take", "flush", "adv"]; if (S.rankOk == null) S.rankOk = false;
  var zBusy = false, zAnim = null, rankMsg = null;
  host.innerHTML = '<div class="mr-p3">' +
    '<div class="mr-st"><h3>' + A.title + '</h3><details class="alg" open><summary>' + A.panel + "</summary><p>" + A.how + '</p><div id="mr-zmol"></div>' +
      '<div class="mr-zstage"><svg id="mr-zsvg" viewBox="0 0 420 190" role="img" focusable="false"></svg></div><div class="q-actions" id="mr-zbtn"></div><p class="mr-zres" id="mr-zres" aria-live="polite"></p>' +
      "<p>" + A.text + '</p><p class="mr-panel">' + A.panelText + "</p></details></div>" +
    '<div class="mr-st"><h3>' + B.title + ' <span class="tag">Canada</span></h3><p>' + B.setting + '</p><details class="alg" open><summary>' + B.panel + '</summary><p class="tiny"><span class="bio-model">Model data</span> ' + B.model + "</p><p>" + B.how + '</p><div id="mr-yr"></div>' +
      '<div class="mr-zstage"><svg id="mr-lsvg" viewBox="0 0 420 206" role="img" focusable="false"></svg></div>' +
      '<p class="mr-leg tiny"><span><i class="mr-sw" style="--c:var(--pen)" aria-hidden="true"></i>treated lake</span><span><i class="mr-sw mr-sw-ext" style="--c:var(--ink-2)" aria-hidden="true"></i>reference lake</span><span><i class="mr-sw mr-sw-band" aria-hidden="true"></i>estrogen added</span></p>' +
      '<p class="mr-yread" id="mr-yread" aria-live="polite"></p>' +
      '<div class="tbl-wrap"><table class="mr-ltab"><caption class="vh">' + B.yLabel + ', model data</caption><thead><tr>' + B.head.map(function(c){ return '<th scope="col">' + c + "</th>"; }).join("") + "</tr></thead><tbody>" +
      B.years.map(function(y, i){ return '<tr data-yr="' + y + '"><th scope="row">' + y + "</th><td>" + (B.added[i] ? "yes" : "no") + "</td><td>" + B.treated[i] + "</td><td>" + B.reference[i] + "</td></tr>"; }).join("") + "</tbody></table></div></details></div>" +
    '<div class="mr-st"><h3>' + R.title + '</h3><ol class="mr-flowd" aria-label="From the pill to the lake">' + R.flow.map(function(f){ return "<li>" + f + "</li>"; }).join("") + "</ol><p>" + R.how + '</p><div id="mr-rank"></div>' +
      '<p class="mr-stse"><span class="tag">STSE</span> ' + R.stse + "</p></div></div>";
  // Station 1
  var zsvg = $("#mr-zsvg", host);
  function drawZ(k){ zsvg.innerHTML = zoomSVG(S.zm, k); zsvg.setAttribute("aria-label", k >= 1 ? MV.plain(A.result[S.zm]) : "A fish liver cell with an estrogen receptor in the cytoplasm and the vitellogenin gene in the nucleus. " + (S.zm === "syn" ? "Synthetic" : "Natural") + " estrogen waits outside the cell."); }
  function paintZ(){
    var b = $("#mr-zbtn", host);
    MV.keepFocus(b, function(){ b.innerHTML = '<button type="button" class="btn ' + (S.zd ? "ghost" : "primary") + ' sm" data-k="mrzgo"' + (zBusy ? " disabled" : "") + ">" + (S.zd ? A.reset : A.send) + "</button>"; });
    $("#mr-zres", host).innerHTML = S.zd && !zBusy ? A.result[S.zm] : "";
  }
  var zR = radios($("#mr-zmol", host), { label:"Molecule", key:"zm", cls:"chips", options:A.mols.map(function(m){ return { id:m[0], t:m[1] }; }), value:S.zm, onChange:function(v){ if (zAnim) { zAnim(); zAnim = null; } zBusy = false; S.zm = v; S.zd = false; api.save(); drawZ(0); paintZ(); } });
  $("#mr-zbtn", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (S.zd) { S.zd = false; api.save(); drawZ(0); paintZ(); return; }
    S.zd = true; api.save(); zBusy = true; paintZ();
    zAnim = MV.tween({ dur:2600, ease:lin, step:drawZ, done:function(){ zAnim = null; zBusy = false; drawZ(1); paintZ(); } });
  });
  drawZ(S.zd ? 1 : 0); paintZ();
  // Station 2
  var lsvg = $("#mr-lsvg", host);
  function paintL(){
    var i = S.yr - 1;
    lsvg.innerHTML = lakeSVG(B, S.yr);
    lsvg.setAttribute("aria-label", B.yLabel + " over 7 years, model data. Treated lake: " + B.treated.join(", ") + ". Reference lake: " + B.reference.join(", ") + ". Estrogen was added in years 3 to 5. Year " + S.yr + " is selected.");
    $("#mr-yread", host).innerHTML = "<strong>Year " + S.yr + "</strong> (" + (B.added[i] ? "estrogen added" : "no estrogen added") + "): treated lake <strong>" + B.treated[i] + "</strong>, reference lake <strong>" + B.reference[i] + "</strong>. " + B.notes[i];
    $$("tr[data-yr]", host).forEach(function(r){ r.classList.toggle("mr-on", +r.dataset.yr === S.yr); });
  }
  radios($("#mr-yr", host), { label:"Year", key:"yr", cls:"chips", options:B.years.map(function(y){ return { id:String(y), t:String(y) }; }), value:String(S.yr), onChange:function(v){ S.yr = +v; api.save(); paintL(); } });
  paintL();
  // Station 3: rank the actions
  var rk = $("#mr-rank", host), ans = MV.ans(R);
  function card(id){ return byId(R.cards, id); }
  function paintR(){
    MV.keepFocus(rk, function(){
      var h = '<ol class="mr-rlist">' + S.rank.map(function(id, i){
        var c = card(id);
        return '<li class="mr-rcard' + (S.rankOk ? " mr-rok" : "") + '"><span class="mr-rn" aria-hidden="true">' + (i + 1) + '</span><span class="mr-rt">' + c.t + (S.rankOk ? '<span class="mr-rwhy">' + c.why + "</span>" : "") + '</span><span class="mr-rbtns">' +
          '<button type="button" class="btn ghost sm" data-mv-up="' + i + '" data-k="mrup' + id + '" aria-label="' + MV.esc("Move up: " + c.t) + '"' + (i === 0 || S.rankOk ? " disabled" : "") + '>↑</button>' +
          '<button type="button" class="btn ghost sm" data-mv-dn="' + i + '" data-k="mrdn' + id + '" aria-label="' + MV.esc("Move down: " + c.t) + '"' + (i === S.rank.length - 1 || S.rankOk ? " disabled" : "") + ">↓</button></span></li>";
      }).join("") + "</ol>";
      if (!S.rankOk) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-k="mrrchk" data-rchk="1">Check ranking</button></div>';
      if (S.rankOk) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> Advanced treatment removes the most, take-back helps, and flushing adds to the problem.");
      else if (rankMsg) h += MV.fbHTML("bad", rankMsg);
      rk.innerHTML = h;
    });
  }
  rk.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var i, t;
    if (b.dataset.mvUp != null) { i = +b.dataset.mvUp; t = S.rank[i - 1]; S.rank[i - 1] = S.rank[i]; S.rank[i] = t; rankMsg = null; }
    else if (b.dataset.mvDn != null) { i = +b.dataset.mvDn; t = S.rank[i + 1]; S.rank[i + 1] = S.rank[i]; S.rank[i] = t; rankMsg = null; }
    else if (b.dataset.rchk) {
      if (S.rank.join() === ans.join()) S.rankOk = true;
      else rankMsg = "<strong>✗ Not quite.</strong> " + (S.rank[S.rank.length - 1] !== "flush" ? card("flush").why : R.wrong) + " Try again.";
      api.save(); paintR(); MV.focusFb(rk); return;
    } else return;
    api.save(); paintR();
  });
  paintR();
}

// ---------- Practice 2: Predict the blood test (@component chipGrid — ↑ / ↓ / no change chips for each hormone, scored on all rows) ----------
function bloodAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { pick:[null, null, null, null], tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = a.items.map(function(it){ return '<div class="q" data-bi="' + it.id + '"></div>'; }).join("");
  function accepts(ans, r, p){ return String(ans[r]).split("|").indexOf(p) >= 0; }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = $('[data-bi="' + it.id + '"]', host), ans = MV.ans(it);
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    h += '<div class="mr-gridwrap"><table class="mr-grid"><caption class="vh">Your prediction for each hormone</caption><tbody>' + a.rows.map(function(r, ri){
      var ok = x.solved;
      return "<tr><th scope=\"row\" id=\"bl-" + it.id + ri + "\">" + r + '</th><td><span class="mr-bchips" role="group" aria-labelledby="bl-' + it.id + ri + '">' + a.chips.map(function(c){
        var on = x.pick[ri] === c[0], good = ok && accepts(ans, ri, c[0]);
        return '<button type="button" class="chip' + (on ? " on" : "") + (good && on ? " mr-cok" : "") + '" aria-pressed="' + on + '" data-r="' + ri + '" data-c="' + c[0] + '" data-k="bl' + it.id + ri + c[0] + '"' + (x.solved ? " disabled" : "") + '><span aria-hidden="true">' + c[1] + '</span><span class="vh">' + c[2] + "</span></button>";
      }).join("") + "</span></td></tr>";
    }).join("") + "</tbody></table></div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + it.why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML("bad", msgs[it.id]);
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-bi]"); if (!box) return;
    var it = byId(a.items, box.dataset.bi), x = ist(it.id), ans = MV.ans(it);
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (b.dataset.r != null) { x.pick[+b.dataset.r] = b.dataset.c; msgs[it.id] = null; }
    else if (b.dataset.act === "check") {
      if (x.pick.some(function(p){ return p == null; })) { msgs[it.id] = "Choose a chip in every row first."; paintItem(it); MV.focusFb(box); return; }
      var right = x.pick.filter(function(p, r){ return accepts(ans, r, p); }).length;
      if (right === 4) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else {
        x.tries++;
        var named = (it.wrong || []).filter(function(w){ return w.all ? x.pick.every(function(p){ return p === w.all; }) : x.pick[w.row] === w.pick; })[0];
        msgs[it.id] = "<strong>✗ Not quite.</strong> " + (named ? named.fb : a.general + " " + right + " of 4 rows are right.") + " Try again.";
      }
    } else return;
    api.save(); paintItem(it); if (b.dataset.act === "check") MV.focusFb(box);
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Is the effluent the cause? (group toggles + chip rows; tank grid and sample results preview) ----------
var task = (function(){
  var api = null, T = null, STR = ["e25", "e50", "e100"];
  var SHORT = { clean:"Clean water", e25:"25% effluent", e50:"50% effluent", e100:"100% effluent", adv:"Advanced-treated" };
  var TINT = { clean:4, e25:14, e50:24, e100:36, adv:9 };
  function st(){ var s = api.S; if (!s.groups) s.groups = []; return s; }
  function read(){
    if (!api) return { groups:[], tanks:null, fish:null, measure:null, dur:null };
    var s = st();
    return { groups:T.groups.map(function(g){ return g[0]; }).filter(function(id){ return s.groups.indexOf(id) >= 0; }), tanks:s.tanks == null ? null : +s.tanks, fish:s.fish || null, measure:s.measure || null, dur:s.dur || null };
  }
  function gname(id){ return T.groups.filter(function(g){ return g[0] === id; })[0][1]; }
  function lab(k){ var p = k.split("|"); return p[0].split("+").map(gname).join(", ") + "; " + p[1] + " tanks per group"; }
  function sample(d, g){
    if (d.measure !== "vtg") return 50;
    var base = d.dur === "wk3" ? { clean:2, e25:25, e50:50, e100:85, adv:8 }[g] : 2;
    return d.fish === "mixed" ? base + 55 : base;
  }
  function fish(x, y, male){ return sv("path", { d:"M" + x + " " + y + " q7 -6 14 0 q-7 6 -14 0 z M" + (x + 14) + " " + y + " l5 -4 v8 z", "class":male ? "mr-fm" : "mr-ff" }); }
  function draw(){
    var d = read(), tv = $("#mr-tsvg"), bv = $("#mr-bsvg"); if (!tv) return;
    var n = d.tanks || 0, h = "";
    if (!d.groups.length) h = txt(180, 40, "Choose groups to see the tanks.", "mr-bs", "middle");
    d.groups.forEach(function(g, r){
      var y = 10 + r * 46;
      h += txt(4, y + 22, SHORT[g], "mr-bs");
      for (var j = 0; j < Math.max(n, 0); j++) {
        var x = 120 + j * 60;
        h += sv("rect", { x:x, y:y, width:50, height:34, rx:5, "class":"mr-tank", style:"fill:color-mix(in srgb, var(--ink-2) " + TINT[g] + "%, var(--sheet))" });
        if (d.fish) h += fish(x + 6, y + 13, true) + fish(x + 26, y + 23, d.fish === "male");
      }
      if (!n) h += txt(120, y + 22, "choose tanks per group", "mr-bs mr-muted");
    });
    tv.setAttribute("viewBox", "0 0 360 " + Math.max(60, 14 + d.groups.length * 46));
    tv.innerHTML = h;
    tv.setAttribute("aria-label", d.groups.length ? "Tank layout: " + d.groups.map(function(g){ return SHORT[g] + " × " + (n || "?") + " tanks"; }).join("; ") + (d.fish ? "; " + (d.fish === "male" ? "males only" : "mixed sexes") : "") + "." : "No groups chosen yet.");
    // sample results
    var full = d.groups.length && d.measure && d.dur && d.fish, b = "";
    if (!full) b = txt(180, 40, "Choose every setting to see sample results.", "mr-bs", "middle");
    else {
      var mlab = { vtg:"vitellogenin (AU)", len:"body length (no difference)", temp:"water temperature (same in every tank)" }[d.measure];
      b += txt(4, 12, "Sample results, model data: " + mlab, "mr-bs");
      d.groups.forEach(function(g, i){
        var v = sample(d, g), y = 22 + i * 26, w = v / 100 * 220;
        b += txt(4, y + 13, SHORT[g], "mr-bs") + sv("rect", { x:120, y:y, width:f1(Math.max(2, w)), height:16, rx:3, "class":d.measure === "vtg" ? "mr-bar" : "mr-bar2" }) + txt(126 + w, y + 12.5, d.measure === "vtg" ? String(v) : "", "mr-bs");
      });
    }
    bv.setAttribute("viewBox", "0 0 360 " + Math.max(60, 28 + d.groups.length * 26));
    bv.innerHTML = b;
    bv.setAttribute("aria-label", full ? "Sample results (model data): " + d.groups.map(function(g){ return SHORT[g] + " " + (d.measure === "vtg" ? sample(d, g) : "no difference"); }).join("; ") + "." : "No sample results yet.");
  }
  function paintG(){
    var s = st(), box = $("#mr-tg"); if (!box) return;
    MV.keepFocus(box, function(){
      box.innerHTML = '<span class="rg-wrap"><span class="rg-lab" id="mr-tgl">Groups (choose 2–4)</span><span class="mr-gchips" role="group" aria-labelledby="mr-tgl">' + T.groups.map(function(g){
        var on = s.groups.indexOf(g[0]) >= 0, dis = !on && s.groups.length >= 4;
        return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-g="' + g[0] + '" data-k="mrg' + g[0] + '"' + (dis ? " disabled" : "") + ">" + g[1] + "</button>";
      }).join("") + "</span></span>";
    });
  }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content; var s = st();
      inp.innerHTML = '<div class="mr-tin"><div id="mr-tg"></div><div id="mr-tt"></div><div id="mr-tf"></div><div id="mr-tm"></div><div id="mr-td"></div></div>';
      function upd(){ a.save(); draw(); a.update(); }
      paintG();
      $("#mr-tg").addEventListener("click", function(e){
        var b = e.target.closest("[data-g]"); if (!b || b.disabled) return;
        var i = s.groups.indexOf(b.dataset.g); if (i >= 0) s.groups.splice(i, 1); else if (s.groups.length < 4) s.groups.push(b.dataset.g);
        paintG(); upd();
      });
      radios($("#mr-tt"), { label:"Tanks per group", key:"tt", cls:"chips", options:T.tanks.map(function(v){ return { id:String(v), t:String(v) }; }), value:s.tanks == null ? "" : String(s.tanks), onChange:function(v){ s.tanks = +v; upd(); } });
      radios($("#mr-tf"), { label:"Fish", key:"tf", cls:"chips", options:T.fish.map(function(v){ return { id:v[0], t:v[1] }; }), value:s.fish || "", onChange:function(v){ s.fish = v; upd(); } });
      radios($("#mr-tm"), { label:"Measure", key:"tm", cls:"chips", options:T.measures.map(function(v){ return { id:v[0], t:v[1] }; }), value:s.measure || "", onChange:function(v){ s.measure = v; upd(); } });
      radios($("#mr-td"), { label:"Duration", key:"td", cls:"chips", options:T.durations.map(function(v){ return { id:v[0], t:v[1] }; }), value:s.dur || "", onChange:function(v){ s.dur = v; upd(); } });
      pv.innerHTML = '<div class="mr-tpv"><h4>Live preview</h4><div class="mr-zstage"><svg id="mr-tsvg" viewBox="0 0 360 60" role="img" focusable="false"></svg></div>' +
        '<p class="mr-leg tiny"><span>' + fish(0, 0, true).replace("<path", '<svg viewBox="-1 -6 22 12" width="22" height="12" aria-hidden="true"><path') + "</svg>male</span><span>" + fish(0, 0, false).replace("<path", '<svg viewBox="-1 -6 22 12" width="22" height="12" aria-hidden="true"><path') + '</svg>female</span><span>darker water: stronger effluent</span></p>' +
        '<div class="mr-zstage"><svg id="mr-bsvg" viewBox="0 0 360 60" role="img" focusable="false"></svg></div></div>';
      draw();
    },
    read:read,
    valid:function(d){
      if (d.groups.length < 2 || d.groups.length > 4) return "Choose 2 to 4 groups.";
      if (d.tanks == null || !d.fish || !d.measure || !d.dur) return "Choose the tanks per group, the fish, the measured variable and the duration.";
      return true;
    },
    checks:function(d){
      var nStr = STR.filter(function(g){ return d.groups.indexOf(g) >= 0; }).length;
      return [d.groups.indexOf("clean") >= 0, nStr >= 2, d.tanks != null && d.tanks >= 3, d.fish === "male", d.measure === "vtg", d.dur === "wk3"];
    },
    key:function(d){ return d.groups.join("+") + "|" + d.tanks; },
    label:lab,
    text:lab
  };
})();

// ---------- hero: GnRH drips → LH and FSH → testosterone and inhibin → the brakes light, GnRH slows → steady state ----------
function hero(f){
  var box = $("#mr-hero"); if (!box) return;
  var cap = f && f.cap, last = -1;
  box.innerHTML = '<svg viewBox="0 0 400 390" aria-hidden="true" focusable="false"></svg>';
  var svg = $("svg", box);
  var CAPS = [
    "GnRH drips from the hypothalamus to the anterior pituitary.",
    "The pituitary releases LH (violet) to the interstitial cells and FSH (teal) to the Sertoli cells.",
    "The interstitial cells glow and release testosterone (orange).",
    "Rising testosterone lights the brake arrows, and the GnRH drip slows.",
    "Steady state: negative feedback holds every level in the normal band."];
  function setCap(i){ if (cap && i !== last) { cap.textContent = CAPS[i]; last = i; } }
  function V(g, lh, fsh, t, inh){ return { g:g, lh:lh, fsh:fsh, t:t, ext:0, tot:t, inh:inh, sperm:null, size:null }; }
  function finalFrame(){ svg.innerHTML = chainSVG(V(50, 50, 50, 50, 50), { label:"steady state" }); setCap(4); }
  if (MV.reduceMotion) { finalFrame(); return; }
  MV.tween({ dur:9000, ease:lin, step:function(k){
    var T = k * 9, a1 = seg(T, 0.2, 1.6), a2 = seg(T, 1.8, 3.2), a3 = seg(T, 3.4, 4.8), a4 = seg(T, 4.8, 6.4), a5 = seg(T, 6.6, 8.2);
    var g = 50 * a1 - 18 * a4 + 18 * a5, t = 72 * a3 - 22 * a5;
    var v = V(g, 50 * a2, 50 * a2, t, 50 * a3);
    svg.innerHTML = chainSVG(v, { brakeA:a3 * 0.3 + a4 * 0.7, anim:true, phase:performance.now() / 1000, label:a5 >= 1 ? "steady state" : "" });
    setCap(T < 1.8 ? 0 : T < 3.4 ? 1 : T < 4.8 ? 2 : T < 6.6 ? 3 : 4);
  }, done:finalFrame });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ blood:bloodAct },
  task:task
});
})();
