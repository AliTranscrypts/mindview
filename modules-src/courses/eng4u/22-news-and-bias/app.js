// ENG4U 22 News, Bias & Source Evaluation: hero (Milton's sentence pressed onto paper, three rising steps, a phone feed), the
// newsroom simulator (Explore: Editor mode with headline chips, photo, placement, sources and facts, a mock front page, the reader
// meter and readouts; Reader mode with the real-coverage slot and three practice-model outlets; Lateral reading mode in a simulated
// browser), Check before you share (Part 3: five SIFT stations), Name the bias (sorter + real-world extension), Lateral reading lab
// (MC + a headline chip builder), Spot the Error (toolkit K13) and "Fair front page" (task). Texts and data in content.mjs.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function wc(s){ return MV.eng.wordCount(s || ""); }
function has(a, x){ return a.indexOf(x) >= 0; }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
function sgn(n){ return n > 0 ? "+" + n : n < 0 ? "−" + (-n) : "0"; }
function sameSet(a, b){ return a.length === b.length && a.every(function(x){ return has(b, x); }); }

// ---------- @component radioGroup (copied from ENG4U 13; adds data-k keys so MV.keepFocus can restore focus) ----------
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

// ---------- original illustrations (practice model; no real people, outlets or logos) ----------
function svgWrap(inner, label){ return '<svg class="nb-ill" viewBox="0 0 160 100" role="img" aria-label="' + esc(label) + '" focusable="false">' + inner + "</svg>"; }
function photoSVG(id, label){
  var g = {
    a:'<rect class="nb-f2" x="0" y="66" width="160" height="34"/><path class="nb-s" d="M14 100 L30 68 M50 100 L66 68 M86 100 L102 68 M122 100 L138 68"/>' +
      '<path class="nb-s" d="M44 68 V30 M116 68 V30"/><circle class="nb-f1 nb-s" cx="44" cy="22" r="11"/><circle class="nb-f1 nb-s" cx="116" cy="22" r="11"/>' +
      '<text class="nb-t" x="44" y="27">P</text><text class="nb-t" x="116" y="27">P</text><path class="nb-s nb-thick" d="M36 14 L52 30 M108 14 L124 30"/>',
    b:'<rect class="nb-f2" x="0" y="86" width="160" height="14"/><rect class="nb-f1 nb-s" x="74" y="28" width="62" height="50" rx="3"/><path class="nb-f1 nb-s" d="M136 44 H150 L156 58 V78 H136 Z"/>' +
      '<circle class="nb-f2 nb-s" cx="90" cy="82" r="7"/><circle class="nb-f2 nb-s" cx="142" cy="82" r="7"/><text class="nb-t nb-tsm" x="105" y="56">DELIVERY</text>' +
      '<circle class="nb-s" cx="18" cy="84" r="9"/><circle class="nb-s" cx="52" cy="84" r="9"/><path class="nb-s" d="M18 84 L30 70 L46 70 L52 84 M30 70 L36 84 L46 70 M44 66 L48 66"/>' +
      '<circle class="nb-f1 nb-s" cx="34" cy="50" r="6"/><path class="nb-s" d="M34 56 L36 70 M34 60 L46 66"/>',
    c:'<path class="nb-f2 nb-s" d="M10 96 Q80 30 150 96"/><path class="nb-s" d="M26 96 Q80 46 134 96 M42 96 Q80 62 118 96"/><rect class="nb-f1 nb-s" x="62" y="10" width="36" height="16" rx="2"/>' +
      '<circle class="nb-f1 nb-s" cx="80" cy="6" r="4"/>' + [[24, 82], [40, 66], [60, 56], [100, 56], [120, 66], [136, 82], [48, 84], [70, 72], [90, 72], [112, 84]].map(function(p){ return '<circle class="nb-f1 nb-s" cx="' + p[0] + '" cy="' + p[1] + '" r="4"/>'; }).join(""),
    d:'<rect class="nb-f1 nb-s" x="10" y="20" width="140" height="80"/><path class="nb-f2 nb-s" d="M6 20 L154 20 L146 8 L14 8 Z"/><text class="nb-t nb-tsm" x="80" y="17">BAKERY</text>' +
      '<rect class="nb-f2 nb-s" x="58" y="34" width="44" height="66"/><rect class="nb-f1 nb-s" x="18" y="34" width="30" height="26"/><rect class="nb-f1 nb-s" x="112" y="34" width="30" height="26"/>' +
      '<circle class="nb-f1 nb-s" cx="80" cy="54" r="8"/><path class="nb-s" d="M76 51 L79 52 M84 51 L81 52 M77 59 Q80 56 83 59 M80 62 V88 M80 70 L70 62 L74 54 M80 70 L90 78"/>',
    flood:'<rect class="nb-f2" x="0" y="54" width="160" height="46"/><path class="nb-s" d="M0 60 Q10 55 20 60 T40 60 T60 60 T80 60 T100 60 T120 60 T140 60 T160 60 M0 74 Q10 69 20 74 T40 74 T60 74 T80 74 T100 74 T120 74 T140 74 T160 74"/>' +
      '<path class="nb-s" d="M20 54 V20 M140 54 V20"/><rect class="nb-f1 nb-s" x="10" y="8" width="20" height="14"/><circle class="nb-s" cx="72" cy="88" r="6"/><circle class="nb-s" cx="92" cy="88" r="6"/><path class="nb-s" d="M72 88 L80 80 L92 88 M80 80 L86 80"/>',
    mayor:'<g class="nb-snow">' + [[12, 10], [40, 22], [70, 8], [104, 18], [140, 12], [24, 40], [132, 44], [150, 70], [8, 66], [56, 30]].map(function(p){ return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2"/>'; }).join("") + "</g>" +
      '<rect class="nb-f2" x="0" y="88" width="160" height="12"/><circle class="nb-s" cx="56" cy="80" r="11"/><circle class="nb-s" cx="110" cy="80" r="11"/><path class="nb-s" d="M56 80 L72 60 L96 60 L110 80 M72 60 L82 80 L96 60 M92 54 L100 54"/>' +
      '<circle class="nb-f1 nb-s" cx="80" cy="26" r="8"/><path class="nb-f1 nb-s" d="M72 34 H88 L92 58 H70 Z"/><path class="nb-s" d="M80 34 L78 44 L80 50 L82 44 Z M88 40 L98 54"/>'
  }[id] || "";
  return svgWrap(g, label || "");
}

// ---------- hero: Milton's sentence on paper; three rising steps; the paper slides away to a phone feed ----------
var HR = { run:0, tok:null };
function hero(){
  var H = MV.C.hero, host = $("#nb-hero"); if (!host) return;
  var W = H.quote.split(" "), stepAt = {}; H.steps.forEach(function(s, i){ stepAt[s[0]] = i; });
  host.innerHTML = '<div class="nb-stage"><div class="nb-paper"><blockquote class="nb-old">' + W.map(function(w, i){ return '<span class="nb-w" data-wi="' + i + '">' + esc(w) + "</span>"; }).join(" ") + '</blockquote><p class="eng-cite">' + H.cite + "</p></div>" +
    '<div class="nb-phone" aria-hidden="true"><div class="nb-feed">' + '<p class="nb-fh">' + esc(H.feed[0]) + '</p><p class="nb-fq">“' + esc(H.quote) + '”<span>' + MV.plain(H.cite) + '</span></p><p class="nb-fh">' + esc(H.feed[1]) + '</p><p class="nb-fh">' + esc(H.feed[2]) + "</p></div></div></div>" +
    '<ol class="nb-steps" aria-label="The three liberties">' + H.steps.map(function(s, i){ return '<li class="nb-step" data-st="' + i + '"><span>' + esc(s[1]) + "</span></li>"; }).join("") + "</ol>" +
    '<p class="nb-hcap">' + H.caption + "</p>" +
    '<div class="nb-hctl"><button type="button" class="btn ghost sm" id="nb-hlisten" hidden>' + H.listen + '</button><button type="button" class="btn ghost sm" id="nb-hagain" hidden>' + H.watch + '</button><span class="tiny muted" id="nb-hnote" hidden>' + H.noVoice + "</span></div>";
  var WS = $$(".nb-w", host), ST = $$(".nb-step", host);
  function lit(n){ WS.forEach(function(e, i){ e.classList.toggle("lit", i <= n); e.classList.toggle("speaking", i === n); }); ST.forEach(function(e, i){ var at = H.steps[i][0]; e.classList.toggle("up", n >= at); }); }
  function reset(){ host.classList.remove("phone", "cap", "fin"); host.classList.add("anim"); lit(-1); }
  function finish(){ host.classList.remove("anim"); host.classList.add("phone", "cap", "fin"); lit(W.length - 1); WS.forEach(function(e){ e.classList.remove("speaking"); }); btns(); }
  function at(me, ms, fn){ setTimeout(function(){ if (me === HR.run) fn(); }, ms); }
  function tail(me, t0){ at(me, t0, function(){ lit(W.length - 1); host.classList.add("phone"); }); at(me, t0 + 1400, function(){ host.classList.add("cap"); }); at(me, t0 + 2000, finish); }
  function animate(){
    var me = ++HR.run; stopRead(); reset();
    W.forEach(function(_, i){ at(me, 400 + i * 230, function(){ lit(i); }); });
    tail(me, 400 + W.length * 230 + 700);
  }
  function stopRead(){ if (HR.tok) { try { HR.tok.stop(); } catch (e) {} HR.tok = null; } MV.eng.stop(); }
  function listen(){
    var me = ++HR.run; stopRead();
    if (!MV.reduceMotion) reset(); else finish();
    HR.tok = MV.eng.say(H.quote, { voice:VOICE, rate:0.85, onWord:function(i){ if (me === HR.run && !MV.reduceMotion) lit(i); }, onEnd:function(){ HR.tok = null; if (me !== HR.run) return; if (MV.reduceMotion) finish(); else tail(me, 200); } });
  }
  function btns(){ $("#nb-hlisten").hidden = !VOICE; $("#nb-hagain").hidden = MV.reduceMotion; $("#nb-hnote").hidden = !!VOICE; }
  $("#nb-hlisten").addEventListener("click", listen);
  $("#nb-hagain").addEventListener("click", animate);
  if (MV.reduceMotion) finish(); else animate();
  voiceReady(btns);
  HR.stop = function(){ stopRead(); if (host.classList.contains("anim")) { HR.run++; finish(); } };
}

// ---------- the newsroom's teaching model ----------
function EC(){ return MV.C.explore; }
function score(s){
  var C = EC(), parts = [], v = byId(C.verbs, s.verb), d = byId(C.details, s.detail), p = byId(C.photos, s.photo);
  if (v && v.pts) parts.push({ type:"word", label:"“" + v.t + "”", pts:v.pts });
  if (d && d.pts) parts.push({ type:"word", label:"“" + d.t + "”", pts:d.pts });
  if (p && p.pts) parts.push({ type:"images", label:"photo (" + p.id + ")", pts:p.pts });
  (s.sources || []).forEach(function(id){ var q = byId(C.sources, id); if (q && q.pts) parts.push({ type:"sources", label:q.n, pts:q.pts }); });
  (s.facts || []).forEach(function(id){ var f = byId(C.facts, id); if (f && f.pts) parts.push({ type:"omission", label:f.t.toLowerCase(), pts:f.pts }); });
  var raw = parts.reduce(function(a, x){ return a + x.pts; }, 0);
  return { raw:raw, imp:Math.max(-3, Math.min(3, raw)), parts:parts };
}
function sides(list, ids){ var pos = false, neg = false; (ids || []).forEach(function(id){ var x = byId(list, id); if (x && x.pts > 0) pos = true; if (x && x.pts < 0) neg = true; }); return { pos:pos, neg:neg }; }
function headline(s){
  var C = EC(), v = byId(C.verbs, s.verb), o = byId(C.objects, s.obj), d = byId(C.details, s.detail);
  return "Council " + (v ? v.t : "…") + " " + (o ? o.t : "…") + (!d || d.id === "none" ? "" : d.id === "vote" ? ", 7–4" : " " + d.t);
}
function leadSents(s){
  var C = EC(), out = [];
  if (!has(s.facts, "vote")) out.push("Port Calder will build a 1.2 km protected bike lane on Harbour Street.");
  C.facts.forEach(function(f){ if (has(s.facts, f.id)) out.push(f.s); });
  C.sources.forEach(function(q){ if (has(s.sources, q.id)) out.push(q.lead + ", “" + q.q + "”"); });
  return out;
}
function typeTag(id){ var t = byId(EC().types, id); return '<span class="an-tag an-' + t.role + '">' + t.t + "</span>"; }
function meterHTML(imp, words, anim){
  var pct = (imp + 3) / 6 * 100, w = words[imp + 3];
  return '<div class="nb-meter' + (anim ? " nb-anim" : "") + '" role="img" aria-label="' + esc("Reader impression " + sgn(imp) + ", " + w + ". Scale from minus 3, a bad decision, to plus 3, a good decision.") + '">' +
    '<div class="nb-mtop"><span class="nb-mt">Reader impression</span><strong class="nb-mval">' + sgn(imp) + ", " + w.charAt(0).toLowerCase() + w.slice(1) + "</strong></div>" +
    '<div class="nb-mscale" aria-hidden="true">' + [-3, -2, -1, 0, 1, 2, 3].map(function(k){ return '<span class="nb-mtick" style="left:' + ((k + 3) / 6 * 100) + '%"><i></i><b>' + sgn(k) + "</b></span>"; }).join("") +
    '<span class="nb-needle" style="left:' + pct + '%"></span></div><div class="nb-mends" aria-hidden="true"><span>a bad decision</span><span>a good decision</span></div></div>';
}

// ---------- @component E13 sourceEvaluator — a simulated browser: tab buttons, an address bar, a page labelled "Simulation" ----------
// simBrowser(host, {key, label, tabs:[{id, t, url, html | html()}], cur, onOpen(id)}) -> {open(id, quiet), get(), repaint()}
function simBrowser(host, o){
  var cur = o.cur || o.tabs[0].id;
  function paint(){
    var t = byId(o.tabs, cur) || o.tabs[0], html = typeof t.html === "function" ? t.html() : t.html;
    MV.keepFocus(host, function(){
      host.innerHTML = '<div class="nb-br"><div class="nb-br-tabs" role="group" aria-label="' + esc(o.label || "Browser tabs") + '">' + o.tabs.map(function(x){
        return '<button type="button" class="nb-br-tab" aria-pressed="' + (x.id === cur) + '" data-tab="' + x.id + '" data-k="tab' + (o.key || "") + x.id + '">' + x.t + "</button>";
      }).join("") + '</div><div class="nb-br-url"><span class="nb-lock" aria-hidden="true"></span><span>' + esc(t.url || "") + '</span></div><div class="nb-br-page"><span class="nb-sim">Simulation</span>' + html + "</div></div>";
    });
  }
  function open(id, quiet){ cur = id; paint(); if (!quiet && o.onOpen) o.onOpen(id); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-tab]"); if (b && host.contains(b)) open(b.dataset.tab); });
  paint();
  return { open:open, get:function(){ return cur; }, repaint:paint };
}
function postHTML(p, img){
  return '<div class="nb-post"><div class="nb-post-h"><span class="nb-av" aria-hidden="true"></span><span><strong>' + esc(p.name || p.handle) + "</strong>" + (p.name ? ' <span class="nb-badge" title="badge">✓</span> <span class="tiny muted">' + esc(p.handle) + "</span>" : "") + (p.followers ? '<br><span class="tiny muted">' + p.followers + "</span>" : "") + "</span></div>" +
    '<p class="nb-post-t">' + p.text + "</p>" + (img || "") + (p.reposts ? '<p class="tiny muted">' + p.reposts + "</p>" : "") + "</div>";
}
function siftHTML(list, lit){ return '<ol class="nb-sift">' + list.map(function(m){ var on = !!lit[m.id]; return '<li class="' + (on ? "on" : "") + '"><b>' + m.id + "</b> " + m.t + '<span class="vh">' + (on ? " (done)" : " (not yet)") + "</span></li>"; }).join("") + "</ol>"; }

// ---------- Explore: newsroom simulator (Editor · Reader · Lateral reading) ----------
var EX = null;
function explore(host, api){
  var C = api.content, S = api.S, R = C.readout, B = C.base, fx = {};
  ["verb", "obj", "detail", "photo", "place"].forEach(function(k){ if (!S[k]) S[k] = B[k]; });
  if (!Array.isArray(S.sources)) S.sources = B.sources.slice();
  if (!Array.isArray(S.facts)) S.facts = B.facts.slice();
  S.mode = S.mode || "editor"; S.rd = S.rd || { set:"model" }; S.real = S.real || { event:"", v:[{}, {}, {}] }; S.lt = S.lt || { seen:{} }; S.lt.seen = S.lt.seen || {};
  var RS = C.realSlot || {};

  host.innerHTML = '<div class="nb-ex"><div id="nb-mode"></div><p class="how" id="nb-how"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div id="nb-main" data-mv="graph">' +
    // Editor
    '<div id="nb-ed" class="nb-ed"><div class="nb-ctl"><details class="alg nb-fsd"><summary>Fact sheet (every fact is accurate)</summary>' + C.factSheet + "</details>" +
    '<fieldset class="nb-fs-set"><legend>Headline</legend><p class="nb-fixed"><span class="rg-lab">Subject</span> Council <span class="tiny muted">(fixed)</span></p><div id="nb-verb"></div><div id="nb-obj"></div><div id="nb-det"></div></fieldset>' +
    '<div id="nb-photo" class="nb-photos"></div><div id="nb-place"></div>' +
    '<fieldset class="nb-cbs"><legend>Sources <span class="tiny muted" id="nb-scount"></span></legend>' + C.sources.map(function(q){ return '<label class="nb-cb"><input type="checkbox" data-src="' + q.id + '"><span><strong>' + q.n + "</strong> " + esc(q.who) + ', <span class="muted">' + esc(q.role) + "</span>: “" + esc(q.q) + "”</span></label>"; }).join("") + "</fieldset>" +
    '<fieldset class="nb-cbs"><legend>Facts included</legend>' + C.facts.map(function(f){ return '<label class="nb-cb nb-cbf"><input type="checkbox" data-fact="' + f.id + '"><span>' + f.t + "</span></label>"; }).join("") + "</fieldset>" +
    '<p class="nb-lock-n" id="nb-lockn" hidden><strong>Sources and facts are locked for challenge 2.</strong> <button type="button" class="btn ghost sm" id="nb-unlock">Unlock</button></p></div>' +
    '<div class="nb-pvw"><div class="nb-msticky" id="nb-meter"></div><div id="nb-pv"></div><details class="alg nb-about"><summary>About this model</summary><p>' + C.about + "</p></details></div></div>" +
    // Reader
    '<div id="nb-rd" class="nb-rd" hidden><div id="nb-rdset"></div><div id="nb-rd-real"></div><div id="nb-rd-model"></div></div>' +
    // Lateral
    '<div id="nb-lt" class="nb-lt" hidden><div id="nb-ltsift"></div><div id="nb-ltbr"></div><p class="tiny muted">' + C.lateral.note + "</p></div>" +
    '</div><div class="nb-readw"><dl class="read nb-read" id="nb-read" aria-live="polite"></dl></div><p class="an-note an-theme nb-aha" id="nb-aha" hidden><strong>The aha:</strong> ' + C.aha + "</p></div>";

  var modeRG = radios($("#nb-mode", host), { label:"Mode", key:"md", options:C.modes, value:S.mode, onChange:function(v){ setMode(v); } });
  function setMode(v){ fx = {}; MV.banner("", ""); S.mode = v; modeRG.set(v); api.save(); show(); paint(); MV.changed(); }
  function set(k, v){ fx = {}; S[k] = v; api.save(); paint(); MV.changed(); }
  var rg = {
    verb:radios($("#nb-verb", host), { label:"Verb", key:"vb", cls:"chips", options:C.verbs, value:S.verb, onChange:function(v){ set("verb", v); } }),
    obj:radios($("#nb-obj", host), { label:"Object", key:"ob", cls:"chips", options:C.objects, value:S.obj, onChange:function(v){ set("obj", v); } }),
    detail:radios($("#nb-det", host), { label:"Detail", key:"dt", cls:"chips", options:C.details, value:S.detail, onChange:function(v){ set("detail", v); } }),
    photo:radios($("#nb-photo", host), { label:"Photo", key:"ph", cls:"chips nb-phrg", options:C.photos.map(function(p){ return { id:p.id, t:'<span class="nb-thumb" aria-hidden="true">' + photoSVG(p.id, "") + "</span><span>(" + p.id + ") " + p.t + "</span>" }; }), value:S.photo, onChange:function(v){ set("photo", v); } }),
    place:radios($("#nb-place", host), { label:"Placement", key:"pl", options:C.places, value:S.place, onChange:function(v){ set("place", v); } })
  };
  function syncControls(){
    ["verb", "obj", "detail", "photo", "place"].forEach(function(k){ rg[k].set(S[k]); });
    $$("[data-src]", host).forEach(function(cb){ cb.checked = has(S.sources, cb.dataset.src); cb.disabled = !!S.lock || (!cb.checked && S.sources.length >= 3); });
    $$("[data-fact]", host).forEach(function(cb){ cb.checked = has(S.facts, cb.dataset.fact); cb.disabled = !!S.lock; });
    $("#nb-scount", host).textContent = "(up to 3; " + S.sources.length + " chosen)";
    $("#nb-lockn", host).hidden = !S.lock;
  }
  host.addEventListener("change", function(e){
    var cb = e.target;
    if (cb.dataset.src) { var id = cb.dataset.src; S.sources = S.sources.filter(function(x){ return x !== id; }); if (cb.checked && S.sources.length < 3) S.sources.push(id); }
    else if (cb.dataset.fact) { var f = cb.dataset.fact; S.facts = S.facts.filter(function(x){ return x !== f; }); if (cb.checked) S.facts.push(f); }
    else return;
    fx = {}; api.save(); paint(); MV.changed();
  });
  $("#nb-unlock", host).addEventListener("click", function(){ S.lock = false; api.save(); paint(); MV.changed(); });

  // ----- Editor preview -----
  function pageHTML(s){
    var C2 = EC(), p = byId(C2.photos, s.photo), lead = leadSents(s), front = s.place === "front";
    var fig = '<figure class="nb-fig"><div class="nb-photo">' + photoSVG(p.id, p.t) + '</div><figcaption class="tiny muted">(' + p.id + ") " + p.t + "</figcaption></figure>";
    var story = '<article class="nb-story"><h4 class="nb-hl">' + esc(headline(s)) + "</h4>" + (front ? fig : "") + '<div class="nb-lead">' + lead.map(function(t){ return "<p>" + esc(t) + "</p>"; }).join("") + "</div></article>";
    if (front) return '<div class="nb-page nb-front"><div class="nb-mast"><span>THE CITY PAPER</span><span class="tiny">Front page</span></div>' + story + "</div>";
    return '<div class="nb-page nb-p14"><div class="nb-mast nb-mast-sm"><span>The City Paper</span><span class="tiny">Page 14</span></div><div class="nb-p14g"><div class="nb-filler" aria-hidden="true"><b>Classified ads</b><i></i><i></i><i></i><i></i><b>Weather</b><i></i><i></i></div>' +
      '<div class="nb-p14s">' + story.replace('class="nb-story"', 'class="nb-story nb-small"').replace("</h4>", "</h4>" + fig) + "</div></div></div>";
  }
  function flagsHTML(sc){
    if (!sc.parts.length) return '<span class="muted">none: no element carries points</span>';
    return EC().types.map(function(t){
      var ps = sc.parts.filter(function(x){ return x.type === t.id; }); if (!ps.length) return "";
      return '<span class="nb-flag' + (fx.flag === t.id ? " nb-flash" : "") + '">' + typeTag(t.id) + " " + ps.map(function(x){ return x.label + " " + sgn(x.pts); }).join(", ") + "</span>";
    }).join(" ");
  }
  function balanceHTML(){
    var a = sides(EC().sources, S.sources), b = sides(EC().facts, S.facts), v = byId(EC().verbs, S.verb), mk = function(ok, t){ return t + " " + (ok ? "✔" : "✗") + '<span class="vh">' + (ok ? " yes" : " no") + "</span>"; };
    return mk(a.pos && a.neg, "Both sides quoted") + " · " + mk(b.pos && b.neg, "Pro and con facts") + " · " + mk(v && v.pts === 0, "Neutral verb");
  }

  // ----- Reader mode -----
  var rdRG = radios($("#nb-rdset", host), { label:"Text set", key:"rs", options:C.reader.sets, value:S.rd.set, onChange:function(v){ S.rd.set = v; api.save(); show(); paint(); } });
  function realHTML(){
    var RD = C.reader, h = "";
    if (RS.versions && RS.versions.length) h += '<div class="nb-realv">' + RS.versions.map(function(v, i){ return '<div class="nb-rv"><p class="tiny muted">Version ' + (i + 1) + (v.credit ? ": " + v.credit : "") + "</p>" + v.html + "</div>"; }).join("") + "</div>";
    else h += '<p class="nb-slot">' + RD.slotEmpty + "</p>";
    if (RS.worked) h += '<details class="alg"><summary>Your teacher’s first pass (a model diagnosis)</summary>' + RS.worked + "</details>";
    h += '<p class="how">' + RD.ask + '</p><div class="jq"><label for="nb-rev">The event</label><input id="nb-rev" class="txtin" type="text" autocomplete="off" data-real="event" value="' + esc(RS.event || S.real.event || "") + '"></div>';
    h += [0, 1, 2].map(function(i){
      var v = S.real.v[i] || (S.real.v[i] = {});
      return '<fieldset class="nb-rvf"><legend>Version ' + (i + 1) + "</legend>" + RD.fields.map(function(f){ return '<div class="jq nb-rq"><label for="nb-r' + i + f.id + '">' + f.t + '</label><input id="nb-r' + i + f.id + '" class="txtin" type="text" autocomplete="off" data-real="' + i + ":" + f.id + '" value="' + esc(v[f.id] || "") + '"></div>'; }).join("") +
        '<div id="nb-rf' + i + '"></div></fieldset>';
    }).join("");
    return h + '<p class="tiny muted">' + RD.accept + "</p>";
  }
  function outletHTML(o){
    var lead = o.lead.map(function(t){ return "<p>" + esc(t) + "</p>"; }).join("");
    var fig = o.photo ? '<figure class="nb-fig' + (o.big ? " nb-big" : "") + '"><div class="nb-photo">' + photoSVG(o.photo, byId(EC().photos, o.photo).t) + "</div></figure>" : "";
    return '<article class="nb-out nb-out-' + o.place + '"><div class="nb-mast nb-mast-sm"><span><i>' + o.name + '</i></span><span class="tiny">' + o.where + "</span></div>" +
      (o.big ? fig : "") + '<h4 class="nb-hl' + (o.place === "p14" ? " nb-hl-sm" : "") + '">' + esc(o.head) + "</h4>" + (o.big ? "" : fig) + '<div class="nb-lead">' + lead + "</div>" + '<div id="nb-om' + o.id + '" class="nb-omatch"></div></article>';
  }
  function modelHTML(){
    return '<div class="nb-outs">' + C.outlets.map(outletHTML).join("") + '</div><div id="nb-ofact" class="nb-ofact"></div>';
  }
  function readerRadios(){
    var three = EC().types.filter(function(t){ return t.id !== "sources"; });
    C.outlets.forEach(function(o){ radios($("#nb-om" + o.id, host), { label:"Main bias type", aria:"Main bias type for " + MV.plain(o.name), key:"om" + o.id, cls:"chips", options:three, value:S.rd[o.id] || "", onChange:function(v){ fx = {}; S.rd[o.id] = v; api.save(); paintRead(); MV.changed(); } }); });
    var fs = ["injuries", "grant", "cyclists"].map(function(id){ var f = byId(EC().facts, id); return { id:id, t:f.s }; });
    radios($("#nb-ofact", host), { label:"The one fact that would most improve the <i>Courier</i>’s balance", aria:"The one fact that would most improve the Courier’s balance", key:"of", cls:"chips nb-wide", options:fs, value:S.rd.fact || "", onChange:function(v){ S.rd.fact = v; api.save(); paintRead(); MV.changed(); } });
  }
  function realRadios(){ [0, 1, 2].forEach(function(i){ radios($("#nb-rf" + i, host), { label:C.reader.frameLabel, aria:C.reader.frameLabel + ", version " + (i + 1), key:"rf" + i, cls:"chips", options:EC().types, value:S.real.v[i].frame || "", onChange:function(v){ S.real.v[i].frame = v; api.save(); paintRead(); } }); }); }
  host.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset.real) return;
    if (t.dataset.real === "event") S.real.event = t.value; else { var p = t.dataset.real.split(":"); S.real.v[+p[0]][p[1]] = t.value; }
    api.save(); MV.paintSummary && MV.paintSummary();
  });
  $("#nb-rd-real", host).innerHTML = realHTML(); realRadios();
  $("#nb-rd-model", host).innerHTML = modelHTML(); readerRadios();

  // ----- Lateral reading mode -----
  var LT = C.lateral, tabs = LT.tabs.map(function(t){ return t.id === "post" ? { id:t.id, t:t.t, url:t.url, html:function(){ return postHTML(LT.post); } } : t; });
  var br = simBrowser($("#nb-ltbr", host), { key:"lt", label:"Browser tabs", tabs:tabs, cur:S.lt.tab || "post", onOpen:function(id){ S.lt.tab = id; if (id !== "post") S.lt.seen[id] = 1; api.save(); paint(); MV.changed(); } });
  function siftLit(){ var s = S.lt.seen, lit = {}; if (Object.keys(s).length) lit.S = 1; LT.tabs.forEach(function(t){ if (t.sift && s[t.id]) lit[t.sift] = 1; }); return lit; }

  // ----- show / paint -----
  function show(){
    $("#nb-ed", host).hidden = S.mode !== "editor"; $("#nb-rd", host).hidden = S.mode !== "reader"; $("#nb-lt", host).hidden = S.mode !== "lateral";
    $("#nb-rd-real", host).hidden = S.rd.set !== "real"; $("#nb-rd-model", host).hidden = S.rd.set !== "model";
    $("#nb-how", host).innerHTML = C.how[S.mode];
  }
  function paintRead(){
    var rows;
    if (S.mode === "editor") {
      var sc = score(S), w = C.meterWords[sc.imp + 3];
      rows = [[R.imp, sgn(sc.imp) + " “" + w + "”" + (sc.raw !== sc.imp ? ' <span class="tiny muted">(sum ' + sgn(sc.raw) + ", kept within ±3)</span>" : "")],
        [R.importance, S.place === "front" ? "High (front page)" : "Low (page 14)"], [R.balance, balanceHTML()], [R.flags, flagsHTML(sc)], [R.facts, S.facts.length + " of " + C.facts.length]];
      if (fx.change) rows.unshift(["What changed", fx.change]);
    } else if (S.mode === "reader") {
      if (S.rd.set === "model") {
        var T = function(id){ var t = byId(EC().types, S.rd[id]); return t ? t.t : "not chosen"; };
        rows = C.outlets.map(function(o){ return ["<i>" + o.name + "</i>", T(o.id)]; });
        var f = byId(EC().facts, S.rd.fact); rows.push(["Fact to add to the <i>Courier</i>", f ? f.t : "not chosen"]);
      } else {
        var done = S.real.v.filter(function(v){ return v.frame && (v.credit || "").trim(); }).length;
        rows = [["Event", esc(RS.event || S.real.event || "not entered")], ["Versions diagnosed", done + " of 3"]];
      }
    } else {
      var lit = siftLit();
      rows = [["Tab open", byId(LT.tabs, S.lt.tab || "post").t], ["SIFT moves used", LT.sift.filter(function(m){ return lit[m.id]; }).map(function(m){ return m.t; }).join(" · ") || "none yet"]];
      $("#nb-ltsift", host).innerHTML = siftHTML(LT.sift, lit);
    }
    $("#nb-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paint(){
    if (S.mode === "editor") {
      var sc = score(S);
      if (sc.imp <= -2) S.lo = true; if (sc.imp >= 2) S.hi = true;
      syncControls();
      paintMeter(sc.imp);
      $("#nb-pv", host).innerHTML = pageHTML(S);
      $("#nb-aha", host).hidden = !(S.lo && S.hi) && !(MV.S.preds && MV.S.preds.p1);
    } else $("#nb-aha", host).hidden = true;
    paintRead();
  }
  // the needle sweeps: once drawn, the meter is updated in place (with reduced motion it jumps; see app.css)
  function paintMeter(imp){
    var m = $("#nb-meter .nb-meter", host), w = C.meterWords[imp + 3];
    if (!m) { $("#nb-meter", host).innerHTML = meterHTML(imp, C.meterWords, !MV.reduceMotion); return; }
    $(".nb-needle", m).style.left = ((imp + 3) / 6 * 100) + "%";
    $(".nb-mval", m).textContent = sgn(imp) + ", " + w.charAt(0).toLowerCase() + w.slice(1);
    m.setAttribute("aria-label", "Reader impression " + sgn(imp) + ", " + w + ". Scale from minus 3, a bad decision, to plus 3, a good decision.");
  }
  show(); paint();

  // "Set it up" buttons in the challenge prompts
  document.addEventListener("click", function(e){
    var b = e.target.closest(".nb-setup"); if (!b) return;
    var k = b.dataset.setup;
    if (k === "tc3") { S.rd.set = "model"; rdRG.set("model"); setMode("reader"); }
    else {
      if (k === "tc2") { S.lock = true; S.sources = B.sources.slice(); S.facts = B.facts.slice(); if (S.detail !== "none" && S.detail !== "vote") S.detail = "none"; }
      else S.lock = false;
      setMode("editor");
    }
    var g = $("#nb-main", host); if (g) g.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
  });

  function applyBase(){ ["verb", "obj", "detail", "photo", "place"].forEach(function(k){ S[k] = B[k]; }); S.sources = B.sources.slice(); S.facts = B.facts.slice(); S.lock = false; }
  EX = {
    stop:function(){ fx = {}; if (S.mode === "editor") paint(); },
    predict:{
      start:function(p){
        MV.eng.stop(); fx = {};
        if (p.start === "lateral") { S.lt = { seen:{}, tab:"post" }; br.open("post", true); S.mode = "lateral"; }
        else { applyBase(); S.mode = "editor"; }
        modeRG.set(S.mode); api.save(); show(); paint(); MV.changed();
      },
      run:function(p, done){
        if (p.id === "p4") {
          MV.wait(400, function(){ br.open("budget");
            MV.wait(1200, function(){ br.open("paper"); MV.wait(900, done); }); });
          return;
        }
        var k = Object.keys(p.change)[0], before = score(S), was = S.place;
        MV.wait(400, function(){
          S[k] = p.change[k]; api.save();
          var now = score(S);
          if (k === "place") fx = { change:"Importance: " + (was === "front" ? "High" : "Low") + " → " + (S.place === "front" ? "High" : "Low") + "; impression still " + sgn(now.imp) };
          else fx = { change:"Impression: " + sgn(before.imp) + " → " + sgn(now.imp), flag:k === "verb" ? "word" : k === "photo" ? "images" : "" };
          paint(); MV.changed(); MV.wait(1500, done);
        });
      }
    },
    challenge:function(id){ return id === "tc1" ? tc1() : id === "tc2" ? tc2() : id === "tc3" ? tc3() : { ok:false }; }
  };
  function tc(id){ return byId(C.challenges, id); }
  function tc1(){
    var M = tc("tc1").msgs, sc = score(S), v = byId(C.verbs, S.verb);
    if (!v || v.pts !== 0) return { ok:false, msg:M.verb };
    if (S.detail !== "none" && S.detail !== "vote") return { ok:false, msg:M.detail };
    if (S.photo !== "c") return { ok:false, msg:M.photo };
    var a = sides(C.sources, S.sources); if (!a.pos || !a.neg) return { ok:false, msg:M.sides };
    var f = sides(C.facts, S.facts); if (!f.pos || !f.neg) return { ok:false, msg:Math.abs(sc.imp) >= 2 ? M.lean : M.facts };
    if (!has(S.facts, "vote")) return { ok:false, msg:M.vote };
    if (sc.imp < -1 || sc.imp > 1) return { ok:false, msg:M.lean };
    if (S.place !== "front") return { ok:false, msg:M.place };
    return { ok:true };
  }
  function tc2(){
    var M = tc("tc2").msgs;
    if (!S.lock || !sameSet(S.sources, B.sources) || !sameSet(S.facts, B.facts)) return { ok:false, msg:M.lock };
    if (S.detail !== "none" && S.detail !== "vote") return { ok:false, msg:M.detail };
    if (score(S).imp <= -2) return { ok:true };
    if (S.verb === "rams" && S.photo === "b") return { ok:false, msg:M.truck };
    if ((S.verb === "approves" || S.verb === "votesfor") && (S.photo === "a" || S.photo === "d")) return { ok:false, msg:M.small };
    return { ok:false };
  }
  function tc3(){
    var c = tc("tc3"), M = c.msgs, A = MV.ans(c), r = S.rd;
    if (!r.courier || !r.portnow || !r.weekly || !r.fact) return { ok:false, msg:M.count };
    if (r.courier === "word") return { ok:false, msg:M.courier };
    if (r.weekly === "omission") return { ok:false, msg:M.weekly };
    if (r.courier !== A.courier || r.portnow !== A.portnow || r.weekly !== A.weekly) return { ok:false };
    if (r.fact === "grant") return { ok:false, msg:M.grant };
    if (r.fact !== A.fact) return { ok:false };
    return { ok:true };
  }
  return EX;
}

// ---------- Part 3: Check before you share (five SIFT stations in a simulated browser) ----------
function pickHTML(key, choices, picked, opt){
  opt = opt || {};
  var h = '<div class="nb-picks" role="group" aria-label="' + esc(opt.aria || "Choices") + '">' + choices.map(function(c, i){
    var on = picked === i;
    return '<button type="button" class="nb-pick' + (on ? (MV.ok(c) ? " right" : " wrong") : "") + '" aria-pressed="' + on + '" data-pk="' + key + ":" + i + '" data-k="pk' + key + i + '">' + c.t + "</button>";
  }).join("") + "</div>";
  if (picked != null && choices[picked]) { var c = choices[picked], ok = MV.ok(c); h += MV.fbHTML(ok ? "good" : "bad", (ok ? "<strong>✓</strong> " : "<strong>✗ Not quite.</strong> ") + c.fb); }
  return h;
}
function part3(host, api){
  var P = api.content, S = api.S;
  S.s2 = S.s2 || {}; S.s3 = S.s3 == null ? null : S.s3; S.s4 = S.s4 || {}; S.s5 = S.s5 || {};
  var claimSlot = (P.s5.slot || {}).claim || "";
  host.innerHTML = '<div class="nb-p3"><div id="nb-p3sift"></div><p class="tiny muted">' + P.credit + "</p>" +
    '<section class="nb-stn" aria-labelledby="nb-s1h"><h3 id="nb-s1h">' + P.s1.title + "</h3>" + postHTML(P.s1.post, '<div class="nb-photo nb-pimg">' + photoSVG("flood", "A bike lane under floodwater") + "</div>") + "<p><strong>" + P.s1.prompt + '</strong></p><div id="nb-s1"></div></section>' +
    '<section class="nb-stn" aria-labelledby="nb-s2h"><h3 id="nb-s2h">' + P.s2.title + '</h3><p class="how">' + P.s2.how + '</p><div id="nb-s2br"></div><div id="nb-s2q"></div><p class="an-note an-image">' + P.s2.tells + '</p><p class="nb-case">' + P.s2.example + "</p></section>" +
    '<section class="nb-stn" aria-labelledby="nb-s3h"><h3 id="nb-s3h">' + P.s3.title + "</h3>" + postHTML(P.s3.post) + '<div id="nb-s3br"></div><p><strong>' + P.s3.prompt + '</strong></p><div id="nb-s3"></div></section>' +
    '<section class="nb-stn" aria-labelledby="nb-s4h"><h3 id="nb-s4h">' + P.s4.title + '</h3><p class="how">' + P.s4.how + '</p><div id="nb-s4"></div></section>' +
    '<section class="nb-stn" aria-labelledby="nb-s5h"><h3 id="nb-s5h">' + P.s5.title + "</h3>" + (claimSlot ? '<div class="nb-slot">' + claimSlot + "</div>" : '<p class="nb-slot">' + P.s5.slotEmpty + "</p>") +
    '<div class="jq"><label for="nb-s5claim">' + P.s5.claimLabel + '</label><input id="nb-s5claim" class="txtin" type="text" autocomplete="off" data-s5="claim"></div>' +
    P.s5.fields.map(function(f){ return '<div class="jq"><label for="nb-s5' + f.id + '">' + f.t + '</label><input id="nb-s5' + f.id + '" class="txtin" type="text" autocomplete="off" data-s5="' + f.id + '"></div>'; }).join("") +
    '<div id="nb-s5c"></div><p class="nb-s5o" id="nb-s5o" aria-live="polite"></p><p class="nb-case">' + P.s5.example + "</p></section></div>";

  var s2tabs = [];
  P.s2.posts.forEach(function(p){
    var post = p.id === "flood" ? postHTML({ handle:"@harbourwatcher", text:P.s1.post.text }, '<div class="nb-photo nb-pimg">' + photoSVG("flood", "A bike lane under floodwater") + "</div>")
      : postHTML({ handle:"@calderlaughs", text:"The mayor rides to work in a blizzard. In a suit!" }, '<div class="nb-photo nb-pimg">' + photoSVG("mayor", "Illustration of an AI-generated image: a man in a suit riding a bike through a blizzard") + '</div><p class="tiny muted">Illustration of an AI-generated image (drawn for this module).</p>');
    s2tabs.push({ id:p.id, t:p.label, url:"social.example/post", html:post });
    s2tabs.push({ id:p.id + "-s", t:"Image search", url:"images.example/search", html:p.search });
  });
  s2tabs[1].t = "Image search: post 1"; s2tabs[3].t = "Image search: post 2";
  simBrowser($("#nb-s2br", host), { key:"s2", label:"Station 2 browser tabs", tabs:s2tabs, onOpen:function(id){ S.s2.seen = S.s2.seen || {}; S.s2.seen[id] = 1; api.save(); } });
  simBrowser($("#nb-s3br", host), { key:"s3", label:"Station 3 browser tabs", tabs:P.s3.tabs });

  function siftLit(){
    var lit = {};
    if (S.s1 != null) lit.S = 1;
    if (P.s2.posts.every(function(p){ var i = S.s2[p.id]; return i != null && MV.ok(p.choices[i]); })) lit.I = 1;
    if (S.s3 != null && MV.ok(P.s3.choices[S.s3])) lit.F = 1;
    if (P.s4.items.every(function(it){ return S.s4[it.id] === MV.ans(it); })) lit.T = 1;
    return lit;
  }
  function paint(){
    $("#nb-p3sift", host).innerHTML = siftHTML(P.sift, siftLit());
    var s1 = $("#nb-s1", host);
    MV.keepFocus(s1, function(){ s1.innerHTML = '<div class="chips" role="group" aria-label="Your reaction">' + P.s1.chips.map(function(c, i){ var on = S.s1 === i; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-s1="' + i + '" data-k="s1' + i + '">' + c + "</button>"; }).join("") + "</div>" + (S.s1 != null ? '<p class="an-note an-theme">' + P.s1.note + "</p>" : ""); });
    var s2 = $("#nb-s2q", host);
    MV.keepFocus(s2, function(){ s2.innerHTML = P.s2.posts.map(function(p){ return "<p><strong>" + p.prompt + "</strong></p>" + pickHTML("s2" + p.id, p.choices, S.s2[p.id], { aria:p.prompt }); }).join(""); });
    var s3 = $("#nb-s3", host);
    MV.keepFocus(s3, function(){ s3.innerHTML = pickHTML("s3", P.s3.choices, S.s3, { aria:P.s3.prompt }); });
    var s4 = $("#nb-s4", host);
    MV.keepFocus(s4, function(){
      s4.innerHTML = '<ol class="nb-s4l">' + P.s4.items.map(function(it){
        var pick = S.s4[it.id], right = pick && pick === MV.ans(it);
        return "<li><p>" + it.t + '</p><div class="nb-picks" role="group" aria-label="' + esc("Label for: " + MV.plain(it.t)) + '">' + P.s4.labels.map(function(l){ var on = pick === l.id; return '<button type="button" class="nb-pick' + (on ? (right ? " right" : " wrong") : "") + '" aria-pressed="' + on + '" data-s4="' + it.id + ":" + l.id + '" data-k="s4' + it.id + l.id + '">' + l.t + "</button>"; }).join("") + "</div>" +
          (pick ? MV.fbHTML(right ? "good" : "bad", right ? "<strong>✓ " + byId(P.s4.labels, pick).t + ".</strong> " + it.why : "<strong>✗ Not quite.</strong> " + P.s4.wrong) : "") + "</li>";
      }).join("") + "</ol>";
    });
    paintS5();
  }
  function paintS5(){
    var c = $("#nb-s5c", host);
    if (!c.firstChild) radios(c, { label:"Classification", key:"s5c", cls:"chips", options:P.s5.classes.map(function(t){ return { id:t, t:t }; }), value:S.s5.cls || "", onChange:function(v){ S.s5.cls = v; api.save(); paintS5(); MV.paintSummary && MV.paintSummary(); } });
    var r = s5Check();
    $("#nb-s5o", host).innerHTML = r === true ? P.s5.ok : '<span class="muted">' + r + "</span>";
  }
  function s5Check(){
    var N = P.s5.need, f = P.s5.fields;
    if (!f.every(function(x){ return (S.s5[x.id] || "").trim(); })) return N.fields;
    var b = S.s5.better || ""; if (!/\b(1[5-9]|20)\d\d\b/.test(b) || wc(b.replace(/\b\d{4}\b/g, "")) < 1) return N.date;
    if (!S.s5.cls) return N.cls;
    return true;
  }
  $$("[data-s5]", host).forEach(function(inp){ inp.value = S.s5[inp.dataset.s5] || ""; });
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset.s5) return; S.s5[t.dataset.s5] = t.value; api.save(); paintS5(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.closest("[data-rg]") || b.closest("[data-tab]")) return;
    var d = b.dataset;
    if (d.s1 != null) { S.s1 = +d.s1; }
    else if (d.pk) { var p = d.pk.split(":"); if (p[0] === "s3") S.s3 = +p[1]; else S.s2[p[0].slice(2)] = +p[1]; }
    else if (d.s4) { var q = d.s4.split(":"); S.s4[q[0]] = q[1]; }
    else return;
    api.save(); paint(); var box = b.closest("li") || b.closest(".nb-stn"); if (box && !d.s1) MV.focusFb(box);
  });
  paint();

  // Sentence to steal: save the imitation to the commonplace book (with the master's line)
  var steal = $('.mv-block[data-block="steal"]'), ST = MV.C.part3.steal;
  if (steal && !$("#nb-steal-save")) {
    var row = document.createElement("div");
    row.innerHTML = '<div class="q-actions"><button type="button" class="btn ghost sm" id="nb-steal-save">' + ST.save + '</button><span class="tiny muted" id="nb-steal-st" aria-live="polite"></span></div>';
    steal.appendChild(row);
    row.addEventListener("click", function(e){
      if (e.target.id !== "nb-steal-save") return;
      var ta = $('textarea[data-w="steal"]', steal), t = ((ta && ta.value) || MV.S.writes.steal || "").trim();
      if (!t) { $("#nb-steal-st").textContent = "Write your imitation first."; return; }
      MV.eng.saveLine(t, "My imitation of " + ST.source + ": “" + ST.master + "”");
      $("#nb-steal-st").textContent = "Saved your imitation to your commonplace book.";
    });
  }
  return {};
}

// ---------- Practice 1: Name the bias (toolkit K12 sorter) + the real-world extension (not scored) ----------
function sortx(host, api, a){
  host.innerHTML = '<div id="sx-s"></div><div class="nb-ext" id="sx-e"></div>';
  var made = MV.activityTypes.sorter($("#sx-s", host), Object.assign({}, a, { type:"sorter" }));
  var S = api.S; S.ext = S.ext || {};
  var E = a.ext, el = $("#sx-e", host);
  el.innerHTML = '<h4 class="nb-h">' + E.title + '</h4><p class="tiny muted">' + E.how + '</p><div class="nb-extg">' + a.boxes.map(function(b){
    var t = byId(MV.C.explore.types, b.id);
    return '<div class="jq nb-extb an-' + t.role + '"><label for="sx-' + b.id + '"><span class="an-tag an-' + t.role + '">' + b.label + '</span></label><textarea id="sx-' + b.id + '" rows="2" data-ext="' + b.id + '" placeholder="' + esc(E.ph) + '"></textarea></div>';
  }).join("") + "</div>";
  $$("[data-ext]", el).forEach(function(t){ t.value = S.ext[t.dataset.ext] || ""; });
  el.addEventListener("input", function(e){ var t = e.target; if (!t.dataset.ext) return; S.ext[t.dataset.ext] = t.value; api.save(); });
  return made;
}

// ---------- Practice 2: Lateral reading lab (retry-mode multiple choice + L4, a neutral-headline chip builder) ----------
function lab(host, api, a){
  var st = api.S; st.items = st.items || {};
  function ist(id){ return st.items[id] || (st.items[id] = { tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = a.items.map(function(it){ return '<div class="q" data-lq="' + it.id + '"></div>'; }).join("");
  function star(it){ return it.star ? '<span class="tag nb-star">★</span> ' : ""; }
  function built(it, x){ if (x.v == null || x.o == null || x.d == null) return ""; return "Council " + it.verbs[x.v] + " " + it.objects[x.o] + (x.d === 0 ? "" : it.details[x.d] === "7–4" ? ", 7–4" : " " + it.details[x.d]); }
  function judge(it, x){
    var h = built(it, x), M = it.msgs; if (!h) return { ok:false, msg:"Choose a verb, an object and a detail." };
    var low = h.toLowerCase(), bad = it.loaded.filter(function(w){ return new RegExp("\\b" + w + "\\b").test(low); })[0];
    if (bad) return { ok:false, msg:M.loaded.replace("{w}", bad.charAt(0).toUpperCase() + bad.slice(1)), tried:true };
    if (!has(it.neutral, it.verbs[x.v])) return { ok:false, msg:M.verb, tried:true };
    if (h.indexOf("7–4") < 0) return { ok:false, msg:M.vote, tried:true };
    return { ok:true };
  }
  function buildHTML(it, x, i){
    var row = function(name, key, list){ return '<div class="rg-wrap"><span class="rg-lab">' + name + '</span><span class="rg chips" role="group" aria-label="' + name + '">' + list.map(function(t, k){ var on = x[key] === k; return '<button type="button" aria-pressed="' + on + '" class="nb-bchip' + (on ? " on" : "") + '" data-lb="' + key + ":" + k + '" data-k="lb' + key + k + '"' + (x.solved ? " disabled" : "") + ">" + t + "</button>"; }).join("") + "</span></div>"; };
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + star(it) + it.prompt + "</div></div>";
    h += '<p class="tiny muted">Subject: Council (fixed)</p>' + row("Verb", "v", it.verbs) + row("Object", "o", it.objects) + row("Detail", "d", it.details);
    h += '<p class="nb-built" aria-live="polite"><span class="rg-lab">Your headline</span> ' + (built(it, x) ? "<strong>" + esc(built(it, x)) + "</strong>" : '<span class="muted">choose a chip in each row</span>') + "</p>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="bcheck" data-k="' + it.id + 'chk">Check headline</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + it.why);
    else if (x.msg) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + x.msg + " Try again.");
    return h;
  }
  function paintQ(it, i){
    var box = $('[data-lq="' + it.id + '"]', host), x = ist(it.id);
    MV.keepFocus(box, function(){ box.innerHTML = it.type === "build" ? buildHTML(it, x, i) : MV.mcHTML(Object.assign({}, it, { prompt:star(it) + it.prompt }), x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true }); });
  }
  a.items.forEach(paintQ);
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-lq]"); if (!box) return;
    var it = byId(a.items, box.dataset.lq), i = a.items.indexOf(it), x = ist(it.id), checked = false;
    if (b.dataset.act === "hint") x.hint = Math.min(3, (x.hint || 0) + 1);
    else if (it.type === "build") {
      if (b.dataset.lb) { var p = b.dataset.lb.split(":"); x[p[0]] = +p[1]; x.msg = ""; }
      else if (b.dataset.act === "bcheck") { var r = judge(it, x); checked = true; if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; x.msg = ""; } else { if (r.tried) x.tries++; x.msg = r.msg; } }
    } else {
      if (b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
      else if (b.dataset.act === "check") { x.checked = true; checked = true; if (MV.ok(it.options[x.choice])) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++; }
    }
    MV.save(); paintQ(it, i); if (checked) MV.focusFb(box);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- @component E17 draftWorkspace (copied from ENG4U 13) — a writing area with a live word count (target range),
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
  host.innerHTML = '<div class="nb-dw"><label for="dw-' + o.id + '" class="nb-lab">' + o.label + '</label><textarea id="dw-' + o.id + '" class="nb-dw-ta" rows="11"></textarea>' +
    '<div class="q-actions"><span class="nb-dw-n" id="dw-' + o.id + '-n" aria-live="polite"></span><button type="button" class="btn ghost sm" id="dw-' + o.id + '-save">Save as a draft</button></div><div id="dw-' + o.id + '-list"></div><div id="dw-' + o.id + '-cmp" aria-live="polite"></div></div>';
  var ta = $("#dw-" + o.id, host); ta.value = o.get() || "";
  function count(){
    var n = wc(ta.value), msg = n < o.min ? (o.min - n) + " to go" : n > o.max ? (n - o.max) + " over" : "in range";
    $("#dw-" + o.id + "-n", host).innerHTML = "<strong>" + n + " word" + (n === 1 ? "" : "s") + "</strong> · aim for " + o.min + "–" + o.max + " (" + msg + ")";
  }
  function list(){
    var Dd = o.drafts(), el = $("#dw-" + o.id + "-list", host);
    el.innerHTML = Dd.length ? '<p class="tiny">Saved drafts: ' + Dd.map(function(d, i){ return '<button type="button" class="linkbtn" data-dwc="' + i + '" aria-pressed="' + (cmp === i) + '">Compare draft ' + d.n + " with now</button>"; }).join(" · ") + "</p>" : "";
    var cb = $("#dw-" + o.id + "-cmp", host);
    if (cmp != null && Dd[cmp]) { var df = diffWords(Dd[cmp].t, ta.value); cb.innerHTML = '<div class="nb-dw-cmp"><div><p class="tiny"><strong>Draft ' + Dd[cmp].n + '</strong> (removed words struck through)</p><p>' + df[0] + '</p></div><div><p class="tiny"><strong>Now</strong> (new words underlined)</p><p>' + df[1] + "</p></div></div>"; }
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

// ---------- Performance task: Fair front page (headline, story with a quotation picker, editor's note; structure checks only) ----------
var task = (function(){
  var api = null, T = null, dw = null;
  function TT(){ return T || (T = MV.C.task); }
  function explain(){ var e = $("#task-explain"); return e ? e.value : (MV.taskState().explain || ""); }
  function sp(s){ return String(s || "").replace(/[   ]/g, " "); }
  function data(S){ S = S || {}; var head = String(S.head || ""), text = String(S.text || ""), note = String(S.note || ""); return { head:head, text:text, note:note, hn:wc(head), n:wc(text), nn:wc(note), explain:explain() }; }
  function quotesUsed(text){ var N = MV.eng.norm, t = " " + N(text) + " "; return TT().facts.quotes.filter(function(q){ return t.indexOf(" " + N(q.q) + " ") >= 0; }); }
  function numsUsed(text){ var tx = sp(text).toLowerCase(); return TT().facts.numbers.filter(function(x){ return [x.t].concat(x.alt).some(function(s){ return tx.indexOf(sp(s).toLowerCase()) >= 0; }); }); }
  function checks(d){
    var t = TT(), F = t.facts, f40 = sp(MV.eng.words(d.text).slice(0, t.leadWords).join(" ")).toLowerCase(), nl = d.note.toLowerCase(), qs = quotesUsed(d.text);
    return [d.hn >= t.headMin && d.hn <= t.headMax && !t.loaded.some(function(w){ return MV.eng.hasWord(d.head, w); }),
      F.lead.who.some(function(w){ return f40.indexOf(w) >= 0; }) && f40.indexOf(F.lead.what.toLowerCase()) >= 0 && f40.indexOf(F.lead.when.toLowerCase()) >= 0,
      qs.length >= 2 && qs.some(function(q){ return q.tag === "supports"; }) && qs.some(function(q){ return q.tag === "opposes"; }),
      numsUsed(d.text).length >= 2,
      d.n >= t.min && d.n <= t.max,
      d.nn >= t.noteMin && d.nn <= t.noteMax && t.noteWords.some(function(w){ return nl.indexOf(w) >= 0; })];
  }
  function tagHTML(tag){ return '<span class="nb-qtag nb-q-' + tag + '">' + tag.charAt(0).toUpperCase() + tag.slice(1) + "</span>"; }
  function paras(text){ return String(text || "").split(/\n\s*\n|\n/).filter(function(p){ return p.trim(); }).map(function(p){ return "<p>" + esc(p) + "</p>"; }).join(""); }
  function paintPv(){
    var S = api.S, d = data(S), el = $("#tk-pv"); if (!el) return; var t = TT(), qs = quotesUsed(d.text), ns = numsUsed(d.text);
    el.innerHTML = '<p class="nb-lab">' + t.labels.pv + '</p><div class="nb-page nb-front nb-tkpage"><div class="nb-mast"><span>THE CITY PAPER</span><span class="tiny">Front page</span></div><h4 class="nb-hl">' + (esc(d.head.trim()) || '<span class="muted">Your headline</span>') + '</h4><div class="nb-lead">' + (paras(d.text) || '<p class="muted">Your story appears here.</p>') + "</div></div>" +
      '<ul class="nb-glance"><li><strong>Headline:</strong> ' + d.hn + " words (6–14)</li><li><strong>Story:</strong> " + d.n + " words (" + t.min + "–" + t.max + ")</li><li><strong>Quotations found:</strong> " + (qs.length ? qs.map(function(q){ return tagHTML(q.tag) + " " + esc(q.who); }).join(", ") : "none yet") + "</li><li><strong>Numbers used:</strong> " + (ns.map(function(n){ return esc(n.t); }).join(", ") || "none yet") + "</li><li><strong>Editor’s note:</strong> " + d.nn + " words (" + t.noteMin + "–" + t.noteMax + ")</li></ul>";
    var showModels = MV.taskState().found.length > 0;
    $("#tk-models").innerHTML = showModels ? '<details class="alg nb-models"><summary>' + t.labels.models + '</summary><p class="tiny muted">' + t.labels.modelsNote + "</p>" + t.models.map(function(m){
      return '<div class="nb-model"><h5>' + m.title + '</h5><p class="nb-mh"><strong>' + esc(m.head) + "</strong></p><p>" + esc(m.text) + '</p><p class="tiny"><strong>Editor’s note:</strong> ' + esc(m.note) + "</p></div>";
    }).join("") + "</details>" : "";
  }
  function changed(){ api.save(); api.update(); paintPv(); }
  function counts(){ var S = api.S; $("#tk-hn").textContent = wc(S.head) + " words (aim for 6–14)"; $("#tk-nn").textContent = wc(S.note) + " words (aim for 60–100)"; }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; var S = a.S, L = T.labels, F = T.facts;
      S.drafts = Array.isArray(S.drafts) ? S.drafts : [];
      inp.innerHTML = '<div class="nb-tk"><details class="alg nb-tkfs" open><summary>' + L.facts + "</summary><h4 class='nb-fs-h'>" + F.title + "</h4><ul class='nb-fs'>" + F.items.map(function(x){ return "<li>" + x + "</li>"; }).join("") + "</ul><p class='nb-fs-q'><strong>Quotations:</strong></p><ul class='nb-fs'>" +
        F.quotes.map(function(q){ return "<li>" + tagHTML(q.tag) + " " + esc(q.who) + ": “" + esc(q.q) + "”</li>"; }).join("") + "</ul></details>" +
        '<div class="jq"><label for="tk-head">' + L.head + '</label><input id="tk-head" class="txtin" type="text" autocomplete="off"><p class="tiny muted" id="tk-hn" aria-live="polite"></p></div>' +
        '<div class="nb-qp"><p class="nb-lab">' + L.quotes + '</p><p class="tiny muted">' + L.quotesHow + '</p><div class="nb-qpb">' + F.quotes.map(function(q){ return '<button type="button" class="nb-qbtn" data-q="' + q.id + '">' + tagHTML(q.tag) + " “" + esc(q.q) + '” <span class="tiny muted">(' + esc(q.who) + ")</span></button>"; }).join("") + "</div></div>" +
        '<div id="tk-draft"></div><div class="jq"><label for="tk-note">' + L.note + " (" + T.noteMin + "–" + T.noteMax + ' words)</label><textarea id="tk-note" rows="5"></textarea><p class="tiny muted" id="tk-nn" aria-live="polite"></p></div></div>';
      pv.innerHTML = '<div id="tk-pv" aria-live="polite"></div><div id="tk-models"></div>';
      dw = draftWorkspace($("#tk-draft"), { id:"story", label:L.story + " (" + T.min + "–" + T.max + " words, not counting the headline)", min:T.min, max:T.max, get:function(){ return S.text; }, set:function(v){ S.text = v; }, drafts:function(){ return S.drafts; }, onChange:changed });
      var hd = $("#tk-head"), nt = $("#tk-note"); hd.value = S.head || ""; nt.value = S.note || "";
      hd.addEventListener("input", function(){ S.head = hd.value; counts(); changed(); });
      nt.addEventListener("input", function(){ S.note = nt.value; counts(); changed(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-q]"); if (!b) return;
        var q = byId(F.quotes, b.dataset.q), ta = dw.ta, ins = q.who + " said, “" + q.q + "”", s0 = ta.selectionStart == null ? ta.value.length : ta.selectionStart, s1 = ta.selectionEnd == null ? s0 : ta.selectionEnd;
        var before = ta.value.slice(0, s0), after = ta.value.slice(s1), pre = before && !/\s$/.test(before) ? " " : "", post = after && !/^\s/.test(after) ? " " : "";
        ta.value = before + pre + ins + post + after; var c = (before + pre + ins).length; ta.focus(); try { ta.setSelectionRange(c, c); } catch (err) {}
        dw.changed();
      });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ a.update(); });
      var ck = $("#task-check"); if (ck) ck.addEventListener("click", function(){ setTimeout(paintPv, 0); });
      counts(); paintPv(); extras();
    },
    read:function(){ return data(api ? api.S : MV.taskState().app); },
    valid:function(d){ return d.text.trim() || d.head.trim() ? true : "Write your headline and story first."; },
    checks:checks,
    key:function(d){ return d.head.trim() || "Front page"; }, label:function(k){ return "“" + esc(k) + "”"; }, text:function(k){ return k; },
    summary:function(ts){
      var t = TT(), d = data(ts.app || {}), r = checks(d), done = r.every(Boolean), L = [];
      L.push((t.summary || "Fair front page") + ": " + (done ? "complete (" + d.n + " words)" : "not complete"));
      if (!done) L.push("  Checklist: " + r.filter(Boolean).length + "/" + r.length + " lines met");
      L.push("Headline and story (for your teacher): " + (d.head.trim() || "(no headline)") + " | " + (d.text.trim().replace(/\s*\n+\s*/g, " ") || "(not written yet)"));
      L.push("Editor’s note: " + (d.note.trim() || "(not written yet)"));
      if (!d.explain.trim()) L.push("Craft statement: (not written yet)");
      L.push("  Teacher rubric (Ontario achievement chart, levels 1–4):");
      var RB = t.rubric; for (var c = 1; c < RB[0].length; c++) L.push("    " + RB[0][c] + ": " + RB.slice(1).map(function(row){ return row[0] + " " + row[c]; }).join("; "));
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
  if (sheet && art && R.art.intro && !$("#nb-artintro")) { var p = document.createElement("p"); p.id = "nb-artintro"; p.innerHTML = R.art.intro; sheet.insertBefore(p, $("#art-samples") || art); }
  var ap = $("#art-p");
  if (ap && !$("#nb-artn")) {
    var n = document.createElement("p"); n.id = "nb-artn"; n.className = "tiny muted"; n.setAttribute("aria-live", "polite"); ap.parentNode.appendChild(n);
    var upd = function(){ var k = wc(ap.value); n.textContent = k + " word" + (k === 1 ? "" : "s") + (k >= R.principleMin ? " ✓" : " (write at least " + R.principleMin + ")"); };
    ap.addEventListener("input", upd); upd();
  }
  MV.eng.triviumPicker();
  var cp = $("#cp-app"); if (cp && !cp.childNodes.length) MV.eng.commonplace(cp, { lines:R.art.examples.map(function(x){ return MV.plain(x).replace(/\s*\([^()]*\)\s*$/, ""); }) });
}

// ---------- summary lines: real coverage diagnosis, live trace, real-world bias examples, the principle ----------
function summaryLines(){
  var L = [], A = MV.S.app || {}, ex = A.explore || {}, p3 = A.part3 || {}, C = MV.C, RS = C.explore.realSlot || {};
  var real = ex.real || { v:[] }, tt = function(id){ var t = byId(C.explore.types, id); return t ? t.t : "no framing choice named"; };
  var vs = (real.v || []).filter(function(v){ return v && Object.keys(v).some(function(k){ return String(v[k] || "").trim(); }); });
  L.push("Real coverage diagnosis: " + ((RS.event || real.event || "").trim() || "(event not entered)") + "; " + (vs.length ? vs.map(function(v, i){
    return "version " + (i + 1) + " (" + ((v.credit || "").trim() || "no credit") + "): " + tt(v.frame) + (v.verb ? "; verb " + v.verb : "") + (v.lead ? "; lead " + v.lead : "") + (v.photo ? "; photo " + v.photo : "") + (v.place ? "; placement " + v.place : "") + (v.src ? "; sources " + v.src : "") + (v.miss ? "; missing " + v.miss : "");
  }).join(" | ") : "(not done)"));
  var s5 = p3.s5 || {};
  L.push("Live trace: " + ((s5.claim || "").trim() || "(no claim entered)") + "; first appeared " + ((s5.first || "").trim() || "?") + "; behind it " + ((s5.who || "").trim() || "?") + "; better coverage " + ((s5.better || "").trim() || "?") + "; original context " + ((s5.context || "").trim() || "?") + "; classified as " + (s5.cls || "?"));
  var ext = (((MV.S.act || {}).sort || {}).ext) || {}, eb = Object.keys(ext).filter(function(k){ return String(ext[k] || "").trim(); });
  if (eb.length) L.push("Real-world bias examples (not scored): " + eb.map(function(k){ return tt(k) + ": " + ext[k].trim(); }).join(" | "));
  var pr = (MV.S.writes["art-principle"] || "").trim(); if (pr) L.push("New principle: " + pr);
  return L;
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ sort:sortx, lab:lab },
  task:task,
  summaryLines:summaryLines,
  onShow:function(v){
    MV.eng.stop();
    if (v !== "start" && HR.stop) HR.stop();
    if (EX && v !== "explore") EX.stop();
    if (v === "reflect") extras();
  }
});
})();
