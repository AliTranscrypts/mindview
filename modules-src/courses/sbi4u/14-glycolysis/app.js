// SBI4U 14 Glycolysis: hero (spend 2, earn 4), Glycolysis stepper (S2 pathway stepper, glycolysis form: 4 stages or 10 steps,
// carbon and phosphate tokens, spotlight, NAD⁺ pool, block a step; S3 energy ledger strip with a PFK gauge), "Two ways to make
// ATP" (enzymeZoom of step 7, an ATP synthase preview, a chip-fill comparison table, PFK data with the S2 feedback form),
// custom practice (ordering with pattern feedback; accounting and control), "Sprint budget" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small helpers (SVG helpers from SBI4U 08 / 10) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function seg(k, a, b){ return clamp((k - a) / (b - a), 0, 1); }
function ez(k){ return MV.ease(clamp(k, 0, 1)); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "gl-lab", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (String(list[i].id) === String(id)) return list[i]; return null; }
function op(a, g){ return a == null || a >= 0.98 ? g : a <= 0.02 ? "" : '<g opacity="' + Math.round(a * 100) / 100 + '">' + g + "</g>"; }
function polyAt(pts, p){
  var segs = [], tot = 0, i;
  for (i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); tot += l; }
  if (!tot) return pts[0];
  var d = clamp(p, 0, 1) * tot;
  for (i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { var k = segs[i] ? Math.min(1, d / segs[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } d -= segs[i]; }
  return pts[pts.length - 1];
}
function parseVal(raw){
  var s = String(raw == null ? "" : raw).replace(/,/g, "").replace(/[−–]/g, "-").replace(/[^0-9.\-\/]+/g, " ").trim().split(/\s+/)[0] || "";
  var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null;
}
function num(v){ return MV.num(v); }

// ---------- @component radioGroup (copied from SBI4U 08 / 04 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list), disable(b)}
function radios(host, o){
  var val = String(o.value), off = false;
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, dis = x.dis || off, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (dis ? -1 : tab) + '" data-rg="' + x.id + '" data-k="rg' + x.id + '"' + (x.aria ? ' aria-label="' + MV.esc(x.aria) + '"' : "") + (dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
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
// number stepper (from SBI4U 08, with a changeable maximum): stepper(host, {id, label, min, max, value, unit(v), onChange(v)}) -> {set(v), setMax(m), disable(b)}
function stepper(host, o){
  var v = o.value, off = false, nm = MV.plain(o.label);
  host.innerHTML = '<span class="rg-wrap"><span class="rg-lab" id="' + o.id + '-l">' + o.label + '</span><span class="gl-stp" role="group" aria-labelledby="' + o.id + '-l">' +
    '<button type="button" class="gl-stb" data-d="-1" data-k="' + o.id + 'm" aria-label="' + MV.esc("Decrease " + nm) + '">−</button><output id="' + o.id + '" aria-live="polite"></output>' +
    '<button type="button" class="gl-stb" data-d="1" data-k="' + o.id + 'p" aria-label="' + MV.esc("Increase " + nm) + '">+</button></span></span>';
  var out = $("#" + o.id, host);
  function paint(){ out.textContent = o.unit ? o.unit(v) : v; $$("[data-d]", host).forEach(function(b){ b.disabled = off || (+b.dataset.d < 0 ? v <= o.min : v >= o.max); }); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-d]"); if (!b || b.disabled) return; v = clamp(v + (+b.dataset.d), o.min, o.max); paint(); o.onChange(v); });
  paint();
  return { set:function(x){ v = x; paint(); }, setMax:function(m){ o.max = m; paint(); }, disable:function(b){ off = b; paint(); } };
}
// range slider with output (from SBI4U 08): slider(host, {id, label, min, max, step, value, unit(v), onChange(v)}) -> {set(v), disable(b)}
function slider(host, o){
  host.innerHTML = '<label class="slider gl-sl"><span class="slider-top"><span>' + o.label + '</span><output id="' + o.id + '-out" for="' + o.id + '"></output></span><input type="range" id="' + o.id + '" min="' + o.min + '" max="' + o.max + '" step="' + o.step + '" value="' + o.value + '"></label>';
  var inp = $("#" + o.id, host), out = $("#" + o.id + "-out", host);
  function show(v){ out.textContent = o.unit(v); inp.setAttribute("aria-valuetext", o.unit(v)); }
  inp.addEventListener("input", function(){ show(+inp.value); o.onChange(+inp.value); });
  show(o.value);
  return { set:function(v){ inp.value = v; show(v); }, disable:function(b){ inp.disabled = b; } };
}

// ---------- @component S2 pathwayStepper — glycolysis form (course plan S2): 10 steps or 4 stages; every glucose's progress is a
// pure function of the stepper position and the settings (NAD⁺ pool, blocked step), so states are exact. model(S) -> totals. ----------
var STAGE_END = [0, 3, 5, 6, 10];
var PHOS = [0, 1, 1, 2, 2, 2, 4, 2, 2, 2, 0];          // phosphates on the sugar(s) of one glucose after step p
var PFK = { low:100, normal:60, high:20 };            // PFK activity (model) for the ATP-level control
function gMax(S){ return S.nad === "limited" ? 8 : 5; }
function model(S){
  var list = [], t = { spent:0, made:0, nadh:0, pyr:0, phos:0, c6:0, c3:0, stalled:0, blocked:0, list:list };
  for (var i = 0; i < S.g; i++) {
    var L = 10, why = "";
    if (S.block === "6") { L = 5; why = "b6"; }
    else if (S.nad === "limited" && 2 * (i + 1) > S.pool) { L = 5; why = "nad"; }   // each glucose needs 2 NAD⁺ at step 6
    else if (S.block === "10") { L = 9; why = "b10"; }
    var p = Math.min(S.pos, L), held = S.pos > L;
    list.push({ L:L, why:why, p:p, held:held });
    if (p >= 1) t.spent++; if (p >= 3) t.spent++;
    if (p >= 6) t.nadh += 2; if (p >= 7) t.made += 2; if (p >= 10) { t.made += 2; t.pyr += 2; }
    t.phos += PHOS[p]; if (p >= 4) t.c3 += 2; else t.c6++;
    if (held && why === "nad") t.stalled++;
    if (held && why !== "nad") t.blocked++;
  }
  t.net = t.made - t.spent;
  t.free = S.nad === "limited" ? S.pool - t.nadh : null;
  return t;
}
function statusText(S, t){
  if (S.block === "6" && S.pos >= 6) return "Blocked at step 6";
  if (t.stalled) return "Stalled at step 6: no NAD⁺" + (t.stalled < S.g ? " (" + t.stalled + " of " + S.g + " glucose)" : "");
  if (S.block === "10" && S.pos >= 10) return "Blocked at step 10";
  return S.pos === 0 ? "Ready" : S.pos === 10 ? "Finished" : "Running";
}
function heldText(why){ return why === "nad" ? "✗ Stalled at step 6: no NAD⁺ left" : why === "b6" ? "⊘ Step 6 is blocked" : "⊘ Step 10 is blocked"; }

// Stage drawing: one glucose's carbons (brown C circles), phosphates (orange P circles from ATP, grey Pᵢ squares from solution) and
// carriers (ATP/ADP, NAD⁺/NADH, H₂O pills). stageSVG(p, k, o): static after step p (k == null) or step p + 1 in motion (k 0…1).
var SW = 330, SH = 250, YW = 112, YT = 64, YB = 172, PO = 32;   // stage size; whole-chain, top-lane and bottom-lane y; phosphate offset
var POS = { w:[[80, YW], [116, YW], [152, YW], [188, YW], [224, YW], [260, YW]],
  s4:[[116, YT], [152, YT], [188, YT], [152, YB], [188, YB], [224, YB]],
  s5:[[206, YT], [170, YT], [134, YT], [134, YB], [170, YB], [206, YB]] };
function cpos(p){ return p < 4 ? POS.w : p === 4 ? POS.s4 : POS.s5; }
var PH = [   // carbon index (0 = C1 of glucose … 5 = C6) each phosphate sits on after step p, or −1
  { id:"pa", src:"atp", at:function(p){ return p >= 1 && p < 10 ? (p >= 8 ? 4 : 5) : -1; } },
  { id:"pb", src:"atp", at:function(p){ return p >= 3 && p < 10 ? (p >= 8 ? 1 : 0) : -1; } },
  { id:"it", src:"pi", at:function(p){ return p === 6 ? 2 : -1; } },
  { id:"ib", src:"pi", at:function(p){ return p === 6 ? 3 : -1; } }];
var NAMES = ["glucose", "glucose-6-phosphate", "fructose-6-phosphate", "fructose-1,6-bisphosphate", ["DHAP", "G3P"], "G3P", "1,3-bisphosphoglycerate", "3-phosphoglycerate", "2-phosphoglycerate", "PEP", "pyruvate"];
var PILL = { atp:["ATP", 38, "gl-pl-atp gl-ka"], adp:["ADP", 38, "gl-pl-adp gl-ka"], nad:["NAD⁺", 44, "gl-pl-nad gl-kn"], nadh:["NADH", 48, "gl-pl-nadh gl-kn"], h2o:["H₂O", 42, "gl-pl-h2o gl-kw"] };
function pill(kind, x, y, a){
  var p = PILL[kind];
  return op(a, sv("rect", { x:x - p[1] / 2, y:y - 9.5, width:p[1], height:19, rx:9.5, "class":p[2] }) + txt(x, y + 4.2, p[0], "gl-plt " + p[2].split(" ")[0] + "-t " + p[2].split(" ")[1], "middle"));
}
function phosSVG(src, P, Cc, a){
  var h = Cc ? sv("line", { x1:Cc[0], y1:Cc[1] - 12, x2:P[0], y2:P[1] + 11, "class":"gl-pb gl-kp" }) : "";
  if (src === "atp") h += sv("circle", { cx:P[0], cy:P[1], r:11, "class":"gl-pa gl-kp" }) + txt(P[0], P[1] + 4.5, "P", "gl-pt gl-kp", "middle");
  else h += sv("rect", { x:P[0] - 11, y:P[1] - 11, width:22, height:22, rx:4, "class":"gl-pi gl-kp" }) + txt(P[0], P[1] + 4.2, "Pᵢ", "gl-pt gl-pit gl-kp", "middle");
  return op(a, h);
}
function above(c){ return [c[0], c[1] - PO]; }
function nameAt(p, lane){ var n = NAMES[p]; return Array.isArray(n) ? n[lane === "t" ? 0 : 1] : n; }
function stageSVG(p0, k, o){
  o = o || {};
  var anim = k != null && p0 < 10, s = p0 + 1, kk = anim ? k : 1, p1 = anim ? s : p0, A = cpos(p0), B = cpos(p1), C = [], i, h = "", fly = "";
  for (i = 0; i < 6; i++) {
    var e = anim ? ez(kk) : 1, x = lerp(A[i][0], B[i][0], e), y = lerp(A[i][1], B[i][1], e);
    if (anim && s === 5 && i <= 2) y -= (i === 1 ? 8 : 20) * Math.sin(Math.PI * e);
    if (anim && s === 2) y += 5 * Math.sin(kk * Math.PI * 6) * (i % 2 ? 1 : -1) * Math.sin(Math.PI * kk);
    C.push([x, y]);
  }
  // bonds between carbons (the C3–C4 bond breaks at step 4)
  [[0, 1], [1, 2], [3, 4], [4, 5]].forEach(function(q){ h += sv("line", { x1:C[q[0]][0], y1:C[q[0]][1], x2:C[q[1]][0], y2:C[q[1]][1], "class":"gl-bond gl-kc" }); });
  if (p1 < 4 || (anim && s === 4)) h += op(anim && s === 4 ? 1 - seg(kk, 0, 0.35) : 1, sv("line", { x1:C[2][0], y1:C[2][1], x2:C[3][0], y2:C[3][1], "class":"gl-bond gl-kc" }));
  // phosphates, with the carriers that bring or take them (carriers arrive from the left and leave to the left)
  PH.forEach(function(ph){
    var a0 = ph.at(p0), a1 = ph.at(p1);
    if (!anim) { if (a0 >= 0) h += phosSVG(ph.src, above(C[a0]), C[a0]); return; }
    if (a0 >= 0 && a1 >= 0) {
      if (a0 === a1) { h += phosSVG(ph.src, above(C[a0]), C[a0]); return; }
      var pa = above(C[a0]), pb = above(C[a1]), m = ez(seg(kk, 0.15, 0.85));
      h += phosSVG(ph.src, [lerp(pa[0], pb[0], m), lerp(pa[1], pb[1], m) - 14 * Math.sin(Math.PI * m)], m < 0.05 ? C[a0] : m > 0.95 ? C[a1] : null);
      return;
    }
    if (a0 < 0 && a1 >= 0) {
      var T = above(C[a1]);
      if (ph.src === "atp") {   // steps 1 and 3: an ATP brings it, then leaves as ADP
        var u = ez(seg(kk, 0, 0.45)), px = lerp(-30, T[0] - 34, u);
        if (kk < 0.6) fly += pill(kk < 0.5 ? "atp" : "adp", px, T[1]);
        else { var oq = polyAt([[T[0] - 34, T[1]], [T[0] - 34, T[1] - 24], [-40, T[1] - 24]], ez(seg(kk, 0.6, 1))); fly += pill("adp", oq[0], oq[1], 1 - seg(kk, 0.85, 1)); }
        var Pp = kk < 0.45 ? [px + 30, T[1]] : [lerp(T[0] - 4, T[0], seg(kk, 0.45, 0.6)), T[1]];
        h += phosSVG("atp", Pp, kk >= 0.6 ? C[a1] : null);
      } else {                  // step 6: a free Pᵢ arrives while NAD⁺ beside the chain is loaded to NADH
        var w = ez(seg(kk, 0, 0.5)), ly = C[a1][1];
        h += phosSVG("pi", [lerp(-20, T[0], w), T[1]], kk >= 0.5 ? C[a1] : null);
        if (kk < 0.55) fly += pill(kk < 0.5 ? "nad" : "nadh", lerp(-40, 82, ez(seg(kk, 0, 0.45))), ly);
        else { var q = polyAt([[82, ly], [82, ly - 24], [-40, ly - 24]], ez(seg(kk, 0.55, 1))); fly += pill("nadh", q[0], q[1], 1 - seg(kk, 0.85, 1)); }
      }
      return;
    }
    if (a0 >= 0 && a1 < 0) {    // steps 7 and 10: the phosphate moves straight onto ADP, which leaves as ATP
      var S0 = above(C[a0]), dk = S0[0] - 34;
      if (kk < 0.55) {
        fly += pill("adp", lerp(-30, dk, ez(seg(kk, 0, 0.4))), S0[1]);
        h += phosSVG(ph.src, [lerp(S0[0], S0[0] - 16, seg(kk, 0.4, 0.55)), S0[1]], kk < 0.4 ? C[a0] : null, 1 - seg(kk, 0.42, 0.55));
      } else { var r = polyAt([[dk, S0[1]], [dk, S0[1] - 22], [-40, S0[1] - 22]], ez(seg(kk, 0.6, 1))); fly += pill("atp", r[0], r[1], 1 - seg(kk, 0.85, 1)); }
    }
  });
  // water leaves at step 9
  if (anim && s === 9) [YT, YB].forEach(function(ly){ fly += pill("h2o", lerp(206, SW + 30, ez(kk)), ly, Math.min(seg(kk, 0, 0.15) * 1.5, 1 - seg(kk, 0.8, 1))); });
  // carbons on top of their bonds
  C.forEach(function(c){ h += sv("circle", { cx:c[0], cy:c[1], r:12, "class":"gl-c gl-kc" }) + txt(c[0], c[1] + 4.6, "C", "gl-ctx gl-kc", "middle"); });
  // names under the chains
  var np = anim && kk < 0.5 ? p0 : p1;
  if (np < 4) h += txt(170, YW + 36, nameAt(np), "gl-nm", "middle");
  else h += txt(170, YT + 31, nameAt(np, "t"), "gl-nm", "middle") + txt(170, YB + 31, nameAt(np, "b"), "gl-nm", "middle");
  // held: stalled for want of NAD⁺, or blocked
  if (o.held) {
    (p0 >= 4 ? [YT, YB] : [YW]).forEach(function(ly){
      if (o.held === "nad") h += sv("rect", { x:60, y:ly - 9.5, width:44, height:19, rx:9.5, "class":"gl-pl-miss" }) + txt(82, ly + 4.2, "NAD⁺?", "gl-plt gl-miss-t", "middle") + txt(82, ly - 15, "✗", "gl-miss-x", "middle");
      else h += sv("circle", { cx:98, cy:ly, r:12, "class":"gl-blk" }) + sv("line", { x1:90, y1:ly + 9, x2:106, y2:ly - 9, "class":"gl-blk" });
    });
    h += txt(10, SH - 28, heldText(o.held), "gl-held");
  }
  if (o.head) h += txt(10, SH - 8, o.head, "gl-hd");
  return h + fly;
}

// ---------- @component S3 energyLedger — tally strip (from SBI4U 08's tally): ATP spent / made / net, NADH, pyruvate, free NAD⁺,
// and the PFK gauge (--ink with a numeric label). ----------
function tally(n, col, hollow, cap){
  cap = cap || 16; var h = "";
  for (var i = 0; i < Math.min(n, cap); i++) h += "<i></i>";
  return '<span class="gl-tal' + (hollow ? " gl-hol" : "") + '" style="--c:var(' + col + ')" aria-hidden="true">' + h + (n > cap ? "<b>+" + (n - cap) + "</b>" : "") + "</span>";
}
function ledgerHTML(S, t){
  function cell(lab, val, extra, kind){ return '<div class="gl-cell' + (kind && kind === S.spot ? " on" : "") + (kind ? " gl-k-" + kind : "") + '"><span class="gl-cl">' + lab + "</span><b>" + val + "</b>" + (extra || "") + "</div>"; }
  var pf = PFK[S.atp];
  return '<div class="gl-lrow">' +
    cell("ATP spent", t.spent, tally(t.spent, "--bio-atp", true), "atp") + cell("ATP made", t.made, tally(t.made, "--bio-atp"), "atp") +
    cell("Net ATP", num(t.net), "", "atp") + cell("NADH", t.nadh, tally(t.nadh, "--bio-nadh"), "nadh") +
    cell("Pyruvate", t.pyr, tally(t.pyr, "--bio-carbon"), "carbon") + cell("Free NAD⁺", S.nad === "limited" ? t.free : "plenty", "", "") +
    '<div class="gl-cell gl-pfk"><span class="gl-cl">PFK activity</span><b>' + pf + '%</b><span class="gl-gauge" aria-hidden="true"><i style="width:' + pf + '%"></i></span></div></div>';
}

// ---------- Explore: Glycolysis stepper ----------
var EXF = null;
function explore(host, api){
  var C = api.content, S = api.S, X = C.steps;
  var D = { view:"summary", pos:0, g:1, spot:"none", nad:"plenty", pool:8, block:"none", atp:"normal", watch:1, a2:["", "", ""], a3:"" };
  Object.keys(D).forEach(function(k){ if (S[k] === undefined) S[k] = Array.isArray(D[k]) ? D[k].slice() : D[k]; });
  S.pos = clamp(+S.pos || 0, 0, 10); if (S.view === "summary" && STAGE_END.indexOf(S.pos) < 0) S.pos = 0;
  S.g = clamp(S.g, 1, gMax(S)); S.watch = clamp(S.watch, 1, S.g);
  var anim = null, disp = null, seq = null, playing = false, busy = false, pend = null, cap = "", liveSig = "", readSig = "";
  host.innerHTML = '<div class="gl-ex"><div class="gl-led" id="gl-led"></div>' +
    '<div class="pg gl-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="gl-main"><div class="gl-pathw" id="gl-path"></div><div class="gl-stw"><div class="gl-stage" id="gl-stage"></div><div class="gl-watch" id="gl-watch"></div>' +
        '<p class="tiny gl-key" aria-hidden="true"><span class="gl-kk gl-kk-c">C</span> carbon <span class="gl-kk gl-kk-p">P</span> phosphate from ATP <span class="gl-kk gl-kk-i">Pᵢ</span> phosphate from solution</p></div></div>' +
      '<p class="gl-cap" id="gl-cap" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div class="gl-player" id="gl-player" role="group" aria-label="Stepper controls (the arrow keys step too)">' +
        '<button type="button" class="btn ghost sm" data-pa="back" data-k="glback">Back</button><button type="button" class="btn primary sm" data-pa="step" data-k="glstep">Step</button>' +
        (MV.reduceMotion ? "" : '<button type="button" class="btn ghost sm" data-pa="play" data-k="glplay">Play</button>') + '<button type="button" class="btn ghost sm" data-pa="reset" data-k="glreset">Reset</button>' +
        '<span class="gl-ctr" id="gl-ctr"></span></div>' +
      '<div id="gl-view"></div><div id="gl-g"></div><div id="gl-spot"></div>' +
      '<div class="gl-panel"><div id="gl-nad"></div><div id="gl-pool"></div></div><div id="gl-block"></div><div id="gl-atp"></div>' +
      '<fieldset class="gl-ans"><legend>Answer boxes for the target challenges</legend>' +
        '<p class="gl-ansh">Challenge 2: your totals</p><div class="gl-ansrow">' + [["NADH", 0], ["Net ATP", 1], ["Pyruvate", 2]].map(function(q){
          return '<div class="numrow"><label for="gl-a2-' + q[1] + '">' + q[0] + ':</label><input class="numin" id="gl-a2-' + q[1] + '" data-ans="a2" data-ix="' + q[1] + '" type="text" inputmode="numeric" autocomplete="off"></div>'; }).join("") + "</div>" +
        '<p class="gl-ansh">Challenge 3: your net ATP</p><div class="gl-ansrow"><div class="numrow"><label for="gl-a3">Net ATP:</label><input class="numin" id="gl-a3" data-ans="a3" type="text" inputmode="numeric" autocomplete="off"></div></div></fieldset></div>' +
    '<div class="pg-read"><dl class="read gl-read" id="gl-read" aria-live="polite"></dl><p class="tiny muted gl-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div></div></div>";
  var led = $("#gl-led", host), stage = $("#gl-stage", host), pathEl = $("#gl-path", host), player = $("#gl-player", host);
  stage.innerHTML = '<svg viewBox="0 0 ' + SW + " " + SH + '" class="gl-svg" role="img" focusable="false" aria-label="Glycolysis stepper"></svg>';
  var svg = $("svg", stage);
  var viewR = radios($("#gl-view", host), { label:"View", options:[{ id:"summary", t:"Summary (4 stages)" }, { id:"all", t:"All 10 steps" }], value:S.view, onChange:function(v){ setting({ view:v }); } });
  var gS = stepper($("#gl-g", host), { id:"gl-gn", label:"Glucose molecules", min:1, max:gMax(S), value:S.g, unit:function(v){ return String(v); }, onChange:function(v){ setting({ g:v }); } });
  var spotR = radios($("#gl-spot", host), { label:"Spotlight", cls:"chips", aria:"Spotlight a kind of token", options:[{ id:"none", t:"None" }, { id:"carbon", t:"Carbon" }, { id:"phosphate", t:"Phosphate" }, { id:"atp", t:"ATP" }, { id:"nadh", t:"NADH" }], value:S.spot, onChange:function(v){ S.spot = v; api.save(); paintAll(); } });
  var nadR = radios($("#gl-nad", host), { label:"NAD⁺ supply", options:[{ id:"plenty", t:"Plenty (regenerated)" }, { id:"limited", t:"Limited pool" }], value:S.nad, onChange:function(v){ setting({ nad:v }); } });
  var poolS = slider($("#gl-pool", host), { id:"gl-poolr", label:"NAD⁺ pool (nothing regenerates it)", min:2, max:12, step:2, value:S.pool, unit:function(v){ return v + " NAD⁺"; }, onChange:function(v){ setting({ pool:v }); } });
  var blockR = radios($("#gl-block", host), { label:"Block a step", cls:"chips", options:[{ id:"none", t:"none" }, { id:"6", t:"step 6 (G3P dehydrogenase)" }, { id:"10", t:"step 10 (pyruvate kinase)" }], value:S.block, onChange:function(v){ setting({ block:v }); } });
  var atpR = radios($("#gl-atp", host), { label:"ATP level", options:[{ id:"low", t:"low" }, { id:"normal", t:"normal" }, { id:"high", t:"high" }], value:S.atp, onChange:function(v){ S.atp = v; api.save(); cap = "ATP level " + v + ": PFK activity " + PFK[v] + "% (model)." + (v === "high" ? " Plenty of ATP turns glycolysis down." : v === "low" ? " Low ATP lets PFK run flat out." : ""); paintAll(); } });
  var watchR = radios($("#gl-watch", host), { label:"Watch glucose", cls:"chips", options:[{ id:1, t:"1" }], value:S.watch, onChange:function(v){ S.watch = +v; api.save(); cap = capFor(S.pos); paintStage(); paintCap(); } });
  $$("[data-ans]", host).forEach(function(inp){ inp.value = inp.dataset.ans === "a2" ? (S.a2[+inp.dataset.ix] || "") : (S.a3 || ""); });
  host.addEventListener("input", function(e){
    var k = e.target.dataset && e.target.dataset.ans; if (!k) return;
    if (k === "a2") S.a2[+e.target.dataset.ix] = e.target.value; else S.a3 = e.target.value;
    api.save(); MV.changed();
  });
  player.addEventListener("click", function(e){ var b = e.target.closest("[data-pa]"); if (b && !b.disabled) act(b.dataset.pa); });
  player.addEventListener("keydown", function(e){
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault(); act(e.key === "ArrowLeft" ? "back" : "step");
  });
  pathEl.addEventListener("click", function(e){ var b = e.target.closest("[data-go]"); if (!b || b.disabled || busy) return; var n = +b.dataset.go; stopAll(); go(n, n === nextPos()); });

  // ---- positions and moves ----
  function nextPos(){ if (S.view === "all") return Math.min(10, S.pos + 1); for (var i = 0; i < STAGE_END.length; i++) if (STAGE_END[i] > S.pos) return STAGE_END[i]; return 10; }
  function prevPos(){ if (S.view === "all") return Math.max(0, S.pos - 1); for (var i = STAGE_END.length - 1; i >= 0; i--) if (STAGE_END[i] < S.pos) return STAGE_END[i]; return 0; }
  function act(a){
    if (busy) return;
    if (a === "play") { if (playing) { stopAll(); paintAll(); } else play(); return; }
    stopAll();
    if (a === "step") go(nextPos(), true);
    else if (a === "back") go(prevPos(), false);
    else { S.pos = 0; cap = ""; api.save(); paintAll(); MV.changed(); }
  }
  function stopAll(){
    playing = false;
    if (anim) { anim(); anim = null; }
    if (seq) { S.pos = seq.to; seq = null; }
    disp = null;
    if (pend) { var d = pend; pend = null; busy = false; d(); }
  }
  // run from S.pos to n one step at a time (dur ms per step); S.pos lands after each step
  function go(n, animate, dur, done){
    n = clamp(n, 0, 10);
    if (!animate || n <= S.pos || MV.reduceMotion) { S.pos = n; cap = capFor(n); api.save(); paintAll(); MV.changed(); if (done) done(); return; }
    var per = dur || (n - S.pos > 1 ? 700 : 1300);
    seq = { to:n };
    (function next(){
      if (!seq) return;
      if (S.pos >= seq.to) { seq = null; cap = capFor(S.pos); paintAll(); MV.changed(); if (done) done(); return; }
      var from = S.pos; disp = { from:from, k:0 }; paintPlayer();
      anim = MV.tween({ dur:per, ease:lin, step:function(k){ if (disp) { disp.k = k; paintStage(); } }, done:function(){
        anim = null; disp = null; S.pos = from + 1; api.save(); cap = capFor(S.pos); paintAll(); MV.changed();
        if (seq) MV.wait(S.pos >= seq.to ? 0 : 160, next);
      } });
    })();
  }
  function play(){
    stopAll();
    if (S.pos >= 10) S.pos = 0;
    playing = true; paintPlayer();
    (function next(){
      if (!playing) return;
      if (S.pos >= 10) { playing = false; paintAll(); return; }
      go(nextPos(), true, S.view === "all" ? 1300 : 750, function(){ if (playing) MV.wait(450, next); });
    })();
  }
  function setting(patch){
    stopAll();
    Object.keys(patch).forEach(function(k){ S[k] = patch[k]; });
    if (patch.view === "summary" && STAGE_END.indexOf(S.pos) < 0) { var p = 0; STAGE_END.forEach(function(e){ if (e <= S.pos) p = e; }); S.pos = p; }
    if (S.g > gMax(S)) S.g = gMax(S);
    S.watch = clamp(S.watch, 1, S.g);
    if (patch.nad) cap = patch.nad === "limited" ? "Limited pool: " + S.pool + " NAD⁺, and nothing regenerates it. Each glucose needs 2 at step 6." : "Plenty of NAD⁺: the chain (or fermentation) keeps regenerating it.";
    else if (patch.pool) cap = "NAD⁺ pool: " + S.pool + ". That’s enough for " + Math.floor(S.pool / 2) + " glucose.";
    else if (patch.block) cap = patch.block === "none" ? "No step blocked." : "Step " + patch.block + " is blocked: every molecule stops at step " + (+patch.block - 1) + ".";
    else if (patch.g) cap = S.g + " glucose. Everything after the split happens twice per glucose.";
    else cap = capFor(S.pos);
    api.save(); paintAll(); MV.changed();
  }
  function capFor(p){
    if (p === 0) return "Glucose waits in the cytosol. Press Step.";
    var t = model(S), w = t.list[S.watch - 1];
    if (w && w.held) return "Glucose " + S.watch + ": " + heldText(w.why).replace(/^[✗⊘] /, "") + ". " + (w.why === "nad" ? "Its 2 ATP were already spent." : "Every molecule stops at step " + w.L + ".");
    if (S.view === "summary") { var k = STAGE_END.indexOf(p), st = C.stages[k - 1]; if (st) return "Stage " + st.n + " · " + st.name + " (" + st.t + ")."; }
    var x = X[p - 1];
    return "Step " + x.n + " · " + x.e + ": " + x.r + " (" + x.tok + ").";
  }

  // ---- painting ----
  function curLabel(){
    if (S.view === "summary") { var k = STAGE_END.indexOf(S.pos); return k <= 0 ? "Start · nothing yet" : "Stage " + k + " · " + C.stages[k - 1].name + " (" + C.stages[k - 1].t.split(":")[0] + ")"; }
    return S.pos === 0 ? "Start · nothing yet" : S.pos + " · " + X[S.pos - 1].e;
  }
  function paintPlayer(){
    var moving = !!disp || !!seq;
    $$("[data-pa]", player).forEach(function(b){
      var a = b.dataset.pa;
      b.disabled = busy || (a === "back" && S.pos === 0 && !moving) || (a === "step" && S.pos >= 10 && !moving) || (a === "reset" && S.pos === 0 && !moving);
      if (a === "play") b.textContent = playing ? "Pause" : "Play";
    });
    var tot = S.view === "all" ? 10 : 4, i = S.view === "all" ? S.pos : STAGE_END.indexOf(S.pos);
    $("#gl-ctr", host).textContent = (S.view === "all" ? "Step " : "Stage ") + i + " of " + tot;
  }
  function paintStage(){
    var t = model(S), w = t.list[S.watch - 1] || t.list[0], held = w.held ? w.why : null, p = w.p, k = null;
    if (disp && !held) { if (disp.from < w.L) { p = disp.from; k = disp.k; } }
    var head = "Glucose " + S.watch + " of " + S.g + " · cytosol";
    svg.setAttribute("class", "gl-svg" + (S.spot !== "none" ? " gl-spot gl-sp-" + S.spot : ""));
    svg.innerHTML = sv("rect", { x:0.5, y:0.5, width:SW - 1, height:SH - 1, rx:10, "class":"gl-bg" }) + stageSVG(p, k, { held:held, head:head });
    if (!disp) svg.setAttribute("aria-label", describe(t, w));
  }
  function describe(t, w){
    var p = w.p, d = "Glucose " + S.watch + " of " + S.g + (p ? ", after step " + p + " (" + X[p - 1].e + ")" : ", before step 1") + ": ";
    d += p < 4 ? "one 6-carbon chain, " + NAMES[p] : p === 4 ? "two 3-carbon pieces, DHAP and G3P" : "two 3-carbon pieces, " + NAMES[p] + " each";
    var fromATP = PH.filter(function(x){ return x.src === "atp" && x.at(p) >= 0; }).length, fromPi = PH.filter(function(x){ return x.src === "pi" && x.at(p) >= 0; }).length;
    d += ". Phosphates on the sugar: " + (fromATP + fromPi) + (fromATP + fromPi ? " (" + fromATP + " from ATP" + (fromPi ? ", " + fromPi + " from solution" : "") + ")" : "") + ".";
    if (w.held) d += " " + heldText(w.why).replace(/^[✗⊘] /, "") + ".";
    return d + " Totals: ATP spent " + t.spent + ", made " + t.made + ", net " + MV.plain(num(t.net)) + "; NADH " + t.nadh + "; pyruvate " + t.pyr + ".";
  }
  function paintLedger(){ led.innerHTML = ledgerHTML(S, model(S)); }
  function paintPath(){
    var h = "";
    function btn(n, lab, cur, done, extra, blocked){ return '<li><button type="button" class="gl-sb' + (cur ? " cur" : "") + (done ? " done" : "") + (blocked ? " blk" : "") + '" data-go="' + n + '" data-k="go' + n + '"' + (cur ? ' aria-current="step"' : "") + (busy ? " disabled" : "") + ">" + lab + (cur && extra ? '<span class="gl-sd">' + extra + "</span>" : "") + "</button></li>"; }
    if (S.view === "all") {
      [[1, 5, "Investment phase (steps 1–5)"], [6, 10, "Payoff phase (steps 6–10, twice per glucose)"]].forEach(function(ph){
        h += '<p class="gl-phh">' + ph[2] + '</p><ol class="gl-path" start="' + ph[0] + '">';
        for (var n = ph[0]; n <= ph[1]; n++) { var x = X[n - 1], bl = S.block === String(n);
          h += btn(n, '<span class="gl-sn">' + n + '</span><span class="gl-se">' + x.e + (bl ? ' <span class="gl-bltag">⊘ blocked</span>' : "") + "</span>", S.pos === n, n < S.pos, x.r + '<small>' + x.tok + "</small>", bl); }
        h += "</ol>";
      });
    } else {
      h += '<p class="gl-phh">The four stages</p><ol class="gl-path">';
      C.stages.forEach(function(st, i){ var e = STAGE_END[i + 1], bl = (S.block === "6" && st.n === 3) || (S.block === "10" && st.n === 4);
        h += btn(e, '<span class="gl-sn">' + st.n + '</span><span class="gl-se">' + st.name + (bl ? ' <span class="gl-bltag">⊘ blocked</span>' : "") + "</span>", S.pos === e, e < S.pos, st.t + "<small>" + X.slice(STAGE_END[i], e).map(function(x){ return x.e; }).join(", ") + "</small>", bl); });
      h += "</ol>";
    }
    MV.keepFocus(pathEl, function(){ pathEl.innerHTML = h; });
  }
  function paintWatch(){
    var t = model(S), wh = $("#gl-watch", host);
    wh.hidden = S.g < 2;
    var opts = t.list.map(function(x, i){ return { id:i + 1, t:String(i + 1) + (x.held ? " ✗" : ""), aria:"Glucose " + (i + 1) + (x.held ? ", " + heldText(x.why).replace(/^[✗⊘] /, "") : "") }; });
    watchR.set(S.watch); watchR.setOptions(opts); watchR.disable(busy);
  }
  function paintRead(){
    var t = model(S), parts = [];
    if (t.c6) parts.push(t.c6 + " × 6C"); if (t.c3) parts.push(t.c3 + " × 3C" + (t.pyr && t.pyr === t.c3 ? " (pyruvate)" : ""));
    var ph = String(t.phos);
    if (t.phos && !t.c6 && t.phos === t.c3) ph += " (one on each 3C)"; else if (t.phos && !t.c6 && t.phos === 2 * t.c3) ph += " (two on each 3C)"; else if (t.phos && !t.c3 && t.phos === 2 * t.c6) ph += " (two on each 6C)";
    var rows = [["Step / enzyme", curLabel()], ["Location", "Cytosol"], ["Carbon chains", parts.join(", ")], ["Phosphates on sugars", ph],
      ["ATP spent / made / net", t.spent + " / " + t.made + " / " + num(t.net)], ["NADH made", t.nadh], ["Pyruvate made", t.pyr],
      ["Free NAD⁺", S.nad === "limited" ? String(t.free) : "— (plenty)"], ["PFK activity (model)", PFK[S.atp] + "%"], ["Status", statusText(S, t)]];
    var h = MV.readoutHTML(rows); if (h !== readSig) { readSig = h; $("#gl-read", host).innerHTML = h; }
  }
  function paintCap(){ $("#gl-cap", host).innerHTML = cap || capFor(S.pos); }
  function sync(){
    viewR.set(S.view); gS.setMax(gMax(S)); gS.set(S.g); spotR.set(S.spot); nadR.set(S.nad); poolS.set(S.pool); blockR.set(S.block); atpR.set(S.atp);
    $("#gl-pool", host).hidden = S.nad !== "limited";
    [viewR, spotR, nadR, blockR, atpR].forEach(function(r){ r.disable(busy); }); gS.disable(busy); poolS.disable(busy);
    $$("[data-ans]", host).forEach(function(i){ i.disabled = busy; });
  }
  function paintAll(){ sync(); paintPlayer(); paintLedger(); paintPath(); paintWatch(); paintStage(); paintRead(); paintCap(); }
  function stickTop(){
    var hd = document.querySelector("header.top"); if (!hd) return;
    var top = (parseFloat(getComputedStyle(hd).top) || 0) + hd.getBoundingClientRect().height;
    led.style.setProperty("--gl-top", Math.round(top) + "px");
  }
  window.addEventListener("resize", stickTop);
  stickTop(); paintAll();

  // ---- target challenges (plan: exact tests and named wrong states) ----
  function chal(id){
    var c = byId(C.challenges, id), N = c.named || {}, t = model(S);
    if (id === "tc1") {
      if (S.view !== "all") return { ok:false, msg:N.view };
      if (S.g !== 1) return { ok:false, msg:N.g };
      if (S.block !== "none") return { ok:false, msg:N.block };
      if (S.pos === 7 && t.net === 0) return { ok:true };
      if (S.pos === 6) return { ok:false, msg:N.s6 };
      if (S.pos === 10) return { ok:false, msg:N.s10 };
      if (S.pos === 8 || S.pos === 9) return { ok:false, msg:N.late };
      if (S.pos === 0) return { ok:false, msg:N.start };
      return { ok:false, msg:N.neg + " Net ATP now: " + num(t.net) + "." };
    }
    if (id === "tc2") {
      var v = S.a2.map(parseVal);
      if (v.some(function(x){ return x == null; })) return { ok:false, msg:N.blank };
      if (v[0] === 6 && v[1] === 6 && v[2] === 6) return { ok:true };
      if (v[0] === 3) return { ok:false, msg:N.nadh };
      if (v[1] === 12) return { ok:false, msg:N.atp };
      if (v[2] === 3) return { ok:false, msg:N.pyr };
      return { ok:false, msg:c.general };
    }
    if (id === "tc3") {
      if (S.nad !== "limited" || S.pool !== 8) return { ok:false, msg:N.pool };
      if (S.g === 5) return { ok:false, msg:N.g5 };
      if (S.g === 8) return { ok:false, msg:N.g8 };
      var e = parseVal(S.a3);
      if (S.g === 4) { if (e === 8) return { ok:true }; if (e == null) return { ok:false, msg:N.blank }; if (e === 16) return { ok:false, msg:N.e16 }; }
      return { ok:false, msg:c.general };
    }
    return { ok:false };
  }
  EXF = { show:function(v){ if (v) { stickTop(); paintAll(); } else if (playing) { stopAll(); paintAll(); } } };
  return {
    predict:{
      start:function(p){
        stopAll(); busy = true;
        var s = p.start; S.view = s.view; S.g = 1; S.nad = "plenty"; S.block = s.block; S.spot = s.spot; S.pos = s.pos; S.watch = 1;
        cap = ""; api.save(); paintAll(); MV.changed();
      },
      run:function(p, done){
        pend = done;
        go(p.to, true, p.id === "p4" ? 520 : p.id === "p3" ? 1800 : 1100, function(){
          busy = false; cap = p.reveal; paintAll();
          var d = pend; pend = null; if (d) MV.wait(250, d);
        });
      }
    },
    challenge:chal
  };
}

// ---------- hero: storyboard (plan) — glucose enters, 2 ATP prime it, it splits, Pᵢ + NADH, 4 ATP, two pyruvate + tally ----------
function hero(f){
  var box = $("#gl-hero"); if (!box) return;
  var cap = f && f.cap, last = -1, HW = 400, HH = 290;
  var CAPS = ["A glucose (6C) enters the cytosol.", "Two ATP each leave a phosphate on the sugar: −2 ATP.", "The sugar, now with a phosphate at each end, splits into two 3-carbon pieces.",
    "Each piece picks up a Pᵢ from solution and loads an NADH: +2 NADH.", "Each piece hands both its phosphates to ADP: +4 ATP.", "Two pyruvate remain. Net 2 ATP, 2 NADH, 2 pyruvate."];
  box.innerHTML = '<svg viewBox="0 0 ' + HW + " " + HH + '" class="gl-hsvg" aria-hidden="true" focusable="false"></svg>';
  var svg = $("svg", box);
  function setCap(i){ if (cap && i !== last) { cap.textContent = CAPS[i]; last = i; } }
  function hex(x, y, a){ var pts = []; for (var i = 0; i < 6; i++) { var an = i * Math.PI / 3; pts.push(f1(x + 34 * Math.cos(an)) + "," + f1(y + 34 * Math.sin(an))); } return op(a, sv("polygon", { points:pts.join(" "), "class":"gl-hc" }) + txt(x, y + 6, "6C", "gl-hct", "middle")); }
  function piece(x, y, a){ return op(a, sv("rect", { x:x - 32, y:y - 15, width:64, height:30, rx:9, "class":"gl-hc" }) + txt(x, y + 5.5, "3C", "gl-hct", "middle")); }
  function tri(x, y, a){ return op(a, sv("polygon", { points:f1(x - 34) + "," + f1(y + 17) + " " + f1(x + 34) + "," + f1(y + 17) + " " + x + "," + f1(y - 21), "class":"gl-hc" }) + txt(x, y + 11, "3C", "gl-hct", "middle")); }
  function P(src, x, y, a){ return phosSVG(src, [x, y], null, a); }
  var TRAY = { n:[[64, 262], [118, 262]], a:[[190, 262], [236, 262], [282, 262], [328, 262]] };
  // the four ATP made: [P source, P position, ADP comes from x, piece]
  var MADE = [["pi", 244, 80, 430], ["pi", 156, 178, -30], ["atp", 156, 80, -30], ["atp", 244, 178, 430]];
  function scene(T){
    var h = sv("rect", { x:1, y:1, width:HW - 2, height:HH - 2, rx:14, "class":"gl-hbg" }) + txt(14, 22, "cytosol", "gl-hlab");
    var sp = T < 3.8 ? 0 : T < 5.4 ? ez(seg(T, 3.8, 5.4)) : 1;
    // the sugar
    if (T < 4.6) { var gx = T < 1.2 ? lerp(-50, 200, ez(T / 1.2)) : 200; h += hex(gx, 120, 1 - seg(T, 3.8, 4.6)); }
    var yA = lerp(120, 80, sp), yB = lerp(120, 178, sp), aP = seg(T, 3.9, 4.5), toTri = seg(T, 11.6, 12.4);
    if (T >= 3.8) { h += piece(200, yA, aP * (1 - toTri)) + piece(200, yB, aP * (1 - toTri)); if (toTri > 0) h += tri(200, 80, toTri) + tri(200, 178, toTri); }
    // priming phosphates (orange) and the two ATP that bring them
    [[1.2, 2.2, -30, 148, 120, 156, yA], [2.2, 3.2, 430, 252, 120, 244, yB]].forEach(function(q, j){
      var t0 = q[0], t1 = q[1], dir = j ? -1 : 1, px = q[3], tx = sp > 0 ? lerp(q[3], q[5], sp) : q[3], ty = sp > 0 ? q[6] : 120;
      if (T >= t0 && T < t1) { var u = ez(seg(T, t0, t1 - 0.2)), cx = lerp(q[2], px - 30 * dir, u); h += pill(T < t1 - 0.15 ? "atp" : "adp", cx, 120); h += P("atp", T < t1 - 0.2 ? cx + 30 * dir : lerp(cx + 30 * dir, px, seg(T, t1 - 0.2, t1)), 120); }
      if (T >= t1 && T < t1 + 0.8) { var r = ez(seg(T, t1, t1 + 0.8)); h += pill("adp", px - 30 * dir, lerp(120, 34, r), 1 - seg(T, t1 + 0.5, t1 + 0.8)); }
      var gone = MADE.some(function(m, mi){ return m[0] === "atp" && Math.abs(m[1] - q[5]) < 1 && Math.abs(m[2] - (j ? 178 : 80)) < 1 && T >= 7.6 + mi + 0.45; });
      if (T >= t1 && !gone) h += P("atp", tx, ty);
    });
    // Pᵢ from solution (grey) and NADH
    [[244, 80, 430], [156, 178, -30]].forEach(function(q, j){
      var gone = T >= 7.6 + j + 0.45;
      if (T >= 5.4 && !gone) { var w = ez(seg(T, 5.4, 6.3)); h += P("pi", lerp(q[2], q[0], w), q[1]); }
      if (T >= 6.4) { var r = ez(seg(T, 6.4, 7.4)), nx = lerp(200, TRAY.n[j][0], r), ny = lerp(q[1] + (j ? 26 : -26), TRAY.n[j][1], r); h += pill("nadh", nx, ny); }
    });
    // four ATP made, one at a time
    MADE.forEach(function(m, mi){
      var t0 = 7.6 + mi;
      if (T < t0) return;
      var dir = m[3] < 0 ? 1 : -1, dock = m[1] - 30 * dir;
      if (T < t0 + 0.45) h += pill("adp", lerp(m[3], dock, ez(seg(T, t0, t0 + 0.4))), m[2]);
      else if (T < t0 + 1) { var r = ez(seg(T, t0 + 0.5, t0 + 1)); h += pill("atp", lerp(dock, TRAY.a[mi][0], r), lerp(m[2], TRAY.a[mi][1], r)); }
      else h += pill("atp", TRAY.a[mi][0], TRAY.a[mi][1]);
    });
    // running labels
    var spent = T >= 3.2 ? 2 : T >= 2.2 ? 1 : 0, made = clamp(Math.floor(T - 7.6 + 0.55), 0, 4) * (T >= 8.1 ? 1 : 0);
    if (spent) h += txt(HW - 14, 26, "−" + spent + " ATP", "gl-hnum", "end");
    if (T >= 6.4) h += txt(HW - 14, 46, "+2 NADH", "gl-hnum", "end");
    if (made) h += txt(HW - 14, 66, "+" + made + " ATP", "gl-hnum", "end");
    if (T >= 6.4) h += txt(14, 244, "made:", "gl-hlab");
    // tally
    if (T >= 12.2) { var a = seg(T, 12.2, 12.9); h += op(a, sv("rect", { x:82, y:113, width:236, height:30, rx:8, "class":"gl-htal" }) + txt(200, 133, "net 2 ATP · 2 NADH · 2 pyruvate", "gl-htalt", "middle")); }
    // captions
    setCap(T < 1.2 ? 0 : T < 3.8 ? 1 : T < 5.4 ? 2 : T < 7.6 ? 3 : T < 11.6 ? 4 : 5);
    return h;
  }
  function draw(T){ svg.innerHTML = scene(T); }
  if (MV.reduceMotion) { draw(14); return; }
  draw(0);
  MV.tween({ dur:14000, ease:lin, step:function(k){ draw(k * 14); }, done:function(){ draw(14); } });
}

// ---------- Part 3: Two ways to make ATP ----------
// @component enzymeZoom (copied from SBI4U 10) — schematic enzyme with an active-site pocket, an optional allosteric notch and a
// bent-shut site. enzymeSVG(cx, cy, scale, {g 0…1 grip, shut 0…1, allo, inh, inhCls, inner}) — local body ±96 × ±54, mouth at y = −50.
function crPath(pts){
  var d = "";
  for (var i = 0; i < pts.length - 1; i++) {
    var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += " C" + f1(p1[0] + (p2[0] - p0[0]) / 6) + " " + f1(p1[1] + (p2[1] - p0[1]) / 6) + " " + f1(p2[0] - (p3[0] - p1[0]) / 6) + " " + f1(p2[1] - (p3[1] - p1[1]) / 6) + " " + f1(p2[0]) + " " + f1(p2[1]);
  }
  return d;
}
var FIT = [[-20, -50], [-20, -40], [0, -20], [20, -40], [20, -50]], OPEN = [[-28, -50], [-28, -44], [0, -27], [28, -44], [28, -50]], SHUT = [[-5, -50], [-5, -47], [0, -42], [5, -47], [5, -50]];
function enzPathD(o){
  var g = o.g || 0, s = o.shut || 0;
  var pk = OPEN.map(function(p, i){ return [lerp(p[0], FIT[i][0], g), lerp(p[1], FIT[i][1], g)]; });
  pk = pk.map(function(p, i){ return [lerp(p[0], SHUT[i][0], s), lerp(p[1], SHUT[i][1], s)]; });
  var lip = 7 * g * (1 - s); pk[0][1] -= lip; pk[4][1] -= lip;
  var right = [[45, -54], [80, -42], [96, -6], [86, 30], [62, 47]], left = [[0, 52], [-44, 49], [-84, 32], [-96, -4], [-80, -42], [-45, -54]];
  var path = "M" + f1(pk[4][0]) + " " + f1(pk[4][1]) + crPath([pk[4]].concat(right));
  if (o.allo) path += " L52 33 L40 48" + crPath([[40, 48]].concat(left, [pk[0]]));
  else path += crPath([right[right.length - 1], [52, 49]].concat(left, [pk[0]]));
  return path + " L" + pk.slice(1, 4).map(function(p){ return f1(p[0]) + " " + f1(p[1]); }).join(" L") + " Z";
}
function enzymeSVG(cx, cy, sc, o){
  o = o || {};
  var h = sv("path", { d:enzPathD(o), "class":o.cls || "gl-enz", "vector-effect":"non-scaling-stroke" });
  if (o.inh) h += sv("polygon", { points:"42,48 52,36 62,47", "class":o.inhCls || "gl-allo", "vector-effect":"non-scaling-stroke" });
  if (o.inner) h += o.inner;
  return '<g transform="translate(' + f1(cx) + " " + f1(cy) + ") scale(" + sc + ')">' + h + "</g>";
}
// phosphoglycerate kinase for station 1: a wide cleft that holds the substrate and ADP side by side
var PGK = "M40 150 C40 108 66 92 94 92 L112 92 C120 92 122 98 124 106 L127 128 C129 137 136 141 146 141 L214 141 C224 141 231 137 233 128 L236 106 C238 98 240 92 248 92 L266 92 C294 92 320 108 320 150 C320 188 280 204 180 204 C80 204 40 188 40 150 Z";
function part3(host, api){
  var P = api.content, S = api.S;
  S.tbl = S.tbl || { cells:{}, checked:false }; if (S.cond == null) S.cond = "high"; if (S.x == null) S.x = 6;
  var T = P.table;
  host.innerHTML = '<div class="gl-p3">' +
    '<section class="gl-st" aria-labelledby="gl-h1"><h3 id="gl-h1">' + P.st1.title + "</h3><p>" + P.st1.how + "</p>" +
      '<div class="gl-row"><figure class="gl-fig"><div class="gl-pstage"><svg id="gl-s1" viewBox="0 0 360 214" role="img" focusable="false"></svg></div><figcaption class="gl-pcap" id="gl-c1" aria-live="polite"></figcaption><div id="gl-pl1"></div></figure>' +
      '<div class="gl-side"><p class="gl-big">' + P.st1.cap + '</p><p class="tiny gl-leg"><span class="gl-kk gl-kk-c">C</span> carbon <span class="gl-kk gl-kk-p">P</span> phosphate from ATP <span class="gl-kk gl-kk-i">Pᵢ</span> phosphate added from solution at step 6 (the high-energy one)</p></div></div></section>' +
    '<section class="gl-st" aria-labelledby="gl-h2"><h3 id="gl-h2">' + P.st2.title + "</h3><p>" + P.st2.how + "</p>" +
      '<div class="gl-row"><figure class="gl-fig"><div class="gl-pstage"><svg id="gl-s2" viewBox="0 0 360 214" role="img" focusable="false"></svg></div><figcaption class="gl-pcap" id="gl-c2" aria-live="polite"></figcaption><div id="gl-pl2"></div></figure>' +
      '<div class="gl-side"><p class="gl-big">' + P.st2.cap + "</p></div></div></section>" +
    '<section class="gl-st" aria-labelledby="gl-h4"><h3 id="gl-h4">' + T.title + "</h3><p>" + T.how + '</p><div id="gl-tbl"></div></section>' +
    '<section class="gl-st" aria-labelledby="gl-h3"><h3 id="gl-h3">' + P.st3.title + "</h3><p>" + P.st3.how + "</p>" +
      '<div class="gl-row"><div class="gl-gw"><div class="plot-wrap"><canvas class="plot" id="gl-pfk" role="img" aria-label="PFK activity against fructose-6-phosphate"></canvas></div><div id="gl-x"></div><dl class="read gl-pread" id="gl-r3" aria-live="polite"></dl></div>' +
        '<div class="gl-side"><div id="gl-cond"></div><div class="gl-pstage"><svg id="gl-s3" viewBox="0 0 520 220" role="img" focusable="false"></svg></div><p class="tiny" id="gl-cd" aria-live="polite"></p><p>' + P.st3.text + '</p><p class="tiny">' + P.st3.link + "</p></div></div>" +
      '<details class="alg gl-data"><summary>Check it with data</summary><p class="tiny muted"><span class="bio-model">Model data</span> ' + P.st3.model + '</p><div id="gl-tb3"></div></details></section></div>';

  // ---- Station 1: step 7 slowed down (substrate-level phosphorylation) ----
  var s1 = $("#gl-s1", host), s1Prev = null, s1Anim = null;
  var S1 = [{ px:184, py:96, a:1, pill:"adp", bx:214, by:124, nm:"1,3-bisphosphoglycerate" }, { px:226, py:100, a:1, pill:"adp", bx:214, by:124, nm:"1,3-bisphosphoglycerate" }, { px:226, py:100, a:0, pill:"atp", bx:300, by:34, nm:"3-phosphoglycerate" }];
  function s1Draw(from, to, k){
    var a = S1[from], b = S1[to], e = ez(k), q = { px:lerp(a.px, b.px, e), py:lerp(a.py, b.py, e) - (to === 1 && from === 0 ? 18 * Math.sin(Math.PI * e) : 0), a:lerp(a.a, b.a, e), bx:lerp(a.bx, b.bx, e), by:lerp(a.by, b.by, e) };
    var h = sv("rect", { x:0.5, y:0.5, width:359, height:213, rx:8, "class":"gl-bg" }) + sv("path", { d:PGK, "class":"gl-enz" }) + txt(180, 180, "phosphoglycerate kinase", "gl-plab", "middle");
    [[140, 124], [162, 124], [184, 124]].forEach(function(c, i){ if (i) h += sv("line", { x1:c[0] - 22, y1:124, x2:c[0], y2:124, "class":"gl-bond" }); });
    h += phosSVG("atp", [140, 96], [140, 124]);
    var onSub = to === 0;
    if (q.a > 0.02) h += phosSVG("pi", [q.px, q.py], onSub ? [184, 124] : null, q.a);
    if (onSub) h += txt(193, 110, "~", "gl-hie");
    [[140, 124], [162, 124], [184, 124]].forEach(function(c){ h += sv("circle", { cx:c[0], cy:c[1], r:9.5, "class":"gl-c" }) + txt(c[0], c[1] + 4, "C", "gl-ctx", "middle"); });
    var pk = to === 2 && k > 0.5 ? "atp" : "adp";
    h += pill(pk, q.bx, q.by);
    h += txt(16, 26, (to === 2 && k > 0.5 ? b.nm : a.nm), "gl-plab gl-plab-b");
    s1.innerHTML = h;
    $("#gl-c1", host).innerHTML = "<strong>Step " + (to + 1) + ".</strong> " + P.st1.steps[to];
    s1.setAttribute("aria-label", "Frame " + (to + 1) + " of 3. " + P.st1.steps[to]);
  }
  function s1Go(i){
    if (s1Anim) { s1Anim(); s1Anim = null; }
    var from = s1Prev; s1Prev = i;
    if (from === null || i !== from + 1 || MV.reduceMotion) { s1Draw(i, i, 1); return; }
    s1Anim = MV.tween({ dur:1300, ease:lin, step:function(k){ s1Draw(from, i, k); }, done:function(){ s1Anim = null; s1Draw(i, i, 1); } });
  }
  MV.player($("#gl-pl1", host), { count:3, render:s1Go, label:function(i){ return "Step " + (i + 1) + " of 3: " + P.st1.short[i]; }, interval:2600 });

  // ---- Station 2: ATP synthase preview (oxidative phosphorylation) ----
  var s2 = $("#gl-s2", host), s2Prev = null, s2Anim = null, rng = MV.bio.rng("gl-h+"), HP = [];
  while (HP.length < 13) { var x = rng.range(18, 342), y = rng.range(16, 64); if (Math.abs(x - 180) < 34) continue; if (HP.some(function(p){ return Math.hypot(p[0] - x, p[1] - y) < 25; })) continue; HP.push([x, y]); }
  var LOW = [[60, 196], [330, 140]], FLOW = [[[150, 52], [180, 76], [180, 118], [96, 146]], [[214, 40], [180, 76], [180, 118], [244, 140]], [[120, 30], [180, 76], [180, 118], [126, 136]]];
  function s2Draw(from, to, k){
    var h = sv("rect", { x:0.5, y:0.5, width:359, height:213, rx:8, "class":"gl-bg" }), e = k;
    h += sv("rect", { x:1, y:80, width:358, height:36, "class":"gl-mem" }) + sv("line", { x1:1, y1:80, x2:359, y2:80, "class":"gl-meml" }) + sv("line", { x1:1, y1:116, x2:359, y2:116, "class":"gl-meml" });
    h += txt(10, 76, "intermembrane space", "gl-plab gl-plab-s") + txt(10, 132, "matrix", "gl-plab gl-plab-s") + txt(350, 102, "inner membrane", "gl-plab gl-plab-s", "end");
    // ATP synthase: channel, rotor, stalk, head
    var rot = (to >= 1 ? (from === 0 && to === 1 ? e : 1) * 240 : 0) + (to === 2 ? (from === 1 ? e : 1) * 240 : 0);
    h += sv("rect", { x:164, y:72, width:32, height:52, rx:6, "class":"gl-syn" }) + sv("line", { x1:180, y1:124, x2:180, y2:142, "class":"gl-synl" }) + sv("ellipse", { cx:180, cy:162, rx:34, ry:20, "class":"gl-syn" });
    var sp = ""; for (var i = 0; i < 3; i++) { var an = (rot + i * 120) * Math.PI / 180; sp += sv("line", { x1:180, y1:162, x2:f1(180 + 26 * Math.cos(an)), y2:f1(162 + 14 * Math.sin(an)), "class":"gl-synl" }); }
    h += sp + txt(222, 196, "ATP synthase", "gl-plab gl-plab-s");
    // H⁺: high above, low below; three flow through
    var flowK = to === 1 ? (from === 0 ? e : 1) : to === 2 ? 1 : 0;
    HP.forEach(function(p, j){ if (j < 3) return; h += hion(p[0], p[1]); });
    FLOW.forEach(function(path, j){ var u = to === 0 ? 0 : ez(seg(flowK, j * 0.15, 0.7 + j * 0.15)); var q = polyAt(path, u); h += hion(q[0], q[1]); });
    LOW.forEach(function(p){ h += hion(p[0], p[1]); });
    // ADP + Pᵢ → ATP at the head
    var mk = to === 2 ? (from === 1 ? e : 1) : 0;
    if (mk < 0.5) { h += pill("adp", lerp(96, 150, ez(seg(mk, 0, 0.5))), 176) + phosSVG("pi", [lerp(116, 166, ez(seg(mk, 0, 0.5))), 198], null); }
    else { var r = ez(seg(mk, 0.5, 1)); h += pill("atp", lerp(150, 300, r), lerp(176, 166, r)); }
    s2.innerHTML = h;
    $("#gl-c2", host).innerHTML = "<strong>Step " + (to + 1) + ".</strong> " + P.st2.steps[to];
    s2.setAttribute("aria-label", "Frame " + (to + 1) + " of 3. A membrane with H⁺ packed in the intermembrane space above and few H⁺ in the matrix below. ATP synthase crosses the membrane. " + P.st2.steps[to]);
  }
  function hion(x, y){ return sv("circle", { cx:f1(x), cy:f1(y), r:10, "class":"gl-hp" }) + txt(x, y + 4, "H⁺", "gl-hpt", "middle"); }
  function s2Go(i){
    if (s2Anim) { s2Anim(); s2Anim = null; }
    var from = s2Prev; s2Prev = i;
    if (from === null || i !== from + 1 || MV.reduceMotion) { s2Draw(i, i, 1); return; }
    s2Anim = MV.tween({ dur:1800, ease:lin, step:function(k){ s2Draw(from, i, k); }, done:function(){ s2Anim = null; s2Draw(i, i, 1); } });
  }
  MV.player($("#gl-pl2", host), { count:3, render:s2Go, label:function(i){ return "Step " + (i + 1) + " of 3: " + P.st2.short[i]; }, interval:2800 });

  // ---- chip-fill comparison table ----
  var CH = [];
  T.rows.forEach(function(r){ var a = MV.ans(r); CH.push({ id:r.id + "-0", t:a[0] }, { id:r.id + "-1", t:a[1] }); });
  CH = MV.shuffle(CH, "gl-table");
  var sel = null, tmsg = null;
  function used(id){ return Object.keys(S.tbl.cells).some(function(k){ return S.tbl.cells[k] === id; }); }
  function chip(id){ return byId(CH, id); }
  function tPaint(){
    var cells = S.tbl.cells, res = S.tbl.checked ? grade() : null;
    var h = '<div class="gl-bank" role="group" aria-label="Chips to place">' + CH.map(function(c){ var u = used(c.id); return '<button type="button" class="gl-chip' + (sel === c.id ? " sel" : "") + '" data-chip="' + c.id + '" data-k="ch' + c.id + '" aria-pressed="' + (sel === c.id) + '"' + (u ? " hidden" : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
    h += '<div class="tbl-wrap gl-tw"><table class="gl-ctbl"><caption class="vh">Comparison of substrate-level and oxidative phosphorylation</caption><thead><tr><th scope="col"><span class="vh">Feature</span></th>' + T.cols.map(function(c){ return '<th scope="col">' + c + "</th>"; }).join("") + "</tr></thead><tbody>" +
      T.rows.map(function(r){ return '<tr><th scope="row">' + r.t + "</th>" + [0, 1].map(function(j){
        var key = r.id + "-" + j, v = cells[key], c = v ? chip(v) : null, mark = res && v ? (res[key] ? ' <span class="gl-ok" aria-label="correct">✓</span>' : ' <span class="gl-no" aria-label="not right">✗</span>') : "";
        return '<td><button type="button" class="gl-cellb' + (v ? " full" : "") + (res && v && !res[key] ? " bad" : "") + '" data-cell="' + key + '" data-k="cl' + key + '" aria-label="' + MV.esc(MV.plain(r.t) + ", " + T.cols[j] + ": " + (c ? MV.plain(c.t) : "empty")) + '">' + (c ? c.t : '<span class="muted">Tap to fill</span>') + mark + "</button></td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
    h += '<div class="q-actions"><button type="button" class="btn primary sm" data-tact="check" data-k="tchk">Check the table</button><button type="button" class="btn ghost sm" data-tact="clear" data-k="tclr">Clear</button></div>';
    if (tmsg) h += MV.fbHTML(tmsg[0], tmsg[1]);
    MV.keepFocus($("#gl-tbl", host), function(){ $("#gl-tbl", host).innerHTML = h; });
  }
  function grade(){ var out = {}; T.rows.forEach(function(r){ var a = MV.ans(r); [0, 1].forEach(function(j){ var key = r.id + "-" + j, v = S.tbl.cells[key]; out[key] = !!v && chip(v).t === a[j]; }); }); return out; }
  $("#gl-tbl", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.chip) { sel = sel === b.dataset.chip ? null : b.dataset.chip; tmsg = null; tPaint(); return; }
    if (b.dataset.cell) {
      var key = b.dataset.cell;
      if (sel) { S.tbl.cells[key] = sel; sel = null; }
      else if (S.tbl.cells[key]) delete S.tbl.cells[key];
      else { tmsg = ["", "Tap a chip first, then the cell."]; tPaint(); return; }
      S.tbl.checked = false; tmsg = null; api.save(); tPaint(); return;
    }
    if (b.dataset.tact === "clear") { S.tbl = { cells:{}, checked:false }; sel = null; tmsg = null; api.save(); tPaint(); return; }
    if (b.dataset.tact === "check") {
      var n = Object.keys(S.tbl.cells).length;
      if (n < 12) { tmsg = ["bad", "Fill every cell first: " + (12 - n) + " still empty."]; tPaint(); return; }
      S.tbl.checked = true; var g = grade(), bad = T.rows.filter(function(r){ return !g[r.id + "-0"] || !g[r.id + "-1"]; });
      tmsg = bad.length ? ["bad", "<strong>✗ Not quite.</strong> " + bad.map(function(r){ return r.fb; }).join(" ") + " Tap a wrong cell to empty it, then try again."] : ["good", "<strong>" + T.done + "</strong>"];
      api.save(); tPaint(); MV.focusFb($("#gl-tbl", host));
    }
  });
  if (S.tbl.checked) { var g0 = grade(); if (T.rows.every(function(r){ return g0[r.id + "-0"] && g0[r.id + "-1"]; })) tmsg = ["good", "<strong>" + T.done + "</strong>"]; }
  tPaint();

  // ---- Station 3: PFK data (S7 rate probe) + PFK with its allosteric site (S2 feedback form) ----
  function aLow(x){ return 100 * x * x * x / (1 + x * x * x); }
  function aHigh(x){ return 30 * x * x * x / (8 + x * x * x); }
  function aAmp(x){ return 85 * x * x * x / (3.375 + x * x * x); }
  var FN = { low:aLow, high:aHigh, amp:aAmp };
  var pp = new MV.Plot($("#gl-pfk", host), { xmin:-0.6, xmax:10.6, ymin:-8, ymax:114 });
  pp.render = function(){
    var css = MV.css, x = S.x, pen = css("--pen"), atp = css("--bio-atp"), ink = css("--ink"), uf = "600 12px " + (css("--font-ui") || "sans-serif"), on = S.cond;
    pp.draw({ view:{ xmin:-0.6, xmax:10.6, ymin:-8, ymax:114 }, xTicks:{ step:2 }, yTicks:{ step:20 }, xLabel:"fructose-6-phosphate (mM)", yLabel:"PFK activity (%)",
      curves:[{ f:aLow, color:pen, width:on === "low" ? 4 : 2.6, domain:[0, 10] }, { f:aHigh, color:atp, width:on === "high" ? 4 : 2.6, dash:[9, 6], domain:[0, 10] }, { f:aAmp, color:ink, width:on === "amp" ? 4 : 2.8, dash:[2, 6], domain:[0, 10] }],
      segments:[{ x1:x, y1:0, x2:x, y2:108, color:css("--ink-2"), width:1.5, dash:[4, 4] }],
      points:[{ x:x, y:aLow(x), color:pen, r:5.5 }, { x:x, y:aHigh(x), color:atp, r:5.5 }, { x:x, y:aAmp(x), color:ink, r:5.5 }],
      labels:[{ x:2.2, y:aLow(2.2), text:"low ATP", align:"right", dx:-8, dy:4, bg:true, color:ink, font:uf }, { x:8.6, y:aAmp(8.6), text:"high ATP + high AMP", align:"right", dy:18, bg:true, color:ink, font:uf },
        { x:8.6, y:aHigh(8.6), text:"high ATP", align:"right", dy:-12, bg:true, color:ink, font:uf }],
      describe:"PFK activity against fructose-6-phosphate concentration, 0 to 10 mM (model curves). Low ATP (solid) rises steeply and levels off at 100%. High ATP (dashed) stays low and levels off at 30%. High ATP with high AMP (dotted) recovers to 85%. Probe at " + MV.num(x, 1) + " mM: " + Math.round(aLow(x)) + "%, " + Math.round(aHigh(x)) + "% and " + Math.round(aAmp(x)) + "%." });
  };
  function s3SVG(){
    var c = S.cond, act = FN[c](S.x), w = 1.5 + 5 * act / 100, h = sv("rect", { x:0.5, y:0.5, width:519, height:219, rx:8, "class":"gl-bg" });
    function box(x, lab, wd){ return sv("rect", { x:x - wd / 2, y:40, width:wd, height:32, rx:8, "class":"gl-cpd" }) + txt(x, 61, lab, "gl-cpdt", "middle"); }
    function arrow(x1, x2, sw, cls){ return sv("line", { x1:x1, y1:56, x2:x2 - 7, y2:56, "class":cls || "gl-flow", "stroke-width":f1(sw) }) + sv("path", { d:"M" + (x2 - 9) + " " + f1(56 - 4 - sw / 2) + " L" + x2 + " 56 L" + (x2 - 9) + " " + f1(56 + 4 + sw / 2) + " Z", "class":"gl-flowh" }); }
    h += box(50, "F6P", 64) + arrow(84, 178, w) + box(222, "F1,6BP", 84) + arrow(266, 318, 2, "gl-flow gl-thin") + txt(338, 61, "…", "gl-plab gl-plab-b", "middle") + arrow(354, 398, 2, "gl-flow gl-thin");
    var nA = c === "low" ? 1 : 3;
    for (var i = 0; i < nA; i++) h += pill("atp", 440 + (i % 2) * 44 - (nA === 1 ? 0 : 22), 50 + Math.floor(i / 2) * 22 + (nA === 1 ? 6 : -4));
    // PFK on the first arrow, with ATP (orange triangle) or AMP at its allosteric site
    var shut = c === "high" ? 0.62 : c === "amp" ? 0.12 : 0;
    h += sv("line", { x1:140, y1:62, x2:140, y2:104, "class":"gl-lead" });
    h += enzymeSVG(140, 140, 0.68, { g:1, allo:true, shut:shut, inh:c !== "low", inhCls:"gl-allo-atp" });
    if (c === "amp") h += sv("circle", { cx:84, cy:168, r:15, "class":"gl-amp" }) + txt(84, 172, "AMP", "gl-ampt", "middle");
    h += txt(140, 150, "PFK (step 3)", "gl-plab gl-plab-b", "middle");
    // feedback arrow from ATP back to PFK's allosteric site (−), and AMP's (+)
    var fbA = c === "low" ? 0.3 : 1;
    h += op(fbA, sv("path", { d:"M450 " + (c === "low" ? 66 : 76) + " C462 214, 260 218, 192 181", "class":"gl-fb" }) + sv("path", { d:"M182 176 L195 177.4 L190.2 186.2 Z", "class":"gl-fbh" }) + sv("circle", { cx:350, cy:194, r:11, "class":"gl-minus" }) + txt(350, 199, "−", "gl-minust", "middle"));
    if (c === "amp") h += txt(16, 206, "AMP bound: activity back up (+)", "gl-plab gl-plab-b");
    h += txt(222, 96, "flow: " + Math.round(act) + "%", "gl-plab", "middle");
    return h;
  }
  function s3All(){
    var x = S.x, c = byId(P.st3.conds, S.cond), el = $("#gl-s3", host);
    pp.render();
    el.innerHTML = s3SVG();
    el.setAttribute("aria-label", "Pathway: fructose-6-phosphate (F6P) to fructose-1,6-bisphosphate (F1,6BP), catalysed by PFK, then on to ATP. An arrow with a minus sign runs from ATP back to PFK’s allosteric site. " + c.t + ": " + c.d + " Flow through PFK at " + MV.num(x, 1) + " mM: " + Math.round(FN[S.cond](x)) + "%.");
    $("#gl-cd", host).innerHTML = "<strong>" + c.t + ".</strong> " + c.d + " (F6P = fructose-6-phosphate; F1,6BP = fructose-1,6-bisphosphate.)";
    $("#gl-r3", host).innerHTML = MV.readoutHTML([["Fructose-6-phosphate", MV.num(x, 1) + " mM"], ["Low ATP", Math.round(aLow(x)) + "%"], ["High ATP", Math.round(aHigh(x)) + "%"], ["High ATP + high AMP", Math.round(aAmp(x)) + '% <span class="bio-model">model</span>']]);
    var rows = []; for (var v = 0; v <= 10; v++) rows.push(v);
    $("#gl-tb3", host).innerHTML = '<div class="tbl-wrap gl-tw3"><table class="gl-dtbl"><caption class="vh">Model data: PFK activity at each fructose-6-phosphate concentration</caption><thead><tr><th scope="col">F6P (mM)</th><th scope="col">Low ATP (%)</th><th scope="col">High ATP (%)</th><th scope="col">High ATP + high AMP (%)</th></tr></thead><tbody>' +
      rows.map(function(v){ var on = Math.abs(v - x) < 0.01; return "<tr" + (on ? ' class="on"' : "") + '><th scope="row">' + (on ? '<span aria-hidden="true">▸ </span>' : "") + v + "</th><td>" + Math.round(aLow(v)) + "</td><td>" + Math.round(aHigh(v)) + "</td><td>" + Math.round(aAmp(v)) + "</td></tr>"; }).join("") + "</tbody></table></div>";
  }
  radios($("#gl-cond", host), { label:"Condition", cls:"chips", options:P.st3.conds.map(function(c){ return { id:c.id, t:c.t }; }), value:S.cond, onChange:function(v){ S.cond = v; api.save(); s3All(); } });
  slider($("#gl-x", host), { id:"gl-xp", label:"Probe: fructose-6-phosphate", min:0, max:10, step:0.5, value:S.x, unit:function(v){ return MV.num(v, 1) + " mM"; }, onChange:function(v){ S.x = v; api.save(); s3All(); } });
  s3All();
  return {};
}

// ---------- Practice 1: Put glycolysis in order (custom N5: the toolkit's ordering UI, with pattern feedback "X placed before Y") ----------
function orderAct(host, api, a){
  var S = api.S; S.seq = S.seq || {};
  var sel = {}, msgs = {};
  function sq(s){ var x = S.seq[s.id]; if (!x) x = S.seq[s.id] = { order:s.start.slice(), tries:0, hint:0, solved:false, first:null }; return x; }
  function isRight(ord){ return ord.every(function(v, i){ return v === i; }); }
  function named(s, ord){ var w = (s.wrongIf || []).filter(function(q){ return ord.indexOf(q.before[0]) < ord.indexOf(q.before[1]); })[0]; return w ? w.fb : null; }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">Tap a step, then use Move up and Move down to put it in place. Press Check when the order is right.</p>' + a.sequences.map(function(s, si){
        var x = sq(s), h = '<div class="q' + (si ? " part" : "") + '" data-seq="' + s.id + '" style="border-bottom:0"><p class="task">Sequence ' + "AB"[si] + ": " + s.prompt + "</p>";
        h += '<ol class="olist">' + x.order.map(function(stepI, pos){
          var isSel = sel[s.id] === pos && !x.solved, cls = "ostep" + (x.solved ? " good" : (msgs[s.id] && msgs[s.id].pos === pos ? " bad" : ""));
          return '<li><button type="button" class="' + cls + '" aria-pressed="' + isSel + '" data-k="' + s.id + "p" + stepI + '" data-pos="' + pos + '"' + (x.solved ? " disabled" : "") + '><span class="sn">' + (pos + 1) + ".</span><span>" + s.steps[stepI] + "</span></button>" +
            (isSel ? '<span class="omoves"><button type="button" class="btn ghost" data-mv="up" data-k="' + s.id + 'up"' + (pos === 0 ? " disabled" : "") + '>Move up</button><button type="button" class="btn ghost" data-mv="down" data-k="' + s.id + 'down"' + (pos === x.order.length - 1 ? " disabled" : "") + ">Move down</button></span>" : "") + "</li>";
        }).join("") + "</ol>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + s.id + 'chk">Check the order</button>' + MV.hintBtn(s.id + "hint", x.hint) + "</div>" + MV.hintsHTML(s.hints, x.hint);
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ That order works.</strong> ' + (s.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
        else if (msgs[s.id]) h += '<div class="fb bad" role="status"><p><strong>✗ Not yet.</strong> ' + msgs[s.id].html + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-seq]"); if (!box) return;
    var s = byId(a.sequences, box.dataset.seq), x = sq(s);
    if (b.dataset.pos != null) { var p = +b.dataset.pos; sel[s.id] = sel[s.id] === p ? null : p; paint(); return; }
    if (b.dataset.mv) {
      var i = sel[s.id], j = b.dataset.mv === "up" ? i - 1 : i + 1; if (i == null || j < 0 || j >= x.order.length) return;
      var t = x.order[i]; x.order[i] = x.order[j]; x.order[j] = t; sel[s.id] = j; msgs[s.id] = null; api.save(); paint();
      var nb = host.querySelector('[data-seq="' + s.id + '"] [data-mv="' + b.dataset.mv + '"]'); if (nb && !nb.disabled) nb.focus(); else { var sb = host.querySelector('[data-seq="' + s.id + '"] [data-pos="' + j + '"]'); if (sb) sb.focus(); }
      return;
    }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      if (isRight(x.order)) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[s.id] = null; sel[s.id] = null; }
      else {
        x.tries++;
        var pos = 0; while (pos < x.order.length && x.order[pos] === pos) pos++;
        var nm = named(s, x.order);
        msgs[s.id] = { pos:pos, html:nm || ("Step " + (pos + 1) + " is out of place. Ask what has to happen before it can be done.") };
      }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-seq="' + s.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.sequences.forEach(function(s){ var x = sq(s); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.sequences.length, done:d, line:a.summary + " (first try): " + f + "/" + a.sequences.length + (d < a.sequences.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.sequences.forEach(function(s){ var x = sq(s); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(s.goal != null ? s.goal : a.goal)); }); return g; }
  };
}

// ---------- Practice 2: Accounting and control (custom N4 with signed numbers, one two-box item and one chip item; from SBI4U 10's calc) ----------
function acct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = { val:"", vals:["", ""], pick:null, tries:0, hint:0, solved:false, first:null }); if (!x.vals) x.vals = ["", ""]; return x; }
  host.innerHTML = '<p class="how">Press Check after each answer. You can try again as often as you need.</p>' + a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function box(it, x, k, lab, unit){
    var id = "gl-li-" + it.id + (k == null ? "" : k), v = k == null ? x.val : x.vals[k];
    return '<div class="numrow"><label for="' + id + '">' + lab + '</label><input class="numin" id="' + id + '" data-lin="' + it.id + '"' + (k == null ? "" : ' data-ix="' + k + '"') + ' type="text" inputmode="text" autocomplete="off" value="' + MV.esc(v) + '"' + (x.solved ? " disabled" : "") + ">" + (unit ? '<span class="gl-unit">' + unit + "</span>" : "") + "</div>";
  }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), el = host.querySelector('[data-li="' + it.id + '"]');
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "pair") h += '<div class="gl-pair">' + box(it, x, 0, it.labels[0] + ":", it.units[0]) + box(it, x, 1, it.labels[1] + ":", it.units[1]) + "</div>";
    else if (it.kind === "chips") h += '<div class="chips gl-achips" role="radiogroup" aria-label="Your prediction">' + it.options.map(function(o, j){ var on = x.pick === j; return '<button type="button" class="chip" role="radio" aria-checked="' + on + '" data-pick="' + j + '" data-k="' + it.id + "c" + j + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
    else h += box(it, x, null, "Your answer:", it.unit);
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lin; if (!id) return; var x = ist(id); if (e.target.dataset.ix != null) x.vals[+e.target.dataset.ix] = e.target.value; else x.val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lin) { var b = host.querySelector('[data-k="' + e.target.dataset.lin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var el = b.closest("[data-li]"); if (!el) return;
    var it = byId(a.items, el.dataset.li), x = ist(it.id), ok = false;
    if (b.dataset.pick != null) { x.pick = +b.dataset.pick; msgs[it.id] = null; api.save(); paintItem(it); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it); return; }
    if (b.dataset.act !== "check") return;
    if (it.kind === "chips") {
      if (x.pick == null) { msgs[it.id] = "Tap a chip first."; paintItem(it); return; }
      var o = it.options[x.pick]; ok = MV.ok(o);
      msgs[it.id] = ok ? null : "<strong>✗ Not quite.</strong> " + o.why + " Try again.";
    } else if (it.kind === "pair") {
      var v0 = parseVal(x.vals[0]), v1 = parseVal(x.vals[1]), ans = MV.ans(it);
      if (v0 == null || v1 == null) { msgs[it.id] = "Enter a number in both boxes."; paintItem(it); return; }
      ok = v0 === ans[0] && v1 === ans[1];
      msgs[it.id] = ok ? null : "<strong>✗ Not quite.</strong> " + it.general + " Try again.";
    } else {
      var v = parseVal(x.val), an = MV.ans(it);
      if (v == null) { msgs[it.id] = "Enter a number, such as 4 or −1."; paintItem(it); return; }
      ok = Math.abs(v - an) < 1e-9;
      if (!ok) { var w = (it.wrong || []).filter(function(q){ return Math.abs(v - q.match) < 1e-9; })[0]; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (w ? w.fb : "Check your accounting: count what is spent and what is made.") + " Try again."; }
      else msgs[it.id] = null;
    }
    if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
    api.save(); paintItem(it); MV.focusFb(el);
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Sprint budget ----------
var task = (function(){
  var api = null, T = null;
  function st(){ var s = api.S; if (s.g == null) s.g = 3; if (s.e == null) s.e = 0; if (s.f == null) s.f = 0; return s; }
  function read(){ if (!api) return { g:3, e:0, f:0 }; var s = st(); return { g:+s.g, e:+s.e, f:+s.f }; }
  function parse(k){ var m = /g(\d+)-e(\d+)-f(\d+)/.exec(k) || [0, 0, 0, 0]; return { g:+m[1], e:+m[2], f:+m[3] }; }
  function text(d){ return "(g, e, f) = (" + d.g + ", " + d.e + ", " + d.f + ")"; }
  function gauge(){
    var d = read(), el = $("#gl-tg"); if (!el) return;
    var used = 2 * d.g, reg = d.e + d.f, max = 14;
    function bar(lab, parts, mark, val){ return '<div class="gl-grow"><span class="gl-gl">' + lab + '</span><span class="gl-gt">' + parts.map(function(p){ return '<i class="' + p[1] + '" style="width:' + f1(p[0] / max * 100) + '%"></i>'; }).join("") + (mark != null ? '<b class="gl-gm" style="left:' + f1(mark / max * 100) + '%"></b>' : "") + "</span><b>" + val + "</b></div>"; }
    el.innerHTML = '<div class="gl-gauge2" role="img" aria-label="' + MV.esc("NAD⁺ used " + used + " per second, regenerated " + reg + " (chain " + d.e + ", lactate " + d.f + "). Net ATP " + 2 * d.g + " per second. Lactate " + d.f + " per second.") + '">' +
      bar("NAD⁺ used", [[used, "gl-gu"]], null, used + "/s") + bar("NAD⁺ regenerated", [[d.e, "gl-ge"], [d.f, "gl-gf"]], null, reg + "/s") +
      bar("Net ATP", [[2 * d.g, "gl-ga"]], 8, 2 * d.g + "/s") + bar("Lactate", [[d.f, "gl-gf"]], 6, d.f + "/s") +
      '<p class="tiny gl-glg"><span class="gl-sw gl-ge"></span> by the chain (limit 4) <span class="gl-sw gl-gf"></span> by lactate (limit 6) · ticks mark 8 ATP and 6 lactate</p>' +
      '<p class="gl-gbal">' + (used === reg ? "✓ Balanced: " + reg + " regenerated = " + used + " used" : reg > used ? "Regenerating " + reg + " but only " + used + " used" : "Short by " + (used - reg) + " NAD⁺ each second") + "</p></div>";
  }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content; var s = st();
      inp.innerHTML = '<div class="gl-tin"><div id="gl-tgg"></div><div id="gl-tge"></div><div id="gl-tgf"></div></div>';
      function upd(){ a.save(); gauge(); a.update(); }
      stepper($("#gl-tgg"), { id:"gl-tsg", label:T.inputs.g, min:1, max:6, value:s.g, unit:function(v){ return String(v); }, onChange:function(v){ s.g = v; upd(); } });
      stepper($("#gl-tge"), { id:"gl-tse", label:T.inputs.e, min:0, max:12, value:s.e, unit:function(v){ return String(v); }, onChange:function(v){ s.e = v; upd(); } });
      stepper($("#gl-tgf"), { id:"gl-tsf", label:T.inputs.f, min:0, max:12, value:s.f, unit:function(v){ return String(v); }, onChange:function(v){ s.f = v; upd(); } });
      pv.innerHTML = '<div class="gl-tpv"><h4>Your budget, per second</h4><div id="gl-tg" aria-live="polite"></div><p class="tiny muted"><span class="bio-model">Model</span> ' + T.modelNote + " Net ATP counts glycolysis only.</p></div>";
      gauge();
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){ setTimeout(function(){
        var g = $("#task-fb .fb.good"); if (!g || MV.taskState().found.length < 4 || g.querySelector(".gl-all")) return;
        g.insertAdjacentHTML("beforeend", '<p class="gl-all">' + T.allFound + "</p>");
      }, 0); });
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return [d.e + d.f === 2 * d.g, 2 * d.g >= 8, d.e <= 4, d.f <= 6]; },
    key:function(d){ return "g" + d.g + "-e" + d.e + "-f" + d.f; },
    label:function(k){ return MV.esc(text(parse(k))); },
    text:function(k){ return text(parse(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ order:orderAct, acct:acct },
  task:task,
  onShow:function(v){ if (EXF) EXF.show(v === "explore"); }
});
})();
