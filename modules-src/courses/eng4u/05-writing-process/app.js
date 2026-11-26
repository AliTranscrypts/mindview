// ENG4U 05 The Writing Process: hero (Pope's couplet read aloud over layered drafts), the "Miss Brill" reader (a Story button
// in the header; numbered paragraphs; local-voice read-aloud), the draft workspace (Explore: E17 drafts timeline with compare,
// notes, outline and storyboard; My draft with five stages, freewrite timer, cluster board, E7 thesis forge, versions and change
// tags), Revision is re-seeing (Part 3: three passes, E6 citation builder, E5 sentence lab), Revise it and Spot the Error
// (Practice), and the "From freewrite to focused paragraph" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function wc(t){ return MV.eng.wordCount(String(t == null ? "" : t).replace(/<[^>]+>/g, " ")); }
function plainT(h){ return String(h == null ? "" : h).replace(/<s>[\s\S]*?<\/s>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); }
function cap(s){ return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function plural(n, w, p){ return n + " " + (n === 1 ? w : (p || w + "s")); }
function mk(b){ return b ? "✓" : "○"; }
function vh(t){ return '<span class="vh">' + t + "</span>"; }
var TIMES = ["", "once", "twice"];
function times(n){ return TIMES[n] || n + " times"; }

// ---------- @component radioGroup (copied from ENG4U 02; no option needs to be checked) ----------
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

// ---------- read aloud (local voices only, through MV.eng); one speaker at a time ----------
var VOICE = null, SPK = 0;
function voiceReady(fn){ MV.eng.voice(function(v){ VOICE = v; fn(v); }); }
function speak(text, o){
  var me = ++SPK;
  return MV.eng.say(text, { voice:VOICE, rate:o.rate || 1, onWord:function(k){ if (me === SPK && o.onWord) o.onWord(k); }, onEnd:function(){ if (o.onEnd) o.onEnd(me === SPK); } });
}

// ---------- structure tests shared by the readouts and the task (structure only, never quality) ----------
var CITE = /\((?:Mansfield, )?par\. \d+(?:[–-]\d+)?\)/;
var CITE_NEAR = /\(\s*(?:Mansfield)?[\s,]*(?:pars?|paragraph|pg?)\.?\s*\d+(?:\s*[–-]\s*\d+)?\s*\)/i;
var ANV = /\b(shows?|showing|suggests?|reveals?|impl(?:y|ies)|undercuts?|juxtaposes?|foreshadows?|reframes?|intensif(?:y|ies)|complicates?|exposes?|mirrors?|contrasts?|echo(?:es)?|disguises?|hints?|lets|turns?|makes?)\b/i;
function quotesIn(t){ var out = [], re = /["“]([^"“”]+)["”]/g, m; t = String(t || ""); while ((m = re.exec(t))) if (wc(m[1]) >= 1 && !/^\s*miss brill[,.]?\s*$/i.test(m[1])) out.push({ a:m.index, b:m.index + m[0].length, inner:m[1] }); return out; }
function citedQ(t, q){ var after = t.slice(q.b, q.b + 60), i = after.indexOf("("); if (i < 0 || i > 10) return false; var m = after.slice(i).match(CITE); return !!m && m.index === 0; }
function nearCite(t, q){ var after = t.slice(q.b, q.b + 60), i = after.indexOf("("); if (i < 0 || i > 10) return false; var m = after.slice(i).match(CITE_NEAR); return !!m && m.index === 0; }
function thesisInfo(t){
  t = String(t || "").trim();
  var end = t.replace(/["”’')\]\s]+$/, "");
  return { text:/miss brill/i.test(t), author:/mansfield/i.test(t), ends:/[.?!]$/.test(end) && !/[.?!]{2,}$/.test(end),
    full:wc(t) >= 12 && !/^\s*["“]?\s*this essay (is about|will)\b/i.test(t), topic:/\b(is|are) about\b|^\s*this (essay|paragraph)\b/i.test(t) };
}
function thesisRow(t){
  if (!String(t || "").trim()) return '<span class="muted">not written yet</span>';
  var i = thesisInfo(t), claim = i.full && !i.topic;
  return "Names the text " + mk(i.text) + " · Names the author " + mk(i.author) + " · Makes a claim " + mk(claim) + vh(claim ? "" : " (a topic names a subject; a claim says what the story shows)");
}
function partsRow(text){
  var S = [].concat.apply([], parasOf(text)); if (!S.length) return '<span class="muted">nothing yet</span>';
  var Q = quotesIn(text), cited = Q.filter(function(q){ return citedQ(text, q); }).length;
  var bare = function(s){ return s.replace(/["“][^"“”]*["”]/g, " "); };
  var claim = wc(S[0]) >= 8 && !quotesIn(S[0]).length && !/\b(this paragraph|this essay) (is about|will)\b/i.test(S[0]);
  var qi = -1; S.forEach(function(s, i){ if (qi < 0 && quotesIn(s).length) qi = i; });
  var ana = qi >= 0 && S.slice(qi).some(function(s){ return ANV.test(bare(s)); });
  var link = S.length >= 3 && !quotesIn(S[S.length - 1]).length && wc(S[S.length - 1]) >= 10;
  return "Claim " + mk(claim) + " · Evidence (" + plural(Q.length, "quotation") + ", " + cited + " cited) · Analysis " + mk(ana) + " · Link " + mk(link);
}

// ---------- sentences: split on . ? ! followed by a space or the end (not inside a parenthetical citation or "par.") ----------
var ABBR = /\b(Mrs|Mr|Ms|Dr|St|pars?|vol|eds?|etc)\./gi;
function splitSents(text){
  var t = String(text || "").replace(/\s+/g, " ").trim(); if (!t) return [];
  var m = t.replace(ABBR, function(x){ return x.slice(0, -1) + "\u0001"; }).replace(/\([^()]*\)/g, function(x){ return x.replace(/[.!?]/g, "\u0002"); });
  var out = [], start = 0, re = /[.!?]+["”’'\])]*(?=\s|$)/g, r;
  while ((r = re.exec(m))) {
    var end = r.index + r[0].length;
    if (m.slice(end).replace(/^\s+/, "").charAt(0) === "(") continue;
    out.push(t.slice(start, end).trim()); start = end;
  }
  if (t.slice(start).trim()) out.push(t.slice(start).trim());
  return out.filter(Boolean);
}
function parasOf(text){ return String(text || "").split(/\n+/).map(splitSents).filter(function(p){ return p.length; }); }

// ---------- @component E17 draftWorkspace — sentence-level diff (course plan E17; reused by 06, 19, 24) ----------
// diff(A, B): A, B = [[sentence, …] per paragraph]. Exact matches first, then pairs with ≥ 50 % of their words shared (Dice);
// a sentence with more than half its words changed counts as cut + added. Matched sentences outside the longest in-order run
// are "moved". Returns {A, B (items {t, k:"same"|"move"|"edit"|"cut"|"add", mv, w (word runs)}), changes:[{type, old, nw, w,
// moved, key}], n} (n = changes that alter text: cut + added + edited). Word runs: [{eq} | {del:[…], ins:[…]}]; ins after del is
// a replacement (brown), ins alone an addition (teal), del a cut (struck).
function wset(s){ var o = {}, n = 0; MV.eng.norm(s).split(" ").forEach(function(w){ if (w && !o[w]) { o[w] = 1; n++; } }); return { o:o, n:n }; }
function sim(a, b){ var A = wset(a), B = wset(b); if (!A.n || !B.n) return 0; var k = 0; Object.keys(A.o).forEach(function(w){ if (B.o[w]) k++; }); return 2 * k / (A.n + B.n); }
function wdiff(o, n){
  var A = o.split(/\s+/), B = n.split(/\s+/), m = A.length, k = B.length, T = [], i, j;
  for (i = 0; i <= m; i++) { T.push([]); for (j = 0; j <= k; j++) T[i].push(0); }
  for (i = m - 1; i >= 0; i--) for (j = k - 1; j >= 0; j--) T[i][j] = A[i] === B[j] ? T[i + 1][j + 1] + 1 : Math.max(T[i + 1][j], T[i][j + 1]);
  var runs = [], cur = null; i = 0; j = 0;
  function ch(){ if (!cur) { cur = { del:[], ins:[] }; runs.push(cur); } return cur; }
  while (i < m || j < k) {
    if (i < m && j < k && A[i] === B[j]) { runs.push({ eq:A[i] }); cur = null; i++; j++; }
    else if (j < k && (i >= m || T[i][j + 1] >= T[i + 1][j])) { ch().ins.push(B[j]); j++; }
    else { ch().del.push(A[i]); i++; }
  }
  return runs;
}
function wOld(r){ return r.map(function(x){ return x.eq != null ? esc(x.eq) : x.del.length ? '<del class="wp-del">' + vh("cut: ") + esc(x.del.join(" ")) + "</del>" : ""; }).filter(Boolean).join(" "); }
function wNew(r){ return r.map(function(x){ return x.eq != null ? esc(x.eq) : x.ins.length ? '<ins class="' + (x.del.length ? "wp-rep" : "wp-ins") + '">' + vh(x.del.length ? "changed to: " : "added: ") + esc(x.ins.join(" ")) + "</ins>" : ""; }).filter(Boolean).join(" "); }
function wBoth(r){ return r.map(function(x){ return x.eq != null ? esc(x.eq) : [x.del.length ? wOld([x]) : "", x.ins.length ? wNew([x]) : ""].filter(Boolean).join(" "); }).join(" "); }
function diff(A, B){
  function flat(P){ var out = []; P.forEach(function(p, pi){ p.forEach(function(s){ out.push({ t:String(s).replace(/\s+/g, " ").trim(), p:pi }); }); }); return out; }
  var a = flat(A), b = flat(B), ma = a.map(function(){ return -1; }), mb = b.map(function(){ return -1; });
  b.forEach(function(y, j){ for (var i = 0; i < a.length; i++) if (ma[i] < 0 && a[i].t === y.t) { ma[i] = j; mb[j] = i; return; } });
  var cand = [];
  b.forEach(function(y, j){ if (mb[j] >= 0) return; a.forEach(function(x, i){ if (ma[i] >= 0) return; var s = sim(x.t, y.t); if (s >= 0.5) cand.push([s, i, j]); }); });
  cand.sort(function(p, q){ return q[0] - p[0] || p[1] - q[1]; });
  cand.forEach(function(c){ if (ma[c[1]] < 0 && mb[c[2]] < 0) { ma[c[1]] = c[2]; mb[c[2]] = c[1]; } });
  var js = [], seq = [];
  b.forEach(function(y, j){ if (mb[j] >= 0) { js.push(j); seq.push(mb[j]); } });
  var L = seq.map(function(){ return 1; }), P = seq.map(function(){ return -1; }), best = -1, x, w;
  for (x = 0; x < seq.length; x++) { for (w = 0; w < x; w++) if (seq[w] < seq[x] && L[w] + 1 > L[x]) { L[x] = L[w] + 1; P[x] = w; } if (best < 0 || L[x] > L[best]) best = x; }
  var keep = {}; for (x = best; x >= 0; x = P[x]) keep[js[x]] = 1;
  var changes = [];
  b.forEach(function(y, j){
    var i = mb[j];
    if (i < 0) { y.k = "add"; changes.push({ type:"add", nw:y.t, key:"a|" + y.t, pos:j }); return; }
    var o = a[i], mv = !keep[j], ed = o.t !== y.t;
    y.k = o.k = ed ? "edit" : mv ? "move" : "same"; y.mv = o.mv = mv; y.i = i; o.j = j;
    if (ed) { y.w = o.w = wdiff(o.t, y.t); changes.push({ type:"edit", old:o.t, nw:y.t, w:y.w, moved:mv, key:"e|" + o.t + "|>|" + y.t, pos:j }); }
    else if (mv) changes.push({ type:"move", old:o.t, nw:y.t, key:"m|" + y.t, pos:j });
  });
  a.forEach(function(o, i){
    if (ma[i] >= 0) return;
    o.k = "cut"; var pos = -0.5; for (var q = i - 1; q >= 0; q--) if (ma[q] >= 0) { pos = ma[q] + 0.5; break; }
    o.pos = pos; changes.push({ type:"cut", old:o.t, key:"c|" + o.t, pos:pos });
  });
  changes.sort(function(p, q){ return p.pos - q.pos; });
  function group(list, n){ var out = []; for (var k = 0; k < n; k++) out.push([]); list.forEach(function(it){ out[it.p].push(it); }); return out; }
  return { a:a, b:b, A:group(a, A.length), B:group(b, B.length), changes:changes, n:changes.filter(function(c){ return c.type !== "move"; }).length };
}
function sentHTML(x, side){
  var t = x.k === "edit" ? (side === "a" ? wOld(x.w) : wNew(x.w)) : esc(x.t);
  var cls = { same:"", move:"", edit:"wp-ed", cut:"wp-cut", add:"wp-add" }[x.k] || "";
  var pre = x.k === "cut" ? vh("(cut) ") : x.k === "add" ? vh("(added) ") : "";
  if (x.mv) pre = MVI + pre;
  return '<span class="wp-s ' + cls + (x.mv ? " wp-mv" : "") + '">' + pre + t + "</span>";
}
var MVI = '<span class="wp-mvi" aria-hidden="true">⇅</span>' + vh("(moved) ");
function moveBadge(par, d, side, labOther){
  var m = par.filter(function(x){ return x.k !== "add" && x.k !== "cut"; }), mv = m.filter(function(x){ return x.mv; });
  if (!m.length || mv.length * 2 < m.length) return "";
  var o = side === "b" ? d.a[mv[0].i] : d.b[mv[0].j], n = o ? ((labOther || [])[o.p] || "¶" + (o.p + 1)) : "?";
  return '<span class="wp-pbadge"><span aria-hidden="true">⇅</span> ' + (side === "b" ? "moved here from " : "moved to ") + n + "</span>";
}
function sideHTML(d, side, o){
  o = o || {}; var P = side === "a" ? d.A : d.B, lab = (side === "a" ? o.la : o.lb) || [];
  return P.map(function(par, pi){
    if (!par.length) return "";
    var allCut = par.every(function(x){ return x.k === "cut"; });
    return '<p class="wp-p' + (allCut ? " wp-pcut" : "") + '"><span class="wp-pn">' + (lab[pi] || "¶" + (pi + 1)) + "</span>" + moveBadge(par, d, side, side === "a" ? o.lb : o.la) + par.map(function(x){ return sentHTML(x, side); }).join(" ") + "</p>";
  }).join("");
}
// one text with the changes marked in place: whole cut paragraphs as struck paragraphs, other cuts inline where they stood
function unifiedHTML(d, o){
  o = o || {}; var la = o.la || [], lb = o.lb || [], cutAt = {};
  d.a.forEach(function(x){ if (x.k === "cut") (cutAt[x.pos] = cutAt[x.pos] || []).push(x); });
  function whole(x){ return d.A[x.p].every(function(y){ return y.k === "cut"; }); }
  function inl(list){ return list.map(function(y){ return sentHTML(y, "a"); }).join(" "); }
  function cutPars(list){
    var h = "", buf = [];
    list.forEach(function(x, k){ buf.push(x); if (k === list.length - 1 || list[k + 1].p !== x.p) { h += '<p class="wp-p wp-pcut"><span class="wp-pn">' + (la[x.p] || "¶" + (x.p + 1)) + "</span>" + vh("(cut paragraph) ") + inl(buf) + "</p>"; buf = []; } });
    return h;
  }
  var out = "", last = d.b.length - 1;
  d.B.forEach(function(par, pi){
    if (!par.length) return;
    var body = [], pre = "";
    par.forEach(function(x, k){
      var j = d.b.indexOf(x), cs = cutAt[j - 0.5] || [];
      if (k === 0) { pre += cutPars(cs.filter(whole)); cs = cs.filter(function(y){ return !whole(y); }); }
      if (cs.length) body.push(inl(cs));
      body.push(x.k === "edit" ? '<span class="wp-s wp-ed' + (x.mv ? " wp-mv" : "") + '">' + (x.mv ? MVI : "") + wBoth(x.w) + "</span>" : sentHTML(x, "b"));
    });
    out += pre + '<p class="wp-p"><span class="wp-pn">' + (lb[pi] || "¶" + (pi + 1)) + "</span>" + moveBadge(par, d, "b", la) + body.join(" ") + "</p>";
  });
  var tail = cutAt[last + 0.5] || [];
  return out + cutPars(tail);
}
var LEGEND = '<p class="wp-legend tiny"><span class="wp-add">added</span> · <span class="wp-cut">cut</span> · <span class="wp-rep">replaced words</span> · <span class="wp-mvi" aria-hidden="true">⇅</span> moved</p>';
function changeRow(c){
  var t = c.type === "add" ? '<span class="wp-cht">Added</span> <span class="wp-add">' + esc(c.nw) + "</span>"
    : c.type === "cut" ? '<span class="wp-cht">Cut</span> <span class="wp-cut">' + esc(c.old) + "</span>"
    : c.type === "move" ? '<span class="wp-cht">Moved</span> ' + esc(c.nw)
    : '<span class="wp-cht">' + (c.moved ? "Moved and changed" : "Changed") + "</span> " + wBoth(c.w);
  return t;
}
// changeList(host, {changes, tags (object, mutated), onTag(), empty}) — each detected change gets Revising / Editing chips.
function changeListHTML(changes, tags, pre){
  if (!changes.length) return '<p class="tiny muted">No changes between these two versions yet.</p>';
  return '<ol class="wp-log">' + changes.map(function(c, i){
    var v = tags[c.key] || "";
    return '<li><div class="wp-logt">' + changeRow(c) + '</div><span class="wp-tagrow" role="group" aria-label="Tag change ' + (i + 1) + '"><button type="button" class="chip' + (v === "hi" ? " on" : "") + '" aria-pressed="' + (v === "hi") + '" data-ctag="hi" data-ci="' + i + '" data-k="' + pre + "h" + i + '">Revising (higher-order)</button><button type="button" class="chip' + (v === "lo" ? " on" : "") + '" aria-pressed="' + (v === "lo") + '" data-ctag="lo" data-ci="' + i + '" data-k="' + pre + "l" + i + '">Editing (lower-order)</button></span></li>';
  }).join("") + "</ol>";
}
function tagCounts(changes, tags){ var h = 0, l = 0; changes.forEach(function(c){ if (tags[c.key] === "hi") h++; else if (tags[c.key] === "lo") l++; }); return { hi:h, lo:l, un:changes.length - h - l }; }

// ---------- freewrite timer (one running clock per key; the button toggles with Space or Enter) ----------
var TIMERS = {};
function timerUI(key, host, o){
  var T = TIMERS[key] || (TIMERS[key] = { iv:null });
  T.host = host; T.o = o;
  function pad(n){ return (n < 10 ? "0" : "") + n; }
  function paint(){
    if (!T.host || !document.body.contains(T.host)) return;
    var O = T.o, left = Math.max(0, O.get()), run = !!T.iv;
    MV.keepFocus(T.host, function(){
      T.host.innerHTML = '<div class="wp-timer"><button type="button" class="btn sm' + (run ? "" : " primary") + '" data-tm="go" data-k="' + key + 'go">' + (run ? "Pause" : left <= 0 ? "Start again" : left < O.total ? "Resume" : "Start the " + Math.round(O.total / 60) + "-minute timer") + "</button>" +
        '<span class="wp-clock" aria-hidden="true">' + Math.floor(left / 60) + ":" + pad(left % 60) + '</span><button type="button" class="btn ghost sm" data-tm="reset" data-k="' + key + 'rs"' + (left >= O.total && !run ? " disabled" : "") + '>Reset</button><span class="tiny muted wp-tmsr" aria-live="polite">' + (T.msg || "") + "</span></div>";
    });
  }
  function stop(){ if (T.iv) { clearInterval(T.iv); T.iv = null; } }
  function tick(){ var O = T.o, left = O.get() - 1; O.set(left); if (left <= 0) { O.set(0); stop(); T.msg = O.done || "Time!"; } else if (left % 60 === 0) T.msg = Math.round(left / 60) + " min left"; paint(); }
  T.paint = paint;
  if (!T.bound) {
    T.bound = true;
    document.addEventListener("click", function(e){
      var b = e.target.closest("[data-tm]"); if (!b || !T.host || !T.host.contains(b)) return;
      if (b.dataset.tm === "go") { if (T.iv) { stop(); T.msg = "Paused."; } else { if (T.o.get() <= 0) T.o.set(T.o.total); T.msg = "Timer running. Keep your pen moving."; T.iv = setInterval(tick, 1000); } }
      else { stop(); T.o.set(T.o.total); T.msg = ""; }
      T.paint();
    });
  }
  paint();
  return { paint:paint, stop:stop };
}

// ---------- cluster board (model snapshot and My draft): bubbles over link lines; tap two bubbles (or press L on each) to link ----------
var SLOTS = [[50, 48], [22, 20], [78, 20], [22, 78], [78, 78], [50, 12], [50, 86], [10, 48], [90, 48], [34, 34], [66, 64], [36, 64]];
function clusterHTML(o){
  var N = o.nodes.slice(0, o.show == null ? o.nodes.length : o.show), have = {}, step = 0.45;
  N.forEach(function(n){ have[n.id] = n; });
  function ln(p, q, cls, d){ return '<line' + (cls ? ' class="' + cls + '"' : "") + (d != null ? ' style="--d:' + d.toFixed(2) + 's"' : "") + ' x1="' + p.x + '" y1="' + p.y + '" x2="' + q.x + '" y2="' + q.y + '" vector-effect="non-scaling-stroke"/>'; }
  var lines = o.links.filter(function(l){ return have[l[0]] && have[l[1]]; }).map(function(l){ var a = N.indexOf(have[l[0]]), b = N.indexOf(have[l[1]]); return ln(have[l[0]], have[l[1]], "", o.anim ? Math.max(a, b) * step + 0.2 : null); }).join("");
  var K = o.keyLink, key = "", lab = "", glow = {}, kd = N.length * step + 0.4;
  if (K && o.showKey && have[K.a] && have[K.b]) {
    var p = have[K.a], q = have[K.b];
    key = ln(p, q, "wp-cl-key", o.anim ? kd : null); glow[K.a] = glow[K.b] = 1;
    lab = '<span class="wp-cl-lab" style="left:' + ((p.x + q.x) / 2) + "%;top:" + ((p.y + q.y) / 2) + "%" + (o.anim ? ";--d:" + (kd + 0.3).toFixed(2) + "s" : "") + '">' + esc(K.label) + "</span>";
  }
  var bubs = N.map(function(n, i){
    var st = "left:" + n.x + "%;top:" + n.y + "%" + (o.anim ? ";--d:" + (i * step).toFixed(2) + "s;--gd:" + kd.toFixed(2) + "s" : ""), cls = "wp-bub" + (glow[n.id] ? " wp-glow" : "") + (o.sel === n.id ? " wp-sel" : "");
    if (o.readOnly) return '<span class="' + cls + '" style="' + st + '">' + n.t + "</span>";
    return '<button type="button" class="' + cls + '" style="' + st + '" data-bub="' + n.id + '" data-k="bub' + n.id + '" aria-pressed="' + (o.sel === n.id) + '">' + esc(n.t) + "</button>";
  }).join("");
  var desc = "Cluster: " + N.map(function(n){ return MV.plain(n.t); }).join(", ") + ". Links: " + o.links.filter(function(l){ return have[l[0]] && have[l[1]]; }).map(function(l){ return MV.plain(have[l[0]].t) + "–" + MV.plain(have[l[1]].t); }).join(", ") + (key ? "; " + MV.plain(have[K.a].t) + " to " + MV.plain(have[K.b].t) + " through " + K.label : "") + ".";
  return '<div class="wp-cl' + (o.anim ? " wp-anim" : "") + '"' + (o.readOnly ? ' role="img" aria-label="' + esc(desc) + '"' : "") + '><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">' + lines + key + "</svg>" + bubs + lab + "</div>";
}

// ---------- @component E7 thesisForge — chip rows (how, claim, why) build a working-thesis sentence the student then rewrites ----------
// thesisForge(host, {chips:{how, claim, why}, state, onBuild(text)}); the checker is thesisInfo() above (structural only).
function thesisForge(host, o){
  var F = o.chips, st = o.state;
  host.innerHTML = '<details class="alg wp-forge"><summary>Thesis forge (optional help)</summary><p class="tiny muted">' + F.intro + '</p><div data-fr="how"></div><div data-fr="claim"></div><div data-fr="why"></div><div class="q-actions"><button type="button" class="btn ghost sm" data-forge="build">Build a sentence from my chips</button><span class="tiny muted" data-forge-st aria-live="polite"></span></div></details>';
  [["how", "Mansfield uses…"], ["claim", "to show…"], ["why", "Why it matters (optional)"]].forEach(function(r){
    radios(host.querySelector('[data-fr="' + r[0] + '"]'), { label:r[1], cls:"chips", options:F[r[0]].map(function(t, i){ return { id:String(i), t:t }; }), value:st[r[0]] == null ? "" : st[r[0]], onChange:function(v){ st[r[0]] = +v; if (o.onChange) o.onChange(); } });
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest('[data-forge="build"]'); if (!b) return;
    var msg = host.querySelector("[data-forge-st]");
    if (st.how == null || st.claim == null) { msg.textContent = "Choose a chip in the first two rows."; return; }
    var t = "In “Miss Brill,” Mansfield uses " + F.how[st.how] + " to show " + F.claim[st.claim] + (st.why != null ? ", " + F.why[st.why] : "") + ".";
    o.onBuild(t); msg.textContent = "Built. Now make it yours: rewrite it in your own words.";
  });
}

// ---------- "Miss Brill": a reader panel (non-modal, below the header) opened by the header's Story button or any [data-story] ----------
var RD = { open:false, playing:false };
function storyInit(){
  var St = MV.C.start.story; if (!St || $("#wp-story")) return;
  var d = document.createElement("div"); d.className = "wp-dlg"; d.id = "wp-story"; d.hidden = true;
  d.setAttribute("role", "dialog"); d.setAttribute("aria-labelledby", "wp-st-h");
  d.innerHTML = '<div class="wp-dlg-top"><h2 id="wp-st-h">“' + St.title + '”</h2><span class="tiny muted">' + St.author + '</span><button type="button" class="btn ghost sm" id="wp-st-close">Close</button></div>' +
    '<div class="wp-dlg-ctl"><button type="button" class="btn sm" id="wp-st-play" hidden>Read aloud</button><label id="wp-st-froml" hidden>from paragraph <select id="wp-st-from" class="wp-sel">' + St.pars.map(function(_, i){ return '<option value="' + i + '">' + (i + 1) + "</option>"; }).join("") + '</select></label><span class="tiny muted" id="wp-st-note" hidden>' + MV.C.hero.noVoice + '</span></div><div class="wp-dlg-body" id="wp-st-body" tabindex="-1"></div>';
  document.body.appendChild(d);
  MV.eng.passage($("#wp-st-body"), St.pars, { kind:"prose", words:true, cite:St.cite });
  var hb = $(".hd-btns");
  if (hb && !$("#wp-open-story")) { var b = document.createElement("button"); b.type = "button"; b.className = "btn ghost sm"; b.id = "wp-open-story"; b.setAttribute("data-story", "1"); b.setAttribute("aria-label", "Open the story Miss Brill"); b.textContent = "Story"; hb.insertBefore(b, hb.firstChild); }
  // phones: the header has no room, so a small floating button opens the story instead
  var fab = document.createElement("button"); fab.type = "button"; fab.className = "btn sm wp-fab"; fab.setAttribute("data-story", "1"); fab.setAttribute("aria-label", "Open the story Miss Brill"); fab.textContent = "Story"; document.body.appendChild(fab);
  var P = $$("#wp-st-body .eng-prose p"), opener = null;
  function mark(i, k){ P.forEach(function(p, j){ p.classList.toggle("wp-rcur", j === i); }); $$("#wp-st-body .eng-w.speaking").forEach(function(w){ w.classList.remove("speaking"); }); if (i >= 0 && k >= 0) { var w = $$(".eng-w", P[i])[k]; if (w) w.classList.add("speaking"); } }
  function stopUI(){ RD.playing = false; mark(-1, -1); $("#wp-st-play").textContent = "Read aloud"; }
  function par(i){
    mark(i, -1); if (P[i]) P[i].scrollIntoView({ block:"nearest", behavior:MV.reduceMotion ? "auto" : "smooth" });
    speak(plainT(St.pars[i]), { onWord:function(k){ mark(i, k); }, onEnd:function(mine){ if (mine && RD.playing && i + 1 < P.length) par(i + 1); else stopUI(); } });
  }
  d.addEventListener("click", function(e){
    if (e.target.id === "wp-st-close") close();
    else if (e.target.id === "wp-st-play") { if (RD.playing) { MV.eng.stop(); stopUI(); return; } RD.playing = true; e.target.textContent = "Stop"; par(+$("#wp-st-from").value || 0); }
  });
  d.addEventListener("keydown", function(e){ if (e.key === "Escape") { e.preventDefault(); close(); } });
  document.addEventListener("click", function(e){ var b = e.target.closest("[data-story]"); if (!b || d.contains(b)) return; opener = b; open(+b.getAttribute("data-story") || 1); });
  function open(n){
    var h = $("header.top"), top = h ? Math.max(0, h.getBoundingClientRect().bottom) : 0;
    d.style.top = Math.round(top + 6) + "px"; d.hidden = false; RD.open = true;
    P.forEach(function(p, j){ p.classList.toggle("wp-rhi", n > 1 && j === n - 1); });
    var t = P[n - 1]; if (n > 1 && t) t.scrollIntoView({ block:"start" }); else $("#wp-st-body").scrollTop = 0;
    $("#wp-st-close").focus({ preventScroll:true });
  }
  function close(){ if (!RD.open) return; if (RD.playing) { MV.eng.stop(); stopUI(); } d.hidden = true; RD.open = false; if (opener && document.body.contains(opener)) opener.focus({ preventScroll:true }); }
  RD.close = close;
  voiceReady(function(v){ $("#wp-st-play").hidden = !v; $("#wp-st-froml").hidden = !v; $("#wp-st-note").hidden = !!v; });
}

// ---------- hero: the couplet lights up as it is read; "art" and "chance" pulse; layered drafts fade in behind; caption ----------
function rng(seed){ var h = seed >>> 0 || 1; return function(){ h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; }; }
function sheetSVG(n){
  var r = rng(n * 7919 + 13), h = '<svg class="wp-ms-s wp-ms-' + n + '" viewBox="0 0 200 130" preserveAspectRatio="none" focusable="false"><rect class="wp-ms-bg" x="1" y="1" width="198" height="128" rx="3"/>';
  for (var y = 13; y < 124; y += 10.5) {
    var x = 9 + r() * 8, d = "M" + x.toFixed(1) + " " + y.toFixed(1), end = 150 + r() * 42;
    while (x < end) { var nx = x + 3 + r() * 5; d += " Q" + ((x + nx) / 2).toFixed(1) + " " + (y - 2.6 + r() * 5.2).toFixed(1) + " " + nx.toFixed(1) + " " + (y + r() - 0.5).toFixed(1); x = nx; }
    h += '<path class="wp-ms-ink" vector-effect="non-scaling-stroke" d="' + d + '"/>';
    if (r() < 0.5) { var a = 12 + r() * 90, b = a + 22 + r() * 46; h += '<path class="wp-ms-x" vector-effect="non-scaling-stroke" d="M' + a.toFixed(1) + " " + (y + 1.5).toFixed(1) + " L" + b.toFixed(1) + " " + (y - 1.5).toFixed(1) + '"/>'; }
  }
  return h + "</svg>";
}
function hero(){
  var H = MV.C.hero, host = $("#wp-hero"); if (!host) return;
  var k = 0, text = H.couplet.join(" ");
  host.innerHTML = '<div class="wp-ms" aria-hidden="true">' + sheetSVG(1) + sheetSVG(2) + '</div><div class="wp-top"><p class="wp-cp">' +
    H.couplet.map(function(l){ return '<span class="wp-cl1">' + l.split(" ").map(function(w){ return '<span class="eng-w wp-hw' + (H.glow.indexOf(w) >= 0 ? " wp-hg" : "") + '" data-wi="' + (k++) + '">' + (H.glow.indexOf(w) >= 0 ? '<span class="wp-hgi">' + esc(w.replace(/[,.;]$/, "")) + "</span>" + esc(w.slice(w.replace(/[,.;]$/, "").length)) : esc(w)) + "</span>"; }).join(" ") + "</span>"; }).join("") +
    '</p><p class="eng-cite">' + H.cite + '</p><p class="wp-gt"><span class="an-tag an-diction">' + H.glowTag + "</span></p></div>" +
    '<p class="wp-hcap">' + H.caption + '</p><div class="wp-hctrl"><button type="button" class="btn primary sm" id="wp-listen" hidden>Listen</button>' + (MV.reduceMotion ? "" : '<button type="button" class="btn ghost sm" id="wp-replay">Replay the animation</button>') + '<span class="tiny muted" id="wp-hnote" hidden>' + H.noVoice + "</span></div>";
  var W = $$(".wp-hw", host), run = 0, speech = null;
  function state(cls){ ["wp-h-read", "wp-h-glow", "wp-h-ms", "wp-h-cap"].forEach(function(c){ host.classList.toggle(c, cls.indexOf(c) >= 0); }); }
  function light(i){ W.forEach(function(w, j){ w.classList.toggle("wp-lit", j <= i); w.classList.toggle("speaking", j === i); }); }
  function finish(){ W.forEach(function(w){ w.classList.add("wp-lit"); w.classList.remove("speaking"); }); state(["wp-h-glow", "wp-h-ms", "wp-h-cap"]); }
  function animate(){
    var me = ++run; state(["wp-h-read"]); light(-1);
    W.forEach(function(w, i){ setTimeout(function(){ if (me === run) light(i); }, 400 + i * 330 + (i >= 10 ? 350 : 0)); });
    var t = 400 + W.length * 330 + 700;
    setTimeout(function(){ if (me === run) { light(W.length); state(["wp-h-glow"]); } }, t);
    setTimeout(function(){ if (me === run) state(["wp-h-glow", "wp-h-ms"]); }, t + 1500);
    setTimeout(function(){ if (me === run) finish(); }, t + 2700);
  }
  function listen(){
    if (speech) { MV.eng.stop(); return; }
    var me = ++run, got = false;
    if (!MV.reduceMotion) { state(["wp-h-read", "wp-h-ms"]); light(-1); }
    $("#wp-listen").textContent = "Stop";
    speech = speak(text, { onWord:function(i){ got = true; if (me === run) { if (MV.reduceMotion) W.forEach(function(w, j){ w.classList.toggle("speaking", j === i); }); else light(i); } },
      onEnd:function(){ speech = null; var b = $("#wp-listen"); if (b) b.textContent = "Listen"; if (me === run) finish(); } });
    setTimeout(function(){ if (!got && speech && me === run && !MV.reduceMotion) animate(); }, 900);
  }
  host.addEventListener("click", function(e){ var b = e.target.closest("button"); if (!b) return; if (b.id === "wp-listen") listen(); else if (b.id === "wp-replay") { MV.eng.stop(); animate(); } });
  if (MV.reduceMotion) finish(); else animate();
  voiceReady(function(v){ $("#wp-listen").hidden = !v; $("#wp-hnote").hidden = !!v; });
}

// ---------- Explore: the draft workspace (E17) ----------
var EX = null;
function explore(host, api){
  var C = api.content, S = api.S, SN = C.snaps, SNI = {}, STG = {};
  SN.forEach(function(s, i){ SNI[s.id] = i; }); C.stages.forEach(function(s, i){ STG[s.id] = i; });
  var LOG = C.logs["d1|d2"], LOG2 = C.logs["d2|fn"], CARD = {}; C.tc2.cards.forEach(function(c){ CARD[c.id] = c; });
  var REP = MV.shuffle(C.tc3.repairs, "wp-tc3");
  S.mode = S.mode === "mine" ? "mine" : "time";
  S.snap = SNI[S.snap] != null ? S.snap : "fw"; S.cmp = S.cmp && SNI[S.cmp] != null && S.cmp !== S.snap ? S.cmp : null;
  S.sub = S.sub === "outline" ? "outline" : "text"; S.notes = !!S.notes; S.resee = !!S.resee; S.cside = ["a", "b", "u"].indexOf(S.cside) >= 0 ? S.cside : "u";
  S.tc1 = S.tc1 || {}; S.tc3 = S.tc3 || {}; S.step = S.step >= 0 && S.step < C.story.length ? +S.step : 0;
  if (!Array.isArray(S.outline) || S.outline.length !== 4) S.outline = C.tc2.setup.slice();
  var M = S.my = S.my || {}; initMine(M);
  var fx = { special:null, anim:false, thv:3, read:{}, story:false }, sbTimer = null;

  host.innerHTML = '<div class="wp-ws"><div id="wp-mode"></div>' +
    '<div id="wp-time"><div class="wp-strip" id="wp-strip" role="group" aria-label="The model writer’s six snapshots"></div><div class="wp-proc" id="wp-proc"></div>' +
      '<div class="wp-ctl" id="wp-ctl"></div><div class="wp-sb" id="wp-sb"></div>' +
      '<div class="wp-body"><div class="wp-stage" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p><div id="wp-view"></div></div>' +
      '<div class="wp-read"><p class="wp-read-h">Readout</p><dl class="read" id="wp-read" aria-live="polite"></dl></div></div>' +
      '<div class="wp-aha" id="wp-aha" hidden><strong>The aha:</strong> ' + C.aha + "</div></div>" +
    '<div id="wp-mine"></div></div>';
  var modeRG = radios($("#wp-mode"), { label:"Mode", options:C.modes, value:S.mode, onChange:function(v){ S.mode = v; stopStory(); api.save(); show(); } });

  // ----- timeline: snapshot strip, process strip, controls, storyboard -----
  function stripHTML(){
    return SN.map(function(s, i){
      var on = s.id === S.snap || s.id === S.cmp;
      return '<button type="button" class="wp-snap' + (on ? " on" : "") + '" data-snap="' + s.id + '" data-k="sn' + s.id + '" aria-pressed="' + on + '"><span class="wp-snn">' + (i + 1) + "</span><strong>" + s.label + "</strong><small>" + s.meta + "</small></button>";
    }).join("");
  }
  function procHTML(cur, loop){
    var n = C.stages.length;
    return '<div class="wp-pgrid" style="grid-template-columns:repeat(' + n + ',minmax(0,1fr))">' +
      (loop ? '<div class="wp-loop' + (loop.on ? " on" : "") + (loop.anim ? " wp-anim" : "") + '" style="grid-column:' + (loop.from + 1) + " / " + (loop.to + 2) + '" aria-hidden="true"><span class="wp-loopa">▼</span></div>' : "") +
      C.stages.map(function(s, i){ return '<span class="wp-pill' + (cur.indexOf(s.id) >= 0 ? " on" : "") + '" style="grid-row:2;grid-column:' + (i + 1) + '">' + s.t + (cur.indexOf(s.id) >= 0 ? vh(" (this snapshot)") : "") + "</span>"; }).join("") + "</div>";
  }
  function ctlHTML(){
    var s = SN[SNI[S.snap]], h = '<button type="button" class="btn sm' + (S.cmp ? " primary" : " ghost") + '" data-ctl="cmp" data-k="ctlcmp" aria-pressed="' + !!S.cmp + '">Compare</button>';
    if (S.cmp) {
      var older = SNI[S.cmp] < SNI[S.snap] ? S.cmp : S.snap, newer = older === S.cmp ? S.snap : S.cmp;
      h += '<label class="wp-cl2">Compare <select class="wp-sel" data-csel="a">' + SN.map(function(x){ return '<option value="' + x.id + '"' + (x.id === older ? " selected" : "") + ">" + x.label + "</option>"; }).join("") + '</select></label><label class="wp-cl2">with <select class="wp-sel" data-csel="b">' + SN.map(function(x){ return '<option value="' + x.id + '"' + (x.id === newer ? " selected" : "") + ">" + x.label + "</option>"; }).join("") + "</select></label>";
    }
    h += '<button type="button" class="btn sm ' + (S.notes ? "primary" : "ghost") + '" data-ctl="notes" data-k="ctlnotes" aria-pressed="' + S.notes + '">Writer’s notes</button>';
    if (!S.cmp && s.id === "d2") h += '<span class="wp-sub" id="wp-sub"></span>' + (S.sub === "text" ? '<button type="button" class="btn sm ' + (S.resee ? "primary" : "ghost") + '" data-ctl="resee" data-k="ctlresee" aria-pressed="' + S.resee + '">Tap sentences in ¶3</button>' : "");
    return h;
  }
  function sbHTML(){
    var st = C.story[S.step];
    return '<div class="player"><button type="button" class="btn ghost sm" data-sb="back" data-k="sbback"' + (S.step === 0 ? " disabled" : "") + '>Back</button><button type="button" class="btn ghost sm" data-sb="step" data-k="sbstep"' + (S.step >= C.story.length - 1 ? " disabled" : "") + ">Step</button>" +
      (MV.reduceMotion ? "" : '<button type="button" class="btn ghost sm" data-sb="play" data-k="sbplay">' + (sbTimer ? "Pause" : "Play the story") + "</button>") +
      '<span class="ctr" aria-live="polite">Storyboard ' + (S.step + 1) + " of " + C.story.length + ": " + st.cap + "</span></div>";
  }

  // ----- views -----
  function notesFor(s, k){ return S.notes && s.notes && s.notes[k] ? '<p class="an-note an-theme wp-note">' + s.notes[k] + "</p>" : ""; }
  function row(inner, note){ return '<div class="wp-row' + (note ? " wn" : "") + '">' + inner + note + "</div>"; }
  function thesisVHTML(s){
    var n = Math.min(fx.thv, s.v.length);
    return '<div class="wp-ths' + (fx.anim ? " wp-anim" : "") + '">' + s.v.slice(0, n).map(function(v, i){
      var old = i < n - 1, note = v.note && (S.notes || fx.story || i === 0 || v.loop) ? '<span class="an-tag an-theme wp-thn">' + v.note + "</span>" : "";
      return '<p class="wp-thv' + (old ? " old" : "") + (v.loop ? " loop" : "") + '"><span class="wp-thl">Try ' + (i + 1) + (old ? vh(", replaced") : "") + "</span>" + (old ? '<span class="wp-cut">' + esc(v.t) + "</span>" : esc(v.t)) + note + "</p>";
    }).join("") + "</div>";
  }
  function draftHTML(s, o){
    o = o || {};
    var h = row('<p class="wp-th"><span class="wp-thl">Working thesis</span>' + esc(s.thesis) + "</p>", notesFor(s, "t"));
    s.pars.forEach(function(p, pi){
      var inner;
      if (s.id === "d2" && pi === C.tc3.par && S.resee) inner = tc3HTML(p);
      else inner = p.map(function(t, si){ return '<span class="wp-s" data-ps="' + pi + "-" + si + '">' + commaMark(s, pi, t) + "</span>"; }).join(" ");
      h += row('<p class="wp-p' + (o.cutPars && o.cutPars.indexOf(pi) >= 0 ? " wp-cutting" : "") + '" data-par="' + pi + '"><span class="wp-pn">¶' + (pi + 1) + "</span>" + inner + "</p>", notesFor(s, pi));
    });
    return '<div class="wp-draft' + (fx.special === "p3" ? " wp-p3x" : "") + '">' + h + "</div>";
  }
  function commaMark(s, pi, t){
    if (fx.special !== "p3" || !s.commas) return esc(t);
    var h = esc(t);
    s.commas.forEach(function(c){ if (c[0] !== pi) return; var w = esc(c[1]), re = new RegExp("(^|\\s)" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?=\\s|$)"); h = h.replace(re, function(m0, sp){ return sp + '<mark class="wp-cf' + (fx.p3on ? " on" : "") + '">' + w + '<span class="wp-cfm" aria-hidden="true">‸</span>' + vh(" (comma fix)") + "</mark>"; }); });
    return h;
  }
  function tc3HTML(p){
    var sel = S.tc3.sent, fix = S.tc3.fix;
    var h = '<span class="wp-t3" role="group" aria-label="Sentences of paragraph 3: tap the one the claim doesn’t support">' + p.map(function(t, si){
      var on = sel === si, shown = esc(t);
      if (on && fix === "A") shown = '<span class="wp-cut">' + shown + "</span>";
      if (on && fix === "B") shown = '<span class="wp-cut">' + shown + '</span> <ins class="wp-rep">' + esc(C.tc3.replaceWith) + "</ins>";
      return '<button type="button" class="wp-t3b" data-t3="' + si + '" data-k="t3s' + si + '" aria-pressed="' + on + '"><span class="wp-t3n">' + (si + 1) + "</span> " + shown + "</button>";
    }).join(" ") + "</span>";
    if (sel != null) h += '<span class="wp-t3r"><span class="tiny"><strong>Sentence ' + (sel + 1) + " selected.</strong> Choose a repair:</span>" + REP.map(function(r){ return '<button type="button" class="chip' + (fix === r.id ? " on" : "") + '" aria-pressed="' + (fix === r.id) + '" data-t3r="' + r.id + '" data-k="t3r' + r.id + '">' + r.t + "</button>"; }).join("") + "</span>";
    return h;
  }
  function outlineHTML(order, o){
    o = o || {}; var n = order.length;
    var pts = order.map(function(id, i){ return [(i + 0.5) / n * 100, 100 - CARD[id].lift / 4 * 80 - 6]; });
    var path = pts.map(function(p, i){ return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" ");
    var rising = order.every(function(id, i){ return i === 0 || CARD[id].lift > CARD[order[i - 1]].lift; });
    return '<div class="wp-ol' + (o.anim ? " wp-anim" : "") + '"><p class="tiny muted">' + (o.title || "The model writer’s Draft 2 outline: body-paragraph topic sentences. Use Move up and Move down (or drag a card by its handle) to change the order.") + "</p>" +
      '<ol class="wp-olist" data-ol="' + (o.readOnly ? "ro" : "rw") + '">' + order.map(function(id, i){
        return '<li class="wp-olc" data-oc="' + id + '"><span class="wp-olh" aria-hidden="true"' + (o.readOnly ? "" : ' data-drag="' + i + '"') + ">⋮⋮</span><span class=\"wp-oln\">" + (i + 1) + "</span><span class=\"wp-olt\">" + CARD[id].t + "</span>" +
          (o.readOnly ? "" : '<span class="wp-olb"><button type="button" class="btn ghost sm" data-om="up" data-oi="' + i + '" data-k="om' + id + 'u"' + (i === 0 ? " disabled" : "") + ' aria-label="Move up: ' + esc(MV.plain(CARD[id].t)) + '">Move up</button><button type="button" class="btn ghost sm" data-om="down" data-oi="' + i + '" data-k="om' + id + 'd"' + (i === n - 1 ? " disabled" : "") + ' aria-label="Move down: ' + esc(MV.plain(CARD[id].t)) + '">Move down</button></span>') + "</li>";
      }).join("") + "</ol>" +
      '<div class="wp-ten"><span class="wp-tenl">tension</span><svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Tension graph: ' + (rising ? "rises steadily to the last paragraph" : "rises and falls before the end") + '"><path class="wp-tenp" vector-effect="non-scaling-stroke" d="' + path + '"/>' + pts.map(function(p){ return '<circle class="wp-tend" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="2.2" vector-effect="non-scaling-stroke"/>'; }).join("") + "</svg>" +
      '<span class="tiny muted">' + (rising ? "Rises to the end: climactic order." : "Peaks too early, then drops.") + "</span></div></div>";
  }
  function snapView(s){
    if (s.kind === "freewrite") return '<div class="wp-fw' + (fx.anim ? " wp-anim" : "") + '">' + row('<p class="wp-fwt">' + s.html + "</p>", S.notes || fx.story ? '<p class="an-note an-theme wp-note">' + s.note + "</p>" : "") + "</div>";
    if (s.kind === "cluster") return row(clusterHTML({ nodes:s.nodes, links:s.links, keyLink:s.key, showKey:true, readOnly:true, anim:fx.anim }), S.notes ? '<p class="an-note an-theme wp-note">' + s.note + "</p>" : "");
    if (s.kind === "thesis") return thesisVHTML(s);
    if (s.id === "d2" && S.sub === "outline") return outlineHTML(S.outline, { title:"Your outline (challenge 2): the model writer’s four body-paragraph topic sentences. Use Move up and Move down, or drag a card by its handle." });
    return draftHTML(s);
  }
  function snapText(s){
    if (s.kind === "freewrite") return [splitSents(plainT(s.html))];
    if (s.kind === "cluster") return [[s.nodes.map(function(n){ return MV.plain(n.t); }).join(", ") + "."]];
    if (s.kind === "thesis") return [[s.v[s.v.length - 1].t]];
    return [[s.thesis]].concat(s.pars);
  }
  function labelsFor(s){ return s.kind === "draft" ? ["Thesis"].concat(s.pars.map(function(_, i){ return "¶" + (i + 1); })) : []; }
  function pair(){ var a = SNI[S.cmp] < SNI[S.snap] ? S.cmp : S.snap; return [SN[SNI[a]], SN[SNI[a === S.cmp ? S.snap : S.cmp]]]; }
  function compareHTML(){
    var p = pair(), A = p[0], B = p[1], d = diff(snapText(A), snapText(B)), la = labelsFor(A), lb = labelsFor(B);
    var h = '<div class="wp-cmp wp-cs-' + S.cside + (fx.anim ? " wp-anim" : "") + '"><div class="wp-cseg" id="wp-cseg"></div><div class="wp-cols">' +
      '<section class="wp-col wp-col-a" aria-label="Before: ' + A.label + '"><h4>Before: ' + A.label + "</h4>" + sideHTML(d, "a", { la:la, lb:lb }) + "</section>" +
      '<section class="wp-col wp-col-b" aria-label="After: ' + B.label + '"><h4>After: ' + B.label + "</h4>" + sideHTML(d, "b", { la:la, lb:lb }) + "</section>" +
      '<section class="wp-col wp-col-u" aria-label="Changes"><h4>Changes: ' + A.label + " → " + B.label + "</h4>" + unifiedHTML(d, { la:la, lb:lb }) + "</section></div>" + LEGEND;
    var key = A.id + "|" + B.id;
    if (key === "d1|d2") h += '<div class="wp-logbox" id="wp-logbox"><h4>The writer’s change log: Draft 1 → Draft 2</h4><p class="tiny muted">Challenge 1: tag each change Revising (higher-order) or Editing (lower-order).</p><ol class="wp-log">' + LOG.map(function(c, i){
      var v = S.tc1[c.id] || "";
      return '<li><span class="wp-logn">' + (i + 1) + '</span><div class="wp-logt">' + c.t + '</div><span class="wp-tagrow" role="group" aria-label="Tag change ' + (i + 1) + '"><button type="button" class="chip' + (v === "rev" ? " on" : "") + '" aria-pressed="' + (v === "rev") + '" data-tc1="' + c.id + '" data-v="rev" data-k="tc1' + c.id + 'r">Revising</button><button type="button" class="chip' + (v === "edit" ? " on" : "") + '" aria-pressed="' + (v === "edit") + '" data-tc1="' + c.id + '" data-v="edit" data-k="tc1' + c.id + 'e">Editing</button></span></li>';
    }).join("") + "</ol></div>";
    else if (key === "d2|fn") h += '<div class="wp-logbox"><h4>The writer’s change log: Draft 2 → Final</h4><ol class="wp-log">' + LOG2.map(function(c, i){ return '<li><span class="wp-logn">' + (i + 1) + '</span><div class="wp-logt">' + c.t + '</div><span class="an-tag ' + (c.tag === "rev" ? "an-syntax" : "an-diction") + '">' + (c.tag === "rev" ? "Revising" : "Editing") + "</span></li>"; }).join("") + "</ol></div>";
    else h += '<p class="tiny muted">The writer logged changes between consecutive drafts only (Draft 1 → Draft 2 and Draft 2 → Final).</p>';
    return h + "</div>";
  }
  function specialHTML(){
    var sp = fx.special;
    if (sp === "p1") {
      var d1 = SN[SNI.d1], d2 = SN[SNI.d2];
      return '<div class="wp-p1' + (fx.p1on ? " on" : "") + '"><h4>Draft 1 → Draft 2, paragraph 1</h4><p class="wp-p"><span class="wp-pn">¶1</span>' + d1.pars[0].map(function(t, i){ return '<span class="wp-s wp-p1o" style="transition-delay:' + (i * 0.35) + 's">' + esc(t) + "</span>"; }).join(" ") +
        " " + d2.pars[0].map(function(t, i){ return '<span class="wp-s wp-p1n" style="transition-delay:' + (1.6 + i * 0.5) + 's">' + vh("(added) ") + esc(t) + "</span>"; }).join(" ") + "</p>" + LEGEND + "</div>";
    }
    if (sp === "p2") return outlineHTML(fx.p2order, { readOnly:true, anim:true, title:"The model writer’s Draft 2 outline (prediction 2)." });
    if (sp === "p3") return draftHTML(SN[SNI.d1], { cutPars:fx.p3cut ? [0, 1] : [] });
    if (sp === "p4") {
      var th = SN[SNI.th];
      return '<div class="wp-p4"><p class="tiny muted">The model writer is drafting paragraph 2 when the real point arrives.</p><div class="wp-p4c' + (fx.p4on ? " on" : "") + '"><p class="wp-thv' + (fx.p4on ? " old" : "") + '"><span class="wp-thl">Working thesis</span>' + (fx.p4on ? '<span class="wp-cut">' + esc(th.v[1].t) + "</span>" : esc(th.v[1].t)) + "</p>" +
        (fx.p4on ? '<p class="wp-thv loop wp-p4new"><span class="wp-thl">Revised thesis</span>' + esc(th.v[2].t) + '<span class="an-tag an-theme wp-thn">' + th.v[2].note + "</span></p>" : "") + "</div></div>";
    }
    return "";
  }
  function stageOf(){ if (fx.special === "p4") return ["draft"]; if (fx.special) return [fx.special === "p2" ? "revise" : "draft"]; var s = SN[SNI[S.snap]]; return S.cmp ? [SN[SNI[S.cmp]].stage, s.stage] : [s.stage]; }

  // ----- readout -----
  function textWords(s){ return s.kind === "freewrite" ? wc(s.html) : s.kind === "cluster" ? 0 : s.kind === "thesis" ? wc(s.v[s.v.length - 1].t) : wc([s.thesis].concat([].concat.apply([], s.pars)).join(" ")); }
  function readRows(){
    var r = fx.read || {}, sp = fx.special, rows = [];
    var s = sp ? SN[SNI[sp === "p2" ? "d2" : sp === "p4" ? "th" : "d1"]] : SN[SNI[S.snap]], cmp = !sp && S.cmp;
    var loopN = !sp && SNI[S.snap] >= SNI.d1;
    rows.push(["Stage", r.stage || (cmp ? pair().map(function(x){ return x.label; }).join(" → ") : s.label + " · " + C.stages[STG[s.stage]].t) + (loopN ? '<br><span class="tiny">The writer looped back once (from Draft to Plan). ' + C.loopNote + "</span>" : "")]);
    var words;
    if (r.words) words = r.words;
    else if (cmp) words = pair().map(function(x){ return x.label + ": " + (x.kind === "cluster" ? plural(x.nodes.length, "bubble") : textWords(x) + " words"); }).join(" → ");
    else words = s.kind === "cluster" ? plural(s.nodes.length, "bubble") : s.label + ": " + textWords(s) + " words";
    rows.push(["Words", words]);
    var th = s.kind === "draft" ? s.thesis : s.kind === "thesis" ? s.v[Math.min(fx.thv, s.v.length) - 1].t : "";
    if (sp === "p4") th = s.v[fx.p4on ? 2 : 1].t;
    rows.push(["Working thesis", th ? thesisRow(th) : '<span class="muted">none yet in this snapshot</span>']);
    var txt = s.kind === "draft" ? [s.thesis].concat([].concat.apply([], s.pars)).join(" ") : "", Q = quotesIn(txt);
    rows.push(["Paragraph parts", r.parts || (s.kind === "draft" ? plural(Q.length, "quotation") + ", " + Q.filter(function(q){ return citedQ(txt, q); }).length + " cited" : '<span class="muted">no paragraphs yet</span>')]);
    if (r.extra) rows.push(r.extra);
    rows.push(["Changes", r.changes || (cmp ? (function(){ var p = pair(), d = diff(snapText(p[0]), snapText(p[1])); return plural(d.changes.length, "change") + " sentence by sentence"; })() : '<span class="muted">press Compare to see changes</span>')]);
    var t1 = EX && EX.tc1Solved && EX.tc1Solved();
    rows.push(["Model writer comparison", "Their Draft 1 → Draft 2: " + plural(LOG.length, "change") + (t1 ? ", " + LOG.filter(function(c){ return MV.ans(c) === "rev"; }).length + " higher-order" : " (tag them in challenge 1)") + "<br>Draft 2 → Final: " + plural(LOG2.length, "change") + ", " + LOG2.filter(function(c){ return c.tag === "rev"; }).length + " higher-order"]);
    return rows;
  }
  function paintTime(){
    var s = SN[SNI[S.snap]];
    MV.keepFocus($("#wp-strip"), function(){ $("#wp-strip").innerHTML = stripHTML(); });
    var loop = fx.special === "p4" ? { from:STG.focus, to:STG.draft, on:!!fx.p4on, anim:true } : (SNI[S.snap] >= SNI.d1 && !fx.special ? { from:STG.plan, to:STG.draft, on:true } : null);
    $("#wp-proc").innerHTML = procHTML(stageOf(), loop);
    MV.keepFocus($("#wp-ctl"), function(){ $("#wp-ctl").innerHTML = ctlHTML(); });
    if ($("#wp-sub")) radios($("#wp-sub"), { label:"", aria:"Draft 2 view", options:[{ id:"text", t:"Text" }, { id:"outline", t:"Outline" }], value:S.sub, onChange:function(v){ S.sub = v; fx.special = null; api.save(); paintTime(); } });
    MV.keepFocus($("#wp-sb"), function(){ $("#wp-sb").innerHTML = sbHTML(); });
    MV.keepFocus($("#wp-view"), function(){ $("#wp-view").innerHTML = fx.special ? specialHTML() : S.cmp ? compareHTML() : snapView(s); });
    if ($("#wp-cseg")) radios($("#wp-cseg"), { label:"Show", aria:"Compare view", options:[{ id:"a", t:"Before" }, { id:"b", t:"After" }, { id:"u", t:"Changes" }], value:S.cside, onChange:function(v){ S.cside = v; api.save(); var c = $(".wp-cmp"); if (c) c.className = c.className.replace(/wp-cs-\w/, "wp-cs-" + v); } });
    $("#wp-read").innerHTML = MV.readoutHTML(readRows());
    $("#wp-aha").hidden = !(S.storyDone || (EX && EX.tc1Solved && EX.tc1Solved()));
  }

  // ----- storyboard -----
  function goStep(i, anim){
    S.step = Math.max(0, Math.min(C.story.length - 1, i)); var st = C.story[S.step];
    fx.special = null; fx.read = {}; fx.story = true; fx.anim = !!anim && !MV.reduceMotion; fx.thv = st.v || 3;
    S.snap = st.snap; S.cmp = st.cmp || null; S.sub = "text"; S.resee = false;
    if (S.step === C.story.length - 1) S.storyDone = true;
    api.save(); paintTime(); MV.changed();
  }
  function stopStory(){ if (sbTimer) { clearInterval(sbTimer); sbTimer = null; } }
  function playStory(fromStart){
    stopStory(); goStep(fromStart ? 0 : (S.step >= C.story.length - 1 ? 0 : S.step + (S.step === 0 && !fromStart ? 0 : 1)), true);
    sbTimer = setInterval(function(){ if (S.step >= C.story.length - 1) { stopStory(); MV.keepFocus($("#wp-sb"), function(){ $("#wp-sb").innerHTML = sbHTML(); }); return; } goStep(S.step + 1, true); }, 3800);
    MV.keepFocus($("#wp-sb"), function(){ $("#wp-sb").innerHTML = sbHTML(); });
  }
  function manual(){ stopStory(); fx.special = null; fx.anim = false; fx.story = false; fx.thv = 3; fx.read = {}; }

  // ----- My draft (mode 2) -----
  function initMine(M){
    var T = C.my.tabs.map(function(t){ return t.id; });
    M.stage = T.indexOf(M.stage) >= 0 ? M.stage : "generate"; M.loops = +M.loops || 0;
    M.fwLeft = M.fwLeft >= 0 && M.fwLeft <= C.my.minutes * 60 ? +M.fwLeft : C.my.minutes * 60;
    ["fw", "focus", "thesis", "draft"].forEach(function(k){ if (typeof M[k] !== "string") M[k] = ""; });
    M.bubbles = Array.isArray(M.bubbles) ? M.bubbles.slice(0, 12) : []; M.links = Array.isArray(M.links) ? M.links : [];
    M.fq = M.fq || {}; M.chips = M.chips || {}; M.outline = Array.isArray(M.outline) && M.outline.length >= 2 ? M.outline.slice(0, 3) : ["", ""];
    M.hi = M.hi || {}; M.lo = M.lo || {}; M.v = M.v || {}; M.tags = M.tags || {}; M.nid = +M.nid || 1;
  }
  var saveT = null;
  function saveSoon(){ clearTimeout(saveT); saveT = setTimeout(function(){ api.save(); }, 300); }
  function lastV(){ var best = null; ["1", "2", "3"].forEach(function(k){ if (M.v[k] != null && (!best || (M.v[k + "t"] || 0) >= (M.v[best + "t"] || 0))) best = k; }); return best; }
  function verText(id){ return id === "cur" ? M.draft : (M.v[id] || ""); }
  function mineRows(){
    var T = C.my.tabs, si = T.map(function(t){ return t.id; }).indexOf(M.stage), rows = [];
    rows.push(["Stage", T[si].t + (M.loops ? " (you’ve looped back " + times(M.loops) + ")<br><span class=\"tiny\">" + C.loopNote + "</span>" : "")]);
    var lv = lastV(), w = wc(M.draft);
    rows.push(["Words", (M.stage === "generate" ? "Freewrite: " + wc(M.fw) + " words<br>" : "") + (lv && M.v[lv] === M.draft && M.draft ? "Draft " + lv + ": " + w + " words" : "Working draft: " + w + " words")]);
    rows.push(["Working thesis", thesisRow(M.thesis)]);
    rows.push(["Paragraph parts", partsRow(M.draft)]);
    if (lv) { var d = diff(parasOf(M.v[lv]), parasOf(M.draft)), tc = tagCounts(d.changes, M.tags); rows.push(["Changes since last version", (d.changes.length ? d.changes.length + ": " + tc.hi + " higher-order, " + tc.lo + " lower-order" + (tc.un ? ", " + tc.un + " not tagged yet" : "") : "none yet") + ' <span class="tiny">(since Draft ' + lv + ")</span>"]); }
    else rows.push(["Changes since last version", '<span class="muted">save a version first</span>']);
    return rows;
  }
  function mineRead(){ var r = $("#wp-read2"); if (r) r.innerHTML = MV.readoutHTML(mineRows()); }
  function goStage(id, viaLoop){
    var ids = C.my.tabs.map(function(t){ return t.id; });
    if (ids.indexOf(id) < ids.indexOf(M.stage)) M.loops++;
    M.stage = id; api.save(); paintMine();
    var f = $('#wp-panel [data-k="first"]') || $("#wp-panel textarea, #wp-panel button"); if (viaLoop && f) f.focus({ preventScroll:true });
  }
  function mineShell(){
    var T = C.my.tabs;
    $("#wp-mine").innerHTML = '<div class="wp-tabsw"><div class="wp-pgrid" style="grid-template-columns:repeat(' + T.length + ',minmax(0,1fr))"><div class="wp-loop on" style="grid-column:1 / ' + (T.length + 1) + '" aria-hidden="true"><span class="wp-loopa">▼</span></div><div class="wp-tabs" id="wp-tabs" role="group" aria-label="Writing stages: visit them in any order" style="grid-row:2;grid-column:1 / ' + (T.length + 1) + ';grid-template-columns:repeat(' + T.length + ',minmax(0,1fr))"></div></div></div>' +
      '<div class="q-actions wp-lbrow"><button type="button" class="btn ghost sm" id="wp-loopback">↶ Loop back a stage</button><span class="tiny muted">Every stage stays open. Writers go back and forth.</span></div>' +
      '<div class="wp-body"><div class="wp-panel" id="wp-panel"></div><div class="wp-read"><p class="wp-read-h">Readout</p><dl class="read" id="wp-read2" aria-live="polite"></dl></div></div>';
  }
  function versionsHTML(){
    var lv = lastV();
    return '<div class="wp-vers"><span class="tiny"><strong>Save this as:</strong></span>' + ["1", "2", "3"].map(function(k){ return '<button type="button" class="btn ghost sm" data-ver="' + k + '" data-k="ver' + k + '">Draft ' + k + (M.v[k] != null ? " ✓" : "") + "</button>"; }).join("") + '<span class="tiny muted" id="wp-vst" aria-live="polite">' + (lv ? "Last saved: Draft " + lv + "." : "No versions saved yet.") + "</span></div>";
  }
  function panelHTML(){
    var st = M.stage;
    if (st === "generate") return '<h4 class="wp-h">Freewrite</h4><p class="tiny muted">Write nonstop about “Miss Brill” for five minutes. Don’t judge, don’t fix. Pausing is allowed.</p><div id="wp-tm"></div><textarea id="wp-fw" data-k="first" class="wp-ta" data-my="fw" spellcheck="false" aria-label="Freewrite"></textarea><p class="tiny muted" id="wp-fwc" aria-live="polite"></p>' +
      '<h4 class="wp-h">Cluster</h4><p class="tiny muted">Add bubbles for ideas, objects and moments. Tap one bubble, then another, to link them (or drag from one to the other). Keyboard: Tab to a bubble, press L, then press L on another. Delete removes the selected bubble.</p>' +
      '<div class="wp-addb"><label for="wp-bin" class="vh">New bubble</label><input id="wp-bin" class="txtin" type="text" maxlength="24" placeholder="e.g. the fur" autocomplete="off"><button type="button" class="btn sm" id="wp-badd">Add bubble</button></div><div id="wp-board"></div><div id="wp-links"></div>';
    if (st === "focus") return '<h4 class="wp-h">Ask a question</h4><p class="tiny muted">Choose a question and jot an answer. Then write one focus in a sentence.</p><div id="wp-fq"></div><div id="wp-fqa"></div>' +
      '<div class="jq"><label for="wp-focus">My focus (one sentence)</label><textarea id="wp-focus" class="wp-ta sm" data-my="focus"></textarea></div>';
    if (st === "plan") return '<h4 class="wp-h">Working thesis</h4><div id="wp-forge"></div><div class="jq"><label for="wp-thesis">My working thesis</label><textarea id="wp-thesis" class="wp-ta sm" data-my="thesis" data-k="first"></textarea></div><p class="tiny" id="wp-thc" aria-live="polite"></p>' +
      '<h4 class="wp-h">Outline</h4><p class="tiny muted">Two or three points, in the order that builds. Move them with the buttons, or drag a point by its handle.</p><div id="wp-mol"></div>';
    if (st === "draft") return '<h4 class="wp-h">Draft</h4>' + (M.thesis.trim() ? '<p class="tiny"><strong>Your thesis:</strong> ' + esc(M.thesis) + "</p>" : "") +
      '<div class="q-actions"><button type="button" class="btn sm ' + (M.noFix ? "primary" : "ghost") + '" id="wp-nofix" aria-pressed="' + !!M.noFix + '">Don’t stop to fix</button><span class="tiny muted">' + (M.noFix ? "Spell-check underlines are hidden. Keep going." : "Turn this on to hide spell-check underlines while you draft.") + "</span></div>" +
      '<textarea id="wp-draft" data-k="first" class="wp-ta big" data-my="draft" aria-label="Your draft paragraph"' + (M.noFix ? ' spellcheck="false"' : "") + '></textarea><p class="tiny muted" id="wp-dc" aria-live="polite"></p>' + versionsHTML();
    var gate = M.hiDone || M.override;
    return '<h4 class="wp-h">Pass 1: higher-order (revise)</h4><ul class="wp-chk">' + C.my.higher.map(function(t, i){ return '<li><label><input type="checkbox" data-hi="' + i + '"' + (M.hi[i] ? " checked" : "") + "> " + t + "</label></li>"; }).join("") + "</ul>" +
      '<div class="q-actions"><button type="button" class="btn sm ' + (M.hiDone ? "ghost" : "primary") + '" id="wp-hidone" aria-pressed="' + !!M.hiDone + '">' + (M.hiDone ? "Higher-order pass done ✓" : "Mark the higher-order pass done") + "</button></div>" +
      '<h4 class="wp-h">Pass 2: lower-order (edit)</h4>' + (gate ? "" : '<p class="tiny muted">This pass unlocks when the higher-order pass is marked done. <button type="button" class="linkbtn" id="wp-override">Edit anyway</button></p>') + (M.override && !M.hiDone ? '<p class="tiny">' + C.my.gateNote + "</p>" : "") +
      '<ul class="wp-chk">' + C.my.lower.map(function(t, i){ return '<li><label><input type="checkbox" data-lo="' + i + '"' + (M.lo[i] ? " checked" : "") + (gate ? "" : " disabled") + "> " + t + "</label></li>"; }).join("") + "</ul>" +
      '<div class="jq"><label for="wp-draft">Your working draft</label><textarea id="wp-draft" class="wp-ta big" data-my="draft"></textarea><p class="tiny muted" id="wp-dc" aria-live="polite"></p></div>' + versionsHTML() +
      '<h4 class="wp-h">Compare versions</h4><div class="wp-vcmp"><label>Compare <select class="wp-sel" data-mc="a">' + verOpts(M.cmpA || lastV() || "1") + '</select></label><label>with <select class="wp-sel" data-mc="b">' + verOpts(M.cmpB || "cur") + '</select></label></div><div id="wp-mcmp"></div>';
  }
  function verOpts(v){ return [["1", "Draft 1"], ["2", "Draft 2"], ["3", "Draft 3"], ["cur", "Working draft"]].map(function(o){ return '<option value="' + o[0] + '"' + (o[0] === v ? " selected" : "") + (o[0] !== "cur" && M.v[o[0]] == null ? " disabled" : "") + ">" + o[1] + (o[0] !== "cur" && M.v[o[0]] == null ? " (not saved)" : "") + "</option>"; }).join(""); }
  function paintMineCmp(){
    var host = $("#wp-mcmp"); if (!host) return;
    var a = M.cmpA || lastV() || "1", b = M.cmpB || "cur";
    if (a !== "cur" && M.v[a] == null) { host.innerHTML = '<p class="tiny muted">Save a version (Draft 1, 2 or 3) first, then compare it with your working draft.</p>'; return; }
    var d = diff(parasOf(verText(a)), parasOf(verText(b)));
    MV.keepFocus(host, function(){
      host.innerHTML = '<div class="wp-cmp wp-cs-u"><div class="wp-cols"><section class="wp-col wp-col-u wp-col-show"><h4>Changes</h4>' + (d.changes.length ? unifiedHTML(d) : '<p class="tiny muted">The two versions are the same.</p>') + "</section></div>" + LEGEND + "</div>" +
        '<h4 class="wp-h">Tag each change</h4>' + changeListHTML(d.changes, M.tags, "mc");
    });
    host._changes = d.changes;
  }
  function paintMine(){
    if (!$("#wp-tabs")) mineShell();
    var T = C.my.tabs;
    MV.keepFocus($("#wp-tabs"), function(){ $("#wp-tabs").innerHTML = T.map(function(t, i){ var on = t.id === M.stage; return '<button type="button" class="wp-tab' + (on ? " on" : "") + '" data-tab="' + t.id + '" data-k="tab' + t.id + '"' + (on ? ' aria-current="step"' : "") + '><span class="wp-tabn">' + (i + 1) + "</span>" + t.t + "</button>"; }).join(""); });
    $("#wp-loopback").disabled = M.stage === T[0].id;
    $("#wp-panel").innerHTML = panelHTML();
    $$("#wp-panel [data-my]").forEach(function(t){ t.value = M[t.dataset.my] || ""; });
    var st = M.stage;
    if (st === "generate") { timerUI("ex", $("#wp-tm"), { total:C.my.minutes * 60, get:function(){ return M.fwLeft; }, set:function(v){ M.fwLeft = v; saveSoon(); }, done:"Time! Read it back and find one idea worth keeping." }); paintBoard(); }
    if (st === "focus") {
      radios($("#wp-fq"), { label:"Question", cls:"chips", options:C.my.focusQs.map(function(q, i){ return { id:String(i), t:q }; }), value:M.fqSel == null ? "" : M.fqSel, onChange:function(v){ M.fqSel = +v; api.save(); paintFq(); } });
      paintFq();
    }
    if (st === "plan") {
      thesisForge($("#wp-forge"), { chips:C.forge, state:M.chips, onChange:saveSoon, onBuild:function(t){ M.thesis = t; $("#wp-thesis").value = t; api.save(); counts(); $("#wp-thesis").focus(); } });
      paintMol();
    }
    if (st === "revise") paintMineCmp();
    counts();
  }
  function paintFq(){
    var h = $("#wp-fqa"); if (!h) return;
    if (M.fqSel == null) { h.innerHTML = ""; return; }
    h.innerHTML = '<div class="jq"><label for="wp-fqt">' + C.my.focusQs[M.fqSel] + '</label><textarea id="wp-fqt" class="wp-ta sm" data-fq="' + M.fqSel + '"></textarea></div>';
    $("#wp-fqt").value = M.fq[M.fqSel] || "";
  }
  function paintMol(){
    var h = $("#wp-mol"); if (!h) return;
    MV.keepFocus(h, function(){
      h.innerHTML = '<ol class="wp-olist" data-ol="my">' + M.outline.map(function(t, i){
        return '<li class="wp-olc"><span class="wp-olh" aria-hidden="true" data-drag="' + i + '">⋮⋮</span><span class="wp-oln">' + (i + 1) + '</span><label class="vh" for="wp-mo' + i + '">Point ' + (i + 1) + '</label><input id="wp-mo' + i + '" class="txtin wp-oin" type="text" data-mo="' + i + '" autocomplete="off">' +
          '<span class="wp-olb"><button type="button" class="btn ghost sm" data-mm="up" data-mi="' + i + '" data-k="mm' + i + 'u"' + (i === 0 ? " disabled" : "") + ' aria-label="Move point ' + (i + 1) + ' up">Move up</button><button type="button" class="btn ghost sm" data-mm="down" data-mi="' + i + '" data-k="mm' + i + 'd"' + (i === M.outline.length - 1 ? " disabled" : "") + ' aria-label="Move point ' + (i + 1) + ' down">Move down</button></span></li>';
      }).join("") + '</ol><div class="q-actions"><button type="button" class="btn ghost sm" data-mm="add" data-k="mmadd"' + (M.outline.length >= 3 ? " disabled" : "") + '>Add a third point</button>' + (M.outline.length > 2 ? '<button type="button" class="btn ghost sm" data-mm="rm" data-k="mmrm">Remove the last point</button>' : "") + "</div>";
      $$("[data-mo]", h).forEach(function(x){ x.value = M.outline[+x.dataset.mo] || ""; });
    });
  }
  function paintBoard(){
    var h = $("#wp-board"); if (!h) return;
    var nodes = M.bubbles.map(function(b, i){ var s = SLOTS[i % SLOTS.length]; return { id:b.id, t:b.t, x:s[0], y:s[1] }; });
    MV.keepFocus(h, function(){ h.innerHTML = nodes.length ? clusterHTML({ nodes:nodes, links:M.links, sel:fx.bsel }) : '<div class="wp-cl"><p class="tiny muted wp-empty">Your bubbles appear here.</p></div>'; });
    var by = {}; M.bubbles.forEach(function(b){ by[b.id] = b.t; });
    var L = M.links.filter(function(l){ return by[l[0]] && by[l[1]]; });
    MV.keepFocus($("#wp-links"), function(){
      $("#wp-links").innerHTML = (fx.bsel && by[fx.bsel] ? '<p class="tiny"><strong>Selected: ' + esc(by[fx.bsel]) + '.</strong> Tap another bubble to link them. <button type="button" class="linkbtn" data-brm="' + fx.bsel + '" data-k="brm">Remove this bubble</button></p>' : "") +
        (L.length ? '<p class="tiny"><strong>Links:</strong> ' + L.map(function(l, i){ return esc(by[l[0]]) + " — " + esc(by[l[1]]) + ' <button type="button" class="linkbtn" data-lrm="' + i + '" data-k="lrm' + i + '" aria-label="Remove the link ' + esc(by[l[0]]) + " to " + esc(by[l[1]]) + '">remove</button>'; }).join("; ") + "</p>" : "");
    });
  }
  function toggleLink(a, b){
    if (a === b) return;
    var k = -1; M.links.forEach(function(l, i){ if ((l[0] === a && l[1] === b) || (l[0] === b && l[1] === a)) k = i; });
    if (k >= 0) M.links.splice(k, 1); else M.links.push([a, b]);
  }
  function tapBubble(id){ if (fx.bsel && fx.bsel !== id) { toggleLink(fx.bsel, id); fx.bsel = null; api.save(); } else fx.bsel = fx.bsel === id ? null : id; paintBoard(); }
  function counts(){
    var a = $("#wp-fwc"); if (a) a.textContent = wc(M.fw) + " words";
    var d = $("#wp-dc"); if (d) d.textContent = wc(M.draft) + " words";
    var t = $("#wp-thc"); if (t) t.innerHTML = M.thesis.trim() ? thesisRow(M.thesis) : "";
    mineRead();
  }
  function mineEvents(){
    var root = $("#wp-mine"), drag = null;
    root.addEventListener("input", function(e){
      var t = e.target;
      if (t.dataset.my) { M[t.dataset.my] = t.value; saveSoon(); counts(); if (t.dataset.my === "draft" && $("#wp-mcmp")) { clearTimeout(fx.cmpT); fx.cmpT = setTimeout(paintMineCmp, 450); } }
      else if (t.dataset.fq != null) { M.fq[t.dataset.fq] = t.value; saveSoon(); }
      else if (t.dataset.mo != null) { M.outline[+t.dataset.mo] = t.value; saveSoon(); }
    });
    root.addEventListener("change", function(e){
      var t = e.target;
      if (t.dataset.hi != null) { M.hi[t.dataset.hi] = t.checked; api.save(); }
      else if (t.dataset.lo != null) { M.lo[t.dataset.lo] = t.checked; api.save(); }
      else if (t.dataset.mc) { M["cmp" + t.dataset.mc.toUpperCase()] = t.value; api.save(); paintMineCmp(); }
    });
    root.addEventListener("keydown", function(e){
      var b = e.target.closest("[data-bub]");
      if (b && (e.key === "l" || e.key === "L")) { e.preventDefault(); tapBubble(b.dataset.bub); var nb = $('#wp-board [data-bub="' + b.dataset.bub + '"]'); if (nb) nb.focus(); }
      else if (b && (e.key === "Delete" || e.key === "Backspace")) { e.preventDefault(); removeBubble(b.dataset.bub); }
      else if (e.target.id === "wp-bin" && e.key === "Enter") { e.preventDefault(); addBubble(); }
    });
    root.addEventListener("click", function(e){
      var b = e.target.closest("button"); if (!b || b.disabled) return;
      if (b.dataset.tab) { goStage(b.dataset.tab); return; }
      if (b.id === "wp-loopback") { var ids = C.my.tabs.map(function(t){ return t.id; }), i = ids.indexOf(M.stage); if (i > 0) goStage(ids[i - 1], true); return; }
      if (b.dataset.bub) { if (fx.noClick) { fx.noClick = false; return; } tapBubble(b.dataset.bub); return; }
      if (b.id === "wp-badd") { addBubble(); return; }
      if (b.dataset.brm) { removeBubble(b.dataset.brm); return; }
      if (b.dataset.lrm != null) { var by = {}; M.bubbles.forEach(function(x){ by[x.id] = 1; }); var L = M.links.filter(function(l){ return by[l[0]] && by[l[1]]; }), l = L[+b.dataset.lrm]; if (l) M.links.splice(M.links.indexOf(l), 1); api.save(); paintBoard(); return; }
      if (b.dataset.mm) {
        var mi = +b.dataset.mi;
        if (b.dataset.mm === "add") M.outline.push(""); else if (b.dataset.mm === "rm") M.outline.pop();
        else { var j = mi + (b.dataset.mm === "up" ? -1 : 1); if (j >= 0 && j < M.outline.length) { var tmp = M.outline[mi]; M.outline[mi] = M.outline[j]; M.outline[j] = tmp; } }
        api.save(); paintMol(); return;
      }
      if (b.id === "wp-nofix") { M.noFix = !M.noFix; api.save(); paintMine(); return; }
      if (b.dataset.ver) {
        var k = b.dataset.ver;
        if (!M.draft.trim()) { $("#wp-vst").textContent = "Write something in the draft first."; return; }
        if (M.v[k] != null && M.v[k] !== M.draft && !confirm("Replace your saved Draft " + k + " with the working draft?")) return;
        M.v[k] = M.draft; M.v[k + "t"] = Date.now(); api.save(); paintMine(); var st2 = $("#wp-vst"); if (st2) st2.textContent = "Saved as Draft " + k + "."; var nb2 = $('[data-ver="' + k + '"]'); if (nb2) nb2.focus(); return;
      }
      if (b.id === "wp-hidone") { M.hiDone = !M.hiDone; api.save(); paintMine(); var h2 = $("#wp-hidone"); if (h2) h2.focus(); return; }
      if (b.id === "wp-override") { M.override = true; api.save(); paintMine(); return; }
      if (b.dataset.ctag) { var cl = $("#wp-mcmp")._changes || [], c = cl[+b.dataset.ci]; if (c) { M.tags[c.key] = M.tags[c.key] === b.dataset.ctag ? undefined : b.dataset.ctag; api.save(); paintMineCmp(); mineRead(); } return; }
    });
    // pointer: drag from one bubble to another to link; drag an outline handle to reorder
    root.addEventListener("pointerdown", function(e){
      var bb = e.target.closest("[data-bub]"); if (bb) { drag = { bub:bb.dataset.bub, x:e.clientX, y:e.clientY }; return; }
      var hd = e.target.closest("#wp-mol [data-drag]"); if (hd) { drag = { ol:+hd.dataset.drag }; e.preventDefault(); try { hd.setPointerCapture(e.pointerId); } catch (err) {} }
    });
    root.addEventListener("pointerup", function(e){
      if (!drag) return; var d = drag; drag = null;
      if (d.bub) {
        if (Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y) < 8) return;
        var el = document.elementFromPoint(e.clientX, e.clientY), t = el && el.closest ? el.closest("[data-bub]") : null;
        if (t && t.dataset.bub !== d.bub) { toggleLink(d.bub, t.dataset.bub); fx.bsel = null; fx.noClick = true; setTimeout(function(){ fx.noClick = false; }, 50); api.save(); paintBoard(); }
        return;
      }
      if (d.ol != null) {
        var rows = $$("#wp-mol .wp-olc"), to = d.ol;
        rows.forEach(function(r, i){ var R = r.getBoundingClientRect(); if (e.clientY > R.top + R.height / 2) to = i; });
        if (e.clientY < rows[0].getBoundingClientRect().top) to = 0;
        if (to !== d.ol) { var v = M.outline.splice(d.ol, 1)[0]; M.outline.splice(to, 0, v); api.save(); paintMol(); }
      }
    });
  }
  function addBubble(){
    var inp = $("#wp-bin"), t = (inp.value || "").trim(); if (!t) { inp.focus(); return; }
    if (M.bubbles.length >= 12) { inp.value = ""; inp.placeholder = "12 bubbles is the limit"; return; }
    M.bubbles.push({ id:"b" + (M.nid++), t:t.slice(0, 24) }); inp.value = ""; api.save(); paintBoard(); inp.focus();
  }
  function removeBubble(id){ M.bubbles = M.bubbles.filter(function(b){ return b.id !== id; }); M.links = M.links.filter(function(l){ return l[0] !== id && l[1] !== id; }); if (fx.bsel === id) fx.bsel = null; api.save(); paintBoard(); var f = $("#wp-board [data-bub]") || $("#wp-bin"); if (f) f.focus(); }

  // ----- show / events -----
  function show(){ $("#wp-time").hidden = S.mode !== "time"; $("#wp-mine").hidden = S.mode !== "mine"; if (S.mode === "time") paintTime(); else paintMine(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !$("#wp-time").contains(b)) return;
    if (b.dataset.snap) {
      manual(); var id = b.dataset.snap;
      if (S.cmp) { if (id === S.snap || id === S.cmp) return; S.cmp = S.snap; S.snap = id; } else S.snap = id;
      if (S.snap !== "d2") S.resee = false;
      api.save(); paintTime(); MV.changed(); return;
    }
    if (b.dataset.ctl === "cmp") { manual(); if (S.cmp) S.cmp = null; else { var i = SNI[S.snap]; S.cmp = SN[i > 0 ? i - 1 : 1].id; } api.save(); paintTime(); MV.changed(); return; }
    if (b.dataset.ctl === "notes") { S.notes = !S.notes; api.save(); paintTime(); return; }
    if (b.dataset.ctl === "resee") { manual(); S.resee = !S.resee; api.save(); paintTime(); return; }
    if (b.dataset.sb) { if (b.dataset.sb === "play") { if (sbTimer) { stopStory(); MV.keepFocus($("#wp-sb"), function(){ $("#wp-sb").innerHTML = sbHTML(); }); } else playStory(false); } else { stopStory(); goStep(S.step + (b.dataset.sb === "step" ? 1 : -1), true); } return; }
    if (b.dataset.tc1) { S.tc1[b.dataset.tc1] = S.tc1[b.dataset.tc1] === b.dataset.v ? undefined : b.dataset.v; api.save(); paintTime(); MV.changed(); return; }
    if (b.dataset.om) { var i2 = +b.dataset.oi, j2 = i2 + (b.dataset.om === "up" ? -1 : 1), t2 = S.outline[i2]; S.outline[i2] = S.outline[j2]; S.outline[j2] = t2; api.save(); paintTime(); MV.changed(); var nb = $('[data-k="om' + t2 + (b.dataset.om === "up" ? "u" : "d") + '"]'); if (nb && !nb.disabled) nb.focus(); else { nb = $('[data-oc="' + t2 + '"] button:not([disabled])'); if (nb) nb.focus(); } return; }
    if (b.dataset.t3 != null) { var s3 = +b.dataset.t3; S.tc3 = S.tc3.sent === s3 ? {} : { sent:s3 }; api.save(); paintTime(); MV.changed(); return; }
    if (b.dataset.t3r) { S.tc3.fix = S.tc3.fix === b.dataset.t3r ? null : b.dataset.t3r; api.save(); paintTime(); MV.changed(); return; }
  });
  host.addEventListener("change", function(e){
    var t = e.target; if (!t.dataset.csel) return;
    manual(); var a = $('[data-csel="a"]').value, bb = $('[data-csel="b"]').value;
    if (a === bb) { var k = SNI[a]; bb = SN[k < SN.length - 1 ? k + 1 : k - 1].id; }
    S.snap = bb; S.cmp = a; api.save(); paintTime(); MV.changed();
    var f = $('[data-csel="' + (t.dataset.csel) + '"]'); if (f) f.focus();
  });
  // drag an outline card (challenge 2) by its handle
  var odrag = null;
  host.addEventListener("pointerdown", function(e){ var hd = e.target.closest('[data-ol="rw"] [data-drag]'); if (!hd) return; odrag = +hd.dataset.drag; e.preventDefault(); try { hd.setPointerCapture(e.pointerId); } catch (err) {} });
  host.addEventListener("pointerup", function(e){
    if (odrag == null) return; var from = odrag; odrag = null;
    var rows = $$('[data-ol="rw"] .wp-olc'), to = from; if (!rows.length) return;
    rows.forEach(function(r, i){ var R = r.getBoundingClientRect(); if (e.clientY > R.top + R.height / 2) to = i; });
    if (e.clientY < rows[0].getBoundingClientRect().top) to = 0;
    if (to !== from) { var v = S.outline.splice(from, 1)[0]; S.outline.splice(to, 0, v); api.save(); paintTime(); MV.changed(); }
  });
  document.addEventListener("click", function(e){
    var b = e.target.closest(".wp-setup"); if (!b) return;
    var id = b.dataset.setup; manual(); S.mode = "time"; modeRG.set("time");
    if (id === "tc1") { S.snap = "d2"; S.cmp = "d1"; }
    else if (id === "tc2") { S.snap = "d2"; S.cmp = null; S.sub = "outline"; S.outline = C.tc2.setup.slice(); }
    else { S.snap = "d2"; S.cmp = null; S.sub = "text"; S.resee = true; }
    api.save(); show(); MV.changed();
    var target = id === "tc1" ? $("#wp-logbox") : id === "tc3" ? $('.wp-t3b') : $("#wp-view");
    (target || $("#ex-app")).scrollIntoView({ block:id === "tc1" ? "start" : "center", behavior:MV.reduceMotion ? "auto" : "smooth" });
    var f = id === "tc1" ? $("#wp-logbox button") : id === "tc2" ? $('#wp-view [data-om]:not([disabled])') : $(".wp-t3b"); if (f) f.focus({ preventScroll:true });
  });
  mineShell(); mineEvents(); show();

  // ----- predictions -----
  function predStart(p){
    stopStory(); S.mode = "time"; modeRG.set("time"); manual();
    fx.special = p.id; fx.p1on = fx.p3cut = fx.p3on = fx.p4on = false; fx.p2order = (p.from || []).slice();
    if (p.id === "p1") fx.read = { words:"Paragraph 1: " + wc(SN[SNI.d1].pars[0].join(" ")) + " words; claims " + p.claims[0], stage:"Draft 1, paragraph 1", parts:"Summary only: no claim, no quotation", changes:"none yet" };
    if (p.id === "p2") fx.read = { stage:"Draft 2 outline", words:"4 body paragraphs", parts:"Topic sentences only", changes:"none yet" };
    if (p.id === "p3") fx.read = { stage:"Draft 1 · Draft", extra:["Comma fixes", "Draft 1 has " + SN[SNI.d1].commas.length + " places to fix a comma."], changes:"Draft 2 will cut paragraphs 1 and 2" };
    if (p.id === "p4") fx.read = { stage:"Drafting paragraph 2 of Draft 1", words:"Draft 1 in progress", parts:'<span class="muted">still drafting</span>', changes:"none yet" };
    show();
  }
  function predRun(p, done){
    fx.anim = true;
    if (p.id === "p1") {
      fx.p1on = true; var el = $(".wp-p1"); if (el) el.classList.add("on");
      MV.wait(2600, function(){ fx.read.words = "Paragraph 1: " + wc(SN[SNI.d1].pars[0].join(" ")) + " → " + wc(SN[SNI.d2].pars[0].join(" ")) + " words; claims " + p.claims[0] + " → " + p.claims[1]; fx.read.parts = "After: a claim and 1 quotation, cited"; fx.read.changes = "4 summary sentences cut; 2 sentences added"; $("#wp-read").innerHTML = MV.readoutHTML(readRows()); done(); });
    } else if (p.id === "p2") {
      var before = {}; $$(".wp-ol .wp-olc").forEach(function(r){ before[r.dataset.oc] = r.getBoundingClientRect().top; });
      fx.p2order = MV.ans(C.tc2).slice(); $("#wp-view").innerHTML = specialHTML();
      var after = $$(".wp-ol .wp-olc"), tp = $(".wp-tenp"); if (tp) tp.classList.add("wp-hide");
      after.forEach(function(r){ var dy = (before[r.dataset.oc] || 0) - r.getBoundingClientRect().top; r.style.transform = dy ? "translateY(" + dy.toFixed(1) + "px)" : ""; });
      requestAnimationFrame(function(){ requestAnimationFrame(function(){ after.forEach(function(r){ r.classList.add("wp-slide"); r.style.transform = ""; }); }); });
      MV.wait(1500, function(){ var p2 = $(".wp-tenp"); if (p2) p2.classList.remove("wp-hide"); fx.read.extra = ["Order", "The ending moved from second to last; the tension line now rises to the end."]; fx.read.changes = "1 paragraph moved: second → last"; $("#wp-read").innerHTML = MV.readoutHTML(readRows()); MV.wait(800, done); });
    } else if (p.id === "p3") {
      fx.p3on = true; $$(".wp-cf").forEach(function(m){ m.classList.add("on"); });
      MV.wait(1500, function(){
        fx.p3cut = true; $$('.wp-draft [data-par="0"], .wp-draft [data-par="1"]').forEach(function(x){ x.classList.add("wp-cutting"); });
        var lost = SN[SNI.d1].commas.filter(function(c){ return c[0] < 2; }).length;
        fx.read.extra = ["Comma fixes", SN[SNI.d1].commas.length + " in Draft 1 · " + lost + " lost when paragraphs 1 and 2 were cut"]; $("#wp-read").innerHTML = MV.readoutHTML(readRows());
        MV.wait(1300, done);
      });
    } else if (p.id === "p4") {
      var lp = $(".wp-loop"); if (lp) lp.classList.add("on");
      ["draft", "plan", "focus"].forEach(function(st, i){ MV.wait(300 + i * 450, function(){ $$(".wp-pill").forEach(function(x, k){ x.classList.toggle("on", C.stages[k].id === st || (i === 2 && C.stages[k].id === "plan")); }); }); });
      MV.wait(1800, function(){ fx.p4on = true; $("#wp-view").innerHTML = specialHTML(); fx.read.stage = "Looped back: Draft → Focus and Plan"; fx.read.changes = "Thesis revised; the outline follows it"; $("#wp-read").innerHTML = MV.readoutHTML(readRows()); MV.wait(900, done); });
    } else done();
  }

  // ----- challenges -----
  function tc1(){
    var tagged = LOG.filter(function(c){ return S.tc1[c.id]; }).length;
    var bad = LOG.filter(function(c){ return S.tc1[c.id] && S.tc1[c.id] !== MV.ans(c); });
    if (tagged === LOG.length && !bad.length) return { ok:true };
    for (var k in C.tc1.wrong) { var q = k.split("|"); if (S.tc1[q[0]] === q[1]) return { ok:false, msg:C.tc1.wrong[k] }; }
    if (tagged < LOG.length) return { ok:false, msg:"Tag all " + LOG.length + " changes first (" + (LOG.length - tagged) + " left). Press Compare with Draft 1 and Draft 2 to see the change log." };
    return { ok:false, msg:C.tc1.general + " (" + plural(bad.length, "change") + " in the wrong group.)" };
  }
  function tc2(){
    var o = S.outline, A = MV.ans(C.tc2);
    if (o.join() === A.join()) return { ok:true };
    if (o[0] === "d") return { ok:false, msg:C.tc2.dFirst };
    if (o.indexOf("c") < o.indexOf("b")) return { ok:false, msg:C.tc2.cBeforeB };
    return { ok:false, msg:C.tc2.general };
  }
  function tc3(){
    var t = S.tc3, ans = MV.ans(C.tc3);
    if (t.sent == null) return { ok:false, msg:"Open Draft 2, turn on “Tap sentences in ¶3”, and tap the sentence that doesn’t serve the claim." };
    if (t.sent !== ans) return { ok:false, msg:C.tc3.sentFb[t.sent] };
    if (!t.fix) return { ok:false, msg:"You found it. Now choose a repair." };
    var r = C.tc3.repairs.filter(function(x){ return x.id === t.fix; })[0];
    if (r && MV.ok(r)) return { ok:true };
    return { ok:false, msg:r && r.fb ? r.fb : "Choose a repair that makes the paragraph serve its claim." };
  }
  EX = {
    predict:{ start:predStart, run:predRun },
    challenge:function(id){ return id === "tc1" ? tc1() : id === "tc2" ? tc2() : id === "tc3" ? tc3() : { ok:false }; },
    tc1Solved:function(){ var st = MV.S.chal && MV.S.chal.tc1; return !!(st && st.solved); },
    onShow:function(){ if (S.mode === "time") paintTime(); else paintMine(); if (!S.storySeen && S.mode === "time") { S.storySeen = true; api.save(); if (!MV.reduceMotion) playStory(true); } },
    stop:function(){ stopStory(); },
    mine:M
  };
  $("#chal") && $("#chal").addEventListener("click", function(e){ if (e.target.closest('[data-act="check"]')) setTimeout(function(){ if (S.mode === "time") $("#wp-read").innerHTML = MV.readoutHTML(readRows()); $("#wp-aha").hidden = !(S.storyDone || EX.tc1Solved()); }, 0); });
  return EX;
}

// ---------- Part 3: Revision is re-seeing (three passes; @component E6 citation builder; @component E5 sentenceLab) ----------
// E5 sentenceLab: a sentence built from fixed text and slot chips (verb, dead words, ending); readouts for words and the last
// word (the emphasis position). lab(segs, choice) -> text. E6 here: signal-phrase chips + an MLA paragraph-citation builder.
function labText(lab, ch){ return lab.segs.map(function(sg){ return sg.k ? sg.opts[(ch && ch[sg.k]) || 0].t : sg.t; }).join(""); }
function lastWord(t){ var w = MV.eng.words(t); return w.length ? MV.eng.norm(w[w.length - 1]) : ""; }
var P3 = null;
function part3(host, api){
  var R = api.content.re, S = api.S, N = R.sents.length;
  var CL = MV.shuffle(R.claims, "wp-claims"), AN = MV.shuffle(R.ana, "wp-ana");
  S.dec = S.dec || {}; S.lab = S.lab || {}; S.pass = [1, 2, 3, 4].indexOf(+S.pass) >= 0 ? +S.pass : 1;
  var ORIG = R.sents.map(function(s){ return s.t; }).join(" ");
  function role(i){ return MV.ans(R.sents[i]); }
  function claimText(){ if (S.claim === "own") return (S.own || "").trim().replace(/[.!?]*$/, "") + "."; var c = R.claims.filter(function(x){ return x.id === S.claim; })[0]; return c ? c.t + "." : ""; }
  function claimOK(){ if (S.claim === "own") { var t = (S.own || "").trim(); return wc(t) >= 8 && !/\b(is|are) about\b|^\s*this (essay|paragraph)\b/i.test(t); } var c = R.claims.filter(function(x){ return x.id === S.claim; })[0]; return !!c && MV.ok(c); }
  function kept(i){ return (S.dec[i] || "keep") === "keep"; }
  function labFor(of){ return R.labs.filter(function(l){ return l.of === of; })[0]; }
  function sigSentence(){
    var sg = S.sig != null ? R.sig[S.sig] : null; if (!sg) return R.quote;
    var cite = S.cited ? " (" + (S.cau ? "Mansfield, " : "") + "par. " + S.cpar + ")" : "";
    return cap(sg) + (/,$/.test(sg) ? " " : ", ") + R.quote + cite + ".";
  }
  function compose(){
    var out = [], p3 = S.p2;
    if (S.p1 && claimText()) {
      var L3 = labFor("claim"); out.push({ role:"claim", t:p3 && S.claim === "c1" && L3 ? labText(L3, S.lab.L3) : claimText() });
    }
    for (var i = 0; i < N; i++) {
      if (S.p1 && !kept(i)) continue;
      var r = role(i), t = R.sents[i].t;
      if (r === "evidence" && S.p1) { t = S.p2 || S.sig != null ? sigSentence() : t; }
      var L = labFor(i); if (L && p3) t = labText(L, S.lab[L.id]);
      out.push({ role:r, t:t, i:i });
      if (r === "evidence" && S.ana != null && (S.p2 || S.pass >= 2)) out.push({ role:"analysis", t:R.ana[S.ana].t });
    }
    return out;
  }
  function serving(list){
    if (!S.p1) { var n = 0; for (var i = 0; i < N; i++) if (role(i) === "point") n++; return [n, N]; }
    var s = list.filter(function(x){ return ["claim", "evidence", "point", "link", "analysis"].indexOf(x.role) >= 0; }).length; return [s, list.length];
  }
  function counts(t){ return { words:wc(t), there:(t.match(/\bthere (is|are)\b/gi) || []).length, dead:(t.match(/\b(really|very)\b/gi) || []).length, last:lastWord(t) }; }
  function lastNote(w){ return R.strong[w] ? " (" + R.strong[w] + ")" : ""; }
  function readRows(){
    var list = compose(), now = list.map(function(x){ return x.t; }).join(" "), o = counts(ORIG), c = counts(now), sv = serving(list), rows = [];
    rows.push(["Pass 1", "Sentences serving the claim: 1/" + N + " → " + sv[0] + "/" + sv[1]]);
    var intro = S.p2 || S.sig != null ? 1 : 0, cited = S.cited ? 1 : 0, expl = S.ana != null && MV.ok(R.ana[S.ana]) ? 1 : 0;
    rows.push(["Pass 2", "Quotations introduced 0/1 → " + intro + "/1 · cited 0/1 → " + cited + "/1 · explained 0/1 → " + expl + "/1"]);
    rows.push(["Pass 3", "Words " + o.words + " → " + c.words + " · “there is / there are” " + o.there + " → " + c.there + " · weak intensifiers (“really”, “very”) " + o.dead + " → " + c.dead + " · last word of the final sentence: “" + c.last + "”" + lastNote(c.last)]);
    return rows;
  }
  var PP = { claim:["pp-claim", "Claim"], evidence:["pp-evidence", "Evidence"], analysis:["pp-analysis", "Analysis"], link:["pp-link", "Link"], point:["pp-analysis", "Analysis"], summary:["pp-sum", "Summary"], off:["pp-sum", "Off the text"] };
  function nowHTML(){
    var list = compose();
    if (!S.p1) return esc(ORIG);
    return list.map(function(x){ var p = PP[x.role] || PP.summary; return '<span class="wp-pp ' + p[0] + '"><span class="wp-ppt">' + p[1] + "</span>" + esc(x.t) + "</span>"; }).join(" ");
  }
  host.innerHTML = '<div class="wp-p3"><p>' + R.intro + '</p><div class="wp-passbar" id="wp-passbar" role="group" aria-label="Revision passes"></div><div class="wp-body"><div class="wp-p3main" id="wp-p3main"></div><div class="wp-read"><p class="wp-read-h">Readout</p><dl class="read" id="wp-p3read" aria-live="polite"></dl></div></div>' +
    '<div class="wp-now"><h4>The paragraph now</h4><p id="wp-p3now" class="wp-nowp"></p></div></div>';
  var PASSES = [["1", "Pass 1: Focus"], ["2", "Pass 2: Evidence and analysis"], ["3", "Pass 3: Sentences"], ["4", "Before and after"]];
  function unlocked(n){ return n === 1 || (n === 2 && S.p1) || (n === 3 && S.p2) || (n === 4 && S.p3); }
  function paintBar(){ MV.keepFocus($("#wp-passbar"), function(){ $("#wp-passbar").innerHTML = PASSES.map(function(p){ var n = +p[0], on = S.pass === n, done = n === 1 ? S.p1 : n === 2 ? S.p2 : n === 3 ? S.p3 : false; return '<button type="button" class="wp-pass' + (on ? " on" : "") + '" data-pass="' + n + '" data-k="pass' + n + '"' + (on ? ' aria-current="step"' : "") + (unlocked(n) ? "" : " disabled") + ">" + (done ? "✓ " : "") + p[1] + (unlocked(n) ? "" : vh(" (locked)")) + "</button>"; }).join(""); }); }
  function fb(kind, html){ return MV.fbHTML(kind, (kind === "good" ? "<strong>✓</strong> " : "<strong>✗ Not yet.</strong> ") + html); }
  function pass1HTML(){
    return '<h4 class="wp-h">Choose the claim every sentence must serve</h4><div id="wp-claim"></div><div class="jq" id="wp-ownw"' + (S.claim === "own" ? "" : " hidden") + '><label for="wp-own">My own claim</label><input id="wp-own" class="txtin" type="text" autocomplete="off"></div>' +
      '<h4 class="wp-h">Keep, cut or rewrite each sentence</h4><p class="tiny muted">Rewrite means the sentence goes, and Pass 2 replaces it with analysis.</p><ol class="wp-p1l">' + R.sents.map(function(s, i){ return '<li><span class="wp-p1s">' + esc(s.t) + '</span><span data-dec="' + i + '"></span></li>'; }).join("") + "</ol>" +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="wp-chk1">Check pass 1</button></div><div id="wp-fb1">' + (S.fb1 ? fb(S.fb1[0], S.fb1[1]) : "") + "</div>";
  }
  function pass2HTML(){
    return '<h4 class="wp-h">Introduce the quotation</h4><p>The evidence: ' + R.quote + ' <button type="button" class="linkbtn" data-story="' + R.quotePar + '">Find it in the story</button></p><div id="wp-sig"></div>' +
      '<h4 class="wp-h">Cite it (MLA)</h4><div class="wp-mla" role="group" aria-label="MLA citation builder"><label>par. <select class="wp-sel" id="wp-cpar">' + MV.C.start.story.pars.map(function(_, i){ return '<option value="' + (i + 1) + '"' + ((S.cpar || 1) === i + 1 ? " selected" : "") + ">" + (i + 1) + "</option>"; }).join("") + '</select></label><label class="wp-chkl"><input type="checkbox" id="wp-cau"' + (S.cau !== false ? " checked" : "") + '> name Mansfield</label><button type="button" class="btn ghost sm" id="wp-cins">Insert citation</button></div><p class="tiny muted" id="wp-cprev" aria-live="polite"></p>' +
      '<h4 class="wp-h">Explain it</h4><div id="wp-ana"></div><div class="q-actions"><button type="button" class="btn primary sm" id="wp-chk2">Check pass 2</button></div><div id="wp-fb2">' + (S.fb2 ? fb(S.fb2[0], S.fb2[1]) : "") + "</div>";
  }
  function pass3HTML(){
    var labs = R.labs.filter(function(l){ return l.of === "claim" ? S.claim === "c1" : kept(l.of); });
    return '<p class="tiny muted">Revise three sentences in the sentence lab: cut dead words, choose stronger verbs, and end a sentence on its key word. Watch the readouts.</p>' +
      (S.claim !== "c1" ? '<p class="tiny">You wrote your own claim, so polish it yourself: <em>' + esc(claimText()) + "</em></p>" : "") +
      labs.map(function(l){ var t = labText(l, S.lab[l.id]), lw = lastWord(t); return '<div class="wp-lab" data-lab="' + l.id + '"><p class="wp-labh"><strong>' + l.label + '</strong> · ' + wc(t) + " words · last word: “" + lw + "”" + lastNote(lw) + '</p><p class="wp-labt">' + esc(t) + "</p>" + l.segs.filter(function(sg){ return sg.k; }).map(function(sg){ return '<div data-slot="' + l.id + "|" + sg.k + '"></div>'; }).join("") + "</div>"; }).join("") +
      (labs.length ? "" : '<p class="tiny muted">You cut the sentences the lab works on. Finish the pass to compare.</p>') +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="wp-chk3">Finish pass 3</button></div><div id="wp-fb3">' + (S.p3 ? fb("good", "Pass 3 done. Compare the two versions in Before and after.") : "") + "</div>";
  }
  function whyList(){
    var L = [], cut = 0, off = false;
    for (var i = 0; i < N; i++) if (!kept(i)) { if (role(i) === "off") off = true; else if (role(i) === "summary") cut++; }
    L.push("<strong>Focus:</strong> you chose the claim “" + esc(claimText().replace(/\.$/, "")) + "” and cut or rewrote " + plural(cut, "summary sentence") + (off ? ", plus the sentence about society in general" : "") + ". Every sentence left serves one claim.");
    L.push("<strong>Evidence and analysis:</strong> you introduced " + R.quote + " with a signal phrase, cited it (" + (S.cau ? "Mansfield, " : "") + "par. " + S.cpar + "), and added a sentence that explains what the exclamation shows.");
    var ch = [];
    R.labs.forEach(function(l){ if (l.of === "claim" ? S.claim !== "c1" : !kept(l.of)) return; l.segs.forEach(function(sg){ if (sg.k) { var o = sg.opts[(S.lab[l.id] || {})[sg.k] || 0]; if (o.why) ch.push(o.why); } }); });
    var uniq = ch.filter(function(x, k){ return ch.indexOf(x) === k; });
    L.push("<strong>Sentences:</strong> " + (uniq.length ? "you " + uniq.map(function(x){ return /^(a stronger|end|names)/.test(x) ? (/^end/.test(x) ? x : "chose " + x) : x; }).join("; ") + "." : "you kept the sentences as they were. Try the lab’s options to hear the difference."));
    return "<ul>" + L.map(function(x){ return "<li>" + x + "</li>"; }).join("") + "</ul>";
  }
  function pass4HTML(){
    var now = compose().map(function(x){ return x.t; }).join(" ");
    return '<div class="wp-ba"><section><h4>Original (' + wc(ORIG) + ' words)</h4><p class="wp-bap">' + esc(ORIG) + '</p><button type="button" class="btn ghost sm wp-say" data-say="o" hidden>Listen to the original</button></section><section><h4>Revised (' + wc(now) + ' words)</h4><p class="wp-bap">' + nowHTML() + '</p><button type="button" class="btn ghost sm wp-say" data-say="r" hidden>Listen to the revision</button></section></div>' +
      '<p class="tiny muted wp-saynote" hidden>' + MV.C.hero.noVoice + "</p><h4 class=\"wp-h\">What changed and why</h4>" + whyList() + '<div class="q-actions"><button type="button" class="btn ghost sm" id="wp-p3reset">Start the passes again</button></div>';
  }
  function paintMain(){
    var m = $("#wp-p3main");
    MV.keepFocus(m, function(){ m.innerHTML = S.pass === 1 ? pass1HTML() : S.pass === 2 ? pass2HTML() : S.pass === 3 ? pass3HTML() : pass4HTML(); });
    if (S.pass === 1) {
      radios($("#wp-claim"), { label:"", aria:"Claim", cls:"chips", options:CL.map(function(c){ return { id:c.id, t:c.t }; }).concat([{ id:"own", t:"Write my own" }]), value:S.claim || "", onChange:function(v){ S.claim = v; S.fb1 = null; $("#wp-ownw").hidden = v !== "own"; api.save(); paintLive(); } });
      $("#wp-own").value = S.own || "";
      $$("[data-dec]").forEach(function(h){ var i = +h.dataset.dec; radios(h, { label:"", aria:"Sentence " + (i + 1), options:[{ id:"keep", t:"Keep" }, { id:"cut", t:"Cut" }, { id:"rew", t:"Rewrite" }], value:S.dec[i] || "keep", onChange:function(v){ S.dec[i] = v; S.fb1 = null; api.save(); paintLive(); } }); });
    }
    if (S.pass === 2) {
      radios($("#wp-sig"), { label:"Signal phrase", cls:"chips", options:R.sig.map(function(t, i){ return { id:String(i), t:t }; }), value:S.sig == null ? "" : S.sig, onChange:function(v){ S.sig = +v; api.save(); paintLive(); } });
      radios($("#wp-ana"), { label:"", aria:"Analysis sentence", cls:"chips wp-col1", options:AN.map(function(a){ return { id:String(R.ana.indexOf(a)), t:a.t }; }), value:S.ana == null ? "" : S.ana, onChange:function(v){ S.ana = +v; api.save(); paintLive(); } });
      citePrev();
    }
    if (S.pass === 3) $$("[data-slot]").forEach(function(h){
      var q = h.dataset.slot.split("|"), l = R.labs.filter(function(x){ return x.id === q[0]; })[0], sg = l.segs.filter(function(x){ return x.k === q[1]; })[0];
      var nm = { open:"Opening", verb:"Verb", tail:"Ending", mid:"Middle", end:"Ending" }[q[1]] || q[1];
      radios(h, { label:nm, cls:"chips", options:sg.opts.map(function(o, i){ var x = o.t.trim(); return { id:String(i), t:!x ? "(cut it)" : x === "." ? "(end the sentence here)" : (["mid", "end", "tail"].indexOf(q[1]) >= 0 ? "…" : "") + esc(x) }; }), value:String(((S.lab[l.id] || {})[q[1]]) || 0), onChange:function(v){ (S.lab[l.id] = S.lab[l.id] || {})[q[1]] = +v; api.save(); repaintLab(l); paintLive(); } });
    });
    if (S.pass === 4) voiceReady(function(v){ $$(".wp-say").forEach(function(b){ b.hidden = !v; }); var n = $(".wp-saynote"); if (n) n.hidden = !!v; });
  }
  function repaintLab(l){ var box = $('[data-lab="' + l.id + '"]'); if (!box) return; var t = labText(l, S.lab[l.id]), lw = lastWord(t); $(".wp-labh", box).innerHTML = "<strong>" + l.label + "</strong> · " + wc(t) + " words · last word: “" + lw + "”" + lastNote(lw); $(".wp-labt", box).textContent = t; }
  function citePrev(){ var p = $("#wp-cprev"); if (!p) return; var par = +$("#wp-cpar").value, au = $("#wp-cau").checked; p.textContent = "Citation: (" + (au ? "Mansfield, " : "") + "par. " + par + ")" + (S.cited ? " · inserted" : ""); }
  function paintLive(){ $("#wp-p3read").innerHTML = MV.readoutHTML(readRows()); $("#wp-p3now").innerHTML = nowHTML(); }
  function paint(){ paintBar(); paintMain(); paintLive(); }
  host.addEventListener("input", function(e){ if (e.target.id === "wp-own") { S.own = e.target.value; S.fb1 = null; api.save(); paintLive(); } });
  host.addEventListener("change", function(e){ if (e.target.id === "wp-cpar" || e.target.id === "wp-cau") { if (S.cited) { S.cpar = +$("#wp-cpar").value; S.cau = $("#wp-cau").checked; api.save(); paintLive(); } citePrev(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.pass) { S.pass = +b.dataset.pass; api.save(); paint(); return; }
    if (b.id === "wp-chk1") {
      var msg = null;
      if (!S.claim) msg = R.fb.noClaim;
      else if (!claimOK()) { var c = R.claims.filter(function(x){ return x.id === S.claim; })[0]; msg = c ? c.fb : R.fb.ownClaim; }
      else {
        for (var i = 0; i < N && !msg; i++) {
          var r = role(i), d = S.dec[i] || "keep";
          if (r === "summary" && d === "keep") msg = R.fb.summary.replace("{n}", i + 1);
          else if (r === "off" && d === "keep") msg = R.fb.off;
          else if (r === "off" && d === "rew") msg = R.fb.offRewrite;
          else if (r === "evidence" && d === "cut") msg = R.fb.evidence;
        }
      }
      if (!S.claim && !msg) msg = R.fb.noClaim;
      if (msg) { S.fb1 = ["bad", msg]; S.p1 = false; } else { S.fb1 = ["good", R.fb.done]; S.p1 = true; if (S.dec[4] === "rew") S.dec[4] = "keep"; }
      api.save(); paint(); MV.focusFb($("#wp-p3main")); return;
    }
    if (b.id === "wp-cins") { S.cited = true; S.cpar = +$("#wp-cpar").value; S.cau = $("#wp-cau").checked; api.save(); citePrev(); paintLive(); return; }
    if (b.id === "wp-chk2") {
      var m2 = null;
      if (S.sig == null) m2 = R.fb2.sig; else if (!S.cited) m2 = R.fb2.cite; else if (S.cpar !== R.quotePar) m2 = R.fb2.wrongPar; else if (S.ana == null) m2 = R.fb2.ana; else if (!MV.ok(R.ana[S.ana])) m2 = R.ana[S.ana].fb;
      if (m2) { S.fb2 = ["bad", m2]; S.p2 = false; } else { S.fb2 = ["good", R.fb2.done]; S.p2 = true; }
      api.save(); paint(); MV.focusFb($("#wp-p3main")); return;
    }
    if (b.id === "wp-chk3") { S.p3 = true; S.pass = 4; api.save(); paint(); var f = $("#wp-passbar [data-pass='4']"); if (f) f.focus(); return; }
    if (b.id === "wp-p3reset") { if (!confirm("Clear your three passes and start again?")) return; ["claim", "own", "p1", "p2", "p3", "sig", "cited", "cpar", "cau", "ana", "fb1", "fb2"].forEach(function(k){ delete S[k]; }); S.dec = {}; S.lab = {}; S.pass = 1; api.save(); paint(); return; }
    if (b.dataset.say) { var txt = b.dataset.say === "o" ? ORIG : compose().map(function(x){ return x.t; }).join(" "); if (b.textContent.indexOf("Stop") === 0) { MV.eng.stop(); return; } var lab0 = b.textContent; b.textContent = "Stop"; speak(txt, { onEnd:function(){ b.textContent = lab0; } }); return; }
  });
  paint();
  stealInit();
  P3 = { refresh:paint };
  return P3;
}
// Sentence to steal: structural checks (Although, two dashes, 25+ words) and "Save to my commonplace book"
function stealInit(){
  var box = $('[data-block="steal"]'), ta = $("#w-steal"); if (!box || !ta || $("#wp-stc")) return;
  var labs = MV.C.part3.stealChecks, row = document.createElement("div");
  row.innerHTML = '<ul class="checks" id="wp-stc"></ul><div class="q-actions"><button type="button" class="btn ghost sm" id="wp-stsave">Save to my commonplace book</button><span class="tiny muted" id="wp-stst" aria-live="polite"></span></div>';
  box.appendChild(row);
  function test(){
    var t = ta.value.trim().replace(/^["“‘']+/, ""), dashes = (t.match(/—|–|--|\s-\s/g) || []).length;
    return [/^although\b/i.test(t), dashes >= 2, wc(t) >= 25];
  }
  function paint(){ var r = test(); $("#wp-stc").innerHTML = labs.map(function(l, i){ return '<li class="' + (r[i] ? "yes" : "no") + '"><span class="mk" aria-hidden="true">' + (r[i] ? "✓" : "○") + "</span><span>" + l + vh(r[i] ? " (met)" : " (not met)") + "</span></li>"; }).join(""); }
  ta.addEventListener("input", paint); paint();
  row.addEventListener("click", function(e){
    if (e.target.id !== "wp-stsave") return;
    var t = ta.value.trim(), st = $("#wp-stst");
    if (!t) { st.textContent = "Write your imitation first."; return; }
    var master = MV.plain($(".wp-steal", box).innerHTML).replace(/^“|”$/g, "") + " (Mansfield, par. 1)";
    st.textContent = MV.eng.saveLine(master, "My imitation: " + t, "05. The Writing Process (Sentence to steal)") ? "Saved to your commonplace book: the master’s sentence and your imitation." : "";
  });
}

// ---------- Practice 2: Revise it (★): the toolkit's practice multiple choice, plus "what kind of revision is it?" ----------
function reviseIt(host, api, a){
  var S = api.S; S.kind = S.kind || {};
  var items = a.items.map(function(it){
    var p = '<p class="wp-rlab">' + it.label + (it.star ? ' <span class="tag">★</span>' : "") + '</p><div class="wp-orig">' + it.orig + "</div>" + (it.note ? '<p class="tiny muted">' + it.note + "</p>" : "") + "<p>Choose the revision that best improves it.</p>";
    return Object.assign({}, it, { prompt:p });
  });
  host.innerHTML = '<div class="wp-rv"></div>';
  var made = MV.activityTypes.mc($(".wp-rv", host), Object.assign({}, a, { items:items, how:a.how }));
  function paintKinds(){
    items.forEach(function(it){
      var box = host.querySelector('[data-mq="' + it.id + '"]'); if (!box) return;
      var k = host.querySelector('[data-kfor="' + it.id + '"]');
      if (!k) { k = document.createElement("div"); k.className = "wp-kind"; k.setAttribute("data-kfor", it.id); box.parentNode.insertBefore(k, box.nextSibling); }
      var st = (S.items || {})[it.id] || {};
      if (!st.solved) { k.innerHTML = ""; return; }
      var v = S.kind[it.id], ans = MV.ans(it);
      MV.keepFocus(k, function(){
        k.innerHTML = '<p class="tiny"><strong>What kind of revision is it?</strong></p><div class="chips" role="group" aria-label="Kind of revision">' + a.kinds.map(function(x){ return '<button type="button" class="chip' + (v === x.id ? " on" : "") + '" aria-pressed="' + (v === x.id) + '" data-kind="' + x.id + '" data-k="kd' + it.id + x.id + '">' + x.t + "</button>"; }).join("") + "</div>" +
          (v ? MV.fbHTML(v === ans ? "good" : "bad", (v === ans ? "<strong>✓</strong> " : "<strong>✗</strong> ") + a.kindFb[v === ans ? "hi" : "lo"]) : "");
      });
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-kind]");
    if (b) { var id = b.closest("[data-kfor]").getAttribute("data-kfor"); S.kind[id] = b.dataset.kind; api.save(); paintKinds(); MV.focusFb(host.querySelector('[data-kfor="' + id + '"]')); return; }
    setTimeout(paintKinds, 0);
  });
  paintKinds();
  return made;
}

// ---------- Practice 3: @component K13 spotProse — Spot the Error for a paragraph (copied from ENG4U 02; numbered sentences) ----------
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

// ---------- Performance task: From freewrite to focused paragraph (E17 scaffolds; structure only) ----------
var task = (function(){
  var api = null, T = null;
  function explain(){ var e = $("#task-explain"); return e ? e.value : (MV.taskState().explain || ""); }
  function data(S){
    S = S || {};
    var d1 = S.d1 || "", d2 = S.d2 || "", d = diff(parasOf(d1), parasOf(d2));
    return { fw:S.fw || "", thesis:S.thesis || "", d1:d1, d2:d2, changes:d.changes, n:d.n, tags:S.tags || {}, explain:explain() };
  }
  function checks(d){
    var th = thesisInfo(d.thesis), Q = quotesIn(d.d2), n2 = wc(d.d2), tc = tagCounts(d.changes, d.tags);
    return [wc(d.fw) >= 80, th.text && th.author && th.ends, th.full, n2 >= 120 && n2 <= 200, Q.some(function(q){ return citedQ(d.d2, q); }), d.n >= 3 && tc.hi >= 1, wc(d.explain) >= 40];
  }
  function tips(d, res){
    var out = [];
    res.forEach(function(ok, i){
      if (ok) return;
      if (i === 4) { var Q = quotesIn(d.d2); if (Q.some(function(q){ return nearCite(d.d2, q); })) { out.push(T.citeClose); return; } }
      if (i === 5 && d.n >= 3) { out.push("Tag at least one change “Revising (higher-order)” in the change log."); return; }
      out.push(T.tips[i]);
    });
    return out;
  }
  function changesHTML(d){ return '<p class="tiny muted">Changes found between Draft 1 and Draft 2: ' + d.changes.length + " (" + d.n + " that change the text).</p>" + changeListHTML(d.changes, api.S.tags, "tk"); }
  function paintLog(){ var h = $("#tk-log"); if (!h) return; var d = data(api.S); MV.keepFocus(h, function(){ h.innerHTML = d.d1.trim() && d.d2.trim() ? changesHTML(d) : '<p class="tiny muted">Write Draft 1 and Draft 2; the changes between them appear here for you to tag.</p>'; }); h._changes = d.changes; }
  function counts(){
    var S = api.S;
    $("#tk-fwc").textContent = wc(S.fw) + " words (80 or more)";
    $("#tk-thc").innerHTML = (S.thesis || "").trim() ? thesisRow(S.thesis) : "";
    $("#tk-d1c").textContent = wc(S.d1) + " words";
    var n2 = wc(S.d2), Q = quotesIn(S.d2 || ""), c = Q.filter(function(q){ return citedQ(S.d2, q); }).length;
    $("#tk-d2c").textContent = n2 + " words (120–200) · " + plural(Q.length, "quotation") + ", " + c + " cited";
  }
  function preview(){
    var el = $("#tk-pv"); if (!el) return;
    var S = api.S, ok = checks(data(S)).every(Boolean);
    var h = '<h4 style="margin-top:0">Your revised paragraph</h4>' + ((S.d2 || "").trim() ? '<p class="wp-tkp">' + esc(S.d2).replace(/\n/g, "<br>") + "</p>" : '<p class="tiny muted">Draft 2 appears here.</p>');
    var tried = S.tried || [];
    if (tried.length) h += '<p class="tiny"><strong>Focuses you’ve tried:</strong></p><ul class="tiny">' + tried.map(function(t){ return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>";
    if (ok) h += '<div class="fb good"><p><strong>✓ ' + T.success + "</strong></p></div>" + T.models.map(function(m){ return '<details class="alg wp-model"><summary>' + m.title + " (" + wc(m.text) + ' words)</summary><p class="tiny"><strong>Working thesis:</strong> ' + m.thesis + "</p><p>" + m.text + '</p><p class="tiny"><strong>Change log:</strong> ' + m.log + '</p><p class="tiny"><strong>Craft statement:</strong> ' + m.craft + "</p></details>"; }).join("");
    el.innerHTML = h;
  }
  function all(){ api.save(); counts(); preview(); api.update(); MV.paintSummary(); }
  var logT = null;
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; var S = a.S; S.tags = S.tags || {}; S.chips = S.chips || {}; S.left = S.left >= 0 && S.left <= 300 ? +S.left : 300;
      ["fw", "thesis", "d1", "d2"].forEach(function(k){ if (typeof S[k] !== "string") S[k] = ""; });
      inp.innerHTML = '<div class="q-actions"><button type="button" class="btn ghost sm" id="tk-import">Bring in my work from the draft workspace</button><span class="tiny muted" id="tk-ist" aria-live="polite"></span></div>' +
        '<div class="jq"><label for="tk-fw">1. Freewrite</label><div id="tk-tm"></div><textarea id="tk-fw" class="wp-ta" data-tk="fw" spellcheck="false"></textarea><p class="tiny muted" id="tk-fwc" aria-live="polite"></p></div>' +
        '<div class="jq"><label for="tk-th">2. Working thesis</label><div id="tk-forge"></div><textarea id="tk-th" class="wp-ta sm" data-tk="thesis"></textarea><p class="tiny" id="tk-thc" aria-live="polite"></p></div>' +
        '<div class="jq"><label for="tk-d1">3. Draft 1 (one paragraph)</label><textarea id="tk-d1" class="wp-ta big" data-tk="d1"></textarea><p class="tiny muted" id="tk-d1c" aria-live="polite"></p></div>' +
        '<div class="jq"><label for="tk-d2">4. Draft 2 (your revised paragraph)</label><div class="q-actions"><button type="button" class="btn ghost sm" id="tk-copy">Start Draft 2 from a copy of Draft 1</button></div><textarea id="tk-d2" class="wp-ta big" data-tk="d2"></textarea><p class="tiny muted" id="tk-d2c" aria-live="polite"></p></div>' +
        '<div class="jq"><span class="wp-lab5">5. Change log</span><p class="tiny muted">Tag each change: Revising (higher-order) changes what the paragraph argues or proves; Editing (lower-order) polishes sentences and conventions.</p><div id="tk-log"></div></div>' +
        '<p class="tiny"><strong>6. Craft statement:</strong> the box below the checklist.</p>';
      pv.innerHTML = '<div id="tk-pv"></div>';
      ["fw", "thesis", "d1", "d2"].forEach(function(k){ $('[data-tk="' + k + '"]').value = S[k]; });
      timerUI("task", $("#tk-tm"), { total:300, get:function(){ return S.left; }, set:function(v){ S.left = v; api.save(); }, done:"Time! Read it back and find one idea worth keeping." });
      thesisForge($("#tk-forge"), { chips:MV.C.explore.forge, state:S.chips, onChange:api.save, onBuild:function(t){ S.thesis = t; $("#tk-th").value = t; all(); $("#tk-th").focus(); } });
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tk; if (!k) return; S[k] = e.target.value; all(); if (k === "d1" || k === "d2") { clearTimeout(logT); logT = setTimeout(paintLog, 450); } });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || b.disabled) return;
        if (b.id === "tk-copy") { if (S.d2.trim() && !confirm("Replace Draft 2 with a copy of Draft 1?")) return; S.d2 = S.d1; $("#tk-d2").value = S.d2; all(); paintLog(); $("#tk-d2").focus(); }
        else if (b.id === "tk-import") {
          var M = (MV.S.app.explore || {}).my || {}, v = M.v || {}, st = $("#tk-ist");
          var got = { fw:M.fw || "", thesis:M.thesis || "", d1:v["1"] || "", d2:v["2"] || M.draft || "" };
          if (!got.fw.trim() && !got.thesis.trim() && !got.d1.trim() && !got.d2.trim()) { st.textContent = "Nothing to bring in yet: try My draft in Explore."; return; }
          if ((S.fw + S.thesis + S.d1 + S.d2).trim() && !confirm("Replace what’s in these boxes with your work from the draft workspace?")) return;
          ["fw", "thesis", "d1", "d2"].forEach(function(k){ if (got[k].trim()) { S[k] = got[k]; $('[data-tk="' + k + '"]').value = got[k]; } });
          st.textContent = "Brought in your freewrite, thesis and saved drafts."; all(); paintLog();
        }
        else if (b.dataset.ctag) { var cl = $("#tk-log")._changes || [], c = cl[+b.dataset.ci]; if (c) { S.tags[c.key] = S.tags[c.key] === b.dataset.ctag ? undefined : b.dataset.ctag; all(); paintLog(); } }
      });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ api.update(); preview(); });
      var chk = $("#task-check"); if (chk) chk.addEventListener("click", function(){ var d = data(S); if (checks(d).every(Boolean)) { var t = d.thesis.trim(); S.tried = S.tried || []; if (t && S.tried.indexOf(t) < 0) S.tried.push(t); api.save(); preview(); } });
      counts(); preview(); paintLog();
    },
    read:function(){ return data(api ? api.S : MV.taskState().app); },
    valid:function(d){ return (d.fw + d.thesis + d.d1 + d.d2).trim() ? true : "Start with your freewrite."; },
    checks:checks, tips:tips,
    summary:function(ts){
      var S = ts.app || {}, d = data(S), r = checks(d), n = r.filter(Boolean).length, Tk = MV.C.task, L = [];
      L.push(Tk.summary + ": " + (n === r.length ? "complete (checklist " + n + "/" + r.length + ")" : "in progress (" + n + "/" + r.length + ")"));
      L.push("  Working thesis: " + (d.thesis.trim() || "(not written yet)"));
      L.push("  Draft 2 (" + wc(d.d2) + " words):");
      L.push("    " + (d.d2.trim().replace(/\s*\n\s*/g, " ") || "(not written yet)"));
      L.push("  Change log (Draft 1 → Draft 2):");
      if (!d.changes.length) L.push("    (no changes yet)");
      d.changes.forEach(function(c){
        var tag = d.tags[c.key] === "hi" ? "Revising" : d.tags[c.key] === "lo" ? "Editing" : "not tagged";
        var t = c.type === "add" ? "Added: “" + c.nw + "”" : c.type === "cut" ? "Cut: “" + c.old + "”" : c.type === "move" ? "Moved: “" + c.nw + "”" : "Changed: “" + c.old + "” → “" + c.nw + "”";
        L.push("    - " + t + " [" + tag + "]");
      });
      return L;
    }
  };
})();

// ---------- Reflect extras: sample principles, trivium tag, commonplace book, principle length note ----------
function extras(){
  var R = MV.C.reflect, sheet = $("#art-sheet"), art = $("#art");
  if (sheet && art && R.artSamples && !$("#art-samples")) { var d = document.createElement("div"); d.id = "art-samples"; d.className = "art-samples"; d.innerHTML = R.artSamples; sheet.insertBefore(d, art); }
  MV.eng.triviumPicker();
  var cp = $("#cp-app"); if (cp && !cp.firstChild) MV.eng.commonplace(cp, { lines:R.commonplaceLines });
  var p = $("#art-p");
  if (p && !$("#wp-artn")) {
    var n = document.createElement("p"); n.id = "wp-artn"; n.className = "tiny muted"; n.setAttribute("aria-live", "polite"); p.parentNode.appendChild(n);
    var upd = function(){ var k = wc(p.value); n.textContent = p.value.trim() && k < (R.artMin || 0) ? R.artMinMsg + " (" + k + " so far)" : ""; };
    p.addEventListener("input", upd); upd();
  }
}

MV.module({
  hero:function(){ storyInit(); hero(); },
  explore:function(host, api){ var r = explore(host, api); try { extras(); } catch (e) { console.error(e); } return r; },
  part3:part3,
  activities:{ revise:reviseIt, spot:spotProse },
  task:task,
  onShow:function(v){
    MV.eng.stop(); if (RD.close) RD.close(); if (EX) EX.stop();
    if (v === "explore" && EX) EX.onShow();
    if (v === "revision" && P3) P3.refresh();
    if (v === "reflect") try { extras(); } catch (e) { console.error(e); }
  }
});
})();
