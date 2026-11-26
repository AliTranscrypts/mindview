// HFA4U 01 Factors Influencing Food Choices: hero web animation, Food choice web (Explore: F1 persona panel + influence
// web, two modes, predictions, challenges), Marketing on the menu (Part 3 stations), "Ask a better question" inquiry set,
// "Two changes for Amira's family" task. Every word comes from content.mjs.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
var KEYS = ["bio", "eco", "acc", "soc", "psy", "med"], LV = ["none", "low", "medium", "high"], WID = [1.5, 3, 7, 12];
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function ki(k){ return KEYS.indexOf(k); }
function lc(s){ return s.charAt(0).toLowerCase() + s.slice(1); }
function uniq(a){ return a.filter(function(x, i){ return a.indexOf(x) === i; }); }
function fb(kind, html){ return '<div class="fb' + (kind ? " " + kind : "") + '" role="status">' + html + "</div>"; }

// ---------- @component radioGroup (copied from MHF4U 35, with per-option disabling and function labels) ----------
//   Segmented control or chip row as a real radio group (arrow keys, roving tabindex).
//   radios(host, {label, aria, options:[{id, t (html or function)}], value, cls:"seg"|"chips", onChange}) -> {set, get, off(ids), repaint}
//   Use a fresh host for every call: it adds its listeners to host.
function radios(host, o){
  var val = String(o.value), offs = {};
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; });
    host.innerHTML = '<span class="fw-rgw">' + (o.label ? '<span class="fw-rgl">' + o.label + "</span>" : "") + '<span class="fw-rg ' + (o.cls === "chips" ? "fw-chipset" : "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, dis = offs[x.id]; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && i === 0) ? 0 : -1) + '" data-rg="' + x.id + '"' + (dis ? " disabled" : "") + ">" + (typeof x.t === "function" ? x.t() : x.t) + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (offs[id]) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }).filter(function(x){ return !offs[x]; }), i = (ids.indexOf(val) + d + ids.length) % ids.length; choose(ids[i]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, repaint:paint,
    off:function(ids){ var n = {}; (ids || []).forEach(function(x){ n[x] = 1; }); if (JSON.stringify(n) !== JSON.stringify(offs)) { offs = n; paint(); } } };
}

// ---------- @component foodWeb — influence web (module-specific web diagram for F1) ----------
//   SVG: a lunch tray at the centre and six threads (Biological / Economic / Access and time / Social and cultural /
//   Psychological / Media, clockwise from the top), each with an icon and its word, drawn in --ink-2. Width follows a level
//   0–3 (0 = dashed hairline); optional level words under the labels; a --hi halo that pulses three times (static with
//   reduced motion); grow-in, a spinning clock hand and lunch/snack tray contents for the hero.
//   foodWeb(host, {labels:[6], levels:true, aria}) -> {levels(L), words(L), width(i, w), widthOf(i), pulse([idx]),
//   grow(i, t), tray("lunch"|"snack"), clock(deg), aria(text), svg}
var WEB = { cx:210, cy:198, hw:56, hh:36, r:19,
  at:[[210, 62], [348, 124], [348, 270], [210, 334], [72, 270], [72, 124]],
  lab:[[210, 20], [348, 76], [348, 312], [210, 376], [72, 312], [72, 76]] };
var ICON = {
  bio:'<path d="M12 19.5s-7-4.3-7-9.4A3.9 3.9 0 0 1 12 7.8a3.9 3.9 0 0 1 7 2.3c0 5.1-7 9.4-7 9.4z"/>',
  eco:'<circle cx="12" cy="12" r="8"/><path d="M14.6 8.9c-.6-.8-1.6-1.2-2.6-1.2-1.5 0-2.7.8-2.7 2 0 2.8 5.6 1.6 5.6 4.4 0 1.3-1.2 2.1-2.9 2.1-1.2 0-2.3-.5-2.9-1.4M12 6.2v1.4M12 16.3v1.5"/>',
  acc:'<circle cx="12" cy="12" r="8"/><g class="fw-hand"><path d="M12 12V6.6"/></g><path d="M12 12l3.3 2"/>',
  soc:'<circle cx="9" cy="8.6" r="2.6"/><circle cx="16.2" cy="9.6" r="2.1"/><path d="M4.2 19c0-3.1 2.1-5.3 4.8-5.3s4.8 2.2 4.8 5.3M13.6 14.4c.7-.5 1.5-.8 2.4-.8 2.3 0 3.9 1.9 3.9 4.5"/>',
  psy:'<path d="M7.6 16.6h8.8a3.8 3.8 0 0 0 .5-7.6 5 5 0 0 0-9.6-.6 3.7 3.7 0 0 0 .3 8.2z"/><path d="M9 19.6h.01M6.6 21h.01"/>',
  med:'<rect x="7.6" y="3.6" width="8.8" height="16.8" rx="2"/><path d="M11 17.4h2"/>'
};
function pt(p){ return p[0].toFixed(1) + " " + p[1].toFixed(1); }
function geo(i){
  var a = WEB.at[i], dx = WEB.cx - a[0], dy = WEB.cy - a[1], L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L;
  var p0 = [a[0] + ux * (WEB.r + 3), a[1] + uy * (WEB.r + 3)];
  var t = Math.min(dx ? WEB.hw / Math.abs(dx) : Infinity, dy ? WEB.hh / Math.abs(dy) : Infinity);
  var p1 = [WEB.cx - dx * t - ux * 5, WEB.cy - dy * t - uy * 5];
  var s = i % 2 ? 1 : -1, c = [(p0[0] + p1[0]) / 2 - uy * 8 * s, (p0[1] + p1[1]) / 2 + ux * 8 * s];
  return "M" + pt(p0) + "Q" + pt(c) + " " + pt(p1);
}
function zig(x0, y0, n, dx, dy){ var s = ""; for (var k = 0; k < n; k++) s += "l" + dx + " " + (k % 2 ? dy : -dy); return "M" + x0 + " " + y0 + s; }
function traySVG(){
  var top = zig(186, 176, 12, 4, 5), bot = ""; for (var k = 0; k < 12; k++) bot += "l-4 " + (k % 2 ? -5 : 5);
  return '<g class="fw-tray"><rect x="154" y="162" width="112" height="72" rx="12"/>' +
    '<g class="fw-lunch"><path d="M212 168v60"/><path d="M164 226h40v-50z"/><path d="M171 220h27"/><circle cx="239" cy="188" r="11"/><path d="M239 177c0-3 2-6 5-7"/><path d="M222 214l32-8M222 223l32-8"/></g>' +
    '<g class="fw-snack" style="display:none"><path d="' + top + "v42" + bot + 'z"/><text x="210" y="203" text-anchor="middle">SNACK</text></g></g>';
}
function foodWeb(host, o){
  o = o || {};
  var h = '<svg class="fw-svg" viewBox="0 0 420 402" role="img" focusable="false" aria-label="' + esc(o.aria || "") + '">', D = KEYS.map(function(_, i){ return geo(i); });
  D.forEach(function(d){ h += '<path class="fw-halo" d="' + d + '"/>'; });
  D.forEach(function(d){ h += '<path class="fw-th" d="' + d + '"/>'; });
  KEYS.forEach(function(k, i){
    var a = WEB.at[i], l = WEB.lab[i];
    h += '<g class="fw-ic" transform="translate(' + (a[0] - 12) + " " + (a[1] - 12) + ')"><circle class="fw-icb" cx="12" cy="12" r="19"/>' + ICON[k] + "</g>";
    h += '<text class="fw-lab" x="' + l[0] + '" y="' + l[1] + '" text-anchor="middle">' + esc(o.labels[i]) + "</text>";
    if (o.levels) h += '<text class="fw-lvl" x="' + l[0] + '" y="' + (l[1] + 18) + '" text-anchor="middle"></text>';
  });
  host.innerHTML = h + traySVG() + "</svg>";
  var svg = host.querySelector("svg"), th = $$(".fw-th", svg), halo = $$(".fw-halo", svg), ic = $$(".fw-ic", svg), lab = $$(".fw-lab", svg), lvl = $$(".fw-lvl", svg), W = [0, 0, 0, 0, 0, 0];
  var hand = $(".fw-hand", svg), lunch = $(".fw-lunch", svg), snack = $(".fw-snack", svg);
  function width(i, w){ W[i] = w; th[i].setAttribute("stroke-width", w.toFixed(2)); th[i].classList.toggle("none", w < 2); halo[i].setAttribute("stroke-width", (w + 11).toFixed(2)); }
  function words(L){ L.forEach(function(v, i){ if (lvl[i]) lvl[i].textContent = LV[v]; }); }
  return {
    svg:svg, width:width, words:words, widthOf:function(i){ return W[i]; },
    levels:function(L){ L.forEach(function(v, i){ width(i, WID[v]); }); words(L); },
    pulse:function(idx){ halo.forEach(function(el, i){ el.classList.remove("on"); if (idx.indexOf(i) >= 0) { void el.getBoundingClientRect(); el.classList.add("on"); } }); },
    grow:function(i, t){
      var L = th[i].getTotalLength ? th[i].getTotalLength() : 200;
      if (t >= 1) { th[i].style.strokeDasharray = ""; th[i].style.strokeDashoffset = ""; } else { th[i].style.strokeDasharray = L + " " + L; th[i].style.strokeDashoffset = String(L * (1 - t)); }
      ic[i].style.opacity = t; lab[i].style.opacity = t;
    },
    tray:function(kind){ lunch.style.display = kind === "snack" ? "none" : ""; snack.style.display = kind === "snack" ? "" : "none"; },
    clock:function(deg){ hand.setAttribute("transform", "rotate(" + deg.toFixed(1) + " 12 12)"); },
    aria:function(s){ svg.setAttribute("aria-label", s); }
  };
}

// ---------- hero: the storyboard (tray alone, threads grow, Access and time tightens, relaxes, caption) ----------
function hero(f){
  var C = MV.C, host = $("#fw-hero"); if (!host) return;
  var w = foodWeb(host, { labels:C.explore.influences.map(function(x){ return x.hero; }), aria:C.hero.aria }), A = ki("acc"), cap = f.cap;
  var EVEN = [2, 2, 2, 2, 2, 2];
  function caption(){ cap.textContent = C.hero.caption; cap.classList.add("fw-cap-on"); }
  cap.classList.add("fw-cap");
  w.levels(EVEN); w.tray("lunch");
  if (MV.reduceMotion) { for (var j = 0; j < 6; j++) w.grow(j, 1); caption(); return; }
  for (var k = 0; k < 6; k++) w.grow(k, 0);
  var i = 0;
  function next(){
    if (i >= 6) { MV.wait(700, tighten); return; }
    var n = i++; MV.tween({ dur:450, step:function(t){ w.grow(n, t); }, done:function(){ MV.wait(150, next); } });
  }
  function tighten(){
    var swapped = false; w.pulse([A]);
    MV.tween({ dur:1600, ease:function(t){ return t; }, step:function(t){
      w.width(A, WID[2] + 9 * Math.sin(Math.min(1, t * 1.6) * Math.PI / 2)); w.clock(t * 720);
      if (!swapped && t > 0.55) { swapped = true; w.tray("snack"); }
    }, done:function(){ MV.wait(1400, relax); } });
  }
  function relax(){
    var back = false;
    MV.tween({ dur:1000, step:function(t){ w.width(A, WID[2] + 9 * (1 - t)); if (!back && t > 0.5) { back = true; w.tray("lunch"); } },
      done:function(){ w.levels(EVEN); w.pulse([]); caption(); } });
  }
  MV.wait(600, next);
}

// ---------- reflect: the support note sits under the journal (plan) ----------
function addSupport(){
  var j = $("#journal"); if (!j || $("#fw-support")) return;
  var sh = j.closest(".sheet"), d = document.createElement("div");
  d.className = "sheet mv-block"; d.id = "fw-support"; d.innerHTML = MV.C.reflect.support;
  sh.parentNode.insertBefore(d, sh.nextSibling);
}

// ---------- Explore: Food choice web (@component F1 personaPanel — persona chips, profile card, situation chips) ----------
function explore(host, api){
  addSupport();
  var D = api.content, S = api.S, T = D.text, I = D.influences, SIT = {}, PER = {}, cancel = null, cfb = "", lastChoice = null;
  D.personas.forEach(function(p){ PER[p.id] = p; p.sits.forEach(function(s){ SIT[s.id] = s; s.per = p.id; s.L = {}; s.levers.forEach(function(l){ s.L[l.id] = l; }); }); });
  S.sel = S.sel || {}; S.dials = S.dials || {}; S.lev = S.lev || {};
  if (!PER[S.p]) S.p = D.personas[0].id;
  if (!SIT[S.s] || SIT[S.s].per !== S.p) S.s = S.sel[S.p] || PER[S.p].sits[0].id;
  S.mode = S.mode === "change" ? "change" : "read";

  host.innerHTML = '<div class="fw-top">' +
      '<div class="fw-row"><span class="fw-k" id="fw-k-per">Person</span><div id="fw-per"></div></div>' +
      '<div class="fw-profile" id="fw-prof"></div>' +
      '<div class="fw-row"><span class="fw-k">Situation</span><div id="fw-sit"></div></div>' +
      '<div class="fw-row"><span class="fw-k">Mode</span><div id="fw-mode"></div></div></div>' +
    '<div class="pg fw-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="fw-webbox"><div id="fw-web"></div><div class="fw-slide" id="fw-slide" hidden></div></div></div>' +
      '<div class="pg-ctrl"><div id="fw-m1"></div><div id="fw-m2" hidden></div></div>' +
      '<div class="pg-read"><dl class="read" id="fw-read" aria-live="polite"></dl></div></div>';
  var web = foodWeb($("#fw-web", host), { labels:I.map(function(x){ return x.web; }), levels:true });

  function sit(){ return SIT[S.s]; }
  function keyOf(s){ var a = MV.ans(s); return Array.isArray(a) ? a : null; }
  function baseOf(s){ return keyOf(s) || s.model; }
  function dials(s){ return (S.dials[(s || sit()).id] || [0, 0, 0, 0, 0, 0]).slice(); }
  function levs(s){ return (S.lev[s.id] || []).map(function(id){ return s.L[id]; }).filter(Boolean); }
  function webLevels(s, mode){
    if (mode !== "change") return dials(s);
    var L = baseOf(s).slice();
    levs(s).forEach(function(l){ Object.keys(l.fx).forEach(function(k){ L[ki(k)] = clamp(L[ki(k)] + l.fx[k], 0, 3); }); });
    return L;
  }
  function choiceText(s, ls){
    if (!ls.length) return s.choice;
    if (ls.length === 1) return ls[0].choice;
    var k = ls.map(function(l){ return l.id; }).sort().join("+");
    return (s.pairs && s.pairs[k]) || (ls[0].choice + "; plus " + lc(ls[1].choice));
  }
  function changedText(s, ls){
    if (!ls.length) return '<span class="muted">Nothing yet: pull a lever.</span>';
    var cur = baseOf(s).slice(), out = [];
    ls.forEach(function(l){
      var ks = Object.keys(l.fx);
      if (!ks.length && l.none) out.push(l.none);
      ks.forEach(function(k){
        var i = ki(k), v = l.fx[k], was = cur[i], now = clamp(was + v, 0, 3); cur[i] = now;
        out.push(I[i].web + ": " + (v < 0 ? (now < was ? "lower" : "already none") : v > 0 ? (now > was ? "higher" : "even stronger (already high)") : "now pulls toward a different choice"));
      });
    });
    return uniq(out).join(" · ");
  }
  function barEn(s, ls){
    var bar = [s.barrier].concat(ls.filter(function(l){ return l.bar; }).map(function(l){ return l.bar; })), en = ls.filter(function(l){ return l.en; }).map(function(l){ return l.en; });
    if (!en.length) en = [s.enabler];
    return "Barrier" + (bar.length > 1 ? "s" : "") + ": " + bar.join(", ") + "<br>Enabler" + (en.length > 1 ? "s" : "") + ": " + en.join(", ");
  }
  function strongText(L){ var s = L.map(function(v, i){ return v === 3 ? I[i].web : null; }).filter(Boolean); return s.length ? s.join(" · ") : "none set to high"; }
  function ariaText(s, L, ls){
    return "Food choice web for " + PER[s.per].name + ", " + lc(s.name) + ": " + I.map(function(x, i){ return x.web + " " + LV[L[i]]; }).join(", ") + "." +
      (S.mode === "change" ? (ls.length ? " Levers pulled: " + ls.map(function(l){ return MV.plain(l.t); }).join("; ") + "." : " No lever pulled yet.") : "");
  }

  // controls
  var perR = radios($("#fw-per", host), { aria:"Choose a person", cls:"chips", value:S.p,
    options:D.personas.map(function(p){ return { id:p.id, t:p.name + ", " + p.age }; }),
    onChange:function(v){ S.p = v; S.s = S.sel[v] || PER[v].sits[0].id; sitRadios(); afterSit(); } });
  var sitR = null;
  function sitRadios(){
    var h = $("#fw-sit", host); h.innerHTML = "<div></div>";
    sitR = radios(h.firstChild, { aria:"Choose a situation", cls:"chips", value:S.s, options:PER[S.p].sits.map(function(s){ return { id:s.id, t:s.name }; }),
      onChange:function(v){ S.s = v; S.sel[S.p] = v; afterSit(); } });
  }
  sitRadios();
  var modeR = radios($("#fw-mode", host), { aria:"Mode", cls:"seg", value:S.mode, options:[{ id:"read", t:D.modes.read }, { id:"change", t:D.modes.change }],
    onChange:function(v){ S.mode = v; hideSlide(); cfb = ""; web.pulse([]); api.save(); paint(); MV.changed(); } });
  function afterSit(){ hideSlide(); cfb = ""; lastChoice = null; web.pulse([]); api.save(); paint(); MV.changed(); }

  var m1 = $("#fw-m1", host), m2 = $("#fw-m2", host);
  m1.innerHTML = '<p class="tiny muted fw-how">' + T.dialsHow + '</p><div class="fw-dials">' + I.map(function(x, i){ return '<div class="fw-dial"><span class="fw-dial-lab">' + x.name + '</span><div data-dial="' + i + '"></div></div>'; }).join("") + "</div>" +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="fw-check" data-k="fwcheck">Check web</button></div><div id="fw-cfb"></div>';
  var dialR = I.map(function(x, i){
    return radios($('[data-dial="' + i + '"]', m1), { aria:x.name, cls:"seg", value:dials()[i], options:LV.map(function(t, j){ return { id:j, t:t }; }),
      onChange:function(v){ var d = dials(); d[i] = +v; S.dials[S.s] = d; cfb = ""; hideSlide(); api.save(); paint(); MV.changed(); } });
  });
  $("#fw-check", m1).addEventListener("click", function(){
    var s = sit(), d = dials(s), key = keyOf(s);
    if (!key) cfb = fb("", "<p>" + T.noKey + "</p><p><strong>Your strongest pulls:</strong> " + strongText(d) + ".</p>");
    else {
      var miss = [];
      d.forEach(function(v, i){ if (v !== key[i]) miss.push("<li><strong>" + I[i].name + ":</strong> " + s.ev[KEYS[i]] + "</li>"); });
      cfb = miss.length ? fb("bad", "<p><strong>✗ " + (6 - miss.length) + " of 6 dials match.</strong> Look again at the evidence:</p><ul class=\"fw-ev\">" + miss.join("") + "</ul>")
        : fb("good", "<p><strong>✓ " + T.allMatch + "</strong></p><ul class=\"fw-ev\">" + I.map(function(x, i){ return "<li><strong>" + x.name + " (" + LV[key[i]] + "):</strong> " + s.ev[KEYS[i]] + "</li>"; }).join("") + "</ul>");
    }
    $("#fw-cfb", m1).innerHTML = cfb; MV.focusFb($("#fw-cfb", m1));
  });
  m2.innerHTML = '<p class="tiny muted" id="fw-lock"></p><p class="fw-how"><strong>Pull a lever.</strong> <span class="tiny muted">' + T.leversHow + "</span></p>" +
    '<div class="fw-levers" id="fw-levers" role="group" aria-label="Levers"></div><div class="q-actions"><button type="button" class="btn ghost sm" id="fw-clear" data-k="fwclear">Clear levers</button></div>';
  m2.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    hideSlide();
    if (b.id === "fw-clear") { setLevers([]); return; }
    var id = b.dataset.lv; if (!id) return;
    var cur = (S.lev[S.s] || []).slice(), k = cur.indexOf(id);
    if (k >= 0) { cur.splice(k, 1); setLevers(cur); }
    else { cur.push(id); if (cur.length > 2) cur.shift(); setLevers(cur, { pulse:sit().L[id].inf.map(ki) }); }
  });

  function paintLevers(s){
    var on = S.lev[s.id] || [];
    var h = s.levers.map(function(l){
      var p = on.indexOf(l.id) >= 0;
      return '<button type="button" class="fw-lever" data-lv="' + l.id + '" data-k="fwlv' + l.id + '" aria-pressed="' + p + '"><span class="fw-lv-t">' + (p ? '<span aria-hidden="true">✓ </span>' : "") + l.t + "</span>" +
        '<span class="fw-lv-m">Acts on: ' + (l.infNote || l.inf.map(function(k){ return I[ki(k)].web; }).join("; ")) + '</span><span class="fw-lv-m">Cost: ' + l.cost + "</span></button>";
    }).join("");
    var box = $("#fw-levers", m2); MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  function paint(o){
    o = o || {};
    var s = sit(), p = PER[s.per], L = webLevels(s, S.mode), ls = S.mode === "change" ? levs(s) : [], ch = choiceText(s, ls);
    $("#fw-prof", host).innerHTML = "<p><strong>" + p.name + ", " + p.age + ".</strong> " + p.profile + '</p><p class="fw-note"><strong>' + s.name + ":</strong> " + s.note + '</p><p class="tiny muted">' + D.fictional + "</p>";
    m1.hidden = S.mode !== "read"; m2.hidden = S.mode !== "change";
    if (S.mode === "read") { var d = dials(s); dialR.forEach(function(r, i){ r.set(d[i]); }); $("#fw-cfb", m1).innerHTML = cfb; }
    else { $("#fw-lock", m2).textContent = keyOf(s) ? T.lockedKey : T.lockedModel; paintLevers(s); }
    if (!o.noWeb) web.levels(L); else web.words(L);
    web.aria(ariaText(s, L, ls));
    $("#fw-read", host).innerHTML = MV.readoutHTML([
      ["Situation", p.name + ": " + lc(s.name)],
      ["Likely choice", '<span class="fw-choice' + (lastChoice !== null && lastChoice !== ch ? " fw-flash" : "") + '">' + ch + "</span>"],
      ["Strongest pulls", MV.cap(strongText(L))],
      ["Influences active", L.filter(function(v){ return v > 0; }).length + " of 6"],
      ["What changed", S.mode === "change" ? changedText(s, ls) : '<span class="muted">Only in Change one thing</span>'],
      ["Barriers / enablers", barEn(s, ls)]
    ]);
    if (lastChoice !== null && lastChoice !== ch) setTimeout(function(){ var c = $(".fw-choice", host); if (c) c.classList.remove("fw-flash"); }, 1600);
    lastChoice = ch;
  }
  function setLevers(list, o){
    o = o || {};
    var s = sit(), from = KEYS.map(function(_, i){ return web.widthOf(i); });
    S.lev[s.id] = list; api.save();
    var L = webLevels(s, "change"), to = L.map(function(v){ return WID[v]; });
    paint({ noWeb:true }); web.pulse(o.pulse || []);
    if (cancel) cancel();
    cancel = MV.tween({ dur:o.dur == null ? 450 : o.dur, step:function(t){ for (var i = 0; i < 6; i++) web.width(i, from[i] + (to[i] - from[i]) * t); },
      done:function(){ cancel = null; web.levels(L); if (o.done) o.done(); } });
    MV.changed();
  }
  // P3's survey slide sits over the web
  var slide = $("#fw-slide", host);
  slide.addEventListener("click", function(e){ if (e.target.closest("#fw-slide-x")) hideSlide(); });
  function showSlide(){
    slide.innerHTML = '<div class="fw-slide-card"><p class="fw-slide-k">' + T.slideLabel + '</p><p class="fw-quote">' + T.slideQuote + '</p></div><div class="fw-tpe" hidden><p class="fw-tpe-t">' + T.tpeTitle + "</p><p>" + T.tpeText + '</p></div><button type="button" class="btn ghost sm" id="fw-slide-x" data-k="fwslidex">Back to the web</button>';
    slide.hidden = false;
  }
  function hideSlide(){ if (!slide.hidden) slide.hidden = true; }
  paint();

  // challenge tests (plan "Exact test" and named wrong states)
  function chal(id){
    var c = D.challenges.filter(function(x){ return x.id === id; })[0], s = SIT[c.sit], W = c.wrong;
    if (id === "tc1") {
      var d = S.dials[s.id];
      if (!d || d.every(function(v){ return v === 0; })) return { ok:false, msg:c.start };
      if (d.join() === keyOf(s).join()) return { ok:true };
      var m = [];
      if (d[ki("eco")] === 3) m.push(W.eco);
      if (d[ki("med")] >= 2) m.push(W.med);
      if (d[ki("bio")] <= 1) m.push(W.bio);
      return { ok:false, msg:m.length ? m.join(" ") : c.general };
    }
    var L = S.lev[s.id] || [];
    if (!L.length) return { ok:false, msg:c.start };
    if (id === "tc2") {
      if (L.length > 1) return { ok:false, msg:W.many };
      if (MV.ans(c).indexOf(L[0]) >= 0) return { ok:true };
      return { ok:false, msg:W[L[0]] || c.general };
    }
    if (id === "tc3") {
      if (L.length < 2) return { ok:false, msg:W.one };
      if (L.indexOf("sponsored") >= 0) return { ok:false, msg:W.media };
      var a = s.L[L[0]], b = s.L[L[1]];
      if (a.inf.indexOf("med") >= 0 || b.inf.indexOf("med") >= 0) return { ok:false, msg:W.mute };
      if (a.inf.some(function(k){ return b.inf.indexOf(k) >= 0; })) return { ok:false, msg:W.same };
      var key = L.slice().sort().join("+");
      if (MV.ans(c).some(function(pr){ return pr.slice().sort().join("+") === key; })) return { ok:true };
      return { ok:false, msg:W.barrier };
    }
    return { ok:false };
  }

  return {
    predict:{
      start:function(p){
        hideSlide(); if (cancel) { cancel(); cancel = null; }
        if (p.slide) { showSlide(); return; }
        S.p = p.start.p; S.s = p.start.s; S.sel[S.p] = S.s; S.mode = "change"; S.lev[S.s] = []; cfb = ""; lastChoice = null; api.save();
        perR.set(S.p); sitRadios(); modeR.set("change"); web.pulse([]); paint(); MV.changed();
      },
      run:function(p, done){
        if (p.slide) { MV.wait(500, function(){ var t = $(".fw-tpe", slide); if (t) t.hidden = false; MV.wait(700, done); }); return; }
        var l = sit().L[p.lever];
        setLevers([p.lever], { dur:1100, pulse:l.inf.map(ki), done:function(){ MV.wait(300, done); } });
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// ---------- Part 3: Marketing on the menu (technique spotter, check it with data, the rules) ----------
var ICO = {
  fox:'<svg class="mk-ico" viewBox="0 0 48 48" aria-hidden="true"><path d="M7 8l11 9h12l11-9-2 17c-2 9-8 15-15 15S11 34 9 25z" fill="var(--p-k)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/><path d="M14 29c3 6 7 8 10 8s7-2 10-8c-3 1-6 1-10 1s-7 0-10-1z" fill="var(--sheet)"/><circle cx="18" cy="24" r="2.2" fill="var(--ink)"/><circle cx="30" cy="24" r="2.2" fill="var(--ink)"/><path d="M22 31h4l-2 2.5z" fill="var(--ink)"/></svg>',
  star:'<svg class="mk-ico" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3l5 9 10-3-3 10 9 5-9 5 3 10-10-3-5 9-5-9-10 3 3-10-9-5 9-5-3-10 10 3z" fill="var(--hi)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  scan:'<svg class="mk-ico" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="var(--ink)" stroke-width="2.4"><path d="M8 16V8h8M32 8h8v8M40 32v8h-8M16 40H8v-8"/><path d="M17 17h5v5h-5zM26 17h5v5h-5zM17 26h5v5h-5z" fill="var(--acol)"/><path d="M27 27h4v4"/></svg>',
  shelf:'<svg class="mk-ico mk-wide" viewBox="0 0 96 48" aria-hidden="true"><path d="M4 14h88M4 44h88" stroke="var(--ink-2)" stroke-width="2.5"/><rect x="10" y="2" width="14" height="12" fill="none" stroke="var(--ink-2)"/><rect x="60" y="3" width="12" height="11" fill="none" stroke="var(--ink-2)"/><rect x="38" y="22" width="20" height="22" rx="2" fill="var(--p-k)" stroke="var(--ink)" stroke-width="2"/><path d="M41 30h14M41 35h10" stroke="var(--hi)" stroke-width="2.5"/></svg>',
  ball:'<svg class="mk-ico" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="var(--ink)" stroke-width="2"><circle cx="20" cy="24" r="13" fill="var(--p-k)"/><path d="M7 24h26M20 11v26M11 15c5 5 5 13 0 18M29 15c-5 5-5 13 0 18"/><rect x="36" y="14" width="8" height="24" rx="3" fill="var(--pen)"/><path d="M38 12h4"/></svg>',
  cal:'<svg class="mk-ico" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="var(--ink)" stroke-width="2"><rect x="8" y="10" width="32" height="30" rx="3"/><path d="M8 18h32M16 6v8M32 6v8"/><path d="M15 26h6M27 26h6M15 33h6" stroke="var(--p-c)" stroke-width="3"/></svg>',
  bar:'<svg class="mk-ico" viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="16" width="36" height="16" rx="4" fill="var(--hi)" stroke="var(--ink)" stroke-width="2"/><path d="M14 20v8M34 20v8" stroke="var(--ink)" stroke-width="2"/></svg>',
  code:'<svg class="mk-ico" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="var(--ink)" stroke-width="2"><path d="M8 14h32v20H8z" stroke-dasharray="4 3"/><path d="M15 24h18" stroke="var(--p-c)" stroke-width="3"/></svg>',
  wheel:'<svg class="mk-ico" viewBox="0 0 48 48" aria-hidden="true" stroke="var(--ink)" stroke-width="1.5"><circle cx="24" cy="24" r="18" fill="var(--sheet)"/><path d="M24 24V6A18 18 0 0 1 39.6 15z" fill="var(--hi)"/><path d="M24 24l15.6-9A18 18 0 0 1 39.6 33z" fill="var(--p-k)"/><path d="M24 24l15.6 9A18 18 0 0 1 24 42z" fill="var(--acol)"/><path d="M24 24v18A18 18 0 0 1 8.4 33z" fill="var(--hi)"/><path d="M24 24L8.4 33A18 18 0 0 1 8.4 15z" fill="var(--p-k)"/><path d="M24 24L8.4 15A18 18 0 0 1 24 6z" fill="var(--acol)"/><circle cx="24" cy="24" r="3" fill="var(--ink)"/></svg>',
  tag:'<svg class="mk-ico" viewBox="0 0 48 48" aria-hidden="true"><path d="M6 24L22 8h18v18L24 42z" fill="var(--p-c)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/><circle cx="33" cy="15" r="3" fill="var(--sheet)"/><text x="22" y="31" font-size="13" font-weight="700" fill="var(--sheet)" text-anchor="middle">$5</text></svg>'
};
function part3(host, api){
  var D = api.content, S = api.S, TQ = {}, SP = {}, sel = null, msg = "";
  S.st = S.st || "spot"; S.ad = S.ad || D.ads[0].id; S.tags = S.tags || {}; S.d = S.d || {}; S.rules = S.rules || {}; S.real = S.real || {};
  D.techniques.forEach(function(t){ TQ[t.id] = t; });
  D.ads.forEach(function(a){ a.spots.forEach(function(sp){ SP[sp.id] = sp; sp.ad = a.id; }); });
  host.innerHTML = '<div id="mk-st" class="mk-st"></div><div class="mk-panel" data-p="spot"></div><div class="mk-panel" data-p="data" hidden></div><div class="mk-panel" data-p="rules" hidden></div>';
  var P = {}; $$(".mk-panel", host).forEach(function(p){ P[p.dataset.p] = p; });
  radios($("#mk-st", host), { aria:"Stations", cls:"chips", value:S.st, options:D.stations, onChange:function(v){ S.st = v; api.save(); show(); } });
  function show(){ Object.keys(P).forEach(function(k){ P[k].hidden = k !== S.st; }); }

  // Station 1: technique spotter
  var p1 = P.spot, adR;
  p1.innerHTML = "<p>" + D.spotIntro + '</p><div class="mk-adbar"><div id="mk-adsel"></div><span class="tiny muted" id="mk-prog" aria-live="polite"></span></div>' +
    '<div id="mk-stage"></div><div class="mk-tagbar"><p class="tiny" id="mk-sel" aria-live="polite"></p><div class="mk-tags" id="mk-tags" role="group" aria-label="Techniques"></div></div><div id="mk-fb"></div><div id="mk-how"></div><div class="mk-real" id="mk-real"></div>';
  function adDone(a){ return a.spots.every(function(sp){ return S.tags[sp.id]; }); }
  adR = radios($("#mk-adsel", p1), { aria:"Choose an ad", cls:"chips", value:S.ad,
    options:D.ads.map(function(a){ return { id:a.id, t:function(){ return (adDone(a) ? '<span aria-hidden="true">✓ </span>' : "") + a.name; } }; }),
    onChange:function(v){ S.ad = v; sel = null; msg = ""; api.save(); paintSpot(); } });
  function spot(id, vis){
    var sp = SP[id], tg = S.tags[id];
    return '<button type="button" class="mk-spot' + (tg ? " done" : "") + '" data-spot="' + id + '" data-k="mks' + id + '" aria-pressed="' + (sel === id) + '"' + (tg ? " disabled" : "") + ">" + (vis || "") +
      '<span class="mk-spot-t">' + sp.t + "</span>" + (tg ? '<span class="mk-badge">✓ ' + TQ[MV.ans(sp)].name + "</span>" : "") + "</button>";
  }
  function adHTML(a){
    var head = '<p class="mk-made">' + D.made + "</p>";
    if (a.id === "cereal") return '<div class="mk-ad mk-cereal">' + head + '<div class="mk-box"><p class="mk-brand">' + a.brand + "</p>" + spot("a1", ICO.fox) + spot("a2", ICO.star) + spot("a3", ICO.scan) + "</div>" + spot("a4", ICO.shelf) + "</div>";
    if (a.id === "drink") return '<div class="mk-ad mk-drink">' + head + '<p class="mk-brand">' + a.brand + ': video storyboard</p><div class="mk-story">' + spot("b1", ICO.ball) + spot("b2", ICO.cal) + "</div></div>";
    if (a.id === "post") return '<div class="mk-ad mk-phone">' + head + '<div class="mk-screen"><p class="mk-handle">' + a.brand + '</p><p class="tiny muted mk-cap">what I eat in a day: exam edition</p>' + spot("c1", ICO.bar) + spot("c2", ICO.code) + spot("c3") + "</div></div>";
    return '<div class="mk-ad mk-phone">' + head + '<div class="mk-screen"><p class="mk-handle">' + a.brand + "</p>" + spot("d1", ICO.wheel) + spot("d2", ICO.tag) + "</div></div>";
  }
  function paintSpot(){
    var a = D.ads.filter(function(x){ return x.id === S.ad; })[0] || D.ads[0], n = Object.keys(SP).length, done = Object.keys(SP).filter(function(id){ return S.tags[id]; }).length;
    adR.repaint();
    $("#mk-prog", p1).textContent = "Tagged: " + done + " of " + n;
    var stage = $("#mk-stage", p1); MV.keepFocus(stage, function(){ stage.innerHTML = adHTML(a); });
    $("#mk-sel", p1).innerHTML = sel ? "<strong>Selected:</strong> " + SP[sel].t + ". Now tap the technique." : "Tap a part of the ad first.";
    var tags = $("#mk-tags", p1);
    MV.keepFocus(tags, function(){ tags.innerHTML = D.techniques.map(function(t){ return '<button type="button" class="mk-tag" data-tq="' + t.id + '" data-k="mkt' + t.id + '"' + (sel ? "" : " disabled") + ">" + t.name + "</button>"; }).join(""); });
    $("#mk-fb", p1).innerHTML = msg;
    var got = a.spots.filter(function(sp){ return S.tags[sp.id]; });
    $("#mk-how", p1).innerHTML = got.length ? '<div class="mk-howbox"><h4>How it works</h4><ul>' + got.map(function(sp){ var t = TQ[MV.ans(sp)]; return "<li><strong>" + t.name + ":</strong> " + t.how + "</li>"; }).join("") + "</ul></div>" : "";
  }
  p1.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.spot) { sel = sel === b.dataset.spot ? null : b.dataset.spot; msg = ""; paintSpot(); return; }
    if (b.dataset.tq && sel) {
      var sp = SP[sel], t = TQ[b.dataset.tq];
      if (b.dataset.tq === MV.ans(sp)) { S.tags[sel] = true; msg = fb("good", "<p><strong>✓ " + t.name + ".</strong> " + t.how + "</p>"); sel = null; }
      else msg = fb("bad", "<p><strong>✗ Not quite.</strong> " + sp.cue + "</p>");
      api.save(); paintSpot(); MV.focusFb($("#mk-fb", p1));
    }
  });
  // real-example slot (teacher-selected; screenshots stay in memory only, text fields save)
  var R = D.real, realBox = $("#mk-real", p1);
  realBox.innerHTML = '<details class="alg mk-realbox"><summary>' + R.title + '</summary><p class="tiny" style="margin-top:10px">' + R.intro + "</p>" + R.slots.map(function(name, n){
    var st = S.real[n] || {};
    return '<div class="mk-slot"><h5>' + name + '</h5><div class="mk-slot-in"><label class="mk-file">Add a screenshot<input type="file" accept="image/*" data-img="' + n + '"></label>' +
      '<label>Source<input type="text" class="txtin" data-real="' + n + '" data-f="src" autocomplete="off" value="' + esc(st.src || "") + '"></label>' +
      '<label>Date<input type="text" class="txtin" data-real="' + n + '" data-f="date" autocomplete="off" value="' + esc(st.date || "") + '"></label></div>' +
      '<figure class="mk-fig" id="mk-fig' + n + '" hidden><img alt=""><figcaption id="mk-cr' + n + '"></figcaption></figure>' +
      R.prompts.map(function(q, qi){ return '<div class="jq"><label for="mk-r' + n + qi + '">' + q + '</label><textarea id="mk-r' + n + qi + '" data-real="' + n + '" data-f="q' + qi + '">' + esc(st["q" + qi] || "") + "</textarea></div>"; }).join("") + "</div>";
  }).join("") + '<div class="refresh"><h4>What a strong analysis does</h4><ul class="mk-crit">' + R.criteria.map(function(c){ return "<li>" + c + "</li>"; }).join("") + "</ul></div></details>";
  function credit(n){
    var st = S.real[n] || {}, el = $("#mk-cr" + n, realBox);
    if (el) el.textContent = "Source: " + (st.src || "(add the source)") + ". Date: " + (st.date || "(add the date)") + ". " + R.credit;
  }
  realBox.addEventListener("input", function(e){
    var t = e.target, n = t.dataset.real; if (n == null) return;
    var st = S.real[n] || (S.real[n] = {}); st[t.dataset.f] = t.value; api.save(); credit(n);
  });
  realBox.addEventListener("change", function(e){
    var t = e.target, n = t.dataset.img; if (n == null || !t.files || !t.files[0] || !window.FileReader) return;
    var r = new FileReader();
    r.onload = function(){ var fig = $("#mk-fig" + n, realBox), img = $("img", fig); img.src = r.result; img.alt = "Screenshot added for " + MV.plain(R.slots[n]); fig.hidden = false; credit(n); };
    r.readAsDataURL(t.files[0]);
  });

  // Station 2: check it with data
  var p2 = P.data, G = D.data;
  function chart(){
    var W = 400, H = 240, x0 = 44, y0 = 200, top = 24, sc = (y0 - top) / 35, bw = 54, gap = (W - x0 - 10 - bw * G.groups.length) / G.groups.length, h = "";
    for (var v = 0; v <= 30; v += 10) h += '<path d="M' + x0 + " " + (y0 - v * sc).toFixed(1) + "H" + (W - 6) + '" class="mk-grid"/><text x="' + (x0 - 6) + '" y="' + (y0 - v * sc + 4).toFixed(1) + '" text-anchor="end" class="mk-ax">' + v + "</text>";
    G.groups.forEach(function(g, i){
      var x = x0 + gap / 2 + i * (bw + gap), y = y0 - g[1] * sc;
      h += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw + '" height="' + (g[1] * sc).toFixed(1) + '" class="mk-bar"/><text x="' + (x + bw / 2).toFixed(1) + '" y="' + (y - 6).toFixed(1) + '" text-anchor="middle" class="mk-val">' + g[1] + "</text>" +
        '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (y0 + 18) + '" text-anchor="middle" class="mk-ax">' + esc(g[0]) + "</text>";
    });
    h += '<path d="M' + x0 + " " + top + "V" + y0 + "H" + (W - 6) + '" class="mk-axis"/><text x="12" y="' + ((top + y0) / 2) + '" transform="rotate(-90 12 ' + ((top + y0) / 2) + ')" text-anchor="middle" class="mk-ax">' + esc(G.unit) + "</text>";
    return '<svg class="mk-chart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc("Bar chart, model data: " + G.title + ". " + G.groups.map(function(g){ return g[0] + ": " + g[1]; }).join("; ") + ".") + '">' + h + "</svg>";
  }
  p2.innerHTML = '<figure class="mk-chartbox"><figcaption><strong>' + G.title + '</strong> <span class="hfa-model">Model data</span></figcaption>' + chart() + '<p class="tiny muted">' + G.note + "</p></figure>" +
    '<div id="mk-dq"></div><details class="alg"><summary>Check it with data: the numbers behind the chart</summary>' +
    MV.tableHTML({ head:["Age group", "Ads seen per day (" + G.unit + ")"], rows:G.groups.map(function(g){ return [g[0], g[1]]; }), caption:G.title }) + '<p class="tiny muted" style="margin:8px 0 0">' + G.note + "</p></details>";
  var dq = $("#mk-dq", p2);
  function paintDQ(){
    MV.keepFocus(dq, function(){
      dq.innerHTML = G.questions.map(function(q, qi){
        var st = S.d[q.id] || {}, h = '<div class="q" data-dq="' + q.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (qi + 1) + '</span><div class="q-prompt">' + q.prompt + "</div></div>";
        h += '<div class="opts" role="group" aria-label="Choices">' + q.options.map(function(o, oi){
          var c = "opt", on = q.multi ? !!(st.pick || {})[oi] : st.choice === oi;
          if (q.multi) { if (st.checked && on) c += MV.ok(o) ? " right" : " wrong"; else if (on) c += " picked"; }
          else if (on) c += MV.ok(o) ? " right" : " wrong";
          return '<button type="button" class="' + c + '" ' + (q.multi ? 'role="checkbox" aria-checked="' + on + '"' : 'aria-pressed="' + on + '"') + ' data-o="' + oi + '" data-k="dq' + q.id + oi + '"' + (st.solved ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + (q.multi ? (on ? "☑" : "☐") : String.fromCharCode(65 + oi)) + "</span><span>" + o.t + "</span></button>";
        }).join("") + "</div>";
        if (q.multi && !st.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="dqcheck" data-k="dqc' + q.id + '">Check</button></div>';
        if (!q.multi && st.choice != null) { var o = q.options[st.choice]; h += fb(MV.ok(o) ? "good" : "bad", "<p><strong>" + (MV.ok(o) ? "✓ Correct." : "✗ Not quite.") + "</strong> " + o.why + "</p>"); }
        if (q.multi && st.checked) h += fb(st.solved ? "good" : "bad", "<p><strong>" + (st.solved ? "✓ Correct." : "✗ Not quite.") + "</strong> " + (st.solved ? q.why : q.wrongWhy) + "</p>");
        return h + "</div>";
      }).join("");
    });
  }
  dq.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-dq]"), q = G.questions.filter(function(x){ return x.id === box.dataset.dq; })[0], st = S.d[q.id] || (S.d[q.id] = {});
    if (b.dataset.o != null) {
      var oi = +b.dataset.o;
      if (q.multi) { st.pick = st.pick || {}; st.pick[oi] = !st.pick[oi]; st.checked = false; }
      else { st.choice = oi; st.solved = MV.ok(q.options[oi]); }
    } else if (b.dataset.act === "dqcheck") {
      st.pick = st.pick || {}; st.checked = true; st.solved = q.options.every(function(o, i){ return !!st.pick[i] === MV.ok(o); });
    } else return;
    api.save(); paintDQ(); if (!q.multi || b.dataset.act) MV.focusFb($('[data-dq="' + q.id + '"]', dq));
  });
  paintDQ();

  // Station 3: the rules (reflection, not scored)
  var p3 = P.rules, RU = D.rules;
  p3.innerHTML = '<div class="mk-cards">' + RU.cards.map(function(c){ return '<div class="mk-card"><p>' + c + "</p></div>"; }).join("") + "</div>" +
    '<p class="mk-q"><strong>' + RU.prompt + "</strong></p>" + RU.labels.map(function(l, i){ return '<div class="jq"><label for="mk-ru' + i + '">' + l + '</label><textarea id="mk-ru' + i + '" data-ru="' + i + '">' + esc(S.rules[i] || "") + "</textarea></div>"; }).join("") +
    '<p class="tiny muted">' + RU.note + "</p>";
  p3.addEventListener("input", function(e){ var i = e.target.dataset.ru; if (i == null) return; S.rules[i] = e.target.value; api.save(); });

  show(); paintSpot();
  return {};
}

// ---------- Practice 2: Ask a better question (custom: number entry, choose, and a survey-question builder) ----------
function inquiry(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {}, TB = a.table;
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", choice:null, slots:{}, tries:0, hint:0, solved:false, first:null }); }
  var tbl = '<div class="aq-data"><p class="tiny"><span class="hfa-model">Model data</span> ' + TB.caption + "</p>" + MV.tableHTML({ head:TB.head, rows:TB.rows, caption:TB.caption }) + "</div>";
  host.innerHTML = (a.how ? '<p class="how">' + a.how + "</p>" : "") + tbl + '<div id="aq-items"></div>';
  var box = $("#aq-items", host);
  function fill(t, time){ return t.replace("{time}", time ? "<strong>" + time + "</strong>" : "<span class=\"aq-gap\">(time frame)</span>"); }
  function slotRow(it, key, list, x){
    return '<div class="aq-slot"><p class="aq-slot-l">' + it.labels[key] + '</p><div class="aq-chips" role="radiogroup" aria-label="' + esc(it.labels[key]) + '">' + list.map(function(o, oi){
      var on = x.slots[key] === oi, txt = key === "stem" ? fill(o.t, "") : o.t;
      return '<button type="button" class="aq-chip" role="radio" aria-checked="' + on + '" data-slot="' + key + '" data-o="' + oi + '" data-k="aq' + it.id + key + oi + '"' + (x.solved ? " disabled" : "") + ">" + txt + "</button>";
    }).join("") + "</div></div>";
  }
  function itemHTML(it, i){
    var x = ist(it.id), h = '<div class="q" data-aq="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "num") h += '<div class="numrow"><label for="aq-' + it.id + '">Your answer:</label><input class="numin short" id="aq-' + it.id + '" data-num="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + esc(x.val) + '"' + (x.solved ? " disabled" : "") + '><span class="m">' + it.unit + "</span></div>";
    else if (it.kind === "mc") h += '<div class="opts" role="radiogroup" aria-label="Answer choices">' + it.options.map(function(o, oi){
      var c = "opt" + (x.choice === oi ? " picked" : "") + (x.solved && MV.ok(o) ? " right" : "");
      return '<button type="button" class="' + c + '" role="radio" aria-checked="' + (x.choice === oi) + '" data-o="' + oi + '" data-k="aq' + it.id + oi + '"' + (x.solved ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + String.fromCharCode(65 + oi) + "</span><span>" + o.t + "</span></button>";
    }).join("") + "</div>";
    else {
      h += slotRow(it, "stem", it.stems, x) + slotRow(it, "time", it.times, x) + slotRow(it, "scale", it.scales, x);
      var st = x.slots, q = st.stem != null ? fill(it.stems[st.stem].t, st.time != null ? it.times[st.time].t : "") : '<span class="aq-gap">(choose a stem)</span>';
      h += '<div class="aq-preview"><p class="aq-slot-l">' + it.labels.preview + "</p><p>" + q + (st.scale != null ? ' <span class="muted">Answers: ' + it.scales[st.scale].t + "</span>" : "") + "</p></div>";
    }
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="aq' + it.id + 'chk">Check</button>' + MV.hintBtn("aq" + it.id + "h", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += fb("good", "<p><strong>✓ Correct.</strong> " + (it.kind === "mc" ? it.options.filter(MV.ok)[0].why : it.why) + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p>");
    else if (msgs[it.id]) h += fb("bad", "<p>" + msgs[it.id] + "</p>");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(box, function(){ box.innerHTML = a.items.map(itemHTML).join(""); }); }
  function judge(it, x){
    if (it.kind === "num") {
      var r = MV.parseNum(String(x.val).replace(/%/g, "").trim());
      if (!r || r.length !== 1) return { bad:"Enter a number, such as 25 or 25%." };
      var v = r[0], want = MV.ans(it);
      if (Math.abs(v - want) < 1e-6) return { ok:true };
      var w = (it.wrong || []).filter(function(m){ return Math.abs(m.match - v) < 1e-6; })[0];
      return { fb:w ? w.fb : it.general };
    }
    if (it.kind === "mc") {
      if (x.choice == null) return { bad:"Choose an answer first." };
      var o = it.options[x.choice]; return MV.ok(o) ? { ok:true } : { fb:o.why };
    }
    var s = x.slots;
    if (s.stem == null || s.time == null || s.scale == null) return { bad:it.wrong.incomplete };
    if (!MV.ok(it.stems[s.stem])) return { fb:it.wrong.judge };
    if (!MV.ok(it.scales[s.scale])) return { fb:it.wrong.scale };
    return MV.ok(it.times[s.time]) ? { ok:true } : { fb:it.wrong.incomplete };
  }
  box.addEventListener("input", function(e){ var id = e.target.dataset.num; if (!id) return; ist(id).val = e.target.value; api.save(); });
  box.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset.num) { var b = box.querySelector('[data-k="aq' + e.target.dataset.num + 'chk"]'); if (b) b.click(); } });
  box.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-aq]"), it = a.items.filter(function(y){ return y.id === q.dataset.aq; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.slot) { x.slots[b.dataset.slot] = +b.dataset.o; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.o != null) { x.choice = +b.dataset.o; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.bad) msgs[it.id] = r.bad;
      else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + r.fb + " Try again."; }
      api.save(); paint(); MV.focusFb(box.querySelector('[data-aq="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Two changes for Amira's family ----------
var task = (function(){
  var api = null, web = null;
  function T(){ return MV.C.task; }
  function card(id){ return T().cards.filter(function(c){ return c.id === id; })[0]; }
  function read(){ var p = (api && api.S.pick) || []; return { pick:p.slice() }; }
  function levelsFor(pick){
    var L = T().base.slice();
    pick.forEach(function(id){ var c = card(id); Object.keys(c.fx).forEach(function(k){ L[ki(k)] = clamp(L[ki(k)] + c.fx[k], 0, 3); }); });
    return L;
  }
  function paint(){
    var t = T(), d = read(), I = MV.C.explore.influences, total = d.pick.reduce(function(s, id){ return s + card(id).cost; }, 0);
    var box = $("#tk-cards");
    MV.keepFocus(box, function(){
      box.innerHTML = t.cards.map(function(c){
        var on = d.pick.indexOf(c.id) >= 0;
        return '<button type="button" class="tk-card" data-tk="' + c.id + '" data-k="tk' + c.id + '" aria-pressed="' + on + '"><span class="tk-id">' + (on ? '<span aria-hidden="true">✓ </span>' : "") + c.id + '</span><span class="tk-t">' + c.t + "</span>" +
          '<span class="tk-m"><b>Influence:</b> ' + c.infT + '</span><span class="tk-m"><b>' + t.text.cost + ":</b> " + c.costT + '</span><span class="tk-m"><b>' + t.text.level + ":</b> " + c.level + "</span>" + (c.note ? '<span class="tk-m tk-note">' + c.note + "</span>" : "") + "</button>";
      }).join("");
    });
    $("#tk-count").textContent = d.pick.length + " " + t.text.picked + " · " + t.text.total + ": $" + total;
    var base = t.base, L = levelsFor(d.pick), ease = [], hard = [];
    L.forEach(function(v, i){ if (v < base[i]) ease.push(I[i].web); else if (v > base[i]) hard.push(I[i].web); });
    web.levels(L);
    web.pulse(L.map(function(v, i){ return v !== base[i] ? i : -1; }).filter(function(i){ return i >= 0; }));
    web.aria("Amira’s family web: " + I.map(function(x, i){ return x.web + " " + LV[L[i]]; }).join(", ") + ".");
    $("#tk-legend").innerHTML = d.pick.length ? (ease.length ? "<strong>" + t.text.easing + ":</strong> " + ease.join(", ") + ". " : "") + (hard.length ? "<strong>" + t.text.harder + ":</strong> " + hard.join(", ") + "." : "") : t.text.none;
  }
  return {
    render:function(inp, pv, a){
      api = a; a.S.pick = Array.isArray(a.S.pick) ? a.S.pick : [];
      inp.innerHTML = '<p class="tiny" id="tk-count" aria-live="polite"></p><div class="tk-cards" id="tk-cards" role="group" aria-label="Lever cards"></div>';
      pv.innerHTML = '<div class="tk-web" id="tk-web"></div><p class="tiny muted">' + T().text.legend + '</p><p class="tiny" id="tk-legend" aria-live="polite"></p>';
      web = foodWeb($("#tk-web"), { labels:MV.C.explore.influences.map(function(x){ return x.web; }), levels:true });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-tk]"); if (!b) return;
        var p = a.S.pick, k = p.indexOf(b.dataset.tk);
        if (k >= 0) p.splice(k, 1); else p.push(b.dataset.tk);
        a.save(); paint(); a.update();
      });
      paint();
    },
    read:read,
    valid:function(d){ return d.pick.length ? true : "Tap two lever cards first."; },
    checks:function(d){
      if (!d.pick.length) return [false, false, false, false, false, false];
      var cs = d.pick.map(card), inf = {}, cost = 0;
      cs.forEach(function(c){ c.inf.forEach(function(k){ inf[k] = 1; }); cost += c.cost; });
      var has = function(id){ return d.pick.indexOf(id) >= 0; };
      return [d.pick.length === 2, Object.keys(inf).length >= 2, cost <= 5, !has("L3"), has("L2") || has("L7"), !has("L8")];
    },
    key:function(d){ return d.pick.slice().sort().join("+"); },
    label:function(k){ return k.split("+").join(" + "); },
    text:function(k){ return k.split("+").join(" + "); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ inquiry:inquiry },
  task:task
});
})();
