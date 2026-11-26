// Shared UI: hints (K7), focus helpers (K8), multiple-choice card (K5), N9 sliders, segmented toggles, N13 step player,
// N14 tables, N20 "Use these values" box, figure canvases inside content.
(function(){
"use strict";
var MV = window.MV, $ = MV.$;
MV.RATE = ["Not yet", "Getting there", "Got it", "Could teach it"];
MV.CONF = [{ id:"guess", t:"Just guessing" }, { id:"fair", t:"Fairly sure" }, { id:"very", t:"Very sure" }];
MV.CATN = { K:"Knowledge", T:"Thinking", C:"Communication", A:"Application" };
MV.HINT_LABELS = ["Show a hint", "Show a bigger hint", "Show the worked solution", "All help shown"];

MV.hintsHTML = function(h, lvl){
  if (!lvl || !h) return "";
  var names = ["Hint", "Bigger hint", "Worked solution"];
  return '<div class="hints">' + h.slice(0, lvl).map(function(t, i){ return "<p><strong>" + names[i] + ":</strong> " + t + "</p>"; }).join("") + "</div>";
};
MV.hintBtn = function(key, lvl){
  return '<button type="button" class="btn ghost sm" data-act="hint" data-k="' + key + '"' + (lvl >= 3 ? " disabled" : "") + ">" + MV.HINT_LABELS[lvl || 0] + "</button>";
};
MV.keepFocus = function(host, fn){
  var a = document.activeElement, k = (a && host.contains(a) && a.dataset) ? a.dataset.k : null;
  fn();
  if (k) { var b = host.querySelector('[data-k="' + k + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  MV.drawFigs(host);
};
MV.focusFb = function(host){ if (!host) return; var fb = host.querySelector(".fb:last-of-type") || host.querySelector(".fb"); if (fb) { fb.setAttribute("tabindex", "-1"); fb.focus({ preventScroll:true }); } };
MV.fbHTML = function(kind, html){ return '<div class="fb' + (kind ? " " + kind : "") + '" role="status"><p>' + html + "</p></div>"; };
MV.usesHTML = function(h){ return h ? '<p class="uses"><strong>Use these values</strong>' + h + "</p>" : ""; };

// Canvases written into content as <canvas class="plot" data-fig="key" ...> are drawn by app.figures[key](canvas, plot?).
MV.drawFigs = function(host){
  if (!host || !MV.APP || !MV.APP.figures) return;
  MV.$$("canvas[data-fig]", host).forEach(function(c){
    if (c._mvFig) { if (c._mvFig.render) c._mvFig.render(); return; }
    var fn = MV.APP.figures[c.dataset.fig];
    if (!fn) return;
    var p = new MV.Plot(c, { xmin:-10, xmax:10, ymin:-10, ymax:10 });
    c._mvFig = p;
    p.render = function(){ fn(p, c); };
    if (c.getBoundingClientRect().width > 0) p.render();
  });
};

// ---------- K5 multiple-choice card ----------
// q: {id, prompt, options:[{t, why}], hints?, use?, cat?, topic?}; st: {choice, conf, hint, checked, tries}
// o: {mode:"instant"|"deferred"|"retry", locked, showFb, num, noConf, topicLabel}
MV.mcHTML = function(q, st, o){
  var tags = "";
  if (q.cat) tags += '<span class="tag">' + MV.CATN[q.cat] + "</span>";
  if (o.topicLabel) tags += '<span class="tag">' + o.topicLabel + "</span>";
  var h = '<div class="q-head">' + (o.num ? '<span class="qn" aria-hidden="true">' + o.num + "</span>" : "") + '<div class="q-prompt">' + q.prompt + MV.usesHTML(q.use) + "</div>" + (tags ? '<span class="tags">' + tags + "</span>" : "") + "</div>";
  var rightI = MV.right(q.options);
  h += '<div class="opts" role="radiogroup" aria-label="Answer choices">';
  q.options.forEach(function(op, i){
    var c = "opt";
    if (st.choice === i) c += " picked";
    if (o.showFb) { if (i === rightI && (o.mode !== "retry" || st.solved)) c += " right"; else if (st.choice === i && i !== rightI) c += " wrong"; }
    h += '<button type="button" class="' + c + '" role="radio" aria-checked="' + (st.choice === i) + '" data-k="' + q.id + "o" + i + '" data-i="' + i + '"' + (o.locked ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + String.fromCharCode(65 + i) + "</span><span>" + op.t + "</span></button>";
  });
  h += "</div>";
  if (!o.noConf) {
    h += '<div class="conf" role="group" aria-label="How sure are you?"><span class="conf-lab">How sure are you?</span>';
    MV.CONF.forEach(function(c){ h += '<button type="button" class="chip' + (st.conf === c.id ? " on" : "") + '" aria-pressed="' + (st.conf === c.id) + '" data-k="' + q.id + c.id + '" data-conf="' + c.id + '"' + (o.locked ? " disabled" : "") + ">" + c.t + "</button>"; });
    h += "</div>";
  }
  if ((o.mode === "instant" || o.mode === "retry") && !o.locked) {
    var ready = st.choice != null && (o.noConf || st.conf);
    h += '<div class="q-actions"><button type="button" class="btn primary sm" data-k="' + q.id + 'check" data-act="check"' + (ready ? "" : " disabled") + ">Check answer</button>";
    if (q.hints) h += MV.hintBtn(q.id + "hint", st.hint || 0);
    h += "</div>";
    if (q.hints) h += MV.hintsHTML(q.hints, st.hint || 0);
  } else if (o.mode === "retry" && q.hints && st.hint) h += MV.hintsHTML(q.hints, st.hint);
  if (o.showFb && st.choice != null) {
    var ch = q.options[st.choice], right = q.options[rightI];
    if (st.choice === rightI) h += '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + (ch.why || "") + "</p></div>";
    else if (o.mode === "retry") h += '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong> ' + (ch.why || "") + " Try again.</p></div>";
    else h += '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong> ' + (ch.why || "") + "</p><p><strong>Answer:</strong> " + right.t + ". " + (right.why || "") + "</p></div>";
  }
  return h;
};

// ---------- N9 slider group ----------
// defs: [{id, label (html), param:"a"|"n"|"k"|"d"|"c"|"b"|"t", min, max, step, value, skip:[0], fmt(v), note (html)}]
var PCOL = { a:"--acol", n:"--pen", k:"--p-k", d:"--p-d", c:"--p-c", b:"--p-b", t:"--p-t" };
MV.sliders = function(host, defs, onChange){
  var vals = {}, last = {};
  host.innerHTML = defs.map(function(d){
    vals[d.id] = d.value; last[d.id] = d.value;
    var col = d.param ? "var(" + PCOL[d.param] + ")" : "var(--pen)";
    return '<label class="slider"><span class="slider-top"><span>' + d.label + '</span><output id="sl-' + d.id + '-out" style="color:' + col + '">' + (d.fmt ? d.fmt(d.value) : MV.num(d.value)) + '</output></span>' +
      '<input type="range" id="sl-' + d.id + '" data-sl="' + d.id + '" min="' + d.min + '" max="' + d.max + '" step="' + d.step + '" value="' + d.value + '" style="accent-color:' + col + '"></label>' +
      (d.note ? '<p class="tiny muted" style="margin-top:-2px">' + d.note + "</p>" : "");
  }).join("");
  host.addEventListener("input", function(e){
    var id = e.target.dataset.sl; if (!id) return;
    var d = defs.filter(function(x){ return x.id === id; })[0], v = +e.target.value;
    if (d.skip && d.skip.indexOf(v) >= 0) { var dir = v >= last[id] ? 1 : -1; v = v + dir * d.step; if (v > d.max || v < d.min) v = v - 2 * dir * d.step; e.target.value = v; }
    vals[id] = v; last[id] = v; paint(id); onChange(id, v, vals);
  });
  function paint(id){ var d = defs.filter(function(x){ return x.id === id; })[0]; var o = document.getElementById("sl-" + id + "-out"); if (o) o.textContent = d.fmt ? d.fmt(vals[id]) : MV.num(vals[id]); }
  return {
    get:function(id){ return vals[id]; },
    set:function(id, v){ vals[id] = v; last[id] = v; var el = document.getElementById("sl-" + id); if (el) el.value = v; paint(id); },
    all:function(){ return vals; }
  };
};
// ---------- segmented toggle ----------
// MV.seg(host, {label, options:[{id, t}], value, onChange(id)}) -> {set(id), get()}
MV.seg = function(host, o){
  var val = o.value;
  function paint(){
    host.innerHTML = '<div class="seg-wrap">' + (o.label ? '<span class="tiny" style="font-weight:700">' + o.label + "</span>" : "") +
      '<span class="seg" role="group" aria-label="' + MV.esc(MV.plain(o.label || "Options")) + '">' +
      o.options.map(function(x){ return '<button type="button" data-seg="' + x.id + '" data-k="seg' + x.id + '" aria-pressed="' + (val === x.id) + '">' + x.t + "</button>"; }).join("") + "</span></div>";
  }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-seg]"); if (!b) return; val = b.dataset.seg; MV.keepFocus(host, paint); if (o.onChange) o.onChange(val); });
  paint();
  return { set:function(id){ val = id; MV.keepFocus(host, paint); }, get:function(){ return val; } };
};
// ---------- N13 step-through player ----------
// MV.player(host, {count, render(i), label(i)?, interval:ms}) -> {go(i), get()}
MV.player = function(host, o){
  var i = 0, timer = null;
  function paint(){
    host.innerHTML = '<div class="player">' +
      '<button type="button" class="btn ghost sm" data-pl="back" data-k="plback"' + (i === 0 ? " disabled" : "") + ">Back</button>" +
      '<button type="button" class="btn primary sm" data-pl="step" data-k="plstep"' + (i >= o.count - 1 ? " disabled" : "") + ">Step</button>" +
      (MV.reduceMotion ? "" : '<button type="button" class="btn ghost sm" data-pl="play" data-k="plplay"' + (i >= o.count - 1 ? " disabled" : "") + ">" + (timer ? "Pause" : "Play") + "</button>") +
      '<span class="ctr" aria-live="polite">' + (o.label ? o.label(i) : "Step " + (i + 1) + " of " + o.count) + "</span></div>";
  }
  function go(n){ i = Math.max(0, Math.min(o.count - 1, n)); o.render(i); if (i >= o.count - 1 && timer) { clearInterval(timer); timer = null; } MV.keepFocus(host, paint); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-pl]"); if (!b) return;
    var a = b.dataset.pl;
    if (a === "back") go(i - 1); else if (a === "step") go(i + 1);
    else if (a === "play") { if (timer) { clearInterval(timer); timer = null; MV.keepFocus(host, paint); } else { timer = setInterval(function(){ go(i + 1); }, o.interval || 1100); go(i + 1); } }
  });
  paint(); o.render(0);
  return { go:go, get:function(){ return i; } };
};
// ---------- N14 table of values ----------
// MV.tableHTML({head:[...], rows:[[...]], hiRow, hiCol, caption})
MV.tableHTML = function(t){
  return '<div class="tbl-wrap"><table class="vt">' + (t.caption ? '<caption class="vh">' + t.caption + "</caption>" : "") +
    "<thead><tr>" + t.head.map(function(c, j){ return '<th scope="col"' + (j === t.hiCol ? ' class="hl"' : "") + ">" + c + "</th>"; }).join("") + "</tr></thead><tbody>" +
    t.rows.map(function(r, i){ return "<tr>" + r.map(function(c, j){ return "<td" + ((i === t.hiRow || j === t.hiCol) ? ' class="hl"' : "") + ">" + (c == null ? "" : c) + "</td>"; }).join("") + "</tr>"; }).join("") +
    "</tbody></table></div>";
};
})();
