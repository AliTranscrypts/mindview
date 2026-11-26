// SCH4U 41 Hydrolysis of Salts: hero (indicator beakers, then ethanoate taking H⁺ from water), Salt sorter (Explore: Sort /
// Zoom to the particles / Calculate with the C7 ICE workbench), Salts at work (Part 3 stations + model-data sort and rank),
// "Calculate the pH" number entry (mantissa × 10^exponent boxes for constants), "Exactly pH 9" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, F = MV.chem.f, D = MV.chem.data, KW = D["const"].Kw, fx = MV.chem.fx, MN = "−";
function esc(s){ return MV.esc(s); }
function r1(v){ return Math.round(v * 10) / 10; }
function kaOf(fm){ var r = D.Ka.filter(function(x){ return x[1] === fm; })[0]; return r ? r[2] : null; }
function kbOf(fm){ var r = D.Kb.filter(function(x){ return x[1] === fm; })[0]; return r ? r[2] : null; }
var KA = "<i>K</i><sub>a</sub>", KB = "<i>K</i><sub>b</sub>", KWH = "<i>K</i><sub>w</sub>", XI = "<i>x</i>", CI = "<i>c</i>";

// scientific notation, 2 significant figures (5.6 × 10⁻¹⁰)
function sci(v){
  if (!v) return "0";
  var e = Math.floor(Math.log10(Math.abs(v)) + 1e-9), m = Math.round(v / Math.pow(10, e) * 10) / 10;
  if (m >= 10) { m = m / 10; e++; }
  return fx(m, 1) + " × 10<sup>" + (e < 0 ? MN + (-e) : e) + "</sup>";
}
function pct(p){ var d = Math.min(8, Math.max(0, 1 - Math.floor(Math.log10(p) + 1e-9))); return fx(p, d) + "%"; }
function cTxt(c){ return c < 0.001 ? sci(c) : fx(c, 3).replace(/0+$/, "").replace(/\.$/, ""); }
function ph2(v){ return fx(Math.round(v * 100) / 100, 2); }

// ---------- ions and salts (all K from MV.chem.data, converted with Kw) ----------
// role "acid": a cation from a weak base (K = Ka = Kw ÷ Kb(parent)); role "base": an anion from a weak acid (K = Kb = Kw ÷ Ka(parent)).
var ION = {
  "Na+":{ f:"Na+", nm:"sodium ion", parent:"NaOH", pk:"strong base" },
  "K+":{ f:"K+", nm:"potassium ion", parent:"KOH", pk:"strong base" },
  "Cl-":{ f:"Cl-", nm:"chloride ion", parent:"HCl", pk:"strong acid" },
  "NO3-":{ f:"NO3-", nm:"nitrate ion", parent:"HNO3", pk:"strong acid" },
  "NH4+":{ f:"NH4+", nm:"ammonium ion", sh:"Ammonium", parent:"NH3", pk:"weak base", role:"acid", conj:"NH3", pK:kbOf("NH3") },
  "CH3NH3+":{ f:"CH3NH3+", nm:"methylammonium ion", sh:"Methylammonium", parent:"CH3NH2", pk:"weak base", role:"acid", conj:"CH3NH2", pK:kbOf("CH3NH2") },
  "CH3COO-":{ f:"CH3COO-", nm:"ethanoate ion", sh:"Ethanoate", parent:"CH3COOH", pk:"weak acid", role:"base", conj:"CH3COOH", pK:kaOf("CH3COOH") },
  "HCOO-":{ f:"HCOO-", nm:"methanoate ion", sh:"Methanoate", parent:"HCOOH", pk:"weak acid", role:"base", conj:"HCOOH", pK:kaOf("HCOOH") },
  "C6H5COO-":{ f:"C6H5COO-", nm:"benzoate ion", sh:"Benzoate", parent:"C6H5COOH", pk:"weak acid", role:"base", conj:"C6H5COOH", pK:kaOf("C6H5COOH") },
  "F-":{ f:"F-", nm:"fluoride ion", sh:"Fluoride", parent:"HF", pk:"weak acid", role:"base", conj:"HF", pK:kaOf("HF") },
  "OCl-":{ f:"OCl-", nm:"hypochlorite ion", sh:"Hypochlorite", parent:"HOCl", pk:"weak acid", role:"base", conj:"HOCl", pK:kaOf("HOCl") }
};
Object.keys(ION).forEach(function(k){ var o = ION[k]; if (o.role) o.K = KW / o.pK; });
var SALTS = [
  ["NaCl", "NaCl", "sodium chloride", "Na+", "Cl-"], ["KNO3", "KNO3", "potassium nitrate", "K+", "NO3-"],
  ["NH4Cl", "NH4Cl", "ammonium chloride", "NH4+", "Cl-"], ["CH3NH3Cl", "CH3NH3Cl", "methylammonium chloride", "CH3NH3+", "Cl-"],
  ["CH3COONa", "CH3COONa", "sodium ethanoate", "Na+", "CH3COO-"], ["HCOONa", "HCOONa", "sodium methanoate", "Na+", "HCOO-"],
  ["C6H5COONa", "C6H5COONa", "sodium benzoate", "Na+", "C6H5COO-"], ["NaF", "NaF", "sodium fluoride", "Na+", "F-"],
  ["NaOCl", "NaOCl", "sodium hypochlorite", "Na+", "OCl-"], ["NH4CH3COO", "NH4CH3COO", "ammonium ethanoate", "NH4+", "CH3COO-"],
  ["NH4F", "NH4F", "ammonium fluoride", "NH4+", "F-"]
].map(function(r){ return { id:r[0], f:r[1], nm:r[2], cat:r[3], an:r[4] }; });
var SAL = {}; SALTS.forEach(function(s){ SAL[s.id] = s; });
var CONCS = ["0.018", "0.030", "0.044", "0.063", "0.066", "0.18", "0.30", "0.63", "0.72"];
var TYPE = { a:"Acidic", b:"Basic", n:"Neutral" };

// The model (plan §4 "Model rules"): one reacting ion → x = √(K × c); both ions react → pH = 7.00 − ½ log(Ka ÷ Kb) (shown only
// behind "Show the model"). Below K × c = 1 × 10⁻¹³ (only the task's 3.0 × 10⁻⁴ mol/L chip reaches it) water's own ions are added,
// x = √(K × c + Kw), so a very dilute weak salt can't land on the wrong side of 7.
function model(id, c){
  var s = SAL[id], ca = ION[s.cat], an = ION[s.an], ac = ca.role ? ca : null, bs = an.role ? an : null;
  if (ac && bs) { var p = 7 - 0.5 * Math.log10(ac.K / bs.K); return { both:true, s:s, ca:ca, an:an, c:c, ph:p, type:p < 6.995 ? "a" : p > 7.005 ? "b" : "n" }; }
  if (!ac && !bs) return { none:true, s:s, ca:ca, an:an, c:c, ph:7, x:1e-7, type:"n" };
  var io = ac || bs, kc = io.K * c, water = kc < 1e-13, x = Math.sqrt(water ? kc + KW : kc), lg = -Math.log10(x);
  return { s:s, ca:ca, an:an, c:c, ion:io, spec:ac ? an : ca, K:io.K, kc:kc, x:x, water:water, pct:x / c * 100, acid:!!ac,
    pOH:ac ? 14 - lg : lg, ph:ac ? lg : 14 - lg, type:ac ? "a" : "b" };
}
function eqOf(io){ return io.role === "base" ? io.f + " + H2O <=> " + io.conj + " + OH-" : io.f + " + H2O <=> " + io.conj + " + H3O+"; }
function convHTML(io){
  return io.role === "base" ? KB + " = " + KWH + " ÷ " + KA + "(" + F(io.parent) + ") = 1.0 × 10<sup>" + MN + "14</sup> ÷ " + sci(io.pK) + " = " + sci(io.K)
    : KA + " = " + KWH + " ÷ " + KB + "(" + F(io.parent) + ") = 1.0 × 10<sup>" + MN + "14</sup> ÷ " + sci(io.pK) + " = " + sci(io.K);
}
function reason(r){
  if (r.none) return "Both parents are strong (" + F(r.ca.parent) + " and " + F(r.an.parent) + "), so neither ion reacts with water.";
  if (r.both) return "Both ions react: " + KA + "(" + F(r.ca.f) + ") = " + sci(r.ca.K) + " vs " + KB + "(" + F(r.an.f) + ") = " + sci(r.an.K) + ". " +
    (r.type === "n" ? "They pull equally." : r.type === "a" ? "The cation’s constant is larger, so H₃O⁺ wins." : "The anion’s constant is larger, so OH⁻ wins.");
  return F(r.ion.f) + " (from " + F(r.ion.parent) + ", a " + r.ion.pk + ") " + (r.acid ? "gives H⁺ to water, making H₃O⁺" : "takes H⁺ from water and leaves OH⁻") + "; " + F(r.spec.f) + " is a spectator.";
}

// universal indicator colour (true colours as tokens in app.css), always named in words
var UI = [[3.5, "red"], [5.5, "orange"], [6.5, "yellow"], [7.5, "green"], [8.45, "blue-green"], [9.8, "blue"], [11, "indigo"], [99, "violet"]];
function uiOf(ph){ for (var i = 0; i < UI.length; i++) if (ph < UI[i][0]) return { v:"--hs-ui-" + UI[i][1].replace("-", ""), n:UI[i][1] }; return { v:"--hs-ui-violet", n:"violet" }; }

// ---------- @component radioGroup (from MHF4U 25, via SCH4U 01–17) — segmented control or chip row as a real radio group
// (arrow keys, roving tabindex, lock). radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange(id), disabled})
// -> {set(id), get(), lock(bool), paint()}
function radios(host, o){
  var val = String(o.value), locked = false;
  function off(id){ return o.disabled ? o.disabled(id) : ""; }
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, d = locked || !!off(x.id); return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && !i) ? 0 : -1) + '" data-rg="' + x.id + '"' + (d ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked || off(id)) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(val);
    for (var s = 0; s < ids.length; s++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); return; } }
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, paint:paint };
}

// @component phMeter (from SCH4U 06; 2 decimals) — display-only pH gauge (0–14), acidic / basic bands in the H₃O⁺ and OH⁻ role colours, needle.
function meterSVG(v){
  var x0 = 18, x1 = 402, X = function(p){ return x0 + (x1 - x0) * p / 14; }, s = "";
  s += '<rect x="' + x0 + '" y="30" width="' + r1(X(6.5) - x0) + '" height="18" fill="var(--ab-h3o)" fill-opacity=".22"/><rect x="' + r1(X(7.5)) + '" y="30" width="' + r1(x1 - X(7.5)) + '" height="18" fill="var(--ab-oh)" fill-opacity=".22"/>';
  s += '<rect x="' + x0 + '" y="30" width="' + (x1 - x0) + '" height="18" rx="3" fill="none" stroke="var(--ink-2)" stroke-width="1.5"/>';
  for (var p = 0; p <= 14; p++) s += '<line x1="' + r1(X(p)) + '" y1="48" x2="' + r1(X(p)) + '" y2="' + (p % 7 ? 53 : 57) + '" stroke="var(--ink-2)" stroke-width="1.2"/>' + (p % 7 ? "" : '<text x="' + r1(X(p)) + '" y="69" text-anchor="middle" font-size="12" fill="var(--ink-2)">' + p + "</text>");
  s += '<text x="' + r1(X(3.2)) + '" y="69" text-anchor="middle" font-size="12" fill="var(--ink)">acidic</text><text x="' + r1(X(10.8)) + '" y="69" text-anchor="middle" font-size="12" fill="var(--ink)">basic</text>';
  var nx = r1(X(Math.max(0, Math.min(14, v))));
  s += '<path d="M' + nx + " 52 L" + r1(nx - 7) + " 22 L" + r1(nx + 7) + ' 22Z" fill="var(--ink)"/><text x="' + nx + '" y="14" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">pH ' + ph2(v) + "</text>";
  return '<svg class="hs-msvg" viewBox="0 0 420 74" role="img" aria-label="pH meter reading ' + ph2(v) + '">' + s + "</svg>";
}

// ---------- @component ionView — particle pictures in SVG: ions as labelled capsules (metal ions cerulean, dashed; anions in their
// atom colours; element letters coloured), H₃O⁺ solid magenta, OH⁻ solid cerulean, violet electron-pair arrows (curved, with heads).
var SUBD = "₀₁₂₃₄₅₆₇₈₉", SUPD = "⁰¹²³⁴⁵⁶⁷⁸⁹";
function uni(fm){
  var ch = "", m = /\^(\d*)([+-])$/.exec(fm);
  if (m) { ch = m[1].split("").map(function(d){ return SUPD[+d]; }).join("") + (m[2] === "+" ? "⁺" : "⁻"); fm = fm.slice(0, m.index); }
  else if (/[+-]$/.test(fm)) { ch = fm.slice(-1) === "+" ? "⁺" : "⁻"; fm = fm.slice(0, -1); }
  return fm.replace(/\d/g, function(d){ return SUBD[+d]; }) + ch;
}
var ELC = { C:"var(--at-c)", O:"var(--at-o)", N:"var(--at-n)", F:"var(--at-x)", Cl:"var(--at-x)", Br:"var(--at-x)", Na:"var(--at-m)", K:"var(--at-m)", H:"var(--ink)" };
function tspans(u){
  var out = "", re = /([A-Z][a-z]?)([^A-Z]*)/g, m;
  while ((m = re.exec(u)) && m[0]) out += '<tspan fill="' + (ELC[m[1]] || "var(--ink)") + '">' + m[1] + "</tspan>" + (m[2] ? '<tspan fill="var(--ink)">' + esc(m[2]) + "</tspan>" : "");
  return out;
}
function kindOf(fm){ if (/^(Na|K)\+$/.test(fm)) return "m"; if (fm === "H3O+") return "h3o"; if (fm === "OH-") return "oh"; if (fm === "H2O") return "w"; if (/N/.test(fm)) return "n"; if (/O/.test(fm)) return "o"; return "x"; }
var KSTROKE = { m:"var(--at-m)", n:"var(--at-n)", o:"var(--at-o)", x:"var(--at-x)", w:"var(--at-o)", h3o:"var(--ab-h3o)", oh:"var(--ab-oh)" };
function ball(x, y, fm, o){
  o = o || {};
  var u = uni(fm), k = kindOf(fm), solid = k === "h3o" || k === "oh", w = Math.max(54, u.length * 12 + 24), h = 42, st = KSTROKE[k];
  return '<g' + (o.op ? ' opacity="' + o.op + '"' : "") + '><rect x="' + r1(x - w / 2) + '" y="' + (y - h / 2) + '" width="' + w + '" height="' + h + '" rx="21" fill="' + (solid ? st : "var(--sheet)") + '" stroke="' + st + '" stroke-width="' + (o.hi ? 3.6 : 2.2) + '"' + (k === "m" ? ' stroke-dasharray="6 4"' : "") + "/>" +
    '<text x="' + x + '" y="' + (y + 1) + '" text-anchor="middle" dominant-baseline="central" font-size="19" font-weight="700"' + (solid ? ' fill="var(--sheet)">' + esc(u) : ">" + tspans(u)) + "</text></g>";
}
function arrow(x1, y1, x2, y2, bend){
  var mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, cx = mx - dy / L * bend, cy = my + dx / L * bend;
  var tx = x2 - cx, ty = y2 - cy, tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
  var hx = x2 - tx * 12, hy = y2 - ty * 12, px = -ty * 6.5, py = tx * 6.5;
  return '<path class="hs-arr" d="M' + x1 + " " + y1 + " Q" + r1(cx) + " " + r1(cy) + " " + r1(hx) + " " + r1(hy) + '" fill="none" stroke="var(--e-pair)" stroke-width="2.8"/>' +
    '<path class="hs-arr" d="M' + x2 + " " + y2 + " L" + r1(hx + px) + " " + r1(hy + py) + " L" + r1(hx - px) + " " + r1(hy - py) + 'Z" fill="var(--e-pair)"/>';
}
function txt(x, y, s, o){ o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || "middle") + '" font-size="' + (o.fs || 15) + '"' + (o.b ? ' font-weight="700"' : "") + ' fill="' + (o.c || "var(--ink-2)") + '">' + s + "</text>"; }

// zoom frames: 0 dissolved ions; 1 cation meets water; 2 anion meets water; 3 result
var ZL = ["Step 1 of 4: the salt dissolves", "Step 2 of 4: the cation meets water", "Step 3 of 4: the anion meets water", "Step 4 of 4: the result"];
function zoomSVG(sid, fr){
  var s = SAL[sid], ca = ION[s.cat], an = ION[s.an], h = "", cx = 130, ax = 390, iy = 74, wy = 206;
  var caDone = ca.role && fr >= 2, anDone = an.role && fr >= 3;
  h += txt(cx, 22, "cation", { fs:14 }) + txt(ax, 22, "anion", { fs:14 });
  h += ball(cx, iy, caDone ? ca.conj : ca.f, { hi:fr === 1 }) + ball(cx, wy, caDone ? "H3O+" : "H2O", { op:fr === 0 ? 0.55 : null });
  h += ball(ax, iy, anDone ? an.conj : an.f, { hi:fr === 2 }) + ball(ax, wy, anDone ? "OH-" : "H2O", { op:fr === 0 ? 0.55 : null });
  if (fr === 1 && ca.role) h += arrow(cx - 34, wy - 22, cx - 34, iy + 22, -34) + txt(cx + 40, 146, "H⁺ moves", { a:"start", c:"var(--e-pair)", b:true }) + txt(cx + 40, 164, "to water", { a:"start", c:"var(--e-pair)", b:true });
  if (fr === 2 && an.role) h += arrow(ax + 34, iy + 22, ax + 34, wy - 22, -34) + txt(ax - 40, 146, "takes H⁺", { a:"end", c:"var(--e-pair)", b:true }) + txt(ax - 40, 164, "from water", { a:"end", c:"var(--e-pair)", b:true });
  if (fr >= 1 && !ca.role) h += txt(cx, 132, "spectator: parent is", { fs:14 }) + txt(cx, 150, "a strong acid or base", { fs:14 });
  if (fr >= 2 && !an.role) h += txt(ax, 132, "spectator: parent is", { fs:14 }) + txt(ax, 150, "a strong acid or base", { fs:14 });
  var aria = "Particle view of " + s.nm + ". " + MV.plain(zoomText(sid, fr).join(" "));
  return '<svg class="hs-zsvg" viewBox="0 0 520 240" role="img" aria-label="' + esc(aria) + '">' + h + "</svg>";
}
function zoomText(sid, fr){
  var s = SAL[sid], ca = ION[s.cat], an = ION[s.an], L = [F(s.f + " -> " + s.cat + " + " + s.an) + ": the ions spread through the water."];
  function line(io){ return io.role ? F(io.f) + (io.role === "acid" ? " gives H⁺ to water: " : " takes H⁺ from water: ") + F(eqOf(io)) : F(io.f) + ": spectator (its parent, " + F(io.parent) + ", is a " + io.pk + ")."; }
  if (fr >= 1) L.push(line(ca));
  if (fr >= 2) L.push(line(an));
  if (fr >= 3) { var r = model(sid, 0.1); L.push("<strong>Result: " + TYPE[r.type].toLowerCase() + ".</strong> " + (r.none ? "Neither ion reacts." : r.both ? reason(r) : (r.acid ? "H₃O⁺ is left in the solution." : "OH⁻ is left in the solution."))); }
  return L;
}

// ---------- beakers ----------
function beakerFig(label, col, sub, list, drop){
  var liq = col ? "var(" + col + ")" : "var(--hs-water)";
  var svg = '<svg viewBox="0 0 120 128" aria-hidden="true"><path d="M26 54 L26 110 Q26 118 34 118 L86 118 Q94 118 94 110 L94 54Z" fill="' + liq + '"' + (col ? "" : ' fill-opacity=".5"') + "/>" +
    '<path d="M18 12 L24 12 L24 110 Q24 120 34 120 L86 120 Q96 120 96 110 L96 12 L102 12" fill="none" stroke="var(--ink-2)" stroke-width="2.6" stroke-linejoin="round"/>' +
    (drop ? '<circle class="hs-grain" cx="60" cy="6" r="7" fill="var(--ink-2)"/>' : "") + "</svg>";
  return '<figure class="hs-bk">' + svg + "<figcaption><strong>" + label + "</strong>" + (sub ? '<span class="hs-bk-sub">' + sub + "</span>" : "") + (list ? '<span class="hs-bk-list">' + list + "</span>" : "") + "</figcaption></figure>";
}

// ---------- C7 ICE workbench (Calculate mode, task preview) ----------
function iceTable(r){
  var io = r.ion, prod = r.acid ? "H3O+" : "OH-", cc = cTxt(r.c);
  return MV.tableHTML({ head:["", F(io.f), F("H2O"), F(io.conj), F(prod)], caption:"ICE table for " + MV.plain(F(eqOf(io))),
    rows:[["I", cc, "—", "0", "0"], ["C", MN + XI, "—", "+" + XI, "+" + XI], ["E", cc + " " + MN + " " + XI, "—", XI, XI]] });
}
function workLines(r, shown){
  var io = r.ion, xl = r.acid ? "[H₃O⁺]" : "[OH⁻]", L = [];
  L.push(XI + "² = " + (r.acid ? KA : KB) + " × " + CI + " = " + sci(r.K) + " × " + cTxt(r.c) + " = " + sci(r.kc));
  if (!shown) { L.push('<span class="muted">' + XI + ", the 5% check and the pH are hidden: work them out yourself.</span>"); return L; }
  if (r.water) L.push('<span class="muted">This solution is so dilute that water’s own ions matter: ' + XI + " = √(" + (r.acid ? KA : KB) + " × " + CI + " + " + KWH + ").</span>");
  L.push(XI + " = " + xl + " = " + sci(r.x) + " mol/L");
  L.push("5% check: " + XI + " ÷ " + CI + " = " + pct(r.pct) + (r.pct < 5 ? " ✓ passes" : " ✗ fails (the shortcut isn’t valid)"));
  L.push(r.acid ? "pH = " + MN + "log " + XI + " = " + ph2(r.ph) : "pOH = " + MN + "log " + XI + " = " + ph2(r.pOH) + "; pH = 14.00 " + MN + " " + ph2(r.pOH) + " = " + ph2(r.ph));
  return L;
}

// ---------- hero: indicator beakers, then the zoom into sodium ethanoate ----------
function heroSVG(st){
  var h = "";
  if (st <= 1) {
    var B = [["NaCl", "green", "pH 7"], ["NH4Cl", "orange", "pH 5"], ["CH3COONa", "blue", "pH 9"]];
    B.forEach(function(b, i){
      var x = 60 + i * 180, liq = st ? "var(--hs-ui-" + b[1] + ")" : "var(--hs-water)";
      h += '<path d="M' + (x + 8) + " 112 L" + (x + 8) + " 206 Q" + (x + 8) + " 216 " + (x + 18) + " 216 L" + (x + 102) + " 216 Q" + (x + 112) + " 216 " + (x + 112) + " 206 L" + (x + 112) + ' 112Z" fill="' + liq + '"' + (st ? "" : ' fill-opacity=".5"') + "/>";
      h += '<path d="M' + x + " 50 L" + (x + 6) + " 50 L" + (x + 6) + " 206 Q" + (x + 6) + " 218 " + (x + 18) + " 218 L" + (x + 102) + " 218 Q" + (x + 114) + " 218 " + (x + 114) + " 206 L" + (x + 114) + " 50 L" + (x + 120) + ' 50" fill="none" stroke="var(--ink-2)" stroke-width="3" stroke-linejoin="round"/>';
      h += '<text x="' + (x + 60) + '" y="36" text-anchor="middle" font-size="20" font-weight="700">' + tspans(uni(b[0])) + "</text>";
      if (st) h += txt(x + 60, 248, b[1] + " (" + b[2] + ")", { fs:17, c:"var(--ink)", b:true });
    });
    return h;
  }
  // zoom into the third beaker
  h += '<circle cx="300" cy="140" r="132" fill="none" stroke="var(--rule)" stroke-width="2"/>';
  if (st === 2) {
    h += ball(230, 110, "CH3COO-", { hi:true }) + ball(390, 170, "H2O") + arrow(262, 132, 372, 150, -26) + ball(140, 220, "Na+");
    h += txt(300, 268, "ethanoate takes H⁺ from water", { c:"var(--e-pair)", b:true, fs:16 });
  } else {
    h += ball(230, 110, "CH3COOH") + ball(390, 170, "OH-") + ball(470, 230, "Na+");
    h += txt(470, 268, "untouched", { fs:15 });
  }
  return h;
}
var HCAP = ["Three salt solutions: NaCl, NH₄Cl and CH₃COONa. Add a few drops of universal indicator…",
  "They turn green (pH 7), orange (pH 5) and blue (pH 9). Same kind of substance, three different pH values.",
  "Zoom into the blue beaker: an ethanoate ion meets a water molecule. The violet electron-pair arrow shows ethanoate taking H⁺.",
  "An OH⁻ ion is left behind, and Na⁺ drifts past untouched. <strong>Na⁺ is a spectator. Ethanoate is a base.</strong>"];
var HARIA = ["Three beakers of colourless salt solutions labelled NaCl, NH4Cl and CH3COONa.",
  "The beakers are green (pH 7), orange (pH 5) and blue (pH 9) with universal indicator.",
  "Particle view: an ethanoate ion and a water molecule; a violet arrow shows ethanoate taking H plus from water; a sodium ion nearby.",
  "Particle view: ethanoic acid and a hydroxide ion have formed; the sodium ion has drifted past untouched. Na plus is a spectator. Ethanoate is a base."];
function hero(){
  var host = $("#hs-hx-svg"), cap = $("#hs-hx-cap"), rep = $("#hs-hx-replay");
  if (!host) return;
  function show(i){ host.innerHTML = '<svg class="hs-hsvg' + (MV.reduceMotion ? "" : " hs-fade") + '" viewBox="0 0 600 280" role="img" aria-label="' + esc(HARIA[i]) + '">' + heroSVG(i) + "</svg>"; cap.innerHTML = HCAP[i]; }
  if (MV.reduceMotion) { show(3); return; }
  var run = 0;
  function step(i, id){
    if (id !== run) return;
    show(i);
    if (i === 3) { MV.wait(300, function(){ if (id === run) rep.hidden = false; }); return; }
    MV.wait(i === 0 ? 2200 : 2600, function(){ step(i + 1, id); });
  }
  rep.addEventListener("click", function(){ rep.hidden = true; step(0, ++run); });
  step(0, ++run);
}

// ---------- Explore: Salt sorter ----------
function explore(host, api){
  var S = api.S, C = api.content;
  if (!SAL[S.salt]) S.salt = "CH3COONa";
  if (CONCS.indexOf(S.c) < 0) S.c = "0.18";
  if (["sort", "zoom", "calc"].indexOf(S.mode) < 0) S.mode = "sort";
  S.show = S.show === "hide" ? "hide" : "show"; S.tc3 = !!S.tc3;
  ["done", "log", "last", "kp"].forEach(function(k){ if (!S[k] || typeof S[k] !== "object") S[k] = {}; });
  if (TYPE[S.pred] == null) S.pred = "";
  var busy = false, veil = false, demo = null, dropping = null, fb = null, reveal = null, phOverride = null, zf = 0, pl = null, plSalt = null, forceZoom = false;
  host.innerHTML = '<p class="how">' + C.how + '</p><div class="hs-grid"><div class="hs-left" data-mv="graph"><p class="eq-cap hs-cap" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="hs-stage"></div><div class="hs-pl"></div><div class="hs-eqs" aria-live="polite"></div><div class="hs-meter" aria-live="polite"></div></div>' +
    '<div class="hs-ctrl"><div class="hs-modes"></div><div class="hs-shelf"></div><div class="hs-conc"></div>' +
    '<div class="hs-predbox"><div class="hs-pred"></div><div class="q-actions"><button type="button" class="btn primary" data-hs="test" data-k="hstest">Test</button></div><div class="hs-fb"></div></div>' +
    '<div class="hs-show"></div><div class="q-actions"><button type="button" class="btn ghost sm" data-hs="tc3" data-k="hstc3"></button></div>' +
    '<dl class="read hs-read" aria-live="polite"></dl><div class="hs-tab"></div></div></div>';
  MV.chem.tablePanel($(".hs-tab", host), "acid");
  var modeRG = radios($(".hs-modes", host), { label:"View", aria:"Sorter view", options:C.modes, value:S.mode, onChange:function(v){ S.mode = v; api.save(); paint(); } });
  var shelfRG = radios($(".hs-shelf", host), { label:"Salt shelf", cls:"chips hs-shelfrow", options:SALTS.map(function(s){ return { id:s.id, t:F(s.f) }; }), value:S.salt,
    onChange:function(v){ S.salt = v; S.pred = ""; fb = null; api.save(); paint(); } });
  var concRG = radios($(".hs-conc", host), { label:"Concentration (mol/L)", aria:"Concentration in mol per litre", cls:"chips", options:CONCS.map(function(c){ return { id:c, t:c }; }), value:S.c,
    onChange:function(v){ S.c = v; api.save(); paint(); } });
  var predRG = radios($(".hs-pred", host), { label:"Your prediction", cls:"seg", options:[{ id:"a", t:"Acidic" }, { id:"b", t:"Basic" }, { id:"n", t:"Neutral" }], value:S.pred,
    onChange:function(v){ S.pred = v; fb = null; api.save(); paintCtrl(); paintFb(); } });
  var showRG = radios($(".hs-show", host), { label:"pH readout", cls:"seg", options:[{ id:"show", t:"Show" }, { id:"hide", t:"Hide" }], value:S.tc3 ? "hide" : S.show,
    onChange:function(v){ S.show = v; api.save(); paint(); } });

  function key(){ return S.salt + "@" + S.c; }
  function cur(){ return model(S.salt, +S.c); }
  function tested(){ return !!S.done[S.salt] || forceZoom; }
  function shown(){ return (!veil && tested() && S.show === "show" && !S.tc3) || (reveal === key() && !veil); }
  function log(){ return demo || S.log; }

  // ---------- painting ----------
  function paintSort(){
    var L = log(), last = demo ? demo._last || {} : S.last;
    return '<div class="hs-beakers">' + ["a", "b", "n"].map(function(t){
      var names = SALTS.filter(function(s){ return L[s.id] === t; }), ls = last[t] && L[last[t]] === t ? last[t] : null, col = null, sub = "";
      if (ls) { var r = model(ls, +S.c), u = uiOf(r.ph); col = u.v; sub = "Latest: " + F(SAL[ls].f) + ", " + u.n + (demo == null && !veil && S.show === "show" && !S.tc3 ? " (pH " + ph2(r.ph) + ")" : ""); }
      return beakerFig(TYPE[t], col, sub, names.map(function(s){ return F(s.f); }).join(" · "), dropping === t);
    }).join("") + '</div><p class="tiny muted">Universal indicator: red (strongly acidic), orange, yellow, green (neutral), blue-green, blue, indigo, violet (strongly basic). The colour shows the latest salt at the current concentration.</p>';
  }
  function paintCalc(){
    if (!tested()) return '<p class="hs-wait">Predict and <strong>Test</strong> this salt first; then work out its pH here.</p>';
    var r = cur(), h = '<div class="hs-calc">';
    if (r.none) return h + "<p>" + reason(r) + " There’s nothing to calculate: [H₃O⁺] = [OH⁻] = 1.0 × 10<sup>" + MN + "7</sup> mol/L" + (shown() ? " and pH = 7.00." : ".") + "</p></div>";
    if (r.both) {
      return h + "<p><strong>Both ions react.</strong> Compare their constants:</p><p>" + KA + "(" + F(r.ca.f) + ") = " + sci(r.ca.K) + " &nbsp;vs&nbsp; " + KB + "(" + F(r.an.f) + ") = " + sci(r.an.K) + "</p><p>" +
        (r.type === "n" ? "They’re equal, so the solution is neutral." : (r.type === "a" ? KA + "(cation) is larger, so the solution is acidic." : KB + "(anion) is larger, so the solution is basic.")) + "</p>" +
        '<details class="alg"><summary>Show the model</summary><p>' + C.modelNote + "</p>" + (shown() ? "<p>Model pH = 7.00 " + MN + " ½ log(" + sci(r.ca.K) + " ÷ " + sci(r.an.K) + ") = " + ph2(r.ph) + "</p>" : "") + "</details></div>";
    }
    var io = r.ion, kp = S.kp[S.salt];
    h += "<p><strong>1. Which ion reacts?</strong> " + F(io.f) + ", " + (io.role === "base" ? "a base (its parent, " + F(io.parent) + ", is a weak acid)." : "an acid (its parent, " + F(io.parent) + ", is a weak base).") + " " + F(r.spec.f) + " is a spectator.</p>";
    h += '<p><strong>2. Which constant do you need?</strong></p><div class="chips hs-kp" role="group" aria-label="Constant">' +
      [["a", KA], ["b", KB]].map(function(o){ var on = kp === o[0]; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-kp="' + o[0] + '" data-k="kp' + o[0] + '"' + (busy ? " disabled" : "") + ">" + o[1] + " of " + F(io.f) + "</button>"; }).join("") + "</div>";
    var need = io.role === "base" ? "b" : "a";
    if (!kp) return h + "</div>";
    if (kp !== need) return h + MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + (io.role === "base" ? io.sh + " is a base. Its constant is " + KB + " = " + KWH + " ÷ " + KA + " = " + sci(io.K) + ", not " + sci(io.pK) + "." : io.sh + " is an acid. Its constant is " + KA + " = " + KWH + " ÷ " + KB + " = " + sci(io.K) + ", not " + sci(io.pK) + ".")) + "</div>";
    h += "<p><strong>3. Convert:</strong> " + convHTML(io) + "</p><p><strong>4. ICE table</strong> for " + F(eqOf(io)) + "</p>" + iceTable(r);
    h += "<p><strong>5. Solve</strong> (assume " + XI + " is small next to " + CI + ")</p><ul class=\"hs-lines\">" + workLines(r, shown()).map(function(l){ return "<li>" + l + "</li>"; }).join("") + "</ul></div>";
    return h;
  }
  function makePlayer(){
    var ph = $(".hs-pl", host); ph.innerHTML = ""; var d = document.createElement("div"); ph.appendChild(d);
    plSalt = S.salt; zf = 0;
    pl = MV.player(d, { count:4, label:function(i){ return ZL[i]; }, render:function(i){ zf = i; paintZoom(); } });
  }
  function paintZoom(){
    var st = $(".hs-stage", host);
    st.innerHTML = '<div class="hs-zoom" tabindex="0" aria-label="Particle view. Press Space to step.">' + zoomSVG(S.salt, zf) + "</div>";
    $(".hs-eqs", host).innerHTML = '<ul class="hs-lines">' + zoomText(S.salt, zf).map(function(l){ return "<li>" + l + "</li>"; }).join("") + "</ul>";
  }
  function paintStage(){
    var md = S.mode, st = $(".hs-stage", host), plh = $(".hs-pl", host);
    if (md === "zoom" && tested()) {
      plh.hidden = false;
      if (!pl || plSalt !== S.salt || !plh.firstChild) makePlayer(); else paintZoom();
      return;
    }
    plh.hidden = true; plh.innerHTML = ""; pl = null; plSalt = null;
    $(".hs-eqs", host).innerHTML = "";
    if (md === "zoom") st.innerHTML = '<p class="hs-wait">Predict and <strong>Test</strong> this salt first; then zoom in to see which ion reacts with water.</p>';
    else if (md === "calc") st.innerHTML = paintCalc();
    else st.innerHTML = paintSort();
  }
  function paintMeter(){
    var el = $(".hs-meter", host), r = cur();
    if (phOverride != null) { el.innerHTML = '<p class="hs-sub">pH meter · <strong>pH ' + ph2(phOverride) + "</strong></p>" + meterSVG(phOverride); return; }
    if (!tested() || veil) { el.innerHTML = '<p class="hs-sub muted">pH meter: the reading appears after the test.</p>'; return; }
    if (!shown()) { el.innerHTML = '<p class="hs-sub muted">pH meter: readout hidden.</p>'; return; }
    el.innerHTML = '<p class="hs-sub">pH meter · ' + F(SAL[S.salt].f) + ", " + S.c + " mol/L · <strong>pH " + ph2(r.ph) + "</strong>" + (reveal === key() && (S.show !== "show" || S.tc3) ? " (revealed by Check)" : "") + (r.both ? " (model)" : "") + "</p>" + meterSVG(r.ph);
  }
  function paintRead(){
    var r = cur(), s = r.s, rows = [["Salt", F(s.f) + " (" + s.nm + "), " + S.c + " mol/L"], ["Ions", F(s.cat) + ", " + F(s.an)]];
    if (!tested() || veil) { rows.push(["Next", "Predict, then press <strong>Test</strong> to see how each ion behaves."]); $(".hs-read", host).innerHTML = MV.readoutHTML(rows); return; }
    function par(io){ return F(io.parent) + " (" + io.pk + "): " + (io.role ? "reacts" : "spectator"); }
    rows.push(["Cation’s parent", par(r.ca)], ["Anion’s parent", par(r.an)]);
    var eqs = [r.ca, r.an].filter(function(io){ return io.role; }).map(function(io){ return F(eqOf(io)); });
    rows.push(["Hydrolysis equation", eqs.length ? eqs.join("<br>") : "none"]);
    var sh = shown();
    if (r.none) rows.push(["<i>K</i> used", "none"], [XI, sh ? "[H₃O⁺] = [OH⁻] = 1.0 × 10<sup>" + MN + "7</sup> mol/L (from water)" : "hidden"], ["5% check", "not needed"]);
    else if (r.both) rows.push(["<i>K</i> used", KA + "(" + F(r.ca.f) + ") " + sci(r.ca.K) + " vs " + KB + "(" + F(r.an.f) + ") " + sci(r.an.K)], [XI, "not used: compare the constants"], ["5% check", "not used"]);
    else rows.push(["<i>K</i> used", (r.acid ? KA + " = " + KWH + " ÷ " + KB : KB + " = " + KWH + " ÷ " + KA) + " = " + sci(r.K)], [XI, sh ? (r.acid ? "[H₃O⁺]" : "[OH⁻]") + " = " + sci(r.x) + " mol/L" : "hidden"],
      ["5% check", sh ? pct(r.pct) + (r.pct < 5 ? " ✓ passes" : " ✗ fails") : "hidden"]);
    rows.push(["pOH / pH", sh ? ph2(14 - r.ph) + " / " + ph2(r.ph) + (r.both ? " (model)" : "") : "hidden"]);
    rows.push(["Result", "<strong>" + TYPE[r.type] + "</strong>"]);
    $(".hs-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintFb(){ $(".hs-fb", host).innerHTML = fb ? MV.fbHTML(fb.ok ? "good" : "bad", fb.html) : ""; }
  function paintCtrl(){
    modeRG.lock(busy); shelfRG.lock(busy); concRG.lock(busy); predRG.lock(busy);
    showRG.set(S.tc3 ? "hide" : S.show); showRG.lock(busy || S.tc3);
    $('[data-hs="test"]', host).disabled = busy || !S.pred;
    var tb = $('[data-hs="tc3"]', host); tb.disabled = busy; tb.textContent = S.tc3 ? "Leave stretch mode" : "Stretch mode (challenge 3): hide the pH";
  }
  function paint(){
    modeRG.set(S.mode); shelfRG.set(S.salt); concRG.set(S.c); predRG.set(S.pred);
    var s = SAL[S.salt];
    $(".hs-cap", host).innerHTML = F(s.f) + ' <span class="hs-capn">' + s.nm + ", " + S.c + " mol/L</span>";
    paintStage(); paintMeter(); paintRead(); paintFb(); paintCtrl();
    MV.changed();
  }

  // ---------- events ----------
  function feedback(r, pr){
    var t = r.type, ok = pr === t, w = "";
    if (ok) return { ok:true, html:"<strong>✓ Correct: " + TYPE[t].toLowerCase() + ".</strong> " + reason(r) };
    if (r.both && pr === "n") w = "Both ions react; compare their constants. " + reason(r);
    else if (r.both) w = reason(r);
    else if (r.none) w = "Ions from strong acids and strong bases don’t react with water. Their parents ionize completely, so they have no pull on H⁺.";
    else if (pr === "n") w = "Neutralization makes a salt, but the salt’s ions may still react with water. Check each ion’s parent. " + reason(r);
    else w = "Check which ion has a weak parent. " + reason(r);
    return { ok:false, html:"<strong>✗ Not quite: the solution is " + TYPE[t].toLowerCase() + ".</strong> " + w };
  }
  function test(){
    if (busy || !S.pred) return;
    var sid = S.salt, r = cur(), pr = S.pred;
    busy = true; dropping = S.mode === "sort" ? r.type : null; fb = null; paint();
    MV.wait(S.mode === "sort" ? 950 : 50, function(){
      busy = false; dropping = null; S.done[sid] = true; S.log[sid] = r.type; S.last[r.type] = sid; S.pred = "";
      fb = feedback(r, pr); api.save(); paint(); MV.focusFb($(".hs-predbox", host));
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.hs === "test") { test(); return; }
    if (b.dataset.hs === "tc3") { S.tc3 = !S.tc3; reveal = null; api.save(); paint(); return; }
    if (b.dataset.kp) { S.kp[S.salt] = b.dataset.kp; api.save(); MV.keepFocus($(".hs-stage", host), paintStage); return; }
  });
  host.addEventListener("keydown", function(e){
    if (e.key !== " " || !e.target.closest(".hs-zoom") || !pl || busy) return;
    e.preventDefault(); pl.go(pl.get() + 1);
  });

  // ---------- predictions ----------
  function frames(i, cb){ if (i > 3) { MV.wait(200, cb); return; } MV.wait(900, function(){ if (pl) pl.go(i); frames(i + 1, cb); }); }
  function mark(sid){ var t = model(sid, +S.c).type; S.done[sid] = true; S.log[sid] = t; S.last[t] = sid; }
  var hooks = {
    start:function(p){
      busy = true; veil = false; demo = null; dropping = null; fb = null; reveal = null; phOverride = null; forceZoom = false; S.pred = "";
      if (p.id === "p1") { S.c = "0.18"; S.mode = "sort"; S.salt = "NaCl"; demo = { _last:{} }; veil = true; }
      else if (p.id === "p2") { S.salt = "NaCl"; S.c = "0.30"; S.mode = "zoom"; veil = true; forceZoom = true; pl = null; }
      else if (p.id === "p3") { S.salt = "CH3COONa"; S.c = "0.18"; S.mode = "sort"; mark("CH3COONa"); if (S.tc3) S.tc3 = false; S.show = "show"; }
      else { S.salt = "NH4CH3COO"; S.c = "0.18"; S.mode = "zoom"; veil = true; forceZoom = true; pl = null; }
      api.save(); paint();
    },
    run:function(p, done){
      function finish(){ busy = false; veil = false; forceZoom = false; phOverride = null; api.save(); paint(); MV.wait(100, done); }
      if (p.id === "p1") {
        var seq = ["NaCl", "KNO3", "NH4Cl", "CH3COONa"];
        var next = function(k){
          if (k >= seq.length) {
            seq.forEach(mark); demo = null; veil = false; S.salt = "CH3COONa"; S.mode = "zoom"; pl = null; paint();
            frames(1, finish); return;
          }
          S.salt = seq[k]; var t = model(seq[k], 0.18).type; dropping = t; paint();
          MV.wait(800, function(){ demo[seq[k]] = t; demo._last[t] = seq[k]; dropping = null; paint(); MV.wait(250, function(){ next(k + 1); }); });
        };
        next(0); return;
      }
      if (p.id === "p2" || p.id === "p4") { frames(1, function(){ mark(S.salt); finish(); }); return; }
      // p3: the concentration chip moves to 0.018 and the meter slides from 9.00 to 8.50
      var a = model("CH3COONa", 0.18).ph, z = model("CH3COONa", 0.018).ph;
      S.c = "0.018"; paint();
      MV.tween({ dur:1400, step:function(t){ phOverride = a + (z - a) * t; paintMeter(); }, done:function(){ phOverride = null; finish(); } });
    }
  };

  // ---------- challenges ----------
  function chal(id, opt){
    var s = S.salt, cs = S.c, r = cur(), P = ph2(r.ph), basic = r.type === "b" && !r.both, acidic = r.type === "a" && !r.both;
    if (id === "tc1") {
      if (s === "NH4Cl" && cs === "0.18") return { ok:true };
      if (s === "NH4Cl" && cs === "0.018") return { ok:false, msg:"pH 5.50. Tenfold dilution raised it by 0.50; you need the more concentrated solution." };
      if (s === "NH4Cl" && cs === "0.30") return { ok:false, msg:"pH 4.89, slightly too acidic." };
      if (s === "NH4Cl") return { ok:false, msg:"pH " + P + (r.ph < 5 ? ": too acidic. Use a lower concentration." : ": not acidic enough. Use a higher concentration.") };
      if (s === "CH3NH3Cl") return { ok:false, msg:"Methylammonium is a weaker acid (" + KA + " = 2.3 × 10⁻¹¹) than ammonium; at these concentrations it can’t reach 5.00." };
      if (basic) return { ok:false, msg:"pH 5 is acidic. Which ions make H₃O⁺?" };
      if (r.both) return { ok:false, msg:"Both ions in " + F(r.s.f) + " react, so they partly cancel (pH " + P + ", model). Use a salt with one acidic ion." };
      return { ok:false, msg:"Neither ion reacts: pH 7.00. pH 5 is acidic. Which ions make H₃O⁺?" };
    }
    if (id === "tc2") {
      if (s === "NaOCl" && cs === "0.030") return { ok:true };
      if (s === "NaOCl" && cs === "0.30") return { ok:false, msg:"pH 10.50, too basic. Divide " + CI + " by 10 to lower the pH by 0.50." };
      if (s === "CH3COONa" && cs === "0.72") return { ok:false, msg:"pH 9.30. Ethanoate isn’t a strong enough base; you need the conjugate base of a much weaker acid." };
      if (s === "NaOCl") return { ok:false, msg:"pH " + P + ". You need " + KB + " × " + CI + " = 1.0 × 10⁻⁸." };
      if (basic) return { ok:false, msg:"pH " + P + ". " + F(r.ion.f) + " isn’t a strong enough base; you need the conjugate base of a much weaker acid." };
      return { ok:false, msg:"pH 10 is basic. Which ions make OH⁻?" };
    }
    if (id === "tc3") {
      if (opt && opt.live) return { ok:false };
      reveal = key(); MV.wait(0, function(){ api.save(); paint(); });
      var rv = "Revealed: pH " + P + (r.both ? " (model)" : "") + ". ";
      if (Math.abs(r.ph - 8.5) < 0.005) { S.tc3 = false; return { ok:true }; }
      if (s === "NaF" && cs === "0.63") return { ok:false, msg:rv + "So close. Fluoride’s " + KB + " (1.5 × 10⁻¹¹) needs " + CI + " = 0.66 for 8.50." };
      if (s === "NaOCl") return { ok:false, msg:rv + "Hypochlorite is too strong a base: even 0.018 gives 9.89." };
      if (acidic || r.type === "a") return { ok:false, msg:rv + "8.50 is basic." };
      if (r.type === "n") return { ok:false, msg:rv + "8.50 is basic: choose a salt whose anion takes H⁺ from water." };
      return { ok:false, msg:rv + "You need " + KB + " × " + CI + " = 1.0 × 10⁻¹¹." };
    }
    return { ok:false };
  }
  paint();
  return { predict:hooks, challenge:function(id, opt){ return chal(id, opt); } };
}

// ---------- Part 3: Salts at work ----------
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3, s4 = C.s4, DT = C.data;
  S.arr = S.arr || {}; S.ion = S.ion || {}; S.ds = S.ds || {}; S.rank = Array.isArray(S.rank) ? S.rank : [];
  var dmsg = null, rmsg = null, qmsg = null, QORD = MV.shuffle(DT.choices.map(function(_, i){ return i; }), MV.meta.id + "dq");
  var ka1 = kaOf("H2CO3"), ka2 = kaOf("HCO3-"), kbH = KW / ka1, kaBz = kaOf("C6H5COOH");
  host.innerHTML = '<div class="part"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="hs-s1"></div></div>' +
    '<div class="part"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="hs-s2"></div></div>' +
    '<div class="part"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><div class="hs-s3"></div></div>' +
    '<div class="part"><h3>' + s4.title + "</h3><p>" + s4.intro + "</p><p>" + s4.why + '</p><p class="eq-cap hs-eqc">' + s4.eq + '</p><p class="tiny muted">Qualitative only: no <i>K</i> value is used for hydrated metal ions.</p></div>' +
    '<div class="part"><h3>' + DT.title + "</h3><p>" + DT.intro + '</p><div class="hs-data"></div></div>';
  function bar(v){ var lo = -12, hi = -6, w = (Math.log10(v) - lo) / (hi - lo) * 100; return Math.max(4, Math.min(100, w)); }
  function paint1(){
    var a = S.arr.acid, b = S.arr.base, h = '<div class="chips" role="group" aria-label="Arrows to compare"><button type="button" class="chip' + (a ? " on" : "") + '" aria-pressed="' + !!a + '" data-ar="acid" data-k="aracid">HCO₃⁻ as an acid</button><button type="button" class="chip' + (b ? " on" : "") + '" aria-pressed="' + !!b + '" data-ar="base" data-k="arbase">HCO₃⁻ as a base</button></div>';
    if (a) h += '<p class="hs-arline"><span class="hs-dot hs-dot-h3o" aria-hidden="true"></span>' + s1.acid + "</p>";
    if (b) h += '<p class="hs-arline"><span class="hs-dot hs-dot-oh" aria-hidden="true"></span>' + s1.base + "</p>";
    if (a && b) {
      h += '<div class="hs-kbars" role="img" aria-label="' + esc("Log-scale bars: Ka2 " + MV.plain(sci(ka2)) + " is shorter than Kb " + MV.plain(sci(kbH)) + ".") + '">' +
        '<div class="hs-kbar"><span class="hs-kl">' + KA + '2</span><span class="hs-kt"><i class="hs-kfill hs-kf-h3o" style="width:' + r1(bar(ka2)) + '%"></i></span><span class="hs-kv">' + sci(ka2) + "</span></div>" +
        '<div class="hs-kbar"><span class="hs-kl">' + KB + '</span><span class="hs-kt"><i class="hs-kfill hs-kf-oh" style="width:' + r1(bar(kbH)) + '%"></i></span><span class="hs-kv">' + sci(kbH) + "</span></div>" +
        '<p class="tiny muted">Log scale, 10<sup>' + MN + "12</sup> to 10<sup>" + MN + "6</sup>.</p></div><p><strong>" + s1.verdict + "</strong></p>";
    } else h += '<p class="tiny muted">Tap both arrows to compare them.</p>';
    MV.keepFocus($(".hs-s1", host), function(){ $(".hs-s1", host).innerHTML = h; });
  }
  function paint2(){
    var n = S.ion.nh4, s = S.ion.so4, h = '<p class="tiny muted">Ions in ammonium sulfate: tap each one.</p><div class="chips" role="group" aria-label="Ions in ammonium sulfate"><button type="button" class="chip' + (n ? " on" : "") + '" aria-pressed="' + !!n + '" data-io="nh4" data-k="ionh4">NH₄⁺</button><button type="button" class="chip' + (s ? " on" : "") + '" aria-pressed="' + !!s + '" data-io="so4" data-k="ioso4">SO₄²⁻</button></div>';
    if (n) h += MV.fbHTML("good", "<strong>Reacting ion.</strong> " + s2.nh4);
    if (s) h += MV.fbHTML("", "<strong>Spectator.</strong> " + s2.so4);
    if (n && s) h += "<p>" + s2.lime + "</p>";
    MV.keepFocus($(".hs-s2", host), function(){ $(".hs-s2", host).innerHTML = h; });
  }
  function paint3(){
    var on = !!S.bz, ratio = kaBz / 1e-3, fa = 1 / (1 + ratio), h = '<div class="q-actions"><button type="button" class="btn ' + (on ? "ghost" : "primary") + ' sm" data-bz="1" data-k="bz"' + (on ? " disabled" : "") + ">Check it with data</button></div>";
    if (on) h += "<p>" + s3.check + '</p><div class="hs-split" role="img" aria-label="' + esc("About " + Math.round(fa * 100) + "% benzoic acid and " + (100 - Math.round(fa * 100)) + "% benzoate at pH 3.00") + '"><i class="hs-sp-a" style="width:' + r1(fa * 100) + '%">benzoic acid ' + Math.round(fa * 100) + '%</i><i class="hs-sp-b" style="width:' + r1(100 - fa * 100) + '%"></i></div><p class="tiny muted">At pH 3.00: benzoic acid ' + Math.round(fa * 100) + "%, benzoate " + (100 - Math.round(fa * 100)) + "% (" + KA + " = " + sci(kaBz) + " from the course table).</p>";
    MV.keepFocus($(".hs-s3", host), function(){ $(".hs-s3", host).innerHTML = h; });
  }
  function paintData(){
    var rows = DT.rows, allSorted = rows.every(function(r){ return S.ds[r[0]] === r[2]; }), h = '<div class="hs-dtab">';
    rows.forEach(function(r, i){
      var got = S.ds[r[0]] === r[2];
      h += '<div class="hs-drow" data-dr="' + i + '"><span class="hs-dn">' + r[0] + '</span><span class="chips" role="group" aria-label="' + esc("Sort " + MV.plain(r[0])) + '">' +
        ["a", "n", "b"].map(function(t){ var on = S.ds[r[0]] === t; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-ds="' + t + '" data-k="ds' + i + t + '"' + (got ? " disabled" : "") + ">" + TYPE[t] + "</button>"; }).join("") +
        '</span><span class="hs-dph">' + (got ? "pH " + fx(r[1], 1) : '<span class="muted">pH ?</span>') + "</span></div>";
    });
    h += '</div><p class="tiny muted">Measured pH: model data.</p>';
    if (dmsg) h += MV.fbHTML(dmsg.ok ? "good" : "bad", dmsg.html);
    if (allSorted) {
      var done = S.rok;
      h += '<h4 class="hs-h4">Now rank them</h4><p class="tiny muted">Tap the solutions from lowest to highest pH.</p>';
      if (!done) h += '<div class="chips" role="group" aria-label="Solutions to rank">' + rows.map(function(r, i){ var used = S.rank.indexOf(i) >= 0; return '<button type="button" class="chip" data-rk="' + i + '" data-k="rk' + i + '"' + (used ? " disabled" : "") + ">" + r[0] + "</button>"; }).join("") + "</div>";
      var seq = done ? rows.map(function(_, i){ return i; }).sort(function(p, q){ return rows[p][1] - rows[q][1]; }) : S.rank;
      h += '<ol class="hs-seq" aria-label="Your order, lowest pH first">' + rows.map(function(_, k){ var t = seq[k]; return "<li>" + (t == null ? '<span class="muted">…</span>' : rows[t][0] + " (pH " + fx(rows[t][1], 1) + ")") + "</li>"; }).join("") + "</ol>";
      if (!done) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-rc="check" data-k="rcchk">Check order</button><button type="button" class="btn ghost sm" data-rc="clear" data-k="rcclr"' + (S.rank.length ? "" : " disabled") + ">Clear</button></div>";
      if (rmsg) h += MV.fbHTML(rmsg.ok ? "good" : "bad", rmsg.html);
      if (done) {
        h += '<h4 class="hs-h4">' + DT.prompt + '</h4><div class="opts">' + QORD.map(function(i){ var o = DT.choices[i], on = S.dq === i; return '<button type="button" class="opt' + (on ? (MV.ok(o) ? " right" : " wrong") : "") + '" data-dq="' + i + '" data-k="dq' + i + '"' + (S.dqok ? " disabled" : "") + "><span>" + o.t + "</span></button>"; }).join("") + "</div>";
        if (S.dq != null) { var o = DT.choices[S.dq]; h += MV.fbHTML(MV.ok(o) ? "good" : "bad", (MV.ok(o) ? "" : "<strong>✗ Not quite.</strong> ") + o.fb + (MV.ok(o) ? "" : " Try another answer.")); }
      }
    }
    MV.keepFocus($(".hs-data", host), function(){ $(".hs-data", host).innerHTML = h; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.ar) { S.arr[b.dataset.ar] = true; api.save(); paint1(); return; }
    if (b.dataset.io) { S.ion[b.dataset.io] = true; api.save(); paint2(); return; }
    if (b.dataset.bz) { S.bz = true; api.save(); paint3(); return; }
    if (b.dataset.ds) {
      var r = DT.rows[+b.closest("[data-dr]").dataset.dr];
      S.ds[r[0]] = b.dataset.ds;
      dmsg = b.dataset.ds === r[2] ? { ok:true, html:"<strong>✓ " + r[0] + ": " + TYPE[r[2]].toLowerCase() + ".</strong> " + DT.why[r[0]] + " Measured: pH " + fx(r[1], 1) + "." } : { ok:false, html:"<strong>✗ Not quite.</strong> Check each ion’s parent: strong or weak? Try another box." };
      api.save(); paintData(); return;
    }
    if (b.dataset.rk != null) { S.rank.push(+b.dataset.rk); rmsg = null; api.save(); paintData(); return; }
    if (b.dataset.rc === "clear") { S.rank = []; rmsg = null; api.save(); paintData(); return; }
    if (b.dataset.rc === "check") {
      var rows = DT.rows;
      if (S.rank.length < rows.length) { rmsg = { ok:false, html:"Tap every solution first, lowest pH first." }; paintData(); return; }
      var ok = S.rank.every(function(t, k){ return k === 0 || rows[S.rank[k - 1]][1] <= rows[t][1]; });
      if (ok) { S.rok = true; rmsg = { ok:true, html:"<strong>✓ Correct.</strong> Al₂(SO₄)₃ 3.5 &lt; NH₄Cl 5.1 &lt; NaCl 7.0 &lt; NaHCO₃ 8.3 &lt; CH₃COONa 8.9 &lt; Na₂CO₃ 11.7." }; }
      else { S.rank = []; rmsg = { ok:false, html:"<strong>✗ Not quite.</strong> Read the measured pH values again and start from the lowest. Try again." }; }
      api.save(); paintData(); return;
    }
    if (b.dataset.dq != null) { S.dq = +b.dataset.dq; if (MV.ok(DT.choices[S.dq])) S.dqok = true; api.save(); paintData(); MV.focusFb($(".hs-data", host)); }
  });
  paint1(); paint2(); paint3(); paintData();
}

// ---------- Practice 2: Calculate the pH (N4 number entry; constants as mantissa × 10^exponent) ----------
function calcAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { v:"", m:"", e:"", tries:0, hint:0, solved:false, first:null, follow:false }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function inputs(it, x){
    var d = x.solved ? " disabled" : "", lab = it.label || "pH =";
    if (it.kind === "sci") return '<div class="inrow hs-sci"><label class="hs-inl" for="hs-' + it.id + 'm">' + lab + '</label><input id="hs-' + it.id + 'm" class="numin hs-man" data-in="m" inputmode="decimal" autocomplete="off" value="' + esc(x.m) + '" aria-label="Number in front of times ten"' + d + '><span aria-hidden="true">× 10</span><input class="numin hs-exp" data-in="e" inputmode="text" autocomplete="off" value="' + esc(x.e) + '" aria-label="Power of ten (for example −4)"' + d + "></div>";
    return '<div class="inrow"><label class="hs-inl" for="hs-' + it.id + 'v">' + lab + '</label><input id="hs-' + it.id + 'v" class="numin" data-in="v" inputmode="decimal" autocomplete="off" value="' + esc(x.v) + '"' + d + ">" + (it.unit ? "<span>" + it.unit + "</span>" : "") + "</div>";
  }
  function itemHTML(it, i){
    var x = ist(it.id), h = '<div class="q" data-ci="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>" + inputs(it, x);
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>";
    h += MV.hintsHTML(it.hints, x.hint);
    if (x.solved) {
      h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + it.why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
      if (it.follow) h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="follow" data-k="' + it.id + 'fol"' + (x.follow ? " disabled" : "") + ">" + it.follow.prompt + "</button></div>" + (x.follow ? '<p class="hs-follow">' + it.follow.t + "</p>" : "");
    } else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    return h + "</div>";
  }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + MV.usesHTML(a.use) + '<div class="hs-ctab"></div><div class="hs-citems"></div>';
  MV.chem.tablePanel($(".hs-ctab", host), "acid");
  var box = $(".hs-citems", host);
  function paint(){ MV.keepFocus(box, function(){ box.innerHTML = a.items.map(itemHTML).join(""); }); }
  function near(it, v, w){ return it.kind === "ph" ? Math.abs(v - w) <= 0.02 + 1e-9 : Math.abs(v / w - 1) <= 0.05; }
  host.addEventListener("input", function(e){
    var inp = e.target.closest("[data-in]"); if (!inp) return;
    var x = ist(inp.closest("[data-ci]").dataset.ci); x[inp.dataset.in] = inp.value; msgs[inp.closest("[data-ci]").dataset.ci] = null; api.save();
  });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.closest("[data-in]")) { var c = e.target.closest("[data-ci]").querySelector('[data-act="check"]'); if (c) c.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ci]"); if (!box) return;
    var it = item(box.dataset.ci), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "follow") { x.follow = true; api.save(); paint(); return; }
    if (b.dataset.act !== "check") return;
    var v = null;
    if (it.kind === "sci") { var m = MV.parseNum(x.m), ex = MV.parseNum(x.e); if (m && ex && Math.round(ex[0]) === ex[0]) v = m[0] * Math.pow(10, ex[0]); }
    else { var p = MV.parseNum(x.v); if (p) v = p[0]; }
    if (v == null || !isFinite(v)) { msgs[it.id] = { bad:false, html:it.kind === "sci" ? "Type a number in each box, for example 2.5 and −3 for 2.5 × 10⁻³." : "Type a number, for example 8.25." }; paint(); return; }
    var ans = MV.ans(it), ok = it.kind === "ph" ? Math.abs(v - ans) <= it.tol + 1e-9 : Math.abs(v / ans - 1) <= it.tol;
    if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
    else { x.tries++; var w = (it.wrong || []).filter(function(q){ return near(it, v, q.v); })[0]; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + (w ? w.fb : a.wrongDefault) + " Try again." }; }
    api.save(); paint(); MV.focusFb(host.querySelector('[data-ci="' + it.id + '"]'));
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Exactly pH 9 ----------
var T_SALTS = ["NaCl", "NH4Cl", "CH3NH3Cl", "CH3COONa", "HCOONa", "C6H5COONa", "NaF", "NaOCl"];
var T_CONCS = [["3.0e-4", "3.0 × 10<sup>" + MN + "4</sup>"], ["0.018", "0.018"], ["0.063", "0.063"], ["0.18", "0.18"], ["0.63", "0.63"], ["1.8", "1.8"]];
function tcLab(c){ var r = T_CONCS.filter(function(x){ return x[0] === c; })[0]; return r ? r[1] : c; }
var task = (function(){
  var S = null;
  function read(){ var sid = S && T_SALTS.indexOf(S.salt) >= 0 ? S.salt : "CH3COONa", c = S && T_CONCS.some(function(x){ return x[0] === S.c; }) ? S.c : "0.018", r = model(sid, +c); return { salt:sid, c:c, cv:+c, ph:Math.round(r.ph * 100) / 100, x:r.none ? 0 : r.x, r:r }; }
  function paint(){
    var d = read(), r = d.r, L;
    if (r.none) L = [reason(r), "pH = 7.00"];
    else L = ["Reacting ion: " + F(r.ion.f) + " (" + (r.acid ? "acid" : "base") + "); " + convHTML(r.ion)].concat(workLines(r, true));
    $("#hs-tkm").innerHTML = '<p class="hs-sub">' + F(SAL[d.salt].f) + ", " + tcLab(d.c) + " mol/L · <strong>pH " + ph2(r.ph) + "</strong></p>" + meterSVG(r.ph);
    $("#hs-tkw").innerHTML = (r.none ? "" : iceTable(r)) + '<ul class="hs-lines">' + L.map(function(l){ return "<li>" + l + "</li>"; }).join("") + "</ul>";
  }
  return {
    render:function(inp, pv, a){
      S = a.S;
      if (T_SALTS.indexOf(S.salt) < 0) S.salt = "CH3COONa"; if (!T_CONCS.some(function(x){ return x[0] === S.c; })) S.c = "0.018";
      inp.innerHTML = '<div id="hs-tks"></div><div id="hs-tkc"></div>';
      pv.innerHTML = '<div id="hs-tkm" aria-live="polite"></div><div id="hs-tkw"></div>';
      radios($("#hs-tks"), { label:"Salt", cls:"chips", options:T_SALTS.map(function(id){ return { id:id, t:F(SAL[id].f) }; }), value:S.salt, onChange:function(v){ S.salt = v; a.save(); paint(); a.update(); } });
      radios($("#hs-tkc"), { label:"Concentration (mol/L)", aria:"Concentration in mol per litre", cls:"chips", options:T_CONCS.map(function(x){ return { id:x[0], t:x[1] }; }), value:S.c, onChange:function(v){ S.c = v; a.save(); paint(); a.update(); } });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return [d.ph > 7, Math.abs(d.ph - 9) <= 0.02 + 1e-9, d.cv <= 1.0, d.x / d.cv < 0.05]; },
    key:function(d){ return d.salt + "@" + d.c; },
    label:function(k){ var p = k.split("@"); return F(SAL[p[0]].f) + " at " + tcLab(p[1]) + " mol/L"; },
    text:function(k){ var p = k.split("@"); return MV.plain(F(SAL[p[0]].f)) + " at " + MV.plain(tcLab(p[1])) + " mol/L"; }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ calc:calcAct },
  task:task
});
})();
