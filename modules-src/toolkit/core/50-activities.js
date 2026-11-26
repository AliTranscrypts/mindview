// Practice activities: K12 sorter, K13 Spot the Error, N6 matching, N5 ordering, N4 number entry, N7 select all,
// practice multiple choice (retry mode), and custom activities supplied by app.js.
// Every activity registers MV.ACTS[id] = { stats(): {first, total, done, line}, missed(): [goal indices] }.
(function(){
"use strict";
var MV = window.MV, $ = MV.$;
MV.ACTS = {};

MV.activitySheets = function(list){
  return list.map(function(a){
    return '<div class="sheet" data-act-id="' + a.id + '"><h3>' + a.title + (a.star ? ' <span class="tag" style="vertical-align:middle">★ Non-routine</span>' : "") + "</h3>" + (a.instruction ? "<p>" + a.instruction + "</p>" : "") + '<div id="act-' + a.id + '"></div></div>';
  }).join("");
};
function bucket(a){ var b = MV.S.act[a.id] || (MV.S.act[a.id] = {}); return b; }
function goalsOf(it, a){ var g = MV.goalIdx(it.goal != null ? it.goal : a.goal); return g; }
function stdLine(a, first, total, done){ return (a.summary || a.title) + " (first try): " + first + "/" + total + (done < total ? " (unfinished)" : ""); }
function itemById(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }

// ---------- K12 tap-to-sort ----------
// a: {id, type:"sorter", noun, boxes:[{id,label,sub,icon}], items:[{id, t, answer, why, hints:[3], wrong:{box:html}, goal}], wrongDefault, txt:true}
function sorter(host, a){
  var st = MV.S.sort[a.id] || (MV.S.sort[a.id] = {}); st.placed = st.placed || {}; st.tries = st.tries || {}; st.hints = st.hints || {};
  var sel = null, msg = null, noun = a.noun || "item";
  function stats(){
    var placed = 0, first = 0, missed = [];
    a.items.forEach(function(it){ var bad = (st.tries[it.id] || 0) > 0 || (st.hints[it.id] || 0) >= 3; if (st.placed[it.id]) { placed++; if (!bad) first++; } if (bad) missed.push(it); });
    return { total:a.items.length, placed:placed, first:first, missed:missed };
  }
  function paint(){
    var s = stats(), unplaced = a.items.filter(function(it){ return !st.placed[it.id]; }), tcls = "tile" + (a.txt ? " txt" : "");
    var h = '<p class="how">' + (a.how || ("Tap " + (/^[aeiou]/i.test(noun) ? "an " : "a ") + noun + ", then tap the box it belongs in.")) + "</p>";
    h += '<div class="tray" role="group" aria-label="Items to sort">' + (unplaced.length ? unplaced.map(function(it){
      return '<button type="button" class="' + tcls + '" aria-pressed="' + (sel === it.id) + '" data-k="t' + it.id + '" data-item="' + it.id + '">' + it.t + "</button>";
    }).join("") : '<p class="sort-done">All sorted! You got ' + s.first + " of " + s.total + " right on the first try, without the worked solution.</p>") + "</div>";
    if (sel) {
      var it = itemById(a.items, sel), lvl = st.hints[sel] || 0;
      h += '<div class="sel-bar"><span>Selected: ' + it.t + "</span>" + (it.hints ? MV.hintBtn("h" + a.id, lvl) : "") + "</div>" + MV.hintsHTML(it.hints, lvl);
    }
    if (msg) h += '<div class="fb ' + msg.type + '" role="status"><p>' + msg.html + "</p></div>";
    var n = a.boxes.length;
    h += '<div class="bins' + (n === 3 ? " three" : "") + '">' + a.boxes.map(function(b){
      var inside = a.items.filter(function(it){ return st.placed[it.id] === b.id; });
      return '<button type="button" class="bin' + (sel ? " ready" : "") + '" data-k="b' + b.id + '" data-bin="' + b.id + '"><span class="bin-head">' + (b.icon || "") + "<span><strong>" + b.label + "</strong>" + (b.sub ? "<small>" + b.sub + "</small>" : "") + '</span></span><span class="bin-items">' + inside.map(function(it){ return '<span class="chip-in' + (a.txt ? " txt" : "") + '">' + it.t + "</span>"; }).join("") + "</span></button>";
    }).join("") + "</div>";
    MV.keepFocus(host, function(){ host.innerHTML = h; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.item) { sel = sel === b.dataset.item ? null : b.dataset.item; msg = null; paint(); return; }
    if (b.dataset.act === "hint" && sel) { st.hints[sel] = Math.min(3, (st.hints[sel] || 0) + 1); MV.save(); paint(); return; }
    if (b.dataset.bin) {
      if (!sel) { msg = { type:"", html:"Tap " + (/^[aeiou]/i.test(noun) ? "an " : "a ") + noun + " first, then tap the box it belongs in." }; paint(); return; }
      var it = itemById(a.items, sel), ans = MV.ans(it);
      if (b.dataset.bin === ans) { st.placed[it.id] = ans; msg = { type:"good", html:"<strong>✓ " + it.t + "</strong>: " + (it.why || "") }; sel = null; MV.save(); paint(); MV.focusFb(host); }
      else {
        st.tries[it.id] = (st.tries[it.id] || 0) + 1;
        var w = (it.wrong && it.wrong[b.dataset.bin]) || a.wrongDefault || "Check the item again against each box’s label.";
        msg = { type:"bad", html:"<strong>✗ Not that box.</strong> " + w + (/Try another box\.?\s*$/.test(MV.plain(w)) ? "" : " Try another box.") };
        MV.save(); paint();
      }
    }
  });
  paint();
  return { stats:function(){ var s = stats(); return { first:s.first, total:s.total, done:s.placed, line:stdLine(a, s.first, s.total, s.placed) }; },
    missed:function(){ var g = []; stats().missed.forEach(function(it){ g = g.concat(goalsOf(it, a)); }); return g; } };
}

// ---------- K13 Spot the Error ----------
// a: {id, type:"spot", student:"Mateo", problems:[{id, goal, task, steps:[...], answer: errIndex, stepFb:[...], fixes:[{t, ok, why}], hints:[3]}]}
function spot(host, a){
  function sst(id){ return MV.S.spot[id] || (MV.S.spot[id] = { stepTries:0, found:false, fixTries:0, fixed:false, hint:0 }); }
  var who = a.student || "Jordan";
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = (a.how === "" ? "" : '<p class="how">' + (a.how || "Tap the step with the first mistake. Then choose the fix.") + "</p>") + a.problems.map(function(p, pi){
        var st = sst(p.id), err = MV.ans(p), h = '<div class="q' + (pi ? " part" : "") + '" data-sp="' + p.id + '" style="' + (pi < a.problems.length - 1 ? "" : "border-bottom:0") + '">';
        h += '<p class="task">Problem ' + (pi + 1) + ": " + p.task + "</p>" + (p.fig ? p.fig : "") + '<p class="who">' + who + "’s solution</p><ol class=\"steps-list\">";
        p.steps.forEach(function(s, si){
          var cls = "sbtn" + (st.found && si === err ? " err" : "");
          h += '<li><button type="button" class="' + cls + '" data-k="' + p.id + "s" + si + '" data-step="' + si + '"' + (st.found ? " disabled" : "") + '><span class="sn">Step ' + (si + 1) + "</span><span>" + s + (st.found && si === err ? '<span class="flag">First mistake</span>' : "") + "</span></button></li>";
        });
        h += "</ol>";
        if (!st.found) {
          h += '<div class="q-actions">' + MV.hintBtn(p.id + "hint", st.hint) + "</div>" + MV.hintsHTML(p.hints, st.hint);
          if (st.lastStep != null && st.lastStep !== err) h += '<div class="fb bad" role="status"><p>' + ((p.stepFb && p.stepFb[st.lastStep]) || ("Step " + (st.lastStep + 1) + " is correct. Keep checking the steps after it.")) + "</p></div>";
        } else {
          h += '<div class="fb good" role="status"><p><strong>✓ You found it: step ' + (err + 1) + ".</strong> Now choose the correct fix.</p></div>";
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
    var p = itemById(a.problems, box.dataset.sp), st = sst(p.id), err = MV.ans(p);
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
    missed:function(){ var g = []; a.problems.forEach(function(p){ var s = sst(p.id); if (s.stepTries > 0 || s.fixTries > 1 || s.hint >= 3) g = g.concat(goalsOf(p, a)); }); return g; }
  };
}

// Right-column order for N6: a deterministic shuffle, re-seeded (up to 12 times) while too many
// partners sit level with their left item (at most 1 aligned pair, none for 3 or fewer pairs).
// The first seed is the old one, so modules whose order was already fine keep it.
function matchOrder(a){
  var K = MV.ans(a) || {}, best = a.right, bestN = 1e9, lim = a.left.length > 3 ? 1 : 0;
  for (var t = 0; t < 12; t++) {
    var r = MV.shuffle(a.right, MV.meta.id + a.id + (t ? "#" + t : "")), n = 0;
    a.left.forEach(function(L, i){ if (r[i] && K[L.id] === r[i].id) n++; });
    if (n < bestN) { best = r; bestN = n; }
    if (n <= lim) break;
  }
  return best;
}

// ---------- N6 matching pairs ----------
// a: {id, type:"match", leftTitle, rightTitle, left:[{id, t, hints:[3], why, goal}], right:[{id, t}], answer:{leftId:rightId}, wrong:{"L|R": html}, wrongDefault}
function match(host, a){
  var st = bucket(a); st.done = st.done || {}; st.tries = st.tries || {}; st.hints = st.hints || {};
  var sel = null, msg = null, right = a.shuffle === false ? a.right : matchOrder(a);
  function key(){ return MV.ans(a); }
  function stats(){
    var K = key(), first = 0, done = 0, missed = [];
    a.left.forEach(function(L){ var bad = (st.tries[L.id] || 0) > 0 || (st.hints[L.id] || 0) >= 3; if (st.done[L.id]) { done++; if (!bad) first++; } if (bad) missed.push(L); });
    void K; return { first:first, done:done, total:a.left.length, missed:missed };
  }
  function paint(){
    var K = key(), s = stats();
    var h = '<p class="how">' + (a.how || "Tap an item on the left, then tap its partner on the right.") + "</p>";
    if (sel) { var L = itemById(a.left, sel), lv = st.hints[sel] || 0; if (L.hints) h += '<div class="sel-bar"><span>Selected: ' + L.t + "</span>" + MV.hintBtn("mh" + a.id, lv) + "</div>" + MV.hintsHTML(L.hints, lv); }
    if (msg) h += '<div class="fb ' + msg.type + '" role="status"><p>' + msg.html + "</p></div>";
    if (s.done === s.total) h += '<p class="sort-done" style="margin-top:10px">All matched! You got ' + s.first + " of " + s.total + " right on the first try, without the worked solution.</p>";
    var doneR = {}; a.left.forEach(function(L, i){ if (st.done[L.id]) doneR[K[L.id]] = i + 1; });
    h += '<div class="match"><div class="match-col" role="group" aria-label="' + MV.esc(MV.plain(a.leftTitle || "Left")) + '">' + (a.leftTitle ? "<h4>" + a.leftTitle + "</h4>" : "") + a.left.map(function(L, i){
      var d = st.done[L.id];
      return '<button type="button" class="mitem' + (d ? " done" : "") + '" data-k="ml' + L.id + '" data-l="' + L.id + '" aria-pressed="' + (sel === L.id) + '"' + (d ? " disabled" : "") + ">" + (d ? '<span class="pair-n">✓ ' + (i + 1) + "</span>" : "") + "<span>" + L.t + "</span></button>";
    }).join("") + '</div><div class="match-col" role="group" aria-label="' + MV.esc(MV.plain(a.rightTitle || "Right")) + '">' + (a.rightTitle ? "<h4>" + a.rightTitle + "</h4>" : "") + right.map(function(R){
      var d = doneR[R.id];
      return '<button type="button" class="mitem' + (d ? " done" : "") + '" data-k="mr' + R.id + '" data-r="' + R.id + '"' + (d && !a.reuse ? " disabled" : "") + ">" + (d ? '<span class="pair-n">✓ ' + d + "</span>" : "") + "<span>" + R.t + "</span></button>";
    }).join("") + "</div></div>";
    MV.keepFocus(host, function(){ host.innerHTML = h; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.l) { sel = sel === b.dataset.l ? null : b.dataset.l; msg = null; paint(); return; }
    if (b.dataset.act === "hint" && sel) { st.hints[sel] = Math.min(3, (st.hints[sel] || 0) + 1); MV.save(); paint(); return; }
    if (b.dataset.r) {
      if (!sel) { msg = { type:"", html:"Tap an item on the left first, then tap its partner." }; paint(); return; }
      var K = key(), L = itemById(a.left, sel);
      if (K[sel] === b.dataset.r) { st.done[sel] = true; msg = { type:"good", html:"<strong>✓ Matched.</strong> " + (L.why || "") }; sel = null; MV.save(); paint(); MV.focusFb(host); }
      else { st.tries[sel] = (st.tries[sel] || 0) + 1; var w = (a.wrong && a.wrong[sel + "|" + b.dataset.r]) || L.wrong || a.wrongDefault || "Those two don’t match."; msg = { type:"bad", html:"<strong>✗ Not a match.</strong> " + w + " Try another partner." }; MV.save(); paint(); }
    }
  });
  paint();
  return { stats:function(){ var s = stats(); return { first:s.first, total:s.total, done:s.done, line:stdLine(a, s.first, s.total, s.done) }; },
    missed:function(){ var g = []; stats().missed.forEach(function(L){ g = g.concat(goalsOf(L, a)); }); return g; } };
}

// ---------- N5 put the steps in order ----------
// a: {id, type:"order", sequences:[{id, goal, prompt, steps:[html in correct order], start:[jumbled indices], accept:[[...]], wrong:[{order:[...], fb}], hints:[3], why}]}
function order(host, a){
  var st = bucket(a); st.seq = st.seq || {};
  var sel = {}, msgs = {};
  function sq(s){ var x = st.seq[s.id]; if (!x) { x = st.seq[s.id] = { order:(s.start || MV.shuffle(s.steps.map(function(_, i){ return i; }), MV.meta.id + s.id)).slice(), tries:0, hint:0, solved:false, first:null }; } return x; }
  function isRight(s, ord){ var ok = ord.every(function(v, i){ return v === i; }); if (ok) return true; return (s.accept || []).some(function(acc){ return acc.every(function(v, i){ return ord[i] === v; }); }); }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">' + (a.how || "Tap a step, then use Move up and Move down to put it in place. Press Check when the order is right.") + "</p>" + a.sequences.map(function(s, si){
        var x = sq(s), h = '<div class="q' + (si ? " part" : "") + '" data-seq="' + s.id + '" style="border-bottom:0"><p class="task">' + (a.sequences.length > 1 ? "Sequence " + (si + 1) + ": " : "") + s.prompt + "</p>";
        h += '<ol class="olist">' + x.order.map(function(stepI, pos){
          var cls = "ostep" + (sel[s.id] === pos && !x.solved ? "" : "") + (x.solved ? " good" : (msgs[s.id] && msgs[s.id].pos === pos ? " bad" : ""));
          var isSel = sel[s.id] === pos && !x.solved;
          return "<li><button type=\"button\" class=\"" + cls + '" aria-pressed="' + isSel + '" data-k="' + s.id + "p" + stepI + '" data-pos="' + pos + '"' + (x.solved ? " disabled" : "") + '><span class="sn">' + (pos + 1) + ".</span><span>" + s.steps[stepI] + "</span></button>" +
            (isSel ? '<span class="omoves"><button type="button" class="btn ghost" data-mv="up" data-k="' + s.id + 'up"' + (pos === 0 ? " disabled" : "") + '>Move up</button><button type="button" class="btn ghost" data-mv="down" data-k="' + s.id + 'down"' + (pos === x.order.length - 1 ? " disabled" : "") + ">Move down</button></span>" : "") + "</li>";
        }).join("") + "</ol>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + s.id + 'chk">Check the order</button>' + MV.hintBtn(s.id + "hint", x.hint) + "</div>" + MV.hintsHTML(s.hints, x.hint);
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ That order works.</strong> ' + (s.why || "") + "</p></div>";
        else if (msgs[s.id]) h += '<div class="fb bad" role="status"><p><strong>✗ Not yet.</strong> ' + msgs[s.id].html + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-seq]"); if (!box) return;
    var s = itemById(a.sequences, box.dataset.seq), x = sq(s);
    if (b.dataset.pos != null) { var p = +b.dataset.pos; sel[s.id] = sel[s.id] === p ? null : p; paint(); return; }
    if (b.dataset.mv) {
      var i = sel[s.id], j = b.dataset.mv === "up" ? i - 1 : i + 1; if (i == null || j < 0 || j >= x.order.length) return;
      var t = x.order[i]; x.order[i] = x.order[j]; x.order[j] = t; sel[s.id] = j; msgs[s.id] = null; MV.save(); paint();
      var nb = host.querySelector('[data-seq="' + s.id + '"] [data-mv="' + b.dataset.mv + '"]'); if (nb && !nb.disabled) nb.focus(); else { var sb = host.querySelector('[data-seq="' + s.id + '"] [data-pos="' + j + '"]'); if (sb) sb.focus(); }
      return;
    }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); MV.save(); paint(); return; }
    if (b.dataset.act === "check") {
      if (isRight(s, x.order)) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[s.id] = null; sel[s.id] = null; }
      else {
        x.tries++;
        var named = (s.wrong || []).filter(function(w){ return w.order.every(function(v, k){ return x.order[k] === v; }); })[0];
        var pos = 0; while (pos < x.order.length && x.order[pos] === pos) pos++;
        msgs[s.id] = { pos:pos, html:named ? named.fb : ("Step " + (pos + 1) + " is out of place. " + (s.general || "Ask what has to happen before it can be done.")) };
      }
      MV.save(); paint(); MV.focusFb(host.querySelector('[data-seq="' + s.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.sequences.forEach(function(s){ var x = sq(s); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.sequences.length, done:d, line:stdLine(a, f, a.sequences.length, d) }; },
    missed:function(){ var g = []; a.sequences.forEach(function(s){ var x = sq(s); if (x.tries > 0 || x.hint >= 3) g = g.concat(goalsOf(s, a)); }); return g; }
  };
}

// ---------- N4 number entry ----------
// a: {id, type:"numeric", items:[{id, goal, prompt, answer: number | [numbers], set:true (order-free list), tol, display (html of the answer),
//      unit, label, keypad:"decimal"|"text", wrong:[{match:number|[numbers], fb}], why, hints:[3], use}]}
function numeric(host, a){
  var st = bucket(a); st.items = st.items || {};
  var msgs = {};
  function ist(id){ return st.items[id] || (st.items[id] = { val:"", tries:0, hint:0, solved:false, first:null }); }
  function judge(it, raw){
    var ans = MV.ans(it), isSet = Array.isArray(ans), tol = it.tol == null ? 1e-6 : it.tol;
    var vals = isSet || it.set ? MV.parseList(raw) : MV.parseNum(raw);
    if (!vals) return { bad:true };
    if (!isSet && vals.length !== 1) return { bad:true };
    var target = isSet ? ans : [ans];
    var ok = isSet ? MV.sameNums(vals, target, tol) : Math.abs(vals[0] - ans) <= tol * Math.max(1, Math.abs(ans));
    if (ok) return { ok:true };
    var named = (it.wrong || []).filter(function(w){ var m = Array.isArray(w.match) ? w.match : [w.match]; return MV.sameNums(vals, m, tol); })[0];
    if (!named && isSet) named = (it.wrong || []).filter(function(w){ return w.missing != null && vals.length === target.length - 1 && target.filter(function(t){ return Math.abs(t - w.missing) < 1e-6; }).length && !vals.some(function(v){ return Math.abs(v - w.missing) < 1e-6; }); })[0];
    return { ok:false, fb:named ? named.fb : null, vals:vals };
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">' + (a.how || "Type your answer, then press Check. Fractions like 3/4 are fine.") + "</p>" + a.items.map(function(it, i){
        var x = ist(it.id), ans = MV.ans(it), isSet = Array.isArray(ans) || it.set;
        var h = '<div class="q" data-ni="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + MV.usesHTML(it.use) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        h += '<div class="numrow"><label for="ni-' + it.id + '">' + (it.label || (isSet ? "Every answer, separated by commas:" : "Your answer:")) + '</label><input class="numin" id="ni-' + it.id + '" data-nin="' + it.id + '" type="text" inputmode="' + (it.keypad || (isSet ? "text" : "decimal")) + '" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + ">" + (it.unit ? '<span class="m">' + it.unit + "</span>" : "") + "</div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + MV.hintsHTML(it.hints, x.hint);
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct' + (it.display ? ": " + it.display : "") + ".</strong> " + (it.why || "") + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.nin; if (!id) return; ist(id).val = e.target.value; MV.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.nin) { var b = host.querySelector('[data-k="' + e.target.dataset.nin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ni]"); if (!box) return;
    var it = itemById(a.items, box.dataset.ni), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); MV.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x.val);
      if (r.bad) { msgs[it.id] = "Enter " + (Array.isArray(MV.ans(it)) || it.set ? "your answers as numbers separated by commas, such as −3, 1/2, 4." : "a number, such as 12, −3.5 or 3/4."); paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (r.fb || it.general || a.general || "Check your work and try again.") ; }
      MV.save(); paint(); MV.focusFb(host.querySelector('[data-ni="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:stdLine(a, f, a.items.length, d) }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(goalsOf(it, a)); }); return g; }
  };
}

// ---------- N7 select all that apply ----------
// a: {id, type:"selectall", items:[{id, goal, prompt, options:[{t, ok, why}], hints:[3], why}]}
function selectall(host, a){
  var st = bucket(a); st.items = st.items || {};
  function ist(id){ return st.items[id] || (st.items[id] = { pick:{}, tries:0, hint:0, solved:false, first:null, checked:false }); }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">' + (a.how || "Select every option that applies, then press Check.") + "</p>" + a.items.map(function(it, i){
        var x = ist(it.id), h = '<div class="q" data-sai="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + MV.usesHTML(it.use) + "</div></div>";
        h += '<div class="opts" role="group" aria-label="Options (select all that apply)">' + it.options.map(function(o, oi){
          var on = !!x.pick[oi], c = "opt sa-opt";
          if (x.checked) { var good = MV.ok(o); if (on && good) c += " right"; else if (on && !good) c += " wrong"; else if (!on && good && x.solved) c += " right"; }
          return '<button type="button" class="' + c + '" role="checkbox" aria-checked="' + on + '" data-k="' + it.id + "o" + oi + '" data-oi="' + oi + '"' + (x.solved ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + (on ? "☑" : "☐") + "</span><span>" + o.t + "</span></button>";
        }).join("") + "</div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
        if (x.checked) {
          var lines = it.options.map(function(o, oi){ var on = !!x.pick[oi], good = MV.ok(o); if (on && !good) return "<p>✗ " + o.t + ": " + (o.why || "") + "</p>"; if (!on && good && !x.solved) return "<p>○ One more option belongs in your selection.</p>"; return ""; }).filter(Boolean);
          var uniq = lines.filter(function(l, k){ return lines.indexOf(l) === k; });
          h += x.solved ? '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + (it.why || "") + "</p></div>" : '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong> Your selection isn’t right yet.</p>' + uniq.join("") + "</div>";
        }
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-sai]"); if (!box) return;
    var it = itemById(a.items, box.dataset.sai), x = ist(it.id);
    if (b.dataset.oi != null) { var oi = +b.dataset.oi; x.pick[oi] = !x.pick[oi]; x.checked = false; MV.save(); paint(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); MV.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var ok = it.options.every(function(o, oi){ return !!x.pick[oi] === MV.ok(o); });
      x.checked = true;
      if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
      MV.save(); paint(); MV.focusFb(host.querySelector('[data-sai="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:stdLine(a, f, a.items.length, d) }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(goalsOf(it, a)); }); return g; }
  };
}

// ---------- practice multiple choice (retry mode) ----------
// a: {id, type:"mc", items:[{id, goal, prompt, options:[{t, ok, why}], hints:[3], use, topic}]}
function mcset(host, a){
  var st = bucket(a); st.items = st.items || {};
  function ist(id){ return st.items[id] || (st.items[id] = { tries:0, hint:0, solved:false, first:null }); }
  function paintQ(it, i){
    var box = host.querySelector('[data-mq="' + it.id + '"]'), x = ist(it.id);
    MV.keepFocus(box, function(){ box.innerHTML = MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true, topicLabel:it.topic ? MV.topicLabel(it.topic) : "" }); });
  }
  host.innerHTML = (a.how ? '<p class="how">' + a.how + "</p>" : "") + a.items.map(function(it){ return '<div class="q" data-mq="' + it.id + '"></div>'; }).join("");
  a.items.forEach(paintQ);
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-mq]"); if (!box) return;
    var it = itemById(a.items, box.dataset.mq), i = a.items.indexOf(it), x = ist(it.id);
    if (b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
    else if (b.dataset.act === "hint") x.hint = Math.min(3, (x.hint || 0) + 1);
    else if (b.dataset.act === "check") {
      x.checked = true;
      if (MV.ok(it.options[x.choice])) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
    }
    MV.save(); paintQ(it, i); if (b.dataset.act === "check") MV.focusFb(box);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:stdLine(a, f, a.items.length, d) }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(goalsOf(it, a)); }); return g; }
  };
}

var TYPES = { sorter:sorter, spot:spot, match:match, order:order, numeric:numeric, selectall:selectall, mc:mcset };
MV.activityTypes = TYPES;
MV.initActivities = function(list){
  (list || []).forEach(function(a){
    var host = document.getElementById("act-" + a.id), made = null;
    try {
      if (a.type === "custom" || !TYPES[a.type]) {
        var fn = MV.APP.activities && MV.APP.activities[a.id];
        if (!fn) { host.innerHTML = '<p class="fb bad">This activity is missing its code (' + a.id + ").</p>"; return; }
        var api = { S:bucket(a), save:MV.save, changed:MV.changed, content:a, host:host };
        made = fn(host, api, a) || {};
      } else made = TYPES[a.type](host, a);
    } catch (e) { console.error(e); host.innerHTML = '<p class="fb bad">This activity could not load.</p>'; }
    MV.ACTS[a.id] = { a:a, stats:made && made.stats ? made.stats : function(){ return { first:0, total:0, done:0, line:"" }; }, missed:made && made.missed ? made.missed : function(){ return []; } };
  });
};
})();
