// SBI4U 32 Gel Electrophoresis: hero (DNA dots stream through a horizontal gel and settle into bands), Virtual gel
// (S9 procedure lab: tray-to-lane loading, orientation, agarose, voltage, run time, Play/Pause, Reveal DNA, band ruler and
// gap readout, Compare mode), "Read the gel" (S7 standard curve + four stations), practice chip sets, "Plan the run" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small SVG helpers (from SBI4U 19 / 17) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "ge-t", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function seg(T, a, b){ return clamp((T - a) / (b - a), 0, 1); }
function lin(t){ return t; }
function mm(v){ return f1(v).toFixed(1); }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function clone(x){ return JSON.parse(JSON.stringify(x)); }
var EPS = 1e-9;

// ---------- gel model (plan §4, Explore): distance = (V ÷ 100) × (t ÷ 60) × m, m = a − b × log₁₀(size ÷ 100), m ≥ 1.0 ----------
var GP = null, LEN = 60, DYE = 50;
function gp(id){ if (!GP) { GP = {}; MV.C.explore.gels.forEach(function(g){ GP[g.id] = g; }); } return GP[id]; }
function rawD(gid, V, t, size){ var g = gp(gid), m = Math.max(1, g.a - g.b * Math.log10(size / 100)); return V / 100 * (t / 60) * m; }
function D(gid, V, t, size){ return f1(rawD(gid, V, t, size)); }                                   // displayed distance (0.1 mm)
function gapOf(gid, V, t, s1, s2){ return f1(Math.abs(rawD(gid, V, t, s1) - rawD(gid, V, t, s2))); } // displayed gap (0.1 mm)

// ---------- @component radioGroup (copied from SBI4U 19 / 17 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", key, onChange(id)}) -> {set(id), get(), setOptions(list), disable(b)}
function radios(host, o){
  var val = String(o.value), off = false;
  function firstFree(){ for (var i = 0; i < o.options.length; i++) if (!o.options[i].dis) return i; return 0; }
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, dis = x.dis || off, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (dis ? -1 : tab) + '" data-rg="' + x.id + '" data-k="rg' + (o.key || "") + x.id + '"' + (dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b || off) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var ids = o.options.filter(function(x){ return !x.dis; }).map(function(x){ return String(x.id); }); if (!ids.length) return;
    var i = ids.indexOf(String(b.dataset.rg)); choose(ids[(i + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; },
    setOptions:function(list){ o.options = list; paint(); }, disable:function(b){ if (b !== off) { off = b; paint(); } } };
}

// ---------- @component S9 procedureLab (gel electrophoresis) — gelSVG(o): a vertical agarose gel in a buffer tank ----------
// Wells at the top, electrodes top and bottom (ink, labelled; red is kept for "wrong"), a mm ruler at the left, 1 mm-thick bands
// (ladder --ink-2, sample --ink), the dye front dotted, the selected band ringed in --hi with a ruler from the wells, and a gap
// bracket between two selected bands. o = {lanes:[{code, name, bands:[{key, size, lad, unk}]}], gid, V, e, orient:"neg"|"pos",
// reveal, dye, tap (bands are buttons), sel:[keys], ruler:key, gap:true, focus:key}. Lanes are 46.7 units wide; 1 mm = 4.4 units.
var LW = 46.667, X0 = 30, Y0 = 60, K = 4.4, YE = Y0 + LEN * K;
function laneX(i){ return X0 + (i + 0.5) * LW; }
function gelBands(o){
  var out = [];
  o.lanes.forEach(function(L, i){
    L.bands.forEach(function(b){ var r = rawD(o.gid, o.V, o.e, b.size); out.push({ key:b.key, size:b.size, lad:b.lad, unk:b.unk, lane:i, raw:r, d:f1(r), on:f1(r) <= LEN + EPS }); });
  });
  return out.sort(function(p, q){ return p.lane - q.lane || p.d - q.d; });
}
function bandLabel(b, L){ return "Lane " + (b.lane + 1) + (L && L.name ? " (" + L.name + ")" : "") + ": " + (b.unk ? "unknown band" : b.size + " bp") + " at " + mm(b.d) + " mm"; }
function gelSVG(o){
  var n = o.lanes.length, R = X0 + n * LW, pos = o.orient === "pos", out = pos && o.e > 0, h = "";
  var bands = gelBands(o), sel = o.sel || [];
  h += sv("rect", { x:X0 - 6, y:22, width:n * LW + 12, height:310, rx:3, "class":"ge-buf" });
  h += sv("rect", { x:X0 - 6, y:2, width:n * LW + 12, height:20, rx:4, "class":"ge-elec" }) + txt(X0 + n * LW / 2, 16, pos ? "+ positive" : "− negative", "ge-et", "middle");
  h += sv("rect", { x:X0 - 6, y:332, width:n * LW + 12, height:20, rx:4, "class":"ge-elec" }) + txt(X0 + n * LW / 2, 346, pos ? "− negative" : "+ positive", "ge-et", "middle");
  h += sv("rect", { x:X0, y:44, width:n * LW, height:YE - 44, "class":"ge-slab" });
  h += sv("line", { x1:24, y1:Y0, x2:24, y2:YE, "class":"ge-ax" }) + txt(20, Y0 - 9, "mm", "ge-t", "end");
  for (var j = 0; j <= 6; j++) { var yt = Y0 + j * 10 * K; h += sv("line", { x1:19, y1:yt, x2:24, y2:yt, "class":"ge-ax" }) + txt(17, yt + 3.5, String(j * 10), "ge-t", "end"); }
  o.lanes.forEach(function(L, i){ var cx = laneX(i); h += sv("rect", { x:cx - 15, y:Y0 - 8, width:30, height:8, rx:1.5, "class":"ge-well" }) + txt(cx, 366, L.code, "ge-lc", "middle"); });
  if (o.dye && !out) { var dd = D(o.gid, o.V, o.e, DYE); if (dd <= LEN + EPS && o.e > 0) { var yd = Y0 + dd * K; h += sv("line", { x1:X0, y1:yd, x2:R, y2:yd, "class":"ge-dye" }) + txt(R - 3, yd - 3, "dye front", "ge-t", "end"); } }
  if (out) {
    // wrong orientation: the DNA streams out of the backs of the wells, away from the gel
    var p = clamp(o.e / 10, 0, 1), any = false;
    o.lanes.forEach(function(L, i){
      if (!L.bands.length) return; any = true;
      var cx = laneX(i), y2 = lerp(Y0 - 10, 26, p);
      h += sv("path", { d:"M" + f1(cx) + " " + (Y0 - 10) + " V" + f1(y2 + 4), "class":"ge-out" }) + sv("path", { d:"M" + f1(cx - 5) + " " + f1(y2 + 7) + " L" + f1(cx) + " " + f1(y2) + " L" + f1(cx + 5) + " " + f1(y2 + 7) + " Z", "class":"ge-outh" });
      for (var k = 0; k < 3; k++) { var yy = lerp(Y0 - 6, 28, clamp(p * 1.15 - k * 0.12, 0, 1)); h += sv("circle", { cx:cx - 9 + k * 9, cy:yy, r:2.2, "class":"ge-dot" }); }
    });
    if (any) h += txt(X0 + n * LW / 2, 170, "DNA left the gel", "ge-big", "middle") + txt(X0 + n * LW / 2, 186, "through the backs of the wells", "ge-t", "middle");
  } else if (o.reveal) {
    var focusK = o.focus, onGel = bands.filter(function(b){ return b.on; });
    if (o.tap && !onGel.some(function(b){ return b.key === focusK; })) focusK = onGel.length ? onGel[0].key : null;
    onGel.forEach(function(b){
      var cx = laneX(b.lane), y = Y0 + b.d * K, on = sel.indexOf(b.key) >= 0;
      var band = sv("rect", { x:cx - 16, y:y - K / 2, width:32, height:K, rx:1, "class":b.lad ? "ge-bl" : "ge-bs" }) + (on ? sv("rect", { x:cx - 19.5, y:y - 5.2, width:39, height:10.4, rx:3, "class":"ge-ring" }) : "");
      if (o.tap) h += '<g class="ge-bd" data-b="' + b.key + '" role="button" tabindex="' + (b.key === focusK ? 0 : -1) + '" aria-pressed="' + on + '" aria-label="' + MV.esc(bandLabel(b, o.lanes[b.lane])) + '">' + sv("rect", { x:cx - 21, y:y - 5.5, width:42, height:11, "class":"ge-hit" }) + band + "</g>";
      else h += band;
    });
    if (o.gap && sel.length === 2) {
      var g = sel.map(function(k){ return byId(onGel.map(function(b){ return { id:b.key, b:b }; }), k); }).filter(Boolean).map(function(x){ return x.b; });
      if (g.length === 2) {
        var y1 = Y0 + g[0].d * K, y2 = Y0 + g[1].d * K, bx = R + 8, gv = f1(Math.abs(g[0].raw - g[1].raw));
        h += sv("line", { x1:laneX(g[0].lane) + 19.5, y1:y1, x2:bx, y2:y1, "class":"ge-gl" }) + sv("line", { x1:laneX(g[1].lane) + 19.5, y1:y2, x2:bx, y2:y2, "class":"ge-gl" }) +
          sv("path", { d:"M" + (bx - 3) + " " + f1(y1) + " H" + (bx + 3) + " M" + bx + " " + f1(y1) + " V" + f1(y2) + " M" + (bx - 3) + " " + f1(y2) + " H" + (bx + 3), "class":"ge-gb" }) +
          txt(bx + 5, (y1 + y2) / 2 + 3.5, mm(gv) + " mm", "ge-gt");
      }
    }
    if (o.ruler) {
      var rb = onGel.filter(function(b){ return b.key === o.ruler; })[0];
      if (rb) { var rx = laneX(rb.lane) + 18.5, ry = Y0 + rb.d * K; h += sv("path", { d:"M" + f1(rx - 3) + " " + Y0 + " H" + f1(rx + 3) + " M" + f1(rx) + " " + Y0 + " V" + f1(ry), "class":"ge-rul" }) + txt(rx + 3, ry + 13, mm(rb.d) + " mm", "ge-rl"); }
    }
  }
  return { svg:h, w:R + 50, bands:bands };
}
function gelDesc(o, nm){
  var pos = o.orient === "pos", list = gelBands(o);
  var head = nm + ": " + o.gid + "% agarose, " + o.V + " V, " + Math.round(o.e) + " min, wells at the " + (pos ? "positive (+)" : "negative (−)") + " end. ";
  if (pos && o.e > 0) return head + "The DNA left the gel through the backs of the wells: no bands.";
  if (!o.reveal) return head + "DNA hidden" + (o.dye && o.e > 0 ? "; dye front at " + mm(D(o.gid, o.V, o.e, DYE)) + " mm" : "") + ". Press Reveal DNA to see the bands.";
  return head + o.lanes.map(function(L, i){
    var bs = list.filter(function(b){ return b.lane === i; });
    if (!bs.length) return "Lane " + (i + 1) + ": empty.";
    return "Lane " + (i + 1) + " (" + L.name + "): " + bs.map(function(b){ return (b.unk ? "unknown band" : b.size + " bp") + (b.on ? " at " + mm(b.d) + " mm" : " ran off the gel"); }).join(", ") + ".";
  }).join(" ");
}
// keyboard for tappable bands: Enter/Space taps, arrow keys move between bands (roving tabindex)
function bandKeys(svg, onTap){
  svg.addEventListener("click", function(e){ var g = e.target.closest("[data-b]"); if (g) onTap(g.getAttribute("data-b"), g); });
  svg.addEventListener("keydown", function(e){
    var g = e.target.closest && e.target.closest("[data-b]"); if (!g) return;
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onTap(g.getAttribute("data-b"), g); return; }
    var d = (e.key === "ArrowDown" || e.key === "ArrowRight") ? 1 : (e.key === "ArrowUp" || e.key === "ArrowLeft") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var all = $$("[data-b]", svg), i = all.indexOf(g), nx = all[(i + d + all.length) % all.length];
    if (nx) { all.forEach(function(x){ x.setAttribute("tabindex", "-1"); }); nx.setAttribute("tabindex", "0"); nx.focus(); }
  });
}
function paintSVG(svg, html, w, aria){
  var act = document.activeElement, fk = act && svg.contains(act) && act.getAttribute ? act.getAttribute("data-b") : null;
  svg.setAttribute("viewBox", "0 0 " + f1(w) + " 372");
  svg.innerHTML = html;
  if (aria) svg.setAttribute("aria-label", aria);
  if (fk) { var el = svg.querySelector('[data-b="' + fk + '"]'); if (el) { $$("[data-b]", svg).forEach(function(x){ x.setAttribute("tabindex", "-1"); }); el.setAttribute("tabindex", "0"); el.focus({ preventScroll:true }); } }
}

// ---------- Explore: Virtual gel ----------
function explore(host, api){
  var C = api.content, S = api.S;
  var D0 = { mode:"run", orient:"neg", gel:"1.5", gel2:"2.0", lanes:C.lanes0.slice(), V:100, t:60, e:0, reveal:false, selA:[], selB:[], last:null };
  Object.keys(D0).forEach(function(k){ if (S[k] === undefined) S[k] = clone(D0[k]); });
  var tube = null, anim = null, pend = null, running = false, msg = "";
  function tb(id){ return id ? byId(C.tubes, id) : null; }
  function lanesOf(){
    return S.lanes.map(function(id, i){ var t = tb(id); return { code:t ? t.code : "—", name:t ? t.name : "empty", bands:t ? t.sizes.map(function(s){ return { key:i + ":" + s, size:s, lad:!!t.ladder, unk:!!t.unknown }; }) : [] }; });
  }
  var gelChips = C.gels.map(function(g){ return { id:g.id, t:g.id + "%" }; });
  host.innerHTML = '<div class="pg ge-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="ge-gels" id="ge-gels"><figure class="ge-gw"><figcaption class="ge-gcap" id="ge-capA"></figcaption><svg id="ge-svgA" class="ge-svg" viewBox="0 0 360 372" role="group" focusable="false"></svg><div id="ge-gA"></div></figure>' +
    '<figure class="ge-gw" id="ge-gwB"><figcaption class="ge-gcap" id="ge-capB"></figcaption><svg id="ge-svgB" class="ge-svg" viewBox="0 0 360 372" role="group" focusable="false"></svg><div id="ge-gB"></div></figure></div>' +
    '<p class="ge-cap" id="ge-cap" aria-live="polite"></p>' +
    '<div class="ge-load"><div class="ge-lrow"><span class="rg-lab" id="ge-trl">Tube tray: tap a tube, then a lane</span><div class="ge-tray" id="ge-tray" role="group" aria-labelledby="ge-trl"></div></div>' +
    '<div class="ge-lrow"><span class="rg-lab" id="ge-lnl">Lanes</span><div class="ge-lanes" id="ge-lanes" role="group" aria-labelledby="ge-lnl"></div></div></div></div>' +
    '<div class="pg-ctrl"><div id="ge-mode"></div><p class="tiny muted ge-mhelp" id="ge-mhelp"></p><div id="ge-or"></div>' +
    '<div class="ge-sl"><label for="ge-V" class="rg-lab">Voltage</label><input type="range" id="ge-V" min="50" max="150" step="10" data-k="geV"><output id="ge-Vo" for="ge-V"></output></div>' +
    '<p class="tiny ge-vnote" id="ge-vnote"></p>' +
    '<div class="ge-sl"><label for="ge-T" class="rg-lab">Run time</label><input type="range" id="ge-T" min="0" max="120" step="10" data-k="geT"><output id="ge-To" for="ge-T"></output></div>' +
    '<div class="q-actions ge-run" id="ge-run"></div></div>' +
    '<div class="pg-read"><dl class="read" id="ge-read" aria-live="polite"></dl><p class="tiny ge-note">' + C.elecNote + '</p><p class="tiny ge-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div></div>";
  var svgA = $("#ge-svgA", host), svgB = $("#ge-svgB", host), readEl = $("#ge-read", host), capEl = $("#ge-cap", host);
  function setCap(t){ msg = t || ""; capEl.textContent = MV.plain(msg); }

  var modeR = radios($("#ge-mode", host), { label:"Mode", key:"m", options:C.modes.map(function(m){ return { id:m[0], t:m[1] }; }), value:S.mode, onChange:function(v){ stopRun(); S.mode = v; S.selB = []; if (S.last && S.last.g === "B") S.last = null; save(); setCap(C.modeHelp[v]); } });
  var orR = radios($("#ge-or", host), { label:"Gel orientation", key:"o", options:C.orients.map(function(m){ return { id:m[0], t:m[1] }; }), value:S.orient, onChange:function(v){ stopRun(); S.orient = v; clearSel(); save(); setCap(v === "pos" ? "Wells beside the + electrode." : "Wells beside the − electrode."); } });
  var gelA = radios($("#ge-gA", host), { label:"Agarose", key:"ga", cls:"chips", options:gelChips, value:S.gel, onChange:function(v){ stopRun(); S.gel = v; save(); setCap(v + "% agarose" + (S.mode === "compare" ? " in the left gel." : ".")); } });
  var gelB = radios($("#ge-gB", host), { label:"Agarose", key:"gb", cls:"chips", options:gelChips, value:S.gel2, onChange:function(v){ stopRun(); S.gel2 = v; save(); setCap(v + "% agarose in the right gel."); } });
  var vIn = $("#ge-V", host), tIn = $("#ge-T", host);
  vIn.value = S.V; tIn.value = S.t;
  vIn.addEventListener("input", function(){ stopRun(); S.V = +vIn.value; save(); });
  tIn.addEventListener("input", function(){ stopRun(); S.t = +tIn.value; S.e = S.t; save(); });

  // tray and lanes
  function paintTray(){
    var box = $("#ge-tray", host);
    MV.keepFocus(box, function(){
      box.innerHTML = C.tubes.concat([{ id:"", name:"Empty a lane", code:"" }]).map(function(t){ var on = tube === t.id; return '<button type="button" class="ge-tube' + (on ? " on" : "") + (t.id ? "" : " ge-empty") + '" aria-pressed="' + on + '" data-tube="' + t.id + '" data-k="tube' + (t.id || "x") + '"' + (running ? " disabled" : "") + ">" + t.name + "</button>"; }).join("");
    });
  }
  function paintLanes(){
    var box = $("#ge-lanes", host);
    MV.keepFocus(box, function(){
      box.innerHTML = S.lanes.map(function(id, i){ var t = tb(id); return '<button type="button" class="ge-lane" data-lane="' + i + '" data-k="lane' + i + '"' + (running ? " disabled" : "") + '><span class="ge-ln">Lane ' + (i + 1) + '</span><span class="ge-lt">' + (t ? t.name : "empty") + "</span></button>"; }).join("");
    });
  }
  $("#ge-tray", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-tube]"); if (!b || b.disabled) return;
    var id = b.dataset.tube; tube = tube === id ? null : id; paintTray();
    setCap(tube == null ? "No tube selected." : tube === "" ? "Empty a lane: now tap the lane to clear." : tb(tube).name + " selected: now tap a lane.");
  });
  $("#ge-lanes", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-lane]"); if (!b || b.disabled) return;
    var i = +b.dataset.lane;
    if (tube == null) { setCap("Choose a tube in the tray first, then tap a lane."); return; }
    stopRun();
    S.lanes[i] = tube;
    ["selA", "selB"].forEach(function(k){ S[k] = S[k].filter(function(x){ return +x.split(":")[0] !== i; }); });
    if (S.last && +S.last.key.split(":")[0] === i) S.last = null;
    save(); setCap(tube ? "Lane " + (i + 1) + ": " + tb(tube).name + " loaded." : "Lane " + (i + 1) + " emptied.");
  });

  // run controls: Play/Pause and the Reveal DNA switch
  function paintRun(){
    var box = $("#ge-run", host);
    MV.keepFocus(box, function(){
      box.innerHTML = '<button type="button" class="btn primary sm" data-act="play" data-k="geplay">' + (running ? "Pause" : S.e > 0 && S.e < S.t ? "Resume" : S.e >= S.t && S.t > 0 && S.e > 0 ? "Run again" : "Play") + "</button>" +
        '<button type="button" class="btn ghost sm ge-sw" role="switch" aria-checked="' + !!S.reveal + '" data-act="reveal" data-k="gerev"' + (running ? " disabled" : "") + '>Reveal DNA <span class="ge-swv">' + (S.reveal ? "On" : "Off") + "</span></button>";
    });
  }
  $("#ge-run", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-act]"); if (!b || b.disabled) return;
    if (b.dataset.act === "reveal") { S.reveal = !S.reveal; save(); setCap(S.reveal ? "DNA revealed, as an imaging system would show it. Tap a band to read its distance." : "DNA hidden."); return; }
    if (running) { stopRun(); paintAll(); setCap("Paused at " + Math.round(S.e) + " min."); MV.changed(); return; }
    if (S.t <= 0) { setCap("Set a run time above 0 min first."); return; }
    var from = S.e > 0 && S.e < S.t ? S.e : 0;
    S.reveal = false; clearSel(); S.e = from; save();
    runTo(S.t, (S.t - from) * 100, function(){ setCap("Run finished at " + S.t + " min." + (S.orient === "pos" ? "" : " Press Reveal DNA to see where each fragment stopped.")); });
  });
  function runTo(target, dur, fin){
    var from = S.e; running = true; readEl.setAttribute("aria-live", "off");
    paintCtrl(); setCap("Running…");
    anim = MV.tween({ dur:dur, ease:lin, step:function(k){ S.e = lerp(from, target, k); paintGels(); paintRead(); }, done:function(){
      anim = null; running = false; S.e = target; readEl.setAttribute("aria-live", "polite"); api.save(); paintAll(); MV.changed(); if (fin) fin();
    } });
  }
  function stopRun(){
    if (anim) { anim(); anim = null; }
    if (running) { running = false; S.e = Math.round(S.e); readEl.setAttribute("aria-live", "polite"); }
    if (pend) { var d = pend; pend = null; d(); }
  }
  function clearSel(){ S.selA = []; S.selB = []; S.last = null; }
  function save(){ api.save(); paintAll(); MV.changed(); }

  // band taps: select (two per gel for the gap readout); the ruler reads the last one
  function tap(g){ return function(key){
    if (running) return;
    var k = g === "A" ? "selA" : "selB", s = S[k], i = s.indexOf(key);
    if (i >= 0) { s.splice(i, 1); if (S.last && S.last.key === key && S.last.g === g) S.last = s.length ? { g:g, key:s[s.length - 1] } : null; }
    else { s.push(key); if (s.length > 2) s.shift(); S.last = { g:g, key:key }; }
    api.save(); paintGels(); paintRead(); MV.changed();
    var b = bandInfo(g, key); setCap(i >= 0 ? "Band deselected." : b ? sayBand(b) + "." : "");
  }; }
  bandKeys(svgA, tap("A")); bandKeys(svgB, tap("B"));
  function optsFor(g){
    var sel = g === "A" ? S.selA : S.selB;
    return { lanes:lanesOf(), gid:g === "A" ? S.gel : S.gel2, V:S.V, e:S.e, orient:S.orient, reveal:S.reveal, dye:true, tap:!running, sel:sel, gap:true,
      ruler:S.last && S.last.g === g ? S.last.key : sel.length === 1 ? sel[0] : null, focus:S.last && S.last.g === g ? S.last.key : sel[0] };
  }
  function bandInfo(g, key){ var b = gelBands(optsFor(g)).filter(function(x){ return x.key === key; })[0]; return b && b.on ? b : null; }
  function sayBand(b){ return "Lane " + (b.lane + 1) + ", " + (b.unk ? "? bp" : b.size + " bp") + ", " + mm(b.d) + " mm"; }
  function gName(g){ return S.mode === "compare" ? (g === "A" ? "Left gel" : "Right gel") : "Gel"; }

  // ---- painting ----
  function paintCtrl(){
    var cmp = S.mode === "compare";
    modeR.set(S.mode); orR.set(S.orient); gelA.set(S.gel); gelB.set(S.gel2);
    $("#ge-gwB", host).hidden = !cmp;
    $("#ge-gels", host).classList.toggle("cmp", cmp);
    $("#ge-mhelp", host).textContent = MV.plain(C.modeHelp[S.mode]);
    if (+vIn.value !== S.V) vIn.value = S.V;
    if (+tIn.value !== S.t) tIn.value = S.t;
    $("#ge-Vo", host).textContent = S.V + " V";
    $("#ge-To", host).textContent = S.t + " min";
    $("#ge-vnote", host).textContent = S.V >= 150 ? C.voltNote : "";
    $("#ge-vnote", host).hidden = S.V < 150;
    paintTray(); paintLanes(); paintRun();
  }
  function paintGels(){
    ["A", "B"].forEach(function(g){
      if (g === "B" && S.mode !== "compare") return;
      var o = optsFor(g), r = gelSVG(o), svg = g === "A" ? svgA : svgB;
      paintSVG(svg, r.svg, r.w, gelDesc(o, gName(g)));
      $("#ge-cap" + g, host).textContent = S.mode === "compare" ? gName(g) + ": " + o.gid + "% agarose" : o.gid + "% agarose";
      // drop selections for bands that ran off the gel or are hidden
      var keep = r.bands.filter(function(b){ return b.on; }).map(function(b){ return b.key; }), k = g === "A" ? "selA" : "selB";
      if (!running && (S.orient === "pos" && S.e > 0 || !S.reveal)) S[k] = [];
      else if (!running) S[k] = S[k].filter(function(x){ return keep.indexOf(x) >= 0; });
    });
    if (S.last && (S.last.g === "A" ? S.selA : S.selB).indexOf(S.last.key) < 0) S.last = null;
  }
  function offList(gid){
    var smallest = null;
    lanesOf().forEach(function(L){ L.bands.forEach(function(b){ if (D(gid, S.V, S.e, b.size) > LEN + EPS && (smallest == null || b.size < smallest)) smallest = b.size; }); });
    return smallest;
  }
  function status(){
    var cmp = S.mode === "compare";
    if (running) return "Running";
    if (S.orient === "pos" && S.e > 0) return "Wells at the + end: DNA left the gel";
    if (S.e <= 0) return "Ready: press Play";
    var oa = offList(S.gel), ob = cmp ? offList(S.gel2) : null, t = [];
    if (oa != null) t.push((cmp ? "Left gel: " : "") + oa + " bp band ran off the gel");
    if (ob != null) t.push("Right gel: " + ob + " bp band ran off the gel");
    if (t.length) return t.join(" · ");
    return S.e < S.t ? "Paused" : "Stopped" + (S.reveal ? "" : " (press Reveal DNA)");
  }
  function dyeTxt(gid){ if (S.orient === "pos" && S.e > 0) return "out of the gel"; var d = D(gid, S.V, S.e, DYE); return d > LEN + EPS ? "Off the gel" : mm(d) + " mm"; }
  function gapTxt(g){ var s = g === "A" ? S.selA : S.selB; if (s.length < 2) return null; var a = bandInfo(g, s[0]), b = bandInfo(g, s[1]); return a && b ? mm(Math.abs(a.raw - b.raw)) + " mm" : null; }
  function paintRead(){
    var cmp = S.mode === "compare", L = C.readout, rows = [];
    rows.push([L[0], S.orient === "pos" ? "+ … out of the gel" : "+ (positive electrode)"]);
    rows.push([L[1], cmp ? "Left " + S.gel + "% · right " + S.gel2 + "% agarose" : S.gel + "% agarose"]);
    rows.push([L[2], S.V + " V · " + Math.round(S.e) + " min"]);
    rows.push([L[3], cmp ? "Left " + dyeTxt(S.gel) + " · right " + dyeTxt(S.gel2) : dyeTxt(S.gel)]);
    var lb = S.last ? bandInfo(S.last.g, S.last.key) : null;
    rows.push([L[4], lb ? (cmp ? gName(S.last.g) + ": " : "") + sayBand(lb) : '<span class="muted">Tap a band</span>']);
    var ga = gapTxt("A"), gb = cmp ? gapTxt("B") : null;
    rows.push([L[5], cmp ? (ga || gb ? "Left " + (ga || "–") + " · right " + (gb || "–") : '<span class="muted">Tap two bands in a gel</span>') : (ga || '<span class="muted">Tap two bands</span>')]);
    rows.push([L[6], "<strong>" + status() + "</strong>"]);
    readEl.innerHTML = MV.readoutHTML(rows);
  }
  function paintAll(){ paintCtrl(); paintGels(); paintRead(); }
  paintAll();
  setCap(C.modeHelp[S.mode]);

  // ---- challenges (tested on the displayed values, left gel in Compare mode) ----
  function chal(id){
    var W = byId(C.challenges, id).wrong, g = S.gel, V = S.V, t = Math.round(S.e);
    if (S.orient === "pos") return { ok:false, msg:W.pos };
    if (id === "tc1") {
      if (S.lanes.indexOf("l100") < 0) return { ok:false, msg:W.load };
      var d = D(g, V, t, 500);
      if (d >= 25.0 - EPS && d <= 30.0 + EPS) return { ok:true };
      return { ok:false, msg:(d > 30 ? W.far : W.near) + " (500 bp band now at " + mm(d) + " mm.)" };
    }
    if (id === "tc2") {
      if (S.lanes.indexOf("l100") < 0) return { ok:false, msg:W.load };
      var gp2 = gapOf(g, V, t, 400, 500), h = D(g, V, t, 100);
      if (gp2 >= 3.0 - EPS && h <= LEN + EPS) return { ok:true };
      if (g === "0.8" || g === "1.0") return { ok:false, msg:W.low };
      if (h > LEN + EPS) return { ok:false, msg:W.off };
      return { ok:false, msg:W.close + " (Gap " + mm(gp2) + " mm.)" };
    }
    if (id === "tc3") {
      if (V !== 100) return { ok:false, msg:W.volt };
      var gp3 = gapOf(g, 100, t, 250, 300), h3 = D(g, 100, t, 100), works = gp3 >= 2.0 - EPS && h3 <= LEN + EPS;
      if (works && g === "2.0" && t === 50) return { ok:true };
      if (g === "1.5" && t === 60) return { ok:false, msg:W.g15 };
      if (g === "2.0" && t === 40) return { ok:false, msg:W.g20t40 };
      if (g === "1.0" && t === 70) return { ok:false, msg:W.g10 };
      if (works) return { ok:false, msg:W.works };
      if (h3 > LEN + EPS) return { ok:false, msg:W.off };
      return { ok:false, msg:W.notYet + " (Gap " + mm(gp3) + " mm.)" };
    }
    return { ok:false };
  }

  return {
    predict:{
      start:function(p){
        stopRun();
        var s = p.start;
        S.mode = s.mode; S.orient = s.orient; S.lanes = s.lanes.slice(); S.gel = s.gel; if (s.gel2) S.gel2 = s.gel2;
        S.V = s.V; S.t = p.to || s.t; S.e = p.to ? s.t : 0; S.reveal = true; clearSel();
        if (s.sel) { S.selA = s.sel.map(function(z){ return "0:" + z; }); S.last = { g:"A", key:S.selA[0] }; }
        tube = null; api.save(); paintAll(); MV.changed();
        setCap(p.to ? "Stopped at " + s.t + " min. Gap between the 300 and 400 bp bands: " + (gapTxt("A") || "") + "." : "Loaded and ready to run.");
      },
      run:function(p, done){
        pend = done;
        var target = p.to || p.start.t, dur = (target - S.e) * (p.to ? 100 : 80);
        runTo(target, dur, function(){
          if (p.id === "p2") { S.selA = ["1:250", "1:600"]; S.last = { g:"A", key:"1:250" }; }
          if (p.id === "p3") { S.selA = ["0:100"]; S.selB = ["0:100"]; S.last = { g:"A", key:"0:100" }; }
          api.save(); paintAll(); MV.changed();
          setCap(p.reveal + (p.id === "p3" ? " Right gel: 100 bp at " + mm(D(S.gel2, S.V, S.e, 100)) + " mm." : ""));
          var d = pend; pend = null; if (d) MV.wait(350, d);
        });
      }
    },
    challenge:chal
  };
}

// ---------- @component S7 standardCurve — ladder size (log scale) against distance, with a read-across guide ----------
// viewBox 360 × 252; x = distance 5–45 mm, y = log₁₀(size) 100–1000 bp. k (0–1) animates Sample C's drop and read-across.
function cX(d){ return 56 + (d - 5) * 7.2; }
function cY(s){ return 214 - (Math.log10(s) - 2) * 192; }
function curveSVG(k){
  var g = gp("1.5"), h = "", sizes = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  sizes.forEach(function(s){ h += sv("line", { x1:56, y1:cY(s), x2:344, y2:cY(s), "class":"ge-grid" }); });
  [100, 200, 300, 400, 500, 700, 1000].forEach(function(s){ h += txt(51, cY(s) + 3.5, String(s), "ge-t", "end"); });
  [10, 20, 30, 40].forEach(function(d){ h += sv("line", { x1:cX(d), y1:214, x2:cX(d), y2:219, "class":"ge-ax" }) + txt(cX(d), 230, String(d), "ge-t", "middle"); });
  h += sv("line", { x1:56, y1:214, x2:344, y2:214, "class":"ge-ax" }) + sv("line", { x1:56, y1:16, x2:56, y2:214, "class":"ge-ax" });
  h += txt(200, 247, "distance from the wells (mm)", "ge-t", "middle") + '<text class="ge-t" text-anchor="middle" transform="translate(12 115) rotate(-90)">size (bp, log scale)</text>';
  function sizeAt(d){ return 100 * Math.pow(10, (g.a - d) / g.b); }
  h += sv("line", { x1:cX(10), y1:cY(sizeAt(10)), x2:cX(39), y2:cY(sizeAt(39)), "class":"ge-fit" });
  sizes.forEach(function(s){ h += sv("circle", { cx:cX(D("1.5", 100, 60, s)), cy:cY(s), r:4, "class":"ge-pt" }); });
  if (k > 0) {
    var dC = 23.2, sC = sizeAt(dC), k1 = seg(k, 0, 0.5), k2 = seg(k, 0.5, 1), x = cX(dC), yTop = lerp(214, cY(sC), k1);
    h += sv("path", { d:"M" + f1(x - 6) + " 226 L" + f1(x) + " 216 L" + f1(x + 6) + " 226 Z", "class":"ge-mk" }) + txt(x + 9, 211, "Sample C: 23.2 mm", "ge-tk");
    h += sv("line", { x1:x, y1:214, x2:x, y2:yTop, "class":"ge-guide" });
    if (k2 > 0) h += sv("line", { x1:x, y1:cY(sC), x2:lerp(x, 56, k2), y2:cY(sC), "class":"ge-guide" });
    if (k >= 1) h += sv("circle", { cx:x, cy:cY(sC), r:4.5, "class":"ge-ptc" }) + txt(62, cY(sC) - 6, "≈ 350 bp", "ge-tk");
  }
  return h;
}

// ---------- Part 3: Read the gel (standard curve + four stations) ----------
function stationLanes(list, lad){
  return list.map(function(L, i){
    var sizes = L[1] === "ladder" ? lad : L[1], isLad = L[1] === "ladder";
    return { code:L[2] || L[0], name:L[0], bands:sizes.map(function(s){ return { key:i + ":" + s, size:s, lad:isLad }; }) };
  });
}
function part3(host, api){
  var C = api.content, S = api.S, ladder = byId(MV.C.explore.tubes, "l100").sizes;
  S.s1 = S.s1 || []; S.p = S.p || {};
  var s1msg = null, dropK = S.s1.indexOf(300) >= 0 && S.s1.indexOf(400) >= 0 ? 1 : 0, last1 = null;
  var codes = { s2:["Scene", "P1", "P2", "P3"], s3:["Child", "Mother", "A", "B"], s4:["Ladder", "Sample", "+ ctrl", "NTC"] };
  function lanesFor(id){ return stationLanes(C[id].lanes.map(function(L, i){ return [L[0], L[1], codes[id][i]]; }), ladder); }
  function tableHTML(id){
    return '<div class="tbl-wrap"><table class="ge-tbl"><caption class="vh">' + C[id].title + ' bands</caption><thead><tr><th scope="col">Lane</th><th scope="col">Bands (bp)</th></tr></thead><tbody>' +
      C[id].lanes.map(function(L){ return '<tr><th scope="row">' + L[0] + "</th><td>" + (L[1] === "ladder" ? "100, 200, … 1000 (ladder)" : L[1].join(", ")) + "</td></tr>"; }).join("") + "</tbody></table></div>";
  }
  function chipsBox(id){ return '<div class="ge-sq" data-st="' + id + '"></div>'; }
  host.innerHTML = '<div class="ge-p3">' +
    '<section class="ge-stn"><h3>' + C.s1.title + "</h3><p>" + C.s1.how + '</p><div class="ge-sgw"><svg id="ge-s1" class="ge-svg ge-ssvg" viewBox="0 0 170 372" role="group" focusable="false"></svg></div><div id="ge-s1fb"></div></section>' +
    '<section class="ge-stn"><details class="alg" open><summary>' + C.curve.panel + "</summary><p>" + C.curve.how + '</p><div class="ge-cw"><svg id="ge-curve" viewBox="0 0 360 252" role="img" focusable="false"></svg></div>' +
      '<p class="tiny"><span class="bio-model">Model</span> ' + C.curve.note + '</p><p>' + C.curve.text + '</p><p class="ge-drop" id="ge-drop" aria-live="polite"></p></details></section>' +
    '<section class="ge-stn"><h3>' + C.s2.title + "</h3><p>" + C.s2.how + '</p><div class="ge-srow"><div class="ge-sgw"><svg id="ge-s2" class="ge-svg ge-ssvg" viewBox="0 0 264 372" role="img" focusable="false"></svg></div>' + tableHTML("s2") + "</div>" + chipsBox("s2") + "</section>" +
    '<section class="ge-stn"><h3>' + C.s3.title + "</h3><p>" + C.s3.how + '</p><p class="ge-rule"><strong>' + C.s3.rule + '</strong></p><div class="ge-srow"><div class="ge-sgw"><svg id="ge-s3" class="ge-svg ge-ssvg" viewBox="0 0 264 372" role="img" focusable="false"></svg></div>' + tableHTML("s3") + "</div>" + chipsBox("s3") + "</section>" +
    '<section class="ge-stn"><h3>' + C.s4.title + "</h3><p>" + C.s4.how + '</p><div class="ge-srow"><div class="ge-sgw"><svg id="ge-s4" class="ge-svg ge-ssvg" viewBox="0 0 264 372" role="img" focusable="false"></svg></div>' + tableHTML("s4") + "</div>" + chipsBox("s4") + "</section></div>";

  // Station 1: tap the ladder bands on either side of Sample C
  var s1svg = $("#ge-s1", host), s1lanes = [{ code:"100 bp", name:"100 bp ladder", bands:ladder.map(function(s){ return { key:"0:" + s, size:s, lad:true }; }) }, { code:"C ?", name:"Sample C", bands:[{ key:"1:350", size:350, unk:true }] }];
  function s1opts(){ return { lanes:s1lanes, gid:"1.5", V:100, e:60, orient:"neg", reveal:true, dye:false, tap:true, sel:S.s1.map(function(s){ return "0:" + s; }), ruler:last1, focus:last1 }; }
  function paintS1(){
    var o = s1opts(), r = gelSVG(o); paintSVG(s1svg, r.svg, r.w, gelDesc(o, "Station 1 gel") + " Tap the ladder bands on either side of the unknown.");
    var done = S.s1.indexOf(300) >= 0 && S.s1.indexOf(400) >= 0, fb = $("#ge-s1fb", host);
    fb.innerHTML = done ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + C.s1.done) : s1msg ? MV.fbHTML(s1msg[0], s1msg[1]) : "";
  }
  bandKeys(s1svg, function(key){
    var size = +key.split(":")[1], lane = +key.split(":")[0], was = S.s1.indexOf(300) >= 0 && S.s1.indexOf(400) >= 0;
    last1 = key;
    if (lane === 1) s1msg = ["bad", "<strong>✗ Not quite.</strong> " + C.s1.unknown];
    else if (size === 300 || size === 400) { if (S.s1.indexOf(size) < 0) S.s1.push(size); s1msg = ["good", C.s1.one]; }
    else s1msg = ["bad", "<strong>✗ Not quite.</strong> The " + size + " bp band is at " + mm(D("1.5", 100, 60, size)) + " mm. " + C.s1.far];
    api.save(); paintS1(); MV.focusFb($("#ge-s1fb", host));
    if (!was && S.s1.indexOf(300) >= 0 && S.s1.indexOf(400) >= 0) dropAnim();
  });
  var curve = $("#ge-curve", host);
  function paintCurve(){
    curve.innerHTML = curveSVG(dropK);
    curve.setAttribute("aria-label", "Standard curve: the ten 100 bp ladder points (1.5%, 60 min) fall on a straight line of log size against distance, from 1000 bp at 10.0 mm to 100 bp at 39.0 mm." + (dropK >= 1 ? " Sample C’s band at 23.2 mm meets the line at about 350 bp." : ""));
    $("#ge-drop", host).textContent = dropK >= 1 ? MV.plain(C.curve.drop) : "Size the unknown in Station 1 to drop Sample C onto the line.";
  }
  function dropAnim(){ MV.tween({ dur:1600, ease:lin, step:function(k){ dropK = k; paintCurve(); }, done:function(){ dropK = 1; paintCurve(); } }); }
  paintS1(); paintCurve();

  // Stations 2–4: banding patterns + one question each
  ["s2", "s3", "s4"].forEach(function(id){
    var o = { lanes:lanesFor(id), gid:"1.5", V:100, e:60, orient:"neg", reveal:true, dye:false }, r = gelSVG(o), svg = $("#ge-" + id, host);
    paintSVG(svg, r.svg, r.w, gelDesc(o, C[id].title));
    var box = $('[data-st="' + id + '"]', host), list = C[id].choices, order = id === "s4" ? MV.shuffle(list.map(function(c, i){ return i; }), "ge" + id) : list.map(function(c, i){ return i; });
    function paint(){
      var st = S.p[id] || {}, h = (C[id].q ? '<p class="ge-q">' + C[id].q + "</p>" : "") + '<div class="chips" role="group" aria-label="' + MV.esc(MV.plain(C[id].title)) + ' choices">' +
        order.map(function(j){ var on = st.pick === j; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-sc="' + j + '" data-k="sc' + id + j + '"' + (st.solved ? " disabled" : "") + ">" + list[j].t + "</button>"; }).join("") + "</div>";
      if (st.pick != null) { var c = list[st.pick], ok = MV.ok(c); h += MV.fbHTML(ok ? "good" : "bad", "<strong>" + (ok ? "✓ Correct." : "✗ Not quite.") + "</strong> " + c.fb + (ok ? "" : " Try another.")); }
      MV.keepFocus(box, function(){ box.innerHTML = h; });
    }
    box.addEventListener("click", function(e){
      var b = e.target.closest("[data-sc]"); if (!b || b.disabled) return;
      var st = S.p[id] || (S.p[id] = {}), j = +b.dataset.sc;
      st.pick = j; if (MV.ok(list[j])) st.solved = true; else st.tries = (st.tries || 0) + 1;
      api.save(); paint(); MV.focusFb(box);
    });
    paint();
  });
}

// ---------- Practice: chip sets with a ladder strip (Size the band) and select-all (Gel detective) ----------
// adapted from SBI4U 02's experiments (mc + N7 select all in one custom activity)
// stripSVG(band): the 1.5%, 100 V, 60 min ladder (top row, sizes labelled) and the item's band (bottom row) on a 0–42 mm scale
function stripSVG(band){
  var x = function(d){ return 20 + d * 9; }, h = "", lad = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  h += sv("rect", { x:14, y:16, width:388, height:18, rx:2, "class":"ge-slab" }) + sv("rect", { x:14, y:50, width:388, height:18, rx:2, "class":"ge-slab" });
  h += sv("rect", { x:14, y:17, width:5, height:16, "class":"ge-well" }) + sv("rect", { x:14, y:51, width:5, height:16, "class":"ge-well" });
  lad.forEach(function(s, i){
    var d = D("1.5", 100, 60, s), xx = x(d);
    h += sv("rect", { x:xx - 2, y:18, width:4, height:14, rx:1, "class":"ge-bl" });
    h += txt(xx, i % 2 ? 46 : 12, String(s), "ge-ts", "middle");
  });
  h += sv("rect", { x:x(band) - 2, y:52, width:4, height:14, rx:1, "class":"ge-bs" }) + txt(x(band), 80, mm(band) + " mm", "ge-tk", "middle");
  for (var d = 0; d <= 40; d += 10) h += sv("line", { x1:x(d), y1:86, x2:x(d), y2:90, "class":"ge-ax" }) + txt(x(d), 100, d + (d ? "" : " mm"), "ge-t", "middle");
  h += sv("line", { x1:x(0), y1:88, x2:x(42), y2:88, "class":"ge-ax" });
  return '<figure class="ge-strip"><svg viewBox="0 0 420 104" role="img" focusable="false" aria-label="' + MV.esc("Ladder on a 1.5% gel, 100 V, 60 min: " + lad.map(function(s){ return s + " bp at " + mm(D("1.5", 100, 60, s)) + " mm"; }).join(", ") + ". Your band: " + mm(band) + " mm from the wells.") + '">' + h +
    '</svg><figcaption class="tiny muted">Ladder (top, sizes in bp) and the band (bottom), measured from the wells at the left.</figcaption></figure>';
}
function chipSet(host, api, a){
  var S = api.S; S.items = S.items || {};
  function ist(id){ return S.items[id] || (S.items[id] = { pick:{}, choice:null, tries:0, hint:0, solved:false, first:null, checked:false }); }
  host.innerHTML = a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = $('[data-li="' + it.id + '"]', host), h;
    if (it.kind === "mc") {
      h = MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true, topicLabel:it.star ? "★" : "" });
      if (it.fig) h = h.replace('<div class="opts"', stripSVG(it.fig.band) + '<div class="opts"');
    } else {
      h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tags"><span class="tag">★</span></span>' : "") + "</div>";
      h += '<div class="opts" role="group" aria-label="Options (select all that apply)">' + it.options.map(function(o, oi){
        var on = !!x.pick[oi], c = "opt sa-opt", good = MV.ok(o);
        if (x.checked) { if (on && good) c += " right"; else if (on && !good) c += " wrong"; else if (!on && good && x.solved) c += " right"; }
        return '<button type="button" class="' + c + '" role="checkbox" aria-checked="' + on + '" data-k="' + it.id + "o" + oi + '" data-oi="' + oi + '"' + (x.solved ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + (on ? "☑" : "☐") + "</span><span>" + o.t + "</span></button>";
      }).join("") + "</div>";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
      if (x.checked) {
        var lines = it.options.map(function(o, oi){ var on = !!x.pick[oi], good = MV.ok(o); if (on && !good) return "<p>✗ " + o.t + ": " + o.why + "</p>"; if (!on && good && !x.solved) return "<p>○ One more option belongs in your selection.</p>"; return ""; }).filter(Boolean);
        lines = lines.filter(function(l, k){ return lines.indexOf(l) === k; });
        h += x.solved ? '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + it.why + "</p></div>" : '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong> Your selection isn’t right yet.</p>' + lines.join("") + "</div>";
      }
    }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-li]"); if (!box) return;
    var it = item(box.dataset.li), x = ist(it.id);
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (it.kind === "mc" && b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
    else if (it.kind === "sel" && b.dataset.oi != null) { var oi = +b.dataset.oi; x.pick[oi] = !x.pick[oi]; x.checked = false; }
    else if (b.dataset.act === "check") {
      x.checked = true;
      var ok = it.kind === "mc" ? MV.ok(it.options[x.choice]) : it.options.every(function(o, k){ return !!x.pick[k] === MV.ok(o); });
      if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
    } else return;
    api.save(); paintItem(it); if (b.dataset.act === "check") MV.focusFb(box);
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Plan the run (chip rows + live preview gel: ladder, 250 bp lane, 300 bp lane) ----------
var task = (function(){
  var api = null;
  function T(){ return MV.C.task; }
  function st(){ var s = api.S; if (!s.w) s.w = "neg"; if (!s.lad) s.lad = "l1k"; if (!s.gel) s.gel = "1.0"; if (s.time == null) s.time = 40; return s; }
  function read(){ if (!api) return { w:"neg", lad:"l1k", gel:"1.0", time:40 }; var s = st(); return { w:s.w, lad:s.lad, gel:s.gel, time:+s.time }; }
  function calc(d){ return { gap:gapOf(d.gel, 100, d.time, 250, 300), h:D(d.gel, 100, d.time, 100) }; }
  function lab(k){ var p = k.split("|"), d = { gel:p[0], time:+p[1] }, c = calc(d); return "Wells at the negative end, 100 bp ladder, " + p[0] + "%, " + p[1] + " min (gap " + mm(c.gap) + " mm; 100 bp at " + mm(c.h) + " mm)"; }
  function draw(){
    var d = read(), svg = $("#ge-tsvg"); if (!svg) return;
    var lt = byId(MV.C.explore.tubes, d.lad);
    var lanes = [{ code:lt.code, name:lt.name, bands:lt.sizes.map(function(s){ return { key:"0:" + s, size:s, lad:true }; }) },
      { code:"250", name:"250 bp product", bands:[{ key:"1:250", size:250 }] }, { code:"300", name:"300 bp side product", bands:[{ key:"2:300", size:300 }] }];
    var o = { lanes:lanes, gid:d.gel, V:100, e:d.time, orient:d.w, reveal:true, dye:true, sel:["1:250", "2:300"], gap:true }, r = gelSVG(o);
    paintSVG(svg, r.svg, r.w, gelDesc(o, "Preview gel"));
    var c = calc(d);
    $("#ge-tread").innerHTML = MV.readoutHTML([
      ["DNA", d.w === "neg" ? "moves into the gel, toward +" : "leaves the gel through the backs of the wells"],
      ["Gap, 250 to 300 bp", mm(c.gap) + " mm"],
      ["A 100 bp fragment", c.h > LEN + EPS ? mm(c.h) + " mm: off the 60 mm gel" : mm(c.h) + " mm: on the gel"],
      ["Smallest ladder band", lt.sizes[0] + " bp"]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; var s = st(), t = T();
      inp.innerHTML = '<div class="ge-tin"><div id="ge-tw"></div><div id="ge-tl"></div><div id="ge-tg"></div><div id="ge-tt"></div><p class="tiny muted">Voltage: 100 V (fixed).</p></div>';
      function upd(){ a.save(); draw(); a.update(); }
      radios($("#ge-tw"), { label:"Wells end", key:"tw", options:t.wells.map(function(w){ return { id:w[0], t:w[1] }; }), value:s.w, onChange:function(v){ s.w = v; upd(); } });
      radios($("#ge-tl"), { label:"Ladder", key:"tl", options:t.ladders.map(function(w){ return { id:w[0], t:w[1] }; }), value:s.lad, onChange:function(v){ s.lad = v; upd(); } });
      radios($("#ge-tg"), { label:"Agarose", key:"tg", cls:"chips", options:t.gels.map(function(g){ return { id:g, t:g + "%" }; }), value:s.gel, onChange:function(v){ s.gel = v; upd(); } });
      radios($("#ge-tt"), { label:"Run time", key:"tt", cls:"chips", options:t.times.map(function(m){ return { id:String(m), t:m + " min" }; }), value:String(s.time), onChange:function(v){ s.time = +v; upd(); } });
      pv.innerHTML = '<div class="ge-tpv"><h4>Live preview</h4><div class="ge-sgw"><svg id="ge-tsvg" class="ge-svg ge-ssvg" viewBox="0 0 220 372" role="img" focusable="false"></svg></div><dl class="read" id="ge-tread" aria-live="polite"></dl></div>';
      draw();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var c = calc(d); return [d.w === "neg", d.lad === "l100", c.gap >= 2.0 - EPS, c.h <= LEN + EPS]; },
    key:function(d){ return d.gel + "|" + d.time; },
    label:lab,
    text:lab
  };
})();

// ---------- hero: a horizontal gel; DNA dots stream toward + and settle into bands beside a ladder ----------
function hero(f){
  var box = $("#ge-hero"); if (!box) return;
  var cap = f && f.cap, last = -1;
  box.innerHTML = '<svg viewBox="0 0 520 232" aria-hidden="true" focusable="false"></svg>';
  var svg = $("svg", box), rng = MV.bio.rng("gel-hero");
  var CAPS = ["A gel slab: six wells at the negative end, the positive electrode at the far end.", "DNA is loaded into two wells: a ladder and a sample.",
    "The field pulls the negative DNA toward +.", "Short fragments pull ahead; long ones lag behind.", "Sharp bands: 1000 bp near the wells, 100 bp far away. Smaller → farther."];
  function setCap(i){ if (cap && i !== last) { cap.textContent = CAPS[i]; last = i; } }
  var XW = 86, KX = 6.2, rowY = function(i){ return 48 + i * 27; };
  var LAD = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000], SMP = [600, 250];
  var dots = [];
  function addDots(sizes, row, lad){ sizes.forEach(function(s){ for (var j = 0; j < 4; j++) dots.push({ s:s, row:row, lad:lad, jx:rng.range(-4, 4), jy:rng.range(-6, 6), sp:rng.range(0.94, 1.06) }); }); }
  addDots(LAD, 1, true); addDots(SMP, 4, false);
  function frame(T){
    var h = "", aSlab = seg(T, 0, 0.6), aDots = seg(T, 0.6, 1.2), aArr = seg(T, 1.2, 1.8), p = MV.ease(seg(T, 1.8, 5.8)), st = seg(T, 5.8, 6.8);
    h += '<g opacity="' + f1(aSlab * 100) / 100 + '">' + sv("rect", { x:70, y:34, width:400, height:162, rx:3, "class":"ge-slab" }) +
      sv("rect", { x:52, y:34, width:12, height:162, rx:3, "class":"ge-elec" }) + sv("rect", { x:476, y:34, width:12, height:162, rx:3, "class":"ge-elec" }) +
      txt(4, 24, "− negative", "ge-ht") + txt(516, 24, "+ positive", "ge-ht", "end");
    for (var i = 0; i < 6; i++) h += sv("rect", { x:XW - 7, y:rowY(i) - 8, width:6, height:16, rx:1.5, "class":"ge-well" });
    h += "</g>";
    if (aArr > 0) h += '<g opacity="' + f1(aArr * 100) / 100 + '">' + sv("line", { x1:200, y1:214, x2:330, y2:214, "class":"ge-farr" }) + sv("path", { d:"M330 208 L342 214 L330 220 Z", "class":"ge-outh" }) + txt(350, 218, "toward +", "ge-ht") + "</g>";
    if (st > 0) {
      var bands = "";
      LAD.forEach(function(s){ var x = XW + D("1.5", 100, 60, s) * KX; bands += sv("rect", { x:x - 2, y:rowY(1) - 8, width:4, height:16, rx:1, "class":"ge-bl" }); });
      SMP.forEach(function(s){ var x = XW + D("1.5", 100, 60, s) * KX; bands += sv("rect", { x:x - 2, y:rowY(4) - 8, width:4, height:16, rx:1, "class":"ge-bs" }); });
      [1000, 500, 300, 200, 100].forEach(function(s){ var x = XW + D("1.5", 100, 60, s) * KX; bands += txt(x, rowY(0) + 6, s === 100 ? "100 bp" : String(s), "ge-hs", "middle"); });
      SMP.forEach(function(s){ var x = XW + D("1.5", 100, 60, s) * KX; bands += txt(x, rowY(5) + 6, s + " bp", "ge-hs", "middle"); });
      h += '<g opacity="' + f1(st * 100) / 100 + '">' + bands + "</g>";
    }
    if (aDots > 0 && st < 1) {
      var dd = "";
      dots.forEach(function(q){ var x = XW + D("1.5", 100, 60, q.s) * KX * Math.min(1, p * q.sp) + q.jx * (1 - p * 0.6), y = rowY(q.row) + q.jy * 0.9; dd += sv("circle", { cx:x, cy:y, r:2.4, "class":q.lad ? "ge-hdl" : "ge-hds" }); });
      h += '<g opacity="' + f1(aDots * (1 - st) * 100) / 100 + '">' + dd + "</g>";
    }
    svg.innerHTML = h;
    setCap(T < 0.6 ? 0 : T < 1.2 ? 1 : T < 1.8 ? 2 : T < 5.8 ? 3 : 4);
  }
  if (MV.reduceMotion) { frame(8); return; }
  frame(0);
  MV.tween({ dur:7400, ease:lin, step:function(k){ frame(k * 7.4); }, done:function(){ frame(8); } });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ size:chipSet, detective:chipSet },
  task:task
});
})();
