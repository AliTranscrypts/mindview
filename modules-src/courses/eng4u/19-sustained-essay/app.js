// ENG4U 19 The Sustained Literary-Analysis Essay: hero (Bacon's ladder becomes a blueprint), Essay architect (Explore: E7 thesis
// forge + outline + evidence bank with E8 citations + E6 paragraph + coherence map + conclusion, one screen with six mode tabs, a live
// blueprint and readouts), The argument line (Part 3: reverse outline stations on an original model essay), Spot the Error (K13),
// and the "Blueprint and one true paragraph" task (E7, E1 tags, E6 guidance, E17 drafts; structure checks only).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function wc(s){ return MV.eng.wordCount(s || ""); }
function plain(h){ return String(h || "").replace(/<[^>]+>/g, ""); }

// ---------- @component radioGroup (copied from ENG4U 06; no option needs to be checked) ----------
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id)}) -> {set, get, lock, refresh}
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), locked = false;
  function off(id){ return locked || !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = ids.indexOf(val) >= 0 && !off(val) ? val : ids.filter(function(id){ return !off(id); })[0];
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + esc(id) + '"' + (off(id) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector('[tabindex="0"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (off(id)) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled && host.contains(b)) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(b.dataset.rg);
    for (var k = 0; k < ids.length; k++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); var nb = host.querySelector('[data-rg="' + ids[i] + '"]'); if (nb) nb.focus(); return; } }
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, refresh:paint };
}

// ---------- local voice (read-aloud never leaves the device) ----------
var VOICE = null;
function voiceReady(fn){ MV.eng.voice(function(v){ VOICE = v; document.documentElement.classList.toggle("se-novoice", !v); if (fn) fn(v); }); }

// ---- pure:start ---- text tests shared by the essay architect and the task (plain string tests; structure only, never quality)
function XC(){ return MV.C.explore; }
var STOP = null;
function stopSet(){ if (!STOP) { STOP = {}; XC().stop.forEach(function(w){ STOP[w] = 1; }); } return STOP; }
function lw(s){ return String(s || "").toLowerCase().replace(/<[^>]+>/g, " ").replace(/[’']s\b/g, "").split(/[^a-zà-ÿ]+/).filter(Boolean); }
// a word "carries" a term if it is the term or a listed form of it (verdict/verdicts, reject/rejection, monster/monstrousness)
function stemEq(w, t){
  if (w === t) return true;
  if (t.length < 5) return w.indexOf(t) === 0 && w.length - t.length <= 3;
  var n = Math.min(w.length, t.length); if (n < 5) return false;
  var p = 0; while (p < n && w[p] === t[p]) p++;
  return p >= Math.max(5, n - 3);
}
// key terms: lower-cased thesis words of 5+ letters minus the stop list and the title/author words, plus the student's own terms
function keyTerms(text, o){
  o = o || {}; var st = stopSet(), ex = {}, out = [];
  lw(o.exclude || "").forEach(function(w){ ex[w] = 1; });
  lw(text).forEach(function(w){ if (w.length < 5 || st[w] || ex[w]) return; if (out.some(function(t){ return stemEq(w, t); })) return; out.push(w); });
  (o.rm || []).forEach(function(r){ out = out.filter(function(t){ return t !== r; }); });
  (o.add || []).forEach(function(a){ a = String(a || "").toLowerCase().trim(); if (a && out.indexOf(a) < 0) out.push(a); });
  return out;
}
function carries(s, terms){ var W = lw(s); return terms.filter(function(t){ return W.some(function(w){ return stemEq(w, t); }); }); }
function transIn(s){ var t = " " + lw(s).join(" ") + " "; return XC().transitions.filter(function(x){ return t.indexOf(" " + x + " ") >= 0; }); }
var CITE = /\((?:[A-Z][\w’'À-ÿ-]+(?:,? )?)?(?:\d+(?:[–-]\d+)?|ch\. \d+)\)/;
function quotes(t){
  var out = [], m, re = /["“]([^"“”]+)["”]/g; t = String(t || "");
  while ((m = re.exec(t))) { var end = m.index + m[0].length, c = CITE.exec(t.slice(end)); out.push({ q:m[1], start:m.index, end:end, cited:!!c && c.index <= 40 }); }
  return out;
}
function quoteSplit(t){ var Q = quotes(t), inside = 0; Q.forEach(function(q){ inside += wc(q.q); }); return { inside:inside, outside:wc(String(t || "").replace(/["“][^"“”]+["”]/g, " ")), Q:Q }; }
function sentences(t){
  var s = String(t || "").replace(/\b(?:ch|e\.g|i\.e|mr|mrs|ms|dr|st|vol|pp|p)\./gi, function(m){ return m.replace(/\./g, "\u0001"); }).replace(/\b([A-Z])\.(?=\s+[A-Z])/g, "$1\u0001");
  var parts = s.match(/[^.?!]+(?:[.?!]+["”’)]*|$)/g) || [];
  return parts.map(function(p){ return p.replace(/\u0001/g, ".").trim(); }).filter(function(p){ return /[A-Za-z]/.test(p); });
}
// thesis status by keyword rules (free text and "My novel"); practice texts use the chips' own kinds
function ruleStatus(s){
  var E = XC(), t = " " + lw(s).join(" ") + " ", n = wc(s);
  if (!n) return "none";
  if (n < 6 || / is about /.test(t)) return "topic";
  if (E.vague.some(function(v){ return t.indexOf(" " + v + " ") >= 0; })) return "vague";
  var dev = E.devices.filter(function(d){ return t.indexOf(" " + d + " ") >= 0; }).length;
  var claim = / (shows? that|suggests?|presents?|reveals?|argues?|makes?|turns?|exposes?|transforms?|blames?|insists?|proves?|portrays?|treats?|depicts?|frames?|casts?|sets?|refuses?|challenges?|questions?|undercuts?|complicates?) /.test(t) || / uses? .+ to /.test(t) || / not .+ but /.test(t);
  if (/ uses? /.test(t) && dev >= 2 && !claim) return "devices";
  if (!claim) return "fact";
  if (!/ (by|through|using|via|uses?) /.test(t)) return "noHow";
  if (!/ (suggests?|suggesting|which|implies|implying|reveals?|revealing|asks?|asking|so that|warns?|warning|because|to show|showing|matters?) /.test(t)) return "noWhy";
  return "good";
}
function lastWord(s){ var w = String(s || "").trim().split(/\s+/); return w[w.length - 1] || ""; }
function taskTerms(d){ return keyTerms(d.thesis, { exclude:d.title + " " + d.author, add:String(d.extra || "").split(/[,;]/) }); }
function taskChecks(d, T){
  var th = String(d.thesis || ""), low = th.toLowerCase(), sur = lastWord(d.author).toLowerCase(), title = String(d.title || "").trim().toLowerCase();
  var c1 = !!title && low.indexOf(title) >= 0 && !!sur && low.indexOf(sur) >= 0;
  var ns = sentences(th).length, nw = wc(th), c2 = ns >= 1 && ns <= 2 && nw >= T.thesisWords[0] && nw <= T.thesisWords[1];
  var nt = MV.eng.tokenize(th).length, tg = d.tags || {};
  var c3 = nw > 0 && ["claim", "how", "why"].every(function(r){ return (tg[r] || []).filter(function(i){ return i < nt; }).length > 0; });
  var terms = taskTerms(d), bs = (d.beams || []).map(function(s){ return String(s || "").trim(); }).filter(Boolean);
  var c4 = bs.length >= 3 && bs.length <= 4 && bs.every(function(b){ return wc(b) >= T.beamMin && carries(b, terms).length > 0; });
  var cre = new RegExp("\\b(" + T.concede.join("|") + ")\\b", "i"), c5 = wc(d.counter) >= T.counterMin && cre.test(d.counter || "");
  var p = String(d.para || ""), pw = wc(p), c6 = pw >= T.paraWords[0] && pw <= T.paraWords[1];
  var qs = quoteSplit(p), c7 = qs.Q.filter(function(q){ return q.cited; }).length >= 2;
  var vre = new RegExp("\\b(" + T.verbStems.join("|") + ")[a-z]*", "i");
  var c8 = qs.Q.length > 0 && vre.test(p.slice(qs.Q[0].end)) && qs.inside > 0 && qs.outside >= T.ratio * qs.inside;
  var first = sentences(p)[0] || "", fk = keyTerms(first, { exclude:d.title + " " + d.author });
  var c9 = !!first && bs.some(function(b){ return carries(b, fk).length >= T.shared; });
  var c10 = wc(d.explain) >= T.craftMin;
  return [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];
}
// ---- pure:end ----

// ---------- hero: Bacon's sentence word by word; the clauses form a ladder; "exact" drops into a blueprint ----------
var HR = { stop:null };
function hero(){
  var H = MV.C.hero, host = $("#se-hero"); if (!host) return;
  var wi = 0, words = [];
  var sent = H.clauses.map(function(c, ci){
    return '<span class="se-cl" data-cl="' + ci + '">' + c.split(" ").map(function(w){ var bw = w.replace(/[^A-Za-z]/g, ""), g = H.glow.indexOf(bw) >= 0; words.push(bw); return '<span class="se-hw' + (g ? " se-gl" : "") + '" data-wi="' + (wi++) + '">' + esc(w) + "</span>"; }).join(" ") + "</span>";
  }).join(" ");
  var bp = '<svg class="se-hbp" viewBox="0 0 300 160" role="img" aria-label="Blueprint: a thesis roof, three beams for topic sentences and an evidence foundation">' +
    '<polygon class="se-hroof" points="20,58 150,12 280,58"/><text class="se-hx" x="150" y="46" text-anchor="middle">exact</text><text class="se-hrl" x="150" y="46" text-anchor="middle">' + H.bp.roof + "</text>" +
    [0, 1, 2].map(function(i){ var x = 62 + i * 76; return '<rect class="se-hbeam" style="--i:' + i + '" x="' + (x - 11) + '" y="62" width="22" height="62" rx="2"/>'; }).join("") +
    '<text class="se-hlab" x="150" y="98" text-anchor="middle">' + H.bp.beams + '</text><rect class="se-hbase" x="20" y="128" width="260" height="18" rx="2"/><text class="se-hlab se-hbl" x="150" y="141" text-anchor="middle">' + H.bp.base + "</text></svg>";
  host.innerHTML = '<p class="se-hs">' + sent + "</p>" + bp + '<p class="se-hcap">' + H.caption + '</p><p class="eng-cite">' + H.cite + "</p>" +
    '<div class="se-hctl"><button type="button" class="btn ghost sm" id="se-hlisten" hidden>' + H.listen + '</button><button type="button" class="btn ghost sm" id="se-hagain">' + H.watch + '</button><span class="tiny muted" id="se-hnote" hidden>' + H.noVoice + "</span></div>";
  var run = 0, say = null;
  function W(i){ return host.querySelector('[data-wi="' + i + '"]'); }
  function finish(){ run++; host.classList.remove("se-anim"); host.classList.add("se-done", "se-ladder", "se-bp"); $$(".se-hw", host).forEach(function(w){ w.classList.add("in"); }); $$(".se-gl", host).forEach(function(w){ w.classList.add("lit"); }); }
  function reset(){ run++; host.classList.remove("se-done", "se-ladder", "se-bp"); host.classList.add("se-anim"); $$(".se-hw", host).forEach(function(w){ w.classList.remove("in", "lit", "speaking"); }); }
  function animate(){
    reset(); var my = run, i = 0;
    (function next(){
      if (my !== run) return;
      if (i < words.length) { var w = W(i); if (w) { w.classList.add("in"); if (w.classList.contains("se-gl")) w.classList.add("lit"); } i++; MV.wait(170, next); return; }
      MV.wait(500, function(){ if (my !== run) return; host.classList.add("se-ladder");
        MV.wait(1100, function(){ if (my !== run) return; host.classList.add("se-bp"); MV.wait(1600, function(){ if (my === run) finish(); }); }); });
    })();
  }
  function stopSay(){ if (say) { MV.eng.stop(); say = null; } $$(".se-hw.speaking", host).forEach(function(w){ w.classList.remove("speaking"); }); var b = $("#se-hlisten"); if (b) b.textContent = H.listen; }
  $("#se-hagain").addEventListener("click", function(){ stopSay(); if (MV.reduceMotion) finish(); else animate(); });
  $("#se-hlisten").addEventListener("click", function(){
    if (say) { stopSay(); return; }
    finish(); this.textContent = "Stop";
    say = MV.eng.say(H.clauses.join(" "), { voice:VOICE, onWord:function(i){ $$(".se-hw.speaking", host).forEach(function(w){ w.classList.remove("speaking"); }); var w = W(i); if (w) w.classList.add("speaking"); }, onEnd:stopSay });
  });
  HR.stop = function(){ stopSay(); if (host.classList.contains("se-anim")) finish(); };
  if (MV.reduceMotion) finish(); else animate();
  voiceReady(function(v){ $("#se-hlisten").hidden = !v; $("#se-hnote").hidden = !!v; });
}

// ---------- @component E7 thesisForge + E6 paragraph builder + E17 outline workspace: the essay architect (one screen, six modes) ----------
var ARCH = null;
function explore(host, api){
  var C = api.content, S = api.S, L = C.lib, IDS = ["fr", "je", "gg", "my"];
  S.text = IDS.indexOf(S.text) >= 0 ? S.text : "fr";
  S.mode = C.modes.some(function(m){ return m.id === S.mode; }) ? S.mode : "forge";
  S.t = S.t || {}; S.len = S.len || { min:1500, max:2000 }; S.tc3 = Array.isArray(S.tc3) ? S.tc3 : []; S.noTrans = !!S.noTrans;
  var fx = {}, editing = null, lastEnergy = "", lastBeams = "";

  function blank(id){
    var lb = L[id];
    if (!lb) return { title:"", author:"", mclaim:"", mhow:"", mwhy:"", free:"", order:["n1", "n2", "n3"], cards:{ n1:{ kind:"beam", t:"", w:2 }, n2:{ kind:"beam", t:"", w:2 }, n3:{ kind:"beam", t:"", w:2 } },
      counterOn:true, ev:[], para:{ claim:"", ev:"", an:"", link:"" }, concl:{ moves:[], t:"" }, sd:{}, tAdd:[], tRm:[], nid:3 };
    var cards = {}; lb.cards.forEach(function(c){ cards[c.id] = { kind:c.kind, t:c.t, ts:c.ts || c.t, w:c.w }; });
    return { subj:false, claim:"", how:[], why:"", free:"", order:lb.start.slice(), cards:cards, counterOn:true, ev:lb.ev.map(function(e){ return { id:e.id, q:e.q, sur:e.sur, kind:e.kind, n:e.n, card:e.card }; }),
      para:{ claim:lb.para.claim, ev:lb.para.ev, an:lb.para.an, link:lb.para.link }, concl:{ moves:lb.concl.moves.slice(), t:lb.concl.t }, sd:{}, tAdd:[], tRm:[], nid:0 };
  }
  function T(id){ id = id || S.text; return S.t[id] || (S.t[id] = blank(id)); }
  function name(id){ var x = C.texts.filter(function(t){ return t.id === id; })[0]; return x ? x.t : id; }
  function titleOf(id){ id = id || S.text; return L[id] ? L[id].title : (T(id).title || "").trim(); }
  function authorOf(id){ id = id || S.text; return L[id] ? L[id].author : (T(id).author || "").trim(); }
  function surOf(id){ id = id || S.text; return L[id] ? L[id].sur : lastWord(T(id).author); }
  function order(id){ id = id || S.text; var t = T(id), o = fx.order && id === S.text ? fx.order : t.order; return o.filter(function(k){ return !!t.cards[k]; }); }
  function counterOn(id){ id = id || S.text; return fx.counterOn != null && id === S.text ? fx.counterOn : T(id).counterOn !== false; }
  function live(id){ id = id || S.text; var t = T(id); return order(id).filter(function(k){ return t.cards[k].kind !== "counter" || counterOn(id); }); }
  function ctext(id, k){ var c = T(id).cards[k]; return c ? (c.ts || c.t || "") : ""; }
  function evCount(id, k){ return T(id).ev.filter(function(e){ return e.card === k; }).length; }
  function cite(e){ var s = (e.sur || "").trim() || "Author"; return e.kind === "p" ? "(" + s + " " + (e.n || "#") + ")" : "(" + s + ", ch. " + (e.n || "#") + ")"; }
  function claimObj(id){ id = id || S.text; var lb = L[id]; return lb ? lb.claims.filter(function(c){ return c.id === T(id).claim; })[0] || null : null; }
  function assembled(id){
    id = id || S.text; var t = T(id), lb = L[id];
    if (!lb) {
      var ti = (t.title || "").trim(), au = (t.author || "").trim(), c = (t.mclaim || "").trim(), h = (t.mhow || "").trim(), w = (t.mwhy || "").trim();
      if (!ti && !au && !c && !h && !w) return "";
      return "In " + (ti || "[title]") + ", " + (au || "[author]") + " " + (c || "[claim]").replace(/[.\s]+$/, "") + (h ? ", " + h.replace(/[.\s]+$/, "") : "") + (w ? ", " + w.replace(/[.\s]+$/, "") : "") + ".";
    }
    var cl = claimObj(id); if (!t.subj && !cl) return "";
    if (cl && cl.full) return t.subj ? "In " + lb.title + ", " + cl.t : cl.t.charAt(0).toUpperCase() + cl.t.slice(1);
    var hs = t.how.map(function(hid){ return lb.how.filter(function(h){ return h.id === hid; })[0]; }).filter(Boolean), wy = lb.why.filter(function(y){ return y.id === t.why; })[0];
    var s = (t.subj ? "In " + lb.title + ", " + lb.author : "[subject]") + " " + (cl ? cl.t.replace(/[.\s]+$/, "") : "…");
    return s + (hs.length ? ", " + hs.map(function(h){ return h.t; }).join(" and ") : "") + (wy ? ", " + wy.t : "") + ".";
  }
  function thesis(id){ id = id || S.text; var f = fx.free != null && id === S.text ? fx.free : String(T(id).free || "").trim(); return f ? { text:f, free:true } : { text:assembled(id), free:false }; }
  function status(id){
    id = id || S.text; var th = thesis(id);
    if (th.free || !L[id]) return th.text ? ruleStatus(th.text) : "none";
    var t = T(id), cl = claimObj(id);
    if (!cl) return t.subj ? "topic" : "none";
    if (cl.kind === "fact") return "fact"; if (cl.kind === "vague") return "vague";
    if (!t.how.length) return "noHow"; if (!t.why) return "noWhy"; return "good";
  }
  function weak(st){ return st === "topic" || st === "fact" || st === "vague" || st === "devices"; }
  function terms(id){ id = id || S.text; var t = T(id); return keyTerms(thesis(id).text, { exclude:titleOf(id) + " " + authorOf(id) + " " + (L[id] ? L[id].sur : ""), add:t.tAdd, rm:t.tRm }); }
  function thesisHTML(s, id){ var e = esc(s), ti = titleOf(id); if (ti) { var k = e.indexOf(esc(ti)); if (k >= 0) e = e.slice(0, k) + "<em>" + esc(ti) + "</em>" + e.slice(k + esc(ti).length); } return e; }
  function noTrans(){ return fx.noTrans != null ? fx.noTrans : S.noTrans; }
  function stripTrans(s){
    var out = String(s || "");
    XC().transitions.slice().sort(function(a, b){ return b.length - a.length; }).forEach(function(x){ out = out.replace(new RegExp("(^|[\\s;:,])" + x.replace(/ /g, "\\s+") + "\\b,?\\s*", "gi"), "$1"); });
    out = out.replace(/\s{2,}/g, " ").replace(/^\s+/, "");
    return out.charAt(0).toUpperCase() + out.slice(1);
  }
  function markHTML(s, tm){
    var src = String(s || "");
    if (!noTrans()) XC().transitions.slice().sort(function(a, b){ return b.length - a.length; }).forEach(function(x){ src = src.replace(new RegExp("\\b" + x.replace(/ /g, "\\s+") + "\\b", "gi"), function(m){ return "\u0002" + m + "\u0003"; }); });
    var h = esc(src).replace(/[A-Za-zÀ-ÿ]+/g, function(w){ var x = lw(w)[0]; return x && x.length >= 4 && tm.some(function(t){ return stemEq(x, t); }) ? '<mark class="se-kt">' + w + "</mark>" : w; });
    return h.replace(/\u0002/g, '<u class="se-tr">').replace(/\u0003/g, "</u>");
  }
  function lineOf(id){
    var t = T(id), n = 0;
    return live(id).map(function(k){ var c = t.cards[k]; if (c.kind === "beam") n++; var sd = t.sd[k] || {}; return { k:k, n:c.kind === "counter" ? "C" : String(n), kind:c.kind, t:ctext(id, k), say:sd.say || "", does:sd.does || "" }; });
  }
  function paraStats(id){ var p = T(id).para, all = [p.claim, p.ev, p.an, p.link].join(" "), q = quoteSplit(all), an = quoteSplit([p.an, p.link].join(" ")); return { words:wc(all), inside:q.inside, outside:an.outside, ratio:q.inside ? an.outside / q.inside : null }; }
  function energy(ids){
    var t = T(), peak = 0;
    return ids.map(function(k){ var w = t.cards[k].w || 2, e = Math.max(0.3, w - 0.7 * Math.max(0, peak - w)); peak = Math.max(peak, w); return e; });
  }

  host.innerHTML = '<div class="se-arch">' +
    '<div class="se-top"><div id="se-text"></div><div id="se-mode" class="se-modes"></div></div>' +
    '<div class="se-grid"><div class="se-bpbox" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p><div id="se-bp"></div><p class="se-bpcap" id="se-bpcap" aria-live="polite"></p></div>' +
      '<div class="se-main"><div id="se-panel"></div></div>' +
      '<div class="se-readbox"><p class="se-read-h">Readout</p><dl class="read" id="se-read" aria-live="polite"></dl>' +
        '<div class="se-termadd"><label for="se-tadd" class="tiny">Add a key term</label><span class="se-taddrow"><input id="se-tadd" class="txtin" type="text" autocomplete="off" placeholder="e.g. care"><button type="button" class="btn ghost sm" id="se-taddb">Add</button></span></div>' +
        '<div class="se-len"><span class="tiny">Target length</span> <input id="se-lmin" class="txtin se-num" type="number" min="300" max="6000" step="50" aria-label="Target length: at least"> – <input id="se-lmax" class="txtin se-num" type="number" min="300" max="6000" step="50" aria-label="Target length: at most"> <span class="tiny">words</span></div>' +
        '<p class="se-aha">' + C.aha + "</p></div></div></div>";

  var textRG = radios($("#se-text"), { label:"Practice text", cls:"chips", options:C.texts, value:S.text, onChange:function(v){ fx = {}; editing = null; S.text = v; api.save(); paint(); MV.changed(); } });
  var modeRG = radios($("#se-mode"), { label:"Mode", options:C.modes, value:S.mode, onChange:function(v){ fx = {}; editing = null; S.mode = v; api.save(); paintPanel(); paintRead(); paintBP(); } });
  $("#se-lmin").value = S.len.min; $("#se-lmax").value = S.len.max;

  // ----- blueprint -----
  function bpBeams(){
    if (fx.beams) return fx.beams.map(function(t, i){ return { k:"x" + i, t:t, ev:0, kind:"beam" }; });
    var t = T(); return live().map(function(k){ return { k:k, t:ctext(S.text, k), ev:evCount(S.text, k), kind:t.cards[k].kind }; });
  }
  function paintBP(rise){
    var st = status(), B = bpBeams(), n = B.length, wk = weak(st) && n > 0, R = C.roof;
    var roof = st === "none" ? R.none : weak(st) ? R.weak : st === "noHow" ? R.noHow : st === "noWhy" ? R.noWhy : R.good;
    var key = B.map(function(b){ return b.k; }).join(",");
    var doRise = (rise || key !== lastBeams) && !MV.reduceMotion; lastBeams = key;
    var bn = 0, cols = B.map(function(b, i){
      var x = n === 1 ? 160 : 44 + i * (232 / Math.max(1, n - 1)), lab = b.kind === "counter" ? "C" : String(++bn), empty = !b.ev;
      var blocks = ""; for (var j = 0; j < Math.min(3, b.ev); j++) blocks += '<rect class="se-bpf" x="' + (x - 9) + '" y="' + (150 + j * 11) + '" width="18" height="9" rx="1.5"/>';
      if (b.ev > 3) blocks += '<text class="se-bpm" x="' + (x + 13) + '" y="175">+' + (b.ev - 3) + "</text>";
      return '<g class="se-bpcol' + (doRise ? " se-rise" : "") + '" style="--i:' + i + ";--dx:" + ((i - (n - 1) / 2) * 7) + 'px"><rect class="se-bpb' + (empty ? " empty" : "") + (b.kind === "counter" ? " counter" : "") + '" x="' + (x - 10) + '" y="70" width="20" height="76" rx="2"/>' + blocks +
        '<text class="se-bpl" x="' + x + '" y="198" text-anchor="middle">' + lab + "</text><title>" + esc((b.kind === "counter" ? "Counterargument" : "Beam " + lab) + ": " + plain(b.t) + " (" + b.ev + " quotation" + (b.ev === 1 ? "" : "s") + ")") + "</title></g>";
    }).join("");
    $("#se-bp").innerHTML = '<svg class="se-bpsvg' + (wk ? " se-weak" : "") + '" viewBox="0 0 320 204" role="img" aria-label="' + esc("Blueprint: roof reads " + roof + "; " + n + " beam" + (n === 1 ? "" : "s") + "; " + B.filter(function(b){ return !b.ev; }).length + " without a foundation") + '">' +
      '<polygon class="se-bproof' + (st === "good" ? " good" : "") + '" points="14,64 160,14 306,64"/><text class="se-bprt" x="160" y="52" text-anchor="middle">' + esc(roof) + "</text>" +
      '<g class="se-bpcols">' + (n ? cols : '<text class="se-bpl" x="160" y="112" text-anchor="middle">No beams yet</text>') + '</g><line class="se-bpg" x1="10" y1="186" x2="310" y2="186"/></svg>' +
      '<p class="se-bpkey tiny"><span class="se-k1"></span> beam with evidence <span class="se-k2"></span> beam with no foundation <span class="se-k3"></span> quotation</p>';
    $("#se-bpcap").innerHTML = wk ? '<span class="se-flag">' + C.status[st] + ": " + C.weak[st] + "</span>" : "";
  }

  // ----- readout -----
  function paintRead(){
    var st = status(), tm = terms(), id = S.text, t = T(), ln = lineOf(id), beams = ln.filter(function(x){ return x.kind === "beam"; }), ctr = ln.filter(function(x){ return x.kind === "counter"; });
    var carry = beams.filter(function(b){ return carries(b.t, tm).length > 0; }).length;
    var evs = ln.map(function(x){ return evCount(id, x.k); }), zero = ln.filter(function(x, i){ return !evs[i]; });
    var joins = Math.max(0, ln.length - 1), tr = noTrans() ? 0 : ln.slice(1).filter(function(x){ return transIn(x.t).length > 0; }).length;
    var ps = paraStats(id), per = ps.words > 0 ? ps.words : 300, proj = 150 + ln.length * per + 150, lm = S.len;
    var cls = st === "good" ? "good" : weak(st) ? "bad" : st === "none" ? "" : "mid";
    var rows = [["Thesis status", '<span class="se-st ' + cls + '">' + C.status[st] + "</span>"],
      ["Key terms", tm.length ? '<span class="se-terms">' + tm.map(function(x){ return '<span class="se-term">' + esc(x) + '<button type="button" class="se-trm" data-trm="' + esc(x) + '" data-k="trm' + esc(x) + '" aria-label="Remove key term ' + esc(x) + '">×</button></span>'; }).join("") + "</span>" : '<span class="muted">none yet</span>'],
      ["Beams", beams.length + " topic sentence" + (beams.length === 1 ? "" : "s") + " · " + ctr.length + " counterargument" + (ctr.length === 1 ? "" : "s")],
      ["Beams carrying key terms", beams.length ? carry + " / " + beams.length : "—"],
      ["Evidence per beam", ln.length ? evs.join(" · ") + (zero.length ? '<br><span class="se-flag">' + zero.map(function(x){ return (x.kind === "counter" ? "Counterargument" : "Beam " + x.n) + ": this beam has no foundation."; }).join(" ") + "</span>" : "") : "—"]];
    if (S.mode === "para") rows.push(["Analysis-to-quotation ratio", ps.ratio == null ? '<span class="muted">no quotation yet</span>' : MV.num(ps.ratio, 1) + " : 1 (by words)" + (ps.ratio < 1.5 ? '<br><span class="se-flag">Quote a little, analyse a lot.</span>' : "")]);
    rows.push(["Transitions between paragraphs", joins ? tr + " of " + joins : "—"]);
    rows.push(["Projected length", "~" + proj + " words <span class=\"tiny muted\">(" + (proj < lm.min ? "under" : proj > lm.max ? "over" : "within") + " " + lm.min + "–" + lm.max + ")</span>"]);
    var R = $("#se-read");
    MV.keepFocus(R, function(){ R.innerHTML = rows.map(function(r){ return "<dt>" + r[0] + "</dt><dd>" + r[1] + "</dd>"; }).join(""); });
  }

  // ----- panels -----
  function chip(attr, val, on, html, k){ return '<button type="button" class="chip se-chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" ' + attr + '="' + esc(val) + '" data-k="' + esc(k || (attr + val)) + '">' + html + "</button>"; }
  function forgeOut(){
    var el = $("#se-out"); if (!el) return;
    var id = S.text, th = thesis(id), st = status(id), lb = L[id], t = T(id), fit = "";
    if (lb && !th.free && st === "good") { var cl = claimObj(id), good = t.how.some(function(h){ var o = lb.how.filter(function(x){ return x.id === h; })[0]; return o && o.fits.indexOf(cl.id) >= 0; }); fit = '<p class="tiny se-fit">' + (good ? C.fitGood : C.fitOk) + "</p>"; }
    el.innerHTML = th.text ? '<p class="se-thesis"><strong>' + (th.free ? "Your thesis (your words):" : "Your thesis:") + "</strong> " + thesisHTML(th.text, id) + '</p><p class="tiny">Status: <span class="se-st ' + (st === "good" ? "good" : weak(st) ? "bad" : "mid") + '">' + C.status[st] + "</span></p>" + fit
      : '<p class="muted">Choose chips (or type) and your thesis assembles here.</p>';
  }
  function pForge(){
    var id = S.text, t = T(id), lb = L[id], h = "";
    if (lb) {
      h += '<div class="se-row"><span class="se-rl">Subject</span><div class="se-chips">' + chip("data-subj", "1", !!t.subj, "In <em>" + lb.title + "</em>, " + lb.author + "…") + "</div></div>" +
        '<div class="se-row"><span class="se-rl">Claim (what)</span><div class="se-chips">' + lb.claims.map(function(c){ return chip("data-claim", c.id, t.claim === c.id, esc(c.t)); }).join("") + "</div></div>" +
        '<div class="se-row"><span class="se-rl">How <span class="tiny muted">(one or more)</span></span><div class="se-chips">' + lb.how.map(function(c){ return chip("data-how", c.id, t.how.indexOf(c.id) >= 0, esc(c.t)); }).join("") + "</div></div>" +
        '<div class="se-row"><span class="se-rl">Why <span class="tiny muted">(one)</span></span><div class="se-chips">' + lb.why.map(function(c){ return chip("data-why", c.id, t.why === c.id, esc(c.t)); }).join("") + "</div></div>";
    } else {
      h += '<p class="tiny muted">' + C.privacy + "</p>" + [["title", "Title of your novel", "e.g. The Handmaid’s Tale"], ["author", "Author", "e.g. Margaret Atwood"], ["mclaim", "Claim (what the novel shows or makes)", "e.g. shows that … / presents … as …"], ["mhow", "How (techniques, structure, patterns)", "e.g. through … / by …"], ["mwhy", "Why (significance)", "e.g. which suggests …"]].map(function(f){
        return '<div class="jq"><label for="se-my-' + f[0] + '">' + f[1] + '</label><input id="se-my-' + f[0] + '" class="txtin" type="text" autocomplete="off" data-my="' + f[0] + '" placeholder="' + esc(f[2]) + '"></div>'; }).join("");
    }
    h += '<div class="se-out" id="se-out" aria-live="polite"></div>' +
      '<div class="jq"><label for="se-free">Rewrite it in your own words <span class="tiny muted">(optional; the readouts then read your version by keyword rules)</span></label><textarea id="se-free" rows="3"></textarea></div>' +
      '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="copy">Start from the assembled thesis</button><button type="button" class="btn ghost sm" data-act="clearfree">Clear my rewrite</button></div>';
    return h;
  }
  function pOutline(){
    var id = S.text, t = T(id), o = order(id), lb = L[id], bn = 0, hasC = o.some(function(k){ return t.cards[k].kind === "counter"; });
    var h = '<p class="how">Move cards with <strong>Move up</strong> and <strong>Move down</strong>. Edit, remove or add beams. Read the beams in a row: do they make one argument?</p><ol class="se-cards" id="se-cards">' + o.map(function(k, i){
      var c = t.cards[k], off = c.kind === "counter" && !counterOn(id), lab = c.kind === "counter" ? "C" : String(++bn), ev = evCount(id, k);
      var body = editing === k ? '<label class="vh" for="se-ed">Edit this card</label><textarea id="se-ed" class="se-edta" rows="3">' + esc(c.t) + '</textarea><div class="q-actions"><button type="button" class="btn primary sm" data-save="' + k + '" data-k="sv' + k + '">Save</button><button type="button" class="btn ghost sm" data-cancel="1" data-k="cn' + k + '">Cancel</button></div>'
        : '<p class="se-ct"><span class="se-cn" aria-hidden="true">' + lab + "</span>" + (c.t ? esc(c.t) : '<span class="muted">(empty: tap Edit to write this beam)</span>') + (c.kind === "counter" ? ' <span class="an-tag an-theme">Counterargument' + (off ? ", switched out" : "") + "</span>" : "") + ' <span class="se-evb' + (ev ? "" : " none") + '">' + ev + " quotation" + (ev === 1 ? "" : "s") + "</span></p>" +
          '<div class="se-cbtns"><button type="button" class="btn ghost sm" data-up="' + k + '" data-k="up' + k + '"' + (i ? "" : " disabled") + ' aria-label="Move card ' + lab + ' up">Move up</button><button type="button" class="btn ghost sm" data-down="' + k + '" data-k="dn' + k + '"' + (i < o.length - 1 ? "" : " disabled") + ' aria-label="Move card ' + lab + ' down">Move down</button><button type="button" class="btn ghost sm" data-edit="' + k + '" data-k="ed' + k + '">Edit</button><button type="button" class="btn ghost sm" data-del="' + k + '" data-k="dl' + k + '">Remove</button></div>';
      return '<li class="se-card' + (off ? " off" : "") + (c.kind === "counter" ? " counter" : "") + '" data-card="' + k + '">' + body + "</li>";
    }).join("") + "</ol>" +
      '<div class="q-actions se-oacts"><button type="button" class="btn ghost sm" data-act="addbeam">Add a beam</button>' + (hasC ? '<label class="se-check"><input type="checkbox" id="se-con"' + (counterOn(id) ? " checked" : "") + "> Include the counterargument</label>" : '<button type="button" class="btn ghost sm" data-act="addcounter">Add a counterargument</button>') +
      (lb ? '<button type="button" class="btn ghost sm" data-act="reset">Reset to the model cards</button>' : "") + "</div>" +
      '<p class="se-cline"><strong>Conclusion:</strong> ' + (t.concl.t ? esc(t.concl.t) : '<span class="muted">not written yet (Conclusion mode)</span>') + "</p>" +
      '<div id="se-energy" class="se-energy"></div><div id="se-skep" class="se-skep"></div>';
    return h;
  }
  function paintEnergy(force){
    var el = $("#se-energy"); if (!el) return;
    if (!L[S.text]) { el.innerHTML = ""; return; }
    var ids = live(), e = energy(ids), n = e.length; if (n < 2) { el.innerHTML = ""; return; }
    var key = ids.join(","), draw = (force || key !== lastEnergy) && !MV.reduceMotion; lastEnergy = key;
    var pts = e.map(function(v, i){ return [24 + i * (272 / (n - 1)), 82 - v * 13]; });
    var pk = e.indexOf(Math.max.apply(null, e)), early = pk < (n - 1) / 2;
    var o = order().filter(function(k){ return "abcde".indexOf(k) >= 0 && k.length === 1; }).join("");
    el.innerHTML = '<p class="se-eh"><strong>Reader energy</strong> <span class="tiny muted">(how much each paragraph adds, given what came before)</span></p>' +
      '<svg viewBox="0 0 320 96" class="se-esvg" role="img" aria-label="' + esc("Reader energy line: " + e.map(function(v){ return MV.num(v, 1); }).join(", ") + (early ? ". It peaks early." : ". It builds.")) + '"><line class="se-eax" x1="16" y1="86" x2="304" y2="86"/>' +
      '<polyline class="se-eline' + (draw ? " se-draw" : "") + '" points="' + pts.map(function(p){ return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ") + '"/>' + pts.map(function(p, i){ return '<circle class="se-edot" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3.5"/><text class="se-elab" x="' + p[0].toFixed(1) + '" y="96" text-anchor="middle">' + (i + 1) + "</text>"; }).join("") + "</svg>" +
      '<p class="tiny ' + (early ? "se-flag" : "se-okline") + '">' + (early ? "Peaks early: later paragraphs feel like an anticlimax." : "Builds: the clinching evidence comes where the argument has earned it.") + "</p>" +
      (S.text === "fr" && o === "abdce" ? '<p class="tiny se-okline">' + C.challenges[1].note + "</p>" : "");
  }
  function paintSkep(){
    var el = $("#se-skep"); if (!el) return;
    var t = T(), has = order().some(function(k){ return t.cards[k].kind === "counter"; }); if (!has) { el.innerHTML = ""; return; }
    var on = counterOn();
    el.innerHTML = '<p class="se-eh"><strong>Skeptic m&#101;ter</strong></p><div class="se-gauge"><span class="tiny">unconvinced</span><span class="se-gtrack" role="img" aria-label="' + (on ? "A skeptical reader is willing to consider the argument" : "A skeptical reader is unconvinced") + '"><span class="se-gneedle" style="left:' + (on ? 86 : 14) + '%"></span></span><span class="tiny">willing to consider</span></div>';
  }
  function pBank(){
    var id = S.text, t = T(id), opts = function(sel){ var bn = 0; return '<option value="">Not tagged</option>' + order(id).map(function(k){ var c = t.cards[k], lab = c.kind === "counter" ? "Counterargument" : "Beam " + (++bn); return '<option value="' + k + '"' + (sel === k ? " selected" : "") + ">" + esc(lab + ": " + plain(c.t).slice(0, 48) + (plain(c.t).length > 48 ? "…" : "")) + "</option>"; }).join(""); };
    return '<p class="how">Tag each quotation to the beam it supports. A beam with no quotation has no foundation, and it sags in the blueprint.</p>' + (L[id] ? "" : '<p class="tiny muted">' + C.privacy + "</p>") +
      '<ul class="se-ev">' + (t.ev.length ? t.ev.map(function(e){ return '<li><p class="se-evq">“' + esc(e.q) + '” <span class="se-cite">' + esc(cite(e)) + '</span></p><div class="se-evrow"><label>Beam <select data-evcard="' + e.id + '">' + opts(e.card) + '</select></label><button type="button" class="btn ghost sm" data-evdel="' + e.id + '" data-k="evd' + e.id + '">Remove</button></div></li>'; }).join("") : '<li class="muted">No quotations yet.</li>') + "</ul>" +
      '<fieldset class="se-evadd"><legend>Add a quotation (citation built for you, MLA 9)</legend><div class="jq"><label for="se-nq">Exact words (no quotation marks needed)</label><textarea id="se-nq" rows="2"></textarea></div>' +
      '<div class="se-evrow"><label>Author’s surname <input id="se-nsur" class="txtin se-short" type="text" autocomplete="off" value="' + esc(surOf(id)) + '"></label><label>Cite by <select id="se-nkind"><option value="ch">chapter (e-text)</option><option value="p">page (print)</option></select></label><label>Number <input id="se-nn" class="txtin se-num" type="text" inputmode="numeric" autocomplete="off"></label><label>Beam <select id="se-ncard">' + opts("") + "</select></label></div>" +
      '<p class="tiny">Citation: <span class="se-cite" id="se-ncite"></span></p><div class="q-actions"><button type="button" class="btn primary sm" data-act="addev">Add to the bank</button><span class="tiny muted" id="se-nmsg" aria-live="polite"></span></div></fieldset>';
  }
  function pPara(){
    var id = S.text, t = T(id), slots = [["claim", "Claim (topic sentence)"], ["ev", "Evidence (signal phrase + quotation + citation)"], ["an", "Analysis (zoom in on words)"], ["link", "Link (back to the thesis)"]];
    var tc = C.tc3;
    return '<p class="how">Build one body paragraph in four slots. Tap a verb to add it to your analysis.</p>' +
      slots.map(function(s){ var cl = s[0] === "ev" ? "evidence" : s[0] === "an" ? "analysis" : s[0]; return '<div class="se-slot se-pp-' + cl + '"><label for="se-ps-' + s[0] + '"><span class="se-pp se-pp-' + cl + '">' + s[1] + '</span></label><textarea id="se-ps-' + s[0] + '" rows="' + (s[0] === "an" ? 4 : 2) + '" data-ps="' + s[0] + '"></textarea></div>'; }).join("") +
      '<p class="se-vb"><span class="tiny">Analysis verbs:</span> ' + C.verbs.map(function(v){ return '<button type="button" class="chip se-chip" data-verb="' + v + '">' + v + "</button>"; }).join("") + "</p>" +
      (t.ev.length ? '<p class="se-vb"><label class="tiny" for="se-qpick">Insert a quotation from the bank into Evidence</label> <select id="se-qpick"><option value="">Choose…</option>' + t.ev.map(function(e){ return '<option value="' + e.id + '">' + esc(e.q.slice(0, 56) + (e.q.length > 56 ? "…" : "")) + "</option>"; }).join("") + "</select></p>" : "") +
      '<p class="tiny" id="se-pstat" aria-live="polite"></p>' +
      '<div class="se-tc3" id="se-tc3"><h4 class="se-h4">Choose the analysis <span class="tiny muted">(target challenge 3)</span></h4><p class="se-tcl"><span class="se-pp se-pp-claim">Claim</span> ' + tc.claim + '</p><p class="se-tcl"><span class="se-pp se-pp-evidence">Evidence</span> ' + tc.ev + '</p><p class="tiny">Tap the two analysis sentences that make this paragraph work.</p><div class="se-tchips" id="se-tchips"></div></div>';
  }
  function paintTC3(){
    var el = $("#se-tchips"); if (!el) return;
    MV.keepFocus(el, function(){ el.innerHTML = C.tc3.chips.map(function(c){ var on = S.tc3.indexOf(c.id) >= 0; return '<button type="button" class="se-ach' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-ach="' + c.id + '" data-k="ach' + c.id + '"><span class="se-pp se-pp-analysis">Analysis</span> ' + c.t + "</button>"; }).join(""); });
  }
  function paintPstat(){
    var el = $("#se-pstat"); if (!el) return;
    var ps = paraStats(S.text);
    el.innerHTML = "<strong>" + ps.words + " words</strong> · analysis-to-quotation ratio " + (ps.ratio == null ? "— (no quotation yet)" : MV.num(ps.ratio, 1) + " : 1" + (ps.ratio < 1.5 ? ' <span class="se-flag">Quote a little, analyse a lot.</span>' : ' <span class="se-okline">✓</span>'));
  }
  function pCoh(){
    return '<p class="how">The topic sentences as a chain. Key terms from the thesis are <mark class="se-kt">highlighted</mark>; transition words are <u class="se-tr">underlined</u>. Fill in the reverse outline: what each paragraph <strong>says</strong> and what it <strong>does</strong>.</p>' +
      '<label class="se-check"><input type="checkbox" id="se-notr"' + (noTrans() ? " checked" : "") + "> Remove transitions</label>" + '<ol class="se-chain" id="se-chain"></ol>';
  }
  function paintChain(){
    var el = $("#se-chain"); if (!el) return;
    var id = S.text, t = T(id), tm = terms(id), ln = lineOf(id);
    MV.keepFocus(el, function(){
      el.innerHTML = ln.length ? ln.map(function(x, i){
        var txt = noTrans() ? stripTrans(x.t) : x.t, joined = i > 0 && !noTrans() && transIn(x.t).length > 0;
        return (i ? '<li class="se-arrow' + (joined ? "" : " broken") + '" aria-hidden="true"><span>' + (joined ? "↓" : "↓ ?") + "</span></li>" : "") +
          '<li class="se-link"><p class="se-lt"><span class="se-cn" aria-hidden="true">' + x.n + "</span>" + (txt ? markHTML(txt, tm) : '<span class="muted">(empty beam)</span>') + "</p>" +
          '<div class="se-sd"><label>Says <input class="txtin" type="text" autocomplete="off" data-say="' + x.k + '" data-k="say' + x.k + '" value="' + esc(x.say) + '" placeholder="its claim, in a few words"></label>' +
          '<label>Does <select data-does="' + x.k + '" data-k="do' + x.k + '"><option value="">Choose…</option>' + C.jobs.map(function(j){ return '<option value="' + j.id + '"' + (x.does === j.id ? " selected" : "") + ">" + j.t + "</option>"; }).join("") + "</select></label></div>" +
          (x.does === "describe" ? '<p class="tiny se-flag">' + C.describeFlag + "</p>" : "") + "</li>";
      }).join("") : '<li class="muted">No beams yet. Build them in Outline mode.</li>';
    });
  }
  function pConcl(){
    var t = T();
    return '<p class="how">Pick the moves your conclusion makes, then write it. A conclusion answers “so what?”: it extends the argument instead of repeating it.</p>' +
      '<div class="se-chips" role="group" aria-label="Conclusion moves">' + C.moves.map(function(m){ var on = t.concl.moves.indexOf(m.id) >= 0; return chip("data-move", m.id, on, m.t); }).join("") + "</div>" +
      '<div class="jq"><label for="se-ctext">Your conclusion</label><textarea id="se-ctext" rows="5"></textarea></div><p class="tiny" id="se-cflag" aria-live="polite"></p>';
  }
  function paintCflag(){
    var el = $("#se-cflag"); if (!el) return; var t = T(), s = String(t.concl.t || "").trim();
    el.innerHTML = !s ? "" : /^(in conclusion|to sum up|in summary|to conclude|overall)\b/i.test(s) ? '<span class="se-flag">' + C.restate + "</span>" : !t.concl.moves.length ? '<span class="se-flag">Pick the move (or moves) your conclusion makes.</span>' : '<span class="se-okline">' + wc(s) + " words · moves: " + C.moves.filter(function(m){ return t.concl.moves.indexOf(m.id) >= 0; }).map(function(m){ return m.t.toLowerCase(); }).join(", ") + "</span>";
  }
  function paintPanel(){
    var P = $("#se-panel"), id = S.text, t = T(id), m = S.mode;
    P.innerHTML = m === "forge" ? pForge() : m === "outline" ? pOutline() : m === "bank" ? pBank() : m === "para" ? pPara() : m === "coh" ? pCoh() : pConcl();
    if (m === "forge") {
      var f = $("#se-free"); if (f) f.value = fx.free != null ? fx.free : t.free || "";
      $$("[data-my]", P).forEach(function(inp){ inp.value = t[inp.dataset.my] || ""; });
      forgeOut();
    } else if (m === "outline") { paintEnergy(); paintSkep(); var ed = $("#se-ed"); if (ed) ed.focus(); }
    else if (m === "bank") paintCite();
    else if (m === "para") { $$("[data-ps]", P).forEach(function(ta){ ta.value = t.para[ta.dataset.ps] || ""; }); paintPstat(); paintTC3(); }
    else if (m === "coh") paintChain();
    else { $("#se-ctext").value = t.concl.t || ""; paintCflag(); }
  }
  function paintCite(){ var el = $("#se-ncite"); if (!el) return; el.textContent = cite({ sur:$("#se-nsur").value, kind:$("#se-nkind").value, n:$("#se-nn").value.trim() }); }
  function paint(){ textRG.set(S.text); modeRG.set(S.mode); paintPanel(); paintBP(); paintRead(); }
  function changed(full){ api.save(); if (full) paintPanel(); paintBP(); paintRead(); MV.changed(); }

  // ----- events -----
  host.addEventListener("click", function(){ if (Object.keys(fx).length) { fx = {}; } }, true);
  host.addEventListener("input", function(){ if (Object.keys(fx).length) { fx = {}; } }, true);
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.closest("[data-rg]")) return;
    var id = S.text, t = T(id), lb = L[id], d = b.dataset;
    if (d.trm) { var x = d.trm; t.tAdd = t.tAdd.filter(function(a){ return a !== x; }); if (t.tRm.indexOf(x) < 0) t.tRm.push(x); changed(); if (S.mode === "coh") paintChain(); return; }
    if (b.id === "se-taddb") { addTerm(); return; }
    if (d.subj) { t.subj = !t.subj; changed(true); return; }
    if (d.claim) { t.claim = t.claim === d.claim ? "" : d.claim; changed(true); return; }
    if (d.how) { var i = t.how.indexOf(d.how); if (i >= 0) t.how.splice(i, 1); else t.how.push(d.how); changed(true); return; }
    if (d.why) { t.why = t.why === d.why ? "" : d.why; changed(true); return; }
    if (d.act === "copy") { t.free = assembled(id); changed(true); return; }
    if (d.act === "clearfree") { t.free = ""; changed(true); return; }
    if (d.up || d.down) { var k = d.up || d.down, o = t.order, j = o.indexOf(k), to = j + (d.up ? -1 : 1); if (j < 0 || to < 0 || to >= o.length) return; o.splice(j, 1); o.splice(to, 0, k); changed(true); var nb = $('[data-k="' + (d.up ? "up" : "dn") + k + '"]', host); if (nb && !nb.disabled) nb.focus(); else { var ob = $('[data-k="' + (d.up ? "dn" : "up") + k + '"]', host); if (ob) ob.focus(); } return; }
    if (d.edit) { editing = d.edit; paintPanel(); return; }
    if (d.cancel) { editing = null; paintPanel(); return; }
    if (d.save) { var v = ($("#se-ed").value || "").trim(), c = t.cards[d.save]; if (c) { c.t = v; c.ts = v; } editing = null; changed(true); return; }
    if (d.del) { t.order = t.order.filter(function(x){ return x !== d.del; }); delete t.cards[d.del]; t.ev.forEach(function(e){ if (e.card === d.del) e.card = ""; }); delete t.sd[d.del]; changed(true); return; }
    if (d.act === "addbeam") { var nk = "n" + (++t.nid); while (t.cards[nk]) nk = "n" + (++t.nid); t.cards[nk] = { kind:"beam", t:"", w:2 }; t.order.push(nk); editing = nk; changed(true); return; }
    if (d.act === "addcounter") { var ck = "n" + (++t.nid); while (t.cards[ck]) ck = "n" + (++t.nid); t.cards[ck] = { kind:"counter", t:"Some readers argue that …; yet …", w:3 }; t.order.push(ck); t.counterOn = true; editing = ck; changed(true); return; }
    if (d.act === "reset" && lb) { var bl = blank(id); t.order = bl.order; t.cards = bl.cards; t.counterOn = true; t.ev.forEach(function(e){ if (e.card && !t.cards[e.card]) e.card = ""; }); t.sd = {}; editing = null; changed(true); return; }
    if (d.evdel) { t.ev = t.ev.filter(function(e){ return e.id !== d.evdel; }); changed(true); return; }
    if (d.act === "addev") {
      var q = ($("#se-nq").value || "").trim().replace(/^["“]+|["”]+$/g, ""), n = ($("#se-nn").value || "").trim();
      if (!q) { $("#se-nmsg").textContent = "Type the exact words first."; return; }
      if (!/^\d+(?:[–-]\d+)?$/.test(n)) { $("#se-nmsg").textContent = "Add the chapter or page number."; return; }
      t.ev.push({ id:"u" + Date.now().toString(36), q:q, sur:($("#se-nsur").value || "").trim(), kind:$("#se-nkind").value, n:n, card:$("#se-ncard").value });
      changed(true); var nm = $("#se-nmsg"); if (nm) nm.textContent = "Added."; return;
    }
    if (d.verb) { var ta = $("#se-ps-an"); t.para.an = (t.para.an || "").replace(/\s*$/, "") + ((t.para.an || "").trim() ? " " : "") + d.verb + " "; if (ta) { ta.value = t.para.an; ta.focus(); } changed(); paintPstat(); return; }
    if (d.ach) { var a = S.tc3.indexOf(d.ach); if (a >= 0) S.tc3.splice(a, 1); else S.tc3.push(d.ach); api.save(); paintTC3(); MV.changed(); return; }
    if (d.move) { var mi = t.concl.moves.indexOf(d.move); if (mi >= 0) t.concl.moves.splice(mi, 1); else t.concl.moves.push(d.move); api.save(); var g = b.parentNode; MV.keepFocus(g, function(){ g.innerHTML = C.moves.map(function(m){ return chip("data-move", m.id, t.concl.moves.indexOf(m.id) >= 0, m.t); }).join(""); }); paintCflag(); return; }
  });
  host.addEventListener("input", function(e){
    var el = e.target, id = S.text, t = T(id), d = el.dataset;
    if (el.id === "se-free") { t.free = el.value; api.save(); forgeOut(); paintBP(); paintRead(); MV.changed(); return; }
    if (d.my) { t[d.my] = el.value; api.save(); forgeOut(); paintBP(); paintRead(); MV.changed(); return; }
    if (d.ps) { t.para[d.ps] = el.value; api.save(); paintPstat(); paintRead(); return; }
    if (d.say) { (t.sd[d.say] = t.sd[d.say] || {}).say = el.value; api.save(); return; }
    if (el.id === "se-ctext") { t.concl.t = el.value; api.save(); paintCflag(); return; }
    if (el.id === "se-nsur" || el.id === "se-nn") { paintCite(); return; }
    if (el.id === "se-lmin" || el.id === "se-lmax") { var v = parseInt(el.value, 10); if (v >= 300 && v <= 6000) { S.len[el.id === "se-lmin" ? "min" : "max"] = v; api.save(); paintRead(); } return; }
  });
  host.addEventListener("change", function(e){
    var el = e.target, id = S.text, t = T(id), d = el.dataset;
    if (d.evcard) { var ev = t.ev.filter(function(x){ return x.id === d.evcard; })[0]; if (ev) ev.card = el.value; changed(); return; }
    if (d.does) { (t.sd[d.does] = t.sd[d.does] || {}).does = el.value; api.save(); paintChain(); return; }
    if (el.id === "se-con") { t.counterOn = el.checked; changed(); paintEnergy(); paintSkep(); var li = $('#se-cards li.counter'); if (li) li.classList.toggle("off", !el.checked); return; }
    if (el.id === "se-notr") { S.noTrans = el.checked; api.save(); paintChain(); paintRead(); return; }
    if (el.id === "se-nkind") { paintCite(); return; }
    if (el.id === "se-qpick" && el.value) { var q = t.ev.filter(function(x){ return x.id === el.value; })[0]; if (q) { t.para.ev = (t.para.ev || "").replace(/\s*$/, "") + ((t.para.ev || "").trim() ? " " : "") + "“" + q.q + "” " + cite(q) + "."; var ta = $("#se-ps-ev"); if (ta) ta.value = t.para.ev; } el.value = ""; api.save(); paintPstat(); paintRead(); return; }
  });
  function addTerm(){ var inp = $("#se-tadd"), v = String(inp.value || "").toLowerCase().trim().replace(/[^a-zà-ÿ’' -]/g, ""); if (!v) return; var t = T(); t.tRm = t.tRm.filter(function(x){ return x !== v; }); if (t.tAdd.indexOf(v) < 0) t.tAdd.push(v); inp.value = ""; changed(); if (S.mode === "coh") paintChain(); }
  $("#se-tadd").addEventListener("keydown", function(e){ if (e.key === "Enter") { e.preventDefault(); addTerm(); } });

  // "Set it up" buttons in the challenge prompts
  document.addEventListener("click", function(e){
    var b = e.target.closest("[data-setup]"); if (!b) return;
    fx = {}; editing = null; S.text = "fr"; S.mode = b.dataset.setup === "tc1" ? "forge" : b.dataset.setup === "tc2" ? "outline" : "para"; api.save(); paint();
    $("#ex-app").scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
    var f = b.dataset.setup === "tc1" ? $("[data-subj]", host) : b.dataset.setup === "tc2" ? $("[data-up]:not([disabled])", host) : $("[data-ach]", host);
    if (f) f.focus({ preventScroll:true });
  });

  // ---------- target challenges ----------
  function tc1(){
    var m = C.challenges[0].msgs, t = T("fr"), cl = claimObj("fr");
    if (!t.subj) return { ok:false, msg:m.subj };
    if (!cl) return { ok:false, msg:m.claim };
    if (cl.kind === "fact") return { ok:false, msg:m.fact };
    if (cl.kind === "vague") return { ok:false, msg:m.vague };
    if (!t.how.length) return { ok:false, msg:m.noHow };
    if (!t.why) return { ok:false, msg:m.noWhy };
    return { ok:true };
  }
  function tc2(){
    var c = C.challenges[1], m = c.msgs, t = T("fr"), o = t.order.filter(function(k){ return ["a", "b", "c", "d", "e"].indexOf(k) >= 0; });
    if (o.length < 5) return { ok:false, msg:m.cards };
    if (o[0] === "d") return { ok:false, msg:m.dfirst };
    if (o[0] === "c") return { ok:false, msg:m.cfirst };
    if (o.indexOf("e") < o.indexOf("b")) return { ok:false, msg:m.ebeforeb };
    return MV.ans(c).some(function(a){ return a.join("") === o.join(""); }) ? { ok:true } : { ok:false };
  }
  function tc3(){
    var c = C.challenges[2], m = c.msgs, s = S.tc3, A = MV.ans(c);
    if (!s.length) return { ok:false, msg:m.none };
    var bad = ["a2", "a3", "a5", "a6"].filter(function(x){ return s.indexOf(x) >= 0; })[0];
    if (bad) return { ok:false, msg:m[bad] };
    if (s.length !== 2) return { ok:false, msg:m.two };
    return A.every(function(x){ return s.indexOf(x) >= 0; }) ? { ok:true } : { ok:false };
  }

  extras();
  ARCH = { T:T, S:S, lineOf:lineOf, name:name, thesis:function(id){ return thesis(id).text; }, titleOf:titleOf, authorOf:authorOf, terms:terms,
    open:function(id, mode){ fx = {}; editing = null; S.text = id; S.mode = mode || "outline"; api.save(); paint(); $("#ex-app").scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" }); } };
  paint();
  return {
    predict:{
      start:function(p){
        fx = {}; editing = null; S.text = p.id === "p1" ? "je" : "fr";
        if (p.id === "p1") { S.mode = "forge"; fx.free = "In Jane Eyre, Brontë uses imagery, symbolism and dialogue."; }
        else if (p.id === "p2") { S.mode = "outline"; fx.order = L.fr.model.slice(); fx.counterOn = true; }
        else if (p.id === "p3") { S.mode = "coh"; fx.order = L.fr.model.slice(); fx.counterOn = true; fx.noTrans = false; }
        else if (p.id === "p4") { S.mode = "outline"; fx.order = L.fr.model.slice(); fx.counterOn = false; }
        if (p.id === "p1") fx.beams = [];
        api.save(); paint();
      },
      run:function(p, done){
        var ended = false; function fin(){ if (!ended) { ended = true; done(); } }
        MV.wait(300, function(){
          if (p.id === "p1") { fx.beams = ["Brontë uses imagery…", "Brontë uses symbolism…", "Brontë uses dialogue…"]; paintBP(true); paintRead(); MV.wait(1700, fin); return; }
          if (p.id === "p2") { fx.order = ["c", "a", "b", "d", "e"]; paintPanel(); paintBP(true); paintRead(); var cs = $("#se-cards"); if (cs && !MV.reduceMotion) cs.classList.add("se-slide"); MV.wait(1700, fin); return; }
          if (p.id === "p3") { fx.noTrans = true; paintPanel(); paintRead(); MV.wait(1500, fin); return; }
          if (p.id === "p4") { fx.counterOn = true; paintPanel(); paintBP(true); paintRead(); var nd = $(".se-gneedle", host); if (nd && !MV.reduceMotion) { nd.style.left = "14%"; nd.getBoundingClientRect(); nd.style.left = "86%"; } MV.wait(1500, fin); return; }
          fin();
        });
      }
    },
    challenge:function(id){ return id === "tc1" ? tc1() : id === "tc2" ? tc2() : id === "tc3" ? tc3() : { ok:false }; }
  };
}

// ---------- Part 3: The argument line (reverse-outline stations on the model essay) ----------
var P3 = { stop:function(){} };
function part3(host, api){
  var C = MV.C.part3, S = api.S, E = C.essay, S1 = C.s1, S2 = C.s2, S3 = C.s3;
  S.s1 = S.s1 || {}; S.s2 = S.s2 || {}; S.s3 = S.s3 || {}; S.pane = +S.pane || 0;
  var shown = 0, reading = false;
  var D = E.paras.slice(0, 3).concat([{ id:"drift", label:"", t:E.drift }]).concat(E.paras.slice(3));
  host.innerHTML = '<div class="se-p3"><h3 class="se-h3">' + E.title + '</h3><p class="tiny muted">' + E.note + "</p>" +
    '<div id="se-pchips"></div><div class="se-pane" id="se-pane" aria-live="polite"></div>' +
    '<details class="alg se-whole"><summary>Read the whole essay</summary>' + E.paras.map(function(p){ return "<p>" + p.t + "</p>"; }).join("") + "</details>" +
    '<h3 class="se-h3">' + S1.title + '</h3><p class="how">' + S1.intro + '</p><div id="se-s1"></div>' +
    '<h3 class="se-h3">' + S2.title + '</h3><p class="how">' + S2.intro + '</p><details class="alg"><summary>Read the draft with the extra paragraph</summary>' + D.map(function(p){ return "<p>" + p.t + "</p>"; }).join("") + '</details><div id="se-s2"></div>' +
    '<h3 class="se-h3">' + S3.title + '</h3><p class="how">' + S3.intro + '</p><div id="se-s3"></div><div id="se-own"></div></div>';

  var paneRG = radios($("#se-pchips"), { label:"Paragraph", cls:"chips", options:E.paras.map(function(p, i){ return { id:String(i), t:(i + 1) + (p.label.indexOf("Paragraph") === 0 ? "" : " · " + p.label.replace(/ \(.*\)$/, "")) }; }), value:String(S.pane), onChange:function(v){ S.pane = +v; api.save(); paintPane(); } });
  function paintPane(){
    var p = E.paras[S.pane];
    $("#se-pane").innerHTML = '<p class="se-plabel">' + (S.pane + 1) + ". " + p.label + "</p><p>" + p.t + '</p><div class="q-actions"><button type="button" class="btn ghost sm" data-pane="-1"' + (S.pane ? "" : " disabled") + '>Previous paragraph</button><button type="button" class="btn ghost sm" data-pane="1"' + (S.pane < E.paras.length - 1 ? "" : " disabled") + ">Next paragraph</button></div>";
  }
  function firstOf(p, i){ var s = sentences(plain(p.t)); return p.id === "drift" ? plain(p.t) : i === 0 ? s[s.length - 1] : p.ts ? plain(p.ts) : s[0]; }

  function paintS1(){
    var el = $("#se-s1");
    MV.keepFocus(el, function(){
      el.innerHTML = S1.items.map(function(it, k){
        var st = S.s1[it.id] || {}, done = !!st.ok, ix = MV.shuffle([0, 1, 2, 3], 19 + k), pi = E.paras.map(function(p){ return p.id; }).indexOf(it.id);
        return '<div class="q se-s1q" data-s1="' + it.id + '"><p class="se-ts"><span class="qn" aria-hidden="true">' + (pi + 1) + "</span> " + E.paras[pi].ts + "</p>" +
          '<div class="se-dlab">Says</div><div class="opts se-says" role="radiogroup" aria-label="What paragraph ' + (pi + 1) + ' says">' + ix.map(function(i){ var on = st.say === i; return '<button type="button" role="radio" class="opt' + (on ? " picked" : "") + '" aria-checked="' + on + '" data-say1="' + i + '" data-k="' + it.id + "s" + i + '"' + (done ? " disabled" : "") + "><span>" + it.says[i].t + "</span></button>"; }).join("") + "</div>" +
          '<div class="se-dlab">Does</div><div class="chips se-does" role="radiogroup" aria-label="What paragraph ' + (pi + 1) + ' does">' + S1.jobs.map(function(j){ var on = st.does === j.id; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-do1="' + j.id + '" data-k="' + it.id + "d" + j.id + '"' + (done ? " disabled" : "") + ">" + j.t + "</button>"; }).join("") + "</div>" +
          (done ? "" : '<div class="q-actions"><button type="button" class="btn primary sm" data-s1chk="1" data-k="' + it.id + 'chk">Check</button></div>') + (st.msg ? MV.fbHTML(st.ok ? "good" : "bad", st.msg) : "") + "</div>";
      }).join("");
    });
  }
  function paintS2(){
    var el = $("#se-s2"), st = S.s2;
    MV.keepFocus(el, function(){
      var h = '<ol class="se-dlist">' + D.map(function(p, i){
        var on = st.found && p.id === "drift";
        return '<li><button type="button" class="sbtn' + (on ? " err" : "") + '" data-dp="' + p.id + '" data-k="dp' + i + '"' + (st.found ? " disabled" : "") + '><span class="sn">Paragraph ' + (i + 1) + "</span><span>" + esc(firstOf(p, i)) + (p.id === "drift" ? "" : " …") + (on ? '<span class="flag">Drift</span>' : "") + "</span></button></li>";
      }).join("") + "</ol>";
      if (!st.found) { if (st.last) h += MV.fbHTML("bad", S2.wrongFb); }
      else {
        h += MV.fbHTML("good", S2.okFb + " Now choose a repair.") + '<div class="opts">' + S2.repairs.map(function(r){ var c = "opt" + (st.pick === r.id ? (MV.ok(r) ? " right" : " wrong") : ""); return '<button type="button" class="' + c + '" data-rp="' + r.id + '" data-k="rp' + r.id + '"' + (st.ok ? " disabled" : "") + "><span>" + r.t + "</span></button>"; }).join("") + "</div>";
        if (st.pick) { var r = S2.repairs.filter(function(x){ return x.id === st.pick; })[0], good = MV.ok(r); h += MV.fbHTML(good ? "good" : "bad", (good ? "<strong>✓ Accepted.</strong> " : "<strong>✗ Not that repair.</strong> ") + r.fb + (r.model ? '<br><span class="se-model">“' + r.model + "”</span>" : "")); }
      }
      el.innerHTML = h;
    });
  }
  function beams3(){ return E.paras.slice(1, 5).map(function(p){ return plain(p.ts); }); }
  function paintS3(){
    var el = $("#se-s3"), B = beams3(), st = S.s3;
    var all = VOICE ? B.length : Math.max(shown, st.heard ? B.length : 0);
    el.innerHTML = '<div class="q-actions"><button type="button" class="btn ghost sm" id="se-s3listen"' + (VOICE ? "" : " hidden") + ">" + (reading ? S3.stop : S3.listen) + '</button><button type="button" class="btn ghost sm" id="se-s3next"' + (VOICE ? " hidden" : "") + ">" + (all >= B.length ? S3.again : S3.next) + "</button></div>" + (VOICE ? "" : '<p class="tiny muted">' + S3.noVoice + "</p>") +
      '<ol class="se-beams">' + B.map(function(b, i){ return '<li class="' + (i < all ? "" : "se-hid") + '" data-b3="' + i + '"' + (i < all ? "" : " hidden") + ">" + esc(b) + "</li>"; }).join("") + "</ol>" +
      '<div id="se-r3"></div>';
    paintRate("se-r3", "rate", S3.rate, S3.fb, "Does this sound like one argument?");
  }
  function paintRate(hid, key, opts, fb, label){
    var box = $("#" + hid); if (!box) return;
    radios(box, { label:label, cls:"chips", options:opts, value:S.s3[key] || "", onChange:function(v){ S.s3[key] = v; api.save(); var f = box.querySelector(".se-rfb"); if (f) f.innerHTML = MV.fbHTML(v === "yes" ? "good" : "bad", fb[v]); } });
    var f = document.createElement("div"); f.className = "se-rfb"; f.setAttribute("aria-live", "polite"); if (S.s3[key]) f.innerHTML = MV.fbHTML(S.s3[key] === "yes" ? "good" : "bad", fb[S.s3[key]]); box.appendChild(f);
  }
  function paintOwn(){
    var el = $("#se-own"); if (!el) return;
    if (!ARCH) { el.innerHTML = ""; return; }
    var src = S.s3.src || (ARCH.lineOf("my").some(function(x){ return x.t.trim(); }) ? "my" : ARCH.S.text), ln = ARCH.lineOf(src).filter(function(x){ return x.t.trim(); }), J = {};
    MV.C.explore.jobs.forEach(function(j){ J[j.id] = j.t; });
    el.innerHTML = '<h4 class="se-h4">' + S3.ownTitle + '</h4><p class="how">' + S3.ownIntro + '</p><div id="se-osrc"></div>' +
      (ln.length ? '<div class="tbl-wrap"><table class="topic-tbl se-otbl"><caption class="vh">Your reverse outline</caption><thead><tr><th scope="col">#</th><th scope="col">Topic sentence</th><th scope="col">Says</th><th scope="col">Does</th></tr></thead><tbody>' +
        ln.map(function(x){ return '<tr><td>' + x.n + "</td><td>" + esc(x.t) + "</td><td>" + (x.say ? esc(x.say) : '<span class="muted">—</span>') + "</td><td>" + (x.does ? J[x.does] : '<span class="muted">—</span>') + "</td></tr>"; }).join("") + "</tbody></table></div>" + '<div id="se-r3own"></div>'
        : '<p class="muted">' + S3.empty + "</p>") +
      '<div class="q-actions"><button type="button" class="btn ghost sm" id="se-oopen">' + S3.open + "</button></div>";
    radios($("#se-osrc"), { label:"Outline from", cls:"chips", options:MV.C.explore.texts, value:src, onChange:function(v){ S.s3.src = v; api.save(); paintOwn(); } });
    if (ln.length) paintRate("se-r3own", "own", S3.rate, S3.ownFb, S3.ownRate);
    $("#se-oopen").addEventListener("click", function(){ ARCH.open(src, "coh"); });
  }
  function stopRead(){ if (reading) { MV.eng.stop(); reading = false; } $$(".se-beams li.speaking", host).forEach(function(l){ l.classList.remove("speaking"); }); var b = $("#se-s3listen"); if (b) b.textContent = S3.listen; }
  P3.stop = stopRead;
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return; var d = b.dataset;
    if (d.pane) { S.pane = Math.max(0, Math.min(E.paras.length - 1, S.pane + +d.pane)); api.save(); paneRG.set(String(S.pane)); paintPane(); var nb = $('[data-pane="' + d.pane + '"]'); if (nb && !nb.disabled) nb.focus(); return; }
    var q = b.closest("[data-s1]");
    if (q) {
      var it = S1.items.filter(function(x){ return x.id === q.dataset.s1; })[0], st = S.s1[it.id] || (S.s1[it.id] = { tries:0 });
      if (d.say1 != null) { st.say = +d.say1; st.msg = ""; }
      else if (d.do1) { st.does = d.do1; st.msg = ""; }
      else if (d.s1chk) {
        var sOk = st.say != null && MV.ok(it.says[st.say]), dOk = st.does === MV.ans(it);
        if (st.say == null || !st.does) st.msg = "Choose a “says” and a “does” first.";
        else if (sOk && dOk) { st.ok = true; st.msg = "<strong>✓ Right.</strong> " + it.fb; }
        else { st.tries++; st.msg = "<strong>✗ Not quite.</strong> " + (!sOk ? it.sayFb + " " : "") + (!dOk ? S1.wrongDo : ""); }
      }
      api.save(); paintS1(); if (d.s1chk) MV.focusFb($('[data-s1="' + it.id + '"]', host)); return;
    }
    if (d.dp) { var s2 = S.s2; if (d.dp === "drift") { s2.found = true; s2.last = ""; } else { s2.last = d.dp; s2.tries = (s2.tries || 0) + 1; } api.save(); paintS2(); MV.focusFb($("#se-s2")); return; }
    if (d.rp) { var r = S2.repairs.filter(function(x){ return x.id === d.rp; })[0]; S.s2.pick = d.rp; if (MV.ok(r)) S.s2.ok = true; api.save(); paintS2(); MV.focusFb($("#se-s2")); return; }
    if (b.id === "se-s3next") { var B = beams3(); if (shown >= B.length) { shown = 1; S.s3.heard = false; } else { shown++; if (shown >= B.length) S.s3.heard = true; } api.save(); paintS3(); var nx = $("#se-s3next"); if (nx) nx.focus(); return; }
    if (b.id === "se-s3listen") {
      if (reading) { stopRead(); return; }
      var L3 = beams3(), i = 0; reading = true; b.textContent = S3.stop;
      (function next(){
        if (!reading) return;
        $$(".se-beams li", host).forEach(function(l, k){ l.classList.toggle("speaking", k === i); });
        if (i >= L3.length) { S.s3.heard = true; api.save(); stopRead(); return; }
        MV.eng.say(L3[i], { voice:VOICE, onEnd:function(){ i++; MV.wait(350, next); } });
      })();
    }
  });
  paintPane(); paintS1(); paintS2(); paintS3(); paintOwn();
  voiceReady(function(){ paintS3(); });
  P3.refreshOwn = paintOwn;

  // Sentence to steal: live structure checks and "Save to my commonplace book"
  var steal = $('.mv-block[data-block="steal"]'), ST = C.steal;
  if (steal) {
    var row = document.createElement("div");
    row.innerHTML = '<ul class="checks se-stchk" id="se-stchk" aria-live="polite"></ul><div class="q-actions"><button type="button" class="btn ghost sm" id="steal-save">' + ST.save + '</button><span class="tiny muted" id="steal-st" aria-live="polite"></span></div>';
    steal.appendChild(row);
    var ta = $('textarea[data-w="steal"]', steal);
    var stealChecks = function(t){ t = String(t || "").trim(); return [sentences(t).length === 1, /^["“]?(it is|it has (long )?been|every|everyone|everybody|most readers|readers have long|all readers|nobody|no one)\b/i.test(t), wc(t) >= 12]; };
    var paintSt = function(){ var r = stealChecks(ta ? ta.value : MV.S.writes.steal); $("#se-stchk").innerHTML = ST.checks.map(function(c, i){ return '<li class="' + (r[i] ? "yes" : "no") + '"><span class="mk" aria-hidden="true">' + (r[i] ? "✓" : "○") + "</span><span>" + c + '<span class="vh">' + (r[i] ? " (met)" : " (not met)") + "</span></span></li>"; }).join(""); };
    if (ta) ta.addEventListener("input", paintSt);
    setTimeout(paintSt, 0);
    row.addEventListener("click", function(e){
      if (e.target.id !== "steal-save") return;
      var t = (MV.S.writes.steal || (ta && ta.value) || "").trim();
      if (!t) { $("#steal-st").textContent = "Write your sentence first."; return; }
      MV.eng.saveLine(ST.master, "The master’s sentence: " + ST.source); MV.eng.saveLine(t, "My imitation of " + ST.source);
      $("#steal-st").textContent = "Saved the master’s sentence and yours to your commonplace book.";
    });
  }
}

// ---------- Practice 3: @component K13 spotProse — Spot the Error for a paragraph (copied from ENG4U 06; numbered sentences) ----------
// a: {id, student, summary, problems:[{id, goal, task, steps:[sentences], answer: index of first flawed sentence, stepFb:[…], fixes:[{t, ok, why}], hints:[3]}]}
function spotProse(host, api, a){
  var B = api.S; B.p = B.p || {};
  function sst(id){ return B.p[id] || (B.p[id] = { stepTries:0, found:false, fixTries:0, fixed:false, hint:0 }); }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = a.problems.map(function(p, pi){
        var st = sst(p.id), err = MV.ans(p), h = '<div class="q' + (pi ? " part" : "") + '" data-sp="' + p.id + '" style="' + (pi < a.problems.length - 1 ? "" : "border-bottom:0") + '">';
        h += '<p class="task">Paragraph ' + (pi + 1) + ": " + p.task + '</p><p class="who">' + a.student + "’s paragraph</p><ol class=\"steps-list\">";
        p.steps.forEach(function(s, si){
          h += '<li><button type="button" class="sbtn' + (st.found && si === err ? " err" : "") + '" data-k="' + p.id + "s" + si + '" data-step="' + si + '"' + (st.found ? " disabled" : "") + '><span class="sn">Sentence ' + (si + 1) + "</span><span>" + s + (st.found && si === err ? '<span class="flag">First flaw</span>' : "") + "</span></button></li>";
        });
        h += "</ol>";
        if (!st.found) {
          h += '<div class="q-actions">' + MV.hintBtn(p.id + "hint", st.hint) + "</div>" + MV.hintsHTML(p.hints, st.hint);
          if (st.lastStep != null && st.lastStep !== err) h += '<div class="fb bad" role="status"><p>' + ((p.stepFb && p.stepFb[st.lastStep]) || ("Sentence " + (st.lastStep + 1) + " is fine. Keep checking.")) + "</p></div>";
        } else {
          h += '<div class="fb good" role="status"><p><strong>✓ You found it: sentence ' + (err + 1) + ".</strong> Now choose the best fix.</p></div>";
          var ri = MV.right(p.fixes);
          h += '<div class="opts" style="margin-top:12px">' + p.fixes.map(function(f, fi){
            var c = "opt"; if (st.fixed && fi === ri) c += " right"; else if (st.lastFix === fi && fi !== ri) c += " wrong";
            return '<button type="button" class="' + c + '" data-k="' + p.id + "f" + fi + '" data-fix="' + fi + '"' + (st.fixed ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + String.fromCharCode(65 + fi) + "</span><span>" + f.t + "</span></button>";
          }).join("") + "</div>";
          if (st.lastFix != null) { var f = p.fixes[st.lastFix], good = st.lastFix === ri; h += '<div class="fb ' + (good ? "good" : "bad") + '" role="status"><p><strong>' + (good ? "✓ That’s the fix." : "✗ Not quite. Try another fix.") + "</strong> " + (f.why || "") + "</p></div>"; }
        }
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-sp]"); if (!box) return;
    var p = a.problems.filter(function(x){ return x.id === box.dataset.sp; })[0], st = sst(p.id), err = MV.ans(p);
    if (b.dataset.act === "hint") st.hint = Math.min(3, st.hint + 1);
    else if (b.dataset.step != null) { var si = +b.dataset.step; st.lastStep = si; if (si === err) st.found = true; else st.stepTries++; }
    else if (b.dataset.fix != null) { var fi = +b.dataset.fix; st.lastFix = fi; st.fixTries++; if (fi === MV.right(p.fixes)) st.fixed = true; }
    MV.save(); paint();
    if (b.dataset.step != null || b.dataset.fix != null) MV.focusFb($('[data-sp="' + p.id + '"]', host));
  });
  paint();
  return {
    stats:function(){
      var solved = a.problems.filter(function(p){ var s = sst(p.id); return s.found && s.fixed; }).length;
      var clean = a.problems.filter(function(p){ var s = sst(p.id); return s.found && s.fixed && s.stepTries === 0 && s.fixTries === 1 && s.hint < 3; }).length;
      return { first:clean, total:a.problems.length, done:solved, line:(a.summary || "Spot the error") + ": " + solved + "/" + a.problems.length + " solved, " + clean + " without help or retries" };
    },
    missed:function(){ var g = []; a.problems.forEach(function(p){ var s = sst(p.id); if (s.stepTries > 0 || s.fixTries > 1 || s.hint >= 3) g = g.concat(MV.goalIdx(p.goal != null ? p.goal : a.goal)); }); return g; }
  };
}

// ---------- @component E17 draftWorkspace (copied from ENG4U 06) — a writing area with a live word count (target range),
// saved drafts (up to 3) and a side-by-side compare with the changes marked ----------
// draftWorkspace(host, {id, label, min, max, get(), set(v), drafts() -> [{n, t}], onChange()})
function diffWords(a, b){
  var A = a.split(/\s+/).filter(Boolean), Bw = b.split(/\s+/).filter(Boolean), n = A.length, m = Bw.length, L = [];
  for (var i = 0; i <= n; i++) { L.push(new Array(m + 1).fill(0)); }
  for (i = n - 1; i >= 0; i--) for (var j = m - 1; j >= 0; j--) L[i][j] = A[i] === Bw[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  var left = [], right = []; i = 0; j = 0;
  while (i < n && j < m) { if (A[i] === Bw[j]) { left.push(esc(A[i])); right.push(esc(Bw[j])); i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) { left.push("<del>" + esc(A[i]) + "</del>"); i++; } else { right.push("<ins>" + esc(Bw[j]) + "</ins>"); j++; } }
  while (i < n) left.push("<del>" + esc(A[i++]) + "</del>");
  while (j < m) right.push("<ins>" + esc(Bw[j++]) + "</ins>");
  return [left.join(" "), right.join(" ")];
}
function draftWorkspace(host, o){
  var cmp = null;
  host.innerHTML = '<div class="se-dw"><label for="dw-' + o.id + '" class="se-lab">' + o.label + '</label><textarea id="dw-' + o.id + '" class="se-dw-ta" rows="10"></textarea>' +
    '<div class="q-actions"><span class="se-dw-n" id="dw-' + o.id + '-n" aria-live="polite"></span><button type="button" class="btn ghost sm" id="dw-' + o.id + '-save">Save as a draft</button></div><div id="dw-' + o.id + '-list"></div><div id="dw-' + o.id + '-cmp" aria-live="polite"></div></div>';
  var ta = $("#dw-" + o.id, host); ta.value = o.get() || "";
  function count(){
    var n = wc(ta.value), msg = n < o.min ? (o.min - n) + " to go" : n > o.max ? (n - o.max) + " over" : "in range";
    $("#dw-" + o.id + "-n", host).innerHTML = "<strong>" + n + " word" + (n === 1 ? "" : "s") + "</strong> · aim for " + o.min + "–" + o.max + " (" + msg + ")";
  }
  function list(){
    var D = o.drafts(), el = $("#dw-" + o.id + "-list", host);
    el.innerHTML = D.length ? '<p class="tiny se-dw-l">Saved drafts: ' + D.map(function(d, i){ return '<button type="button" class="linkbtn" data-dwc="' + i + '" aria-pressed="' + (cmp === i) + '">Compare draft ' + d.n + " with now</button>"; }).join(" · ") + "</p>" : "";
    var cb = $("#dw-" + o.id + "-cmp", host);
    if (cmp != null && D[cmp]) { var df = diffWords(D[cmp].t, ta.value); cb.innerHTML = '<div class="se-dw-cmp"><div><p class="tiny"><strong>Draft ' + D[cmp].n + '</strong> (removed words struck through)</p><p>' + df[0] + '</p></div><div><p class="tiny"><strong>Now</strong> (new words underlined)</p><p>' + df[1] + "</p></div></div>"; }
    else cb.innerHTML = "";
  }
  ta.addEventListener("input", function(){ o.set(ta.value); count(); if (cmp != null) list(); if (o.onChange) o.onChange(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.id === "dw-" + o.id + "-save") { var D = o.drafts(), t = ta.value.trim(); if (!t) return; var n = D.length ? D[D.length - 1].n + 1 : 1; D.push({ n:n, t:t }); while (D.length > 3) D.shift(); cmp = null; MV.save(); list(); return; }
    if (b.dataset.dwc != null) { var i = +b.dataset.dwc; cmp = cmp === i ? null : i; list(); }
  });
  count(); list();
  return { refresh:function(){ ta.value = o.get() || ""; count(); list(); } };
}

// ---------- Performance task: Blueprint and one true paragraph (structure-only checks; full text in the summary) ----------
var task = (function(){
  var api = null, T = null, tok = null;
  function explain(){ var e = $("#task-explain"); return e ? e.value : (MV.taskState().explain || ""); }
  function data(S){
    S = S || {}; var b = Array.isArray(S.beams) ? S.beams : [];
    return { title:String(S.title || ""), author:String(S.author || ""), thesis:String(S.thesis || ""), tags:S.tags || {}, extra:String(S.extra || ""),
      beams:[0, 1, 2, 3].map(function(i){ return String(b[i] || ""); }), counter:String(S.counter || ""), concl:String(S.concl || ""), para:String(S.para || ""), explain:explain() };
  }
  function tagText(d, r){ var tk = MV.eng.tokenize(d.thesis); return (d.tags[r] || []).filter(function(i){ return i < tk.length; }).sort(function(a, b){ return a - b; }).map(function(i){ return tk[i].t; }).join(" "); }
  function marks(){
    var S = api.S, tg = S.tags || {}; return T.tagRoles.map(function(r){ return { w:(tg[r.id] || []).slice(), role:r.role, tag:r.t }; }).filter(function(m){ return m.w.length; });
  }
  function hl(thesis, tags){
    var h = esc(thesis); T.tagRoles.forEach(function(r){ var s = tags[r.id]; if (!s) return; var e = esc(s), k = h.indexOf(e); if (k >= 0) h = h.slice(0, k) + '<mark class="an an-' + r.role + '">' + e + '</mark><span class="an-tag an-' + r.role + '">' + r.t + "</span>" + h.slice(k + e.length); });
    return h;
  }
  function paintPv(){
    var el = $("#tk-pv"); if (!el) return;
    var d = data(api.S), tm = taskTerms(d), r = taskChecks(d, T);
    el.innerHTML = '<h4 class="se-h4" style="margin-top:0">Your blueprint at a glance</h4>' +
      '<p class="tiny"><strong>Key terms:</strong> ' + (tm.length ? tm.map(esc).join(", ") : '<span class="muted">none yet (write your thesis)</span>') + "</p>" +
      '<ol class="se-pvb">' + d.beams.map(function(b, i){ if (!b.trim() && i === 3) return ""; var c = b.trim() ? carries(b, tm) : []; return '<li class="' + (b.trim() && c.length && wc(b) >= T.beamMin ? "yes" : "no") + '">' + (b.trim() ? esc(b) + (c.length ? ' <span class="tiny muted">(carries: ' + c.map(esc).join(", ") + ")</span>" : ' <span class="tiny se-flag">(no key term)</span>') : '<span class="muted">empty</span>') + "</li>"; }).join("") + "</ol>" +
      '<p class="tiny"><strong>Counterargument:</strong> ' + (d.counter.trim() ? esc(d.counter) : '<span class="muted">empty</span>') + '</p><p class="tiny"><strong>Conclusion:</strong> ' + (d.concl.trim() ? esc(d.concl) : '<span class="muted">empty</span>') + "</p>" +
      '<p class="tiny"><strong>Checklist:</strong> ' + r.filter(Boolean).length + "/" + r.length + "</p>";
    var m = $("#tk-models"), found = (MV.taskState().found || []).length > 0;
    m.innerHTML = found ? '<details class="alg"><summary>' + T.modelsLabel + "</summary>" + T.models.map(function(md){
      return '<div class="se-model-r"><h5>' + md.title + "</h5><p><strong>Thesis:</strong> " + hl(md.thesis, md.tags) + "</p><p><strong>Beams:</strong></p><ol>" + md.beams.map(function(b){ return "<li>" + esc(b) + "</li>"; }).join("") + "</ol>" +
        "<p><strong>Counterargument:</strong> " + esc(md.counter) + "</p><p><strong>Conclusion:</strong> " + esc(md.concl) + "</p><p><strong>Paragraph (" + wc(md.para) + " words):</strong> " + esc(md.para) + "</p><p><strong>Craft statement:</strong> " + esc(md.craft) + "</p></div>";
    }).join("") + "</details>" : "";
  }
  function changed(){ api.save(); api.update(); paintPv(); }
  function retok(){ if (!tok) return; var S = api.S, n = MV.eng.tokenize(S.thesis || "").length; S.tags = S.tags || {}; ["claim", "how", "why"].forEach(function(r){ S.tags[r] = (S.tags[r] || []).filter(function(i){ return i < n; }); }); tok.setTokens(MV.eng.tokenize(S.thesis || "")); tok.clear(); }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; var S = a.S; S.beams = Array.isArray(S.beams) ? S.beams : ["", "", "", ""]; S.tags = S.tags || {}; S.drafts = Array.isArray(S.drafts) ? S.drafts : [];
      inp.innerHTML = '<div class="se-tk">' +
        '<div class="se-tk2"><div class="jq"><label for="tk-title">Novel title</label><input id="tk-title" class="txtin" type="text" autocomplete="off" data-tk="title"></div><div class="jq"><label for="tk-author">Author</label><input id="tk-author" class="txtin" type="text" autocomplete="off" data-tk="author"></div></div>' +
        '<div class="q-actions"><button type="button" class="btn ghost sm" id="tk-import">Bring in my “My novel” thesis and outline from the essay architect</button><span class="tiny muted" id="tk-imsg" aria-live="polite"></span></div>' +
        '<div class="jq"><label for="tk-thesis">Thesis (your own words)</label><textarea id="tk-thesis" rows="3" data-tk="thesis"></textarea><p class="tiny muted" id="tk-tn" aria-live="polite"></p></div>' +
        '<div class="se-tagbox"><p class="se-lab">Tag your thesis: select words, then tag them as the claim, the how and the why.</p><div id="tk-toks"></div><div class="q-actions">' +
          T.tagRoles.map(function(r){ return '<button type="button" class="an-chip an-' + r.role + '" data-tag="' + r.id + '"><i class="an-dot" aria-hidden="true"></i>Tag as ' + r.t.toLowerCase() + "</button>"; }).join("") + '<button type="button" class="btn ghost sm" data-tag="clear">Clear tags</button></div><p class="tiny" id="tk-tagst" aria-live="polite"></p></div>' +
        '<div class="jq"><label for="tk-extra">Extra key terms <span class="tiny muted">(optional, separated by commas)</span></label><input id="tk-extra" class="txtin" type="text" autocomplete="off" data-tk="extra"></div>' +
        '<fieldset class="se-tkout"><legend>Outline: 3–4 beams (topic sentences)</legend>' + [0, 1, 2, 3].map(function(i){ return '<div class="jq"><label for="tk-b' + i + '">Beam ' + (i + 1) + (i === 3 ? ' <span class="tiny muted">(optional)</span>' : "") + '</label><input id="tk-b' + i + '" class="txtin" type="text" autocomplete="off" data-beam="' + i + '"></div>'; }).join("") +
          '<div class="jq"><label for="tk-counter">Counterargument line</label><input id="tk-counter" class="txtin" type="text" autocomplete="off" data-tk="counter" placeholder="Some readers argue … ; yet …"></div>' +
          '<div class="jq"><label for="tk-concl">Conclusion line</label><input id="tk-concl" class="txtin" type="text" autocomplete="off" data-tk="concl"></div></fieldset>' +
        T.guide + '<p class="se-vb tiny">Analysis verbs: ' + MV.C.explore.verbs.join(", ") + '</p><div id="tk-para"></div></div>';
      pv.innerHTML = '<div id="tk-pv" aria-live="polite"></div><div id="tk-models"></div>';
      $$("[data-tk]", inp).forEach(function(el){ el.value = S[el.dataset.tk] || ""; });
      $$("[data-beam]", inp).forEach(function(el){ el.value = S.beams[+el.dataset.beam] || ""; });
      tok = MV.eng.tokens($("#tk-toks"), MV.eng.tokenize(S.thesis || ""), { label:"Words of your thesis", marks:marks, onChange:function(){} });
      draftWorkspace($("#tk-para"), { id:"para", label:"One body paragraph (" + T.paraWords[0] + "–" + T.paraWords[1] + " words)", min:T.paraWords[0], max:T.paraWords[1], get:function(){ return S.para; }, set:function(v){ S.para = v; }, drafts:function(){ return S.drafts; }, onChange:changed });
      function tn(){ var t = S.thesis || "", n = wc(t), s = sentences(t).length; $("#tk-tn").textContent = n + " words · " + s + " sentence" + (s === 1 ? "" : "s") + " (aim for " + T.thesisWords[0] + "–" + T.thesisWords[1] + " words in one or two sentences)"; }
      function tagst(){ var d = data(S); $("#tk-tagst").innerHTML = T.tagRoles.map(function(r){ var x = tagText(d, r.id); return '<span class="an-tag an-' + r.role + '">' + r.t + "</span> " + (x ? "“" + esc(x) + "”" : '<span class="muted">not tagged</span>'); }).join(" · "); }
      inp.addEventListener("input", function(e){
        var t = e.target;
        if (t.dataset.tk) { S[t.dataset.tk] = t.value; if (t.dataset.tk === "thesis") { retok(); tn(); tagst(); } }
        else if (t.dataset.beam != null) S.beams[+t.dataset.beam] = t.value;
        else return;
        changed();
      });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b) return;
        if (b.dataset.tag) {
          var r = b.dataset.tag;
          if (r === "clear") S.tags = {};
          else { var sel = tok.get().slice().sort(function(x, y){ return x - y; }); if (!sel.length) { $("#tk-tagst").textContent = "Select some words of your thesis first (tap them), then tag."; return; } S.tags[r] = sel; ["claim", "how", "why"].forEach(function(o){ if (o !== r) S.tags[o] = (S.tags[o] || []).filter(function(i){ return sel.indexOf(i) < 0; }); }); }
          tok.clear(); tok.paint(); tagst(); changed(); return;
        }
        if (b.id === "tk-import") {
          if (!ARCH) return; var th = ARCH.thesis("my"), ln = ARCH.lineOf("my"), my = ARCH.T("my");
          if (!th && !ln.some(function(x){ return x.t.trim(); })) { $("#tk-imsg").textContent = "Nothing to bring in yet: build “My novel” in the essay architect first."; return; }
          if (th) S.thesis = th; if ((my.title || "").trim()) S.title = my.title.trim(); if ((my.author || "").trim()) S.author = my.author.trim();
          var bs = ln.filter(function(x){ return x.kind === "beam" && x.t.trim(); }).map(function(x){ return x.t; }).slice(0, 4), cs = ln.filter(function(x){ return x.kind === "counter" && x.t.trim(); })[0];
          if (bs.length) S.beams = [0, 1, 2, 3].map(function(i){ return bs[i] || ""; });
          if (cs) S.counter = cs.t; if ((my.concl.t || "").trim()) S.concl = my.concl.t.trim();
          $$("[data-tk]", inp).forEach(function(el){ el.value = S[el.dataset.tk] || ""; }); $$("[data-beam]", inp).forEach(function(el){ el.value = S.beams[+el.dataset.beam] || ""; });
          retok(); tn(); tagst(); changed(); $("#tk-imsg").textContent = "Brought in. Now rewrite and tag your thesis."; return;
        }
      });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ a.update(); paintPv(); });
      $("#task-check").addEventListener("click", function(){ setTimeout(paintPv, 0); });
      tn(); tagst(); paintPv();
    },
    read:function(){ return data(api ? api.S : MV.taskState().app); },
    valid:function(d){ return d.thesis.trim() || d.para.trim() ? true : "Write your thesis first."; },
    checks:function(d){ return taskChecks(d, MV.C.task); },
    summary:function(ts){
      T = T || MV.C.task; var S = ts.app || {}, d = data(S), r = taskChecks(d, T), met = r.filter(Boolean).length, L = [];
      L.push((T.summary || "Blueprint and one true paragraph") + ": " + (met === r.length ? "complete (checklist " + met + "/" + r.length + ")" : "in progress (" + met + "/" + r.length + ")"));
      L.push("  Novel: " + (d.title.trim() || "(no title)") + (d.author.trim() ? ", by " + d.author.trim() : ""));
      L.push("  Thesis: " + (d.thesis.trim() || "(not written yet)"));
      L.push("  Thesis tags: " + T.tagRoles.map(function(x){ var s = tagText(d, x.id); return x.t.toLowerCase() + " “" + (s || "—") + "”"; }).join(" · "));
      L.push("  Outline:");
      d.beams.forEach(function(b, i){ if (b.trim() || i < 3) L.push("    " + (i + 1) + ". " + (b.trim() || "(empty)")); });
      L.push("    Counterargument: " + (d.counter.trim() || "(empty)"));
      L.push("    Conclusion: " + (d.concl.trim() || "(empty)"));
      L.push("  Body paragraph (" + wc(d.para) + " words):");
      L.push("    " + (d.para.trim() || "(not written yet)"));
      return L;
    }
  };
})();

// ---------- Reflect extras (sample principles, word count, trivium tag, commonplace book) ----------
function extras(){
  var R = MV.C.reflect, sheet = $("#art-sheet"), art = $("#art");
  if (sheet && art && R.artSamples && !$("#art-samples")) {
    var d = document.createElement("details"); d.id = "art-samples"; d.className = "alg art-samples";
    d.innerHTML = "<summary>See examples</summary><p class=\"tiny muted\">Two samples. Always write your own.</p>" + R.artSamples.map(function(s){ return '<p class="an-note an-theme"><strong>Principle:</strong> “' + s.p + "”<br><strong>Master’s example:</strong> “" + s.m + "”<br><strong>My imitation:</strong> “" + s.i + "”</p>"; }).join("");
    sheet.insertBefore(d, art);
  }
  var ap = $("#art-p");
  if (ap && !$("#se-artn")) {
    var n = document.createElement("p"); n.id = "se-artn"; n.className = "tiny muted"; n.setAttribute("aria-live", "polite"); ap.parentNode.appendChild(n);
    var upd = function(){ var k = wc(ap.value); n.textContent = k + " word" + (k === 1 ? "" : "s") + (k >= R.principleMin ? " ✓" : " (write at least " + R.principleMin + ")"); };
    ap.addEventListener("input", upd); upd();
  }
  MV.eng.triviumPicker();
  var cp = $("#cp-app"); if (cp && !cp.childNodes.length) MV.eng.commonplace(cp, { lines:R.art.examples.map(function(x){ return MV.plain(x).replace(/\s*\([^()]*\)\s*$/, ""); }) });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ spot:spotProse },
  task:task,
  onShow:function(v){ MV.eng.stop(); P3.stop(); if (v !== "start" && HR.stop) HR.stop(); if (P3.refreshOwn) P3.refreshOwn(); }
});
})();
