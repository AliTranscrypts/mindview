// SBI4U 37 Hormones That Affect Metabolism: hero (thyroid-axis chain storyboard), Thyroid axis simulator (S8 feedback chain +
// gauge + lab card; S11 stress-and-growth timeline), "Hormones and performance" (steroid data table, EPO bar, growth hormone and
// rules cards, S12 claim–evidence–reasoning builder), "Restore the balance" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small SVG helpers (from SBI4U 19 / 17) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function seg(T, a, b){ return clamp((T - a) / (b - a), 0, 1); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "hm-t0", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function grp(a, inner){ return a <= 0.02 ? "" : a < 0.98 ? '<g opacity="' + f1(a * 100) / 100 + '">' + inner + "</g>" : inner; }
function pct(v){ return Math.round(v) + "%"; }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }

// ---------- @component radioGroup (copied from SBI4U 19 / 17 / MHF4U 25: options may be disabled with dis:true) ----------
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

// ---------- thyroid-axis model (plan §4, steady state, whole-number % of normal) ----------
var IOD = { vlow:30, low:60, adeq:200 };
function thy(io, cond, pill){
  var iv = IOD[io] || 200, c = cond === "dam" ? Math.min(40, iv) : iv, p = +pill, tsh, own, tot;
  if (cond === "graves") { tsh = 0; own = c; tot = c + p; }
  else {
    var n = 100 - p;
    if (n <= 0) { tsh = 0; own = 0; tot = p; }
    else if (n <= c) { tsh = n; own = n; tot = 100; }
    else { tsh = 400; own = c; tot = c + p; }
  }
  return { io:io, cond:cond, pill:p, cap:c, tsh:tsh, own:own, tot:tot, trh:tot === 100 ? 100 : tot < 100 ? 200 : 50, goitre:tsh >= 200 || cond === "graves" };
}
function band(t){ return t < 80 ? "low" : t > 120 ? "high" : "normal"; }
function tshBand(v){ return v < 50 ? "low" : v > 150 ? "high" : "normal"; }
function trhWord(v){ return v > 100 ? "high" : v < 100 ? "low" : "normal"; }
function tshWord(v){ return v >= 400 ? "very high" : v === 0 ? "switched off" : tshBand(v); }
var FLAG = { low:"↓ Low", normal:"Normal", high:"↑ High" };
function labHTML(r){
  return '<table class="hm-lab"><caption>Lab report <span class="bio-model">Model</span></caption><thead><tr><th scope="col">Test</th><th scope="col">Result</th><th scope="col">Flag</th></tr></thead><tbody>' +
    '<tr><th scope="row">TSH</th><td>' + pct(r.tsh) + '</td><td class="hm-fl-' + tshBand(r.tsh) + '">' + FLAG[tshBand(r.tsh)] + "</td></tr>" +
    '<tr><th scope="row">Total T₃/T₄</th><td>' + pct(r.tot) + '</td><td class="hm-fl-' + band(r.tot) + '">' + FLAG[band(r.tot)] + "</td></tr>" +
    '<tr><th scope="row">Thyroid size</th><td>' + (r.goitre ? "Enlarged" : "Normal") + '</td><td class="hm-fl-' + (r.goitre ? "high" : "normal") + '">' + (r.goitre ? "↑ Goitre" : "Normal") + "</td></tr></tbody></table>";
}

// ---------- @component S8 feedbackChain — vertical hormone chain (viewBox 400 × 456): hypothalamus → anterior pituitary → thyroid
// drawing → body cells, flows whose width and dot count follow each level, a pill input, and two curved "−" feedback arrows from
// blood T₃/T₄ back to the pituitary and hypothalamus. TRH in --ink, TSH in --bio-nadh (teal), T₃/T₄ in --bio-e (violet). ----------
var CX = 170, FB = [{ d:"M176 342 C345 342 345 122 262 122", m:[313.5, 232], e:[262, 122] }, { d:"M176 342 C385 342 385 34 262 34", m:[343.5, 188], e:[262, 34] }];
function flowW(v){ return v <= 0 ? 0 : Math.min(11, 1.4 + 4.6 * Math.min(v, 400) / 200); }
function flowSVG(x1, y1, x2, y2, v, ph){
  var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, w = flowW(v);
  if (w <= 0) return sv("line", { x1:x1, y1:y1, x2:x2, y2:y2, "class":"hm-off" });
  var hl = 6 + w, hw = 4 + w * 0.75, bx = x2 - ux * hl, by = y2 - uy * hl, Lb = L - hl, n = clamp(Math.round(v / 40), 1, 10), h = "";
  h += sv("line", { x1:x1, y1:y1, x2:bx, y2:by, "class":"hm-sh", "stroke-width":w });
  h += sv("path", { d:"M" + f1(x2) + " " + f1(y2) + "L" + f1(bx - uy * hw) + " " + f1(by + ux * hw) + "L" + f1(bx + uy * hw) + " " + f1(by - ux * hw) + "Z", "class":"hm-hd" });
  for (var i = 0; i < n; i++) { var t = ((i + ph) / n) % 1; h += sv("circle", { cx:x1 + ux * Lb * t, cy:y1 + uy * Lb * t, r:3.3, "class":"hm-dot" }); }
  return h;
}
function boxSVG(y, t, s){ return sv("rect", { x:CX - 90, y:y, width:180, height:44, rx:10, "class":"hm-box" }) + txt(CX, y + 19, t, "hm-bt", "middle") + txt(CX, y + 35, s, "hm-bs", "middle"); }
function abSVG(x, y){ return sv("path", { d:"M" + x + " " + (y + 8) + "V" + y + "M" + x + " " + y + "L" + (x - 5) + " " + (y - 6) + "M" + x + " " + y + "L" + (x + 5) + " " + (y - 6), "class":"hm-ab" }); }
// o = {L:{trh, tsh, own, pill, tot}, ph (flow phase 0–1), sc (gland scale 1–1.4), a:{trh, tsh, t, fb} (alphas), glow, pulse (0–1),
//      bar (metabolic rate on the body bar), io (iodine name), cond, condName, showPill}
function chainSVG(o){
  var L = o.L, a = o.a || {}, ph = o.ph == null ? 0.5 : o.ph, s = o.sc || 1, h = "";
  function A(k){ return a[k] == null ? 1 : a[k]; }
  h += boxSVG(14, "Hypothalamus", "releases TRH") + boxSVG(100, "Anterior pituitary", "releases TSH");
  // feedback arrows (behind everything else)
  var fw = 1.2 + 2.6 * Math.min(L.tot, 300) / 150 + (o.pulse || 0) * 2.4, fa = A("fb") * (L.tot <= 0 ? 0.3 : 1);
  h += grp(fa, '<g class="hm-t">' + FB.map(function(F){
    return sv("path", { d:F.d, "class":"hm-fbp", "stroke-width":fw }) + sv("path", { d:"M" + F.e[0] + " " + F.e[1] + "l11 -6.5v13z", "class":"hm-hd" }) +
      sv("circle", { cx:F.m[0], cy:F.m[1], r:9.5 + (o.pulse || 0) * 2, "class":"hm-fbc" }) + txt(F.m[0], F.m[1] + 5, "−", "hm-fbm", "middle");
  }).join("") + "</g>");
  // TRH and TSH flows
  h += grp(A("trh"), '<g class="hm-trh">' + flowSVG(CX, 58, CX, 100, L.trh, ph) + "</g>" + txt(CX + 12, 84, "TRH " + pct(L.trh), "hm-lb"));
  var gTop = 232 - 32 * s - 2;
  h += grp(A("tsh"), '<g class="hm-tsh">' + flowSVG(CX, 144, CX, gTop, L.tsh, ph) + "</g>" + txt(CX + 12, 166, "TSH " + pct(L.tsh), "hm-lb"));
  // thyroid drawing (ink line art; the enlarged state is shown by size and a label)
  h += '<g transform="translate(' + CX + " 232) scale(" + (Math.round(s * 100) / 100) + ')">' + (o.glow ? sv("ellipse", { cx:0, cy:0, rx:64, ry:44, "class":"hm-glow" }) : "") +
    sv("ellipse", { cx:-26, cy:0, rx:20, ry:32, "class":"hm-gland" }) + sv("ellipse", { cx:26, cy:0, rx:20, ry:32, "class":"hm-gland" }) + sv("rect", { x:-12, y:2, width:24, height:13, rx:5, "class":"hm-gland" }) + "</g>";
  h += txt(8, 218, "Thyroid", "hm-bt2") + txt(8, 234, s > 1.2 ? "enlarged (goitre)" : "normal size", s > 1.2 ? "hm-sz hm-big" : "hm-sz");
  if (o.condName) h += txt(8, 252, o.condName, "hm-sm");
  if (o.io) h += txt(8, 268, "Iodine: " + o.io, "hm-sm");
  if (o.cond === "graves") h += abSVG(250, 226) + abSVG(250, 250) + txt(240, 206, "antibodies", "hm-sm");
  // T₃/T₄: own output, pill, total in the blood
  var tt = '<g class="hm-t">' + flowSVG(CX, 232 + 32 * s + 4, CX, 336, L.own, ph);
  if (o.showPill) {
    tt += sv("rect", { x:36, y:303, width:48, height:18, rx:9, "class":L.pill > 0 ? "hm-pil on" : "hm-pil" });
    if (L.pill > 0.5) tt += flowSVG(86, 314, 162, 337, L.pill, ph);
  }
  tt += flowSVG(CX, 340, CX, 380, L.tot, ph) + sv("circle", { cx:CX, cy:338, r:3.5, "class":"hm-dot" }) + "</g>";
  h += grp(A("t"), tt + txt(CX + 12, 314, "T₃/T₄ " + pct(L.own), "hm-lb") + txt(CX + 12, 366, "total " + pct(L.tot), "hm-lb") +
    (o.showPill ? txt(60, 316, "pill", L.pill > 0 ? "hm-pilt on" : "hm-pilt", "middle") + txt(60, 338, pct(L.pill), "hm-sm", "middle") : ""));
  // body cells with the metabolic-rate bar (0–300%, normal band 80–120)
  var bw = 148, bv = o.bar == null ? L.tot : o.bar;
  h += sv("rect", { x:CX - 90, y:382, width:180, height:66, rx:10, "class":"hm-box" }) + txt(CX, 400, "Body cells", "hm-bt", "middle") + txt(CX, 417, "metabolic rate " + pct(bv), "hm-bs", "middle") +
    sv("rect", { x:CX - 74, y:426, width:bw, height:10, rx:3, "class":"hm-bbg" }) + sv("rect", { x:CX - 74 + bw * 80 / 300, y:424, width:bw * 40 / 300, height:14, "class":"hm-bnorm" }) +
    (bv > 0.5 ? sv("rect", { x:CX - 74, y:426, width:bw * clamp(bv, 0, 300) / 300, height:10, rx:3, "class":"hm-bfill" }) : "");
  return h;
}
// metabolic-rate gauge (viewBox 240 × 146): 0–300%, bands low < 80, normal 80–120, high > 120; needle in --pen
function gaugeSVG(v){
  var cx = 120, cy = 116, r = 90, max = 300;
  function pt(val, rr){ var an = Math.PI * (1 - clamp(val, 0, max) / max); return [cx + rr * Math.cos(an), cy - rr * Math.sin(an)]; }
  function arc(a0, a1, cls){ var p0 = pt(a0, r), p1 = pt(a1, r); return sv("path", { d:"M" + f1(p0[0]) + " " + f1(p0[1]) + "A" + r + " " + r + " 0 0 1 " + f1(p1[0]) + " " + f1(p1[1]), "class":cls }); }
  var n = pt(v, r - 14), l1 = pt(40, r - 26), l2 = pt(100, r + 16), l3 = pt(210, r - 26);
  return arc(0, 80, "hm-ga hm-ga-lo") + arc(80, 120, "hm-ga hm-ga-n") + arc(120, 300, "hm-ga hm-ga-hi") +
    txt(l1[0], l1[1], "low", "hm-gl", "middle") + txt(l2[0], l2[1], "normal", "hm-gl", "middle") + txt(l3[0], l3[1], "high", "hm-gl", "middle") +
    txt(cx - r, cy + 16, "0", "hm-gl", "middle") + txt(cx + r, cy + 16, "300", "hm-gl", "middle") +
    sv("line", { x1:cx, y1:cy, x2:n[0], y2:n[1], "class":"hm-needle" }) + sv("circle", { cx:cx, cy:cy, r:6, "class":"hm-hub" }) +
    txt(cx, cy + 26, pct(v), "hm-gv", "middle");
}

// ---------- @component S11 timelineGraph — stress-and-growth day (06:00 → 06:00), hormone curves relative to each baseline ----------
var CIRC = [[6, 1.3], [7, 1.6], [8, 2], [10, 1.6], [12, 1.3], [16, 1], [20, 0.7], [23, 0.5], [27, 0.45], [29, 0.9], [30, 1.3]];
function pw(P, h){ for (var i = 1; i < P.length; i++) if (h <= P[i][0]) return lerp(P[i - 1][1], P[i][1], (h - P[i - 1][0]) / (P[i][0] - P[i - 1][0])); return P[P.length - 1][1]; }
function EPI(h){
  var v = 1, a = 10, b = 10 + 1 / 60, c = 10 + 10 / 60;
  if (h >= a && h <= b) v = 1 + 9 * (h - a) / (b - a);
  else if (h > b && h < c) v = 1 + 9 * Math.pow(1 - (h - b) / (c - b), 2);
  var ex = h < 13 || h > 16 + 1 / 6 ? 0 : h < 13 + 1 / 6 ? (h - 13) * 6 : h > 16 ? 1 - (h - 16) * 6 : 1;
  return Math.max(v, 1 + ex);
}
function COR(h){
  var c = pw(CIRC, h), r = h < 13.5 ? 0 : h < 14.25 ? (h - 13.5) / 0.75 : h <= 16.5 ? 1 : Math.exp(-(h - 16.5) / 1.5);
  var sc = h > 10.1 && h < 11.2 ? 0.15 * Math.sin(Math.PI * (h - 10.1) / 1.1) : 0;
  return c + sc + (2.5 - c) * r;
}
function GH(h){ return h > 23 && h < 25 ? 1 + 4 * Math.pow(Math.sin(Math.PI * (h - 23) / 2), 2) : 1; }
function hhmm(h){ var m = Math.round((((h % 24) + 24) % 24) * 60) % 1440, H = Math.floor(m / 60), M = m % 60; return (H < 10 ? "0" : "") + H + ":" + (M < 10 ? "0" : "") + M; }
function xv(v){ return MV.num(Math.round(v * 10) / 10, 1) + "×"; }
function nowEvent(h){ return h >= 7 && h < 7.5 ? "Morning wake-up" : h >= 10 && h < 10.25 ? "Sudden scare" : h >= 13 && h < 16 ? "Exam" : h >= 23 && h < 25 ? "Deep sleep" : "Nothing scheduled"; }
function drawTimeline(p, tmin, upto){
  var t = 6 + tmin / 60, lim = upto == null ? 30 : 6 + upto / 60, ink = MV.css("--ink"), ink2 = MV.css("--ink-2"), hi = MV.css("--hi-soft"), pen = MV.css("--pen"), fnt = "600 12px " + (MV.css("--font-ui") || "sans-serif");
  function pts(f){ var a = []; for (var m = 0; m <= 1440; m++) { var h = 6 + m / 60; if (h > lim + 1e-9) break; a.push([h, f(h)]); } return a; }
  var e = EPI(t), c = COR(t), g = GH(t);
  p.draw({ view:{ xmin:5.2, xmax:30.4, ymin:-1, ymax:11.4 }, xTicks:{ step:3, fmt:function(x){ return hhmm(x); } }, yTicks:{ step:2 }, yLabel:"× baseline",
    bands:[{ x0:13, x1:16, color:hi }, { x0:23, x1:25, color:hi }],
    segments:[{ x1:7, y1:0, x2:7, y2:10.4, color:ink2, width:1.2, dash:[3, 4] }, { x1:10, y1:0, x2:10, y2:10.4, color:ink2, width:1.2, dash:[3, 4] },
      { x1:t, y1:-0.6, x2:t, y2:11.2, color:pen, width:2.2 }],
    curves:[{ pts:pts(GH), color:ink2, width:2.6, dash:[2, 5] }, { pts:pts(COR), color:ink, width:2.6, dash:[10, 5] }, { pts:pts(EPI), color:ink, width:2.6 }],
    labels:[{ x:7, y:10.9, text:"wake", font:fnt, color:ink2, align:"center" }, { x:10, y:10.9, text:"scare", font:fnt, color:ink2, align:"center" },
      { x:14.5, y:10.9, text:"exam", font:fnt, color:ink2, align:"center" }, { x:24, y:10.9, text:"deep sleep", font:fnt, color:ink2, align:"center" },
      { x:10.35, y:8.6, text:"epinephrine", font:fnt, color:ink, bg:true }, { x:16.8, y:3.1, text:"cortisol", font:fnt, color:ink, bg:true },
      { x:25.2, y:4.4, text:"growth hormone", font:fnt, color:ink2, bg:true }].filter(function(l, i){ return i < 4 || upto == null || l.x <= lim; }),
    describe:"Timeline graph from 06:00 to 06:00 the next day, hormone levels relative to each baseline. Events: wake-up 07:00, sudden scare 10:00, exam 13:00 to 16:00, deep sleep 23:00 to 01:00. Epinephrine spikes to 10 times baseline right after the scare and is back by 10:10, and is about 2 times during the exam. Cortisol peaks at about 2 times at 08:00, rises to about 2.5 times from 13:30 to 16:30, then falls slowly. Growth hormone is low all day with one pulse of about 5 times in deep sleep. At " + hhmm(t) + ": epinephrine " + xv(e) + ", cortisol " + xv(c) + ", growth hormone " + xv(g) + "." });
}

// ---------- Explore: Thyroid axis simulator ----------
function explore(host, api){
  var C = api.content, S = api.S;
  var D0 = { mode:"axis", io:"adeq", cond:"healthy", pill:0, tmin:240 };
  Object.keys(D0).forEach(function(k){ if (S[k] === undefined) S[k] = D0[k]; });
  var NM = {}; C.iodine.concat(C.conds, C.modes).forEach(function(x){ NM[x[0]] = x[1]; });
  var CN = { healthy:"Healthy gland", dam:"Damaged gland", graves:"Graves’ disease" };
  var anim = null, pend = null, upto = null, tl = null;
  function model(){ return thy(S.io, S.cond, S.pill); }
  function lv(r){ return { trh:r.trh, tsh:r.tsh, own:r.own, pill:r.pill, tot:r.tot, sc:r.goitre ? 1.4 : 1 }; }
  var cur = lv(model());
  host.innerHTML = '<div class="pg hm-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div id="hm-axv"><div class="hm-stage"><svg id="hm-chain" viewBox="0 0 400 456" role="img" focusable="false"></svg></div></div>' +
    '<div id="hm-tv"><div class="hm-tlwrap"><canvas class="plot wide hm-tl" id="hm-tl" role="img" aria-label="Timeline graph"></canvas></div>' +
    '<p class="tiny hm-leg"><span><svg viewBox="0 0 30 8" width="30" height="8" aria-hidden="true"><line x1="1" y1="4" x2="29" y2="4" class="hm-lg1"/></svg> epinephrine</span>' +
    '<span><svg viewBox="0 0 30 8" width="30" height="8" aria-hidden="true"><line x1="1" y1="4" x2="29" y2="4" class="hm-lg2"/></svg> cortisol</span>' +
    '<span><svg viewBox="0 0 30 8" width="30" height="8" aria-hidden="true"><line x1="1" y1="4" x2="29" y2="4" class="hm-lg3"/></svg> growth hormone</span>' +
    '<span><i class="hm-sw" aria-hidden="true"></i> exam and deep sleep</span></p></div>' +
    '<p class="hm-cap" id="hm-cap" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div id="hm-mode"></div><div id="hm-axc" class="hm-ctl"><div id="hm-io"></div><div id="hm-cond"></div><p class="tiny muted hm-cn" id="hm-cn"></p><div id="hm-pill"></div></div>' +
    '<div id="hm-tc" class="hm-ctl"><div class="hm-scrub"><label for="hm-time">Time: <output id="hm-tout"></output></label>' +
    '<input type="range" id="hm-time" min="0" max="1440" step="1" data-k="hmtime"><p class="tiny muted">Arrow keys move 15 minutes; hold Shift for 1 hour.</p></div>' +
    '<div class="hm-ev" role="group" aria-label="Jump to an event">' + C.events.map(function(e){ return '<button type="button" class="btn ghost sm" data-ev="' + e.id + '" data-k="ev' + e.id + '">' + e.t + "</button>"; }).join("") + "</div></div></div>" +
    '<div class="pg-read"><div id="hm-axr"><div class="hm-gauge"><svg id="hm-gauge" viewBox="0 0 240 146" role="img" focusable="false"></svg></div><div class="hm-sym" id="hm-sym" aria-live="polite"></div>' +
    '<div class="tbl-wrap" id="hm-labw" aria-live="polite"></div><dl class="read" id="hm-read" aria-live="polite"></dl></div>' +
    '<div id="hm-tr"><dl class="read" id="hm-tread" aria-live="polite"></dl></div><p class="tiny hm-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div></div>";
  var svg = $("#hm-chain", host), gEl = $("#hm-gauge", host), readEl = $("#hm-read", host), capEl = $("#hm-cap", host), range = $("#hm-time", host);
  var modeR = radios($("#hm-mode", host), { label:"Mode", key:"m", options:C.modes.map(function(m){ return { id:m[0], t:m[1] }; }), value:S.mode, onChange:function(v){ setMode(v); } });
  var ioR = radios($("#hm-io", host), { label:"Iodine intake", key:"i", options:C.iodine.map(function(m){ return { id:m[0], t:m[1] }; }), value:S.io, onChange:function(v){ change({ io:v }); } });
  var cdR = radios($("#hm-cond", host), { label:"Gland condition", key:"c", options:C.conds.map(function(m){ return { id:m[0], t:m[1] }; }), value:S.cond, onChange:function(v){ change({ cond:v }); } });
  var plR = radios($("#hm-pill", host), { label:"Thyroid hormone pill (% of a normal day’s hormone)", aria:"Thyroid hormone pill", key:"p", cls:"chips", options:C.pills.map(function(v){ return { id:String(v), t:String(v) }; }), value:String(S.pill), onChange:function(v){ change({ pill:+v }); } });
  function setCap(t){ capEl.textContent = MV.plain(t || ""); }
  function syncCtrl(){ modeR.set(S.mode); ioR.set(S.io); cdR.set(S.cond); plR.set(String(S.pill)); $("#hm-cn", host).textContent = C.condNote[S.cond]; }
  function srText(r){ return CN[S.cond] + ", iodine " + NM[S.io].toLowerCase() + ", pill " + r.pill + "%: TRH " + r.trh + "%, TSH " + r.tsh + "%, own thyroid output " + r.own + "%, total T₃/T₄ " + r.tot + "%, thyroid " + (r.goitre ? "enlarged (goitre)" : "normal size") + "."; }
  function paintChain(ph){ svg.innerHTML = chainSVG({ L:cur, ph:ph, sc:cur.sc, io:NM[S.io], cond:S.cond, condName:CN[S.cond], showPill:true }); }
  function paintGauge(){ gEl.innerHTML = gaugeSVG(cur.tot); }
  function paintRead(){
    var r = model(), b = band(r.tot), sy = C.symptoms[b];
    svg.setAttribute("aria-label", "Thyroid axis chain. " + srText(r) + " Feedback arrows from T₃/T₄ to the pituitary and hypothalamus are " + (r.tot > 100 ? "strong" : r.tot === 100 ? "steady" : "weak") + ".");
    gEl.setAttribute("aria-label", "Metabolic-rate gauge: " + r.tot + "%, " + b + ".");
    $("#hm-sym", host).innerHTML = '<span class="hm-symb hm-fl-' + b + '">' + (b === "normal" ? "Metabolic rate normal" : "Metabolic rate " + sy.split(":")[0].toLowerCase()) + "</span>" + (b === "normal" ? "" : "<span>" + sy.split(": ")[1] + "</span>");
    $("#hm-labw", host).innerHTML = labHTML(r);
    readEl.innerHTML = MV.readoutHTML([
      ["TRH", r.trh + "% (" + trhWord(r.trh) + ")"], ["TSH", r.tsh + "% (" + tshWord(r.tsh) + ")"], ["Own thyroid output", r.own + "%"], ["Pill", r.pill + "%"],
      ["Total T₃/T₄", "<strong>" + r.tot + "%</strong> (" + b + ")"], ["Metabolic rate", r.tot + "%" + (b === "normal" ? " (normal)" : ": " + sy.split(": ")[1])],
      ["Thyroid size", r.goitre ? "Enlarged (goitre)" : "Normal"], ["Feedback", r.tot > 100 ? C.feedback.strong : r.tot === 100 ? C.feedback.even : C.feedback.weak]]);
  }
  function paintTime(){
    var h = 6 + S.tmin / 60;
    range.value = String(S.tmin); range.setAttribute("aria-valuetext", hhmm(h)); $("#hm-tout", host).textContent = hhmm(h);
    $("#hm-tread", host).innerHTML = MV.readoutHTML([["Time", hhmm(h)], ["Epinephrine (adrenal medulla)", xv(EPI(h))], ["Cortisol (adrenal cortex)", xv(COR(h))], ["Growth hormone (anterior pituitary)", xv(GH(h))], ["Happening now", nowEvent(h)]]);
    if (tl) tl.render();
  }
  function setMode(m){
    stopAnim(); S.mode = m; upto = null; api.save(); paintMode(); MV.changed();
    setCap(m === "axis" ? srText(model()) : "Scrub through the day, or jump to an event, and read the hormone curves.");
  }
  function paintMode(){
    var ax = S.mode === "axis";
    syncCtrl();
    $("#hm-axv", host).hidden = !ax; $("#hm-axc", host).hidden = !ax; $("#hm-axr", host).hidden = !ax;
    $("#hm-tv", host).hidden = ax; $("#hm-tc", host).hidden = ax; $("#hm-tr", host).hidden = ax;
    if (!ax && !tl) { tl = new MV.Plot($("#hm-tl", host), { xmin:5.2, xmax:30.4, ymin:-1, ymax:11.4 }); tl.render = function(){ drawTimeline(tl, S.tmin, upto); }; }
    if (ax) { paintChain(0.5); paintGauge(); paintRead(); } else paintTime();
  }
  function stopAnim(){
    if (anim) { anim(); anim = null; }
    cur = lv(model()); upto = null;
    readEl.setAttribute("aria-live", "polite");
    if (pend) { var d = pend; pend = null; if (S.mode === "axis") { paintChain(0.5); paintGauge(); paintRead(); } else paintTime(); d(); }
  }
  // settle from the shown levels to the new steady state: flows thicken or thin, dots move, the gland grows or shrinks
  function change(patch, dur, fin){
    stopAnim();
    var from = Object.assign({}, cur);
    Object.keys(patch).forEach(function(k){ S[k] = patch[k]; });
    api.save(); syncCtrl(); MV.changed();
    var to = lv(model());
    readEl.setAttribute("aria-live", "off");
    setCap(srText(model()));
    anim = MV.tween({ dur:dur || 1100, step:function(k){ Object.keys(to).forEach(function(q){ cur[q] = lerp(from[q], to[q], k); }); paintChain((0.5 + k * 3) % 1); paintGauge(); },
      done:function(){ anim = null; cur = to; paintChain(0.5); paintGauge(); readEl.setAttribute("aria-live", "polite"); paintRead(); if (fin) fin(); } });
  }
  function setTime(m){ stopAnim(); S.tmin = clamp(Math.round(m), 0, 1440); api.save(); paintTime(); MV.changed(); }
  range.addEventListener("input", function(){ setTime(+range.value); });
  range.addEventListener("keydown", function(e){
    var d = (e.key === "ArrowRight" || e.key === "ArrowUp") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowDown") ? -1 : 0; if (!d) return;
    e.preventDefault(); setTime(S.tmin + d * (e.shiftKey ? 60 : 15));
  });
  $(".hm-ev", host).addEventListener("click", function(e){ var b = e.target.closest("[data-ev]"); if (!b) return; var ev = byId(C.events, b.dataset.ev); setTime(ev.at); setCap(ev.t + ": " + nowEvent(6 + ev.at / 60) + "."); });
  paintMode();
  setCap(S.mode === "axis" ? srText(model()) : "Scrub through the day, or jump to an event, and read the hormone curves.");

  function chal(id){
    var c = byId(C.challenges, id), W = c.wrong, r = model();
    if (S.mode !== "axis") return { ok:false, msg:W.mode };
    if (id === "tc1") {
      if (S.cond !== "healthy" || S.pill !== 0) return { ok:false, msg:W.only };
      if (S.io === "adeq") return { ok:false, msg:W.adeq };
      return { ok:true };
    }
    if (id === "tc2") {
      if (S.cond !== "dam" || S.io !== "adeq") return { ok:false, msg:W.setup };
      if (r.tot === 100 && r.tsh < 100) return { ok:true };
      if (S.pill === 50) return { ok:false, msg:W.p50 };
      if (S.pill === 125) return { ok:false, msg:W.p125 };
      return { ok:false, msg:"Total " + r.tot + "%, TSH " + r.tsh + "%. " + (r.tot !== 100 ? "The total must be exactly 100%." : "TSH must stay below 100%.") };
    }
    if (id === "tc3") {
      if (S.cond === "graves" && S.io === "adeq" && S.pill === 0) return { ok:true };
      if (S.cond === "healthy" && S.pill === 150) return { ok:false, msg:W.pill150 };
      if (S.cond === "healthy" && r.tsh >= 200) return { ok:false, msg:W.lowio };
      if (S.cond === "graves" && S.io !== "adeq" && S.pill === 0) return { ok:false, msg:W.graveslow.replace("60%", r.tot + "%") };
      return { ok:false, msg:W.other };
    }
    return { ok:false };
  }

  return {
    predict:{
      start:function(p){
        stopAnim();
        Object.keys(p.start).forEach(function(k){ S[k] = p.start[k]; });
        cur = lv(model()); api.save();
        if (p.sweep) upto = S.tmin;
        paintMode(); MV.changed();
        setCap(p.sweep ? "09:59. Watch the curves when the scare comes." : srText(model()));
      },
      run:function(p, done){
        pend = done;
        function fin(){ var d = pend; pend = null; upto = null; if (S.mode === "time") paintTime(); setCap(p.reveal + (S.mode === "axis" ? " " + srText(model()) : "")); MV.changed(); if (d) MV.wait(350, d); }
        if (p.sweep) {
          var a = S.tmin, b = 252, c2 = 630;
          setCap(p.reveal);
          anim = MV.tween({ dur:2800, ease:lin, step:function(k){ S.tmin = Math.round(lerp(a, b, k)); upto = S.tmin; paintTime(); }, done:function(){
            anim = MV.tween({ dur:2400, ease:lin, step:function(k){ S.tmin = Math.round(lerp(b, c2, k)); upto = S.tmin; paintTime(); }, done:function(){ anim = null; api.save(); fin(); } });
          } });
        } else {
          pend = null;
          change(p.to, 2200, function(){ pend = done; fin(); });
          pend = done;
          setCap(p.reveal);
        }
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: Hormones and performance ----------
// @component steroidMech — "Zoom to the molecules": steroid molecules (testosterone role, --bio-atp) cross a muscle cell's
// membrane, bind receptors, and a protein chain (amino-acid beads, --bio-carbon) grows. viewBox 420 × 150; k = 0–1.
function mechSVG(k){
  var h = sv("rect", { x:120, y:14, width:290, height:124, rx:22, "class":"hm-cell" }) + txt(398, 32, "muscle cell", "hm-sm", "end") + txt(14, 32, "blood", "hm-sm");
  var R = [[190, 66], [250, 66], [310, 66]], i;
  R.forEach(function(p){ h += sv("path", { d:"M" + (p[0] - 12) + " " + (p[1] - 10) + "v12a12 12 0 0 0 24 0v-12", "class":"hm-rec" }); });
  h += txt(250, 96, "receptors", "hm-sm", "middle");
  for (i = 0; i < 3; i++) {
    var s0 = [40 + i * 26, 60 + (i % 2) * 22], t = seg(k, i * 0.08, 0.45 + i * 0.08), x = lerp(s0[0], R[i][0], t), y = lerp(s0[1], R[i][1] - 2, t);
    h += sv("rect", { x:x - 8, y:y - 6, width:16, height:12, rx:4, "class":"hm-ster" });
  }
  var nb = Math.round(seg(k, 0.55, 1) * 12);
  for (i = 0; i < nb; i++) h += sv("circle", { cx:170 + i * 18, cy:118, r:6, "class":"hm-aa" });
  if (nb) h += txt(170, 108, "protein synthesis ↑", "hm-sm");
  return h + txt(14, 132, "steroid", "hm-sm") + sv("rect", { x:56, y:124, width:16, height:12, rx:4, "class":"hm-ster" });
}
function part3(host, api){
  var C = api.content, S = api.S, A = C.steroid, E = C.epo, G = C.gh, R = C.rules, Q = C.cer;
  S.st1 = S.st1 || {}; if (S.epo == null) S.epo = "none"; S.cer = S.cer || { claim:null, ev:[], re:[] };
  var busy = false;
  host.innerHTML = '<div class="hm-p3">' +
    '<div class="hm-st"><h3>' + A.title + '</h3><p>' + A.mech + '</p><div class="hm-mstage"><svg id="hm-msvg" viewBox="0 0 420 150" role="img" focusable="false" aria-label="Steroid molecules enter a muscle cell, bind receptors, and a chain of amino acids grows: protein synthesis increases."></svg></div>' +
      '<div class="q-actions" id="hm-mbtn"></div>' +
      '<details class="alg" open><summary>' + A.panel + "</summary><p>" + A.dataIntro + '</p><div class="tbl-wrap"><table class="hm-sdt" id="hm-sdt"></table></div><p class="tiny"><span class="bio-model">Model data</span> ' + A.note + "</p>" +
      '<div class="q hm-sq" id="hm-sq1"></div><div class="q hm-sq" id="hm-sq2"></div></details>' +
      "<h4>" + A.risksTitle + '</h4><ul class="hm-cards">' + A.risks.map(function(r){ return "<li>" + r + "</li>"; }).join("") + '</ul><p class="tiny muted">' + A.link + "</p></div>" +
    '<div class="hm-st"><h3>' + E.title + "</h3><p>" + E.intro + '</p><div id="hm-epo"></div><div class="hm-ebar" id="hm-ebar" role="img"><i class="hm-ez"></i><i class="hm-ef"></i><span class="hm-ezl">' + E.zone + '</span></div><p class="tiny hm-escale"><span>0%</span><span>55%</span><span>70%</span></p>' +
      '<dl class="read" id="hm-eread" aria-live="polite"></dl><p class="tiny"><span class="bio-model">Model</span> ' + E.note + "</p></div>" +
    '<div class="hm-st"><h3>' + G.title + '</h3><dl class="hm-ce"><div><dt>Claim</dt><dd>“' + G.claim + '”</dd></div><div><dt>Evidence</dt><dd>' + G.evidence + "</dd></div><div><dt>Risks</dt><dd>" + G.risks + "</dd></div></dl></div>" +
    '<div class="hm-st"><h3>' + R.title + '</h3><ul class="hm-cards">' + R.items.map(function(r){ return "<li>" + r + "</li>"; }).join("") + "</ul></div>" +
    '<div class="hm-st hm-cer"><h3>' + Q.title + '</h3><p class="hm-cerq"><strong>' + Q.prompt + "</strong></p><p class=\"how\">" + Q.how + '</p><div id="hm-cerb"></div><div class="q-actions"><button type="button" class="btn primary" id="hm-cerchk" data-k="hmcer">Check my argument</button></div><div id="hm-cerfb" aria-live="polite"></div></div></div>';

  // Station 1: mechanism animation
  var msvg = $("#hm-msvg", host);
  function paintM(){ var b = $("#hm-mbtn", host); MV.keepFocus(b, function(){ b.innerHTML = '<button type="button" class="btn ghost sm" data-k="hmplay"' + (busy ? " disabled" : "") + ">" + (S.st1.played ? A.replay : A.play) + "</button>"; }); }
  $("#hm-mbtn", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    busy = true; paintM();
    MV.tween({ dur:3200, ease:lin, step:function(k){ msvg.innerHTML = mechSVG(k); }, done:function(){ busy = false; S.st1.played = true; api.save(); msvg.innerHTML = mechSVG(1); paintM(); } });
  });
  msvg.innerHTML = mechSVG(S.st1.played ? 1 : 0); paintM();
  // Station 1: tap a row and a column of the data table
  function paintTable(){
    var t = $("#hm-sdt", host), st = S.st1;
    var h = '<caption class="vh">Steroid use data, model values, % of pre-use levels. Row and column headings are buttons.</caption><thead><tr><th scope="col">' + A.head[0] + "</th>" +
      A.head.slice(1).map(function(c, j){ var on = st.col === j; return '<th scope="col"' + (on ? ' class="hm-on"' : "") + '><button type="button" class="hm-tb" data-col="' + j + '" data-k="hmcol' + j + '" aria-pressed="' + on + '">' + c + "</button></th>"; }).join("") + "</tr></thead><tbody>" +
      A.rows.map(function(r, i){ var on = st.row === i; return "<tr" + (on ? ' class="hm-on"' : "") + '><th scope="row"><button type="button" class="hm-tb" data-row="' + i + '" data-k="hmrow' + i + '" aria-pressed="' + on + '">' + r[0] + "</button></th>" +
        r.slice(1).map(function(v, j){ return "<td" + (st.col === j ? ' class="hm-on"' : "") + ">" + v + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody>";
    MV.keepFocus(t, function(){ t.innerHTML = h; });
    [["#hm-sq1", A.askRow, st.row, A.rowFb], ["#hm-sq2", A.askCol, st.col, A.colFb]].forEach(function(q, n){
      var fb = q[2] == null ? "" : MV.fbHTML(MV.ok(q[3][q[2]]) ? "good" : "bad", (MV.ok(q[3][q[2]]) ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + q[3][q[2]].t);
      $(q[0], host).innerHTML = '<div class="q-head"><span class="qn" aria-hidden="true">' + (n + 1) + '</span><div class="q-prompt">' + q[1] + "</div></div>" + fb;
    });
  }
  $("#hm-sdt", host).addEventListener("click", function(e){
    var b = e.target.closest(".hm-tb"); if (!b) return;
    if (b.dataset.row != null) S.st1.row = +b.dataset.row; else S.st1.col = +b.dataset.col;
    api.save(); paintTable(); MV.focusFb($(b.dataset.row != null ? "#hm-sq1" : "#hm-sq2", host));
  });
  paintTable();
  // Station 2: EPO
  function paintEpo(){
    var L = E.levels.filter(function(l){ return l[0] === S.epo; })[0] || E.levels[0], hct = L[2], zone = hct > 55 ? "in the clot-risk zone" : hct === 55 ? "at the edge of the clot-risk zone" : "below the clot-risk zone";
    var bar = $("#hm-ebar", host);
    bar.querySelector(".hm-ef").style.width = f1(hct / 70 * 100) + "%";
    bar.setAttribute("aria-label", "Blood thickness bar: red cells " + hct + "% of the blood, " + zone + " (above 55%).");
    $("#hm-eread", host).innerHTML = MV.readoutHTML([["Share of blood that is red cells", "<strong>" + hct + "%</strong>"], ["Oxygen delivery", L[3]], ["Blood thickness", zone]]);
  }
  radios($("#hm-epo", host), { label:E.label, key:"epo", options:E.levels.map(function(l){ return { id:l[0], t:l[1] }; }), value:S.epo, onChange:function(v){ S.epo = v; api.save(); paintEpo(); } });
  paintEpo();
  // @component S12 cerBuilder — claim (pick one), evidence and reasoning chips (toggle), a live argument preview and a rule-based check
  var cfb = $("#hm-cerfb", host);
  function chip(grp, it, on){ return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-g="' + grp + '" data-id="' + it.id + '" data-k="cer' + it.id + '">' + it.t + "</button>"; }
  function paintCer(){
    var c = S.cer, box = $("#hm-cerb", host);
    function sel(list, ids){ return list.filter(function(x){ return ids.indexOf(x.id) >= 0; }).map(function(x){ return x.t; }); }
    var cl = c.claim ? byId(Q.claims, c.claim).t : "", ev = sel(Q.evidence, c.ev), re = sel(Q.reasoning, c.re);
    var h = '<div class="hm-cg"><h4>Claim</h4><div class="chips" role="group" aria-label="Claim (choose one)">' + Q.claims.map(function(x){ return chip("c", x, c.claim === x.id); }).join("") + "</div></div>" +
      '<div class="hm-cg"><h4>Evidence</h4><div class="chips" role="group" aria-label="Evidence chips">' + Q.evidence.map(function(x){ return chip("e", x, c.ev.indexOf(x.id) >= 0); }).join("") + "</div></div>" +
      '<div class="hm-cg"><h4>Reasoning</h4><div class="chips" role="group" aria-label="Reasoning chips">' + Q.reasoning.map(function(x){ return chip("r", x, c.re.indexOf(x.id) >= 0); }).join("") + "</div></div>" +
      '<div class="hm-arg" aria-live="polite"><h4>Your argument</h4><p><strong>Claim:</strong> ' + (cl || '<span class="muted">choose a claim</span>') + "</p><p><strong>Evidence:</strong> " + (ev.join(" ") || '<span class="muted">tap evidence chips</span>') +
      "</p><p><strong>Reasoning:</strong> " + (re.join(" ") || '<span class="muted">tap reasoning chips</span>') + "</p></div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  $("#hm-cerb", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-g]"); if (!b) return;
    var c = S.cer, id = b.dataset.id, g = b.dataset.g;
    if (g === "c") c.claim = c.claim === id ? null : id;
    else { var L = g === "e" ? c.ev : c.re, i = L.indexOf(id); if (i >= 0) L.splice(i, 1); else L.push(id); }
    api.save(); cfb.innerHTML = ""; paintCer();
  });
  function judge(){
    var c = S.cer, F = Q.fb, kinds = [];
    c.ev.forEach(function(id){ kinds.push(byId(Q.evidence, id).kind); }); c.re.forEach(function(id){ kinds.push(byId(Q.reasoning, id).kind); });
    if (!c.claim) return [false, F.noClaim];
    if (kinds.length && kinds.every(function(k){ return k === "opinion"; })) return [false, F.onlyOpinion];
    if (!c.ev.length || !c.re.length) return [false, F.noEv];
    if (kinds.indexOf("opinion") >= 0) return [false, F.opinion];
    if (!byId(Q.claims, c.claim).good) return [false, F.badClaim];
    if (kinds.indexOf("off") >= 0) return [false, F.off];
    if (kinds.indexOf("risk") < 0) return [false, F.noRisk];
    if (kinds.indexOf("rule") < 0) return [false, F.noRule];
    return [true, F.good];
  }
  $("#hm-cerchk", host).addEventListener("click", function(){
    var r = judge(); S.cer.done = S.cer.done || r[0]; api.save();
    cfb.innerHTML = MV.fbHTML(r[0] ? "good" : "bad", r[0] ? r[1] : "<strong>✗ Not yet.</strong> " + r[1]);
    MV.focusFb(cfb);
  });
  paintCer();
}

// ---------- Performance task: Restore the balance (condition fixed at Damaged; iodine + pill chips; live chain, gauge, lab card) ----------
var task = (function(){
  var api = null, IO = [["vlow", "Very low"], ["low", "Low"], ["adeq", "Adequate"]], PILLS = [0, 25, 50, 60, 75, 100, 125, 150];
  function ioName(id){ return IO.filter(function(x){ return x[0] === id; })[0][1]; }
  function st(){ var s = api.S; if (s.io == null) s.io = "vlow"; if (s.pill == null) s.pill = 0; return s; }
  function read(){ if (!api) return { io:"vlow", pill:0 }; var s = st(); return { io:s.io, pill:+s.pill }; }
  function draw(){
    var d = read(), r = thy(d.io, "dam", d.pill), t = $("#hm-tsvg"); if (!t) return;
    t.innerHTML = chainSVG({ L:{ trh:r.trh, tsh:r.tsh, own:r.own, pill:r.pill, tot:r.tot }, sc:r.goitre ? 1.4 : 1, io:ioName(d.io), cond:"dam", condName:"Damaged gland", showPill:true });
    t.setAttribute("aria-label", "Model patient, damaged gland, iodine " + ioName(d.io).toLowerCase() + ", pill " + r.pill + "%: TRH " + r.trh + "%, TSH " + r.tsh + "%, own thyroid output " + r.own + "%, total T₃/T₄ " + r.tot + "%, thyroid " + (r.goitre ? "enlarged" : "normal size") + ".");
    var g = $("#hm-tg"); g.innerHTML = gaugeSVG(r.tot); g.setAttribute("aria-label", "Metabolic-rate gauge: " + r.tot + "%, " + band(r.tot) + ".");
    $("#hm-tlab").innerHTML = labHTML(r);
    $("#hm-tread").innerHTML = MV.readoutHTML([["Own thyroid output", r.own + "%"], ["TSH", r.tsh + "%"], ["Total T₃/T₄", "<strong>" + r.tot + "%</strong>"]]);
  }
  function parse(k){ var m = /^(vlow|low|adeq)-(\d+)$/.exec(k) || [0, "low", 0]; return { io:m[1], pill:+m[2] }; }
  function lab(k){ var q = parse(k); return "Iodine " + ioName(q.io) + ", pill " + q.pill + "%"; }
  return {
    render:function(inp, pv, a){
      api = a; var s = st();
      inp.innerHTML = '<div class="hm-tin"><p class="tiny muted">Gland condition: <strong>Damaged</strong> (fixed).</p><div id="hm-tio"></div><div id="hm-tpl"></div></div>';
      function upd(){ a.save(); draw(); a.update(); }
      radios($("#hm-tio"), { label:"Iodine intake", key:"tio", options:IO.map(function(x){ return { id:x[0], t:x[1] }; }), value:s.io, onChange:function(v){ s.io = v; upd(); } });
      radios($("#hm-tpl"), { label:"Pill dose (%)", aria:"Pill dose", key:"tpl", cls:"chips", options:PILLS.map(function(v){ return { id:String(v), t:String(v) }; }), value:String(s.pill), onChange:function(v){ s.pill = +v; upd(); } });
      pv.innerHTML = '<div class="hm-tpv"><h4>Live readouts</h4><div class="hm-stage"><svg id="hm-tsvg" viewBox="0 0 400 456" role="img" focusable="false"></svg></div>' +
        '<div class="hm-gauge"><svg id="hm-tg" viewBox="0 0 240 146" role="img" focusable="false"></svg></div><div class="tbl-wrap" id="hm-tlab"></div><dl class="read" id="hm-tread" aria-live="polite"></dl></div>';
      draw();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var r = thy(d.io, "dam", d.pill); return [r.tot >= 90 && r.tot <= 110, r.tsh <= 100, r.own > 0, d.io !== "vlow"]; },
    key:function(d){ return d.io + "-" + d.pill; },
    label:lab,
    text:lab
  };
})();

// ---------- hero: TRH flows → TSH flows, thyroid glows, T₃/T₄ released → metabolic rate rises → "−" arrows pulse, flows thin ----------
function hero(f){
  var box = $("#hm-hero"); if (!box) return;
  var cap = f && f.cap, last = -1;
  box.innerHTML = '<svg viewBox="0 0 400 456" aria-hidden="true" focusable="false"></svg>';
  var svg = $("svg", box);
  var CAPS = ["The hypothalamus releases TRH, which flows to the anterior pituitary.", "TSH travels to the thyroid, which releases T₃ and T₄.",
    "T₃ and T₄ raise the body’s metabolic rate to normal.", "Enough hormone? The chain eases off."];
  function setCap(i){ if (cap && i !== last) { cap.textContent = CAPS[i]; last = i; } }
  function frame(o){ svg.innerHTML = chainSVG(o); }
  function finalFrame(){ frame({ L:{ trh:100, tsh:100, own:100, pill:0, tot:100 }, bar:100 }); setCap(3); }
  if (MV.reduceMotion) { finalFrame(); return; }
  function frameAt(T){
    var ph = (T * 0.9) % 1, L = { trh:200, tsh:250, own:100, pill:0, tot:100 }, a = { trh:1, tsh:1, t:1, fb:0.15 }, bar = 100, glow = false, pulse = 0;
    if (T < 2.2) { a.trh = seg(T, 0, 0.4); a.tsh = 0.12; a.t = 0.12; bar = 0; setCap(0); }
    else if (T < 4.6) { a.tsh = Math.max(0.12, seg(T, 2.2, 2.6)); glow = T > 3; a.t = Math.max(0.12, seg(T, 3.2, 3.8)); bar = 0; setCap(1); }
    else if (T < 6.2) { glow = T < 5; bar = 100 * seg(T, 4.6, 5.8); setCap(2); }
    else { var d = seg(T, 6.6, 8.4); a.fb = Math.max(0.15, seg(T, 6.2, 6.6)); pulse = T < 8.6 ? Math.pow(Math.sin((T - 6.2) * Math.PI * 1.25), 2) : 0; L.trh = lerp(200, 100, d); L.tsh = lerp(250, 100, d); setCap(3); }
    frame({ L:L, a:a, ph:ph, glow:glow, pulse:pulse, bar:bar });
  }
  frameAt(0);
  MV.tween({ dur:9400, ease:lin, step:function(k){ frameAt(k * 9.4); }, done:finalFrame });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
