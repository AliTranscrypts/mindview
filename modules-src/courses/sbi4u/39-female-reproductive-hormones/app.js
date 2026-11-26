// SBI4U 39 Female Reproductive Hormones: hero (28-day sweep), 28-day cycle timeline (S11 timeline graph + S8 feedback view;
// Normal cycle / Pregnancy / Feedback switches / Pill), "Hormones as medicine" (pill data taps, IVF step-through,
// S12 claim–evidence–reasoning builder), "Read the cycle" custom activity, "Design a model hormone schedule" task.
// Roles: FSH --bio-nadh (teal), LH --bio-e (violet), estrogen --bio-h (magenta), progesterone --bio-carbon (brown),
// hCG --bio-fadh (cerulean); endometrium --ink-2; synthetic hormones --ink dashed. Diagrams are schematic only.
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
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "fr-ax", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function ln(x1, y1, x2, y2, cls){ return sv("line", { x1:x1, y1:y1, x2:x2, y2:y2, "class":cls }); }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function n0(v){ return MV.num(Math.round(v)); }
function head(x1, y1, x2, y2, cls){ // arrowhead at (x2, y2) pointing along the segment
  var a = Math.atan2(y2 - y1, x2 - x1), s = 7;
  return sv("polygon", { points:f1(x2) + "," + f1(y2) + " " + f1(x2 - s * Math.cos(a - 0.45)) + "," + f1(y2 - s * Math.sin(a - 0.45)) + " " + f1(x2 - s * Math.cos(a + 0.45)) + "," + f1(y2 - s * Math.sin(a + 0.45)), "class":cls || "fr-ah" });
}
function arrow(x1, y1, x2, y2, cls){ return ln(x1, y1, x2, y2, "fr-arr " + (cls || "")) + head(x1, y1, x2, y2); }

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
// @component stepper (from SBI4U 19 / 15 / 08) — − / + buttons around a live value: stepper(host, {id, label, min, max, value, unit(v), onChange(v)}) -> {set(v), disable(b)}
function stepper(host, o){
  var v = o.value, off = false, nm = MV.plain(o.label);
  host.innerHTML = '<span class="rg-wrap"><span class="rg-lab" id="' + o.id + '-l">' + o.label + '</span><span class="fr-stp" role="group" aria-labelledby="' + o.id + '-l">' +
    '<button type="button" class="fr-stb" data-d="-1" data-k="' + o.id + 'm" aria-label="' + MV.esc("Decrease " + nm) + '">−</button><output id="' + o.id + '" aria-live="polite"></output>' +
    '<button type="button" class="fr-stb" data-d="1" data-k="' + o.id + 'p" aria-label="' + MV.esc("Increase " + nm) + '">+</button></span></span>';
  var out = $("#" + o.id, host);
  function paint(){ out.textContent = o.unit ? o.unit(v) : v; $$("[data-d]", host).forEach(function(b){ b.disabled = off || (+b.dataset.d < 0 ? v <= o.min : v >= o.max); }); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-d]"); if (!b || b.disabled) return; v = clamp(v + (+b.dataset.d), o.min, o.max); paint(); o.onChange(v); });
  paint();
  return { set:function(x){ v = x; paint(); }, disable:function(b){ off = b; paint(); } };
}

// ---------- the model cycle (plan §4: listed values, linear between them; deterministic rules) ----------
var K4 = ["fsh", "lh", "est", "prog"], K5 = K4.concat(["hcg"]), KV = ["fsh", "lh", "est", "prog", "endo"];
function md(){ return MV.C.explore.model; }
function tab(k, d){ // value on day d (wraps into the next cycle after day 28)
  var m = md(), D = m.days, V = m[k], i;
  d = ((d - 1) % 28 + 28) % 28 + 1;
  if (d <= D[0]) return V[0];
  for (i = 1; i < D.length; i++) if (d <= D[i]) return lerp(V[i - 1], V[i], (d - D[i - 1]) / (D[i] - D[i - 1]));
  return V[V.length - 1];
}
function hcgAt(d){
  var H = md().hcg, i; if (d < H[0][0]) return null;
  for (i = 1; i < H.length; i++) if (d <= H[i][0]) return lerp(H[i - 1][1], H[i][1], (d - H[i - 1][0]) / (H[i][0] - H[i - 1][0]));
  return H[H.length - 1][1];
}
function newR(N, mode){
  var r = { N:N, mode:mode, v:{ fsh:[], lh:[], est:[], prog:[], endo:[], hcg:[], synE:[], synP:[] }, shed:[], ovP:[], utP:[], st:[], sign:[], fb:[], ev:[] };
  return r;
}
function put(r, d, v){ KV.forEach(function(k){ r.v[k][d] = v[k]; }); }
function fromTab(d){ var v = {}; KV.forEach(function(k){ v[k] = tab(k, d); }); return v; }

// @component S11 cycleModel — normal cycle and Feedback switches: c = {pf, rOn, R, dOn, D}
function simCycle(c, mode){
  var FB = MV.C.explore.feedback, pf = c.pf !== false, Rd = c.rOn ? c.R : 0, Dd = c.dOn ? c.D : 0, N = 28, d;
  var r = newR(N, mode || "normal");
  var ov = pf ? 14 : (Dd >= 12 && Dd <= 15 ? Dd + 1 : null), s = ov ? ov - 14 : 0, bd = ov ? 25 + s : null;
  var rem = ov && Rd && Rd > ov && Rd < bd ? Rd : null, mens = ov ? (rem ? rem + 4 : 29 + s) : null;
  r.ov = ov; r.s = s; r.bd = bd; r.rem = rem; r.mens = mens; r.pf = pf; r.D = Dd; r.R = Rd;
  for (d = 1; d <= N; d++) {
    var v;
    if (ov && d >= ov) v = fromTab(d - s);
    else if (pf || d <= 12) v = fromTab(d);
    else v = { fsh:22, lh:d === 13 ? 25 : 18, prog:2, endo:10, est:ov || d <= 13 ? 70 : lerp(70, 30, clamp((d - 13) / 8, 0, 1)) };
    put(r, d, v);
  }
  if (Dd) { r.v.lh[Dd] = Math.max(r.v.lh[Dd], 95); if (Dd < N && !(ov && Dd + 1 === ov)) r.v.lh[Dd + 1] = Math.max(r.v.lh[Dd + 1], 40); }
  if (rem) {
    var P0 = r.v.prog[rem], E0 = r.v.est[rem], L0 = r.v.endo[rem], F2 = r.v.fsh[Math.min(N, rem + 2)];
    for (d = rem; d <= N; d++) {
      var k = clamp((d - rem) / 2, 0, 1);
      r.v.prog[d] = lerp(P0, 2, k); r.v.est[d] = lerp(E0, 12, k);
      r.v.endo[d] = d < mens ? L0 : lerp(L0, 2, clamp((d - mens) / 4, 0, 1));
      if (d > rem + 2) r.v.fsh[d] = lerp(F2, 30, clamp((d - rem - 2) / 4, 0, 1));
    }
  }
  for (d = 1; d <= N; d++) {
    var shed = d <= 5 || (mens && d >= mens && d <= mens + 4);
    r.shed[d] = !!shed;
    r.ovP[d] = mens && d >= mens ? "nxt" : !ov ? (d <= 13 ? "fol" : "none") : d < ov ? "fol" : d === ov ? "ovu" : "lut";
    r.utP[d] = shed ? "men" : mens && d > mens + 4 ? "pro" : ov && d > ov ? "sec" : "pro";
    var st, sg = "−", fb;
    if (mens && d >= mens) st = "next";
    else if (ov && d === ov) st = "ovu";
    else if (ov && d > ov) st = rem && d >= rem ? "rem" : d >= bd ? "brk" : "cl";
    else if (d <= 6) st = "dev";
    else if (d <= 12) st = "dom";
    else if (ov) st = r.v.lh[d] >= 80 ? "matS" : "mat";
    else st = d <= 15 ? "wait" : "deg";
    if (mens && d >= mens) fb = FB.neg;
    else if (ov && d > ov) fb = rem && d >= rem ? FB.rem : d >= bd ? FB.brk : FB.lut;
    else if (ov && d === ov) { fb = pf ? FB.ovu : FB.ovuP; sg = pf ? "+" : "−"; }
    else if (d <= 11) fb = FB.neg;
    else if (!pf) fb = FB.off;
    else if (d === 12) { fb = FB.flip; sg = "+"; }
    else { fb = FB.pos; sg = "+"; }
    if (Dd && d === Dd) fb = FB.pulse + (pf ? "" : Dd < 12 ? FB.pulseEarly : Dd > 15 ? FB.pulseLate : FB.pulseOk) + " " + fb;
    r.st[d] = st; r.sign[d] = sg; r.fb[d] = fb;
  }
  r.ev.push({ d:1, f:"menstruation", t:"Menstruation starts" });
  if (pf) r.ev.push({ d:13, f:"surge", t:"LH surge" });
  if (Dd) r.ev.push({ d:Dd, f:"pulse", t:"LH pulse" });
  if (ov) r.ev.push({ d:ov, f:"ovulation", t:"Ovulation" });
  if (rem) r.ev.push({ d:rem, f:"removed", t:"Corpus luteum removed" });
  else if (ov) r.ev.push({ d:bd, t:"Corpus luteum starts to break down" });
  if (mens) r.ev.push({ d:mens, f:"menstruation", t:"Menstruation starts" });
  return r;
}
// Pregnancy mode: fertilization day 15, implantation day 21, hCG from day 21; 40 days
function simPreg(){
  var FB = MV.C.explore.feedback, base = simCycle({ pf:true }), r = newR(40, "preg"), d;
  for (d = 1; d <= 40; d++) {
    if (d <= 20) { put(r, d, fromTab(d)); ["shed", "ovP", "utP", "st", "sign", "fb"].forEach(function(k){ r[k][d] = base[k][d]; }); }
    else { put(r, d, { fsh:10, lh:10, est:60, prog:70, endo:13 }); r.shed[d] = false; r.ovP[d] = "lut"; r.utP[d] = "sec"; r.st[d] = "clh"; r.sign[d] = "−"; r.fb[d] = FB.preg; }
    r.v.hcg[d] = hcgAt(d);
  }
  r.ov = 14; r.mens = null; r.s = 0;
  var tp = null; for (d = 21; d <= 40; d++) if (r.v.hcg[d] >= md().testAt) { tp = d; break; }
  r.test = tp;
  r.ev = [{ d:1, f:"menstruation", t:"Menstruation starts" }, { d:13, f:"surge", t:"LH surge" }, { d:14, f:"ovulation", t:"Ovulation" },
    { d:15, t:"Fertilization" }, { d:21, f:"implantation", t:"Implantation" }, { d:tp, t:"Pregnancy test turns positive" }];
  return r;
}
// Pill mode: synthetic estrogen E and progestin P (0–3) on days 1–21, placebo days 22–28
function simPill(E, P){
  var FB = MV.C.explore.feedback, d, r;
  E = E || 0; P = P || 0;
  var fA = Math.max(5, 40 - 10 * E - 5 * P), active = E + P > 0, ovul = active && fA >= 15 && P === 0;
  if (!active || ovul) {
    r = simCycle({ pf:true }, "pill");
    for (d = 1; d <= 28; d++) {
      if (ovul && d <= 12) r.v.fsh[d] = fA;
      if (ovul && d <= 21) { r.v.synE[d] = E; r.v.synP[d] = P; }
      r.fb[d] = (active ? FB.pillFail : FB.none) + " " + r.fb[d];
    }
    r.fA = fA; r.E = E; r.P = P; r.active = active;
    return r;
  }
  r = newR(28, "pill");
  for (d = 1; d <= 28; d++) {
    var k = (d - 21) / 7, endo;
    if (d <= 21) {
      endo = P >= 1 ? 5 : d <= 5 ? tab("endo", d) : Math.min(10, tab("endo", d));
      put(r, d, { fsh:fA, lh:12, est:10, prog:2, endo:endo }); r.v.synE[d] = E; r.v.synP[d] = P;
      r.fb[d] = P >= 1 ? FB.pill : FB.pillE;
    } else {
      var b = r.v.endo[21];
      put(r, d, { fsh:lerp(fA, 30, k), lh:lerp(12, 15, k), est:10, prog:2, endo:d <= 23 ? b : lerp(b, 2, (d - 23) / 5) });
      r.fb[d] = FB.placebo;
    }
    r.shed[d] = d >= 24; r.ovP[d] = "pill"; r.utP[d] = d >= 24 ? "bleed" : P >= 1 ? "thin" : "pro"; r.st[d] = "small"; r.sign[d] = "−";
  }
  r.ov = null; r.mens = null; r.s = 0; r.fA = fA; r.E = E; r.P = P; r.active = true;
  r.ev = [{ d:1, t:"First active pill" }, { d:22, t:"Placebo week starts" }, { d:24, f:"bleed", t:"Withdrawal bleed" }];
  return r;
}
function simFor(c){
  return c.mode === "preg" ? simPreg() : c.mode === "pill" ? simPill(c.E, c.P) : c.mode === "switch" ? simCycle(c, "switch") : simCycle({ pf:true }, "normal");
}

// ---------- @component S11 timelineGraph — four hormone curves (+ hCG on a right axis), day marker, event flags,
// ovary strip with schematic icons, endometrium band. cycleSVG(R, {keys, day, upto, cover, ovary, uterus, dots}) -> {svg, h, X} ----------
var GW = 560, GL = 46, GT = 40, GB = 196;
var LCL = { fsh:"fr-l-fsh", lh:"fr-l-lh", est:"fr-l-est", prog:"fr-l-prog", hcg:"fr-l-hcg" };
var OVN = { fol:"Follicular", ovu:"Ovulation", lut:"Luteal", none:"No ovulation", nxt:"Follicular", pill:"No follicle matures" };
var UTN = { men:"Menstrual", pro:"Proliferative", sec:"Secretory", thin:"Thin lining", bleed:"Withdrawal bleed" };
function cw(){ return window.matchMedia && window.matchMedia("(max-width:560px)").matches ? 8.6 : 6.4; }
function cycH(o){ return GB + 24 + (o.ovary !== false ? 42 : 0) + (o.uterus !== false ? 68 : 0); }
function runs(arr, N, up){ var out = [], a = 1; for (var d = 2; d <= up + 1; d++) if (d > up || arr[d] !== arr[a]) { out.push({ a:a, b:d - 1, k:arr[a] }); a = d; } return out; }
function ovIcon(k, cx, cy){
  var h = sv("circle", { cx:cx, cy:cy, r:9, "class":"fr-ov" });
  if (k === "dev" || k === "next" || k === "small") { var rr = k === "small" ? 1.6 : 2.3; [[-3.5, -2], [3, -3], [0, 3.5]].forEach(function(p){ h += sv("circle", { cx:cx + p[0], cy:cy + p[1], r:rr, "class":"fr-fol" }); }); }
  else if (k === "dom") h += sv("circle", { cx:cx + 1, cy:cy, r:4.2, "class":"fr-fol" }) + sv("circle", { cx:cx - 5, cy:cy + 4, r:1.5, "class":"fr-fol" });
  else if (k === "mat" || k === "matS" || k === "wait") h += sv("circle", { cx:cx, cy:cy, r:5.8, "class":"fr-fol" }) + sv("circle", { cx:cx + 1.5, cy:cy - 1.5, r:1.6, "class":"fr-egg" });
  else if (k === "ovu") h += sv("path", { d:"M" + f1(cx - 4) + " " + f1(cy - 4) + " A 5.6 5.6 0 1 0 " + f1(cx + 4) + " " + f1(cy - 4), "class":"fr-fol fr-open" }) + sv("circle", { cx:cx + 7, cy:cy - 9, r:1.8, "class":"fr-egg" });
  else if (k === "cl" || k === "clh") h += sv("circle", { cx:cx, cy:cy, r:k === "clh" ? 6.2 : 5.4, "class":"fr-clb" });
  else if (k === "brk" || k === "deg") h += sv("circle", { cx:cx, cy:cy, r:4.6, "class":"fr-dash" });
  else if (k === "rem") h += ln(cx - 3.5, cy - 3.5, cx + 3.5, cy + 3.5, "fr-x") + ln(cx - 3.5, cy + 3.5, cx + 3.5, cy - 3.5, "fr-x");
  return h;
}
function cycleSVG(R, o){
  var N = R.N, keys = o.keys || K4, hasH = keys.indexOf("hcg") >= 0, gr = hasH ? 40 : 16, W = GW, H = cycH(o);
  var dx = (W - GL - gr) / (N - 1), up = o.upto == null ? N : clamp(Math.floor(o.upto), 1, N), h = "", d;
  function X(t){ return GL + (t - 1) * dx; }
  function Y(v){ return GB - v / 100 * (GB - GT); }
  function YH(v){ return GB - v / 300 * (GB - GT); }
  [0, 50, 100].forEach(function(v){ h += ln(GL, Y(v), W - gr, Y(v), "fr-grid") + txt(GL - 6, Y(v) + 4, String(v), "fr-ax", "end"); });
  h += txt(GL - 6, GT - 12, "AU", "fr-ax", "end");
  if (hasH) { [0, 150, 300].forEach(function(v){ h += txt(W - gr + 5, YH(v) + 4, String(v), "fr-ax fr-axh"); }); h += txt(W - gr + 5, GT - 12, "hCG", "fr-ax fr-axh"); }
  (N === 40 ? [1, 7, 14, 21, 28, 35, 40] : [1, 7, 14, 21, 28]).forEach(function(t){ h += ln(X(t), GB, X(t), GB + 4, "fr-axl") + txt(X(t), GB + 16, String(t), "fr-ax", "middle"); });
  h += ln(GL, GB, W - gr, GB, "fr-axl") + txt(GL - 6, GB + 16, "Day", "fr-ax", "end");
  // synthetic hormones (Pill): ink dashed, labelled
  if (R.v.synE[1] || R.v.synP[1]) {
    var e = R.v.synE[1] || 0, p = R.v.synP[1] || 0, x2 = X(Math.min(21, up));
    if (e) h += ln(X(1), Y(12 * e + 4), x2, Y(12 * e + 4), "fr-syn") + (up >= 8 ? txt(X(2), Y(12 * e + 4) - 4, "synthetic estrogen (dose " + e + ")", "fr-synt") : "");
    if (p) h += ln(X(1), Y(12 * p), x2, Y(12 * p), "fr-syn fr-synp") + (up >= 8 ? txt(X(2), Y(12 * p) + 13, "progestin (dose " + p + ")", "fr-synt") : "");
  }
  keys.forEach(function(k){
    var pts = [];
    for (d = 1; d <= up; d++) { var v = R.v[k][d]; if (v == null) continue; pts.push(f1(X(d)) + "," + f1(k === "hcg" ? YH(v) : Y(v))); }
    if (pts.length > 1) h += '<polyline class="fr-line ' + LCL[k] + '" points="' + pts.join(" ") + '"/>';
  });
  // event flags (two rows so neighbours don't collide)
  var fl = R.ev.filter(function(x){ return x.f && x.d && x.d <= up && x.d <= N; }).sort(function(a, b){ return a.d - b.d; });
  fl.forEach(function(x, i){
    var y = i % 2 ? 26 : 12, tx = clamp(X(x.d), GL + 36, W - gr - 36);
    h += ln(X(x.d), y + 4, X(x.d), GT - 2, "fr-flagl") + txt(tx, y, x.f === "removed" ? "CL removed" : x.f, "fr-fl", "middle");
  });
  var y0 = GB + 24;
  if (o.ovary !== false) {
    h += txt(4, y0 + 22, "Ovary", "fr-rl");
    runs(R.ovP, N, up).forEach(function(s, i){
      var xa = Math.max(GL - 6, X(s.a) - dx / 2), xb = Math.min(W - gr + 6, X(s.b) + dx / 2), lab = OVN[s.k] || "";
      h += sv("rect", { x:xa, y:y0, width:xb - xa, height:36, "class":"fr-seg" + (i % 2) });
      if (xb - xa > lab.length * cw() + 6) h += txt(xa + 4, y0 + 11, lab, "fr-pl");
    });
    runs(R.st, N, up).forEach(function(s){ var cx = (X(s.a) + X(s.b)) / 2; h += ovIcon(s.k, cx, y0 + 24); });
    y0 += 42;
  }
  if (o.uterus !== false) {
    var base = y0 + 46, top = [], dd;
    h += txt(4, base - 14, "Lining", "fr-rl");
    for (dd = 1; dd <= up; dd++) top.push(f1(X(dd)) + "," + f1(base - R.v.endo[dd] * 3.2));
    h += sv("rect", { x:GL - 6, y:y0, width:W - gr - GL + 12, height:48, "class":"fr-seg0" });
    if (up > 1) h += '<polygon class="fr-endo" points="' + f1(X(1)) + "," + base + " " + top.join(" ") + " " + f1(X(up)) + "," + base + '"/>';
    for (dd = 1; dd <= up; dd++) if (R.shed[dd]) h += sv("circle", { cx:X(dd), cy:base - 3, r:1.8, "class":"fr-drop" }) + sv("circle", { cx:X(dd) + dx / 3, cy:base - 7, r:1.4, "class":"fr-drop" });
    runs(R.utP, N, up).forEach(function(s, i){
      var xa = Math.max(GL - 6, X(s.a) - dx / 2), xb = Math.min(W - gr + 6, X(s.b) + dx / 2), lab = UTN[s.k] || "";
      if (i) h += ln(xa, y0 + 48, xa, y0 + 64, "fr-div");
      if (xb - xa > lab.length * cw() + 6) h += txt(xa + 4, y0 + 62, lab, "fr-pl");
    });
  }
  if (o.upto != null && o.cover !== false && up < N) {
    var hx = X(up) + dx / 2;
    h += sv("rect", { x:hx, y:GT - 6, width:W - gr + 6 - hx, height:H - GT + 4, "class":"fr-hide" }) + txt((hx + W - gr) / 2, (GT + GB) / 2, "?", "fr-q", "middle");
  }
  if (o.day != null) {
    var mx = GL + (o.day - 1) * dx;
    h += ln(mx, GT - 6, mx, H - 18, "fr-mark");
    if (o.dots !== false && o.day === Math.round(o.day)) keys.forEach(function(k){ var v = R.v[k][o.day]; if (v != null) h += sv("circle", { cx:mx, cy:k === "hcg" ? YH(v) : Y(v), r:3.8, "class":"fr-dot fr-d-" + k }); });
  }
  return { svg:h, h:H, X:X, dx:dx, gr:gr };
}
function legendHTML(keys, pill){
  var C = MV.C.explore, NM = {}; C.hormones.forEach(function(x){ NM[x[0]] = x[1]; });
  return keys.map(function(k){ return '<span class="fr-lg"><svg viewBox="0 0 26 10" width="26" height="10" aria-hidden="true"><line class="fr-line ' + LCL[k] + '" x1="2" y1="5" x2="24" y2="5"/></svg>' + NM[k] + "</span>"; }).join("") +
    (pill ? '<span class="fr-lg"><svg viewBox="0 0 26 10" width="26" height="10" aria-hidden="true"><line class="fr-syn" x1="2" y1="5" x2="24" y2="5"/></svg>synthetic dose</span>' : "") +
    '<span class="fr-lg"><svg viewBox="0 0 26 10" width="26" height="10" aria-hidden="true"><rect class="fr-endo" x="2" y="1" width="22" height="8"/></svg>uterine lining (mm)</span>';
}
function ovText(R, d){
  var k = R.ovP[d], t = OVN[k];
  if (k === "fol" && R.ov && d === R.ov - 1) t += " (last day)";
  if (k === "nxt") t = "Follicular (next cycle)";
  if (k === "lut" && R.rem && d >= R.rem) t += " (corpus luteum removed)";
  if (k === "lut" && R.mode === "preg" && d >= 21) t += " (corpus luteum kept by hCG)";
  return t;
}
function utText(R, d){ var k = R.utP[d]; return k === "thin" ? "thin lining (no proliferative growth)" : (UTN[k] || "").toLowerCase() + (k === "pro" && R.ovP[d] === "nxt" ? " (next cycle)" : ""); }
function nextEv(R, d){
  var list = R.ev.filter(function(x){ return x.d && x.d > d; }).sort(function(a, b){ return a.d - b.d; }), x = list[0];
  if (!x) return "None in this window";
  if (x.d > R.N) return x.t + " on day 1 of the next cycle (day " + x.d + ")";
  return x.t + (x.d === d + 1 ? " tomorrow (day " + x.d + ")" : " on day " + x.d);
}

// ---------- @component S8 feedbackView — hypothalamus → pituitary → ovary, with the ovary's feedback arrow marked − (brake) or + (surge) ----------
var STS = { dev:"several follicles", dom:"dominant follicle", mat:"mature follicle", matS:"mature follicle", wait:"mature follicle", ovu:"ovulation", cl:"corpus luteum",
  clh:"corpus luteum (hCG)", brk:"corpus luteum fading", deg:"follicle degenerating", rem:"corpus luteum removed", small:"small follicles", next:"new follicles" };
function fbSVG(R, d){
  var sg = R.sign[d], pos = sg === "+", v = R.v, h = "", pill = R.mode === "pill" && R.v.synE[d] != null && (R.v.synE[d] || R.v.synP[d]);
  function box(x, y, w, hh, t1, t2, cls){ return sv("rect", { x:x, y:y, width:w, height:hh, rx:6, "class":"fr-box " + (cls || "") }) + txt(x + w / 2, y + (t2 ? 13 : 18), t1, "fr-bt", "middle") + (t2 ? txt(x + w / 2, y + 26, t2, "fr-bs", "middle") : ""); }
  h += box(100, 4, 130, 28, "Hypothalamus") + arrow(165, 32, 165, 54) + txt(172, 47, "GnRH", "fr-al");
  h += box(100, 54, 130, 28, "Anterior pituitary") + arrow(165, 82, 165, 114) + txt(172, 96, "FSH " + n0(v.fsh[d]), "fr-al") + txt(172, 109, "LH " + n0(v.lh[d]) + (v.lh[d] >= 80 ? " surge" : ""), "fr-al" + (v.lh[d] >= 80 ? " fr-alb" : ""));
  h += box(100, 114, 130, 34, "Ovary", STS[R.st[d]] || "");
  var src = v.prog[d] >= 10 ? "+ progesterone" : "";
  h += sv("path", { d:"M230 131 H 268 V 72 H 236", "class":"fr-arr fr-loop" + (pos ? " fr-pos" : "") }) + head(268, 72, 233, 72);
  h += sv("circle", { cx:268, cy:102, r:12, "class":"fr-sg" + (pos ? " fr-sgp" : "") }) + txt(268, 108, pos ? "+" : "−", "fr-sgt", "middle");
  h += txt(284, 98, "estrogen", "fr-al") + (src ? txt(284, 111, src, "fr-al") : "") + txt(284, src ? 126 : 113, pos ? "surge (+)" : "brake (−)", "fr-alb");
  if (pill) h += box(4, 54, 80, 34, "Pill", "E " + (v.synE[d] || 0) + ", P " + (v.synP[d] || 0), "fr-boxd") + arrow(84, 68, 98, 68) + txt(91, 62, "−", "fr-alb", "middle");
  if (R.mode === "pill" && d > 21 && R.active) h += box(4, 54, 80, 34, "Placebo", "no hormones", "fr-boxd");
  if (R.D && d === R.D) h += box(4, 114, 80, 34, "LH pulse", "injection", "fr-boxd") + arrow(84, 131, 98, 131);
  if (R.mode === "preg" && d >= 21) h += box(100, 172, 130, 32, "Embryo", "hCG " + n0(v.hcg[d]), "fr-boxd") + arrow(165, 172, 165, 150) + txt(172, 165, "hCG keeps it going", "fr-al");
  return h;
}

// ---------- Explore: 28-day cycle timeline ----------
function explore(host, api){
  var C = api.content, S = api.S, K = C.switches, PC = C.pill;
  var D0 = { mode:"normal", day:1, pf:true, rOn:false, R:24, dOn:false, D:8, E:0, P:0 };
  Object.keys(D0).forEach(function(k){ if (S[k] === undefined) S[k] = D0[k]; });
  var hideAfter = null, play = null, pend = null, R = null;
  host.innerHTML = '<div class="pg fr-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="fr-stage"><svg id="fr-g" viewBox="0 0 560 336" role="img" focusable="false"></svg></div><p class="fr-legend tiny" id="fr-leg"></p>' +
    '<div class="fr-dayrow"><label class="fr-dl" for="fr-day">Day <output id="fr-dv"></output></label><input type="range" class="fr-range" id="fr-day" min="1" max="28" step="1" value="1">' +
    '<button type="button" class="btn primary sm" id="fr-play" data-k="frplay">Play</button></div><p class="fr-cap" id="fr-cap" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div id="fr-mode"></div><p class="tiny muted fr-mhelp" id="fr-mhelp"></p>' +
    '<details class="fr-sw" id="fr-sw" open><summary>' + K.title + '</summary><div class="fr-swb">' +
      '<label class="fr-chk"><input type="checkbox" id="fr-pf"> ' + K.pf + "</label>" +
      '<div class="fr-swr"><label class="fr-chk"><input type="checkbox" id="fr-ron"> ' + K.r + '</label><div id="fr-rst"></div></div>' +
      '<div class="fr-swr"><label class="fr-chk"><input type="checkbox" id="fr-don"> ' + K.d + '</label><div id="fr-dst"></div></div></div></details>' +
    '<fieldset class="fr-pillf" id="fr-pillf"><legend>' + PC.title + '</legend><div id="fr-est"></div><div id="fr-pst"></div><p class="tiny muted">' + PC.note + "</p></fieldset></div>" +
    '<div class="pg-read"><dl class="read" id="fr-read" aria-live="polite"></dl><div class="fr-fbv"><p class="fr-h4">Feedback view</p><svg id="fr-fb" viewBox="0 0 360 210" role="img" focusable="false"></svg></div>' +
    '<details class="fr-tbl" id="fr-tbl"><summary>Show the values as a table</summary><div id="fr-tblb"></div></details>' +
    '<p class="tiny fr-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div></div>";
  var svg = $("#fr-g", host), fbv = $("#fr-fb", host), readEl = $("#fr-read", host), capEl = $("#fr-cap", host), rng = $("#fr-day", host), playB = $("#fr-play", host);
  var modeR = radios($("#fr-mode", host), { label:"Mode", key:"m", options:C.modes.map(function(m){ return { id:m[0], t:m[1] }; }), value:S.mode, onChange:function(v){ user(); S.mode = v; if (S.day > (v === "preg" ? 40 : 28)) S.day = 28; commit(); } });
  var rSt = stepper($("#fr-rst", host), { id:"fr-rv", label:K.rDay, min:15, max:27, value:S.R, unit:function(v){ return "day " + v; }, onChange:function(v){ user(); S.R = v; commit(); } });
  var dSt = stepper($("#fr-dst", host), { id:"fr-dvv", label:K.dDay, min:8, max:20, value:S.D, unit:function(v){ return "day " + v; }, onChange:function(v){ user(); S.D = v; commit(); } });
  var eSt = stepper($("#fr-est", host), { id:"fr-ev", label:PC.e, min:0, max:3, value:S.E, onChange:function(v){ user(); S.E = v; commit(); } });
  var pSt = stepper($("#fr-pst", host), { id:"fr-pv", label:PC.p, min:0, max:3, value:S.P, onChange:function(v){ user(); S.P = v; commit(); } });
  $("#fr-pf", host).addEventListener("change", function(e){ user(); S.pf = e.target.checked; commit(); });
  $("#fr-ron", host).addEventListener("change", function(e){ user(); S.rOn = e.target.checked; commit(); });
  $("#fr-don", host).addEventListener("change", function(e){ user(); S.dOn = e.target.checked; commit(); });
  rng.addEventListener("input", function(){ user(); S.day = +rng.value; commit(); });
  rng.addEventListener("keydown", function(e){
    if (e.key !== "PageUp" && e.key !== "PageDown") return;
    e.preventDefault(); user(); S.day = clamp(S.day + (e.key === "PageUp" ? 7 : -7), 1, R.N); commit();
  });
  playB.addEventListener("click", function(){
    if (play) { stopPlay(); paint(); return; }
    user(); if (S.day >= R.N) S.day = 1;
    run(S.day, R.N, 500, false, null);
  });
  $("#fr-tbl", host).addEventListener("toggle", function(){ paintTbl(); });

  function cfg(){ return { mode:S.mode, pf:S.pf, rOn:S.rOn, R:S.R, dOn:S.dOn, D:S.D, E:S.E, P:S.P }; }
  function user(){ stopPlay(); hideAfter = null; setCap(""); }
  function commit(){ api.save(); paint(); MV.changed(); }
  function setCap(t){ capEl.innerHTML = t || ""; }
  function stopPlay(){
    if (play) { play(); play = null; }
    readEl.setAttribute("aria-live", "polite");
    if (pend) { var dn = pend; pend = null; hideAfter = null; paint(); dn(); }
  }
  // play from day a to day b at ms per day; keepHide reveals the hidden days as the marker moves
  function run(a, b, ms, keepHide, fin){
    if (play) { play(); play = null; }
    var nD = b - a, last = a;
    if (nD <= 0) { if (fin) fin(); return; }
    readEl.setAttribute("aria-live", "off");
    play = MV.tween({ dur:nD * ms, ease:lin, step:function(k){ var d = Math.min(b, Math.floor(a + k * nD + 1e-9)); if (d !== last) { last = d; S.day = d; if (keepHide) hideAfter = d; paint(); } },
      done:function(){ play = null; S.day = b; if (keepHide) hideAfter = b; readEl.setAttribute("aria-live", "polite"); api.save(); paint(); MV.changed(); if (fin) fin(); } });
    paint();
  }
  function keys(){ return S.mode === "preg" ? K5 : K4; }
  function paint(){
    R = simFor(cfg());
    if (S.day > R.N) S.day = R.N;
    var d = S.day;
    modeR.set(S.mode);
    rng.max = R.N; rng.value = d; $("#fr-dv", host).textContent = d + " of " + R.N;
    rng.setAttribute("aria-valuetext", "Day " + d + " of " + R.N);
    playB.textContent = play && !pend ? "Pause" : "Play"; playB.disabled = !!pend;
    $("#fr-mhelp", host).textContent = MV.plain(C.modeHelp[S.mode]);
    $("#fr-sw", host).hidden = S.mode !== "switch"; $("#fr-pillf", host).hidden = S.mode !== "pill";
    $("#fr-pf", host).checked = S.pf; $("#fr-ron", host).checked = S.rOn; $("#fr-don", host).checked = S.dOn;
    rSt.set(S.R); dSt.set(S.D); rSt.disable(!S.rOn); dSt.disable(!S.dOn); eSt.set(S.E); pSt.set(S.P);
    var G = cycleSVG(R, { keys:keys(), day:d, upto:hideAfter });
    svg.setAttribute("viewBox", "0 0 560 " + G.h); svg.innerHTML = G.svg; svg.setAttribute("aria-label", aria(d));
    $("#fr-leg", host).innerHTML = legendHTML(keys(), S.mode === "pill");
    paintRead(d); fbv.innerHTML = fbSVG(R, d); fbv.setAttribute("aria-label", "Feedback view, day " + d + ": hypothalamus, GnRH, anterior pituitary, FSH and LH, ovary (" + (STS[R.st[d]] || "") + "). The ovary’s hormones feed back on the pituitary as " + (R.sign[d] === "+" ? "positive feedback, a surge." : "negative feedback, a brake.") + (R.mode === "preg" && d >= 21 ? " The embryo’s hCG keeps the corpus luteum going." : ""));
    paintTbl();
  }
  function vals(d){ var v = R.v; return "FSH " + n0(v.fsh[d]) + ", LH " + n0(v.lh[d]) + ", estrogen " + n0(v.est[d]) + ", progesterone " + n0(v.prog[d]) + (v.hcg[d] != null ? ", hCG " + n0(v.hcg[d]) : "") + " AU; lining " + n0(v.endo[d]) + " mm"; }
  function aria(d){
    var ev = R.ev.filter(function(x){ return x.f && x.d <= R.N && (hideAfter == null || x.d <= hideAfter); }).map(function(x){ return x.t + " day " + x.d; });
    return "Timeline graph, " + MV.plain(byId(C.modes.map(function(m){ return { id:m[0], t:m[1] }; }), S.mode).t) + ", day " + d + " of " + R.N + ": " + vals(d) + ". Ovary: " + C.status[R.st[d]] + ". Events: " + (ev.join("; ") || "none") + "." + (hideAfter != null ? " Days after " + hideAfter + " are hidden until you predict." : "");
  }
  function paintRead(d){
    var v = R.v, rows = [["Day", String(d)], ["Ovarian / uterine phase", ovText(R, d) + " / " + utText(R, d)],
      ["FSH · LH · estrogen · progesterone", n0(v.fsh[d]) + " · " + n0(v.lh[d]) + " · " + n0(v.est[d]) + " · " + n0(v.prog[d]) + " AU"]];
    if (R.mode === "preg") rows.push(["hCG", v.hcg[d] == null ? "none yet" : n0(v.hcg[d]) + " AU · pregnancy test: " + (v.hcg[d] >= md().testAt ? "<strong>positive</strong>" : "negative")]);
    if (R.mode === "pill") rows.push(["Pill", !R.active ? "no active doses" : d <= 21 ? "active: estrogen dose " + R.E + ", progestin dose " + R.P : "placebo (no hormones)"]);
    rows.push(["Ovary", C.status[R.st[d]]], ["Endometrium", n0(v.endo[d]) + " mm" + (R.shed[d] ? " (being shed)" : "")], ["Feedback now", R.fb[d]],
      ["Next event", hideAfter != null ? '<span class="muted">hidden until you predict</span>' : nextEv(R, d)]);
    readEl.innerHTML = MV.readoutHTML(rows);
  }
  function paintTbl(){
    var box = $("#fr-tbl", host); if (!box.open) return;
    var hc = R.mode === "preg", rows = [], d, lim = hideAfter == null ? R.N : hideAfter;
    for (d = 1; d <= lim; d++) rows.push([d, n0(R.v.fsh[d]), n0(R.v.lh[d]), n0(R.v.est[d]), n0(R.v.prog[d])].concat(hc ? [R.v.hcg[d] == null ? "—" : n0(R.v.hcg[d])] : []).concat([n0(R.v.endo[d]), OVN[R.ovP[d]] + " / " + utText(R, d)]));
    $("#fr-tblb", host).innerHTML = MV.tableHTML({ head:["Day", "FSH", "LH", "Estrogen", "Progesterone"].concat(hc ? ["hCG"] : []).concat(["Lining (mm)", "Phases"]), rows:rows, hiRow:S.day - 1, caption:"Model hormone values by day (AU)" });
  }

  function chal(id){
    var c = byId(C.challenges, id), W = c.wrong, r = simFor(cfg());
    if (id === "tc1") {
      if (S.mode !== "normal") return { ok:false, msg:W.mode };
      if (S.day === 13) return { ok:true };
      if (S.day === 14) return { ok:false, msg:W.d14 };
      if (S.day === 12) return { ok:false, msg:W.d12 };
      return { ok:false, msg:"On day " + S.day + ", LH is " + n0(r.v.lh[S.day]) + " AU. Look for its highest point." };
    }
    if (id === "tc2") {
      if (S.mode !== "switch") return { ok:false, msg:W.mode };
      if (!S.rOn) return { ok:false, msg:W.off };
      if (r.rem && S.R === 17 && r.mens === 21) return { ok:true };
      if (r.rem && S.R === 21) return { ok:false, msg:W.r21 };
      if (r.ov && S.R >= r.bd) return { ok:false, msg:W.late };
      if (!r.rem) return { ok:false, msg:W.nocl };
      return { ok:false, msg:"Removing it on day " + S.R + " starts menstruation on day " + r.mens + "." };
    }
    if (id === "tc3") {
      if (S.mode !== "switch") return { ok:false, msg:W.mode };
      if (S.pf) return { ok:false, msg:W.pf };
      if (!S.dOn) return { ok:false, msg:W.off };
      if (S.D === 13) return { ok:true };
      if (S.D === 14) return { ok:false, msg:W.d14 };
      if (S.D < 12) return { ok:false, msg:W.early };
      if (S.D > 15) return { ok:false, msg:W.late };
      return { ok:false, msg:"That gives ovulation on day " + (S.D + 1) + "." };
    }
    return { ok:false };
  }

  paint();
  return {
    predict:{
      start:function(p){
        stopPlay();
        var s = p.start; S.mode = s.mode; S.day = s.day; S.pf = true; S.rOn = false; S.dOn = false;
        if (s.E != null) { S.E = s.E; S.P = s.P; }
        hideAfter = s.day; setCap(""); api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        stopPlay();
        if (p.set) Object.keys(p.set).forEach(function(k){ S[k] = p.set[k]; });
        hideAfter = S.day; pend = done; api.save();
        run(S.day, p.to, 380, true, function(){
          hideAfter = null; paint(); setCap(p.reveal);
          var dn = pend; pend = null; paint(); if (dn) MV.wait(300, dn);
        });
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: Hormones as medicine ----------
// @component N8 regionTaps (adapted from SBI4U 18) — native buttons laid over an SVG graph, one per day range
function part3(host, api){
  var C = api.content, S = api.S, PI = C.pill, IV = C.ivf, CE = C.cer;
  S.p1 = S.p1 || { found:{}, last:null }; S.ivf = S.ivf || { lv:"none", step:0 }; S.cer = S.cer || { claim:null, ev:[], reason:null, found:{}, msg:null, good:false };
  var nat = simCycle({ pf:true }, "normal"), pil = simPill(2, 2);
  host.innerHTML = '<div class="fr-p3">' +
    '<div class="fr-st"><h3>' + PI.title + '</h3><details class="alg" open><summary>' + PI.panel + "</summary><p>" + PI.how + "</p>" +
      '<div class="fr-two"><figure class="fr-fig"><figcaption>Natural cycle</figcaption><div class="fr-tapw" id="fr-tw0"></div></figure><figure class="fr-fig"><figcaption>Pill cycle (<i>E</i> = 2, <i>P</i> = 2)</figcaption><div class="fr-tapw" id="fr-tw1"></div></figure></div>' +
      '<p class="fr-legend tiny">' + legendHTML(["fsh", "lh"], true) + '</p><div id="fr-p1fb" aria-live="polite"></div><p>' + PI.text + "</p></details></div>" +
    '<div class="fr-st"><h3>' + IV.title + '</h3><div id="fr-ivlv"></div><div id="fr-ivtb"></div><div class="fr-ivs"><svg id="fr-ivsvg" viewBox="0 0 340 150" role="img" focusable="false"></svg></div>' +
      '<p class="fr-ivstep" id="fr-ivstep" aria-live="polite"></p><div class="q-actions"><button type="button" class="btn ghost sm" id="fr-ivb" data-k="ivb">← Back</button><button type="button" class="btn primary sm" id="fr-ivn" data-k="ivn">Next step →</button></div>' +
      '<p class="fr-risk"><strong>Risk:</strong> ' + IV.risk + "</p></div>" +
    '<div class="fr-st"><h3>' + CE.title + '</h3><details class="alg" open><summary>' + CE.panel + "</summary>" +
      '<div class="tbl-wrap"><table class="fr-mt"><caption class="vh">Menopause hormones, model data</caption><thead><tr>' + CE.head.map(function(c){ return '<th scope="col">' + c + "</th>"; }).join("") + "</tr></thead><tbody>" +
      CE.rows.map(function(r){ return '<tr><th scope="row">' + r[0] + "</th><td>" + r[1] + "</td><td>" + r[2] + "</td></tr>"; }).join("") + '</tbody></table></div><p class="tiny"><span class="bio-model">Model data</span> Arbitrary units (AU).</p>' +
      "<p>" + CE.intro + '</p><div id="fr-cer"></div><p class="fr-note2"><strong>' + CE.note + "</strong></p></details></div></div>";

  // Station 1
  function tapPanel(i, R){
    var w = $("#fr-tw" + i, host), G = cycleSVG(R, { keys:["fsh", "lh"], ovary:false, uterus:true }), H = G.h;
    var zones = PI.zones.map(function(z, j){
      var xa = G.X(z.a) - G.dx / 2, xb = G.X(z.b) + G.dx / 2, f = S.p1.found[j];
      return '<button type="button" class="fr-zone' + (f ? " on" : "") + (S.p1.last === j && !f ? " miss" : "") + '" data-z="' + j + '" data-k="z' + i + "-" + j + '" aria-pressed="' + !!f + '" aria-label="' + MV.esc((i ? "Pill" : "Natural") + " cycle, days " + z.a + "–" + z.b) + '" style="left:' + f1(xa / GW * 100) + "%;width:" + f1((xb - xa) / GW * 100) + "%;top:" + f1((GT - 8) / H * 100) + "%;height:" + f1((GB - GT + 8) / H * 100) + '%">' + (f ? "✓" : "") + "</button>";
    }).join("");
    MV.keepFocus(w, function(){
      w.innerHTML = '<svg viewBox="0 0 560 ' + H + '" role="img" focusable="false" aria-label="' + MV.esc((i ? "Pill cycle: FSH flat at 10 AU on days 1 to 21, LH flat near 12 with no surge, the lining thin at 5 mm; in the placebo week FSH rises and a withdrawal bleed starts on day 24." : "Natural cycle: FSH rises to 40 AU on days 3 to 7 and peaks again at 45 on day 13; LH surges to 95 on day 13; the lining grows to 13 mm.")) + '">' + G.svg + "</svg>" + '<div class="fr-zones">' + zones + "</div>";
    });
  }
  function paintP1(){
    tapPanel(0, nat); tapPanel(1, pil);
    var fbBox = $("#fr-p1fb", host), j = S.p1.last, nF = Object.keys(S.p1.found).length, h = "";
    if (j != null) { var z = PI.zones[j], ok = MV.ok(z); h = MV.fbHTML(ok ? "good" : "bad", "<strong>" + (ok ? "✓ Yes." : "✗ Not the biggest gap.") + "</strong> " + z.fb + (ok ? "" : " Try another place.")); }
    if (nF >= 2) h += MV.fbHTML("good", "<strong>✓ Both found.</strong> " + PI.done);
    else if (nF === 1) h += '<p class="tiny muted">One found. Tap the other place where the cycles differ most.</p>';
    fbBox.innerHTML = h;
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-z]"); if (!b) return;
    var j = +b.dataset.z; S.p1.last = j; if (MV.ok(PI.zones[j])) S.p1.found[j] = true;
    api.save(); paintP1(); MV.focusFb($("#fr-p1fb", host));
  });
  paintP1();

  // Station 2: IVF step-through
  var lvR = radios($("#fr-ivlv", host), { label:IV.levelLabel, key:"iv", options:IV.levels.map(function(l){ return { id:l[0], t:l[1] }; }), value:S.ivf.lv, onChange:function(v){ S.ivf.lv = v; api.save(); paintIV(); } });
  function ivSVG(nf, step){
    var h = "", i, cx = 82, cy = 76, pts = [];
    h += sv("ellipse", { cx:cx, cy:cy, rx:62, ry:48, "class":"fr-ov" }) + txt(cx, 142, "Ovary", "fr-bs", "middle");
    for (i = 0; i < nf; i++) { var a = i / Math.max(1, nf) * Math.PI * 2 + 0.4, rr = nf === 1 ? 0 : (i % 2 ? 24 : 34); pts.push([cx + Math.cos(a) * rr * 1.25, cy + Math.sin(a) * rr * 0.9]); }
    pts.forEach(function(p){ h += sv("circle", { cx:p[0], cy:p[1], r:nf > 8 ? 7 : 9, "class":"fr-fol" }) + (step >= 2 ? sv("circle", { cx:p[0] + 1.5, cy:p[1] - 1.5, r:2.2, "class":"fr-egg" }) : ""); });
    var tx = 168;
    if (step === 0) h += arrow(tx + 40, 40, cx + 64, 60) + txt(tx + 44, 36, "FSH injections", "fr-al") + txt(tx + 44, 52, nf + " mature follicle" + (nf === 1 ? "" : "s") + " (model)", "fr-alb");
    if (step === 1) h += sv("rect", { x:tx + 30, y:14, width:130, height:28, rx:6, "class":"fr-box" }) + txt(tx + 95, 32, "Anterior pituitary", "fr-bt", "middle") + ln(tx + 95, 42, tx + 95, 82, "fr-arr fr-dsh") + ln(tx + 86, 54, tx + 104, 70, "fr-x2") + ln(tx + 104, 54, tx + 86, 70, "fr-x2") + txt(tx + 110, 66, "no early", "fr-al") + txt(tx + 110, 79, "LH surge", "fr-al") + txt(tx + 30, 104, "GnRH action blocked", "fr-alb");
    if (step === 2) h += arrow(tx + 40, 70, cx + 64, 74) + txt(tx + 44, 62, "hCG trigger", "fr-alb") + txt(tx + 44, 88, "acts on LH receptors", "fr-al") + txt(tx + 44, 102, "eggs collected ≈ 1.5 days later", "fr-al");
    if (step === 3) { h += sv("rect", { x:tx + 20, y:96, width:140, height:30, "class":"fr-seg0" }) + sv("rect", { x:tx + 20, y:104, width:140, height:22, "class":"fr-endo" }) + sv("circle", { cx:tx + 90, cy:100, r:5, "class":"fr-egg" }) + txt(tx + 20, 144, "Uterine lining kept ready", "fr-al") + txt(tx + 20, 60, "Progesterone", "fr-alb") + arrow(tx + 60, 66, tx + 80, 94); }
    return h;
  }
  function paintIV(){
    var lv = IV.levels.filter(function(l){ return l[0] === S.ivf.lv; })[0] || IV.levels[0], idx = IV.levels.indexOf(lv), st = S.ivf.step;
    lvR.set(lv[0]);
    $("#fr-ivtb", host).innerHTML = MV.tableHTML({ head:IV.head, rows:IV.levels.map(function(l){ return [l[1], String(l[2])]; }), hiRow:idx, caption:"Model data: mature follicles for each FSH injection level" });
    var s = $("#fr-ivsvg", host); s.innerHTML = ivSVG(lv[2], st);
    s.setAttribute("aria-label", "Step " + (st + 1) + " of 4. Ovary with " + lv[2] + " mature follicle" + (lv[2] === 1 ? "" : "s") + ". " + MV.plain(IV.steps[st]));
    $("#fr-ivstep", host).innerHTML = "<strong>Step " + (st + 1) + " of 4.</strong> " + IV.steps[st];
    $("#fr-ivb", host).disabled = st === 0; $("#fr-ivn", host).disabled = st === 3;
  }
  $("#fr-ivb", host).addEventListener("click", function(){ S.ivf.step = Math.max(0, S.ivf.step - 1); api.save(); paintIV(); });
  $("#fr-ivn", host).addEventListener("click", function(){ S.ivf.step = Math.min(3, S.ivf.step + 1); api.save(); paintIV(); });
  paintIV();

  // Station 3: @component S12 cerBuilder — claim chips (one), evidence chips (several), reasoning chips (one), Check
  var box = $("#fr-cer", host), A = MV.ans(CE);
  function chipRow(title, list, kind){
    var X = S.cer;
    return '<div class="fr-cg"><p class="fr-cgt">' + title + '</p><div class="chips fr-chips" role="group" aria-label="' + MV.esc(title) + '">' + list.map(function(c){
      var on = kind === "ev" ? X.ev.indexOf(c.id) >= 0 : X[kind] === c.id;
      return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-cg="' + kind + '" data-cv="' + c.id + '" data-k="cg' + c.id + '">' + c.t + "</button>";
    }).join("") + "</div></div>";
  }
  function paintCER(){
    var X = S.cer, nF = Object.keys(X.found).length;
    var h = chipRow("Claim (choose one)", CE.claims, "claim") + chipRow("Evidence (choose all that support it)", CE.evidence, "ev") + chipRow("Reasoning (choose one)", CE.reasons, "reason") +
      '<div class="q-actions"><button type="button" class="btn primary sm" data-act="cer" data-k="cerchk">Check argument</button><span class="tiny muted">Arguments found: ' + nF + " of 2</span></div>";
    if (X.msg) h += MV.fbHTML(X.good ? "good" : "bad", "<strong>" + (X.good ? "✓ " : "✗ Not quite. ") + "</strong>" + X.msg);
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  box.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    var X = S.cer;
    if (b.dataset.cg) {
      var k = b.dataset.cg, v = b.dataset.cv;
      if (k === "ev") { var i = X.ev.indexOf(v); if (i >= 0) X.ev.splice(i, 1); else X.ev.push(v); }
      else X[k] = X[k] === v ? null : v;
      X.msg = null; api.save(); paintCER(); return;
    }
    if (b.dataset.act !== "cer") return;
    X.good = false;
    if (!X.claim || !X.ev.length || !X.reason) X.msg = CE.pick;
    else {
      var key = X.claim === A.a.claim ? "a" : X.claim === A.b.claim ? "b" : null;
      if (!key) X.msg = byId(CE.claims, X.claim).fb;
      else {
        var sp = A[key], okE = sp.need.every(function(e){ return X.ev.indexOf(e) >= 0; }) && X.ev.every(function(e){ return sp.need.indexOf(e) >= 0 || sp.allow.indexOf(e) >= 0; });
        if (!okE) X.msg = key === "a" ? CE.evA : CE.evB;
        else if (X.reason !== sp.reason) X.msg = CE.reason;
        else { X.found[key] = true; X.good = true; X.msg = (key === "a" ? CE.fbA : CE.fbB) + " " + (Object.keys(X.found).length >= 2 ? CE.done : CE.more); }
      }
    }
    api.save(); paintCER(); MV.focusFb(box);
  });
  paintCER();
}

// ---------- Practice 2: Read the cycle (custom: chips and number entry; first-try tracked) ----------
function readAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", pick:null, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">Type a day number and press Check, or tap a chip.</p>' + a.items.map(function(it){ return '<div class="q" data-rc="' + it.id + '"></div>'; }).join("");
  function num(s){ var m = /-?\d+(\.\d+)?/.exec(String(s || "").replace(/[−–]/g, "-")); return m ? parseFloat(m[0]) : null; }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = $('[data-rc="' + it.id + '"]', host), h;
    h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "num") {
      h += '<div class="numrow"><label for="rc-' + it.id + '">Day:</label><input class="numin" id="rc-' + it.id + '" data-rci="' + it.id + '" type="text" inputmode="numeric" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + "></div>";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
      if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
      else if (msgs[it.id]) h += MV.fbHTML("bad", msgs[it.id]);
    } else {
      h += '<div class="chips" role="group" aria-label="Choices for item ' + (i + 1) + '">' + MV.shuffle(it.chips.map(function(c, j){ return j; }), "fr" + it.id).map(function(j){
        var c = it.chips[j], on = x.pick === j; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-rcc="' + j + '" data-k="rc' + it.id + j + '"' + (x.solved ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
      if (x.pick != null) { var c = it.chips[x.pick], ok = MV.ok(c); h += MV.fbHTML(ok ? "good" : "bad", "<strong>" + (ok ? "✓ Correct." : "✗ Not quite.") + "</strong> " + c.fb + (ok ? (x.first ? "" : ' <span class="muted">(not first try)</span>') : " Try another.")); }
    }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.rci; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.rci) { var b = host.querySelector('[data-k="' + e.target.dataset.rci + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-rc]"); if (!box) return;
    var it = byId(a.items, box.dataset.rc), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it); return; }
    if (b.dataset.rcc != null) {
      var j = +b.dataset.rcc; x.pick = j;
      if (MV.ok(it.chips[j])) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
      api.save(); paintItem(it); MV.focusFb(box); MV.changed(); return;
    }
    if (b.dataset.act !== "check") return;
    var v = num(x.val), ans = MV.ans(it), list = Array.isArray(ans) ? ans : [ans];
    if (v == null) { msgs[it.id] = "Type a day number, such as 9."; paintItem(it); return; }
    if (list.indexOf(v) >= 0) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
    else { x.tries++; var w = (it.wrong || []).filter(function(q){ return q.match === v; })[0]; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (w ? w.fb : it.general) + " Try again."; }
    api.save(); paintItem(it); MV.focusFb(box); MV.changed();
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Design a model hormone schedule (week rows of E and P chips + live 28-day preview) ----------
function simTask(w){
  var r = newR(28, "task"), d, act = w.slice(0, 3).some(function(p){ return p[0] + p[1] > 0; });
  for (d = 1; d <= 28; d++) {
    var k = Math.min(3, Math.floor((d - 1) / 7)), E = w[k][0], P = w[k][1], F = Math.max(5, 40 - 10 * E - 5 * P), endo;
    if (P >= 1) endo = 5; else if (E > 0) endo = 9; else if (k === 3 && act) endo = d <= 23 ? (w[2][1] >= 1 ? 5 : 9) : lerp(w[2][1] >= 1 ? 5 : 9, 2, (d - 23) / 5); else endo = 8;
    put(r, d, { fsh:F, lh:12, est:0, prog:0, endo:endo });
    r.shed[d] = k === 3 && act && E + P === 0 && d >= 24;
    r.utP[d] = r.shed[d] ? "bleed" : P >= 1 ? "thin" : "pro";
  }
  for (k = 0; k < 3; k++) if (w[k][1] === 0) {
    var sd = 7 * k + 6; r.v.lh[sd] = 95; r.v.lh[sd + 1] = 50;
    r.ev.push({ d:sd, f:"surge", t:"LH surge possible" });
    if (Math.max(5, 40 - 10 * w[k][0]) >= 15) r.ev.push({ d:sd + 1, f:"ovulation", t:"Ovulation" });
  }
  if (act && w[3][0] + w[3][1] === 0) r.ev.push({ d:24, f:"bleed", t:"Withdrawal bleed" });
  return r;
}
var task = (function(){
  var api = null;
  function st(){ var s = api.S; if (!s.w) s.w = [[0, 0], [0, 0], [0, 0], [0, 0]]; return s; }
  function read(){ if (!api) return { w:[[0, 0], [0, 0], [0, 0], [0, 0]] }; return { w:st().w.map(function(p){ return p.slice(); }) }; }
  function fsh(p){ return 40 - 10 * p[0] - 5 * p[1]; }
  function draw(){
    var d = read(), box = $("#fr-tsvg"); if (!box) return;
    var R = simTask(d.w), G = cycleSVG(R, { keys:["fsh", "lh"], ovary:false });
    box.setAttribute("viewBox", "0 0 560 " + G.h); box.innerHTML = G.svg + [8, 15, 22].map(function(x){ return ln(G.X(x) - G.dx / 2, GT - 4, G.X(x) - G.dx / 2, GB, "fr-wk"); }).join("") + [1, 2, 3, 4].map(function(k){ return txt(G.X(7 * k - 3), GB - 6, "week " + k, "fr-wkt", "middle"); }).join("");
    var ov = R.ev.filter(function(x){ return x.f === "ovulation"; }).length;
    box.setAttribute("aria-label", "Preview: FSH by week " + d.w.map(function(p){ return Math.max(5, fsh(p)); }).join(", ") + " AU. " + (R.ev.filter(function(x){ return x.f === "surge"; }).length ? "An LH surge is possible in a week with no progestin. " : "LH stays flat. ") + (ov ? "A follicle can mature and ovulate. " : "No ovulation. ") + (R.ev.some(function(x){ return x.f === "bleed"; }) ? "Withdrawal bleed in week 4." : "No withdrawal bleed."));
    $("#fr-tread").innerHTML = MV.readoutHTML(d.w.map(function(p, k){ var F = fsh(p); return ["Week " + (k + 1), "FSH = 40 − 10 × " + p[0] + " − 5 × " + p[1] + " = " + (F < 5 ? MV.num(F) + ", so 5 (the floor)" : MV.num(F)) + (k < 3 ? " · surge " + (p[1] >= 1 ? "blocked" : "possible") : "")]; }));
  }
  function lab(k){ return k.split(",").map(function(p){ var q = p.split("-"); return "(" + q[0] + ", " + q[1] + ")"; }).join(", "); }
  return {
    render:function(inp, pv, a){
      api = a; var s = st();
      inp.innerHTML = '<p class="how">Choose the estrogen (<i>E</i>) and progestin (<i>P</i>) level for each week. Model levels, not real medicine amounts.</p>' + [0, 1, 2, 3].map(function(k){ return '<fieldset class="fr-wkf"><legend>Week ' + (k + 1) + (k === 3 ? " (last week of the pack)" : "") + '</legend><div id="fr-te' + k + '"></div><div id="fr-tp' + k + '"></div></fieldset>'; }).join("");
      function upd(){ a.save(); draw(); a.update(); }
      [0, 1, 2, 3].forEach(function(k){
        radios($("#fr-te" + k), { label:"<i>E</i>", aria:"Week " + (k + 1) + " estrogen level", key:"te" + k, cls:"chips", options:[0, 1, 2, 3].map(function(v){ return { id:String(v), t:String(v) }; }), value:String(s.w[k][0]), onChange:function(v){ s.w[k][0] = +v; upd(); } });
        radios($("#fr-tp" + k), { label:"<i>P</i>", aria:"Week " + (k + 1) + " progestin level", key:"tp" + k, cls:"chips", options:[0, 1, 2, 3].map(function(v){ return { id:String(v), t:String(v) }; }), value:String(s.w[k][1]), onChange:function(v){ s.w[k][1] = +v; upd(); } });
      });
      pv.innerHTML = '<div class="fr-tpv"><h4>Live 28-day preview</h4><div class="fr-stage"><svg id="fr-tsvg" viewBox="0 0 560 290" role="img" focusable="false"></svg></div><p class="fr-legend tiny">' + legendHTML(["fsh", "lh"], false) + '</p><dl class="read" id="fr-tread" aria-live="polite"></dl></div>';
      draw();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){
      var w = d.w, act = w.slice(0, 3).some(function(p){ return p[0] + p[1] > 0; });
      return [w.slice(0, 3).every(function(p){ return p[1] >= 1; }), w.slice(0, 3).every(function(p){ return fsh(p) < 15; }), act && w[3][0] === 0 && w[3][1] === 0, w.every(function(p){ return p[0] <= 2; })];
    },
    key:function(d){ return d.w.map(function(p){ return p[0] + "-" + p[1]; }).join(","); },
    label:lab,
    text:function(k){ return "weeks 1–4 (E, P): " + lab(k); }
  };
})();

// ---------- hero: day marker sweeps day 1 → 28 over 8 s; reduced motion shows the full graph with phase labels ----------
function hero(f){
  var box = $("#fr-hero"); if (!box) return;
  var R = simCycle({ pf:true }, "normal"), cap = f && f.cap, last = -1;
  var CAPS = ["Days 1–5: the lining is shed and FSH rises.", "Days 6–12: a follicle grows, estrogen climbs and the lining thickens.", "Day 13: LH surges.",
    "Day 14: the follicle releases the egg.", "Days 15–24: the corpus luteum makes progesterone, and the lining thickens further.",
    "Days 25–28: the corpus luteum fades, progesterone drops and the lining starts to shed.", "The 28-day model cycle: FSH, LH, estrogen and progesterone, the ovary and the uterine lining."];
  var H = cycH({});
  box.innerHTML = '<svg viewBox="0 0 560 ' + H + '" aria-hidden="true" focusable="false"></svg>';
  var svg = $("svg", box);
  function setCap(i){ if (cap && i !== last) { cap.textContent = CAPS[i]; last = i; } }
  function fin(){ svg.innerHTML = cycleSVG(R, { keys:K4 }).svg; setCap(6); }
  if (MV.reduceMotion) { fin(); return; }
  function frame(t){
    var d = 1 + t * 27, di = Math.floor(d + 1e-9);
    svg.innerHTML = cycleSVG(R, { keys:K4, day:d, upto:di, cover:false, dots:false }).svg;
    setCap(di <= 5 ? 0 : di <= 12 ? 1 : di === 13 ? 2 : di === 14 ? 3 : di <= 24 ? 4 : 5);
  }
  frame(0);
  MV.tween({ dur:8000, ease:lin, step:frame, done:function(){ MV.wait(900, fin); } });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ read:readAct },
  task:task
});
})();
