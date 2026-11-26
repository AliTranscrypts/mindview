// ENG4U 09 The Tragic Hero & Aristotelian Form: hero (Butcher's definition breaks into pieces over a tragic arc), Tragic arc
// builder (Explore, E9 structure map: scene cards on Freytag's stages with a tension graph; Aristotle's terms; evidence board),
// Debating the flaw (Part 3: critics' table + E7 thesis forge), Spot the Error (K13) and "A claim about the flaw" (E17 draft
// workspace, quotation inserter, E6 plan slots, counter/answer tags). Texts in content.mjs (Butcher's Poetics, Globe Hamlet).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function wc(s){ return MV.eng.wordCount(s || ""); }
function has(a, x){ return a.indexOf(x) >= 0; }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }

// ---------- @component radioGroup (copied from ENG4U 08; no option needs to be checked) ----------
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
var VOICE = null, voiceCbs = [];
function voiceReady(fn){ if (fn) voiceCbs.push(fn); MV.eng.voice(function(v){ VOICE = v; var c = voiceCbs; voiceCbs = []; c.forEach(function(f){ try { f(v); } catch (e) { console.error(e); } }); }); }
// read chunks in turn with a pause after each (300 ms after a semicolon); returns a token whose .stop() cancels
function readChunks(chunks, onChunk, onDone){
  var tok = { stopped:false, stop:function(){ tok.stopped = true; MV.eng.stop(); } }, i = 0;
  function next(){
    if (tok.stopped) return;
    if (i >= chunks.length || !VOICE) { if (onChunk) onChunk(-1); if (onDone) onDone(); return; }
    var k = i++; if (onChunk) onChunk(k);
    MV.eng.say(chunks[k], { voice:VOICE, onEnd:function(){ if (tok.stopped) return; setTimeout(next, /;\s*$/.test(chunks[k]) ? 300 : 120); } });
  }
  next();
  return tok;
}

// ---------- hero: Butcher's definition breaks into labelled pieces; a tragic arc draws behind them, peak marked "the turn" ----------
var HR = { run:0, tok:null };
function hero(){
  var H = MV.C.hero, host = $("#th-hero"); if (!host) return;
  host.innerHTML = '<blockquote class="th-hp">' + H.phrases.map(function(p, i){ return '<span class="th-ph" data-ph="' + i + '">' + esc(p) + "</span>"; }).join(" ") + '</blockquote><p class="eng-cite">' + H.cite + "</p>" +
    '<div class="th-hfig"><svg class="th-harc" viewBox="0 0 320 170" aria-hidden="true" focusable="false"><path class="th-arcp" pathLength="100" d="M6 164 C 70 160, 118 40, 160 24 S 252 156, 314 164"/></svg>' +
    '<span class="th-peak" aria-hidden="true"><i></i>' + esc(H.turn) + '</span><ol class="th-pieces">' + H.pieces.map(function(p, i){ return '<li class="th-pc" data-pc="' + i + '">' + esc(p.t) + "</li>"; }).join("") + "</ol></div>" +
    '<p class="th-hcap">' + H.caption + '</p><div class="th-hctl"><button type="button" class="btn ghost sm" id="th-hlisten" hidden>' + H.listen + '</button><button type="button" class="btn ghost sm" id="th-hagain" hidden>' + H.watch + '</button><span class="tiny muted" id="th-hnote" hidden>' + H.noVoice + "</span></div>";
  var PH = $$(".th-ph", host), PC = $$(".th-pc", host);
  function lit(n, speak){ PH.forEach(function(e, i){ e.classList.toggle("lit", i <= n); e.classList.toggle("speaking", !!speak && i === n); }); PC.forEach(function(e, i){ e.classList.toggle("on", H.pieces[i].p <= n); }); }
  function reset(){ host.classList.remove("arc", "peak", "cap-on"); host.classList.add("anim"); lit(-1); }
  function finish(){ host.classList.remove("anim"); host.classList.add("arc", "peak", "cap-on"); lit(H.phrases.length - 1); PH.forEach(function(e){ e.classList.remove("speaking"); }); btns(); }
  function at(me, ms, fn){ setTimeout(function(){ if (me === HR.run) fn(); }, ms); }
  function animate(){
    var me = ++HR.run; stopRead(); reset();
    H.phrases.forEach(function(_, i){ at(me, 200 + i * 650, function(){ lit(i, true); }); });
    at(me, 2900, function(){ lit(H.phrases.length - 1); host.classList.add("arc"); });
    at(me, 3900, function(){ host.classList.add("peak"); });
    at(me, 4500, finish);
  }
  function stopRead(){ if (HR.tok) { HR.tok.stop(); HR.tok = null; } }
  function listen(){
    var me = ++HR.run; stopRead();
    if (MV.reduceMotion) finish(); else reset();
    HR.tok = readChunks(H.phrases, function(k){ if (me !== HR.run) return; if (k >= 0) { lit(k, true); if (k === H.phrases.length - 1) host.classList.add("arc"); } }, function(){ HR.tok = null; if (me === HR.run) finish(); });
  }
  function btns(){ $("#th-hlisten").hidden = !VOICE; $("#th-hagain").hidden = MV.reduceMotion; $("#th-hnote").hidden = !!VOICE; }
  $("#th-hlisten").addEventListener("click", listen);
  $("#th-hagain").addEventListener("click", animate);
  if (MV.reduceMotion) finish(); else animate();
  voiceReady(btns);
  HR.stop = function(){ stopRead(); if (host.classList.contains("anim")) { HR.run++; finish(); } };
}

// ---------- @component E9 structureMap (scene-map form) — scene cards placed on Freytag's six stages (tap a card, then a
// stage), a tension graph from fixed per-card values that follows the order of the stages, a consistency checker
// (everything before the climax rises, everything after falls) and a text description of the curve. Data: content.explore. ----------
var EX = null;
function explore(host, api){
  var C = api.content, S = api.S, CARDS = C.cards, ST = C.stages, BANK = C.bank, RD = C.readings;
  S.mode = S.mode || "arc"; S.place = S.place || {}; S.ev = S.ev || {}; S.mk = S.mk || {};
  var sel = "", term = "", fx = {}, opening = { run:0 };
  function stIdx(id){ for (var i = 0; i < ST.length; i++) if (ST[i].id === id) return i; return -1; }
  function cIdx(id){ for (var i = 0; i < CARDS.length; i++) if (CARDS[i].id === id) return i; return -1; }
  function stName(id){ var s = byId(ST, id); return s ? s.t : ""; }
  function placed(){ return CARDS.filter(function(c){ return !!S.place[c.id]; }); }
  function order(){ return placed().slice().sort(function(a, b){ return (stIdx(S.place[a.id]) - stIdx(S.place[b.id])) || (cIdx(a.id) - cIdx(b.id)); }); }
  function climaxes(){ return CARDS.filter(function(c){ return S.place[c.id] === "climax"; }); }

  host.innerHTML = '<div class="th-ex"><div id="th-mode"></div><p class="how th-how" id="th-how"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="th-main" data-mv="graph" id="th-main"></div><dl class="read th-read" id="th-read" aria-live="polite"></dl></div>';
  var modeRG = radios($("#th-mode", host), { label:"Mode", options:C.modes, value:S.mode, onChange:function(v){ setMode(v); } });
  function setMode(v){ stopFx(); MV.banner("", ""); S.mode = v; modeRG.set(v); sel = ""; term = ""; api.save(); paint(); MV.changed(); }

  // ----- Arc mode -----
  function cardBtn(c, where){
    var down = fx.down && !(fx.up && has(fx.up, c.id)), fade = fx.p1 && has(["S7", "S8", "S9"], c.id), dim = fx.p4 && c.sol;
    var cls = "th-card" + (sel === c.id ? " sel" : "") + (fx.hi === c.id ? " hi" : "") + (fade ? " fade" : "") + (dim ? " dim" : "") + (down ? " down" : "") + (fx.drop === c.id ? " drop" : "");
    var lab = down ? '<span class="th-sc">?</span><span class="th-ct">Scene card</span>' : '<span class="th-sc">' + c.sc + '</span><span class="th-ct">' + c.t + "</span>" + (dim ? '<span class="th-cut">soliloquy cut</span>' : "");
    return '<button type="button" class="' + cls + '" data-card="' + c.id + '" data-k="c' + c.id + where + '" aria-pressed="' + (sel === c.id) + '"' + (down ? ' aria-label="Scene card, face down"' : "") + ">" + lab + "</button>";
  }
  function arcHTML(){
    var tray = CARDS.filter(function(c){ return !S.place[c.id]; });
    var h = '<div class="th-tray" role="group" aria-label="Scene cards not yet placed">' + (tray.length ? tray.map(function(c){ return cardBtn(c, "t"); }).join("") : '<span class="tiny muted">All nine cards are on the arc.</span>') +
      (sel && S.place[sel] ? '<button type="button" class="btn ghost sm" data-unplace="1" data-k="unplace">Take ' + sel + " off the arc</button>" : "") + "</div>";
    h += '<div class="th-pyr" role="group" aria-label="Freytag’s pyramid: six stages">' + ST.map(function(s){
      var inside = order().filter(function(c){ return S.place[c.id] === s.id; });
      return '<div class="th-stage h' + s.h + (inside.length ? " on" : "") + '"><button type="button" class="th-bin" data-bin="' + s.id + '" data-k="b' + s.id + '"' + (sel ? "" : ' aria-disabled="true"') + ">" + s.t + ' <span class="tiny">(' + inside.length + ")</span></button>" +
        '<div class="th-in">' + inside.map(function(c){ return cardBtn(c, "p"); }).join("") + "</div></div>";
    }).join("") + "</div>";
    if (fx.p3) h += '<p class="th-dir' + (fx.p3 === 2 ? " flip" : "") + '" aria-live="polite"><span class="th-arrow" aria-hidden="true">' + (fx.p3 === 2 ? "⇄" : "→") + "</span> <strong>" + (fx.p3 === 2 ? C.dir.after : C.dir.before) + "</strong>" + (fx.p3 === 2 ? '<span class="tiny">' + C.dir.notes + "</span>" : "") + "</p>";
    return h + '<div class="th-graph">' + graphSVG() + "</div>";
  }
  function graphSVG(){
    var L = order(), n = CARDS.length, x0 = 28, x1 = 312, y0 = 132, sy = 11.5, pts = [], cl = climaxes();
    function X(i){ return x0 + i * (x1 - x0) / (n - 1); }
    L.forEach(function(c, i){ pts.push({ c:c, x:X(i), y:y0 - c.ten * sy }); });
    var g = '<line class="th-ax" x1="' + x0 + '" y1="' + y0 + '" x2="' + x1 + '" y2="' + y0 + '"/><text class="th-axl" x="4" y="14">Tension</text>';
    var d = "", fade = "";
    pts.forEach(function(p, i){
      var f = fx.p1 && has(["S7", "S8", "S9"], p.c.id);
      if (!f) d += (d ? "L" : "M") + p.x.toFixed(1) + " " + p.y.toFixed(1) + " ";
      else fade += (fade ? "L" : "M" + pts[i - 1].x.toFixed(1) + " " + pts[i - 1].y.toFixed(1) + " L") + p.x.toFixed(1) + " " + p.y.toFixed(1) + " ";
    });
    if (fx.p1 && pts.length) { var last = pts.filter(function(p){ return !has(["S7", "S8", "S9"], p.c.id); }).pop(); if (last) d += "L" + (last.x + 6).toFixed(1) + " " + y0 + " "; }
    if (fade) g += '<path class="th-curve faded" d="' + fade + '"/>';
    if (d) g += '<path class="th-curve' + (fx.p1 ? " cliff" : "") + '" d="' + d + '"/>';
    if (fx.spark) g += '<path class="th-spark" d="M' + X(0) + " " + (y0 - 1.5 * sy) + " L" + X(1) + " " + (y0 - 3 * sy) + " L" + X(4) + " " + (y0 - 9.6 * sy) + '"/><text class="th-q" x="' + X(4) + '" y="' + (y0 - 9.6 * sy - 6) + '">?</text>';
    pts.forEach(function(p){
      var isC = cl.length === 1 && cl[0].id === p.c.id, f = fx.p1 && has(["S7", "S8", "S9"], p.c.id);
      g += '<circle class="th-dot' + (isC ? " turn" : "") + (f ? " faded" : "") + '" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + (isC ? 5.5 : 3.6) + '"/>';
      g += '<text class="th-xl' + (f ? " faded" : "") + '" x="' + p.x.toFixed(1) + '" y="' + (y0 + 13) + '">' + esc(p.c.sc.replace("Act ", "A")) + "</text>";
      if (isC) g += '<text class="th-tl" x="' + p.x.toFixed(1) + '" y="' + (p.y - 10).toFixed(1) + '">turn</text>';
    });
    return '<svg class="th-svg" viewBox="0 0 320 150" role="img" aria-label="' + esc(describe()) + '">' + g + "</svg>";
  }
  function peak(){ var L = order(); if (!L.length) return null; return L.reduce(function(m, c){ return c.ten > m.ten ? c : m; }, L[0]); }
  function describe(){
    var L = order(); if (!L.length) return "Tension graph: no cards placed yet.";
    var p = peak(), after = L.slice(L.indexOf(p) + 1).map(function(c){ return c.sc; });
    if (fx.p1) return "Tension graph: the curve rises to 3.3, then drops off a cliff; 3.4, Act 4 and 5.2 fade.";
    return "Tension graph of " + L.length + " cards in stage order: peak at " + p.sc + (after.length ? "; falls through " + after.join(", ") : "") + ".";
  }
  function consistency(){
    var cl = climaxes();
    if (!placed().length) return "Place cards to test consistency.";
    if (!cl.length) return "Choose a climax to test consistency.";
    if (cl.length > 1) return "Two climaxes: choose one turn.";
    var ci = cIdx(cl[0].id), bad = null;
    placed().forEach(function(c){
      if (bad || c.id === cl[0].id) return;
      var k = cIdx(c.id), s = S.place[c.id];
      if (k < ci && (s === "fall" || s === "cat")) bad = c.id + " is before your climax but marked “" + (s === "fall" ? "falling" : "catastrophe") + "”";
      if (k > ci && (s === "exp" || s === "inc" || s === "rise")) bad = c.id + " is after your climax but marked “" + (s === "rise" ? "rising" : stName(s).toLowerCase()) + "”";
    });
    return bad ? "✗ " + bad + "." : "✓ Everything before your climax rises; everything after falls.";
  }
  function arcOK(){ return !!tc1().ok; }
  function fit(){
    var any = placed().length || Object.keys(S.ev).length; if (!any) return "Place cards and terms to test the fit.";
    var rev = S.ev.a === "peri", rec = S.ev.b === "anag", parts = [];
    if (arcOK()) parts.push("a complete action, with a beginning, a middle and an end");
    if (rev && rec) parts.push("reversal and recognition both present"); else if (rev) parts.push("a reversal"); else if (rec) parts.push("a recognition");
    return (parts.length ? "Strong: " + parts.join("; ") + ". " : "") + "Unusual: the hero delays for two acts.";
  }

  // ----- Terms mode -----
  function termsHTML(){
    var h = "";
    if (fx.quote) {
      var q = C.quotes[fx.quote];
      if (fx.quote === "p2") q = q.replace("some error or frailty", fx.swap ? '<del>some error or frailty</del> <ins>' + C.quotes.p2swap + "</ins>" : "<mark>some error or frailty</mark>");
      h += '<blockquote class="th-q2">' + q + "</blockquote>";
      if (fx.quote === "p2") h += '<div class="th-pity"><span>Pity</span><span class="th-meter" role="img" aria-label="Pity meter ' + Math.round(fx.pity == null ? 100 : fx.pity) + ' percent"><i style="width:' + (fx.pity == null ? 100 : fx.pity) + '%"></i></span></div>';
    }
    if (fx.p4s) h += '<div class="th-strip" role="img" aria-label="' + (fx.p4 ? "The arc of nine scenes stays intact while the soliloquy cards dim." : "The arc of nine scenes.") + '">' + CARDS.map(function(c){ return '<span class="th-mini' + (fx.p4 && c.sol ? " dim" : "") + '">' + c.sc + (fx.p4 && c.sol ? "<small>soliloquy</small>" : "") + "</span>"; }).join("") + "</div>";
    h += '<div class="th-terms" role="group" aria-label="Term chips">' + C.terms.map(function(t){ return '<button type="button" class="th-term' + (term === t.id ? " sel" : "") + '" data-term="' + t.id + '" data-k="t' + t.id + '" aria-pressed="' + (term === t.id) + '">' + t.t + "</button>"; }).join("") + "</div>";
    h += '<ol class="th-events">' + C.events.map(function(e){
      var t = S.ev[e.id], tt = t ? byId(C.terms, t).t : "";
      return '<li><span class="th-elab" aria-hidden="true">' + e.id + '</span><span class="th-etext">' + e.t + '</span><button type="button" class="th-slot' + (t ? " full" : "") + '" data-ev="' + e.id + '" data-k="e' + e.id + '" aria-label="Event ' + e.id + ": " + (t ? tt + ". Tap to " + (term ? "replace" : "remove") : "no term yet") + '">' + (t ? tt : term ? "Place it here" : "No term yet") + "</button></li>";
    }).join("") + "</ol>";
    return h;
  }
  function says(){
    var out = [];
    Object.keys(C.termKey).forEach(function(k){ if (S.ev[k] === C.termKey[k]) out.push(C.says[S.ev[k]]); });
    if (S.ev.a === "ham" && S.ev.e === "ham") out.push(C.bothErrors);
    return out.length ? out.map(function(s){ return "<span class='th-say'>" + s + "</span>"; }).join("") : "Place a term to hear what Aristotle would say.";
  }

  // ----- Evidence board -----
  function count19(){ return RD.reduce(function(sum, r){ var s = BANK.filter(function(b){ return has(b.s, r.id); }).length, c = BANK.filter(function(b){ return has(b.c, r.id); }).length; return sum + s * (s - 1) / 2 * c; }, 0); }
  function rname(id){ var r = byId(RD, id); return r ? r.name : ""; }
  function boardHTML(){
    var tags = S.tags && MV.S.chal.tc3 && MV.S.chal.tc3.solved;
    var h = '<div id="th-rd" class="th-rd"></div><ul class="th-bank">' + BANK.map(function(b){
      var m = S.mk[b.id] || "";
      return '<li class="th-line' + (m ? " m-" + m : "") + '"><p><span class="th-lid">' + b.id + "</span> “" + b.t + "” <span class=\"th-ref\">" + (b.who ? b.who + ", " : "") + "(" + b.ref + ")</span></p>" +
        (tags ? '<p class="tiny th-tags">Supports ' + (b.s.join(", ") || "—") + " · Complicates " + (b.c.join(", ") || "—") + "</p>" : "") +
        '<span class="th-mk"><button type="button" class="th-mkb" data-mk="' + b.id + ':s" data-k="ms' + b.id + '" aria-pressed="' + (m === "s") + '">Supports</button><button type="button" class="th-mkb" data-mk="' + b.id + ':c" data-k="mc' + b.id + '" aria-pressed="' + (m === "c") + '">Counter</button></span></li>';
    }).join("") + "</ul>";
    h += '<p class="tiny muted">This board allows ' + count19() + " strong cases in all." + (MV.S.chal.tc3 && MV.S.chal.tc3.solved ? ' <button type="button" class="linkbtn" data-tags="1" data-k="tags">' + (tags ? "Hide" : "Show") + " each line’s tags</button>" : " Each line’s tags appear here once you’ve made your case.") + "</p>";
    return h;
  }

  function readout(){
    var R = C.readout, rows = [];
    if (S.mode === "arc") {
      var cl = climaxes(), filled = ST.filter(function(s){ return CARDS.some(function(c){ return S.place[c.id] === s.id; }); }).length, p = peak();
      rows.push([R.stage, filled + " of 6 stages · " + (cl.length ? "Climax: " + cl.map(function(c){ return c.id + " (" + c.sc + ")"; }).join(", ") : "Climax: not chosen")]);
      rows.push([R.cons, consistency()]);
      rows.push([R.ten, p ? "Peak at " + p.sc + (cl.length === 1 ? " · your turn: " + cl[0].sc + (cl[0].read ? ", “" + cl[0].read + "”" : "") : "") : "—"]);
    } else if (S.mode === "terms") rows.push([R.says, says()]);
    else {
      var sup = Object.keys(S.mk).filter(function(k){ return S.mk[k] === "s"; }), cou = Object.keys(S.mk).filter(function(k){ return S.mk[k] === "c"; });
      rows.push([R.reading, S.reading ? S.reading + " · " + rname(S.reading) : "not chosen"]);
      rows.push([R.cas, "Supports: " + (sup.join(", ") || "—") + " · Counter: " + (cou.join(", ") || "—")]);
    }
    rows.push([R.fit, fit()]);
    var h = MV.readoutHTML(rows);
    if (S.mode === "arc" && arcOK()) h += '<p class="th-aha">' + C.aha + "</p>";
    return h;
  }
  var rgRead = null;
  function paint(){
    $("#th-how", host).innerHTML = C.how[S.mode];
    var m = $("#th-main", host);
    MV.keepFocus(m, function(){ m.className = "th-main th-m-" + S.mode; m.innerHTML = S.mode === "arc" ? arcHTML() : S.mode === "terms" ? termsHTML() : boardHTML(); });
    if (S.mode === "board") rgRead = radios($("#th-rd", host), { label:"Reading", cls:"chips", options:RD.map(function(r){ return { id:r.id, t:"<strong>" + r.id + "</strong> " + r.t + (r.sub ? " <small>(" + r.sub + ")</small>" : "") }; }), value:S.reading || "", onChange:function(v){ S.reading = v; api.save(); paintRead(); MV.changed(); } });
    paintRead();
  }
  function paintRead(){ $("#th-read", host).innerHTML = readout(); }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || !host.contains(b)) return;
    if (b.dataset.card) { var id = b.dataset.card; if (fx.down) return; sel = sel === id ? "" : id; paint(); return; }
    if (b.dataset.bin) { if (!sel) { MV.banner("", "Tap a scene card first, then tap its stage."); return; } stopFx(); S.place[sel] = b.dataset.bin; sel = ""; api.save(); paint(); MV.changed(); return; }
    if (b.dataset.unplace) { delete S.place[sel]; sel = ""; api.save(); paint(); MV.changed(); return; }
    if (b.dataset.term) { term = term === b.dataset.term ? "" : b.dataset.term; paint(); return; }
    if (b.dataset.ev) { stopFx(); if (term) { S.ev[b.dataset.ev] = term; term = ""; } else delete S.ev[b.dataset.ev]; api.save(); paint(); MV.changed(); return; }
    if (b.dataset.mk) { var p = b.dataset.mk.split(":"); S.mk[p[0]] = S.mk[p[0]] === p[1] ? "" : p[1]; if (!S.mk[p[0]]) delete S.mk[p[0]]; api.save(); paint(); MV.changed(); return; }
    if (b.dataset.tags) { S.tags = !S.tags; api.save(); paint(); }
  });
  // "Set it up" buttons in the challenge prompts
  document.addEventListener("click", function(e){
    var b = e.target.closest(".th-setup"); if (!b) return;
    if (S.mode !== b.dataset.setup) setMode(b.dataset.setup);
    var g = $("#th-main", host); if (g) g.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
  });

  function stopFx(){ opening.run++; if (Object.keys(fx).length) { fx = {}; if (EX) EX.busy = false; } }
  function runOpening(){
    if (placed().length) return;
    var me = ++opening.run;
    function at(ms, fn){ MV.wait(ms, function(){ if (me === opening.run) fn(); }); }
    function end(){ fx = {}; S.place.S2 = S.place.S2 || "inc"; api.save(); paint(); MV.banner("", C.opening.banner); MV.changed(); }
    if (MV.reduceMotion) { end(); fx.spark = true; paint(); return; }
    S.mode = "arc"; modeRG.set("arc"); fx = { down:true, fan:true }; host.classList.add("th-fan"); paint();
    at(900, function(){ fx.up = ["S2"]; fx.drop = "S2"; S.place.S2 = "inc"; api.save(); paint(); });
    at(1800, function(){ fx.spark = true; paint(); });
    at(2600, function(){ MV.banner("", C.opening.banner); });
    at(3600, function(){ host.classList.remove("th-fan"); fx = { spark:true }; paint(); MV.changed(); });
  }
  paint();

  EX = {
    shown:function(){ if (!S.seenOpen) { S.seenOpen = true; api.save(); runOpening(); } },
    stop:function(){ stopFx(); host.classList.remove("th-fan"); paint(); },
    predict:{
      start:function(p){
        stopFx(); host.classList.remove("th-fan");
        var st = p.start || {}; S.mode = st.mode; modeRG.set(st.mode); sel = ""; term = "";
        if (st.full) S.place = JSON.parse(JSON.stringify(C.full));
        fx = {}; if (st.hi) fx.hi = st.hi; if (st.quote) fx.quote = st.quote;
        if (p.id === "p3") fx.p3 = 1;
        if (p.id === "p4") fx.p4s = true;
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        if (p.id === "p1") { MV.wait(250, function(){ fx.p1 = true; paint(); MV.wait(1500, done); }); }
        else if (p.id === "p2") {
          MV.wait(300, function(){
            fx.swap = true; fx.pity = 100; paint();
            MV.tween({ dur:1400, step:function(t){ fx.pity = 100 * (1 - t); var i = $(".th-meter i", host); if (i) i.style.width = fx.pity + "%"; var m = $(".th-meter", host); if (m) m.setAttribute("aria-label", "Pity meter " + Math.round(fx.pity) + " percent"); }, done:function(){ fx.pity = 0; paint(); MV.wait(300, done); } });
          });
        }
        else if (p.id === "p3") { MV.wait(300, function(){ fx.p3 = 2; paint(); MV.wait(1500, done); }); }
        else if (p.id === "p4") { MV.wait(300, function(){ fx.p4 = true; paint(); MV.wait(1400, done); }); }
        else done();
      }
    },
    challenge:function(id){
      if (id === "tc1") return tc1();
      if (id === "tc2") return tc2();
      if (id === "tc3") return tc3();
      return { ok:false };
    }
  };
  function msg(id, k){ return byId(C.challenges, id).msgs[k]; }
  function tc1(){
    var P = S.place;
    if (CARDS.some(function(c){ return !P[c.id]; })) return { ok:false, msg:msg("tc1", "unplaced") };
    var cl = climaxes();
    if (P.S9 === "climax") return { ok:false, msg:msg("tc1", "s9") };
    if (cl.length > 1) return { ok:false, msg:msg("tc1", "two") };
    if (P.S8 !== "fall") return { ok:false, msg:msg("tc1", "s8") };
    if (P.S1 !== "exp" || P.S2 !== "inc" || P.S9 !== "cat" || cl.length !== 1 || !has(["S5", "S6", "S7"], cl[0].id)) return { ok:false };
    var ci = cIdx(cl[0].id);
    for (var k = 2; k < 8; k++) { if (k === ci) continue; if (P[CARDS[k].id] !== (k < ci ? "rise" : "fall")) return { ok:false }; }
    return { ok:true };
  }
  function tc2(){
    var E = S.ev, K = C.termKey, ids = Object.keys(K);
    if (ids.every(function(k){ return E[k] === K[k]; })) return { ok:true };
    if (E.a === "ham" && E.e === "ham" && E.b === "anag" && E.c === "cath" && E.d === "mim") return { ok:true };
    if (E.b === "peri") return { ok:false, msg:msg("tc2", "b") };
    if (E.c === "ham") return { ok:false, msg:msg("tc2", "c") };
    if (ids.some(function(k){ return !E[k]; })) return { ok:false, msg:msg("tc2", "unplaced") };
    return { ok:false };
  }
  function tc3(){
    var r = S.reading, sup = Object.keys(S.mk).filter(function(k){ return S.mk[k] === "s"; }), cou = Object.keys(S.mk).filter(function(k){ return S.mk[k] === "c"; });
    if (!r || sup.length !== 2 || cou.length !== 1) return { ok:false, msg:msg("tc3", "count") };
    var badS = sup.filter(function(id){ return !has(byId(BANK, id).s, r); })[0];
    if (badS) return { ok:false, msg:msg("tc3", "other").replace("{r}", byId(BANK, badS).s.map(rname).join(" and ")) };
    var c = byId(BANK, cou[0]);
    if (has(c.s, r)) return { ok:false, msg:msg("tc3", "helps") };
    if (!has(c.c, r)) return { ok:false, msg:msg("tc3", "flat") };
    return { ok:true };
  }
  return EX;
}

// ---------- Part 3: Debating the flaw — critics' table ("Check it with the text") + @component E7 thesisForge (stance chip,
// reading chip or "my own" label, two lines from the evidence bank, a "why" slot; rule-based flags) ----------
var LINES = null;
function lineById(id){ if (!LINES) LINES = MV.C.task.bank; return byId(LINES, id); }
function qLine(b){ return "“" + b.t + "” " + (b.who ? "(" + b.who + ", " : "(") + b.ref + ")"; }
function forgeParts(F){
  var P = MV.C.part3, FG = P.forge; F = F || {};
  var st = byId(FG.stances, F.stance || ""), cr = byId(P.critics, F.critic || ""), rd = F.reading === "own" ? String(F.own || "").trim() : (byId(MV.C.explore.readings, F.reading || "") || {}).name || "";
  var L = (F.lines || []).map(lineById).filter(Boolean), why = String(F.why || "").trim().replace(/[.\s]+$/, "");
  return { st:st, cr:cr, rd:rd, L:L, why:why, nWhy:wc(why) };
}
function forgeText(F, html){
  var p = forgeParts(F), I = html ? function(s){ return s; } : MV.plain;
  if (!p.st && !p.cr && !p.rd && !p.L.length && !p.why) return "";
  var lead = (p.st ? p.st.lead : "[stance]") + " " + (p.cr ? MV.plain(p.cr.n) : "[critic]") + ", I argue that in Shakespeare’s " + I("<i>Hamlet</i>") + " the hero’s hamartia is " + (p.rd || "[reading]");
  var how = p.L.length ? ": " + p.L.map(function(b){ return "“" + b.t + "” (" + b.ref + ")"; }).join(" and ") + (p.L.length > 1 ? " show it" : " shows it") : ": [two lines] show it";
  var why = p.why ? "; it matters " + (/^because\b/i.test(p.why) ? "" : "because ") + p.why : "; it matters because [why]";
  return lead + how + why + ".";
}
function forgeChecks(F){
  var FG = MV.C.part3.forge, p = forgeParts(F), any = !!forgeText(F);
  var vague = F && F.reading === "own" && (wc(p.rd) < 2 || p.rd.toLowerCase().split(/\s+/).every(function(w){ return has(FG.vagueWords, w.replace(/[^a-z]/g, "")); }));
  var c = [any, !!(p.st && p.cr), p.L.length === 2, p.nWhy >= 8 && p.nWhy <= 25];
  var flags = []; if (any) { if (!c[1]) flags.push(FG.flags.fact); if (vague) flags.push(FG.flags.vague); if (!c[2]) flags.push(FG.flags.how); if (!c[3]) flags.push(FG.flags.why); }
  return { c:c, flags:flags, ok:any && c.every(Boolean) && !vague && !!p.rd };
}
function part3(host, api){
  var P = api.content, S = api.S, FG = P.forge; S.forge = S.forge || { lines:[] }; var F = S.forge;
  var h = '<div class="th-critics">' + P.critics.map(function(c){
    return '<article class="th-critic"><h4>' + c.n + ' <small>' + c.src + '</small></h4><p><span class="an-tag an-theme">Position</span> ' + c.pos + "</p>" +
      '<details class="alg"><summary>' + P.checkLabel + '</summary><p class="tiny muted">' + P.checkHow + "</p><ul class=\"th-cl\">" + c.lines.map(function(id){ var b = lineById(id); return "<li>" + qLine(b) + "</li>"; }).join("") + "</ul></details></article>";
  }).join("") + "</div>";
  h += '<div class="th-forge"><h4 class="th-h">Thesis forge</h4><p class="tiny muted">Join the conversation: take a stance toward one critic, name a reading, choose two lines and say why it matters.</p>' +
    '<div id="tf-st" class="th-row"></div><div id="tf-cr" class="th-row"></div><div id="tf-rd" class="th-row"></div>' +
    '<div class="jq" id="tf-ownw"><label for="tf-own">' + FG.ownLabel + '</label><input id="tf-own" class="txtin" type="text" autocomplete="off"></div>' +
    '<p class="rg-lab">Two lines from the evidence bank</p><div class="th-lpick" id="tf-lines" role="group" aria-label="Two lines from the evidence bank"></div>' +
    '<div class="jq"><label for="tf-why">' + FG.whyLabel + '</label><input id="tf-why" class="txtin" type="text" autocomplete="off" placeholder="' + esc(FG.whyPh) + '"><span class="tiny muted" id="tf-whyn" aria-live="polite"></span></div>' +
    '<p class="th-thesis" id="tf-out" aria-live="polite"></p><ul class="th-checks" id="tf-checks" aria-live="polite"></ul></div>';
  host.innerHTML = h;
  radios($("#tf-st", host), { label:"Stance", cls:"chips", options:FG.stances, value:F.stance || "", onChange:function(v){ F.stance = v; upd(); } });
  radios($("#tf-cr", host), { label:"Critic", cls:"chips", options:P.critics.map(function(c){ return { id:c.id, t:c.n }; }), value:F.critic || "", onChange:function(v){ F.critic = v; upd(); } });
  radios($("#tf-rd", host), { label:"Reading", cls:"chips", options:MV.C.explore.readings.map(function(r){ return { id:r.id, t:r.id + " " + r.t }; }).concat([FG.own]), value:F.reading || "", onChange:function(v){ F.reading = v; upd(); } });
  $("#tf-own", host).value = F.own || ""; $("#tf-why", host).value = F.why || "";
  function lines(){
    var el = $("#tf-lines", host);
    MV.keepFocus(el, function(){ el.innerHTML = MV.C.explore.bank.map(function(b){ var on = has(F.lines, b.id); return '<button type="button" class="th-lp" data-lp="' + b.id + '" data-k="lp' + b.id + '" aria-pressed="' + on + '"><span class="th-lid">' + b.id + "</span> “" + b.t + "” <span class=\"th-ref\">(" + b.ref + ")</span></button>"; }).join(""); });
  }
  function upd(){
    api.save(); $("#tf-ownw", host).hidden = F.reading !== "own";
    var n = wc(F.why || ""); $("#tf-whyn", host).textContent = n + " words (8–25)";
    var t = forgeText(F, true), k = forgeChecks(F);
    $("#tf-out", host).innerHTML = t ? "<strong>Your thesis:</strong> " + t : '<span class="muted">Choose the parts and your thesis assembles here.</span>';
    $("#tf-checks", host).innerHTML = !t ? "" : FG.checks.map(function(c, i){ return "<li class=\"" + (k.c[i] ? "ok" : "") + "\"><span aria-hidden=\"true\">" + (k.c[i] ? "✓" : "○") + "</span> " + c + "</li>"; }).join("") +
      (k.flags.length ? k.flags.map(function(f){ return '<li class="flag"><span aria-hidden="true">⚑</span> ' + f + "</li>"; }).join("") : k.ok ? '<li class="ok"><span aria-hidden="true">✓</span> ' + FG.flags.ok + "</li>" : "");
  }
  host.addEventListener("input", function(e){ if (e.target.id === "tf-own") { F.own = e.target.value; upd(); } if (e.target.id === "tf-why") { F.why = e.target.value; upd(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-lp]"); if (!b) return;
    var id = b.dataset.lp, i = F.lines.indexOf(id);
    if (i >= 0) F.lines.splice(i, 1); else { F.lines.push(id); while (F.lines.length > 2) F.lines.shift(); }
    lines(); upd();
  });
  lines(); upd();
  return {};
}

// ---------- Practice 3: @component K13 spotProse — Spot the Error for a paragraph (copied from ENG4U 08; numbered sentences) ----------
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

// ---------- @component E17 draftWorkspace (copied from ENG4U 08) — a writing area with a live word count (target range),
// saved drafts (up to 3) and a side-by-side compare with the changes marked (course plan E17) ----------
// draftWorkspace(host, {id, label, min, max, get(), set(v), drafts() -> [{n, t}], onChange()}) -> {refresh(), ta, changed()}
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
  host.innerHTML = '<div class="th-dw"><label for="dw-' + o.id + '" class="th-lab">' + o.label + '</label><textarea id="dw-' + o.id + '" class="th-dw-ta" rows="12"></textarea>' +
    '<div class="q-actions"><span class="th-dw-n" id="dw-' + o.id + '-n" aria-live="polite"></span><button type="button" class="btn ghost sm" id="dw-' + o.id + '-save">Save as a draft</button></div><div id="dw-' + o.id + '-list"></div><div id="dw-' + o.id + '-cmp" aria-live="polite"></div></div>';
  var ta = $("#dw-" + o.id, host); ta.value = o.get() || "";
  function count(){
    var n = wc(ta.value), msg = n < o.min ? (o.min - n) + " to go" : n > o.max ? (n - o.max) + " over" : "in range";
    $("#dw-" + o.id + "-n", host).innerHTML = "<strong>" + n + " word" + (n === 1 ? "" : "s") + "</strong> · aim for " + o.min + "–" + o.max + " (" + msg + ")";
  }
  function list(){
    var D = o.drafts(), el = $("#dw-" + o.id + "-list", host);
    el.innerHTML = D.length ? '<p class="tiny">Saved drafts: ' + D.map(function(d, i){ return '<button type="button" class="linkbtn" data-dwc="' + i + '" aria-pressed="' + (cmp === i) + '">Compare draft ' + d.n + " with now</button>"; }).join(" · ") + "</p>" : "";
    var cb = $("#dw-" + o.id + "-cmp", host);
    if (cmp != null && D[cmp]) { var df = diffWords(D[cmp].t, ta.value); cb.innerHTML = '<div class="th-dw-cmp"><div><p class="tiny"><strong>Draft ' + D[cmp].n + '</strong> (removed words struck through)</p><p>' + df[0] + '</p></div><div><p class="tiny"><strong>Now</strong> (new words underlined)</p><p>' + df[1] + "</p></div></div>"; }
    else cb.innerHTML = "";
  }
  function changed(){ o.set(ta.value); count(); if (cmp != null) list(); if (o.onChange) o.onChange(); }
  ta.addEventListener("input", changed);
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.id === "dw-" + o.id + "-save") { var D = o.drafts(), t = ta.value.trim(); if (!t) return; var n = D.length ? D[D.length - 1].n + 1 : 1; D.push({ n:n, t:t }); while (D.length > 3) D.shift(); cmp = null; MV.save(); list(); return; }
    if (b.dataset.dwc != null) { var i = +b.dataset.dwc; cmp = cmp === i ? null : i; list(); }
  });
  count(); list();
  return { refresh:function(){ ta.value = o.get() || ""; count(); list(); }, ta:ta, changed:changed };
}

// ---------- argument checks (structure only) ----------
function sentences(t){
  var s = String(t || "").replace(/\s+/g, " ").trim(); if (!s) return [];
  var out = [], re = /[.!?]+[”’"')\]]*\s+(?=[“"‘']?[A-Z])/g, last = 0, m;
  while ((m = re.exec(s))) { var end = m.index + m[0].length; out.push(s.slice(last, end).trim()); last = end; }
  if (last < s.length) out.push(s.slice(last).trim());
  return out.filter(Boolean);
}
function skey(s){ return MV.eng.norm(s); }
// quotations in double quotation marks followed by a parenthetical citation with act.scene.line -> ["3.1", "3.4", …]
function citedScenes(t){
  var s = String(t || ""), out = [], m, re = /[“"]([^“”"]{2,})[”"]\s*\(([^()]*?)(\d+)\.(\d+)\.\d+[^()]*\)/g;
  while ((m = re.exec(s))) out.push(m[3] + "." + m[4]);
  return out;
}
function startsWithAny(s, list){ var x = String(s || "").replace(/^[“"‘'(\s]+/, ""); return list.some(function(w){ return x.indexOf(w) === 0 && !/[A-Za-z]/.test(x.charAt(w.length) || ""); }); }

// ---------- Performance task: A claim about the flaw ----------
var task = (function(){
  var api = null, T = null, dw = null;
  function explain(){ var e = $("#task-explain"); return e ? e.value : (MV.taskState().explain || ""); }
  function rLabel(S){ if (S.reading === "own") return String(S.own || "").trim(); var r = byId(T.readings, S.reading || ""); return r ? r.id + " " + r.name : ""; }
  function data(S){
    S = S || {}; var text = String(S.text || ""), ss = sentences(text), keys = ss.map(skey);
    var ci = S.tCounter ? keys.indexOf(S.tCounter) : -1, ai = S.tAnswer ? keys.indexOf(S.tAnswer) : -1;
    return { reading:S.reading || "", own:String(S.own || "").trim(), label:rLabel(S), text:text, n:wc(text), sents:ss, keys:keys, ci:ci, ai:ai, scenes:citedScenes(text), explain:explain() };
  }
  function checks(d){
    T = T || MV.C.task;
    var c1 = d.sents.length > 0 && /\bHamlet\b/.test(d.sents[0]) && /\bShakespeare/.test(d.sents[0]);
    var c2 = d.reading === "own" ? wc(d.own) >= 2 && wc(d.own) <= 6 : !!byId(T.readings, d.reading);
    var low = d.text.toLowerCase(), c3 = T.terms.some(function(w){ return new RegExp("(^|[^a-z])" + w.replace(/ /g, "\\s+") + "([^a-z]|$)").test(low); });
    var uniq = d.scenes.filter(function(s, i, a){ return a.indexOf(s) === i; }), c4 = d.scenes.length >= 2 && uniq.length >= 2;
    var c5 = d.ci >= 0 && startsWithAny(d.sents[d.ci], T.counterStarts);
    var c6 = d.ci >= 0 && d.sents.some(function(s, i){ return i > d.ci && (i === d.ai || startsWithAny(s, T.answerStarts)); });
    var c7 = d.n >= T.min && d.n <= T.max;
    return [c1, c2, c3, c4, c5, c6, c7];
  }
  function insertAt(txt){
    var ta = dw.ta, s = ta.selectionStart != null ? ta.selectionStart : ta.value.length, e2 = ta.selectionEnd != null ? ta.selectionEnd : s, v = ta.value;
    var pre = v.slice(0, s), post = v.slice(e2), lead = pre && !/\s$/.test(pre) ? " " : "";
    ta.value = pre + lead + txt + post; var pos = (pre + lead + txt).length;
    try { ta.focus(); ta.setSelectionRange(pos, pos); } catch (err) {}
    dw.changed();
  }
  function paintTags(){
    var S = api.S, d = data(S), lab = T.labels, host = $("#ct-tags");
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="th-lab">' + lab.tag + '</p><p class="tiny muted">' + lab.tagHow + "</p>" + (d.sents.length ? '<ol class="th-tagl">' + d.sents.map(function(s, i){
        var isC = i === d.ci, isA = i === d.ai;
        return '<li class="' + (isC ? "c" : isA ? "a" : "") + '"><span class="th-tagtext">' + esc(s) + '</span><span class="th-tagbtns">' +
          '<button type="button" class="th-tagb" data-tag="c" data-si="' + i + '" data-k="tc' + i + '" aria-pressed="' + isC + '">' + lab.counter + "</button>" +
          '<button type="button" class="th-tagb" data-tag="a" data-si="' + i + '" data-k="ta' + i + '" aria-pressed="' + isA + '">' + lab.reply + "</button></span></li>";
      }).join("") + "</ol>" : '<p class="tiny muted">' + lab.noSent + "</p>");
    });
  }
  function modelHTML(md){ return '<div class="th-model"><h5>' + md.title + "</h5><p>" + md.s.map(function(x){ return x[0] + (x[1] ? ' <span class="th-mtag">[' + (x[1] === "counter" ? "Counter" : "Answer") + "]</span>" : ""); }).join(" ") + "</p></div>"; }
  function paintPv(){
    var S = api.S, d = data(S), el = $("#ct-pv"); if (!el) return;
    el.innerHTML = '<h4 class="th-h" style="margin-top:0">Your argument at a glance</h4><ul class="th-glance"><li><strong>Reading:</strong> ' + (d.label ? esc(d.label) : '<span class="muted">not chosen</span>') + "</li>" +
      "<li><strong>Words:</strong> " + d.n + " (aim for " + T.min + "–" + T.max + ")</li><li><strong>Cited quotations:</strong> " + (d.scenes.length ? d.scenes.length + " (scenes " + d.scenes.filter(function(s, i, a){ return a.indexOf(s) === i; }).join(", ") + ")" : '<span class="muted">none yet</span>') + "</li>" +
      "<li><strong>Counter:</strong> " + (d.ci >= 0 ? esc(d.sents[d.ci]) : '<span class="muted">not tagged</span>') + "</li><li><strong>Answer:</strong> " + (d.ai >= 0 ? esc(d.sents[d.ai]) : '<span class="muted">not tagged</span>') + "</li></ul>";
    var ok = checks(d).every(Boolean);
    $("#ct-models").innerHTML = ok ? '<details class="alg"><summary>' + T.modelsLabel + '</summary><p class="tiny muted">' + T.modelsNote + "</p>" + T.models.map(modelHTML).join("") + "</details>" : "";
  }
  function paintPlan(){
    var S = api.S; S.plan = S.plan || {};
    $("#ct-plan").innerHTML = '<details class="alg th-plan"' + (S.planOpen ? " open" : "") + '><summary>' + T.labels.plan + '</summary><p class="tiny muted">' + T.labels.planHow + "</p>" + T.plan.map(function(p){
      return '<div class="jq th-pp th-pp-' + p.id + '"><label for="pl-' + p.id + '">' + p.t + '</label><input id="pl-' + p.id + '" class="txtin" type="text" autocomplete="off" data-pl="' + p.id + '" placeholder="' + esc(p.ph) + '" value="' + esc(S.plan[p.id] || "") + '"></div>';
    }).join("") + '<button type="button" class="btn ghost sm" data-addplan="1">' + T.labels.planAdd + "</button></details>";
  }
  function changed(){ api.save(); api.update(); paintTags(); paintPv(); }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; var S = a.S, lab = T.labels;
      inp.innerHTML = '<div class="th-ct"><div id="ct-rd" class="th-row"></div><div class="jq" id="ct-ownw"><label for="ct-own">' + lab.ownLabel + '</label><input id="ct-own" class="txtin" type="text" autocomplete="off"></div>' +
        '<div id="ct-plan"></div><div class="th-ins"><p class="th-lab">' + lab.ins + '</p><p class="tiny muted">' + lab.insHow + '</p><div class="th-inslist">' +
        T.bank.map(function(b){ return '<button type="button" class="th-insb" data-ins="' + b.id + '"><span class="th-lid">' + b.id + "</span> “" + esc(MV.plain(b.t)) + "” <span class=\"th-ref\">(" + b.ref + ")</span></button>"; }).join("") +
        '</div><p class="q-actions"><button type="button" class="btn ghost sm" data-thesis="1">' + lab.thesis + '</button><span class="tiny muted" id="ct-thn" aria-live="polite"></span></p></div><div id="ct-draft"></div><div id="ct-tags" class="th-tags-host"></div></div>';
      pv.innerHTML = '<div id="ct-pv" aria-live="polite"></div><div id="ct-models"></div>';
      radios($("#ct-rd"), { label:lab.reading, cls:"chips", options:T.readings.map(function(r){ return { id:r.id, t:r.id + " " + r.t }; }).concat([{ id:"own", t:lab.own }]), value:S.reading || "", onChange:function(v){ S.reading = v; $("#ct-ownw").hidden = v !== "own"; changed(); } });
      $("#ct-ownw").hidden = S.reading !== "own"; $("#ct-own").value = S.own || "";
      $("#ct-own").addEventListener("input", function(e){ S.own = e.target.value; changed(); });
      paintPlan();
      S.drafts = Array.isArray(S.drafts) ? S.drafts : [];
      dw = draftWorkspace($("#ct-draft"), { id:"claim", label:lab.draft + " (" + T.min + "–" + T.max + " words)", min:T.min, max:T.max, get:function(){ return S.text; }, set:function(v){ S.text = v; }, drafts:function(){ return S.drafts; }, onChange:changed });
      inp.addEventListener("input", function(e){ var k = e.target.dataset.pl; if (k) { S.plan[k] = e.target.value; api.save(); } });
      inp.addEventListener("toggle", function(e){ if (e.target.classList && e.target.classList.contains("th-plan")) { S.planOpen = e.target.open; api.save(); } }, true);
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !inp.contains(b)) return;
        if (b.dataset.ins) { var bk = byId(T.bank, b.dataset.ins); insertAt("“" + MV.plain(bk.t).replace(/[,;:]+$/, "") + "” (Hamlet " + bk.ref + ")"); return; }
        if (b.dataset.thesis) { var F = (MV.S.app.part3 || {}).forge, t = F ? forgeText(F) : ""; if (!t || /\[/.test(t)) { $("#ct-thn").textContent = lab.noThesis; return; } $("#ct-thn").textContent = ""; insertAt(t); return; }
        if (b.dataset.addplan) { var parts = T.plan.map(function(p){ return String(S.plan[p.id] || "").trim(); }).filter(Boolean); if (!parts.length) return; var cur = dw.ta.value.trim(); dw.ta.value = (cur ? cur + " " : "") + parts.map(function(x){ return /[.!?”")]$/.test(x) ? x : x + "."; }).join(" "); dw.changed(); return; }
        if (b.dataset.tag) {
          var d = data(S), k = d.keys[+b.dataset.si];
          if (b.dataset.tag === "c") { S.tCounter = S.tCounter === k ? "" : k; if (S.tAnswer === k) S.tAnswer = ""; }
          else { S.tAnswer = S.tAnswer === k ? "" : k; if (S.tCounter === k) S.tCounter = ""; }
          changed();
        }
      });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ a.update(); });
      var ck = $("#task-check"); if (ck) ck.addEventListener("click", function(){ setTimeout(paintPv, 0); });
      paintTags(); paintPv();
      extras();
    },
    read:function(){ T = T || MV.C.task; return data(api ? api.S : MV.taskState().app); },
    valid:function(d){ return d.text.trim() ? true : "Write your argument first."; },
    checks:checks,
    key:function(d){ return d.label || "(no reading)"; }, label:function(k){ return esc(k); }, text:function(k){ return k; },
    summary:function(ts){
      T = T || MV.C.task;
      var S = ts.app || {}, d = data(S), r = checks(d), met = r.filter(Boolean).length, L = [];
      L.push((T.summary || "A claim about the flaw") + ": " + (met === r.length ? "complete (" + d.label + ", " + d.n + " words)" : "not complete (checklist " + met + "/" + r.length + ")"));
      L.push("  Reading: " + (d.label || "(not chosen)"));
      L.push("  Counter: " + (d.ci >= 0 ? d.sents[d.ci] : "(not tagged)"));
      L.push("  Answer: " + (d.ai >= 0 ? d.sents[d.ai] : "(not tagged)"));
      L.push("  Full text (" + d.n + " words):");
      L.push("    " + (d.text.trim() || "(not written yet)"));
      if ((ts.found || []).length) L.push("  Complete arguments: " + ts.found.join("; "));
      return L;
    }
  };
})();

// ---------- Reflect extras (sample principles, word count, trivium tag, commonplace book) ----------
function extras(){
  var R = MV.C.reflect, sheet = $("#art-sheet"), art = $("#art");
  if (sheet && art && R.artSamples && !$("#art-samples")) {
    var d = document.createElement("details"); d.id = "art-samples"; d.className = "alg art-samples";
    d.innerHTML = "<summary>See two sample principles</summary><p class=\"tiny muted\">They show the form. Always write your own.</p>" + R.artSamples.map(function(s){ return '<p class="an-note an-theme"><strong>Principle:</strong> “' + s.p + "”<br><strong>Master’s example:</strong> " + s.m + "</p>"; }).join("");
    sheet.insertBefore(d, art);
  }
  if (sheet && art && R.art.intro && !$("#th-artintro")) { var p = document.createElement("p"); p.id = "th-artintro"; p.innerHTML = R.art.intro; sheet.insertBefore(p, $("#art-samples") || art); }
  var ap = $("#art-p");
  if (ap && !$("#th-artn")) {
    var n = document.createElement("p"); n.id = "th-artn"; n.className = "tiny muted"; n.setAttribute("aria-live", "polite"); ap.parentNode.appendChild(n);
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
  onShow:function(v){
    MV.eng.stop();
    if (v !== "start" && HR.stop) HR.stop();
    if (EX) { if (v === "explore") EX.shown(); else EX.stop(); }
    if (v === "reflect") extras();
  }
});
})();
