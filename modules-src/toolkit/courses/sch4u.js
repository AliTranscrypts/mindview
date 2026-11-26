// SCH4U course helpers (toolkit/courses/sch4u.js). The assembler adds this file to every SCH4U module, after the core.
// Usage:
//   MV.chem.data       C13 course data tables (course plan §3), exactly the plan's values. Numbers are plain JS numbers;
//                      species and half-reactions are plain strings for MV.chem.f. Keys:
//     const          {cWater:4.18, dWater:1.00, c:{Al, Cu, Fe}, F:96500, R:8.314, Kw:1.0e-14}  (units in MV.chem.units)
//     M              molar masses g/mol {H:1.01, C:12.01, …, Ni:58.7, Cr:52.0, Sn:119}; Mr = rounded "Use these values" {Cu:63.5, …}
//     E0             [[half-reaction, E° in V], …] highest first          dHf   [[species, kJ/mol], …] (elements in standard states: 0)
//     bond           [[bond, kJ/mol], …] (C=O 745; 799 in CO₂: see bondNote)  Ka, Kb [[name, formula, value], …]   Ksp [[formula, value], …]
//     EN             {H:2.20, …} (Pauling)    S0 [[species, J/(mol·K)], …]    misc [[quantity, value, unit], …]  (ΔHfus, NH₄Cl, pKb …)
//     ind            [[indicator, low pH, high pH], …]    logs {2:0.30, 3:0.48, 5:0.70, 7:0.85}    hLevel(n) = −13.6/n² eV
//     bp             boiling points °C by IUPAC name, from module 01 (physical data; course table additions in 01's §6)
//   MV.chem.f("C3H8 + 5O2 -> 3CO2 + 4H2O")   formula HTML: digits after an element or ")" become subscripts, leading
//                      coefficients stay full size, "^2+" / "^3-" are charges, a sign glued to the end of a formula is a charge
//                      ("H3O+", "Cl-"), "e-" is e⁻, "->" is →, "<=>" is ⇌. Write Cu^2+ (not Cu2+) for multi-digit charges.
//                      Returns <span class="chem">…</span>; MV.plain() of it gives Unicode (C₃H₈) for aria-labels.
//   MV.chem.atom(el)   {fill, line, ink} CSS var() strings for an element ball per course plan §4 (C ink, H white with --at-h-line
//                      outline, O magenta, N blue, halogens teal, S brown, P orange, metals cerulean). MV.chem.colorVar(el) = "--at-x".
//   MV.chem.tables     registry {id:{title, head:[…], rows:[[…]], note}} built from MV.chem.data; ids: const, molar, e0, dhf, bond,
//                      acid, ksp, en, s0, misc, ind, bp
//   MV.chem.tablePanel(host, id, {open, title})  searchable C13 pop-up panel (<details class="chem-tab">) appended to host;
//                      returns {el, open(bool), filter(text)}. Questions link to it with a button that calls open(true).
//   MV.chem.bpOf(name) boiling point (°C) from MV.chem.data.bp, or null.
(function(){
"use strict";
var MV = window.MV; if (!MV) return;
var M = "−";

// ---------- C13 course data tables (course plan §3) ----------
var D = {
  "const":{ cWater:4.18, dWater:1.00, c:{ Al:0.897, Cu:0.385, Fe:0.449 }, F:96500, R:8.314, Kw:1.0e-14 },
  M:{ H:1.01, C:12.01, N:14.01, O:16.00, Na:22.99, Mg:24.31, Al:26.98, S:32.07, Cl:35.45, K:39.10, Ca:40.08, Fe:55.85, Cu:63.55, Zn:65.38, Ag:107.87, Ni:58.7, Cr:52.0, Sn:119 },
  Mr:{ Cu:63.5, Ag:108, Zn:65.4, Al:27.0, C:12.0, Fe:55.8 },
  E0:[["F2 + 2e- -> 2F-", 2.87], ["Cl2 + 2e- -> 2Cl-", 1.36], ["O2 + 4H+ + 4e- -> 2H2O", 1.23], ["Br2 + 2e- -> 2Br-", 1.07], ["Ag+ + e- -> Ag", 0.80],
    ["Fe^3+ + e- -> Fe^2+", 0.77], ["I2 + 2e- -> 2I-", 0.54], ["O2 + 2H2O + 4e- -> 4OH-", 0.40], ["Cu^2+ + 2e- -> Cu", 0.34], ["2H+ + 2e- -> H2", 0.00],
    ["Pb^2+ + 2e- -> Pb", -0.13], ["Sn^2+ + 2e- -> Sn", -0.14], ["Ni^2+ + 2e- -> Ni", -0.26], ["Fe^2+ + 2e- -> Fe", -0.45], ["Zn^2+ + 2e- -> Zn", -0.76],
    ["2H2O + 2e- -> H2 + 2OH-", -0.83], ["Al^3+ + 3e- -> Al", -1.66], ["Mg^2+ + 2e- -> Mg", -2.37], ["Na+ + e- -> Na", -2.71], ["Li+ + e- -> Li", -3.04]],
  dHf:[["H2O(l)", -285.8], ["H2O(g)", -241.8], ["CO2(g)", -393.5], ["CO(g)", -110.5], ["CH4(g)", -74.6], ["C2H6(g)", -84.0], ["C3H8(g)", -103.8],
    ["C2H5OH(l)", -277.6], ["CH3OH(l)", -239.2], ["C6H12O6(s)", -1273.3], ["NH3(g)", -45.9], ["NO(g)", 91.3], ["NO2(g)", 33.2], ["HCl(g)", -92.3],
    ["NaCl(s)", -411.2], ["CaCO3(s)", -1207.6], ["CaO(s)", -634.9], ["Al2O3(s)", -1675.7], ["Fe2O3(s)", -824.2], ["MgO(s)", -601.6],
    ["OH-(aq)", -230.0], ["Ca(OH)2(s)", -986.1]],
  bond:[["H–H", 436], ["C–H", 413], ["C–C", 347], ["C=C", 614], ["C≡C", 839], ["C–O", 358], ["C=O", 745], ["O–H", 463], ["O=O", 498],
    ["N≡N", 945], ["N–H", 391], ["H–Cl", 432], ["Cl–Cl", 243], ["C–Cl", 339]],
  bondNote:"C=O is 799 kJ/mol in CO₂.",
  Ka:[["methanoic acid", "HCOOH", 1.8e-4], ["ethanoic acid", "CH3COOH", 1.8e-5], ["benzoic acid", "C6H5COOH", 6.3e-5], ["hydrofluoric acid", "HF", 6.6e-4],
    ["hypochlorous acid", "HOCl", 3.0e-8], ["ammonium ion", "NH4+", 5.6e-10], ["carbonic acid (Ka1)", "H2CO3", 4.3e-7], ["carbonic acid (Ka2)", "HCO3-", 4.7e-11]],
  Kb:[["ammonia", "NH3", 1.8e-5], ["methylamine", "CH3NH2", 4.4e-4]],
  Ksp:[["AgCl", 1.8e-10], ["AgBr", 5.0e-13], ["BaSO4", 1.1e-10], ["CaCO3", 3.4e-9], ["CaF2", 3.5e-11], ["Ca(OH)2", 5.0e-6], ["Mg(OH)2", 5.6e-12], ["PbI2", 9.8e-9], ["CaC2O4", 2.3e-9]],
  EN:{ H:2.20, B:2.04, C:2.55, N:3.04, O:3.44, F:3.98, Si:1.90, P:2.19, S:2.58, Cl:3.16, Br:2.96, I:2.66, Li:0.98, Na:0.93, K:0.82, Mg:1.31, Ca:1.00, Al:1.61 },
  S0:[["H2O(l)", 69.9], ["H2O(g)", 188.8], ["CO2(g)", 213.8], ["O2(g)", 205.2], ["N2(g)", 191.6], ["H2(g)", 130.7], ["NH3(g)", 192.8], ["CH4(g)", 186.3],
    ["CaCO3(s)", 92.9], ["CaO(s)", 38.1], ["C(graphite)", 5.7], ["NaCl(s)", 72.1]],
  misc:[["ΔHfus of water", "+6.01 kJ/mol"], ["ΔSfus of water", "+22.0 J/(mol·K)"], ["NH4Cl dissolving, ΔH", "+14.7 kJ/mol"], ["NH4Cl dissolving, ΔS", "+75.3 J/(mol·K)"],
    ["NH4NO3 dissolving, ΔH", "+25.7 kJ/mol"], ["diamond -> graphite, ΔG°", "−2.9 kJ/mol"], ["pKb of NH3", "4.74"], ["pKa of NH4+", "9.26"],
    ["blood buffer, effective pKa", "6.1"], ["HF boiling point", "≈ 20 °C"], ["AlCl3 sublimes", "≈ 180 °C"], ["NaCl melting point", "801 °C"],
    ["MgO melting point", "≈ 2850 °C"], ["ethene H–C–H angle", "≈ 117°"], ["hydrogen energy levels", "Eₙ = −13.6/n² eV"]],
  ind:[["methyl orange", 3.1, 4.4], ["methyl red", 4.4, 6.2], ["bromothymol blue", 6.0, 7.6], ["phenolphthalein", 8.2, 10.0]],
  logs:{ 2:0.30, 3:0.48, 5:0.70, 7:0.85 },
  hLevel:function(n){ return -13.6 / (n * n); },
  bp:{ methane:-162, ethane:-89, propane:-42, butane:-1, "2-methylpropane":-12, pentane:36, "2-methylbutane":28, "2,2-dimethylpropane":10,
    hexane:69, "2-methylpentane":60, "3-methylpentane":63, "2,3-dimethylbutane":58, "2,2-dimethylbutane":50, heptane:98, "2,3-dimethylpentane":90,
    octane:126, nonane:151, decane:174, cyclopropane:-33, cyclobutane:13, cyclopentane:49, cyclohexane:81, chloromethane:-24, chloroethane:12,
    "1-chloropropane":47, "2-chloropropane":35, "1-chlorobutane":78 }
};

// ---------- formula typesetting ----------
function f(s){
  var t = String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/&lt;=&gt;/g, "⇌").replace(/-&gt;/g, "→");
  var sups = [];
  t = t.replace(/\^(\d*[+\-−])/g, function(_, c){ sups.push(c.replace(/-/g, M)); return "\u0001" + (sups.length - 1) + "\u0002"; });
  t = t.replace(/\be-(?=$|[\s),;])/g, "e\u0003");
  t = t.replace(/([A-Za-z)\]])(\d+)/g, "$1<sub>$2</sub>");
  t = t.replace(/([A-Za-z0-9)\]]|<\/sub>)([+\-−])(?=$|[\s(),;])/g, function(_, a, c){ return a + "<sup>" + (c === "+" ? "+" : M) + "</sup>"; });
  t = t.replace(/\u0001(\d+)\u0002/g, function(_, i){ return "<sup>" + sups[+i] + "</sup>"; }).replace(/\u0003/g, "<sup>" + M + "</sup>");
  return '<span class="chem">' + t + "</span>";
}

// ---------- atom colours (course plan §4) ----------
var NONMETAL = { H:1, B:1, C:1, N:1, O:1, F:1, Si:1, P:1, S:1, Cl:1, Br:1, I:1, He:1, Ne:1, Ar:1, Kr:1, Xe:1, Rn:1, At:1, Se:1, As:1, Te:1, Ge:1, Sb:1 };
function colorVar(el){
  if (el === "C") return "--at-c"; if (el === "H") return "--at-h"; if (el === "O") return "--at-o"; if (el === "N") return "--at-n";
  if (el === "F" || el === "Cl" || el === "Br" || el === "I") return "--at-x"; if (el === "S") return "--at-s"; if (el === "P") return "--at-p";
  return NONMETAL[el] ? "--ink-2" : "--at-m";
}
function atom(el){
  var v = colorVar(el);
  return { fill:"var(" + v + ")", line:el === "H" ? "var(--at-h-line)" : "none", ink:el === "H" ? "var(--at-h-ink)" : "var(--sheet)" };
}

// ---------- C13 table registry and searchable panel ----------
function fx(v, dp){ var p = Math.abs(v).toFixed(dp).split("."); if (p[0].length > 4) p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, " "); return (v < 0 ? M : "") + p.join("."); }
function sci(v){
  if (v === 0) return "0";
  var e = Math.floor(Math.log10(Math.abs(v)) + 1e-9), m = v / Math.pow(10, e);
  return fx(m, 1) + " × 10<sup>" + (e < 0 ? M + (-e) : e) + "</sup>";
}
function signed(v, dp){ return (v > 0 ? "+" : "") + fx(v, dp); }
var MDP = { Ni:1, Cr:1, Sn:0 };
var T = {
  "const":{ title:"Constants", head:["Quantity", "Value"], rows:[["c(water)", "4.18 J/(g·°C)"], ["density of water", "1.00 g/mL"], ["c(Al)", "0.897 J/(g·°C)"], ["c(Cu)", "0.385 J/(g·°C)"],
    ["c(Fe)", "0.449 J/(g·°C)"], ["F (Faraday constant)", "96 500 C/mol (9.65 × 10<sup>4</sup>)"], ["R (gas constant)", "8.314 J/(mol·K)"], ["K<sub>w</sub> at 25 °C", "1.0 × 10<sup>" + M + "14</sup>"],
    ["log 2, log 3, log 5, log 7", "0.30, 0.48, 0.70, 0.85"]] },
  molar:{ title:"Molar masses (g/mol)", head:["Element", "Molar mass", "Use these values"], rows:Object.keys(D.M).map(function(k){ return [k, fx(D.M[k], MDP[k] != null ? MDP[k] : 2), D.Mr[k] != null ? fx(D.Mr[k], k === "Ag" ? 0 : 1) : ""]; }) },
  e0:{ title:"Standard reduction potentials (25 °C)", head:["Half-reaction", "E° (V)"], rows:D.E0.map(function(r){ return [f(r[0]), signed(r[1], 2)]; }) },
  dhf:{ title:"Standard enthalpies of formation, ΔH°f (kJ/mol)", head:["Substance", "ΔH°f"], rows:D.dHf.map(function(r){ return [f(r[0]), signed(r[1], 1)]; }), note:"Elements in their standard states: 0." },
  bond:{ title:"Average bond energies (kJ/mol)", head:["Bond", "Energy"], rows:D.bond.map(function(r){ return [r[0], String(r[1])]; }), note:D.bondNote },
  acid:{ title:"Acid and base constants (25 °C)", head:["Name", "Formula", "Constant"], rows:D.Ka.map(function(r){ return [r[0], f(r[1]), "K<sub>a</sub> = " + sci(r[2])]; }).concat(D.Kb.map(function(r){ return [r[0], f(r[1]), "K<sub>b</sub> = " + sci(r[2])]; })) },
  ksp:{ title:"Solubility products, Ksp (25 °C)", head:["Compound", "K<sub>sp</sub>"], rows:D.Ksp.map(function(r){ return [f(r[0]), sci(r[1])]; }) },
  en:{ title:"Electronegativity (Pauling)", head:["Element", "EN"], rows:Object.keys(D.EN).map(function(k){ return [k, fx(D.EN[k], 2)]; }) },
  s0:{ title:"Standard entropies, S° (J/(mol·K))", head:["Substance", "S°"], rows:D.S0.map(function(r){ return [f(r[0]), fx(r[1], 1)]; }) },
  misc:{ title:"Other course values", head:["Quantity", "Value"], rows:D.misc.map(function(r){ return [f(r[0]), r[1]]; }) },
  ind:{ title:"Indicator ranges (pH)", head:["Indicator", "Range"], rows:D.ind.map(function(r){ return [r[0], fx(r[1], 1) + "–" + fx(r[2], 1)]; }) },
  bp:{ title:"Boiling points (°C)", head:["Compound", "Boiling point (°C)"], rows:Object.keys(D.bp).map(function(k){ return [k, fx(D.bp[k], 0)]; }), note:"Rounded to the nearest degree (course table additions from module 01)." }
};
var uid = 0;
function tablePanel(host, id, o){
  o = o || {}; var t = T[id]; if (!t || !host) return null;
  var k = "ct" + (++uid), el = document.createElement("details");
  el.className = "chem-tab"; if (o.open) el.open = true;
  el.innerHTML = "<summary>" + (o.title || ("Course data table: " + t.title)) + '</summary><label for="' + k + '">Search<input id="' + k + '" type="search" autocomplete="off" placeholder="Type a name or formula"></label>' +
    MV.tableHTML({ head:t.head, rows:t.rows, caption:t.title }) + (t.note ? '<p class="tiny muted" style="margin:8px 0 0">' + t.note + "</p>" : "");
  host.appendChild(el);
  var rows = el.querySelectorAll("tbody tr");
  function filter(q){
    q = String(q || "").toLowerCase().replace(/\s+/g, "");
    Array.prototype.forEach.call(rows, function(r){ var txt = MV.plain(r.innerHTML).toLowerCase().replace(/\s+/g, ""); var plain = txt.replace(/[₀-₉]/g, function(c){ return String(c.charCodeAt(0) - 8320); }); r.hidden = !!q && txt.indexOf(q) < 0 && plain.indexOf(q) < 0; });
  }
  el.querySelector("input").addEventListener("input", function(e){ filter(e.target.value); });
  return { el:el, open:function(b){ el.open = b !== false; if (el.open) el.scrollIntoView({ block:"nearest" }); }, filter:filter };
}

MV.chem = { data:D, f:f, atom:atom, colorVar:colorVar, tables:T, tablePanel:tablePanel, sci:sci, fx:fx,
  units:{ cWater:"J/(g·°C)", dWater:"g/mL", c:"J/(g·°C)", F:"C/mol", R:"J/(mol·K)" },
  bpOf:function(name){ var v = D.bp[name]; return v == null ? null : v; } };
})();
