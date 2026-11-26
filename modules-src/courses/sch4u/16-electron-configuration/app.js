// SCH4U 16 Electron Configuration: hero (an orbital-box energy ladder filling up to iron, then iron lights up on a mini
// periodic table), Orbital filler (Explore: C12 energy ladder of orbital boxes with Fill it yourself / Auto-fill / Ions
// modes, live rule flags, the aufbau diagonal and a C11 mini periodic table), Configurations and the table (Part 3: label
// the blocks, read configurations backwards, family cards), "Build and predict" (number entry, chips and an N4
// configuration builder) and "Three unpaired, no 4s" (task with a live orbital diagram).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
function esc(s){ return MV.esc(s); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function cap1(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
var MINUS = "−";
var NARROW = window.matchMedia ? window.matchMedia("(max-width: 600px)") : { matches:false };

// ---------- element list (Z 1–56) ----------
// MV.chem.data has no element symbols or names, so they live here. Names use the IUPAC spellings the course uses
// (aluminium, sulfur, caesium). Only symbols, names and positions: no measured values.
var SYM = ("|H|He|Li|Be|B|C|N|O|F|Ne|Na|Mg|Al|Si|P|S|Cl|Ar|K|Ca|Sc|Ti|V|Cr|Mn|Fe|Co|Ni|Cu|Zn|Ga|Ge|As|Se|Br|Kr|" +
  "Rb|Sr|Y|Zr|Nb|Mo|Tc|Ru|Rh|Pd|Ag|Cd|In|Sn|Sb|Te|I|Xe|Cs|Ba").split("|");
var NAME = ("|hydrogen|helium|lithium|beryllium|boron|carbon|nitrogen|oxygen|fluorine|neon|sodium|magnesium|aluminium|silicon|" +
  "phosphorus|sulfur|chlorine|argon|potassium|calcium|scandium|titanium|vanadium|chromium|manganese|iron|cobalt|nickel|copper|" +
  "zinc|gallium|germanium|arsenic|selenium|bromine|krypton|rubidium|strontium|yttrium|zirconium|niobium|molybdenum|technetium|" +
  "ruthenium|rhodium|palladium|silver|cadmium|indium|tin|antimony|tellurium|iodine|xenon|caesium|barium").split("|");
var EXTRA = [37, 38, 47, 50, 53, 54, 55, 56];          // shorthand-practice elements beyond Z = 36 (plan: Explore)
function inFiller(z){ return (z >= 1 && z <= 36) || EXTRA.indexOf(z) >= 0; }
var PSTART = [0, 1, 3, 11, 19, 37, 55, 57];
function period(z){ for (var p = 1; p < 7; p++) if (z < PSTART[p + 1]) return p; return 6; }
function group(z){
  var p = period(z), i = z - PSTART[p];
  if (p === 1) return z === 1 ? 1 : 18;
  if (p <= 3) return i < 2 ? i + 1 : i + 11;
  return i + 1;
}
function zAt(p, g){ for (var z = PSTART[p]; z < PSTART[p + 1] && z <= 56; z++) if (group(z) === g) return z; return 0; }

// ---------- sublevels, cores, configurations ----------
var SUBS = ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p", "6s"].map(function(id){ var l = "spdf".indexOf(id.charAt(1)); return { id:id, n:+id.charAt(0), l:l, k:2 * l + 1, cap:4 * l + 2 }; });
var IX = {}; SUBS.forEach(function(s, i){ IX[s.id] = i; });
var CORES = [{ sym:"He", e:2, upto:1 }, { sym:"Ne", e:10, upto:3 }, { sym:"Ar", e:18, upto:5 }, { sym:"Kr", e:36, upto:8 }, { sym:"Xe", e:54, upto:11 }];
var EXC = { 24:{ from:"4s", to:"3d", why:"a half-filled 3d sublevel is especially stable" }, 29:{ from:"4s", to:"3d", why:"a filled 3d sublevel is especially stable" },
  47:{ from:"5s", to:"4d", why:"like copper above it, silver ends with a filled 4d sublevel" } };
var BLOCKC = { s:"--p-t", p:"--p-d", d:"--p-k", f:"--p-b" };     // block bands: s cerulean, p teal, d orange, f brown (plan §5)
function zeros(){ return SUBS.map(function(){ return 0; }); }
function total(o){ return o.reduce(function(a, b){ return a + b; }, 0); }
function aufbauOcc(e){ var o = zeros(), left = e; for (var i = 0; i < SUBS.length && left > 0; i++) { o[i] = Math.min(SUBS[i].cap, left); left -= o[i]; } return o; }
function ground(z){ var o = aufbauOcc(z), x = EXC[z]; if (x) { o[IX[x.from]]--; o[IX[x.to]]++; } return o; }
// ions: cations lose electrons from the highest n first (then the highest l), so 4s goes before 3d; anions add by aufbau
function ionOcc(z, q){
  var o = ground(z), i, b;
  for (var t = 0; t < Math.abs(q); t++) {
    if (q > 0) { b = -1; for (i = 0; i < SUBS.length; i++) if (o[i] > 0 && (b < 0 || SUBS[i].n > SUBS[b].n || (SUBS[i].n === SUBS[b].n && SUBS[i].l > SUBS[b].l))) b = i; if (b >= 0) o[b]--; }
    else { for (i = 0; i < SUBS.length; i++) if (o[i] < SUBS[i].cap) { o[i]++; break; } }
  }
  return o;
}
function lastIdx(o){ for (var i = o.length - 1; i >= 0; i--) if (o[i] > 0) return i; return -1; }
function blockOf(z){ return "spdf".charAt(SUBS[lastIdx(aufbauOcc(z))].l); }
function coreFor(o, atomZ){
  var e = total(o), best = null;
  CORES.forEach(function(c){
    var full = true; for (var i = 0; i < c.upto; i++) if (o[i] !== SUBS[i].cap) full = false;
    if (full && (atomZ ? c.e < e : c.e <= e)) best = c;
  });
  return best;
}
function supN(n){ return "<sup>" + n + "</sup>"; }
// configuration as HTML; short = noble-gas shorthand; atom = true for a neutral atom (core = the noble gas before it)
function cfgHTML(o, short, atom){
  var c = short ? coreFor(o, atom) : null, parts = c ? ["[" + c.sym + "]"] : [];
  for (var i = c ? c.upto : 0; i < SUBS.length; i++) if (o[i] > 0) parts.push(SUBS[i].id + supN(o[i]));
  return parts.length ? parts.join(" ") : "no electrons";
}
function ionHTML(z, q){ if (!q) return SYM[z]; var a = Math.abs(q); return SYM[z] + "<sup>" + (a > 1 ? a : "") + (q > 0 ? "+" : MINUS) + "</sup>"; }
function sameOcc(a, b){ for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false; return true; }
// orbital boxes: Hund filling (one ↑ per box, then ↓ pairs) -> [[spins], …]
function hundBoxes(s, c){ var out = []; for (var j = 0; j < s.k; j++) { var b = []; if (j < Math.min(c, s.k)) b.push(1); if (j < c - s.k) b.push(-1); out.push(b); } return out; }
function boxesFromOcc(o){ return SUBS.map(function(s, i){ return hundBoxes(s, o[i]); }); }
function unpairedOf(boxes){ var u = 0; boxes.forEach(function(row){ row.forEach(function(b){ var up = b.filter(function(x){ return x > 0; }).length; u += Math.abs(up - (b.length - up)); }); }); return u; }
// where the c-th electron of a sublevel goes (Hund order)
function slotOf(s, c){ return c <= s.k ? { b:c - 1, sp:1 } : { b:c - s.k - 1, sp:-1 }; }
function valenceHTML(z){
  var o = ground(z), n = SUBS[lastIdx(o)].n, parts = [], v = 0;
  SUBS.forEach(function(s, i){ if (s.n === n && s.l < 2 && o[i]) { parts.push(s.id + supN(o[i])); v += o[i]; } });
  return v + ": " + parts.join(" ");
}

// ---------- rule check for a hand-filled diagram (state based) ----------
// list = [[subIdx, box, spin], …] in placement order (outer electrons only when a core is preset); base = preset core electrons
function fillBoxes(list, coreUpto){
  var bx = SUBS.map(function(s){ var r = []; for (var j = 0; j < s.k; j++) r.push([]); return r; });
  for (var i = 0; i < coreUpto; i++) bx[i] = hundBoxes(SUBS[i], SUBS[i].cap);
  list.forEach(function(e){ bx[e[0]][e[1]].push(e[2]); });
  return bx;
}
function occOfBoxes(bx){ return bx.map(function(r){ return r.reduce(function(a, b){ return a + b.length; }, 0); }); }
function lastIn(list, test){ for (var k = list.length - 1; k >= 0; k--) if (test(list[k])) return k; return -1; }
function checkRules(list, z, coreUpto, base){
  var bx = fillBoxes(list, coreUpto), o = occOfBoxes(bx), R = { pauli:null, hund:null, aufbau:null }, i, j;
  for (i = 0; i < SUBS.length && !R.pauli; i++) for (j = 0; j < SUBS[i].k; j++) {
    var b = bx[i][j];
    if (b.length > 2 || (b.length === 2 && b[0] === b[1])) { var ii = i, jj = j; R.pauli = { el:base + 1 + lastIn(list, function(e){ return e[0] === ii && e[1] === jj; }), sub:SUBS[i].id }; break; }
  }
  for (i = 0; i < SUBS.length && !R.hund; i++) {
    if (SUBS[i].k < 2 || !o[i]) continue;
    var empty = bx[i].some(function(b){ return !b.length; }), dbl = bx[i].some(function(b){ return b.length >= 2; });
    var singles = bx[i].filter(function(b){ return b.length === 1; }).map(function(b){ return b[0]; });
    var mixed = singles.some(function(s){ return s !== singles[0]; });
    if ((empty && dbl) || mixed) { var i2 = i; R.hund = { el:base + 1 + lastIn(list, function(e){ return e[0] === i2; }), sub:SUBS[i].id, paired:empty && dbl }; }
  }
  var x = EXC[z];
  for (j = 0; j < SUBS.length && !R.aufbau; j++) {
    if (o[j] >= SUBS[j].cap) continue;
    for (i = j + 1; i < SUBS.length; i++) {
      if (!o[i]) continue;
      if (x && SUBS[j].id === x.from && SUBS[i].id === x.to && o[j] === 1) continue;     // the Cr / Cu (Ag) exception
      var i3 = i; R.aufbau = { el:base + 1 + lastIn(list, function(e){ return e[0] === i3; }), lo:SUBS[j].id, hi:SUBS[i].id }; break;
    }
  }
  return { R:R, bx:bx, o:o };
}

// @component radioGroup (from MHF4U 25, via SCH4U 01–13) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock); with no option chosen yet, the first option holds the tab stop.
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange(id), disabled}) -> {set(id), get(), lock(bool), paint()}
function radios(host, o){
  var val = o.value == null ? "" : String(o.value), locked = false;
  function off(id){ return o.disabled ? o.disabled(id) : ""; }
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), first = true;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val, d = locked || !!off(x.id), tab = on || (!any && first && !d); if (!d) first = false; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (tab ? 0 : -1) + '" data-rg="' + esc(x.id) + '"' + (x.aria ? ' aria-label="' + esc(x.aria) + '"' : "") + (d ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
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

// @component C11 periodicTable (miniTable) — HTML periodic table, periods 1–maxP (Z ≤ 56), block colour bands (s cerulean,
// p teal, d orange), the selected element's square with its period row and group column outlined, roving-tabindex arrow
// keys (left/right by Z, up/down within a group), optional collapse to one period.
// ptable(host, {maxP, active(z), sel(), pick(z), hi(z) -> extra class, collapse() -> bool, locked() -> bool, aria}) -> {paint(), focusSel()}
function ptable(host, o){
  var fz = 0;
  function paint(){
    var sel = o.sel ? o.sel() : 0, f = host.contains(document.activeElement), col = o.collapse && o.collapse() && sel ? period(sel) : 0, lock = o.locked && o.locked();
    if (sel && o.active(sel) && !f) fz = sel;
    if (!fz || !o.active(fz)) fz = sel || 1;
    var g0 = sel ? group(sel) : 0, p0 = sel ? period(sel) : 0, h = '<div class="ec-pt" role="group" aria-label="' + esc(o.aria || "Periodic table") + '">';
    if (o.bands) h += '<div class="ec-pt-row ec-pt-bk" aria-hidden="true"><span></span><span class="ec-bk b-s" style="grid-column:2 / 4">s block</span><span class="ec-bk b-d" style="grid-column:4 / 14">d block</span><span class="ec-bk b-p" style="grid-column:14 / 20">p block</span></div>';
    h += '<div class="ec-pt-row ec-pt-hd" aria-hidden="true"><span class="ec-pt-pl"></span>' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(function(g){ return '<span class="ec-pt-g' + (g === g0 ? " on" : "") + '">' + g + "</span>"; }).join("") + "</div>";
    for (var p = 1; p <= o.maxP; p++) {
      if (col && p !== col) continue;
      h += '<div class="ec-pt-row' + (p === p0 ? " prow" : "") + '"><span class="ec-pt-pl" aria-hidden="true">' + p + "</span>";
      for (var g = 1; g <= 18; g++) {
        var z = zAt(p, g), gc = g === g0 ? " gcol" : "", ex = z && o.hi ? (o.hi(z) || "") : "";
        if (!z) { h += '<span class="ec-pt-gap' + gc + '" aria-hidden="true"></span>'; continue; }
        var bl = " b-" + blockOf(z) + (z === sel ? " sel" : "") + gc + (ex ? " " + ex : "");
        if (o.active(z)) h += '<button type="button" class="ec-pt-el' + bl + '" data-z="' + z + '" tabindex="' + (z === fz ? 0 : -1) + '" aria-label="' + esc(cap1(NAME[z]) + ", Z = " + z) + '"' + (z === sel ? ' aria-current="true"' : "") + (lock ? " disabled" : "") + ">" + SYM[z] + "</button>";
        else h += '<span class="ec-pt-el off' + bl + '" aria-hidden="true">' + SYM[z] + "</span>";
      }
      h += "</div>";
    }
    host.innerHTML = h + "</div>";
    if (f) focusZ(fz);
  }
  function focusZ(z){ var b = host.querySelector('[data-z="' + z + '"]'); if (b && !b.disabled) { $$("[data-z]", host).forEach(function(x){ x.tabIndex = -1; }); b.tabIndex = 0; b.focus({ preventScroll:true }); fz = z; } }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-z]"); if (!b || b.disabled) return; fz = +b.dataset.z; o.pick(fz); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-z]"); if (!b) return;
    var z = +b.dataset.z, t = 0, k;
    if (e.key === "ArrowRight") { for (k = z + 1; k <= 56; k++) if (host.querySelector('[data-z="' + k + '"]')) { t = k; break; } }
    else if (e.key === "ArrowLeft") { for (k = z - 1; k >= 1; k--) if (host.querySelector('[data-z="' + k + '"]')) { t = k; break; } }
    else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      var d = e.key === "ArrowUp" ? -1 : 1, g = group(z);
      for (var p = period(z) + d; p >= 1 && p <= 6; p += d) { var c = zAt(p, g); if (c && host.querySelector('[data-z="' + c + '"]')) { t = c; break; } }
    } else return;
    e.preventDefault(); if (t) focusZ(t);
  });
  paint();
  return { paint:paint, focusSel:function(){ focusZ(o.sel()); } };
}

// @component C12 orbitalLadder — energy ladder of orbital boxes (HTML). Rows from the highest energy down; each row is a
// sublevel label and its boxes (s 1, p 3, d 5), staggered by sublevel type; a wider gap below each ns row marks a new
// period. Arrows are violet ↑/↓; a preset noble-gas core is one bar. Boxes are buttons when interactive (Fill mode).
// ladderHTML({bx, rows:[subIdx…] (low → high), core:{sym, e}|null, act:bool, foc:"i:b", fresh:{"i:b":k}, gone:{"i:b":[spins]},
//             glow:{i:true}, pulse:{i:true}, cur:i, disabled:bool, compact:bool}) -> html
function arrowsHTML(spins, fresh, gone){
  var h = "";
  spins.forEach(function(s, k){ h += '<span class="ec-ar' + (fresh != null && k >= fresh ? " in" : "") + '">' + (s > 0 ? "↑" : "↓") + "</span>"; });
  (gone || []).forEach(function(s){ h += '<span class="ec-ar off" aria-hidden="true">' + (s > 0 ? "↑" : "↓") + "</span>"; });
  return h;
}
function boxAria(sub, j, spins){
  var t = sub.id + " box " + (j + 1) + ": ";
  if (!spins.length) return t + "empty";
  var u = spins.filter(function(x){ return x > 0; }).length, d = spins.length - u;
  if (spins.length === 1) return t + "one electron, spin " + (u ? "up" : "down");
  return t + spins.length + " electrons (" + u + " up, " + d + " down)";
}
function ladderHTML(v){
  var h = '<div class="ec-lad' + (v.compact ? " compact" : "") + '">';
  for (var r = v.rows.length - 1; r >= 0; r--) {
    var i = v.rows[r], s = SUBS[i], newPeriod = s.l === 0 && s.n > 1 && r > 0;
    h += '<div class="ec-row l-' + "spdf".charAt(s.l) + (newPeriod ? " npd" : "") + (v.glow && v.glow[i] ? " glow" : "") + (v.pulse && v.pulse[i] ? " pulse" : "") + (v.cur === i ? " cur" : "") + '" data-row="' + i + '">' +
      '<span class="ec-sl">' + s.id + '</span><span class="ec-bxs">';
    for (var j = 0; j < s.k; j++) {
      var sp = v.bx[i][j] || [], key = i + ":" + j, cls = "ec-bx" + (sp.length ? " full" : "") + (sp.length > 2 ? " over" : "");
      var inner = arrowsHTML(sp, v.fresh && v.fresh[key] != null ? v.fresh[key] : null, v.gone && v.gone[key]);
      if (v.act) h += '<button type="button" class="' + cls + '" data-i="' + i + '" data-b="' + j + '" data-k="bx' + key + '" tabindex="' + (v.foc === key ? 0 : -1) + '" aria-label="' + esc(boxAria(s, j, sp)) + '"' + (v.disabled ? " disabled" : "") + ">" + inner + "</button>";
      else h += '<span class="' + cls + '" role="img" aria-label="' + esc(boxAria(s, j, sp)) + '">' + inner + "</span>";
    }
    h += "</span></div>";
  }
  if (v.core) h += '<div class="ec-core"><span class="ec-sl">[' + v.core.sym + ']</span><span class="ec-corebar">core: ' + v.core.e + " electrons, every box full</span></div>";
  return h + "</div>";
}

// @component C12 aufbauDiagonal — the aufbau diagonal (1s … 7p) as SVG; full sublevels tinted, the current one highlighted.
var DG = (function(){
  var L = [], D = [];
  for (var n = 1; n <= 7; n++) for (var l = 0; l < 4 && l < n; l++) { if (n + l > 8) continue; L.push({ id:n + "spdf".charAt(l), n:n, l:l, x:28 + l * 46, y:20 + (n - 1) * 30 }); }
  for (var d = 1; d <= 8; d++) { var g = L.filter(function(q){ return q.n + q.l === d; }).sort(function(a, b){ return b.l - a.l; }); if (g.length) D.push(g); }
  return { L:L, D:D };
})();
function diagSVG(full, cur){
  var h = "";
  DG.D.forEach(function(g){
    var a = g[0], b = g[g.length - 1], x1 = a.x + 17, y1 = a.y - 13, x2 = b.x - 15, y2 = b.y + 13, ang = Math.atan2(y2 - y1, x2 - x1);
    h += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="var(--ink-2)" stroke-width="1.6" opacity=".8"/>';
    var hx = x2, hy = y2, s = 8;
    h += '<polygon points="' + r1(hx) + "," + r1(hy) + " " + r1(hx - s * Math.cos(ang - 0.45)) + "," + r1(hy - s * Math.sin(ang - 0.45)) + " " + r1(hx - s * Math.cos(ang + 0.45)) + "," + r1(hy - s * Math.sin(ang + 0.45)) + '" fill="var(--ink-2)" opacity=".8"/>';
  });
  DG.L.forEach(function(q){
    var on = q.id === cur, f = full[q.id];
    h += '<rect x="' + (q.x - 15) + '" y="' + (q.y - 11) + '" width="30" height="22" rx="6" fill="var(--sheet)"/>';
    if (on || f) h += '<rect x="' + (q.x - 15) + '" y="' + (q.y - 11) + '" width="30" height="22" rx="6" fill="' + (on ? "var(--hi)" : "var(--hi-soft)") + '"' + (on ? ' stroke="var(--hi-ink)" stroke-width="1.4"' : "") + "/>";
    h += '<text x="' + q.x + '" y="' + q.y + '" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="' + (on ? 700 : 400) + '" fill="' + (on ? "var(--hi-ink)" : "var(--ink)") + '">' + q.id + "</text>";
  });
  return h;
}

// ---------- hero: Fe fills up, then lights up on a mini table ----------
var HX = { s:58, p:124, d:236, w:26, h:23, pitch:29 };
var HY = { "1s":262, "2s":222, "2p":200, "3s":160, "3p":138, "4s":100, "3d":80, "4p":52 };
var HSEQ = (function(){ var out = [], o = zeros(); for (var e = 0; e < 26; e++) { var i = 0; while (o[i] >= SUBS[i].cap) i++; o[i]++; var sl = slotOf(SUBS[i], o[i]); out.push({ i:i, b:sl.b, sp:sl.sp, full:o[i] === SUBS[i].cap }); } return out; })();
var HLABEL = [["[", 0], ["A", 0], ["r", 0], ["]", 0], [" ", 0], ["4", 0], ["s", 0], ["2", 1], [" ", 0], ["3", 0], ["d", 0], ["6", 1]];
function hero(f){
  var svg = $("#ec-hx-svg"), ctr = $("#ec-hx-ctr"), rep = $("#ec-hx-replay"), cap = f.cap, run = 0;
  if (!svg) return;
  function bxX(s, b){ return (s.l === 0 ? HX.s : s.l === 1 ? HX.p : HX.d) + b * HX.pitch; }
  function draw(st){
    var h = "", n = Math.floor(st.e), u = st.e - n, bx = SUBS.slice(0, 8).map(function(s){ var r = []; for (var j = 0; j < s.k; j++) r.push([]); return r; }), done = {}, k;
    for (k = 0; k < Math.min(26, n + (u > 0 ? 1 : 0)); k++) bx[HSEQ[k].i][HSEQ[k].b].push({ sp:HSEQ[k].sp, k:k });
    for (k = 0; k < Math.min(26, n); k++) if (HSEQ[k].full) done[HSEQ[k].i] = k;
    h += '<line x1="16" y1="276" x2="16" y2="40" stroke="var(--ink-2)" stroke-width="1.6"/><polygon points="16,32 11,43 21,43" fill="var(--ink-2)"/>';
    h += '<text x="24" y="44" font-size="12" fill="var(--ink-2)" dominant-baseline="central">energy</text>';
    SUBS.slice(0, 8).forEach(function(s, i){
      var y = HY[s.id], x0 = bxX(s, 0), pt = st.pulse[i] || 0;
      if (pt > 0) h += '<rect x="' + (x0 - 5) + '" y="' + (y - HX.h / 2 - 5) + '" width="' + ((s.k - 1) * HX.pitch + HX.w + 10) + '" height="' + (HX.h + 10) + '" rx="7" fill="none" stroke="var(--hi)" stroke-width="4" opacity="' + r1(pt) + '"/>';
      h += '<text x="' + (x0 - 7) + '" y="' + y + '" text-anchor="end" dominant-baseline="central" font-size="13" fill="var(--ink-2)">' + s.id + "</text>";
      for (var j = 0; j < s.k; j++) {
        var x = bxX(s, j), list = bx[i][j];
        h += '<rect x="' + x + '" y="' + (y - HX.h / 2) + '" width="' + HX.w + '" height="' + HX.h + '" rx="3" fill="' + (list.length ? "var(--hi-soft)" : "var(--sheet)") + '" stroke="var(--ink-2)" stroke-width="1.4"/>';
        list.forEach(function(a){
          var dy = a.k === n ? -(1 - u) * 16 : 0, op = a.k === n ? Math.min(1, u * 2) : 1;
          h += '<text x="' + (x + (a.sp > 0 ? 8 : 18)) + '" y="' + r1(y + 1 + dy) + '" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="var(--e-pair)" opacity="' + r1(op) + '">' + (a.sp > 0 ? "↑" : "↓") + "</text>";
        });
      }
    });
    // typed label
    var lab = "", inSup = false;
    HLABEL.slice(0, st.t).forEach(function(c){
      var ch = c[0] === " " ? "&#160;" : c[0];
      if (c[1] && !inSup) { lab += '<tspan dy="-8" font-size="13">' + ch; inSup = true; }
      else if (!c[1] && inSup) { lab += '</tspan><tspan dy="8">' + ch + "</tspan>"; inSup = false; }
      else lab += ch;
    });
    if (inSup) lab += "</tspan>";
    h += '<text x="160" y="305" dominant-baseline="central" font-size="21" font-weight="700" fill="var(--ink)">' + lab + "</text>";
    // mini table, periods 1–4
    var tx0 = 40, ty0 = 326, cw = 20, ch = 17;
    for (var z = 1; z <= 36; z++) {
      var p = period(z), g = group(z), cx = tx0 + (g - 1) * cw, cy = ty0 + (p - 1) * ch, fe = z === 26 && st.lit > 0;
      h += '<rect x="' + cx + '" y="' + cy + '" width="' + (cw - 2) + '" height="' + (ch - 2) + '" rx="2" fill="var(' + BLOCKC[blockOf(z)] + ')" opacity="' + (fe ? 0 : 0.28) + '"/>';
      if (fe) h += '<rect x="' + (cx - 2) + '" y="' + (cy - 2) + '" width="' + (cw + 2) + '" height="' + (ch + 2) + '" rx="3" fill="var(--hi)" stroke="var(--ink)" stroke-width="2" opacity="' + r1(st.lit) + '"/><text x="' + (cx + cw / 2 - 1) + '" y="' + (cy + ch / 2 - 1) + '" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" fill="var(--hi-ink)" opacity="' + r1(st.lit) + '">Fe</text>';
    }
    if (st.lit > 0) h += '<rect x="' + (tx0 - 3) + '" y="' + (ty0 + 3 * ch - 3) + '" width="' + (18 * cw + 4) + '" height="' + (ch + 4) + '" rx="4" fill="none" stroke="var(--ink-2)" stroke-width="1.4" stroke-dasharray="4 3" opacity="' + r1(st.lit) + '"/>';
    h += '<text x="' + (tx0 - 8) + '" y="' + (ty0 + 3 * ch + ch / 2 - 1) + '" text-anchor="end" dominant-baseline="central" font-size="11" fill="var(--ink-2)">4</text>';
    svg.innerHTML = h;
  }
  function final(){ draw({ e:26, pulse:{}, t:HLABEL.length, lit:1 }); ctr.innerHTML = "Iron: " + cfgHTML(ground(26), true, true) + " · d block · period 4"; cap.textContent = "The last sublevel filled, 3d, names iron’s block."; rep.hidden = false; }
  function play(){
    var id = ++run; rep.hidden = true; cap.textContent = "";
    var st = { e:0, pulse:{}, t:0, lit:0 }, T = 26 * 150, fullAt = {};
    HSEQ.forEach(function(q, k){ if (q.full) fullAt[q.i] = (k + 1) / 26; });
    MV.tween({ dur:T, ease:function(t){ return t; }, step:function(t){
      if (id !== run) return;
      st.e = t * 26; var n = Math.min(26, Math.floor(st.e) + 1), q = HSEQ[n - 1];
      Object.keys(fullAt).forEach(function(i){ var dt = (t - fullAt[i]) * T; st.pulse[i] = dt >= 0 && dt < 520 ? 1 - dt / 520 : 0; });
      ctr.innerHTML = "Electron " + n + ": into " + SUBS[q.i].id + (q.sp > 0 ? ", spin up" : ", spin down");
      draw(st);
    }, done:function(){
      if (id !== run) return; st.e = 26; st.pulse = {}; draw(st);
      MV.tween({ dur:900, ease:function(t){ return t; }, step:function(t){ if (id !== run) return; st.t = Math.round(t * HLABEL.length); draw(st); }, done:function(){
        if (id !== run) return;
        MV.tween({ dur:500, step:function(t){ if (id !== run) return; st.lit = t; draw(st); }, done:function(){ if (id !== run) return; final(); } });
      } });
    } });
  }
  rep.addEventListener("click", play);
  if (MV.reduceMotion) final(); else play();
}

// ---------- Explore: Orbital filler ----------
function explore(host, api){
  var S = api.S, C = api.content;
  S.z = inFiller(+S.z) ? +S.z : 26;
  if (["fill", "auto", "ion"].indexOf(S.mode) < 0) S.mode = "auto";
  S.nota = S.nota === "short" ? "short" : "full";
  S.spin = S.spin === -1 ? -1 : 1;
  if (!S.fills || typeof S.fills !== "object") S.fills = {};
  S.q = clamp(Math.round(+S.q || 0), -3, 3);
  if (!Array.isArray(S.found3)) S.found3 = [];
  S.wide = !!S.wide;
  var busy = false, run = 0, gRun = 0, timer = null, note = "", fresh = null, gone = null, glow = null, pulse = null, foc = null, flash = 0, checkMsg = null;

  host.innerHTML = '<p class="how">' + C.how + '</p><div class="ec-top"><div class="ec-modes"></div><div class="ec-nota"></div></div>' +
    '<div class="ec-tbox"><div class="ec-thead"><span class="rg-lab">Element</span><button type="button" class="btn ghost sm ec-wide" data-k="ecwide"></button></div><div class="ec-ptab"></div><p class="tiny muted ec-swipe">Swipe sideways to see the whole row.</p><div class="ec-zsl"></div></div>' +
    '<div class="ec-view" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p><div class="ec-grid"><div class="ec-left">' +
    '<div class="ec-ladbox"><div class="ec-ladder" role="group" aria-label="Energy ladder of orbital boxes, highest energy at the top"></div></div>' +
    '<div class="ec-ctrl"><div class="ec-c" data-for="fill"><div class="ec-spin"></div><div class="ec-fbtns"></div></div><div class="ec-c" data-for="auto"></div><div class="ec-c" data-for="ion"></div></div>' +
    '<div class="ec-cap" aria-live="polite"></div></div>' +
    '<div class="ec-right"><figure class="ec-dg"><svg class="ec-dsvg" viewBox="0 0 190 222" role="img" aria-label=""></svg><figcaption>Aufbau order: follow each arrow, top to bottom.</figcaption></figure>' +
    '<dl class="read ec-read" aria-live="polite"></dl></div></div></div>';
  var ladder = $(".ec-ladder", host), read = $(".ec-read", host), capEl = $(".ec-cap", host), dsvg = $(".ec-dsvg", host);

  // ----- element choice: table + Z slider -----
  var PT = ptable($(".ec-ptab", host), { maxP:6, active:inFiller, sel:function(){ return S.z; }, pick:function(z){ if (!busy) pickZ(z); },
    hi:function(z){ return z === S.z && flash ? "flash" : ""; }, collapse:function(){ return NARROW.matches && !S.wide; }, locked:function(){ return busy; }, aria:"Mini periodic table: tap an element", bands:true });
  var SL = MV.sliders($(".ec-zsl", host), [{ id:"ecz", label:"Atomic number Z", min:1, max:36, step:1, value:Math.min(36, S.z), fmt:function(v){ return "Z = " + v + " (" + SYM[v] + ")"; } }], function(id, v){ if (!busy) pickZ(v, true); });
  var zIn = $("#sl-ecz");
  function pickZ(z, fromSlider){
    cancel(); S.z = z; S.q = 0; S.step = null; checkMsg = null; note = ""; flash = 0; fresh = gone = glow = pulse = null; foc = null;
    if (!fromSlider && z <= 36) SL.set("ecz", z);
    api.save(); paint(); recordTC3();
  }
  $(".ec-wide", host).addEventListener("click", function(){ S.wide = !S.wide; api.save(); paintTable(); });
  if (NARROW.addEventListener) NARROW.addEventListener("change", function(){ paintTable(); });
  function paintTable(){ PT.paint(); var w = $(".ec-wide", host); w.hidden = !NARROW.matches; w.textContent = S.wide ? "Show one period" : "Show whole table"; }

  // ----- modes -----
  var RG = {};
  RG.mode = radios($(".ec-modes", host), { label:"Mode", aria:"Filler mode", options:C.modes, value:S.mode, onChange:function(v){ cancel(); S.mode = v; checkMsg = null; note = ""; fresh = gone = glow = pulse = null; api.save(); paint(); recordTC3(); } });
  RG.nota = radios($(".ec-nota", host), { label:"Notation", aria:"Configuration notation", options:[{ id:"full", t:"Full" }, { id:"short", t:"Noble-gas shorthand" }], value:S.nota, onChange:function(v){ S.nota = v; api.save(); paintRead(); } });
  RG.spin = radios($(".ec-spin", host), { label:"Next electron’s spin", aria:"Spin of the next electron", options:[{ id:"1", t:"↑", aria:"spin up" }, { id:"-1", t:"↓", aria:"spin down" }], value:String(S.spin), onChange:function(v){ S.spin = +v; api.save(); } });

  // ----- per-element helpers -----
  function heavy(){ return S.z > 36; }
  function coreUp(){ return S.z > 54 ? CORES[4] : S.z > 36 ? CORES[3] : null; }        // preset core for the shorthand elements
  function base(){ var c = coreUp(); return c ? c.e : 0; }
  function fillList(){ var L = S.fills[S.z]; if (!Array.isArray(L)) L = S.fills[S.z] = []; return L; }
  function target(){ return S.z - base(); }
  function steps(){ return { s0:base(), last:S.z + (EXC[S.z] ? 1 : 0) }; }
  function stepNow(){ var st = steps(); if (S.step == null || S.step < st.s0 || S.step > st.last) S.step = st.last; return S.step; }
  function autoOcc(k){ return k > S.z ? ground(S.z) : aufbauOcc(k); }
  function stateNow(){
    if (S.mode === "fill") { var c = coreUp(), r = checkRules(fillList(), S.z, c ? c.upto : 0, base()); return { bx:r.bx, o:r.o, R:r.R }; }
    if (S.mode === "auto") { var o = autoOcc(stepNow()); return { bx:boxesFromOcc(o), o:o }; }
    var oi = ionOcc(S.z, S.q); return { bx:boxesFromOcc(oi), o:oi };
  }
  function rowsFor(o){
    var cu = coreUp(), c = null;
    if (cu) CORES.forEach(function(k){ if (k.e < 36 || k.e > cu.e) return; for (var i = 0; i < k.upto; i++) if (o[i] !== SUBS[i].cap) return; c = k; });
    var from = c ? c.upto : 0, top = Math.max(lastIdx(o), cu ? (S.z > 54 ? IX["6s"] : IX["5p"]) : IX["4p"]), rows = [];
    for (var i = from; i <= top; i++) rows.push(i);
    return { rows:rows, core:c };
  }
  function curSub(st){
    if (S.mode === "fill") { var L = fillList(); return L.length ? SUBS[L[L.length - 1][0]].id : ""; }
    if (S.mode === "auto") { var k = stepNow(); if (k > S.z) return EXC[S.z].to; var o = aufbauOcc(k), li = lastIdx(o); return li >= 0 && k > steps().s0 ? SUBS[li].id : ""; }
    var g = lastIdx(st.o); return g >= 0 ? SUBS[g].id : "";
  }

  // ----- painting -----
  function paintLadder(){
    var st = stateNow(), rr = rowsFor(st.o), act = S.mode === "fill";
    if (act && (!foc || !rr.rows.some(function(i){ return +foc.split(":")[0] === i; }))) foc = defaultFoc(st);
    var hadFocus = ladder.contains(document.activeElement);
    ladder.innerHTML = ladderHTML({ bx:st.bx, rows:rr.rows, core:rr.core, act:act, foc:foc, fresh:fresh, gone:gone, glow:glow, pulse:pulse, cur:IX[curSub(st)], disabled:busy });
    if (hadFocus && act) { var b = ladder.querySelector('[data-k="bx' + foc + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
    var full = {}; SUBS.forEach(function(s, i){ if (st.o[i] >= s.cap) full[s.id] = true; });
    dsvg.innerHTML = diagSVG(full, curSub(st));
    dsvg.setAttribute("aria-label", "Aufbau diagonal: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d, 5p, 6s and so on. " + (curSub(st) ? "Current sublevel: " + curSub(st) + "." : ""));
  }
  function defaultFoc(st){ var c = coreUp(), i = c ? c.upto : 0; while (i < SUBS.length - 1 && st.o[i] >= SUBS[i].cap) i++; var n = st.o[i]; return i + ":" + (n < SUBS[i].k ? n : Math.min(SUBS[i].k - 1, n - SUBS[i].k)); }
  function rulesText(R){
    if (!R) return "Aufbau: followed · Pauli: followed · Hund: followed";
    function one(k, nm){ var x = R[k]; return nm + ": " + (x ? "<strong>broken</strong> (electron " + x.el + ", " + (k === "aufbau" ? "in " + x.hi : "in " + x.sub) + ")" : "followed"); }
    return one("aufbau", "Aufbau") + " · " + one("pauli", "Pauli") + " · " + one("hund", "Hund");
  }
  function flagLines(R){
    var out = [];
    if (!R) return out;
    if (R.aufbau) out.push(C.flags.aufbau.replace("{lo}", R.aufbau.lo).replace("{hi}", R.aufbau.hi));
    if (R.pauli) out.push(C.flags.pauli);
    if (R.hund) out.push(C.flags.hund.replace("{sub}", R.hund.sub));
    return out;
  }
  function paintRead(){
    var st = stateNow(), z = S.z, o = st.o, e = total(o), bl = blockOf(z), rows = [], un = unpairedOf(st.bx);
    var placed = S.mode === "fill" ? (base() + fillList().length) + " of " + z : S.mode === "auto" ? Math.min(z, stepNow()) + " of " + z : e + " of " + e + (S.q ? " (" + ionHTML(z, S.q) + ")" : "");
    rows.push(["Element", cap1(NAME[z]) + ", Z = " + z]);
    rows.push(["Electrons placed", placed]);
    rows.push(["Configuration", cfgHTML(o, S.nota === "short", S.mode !== "ion" || !S.q)]);
    rows.push(["Rules", rulesText(S.mode === "fill" ? st.R : null)]);
    rows.push(["Unpaired electrons", String(un)]);
    rows.push(["Magnetic behaviour", un ? "Paramagnetic (attracted to a magnet)" : "Diamagnetic (not attracted)"]);
    rows.push(["Position", bl + " block · period " + period(z) + " · group " + group(z)]);
    if (bl !== "d" && !(S.mode === "ion" && S.q)) rows.push(["Valence electrons", valenceHTML(z)]);
    if (S.mode === "ion" && S.found3.length) rows.push(["[Ar] 3d" + supN(5) + " ions found", S.found3.map(function(k){ var p = k.split("|"); return ionHTML(+p[0], +p[1]); }).join(", ")]);
    read.innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(){
    var st = stateNow(), h = "";
    if (S.mode === "fill") {
      var L = fillList(), t = target(), fl = flagLines(st.R);
      if (checkMsg) h = checkMsg;
      else if (fl.length) h = (note ? "<p>" + note + "</p>" : "") + MV.fbHTML("bad", fl.map(function(x){ return "<strong>⚠ " + x.split(":")[0] + ":</strong>" + x.slice(x.indexOf(":") + 1); }).join("<br>"));
      else if (note) h = "<p>" + note + "</p>";
      else h = "<p>" + (L.length >= t ? "All " + t + " electrons placed. Press <strong>Check</strong>." : L.length ? (t - L.length) + " electron" + (t - L.length > 1 ? "s" : "") + " to go. Tap the box where the next one belongs." : "Tap the box where electron " + (base() + 1) + " belongs.") + (heavy() ? " The [" + coreUp().sym + "] core is already in place." : "") + "</p>";
    } else h = note ? "<p>" + note + "</p>" : "";
    capEl.innerHTML = h;
  }
  function paintCtrl(){
    $$(".ec-c", host).forEach(function(c){ c.hidden = c.dataset.for !== S.mode; });
    RG.spin.lock(busy); RG.mode.lock(busy); RG.nota.lock(busy);
    var L = fillList(), dis = busy ? " disabled" : "";
    MV.keepFocus($(".ec-fbtns", host), function(){
      $(".ec-fbtns", host).innerHTML = '<button type="button" class="btn ghost sm" data-fa="undo" data-k="ecundo"' + (busy || !L.length ? " disabled" : "") + '>Undo</button>' +
        '<button type="button" class="btn ghost sm" data-fa="clear" data-k="ecclear"' + (busy || !L.length ? " disabled" : "") + '>Clear</button>' +
        '<button type="button" class="btn primary sm" data-fa="check" data-k="ecchk"' + dis + ">Check</button>";
    });
    var sp = steps(), k = stepNow();
    MV.keepFocus($('[data-for="auto"]', host), function(){
      $('[data-for="auto"]', host).innerHTML = '<div class="player"><button type="button" class="btn ghost sm" data-pa="back" data-k="ecback"' + (busy || k <= sp.s0 ? " disabled" : "") + '>Back</button>' +
        '<button type="button" class="btn primary sm" data-pa="step" data-k="ecstep"' + (busy || k >= sp.last ? " disabled" : "") + '>Step</button>' +
        '<button type="button" class="btn ghost sm" data-pa="play" data-k="ecplay"' + (busy && !timer ? " disabled" : "") + ">" + (timer ? "Pause" : "Play") + '</button><span class="ctr" aria-live="polite">' + autoLabel(k) + "</span></div>";
    });
    var e = S.z - S.q;
    MV.keepFocus($('[data-for="ion"]', host), function(){
      $('[data-for="ion"]', host).innerHTML = '<div class="ec-chg"><span class="rg-lab" id="ec-chg-l">Charge</span><button type="button" class="btn ghost sm ec-pm" data-pq="-1" data-k="ecqm" aria-label="Lower the charge by 1 (add an electron)"' + (busy || S.q <= -3 || e >= 56 ? " disabled" : "") + ">" + MINUS + '</button>' +
        '<output class="ec-qv" aria-labelledby="ec-chg-l" aria-live="polite">' + (S.q > 0 ? "+" + S.q : S.q < 0 ? MINUS + (-S.q) : "0") + '</output><button type="button" class="btn ghost sm ec-pm" data-pq="1" data-k="ecqp" aria-label="Raise the charge by 1 (remove an electron)"' + (busy || S.q >= 3 || e <= 0 ? " disabled" : "") + '>+</button>' +
        '<span class="ec-qsp">' + ionHTML(S.z, S.q) + ": " + (S.z - S.q) + " electrons</span></div>";
    });
    zIn.disabled = busy;
  }
  function autoLabel(k){
    var sp = steps();
    if (k > S.z) return "One " + EXC[S.z].from + " electron moved to " + EXC[S.z].to;
    if (k <= sp.s0) return sp.s0 ? "[" + coreUp().sym + "] core in place" : "No electrons yet";
    var o = aufbauOcc(k), li = lastIdx(o), s = slotOf(SUBS[li], o[li]);
    return "Electron " + k + " of " + S.z + ": " + SUBS[li].id + (s.sp > 0 ? ", spin up" : ", spin down");
  }
  function paint(){
    paintTable(); paintLadder(); paintRead(); paintCap(); paintCtrl();
    MV.changed();
  }

  // ----- Fill it yourself -----
  function place(i, b){
    if (busy) return;
    var L = fillList(), c = coreUp();
    checkMsg = null; note = ""; glow = null;
    if (c && i < c.upto) { note = "That box is inside the [" + c.sym + "] core, which is already full."; paintCap(); return; }
    if (L.length >= target()) { note = "All " + target() + " electrons are placed. Press <strong>Check</strong>, or Undo to move one."; paintCap(); return; }
    var before = fillBoxes(L, c ? c.upto : 0)[i][b];
    if (before.length >= 3) { note = "That box is already overfull. Undo, or tap another box."; paintCap(); return; }
    L.push([i, b, S.spin]); foc = i + ":" + b;
    var o = occOfBoxes(fillBoxes(L, c ? c.upto : 0));
    fresh = {}; fresh[i + ":" + b] = before.length; pulse = {}; if (o[i] === SUBS[i].cap) pulse[i] = true;
    api.save(); paintLadder(); paintRead(); paintCap(); paintCtrl(); fresh = null; pulse = null;
    MV.changed();
  }
  function fillCheck(){
    var L = fillList(), st = stateNow(), fl = flagLines(st.R), t = target(), g = ground(S.z), x = EXC[S.z];
    note = "";
    if (fl.length) checkMsg = MV.fbHTML("bad", "<strong>✗ A rule is broken.</strong> " + fl.join(" "));
    else if (L.length < t) checkMsg = MV.fbHTML("", "No rules broken so far. " + (base() + L.length) + " of " + S.z + " electrons placed.");
    else if (x && !sameOcc(st.o, g)) checkMsg = MV.fbHTML("bad", "<strong>Every rule followed, but " + NAME[S.z] + " is an exception.</strong> One " + x.from + " electron moves into " + x.to + ": " + x.why + " (" + cfgHTML(g, true, true) + ").");
    else checkMsg = MV.fbHTML("good", "<strong>✓ All " + S.z + " electrons placed without breaking a rule:</strong> " + cfgHTML(st.o, S.nota === "short", true) + ".");
    paintCap(); MV.focusFb(capEl);
  }
  ladder.addEventListener("click", function(e){ var b = e.target.closest("[data-i]"); if (!b || b.disabled || S.mode !== "fill") return; place(+b.dataset.i, +b.dataset.b); });
  ladder.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-i]"); if (!b || S.mode !== "fill") return;
    if (e.key === "s" || e.key === "S") { e.preventDefault(); S.spin = -S.spin; RG.spin.set(String(S.spin)); api.save(); note = "Next electron: spin " + (S.spin > 0 ? "up ↑" : "down ↓") + "."; checkMsg = null; paintCap(); return; }
    if (e.key === "Backspace") { e.preventDefault(); undo(); return; }
    var btns = $$("[data-i]", ladder), idx = btns.indexOf(b), t = null;
    if (e.key === "ArrowRight") t = btns[Math.min(btns.length - 1, idx + 1)];
    else if (e.key === "ArrowLeft") t = btns[Math.max(0, idx - 1)];
    else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      var rows = $$(".ec-row", ladder), row = b.closest(".ec-row"), ri = rows.indexOf(row) + (e.key === "ArrowUp" ? -1 : 1);
      if (ri >= 0 && ri < rows.length) { var bs = $$("[data-i]", rows[ri]); t = bs[Math.min(bs.length - 1, +b.dataset.b)]; }
    } else return;
    e.preventDefault();
    if (t) { btns.forEach(function(x){ x.tabIndex = -1; }); t.tabIndex = 0; t.focus({ preventScroll:true }); foc = t.dataset.i + ":" + t.dataset.b; }
  });
  function undo(){ var L = fillList(); if (!L.length || busy) return; var x = L.pop(); foc = x[0] + ":" + x[1]; checkMsg = null; note = ""; api.save(); paintLadder(); paintRead(); paintCap(); paintCtrl(); MV.changed(); }
  $(".ec-fbtns", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-fa]"); if (!b || b.disabled) return;
    if (b.dataset.fa === "undo") undo();
    else if (b.dataset.fa === "clear") { S.fills[S.z] = []; foc = null; checkMsg = null; note = ""; api.save(); paint(); }
    else fillCheck();
  });

  // ----- Auto-fill -----
  function showStep(k, prev){
    var st = steps(); k = clamp(k, st.s0, st.last);
    fresh = null; gone = null; glow = null; pulse = null;
    if (prev != null && k === prev + 1) {
      if (k > S.z) { var x = EXC[S.z], fi = IX[x.from], ti = IX[x.to], og = aufbauOcc(S.z); gone = {}; gone[fi + ":0"] = [-1]; var s2 = slotOf(SUBS[ti], og[ti] + 1); fresh = {}; fresh[ti + ":" + s2.b] = s2.sp > 0 ? 0 : 1; glow = {}; glow[ti] = true; }
      else { var o = aufbauOcc(k), li = lastIdx(o), s = slotOf(SUBS[li], o[li]); fresh = {}; fresh[li + ":" + s.b] = s.sp > 0 ? 0 : 1; if (o[li] === SUBS[li].cap) { pulse = {}; pulse[li] = true; } }
    }
    if (k > S.z) { glow = glow || {}; glow[IX[EXC[S.z].to]] = true; }
    S.step = k; api.save();
    paintLadder(); paintRead(); paintCtrl();
    MV.changed();
  }
  function stopPlay(){ if (timer) { clearTimeout(timer); timer = null; } }
  $('[data-for="auto"]', host).addEventListener("click", function(e){
    var b = e.target.closest("[data-pa]"); if (!b || b.disabled) return;
    var a = b.dataset.pa, k = stepNow(), sp = steps(); note = ""; paintCap();
    if (a === "back") { stopPlay(); showStep(k - 1); }
    else if (a === "step") { stopPlay(); showStep(k + 1, k); }
    else if (timer) { stopPlay(); busy = false; paintCtrl(); paintTable(); paintLadder(); }
    else {
      if (k >= sp.last) { showStep(sp.s0); k = sp.s0; }
      busy = true; paintTable();
      var tick = function(){ var c = stepNow(); if (c >= steps().last) { timer = null; busy = false; paintCtrl(); paintTable(); paintLadder(); return; } showStep(c + 1, c); timer = MV.wait(c + 1 > S.z ? 900 : 420, tick); };
      timer = MV.wait(200, tick); paintCtrl();
    }
  });

  // ----- Ions -----
  function setCharge(q, cb){
    var o0 = ionOcc(S.z, S.q), o1 = ionOcc(S.z, q);
    fresh = null; gone = null; glow = null; pulse = null;
    if (!MV.reduceMotion) {
      SUBS.forEach(function(s, i){
        var a = o0[i], b = o1[i];
        if (b < a) { for (var c = a; c > b; c--) { var sl = slotOf(s, c); gone = gone || {}; (gone[i + ":" + sl.b] = gone[i + ":" + sl.b] || []).push(sl.sp); } }
        if (b > a) { for (var c2 = a + 1; c2 <= b; c2++) { var sl2 = slotOf(s, c2); fresh = fresh || {}; var key = i + ":" + sl2.b; fresh[key] = Math.min(fresh[key] != null ? fresh[key] : 9, sl2.sp > 0 ? 0 : 1); } }
      });
    }
    S.q = q; checkMsg = null; api.save();
    paintLadder(); paintRead(); paintCtrl();
    recordTC3(); MV.changed();
    if (gone) { var my = ++gRun; MV.wait(700, function(){ if (my !== gRun) return; gone = null; paintLadder(); if (cb) cb(); }); }
    else if (cb) MV.wait(300, cb);
    fresh = null;
  }
  $('[data-for="ion"]', host).addEventListener("click", function(e){ var b = e.target.closest("[data-pq]"); if (!b || b.disabled) return; note = ""; paintCap(); setCharge(S.q + +b.dataset.pq); });
  function recordTC3(){
    if (S.mode !== "ion") return;
    var o = ionOcc(S.z, S.q), want = aufbauOcc(18); want[IX["3d"]] = 5;
    if (S.q !== 0 && sameOcc(o, want)) { var k = S.z + "|" + S.q; if (S.found3.indexOf(k) < 0) { S.found3.push(k); api.save(); paintRead(); } }
  }

  // ----- predictions -----
  function cancel(){ run++; gRun++; stopPlay(); busy = false; gone = null; fresh = null; }
  function lock(b){ busy = b; paintCtrl(); paintTable(); paintLadder(); }
  function setup(z, mode, step, q){
    cancel(); S.z = z; S.mode = mode; S.step = step; S.q = q || 0; checkMsg = null; note = ""; flash = 0; glow = pulse = null;
    if (z <= 36) SL.set("ecz", z);
    RG.mode.set(mode); api.save(); paint();
  }
  function stepTo(to, gap, cb){
    var my = run;
    (function go(){ if (my !== run) return; var k = stepNow(); if (k >= to) { cb(); return; } showStep(k + 1, k); MV.wait(gap, go); })();
  }
  var hooks = {
    start:function(p){
      if (p.id === "p1") setup(19, "auto", 18);
      else if (p.id === "p2") setup(7, "auto", 4);
      else if (p.id === "p3") setup(24, "auto", 18);
      else { setup(26, "ion", null, 0); S.nota = "short"; RG.nota.set("short"); paintRead(); }
      lock(true);
    },
    run:function(p, done){
      var my = run;
      function fin(n){ if (my !== run) return; note = n; busy = false; paint(); MV.wait(150, done); }
      if (p.id === "p1") stepTo(19, 500, function(){ flash = 1; paintTable(); fin("The 19th electron drops into 4s, and potassium starts period 4."); });
      else if (p.id === "p2") stepTo(7, 650, function(){ fin("Three up-arrows, one per 2p box. Unpaired: 3."); });
      else if (p.id === "p3") stepTo(24, 380, function(){ MV.wait(700, function(){ if (my !== run) return; showStep(25, 24); fin("The fill reached " + cfgHTML(aufbauOcc(24), true, true) + ", then one 4s electron moved to 3d: " + cfgHTML(ground(24), true, true) + ", with five half-filled 3d boxes."); }); });
      else setCharge(1, function(){ if (my !== run) return; MV.wait(250, function(){ if (my !== run) return; setCharge(2, function(){ fin("Both 4s electrons have left: " + cfgHTML(ionOcc(26, 2), true, false) + " · unpaired 4."); }); }); });
    }
  };

  // ----- challenges -----
  function chal(id){
    if (id === "tc1") {
      if (S.z !== 15) return { ok:false, msg:"Select phosphorus (Z = 15) first." };
      var L = S.fills[15] || [];
      if (!L.length) return { ok:false, msg:S.mode === "fill" ? "Place phosphorus’s 15 electrons first." : "Switch to Fill it yourself and place phosphorus’s 15 electrons." };
      var r = checkRules(L, 15, 0, 0), o = r.o, R = r.R, p3 = IX["3p"];
      if (r.bx[p3].some(function(b){ return b.length >= 2; }) && o[p3] <= 3) return { ok:false, msg:"Hund: spread them out first." };
      if (o[p3] > 0 && o[IX["3s"]] < 2) return { ok:false, msg:"Aufbau: 3s fills before 3p." };
      var fl = flagLines(R); if (fl.length) return { ok:false, msg:fl[0] };
      if (L.length < 15) return { ok:false, msg:L.length + " of 15 electrons placed so far, with no rule broken. Keep going." };
      return sameOcc(o, ground(15)) ? { ok:true } : { ok:false, msg:"Compare with " + cfgHTML(ground(15), false, true) + "." };
    }
    if (id === "tc2") {
      if (S.mode === "ion" && S.q) return { ok:false, msg:"Set the charge to 0: the challenge asks for a neutral atom." };
      if (period(S.z) !== 4) return { ok:false, msg:"Choose an element in period 4 (K to Kr)." };
      if (S.z === 25) return { ok:true };
      if (S.z === 24) return { ok:false, msg:"Chromium has 6 unpaired electrons: 4s" + supN(1) + " plus five in 3d." };
      if (S.z === 26) return { ok:false, msg:"Iron has 4: " + "3d" + supN(6) + " pairs one electron." };
      if (S.z === 23) return { ok:false, msg:"3d" + supN(3) + " gives 3." };
      return { ok:false, msg:cap1(NAME[S.z]) + " has " + unpairedOf(boxesFromOcc(ground(S.z))) + " unpaired electron" + (unpairedOf(boxesFromOcc(ground(S.z))) === 1 ? "" : "s") + "." };
    }
    if (id === "tc3") {
      var good = S.found3.filter(function(k){ return ["24|1", "25|2", "26|3"].indexOf(k) >= 0; });
      if (good.length >= 2) return { ok:true };
      if (S.mode !== "ion") return { ok:false, msg:"Switch to Ions mode and change the charge." + (good.length ? " One found so far: " + ionHTML(+good[0].split("|")[0], +good[0].split("|")[1]) + "." : "") };
      if (S.z === 26 && S.q === 2) return { ok:false, msg:"That’s " + cfgHTML(ionOcc(26, 2), true, false) + "." };
      if (S.z === 25 && S.q === 0) return { ok:false, msg:"Neutral manganese still has 4s" + supN(2) + "." };
      if (S.z === 23 && S.q === 0) return { ok:false, msg:"Vanadium has 23 electrons, but it keeps 4s" + supN(2) + ": " + cfgHTML(ground(23), true, true) + "." };
      if (good.length === 1) return { ok:false, msg:"One found: " + ionHTML(+good[0].split("|")[0], +good[0].split("|")[1]) + ". Find a second, different ion with " + "[Ar] 3d" + supN(5) + "." };
      return { ok:false, msg:"That’s " + cfgHTML(ionOcc(S.z, S.q), true, !S.q) + ". You need 23 electrons with no 4s electrons left." };
    }
    return { ok:false };
  }

  SL.set("ecz", Math.min(36, S.z));
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Configurations and the table ----------
// Station 1 regions on an 18-column blank table: [block, row from, row to, column from, column to]; rows 9–10 hold the f block
var REG = [{ id:"sH", b:"s", r:[1, 1], c:[1, 1], subs:["1s"], pos:"hydrogen’s square, row 1, column 1" }, { id:"sHe", b:"s", r:[1, 1], c:[18, 18], subs:["1s"], pos:"helium’s square, row 1, column 18" },
  { id:"s", b:"s", r:[2, 7], c:[1, 2], subs:["2s", "3s", "4s", "5s", "6s", "7s"], pos:"columns 1 and 2, rows 2 to 7" }, { id:"d", b:"d", r:[4, 7], c:[3, 12], subs:["3d", "4d", "5d", "6d"], pos:"columns 3 to 12, rows 4 to 7" },
  { id:"p", b:"p", r:[2, 7], c:[13, 18], subs:["2p", "3p", "4p", "5p", "6p", "7p"], pos:"columns 13 to 18, rows 2 to 7" }, { id:"f", b:"f", r:[9, 10], c:[3, 16], subs:["4f", "5f"], pos:"the two rows below the table, 14 columns wide" }];
var BNAME = { s:"s block: groups 1 and 2, plus helium", p:"p block: groups 13 to 18", d:"d block: groups 3 to 12", f:"f block: the two rows below the table" };
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  if (!S.blk || typeof S.blk !== "object") S.blk = {}; S.letter = "spdf".indexOf(S.letter) >= 0 && S.letter ? S.letter : "";
  if (!S.bk || typeof S.bk !== "object") S.bk = { i:0, done:{} }; S.bk.i = clamp(+S.bk.i || 0, 0, s2.items.length - 1); S.bk.done = S.bk.done || {};
  S.fam = s3.cards.some(function(c){ return c.id === S.fam; }) ? S.fam : "";
  var msg1 = "", msg2 = "", pick2 = 0;
  var SW = '<p class="tiny muted ec-swipe">Swipe sideways to see the whole table.</p>';
  host.innerHTML = '<div class="ec-st1"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="ec-let"></div><div class="ec-bscroll"><div class="ec-blank" role="group" aria-label="Blank periodic table, divided into blocks"></div></div><div class="ec-m1" aria-live="polite"></div>' +
    '<details class="alg"><summary>Check it with data</summary>' + s1.data + "<p><strong>" + s1.rule + "</strong></p></details></div>" +
    '<div class="part"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="ec-bq" aria-live="polite"></div><div class="ec-bscroll"><div class="ec-ptab2"></div></div>' + SW + '<div class="ec-m2" aria-live="polite"></div></div>' +
    '<div class="part"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><div class="ec-fams" role="group" aria-label="Families"></div><div class="ec-bscroll"><div class="ec-ptab3"></div></div>' + SW + '<div class="ec-famtx" aria-live="polite"></div></div>';
  // station 1
  radios($(".ec-let", host), { label:"Block letter", aria:"Block letter to place", cls:"chips", options:"spdf".split("").map(function(b){ return { id:b, t:b + " block" }; }), value:S.letter, onChange:function(v){ S.letter = v; api.save(); } });
  var blank = $(".ec-blank", host);
  function paint1(){
    var all = "spdf".split("").every(function(b){ return S.blk[b]; });
    MV.keepFocus(blank, function(){
      blank.innerHTML = REG.map(function(g){
        var on = !!S.blk[g.b], w = g.c[1] - g.c[0] + 1, rows = g.subs.map(function(s){ return '<span class="ec-rr" style="--w:' + w + '">' + (on ? s : "") + "</span>"; }).join("");
        var st = "grid-row:" + g.r[0] + " / " + (g.r[1] + 1) + ";grid-column:" + g.c[0] + " / " + (g.c[1] + 1);
        return '<button type="button" class="ec-rg' + (on ? " on b-" + g.b : "") + '" data-reg="' + g.id + '" data-k="rg' + g.id + '" style="' + st + '" aria-label="' + esc(on ? BNAME[g.b] + ", labelled " + g.b : "Unlabelled region: " + g.pos) + '">' + rows + "</button>";
      }).join("");
    });
    $(".ec-m1", host).innerHTML = msg1 ? msg1 : all ? MV.fbHTML("good", "<strong>All four blocks labelled.</strong> The table is a map of configurations: the last sublevel an element fills names its block.") : "";
  }
  blank.addEventListener("click", function(e){
    var b = e.target.closest("[data-reg]"); if (!b) return;
    var g = REG.filter(function(x){ return x.id === b.dataset.reg; })[0];
    if (S.blk[g.b]) { msg1 = MV.fbHTML("", "Already labelled: the " + BNAME[g.b] + "."); paint1(); return; }
    if (!S.letter) { msg1 = MV.fbHTML("", "Choose a block letter first."); paint1(); return; }
    if (S.letter === g.b) { S.blk[g.b] = true; var subs = [].concat.apply([], REG.filter(function(x){ return x.b === g.b; }).map(function(x){ return x.subs; })); msg1 = MV.fbHTML("good", "<strong>✓ The " + BNAME[g.b] + ".</strong> Its rows fill " + subs[0] + " to " + subs[subs.length - 1] + "."); }
    else msg1 = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + s1.width);
    api.save(); paint1(); MV.focusFb($(".ec-m1", host));
  });
  paint1();
  // station 2
  var PT2 = ptable($(".ec-ptab2", host), { maxP:5, active:function(z){ return z <= 54; }, sel:function(){ return pick2; }, pick:function(z){ answer2(z); },
    hi:function(z){ var it = s2.items[S.bk.i]; return S.bk.done[it.id] && SYM[z] === MV.ans(it) ? "flash" : ""; }, aria:"Periodic table, periods 1 to 5: tap the element" });
  function paint2(){
    var it = s2.items[S.bk.i], d = S.bk.done[it.id], n = s2.items.length;
    MV.keepFocus($(".ec-bq", host), function(){
      $(".ec-bq", host).innerHTML = '<p class="ec-bqt"><span class="tiny muted">Configuration ' + (S.bk.i + 1) + " of " + n + '</span><br><strong class="ec-bcfg">' + it.cfg + "</strong></p>" +
        '<div class="q-actions"><button type="button" class="btn ghost sm" data-b2="prev" data-k="b2p"' + (S.bk.i === 0 ? " disabled" : "") + '>Previous</button><button type="button" class="btn ' + (d ? "primary" : "ghost") + ' sm" data-b2="next" data-k="b2n"' + (S.bk.i >= n - 1 ? " disabled" : "") + ">Next configuration</button></div>";
    });
    $(".ec-m2", host).innerHTML = msg2 ? msg2 : d ? MV.fbHTML("good", "<strong>✓ " + MV.ans(it) + ".</strong> " + it.sum + ".") : "";
    PT2.paint();
  }
  function answer2(z){
    var it = s2.items[S.bk.i]; pick2 = z;
    if (SYM[z] === MV.ans(it)) { S.bk.done[it.id] = true; msg2 = MV.fbHTML("good", "<strong>✓ " + SYM[z] + " (" + NAME[z] + ", Z = " + z + ").</strong> " + it.sum + "."); }
    else msg2 = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + SYM[z] + " has Z = " + z + ". " + s2.method);
    api.save(); paint2(); MV.focusFb($(".ec-m2", host));
  }
  $(".ec-bq", host).addEventListener("click", function(e){ var b = e.target.closest("[data-b2]"); if (!b || b.disabled) return; S.bk.i = clamp(S.bk.i + (b.dataset.b2 === "next" ? 1 : -1), 0, s2.items.length - 1); msg2 = ""; pick2 = 0; api.save(); paint2(); });
  paint2();
  // station 3
  var PT3 = ptable($(".ec-ptab3", host), { maxP:5, active:function(){ return false; }, sel:function(){ return 0; }, pick:function(){},
    hi:function(z){ var c = s3.cards.filter(function(x){ return x.id === S.fam; })[0]; return c && c.groups.indexOf(group(z)) >= 0 && !(z === 1 && c.id === "alk") ? "fam" : ""; }, aria:"Periodic table with the chosen family lit up" });
  function paint3(){
    MV.keepFocus($(".ec-fams", host), function(){
      $(".ec-fams", host).innerHTML = s3.cards.map(function(c){ var on = S.fam === c.id; return '<button type="button" class="ec-fam' + (on ? " on" : "") + '" data-fam="' + c.id + '" data-k="fam' + c.id + '" aria-pressed="' + on + '"><strong>' + c.name + '</strong><span class="ec-famc">' + c.cfg + "</span></button>"; }).join("");
    });
    var c = s3.cards.filter(function(x){ return x.id === S.fam; })[0];
    $(".ec-famtx", host).innerHTML = c ? '<p class="ec-famp"><strong>' + c.name + " (" + c.cfg + "):</strong> " + c.text + "</p>" : '<p class="muted">Tap a family above.</p>';
    PT3.paint();
  }
  $(".ec-fams", host).addEventListener("click", function(e){ var b = e.target.closest("[data-fam]"); if (!b) return; S.fam = S.fam === b.dataset.fam ? "" : b.dataset.fam; api.save(); paint3(); });
  paint3();
}

// ---------- Practice 2: Build and predict (number entry, chips, an investigation pair, the N4 configuration builder) ----------
// @component N4 configBuilder — configuration entry from chips (no free typing): a noble-gas core, then sublevel + electron
// count pairs (4s then 2 -> 4s²); Remove last / Clear. parseCfg(tokens) -> {o} or {err}; judged by comparing occupancies.
var CB_CORES = ["He", "Ne", "Ar", "Kr"], CB_SUBS = ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p"];
function parseCfg(tok){
  var o = zeros(), seen = {}, core = null;
  for (var t = 0; t < tok.length; t++) {
    var m = /^\[(\w+)\]$/.exec(tok[t]);
    if (m) { core = CORES.filter(function(c){ return c.sym === m[1]; })[0]; for (var i = 0; i < core.upto; i++) o[i] = SUBS[i].cap; continue; }
    var s = /^(\d[spdf])(\d+)$/.exec(tok[t]), k = IX[s[1]], n = +s[2];
    if (core && k < core.upto) return { err:s[1] + " is already inside the [" + core.sym + "] core." };
    if (seen[s[1]]) return { err:"Each sublevel appears once." };
    if (n > SUBS[k].cap) return { err:"A" + (SUBS[k].l === 0 ? "n " : " ") + "s p d".split(" ")[SUBS[k].l] + " sublevel holds at most " + SUBS[k].cap + " electrons." };
    seen[s[1]] = 1; o[k] = n;
  }
  return { o:o };
}
function tokHTML(t){ var m = /^(\d[spdf])(\d+)$/.exec(t); return m ? m[1] + supN(m[2]) : t; }
function buildAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = { val:"", pick:null, pa:null, pb:null, tok:[], pend:"", tries:0, hint:0, solved:false, first:null }); if (!Array.isArray(x.tok)) x.tok = []; return x; }
  function order(it, key, n){ return MV.shuffle(Array.apply(null, Array(n)).map(function(_, i){ return i; }), MV.meta.id + it.id + key); }
  function chipsHTML(it, x, list, key, sel, aria){
    var ord = order(it, key, list.length);
    return '<div class="chips ec-chiplist" role="radiogroup" aria-label="' + esc(aria) + '">' + ord.map(function(k){ var on = sel === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-' + key + '="' + k + '" data-k="' + it.id + key + k + '"' + (x.solved ? " disabled" : "") + ">" + list[k].t + "</button>"; }).join("") + "</div>";
  }
  function builderHTML(it, x){
    var shown = x.tok.map(tokHTML).join(" ") + (x.pend ? (x.tok.length ? " " : "") + x.pend + '<sup class="ec-q">?</sup>' : "");
    var h = '<div class="ec-cb"><p class="ec-cbout" aria-live="polite"><span class="vh">Your configuration: </span>' + (shown || '<span class="muted">Tap the chips to build it.</span>') + "</p>";
    if (!x.solved) {
      h += '<div class="ec-cbrow"><span class="ec-cbl">Core</span>' + CB_CORES.map(function(c){ return '<button type="button" class="chip" data-cb="[' + c + ']" data-k="' + it.id + "c" + c + '">[' + c + "]</button>"; }).join("") + "</div>";
      h += '<div class="ec-cbrow"><span class="ec-cbl">Sublevel</span>' + CB_SUBS.map(function(s){ return '<button type="button" class="chip' + (x.pend === s ? " on" : "") + '" data-cs="' + s + '" data-k="' + it.id + "s" + s + '" aria-pressed="' + (x.pend === s) + '">' + s + "</button>"; }).join("") + "</div>";
      h += '<div class="ec-cbrow"><span class="ec-cbl">Electrons</span>' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function(n){ return '<button type="button" class="chip ec-cbn" data-cn="' + n + '" data-k="' + it.id + "n" + n + '" aria-label="' + n + (n > 1 ? ' electrons' : ' electron') + '">' + n + "</button>"; }).join("") + "</div>";
      h += '<div class="ec-cbrow"><button type="button" class="btn ghost sm" data-cx="del" data-k="' + it.id + 'del"' + (x.tok.length || x.pend ? "" : " disabled") + '>Remove last</button><button type="button" class="btn ghost sm" data-cx="clr" data-k="' + it.id + 'clr"' + (x.tok.length || x.pend ? "" : " disabled") + ">Clear</button></div>";
    }
    return h + "</div>";
  }
  function itemHTML(it, i){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", h = '<div class="q" data-ri="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "num") h += '<div class="numrow ec-numrow"><label for="ri-' + it.id + '">Your answer:</label><input class="numin short" id="ri-' + it.id + '" data-rin="' + it.id + '" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" value="' + esc(x.val) + '"' + dis + '><span class="ec-unit">' + it.unit + "</span></div>";
    else if (it.kind === "cfg") h += builderHTML(it, x);
    else if (it.kind === "inv") h += '<p class="ec-invq">' + it.qa + "</p>" + chipsHTML(it, x, it.optsA, "pa", x.pa, MV.plain(it.qa)) + '<p class="ec-invq">' + it.qb + "</p>" + chipsHTML(it, x, it.optsB, "pb", x.pb, MV.plain(it.qb));
    else h += chipsHTML(it, x, it.options, "op", x.pick, "Choices");
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + (it.kind === "chips" ? it.options[x.pick].t : it.display) + ".</strong> " + (it.kind === "chips" ? it.options[x.pick].why || "" : "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function judge(it, x){
    if (it.kind === "num") {
      var v = MV.parseNum(String(x.val || "").replace(/unpaired|electrons?/gi, "").trim());
      if (!v || v.length !== 1 || !isFinite(v[0])) return { bad:"Enter one number." };
      if (v[0] === MV.ans(it)) return { ok:true };
      var w = (it.wrong || []).filter(function(z){ return z.match === v[0]; })[0];
      return { fb:w ? w.fb : it.fb };
    }
    if (it.kind === "cfg") {
      if (x.pend) return { bad:"Finish " + x.pend + ": tap its number of electrons." };
      if (!x.tok.length) return { bad:"Build a configuration from the chips first." };
      var p = parseCfg(x.tok); if (p.err) return { bad:p.err };
      var ans = parseCfg(MV.ans(it).split(" ")).o;
      if (sameOcc(p.o, ans)) return { ok:true };
      var w2 = (it.wrong || []).filter(function(z){ return sameOcc(parseCfg(z.match.split(" ")).o, p.o); })[0];
      return { fb:w2 ? w2.fb : it.fb };
    }
    if (it.kind === "inv") {
      if (x.pa == null || x.pb == null) return { bad:"Choose an answer for (a) and for (b)." };
      var A = it.optsA[x.pa], B = it.optsB[x.pb], out = [];
      if (!MV.ok(A)) out.push("(a) " + A.why); if (!MV.ok(B)) out.push("(b) " + B.why);
      return out.length ? { fb:out.join(" ") } : { ok:true };
    }
    if (x.pick == null) return { bad:"Choose an answer first." };
    return MV.ok(it.options[x.pick]) ? { ok:true } : { fb:it.options[x.pick].why };
  }
  host.addEventListener("input", function(e){ var d = e.target.dataset; if (!d || !d.rin) return; ist(d.rin).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.rin) { var b = host.querySelector('[data-k="' + e.target.dataset.rin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ri]"); if (!bx) return;
    var it = item(bx.dataset.ri), x = ist(it.id), d = b.dataset;
    if (d.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (d.op != null) { x.pick = +d.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (d.pa != null) { x.pa = +d.pa; msgs[it.id] = null; api.save(); paint(); return; }
    if (d.pb != null) { x.pb = +d.pb; msgs[it.id] = null; api.save(); paint(); return; }
    if (d.cb) { if (x.tok.length || x.pend) msgs[it.id] = { t:"The core goes first. Clear to start again.", soft:true }; else { x.tok.push(d.cb); msgs[it.id] = null; } api.save(); paint(); return; }
    if (d.cs) { x.pend = d.cs; msgs[it.id] = null; api.save(); paint(); return; }
    if (d.cn) { if (!x.pend) msgs[it.id] = { t:"Tap a sublevel first, then its number of electrons.", soft:true }; else { x.tok.push(x.pend + d.cn); x.pend = ""; msgs[it.id] = null; } api.save(); paint(); return; }
    if (d.cx) { if (d.cx === "clr") { x.tok = []; x.pend = ""; } else if (x.pend) x.pend = ""; else x.tok.pop(); msgs[it.id] = null; api.save(); paint(); return; }
    if (d.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = { t:r.bad, soft:true }; paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = { t:r.fb }; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ri="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, dn = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) dn++; if (x.first) f++; }); return { first:f, total:a.items.length, done:dn, line:a.summary + " (first try): " + f + "/" + a.items.length + (dn < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Three unpaired, no 4s ----------
var task = (function(){
  var S = null, api = null, T = null;
  function read(){ return { z:S && S.z ? +S.z : 0, q:S && S.q != null && S.q !== "" ? +S.q : null }; }
  function occ(d){ return ionOcc(d.z, d.q); }
  function paint(){
    var d = read(), pv = $("#ec-tkpv"); if (!pv) return;
    if (!d.z || d.q == null) { pv.innerHTML = '<p class="muted">Choose an element and a charge to see its orbital diagram.</p>'; return; }
    var o = occ(d), c = coreFor(o, false), rows = [];
    for (var i = c ? c.upto : 0; i <= IX["3d"]; i++) rows.push(i);
    var bx = boxesFromOcc(o), un = unpairedOf(bx);
    pv.innerHTML = '<p class="ec-tkh"><strong>' + ionHTML(d.z, d.q) + "</strong>: " + cfgHTML(o, true, !d.q) + "</p>" + ladderHTML({ bx:bx, rows:rows, core:c, act:false, compact:true }) +
      '<dl class="read ec-tkread">' + MV.readoutHTML([["4s electrons", String(o[IX["4s"]])], ["Unpaired electrons", un + (un ? " (paramagnetic)" : " (diamagnetic)")], ["Block", blockOf(d.z) + " block"]]) + "</dl>";
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; T = MV.C.task;
      if (!(+S.z >= 19 && +S.z <= 30)) S.z = 0; if ([0, 1, 2, 3].indexOf(S.q === "" || S.q == null ? -1 : +S.q) < 0) S.q = null;
      inp.innerHTML = '<div class="ec-tq"><p class="ec-lab">' + T.qEl + '</p><div class="ec-tel"></div></div><div class="ec-tq"><p class="ec-lab">' + T.qQ + '</p><div class="ec-tch"></div></div>';
      var els = []; for (var z = 19; z <= 30; z++) els.push({ id:String(z), t:SYM[z], aria:cap1(NAME[z]) + ", Z = " + z });
      radios($(".ec-tel", inp), { aria:"Element", cls:"chips", options:els, value:S.z ? String(S.z) : "", onChange:function(v){ S.z = +v; api.save(); paint(); api.update(); } });
      radios($(".ec-tch", inp), { aria:"Charge", cls:"chips", options:[{ id:"0", t:"0" }, { id:"1", t:"1+" }, { id:"2", t:"2+" }, { id:"3", t:"3+" }], value:S.q == null ? "" : String(S.q), onChange:function(v){ S.q = +v; api.save(); paint(); api.update(); } });
      pv.innerHTML = '<h4 class="ec-h4">Live orbital diagram</h4><div class="ec-tkpv" id="ec-tkpv" aria-live="polite"></div>';
      paint();
    },
    read:read,
    valid:function(d){ return d.z && d.q != null ? true : "Choose an element and a charge first."; },
    // line 3 uses the species' real unpaired count; whenever line 2 holds this equals the plan's test (3d count is 3 or 7)
    checks:function(d){ if (!d.z || d.q == null) return [false, false, false]; var o = occ(d); return [d.z >= 21 && d.z <= 30, o[IX["4s"]] === 0, unpairedOf(boxesFromOcc(o)) === 3]; },
    key:function(d){ return d.z + "|" + d.q; },
    label:function(k){ var p = k.split("|"); return ionHTML(+p[0], +p[1]) + " (" + cfgHTML(ionOcc(+p[0], +p[1]), true, false) + ")"; },
    text:function(k){ return MV.plain(this.label(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ build:buildAct },
  task:task
});
})();
