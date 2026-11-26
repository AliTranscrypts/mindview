// HFA4U 25 Ethical Food Choices: hero (a basket of five proteins, an eight-spoke compass; the Environment spoke lengthens and
// lentils rise, then Convenience lengthens and eggs rise; final frame shows both rankings side by side), Values compass
// (Explore, F12: seven weight sliders, persona filter, household / institution mode, live ranking with ties, readout, "See the
// ratings" panel, P1 evidence card), Make your case (Part 3, F12 claim–evidence–reasoning builder with F13 evidence-quality
// tags), Hidden trade-offs (practice ★ set: tap answers and N4 number entry) and "My food philosophy" (task: ranked values,
// commitment chips, trade-off, constraints, counterargument, statement with a live 8-line checklist). Plan wording lives in
// content.mjs; this file adds only control labels and layout text.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function f1(v){ return String(Math.round(v * 10) / 10); }
function byId(list, id){ for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i]; return null; }
function listAnd(a){ return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
function cap1(s){ s = String(s || ""); return s.charAt(0).toUpperCase() + s.slice(1); }
function words(s){ return String(s || "").trim().split(/\s+/).filter(function(w){ return /[A-Za-z0-9À-ɏ$]/.test(w); }).length; }
function lin(t){ return t; }
function fresh(box){ box.innerHTML = ""; var h = document.createElement("div"); box.appendChild(h); return h; }

// ---------- @component radioGroup (copied from HFA4U 19 / 12; "efc-" classes; options may be changed in place, then repaint) ----------
//   radios(host, {label, aria, options:[{id, t, cls}], value, cls:"seg"|"chips", onChange}) -> {set, get, repaint}
//   Use a fresh host for every call: it adds its listeners to host.
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), kind = o.cls === "chips" ? "efc-chipset" : "seg";
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), lab = typeof o.label === "function" ? o.label() : o.label;
    host.innerHTML = '<span class="efc-rgw">' + (lab ? '<span class="efc-rgl">' + lab + "</span>" : "") + '<span class="efc-rg ' + kind + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || lab || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && i === 0) ? 0 : -1) + '" data-rg="' + esc(String(x.id)) + '"' + (x.cls ? ' class="' + x.cls + '"' : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = null; $$("[data-rg]", host).forEach(function(x){ if (x.dataset.rg === val) b = x; }); b = b || host.querySelector("[data-rg]"); if (b) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && host.contains(b)) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); });
    var k = ids.indexOf(val); choose(ids[k < 0 ? (d > 0 ? 0 : ids.length - 1) : clamp(k + d, 0, ids.length - 1)]);
  });
  paint();
  return { set:function(id){ id = String(id == null ? "" : id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, repaint:paint };
}

// ---------- F12 values model (plan's ratings and score rule, exact) ----------
var VK = ["env", "welf", "lab", "loc", "cost", "hlth", "conv"];
function EX(){ return MV.C.explore; }
function OPTS(){ return EX().options; }
function zeroW(){ var w = {}; VK.forEach(function(k){ w[k] = 0; }); return w; }
function normW(w){ var r = zeroW(); VK.forEach(function(k){ var v = Math.round(+((w || {})[k])); r[k] = isFinite(v) ? clamp(v, 0, 5) : 0; }); return r; }
function score(o, w){ var s = 0; VK.forEach(function(k, i){ s += (w[k] || 0) * o.r[i]; }); return s; }
function personaOf(id){ return byId(EX().personas, id) || EX().personas[0]; }
// Ranking: higher score first; ties share a place and keep the plan's option order (O1…O5), as the plan's readouts list them.
function rankOf(w, pid){
  var P = personaOf(pid), out = P.out || [], on = [], off = [];
  OPTS().forEach(function(o, i){ if (out.indexOf(o.id) >= 0) off.push({ o:o, i:i, s:null, out:true }); else on.push({ o:o, i:i, s:score(o, w) }); });
  on.sort(function(a, b){ return b.s - a.s || a.i - b.i; });
  on.forEach(function(x, k){ x.place = k && Math.abs(on[k - 1].s - x.s) < 1e-9 ? on[k - 1].place : k + 1; });
  on.forEach(function(x){ x.tie = on.filter(function(y){ return Math.abs(y.s - x.s) < 1e-9; }).length > 1; });
  var top = on.length ? on.filter(function(x){ return Math.abs(x.s - on[0].s) < 1e-9; }) : [];
  return { on:on, off:off, top:top, order:on.concat(off) };
}
function rankText(R){ return R.on.map(function(x){ return x.o.short + " " + x.s; }).join(" · "); }
function anyW(w){ return VK.some(function(k){ return w[k] > 0; }); }

// ---------- hero (storyboard: basket of five proteins; the eight-spoke compass appears; Environment lengthens and lentils rise;
// Convenience lengthens instead and eggs rise; caption). Reduced motion: final frame only, both rankings side by side. ----------
var SPOKES = [["Environment"], ["Animal", "welfare"], ["Fair labour"], ["Local", "economy"], ["Cost and access"], ["Health"], ["Convenience"], ["Culture and", "religion"]];
var HERO_NAMES = { O1:"Beef", O2:"Lentils", O3:"Lake fish", O4:"Tofu", O5:"Eggs" };
function hero(f){
  var host = $("#efc-hero"); if (!host) return;
  var Hc = MV.C.hero, st = { basket:0, compass:0, env:0, conv:0, colA:0, colB:0 }, dispA = {}, dispB = {}, frozenA = null;
  host.innerHTML = '<svg class="efc-hsvg" role="img" aria-label="' + esc(Hc.aria) + '"></svg>';
  var svg = host.firstChild;
  function T(x, y, s, cls, anchor, op){ return '<text class="' + cls + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "start") + '"' + (op != null && op < 1 ? ' opacity="' + f1(op) + '"' : "") + ">" + s + "</text>"; }
  function scores(env, conv){ var w = zeroW(); w.env = env; w.conv = conv; return rankOf(w, "okoro"); }
  function column(x, y, head, R, disp, op, snap){
    if (op <= 0) return "";
    var rh = 24, bw = 56, o = '<g opacity="' + f1(op) + '">' + T(x, y, head, "efc-hhd");
    R.on.forEach(function(r, k){
      var ty = y + 12 + k * rh; if (disp[r.o.id] == null || snap) disp[r.o.id] = ty; else disp[r.o.id] += (ty - disp[r.o.id]) * 0.22;
      var yy = disp[r.o.id], top = k === 0;
      o += '<rect class="efc-hrow' + (top ? " top" : "") + '" x="' + x + '" y="' + f1(yy) + '" width="' + (bw + 82) + '" height="' + (rh - 4) + '" rx="4"/>';
      o += T(x + 6, yy + 14, HERO_NAMES[r.o.id], "efc-hs" + (top ? " efc-hb" : ""));
      o += '<rect class="efc-hbar" x="' + (x + 64) + '" y="' + f1(yy + 6) + '" width="' + f1(bw * r.s / 25) + '" height="8" rx="2"/>';
      o += T(x + bw + 78, yy + 14, String(Math.round(r.s)), "efc-hs", "end");
    });
    return o + "</g>";
  }
  function draw(snap){
    var nw = (host.getBoundingClientRect().width || 700) < 560;
    var W = nw ? 360 : 770, H = nw ? 410 : 290, cx = nw ? 180 : 322, cy = nw ? 160 : 150, R = nw ? 62 : 82;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    var o = "";
    // basket
    if (st.basket > 0) {
      o += '<g opacity="' + f1(st.basket) + '">';
      if (nw) {
        OPTS().forEach(function(op, i){ var x = 8 + i * 69; o += '<rect class="efc-hchip" x="' + x + '" y="8" width="64" height="24" rx="12"/>' + T(x + 32, 24, HERO_NAMES[op.id], "efc-hs", "middle"); });
      } else {
        o += '<path class="efc-hbk" d="M14 92 L146 92 L134 262 L26 262 Z"/><path class="efc-hbkh" d="M40 92 C40 46 120 46 120 92"/>';
        OPTS().forEach(function(op, i){ var y = 104 + i * 30; o += '<rect class="efc-hchip" x="30" y="' + y + '" width="100" height="24" rx="12"/>' + T(80, y + 16, HERO_NAMES[op.id], "efc-hs", "middle"); });
      }
      o += "</g>";
    }
    // compass: eight labelled spokes; Environment and Convenience lengthen in --pen
    if (st.compass > 0) {
      o += '<g opacity="' + f1(st.compass) + '"><circle class="efc-hring" cx="' + cx + '" cy="' + cy + '" r="' + R + '"/>';
      SPOKES.forEach(function(lab, i){
        var a = -Math.PI / 2 + i * Math.PI / 4, ca = Math.cos(a), sa = Math.sin(a), x2 = cx + R * ca, y2 = cy + R * sa;
        o += '<line class="efc-hax" x1="' + cx + '" y1="' + cy + '" x2="' + f1(x2) + '" y2="' + f1(y2) + '"/>';
        var w = i === 0 ? st.env : i === 6 ? st.conv : 0;
        if (w > 0.01) o += '<line class="efc-hsp" x1="' + cx + '" y1="' + cy + '" x2="' + f1(cx + R * w * ca) + '" y2="' + f1(cy + R * w * sa) + '"/><circle class="efc-htip" cx="' + f1(cx + R * w * ca) + '" cy="' + f1(cy + R * w * sa) + '" r="4"/>';
        var lx = cx + (R + 10) * ca, ly = cy + (R + 10) * sa + 4, anc = Math.abs(ca) < 0.2 ? "middle" : ca > 0 ? "start" : "end";
        if (Math.abs(ca) < 0.2) ly += sa < 0 ? -2 - (lab.length - 1) * 12 : 8;
        lab.forEach(function(line, k){ o += T(lx, ly + k * 12, line, "efc-hlab" + (w > 0.01 ? " on" : ""), anc); });
      });
      o += '<circle class="efc-hhub" cx="' + cx + '" cy="' + cy + '" r="4"/></g>';
    }
    // rankings: column A (Environment) builds first; column B starts as a copy and re-sorts as Convenience grows
    var ax = nw ? 18 : 470, bx = nw ? 196 : 625, ry = nw ? 290 : 46;
    if (st.colA > 0) o += column(ax, ry, "Environment 5 only", frozenA || scores(5 * st.env, 0), dispA, st.colA, snap);
    if (st.colB > 0) o += column(bx, ry, "Convenience 5 only", scores(5 * (1 - st.conv), 5 * st.conv), dispB, st.colB, snap);
    svg.innerHTML = o;
  }
  window.addEventListener("resize", function(){ draw(true); });
  function cap(){ if (f.cap) f.cap.textContent = Hc.caption; }
  if (MV.reduceMotion) { st = { basket:1, compass:1, env:1, conv:1, colA:1, colB:1 }; frozenA = scores(5, 0); draw(true); cap(); return; }
  draw(true);
  function tw(dur, step, next){ MV.tween({ dur:dur, step:function(t){ step(t); draw(false); }, done:next }); }
  MV.wait(300, function(){
    tw(600, function(t){ st.basket = t; }, function(){
      tw(600, function(t){ st.compass = t; }, function(){
        tw(1400, function(t){ st.env = t; st.colA = Math.min(1, t * 3); }, function(){
          frozenA = scores(5, 0); dispB = {}; for (var k in dispA) dispB[k] = dispA[k];
          MV.wait(500, function(){
            tw(1600, function(t){ st.conv = t; st.colB = Math.min(1, t * 3); }, function(){ draw(true); cap(); });
          });
        });
      });
    });
  });
}

// ---------- Explore: Values compass (@component F12 valuesCompass — seven weight sliders, persona filter, household and
// institution modes, compass spokes, live ranking with ties and filtered rows, readout, ratings panel, P1 evidence card) ----------
var ROWH = 46, CLAB = ["Environment", "Welfare", "Labour", "Local", "Cost", "Health", "Convenience"];
function explore(host, api){
  var D = api.content, S = api.S, V = D.values, RW = D.rows;
  S.mode = S.mode === "inst" ? "inst" : "house";
  S.persona = byId(D.personas, S.persona) ? S.persona : "okoro";
  S.w = S.w ? normW(S.w) : normW({ env:3, cost:2, hlth:1 });   // the plan's readout example
  S.wi = normW(S.wi || {});
  var anim = null, pend = null, timers = [], lit = {}, lastTop = null, evT = S.ev ? 1 : 0;
  function weights(){ if (S.mode === "house") return S.w; var w = normW(S.wi); for (var k in D.board) w[k] = D.board[k]; return w; }
  function locked(k){ return S.mode === "inst" && D.board[k] != null; }
  function pid(){ return S.mode === "inst" ? "okoro" : S.persona; }
  function cur(){ return rankOf(weights(), pid()); }
  function setW(k, v){ v = clamp(Math.round(v), 0, 5); if (S.mode === "house") S.w[k] = v; else if (!locked(k)) S.wi[k] = v; }

  function ratingsHTML(){
    var head = ["Option"].concat(V.map(function(v){ return v.t; }));
    var tab = MV.tableHTML({ caption:"Ratings (1 weak to 5 strong), teaching summary", head:head, rows:OPTS().map(function(o){ return ["<strong>" + o.t + "</strong>"].concat(o.r.map(String)); }) });
    var lists = OPTS().map(function(o){ return '<div class="efc-rsn"><h5 class="efc-h5">' + o.t + "</h5><ul>" + V.map(function(v, i){ return "<li><strong>" + v.t + " " + o.r[i] + ":</strong> " + D.reasons[o.id][i] + "</li>"; }).join("") + "</ul></div>"; }).join("");
    return '<div class="efc-aboutw"><p><span class="hfa-model">' + D.modelTag + "</span> " + D.ratingsNote + "</p>" + tab + '<div class="efc-rsns">' + lists + "</div>" +
      '<p class="efc-abt"><strong>Sources</strong></p><ul class="hfa-refs">' + (D.refs || []).map(function(r){ return "<li>" + MV.nutri.apaRef(r) + "</li>"; }).join("") + "</ul></div>";
  }
  host.innerHTML = '<div class="efc-top"><div id="efc-mode"></div><span class="hfa-model">' + D.modelTag + '</span></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="efc-mini" id="efc-mini" aria-hidden="true"></div>' +
    '<div class="efc-lab" id="efc-lab" data-mv="graph">' +
      '<div class="efc-who"><div id="efc-pers"></div><div class="efc-board" id="efc-board" hidden><p>' + D.boardTitle + '</p><p class="efc-bline"><strong>' + D.boardLine + '</strong></p></div><p class="tiny efc-fnote" id="efc-fnote">' + D.filterNote + "</p></div>" +
      '<div class="efc-rk"><div class="efc-rkw"><svg class="efc-cmp" id="efc-cmp" viewBox="0 0 300 250" role="img" aria-label="Compass of weights"></svg>' +
        '<div class="efc-rlw"><h4 class="efc-h4">Ranking</h4><ol class="efc-rank" id="efc-rank" aria-hidden="true"></ol></div></div><p class="tiny muted efc-rule">' + D.scoreRule + "</p></div>" +
      '<div class="efc-ctl"><h4 class="efc-h4">How much each value matters (0 to 5)</h4><div class="efc-sls" id="efc-sls"></div>' +
        '<div class="efc-envw" id="efc-envw" hidden><label for="efc-envbox">Environment weight: type a whole number from 0 to 5</label><input type="text" inputmode="numeric" class="numin efc-envbox" id="efc-envbox" autocomplete="off"></div>' +
        '<div class="q-actions"><button type="button" class="btn ghost sm" id="efc-reset" data-k="efcreset">Reset weights</button></div></div>' +
      '<div class="efc-side"><h4 class="efc-h4">Readout</h4><dl class="read efc-read" id="efc-read"></dl></div>' +
    "</div>" +
    '<div class="efc-ev" id="efc-ev" hidden></div>' +
    '<details class="alg efc-about"><summary>See the ratings</summary>' + ratingsHTML() + "</details>" +
    '<p class="vh" id="efc-say" aria-live="polite"></p>';

  // ===== controls =====
  var modeRG = radios($("#efc-mode"), { label:"Mode", options:D.modes, value:S.mode, onChange:function(v){ cancelAnim(); S.mode = v; lit = {}; MV.banner("", ""); api.save(); paintAll(); MV.changed(); } });
  var persRG = radios($("#efc-pers"), { label:"Family", cls:"chips", options:D.personas, value:S.persona, onChange:function(v){ cancelAnim(); S.persona = v; lit = {}; api.save(); paintAll(); MV.changed(); } });
  $("#efc-sls").innerHTML = V.map(function(v){
    return '<div class="efc-sl" data-sl="' + v.id + '"><label for="efc-s-' + v.id + '">' + v.t + '</label><input type="range" min="0" max="5" step="1" id="efc-s-' + v.id + '" data-w="' + v.id + '"><output class="efc-out" for="efc-s-' + v.id + '"></output><span class="tiny muted efc-lock"></span></div>';
  }).join("");
  $("#efc-sls").addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.w; if (!k) return; cancelAnim(); lit = {}; setW(k, +e.target.value); api.save(); paintAll(); MV.changed(); });
  $("#efc-envbox").addEventListener("input", function(e){
    var s = String(e.target.value).trim(); if (!/^\d+$/.test(s)) return;
    cancelAnim(); lit = {}; S.wi.env = clamp(+s, 0, 5); api.save(); paintAll(); MV.changed();
  });
  $("#efc-reset").addEventListener("click", function(){ cancelAnim(); lit = {}; if (S.mode === "house") S.w = zeroW(); else S.wi = zeroW(); api.save(); paintAll(); MV.changed(); });
  $("#efc-rank").innerHTML = OPTS().map(function(o){
    return '<li class="efc-row" data-o="' + o.id + '"><span class="efc-pl"></span><span class="efc-nm"><b>' + o.short + '</b><small></small></span><span class="efc-bar"><i></i></span><span class="efc-sc"></span></li>';
  }).join("");
  $("#efc-rank").style.height = (OPTS().length * ROWH) + "px";

  // ===== painting =====
  function paintSliders(){
    var w = weights();
    V.forEach(function(v){
      var box = $('[data-sl="' + v.id + '"]', host), inp = $("input", box), lk = locked(v.id);
      if (String(inp.value) !== String(w[v.id])) inp.value = w[v.id];
      inp.disabled = lk; box.classList.toggle("on", w[v.id] > 0); box.classList.toggle("locked", lk);
      $(".efc-out", box).textContent = w[v.id];
      $(".efc-lock", box).textContent = lk ? D.boardLock : "";
    });
    var eb = $("#efc-envbox"); $("#efc-envw").hidden = S.mode !== "inst";
    if (document.activeElement !== eb) eb.value = String(S.wi.env);
    $("#efc-pers").hidden = S.mode !== "house"; $("#efc-board").hidden = S.mode !== "inst"; $("#efc-fnote").hidden = S.mode !== "house";
  }
  function paintCompass(w){
    var svg = $("#efc-cmp"), cx = 150, cy = 122, R = 76, o = '<circle class="efc-ring" cx="' + cx + '" cy="' + cy + '" r="' + R + '"/>';
    VK.forEach(function(k, i){
      var a = -Math.PI / 2 + i * 2 * Math.PI / VK.length, ca = Math.cos(a), sa = Math.sin(a), on = w[k] > 0, L = R * w[k] / 5;
      o += '<line class="efc-ax" x1="' + cx + '" y1="' + cy + '" x2="' + f1(cx + R * ca) + '" y2="' + f1(cy + R * sa) + '"/>';
      if (on) o += '<line class="efc-sp" x1="' + cx + '" y1="' + cy + '" x2="' + f1(cx + L * ca) + '" y2="' + f1(cy + L * sa) + '"/><circle class="efc-tip" cx="' + f1(cx + L * ca) + '" cy="' + f1(cy + L * sa) + '" r="4"/>';
      var lx = cx + (R + 9) * ca, ly = cy + (R + 9) * sa + 4, anc = Math.abs(ca) < 0.25 ? "middle" : ca > 0 ? "start" : "end";
      if (Math.abs(ca) < 0.25 && sa < 0) ly -= 4;
      o += '<text class="efc-clab' + (on ? " on" : "") + '" x="' + f1(lx) + '" y="' + f1(ly) + '" text-anchor="' + anc + '">' + CLAB[i] + " " + w[k] + "</text>";
    });
    svg.innerHTML = o + '<circle class="efc-hub" cx="' + cx + '" cy="' + cy + '" r="4"/>';
    svg.setAttribute("aria-label", "Compass of weights: " + V.map(function(v){ return v.t + " " + w[v.id]; }).join(", ") + ".");
  }
  function paintRank(R){
    var max = Math.max(1, R.on.length ? R.on[0].s : 1), had = S.mode === "house" && S.persona === "haddad", topIds = R.top.map(function(x){ return x.o.id; }), zero = !anyW(weights());
    R.order.forEach(function(x, k){
      var li = $('[data-o="' + x.o.id + '"]', host);
      li.style.top = (k * ROWH) + "px";
      li.classList.toggle("out", !!x.out); li.classList.toggle("tie", !x.out && !!x.tie && !zero);
      li.classList.toggle("top", !x.out && !zero && topIds.indexOf(x.o.id) >= 0);
      li.classList.toggle("efc-lit", !!((lit.top && !x.out && topIds.indexOf(x.o.id) >= 0) || (lit.out && x.out)));
      $(".efc-pl", li).textContent = x.out ? "—" : (x.tie ? "=" : "") + x.place;
      $(".efc-nm small", li).textContent = x.out ? D.outLabel : had && x.o.id === "O1" ? "halal-certified" : "";
      $(".efc-bar i", li).style.width = x.out ? "0" : f1(x.s / max * 100) + "%";
      $(".efc-sc", li).innerHTML = x.out ? "" : x.s + (x.tie && !zero ? ' <span class="efc-tie">tie</span>' : "");
    });
    $("#efc-mini").innerHTML = R.on.map(function(x){ return "<span><b>" + (x.tie ? "=" : "") + x.place + "</b> " + x.o.short + " " + x.s + "</span>"; }).join(" · ") + (R.off.length ? ' <span class="muted">(' + R.off.length + " filtered)</span>" : "");
  }
  function whyWins(x, w){ var a = []; VK.forEach(function(k, i){ if (w[k] > 0 && x.o.r[i] >= 4) a.push(V[i].s); }); return a.length ? cap1(a.join(", ")) : "none of the weighted values rate 4 or more"; }
  function tradeOff(x){ var lo = Math.min.apply(null, x.o.r), a = []; VK.forEach(function(k, i){ if (x.o.r[i] === lo) a.push(V[i].s); }); return cap1(a.join(", ")) + " (" + lo + ")"; }
  function row(k, dt, dd){ return '<div class="' + (lit[k] ? "efc-lit" : "") + '"><dt>' + dt + "</dt><dd>" + dd + "</dd></div>"; }
  function paintRead(R){
    var w = weights(), z = !anyW(w), T = R.top, many = T.length > 1;
    function each(fn){ return many ? T.map(function(x){ return x.o.short + ": " + fn(x); }).join("; ") : fn(T[0]); }
    var topTxt = z ? "No weights set yet: every option scores 0." : many ? "Tie: " + listAnd(T.map(function(x){ return x.o.short; })) + " (" + T[0].s + ")" : "<strong>" + T[0].o.short + "</strong> (" + T[0].s + ")";
    $("#efc-read").innerHTML = row("ranking", RW.ranking, rankText(R)) + row("top", RW.top, topTxt) +
      row("why", RW.why, z ? "—" : each(function(x){ return whyWins(x, w); })) + row("trade", RW.trade, z ? "—" : each(tradeOff)) +
      row("removed", RW.removed, R.off.length ? listAnd(R.off.map(function(x){ return x.o.short; })) + " (" + D.outLabel + ")" : "none") +
      row("cost", RW.cost, z ? "—" : T.map(function(x){ return x.o.short + ": " + x.o.cost; }).join("; "));
  }
  function announce(R){
    var z = !anyW(weights()), key = z ? "zero" : R.top.map(function(x){ return x.o.id; }).join(",") + ":" + R.top[0].s;
    if (key === lastTop) return; var first = lastTop === null; lastTop = key; if (first || z) return;
    $("#efc-say").textContent = R.top.length > 1 ? listAnd(R.top.map(function(x){ return x.o.short; })) + " now tie for first, " + R.top[0].s : R.top[0].o.short + " now first, " + R.top[0].s;
  }
  function paintEv(t){
    var E = D.evidence, el = $("#efc-ev"); el.hidden = !S.ev;
    if (!S.ev) return;
    el.innerHTML = '<h4 class="efc-h4">' + E.title + '</h4><p class="tiny"><span class="hfa-model">' + E.tag + '</span></p><div class="efc-evbar" role="img" aria-label="' + esc(E.bars.map(function(b){ return b.t + " about " + b.v + "%"; }).join(", ")) + '">' +
      E.bars.map(function(b){ return '<span class="efc-evs ' + b.id + '" style="width:' + f1(b.v * t) + '%"><b>' + (t > 0.9 && b.v >= 6 ? b.v + "%" : "") + "</b></span>"; }).join("") + "</div>" +
      '<ul class="efc-evk">' + E.bars.map(function(b){ return '<li><span class="efc-evk-sw ' + b.id + '"></span>' + b.t + (t >= 1 ? ": about " + b.v + "%" : "") + "</li>"; }).join("") + "</ul>" +
      (t >= 1 ? '<p class="tiny">' + E.note + "</p>" : "");
  }
  function paintAll(){
    modeRG.set(S.mode); persRG.set(S.persona);
    var R = cur(), w = weights();
    $("#efc-lab").classList.toggle("inst", S.mode === "inst");
    paintSliders(); paintCompass(w); paintRank(R); paintRead(R); announce(R); paintEv(evT);
  }
  paintAll();

  // ===== predictions =====
  function finish(){ anim = null; timers = []; api.save(); paintAll(); MV.changed(); var d = pend; pend = null; if (d) d(); }
  function cancelAnim(){ if (anim) { anim(); anim = null; } timers.forEach(clearTimeout); timers = []; if (pend) { var d = pend; pend = null; evT = S.ev ? 1 : 0; d(); } }
  function later(ms, fn){ timers.push(MV.wait(ms, fn)); }

  // ===== challenges (plan's exact tests and named wrong states) =====
  var CH = {}; D.challenges.forEach(function(c){ CH[c.id] = c; });
  function challenge(id){
    var M = CH[id].msgs, R, w;
    if (id === "tc1") {
      if (S.mode !== "house" || S.persona !== "okoro") return { ok:false, msg:M.view };
      R = cur(); var ids = R.top.map(function(x){ return x.o.id; });
      if (ids.length === 1 && ids[0] === "O5") return { ok:true };
      if (ids.indexOf("O5") >= 0) return { ok:false, msg:M.tie };
      if (ids.indexOf("O2") >= 0) return { ok:false, msg:M.lentils };
      return { ok:false, msg:(ids.length > 1 ? listAnd(R.top.map(function(x){ return x.o.short; })) + " tie for first with " : R.top[0].o.short + " leads with ") + R.top[0].s + ". " + M.other };
    }
    if (id === "tc2") {
      if (S.mode !== "house" || S.persona !== "patel") return { ok:false, msg:M.view };
      w = S.w; var o = OPTS(), sT = score(byId(o, "O4"), w), sL = score(byId(o, "O2"), w);
      if (sT > sL) return { ok:true };
      if (w.env || w.lab || w.loc || w.cost || w.hlth) return { ok:false, msg:M.lentilsWin };
      if (w.welf) return { ok:false, msg:M.welfare };
      return { ok:false, msg:M.zero };
    }
    if (id === "tc3") {
      if (S.mode !== "inst") return { ok:false, msg:M.view };
      R = cur(); var e = S.wi.env;
      if (e === 2 && R.top.length === 1 && R.top[0].o.id === "O2") return { ok:true };
      if (S.wi.welf || S.wi.lab || S.wi.loc) return { ok:false, msg:M.others };
      return { ok:false, msg:e === 0 ? M.w0 : e === 1 ? M.w1 : M.big };
    }
    return { ok:false };
  }

  return {
    predict:{
      start:function(p){
        cancelAnim(); lit = {};
        S.mode = "house"; S.persona = "okoro";
        if (p.id === "p2" || p.id === "p3") S.w = zeroW();
        if (p.id === "p1") { S.ev = true; evT = 0; }
        api.save(); paintAll(); MV.changed();
      },
      run:function(p, done){
        pend = done;
        if (p.id === "p1") {
          S.ev = true;
          anim = MV.tween({ dur:1600, step:function(t){ evT = t; paintEv(t); }, done:function(){ evT = 1; finish(); } });
        } else if (p.id === "p2" || p.id === "p3") {
          var k = p.id === "p2" ? "cost" : "loc", last = S.w[k];
          later(300, function(){
            anim = MV.tween({ dur:1500, ease:lin, step:function(t){ var v = Math.round(t * 5); if (v !== last) { last = v; S.w[k] = v; paintAll(); } },
              done:function(){ S.w[k] = 5; lit = { top:true }; finish(); } });
          });
        } else {
          later(500, function(){ S.persona = "patel"; lit = { out:true, removed:true }; api.save(); paintAll(); later(900, finish); });
        }
      }
    },
    challenge:challenge
  };
}

// ---------- Part 3: Make your case (@component F12 argumentBuilder — question chips, claim, evidence cards as toggle buttons,
// value links, counterargument chips, response with a word count, live structure checks; @component F13 evidenceCheck —
// each card's type, quality tag and bias note) ----------
function part3(host, api){
  var D = api.content, S = api.S;
  S.st = byId(D.stations, S.st) ? S.st : "q";
  S.qid = byId(D.questions, S.qid) ? S.qid : "a";
  S.arg = S.arg && typeof S.arg === "object" ? S.arg : {};
  function Q(){ return byId(D.questions, S.qid); }
  function A(){ var a = S.arg[S.qid] || (S.arg[S.qid] = {}); a.ev = Array.isArray(a.ev) ? a.ev.filter(function(id){ return byId(Q().cards, id); }) : []; a.link = a.link || {}; return a; }
  function card(id){ return byId(Q().cards, id); }
  function counters(a){ return a.claim ? Q().counters[a.claim === "no" ? "for" : "against"] : []; }
  function claimT(a){ var c = byId(D.claims, a.claim); return c ? "“" + c.t + "”" : ""; }
  function checks(){
    var a = A();
    return [!!a.claim, a.ev.length >= 2 && a.ev.some(function(id){ return card(id).q === "strong"; }), a.ev.length > 0 && a.ev.every(function(id){ return !!a.link[id]; }),
      !!a.counter && counters(a).indexOf(a.counter) >= 0, words(a.resp) >= 20];
  }
  function qTag(q){ return '<span class="efc-q ' + q + '">' + D.quality[q] + "</span>"; }
  host.innerHTML = '<div id="efc-stn"></div>' +
    '<div class="efc-station" id="efc-st-q"></div><div class="efc-station" id="efc-st-build" hidden></div><div class="efc-station" id="efc-st-data" hidden></div>' +
    '<div class="efc-checks"><h4 class="efc-h4">Structure checks</h4><ul class="efc-chk" id="efc-chk" aria-live="polite"></ul><div id="efc-chkfb"></div></div>';
  var stRG = radios($("#efc-stn", host), { label:"Station", cls:"chips", options:D.stations, value:S.st, onChange:function(v){ S.st = v; api.save(); paintStations(); } });

  // Station 1: choose a question
  var s1 = $("#efc-st-q", host);
  s1.innerHTML = '<h4 class="efc-h4">Choose a question</h4><p>Pick one question to argue. Each question keeps its own argument.</p><div id="efc-qrg"></div>';
  radios($("#efc-qrg", s1), { aria:"Question", cls:"chips", options:D.questions.map(function(q){ return { id:q.id, t:"(" + q.id + ") " + q.t }; }), value:S.qid,
    onChange:function(v){ S.qid = v; api.save(); buildArg(); paintData(); paintChecks(); } });

  // Station 2: build the argument
  var s2 = $("#efc-st-build", host);
  function buildArg(){
    var a = A(), q = Q();
    s2.innerHTML = '<p class="efc-qhead"><strong>Question (' + q.id + "):</strong> " + q.t + '</p><div id="efc-claim"></div>' +
      '<h5 class="efc-h5">Evidence: choose 2 or 3 cards</h5><div class="efc-cards" id="efc-cards" role="group" aria-label="Evidence cards, choose 2 or 3">' +
      q.cards.map(function(c){ return '<button type="button" class="efc-card" aria-pressed="false" data-card="' + c.id + '" data-k="efc' + c.id + '"></button>'; }).join("") + '</div><p class="tiny muted" id="efc-evn" aria-live="polite"></p>' +
      '<h5 class="efc-h5">Reasoning: link each card to a value</h5><div id="efc-links"></div>' +
      '<h5 class="efc-h5">Counterargument: the strongest opposing point</h5><div id="efc-counter"></div>' +
      '<div class="jq efc-jq"><label for="efc-resp">Your response to the counterargument (at least 20 words)</label><textarea id="efc-resp" class="efc-ta" rows="4"></textarea><p class="tiny muted" id="efc-rwc" aria-live="polite"></p></div>';
    radios($("#efc-claim", s2), { label:"Claim", cls:"chips", options:D.claims, value:a.claim || "", onChange:function(v){ a.claim = v; if (counters(a).indexOf(a.counter) < 0) a.counter = ""; api.save(); paintCounter(); paintLinks(); paintData(); paintChecks(); } });
    $("#efc-cards", s2).addEventListener("click", function(e){
      var b = e.target.closest("[data-card]"); if (!b || b.getAttribute("aria-disabled") === "true") return;
      var id = b.dataset.card, k = a.ev.indexOf(id);
      if (k >= 0) { a.ev.splice(k, 1); delete a.link[id]; } else if (a.ev.length < 3) a.ev.push(id); else return;
      api.save(); paintCards(); paintLinks(); paintData(); paintChecks();
    });
    var ta = $("#efc-resp", s2); ta.value = a.resp || "";
    ta.addEventListener("input", function(){ a.resp = ta.value; api.save(); paintWc(); paintData(); paintChecks(); });
    paintCards(); paintLinks(); paintCounter(); paintWc();
  }
  function paintCards(){
    var a = A(), n = a.ev.length;
    $$("[data-card]", s2).forEach(function(b){
      var c = card(b.dataset.card), on = a.ev.indexOf(c.id) >= 0, dis = !on && n >= 3;
      b.setAttribute("aria-pressed", on); b.setAttribute("aria-disabled", dis); b.classList.toggle("dim", dis);
      b.innerHTML = '<span class="efc-cmk" aria-hidden="true">' + (on ? "✓" : "+") + '</span><span class="efc-ct">' + c.t + '</span><span class="efc-cmeta"><span class="efc-type">' + c.type + "</span> " + qTag(c.q) + "</span>";
    });
    $("#efc-evn", s2).textContent = n >= 3 ? "Three chosen: tap one to remove it before adding another." : n + " chosen.";
  }
  function paintLinks(){
    var a = A(), box = $("#efc-links", s2);
    if (!a.ev.length) { box.innerHTML = '<p class="tiny muted">Choose evidence cards first.</p>'; return; }
    box.innerHTML = a.ev.map(function(id, i){ return '<div class="efc-link"><p class="tiny"><strong>Card ' + (i + 1) + ":</strong> " + card(id).t + '</p><div data-lh="' + id + '"></div><p class="efc-because" data-lb="' + id + '"></p></div>'; }).join("");
    a.ev.forEach(function(id){
      var opts = D.linkValues.map(function(v){ return { id:v, t:v }; });
      radios($('[data-lh="' + id + '"]', box), { label:"Because we value", cls:"chips", options:opts, value:a.link[id] || "", onChange:function(v){ a.link[id] = v; api.save(); because(id); paintData(); paintChecks(); } });
      because(id);
    });
  }
  function because(id){
    var a = A(), el = $('[data-lb="' + id + '"]', s2); if (!el) return;
    el.innerHTML = "Because we value <strong>" + (a.link[id] || "___") + "</strong>, this evidence supports our claim" + (a.claim ? " (" + claimT(a) + ")" : "") + ".";
  }
  function paintCounter(){
    var a = A(), box = $("#efc-counter", s2), list = counters(a);
    if (!list.length) { box.innerHTML = '<p class="tiny muted">Choose a claim first: the opposing points depend on your side.</p>'; return; }
    radios(fresh(box), { aria:"Counterargument", cls:"chips", options:list.map(function(t){ return { id:t, t:t }; }), value:a.counter || "", onChange:function(v){ a.counter = v; api.save(); paintData(); paintChecks(); } });
  }
  function paintWc(){ $("#efc-rwc", s2).textContent = words(A().resp) + " words (at least 20)"; }

  // Station 3: check it with data
  var s3 = $("#efc-st-data", host);
  function paintData(){
    var a = A(), q = Q();
    s3.innerHTML = '<h4 class="efc-h4">Check it with data</h4><p>' + D.msgs.dataAsk + '</p><div class="efc-dcards">' + q.cards.map(function(c){
      var on = a.ev.indexOf(c.id) >= 0;
      return '<article class="efc-dcard' + (on ? " on" : "") + '"><p class="efc-dmeta"><span class="efc-type">' + c.type + "</span> " + qTag(c.q) + (on ? ' <span class="efc-mine">✓ in your argument</span>' : "") + '</p><p class="efc-dt">' + c.t + '</p><p class="tiny efc-dnote"><strong>Check:</strong> ' + c.note + "</p></article>";
    }).join("") + "</div>" +
      '<h5 class="efc-h5">Your argument so far</h5><dl class="read efc-prev">' +
      "<div><dt>Claim</dt><dd>" + (a.claim ? claimT(a) : '<span class="muted">not chosen</span>') + "</dd></div>" +
      "<div><dt>Evidence</dt><dd>" + (a.ev.length ? a.ev.map(function(id){ var c = card(id); return c.t + " " + qTag(c.q); }).join("<br>") : '<span class="muted">none yet</span>') + "</dd></div>" +
      "<div><dt>Reasoning</dt><dd>" + (a.ev.length ? a.ev.map(function(id){ return "Because we value " + (a.link[id] || "___") + ", card " + (a.ev.indexOf(id) + 1) + " supports our claim."; }).join("<br>") : "—") + "</dd></div>" +
      "<div><dt>Counterargument</dt><dd>" + (a.counter || '<span class="muted">not chosen</span>') + "</dd></div>" +
      "<div><dt>Response</dt><dd>" + (a.resp && a.resp.trim() ? esc(a.resp.trim()) : '<span class="muted">not written</span>') + "</dd></div></dl>";
  }
  function paintChecks(){
    var r = checks(), all = r.every(Boolean);
    $("#efc-chk", host).innerHTML = D.checks.map(function(t, i){ return '<li class="' + (r[i] ? "ok" : "") + '"><span class="efc-chm" aria-hidden="true">' + (r[i] ? "✓" : "○") + "</span>" + t + '<span class="vh">' + (r[i] ? ": done" : ": not yet") + "</span></li>"; }).join("");
    $("#efc-chkfb", host).innerHTML = all ? MV.fbHTML("good", "<strong>✓ " + D.msgs.allOk + "</strong>") : "";
  }
  function paintStations(){
    stRG.set(S.st);
    D.stations.forEach(function(s){ $("#efc-st-" + s.id, host).hidden = s.id !== S.st; });
  }
  buildArg(); paintData(); paintChecks(); paintStations();
}

// ---------- Practice 2: Hidden trade-offs (custom ★ set: tap answers with the toolkit's practice look and N4 number entry,
// H4 adds a "ranks first" chip; retry mode and three levels of help; first try = right on the first check, no worked solution) ----------
function tradeSet(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { tries:0, hint:0, solved:false, first:null, val:"", pick:"" }); }
  function star(it){ return ' <span class="tag">★' + (it.inquiry ? " Inquiry" : "") + "</span>"; }
  function q(it){ var c = {}; for (var k in it) c[k] = it[k]; c.prompt = it.prompt + star(it); return c; }
  function numHTML(it, i, x){
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">H' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + star(it) + "</div></div>";
    if (it.pick) h += '<div class="efc-rgw"><span class="efc-rgl">' + it.pick.label + '</span><span class="efc-chipset" role="radiogroup" aria-label="' + esc(MV.plain(it.pick.label)) + '">' +
      it.pick.options.map(function(t){ var on = x.pick === t; return '<button type="button" role="radio" aria-checked="' + on + '" data-pick="' + esc(t) + '" data-k="' + it.id + "p" + t + '"' + (x.solved ? " disabled" : "") + ">" + t + "</button>"; }).join("") + "</span></div>";
    h += '<div class="numrow"><label for="efc-n-' + it.id + '">' + it.label + '</label><input class="numin" id="efc-n-' + it.id + '" data-nin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + esc(x.val || "") + '"' + (x.solved ? " disabled" : "") + "></div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + it.why + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    return h;
  }
  function paintQ(it){
    var i = a.items.indexOf(it), box = host.querySelector('[data-tq="' + it.id + '"]'), x = ist(it.id);
    MV.keepFocus(box, function(){
      box.innerHTML = it.kind === "num" ? numHTML(it, i, x) : MV.mcHTML(q(it), x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:"H" + (i + 1), noConf:true });
    });
  }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it){ return '<div class="q" data-tq="' + it.id + '"></div>'; }).join("");
  a.items.forEach(paintQ);
  function judgeNum(it, x){
    var raw = String(x.val || "").replace(/\$/g, "").trim(), v = MV.parseNum(raw);
    if (it.pick && x.pick !== it.pick.answer) return { msg:"<strong>✗ Not quite.</strong> " + (x.pick ? it.pick.wrong : "Choose which option ranks first, too.") , count:!!x.pick };
    if (!v || v.length !== 1) return { msg:"Enter a number, such as 12 or 3.5.", count:false };
    if (Math.abs(v[0] - MV.ans(it)) < 1e-6) return { ok:true };
    var named = (it.wrong || []).filter(function(w){ return Math.abs(v[0] - w.match) < 1e-6; })[0];
    return { msg:"<strong>✗ Not quite.</strong> " + (named ? named.fb : "Check your work and try again."), count:true };
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.nin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.nin) { var b = host.querySelector('[data-k="' + e.target.dataset.nin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-tq]"); if (!box) return;
    var it = byId(a.items, box.dataset.tq), x = ist(it.id);
    if (b.dataset.pick != null) { x.pick = b.dataset.pick; msgs[it.id] = null; }
    else if (b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
    else if (b.dataset.act === "hint") x.hint = Math.min(3, (x.hint || 0) + 1);
    else if (b.dataset.act === "check") {
      if (it.kind === "num") {
        var r = judgeNum(it, x);
        if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
        else { if (r.count) x.tries++; msgs[it.id] = r.msg; }
      } else {
        x.checked = true;
        if (MV.ok(it.options[x.choice])) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
      }
    }
    api.save(); paintQ(it); if (b.dataset.act === "check") MV.focusFb(box);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: My food philosophy (@component philosophyBuilder — value rank chips, a commitment chip row per
// ranked value, trade-off / constraint / counterargument chips, response and statement boxes with word counts, a live
// at-a-glance card, model philosophies once every line passes) ----------
function norm(s){ return String(s || "").replace(/[’‘`]/g, "'").replace(/[‐‑–]/g, "-").toLowerCase(); }
var task = (function(){
  var api = null;
  function T(){ return MV.C.task; }
  function val(id){ return byId(T().values, id); }
  function read(s){
    s = s || (api && api.S) || {};
    var rank = {}, commit = {};
    T().values.forEach(function(v){ var r = s.rank && s.rank[v.id]; rank[v.id] = r === "1" || r === "2" || r === "3" ? r : ""; var c = s.commit && s.commit[v.id]; commit[v.id] = v.commit.indexOf(c) >= 0 ? c : ""; });
    return { rank:rank, commit:commit, trade:T().tradeoffs.indexOf(s.trade) >= 0 ? s.trade : "", cons:(Array.isArray(s.cons) ? s.cons : []).filter(function(c){ return T().constraints.indexOf(c) >= 0; }),
      counter:T().counters.indexOf(s.counter) >= 0 ? s.counter : "", resp:String(s.resp || ""), text:String(s.text || "") };
  }
  function ranked(d){ return T().values.filter(function(v){ return d.rank[v.id]; }).sort(function(a, b){ return +d.rank[a.id] - +d.rank[b.id]; }); }
  function vocabCount(text){
    var t = norm(text);
    return T().vocabWords.filter(function(w){ return w === "trade-off" ? /trade[- ]?offs?/.test(t) : t.indexOf(w) >= 0; }).length;
  }
  function checks(d){
    var R = ranked(d), ranks = R.map(function(v){ return d.rank[v.id]; }).sort().join(","), wc = words(d.text), t = norm(d.text);
    return [
      R.length === 3 && ranks === "1,2,3",
      R.length > 0 && R.every(function(v){ return !!d.commit[v.id]; }),
      !!d.trade,
      d.cons.length >= 1,
      !!d.counter && words(d.resp) >= 25,
      wc >= 120 && wc <= 220,
      wc > 0 && !T().banned.some(function(b){ return t.indexOf(norm(b)) >= 0; }),
      vocabCount(d.text) >= 2
    ];
  }
  function keyOf(d){ return ranked(d).map(function(v){ return v.id; }).join(">"); }
  function text(k){ return String(k || "").split(">").map(function(id, i){ var v = val(id); return (i + 1) + " " + (v ? v.t : "?"); }).join(", "); }
  var hosts = {};
  function buildCommits(){
    var d = read(), s = api.S, box = $("#efc-tcom"); if (!box) return;
    var R = ranked(d);
    if (!R.length) { box.innerHTML = '<p class="tiny muted">Rank your values first; each one then gets a commitment.</p>'; return; }
    box.innerHTML = R.map(function(v){ return '<div class="efc-tcrow" data-tc="' + v.id + '"></div>'; }).join("");
    R.forEach(function(v){
      radios($('[data-tc="' + v.id + '"]', box), { label:d.rank[v.id] + " " + v.t, cls:"chips", options:v.commit.map(function(c){ return { id:c, t:c }; }), value:d.commit[v.id],
        onChange:function(c){ s.commit = s.commit || {}; s.commit[v.id] = c; upd(); } });
    });
  }
  function upd(){ api.save(); paint(); api.update(); }
  function paint(){
    var d = read(), el = $("#efc-tglance"); if (!el) return;
    var R = ranked(d), rw = words(d.resp), tw = words(d.text);
    el.innerHTML = '<div class="efc-tcard"><h4 class="efc-h4">My philosophy at a glance</h4><dl class="read">' +
      "<div><dt>Values</dt><dd>" + (R.length ? R.map(function(v){ return "<strong>" + d.rank[v.id] + "</strong> " + v.t + (d.commit[v.id] ? ": " + d.commit[v.id] : ' <span class="muted">(no commitment yet)</span>'); }).join("<br>") : '<span class="muted">none ranked yet</span>') + "</dd></div>" +
      "<div><dt>Trade-off I accept</dt><dd>" + (d.trade || '<span class="muted">not chosen</span>') + "</dd></div>" +
      "<div><dt>Constraints I respect</dt><dd>" + (d.cons.length ? d.cons.join("; ") : '<span class="muted">none chosen</span>') + "</dd></div>" +
      "<div><dt>Counterargument</dt><dd>" + (d.counter ? "“" + d.counter + "”" : '<span class="muted">not chosen</span>') + "</dd></div>" +
      "<div><dt>Length</dt><dd>Response " + rw + " words (at least 25) · statement " + tw + " words (120–220)</dd></div></dl></div>";
    $("#efc-trwc").textContent = rw + " words (at least 25)";
    $("#efc-ttwc").textContent = tw + " words (120–220)";
    $$("#efc-tcons [data-cons]").forEach(function(b){ var on = d.cons.indexOf(b.dataset.cons) >= 0; b.setAttribute("aria-pressed", on); b.innerHTML = (on ? "✓ " : "+ ") + b.dataset.cons; });
    var allOk = checks(d).every(Boolean), mh = $("#efc-tmodels");
    mh.innerHTML = allOk ? '<details class="alg efc-models"><summary>' + T().modelsTitle + "</summary>" + T().models.map(function(m){
      return '<h5 class="efc-h5">' + m.title + '</h5><dl class="read efc-mdl"><div><dt>Values</dt><dd>' + m.values + "</dd></div><div><dt>Commitments</dt><dd>" + m.commit + "</dd></div><div><dt>Trade-off</dt><dd>" + m.trade + "</dd></div><div><dt>Constraint</dt><dd>" + m.constraint + "</dd></div><div><dt>Counterargument</dt><dd>“" + m.counter + "”</dd></div></dl>" +
        '<p class="efc-mtext"><strong>Response:</strong> ' + m.response + '</p><p class="efc-mtext"><strong>Statement:</strong> ' + m.statement + "</p>";
    }).join("") + "</details>" : "";
  }
  return {
    render:function(inp, pv, a){
      api = a; var s = a.S, TK = T();
      s.rank = s.rank || {}; s.commit = s.commit || {}; s.cons = Array.isArray(s.cons) ? s.cons : [];
      inp.innerHTML = '<div class="efc-tin"><h4 class="efc-h4">Values: choose three and rank them 1–3</h4><div class="efc-tvals" id="efc-tvals">' +
          TK.values.map(function(v){ return '<div class="efc-tval" data-tv="' + v.id + '"></div>'; }).join("") + "</div>" +
        '<h4 class="efc-h4">A commitment for each value</h4><div id="efc-tcom"></div>' +
        '<div id="efc-ttrade"></div>' +
        '<div class="efc-rgw"><span class="efc-rgl">Constraints I respect</span><div class="efc-chipset multi" id="efc-tcons" role="group" aria-label="Constraints I respect, choose one or more">' +
          TK.constraints.map(function(c){ return '<button type="button" aria-pressed="false" data-cons="' + esc(c) + '" data-k="tcons' + TK.constraints.indexOf(c) + '"></button>'; }).join("") + "</div></div>" +
        '<div id="efc-tcounter"></div>' +
        '<div class="jq efc-jq"><label for="efc-tresp">' + TK.responseLabel + '</label><textarea id="efc-tresp" class="efc-ta" rows="4"></textarea><p class="tiny muted" id="efc-trwc" aria-live="polite"></p></div>' +
        '<div class="jq efc-jq"><label for="efc-ttext">' + TK.statementLabel + '</label><textarea id="efc-ttext" class="efc-ta tall" rows="9"></textarea><p class="tiny muted" id="efc-ttwc" aria-live="polite"></p></div></div>';
      pv.innerHTML = '<div class="efc-tpv"><div id="efc-tglance" aria-live="polite"></div><div id="efc-tmodels"></div></div>';
      var rankOpts = [{ id:"", t:"Not chosen" }, { id:"1", t:"1" }, { id:"2", t:"2" }, { id:"3", t:"3" }];
      TK.values.forEach(function(v){
        hosts[v.id] = radios($('[data-tv="' + v.id + '"]'), { label:v.t, aria:"Rank for " + v.t, options:rankOpts, value:s.rank[v.id] || "",
          onChange:function(r){ s.rank[v.id] = r; buildCommits(); upd(); } });
      });
      radios($("#efc-ttrade"), { label:"Trade-off I accept", cls:"chips", options:TK.tradeoffs.map(function(t){ return { id:t, t:t }; }), value:s.trade || "", onChange:function(v){ s.trade = v; upd(); } });
      radios($("#efc-tcounter"), { label:"Counterargument", cls:"chips", options:TK.counters.map(function(t){ return { id:t, t:"“" + t + "”" }; }), value:s.counter || "", onChange:function(v){ s.counter = v; upd(); } });
      $("#efc-tcons").addEventListener("click", function(e){
        var b = e.target.closest("[data-cons]"); if (!b) return;
        var c = b.dataset.cons, k = s.cons.indexOf(c); if (k >= 0) s.cons.splice(k, 1); else s.cons.push(c);
        upd(); b.focus({ preventScroll:true });
      });
      var tr = $("#efc-tresp"), tt = $("#efc-ttext"); tr.value = s.resp || ""; tt.value = s.text || "";
      tr.addEventListener("input", function(){ s.resp = tr.value; upd(); });
      tt.addEventListener("input", function(){ s.text = tt.value; upd(); });
      buildCommits(); paint();
    },
    read:function(){ return read(); },
    valid:function(d){ return ranked(d).length ? true : "Rank at least one value first."; },
    checks:checks,
    key:keyOf,
    label:function(k){ return esc(text(k)); },
    text:text,
    summary:function(ts){
      var f = ts.found || [], d = read(ts.app || {}), L = [T().summary + ": " + (f.length ? "complete (" + text(f[f.length - 1]) + ")" : "not complete yet")];
      if (d.text.trim()) { L.push("  Statement:"); d.text.trim().split(/\r?\n/).forEach(function(l){ if (l.trim()) L.push("    " + l.trim()); }); }
      if (d.resp.trim()) { L.push("  Response to “" + (d.counter || "a counterargument") + "”:"); d.resp.trim().split(/\r?\n/).forEach(function(l){ if (l.trim()) L.push("    " + l.trim()); }); }
      return L;
    }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ trade:tradeSet },
  task:task
});
})();
