// Saving (K2), progress record (N2), theme switch and saving notice (N1), site page-nav offset.
(function(){
"use strict";
var MV = window.MV;

function fresh(){
  return { done:{}, rate0:{}, rate1:{}, warm:{}, preds:{}, chal:{}, qc:{}, sort:{}, spot:{}, act:{}, journal:{}, writes:{},
    final:{ q:{}, submitted:false, ver:"a" }, history:{ attempts:0, first:null, best:null }, lastFinal:null,
    task:{ explain:"", found:[], app:{} }, app:{}, name:"", last:"start", started:null };
}
MV.freshState = fresh;
MV.storageOK = true;

MV.loadState = function(key){
  var S = fresh();
  try {
    var raw = localStorage.getItem(key);
    if (raw) {
      var d = JSON.parse(raw), f = fresh();
      S = Object.assign(f, d);
      ["final", "history", "task"].forEach(function(k){ S[k] = Object.assign(fresh()[k], d[k] || {}); });
      if (!S.final.q) S.final.q = {};
    }
  } catch (e) {}
  // Saves from before attempt history existed: count a submitted Final Check as attempt 1.
  if (S.final.submitted && !S.history.attempts) {
    S.history.attempts = 1;
    S._legacyFinal = true;
  }
  if (!S.started) S.started = new Date().toISOString();
  return S;
};

function notice(){
  MV.storageOK = false;
  var n = document.getElementById("save-off"); if (n) n.hidden = false;
}
MV.save = function(){
  if (!MV.meta || MV._noSave) return;
  try { localStorage.setItem(MV.meta.storageKey, JSON.stringify(MV.S)); } catch (e) { notice(); return; }
  try { if (MV._progress) localStorage.setItem(MV.meta.progressKey, JSON.stringify(MV._progress())); } catch (e) {}
};
MV.testStorage = function(){
  try { var k = "__mv_test__"; localStorage.setItem(k, "1"); localStorage.removeItem(k); } catch (e) { notice(); }
};
MV.clearSaved = function(){
  try { localStorage.removeItem(MV.meta.storageKey); localStorage.removeItem(MV.meta.progressKey); } catch (e) {}
};

// ---------- theme ----------
MV.themeKey = function(){ return (MV.meta && MV.meta.course ? MV.meta.course : "mv") + "-theme"; };
MV.effectiveTheme = function(){
  var t = document.documentElement.getAttribute("data-theme");
  if (t === "light" || t === "dark") return t;
  return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
};
MV.paintThemeBtn = function(){
  var b = document.getElementById("theme-btn"); if (!b) return;
  var dark = MV.effectiveTheme() === "dark";
  b.textContent = dark ? "☀" : "☾";
  b.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  b.title = dark ? "Light mode" : "Dark mode";
};
MV.toggleTheme = function(){
  var next = MV.effectiveTheme() === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try { localStorage.setItem(MV.themeKey(), next); } catch (e) {}
  MV.paintThemeBtn();
};

// ---------- site page-nav bar (injected by the MindView middleware on /courses/... pages) ----------
// It is position:fixed at the top and pads <body>; our sticky header must sit just below it.
MV.watchPageNav = function(){
  function upd(){
    var n = document.querySelector(".page-nav");
    var h = n ? n.getBoundingClientRect().height : 0;
    document.documentElement.style.setProperty("--mv-top", h + "px");
  }
  upd();
  new MutationObserver(upd).observe(document.body, { childList:true });
  window.addEventListener("resize", upd);
  setTimeout(upd, 300); setTimeout(upd, 1200);
};
})();
