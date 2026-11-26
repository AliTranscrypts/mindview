// SBI4U 25 Overview of Protein Synthesis: hero (one mRNA translated start to finish), Ribosome assembly line (S2 pathway
// stepper, translation form + S6 codon table; modes Assembly line, Polyribosome, Bacterium vs eukaryote; blockers),
// Decode it (S5 sequence workbench: three starting points, find the frame; S12 claim–evidence–reasoning on model data),
// Decode set (Practice), "One message, two codes" (task). Colours: mRNA teal, tRNA violet, amino acids brown, DNA ink.
// VERIFY: teacher note (plan §6.1): initiation factors and GTP are left out; elongation uses GTP.
// VERIFY: the mitochondrial code differences (UGA = Trp; AGA, AGG = stop; AUA = Met) are those of vertebrate mitochondria (plan §5).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small helpers (from SBI4U 15 / 08) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "ps-lab", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function line(x1, y1, x2, y2, cls){ return sv("line", { x1:x1, y1:y1, x2:x2, y2:y2, "class":cls }); }
function rect(x, y, w, h, r, cls){ return sv("rect", { x:x, y:y, width:w, height:h, rx:r, "class":cls }); }
function ell(x, y, rx, ry, cls){ return sv("ellipse", { cx:x, cy:y, rx:rx, ry:ry, "class":cls }); }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function grp(o, inner){ return '<g opacity="' + f1(clamp(o.a, 0, 1)) + '"' + (o.dy ? ' transform="translate(' + f1(o.dx || 0) + " " + f1(o.dy) + ')"' : "") + ">" + inner + "</g>"; }

// ---------- @component radioGroup (copied from SBI4U 15 / 08 / MHF4U 25: options may be disabled with dis:true) ----------
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
    e.preventDefault(); e.stopPropagation();
    var ids = o.options.filter(function(x){ return !x.dis; }).map(function(x){ return String(x.id); }); if (!ids.length) return;
    var i = ids.indexOf(String(b.dataset.rg)); choose(ids[(i + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; },
    setOptions:function(list){ o.options = list; paint(); }, disable:function(b){ if (b !== off) { off = b; paint(); } } };
}

// ---------- @component S6 codonTable — the standard genetic code (mRNA codons), with an optional mitochondrial card ----------
// aaOf("UGG") -> "Trp"; aaOf("UGA", true) -> "Trp" (human mitochondria); codonTable({mito:"card text"}) -> <details> html
var BASES = "UCAG", AA1 = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";
var A3 = { F:"Phe", L:"Leu", S:"Ser", Y:"Tyr", C:"Cys", W:"Trp", P:"Pro", H:"His", Q:"Gln", R:"Arg", I:"Ile", M:"Met", T:"Thr", N:"Asn", K:"Lys", V:"Val", A:"Ala", D:"Asp", E:"Glu", G:"Gly", "*":"stop" };
var AALIST = ["Ala", "Arg", "Asn", "Asp", "Cys", "Gln", "Glu", "Gly", "His", "Ile", "Leu", "Lys", "Met", "Phe", "Pro", "Ser", "Thr", "Trp", "Tyr", "Val"];
function aaOf(c, mito){
  if (!/^[UCAG]{3}$/.test(c || "")) return null;
  if (mito) { if (c === "UGA") return "Trp"; if (c === "AGA" || c === "AGG") return "stop"; if (c === "AUA") return "Met"; }
  return A3[AA1[16 * BASES.indexOf(c[0]) + 4 * BASES.indexOf(c[1]) + BASES.indexOf(c[2])]];
}
function codonTable(o){
  o = o || {};
  var h = '<details class="ps-ct"' + (o.open ? " open" : "") + '><summary>Codon table (standard genetic code)</summary><div class="tbl-wrap"><table class="ps-ctt"><caption class="vh">Standard genetic code: first base by row, second base by column, third base within each cell</caption><thead><tr><th scope="col">1st base</th>' +
    BASES.split("").map(function(b){ return '<th scope="col">2nd: ' + b + "</th>"; }).join("") + "</tr></thead><tbody>";
  BASES.split("").forEach(function(f){
    h += '<tr><th scope="row">' + f + "</th>";
    BASES.split("").forEach(function(s){
      h += "<td>" + BASES.split("").map(function(t){ var c = f + s + t, a = aaOf(c), m = o.mito && aaOf(c, true) !== a; return '<span class="ps-cc' + (a === "stop" ? " ps-cstop" : a === "Met" ? " ps-cmet" : "") + '">' + c + " <b>" + a + "</b>" + (m ? '<i class="ps-cmi" title="different in human mitochondria">*</i>' : "") + "</span>"; }).join("") + "</td>";
    });
    h += "</tr>";
  });
  h += "</tbody></table></div><p class=\"tiny muted\">AUG = Met and start. UAA, UAG, UGA = stop.</p>" + (o.mito ? '<p class="ps-mito"><strong>Mitochondrial differences</strong> (* in the table): ' + o.mito + "</p>" : "") + "</details>";
  return h;
}
// ---------- @component S5 sequence helpers — pairing, transcription, triplet display ----------
var DPAIR = { A:"T", T:"A", C:"G", G:"C" }, TRX = { A:"U", T:"A", C:"G", G:"C" }, RPAIR = { A:"U", U:"A", C:"G", G:"C" }, R2T = { A:"T", U:"A", C:"G", G:"C" };
function mapS(s, m){ return s.split("").map(function(c){ return m[c] || c; }).join(""); }
function trip(s, from){ from = from || 0; var out = s.slice(0, from), i; for (i = from; i < s.length; i += 3) out += (out && i > 0 ? " " : "") + s.slice(i, i + 3); return out; }
function anti(c){ return mapS(c, RPAIR); }
function chainText(a){ return a.length ? a.join("–") : "none"; }

// ---------- @component S2 pathwayStepper (translation form) — frames of one ribosome reading one mRNA ----------
// buildFrames(bases, {st: null = scan from the 5′ end | base index, noRF, abx}) -> [frame]
// frame: {kind, stage, off (base index under the P site's first slot), small, large, sep, t:{E,P,A}, rf, chain, on, bonds, read, total, fs, start, stall, done}
function tRNAof(k, c){ return { id:k, cod:c, anti:anti(c), aa:aaOf(c), ch:true }; }
function emptied(t){ if (!t) return t; var u = {}; for (var k in t) u[k] = t[k]; u.ch = false; return u; }
function buildFrames(bases, cfg){
  var F = [], n = bases.length, scan = cfg.st == null, bind = scan ? 0 : cfg.st;
  var start = scan ? bases.indexOf("AUG") : cfg.st, cods = [], i;
  if (start >= 0) for (i = start; i + 3 <= n; i += 3) cods.push(bases.substr(i, 3));
  var stopAt = -1; for (i = 0; i < cods.length; i++) if (aaOf(cods[i]) === "stop") { stopAt = i; break; }
  var f = { kind:"ready", stage:"Ready: before initiation", off:bind, small:0, large:0, sep:0, t:{ E:null, P:null, A:null }, rf:0, chain:[], on:null, bonds:0, read:0,
    total:stopAt >= 0 ? stopAt + 1 : cods.length, fs:null, start:start, scan:scan, stall:null, done:0, cods:cods };
  F.push(f);
  function add(p){ var g = {}, k; for (k in f) g[k] = f[k]; g.t = { E:f.t.E, P:f.t.P, A:f.t.A }; g.chain = f.chain.slice(); for (k in p) g[k] = p[k]; F.push(g); f = g; return g; }
  if (cfg.abx) { add({ kind:"stall", small:1, stall:"abx", stage:"Blocked: the antibiotic on the small subunit stops initiation" }); return F; }
  add({ kind:"bind", small:1, fs:scan ? null : start, stage:scan ? "Initiation: the small subunit binds the mRNA near its 5′ end" : "Initiation: the small subunit is placed at the chosen base" });
  if (start < 0 || !cods.length) { add({ kind:"stall", stall:"noaug", stage:"Stalled: the small subunit finds no AUG, so translation never starts" }); return F; }
  if (scan && start !== bind) add({ kind:"scan", off:start, fs:start, stage:"Initiation: the small subunit scans to the first AUG" });
  else if (scan) f.fs = start;
  var c0 = cods[0], a0 = aaOf(c0);
  if (a0 === "stop") { add({ kind:"stall", stall:"stop0", stage:"Stalled: no tRNA pairs with a stop codon" }); return F; }
  add({ kind:"initT", t:{ E:null, P:tRNAof(0, c0), A:null }, chain:[a0], on:"P", read:1,
    stage:c0 === "AUG" ? "Initiation: the initiator tRNA carrying Met pairs with AUG in the P site" : "Initiation (forced start): a tRNA carrying " + a0 + " pairs with " + c0 + " in the P site" });
  add({ kind:"large", large:1, stage:"Initiation: the large subunit joins; the first tRNA is in the P site" });
  for (var k = 1; k < 40; k++) {
    if (k >= cods.length) { add({ kind:"stall", stall:"end", stage:"Stalled: the ribosome reached the 3′ end with no stop codon in frame; the chain stays attached" }); break; }
    var c = cods[k], a = aaOf(c);
    if (a === "stop") {
      if (cfg.noRF) { add({ kind:"stall", stall:"rf", t:{ E:null, P:f.t.P, A:null }, stage:"Stalled: no release factor, so the chain stays attached to the P-site tRNA" }); break; }
      add({ kind:"rf", rf:1, t:{ E:null, P:f.t.P, A:null }, read:f.read + 1, stage:"Termination: a release factor binds the stop codon in the A site" });
      add({ kind:"rel", on:"free", t:{ E:null, P:emptied(f.t.P), A:null }, stage:"Termination: the polypeptide is released" });
      add({ kind:"sep", sep:1, rf:0, t:{ E:null, P:null, A:null }, done:1, stage:"Termination: the subunits separate. One polypeptide is finished." });
      break;
    }
    var tk = tRNAof(k, c);
    add({ kind:"arr", t:{ E:null, P:f.t.P, A:tk }, read:f.read + 1, stage:"Elongation: arrival (a charged tRNA enters the A site)" });
    add({ kind:"bond", chain:f.chain.concat([a]), on:"A", t:{ E:null, P:emptied(f.t.P), A:tk }, bonds:f.bonds + 1, stage:"Elongation: peptide bond (the chain moves onto the A-site tRNA’s amino acid)" });
    add({ kind:"trans", off:f.off + 3, t:{ E:f.t.P, P:f.t.A, A:null }, on:"P", stage:"Elongation: translocation (the ribosome moves one codon toward the 3′ end)" });
  }
  return F;
}
// layout of one frame (positions in the 560 × 262 view); mix() tweens two layouts
var SX = { E:238, P:280, A:322 };
function bx(b, off){ return 266 + (b - off) * 14; }
function lay(F){
  var o = { off:F.off, sm:F.small ? 1 : 0, smY:F.small ? 0 : 26, lg:F.large ? 1 : 0, lgY:F.large ? 0 : -34, rf:F.rf ? 1 : 0, tr:{}, bd:{}, fs:F.fs, free:F.on === "free", chain:F.chain };
  if (F.sep) { o.sm = 0.35; o.smY = 20; o.lg = 0.35; o.lgY = -30; }
  ["E", "P", "A"].forEach(function(s){
    var t = F.t[s]; if (!t) return;
    o.tr[t.id] = { x:SX[s], dy:0, a:1, anti:t.anti };
    if (t.ch && F.on !== s) o.bd[t.id] = { x:SX[s], y:100, a:1, aa:t.aa };
  });
  var L = F.chain.length;
  if (F.on === "free") F.chain.forEach(function(a, i){ o.bd[i] = { x:34 + 27 * i, y:30, a:1, aa:a }; });
  else if (F.on) { var ax = SX[F.on]; F.chain.forEach(function(a, i){ var j = L - 1 - i; o.bd[i] = { x:ax - 21 * j, y:100 - 12 * j, a:1, aa:a }; }); }
  return o;
}
function mix(A, B, k){
  var o = { off:lerp(A.off, B.off, k), sm:lerp(A.sm, B.sm, k), smY:lerp(A.smY, B.smY, k), lg:lerp(A.lg, B.lg, k), lgY:lerp(A.lgY, B.lgY, k), rf:lerp(A.rf, B.rf, k),
    tr:{}, bd:{}, fs:k < 0.5 ? A.fs : B.fs, free:k > 0.6 ? B.free : A.free, chain:k < 0.5 ? A.chain : B.chain }, id;
  function both(PA, PB, out, isT){
    var ids = {}; for (id in PA) ids[id] = 1; for (id in PB) ids[id] = 1;
    for (id in ids) {
      var a = PA[id], b = PB[id], r = {};
      if (a && b) r = { x:lerp(a.x, b.x, k), y:lerp(a.y || 0, b.y || 0, k), dy:0, a:1 };
      else if (b) r = { x:b.x + 60 * (1 - k), y:(b.y || 0) - 70 * (1 - k), dy:-70 * (1 - k), a:k };
      else r = { x:a.x - 60 * k, y:(a.y || 0) - 70 * k, dy:-70 * k, a:1 - k };
      r.anti = (b || a).anti; r.aa = (b || a).aa;
      if (isT) delete r.y;
      out[id] = r;
    }
  }
  both(A.tr, B.tr, o.tr, true); both(A.bd, B.bd, o.bd, false);
  return o;
}
function tRNAsvg(t){
  var x = t.x, g = line(x, 112, x, 130, "ps-tst") + '<path class="ps-tb" d="M' + f1(x - 16) + ' 130 h32 v40 q0 6 -6 6 h-20 q-6 0 -6 -6 Z"/>';
  for (var j = 0; j < 3; j++) g += txt(f1(x - 14 + 14 * j), 187, t.anti[j], "ps-ac", "middle");
  return grp({ a:t.a, dy:t.dy }, g);
}
function beadSVG(b, r){ r = r || 12; return grp({ a:b.a }, sv("circle", { cx:b.x, cy:b.y, r:r, "class":"ps-bd" }) + (r > 8 ? txt(b.x, f1(b.y + 3), b.aa, "ps-bdt", "middle") : "")); }
function lineSVG(o, bases, F){
  var h = "", n = bases.length, i, x, id;
  // large subunit (outline) with the three site boxes
  h += grp({ a:o.lg, dy:o.lgY || 0.001 }, rect(198, 84, 164, 104, 34, "ps-lsu") + ["E", "P", "A"].map(function(s){ return rect(SX[s] - 21, 120, 42, 68, 4, "ps-sb"); }).join("") + txt(204, 98, "large subunit", "ps-sub"));
  // mRNA
  if (n) {
    var x0 = bx(0, o.off), x1 = bx(n - 1, o.off);
    h += rect(f1(x0 - 8), 190, f1(x1 - x0 + 16), 20, 4, "ps-mr") + txt(f1(x0 - 11), 204, "5′", "ps-end", "end") + txt(f1(x1 + 11), 204, "3′", "ps-end");
    for (i = 0; i < n; i++) { x = bx(i, o.off); if (x < -10 || x > 570) continue; h += txt(f1(x), 204, bases[i], o.fs != null && i < o.fs ? "ps-b ps-b0" : "ps-b", "middle"); }
    if (o.fs != null) for (i = o.fs; i <= n; i += 3) { x = bx(i, o.off) - 7; if (x > -5 && x < 565) h += line(f1(x), 192, f1(x), 208, "ps-div"); }
  }
  // small subunit with the site labels (E, P, A in --ink)
  h += grp({ a:o.sm, dy:o.smY || 0.001 }, rect(206, 212, 148, 36, 18, "ps-ssu") + txt(SX.E, 236, "E", "ps-site", "middle") + txt(SX.P, 236, "P", "ps-site", "middle") + txt(SX.A, 236, "A", "ps-site", "middle") + txt(358, 246, "small subunit", "ps-sub"));
  for (id in o.tr) h += tRNAsvg(o.tr[id]);
  // release factor (a protein, --ink-2 outline)
  if (o.rf > 0.01) h += grp({ a:o.rf, dx:60 * (1 - o.rf), dy:-70 * (1 - o.rf) }, '<path class="ps-rf" d="M' + (SX.A - 15) + " 112 h30 v58 q0 6 -6 6 h-18 q-6 0 -6 -6 Z\"/>" + txt(SX.A, 150, "RF", "ps-rft", "middle") + txt(SX.A + 22, 112, "release factor", "ps-sub"));
  for (id in o.bd) h += beadSVG(o.bd[id]);
  if (o.free && o.chain.length) h += txt(14, 34, "N", "ps-nc", "middle") + txt(34 + 27 * o.chain.length - 7, 34, "C", "ps-nc") + txt(20, 60, "Released: " + chainText(o.chain), "ps-lab");
  if (F && F.stall === "rf") h += txt(SX.A, 150, "no", "ps-warn", "middle") + txt(SX.A, 163, "RF", "ps-warn", "middle");
  if (F && F.stall === "end") h += txt(SX.A, 156, "end", "ps-warn", "middle");
  if (F && F.stall === "abx") h += '<path class="ps-drug" d="M' + (SX.A + 34) + " 222 l10 -6 l10 6 v12 l-10 6 l-10 -6 Z\"/>" + txt(SX.A + 44, 258, "antibiotic", "ps-sub", "middle");
  return h;
}

// ---------- polyribosome view (S2, many-ribosome form): copy time 30 s, one loading every gap s ----------
var COPY = 30;
function polySVG(t, nR, gap, nAA){
  var h = "", L0 = 40, L1 = 520, y = 200, done = 0, on = 0, i, j;
  h += line(L0, y, L1, y, "ps-mrl") + txt(L0 - 8, y + 4, "5′", "ps-end", "end") + txt(L1 + 8, y + 4, "3′", "ps-end") + txt(L0, y + 28, "mRNA", "ps-sub");
  h += txt(20, 22, "Finished polypeptides", "ps-lab");
  for (i = 0; i < nR; i++) {
    var Li = i * gap; if (t < Li - 1e-9) continue;
    var p = (t - Li) / COPY;
    if (p >= 1 - 1e-9) {
      var cx0 = 24 + (done % 4) * 130, cy0 = 40 + Math.floor(done / 4) * 22;
      for (j = 0; j < nAA; j++) h += sv("circle", { cx:cx0 + 14 * j, cy:cy0, r:6, "class":"ps-bd" });
      done++; continue;
    }
    on++;
    var x = L0 + 14 + (L1 - L0 - 28) * p, nb = Math.min(nAA, 1 + Math.floor(p * nAA));
    h += ell(x, y + 10, 17, 8, "ps-ssu") + ell(x, y - 12, 21, 13, "ps-lsu");
    for (j = 0; j < nb; j++) h += sv("circle", { cx:f1(x - 3 * j), cy:f1(y - 32 - 12 * j), r:6, "class":"ps-bd" });
  }
  h += txt(540, 22, "t = " + Math.round(t) + " s", "ps-lab", "end");
  return { h:h, done:done, on:on };
}

// ---------- bacterium vs eukaryote view: time steps 0–20 ----------
var U_END = 20;
function riboMini(x, y, nb){ var h = ell(x, y + 7, 11, 5.5, "ps-ssu") + ell(x, y - 7, 13, 8, "ps-lsu"); for (var j = 0; j < nb; j++) h += sv("circle", { cx:f1(x), cy:f1(y - 20 - 9 * j), r:4.2, "class":"ps-bd" }); return h; }
function cellsSVG(u){
  var h = "", i, d, xr, uj, res = { bOn:0, bDone:0, eOn:0, eDone:0, bTx:u < 12, ePh:"" };
  // bacterium
  h += txt(136, 22, "Bacterium (no nucleus)", "ps-lab", "middle") + rect(8, 32, 256, 218, 40, "ps-cell");
  h += line(30, 78, 242, 78, "ps-dna") + txt(30, 70, "DNA", "ps-sub");
  var xp = 36 + 186 * clamp(u / 12, 0, 1);
  h += '<polyline class="ps-mrl" points="' + (u < 12 ? f1(xp) + ",86 " + f1(xp) + ",98 36,98" : "36,98 222,98") + '"/>' + txt(30, 102, "5′", "ps-end", "end");
  h += grp({ a:u < 12 ? 1 : 0.35 }, ell(xp, 78, 15, 10, "ps-pol")) + (u < 12 ? txt(f1(clamp(xp, 70, 200)), 60, "RNA polymerase", "ps-sub", "middle") : "");
  for (i = 0, d = 0; i < 5; i++) {
    uj = 1.6 + 2 * i; if (u < uj) continue;
    xr = 46 + 13 * (u - uj);
    if (u < 12) xr = Math.min(xr, xp - 24);
    if (xr >= 212) { res.bDone++; h += line(36 + 44 * d, 214, 64 + 44 * d, 214, "ps-chn"); d++; continue; }
    res.bOn++; h += riboMini(f1(xr), 112, Math.min(4, 1 + Math.floor((xr - 46) / 42)));
  }
  h += txt(136, 238, res.bDone ? "finished proteins" : "", "ps-sub", "middle");
  // eukaryote
  h += txt(426, 22, "Eukaryote", "ps-lab", "middle") + rect(298, 32, 256, 218, 40, "ps-cell");
  h += ell(380, 118, 66, 60, "ps-nuc") + txt(380, 72, "nucleus", "ps-sub", "middle") + line(444, 108, 448, 108, "ps-pore") + line(444, 128, 448, 128, "ps-pore");
  h += line(332, 98, 428, 98, "ps-dna") + txt(334, 90, "DNA", "ps-sub");
  var ep = 334 + 90 * clamp(u / 7, 0, 1), ex = clamp((u - 9) / 3, 0, 1);
  if (u < 9) {
    h += line(334, 118, f1(ep), 118, "ps-mrl");
    if (u < 8) { h += line(356, 118, Math.min(ep, 368), 118, "ps-intron"); if (ep > 394) h += line(394, 118, Math.min(ep, 404), 118, "ps-intron"); }
    if (u >= 8) h += txt(380, 138, "cap and tail added; introns cut out", "ps-sub", "middle");
    res.ePh = u < 7 ? "RNA polymerase is making the mRNA in the nucleus" : "the mRNA is being processed in the nucleus";
  } else {
    var sx = lerp(334, 452, ex), sy = lerp(118, 206, ex);
    h += line(f1(sx), f1(sy), f1(sx + 88), f1(sy), "ps-mrl");
    res.ePh = ex < 1 ? "the mRNA is leaving through a nuclear pore" : "the mRNA is in the cytoplasm";
  }
  h += grp({ a:u < 7 ? 1 : 0.35 }, ell(ep, 98, 13, 9, "ps-pol"));
  for (i = 0, d = 0; i < 4; i++) {
    uj = 12.4 + 1.7 * i; if (u < uj) continue;
    xr = 458 + 11 * (u - uj);
    if (xr >= 534) { res.eDone++; h += line(318 + 40 * d, 238, 344 + 40 * d, 238, "ps-chn"); d++; continue; }
    res.eOn++; h += riboMini(f1(xr), 214, Math.min(4, 1 + Math.floor((xr - 458) / 20)));
  }
  h += txt(450, 166, "cytoplasm", "ps-sub", "middle");
  res.h = h;
  return res;
}

// ---------- Explore: Ribosome assembly line ----------
var EXF = null;
function explore(host, api){
  var S = api.S, X = api.content, MSG = X.messages, CH = X.challenges;
  if (!S.mode) S.mode = "line";
  if (!S.msg) S.msg = "m1";
  if (S.own == null) S.own = "AUGUUUGGAUAA";
  if (!S.st) S.st = {};
  if (S.speed == null) S.speed = 1;
  if (S.nR == null) S.nR = 5;
  if (S.gap == null) S.gap = 5;
  if (S.t == null) S.t = 0;
  if (S.u == null) S.u = 0;
  if (S.fi == null) S.fi = 0;
  var F = [], disp = null, anim = null, playing = false, pend = null, timer = null, liveSig = "";
  host.innerHTML = '<div class="pg ps-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="ps-stage" id="ps-stage"><svg viewBox="0 0 560 262" class="ps-svg" role="img" focusable="false"><g class="ps-dyn"></g></svg></div>' +
      '<p class="ps-cap" id="ps-cap"></p><div id="ps-startw"></div><p class="vh" id="ps-live" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div class="ps-row" id="ps-mode"></div>' +
      '<div id="ps-msgw"><div class="ps-row" id="ps-msg"></div><p class="ps-seq" id="ps-seqshow"></p></div>' +
      '<div class="ps-build" id="ps-build"><div class="ps-pal" role="group" aria-label="Add a base">' + "ACGU".split("").map(function(b){ return '<button type="button" class="chip ps-bch" data-add="' + b + '" data-k="add' + b + '">' + b + "</button>"; }).join("") +
        '<button type="button" class="btn ghost sm" data-add="del" data-k="adddel">Delete</button><button type="button" class="btn ghost sm" data-add="clr" data-k="addclr">Clear</button></div><p class="tiny muted">' + X.buildNote + "</p></div>" +
      '<div class="player ps-player" id="ps-player" role="group" aria-label="Step through translation (← and → keys work here)"><button type="button" class="btn ghost sm" id="ps-back" data-k="psback">Back</button><button type="button" class="btn primary sm" id="ps-step" data-k="psstep">Step</button>' +
        (MV.reduceMotion ? "" : '<button type="button" class="btn ghost sm" id="ps-play" data-k="psplay">Play</button>') + '<button type="button" class="btn ghost sm" id="ps-reset" data-k="psreset">Reset</button></div>' +
      '<label class="ps-sl"><span class="rg-lab">Speed</span> <input type="range" id="ps-speed" min="0.5" max="2" step="0.25"> <output id="ps-speedo"></output></label>' +
      '<div class="ps-panel" id="ps-polyc"><label class="ps-sl"><span class="rg-lab">Ribosomes</span> <input type="range" id="ps-nr" min="1" max="8" step="1"> <output id="ps-nro"></output></label>' +
        '<label class="ps-sl"><span class="rg-lab">Gap between loadings</span> <input type="range" id="ps-gap" min="3" max="10" step="1"> <output id="ps-gapo"></output></label><p class="tiny muted">' + X.polyNote + "</p></div>" +
      '<div class="ps-panel" id="ps-blk" role="group" aria-label="Blockers"><span class="rg-lab">Blockers</span><label class="ps-chk"><input type="checkbox" id="ps-norf"> <span>No release factor</span></label><label class="ps-chk"><input type="checkbox" id="ps-abx"> <span>Antibiotic on the small subunit (bacterial ribosome)</span></label></div>' +
      '<p class="tiny muted" id="ps-cellnote">' + X.cellNote + "</p>" +
      codonTable() + '<p class="tiny muted">' + X.gtpNote + "</p></div>" +
    '<div class="pg-read"><dl class="read" id="ps-read"></dl></div></div>';
  var svg = $("svg", host), dyn = $(".ps-dyn", host);
  var modeR = radios($("#ps-mode", host), { label:"Mode", key:"m", options:[{ id:"line", t:"Assembly line" }, { id:"poly", t:"Polyribosome" }, { id:"cells", t:"Bacterium vs eukaryote" }], value:S.mode,
    onChange:function(m){ stopAll(); S.mode = m; disp = null; changed(true); } });
  var msgR = radios($("#ps-msg", host), { label:"Message", key:"s", cls:"chips", options:MSG.map(function(m){ return { id:m.id, t:m.t }; }), value:S.msg,
    onChange:function(m){ stopAll(); S.msg = m; rebuild(); S.t = 0; changed(true); } });
  var spd = $("#ps-speed", host), nr = $("#ps-nr", host), gp = $("#ps-gap", host), norf = $("#ps-norf", host), abx = $("#ps-abx", host);
  spd.value = S.speed; nr.value = S.nR; gp.value = S.gap; norf.checked = !!S.noRF; abx.checked = !!S.abx;
  spd.addEventListener("input", function(){ S.speed = +spd.value; api.save(); syncOut(); });
  nr.addEventListener("input", function(){ stopAll(); S.nR = +nr.value; S.t = Math.min(S.t, tEnd()); changed(); });
  gp.addEventListener("input", function(){ stopAll(); S.gap = +gp.value; S.t = Math.min(S.t, tEnd()); changed(); });
  norf.addEventListener("change", function(){ stopAll(); S.noRF = norf.checked; rebuild(true); changed(); });
  abx.addEventListener("change", function(){ stopAll(); S.abx = abx.checked; rebuild(); changed(); });
  $("#ps-build", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-add]"); if (!b || b.disabled) return;
    stopAll();
    var v = b.dataset.add;
    if (v === "del") S.own = S.own.slice(0, -1); else if (v === "clr") S.own = ""; else if (S.own.length < 18) S.own += v;
    if (S.st.own != null && S.st.own > S.own.length - 1) S.st.own = null;
    rebuild(); changed();
  });
  $("#ps-startw", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-sb]"); if (!b || b.disabled) return;
    stopAll(); var v = +b.dataset.sb; S.st[S.msg] = v < 0 ? null : v; rebuild(); changed();
  });
  $("#ps-step", host).addEventListener("click", function(){ stopPlay(); fwd(); });
  $("#ps-back", host).addEventListener("click", function(){ stopPlay(); back(); });
  $("#ps-reset", host).addEventListener("click", function(){ stopAll(); if (S.mode === "line") { S.fi = 0; disp = null; } else if (S.mode === "poly") S.t = 0; else S.u = 0; changed(); });
  var playB = $("#ps-play", host);
  if (playB) playB.addEventListener("click", function(){ if (playing) { stopPlay(); return; } startPlay(); });
  $("#ps-player", host).addEventListener("keydown", function(e){
    if (e.key === "ArrowRight") { e.preventDefault(); stopPlay(); fwd(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); stopPlay(); back(); }
  });

  function cur(){ return byId(MSG, S.msg); }
  function bases(){ var m = cur(); return m.seq || S.own; }
  function stOf(){ var m = cur(); return m.pick && S.st[m.id] != null ? S.st[m.id] : null; }
  function rebuild(keep){ F = buildFrames(bases(), { st:stOf(), noRF:!!S.noRF, abx:!!S.abx }); S.fi = keep ? clamp(S.fi, 0, F.length - 1) : 0; disp = null; }
  function fr(){ return F[clamp(S.fi, 0, F.length - 1)]; }
  function orfAA(){ var f0 = F[0], out = []; for (var i = 0; i < f0.cods.length; i++) { var a = aaOf(f0.cods[i]); if (a === "stop") return { aa:out, stop:true }; out.push(a); } return { aa:out, stop:false }; }
  function tEnd(){ return (S.nR - 1) * S.gap + COPY; }
  function nREff(){ var o = orfAA(); return o.stop && o.aa.length ? S.nR : 0; }
  function changed(full){ api.save(); paint(full); MV.changed(); }

  // ---- stepping ----
  function stepTo(i, cb){
    i = clamp(i, 0, F.length - 1);
    if (anim) { anim(); anim = null; }
    var from = disp || lay(fr());
    S.fi = i; api.save();
    var to = lay(F[i]);
    anim = MV.tween({ dur:700 / S.speed, step:function(k){ disp = mix(from, to, k); drawLine(); }, done:function(){ anim = null; disp = to; paint(); MV.changed(); say(); if (cb) cb(); } });
  }
  function tweenVal(key, to, ms, cb){
    if (anim) { anim(); anim = null; }
    var from = S[key];
    anim = MV.tween({ dur:ms, ease:function(t){ return t; }, step:function(k){ S[key] = lerp(from, to, k); drawStage(); paintRead(); }, done:function(){ anim = null; S[key] = to; api.save(); paint(); MV.changed(); say(); if (cb) cb(); } });
  }
  function fwd(){
    if (S.mode === "line") { if (S.fi < F.length - 1) stepTo(S.fi + 1); }
    else if (S.mode === "poly") { S.t = Math.min(tEnd(), Math.floor(S.t + 1e-6) + 1); changed(); say(); }
    else { S.u = Math.min(U_END, Math.floor(S.u + 1e-6) + 1); changed(); say(); }
  }
  function back(){
    if (anim) { anim(); anim = null; }
    if (S.mode === "line") { if (S.fi > 0) { S.fi--; disp = null; } changed(); say(); }
    else if (S.mode === "poly") { S.t = Math.max(0, Math.ceil(S.t - 1e-6) - 1); changed(); say(); }
    else { S.u = Math.max(0, Math.ceil(S.u - 1e-6) - 1); changed(); say(); }
  }
  function startPlay(){
    playing = true; sync();
    if (S.mode === "line") {
      if (S.fi >= F.length - 1) { S.fi = 0; disp = null; paint(); }
      (function loop(){ if (!playing) return; if (S.fi >= F.length - 1) { stopPlay(); return; } stepTo(S.fi + 1, function(){ if (playing) timer = setTimeout(loop, 300 / S.speed); }); })();
    } else if (S.mode === "poly") {
      if (S.t >= tEnd()) S.t = 0;
      tweenVal("t", tEnd(), (tEnd() - S.t) * 140 / S.speed, function(){ stopPlay(); });
    } else {
      if (S.u >= U_END) S.u = 0;
      tweenVal("u", U_END, (U_END - S.u) * 380 / S.speed, function(){ stopPlay(); });
    }
  }
  function stopPlay(){ if (!playing) return; playing = false; clearTimeout(timer); timer = null; if (anim && S.mode !== "line") { anim(); anim = null; api.save(); paint(); } sync(); }
  function stopAll(){ playing = false; clearTimeout(timer); timer = null; if (anim) { anim(); anim = null; } sync(); }

  // ---- painting ----
  function drawLine(){ dyn.innerHTML = lineSVG(disp || lay(fr()), bases(), anim ? null : fr()); }
  function drawStage(){
    if (S.mode === "line") { drawLine(); svg.setAttribute("aria-label", "Ribosome assembly line. " + describe()); return; }
    if (S.mode === "poly") { var o = orfAA(); dyn.innerHTML = polySVG(S.t, o.stop && o.aa.length ? S.nR : 0, S.gap, o.aa.length).h; }
    else dyn.innerHTML = cellsSVG(S.u).h;
    svg.setAttribute("aria-label", describe());
  }
  function describe(){
    if (S.mode === "line") { var f = fr(); return f.stage + ". Chain: " + chainText(f.chain) + "."; }
    if (S.mode === "poly") { var r = polySVG(S.t, nREff(), S.gap, 1); return "Polyribosome at " + Math.round(S.t) + " s: " + r.on + " ribosomes on the mRNA, " + r.done + " polypeptides finished."; }
    var c = cellsSVG(S.u); return "Time step " + Math.round(S.u) + " of " + U_END + ". Bacterium: " + (c.bTx ? "RNA polymerase still transcribing" : "transcription finished") + ", " + c.bOn + " ribosomes translating. Eukaryote: " + c.ePh + ", " + c.eOn + " ribosomes translating.";
  }
  function say(){ var d = describe(); if (d !== liveSig) { liveSig = d; $("#ps-live", host).textContent = d; } }
  function capText(){
    if (S.mode === "line") return fr().stage;
    if (S.mode === "poly") { var o = orfAA(); return o.stop && o.aa.length ? "Polyribosome: " + S.nR + " ribosome" + (S.nR > 1 ? "s" : "") + ", one loading every " + S.gap + " s. Each makes " + chainText(o.aa) + "." : "This message has no start-to-stop reading frame, so no ribosome can make a polypeptide. Choose M1, M2 or a message with AUG and a stop codon."; }
    return "Same gene, two kinds of cell. Bacterium: " + (S.u < 12 ? "transcription is still running." : "transcription has finished.") + " Eukaryote: " + cellsSVG(S.u).ePh + ".";
  }
  function paintRead(){
    var rows;
    if (S.mode === "line") {
      var f = fr(), b = bases(), aCod = f.large || f.kind === "stall" ? b.substr(f.off + 3, 3) : "", aRow = "—";
      if (f.large) {
        if (aCod.length < 3) aRow = "empty (end of the mRNA)";
        else { var aa = aaOf(aCod); aRow = aCod + " (" + aa + ")" + (f.rf ? ": release factor" : f.t.A ? ": tRNA paired" : ": empty"); }
      }
      var P = f.t.P, E = f.t.E;
      var pRow = P ? "anticodon 3′-" + P.anti + "-5′" + (f.on === "P" ? ", holding " + chainText(f.chain) : " (empty)") : "none";
      if (f.on === "A") pRow += "; the chain is now on the A-site tRNA (" + chainText(f.chain) + ")";
      var lead = f.fs != null && f.fs > 0 ? " · " + f.fs + " base" + (f.fs > 1 ? "s" : "") + " before the start not translated" : "";
      rows = [["Stage", f.stage], ["Codon in A site", aRow], ["tRNA in P site", pRow], ["tRNA leaving E site", E ? "anticodon 3′-" + E.anti + "-5′" : "none"],
        ["Peptide bonds made", f.bonds], ["Codons read", f.start >= 0 ? f.read + " of " + f.total + (f.start >= 0 && b.substr(f.start, 3) === "AUG" ? " (from AUG)" : " (from the chosen start)") + lead : "0 (no AUG)"],
        ["Polypeptides finished", f.done ? 1 : 0]];
    } else if (S.mode === "poly") {
      var r = polySVG(S.t, nREff(), S.gap, 1);
      rows = [["Stage", "Polyribosome"], ["Clock", Math.round(S.t) + " s (of " + tEnd() + " s)"], ["Ribosomes loaded", Math.min(S.nR, Math.floor(S.t / S.gap + 1e-9) + 1) + " of " + S.nR],
        ["Ribosomes on the mRNA", r.on], ["Polypeptides finished", r.done]];
    } else {
      var c = cellsSVG(S.u);
      rows = [["Time step", Math.round(S.u) + " of " + U_END], ["Bacterium", (c.bTx ? "RNA polymerase still transcribing" : "transcription finished") + " · " + c.bOn + " ribosome" + (c.bOn === 1 ? "" : "s") + " translating · " + c.bDone + " finished"],
        ["Eukaryote", c.ePh + " · " + c.eOn + " ribosome" + (c.eOn === 1 ? "" : "s") + " translating · " + c.eDone + " finished"]];
    }
    $("#ps-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintStart(){
    var w = $("#ps-startw", host), m = cur(), b = bases();
    if (S.mode !== "line" || !m.pick || !b.length) { w.innerHTML = ""; return; }
    var st = stOf(), lock = !!pend;
    var h = '<p class="tiny muted">' + X.startNote + '</p><div class="ps-start" role="group" aria-label="Start position"><button type="button" class="btn ghost sm" data-sb="-1" data-k="sb-1" aria-pressed="' + (st == null) + '"' + (lock ? " disabled" : "") + ">Scan from 5′ end</button>" +
      b.split("").map(function(c, i){ return '<button type="button" class="ps-sbb" data-sb="' + i + '" data-k="sb' + i + '" aria-pressed="' + (st === i) + '" aria-label="Start at base ' + (i + 1) + ": " + c + '"' + (lock ? " disabled" : "") + "><small>" + (i + 1) + "</small>" + c + "</button>"; }).join("") + "</div>";
    MV.keepFocus(w, function(){ w.innerHTML = h; });
  }
  function syncOut(){ $("#ps-speedo", host).textContent = S.speed + "×"; $("#ps-nro", host).textContent = S.nR; $("#ps-gapo", host).textContent = S.gap + " s"; }
  function sync(){
    var lock = !!pend, line_ = S.mode === "line";
    modeR.set(S.mode); msgR.set(S.msg); modeR.disable(lock); msgR.disable(lock);
    $("#ps-msgw", host).hidden = S.mode === "cells";
    $("#ps-build", host).hidden = S.msg !== "own" || S.mode === "cells";
    $$("[data-add]", host).forEach(function(b){ b.disabled = lock || (b.dataset.add.length === 1 && S.own.length >= 18); });
    $("#ps-polyc", host).hidden = S.mode !== "poly"; $("#ps-blk", host).hidden = !line_; $("#ps-cellnote", host).hidden = S.mode !== "cells";
    nr.disabled = gp.disabled = norf.disabled = abx.disabled = lock;
    var atEnd = line_ ? S.fi >= F.length - 1 : S.mode === "poly" ? S.t >= tEnd() - 1e-6 : S.u >= U_END - 1e-6, atStart = line_ ? S.fi <= 0 : S.mode === "poly" ? S.t <= 1e-6 : S.u <= 1e-6;
    $("#ps-step", host).disabled = lock || atEnd; $("#ps-back", host).disabled = lock || atStart; $("#ps-reset", host).disabled = lock;
    if (playB) { playB.textContent = playing ? "Pause" : "Play"; playB.disabled = lock; playB.setAttribute("aria-pressed", playing); }
    var m = cur(); $("#ps-seqshow", host).textContent = m.show || (S.own ? "5′-" + trip(S.own) + "-3′" : "(empty: tap bases to build a message)");
    norf.checked = !!S.noRF; abx.checked = !!S.abx; spd.value = S.speed; nr.value = S.nR; gp.value = S.gap; syncOut();
  }
  function paint(full){ sync(); drawStage(); paintRead(); paintStart(); $("#ps-cap", host).textContent = capText(); }

  // ---- challenges (plan: exact tests and named wrong states) ----
  function chal(id){
    var f = fr(), C = byId(CH, id);
    if (id === "tc1") {
      if (S.mode !== "line" || S.msg !== "m1" || S.abx) return { ok:false, msg:C.general };
      if (f.kind === "trans" && f.bonds === 2) return { ok:true };
      if (f.kind === "bond" && f.bonds === 2) return { ok:false, msg:C.early };
      if (f.kind === "arr" && f.read === 4) return { ok:false, msg:C.late };
      if (f.kind === "arr" && f.read === 3) return { ok:false, msg:"The Gly-tRNA has arrived in the A site, but the bond hasn’t formed yet and the ribosome hasn’t moved." };
      return { ok:false, msg:"The P site holds " + (f.on === "P" ? chainText(f.chain) : "no chain") + ". " + (f.bonds < 2 || f.kind === "ready" ? "Keep stepping." : "Step back.") };
    }
    if (id === "tc2") {
      var b = S.own;
      if (S.msg !== "own") return { ok:false, msg:C.general };
      if (b.length !== 12) return { ok:false, msg:"Your message has " + b.length + " base" + (b.length === 1 ? "" : "s") + ". A 4-codon message has exactly 12." };
      var c = [0, 3, 6, 9].map(function(i){ return b.substr(i, 3); });
      if (c[0] !== "AUG") return { ok:false, msg:C.noAug };
      if (c[1] === "UGA") return { ok:false, msg:C.uga };
      var want = ["Met", "Trp", "Lys", "stop"];
      for (var i = 1; i < 4; i++) { var a = aaOf(c[i]); if (a !== want[i]) return { ok:false, msg:"Codon " + (i + 1) + " (" + c[i] + ") is " + (a === "stop" ? "a stop" : a) + "; it should be " + (want[i] === "stop" ? "a stop codon" : want[i]) + "." }; }
      return { ok:true };
    }
    if (id === "tc3") {
      if (S.mode !== "line" || S.msg !== "m3") return { ok:false, msg:C.general };
      var st = stOf(), eff = st == null ? F[0].start : st;
      if (eff === 0) return { ok:false, msg:C.base1 };
      if (eff === 5) return { ok:false, msg:C.aug2 };
      if (eff !== 1) return { ok:false, msg:"That start doesn’t begin with an AUG. A scanning ribosome begins at the first AUG from the 5′ end." };
      if (S.noRF || S.abx) return { ok:false, msg:"Switch off the blockers so the ribosome can finish." };
      if (f.kind !== "sep") return { ok:false, msg:C.run };
      return { ok:true };
    }
    return { ok:false };
  }

  rebuild(true);
  EXF = { show:function(v){ if (!v) stopAll(); else paint(); } };
  paint(); say();
  function runFrames(n, cb){ var left = n; (function nx(){ if (left-- <= 0 || S.fi >= F.length - 1) { cb(); return; } stepTo(S.fi + 1, function(){ MV.wait(250, nx); }); })(); }
  function idx(kind, test){ for (var i = 0; i < F.length; i++) if (F[i].kind === kind && (!test || test(F[i]))) return i; return F.length - 1; }
  return {
    predict:{
      start:function(p){
        stopAll();
        if (p.id === "p1" || p.id === "p2") { S.mode = "line"; S.msg = "m1"; S.noRF = false; S.abx = false; rebuild(); if (p.id === "p2") S.fi = idx("rf") - 1; }
        else if (p.id === "p3") { S.mode = "poly"; S.msg = "m1"; S.nR = 5; S.t = 0; rebuild(); }
        else { S.mode = "cells"; S.u = 0; }
        disp = null; changed(true);
      },
      run:function(p, done){
        pend = done; sync(); paintStart();
        function fin(){ var d = pend; pend = null; paint(); MV.changed(); if (d) d(); }
        if (p.id === "p1") runFrames(4, fin);
        else if (p.id === "p2") runFrames(3, function(){
          MV.wait(700, function(){ S.noRF = true; rebuild(); S.fi = idx("stall") - 1; disp = null; paint(); MV.wait(500, function(){ runFrames(1, fin); }); });
        });
        else if (p.id === "p3") { S.t = 0; tweenVal("t", tEnd(), 4200, fin); }
        else { S.u = 0; tweenVal("u", U_END, 6000, fin); }
      }
    },
    challenge:chal
  };
}

// ---------- hero: one mRNA from the 5′ end to release (storyboard); reduced motion: final frame with the labelled chain ----------
function hero(f){
  var box = $("#ps-hero"); if (!box) return;
  var cap = f && f.cap, B = "AUGUUUGGAAACUGGUAA", FR = buildFrames(B, { st:null });
  box.innerHTML = '<svg viewBox="0 0 560 262" class="ps-svg" aria-hidden="true" focusable="false"><g></g></svg>';
  var g = $("g", box);
  function show(o, F){ g.innerHTML = lineSVG(o, B, F); }
  function setCap(s){ if (cap && cap.textContent !== s) cap.textContent = s; }
  var last = FR[FR.length - 1];
  if (MV.reduceMotion) { show(lay(last), last); setCap("Met–Phe–Gly–Asn–Trp: released at UAA, and the subunits separate."); return; }
  var pre = lay(FR[0]); pre.off = -26;
  show(pre, FR[0]); setCap("An mRNA slides in.");
  var i = 0;
  function next(){
    if (i >= FR.length - 1) { setCap("Met–Phe–Gly–Asn–Trp: released at UAA, and the subunits separate."); return; }
    var A = lay(FR[i]), Bf = lay(FR[i + 1]); i++;
    setCap(FR[i].stage);
    MV.tween({ dur:620, step:function(k){ show(mix(A, Bf, k), null); }, done:function(){ show(Bf, FR[i]); setTimeout(next, 380); } });
  }
  setTimeout(function(){ MV.tween({ dur:1100, step:function(k){ show(mix(pre, lay(FR[0]), k), null); }, done:function(){ setTimeout(next, 300); } }); }, 600);
}

// ---------- Part 3: Decode it ----------
function part3(host, api){
  var P = api.content, S = api.S, s1 = P.s1, s2 = P.s2, s3 = P.s3;
  var COD = s1.coding, TPL = mapS(COD, DPAIR), MR = mapS(TPL, TRX);
  S.s1 = S.s1 || { given:null, fill:{}, src:"template", last:null, msg:null };
  S.s2 = S.s2 || { pick:null, tries:0 };
  S.s3 = S.s3 || { claim:null, ev:[], reason:null, res:null, tries:0 };
  host.innerHTML =
    '<section class="ps-sta" aria-labelledby="ps-s1h"><h3 id="ps-s1h">' + s1.title + "</h3><p>" + s1.text + '</p><div class="ps-row" id="ps-s1g"></div><div id="ps-s1"></div></section>' +
    '<section class="part ps-sta" aria-labelledby="ps-s2h"><h3 id="ps-s2h">' + s2.title + "</h3><p>" + s2.text + '</p><div id="ps-s2"></div></section>' +
    '<section class="part ps-sta" aria-labelledby="ps-s3h"><h3 id="ps-s3h">' + s3.title + "</h3><p>" + s3.text + "</p>" +
      '<details class="alg" open><summary>' + s3.dataTitle + '</summary><div class="tbl-wrap"><table class="ps-dt"><caption class="vh">Protein made by bacteria and human cells, with and without streptomycin</caption><thead><tr>' + s3.head.map(function(x){ return '<th scope="col">' + x + "</th>"; }).join("") + "</tr></thead><tbody>" +
        s3.rows.map(function(r){ return '<tr><th scope="row">' + r[0] + "</th>" + r.slice(1).map(function(c){ return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + '</tbody></table></div><p class="tiny muted">' + s3.caption + ' <span class="bio-model">Model data</span></p>' +
      '<div id="ps-s3"></div></details></section>' + codonTable();

  // ---- Station 1: three starting points (S5 sequence workbench) ----
  var given = radios($("#ps-s1g", host), { label:"You are given", key:"g", cls:"chips", options:s1.starts, value:S.s1.given || "",
    onChange:function(v){ S.s1.given = v; S.s1.fill = {}; S.s1.fill[v] = true; S.s1.msg = null; S.s1.last = null; api.save(); paintS1(); } });
  function row(id, lab, seq, ends, cls, act){
    var x = S.s1, on = x.fill[id];
    return '<div class="ps-wr"><span class="ps-wl">' + lab + '</span><span class="ps-ws ' + cls + '">' + (on ? ends[0] + trip(seq) + ends[1] : ends[0] + seq.replace(/./g, "·").replace(/(...)(?=.)/g, "$1 ") + ends[1]) + "</span>" + (on || !x.given ? "" : act) + "</div>";
  }
  function paintS1(){
    var x = S.s1, box = $("#ps-s1", host), h = "";
    if (!x.given) h = '<p class="tiny muted">Choose a starting point to begin.</p>';
    else {
      h += row("coding", "Coding strand", COD, ["5′-", "-3′"], "ps-cod", '<button type="button" class="btn ghost sm" data-s1="pc" data-k="s1pc">Pair with the template</button>');
      h += row("template", "Template strand", TPL, ["3′-", "-5′"], "ps-tpl", '<button type="button" class="btn ghost sm" data-s1="pt" data-k="s1pt">Pair to fill in</button>');
      h += row("mrna", "mRNA", MR, ["5′-", "-3′"], "ps-mrs", '<span class="ps-tx"><span class="rg-lab">Copy from</span><span class="rg chips" role="radiogroup" aria-label="Strand to copy">' +
        [["coding", "coding strand"], ["template", "template strand"]].map(function(o){ return '<button type="button" role="radio" aria-checked="' + (x.src === o[0]) + '" data-src="' + o[0] + '" data-k="s1src' + o[0] + '">' + o[1] + "</button>"; }).join("") +
        '</span><button type="button" class="btn primary sm" data-s1="tx" data-k="s1tx">Transcribe</button></span>');
      if (x.msg) h += MV.fbHTML(x.msg[0], x.msg[1]);
      if (x.fill.coding && x.fill.template && x.fill.mrna) {
        var ri = MV.right(s1.choices), done = x.last === ri;
        h += '<p class="ps-q"><strong>' + s1.q + '</strong></p><div class="sq-c ps-chs" role="group" aria-label="Choices">' + s1.choices.map(function(c, i){ return '<button type="button" class="chip' + (x.last === i ? " on" : "") + '" aria-pressed="' + (x.last === i) + '" data-s1c="' + i + '" data-k="s1c' + i + '"' + (done ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
        if (x.last != null) h += MV.fbHTML(done ? "good" : "bad", "<strong>" + (done ? "✓ Correct." : "✗ Not quite. Try another answer.") + "</strong> " + s1.choices[x.last].fb + (done ? " Try another starting point: the answer is the same gene every time." : ""));
      }
    }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  $("#ps-s1", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var x = S.s1;
    if (b.dataset.src) { x.src = b.dataset.src; api.save(); paintS1(); return; }
    if (b.dataset.s1c != null) { x.last = +b.dataset.s1c; api.save(); paintS1(); MV.focusFb($("#ps-s1", host)); return; }
    var a = b.dataset.s1;
    if (a === "pc") { if (x.fill.template) { x.fill.coding = true; x.msg = ["good", s1.pairFb]; } else x.msg = ["bad", "Pair with the template strand: fill it in first."]; }
    else if (a === "pt") { if (x.fill.coding) { x.fill.template = true; x.msg = ["good", s1.pairFb]; } else if (x.fill.mrna) { x.fill.template = true; x.msg = ["good", s1.fromMrna]; } else x.msg = ["bad", "Fill in another strand first."]; }
    else if (a === "tx") {
      if (x.src === "coding") x.msg = ["bad", "<strong>✗ Not quite.</strong> " + s1.transBad];
      else if (!x.fill.template) x.msg = ["bad", s1.needTemplate];
      else { x.fill.mrna = true; x.msg = ["good", s1.transGood]; }
    }
    api.save(); paintS1(); MV.focusFb($("#ps-s1", host));
  });
  $("#ps-s1", host).addEventListener("keydown", function(e){
    var b = e.target.closest("[data-src]"); if (!b || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return;
    e.preventDefault(); S.s1.src = S.s1.src === "coding" ? "template" : "coding"; api.save(); paintS1(); var nb = $('[data-src="' + S.s1.src + '"]', host); if (nb) nb.focus();
  });

  // ---- Station 2: find the frame ----
  var SEQ = s2.seq, FIRST = SEQ.indexOf("AUG");
  function paintS2(){
    var x = S.s2, box = $("#ps-s2", host), ok = x.pick === FIRST;
    var h = '<div class="ps-start ps-s2b" role="group" aria-label="Tap the start base">' + SEQ.split("").map(function(c, i){
      var cls = "ps-sbb" + (x.pick != null && i >= x.pick && (i - x.pick) % 3 === 0 && i > x.pick ? " ps-dv" : "") + (x.pick != null && i < x.pick ? " ps-pre" : "");
      return '<button type="button" class="' + cls + '" data-s2="' + i + '" data-k="s2b' + i + '" aria-pressed="' + (x.pick === i) + '" aria-label="Base ' + (i + 1) + ": " + c + '"' + (ok ? " disabled" : "") + "><small>" + (i + 1) + "</small>" + c + "</button>";
    }).join("") + "</div>";
    if (x.pick != null) {
      var cods = [], i; for (i = x.pick; i + 3 <= SEQ.length; i += 3) cods.push(SEQ.substr(i, 3));
      var tail = SEQ.slice(x.pick + 3 * cods.length);
      h += '<p class="ps-seq">5′-' + (x.pick ? '<span class="ps-pre">' + SEQ.slice(0, x.pick) + "</span> | " : "") + cods.join(" | ") + (tail ? " | " + tail : "") + "-3′</p>";
      if (ok) {
        var aas = []; for (i = 0; i < cods.length; i++) { var a = aaOf(cods[i]); if (a === "stop") break; aas.push(a); }
        h += '<p class="ps-prot"><span class="rg-lab">Protein</span> ' + aas.map(function(a){ return '<span class="ps-aa">' + a + "</span>"; }).join("–") + "</p>" + MV.fbHTML("good", "<strong>✓ Correct.</strong> " + s2.good);
      } else {
        var fb = x.pick === 0 ? s2.first : SEQ.substr(x.pick, 3) === "AUG" ? s2.laterAug : s2.notAug;
        h += MV.fbHTML("bad", "<strong>✗ Not yet.</strong> " + fb);
      }
    }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  $("#ps-s2", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-s2]"); if (!b || b.disabled) return;
    S.s2.pick = +b.dataset.s2; S.s2.tries++; api.save(); paintS2(); MV.focusFb($("#ps-s2", host));
  });

  // ---- Station 3: claim–evidence–reasoning (S12) on model data ----
  function chips(list, key, sel){ return list.map(function(c, i){ return '<button type="button" class="chip' + (sel === i ? " on" : "") + '" aria-pressed="' + (sel === i) + '" data-' + key + '="' + i + '" data-k="' + key + i + '">' + c.t + "</button>"; }).join(""); }
  function paintS3(){
    var x = S.s3, box = $("#ps-s3", host), done = x.res && x.res.all;
    var h = '<div class="ps-cer"><p class="ps-q"><strong>' + s3.claim.q + '</strong></p><div class="sq-c ps-chs" role="group" aria-label="Claim">' + chips(s3.claim.options, "cl", x.claim) + "</div>" +
      '<p class="ps-q"><strong>' + s3.evQ + '</strong></p><div class="sq-c ps-chs" role="group" aria-label="Evidence rows">' + s3.rows.map(function(r, i){ var on = x.ev.indexOf(i + 1) >= 0; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-ev="' + (i + 1) + '" data-k="ev' + i + '">Row ' + (i + 1) + "</button>"; }).join("") + "</div>" +
      '<p class="ps-q"><strong>' + s3.reason.q + '</strong></p><div class="sq-c ps-chs" role="group" aria-label="Reasoning">' + chips(s3.reason.options, "rs", x.reason) + "</div>" +
      (done ? "" : '<div class="q-actions"><button type="button" class="btn primary sm" data-cer="1" data-k="cerchk">Check</button></div>') + "</div>";
    if (x.res) {
      if (done) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + s3.done);
      else h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + [x.res.c ? "Claim ✓" : "Claim ✗ " + s3.claimFb, x.res.e ? "Evidence ✓" : "Evidence ✗ " + s3.evFb, x.res.r ? "Reasoning ✓" : "Reasoning ✗ " + s3.reasonFb].join(" · "));
    }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
    if (done) $$("button", box).forEach(function(b){ b.disabled = true; });
  }
  $("#ps-s3", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var x = S.s3;
    if (b.dataset.cl != null) x.claim = +b.dataset.cl;
    else if (b.dataset.rs != null) x.reason = +b.dataset.rs;
    else if (b.dataset.ev != null) { var r = +b.dataset.ev, k = x.ev.indexOf(r); if (k >= 0) x.ev.splice(k, 1); else x.ev.push(r); }
    else if (b.dataset.cer) {
      var c = x.claim === MV.right(s3.claim.options), ev = MV.ans(s3), e2 = ev.every(function(v){ return x.ev.indexOf(v) >= 0; }), rr = x.reason === MV.right(s3.reason.options);
      x.tries++; x.res = { c:c, e:e2, r:rr, all:c && e2 && rr }; api.save(); paintS3(); MV.focusFb($("#ps-s3", host)); return;
    }
    if (x.res && !x.res.all) x.res = null;
    api.save(); paintS3();
  });
  paintS1(); paintS2(); paintS3();
  return {};
}

// ---------- Practice 2: Decode set (@component chainBuilder — amino-acid chips build a chain; number entry for counts) ----------
function decodeSet(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { chain:[], val:"", tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">Build each polypeptide with the amino-acid chips (N-terminus first), or type a whole number. Then press Check.</p>' + codonTable() + a.items.map(function(it){ return '<div class="q" data-dc="' + it.id + '"></div>'; }).join("");
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = $('[data-dc="' + it.id + '"]', host);
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "chain") {
      h += '<p class="ps-chain" aria-live="polite"><span class="rg-lab">Your chain:</span> ' + (x.chain.length ? x.chain.map(function(c){ return '<span class="ps-aa' + (c === "stop" ? " ps-aastop" : "") + '">' + c + "</span>"; }).join("–") : '<span class="muted">(empty)</span>') + "</p>";
      if (!x.solved) h += '<div class="ps-aapal" role="group" aria-label="Amino acids">' + AALIST.concat(["stop"]).map(function(c){ return '<button type="button" class="chip ps-aab" data-aa="' + c + '" data-k="' + it.id + "aa" + c + '"' + (x.chain.length >= 8 ? " disabled" : "") + ">" + c + "</button>"; }).join("") +
        '<button type="button" class="btn ghost sm" data-act="undo" data-k="' + it.id + 'undo"' + (x.chain.length ? "" : " disabled") + '>Remove last</button><button type="button" class="btn ghost sm" data-act="clr" data-k="' + it.id + 'clr"' + (x.chain.length ? "" : " disabled") + ">Clear</button></div>";
    } else {
      h += '<div class="numrow"><label for="dc-' + it.id + '">Answer:</label><input class="numin" id="dc-' + it.id + '" data-dci="' + it.id + '" type="text" inputmode="numeric" autocomplete="off" value="' + MV.esc(x.val || "") + '"' + (x.solved ? " disabled" : "") + '><span class="ps-unit">' + it.unit + "</span></div>";
    }
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct" + (it.kind === "num" ? ": " + MV.ans(it) + " " + it.unit : "") + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML("bad", msgs[it.id]);
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.dci; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.dci) { var b = host.querySelector('[data-k="' + e.target.dataset.dci + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-dc]"); if (!box) return;
    var it = byId(a.items, box.dataset.dc), x = ist(it.id);
    if (b.dataset.aa) { x.chain.push(b.dataset.aa); msgs[it.id] = null; api.save(); paintItem(it); return; }
    if (b.dataset.act === "undo") { x.chain.pop(); msgs[it.id] = null; api.save(); paintItem(it); return; }
    if (b.dataset.act === "clr") { x.chain = []; msgs[it.id] = null; api.save(); paintItem(it); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it); return; }
    if (b.dataset.act !== "check") return;
    var ans = MV.ans(it), ok, named = null;
    if (it.kind === "chain") {
      if (!x.chain.length) { msgs[it.id] = "Build the chain first: tap the amino acids in order, starting from the N-terminus."; paintItem(it); return; }
      ok = x.chain.length === ans.length && x.chain.every(function(c, j){ return c === ans[j]; });
      if (!ok) named = (it.wrong || []).filter(function(w){ return w.match ? w.match.length === x.chain.length && w.match.every(function(c, j){ return c === x.chain[j]; }) : x.chain[0] === w.starts; })[0];
      if (!ok && !named && x.chain.indexOf("stop") >= 0) named = { fb:"A stop codon adds no amino acid: the chain ends just before it." };
    } else {
      var v = String(x.val || "").replace(/[\s,]/g, "");
      if (!/^\d+$/.test(v)) { msgs[it.id] = "Enter a whole number, such as 12."; paintItem(it); return; }
      v = +v; ok = v === ans;
      if (!ok) named = (it.wrong || []).filter(function(w){ return w.match === v; })[0];
    }
    if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
    else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (named ? named.fb : it.wrongDefault || "Check each codon against the table, reading in threes from AUG.") + " Try again."; }
    api.save(); paintItem(it); MV.focusFb(box);
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: One message, two codes (four codon slots of three base chips; live two-row translation) ----------
var task = (function(){
  var api = null, sel = 0;
  function st(){ var s = api.S; if (!s.b || s.b.length !== 12) s.b = ["", "", "", "", "", "", "", "", "", "", "", ""]; return s; }
  function read(){ if (!api) return { b:"" }; return { b:st().b.map(function(c){ return c || "_"; }).join("") }; }
  function cods(d){ return [0, 3, 6, 9].map(function(i){ return d.b.substr(i, 3); }); }
  function reading(d, mito){ var c = cods(d), out = [], ended = false; c.forEach(function(x, i){ if (ended) { out.push({ t:"(not read)", k:"off" }); return; } var a = aaOf(x, mito); if (!a) { out.push({ t:"?", k:"q" }); return; } out.push({ t:a, k:a === "stop" ? "stop" : "aa" }); if (a === "stop" && i < 3) ended = true; }); return out; }
  function test(d, mito){ var c = cods(d); return aaOf(c[1], mito) === "Pro" && aaOf(c[2], mito) === "Trp" && aaOf(c[3], mito) === "stop"; }
  function draw(inp){
    var s = st(), d = read(), box = $("#ps-tslots", inp);
    if (box) MV.keepFocus(box, function(){
      box.innerHTML = [0, 1, 2, 3].map(function(c){ return '<div class="ps-tcod" role="group" aria-label="Codon ' + (c + 1) + '"><span class="ps-tcl">Codon ' + (c + 1) + "</span>" + [0, 1, 2].map(function(j){ var i = 3 * c + j, v = s.b[i]; return '<button type="button" class="ps-tcell' + (sel === i ? " on" : "") + '" data-cell="' + i + '" data-k="tc' + i + '" aria-pressed="' + (sel === i) + '" aria-label="Codon ' + (c + 1) + ", base " + (j + 1) + ": " + (v || "empty") + '">' + (v || "·") + "</button>"; }).join("") + "</div>"; }).join("");
    });
    var pv = $("#ps-tpv");
    if (pv) {
      var rowH = function(lab, r){ return '<div class="ps-trow"><span class="ps-trl">' + lab + "</span>" + r.map(function(x){ return '<span class="ps-tr ps-tr-' + x.k + '">' + x.t + "</span>"; }).join("") + "</div>"; };
      var c = cods(d).map(function(x){ return x.replace(/_/g, "·"); });
      pv.innerHTML = '<h4 class="ps-th">Live translation</h4><div class="ps-trow"><span class="ps-trl">mRNA</span>' + c.map(function(x){ return '<span class="ps-tr ps-tr-m">' + x + "</span>"; }).join("") + "</div>" +
        rowH("Standard code (cytoplasm)", reading(d, false)) + rowH("Human mitochondria", reading(d, true));
      pv.setAttribute("aria-label", "Message " + c.join(" ") + ". Standard: " + reading(d, false).map(function(x){ return x.t; }).join(", ") + ". Mitochondria: " + reading(d, true).map(function(x){ return x.t; }).join(", ") + ".");
    }
  }
  function lab(k){ return trip(k); }
  return {
    render:function(inp, pv, a){
      api = a; st();
      inp.innerHTML = '<p class="tiny muted">Tap a base slot, then tap a base chip to fill it.</p><div class="ps-tslots" id="ps-tslots"></div>' +
        '<div class="ps-pal" role="group" aria-label="Bases">' + "ACGU".split("").map(function(b){ return '<button type="button" class="chip ps-bch" data-tb="' + b + '" data-k="tb' + b + '">' + b + "</button>"; }).join("") +
        '<button type="button" class="btn ghost sm" data-tb="clr" data-k="tbclr">Clear all</button></div>';
      pv.innerHTML = '<div class="ps-tpv" id="ps-tpv" role="group"></div>' + codonTable({ mito:(MV.C && MV.C.task && MV.C.task.mito) || "UGA = Trp; AGA, AGG = stop; AUA = Met." });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || b.disabled) return;
        var s = st();
        if (b.dataset.cell != null) { sel = +b.dataset.cell; draw(inp); return; }
        if (b.dataset.tb === "clr") { s.b = ["", "", "", "", "", "", "", "", "", "", "", ""]; sel = 0; }
        else if (b.dataset.tb) { s.b[sel] = b.dataset.tb; sel = Math.min(11, sel + 1); }
        else return;
        a.save(); draw(inp); a.update();
      });
      inp.addEventListener("keydown", function(e){
        var c = e.target.closest("[data-cell]"); if (!c) return;
        var k = (e.key || "").toUpperCase(), s = st();
        if ("ACGU".indexOf(k) >= 0 && k.length === 1) { e.preventDefault(); s.b[+c.dataset.cell] = k; sel = Math.min(11, +c.dataset.cell + 1); a.save(); draw(inp); a.update(); var n = inp.querySelector('[data-cell="' + sel + '"]'); if (n) n.focus(); }
        else if (e.key === "Backspace") { e.preventDefault(); s.b[+c.dataset.cell] = ""; a.save(); draw(inp); a.update(); }
      });
      draw(inp);
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return [cods(d)[0] === "AUG", test(d, false), test(d, true)]; },
    key:function(d){ return d.b; },
    label:lab,
    text:lab
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ decode:decodeSet },
  task:task,
  onShow:function(v){ if (EXF) EXF.show(v === "explore"); }
});
})();
