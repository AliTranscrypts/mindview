// SBI4U 28 Mutations: hero (substitution → insertion → UV dimer and repair), Mutation lab (S5 sequence workbench with live
// translation and a shared mutation classifier, S6 codon table, chromosome mutations, mutagen cards), Mutations with
// consequences (sickle-cell, cystic fibrosis, CCR5-Δ32, Ames test with S12 claim + evidence chips), Mutation detective,
// "Swap one amino acid" (task). The sorter and Spot the Error are toolkit activities.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small helpers (from SBI4U 21 / 15) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "mu-lab", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function lerp(a, b, t){ return a + (b - a) * t; }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function sqH(s){ return '<span class="mu-sq">' + s + "</span>"; }

// ---------- @component radioGroup (copied from SBI4U 21 / 15 / MHF4U 25: options may be disabled with dis:true) ----------
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

// ---------- @component S6 codonTable + translate / classify — the ONE shared translation and mutation-type classifier
// (plan §5), used by Explore, TC1–TC3, Mutation detective and the task. Sequences are coding-strand DNA strings.
//   aa1("GAG") -> "E"; nm("E") -> "Glu"; translate(s) -> { start, aa:["M", …], stop (ended at a stop codon), codons:[…] }
//   subEffect(orig, mut, k) -> { kind:"silent"|"missense"|"nonsense"|"stoplost"|"start", t } for codon k (0-based)
//   classify(tokens, log) -> { type, frame } (tokens: [{ b, o (original 1-based index, 0 = inserted) }])
//   codonTableHTML() -> the standard mRNA codon table (first base rows, second base columns) ----------
var CODE = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG", B4 = "TCAG";
var AA3 = { F:"Phe", L:"Leu", S:"Ser", Y:"Tyr", "*":"stop", C:"Cys", W:"Trp", P:"Pro", H:"His", Q:"Gln", R:"Arg", I:"Ile", M:"Met", T:"Thr", N:"Asn", K:"Lys", V:"Val", A:"Ala", D:"Asp", E:"Glu", G:"Gly" };
function aa1(c){ c = String(c).replace(/U/g, "T"); if (!/^[ACGT]{3}$/.test(c)) return "?"; return CODE[B4.indexOf(c[0]) * 16 + B4.indexOf(c[1]) * 4 + B4.indexOf(c[2])]; }
function nm(a){ return AA3[a] || a; }
function rna(s){ return String(s).replace(/T/g, "U"); }
function translate(s){
  var r = { start:s.slice(0, 3) === "ATG", aa:[], stop:false, codons:[] };
  if (!r.start) return r;
  for (var i = 0; i + 3 <= s.length; i += 3) { var c = s.substr(i, 3), a = aa1(c); r.codons.push(c); if (a === "*") { r.stop = true; break; } r.aa.push(a); }
  return r;
}
function protTxt(aa){ return aa.map(nm).join("–"); }
var GENE = "ATGCCAGAGTGGAAATGCTAA", NORM = translate(GENE);
function subEffect(orig, mut, k){
  var a0 = aa1(orig.substr(3 * k, 3)), a1 = aa1(mut.substr(3 * k, 3));
  if (k === 0 && mut.substr(0, 3) !== "ATG") return { kind:"start", t:"start codon lost: no protein" };
  if (a0 === a1) return { kind:"silent", t:"silent (" + nm(a0) + " → " + nm(a1) + ")" };
  if (a1 === "*") return { kind:"nonsense", t:"nonsense (" + nm(a0) + " → stop)" };
  if (a0 === "*") return { kind:"stoplost", t:"stop codon lost (stop → " + nm(a1) + "): the protein runs on" };
  return { kind:"missense", t:"missense (" + nm(a0) + " → " + nm(a1) + ")" };
}
function seqOf(tokens){ return tokens.map(function(t){ return t.b; }).join(""); }
function classify(tokens, log){
  var s = seqOf(tokens), d = tokens.length - GENE.length, nI = 0, nD = 0, subs = [];
  log.forEach(function(e){ if (e.t === "ins") nI++; else if (e.t === "del") nD++; else subs.push(e); });
  if (!log.length) return { type:"None: this is the normal gene", frame:"Unchanged" };
  var type, frame = "Unchanged";
  if (s.slice(0, 3) !== "ATG") type = "No start codon: no protein";
  else if (nI + nD) {
    var n = Math.abs(d), what = nI && nD ? "insertion and deletion" : (nI ? "insertion" : "deletion") + " of " + n + " base" + (n === 1 ? "" : "s");
    if (d % 3) type = "Frameshift (" + what + ")";
    else if (d === 0) type = "Insertion and deletion: the net length is unchanged";
    else type = "In-frame " + (nI ? "insertion" : "deletion") + " (" + n + " bases)";
    if (subs.length) type += ", plus " + subs.length + " substitution" + (subs.length > 1 ? "s" : "");
  } else {
    var ks = [];
    subs.forEach(function(e){ if (e.o) { var k = Math.floor((e.o - 1) / 3); if (ks.indexOf(k) < 0) ks.push(k); } });
    ks.sort(function(a, b){ return a - b; });
    type = (ks.length > 1 ? "Substitutions: " : "Substitution: ") + ks.map(function(k){ return (ks.length > 1 ? "codon " + (k + 1) + " " : "") + subEffect(GENE, s, k).t; }).join("; ");
    if (!ks.length) type = "Substitution in an inserted base";
  }
  if (nI + nD) {
    var have = {}, ins = 0, sh = [];
    tokens.forEach(function(t){ if (t.o) have[t.o] = 1; });
    tokens.forEach(function(t){
      if (!t.o) { ins++; return; }
      var del = 0; for (var q = 1; q < t.o; q++) if (!have[q]) del++;
      if ((((ins - del) % 3) + 3) % 3) { var c = Math.ceil(t.o / 3); if (sh.indexOf(c) < 0) sh.push(c); }
    });
    var last = tokens[tokens.length - 1], tail = false;
    if (last && last.o) { var dl = 0; for (var q2 = 1; q2 < last.o; q2++) if (!have[q2]) dl++; tail = !!((((ins - dl) % 3) + 3) % 3); } else tail = d % 3 !== 0;
    if (!sh.length) frame = "Unchanged" + (d ? " (one codon " + (d > 0 ? "added" : "lost") + ")" : "");
    else if (tail || d % 3) frame = "Shifted from codon " + Math.min.apply(null, sh);
    else { var a = Math.min.apply(null, sh), b = Math.max.apply(null, sh); frame = (a === b ? "Shifted in codon " + a : "Shifted from codon " + a + " to codon " + b) + ", then restored"; }
  }
  return { type:type, frame:frame };
}
function codonTableHTML(){
  var B = "UCAG", h = '<div class="tbl-wrap"><table class="mu-ct"><caption class="tiny">mRNA codons: first base (rows), second base (columns), third base (inside each cell)</caption><thead><tr><th scope="col">1st</th>' +
    B.split("").map(function(b){ return '<th scope="col">' + b + "</th>"; }).join("") + "</tr></thead><tbody>";
  B.split("").forEach(function(x){
    h += '<tr><th scope="row">' + x + "</th>" + B.split("").map(function(y){
      return "<td>" + B.split("").map(function(z){ var a = aa1(x + y + z); return '<span class="mu-ctc"><span class="mu-sq">' + x + y + z + "</span> " + (a === "*" ? "<strong>stop</strong>" : nm(a)) + "</span>"; }).join("") + "</td>";
    }).join("") + "</tr>";
  });
  return h + "</tbody></table></div>";
}
function fresh(){ return GENE.split("").map(function(b, i){ return { b:b, o:i + 1 }; }); }

// ---------- @component S5 sequenceWorkbench view — the gene as codon columns (coding strand buttons --ink-2, template --ink,
// mRNA teal, amino-acid beads brown; edited bases outlined in --hi; changed amino acids bold with a ring, never colour alone).
// geneHTML(tokens, { btn:true (bases are buttons), sel (selected index), tpl (show template), div (original frame lines),
//   rv (beads revealed so far; null = all), drop (index of a just-inserted base, animated) }) ----------
var COMP = { A:"T", T:"A", G:"C", C:"G" };
function geneHTML(tokens, o){
  o = o || {};
  var s = seqOf(tokens), T = translate(s), n = tokens.length, h = '<div class="mu-gene' + (o.tpl ? " mu-wt" : "") + '">';
  h += '<div class="mu-col mu-rowlab" aria-hidden="true"><span class="mu-n">&nbsp;</span><span class="mu-rl mu-rcd">Coding 5′</span>' + (o.tpl ? '<span class="mu-rl mu-rtp">Template 3′</span>' : "") + '<span class="mu-rl mu-rrn">mRNA 5′</span><span class="mu-rl mu-rpr">Protein</span></div>';
  for (var k = 0; k * 3 < n; k++) {
    var m = Math.min(3, n - 3 * k), cd = "", tp = "", rn = "", j;
    for (j = 0; j < m; j++) {
      var i = 3 * k + j, t = tokens[i], cls = (t.ed ? " mu-ed" : "") + (o.div && t.o > 1 && (t.o - 1) % 3 === 0 ? " mu-od" : "") + (o.drop === i ? " mu-drop" : "");
      var lab = "Position " + (i + 1) + ": " + t.b + (t.o ? (t.o !== i + 1 ? " (original base " + t.o + ")" : "") : " (inserted)") + (t.ed && t.o ? ", edited" : "");
      cd += o.btn ? '<button type="button" class="mu-b mu-cd' + cls + '" data-bi="' + i + '" data-k="mb' + i + '" aria-pressed="' + (o.sel === i) + '" tabindex="' + ((o.sel == null ? 0 : o.sel) === i ? 0 : -1) + '" aria-label="' + MV.esc(lab) + '">' + t.b + "</button>"
        : '<span class="mu-b mu-cd' + cls + '">' + t.b + "</span>";
      tp += '<span class="mu-b mu-tp' + cls + '">' + (COMP[t.b] || "") + "</span>";
      rn += '<span class="mu-b mu-rn' + cls + '">' + rna(t.b) + "</span>";
    }
    var bead = "";
    if (T.start && k < T.codons.length) {
      var a = aa1(T.codons[k]), ch = NORM.aa[k] !== a && !(a === "*" && k === NORM.aa.length);
      if (o.rv != null && k >= o.rv) bead = '<span class="mu-bead mu-wait" aria-hidden="true">…</span>';
      else if (a === "*") bead = '<span class="mu-stop' + (ch ? " mu-ch" : "") + '">stop</span>';
      else bead = '<span class="mu-bead' + (ch ? " mu-ch" : "") + '">' + nm(a) + "</span>";
    } else bead = '<span class="mu-none" aria-hidden="true">' + (T.start ? "—" : "") + "</span>";
    h += '<div class="mu-col"><span class="mu-n">' + (3 * k + 1) + '</span><div class="mu-cod" style="grid-template-columns:repeat(' + m + ',var(--mu-w))">' + cd + (o.tpl ? tp : "") + rn + "</div>" + bead + "</div>";
  }
  return h + "</div>";
}
function mrnaTxt(s){ var r = rna(s), out = []; for (var i = 0; i < r.length; i += 3) out.push(r.substr(i, 3)); return "5′-" + out.join(" ") + "-3′"; }
function protHTML(s){
  var T = translate(s);
  if (!T.start) return "No start codon: no protein";
  return T.aa.map(function(a, k){ var ch = NORM.aa[k] !== a; return ch ? "<strong>" + nm(a) + "</strong>" : nm(a); }).join("–") + (T.stop ? "" : "…");
}

// ---------- @component mutagenDraw — 8-bp ladder frames for the mutagen cards and the hero (viewBox 300 × 130):
// uvSVG(f), ionSVG(f), chemSVG(f) for frames 0–3. Strands: top --ink, bottom --ink-2, new DNA --pen; enzymes --ink-2 ----------
var LD = { x0:45, dx:30, yT:34, yB:100 };
function tab(x, y, b, role, up, extra){ // up: tab hangs down from a top backbone at y
  var h = sv("rect", Object.assign({ x:x - 10, y:up ? y : y - 22, width:20, height:22, rx:4, "class":"mu-tab mu-r-" + role }, extra || {}));
  return h + txt(x, (up ? y : y - 22) + 15.5, b, "mu-tl", "middle");
}
function hbs(x, a, b){ var k = (a === "G" || a === "C") ? 3 : 2, h = ""; for (var j = 0; j < k; j++) { var xx = x + (j - (k - 1) / 2) * 5; h += sv("line", { x1:xx, y1:LD.yT + 24, x2:xx, y2:LD.yB - 24, "class":"mu-hbd" }); } return h; }
function ladderSVG(o){
  // o: { top:"…", bot:"…" (default complement), xs:[x per pair], yT:[y per pair] (default LD.yT), skipT:{i}, skipB:{i}, newT:{i}, newB:{i}, noHb:{i}, brk:[x] (backbone gaps) }
  var n = o.top.length, h = "", i, xs = o.xs || o.top.split("").map(function(_, i){ return LD.x0 + i * LD.dx; });
  var bot = o.bot || o.top.split("").map(function(b){ return COMP[b]; }).join(""), yT = o.yT || xs.map(function(){ return LD.yT; });
  function bb(ys, y0, cls){
    var segs = [[]], brk = o.brk || [];
    xs.forEach(function(x, i){ if (i && brk.some(function(bx){ return bx > xs[i - 1] && bx < x; })) segs.push([]); segs[segs.length - 1].push([x, ys ? ys[i] : y0]); });
    return segs.map(function(p){ if (!p.length) return ""; var a = [p[0][0] - 13, p[0][1]], z = [p[p.length - 1][0] + 13, p[p.length - 1][1]]; return sv("path", { d:"M" + [a].concat(p, [z]).map(function(q){ return f1(q[0]) + " " + f1(q[1]); }).join(" L"), "class":"mu-bb " + cls }); }).join("");
  }
  h += bb(yT, null, "mu-r-top") + bb(null, LD.yB, "mu-r-bot");
  for (i = 0; i < n; i++) {
    var x = xs[i];
    if (!(o.noHb && o.noHb[i]) && !(o.skipT && o.skipT[i]) && !(o.skipB && o.skipB[i])) h += hbs(x, o.top[i], bot[i]);
    if (!(o.skipT && o.skipT[i])) h += tab(x, yT[i] + 2, o.top[i], o.newT && o.newT[i] ? "new" : "top", true);
    if (!(o.skipB && o.skipB[i])) h += tab(x, LD.yB - 2, bot[i], o.newB && o.newB[i] ? "new" : "bot", false);
  }
  return h;
}
function xsOf(n, shiftFrom, sh){ var a = []; for (var i = 0; i < n; i++) a.push(LD.x0 + i * LD.dx + (shiftFrom != null && i >= shiftFrom ? sh : 0)); return a; }
function enzSVG(x, y, w, lab){ return sv("rect", { x:x - w / 2, y:y - 16, width:w, height:32, rx:14, "class":"mu-enz" }) + txt(x, y + 4, lab, "mu-el", "middle"); }
function uvSVG(f){
  var top = "GCTTAGCA", h = "";
  if (f === 0) {
    h += ladderSVG({ top:top });
    h += sv("path", { d:"M40 2 q6 -4 12 0 t12 0 t12 0 t12 0 t12 0", "class":"mu-ray", transform:"translate(24 6) rotate(18)" }) + sv("path", { d:"M98 26 l6 4 l-7 2", "class":"mu-ray" }) + txt(30, 14, "UV", "mu-lab mu-bo");
  } else if (f === 1) {
    var y = [34, 34, 22, 22, 34, 34, 34, 34];
    h += ladderSVG({ top:top, yT:y, noHb:{ 2:1, 3:1 }, xs:[45, 75, 109, 131, 165, 195, 225, 255] });
    h += sv("line", { x1:111, y1:36, x2:129, y2:36, "class":"mu-dimer" }) + sv("line", { x1:111, y1:42, x2:129, y2:42, "class":"mu-dimer" }) + txt(120, 14, "thymine dimer (kink)", "mu-lab mu-bo", "middle");
  } else if (f === 2) {
    h += ladderSVG({ top:top, skipT:{ 1:1, 2:1, 3:1, 4:1 }, brk:[60, 150] });
    h += enzSVG(120, 16, 120, "repair enzyme") + txt(120, 124, "the damaged stretch is cut out", "mu-lab", "middle");
  } else {
    h += ladderSVG({ top:top, newT:{ 1:1, 2:1, 3:1, 4:1 } }) + txt(120, 124, "gap refilled (new DNA in blue)", "mu-lab", "middle");
  }
  return h;
}
function ionSVG(f){
  var top = "GATCCGTA", h = "";
  if (f === 0) h += ladderSVG({ top:top }) + sv("path", { d:"M118 0 L132 30 L120 50 L136 78 L124 100 L138 130", "class":"mu-ray" }) + txt(150, 14, "X-ray", "mu-lab mu-bo");
  else if (f === 1) h += ladderSVG({ top:top, xs:xsOf(8, 3, 16), brk:[140], noHb:{} }) + txt(150, 124, "both strands broken", "mu-lab mu-bo", "middle");
  else if (f === 2) h += ladderSVG({ top:top, xs:xsOf(8, 3, 6), brk:[134] }) + enzSVG(134, 67, 70, "break repair");
  else {
    var t2 = "GATCGTA";
    h += ladderSVG({ top:t2, xs:xsOf(7, 3, 15) }) + txt(150, 124, "rejoined, but 1 base pair (C–G) was lost", "mu-lab mu-bo", "middle");
  }
  return h;
}
function chemSVG(f){
  var top = "GATGCATC", h = "", mk = sv("circle", { cx:145, cy:30, r:5, "class":"mu-chem" });
  if (f === 0) h += ladderSVG({ top:top }) + mk + txt(152, 14, "altered G", "mu-lab mu-bo");
  else if (f === 1) h += ladderSVG({ top:top, bot:"CTATGTAG", newB:{ 0:1, 1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1 } }) + mk + txt(150, 124, "the copy gets T opposite the altered G", "mu-lab mu-bo", "middle");
  else if (f === 2) h += ladderSVG({ top:top, xs:xsOf(8, 4, 18), noHb:{} }) + sv("rect", { x:156, y:42, width:12, height:48, rx:3, "class":"mu-slab" }) + txt(162, 124, "a flat chemical slips between pairs", "mu-lab mu-bo", "middle");
  else {
    var xs = xsOf(8, 4, 30), h2 = ladderSVG({ top:top, xs:xs, bot:"CTACGTAG", newB:{ 0:1, 1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1 } });
    h += h2 + tab(xs[3] + 30, LD.yB - 2, "A", "new", false) + txt(xs[3] + 30, 124, "+1 base: an insertion", "mu-lab mu-bo", "middle");
  }
  return h;
}
var MUT = { uv:uvSVG, ion:ionSVG, chem:chemSVG };

// ---------- hero (storyboard): substitution GAG → GTG (Glu → Val, missense); reset; an A drops in after ATG, the letters
// slide one place under fixed codon boxes and every bead after Met changes; reset; UV dimer → excision repair.
// Reduced motion: the final frame of the first outcome, with the other two listed in the caption ----------
function hero(f){
  var box = $("#mu-hero"); if (!box) return;
  var cap = f && f.cap, SX = 13, DX = 16.6, YL = 52, YB = 112;
  var CAPS = ["Substitution: the A in GAG flips to T. GAG becomes GTG, so Glu becomes Val: missense.",
    "Insertion: an extra A drops in after ATG. The codon boxes stay put, every base after it slides one place, and every amino acid after Met changes: a frameshift.",
    "Mutagen: UV light joins two neighbouring thymines into a dimer. A repair enzyme cuts it out and the gap is refilled."];
  function setCap(t){ if (cap && cap.textContent !== t) cap.textContent = t; }
  function sx(i){ return SX + i * DX + DX / 2; }
  function draw(st){
    var h = txt(SX, 18, "coding strand 5′ → 3′", "mu-lab mu-hsm") + txt(SX, 160, "protein", "mu-lab mu-hsm");
    for (var k = 0; k < 8; k++) {
      var x = SX + 3 * k * DX + 1;
      if (k < 7 || st.letters.length > 21) h += sv("rect", { x:x, y:YL - 18, width:3 * DX - 2, height:26, rx:5, "class":"mu-hbox" + (st.hiBox === k ? " mu-hon" : "") });
    }
    st.letters.forEach(function(L){
      if (L.hi) h += sv("rect", { x:L.x - 8, y:L.y - 16, width:16, height:21, rx:3, "class":"mu-hhi" });
      h += sv("text", { x:L.x, y:L.y, "class":"mu-hl" + (L.hi ? " mu-bo" : ""), "text-anchor":"middle", opacity:L.op == null || L.op >= 1 ? null : f1(L.op) }, L.b);
    });
    st.beads.forEach(function(b, k){
      var cx = SX + (3 * k + 1.5) * DX;
      if (!b) return;
      if (b.t === "stop") h += sv("rect", { x:cx - 17, y:YB - 10, width:34, height:20, rx:10, "class":"mu-hstop" }) + txt(cx, YB + 4, "stop", "mu-hst", "middle");
      else h += sv("circle", { cx:cx, cy:YB, r:18, "class":"mu-hbead" + (b.ch ? " mu-hch" : "") }) + txt(cx, YB + 4, b.t, "mu-hbt" + (b.ch ? " mu-bo" : ""), "middle");
    });
    if (st.tag) h += txt(200, 150, st.tag, "mu-lab mu-bo mu-htag", "middle");
    box.innerHTML = '<svg viewBox="0 0 400 170" class="mu-svg" aria-hidden="true" focusable="false">' + h + "</svg>";
  }
  function normal(){ return { letters:GENE.split("").map(function(b, i){ return { b:b, x:sx(i), y:YL }; }), beads:NORM.aa.map(function(a){ return { t:nm(a) }; }).concat([{ t:"stop" }]) }; }
  function subFinal(){ var st = normal(); st.letters[7].b = "T"; st.letters[7].hi = true; st.hiBox = 2; st.beads[2] = { t:"Val", ch:true }; st.tag = "missense: Glu → Val"; return st; }
  function uv(fr){ box.innerHTML = '<svg viewBox="0 0 400 170" class="mu-svg" aria-hidden="true" focusable="false"><g transform="translate(50 18)">' + uvSVG(fr) + "</g></svg>"; }
  if (MV.reduceMotion) { draw(subFinal()); setCap(CAPS[0] + " Also: an extra base shifts the reading frame (frameshift), and UV light makes thymine dimers that repair enzymes cut out."); return; }
  var INS = "ATGACCAGAGTGGAAATGCTAA", insT = translate(INS);
  var steps = [
    [900, function(){ draw(normal()); setCap(CAPS[0]); }],
    [900, function(){ var st = normal(); st.letters[7].hi = true; draw(st); }],
    [2600, function(){ draw(subFinal()); }],
    [700, function(){ draw(normal()); setCap(CAPS[1]); }],
    [1300, function(next){
      MV.tween({ dur:1100, step:function(k){
        var st = normal();
        st.letters.forEach(function(L, i){ if (i >= 3) L.x = sx(i + Math.min(1, k * 1.6)); });
        st.letters.push({ b:"A", x:sx(3), y:lerp(4, YL, Math.min(1, k * 1.3)), op:Math.min(1, k * 2), hi:true });
        draw(st);
      }, done:next });
    }, true],
    [0, function(next){
      var i = 1;
      (function one(){
        var st = normal();
        st.letters.forEach(function(L, j){ if (j >= 3) L.x = sx(j + 1); });
        st.letters.push({ b:"A", x:sx(3), y:YL, hi:true });
        st.beads = [];
        for (var k = 0; k < 8; k++) { if (k < i && k < insT.aa.length) st.beads.push({ t:nm(insT.aa[k]), ch:k > 0 }); else if (k < 7) st.beads.push(k < i ? null : { t:"…" }); else st.beads.push(null); }
        if (i >= 7) st.tag = "frameshift: every amino acid after Met changes";
        draw(st);
        if (i++ < 7) setTimeout(one, 320); else setTimeout(next, 2400);
      })();
    }, true],
    [1300, function(){ uv(0); setCap(CAPS[2]); }],
    [1500, function(){ uv(1); }],
    [1500, function(){ uv(2); }],
    [0, function(){ uv(3); }]
  ];
  var si = 0;
  function run(){
    if (si >= steps.length) return;
    var s = steps[si++];
    if (s[2]) s[1](run); else { s[1](); if (si < steps.length) setTimeout(run, s[0]); }
  }
  setTimeout(run, 500);
}

// ---------- Explore: Mutation lab ----------
var EXF = null;
function freshChr(){ return { c1:"ABCDEFGH".split(""), c2:"MNOP".split(""), sel:{ 1:null, 2:null }, last:1, log:[] }; }
function explore(host, api){
  var S = api.S, X = api.content, MAXE = X.maxEdits || 3;
  if (!S.mode) S.mode = "gene";
  if (!S.seq) S.seq = fresh();
  if (!S.log) S.log = [];
  if (!S.hist) S.hist = [];
  if (!S.chr) S.chr = freshChr();
  var sel = null, busy = false, rv = null, drop = null, pend = null, cmsg = "", emsg = "", mg = {}, mgBusy = {};
  host.innerHTML = '<div class="pg mu-pg"><div class="pg-graph" data-mv="graph"><div class="mu-row" id="mu-mode"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="mu-m1"><div class="mu-gwrap" id="mu-gw" role="group" aria-label="The gene: tap a base to select it"></div><p class="tiny muted mu-key"><span class="mu-kc">coding strand</span> · <span class="mu-kt">template strand</span> · <span class="mu-kr">mRNA</span> · <span class="mu-ka">amino acid</span> · <span class="mu-ke">edited base</span> · <strong>bold</strong> = changed amino acid</p></div>' +
      '<div id="mu-m2" hidden><p class="how mu-how">' + X.chromo.how + '</p><div id="mu-chr" class="mu-chr"></div><div class="q-actions mu-cops">' +
        [["del", "Deletion"], ["dup", "Duplication"], ["inv", "Inversion"], ["trans", "Translocation"]].map(function(b){ return '<button type="button" class="btn ghost sm" data-cop="' + b[0] + '" data-k="cop' + b[0] + '">' + b[1] + "</button>"; }).join("") +
        '<button type="button" class="btn ghost sm" data-cop="reset" data-k="copreset">Reset</button></div><div id="mu-cmsg" aria-live="polite"></div></div>' +
      '<div id="mu-m3" hidden><div class="mu-cards">' + X.mutagens.map(function(m){
        return '<section class="mu-card" data-mg="' + m.id + '"><h4 class="mu-h">' + m.t + '</h4><div class="mu-mfig"><svg class="mu-svg" viewBox="0 0 300 130" role="img" focusable="false"></svg></div><p class="mu-cap" aria-live="polite"></p>' +
          '<div class="q-actions"><button type="button" class="btn primary sm" data-mplay="' + m.id + '" data-k="mp' + m.id + '">Play</button><button type="button" class="btn ghost sm" data-mstep="' + m.id + '" data-k="ms' + m.id + '">Step</button></div>' +
          '<p class="tiny"><strong>What usually fixes it:</strong> ' + m.fix + "</p></section>"; }).join("") + "</div></div>" +
      '<p class="vh" id="mu-live" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div id="mu-c1"><p class="how mu-how">' + X.editHow + '</p><p class="mu-selt" id="mu-selt"></p>' +
        '<div class="mu-erow"><span class="mu-el2">Change it to</span><span class="mu-pad" role="group" aria-label="Substitute the selected base">' + "ACGT".split("").map(function(b){ return '<button type="button" class="mu-base" data-sub="' + b + '" data-k="sub' + b + '">' + b + "</button>"; }).join("") + "</span></div>" +
        '<div class="mu-erow"><span class="mu-el2">Insert after it</span><span class="mu-pad" role="group" aria-label="Insert a base after the selected base">' + "ACGT".split("").map(function(b){ return '<button type="button" class="mu-base mu-ins" data-ins="' + b + '" data-k="ins' + b + '">+' + b + "</button>"; }).join("") + "</span></div>" +
        '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="del" data-k="mdel">Delete it</button><button type="button" class="btn ghost sm" data-act="undo" data-k="mundo">Undo</button><button type="button" class="btn ghost sm" data-act="reset" data-k="mreset">Reset</button></div>' +
        '<div id="mu-emsg" aria-live="polite"></div>' +
        '<label class="mu-chk"><input type="checkbox" id="mu-tpl"> Show template strand</label><label class="mu-chk"><input type="checkbox" id="mu-div"> Codon dividers (the original frame, for comparison)</label>' +
        '<details class="alg mu-ctd"><summary>Codon table</summary>' + codonTableHTML() + "</details></div>" +
      '<div id="mu-c2" hidden></div></div>' +
    '<div class="pg-read"><dl class="read" id="mu-read"></dl></div></div>';
  var gw = $("#mu-gw", host);
  var modeR = radios($("#mu-mode", host), { label:"Mode", options:[{ id:"gene", t:"Edit the gene" }, { id:"chromo", t:"Chromosome mutations" }, { id:"mutagen", t:"Mutagen cards" }], value:S.mode, onChange:function(m){ S.mode = m; changed(); } });

  // ---- gene edits (positions in the current sequence; the log records original base numbers) ----
  function push(){ S.hist.push(JSON.stringify({ seq:S.seq, log:S.log })); if (S.hist.length > 30) S.hist.shift(); }
  function full(){ return S.log.length >= MAXE; }
  function doSub(i, b){ var t = S.seq[i]; if (!t || t.b === b) return false; push(); S.log.push({ t:"sub", o:t.o, from:t.b, to:b }); S.seq[i] = { b:b, o:t.o, ed:1 }; return true; }
  function doIns(i, b){ var t = S.seq[i]; if (!t) return false; push(); S.log.push({ t:"ins", after:t.o, b:b }); S.seq.splice(i + 1, 0, { b:b, o:0, ed:1 }); return true; }
  function doDel(i){ var t = S.seq[i]; if (!t || S.seq.length < 2) return false; push(); S.log.push({ t:"del", o:t.o, b:t.b }); S.seq.splice(i, 1); return true; }
  function logTxt(e){
    if (e.t === "sub") return (e.o ? "Base " + e.o : "Inserted base") + ": " + e.from + " → " + e.to + " (coding strand)";
    if (e.t === "ins") return "Insert " + e.b + " after " + (e.after ? "base " + e.after : "the inserted base");
    return "Delete " + (e.o ? "base " + e.o : "the inserted base") + " (" + e.b + ")";
  }
  function edit(kind, b){
    emsg = "";
    if (busy) return;
    if (sel == null) { emsg = "Tap a base first."; paintCtl(); return; }
    if (full()) { emsg = "That’s 3 edits: Undo or Reset to make another."; paintCtl(); return; }
    var ok = kind === "sub" ? doSub(sel, b) : kind === "ins" ? doIns(sel, b) : doDel(sel);
    if (!ok) { emsg = kind === "sub" ? "That base is already " + b + "." : "Keep at least one base."; paintCtl(); return; }
    if (kind === "ins") sel = sel + 1; else if (kind === "del") sel = Math.min(sel, S.seq.length - 1);
    say(logTxt(S.log[S.log.length - 1]) + ". " + classify(S.seq, S.log).type + ".");
    changed(true);
  }
  function undo(){ if (busy || !S.hist.length) return; var p = JSON.parse(S.hist.pop()); S.seq = p.seq; S.log = p.log; sel = sel == null ? null : Math.min(sel, S.seq.length - 1); emsg = ""; changed(true); }
  function reset(){ if (busy) return; S.seq = fresh(); S.log = []; S.hist = []; emsg = ""; changed(true); }

  function paintGene(focus){
    var f = focus || gw.contains(document.activeElement);
    gw.innerHTML = geneHTML(S.seq, { btn:true, sel:sel, tpl:!!S.tpl, div:!!S.div, rv:rv, drop:drop });
    $$(".mu-cd", gw).forEach(function(b){ b.disabled = busy; });
    if (f && sel != null && !busy) { var b = $('[data-bi="' + sel + '"]', gw); if (b) b.focus({ preventScroll:true }); }
  }
  function paintCtl(){
    var L = busy, t = sel != null ? S.seq[sel] : null;
    $("#mu-selt", host).innerHTML = t ? "Selected: position " + (sel + 1) + " (" + sqH(t.b) + (t.o ? (t.o !== sel + 1 ? ", original base " + t.o : "") : ", inserted") + ") · Edits: " + S.log.length + " of " + MAXE : "No base selected · Edits: " + S.log.length + " of " + MAXE;
    $$("[data-sub],[data-ins]", host).forEach(function(b){ b.disabled = L || !t || full() || (b.dataset.sub && t && b.dataset.sub === t.b); });
    $('[data-act="del"]', host).disabled = L || !t || full();
    $('[data-act="undo"]', host).disabled = L || !S.hist.length;
    $('[data-act="reset"]', host).disabled = L || (!S.log.length && !S.hist.length);
    $("#mu-tpl", host).checked = !!S.tpl; $("#mu-div", host).checked = !!S.div;
    $("#mu-tpl", host).disabled = L; $("#mu-div", host).disabled = L;
    $("#mu-emsg", host).innerHTML = emsg ? MV.fbHTML("bad", emsg) : "";
    modeR.disable(L);
  }
  // ---- chromosome mode ----
  var HOME = {}; "ABCDEFGH".split("").forEach(function(g){ HOME[g] = 1; }); "MNOP".split("").forEach(function(g){ HOME[g] = 2; });
  function paintChr(){
    var C = S.chr;
    function inSel(c, i){ var s = C.sel[c]; return s && i >= s[0] && i <= s[1]; }
    $("#mu-chr", host).innerHTML = [1, 2].map(function(c){
      var arr = C["c" + c];
      return '<div class="mu-chrow"><span class="mu-chl">Chromosome ' + c + '</span><span class="mu-bands" role="group" aria-label="Chromosome ' + c + ' bands">' + arr.map(function(g, i){
        return '<button type="button" class="mu-band' + (HOME[g] === 2 ? " mu-b2" : "") + '" data-cb="' + c + ":" + i + '" data-k="cb' + c + i + '" aria-pressed="' + !!inSel(c, i) + '" aria-label="Chromosome ' + c + ", band " + (i + 1) + ": gene " + g + '">' + g + "</button>"; }).join("") + "</span></div>";
    }).join("");
    $("#mu-cmsg", host).innerHTML = cmsg ? MV.fbHTML(/^✓/.test(cmsg) ? "good" : "bad", cmsg) : "";
  }
  function chrTap(c, i){
    var C = S.chr, s = C.sel[c];
    C.sel[c] = s && s[0] === s[1] && s[0] !== i ? [Math.min(s[0], i), Math.max(s[0], i)] : [i, i];
    C.last = c; cmsg = ""; changed();
  }
  function chrOp(op){
    var C = S.chr; cmsg = "";
    if (op === "reset") { S.chr = freshChr(); changed(); return; }
    if (op === "trans") {
      if (!C.sel[1] || !C.sel[2]) { cmsg = "Tap a band on each chromosome: the pieces from there to the end swap."; changed(); return; }
      var a = C.sel[1][0], b = C.sel[2][0], t1 = C.c1.slice(a), t2 = C.c2.slice(b);
      if (!a && !b) { cmsg = "Choose a band after the first one on at least one chromosome, so a piece stays behind."; changed(); return; }
      C.c1 = C.c1.slice(0, a).concat(t2); C.c2 = C.c2.slice(0, b).concat(t1);
      C.log.push("Translocation: " + t1.join(" ") + " ↔ " + t2.join(" "));
    } else {
      var c = C.sel[C.last] ? C.last : (C.sel[1] ? 1 : C.sel[2] ? 2 : 0);
      if (!c) { cmsg = "Tap a band (or two bands for a segment) first."; changed(); return; }
      var arr = C["c" + c], s = C.sel[c], seg = arr.slice(s[0], s[1] + 1);
      if (op === "del") { if (seg.length >= arr.length) { cmsg = "Leave at least one band on the chromosome."; changed(); return; } arr.splice(s[0], seg.length); C.log.push("Deletion of " + seg.join(" ")); }
      if (op === "dup") { if (arr.length + seg.length > 12) { cmsg = "That chromosome is long enough: Reset to start again."; changed(); return; } Array.prototype.splice.apply(arr, [s[1] + 1, 0].concat(seg)); C.log.push("Duplication of " + seg.join(" ")); }
      if (op === "inv") { if (seg.length < 2) { cmsg = "Tap two bands to select a segment of at least two bands to flip."; changed(); return; } Array.prototype.splice.apply(arr, [s[0], seg.length].concat(seg.slice().reverse())); C.log.push("Inversion of " + seg.join(" ")); }
    }
    C.sel = { 1:null, 2:null };
    say(C.log[C.log.length - 1] + ".");
    changed();
  }
  function chrRows(){
    var C = S.chr, all = C.c1.concat(C.c2), cnt = {};
    all.forEach(function(g){ cnt[g] = (cnt[g] || 0) + 1; });
    var lost = Object.keys(HOME).filter(function(g){ return !cnt[g]; }), dup = Object.keys(cnt).filter(function(g){ return cnt[g] > 1; }).sort();
    var moved = [];
    [1, 2].forEach(function(c){ C["c" + c].forEach(function(g){ if (HOME[g] !== c && moved.indexOf(g) < 0) moved.push(g); }); });
    var none = '<span class="muted">none</span>';
    return [["Chromosome 1", sqH(C.c1.join(" "))], ["Chromosome 2", sqH(C.c2.join(" "))], ["Changes", C.log.length ? C.log.join("<br>") : '<span class="muted">none yet</span>'],
      ["Genes lost", lost.length ? lost.join(" ") : none], ["Genes duplicated", dup.length ? dup.join(" ") : none], ["Genes moved to the other chromosome", moved.length ? moved.join(" ") : none]];
  }
  // ---- mutagen cards ----
  function paintCard(id){
    var card = $('[data-mg="' + id + '"]', host), m = byId(X.mutagens, id), fr = mg[id] || 0;
    if (MV.reduceMotion && fr === 0 && !mg["_" + id]) fr = 3;
    $("svg", card).innerHTML = MUT[id](fr);
    $("svg", card).setAttribute("aria-label", m.t + ", step " + (fr + 1) + " of 4: " + m.caps[fr]);
    $(".mu-cap", card).innerHTML = MV.reduceMotion && !mg["_" + id] ? "<ol class=\"mu-capl\">" + m.caps.map(function(c){ return "<li>" + c + "</li>"; }).join("") + "</ol>" : "<strong>Step " + (fr + 1) + " of 4.</strong> " + m.caps[fr];
    $("[data-mplay]", card).disabled = !!mgBusy[id]; $("[data-mstep]", card).disabled = !!mgBusy[id];
  }
  function playCard(id){
    if (mgBusy[id]) return;
    mgBusy[id] = true; mg[id] = 0; mg["_" + id] = 1; paintCard(id);
    (function next(){ MV.wait(1400, function(){ if (mg[id] < 3) { mg[id]++; paintCard(id); next(); } else { mgBusy[id] = false; paintCard(id); } }); })();
  }

  // ---- readout ----
  var readSig = "";
  function paintRead(){
    var rows;
    if (S.mode === "chromo") rows = chrRows();
    else if (S.mode === "mutagen") rows = [["Mutagens", "UV light, ionizing radiation and chemicals change DNA in different ways. Play each card."], ["Repair", "Cells fix most damage; the changes that slip past repair become mutations."]];
    else {
      var s = seqOf(S.seq), T = translate(s), c = classify(S.seq, S.log), rvOn = rv != null;
      rows = [["Change", S.log.length ? S.log.map(logTxt).join("<br>") : '<span class="muted">none: the normal gene</span>'],
        ["mRNA", sqH(mrnaTxt(s))],
        ["Protein", rvOn ? '<span class="muted">reading…</span>' : protHTML(s)],
        ["Length", rvOn ? "…" : T.start ? T.aa.length + " amino acids (normal 6)" + (T.stop ? "" : "; no stop codon in frame, so translation runs past the end of the gene") : "0 (normal 6)"],
        ["Mutation type", c.type], ["Frame after the change", c.frame]];
    }
    var sig = JSON.stringify(rows); if (sig === readSig) return; readSig = sig;
    $("#mu-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintAll(){
    modeR.set(S.mode);
    ["gene", "chromo", "mutagen"].forEach(function(m, i){ $("#mu-m" + (i + 1), host).hidden = S.mode !== m; });
    $("#mu-c1", host).hidden = S.mode !== "gene";
    var c2 = $("#mu-c2", host); c2.hidden = S.mode === "gene";
    c2.innerHTML = S.mode === "chromo" ? '<p class="tiny muted">Chromosome mutations move whole blocks of genes: deletion, duplication, inversion and translocation.</p>' : S.mode === "mutagen" ? '<p class="tiny muted">Each card shows how one mutagen changes DNA and what usually repairs it. Press Play, or Step through it.</p>' : "";
    if (S.mode === "gene") { paintGene(); paintCtl(); }
    else if (S.mode === "chromo") paintChr();
    else X.mutagens.forEach(function(m){ paintCard(m.id); });
    paintRead();
  }
  function changed(focusGene){ api.save(); paintAll(); if (focusGene && S.mode === "gene") paintGene(true); MV.changed(); }
  function say(t){ var L = $("#mu-live", host); L.textContent = ""; setTimeout(function(){ L.textContent = t; }, 30); }

  // ---- events ----
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.bi != null) { if (busy) return; sel = +b.dataset.bi; emsg = ""; paintGene(true); paintCtl(); return; }
    if (b.dataset.sub) { edit("sub", b.dataset.sub); return; }
    if (b.dataset.ins) { edit("ins", b.dataset.ins); return; }
    if (b.dataset.act === "del") { edit("del"); return; }
    if (b.dataset.act === "undo") { undo(); return; }
    if (b.dataset.act === "reset") { reset(); return; }
    if (b.dataset.cb) { var p = b.dataset.cb.split(":"); chrTap(+p[0], +p[1]); var nb = $('[data-cb="' + b.dataset.cb + '"]', host); if (nb) nb.focus(); return; }
    if (b.dataset.cop) { chrOp(b.dataset.cop); return; }
    if (b.dataset.mplay) { playCard(b.dataset.mplay); return; }
    if (b.dataset.mstep) { var id = b.dataset.mstep; mg["_" + id] = 1; mg[id] = ((mg[id] || 0) + 1) % 4; paintCard(id); }
  });
  host.addEventListener("change", function(e){
    if (e.target.id === "mu-tpl") { S.tpl = e.target.checked; changed(); }
    if (e.target.id === "mu-div") { S.div = e.target.checked; changed(); }
  });
  gw.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-bi]"); if (!b || busy) return;
    var i = +b.dataset.bi, d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (d) { e.preventDefault(); var j = Math.max(0, Math.min(S.seq.length - 1, i + d)), nb = $('[data-bi="' + j + '"]', gw); $$("[data-bi]", gw).forEach(function(x){ x.tabIndex = -1; }); if (nb) { nb.tabIndex = 0; nb.focus(); } return; }
    if (/^[acgt]$/i.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey && sel === i) { e.preventDefault(); edit("sub", e.key.toUpperCase()); }
  });

  // ---- challenges (plan: exact tests and named wrong states) ----
  function chal(id){
    var C = byId(X.challenges, id), m = C.msgs, L = S.log, subs = L.filter(function(e){ return e.t === "sub"; }), nI = L.filter(function(e){ return e.t === "ins"; }).length, nD = L.filter(function(e){ return e.t === "del"; }).length;
    var s = seqOf(S.seq), T = translate(s), p = T.aa.join("");
    if (id === "tc1") {
      if (L.length === 1 && subs.length === 1 && T.start && p === "MPVWKC" && T.stop) return { ok:true };
      if (!L.length) return { ok:false, msg:C.general };
      if (L.length !== 1 || !subs.length) return { ok:false, msg:m.one };
      if (subs[0].o === 7 && subs[0].to === "T") return { ok:false, msg:m.stop };
      if (subs[0].o === 9) return { ok:false, msg:m.third };
      return { ok:false, msg:"That gives " + (T.start ? protTxt(T.aa) : "no protein") + ". " + C.general };
    }
    if (id === "tc2") {
      if (L.length === 1 && subs.length === 1 && T.start && T.stop && p === "MPE") return { ok:true };
      if (subs.length === 2 && L.length === 2 && s.substr(9, 3) === "TAA") return { ok:false, msg:m.taa };
      if (!L.length) return { ok:false, msg:C.general };
      if (L.length !== 1 || !subs.length) return { ok:false, msg:m.one };
      if (subs[0].o >= 13 && subs[0].o <= 15) return { ok:false, msg:m.c5 };
      return { ok:false, msg:"That gives " + (T.start ? protTxt(T.aa) + (T.stop ? "" : "…") : "no protein") + ". " + C.general };
    }
    if (id === "tc3") {
      if (nI === 1 && nD === 1 && !subs.length) {
        if (!T.start) return { ok:false, msg:"Keep the start codon ATG: edit inside codons 2 and 3." };
        if (T.stop && T.aa.length === 6 && p.slice(3) === "WKC") return p.slice(1, 3) !== "PE" ? { ok:true } : { ok:false, msg:m.same };
        if (T.stop && T.aa.length < 6) return { ok:false, msg:m.stop };
        return { ok:false, msg:m.far };
      }
      if (nI === 2 && !nD && !subs.length) return { ok:false, msg:m.twoIns };
      if (nD === 2 && !nI && !subs.length) return { ok:false, msg:m.twoDel };
      return { ok:false, msg:m.need };
    }
    return { ok:false };
  }

  // ---- predictions: start from the normal gene, make the change step by step, then read the beads one by one ----
  function setSeq(seq, log){ S.seq = seq; S.log = log; S.hist = []; }
  function reveal(fin){
    var n = Math.max(1, translate(seqOf(S.seq)).codons.length);
    rv = 0;
    (function one(){ if (!pend) return; rv++; paintGene(); paintRead(); if (rv >= n) { rv = null; paintGene(); paintRead(); fin(); } else MV.wait(280, one); })();
  }
  EXF = { show:function(v){ if (v) paintAll(); } };
  paintAll();
  return {
    predict:{
      start:function(p){ S.mode = "gene"; setSeq(fresh(), []); sel = null; rv = null; drop = null; emsg = ""; if (p.id === "p3") S.div = true; busy = false; changed(); },
      run:function(p, done){
        pend = done; busy = true; paintAll();
        function fin(){ var d = pend; pend = null; busy = false; drop = null; api.save(); paintAll(); MV.changed(); if (d) d(); }
        var plan = p.id === "p1" ? [["sub", 5, "G"]] : p.id === "p2" ? [["sub", 12, "T"]] : p.id === "p3" ? [["ins", 2, "A"]] : [["del", 6], ["del", 6], ["del", 6]];
        var k = 0;
        (function step(){
          if (!pend) return;
          if (k >= plan.length) { MV.wait(400, function(){ reveal(fin); }); return; }
          var a = plan[k++]; sel = a[1]; paintGene();
          MV.wait(600, function(){
            if (!pend) return;
            if (a[0] === "sub") doSub(a[1], a[2]); else if (a[0] === "ins") { doIns(a[1], a[2]); drop = a[1] + 1; } else doDel(a[1]);
            sel = null; rv = 0; paintGene(); paintRead();
            MV.wait(500, step);
          });
        })();
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: Mutations with consequences (four stations, one at a time) ----------
// @component cellScenes — sickle-cell red blood cell (rbcSVG), CFTR membrane (cftrSVG), CCR5 receptor (ccr5SVG), Ames plates (plateSVG)
function rbcSVG(sick, low){
  var h = "", r = MV.bio.rng("rbc"), i, pts = [];
  var fib = sick && low;
  if (fib) {
    h += sv("path", { d:"M40 128 Q160 -6 280 128 Q160 52 40 128 Z", "class":"mu-rbc" });
    for (var f = 0; f < 3; f++) for (i = 0; i < 11; i++) { var t = 0.1 + i * 0.08, o = 8 + f * 9, x = (1 - t) * (1 - t) * 52 + 2 * t * (1 - t) * 160 + t * t * 268, y = (1 - t) * (1 - t) * 120 + 2 * t * (1 - t) * (26 + o) + t * t * 120 + 4; pts.push([x, y + f * 2]); }
    pts.forEach(function(p){ h += sv("circle", { cx:p[0], cy:p[1], r:4.4, "class":"mu-hbm" }); });
    h += txt(160, 158, "sickle cell: hemoglobin forms long fibres", "mu-lab mu-bo", "middle");
  } else {
    h += sv("ellipse", { cx:160, cy:80, rx:118, ry:60, "class":"mu-rbc" }) + sv("ellipse", { cx:160, cy:80, rx:52, ry:24, "class":"mu-rbcc" });
    for (i = 0; i < 26; i++) { var a = r() * Math.PI * 2, rr = Math.sqrt(0.15 + r() * 0.8); pts.push([160 + Math.cos(a) * rr * 100, 80 + Math.sin(a) * rr * 48]); }
    pts.forEach(function(p){ h += sv("circle", { cx:f1(p[0]), cy:f1(p[1]), r:4.4, "class":"mu-hbm" }); });
    h += txt(160, 158, "flexible disc: hemoglobin molecules stay separate", "mu-lab mu-bo", "middle");
  }
  return h;
}
function cftrSVG(mut){
  var h = "", i;
  h += txt(10, 16, mut ? "outside: thick, sticky mucus" : "outside: thin mucus", "mu-lab mu-bo");
  for (i = 0; i < (mut ? 5 : 2); i++) h += sv("path", { d:"M20 " + (28 + i * 4) + " q20 -5 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0", "class":"mu-mucus" });
  h += sv("rect", { x:0, y:58, width:320, height:22, "class":"mu-mem" });
  h += txt(10, 112, "inside the cell", "mu-lab");
  if (!mut) {
    h += sv("rect", { x:142, y:52, width:14, height:34, rx:4, "class":"mu-chan" }) + sv("rect", { x:166, y:52, width:14, height:34, rx:4, "class":"mu-chan" });
    [[161, 120], [161, 96], [161, 40]].forEach(function(p){ h += sv("circle", { cx:p[0], cy:p[1], r:8, "class":"mu-cl" }) + txt(p[0], p[1] + 3.5, "Cl⁻", "mu-cll", "middle"); });
    h += sv("path", { d:"M190 120 L190 36", "class":"mu-arr" }) + sv("path", { d:"M185 44 L190 34 L195 44", "class":"mu-arr" }) + txt(200, 104, "CFTR channel: Cl⁻ leaves the cell", "mu-lab mu-bo");
  } else {
    h += sv("path", { d:"M140 130 q10 -24 24 -6 q14 18 -6 22 q-20 4 -8 -18 q10 -16 26 -2 q12 12 -4 18", "class":"mu-misf" }) + txt(194, 128, "misfolded CFTR: broken down,", "mu-lab mu-bo") + txt(194, 144, "never reaches the membrane", "mu-lab mu-bo");
  }
  return h;
}
function ccr5SVG(d32){
  var h = sv("rect", { x:0, y:96, width:320, height:16, "class":"mu-mem" }) + txt(10, 136, "inside a white blood cell", "mu-lab");
  var vx = 160, vy = d32 ? 30 : 62;
  h += sv("circle", { cx:vx, cy:vy, r:18, "class":"mu-hiv" });
  for (var k = 0; k < 8; k++) { var a = k * Math.PI / 4; h += sv("line", { x1:vx + Math.cos(a) * 18, y1:vy + Math.sin(a) * 18, x2:vx + Math.cos(a) * 24, y2:vy + Math.sin(a) * 24, "class":"mu-hivs" }); }
  h += txt(vx + 30, vy - 8, "HIV", "mu-lab mu-bo");
  if (!d32) h += sv("path", { d:"M160 112 L160 92 M160 92 L150 82 M160 92 L170 82", "class":"mu-rec" }) + txt(176, 94, "CCR5 receptor: HIV docks and enters", "mu-lab mu-bo");
  else h += txt(176, 72, "no CCR5 receptor: these strains can’t enter", "mu-lab mu-bo");
  return h;
}
function plateSVG(n, seed){
  var h = sv("circle", { cx:50, cy:50, r:46, "class":"mu-plate" }), r = MV.bio.rng(seed);
  for (var i = 0; i < n; i++) { var a = r() * Math.PI * 2, rr = 40 * Math.sqrt(r()); h += sv("circle", { cx:f1(50 + Math.cos(a) * rr), cy:f1(50 + Math.sin(a) * rr), r:1.7, "class":"mu-col1" }); }
  return h;
}
function part3(host, api){
  var S = api.S, P = MV.C.part3, ST = P.stations;
  if (!S.cur) S.cur = "s1";
  S.st = S.st || {};
  function st(id){ return S.st[id] || (S.st[id] = { done:false }); }
  host.innerHTML = '<div class="mu-p3"><div class="mu-row" id="mu-nav"></div><div id="mu-stn" class="mu-stn"></div></div>';
  var nav = radios($("#mu-nav", host), { label:"Station", cls:"chips", key:"nav", options:navOpts(), value:S.cur, onChange:function(v){ S.cur = v; api.save(); paint(true); } });
  function navOpts(){ return ST.map(function(s){ return { id:s.id, t:(st(s.id).done ? "✓ " : "") + s.n + " " + s.t.replace(/^Check it with data: /, "").replace(/^A helpful mutation: /, "") }; }); }
  var box = $("#mu-stn", host), fb = {};
  function body(s){
    var x = st(s.id), h = '<h4 class="mu-h">Station ' + s.n + ": " + s.t + "</h4><p>" + s.text + "</p>";
    if (s.id === "s1") {
      x.hb = x.hb || "n"; x.ox = x.ox || "n";
      h += '<div class="tbl-wrap"><table class="mu-tbl"><thead><tr><th scope="col">Codon 6</th><th scope="col">Normal</th><th scope="col">Sickle-cell</th></tr></thead><tbody>' + s.rows.map(function(r){ return '<tr><th scope="row">' + r[0] + "</th><td>" + (r[0] === "Amino acid" ? r[1] : sqH(r[1])) + '</td><td class="mu-hl2">' + (r[0] === "Amino acid" ? "<strong>" + r[2] + "</strong>" : sqH(r[2])) + "</td></tr>"; }).join("") + "</tbody></table></div>" +
        '<p class="how">' + s.how + '</p><div class="mu-row" id="mu-hb"></div><div class="mu-row" id="mu-ox"></div>' +
        '<div class="mu-sfig"><svg class="mu-svg" viewBox="0 0 320 170" role="img" focusable="false" aria-label="' + MV.esc(s.caps[x.hb + (x.ox === "n" ? "n" : "l")]) + '">' + rbcSVG(x.hb === "s", x.ox === "l") + "</svg></div>" +
        '<p class="mu-cap" aria-live="polite">' + s.caps[x.hb + (x.ox === "n" ? "n" : "l")] + '</p><div class="refresh mu-side"><h4>Side panel: malaria</h4><p>' + s.side + "</p></div>";
    } else if (s.id === "s2") {
      x.v = x.v || "n";
      h += '<p class="how">' + s.how + '</p><div class="mu-row" id="mu-cf"></div>' +
        '<p class="mu-beads2">' + (x.v === "n" ? '… – <span class="mu-bead mu-sm">aa</span> – <span class="mu-bead mu-sm">aa</span> – <span class="mu-bead mu-sm mu-ch">Phe</span> – <span class="mu-bead mu-sm">aa</span> – <span class="mu-bead mu-sm">aa</span> – …' :
          '… – <span class="mu-bead mu-sm">aa</span> – <span class="mu-bead mu-sm">aa</span> – <span class="mu-bead mu-sm">aa</span> – <span class="mu-bead mu-sm">aa</span> – … <span class="tiny">(3 bases deleted: one Phe lost, the frame kept)</span>') + "</p>" +
        '<div class="mu-sfig"><svg class="mu-svg" viewBox="0 0 320 160" role="img" focusable="false" aria-label="' + MV.esc(s.caps[x.v]) + '">' + cftrSVG(x.v === "m") + "</svg></div>" +
        '<p class="mu-cap" aria-live="polite">' + s.caps[x.v] + '</p><p class="tiny"><strong>A Canadian connection:</strong> ' + s.note + "</p>";
    } else if (s.id === "s3") {
      x.v = x.v || "n";
      h += '<p class="mu-calc">32 bases = 3 × 10 + 2: <strong>not a multiple of 3</strong>, so every codon after the deletion is read in a new frame.</p><div class="mu-row" id="mu-cc"></div>' +
        '<div class="mu-sfig"><svg class="mu-svg" viewBox="0 0 320 150" role="img" focusable="false" aria-label="' + (x.v === "n" ? "Two normal copies: the CCR5 receptor sits in the membrane, and HIV docks on it and enters." : "Two Δ32 copies: no CCR5 receptor in the membrane, so HIV strains that use CCR5 can’t enter.") + '">' + ccr5SVG(x.v === "d") + "</svg></div>" + choicesHTML(s, x);
    } else {
      h += '<div class="mu-plates">' + s.plates.map(function(p){ return '<figure class="mu-pl"><svg class="mu-svg" viewBox="0 0 100 100" role="img" focusable="false" aria-label="' + MV.esc(p[1] + ": " + p[2] + " colonies") + '">' + plateSVG(p[2], "ames" + p[0]) + '</svg><figcaption class="tiny">' + p[1] + ": <strong>" + p[2] + "</strong></figcaption></figure>"; }).join("") + "</div>" +
        '<div class="tbl-wrap"><table class="mu-tbl"><caption class="tiny">Colonies after 2 days <span class="bio-model">Model data</span></caption><thead><tr><th scope="col">Plate</th><th scope="col">Colonies</th></tr></thead><tbody>' + s.plates.map(function(p){ return '<tr><th scope="row">' + p[1] + "</th><td>" + p[2] + "</td></tr>"; }).join("") + "</tbody></table></div>" +
        '<p class="how">' + s.how + "</p>" + s.chems.map(function(c){ return '<div class="mu-cer" data-chem="' + c.id + '"><h5 class="mu-h5">' + c.t + '</h5><div class="mu-row" data-cl="' + c.id + '"></div><div class="mu-row" data-ev="' + c.id + '"></div><div class="q-actions"><button type="button" class="btn primary sm" data-amc="' + c.id + '" data-k="amc' + c.id + '">Check</button></div><div class="mu-amfb">' + (fb[c.id] || "") + "</div></div>"; }).join("") +
        (s.chems.every(function(c){ return x[c.id] && x[c.id].ok; }) ? MV.fbHTML("good", "<strong>✓ All three tagged.</strong> " + s.reason) : "");
    }
    return h;
  }
  function choicesHTML(s, x){
    var ri = MV.right(s.choices), h = '<p class="mu-ask"><strong>' + s.ask + '</strong></p><div class="opts mu-cho">' + s.choices.map(function(c, i){
      var cl = "opt" + (x.done && i === ri ? " right" : x.pick === i && i !== ri ? " wrong" : "");
      return '<button type="button" class="' + cl + '" data-ch="' + i + '" data-k="ch' + s.id + i + '"' + (x.done ? " disabled" : "") + "><span>" + c.t + "</span></button>"; }).join("") + "</div>";
    if (x.pick != null) { var c = s.choices[x.pick], good = x.pick === ri; h += MV.fbHTML(good ? "good" : "bad", (good ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + c.fb + (good ? "" : " Try again.")); }
    return h;
  }
  function wire(s){
    var x = st(s.id);
    if (s.id === "s1") {
      radios($("#mu-hb", box), { label:"Hemoglobin", key:"hb", options:[{ id:"n", t:"Normal (Glu)" }, { id:"s", t:"Sickle (Val)" }], value:x.hb, onChange:function(v){ x.hb = v; if (x.hb === "s" && x.ox === "l") x.done = true; api.save(); paint(); } });
      radios($("#mu-ox", box), { label:"Oxygen", key:"ox", options:[{ id:"n", t:"Normal" }, { id:"l", t:"Low" }], value:x.ox, onChange:function(v){ x.ox = v; if (x.hb === "s" && x.ox === "l") x.done = true; api.save(); paint(); } });
    } else if (s.id === "s2") {
      radios($("#mu-cf", box), { label:"Protein", key:"cf", options:[{ id:"n", t:"Normal CFTR" }, { id:"m", t:"Missing one Phe" }], value:x.v, onChange:function(v){ x.v = v; if (v === "m") x.done = true; api.save(); paint(); } });
    } else if (s.id === "s3") {
      radios($("#mu-cc", box), { label:"CCR5 gene", key:"cc", options:[{ id:"n", t:"Two normal copies" }, { id:"d", t:"Two Δ32 copies" }], value:x.v, onChange:function(v){ x.v = v; api.save(); paint(); } });
    } else {
      s.chems.forEach(function(c){
        var y = x[c.id] || (x[c.id] = { cl:"", ev:"", ok:false }), dis = y.ok;
        radios($('[data-cl="' + c.id + '"]', box), { label:"Claim", cls:"chips", key:"cl" + c.id, options:s.claims.map(function(o){ return { id:o.id, t:o.t, dis:dis }; }), value:y.cl, onChange:function(v){ y.cl = v; api.save(); } });
        radios($('[data-ev="' + c.id + '"]', box), { label:"Evidence", cls:"chips", key:"ev" + c.id, options:s.evidence.map(function(o){ return { id:o.id, t:o.t, dis:dis }; }), value:y.ev, onChange:function(v){ y.ev = v; api.save(); } });
        var btn = $('[data-amc="' + c.id + '"]', box); if (btn) btn.disabled = dis;
      });
    }
  }
  function paint(focusNav){
    var s = byId(ST, S.cur);
    MV.keepFocus(box, function(){ box.innerHTML = body(s); });
    wire(s);
    nav.setOptions(navOpts()); nav.set(S.cur);
    if (focusNav) { var b = $('[data-rg="' + S.cur + '"]', $("#mu-nav", host)); if (b) b.focus({ preventScroll:true }); }
  }
  box.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var s = byId(ST, S.cur), x = st(s.id);
    if (b.dataset.ch != null) { var i = +b.dataset.ch; x.pick = i; if (i === MV.right(s.choices)) x.done = true; api.save(); paint(); MV.focusFb(box); return; }
    if (b.dataset.amc) {
      var c = byId(s.chems, b.dataset.amc), y = x[c.id], ans = String(MV.ans(c)).split("|");
      if (!y.cl || !y.ev) fb[c.id] = MV.fbHTML("bad", "Choose a claim and a piece of evidence first.");
      else if (y.cl === ans[0] && y.ev === ans[1]) { y.ok = true; fb[c.id] = MV.fbHTML("good", "<strong>✓ Correct.</strong> " + byId(s.claims, y.cl).t + ": " + byId(s.evidence, y.ev).t + "."); }
      else if (y.cl !== ans[0]) fb[c.id] = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + ((c.fb && c.fb[y.cl]) || "Compare this chemical’s plates with the control.") + " Try again.");
      else fb[c.id] = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + s.evWrong + " Try again.");
      if (s.chems.every(function(q){ return x[q.id] && x[q.id].ok; })) x.done = true;
      api.save(); paint(); var cer = $('[data-chem="' + c.id + '"]', box); MV.focusFb(cer); return;
    }
  });
  paint();
}

// ---------- Practice 2: Mutation detective (codon entry for D1–D3, chips for D4–D6; translation by the shared S6 functions) ----------
function detective(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { codon:"", val:"", tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">Normal gene: ' + sqH("ATG CCA GAG TGG AAA TGC TAA") + ' · codons 1–7 · ' + sqH("Met–Pro–Glu–Trp–Lys–Cys") + '</p><details class="alg mu-ctd"><summary>Codon table</summary>' + codonTableHTML() + "</details>" +
    a.items.map(function(it){ return '<div class="q" data-dt="' + it.id + '"></div>'; }).join("");
  function codonOpts(){ var o = []; for (var k = 1; k <= 7; k++) o.push({ id:k, t:k + " " + sqH(GENE.substr(3 * k - 3, 3)) }); return o; }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = $('[data-dt="' + it.id + '"]', host), h;
    h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "codon") {
      h += '<div class="mu-row" data-cod="' + it.id + '"></div><div class="numrow"><label for="dt-' + it.id + '">New coding-strand codon:</label><input class="numin mu-seqin" id="dt-' + it.id + '" data-dti="' + it.id + '" type="text" maxlength="3" autocapitalize="characters" spellcheck="false" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + "></div>";
    } else if (it.kind === "pair") {
      h += it.parts.map(function(p){ return '<div class="mu-row" data-part="' + it.id + p.id + '"></div>'; }).join("");
    } else {
      h += '<div class="opts">' + it.options.map(function(o, j){ var cl = "opt" + (x.solved && MV.ok(o) ? " right" : x.pick === j && !MV.ok(o) ? " wrong" : ""); return '<button type="button" class="' + cl + '" data-op="' + j + '" data-k="' + it.id + "op" + j + '"' + (x.solved ? " disabled" : "") + "><span>" + o.t + "</span></button>"; }).join("") + "</div>";
    }
    if (!x.solved) h += '<div class="q-actions">' + (it.kind !== "mc" ? '<button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' : "") + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct" + (it.display ? ": " + it.display : "") + ".</strong> " + (it.why || (it.options ? it.options.filter(MV.ok)[0].why : "")) + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML("bad", msgs[it.id]);
    if (it.follow && x.solved) {
      var F = it.follow, fr = MV.right(F.options);
      h += '<div class="mu-follow"><p class="q-prompt">' + F.prompt + '</p><div class="opts">' + F.options.map(function(o, j){ var cl = "opt" + (x.fdone && j === fr ? " right" : x.fpick === j && j !== fr ? " wrong" : ""); return '<button type="button" class="' + cl + '" data-fo="' + j + '" data-k="' + it.id + "fo" + j + '"' + (x.fdone ? " disabled" : "") + "><span>" + o.t + "</span></button>"; }).join("") + "</div>";
      if (x.fpick != null) h += MV.fbHTML(x.fpick === fr ? "good" : "bad", (x.fpick === fr ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + F.options[x.fpick].why + (x.fpick === fr ? "" : " Try again."));
      h += "</div>";
    }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
    if (it.kind === "codon") radios($('[data-cod="' + it.id + '"]', box), { label:"Codon", cls:"chips", key:it.id, options:codonOpts().map(function(o){ o.dis = x.solved; return o; }), value:x.codon, onChange:function(v){ x.codon = v; api.save(); } });
    if (it.kind === "pair") it.parts.forEach(function(p){ x.p = x.p || {}; radios($('[data-part="' + it.id + p.id + '"]', box), { label:p.t, cls:"chips", key:it.id + p.id, options:it.options.map(function(o){ return { id:o.id, t:o.t, dis:x.solved }; }), value:x.p[p.id] || "", onChange:function(v){ x.p[p.id] = v; api.save(); } }); });
  }
  function clean(s){ return String(s || "").toUpperCase().replace(/[^ACGTU]/g, ""); }
  function solve(it, x, ok, msg){
    if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
    else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + msg + " Try again."; }
    api.save(); paintItem(it); MV.focusFb($('[data-dt="' + it.id + '"]', host));
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.dti; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.dti) { var b = host.querySelector('[data-k="' + e.target.dataset.dti + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var qb = b.closest("[data-dt]"); if (!qb) return;
    var it = byId(a.items, qb.dataset.dt), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it); return; }
    if (b.dataset.fo != null) { x.fpick = +b.dataset.fo; if (x.fpick === MV.right(it.follow.options)) x.fdone = true; api.save(); paintItem(it); MV.focusFb($(".mu-follow", qb)); return; }
    if (b.dataset.op != null) { var j = +b.dataset.op, o = it.options[j]; x.pick = j; solve(it, x, MV.ok(o), o.why); return; }
    if (b.dataset.act !== "check") return;
    if (it.kind === "codon") {
      var k = +x.codon, v = clean(x.val);
      if (!k || v.length !== 3) { msgs[it.id] = "Choose a codon and type its 3 new bases (coding strand, such as " + sqH("GTG") + ")."; paintItem(it); return; }
      if (/U/.test(v)) { msgs[it.id] = "Write the coding-strand codon with T; RNA has U."; paintItem(it); return; }
      var orig = GENE.substr(3 * k - 3, 3), diff = 0, q;
      for (q = 0; q < 3; q++) if (orig[q] !== v[q]) diff++;
      if (!diff) { msgs[it.id] = "That’s the same codon: nothing changed."; paintItem(it); return; }
      var mut = GENE.slice(0, 3 * k - 3) + v + GENE.slice(3 * k), T = translate(mut), ok = diff === 1 && T.start && T.stop && T.aa.join("") === it.target;
      var nmd = ok ? null : (it.named || []).filter(function(w){ return w.codon === k && (!w.val || w.val === v); })[0];
      solve(it, x, ok, nmd ? nmd.fb : diff > 1 ? "That’s " + diff + " changes; the mutant has a single change." : "That change gives " + (T.start ? protTxt(T.aa) + (T.stop ? "" : "…") : "no protein") + ". Compare it with the mutant protein.");
      return;
    }
    if (it.kind === "pair") {
      var p = x.p || {}, A = it.parts[0], B = it.parts[1];
      if (!p[A.id] || !p[B.id]) { msgs[it.id] = "Choose a protein for each deletion."; paintItem(it); return; }
      var okA = p[A.id] === MV.ans(A), okB = p[B.id] === MV.ans(B);
      solve(it, x, okA && okB, p[A.id] === "MPWKC" && p[B.id] === "MPWKC" ? it.bothW : (p[A.id] === "FS" || p[B.id] === "FS") ? it.fsW : !okB ? it.bothW : "Deleting 7–9 removes codon 3 exactly: write it out and read it in threes from ATG.");
    }
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Swap one amino acid (two substitution slots; live mRNA, protein and per-substitution types) ----------
var task = (function(){
  var api = null;
  function st(){ var s = api.S; if (!s.sub) s.sub = [{ p:"", b:"" }, { p:"", b:"" }]; return s; }
  function read(){ if (!api) return { s:[{ p:"", b:"" }, { p:"", b:"" }] }; return { s:st().sub.map(function(x){ return { p:x.p, b:x.b }; }) }; }
  function ready(x){ return x.p && x.b && GENE[+x.p - 1] !== x.b; }
  function apply(subs){ var a = GENE.split(""); subs.forEach(function(x){ if (ready(x)) a[+x.p - 1] = x.b; }); return a.join(""); }
  function effect(x){ var k = Math.floor((+x.p - 1) / 3); return subEffect(GENE, apply([x]), k); }
  function subLabel(x){ var p = +x.p, k = Math.floor((p - 1) / 3), o = GENE.substr(3 * k, 3), m = apply([x]).substr(3 * k, 3); return "base " + p + " " + GENE[p - 1] + " → " + x.b + " (" + o + " → " + m + ")"; }
  function draw(){
    var d = read(), box = $("#mu-tpv"); if (!box) return;
    var toks = GENE.split("").map(function(b, i){ return { b:b, o:i + 1 }; });
    d.s.forEach(function(x){ if (ready(x)) toks[+x.p - 1] = { b:x.b, o:+x.p, ed:1 }; });
    var s = seqOf(toks), rows = [["mRNA", sqH(mrnaTxt(s))], ["Protein", protHTML(s) + (translate(s).stop ? " (then stop)" : "")]];
    d.s.forEach(function(x, i){ rows.push(["Substitution " + (i + 1), ready(x) ? sqH(subLabel(x)) + ": " + effect(x).t : '<span class="muted">' + (x.p && x.b ? "that base is already " + x.b : "choose a position and a new base") + "</span>"]); });
    box.innerHTML = '<h4 class="mu-h">Your gene</h4>' + geneHTML(toks, {}) + '<dl class="read mu-tread">' + MV.readoutHTML(rows) + "</dl>";
  }
  function lab(key){ return key.split(",").map(function(k){ var p = k.split(":"); return sqH(subLabel({ p:p[0], b:p[1] })); }).join(" and "); }
  return {
    render:function(inp, pv, a){
      api = a; st();
      inp.innerHTML = '<p class="how mu-how">For each substitution, choose a base position (4–21) and its new base. The readouts update as you choose.</p>' + [0, 1].map(function(i){
        return '<fieldset class="mu-slot"><legend>Substitution ' + (i + 1) + '</legend><div class="numrow"><label for="mu-p' + i + '">Base position</label><select class="mu-sel" id="mu-p' + i + '" data-sp="' + i + '"><option value="">Choose…</option>' +
          GENE.split("").map(function(b, j){ return j < 3 ? "" : '<option value="' + (j + 1) + '">' + (j + 1) + " (" + b + ", codon " + (Math.floor(j / 3) + 1) + ")</option>"; }).join("") + '</select></div><div class="mu-row" data-sb="' + i + '"></div></fieldset>';
      }).join("");
      pv.innerHTML = '<div class="mu-tpv" id="mu-tpv"></div>';
      var R = [];
      function baseOpts(i){ var x = st().sub[i], cur = x.p ? GENE[+x.p - 1] : ""; return "ACGT".split("").map(function(b){ return { id:b, t:b, dis:b === cur }; }); }
      [0, 1].forEach(function(i){
        var x = st().sub[i]; $("#mu-p" + i, inp).value = x.p;
        R[i] = radios($('[data-sb="' + i + '"]', inp), { label:"New base", cls:"chips", key:"tb" + i, options:baseOpts(i), value:x.b, onChange:function(v){ st().sub[i].b = v; a.save(); draw(); a.update(); } });
      });
      inp.addEventListener("change", function(e){
        var i = e.target.dataset && e.target.dataset.sp; if (i == null) return;
        var x = st().sub[+i]; x.p = e.target.value; if (x.p && GENE[+x.p - 1] === x.b) { x.b = ""; R[+i].set(""); }
        R[+i].setOptions(baseOpts(+i)); a.save(); draw(); a.update();
      });
      draw();
    },
    read:read,
    valid:function(d){
      if (!d.s.every(function(x){ return x.p && x.b; })) return "Choose a position and a new base for both substitutions.";
      if (!d.s.every(ready)) return "Each substitution must change its base.";
      if (d.s[0].p === d.s[1].p) return "Choose two different positions: each substitution changes a different base.";
      return true;
    },
    checks:function(d){
      var s = apply(d.s), T = translate(s), k0 = Math.floor((+d.s[0].p - 1) / 3), k1 = Math.floor((+d.s[1].p - 1) / 3);
      return [T.start && T.stop && T.aa.join("") === "MPEWKS", k0 !== k1,
        d.s.some(function(x){ return +x.p >= 4 && +x.p <= 9 && effect(x).kind === "silent"; })];
    },
    key:function(d){ return d.s.slice().sort(function(x, y){ return +x.p - +y.p; }).map(function(x){ return x.p + ":" + x.b; }).join(","); },
    label:lab,
    text:function(k){ return MV.plain(lab(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ detective:detective },
  task:task,
  onShow:function(v){ if (EXF) EXF.show(v === "explore"); }
});
})();
