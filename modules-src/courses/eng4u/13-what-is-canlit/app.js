// ENG4U 13 What is "Canadian Literature"?: hero (McCrae's first stanza read line by line, a poppy per line, rhymes glow, a map
// with pins at Guelph and near Ypres), the CanLit atlas (Explore: timeline with era bands over the Indigenous storytelling band,
// a region map with an "Elsewhere" tray, lens mode with the plan's lens-fit table, a canon builder with readouts and "Who's
// missing?"), Test a thesis (Part 3: summary match, evidence board with "because" chips, a whose-thesis frame), Reading across
// texts (practice: multiple choice + one structured sentence), Spot the Error (K13) and "Curate a canon" (task: canon picker,
// criteria chips, E17 draft workspace). Texts and data in content.mjs.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function wc(s){ return MV.eng.wordCount(s || ""); }
function has(a, x){ return a.indexOf(x) >= 0; }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
var FORMS = ["Memoir", "Poetry", "Fiction", "Drama"];

// ---------- @component radioGroup (copied from ENG4U 09; adds data-k keys so MV.keepFocus can restore focus) ----------
// radios(host, {label, aria, key, options:[{id, t}], value, cls:"seg"|"chips", disabled(id), onChange(id)}) -> {set, get, refresh}
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), key = o.key || "rg";
  function off(id){ return !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = ids.indexOf(val) >= 0 && !off(val) ? val : ids.filter(function(id){ return !off(id); })[0];
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + esc(id) + '" data-k="' + key + esc(id) + '"' + (off(id) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
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
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, refresh:paint };
}

// ---------- local voice (read-aloud never leaves the device) ----------
var VOICE = null, voiceCbs = [];
function voiceReady(fn){ if (fn) voiceCbs.push(fn); MV.eng.voice(function(v){ VOICE = v; var c = voiceCbs; voiceCbs = []; c.forEach(function(f){ try { f(v); } catch (e) { console.error(e); } }); }); }
// read chunks in turn with a short pause after each; returns a token whose .stop() cancels
function readChunks(chunks, onChunk, onDone, rate){
  var tok = { stopped:false, stop:function(){ tok.stopped = true; MV.eng.stop(); } }, i = 0;
  function next(){
    if (tok.stopped) return;
    if (i >= chunks.length || !VOICE) { if (onChunk) onChunk(-1); if (onDone) onDone(); return; }
    var k = i++; if (onChunk) onChunk(k);
    MV.eng.say(chunks[k], { voice:VOICE, rate:rate || 1, onEnd:function(){ if (tok.stopped) return; setTimeout(next, 260); } });
  }
  next();
  return tok;
}

// ---------- hero: McCrae's first stanza; a poppy blooms per line; rhymes glow (A then B); a map with two pins ----------
var HR = { run:0, tok:null };
function heroLine(l, i, H){
  var rh = H.rhymes.filter(function(r){ return r[0] === i; })[0], toks = l.split(" "), last = toks.length - 1;
  return toks.map(function(w, k){
    if (rh && k === last && w === rh[1]) { var core = w.replace(/[,.;:]+$/, ""), tail = w.slice(core.length); return '<span class="cl-rw" data-r="' + rh[2] + '">' + esc(core) + '<span class="cl-rl" aria-hidden="true">' + rh[2] + "</span></span>" + esc(tail); }
    return esc(w);
  }).join(" ");
}
function poppySVG(){ return '<svg viewBox="0 0 40 54" aria-hidden="true" focusable="false"><path class="cl-stem" d="M20 26 V52"/><g class="cl-petals"><circle cx="13" cy="14" r="8.5"/><circle cx="27" cy="14" r="8.5"/><circle cx="12" cy="27" r="8.5"/><circle cx="28" cy="27" r="8.5"/></g><circle class="cl-pcore" cx="20" cy="20.5" r="4.2"/></svg>'; }
function heroMap(P){
  return '<svg class="cl-hmapsvg" viewBox="0 0 360 122" aria-hidden="true" focusable="false">' +
    '<path class="cl-land" d="M8 46 Q 30 16 84 20 Q 132 16 158 34 Q 168 60 150 80 Q 124 98 94 92 Q 62 102 40 90 Q 12 82 8 62 Z"/>' +
    '<path class="cl-land" d="M250 42 Q 282 22 318 30 Q 352 44 346 72 Q 332 96 296 94 Q 262 90 252 68 Z"/>' +
    '<text class="cl-mapl" x="62" y="48">Canada</text><text class="cl-mapl" x="312" y="52">Europe</text>' +
    '<text class="cl-ocean" x="206" y="112">' + esc(P.ocean) + "</text>" +
    '<path class="cl-route" d="M120 68 Q 200 0 276 62"/>' +
    '<g class="cl-pin cl-pin1"><circle cx="120" cy="68" r="5.5"/><text x="120" y="86">' + esc(P.home) + "</text></g>" +
    '<g class="cl-pin cl-pin2"><circle cx="276" cy="62" r="5.5"/><text x="276" y="80">' + esc(P.away) + "</text></g></svg>";
}
function hero(){
  var H = MV.C.hero, host = $("#cl-hero"); if (!host) return;
  host.innerHTML = '<blockquote class="cl-hpoem">' + H.stanza.map(function(l, i){ return '<span class="cl-hl" data-hl="' + i + '">' + heroLine(l, i, H) + "</span>"; }).join("") + '</blockquote><p class="eng-cite">' + H.cite + "</p>" +
    '<div class="cl-poppies" role="img" aria-label="A row of five poppy flowers, one for each line of the stanza">' + H.stanza.map(function(_, i){ return '<span class="cl-pop" data-pop="' + i + '">' + poppySVG() + "</span>"; }).join("") + "</div>" +
    '<div class="cl-hmap">' + heroMap(H.pins) + '</div><p class="cl-hcap">' + H.caption + "</p>" +
    '<div class="cl-hctl"><button type="button" class="btn ghost sm" id="cl-hlisten" hidden>' + H.listen + '</button><button type="button" class="btn ghost sm" id="cl-hagain" hidden>' + H.watch + '</button><span class="tiny muted" id="cl-hnote" hidden>' + H.noVoice + "</span></div>" +
    '<details class="alg cl-whole"><summary>' + H.wholeLabel + '</summary><div id="cl-whole"></div></details>';
  MV.eng.passage($("#cl-whole", host), H.full, { kind:"poem", cite:H.fullCite });
  var HL = $$(".cl-hl", host), POP = $$(".cl-pop", host), N = H.stanza.length;
  function lit(n, speak){ HL.forEach(function(e, i){ e.classList.toggle("lit", i <= n); e.classList.toggle("speaking", !!speak && i === n); }); POP.forEach(function(e, i){ e.classList.toggle("on", i <= n); }); }
  function reset(){ host.classList.remove("rA", "rB", "map", "cap"); host.classList.add("anim"); lit(-1); }
  function finish(){ host.classList.remove("anim"); host.classList.add("rA", "rB", "map", "cap"); lit(N - 1); HL.forEach(function(e){ e.classList.remove("speaking"); }); btns(); }
  function at(me, ms, fn){ setTimeout(function(){ if (me === HR.run) fn(); }, ms); }
  function tail(me, t0){
    at(me, t0, function(){ lit(N - 1); host.classList.add("rA"); });
    at(me, t0 + 800, function(){ host.classList.add("rB"); });
    at(me, t0 + 1600, function(){ host.classList.add("map"); });
    at(me, t0 + 2400, function(){ host.classList.add("cap"); });
    at(me, t0 + 2800, finish);
  }
  function animate(){
    var me = ++HR.run; stopRead(); reset();
    H.stanza.forEach(function(_, i){ at(me, 300 + i * 700, function(){ lit(i, true); }); });
    tail(me, 300 + N * 700);
  }
  function stopRead(){ if (HR.tok) { HR.tok.stop(); HR.tok = null; } }
  function listen(){
    var me = ++HR.run; stopRead();
    if (MV.reduceMotion) finish(); else reset();
    HR.tok = readChunks(H.stanza, function(k){ if (me === HR.run && k >= 0) lit(k, true); }, function(){ HR.tok = null; if (me !== HR.run) return; if (MV.reduceMotion) finish(); else tail(me, 100); }, 0.8);
  }
  function btns(){ $("#cl-hlisten").hidden = !VOICE; $("#cl-hagain").hidden = MV.reduceMotion; $("#cl-hnote").hidden = !!VOICE; }
  $("#cl-hlisten").addEventListener("click", listen);
  $("#cl-hagain").addEventListener("click", animate);
  if (MV.reduceMotion) finish(); else animate();
  voiceReady(btns);
  HR.stop = function(){ stopRead(); if (host.classList.contains("anim")) { HR.run++; finish(); } };
}

// ---------- collection data helpers (Explore, practice and the task) ----------
function D(){ return MV.C.explore; }
function work(n){ var W = D().works; for (var i = 0; i < W.length; i++) if (W[i].n === +n) return W[i]; return null; }
function eraT(id){ var e = byId(D().eras, id); return e ? e.t : id; }
function cstats(ids){
  var E = D(), ws = (ids || []).map(work).filter(Boolean), st = { n:ws.length, works:ws, en:0, fr:0, ind:0, forms:{}, regs:{}, eras:[], black:false, min:null, max:null };
  ws.forEach(function(w){
    if (w.lang === "fr") st.fr++; else st.en++;
    if (w.ind) st.ind++;
    st.forms[w.form] = (st.forms[w.form] || 0) + 1;
    w.reg.forEach(function(r){ st.regs[r] = (st.regs[r] || 0) + 1; });
    if (w.black) st.black = true;
    if (st.min == null || w.yr < st.min) st.min = w.yr; if (st.max == null || w.yr > st.max) st.max = w.yr;
  });
  st.eras = E.eras.filter(function(e){ return ws.some(function(w){ return w.era === e.id; }); }).map(function(e){ return e.id; });
  st.nForms = FORMS.filter(function(f){ return st.forms[f]; }).length;
  return st;
}
// "Who's missing?": absent regions, languages, forms and eras from the data, plus the plan's two fixed prompts
function missing(st){
  var E = D(), out = [];
  if (!st.n) return out;
  E.regions.forEach(function(r){ if (!st.regs[r.id]) out.push({ g:"Regions", t:r.miss }); });
  if (!st.en) out.push({ g:"Languages", t:E.langMissing.en });
  if (!st.fr) out.push({ g:"Languages", t:E.langMissing.fr });
  out.push({ g:"Languages", t:E.fixedMissing.indLang });
  FORMS.forEach(function(f){ if (!st.forms[f]) out.push({ g:"Forms", t:"No " + f.toLowerCase() }); });
  E.eras.forEach(function(e){ if (!has(st.eras, e.id)) out.push({ g:"Eras", t:"Nothing from the " + e.t + " era (" + e.d + ")" }); });
  if (!st.black) out.push({ g:"Voices", t:E.fixedMissing.black });
  return out;
}
function missHTML(st, struck){
  var L = missing(st); struck = struck || [];
  if (!st.n) return '<span class="muted">Choose works to see what’s missing.</span>';
  var G = ["Regions", "Languages", "Forms", "Eras", "Voices"];
  return '<ul class="cl-miss">' + G.map(function(g){
    var items = L.filter(function(x){ return x.g === g; }).map(function(x){ return esc(x.t); });
    struck.forEach(function(s){ if (s.g === g) items.push("<del>" + esc(s.t) + "</del>"); });
    return items.length ? "<li><strong>" + g + ":</strong> " + items.join(" · ") + "</li>" : "";
  }).join("") + "</ul>";
}
function rowsHTML(rows){ return rows.map(function(r){ return '<div class="' + (r[2] || "") + '"><dt>' + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join(""); }
function plainTitle(w){ return MV.plain(w.t); }

// ---------- Explore: the CanLit atlas (timeline · map · lens · canon builder) ----------
// Simplified region shapes (not to scale) for the map; labels sit at x, y.
var SHAPES = {
  north:{ p:"20,72 44,42 92,30 150,22 210,26 252,14 300,10 346,22 372,48 360,74 330,82 300,78 270,86 230,92 196,96 180,94 130,90 90,92 50,92", x:200, y:56, t:"The North" },
  bc:{ p:"50,92 90,92 104,104 112,182 92,186 70,172 52,148 36,118 40,100", x:76, y:136, t:"B.C." },
  prairies:{ p:"90,92 130,90 180,94 196,96 196,182 112,182 104,104", x:152, y:136, t:"Prairies" },
  on:{ p:"196,96 230,92 246,112 258,150 270,196 250,212 222,200 206,186 196,182", x:228, y:150, t:"Ontario" },
  qc:{ p:"230,92 270,86 300,78 304,110 300,150 286,176 270,196 258,150 246,112", x:276, y:124, t:"Quebec" },
  atl:{ p:"300,78 330,82 360,74 372,100 364,132 344,140 352,170 330,190 304,186 286,176 300,150 304,110", x:336, y:118, t:"Atlantic" }
};
var EX = null;
function explore(host, api){
  var C = api.content, S = api.S, PAS = C.passages, R = C.readout, F = C.filters;
  S.mode = S.mode || "timeline"; S.canon = Array.isArray(S.canon) ? S.canon.filter(function(n){ return !!work(n); }) : [];
  S.f = S.f || { form:"all", lang:"all", ind:"all" }; S.lens = S.lens || "garrison"; S.pas = S.pas || ""; S.t3 = S.t3 || { m:{} }; S.t3.m = S.t3.m || {};
  var fx = {}, slide = 0, shown = -1, tlScroll = 0;
  host.innerHTML = '<div class="cl-ex"><div id="cl-mode"></div><p class="how cl-how" id="cl-how"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="cl-main" data-mv="graph" id="cl-main"></div><div class="cl-readw"><dl class="read cl-read" id="cl-read" aria-live="polite"></dl></div><div id="cl-shelf" class="cl-shelfw"></div></div>';
  var modeRG = radios($("#cl-mode", host), { label:"Mode", key:"md", options:C.modes, value:S.mode, onChange:function(v){ setMode(v); } });
  function setMode(v){ stopFx(); MV.banner("", ""); S.mode = v; modeRG.set(v); api.save(); paint(); MV.changed(); }
  function tc(id){ return byId(C.challenges, id); }

  // ----- cards, detail sheet and shelf -----
  function cardHTML(w, where){
    var on = has(S.canon, w.n), open = S.open === w.n, fade = fx.fade && has(fx.fade, w.n), tags = [w.form];
    if (w.ind) tags.push("Indigenous author");
    if (w.lang === "fr") tags.push("French, in translation");
    return '<button type="button" class="cl-card' + (on ? " on" : "") + (open ? " open" : "") + (fade ? " fade" : "") + '" data-card="' + w.n + '" data-k="c' + w.n + where + '" aria-expanded="' + open + '">' +
      '<span class="cl-cy">' + w.yr + '</span><span class="cl-ct">' + w.t + '</span><span class="cl-ca">' + esc(w.au) + '</span><span class="cl-ctags">' + tags.map(function(t){ return "<span>" + t + "</span>"; }).join("") +
      (on ? '<span class="cl-onshelf">✓ on shelf</span>' : "") + "</span></button>";
  }
  function addBtn(w, where){
    var on = has(S.canon, w.n);
    return '<button type="button" class="btn ' + (on ? "ghost" : "primary") + ' sm cl-add" data-' + (on ? "rm" : "add") + '="' + w.n + '" data-k="' + (on ? "r" : "a") + w.n + where + '">' + (on ? "Remove" : "Add to canon") + '<span class="vh"> ' + esc(plainTitle(w)) + "</span></button>";
  }
  function detailHTML(){
    var w = work(S.open); if (!w) return "";
    var rows = [["Author", esc(w.au)], ["Year", w.yr], ["Form", w.form], ["Era", eraT(w.era)], ["Setting or region", w.set], ["Language", w.langT], ["Indigenous author", w.ind ? "Yes (" + w.ind + ")" : "No"]];
    return '<div class="cl-detail" role="region" aria-label="About ' + esc(plainTitle(w)) + '"><h4>' + w.t + "</h4><p>" + w.d + '</p><dl class="cl-dl">' + rows.map(function(r){ return "<div><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("") + "</dl>" +
      '<div class="q-actions">' + addBtn(w, "d") + (w.pas ? '<button type="button" class="btn ghost sm" data-golens="' + w.pas + '" data-k="gl' + w.n + '">Read its passage in Lens mode</button>' : "") + '<button type="button" class="btn ghost sm" data-close="1" data-k="close">Close</button></div></div>';
  }
  function shelfHTML(){
    var h = '<h4 class="cl-h">Your shelf <span class="tiny">(' + S.canon.length + " / 6)</span></h4><ol class=\"cl-slots\">";
    for (var i = 0; i < 6; i++) {
      var n = S.canon[i], w = n ? work(n) : null;
      h += w ? '<li class="cl-slot full' + (fx.fade && has(fx.fade, n) ? " fade" : "") + (fx.lift === n ? " lift" : "") + '"><span class="cl-cy">' + w.yr + '</span><span class="cl-ct">' + w.t + '</span><span class="cl-ca">' + esc(w.au) + "</span>" +
        '<button type="button" class="btn ghost sm" data-rm="' + n + '" data-k="rs' + n + '">Remove<span class="vh"> ' + esc(plainTitle(w)) + "</span></button></li>"
        : '<li class="cl-slot empty"><span class="tiny muted">Empty slot</span></li>';
    }
    return h + "</ol>";
  }

  // ----- Timeline -----
  function passF(w){
    if (S.f.form !== "all" && w.form !== S.f.form) return false;
    if (S.f.lang !== "all" && w.lang !== S.f.lang) return false;
    if (S.f.ind === "yes" && !w.ind) return false;
    return true;
  }
  function timelineHTML(){
    var vis = C.works.filter(passF);
    var h = '<div class="cl-filters"><div id="cl-ff"></div><div id="cl-fl"></div><div id="cl-fi"></div></div><p class="tiny muted" aria-live="polite">Showing ' + vis.length + " of " + C.works.length + " works.</p>";
    h += '<div class="cl-tlwrap" id="cl-tlw" role="region" aria-label="Timeline (scrolls sideways)" tabindex="0"><div class="cl-tl"><div class="cl-eras">' + C.eras.map(function(e){
      var ws = vis.filter(function(w){ return w.era === e.id; });
      return '<section class="cl-era cl-era-' + e.id + '" aria-label="' + esc(e.t + ", " + e.d) + '"><h4>' + e.t + "<small>" + e.d + '</small></h4><div class="cl-books">' + (ws.length ? ws.map(function(w){ return cardHTML(w, "t"); }).join("") : '<span class="tiny muted">No works match.</span>') + "</div></section>";
    }).join("") + '</div><div class="cl-band" role="note"><span class="cl-band-in" aria-hidden="true">…</span><span class="cl-band-t">' + C.band + '</span><span class="cl-band-out" aria-hidden="true">→</span></div></div></div>';
    return h + '<div id="cl-detail">' + detailHTML() + "</div>";
  }
  function timelineRadios(){
    var fo = [{ id:"all", t:F.all }].concat(FORMS.map(function(f){ return { id:f, t:f }; }));
    radios($("#cl-ff", host), { label:F.form, key:"ff", cls:"chips", options:fo, value:S.f.form, onChange:function(v){ S.f.form = v; api.save(); paint(); } });
    radios($("#cl-fl", host), { label:F.lang, key:"fl", cls:"chips", options:[{ id:"all", t:F.all }, { id:"en", t:F.en }, { id:"fr", t:F.fr }], value:S.f.lang, onChange:function(v){ S.f.lang = v; api.save(); paint(); } });
    radios($("#cl-fi", host), { label:F.ind, key:"fi", cls:"chips", options:[{ id:"all", t:F.all }, { id:"yes", t:F.yes }], value:S.f.ind, onChange:function(v){ S.f.ind = v; api.save(); paint(); } });
  }

  // ----- Map -----
  function mapHTML(){
    var st = cstats(S.canon), d = [];
    var svg = C.regions.map(function(r){
      var s = SHAPES[r.id], n = st.regs[r.id] || 0; d.push(r.t + " " + n);
      return '<polygon class="cl-rg' + (n ? " n" + Math.min(n, 3) : "") + (S.reg === r.id ? " sel" : "") + '" points="' + s.p + '"/><text class="cl-rgl" x="' + s.x + '" y="' + s.y + '">' + s.t + "</text>" + (n ? '<text class="cl-rgn" x="' + s.x + '" y="' + (s.y + 15) + '">' + n + (n === 1 ? " work" : " works") + "</text>" : "");
    }).join("");
    var h = '<div class="cl-map"><div class="cl-mapsvg"><svg viewBox="0 0 400 222" role="img" aria-label="' + esc("Simplified map of Canada’s regions, not to scale. Works on your shelf by region: " + d.join(", ") + ".") + '">' + svg + '</svg><p class="tiny muted">A simplified map of Canada’s regions, not to scale.</p></div>';
    h += '<div class="cl-regs" role="group" aria-label="Regions">' + C.regions.map(function(r){ var n = st.regs[r.id] || 0; return '<button type="button" class="cl-reg' + (n ? " has" : "") + '" data-reg="' + r.id + '" data-k="rg' + r.id + '" aria-pressed="' + (S.reg === r.id) + '">' + r.t + ' <span class="cl-regn">' + n + "</span></button>"; }).join("") + "</div>";
    if (S.reg) {
      var rr = byId(C.regions, S.reg), set = C.works.filter(function(w){ return has(w.reg, S.reg); });
      h += '<div class="cl-regw"><p class="cl-h">Set in ' + rr.t + ":</p>" + (set.length ? '<div class="cl-books cl-wrap">' + set.map(function(w){ return cardHTML(w, "m"); }).join("") + "</div>" : '<p class="tiny muted">No work in this collection is set here.</p>') + "</div>";
    }
    var away = C.works.filter(function(w){ return !w.reg.length; });
    h += '<div class="cl-away"><p class="cl-away-h">' + C.elsewhere + '</p><div class="cl-books cl-wrap">' + away.map(function(w){ return cardHTML(w, "e"); }).join("") + "</div></div></div>";
    return h + '<div id="cl-detail">' + detailHTML() + "</div>";
  }

  // ----- Lens -----
  function lensName(){ return byId(C.lenses, S.lens).name; }
  function fitShown(id){ return (S.pas === id && !fx.hideFit) || !!(fx.fitShow && fx.fitShow[id]); }
  function markSeg(html, segs){ segs.forEach(function(s){ var e = esc(s.trim()), i = html.indexOf(e); if (e && i >= 0) html = html.slice(0, i) + '<mark class="cl-mark">' + e + "</mark>" + html.slice(i + e.length); }); return html; }
  function passageHTML(p){
    var segs = S.line && S.line.p === p.id ? String(p.lines[S.line.i] || "").split(" / ") : [];
    if (p.kind === "prose") return '<div class="eng-passage eng-prose">' + p.text.map(function(t, i){ return '<p><span class="eng-ln">par. ' + (i + 1) + "</span>" + markSeg(esc(t), segs) + "</p>"; }).join("") + "</div>";
    return '<div class="eng-passage"><ol class="eng-poem">' + p.text.map(function(l){
      if (l.gap) return p.id === "lampman" ? '<li class="cl-skip"><span class="eng-ln"></span><span>…<span class="vh"> lines 2 to 46 are not shown</span></span></li>' : '<li class="eng-gap" aria-hidden="true"></li>';
      return '<li><span class="eng-ln" aria-hidden="true">' + l.n + "</span><span>" + markSeg(esc(l.t), segs) + "</span></li>";
    }).join("") + "</ol></div>";
  }
  function lensHTML(){
    var h = '<div id="cl-lensrg"></div><div class="cl-pcards" role="group" aria-label="Public-domain passages">' + PAS.map(function(p){
      var on = S.pas === p.id, f = p.fit[S.lens];
      return '<button type="button" class="cl-pcard' + (on ? " on" : "") + '" data-pas="' + p.id + '" data-k="p' + p.id + '" aria-pressed="' + on + '"><span class="cl-pl">' + p.label + "</span>" + (fitShown(p.id) ? '<span class="cl-fitb">' + f[0] + "</span>" : "") + "</button>";
    }).join("") + "</div>";
    var p = byId(PAS, S.pas);
    if (!p) h += '<p class="cl-pempty">Tap a passage card to look at it through the ' + lensName() + ".</p>";
    else {
      var f = p.fit[S.lens], ov = slide === shown || MV.reduceMotion ? " on" : "";
      h += '<div class="cl-pview"><div class="cl-lenswrap"><div class="cl-ov' + ov + (fx.hideFit ? " hide" : "") + '" aria-hidden="true"><span>' + lensName() + "</span></div>" + passageHTML(p) + '</div><p class="eng-cite">' + p.cite + "</p>" +
        (p.listen ? '<p class="q-actions"><button type="button" class="btn ghost sm" data-say="' + p.id + '" data-k="say' + p.id + '"' + (VOICE ? "" : " hidden") + '>Listen</button><span class="tiny muted"' + (VOICE ? " hidden" : "") + ">Read it aloud yourself, slowly.</span></p>" : "") +
        '<p class="cl-fit" aria-live="polite"><span class="an-tag an-theme">' + lensName() + "</span> " + (fx.hideFit ? '<span class="muted">Fit hidden until you predict.</span>' : "<strong>" + f[0] + "</strong>" + (f[1] ? ": " + f[1] : "")) + "</p>" +
        '<div id="cl-lines"></div></div>';
    }
    h += '<div class="cl-t3"><h4 class="cl-h">Test the garrison thesis</h4><p class="tiny muted">Mark one passage that supports the thesis and two that challenge it, then choose a conclusion.</p><ul class="cl-t3l">' + PAS.map(function(q){
      var m = S.t3.m[q.id] || "";
      return '<li><span class="cl-t3n">' + q.label + '</span><span class="cl-t3b"><button type="button" data-t3="' + q.id + ':s" data-k="t3s' + q.id + '" aria-pressed="' + (m === "s") + '">Supports</button><button type="button" data-t3="' + q.id + ':c" data-k="t3c' + q.id + '" aria-pressed="' + (m === "c") + '">Challenges</button></span></li>';
    }).join("") + '</ul><div id="cl-concl"></div></div><p class="tiny muted">' + C.lensNote + "</p>";
    return h;
  }
  function lensRadios(){
    radios($("#cl-lensrg", host), { label:"Lens", key:"ln", options:C.lenses.map(function(l){ return { id:l.id, t:l.t }; }), value:S.lens, onChange:function(v){ stopFx(); S.lens = v; slide++; api.save(); paint(); MV.changed(); } });
    var p = byId(PAS, S.pas);
    if (p && $("#cl-lines", host)) radios($("#cl-lines", host), { label:"Mark a line", key:"li" + p.id, cls:"chips", options:p.lines.map(function(l, i){ return { id:String(i), t:"“" + esc(l) + "”" }; }), value:S.line && S.line.p === p.id ? String(S.line.i) : "",
      onChange:function(v){ stopFx(); S.line = { p:p.id, i:+v }; api.save(); paint(); MV.changed(); } });
    var c3 = tc("tc3");
    radios($("#cl-concl", host), { label:"Conclusion", key:"cc", cls:"chips cl-concl", options:c3.options.map(function(o, i){ return { id:String(i), t:o.t }; }), value:S.t3.c != null ? String(S.t3.c) : "",
      onChange:function(v){ S.t3.c = +v; api.save(); paintRead(); MV.changed(); } });
  }

  // ----- Canon builder -----
  function canonHTML(){
    return '<div class="cl-grid">' + C.eras.map(function(e){
      var ws = C.works.filter(function(w){ return w.era === e.id; });
      return '<section class="cl-gera" aria-label="' + esc(e.t) + '"><h4>' + e.t + " <small>" + e.d + "</small></h4>" + ws.map(function(w){ return '<div class="cl-grow">' + cardHTML(w, "g") + addBtn(w, "g") + "</div>"; }).join("") + "</section>";
    }).join("") + '</div><div id="cl-detail">' + detailHTML() + "</div>";
  }

  // ----- readouts -----
  function canonRows(){
    var st = cstats(S.canon), fl = fx.flash || "";
    var ind = fx.indShow != null ? fx.indShow : String(st.ind);
    return [[R.chosen, st.n + " / 6"], [R.eras, st.eras.length + (st.eras.length ? ": " + st.eras.map(eraT).join(", ") : "")],
      [R.langs, "English " + st.en + " · French (in translation) " + st.fr, fl === "langs" ? "cl-flash" : ""], [R.ind, ind, fl === "ind" ? "cl-flash" : ""],
      [R.forms, FORMS.filter(function(f){ return st.forms[f]; }).map(function(f){ return f + " " + st.forms[f]; }).join(" · ") || "—"],
      [R.span, st.n ? st.min + "–" + st.max : "—"], [R.missing, missHTML(st, fx.struck), "cl-missrow"]];
  }
  function readout(){
    if (S.mode === "canon") return rowsHTML(canonRows()) + (S.canon.length === 6 ? '<p class="cl-aha">' + C.aha + "</p>" : "");
    if (S.mode === "lens") {
      var p = byId(PAS, S.pas), f = p ? p.fit[S.lens] : null, lp = S.line ? byId(PAS, S.line.p) : null;
      var sup = PAS.filter(function(q){ return S.t3.m[q.id] === "s"; }).map(function(q){ return q.short; }), ch = PAS.filter(function(q){ return S.t3.m[q.id] === "c"; }).map(function(q){ return q.short; });
      return rowsHTML([[R.lens, lensName()], [R.passage, p ? p.label : "none chosen"], [R.fit, !p ? "—" : fx.hideFit ? "?" : f[0] + (f[1] ? ": " + f[1] : "")],
        [R.line, lp ? lp.short + ": “" + esc(lp.lines[S.line.i]) + "”" : "none marked"],
        [R.test, "Supports: " + (sup.join(", ") || "—") + " · Challenges: " + (ch.join(", ") || "—") + " · Conclusion: " + (S.t3.c != null ? "chosen" : "not chosen")]]);
    }
    var st = cstats(S.canon), rows = [[R.shelf, st.n + " / 6" + (st.n ? ": " + st.works.map(function(w){ return w.t; }).join(", ") : "")]];
    if (S.mode === "map") {
      var regs = C.regions.filter(function(r){ return st.regs[r.id]; }).map(function(r){ return r.t + " " + st.regs[r.id]; });
      rows.push(["Regions on your shelf", regs.join(" · ") || "none yet"]);
      rows.push(["Set elsewhere", String(st.works.filter(function(w){ return !w.reg.length; }).length)]);
    } else { var w = work(S.open); rows.push([R.open, w ? w.t + ", " + esc(w.au) + " (" + w.yr + ")" : "Tap a card to read about it."]); }
    return rowsHTML(rows);
  }
  function paintRead(){ $("#cl-read", host).innerHTML = readout(); }

  function paint(){
    $("#cl-how", host).innerHTML = C.how[S.mode];
    var m = $("#cl-main", host), tw = $("#cl-tlw", host); if (tw) tlScroll = tw.scrollLeft;
    MV.keepFocus(m, function(){
      m.className = "cl-main cl-m-" + S.mode;
      m.innerHTML = S.mode === "timeline" ? timelineHTML() : S.mode === "map" ? mapHTML() : S.mode === "lens" ? lensHTML() : canonHTML();
      if (S.mode === "timeline") timelineRadios();
      if (S.mode === "lens") lensRadios();
    });
    tw = $("#cl-tlw", host); if (tw) tw.scrollLeft = tlScroll;
    // the lens overlay slides in when the lens or the passage changes
    if (S.mode === "lens" && shown !== slide && !MV.reduceMotion) { shown = slide; var ov = $(".cl-ov", host); if (ov) requestAnimationFrame(function(){ requestAnimationFrame(function(){ ov.classList.add("on"); }); }); }
    else shown = slide;
    var sh = $("#cl-shelf", host);
    MV.keepFocus(sh, function(){ sh.hidden = S.mode === "lens"; sh.innerHTML = S.mode === "lens" ? "" : shelfHTML(); });
    paintRead();
  }
  function add(n){
    n = +n; if (has(S.canon, n)) return;
    if (S.canon.length >= 6) { MV.banner("bad", "Your shelf holds six. Remove one first."); return; }
    stopFx(); S.canon.push(n); fx.lift = n; api.save(); MV.banner("", ""); paint(); MV.changed();
  }
  function rm(n){ n = +n; stopFx(); S.canon = S.canon.filter(function(x){ return x !== n; }); api.save(); MV.banner("", ""); paint(); MV.changed(); }
  function sayPassage(id){
    var p = byId(PAS, id); if (!p || !VOICE) return;
    var chunks = p.text.filter(function(l){ return !l.gap; }).map(function(l){ return l.t; }), lis = function(){ return $$(".cl-pview .eng-poem li:not(.eng-gap):not(.cl-skip)", host); };
    readChunks(chunks, function(k){ lis().forEach(function(li, i){ li.classList.toggle("cl-speaking", i === k); }); }, null, 0.85);
  }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || !host.contains(b) || b.closest("[data-rg]")) return;
    var d = b.dataset;
    if (d.card) { stopFx(); S.open = S.open === +d.card ? 0 : +d.card; api.save(); paint(); var dt = $("#cl-detail .cl-detail", host); if (dt && S.open) dt.scrollIntoView({ block:"nearest", behavior:MV.reduceMotion ? "auto" : "smooth" }); return; }
    if (d.add) { add(d.add); return; }
    if (d.rm) { rm(d.rm); return; }
    if (d.close) { var n = S.open; S.open = 0; api.save(); paint(); var cb = $('[data-card="' + n + '"]', host); if (cb) cb.focus(); return; }
    if (d.golens) { S.pas = d.golens; S.line = null; slide++; setMode("lens"); return; }
    if (d.reg) { S.reg = S.reg === d.reg ? "" : d.reg; api.save(); paint(); return; }
    if (d.pas) { stopFx(); if (S.pas !== d.pas) { S.pas = d.pas; slide++; } api.save(); paint(); MV.changed(); return; }
    if (d.say) { sayPassage(d.say); return; }
    if (d.t3) { var q = d.t3.split(":"); S.t3.m[q[0]] = S.t3.m[q[0]] === q[1] ? "" : q[1]; if (!S.t3.m[q[0]]) delete S.t3.m[q[0]]; api.save(); paint(); MV.changed(); }
  });
  // "Set it up" buttons in the challenge prompts
  document.addEventListener("click", function(e){
    var b = e.target.closest(".cl-setup"); if (!b) return;
    if (S.mode !== b.dataset.setup) setMode(b.dataset.setup);
    if (b.dataset.setup === "lens" && !S.lens) S.lens = "garrison";
    var g = $("#cl-main", host); if (g) g.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
  });
  voiceReady(function(){ if (S.mode === "lens") paint(); });

  function stopFx(){ if (Object.keys(fx).length) fx = {}; }
  paint();

  EX = {
    stop:function(){ MV.eng.stop(); stopFx(); paint(); },
    predict:{
      start:function(p){
        MV.eng.stop(); stopFx(); var st = p.start || {};
        S.mode = st.mode; modeRG.set(st.mode); S.open = 0;
        if (st.lens) { S.lens = st.lens; S.pas = st.pas || ""; S.line = null; slide++; }
        if (st.canon) S.canon = st.canon.slice();
        if (p.id === "p3") fx.hideFit = true;
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        if (p.id === "p1") {
          MV.wait(300, function(){ S.pas = "moodie"; slide++; fx = { fitShow:{ moodie:1 } }; paint();
            MV.wait(1300, function(){ fx.fitShow = fx.fitShow || {}; fx.fitShow.lampman = 1; paint(); MV.wait(900, done); }); });
        } else if (p.id === "p2") {
          var cut = S.canon.filter(function(n){ return work(n).yr < p.cut; }), before = cstats(S.canon).ind;
          MV.wait(300, function(){ fx = { fade:cut }; paint();
            MV.wait(1000, function(){ S.canon = S.canon.filter(function(n){ return !has(cut, n); }); api.save(); fx = { flash:"ind", indShow:cstats(S.canon).ind + " (was " + before + ")" }; paint(); MV.changed(); MV.wait(900, done); }); });
        } else if (p.id === "p3") {
          MV.wait(300, function(){ fx = {}; slide++; paint(); MV.wait(1400, done); });
        } else if (p.id === "p4") {
          var had = missing(cstats(S.canon));
          MV.wait(300, function(){
            if (!has(S.canon, p.add)) S.canon.push(p.add); api.save();
            var now = missing(cstats(S.canon)).map(function(x){ return x.t; });
            fx = { lift:p.add, flash:"langs", struck:had.filter(function(x){ return !has(now, x.t); }) }; paint(); MV.changed(); MV.wait(1600, done);
          });
        } else done();
      }
    },
    challenge:function(id){ return id === "tc1" ? tc1() : id === "tc2" ? tc2() : id === "tc3" ? tc3() : { ok:false }; }
  };
  function tc1(){
    var M = tc("tc1").msgs, st = cstats(S.canon);
    if (st.n !== 6) return { ok:false, msg:M.count.replace("{n}", st.n) };
    if (st.eras.length < 4) return { ok:false, msg:M.eras.replace("{n}", st.eras.length) };
    if (st.ind < 1) return { ok:false, msg:M.ind };
    if (st.fr < 1) return { ok:false, msg:M.fr };
    return { ok:true };
  }
  function tc2(){
    var c = tc("tc2"), M = c.msgs, L = S.line;
    if (!L || !L.p) return { ok:false, msg:M.none };
    if (MV.ans(c).some(function(a){ return a[0] === L.p && a[1] === L.i; })) return { ok:true };
    if (M[L.p]) return { ok:false, msg:M[L.p] };
    if (L.p === "lampman") return { ok:false, msg:M.line };
    return { ok:false };
  }
  function tc3(){
    var c = tc("tc3"), M = c.msgs, A = MV.ans(c), m = S.t3.m;
    var sup = PAS.filter(function(q){ return m[q.id] === "s"; }).map(function(q){ return q.id; }), ch = PAS.filter(function(q){ return m[q.id] === "c"; }).map(function(q){ return q.id; });
    if (has(ch, "mccrae")) return { ok:false, msg:M.mccrae };
    if (has(sup, "lampman")) return { ok:false, msg:M.lampSup };
    if (sup.length !== 1 || ch.length !== 2 || S.t3.c == null) return { ok:false, msg:M.count };
    if (sup[0] !== A.sup) return { ok:false, msg:M.sup };
    if (has(ch, "moodie")) return { ok:false, msg:M.ch };
    if (!ch.every(function(x){ return has(A.ch, x); })) return { ok:false };
    var o = c.options[S.t3.c];
    if (!MV.ok(o)) return { ok:false, msg:o.fb };
    return { ok:true };
  }
  return EX;
}

// ---------- Part 3: Test a thesis (Station 1 summary match, Station 2 evidence board with "because" chips, Station 3 frame) ----------
function part3(host, api){
  var P = api.content, S = api.S, PAS = MV.C.explore.passages;
  S.s1 = S.s1 || {}; S.bd = S.bd || {}; S.bd.th = S.bd.th || "garrison"; S.bd.pl = S.bd.pl || {}; S.bd.bc = S.bd.bc || {}; S.s3 = S.s3 || {}; S.s3.chips = S.s3.chips || [];
  var sel = "";
  host.innerHTML = '<div class="cl-p3"><section class="cl-stn" aria-labelledby="cl-s1h"><h3 id="cl-s1h">' + P.s1.title + '</h3><p class="how">' + P.s1.how + '</p><div class="cl-tcards" id="cl-s1"></div></section>' +
    '<section class="cl-stn" aria-labelledby="cl-s2h"><h3 id="cl-s2h">' + P.s2.title + '</h3><p class="how">' + P.s2.how + '</p><div id="cl-thrg"></div><div id="cl-board"></div></section>' +
    '<section class="cl-stn" aria-labelledby="cl-s3h"><h3 id="cl-s3h">' + P.s3.title + '</h3><p class="cl-card3">' + P.s3.card + "</p><p><strong>" + P.s3.prompt + '</strong></p>' +
    '<div class="cl-s3chips" id="cl-s3c" role="group" aria-label="Whose writing?"></div><p class="cl-frame"><span id="cl-s3f"></span></p>' +
    '<div class="jq"><label for="cl-s3t">Complete the thesis</label><input id="cl-s3t" class="txtin" type="text" autocomplete="off" placeholder="' + esc(P.s3.ph) + '"></div><p class="cl-s3o" id="cl-s3o" aria-live="polite"></p></section></div>';

  // Station 1
  function paintS1(){
    var el = $("#cl-s1", host);
    MV.keepFocus(el, function(){
      el.innerHTML = P.s1.cards.map(function(c){
        var pick = S.s1[c.id] || "", fb = "";
        if (pick) { var right = pick === MV.ans(c); fb = MV.fbHTML(right ? "good" : "bad", right ? "<strong>✓</strong> " + P.s1.fb.right : "<strong>✗ Not quite.</strong> " + (P.s1.fb[pick] || P.s1.fb.other)); }
        return '<article class="cl-tcard"><h4>' + c.name + " <small>" + c.who + '</small></h4><blockquote class="cl-tq">' + c.lead + c.quote + ' <span class="cl-tcite">' + c.cite + '</span></blockquote><p class="tiny muted cl-credit">' + c.credit + "</p>" +
          (c.slot ? '<p class="cl-slotc">' + c.slot + "</p>" : "") + '<p class="cl-gloss"><span class="an-tag an-theme">In plain words</span> ' + c.gloss + '</p><p class="rg-lab">Which summary matches this card?</p><div class="cl-sums" role="group" aria-label="Summaries for ' + esc(MV.plain(c.name)) + '">' +
          MV.shuffle(P.s1.summaries, c.id).map(function(s){ var on = pick === s.id; return '<button type="button" class="cl-sum" aria-pressed="' + on + '" data-s1="' + c.id + ":" + s.id + '" data-k="s1' + c.id + s.id + '">' + s.t + "</button>"; }).join("") + "</div>" + fb + "</article>";
      }).join("");
    });
  }
  // Station 2
  function cell(th, p){ return P.s2.cells.filter(function(c){ return c.th === th && c.p === p; })[0]; }
  function status(th, p){
    var col = S.bd.pl[th + ":" + p]; if (!col) return null;
    var A = MV.ans(cell(th, p)), bc = S.bd.bc[th + ":" + p] || "";
    if (col === A.k) return "key";
    if (!bc) return "need";
    return A.alt[col] && has(A.alt[col], bc) ? "alt" : "bad";
  }
  function tile(p){ return '<button type="button" class="cl-tile' + (sel === p.id ? " sel" : "") + '" data-tile="' + p.id + '" data-k="tl' + p.id + '" aria-pressed="' + (sel === p.id) + '">' + p.label + "</button>"; }
  radios($("#cl-thrg", host), { label:"Thesis", key:"th", options:P.s2.theses, value:S.bd.th, onChange:function(v){ S.bd.th = v; sel = ""; api.save(); paintBoard(); } });
  function paintBoard(){
    var el = $("#cl-board", host), th = S.bd.th;
    MV.keepFocus(el, function(){
      var tray = PAS.filter(function(p){ return !S.bd.pl[th + ":" + p.id]; }), cnt = { s:0, c:0, d:0 }, hold = 0;
      var h = '<div class="cl-btray" role="group" aria-label="Passages to place">' + (tray.length ? tray.map(tile).join("") : '<span class="tiny muted">All five passages are on the board.</span>') + "</div>";
      h += '<div class="cl-bcols">' + P.s2.cols.map(function(c){
        var inside = PAS.filter(function(p){ return S.bd.pl[th + ":" + p.id] === c.id; });
        return '<div class="cl-bcol"><button type="button" class="cl-bcolb' + (sel ? " ready" : "") + '" data-col="' + c.id + '" data-k="col' + c.id + '">' + c.t + ' <span class="tiny">(' + inside.length + ')</span><span class="vh"> column: place the selected passage here</span></button><ul class="cl-bin">' + inside.map(function(p){
          var s = status(th, p.id), k = th + ":" + p.id;
          return '<li class="cl-bpl st-' + s + '">' + tile(p) + '<p class="cl-bst">' + P.s2.st[s] + "</p>" + (s !== "key" ? '<div class="cl-bcs" role="group" aria-label="Because…">' + P.s2.because.map(function(b){ return '<button type="button" class="cl-bc" data-bc="' + p.id + ":" + b.id + '" data-k="bc' + p.id + b.id + '" aria-pressed="' + (S.bd.bc[k] === b.id) + '">' + b.t + "</button>"; }).join("") + "</div>" : "") + "</li>";
        }).join("") + "</ul></div>";
      }).join("") + "</div>";
      PAS.forEach(function(p){ var c = S.bd.pl[th + ":" + p.id]; if (c) cnt[c]++; var s = status(th, p.id); if (s === "key" || s === "alt") hold++; });
      h += '<p class="cl-bar" aria-live="polite"><strong>' + P.s2.bar.replace("{t}", byId(P.s2.theses, th).t).replace("{s}", cnt.s).replace("{c}", cnt.c).replace("{d}", cnt.d) + "</strong> · " + hold + " of 5 placements hold</p>";
      el.innerHTML = h;
    });
  }
  // Station 3
  function s3Who(){ return P.s3.chips.filter(function(c){ return has(S.s3.chips, c); }).reverse().join(" "); }
  function paintS3(){
    var el = $("#cl-s3c", host);
    MV.keepFocus(el, function(){ el.innerHTML = P.s3.chips.map(function(c){ var on = has(S.s3.chips, c); return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-s3="' + esc(c) + '" data-k="s3' + esc(c) + '">' + c + "</button>"; }).join(""); });
    var who = s3Who(), frame = P.s3.frame.replace("{who}", who ? "<strong>" + who + "</strong>" : "______");
    $("#cl-s3f", host).innerHTML = frame + "<em>" + (esc(S.s3.txt || "") || "______") + "</em>";
    var ok = !!who && wc(S.s3.txt) >= 5;
    $("#cl-s3o", host).innerHTML = ok ? P.s3.ok : '<span class="muted">' + P.s3.need + "</span>";
  }
  $("#cl-s3t", host).value = S.s3.txt || "";
  $("#cl-s3t", host).addEventListener("input", function(e){ S.s3.txt = e.target.value; api.save(); paintS3(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.closest("[data-rg]")) return;
    var d = b.dataset;
    if (d.s1) { var q = d.s1.split(":"); S.s1[q[0]] = q[1]; api.save(); paintS1(); MV.focusFb(b.closest(".cl-tcard")); return; }
    if (d.tile) { sel = sel === d.tile ? "" : d.tile; paintBoard(); return; }
    if (d.col) { if (!sel) return; var k = S.bd.th + ":" + sel; if (S.bd.pl[k] !== d.col) delete S.bd.bc[k]; S.bd.pl[k] = d.col; sel = ""; api.save(); paintBoard(); return; }
    if (d.bc) { var r = d.bc.split(":"), kk = S.bd.th + ":" + r[0]; S.bd.bc[kk] = S.bd.bc[kk] === r[1] ? "" : r[1]; api.save(); paintBoard(); return; }
    if (d.s3) { var i = S.s3.chips.indexOf(d.s3); if (i >= 0) S.s3.chips.splice(i, 1); else S.s3.chips.push(d.s3); api.save(); paintS3(); }
  });
  paintS1(); paintBoard(); paintS3();

  // Sentence to steal: save the imitation to the commonplace book (with the master's line)
  var steal = $('.mv-block[data-block="steal"]'), ST = MV.C.part3.steal;
  if (steal && !$("#cl-steal-save")) {
    var row = document.createElement("div");
    row.innerHTML = '<div class="q-actions"><button type="button" class="btn ghost sm" id="cl-steal-save">' + ST.save + '</button><span class="tiny muted" id="cl-steal-st" aria-live="polite"></span></div>';
    steal.appendChild(row);
    row.addEventListener("click", function(e){
      if (e.target.id !== "cl-steal-save") return;
      var ta = $('textarea[data-w="steal"]', steal), t = ((ta && ta.value) || MV.S.writes.steal || "").trim();
      if (!t) { $("#cl-steal-st").textContent = "Write your imitation first."; return; }
      MV.eng.saveLine(t, "My imitation of " + ST.source + ": “" + ST.master + "”");
      $("#cl-steal-st").textContent = "Saved your imitation to your commonplace book.";
    });
  }
  return {};
}

// ---------- Practice 2: Reading across texts (toolkit multiple choice for X1–X5 + a structured sentence, X6) ----------
function across(host, api, a){
  var X = a.x6, st = api.S.x6 || (api.S.x6 = { text:"", tries:0, hint:0, solved:false, first:null, att:false });
  host.innerHTML = '<div id="ax-mc"></div><div class="q cl-x6" data-x6box="1"></div>';
  var mc = MV.activityTypes.mc($("#ax-mc", host), { id:a.id + "-mc", type:"mc", title:a.title, summary:a.summary, goal:a.goal, items:a.items });
  var box = $("[data-x6box]", host);
  box.innerHTML = '<div class="q-head"><span class="qn" aria-hidden="true">6</span><div class="q-prompt">' + X.prompt + '<p class="tiny muted">The lines of “Heat” in this module: “' + X.lines[0] + "” (line 1); “" + X.lines[1] + " / " + X.lines[2] + "” (lines 47–48). Analysis verbs: " + X.bank + '.</p></div></div>' +
    '<div class="jq"><label for="ax6">Your sentence</label><textarea id="ax6" rows="3"></textarea></div><ul class="checks" id="ax6c"></ul><div id="ax6a"></div>';
  var ta = $("#ax6", host); ta.value = st.text || "";
  function qspans(t){ var out = [], m, re = /[“"]([^“”"]+)[”"]/g; while ((m = re.exec(t))) out.push(m[1]); return out; }
  function checks(t){
    var N = MV.eng.norm, src = [N(X.lines[0]), N(X.lines[1] + " " + X.lines[2])];
    var q = qspans(t).some(function(s){ var n = N(s); return wc(n) >= 2 && src.some(function(L){ return (" " + L + " ").indexOf(" " + n + " ") >= 0; }); });
    var c = /\((?:Lampman,\s*)?lines?\s+\d+(?:\s*[–-]\s*\d+)?\s*\)/.test(t);
    var g = /\bgarrison\b/i.test(t), low = t.toLowerCase();
    var v = X.verbs.some(function(s){ return new RegExp("\\b" + s).test(low); });
    return [q, c, g, v];
  }
  function paint(){
    var r = checks(ta.value);
    $("#ax6c", host).innerHTML = X.checks.map(function(l, i){ return '<li class="' + (r[i] ? "yes" : "no") + '"><span class="mk" aria-hidden="true">' + (r[i] ? "✓" : "○") + "</span><span>" + l + '<span class="vh">' + (r[i] ? " (met)" : " (not met)") + "</span></span></li>"; }).join("");
    var h = "";
    if (!st.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-x6="check" data-k="x6chk">Check my sentence</button>' + MV.hintBtn("x6hint", st.hint) + "</div>" + MV.hintsHTML(X.hints, st.hint);
    if (st.last === "good" || st.solved) h += MV.fbHTML("good", "<strong>✓ Every part is there.</strong> This checks structure only; your teacher reads the analysis.");
    else if (st.last === "bad") h += MV.fbHTML("bad", "<strong>✗ Not yet.</strong> " + X.tips.filter(function(_, i){ return !checks(st.lastText || "")[i]; }).join(" ") + " Try again.");
    if (st.att) h += '<p class="an-note an-theme cl-model"><strong>One model:</strong> ' + X.model + "</p>";
    MV.keepFocus($("#ax6a", host), function(){ $("#ax6a", host).innerHTML = h; });
  }
  ta.addEventListener("input", function(){ st.text = ta.value; MV.save(); paint(); });
  box.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.act === "hint") { st.hint = Math.min(3, st.hint + 1); MV.save(); paint(); return; }
    if (b.dataset.x6 === "check") {
      var ok = checks(ta.value).every(Boolean); st.att = true; st.lastText = ta.value;
      if (ok) { st.solved = true; st.first = st.tries === 0 && st.hint < 3; st.last = "good"; } else { st.tries++; st.last = "bad"; }
      MV.save(); paint(); MV.focusFb($("#ax6a", host));
    }
  });
  paint();
  return {
    stats:function(){ var s = mc.stats(), f = s.first + (st.first ? 1 : 0), d = s.done + (st.solved ? 1 : 0), n = a.items.length + 1; return { first:f, total:n, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + n + (d < n ? " (unfinished)" : "") }; },
    missed:function(){ var g = mc.missed(); if (st.tries > 0 || st.hint >= 3) g = g.concat(MV.goalIdx(X.goal)); return g; }
  };
}

// ---------- Practice 3: @component K13 spotProse — Spot the Error for a paragraph (copied from ENG4U 09; numbered sentences) ----------
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

// ---------- @component E17 draftWorkspace (copied from ENG4U 09) — a writing area with a live word count (target range),
// saved drafts (up to 3) and a side-by-side compare with the changes marked (course plan E17) ----------
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
  host.innerHTML = '<div class="cl-dw"><label for="dw-' + o.id + '" class="cl-lab">' + o.label + '</label><textarea id="dw-' + o.id + '" class="cl-dw-ta" rows="11"></textarea>' +
    '<div class="q-actions"><span class="cl-dw-n" id="dw-' + o.id + '-n" aria-live="polite"></span><button type="button" class="btn ghost sm" id="dw-' + o.id + '-save">Save as a draft</button></div><div id="dw-' + o.id + '-list"></div><div id="dw-' + o.id + '-cmp" aria-live="polite"></div></div>';
  var ta = $("#dw-" + o.id, host); ta.value = o.get() || "";
  function count(){
    var n = wc(ta.value), msg = n < o.min ? (o.min - n) + " to go" : n > o.max ? (n - o.max) + " over" : "in range";
    $("#dw-" + o.id + "-n", host).innerHTML = "<strong>" + n + " word" + (n === 1 ? "" : "s") + "</strong> · aim for " + o.min + "–" + o.max + " (" + msg + ")";
  }
  function list(){
    var Dd = o.drafts(), el = $("#dw-" + o.id + "-list", host);
    el.innerHTML = Dd.length ? '<p class="tiny">Saved drafts: ' + Dd.map(function(d, i){ return '<button type="button" class="linkbtn" data-dwc="' + i + '" aria-pressed="' + (cmp === i) + '">Compare draft ' + d.n + " with now</button>"; }).join(" · ") + "</p>" : "";
    var cb = $("#dw-" + o.id + "-cmp", host);
    if (cmp != null && Dd[cmp]) { var df = diffWords(Dd[cmp].t, ta.value); cb.innerHTML = '<div class="cl-dw-cmp"><div><p class="tiny"><strong>Draft ' + Dd[cmp].n + '</strong> (removed words struck through)</p><p>' + df[0] + '</p></div><div><p class="tiny"><strong>Now</strong> (new words underlined)</p><p>' + df[1] + "</p></div></div>"; }
    else cb.innerHTML = "";
  }
  function changed(){ o.set(ta.value); count(); if (cmp != null) list(); if (o.onChange) o.onChange(); }
  ta.addEventListener("input", changed);
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.id === "dw-" + o.id + "-save") { var Dd = o.drafts(), t = ta.value.trim(); if (!t) return; var n = Dd.length ? Dd[Dd.length - 1].n + 1 : 1; Dd.push({ n:n, t:t }); while (Dd.length > 3) Dd.shift(); cmp = null; MV.save(); list(); return; }
    if (b.dataset.dwc != null) { var i = +b.dataset.dwc; cmp = cmp === i ? null : i; list(); }
  });
  count(); list();
  return { refresh:function(){ ta.value = o.get() || ""; count(); list(); }, ta:ta, changed:changed };
}

// ---------- Performance task: Curate a canon (canon picker + criteria chips + curator's statement; structure checks only) ----------
var task = (function(){
  var api = null, T = null, dw = null;
  function explain(){ var e = $("#task-explain"); return e ? e.value : (MV.taskState().explain || ""); }
  function data(S){
    S = S || {}; T = T || MV.C.task;
    var works = (S.works || []).filter(function(n){ return !!work(n); }), chips = (S.chips || []).filter(function(c){ return !!byId(T.chips, c); }), text = String(S.text || "");
    return { works:works, chips:chips, text:text, n:wc(text), st:cstats(works), explain:explain() };
  }
  function kwOK(d, c){ return d.text.toLowerCase().indexOf(byId(T.chips, c).kw) >= 0; }
  function checks(d){
    T = T || MV.C.task;
    var low = d.text.toLowerCase(), st = d.st;
    return [d.works.length === 6, st.eras.length >= 3, st.ind >= 1 && st.fr >= 1, st.nForms >= 2,
      d.chips.length >= 2 && d.chips.length <= 3 && d.chips.every(function(c){ return kwOK(d, c); }),
      T.missWords.some(function(w){ return low.indexOf(w) >= 0; }), d.n >= T.min && d.n <= T.max];
  }
  function titles(d){ return d.works.map(function(n){ return plainTitle(work(n)); }); }
  function chipNames(d){ return d.chips.map(function(c){ return byId(T.chips, c).t; }); }
  function paintPick(){
    var S = api.S, el = $("#tk-pick");
    MV.keepFocus(el, function(){
      var slots = ""; for (var i = 0; i < 6; i++) { var w = work(S.works[i]); slots += w ? '<li class="cl-slot full"><span class="cl-cy">' + w.yr + '</span><span class="cl-ct">' + w.t + '</span><span class="cl-ca">' + esc(w.au) + "</span></li>" : '<li class="cl-slot empty"><span class="tiny muted">Empty slot</span></li>'; }
      el.innerHTML = '<ol class="cl-slots cl-tkslots">' + slots + '</ol><div class="cl-tkcards" role="group" aria-label="The collection: tap to add or remove">' + MV.C.explore.works.map(function(w){
        var on = has(S.works, w.n);
        return '<button type="button" class="cl-tkc" data-tk="' + w.n + '" data-k="tk' + w.n + '" aria-pressed="' + on + '"><span class="cl-cy">' + w.yr + " · " + w.form + (w.ind ? " · Indigenous author" : "") + (w.lang === "fr" ? " · French" : "") + '</span><span class="cl-ct">' + w.t + '</span><span class="cl-ca">' + esc(w.au) + "</span></button>";
      }).join("") + "</div>";
    });
    var c = $("#tk-chips");
    MV.keepFocus(c, function(){ c.innerHTML = '<p class="cl-lab">' + T.labels.chips + '</p><div class="chips" role="group" aria-label="Criteria">' + T.chips.map(function(x){ var on = has(S.chips, x.id); return '<button type="button" class="chip' + (on ? " on" : "") + '" data-chip="' + x.id + '" data-k="ch' + x.id + '" aria-pressed="' + on + '">' + x.t + "</button>"; }).join("") + "</div>"; });
  }
  function paintPv(){
    var S = api.S, d = data(S), st = d.st, el = $("#tk-pv"); if (!el) return;
    var ck = function(b){ return b ? "✓" : "○"; };
    el.innerHTML = '<h4 class="cl-h" style="margin-top:0">' + T.labels.glance + '</h4><ul class="cl-glance"><li><strong>Works:</strong> ' + d.works.length + " / 6</li>" +
      "<li><strong>Eras:</strong> " + (st.eras.length ? st.eras.length + " (" + st.eras.map(eraT).join(", ") + ")" : "—") + "</li>" +
      "<li><strong>Indigenous authors:</strong> " + st.ind + " · <strong>Translated from French:</strong> " + st.fr + "</li>" +
      "<li><strong>Forms:</strong> " + (FORMS.filter(function(f){ return st.forms[f]; }).join(", ") || "—") + "</li>" +
      "<li><strong>Criteria:</strong> " + (d.chips.length ? d.chips.map(function(c){ return '<span aria-hidden="true">' + ck(kwOK(d, c)) + "</span> " + byId(T.chips, c).t + ' <span class="vh">' + (kwOK(d, c) ? "(named in your statement)" : "(not named yet)") + "</span>"; }).join(" · ") : "none chosen") + "</li>" +
      "<li><strong>Words:</strong> " + d.n + " (aim for " + T.min + "–" + T.max + ")</li></ul>" +
      (st.n ? '<p class="tiny"><strong>Who’s missing?</strong></p>' + missHTML(st) : "");
    var showModels = MV.taskState().found.length > 0;
    $("#tk-models").innerHTML = showModels ? '<details class="alg cl-models"><summary>' + T.labels.models + '</summary><p class="tiny muted">' + T.labels.modelsNote + "</p>" + T.models.map(function(m){
      return '<div class="cl-model"><h5>' + m.title + '</h5><p class="tiny"><strong>Works:</strong> ' + m.works.map(function(n){ var w = work(n); return w.t; }).join(", ") + " · <strong>Criteria:</strong> " + m.chips.map(function(c){ return byId(T.chips, c).t; }).join(", ") + "</p><p>" + m.text + "</p></div>";
    }).join("") + "</details>" : "";
  }
  function changed(){ api.save(); api.update(); paintPv(); }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; var S = a.S, L = T.labels;
      S.works = Array.isArray(S.works) ? S.works : []; S.chips = Array.isArray(S.chips) ? S.chips : []; S.drafts = Array.isArray(S.drafts) ? S.drafts : [];
      inp.innerHTML = '<div class="cl-tk"><p class="cl-lab">' + L.pick + '</p><p class="tiny muted">' + L.pickHow + '</p><p class="q-actions"><button type="button" class="btn ghost sm" data-copy="1">' + L.copy + '</button><span class="tiny muted" id="tk-cst" aria-live="polite"></span></p>' +
        '<div id="tk-pick"></div><div id="tk-chips"></div><div id="tk-draft"></div></div>';
      pv.innerHTML = '<div id="tk-pv" aria-live="polite"></div><div id="tk-models"></div>';
      dw = draftWorkspace($("#tk-draft"), { id:"canon", label:L.draft + " (" + T.min + "–" + T.max + " words)", min:T.min, max:T.max, get:function(){ return S.text; }, set:function(v){ S.text = v; }, drafts:function(){ return S.drafts; }, onChange:changed });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !inp.contains(b)) return;
        if (b.dataset.tk) { var n = +b.dataset.tk, i = S.works.indexOf(n); if (i >= 0) S.works.splice(i, 1); else if (S.works.length < 6) S.works.push(n); else { $("#tk-cst").textContent = "Six slots are full. Tap a chosen card to take it off first."; return; } $("#tk-cst").textContent = ""; paintPick(); changed(); return; }
        if (b.dataset.chip) { var c = b.dataset.chip, k = S.chips.indexOf(c); if (k >= 0) S.chips.splice(k, 1); else S.chips.push(c); paintPick(); changed(); return; }
        if (b.dataset.copy) { var sh = ((MV.S.app || {}).explore || {}).canon || []; if (!sh.length) { $("#tk-cst").textContent = L.noShelf; return; } S.works = sh.slice(0, 6); $("#tk-cst").textContent = L.copied; paintPick(); changed(); }
      });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ a.update(); });
      var ck = $("#task-check"); if (ck) ck.addEventListener("click", function(){ setTimeout(paintPv, 0); });
      paintPick(); paintPv();
      extras();
    },
    read:function(){ T = T || MV.C.task; return data(api ? api.S : MV.taskState().app); },
    valid:function(d){ return d.works.length || d.text.trim() ? true : "Choose your six works and write your curator’s statement first."; },
    checks:checks,
    tips:function(d, res){ var out = []; res.forEach(function(ok, i){ if (ok) return; if (i === 4 && (d.chips.length < 2 || d.chips.length > 3)) out.push(T.chipTip); out.push(T.tips[i]); }); return out; },
    key:function(d){ return titles(d).join(", ") + " | " + chipNames(d).join(", "); }, label:function(k){ return esc(k); }, text:function(k){ return k; },
    summary:function(ts){
      T = T || MV.C.task;
      var d = data(ts.app || {}), r = checks(d), done = r.every(Boolean), L = [];
      L.push((T.summary || "Curate a canon") + ": " + (done ? "complete (" + titles(d).join(", ") + "; criteria: " + chipNames(d).join(", ") + "; " + d.n + " words)" : "not complete yet"));
      if (!done) { L.push("  Works chosen: " + (titles(d).join(", ") || "(none yet)")); L.push("  Criteria: " + (chipNames(d).join(", ") || "(none yet)")); L.push("  Checklist: " + r.filter(Boolean).length + "/" + r.length + " lines met"); }
      L.push("  Curator’s statement (" + d.n + " words):");
      L.push("    " + (d.text.trim() || "(not written yet)"));
      L.push("  Teacher rubric (Ontario achievement chart, levels 1–4):");
      var RB = T.rubric; for (var c = 1; c < RB[0].length; c++) L.push("    " + RB[0][c] + ": " + RB.slice(1).map(function(row){ return row[0] + " " + row[c]; }).join("; "));
      return L;
    }
  };
})();

// ---------- Reflect extras (sample principles, word count, trivium tag, commonplace book) ----------
function extras(){
  var R = MV.C.reflect, sheet = $("#art-sheet"), art = $("#art");
  if (sheet && art && R.artSamples && !$("#art-samples")) {
    var d = document.createElement("details"); d.id = "art-samples"; d.className = "alg art-samples";
    d.innerHTML = "<summary>See two sample principles</summary><p class=\"tiny muted\">They show the form. Always write your own.</p>" + R.artSamples.map(function(s){ return '<p class="an-note an-theme"><strong>Principle:</strong> “' + s.p + "”<br><strong>Example:</strong> " + s.m + "</p>"; }).join("");
    sheet.insertBefore(d, art);
  }
  if (sheet && art && R.art.intro && !$("#cl-artintro")) { var p = document.createElement("p"); p.id = "cl-artintro"; p.innerHTML = R.art.intro; sheet.insertBefore(p, $("#art-samples") || art); }
  var ap = $("#art-p");
  if (ap && !$("#cl-artn")) {
    var n = document.createElement("p"); n.id = "cl-artn"; n.className = "tiny muted"; n.setAttribute("aria-live", "polite"); ap.parentNode.appendChild(n);
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
  activities:{ across:across, spot:spotProse },
  task:task,
  summaryLines:function(){ var p = (MV.S.writes["art-principle"] || "").trim(); return p ? ["New principle: " + p] : []; },
  onShow:function(v){
    MV.eng.stop();
    if (v !== "start" && HR.stop) HR.stop();
    if (EX && v !== "explore") EX.stop();
    if (v === "reflect") extras();
  }
});
})();
