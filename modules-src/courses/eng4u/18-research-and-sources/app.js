// ENG4U 18 Research & Secondary Sources: hero (Johnson's two kinds of knowledge, a conversation map), the source evaluator
// (Explore: E13 Evaluate · Notes · Cite, with the overlap detector, the novel and library check tools and the E8 citation
// builder), Using critics (Part 3: name the move, build your move, integrity in the age of AI), Practice (note types,
// integrity cases, Spot the Error) and the performance task "Annotated bibliography and a critic conversation".
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function wc(t){ return MV.eng.wordCount(t); }
function cap(s){ return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }

// ---------- @component radioGroup (copied from ENG4U 07; no option needs to be checked) ----------
function radios(host, o){
  var val = String(o.value == null ? "" : o.value);
  function off(id){ return !!(o.disabled && o.disabled(id)); }
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
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, refresh:paint };
}

// ---------- local voice (read-aloud only with a local voice) ----------
var VOICE = null;
function voiceReady(fn){ MV.eng.voice(function(v){ VOICE = v; fn(v); }); }

// ---------- hero: Johnson's sentences light word by word; a book glows, then lines run out to a ring of voices ----------
var HR = { run:0, tok:null };
function hero(){
  var H = MV.C.hero, host = $("#rs-hero"); if (!host) return;
  var W = [], starts = [];
  H.passage.forEach(function(p){ starts.push(W.length); p.split(" ").forEach(function(w){ W.push(w); }); });
  var n = H.ring.length, svg = '<svg class="rs-hsvg" viewBox="0 0 320 214" aria-hidden="true" focusable="false">', nodes = "";
  H.ring.forEach(function(r, i){
    var a = -Math.PI / 2 + (i + 0.5) * 2 * Math.PI / n, x = 160 + 122 * Math.cos(a), y = 104 + 80 * Math.sin(a);
    svg += '<line class="rs-hl" pathLength="100" x1="160" y1="104" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '" style="transition-delay:' + (i * 110) + 'ms"/>';
    nodes += '<g class="rs-hn" style="transition-delay:' + (i * 110 + 200) + 'ms"><rect x="' + (x - 36).toFixed(1) + '" y="' + (y - 12).toFixed(1) + '" width="72" height="24" rx="5"/><text x="' + x.toFixed(1) + '" y="' + (y + 4).toFixed(1) + '">' + esc(r) + "</text></g>";
  });
  svg += nodes + '<g class="rs-hb"><rect x="132" y="82" width="56" height="44" rx="4"/><path d="M160 86V122M140 94h14M140 102h14M166 94h14M166 102h14"/><text class="rs-hbl" x="160" y="142">your novel</text></g></svg>';
  host.innerHTML = '<div class="rs-hbox">' + svg + '<p class="rs-hq">' + W.map(function(w, i){ return '<span class="rs-hw" data-w="' + i + '">' + esc(w) + "</span>"; }).join(" ") + '</p><p class="eng-cite">' + H.cite + '</p><p class="rs-hcap">' + H.caption + "</p></div>" +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="rs-hlisten" hidden>Listen</button><button type="button" class="btn ghost sm" id="rs-hagain">Watch again</button></div><p class="tiny muted" id="rs-hread">' + H.readIt + "</p>";
  var WS = $$(".rs-hw", host);
  function phase(k){ host.classList.toggle("glow", k >= starts[1]); host.classList.toggle("lines", k >= starts[2]); }
  function lit(k){ WS.forEach(function(e, i){ e.classList.toggle("on", i <= k); e.classList.toggle("speaking", i === k); }); phase(k); }
  function finish(){ lit(W.length - 1); WS.forEach(function(e){ e.classList.remove("speaking"); }); host.classList.add("glow", "lines", "final"); }
  function at(me, ms, fn){ MV.wait(ms, function(){ if (me === HR.run) fn(); }); }
  function stopRead(){ if (HR.tok) { HR.tok.stop(); HR.tok = null; } }
  function animate(){
    var me = ++HR.run; stopRead(); host.classList.remove("glow", "lines", "final"); lit(-1);
    W.forEach(function(_, i){ at(me, 300 + i * 260, function(){ lit(i); }); });
    at(me, 300 + W.length * 260 + 500, finish);
  }
  function listen(){
    var me = ++HR.run; stopRead(); host.classList.remove("final"); lit(-1);
    HR.tok = MV.eng.say(W.join(" "), { voice:VOICE, rate:0.9, onWord:function(i){ if (me === HR.run) lit(i); }, onEnd:function(){ HR.tok = null; if (me === HR.run) finish(); } });
  }
  $("#rs-hlisten").addEventListener("click", listen);
  $("#rs-hagain").addEventListener("click", function(){ if (MV.reduceMotion) { HR.run++; stopRead(); finish(); } else animate(); });
  if (MV.reduceMotion) { host.classList.add("rm"); finish(); } else animate();
  voiceReady(function(){ $("#rs-hlisten").hidden = !VOICE; });
  HR.stop = function(){ stopRead(); HR.run++; finish(); };
}

// ---------- @component E8 citationBuilder (adapted from ENG4U 07) — MLA 9 Works Cited entries from the core elements: order (Move
// up / Move down), a form picker per element, the punctuation after each, a second container, an optional dropped element, and a
// Check that outlines any element in the wrong slot. Italics are a flag, never typed; "_…_" marks a title within a title. ----------
function tt(t, html){ return html ? esc(t).replace(/_([^_]+)_/g, "<i>$1</i>") : String(t).replace(/_([^_]+)_/g, "$1"); }
function wcEl(card, id){ return card.els.filter(function(e){ return e.id === id; })[0]; }
function wcFull(card, st){ return st.order && st.order.length === card.els.length ? st.order : card.els.map(function(e){ return e.id; }); }
function wcOrd(card, st){ var o = wcFull(card, st); return st.drop ? o.filter(function(id){ return !st.drop[id]; }) : o; }
function wcIdx(card, e){ return MV.shuffle(e.forms.map(function(_, i){ return i; }), card.id + e.id); }
function wcForm(card, st, id){ var e = wcEl(card, id), k = st.form && st.form[id] != null ? +st.form[id] : wcIdx(card, e)[0]; return e.forms[k] || e.forms[0]; }
function wcPiece(f, p, html){ var t = tt(f.t, html); if (f.s === "q") return "“" + t + p + "”"; if (f.s === "i") return (html ? '<i class="wc-i">' + t + "</i>" : t) + p; return t + p; }
function wcEntry(card, st, html){ return wcOrd(card, st).map(function(id){ return wcPiece(wcForm(card, st, id), (st.p || {})[id] || "", html); }).join(" "); }
function wcOk(card, id, f){ var e = wcEl(card, id); return e.forms.indexOf(f) === MV.ans(card).f[id]; }
function wcKey(card, html){ var k = MV.ans(card); return k.order.map(function(id){ return wcPiece(wcEl(card, id).forms[k.f[id]], k.p[id], html); }).join(" "); }
function wcScore(card, st){
  var key = MV.ans(card), o = wcOrd(card, st), r = { n:key.order.length, ord:0, pu:0, fo:0, el:0 };
  o.forEach(function(id, i){ var a = key.order[i] === id, b = ((st.p || {})[id] || "") === key.p[id], c = wcOk(card, id, wcForm(card, st, id)); if (a) r.ord++; if (b) r.pu++; if (c) r.fo++; if (a && b && c) r.el++; });
  r.ok = o.length === r.n && r.el === r.n;
  return r;
}
function wcErr(card, st, F){
  var sc = wcScore(card, st); if (sc.ok) return "";
  if (st.drop) return "An element is missing.";
  var err = []; wcOrd(card, st).forEach(function(id){ var f = wcForm(card, st, id); if (!wcOk(card, id, f) && f.e) err.push(f.e); });
  if (err.length) return F[err[0]] || F.general;
  if (sc.ord < sc.n) return F.order;
  return F.general;
}
function factsHTML(c){ return '<div class="wc-facts">' + (c.fict ? '<p><span class="tag">practice source (fictional)</span></p>' : "") + c.facts + "</div>"; }
function wcLabel(f){ var t = tt(f.t, false); return f.s === "q" ? "“" + t + "” (quotation marks)" : f.s === "i" ? t + " (italics)" : f.s === "" ? t + " (plain)" : t; }
function wcUI(host, card, st, onChange){
  function paint(){
    var o = wcOrd(card, st), key = MV.ans(card);
    MV.keepFocus(host, function(){
      host.innerHTML = '<ol class="wcb">' + o.map(function(id, i){
        var e = wcEl(card, id), f = wcForm(card, st, id), p = (st.p || {})[id] || "", k = e.forms.indexOf(f);
        var bad = st.checked ? (key.order[i] !== id ? "wrong slot" : !wcOk(card, id, f) ? "form" : p !== key.p[id] ? "punctuation" : "") : "";
        var fs = e.forms.length > 1 ? '<select class="rs-sel wcb-f" data-wf="' + id + '" data-k="wf' + card.id + id + '" aria-label="Form of the ' + esc(e.label) + '">' + wcIdx(card, e).map(function(j){ return '<option value="' + j + '"' + (j === k ? " selected" : "") + ">" + esc(wcLabel(e.forms[j])) + "</option>"; }).join("") + "</select>"
          : '<span class="wcb-v">' + wcPiece(f, "", true) + "</span>";
        return '<li class="wcb-r' + (bad ? " bad" : "") + '"><span class="wcb-l">' + e.label + (bad ? ' <span class="wcb-x">✗ ' + bad + "</span>" : "") + "</span>" + fs + '<select class="rs-sel wcb-p" data-wp="' + id + '" data-k="wp' + card.id + id + '" aria-label="Punctuation after the ' + esc(e.label) + '">' + [["", "no mark"], [".", "."], [",", ","]].map(function(x){ return '<option value="' + x[0] + '"' + (x[0] === p ? " selected" : "") + ">" + x[1] + "</option>"; }).join("") + "</select>" +
          '<span class="wcb-mv"><button type="button" class="btn ghost sm" data-wu="' + id + '" data-k="wu' + card.id + id + '"' + (i ? "" : " disabled") + ' aria-label="Move ' + esc(e.label) + ' up">↑</button><button type="button" class="btn ghost sm" data-wd="' + id + '" data-k="wd' + card.id + id + '"' + (i < o.length - 1 ? "" : " disabled") + ' aria-label="Move ' + esc(e.label) + ' down">↓</button></span></li>';
      }).join("") + '</ol><p class="wcb-o"><span class="rs-lab">Your entry</span><span class="wc-e">' + wcEntry(card, st, true) + "</span></p>";
    });
  }
  host.addEventListener("change", function(e){
    var t = e.target;
    if (t.dataset.wf) { st.form = st.form || {}; st.form[t.dataset.wf] = +t.value; }
    else if (t.dataset.wp) { st.p = st.p || {}; st.p[t.dataset.wp] = t.value; } else return;
    paint(); onChange();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-wu],[data-wd]"); if (!b || b.disabled) return;
    var id = b.dataset.wu || b.dataset.wd, vis = wcOrd(card, st), i = vis.indexOf(id), j = i + (b.dataset.wu ? -1 : 1);
    if (j < 0 || j >= vis.length) return;
    var full = wcFull(card, st).slice(), a = full.indexOf(id), c = full.indexOf(vis[j]); full[a] = vis[j]; full[c] = id; st.order = full; paint();
    var nb = host.querySelector('[data-k="' + (b.dataset.wu ? "wu" : "wd") + card.id + id + '"]');
    if (nb && nb.disabled) nb = host.querySelector('[data-k="' + (b.dataset.wu ? "wd" : "wu") + card.id + id + '"]');
    if (nb) nb.focus(); onChange();
  });
  paint();
  return { paint:paint };
}
function cardById(id){ return byId(MV.C.explore.wc.cards, id); }

// ---------- overlap detector (plan §5): lower case, punctuation removed (apostrophes inside words kept), text inside straight
// or curly double quotation marks ignored; every 4-word sequence shared with the source is flagged ----------
function otoks(text){
  var out = [], re = /\S+/g, m, q = false, k = 0;
  while ((m = re.exec(String(text || "")))) {
    var raw = m[0], startQ = q;
    for (var i = 0; i < raw.length; i++) { var c = raw[i]; if (c === "“") q = true; else if (c === "”") q = false; else if (c === '"') q = !q; }
    var w = raw.toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z0-9à-ÿ']/g, "").replace(/^'+|'+$/g, "");
    out.push({ raw:raw, w:w, q:startQ || /^[“"]/.test(raw), k:k++ });
  }
  return out;
}
function overlap(src, note){
  var A = otoks(src).filter(function(t){ return t.w; }), N = otoks(note).filter(function(t){ return t.w && !t.q; }), G = {}, nm = {}, sm = {}, keys = {}, i, j;
  for (i = 0; i + 3 < A.length; i++) { var g = A.slice(i, i + 4).map(function(t){ return t.w; }).join(" "); (G[g] = G[g] || []).push(i); }
  for (i = 0; i + 3 < N.length; i++) {
    var key = N.slice(i, i + 4).map(function(t){ return t.w; }).join(" ");
    if (!G[key]) continue;
    keys[key] = 1; for (j = i; j < i + 4; j++) nm[N[j].k] = 1;
    G[key].forEach(function(s){ for (var x = s; x < s + 4; x++) sm[A[x].k] = 1; });
  }
  return { n:Object.keys(keys).length, keys:Object.keys(keys), nm:nm, sm:sm };
}
function hlHTML(text, marks, on){
  var T = otoks(text), h = "", re = /\S+|\s+/g, m, k = 0, run = false;
  while ((m = re.exec(String(text || "")))) {
    if (/^\s/.test(m[0])) { h += m[0]; continue; }
    var lit = on && marks[k];
    if (lit && !run) { h += '<mark class="an an-syntax">'; run = true; }
    if (!lit && run) { h = h.replace(/(\s*)$/, '</mark><span class="an-tag an-syntax">shared</span>$1'); run = false; }
    h += esc(T[k].raw); k++;
  }
  if (run) h += '</mark><span class="an-tag an-syntax">shared</span>';
  return h;
}
function citeInfo(note){ var m = String(note || "").match(/\([^()]*\b120\b[^()]*\)/); return { par:m ? m[0] : "", named:/\bOkafor\b/.test(note || "") }; }

// ---------- @component E13 sourceEvaluator — Explore: Evaluate (five criterion sliders, a five-spoke profile with the key dashed,
// the verdict rule, the TextPal chat with novel and library check tools) · Notes (overlap detector, key-idea chips, citation
// indicator) · Cite (E8 builder against the MLA 9 key) ----------
var EX = null;
function explore(host, api){
  var C = api.content, S = api.S, W = C.wc, RUN = 0, anim = {}, SRC = {};
  C.sources.forEach(function(s){ SRC[s.id] = s; });
  if (["ev", "notes", "cite"].indexOf(S.mode) < 0) S.mode = "ev";
  if (!SRC[S.src]) S.src = "s1";
  S.ev = S.ev || {}; S.tc3 = S.tc3 || {}; S.found = S.found || {}; S.kk = S.kk || {}; S.wc = S.wc || {};
  if (S.note == null) S.note = ""; S.ntype = S.ntype || "paraphrase"; if (!cardById(S.card)) S.card = "s1"; S.nq = S.nq || ""; S.lq = S.lq || "";

  host.innerHTML = '<div class="rs"><div id="rs-mode"></div><p class="banner" data-mv="banner" aria-live="polite"></p><div class="rs-body" data-mv="graph"><div class="rs-main" id="rs-main"></div>' +
    '<aside class="rs-side"><h4 class="rs-rh">Readout</h4><dl class="read" id="rs-read" aria-live="polite"></dl></aside></div><p class="rs-aha">' + C.aha + "</p></div>";
  var modeRG = radios($("#rs-mode"), { label:"Mode", options:[{ id:"ev", t:"Evaluate" }, { id:"notes", t:"Notes" }, { id:"cite", t:"Cite" }], value:S.mode, onChange:function(v){ RUN++; S.mode = v; api.save(); paint(); } });
  function paint(){ if (S.mode === "ev") paintEv(); else if (S.mode === "notes") paintNotes(); else paintCite(); read(); MV.changed(); }
  function changed(){ api.save(); read(); MV.changed(); }

  // ----- Evaluate -----
  function ev(id){ id = id || S.src; return S.ev[id] || (S.ev[id] = { v:[1, 1, 1, 1, 1], checked:false, verdict:"" }); }
  function total(a){ return a.reduce(function(s, x){ return s + x; }, 0); }
  function rule(t, ai){ return ai ? "dont" : t >= 8 ? "cite" : t >= 5 ? "bg" : "dont"; }
  function vName(id){ var v = byId(C.verdicts, id); return v ? v.t : ""; }
  function shownV(){ var v = ev().v.slice(); if (S.whatIf && S.src === "s2") v[0] = 2; return v; }
  function radar(v, key){
    var cx = 130, cy = 104, R = 70, n = 5;
    function pt(i, val){ var a = -Math.PI / 2 + i * 2 * Math.PI / n, r = R * val / 2; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
    function poly(vals, cls){ return '<polygon class="' + cls + '" points="' + vals.map(function(x, i){ return pt(i, x).map(function(z){ return z.toFixed(1); }).join(","); }).join(" ") + '"/>'; }
    var d = "Source profile: " + C.crit.map(function(c, i){ return c.t + " " + v[i]; }).join(", ") + ", total " + total(v) + " of 10" + (key ? ". Key (dashed): " + C.crit.map(function(c, i){ return c.t + " " + key[i]; }).join(", ") + ", total " + total(key) : "") + ".";
    var h = '<svg class="rs-radar" viewBox="0 0 260 214" role="img" aria-label="' + esc(d) + '">' + poly([1, 1, 1, 1, 1], "rs-ring") + poly([2, 2, 2, 2, 2], "rs-ring");
    C.crit.forEach(function(c, i){ var p = pt(i, 2), l = pt(i, 2.42); h += '<line class="rs-spoke" x1="' + cx + '" y1="' + cy + '" x2="' + p[0].toFixed(1) + '" y2="' + p[1].toFixed(1) + '"/><text class="rs-rl" x="' + l[0].toFixed(1) + '" y="' + (l[1] + 4).toFixed(1) + '">' + c.t + "</text>"; });
    if (key) h += poly(key, "rs-key");
    h += poly(v, "rs-you") + v.map(function(x, i){ var p = pt(i, x); return '<circle class="rs-dot" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3.5"/>'; }).join("");
    return h + "</svg>";
  }
  function chatHTML(){
    var ch = C.chat, k = 0;
    var body = ch.parts.map(function(p){ if (!p.id) return p.t; k++; return '<mark class="rs-mk">' + p.t + '<sup class="rs-n">' + k + "</sup></mark>"; }).join("");
    return '<div class="rs-chat" role="group" aria-label="TextPal chat"><p class="rs-bub me"><span class="rs-who">You</span>' + ch.q + '</p><p class="rs-bub bot"><span class="rs-who">TextPal</span>' + body + "</p>" +
      (S.askSrc ? '<p class="rs-bub me"><span class="rs-who">You</span>' + ch.ask + '</p><p class="rs-bub bot' + (anim.ask ? " rs-in" : "") + '"><span class="rs-who">TextPal</span>' + ch.answer + "</p>" : "") + "</div>" +
      '<div class="rs-tools"><div class="rs-tool"><label for="rs-nq">Search the novel (exact phrase)</label><div class="rs-row"><input id="rs-nq" class="txtin" type="text" autocomplete="off" spellcheck="false"><button type="button" class="btn sm" id="rs-ns">Search</button></div><div id="rs-nr" class="rs-res" aria-live="polite"></div></div>' +
      '<div class="rs-tool"><label for="rs-lq">Search the library index (title or author)</label><div class="rs-row"><input id="rs-lq" class="txtin" type="text" autocomplete="off" spellcheck="false"><button type="button" class="btn sm" id="rs-ls">Search</button></div><div id="rs-lr" class="rs-res" aria-live="polite"></div></div></div>' +
      '<div class="rs-marks"><p class="rs-lab">Verify TextPal’s answer</p><div id="rs-marks"></div></div>';
  }
  var ITEMS = { q1:"The green light is the heartbeat of the past", r1:"Wilson James Green Lights and Gold Journal of American Letters 2015", q2:"Gatsby believed in the green light the orgastic future that year by year recedes before us" };
  function nn(s){ return MV.eng.norm(MV.plain(s)); }
  function novelSearch(q, user){
    var qn = nn(q); if (qn.split(" ").length < 2) return '<p class="tiny">Type at least two words of an exact phrase.</p>';
    if (user) ["q1", "q2"].forEach(function(id){ if (nn(ITEMS[id]).indexOf(qn) >= 0) S.found[id] = true; });
    var hits = C.novel.filter(function(p){ return nn(p.t).indexOf(qn) >= 0; });
    return hits.length ? hits.map(function(p){ return '<p class="rs-hit"><span class="tag">Chapter ' + p.ch + "</span> “" + esc(p.t) + (p.part ? " …" : "") + "”</p>"; }).join("") : '<p class="rs-none">No match in the novel.</p>';
  }
  function libSearch(q, user){
    var qn = nn(q); if (!qn) return '<p class="tiny">Type a title or an author.</p>';
    if (user && qn.split(" ").length >= 2 || user && qn === "wilson") { if (nn(ITEMS.r1).indexOf(qn) >= 0) S.found.r1 = true; }
    var hits = C.library.filter(function(r){ return nn(r.join(" ")).indexOf(qn) >= 0; });
    return hits.length ? hits.slice(0, 6).map(function(r){ return '<p class="rs-hit">' + esc(r[0]) + ". “" + esc(r[1]) + ".” " + esc(r[2]) + ", " + esc(r[3]) + ".</p>"; }).join("") + (hits.length > 6 ? '<p class="tiny muted">' + (hits.length - 6) + " more…</p>" : "") : '<p class="rs-none">No record found.</p>';
  }
  function paintMarks(){
    var el = $("#rs-marks"); if (!el) return;
    var parts = C.chat.parts.filter(function(p){ return p.id; });
    el.innerHTML = parts.map(function(p, i){ return '<div class="rs-mrow"><p class="rs-mt"><span class="rs-n">' + (i + 1) + "</span> " + p.t + (S.found[p.id] ? ' <span class="tag">searched</span>' : "") + '</p><div data-mr="' + p.id + '"></div></div>'; }).join("");
    parts.forEach(function(p, i){ radios(el.querySelector('[data-mr="' + p.id + '"]'), { aria:"Item " + (i + 1) + ": verified or unverified", options:[{ id:"v", t:"Verified" }, { id:"u", t:"Unverified" }], value:S.tc3[p.id] || "", onChange:function(v){ S.tc3[p.id] = v; changed(); } }); });
  }
  function paintEv(){
    var s = SRC[S.src], e = ev();
    $("#rs-main").innerHTML = '<div id="rs-src"></div><div class="rs-card"><p class="rs-head"><span class="tag">' + s.n + "</span> " + s.head + '</p><p class="rs-says"><span class="rs-lab">What it says</span> ' + s.says + "</p>" + (s.ai ? chatHTML() : "") + "</div>" +
      '<div class="rs-ev"><div class="rs-crit">' + C.crit.map(function(c, i){ return '<div class="rs-sl"><label for="rs-r' + i + '"><strong>' + c.t + '</strong> <span class="rs-val" id="rs-v' + i + '">' + e.v[i] + '</span></label><input type="range" class="slider" id="rs-r' + i + '" min="0" max="2" step="1" value="' + e.v[i] + '" data-ci="' + i + '" aria-describedby="rs-q' + i + '"><span class="tiny muted" id="rs-q' + i + '">' + c.q + "</span></div>"; }).join("") +
      '<div class="q-actions"><button type="button" class="btn sm" id="rs-check">Check</button></div></div><div class="rs-prof" id="rs-prof"></div></div>' +
      '<div id="rs-use"></div><p class="tiny muted rs-rule">' + C.rule + "</p>";
    radios($("#rs-src"), { label:"Source card", cls:"chips", options:C.sources.map(function(x){ return { id:x.id, t:x.n }; }), value:S.src, onChange:function(v){ RUN++; S.src = v; S.whatIf = false; S.askSrc = false; api.save(); paint(); } });
    radios($("#rs-use"), { label:"Use as", cls:"chips", options:C.verdicts, value:e.verdict, onChange:function(v){ ev().verdict = v; changed(); paintProf(); } });
    if (s.ai) { $("#rs-nq").value = S.nq; $("#rs-lq").value = S.lq; if (S.nq) $("#rs-nr").innerHTML = novelSearch(S.nq, false); if (S.lq) $("#rs-lr").innerHTML = libSearch(S.lq, false); paintMarks(); }
    paintProf();
  }
  function paintProf(){
    var el = $("#rs-prof"); if (!el) return;
    var s = SRC[S.src], e = ev(), v = shownV(), t = total(v), r = rule(t, s.ai);
    el.innerHTML = radar(v, e.checked ? s.key : null) + '<p class="rs-legend"><span class="rs-lg you"></span> your profile' + (e.checked ? ' · <span class="rs-lg key"></span> the key (dashed)' : "") + "</p>" +
      '<p class="rs-badge"><span class="rs-bl">' + (S.whatIf && S.src === "s2" ? "What if: a named author with a PhD · " : "By the rule · ") + t + ' / 10</span><strong>' + vName(r) + "</strong></p>" +
      (e.verdict ? '<p class="rs-badge mine"><span class="rs-bl">Your verdict</span><strong>' + vName(e.verdict) + "</strong></p>" : "") +
      (e.checked ? '<p class="tiny rs-knote"><strong>Key: ' + total(s.key) + " / 10 · " + vName(rule(total(s.key), s.ai)) + ".</strong> " + s.note + "</p>" : "");
  }

  // ----- Notes -----
  function paintNotes(){
    $("#rs-main").innerHTML = '<div class="rs-pass"><div class="rs-ph"><span class="rs-lab">S1 passage (Okafor, p. 120)</span><button type="button" class="btn ghost sm" id="rs-hide" aria-expanded="' + !S.hide + '" aria-controls="rs-ptext">' + (S.hide ? "Show source" : "Hide source") + '</button></div><p id="rs-ptext" class="rs-ptext"' + (S.hide ? " hidden" : "") + "></p><p class=\"eng-cite\">" + C.passageCite + "</p></div>" +
      '<div id="rs-ntype"></div><div class="jq"><label for="rs-note">Your note</label><textarea id="rs-note" class="rs-note"></textarea><p class="tiny muted" id="rs-wc" aria-live="polite"></p></div>' +
      '<div class="q-actions"><button type="button" class="btn sm" id="rs-ov">Check overlap</button></div><div id="rs-npv" aria-live="polite"></div>' +
      '<div class="rs-keys"><p class="rg-lab">Key ideas your note keeps (tap each one it keeps)</p><div class="chips rs-kk" id="rs-kk" role="group" aria-label="Key ideas your note keeps"></div></div>';
    radios($("#rs-ntype"), { label:"Note type", options:C.noteTypes, value:S.ntype, onChange:function(v){ S.ntype = v; changed(); } });
    $("#rs-note").value = S.note;
    paintKK(); paintOv();
  }
  function paintKK(){
    var el = $("#rs-kk"); if (!el) return;
    MV.keepFocus(el, function(){ el.innerHTML = C.keys.map(function(k){ var on = !!S.kk[k.id]; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-kk="' + k.id + '" data-k="kk' + k.id + '"><strong>' + k.id + "</strong> " + k.t + "</button>"; }).join(""); });
  }
  function paintOv(){
    if (!$("#rs-ptext")) return;
    var o = overlap(C.passage, S.note);
    $("#rs-ptext").innerHTML = hlHTML(C.passage, o.sm, S.ovShow);
    $("#rs-npv").innerHTML = S.ovShow && S.note.trim() ? '<p class="rs-lab">Your note, with shared 4-word sequences marked (' + o.n + ")</p><p class=\"rs-npv" + (anim.ov ? " rs-in" : "") + "\">" + hlHTML(S.note, o.nm, true) + "</p>" : "";
    $("#rs-wc").textContent = wc(S.note) + " words";
  }

  // ----- Cite -----
  function cst(id){ return S.wc[id] || (S.wc[id] = {}); }
  function paintCite(){
    var c = cardById(S.card), st = cst(c.id);
    $("#rs-main").innerHTML = '<div id="rs-cards"></div>' + factsHTML(c) + '<p class="tiny muted">' + W.intro + '</p><p class="wc-tpl"><span class="rs-lab">Template</span> ' + W.template + '</p><div id="rs-wcb" class="' + (anim.shift ? "rs-shift" : "") + '"></div>' +
      '<div class="q-actions"><button type="button" class="btn sm" id="rs-wck">Check</button>' + (st.drop ? '<button type="button" class="btn ghost sm" id="rs-undrop">Restore the author</button>' : "") + '</div><div id="rs-wcfb" aria-live="polite"></div>' +
      '<p class="tiny"><span class="rs-lab">In-text citation</span> ' + W.intext[c.id] + '</p><details class="alg"><summary>Works Cited rules</summary><ul>' + W.rules.map(function(r){ return "<li>" + r + "</li>"; }).join("") + "</ul></details>";
    radios($("#rs-cards"), { label:"Source", cls:"chips", options:W.cards.map(function(x){ return { id:x.id, t:x.label }; }), value:S.card, onChange:function(v){ RUN++; S.card = v; api.save(); paint(); } });
    wcUI($("#rs-wcb"), c, st, function(){ paintWcFb(); changed(); });
    paintWcFb();
  }
  function paintWcFb(){
    var el = $("#rs-wcfb"); if (!el) return;
    var c = cardById(S.card), st = cst(c.id), sc = wcScore(c, st);
    el.innerHTML = st.drop ? MV.fbHTML("", "With no author, the entry begins with the title, and it is alphabetized by the title’s first significant word.") :
      st.checked ? MV.fbHTML(sc.ok ? "good" : "bad", sc.ok ? "<strong>✓ Exact match with the key.</strong> " + sc.el + " of " + sc.n + " elements correct." : "<strong>✗ Not yet.</strong> " + wcErr(c, st, W.fb) + " (" + sc.el + " of " + sc.n + " elements correct)") : "";
  }

  function read(){
    var R = [];
    if (S.mode === "ev") {
      var e = ev(), v = shownV(), t = total(v), s = SRC[S.src];
      R.push(["Source profile", t + " / 10" + (e.checked ? " · key " + total(s.key) + " / 10" : " (press Check for the key)")]);
      R.push(["Verdict", vName(rule(t, s.ai)) + (s.ai ? " (an AI answer, whatever its total)" : " (by the verdict rule)")]);
      R.push(["Your verdict", e.verdict ? vName(e.verdict) : "not chosen yet"]);
      R.push(["Verdicts given", C.sources.filter(function(x){ return (S.ev[x.id] || {}).verdict; }).length + " of 6"]);
    } else if (S.mode === "notes") {
      var o = overlap(C.passage, S.note), ci = citeInfo(S.note), w = wc(S.note);
      R.push(["Overlap", o.n + " shared 4-word sequence" + (o.n === 1 ? "" : "s") + (o.n && !S.ovShow ? " (press Check overlap to see them)" : "")]);
      R.push(["Citation present", ci.par && ci.named ? "Yes: " + (/Okafor/.test(ci.par) ? ci.par : "Okafor … " + ci.par) : ci.par ? "Partly: " + ci.par + "; name Okafor" : ci.named ? "Partly: Okafor named; add (120)" : "No"]);
      R.push(["Word count", w + (S.ntype === "paraphrase" ? " (paraphrase: 25–70)" : "")]);
      R.push(["Key ideas kept", C.keys.filter(function(k){ return S.kk[k.id]; }).map(function(k){ return k.id; }).join(", ") || "none ticked"]);
    } else {
      var c = cardById(S.card), sc = wcScore(c, cst(c.id));
      R.push(["Source", MV.plain(c.label)]);
      R.push(["Entry check", sc.el + " of " + sc.n + " elements correct" + (sc.ok ? " ✓" : "")]);
    }
    $("#rs-read").innerHTML = MV.readoutHTML(R);
  }

  // ----- events -----
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.dataset.ci != null) { var i = +t.dataset.ci; ev().v[i] = +t.value; S.whatIf = false; $("#rs-v" + i).textContent = t.value; paintProf(); changed(); }
    else if (t.id === "rs-note") { S.note = t.value; paintOv(); changed(); }
    else if (t.id === "rs-nq") { S.nq = t.value; api.save(); }
    else if (t.id === "rs-lq") { S.lq = t.value; api.save(); }
  });
  function doSearch(kind){
    if (kind === "n") $("#rs-nr").innerHTML = novelSearch(S.nq, true); else $("#rs-lr").innerHTML = libSearch(S.lq, true);
    api.save(); paintMarks(); MV.changed();
  }
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter") return; if (e.target.id === "rs-nq") { e.preventDefault(); doSearch("n"); } else if (e.target.id === "rs-lq") { e.preventDefault(); doSearch("l"); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.id === "rs-check") { ev().checked = true; paintProf(); changed(); }
    else if (b.id === "rs-hide") { S.hide = !S.hide; $("#rs-ptext").hidden = !!S.hide; b.textContent = S.hide ? "Show source" : "Hide source"; b.setAttribute("aria-expanded", String(!S.hide)); api.save(); }
    else if (b.id === "rs-ov") { S.ovShow = true; anim = { ov:1 }; paintOv(); anim = {}; changed(); }
    else if (b.dataset.kk) { S.kk[b.dataset.kk] = !S.kk[b.dataset.kk]; paintKK(); changed(); }
    else if (b.id === "rs-ns") doSearch("n");
    else if (b.id === "rs-ls") doSearch("l");
    else if (b.id === "rs-wck") { cst(S.card).checked = true; paintCite(); changed(); var k = $("#rs-wck"); if (k) k.focus(); }
    else if (b.id === "rs-undrop") { cst(S.card).drop = null; paintCite(); changed(); }
  });

  // ----- presets (predictions, challenge set-ups) -----
  function keyState(id){ var c = cardById(id), k = MV.ans(c), st = cst(id); st.order = k.order.slice(); st.p = JSON.parse(JSON.stringify(k.p)); st.form = {}; c.els.forEach(function(e){ st.form[e.id] = k.f[e.id]; }); st.drop = null; st.checked = false; }
  var PRE = {
    p1:function(){ S.mode = "ev"; S.src = "s2"; var e = ev("s2"); e.v = SRC.s2.key.slice(); e.checked = true; S.whatIf = false; },
    p2:function(){ S.mode = "notes"; S.note = C.draft; S.ntype = "paraphrase"; S.ovShow = false; S.hide = false; },
    p3:function(){ S.mode = "cite"; S.card = "s3"; keyState("s3"); },
    p4:function(){ S.mode = "ev"; S.src = "s5"; S.askSrc = false; }
  };
  function go(fn){ RUN++; anim = {}; fn(); modeRG.set(S.mode); api.save(); paint(); }
  function reveal(id, done){
    var me = ++RUN;
    if (id === "p1") { S.whatIf = true; }
    else if (id === "p2") { S.ovShow = true; anim = { ov:1 }; }
    else if (id === "p3") { cst("s3").drop = { author:1 }; anim = { shift:1 }; }
    else if (id === "p4") { S.askSrc = true; S.lq = "Green Lights and Gold"; anim = { ask:1 }; }
    paint();
    if (id === "p4") { var r = $("#rs-lr"); if (r) r.innerHTML = libSearch(S.lq, false); }
    api.save();
    MV.wait(1500, function(){ if (me === RUN) anim = {}; done(); });
  }
  document.addEventListener("click", function(e){
    var b = e.target.closest(".rs-setup"); if (!b) return;
    var id = b.dataset.setup;
    go(function(){ if (id === "tc1") S.mode = "ev"; else if (id === "tc2") { S.mode = "notes"; S.ovShow = true; } else { S.mode = "ev"; S.src = "s5"; } });
    var g = $("#ex-app"); if (g && g.scrollIntoView) g.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
  });

  // ----- target challenges (exact tests from the plan; named wrong states first) -----
  function tc1(){
    function V(id){ return (S.ev[id] || {}).verdict || ""; }
    if (V("s5") === "cite" || V("s5") === "bg") return "A chatbot answer isn’t an accountable source. Its claims must be verified elsewhere.";
    if (V("s3") === "cite") return "A teacher’s blog can spark ideas, but it isn’t reviewed. Use it as background and look for scholarship.";
    if (V("s4") === "cite") return "Fine for context about the 1920s; it can’t support an argument about the novel’s craft.";
    var n = C.sources.filter(function(s){ return V(s.id); }).length;
    if (n < 6) return "Give every source a verdict in Evaluate mode (" + n + " of 6 so far).";
    var bad = C.sources.filter(function(s){ return V(s.id) !== rule(total(s.key), s.ai); });
    if (bad.length) return "Check " + bad.map(function(s){ return s.n; }).join(", ") + ": compare each profile’s total with the verdict rule. " + C.m1;
    return true;
  }
  function tc2(){
    var note = S.note || "", o = overlap(C.passage, note), w = wc(note);
    if (!note.trim()) return "Write your paraphrase in Notes mode first.";
    if (o.n >= 1) { S.ovShow = true; paintOv(); api.save(); return "Close the source, and say it your way. (" + o.n + " shared 4-word sequence" + (o.n > 1 ? "s" : "") + " marked in Notes mode.) " + C.m2; }
    if (!citeInfo(note).par) return "A paraphrase borrows the idea; cite it.";
    if (w > 70) return "That’s growing into a summary of everything; keep it to the three ideas.";
    if (w < 25) return "Say all three ideas: aim for 25–70 words.";
    if (!/\bOkafor\b/.test(note)) return "Name Okafor in a signal phrase, such as “According to Okafor, …”.";
    if (!/\([^()]*\b120\b[^()]*\)\s*[.!?]?\s*$/.test(note)) return "End with the parenthetical citation: … (120).";
    if (!(S.kk.K1 && S.kk.K2 && S.kk.K3)) return "Tick the key ideas your note keeps. It must keep K1, K2 and K3.";
    return true;
  }
  function tc3(){
    var M = S.tc3, ids = ["q1", "r1", "q2"];
    if (ids.some(function(id){ return M[id] && !S.found[id]; })) return "Use the tools; a hunch isn’t verification.";
    var n = ids.filter(function(id){ return M[id]; }).length;
    if (n < 3) return "Open S5 in Evaluate mode and mark all three items, using the check tools (" + n + " of 3 marked).";
    if (M.q1 === "v") return "Search the novel: no match. A fluent quotation can still be invented. " + C.m5;
    if (M.q2 === "u") return "Search again: chapter 9 has it, word for word.";
    if (M.r1 === "v") return "Search the library index: no record found. A confident reference can still be invented.";
    return true;
  }
  paint();
  EX = {
    predict:{ start:function(p){ go(PRE[p.id]); }, run:function(p, done){ reveal(p.id, done); } },
    challenge:function(id){ var r = id === "tc1" ? tc1() : id === "tc2" ? tc2() : tc3(); return r === true ? { ok:true } : { ok:false, msg:r }; }
  };
  return EX;
}

// ---------- Part 3: Using critics — Station 1 name the move, Station 2 build your move (E6 slots + "Check it with craft"),
// Station 3 integrity in the age of AI (teacher setting: the AI policy) ----------
var MAINHINGE = /^(while|although|though|whereas|even though|as)\b/i;
function craft(sent, critic, hinges){
  var s = String(sent || "").trim(), out = [];
  if (!s) return '<p class="tiny muted">Write your sentence first.</p>';
  var main = MAINHINGE.test(s) && s.indexOf(",") > 0 ? s.slice(s.indexOf(",") + 1) : s.split(/[,;:]/)[0];
  var mw = MV.eng.words(main).slice(0, 4).join(" "), owner = new RegExp("\\b" + critic + "\\b", "i").test(mw) || /^\s*according to\b/i.test(main);
  out.push((owner ? "✗ " : "✓ ") + "<strong>Main clause:</strong> “" + esc(main.trim()) + "” " + (owner ? "is " + critic + "’s. Lead with your claim and let the critic follow." : "is yours."));
  var found = hinges.filter(function(h){ return MV.eng.hasWord(s, h); });
  out.push((found.length ? "✓ " : "✗ ") + "<strong>Hinge word:</strong> " + (found.length ? found.map(function(h){ return '<mark class="an an-syntax">' + h + "</mark>"; }).join(" ") : "none yet. Try <em>while</em>, <em>however</em>, <em>overlooks</em>, <em>extends</em>…"));
  out.push((/\([^()]+\)/.test(s) ? "✓ " : "✗ ") + "<strong>Citation:</strong> " + (/\([^()]+\)/.test(s) ? "present." : "add the page in parentheses."));
  out.push((MV.eng.hasWord(s, critic) ? "✓ " : "✗ ") + "<strong>Critic named:</strong> " + (MV.eng.hasWord(s, critic) ? critic + "." : "name " + critic + " in a signal phrase."));
  return '<ul class="rs3-craft">' + out.map(function(x){ return "<li>" + x + "</li>"; }).join("") + "</ul>";
}
function part3(host, api){
  var C = api.content, S = api.S, NOVEL = MV.C.explore.novel;
  S.st = ["st1", "st2", "st3"].indexOf(S.st) >= 0 ? S.st : "st1";
  S.mv = S.mv || {}; S.b = S.b || {}; S.j = S.j || {}; S.pol = S.pol || "brain"; if (S.claim == null) S.claim = "";
  host.innerHTML = '<div class="rs3"><div id="rs3-tabs"></div><div class="rs3-st" id="rs3-st"></div></div>';
  radios($("#rs3-tabs"), { cls:"chips", aria:"Stations", options:[{ id:"st1", t:"1. Name the move" }, { id:"st2", t:"2. Build your move" }, { id:"st3", t:"3. Integrity in the age of AI" }], value:S.st, onChange:function(v){ S.st = v; api.save(); paint(); } });
  function mvName(id){ var m = byId(C.moves, id); return m ? m.t : ""; }
  function paint(){
    var el = $("#rs3-st"), h = "";
    if (S.st === "st1") {
      h = '<p class="muted">Tag each model sentence with the move it makes: agree and extend, complicate, push back, hiding (a quotation with no claim) or background only.</p>' +
        C.st1.map(function(x, i){ return '<div class="rs3-s"><p class="rs3-q"><span class="rs-n">' + (i + 1) + "</span> " + x.s + '</p><div data-m1="' + x.id + '"></div><div data-f1="' + x.id + '"></div></div>'; }).join("");
      el.innerHTML = h;
      C.st1.forEach(function(x, i){ radios(el.querySelector('[data-m1="' + x.id + '"]'), { cls:"chips", aria:"Move of sentence " + (i + 1), options:C.moves, value:S.mv[x.id] || "", onChange:function(v){ S.mv[x.id] = v; api.save(); fb1(x); } }); fb1(x); });
    } else if (S.st === "st2") {
      h = '<p class="muted">Write one sentence for each move, with your own claim about Nick in charge. Choose a critic and a piece of novel evidence, then press <strong>Check it with craft</strong>.</p>' +
        '<div class="jq"><label for="rs3-claim">Your claim about Nick (one sentence, your own words)</label><input id="rs3-claim" class="txtin rs3-claim" type="text" autocomplete="off"></div>' +
        '<ul class="rs3-crit">' + C.critics.map(function(c){ return "<li>" + c.t + "</li>"; }).join("") + "</ul>" +
        ["agree", "comp", "push"].map(function(m){
          var b = S.b[m] || {};
          return '<div class="rs3-b"><h4>' + cap(mvName(m)) + '</h4><p class="tiny muted">Frame: ' + C.frames[m] + '</p><div class="rs3-sel"><label>Critic <select class="rs-sel" data-bc="' + m + '">' + C.critics.map(function(c){ return '<option value="' + c.id + '"' + (b.c === c.id ? " selected" : "") + ">" + c.name + "</option>"; }).join("") + "</select></label>" +
            '<label>Novel evidence <select class="rs-sel" data-be="' + m + '">' + NOVEL.map(function(p){ return '<option value="' + p.id + '"' + (b.e === p.id ? " selected" : "") + ">Ch. " + p.ch + ": " + esc(p.t.slice(0, 48)) + "…</option>"; }).join("") + "</select></label></div>" +
            '<p class="tiny rs3-ev" data-bev="' + m + '"></p><label class="vh" for="rs3-t-' + m + '">Your ' + mvName(m) + ' sentence</label><textarea id="rs3-t-' + m + '" data-bt="' + m + '" placeholder="Your ' + mvName(m) + ' sentence"></textarea>' +
            '<div class="q-actions"><button type="button" class="btn sm" data-bk="' + m + '">Check it with craft</button></div><div data-bo="' + m + '" aria-live="polite"></div></div>';
        }).join("");
      el.innerHTML = h;
      $("#rs3-claim").value = S.claim;
      ["agree", "comp", "push"].forEach(function(m){ var b = S.b[m] || {}; el.querySelector('[data-bt="' + m + '"]').value = b.t || ""; evid(m); if (b.k) out(m); });
    } else {
      h = '<p class="muted">Six short scenarios. Each names the teacher’s policy it follows. Choose “OK as is”, “OK with disclosure and citation” or “Not OK”, always <em>according to that policy</em>.</p>' +
        '<div class="rs3-pol"><div id="rs3-pol"></div><p class="tiny" id="rs3-pt"></p><div id="rs3-ai"></div></div><p class="rs3-rule"><strong>' + C.rule + "</strong></p>" +
        C.scenarios.map(function(x, i){ return '<div class="rs3-s"><p class="rs3-q"><span class="rs-n">' + (i + 1) + '</span> <span class="tag">Policy: ' + byId(C.policies, x.policy).t + "</span> " + x.t + '</p><div data-j="' + x.id + '"></div><div data-fj="' + x.id + '"></div></div>'; }).join("");
      el.innerHTML = h;
      radios($("#rs3-pol"), { label:"Teacher setting: your teacher’s AI policy", cls:"chips", options:C.policies, value:S.pol, onChange:function(v){ S.pol = v; api.save(); pol(); } });
      pol();
      C.scenarios.forEach(function(x, i){ radios(el.querySelector('[data-j="' + x.id + '"]'), { cls:"chips", aria:"Judgement for scenario " + (i + 1), options:C.judges, value:S.j[x.id] || "", onChange:function(v){ S.j[x.id] = v; api.save(); fbJ(x); } }); fbJ(x); });
    }
  }
  function fb1(x){ var v = S.mv[x.id], el = $('[data-f1="' + x.id + '"]'); if (!el) return; el.innerHTML = !v ? "" : v === MV.ans(x) ? MV.fbHTML("good", "<strong>✓ " + cap(mvName(v)) + ".</strong> " + x.why) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + C.st1Wrong); }
  function fbJ(x){ var v = S.j[x.id], el = $('[data-fj="' + x.id + '"]'); if (!el) return; el.innerHTML = !v ? "" : v === MV.ans(x) ? MV.fbHTML("good", "<strong>✓ Right.</strong> " + x.why) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> Read the scenario’s own policy: " + C.policyText[x.policy]); }
  function pol(){
    $("#rs3-pt").innerHTML = "<strong>" + byId(C.policies, S.pol).t + ":</strong> " + C.policyText[S.pol];
    $("#rs3-ai").innerHTML = S.pol === "none" ? '<p class="tiny muted">No AI use is allowed, so there is nothing to cite.</p>' : '<p class="tiny"><strong>If you use TextPal as this policy allows, disclose it and cite the prompt (MLA 9):</strong></p><p class="wc-e hang">' + C.aiCite + "</p>";
  }
  function evid(m){ var b = S.b[m] || {}, p = byId(NOVEL, b.e) || NOVEL[0], el = $('[data-bev="' + m + '"]'); if (el) el.innerHTML = '<span class="tag">Chapter ' + p.ch + "</span> “" + esc(p.t) + (p.part ? " …" : "") + "”"; }
  function critic(m){ var b = S.b[m] || {}; return (byId(C.critics, b.c) || C.critics[0]).name; }
  function out(m){ var el = $('[data-bo="' + m + '"]'); if (el) el.innerHTML = craft((S.b[m] || {}).t, critic(m), C.hinges); }
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.id === "rs3-claim") { S.claim = t.value; api.save(); }
    else if (t.dataset.bt) { var b = S.b[t.dataset.bt] || (S.b[t.dataset.bt] = {}); b.t = t.value; api.save(); }
  });
  host.addEventListener("change", function(e){
    var t = e.target, m = t.dataset.bc || t.dataset.be; if (!m) return;
    var b = S.b[m] || (S.b[m] = {}); if (t.dataset.bc) b.c = t.value; else { b.e = t.value; evid(m); }
    api.save(); if (b.k) out(m);
  });
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-bk]"); if (!b) return; var m = b.dataset.bk, s = S.b[m] || (S.b[m] = {}); s.k = true; api.save(); out(m); });
  paint();
  stealExtras();
  return {};
}
// Sentence to steal: a structure check and "Save to my commonplace book"
function stealExtras(){
  var blk = $('.mv-block[data-block="steal"]'); if (!blk || $("#steal-ck")) return;
  var w = MV.S.writes || (MV.S.writes = {}), d = document.createElement("div");
  d.innerHTML = '<ul class="checks" id="steal-ck"></ul><div class="q-actions"><button type="button" class="btn ghost sm" id="steal-save">Save to my commonplace book</button><span class="tiny muted" id="steal-st" aria-live="polite"></span></div>';
  blk.appendChild(d);
  var L = ["A definition sentence: “… is of two kinds.”", "Then a balanced either/or: “We …, or we ….”"];
  function ck(){
    var im = w.steal || "", r = [/\bis of two kinds\b/i.test(im), /\bor\b/i.test(im.replace(/^[\s\S]*?of two kinds[.!]?/i, "")) && /\bwe\b/i.test(im)];
    $("#steal-ck").innerHTML = L.map(function(l, i){ return '<li class="' + (r[i] ? "yes" : "no") + '"><span class="mk" aria-hidden="true">' + (r[i] ? "✓" : "○") + "</span><span>" + l + '<span class="vh">' + (r[i] ? " (met)" : " (not met)") + "</span></span></li>"; }).join("");
    return r[0] && r[1];
  }
  blk.addEventListener("input", function(){ ck(); });
  $("#steal-save").addEventListener("click", function(){
    var ok = ck(), im = (w.steal || "").trim();
    $("#steal-st").textContent = !ok ? "Finish both checks first." : MV.eng.saveLine("Mine: " + im + " (after Johnson: “Knowledge is of two kinds…”)", "", "18. Research and secondary sources: Sentence to steal") ? "Saved to your commonplace book." : "";
  });
  ck();
}

// ---------- Practice 1: Quotation, paraphrase or summary? (type + citation verdict per note; first try per note) ----------
function notesAct(host, api, a){
  var S = api.S; S.d = S.d || {};
  function st(id){ return S.d[id] || (S.d[id] = { tries:0, hint:0, done:false, first:null, ty:"", ci:"" }); }
  function tName(id){ return (byId(a.types, id) || {}).t || ""; }
  function cName(id){ return (byId(a.cites, id) || {}).t || ""; }
  var RG = {};
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){ return '<div class="q" data-ni="' + it.id + '"><p class="q-prompt"><strong>Note ' + (i + 1) + ".</strong> " + it.t + '</p><div data-r="ty"></div><div data-r="ci"></div><div data-r="act"></div></div>'; }).join("");
  function act(it){
    var box = host.querySelector('[data-ni="' + it.id + '"] [data-r="act"]'), x = st(it.id), ans = MV.ans(it);
    var h3 = "Answer: " + tName(ans[0]) + "; " + cName(ans[1]).toLowerCase() + ". " + it.why, fb = "";
    if (x.done) fb = MV.fbHTML("good", "<strong>✓ Correct.</strong> " + it.why);
    else if (x.last) {
      var mt = x.ty === ans[0] ? "Type ✓." : "Type: " + (a.fbSpecial[it.id + "|" + x.ty] || a.fbType[x.ty]);
      var mc = x.ci === ans[1] ? "Citation ✓." : "Citation: " + (it.id === "n8" ? a.fbSpecial["n8|cite"] : a.fbCite[x.ci]);
      fb = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + mt + " " + mc + " Try again.");
    }
    MV.keepFocus(box, function(){
      box.innerHTML = (x.done ? "" : '<div class="q-actions"><button type="button" class="btn sm primary" data-act="ncheck" data-k="nc' + it.id + '"' + (x.ty && x.ci ? "" : " disabled") + ">Check</button>" + MV.hintBtn("nh" + it.id, x.hint) + "</div>" + MV.hintsHTML([a.h1, a.h2, h3], x.hint)) + fb;
    });
  }
  a.items.forEach(function(it, i){
    var box = host.querySelector('[data-ni="' + it.id + '"]'), x = st(it.id);
    RG[it.id] = [
      radios(box.querySelector('[data-r="ty"]'), { label:"Type", cls:"chips", aria:"Type of note " + (i + 1), options:a.types, value:x.ty, disabled:function(){ return st(it.id).done; }, onChange:function(v){ st(it.id).ty = v; st(it.id).last = null; api.save(); act(it); } }),
      radios(box.querySelector('[data-r="ci"]'), { label:"Citation", cls:"chips", aria:"Citation verdict for note " + (i + 1), options:a.cites, value:x.ci, disabled:function(){ return st(it.id).done; }, onChange:function(v){ st(it.id).ci = v; st(it.id).last = null; api.save(); act(it); } })];
    act(it);
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-ni]"); if (!q) return;
    var it = byId(a.items, q.dataset.ni), x = st(it.id), ans = MV.ans(it);
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (b.dataset.act === "ncheck") { x.last = x.ty + "|" + x.ci; if (x.ty === ans[0] && x.ci === ans[1]) { x.done = true; x.first = x.tries === 0 && x.hint < 3; RG[it.id].forEach(function(r){ r.refresh(); }); } else x.tries++; }
    else return;
    MV.save(); act(it); if (b.dataset.act === "ncheck") MV.focusFb(q);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = st(it.id); if (x.done) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = st(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal || a.goal)); }); return g; }
  };
}

// ---------- Practice 3: @component K13 spotProse — Spot the Error (copied from ENG4U 07): "Line n" for the Works Cited list,
// "Sentence n" for paragraphs ----------
function spotProse(host, api, a){
  var r = MV.activityTypes.spot(host, a);
  function fix(){
    $$("[data-sp]", host).forEach(function(box){
      var p = byId(a.problems, box.dataset.sp); if (!p) return; var u = p.unit || "Sentence";
      $$(".sn, .who, .task, .fb strong", box).forEach(function(n){ var t = n.textContent, v = t.replace(/^Step (\d)/, u + " $1").replace(/’s solution$/, "’s work").replace(/^Problem (\d)/, "Piece $1").replace(/: step (\d)/, ": " + u.toLowerCase() + " $1"); if (v !== t) n.textContent = v; });
    });
  }
  new MutationObserver(fix).observe(host, { childList:true }); fix();
  return r;
}

// ---------- Performance task: annotated bibliography (E8 builder per entry, or your own source) + a critic conversation ----------
function sentences(t){
  var out = [], st = 0, inQ = false, par = 0;
  function endAt(i){
    var j = i + 1; while (j < t.length && /[”"’)]/.test(t[j])) j++;
    if (j < t.length && !/\s/.test(t[j])) return -1;
    var k = j; while (k < t.length && /\s/.test(t[k])) k++;
    if (k < t.length && !/[A-Z“"‘]/.test(t[k])) return -1;
    return j;
  }
  for (var i = 0; i < t.length; i++) {
    var c = t[i], closing = false;
    if (c === "“") inQ = true; else if (c === "”") { inQ = false; closing = true; } else if (c === '"') { closing = inQ; inQ = !inQ; }
    else if (c === "(") par++; else if (c === ")") par = Math.max(0, par - 1);
    var cand = closing ? /[.!?]/.test(t[i - 1] || "") : (!inQ && !par && /[.!?]/.test(c));
    if (!cand) continue;
    if (!closing && c === ".") { var pre = t.slice(st, i); if (/(?:^|[\s(])(?:Mrs|Mr|Ms|Dr|St|ch|pars?|pp?|vol|no|ed)$/i.test(pre) || /(?:^|\s)[A-Z]$/.test(pre)) continue; }
    var j = endAt(i); if (j < 0) continue;
    if (closing && /^\s*\(/.test(t.slice(i + 1))) continue;
    out.push(t.slice(st, j).trim()); while (j < t.length && /\s/.test(t[j])) j++; st = j; i = j - 1;
  }
  if (t.slice(st).trim()) out.push(t.slice(st).trim());
  return out;
}
function ownEntry(o, html){
  o = o || {}; function I(s){ return html ? "<i>" + esc(s) + "</i>" : s; } function P(s){ return html ? esc(s) : s; }
  var au = (o.last || "").trim() ? P(o.last.trim() + ", " + (o.first || "").trim()) + ". " : "", seg = [];
  var title = (o.title || "").trim(); if (!title) return au.trim();
  if ((o.cont || "").trim()) seg.push(I(o.cont.trim()));
  ["pub", "date", "loc"].forEach(function(k){ if ((o[k] || "").trim()) seg.push(P(o[k].trim())); });
  return au + ((o.cont || "").trim() ? "“" + P(title) + ".”" : I(title) + ".") + (seg.length ? " " + seg.join(", ") + "." : "");
}
function ownOK(o){ o = o || {}; var f = function(k){ return !!(o[k] || "").trim(); }; return f("title") && f("date") && (f("cont") || f("pub")) && (f("last") === f("first")); }
function entText(e){ if (e.src === "own") return ownEntry(e.own, false); var c = cardById(e.src); return c ? wcEntry(c, e.wc || {}, false) : ""; }
function entHTML(e){ if (e.src === "own") return ownEntry(e.own, true); var c = cardById(e.src); return c ? wcEntry(c, e.wc || {}, true) : ""; }
function entOK(e){ if (e.src === "own") return ownOK(e.own); var c = cardById(e.src); return !!c && wcScore(c, e.wc || {}).ok; }
function surname(e){
  if (e.src === "own") return ((e.own || {}).last || "").trim();
  var c = cardById(e.src); if (!c || !wcEl(c, "author")) return "";
  return MV.ans(c).order[0] === "author" ? wcEl(c, "author").forms[MV.ans(c).f.author].t.split(",")[0] : "";
}
function sortKey(t){ return String(t || "").replace(/^[“"‘'\s]+/, "").replace(/^(a|an|the)\s+/i, "").toLowerCase(); }
var task = (function(){
  var api = null, T = null;
  function explain(){ var e = $("#task-explain"); return e ? e.value : (MV.taskState().explain || ""); }
  function data(S){ S = S || {}; return { ents:(S.ents || []).filter(function(e){ return e && e.src; }), para:S.para || "", claim:S.claim || "", explain:explain() }; }
  function checks(d){
    T = T || MV.C.task;
    var E = d.ents, para = d.para, sents = sentences(para), cl = d.claim && sents.indexOf(d.claim) >= 0 ? d.claim : "";
    var keys = E.map(function(e){ return sortKey(entText(e)); }), sorted = E.length > 0 && keys.every(function(k, i){ return !i || keys[i - 1].localeCompare(k, "en", { sensitivity:"base" }) <= 0; });
    var annRe = new RegExp("\\b(" + T.annWords.join("|") + ")", "i");
    var names = E.map(surname).filter(Boolean);
    return [E.length === 3, E.length > 0 && E.every(entOK), sorted,
      E.length > 0 && E.every(function(e){ var n = wc(e.ann); return n >= 40 && n <= 90 && annRe.test(e.ann || ""); }),
      names.some(function(n){ return MV.eng.hasWord(para, n); }) && /\([^()]*[A-Za-z0-9][^()]*\)/.test(para),
      !!cl && !/[“”"]/.test(cl) && !/\([^()]*\)/.test(cl),
      T.moveWords.some(function(w){ return MV.eng.hasWord(para, w); }),
      wc(para) >= 100 && wc(para) <= 200, wc(d.explain) >= 50];
  }
  function ents(){ var S = api.S; S.ents = S.ents || [{ src:"", wc:{}, own:{}, ann:"" }, { src:"", wc:{}, own:{}, ann:"" }, { src:"", wc:{}, own:{}, ann:"" }]; return S.ents; }
  function all(){ api.save(); paintPv(); api.update(); models(); }
  function paintEnts(){
    var L = ents(), el = $("#tb-ents");
    el.innerHTML = L.map(function(e, i){
      return '<div class="tb-e" data-e="' + i + '"><div class="tb-eh"><strong>Entry ' + (i + 1) + '</strong><label class="vh" for="tb-src' + i + '">Source for entry ' + (i + 1) + '</label><select class="rs-sel" id="tb-src' + i + '" data-src="' + i + '"><option value="">Choose a source…</option>' +
        T.bank.map(function(id){ return '<option value="' + id + '"' + (e.src === id ? " selected" : "") + ">" + esc(MV.plain(cardById(id).label)) + "</option>"; }).join("") + '<option value="own"' + (e.src === "own" ? " selected" : "") + ">My own ISU source</option></select>" +
        '<span class="wcb-mv"><button type="button" class="btn ghost sm" data-eu="' + i + '"' + (i ? "" : " disabled") + ' aria-label="Move entry ' + (i + 1) + ' up">↑</button><button type="button" class="btn ghost sm" data-ed="' + i + '"' + (i < L.length - 1 ? "" : " disabled") + ' aria-label="Move entry ' + (i + 1) + ' down">↓</button><button type="button" class="btn ghost sm" data-er="' + i + '">Remove</button></span></div>' +
        '<div class="tb-b" data-b="' + i + '"></div><label for="tb-ann' + i + '" class="tiny">Annotation: summarize, evaluate, and plan its use (40–90 words)</label><textarea id="tb-ann' + i + '" data-ann="' + i + '" class="tb-ann"></textarea><p class="tiny muted" data-ac="' + i + '" aria-live="polite"></p></div>';
    }).join("") + '<div class="q-actions"><button type="button" class="btn ghost sm" id="tb-add"' + (L.length >= 5 ? " disabled" : "") + ">Add an entry</button></div>";
    L.forEach(function(e, i){
      var b = el.querySelector('[data-b="' + i + '"]');
      el.querySelector('[data-ann="' + i + '"]').value = e.ann || "";
      annCount(i);
      if (e.src === "own") {
        e.own = e.own || {};
        b.innerHTML = '<div class="tb-own">' + T.own.map(function(f){ return '<label class="tiny">' + f.t + '<input class="txtin" type="text" autocomplete="off" data-own="' + i + "|" + f.id + '" value="' + esc(e.own[f.id] || "") + '"></label>'; }).join("") + '</div><p class="tiny muted">The entry is assembled in MLA order: a title with a container goes in quotation marks; a title without one is italicized.</p>';
      } else if (e.src) {
        var c = cardById(e.src); e.wc = e.wc || {};
        b.innerHTML = factsHTML(c) + '<div class="tb-wcb"></div>';
        wcUI(b.querySelector(".tb-wcb"), c, e.wc, all);
      }
    });
  }
  function annCount(i){ var e = ents()[i], n = wc(e.ann), el = $('[data-ac="' + i + '"]'); if (el) el.textContent = n + " words (40–90)" + (n >= 40 && n <= 90 ? " ✓" : ""); }
  function paintPv(){
    var d = data(api.S), el = $("#tb-pv"); if (!el) return;
    el.innerHTML = '<h4 class="tb-wch">Works Cited</h4>' + (d.ents.length ? '<div class="tb-list">' + d.ents.map(function(e){ return '<p class="wc-e hang">' + entHTML(e) + "</p>" + (e.ann && e.ann.trim() ? '<p class="tb-annp">' + esc(e.ann.trim()) + "</p>" : ""); }).join("") + "</div>" : '<p class="tiny muted">Choose your sources.</p>') +
      "<h4>Paragraph</h4>" + (d.para.trim() ? '<p class="tb-para">' + esc(d.para) + "</p>" : '<p class="tiny muted">Your paragraph appears here.</p>') +
      '<p class="tiny">' + (d.claim && sentences(d.para).indexOf(d.claim) >= 0 ? '<span class="an-tag an-syntax">My claim</span> ' + esc(d.claim) : "No sentence tagged as My claim yet.") + "</p>";
  }
  function paintClaim(){
    var S = api.S, el = $("#tb-claim"), L = sentences(S.para || "");
    MV.keepFocus(el, function(){
      el.innerHTML = L.length ? '<div class="chips" role="group" aria-label="Tag the sentence that is My claim">' + L.map(function(s, k){ var on = s === S.claim; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-cl="' + k + '" data-k="cl' + k + '">' + (on ? '<span class="an-tag an-syntax">My claim</span> ' : "") + esc(s.length > 90 ? s.slice(0, 88) + "…" : s) + "</button>"; }).join("") + "</div>"
        : '<p class="tiny muted">Write your paragraph, then tap the sentence that states your claim.</p>';
    });
  }
  function models(){
    var el = $("#tb-models"); if (!el) return;
    var ok = checks(data(api.S)).every(Boolean);
    el.innerHTML = ok ? '<p class="tiny muted">' + T.modelNote + "</p>" + T.models.map(function(m){ return '<details class="alg"><summary>' + m.title + '</summary><h4 class="tb-wch">Works Cited</h4>' + m.wc.map(function(w){ return '<p class="wc-e hang">' + w[0] + '</p><p class="tb-annp">' + w[1] + "</p>"; }).join("") + '<p class="tiny"><strong>Paragraph</strong> (tagged claim: the first sentence)</p><p>' + m.para + "</p></details>"; }).join("") : "";
  }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; var S = a.S; ents(); if (S.para == null) S.para = "";
      inp.innerHTML = '<div class="jq"><span class="ed-h">Annotated bibliography (MLA 9)</span><p class="tiny muted">Choose each source, build its entry in the citation builder, write its annotation, and put the entries in alphabetical order.</p><div id="tb-ents"></div></div>' +
        '<div class="jq"><label for="tb-para">Your paragraph (100–200 words): your claim first, then a critic in conversation with it, and a novel quotation with a citation</label><textarea id="tb-para" class="tb-paraIn"></textarea><p class="tiny muted" id="tb-pc" aria-live="polite"></p></div>' +
        '<div class="jq"><span class="ed-h">Tag your claim: tap the sentence that is <strong>My claim</strong></span><div id="tb-claim"></div></div>';
      pv.innerHTML = '<div id="tb-pv"></div><div id="tb-models"></div>';
      $("#tb-para").value = S.para;
      function pc(){ var n = wc(S.para); $("#tb-pc").textContent = n + " words (100–200)" + (n >= 100 && n <= 200 ? " ✓" : ""); }
      inp.addEventListener("input", function(e){
        var t = e.target;
        if (t.id === "tb-para") { S.para = t.value; pc(); paintClaim(); all(); }
        else if (t.dataset.ann != null) { ents()[+t.dataset.ann].ann = t.value; annCount(+t.dataset.ann); all(); }
        else if (t.dataset.own) { var k = t.dataset.own.split("|"), e2 = ents()[+k[0]]; e2.own = e2.own || {}; e2.own[k[1]] = t.value; all(); }
      });
      inp.addEventListener("change", function(e){ var t = e.target; if (t.dataset.src == null) return; var e2 = ents()[+t.dataset.src]; e2.src = t.value; e2.wc = {}; paintEnts(); var s = $("#tb-src" + t.dataset.src); if (s) s.focus(); all(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || b.disabled) return;
        var L = ents();
        if (b.id === "tb-add") { if (L.length < 5) L.push({ src:"", wc:{}, own:{}, ann:"" }); paintEnts(); var nb = $("#tb-src" + (L.length - 1)); if (nb) nb.focus(); all(); }
        else if (b.dataset.er != null) { L.splice(+b.dataset.er, 1); paintEnts(); var ab = $("#tb-add"); if (ab) ab.focus(); all(); }
        else if (b.dataset.eu != null || b.dataset.ed != null) { var i = +(b.dataset.eu != null ? b.dataset.eu : b.dataset.ed), j = i + (b.dataset.eu != null ? -1 : 1); if (j < 0 || j >= L.length) return; var x = L[i]; L[i] = L[j]; L[j] = x; paintEnts(); var fb2 = $('[data-' + (b.dataset.eu != null ? "eu" : "ed") + '="' + j + '"]'); if (fb2 && fb2.disabled) fb2 = $('[data-' + (b.dataset.eu != null ? "ed" : "eu") + '="' + j + '"]'); if (fb2) fb2.focus(); all(); }
        else if (b.dataset.cl != null) { var s2 = sentences(S.para)[+b.dataset.cl]; S.claim = S.claim === s2 ? "" : s2; paintClaim(); all(); }
      });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ a.update(); models(); });
      paintEnts(); pc(); paintClaim(); paintPv(); models();
    },
    read:function(){ return data(api ? api.S : MV.taskState().app); },
    valid:function(d){ return d.ents.length ? true : "Choose at least one source first."; },
    checks:checks,
    tips:function(d, res){ T = T || MV.C.task; return T.tips.filter(function(_, i){ return !res[i]; }); },
    key:function(d){ return d.ents.map(function(e){ return e.src; }).sort().join("+"); },
    label:function(k){ return k.split("+").map(function(id){ return id === "own" ? "your own source" : MV.plain(cardById(id).label); }).join(" · "); },
    summary:function(ts){
      T = T || MV.C.task;
      var S = ts.app || {}, d = data(S), n = checks(d).filter(Boolean).length, L = [];
      L.push(T.summary + ": " + (n === 9 ? "submitted (full text below)" : "not submitted yet") + " (checklist " + n + "/9)");
      L.push("  Works Cited:");
      if (!d.ents.length) L.push("    (no sources chosen yet)");
      d.ents.forEach(function(e){ L.push("    " + entText(e)); L.push("      Annotation: " + ((e.ann || "").trim().replace(/\s+/g, " ") || "(not written yet)")); });
      L.push("  Paragraph: " + (d.para.trim() ? d.para.trim().replace(/\s+/g, " ") : "(not written yet)"));
      L.push("  My claim: " + (d.claim || "(not tagged)"));
      return L;
    }
  };
})();

// ---------- Reflect extras: sample principles, principle word count, trivium tag, commonplace book ----------
function extras(){
  var R = MV.C.reflect, sheet = $("#art-sheet"), art = $("#art");
  if (sheet && art && R.artSamples && !$("#art-samples")) { var d = document.createElement("div"); d.id = "art-samples"; d.innerHTML = R.artSamples; sheet.insertBefore(d, art); }
  var p = $("#art-p");
  if (p && !$("#art-pw")) { var n = document.createElement("p"); n.className = "tiny muted"; n.id = "art-pw"; n.setAttribute("aria-live", "polite"); p.parentNode.appendChild(n);
    var f = function(){ var k = wc(p.value); n.textContent = "Principle: " + k + " word" + (k === 1 ? "" : "s") + (k >= 6 ? " ✓" : " (write at least 6)"); }; p.addEventListener("input", f); f(); }
  MV.eng.triviumPicker();
  var cp = $("#cp-app"); if (cp && !cp.firstChild) { MV.eng.commonplace(cp, { lines:R.commonplaceLines, source:"18. Research and secondary sources" }); var lab = $('label[for="cp-note"]', cp); if (lab && R.cpNote) lab.textContent = R.cpNote; }
}

MV.module({
  hero:function(){ hero(); },
  explore:function(host, api){ var r = explore(host, api); try { extras(); } catch (e) { console.error(e); } return r; },
  part3:part3,
  activities:{ notes:notesAct, spot:spotProse },
  task:task,
  onShow:function(v){ if (v !== "start" && HR.stop) { HR.stop(); MV.eng.stop(); } }
});
})();
