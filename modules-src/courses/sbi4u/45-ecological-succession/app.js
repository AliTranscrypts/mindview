// SBI4U 45 Ecological Succession: hero (five-panel strip, soil thickens, year counter, a fire resets the forest to grasses),
// Succession time-lapse (landscape + four mini graphs with a year marker; fire-cycle strip), Disturbance and recovery
// (jack pine cone, Sudbury data, fire vs clear-cut), Glacier data detective (custom chips + number entry), Plan a regreening task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small SVG helpers (from SBI4U 19 / 17) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function seg(T, a, b){ return clamp((T - a) / (b - a), 0, 1); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "es-t", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }

// ---------- @component radioGroup (copied from SBI4U 19 / 17 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), disable(b)}
function radios(host, o){
  var val = String(o.value), off = false;
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, dis = x.dis || off, tab = on || (!any && i === 0) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (dis ? -1 : tab) + '" data-rg="' + x.id + '" data-k="rg' + (o.key || "") + x.id + '"' + (dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
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
    disable:function(b){ if (b !== off) { off = b; paint(); } } };
}

// ---------- @component landscapeScene — succession landscape (module 45): sky, rock, a brown soil band whose thickness follows
// the soil depth, and plant layers in --leaf that appear by amount. L = [lichen, moss, grass, shrub, pioneer tree, late tree, spruce/fir] ----------
var NS = [12, 10, 16, 8, 6, 5, 7], POS = {};
function layout(key, w){
  var k = key + "|" + w; if (POS[k]) return POS[k];
  // golden-ratio spacing: the first n positions of every layer are spread across the whole width
  var r = MV.bio.rng("es" + key), out = NS.map(function(n, li){
    var a = []; for (var i = 0; i < n; i++) a.push({ x:(0.08 + li * 0.13 + i * 0.618034 + (r() - 0.5) * 0.06 + 1) % 1, s:0.85 + r() * 0.3 });
    return a;
  });
  return (POS[k] = out);
}
function lichen(x, gy, s){ return sv("ellipse", { cx:x, cy:gy - 1, rx:5 * s, ry:2.2 * s, "class":"es-lichen" }); }
function moss(x, gy, s){ return sv("path", { d:"M" + f1(x - 4 * s) + " " + f1(gy) + " A" + f1(4 * s) + " " + f1(3.6 * s) + " 0 0 1 " + f1(x + 4 * s) + " " + f1(gy) + " Z", "class":"es-moss" }); }
function tuft(x, gy, s){ var h = 12 * s; return sv("path", { d:"M" + f1(x - 3 * s) + " " + f1(gy) + " Q" + f1(x - 4 * s) + " " + f1(gy - h * 0.6) + " " + f1(x - 6 * s) + " " + f1(gy - h) + " M" + f1(x) + " " + f1(gy) + " L" + f1(x) + " " + f1(gy - h * 1.15) + " M" + f1(x + 3 * s) + " " + f1(gy) + " Q" + f1(x + 4 * s) + " " + f1(gy - h * 0.6) + " " + f1(x + 6 * s) + " " + f1(gy - h), "class":"es-grass" }); }
function shrub(x, gy, s){ return sv("circle", { cx:x - 5 * s, cy:gy - 6 * s, r:6 * s, "class":"es-shrub" }) + sv("circle", { cx:x + 5 * s, cy:gy - 6 * s, r:6 * s, "class":"es-shrub" }) + sv("circle", { cx:x, cy:gy - 11 * s, r:7 * s, "class":"es-shrub" }); }
function pine(x, gy, s){ return sv("line", { x1:x, y1:gy, x2:x, y2:gy - 34 * s, "class":"es-trunk" }) + sv("ellipse", { cx:x, cy:gy - 38 * s, rx:8 * s, ry:15 * s, "class":"es-pine" }); }
function late(x, gy, s){ return sv("line", { x1:x, y1:gy, x2:x, y2:gy - 44 * s, "class":"es-trunk" }) + sv("circle", { cx:x, cy:gy - 56 * s, r:19 * s, "class":"es-late" }); }
function spruce(x, gy, s){ return sv("line", { x1:x, y1:gy, x2:x, y2:gy - 8 * s, "class":"es-trunk" }) + sv("path", { d:"M" + f1(x) + " " + f1(gy - 64 * s) + " L" + f1(x + 10 * s) + " " + f1(gy - 6 * s) + " L" + f1(x - 10 * s) + " " + f1(gy - 6 * s) + " Z", "class":"es-spruce" }); }
var DRAW = [lichen, moss, tuft, shrub, pine, late, spruce], ORDER = [5, 6, 4, 3, 2, 1, 0];
function sceneSVG(o){
  var x0 = o.x, y0 = o.y, w = o.w, h = o.h, s = o.sc || h / 220, rh = 14 * s, sp = o.soil || 0, gy = y0 + h - rh - sp, P = layout(o.key, w), L = o.L, out = "";
  out += sv("rect", { x:x0, y:y0, width:w, height:h, "class":"es-sky" });
  out += sv("rect", { x:x0, y:gy + sp, width:w, height:rh, "class":"es-rock" });
  if (sp > 0.2) out += sv("rect", { x:x0, y:gy, width:w, height:sp, "class":"es-soil" });
  ORDER.forEach(function(li){
    var a = clamp(L[li] || 0, 0, 1), n = Math.round(a * NS[li]); if (!n) return;
    for (var i = 0; i < n; i++) { var p = P[li][i], g = 0.65 + 0.35 * a; out += DRAW[li](x0 + 6 + p.x * (w - 12), gy, s * p.s * (li >= 4 ? g : 1)); }
  });
  return out;
}
function soilPx(cm, s){ return cm > 0 ? (3 + cm * 1.12) * (s || 1) : 0; }

// Plant layers per table row (drawing only; every number students read comes from content.explore.model)
var LAY = {
  rock:[[0,0,0,0,0,0,0], [.5,0,0,0,0,0,0], [1,.4,0,0,0,0,0], [.8,1,0,0,0,0,0], [.6,.8,.4,0,0,0,0], [.5,.6,.7,0,0,0,0], [.4,.5,1,0,0,0,0],
    [.3,.4,1,.3,0,0,0], [.2,.3,.8,.7,0,0,0], [.2,.3,.7,1,0,0,0], [.1,.2,.6,1,.3,0,0], [.1,.2,.5,.8,.7,0,0], [0,.2,.4,.6,1,0,0],
    [0,.2,.3,.5,1,.2,0], [0,.2,.3,.4,.9,.4,0], [0,.2,.2,.4,.7,.6,0], [0,.2,.2,.3,.6,.8,0], [0,.2,.1,.3,.4,1,0], [0,.2,.1,.2,.3,1,0],
    [0,.2,.1,.2,.2,1,0], [0,.2,.1,.2,.2,1,0]],
  field:[[0,0,.15,0,0,0,0], [0,0,1,0,0,0,0], [0,0,.9,.6,0,0,0], [0,0,.7,1,.4,0,0], [0,0,.5,.8,.8,0,0], [0,0,.4,.6,1,.2,0],
    [0,.1,.3,.5,1,.3,0], [0,.1,.3,.4,.9,.4,0], [0,.1,.2,.4,.7,.6,0], [0,.1,.2,.3,.6,.8,0], [0,.2,.1,.3,.4,1,0], [0,.2,.1,.2,.3,1,0],
    [0,.2,.1,.2,.3,1,0], [0,.2,.1,.2,.2,1,0], [0,.2,.1,.2,.2,1,0], [0,.2,.1,.2,.2,1,0]]
};
var FIRE_L = { stay:[0,.1,.5,.4,1,0,0], fail:[0,0,1,.9,0,0,0], fade:[0,.3,.1,.2,.15,0,1] };

// ---------- @component miniGraph — small line graph traced up to the current year, with a year marker (module 45) ----------
var GW = 200, GH = 126, GL = 32, GR = 192, GT = 24, GB = 98;
var YMAX = { rock:[30, 50, 250, 100], field:[40, 50, 250, 100] };
function miniSVG(title, rows, col, idx, ymax, glow){
  var maxX = rows[rows.length - 1][0], h = "";
  function X(v){ return GL + (GR - GL) * v / maxX; } function Y(v){ return GB - (GB - GT) * v / ymax; }
  h += sv("rect", { x:0.75, y:0.75, width:GW - 1.5, height:GH - 1.5, rx:6, "class":glow ? "es-gbox es-glow" : "es-gbox" });
  h += txt(6, 15, title, "es-gt");
  [0, ymax / 2, ymax].forEach(function(v){ h += sv("line", { x1:GL, y1:Y(v), x2:GR, y2:Y(v), "class":"es-grid" }) + txt(GL - 4, Y(v) + 3.5, MV.num(v), "es-tk", "end"); });
  [0, maxX / 2, maxX].forEach(function(v){ h += txt(X(v), GB + 12, MV.num(v), "es-tk", v === 0 ? "start" : v === maxX ? "end" : "middle"); });
  h += txt((GL + GR) / 2, GH - 3, "years", "es-tk", "middle");
  h += sv("path", { d:"M" + GL + " " + GT + " V" + GB + " H" + GR, "class":"es-ax" });
  var pts = rows.slice(0, idx + 1).map(function(r){ return f1(X(r[0])) + "," + f1(Y(r[col])); });
  if (pts.length > 1) h += sv("polyline", { points:pts.join(" "), "class":"es-gl" });
  var r = rows[idx];
  h += sv("line", { x1:X(r[0]), y1:GT, x2:X(r[0]), y2:GB, "class":"es-gm" }) + sv("circle", { cx:X(r[0]), cy:Y(r[col]), r:3.6, "class":"es-gd" });
  return h;
}

// ---------- @component fireStrip — 400-year strip: fires as flame icons (--ink, labelled), the dominant tree type between them ----------
function outcome(I){ return I < 20 ? "fail" : I <= 90 ? "stay" : "fade"; }
function fireBands(I){
  var starts = [0], t, out = [];
  for (t = I; t < 400; t += I) starts.push(t);
  starts.forEach(function(s, k){
    var e = k + 1 < starts.length ? starts[k + 1] : 400;
    if (I < 20) out.push({ s:s, e:e, ty:k === 0 ? "pine" : "shrub" });
    else if (I <= 90) out.push({ s:s, e:e, ty:"pine" });
    else if (k === 0) { out.push({ s:s, e:Math.min(e, s + 90), ty:"pine" }); if (e > s + 90) out.push({ s:s + 90, e:e, ty:"spruce" }); }
    else out.push({ s:s, e:e, ty:"spruce" });
  });
  var merged = [];
  out.forEach(function(b){ var m = merged[merged.length - 1]; if (m && m.ty === b.ty) m.e = b.e; else merged.push({ s:b.s, e:b.e, ty:b.ty }); });
  return { fires:starts.slice(1), bands:out, merged:merged };
}
function flame(x, y, s){ s = s || 1; return sv("path", { d:"M" + f1(x) + " " + f1(y - 12 * s) + " C" + f1(x + 6 * s) + " " + f1(y - 6 * s) + " " + f1(x + 5 * s) + " " + f1(y) + " " + f1(x) + " " + f1(y) + " C" + f1(x - 5 * s) + " " + f1(y) + " " + f1(x - 6 * s) + " " + f1(y - 6 * s) + " " + f1(x) + " " + f1(y - 12 * s) + " Z", "class":"es-flame" }); }
function fireSVG(I, names){
  var F = fireBands(I), X0 = 16, X1 = 504, h = "";
  function X(v){ return X0 + (X1 - X0) * v / 400; }
  F.bands.forEach(function(b){ h += sv("rect", { x:X(b.s), y:34, width:Math.max(0.5, X(b.e) - X(b.s)), height:40, "class":"es-b-" + b.ty }); });
  F.merged.forEach(function(b){ var w = X(b.e) - X(b.s); if (w > 74) h += txt((X(b.s) + X(b.e)) / 2, 58, names[b.ty], "es-bt" + (b.ty === "spruce" ? " es-bt-on" : ""), "middle"); });
  h += flame(X(0), 30, 0.9);
  F.fires.forEach(function(t){ h += flame(X(t), 30, 0.9); });
  [0, 100, 200, 300, 400].forEach(function(v){ h += sv("line", { x1:X(v), y1:74, x2:X(v), y2:79, "class":"es-ax" }) + txt(X(v), 91, String(v), "es-tk", v === 0 ? "start" : v === 400 ? "end" : "middle"); });
  h += txt(260, 104, "years", "es-tk", "middle");
  h += txt(X0, 12, "fire every " + I + " years", "es-gt");
  return h;
}

// ---------- Explore: Succession time-lapse ----------
function explore(host, api){
  var C = api.content, S = api.S, M = C.model, FI = C.fire;
  if (!S.mode) S.mode = "rock";
  S.idx = S.idx || { rock:0, field:0 };
  if (S.fi == null) S.fi = 50;
  var timer = null, busy = false, glow = -1, both = null;
  host.innerHTML = '<div class="pg es-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="es-stage"><svg id="es-land" viewBox="0 0 520 230" role="img" focusable="false"></svg></div>' +
    '<p class="es-cap" id="es-cap" aria-live="polite"></p>' +
    '<div class="es-graphs" id="es-graphs"></div><div class="es-strip" id="es-stripw"><svg id="es-strip" viewBox="0 0 520 108" role="img" focusable="false"></svg>' +
    '<p class="tiny es-key"><span><i class="es-sw es-b-pine"></i>' + FI.bands.pine + '</span><span><i class="es-sw es-b-spruce"></i>' + FI.bands.spruce + '</span><span><i class="es-sw es-b-shrub"></i>' + FI.bands.shrub + '</span><span><svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">' + flame(7, 13, 1) + "</svg> fire</span></p>" +
    '<p class="tiny es-rules" id="es-rules"></p></div></div>' +
    '<div class="pg-ctrl"><div id="es-start"></div>' +
    '<div id="es-yrw"><label class="slider"><span class="slider-top"><span>Years</span><output id="es-yro"></output></span><input type="range" id="es-yr" min="0" step="1"></label>' +
      '<div class="es-play"><button type="button" class="btn primary sm" id="es-pl" data-k="espl">Play</button><button type="button" class="btn ghost sm" id="es-st" data-k="esst">Step</button></div></div>' +
    '<div id="es-fiw"><label class="slider"><span class="slider-top"><span>Fire interval</span><output id="es-fio"></output></span><input type="range" id="es-fi" min="10" max="200" step="10"></label></div></div>' +
    '<div class="pg-read"><dl class="read es-read" id="es-read" aria-live="polite"></dl><button type="button" class="btn ghost sm es-morebtn" id="es-more" data-k="esmore" aria-expanded="false">More</button>' +
    '<p class="tiny es-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div></div>";
  var land = $("#es-land", host), yr = $("#es-yr", host), fi = $("#es-fi", host), readEl = $("#es-read", host), capEl = $("#es-cap", host);
  $("#es-rules", host).textContent = FI.rules;
  var startR = radios($("#es-start", host), { label:"Start", key:"st", options:C.starts.map(function(s){ return { id:s[0], t:s[1] }; }), value:S.mode, onChange:function(v){ stopPlay(); S.mode = v; glow = -1; both = null; api.save(); paint(); capEl.textContent = ""; MV.changed(); } });

  function rows(){ return M[S.mode] || M.rock; }
  function idx(){ return clamp(S.idx[S.mode] || 0, 0, rows().length - 1); }
  function row(){ return rows()[idx()]; }
  function setIdx(i){ S.idx[S.mode] = clamp(i, 0, rows().length - 1); }

  function paintScene(){
    var h, aria;
    if (S.mode === "fire") {
      var oc = outcome(S.fi);
      h = sceneSVG({ x:0, y:0, w:520, h:230, L:FIRE_L[oc], soil:soilPx(12), key:"fire" });
      h += txt(10, 20, "Long run, fire every " + S.fi + " years", "es-lt");
      aria = "Boreal landscape, fire every " + S.fi + " years. " + FI.outcomes[oc];
    } else {
      var r = row(), L = LAY[S.mode][idx()];
      h = sceneSVG({ x:0, y:0, w:520, h:230, L:L, soil:soilPx(r[2]), key:S.mode });
      h += txt(10, 20, r[1], "es-lt") + txt(510, 20, "Year " + r[0], "es-lt", "end");
      if (r[2] > 0) h += txt(510, 230 - 14 - soilPx(r[2]) / 2 + 4, "soil " + MV.num(r[2]) + " cm", "es-st", "end");
      aria = (S.mode === "rock" ? "Bare rock (primary)" : "Abandoned field (secondary)") + ", year " + r[0] + ": " + r[1] + ". Soil " + MV.num(r[2]) + " cm deep.";
    }
    land.innerHTML = h; land.setAttribute("aria-label", aria);
  }
  function paintGraphs(){
    var box = $("#es-graphs", host); if (S.mode === "fire") { box.innerHTML = ""; return; }
    var R = rows(), i = idx(), r = R[i];
    box.innerHTML = C.graphs.map(function(g, gi){
      var title = g[0] + " (" + g[1] + ")";
      return '<svg viewBox="0 0 ' + GW + " " + GH + '" role="img" focusable="false" aria-label="' + MV.esc(title + " against years, traced from year 0 to year " + r[0] + ": now " + MV.num(r[gi + 2]) + " " + g[1] + ".") + '">' + miniSVG(title, R, gi + 2, i, YMAX[S.mode][gi], glow === gi) + "</svg>";
    }).join("");
  }
  function paintStrip(){
    var st = $("#es-strip", host);
    st.innerHTML = fireSVG(S.fi, FI.bands);
    var F = fireBands(S.fi);
    st.setAttribute("aria-label", "400-year strip with a fire every " + S.fi + " years (" + F.fires.length + " fires after the first). Between fires: " + F.merged.map(function(b){ return FI.bands[b.ty] + " from year " + b.s + " to " + b.e; }).join("; ") + ".");
  }
  function lightBar(v){ return '<span class="es-lbar" aria-hidden="true"><i style="width:' + v + '%"></i></span>'; }
  function paintRead(){
    var h;
    if (S.mode === "fire") {
      var oc = outcome(S.fi);
      h = MV.readoutHTML([["Fire interval", S.fi + " years"], ["Fire cycle outcome", "“" + FI.short[oc] + "”"]]);
    } else {
      var r = row();
      h = '<div class="es-x"><dt>Year</dt><dd>' + r[0] + "</dd></div>" +
        "<div><dt>Stage</dt><dd>" + r[1] + "</dd></div>" +
        "<div><dt>Soil depth</dt><dd>" + MV.num(r[2]) + " cm</dd></div>" +
        "<div><dt>Plant species</dt><dd>" + r[3] + " per 100 m²</dd></div>" +
        '<div class="es-x"><dt>Biomass</dt><dd>' + MV.num(r[4]) + " t/ha</dd></div>" +
        '<div class="es-x"><dt>Light at ground</dt><dd>' + r[5] + "% of full sun " + lightBar(r[5]) + "</dd></div>";
    }
    readEl.innerHTML = h;
    $("#es-more", host).hidden = S.mode === "fire";
  }
  function paintCtrl(){
    var fire = S.mode === "fire", R = rows();
    startR.set(S.mode);
    $("#es-yrw", host).hidden = fire; $("#es-fiw", host).hidden = !fire;
    $("#es-graphs", host).hidden = fire; $("#es-stripw", host).hidden = !fire;
    if (!fire) {
      yr.max = R.length - 1; yr.value = idx();
      var y = R[idx()][0];
      $("#es-yro", host).textContent = "Year " + y; yr.setAttribute("aria-valuetext", "Year " + y);
      yr.disabled = busy; $("#es-st", host).disabled = busy || idx() >= R.length - 1; $("#es-pl", host).disabled = busy;
      $("#es-pl", host).textContent = timer ? "Pause" : "Play";
    }
    fi.value = S.fi; fi.disabled = busy; $("#es-fio", host).textContent = S.fi + " years"; fi.setAttribute("aria-valuetext", S.fi + " years");
    startR.disable(busy);
  }
  function paint(){ paintCtrl(); paintScene(); paintGraphs(); if (S.mode === "fire") paintStrip(); paintRead(); }

  function stopPlay(){ if (timer) { clearInterval(timer); timer = null; } }
  function tick(){
    if (idx() >= rows().length - 1) { stopPlay(); paint(); return; }
    setIdx(idx() + 1); api.save(); paint(); MV.changed();
    if (idx() >= rows().length - 1) { stopPlay(); paintCtrl(); }
  }
  yr.addEventListener("input", function(){ stopPlay(); glow = -1; setIdx(+yr.value); api.save(); paint(); MV.changed(); });
  fi.addEventListener("input", function(){ S.fi = +fi.value; api.save(); paint(); MV.changed(); });
  $("#es-pl", host).addEventListener("click", function(){
    if (busy) return;
    if (timer) { stopPlay(); paintCtrl(); return; }
    glow = -1;
    if (idx() >= rows().length - 1) { setIdx(0); api.save(); paint(); MV.changed(); }
    timer = setInterval(tick, 650); paintCtrl();
  });
  $("#es-st", host).addEventListener("click", function(){ if (busy) return; stopPlay(); glow = -1; tick(); });
  $("#es-more", host).addEventListener("click", function(e){ var on = !host.classList.contains("es-moreon"); host.classList.toggle("es-moreon", on); e.currentTarget.setAttribute("aria-expanded", String(on)); e.currentTarget.textContent = on ? "Less" : "More"; });
  paint();

  function yIndex(mode, y){ var R = M[mode]; for (var i = 0; i < R.length; i++) if (R[i][0] === y) return i; return 0; }
  function chal(id){
    var c = byId(C.challenges, id), W = c.wrong, y;
    if (id === "tc1") {
      if (S.mode !== "rock") return { ok:false, msg:W.mode };
      y = row()[0];
      if (y === 100) return { ok:true };
      if (y > 100) return { ok:false, msg:W.late };
      return { ok:false, msg:W.y75 };
    }
    if (id === "tc2") {
      if (S.mode !== "field") return { ok:false, msg:W.mode };
      y = row()[0];
      if (y === 40) return { ok:true };
      if (y === 150) return { ok:false, msg:W.end };
      if (y === 30 || y === 50) return { ok:false, msg:W.near };
      return { ok:false, msg:W.other };
    }
    if (id === "tc3") {
      if (S.mode !== "fire") return { ok:false, msg:W.mode };
      var I = S.fi;
      if (I >= 60 && I <= 90) return { ok:true };
      if (I < 20) return { ok:false, msg:W.i10 };
      if (I < 60) return { ok:false, msg:W.young };
      return { ok:false, msg:W.old };
    }
    return { ok:false };
  }

  return {
    predict:{
      start:function(p){
        stopPlay(); glow = -1;
        S.mode = p.start.mode; setIdx(yIndex(p.start.mode, p.start.yr));
        if (p.both) S.idx.field = 0;
        api.save(); paint(); capEl.textContent = ""; MV.changed();
      },
      run:function(p, done){
        stopPlay(); busy = true; paintCtrl();
        var once = false;
        function fin(){ if (once) return; once = true; busy = false; api.save(); paint(); capEl.textContent = MV.plain(p.reveal); MV.changed(); MV.wait(300, done); }
        function sweep(mode, toY, dur, next){
          S.mode = mode; var from = idx(), to = yIndex(mode, toY), last = -1;
          paint();
          MV.tween({ dur:dur, step:function(k){ var i = Math.round(lerp(from, to, k)); if (i !== last) { last = i; setIdx(i); paint(); } }, done:function(){ setIdx(to); paint(); next(); } });
        }
        if (p.both) {
          S.idx.rock = 0; S.idx.field = 0;
          sweep("field", 40, 1600, function(){ capEl.textContent = "Abandoned field: pioneer trees at year 30–40."; sweep("rock", 275, 2400, fin); });
        } else {
          if (p.glow != null) glow = p.glow;
          sweep(S.mode, p.to, p.to > 100 ? 2600 : 900, fin);
        }
      }
    },
    challenge:chal
  };
}

// ---------- @component coneSVG — jack pine cone: resin-sealed scales open with heat and seeds fall (k = 0 closed … 1 open) ----------
function coneSVG(cx, cy, k, label){
  var h = "", gy = cy + 66, i;
  h += sv("line", { x1:cx, y1:cy - 46, x2:cx, y2:cy - 60, "class":"es-trunk" });
  h += sv("ellipse", { cx:cx, cy:cy, rx:13, ry:42, "class":"es-cbody" });
  for (i = 0; i < 6; i++) {
    var yy = cy - 32 + i * 13, w = 17 - Math.abs(i - 2.5) * 2.2, a = lerp(-12, 38, k);
    h += sv("ellipse", { cx:w / 2, cy:0, rx:w / 2, ry:4.5, transform:"translate(" + cx + " " + f1(yy) + ") rotate(" + f1(a) + ")", "class":"es-scale" });
    h += sv("ellipse", { cx:w / 2, cy:0, rx:w / 2, ry:4.5, transform:"translate(" + cx + " " + f1(yy) + ") rotate(" + f1(180 - a) + ")", "class":"es-scale" });
    if (k < 0.6) h += sv("circle", { cx:cx + (i % 2 ? 9 : -9), cy:yy + 3, r:2.2, "class":"es-resin", opacity:f1(1 - k / 0.6) });
  }
  var drop = seg(k, 0.45, 1);
  if (k > 0.4) for (i = 0; i < 5; i++) {
    var sx = cx + (i - 2) * 13, sy = lerp(cy - 10 + (i % 3) * 12, gy - 3, drop);
    h += sv("ellipse", { cx:sx, cy:sy, rx:4, ry:2, "class":"es-seed" }) + sv("path", { d:"M" + f1(sx + 3) + " " + f1(sy) + " q6 -4 10 -1", "class":"es-wing" });
  }
  h += sv("line", { x1:cx - 60, y1:gy, x2:cx + 60, y2:gy, "class":"es-ground" });
  if (label) h += txt(cx, gy + 16, label, "es-lt", "middle");
  return h;
}

// ---------- Part 3: Disturbance and recovery ----------
function part3(host, api){
  var C = api.content, S = api.S, K = C.cone, D = C.sudbury, X = C.compare;
  if (S.open == null) S.open = false;
  var busy = false;
  function tbl(head, rows, cap){ return '<div class="tbl-wrap"><table class="es-tbl"><caption class="vh">' + cap + "</caption><thead><tr>" + head.map(function(c){ return '<th scope="col">' + c + "</th>"; }).join("") + "</tr></thead><tbody>" +
    rows.map(function(r){ return '<tr><th scope="row">' + r[0] + "</th>" + r.slice(1).map(function(c){ return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>"; }
  host.innerHTML = '<div class="es-p3">' +
    '<div class="es-stn"><h3>' + K.title + "</h3>" + (MV.reduceMotion ? "" : "<p>" + K.how + "</p>") + '<div class="es-cone"><svg id="es-cone" viewBox="0 0 300 190" role="img" focusable="false"></svg></div>' +
      (MV.reduceMotion ? "" : '<div class="q-actions" id="es-cbtn"></div>') + '<p class="es-cres" id="es-cres" aria-live="polite"></p>' +
      '<details class="alg" open><summary>' + K.panel + "</summary>" + tbl(K.head, K.rows, "Jack pine seedlings, illustrative data") + '<p class="tiny"><span class="bio-model">Illustrative</span> values for comparison only.</p><p><strong>' + K.caption + "</strong></p></details></div>" +
    '<div class="es-stn"><h3>' + D.title + ' <span class="tag">' + D.tag + "</span></h3><p>" + D.damage + "</p><p>" + D.recovery + "</p>" +
      '<details class="alg" open><summary>' + D.panel + "</summary>" + tbl(D.head, D.rows, "Sudbury soil and plant cover, illustrative data") + '<p class="tiny"><span class="bio-model">Illustrative</span> values, rounded.</p>' +
      '<p class="es-q"><strong>' + D.q + '</strong></p><div class="q-actions"><button type="button" class="btn ghost sm" id="es-sa" data-k="essa" aria-expanded="false">' + D.show + '</button></div><p class="es-ans" id="es-ans" hidden>' + D.a + "</p></details></div>" +
    '<div class="es-stn"><h3>' + X.title + '</h3><div class="es-cmp">' + X.cols.map(function(c){ return '<div class="es-cc"><h4>' + c.h + "</h4><ul>" + c.items.map(function(t){ return "<li>" + t + "</li>"; }).join("") + "</ul></div>"; }).join("") + "</div><p>" + X.both + "</p></div></div>";

  var svg = $("#es-cone", host);
  function draw(k){ svg.innerHTML = coneSVG(150, 82, k) + (k > 0 && k < 1 && busy ? flame(130, 178, 1.3) + flame(150, 178, 1.6) + flame(170, 178, 1.3) : ""); }
  function aria(){ svg.setAttribute("aria-label", MV.reduceMotion ? "Two jack pine cones. Left, closed: resin seals the scales shut. Right, open after a fire’s heat: the scales spread and winged seeds fall to the ground." : S.open ? "An open jack pine cone: the scales spread and winged seeds lie on the burned ground." : "A closed jack pine cone, its scales sealed with resin drops."); }
  function paintBtn(){
    var b = $("#es-cbtn", host); if (b) MV.keepFocus(b, function(){ b.innerHTML = '<button type="button" class="btn ' + (S.open ? "ghost" : "primary") + ' sm" data-k="escone" id="es-heat"' + (busy ? " disabled" : "") + ">" + (S.open ? K.reset : K.heat) + "</button>"; });
    $("#es-cres", host).textContent = MV.reduceMotion ? K.closed + " " + K.open : busy ? "" : (S.open ? K.open : K.closed);
  }
  if (MV.reduceMotion) { svg.innerHTML = coneSVG(78, 78, 0, "Closed") + coneSVG(222, 78, 1, "Open"); }
  else {
    $("#es-cbtn", host).addEventListener("click", function(e){
      var b = e.target.closest("button"); if (!b || b.disabled) return;
      if (S.open) { S.open = false; api.save(); draw(0); aria(); paintBtn(); return; }
      S.open = true; api.save(); busy = true; paintBtn();
      MV.tween({ dur:2200, step:function(k){ draw(k); }, done:function(){ busy = false; draw(1); aria(); paintBtn(); } });
    });
    draw(S.open ? 1 : 0);
  }
  aria(); paintBtn();
  $("#es-sa", host).addEventListener("click", function(e){ var a = $("#es-ans", host), on = a.hidden; a.hidden = !on; e.currentTarget.setAttribute("aria-expanded", String(on)); e.currentTarget.textContent = on ? "Hide the answer" : D.show; });
}

// ---------- Practice: Glacier data detective (custom: chips with feedback on each tap, plus one number entry) ----------
function glacier(host, api, a){
  var S = api.S; S.items = S.items || {};
  function ist(id){ return S.items[id] || (S.items[id] = { tries:0, hint:0, solved:false, first:null, val:"" }); }
  var tb = '<div class="tbl-wrap"><table class="es-tbl"><caption class="vh">Glacier sites, model data</caption><thead><tr>' + a.head.map(function(c){ return '<th scope="col">' + c + "</th>"; }).join("") + "</tr></thead><tbody>" +
    a.rows.map(function(r){ return '<tr><th scope="row">' + r[0] + "</th>" + r.slice(1).map(function(c){ return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
  host.innerHTML = (a.how ? '<p class="how">' + a.how + "</p>" : "") + "<p>" + a.context + "</p>" + tb + '<p class="tiny"><span class="bio-model">Model data</span> simplified values for one imagined glacier valley.</p>' +
    a.items.map(function(it){ return '<div class="q" data-gq="' + it.id + '"></div>'; }).join("");
  function paintQ(it, i){
    var x = ist(it.id), box = $('[data-gq="' + it.id + '"]', host);
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">D' + (i + 1) + '</span><div class="q-prompt">' + (it.star ? '<span class="tag">★</span> ' : "") + it.prompt + "</div></div>";
    if (it.kind === "chips") {
      var order = it.id === "d1" ? it.chips.map(function(c, j){ return j; }) : MV.shuffle(it.chips.map(function(c, j){ return j; }), "es" + it.id);
      h += '<div class="chips" role="group" aria-label="Choices for D' + (i + 1) + '">' + order.map(function(j){ var c = it.chips[j], on = x.pick === j; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-gc="' + j + '" data-k="gc' + it.id + j + '"' + (x.solved ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
      if (it.hints && !x.solved) h += '<div class="q-actions">' + MV.hintBtn(it.id + "hint", x.hint) + "</div>";
      h += MV.hintsHTML(it.hints, x.hint);
      if (x.pick != null) { var c = it.chips[x.pick], ok = MV.ok(c); h += MV.fbHTML(ok ? "good" : "bad", "<strong>" + (ok ? "✓ Correct." : "✗ Not quite.") + "</strong> " + c.fb + (ok ? "" : " Try another.")); }
    } else {
      h += '<div class="numrow"><label for="es-n' + it.id + '">Your answer</label><input class="numin" id="es-n' + it.id + '" data-gn="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.val || "") + '"' + (x.solved ? " disabled" : "") + "><span>" + it.unit + "</span></div>";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>";
      h += MV.hintsHTML(it.hints, x.hint);
      if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + it.display + ". " + it.why);
      else if (x.msg) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + x.msg);
    }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  function judgeNum(it, raw){
    var v = MV.parseNum(raw);
    if (!v) return { ok:false, msg:String(raw || "").trim() ? "Type a number, such as 0.5." : "Type your answer first." };
    v = v[0];
    if (Math.abs(v - MV.ans(it)) < 1e-6) return { ok:true };
    var w = (it.wrong || []).filter(function(r){ return Math.abs(r.match - v) < 1e-6; })[0];
    return { ok:false, msg:w ? w.fb : "Change in soil ÷ change in time, between sites C and D." };
  }
  host.addEventListener("input", function(e){ var n = e.target.closest("[data-gn]"); if (!n) return; ist(n.dataset.gn).val = n.value; api.save(); });
  host.addEventListener("keydown", function(e){ var n = e.target.closest("[data-gn]"); if (n && e.key === "Enter") { e.preventDefault(); var b = n.closest(".q").querySelector('[data-act="check"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-gq]"); if (!box) return;
    var it = byId(a.items, box.dataset.gq), i = a.items.indexOf(it), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintQ(it, i); MV.changed(); return; }
    if (b.dataset.gc != null) {
      var j = +b.dataset.gc; x.pick = j;
      if (MV.ok(it.chips[j])) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
    } else if (b.dataset.act === "check") {
      var r = judgeNum(it, x.val);
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; x.msg = null; } else { if (MV.parseNum(x.val)) x.tries++; x.msg = r.msg; }
    } else return;
    api.save(); paintQ(it, i); MV.focusFb(box); MV.changed();
  });
  a.items.forEach(paintQ);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Plan a regreening (yes/no toggles, tree chips, 10-year preview strip) ----------
var task = (function(){
  var api = null, T = null;
  function st(){ var s = api.S; s.trees = s.trees || {}; return s; }
  function read(){
    if (!api) return { lime:null, grass:null, trees:[] };
    var s = st();
    return { lime:s.lime == null ? null : s.lime === "y", grass:s.grass == null ? null : s.grass === "y", trees:T.trees.filter(function(t){ return s.trees[t[0]]; }).map(function(t){ return t[0]; }) };
  }
  function name(id){ var t = T.trees.filter(function(x){ return x[0] === id; })[0]; return t ? t[1] : id; }
  function pioneer(id){ var t = T.trees.filter(function(x){ return x[0] === id; })[0]; return t && t[2] === 1; }
  function lab(k){ return k.split("+").map(name).join(" + "); }
  function draw(){
    var d = read(), svg = $("#es-tsvg"); if (!svg) return;
    var w = 520, h = 190, gy = 150, out = "", i, lime = d.lime === true, grass = d.grass === true;
    out += sv("rect", { x:0, y:0, width:w, height:h, "class":"es-sky" });
    out += sv("rect", { x:0, y:gy, width:w, height:h - gy, "class":lime ? "es-soil" : "es-burnt" });
    if (!grass) for (i = 0; i < 6; i++) out += sv("path", { d:"M" + (40 + i * 85) + " " + gy + " l8 14 l-5 10", "class":"es-gully" });
    if (grass) for (i = 0; i < (lime ? 24 : 6); i++) out += tuft(12 + i * (lime ? 21 : 84), gy, lime ? 1 : 0.6);
    var n = d.trees.length;
    d.trees.forEach(function(id, ti){
      var good = pioneer(id) && lime && grass, s = good ? 1 : pioneer(id) && lime ? 0.7 : 0.4;
      for (var j = 0; j < 2; j++) {
        var x = 30 + (ti * 2 + j + 0.5) * (460 / Math.max(2, n * 2));
        out += (id === "jack" || id === "red" ? spruce(x, gy, s * 0.75) : id === "hemlock" ? spruce(x, gy, s * 0.55) : id === "maple" ? late(x, gy, s * 0.5) : pine(x, gy, s));
      }
    });
    out += txt(10, 18, "Your site after 10 years (model)", "es-lt");
    if (!lime) out += txt(510, 18, "acidic soil", "es-lt", "end");
    svg.innerHTML = out;
    var lines = [];
    lines.push(d.lime == null ? "Choose whether to spread limestone." : lime ? "Limestone raised the soil pH, so plants can grow." : "The soil is still very acidic: few plants survive.");
    lines.push(d.grass == null ? "Choose whether to sow grasses and legumes." : grass ? (lime ? "Grasses and legumes cover and hold the soil and add nitrogen." : "Grasses and legumes struggle in the acidic soil.") : "Bare soil washes away between the young trees.");
    if (!n) lines.push("No trees planted yet.");
    else {
      var p = d.trees.filter(pioneer), l = d.trees.filter(function(id){ return !pioneer(id); });
      if (p.length) lines.push(p.map(name).join(", ") + (lime && grass ? " grow well in the open sun." : " grow slowly in the poor soil."));
      if (l.length) lines.push(l.map(name).join(", ") + " struggle on the open, poor ground.");
    }
    svg.setAttribute("aria-label", "Preview of the site after 10 years. " + lines.join(" "));
    $("#es-tread").innerHTML = lines.map(function(t){ return "<li>" + t + "</li>"; }).join("");
  }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; var s = st();
      inp.innerHTML = '<div class="es-tin"><div id="es-tl"></div><div id="es-tg"></div><div class="es-ttrees"><p class="rg-lab" id="es-ttl">Trees to plant (any combination)</p><div class="chips" role="group" aria-labelledby="es-ttl" id="es-tt"></div></div></div>';
      function upd(){ a.save(); draw(); a.update(); }
      var yn = [{ id:"y", t:"Yes" }, { id:"n", t:"No" }];
      radios($("#es-tl"), { label:"Spread crushed limestone?", key:"tl", options:yn, value:s.lime == null ? "" : s.lime, onChange:function(v){ s.lime = v; upd(); } });
      radios($("#es-tg"), { label:"Sow grasses and legumes first?", key:"tg", options:yn, value:s.grass == null ? "" : s.grass, onChange:function(v){ s.grass = v; upd(); } });
      var tt = $("#es-tt");
      function paintTrees(){ MV.keepFocus(tt, function(){ tt.innerHTML = T.trees.map(function(t){ var on = !!s.trees[t[0]]; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-tr="' + t[0] + '" data-k="tr' + t[0] + '">' + t[1] + "</button>"; }).join(""); }); }
      tt.addEventListener("click", function(e){ var b = e.target.closest("[data-tr]"); if (!b) return; s.trees[b.dataset.tr] = !s.trees[b.dataset.tr]; paintTrees(); upd(); });
      paintTrees();
      pv.innerHTML = '<div class="es-tpv"><h4>Preview: the site after 10 years</h4><div class="es-stage"><svg id="es-tsvg" viewBox="0 0 520 190" role="img" focusable="false"></svg></div><ul class="es-tread" id="es-tread" aria-live="polite"></ul></div>';
      draw();
    },
    read:read,
    valid:function(d){ return d.lime == null || d.grass == null ? "Answer both yes/no questions first." : true; },
    checks:function(d){ return [d.lime === true, d.grass === true, d.trees.length >= 2, d.trees.every(pioneer)]; },
    key:function(d){ return d.trees.join("+"); },
    label:lab,
    text:lab
  };
})();

// ---------- hero: five panels fill in as the year counter runs 0 → 500; a fire resets the forest panel to grasses ----------
function hero(f){
  var box = $("#es-hero"); if (!box) return;
  var cap = f && f.cap, last = -1;
  box.innerHTML = '<svg viewBox="0 0 520 196" aria-hidden="true" focusable="false"></svg>';
  var svg = $("svg", box);
  var NAMES = ["bare rock", "lichens and mosses", "grasses", "shrubs", "forest"];
  var PL = [[0,0,0,0,0,0,0], [1,.9,0,0,0,0,0], [.3,.5,1,0,0,0,0], [0,.3,.7,1,0,0,0], [0,.2,.2,.4,.6,1,0]];
  var SOIL = [0, 1, 3, 7, 22];
  var CAPS = ["Bare rock: no soil at all.", "Pioneer lichens and mosses start making soil.", "As soil deepens, grasses, then shrubs, then trees move in.", "A fire resets the forest: soil survives, so grasses return fast (secondary succession)."];
  function setCap(i){ if (cap && i !== last) { cap.textContent = CAPS[i]; last = i; } }
  function frame(T){
    var out = "", pw = 100, ph = 150, year = Math.round(500 * seg(T, 0.2, 8)), sc = 0.62;
    for (var i = 0; i < 5; i++) {
      var x = 4 + i * 103, a = i === 0 ? 1 : seg(T, 0.2 + (i - 1) * 1.9, 0.2 + i * 1.9), L, soil;
      if (i === 4 && T >= 8.7) { L = [0, .3, 1, .4, 0, 0, 0]; soil = SOIL[4]; }
      else { L = PL[i].map(function(v){ return v * a; }); soil = SOIL[i] * a; }
      out += '<g clip-path="url(#es-hc' + i + ')">' + sceneSVG({ x:x, y:26, w:pw, h:ph, L:L, soil:soilPx(soil, 0.7), key:"h" + i, sc:sc }) + "</g>";
      out += sv("rect", { x:x, y:26, width:pw, height:ph, "class":"es-pframe" });
      out += txt(x + pw / 2, 192, NAMES[i], "es-hl", "middle");
    }
    out = "<defs>" + [0, 1, 2, 3, 4].map(function(i){ return '<clipPath id="es-hc' + i + '"><rect x="' + (4 + i * 103) + '" y="26" width="100" height="150"/></clipPath>'; }).join("") + "</defs>" + out;
    out += txt(516, 17, "Year " + year, "es-ht", "end");
    if (T >= 8 && T < 8.7) { var fl = 0.5 + 0.5 * Math.sin((T - 8) * 30); out += '<g opacity="' + f1(clamp(fl, 0, 1)) + '">' + flame(466, 130, 2.6) + "</g>"; }
    if (T >= 8.7) out += sv("rect", { x:416, y:30, width:92, height:20, rx:4, "class":"es-hbox" }) + txt(462, 44, "secondary succession", "es-hs", "middle") + flame(500, 172, 0.9);
    svg.innerHTML = out;
    setCap(T < 1.9 ? 0 : T < 3.9 ? 1 : T < 8 ? 2 : 3);
  }
  if (MV.reduceMotion) { frame(10); return; }
  frame(0);
  MV.tween({ dur:10000, ease:function(t){ return t; }, step:function(k){ frame(k * 10); }, done:function(){ frame(10); } });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ glacier:glacier },
  task:task
});
})();
