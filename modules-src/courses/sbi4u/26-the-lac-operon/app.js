// SBI4U 26 The lac operon: hero (storyboard: the inducer pulls the repressor off, CAP–cAMP docks, RNA polymerase runs, three
// enzymes appear), Operon switchboard (SVG DNA strips with animated proteins, single operon or partial diploid; ONE lacModel drives
// the animation, the readout, the challenges and the task, so feedback always matches the picture), Part 3 "trp operon" (trp
// switchboard + lac/trp card; mutant-strain model data with an S12 claim–evidence–reasoning builder), custom "Predict and explain"
// (toolkit MC + N5 ordering in one activity), task "Build a lactose-ready strain" (genotype + medium switches, live preview).
// Colours (plan build notes): DNA --ink; mRNA teal (--bio-nadh); sugars brown (--bio-carbon); proteins --ink-2 outlines with labels;
// output (enzymes, output bars) --pen. Every state is also written in the readout.
(function(){
"use strict";
var $ = MV.$;

// ---------- small helpers (SVG helpers from SBI4U 20 / 14) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function seg(k, a, b){ return clamp((k - a) / (b - a), 0, 1); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "lo-lab", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function op(a, g){ return a == null || a >= 0.98 ? g : a <= 0.02 ? "" : '<g opacity="' + Math.round(a * 100) / 100 + '">' + g + "</g>"; }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (String(list[i].id) === String(id)) return list[i]; return null; }
function hexPath(x, y, r){ var d = ""; for (var i = 0; i < 6; i++) { var a = Math.PI / 6 + i * Math.PI / 3; d += (i ? "L" : "M") + f1(x + r * Math.cos(a)) + " " + f1(y + r * Math.sin(a)); } return d + "Z"; }
function it(s){ return '<tspan class="lo-it">' + s + "</tspan>"; }
var SUP = { "+":"⁺", "-":"⁻", "c":"ᶜ" };

// ---------- @component radioGroup (copied from SBI4U 20 / 14 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, aria, dis}], value, cls:"seg"|"chips", key, onChange(id)}) -> {set(id), get(), disable(b)}
function radios(host, o){
  var val = String(o.value), off = false;
  function firstFree(){ for (var i = 0; i < o.options.length; i++) if (!o.options[i].dis) return i; return 0; }
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, dis = x.dis || off, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (dis ? -1 : tab) + '" data-rg="' + x.id + '" data-k="rg' + (o.key || "") + x.id + '"' + (x.aria ? ' aria-label="' + MV.esc(x.aria) + '"' : "") + (dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
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
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, disable:function(b){ if (b !== off) { off = b; paint(); } } };
}

// ---------- model (plan: Explore rules table; deterministic). One function for the switchboard, challenges and the task. ----------
// Repressor on an operator unless: no working repressor in the cell (lacI⁻ in every copy), the operator is Oᶜ, or an inducer is
// bound (allolactose or IPTG). Allolactose forms only with lactose AND some working β-galactosidase (any Z⁺ copy). Output per copy:
// repressor on → Off (a trace); else CAP–cAMP bound (glucose absent) → High, else Low. Each operator controls only its own genes.
var STR = { wt:{ I:"+", O:"+", Z:"+" }, i:{ I:"-", O:"+", Z:"+" }, oc:{ I:"+", O:"c", Z:"+" }, z:{ I:"+", O:"+", Z:"-" } };
var LV = ["Off (a trace)", "Low", "High"], CPN = ["chromosome", "plasmid"];
function lacModel(d){
  var cs = d.copies, anyI = cs.some(function(c){ return c.I === "+"; }), anyZ = cs.some(function(c){ return c.Z === "+"; });
  var allo = !!d.lac && anyZ, ind = allo || !!d.iptg, cap = !d.glu;
  var per = cs.map(function(c){ var st = !anyI ? "none" : c.O === "c" ? "cant" : ind ? "rel" : "on"; return { c:c, st:st, lvl:st === "on" ? 0 : cap ? 2 : 1 }; });
  function mx(f){ var m = -1; per.forEach(function(p){ if (f(p.c)) m = Math.max(m, p.lvl); }); return m; }
  var z = mx(function(c){ return c.Z === "+"; }), y = mx(function(c){ return c.Y !== "-"; });
  return { anyI:anyI, anyZ:anyZ, lac:!!d.lac, allo:allo, iptg:!!d.iptg, ind:ind, cap:cap, per:per, single:cs.length === 1,
    z:z, zf:mx(function(c){ return c.Z !== "+"; }), y:y, yf:mx(function(c){ return c.Y === "-"; }), tx:mx(function(){ return true; }), use:z > 0 && y > 0 };
}
function byWhat(m){ return m.allo && m.iptg ? "allolactose and IPTG" : m.allo ? "allolactose" : "IPTG"; }
function repText(m){
  if (!m.anyI) return m.single ? "None made (<i>lacI</i>⁻)" : "None made (<i>lacI</i>⁻ in both copies)";
  if (m.single) { var p = m.per[0]; return p.st === "cant" ? "Can’t bind (Oᶜ)" : p.st === "rel" ? "Released: " + byWhat(m) + " bound" : "On the operator"; }
  if (m.ind) return "Released: " + byWhat(m) + " bound";
  var on = m.per.filter(function(p){ return p.st === "on"; }).length;
  return on === 2 ? "On both operators" : on === 1 ? "On the O⁺ operator (it can’t bind Oᶜ)" : "Can’t bind (both operators Oᶜ)";
}
function indText(m){
  if (m.lac && !m.anyZ) return m.iptg ? "IPTG (<i>lacZ</i>⁻ can’t make allolactose)" : "None: <i>lacZ</i>⁻ can’t make allolactose";
  return m.allo && m.iptg ? "Allolactose and IPTG" : m.allo ? "Allolactose" : m.iptg ? "IPTG" : "None";
}
function capText(m){ return m.cap ? "Bound: glucose low, cAMP high" : "Not bound: glucose present"; }
function srcText(m, f){ if (m.single) return ""; var s = m.per.filter(function(p){ return f(p); }).map(function(p, i){ return CPN[m.per.indexOf(p)]; }); return s.length ? ", from the " + s.join(" and ") + (s.length > 1 ? " copies" : " copy") : ""; }
function bgText(m){
  if (m.z >= 0) {
    var w = (m.z === 0 ? "A trace (working)" : LV[m.z] + " (working)") + srcText(m, function(p){ return p.c.Z === "+" && p.lvl === m.z; });
    return w + (m.zf > m.z ? "; faulty enzyme too (<i>lacZ</i>⁻)" : "");
  }
  return m.zf === 0 ? "A trace, but faulty (<i>lacZ</i>⁻)" : "Made but faulty (<i>lacZ</i>⁻)";
}
function pmText(m){ if (m.y < 0) return "Made but faulty (<i>lacY</i>⁻)"; return m.y === 0 ? "A trace" : LV[m.y]; }
function useText(m){
  if (m.use) return "Yes";
  if (m.z < 0) return "No: no working β-galactosidase";
  if (m.y < 0) return "No: no working permease";
  return "No: the enzymes are only a trace";
}
function copyText(m, i){
  var p = m.per[i], why = p.st === "on" ? "repressor on its O⁺ operator" : p.st === "cant" ? "Oᶜ: the repressor can’t bind" : p.st === "none" ? "no repressor in the cell" : "repressor released";
  return LV[p.lvl] + " (" + why + ")";
}

// ---------- @component operonStrip — the lac region as an SVG strip (S1-style schematic): DNA --ink, proteins --ink-2 shapes with
// labels (repressor, CAP, RNA polymerase), sugars brown, mRNA teal, output enzymes --pen. sceneSVG(spec) draws the whole cell:
// medium row (sugars, IPTG), products row, and one strip per copy. Positions come from the caller, so the hero, the switchboard
// and the task preview share it. ----------
var SW = 660, OX = 263, CX = 145, PX = 203, GX0 = 292;
var LSEG = [{ id:"I", x0:12, x1:86, gene:"lacI" }, { gap:true, x0:86, x1:120 }, { id:"cap", x0:120, x1:170, lab:"CAP site" }, { id:"P", x0:170, x1:236, lab:"promoter" },
  { id:"O", x0:236, x1:290, lab:"operator" }, { id:"Z", x0:290, x1:424, gene:"lacZ" }, { id:"Y", x0:424, x1:530, gene:"lacY" }, { id:"A", x0:530, x1:648, gene:"lacA" }];
function bandSVG(Yb, segs, al, show){
  var h = "", lab = "";
  segs.forEach(function(s){
    if (s.gap) { h += sv("path", { d:"M" + s.x0 + " " + (Yb + 8) + " L" + s.x1 + " " + (Yb + 8), "class":"lo-gapl" }); return; }
    var a = al && s.id && al[s.id], mut = a && a !== "+";
    h += sv("rect", { x:s.x0, y:Yb, width:s.x1 - s.x0, height:16, "class":(s.gene ? "lo-g" : "lo-site") + (mut ? " mut" : "") });
    var cx = (s.x0 + s.x1) / 2;
    if (s.gene) lab += txt(cx, Yb + 31, it(s.gene) + (a && (show || mut) ? SUP[a] : ""), "lo-lab", "middle");
    else lab += txt(cx, Yb + 31, s.lab, "lo-lab", "middle") + (s.id === "O" && a && (show || mut) ? txt(cx, Yb + 44, "O" + SUP[a], "lo-lab lo-al", "middle") : "");
  });
  return h + lab;
}
function hexPair(x, y, r, cls){ return sv("path", { d:hexPath(x - r * 0.9, y, r), "class":cls || "lo-sug" }) + sv("path", { d:hexPath(x + r * 0.9, y + r * 0.55, r), "class":cls || "lo-sug" }); }
function iptgPill(x, y){ return sv("rect", { x:x - 14, y:y - 7, width:28, height:13, rx:6.5, "class":"lo-iptg" }) + txt(x, y + 3, "IPTG", "lo-iptgt", "middle"); }
// repressor: open = 0 (active: jaws grip the DNA) … 1 (inducer bound: tilted, jaws splayed)
function repSVG(x, y, open, o){
  o = o || {}; var s = 6 * open;
  var g = '<g transform="translate(' + f1(x) + " " + f1(y) + ") rotate(" + f1(16 * open) + ')">' + sv("rect", { x:-20, y:-17, width:40, height:20, rx:7, "class":"lo-prot" }) +
    sv("path", { d:"M-16 2 L" + f1(-16 - s) + " 11 L" + f1(-9 - s) + " 13 L-8 2Z M8 2 L" + f1(9 + s) + " 13 L" + f1(16 + s) + " 11 L16 2Z", "class":"lo-prot" }) + "</g>";
  if (o.allo) g += op(o.allo, hexPair(x + 13, y - 24, 5));
  if (o.iptg) g += op(o.iptg, iptgPill(x - 13, y - 25));
  if (o.trp) g += op(o.trp, trpTok(x + 15, y - 25));
  if (o.lab !== false) g += txt(x, y - (o.allo || o.iptg || o.trp ? 37 : 23), o.name || "repressor", "lo-pl", "middle");
  return g;
}
function capSVG(x, y, camp, lab){
  return sv("circle", { cx:x - 8, cy:y, r:8, "class":"lo-prot" }) + sv("circle", { cx:x + 8, cy:y, r:8, "class":"lo-prot" }) +
    (camp > 0.02 ? op(camp, sv("circle", { cx:x, cy:y - 12, r:3.6, "class":"lo-camp" })) : "") + (lab !== false ? txt(x - 19, y + 4, camp > 0.5 ? "CAP–cAMP" : "CAP", "lo-pl", "end") : "");
}
function polSVG(x, y, a){ return op(a, sv("ellipse", { cx:x, cy:y, rx:27, ry:13, "class":"lo-prot lo-pol" }) + txt(x, y + 3.5, "RNA pol", "lo-pt", "middle")); }
function mrnaSVG(x0, x1, y, ph){
  if (x1 - x0 < 6) return "";
  var d = "M" + f1(x0) + " " + f1(y + 2.5 * Math.sin(x0 / 9 + ph));
  for (var x = x0 + 5; x < x1; x += 5) d += " L" + f1(x) + " " + f1(y + 2.5 * Math.sin(x / 9 + ph));
  return sv("path", { d:d + " L" + f1(x1 + 8) + " " + f1(y + 14), "class":"lo-mrna" });
}
function medSVG(md, ph){
  var h = txt(14, 27, "Medium:", "lo-ml"), x = 82;
  function bob(i){ return 2 * Math.sin(ph * 1.6 + i * 1.3); }
  if (md.glu) { for (var i = 0; i < 3; i++) h += sv("path", { d:hexPath(x + i * 16, 22 + bob(i), 6.5), "class":"lo-sug" }); h += txt(x + 16, 46, "glucose", "lo-ms", "middle"); x += 68; }
  if (md.lac) { for (i = 0; i < 2; i++) h += hexPair(x + 4 + i * 26, 20 + bob(i + 3), 5.5); h += txt(x + 17, 46, "lactose", "lo-ms", "middle"); x += 70; }
  if (md.iptg) { h += iptgPill(x + 14, 22 + bob(6)); h += txt(x + 14, 46, "IPTG", "lo-ms", "middle"); x += 50; }
  if (!md.glu && !md.lac && !md.iptg) h += txt(x, 27, "no glucose, no lactose", "lo-ms");
  return h;
}
// products: levels −1 (none working) / 0 (a trace) / 1 (low) / 2 (high); f = faulty level
function prodSVG(p){
  if (p.hide) return txt(486, 34, "Output: ? (predict first)", "lo-ms", "middle");
  var h = "";
  function icons(cx, lv, fl, draw){
    var n = lv === 2 ? 3 : lv === 1 ? 1 : 0, bad = lv < 0 && fl > 0, k = bad ? (fl === 2 ? 3 : 1) : n;
    if (!k) return sv("rect", { x:cx - 9, y:20, width:18, height:18, rx:4, "class":"lo-trace" }) + txt(cx + 14, 33, "trace", "lo-ms");
    var s = "";
    for (var i = 0; i < k; i++) s += draw(cx + (i - (k - 1) / 2) * 20, 29, bad);
    return s + (bad ? txt(cx + (k - 1) * 10 + 14, 33, "✗ faulty", "lo-ms") : "");
  }
  function bg(x, y, bad){ var c = bad ? "lo-enz bad" : "lo-enz"; return sv("rect", { x:x - 7, y:y - 7, width:6.5, height:6.5, rx:1.5, "class":c }) + sv("rect", { x:x + 0.5, y:y - 7, width:6.5, height:6.5, rx:1.5, "class":c }) + sv("rect", { x:x - 7, y:y + 0.5, width:6.5, height:6.5, rx:1.5, "class":c }) + sv("rect", { x:x + 0.5, y:y + 0.5, width:6.5, height:6.5, rx:1.5, "class":c }); }
  function pm(x, y, bad){ var c = bad ? "lo-enz bad" : "lo-enz"; return sv("rect", { x:x - 5, y:y - 9, width:4, height:18, rx:2, "class":c }) + sv("rect", { x:x + 1, y:y - 9, width:4, height:18, rx:2, "class":c }); }
  function ta(x, y){ return sv("path", { d:"M" + x + " " + (y - 8) + " L" + (x + 8) + " " + (y + 7) + " L" + (x - 8) + " " + (y + 7) + "Z", "class":"lo-enz" }); }
  h += op(p.a, icons(392, p.z, p.zf, bg) + txt(392, 58, "β-galactosidase", "lo-ms", "middle") + icons(502, p.y, p.yf, pm) + txt(502, 58, "permease", "lo-ms", "middle") +
    icons(604, p.tx, -1, ta) + txt(604, 58, "transacetylase", "lo-ms", "middle"));
  return h;
}
// one copy: c = {Yb, al, show, tag, rep:{a, u, open, cant, allo, iptg}, cap (0..1), pols:[{x, a}], ph, lvlText, labels}
function copySVG(c){
  var Yb = c.Yb, R = c.rep, h = bandSVG(Yb, LSEG, c.al, c.show);
  if (c.tag) h += txt(14, Yb + 50, c.tag, "lo-tag");
  // CAP
  h += capSVG(lerp(CX - 18, CX, c.cap), lerp(Yb - 62, Yb - 11, c.cap), c.camp == null ? c.cap : c.camp);
  // mRNA behind the polymerases
  c.pols.forEach(function(p, i){ if (p.x - 18 > GX0) h += op(p.a, mrnaSVG(GX0, p.x - 22, Yb - 34 - 8 * i, (c.ph || 0) * 3)); });
  if (c.mrna) h += mrnaSVG(GX0, c.mrna, Yb - 34, 0);
  c.pols.forEach(function(p){ h += polSVG(p.x, Yb - 12, p.a); });
  // repressor (or the ghost of a missing one)
  if (R.a < 0.98) h += op(1 - R.a, sv("rect", { x:OX + 42, y:Yb - 83, width:40, height:20, rx:7, "class":"lo-ghost" }) + txt(OX + 62, Yb - 50, "no repressor", "lo-ms", "middle"));
  if (R.a > 0.02) {
    var x = OX + R.u * 62 * (1 - R.cant), y = Yb - 13 - R.u * (53 - 20 * R.cant);
    h += op(R.a, repSVG(x, y, R.open, { allo:R.allo, iptg:R.iptg }));
    if (R.cant > 0.5) h += op(R.a, txt(OX, Yb - 20, "✗", "lo-x", "middle"));
  }
  if (c.lvlText) h += txt(648, Yb - 52, c.lvlText, "lo-lv", "end");
  return h;
}
function sceneSVG(sp){ return medSVG(sp.med, sp.ph || 0) + prodSVG(sp.prod) + sp.copies.map(copySVG).join(""); }

// visual targets per copy from the model (numbers, so they can be blended during a transition)
function targets(m){
  return m.per.map(function(p){
    return { a:p.st === "none" ? 0 : 1, u:p.st === "on" ? 0 : 1, open:p.st === "rel" ? 1 : 0, cant:p.st === "cant" ? 1 : 0,
      allo:p.st === "rel" && m.allo ? 1 : 0, iptg:p.st === "rel" && m.iptg ? 1 : 0, cap:m.cap ? 1 : 0, lvl:p.lvl };
  });
}
function blend(A, B, k){
  return B.map(function(b, i){ var a = A[i], o = {}; for (var key in b) o[key] = key === "lvl" ? (k > 0.6 ? b.lvl : a.lvl) : lerp(a[key], b[key], k); return o; });
}
var SPD = [0, 0.085, 0.2];
function polsFor(V, P, ph, rm){
  if (V.lvl === 0) { var blocked = V.a > 0.5 && V.u < 0.5; return [{ x:PX + (blocked && !rm ? 1.8 * Math.sin(ph * 14) : 0), a:1 }]; }
  var ps = rm ? (V.lvl === 2 ? [0.3, 0.72] : [0.5]) : (V.lvl === 2 ? [P, (P + 0.5) % 1] : [P]);
  return ps.map(function(p){ var x = PX + p * 470; return { x:x, a:1 - seg(x, 612, 660) }; });
}

// ---------- Explore: Operon switchboard ----------
var EXP = null;
function explore(host, api){
  var C = api.content, S = api.S;
  var D = { mode:"single", strain:"wt", lac:"absent", glu:"present", iptg:"off" };
  Object.keys(D).forEach(function(k){ if (S[k] == null) S[k] = D[k]; });
  if (!Array.isArray(S.cp) || S.cp.length !== 2) S.cp = [{ I:"+", O:"c", Z:"+" }, { I:"+", O:"+", Z:"+" }];
  var busy = false, pend = false, from = null, tgt = null, k = 1, trans = null, PH = [0, 0], ph = 0, raf = 0, last = 0, vis = true, cap = "", readSig = "";
  var lacT = '<span class="lo-hexk" aria-hidden="true"></span>';
  host.innerHTML = '<div class="lo-ex"><div class="pg lo-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="lo-scroll"><svg id="lo-svg" class="lo-svg" viewBox="0 0 ' + SW + ' 210" role="img" focusable="false"></svg></div>' +
      '<p class="tiny lo-key" aria-hidden="true"><span class="lo-kk lo-kd"></span> DNA <span class="lo-kk lo-kp"></span> proteins ' + lacT + ' sugars <span class="lo-kk lo-km"></span> mRNA <span class="lo-kk lo-ke"></span> enzymes made</p>' +
      '<p class="lo-cap" id="lo-cap" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div id="lo-mode"></div>' +
      '<div class="lo-panel"><div id="lo-lac"></div><div id="lo-glu"></div><fieldset class="lo-fs"><legend>Lab tools</legend><div id="lo-iptg"></div><p class="tiny muted lo-note">' + C.iptgNote + "</p></fieldset></div>" +
      '<div class="lo-panel" id="lo-sp"><div id="lo-strain"></div></div>' +
      '<div class="lo-panel" id="lo-dp">' + [0, 1].map(function(i){ return '<fieldset class="lo-fs"><legend>' + (i ? "Plasmid" : "Chromosome") + '</legend><div class="lo-al3"><div id="lo-c' + i + 'I"></div><div id="lo-c' + i + 'O"></div><div id="lo-c' + i + 'Z"></div></div></fieldset>'; }).join("") + "</div></div>" +
    '<div class="pg-read"><dl class="read lo-read" id="lo-read" aria-live="polite"></dl><div class="lo-bars" id="lo-bars" aria-hidden="true"></div><p class="tiny muted lo-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div></div></div>";
  var svg = $("#lo-svg", host);
  function set(p){ if (busy) return; Object.keys(p).forEach(function(key){ S[key] = p[key]; }); cap = ""; api.save(); update(true); paintAll(); MV.changed(); }
  var R = {
    mode:radios($("#lo-mode", host), { label:"Mode", key:"m", options:[{ id:"single", t:"Single operon" }, { id:"dip", t:"Partial diploid" }], value:S.mode, onChange:function(v){ set({ mode:v }); } }),
    lac:radios($("#lo-lac", host), { label:"Lactose", key:"l", options:[{ id:"absent", t:"Absent" }, { id:"present", t:"Present" }], value:S.lac, onChange:function(v){ set({ lac:v }); } }),
    glu:radios($("#lo-glu", host), { label:"Glucose", key:"g", options:[{ id:"absent", t:"Absent" }, { id:"present", t:"Present" }], value:S.glu, onChange:function(v){ set({ glu:v }); } }),
    iptg:radios($("#lo-iptg", host), { label:"IPTG (a lab inducer)", key:"p", options:[{ id:"off", t:"Off" }, { id:"on", t:"On" }], value:S.iptg, onChange:function(v){ set({ iptg:v }); } }),
    strain:radios($("#lo-strain", host), { label:"Strain", key:"s", cls:"chips", options:[{ id:"wt", t:"Wild type" }, { id:"i", t:"<i>lacI</i>⁻", aria:"lacI minus: no working repressor" },
      { id:"oc", t:"Oᶜ", aria:"O c: operator the repressor can’t bind" }, { id:"z", t:"<i>lacZ</i>⁻", aria:"lacZ minus: faulty beta-galactosidase" }], value:S.strain, onChange:function(v){ set({ strain:v }); } })
  };
  var AL = [];
  [0, 1].forEach(function(i){
    function cp(key, v){ if (busy) return; S.cp[i][key] = v; cap = ""; api.save(); update(true); paintAll(); MV.changed(); }
    var nm = i ? "plasmid" : "chromosome";
    AL.push(radios($("#lo-c" + i + "I", host), { label:"<i>I</i>", aria:"lacI allele, " + nm, key:"c" + i + "I", options:[{ id:"+", t:"<i>I</i>⁺", aria:"I plus" }, { id:"-", t:"<i>I</i>⁻", aria:"I minus" }], value:S.cp[i].I, onChange:function(v){ cp("I", v); } }));
    AL.push(radios($("#lo-c" + i + "O", host), { label:"O", aria:"Operator, " + nm, key:"c" + i + "O", options:[{ id:"+", t:"O⁺", aria:"O plus" }, { id:"c", t:"Oᶜ", aria:"O c" }], value:S.cp[i].O, onChange:function(v){ cp("O", v); } }));
    AL.push(radios($("#lo-c" + i + "Z", host), { label:"<i>Z</i>", aria:"lacZ allele, " + nm, key:"c" + i + "Z", options:[{ id:"+", t:"<i>Z</i>⁺", aria:"Z plus" }, { id:"-", t:"<i>Z</i>⁻", aria:"Z minus" }], value:S.cp[i].Z, onChange:function(v){ cp("Z", v); } }));
  });

  function copies(){ return S.mode === "dip" ? S.cp.map(function(c){ return { I:c.I, O:c.O, Z:c.Z }; }) : [STR[S.strain] || STR.wt]; }
  function model(s){ s = s || S; var cs = s === S ? copies() : [STR[s.strain]]; return lacModel({ copies:cs, lac:s.lac === "present", glu:s.glu === "present", iptg:s.iptg === "on" }); }
  function now(){ return k >= 1 || !from ? tgt : blend(from, tgt, k); }
  function update(animate, dur, cb){
    var t = targets(model());
    if (trans) { trans(); trans = null; }
    if (!animate || !tgt || tgt.length !== t.length || MV.reduceMotion) { from = t; tgt = t; k = 1; draw(); if (cb) cb(); return; }
    from = now(); tgt = t; k = 0;
    trans = MV.tween({ dur:dur || 700, step:function(x){ k = x; if (!raf) draw(); }, done:function(){ trans = null; k = 1; from = t; draw(); if (cb) cb(); } });
  }
  // ---- drawing ----
  function draw(){
    var V = now(), m = model(), dip = V.length === 2, rm = MV.reduceMotion, H = dip ? 380 : 210;
    svg.setAttribute("viewBox", "0 0 " + SW + " " + H);
    var sp = { ph:ph, med:{ lac:S.lac === "present", glu:S.glu === "present", iptg:S.iptg === "on" },
      prod:pend ? { hide:true } : { z:m.z, zf:m.zf, y:m.y, yf:m.yf, tx:m.tx, a:1 },
      copies:V.map(function(v, i){
        var cs = copies()[i] || {};
        return { Yb:dip ? (i ? 320 : 150) : 150, al:{ I:cs.I, O:cs.O, Z:cs.Z }, show:dip, tag:dip ? (i ? "Plasmid" : "Chromosome") : "",
          rep:v, cap:v.cap, pols:pend ? [{ x:PX, a:1 }] : polsFor(v, PH[i], ph, rm), ph:ph, lvlText:"Transcription: " + (pend ? "?" : LV[v.lvl]) };
      }) };
    svg.innerHTML = sceneSVG(sp);
  }
  function describe(){
    var m = model();
    if (pend) return "Operon switchboard. Settings: " + (S.strain === "wt" ? "wild type" : S.strain === "i" ? "lacI minus" : S.strain === "oc" ? "O c" : "lacZ minus") + ", lactose " + S.lac + ", glucose " + S.glu + ". Make your prediction to see what happens.";
    var s = "Operon switchboard. Lactose " + S.lac + ", glucose " + S.glu + ", IPTG " + S.iptg + ". Repressor: " + MV.plain(repText(m)) + ". CAP–cAMP: " + MV.plain(capText(m)) + ". ";
    if (m.single) s += "Transcription: " + LV[m.per[0].lvl] + ".";
    else s += "Chromosome copy (" + gtext(S.cp[0]) + "): " + MV.plain(copyText(m, 0)) + ". Plasmid copy (" + gtext(S.cp[1]) + "): " + MV.plain(copyText(m, 1)) + ".";
    return s + " Working β-galactosidase: " + MV.plain(bgText(m)) + ".";
  }
  function gtext(c){ return "I" + SUP[c.I] + " O" + SUP[c.O] + " Z" + SUP[c.Z]; }
  function capFor(){
    if (pend) return "Make your prediction, then watch the switchboard.";
    var m = model(), p = m.per[0];
    var q1 = !m.anyI ? "There’s no repressor (<i>lacI</i>⁻), so nothing blocks the operator." :
      m.single && p.st === "cant" ? "The repressor can’t grip an Oᶜ operator, so nothing blocks." :
      m.ind ? "Repressor: “Is lactose here?” <strong>Yes</strong> (" + byWhat(m) + " bound), so it lets go." :
      m.lac && !m.anyZ ? "Repressor: lactose is here, but <i>lacZ</i>⁻ can’t make allolactose, so it stays on." : "Repressor: “Is lactose here?” <strong>No</strong>, so it stays on the operator.";
    var q2 = "CAP: “Is glucose gone?” <strong>" + (m.cap ? "Yes" : "No") + "</strong>" + (m.cap ? ", so it docks and helps." : ", so it stays away.");
    var out = m.single ? " Output: <strong>" + LV[p.lvl] + "</strong>." : " Each operator controls only the genes beside it; the repressor can reach both.";
    return q1 + " " + q2 + out;
  }
  function paintRead(){
    var m = model(), Q = "?", rows;
    if (m.single) rows = [["Repressor", pend ? Q : repText(m)], ["Inducer", pend ? Q : indText(m)], ["CAP–cAMP", pend ? Q : capText(m)], ["Transcription of <i>lacZYA</i>", pend ? Q : LV[m.per[0].lvl]],
      ["β-galactosidase", pend ? Q : bgText(m)], ["Permease", pend ? Q : pmText(m)], ["Can the cell use lactose?", pend ? Q : useText(m)]];
    else rows = [["Repressor", repText(m)], ["Inducer", indText(m)], ["CAP–cAMP", capText(m)], ["Chromosome copy (" + gtext(S.cp[0]) + ")", copyText(m, 0)], ["Plasmid copy (" + gtext(S.cp[1]) + ")", copyText(m, 1)],
      ["Working β-galactosidase", bgText(m)], ["Permease", pmText(m)], ["Can the cell use lactose?", useText(m)]];
    var h = MV.readoutHTML(rows); if (h !== readSig) { readSig = h; $("#lo-read", host).innerHTML = h; }
    var W = [0, 4, 36, 100];
    $("#lo-bars", host).innerHTML = pend ? "" : '<p class="lo-bt">Output</p>' + [["β-galactosidase (working)", m.z], ["Permease", m.y]].map(function(r){ return '<div class="lo-bar"><span>' + r[0] + '</span><span class="lo-bt2"><i style="width:' + W[r[1] + 1] + '%"></i></span></div>'; }).join("");
  }
  function paintAll(){
    R.mode.set(S.mode); R.lac.set(S.lac); R.glu.set(S.glu); R.iptg.set(S.iptg); R.strain.set(S.strain);
    AL.forEach(function(r, j){ r.set(S.cp[j / 3 | 0]["IOZ"[j % 3]]); });
    $("#lo-sp", host).hidden = S.mode !== "single"; $("#lo-dp", host).hidden = S.mode !== "dip";
    [R.mode, R.lac, R.glu, R.iptg, R.strain].concat(AL).forEach(function(r){ r.disable(busy); });
    paintRead(); $("#lo-cap", host).innerHTML = cap || capFor(); svg.setAttribute("aria-label", describe()); draw();
  }
  // ---- ambient loop: RNA polymerase speed matches the output (reduced motion: static positions, speed shown as text) ----
  function loop(ts){
    raf = 0; if (!vis || MV.reduceMotion || !host.isConnected || host.offsetParent === null) { last = 0; return; }
    var dt = last ? Math.min(0.1, (ts - last) / 1000) : 0; last = ts; ph += dt;
    now().forEach(function(v, i){ PH[i] = v.lvl ? (PH[i] + dt * SPD[v.lvl]) % 1 : 0; });
    draw(); raf = requestAnimationFrame(loop);
  }
  function startLoop(){ if (!MV.reduceMotion && !raf) { last = 0; raf = requestAnimationFrame(loop); } }
  update(false); paintAll(); startLoop();

  // ---- target challenges (plan: exact tests and named wrong states) ----
  function no(msg){ return { ok:false, msg:msg }; }
  function chal(id){
    var c = byId(C.challenges, id), N = c.named, lac = S.lac === "present", glu = S.glu === "present", ip = S.iptg === "on";
    if (id === "tc1") {
      if (S.mode !== "single") return no(N.mode);
      if (S.strain !== "wt") return no(N.strain);
      if (!glu && (lac || ip)) return { ok:true };
      if (lac && glu) return no(N.both);
      if (!lac && !glu && !ip) return no(N.none);
      return no(c.general);
    }
    if (id === "tc2") {
      if (S.mode !== "single") return no(N.mode);
      if (S.strain === "z") return no(N.lacZ);
      if (lac || ip) return no(N.inducer);
      if (S.strain === "wt") return no(N.wt);
      if (glu) return no(N.glucose);
      return { ok:true };
    }
    if (id === "tc3") {
      if (S.mode !== "dip") return no(N.mode);
      var oc = S.cp.filter(function(x){ return x.O === "c"; });
      if (!oc.length) return no(N.noOc);
      if (oc.length === 2) return no(N.twoOc);
      var a = oc[0], b = S.cp[0] === a ? S.cp[1] : S.cp[0];
      if (a.Z === "+") return no(N.ocZ);
      if (b.Z !== "+") return no(N.opZ);
      if (a.I !== "+" && b.I !== "+") return no(N.noI);
      return { ok:true };
    }
    return { ok:false };
  }
  EXP = { show:function(v){ vis = v; if (v) { paintAll(); startLoop(); } } };
  return {
    predict:{
      start:function(p){
        if (trans) { trans(); trans = null; }
        busy = true; pend = true; var s = p.start;
        S.mode = "single"; S.strain = s.strain; S.lac = s.lac; S.glu = s.glu; S.iptg = s.iptg; api.save();
        // before-pose: the same strain with no lactose and glucose present; the reveal animates from here
        from = tgt = targets(model({ strain:s.strain, lac:"absent", glu:"present", iptg:"off" })); k = 1; PH = [0, 0];
        cap = ""; paintAll(); MV.changed();
      },
      run:function(p, done){
        pend = false; paintAll();
        update(true, 1600, function(){ MV.wait(1100, function(){ busy = false; cap = p.reveal; paintAll(); MV.changed(); done(); }); });
      }
    },
    challenge:chal
  };
}

// ---------- hero: storyboard (plan) — the repressor on the operator with RNA polymerase stuck behind it; lactose drifts in, one
// becomes allolactose and clips onto the repressor, which changes shape and falls off; cAMP joins CAP, which docks; RNA polymerase
// runs along lacZ, lacY and lacA trailing one teal mRNA; three enzymes appear. Reduced motion: the final frame, with labels. ----------
function hero(f){
  var box = $("#lo-hero"); if (!box) return;
  var cap = f && f.cap, last = -1, Yb = 150;
  var CAPS = ["The repressor sits on the operator. RNA polymerase is stuck behind it.", "Lactose drifts into the cell.", "Some lactose becomes allolactose, the inducer, and clips onto the repressor.",
    "The repressor changes shape and lets go of the operator.", "Glucose is low, so cAMP joins CAP, and CAP docks at its site.", "RNA polymerase copies lacZ, lacY and lacA into one mRNA.", "The cell makes all three enzymes."];
  box.innerHTML = '<svg viewBox="0 0 ' + SW + ' 212" class="lo-hsvg" aria-hidden="true" focusable="false"></svg>';
  var svg = $("svg", box);
  function setCap(i){ if (cap && i !== last) { cap.textContent = CAPS[i]; last = i; } }
  function scene(T){
    var E = MV.ease, h = "";
    // lactose drifting in; the third pair becomes allolactose and travels to the repressor
    var din = E(seg(T, 1, 2.8)), toR = E(seg(T, 3.4, 4.2)), u = E(seg(T, 4.4, 5.4)), open = seg(T, 4.2, 4.7);
    h += txt(14, 27, "Medium:", "lo-ml");
    h += op(1 - seg(T, 9.8, 10.4), hexPair(lerp(-20, 120, din), 22 + 2 * Math.sin(T * 1.7), 5.5) + hexPair(lerp(-40, 168, din), 30 + 2 * Math.sin(T * 1.5 + 1), 5.5));
    var ax = lerp(lerp(-30, 228, din), OX + 13, toR), ay = lerp(lerp(46, 76, din), Yb - 37, toR);
    if (T >= 1 && T < 4.2) { h += hexPair(ax, ay, 5.5); if (T >= 2.9) h += txt(ax, ay - 12, "allolactose", "lo-ms", "middle"); }
    if (T < 1) h += txt(82, 27, "lactose arrives…", "lo-ms");
    // CAP and cAMP
    var cin = E(seg(T, 5.1, 5.8)), dock = E(seg(T, 5.9, 6.6));
    var capX = lerp(CX - 18, CX, dock), capY = lerp(Yb - 62, Yb - 11, dock);
    h += capSVG(capX, capY, seg(T, 5.7, 5.8), true);
    if (T >= 5.1 && T < 5.8) h += sv("circle", { cx:lerp(40, CX - 18, cin), cy:lerp(100, Yb - 74, cin), r:3.6, "class":"lo-camp" }) + txt(lerp(40, CX - 18, cin) + 8, lerp(100, Yb - 74, cin) - 6, "cAMP", "lo-ms");
    // polymerase and mRNA
    var run = seg(T, 6.6, 9.6), px = T < 6.6 ? PX + (T > 0.3 ? 1.8 * Math.sin(T * 14) : 0) : PX + run * 427;
    h += bandSVG(Yb, LSEG);
    if (px - 22 > GX0) h += mrnaSVG(GX0, Math.min(px - 22, 628), Yb - 34, T * 3);
    if (T > 9.6) h += txt(470, Yb - 48, "one mRNA: lacZ · lacY · lacA", "lo-mt", "middle");
    h += polSVG(px, Yb - 12, 1);
    // repressor
    var rx = OX + u * 62, ry = Yb - 13 - u * 53;
    h += repSVG(rx, ry, open, { allo:T >= 4.2 ? 1 : 0 });
    if (T >= 4.2) h += txt(rx + 24, ry - 12, "allolactose", "lo-ms");
    // products
    var pa = seg(T, 9.4, 10.4);
    if (pa > 0) h += prodSVG({ z:1, zf:-1, y:1, yf:-1, tx:1, a:pa });
    setCap(T < 1 ? 0 : T < 2.9 ? 1 : T < 4.2 ? 2 : T < 5.1 ? 3 : T < 6.6 ? 4 : T < 9.6 ? 5 : 6);
    return h;
  }
  function draw(T){ svg.innerHTML = scene(T); }
  if (MV.reduceMotion) { draw(11); return; }
  draw(0);
  MV.tween({ dur:11000, ease:function(t){ return t; }, step:function(t){ draw(t * 11); }, done:function(){ draw(11); } });
}

// ---------- Part 3: the trp operon (Station 1 switchboard + card; Station 2 mutant data with the S12 builder) ----------
var TSEG = [{ gene:"trpR", x0:12, x1:86 }, { gap:true, x0:86, x1:120 }, { lab:"promoter", x0:120, x1:200 }, { lab:"operator", x0:200, x1:254 },
  { gene:"trpE", x0:254, x1:332 }, { gene:"trpD", x0:332, x1:410 }, { gene:"trpC", x0:410, x1:488 }, { gene:"trpB", x0:488, x1:566 }, { gene:"trpA", x0:566, x1:648 }];
function trpTok(x, y){ return sv("rect", { x:x - 13, y:y - 7, width:26, height:14, rx:7, "class":"lo-sug" }) + txt(x, y + 3.5, "Trp", "lo-trpt", "middle"); }
// VERIFY: the plan defines only low (on) and high (off); "Medium" is shown as reduced transcription (the repressor on the operator
// part of the time).
var TV = [{ u:1, a:1, trp:0, px:430 }, { u:0, a:0.55, trp:1, px:330 }, { u:0, a:1, trp:1, px:160 }];
function trpSVG(A, B, k){
  var Yb = 140, v = {}; for (var key in A) v[key] = lerp(A[key], B[key], k);
  var h = txt(14, 27, "Tryptophan:", "lo-ml"), n = B === TV[0] ? 1 : B === TV[1] ? 4 : 9;
  for (var i = 0; i < n; i++) h += trpTok(118 + (i % 5) * 32, 16 + (i / 5 | 0) * 22);
  h += bandSVG(Yb, TSEG);
  h += txt(451, Yb + 50, "five genes for the enzymes that make Trp", "lo-ms", "middle");
  if (v.px > 280) h += mrnaSVG(258, v.px - 22, Yb - 34, 0);
  h += polSVG(v.px, Yb - 12, 1);
  var x = 227 + v.u * 70, y = Yb - 13 - v.u * 50;
  h += op(v.a, repSVG(x, y, v.u, { trp:v.trp, name:"trp repressor" }));
  if (v.a < 0.9 && v.u < 0.5) h += txt(227, Yb - 52, "part of the time", "lo-ms", "middle");
  return h;
}
// @component S12 cerBuilder — claim, evidence and reasoning chips with one Check (course plan S12): cer(box, Q, st, key, save)
function cer(box, Q, st, key, save){
  function parts(){ return [["c", Q.claimQ, Q.claims]].concat(Q.evs ? [["e", Q.evQ, Q.evs]] : []).concat(Q.res ? [["r", Q.reQ, Q.res]] : []); }
  function paint(){
    var h = parts().map(function(p){
      return '<div class="lo-cerrow"><p class="lo-cerq"><strong>' + p[1] + '</strong></p><div class="lo-chips" role="group" aria-label="' + MV.esc(MV.plain(p[1])) + '">' +
        p[2].map(function(o, i){ return '<button type="button" class="lo-chip" aria-pressed="' + (st[p[0]] === i) + '" data-cp="' + p[0] + '" data-ci="' + i + '" data-k="' + key + p[0] + i + '"' + (st.solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div></div>";
    }).join("");
    if (!st.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-cer="1" data-k="' + key + 'chk">Check</button></div>';
    if (st.solved) h += MV.fbHTML("good", Q.done); else if (st.msg) h += MV.fbHTML("bad", st.msg);
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  box.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.cp) { st[b.dataset.cp] = +b.dataset.ci; st.msg = ""; save(); paint(); return; }
    if (!b.dataset.cer) return;
    var P = parts();
    if (P.some(function(p){ return st[p[0]] == null; })) st.msg = "<strong>✗ Not yet.</strong> " + (P.length > 1 ? "Choose a claim, a piece of evidence and a reason." : "Choose an answer.");
    else {
      var bad = P.filter(function(p){ return !MV.ok(p[2][st[p[0]]]); });
      if (!bad.length) { st.solved = true; st.msg = ""; }
      else st.msg = "<strong>✗ Not quite.</strong> " + bad.map(function(p){ return p[2][st[p[0]]].fb; }).join(" ");
    }
    save(); paint(); MV.focusFb(box);
  });
  paint();
}
function part3(host, api){
  var C = api.content, S = api.S, S1 = C.st1, S2 = C.st2, TL = S1.levels;
  if (S.trp == null) S.trp = 0; if (!S.cx) S.cx = {}; if (!S.cy) S.cy = {};
  host.innerHTML = '<div class="lo-p3">' +
    '<section class="lo-st" aria-labelledby="lo-s1h"><h3 id="lo-s1h">' + S1.title + "</h3><p>" + S1.text + "</p>" +
      '<div class="lo-scroll lo-box"><svg id="lo-trp" class="lo-svg" viewBox="0 0 660 200" role="img" focusable="false"></svg></div>' +
      '<label class="slider lo-sl"><span class="slider-top"><span>Tryptophan level</span><output id="lo-tl-out" for="lo-tl"></output></span><input type="range" id="lo-tl" min="0" max="2" step="1"></label>' +
      '<dl class="read" id="lo-trd" aria-live="polite"></dl>' +
      "<h4>lac and trp, side by side</h4>" + MV.tableHTML({ head:S1.compare.head, rows:S1.compare.rows, caption:"The lac and trp operons compared" }) +
      '<p class="tiny muted">' + S1.note + "</p></section>" +
    '<section class="lo-st part" aria-labelledby="lo-s2h"><h3 id="lo-s2h">' + S2.title + '</h3><details class="alg" open><summary>Check it with data</summary><p>' + S2.text + "</p>" +
      MV.tableHTML({ head:S2.head, rows:S2.rows, caption:"β-galactosidase activity in four strains" }) + '<p class="tiny muted"><span class="bio-model">Model data</span> β-galactosidase activity in units.</p>' +
      "<p>" + S2.control + '</p><h4>Strain X</h4><div id="lo-cx"></div><h4>Strain Y</h4><div id="lo-cy"></div></details></section></div>';
  var tsvg = $("#lo-trp", host), tin = $("#lo-tl", host), tAnim = null, shown = S.trp;
  function trd(){
    var L = S.trp;
    $("#lo-tl-out", host).textContent = TL[L]; tin.value = L; tin.setAttribute("aria-valuetext", TL[L] + " tryptophan");
    $("#lo-trd", host).innerHTML = MV.readoutHTML([["Tryptophan", TL[L]],
      ["trp repressor", ["Inactive: no Trp bound, so it can’t bind the operator", "Some repressors have Trp bound and sit on the operator part of the time", "Active: Trp (the corepressor) is bound, so it sits on the operator"][L]],
      ["Transcription of the trp genes", ["On", "Low (reduced)", "Off (a trace)"][L]]]);
    tsvg.setAttribute("aria-label", "trp operon strip: trpR, a gap, promoter, operator and five genes trpE to trpA. Tryptophan " + TL[L].toLowerCase() + ". " +
      ["The repressor floats free with no Trp, and RNA polymerase transcribes the genes into mRNA.", "The repressor, with Trp bound, sits on the operator part of the time; RNA polymerase transcribes a little.", "Trp is bound to the repressor, which sits on the operator; RNA polymerase is stuck at the promoter."][L]);
  }
  function go(L){
    if (tAnim) { tAnim(); tAnim = null; }
    var A = TV[shown], B = TV[L]; S.trp = L; api.save(); trd();
    tAnim = MV.tween({ dur:900, step:function(x){ tsvg.innerHTML = trpSVG(A, B, x); }, done:function(){ tAnim = null; shown = L; tsvg.innerHTML = trpSVG(B, B, 1); } });
  }
  tin.addEventListener("input", function(){ go(+tin.value); });
  trd(); tsvg.innerHTML = trpSVG(TV[S.trp], TV[S.trp], 1);
  cer($("#lo-cx", host), S2.x, S.cx, "lcx", function(){ api.save(); });
  cer($("#lo-cy", host), S2.y, S.cy, "lcy", function(){ api.save(); });
}

// ---------- Practice 2: Predict and explain (custom: toolkit MC items 1–5 + an N5 ordering item 6, one first-try line) ----------
function predictExplain(host, api, a){
  host.innerHTML = '<div id="lo-pe-mc"></div><div class="part lo-pe6"><p class="lo-pe6h"><span class="qn" aria-hidden="true">6</span></p><div id="lo-pe-ord"></div></div>';
  var r1 = MV.activityTypes.mc($("#lo-pe-mc", host), { id:a.id + "-mc", type:"mc", title:a.title, summary:a.summary, goal:a.goal, how:a.how, items:a.items });
  var r2 = MV.activityTypes.order($("#lo-pe-ord", host), { id:a.id + "-ord", type:"order", title:a.title, summary:a.summary, goal:a.goal, sequences:a.sequences });
  return {
    stats:function(){ var s1 = r1.stats(), s2 = r2.stats(), f = s1.first + s2.first, t = s1.total + s2.total, d = s1.done + s2.done;
      return { first:f, total:t, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + t + (d < t ? " (unfinished)" : "") }; },
    missed:function(){ return r1.missed().concat(r2.missed()); }
  };
}

// ---------- Performance task: Build a lactose-ready strain (genotype + medium switches; preview from lacModel) ----------
var task = (function(){
  var api = null, T = null, DEF = { I:"+", O:"+", Z:"+", Y:"+", glu:"present", lac:"absent", iptg:"off" };
  function read(){ var s = api ? api.S : {}, d = {}; Object.keys(DEF).forEach(function(k){ d[k] = s[k] || DEF[k]; }); return d; }
  function mod(d){ return lacModel({ copies:[{ I:d.I, O:d.O, Z:d.Z, Y:d.Y }], lac:d.lac === "present", glu:d.glu === "present", iptg:d.iptg === "on" }); }
  function geno(d, html){ function g(s){ return html ? "<i>" + s + "</i>" : s; } return g("I") + SUP[d.I] + " O" + SUP[d.O] + " " + g("Z") + SUP[d.Z] + " " + g("Y") + SUP[d.Y]; }
  function text(d, html){ return geno(d, html) + ", glucose " + d.glu + ", lactose " + d.lac + ", IPTG " + d.iptg; }
  function parse(k){ var p = k.split("|"); return { I:p[0], O:p[1], Z:p[2], Y:p[3], glu:p[4], lac:p[5], iptg:p[6] }; }
  function paintPv(){
    var el = $("#lo-tpv"); if (!el) return;
    var d = read(), m = mod(d), V = targets(m)[0];
    $("#lo-tsvg").innerHTML = sceneSVG({ ph:0, med:{ lac:d.lac === "present", glu:d.glu === "present", iptg:d.iptg === "on" }, prod:{ z:m.z, zf:m.zf, y:m.y, yf:m.yf, tx:m.tx, a:1 },
      copies:[{ Yb:150, al:{ I:d.I, O:d.O, Z:d.Z, Y:d.Y }, show:true, rep:V, cap:V.cap, pols:polsFor(V, 0, 0, true), lvlText:"Transcription: " + LV[V.lvl] }] });
    $("#lo-tsvg").setAttribute("aria-label", "Your strain, " + text(d) + ". Repressor: " + MV.plain(repText(m)) + ". Transcription: " + LV[V.lvl] + ".");
    el.innerHTML = MV.readoutHTML([["Repressor", repText(m)], ["Inducer", indText(m)], ["CAP–cAMP", capText(m)], ["Transcription", LV[V.lvl]], ["β-galactosidase", bgText(m)], ["Permease", pmText(m)]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content; var s = a.S;
      Object.keys(DEF).forEach(function(k){ if (!s[k]) s[k] = DEF[k]; });
      inp.innerHTML = '<div class="lo-tin"><fieldset class="lo-fs"><legend>Genotype</legend><div class="lo-al3"><div id="lo-tI"></div><div id="lo-tO"></div><div id="lo-tZ"></div><div id="lo-tY"></div></div></fieldset>' +
        '<fieldset class="lo-fs"><legend>Medium</legend><div id="lo-tg"></div><div id="lo-tl2"></div><div id="lo-tp"></div></fieldset></div>';
      function upd(k, v){ s[k] = v; a.save(); paintPv(); a.update(); }
      function pm(id, k, lab, ar, opts){ radios($(id), { label:lab, aria:ar, key:"t" + k, options:opts, value:s[k], onChange:function(v){ upd(k, v); } }); }
      pm("#lo-tI", "I", T.inputs.I, "lacI allele", [{ id:"+", t:"<i>I</i>⁺", aria:"I plus" }, { id:"-", t:"<i>I</i>⁻", aria:"I minus" }]);
      pm("#lo-tO", "O", T.inputs.O, "Operator", [{ id:"+", t:"O⁺", aria:"O plus" }, { id:"c", t:"Oᶜ", aria:"O c" }]);
      pm("#lo-tZ", "Z", T.inputs.Z, "lacZ allele", [{ id:"+", t:"<i>Z</i>⁺", aria:"Z plus" }, { id:"-", t:"<i>Z</i>⁻", aria:"Z minus" }]);
      pm("#lo-tY", "Y", T.inputs.Y, "lacY allele", [{ id:"+", t:"<i>Y</i>⁺", aria:"Y plus" }, { id:"-", t:"<i>Y</i>⁻", aria:"Y minus" }]);
      pm("#lo-tg", "glu", T.inputs.glu, "Glucose", [{ id:"absent", t:"Absent" }, { id:"present", t:"Present" }]);
      pm("#lo-tl2", "lac", T.inputs.lac, "Lactose", [{ id:"absent", t:"Absent" }, { id:"present", t:"Present" }]);
      pm("#lo-tp", "iptg", T.inputs.iptg, "IPTG", [{ id:"off", t:"Off" }, { id:"on", t:"On" }]);
      pv.innerHTML = '<div class="lo-tpvw"><h4>Your strain</h4><div class="lo-scroll lo-box"><svg id="lo-tsvg" class="lo-svg" viewBox="0 0 ' + SW + ' 210" role="img" focusable="false"></svg></div><dl class="read" id="lo-tpv" aria-live="polite"></dl></div>';
      paintPv();
    },
    read:read,
    valid:function(){ return true; },
    // plan live checklist: 1 Z⁺, repressor not on the operator, glucose absent; 2 lactose absent and IPTG off; 3 Y⁺ and transcription not off
    checks:function(d){ var m = mod(d), p = m.per[0]; return [d.Z === "+" && p.st !== "on" && d.glu === "absent", d.lac === "absent" && d.iptg === "off", d.Y === "+" && p.lvl > 0]; },
    key:function(d){ return [d.I, d.O, d.Z, d.Y, d.glu, d.lac, d.iptg].join("|"); },
    label:function(k){ return text(parse(k), true); },
    text:function(k){ return text(parse(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ pe:predictExplain },
  task:task,
  onShow:function(v){ if (EXP) EXP.show(v === "explore"); }
});
})();
