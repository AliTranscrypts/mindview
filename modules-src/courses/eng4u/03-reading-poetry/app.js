// ENG4U 03 Reading Poetry: hero read-aloud (Sonnet 73, lines 1–4), Sound and shape studio (Explore: E3 scansion tapper,
// rhyme & form, line-break lab, E2 device lens), Form makes meaning (Part 3), Sound sort with "So what?", the unseen poem
// (E3 + letter chips), Spot the Error for prose (K13), and "The Turn" poem editor (E17 variant).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function cap(s){ s = String(s || ""); return s.charAt(0).toUpperCase() + s.slice(1); }
function listAnd(a){ return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
function num(a, b){ return a - b; }

// ---------- @component radioGroup (copied from ENG4U 01; no option needs to be checked) ----------
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

// ---------- @component E3 scansionTapper — syllable chips; tap (or arrow keys + Space) to mark stress; checks a line against a key that
// lists accepted variants; names the metre and foot and flags trochaic inversions, spondees, pyrrhics and feminine endings
// (course plan E3; reused by 10) ----------
// Lines are written with "·" between the syllables of a word: "That time of year thou mayst in me be·hold".
// SC.parse(src) -> {words:[{lead, core, trail, syl:[syllable indices]}], syl:[{t, w, last}], n, text}
// SC.metre(P, marks) -> {fit, kind, k, feet:[{a, b, t}], text, varText, bars:[syllable numbers that start a foot after the first]}
// SC.check(marks, key) -> {ok, missing, extra}   key = {req, opt, never}; marks and key use syllable numbers (1-based)
// scansionTapper(host, {lines:[parsed], get(li) -> marks, onToggle(li, n), onCur(li), readOnly, nums:[shown line numbers], gaps:{li:true},
//   feet(li) -> bar syllable numbers, cur, id}) -> {paint(), paintLine(li), glow(li, [syllable indices] | null), focus(li, si), cur()}
var SC = (function(){
  var LEAD = /^[(“"‘\[]+/, TRAIL = /[.,;:!?)\]”"—–]+$/, KN = { 3:"trimeter", 4:"tetrameter", 5:"pentameter", 6:"hexameter" };
  function parse(src){
    var words = [], syl = [];
    String(src).split(/\s+/).filter(Boolean).forEach(function(tok){
      var lead = (tok.match(LEAD) || [""])[0], rest = tok.slice(lead.length), trail = (rest.match(TRAIL) || [""])[0], core = rest.slice(0, rest.length - trail.length);
      var w = { lead:lead, core:core.replace(/·/g, ""), trail:trail, syl:[] };
      if (/[A-Za-zÀ-ÿ]/.test(core)) core.split("·").forEach(function(p, k, all){ w.syl.push(syl.length); syl.push({ t:p, w:words.length, last:k === all.length - 1 }); });
      else { w.lead = tok; w.core = ""; w.trail = ""; }
      words.push(w);
    });
    return { words:words, syl:syl, n:syl.length, text:words.map(function(w){ return w.lead + w.core + w.trail; }).join(" ") };
  }
  function sylName(P, i, up){ var s = P.syl[i - 1]; if (!s) return ""; var t = up ? s.t.toUpperCase() : s.t.toLowerCase(); return t + (s.last ? "" : "-"); }
  function footText(P, f, has){ return [f.a, f.b].filter(Boolean).map(function(i){ return sylName(P, i, has[i]); }).join(" "); }
  function metre(P, marks){
    var n = P.n, has = {}, best = null; (marks || []).forEach(function(i){ has[i] = 1; });
    function consider(x){ if (!best || x.score > best.score) best = x; }
    [3, 4, 5, 6].forEach(function(k){
      [0, 1].forEach(function(extra){   // iambic: 2k syllables, or 2k + 1 with a light extra syllable (feminine ending)
        if (n !== 2 * k + extra || (extra && has[n])) return;
        var feet = [], c = { iamb:0, trochee:0, spondee:0, pyrrhic:0 };
        for (var i = 0; i < k; i++) { var a = 2 * i + 1, b = a + 1, t = has[a] ? (has[b] ? "spondee" : "trochee") : (has[b] ? "iamb" : "pyrrhic"); feet.push({ a:a, b:b, t:t }); c[t]++; }
        if (c.iamb >= Math.ceil(k / 2) && c.trochee <= 1) consider({ kind:"iambic", k:k, feet:feet, c:c, fem:!!extra, score:c.iamb / k + 0.001 });
      });
      [0, 1].forEach(function(cut){     // trochaic: 2k syllables, or 2k − 1 (the last foot a single stress)
        if (n !== 2 * k - cut) return;
        var feet = [], c = { iamb:0, trochee:0, spondee:0, pyrrhic:0 };
        for (var i = 0; i < k; i++) {
          var a = 2 * i + 1, b = a + 1, one = cut && i === k - 1, t = one ? (has[a] ? "trochee" : "pyrrhic") : has[a] ? (has[b] ? "spondee" : "trochee") : (has[b] ? "iamb" : "pyrrhic");
          feet.push({ a:a, b:one ? null : b, t:t }); c[t]++;
        }
        if (c.trochee >= Math.ceil(k / 2) && c.iamb <= 1) consider({ kind:"trochaic", k:k, feet:feet, c:c, cat:!!cut, score:c.trochee / k });
      });
    });
    if (!best) return { fit:false, text:"Keep listening: no regular pattern yet", varText:"—", bars:[] };
    var B = best, c = B.c, parts = [], vars = [], inv = B.kind === "iambic" ? "trochee" : "iamb";
    if (c.spondee) {
      parts.push(c.spondee > 1 ? "extra stresses (spondees)" : "an extra stress (a spondee)");
      var runs = [], run = [];
      for (var i = 1; i <= n + 1; i++) { if (has[i]) run.push(i); else { if (run.length > 1) runs.push(run.map(function(j){ return sylName(P, j, true); }).join(" ")); run = []; } }
      vars.push("Spondee: two stresses side by side (" + runs.join(", ") + ")");
    }
    if (c[inv]) {
      parts.push(B.kind === "iambic" ? "a trochaic inversion" : "an inversion (da-DUM)");
      vars.push((B.kind === "iambic" ? "Trochaic inversion: a foot flipped to DUM-da (" : "Inversion: a foot flipped to da-DUM (") + B.feet.filter(function(f){ return f.t === inv; }).map(function(f){ return footText(P, f, has); }).join(", ") + ")");
    }
    if (c.pyrrhic) {
      parts.push(c.pyrrhic > 1 ? "light feet (pyrrhics)" : "a light foot (a pyrrhic)");
      vars.push("Pyrrhic: two light syllables (" + B.feet.filter(function(f){ return f.t === "pyrrhic"; }).map(function(f){ return footText(P, f, has); }).join(", ") + ")");
    }
    if (B.fem) { parts.push("a feminine ending"); vars.push("Feminine ending: an extra soft syllable at the end (" + sylName(P, n, false) + ")"); }
    var name = cap(B.kind) + " " + KN[B.k];
    return { fit:true, kind:B.kind, k:B.k, feet:B.feet, name:name, text:name + (parts.length ? ", with " + listAnd(parts) : "") + (B.cat ? " (the last foot is a single stress)" : ""),
      varText:vars.length ? vars.join("; ") : "None: a regular line", bars:B.feet.slice(1).map(function(f){ return f.a; }) };
  }
  function check(marks, key){
    var has = {}; marks.forEach(function(i){ has[i] = 1; });
    var missing = key.req.filter(function(i){ return !has[i]; }), extra = marks.filter(function(i){ return key.req.indexOf(i) < 0 && key.opt.indexOf(i) < 0; }).sort(num);
    return { ok:!missing.length && !extra.length, missing:missing, extra:extra };
  }
  return { parse:parse, metre:metre, check:check, sylName:sylName };
})();
function scansionTapper(host, o){
  var cur = o.cur || 0, pos = {}, gl = {};
  function lineHTML(li){
    var P = o.lines[li], has = {}, bars = {}, g = gl[li] || {}, tab = pos[li] || 0, h = "";
    (o.get ? o.get(li) : []).forEach(function(i){ has[i] = 1; });
    (o.feet ? o.feet(li) : []).forEach(function(i){ bars[i] = 1; });
    P.words.forEach(function(w, wi){
      h += (wi ? " " : "") + '<span class="sct-w">' + esc(w.lead);
      w.syl.forEach(function(si){
        var s = P.syl[si], n = si + 1, on = !!has[n], cls = "sc-syl sct-b " + (on ? "sc-stress" : "sc-slack") + (g[si] ? " sct-on" : "");
        if (bars[n]) h += '<span class="sct-bar" aria-hidden="true"></span>';
        h += o.readOnly ? '<span class="' + cls + '" data-li="' + li + '" data-si="' + si + '">' + esc(s.t) + "</span>"
          : '<button type="button" class="' + cls + '" data-li="' + li + '" data-si="' + si + '" aria-pressed="' + on + '" tabindex="' + (si === tab ? 0 : -1) + '" aria-label="' + esc("syllable " + n + " of " + P.n + ", " + s.t + ", " + (on ? "stressed" : "unstressed")) + '">' + esc(s.t) + "</button>";
      });
      h += esc(w.trail) + "</span>";
    });
    return h;
  }
  function rowHTML(li){
    var P = o.lines[li], n = o.nums ? o.nums[li] : li + 1;
    return (o.gaps && o.gaps[li] ? '<div class="sct-gap" aria-hidden="true"></div>' : "") + '<div class="sct-line' + (li === cur && !o.readOnly ? " cur" : "") + '" data-line="' + li + '" role="group" aria-label="' + esc("Line " + n + ": " + P.text) + '"><span class="sct-n" aria-hidden="true">' + n + '</span><span class="sct-ws">' + lineHTML(li) + "</span></div>";
  }
  function paint(){ host.innerHTML = '<div class="sct' + (o.readOnly ? " ro" : "") + '">' + o.lines.map(function(_, li){ return rowHTML(li); }).join("") + "</div>"; }
  function paintLine(li){
    var row = host.querySelector('[data-line="' + li + '"] .sct-ws'); if (!row) return;
    var had = row.contains(document.activeElement); row.innerHTML = lineHTML(li);
    if (had) focus(li, pos[li] || 0);
  }
  function setCur(li){ if (li === cur) return; cur = li; $$(".sct-line", host).forEach(function(r){ r.classList.toggle("cur", +r.dataset.line === li); }); if (o.onCur) o.onCur(li); }
  function focus(li, si){
    var P = o.lines[li]; if (!P) return; si = Math.max(0, Math.min(P.n - 1, si)); pos[li] = si;
    $$('[data-li="' + li + '"]', host).forEach(function(b){ b.tabIndex = +b.dataset.si === si ? 0 : -1; });
    var b = host.querySelector('[data-li="' + li + '"][data-si="' + si + '"]'); if (b && b.focus) b.focus();
  }
  if (!o.readOnly) {
    host.addEventListener("click", function(e){
      var b = e.target.closest("button[data-si]"); if (!b) return;
      var li = +b.dataset.li, si = +b.dataset.si; pos[li] = si; setCur(li);
      if (o.onToggle) o.onToggle(li, si + 1);
      paintLine(li); focus(li, si);
    });
    host.addEventListener("keydown", function(e){
      var b = e.target.closest("button[data-si]"); if (!b) return;
      var li = +b.dataset.li, si = +b.dataset.si, k = e.key;
      if (k === "ArrowRight" || k === "ArrowLeft") { e.preventDefault(); focus(li, si + (k === "ArrowRight" ? 1 : -1)); }
      else if (k === "Home" || k === "End") { e.preventDefault(); focus(li, k === "Home" ? 0 : o.lines[li].n - 1); }
      else if ((k === "ArrowDown" || k === "ArrowUp") && o.lines[li + (k === "ArrowDown" ? 1 : -1)]) { e.preventDefault(); var nl = li + (k === "ArrowDown" ? 1 : -1); setCur(nl); focus(nl, Math.min(si, o.lines[nl].n - 1)); }
    });
    host.addEventListener("focusin", function(e){ var b = e.target.closest("[data-li]"); if (b) setCur(+b.dataset.li); });
  }
  paint();
  return {
    paint:paint, paintLine:paintLine, focus:focus, cur:function(){ return cur; }, setCur:setCur,
    glow:function(li, list){
      var set = {}; (list || []).forEach(function(i){ set[i] = 1; }); gl = {}; if (list) gl[li] = set;
      $$(".sct-b", host).forEach(function(x){ x.classList.toggle("sct-on", list != null && +x.dataset.li === li && !!set[+x.dataset.si]); });
    }
  };
}

// ---------- read aloud: local voices only (MV.eng); a playback engine that lights syllables ----------
var VOICE = null, PB = { run:0 };
function voiceReady(fn){ MV.eng.voice(function(v){ VOICE = v; document.documentElement.classList.toggle("rp-novoice", !v); if (fn) fn(v); }); }
function stopPlay(){ PB.run++; MV.eng.stop(); }
function trailPause(P, s){ return s.last && /[,;:.!?—–]/.test(P.words[s.w].trail); }
function sylDur(P, marks, si, o){ var st = marks.indexOf(si + 1) >= 0; return (st ? 320 * (o.emph ? 1.3 : 1) : 210) / (o.rate || 1) + (trailPause(P, P.syl[si]) ? 280 / (o.rate || 1) : 0); }
function wordSyl(P){ var out = []; P.words.forEach(function(w){ if (w.syl.length) out.push(w.syl); }); return out; }
// items: [{P, marks, glow([syllable indices] | null), start(), end()}]; o: {rate, emph}; done(completed)
function playLines(items, o, done){
  var me = ++PB.run, finished = false; MV.eng.stop();
  function alive(){ return me === PB.run; }
  var est = items.reduce(function(t, it){ return t + it.P.syl.reduce(function(u, s, si){ return u + sylDur(it.P, it.marks, si, o); }, 0) + 600; }, 0);
  var safety = setTimeout(function(){ if (alive()) { PB.run++; MV.eng.stop(); } fin(); }, est * 2.5 + 5000);
  function fin(){ if (finished) return; finished = true; clearTimeout(safety); items.forEach(function(it){ it.glow(null); }); if (done) done(alive()); }
  function step(i){
    if (!alive() || i >= items.length) { fin(); return; }
    var it = items[i]; if (it.start) it.start();
    var next = function(){ it.glow(null); if (it.end) it.end(); if (!alive()) { fin(); return; } if (MV.reduceMotion) step(i + 1); else setTimeout(function(){ step(i + 1); }, 450); };
    if (VOICE) speakLine(it, o, next, alive);
    else if (!MV.reduceMotion) timerLine(it, o, next, alive);
    else next();
  }
  step(0);
}
function timerLine(it, o, next, alive){
  var si = 0, P = it.P;
  (function tick(){
    if (!alive() || si >= P.n) { next(); return; }
    it.glow([si]); var d = sylDur(P, it.marks, si, o); si++; setTimeout(tick, d);
  })();
}
function speakLine(it, o, next, alive){
  var W = wordSyl(it.P), glow = function(k){ if (!MV.reduceMotion && W[k]) it.glow(W[k]); }, done = false;
  var nx = function(){ if (done) return; done = true; next(); };
  if (!o.emph) { MV.eng.say(it.P.text, { voice:VOICE, rate:o.rate || 1, onWord:glow, onEnd:nx }); return; }
  var words = it.P.words.filter(function(w){ return w.syl.length; }), k = 0;
  (function one(){
    if (!alive() || k >= words.length) { nx(); return; }
    var w = words[k], st = w.syl.some(function(si){ return it.marks.indexOf(si + 1) >= 0; });
    glow(k); k++;
    MV.eng.say(w.lead + w.core + w.trail, { voice:VOICE, rate:(o.rate || 1) / (st ? 1.3 : 1), onEnd:one });
  })();
}
// pace: unstressed 1 unit, stressed 1.6, a pause inside the line 0.8; syllables per unit, as a gauge
function pace(P, marks){
  var u = 0; P.syl.forEach(function(s, si){ u += marks.indexOf(si + 1) >= 0 ? 1.6 : 1; if (si < P.n - 1 && trailPause(P, s)) u += 0.8; });
  var v = P.n / u; return { v:v, pct:Math.max(6, Math.min(100, (v - 0.5) / 0.4 * 100)), word:v > 0.72 ? "steady" : "slow: the gauge dips" };
}

// ---------- hero: Sonnet 73, lines 1–4, read with the stresses lighting up (storyboard in the plan) ----------
var HR = { run:0 };
function hero(){
  var H = MV.C.hero, host = $("#rp-hero"); if (!host) return;
  var PL = MV.C.explore.poems[0].lines.slice(0, 4).map(SC.parse), M = H.marks;
  function st(li, n){ return M[li].indexOf(n) >= 0; }
  host.innerHTML = '<div class="hs-lines" aria-hidden="true">' + PL.map(function(P, li){
    var h = '<div class="hs-line"><span class="hs-n">' + (li + 1) + "</span><span>";
    P.words.forEach(function(w, wi){
      h += (wi ? " " : "") + '<span class="hs-w">' + esc(w.lead) + w.syl.map(function(si){ return '<span class="sc-syl hs-s ' + (st(li, si + 1) ? "sc-stress hs-st" : "sc-slack") + '" data-li="' + li + '" data-si="' + si + '">' + esc(P.syl[si].t) + "</span>"; }).join("") + esc(w.trail) + "</span>";
      if (li === 1 && /,/.test(w.trail)) h += '<span class="hs-tick" data-tw="' + wi + '"></span>';
    });
    return h + "</span></div>";
  }).join("") + '</div><p class="vh">' + PL.map(function(P, li){ return P.syl.map(function(s, si){ return SC.sylName(P, si + 1, st(li, si + 1)); }).join(" ").replace(/- /g, "-"); }).join(" / ") + '</p>' +
    '<p class="hs-cap" id="hs-cap">' + H.caption + '</p><p class="eng-cite hs-cite">' + H.cite + '</p><div class="hs-ctl"><button type="button" class="btn ghost sm" id="hs-again" hidden></button><span class="tiny muted" id="hs-note" hidden>' + MV.C.explore.voiceNote + "</span></div>";
  var S = $$(".hs-s", host);
  function syl(li, si){ return host.querySelector('.hs-s[data-li="' + li + '"][data-si="' + si + '"]'); }
  function reset(){ host.classList.add("hs-anim"); host.classList.remove("hs-done"); S.forEach(function(x){ x.classList.remove("lit", "now"); }); $$(".hs-tick", host).forEach(function(t){ t.classList.remove("on"); }); $("#hs-cap").classList.remove("on"); }
  function light(li, list){ S.forEach(function(x){ x.classList.remove("now"); }); list.forEach(function(si){ var x = syl(li, si); if (x) x.classList.add("lit", "now"); }); }
  function finish(){ host.classList.remove("hs-anim"); host.classList.add("hs-done"); S.forEach(function(x){ x.classList.add("lit"); x.classList.remove("now"); }); $$(".hs-tick", host).forEach(function(t){ t.classList.add("on"); }); $("#hs-cap").classList.add("on"); btn(); }
  function btn(){ var b = $("#hs-again"); b.textContent = VOICE ? H.again : H.watch; b.hidden = !VOICE && MV.reduceMotion; }
  function animate(){
    var me = ++HR.run, t = 400; reset();
    function at(ms, fn){ setTimeout(function(){ if (me === HR.run) fn(); }, ms); }
    PL.forEach(function(P, li){
      var slow = li === 3 ? 1.4 : 1;
      if (li === 3) at(t, function(){ $("#hs-cap").classList.add("on"); });
      P.syl.forEach(function(s, si){
        at(t, function(){ light(li, [si]); });
        t += (st(li, si + 1) ? 310 : 190) * slow;
        var w = P.words[s.w];
        if (s.last && /[,;:]/.test(w.trail)) { if (li === 1) (function(wi){ at(t, function(){ var k = host.querySelector('.hs-tick[data-tw="' + wi + '"]'); if (k) k.classList.add("on"); }); })(s.w); t += 380 * slow; }
      });
      t += 560;
    });
    at(t, finish);
  }
  function speak(){
    var me = ++HR.run, li = 0; reset(); if (MV.reduceMotion) finish();
    (function line(){
      if (me !== HR.run) return;
      if (li >= PL.length) { finish(); return; }
      var P = PL[li], W = wordSyl(P), cur = li;
      if (cur === 1) $$(".hs-tick", host).forEach(function(t){ t.classList.add("on"); });
      if (cur === 3) $("#hs-cap").classList.add("on");
      MV.eng.say(P.text, { voice:VOICE, rate:cur === 3 ? 0.8 : 1, onWord:function(k){ if (me === HR.run && W[k] && !MV.reduceMotion) light(cur, W[k]); },
        onEnd:function(){ if (me !== HR.run) return; if (!MV.reduceMotion) light(cur, P.syl.map(function(_, i){ return i; })); li++; setTimeout(line, 350); } });
    })();
  }
  $("#hs-again").addEventListener("click", function(){ if (VOICE) speak(); else animate(); });
  if (MV.reduceMotion) finish(); else animate();
  voiceReady(function(v){ $("#hs-note").hidden = !!v; if (host.classList.contains("hs-done")) btn(); });
  HR.stop = function(){ if (host.classList.contains("hs-anim")) { HR.run++; finish(); } };
}

// ---------- @component E2 deviceLens — lens overlays on a tokenized passage (copied from ENG4U 01; course plan E2) ----------
// deviceLens(host, {lenses:[{id, label, role}], label, empty}) -> {show(st)}
//   st = {toks: MV.eng.tokenize(lines, {breaks:true}), devices:[{id, lens, w:[token indices], label, tag, note}], on:{lensId:true}, focus:deviceId, onFocus(id)}
function stackStyle(roles){ return roles.length > 1 ? ' style="box-shadow:' + roles.map(function(r, k){ return "inset 0 -" + (3 * (k + 1)) + "px 0 var(--an-" + r + ")"; }).join(",") + '"' : ""; }
function deviceLens(host, o){
  var L = {}, st = null; o.lenses.forEach(function(l){ L[l.id] = l; });
  host.innerHTML = '<div class="e2"><div class="e2-text" role="group" aria-label="' + esc(o.label || "The poem") + '"></div><ul class="e2-notes" aria-label="Devices the lenses show"></ul></div>';
  var tx = $(".e2-text", host), nt = $(".e2-notes", host);
  nt.addEventListener("click", function(e){ var b = e.target.closest("[data-dev]"); if (b && st && st.onFocus) st.onFocus(b.dataset.dev); });
  function show(s){
    st = s;
    var vis = s.devices.filter(function(d){ return s.on[d.lens]; }), info = s.toks.map(function(){ return { r:[], tags:[] }; });
    vis.forEach(function(d){ var last = -1, r = L[d.lens].role; d.w.forEach(function(i){ if (!info[i]) return; if (info[i].r.indexOf(r) < 0) info[i].r.push(r); last = Math.max(last, i); }); if (last >= 0) info[last].tags.push(d); });
    var h = "", line = null, first = true;
    s.toks.forEach(function(tk, i){
      if (tk.line !== line) { h += (line === null ? "" : "</span>") + '<span class="e2-line">'; line = tk.line; first = true; }
      var r = info[i].r, cls = "e2-w" + (r.length ? " an an-" + r[0] : "");
      if (tk.br) { if (r.length) h += ' <span class="' + cls + ' e2-br"' + stackStyle(r) + '>↵<span class="vh"> (line break)</span></span>'; }
      else { h += (first ? "" : " ") + '<span class="' + cls + '"' + stackStyle(r) + ">" + esc(tk.t) + "</span>"; first = false; }
      info[i].tags.forEach(function(d){ h += '<span class="an-tag an-' + L[d.lens].role + '">' + L[d.lens].label + " · " + d.tag + "</span>"; });
    });
    tx.innerHTML = h + (line === null ? "" : "</span>");
    var had = nt.contains(document.activeElement) ? document.activeElement.dataset.dev : null;
    nt.innerHTML = vis.length ? vis.map(function(d){
      var role = L[d.lens].role, on = d.id === s.focus;
      return '<li><button type="button" class="an-note an-' + role + ' e2-note" data-dev="' + d.id + '" aria-pressed="' + on + '"><span class="an-tag an-' + role + '">' + L[d.lens].label + "</span><strong>" + d.label + "</strong>: " + d.tag + ". What it does: " + d.note + "</button></li>";
    }).join("") : '<li class="tiny muted e2-none">' + (o.empty || "Switch on a lens to see its devices.") + "</li>";
    if (had) { var nb = nt.querySelector('[data-dev="' + had + '"]'); if (nb) nb.focus({ preventScroll:true }); }
  }
  return { show:show };
}

// ---------- Explore: Sound and shape studio (E3 scansion tapper + rhyme & form + line-break lab + E2 device lens) ----------
var EX = null;
function explore(host, api){
  var C = api.content, S = api.S, PO = {}, KEY = {}, LZ = C.lenses, LET = "abcdefg".split("");
  C.poems.forEach(function(p){
    var L = [], gap = {}, pend = false;
    p.lines.forEach(function(l){ if (!l) { pend = true; return; } if (pend) gap[L.length] = true; pend = false; L.push(SC.parse(l)); });
    p.L = L; p.gap = gap; PO[p.id] = p;
  });
  C.keys.forEach(function(k){ KEY[k.id] = MV.ans(k); });
  var SEN = {}; C.lb.sentences.forEach(function(s){ SEN[s.id] = s; });
  var BL = SC.parse(C.blake.line), H = MV.C.hero, L1 = PO.s73.L[0], L4 = PO.s73.L[3];
  S.poem = PO[S.poem] ? S.poem : "s73"; S.mode = ["scan", "rhyme", "breaks", "lens"].indexOf(S.mode) >= 0 ? S.mode : "scan";
  S.marks = S.marks || {}; S.cur = S.cur || {}; S.let = S.let || {}; S.turn = S.turn || {}; S.form = S.form || {}; S.br = S.br || {}; S.lb = SEN[S.lb] ? S.lb : "letter";
  S.lens = S.lens || { figure:true }; S.focus = S.focus || {}; S.speed = S.speed || 1; S.cmp = S.cmp || "";
  var rsel = -1, tap = null, tapPid = null, chk = {}, cmpFx = { shown:{} }, fx = {}, speaking = false;

  host.innerHTML = '<div class="rp">' +
    '<div id="rp-poems" class="rp-poems"></div><div id="rp-mode" class="rp-mode"></div>' +
    '<div class="rp-body"><div class="rp-stage" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p><p class="rp-cite" id="rp-cite"></p>' +
      '<div id="rp-scan"><div class="rp-ctl"><button type="button" class="btn sm" id="rp-play" hidden>Play line</button><button type="button" class="btn ghost sm" id="rp-emph" aria-pressed="false" hidden>Emphasize stresses</button>' +
        '<span class="rp-spd" id="rp-spd" hidden><label for="rp-speed">Speed</label><input type="range" id="rp-speed" min="0.7" max="1.3" step="0.1"><output id="rp-spdv" for="rp-speed"></output></span><span class="tiny muted rp-vnote" id="rp-vnote" hidden>' + C.voiceNote + "</span></div>" +
        '<p class="tiny muted rp-help">Tap a syllable to mark it stressed (´) or unstressed (˘). Arrow keys move between syllables, Space marks, and Tab moves to the next line.</p><div id="rp-cmp"></div><div id="rp-tap"></div><div id="rp-lchk" aria-live="polite"></div></div>' +
      '<div id="rp-rhyme"><p class="how">Tap the last word of a line, then choose its rhyme letter. Mark the one line where the poem turns.</p><div id="rf-poem"></div><div id="rf-tone"></div><div id="rf-form" class="rf-form"></div></div>' +
      '<div id="rp-breaks"><div id="lb-sel"></div><p class="how">Tap the space between two words to break the line there; tap a break (↵) to join the lines again. Left and Right arrows move between spaces, and Enter breaks or joins.</p><div id="lb-box"></div>' +
        '<div class="rp-ctl"><button type="button" class="btn sm" id="lb-play" hidden>Read it with a pause at each break</button><span class="tiny muted rp-vnote" id="lb-vnote" hidden>' + C.voiceNote + '</span></div><p class="tiny muted">Weak endings: ' + C.lb.weak.join(", ") + ".</p></div>" +
      '<div id="rp-lens"><div id="rp-lenses" class="rp-lenses" role="group" aria-label="Lenses: switch each on or off"></div><div id="rp-dl"></div></div>' +
    '</div><div class="rp-read"><p class="rp-read-h">Readout</p><dl class="read" id="rp-read" aria-live="polite"></dl><p class="rp-aha">' + C.aha + "</p></div></div></div>";

  var poemRG = radios($("#rp-poems"), { label:"Poem", cls:"chips", options:C.poems.map(function(p){ return { id:p.id, t:p.label }; }).concat([{ id:"lb", t:C.passageChip }]), value:S.mode === "breaks" ? "lb" : S.poem, onChange:choosePoem });
  var modeRG = radios($("#rp-mode"), { label:"Mode", options:C.modes, value:S.mode, onChange:function(v){ setMode(v); } });
  var lbRG = radios($("#lb-sel"), { label:"Sentence", cls:"chips", options:C.lb.sentences.map(function(s){ return { id:s.id, t:s.label }; }), value:S.lb, onChange:function(v){ stopPlay(); S.lb = v; fx = {}; api.save(); paint(); } });
  var formRG = radios($("#rf-form"), { label:"Form", cls:"chips", options:C.forms, value:S.form[S.poem] || "", onChange:function(v){ S.form[S.poem] = v; api.save(); paintRead(); MV.changed(); } });
  var lens = deviceLens($("#rp-dl"), { lenses:LZ, label:"The poem, with lens overlays" });
  $("#rp-speed").value = S.speed; $("#rp-spdv").textContent = S.speed.toFixed(1) + "×";

  function poem(){ return PO[S.poem]; }
  function marks(pid, li){ var m = S.marks[pid] || (S.marks[pid] = {}); return m[li] || (m[li] = []); }
  function curLine(){ var p = poem(), c = S.cur[p.id] || 0; return Math.min(c, p.L.length - 1); }
  function lets(pid){ return S.let[pid] || (S.let[pid] = {}); }
  function turnOf(pid){ return S.turn[pid] == null ? -1 : S.turn[pid]; }

  // ----- Listen & scan -----
  function paintScan(){
    var p = poem();
    if (tapPid !== p.id || !tap) {
      var box = document.createElement("div"); $("#rp-tap").innerHTML = ""; $("#rp-tap").appendChild(box);
      tap = scansionTapper(box, { lines:p.L, nums:p.L.map(function(_, i){ return i + 1; }), gaps:p.gap, cur:curLine(),
        get:function(li){ return marks(p.id, li); }, feet:function(li){ return SC.metre(p.L[li], marks(p.id, li)).bars; },
        onToggle:function(li, n){ stopPlay(); var m = marks(p.id, li), k = m.indexOf(n); if (k < 0) m.push(n); else m.splice(k, 1); m.sort(num); chk[p.id + ":" + li] = null; api.save(); paintLchk(); paintRead(); MV.changed(); },
        onCur:function(li){ S.cur[p.id] = li; api.save(); paintLchk(); paintRead(); } });
      tapPid = p.id;
    }
    paintCmp(); paintLchk(); voiceUI();
  }
  function paintLchk(){
    var p = poem(), li = curLine(), id = p.id + ":" + li, el = $("#rp-lchk");
    if (!KEY[id]) { el.innerHTML = '<p class="tiny muted">Line ' + (li + 1) + " isn’t in the module’s stress key. Use the metre readout and your ear.</p>"; return; }
    var r = chk[id];
    el.innerHTML = '<div class="q-actions"><button type="button" class="btn ghost sm" id="rp-chkline" data-k="chkline">Check line ' + (li + 1) + " against the key</button></div>" + (r ? MV.fbHTML(r.good ? "good" : "bad", r.html) : "");
  }
  function lineCheck(p, li){
    var key = KEY[p.id + ":" + li], P = p.L[li], r = SC.check(marks(p.id, li), key);
    var nm = function(i){ return "syllable " + i + " (“" + esc(P.syl[i - 1].t) + "”)"; };
    if (r.ok) return { good:true, html:"<strong>✓ This matches the key.</strong>" + (key.opt.length ? " The key also accepts " + listAnd(key.opt.map(nm)) + " marked or left light." : "") };
    var out = [];
    if (r.missing.length) out.push("Listen again for the beat on " + listAnd(r.missing.map(nm)) + ".");
    if (r.extra.length) out.push(cap(listAnd(r.extra.map(nm))) + (r.extra.length > 1 ? " usually fall" : " usually falls") + " light.");
    return { good:false, html:"<strong>✗ Not yet.</strong> " + out.join(" ") + " Say the line aloud." };
  }
  function cmpRows(){
    if (S.cmp === "p1") return [{ label:"Line 1", P:L1, m:H.marks[0], pace:true }, { label:"Line 4", P:L4, m:H.marks[3], pace:true }];
    if (S.cmp === "p4a") return [{ label:"Blake", P:BL, m:C.blake.marks, tag:C.blake.tag, cite:C.blake.cite }];
    if (S.cmp === "p4") return [{ label:"Blake", P:BL, m:C.blake.marks, tag:C.blake.tag, cite:C.blake.cite }, { label:"Shakespeare, line 1", P:L1, m:H.marks[0], tag:C.s73tag }];
    return [];
  }
  var cmpTaps = [];
  function paintCmp(){
    var el = $("#rp-cmp"), rows = cmpRows(); cmpTaps = [];
    if (!rows.length || S.mode !== "scan") { el.innerHTML = ""; return; }
    el.innerHTML = '<div class="cmp"><div class="cmp-h"><strong>' + (S.cmp === "p1" ? "Compare: Sonnet 73, lines 1 and 4" : "Compare: trochaic and iambic") + '</strong><button type="button" class="linkbtn" id="cmp-x">Close the comparison</button></div>' +
      rows.map(function(r, k){
        var pc = r.pace ? pace(r.P, r.m) : null, on = !!cmpFx.shown[k];
        return '<div class="cmp-row"><p class="cmp-lab"><strong>' + r.label + '</strong> <span class="tag">' + r.m.length + " stresses</span>" + (r.tag ? ' <span class="tag">' + r.tag + "</span>" : "") + (r.cite ? ' <span class="tiny muted">' + r.cite + "</span>" : "") + '</p><div id="cmp-l' + k + '"></div>' +
          (pc ? '<div class="cmp-pace"><span class="cmp-pl">Pace</span><span class="em-track" aria-hidden="true"><i id="cmp-p' + k + '" style="width:' + (on ? pc.pct : 0) + '%"></i></span><span class="cmp-pv" id="cmp-pv' + k + '">' + (on ? pc.word : "plays on reveal") + "</span></div>" : "") + "</div>";
      }).join("") + "</div>";
    rows.forEach(function(r, k){ cmpTaps.push(scansionTapper($("#cmp-l" + k), { lines:[r.P], nums:[r.label === "Line 4" ? 4 : 1], readOnly:true, get:function(){ return r.m; }, feet:function(){ return SC.metre(r.P, r.m).bars; } })); });
  }
  function playCmp(done){
    var rows = cmpRows();
    playLines(rows.map(function(r, k){
      var pc = r.pace ? pace(r.P, r.m) : null;
      return { P:r.P, marks:r.m, glow:function(l){ if (cmpTaps[k]) cmpTaps[k].glow(0, l); },
        start:function(){ if (!pc) return; var bar = $("#cmp-p" + k), from = 0; if (!bar) return; MV.tween({ dur:900, step:function(t){ bar.style.width = (from + (pc.pct - from) * t) + "%"; }, done:function(){ cmpFx.shown[k] = true; var v = $("#cmp-pv" + k); if (v) v.textContent = pc.word; } }); } };
    }), { rate:S.speed, emph:S.cmp === "p1" }, done);
  }
  function voiceUI(){
    var v = !!VOICE;
    ["#rp-play", "#rp-emph", "#rp-spd", "#lb-play"].forEach(function(s){ $(s).hidden = !v; });
    $("#rp-vnote").hidden = v; $("#lb-vnote").hidden = v;
    $("#rp-emph").setAttribute("aria-pressed", !!S.emph);
    $("#rp-play").textContent = speaking ? "Stop" : "Play line " + (curLine() + 1);
    $("#lb-play").textContent = speaking ? "Stop" : "Read it with a pause at each break";
  }
  function playLine(){
    if (speaking) { stopPlay(); return; }
    var p = poem(), li = curLine(); speaking = true; voiceUI();
    playLines([{ P:p.L[li], marks:marks(p.id, li), glow:function(l){ if (tap) tap.glow(li, l); } }], { rate:S.speed, emph:!!S.emph }, function(){ speaking = false; voiceUI(); });
  }

  // ----- Rhyme & form -----
  function lastWord(P){ for (var i = P.words.length - 1; i >= 0; i--) if (P.words[i].syl.length) return i; return -1; }
  function pattern(s){ var map = {}, nx = 0, out = ""; for (var i = 0; i < s.length; i++) { if (!(s[i] in map)) map[s[i]] = String.fromCharCode(97 + nx++); out += map[s[i]]; } return out; }
  function letString(pid){ var p = PO[pid], lt = lets(pid), s = ""; for (var i = 0; i < p.L.length; i++) { if (!lt[i]) return null; s += lt[i]; } return s; }
  function guess(pid){
    var s = letString(pid); if (!s) return null;
    var q = pattern(s), n = q.length;
    if (n === 14 && q === "ababcdcdefefgg") return "Shakespearean sonnet";
    if (n === 14 && q.slice(0, 8) === "abbaabba") return "Petrarchan sonnet";
    if (n === 11 && q === "abcabcdbcdc") return "Curtal sonnet";
    if (n === 4 && q[1] === q[3] && q[0] !== q[1]) return "Ballad stanza";
    var runs = q.match(/(.)\1*/g) || [], seen = {};
    if (runs.every(function(r){ var ok = r.length >= 2 && !seen[r[0]]; seen[r[0]] = 1; return ok; })) return "Couplets";
    return "No fixed form found: free verse or an irregular pattern";
  }
  function schemeSoFar(p){
    var lt = lets(p.id), out = [], i = 0;
    (p.groups || [p.L.length]).forEach(function(g){ var s = ""; for (var k = 0; k < g && i < p.L.length; k++, i++) s += lt[i] || "·"; out.push(s); });
    return out.join(" ");
  }
  function paintRhyme(){
    var p = poem(), lt = lets(p.id), turn = turnOf(p.id), sonnetTurn = p.L.length === 14 && turn === 8, ind = p.indent || [];
    var h = '<div class="rf" role="group" aria-label="' + esc(MV.plain(p.label)) + ': line endings">';
    p.L.forEach(function(P, li){
      if (p.gap[li]) h += '<div class="rf-gap" aria-hidden="true"></div>';
      if (turn === li) h += '<div class="rf-hinge' + (fx.hinge ? " rf-in" : "") + '"><span class="an-tag an-syntax">Turn' + (sonnetTurn ? ": the sestet begins" : "") + "</span></div>";
      var wi = lastWord(P), w = P.words[wi], before = P.words.slice(0, wi).map(function(x){ return x.lead + x.core + x.trail; }).join(" "), after = P.words.slice(wi + 1).map(function(x){ return x.lead + x.core + x.trail; }).join(" ");
      var lab = "Line " + (li + 1) + " ends on " + w.core + (lt[li] ? ", rhyme letter " + lt[li] : ", no letter yet") + (turn === li ? ", marked as the turn" : "");
      h += '<div class="rf-line' + (rsel === li ? " sel" : "") + (turn === li ? " turn" : "") + '"><span class="rf-n" aria-hidden="true">' + (li + 1) + '</span><span class="rf-t" style="padding-left:' + ((ind[li] || 0) * 0.9) + 'em">' + esc(before) + (before ? " " : "") + esc(w.lead) +
        '<button type="button" class="rf-end" data-rl="' + li + '" data-k="rl' + li + '" aria-pressed="' + (rsel === li) + '" aria-label="' + esc(lab) + '">' + esc(w.core) + "</button>" + esc(w.trail) + (after ? " " + esc(after) : "") +
        '</span><span class="rf-let' + (lt[li] ? "" : " none") + '" aria-hidden="true">' + (lt[li] || "·") + "</span></div>";
      if (rsel === li) h += '<div class="rf-pick" role="group" aria-label="Rhyme letter for line ' + (li + 1) + '">' + LET.map(function(L){ return '<button type="button" class="chip' + (lt[li] === L ? " on" : "") + '" aria-pressed="' + (lt[li] === L) + '" data-rlet="' + L + '" data-k="rlet' + L + '">' + L + "</button>"; }).join("") +
        '<button type="button" class="chip" data-rlet="" data-k="rletx">Clear</button><button type="button" class="chip rf-turnb' + (turn === li ? " on" : "") + '" aria-pressed="' + (turn === li) + '" data-rturn="' + li + '" data-k="rturn">Turn</button></div>';
    });
    MV.keepFocus($("#rf-poem"), function(){ $("#rf-poem").innerHTML = h + "</div>"; });
    var T = C.tone, te = $("#rf-tone");
    if (p.id === T.poem && turn === T.at - 1) te.innerHTML = '<div class="rf-tone' + (fx.tone ? " go" : "") + '" role="img" aria-label="Tone strip: lines 1 to ' + (T.at - 1) + " " + T.from + ", lines " + T.at + " to " + p.L.length + " " + T.to + '"><span class="rf-tone-a" style="flex:' + (T.at - 1) + '">Lines 1–' + (T.at - 1) + ": " + T.from + '</span><span class="rf-tone-b" style="flex:' + (p.L.length - T.at + 1) + '">Lines ' + T.at + "–" + p.L.length + ": " + T.to + "</span></div>";
    else te.innerHTML = "";
    formRG.set(S.form[p.id] || "");
  }
  $("#rf-poem").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    var p = poem(), lt = lets(p.id);
    if (b.dataset.rl != null) { var li = +b.dataset.rl; rsel = rsel === li ? -1 : li; fx = {}; paintRhyme(); var nb = $('[data-k="rl' + li + '"]'); if (nb) nb.focus(); return; }
    if (b.dataset.rlet != null) {
      var cl = rsel; if (cl < 0) return;
      if (b.dataset.rlet) lt[cl] = b.dataset.rlet; else delete lt[cl];
      if (b.dataset.rlet && cl + 1 < p.L.length) rsel = cl + 1;
      api.save(); paintRhyme(); paintRead(); MV.changed();
      var f = $('[data-k="rl' + (b.dataset.rlet ? rsel : cl) + '"]'); if (f) f.focus();
      return;
    }
    if (b.dataset.rturn != null) { var t = +b.dataset.rturn; S.turn[p.id] = turnOf(p.id) === t ? -1 : t; fx = {}; api.save(); paintRhyme(); paintRead(); MV.changed(); }
  });

  // ----- Line-break lab -----
  function words(id){ return SEN[id].text.split(" "); }
  function brk(id){ return S.br[id] || (S.br[id] = []); }
  function bare(w){ return String(w).toLowerCase().replace(/[^a-z’']/g, ""); }
  function lbLines(id){ var W = words(id), B = brk(id), out = [], cur = []; W.forEach(function(_, i){ cur.push(i); if (B.indexOf(i) >= 0 && i < W.length - 1) { out.push(cur); cur = []; } }); out.push(cur); return out; }
  var lbPos = 0;
  function paintLB(){
    var id = S.lb, W = words(id), lines = lbLines(id), weak = C.lb.weak, h = '<div class="lb" role="group" aria-label="The sentence, line by line">';
    lines.forEach(function(ln, k){
      var lastI = ln[ln.length - 1], end = bare(W[lastI]), isWeak = weak.indexOf(end) >= 0, glow = fx.glow === lastI;
      h += '<div class="lb-line"><span class="lb-n" aria-hidden="true">' + (k + 1) + '</span><span class="lb-t">';
      ln.forEach(function(i, j){
        var last = j === ln.length - 1;
        h += '<span class="lb-w' + (last ? " an an-syntax lb-end" + (isWeak ? " lb-weak" : "") + (glow ? " lb-glow" : "") : "") + '">' + esc(W[i]) + "</span>";
        if (last) h += '<span class="an-tag an-syntax">' + (isWeak ? "weak end" : "line end") + "</span>";
        if (i < W.length - 1) h += '<button type="button" class="lb-gap' + (last ? " on" : "") + '" data-gi="' + i + '" data-k="gap' + i + '" tabindex="' + (i === lbPos ? 0 : -1) + '" aria-pressed="' + last + '" aria-label="' + esc((last ? "Line break after “" : "Break the line after “") + W[i] + "”") + '">' + (last ? "↵" : "") + "</button>";
      });
      h += "</span></div>";
    });
    MV.keepFocus($("#lb-box"), function(){ $("#lb-box").innerHTML = h + "</div>"; });
  }
  $("#lb-box").addEventListener("click", function(e){
    var b = e.target.closest("[data-gi]"); if (!b) return;
    stopPlay(); var i = +b.dataset.gi, B = brk(S.lb), k = B.indexOf(i); lbPos = i;
    if (k < 0) B.push(i); else B.splice(k, 1); B.sort(num); fx = {}; api.save(); paintLB(); paintRead(); MV.changed();
  });
  $("#lb-box").addEventListener("keydown", function(e){
    var b = e.target.closest("[data-gi]"); if (!b) return;
    var i = +b.dataset.gi, n = words(S.lb).length - 1, k = e.key, j = k === "ArrowRight" ? i + 1 : k === "ArrowLeft" ? i - 1 : k === "Home" ? 0 : k === "End" ? n - 1 : null;
    if (j == null) return; e.preventDefault(); j = Math.max(0, Math.min(n - 1, j)); lbPos = j;
    $$("[data-gi]", $("#lb-box")).forEach(function(x){ x.tabIndex = +x.dataset.gi === j ? 0 : -1; });
    var nb = $('#lb-box [data-gi="' + j + '"]'); if (nb) nb.focus();
  });
  function playLB(done){
    if (speaking && !done) { stopPlay(); return; }
    var W = words(S.lb), lines = lbLines(S.lb), me = ++PB.run; MV.eng.stop();
    if (!VOICE) { if (done) MV.wait(1400, done); return; }
    speaking = true; voiceUI(); var k = 0;
    var finish = function(){ speaking = false; voiceUI(); if (done) { var d = done; done = null; d(); } };
    var safety = setTimeout(finish, 20000);
    (function one(){
      if (me !== PB.run || k >= lines.length) { clearTimeout(safety); finish(); return; }
      var text = lines[k].map(function(i){ return W[i]; }).join(" "); k++;
      MV.eng.say(text, { voice:VOICE, rate:S.speed, onEnd:function(){ if (me !== PB.run) { clearTimeout(safety); finish(); return; } setTimeout(one, 550); } });
    })();
  }

  // ----- Device lens -----
  function resolve(p){
    if (p._dev) return p._dev;
    var toks = MV.eng.tokenize(p.L.map(function(P){ return P.text; }), { breaks:true }), by = {};
    toks.forEach(function(t, i){ if (!t.br) (by[t.line] = by[t.line] || []).push(i); });
    p._toks = toks;
    p._dev = p.dev.map(function(d, k){
      var w = [];
      d.at.forEach(function(a){
        var idx = by[a[0]] || [], want = a[1].split(/\s+/).map(MV.eng.norm);
        for (var s = 0; s + want.length <= idx.length; s++) {
          var hit = want.every(function(x, j){ return MV.eng.norm(toks[idx[s + j]].t) === x && w.indexOf(idx[s + j]) < 0; });
          if (hit) { want.forEach(function(_, j){ w.push(idx[s + j]); }); return; }
        }
        console.warn("device phrase not found", p.id, a);
      });
      return { id:p.id + "d" + k, lens:d.lens, w:w, label:d.label || d.at.map(function(x){ return x[1]; }).join(" … "), tag:d.tag, note:d.note };
    });
    return p._dev;
  }
  function lensFocus(p){ var v = resolve(p).filter(function(d){ return S.lens[d.lens]; }), f = S.focus[p.id]; return v.filter(function(d){ return d.id === f; })[0] || v[0] || null; }
  function paintLens(){
    var p = poem(), el = $("#rp-lenses");
    MV.keepFocus(el, function(){ el.innerHTML = LZ.map(function(l){ var on = !!S.lens[l.id]; return '<button type="button" class="an-chip an-' + l.role + '" data-lens="' + l.id + '" data-k="lz' + l.id + '" aria-pressed="' + on + '"><i class="an-dot" aria-hidden="true"></i>' + l.label + "</button>"; }).join(""); });
    resolve(p);
    lens.show({ toks:p._toks, devices:p._dev, on:S.lens, focus:(lensFocus(p) || {}).id, onFocus:function(id){ S.focus[p.id] = id; api.save(); paintLens(); paintRead(); } });
  }
  $("#rp-lenses").addEventListener("click", function(e){ var b = e.target.closest("[data-lens]"); if (!b) return; S.lens[b.dataset.lens] = !S.lens[b.dataset.lens]; api.save(); paintLens(); paintRead(); });

  // ----- readout -----
  function paintRead(){
    var p = poem(), rows = [];
    if (S.mode === "scan") {
      var li = curLine(), P = p.L[li], m = marks(p.id, li), M = SC.metre(P, m);
      rows.push(["Line", (li + 1) + ": “" + esc(P.text) + "”"], ["Syllables in this line", P.n], ["Stresses you marked", m.length + (m.length ? " (stresses on syllables " + listAnd(m.map(String)) + ")" : "")], ["Metre", M.text], ["Variation spotted", M.varText]);
    } else if (S.mode === "rhyme") {
      var t = turnOf(p.id), g = guess(p.id), done = Object.keys(lets(p.id)).length;
      rows.push(["Rhyme scheme so far", '<span class="rp-mono">' + schemeSoFar(p) + "</span>"], ["Form guess", g || "Shown when every line is lettered (" + done + " of " + p.L.length + ")"],
        ["Turn", t >= 0 ? "Line " + (t + 1) + " (“" + esc(p.L[t].text.split(" ").slice(0, 4).join(" ")) + "…”)" : "Not marked yet"],
        ["Form you chose", (C.forms.filter(function(f){ return f.id === S.form[p.id]; })[0] || { t:"not chosen yet" }).t]);
    } else if (S.mode === "breaks") {
      var W = words(S.lb), lines = lbLines(S.lb), weak = C.lb.weak;
      rows.push(["Lines", lines.length], ["Lines end on", lines.map(function(l){ var w = W[l[l.length - 1]], b = bare(w); return weak.indexOf(b) >= 0 ? '<span class="lb-weakr">' + esc(b) + " (weak)</span>" : esc(b); }).join(" · ")],
        ["Words per line", lines.map(function(l){ return l.length; }).join(" · ")]);
    } else {
      var vis = resolve(p).filter(function(d){ return S.lens[d.lens]; }), cnt = LZ.filter(function(l){ return S.lens[l.id]; }).map(function(l){ return l.label + " " + vis.filter(function(d){ return d.lens === l.id; }).length; });
      var d = lensFocus(p);
      rows.push(["Devices revealed", cnt.length ? cnt.join(" · ") : "none yet: switch on a lens"]);
      if (d) rows.push(["Device", "“" + d.label + "”: " + d.tag], ["What it does", d.note]);
    }
    $("#rp-read").innerHTML = MV.readoutHTML(rows);
  }

  function paint(){
    poemRG.set(S.mode === "breaks" ? "lb" : S.poem); modeRG.set(S.mode);
    ["scan", "rhyme", "breaks", "lens"].forEach(function(m){ $("#rp-" + m).hidden = S.mode !== m; });
    var p = poem();
    $("#rp-cite").innerHTML = S.mode === "breaks" ? C.lb.cite : p.cite + (p.note && S.mode === "scan" ? '<span class="rp-note">' + p.note + "</span>" : "");
    if (S.mode === "scan") paintScan(); else if (S.mode === "rhyme") paintRhyme(); else if (S.mode === "breaks") paintLB(); else paintLens();
    voiceUI(); paintRead(); MV.changed();
  }
  function choosePoem(id){
    stopPlay(); speaking = false; fx = {};
    if (id === "lb") { setMode("breaks"); return; }
    S.poem = id; rsel = -1; S.cmp = ""; if (S.mode === "breaks") S.mode = "scan"; api.save(); paint();
  }
  function setMode(v){ stopPlay(); speaking = false; S.mode = v; fx = {}; rsel = -1; if (v !== "scan") S.cmp = ""; api.save(); paint(); }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.id === "rp-play") { playLine(); return; }
    if (b.id === "rp-emph") { S.emph = !S.emph; api.save(); voiceUI(); return; }
    if (b.id === "lb-play") { playLB(); return; }
    if (b.id === "cmp-x") { stopPlay(); S.cmp = ""; api.save(); paintCmp(); return; }
    if (b.id === "rp-chkline") { var p = poem(), li = curLine(); chk[p.id + ":" + li] = lineCheck(p, li); paintLchk(); MV.focusFb($("#rp-lchk")); }
  });
  $("#rp-speed").addEventListener("input", function(e){ S.speed = Math.round(+e.target.value * 10) / 10; $("#rp-spdv").textContent = S.speed.toFixed(1) + "×"; api.save(); });
  // "Set it up" buttons in the challenge prompts
  document.addEventListener("click", function(e){
    var b = e.target.closest("[data-setup]"); if (!b) return;
    var id = b.dataset.setup; stopPlay(); speaking = false; fx = {}; rsel = -1;
    if (id === "tc1") { S.poem = "s73"; S.mode = "scan"; S.cmp = ""; S.cur.s73 = 0; }
    else if (id === "tc2") { S.poem = "s73"; S.mode = "rhyme"; S.cmp = ""; rsel = lets("s73")[0] ? -1 : 0; }
    else if (id === "tc3") { S.mode = "breaks"; S.lb = "map"; lbRG.set("map"); }
    api.save(); paint();
    $("#ex-app").scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
    var f = id === "tc1" ? $('#rp-tap [data-li="0"][tabindex="0"]') : id === "tc2" ? $('#rf-poem [data-k="rl0"]') : $("#lb-box [data-gi][tabindex='0']");
    if (f) f.focus({ preventScroll:true });
  });
  voiceReady(function(){ voiceUI(); });

  // ---------- target challenges ----------
  function tc1(){
    var c = C.challenges[0].msgs, m = (S.marks.s73 || {})[0] || [], key = KEY["s73:0"];
    if (!m.length) return { ok:false, msg:c.none };
    if (m.length >= PO.s73.L[0].n) return { ok:false, msg:c.all };
    if (m.some(function(i){ return key.never.indexOf(i) >= 0; })) return { ok:false, msg:c.odd };
    if (key.req.some(function(i){ return m.indexOf(i) < 0; })) return { ok:false, msg:c.few };
    return { ok:true };
  }
  function tc2(){
    var c = C.challenges[1].msgs, lt = lets("s73"), s = letString("s73");
    if (!s) return { ok:false, msg:c.unlettered };
    if ([4, 5, 6, 7].some(function(i){ return [0, 1, 2, 3].some(function(j){ return lt[i] === lt[j]; }); })) return { ok:false, msg:c.reuse };
    if (lt[9] !== lt[11]) return { ok:false, msg:c.lieby };
    if (pattern(s) !== "ababcdcdefefgg") return { ok:false, msg:c.pattern };
    if (S.form.s73 === "petrarchan") return { ok:false, msg:c.petrarchan };
    if (S.form.s73 !== "shakespearean") return { ok:false, msg:c.form };
    return { ok:true };
  }
  function tc3(){
    var c = C.challenges[2].msgs, W = words("map"), lines = lbLines("map"), ends = lines.map(function(l){ return bare(W[l[l.length - 1]]); });
    if (ends.some(function(e){ return C.lb.weak.indexOf(e) >= 0; })) return { ok:false, msg:c.weak };
    if (lines.length !== 4) return { ok:false, msg:c.count };
    if (ends.indexOf("never") < 0) return { ok:false, msg:c.never };
    var last = lines[3].length; if (lines.slice(0, 3).some(function(l){ return l.length <= last; })) return { ok:false, msg:c.last };
    return { ok:true };
  }

  paint();
  EX = { stop:function(){ stopPlay(); speaking = false; } };
  return {
    predict:{
      start:function(p){
        stopPlay(); speaking = false; fx = {}; rsel = -1; cmpFx = { shown:{} };
        if (p.id === "p1") { S.poem = "s73"; S.mode = "scan"; S.cmp = "p1"; }
        else if (p.id === "p2") { S.mode = "breaks"; S.lb = "letter"; S.br.letter = []; lbRG.set("letter"); }
        else if (p.id === "p3") { S.poem = "rem"; S.mode = "rhyme"; S.cmp = ""; var lt = {}; p.letters.split("").forEach(function(L, i){ lt[i] = L; }); S.let.rem = lt; S.turn.rem = -1; }
        else if (p.id === "p4") { S.poem = "s73"; S.mode = "scan"; S.cmp = "p4a"; }
        api.save(); paint();
      },
      run:function(p, done){
        if (p.id === "p1" || p.id === "p4") {
          if (p.id === "p4") { S.cmp = "p4"; api.save(); paintCmp(); }
          playCmp(function(){ cmpFx.shown = { 0:true, 1:true }; paintCmp(); done(); });
          return;
        }
        if (p.id === "p2") {
          var W = words("letter"), ni = W.indexOf("never"); S.br.letter = [ni]; fx = { glow:ni }; api.save(); paintLB(); paintRead(); MV.changed();
          if (VOICE) playLB(done); else MV.wait(1500, done);
          return;
        }
        if (p.id === "p3") { S.turn.rem = 8; fx = { hinge:true, tone:true }; api.save(); paintRhyme(); paintRead(); MV.changed(); MV.wait(1800, done); return; }
        done();
      }
    },
    challenge:function(id){ return id === "tc1" ? tc1() : id === "tc2" ? tc2() : id === "tc3" ? tc3() : { ok:false }; }
  };
}

// ---------- Part 3: Form makes meaning (four stations on Sonnet 73) ----------
var PICS = {
  tree:'<svg viewBox="0 0 120 90" class="fm-pic" aria-hidden="true" focusable="false"><path class="fm-gr" d="M8 82H112"/><path class="fm-st" d="M60 82V46M60 58L40 38M60 52L82 30M40 38L30 30M40 38L42 24M82 30L94 26M82 30L80 18M60 46L62 30"/><circle class="fm-lf" cx="29" cy="29" r="3"/><circle class="fm-lf" cx="95" cy="25" r="3"/><circle class="fm-lf" cx="70" cy="72" r="2.5"/><circle class="fm-lf" cx="48" cy="78" r="2.5"/></svg>',
  dusk:'<svg viewBox="0 0 120 90" class="fm-pic" aria-hidden="true" focusable="false"><rect class="fm-sky2" x="0" y="0" width="120" height="30"/><rect class="fm-sky1" x="0" y="30" width="120" height="30"/><path class="fm-sun" d="M42 62A18 18 0 0 1 78 62Z"/><path class="fm-gr" d="M4 62H116"/><path class="fm-st" d="M60 36V30M44 42L40 38M76 42L80 38"/></svg>',
  fire:'<svg viewBox="0 0 120 90" class="fm-pic" aria-hidden="true" focusable="false"><path class="fm-gr" d="M8 82H112"/><path class="fm-ash" d="M26 82Q60 64 94 82Z"/><path class="fm-st" d="M34 78L86 70M36 70L84 79"/><path class="fm-fl" d="M60 70Q52 60 58 50Q60 58 64 56Q62 64 60 70Z"/><circle class="fm-em" cx="48" cy="74" r="2.4"/><circle class="fm-em" cx="72" cy="73" r="2.4"/><circle class="fm-em" cx="60" cy="77" r="2"/></svg>'
};
function part3(host, api){
  var F = api.content.form, S = api.S, L = MV.C.explore.poems[0].lines.map(function(l){ return l.replace(/·/g, ""); }), s1 = F.st1, s2 = F.st2, s3 = F.st3, s4 = F.st4, R = {};
  s1.ribbons.forEach(function(r){ R[r.id] = r; });
  S.rib = Array.isArray(S.rib) && S.rib.length === 3 ? S.rib : s1.start.slice(); S.door = S.door || {}; S.q4 = S.q4 || {};
  function ribHTML(r){ return '<span class="fm-rib fm-rib-' + r.id + '"><span class="fm-rib-t">' + r.t + '</span><span class="fm-rib-bar">' + r.ticks.map(function(t){ return "<span>" + t + "</span>"; }).join("") + "</span></span>"; }
  host.innerHTML = '<div class="fm">' +
    '<section class="fm-sec" aria-labelledby="fm-h1"><h3 id="fm-h1">' + s1.title + '</h3><p class="how">' + s1.how + '</p><div class="fm-panels">' + s1.panels.map(function(p){
      return '<figure class="fm-panel">' + PICS[p.pic] + '<figcaption><strong>Quatrain ' + p.q + "</strong> (lines " + p.from + "–" + p.to + "): " + p.name + '</figcaption><div class="fm-q">' + L.slice(p.from - 1, p.to).map(function(l){ return "<span>" + esc(l) + "</span>"; }).join("") + '</div><div class="fm-slot" id="fm-slot' + p.q + '"></div></figure>';
    }).join("") + '</div><div id="fm-ribs"></div><div id="fm-cap" aria-live="polite"></div></section>' +
    '<section class="fm-sec" aria-labelledby="fm-h2"><h3 id="fm-h2">' + s2.title + '</h3><p class="how">' + s2.how + '</p><div id="fm-door"></div><div id="fm-door-fb" aria-live="polite"></div></section>' +
    '<section class="fm-sec" aria-labelledby="fm-h3"><h3 id="fm-h3">' + s3.title + '</h3><p class="how">' + s3.how + '</p><div id="fm-pro"></div><div id="fm-turn"></div><div id="fm-turn-fb" aria-live="polite"></div>' +
      '<details class="alg fm-craft" id="fm-craft" hidden><summary>Check it with the craft</summary><div class="an-note an-theme">' + s3.craft + "</div></details></section>" +
    '<section class="fm-sec" aria-labelledby="fm-h4"><h3 id="fm-h4">' + s4.title + '</h3><p class="fm-l12"><span class="fm-ln12">' + s4.line + '</span><mark class="an an-figure fm-glow">' + esc(L[s4.line - 1]) + '</mark><span class="an-tag an-figure">Figure · paradox</span></p><p>' + s4.text + '</p><p class="q-prompt"><strong>' + s4.prompt + '</strong></p><div id="fm-q4"></div></section></div>';

  // station 1: order the ribbons
  function solved1(){ return S.rib.join() === s1.order.join(); }
  function paint1(anim){
    var done = solved1();
    MV.keepFocus($("#fm-ribs"), function(){
      $("#fm-ribs").innerHTML = done ? "" : '<h4 class="fm-h4">Time ribbons: longest span at the top</h4><ol class="fm-ribs">' + S.rib.map(function(id, i){
        return '<li><span class="fm-rn">' + (i + 1) + ".</span>" + ribHTML(R[id]) + '<span class="fm-mv"><button type="button" class="btn ghost sm" data-rmv="up" data-ri="' + i + '" data-k="rup' + id + '"' + (i === 0 ? " disabled" : "") + ' aria-label="Move “' + esc(MV.plain(R[id].t)) + '” up">Move up</button><button type="button" class="btn ghost sm" data-rmv="down" data-ri="' + i + '" data-k="rdn' + id + '"' + (i === 2 ? " disabled" : "") + ' aria-label="Move “' + esc(MV.plain(R[id].t)) + '” down">Move down</button></span></li>';
      }).join("") + "</ol>";
    });
    s1.panels.forEach(function(p, i){ var el = $("#fm-slot" + p.q); el.innerHTML = done ? ribHTML(R[s1.order[i]]) : ""; el.classList.toggle("fm-in", !!anim && !MV.reduceMotion); });
    $("#fm-cap").innerHTML = done ? '<p class="an-note an-theme fm-capn"><span class="an-tag an-theme">Theme</span>' + s1.caption + "</p>" : "";
  }
  $("#fm-ribs").addEventListener("click", function(e){
    var b = e.target.closest("[data-rmv]"); if (!b || b.disabled) return;
    var i = +b.dataset.ri, j = b.dataset.rmv === "up" ? i - 1 : i + 1, t = S.rib[i]; S.rib[i] = S.rib[j]; S.rib[j] = t; api.save();
    var was = solved1(); paint1(was);
    if (was) { $("#fm-cap").setAttribute("tabindex", "-1"); $("#fm-cap").focus({ preventScroll:true }); return; }
    var nb = $('#fm-ribs [data-k="' + (b.dataset.rmv === "up" ? "rup" : "rdn") + t + '"]'); if (nb && !nb.disabled) nb.focus(); else { nb = $('#fm-ribs [data-k="' + (b.dataset.rmv === "up" ? "rdn" : "rup") + t + '"]'); if (nb) nb.focus(); }
  });

  // station 2: the repeated door
  var FIND = {}; s2.find.forEach(function(f){ FIND[f.line] = f.phrase; });
  var doorMsg = null;
  function paint2(){
    var all = s2.find.every(function(f){ return S.door[f.line]; });
    MV.keepFocus($("#fm-door"), function(){
      $("#fm-door").innerHTML = '<ol class="fm-lines">' + L.map(function(l, i){
        var n = i + 1, f = S.door[n] && FIND[n], txt = esc(l);
        if (f) { var at = l.indexOf(f); txt = esc(l.slice(0, at)) + '<mark class="an an-syntax">' + esc(f) + '</mark><span class="an-tag an-syntax">Repetition</span>' + esc(l.slice(at + f.length)); }
        return '<li><button type="button" class="fm-ln" data-ln="' + n + '" data-k="dl' + n + '" aria-pressed="' + !!S.door[n] + '"' + (all ? " disabled" : "") + '><span class="fm-n">' + n + "</span><span>" + txt + "</span></button></li>";
      }).join("") + "</ol>";
    });
    $("#fm-door-fb").innerHTML = all ? '<p class="an-note an-theme"><span class="an-tag an-theme">Craft note</span>' + s2.note + "</p>" : doorMsg ? MV.fbHTML(doorMsg.good ? "good" : "bad", doorMsg.html) : "";
  }
  $("#fm-door").addEventListener("click", function(e){
    var b = e.target.closest("[data-ln]"); if (!b || b.disabled) return;
    var n = +b.dataset.ln;
    if (FIND[n]) { S.door[n] = 1; var left = s2.find.filter(function(f){ return !S.door[f.line]; }).length; doorMsg = { good:true, html:"<strong>✓ Line " + n + ".</strong> " + (left ? left + " more to find." : "") }; }
    else doorMsg = { good:false, html:"<strong>✗ Not that one.</strong> " + s2.wrong };
    api.save(); paint2(); MV.focusFb($("#fm-door-fb"));
  });

  // station 3: pronoun tracker and the turn
  function count(re, a, b){ var c = 0; L.slice(a - 1, b).forEach(function(l){ c += (l.match(re) || []).length; }); return c; }
  var turnMsg = null;
  function paint3(){
    var max = 3;
    $("#fm-pro").innerHTML = '<div class="tbl-wrap"><table class="topic-tbl fm-pt"><caption class="vh">Pronoun tracker for Sonnet 73</caption><thead><tr><th scope="col">Part</th><th scope="col">“me”</th><th scope="col">“thou”, “thy”</th></tr></thead><tbody>' + s3.parts.map(function(p){
      var me = count(/\bme\b/gi, p.from, p.to), th = count(/\b(thou|thy|thee)\b/gi, p.from, p.to);
      var bar = function(v, cls){ return '<span class="fm-bar ' + cls + '" style="width:' + (v / max * 4) + 'em" aria-hidden="true"></span> ' + v; };
      return "<tr><th scope=\"row\">" + p.t + " <span class=\"tiny muted\">(lines " + p.from + "–" + p.to + ")</span></th><td>" + bar(me, "fm-me") + "</td><td>" + bar(th, "fm-th") + "</td></tr>";
    }).join("") + "</tbody></table></div>";
    var got = S.turn3 === s3.turn;
    MV.keepFocus($("#fm-turn"), function(){
      $("#fm-turn").innerHTML = '<p class="tiny muted" style="margin:10px 0 6px">Lines 9–14: tap the turn line.</p><ol class="fm-lines">' + s3.choose.map(function(n){
        return '<li><button type="button" class="fm-ln' + (got && n === s3.turn ? " fm-turned" : "") + '" data-tl="' + n + '" data-k="tl' + n + '" aria-pressed="' + (S.turn3 === n) + '"' + (got ? " disabled" : "") + '><span class="fm-n">' + n + "</span><span>" + esc(L[n - 1]) + (got && n === s3.turn ? ' <span class="an-tag an-syntax">Turn</span>' : "") + "</span></button></li>";
      }).join("") + "</ol>";
    });
    $("#fm-turn-fb").innerHTML = got ? MV.fbHTML("good", "<strong>✓ " + s3.found + "</strong>") : turnMsg ? MV.fbHTML("bad", "<strong>✗ Not yet.</strong> " + turnMsg) : "";
    var cr = $("#fm-craft"); if (got && cr.hidden) { cr.hidden = false; cr.open = true; }
  }
  $("#fm-turn").addEventListener("click", function(e){
    var b = e.target.closest("[data-tl]"); if (!b || b.disabled) return;
    var n = +b.dataset.tl; S.turn3 = n; turnMsg = n === s3.turn ? null : s3.wrong; api.save(); paint3(); MV.focusFb($("#fm-turn-fb"));
  });

  // station 4: the paradox
  var ord4 = MV.shuffle(s4.options.map(function(_, i){ return i; }), "fm4"), ri4 = MV.right(s4.options);
  function paint4(){
    var q = S.q4, done = q.pick === ri4;
    MV.keepFocus($("#fm-q4"), function(){
      $("#fm-q4").innerHTML = '<div class="opts">' + ord4.map(function(i){ var o = s4.options[i], c = "opt" + (q.pick === i ? (i === ri4 ? " right" : " wrong") : ""); return '<button type="button" class="' + c + '" data-o4="' + i + '" data-k="o4' + i + '"' + (done ? " disabled" : "") + "><span>" + o.t + "</span></button>"; }).join("") + "</div>" +
        (q.pick != null ? MV.fbHTML(done ? "good" : "bad", (done ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + s4.options[q.pick].why + (done ? "" : " Try again.")) : "");
    });
  }
  $("#fm-q4").addEventListener("click", function(e){ var b = e.target.closest("[data-o4]"); if (!b || b.disabled) return; S.q4.pick = +b.dataset.o4; api.save(); paint4(); MV.focusFb($("#fm-q4")); });

  paint1(false); paint2(); paint3(); paint4();
  // Sentence to steal: save the imitation to the commonplace book on request
  var steal = $('.mv-block[data-block="steal"]');
  if (steal) {
    var row = document.createElement("div"); row.className = "q-actions";
    row.innerHTML = '<button type="button" class="btn ghost sm" id="steal-save">Save my imitation to my commonplace book</button><span class="tiny muted" id="steal-st" aria-live="polite"></span>';
    steal.appendChild(row);
    row.addEventListener("click", function(e){
      if (e.target.id !== "steal-save") return;
      var t = (MV.S.writes.steal || "").trim();
      $("#steal-st").textContent = t ? (MV.eng.saveLine(t, "My imitation of Shakespeare, Sonnet 73, line 12") ? "Saved to your commonplace book." : "") : "Write your imitation first.";
    });
  }
}

// ---------- Practice 1: Sound sort (the toolkit's K12 sorter) with a "So what?" follow-up after sorting ----------
function soundSort(host, api, a){
  host.innerHTML = '<div class="ss-main"></div><div class="ss-so"></div>';
  a.items.forEach(function(it){ var w = {}; if (it.wrongAll) a.boxes.forEach(function(bx){ w[bx.id] = a.msgs[it.wrongAll]; }); Object.keys(it.wrong || {}).forEach(function(k){ w[k] = a.msgs[it.wrong[k]]; }); it.wrong = w; });
  var r = MV.activityTypes.sorter($(".ss-main", host), a), so = $(".ss-so", host), W = a.soWhat, B = api.S, ord = {};
  B.so = B.so || {};
  W.items.forEach(function(it){ ord[it.id] = MV.shuffle(it.options.map(function(_, i){ return i; }), "so" + it.id); });
  function paint(){
    var s = r.stats(); if (s.done < s.total) { so.innerHTML = ""; return; }
    MV.keepFocus(so, function(){
      so.innerHTML = '<div class="ss-sw"><h4>' + W.title + '</h4><p class="tiny muted">' + W.intro + "</p>" + W.items.map(function(it){
        var pick = B.so[it.id], good = pick != null && MV.ok(it.options[pick]);
        return '<div class="ss-q"><p class="ss-l">' + it.line + '</p><div class="opts" role="group" aria-label="Effects">' + ord[it.id].map(function(oi){
          var on = pick === oi; return '<button type="button" class="opt' + (on ? (good ? " right" : " wrong") : "") + '" data-so="' + it.id + '" data-oi="' + oi + '" data-k="so' + it.id + oi + '" aria-pressed="' + on + '"><span>' + it.options[oi].t + "</span></button>";
        }).join("") + "</div>" + (pick != null ? MV.fbHTML(good ? "good" : "bad", (good ? "✓ " : "") + (good ? W.good : W.bad)) : "") + "</div>";
      }).join("") + "</div>";
    });
  }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-so]"); if (b) { B.so[b.dataset.so] = +b.dataset.oi; api.save(); } paint(); });
  paint();
  return r;
}

// ---------- Practice 2: unseen poem, "The Eagle" (E3 tapper, chips, letter chips, select-two) ----------
function unseen(host, api, a){
  var B = api.S; B.it = B.it || {};
  function st(id){ return B.it[id] || (B.it[id] = { tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = (a.how ? '<p class="how">' + a.how + "</p>" : "") + '<div class="un-pass"></div><div class="rp-ctl"><button type="button" class="btn sm" id="un-play" hidden>Read the poem aloud</button><span class="tiny muted rp-vnote" id="un-vnote" hidden>' + MV.C.explore.voiceNote + '</span></div>' +
    a.items.map(function(it){ return '<div class="q un-q" data-ui="' + it.id + '"></div>'; }).join("");
  MV.eng.passage($(".un-pass", host), a.poem, { cite:a.cite });
  var taps = {};
  function box(it){ return host.querySelector('[data-ui="' + it.id + '"]'); }
  function ctl(it){
    var x = st(it.id), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check answer</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + (it.why || ""));
    else if (x.msg) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + x.msg + " Try again.");
    return h;
  }
  function paint(it){
    var el = box(it), x = st(it.id), i = a.items.indexOf(it);
    if (it.kind === "mc") { MV.keepFocus(el, function(){ el.innerHTML = MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true }); }); return; }
    var head = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div></div>";
    if (it.kind === "tap") {
      if (!taps[it.id]) {
        el.innerHTML = head + '<div class="un-tap"></div><div class="un-ctl"></div>';
        x.marks = x.marks || [];
        var P = SC.parse(it.line);
        taps[it.id] = scansionTapper($(".un-tap", el), { lines:[P], nums:[1], get:function(){ return x.marks; }, feet:function(){ return x.solved ? SC.metre(P, x.marks).bars : []; },
          onToggle:function(li, n){ if (x.solved) return; var k = x.marks.indexOf(n); if (k < 0) x.marks.push(n); else x.marks.splice(k, 1); x.marks.sort(num); api.save(); } });
      }
      MV.keepFocus($(".un-ctl", el), function(){ $(".un-ctl", el).innerHTML = ctl(it); });
      return;
    }
    var body = "";
    if (it.kind === "letters") {
      x.lt = x.lt || {};
      body = '<div class="un-lets">' + it.ends.map(function(w, k){
        return '<div class="un-let" role="radiogroup" aria-label="Line ' + (k + 1) + " ends on " + w + '"><span class="un-lw">' + (k + 1) + ". " + w + "</span>" + "abcdef".split("").map(function(L){ var on = x.lt[k] === L; return '<button type="button" class="chip' + (on ? " on" : "") + '" role="radio" aria-checked="' + on + '" data-ul="' + k + '" data-lv="' + L + '" data-k="' + it.id + k + L + '"' + (x.solved ? " disabled" : "") + ">" + L + "</button>"; }).join("") + "</div>";
      }).join("") + "</div>";
    } else if (it.kind === "sa") {
      x.pick = x.pick || {};
      body = '<div class="opts" role="group" aria-label="Options (select two)">' + it.options.map(function(o, oi){
        var on = !!x.pick[oi], c = "opt sa-opt"; if (x.checked) { var g = MV.ok(o); if (on && g) c += " right"; else if (on && !g) c += " wrong"; }
        return '<button type="button" class="' + c + '" role="checkbox" aria-checked="' + on + '" data-sa="' + oi + '" data-k="' + it.id + "o" + oi + '"' + (x.solved ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + (on ? "☑" : "☐") + "</span><span>" + o.t + "</span></button>";
      }).join("") + "</div>";
    }
    MV.keepFocus(el, function(){ el.innerHTML = head + body + ctl(it); });
  }
  function judge(it){
    var x = st(it.id), ok = false, msg = "";
    if (it.kind === "tap") {
      var want = MV.ans(it); ok = x.marks.length === want.length && want.every(function(n){ return x.marks.indexOf(n) >= 0; });
      msg = x.marks.some(function(n){ return n === 1 || n === 3; }) ? it.light : it.general;
    } else if (it.kind === "letters") {
      var s = it.ends.map(function(_, k){ return x.lt[k] || ""; }).join("");
      if (s.length < it.ends.length) { x.msg = "Give every line ending a letter first."; return null; }
      var map = {}, nx = 0, q = ""; for (var i = 0; i < s.length; i++) { if (!(s[i] in map)) map[s[i]] = String.fromCharCode(97 + nx++); q += map[s[i]]; }
      ok = q === MV.ans(it); var w = (it.wrongs || []).filter(function(r){ return r.p === q; })[0]; msg = w ? w.fb : it.general;
    } else if (it.kind === "sa") {
      ok = it.options.every(function(o, oi){ return !!x.pick[oi] === MV.ok(o); }); x.checked = true;
      var bad = it.options.filter(function(o, oi){ return x.pick[oi] && !MV.ok(o); }).map(function(o){ return o.why; });
      msg = bad.length ? bad.join(" ") : "One more option belongs in your selection.";
    } else if (it.kind === "mc") { x.checked = true; ok = MV.ok(it.options[x.choice]); }
    if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; x.msg = null; } else { x.tries++; x.msg = msg; }
    return ok;
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.id === "un-play") {
      if (b.dataset.on) { MV.eng.stop(); return; }
      b.dataset.on = "1"; b.textContent = "Stop";
      MV.eng.say(a.poem.filter(Boolean).join(" "), { voice:VOICE, onEnd:function(){ delete b.dataset.on; b.textContent = "Read the poem aloud"; } });
      return;
    }
    var el = b.closest("[data-ui]"); if (!el) return;
    var it = a.items.filter(function(x){ return x.id === el.dataset.ui; })[0], x = st(it.id);
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (b.dataset.act === "check") { if (it.kind === "mc" && x.choice == null) return; judge(it); }
    else if (b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
    else if (b.dataset.ul != null) { x.lt[+b.dataset.ul] = b.dataset.lv; x.msg = null; }
    else if (b.dataset.sa != null) { var oi = +b.dataset.sa; x.pick[oi] = !x.pick[oi]; x.checked = false; x.msg = null; }
    else return;
    api.save(); paint(it);
    if (b.dataset.act === "check") MV.focusFb(box(it));
    else if (it.kind === "tap" && b.dataset.act === "hint") { var hb = box(it).querySelector('[data-k="' + it.id + 'hint"]'); if (hb && !hb.disabled) hb.focus(); }
  });
  a.items.forEach(paint);
  voiceReady(function(v){ $("#un-play", host).hidden = !v; $("#un-vnote", host).hidden = !!v; });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = st(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = st(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Practice 3: @component K13 spotProse — Spot the Error for a paragraph (copied from ENG4U 01; numbered sentences) ----------
// a: {id, student, how, summary, problems:[{id, goal, task, steps:[sentences], answer: index of first flawed sentence,
//      stepFb:[…], fixes:[{t, ok, why}], hints:[3]}]}
function spotProse(host, api, a){
  var B = api.S; B.p = B.p || {};
  function sst(id){ return B.p[id] || (B.p[id] = { stepTries:0, found:false, fixTries:0, fixed:false, hint:0 }); }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = a.problems.map(function(p, pi){
        var st = sst(p.id), err = MV.ans(p), h = '<div class="q' + (pi ? " part" : "") + '" data-sp="' + p.id + '" style="' + (pi < a.problems.length - 1 ? "" : "border-bottom:0") + '">';
        h += '<p class="task">Paragraph ' + (pi + 1) + ": " + p.task + '</p><p class="who">' + a.student + "’s paragraph</p><ol class=\"steps-list\">";
        p.steps.forEach(function(s, si){
          h += '<li><button type="button" class="sbtn' + (st.found && si === err ? " err" : "") + '" data-k="' + p.id + "s" + si + '" data-step="' + si + '"' + (st.found ? " disabled" : "") + '><span class="sn">Sentence ' + (si + 1) + "</span><span>" + s + (st.found && si === err ? '<span class="flag">First mistake</span>' : "") + "</span></button></li>";
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

// ---------- Performance task "The Turn": @component E17 poemEditor — one row per line, line tags (Turn, Enjambment),
// sound tags on word spans (MV.eng.tokens), a rhyme declaration; structure-only checks; the full poem goes into the summary ----------
// Re-anchor tags after the text under them changed (copied from ENG4U 01).
function reanchor(notes, toks){
  notes.forEach(function(n){
    var seq = n.words || [];
    if (seq.length && n.w.every(function(i, k){ return toks[i] && toks[i].t === seq[k]; })) { n.stale = false; return; }
    var off = n.w.map(function(i){ return i - n.w[0]; });
    for (var s = 0; s < toks.length; s++) if (off.every(function(d, k){ return toks[s + d] && toks[s + d].t === seq[k]; })) { n.w = off.map(function(d){ return s + d; }); n.stale = false; return; }
    n.stale = true;
  });
}
var task = (function(){
  var api = null, T = null, tk = null, sel = [], timer = null, rhRG = null;
  function explain(){ var e = $("#task-explain"); return e ? e.value : (MV.taskState().explain || ""); }
  function data(S){
    S = S || {}; var R = S.rows || [], lines = [], map = {}, enj = [];
    R.forEach(function(r, i){ var t = String(r || "").trim(); if (t) { map[i] = lines.length; lines.push(t); } });
    Object.keys(S.enj || {}).forEach(function(k){ if (S.enj[k] && map[k] != null) enj.push(map[k] + 1); }); enj.sort(num);
    return { rows:R, lines:lines, map:map, n:lines.length, turn:S.turn != null && map[S.turn] != null ? map[S.turn] + 1 : null, enj:enj,
      rhyme:S.rhyme || "", scheme:S.scheme || "", toks:MV.eng.tokenize(lines), tags:(S.tags || []).filter(function(t){ return !t.stale; }), explain:explain() };
  }
  function onset(w){ w = String(w).toLowerCase().replace(/^[^a-z]+/, ""); if (!w) return null; var d = w.match(/^(ch|sh|th)/); if (d) return d[1]; return /[aeiou]/.test(w[0]) ? null : w[0]; }
  function allit(t, toks){ var c = {}; return t.w.some(function(i){ var o = toks[i] && onset(toks[i].t); if (!o) return false; c[o] = (c[o] || 0) + 1; return c[o] >= 2; }); }
  function checks(d){
    var n = d.n;
    return [n >= 8 && n <= 14,
      d.turn != null && d.turn >= 5 && d.turn <= n - 1,
      d.enj.length >= 1 && d.enj.every(function(L){ return !/[.,;:!?\-–—]$/.test(d.lines[L - 1].replace(/[”"’')\]\s]+$/, "")); }),
      d.tags.length >= 2 && d.tags.filter(function(t){ return t.dev === "Alliteration"; }).every(function(t){ return allit(t, d.toks); }),
      d.rhyme === "free" || (d.rhyme === "scheme" && n > 0 && (d.scheme.match(/[a-z]/gi) || []).length === n),
      MV.eng.wordCount(d.explain) >= 40];
  }
  function spanText(toks, w){ return w.slice().sort(num).map(function(i){ return toks[i] ? toks[i].t : ""; }).join(" "); }
  function lineToks(d, L){ return d.toks.map(function(t, i){ return t.line === L ? i : -1; }).filter(function(i){ return i >= 0; }); }
  function marks(){
    var d = data(api.S), m = d.tags.map(function(t){ return { w:t.w, role:"sound", tag:"Sound · " + t.dev }; });
    if (d.turn) { var a = lineToks(d, d.turn - 1); if (a.length) m.push({ w:[a[0]], role:"theme", tag:"Turn" }); }
    d.enj.forEach(function(L){ var a = lineToks(d, L - 1); if (a.length) m.push({ w:[a[a.length - 1]], role:"syntax", tag:"Enjambment" }); });
    return m;
  }
  function paintRows(){
    var S = api.S, d = data(S);
    MV.keepFocus($("#pe-rows"), function(){
      $("#pe-rows").innerHTML = S.rows.map(function(r, i){
        var ln = d.map[i] != null ? d.map[i] + 1 : null;
        return '<li class="pe-row"><span class="pe-n" id="pe-n' + i + '" aria-hidden="true">' + (ln || "·") + '</span><input class="txtin pe-in" type="text" autocomplete="off" data-row="' + i + '" aria-label="Row ' + (i + 1) + '" value="' + esc(r) + '">' +
          '<span class="pe-tags"><button type="button" class="chip pe-tg' + (S.turn === i ? " on" : "") + '" data-turn="' + i + '" data-k="pt' + i + '" aria-pressed="' + (S.turn === i) + '" aria-label="Row ' + (i + 1) + ': Turn">Turn</button>' +
          '<button type="button" class="chip pe-tg' + (S.enj[i] ? " on" : "") + '" data-enj="' + i + '" data-k="pe' + i + '" aria-pressed="' + !!S.enj[i] + '" aria-label="Row ' + (i + 1) + ': Enjambment">Enjambment</button></span></li>';
      }).join("");
    });
    counts();
  }
  function counts(){
    var S = api.S, d = data(S);
    S.rows.forEach(function(_, i){ var el = $("#pe-n" + i); if (el) el.textContent = d.map[i] != null ? d.map[i] + 1 : "·"; });
    $("#pe-count").textContent = d.n + " line" + (d.n === 1 ? "" : "s") + " (8–14)" + (d.rhyme === "scheme" ? " · scheme letters: " + (d.scheme.match(/[a-z]/gi) || []).length : "");
  }
  function paintMenu(){
    var el = $("#pe-menu"), d = data(api.S);
    if (!sel.length) { el.innerHTML = '<p class="tiny muted" style="margin:0">Select words in your poem to tag a sound device.</p>'; return; }
    MV.keepFocus(el, function(){
      el.innerHTML = '<p class="e1-selp"><strong>Selected:</strong> “' + esc(spanText(d.toks, sel)) + '” <button type="button" class="btn ghost sm" data-pm="clear" data-k="pmclear">Clear selection</button></p><div class="e1-grp"><span class="an-tag an-sound">Sound</span>' +
        T.soundTags.map(function(s){ return '<button type="button" class="chip e1-dev an-sound" data-ptag="' + esc(s) + '" data-k="ptag' + s + '">' + s + "</button>"; }).join("") + "</div>";
    });
  }
  function paintList(){
    var S = api.S, d = data(S);
    MV.keepFocus($("#pe-list"), function(){
      $("#pe-list").innerHTML = '<h4 class="e1-h">Your sound tags</h4>' + (S.tags.length ? '<ul class="e1-ul">' + S.tags.map(function(t, k){
        return '<li class="an-note an-sound' + (t.stale ? " e1-stale" : "") + '"><span class="an-tag an-sound">Sound · ' + esc(t.dev) + "</span>“" + esc(t.stale ? (t.words || []).join(" ") : spanText(d.toks, t.w)) + "”" +
          (t.stale ? ' <span class="tiny muted">Your text changed here. Remove this tag and tag the words again.</span>' : "") + ' <button type="button" class="linkbtn" data-prm="' + k + '" data-k="prm' + k + '">Remove</button></li>';
      }).join("") + "</ul>" : '<p class="tiny muted" style="margin:0">None yet.</p>');
    });
  }
  function models(){
    var el = $("#pt-models"); if (!el) return;
    var ok = checks(data(api.S)).every(Boolean);
    el.innerHTML = ok ? '<div class="fb good"><p><strong>✓ ' + T.success + "</strong></p></div>" + T.models.map(function(m){
      return '<details class="alg pt-model"><summary>' + m.title + '</summary><div class="pt-mtext">' + m.text.map(function(l, i){ return '<p><span class="pt-ln">' + (i + 1) + "</span>" + l + "</p>"; }).join("") + "</div><p><strong>Tags:</strong> " + m.tags + "</p><p><strong>Craft statement (excerpt):</strong> " + m.craft + "</p></details>";
    }).join("") : "";
  }
  function changed(){ api.save(); api.update(); models(); }
  function retag(){ var S = api.S, d = data(S); reanchor(S.tags, d.toks); tk.setTokens(d.toks); sel = tk.get(); paintMenu(); paintList(); }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; var S = a.S;
      S.rows = Array.isArray(S.rows) && S.rows.length ? S.rows : ["", "", "", "", "", "", "", ""]; S.enj = S.enj || {}; S.tags = S.tags || []; if (S.turn == null) S.turn = null;
      inp.innerHTML = '<div class="pe"><p class="how">Write one line in each row; leave a row empty for a stanza break. Tag the line where your poem turns, and any line that runs on into the next (enjambment).</p><ol class="pe-rows" id="pe-rows" aria-label="Your poem, one line per row"></ol>' +
        '<div class="q-actions"><button type="button" class="btn ghost sm" id="pe-add">Add a row</button><button type="button" class="btn ghost sm" id="pe-rm">Remove the last row</button><span class="tiny muted" id="pe-count" aria-live="polite"></span></div>' +
        '<div id="pe-rhyme"></div><div class="pe-sch"><label for="pe-scheme">Your rhyme scheme, one letter per line (for example: abab cdcd ee)</label><input id="pe-scheme" class="txtin" type="text" autocomplete="off" spellcheck="false"></div></div>';
      pv.innerHTML = '<h4 style="margin-top:0">Tag your sound devices</h4><p class="tiny muted">Tap words in your poem (or use the arrow keys, Shift + arrows and Space), then choose a tag. For alliteration, select the words that share the starting sound.</p><div id="pe-tok" class="e1-toks"></div><div id="pe-menu" class="e1-menu"></div><div id="pe-list"></div><div id="pt-models"></div>';
      $("#pe-scheme").value = S.scheme || "";
      rhRG = radios($("#pe-rhyme"), { label:"Rhyme", cls:"chips", options:[{ id:"free", t:"Free verse" }, { id:"scheme", t:"Rhymed (type the scheme below)" }], value:S.rhyme || "", onChange:function(v){ S.rhyme = v; counts(); changed(); } });
      paintRows();
      var d = data(S); reanchor(S.tags, d.toks);
      tk = MV.eng.tokens($("#pe-tok"), d.toks, { label:"Your poem: tap words to select them", marks:marks, onChange:function(s){ sel = s; paintMenu(); }, onKey:function(k){ if (k === "t") { var b = $("#pe-menu [data-ptag]"); if (b) b.focus(); } } });
      paintMenu(); paintList();
      inp.addEventListener("input", function(e){
        var t = e.target;
        if (t.dataset.row != null) { S.rows[+t.dataset.row] = t.value; clearTimeout(timer); timer = setTimeout(retag, 350); counts(); changed(); }
        else if (t.id === "pe-scheme") { S.scheme = t.value; if (t.value.trim() && S.rhyme !== "scheme") { S.rhyme = "scheme"; rhRG.set("scheme"); } counts(); changed(); }
      });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b) return;
        if (b.dataset.turn != null) { var i = +b.dataset.turn; S.turn = S.turn === i ? null : i; }
        else if (b.dataset.enj != null) { var j = +b.dataset.enj; S.enj[j] = !S.enj[j]; }
        else if (b.id === "pe-add") { if (S.rows.length < 18) S.rows.push(""); }
        else if (b.id === "pe-rm") { if (S.rows.length > 1) { var r = S.rows.length - 1; S.rows.pop(); delete S.enj[r]; if (S.turn === r) S.turn = null; } }
        else return;
        paintRows(); tk.paint(); changed();
        if (b.id === "pe-add") { var ins = $$(".pe-in", inp); if (ins.length) ins[ins.length - 1].focus(); }
      });
      pv.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b) return;
        var d = data(S);
        if (b.dataset.pm === "clear") { tk.clear(); sel = []; paintMenu(); tk.focus(0); return; }
        if (b.dataset.ptag) { var w = sel.slice(); if (!w.length) return; S.tags.push({ w:w, words:w.map(function(i){ return d.toks[i].t; }), dev:b.dataset.ptag }); var last = w[w.length - 1]; tk.clear(); sel = []; tk.paint(); paintMenu(); paintList(); changed(); tk.focus(last); return; }
        if (b.dataset.prm != null) { S.tags.splice(+b.dataset.prm, 1); tk.paint(); paintList(); changed(); var nb = $("#pe-list [data-prm]"); if (nb) nb.focus(); else tk.focus(0); }
      });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ a.update(); models(); });
      models();
    },
    read:function(){ return data(api ? api.S : MV.taskState().app); },
    valid:function(d){ return d.n ? true : "Write your poem first: one line in each row."; },
    checks:checks,
    summary:function(ts){
      var S = ts.app || {}, d = data(S), ok = checks(d).every(Boolean), L = [];
      L.push((MV.C.task.summary || "The Turn") + ": " + (ok && ts.found && ts.found.length ? "submitted (" + d.n + " lines, turn at line " + d.turn + ")" : "not submitted yet"));
      L.push("  The poem:");
      if (d.n) (S.rows || []).forEach(function(r, i){ var t = String(r || "").trim(); L.push(t ? "    " + (d.map[i] + 1) + "  " + t : ""); });
      else L.push("    (not written yet)");
      var tags = [];
      if (d.turn) tags.push("Turn: line " + d.turn);
      if (d.enj.length) tags.push("Enjambment: line" + (d.enj.length > 1 ? "s " : " ") + listAnd(d.enj.map(String)));
      d.tags.forEach(function(t){ tags.push(t.dev + ": “" + spanText(d.toks, t.w) + "”"); });
      L.push("  Tags: " + (tags.length ? tags.join("; ") : "none"));
      L.push("  Rhyme declared: " + (d.rhyme === "free" ? "free verse" : d.rhyme === "scheme" ? (d.scheme.trim() || "(no scheme typed)") : "not declared"));
      return L;
    }
  };
})();

// ---------- Reflect extras (sample principles, trivium tag, commonplace book) and Final Check read-aloud ----------
function extras(){
  var R = MV.C.reflect, sheet = $("#art-sheet"), art = $("#art");
  if (sheet && art && R.artSamples && !$("#art-samples")) {
    var d = document.createElement("details"); d.id = "art-samples"; d.className = "alg art-samples";
    d.innerHTML = "<summary>See examples</summary><p class=\"tiny muted\">Two samples. Always write your own.</p>" + R.artSamples.map(function(s){ return '<p class="an-note an-theme"><strong>Principle:</strong> “' + s.p + "”<br><strong>Master’s example:</strong> “" + s.m + "”<br><strong>My imitation:</strong> “" + s.i + "”</p>"; }).join("");
    sheet.insertBefore(d, art);
  }
  MV.eng.triviumPicker();
  var cp = $("#cp-app"); if (cp) MV.eng.commonplace(cp, { lines:R.art.examples.map(MV.plain) });
}
var SAYING = null;
document.addEventListener("click", function(e){
  var b = e.target.closest(".rp-say"); if (!b) return;
  if (SAYING) { MV.eng.stop(); return; }
  var q = b.closest(".q-prompt") || b.parentNode, p = q && q.querySelector(".rp-qpass"); if (!p || !VOICE) return;
  SAYING = b.dataset.k;
  MV.eng.say(p.innerHTML.split(/<br\s*\/?>/i).map(MV.plain).join(" "), { voice:VOICE, onEnd:function(){ SAYING = null; } });
});
// Final Check passages that repeat an Explore poem are filled from it (the toolkit repaints questions on every click)
function fillPass(){
  $$(".rp-qpass[data-poem]").forEach(function(el){
    if (el.childNodes.length) return;
    var p = MV.C.explore.poems.filter(function(x){ return x.id === el.dataset.poem; })[0];
    if (p) el.innerHTML = p.lines.map(function(l){ return esc(l.replace(/·/g, "")); }).join("<br>");
  });
}

MV.module({
  hero:hero,
  explore:function(host, api){ var r = explore(host, api); try { extras(); var fq = $("#final-qs"); if (fq) new MutationObserver(fillPass).observe(fq, { childList:true, subtree:true }); } catch (e) { console.error(e); } return r; },
  part3:part3,
  activities:{ sort:soundSort, unseen:unseen, spot:spotProse },
  task:task,
  onShow:function(v){ MV.eng.stop(); if (EX) EX.stop(); if (v !== "start" && HR.stop) HR.stop(); SAYING = null; }
});
})();
