// SBI4U 23 Transcription: hero (polymerase lands, opens a bubble, mRNA peels off, falls off at the terminator), Transcription
// machine (S2 pathway stepper + S5 sequence workbench: mode, gene, template choice, What if?, Step / Play, eukaryote processing
// with cap, tail and splicing, codon preview), Pre-mRNA to mRNA (five stations), Sequence tasks (custom), "One gene, many messages".
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small helpers (from SBI4U 21 / 15) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "tx-sl", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function parseVal(raw){
  var s = String(raw == null ? "" : raw).replace(/[,\s]/g, "").replace(/[−–]/g, "-").replace(/[^0-9.\-\/]+/g, " ").trim().split(/\s+/)[0] || "";
  var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null;
}
function sq(s){ return '<span class="tx-sq">' + s + "</span>"; }
function uHi(s){ return String(s).replace(/U/g, '<b class="tx-u">U</b>'); }

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
// @component switchBtn (from SBI4U 12 / 09) — role="switch" button with a visible On/Off word
function swBtn(key, label, on, dis, word){
  return '<button type="button" class="btn ghost sm tx-sw" role="switch" aria-checked="' + !!on + '" data-sw="' + key + '" data-k="sw' + key + '"' + (dis ? " disabled" : "") + ">" + label + ": <b>" + (word ? word(on) : on ? "On" : "Off") + "</b></button>";
}

// ---------- @component S6 codonTable — the standard genetic code (64 codons, U C A G order); translate() reads from the 5′ end
// in triplets until a stop codon. Amino acids are drawn in --bio-carbon (course plan §3). ----------
var CODE = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG", NT = "UCAG";
var AA3 = { A:"Ala", R:"Arg", N:"Asn", D:"Asp", C:"Cys", Q:"Gln", E:"Glu", G:"Gly", H:"His", I:"Ile", L:"Leu", K:"Lys", M:"Met", F:"Phe", P:"Pro", S:"Ser", T:"Thr", W:"Trp", Y:"Tyr", V:"Val", "*":"stop" };
function aaOf(c){ var i = NT.indexOf(c[0]) * 16 + NT.indexOf(c[1]) * 4 + NT.indexOf(c[2]); return i < 0 || /[^UCAG]/.test(c) ? "?" : AA3[CODE[i]]; }
function translate(s){
  var r = { codons:[], aas:[], stop:false, start:s.slice(0, 3) === "AUG" };
  for (var i = 0; i + 3 <= s.length; i += 3) { var c = s.substr(i, 3), a = aaOf(c); r.codons.push(c); if (a === "stop") { r.stop = true; break; } r.aas.push(a); }
  return r;
}
function chain(r){ return r.aas.concat(r.stop ? ["stop"] : []).join("–"); }
function previewHTML(s){
  if (!s || s.length < 3) return "—";
  var r = translate(s);
  return sq(r.codons.join(" ")) + ' → <span class="tx-aa">' + chain(r) + "</span>" + (r.start ? "" : ' <span class="muted">(no AUG start at the 5′ end)</span>') + (r.stop ? "" : ' <span class="muted">(no stop codon)</span>');
}
function previewText(s){ if (!s || s.length < 3) return "none"; var r = translate(s); return r.codons.join(" ") + " → " + chain(r); }

// ---------- @component S5 sequence workbench — strands as data (coding strand 5′ → 3′ + promoter direction) ----------
var PAIR = { A:"T", T:"A", G:"C", C:"G", U:"A" };
function comp(b){ return PAIR[b] || "?"; }
function toRNA(s){ return s.replace(/T/g, "U"); }
function geneInfo(g){
  var coding = g.coding || g.segs.map(function(x){ return x[1]; }).join(""), n = coding.length, top, bot, kind = [];
  if (g.dir === 1) { top = coding; bot = coding.split("").map(comp).join(""); }
  else { bot = coding.split("").reverse().join(""); top = bot.split("").map(comp).join(""); }
  if (g.segs) g.segs.forEach(function(sg){ for (var j = 0; j < sg[1].length; j++) kind.push(sg[0]); });
  return { n:n, top:top, bot:bot, coding:coding, dir:g.dir, right:g.dir === 1 ? "bot" : "top", kind:kind, segs:g.segs || null, name:g.name };
}
function order(G, strand){ var o = []; for (var i = 0; i < G.n; i++) o.push(strand === "bot" ? i : G.n - 1 - i); return o; }
function baseAt(G, strand, p){ return toRNA(comp(strand === "bot" ? G.bot[p] : G.top[p])); }
function transcript(G, strand, k){ if (!strand) return ""; var o = order(G, strand), s = ""; for (var i = 0; i < Math.min(k, G.n); i++) s += baseAt(G, strand, o[i]); return s; }
function strandStr(G, which){ return which === "top" ? "5′-" + G.top + "-3′" : "3′-" + G.bot + "-5′"; }

// ---------- @component S2 pathwayStepper (transcription form) + machine drawing (viewBox (2 × 84 + 15n) × 188) ----------
// Template --ink (bold), coding --ink-2, mRNA teal (--bio-nadh, U's bold), introns shaded --ink-2 at 30 %, polymerase --ink-2.
var DX = 15, MX = 84, YT = 64, YB = 104, YMT = 26, YMB = 144, SH = 192;
function cxi(i){ return MX + i * DX + DX / 2; }
function machineSVG(G, s){
  var W = MX * 2 + G.n * DX, n = G.n, strand = s.tpl, act = s.st === "bound" || s.st === "elong", ord = strand ? order(G, strand) : null, h = "", i;
  var rk = []; if (ord) ord.forEach(function(p, r){ rk[p] = r; });
  function open(i){ if (!act) return 0; var d = rk[i] - s.k; return d >= -4 && d <= 1 ? 1 : 0; }
  // intron shading and segment labels (Gene E)
  if (G.segs) {
    var p = 0, ne = 0, ni = 0;
    G.segs.forEach(function(sg){
      var L = sg[1].length, x0 = MX + p * DX, lab;
      if (sg[0] === "i") { ni++; h += sv("rect", { x:x0, y:36, width:L * DX, height:128, "class":"tx-intr" }); lab = "intron " + ni; } else { ne++; lab = "exon " + ne; }
      h += txt(x0 + L * DX / 2, 182, lab, "tx-sl", "middle"); p += L;
    });
  }
  // promoter (bent arrow shows the direction of transcription) and terminator
  var pl = G.dir === 1, bw = 62, px0 = pl ? 6 : W - 6 - bw, tx0 = pl ? W - 6 - bw : 6, my = (YT + YB) / 2;
  h += sv("rect", { x:px0, y:YT - 14, width:bw, height:YB - YT + 22, rx:6, "class":"tx-prom" }) + txt(px0 + bw / 2, my + 2, "promoter", "tx-bl", "middle");
  if (s.mode === "euk") h += txt(px0 + bw / 2, my + 15, "TATA box", "tx-sl", "middle");
  var ax = pl ? px0 + 12 : px0 + bw - 12, ay = YT - 16, ad = pl ? 1 : -1;
  h += sv("path", { d:"M" + ax + " " + ay + " V" + (ay - 14) + " H" + (ax + ad * 34), "class":"tx-arr" }) +
    sv("path", { d:"M" + (ax + ad * 33) + " " + (ay - 19) + " L" + (ax + ad * 41) + " " + (ay - 14) + " L" + (ax + ad * 33) + " " + (ay - 9) + "Z", "class":"tx-arrh" });
  h += sv("rect", { x:tx0, y:YT - 14, width:bw, height:YB - YT + 22, rx:6, "class":"tx-term" }) + txt(tx0 + bw / 2, my + 4, "terminator", "tx-bl", "middle");
  // strands
  var yT = [], yB = [], topRole = strand === "top" ? "tpl" : strand === "bot" ? "cod" : "un", botRole = strand === "bot" ? "tpl" : strand === "top" ? "cod" : "un";
  for (i = 0; i < n; i++) { var o = open(i) ? 9 : 0; yT.push(YT - o); yB.push(YB + o); }
  function bb(ys, dy){ var d = "M" + (MX - 2) + " " + f1(ys[0] + dy); for (var j = 0; j < n; j++) d += " L" + f1(cxi(j)) + " " + f1(ys[j] + dy); return d + " L" + (MX + n * DX + 2) + " " + f1(ys[n - 1] + dy); }
  h += sv("path", { d:bb(yT, -14), "class":"tx-bb tx-r-" + topRole }) + sv("path", { d:bb(yB, 10), "class":"tx-bb tx-r-" + botRole });
  for (i = 0; i < n; i++) {
    if (!open(i)) h += sv("line", { x1:cxi(i), y1:yT[i] + 7, x2:cxi(i), y2:yB[i] - 15, "class":"tx-hb" });
    h += txt(cxi(i), yT[i] + 5, G.top[i], "tx-b tx-r-" + topRole, "middle") + txt(cxi(i), yB[i] + 5, G.bot[i], "tx-b tx-r-" + botRole, "middle");
  }
  h += txt(MX - 5, yT[0] + 5, "5′", "tx-end", "end") + txt(MX + n * DX + 5, yT[n - 1] + 5, "3′", "tx-end") +
    txt(MX - 5, yB[0] + 5, "3′", "tx-end", "end") + txt(MX + n * DX + 5, yB[n - 1] + 5, "5′", "tx-end");
  // mRNA
  if (strand && s.k > 0) {
    var y = strand === "bot" ? YMB : YMT, k = Math.min(s.k, n), first = ord[0], last = ord[k - 1], bl = strand === "bot" ? y + 10 : y - 14;
    h += sv("line", { x1:Math.min(cxi(first), cxi(last)) - 6, y1:bl, x2:Math.max(cxi(first), cxi(last)) + 6, y2:bl, "class":"tx-mbb" });
    for (var r = 0; r < k; r++) { var q = ord[r], b = baseAt(G, strand, q); h += txt(cxi(q), y + 5, b, "tx-m" + (b === "U" ? " tx-mu" : ""), "middle"); }
    var lft = strand === "bot", e5 = lft ? cxi(first) - 10 : cxi(first) + 10, e3 = lft ? cxi(last) + 10 : cxi(last) - 10;
    h += txt(e5, y + 5, "5′", "tx-end tx-mend", lft ? "end" : null) + txt(e3, y + 5, "3′", "tx-end tx-mend", lft ? null : "end");
    if (s.st === "done") h += txt(lft ? cxi(last) + 26 : cxi(last) - 26, y + 5, s.tpl === G.right ? "released" : "not the gene’s message", "tx-sl", lft ? null : "end");
  }
  // RNA polymerase
  if (act) {
    var cur = ord[Math.min(s.k, n - 1)], pxx = cxi(cur);
    h += sv("ellipse", { cx:pxx, cy:my - 4, rx:40, ry:50, "class":"tx-pol" }) + txt(pxx, my - 2, "RNA pol.", "tx-poll", "middle") + txt(pxx, my + 12, strand === "bot" ? "→" : "←", "tx-poll", "middle");
  }
  return { svg:h, w:W };
}

// ---------- Explore: Transcription machine ----------
var EX = null;
function explore(host, api){
  var C = MV.C.explore, S = api.S, MS = C.msgs;
  var D = { mode:"pro", gene:"P", tpl:"", whatIf:false, st:"idle", k:0, cap:false, tail:false, rm:[false, false], sk:[false, false, false] };
  Object.keys(D).forEach(function(k){ if (S[k] === undefined) S[k] = Array.isArray(D[k]) ? D[k].slice() : D[k]; });
  var G = geneInfo(C.genes[S.gene] || C.genes.P), timers = [], playing = false, busy = false, capMsg = "", procMsg = "", cutting = -1;
  S.k = clamp(+S.k || 0, 0, G.n);
  host.innerHTML = '<div class="tx-exw"><div class="pg tx-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<ol class="tx-path" id="tx-path" aria-label="Stages"></ol>' +
      '<div class="tx-scroll"><svg id="tx-svg" role="img" focusable="false" xmlns="http://www.w3.org/2000/svg"></svg></div>' +
      '<p class="tiny tx-key" aria-hidden="true"><span class="tx-k tx-kt">template</span> <span class="tx-k tx-kc">coding</span> <span class="tx-k tx-km">mRNA</span> <span class="tx-k tx-ki">intron</span></p>' +
      '<p class="tx-cap" id="tx-cap" aria-live="polite"></p><div id="tx-proc"></div></div>' +
    '<div class="pg-ctrl"><div id="tx-mode"></div><div id="tx-gene"></div><div id="tx-tpl"></div><div id="tx-wi"></div>' +
      '<div class="tx-player" id="tx-player" role="group" aria-label="Polymerase controls"></div></div>' +
    '<div class="pg-read"><dl class="read tx-read" id="tx-read" aria-live="polite"></dl><p class="tiny muted"><span class="bio-model">Model</span> ' + C.model + "</p></div></div></div>";
  var svg = $("#tx-svg", host), path = $("#tx-path", host), player = $("#tx-player", host), proc = $("#tx-proc", host), readEl = $("#tx-read", host);
  function geneOpts(){ return [{ id:"P", t:"Gene P", dis:S.mode !== "pro" }, { id:"Q", t:"Gene Q (further along)", dis:S.mode !== "pro" }, { id:"E", t:"Gene E", dis:S.mode !== "euk" }]; }
  var modeR = radios($("#tx-mode", host), { label:"Mode", key:"m", options:[{ id:"pro", t:"Prokaryote" }, { id:"euk", t:"Eukaryote" }], value:S.mode,
    onChange:function(v){ stop(); S.mode = v; S.gene = v === "euk" ? "E" : "P"; setGene(); } });
  var geneR = radios($("#tx-gene", host), { label:"Gene", key:"g", cls:"chips", options:geneOpts(), value:S.gene,
    onChange:function(v){ stop(); S.gene = v; setGene(); } });
  var tplR = radios($("#tx-tpl", host), { label:"Template", key:"t", options:[{ id:"top", t:"Top strand" }, { id:"bot", t:"Bottom strand" }], value:S.tpl,
    onChange:function(v){ stop(); S.tpl = v; resetRun(); capMsg = "Template: " + (v === "top" ? "top" : "bottom") + " strand. Press Step to start."; commit(); } });
  var wiBox = $("#tx-wi", host);
  function resetRun(){ S.st = "idle"; S.k = 0; S.cap = false; S.tail = false; S.rm = [false, false]; S.sk = [false, false, false]; procMsg = ""; }
  function setGene(){ G = geneInfo(C.genes[S.gene]); S.tpl = ""; resetRun(); capMsg = G.name + ". Choose the template strand."; modeR.set(S.mode); geneR.setOptions(geneOpts()); geneR.set(S.gene); tplR.set(""); commit(); }
  function wrong(){ return !!S.tpl && S.tpl !== G.right; }
  function mature(){
    if (S.mode !== "euk" || S.st !== "done" || S.tpl !== G.right || !G.segs) return null;
    var s = "", ne = 0, ni = 0;
    G.segs.forEach(function(sg){ var r = toRNA(sg[1]); if (sg[0] === "e") { if (!S.sk[ne]) s += r; ne++; } else { if (!S.rm[ni]) s += r; ni++; } });
    return s;
  }
  // ---- stepping ----
  function stepOnce(){
    if (S.st === "done") return false;
    if (S.st === "idle") {
      if (!S.tpl) { capMsg = MS.choose; return false; }
      if (wrong() && !S.whatIf) { capMsg = MS.refuse; return false; }
      S.st = "bound"; S.k = 0;
      capMsg = wrong() ? "What if? RNA polymerase is forced onto the " + (S.tpl === "top" ? "top" : "bottom") + " strand and reads it 3′ → 5′." :
        "Initiation: RNA polymerase binds the promoter" + (S.mode === "euk" ? " (with transcription factors at the TATA box)" : "") + " and opens a bubble in the DNA. No primer is needed.";
      return true;
    }
    S.k++; S.st = "elong";
    var b = transcript(G, S.tpl, S.k).slice(-1);
    capMsg = "Elongation: " + b + " added at the 3′ end (" + S.k + " of " + G.n + " nucleotides).";
    if (S.k >= G.n) {
      S.k = G.n; S.st = "done";
      capMsg = wrong() ? "The transcript is 5′-" + transcript(G, S.tpl, G.n) + "-3′. " + MS.notGene :
        "Termination: at the terminator, RNA polymerase lets go and the mRNA is released." + (S.mode === "euk" ? " Now process the pre-mRNA." : "");
    }
    return true;
  }
  function stop(){ timers.forEach(clearTimeout); timers = []; playing = false; }
  function play(){
    if (playing) { stop(); commit(); return; }
    if (MV.reduceMotion) { while (stepOnce()) {} commit(); return; }
    if (!stepOnce()) { commit(); return; }
    playing = true; commit();
    (function tick(){ timers.push(setTimeout(function(){ if (!playing) return; var ok = stepOnce(); if (!ok || S.st === "done") playing = false; commit(); if (playing) tick(); }, 333)); })();
  }
  // ---- splicing (with a collapse animation; reduced motion removes at once) ----
  function cut(j, done){
    if (S.rm[j]) { S.rm[j] = false; procMsg = "Intron " + (j + 1) + " put back."; commit(); if (done) done(); return; }
    function fin(){ cutting = -1; S.rm[j] = true; procMsg = "Removed: intron " + (j + 1) + " (" + G.segs[2 * j + 1][1].length + " nt)."; commit(); if (done) done(); }
    if (MV.reduceMotion) { fin(); return; }
    cutting = j; paintProc(); timers.push(MV.wait(520, fin));
  }
  // ---- painting ----
  function stageName(){ if (S.st === "idle") return "Not started"; if (S.st === "bound") return "Initiation"; if (S.st === "elong") return "Elongation"; return S.mode === "euk" && (S.cap || S.tail || S.rm[0] || S.rm[1] || S.sk.some(Boolean)) ? "Processing" : "Terminated"; }
  function paintPath(){
    var L = [["Initiation", S.st !== "idle", S.st === "bound"], ["Elongation", S.st === "done", S.st === "elong"], ["Termination", S.st === "done", false]];
    if (S.mode === "euk") L = L.concat([["Add 5′ cap", S.cap, false], ["Splice", S.rm[0] && S.rm[1], false], ["Add poly-A tail", S.tail, false]]);
    path.innerHTML = L.map(function(x, i){ return '<li class="' + (x[1] ? "done" : x[2] ? "cur" : "") + '">' + (x[1] ? "✓ " : "") + x[0] + (x[2] ? '<span class="vh"> (now)</span>' : "") + "</li>"; }).join("");
  }
  function paintSVG(){
    var m = machineSVG(G, S);
    svg.setAttribute("viewBox", "0 0 " + m.w + " " + SH);
    svg.style.minWidth = Math.round(m.w * 0.82) + "px"; svg.style.maxWidth = Math.round(m.w * 1.45) + "px";
    svg.innerHTML = m.svg;
    var tr = transcript(G, S.tpl, S.k);
    svg.setAttribute("aria-label", G.name + ". Promoter on the " + (G.dir === 1 ? "left, pointing right" : "right, pointing left") + ". Top strand 5′ " + G.top + " 3′; bottom strand 3′ " + G.bot + " 5′. " +
      (S.tpl ? "Template: " + (S.tpl === "top" ? "top" : "bottom") + " strand. " : "No template chosen. ") + "Stage: " + stageName() + ". " + (tr ? "mRNA so far 5′ " + tr + " 3′." : ""));
  }
  function paintPlayer(){
    var dis = busy;
    player.innerHTML = '<button type="button" class="btn primary sm" data-pa="step" data-k="txstep"' + (dis || S.st === "done" ? " disabled" : "") + ">" + (S.st === "idle" ? "Step (start)" : "Step") + "</button>" +
      '<button type="button" class="btn ghost sm" data-pa="play" data-k="txplay"' + (dis || S.st === "done" ? " disabled" : "") + ">" + (playing ? "Pause" : "Play") + "</button>" +
      '<button type="button" class="btn ghost sm" data-pa="reset" data-k="txreset"' + (dis ? " disabled" : "") + ">Reset</button>";
    wiBox.innerHTML = swBtn("wi", "What if? (let polymerase read either strand)", S.whatIf, dis);
    modeR.disable(dis); geneR.disable(dis); tplR.disable(dis);
  }
  function paintProc(){
    if (S.mode !== "euk") { proc.innerHTML = ""; return; }
    var h = '<div class="tx-proc"><h4 class="tx-ph">Processing in the nucleus</h4>';
    if (S.st !== "done" || S.tpl !== G.right) { proc.innerHTML = h + '<p class="tiny muted">' + (S.st === "done" ? MS.notGene : "Transcribe Gene E to the terminator to unlock the processing controls.") + "</p></div>"; return; }
    var mat = mature(), ne = 0, ni = 0, dis = busy;
    h += '<div class="tx-pbtns">' + swBtn("cap", "Add 5′ cap", S.cap, dis) + swBtn("tail", "Add poly-A tail", S.tail, dis) + "</div>";
    h += '<p class="tiny">Tap an intron to remove it, or tap an exon to skip it. Tap again to undo.</p><div class="tx-segs" role="group" aria-label="Pre-mRNA segments, 5′ to 3′">';
    if (S.cap) h += '<span class="tx-capg">5′ cap</span>';
    G.segs.forEach(function(sg){
      var r = toRNA(sg[1]);
      if (sg[0] === "e") { var j = ne++, off = S.sk[j];
        h += '<button type="button" class="tx-seg tx-ex' + (off ? " off" : "") + '" aria-pressed="' + off + '" data-sg="e' + j + '" data-k="sge' + j + '"' + (dis ? " disabled" : "") + '><span class="tx-sgl">Exon ' + (j + 1) + (off ? " skipped" : " · " + r.length + " nt") + "</span>" + (off ? "" : sq(uHi(r))) + "</button>"; }
      else { var q = ni++, gone = S.rm[q];
        h += '<button type="button" class="tx-seg tx-in' + (gone ? " gone" : "") + (cutting === q ? " cutting" : "") + '" aria-pressed="' + gone + '" data-sg="i' + q + '" data-k="sgi' + q + '"' + (dis ? " disabled" : "") + '><span class="tx-sgl">' + (gone ? "✂ Intron " + (q + 1) + " removed" : "Intron " + (q + 1) + " · " + r.length + " nt") + "</span>" + (gone ? "" : sq(uHi(r))) + "</button>"; }
    });
    if (S.tail) h += '<span class="tx-tailg">AAAA…A</span>';
    h += '</div><p class="tx-pmsg" aria-live="polite">' + procMsg + "</p>";
    h += '<p class="tx-mat"><strong>Mature mRNA:</strong> ' + (S.cap ? "cap–" : "") + '<span class="tx-sq tx-rsq">5′-' + uHi(mat) + "-3′</span>" + (S.tail ? "–AAAA…A" : "") + "</p></div>";
    MV.keepFocus(proc, function(){ proc.innerHTML = h; });
  }
  function paintRead(){
    var tr = transcript(G, S.tpl, S.k), mat = mature(), other = S.tpl === "top" ? "bot" : "top";
    var rows = [
      ["Template strand", S.tpl ? (S.tpl === "top" ? "Top: " : "Bottom: ") + '<span class="tx-sq tx-rsq">' + strandStr(G, S.tpl) + "</span> <span class=\"tiny muted\">read 3′ → 5′</span>" : "Not chosen yet"],
      ["Coding strand", S.tpl ? (other === "top" ? "Top: " : "Bottom: ") + '<span class="tx-sq tx-rsq">' + strandStr(G, other) + "</span>" : "—"],
      ["mRNA so far", tr ? '<span class="tx-sq tx-rsq tx-mr">5′-' + uHi(tr) + "-3′</span>" : "—"],
      ["Length", S.mode === "euk" ? "pre-mRNA " + tr.length + " nt" + (mat != null ? "; mature mRNA " + mat.length + " nt" + (S.cap ? " + cap" : "") + (S.tail ? " + tail" : "") : "") : tr.length + " nt"],
      ["Stage", stageName()]
    ];
    if (S.mode === "euk") { var ready = mat != null && S.cap && S.tail && S.rm[0] && S.rm[1];
      rows.push(["Processing", mat == null ? "—" : "Cap " + (S.cap ? "✓" : "✗") + ", introns removed " + (+S.rm[0] + +S.rm[1]) + "/2, tail " + (S.tail ? "✓" : "✗") + ". Ready for export: <strong>" + (ready ? "yes" : "no") + "</strong>"]); }
    rows.push(["Codon preview", S.st === "done" ? previewHTML(mat != null ? mat : tr) : "—"]);
    readEl.innerHTML = MV.readoutHTML(rows);
  }
  function commit(){ api.save(); paintPath(); paintSVG(); paintPlayer(); paintProc(); paintRead(); $("#tx-cap", host).textContent = capMsg; MV.changed(); }
  player.addEventListener("click", function(e){
    var b = e.target.closest("[data-pa]"); if (!b || b.disabled) return;
    if (b.dataset.pa === "step") { stop(); stepOnce(); commit(); }
    else if (b.dataset.pa === "play") play();
    else { stop(); resetRun(); capMsg = "Reset. Press Step to start."; commit(); }
  });
  wiBox.addEventListener("click", function(e){ var b = e.target.closest("[data-sw]"); if (!b || b.disabled) return; stop(); S.whatIf = !S.whatIf; if (wrong()) resetRun(); capMsg = S.whatIf ? "What if? mode: RNA polymerase can be forced onto either strand." : "What if? mode off."; commit(); });
  proc.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.sw === "cap") { S.cap = !S.cap; procMsg = S.cap ? "5′ cap added: a modified G on the front." : "Cap removed."; commit(); }
    else if (b.dataset.sw === "tail") { S.tail = !S.tail; procMsg = S.tail ? "Poly-A tail added at the 3′ end." : "Tail removed."; commit(); }
    else if (b.dataset.sg) { var j = +b.dataset.sg.slice(1);
      if (b.dataset.sg[0] === "e") { S.sk[j] = !S.sk[j]; procMsg = "Exon " + (j + 1) + (S.sk[j] ? " skipped." : " kept."); commit(); }
      else if (cutting < 0) cut(j); }
  });
  capMsg = S.tpl ? "" : G.name + ". Choose the template strand.";
  commit();

  // ---- target challenges ----
  function chal(id){
    var T = byId(C.challenges, id), W = T.msgs, tr = transcript(G, S.tpl, S.k), mat = mature();
    if (id === "tc1") {
      if (S.mode !== "pro" || S.gene !== "P") return { ok:false, msg:W.gene };
      if (S.tpl === "top" && S.st !== "idle") return { ok:false, msg:W.top };
      if (!S.tpl || S.st === "idle") return { ok:false, msg:T.general };
      if (S.st !== "done") return { ok:false, msg:W.unfinished };
      return tr === "AUGAAACGCUAA" ? { ok:true } : { ok:false, msg:T.general };
    }
    if (S.mode !== "euk") return { ok:false, msg:byId(C.challenges, "tc2").msgs.gene };
    var W2 = byId(C.challenges, "tc2").msgs;
    if (wrong() && S.st !== "idle") return { ok:false, msg:W2.tpl };
    if (S.st !== "done") return { ok:false, msg:W2.unfinished };
    if (id === "tc2") {
      if (!S.rm[0] || !S.rm[1]) return { ok:false, msg:W.intron };
      if (S.sk.some(Boolean)) return { ok:false, msg:W.exon };
      if (!S.cap || !S.tail) return { ok:false, msg:W.capTail };
      return mat === "AUGGCAAACUGGCAUGAAUAA" ? { ok:true } : { ok:false, msg:T.general };
    }
    if (id === "tc3") {
      if (S.sk[0]) return { ok:false, msg:W.e1 };
      if (S.sk[2]) return { ok:false, msg:W.e3 };
      if (!S.rm[0] || !S.rm[1]) return { ok:false, msg:W.intron };
      if (!S.sk[1]) return { ok:false, msg:W.full };
      if (!S.cap || !S.tail) return { ok:false, msg:W.capTail };
      return mat === "AUGGCAAACGAAUAA" ? { ok:true } : { ok:false, msg:T.general };
    }
    return { ok:false };
  }

  // ---- predictions ----
  var PS = {
    p1:{ mode:"pro", gene:"P", tpl:"bot", st:"bound", k:0 },
    p2:{ mode:"pro", gene:"P", tpl:"bot", st:"idle", k:0 },
    p3:{ mode:"euk", gene:"E", tpl:"bot", st:"done", k:37 },
    p4:{ mode:"pro", gene:"Q", tpl:"", st:"idle", k:0 }
  };
  function seq(list, done){
    var i = 0;
    (function next(){ if (i >= list.length) { done(); return; } var it = list[i++]; timers.push(MV.wait(it[0], function(){ it[1](); next(); })); })();
  }
  function steps(n, ms){ var L = []; for (var i = 0; i < n; i++) L.push([ms, function(){ stepOnce(); commit(); }]); return L; }
  EX = { stop:function(){ if (playing) { stop(); commit(); } } };
  return {
    predict:{
      start:function(p){
        stop(); busy = false; cutting = -1;
        var st = PS[p.id]; S.mode = st.mode; S.gene = st.gene; S.whatIf = false; G = geneInfo(C.genes[S.gene]); resetRun(); S.tpl = st.tpl; S.st = st.st; S.k = st.k;
        modeR.set(S.mode); geneR.setOptions(geneOpts()); geneR.set(S.gene); tplR.set(S.tpl);
        capMsg = p.id === "p4" ? "Further along the same DNA: Gene Q. Its promoter is on the right, pointing left. Make your prediction." : "Make your prediction.";
        commit();
      },
      run:function(p, done){
        busy = true; commit();
        function fin(){ busy = false; capMsg = p.reveal; commit(); done(); }
        if (p.id === "p1") seq(steps(G.n, 260), fin);
        else if (p.id === "p2") seq([[300, function(){ stepOnce(); commit(); }]].concat(steps(3, 450)), fin);
        else if (p.id === "p3") cut(0, function(){ timers.push(MV.wait(300, function(){ cut(1, fin); })); });
        else seq([[300, function(){ S.tpl = "top"; tplR.set("top"); capMsg = "Template: top strand."; commit(); }], [500, function(){ stepOnce(); commit(); }]].concat(steps(G.n, 260)), fin);
      }
    },
    challenge:chal
  };
}

// ---------- hero: polymerase lands on the promoter, opens a bubble, mRNA peels off, falls off at the terminator ----------
function hero(f){
  var box = $("#tx-hero"); if (!box) return;
  if (f && f.cap) f.cap.textContent = "Template in, matching message out.";
  box.innerHTML = '<svg viewBox="0 0 460 190" aria-hidden="true" focusable="false"></svg>';
  var svg = $("svg", box), X0 = 20, X1 = 440, PX = 92, TX = 380;
  function seg(t, a, b){ return clamp((t - a) / (b - a), 0, 1); }
  function frame(T){
    var land = seg(T, 0, 1), run = seg(T, 1.2, 5.6), off = seg(T, 5.8, 6.8), px = PX + (TX - PX) * run, oa = land > 0 && off < 1 ? 1 : 0;
    var A = 13 * seg(T, 0.8, 1.2) * (1 - off), h = "";
    function dy(x){ return A * Math.exp(-Math.pow((x - px) / 24, 2)); }
    h += sv("rect", { x:X0 + 6, y:58, width:60, height:66, rx:6, "class":"tx-prom" }) + txt(X0 + 36, 140, "promoter", "tx-sl", "middle");
    h += sv("rect", { x:TX, y:58, width:56, height:66, rx:6, "class":"tx-term" }) + txt(TX + 28, 140, "terminator", "tx-sl", "middle");
    var dT = "", dB = "";
    for (var x = X0; x <= X1; x += 4) { dT += (dT ? " L" : "M") + x + " " + f1(76 - dy(x)); dB += (dB ? " L" : "M") + x + " " + f1(106 + dy(x)); }
    for (var r = X0 + 6; r < X1; r += 12) { var o = dy(r); if (o < 3) h += sv("line", { x1:r, y1:76, x2:r, y2:106, "class":"tx-rung" }); else h += sv("line", { x1:r, y1:76 - o, x2:r, y2:83 - o, "class":"tx-rung" }) + sv("line", { x1:r, y1:99 + o, x2:r, y2:106 + o, "class":"tx-rung" }); }
    h += sv("path", { d:dT, "class":"tx-bb tx-r-cod" }) + sv("path", { d:dB, "class":"tx-bb tx-r-tpl" });
    // mRNA: paired with the template inside the bubble, peeling away behind it; after termination it drifts down
    var xe = run > 0 ? px - 8 : 0;
    if (run > 0 && xe > PX + 2) {
      var d = "", drift = 26 * off;
      for (var u = PX; u <= xe; u += 3) { var yy = 106 + dy(u) + 10 + Math.min(42, Math.max(0, (xe - u - 14) * 0.3)) + drift; d += (d ? " L" : "M") + f1(u) + " " + f1(yy); }
      h += sv("path", { d:d, "class":"tx-hmr" });
      h += txt(PX - 6, 106 + 10 + Math.min(42, Math.max(0, (xe - PX - 14) * 0.3)) + drift + 4, "5′", "tx-end tx-mend", "end");
      if (off > 0.5) h += txt(xe + 8, 126 + drift, "3′ mRNA", "tx-end tx-mend");
    }
    if (oa) { var py = -40 + 131 * land - 70 * off; h += sv("ellipse", { cx:px, cy:py, rx:28, ry:36, "class":"tx-pol", opacity:f1(1 - off) }) + txt(px, py + 4, "RNA pol.", "tx-poll", "middle"); }
    svg.innerHTML = h;
  }
  if (MV.reduceMotion) { frame(7); return; }
  frame(0);
  MV.tween({ dur:7000, ease:function(t){ return t; }, step:function(k){ frame(k * 7); }, done:function(){ frame(7); } });
}

// ---------- Part 3: Pre-mRNA to mRNA (five stations) ----------
function part3(host, api){
  var P = MV.C.part3, S = api.S;
  S.s1 = S.s1 || { cap:true, tail:true }; S.z = S.z || {}; S.s3 = S.s3 || { e2:true, e3:true, found:{} }; S.h = S.h || {};
  var msgs = {};
  host.innerHTML = '<div class="tx-p3"><p class="tx-panel"><span class="tag">' + P.panel + "</span></p>" +
    '<section class="tx-st" id="tx-s1"><h3>' + P.s1.title + "</h3><p>" + P.s1.text + '</p><div class="tx-pbtns" id="tx-s1c"></div><div class="tx-s1fig"><svg id="tx-s1svg" viewBox="0 0 440 136" role="img" focusable="false"></svg></div><p class="tx-out" id="tx-s1o" aria-live="polite"></p><p class="tx-card">' + P.s1.card + "</p></section>" +
    '<section class="tx-st" id="tx-s2"><h3>' + P.s2.title + "</h3><p>" + P.s2.text + '</p><p class="tx-card">' + P.s2.rule + "</p>" + P.s2.puzzles.map(function(z, i){ return '<div class="q tx-pz" data-z="' + z.id + '"></div>'; }).join("") + "</section>" +
    '<section class="tx-st" id="tx-s3"><h3>' + P.s3.title + "</h3><p>" + P.s3.text + '</p><div class="tx-pbtns" id="tx-s3c"></div><div id="tx-s3o" aria-live="polite"></div><p class="tx-card">' + P.s3.card + "</p></section>" +
    '<section class="tx-st" id="tx-s4"><h3>' + P.s4.title + "</h3>" + MV.tableHTML({ head:P.s4.head, rows:P.s4.rows, caption:"Transcription in prokaryotes and eukaryotes" }) + "</section>" +
    '<section class="tx-st" id="tx-s5"><h3>' + P.s5.title + "</h3><p>" + P.s5.text + '</p><div class="tx-s5fig"><svg viewBox="0 0 440 170" role="img" focusable="false" aria-label="Schematic of an mRNA–DNA hybrid: the DNA pairs with the mRNA in four double-stranded stretches, and between them the DNA bulges out in three single-stranded loops.">' + hybridSVG() + "</svg></div>" +
      P.s5.qs.map(function(q){ return '<div class="q tx-hq" data-hq="' + q.id + '"></div>'; }).join("") + "</section></div>";

  // Station 1: cap and tail
  function s1(){
    var c = S.s1.cap, t = S.s1.tail;
    $("#tx-s1c", host).innerHTML = swBtn("cap", "5′ cap", c) + swBtn("tail", "Poly-A tail", t);
    var life = c && t ? 1 : c ? 0.25 : t ? 0.08 : 0.04, x0 = c ? 72 : 96, x1 = t ? 300 : 276, h = "";
    h += sv("line", { x1:x0, y1:62, x2:x1, y2:62, "class":"tx-mline" }) + txt(250, 52, "AAUAAA", "tx-sl tx-mono", "middle");
    if (c) h += sv("circle", { cx:60, cy:62, r:11, "class":"tx-capc" }) + txt(60, 66, "G", "tx-bl", "middle") + txt(60, 92, "5′ cap", "tx-sl", "middle");
    if (t) h += txt(304, 66, "AAAAAAAA…A", "tx-m tx-mono") + txt(352, 92, "poly-A tail", "tx-sl", "middle");
    if (c) h += sv("ellipse", { cx:100, cy:44, rx:22, ry:12, "class":"tx-rib" }) + sv("ellipse", { cx:100, cy:72, rx:16, ry:9, "class":"tx-rib" }) + txt(100, 20, "ribosome loads", "tx-sl", "middle");
    else h += sv("ellipse", { cx:150, cy:20, rx:18, ry:9, "class":"tx-rib" }) + txt(176, 24, "✗ ribosome can’t load", "tx-sl");
    if (!c) h += sv("path", { d:"M70 62 L86 52 A18 18 0 1 0 86 72 Z", "class":"tx-nuc" }) + txt(70, 98, "enzyme", "tx-sl", "middle");
    if (!t) h += sv("path", { d:"M306 62 L290 52 A18 18 0 1 1 290 72 Z", "class":"tx-nuc" }) + txt(306, 98, "enzyme", "tx-sl", "middle");
    h += txt(20, 116, "Lifetime in the model cytoplasm", "tx-sl") + sv("rect", { x:220, y:106, width:200, height:12, rx:3, "class":"tx-barbg" }) + sv("rect", { x:220, y:106, width:f1(200 * life), height:12, rx:3, "class":"tx-bar" });
    var out = c && t ? "Protected at both ends: the mRNA is exported, the ribosome loads at the cap, and the message lasts (long lifetime in the model)." :
      !c && !t ? "No cap and no tail: the mRNA is broken down almost at once, and no protein is made." :
      !c ? "No cap: the mRNA is broken down in the model cytoplasm, and the ribosome can’t load." : "No tail: the mRNA’s lifetime falls sharply as enzymes nibble it from the 3′ end.";
    var s = $("#tx-s1svg", host); s.innerHTML = h; s.setAttribute("aria-label", "mRNA in the model cytoplasm. Cap " + (c ? "on" : "off") + ", tail " + (t ? "on" : "off") + ". " + out);
    $("#tx-s1o", host).innerHTML = '<span class="bio-model">Model</span> ' + out;
  }
  $("#tx-s1c", host).addEventListener("click", function(e){ var b = e.target.closest("[data-sw]"); if (!b) return; S.s1[b.dataset.sw] = !S.s1[b.dataset.sw]; api.save(); MV.keepFocus($("#tx-s1c", host), s1); });

  // Station 2: splicing puzzles (tap start, then end; arrow keys move along the strand)
  function zst(id){ return S.z[id] || (S.z[id] = { a:null, b:null, tries:0, solved:false }); }
  function spliced(z, a, b){ return z.pre.slice(0, a) + z.pre.slice(b + 1); }
  function paintZ(z){
    var x = zst(z.id), el = $('[data-z="' + z.id + '"]', host), i = P.s2.puzzles.indexOf(z), lo = x.a, hi = x.b == null ? x.a : x.b;
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">Puzzle ' + (i + 1) + ": a 30-nucleotide pre-mRNA" + (z.decoy ? " (watch out: a GU also sits inside an exon)" : "") + ". Mark the intron.</div></div>";
    h += '<div class="tx-nts" role="group" aria-label="Pre-mRNA, 5′ to 3′">' + '<span class="tx-end" aria-hidden="true">5′</span>' + z.pre.split("").map(function(b, j){
      var inR = lo != null && j >= lo && j <= hi, mk = j === x.a ? " start" : j === x.b ? " endm" : "";
      return '<button type="button" class="tx-nt' + (inR ? " in" : "") + mk + '" data-nt="' + j + '" data-k="nt' + z.id + j + '" tabindex="' + (j === (x.a == null ? 0 : x.a) ? 0 : -1) + '" aria-label="' + b + ", position " + (j + 1) + (j === x.a ? ", marked start" : j === x.b ? ", marked end" : "") + '"' + (x.solved ? " disabled" : "") + ">" + b + "</button>";
    }).join("") + '<span class="tx-end" aria-hidden="true">3′</span></div>';
    h += '<p class="tiny muted">' + (x.a == null ? "Tap the first nucleotide of the intron." : x.b == null ? "Now tap the last nucleotide of the intron." : "Intron marked: positions " + (x.a + 1) + " to " + (x.b + 1) + ". Tap again to start over.") + "</p>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="zc' + z.id + '">Check</button></div>';
    if (x.solved) { var ans = MV.ans(z), s = spliced(z, ans[0], ans[1]); h += MV.fbHTML("good", "<strong>✓ Correct.</strong> Spliced: " + previewHTML(s) + (x.tries ? ' <span class="muted">(not first try)</span>' : "")); }
    else if (msgs[z.id]) h += MV.fbHTML("bad", msgs[z.id]);
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  P.s2.puzzles.forEach(function(z){
    var el = $('[data-z="' + z.id + '"]', host);
    el.addEventListener("click", function(e){
      var b = e.target.closest("button"); if (!b || b.disabled) return;
      var x = zst(z.id);
      if (b.dataset.nt != null) { var j = +b.dataset.nt; msgs[z.id] = null;
        if (x.a == null || x.b != null) { x.a = j; x.b = null; } else if (j < x.a) { x.b = x.a; x.a = j; } else x.b = j;
        api.save(); paintZ(z); return; }
      if (b.dataset.act !== "check") return;
      if (x.a == null || x.b == null) { msgs[z.id] = "Tap the start and then the end of the intron."; paintZ(z); return; }
      var ans = MV.ans(z);
      if (x.a === ans[0] && x.b === ans[1]) { x.solved = true; msgs[z.id] = null; }
      else {
        x.tries++;
        if (z.pre.substr(x.a, 2) !== "GU") msgs[z.id] = "<strong>✗ Not quite.</strong> An intron begins with GU. Start on a G that is followed by U.";
        else if (x.b < 1 || z.pre.substr(x.b - 1, 2) !== "AG") msgs[z.id] = "<strong>✗ Not quite.</strong> An intron ends with AG. End on the G of an AG.";
        else msgs[z.id] = "<strong>✗ Not quite.</strong> That’s a GU…AG stretch, but removing it leaves " + previewHTML(spliced(z, x.a, x.b)) + ": the reading frame from AUG doesn’t end cleanly at a stop codon. Try another GU.";
      }
      api.save(); paintZ(z); MV.focusFb(el);
    });
    el.addEventListener("keydown", function(e){
      var b = e.target.closest("[data-nt]"); if (!b) return;
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return;
      e.preventDefault(); var all = $$("[data-nt]", el), i = all.indexOf(b), nx = all[clamp(i + d, 0, all.length - 1)];
      all.forEach(function(q){ q.tabIndex = -1; }); nx.tabIndex = 0; nx.focus();
    });
    paintZ(z);
  });

  // Station 3: one gene, many proteins
  function s3(){
    var st = S.s3, X = P.s3.exons, s = X[0] + (st.e2 ? X[1] : "") + (st.e3 ? X[2] : "") + X[3], key = (st.e2 ? "2" : "") + (st.e3 ? "3" : "");
    st.found[key || "none"] = true;
    $("#tx-s3c", host).innerHTML = swBtn("e2", "Exon 2", st.e2, false, function(on){ return on ? "Included" : "Skipped"; }) + swBtn("e3", "Exon 3", st.e3, false, function(on){ return on ? "Included" : "Skipped"; });
    var n = Object.keys(st.found).length;
    $("#tx-s3o", host).innerHTML = '<div class="tx-exrow" aria-hidden="true">' + X.map(function(e, i){ var on = i === 0 || i === 3 || (i === 1 ? st.e2 : st.e3); return '<span class="tx-exb' + (on ? "" : " off") + '">Exon ' + (i + 1) + "<br>" + sq(on ? e : "skipped") + "</span>"; }).join("") + "</div>" +
      '<p><strong>mRNA:</strong> <span class="tx-sq tx-rsq">5′-' + uHi(s) + "-3′</span></p><p><strong>Protein:</strong> " + previewHTML(s) + "</p>" +
      '<p class="tx-found">mRNAs found: <strong>' + n + "/4</strong>" + (n >= 4 ? " ✓ Four mRNAs and four proteins from one gene." : "") + "</p>";
  }
  $("#tx-s3c", host).addEventListener("click", function(e){ var b = e.target.closest("[data-sw]"); if (!b) return; S.s3[b.dataset.sw] = !S.s3[b.dataset.sw]; api.save(); MV.keepFocus($("#tx-s3c", host), s3); });

  // Station 5: hybrid-loop questions (chips; feedback on each tap)
  function paintH(q){
    var st = S.h[q.id] || {}, el = $('[data-hq="' + q.id + '"]', host);
    var h = '<div class="q-prompt">' + q.q + '</div><div class="chips" role="group" aria-label="Choices">' + MV.shuffle(q.chips.map(function(c, j){ return j; }), "tx" + q.id).map(function(j){
      var on = st.pick === j; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-hc="' + j + '" data-k="hc' + q.id + j + '"' + (st.solved ? " disabled" : "") + ">" + q.chips[j].t + "</button>"; }).join("") + "</div>";
    if (st.pick != null) { var c = q.chips[st.pick], ok = MV.ok(c); h += MV.fbHTML(ok ? "good" : "bad", "<strong>" + (ok ? "✓ Correct." : "✗ Not quite.") + "</strong> " + c.fb + (ok ? "" : " Try another.")); }
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  P.s5.qs.forEach(function(q){
    var el = $('[data-hq="' + q.id + '"]', host);
    el.addEventListener("click", function(e){ var b = e.target.closest("[data-hc]"); if (!b || b.disabled) return; var st = S.h[q.id] || (S.h[q.id] = {}); st.pick = +b.dataset.hc; if (MV.ok(q.chips[st.pick])) st.solved = true; api.save(); paintH(q); MV.focusFb(el); });
    paintH(q);
  });
  s1(); s3();
}
// @component hybridLoops — S7 data figure: mRNA (teal) paired with gene DNA (--ink); unpaired intron DNA bulges out as loops
function hybridSVG(){
  var xs = [30, 120, 200, 280, 350], h = "", d = "M30 96";
  for (var i = 1; i < xs.length - 1; i++) { var x = xs[i]; d += " L" + (x - 6) + " 96 C" + (x - 40) + " 10, " + (x + 40) + " 10, " + (x + 6) + " 96"; }
  d += " L" + xs[xs.length - 1] + " 96";
  h += sv("path", { d:d, "class":"tx-dna" }) + sv("line", { x1:30, y1:108, x2:350, y2:108, "class":"tx-mline" });
  for (i = 0; i < 4; i++) h += txt((xs[i] + xs[i + 1]) / 2, 128, "paired", "tx-sl", "middle");
  h += txt(120, 18, "loop", "tx-sl", "middle") + txt(200, 18, "loop", "tx-sl", "middle") + txt(280, 18, "loop", "tx-sl", "middle");
  h += txt(360, 100, "DNA", "tx-sl") + txt(360, 112, "mRNA", "tx-sl tx-mtxt") + txt(190, 156, "single-stranded loops = DNA with no partner in the mRNA", "tx-sl", "middle");
  return h;
}

// ---------- Practice 2: Sequence tasks (custom S5 sequence entry with fixed 5′/3′ ends, and N4 numbers; from SBI4U 14's acct) ----------
function seqAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", tries:0, hint:0, solved:false, first:null }); }
  function norm(v){ return String(v || "").toUpperCase().replace(/[^ACGTU]/g, ""); }
  function compS(s, rna){ return s.split("").map(function(b){ var c = comp(b); return rna && c === "T" ? "U" : c; }).join(""); }
  host.innerHTML = '<p class="how">Press Check after each answer. You can try again as often as you need.</p>' + a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), el = $('[data-li="' + it.id + '"]', host), id = "tx-li-" + it.id;
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    h += '<div class="numrow tx-seqrow"><label for="' + id + '">' + (it.kind === "seq" ? "Your strand:" : "Your answer:") + "</label>" + (it.kind === "seq" ? '<span class="tx-sq">5′-</span>' : "") +
      '<input class="numin' + (it.kind === "seq" ? " tx-seqin" : "") + '" id="' + id + '" data-lin="' + it.id + '" type="text" inputmode="' + (it.kind === "seq" ? "text" : "decimal") + '" autocomplete="off" autocapitalize="characters" spellcheck="false" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + ">" +
      (it.kind === "seq" ? '<span class="tx-sq">-3′</span>' : it.unit ? '<span class="tx-unit">' + it.unit + "</span>" : "") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML("bad", msgs[it.id]);
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lin) { var b = $('[data-k="' + e.target.dataset.lin + 'chk"]', host); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var el = b.closest("[data-li]"); if (!el) return;
    var it = byId(a.items, el.dataset.li), x = ist(it.id), ok = false, ans = MV.ans(it);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it); return; }
    if (b.dataset.act !== "check") return;
    if (it.kind === "seq") {
      var v = norm(x.val), A = String(ans);
      if (!v) { msgs[it.id] = "Type the bases, such as AUGC."; paintItem(it); return; }
      ok = v === A;
      if (!ok) {
        var w = (it.wrong || []).filter(function(q){ return q.match === v; })[0], fb;
        if (w) fb = w.fb;
        else if (it.rna && /T/.test(v)) fb = "RNA uses U where DNA uses T.";
        else if (!it.rna && /U/.test(v)) fb = "This strand is DNA: it uses T, not U.";
        else if (v === A.split("").reverse().join("")) fb = "Those bases are right, but that’s written 3′ → 5′. Reverse it.";
        else if (v === compS(A, it.rna)) fb = "Those are the partners of the answer. Check which strand your answer should match.";
        else if (v.length !== A.length) fb = "Check the length: the answer has " + A.length + " bases.";
        else fb = "Check each pair (A–U, T–A, G–C) and the direction (5′ → 3′).";
        msgs[it.id] = "<strong>✗ Not quite.</strong> " + fb + " Try again.";
      }
    } else {
      var n = parseVal(x.val);
      if (n == null) { msgs[it.id] = "Enter a number."; paintItem(it); return; }
      ok = Math.abs(n - ans) < 1e-9;
      if (!ok) { var w2 = (it.wrong || []).filter(function(q){ return Math.abs(n - q.match) < 1e-9; })[0]; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (w2 ? w2.fb : it.general) + " Try again."; }
    }
    if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else x.tries++;
    api.save(); paintItem(it); MV.focusFb(el);
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: One gene, many messages (keep/skip exons, remove/keep introns, cap, tail; S6 protein readout) ----------
var task = (function(){
  var api = null, T = null;
  function st(){ var s = api.S; if (!s.e) s.e = [true, true, true, true, true]; if (!s.i) s.i = [false, false, false, false]; if (s.cap == null) s.cap = false; if (s.tail == null) s.tail = false; return s; }
  function read(){ if (!api) return { e:[true, true, true, true, true], i:[false, false, false, false], cap:false, tail:false }; var s = st(); return { e:s.e.slice(), i:s.i.slice(), cap:!!s.cap, tail:!!s.tail }; }
  function mat(d){ var s = "", ne = 0, ni = 0; T.segs.forEach(function(g){ if (g[0][0] === "E") { if (d.e[ne]) s += g[1]; ne++; } else { if (!d.i[ni]) s += g[1]; ni++; } }); return s; }
  function keyOf(d){ return d.e.map(function(on, j){ return on ? String(j + 1) : ""; }).join(""); }
  function lab(k){ var d = { e:[1, 2, 3, 4, 5].map(function(j){ return k.indexOf(String(j)) >= 0; }), i:[true, true, true, true] }; return k.split("").map(function(j){ return "E" + j; }).join("+") + " (" + translate(mat(d)).aas.join("–") + ")"; }
  function draw(){
    var d = read(), s = mat(d), r = translate(s), el = $("#tx-tpv"); if (!el) return;
    el.innerHTML = '<div class="tx-segs tx-tsegs" aria-hidden="true">' + (d.cap ? '<span class="tx-capg">5′ cap</span>' : "") + T.segs.map(function(g, j){
      var ex = g[0][0] === "E", idx = Math.floor(j / 2), on = ex ? d.e[idx] : !d.i[idx];
      return on ? '<span class="tx-seg ' + (ex ? "tx-ex" : "tx-in") + ' tx-segs-s"><span class="tx-sgl">' + g[0] + "</span>" + sq(uHi(g[1])) + "</span>" : "";
    }).join("") + (d.tail ? '<span class="tx-tailg">AAAA…A</span>' : "") + "</div>" +
      '<dl class="read">' + MV.readoutHTML([["Mature mRNA", s ? '<span class="tx-sq tx-rsq">5′-' + uHi(s) + "-3′</span>" : "—"], ["Codons", s.length >= 3 ? sq(r.codons.join(" ")) : "—"],
        ["Protein", s.length >= 3 ? '<span class="tx-aa">' + chain(r) + "</span>" + (r.start ? "" : ' <span class="muted">(no AUG start)</span>') + (r.stop ? "" : ' <span class="muted">(no stop codon)</span>') : "—"],
        ["Protein length", r.aas.length + " amino acids"], ["Ready for export", d.cap && d.tail && d.i.every(Boolean) ? "yes" : "no"]]) + "</dl>";
  }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; st();
      function paint(){
        var s = st();
        inp.innerHTML = '<div class="tx-tin"><p class="tx-tl">Exons</p><div class="tx-pbtns">' + [0, 1, 2, 3, 4].map(function(j){ return swBtn("e" + j, "E" + (j + 1), s.e[j], false, function(on){ return on ? "Keep" : "Skip"; }); }).join("") + "</div>" +
          '<p class="tx-tl">Introns</p><div class="tx-pbtns">' + [0, 1, 2, 3].map(function(j){ return swBtn("i" + j, "I" + (j + 1), s.i[j], false, function(on){ return on ? "Removed" : "Kept"; }); }).join("") + "</div>" +
          '<p class="tx-tl">Ends</p><div class="tx-pbtns">' + swBtn("cap", "5′ cap", s.cap) + swBtn("tail", "Poly-A tail", s.tail) + "</div></div>";
      }
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-sw]"); if (!b) return; var s = st(), k = b.dataset.sw;
        if (k === "cap" || k === "tail") s[k] = !s[k]; else s[k[0]][+k.slice(1)] = !s[k[0]][+k.slice(1)];
        a.save(); MV.keepFocus(inp, paint); draw(); a.update();
      });
      paint();
      pv.innerHTML = '<div class="tx-tpw"><h4>Live readouts</h4><div id="tx-tpv" aria-live="polite"></div></div>';
      draw();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var r = translate(mat(d)); return [d.i.every(Boolean), d.cap && d.tail, d.e[0] && d.e[4], r.aas.length >= 5, d.e[2]]; },
    key:keyOf,
    label:function(k){ return MV.esc(lab(k)); },
    text:lab
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ seqs:seqAct },
  task:task,
  onShow:function(v){ if (EX && v !== "explore") EX.stop(); }
});
})();
