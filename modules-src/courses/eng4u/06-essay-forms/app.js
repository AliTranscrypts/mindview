// ENG4U 06 Essay Forms: hero (Bacon's tricolon becomes five doorways), Form blueprints (Explore: sort, x-ray, shape-shifter,
// build), Same topic, four forms (Part 3: comparison grid + choose a form + sentence to steal), Spot the Error (K13), and the
// "Choose your form" task (E7 thesis forge, E17 draft workspace). Texts: content.mjs (Bacon 1625 via the 1884 Works, Leacock 1910, originals).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function wc(s){ return MV.eng.wordCount(s || ""); }
function sentObj(a){ return Array.isArray(a) ? { t:a[0], r:a[1], tag:a[2], p:a[3], v:a[4] } : a; }
function bare(tok){ return String(tok).replace(/^[^A-Za-z0-9À-ÿ]+|[^A-Za-z0-9À-ÿ]+$/g, ""); }

// ---------- @component radioGroup (copied from ENG4U 03; no option needs to be checked) ----------
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
function voiceReady(fn){ MV.eng.voice(function(v){ VOICE = v; document.documentElement.classList.toggle("ef-novoice", !v); if (fn) fn(v); }); }

// ---------- hero: Bacon's tricolon lights up, the brackets slide down into doorways ----------
var HR = { run:0 };
function hero(){
  var H = MV.C.hero, host = $("#ef-hero"); if (!host) return;
  var k = 0, sh = H.sentence.map(function(p, i){ return i % 2 ? '<span class="ef-ph" data-ph="' + (k++) + '">' + esc(p) + "</span>" : esc(p); }).join("");
  host.innerHTML = '<p class="ef-hs">' + sh + '</p><p class="ef-tri"><span class="an-tag an-syntax">Syntax · ' + H.tri + "</span></p>" +
    '<div class="ef-doors">' + H.doors.map(function(d, i){ return '<div class="ef-door' + (i < 3 ? " ef-d3" : "") + '" data-d="' + i + '"><span class="ef-arch" aria-hidden="true"></span><span class="ef-dl">' + esc(d) + "</span></div>"; }).join("") + "</div>" +
    '<p class="ef-hcap">' + H.caption + '</p><p class="eng-cite">' + H.cite + '</p><div class="ef-hctl"><button type="button" class="btn ghost sm" id="ef-hlisten" hidden>' + H.listen + '</button><button type="button" class="btn ghost sm" id="ef-hagain" hidden>' + H.watch + '</button><span class="tiny muted" id="ef-hnote" hidden>' + H.noVoice + "</span></div>";
  function ph(i, on){ var e = host.querySelector('[data-ph="' + i + '"]'); if (e) e.classList.toggle("lit", on); }
  function door(i, on){ var e = host.querySelector('[data-d="' + i + '"]'); if (e) e.classList.toggle("on", on); }
  function reset(){ host.classList.remove("ef-done"); host.classList.add("ef-anim"); [0, 1, 2].forEach(function(i){ ph(i, false); }); [0, 1, 2, 3, 4].forEach(function(i){ door(i, false); }); host.classList.remove("tri-on", "cap-on"); }
  function finish(){ host.classList.remove("ef-anim"); host.classList.add("ef-done", "tri-on", "cap-on"); [0, 1, 2].forEach(function(i){ ph(i, true); }); [0, 1, 2, 3, 4].forEach(function(i){ door(i, true); }); btns(); }
  function at(me, ms, fn){ setTimeout(function(){ if (me === HR.run) fn(); }, ms); }
  function doorsSeq(me, t){
    at(me, t, function(){ host.classList.add("slide"); [0, 1, 2].forEach(function(i){ door(i, true); }); });
    at(me, t + 1000, function(){ door(3, true); door(4, true); });
    at(me, t + 1700, function(){ host.classList.add("cap-on"); });
    at(me, t + 2200, finish);
  }
  function animate(){ var me = ++HR.run; reset(); at(me, 300, function(){ ph(0, true); }); at(me, 900, function(){ ph(1, true); }); at(me, 1500, function(){ ph(2, true); host.classList.add("tri-on"); }); doorsSeq(me, 2400); }
  function listen(){
    var me = ++HR.run, text = MV.plain(H.sentence.join(""));
    if (MV.reduceMotion) finish(); else reset();
    MV.eng.say(text, { voice:VOICE, onWord:function(w){ if (me !== HR.run || MV.reduceMotion) return; H.phraseWords.forEach(function(s, i){ if (w >= s) ph(i, true); }); if (w >= H.phraseWords[2]) host.classList.add("tri-on"); },
      onEnd:function(){ if (me !== HR.run) return; if (MV.reduceMotion) { finish(); return; } [0, 1, 2].forEach(function(i){ ph(i, true); }); host.classList.add("tri-on"); doorsSeq(me, 300); } });
  }
  function btns(){ $("#ef-hlisten").hidden = !VOICE; $("#ef-hagain").hidden = MV.reduceMotion; $("#ef-hnote").hidden = !!VOICE; }
  $("#ef-hlisten").addEventListener("click", listen);
  $("#ef-hagain").addEventListener("click", animate);
  if (MV.reduceMotion) finish(); else animate();
  voiceReady(btns);
  HR.stop = function(){ MV.eng.stop(); if (host.classList.contains("ef-anim")) { HR.run++; finish(); } };
}

// ---------- X-ray rendering (shared by Explore's x-ray and shape-shifter) ----------
var XR = null; // {roles, markers}
function wordKind(w){
  var M = XR.markers, lw = w.toLowerCase();
  if (w === "I" || (lw !== "i" && M.first.indexOf(lw) >= 0)) return "first";
  if (M.second.indexOf(lw) >= 0) return "second";
  if (M.third.indexOf(lw) >= 0) return "third";
  if (M.hedges.indexOf(lw) >= 0) return "hedge";
  if (M.boosters.indexOf(lw) >= 0) return "boost";
  return null;
}
// sentence -> html. o: {skel, voice, craft, si (sentence index), circ (circle the first n words)}
function sentHTML(s, o){
  var cr = o.craft && ((o.craft.layer === "skeleton" && o.skel) || (o.craft.layer === "voice" && o.voice)) ? o.craft : null, ranges = [];
  if (cr && cr.phrases && o.si === 0) cr.phrases.forEach(function(p){ var i = s.t.indexOf(p); if (i >= 0) ranges.push([i, i + p.length]); });
  var re = cr && cr.match ? new RegExp(cr.match, "i") : null, pos = 0, toks = [], last = -1, wn = 0;
  s.t.split(/(\s+)/).forEach(function(p){ if (p) toks.push({ p:p, at:pos }); pos += p.length; });
  toks.forEach(function(tk, i){
    if (/^\s+$/.test(tk.p)) return;
    tk.w = wn++;
    if (cr) tk.cr = re ? re.test(bare(tk.p)) : ranges.some(function(r){ return tk.at >= r[0] && tk.at < r[1]; });
    if (tk.cr) last = i;
  });
  var h = toks.map(function(tk, i){
    if (/^\s+$/.test(tk.p)) return tk.p;
    var k = o.voice ? wordKind(bare(tk.p)) : null, c = [];
    if (k === "first" || k === "second" || k === "third" || (o.circ && tk.w < o.circ)) c.push("ef-pro");
    else if (k === "hedge") c.push("ef-hedge"); else if (k === "boost") c.push("ef-boost");
    if (tk.cr) c.push("ef-cr ef-cr-" + cr.style + " an-" + cr.role);
    var out = c.length ? '<span class="' + c.join(" ") + '">' + esc(tk.p) + "</span>" : esc(tk.p);
    if (tk.cr && i === last) out += '<span class="an-tag an-' + cr.role + ' ef-crtag">' + cr.tag + "</span>";
    return out;
  }).join("");
  var cls = "ef-s" + (o.skel ? " ef-r-" + s.r : "") + (s.cls ? " " + s.cls : "");
  return '<span class="' + cls + '">' + h + "</span>" + (o.skel ? '<span class="an-tag ef-tg ef-tg-' + s.r + '">' + (s.tag || XR.roles[s.r]) + "</span>" : "") + (s.after || "");
}
// paragraphs [[sentence…]…] -> html
function parasHTML(P, o){
  var si = 0, h = P.map(function(par){
    return "<p>" + par.map(function(s){
      if (s.pair) return '<span class="ef-pair">' + s.pair.map(function(x){ return sentHTML(x, Object.assign({}, o, { si:si++ })); }).join(" ") + '<span class="an-tag an-image ef-pairtag">pair</span></span>';
      return sentHTML(s, Object.assign({}, o, { si:si++, circ:s.circ }));
    }).join(" ") + "</p>";
  }).join("");
  // one craft tag per passage, after the last marked word
  var parts = h.split(/(<span class="an-tag an-\w+ ef-crtag">[^<]*<\/span>)/);
  if (parts.length > 3) { var lastTag = parts.length - 2; h = parts.map(function(p, i){ return i % 2 && i !== lastTag ? "" : p; }).join(""); }
  return h;
}
function vinfo(P){
  var c = { first:{}, second:{}, third:{} }, n = { first:0, second:0, third:0 }, h = [], b = [];
  P.forEach(function(par){ par.forEach(function(s){ (s.pair || [s]).forEach(function(x){ x.t.split(/\s+/).forEach(function(tok){
    var w = bare(tok), k = wordKind(w); if (!k) return;
    if (k === "hedge") { if (h.indexOf(w.toLowerCase()) < 0) h.push(w.toLowerCase()); }
    else if (k === "boost") { if (b.indexOf(w.toLowerCase()) < 0) b.push(w.toLowerCase()); }
    else { n[k]++; var key = w === "I" ? "I" : w.toLowerCase(); c[k][key] = (c[k][key] || 0) + 1; }
  }); }); }); });
  var person = n.first >= 2 ? "First person" : n.second >= 2 ? "Second person" : "Third person";
  var pro = [].concat(Object.keys(c.first).map(function(k){ return [k, c.first[k]]; }), Object.keys(c.second).map(function(k){ return [k, c.second[k]]; }), Object.keys(c.third).map(function(k){ return [k, c.third[k]]; }));
  return { person:person, pro:pro, hedges:h, boosters:b };
}
function legendHTML(roles){ return '<p class="ef-legend" aria-label="Skeleton colours">' + Object.keys(roles).map(function(r){ return '<span class="ef-lg"><i class="ef-sw ef-r-' + r + '" aria-hidden="true"></i>' + roles[r] + "</span>"; }).join("") + "</p>"; }

// ---------- Explore: Form blueprints (sort, x-ray, shape-shifter, build) ----------
var EX = null;
function explore(host, api){
  var C = api.content, S = api.S, E = {}, B = {}, V = {};
  XR = { roles:C.roles, markers:C.markers };
  C.excerpts.forEach(function(e){ E[e.id] = e; });
  C.bins.forEach(function(b){ B[b.id] = b; });
  C.shape.versions.forEach(function(v){ V[v.id] = v; });
  S.mode = ["sort", "xray", "shape", "build"].indexOf(S.mode) >= 0 ? S.mode : "sort";
  S.place = S.place || {}; S.xsel = E[S.xsel] ? S.xsel : "ea"; S.layers = S.layers || { purpose:true, skeleton:true, voice:false };
  S.eeOrder = S.eeOrder === "point" ? "point" : "block"; S.egEnd = S.egEnd === "image" ? "image" : "moral"; S.efVar = S.efVar === "before" ? "before" : "after";
  S.shape = V[S.shape] ? S.shape : "explain"; S.prevShape = V[S.prevShape] ? S.prevShape : null;
  S.sk = Array.isArray(S.sk) ? S.sk : C.build.start.slice(); S.skOut = Array.isArray(S.skOut) ? S.skOut : []; S.dials = S.dials || {}; S.anec = !!S.anec;
  var sel = null, skSel = null, fx = {}, tourRun = 0, sortMsg = "", reading = false;

  host.innerHTML = '<div class="ef">' +
    '<div id="ef-mode" class="ef-modes"></div>' +
    '<div class="ef-body"><div class="ef-stage" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="ef-sort"><p class="how">Tap an excerpt to read it, then tap the bin it belongs in. Tap a sorted excerpt to move it again.</p><div id="ef-sortbox"><div id="ef-tray" class="ef-tray" role="group" aria-label="Excerpts to sort"></div>' +
        '<div id="ef-pane" class="ef-pane" aria-live="polite"></div><p class="tiny ef-smsg" id="ef-smsg" aria-live="polite"></p><div id="ef-bins" class="ef-bins"></div></div>' +
        '<div class="ef-tourrow"><button type="button" class="btn ghost sm" id="ef-tour" hidden>' + C.tour.replay + "</button></div></div>" +
      '<div id="ef-xray"><div id="ef-xsel" class="ef-xsel"></div><div class="ef-layers" id="ef-layers" role="group" aria-label="X-ray layers: switch each on or off"></div><div id="ef-xopt" class="ef-xopt"></div>' +
        '<p class="ef-purp" id="ef-purp"></p><div id="ef-xtext" class="ef-xtext"></div><div id="ef-xleg"></div><p class="tiny ef-marks" id="ef-marks"></p></div>' +
      '<div id="ef-shape"><p class="how">' + C.shape.intro + '</p><div id="ef-dial"></div><div id="ef-stext" class="ef-xtext ef-fadebox"></div>' + legendHTML(C.roles) + "</div>" +
      '<div id="ef-build"><h4 class="ef-h">Argument skeleton</h4><p class="how">' + C.build.tc2Intro + '</p><div id="ef-skbox"></div>' +
        '<h4 class="ef-h">Brief for the trustees</h4><p class="how">' + C.build.tc3Intro + '</p><div id="ef-dials" class="ef-dials"></div>' +
        '<label class="ef-check"><input type="checkbox" id="ef-anec"> ' + C.build.anecdote + "</label></div>" +
    '</div><div class="ef-readbox"><p class="ef-read-h">Readout</p><dl class="read" id="ef-read" aria-live="polite"></dl><p class="ef-aha">' + C.aha + "</p></div></div></div>";

  var modeRG = radios($("#ef-mode"), { label:"Mode", options:C.modes, value:S.mode, onChange:function(v){ stopTour(); fx = {}; S.mode = v; api.save(); paint(); } });
  var xselRG = radios($("#ef-xsel"), { label:"Excerpt", cls:"chips", options:C.excerpts.map(function(e){ return { id:e.id, t:e.label + " · " + shortT(e) }; }), value:S.xsel, onChange:function(v){ fx = {}; S.xsel = v; api.save(); paint(); } });
  var dialRG = radios($("#ef-dial"), { label:C.shape.dialLabel, options:C.shape.versions.map(function(v){ return { id:v.id, t:v.t }; }), value:S.shape, onChange:function(v){ setShape(v); } });
  var dialRGs = C.build.dials.map(function(d){
    var box = document.createElement("div"); box.className = "ef-dialrow"; $("#ef-dials").appendChild(box);
    return radios(box, { label:d.t, cls:"chips", options:d.options, value:S.dials[d.id] || "", onChange:function(v){ S.dials[d.id] = v; api.save(); paintRead(); MV.changed(); } });
  });
  $("#ef-anec").checked = S.anec;
  $("#ef-anec").addEventListener("change", function(e){ S.anec = e.target.checked; api.save(); paintRead(); MV.changed(); });

  function shortT(e){ return e.title.replace(/^Model excerpt: /, "").replace(/ \(\d{4}\).*$/, "").replace(/^(Francis|Stephen) /, ""); }
  function allPlaced(){ return C.excerpts.every(function(e){ return !!S.place[e.id]; }); }
  function nRight(){ return C.excerpts.filter(function(e){ return S.place[e.id] === MV.ans(e); }).length; }

  // ----- excerpt sentences for the current state -----
  function exParas(ex){
    if (ex.units) {
      var ord = ex.orders[S.eeOrder], pairs = S.eeOrder === "point" ? ex.pairs : [];
      return ord.map(function(par){
        var out = [];
        for (var i = 0; i < par.length; i++) {
          var pr = pairs.filter(function(p){ return p[0] === par[i] && p[1] === par[i + 1]; })[0];
          if (pr) { out.push({ pair:[sentObj(ex.units[pr[0]]), sentObj(ex.units[pr[1]])] }); i++; }
          else out.push(sentObj(ex.units[par[i]]));
        }
        return out;
      });
    }
    var P = [], cur = null;
    ex.s.map(sentObj).forEach(function(s){
      s = Object.assign({}, s);
      if (s.v) {
        if (ex.id === "ef") { if (fx.p4) { if (s.v === "before") { s.cls = "ef-strike"; s.circ = 2; } else s.cls = "ef-new"; } else if (s.v !== S.efVar) return; }
        if (ex.id === "eg") { if (fx.p3) { s.cls = s.v === "moral" ? "ef-strike" : "ef-new"; } else if (s.v !== S.egEnd) return; }
      }
      if (!cur || s.p) { cur = []; P.push(cur); }
      cur.push(s);
    });
    if (ex.id === "ef" && fx.p4) P[0].sort(function(a, b){ return (a.v === "before" ? 0 : a.v === "after" ? 1 : 2) - (b.v === "before" ? 0 : b.v === "after" ? 1 : 2); });
    return P;
  }
  function plainText(P){ return P.map(function(par){ return par.map(function(s){ return (s.pair || [s]).map(function(x){ return x.t; }).join(" "); }).join(" "); }).join(" "); }
  function patternOf(ex){ var p = ex.units ? ex.pattern[S.eeOrder] : ex.pattern; return "<strong>" + p[0] + "</strong>: " + p[1]; }
  function voiceRow(ex, P){ var vi = vinfo(P); return (ex.person || vi.person) + " · " + ex.reg; }
  function evRow(ev){ return "<strong>" + ev[0] + "</strong>: " + ev[1]; }

  // ----- Sort -----
  function cardBtn(e, small){
    var on = sel === e.id, first = sentObj((e.s || [e.units && e.units.th])[0]).t.split(/\s+/).slice(0, 7).join(" ");
    return '<button type="button" class="ef-card' + (small ? " sm" : "") + '" data-card="' + e.id + '" data-k="card' + e.id + '" aria-pressed="' + on + '"><b>' + e.label + "</b> <span>" + esc(shortT(e)) + (small ? "" : '<span class="ef-c1">“' + esc(first) + "…”</span>") + "</span></button>";
  }
  function paintSort(){
    var box = $("#ef-sortbox"), tray = C.excerpts.filter(function(e){ return !S.place[e.id]; });
    MV.keepFocus(box, function(){
      $("#ef-tray").innerHTML = tray.length ? tray.map(function(e){ return cardBtn(e); }).join("") : '<p class="tiny muted" style="margin:0">All eight excerpts are in bins. Tap one to move it.</p>';
      $("#ef-bins").innerHTML = C.bins.map(function(b){
        var inBin = C.excerpts.filter(function(e){ return S.place[e.id] === b.id; });
        return '<div class="ef-bin"><button type="button" class="ef-binbtn" data-bin="' + b.id + '" data-k="bin' + b.id + '">' + b.t + (sel ? '<span class="vh">: put the selected excerpt here</span>' : "") + "</button>" +
          '<div class="ef-binlist">' + (inBin.length ? inBin.map(function(e){ return cardBtn(e, true); }).join("") : '<span class="tiny muted">empty</span>') + "</div></div>";
      }).join("") + (sel && S.place[sel] ? '<div class="ef-bin ef-binback"><button type="button" class="ef-binbtn" data-bin="" data-k="binback">Back to the tray</button></div>' : "");
    });
    var e = E[sel];
    $("#ef-pane").innerHTML = e ? '<p class="ef-pt"><b>' + e.label + "</b> " + e.title + "</p>" + parasHTML(exParas(e), {}) : '<p class="tiny muted" style="margin:0">Tap an excerpt to read it here.</p>';
    $("#ef-smsg").textContent = sortMsg;
    $("#ef-tour").hidden = !S.toured;
  }
  function place(id, bin){
    var was = allPlaced();
    if (bin) S.place[id] = bin; else delete S.place[id];
    sel = null; sortMsg = bin ? "Excerpt " + E[id].label + " is in " + B[bin].t + "." : "Excerpt " + E[id].label + " is back in the tray.";
    api.save(); paint();
    var nb = $("#ef-tray [data-card]") || $('#ef-bins [data-bin="' + (bin || "exp") + '"]'); if (nb) nb.focus({ preventScroll:true });
    if (!was && allPlaced() && !S.toured) runTour();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.card) { sel = sel === b.dataset.card ? null : b.dataset.card; sortMsg = sel ? "Selected excerpt " + E[sel].label + ". Now tap a bin." : ""; paintSort(); paintRead(); return; }
    if (b.dataset.bin != null) { if (!sel) { sortMsg = "Tap an excerpt first, then tap its bin."; paintSort(); return; } place(sel, b.dataset.bin); return; }
    if (b.id === "ef-tour") { runTour(); return; }
    if (b.dataset.layer) { S.layers[b.dataset.layer] = !S.layers[b.dataset.layer]; fx = {}; api.save(); paintX(); var nb = $('[data-layer="' + b.dataset.layer + '"]', host); if (nb) nb.focus(); return; }
    if (b.dataset.sk) { skSel = skSel === b.dataset.sk ? null : b.dataset.sk; paintSk(); return; }
    if (b.dataset.skm) { skMove(b.dataset.skm, b.dataset.id); return; }
    if (b.dataset.say) { sayEx(); return; }
  });

  // ----- X-ray -----
  var optBox = $("#ef-xopt"), optRG = null, optFor = null;
  function paintX(){
    var ex = E[S.xsel], P = exParas(ex), L = S.layers;
    $("#ef-layers").innerHTML = C.layers.map(function(l){ var on = !!L[l.id]; return '<button type="button" class="an-chip ' + (l.id === "voice" ? "an-diction" : l.id === "skeleton" ? "an-syntax" : "an-theme") + '" data-layer="' + l.id + '" data-k="ly' + l.id + '" aria-pressed="' + on + '"><i class="an-dot"></i>' + l.t + "</button>"; }).join("");
    var want = ex.id === "ee" ? "ee" : ex.id === "eg" ? "eg" : null;
    if (want !== optFor) {
      optFor = want; optBox.innerHTML = "";
      if (want === "ee") optRG = radios(optBox, { label:"Order", options:[{ id:"block", t:ex.orderLabels.block }, { id:"point", t:ex.orderLabels.point }], value:S.eeOrder, onChange:function(v){ fx = {}; S.eeOrder = v; api.save(); paintX(); paintRead(); } });
      else if (want === "eg") optRG = radios(optBox, { label:"Ending", options:[{ id:"moral", t:"The moral" }, { id:"image", t:"The image" }], value:S.egEnd, onChange:function(v){ fx = {}; S.egEnd = v; api.save(); paintX(); paintRead(); } });
      else optRG = null;
    } else if (optRG) optRG.set(want === "ee" ? S.eeOrder : S.egEnd);
    $("#ef-purp").innerHTML = L.purpose ? '<span class="an-tag an-theme">Purpose</span> ' + ex.purpose : "";
    $("#ef-xtext").innerHTML = '<p class="ef-pt"><b>' + ex.label + "</b> " + ex.title + (VOICE ? ' <button type="button" class="btn ghost sm" data-say="1" data-k="xsay">' + (reading ? "Stop" : "Listen") + "</button>" : "") + "</p>" +
      '<div class="ef-xp' + (S.eeOrder === "point" && ex.id === "ee" ? " ef-point" : "") + '">' + parasHTML(P, { skel:L.skeleton, voice:L.voice, craft:ex.craft }) + "</div>";
    $("#ef-xleg").innerHTML = L.skeleton ? legendHTML(C.roles) : "";
    if (L.voice) {
      var vi = vinfo(P);
      $("#ef-marks").innerHTML = "<strong>Voice markers.</strong> Pronouns (circled): " + (vi.pro.length ? vi.pro.map(function(p){ return "“" + p[0] + "” ×" + p[1]; }).join(", ") : "none") +
        " · Hedges (dashed underline): " + (vi.hedges.length ? vi.hedges.map(function(w){ return "“" + w + "”"; }).join(", ") : "none") + " · Boosters (solid underline): " + (vi.boosters.length ? vi.boosters.map(function(w){ return "“" + w + "”"; }).join(", ") : "none") + " · Tense: " + ex.tense;
    } else $("#ef-marks").innerHTML = "";
  }
  function sayEx(){
    if (reading) { MV.eng.stop(); reading = false; paintX(); return; }
    var ex = E[S.xsel]; reading = true; paintX();
    MV.eng.say(plainText(exParas(ex)), { voice:VOICE, onEnd:function(){ reading = false; if (S.mode === "xray") paintX(); } });
  }

  // ----- Shape-shifter -----
  function shapeParas(v){ var P = [], cur = null; v.s.map(sentObj).forEach(function(s){ s = Object.assign({}, s); if (fx.p1 && s.r === "counter") s.cls = "ef-new"; if (!cur || s.p) { cur = []; P.push(cur); } cur.push(s); }); return P; }
  function paintShape(){ var v = V[S.shape]; $("#ef-stext").innerHTML = '<div class="ef-xp">' + parasHTML(shapeParas(v), { skel:true, voice:true }) + "</div>"; }
  function setShape(id){
    if (id === S.shape) return;
    S.prevShape = S.shape; S.shape = id; api.save(); dialRG.set(id);
    var box = $("#ef-stext");
    if (MV.reduceMotion) { paintShape(); paintRead(); MV.changed(); return; }
    box.classList.add("ef-out");
    MV.wait(200, function(){ paintShape(); box.classList.remove("ef-out"); paintRead(); MV.changed(); });
  }

  // ----- Build: argument skeleton (TC2) and the trustees' brief (TC3) -----
  var CARD = {}; C.build.cards.forEach(function(c){ CARD[c.id] = c; });
  function paintSk(){
    var box = $("#ef-skbox");
    MV.keepFocus(box, function(){
      box.innerHTML = '<ol class="ef-sk">' + S.sk.map(function(id, i){
        return '<li><span class="ef-skn" aria-hidden="true">' + (i + 1) + '</span><button type="button" class="ef-skc" data-sk="' + id + '" data-k="sk' + id + '" aria-pressed="' + (skSel === id) + '">' + CARD[id].t + "</button></li>";
      }).join("") + "</ol>" +
        '<div class="q-actions ef-skact"><button type="button" class="btn sm" data-skm="up" data-k="skup"' + (skSel && S.sk.indexOf(skSel) > 0 ? "" : " disabled") + ">Move up</button>" +
        '<button type="button" class="btn sm" data-skm="down" data-k="skdown"' + (skSel && S.sk.indexOf(skSel) >= 0 && S.sk.indexOf(skSel) < S.sk.length - 1 ? "" : " disabled") + ">Move down</button>" +
        '<button type="button" class="btn ghost sm" data-skm="out" data-k="skout"' + (skSel && S.sk.indexOf(skSel) >= 0 ? "" : " disabled") + ">Leave out</button>" +
        '<span class="tiny muted">' + (skSel ? "Selected: " + CARD[skSel].t : "Tap a card to select it.") + "</span></div>" +
        (S.skOut.length ? '<p class="tiny ef-skoutp">Left out: ' + S.skOut.map(function(id){ return CARD[id].t + ' <button type="button" class="linkbtn" data-skm="back" data-id="' + id + '" data-k="skb' + id + '">Put back</button>'; }).join("; ") + "</p>" : "");
    });
  }
  function skMove(m, id){
    if (m === "back") { S.skOut = S.skOut.filter(function(x){ return x !== id; }); S.sk.push(id); skSel = id; }
    else {
      var i = S.sk.indexOf(skSel); if (i < 0) return;
      if (m === "up" && i > 0) { S.sk.splice(i, 1); S.sk.splice(i - 1, 0, skSel); }
      else if (m === "down" && i < S.sk.length - 1) { S.sk.splice(i, 1); S.sk.splice(i + 1, 0, skSel); }
      else if (m === "out") { S.sk.splice(i, 1); S.skOut.push(skSel); skSel = null; }
    }
    api.save(); paintSk(); paintRead(); MV.changed();
    var f = m === "out" ? $('#ef-skbox [data-sk]') : $('#ef-skbox [data-k="sk' + m + '"]'); if (f && f.disabled) f = $('#ef-skbox [data-sk="' + skSel + '"]'); if (f) f.focus({ preventScroll:true });
  }

  // ----- readout -----
  function paintRead(){
    var rows = [], ex;
    if (S.mode === "sort") {
      ex = E[sel];
      rows.push(["Selected", ex ? "<b>" + ex.label + "</b> " + ex.title : "none"]);
      rows.push(["Form", allPlaced() ? (ex ? B[MV.ans(ex)].t : "Select an excerpt to see its form") : "Revealed after sorting"]);
      rows.push(["Sorted correctly", allPlaced() ? nRight() + "/" + C.excerpts.length : Object.keys(S.place).filter(function(k){ return E[k]; }).length + " of " + C.excerpts.length + " placed"]);
    } else if (S.mode === "xray") {
      ex = E[S.xsel]; var P = exParas(ex);
      rows.push(["Form", B[MV.ans(ex)].t], ["Purpose", "“" + ex.purpose + "”"], ["Pattern", patternOf(ex)], ["Voice", voiceRow(ex, P)], ["Evidence type", evRow(ex.evidence)]);
    } else if (S.mode === "shape") {
      var v = V[S.shape], pv = S.prevShape ? V[S.prevShape] : null, Pn = shapeParas(v), vn = (vinfo(Pn).person) + " · " + v.reg;
      var vp = pv ? vinfo(shapeParas(pv)).person + " · " + pv.reg : null;
      function chg(a, b){ return pv && a !== b ? ' <span class="ef-chg">changed</span>' : ""; }
      rows.push(["Form", v.form + chg(v.form, pv && pv.form)], ["Purpose", "“" + v.purpose + "”" + chg(v.purpose, pv && pv.purpose)],
        ["First sentence", v.first + chg(v.first, pv && pv.first)], ["Pattern", "<strong>" + v.pattern[0] + "</strong>: " + v.pattern[1] + chg(v.pattern[0], pv && pv.pattern[0])],
        ["Voice", vn + chg(vn, vp)], ["Evidence type", evRow(v.evidence) + chg(v.evidence[0], pv && pv.evidence[0])], ["Counterargument", v.counter + chg(v.counter, pv && pv.counter)]);
    } else {
      rows.push(["Skeleton", S.sk.map(function(id){ return id; }).join(" → ") + (S.skOut.length ? " (left out: " + S.skOut.join(", ") + ")" : "")]);
      C.build.dials.forEach(function(d){ var o = d.options.filter(function(x){ return x.id === S.dials[d.id]; })[0]; rows.push([d.t, o ? o.t : "not set"]); });
      rows.push(["Anecdote", S.anec ? "one brief personal anecdote, as a reason" : "none"]);
    }
    $("#ef-read").innerHTML = MV.readoutHTML(rows);
  }

  function paint(){
    modeRG.set(S.mode);
    ["sort", "xray", "shape", "build"].forEach(function(m){ $("#ef-" + m).hidden = S.mode !== m; });
    if (S.mode === "sort") paintSort();
    else if (S.mode === "xray") { xselRG.set(S.xsel); paintX(); }
    else if (S.mode === "shape") { dialRG.set(S.shape); paintShape(); }
    else { paintSk(); dialRGs.forEach(function(rg, i){ rg.set(S.dials[C.build.dials[i].id] || ""); }); $("#ef-anec").checked = S.anec; }
    paintRead(); MV.changed();
  }

  // ----- first visit: the cards fan out and the bins glow; after sorting, the x-ray tour -----
  function fan(){
    if (S.fanned || MV.reduceMotion) { S.fanned = true; return; }
    S.fanned = true; api.save();
    var t = $("#ef-tray"), b = $("#ef-bins"); t.classList.add("ef-fan"); b.classList.add("ef-glow");
    $$(".ef-card", t).forEach(function(c, i){ c.style.setProperty("--i", i); });
    setTimeout(function(){ t.classList.remove("ef-fan"); b.classList.remove("ef-glow"); }, 2200);
  }
  function stopTour(){ tourRun++; }
  function runTour(){
    var me = ++tourRun; S.toured = true; api.save();
    var keep = { mode:S.mode, layers:Object.assign({}, S.layers), xsel:S.xsel };
    function alive(){ return me === tourRun; }
    S.mode = "xray"; S.xsel = "eb"; S.layers = { purpose:false, skeleton:false, voice:true }; fx = {}; paint(); MV.banner("", C.tour.eb);
    MV.wait(2800, function(){
      if (!alive()) return;
      S.xsel = "ea"; S.layers = { purpose:false, skeleton:true, voice:false }; paint(); MV.banner("", C.tour.ea);
      MV.wait(2800, function(){
        if (!alive()) return;
        S.mode = keep.mode; S.layers = keep.layers; S.xsel = keep.xsel; api.save(); paint(); MV.banner("good", C.tour.caption);
      });
    });
  }

  // ----- reader pane: both essays in full, with Listen -----
  (function reader(){
    var R = $("#ef-reader"); if (!R) return;
    var T = MV.C.texts, rd = { id:null };
    R.innerHTML = ["bacon", "leacock"].map(function(k){ return '<details class="alg ef-rd" data-rd="' + k + '"><summary>' + T[k].title + '</summary><div class="ef-rdctl"><button type="button" class="btn ghost sm ef-rdsay" data-rdsay="' + k + '" hidden>Listen</button></div><div class="ef-rdtext"></div>' + (T[k].gloss ? '<p class="tiny">' + T[k].gloss + "</p>" : "") + "</details>"; }).join("");
    ["bacon", "leacock"].forEach(function(k){ MV.eng.passage($('[data-rd="' + k + '"] .ef-rdtext', R), T[k].paras, { kind:"prose", cite:T[k].cite, words:true }); });
    function lab(){ $$("[data-rdsay]", R).forEach(function(b){ b.hidden = !VOICE; b.textContent = rd.id === b.dataset.rdsay ? "Stop" : "Listen"; }); }
    R.addEventListener("click", function(e){
      var b = e.target.closest("[data-rdsay]"); if (!b) return;
      var k = b.dataset.rdsay, was = rd.id; MV.eng.stop(); $$(".eng-w.speaking", R).forEach(function(w){ w.classList.remove("speaking"); });
      if (was === k) { rd.id = null; lab(); return; }
      rd.id = k; lab();
      var box = $('[data-rd="' + k + '"]', R);
      MV.eng.say(T[k].paras.join(" "), { voice:VOICE, onWord:function(i){ $$(".eng-w.speaking", box).forEach(function(w){ w.classList.remove("speaking"); }); var w = box.querySelector('.eng-w[data-wi="' + i + '"]'); if (w) w.classList.add("speaking"); },
        onEnd:function(){ if (rd.id === k) { rd.id = null; lab(); } $$(".eng-w.speaking", box).forEach(function(w){ w.classList.remove("speaking"); }); } });
    });
    voiceReady(lab);
  })();

  // "Set it up" buttons in the challenge prompts
  document.addEventListener("click", function(e){
    var b = e.target.closest("[data-setup]"); if (!b) return;
    stopTour(); fx = {};
    S.mode = b.dataset.setup === "tc1" ? "sort" : "build"; api.save(); paint();
    $("#ex-app").scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
    var f = b.dataset.setup === "tc1" ? $("#ef-tray [data-card]") || $("#ef-bins [data-card]") : b.dataset.setup === "tc2" ? $("#ef-skbox [data-sk]") : $('#ef-dials [tabindex="0"]');
    if (f) f.focus({ preventScroll:true });
  });
  voiceReady(function(){ if (S.mode === "xray") paintX(); });

  // ---------- target challenges ----------
  function tc1(){
    var m = C.challenges[0].msgs;
    if (!allPlaced()) return { ok:false, msg:m.place };
    if (S.place.eb === "exp") return { ok:false, msg:m.leacock };
    if (S.place.ea === "arg") return { ok:false, msg:m.bacon };
    if (S.place.eh === "cmp") return { ok:false, msg:m.eh };
    return nRight() === C.excerpts.length ? { ok:true } : { ok:false };
  }
  function tc2(){
    var c = C.challenges[1], m = c.msgs, o = S.sk, A = MV.ans(c);
    if (S.skOut.indexOf("d") >= 0) return { ok:false, msg:m.nod };
    if (S.skOut.length) return { ok:false };
    if (o.indexOf("d") > o.indexOf("e")) return { ok:false, msg:m.dlast };
    if (o.indexOf("e") < o.indexOf("b")) return { ok:false, msg:m.ebeforeb };
    return A.some(function(a){ return a.join("") === o.join(""); }) ? { ok:true } : { ok:false };
  }
  function tc3(){
    var c = C.challenges[2], m = c.msgs, D = S.dials, A = MV.ans(c);
    if (D.form === "per" && D.pattern === "scn") return { ok:false, msg:m.personal };
    if (D.form === "exp") return { ok:false, msg:m.expository };
    if (D.voice === "second") return { ok:false, msg:m.second };
    if (D.evidence === "quotes") return { ok:false, msg:m.quotes };
    var base = D.form === A.form && D.pattern === A.pattern && D.evidence === A.evidence;
    if (base && D.voice === A.voice) return { ok:true };
    if (base && D.voice === A.alt.voice && S.anec === A.alt.anecdote) return { ok:true };
    return { ok:false };
  }

  extras();
  paint(); fan();
  EX = { stop:function(){ stopTour(); MV.eng.stop(); reading = false; } };
  return {
    predict:{
      start:function(p){
        stopTour(); MV.eng.stop(); reading = false; fx = {};
        if (p.id === "p1") { S.mode = "shape"; S.prevShape = null; S.shape = "explain"; }
        else if (p.id === "p2") { S.mode = "xray"; S.xsel = "ee"; S.eeOrder = "block"; S.layers.skeleton = true; }
        else if (p.id === "p3") { S.mode = "xray"; S.xsel = "eg"; S.egEnd = "moral"; S.layers.skeleton = true; }
        else if (p.id === "p4") { S.mode = "xray"; S.xsel = "ef"; S.efVar = "before"; S.layers.voice = true; }
        api.save(); paint();
      },
      run:function(p, done){
        var ended = false; function fin(){ if (!ended) { ended = true; done(); } }
        MV.wait(300, function(){
          if (p.id === "p1") { fx = { p1:true }; setShape("convince"); MV.wait(1500, fin); return; }
          if (p.id === "p2") { S.eeOrder = "point"; api.save(); paintX(); paintRead(); var x = $("#ef-xtext .ef-xp"); if (x && !MV.reduceMotion) x.classList.add("ef-shuffle"); MV.wait(1600, fin); return; }
          if (p.id === "p3") { fx = { p3:true }; S.egEnd = "image"; api.save(); paintX(); paintRead(); MV.wait(1600, fin); return; }
          if (p.id === "p4") { fx = { p4:true }; S.efVar = "after"; api.save(); paintX(); paintRead(); MV.wait(1600, fin); return; }
          fin();
        });
      }
    },
    challenge:function(id){ return id === "tc1" ? tc1() : id === "tc2" ? tc2() : id === "tc3" ? tc3() : { ok:false }; }
  };
}

// ---------- Part 3: Same topic, four forms (comparison grid + choose a form) ----------
function part3(host, api){
  var C = MV.C.part3, S = api.S, G = C.grid, CH = C.choose;
  S.rev = S.rev || {}; S.cards = S.cards || {};
  var cols = C.paras.map(function(p){ return p.form; });
  host.innerHTML = '<div class="ef-ff"><div class="ef-paras">' + C.paras.map(function(p, ci){
      return '<article class="ef-para" data-col="' + ci + '"><h4><span class="ef-ftag">' + p.form + "</span> “" + p.title + "”</h4><p>" + p.s.map(function(s, si){ return '<span class="ef-ps" data-ps="' + ci + ":" + si + '">' + esc(s) + "</span>"; }).join(" ") + "</p></article>";
    }).join("") + "</div>" +
    '<h3 class="ef-h3">Comparison grid</h3><p class="how">' + G.intro + '</p><div class="tbl-wrap ef-gridwrap"><table class="ef-grid"><caption class="vh">Four forms compared: tap a cell to reveal it</caption><thead><tr><th scope="col"><span class="vh">Feature</span></th>' + cols.map(function(c){ return '<th scope="col">' + c + "</th>"; }).join("") + "</tr></thead><tbody id=\"ef-gbody\"></tbody></table></div>" +
    '<div class="q-actions"><span class="tiny muted" id="ef-gcount" aria-live="polite"></span><button type="button" class="btn ghost sm" id="ef-gall">Reveal all</button></div>' +
    '<h3 class="ef-h3">Choose a form for a purpose</h3><p class="how">' + CH.intro + '</p><div id="ef-cards" class="ef-cards"></div></div>';

  function paintGrid(){
    var body = $("#ef-gbody"), n = 0, tot = 0;
    MV.keepFocus(body, function(){
      body.innerHTML = G.rows.map(function(r, ri){
        return '<tr><th scope="row">' + r.t + "</th>" + r.cells.map(function(c, ci){
          var k = ri + ":" + ci, st = S.rev[k] || 0; tot++; if (st === 2) n++;
          var lab = r.t + ", " + cols[ci];
          return "<td>" + (st === 2 ? '<span class="ef-cell done">' + esc(c) + "</span>" : '<button type="button" class="ef-cell' + (st === 1 ? " armed" : "") + '" data-cell="' + k + '" data-k="gc' + k + '" aria-label="' + esc(lab + (st === 1 ? ": say your prediction, then tap to reveal" : ": predict, then tap")) + '">' + (st === 1 ? "Tap to reveal" : "?") + "</button>") + "</td>";
        }).join("") + "</tr>";
      }).join("");
    });
    $("#ef-gcount").textContent = n + " of " + tot + " cells revealed";
    $("#ef-gall").disabled = n === tot;
    // reveal links back to the paragraphs: first sentences and endings
    $$(".ef-ps", host).forEach(function(s){ s.classList.remove("ef-hl"); }); $$(".ef-pstag", host).forEach(function(t){ t.parentNode.removeChild(t); });
    G.rows.forEach(function(r, ri){
      if (!r.hl) return;
      C.paras.forEach(function(p, ci){
        if (S.rev[ri + ":" + ci] !== 2) return;
        var si = r.hl === "first" ? 0 : p.s.length - 1, el = $('[data-ps="' + ci + ":" + si + '"]', host);
        if (el) { el.classList.add("ef-hl"); el.insertAdjacentHTML("afterend", '<span class="an-tag an-theme ef-pstag">'+ (r.hl === "first" ? "first sentence" : "ending") + "</span>"); }
      });
    });
  }
  function paintCards(){
    var box = $("#ef-cards");
    MV.keepFocus(box, function(){
      box.innerHTML = CH.cards.map(function(cd, i){
        var st = S.cards[cd.id] || {}, fs = st.forms || [], done = !!st.ok;
        var h = '<div class="ef-dcard q" data-cd="' + cd.id + '"><p class="ef-sit"><span class="qn" aria-hidden="true">' + String.fromCharCode(97 + i) + "</span> " + cd.t + "</p>" +
          '<div class="ef-dlab">Form</div><div class="chips" role="group" aria-label="Form (choose one, or two that combine)">' + CH.forms.map(function(f){ var on = fs.indexOf(f.id) >= 0; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-cf="' + f.id + '" data-k="' + cd.id + "f" + f.id + '"' + (done ? " disabled" : "") + ">" + f.t + "</button>"; }).join("") + "</div>" +
          '<div class="ef-dlab">Why</div><div class="ef-just" role="radiogroup" aria-label="Justification">' + CH.just.map(function(j){ var on = st.j === j.id; return '<button type="button" role="radio" class="opt ef-jopt' + (on ? " picked" : "") + '" aria-checked="' + on + '" data-cj="' + j.id + '" data-k="' + cd.id + "j" + j.id + '"' + (done ? " disabled" : "") + "><span>" + j.t + "</span></button>"; }).join("") + "</div>";
        if (!done) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-cchk="1" data-k="' + cd.id + 'chk">Check</button></div>';
        if (st.msg) h += MV.fbHTML(st.ok ? "good" : "bad", st.msg);
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.cell) { var k = b.dataset.cell; S.rev[k] = Math.min(2, (S.rev[k] || 0) + 1); api.save(); paintGrid(); if (S.rev[k] === 2) { var nb = $("#ef-gbody [data-cell]"); if (nb) nb.focus({ preventScroll:true }); } return; }
    if (b.id === "ef-gall") { G.rows.forEach(function(r, ri){ r.cells.forEach(function(_, ci){ S.rev[ri + ":" + ci] = 2; }); }); api.save(); paintGrid(); return; }
    var box = b.closest("[data-cd]"); if (!box) return;
    var cd = CH.cards.filter(function(x){ return x.id === box.dataset.cd; })[0], st = S.cards[cd.id] || (S.cards[cd.id] = { forms:[], j:"", tries:0 });
    if (b.dataset.cf) { var i = st.forms.indexOf(b.dataset.cf); if (i >= 0) st.forms.splice(i, 1); else { st.forms.push(b.dataset.cf); if (st.forms.length > 2) st.forms.shift(); } st.msg = ""; }
    else if (b.dataset.cj) { st.j = b.dataset.cj; st.msg = ""; }
    else if (b.dataset.cchk) {
      var A = MV.ans(cd), fOK = st.forms.length === A.forms.length && A.forms.every(function(f){ return st.forms.indexOf(f) >= 0; });
      var half = !fOK && A.forms.length > 1 && st.forms.length === 1 && A.forms.indexOf(st.forms[0]) >= 0;
      if (!st.forms.length) st.msg = "Choose a form first.";
      else if (fOK && !st.j) st.msg = CH.noJust;
      else if (fOK && st.j === A.j) { st.ok = true; st.msg = "<strong>✓ Right.</strong> " + cd.good; }
      else { st.tries++; st.msg = "<strong>✗ " + (half ? CH.half : fOK ? "The form fits, but not that justification. Which line says what this piece is <em>for</em>?" : CH.bad) + "</strong>"; }
    }
    api.save(); paintCards();
    if (b.dataset.cchk) MV.focusFb($('[data-cd="' + cd.id + '"]', host));
  });
  paintGrid(); paintCards();

  // Sentence to steal: live structure checks and "Save to my commonplace book" (the master's sentences and the imitation)
  var steal = $('.mv-block[data-block="steal"]'), ST = C.steal;
  if (steal) {
    var row = document.createElement("div");
    row.innerHTML = '<ul class="checks ef-stchk" id="ef-stchk" aria-live="polite"></ul><div class="q-actions"><button type="button" class="btn ghost sm" id="steal-save">' + ST.save + '</button><span class="tiny muted" id="steal-st" aria-live="polite"></span></div>';
    steal.appendChild(row);
    var ta = $('textarea[data-w="steal"]', steal);
    function stealChecks(t){
      var s = String(t || "").trim().replace(/^[“"‘']+/, ""), parts = s.split(/(?<=[.!?])["”’]?\s+/), s2 = parts[1] || "", cl = s2.split(";");
      return [/^When I\b/.test(s), (s2.match(/;/g) || []).length >= 3, cl.length > 1 && /^["“‘']?everything\b/i.test(cl[cl.length - 1].trim())];
    }
    function paintSt(){ var r = stealChecks(ta ? ta.value : MV.S.writes.steal); $("#ef-stchk").innerHTML = ST.checks.map(function(c, i){ return '<li class="' + (r[i] ? "yes" : "no") + '"><span class="mk" aria-hidden="true">' + (r[i] ? "✓" : "○") + "</span><span>" + c + '<span class="vh">' + (r[i] ? " (met)" : " (not met)") + "</span></span></li>"; }).join(""); }
    if (ta) ta.addEventListener("input", paintSt);
    setTimeout(paintSt, 0);
    row.addEventListener("click", function(e){
      if (e.target.id !== "steal-save") return;
      var t = (MV.S.writes.steal || (ta && ta.value) || "").trim();
      if (!t) { $("#steal-st").textContent = "Write your imitation first."; return; }
      MV.eng.saveLine(ST.master, "The master’s sentences: " + ST.source); MV.eng.saveLine(t, "My imitation of " + ST.source);
      $("#steal-st").textContent = "Saved the master’s sentences and your imitation to your commonplace book.";
    });
  }
}

// ---------- Practice 3: @component K13 spotProse — Spot the Error for a paragraph (copied from ENG4U 03; numbered sentences) ----------
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

// ---------- @component E7 thesisForge — subject (text and author), claim and how assemble a thesis; a rule-based checker flags
// factual, vague or unarguable theses (course plan E7; reused by 09 and 19) ----------
// thesisForge(host, {fields:[{id, t, ph}], flags:{factual, vague, pref, noHow}, vague:[], pref:[], factual:[], get() -> {text, author, claim, how}, set(id, v)})
function forgeText(F){
  F = F || {}; var t = (F.text || "").trim(), a = (F.author || "").trim(), c = (F.claim || "").trim(), h = (F.how || "").trim();
  if (!t && !a && !c && !h) return "";
  return "In " + (t || "[text]") + ", " + (a || "[author]") + " " + (c || "[claim]").replace(/[.\s]+$/, "") + (h ? " through " + h.replace(/[.\s]+$/, "") : "") + ".";
}
function forgeFlags(F, o){
  var s = forgeText(F).toLowerCase(), out = [];
  if (!s) return out;
  if (/\b1[0-9]{3}\b|\b20[0-9]{2}\b/.test(s) || o.factual.some(function(w){ return s.indexOf(w) >= 0; })) out.push(o.flags.factual);
  if (o.vague.some(function(w){ return s.indexOf(w) >= 0; })) out.push(o.flags.vague);
  if (o.pref.some(function(w){ return new RegExp("(^|[^a-z])" + w + "([^a-z]|$)").test(s); })) out.push(o.flags.pref);
  if (!(F.how || "").trim()) out.push(o.flags.noHow);
  return out;
}
function thesisForge(host, o){
  host.innerHTML = '<div class="ef-forge">' + o.fields.map(function(f){ return '<div class="jq"><label for="tf-' + f.id + '">' + f.t + '</label><input id="tf-' + f.id + '" class="txtin" type="text" autocomplete="off" data-tf="' + f.id + '" placeholder="' + esc(MV.plain(f.ph || "")) + '"></div>'; }).join("") +
    '<p class="ef-forge-out" id="tf-out" aria-live="polite"></p><ul class="ef-forge-flags" id="tf-flags" aria-live="polite"></ul></div>';
  var F = o.get();
  o.fields.forEach(function(f){ $("#tf-" + f.id, host).value = F[f.id] || ""; });
  function paint(){
    var F2 = o.get(), t = forgeText(F2), fl = forgeFlags(F2, o), full = o.fields.every(function(f){ return (F2[f.id] || "").trim(); });
    $("#tf-out", host).innerHTML = t ? "<strong>Your thesis:</strong> " + esc(t) : '<span class="muted">Fill in the four parts and your thesis assembles here.</span>';
    $("#tf-flags", host).innerHTML = !t ? "" : fl.length ? fl.map(function(x){ return '<li><span aria-hidden="true">⚑</span> ' + x + "</li>"; }).join("") : full ? '<li class="ok"><span aria-hidden="true">✓</span> No flags: it names the text and author, makes a claim and says how.</li>' : "";
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset.tf) return; o.set(t.dataset.tf, t.value); paint(); });
  paint();
  return { paint:paint };
}

// ---------- @component E17 draftWorkspace — a writing area with a live word count (target range), saved drafts (up to 3) and a
// side-by-side compare with the changes marked (course plan E17) ----------
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
  host.innerHTML = '<div class="ef-dw"><label for="dw-' + o.id + '" class="ef-lab">' + o.label + '</label><textarea id="dw-' + o.id + '" class="ef-dw-ta" rows="9"></textarea>' +
    '<div class="q-actions"><span class="ef-dw-n" id="dw-' + o.id + '-n" aria-live="polite"></span><button type="button" class="btn ghost sm" id="dw-' + o.id + '-save">Save as a draft</button></div><div id="dw-' + o.id + '-list"></div><div id="dw-' + o.id + '-cmp" aria-live="polite"></div></div>';
  var ta = $("#dw-" + o.id, host); ta.value = o.get() || "";
  function count(){
    var n = wc(ta.value), msg = n < o.min ? (o.min - n) + " to go" : n > o.max ? (n - o.max) + " over" : "in range";
    $("#dw-" + o.id + "-n", host).innerHTML = "<strong>" + n + " word" + (n === 1 ? "" : "s") + "</strong> · aim for " + o.min + "–" + o.max + " (" + msg + ")";
  }
  function list(){
    var D = o.drafts(), el = $("#dw-" + o.id + "-list", host);
    el.innerHTML = D.length ? '<p class="tiny ef-dw-l">Saved drafts: ' + D.map(function(d, i){ return '<button type="button" class="linkbtn" data-dwc="' + i + '" aria-pressed="' + (cmp === i) + '">Compare draft ' + d.n + " with now</button>"; }).join(" · ") + "</p>" : "";
    var cb = $("#dw-" + o.id + "-cmp", host);
    if (cmp != null && D[cmp]) { var df = diffWords(D[cmp].t, ta.value); cb.innerHTML = '<div class="ef-dw-cmp"><div><p class="tiny"><strong>Draft ' + D[cmp].n + '</strong> (removed words struck through)</p><p>' + df[0] + '</p></div><div><p class="tiny"><strong>Now</strong> (new words underlined)</p><p>' + df[1] + "</p></div></div>"; }
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

// ---------- Performance task: Choose your form (structure-only checks; the full plan and opening go into the summary) ----------
var task = (function(){
  var api = null, T = null, forge = null;
  function explain(){ var e = $("#task-explain"); return e ? e.value : (MV.taskState().explain || ""); }
  function FT(id){ var f = T.forms.filter(function(x){ return x.id === id; })[0]; return f ? f.t : ""; }
  function slotsOf(S, f){ S.sl = S.sl || {}; return S.sl[f] || (S.sl[f] = {}); }
  function fpc(t){ var s = String(t || "").replace(/“[^”]*”/g, " ").replace(/"[^"]*"/g, " "); return (s.match(/\bI\b/g) || []).length + (s.match(/\b(me|my|mine)\b/gi) || []).length; }
  function data(S){
    S = S || {}; var f = S.form || "", sl = (S.sl || {})[f] || {};
    var bones = (f ? T.slots[f] : []).map(function(d){
      if (d.forge) { var F = S.forge || {}, v = forgeText(F); return { id:d.id, t:d.t, v:v, ok:["text", "author", "claim", "how"].every(function(k){ return (F[k] || "").trim(); }) && wc(v) >= 5 }; }
      if (d.chips) { var st = T.structures.filter(function(x){ return x.id === S.structure; })[0]; return { id:d.id, t:d.t, v:st ? st.t : "", ok:!!st }; }
      if (d.boxes) { var arr = Array.isArray(sl[d.id]) ? sl[d.id] : []; var filled = [0, 1, 2].map(function(i){ return String(arr[i] || "").trim(); }); return { id:d.id, t:d.t, v:filled.filter(Boolean).join("; "), list:filled, ok:filled.every(Boolean) && wc(filled.join(" ")) >= 5 }; }
      var v2 = String(sl[d.id] || ""); return { id:d.id, t:d.t, v:v2.trim(), ok:wc(v2) >= 5 };
    });
    var top = S.topic === "own" ? String(S.topicOwn || "").trim() : (S.topic != null && T.topics[+S.topic] ? T.topics[+S.topic] : "");
    return { topic:top, form:f, formT:FT(f), audChip:S.aud || "", audOwn:String(S.audOwn || ""), aud:S.aud || String(S.audOwn || "").trim(), purpose:String(S.purpose || ""),
      voice:S.voice || "", bones:bones, counter:String(sl.counter || ""), opening:String(S.opening || ""), explain:explain() };
  }
  function checks(d){
    var f = d.form, re = (T.purposeWords[f] || []).map(function(s){ return new RegExp(s, "i"); }), cw = new RegExp("\\b(" + T.counterWords.join("|") + ")\\b", "i"), n = wc(d.opening), fp = fpc(d.opening);
    return [!!f && (!!d.audChip || wc(d.audOwn) >= 2),
      !!f && wc(d.purpose) >= 10 && re.some(function(r){ return r.test(d.purpose); }),
      !!f && d.bones.length > 0 && d.bones.every(function(b){ return b.ok; }),
      f !== "arg" ? true : cw.test(d.counter),
      n >= T.opening.min && n <= T.opening.max,
      !!d.voice && n > 0 && (d.voice === "third" ? fp === 0 : fp >= 2),
      wc(d.explain) >= 40];
  }
  function applicable(d){ return T.checks.map(function(_, i){ return i !== 3 || d.form === "arg"; }); }
  function hideLine4(){ var li = $$("#task-checks li")[3]; if (li) li.hidden = (api && api.S.form) !== "arg"; }
  function paintPurpose(){
    var S = api.S, f = S.form, n = wc(S.purpose), re = (T.purposeWords[f] || []).map(function(s){ return new RegExp(s, "i"); }), hit = re.some(function(r){ return r.test(S.purpose || ""); });
    $("#ct-pinfo").innerHTML = n + " word" + (n === 1 ? "" : "s") + " (at least 10)" + (f ? " · purpose words for " + FT(f) + ": " + T.purposeShow[f] + (hit ? " (found ✓)" : "") : " · choose a form to see its purpose words");
  }
  function paintPv(){
    var d = data(api.S), el = $("#ct-pv"); if (!el) return;
    var found = MV.taskState().found || [];
    el.innerHTML = '<h4 class="ef-h" style="margin-top:0">Your skeleton at a glance</h4>' + (d.form ? '<ol class="ef-bones">' + d.bones.map(function(b){ return '<li class="' + (b.ok ? "yes" : "no") + '"><span class="mk" aria-hidden="true">' + (b.ok ? "✓" : "○") + "</span><span><strong>" + b.t + ":</strong> " + (b.v ? esc(b.v) : '<span class="muted">empty</span>') + (b.ok ? "" : '<span class="vh"> (not complete)</span>') + "</span></li>"; }).join("") + "</ol>" : '<p class="tiny muted">Choose a form to see its skeleton.</p>') +
      '<p class="tiny ef-tried"><strong>Forms you’ve tried:</strong> ' + (found.length ? found.map(FT).join(", ") : "none yet") + "</p>";
    var ok = checks(d).every(Boolean), m = $("#ct-models");
    m.innerHTML = ok ? '<div class="fb good"><p><strong>✓ ' + T.success + "</strong></p></div><details class=\"alg\"><summary>" + T.modelsLabel + "</summary>" + T.models.map(function(md){
      var bones = T.slots[md.form].map(function(s){ var v = s.chips ? (md.structure === "point" ? "point-by-point" : "block") : md.slots[s.id]; return "<li><strong>" + s.t + ":</strong> " + (Array.isArray(v) ? v.join("; ") : v) + "</li>"; }).join("");
      return '<div class="ef-model"><h5>' + md.title + "</h5><p><strong>Purpose:</strong> " + md.purpose + '</p><ul class="ef-mbones">' + bones + "</ul><p><strong>Opening (" + wc(md.opening) + " words):</strong> " + md.opening + "</p><p><strong>Craft statement:</strong> " + md.craft + "</p></div>";
    }).join("") + "</details>" : "";
  }
  function changed(){ api.save(); api.update(); paintPv(); }
  function paintSkel(){
    var S = api.S, f = S.form, host = $("#ct-skel");
    if (!f) { host.innerHTML = '<p class="tiny muted">Choose a form to see its skeleton.</p>'; return; }
    var sl = slotsOf(S, f);
    host.innerHTML = '<h4 class="ef-h">Skeleton: ' + FT(f) + "</h4>" + T.slots[f].map(function(d){
      if (d.forge) return '<div class="ef-forgewrap"><p class="ef-lab">' + d.t + ' <span class="tiny muted">(thesis forge: text, author, claim, how)</span></p><div id="ct-forge"></div></div>';
      if (d.chips) return '<div id="ct-struct" class="ef-ctrow"></div>';
      if (d.boxes) return '<fieldset class="ef-boxes"><legend>' + d.t + "</legend>" + [0, 1, 2].map(function(i){ return '<input class="txtin" type="text" autocomplete="off" data-slot="' + d.id + '" data-box="' + i + '" aria-label="' + esc(d.t + ": " + d.ph + " " + (i + 1)) + '" placeholder="' + esc(d.ph + " " + (i + 1)) + '">'; }).join("") + "</fieldset>";
      return '<div class="jq"><label for="ct-s-' + d.id + '">' + d.t + '</label><textarea id="ct-s-' + d.id + '" class="ef-slot" data-slot="' + d.id + '" placeholder="' + esc(d.ph || "At least five words") + '"></textarea></div>';
    }).join("");
    $$("[data-slot]", host).forEach(function(el){ var v = sl[el.dataset.slot]; el.value = el.dataset.box != null ? (Array.isArray(v) ? v[+el.dataset.box] || "" : "") : (v || ""); });
    if ($("#ct-forge")) { S.forge = S.forge || {}; forge = thesisForge($("#ct-forge"), { fields:T.forge.fields, flags:T.forge.flags, vague:T.forge.vague, pref:T.forge.pref, factual:T.forge.factual, get:function(){ return S.forge; }, set:function(k, v){ S.forge[k] = v; changed(); } }); }
    if ($("#ct-struct")) radios($("#ct-struct"), { label:"Structure", cls:"chips", options:T.structures, value:S.structure || "", onChange:function(v){ S.structure = v; changed(); } });
  }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; var S = a.S;
      inp.innerHTML = '<div class="ef-ct"><div class="ef-ctrow" id="ct-topic"></div><div class="jq ef-own"><label for="ct-topic-own">Or type your own topic</label><input id="ct-topic-own" class="txtin" type="text" autocomplete="off"></div>' +
        '<div class="ef-ctrow" id="ct-form"></div><div class="ef-ctrow" id="ct-aud"></div><div class="jq ef-own"><label for="ct-aud-own">Or type an audience</label><input id="ct-aud-own" class="txtin" type="text" autocomplete="off" placeholder="e.g. the school council"></div>' +
        '<div class="jq"><label for="ct-purpose">Purpose sentence</label><textarea id="ct-purpose" class="ef-slot" placeholder="To … (at least 10 words)"></textarea><p class="tiny muted" id="ct-pinfo" aria-live="polite"></p></div>' +
        '<div class="ef-ctrow" id="ct-voice"></div><div id="ct-skel" class="ef-skel"></div><div id="ct-open"></div></div>';
      pv.innerHTML = '<div id="ct-pv" aria-live="polite"></div><div id="ct-models"></div>';
      $("#ct-topic-own").value = S.topicOwn || ""; $("#ct-aud-own").value = S.audOwn || ""; $("#ct-purpose").value = S.purpose || "";
      var topRG = radios($("#ct-topic"), { label:"Topic", cls:"chips", options:T.topics.map(function(t, i){ return { id:String(i), t:t }; }), value:S.topic === "own" ? "" : (S.topic || ""), onChange:function(v){ S.topic = v; changed(); } });
      radios($("#ct-form"), { label:"Form", cls:"chips", options:T.forms, value:S.form || "", onChange:function(v){ S.form = v; paintSkel(); paintPurpose(); hideLine4(); changed(); } });
      var audRG = radios($("#ct-aud"), { label:"Audience", cls:"chips", options:T.audiences.map(function(t){ return { id:t, t:t }; }), value:S.aud || "", onChange:function(v){ S.aud = v; changed(); } });
      radios($("#ct-voice"), { label:"Voice", cls:"chips", options:T.voices, value:S.voice || "", onChange:function(v){ S.voice = v; changed(); } });
      S.drafts = Array.isArray(S.drafts) ? S.drafts : [];
      draftWorkspace($("#ct-open"), { id:"open", label:T.opening.label + " (" + T.opening.min + "–" + T.opening.max + " words)", min:T.opening.min, max:T.opening.max, get:function(){ return S.opening; }, set:function(v){ S.opening = v; }, drafts:function(){ return S.drafts; }, onChange:changed });
      paintSkel(); paintPurpose();
      inp.addEventListener("input", function(e){
        var t = e.target;
        if (t.id === "ct-topic-own") { S.topicOwn = t.value; if (t.value.trim()) { S.topic = "own"; topRG.set(""); } }
        else if (t.id === "ct-aud-own") { S.audOwn = t.value; if (t.value.trim() && S.aud) { S.aud = ""; audRG.set(""); } }
        else if (t.id === "ct-purpose") { S.purpose = t.value; paintPurpose(); }
        else if (t.dataset.slot) { var sl = slotsOf(S, S.form); if (t.dataset.box != null) { var arr = Array.isArray(sl[t.dataset.slot]) ? sl[t.dataset.slot] : ["", "", ""]; arr[+t.dataset.box] = t.value; sl[t.dataset.slot] = arr; } else sl[t.dataset.slot] = t.value; }
        else return;
        changed();
      });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ a.update(); paintPv(); });
      var ck = $("#task-checks"); if (ck) new MutationObserver(hideLine4).observe(ck, { childList:true });
      $("#task-check").addEventListener("click", function(){ setTimeout(paintPv, 0); });
      paintPv(); setTimeout(hideLine4, 0);
    },
    read:function(){ return data(api ? api.S : MV.taskState().app); },
    valid:function(d){ return d.form ? true : "Choose a form first."; },
    checks:checks,
    tips:function(d, r){ var ap = applicable(d); return T.checks.map(function(_, i){ if (r[i] || !ap[i]) return null; return i === 1 && d.form ? T.tips[1] + " For " + d.formT + ": " + T.purposeShow[d.form] + "." : T.tips[i]; }).filter(Boolean); },
    key:function(d){ return d.form; }, label:function(k){ return FT(k); }, text:function(k){ return FT(k); },
    summary:function(ts){
      var S = ts.app || {}, d = data(S), r = checks(d), ap = applicable(d), tot = ap.filter(Boolean).length, met = r.filter(function(x, i){ return x && ap[i]; }).length, L = [];
      L.push((T.summary || "Choose your form") + ": " + (met === tot ? "complete" : "in progress") + " (checklist " + met + "/" + tot + ")");
      L.push("  Topic: " + (d.topic || "(not chosen)"));
      L.push("  Form: " + (d.formT || "(not chosen)"));
      L.push("  Audience: " + (d.aud || "(not chosen)"));
      L.push("  Voice: " + (d.voice ? (d.voice === "first" ? "First person" : "Third person") : "(not chosen)"));
      L.push("  Purpose: " + (d.purpose.trim() || "(not written yet)"));
      L.push("  Skeleton:");
      if (d.bones.length) d.bones.forEach(function(b){ L.push("    " + b.t + ": " + (b.v || "(empty)")); }); else L.push("    (no form chosen)");
      L.push("  Opening paragraph (" + wc(d.opening) + " words):");
      L.push("    " + (d.opening.trim() || "(not written yet)"));
      if ((ts.found || []).length) L.push("  Forms tried: " + ts.found.map(FT).join(", "));
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
  if (ap && !$("#ef-artn")) {
    var n = document.createElement("p"); n.id = "ef-artn"; n.className = "tiny muted"; n.setAttribute("aria-live", "polite"); ap.parentNode.appendChild(n);
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
  onShow:function(v){ MV.eng.stop(); if (EX) EX.stop(); if (v !== "start" && HR.stop) HR.stop(); }
});
})();
