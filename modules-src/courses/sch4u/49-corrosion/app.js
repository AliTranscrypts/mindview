// SCH4U 49 Corrosion: hero (a water drop on iron: O₂ at the edge, Fe²⁺ leaving the centre, electrons through the plate,
// a rust ring between), Rusting simulator (Explore: C10 cell builder, "surface cell" variant: drop view, side-by-side with a
// rust bar chart, nail inquiry; protection panel on the reduction table), Protect the bridge (Part 3: bridge decision map,
// lead pipes, aluminium, cost; "Check it with data"), Which metal corrodes? and Corrosion reasoning (custom practice), and
// Protect the steel (task: coating + block with a live drop-and-scratch preview).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function esc(s){ return MV.esc(s); }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
var f = MV.chem.f, fx = MV.chem.fx, D = MV.chem.data;
function sg(v){ return (v > 0.0001 ? "+" : "") + fx(Math.abs(v) < 0.0001 ? 0 : v, 2); }
var EI = "<i>E</i>°", ECELL = "<i>E</i>°<sub>cell</sub>";

// ---------- course data (MV.chem.data.E0, M, Mr) ----------
function e0(re){ for (var i = 0; i < D.E0.length; i++) if (D.E0[i][0] === re) return D.E0[i][1]; return null; }
var EM = { Mg:e0("Mg^2+ + 2e- -> Mg"), Al:e0("Al^3+ + 3e- -> Al"), Zn:e0("Zn^2+ + 2e- -> Zn"), Fe:e0("Fe^2+ + 2e- -> Fe"), Ni:e0("Ni^2+ + 2e- -> Ni"),
  Sn:e0("Sn^2+ + 2e- -> Sn"), Pb:e0("Pb^2+ + 2e- -> Pb"), Cu:e0("Cu^2+ + 2e- -> Cu"), Ag:e0("Ag+ + e- -> Ag") };
var EO2 = e0("O2 + 2H2O + 4e- -> 4OH-"), EO2A = e0("O2 + 4H+ + 4e- -> 2H2O");
var NE = { Mg:2, Al:3, Zn:2, Fe:2, Ni:2, Sn:2, Pb:2, Cu:2, Ag:1 };
var NAME = { Fe:"iron", Zn:"zinc", Mg:"magnesium", Al:"aluminium", Sn:"tin", Cu:"copper", Ni:"nickel", Pb:"lead", Ag:"silver" };
function eT(el){ return el + " " + sg(EM[el]) + " V"; }
function oxF(el){ var n = NE[el]; return f(el + "(s) -> " + el + "^" + (n > 1 ? n : "") + "+(aq) + " + (n > 1 ? n : "") + "e-"); }
function ionT(el){ var n = NE[el]; return f(el + "^" + (n > 1 ? n : "") + "+"); }
var CATH = f("O2(g) + 2H2O(l) + 4e- -> 4OH-(aq)");

// ---------- model (plan: model rules, exact) ----------
var RATE = { dry:0, humid:1, fresh:2, salt:6 }, CUR = 0.10, BLOCK_G = 100;
// block lifetime in weeks: (100 ÷ M) × n ÷ 0.10 (Mg 82, Al 111, Zn 31)
function life(el){ return Math.round(BLOCK_G / D.M[el] * NE[el] / CUR); }
// cfg = {env, o2:"on"|"off", coat:"none"|"paint"|"zinc"|"tin", scratch, blk:null|el, imp}
function protOf(s){
  var p = s.prot, c = { env:s.env, o2:s.o2, coat:"none", scratch:false, blk:null, imp:false };
  if (/^paint/.test(p)) c.coat = "paint"; else if (/^galv/.test(p)) c.coat = "zinc"; else if (/^tin/.test(p)) c.coat = "tin";
  c.scratch = /S$/.test(p); if (p === "block") c.blk = s.blk; if (p === "imp") c.imp = true;
  return c;
}
function model(c){
  var base = c.o2 === "off" ? 0 : RATE[c.env], m = { base:base, iron:0, sac:0, anode:null, cath:false, blocked:false, harm:false, prot:null, life:null, why:"" };
  if (c.coat !== "none" && !c.scratch) { m.blocked = true; m.why = "coat"; return m; }
  if (c.env === "dry") m.why = "dry"; else if (c.o2 === "off") m.why = "o2";
  if (c.blk && EM[c.blk] < EM.Fe) m.life = life(c.blk);
  if (c.imp) { m.cath = base > 0; m.prot = "imp"; return m; }
  var pr = [];
  if (c.blk && EM[c.blk] < EM.Fe) pr.push(c.blk);
  if (c.coat === "zinc" && c.scratch) pr.push("Zn");
  pr.sort(function(a, b){ return EM[a] - EM[b]; });
  m.harm = (c.coat === "tin" && c.scratch) || (!!c.blk && EM[c.blk] > EM.Fe);
  if (pr.length) { m.prot = pr[0]; m.sac = base; m.anode = base > 0 ? pr[0] : null; }
  else { m.iron = base * (m.harm ? 2 : 1); m.anode = base > 0 ? "Fe" : null; }
  m.cath = base > 0;
  m.ecell = m.anode ? EO2 - EM[m.anode] : null;
  return m;
}

// @component radioGroup (from MHF4U 25, via SCH4U 01–17) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock); with no option chosen yet, the first option holds the tab stop.
function radios(host, o){
  var val = o.value == null ? "" : String(o.value), locked = false;
  function paint(){
    var fc = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), first = true;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val, d = locked, tab = on || (!any && first && !d); if (!d) first = false; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (tab ? 0 : -1) + '" data-rg="' + esc(x.id) + '"' + (d ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (fc) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(val); if (i < 0) i = d > 0 ? -1 : 0;
    i = (i + d + ids.length) % ids.length; choose(ids[i]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } } };
}

// ---------- SVG helpers ----------
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + Math.round(Math.max(0, op) * 100) / 100 + '"' : ""; }
function tx(x, y, s, o){
  o = o || {};
  return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="middle" font-size="' + (o.fs || 12) + '"' + (o.w ? ' font-weight="' + o.w + '"' : "") +
    ' fill="' + (o.c || "var(--ink)") + '"' + opA(o.op) + ">" + s + "</text>";
}
function circ(x, y, r, fill, o){ o = o || {}; return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(r) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + (o.cls ? ' class="' + o.cls + '"' : "") + (o.style ? ' style="' + o.style + '"' : "") + opA(o.op) + "/>"; }
function ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function rect(x, y, w, h, fill, o){ o = o || {}; return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(Math.max(0, w)) + '" height="' + r1(Math.max(0, h)) + '" rx="' + (o.rx || 0) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function path(d, fill, o){ o = o || {}; return '<path d="' + d + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '" stroke-linejoin="round" stroke-linecap="round"' : "") + opA(o.op) + "/>"; }
function head(x, y, ang, len, fill, op){
  var a1 = ang + 2.6, a2 = ang - 2.6;
  return '<polygon points="' + r1(x) + "," + r1(y) + " " + r1(x + len * Math.cos(a1)) + "," + r1(y + len * Math.sin(a1)) + " " + r1(x + len * Math.cos(a2)) + "," + r1(y + len * Math.sin(a2)) + '" fill="' + fill + '"' + opA(op) + "/>";
}
function arrow(x1, y1, x2, y2, c, o){ o = o || {}; var a = Math.atan2(y2 - y1, x2 - x1); return ln(x1, y1, x2 - 6 * Math.cos(a), y2 - 6 * Math.sin(a), { c:c, w:o.w || 2.2, op:o.op, d:o.d }) + head(x2, y2, a, 9, c, o.op); }
function dome(cx, y, hw, hh){ return "M" + (cx - hw) + "," + y + " C" + (cx - hw) + "," + r1(y - hh * 1.33) + " " + (cx + hw) + "," + r1(y - hh * 1.33) + " " + (cx + hw) + "," + y + " Z"; }
// electrons: a static arrow, plus moving dots unless motion is reduced
function eFlow(x1, y1, x2, y2, o){
  o = o || {}; var h = arrow(x1, y1, x2, y2, "var(--ec-e)", { op:o.op });
  if (o.lab !== false) h += tx((x1 + x2) / 2 + (o.lx || 0), (y1 + y2) / 2 + (o.ly == null ? -8 : o.ly), "e<tspan dy=\"-4\" font-size=\"9\">−</tspan>", { fs:11, w:700, c:"var(--ec-e)", op:o.op });
  if (!MV.reduceMotion && o.anim !== false && (o.op == null || o.op > 0.5)) for (var k = 0; k < 3; k++) h += circ(x1, y1, 3.2, "var(--ec-e)", { cls:"cr-ea", style:"--dx:" + r1(x2 - x1) + "px;--dy:" + r1(y2 - y1) + "px;animation-delay:" + (-k * 0.6) + "s" });
  return h;
}
// ions leaving a surface (cerulean) with a label
function ionsUp(x, y, lab, o){
  o = o || {}; var h = "", c = o.c || "var(--at-m)", op = o.op == null ? 1 : o.op, P = [[-6, -9], [5, -19], [-2, -30]];
  P.forEach(function(p){ h += circ(x + p[0], y + p[1], 3.6, c, { op:op }); });
  h += tx(x + (o.lx || 10), y - 40, lab, { fs:11, w:700, a:o.la || "start", c:"var(--ink)", op:op });
  if (!MV.reduceMotion && o.anim !== false && op > 0.5) for (var k = 0; k < 2; k++) h += circ(x, y - 2, 3.6, c, { cls:"cr-ia", style:"animation-delay:" + (-k * 1.1) + "s" });
  return h;
}
function nwHTML(s){ return '<span class="nw">' + s + "</span>"; }

// ---------- @component C10 cellBuilder ("surface cell" variant) — water drop on a steel plate, drawn from a cfg and its model ----------
// dropSVG(cfg, m, o) -> svg string. o = {used: sacrificial units used so far, rust: rust units, st:{o2, ion, e, oh, rust} (hero stage opacities), anim, lab}
var G = { x0:30, x1:430, py:170, pb:198, ct:8, cx:230 };
var BLK = { Mg:"var(--at-m)", Al:"var(--at-m)", Zn:"var(--at-m)", Sn:"var(--paper)", Cu:"var(--at-p)" };
function dropSVG(c, m, o){
  o = o || {}; var st = o.st || {};
  function op(k){ return st[k] == null ? 1 : st[k]; }
  var coat = c.coat !== "none", SY = coat ? G.py - G.ct : G.py, cx = G.cx, wet = c.env !== "dry", big = c.env === "fresh" || c.env === "salt";
  var hw = big ? 150 : 95, hh = big ? 84 : 46, h = "", used = o.used || 0, rust = o.rust || 0;
  var gw = 15 + (c.coat === "zinc" ? Math.min(34, used * 0.5) : 0);
  // impressed-current supply and inert anode (behind the drop)
  if (c.imp) {
    h += rect(330, 8, 110, 34, "var(--sheet)", { rx:5, s:"var(--ink)", sw:1.5 }) + tx(385, 18, "power supply", { fs:10, c:"var(--ink-2)" });
    h += tx(348, 32, "+", { fs:15, w:700 }) + tx(422, 32, "−", { fs:15, w:700 });
    h += '<polyline points="345,42 345,52 300,52 300,60" fill="none" stroke="var(--ink)" stroke-width="1.6"/>' + rect(295, 60, 10, SY - 92, "var(--ink-2)", { rx:2 }) + tx(286, 70, "inert anode", { fs:10, a:"end", c:"var(--ink-2)" });
    h += '<polyline points="425,42 425,50 448,50 448,184 430,184" fill="none" stroke="var(--ink)" stroke-width="1.6"/>';
  }
  if (wet && c.o2 === "off") { h += path(dome(cx, SY, hw + 9, hh + 14), "var(--cr-oil)", { s:"var(--at-s)", sw:1.2 }) + tx(cx, SY - (hh + 14) - 4, "oil layer", { fs:11, c:"var(--ink-2)" }); }
  if (wet) h += path(dome(cx, SY, hw, hh), "var(--hi-soft)", { s:"var(--pen)", sw:1.2 });
  if (c.env === "salt") [[-90, -14], [-40, -40], [20, -24], [70, -50], [100, -16], [-110, -30], [0, -58], [50, -10]].forEach(function(p, i){ h += circ(cx + p[0], SY + p[1], 2.4, i % 2 ? "var(--ec-an)" : "var(--ec-cat)"); });
  // plate and coating
  h += rect(G.x0, G.py, G.x1 - G.x0, G.pb - G.py, "var(--ink-2)", { rx:2 }) + tx(G.x0 + 8, 185, "steel (Fe)", { fs:11, w:700, a:"start", c:"var(--sheet)" });
  if (coat) {
    var cf = c.coat === "paint" ? "var(--rule)" : c.coat === "zinc" ? "var(--at-m)" : "var(--paper)", cs = { s:"var(--ink-2)", sw:1 };
    if (c.scratch) h += rect(G.x0, SY, cx - gw - G.x0, G.ct, cf, cs) + rect(cx + gw, SY, G.x1 - cx - gw, G.ct, cf, cs);
    else h += rect(G.x0, SY, G.x1 - G.x0, G.ct, cf, cs);
    h += tx(G.x0, SY - 7, c.coat === "paint" ? "paint" : c.coat === "zinc" ? "Zn coat" : "Sn coat", { fs:11, w:700, a:"start", c:"var(--ink-2)" });
  }
  // block (touching the steel through a bolt)
  var bx = cx + hw - 60, bw = 32;
  if (c.blk) {
    var fr = m.life && m.base > 0 ? Math.min(0.8, used / Math.max(1, m.base) / m.life) : 0, bh = 30 * (1 - fr);
    if (coat) h += rect(bx + 12, SY - 2, 8, G.ct + 4, "var(--ink)");
    h += rect(bx, SY - bh, bw, bh, BLK[c.blk], { rx:3, s:"var(--ink)", sw:1.2 });
    h += tx(bx + bw / 2, SY - bh / 2, c.blk, { fs:12, w:700, c:BLK[c.blk] === "var(--paper)" ? "var(--ink)" : "var(--sheet)" });
  }
  // status line for no cell
  var msg = "";
  if (m.blocked) msg = "Intact coating: water and O₂ can’t reach the iron";
  else if (m.why === "dry") msg = "Dry air: no water, so no cell";
  else if (m.why === "o2") msg = "No O₂: no cathode reaction";
  if (msg) h += tx(cx, 22, msg, { fs:12, w:700, c:"var(--ink-2)" });
  // O₂ at the drop's edges
  if (wet && c.o2 === "on") {
    [-1, 1].forEach(function(sd){
      for (var k = 0; k < 4; k++) h += circ(cx + sd * (hw - 10 - k * 11), SY - 7 - k * 9 - (k > 1 ? 4 : 0), 3.4, "var(--pen)", { op:op("o2") });
      h += tx(cx + sd * (hw + 6), SY - 26, "O₂", { fs:11, w:700, a:sd > 0 ? "start" : "end", c:"var(--pen)", op:op("o2") });
    });
    h += circ(cx - 30, SY - hh * 0.95, 3, "var(--pen)", { op:op("o2") }) + circ(cx + 24, SY - hh * 0.9, 3, "var(--pen)", { op:op("o2") });
  }
  var lab = [];                                     // labels under the plate: [x, text]
  if (m.base > 0 && !m.blocked) {
    var ey = 191, edge = hw - 26;
    if (c.imp) {
      h += eFlow(448, 70, 448, 160, { op:op("e"), lab:false }) + eFlow(426, ey, 290, ey, { op:op("e") });
      [-1, 1].forEach(function(sd){ h += ionsUp(cx + sd * edge, SY, "OH⁻", { op:op("oh"), la:sd > 0 ? "start" : "end", lx:sd > 0 ? 10 : -10 }); });
      lab.push([cx, "steel = cathode (O₂ reduced on it)"]);
    } else if (m.anode === "Fe") {
      var ax = cx, ay = coat && c.scratch ? G.py : SY;
      h += ionsUp(ax, ay, "Fe²⁺", { op:op("ion") });
      h += eFlow(cx - 8, ey, cx - edge, ey, { op:op("e") }) + eFlow(cx + 8, ey, cx + edge - (c.blk ? 40 : 0), ey, { op:op("e") });
      if (c.blk) h += eFlow(bx + bw / 2, ey, bx + bw / 2, SY + 3, { op:op("e"), lab:false });
      h += ionsUp(cx - edge, SY, "OH⁻", { op:op("oh"), la:"end", lx:-10 });
      if (!c.blk) h += ionsUp(cx + edge, SY, "OH⁻", { op:op("oh") });
      lab.push([ax, coat && c.scratch ? "anode (scratch)" : "anode"]); lab.push([cx - edge, "cathode"]); lab.push([c.blk ? bx + bw / 2 : cx + edge, c.blk ? "cathode (" + c.blk + ")" : c.coat === "tin" ? "cathode (Sn)" : "cathode"]);
      // rust where Fe²⁺ meets OH⁻
      if (rust > 0 || st.rust != null) {
        var amt = st.rust != null ? st.rust * 30 : rust, rw = 7 + Math.min(20, Math.sqrt(amt) * 3), rh = 2 + Math.min(8, Math.sqrt(amt) * 1.1), off = coat && c.scratch ? gw + 8 : edge * 0.5;
        [-1, 1].forEach(function(sd){ if (amt > 0) h += '<ellipse cx="' + r1(cx + sd * off) + '" cy="' + r1(SY - rh * 0.4) + '" rx="' + r1(rw) + '" ry="' + r1(rh) + '" fill="var(--cr-rust)" stroke="var(--at-s)" stroke-width="1"' + opA(st.rust != null ? Math.min(1, st.rust * 2) : 1) + "/>"; });
        if (amt > 0) h += tx(cx + off + rw + 4, SY - rh - 8, "rust", { fs:11, w:700, a:"start", c:"var(--ink)", op:st.rust != null ? Math.min(1, st.rust * 2) : 1 });
      }
    } else if (m.anode) {
      if (m.anode === c.blk) {
        h += ionsUp(bx + bw / 2, SY - 30 * (1 - Math.min(0.8, used / Math.max(1, m.base) / (m.life || 1))), ionT(c.blk), { op:op("ion") });
        h += eFlow(bx + bw / 2, SY + 3, bx + bw / 2, ey, { op:op("e"), lab:false }) + eFlow(bx + bw / 2 - 6, ey, cx - edge, ey, { op:op("e") });
        h += ionsUp(cx - edge, SY, "OH⁻", { op:op("oh"), la:"end", lx:-10 }) + ionsUp(cx - 40, SY, "OH⁻", { op:op("oh") });
        lab.push([bx + bw / 2, "anode (" + c.blk + ")"]); lab.push([cx - edge * 0.6, "cathode: the steel"]);
      } else {                                      // zinc coat at a scratch
        [-1, 1].forEach(function(sd){ h += ionsUp(cx + sd * (gw + 10), SY, sd > 0 ? ionT("Zn") : "", { op:op("ion"), lx:14 }); });
        h += eFlow(cx - gw - 40, ey, cx - 6, ey, { op:op("e") }) + eFlow(cx + gw + 40, ey, cx + 6, ey, { op:op("e"), lab:false });
        h += circ(cx - 4, G.py - 4, 3, "var(--at-m)", { op:op("oh") }) + tx(cx, G.py - 16, "OH⁻", { fs:10, w:700, op:op("oh") });
        lab.push([cx - gw - 34, "anode (Zn)"]); lab.push([cx + gw + 52, "cathode: Fe at scratch"]);
      }
    }
  }
  if (coat && c.scratch && !lab.length) lab.push([cx, "scratch"]);
  lab.forEach(function(L){ h += ln(L[0], G.pb + 2, L[0], G.pb + 8, { c:"var(--ink-2)", w:1.2 }) + tx(clamp(L[0], 60, 400), G.pb + 20, L[1], { fs:11, w:700 }); });
  return h;
}
function dropAria(c, m, t){
  var env = { dry:"dry air", humid:"a thin film of water in humid air", fresh:"a drop of fresh water", salt:"a drop of salt water" }[c.env];
  var s = "Steel plate with " + env + (c.o2 === "off" ? " under an oil layer, with no oxygen" : "") + ". ";
  if (c.coat !== "none") s += (c.coat === "zinc" ? "Zinc" : c.coat === "tin" ? "Tin" : "Paint") + " coating, " + (c.scratch ? "scratched under the drop. " : "intact. ");
  if (c.blk) s += "A " + NAME[c.blk] + " block touches the steel. ";
  if (c.imp) s += "The steel is wired to the negative terminal of a power supply. ";
  if (m.blocked) return s + "The coating blocks the cell: nothing happens.";
  if (!m.base) return s + "No cell runs.";
  if (c.imp) return s + "Electrons flow from the supply into the steel; O₂ is reduced on the steel. The iron doesn’t rust.";
  if (m.anode === "Fe") return s + "The iron at the centre is the anode: Fe²⁺ ions leave it, electrons flow through the plate to the cathode, where O₂ becomes OH⁻. Rust forms between them: " + m.iron * t + " units after " + t + " weeks.";
  return s + "The " + NAME[m.anode] + " is the anode and loses electrons; electrons flow into the steel, where O₂ is reduced. The iron stays bright.";
}

// ---------- protection panel: the metals in contact on the reduction table ----------
function panelSVG(c, m){
  var rows = [{ k:"O2", t:f("O2 / OH-"), e:EO2 }], seen = { Fe:1 };
  rows.push({ k:"Fe", t:"Fe", e:EM.Fe });
  [c.coat === "zinc" ? "Zn" : c.coat === "tin" ? "Sn" : null, c.blk].forEach(function(el){ if (el && !seen[el]) { seen[el] = 1; rows.push({ k:el, t:el, e:EM[el] }); } });
  rows.sort(function(a, b){ return b.e - a.e; });
  var h = "", y0 = 26, dy = Math.min(46, 150 / Math.max(1, rows.length - 1)), Y = {};
  h += tx(12, 12, "higher " + "E° (more easily reduced)", { fs:10, a:"start", c:"var(--ink-2)" });
  rows.forEach(function(r, i){
    var y = y0 + i * dy; Y[r.k] = y;
    var an = m.anode === r.k || (r.k === "Fe" && m.anode === "Fe"), isM = r.k !== "O2";
    h += rect(70, y - 13, 90, 26, an ? "var(--hi-soft)" : "var(--sheet)", { rx:6, s:an ? "var(--ink)" : "var(--rule)", sw:an ? 2 : 1.5 });
    h += tx(115, y, r.t, { fs:12, w:700, c:isM && r.k !== "Fe" && BLK[r.k] && BLK[r.k] !== "var(--paper)" ? "var(--ink)" : "var(--ink)" }) + tx(166, y, sg(r.e) + " V", { fs:11, a:"start" });
    if (an) h += tx(64, y, "anode", { fs:10, w:700, a:"end", c:"var(--ink)" });
  });
  h += tx(12, y0 + (rows.length - 1) * dy + 24, "lower E° (more easily oxidized)", { fs:10, a:"start", c:"var(--ink-2)" });
  if (m.anode && m.base > 0) { var ya = Y[m.anode] - 13, yb = Y.O2 + 13; h += arrow(150, ya, 150, yb + 2, "var(--ec-e)") + tx(140, (ya + yb) / 2, "e⁻", { fs:11, w:700, a:"end", c:"var(--ec-e)" }); }
  else if (c.imp && m.base > 0) h += tx(115, y0 + rows.length * dy + 10, "the supply pushes e⁻ into Fe", { fs:10, c:"var(--ec-e)" });
  return '<svg class="cr-pp-svg" viewBox="0 0 230 ' + Math.round(y0 + (rows.length - 1) * dy + 40) + '" role="img" aria-label="' + esc("Protection panel on the reduction table: " + rows.map(function(r){ return MV.plain(r.t) + " " + MV.plain(sg(r.e)) + " V"; }).join(", ") + ". " + (m.anode && m.base > 0 ? NAME[m.anode] + " has the lowest E° and loses electrons." : c.imp ? "The power supply provides the electrons." : "No metal is losing electrons.")) + '">' + h + "</svg>";
}

// ---------- hero ----------
function hero(){
  var svg = $("#cr-hx-svg"), ctr = $("#cr-hx-ctr"), rep = $("#cr-hx-replay");
  if (!svg) return;
  var c = { env:"fresh", o2:"on", coat:"none", scratch:false, blk:null, imp:false }, m = model(c), run = 0;
  var CAP = ["A water drop sits on an iron plate.", "Oxygen dissolves most easily near the drop’s edge.", "At the oxygen-poor centre, iron dissolves: Fe → Fe²⁺ + 2e⁻. That’s the anode.",
    "Electrons run through the iron to the edge, where O₂ is reduced to OH⁻. That’s the cathode.", "Rust grows where Fe²⁺ meets OH⁻. Anode at the centre, cathode at the edge."];
  function draw(st, anim){ svg.innerHTML = dropSVG(c, m, { st:st, anim:anim }); }
  function final(){ draw({ o2:1, ion:1, e:1, oh:1, rust:1 }, true); ctr.textContent = "Anode at the centre, cathode at the edge."; rep.hidden = MV.reduceMotion; }
  function play(){
    var my = ++run, st = { o2:0, ion:0, e:0, oh:0, rust:null }; rep.hidden = true;
    function ok(){ return my === run; }
    var steps = [null, "o2", "ion", "e", "rust"];
    (function step(i){
      if (!ok()) return;
      if (i >= steps.length) { MV.wait(600, function(){ if (ok()) final(); }); return; }
      ctr.textContent = CAP[i];
      var k = steps[i];
      if (!k) { draw(st, false); MV.wait(900, function(){ step(i + 1); }); return; }
      MV.tween({ dur:900, step:function(t){ if (!ok()) return; if (k === "rust") st.rust = t; else { st[k] = t; if (k === "e") st.oh = t; } draw(st, false); },
        done:function(){ if (!ok()) return; MV.wait(1200, function(){ step(i + 1); }); } });
    })(0);
  }
  rep.addEventListener("click", play);
  if (MV.reduceMotion) final(); else play();
}

// ---------- Explore: Rusting simulator ----------
var PROT_IDS = ["none", "paintI", "paintS", "galvI", "galvS", "tinI", "tinS", "block", "imp"];
function cleanSet(s, d){
  s = s && typeof s === "object" ? s : {};
  return { env:RATE[s.env] != null ? s.env : d.env, o2:s.o2 === "off" ? "off" : "on", prot:PROT_IDS.indexOf(s.prot) >= 0 ? s.prot : d.prot, blk:EM[s.blk] != null && ["Mg", "Al", "Zn", "Sn", "Cu"].indexOf(s.blk) >= 0 ? s.blk : "Mg" };
}
function explore(host, api){
  var S = api.S, C = api.content;
  if (["drop", "side", "nail"].indexOf(S.mode) < 0) S.mode = "drop";
  S.a = cleanSet(S.a, { env:"fresh", prot:"none" }); S.b = cleanSet(S.b, { env:"salt", prot:"none" });
  S.ed = S.ed === "b" ? "b" : "a"; S.t = clamp(Math.round(+S.t || 0), 0, 52);
  var N = S.nail = S.nail && typeof S.nail === "object" ? S.nail : {}; N.ran = !!N.ran; N.rec = N.rec && typeof N.rec === "object" ? N.rec : {};
  var locked = false, busy = false, note = "", nailT = N.ran ? 1 : 0, tw = null, nailMsg = null;

  host.innerHTML = '<p class="how">' + C.how + '</p><div class="cr-modes"></div><div class="cr-grid">' +
    '<div class="cr-view" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p><div class="cr-stage"></div><p class="cr-cap" aria-live="polite"></p></div>' +
    '<div class="cr-side"><div class="cr-ctl"><div class="cr-ed"></div><div class="cr-env"></div><div class="cr-o2"></div><div class="cr-prot"></div><div class="cr-blk"></div>' +
    '<div class="cr-time"><label for="cr-t" class="rg-lab">Time: <output id="cr-tout"></output></label><input type="range" id="cr-t" min="0" max="52" step="1"></div></div>' +
    '<div class="cr-nctl"></div><h4 class="cr-h4 cr-rh"></h4><dl class="read cr-read" aria-live="polite"></dl><div class="cr-pp"></div></div></div>' +
    '<p class="tiny muted cr-note">' + C.modelNote + '</p><div class="cr-tabs"></div>';
  var stage = $(".cr-stage", host), slider = $("#cr-t"), nctl = $(".cr-nctl", host);
  MV.chem.tablePanel($(".cr-tabs", host), "e0", { title:"Course data table: standard reduction potentials" });

  function cur(){ return S.mode === "side" ? S[S.ed] : S.a; }
  var RG = {};
  RG.mode = radios($(".cr-modes", host), { label:"View", aria:"Simulator view", options:C.modes, value:S.mode, onChange:function(v){ S.mode = v; note = ""; api.save(); syncRG(); paint(); } });
  RG.ed = radios($(".cr-ed", host), { label:"Edit", aria:"Panel to edit", options:[{ id:"a", t:"Left panel" }, { id:"b", t:"Right panel" }], value:S.ed, onChange:function(v){ S.ed = v; api.save(); syncRG(); paint(); } });
  RG.env = radios($(".cr-env", host), { label:"Environment", cls:"chips", aria:"Environment", options:C.envs, value:cur().env, onChange:function(v){ cur().env = v; note = ""; api.save(); paint(); } });
  RG.o2 = radios($(".cr-o2", host), { label:"Oxygen", aria:"Oxygen", options:C.o2s, value:cur().o2, onChange:function(v){ cur().o2 = v; note = ""; api.save(); paint(); } });
  RG.prot = radios($(".cr-prot", host), { label:"Protection", cls:"chips", aria:"Protection", options:C.prots, value:cur().prot, onChange:function(v){ cur().prot = v; note = ""; api.save(); paint(); } });
  RG.blk = radios($(".cr-blk", host), { label:"Block metal", cls:"chips", aria:"Block metal", options:C.blocks, value:cur().blk, onChange:function(v){ cur().blk = v; note = ""; api.save(); paint(); } });
  function syncRG(){ var s = cur(); RG.mode.set(S.mode); RG.ed.set(S.ed); RG.env.set(s.env); RG.o2.set(s.o2); RG.prot.set(s.prot); RG.blk.set(s.blk); }
  slider.value = S.t;
  slider.addEventListener("input", function(){ S.t = +slider.value; note = ""; api.save(); paint(); });
  slider.addEventListener("keydown", function(e){
    if (!e.shiftKey) return; var d = (e.key === "ArrowRight" || e.key === "ArrowUp") ? 10 : (e.key === "ArrowLeft" || e.key === "ArrowDown") ? -10 : 0; if (!d) return;
    e.preventDefault(); S.t = clamp(S.t + d, 0, 52); slider.value = S.t; note = ""; api.save(); paint();
  });
  function lock(b){ locked = b; Object.keys(RG).forEach(function(k){ RG[k].lock(b); }); slider.disabled = b; paintNail(); }

  function envT(id){ return C.envs.filter(function(x){ return x.id === id; })[0].t; }
  function protT(s){ var p = C.prots.filter(function(x){ return x.id === s.prot; })[0].t; return s.prot === "block" ? p + " (" + s.blk + ")" : p; }
  function setT(s){ return envT(s.env) + (s.o2 === "off" ? ", O₂ removed" : "") + "; " + protT(s); }

  function readRows(s){
    var c = protOf(s), m = model(c), t = S.t, rows = [], sacShown = c.coat === "zinc" && c.scratch || (c.blk && m.prot === c.blk);
    var noC = m.blocked ? "none (the coating blocks water and oxygen)" : m.why === "dry" ? "none (no water)" : m.why === "o2" ? "none (no O₂)" : "none";
    rows.push(["Anode reaction", m.anode ? oxF(m.anode) : c.imp && m.base > 0 ? "none on the steel (the supply’s inert anode does the oxidizing)" : noC]);
    rows.push(["Cathode reaction", m.cath ? CATH : noC]);
    rows.push([ECELL, m.anode ? sg(m.ecell) + " V" : c.imp && m.base > 0 ? "— (the power supply drives it)" : muted("—")]);
    rows.push(["Metal being oxidized", m.anode ? NAME[m.anode] : "none"]);
    rows.push(["Iron rust rate", m.iron + " units/week"]);
    if (sacShown) rows.push(["Sacrificial metal used", m.sac + " units/week"]);
    rows.push(["Rust after " + t + " weeks", m.iron * t + " units"]);
    if (c.blk) rows.push(["Block lifetime", m.life ? m.life + " weeks" + (m.base > 0 && t > m.life ? " (by week " + t + " this block would need replacing)" : "") : muted("not used up: it isn’t the anode")]);
    return rows;
  }
  function capFor(s){
    var c = protOf(s), m = model(c);
    if (m.blocked) return "The intact coating keeps water and oxygen off the iron, so no cell forms.";
    if (m.why === "dry") return "Dry air: with no water there’s no cell, so no rust.";
    if (m.why === "o2") return "With the oxygen removed there’s no cathode reaction, so the cell can’t run.";
    if (c.imp) return "The negative terminal pushes electrons into the steel, so the steel is the cathode and isn’t oxidized.";
    if (m.anode === "Fe") return (m.harm ? "<strong>" + (c.blk ? NAME[c.blk] : "tin") + " (" + sg(EM[c.blk || "Sn"]) + " V) is above iron (" + sg(EM.Fe) + " V)</strong>, so the iron is the anode: it rusts twice as fast. " : "") +
      "Iron dissolves at the anode; electrons travel through the metal to the oxygen-rich cathode; rust forms where Fe²⁺ meets OH⁻.";
    return "<strong>" + NAME[m.anode] + " (" + sg(EM[m.anode]) + " V) is below iron (" + sg(EM.Fe) + " V)</strong>, so it’s oxidized instead: electrons flow from it into the steel. The iron stays bright.";
  }
  function oneDrop(s, id, title){
    var c = protOf(s), m = model(c), t = S.t;
    return (title ? '<p class="cr-pt"><strong>' + title + "</strong> " + muted(setT(s)) + "</p>" : "") + '<div class="cr-box"><svg class="cr-svg" id="' + id + '" viewBox="0 0 460 230" role="img" aria-label="' + esc(dropAria(c, m, t)) + '">' + dropSVG(c, m, { used:m.sac * t, rust:m.iron * t }) + "</svg></div>";
  }
  function barsSVG(){
    var A = model(protOf(S.a)).iron * S.t, B = model(protOf(S.b)).iron * S.t, mx = Math.max(12, A, B), sc = 300 / mx, h = "";
    h += tx(4, 12, "Rust after " + S.t + " weeks (model units)", { fs:12, w:700, a:"start" });
    [["Left", A, 36], ["Right", B, 74]].forEach(function(r){ h += tx(4, r[2], r[0], { fs:12, a:"start" }) + rect(60, r[2] - 11, Math.max(1, r[1] * sc), 22, "var(--cr-rust)", { s:"var(--at-s)", sw:1 }) + tx(66 + r[1] * sc, r[2], r[1] + " units", { fs:12, w:700, a:"start" }); });
    h += ln(60, 22, 60, 90, { c:"var(--ink-2)", w:1.2 });
    return '<svg class="cr-bars" viewBox="0 0 460 96" role="img" aria-label="' + esc("Bar chart, rust after " + S.t + " weeks: left " + A + " units, right " + B + " units.") + '">' + h + "</svg>";
  }
  // nail inquiry
  function tubesSVG(){
    var h = "", T = C.tubes;
    T.forEach(function(tb, i){
      var x = 62 + i * 112, c = { env:tb.env, o2:tb.o2 }, rate = tb.o2 === "off" ? 0 : RATE[tb.env], amt = rate * nailT;
      if (tb.env !== "dry") h += rect(x - 24, 70, 48, 104, "var(--hi-soft)");
      if (tb.o2 === "off") h += rect(x - 24, 62, 48, 10, "var(--cr-oil)", { s:"var(--at-s)", sw:1 }) + tx(x + 30, 58, "oil", { fs:10, a:"start", c:"var(--ink-2)" });
      if (tb.env === "dry") for (var g = 0; g < 9; g++) h += circ(x - 18 + (g % 5) * 9, 168 - Math.floor(g / 5) * 7, 3, "var(--ink-2)");
      if (tb.env === "salt") for (var q = 0; q < 8; q++) h += circ(x - 16 + (q % 4) * 11, 96 + Math.floor(q / 4) * 40 + (q % 2) * 12, 2.2, q % 2 ? "var(--ec-an)" : "var(--ec-cat)");
      h += path("M" + (x - 26) + ",30 L" + (x - 26) + ",160 Q" + (x - 26) + ",182 " + x + ",182 Q" + (x + 26) + ",182 " + (x + 26) + ",160 L" + (x + 26) + ",30", "none", { s:"var(--ink)", sw:1.8 });
      h += rect(x - 3, 40, 6, 120, "var(--ink-2)", { rx:2 }) + rect(x - 9, 36, 18, 6, "var(--ink-2)", { rx:2 });
      var n = Math.round(amt * 1.5);
      for (var k = 0; k < n; k++) h += '<ellipse cx="' + (x + (k % 2 ? 4 : -4)) + '" cy="' + (150 - k * 9) + '" rx="' + r1(3 + amt * 0.25) + '" ry="3" fill="var(--cr-rust)" stroke="var(--at-s)" stroke-width="0.8"/>';
      h += tx(x, 16, "Tube " + tb.id, { fs:13, w:700 });
      var words = tb.t.split(" "), half = Math.ceil(words.length / 2);
      h += tx(x, 198, words.slice(0, half).join(" "), { fs:10.5, c:"var(--ink-2)" }) + tx(x, 211, words.slice(half).join(" "), { fs:10.5, c:"var(--ink-2)" });
      void c;
    });
    return '<div class="cr-box"><svg class="cr-svg" id="cr-tubes" viewBox="0 0 460 220" role="img" aria-label="' + esc("Four test tubes, each with an iron nail. " + C.tubes.map(function(tb){ return "Tube " + tb.id + ": " + tb.t + "."; }).join(" ") + (N.ran ? " After 1 week: A and B show no rust, C a little rust, D lots of rust." : " Not run yet.")) + '">' + h + "</svg></div>";
  }
  var NAIL_ANS = { A:"0", B:"0", C:"1", D:"2" };
  var NAIL_FB = { A:"Tube A has no water, so there’s no cell: no rust.", B:"Tube B has no oxygen (boiled water under oil), so there’s no cathode reaction: no rust.",
    C:"Tap water and air: the nail rusts, but slowly. Compare it with D.", D:"Salt water: the ions carry charge, so D rusts the most." };
  function paintNail(){
    if (S.mode !== "nail") { nctl.innerHTML = ""; return; }
    var dis = locked || busy ? " disabled" : "";
    MV.keepFocus(nctl, function(){
      var h = '<p class="cr-ni">' + C.nailIntro + '</p><div class="q-actions"><button type="button" class="btn primary sm" data-act="nrun" data-k="nrun"' + dis + ">" + (N.ran ? "Run again (1 week)" : "Run for 1 week") + '</button><button type="button" class="btn ghost sm" data-act="nreset" data-k="nreset"' + dis + ">Reset</button></div>";
      h += '<table class="cr-nt"><caption class="cr-h4">Results table</caption><thead><tr><th scope="col">Tube</th><th scope="col">What you see after 1 week</th></tr></thead><tbody>' +
        C.tubes.map(function(tb){ return '<tr><th scope="row">' + tb.id + '</th><td><div class="rg chips" role="radiogroup" aria-label="Tube ' + tb.id + ' observation">' + C.obs.map(function(o){ var on = N.rec[tb.id] === o.id; return '<button type="button" role="radio" aria-checked="' + on + '" data-nt="' + tb.id + '" data-no="' + o.id + '" data-k="n' + tb.id + o.id + '"' + (N.ran ? dis : " disabled") + ">" + o.t + "</button>"; }).join("") + "</div></td></tr>"; }).join("") + "</tbody></table>";
      h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="ncheck" data-k="ncheck"' + (N.ran ? dis : " disabled") + ">Check results</button></div>";
      if (nailMsg) h += MV.fbHTML(nailMsg.ok ? "good" : nailMsg.soft ? "" : "bad", nailMsg.t);
      nctl.innerHTML = h;
    });
  }
  nctl.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.nt) { N.rec[b.dataset.nt] = b.dataset.no; nailMsg = null; api.save(); paintNail(); return; }
    if (b.dataset.act === "nreset") { N.ran = false; N.rec = {}; nailT = 0; nailMsg = null; api.save(); paint(); return; }
    if (b.dataset.act === "nrun") {
      busy = true; nailT = 0; nailMsg = null; paint();
      tw = MV.tween({ dur:1600, step:function(t){ nailT = t; stage.innerHTML = tubesSVG(); }, done:function(){ tw = null; busy = false; nailT = 1; N.ran = true; api.save(); paint(); } });
      return;
    }
    if (b.dataset.act === "ncheck") {
      var miss = C.tubes.filter(function(tb){ return !N.rec[tb.id]; });
      if (miss.length) nailMsg = { soft:true, t:"Record an observation for every tube first." };
      else {
        var bad = C.tubes.filter(function(tb){ return N.rec[tb.id] !== NAIL_ANS[tb.id]; });
        nailMsg = bad.length ? { t:"<strong>✗ Not quite.</strong> " + bad.map(function(tb){ return NAIL_FB[tb.id]; }).join(" ") } : { ok:true, t:"<strong>✓ Your table matches.</strong> " + C.nailDone };
      }
      paintNail(); MV.focusFb(nctl);
    }
  });

  function paint(){
    var md = S.mode, s = cur();
    host.querySelector(".cr-grid").classList.toggle("cr-wide", md === "side");
    $(".cr-ctl", host).hidden = md === "nail";
    $(".cr-ed", host).hidden = md !== "side";
    $(".cr-blk", host).hidden = s.prot !== "block";
    $("#cr-tout").textContent = S.t + (S.t === 1 ? " week" : " weeks");
    slider.value = S.t;
    if (md === "drop") stage.innerHTML = oneDrop(S.a, "cr-d1");
    else if (md === "side") stage.innerHTML = '<div class="cr-two">' + '<div class="cr-pn' + (S.ed === "a" ? " on" : "") + '">' + oneDrop(S.a, "cr-dl", "Left:") + '</div><div class="cr-pn' + (S.ed === "b" ? " on" : "") + '">' + oneDrop(S.b, "cr-dr", "Right:") + "</div></div>" + barsSVG();
    else stage.innerHTML = tubesSVG();
    if (md === "nail") {
      $(".cr-rh", host).textContent = "Model rates";
      $(".cr-read", host).innerHTML = MV.readoutHTML(C.tubes.map(function(tb){ var r = tb.o2 === "off" ? 0 : RATE[tb.env]; return ["Tube " + tb.id + ": rust after 1 week", N.ran ? r + " units" : muted("not run yet")]; }));
      $(".cr-pp", host).innerHTML = "";
      $(".cr-cap", host).innerHTML = busy ? "One week passes…" : N.ran ? "Look at each nail, then fill in the results table." : "Press <strong>Run for 1 week</strong>.";
    } else {
      $(".cr-rh", host).textContent = md === "side" ? "Readout: " + (S.ed === "a" ? "left" : "right") + " panel" : "Readout";
      $(".cr-read", host).innerHTML = MV.readoutHTML(readRows(s));
      var c = protOf(s);
      $(".cr-pp", host).innerHTML = '<h4 class="cr-h4">Protection panel: who loses electrons?</h4>' + panelSVG(c, model(c));
      $(".cr-cap", host).innerHTML = (md === "side" ? "<strong>" + (S.ed === "a" ? "Left" : "Right") + ":</strong> " : "") + capFor(s) + (note ? " <strong>" + note + "</strong>" : "");
    }
    paintNail();
    MV.changed();
  }

  // ----- predictions -----
  function cancelAnim(){ if (tw) { tw(); tw = null; } busy = false; }
  var PS = {
    p1:{ mode:"drop", a:{ env:"fresh", o2:"on", prot:"none", blk:"Mg" }, note:"Fe²⁺ leaves at the centre; O₂ is reduced at the edge; the rust ring forms in between." },
    p2:{ mode:"side", a:{ env:"fresh", o2:"on", prot:"none", blk:"Mg" }, b:{ env:"salt", o2:"on", prot:"none", blk:"Mg" }, note:"The salt-water rust bar grows 3 × faster: 60 units against 20." },
    p3:{ mode:"drop", a:{ env:"salt", o2:"on", prot:"galvS", blk:"Mg" }, note:"Electrons leave the zinc; the iron at the scratch stays bright." },
    p4:{ mode:"side", a:{ env:"salt", o2:"on", prot:"none", blk:"Mg" }, b:{ env:"salt", o2:"on", prot:"tinS", blk:"Mg" }, note:"The scratch’s rust bar (right) is double the bare-iron bar (left): 120 units against 60." }
  };
  var hooks = {
    start:function(p){
      cancelAnim(); var P = PS[p.id]; if (!P) return;
      S.mode = P.mode; S.a = cleanSet(P.a, P.a); if (P.b) { S.b = cleanSet(P.b, P.b); S.ed = "b"; }
      S.t = 0; note = ""; syncRG(); api.save(); paint(); lock(true);
    },
    run:function(p, done){
      var P = PS[p.id] || {};
      tw = MV.tween({ dur:1800, ease:function(t){ return t; }, step:function(t){ S.t = Math.round(10 * t); paint(); },
        done:function(){ tw = null; S.t = 10; note = P.note || ""; api.save(); lock(false); paint(); MV.wait(150, done); } });
    }
  };

  // ----- challenges -----
  function chal(id){
    var s = cur(), c = protOf(s), m = model(c);
    if (S.mode === "nail") return { ok:false, msg:"Switch to Drop view or Side-by-side to try this." };
    var coatP = ["paintI", "paintS", "galvI", "galvS", "tinI", "tinS"].indexOf(s.prot) >= 0;
    if (id === "tc1") {
      if (s.env !== "salt") return { ok:false, msg:"Set the environment to salt water." };
      if (s.o2 === "off") return { ok:false, msg:"A real bridge can’t be kept out of the air." };
      if (coatP) return { ok:false, msg:"That’s a coating; find a way that leaves the surface bare." };
      if (s.prot === "block" && (s.blk === "Sn" || s.blk === "Cu")) return { ok:false, msg:"That made it worse: look at the block’s " + EI + "." };
      if ((s.prot === "imp" || s.prot === "block") && m.iron === 0) return { ok:true };
      return { ok:false };
    }
    if (id === "tc2") {
      if (s.prot === "paintS") return { ok:false, msg:"Paint only blocks. At a scratch, the iron is bare." };
      if (s.prot === "tinS") return { ok:false, msg:"Tin makes the scratch rust faster." };
      if (s.prot === "paintI" || s.prot === "galvI" || s.prot === "tinI") return { ok:false, msg:"That coating is intact. The challenge says the coating is scratched." };
      if (s.prot !== "galvS") return { ok:false, msg:"Choose one of the scratched coatings." };
      if (s.env !== "salt") return { ok:false, msg:"Set the environment to salt water." };
      if (s.o2 === "off") return { ok:false, msg:"Keep the oxygen: the iron is in open salt water." };
      return m.iron === 0 ? { ok:true } : { ok:false };
    }
    if (id === "tc3") {
      if (s.prot !== "block") return { ok:false, msg:"Choose Protection: Block connected." };
      if (s.env !== "salt") return { ok:false, msg:"Set the environment to salt water." };
      if (s.o2 === "off") return { ok:false, msg:"Keep the oxygen: the iron is in open salt water." };
      if (s.blk === "Mg") return { ok:false, msg:"Mg protects, but each gram supplies fewer electrons than Al: 2 ÷ 24.3 ≈ 0.082 mol e⁻ per gram vs 3 ÷ 27.0 ≈ 0.111." };
      if (s.blk === "Zn") return { ok:false, msg:"Zn protects, but 2 ÷ 65.4 ≈ 0.031 mol e⁻ per gram." };
      if (s.blk === "Sn" || s.blk === "Cu") return { ok:false, msg:"These make the iron the anode." };
      return s.blk === "Al" && m.iron === 0 ? { ok:true } : { ok:false };
    }
    return { ok:false };
  }
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Protect the bridge ----------
var BR = { g:[300, 98], r:[130, 81], p:[230, 200], c:[372, 122] };
function bridgeSVG(sel, done){
  var h = "";
  h += rect(0, 186, 460, 44, "var(--hi-soft)") + tx(330, 214, "river", { fs:11, c:"var(--ink-2)" });
  h += path("M0,96 L60,96 L84,230 L0,230 Z", "var(--rule)") + path("M460,96 L400,96 L376,230 L460,230 Z", "var(--rule)");
  for (var i = 0; i < 14; i++) h += circ(20 + i * 31 + (i % 3) * 5, 14 + (i % 4) * 9, 1.8, "var(--ink-2)", { op:0.7 });
  h += tx(14, 52, "winter: road-salt spray", { fs:11, a:"start", c:"var(--ink-2)" });
  h += rect(150, 52, 44, 16, "var(--ink-2)", { rx:4 }) + circ(160, 69, 4, "var(--ink)") + circ(184, 69, 4, "var(--ink)");
  for (var k = 0; k < 7; k++) h += circ(200 + k * 9, 60 + (k % 2) * 6, 1.8, "var(--ec-an)");
  h += rect(40, 70, 380, 22, "var(--paper)", { s:"var(--ink-2)", sw:1.5 }) + ln(48, 81, 412, 81, { c:"var(--ink-2)", w:2, d:"6 4" }) + tx(64, 64, "concrete deck", { fs:10, a:"start", c:"var(--ink-2)" });
  h += rect(40, 92, 380, 12, "var(--ink-2)");
  h += rect(220, 104, 20, 120, "var(--ink-2)");
  h += rect(366, 104, 10, 26, "var(--at-p)", { rx:2 }) + tx(380, 136, "Cu", { fs:11, w:700, a:"start" });
  Object.keys(BR).forEach(function(id, i){
    var p = BR[id], on = sel === id, ok = done[id];
    h += '<g class="cr-bm" data-part="' + id + '">' + circ(p[0], p[1], 12, on ? "var(--ink)" : ok ? "var(--good-bg)" : "var(--sheet)", { s:ok ? "var(--green)" : "var(--ink)", sw:2 }) + tx(p[0], p[1] + 0.5, ok && !on ? "✓" : String(i + 1), { fs:12, w:700, c:on ? "var(--sheet)" : "var(--ink)" }) + "</g>";
  });
  return h;
}
function leadSVG(){
  var h = "";
  h += rect(20, 40, 160, 34, "var(--ink-2)", { rx:3 }) + rect(180, 40, 160, 34, "var(--at-p)", { rx:3 }) + ln(180, 34, 180, 80, { c:"var(--ink)", w:2 });
  h += rect(20, 50, 320, 14, "var(--hi-soft)") + tx(100, 30, "Pb pipe: anode (" + sg(EM.Pb) + " V)", { fs:11, w:700 }) + tx(260, 30, "Cu pipe: cathode (" + sg(EM.Cu) + " V)", { fs:11, w:700 });
  h += arrow(140, 70, 220, 70, "var(--ec-e)") + tx(180, 90, "e⁻ through the metal", { fs:10, c:"var(--ec-e)", w:700 });
  [[150, 56], [160, 60], [170, 54]].forEach(function(p){ h += circ(p[0], p[1], 3, "var(--at-m)"); });
  h += tx(120, 104, "Pb²⁺ dissolves into the tap water", { fs:11 });
  return '<svg class="cr-st-svg" viewBox="0 0 360 112" role="img" aria-label="A lead pipe joined to a copper pipe. Lead is the anode: Pb²⁺ ions dissolve into the water near the joint, and electrons flow through the metal to the copper, the cathode.">' + h + "</svg>";
}
function alSVG(){
  var h = "";
  h += rect(20, 50, 140, 36, "var(--ink-2)", { rx:2 }) + tx(90, 72, "Fe", { fs:13, w:700, c:"var(--sheet)" });
  [[30, 40, -12], [62, 36, 10], [96, 42, -6], [128, 34, 14]].forEach(function(p){ h += '<rect x="' + p[0] + '" y="' + p[1] + '" width="24" height="7" rx="2" fill="var(--cr-rust)" stroke="var(--at-s)" stroke-width="1" transform="rotate(' + p[2] + " " + (p[0] + 12) + " " + (p[1] + 3) + ')"/>'; });
  h += tx(90, 102, "Rust flakes off: fresh iron exposed", { fs:11 });
  h += rect(200, 50, 140, 36, "var(--at-m)", { rx:2 }) + rect(200, 46, 140, 4, "var(--paper)", { s:"var(--ink)", sw:1 }) + tx(270, 72, "Al", { fs:13, w:700, c:"var(--sheet)" });
  h += tx(270, 34, "Al₂O₃ layer: thin, tight, sealing", { fs:11, w:700 }) + tx(270, 102, "The metal underneath is protected", { fs:11 });
  return '<svg class="cr-st-svg" viewBox="0 0 360 112" role="img" aria-label="Left: iron with rust flakes lifting off, exposing fresh metal. Right: aluminium with a thin, tight oxide layer sealing the metal underneath.">' + h + "</svg>";
}
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, P = s1.parts;
  S.parts = S.parts && typeof S.parts === "object" ? S.parts : {};
  P.forEach(function(p){ var x = S.parts[p.id]; S.parts[p.id] = x && typeof x === "object" ? { pick:typeof x.pick === "number" ? x.pick : null, ok:!!x.ok } : { pick:null, ok:false }; });
  var sel = P.some(function(p){ return p.id === S.sel; }) ? S.sel : P[0].id;
  var ladder = ["Cu", "Pb", "Sn", "Ni", "Fe", "Zn", "Al", "Mg"].sort(function(a, b){ return EM[b] - EM[a]; });

  host.innerHTML =
    '<div class="part cr-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="cr-box"><svg class="cr-svg cr-br" id="cr-br" viewBox="0 0 460 230" role="img" aria-label="Schematic highway bridge in winter: 1 steel girders under the deck in road-salt spray, 2 rebar inside the concrete deck, 3 a steel pier standing in a river, 4 a copper drain fitting bolted to a steel beam."></svg></div>' +
      '<div class="cr-parts" role="group" aria-label="Bridge parts"></div><div class="cr-pick" aria-live="polite"></div><p class="cr-prog" aria-live="polite"></p>' +
      '<details class="alg cr-data"><summary>Check it with data</summary><p class="tiny muted">Metals from the course table, highest ' + EI + ' first. A metal touching steel corrodes instead of it only if it sits <strong>below</strong> iron.</p><table class="cr-lad"><thead><tr><th scope="col">Metal</th><th scope="col">' + EI + ' (V)</th><th scope="col">Touching steel in salt water</th></tr></thead><tbody>' +
      ladder.map(function(el){ var fe = el === "Fe"; return '<tr class="' + (fe ? "cr-fe" : "") + '"><td>' + el + " (" + NAME[el] + ")</td><td>" + sg(EM[el]) + "</td><td>" + (fe ? "the steel itself" : EM[el] > EM.Fe ? "makes the steel the anode: faster corrosion" : "is oxidized instead: protects the steel") + "</td></tr>"; }).join("") +
      '</tbody></table><div class="cr-tab3"></div></details></div>' +
    '<div class="part cr-st"><h3>' + C.s2.title + "</h3>" + C.s2.html + leadSVG() + "</div>" +
    '<div class="part cr-st"><h3>' + C.s3.title + "</h3>" + C.s3.html + alSVG() + "</div>" +
    '<div class="part cr-st"><h3>' + C.s4.title + "</h3>" + C.s4.html + "</div>";
  MV.chem.tablePanel($(".cr-tab3", host), "e0", { title:"Course data table: standard reduction potentials" });
  var partsEl = $(".cr-parts", host), pickEl = $(".cr-pick", host), msg = {};

  function done(){ var d = {}; P.forEach(function(p){ d[p.id] = S.parts[p.id].ok; }); return d; }
  function paint(){
    $("#cr-br").innerHTML = bridgeSVG(sel, done());
    MV.keepFocus(partsEl, function(){
      partsEl.innerHTML = P.map(function(p, i){ var on = sel === p.id, ok = S.parts[p.id].ok; return '<button type="button" class="cr-pb' + (ok ? " ok" : "") + '" aria-pressed="' + on + '" data-part="' + p.id + '" data-k="pb' + p.id + '"><span class="cr-pn1">' + (i + 1) + "</span> " + p.short + (ok ? ' <span aria-label="protected">✓</span>' : "") + "</button>"; }).join("");
    });
    var p = P.filter(function(x){ return x.id === sel; })[0], st = S.parts[p.id];
    MV.keepFocus(pickEl, function(){
      var h = '<h4 class="cr-h4">' + p.name + '</h4><div class="opts" role="group" aria-label="Protection choices">' + p.choices.map(function(ch, k){
        var on = st.pick === k, cls = "opt" + (on ? (MV.ok(ch) ? " right" : " wrong") : "");
        return '<button type="button" class="' + cls + '" data-ch="' + k + '" data-k="ch' + p.id + k + '" aria-pressed="' + on + '"><span>' + ch.t + "</span></button>";
      }).join("") + "</div>";
      if (st.pick != null && p.choices[st.pick]) { var ch = p.choices[st.pick]; h += MV.fbHTML(MV.ok(ch) ? "good" : "bad", (MV.ok(ch) ? "" : "<strong>✗ Not the best choice.</strong> ") + ch.fb); }
      pickEl.innerHTML = h;
    });
    var n = P.filter(function(x){ return S.parts[x.id].ok; }).length;
    $(".cr-prog", host).innerHTML = n === P.length ? "<strong>✓ " + s1.done + "</strong>" : "Parts protected: " + n + " of " + P.length + ".";
  }
  host.addEventListener("click", function(e){
    var g = e.target.closest("[data-part]");
    if (g && host.contains(g)) { sel = g.dataset.part; S.sel = sel; api.save(); paint(); return; }
    var b = e.target.closest("[data-ch]"); if (!b) return;
    var p = P.filter(function(x){ return x.id === sel; })[0], k = +b.dataset.ch, st = S.parts[p.id];
    st.pick = k; if (MV.ok(p.choices[k])) st.ok = true;
    api.save(); paint(); MV.focusFb(pickEl); void msg;
  });
  paint();
}

// ---------- Practice 1: Which metal corrodes? (tap the anode; N6 matching style) ----------
function pairsAct(host, api, a){
  var S = api.S; S.items = S.items && typeof S.items === "object" ? S.items : {};
  var msgs = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = {}); x.tries = x.tries || 0; x.hint = x.hint || 0; x.solved = !!x.solved; if (x.first === undefined) x.first = null; return x; }
  function other(it, el){ return el === it.a ? it.b : it.a; }
  function hints(it){ var w = MV.ans(it); return ["Lower " + EI + " is oxidized.", it.a + " " + sg(EM[it.a]) + " V, " + it.b + " " + sg(EM[it.b]) + " V.", w + " corrodes: " + it.fb]; }
  function rowHTML(it, i){
    var x = ist(it.id), w = MV.ans(it), h = '<div class="q" data-pi="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.a + " and " + it.b + " touch in salt water. Which corrodes?</div></div>";
    h += '<div class="cr-mets" role="group" aria-label="Tap the metal that corrodes">' + [it.a, it.b].map(function(el){
      var cls = "cr-met" + (x.solved && el === w ? " right" : "") + (msgs[it.id] && msgs[it.id].el === el ? " wrong" : "");
      return '<button type="button" class="' + cls + '" data-el="' + el + '" data-k="' + it.id + el + '"' + (x.solved ? " disabled" : "") + '><span class="cr-sym">' + el + '</span><span class="cr-mn">' + NAME[el] + "</span></button>";
    }).join("") + "</div>";
    if (!x.solved) h += '<div class="q-actions">' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(hints(it), x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Right: " + NAME[w] + " corrodes.</strong> " + eT(w) + " is below " + eT(other(it, w)) + (w === "Al" ? " (ignoring the oxide layer)" : "") + ", so " + NAME[w] + " is the anode." + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + it.fb + " Try the other metal.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(rowHTML).join(""); }); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-pi]"); if (!bx) return;
    var it = a.items.filter(function(z){ return z.id === bx.dataset.pi; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.el) {
      if (b.dataset.el === MV.ans(it)) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = { el:b.dataset.el }; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-pi="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var fst = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) fst++; }); return { first:fst, total:a.items.length, done:d, line:a.summary + " (first try): " + fst + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal || a.goal)); }); return g; }
  };
}

// ---------- Practice 2: Corrosion reasoning (number entry and choices; adapted from SCH4U 14's calcAct) ----------
function reasonAct(host, api, a){
  var S = api.S; S.items = S.items && typeof S.items === "object" ? S.items : {};
  var msgs = {};
  var use = [f("O2 + 2H2O + 4e- -> 4OH-") + ": " + sg(EO2) + " V", f("O2 + 4H+ + 4e- -> 2H2O") + ": " + sg(EO2A) + " V", f("Fe^2+ + 2e- -> Fe") + ": " + sg(EM.Fe) + " V", "molar mass of Zn: " + D.Mr.Zn + " g/mol"].map(nwHTML).join(" · ");
  function ist(id){ var x = S.items[id] || (S.items[id] = {}); if (typeof x.val !== "string") x.val = ""; if (x.pick === undefined) x.pick = null; x.tries = x.tries || 0; x.hint = x.hint || 0; x.solved = !!x.solved; if (x.first === undefined) x.first = null; return x; }
  function chipsHTML(it, x, dis){ return '<div class="chips cr-chiplist" role="radiogroup" aria-label="Choices">' + it.options.map(function(o, k){ var on = x.pick === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + dis + ">" + o.t + "</button>"; }).join("") + "</div>"; }
  function numHTML(it, x, dis){ return '<div class="numrow"><label for="ci-' + it.id + '">' + (it.label || "Your answer:") + '</label><input class="numin" id="ci-' + it.id + '" data-cin="' + it.id + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" value="' + esc(x.val) + '"' + dis + '><span class="cr-unit">' + (it.unit || "") + "</span></div>"; }
  function itemHTML(it, i){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", h = '<div class="q" data-ci="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "num") h += numHTML(it, x, dis);
    else if (it.kind === "chips") h += chipsHTML(it, x, dis);
    else h += chipsHTML(it, x, dis) + numHTML(it, x, dis);
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) {
      var why = it.kind === "chips" ? (it.options[x.pick] && it.options[x.pick].why) || "" : it.why || it.fb || "";
      h += MV.fbHTML("good", "<strong>✓ Correct: " + (it.kind === "chips" ? it.options[x.pick].t : it.display) + ".</strong> " + why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    } else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + MV.usesHTML(" " + use) + a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(z){ return z.id === id; })[0]; }
  function one(s){ var t = String(s || "").replace(/[–—]/g, "−").replace(/[a-z⁻²]+/gi, "").replace(/^\s*\+/, "").trim(); var v = MV.parseNum(t); return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function near(v, w, tol){ return Math.abs(v - w) <= (tol || 0) + 1e-9; }
  function judge(it, x){
    if (it.kind === "num" || it.kind === "two") {
      if (it.kind === "two") {
        if (x.pick == null) return { bad:"Choose which coating lasts longer first." };
        if (!MV.ok(it.options[x.pick])) return { fb:it.options[x.pick].why || it.fb };
      }
      var v = one(x.val);
      if (v == null) return { bad:"Enter one number, such as 0.50." };
      if (near(v, MV.ans(it), it.tol)) return { ok:true };
      var w = (it.wrong || []).filter(function(z){ return near(v, z.match, 0.005); })[0];
      return { fb:w ? w.fb : it.fb };
    }
    if (x.pick == null) return { bad:"Choose an answer first." };
    return MV.ok(it.options[x.pick]) ? { ok:true } : { fb:it.options[x.pick].why };
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.cin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.cin) { var b = host.querySelector('[data-k="' + e.target.dataset.cin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ci]"); if (!bx) return;
    var it = item(bx.dataset.ci), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.op != null) { x.pick = +b.dataset.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = { t:r.bad, soft:true }; paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = { t:r.fb }; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ci="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var fst = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) fst++; }); return { first:fst, total:a.items.length, done:d, line:a.summary + " (first try): " + fst + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Protect the steel ----------
var task = (function(){
  var S = null, api = null, T = null, rgC = null, rgB = null;
  function cost(list, id){ var o = list.filter(function(x){ return x.id === id; })[0]; return o ? o.cost : 0; }
  function read(){ return { coat:S.coat, blk:S.blk }; }
  function cfgOf(d){ return { env:"salt", o2:"on", coat:d.coat, scratch:d.coat !== "none", blk:d.blk === "none" ? null : d.blk, imp:false }; }
  function paint(){
    var d = read(), c = cfgOf(d), m = model(c), tot = cost(T.coatings, d.coat) + cost(T.blockOpts, d.blk), t = 10;
    $("#cr-tcost").innerHTML = "Cost: <strong>" + tot + "</strong> point" + (tot === 1 ? "" : "s");
    var sv = $("#cr-tsvg");
    sv.innerHTML = dropSVG(c, m, { used:m.sac * t, rust:m.iron * t, anim:true });
    sv.setAttribute("aria-label", "Preview after 10 weeks of road-salt spray, with a scratch under the drop. " + dropAria(c, m, t));
    $("#cr-tpp").innerHTML = panelSVG(c, m);
    $("#cr-tread").innerHTML = MV.readoutHTML([["Metal losing electrons", m.anode ? NAME[m.anode] : "none"], ["Iron rust rate at the scratch", m.iron + " units/week"]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; T = MV.C.task;
      if (!T.coatings.some(function(x){ return x.id === S.coat; })) S.coat = "none";
      if (!T.blockOpts.some(function(x){ return x.id === S.blk; })) S.blk = "none";
      inp.innerHTML = '<div class="cr-tc"></div><div class="cr-tb"></div><p class="cr-tl" id="cr-tcost" aria-live="polite"></p>';
      pv.innerHTML = '<h4 class="cr-h4">Your beam: a drop of salt spray on a scratch</h4><div class="cr-box"><svg class="cr-svg" id="cr-tsvg" viewBox="0 0 460 230" role="img" aria-label=""></svg></div><dl class="read" id="cr-tread"></dl><div id="cr-tpp" class="cr-pp"></div>';
      rgC = radios($(".cr-tc", inp), { label:"Coating", cls:"chips", aria:"Coating and its cost", options:T.coatings.map(function(x){ return { id:x.id, t:x.t + " (" + x.cost + ")" }; }), value:S.coat, onChange:function(v){ S.coat = v; api.save(); paint(); api.update(); } });
      rgB = radios($(".cr-tb", inp), { label:"Block", cls:"chips", aria:"Block metal and its cost", options:T.blockOpts.map(function(x){ return { id:x.id, t:x.t + " (" + x.cost + ")" }; }), value:S.blk, onChange:function(v){ S.blk = v; api.save(); paint(); api.update(); } });
      void rgC; void rgB;
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){
      var good = { Mg:1, Al:1, Zn:1 }, bad = { Sn:1, Cu:1 }, tot = cost(MV.C.task.coatings, d.coat) + cost(MV.C.task.blockOpts, d.blk);
      return [d.coat === "zinc" || !!good[d.blk], !bad[d.blk], d.coat !== "none", tot <= 3];
    },
    key:function(d){ return d.coat + "|" + d.blk; },
    label:function(k){ var p = k.split("|"), cn = { none:"no coating", paint:"paint", zinc:"zinc coating", tin:"tin coating" }[p[0]]; return cn + (p[1] === "none" ? " alone" : " + " + p[1] + " block"); },
    text:function(k){ return MV.plain(this.label(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ pairs:pairsAct, reason:reasonAct },
  task:task
});
})();
