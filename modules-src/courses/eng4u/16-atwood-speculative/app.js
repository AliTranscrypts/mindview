// ENG4U 16 Atwood and Speculative Canada: hero (the "papers" sentences word by word over a newspaper column whose margins fill with
// people), World-building lab (Explore: Gilead's roots thread map + TC1 gauge + TC3 stage order; Track conventions on the plan's
// quotations, excerpt-slot "Read in your copy" cards, the student's own lines, a convention chart and the TC2 word sort; Build: trend
// and element cards, an isometric world map, premise and genre tag), Language as control (Part 3: ladder of reading, an analytical
// sentence builder, a two-text sort), Convention sort, "The Archivist", Spot the Error and "Pitch a speculative world".
// Teacher setting ?path=forster swaps the excerpt slots and the Sentence to steal for their Forster counterparts (plan §5).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
var FP = /[?&]path=forster(&|$)/.test(location.search || "");
function wc(s){ return MV.eng.wordCount(s || ""); }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
function clean(s){ return String(s || "").replace(/\s+/g, " ").trim(); }
function EXC(){ return MV.C.explore; }
function EXS(){ return MV.S.app.explore || (MV.S.app.explore = {}); }
function BST(){ var S = EXS(); S.build = S.build || {}; S.build.trends = S.build.trends || {}; S.build.els = S.build.els || {}; return S.build; }
function conv(id){ return byId(EXC().conv, id); }
function paintIn(el, h){ if (el) MV.keepFocus(el, function(){ el.innerHTML = h; }); }

// ---------- @component radioGroup (copied from ENG4U 14; no option needs to be checked) ----------
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), locked = false;
  function off(id){ return locked || !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = ids.indexOf(val) >= 0 && !off(val) ? val : ids.filter(function(id){ return !off(id); })[0];
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + esc(id) + '"' + (x.cls ? ' class="' + x.cls + '"' : "") + (off(id) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector('[tabindex="0"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (off(id)) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled && host.contains(b)) { e.stopPropagation(); choose(b.dataset.rg); } });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); e.stopPropagation();
    var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(b.dataset.rg);
    for (var k = 0; k < ids.length; k++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); var nb = host.querySelector('[data-rg="' + ids[i] + '"]'); if (nb) nb.focus(); return; } }
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, refresh:paint };
}

// ---------- local voice (read-aloud never leaves the device; plan §5: local voices only) ----------
var VOICE = null, voiceCbs = [];
function voiceReady(fn){ if (fn) voiceCbs.push(fn); MV.eng.voice(function(v){ VOICE = v; var c = voiceCbs; voiceCbs = []; c.forEach(function(f){ try { f(v); } catch (e) { console.error(e); } }); }); }

// ---------- hero: two sentences word by word; a newspaper column sets in grey; its margins glow and fill with people ----------
var HR = { run:0 };
function hero(){
  var H = MV.C.hero, host = $("#at-hero"); if (!host) return;
  var W = H.line.split(/\s+/), LN = [[0, 9], [10, 16], [17, W.length - 1]];
  var iPap = W.indexOf("papers."), iBlank = W.indexOf("blank");
  var s = '<svg class="at-hsvg" viewBox="0 0 420 330" role="img" aria-label="' + esc(H.aria) + '" focusable="false">';
  LN.forEach(function(r, k){ var t = ""; for (var i = r[0]; i <= r[1]; i++) t += '<tspan class="at-hw" data-wi="' + i + '">' + esc(W[i]) + "</tspan>" + (i < r[1] ? " " : ""); s += '<text class="at-hline" x="210" y="' + (28 + k * 22) + '" text-anchor="middle">' + t + "</text>"; });
  s += '<g class="at-hmars"><rect class="at-hmar" x="36" y="94" width="104" height="208" rx="4"/><rect class="at-hmar" x="280" y="94" width="104" height="208" rx="4"/></g>';
  s += '<g class="at-hcol"><rect class="at-hpaper" x="148" y="94" width="124" height="208"/><rect class="at-hmast" x="156" y="102" width="108" height="12"/>';
  for (var y = 124, k = 0; y < 296; y += 8, k++) s += '<rect class="at-hln" x="156" y="' + y + '" width="' + (k % 5 === 4 ? 64 : 108 - (k % 3) * 6) + '" height="3.2"/>';
  s += "</g>";
  [[70, 122], [108, 182], [76, 244], [312, 140], [350, 206], [318, 262]].forEach(function(p, i){
    var x = p[0], y0 = p[1];
    s += '<g class="at-hfig" data-hf="' + i + '"><circle cx="' + x + '" cy="' + y0 + '" r="5"/><path d="M' + x + " " + (y0 + 5) + " V" + (y0 + 20) + " M" + (x - 7) + " " + (y0 + 10) + " H" + (x + 7) + " M" + x + " " + (y0 + 20) + " L" + (x - 6) + " " + (y0 + 30) + " M" + x + " " + (y0 + 20) + " L" + (x + 6) + " " + (y0 + 30) + '"/></g>';
  });
  s += '<text class="at-hcap" x="210" y="322" text-anchor="middle">' + esc(H.caption) + "</text></svg>";
  host.innerHTML = '<div class="at-hwrap">' + s + '</div><p class="eng-cite at-hcite">' + H.credit + '</p><div class="at-hctl"><button type="button" class="btn ghost sm" id="at-hlisten" hidden>' + H.listen + '</button><button type="button" class="btn ghost sm" id="at-hagain" hidden>' + H.watch + '</button></div><p class="tiny at-hself" id="at-hself">' + H.yourself + "</p>";
  var svg = $(".at-hsvg", host), WS = $$(".at-hw", svg), tok = null;
  function words(n, speak){ WS.forEach(function(e, i){ e.classList.toggle("on", i <= n); e.classList.toggle("speaking", !!speak && i === n); }); }
  function stage(n){ svg.classList.toggle("col", n >= iPap - 1); svg.classList.toggle("mar", n >= iBlank); svg.classList.toggle("figs", n >= W.length - 1); }
  function finish(){ host.classList.remove("anim"); words(W.length - 1); stage(W.length); svg.classList.add("cap"); btns(); }
  function at(me, ms, fn){ MV.wait(ms, function(){ if (me === HR.run) fn(); }); }
  function animate(){
    var me = ++HR.run, t = 300; MV.eng.stop(); host.classList.add("anim"); svg.classList.remove("cap"); words(-1); stage(-1);
    for (var i = 0; i < W.length; i++) (function(i){ at(me, t, function(){ words(i); stage(i); }); t += i === iPap || i === W.length - 1 ? 900 : 360; })(i);
    at(me, t + 900, function(){ svg.classList.add("cap"); });
    at(me, t + 1300, finish);
  }
  function listen(){
    var me = ++HR.run; finish(); words(-1);
    MV.eng.say(H.line, { voice:VOICE, rate:0.85, onWord:function(k){ if (me === HR.run) words(k, true); }, onEnd:function(){ if (me === HR.run) words(W.length - 1); } });
  }
  function btns(){ $("#at-hlisten").hidden = !VOICE; $("#at-hagain").hidden = MV.reduceMotion; }
  $("#at-hlisten").addEventListener("click", listen);
  $("#at-hagain").addEventListener("click", animate);
  if (MV.reduceMotion) finish(); else animate();
  voiceReady(btns);
  HR.stop = function(){ MV.eng.stop(); if (host.classList.contains("anim")) { HR.run++; finish(); } };
}

// ---------- shared: Build-mode state (trends with a push, elements with a linked precedent) ----------
function premiseOf(st){
  var X = EXC(), T = X.trends.filter(function(t){ return st.trends[t.id]; }), E = X.elements.filter(function(e){ return st.els[e.id] != null; });
  if (!T.length || !E.length) return "";
  return "What if " + T.map(function(t){ return t.p + " " + byId(X.push, st.trends[t.id]).t; }).join(" and ") + ", so that " + E.map(function(e){ return e.np; }).join(" and ") + " became normal?";
}
function buildFacts(st){
  var X = EXC(), E = X.elements.filter(function(e){ return st.els[e.id] != null; });
  var imp = E.filter(function(e){ return e.deck === "X"; }), linked = E.filter(function(e){ return e.deck === "P" && st.els[e.id]; });
  return { E:E, imp:imp.length, linked:linked.length, n:E.length, conv:E.filter(function(e){ return e.conv; }).map(function(e){ return e.conv; }),
    comfort:X.trends.some(function(t){ return st.trends[t.id] && t.comfort; }) };
}
// ---------- @component elementPicker (E9 world-map inputs) — element cards in two decks (choose 2–4), each precedent-deck card with a
// Link button that opens a precedent drawer (radio list). Shared by Explore Build and the task. ----------
function elementsHTML(st, open, uid){
  var X = EXC(), L = X.buildL;
  return ["P", "X"].map(function(d){
    return '<div class="at-deck"><p class="at-lab">' + X.decks[d] + '</p><div class="at-cards">' + X.elements.filter(function(e){ return e.deck === d; }).map(function(e){
      var on = st.els[e.id] != null, lk = st.els[e.id] ? byId(X.bprec, st.els[e.id]) : null;
      var h = '<div class="at-card' + (on ? " on" : "") + (d === "X" ? " imp" : "") + '"><button type="button" class="at-cbtn" data-el="' + e.id + '" data-k="' + uid + "el" + e.id + '" aria-pressed="' + on + '">' + e.t + "</button>";
      if (on && d === "P") h += '<button type="button" class="btn ghost sm at-linkb" data-link="' + e.id + '" data-k="' + uid + "lk" + e.id + '" aria-expanded="' + (open === e.id) + '">' + L.link + "</button>" + '<span class="tiny at-lk">' + (lk ? "✓ " + L.linked + " " + lk.t : "○ not linked yet") + "</span>";
      if (on && d === "P" && open === e.id) h += '<div class="at-drawer" role="group" aria-label="' + esc(L.choosePrec + ": " + e.t) + '">' + X.bprec.map(function(p){ return '<button type="button" class="chip' + (st.els[e.id] === p.id ? " on" : "") + '" data-bp="' + p.id + '" data-k="' + uid + "bp" + p.id + '" aria-pressed="' + (st.els[e.id] === p.id) + '">' + p.t + "</button>"; }).join("") + '<button type="button" class="btn ghost sm" data-bclose="1" data-k="' + uid + 'bc">' + L.close + "</button></div>";
      return h + "</div>";
    }).join("") + "</div></div>";
  }).join("");
}
// returns {open, msg} after a click on an element-picker button, or null if the click wasn't for the picker
function elementsClick(b, st, open){
  var X = EXC(), d = b.dataset;
  if (d.el) {
    if (st.els[d.el] != null) { delete st.els[d.el]; return { open:open === d.el ? "" : open }; }
    if (Object.keys(st.els).length >= 4) return { open:open, msg:X.buildL.maxE };
    st.els[d.el] = ""; return { open:byId(X.elements, d.el).deck === "P" ? d.el : open };
  }
  if (d.link) return { open:open === d.link ? "" : d.link };
  if (d.bp && open) { st.els[open] = d.bp; return { open:"" }; }
  if (d.bclose) return { open:"" };
  return null;
}

// ---------- isometric world map (Build): a district per trend (bigger with the push), an icon per element ----------
function worldSVG(st){
  var X = EXC(), T = X.trends.filter(function(t){ return st.trends[t.id]; }), E = X.elements.filter(function(e){ return st.els[e.id] != null; });
  var desc = T.length ? "Your world: " + T.map(function(t){ return t.t + " (" + byId(X.push, st.trends[t.id]).t + ")"; }).join("; ") + (E.length ? ". Elements: " + E.map(function(e){ return e.t + (e.deck === "X" ? " (impossible)" : st.els[e.id] ? " (linked)" : " (not linked)"); }).join("; ") : "") + "." : X.buildL.empty;
  var s = '<svg class="at-wsvg" viewBox="0 0 360 210" role="img" aria-label="' + esc(desc) + '"><path class="at-wground" d="M180 70 L350 140 L180 208 L10 140 Z"/>';
  if (!T.length) s += '<text class="at-wnote" x="180" y="144" text-anchor="middle">' + esc(X.buildL.empty) + "</text>";
  var cx = [[96, 132], [180, 112], [264, 132]];
  T.forEach(function(t, i){
    var p = +st.trends[t.id], w = 22 + p * 8, h = 12 + p * 14, x = cx[i][0], y = cx[i][1];
    var top = "M" + x + " " + (y - h - w / 2) + " L" + (x + w) + " " + (y - h) + " L" + x + " " + (y - h + w / 2) + " L" + (x - w) + " " + (y - h) + " Z";
    var L = "M" + (x - w) + " " + (y - h) + " L" + x + " " + (y - h + w / 2) + " L" + x + " " + (y + w / 2) + " L" + (x - w) + " " + y + " Z";
    var R = "M" + (x + w) + " " + (y - h) + " L" + x + " " + (y - h + w / 2) + " L" + x + " " + (y + w / 2) + " L" + (x + w) + " " + y + " Z";
    s += '<g class="at-dist at-dist' + i + '"><path class="at-dl" d="' + L + '"/><path class="at-dr" d="' + R + '"/><path class="at-dt" d="' + top + '"/><text class="at-dlab" x="' + x + '" y="' + (y + w / 2 + 14) + '" text-anchor="middle">' + esc(t.t.split(" ").slice(0, 3).join(" ")) + "</text></g>";
  });
  E.forEach(function(e, i){
    var x = 60 + i * 80, y = 190, imp = e.deck === "X", lk = !!st.els[e.id];
    s += '<g class="at-ico' + (imp ? " imp" : "") + (lk ? " lk" : "") + '"><circle cx="' + x + '" cy="' + (y - 14) + '" r="9"/><text class="at-icl" x="' + x + '" y="' + (y - 10) + '" text-anchor="middle">' + (imp ? "?" : lk ? "✓" : "○") + '</text><text class="at-icn" x="' + x + '" y="' + (y + 6) + '" text-anchor="middle">' + esc(e.t.split(" ").slice(0, 2).join(" ")) + "</text></g>";
  });
  return s + "</svg>";
}

// ---------- @component E9 structureMap (thread-map form) + @component E11 conventionTracker + @component E1 annotationStudio ----------
// The World-building lab. Modes: Gilead's roots (feature → precedent threads, a "Rooted in the real" gauge, TC3 stage order),
// Track conventions (word chips tagged with conventions, a frequency chart, "Read in your copy" excerpt slots, the student's own
// lines, TC2 word sort), Build (trends, push, elements, links, isometric map, premise). Data: content.explore.
var EX = null;
function explore(host, api){
  var C = api.content, S = api.S;
  S.mode = S.mode || "roots"; S.links = S.links || {}; S.tags = S.tags || {}; S.src = S.src || "A"; S.own = Array.isArray(S.own) ? S.own : [];
  S.words = S.words || {}; if (!Array.isArray(S.order)) S.order = C.stages.start.slice(); BST();
  var selF = "", selW = "", open = "", fx = {}, run = { n:0 }, tw = null, sel = [], more = false, note = "";
  function src(id){ var x = byId(C.sources, id); if (FP && x && x.fo) { var y = {}; Object.keys(x).forEach(function(k){ y[k] = x[k]; }); Object.keys(x.fo).forEach(function(k){ y[k] = x.fo[k]; }); y.paras = []; return y; } return x; }
  function correct(){ var K = MV.ans(C); return C.features.filter(function(f){ return S.links[f.id] && S.links[f.id] === K[f.id]; }).length; }
  function bst(){ return fx.build || BST(); }

  host.innerHTML = '<div class="at-ex"><div id="at-mode"></div><p class="how" id="at-how"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="at-main" data-mv="graph" id="at-main"></div><div class="at-readw' + (more ? " all" : "") + '" id="at-readw"><dl class="read at-read" id="at-read" aria-live="polite"></dl><button type="button" class="btn ghost sm at-morebtn" id="at-more" aria-expanded="false">' + C.readout.more + '</button></div><div id="at-aha" aria-live="polite"></div></div>';
  var modeRG = radios($("#at-mode", host), { label:"Mode", options:C.modes, value:S.mode, onChange:function(v){ setMode(v); } });
  $("#at-more", host).addEventListener("click", function(){ more = !more; $("#at-readw", host).classList.toggle("all", more); this.textContent = more ? C.readout.fewer : C.readout.more; this.setAttribute("aria-expanded", more); });
  function setMode(v){ stopFx(); MV.banner("", ""); S.mode = v; modeRG.set(v); selF = ""; selW = ""; open = ""; note = ""; api.save(); paint(); MV.changed(); }

  // ----- readout -----
  function paintRead(){
    var R = C.readout, st = bst(), F = buildFacts(st), P = premiseOf(st), n = correct();
    var cv = S.mode === "track" ? tagConvs().map(function(id){ return conv(id).t; }) : F.conv;
    var rows = [[R.rule, n + " of 6 features rooted in a precedent"], [R.premise, P ? esc(P) : "—"],
      [R.genre, F.n ? (F.imp ? "<strong>" + R.sf + "</strong>" : R.spec) : "—"], [R.rooted, F.n ? F.linked + " of " + F.n + " elements linked to a precedent" : "—"],
      [R.conv, cv.length ? esc(cv.join(", ")) : R.none], [R.comfort, Object.keys(st.trends).length ? (F.comfort ? R.present : R.missing) : "—"]];
    $("#at-read", host).innerHTML = rows.map(function(r, i){ return '<div class="' + (i > 2 ? "at-x" : "") + '"><dt>' + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("");
    $("#at-aha", host).innerHTML = n === 6 ? '<p class="an-note an-theme at-aha">' + C.aha + "</p>" : "";
  }

  // ----- Gilead's roots -----
  function rootsSVG(){
    var K = MV.ans(C), n = correct(), Y = function(i){ return 10 + i * 40; };
    var desc = "Thread map: Gilead’s six features on the left, six precedents on the right. " + (Object.keys(S.links).length ? "Threads: " + C.features.filter(function(f){ return S.links[f.id]; }).map(function(f){ return f.id + " to " + S.links[f.id]; }).join(", ") + ". " : "No threads yet. ") + "Gauge: " + n + " of 6.";
    var s = '<svg class="at-rsvg" viewBox="0 0 400 252" role="img" aria-label="' + esc(desc) + '"><rect class="at-rzone" x="2" y="2" width="160" height="246" rx="8"/><rect class="at-rzone h" x="238" y="2" width="160" height="246" rx="8"/>';
    C.features.forEach(function(f, i){ var p = S.links[f.id]; if (!p) return; var j = C.precedents.map(function(x){ return x.id; }).indexOf(p), y1 = Y(i) + 15, y2 = Y(j) + 15;
      s += '<path class="at-thread" d="M156 ' + y1 + " C200 " + y1 + " 200 " + y2 + " 244 " + y2 + '"/>'; });
    C.features.forEach(function(f, i){ s += '<g class="at-rn' + (selF === f.id ? " sel" : "") + (S.links[f.id] ? " lk" : "") + '"><rect x="8" y="' + Y(i) + '" width="148" height="30" rx="5"/><text x="16" y="' + (Y(i) + 19) + '"><tspan class="at-rid">' + f.id + "</tspan> " + esc(f.short) + "</text></g>"; });
    C.precedents.forEach(function(p, i){ var used = C.features.some(function(f){ return S.links[f.id] === p.id; }); s += '<g class="at-rn' + (used ? " lk" : "") + '"><rect x="244" y="' + Y(i) + '" width="148" height="30" rx="5"/><text x="252" y="' + (Y(i) + 19) + '"><tspan class="at-rid">' + p.id + "</tspan> " + esc(p.short) + "</text></g>"; });
    return s + "</svg>";
  }
  function paintRoots(){
    var M = C.map, n = correct();
    var h = '<div class="at-roots"><div class="at-rmap">' + rootsSVG() + '<div class="at-gauge"><span class="at-glab">' + M.gauge + ": <strong>" + n + " of 6</strong></span><span class=\"at-gbar\" aria-hidden=\"true\"><i style=\"width:" + (n / 6 * 100).toFixed(1) + '%"></i></span></div></div>';
    h += '<p class="at-lab">' + M.features + '</p><div class="at-cards at-row">' + C.features.map(function(f){
      var p = S.links[f.id] ? byId(C.precedents, S.links[f.id]) : null;
      return '<div class="at-card' + (selF === f.id ? " on" : "") + '"><button type="button" class="at-cbtn" data-feat="' + f.id + '" data-k="ft' + f.id + '" aria-pressed="' + (selF === f.id) + '"><span class="at-rid">' + f.id + "</span> " + f.t + ' <span class="tiny muted">(' + f.ch + ")</span></button>" +
        (p ? '<span class="tiny at-lk">↔ ' + p.id + ": " + p.t + ' <button type="button" class="linkbtn" data-unlink="' + f.id + '" data-k="ul' + f.id + '">' + M.unlink + "</button></span>" : "") + "</div>";
    }).join("") + "</div>";
    h += '<p class="at-lab">' + M.drawer + (selF ? ' <span class="tiny muted">(for ' + selF + ")</span>" : "") + '</p><div class="at-cards at-row">' + C.precedents.map(function(p){
      return '<div class="at-card prec"><button type="button" class="at-cbtn" data-prec="' + p.id + '" data-k="pr' + p.id + '"><span class="at-rid">' + p.id + "</span> " + p.t + "</button></div>";
    }).join("") + "</div>" + (note ? '<p class="tiny at-note" role="status">' + note + "</p>" : "");
    var G = C.stages;
    h += '<div class="at-stages"><h4 class="at-h">' + G.title + '</h4><p class="how">' + G.how + '</p><ol class="at-ord">' + S.order.map(function(id, i){
      var c = byId(G.cards, id);
      return '<li><span class="at-oid">' + id + '</span><span class="at-ot">' + c.t + '</span><span class="at-omv"><button type="button" class="btn ghost sm" data-sup="' + i + '" data-k="su' + id + '"' + (i ? "" : " disabled") + ' aria-label="' + G.up + ": " + id + '">↑</button><button type="button" class="btn ghost sm" data-sdn="' + i + '" data-k="sd' + id + '"' + (i < S.order.length - 1 ? "" : " disabled") + ' aria-label="' + G.down + ": " + id + '">↓</button></span></li>';
    }).join("") + "</ol></div></div>";
    paintIn($("#at-main", host), h);
  }

  // ----- Track conventions -----
  function srcList(){ return C.sources.filter(function(x){ return !(x.id === "FO" && FP); }); }
  function toksOf(x){
    if (x.id === "own") return MV.eng.tokenize(S.own.map(function(o){ return o.t; }));
    return MV.eng.tokenize(x.paras && x.paras.length ? x.paras : x.lines || []);
  }
  function marksOf(id){
    var m = (S.tags[id] || []).map(function(t){ var c = conv(t.c); return { w:t.w, role:c.role, tag:c.t }; });
    if (fx.p3 === 1 && id === "C") { var tk = toksOf(src("C")), k = -1; tk.forEach(function(t, i){ if (/^freedom$/i.test(t.t)) k = i; }); if (k >= 0) m.push({ w:[k, k + 1], role:"image", tag:conv("comfort").t }); }
    return m;
  }
  function tagConvs(){ var seen = {}; Object.keys(S.tags).forEach(function(k){ (S.tags[k] || []).forEach(function(t){ seen[t.c] = 1; }); }); return C.conv.map(function(c){ return c.id; }).filter(function(id){ return seen[id]; }); }
  function chartHTML(){
    var cnt = {}, mx = 1; Object.keys(S.tags).forEach(function(k){ (S.tags[k] || []).forEach(function(t){ cnt[t.c] = (cnt[t.c] || 0) + 1; }); });
    C.conv.forEach(function(c){ mx = Math.max(mx, cnt[c.id] || 0); });
    var any = Object.keys(cnt).length, L = C.trackL;
    return '<div class="at-chart" role="img" aria-label="' + esc(L.chart + ": " + (any ? C.conv.filter(function(c){ return cnt[c.id]; }).map(function(c){ return c.t + " " + cnt[c.id]; }).join(", ") : L.none)) + '"><p class="at-lab">' + L.chart + "</p>" +
      C.conv.map(function(c){ var v = cnt[c.id] || 0; return '<div class="at-bar an-' + c.role + '"><span class="at-bl">' + c.t + '</span><span class="at-bt"><i style="width:' + (v / mx * 100).toFixed(1) + '%"></i></span><span class="at-bn">' + v + "</span></div>"; }).join("") + "</div>";
  }
  function figHTML(){
    if (fx.p1) return '<div class="at-fx' + (fx.p1 === 2 ? " on" : "") + '"><svg viewBox="0 0 300 120" role="img" aria-label="An outline of a school gymnasium, with a basketball hoop and court lines, fades in behind rows of cots."><g class="at-gym"><rect x="10" y="10" width="280" height="100" rx="4"/><path d="M150 10 V110 M10 60 H40 M260 60 H290"/><circle cx="150" cy="60" r="18"/><path d="M24 40 H34 V80 H24 M276 40 H266 V80 H276"/></g>' +
      [0, 1, 2].map(function(r){ return [0, 1, 2, 3, 4, 5].map(function(c){ return '<rect class="at-cot" x="' + (46 + c * 36) + '" y="' + (26 + r * 28) + '" width="26" height="12" rx="3"/>'; }).join(""); }).join("") + '</svg><p class="at-cap">' + C.p1.caption + "</p></div>";
    if (fx.p4) return '<div class="at-fx' + (fx.p4 === 2 ? " on" : "") + '"><svg viewBox="0 0 300 130" role="img" aria-label="A book spine labelled The Handmaid’s Tale; a frame draws itself around it, labelled ' + esc(C.p4.label) + '."><rect class="at-spine" x="120" y="22" width="60" height="96" rx="3"/><text class="at-spt" x="150" y="74" text-anchor="middle">Offred’s story</text><rect class="at-frame" x="92" y="10" width="116" height="118" rx="6" pathLength="1"/><text class="at-frl" x="150" y="8" text-anchor="middle" dy="0">' + esc(C.p4.label) + "</text></svg></div>";
    return "";
  }
  function paintTrack(){
    var L = C.trackL, x = src(S.src) || src("A"), h = '<div class="at-track"><div id="at-srcrg"></div>' + figHTML();
    if (x.id === "own") {
      var O = C.own, full = S.own.length >= O.max;
      h += '<div class="at-own"><p class="tiny">' + O.how + "</p>" + (full ? '<p class="tiny">' + O.full + "</p>" : '<div class="jq"><label for="at-ol">' + O.lineL + '</label><textarea id="at-ol" rows="2" maxlength="' + O.maxChars + '"></textarea></div><div class="at-ofr"><label for="at-op">' + O.pageL + '</label> <input type="text" class="txtin at-pg" id="at-op" inputmode="numeric" maxlength="8" autocomplete="off"> <button type="button" class="btn primary sm" data-oadd="1" data-k="oadd">' + O.add + '</button><span class="tiny" id="at-omsg" aria-live="polite"></span></div>') +
        (S.own.length ? '<ol class="at-olist">' + S.own.map(function(o, i){ return "<li>“" + esc(o.t) + "” (p. " + esc(o.pg) + ') <button type="button" class="linkbtn" data-odel="' + i + '" data-k="od' + i + '">' + O.remove + "</button></li>"; }).join("") + "</ol>" : "") + "</div>";
    } else if (x.slot) {
      h += '<div class="at-copy"><h4 class="at-h">' + L.copyTitle + ": " + x.t + "</h4><p>" + x.copy + "</p>" + (x.paras && x.paras.length ? '<div class="eng-passage eng-prose">' + x.paras.map(function(p){ return "<p>" + esc(p) + "</p>"; }).join("") + "</div>" : "") + '<p class="eng-cite">' + x.cite + "</p></div>";
    } else h += '<p class="eng-cite">' + x.cite + "</p>";
    var tk = toksOf(x);
    h += tk.length ? '<div id="at-toks"></div><div class="at-tagbar" role="group" aria-label="' + esc(L.tagWith) + '"><span class="tiny">' + L.tagWith + ":</span> " + C.conv.map(function(c){ return '<button type="button" class="an-chip an-' + c.role + '" data-tag="' + c.id + '" data-k="tg' + c.id + '"><i class="an-dot"></i>' + c.t + "</button>"; }).join("") + ' <button type="button" class="btn ghost sm" data-untag="1" data-k="untag">' + L.clear + "</button></div>" : "";
    h += chartHTML();
    var Wd = C.words, placed = Wd.items.filter(function(it){ return S.words[it.id]; }), tray = Wd.items.filter(function(it){ return !S.words[it.id]; });
    h += '<div class="at-words"><h4 class="at-h">' + Wd.title + '</h4><p class="how">' + Wd.how + '</p><div class="tray" role="group" aria-label="Items to sort">' + (tray.length ? tray.map(function(it){ var k = Wd.items.indexOf(it) + 1; return '<button type="button" class="tile txt" data-witem="' + it.id + '" data-k="wi' + it.id + '" aria-pressed="' + (selW === it.id) + '">' + k + ". " + it.t + "</button>"; }).join("") : '<p class="sort-done">All eight placed.</p>') + "</div>" +
      '<div class="bins">' + Wd.bins.map(function(b){ return '<button type="button" class="bin' + (selW ? " ready" : "") + '" data-wbin="' + b.id + '" data-k="wb' + b.id + '"><span class="bin-head"><span><strong>' + b.t + '</strong></span></span><span class="bin-items">' + placed.filter(function(it){ return S.words[it.id] === b.id; }).map(function(it){ return '<span class="chip-in txt">' + (Wd.items.indexOf(it) + 1) + "</span>"; }).join("") + "</span></button>"; }).join("") + "</div>" +
      (placed.length ? '<p class="tiny">' + placed.map(function(it){ return '<button type="button" class="linkbtn" data-wback="' + it.id + '" data-k="wk' + it.id + '">Take back ' + (Wd.items.indexOf(it) + 1) + "</button>"; }).join(" · ") + "</p>" : "") + "</div></div>";
    paintIn($("#at-main", host), h);
    radios($("#at-srcrg", host), { label:L.choose, cls:"chips", options:srcList().map(function(s){ var y = src(s.id); return { id:s.id, t:y.t }; }), value:x.id, onChange:function(v){ stopFx(); S.src = v; sel = []; api.save(); paint(); } });
    if (tk.length) { sel = []; tw = MV.eng.tokens($("#at-toks", host), tk, { label:"Words: tap to select, then tap a convention", marks:function(){ return marksOf(x.id); }, onChange:function(s){ sel = s; } }); }
    else tw = null;
  }

  // ----- Build -----
  function paintBuild(){
    var X = C, L = C.buildL, st = bst();
    var h = '<div class="at-build"><div class="at-bmap">' + worldSVG(st) + '<p class="at-prem"><span class="at-lab">' + L.premise + ":</span> " + (premiseOf(st) ? esc(premiseOf(st)) : "—") + "</p></div>";
    h += '<p class="at-lab">' + L.trends + '</p><div class="at-cards at-row">' + X.trends.map(function(t){ var on = !!st.trends[t.id];
      return '<div class="at-card' + (on ? " on" : "") + '"><button type="button" class="at-cbtn" data-trend="' + t.id + '" data-k="tr' + t.id + '" aria-pressed="' + on + '">' + t.t + "</button>" + (on ? '<div data-push="' + t.id + '"></div>' : "") + "</div>"; }).join("") + "</div>";
    h += elementsHTML(st, open, "x") + (note ? '<p class="tiny at-note" role="status">' + note + "</p>" : "") + "</div>";
    paintIn($("#at-main", host), h);
    X.trends.forEach(function(t){ var el = $('[data-push="' + t.id + '"]', host); if (el) radios(el, { label:L.push, cls:"chips", aria:L.push + ": " + t.t, options:X.push, value:st.trends[t.id], onChange:function(v){ stopFx(); BST().trends[t.id] = v; api.save(); paint(); MV.changed(); var nb = $('[data-push="' + t.id + '"] [data-rg="' + v + '"]', host); if (nb) nb.focus(); } }); });
  }

  function paint(){
    $("#at-how", host).textContent = MV.plain(C.how[S.mode]);
    if (S.mode === "roots") paintRoots(); else if (S.mode === "track") paintTrack(); else paintBuild();
    paintRead();
  }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || !host.contains(b) || b.closest("#at-mode") || b.closest("[data-rg]") || b.id === "at-more" || b.closest(".eng-toks")) return;
    var d = b.dataset; note = "";
    if (d.feat || d.prec || d.unlink || d.sup != null || d.sdn != null || d.witem || d.wbin || d.wback || d.trend || d.el || d.link || d.bp || d.bclose || d.oadd || d.odel != null) stopFx();
    if (d.feat) { selF = selF === d.feat ? "" : d.feat; paint(); return; }
    if (d.prec) {
      if (!selF) { note = C.map.pick; paint(); return; }
      C.features.forEach(function(f){ if (S.links[f.id] === d.prec) delete S.links[f.id]; });
      S.links[selF] = d.prec; selF = ""; api.save(); paint(); MV.changed(); return;
    }
    if (d.unlink) { delete S.links[d.unlink]; api.save(); paint(); MV.changed(); return; }
    if (d.sup != null || d.sdn != null) {
      var i = +(d.sup != null ? d.sup : d.sdn), j = i + (d.sup != null ? -1 : 1), id = S.order[i]; S.order[i] = S.order[j]; S.order[j] = id; api.save(); paint(); MV.changed();
      var nb = $('[data-k="' + (d.sup != null ? "su" : "sd") + id + '"]', host); if (nb && nb.disabled) nb = $('[data-k="' + (d.sup != null ? "sd" : "su") + id + '"]', host); if (nb) nb.focus(); return;
    }
    if (d.witem) { selW = selW === d.witem ? "" : d.witem; paint(); return; }
    if (d.wbin) { if (!selW) return; S.words[selW] = d.wbin; selW = ""; api.save(); paint(); MV.changed(); return; }
    if (d.wback) { delete S.words[d.wback]; api.save(); paint(); MV.changed(); return; }
    if (d.tag || d.untag) {
      var x = src(S.src); if (!x || !tw) return; var w = tw.get(); if (!w.length) return;
      var A = (S.tags[x.id] || []).filter(function(t){ return !t.w.some(function(k){ return w.indexOf(k) >= 0; }) || (d.tag && t.c !== d.tag); });
      if (d.tag) A.push({ w:w, c:d.tag });
      S.tags[x.id] = A; api.save(); tw.clear(); $(".at-chart", host).outerHTML = chartHTML(); paintRead(); MV.changed(); return;
    }
    if (d.oadd) {
      var t = clean($("#at-ol", host).value).slice(0, C.own.maxChars), pg = clean($("#at-op", host).value);
      if (!t || !pg) { $("#at-omsg", host).textContent = C.own.need; return; }
      if (S.own.length < C.own.max) S.own.push({ t:t, pg:pg }); api.save(); paint(); return;
    }
    if (d.odel != null) { S.own.splice(+d.odel, 1); S.tags.own = []; api.save(); paint(); MV.changed(); return; }
    if (d.trend) {
      var st = BST();
      if (st.trends[d.trend]) delete st.trends[d.trend]; else if (Object.keys(st.trends).length >= 3) note = C.buildL.maxT; else st.trends[d.trend] = "1";
      api.save(); paint(); MV.changed(); return;
    }
    var r = elementsClick(b, BST(), open);
    if (r) { open = r.open; note = r.msg || ""; api.save(); paint(); MV.changed(); }
  });
  // "Set it up" buttons in the challenge prompts
  document.addEventListener("click", function(e){
    var b = e.target.closest(".at-setup"); if (!b) return;
    e.stopPropagation();
    if (S.mode !== b.dataset.setup) setMode(b.dataset.setup);
    var g = $("#at-main", host); if (g) g.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
  }, true);

  function stopFx(){ run.n++; if (Object.keys(fx).length) { fx = {}; if (S.mode) paint(); } }
  paint();

  EX = {
    shown:function(){ paint(); },
    stop:function(){ if (Object.keys(fx).length) { run.n++; fx = {}; paint(); } },
    predict:{
      start:function(p){
        run.n++; fx = {}; selF = ""; open = "";
        var mode = { p1:"track", p2:"build", p3:"track", p4:"track" }[p.id];
        if (p.id === "p1") { S.src = "A"; fx.p1 = 1; } else if (p.id === "p3") { S.src = "C"; fx.p3 = 0; } else if (p.id === "p4") { S.src = "F"; fx.p4 = 1; }
        else fx.build = { trends:{ T2:"2" }, els:{ Ed:"B4" } };
        S.mode = mode; modeRG.set(mode); api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        var me = ++run.n, finished = false;
        function end(){ if (finished) return; finished = true; done(); }
        function at(ms, fn){ MV.wait(ms, function(){ if (me === run.n) fn(); else end(); }); }
        if (p.id === "p1") at(200, function(){ fx.p1 = 2; paint(); at(1400, end); });
        else if (p.id === "p2") at(300, function(){ fx.build = { trends:{ T2:"2" }, els:{ Ed:"B4", Ex:"" } }; paint(); at(1400, end); });
        else if (p.id === "p3") at(300, function(){ fx.p3 = 1; paint(); at(1400, end); });
        else if (p.id === "p4") at(200, function(){ fx.p4 = 2; paint(); at(1600, end); });
        else end();
      }
    },
    challenge:function(id){ return id === "tc1" ? tc1() : id === "tc2" ? tc2() : id === "tc3" ? tc3() : { ok:false }; }
  };
  function msg(id, k){ return byId(C.challenges, id).msgs[k]; }
  function tc1(){
    var L = S.links;
    if (L.F2 === "Pc") return { ok:false, msg:msg("tc1", "F2Pc") };
    if (L.F6 === "Pa") return { ok:false, msg:msg("tc1", "F6Pa") };
    if (L.F5 === "Pd") return { ok:false, msg:msg("tc1", "F5Pd") };
    if (Object.keys(L).length < 6) return { ok:false, msg:msg("tc1", "unlinked").replace("{n}", correct()) };
    return { ok:correct() === 6 };
  }
  function tc2(){
    var W = S.words, I = C.words.items;
    if (W.g6 === "rename") return { ok:false, msg:msg("tc2", "g6rename") };
    if (W.g3 === "euph") return { ok:false, msg:msg("tc2", "g3euph") };
    if (W.g8 === "read") return { ok:false, msg:msg("tc2", "g8read") };
    if (I.some(function(it){ return !W[it.id]; })) return { ok:false, msg:msg("tc2", "unplaced") };
    return { ok:I.every(function(it){ return W[it.id] === MV.ans(it); }) };
  }
  function tc3(){
    var o = S.order, p = function(x){ return o.indexOf(x); };
    if (o.join("") === "ABCDE") return { ok:true };
    if (p("C") < p("A")) return { ok:false, msg:msg("tc3", "CA") };
    if (p("B") < p("A")) return { ok:false, msg:msg("tc3", "BA") };
    if (p("D") === 4) return { ok:false, msg:msg("tc3", "Dlast") };
    return { ok:false };
  }
  return EX;
}

// ---------- Part 3: Language as control — @component E6 ladderBuilder (station 1), @component E6 paragraphBuilder (sentence form,
// station 2: claim + quotation + analysis with an analysis-verb bank and "Check it with craft"), a three-region Venn sort (station 3) ----------
function part3(host, api){
  var P = api.content, S = api.S, A = P.s1, B = P.s2, V = P.s3;
  S.rung = S.rung || {}; S.s2 = S.s2 || { claim:"", q:"", an:"", checked:false }; S.venn = S.venn || {};
  var pickV = "", vmsg = null, ORD = {};
  A.rungs.forEach(function(r){ ORD[r.id] = MV.shuffle(r.opts.map(function(o, i){ return i; }), "at-" + r.id); });
  host.innerHTML = '<div class="at-p3"><section class="at-st"><h4 class="at-h">' + A.title + '</h4><blockquote class="at-q"><p>“' + A.quote + '”</p><p class="eng-cite">' + A.cite + '</p></blockquote><p class="how">' + A.how + '</p><div id="at-ladder"></div></section>' +
    '<section class="at-st"><h4 class="at-h">' + B.title + '</h4><ul class="at-qs">' + B.quotes.map(function(q){ return "<li>“" + q.t + "” " + q.cite + (q.note ? ' <span class="tiny muted">(' + q.note + ")</span>" : "") + "</li>"; }).join("") + '</ul><p class="tiny">' + B.scrabble + '</p><p class="how">' + B.how + '</p><div id="at-s2"></div></section>' +
    '<section class="at-st"><h4 class="at-h">' + V.title + '</h4><div class="at-two"><blockquote class="at-q"><p>“' + V.forster.t + '”</p><p class="eng-cite">' + V.forster.who + " " + V.forster.cite + '</p></blockquote><blockquote class="at-q"><p>“' + V.atwood.t + '”</p><p class="eng-cite">' + V.atwood.who + " " + V.atwood.cite + '</p></blockquote></div><p class="how">' + V.how + '</p><div id="at-venn"></div></section></div>';
  function paintLadder(){
    var h = '<ol class="at-lad">', open = true;
    A.rungs.forEach(function(r, ri){
      var st = S.rung[r.id] || {}, locked = !open;
      h += '<li class="at-rung' + (st.solved ? " done" : "") + (locked ? " locked" : "") + '"><p class="at-rn"><span class="at-rnum">' + (ri + 1) + "</span> " + r.name + (locked ? ' <span class="tiny muted">(climb the rung below first)</span>' : "") + "</p>";
      if (!locked) {
        h += '<div class="opts">' + ORD[r.id].map(function(i){ var o = r.opts[i], c = "opt"; if (st.solved && MV.ok(o)) c += " right"; else if (st.last === i && !MV.ok(o)) c += " wrong";
          return '<button type="button" class="' + c + '" data-rung="' + r.id + '" data-o="' + i + '" data-k="rg' + r.id + i + '"' + (st.solved ? " disabled" : "") + "><span>" + o.t + "</span></button>"; }).join("") + "</div>";
        if (st.last != null) { var o = r.opts[st.last]; h += MV.fbHTML(MV.ok(o) ? "good" : "bad", o.fb); }
      }
      h += "</li>"; if (!st.solved) open = false;
    });
    h += "</ol>" + (A.rungs.every(function(r){ return (S.rung[r.id] || {}).solved; }) ? '<p class="an-note an-theme">' + A.done + "</p>" : "");
    paintIn($("#at-ladder", host), h);
  }
  function verbsIn(t){ return B.verbs.filter(function(v){ return new RegExp("(^|[^A-Za-z])" + v + "(?![A-Za-z])", "i").test(t || ""); }); }
  function paintS2(){
    var s = S.s2, q = byId(B.quotes, s.q), h = "";
    if (s.checked) {
      if (!clean(s.claim) || !q || !clean(s.an)) h = MV.fbHTML("bad", B.need);
      else {
        var vs = verbsIn(s.an), an = esc(clean(s.an));
        vs.forEach(function(v){ an = an.replace(new RegExp("(^|[^A-Za-z])(" + v + ")(?![A-Za-z])", "i"), '$1<mark class="an an-figure">$2</mark>'); });
        h = '<div class="at-pv"><p class="at-lab">' + B.pv + "</p><p>" + esc(clean(s.claim)) + " “" + q.t + "” " + q.cite + " " + an + "</p>" +
          (vs.length ? vs.map(function(v){ return '<p class="an-note an-figure"><strong>' + v + ":</strong> " + B.ask + "</p>"; }).join("") : '<p class="an-note an-figure">' + B.noVerb + "</p>") + "</div>";
      }
    }
    $("#at-s2out", host).innerHTML = h;
  }
  $("#at-s2", host).innerHTML = '<div class="jq"><label for="at-s2c">' + B.claimL + '</label><textarea id="at-s2c" rows="2" data-s2="claim" placeholder="' + esc(B.claimPh) + '"></textarea></div><div id="at-s2q"></div>' +
    '<div class="jq"><label for="at-s2a">' + B.anL + '</label><textarea id="at-s2a" rows="3" data-s2="an" placeholder="' + esc(B.anPh) + '"></textarea></div><div class="chips" role="group" aria-label="Analysis verbs">' + B.verbs.map(function(v){ return '<button type="button" class="chip" data-verb="' + v + '">' + v + "</button>"; }).join("") + '</div><div class="q-actions"><button type="button" class="btn primary sm" id="at-s2chk">' + B.check + '</button></div><div id="at-s2out" aria-live="polite"></div>';
  $("#at-s2c", host).value = S.s2.claim; $("#at-s2a", host).value = S.s2.an;
  radios($("#at-s2q", host), { label:B.quoteL, cls:"chips", options:B.quotes.map(function(q){ return { id:q.id, t:"“" + q.t + "”" }; }), value:S.s2.q, onChange:function(v){ S.s2.q = v; api.save(); if (S.s2.checked) paintS2(); } });
  function paintVenn(){
    var tray = V.chips.filter(function(c){ return !S.venn[c.id]; }), h = '<div class="tray" role="group" aria-label="Statements to place">' + (tray.length ? tray.map(function(c){ return '<button type="button" class="tile txt" data-vc="' + c.id + '" data-k="vc' + c.id + '" aria-pressed="' + (pickV === c.id) + '">' + c.t + "</button>"; }).join("") : '<p class="sort-done">' + V.done + "</p>") + "</div>";
    h += '<div class="at-venn">' + V.regions.map(function(r){ return '<button type="button" class="bin at-vr at-vr-' + r.id + (pickV ? " ready" : "") + '" data-vr="' + r.id + '" data-k="vr' + r.id + '"><span class="bin-head"><span><strong>' + r.t + '</strong></span></span><span class="bin-items">' + V.chips.filter(function(c){ return S.venn[c.id] === r.id; }).map(function(c){ return '<span class="chip-in txt">' + c.t + "</span>"; }).join("") + "</span></button>"; }).join("") + "</div>";
    if (vmsg) h += MV.fbHTML(vmsg.k, vmsg.t);
    paintIn($("#at-venn", host), h);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || !host.contains(b) || b.disabled || b.closest("[data-rg]")) return;
    var d = b.dataset;
    if (d.rung) { var st = S.rung[d.rung] || (S.rung[d.rung] = {}); st.last = +d.o; var r = byId(A.rungs, d.rung); if (MV.ok(r.opts[st.last])) st.solved = true; else st.tries = (st.tries || 0) + 1; api.save(); paintLadder(); MV.focusFb($("#at-ladder", host)); return; }
    if (d.verb) { var ta = $("#at-s2a", host); ta.value = (ta.value.replace(/\s+$/, "") + " " + d.verb + " ").replace(/^\s+/, ""); S.s2.an = ta.value; api.save(); ta.focus(); return; }
    if (b.id === "at-s2chk") { S.s2.checked = true; api.save(); paintS2(); return; }
    if (d.vc) { pickV = pickV === d.vc ? "" : d.vc; vmsg = null; paintVenn(); return; }
    if (d.vr) {
      if (!pickV) return; var c = byId(V.chips, pickV);
      if (d.vr === MV.ans(c)) { S.venn[c.id] = d.vr; vmsg = { k:"good", t:"<strong>✓</strong> " + c.fb }; pickV = ""; api.save(); }
      else vmsg = { k:"bad", t:"<strong>✗</strong> " + V.wrong };
      paintVenn(); MV.focusFb($("#at-venn", host));
    }
  });
  host.addEventListener("input", function(e){ var k = e.target.dataset.s2; if (!k) return; S.s2[k] = e.target.value; api.save(); });
  paintLadder(); paintS2(); paintVenn();

  // Sentence to steal: the Forster path swaps the master line; save the imitation to the notebook
  var steal = $('.mv-block[data-block="steal"]'), ST = MV.C.part3.steal;
  if (steal) { $$(".at-steal", steal).forEach(function(el){ el.hidden = el.dataset.path !== (FP ? "forster" : "atwood"); }); }
  if (steal && !$("#at-steal-save")) {
    var row = document.createElement("div");
    row.innerHTML = '<div class="q-actions"><button type="button" class="btn ghost sm" id="at-steal-save">' + ST.save + '</button><span class="tiny muted" id="at-steal-st" aria-live="polite"></span></div>';
    steal.appendChild(row);
    row.addEventListener("click", function(e){
      if (e.target.id !== "at-steal-save") return;
      var ta = $('textarea[data-w="steal"]', steal), t = ((ta && ta.value) || MV.S.writes.steal || "").trim();
      if (!t) { $("#at-steal-st").textContent = "Write your imitation first."; return; }
      MV.eng.saveLine(t, "My imitation of " + MV.plain(FP ? ST.sourceF : ST.source) + ": “" + (FP ? ST.masterF : ST.master) + "”");
      $("#at-steal-st").textContent = "Saved your imitation to My Art of Language.";
    });
  }
  return {};
}

// ---------- Practice 1: @component K12 sorterAlso — the toolkit sorter's tap-to-sort, plus "also" boxes that accept an item with a
// note (plan: item 6 accepts Surveillance or Control of information) ----------
function sortAlso(host, api, a){
  var st = api.S; st.placed = st.placed || {}; st.tries = st.tries || {}; st.hints = st.hints || {};
  var sel = null, msg = null;
  function stats(){ var p = 0, f = 0, miss = []; a.items.forEach(function(it){ var bad = (st.tries[it.id] || 0) > 0 || (st.hints[it.id] || 0) >= 3; if (st.placed[it.id]) { p++; if (!bad) f++; } if (bad) miss.push(it); }); return { placed:p, first:f, missed:miss }; }
  function paint(){
    var s = stats(), un = a.items.filter(function(it){ return !st.placed[it.id]; });
    var h = '<p class="how">' + a.how + '</p><div class="tray" role="group" aria-label="Items to sort">' + (un.length ? un.map(function(it){ return '<button type="button" class="tile txt" aria-pressed="' + (sel === it.id) + '" data-k="t' + it.id + '" data-item="' + it.id + '">' + it.t + "</button>"; }).join("") : '<p class="sort-done">All sorted! You got ' + s.first + " of " + a.items.length + " right on the first try, without the worked solution.</p>") + "</div>";
    if (sel) { var it = byId(a.items, sel), lv = st.hints[sel] || 0; h += '<div class="sel-bar"><span>Selected: ' + it.t + "</span>" + MV.hintBtn("h" + a.id, lv) + "</div>" + MV.hintsHTML(it.hints, lv); }
    if (msg) h += '<div class="fb ' + msg.type + '" role="status"><p>' + msg.html + "</p></div>";
    h += '<div class="bins">' + a.boxes.map(function(b){ return '<button type="button" class="bin' + (sel ? " ready" : "") + '" data-k="b' + b.id + '" data-bin="' + b.id + '"><span class="bin-head"><span><strong>' + b.label + '</strong></span></span><span class="bin-items">' + a.items.filter(function(it){ return st.placed[it.id] === b.id; }).map(function(it){ return '<span class="chip-in txt">' + it.t + "</span>"; }).join("") + "</span></button>"; }).join("") + "</div>";
    MV.keepFocus(host, function(){ host.innerHTML = h; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.item) { sel = sel === b.dataset.item ? null : b.dataset.item; msg = null; paint(); return; }
    if (b.dataset.act === "hint" && sel) { st.hints[sel] = Math.min(3, (st.hints[sel] || 0) + 1); MV.save(); paint(); return; }
    if (b.dataset.bin) {
      if (!sel) { msg = { type:"", html:"Tap an item first, then tap the bin it belongs in." }; paint(); return; }
      var it = byId(a.items, sel), bin = b.dataset.bin;
      if (bin === MV.ans(it)) { st.placed[it.id] = bin; msg = { type:"good", html:"<strong>✓ " + it.t + "</strong>: " + it.why }; sel = null; MV.save(); paint(); MV.focusFb(host); }
      else if (it.also && it.also[bin]) { st.placed[it.id] = bin; msg = { type:"good", html:"<strong>✓ " + it.t + "</strong>: " + it.also[bin] }; sel = null; MV.save(); paint(); MV.focusFb(host); }
      else { st.tries[it.id] = (st.tries[it.id] || 0) + 1; msg = { type:"bad", html:"<strong>✗ Not that bin.</strong> " + ((it.wrong && it.wrong[bin]) || a.wrongDefault) + " Try another bin." }; MV.save(); paint(); }
    }
  });
  paint();
  return { stats:function(){ var s = stats(); return { first:s.first, total:a.items.length, done:s.placed, line:a.summary + " (first try): " + s.first + "/" + a.items.length + (s.placed < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; stats().missed.forEach(function(it){ g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; } };
}

// ---------- Practice 2: "The Archivist" (the passage + toolkit MC) ----------
function archivist(host, api, a){
  host.innerHTML = '<p class="tiny">' + a.why + '</p><p class="at-lab">' + a.passageTitle + '</p><div class="eng-passage eng-prose at-arch"><p>' + esc(a.passage) + '</p></div><div id="at-amc"></div>';
  return MV.activityTypes.mc($("#at-amc", host), { id:a.id + "-mc", items:a.items, summary:a.summary, goal:a.goal });
}

// ---------- Practice 3: @component K13 spotProse — Spot the Error for a paragraph (copied from ENG4U 14; numbered sentences) ----------
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
      var cl = a.problems.filter(function(p){ var s = sst(p.id); return s.found && s.fixed && s.stepTries === 0 && s.fixTries === 1 && s.hint < 3; }).length;
      return { first:cl, total:a.problems.length, done:solved, line:(a.summary || "Spot the error") + ": " + solved + "/" + a.problems.length + " solved, " + cl + " without help or retries" };
    },
    missed:function(){ var g = []; a.problems.forEach(function(p){ var s = sst(p.id); if (s.stepTries > 0 || s.fixTries > 1 || s.hint >= 3) g = g.concat(MV.goalIdx(p.goal != null ? p.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Pitch a speculative world — premise, the element picker, @component E17 draftWorkspace (live word count,
// up to 3 saved drafts) and convention tags on the opening (word chips); the plan's seven structure tests ----------
var task = (function(){
  var api = null, T = null, open = "", tw = null, sel = [];
  function toks(t){ return MV.eng.tokenize(clean(t)); }
  function validTags(S){ var tk = toks(S.opening); return (S.otags || []).filter(function(g){ return g.w.every(function(i){ return tk[i]; }) && g.w.map(function(i){ return tk[i].t; }).join(" ") === g.s; }); }
  function data(S){
    S = S || {}; if (!T) T = MV.C.task;
    var st = BST(), F = buildFacts(st), ex = $("#task-explain");
    return { premise:clean(S.premise), opening:clean(S.opening), n:wc(S.opening), tags:validTags(S), st:st, F:F, explain:ex ? ex.value : (MV.taskState().explain || "") };
  }
  function firstSentence(t){ var m = clean(t).match(/^[\s\S]*?[.!?](?=["”’)]*\s|["”’)]*$)/); return m ? m[0] : clean(t); }
  function checks(d){
    if (!T) T = MV.C.task;
    var pw = wc(d.premise), first12 = MV.eng.words(d.opening).slice(0, 12).map(function(w){ return MV.eng.norm(w); }), fs = firstSentence(d.opening).toLowerCase();
    return [
      /^what\s+if\b/i.test(d.premise) && /\?["”’)]*$/.test(d.premise) && pw >= T.pmin && pw <= T.pmax,
      d.F.n >= 2 && d.F.E.every(function(e){ return e.deck === "P" && !!d.st.els[e.id]; }),
      d.F.n > 0 && d.F.imp === 0,
      first12.some(function(w){ return T.invite.indexOf(w) >= 0; }) || T.repurpose.some(function(p){ return fs.replace(/\s+/g, " ").indexOf(p) >= 0; }),
      d.tags.length >= 2,
      d.n >= T.min && d.n <= T.max,
      wc(d.explain) >= T.craftMin
    ];
  }
  function all(){ api.save(); counts(); preview(); api.update(); models(); }
  function counts(){ var d = data(api.S), el = $("#at-tcount"); if (el) el.textContent = d.n + " " + T.labels.words + " (" + T.min + "–" + T.max + ")"; var pc = $("#at-tpcount"); if (pc) pc.textContent = wc(d.premise) + " " + T.labels.words + " (" + T.pmin + "–" + T.pmax + ")"; }
  function tagsHTML(d){ return d.tags.map(function(g){ var c = conv(g.c); return "“" + esc(g.s) + "” (" + c.t.toLowerCase() + ")"; }).join("; "); }
  function preview(){
    var d = data(api.S), el = $("#at-tpv"); if (!el) return;
    el.innerHTML = '<p><strong>' + T.labels.premise.replace(/^\d\.\s*/, "") + ":</strong> " + (d.premise ? esc(d.premise) : "—") + "</p><p><strong>World:</strong> " + (d.F.n ? d.F.E.map(function(e){ var p = d.st.els[e.id] ? byId(EXC().bprec, d.st.els[e.id]) : null; return esc(e.t) + (p ? " ↔ " + esc(p.t) : e.deck === "X" ? " (impossible)" : " (not linked)"); }).join("; ") : "—") + "</p>" +
      (d.opening ? "<p>" + esc(d.opening) + "</p>" : '<p class="tiny muted">Your opening appears here.</p>') + (d.tags.length ? '<p class="tiny"><strong>' + T.labels.tags + ":</strong> " + tagsHTML(d) + "</p>" : "");
  }
  function models(){
    var el = $("#at-tmodels"); if (!el) return;
    if (checks(data(api.S)).every(Boolean)) api.S.unlocked = true;
    el.innerHTML = api.S.unlocked ? '<h4 class="at-h">' + T.modelsLabel + "</h4>" + T.models.map(function(m){ return '<details class="alg at-model"><summary>' + m.title + "</summary><p><strong>Premise:</strong> " + m.premise + "</p><p><strong>Elements:</strong> " + m.elements + "</p><p>" + m.text + '</p><p class="tiny"><strong>Tags:</strong> ' + m.tags + "</p></details>"; }).join("") : "";
  }
  function paintPick(){ paintIn($("#at-tpick"), elementsHTML(BST(), open, "t")); }
  function paintTags(){
    var S = api.S, tk = toks(S.opening), host = $("#at-ttoks");
    S.otags = validTags(S);
    if (!tk.length) { host.innerHTML = '<p class="tiny muted">' + T.labels.noText + "</p>"; tw = null; return; }
    tw = MV.eng.tokens(host, tk, { label:"Your opening: tap words to select, then tap a convention", marks:function(){ return (api.S.otags || []).map(function(g){ var c = conv(g.c); return { w:g.w, role:c.role, tag:c.t }; }); }, onChange:function(s){ sel = s; } });
  }
  function paintDrafts(){
    var D = api.S.drafts || [], el = $("#at-tdr");
    el.innerHTML = D.length ? '<p class="tiny muted">' + T.labels.drafts + ":</p>" + D.map(function(x, i){ return '<p class="tiny">' + (i + 1) + ". " + esc(x.t.slice(0, 60)) + (x.t.length > 60 ? "…" : "") + " (" + wc(x.t) + " " + T.labels.words + ') <button type="button" class="linkbtn" data-tres="' + i + '">' + T.labels.restore + "</button></p>"; }).join("") : "";
  }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; var S = a.S, L = T.labels; S.otags = S.otags || []; S.drafts = S.drafts || [];
      inp.innerHTML = '<div class="at-task"><div class="jq"><label for="at-tprem">' + L.premise + ' <span class="tiny muted">' + L.premiseHow + '</span></label><textarea id="at-tprem" rows="2" data-tf="premise"></textarea><p class="tiny" id="at-tpcount" aria-live="polite"></p><button type="button" class="btn ghost sm" id="at-tdraft">' + L.draft + "</button></div>" +
        '<details class="alg at-tworld" open><summary>' + L.world + '</summary><div id="at-tpick"></div><p class="tiny" id="at-tpmsg" aria-live="polite"></p></details>' +
        '<div class="jq"><label for="at-topen">' + L.opening + ' <span class="tiny muted">' + L.openingHow + '</span></label><textarea id="at-topen" class="at-big" rows="10" data-tf="opening"></textarea><p class="tiny" id="at-tcount" aria-live="polite"></p>' +
        '<div class="q-actions"><button type="button" class="btn ghost sm" id="at-tsave">' + L.saveDraft + '</button><span class="tiny muted">' + L.maxDrafts + '</span></div><div id="at-tdr"></div></div>' +
        '<div class="at-ttag"><p class="at-lab">' + L.tag + '</p><p class="tiny muted">' + L.tagHow + '</p><div id="at-ttoks"></div><div class="at-tagbar" role="group" aria-label="Tag the selected words with">' + EXC().conv.map(function(c){ return '<button type="button" class="an-chip an-' + c.role + '" data-ttag="' + c.id + '" data-k="tt' + c.id + '"><i class="an-dot"></i>' + c.t + "</button>"; }).join("") + ' <button type="button" class="btn ghost sm" data-tuntag="1">' + EXC().trackL.clear + "</button></div></div></div>";
      pv.innerHTML = '<h4 class="at-h" style="margin-top:0">' + L.pv + '</h4><div id="at-tpv" class="at-pv"></div><div id="at-tmodels"></div>';
      $("#at-tprem").value = S.premise || ""; $("#at-topen").value = S.opening || "";
      paintPick(); paintTags(); paintDrafts();
      var tt = null;
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tf; if (!k) return; S[k] = e.target.value; if (k === "opening") { clearTimeout(tt); tt = setTimeout(function(){ paintTags(); all(); }, 350); } all(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || b.closest(".eng-toks")) return;
        if (b.id === "at-tdraft") { var p = premiseOf(BST()); if (p) { S.premise = p; $("#at-tprem").value = p; all(); } else $("#at-tpmsg").textContent = "Choose a trend and an element in the lab’s Build mode (or below) first."; return; }
        if (b.id === "at-tsave") { var t = clean(S.opening); if (!t) return; S.drafts.push({ t:t }); if (S.drafts.length > 3) S.drafts.shift(); api.save(); paintDrafts(); return; }
        if (b.dataset.tres != null) { var dr = S.drafts[+b.dataset.tres]; if (dr) { S.opening = dr.t; $("#at-topen").value = dr.t; paintTags(); all(); } return; }
        if (b.dataset.ttag || b.dataset.tuntag) {
          if (!tw) return; var w = tw.get(); if (!w.length) return; var tk = toks(S.opening);
          S.otags = validTags(S).filter(function(g){ return !g.w.some(function(k){ return w.indexOf(k) >= 0; }); });
          if (b.dataset.ttag) S.otags.push({ w:w, s:w.map(function(i){ return tk[i].t; }).join(" "), c:b.dataset.ttag });
          tw.clear(); all(); return;
        }
        var r = elementsClick(b, BST(), open);
        if (r) { open = r.open; $("#at-tpmsg").textContent = r.msg || ""; MV.save(); paintPick(); all(); }
      });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ a.update(); models(); });
      counts(); preview(); models();
    },
    refresh:function(){ if (api) { paintPick(); all(); } },
    read:function(){ return data(api ? api.S : MV.taskState().app); },
    valid:function(d){ return d.premise || d.opening ? true : "Write your premise and opening first."; },
    checks:checks,
    key:function(d){ return "pitch:" + MV.eng.norm(d.premise).slice(0, 40); },
    label:function(k){ return "a world (“" + esc(k.slice(6)) + "…”)"; },
    text:function(k){ return "a world: " + k.slice(6); },
    summary:function(ts){
      if (!T) T = MV.C.task;
      var S = ts.app || {}, d = data(S), r = checks(d), met = r.filter(Boolean).length, L = [];
      L.push(T.summary + ": " + (met === r.length ? "submitted (premise + opening + craft statement included below)" : "not submitted yet (checklist " + met + "/" + r.length + ")"));
      L.push("  Premise: " + (d.premise || "(not written yet)"));
      L.push("  World: " + (d.F.n ? d.F.E.map(function(e){ var p = d.st.els[e.id] ? byId(EXC().bprec, d.st.els[e.id]) : null; return e.t + (p ? " (linked to: " + p.t + ")" : e.deck === "X" ? " (impossible deck)" : " (not linked)"); }).join("; ") : "(no elements chosen)"));
      L.push("  Opening paragraph (" + d.n + " words):");
      L.push("    " + (d.opening || "(not written yet)"));
      L.push("  Convention tags: " + (d.tags.length ? d.tags.map(function(g){ return "“" + g.s + "” (" + conv(g.c).t.toLowerCase() + ")"; }).join("; ") : "(none)"));
      L.push("  Teacher rubric (levels 1–4):");
      T.rubric.forEach(function(row){ L.push("    " + row[0] + ": 1 " + row[1] + " | 2 " + row[2] + " | 3 " + row[3] + " | 4 " + row[4]); });
      return L;
    }
  };
})();

// ---------- Reflect extras (sample principles, trivium tag, commonplace book) ----------
function extras(){
  var R = MV.C.reflect, sheet = $("#art-sheet"), art = $("#art");
  if (sheet && art && R.artSamples && !$("#art-samples")) {
    var d = document.createElement("details"); d.id = "art-samples"; d.className = "alg art-samples";
    d.innerHTML = "<summary>See two sample principles</summary><p class=\"tiny muted\">Models only. Always write your own.</p>" + R.artSamples.map(function(s){ return '<p class="an-note an-theme"><strong>Principle:</strong> “' + s.p + "”<br><strong>Master:</strong> " + s.master + "<br><strong>Imitation:</strong> " + s.imit + "</p>"; }).join("");
    sheet.insertBefore(d, art);
  }
  MV.eng.triviumPicker();
  var cp = $("#cp-app"); if (cp && !cp.childNodes.length) MV.eng.commonplace(cp, { lines:R.art.examples.map(function(x){ return MV.plain(x).replace(/\s*\([^()]*\)\s*$/, "").replace(/^“|”$/g, ""); }) });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ sort:sortAlso, archivist:archivist, spot:spotProse },
  task:task,
  summaryLines:function(){
    var O = EXS().own || [], T = EXS().tags || {}, L = [];
    if (O.length) {
      L.push("Lines from my copy (World-building lab):");
      O.forEach(function(o){ L.push("  “" + o.t + "” (p. " + o.pg + ")"); });
      if ((T.own || []).length) L.push("  Tags: " + T.own.map(function(t){ return conv(t.c).t; }).join(", "));
    }
    return L;
  },
  onShow:function(v){
    MV.eng.stop();
    if (v !== "start" && HR.stop) HR.stop();
    if (EX) { if (v === "explore") EX.shown(); else EX.stop(); }
    if (v === "final-check" && task.refresh) task.refresh();
    if (v === "reflect") extras();
  }
});
})();
