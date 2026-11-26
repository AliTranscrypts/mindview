// Course home page (03-home-page.md): module list by unit/chapter with statuses from <course>-progress-v1:* records,
// Next up, Worth revisiting, backup save/load, clear progress, theme switch; ENG4U adds the My Art of Language book.
(function(){
"use strict";
var D = window.HUB, $ = function(s){ return document.querySelector(s); };
var MINUS = "−";
function esc(s){ return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
var PREFIX = D.course + "-progress-v1:", THEME = D.course + "-theme";
var storageOK = true;
function readAll(){
  var recs = {};
  try {
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf(PREFIX) === 0) { try { var r = JSON.parse(localStorage.getItem(k)); if (r && r.id) recs[r.id] = r; } catch (e) {} }
    }
  } catch (e) { storageOK = false; }
  return recs;
}
function id(m){ return m.nn + "-" + m.slug; }
function status(m, recs){
  var r = recs[id(m)];
  if (!r) return { s:"none" };
  if (!r.final) return { s:"prog", r:r, parts:(r.partsDone || []).length, of:r.parts || (m.kind === "review" ? 5 : 6) };
  var f = r.final, low = f.score / f.outOf < 0.7 - 1e-9, zero = f.byCat && Object.keys(f.byCat).some(function(c){ return f.byCat[c][1] > 0 && f.byCat[c][0] === 0; });
  return { s:"done", r:r, score:f.score, outOf:f.outOf, best:f.bestScore, attempt:f.attempt, revisit:low || zero };
}
function badge(st){
  if (st.s === "none") return '<span class="hb hb-none"><span aria-hidden="true">○</span> Not started</span>';
  if (st.s === "prog") return '<span class="hb hb-prog"><span aria-hidden="true">◐</span> In progress · ' + st.parts + " of " + st.of + " parts</span>";
  return '<span class="hb hb-done"><span aria-hidden="true">✓</span> Done · ' + st.score + "/" + st.outOf + (st.attempt > 1 && st.best != null ? " (best " + st.best + "/" + st.outOf + ")" : "") + "</span>" + (st.revisit ? ' <span class="hb hb-rev"><span aria-hidden="true">◆</span> Worth revisiting</span>' : "");
}
function recommend(recs){
  var built = D.modules.filter(function(m){ return m.built; });
  var sts = {}; D.modules.forEach(function(m){ sts[m.nn] = status(m, recs); });
  var done = function(nn){ return sts[nn] && sts[nn].s === "done"; };
  var inprog = built.filter(function(m){ return sts[m.nn].s === "prog"; }).sort(function(a, b){ return (sts[b.nn].r.updated || "").localeCompare(sts[a.nn].r.updated || ""); });
  var rec = null, why = "";
  if (inprog.length) { rec = inprog[0]; var last = sts[rec.nn].r.last; why = "Continue where you left off" + (last ? " (in " + last.replace(/-/g, " ").replace(/\b\w/g, function(c){ return c.toUpperCase(); }) + ")" : "") + "."; }
  if (!rec) {
    D.groups.some(function(g){
      var tops = D.modules.filter(function(m){ return m.group === g.id && m.kind !== "review"; }), rev = D.modules.filter(function(m){ return m.group === g.id && m.kind === "review" && m.built; })[0];
      if (rev && tops.length && tops.every(function(m){ return done(m.nn); }) && !done(rev.nn)) { rec = rev; why = "You’ve finished every " + g.label + " topic. The review connects them."; return true; }
      return false;
    });
  }
  if (!rec) {
    var first = built.filter(function(m){ return sts[m.nn].s === "none"; })[0];
    if (first) {
      var miss = (first.prereqs || []).filter(function(p){ return !done(p); }).map(function(p){ return D.modules.filter(function(m){ return m.nn === p; })[0]; }).filter(function(m){ return m && m.built && sts[m.nn].s !== "done"; });
      if (miss.length) { rec = miss[0]; why = "Module " + first.nn + " builds on " + miss[0].nn + ". Start there."; }
      else { rec = first; why = first.nn === (built[0] || {}).nn ? "Start at the beginning." : "It’s next in the course."; }
    }
  }
  var cands = built.filter(function(m){ return sts[m.nn].s === "done" && sts[m.nn].revisit; });
  cands.sort(function(a, b){
    var pa = rec && (rec.prereqs || []).indexOf(a.nn) >= 0 ? 0 : 1, pb = rec && (rec.prereqs || []).indexOf(b.nn) >= 0 ? 0 : 1;
    return pa - pb || (sts[a.nn].score / sts[a.nn].outOf) - (sts[b.nn].score / sts[b.nn].outOf);
  });
  var allDone = built.length && built.length === D.modules.length && built.every(function(m){ return done(m.nn); });
  return { rec:rec, why:why, revisit:cands[0], sts:sts, allDone:allDone };
}
function paint(){
  var recs = readAll(), R = recommend(recs), sts = R.sts, total = D.modules.length;
  var nDone = D.modules.filter(function(m){ return sts[m.nn].s === "done"; }).length;
  $("#hub-bar").style.width = (nDone / total * 100) + "%";
  $("#hub-count").textContent = nDone + " of " + total + " done";
  var nx = "";
  if (!storageOK) nx = "<p>Your browser is blocking saved progress, so statuses can’t be shown here.</p>";
  if (R.allDone) {
    var low = D.modules.slice().sort(function(a, b){ return sts[a.nn].score / sts[a.nn].outOf - sts[b.nn].score / sts[b.nn].outOf; })[0];
    nx += "<h2>You’ve finished every module.</h2><p>Review your lowest-scoring one to lock it in.</p><a class=\"btn primary\" href=\"" + id(low) + '.html">Review ' + low.nn + ". " + esc(low.title) + " →</a>";
  } else if (R.rec) {
    nx += '<p class="tiny muted" style="margin:0 0 4px;font-weight:700;letter-spacing:.04em">NEXT UP</p><h2 style="margin-bottom:.25em">' + R.rec.nn + ". " + esc(R.rec.title) + "</h2><p>" + R.why + '</p><a class="btn primary nx-go" href="' + id(R.rec) + '.html">' + (sts[R.rec.nn].s === "prog" ? "Continue" : "Start") + " module " + R.rec.nn + " →</a>";
  } else nx += "<h2>Modules are on their way</h2><p>Your teacher is adding the interactive modules for this course. Check back soon.</p>";
  if (R.revisit) { var rv = sts[R.revisit.nn]; nx += '<p class="nx-rev"><span aria-hidden="true">◆</span> Worth revisiting: <a href="' + id(R.revisit) + '.html">' + R.revisit.nn + ". " + esc(R.revisit.title) + "</a> (Final Check " + rv.score + "/" + rv.outOf + ")</p>"; }
  $("#nextup").innerHTML = nx;
  var narrow = window.matchMedia && window.matchMedia("(max-width:560px)").matches, openGroup = R.rec ? R.rec.group : (D.groups[0] || {}).id;
  var openState = {}; document.querySelectorAll("details[data-g]").forEach(function(d){ openState[d.dataset.g] = d.open; });
  $("#groups").innerHTML = D.groups.map(function(g){
    var ms = D.modules.filter(function(m){ return m.group === g.id; });
    var gd = ms.filter(function(m){ return sts[m.nn].s === "done"; }).length;
    var isOpen = openState[g.id] != null ? openState[g.id] : (!narrow || g.id === openGroup);
    return '<details class="sheet grp" data-g="' + g.id + '"' + (isOpen ? " open" : "") + '><summary><span class="g-name">' + esc(g.label) + ": " + esc(g.name) + '</span><span class="g-count">' + gd + " of " + ms.length + " done</span></summary><ul class=\"mods\">" +
      ms.map(function(m){
        var st = sts[m.nn], inner = '<span class="m-nn">' + m.nn + '</span><span class="m-title">' + esc(m.title) + (m.kind === "review" ? ' <span class="tag">Review</span>' : "") + "</span>" + (m.built ? '<span class="m-st">' + badge(st) + "</span>" : '<span class="m-st"><span class="hb hb-soon">Coming soon</span></span>');
        return '<li class="' + (st.revisit ? "rev" : "") + '">' + (m.built ? '<a class="mrow" href="' + id(m) + '.html">' + inner + "</a>" : '<div class="mrow soon" aria-disabled="true">' + inner + "</div>") + "</li>";
      }).join("") + "</ul></details>";
  }).join("");
  if (D.art) paintArt();
}
// ---------- ENG4U: My Art of Language ----------
function artText(rec){
  var L = ["My Art of Language", ""];
  if (rec.preface) L.push("Preface: " + rec.preface, "");
  var ps = rec.principles || {}, ids = Object.keys(ps).sort();
  ["Grammar", "Logic", "Rhetoric", ""].forEach(function(tag){
    var list = ids.filter(function(k){ var t = ps[k].trivium || ""; return tag ? t.indexOf(tag) === 0 : !/^(Grammar|Logic|Rhetoric)/.test(t); });
    if (!list.length) return;
    L.push((tag || "Other") + ":");
    list.forEach(function(k){ var p = ps[k]; L.push("  " + (p.nn ? p.nn + ". " : "") + p.title, "    Principle: " + (p.principle || ""), "    The master’s example: " + (p.example || ""), "    My imitation: " + (p.imitation || ""), ""); });
  });
  if ((rec.commonplace || []).length) { L.push("Commonplace book:"); rec.commonplace.forEach(function(c){ L.push("  “" + c.line + "”" + (c.note ? " (" + c.note + ")" : "")); }); }
  return L.join("\n");
}
function paintArt(){
  var rec; try { rec = JSON.parse(localStorage.getItem("eng4u-art-v1")) || {}; } catch (e) { rec = {}; }
  var ps = rec.principles || {}, ids = Object.keys(ps).sort();
  $("#art").innerHTML = ids.length ? ids.map(function(k){ var p = ps[k]; return '<div class="cw"><p style="margin:0 0 .3em"><strong>' + esc(p.principle) + '</strong> <span class="tiny muted">(' + esc(p.nn ? p.nn + ". " : "") + esc(p.title) + (p.trivium ? " · " + esc(p.trivium) : "") + ')</span></p><p class="tiny" style="margin:0">Master: ' + esc(p.example) + "<br>Mine: " + esc(p.imitation) + "</p></div>"; }).join("") + '<div class="q-actions"><button type="button" class="btn ghost sm" id="art-dl">Save my Art as a file</button></div>'
    : '<p class="muted">Each module ends with a craft principle in your own words. They collect here as your own Art of Language.</p>';
  var dl = $("#art-dl"); if (dl) dl.onclick = function(){ download("my-art-of-language.txt", artText(rec), "text/plain"); };
}
function download(name, text, type){
  try { var b = new Blob([text], { type:type || "application/json" }), u = URL.createObjectURL(b), a = document.createElement("a"); a.href = u; a.download = name; document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(u); a.remove(); }, 500); } catch (e) {}
}
// ---------- theme ----------
function effTheme(){ var t = document.documentElement.getAttribute("data-theme"); if (t) return t; return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; }
function paintTheme(){ var b = $("#theme-btn"), dark = effTheme() === "dark"; b.textContent = dark ? "☀" : "☾"; b.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode"); }
$("#theme-btn").addEventListener("click", function(){ var n = effTheme() === "dark" ? "light" : "dark"; document.documentElement.setAttribute("data-theme", n); try { localStorage.setItem(THEME, n); } catch (e) {} paintTheme(); });
// ---------- backup ----------
function keys(){ var out = []; try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf(D.course + "-") === 0 && k !== THEME) out.push(k); } } catch (e) {} return out; }
$("#bk-save").addEventListener("click", function(){
  var data = { v:1, course:D.course, saved:new Date().toISOString(), items:{} };
  keys().forEach(function(k){ try { data.items[k] = localStorage.getItem(k); } catch (e) {} });
  download(D.course + "-progress-" + new Date().toISOString().slice(0, 10) + ".json", JSON.stringify(data, null, 1));
  $("#bk-msg").textContent = "Backup saved (" + Object.keys(data.items).length + " items).";
});
$("#bk-load").addEventListener("click", function(){ $("#bk-file").click(); });
$("#bk-file").addEventListener("change", function(e){
  var f = e.target.files && e.target.files[0]; if (!f) return;
  var rd = new FileReader();
  rd.onload = function(){
    try {
      var d = JSON.parse(rd.result);
      if (!d || d.course !== D.course || !d.items) throw new Error("not a backup for this course");
      var n = Object.keys(d.items).filter(function(k){ return k.indexOf(PREFIX) === 0; }).length;
      if (!confirm("This backup has " + n + " module" + (n === 1 ? "" : "s") + " of progress, saved " + new Date(d.saved).toLocaleString("en-CA") + ". Restore it? It replaces the progress on this device.")) return;
      keys().forEach(function(k){ try { localStorage.removeItem(k); } catch (er) {} });
      Object.keys(d.items).forEach(function(k){ if (k.indexOf(D.course + "-") === 0) try { localStorage.setItem(k, d.items[k]); } catch (er) {} });
      $("#bk-msg").textContent = "Backup restored."; paint();
    } catch (er) { $("#bk-msg").textContent = "That file isn’t a progress backup for this course."; }
    e.target.value = "";
  };
  rd.readAsText(f);
});
$("#bk-clear").addEventListener("click", function(){
  if (!confirm("Clear all your progress and saved answers for every " + D.code + " module on this device? This can’t be undone. (Save a backup file first if you might want it.)")) return;
  keys().forEach(function(k){ try { localStorage.removeItem(k); } catch (e) {} });
  $("#bk-msg").textContent = "All progress on this device was cleared."; paint();
});
window.addEventListener("storage", function(e){ if (!e.key || e.key.indexOf(D.course + "-") === 0) paint(); });
if (window.matchMedia) { var mq = window.matchMedia("(prefers-color-scheme: dark)"); if (mq.addEventListener) mq.addEventListener("change", paintTheme); }
// keep the sticky header below the site's page-nav bar
function navOffset(){ var n = document.querySelector(".page-nav"); document.documentElement.style.setProperty("--mv-top", (n ? n.getBoundingClientRect().height : 0) + "px"); }
new MutationObserver(navOffset).observe(document.body, { childList:true }); window.addEventListener("resize", navOffset); setTimeout(navOffset, 300);
paintTheme(); paint();
})();
