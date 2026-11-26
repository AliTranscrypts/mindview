// SCH4U 23 The Periodic Table: hero (Mendeleev's cards by mass with the eka-silicon gap, the "?" card flipping to his
// prediction and then to germanium, then the modern long form with its four blocks lighting up), Table builder (Explore:
// C11 full periodic table with Build / Mendeleev / Families modes, three layers, a one-block view, the neighbour-average
// tool and the family clips), Predict an element (Part 3: mystery cards, Check it with data, how close Mendeleev was),
// Formula predictor (subscript chips) and "Find the element" (task on the main-group table).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
function esc(s){ return MV.esc(s); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function r2(v){ return Math.round(v * 100) / 100; }
function cap1(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
function numTxt(v){ return Number.isInteger(v) ? v.toFixed(1) : MV.num(v, 2); }
var MINUS = "−";
var NARROW = window.matchMedia ? window.matchMedia("(max-width: 600px)") : { matches:false };

// ---------- elements (symbols, names, positions) ----------
// MV.chem.data has no element symbols or names, so they live here (IUPAC names; the course spells "aluminium",
// and this plan uses "cesium"). Positions only: no measured values.
var SYM = ("|H|He|Li|Be|B|C|N|O|F|Ne|Na|Mg|Al|Si|P|S|Cl|Ar|K|Ca|Sc|Ti|V|Cr|Mn|Fe|Co|Ni|Cu|Zn|Ga|Ge|As|Se|Br|Kr|Rb|Sr|Y|Zr|Nb|Mo|Tc|Ru|Rh|Pd|Ag|Cd|In|Sn|Sb|Te|I|Xe|" +
  "Cs|Ba|La|Ce|Pr|Nd|Pm|Sm|Eu|Gd|Tb|Dy|Ho|Er|Tm|Yb|Lu|Hf|Ta|W|Re|Os|Ir|Pt|Au|Hg|Tl|Pb|Bi|Po|At|Rn|Fr|Ra|Ac|Th|Pa|U|Np|Pu|Am|Cm|Bk|Cf|Es|Fm|Md|No|Lr|" +
  "Rf|Db|Sg|Bh|Hs|Mt|Ds|Rg|Cn|Nh|Fl|Mc|Lv|Ts|Og").split("|");
var NAME = ("|hydrogen|helium|lithium|beryllium|boron|carbon|nitrogen|oxygen|fluorine|neon|sodium|magnesium|aluminium|silicon|phosphorus|sulfur|chlorine|argon|" +
  "potassium|calcium|scandium|titanium|vanadium|chromium|manganese|iron|cobalt|nickel|copper|zinc|gallium|germanium|arsenic|selenium|bromine|krypton|" +
  "rubidium|strontium|yttrium|zirconium|niobium|molybdenum|technetium|ruthenium|rhodium|palladium|silver|cadmium|indium|tin|antimony|tellurium|iodine|xenon|" +
  "cesium|barium|lanthanum|cerium|praseodymium|neodymium|promethium|samarium|europium|gadolinium|terbium|dysprosium|holmium|erbium|thulium|ytterbium|lutetium|" +
  "hafnium|tantalum|tungsten|rhenium|osmium|iridium|platinum|gold|mercury|thallium|lead|bismuth|polonium|astatine|radon|" +
  "francium|radium|actinium|thorium|protactinium|uranium|neptunium|plutonium|americium|curium|berkelium|californium|einsteinium|fermium|mendelevium|nobelium|lawrencium|" +
  "rutherfordium|dubnium|seaborgium|bohrium|hassium|meitnerium|darmstadtium|roentgenium|copernicium|nihonium|flerovium|moscovium|livermorium|tennessine|oganesson").split("|");
var BYSYM = {}; SYM.forEach(function(s, z){ if (z) BYSYM[s] = z; });
var PSTART = [0, 1, 3, 11, 19, 37, 55, 87, 119];
function period(z){ for (var p = 1; p <= 7; p++) if (z < PSTART[p + 1]) return p; return 7; }
// position: g = group (0 in the f rows), f = column in the f row (La–Yb, Ac–No; Lu and Lr sit in group 3)
function pos(z){
  var p = period(z), i = z - PSTART[p];
  if (p === 1) return { p:1, g:z === 1 ? 1 : 18, f:-1 };
  if (p <= 3) return { p:p, g:i < 2 ? i + 1 : i + 11, f:-1 };
  if (p <= 5 || i < 2) return { p:p, g:i + 1, f:-1 };
  if (i <= 15) return { p:p, g:0, f:i - 2 };
  return { p:p, g:i - 13, f:-1 };
}
function group(z){ return pos(z).g; }
function blockOf(z){ var q = pos(z); if (q.f >= 0) return "f"; if (z === 2 || q.g <= 2) return "s"; return q.g >= 13 ? "p" : "d"; }
var CELL = {};
for (var zz = 1; zz <= 118; zz++) { var qq = pos(zz); CELL[qq.f >= 0 ? "f" + qq.p + ":" + (qq.f + 3) : qq.p + ":" + qq.g] = zz; }
function zAt(p, g){ return CELL[p + ":" + g] || 0; }
function zF(p, col){ return CELL["f" + p + ":" + col] || 0; }

// ---------- classification (plan §4 "Classification used") ----------
var METALLOID = [5, 14, 32, 33, 51, 52];
var NONMETAL = [1, 2, 6, 7, 8, 9, 10, 15, 16, 17, 18, 34, 35, 36, 53, 54, 85, 86];
function typeOf(z){ if (z >= 104) return "synthetic"; if (METALLOID.indexOf(z) >= 0) return "metalloid"; if (NONMETAL.indexOf(z) >= 0) return "nonmetal"; return "metal"; }
function typeText(z){
  if (z === 1) return "nonmetal (a special case: it sits in group 1)";
  if (z === 84) return "metal (some tables call it a metalloid)";
  if (z === 85) return "nonmetal (some tables call it a metalloid)";
  return typeOf(z) === "synthetic" ? "unknown (synthetic, short-lived)" : typeOf(z);
}
function ionH(s, q){ var a = Math.abs(q); return s + "<sup>" + (a > 1 ? a : "") + (q > 0 ? "+" : MINUS) + "</sup>"; }
var TMI = { 26:ionH("Fe", 2) + ", " + ionH("Fe", 3), 29:ionH("Cu", 1) + ", " + ionH("Cu", 2), 25:ionH("Mn", 2) + ", " + ionH("Mn", 4), 24:ionH("Cr", 2) + ", " + ionH("Cr", 3) };
function ionOf(z){
  var g = group(z), b = blockOf(z), s = SYM[z], t = typeOf(z);
  if (z >= 104) return "unknown (synthetic)";
  if (z === 1) return ionH("H", 1) + " (or " + ionH("H", -1) + " with reactive metals)";
  if (g === 18) return "none (noble gas)";
  if (b === "f") return z < 89 ? "usually 3+ (" + ionH(s, 3) + ")" : "several (actinide)";
  if (b === "d") return "several (transition metal)" + (TMI[z] ? ": " + TMI[z] : "");
  if (g === 1) return ionH(s, 1);
  if (g === 2) return ionH(s, 2);
  if (g === 13) return z === 5 ? "none (shares electrons)" : z === 81 ? ionH("Tl", 1) + " (also " + ionH("Tl", 3) + ")" : ionH(s, 3);
  if (g === 14) return z === 50 ? ionH("Sn", 2) + " or " + ionH("Sn", 4) : z === 82 ? ionH("Pb", 2) + " (also " + ionH("Pb", 4) + ")" : "none (shares electrons)";
  if (t === "metal") return z === 83 ? ionH("Bi", 3) : ionH("Po", 2) + " (also " + ionH("Po", 4) + ")";   // VERIFY: Po ion
  return ionH(s, g - 18);
}
function cf(s){ return s.replace(/([spdf])(\d+)/g, "$1<sup>$2</sup>"); }
var DEX = { 24:"4s1 3d5", 29:"4s1 3d10", 41:"5s1 4d4", 42:"5s1 4d5", 44:"5s1 4d7", 45:"5s1 4d8", 46:"4d10", 47:"5s1 4d10", 78:"6s1 4f14 5d9", 79:"6s1 4f14 5d10" };
function valence(z){
  var q = pos(z), b = blockOf(z), n = q.p;
  if (z <= 2) return cf("1s" + z);
  if (z >= 103) return "not measured (synthetic)";
  if (b === "s") return cf(n + "s" + q.g);
  if (b === "p") return cf(n + "s2 " + n + "p" + (q.g - 12));
  if (b === "f") return (n === 6 ? "4f" : "5f") + " filling, with " + cf(n + "s2");
  if (DEX[z]) return cf(DEX[z]);
  return cf(n + "s2 " + (n >= 6 ? (n - 2) + "f14 " : "") + (n - 1) + "d" + (q.g - 2));
}
function valCount(z){ var b = blockOf(z), g = group(z); if (z === 2) return 2; if (b === "s") return g; if (b === "p") return g - 10; return 0; }
var FAMN = { 1:"alkali metal", 2:"alkaline earth metal", 13:"group 13 (boron family)", 14:"group 14 (carbon family)", 15:"group 15 (nitrogen family)", 16:"group 16 (oxygen family)", 17:"halogen", 18:"noble gas" };
function familyOf(z){ var b = blockOf(z); if (z === 1) return "none (hydrogen is a special case)"; if (b === "f") return z < 89 ? "lanthanide (f block)" : "actinide (f block)"; if (b === "d") return "transition metal"; return FAMN[group(z)]; }
function famKey(g){ return g >= 3 && g <= 12 ? "tm" : "g" + g; }
function readRows(z){
  var q = pos(z);
  return [["Element", NAME[z] + ", Z = " + z], ["Period / group / block", q.p + " / " + (q.g || "—") + " / " + blockOf(z)], ["Valence configuration", valence(z)],
    ["Type", typeText(z)], ["Common ion", ionOf(z)], ["Family", familyOf(z)]];
}

// ---------- Mendeleev-mode data ----------
// Atomic masses (g/mol): course table values where it has them; plan §6 course table additions; the rest local.
var CM = (MV.chem && MV.chem.data && MV.chem.data.M) || {};
var MASS = {};
["H", "C", "N", "O", "Na", "Mg", "Al", "S", "Cl", "K", "Ca", "Cu", "Zn", "Ag", "Cr"].forEach(function(s){ if (CM[s] != null) MASS[s] = CM[s]; });
// plan §6 additions (course table addition); Si is the plan's rounded 28.1; Sn is the plan's 118.7 (the course table has 119)
var ADD = { Si:28.1, Ga:69.7, Ge:72.6, As:74.9, Sn:118.7, Pb:207.2, Se:79.0, Te:127.6, I:126.9, Br:79.9 };
Object.keys(ADD).forEach(function(s){ MASS[s] = ADD[s]; });
// VERIFY: masses below are not in the course table or the plan (standard atomic weights, 2 decimals)
var LOCALM = { Li:6.94, Be:9.01, B:10.81, F:19.00, P:30.97, Sc:44.96, Ti:47.87, V:50.94, Mn:54.94, Rb:85.47, Sr:87.62, Y:88.91, Zr:91.22, Nb:92.91, Mo:95.95,
  Cd:112.41, In:114.82, Sb:121.76, Au:196.97, Hg:200.59, Tl:204.38, Bi:208.98, Cr:52.00 };
Object.keys(LOCALM).forEach(function(s){ if (MASS[s] == null) MASS[s] = LOCALM[s]; });
// VERIFY: densities (g/cm³, room temperature; P white, Sn white, As grey, C graphite, Se grey) for the "another property" option
var DENS = { B:2.34, C:2.27, Al:2.70, Si:2.33, P:1.82, Zn:7.14, Ga:5.91, As:5.73, Se:4.81, In:7.31, Sn:7.29, Sb:6.68, Tl:11.85, Pb:11.34, Bi:9.78 };
var NEIGH = ["Si", "Sn", "Ga", "As"];

// ---------- @component radioGroup (from MHF4U 25, via SCH4U 01–17) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock); with no option chosen yet, the first option holds the tab stop.
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange(id), disabled}) -> {set(id), get(), lock(bool), paint()}
function radios(host, o){
  var val = o.value == null ? "" : String(o.value), locked = false;
  function off(id){ return o.disabled ? o.disabled(id) : ""; }
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), first = true;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val, d = locked || !!off(x.id), tab = on || (!any && first && !d); if (!d) first = false; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (tab ? 0 : -1) + '" data-rg="' + esc(x.id) + '"' + (x.aria ? ' aria-label="' + esc(x.aria) + '"' : "") + (x.cls ? ' class="' + x.cls + '"' : "") + (d ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked || off(id)) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(val); if (i < 0) i = d > 0 ? -1 : 0;
    for (var s = 0; s < ids.length; s++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); return; } }
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, paint:paint };
}

// ---------- @component C11 periodicTable (full long form; extends SCH4U 16's miniTable) — HTML periodic table, periods 1–7 plus
// the f rows (La–Yb, Ac–No; Lu and Lr in group 3). Layers: "blocks" (s --pen, p teal, d orange, f brown tints with a band
// of block labels), "metal" (hatching: diagonal = metal, dotted = metalloid, plain = nonmetal), "val" (valence-electron
// counts on s- and p-block cells). One-block view (s / p / d / f), optional group headers as buttons, roving tabindex
// with arrow keys by row and column.
// ptable(host, {sel(), layer(), view(), pick(z), cls(z) -> extra classes, mark(z) -> small html, groupBtns(), gOn(g), pickG(g),
//               locked(), aria}) -> {paint(), focusZ(z)}
function ptable(host, o){
  var fz = 0;
  function colsFor(v){ var a = [], g; if (v === "s") return [1, 2]; if (v === "p") return [13, 14, 15, 16, 17, 18]; if (v === "d") { for (g = 3; g <= 12; g++) a.push(g); return a; } for (g = 1; g <= 18; g++) a.push(g); return a; }
  function cellHTML(z, r, c, lay, sel, lock){
    var cl = "pt-el b-" + blockOf(z) + " t-" + typeOf(z) + (z === sel ? " sel" : "") + (o.cls ? " " + (o.cls(z) || "") : ""), mk = o.mark ? o.mark(z) : "";
    var inner = '<span class="pt-sy">' + SYM[z] + "</span>" + (lay === "val" && valCount(z) ? '<span class="pt-vn">' + valCount(z) + "</span>" : "") + (mk || "");
    var lab = cap1(NAME[z]) + ", Z = " + z + (lay === "val" && valCount(z) ? ", " + valCount(z) + " valence electrons" : lay === "metal" ? ", " + typeOf(z) : "") + (mk ? ", " + MV.plain(mk) : "");
    return '<button type="button" class="' + cl + '" data-z="' + z + '" data-r="' + r + '" data-c="' + c + '" tabindex="' + (z === fz ? 0 : -1) + '" aria-label="' + esc(lab) + '"' + (z === sel ? ' aria-current="true"' : "") + (lock ? " disabled" : "") + ">" + inner + "</button>";
  }
  function paint(){
    var sel = o.sel(), lay = o.layer(), v = o.view ? o.view() : "all", f = host.contains(document.activeElement), lock = o.locked && o.locked(), gb = o.groupBtns && o.groupBtns();
    if (sel && !f) fz = sel;
    var cols = colsFor(v), main = v !== "f", fr = v === "all" || v === "f", n = main ? cols.length : 14, h, p, k, z;
    var tpl = ' style="grid-template-columns:1.6em repeat(' + n + ',minmax(' + (v === "all" ? 27 : 36) + 'px,1fr))"';
    h = '<div class="pt-tab lay-' + lay + (v !== "all" ? " one" : "") + '" role="group" aria-label="' + esc(o.aria || "Periodic table") + '">';
    if (main) {
      if (lay === "blocks" && v === "all") h += '<div class="pt-r pt-bands" aria-hidden="true"' + tpl + '><span></span><span class="pt-bk b-s" style="grid-column:2 / 4">s</span><span class="pt-bk b-d" style="grid-column:4 / 14">d block</span><span class="pt-bk b-p" style="grid-column:14 / 20">p block</span></div>';
      h += '<div class="pt-r pt-hd"' + tpl + '><span class="pt-pl" aria-hidden="true"></span>' + cols.map(function(g){
        return gb ? '<button type="button" class="pt-g' + (o.gOn(g) ? " on" : "") + '" data-g="' + g + '" aria-pressed="' + !!o.gOn(g) + '" aria-label="Group ' + g + '"' + (lock ? " disabled" : "") + ">" + g + "</button>" : '<span class="pt-g" aria-hidden="true">' + g + "</span>";
      }).join("") + "</div>";
      for (p = 1; p <= 7; p++) {
        var cells = cols.map(function(g){ return zAt(p, g); });
        if (v !== "all" && !cells.some(function(x){ return x; })) continue;
        h += '<div class="pt-r"' + tpl + '><span class="pt-pl" aria-hidden="true">' + p + "</span>";
        cells.forEach(function(x, c){ h += x ? cellHTML(x, p, v === "all" ? cols[c] : c + 1, lay, sel, lock) : '<span class="pt-gap" aria-hidden="true"></span>'; });
        h += "</div>";
      }
    }
    if (fr) {
      if (main) h += '<div class="pt-r pt-fsp" aria-hidden="true"></div>';
      if (lay === "blocks") h += '<div class="pt-r pt-bands" aria-hidden="true"' + tpl + '><span></span>' + (v === "all" ? '<span class="pt-bk b-f" style="grid-column:4 / 18">f block</span>' : '<span class="pt-bk b-f" style="grid-column:2 / 16">f block</span>') + "</div>";
      for (p = 6; p <= 7; p++) {
        h += '<div class="pt-r"' + tpl + '><span class="pt-pl" aria-hidden="true">' + p + "</span>";
        if (v === "all") { for (k = 1; k <= 18; k++) { z = zF(p, k); h += z ? cellHTML(z, p + 2, k, lay, sel, lock) : '<span class="pt-gap" aria-hidden="true"></span>'; } }
        else for (k = 3; k <= 16; k++) h += cellHTML(zF(p, k), p + 2, k - 2, lay, sel, lock);
        h += "</div>";
      }
    }
    host.innerHTML = h + "</div>";
    if (!host.querySelector('[data-z="' + fz + '"]')) { var b0 = host.querySelector("[data-z]"); if (b0) { b0.tabIndex = 0; fz = +b0.dataset.z; } }
    if (f) focusZ(fz, true);
  }
  function focusZ(z, quiet){
    var b = host.querySelector('[data-z="' + z + '"]');
    if (!b || b.disabled) { if (!quiet) return; b = host.querySelector("[data-z]:not([disabled])"); if (!b) return; }
    $$("[data-z]", host).forEach(function(x){ x.tabIndex = -1; }); b.tabIndex = 0; b.focus({ preventScroll:true }); fz = +b.dataset.z;
  }
  host.addEventListener("click", function(e){
    var g = e.target.closest("[data-g]"); if (g && !g.disabled) { o.pickG(+g.dataset.g); return; }
    var b = e.target.closest("[data-z]"); if (!b || b.disabled) return; fz = +b.dataset.z; o.pick(fz);
  });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-z]"); if (!b) return;
    var r = +b.dataset.r, c = +b.dataset.c, all = $$("[data-z]", host), t = null, best = 1e9;
    function at(rr, cc){ for (var i = 0; i < all.length; i++) if (+all[i].dataset.r === rr && +all[i].dataset.c === cc) return all[i]; return null; }
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      var d = e.key === "ArrowRight" ? 1 : -1;
      all.forEach(function(x){ if (+x.dataset.r !== r) return; var dc = (+x.dataset.c - c) * d; if (dc > 0 && dc < best) { best = dc; t = x; } });
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      var dr = e.key === "ArrowDown" ? 1 : -1;
      for (var rr = r + dr; rr >= 1 && rr <= 9 && !t; rr += dr) t = at(rr, c);
    } else return;
    e.preventDefault(); if (t) focusZ(+t.dataset.z);
  });
  paint();
  return { paint:paint, focusZ:focusZ };
}

// ---------- hero: Mendeleev's cards, the eka-silicon gap, then the modern blocks ----------
var HC = [["Si", 0, 0], ["P", 1, 0], ["S", 2, 0], ["?", 0, 1], ["As", 1, 1], ["Se", 2, 1], ["Sn", 0, 2], ["Sb", 1, 2], ["Te", 2, 2]];
var HG = { x0:64, y0:70, w:96, h:52, gap:12 };
var HT = { x0:31, y0:70, cw:21, ch:18, fy:206 };
var BLK = { s:"var(--pen)", p:"var(--p-d)", d:"var(--p-k)", f:"var(--p-b)" };
function hero(f){
  var svg = $("#pt-hx-svg"), ctr = $("#pt-hx-ctr"), rep = $("#pt-hx-replay"), cap = f.cap, run = 0;
  if (!svg) return;
  function txt(x, y, s, size, o){ o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + size + '"' + (o.w ? ' font-weight="' + o.w + '"' : "") + ' fill="' + (o.fill || "var(--ink)") + '">' + s + "</text>"; }
  function card(c, k, st){
    var t = clamp(st.slide * 9 - k, 0, 1); if (t <= 0) return "";
    var x = HG.x0 + c[1] * (HG.w + HG.gap) - (1 - t) * 60, y = HG.y0 + c[2] * (HG.h + HG.gap), cx = x + HG.w / 2, h = "", gap = c[0] === "?";
    var sx = 1, face = 0;
    if (gap) { var fl = st.flip; face = fl < 0.5 ? 0 : fl < 1.5 ? 1 : 2; sx = Math.abs(Math.cos(Math.PI * fl)); }
    h += '<g opacity="' + r2(t) + '" transform="translate(' + r1(cx) + ',0) scale(' + r2(Math.max(0.02, sx)) + ',1) translate(' + r1(-cx) + ',0)">';
    h += '<rect x="' + r1(x) + '" y="' + y + '" width="' + HG.w + '" height="' + HG.h + '" rx="6" fill="' + (gap ? "var(--hi-soft)" : "var(--sheet)") + '" stroke="' + (gap ? "var(--ink)" : "var(--ink-2)") + '" stroke-width="1.5"' + (gap && face === 0 ? ' stroke-dasharray="5 3"' : "") + "/>";
    if (!gap) h += txt(cx, y + 20, c[0], 18, { w:700 }) + txt(cx, y + 40, String(Math.round(MASS[c[0]])), 12, { fill:"var(--ink-2)" });
    else if (face === 0) h += txt(cx, y + HG.h / 2, "?", 26, { w:700 });
    else if (face === 1) h += txt(cx, y + 19, "mass ≈ 72", 13, { w:700 }) + txt(cx, y + 38, "grey · forms EO<tspan dy=\"3\" font-size=\"8\">2</tspan>", 10.5);
    else h += txt(cx, y + 20, "Ge", 18, { w:700 }) + txt(cx, y + 40, "1886", 12, { fill:"var(--ink-2)" });
    return h + "</g>";
  }
  function table(st){
    var h = '<g opacity="' + r2(st.fade) + '">', order = ["s", "p", "d", "f"], z, q, x, y, b;
    for (z = 1; z <= 118; z++) {
      q = pos(z); b = blockOf(z);
      x = HT.x0 + ((q.f >= 0 ? q.f + 3 : q.g) - 1) * HT.cw; y = q.f >= 0 ? HT.fy + (q.p - 6) * HT.ch : HT.y0 + (q.p - 1) * HT.ch;
      var lit = st.lit > order.indexOf(b), ge = z === 32 && st.glow > 0;
      h += '<rect x="' + x + '" y="' + y + '" width="' + (HT.cw - 2) + '" height="' + (HT.ch - 2) + '" rx="2" fill="' + (lit ? BLK[b] : "var(--sheet)") + '" fill-opacity="' + (lit ? 0.3 : 1) + '" stroke="var(--rule)" stroke-width="1"/>';
      if (ge) h += '<rect x="' + (x - 2) + '" y="' + (y - 2) + '" width="' + (HT.cw + 2) + '" height="' + (HT.ch + 2) + '" rx="3" fill="var(--hi)" stroke="var(--ink)" stroke-width="2" opacity="' + r2(st.glow) + '"/>' + txt(x + HT.cw / 2 - 1, y + HT.ch / 2 - 1, "Ge", 10, { w:700, fill:"var(--hi-ink)" }).replace("<text ", '<text opacity="' + r2(st.glow) + '" ');
    }
    // block labels: the subshell each block fills
    if (st.lit > 0) h += txt(HT.x0 + HT.cw - 1, HT.y0 - 8, "s: ns", 11, { w:700 });
    if (st.lit > 1) h += txt(HT.x0 + 14.5 * HT.cw, HT.y0 + HT.ch / 2 - 1, "p block: np", 11, { w:700 });
    if (st.lit > 2) h += txt(HT.x0 + 7 * HT.cw, HT.y0 + 2 * HT.ch, "d block: (n − 1)d", 12, { w:700 });
    if (st.lit > 3) h += txt(HT.x0 + HT.cw - 1, HT.fy + 8, "f block", 9.5, { w:700 }) + txt(HT.x0 + HT.cw - 1, HT.fy + 24, "(n − 2)f", 9.5, { w:700 });
    if (st.glow > 0) {
      var gx = HT.x0 + 13 * HT.cw + HT.cw / 2 - 1, gy = HT.y0 + 3 * HT.ch - 13;
      h += '<g opacity="' + r2(st.glow) + '"><rect x="' + (gx - 44) + '" y="' + (gy - 8) + '" width="88" height="16" rx="8" fill="var(--ink)"/>' + txt(gx, gy, "1871: predicted", 10, { w:700, fill:"var(--sheet)" }) + "</g>";
    }
    return h + "</g>";
  }
  function draw(st){
    var h = "";
    if (st.fade < 1) {
      h += '<g opacity="' + r2(1 - st.fade) + '">' + txt(220, 30, "Ordered by atomic mass (Mendeleev, 1871)", 14, { w:700 });
      ["IV", "V", "VI"].forEach(function(g, i){ h += txt(HG.x0 + i * (HG.w + HG.gap) + HG.w / 2, 56, "Group " + g, 12, { fill:"var(--ink-2)" }); });
      HC.forEach(function(c, k){ h += card(c, k, st); });
      h += "</g>";
    }
    if (st.fade > 0) h += txt(220, 30, "The modern long form, ordered by atomic number", 14, { w:700 }).replace("<text ", '<text opacity="' + r2(st.fade) + '" ') + table(st);
    svg.innerHTML = h;
  }
  function final(){ draw({ slide:1, flip:2, fade:1, lit:4, glow:1 }); ctr.textContent = "The blocks show the subshell being filled; germanium sits in Mendeleev’s gap."; cap.textContent = "Four blocks: s (ns), p (np), d ((n − 1)d), f ((n − 2)f)."; rep.hidden = false; }
  function play(){
    var id = ++run, st = { slide:0, flip:0, fade:0, lit:0, glow:0 };
    rep.hidden = true; cap.textContent = "";
    function ok(){ return id === run; }
    function tw(dur, key, from, to, msg, next){ if (msg) ctr.textContent = msg; MV.tween({ dur:dur, step:function(t){ if (!ok()) return; st[key] = from + (to - from) * t; draw(st); }, done:function(){ if (!ok()) return; st[key] = to; draw(st); MV.wait(next[0], function(){ if (ok()) next[1](); }); } }); }
    tw(2200, "slide", 0, 1, "Cards slide into rows by atomic mass, leaving a gap below silicon.", [500, function(){
      tw(700, "flip", 0, 1, "Mendeleev’s prediction for the gap (1871): mass ≈ 72, grey, forms EO₂.", [1500, function(){
        tw(700, "flip", 1, 2, "Found in 1886: germanium, close to the prediction.", [1100, function(){
          tw(900, "fade", 0, 1, "The table re-flows into the modern long form.", [200, function(){
            tw(2000, "lit", 0, 4, "The four blocks light up: s, p, d, f.", [200, function(){
              tw(600, "glow", 0, 1, "", [0, final]);
            }]);
          }]);
        }]);
      }]);
    }]);
  }
  rep.addEventListener("click", play);
  if (MV.reduceMotion) final(); else play();
}

// ---------- family clips (observations only; CSS animations, still frames with reduced motion) ----------
function clipHTML(id, C){
  var c = C.clips[id], h = '<figure class="pt-clip"><figcaption>' + c.title + '</figcaption><div class="pt-frames">';
  c.frames.forEach(function(fr, i){
    var s = "";
    if (id === "alkali") {
      var k = ["li", "na", "k"][i];
      s = '<svg viewBox="0 0 120 100" class="pt-ak pt-ak-' + k + '" role="img" aria-label="' + esc(MV.plain(fr[0]) + " in water: " + fr[1]) + '">' +
        '<rect x="14" y="40" width="92" height="52" class="pt-water"/><path d="M14 22 V92 H106 V22" class="pt-glass"/>' +
        '<g class="pt-piece">' + (k === "li" ? '<rect x="52" y="34" width="16" height="9" rx="2" class="pt-metal"/>' : '<circle cx="60" cy="38" r="' + (k === "na" ? 6 : 6.5) + '" class="pt-metal"/>') +
        (k === "k" ? '<path class="pt-flame" d="M60 8 C66 18 71 24 66 32 C64 36 56 36 54 32 C49 24 56 18 60 8 Z"/>' : "") + "</g>";
      var nb = k === "li" ? 3 : k === "na" ? 5 : 7;
      for (var b = 0; b < nb; b++) s += '<circle class="pt-bub" cx="' + (44 + (b * 37) % 34) + '" cy="' + (60 + (b * 13) % 26) + '" r="' + (1.6 + (b % 3) * 0.6) + '" style="animation-delay:' + r1(b * 0.27) + 's"/>';
      s += "</svg>";
    } else {
      s = '<svg viewBox="0 0 120 100" class="pt-hal" role="img" aria-label="' + esc(MV.plain(fr[0]) + ": " + fr[1]) + '"><path d="M40 10 H80 V20 C98 28 104 44 104 60 C104 80 86 94 60 94 C34 94 16 80 16 60 C16 44 22 28 40 20 Z" class="pt-glass"/>' +
        (i === 0 ? '<path d="M41 21 C24 30 18 44 18 60 C18 79 35 92 60 92 C85 92 102 79 102 60 C102 44 96 30 79 21 Z" class="pt-cl2"/>' :
          i === 1 ? '<path d="M41 21 C24 30 18 44 18 60 C18 79 35 92 60 92 C85 92 102 79 102 60 C102 44 96 30 79 21 Z" class="pt-brv"/><path d="M19 70 H101 C98 84 82 92 60 92 C38 92 22 84 19 70 Z" class="pt-br2"/>' :
          '<path d="M30 86 L38 76 L46 84 L52 74 L60 82 L68 73 L76 83 L84 77 L90 87 C80 92 70 93 60 93 C48 93 38 91 30 86 Z" class="pt-i2"/>') + "</svg>";
    }
    h += '<div class="pt-fr">' + s + "<p><strong>" + fr[0] + "</strong>: " + fr[1] + "</p></div>";
  });
  return h + '</div><p class="tiny muted pt-clipnote">' + c.note + "</p></figure>";
}

// ---------- Explore: Table builder ----------
function explore(host, api){
  var S = api.S, C = api.content, deck = C.deck;
  if (["build", "mend", "fam"].indexOf(S.mode) < 0) S.mode = "build";
  if (["blocks", "metal", "val"].indexOf(S.layer) < 0) S.layer = "blocks";
  if (["all", "s", "p", "d", "f"].indexOf(S.view) < 0) S.view = "all";
  S.sel = +S.sel >= 1 && +S.sel <= 118 ? +S.sel : 0;
  if (!S.placed || typeof S.placed !== "object") S.placed = {};
  if (!deck.some(function(c){ return c.id === S.card; })) S.card = "";
  if (!Array.isArray(S.hist)) S.hist = [];
  if (!S.mg || typeof S.mg !== "object") S.mg = {};
  var mg = S.mg; if (!Array.isArray(mg.pick)) mg.pick = []; mg.prop = mg.prop === "dens" ? "dens" : "mass"; mg.gap = !!mg.gap;
  if (typeof S.fam !== "string") S.fam = "";
  var busy = false, run = 0, msg = "", flashZ = 0, litD = false, mhl = [], mlit = [];

  host.innerHTML = '<p class="how">' + C.how + '</p><div class="pt-top"><div class="pt-modes"></div><div class="pt-layer"></div></div>' +
    '<div class="pt-deckbox" data-for="build"><p class="rg-lab">Configuration cards</p><div class="pt-deck" role="group" aria-label="Configuration cards"></div></div>' +
    '<div class="pt-mtool" data-for="mend"><p class="pt-steps">' + C.mend.steps + '</p><div class="pt-prop"></div><div class="pt-mbtns"></div><div class="pt-mout" aria-live="polite"></div></div>' +
    '<div data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="pt-box pt-modern"><div class="pt-viewrow"></div><div class="pt-scroll"><div class="pt-ptab"></div></div><p class="tiny muted pt-swipe">Swipe sideways to see the whole table, or show one block.</p><div class="pt-legend" aria-hidden="true"></div></div>' +
    '<div class="pt-box pt-mend"><div class="pt-scroll"><div class="pt-mtab"></div></div><p class="tiny muted pt-mnote">' + C.mend.note + " † a gap in 1871, filled later.</p></div>" +
    '<div class="pt-cap" aria-live="polite"></div>' +
    '<div class="pt-below"><dl class="read pt-read" aria-live="polite"></dl><div class="pt-side" aria-live="polite"></div></div></div>';
  var capEl = $(".pt-cap", host), read = $(".pt-read", host), side = $(".pt-side", host);

  var RG = {};
  RG.mode = radios($(".pt-modes", host), { label:"Mode", aria:"Table builder mode", options:C.modes, value:S.mode, onChange:function(v){ S.mode = v; msg = ""; mhl = []; mlit = []; litD = false; flashZ = 0; api.save(); paint(); } });
  RG.layer = radios($(".pt-layer", host), { label:"Layer", aria:"Table layer", options:C.layers, value:S.layer, onChange:function(v){ S.layer = v; api.save(); PT.paint(); paintLegend(); } });
  RG.view = radios($(".pt-viewrow", host), { label:"One block", aria:"Show the whole table or one block", cls:"chips", options:[{ id:"all", t:"Whole table" }, { id:"s", t:"s" }, { id:"p", t:"p" }, { id:"d", t:"d" }, { id:"f", t:"f" }], value:S.view, onChange:function(v){ S.view = v; api.save(); PT.paint(); } });
  RG.prop = radios($(".pt-prop", host), { label:"Average", aria:"Property to average", cls:"chips", options:[{ id:"mass", t:"Atomic mass (g/mol)" }, { id:"dens", t:"Density (g/cm³)" }], value:mg.prop, onChange:function(v){ mg.prop = v; mg.pick = mg.pick.filter(function(s){ return val(s) != null; }); mg.avg = null; api.save(); paintMend(); MV.changed(); } });

  var PT = ptable($(".pt-ptab", host), {
    sel:function(){ return S.sel; }, layer:function(){ return S.layer; }, view:function(){ return S.view; }, locked:function(){ return busy; },
    aria:"Periodic table: tap an element",
    cls:function(z){
      var c = "";
      if (S.mode === "build" && deck.some(function(d){ return S.placed[d.id] && +MV.ans(d) === z; })) c += " placed";
      if (z === flashZ) c += " flash";
      if (litD && blockOf(z) === "d") c += " flash";
      if (S.mode === "fam" && S.fam && famKey(group(z)) === S.fam && group(z) && z !== 1) c += " fam";
      return c;
    },
    mark:function(z){ return S.mode === "build" && deck.some(function(d){ return S.placed[d.id] && +MV.ans(d) === z; }) ? '<span class="pt-ck">✓ card</span>' : ""; },
    groupBtns:function(){ return S.mode === "fam"; }, gOn:function(g){ return famKey(g) === S.fam; },
    pickG:function(g){ if (busy) return; S.fam = famKey(g); api.save(); paint(); },
    pick:function(z){ if (!busy) pickZ(z); }
  });
  if (NARROW.addEventListener) NARROW.addEventListener("change", function(){ PT.paint(); });

  function pickZ(z){
    flashZ = 0;
    if (S.mode === "build" && S.card && !S.placed[S.card]) { place(S.card, z); return; }
    S.sel = z; S.hist.push(z); if (S.hist.length > 8) S.hist.shift(); msg = "";
    api.save(); paint();
  }
  function cardOf(id){ return deck.filter(function(c){ return c.id === id; })[0]; }
  function wrongMsg(c, z){
    var a = +MV.ans(c);
    if (c.id === "c1" && period(z) === 5) return C.wrongP1;
    if (c.id === "c4" && blockOf(z) === "p") return C.wrongFe;
    if (period(z) !== period(a)) return "Period = the highest " + "<em>n</em>. Find the highest shell number in " + c.cfg + ".";
    if (blockOf(z) !== blockOf(a)) return "The block is the subshell being filled: look at the last subshell in " + c.cfg + ".";
    return "Right period and block. Now the group: count the valence electrons" + (blockOf(a) === "d" ? " (the outer s electrons plus the d electrons)." : ".");
  }
  function place(id, z){
    var c = cardOf(id), a = +MV.ans(c);
    S.sel = z; S.hist.push(z); if (S.hist.length > 8) S.hist.shift();
    if (z === a) {
      S.placed[id] = true; S.card = ""; S.lastWrong = null; flashZ = z;
      msg = MV.fbHTML("good", "<strong>✓ " + c.cfg + " is " + NAME[z] + " (Z = " + z + ").</strong> Period " + period(z) + ", group " + group(z) + ", " + blockOf(z) + " block.");
    } else {
      S.lastWrong = { c:id, z:z };
      msg = MV.fbHTML("bad", "<strong>✗ Not " + SYM[z] + ".</strong> " + wrongMsg(c, z));
    }
    api.save(); paint(); MV.focusFb(capEl);
  }

  // ----- painting -----
  function paintTop(){
    RG.mode.lock(busy); RG.layer.lock(busy); RG.view.lock(busy); RG.prop.lock(busy);
    $$("[data-for]", host).forEach(function(x){ x.hidden = x.dataset.for !== S.mode; });
    $(".pt-layer", host).hidden = S.mode === "mend";
    $(".pt-modern", host).hidden = S.mode === "mend";
    $(".pt-mend", host).hidden = S.mode !== "mend";
  }
  function paintDeck(){
    MV.keepFocus($(".pt-deck", host), function(){
      $(".pt-deck", host).innerHTML = deck.map(function(c){
        var pl = !!S.placed[c.id], on = S.card === c.id;
        return '<button type="button" class="pt-card' + (on ? " on" : "") + (pl ? " done" : "") + '" data-card="' + c.id + '" data-k="cd' + c.id + '" aria-pressed="' + on + '"' + (busy || pl ? " disabled" : "") + ">" + c.cfg + (pl ? '<span class="pt-cardok">✓ ' + SYM[+MV.ans(c)] + "</span>" : "") + "</button>";
      }).join("");
    });
  }
  function paintLegend(){
    var L = $(".pt-legend", host);
    if (S.layer === "blocks") L.innerHTML = ["s", "p", "d", "f"].map(function(b){ return '<span class="b-' + b + '"><i class="pt-sw"></i>' + b + " block</span>"; }).join("");
    else if (S.layer === "metal") L.innerHTML = '<span><i class="pt-sw t-metal"></i>metal (diagonal lines)</span><span><i class="pt-sw t-metalloid"></i>metalloid (dots)</span><span><i class="pt-sw t-nonmetal"></i>nonmetal (plain)</span><span><i class="pt-sw t-synthetic"></i>synthetic (unknown)</span>';
    else L.innerHTML = "<span>Number = valence electrons (s and p blocks)</span>";
  }
  function paintRead(){
    if (S.mode === "mend") { read.innerHTML = MV.readoutHTML(mendRows()); return; }
    read.innerHTML = S.sel ? MV.readoutHTML(readRows(S.sel)) : MV.readoutHTML([["Element", '<span class="muted">Tap any element to read it.</span>']]);
  }
  function paintSide(){
    var h = "";
    if (S.mode === "fam") {
      var F = S.fam ? C.families[S.fam] : null;
      h = F ? '<div class="pt-famcard"><h4>' + F.name + '</h4><dl class="read">' + MV.readoutHTML([["Valence configuration", F.cfg], ["Common ion", F.ion], ["Typical properties", F.props]]) + "</dl>" + (F.clip ? clipHTML(F.clip, C) : "") + "</div>"
        : '<p class="muted">Tap a group number above the table to see its family card.</p>';
    } else if (S.mode === "mend") {
      if (mg.commit) {
        var G = C.mend.ge;
        h = '<div class="pt-famcard"><h4>Mendeleev predicted…</h4><p>Your neighbour average: <strong>' + avgText(mg.commit) + "</strong>.</p>" +
          '<div class="pt-tw"><table class="pt-getab"><caption>' + G.title + "</caption><thead><tr>" + G.head.map(function(x){ return '<th scope="col">' + x + "</th>"; }).join("") + "</tr></thead><tbody>" +
          G.rows.map(function(r){ return '<tr><th scope="row">' + r[0] + "</th><td>" + r[1] + "</td><td>" + r[2] + "</td></tr>"; }).join("") + "</tbody></table></div><p>" + G.after + "</p></div>";
      } else h = '<p class="muted">Average the gap’s neighbours, then press <strong>Commit my prediction</strong> to see what Mendeleev predicted.</p>';
    } else {
      var n = deck.filter(function(c){ return S.placed[c.id]; }).length;
      h = '<p class="pt-prog"><strong>' + n + " of " + deck.length + "</strong> cards placed." + (S.card ? " Selected card: " + cardOf(S.card).cfg + ". Tap its cell." : " Tap a card, then tap its cell.") + "</p>";
    }
    MV.keepFocus(side, function(){ side.innerHTML = h; });
  }
  function paintCap(){ capEl.innerHTML = msg || ""; }
  function paint(){
    paintTop();
    if (S.mode === "build") paintDeck();
    if (S.mode === "mend") paintMend(); else { PT.paint(); paintLegend(); }
    paintRead(); paintSide(); paintCap();
    MV.changed();
  }

  // ----- build deck -----
  $(".pt-deck", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-card]"); if (!b || b.disabled || busy) return;
    S.card = S.card === b.dataset.card ? "" : b.dataset.card; msg = ""; api.save(); paintDeck(); paintSide(); paintCap();
  });

  // ----- Mendeleev mode -----
  function val(s){ return mg.prop === "dens" ? (DENS[s] != null ? DENS[s] : null) : (MASS[s] != null ? MASS[s] : null); }
  function unit(p){ return p === "dens" ? " g/cm³" : " g/mol"; }
  function avgText(a){ return numTxt(a.val) + unit(a.prop) + " (" + (a.prop === "dens" ? "density" : "atomic mass") + " of " + a.els.join(", ") + ")"; }
  function mendRows(){
    if (mg.gap) return [["Selected", "the gap: eka-silicon (unknown in 1871)"], ["Neighbours chosen", mg.pick.length ? mg.pick.join(", ") : '<span class="muted">none yet: tap two or four</span>'],
      ["Average", mg.avg ? numTxt(mg.avg.val) + unit(mg.avg.prop) : '<span class="muted">press Average</span>']];
    var s = mg.sel; if (!s) return [["Element", '<span class="muted">Tap an element, or the gap (?).</span>']];
    var col = "", row = "";
    C.mend.rows.forEach(function(r){ var i = r.els.indexOf(s); if (i >= 0) { col = C.mend.cols[i]; row = r.n; } });
    return [["Element", NAME[BYSYM[s]] + " (" + s + ")"], ["Atomic mass", MASS[s] != null ? numTxt(MASS[s]) + " g/mol" : "—"], ["Density", DENS[s] != null ? numTxt(DENS[s]) + " g/cm³" : "—"], ["Mendeleev’s group, series", col + ", series " + row]];
  }
  function paintMend(){
    var M = C.mend, lock = busy, h = '<div class="pt-mt" role="group" aria-label="1871-style table ordered by atomic mass, groups I to VII"><div class="pt-mr pt-mhd"><span class="pt-ml">Series</span>' + M.cols.map(function(c){ return '<span class="pt-mg">' + c + "</span>"; }).join("") + "</div>";
    M.rows.forEach(function(r, ri){
      if (r.n === "11") h += '<div class="pt-mr pt-mdots" aria-hidden="true"><span class="pt-ml">⋮</span></div>';
      h += '<div class="pt-mr"><span class="pt-ml">' + r.n + "</span>";
      r.els.forEach(function(s, ci){
        if (!s) { h += '<span class="pt-mgap" aria-hidden="true"></span>'; return; }
        if (s === "?") {
          h += '<button type="button" class="pt-mc gap' + (mg.gap ? " on" : "") + '" data-m="?" data-mr="' + ri + '" data-mc="' + ci + '" aria-pressed="' + mg.gap + '" aria-label="' + esc("The gap: eka-silicon" + (mg.avg ? ", predicted " + MV.plain(numTxt(mg.avg.val)) + unit(mg.avg.prop) : "")) + '"' + (lock ? " disabled" : "") + '><b>?</b><small>' + (mg.avg ? "≈ " + numTxt(mg.avg.val) : "eka-silicon") + "</small></button>";
          return;
        }
        var v = val(s), on = mg.pick.indexOf(s) >= 0, cl = "pt-mc" + (on ? " pick" : "") + (mhl.indexOf(s) >= 0 ? " hl" : "") + (mlit.indexOf(s) >= 0 ? " lit" : "") + (mg.sel === s && !mg.gap ? " sel" : "");
        h += '<button type="button" class="' + cl + '" data-m="' + s + '" data-mr="' + ri + '" data-mc="' + ci + '" aria-label="' + esc(cap1(NAME[BYSYM[s]]) + ", " + (v != null ? v + unit(mg.prop) : "no " + (mg.prop === "dens" ? "density" : "mass") + " value") + (on ? ", chosen" : "") + (M.later[s] ? ", " + M.later[s] : "")) + '"' + (mg.gap ? ' aria-pressed="' + on + '"' : "") + (lock ? " disabled" : "") + "><b>" + s + (M.later[s] ? "<sup>†</sup>" : "") + "</b><small>" + (v != null ? numTxt(v) : "—") + "</small></button>";
      });
      h += "</div>";
    });
    MV.keepFocus($(".pt-mtab", host), function(){ $(".pt-mtab", host).innerHTML = h + "</div>"; });
    var canAvg = mg.gap && (mg.pick.length === 2 || mg.pick.length === 4);
    MV.keepFocus($(".pt-mbtns", host), function(){
      $(".pt-mbtns", host).innerHTML = '<button type="button" class="btn primary sm" data-mb="avg" data-k="mbavg"' + (lock || !canAvg ? " disabled" : "") + ">Average</button>" +
        '<button type="button" class="btn ghost sm" data-mb="commit" data-k="mbcom"' + (lock || !mg.avg ? " disabled" : "") + ">Commit my prediction</button>" +
        '<button type="button" class="btn ghost sm" data-mb="clear" data-k="mbclr"' + (lock || (!mg.gap && !mg.pick.length) ? " disabled" : "") + ">Clear</button>";
    });
    var o = "";
    if (mg.avg) o = "<p class=\"pt-avg\">(" + mg.avg.els.map(function(s){ return numTxt(s === "?" ? 0 : (mg.avg.prop === "dens" ? DENS[s] : MASS[s])); }).join(" + ") + ") ÷ " + mg.avg.els.length + " = <strong>" + numTxt(mg.avg.val) + "</strong>" + unit(mg.avg.prop) + "</p>";
    else if (mg.gap) o = '<p class="muted">Gap selected. Chosen: ' + (mg.pick.length ? mg.pick.join(", ") : "none") + ". Tap two or four neighbours.</p>";
    $(".pt-mout", host).innerHTML = o;
  }
  $(".pt-mtab", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-m]"); if (!b || b.disabled || busy) return;
    var s = b.dataset.m; msg = "";
    if (s === "?") { mg.gap = !mg.gap; mg.pick = []; mg.avg = null; }
    else if (mg.gap) {
      var i = mg.pick.indexOf(s);
      if (i >= 0) mg.pick.splice(i, 1);
      else if (val(s) == null) msg = MV.fbHTML("", "There’s no density value for " + s + " in this table. Choose another neighbour, or switch to atomic mass.");
      else if (mg.pick.length >= 4) msg = MV.fbHTML("", "Four neighbours at most. Tap a chosen element again to remove it.");
      else mg.pick.push(s);
      mg.avg = null; mg.sel = s;
    } else mg.sel = mg.sel === s ? "" : s;
    api.save(); paintMend(); paintRead(); paintSide(); paintCap(); MV.changed();
  });
  $(".pt-mbtns", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-mb]"); if (!b || b.disabled || busy) return;
    var a = b.dataset.mb; msg = "";
    if (a === "avg") { var sum = 0; mg.pick.forEach(function(s){ sum += val(s); }); mg.avg = { prop:mg.prop, els:mg.pick.slice(), val:r2(sum / mg.pick.length) }; }
    else if (a === "commit") { mg.commit = { prop:mg.avg.prop, els:mg.avg.els.slice(), val:mg.avg.val }; msg = MV.fbHTML("good", "<strong>Prediction committed.</strong> Compare it with Mendeleev’s below."); }
    else { mg.gap = false; mg.pick = []; mg.avg = null; }
    api.save(); paintMend(); paintRead(); paintSide(); paintCap(); MV.changed();
    if (a === "commit") MV.focusFb(capEl);
  });

  // ----- predictions -----
  function setup(mode){ run++; busy = true; msg = ""; flashZ = 0; litD = false; mhl = []; mlit = []; S.mode = mode; RG.mode.set(mode); }
  function fin(my, n, done){ if (my !== run) return; busy = false; msg = n ? "<p>" + n + "</p>" : ""; api.save(); paint(); MV.wait(150, done); }
  var hooks = {
    start:function(p){
      if (p.id === "p1") { setup("build"); S.layer = "blocks"; S.view = "all"; RG.layer.set("blocks"); RG.view.set("all"); S.card = "c6"; S.placed.c6 = false; S.sel = 0; }
      else if (p.id === "p2") { setup("mend"); mhl = ["Te", "I"]; mg.gap = false; mg.pick = []; mg.sel = ""; }
      else if (p.id === "p3") { setup("build"); S.layer = "blocks"; S.view = "all"; RG.layer.set("blocks"); RG.view.set("all"); S.card = ""; S.sel = 26; }
      else { setup("fam"); S.fam = ""; S.sel = 38; S.view = "all"; RG.view.set("all"); }
      api.save(); paint();
    },
    run:function(p, done){
      var my = run;
      MV.wait(700, function(){
        if (my !== run) return;
        if (p.id === "p1") { S.placed.c6 = true; S.card = ""; S.sel = 35; flashZ = 35; fin(my, "The card snaps into bromine’s cell: period 4, group 17, p block.", done); }
        else if (p.id === "p2") { mlit = ["Cl", "Br", "I"]; mg.sel = "I"; fin(my, "Iodine sits under Br and Cl in group VII, with the other halogens, even though tellurium is heavier.", done); }
        else if (p.id === "p3") { litD = true; fin(my, "The d block lights up: iron’s last subshell is 3d.", done); MV.wait(2600, function(){ if (my === run) { litD = false; PT.paint(); } }); }
        else { S.fam = "g2"; fin(my, "The group 2 card: every member loses its two outer s electrons, so strontium forms Sr<sup>2+</sup>.", done); }
      });
    }
  };

  // ----- challenges -----
  function chal(id){
    if (id === "tc1") {
      var need = ["c1", "c2", "c3", "c4", "c5"], n = need.filter(function(k){ return S.placed[k]; }).length;
      if (n === 5) return { ok:true };
      var w = S.lastWrong;
      if (w && w.c === "c1" && period(w.z) === 5 && !S.placed.c1) return { ok:false, msg:C.wrongP1 };
      if (w && w.c === "c4" && blockOf(w.z) === "p" && !S.placed.c4) return { ok:false, msg:C.wrongFe };
      if (S.mode !== "build" && !n) return { ok:false, msg:"Switch to Build mode and place the five cards." };
      return { ok:false, msg:n + " of the five cards placed. Still to place: " + need.filter(function(k){ return !S.placed[k]; }).map(function(k){ return cardOf(k).cfg; }).join(" · ") + "." };
    }
    if (id === "tc2") {
      var a = mg.avg;
      if (!a) return { ok:false, msg:S.mode === "mend" ? "Tap the gap, then two or four neighbours, then press Average." : "Switch to Mendeleev mode and use the neighbour-average tool." };
      if (a.prop !== "mass") return { ok:false, msg:"That averages density. Switch the property to atomic mass." };
      var set = a.els.slice().sort().join(",");
      if (set === "C,Pb") return { ok:false, msg:"Use the <em>nearest</em> neighbours, directly above, below and beside the gap." };
      var near = a.els.every(function(s){ return NEIGH.indexOf(s) >= 0; });
      if (!near) return { ok:false, msg:"Use the <em>nearest</em> neighbours, directly above, below and beside the gap." };
      if (a.val >= 70 && a.val <= 74) return { ok:true };
      return { ok:false, msg:"Your average is " + numTxt(a.val) + ". Pair elements on opposite sides of the gap: above with below, or left with right." };
    }
    if (id === "tc3") {
      var hst = S.hist, last = hst[hst.length - 1];
      if (!last) return { ok:false, msg:"Tap elements on the modern table (Build or Families mode) to select them." };
      if (last === 83 && hst.slice(0, -1).indexOf(15) >= 0) return { ok:true };
      var named = { 7:"N has 2 shells.", 33:"A metalloid in the group, but not the most metallic.", 51:"Further down there’s one more.", 16:"S forms 2−." };
      if (named[last]) return { ok:false, msg:named[last] };
      if (last === 15) return { ok:false, msg:"Phosphorus fits the clue card. Now find the element in its group with the most metallic character." };
      if (last === 83) return { ok:false, msg:"Bismuth is the most metallic member of group 15, but first find the clue-card element." };
      if (last === 115) return { ok:false, msg:"Moscovium is synthetic and short-lived, so its properties are barely known. Choose the most metallic member you could actually test." };
      return { ok:false, msg:cap1(NAME[last]) + " doesn’t fit the clue card: 3 occupied shells, a 3− ion, a solid nonmetal." };
    }
    return { ok:false };
  }

  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Predict an element ----------
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3, cards = s1.cards;
  if (!cards.some(function(c){ return c.id === S.card; })) S.card = "A";
  if (!S.picks || typeof S.picks !== "object") S.picks = {};
  if (!S.done || typeof S.done !== "object") S.done = {};
  if (!S.s3 || typeof S.s3 !== "object") S.s3 = {};
  function ord(key, n){ return MV.shuffle(Array.apply(null, Array(n)).map(function(_, i){ return i; }), MV.meta.id + "p3" + key); }
  host.innerHTML = '<h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="pt-p3tabs"></div><div class="pt-p3card"></div>' +
    '<div class="part"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="pt-p3data" aria-live="polite"></div></div>' +
    '<div class="part"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><div class="pt-tw"><table class="pt-getab"><thead><tr><th scope="col">Property</th><th scope="col">Predicted</th><th scope="col">Observed</th></tr></thead><tbody>' +
    s3.rows.map(function(r){ return '<tr><th scope="row">' + r[0] + "</th><td>" + r[1] + "</td><td>" + r[2] + "</td></tr>"; }).join("") + '</tbody></table></div><p class="use pt-use">' + s3.use + '</p><div class="pt-s3" data-q="q1"></div><div class="pt-s3" data-q="q2"></div></div>';
  var tabs = radios($(".pt-p3tabs", host), { label:"Card", aria:"Mystery card", cls:"chips", options:cards.map(function(c){ return { id:c.id, t:"Card " + c.id + (S.done[c.id] ? " ✓" : "") }; }), value:S.card, onChange:function(v){ S.card = v; api.save(); paintCard(); paintData(); } });
  function card(){ return cards.filter(function(c){ return c.id === S.card; })[0]; }
  function picks(c){ return S.picks[c.id] || (S.picks[c.id] = {}); }
  function paintCard(){
    var c = card(), P = picks(c), done = !!S.done[c.id], all = c.qs.every(function(q){ return P[q.id] != null; });
    var h = '<div class="pt-myst"><p class="pt-pos"><span class="tiny muted">Card ' + c.id + '</span><br><strong>' + c.pos + "</strong></p>";
    c.qs.forEach(function(q){
      h += '<div class="pt-qrow"><p class="pt-ql">' + q.label + '</p><div class="rg chips" role="radiogroup" aria-label="' + esc(q.label) + '">' + ord(c.id + q.id, q.options.length).map(function(k){
        var on = P[q.id] === k; return '<button type="button" role="radio" aria-checked="' + on + '" data-q="' + q.id + '" data-o="' + k + '" data-k="p3' + c.id + q.id + k + '"' + (done ? " disabled" : "") + ">" + q.options[k].t + "</button>";
      }).join("") + "</div></div>";
    });
    h += '<div class="q-actions">' + (done ? '<button type="button" class="btn ghost sm" data-p3="again" data-k="p3again">Predict again</button>' : '<button type="button" class="btn primary sm" data-p3="commit" data-k="p3commit"' + (all ? "" : " disabled") + ">Commit my predictions</button>") + "</div></div>";
    MV.keepFocus($(".pt-p3card", host), function(){ $(".pt-p3card", host).innerHTML = h; });
  }
  function paintData(){
    var c = card(), P = picks(c), out = $(".pt-p3data", host);
    if (!S.done[c.id]) { out.innerHTML = '<p class="muted">Commit your predictions for card ' + c.id + " to see the data.</p>"; return; }
    var n = 0, rows = c.qs.map(function(q){
      var k = P[q.id], ch = q.options[k], ok = MV.ok(ch), right = q.options.filter(function(o){ return MV.ok(o); })[0];
      if (ok) n++;
      return '<li class="' + (ok ? "pt-ok" : "pt-no") + '"><strong>' + (ok ? "✓ " : "✗ ") + q.label + ":</strong> you predicted " + ch.t + (ok ? "." : "; the data says " + right.t + ".") + " " + right.why + "</li>";
    });
    out.innerHTML = '<div class="pt-data"><p class="pt-dh"><strong>Card ' + c.id + " is " + c.name + " (" + c.el + ")</strong>: " + c.cfg + "; " + c.real + ".</p><ul class=\"pt-marks\">" + rows.join("") + "</ul>" +
      MV.fbHTML(n === c.qs.length ? "good" : "", "<strong>" + n + " of " + c.qs.length + " predictions matched the data.</strong>" + (n === c.qs.length ? " Mendeleev would be proud." : " Read the reasons, then try another card.")) + "</div>";
  }
  $(".pt-p3card", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var c = card();
    if (b.dataset.q) { picks(c)[b.dataset.q] = +b.dataset.o; api.save(); paintCard(); return; }
    if (b.dataset.p3 === "commit") { S.done[c.id] = true; api.save(); paintCard(); paintData(); retab(); MV.focusFb($(".pt-p3data", host)); }
    else if (b.dataset.p3 === "again") { S.done[c.id] = false; S.picks[c.id] = {}; api.save(); paintCard(); paintData(); retab(); }
  });
  $(".pt-p3card", host).addEventListener("keydown", function(e){
    var b = e.target.closest("[data-q]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var row = $$("[data-q]", b.parentNode), i = row.indexOf(b), t = row[(i + d + row.length) % row.length]; t.click(); var nb = $('[data-k="' + t.dataset.k + '"]', host); if (nb) nb.focus();
  });
  function retab(){ var h = $(".pt-p3tabs", host), nh = h.cloneNode(false); h.parentNode.replaceChild(nh, h);
    tabs = radios(nh, { label:"Card", aria:"Mystery card", cls:"chips", options:cards.map(function(c){ return { id:c.id, t:"Card " + c.id + (S.done[c.id] ? " ✓" : "") }; }), value:S.card, onChange:function(v){ S.card = v; api.save(); paintCard(); paintData(); } }); }
  // station 3
  function paintS3(key){
    var q = s3[key], box = $('.pt-s3[data-q="' + key + '"]', host), k = S.s3[key], o = ord("s3" + key, q.options.length);
    var h = '<p class="pt-ql">' + q.prompt + '</p><div class="rg chips" role="radiogroup" aria-label="' + esc(MV.plain(q.prompt)) + '">' + o.map(function(i){
      var on = k === i; return '<button type="button" role="radio" aria-checked="' + on + '" data-s3="' + i + '" data-k="s3' + key + i + '">' + q.options[i].t + "</button>"; }).join("") + "</div>";
    if (k != null) h += MV.fbHTML(MV.ok(q.options[k]) ? "good" : "bad", (MV.ok(q.options[k]) ? "<strong>✓ Right.</strong> " : "<strong>✗ Not quite.</strong> ") + q.options[k].why);
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  ["q1", "q2"].forEach(function(key){
    var box = $('.pt-s3[data-q="' + key + '"]', host);
    box.addEventListener("click", function(e){ var b = e.target.closest("[data-s3]"); if (!b) return; S.s3[key] = +b.dataset.s3; api.save(); paintS3(key); });
    paintS3(key);
  });
  paintCard(); paintData();
}

// ---------- Practice 2: Formula predictor (subscript chips; F6 is a chip choice) ----------
function formulaAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { x:0, y:0, pick:null, tries:0, hint:0, solved:false, first:null }); }
  function sub(n){ return n > 1 ? "<sub>" + n + "</sub>" : ""; }
  function formHTML(it, x){ return it.a + (x.x ? sub(x.x) : '<sub class="pt-qm">?</sub>') + it.b + (x.y ? sub(x.y) : '<sub class="pt-qm">?</sub>'); }
  function subRow(it, x, key, el){
    return '<div class="pt-subrow"><span class="pt-subl">Subscript on ' + el + '</span><span class="rg chips" role="radiogroup" aria-label="Subscript on ' + el + '">' + [1, 2, 3].map(function(n){
      var on = x[key] === n; return '<button type="button" role="radio" aria-checked="' + on + '" data-sb="' + key + '" data-n="' + n + '" data-k="' + it.id + key + n + '"' + (x.solved ? " disabled" : "") + ">" + n + (n === 1 ? " (none)" : "") + "</button>"; }).join("") + "</span></div>";
  }
  function itemHTML(it, i){
    var x = ist(it.id), h = '<div class="q" data-ri="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + (it.prompt || "Predict the formula of the compound of <strong>" + it.a + "</strong> and <strong>" + it.b + "</strong>.") + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "chips") {
      var o = MV.shuffle(it.options.map(function(_, k){ return k; }), MV.meta.id + it.id);
      h += '<div class="rg chips pt-fchips" role="radiogroup" aria-label="Formula">' + o.map(function(k){ var on = x.pick === k; return '<button type="button" role="radio" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "op" + k + '"' + (x.solved ? " disabled" : "") + ">" + it.options[k].t + "</button>"; }).join("") + "</div>";
    } else {
      h += '<p class="pt-form" aria-live="polite"><span class="vh">Your formula: </span>' + formHTML(it, x) + "</p>" + subRow(it, x, "x", it.a) + subRow(it, x, "y", it.b);
    }
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.kind === "chips" ? it.options[x.pick].why : "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = (a.how ? '<p class="how">' + a.how + "</p>" : "") + a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function judge(it, x){
    if (it.kind === "chips") { if (x.pick == null) return { bad:"Choose a formula first." }; return MV.ok(it.options[x.pick]) ? { ok:true } : { fb:it.options[x.pick].why }; }
    if (!x.x || !x.y) return { bad:"Choose a subscript for both elements." };
    var v = x.x + "," + x.y;
    if (v === String(MV.ans(it))) return { ok:true };
    if (x.x === x.y && x.x > 1) return { fb:"Use the lowest whole-number ratio: " + x.x + ":" + x.y + " is the same as 1:1. " + it.fb };
    var w = (it.wrong || []).filter(function(z){ return z.match === v; })[0];
    return { fb:w ? w.fb : it.fb };
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ri]"); if (!bx) return;
    var it = item(bx.dataset.ri), x = ist(it.id), d = b.dataset;
    if (d.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (d.sb) { x[d.sb] = +d.n; msgs[it.id] = null; api.save(); paint(); return; }
    if (d.op != null) { x.pick = +d.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (d.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = { t:r.bad, soft:true }; paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = { t:r.fb }; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ri="' + it.id + '"]'));
    }
  });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[role=radio]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var row = $$("[role=radio]", b.parentNode), i = row.indexOf(b), t = row[(i + d + row.length) % row.length]; t.click(); var nb = host.querySelector('[data-k="' + t.dataset.k + '"]'); if (nb) nb.focus();
  });
  paint();
  return {
    stats:function(){ var f = 0, dn = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) dn++; if (x.first) f++; }); return { first:f, total:a.items.length, done:dn, line:a.summary + " (first try): " + f + "/" + a.items.length + (dn < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Find the element (main-group table, periods 2–5) ----------
var task = (function(){
  var S = null, api = null, PER = [2, 3, 4, 5], GR = [1, 2, 13, 14, 15, 16, 17, 18];
  function read(){ return { z:S && +S.z ? +S.z : 0 }; }
  function paint(){
    var d = read(), pv = $("#pt-tkpv"); if (!pv) return;
    if (!d.z) { pv.innerHTML = '<p class="muted">Tap a cell to see its block, common ion, period and type.</p>'; return; }
    var z = d.z;
    pv.innerHTML = '<p class="pt-tkh"><strong>' + cap1(NAME[z]) + " (" + SYM[z] + ")</strong></p><dl class=\"read\">" + MV.readoutHTML([["Block", blockOf(z) + " block (group " + group(z) + ")"], ["Common ion", ionOf(z)], ["Period", String(period(z))], ["Type", typeOf(z)]]) + "</dl>";
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S;
      var ok = []; PER.forEach(function(p){ GR.forEach(function(g){ ok.push(zAt(p, g)); }); });
      if (ok.indexOf(+S.z) < 0) S.z = 0;
      inp.innerHTML = '<div class="pt-tgw"><div class="pt-thd" aria-hidden="true"><span></span>' + GR.map(function(g){ return "<span>" + g + "</span>"; }).join("") + '</div><div class="pt-tbody"><div class="pt-tpl" aria-hidden="true">' + PER.map(function(p){ return "<span>" + p + "</span>"; }).join("") + '</div><div class="pt-tg"></div></div></div>';
      radios($(".pt-tg", inp), { aria:"Main-group table, periods 2 to 5", cls:"chips pt-tgrid", options:ok.map(function(z){ return { id:String(z), t:SYM[z], aria:cap1(NAME[z]) + ", period " + period(z) + ", group " + group(z), cls:"b-" + blockOf(z) }; }), value:S.z ? String(S.z) : "", onChange:function(v){ S.z = +v; api.save(); paint(); api.update(); } });
      pv.innerHTML = '<h4 class="pt-h4">Element readout</h4><div class="pt-tkpv" id="pt-tkpv" aria-live="polite"></div>';
      paint();
    },
    read:read,
    valid:function(d){ return d.z ? true : "Tap a cell of the table first."; },
    checks:function(d){ if (!d.z) return [false, false, false, false]; var g = group(d.z), t = typeOf(d.z); return [g >= 13 && g <= 18, g === 16, period(d.z) >= 3, t === "nonmetal" || t === "metalloid"]; },
    key:function(d){ return SYM[d.z]; },
    label:function(k){ return k + " (" + NAME[BYSYM[k]] + ")"; },
    text:function(k){ return this.label(k); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ formula:formulaAct },
  task:task
});
})();
