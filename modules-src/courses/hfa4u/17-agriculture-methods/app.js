// HFA4U 17 Conventional, Organic, GMO & Sustainable Agriculture: hero (four canola fields with gauges through three seasons),
// Four fields (Explore: Compare / Practice builder / Seasons, with practice toggles, field art, a readout of five model gauges,
// a resistant-weed graph with a table), What does the evidence say? (Part 3: F13 claim stations with source, strength and
// verdict chips, "Check it with data", a follow-up chip and a still-debated sort) and "Farm plan" (task: system and practices
// with live gauges, goal marks and a 5-season graph). Plan wording lives in content.mjs; this file adds only control labels
// and layout text.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc, css = MV.css;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function f1(v){ return String(Math.round(v * 10) / 10); }
function byId(list, id){ for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i]; return null; }
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : ""; }); }
function listAnd(a){ return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
function svgT(x, y, s, cls, anchor, extra){ return '<text class="' + cls + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "middle") + '"' + (extra || "") + ">" + s + "</text>"; }
function sgn(v){ return v > 0 ? "+" + v : v < 0 ? MV.MINUS + Math.abs(v) : "0"; }

// ---------- @component radioGroup (copied from HFA4U 12 / 09; per-option class, custom layout class, function labels) ----------
//   radios(host, {label, aria, options:[{id, t, cls}], value, cls:"seg"|"chips"|<custom → class ag-<custom>>, onChange}) -> {set, get, repaint}
//   Use a fresh host for every call: it adds its listeners to host.
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), kind = o.cls === "chips" ? "ag-chipset" : o.cls && o.cls !== "seg" ? "ag-" + o.cls : "seg";
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), lab = typeof o.label === "function" ? o.label() : o.label;
    host.innerHTML = '<span class="ag-rgw">' + (lab ? '<span class="ag-rgl">' + lab + "</span>" : "") + '<span class="ag-rg ' + kind + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || lab || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && i === 0) ? 0 : -1) + '" data-rg="' + x.id + '"' + (x.cls ? ' class="' + x.cls + '"' : "") + (o.disabled ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]"); if (b) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && host.contains(b) && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b || b.disabled) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); });
    var k = ids.indexOf(val); choose(ids[k < 0 ? (d > 0 ? 0 : ids.length - 1) : clamp(k + d, 0, ids.length - 1)]);
  });
  paint();
  return { set:function(id){ id = String(id == null ? "" : id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, repaint:paint,
    lock:function(on){ o.disabled = !!on; paint(); } };
}

// ---------- Four fields model (plan's exact rules; content.explore.base / effects / weeds) ----------
var PR = ["R", "IPM", "NT", "CC", "IC"], KEYS = ["y", "inp", "soil", "bio", "cost"];
var SHORT = { y:"Yield", inp:"Inputs", soil:"Soil", bio:"Biodiversity", cost:"Cost" };   // compact gauge labels (cards, hero)
function EX(){ return MV.C.explore; }
function normPr(p){ var o = {}; PR.forEach(function(k){ o[k] = !!(p && p[k]); }); return o; }
function prList(p){ return PR.filter(function(k){ return p[k]; }); }
function sysOf(id){ return byId(EX().systems, id) || EX().systems[0]; }
function prOf(id){ return byId(EX().practices, id); }
function prName(k){ var t = prOf(k).t; return k === "IPM" ? t : t.charAt(0).toLowerCase() + t.slice(1); }   // mid-sentence form
function vals(sys, p){
  var E = EX(), b = E.base[sys] || E.base.conv, v = {};
  KEYS.forEach(function(k){ v[k] = b[k]; });
  PR.forEach(function(k){ if (!p[k]) return; var e = E.effects[k === "NT" && sys === "org" ? "NTorg" : k]; KEYS.forEach(function(q){ v[q] += e[q] || 0; }); });
  KEYS.forEach(function(k){ v[k] = clamp(v[k], 0, 100); });
  if (sys === "org") v.inp = 0;
  return v;
}
function incOf(sys, p){ if (sys === "org") return 0; var W = EX().weeds, i = p.R ? W.rot : W.inc; if (p.IPM) i -= W.ipm; if (p.CC) i -= W.cc; return Math.max(0, i); }
function planText(sys, p){ var l = prList(p); return sysOf(sys).short + (l.length ? " + " + l.map(function(k){ return prOf(k).abbr; }).join(" + ") : ", no practices"); }

// ---------- @component fieldArt — schematic canola field (SVG group): canola rows (stem + flower head), intercrop rows (round
// leaves, no flower), cover-crop tufts between rows, no-till residue dashes, resistant-weed asterisks. Muted tokens; every feature
// has its own shape, so colour is never the only signal. o = {pr, g (growth 0–1), weeds (marks), bare} ----------
function fieldArt(x, y, w, h, o){
  o = o || {};
  var p = o.pr || {}, g = o.g == null ? 1 : o.g, rows = 4, k = clamp(h / 80, 0.6, 1.7), s = "";
  s += '<rect class="ag-soil" x="' + f1(x) + '" y="' + f1(y) + '" width="' + f1(w) + '" height="' + f1(h) + '" rx="' + f1(5 * k) + '"/>';
  var pad = 7 * k, top = y + pad, rh = (h - 2 * pad) / rows, n = Math.max(4, Math.round((w - 2 * pad) / (15 * k))), dx = (w - 2 * pad) / n, r, j;
  if (p.NT) for (r = 0; r <= rows; r++) for (j = 0; j < n; j++) {
    var sx = x + pad + (j + ((r * 7 + j * 3) % 5) / 5) * dx, sy = top + rh * (r + 0.05) + ((j * 5 + r) % 3) * 1.6 * k;
    if (sy > y + h - 3 * k) continue;
    s += '<path class="ag-stub" d="M' + f1(sx) + " " + f1(sy) + "l" + f1(4 * k) + " " + f1(-1.6 * k) + '"/>';
  }
  for (r = 0; r < rows; r++) {
    var ry = top + rh * (r + 0.8), ic = p.IC && r % 2 === 1;
    s += '<path class="ag-furrow" d="M' + f1(x + pad * 0.6) + " " + f1(ry) + "H" + f1(x + w - pad * 0.6) + '"/>';
    if (g <= 0) continue;
    for (j = 0; j < n; j++) {
      var px = x + pad + (j + 0.5) * dx, ht = (ic ? 7 : 11) * k * g;
      if (ic) {
        s += '<path class="ag-stem" d="M' + f1(px) + " " + f1(ry) + "v" + f1(-ht) + '"/>' +
          '<ellipse class="ag-leaf2" cx="' + f1(px - 2.6 * k * g) + '" cy="' + f1(ry - ht * 0.6) + '" rx="' + f1(2.6 * k * g) + '" ry="' + f1(1.7 * k * g) + '"/>' +
          '<ellipse class="ag-leaf2" cx="' + f1(px + 2.6 * k * g) + '" cy="' + f1(ry - ht * 0.85) + '" rx="' + f1(2.6 * k * g) + '" ry="' + f1(1.7 * k * g) + '"/>';
      } else {
        s += '<path class="ag-stem" d="M' + f1(px) + " " + f1(ry) + "v" + f1(-ht) + "M" + f1(px) + " " + f1(ry - ht * 0.45) + "l" + f1(-2.6 * k * g) + " " + f1(-2 * k * g) + '"/>';
        if (g > 0.45) s += '<circle class="ag-flower" cx="' + f1(px) + '" cy="' + f1(ry - ht) + '" r="' + f1(2.5 * k * Math.min(1, (g - 0.45) / 0.4)) + '"/>';
      }
    }
  }
  if (p.CC && g > 0) for (r = 0; r < rows; r++) {
    var cy = top + rh * (r + 0.32);
    for (j = 0; j < n; j++) {
      var cx = x + pad + (j + 0.05) * dx, ch = 4 * k * Math.min(1, g * 1.4);
      s += '<path class="ag-cover" d="M' + f1(cx - 2.4 * k) + " " + f1(cy - ch) + "L" + f1(cx) + " " + f1(cy) + "L" + f1(cx + 2.4 * k) + " " + f1(cy - ch) + "M" + f1(cx) + " " + f1(cy) + "v" + f1(-ch * 1.2) + '"/>';
    }
  }
  var wn = o.weeds | 0;
  for (j = 0; j < wn; j++) {
    var wx = x + pad + ((j * 37 + 11) % 97) / 97 * (w - 2 * pad), wy = top + ((j * 53 + 29) % 89) / 89 * (h - 2 * pad - 4 * k) + 3 * k, a = 3.4 * k;
    s += '<path class="ag-weed" d="M' + f1(wx - a) + " " + f1(wy) + "h" + f1(2 * a) + "M" + f1(wx - a * 0.7) + " " + f1(wy - a * 0.7) + "l" + f1(1.4 * a) + " " + f1(1.4 * a) + "M" + f1(wx + a * 0.7) + " " + f1(wy - a * 0.7) + "l" + f1(-1.4 * a) + " " + f1(1.4 * a) + '"/>';
  }
  return s;
}
// legend lines for the features on screen (words, so the shapes are explained)
function artLegend(p, weeds){
  var L = ["<li><svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path class=\"ag-stem\" d=\"M8 15V5\"/><circle class=\"ag-flower\" cx=\"8\" cy=\"4\" r=\"3\"/></svg>Canola</li>"];
  if (p.IC) L.push("<li><svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path class=\"ag-stem\" d=\"M8 15V6\"/><ellipse class=\"ag-leaf2\" cx=\"5\" cy=\"9\" rx=\"3\" ry=\"2\"/><ellipse class=\"ag-leaf2\" cx=\"11\" cy=\"7\" rx=\"3\" ry=\"2\"/></svg>Second crop (intercropping)</li>");
  if (p.CC) L.push("<li><svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path class=\"ag-cover\" d=\"M4 8L8 13L12 8M8 13V6\"/></svg>Cover crop between rows</li>");
  if (p.NT) L.push("<li><svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path class=\"ag-stub\" d=\"M3 11l5-2M8 13l5-2\"/></svg>Stubble left on the surface (no-till)</li>");
  if (weeds) L.push("<li><svg viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path class=\"ag-weed\" d=\"M3 8h10M4 3l8 8M12 3l-8 8\"/></svg>Resistant weeds</li>");
  return '<ul class="ag-leg">' + L.join("") + "</ul>";
}
function artDesc(sys, p, weeds){
  var L = [sysOf(sys).t + " canola field"];
  if (p.IC) L.push("every second row is a second crop");
  if (p.CC) L.push("cover crops grow between the rows");
  if (p.NT) L.push("stubble from last year covers the soil");
  if (p.R) L.push("crops change from year to year (rotation)");
  if (p.IPM) L.push("pests are monitored (IPM)");
  if (weeds) L.push(weeds + " resistant-weed marks");
  return L.join("; ") + ".";
}

// ---------- @component gaugeRows — model-index bars (--ink on --sheet) with the number; optional goal marks (task) ----------
//   gaugeHTML(v, {keys, labels, lit:[keys], goals:{key:{v, dir:"min"|"max", t}}, compact})
function gaugeHTML(v, o){
  o = o || {};
  return (o.keys || KEYS).map(function(key){
    var val = Math.round(v[key]), lab = (o.labels || SHORT)[key], gl = o.goals && o.goals[key];
    var mark = gl ? '<span class="ag-gm" style="left:' + gl.v + '%" aria-hidden="true"></span>' : "";
    var ok = gl ? (gl.dir === "min" ? val >= gl.v : val <= gl.v) : null;
    return '<div class="ag-g' + ((o.lit || []).indexOf(key) >= 0 ? " ag-lit" : "") + '"><span class="ag-gl">' + lab + (gl ? ' <span class="ag-gg">(' + gl.t + ")</span>" : "") + '</span><b class="ag-gv">' + val + (gl ? ' <span class="ag-gok">' + (ok ? "✓" : "○") + '<span class="vh">' + (ok ? " goal met" : " goal not met") + "</span></span>" : "") +
      '</b><span class="ag-gt" aria-hidden="true"><i style="width:' + clamp(val, 0, 100) + '%"></i>' + mark + "</span></div>";
  }).join("");
}

// ---------- hero (storyboard: four fields in bare soil; three seasons pass and the gauges rise and fall differently in each;
// banner "Higher yield here, healthier soil there, fewer inputs over there."; reduced motion: the final frame with numbers) ----------
var HK = ["y", "soil", "inp", "bio"], HL = { y:"Yield", soil:"Soil", inp:"Inputs", bio:"Biodiversity" };
function heroSVG(st, cols){
  var H = MV.C.hero, F = H.fields, cw = 186, chh = 182, gap = 12, rowsN = Math.ceil(F.length / cols), W = cols * cw + (cols - 1) * gap, Ht = rowsN * chh + (rowsN - 1) * gap, h = "";
  F.forEach(function(fd, i){
    var c = i % cols, r = Math.floor(i / cols), x0 = c * (cw + gap), y0 = r * (chh + gap), v = st.v[i];
    h += '<g class="ag-hf' + (st.on ? "" : " pre") + '" style="opacity:' + f1(st.op) + '">';
    h += '<rect class="ag-hcell" x="' + x0 + '" y="' + y0 + '" width="' + cw + '" height="' + chh + '" rx="8"/>';
    h += svgT(x0 + 10, y0 + 19, fd.t, "ag-ht", "start") + (fd.sub ? svgT(x0 + 10, y0 + 33, fd.sub, "ag-hs", "start") : "");
    h += fieldArt(x0 + 10, y0 + 40, cw - 20, 58, { pr:normPr((fd.pr || []).reduce(function(o, k){ o[k] = true; return o; }, {})), g:st.g });
    HK.forEach(function(key, j){
      var gy = y0 + 112 + j * 17, val = clamp(v[key], 0, 100);
      h += svgT(x0 + 10, gy + 7, HL[key], "ag-hgl", "start");
      h += '<rect class="ag-htr" x="' + (x0 + 84) + '" y="' + (gy) + '" width="70" height="8" rx="2"/><rect class="ag-hbar" x="' + (x0 + 84) + '" y="' + gy + '" width="' + f1(0.7 * val) + '" height="8" rx="2"/>';
      h += svgT(x0 + cw - 10, gy + 8, String(Math.round(val)), "ag-hgv", "end");
    });
    h += "</g>";
  });
  return { w:W, h:Ht, svg:h };
}
function hero(f){
  var host = $("#ag-hero"); if (!host) return;
  var H = MV.C.hero, F = H.fields, fin = F.map(function(fd){ var p = normPr((fd.pr || []).reduce(function(o, k){ o[k] = true; return o; }, {})); return vals(fd.sys, p); });
  host.innerHTML = '<svg class="ag-hsvg" id="ag-hsvg" role="img" aria-label="' + esc(H.aria) + '"></svg><p class="tiny muted ag-hnote">Gauges show a model index from 0 to 100. <span class="hfa-model">Model data</span></p>';
  var svg = $("#ag-hsvg"), st = { g:1, op:1, on:true, v:fin }, cap = f.cap;
  function cols(){ return (host.getBoundingClientRect().width || 400) >= 600 ? 4 : 2; }
  function draw(){ var c = cols(), r = heroSVG(st, c); svg.setAttribute("viewBox", "0 0 " + r.w + " " + r.h); svg.innerHTML = r.svg; }
  window.addEventListener("resize", draw);
  // each field's path: from 0 through three seasons that rise and fall differently (phase and size per field), ending at the model values
  function at(t){
    return fin.map(function(v, i){
      var o = {}; HK.forEach(function(key, j){ var e = clamp((t - 0.12) / 0.78, 0, 1), wob = Math.sin((e * 3 + i * 0.37 + j * 0.23) * Math.PI * 2) * (10 + 3 * ((i + j) % 3)) * (1 - e) * (e > 0 ? 1 : 0); o[key] = clamp(v[key] * MV.ease(e) + wob, 0, 100); }); return o;
    });
  }
  if (MV.reduceMotion) { draw(); if (cap) cap.textContent = H.banner; return; }
  st.g = 0; st.op = 0; st.v = at(0); draw(); if (cap) cap.textContent = "";
  MV.wait(400, function(){
    MV.tween({ dur:5200, ease:function(t){ return t; }, step:function(t){
      st.op = clamp(t / 0.08, 0, 1); st.g = clamp((t - 0.1) / 0.7, 0, 1); st.v = at(t); draw();
      if (cap) { var s = t < 0.12 ? "" : t < 0.9 ? "Season " + Math.min(3, 1 + Math.floor((t - 0.12) / 0.26)) : H.banner; if (cap.textContent !== s) cap.textContent = s; }
    }, done:function(){ st.g = 1; st.op = 1; st.v = fin; draw(); if (cap) cap.textContent = H.banner; } });
  });
}

// ---------- Explore: Four fields (module-specific simulator: modes, system, practice toggles, field art, readout, seasons graph) ----------
function explore(host, api){
  var D = api.content, S = api.S, plot = null, anim = null, busy = false;
  var fx = { lit:[], vals:null, part:null, flash:"" };
  S.mode = byId(D.modes, S.mode) ? S.mode : "compare";
  S.sys = byId(D.systems, S.sys) ? S.sys : "conv";
  S.pr = normPr(S.pr);
  S.hist = Array.isArray(S.hist) && S.hist.length ? S.hist.slice(0, D.weeds.seasons + 1).map(Number) : [0];
  S.season = S.hist.length - 1;
  S.open = S.open || {};

  host.innerHTML = '<div id="ag-mode"></div><div id="ag-sys"></div>' +
    '<div class="ag-rgw ag-prw"><span class="ag-rgl" id="ag-prl">Practices</span><div class="ag-togs" id="ag-togs" role="group" aria-labelledby="ag-prl">' + D.practices.map(function(x){
      return '<label class="ag-tog"><input type="checkbox" data-pr="' + x.id + '" data-k="agpr' + x.id + '"><span>' + x.t + (x.long ? '<span class="vh"> (' + x.long + ")</span>" : "") + "</span></label>";
    }).join("") + "</div></div>" +
    '<p class="tiny ag-crop"><strong>Crop:</strong> ' + D.crop + ' <span class="muted">· ' + D.cropNote + "</span></p>" +
    '<p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="ag-lab" data-mv="graph"><div class="ag-main">' +
      '<div id="ag-cmp" class="ag-cmp"></div>' +
      '<figure class="ag-one" id="ag-one"><svg class="ag-fsvg" id="ag-fsvg" viewBox="0 0 400 150" role="img" aria-label=""></svg><figcaption id="ag-fleg"></figcaption></figure>' +
      '<div id="ag-seas" class="ag-seas">' +
        '<div class="plot-wrap"><canvas class="plot wide" id="ag-plot" role="img" aria-label="Resistant-weed index by season"></canvas></div>' +
        '<div class="q-actions ag-run"><button type="button" class="btn primary sm" id="ag-run1" data-k="agrun1">Run 1 season</button><button type="button" class="btn sm" id="ag-run5" data-k="agrun5">Run 5 seasons</button><button type="button" class="btn ghost sm" id="ag-reset" data-k="agreset">Reset</button></div>' +
        '<p class="tiny muted" id="ag-snote"></p><div id="ag-stab"></div>' +
      "</div>" +
    '</div><div class="ag-side"><h4 class="ag-h4" id="ag-rh"></h4><dl class="read ag-read" id="ag-read" aria-live="polite"></dl><p class="tiny muted">' + D.modelNote + "</p></div></div>" +
    '<details class="alg ag-rules"><summary>How the model works</summary><div id="ag-rtab"></div></details>';

  var modeRG = radios($("#ag-mode"), { label:"Mode", options:D.modes, value:S.mode, onChange:function(v){ userChange(); S.mode = v; MV.banner("", ""); commit(); } });
  var sysRG = radios($("#ag-sys"), { label:"System", cls:"chips", options:D.systems, value:S.sys, onChange:function(v){ userChange(); S.sys = v; resetSeasons(); commit(); } });
  $("#ag-togs").addEventListener("change", function(e){ var c = e.target.closest("[data-pr]"); if (!c) return; userChange(); S.pr[c.dataset.pr] = c.checked; resetSeasons(); commit(); });
  $("#ag-run1").addEventListener("click", function(){ if (busy) return; userChange(); runSeasons(1); });
  $("#ag-run5").addEventListener("click", function(){ if (busy) return; userChange(); runSeasons(D.weeds.seasons); });
  $("#ag-reset").addEventListener("click", function(){ userChange(); resetSeasons(); commit(); });
  $("#ag-cmp").addEventListener("toggle", function(e){ var d = e.target.closest && e.target.closest("[data-info]"); if (d) { S.open[d.dataset.info] = d.open; api.save(); } }, true);

  // model tables (plan's base values and practice effects) and the resistance rule
  (function(){
    var heads = ["System"].concat(D.readouts.map(function(r){ return r.t; })), effHeads = ["Practice"].concat(D.readouts.map(function(r){ return r.t; }));
    var rows = D.systems.map(function(s){ return ["<strong>" + s.t + "</strong>"].concat(KEYS.map(function(k){ return D.base[s.id][k]; })); });
    var eff = [["R", "Crop rotation"], ["IPM", "IPM"], ["NT", "No-till, conventional or GM"], ["NTorg", "No-till, organic"], ["CC", "Cover crops"], ["IC", "Intercropping"]].map(function(e){ return [e[1]].concat(KEYS.map(function(k){ return sgn(D.effects[e[0]][k]); })); });
    var W = D.weeds;
    $("#ag-rtab").innerHTML = '<p class="tiny"><strong>Base values for canola</strong> <span class="hfa-model">' + D.modelTag + "</span></p>" + MV.tableHTML({ head:heads, rows:rows, caption:"Base values for canola, model index" }) +
      '<p class="tiny"><strong>Practice effects</strong> (added to the base; results stay between 0 and 100; organic synthetic inputs stay 0)</p>' + MV.tableHTML({ head:effHeads, rows:eff, caption:"Practice effects, model index" }) +
      '<p class="tiny"><strong>Resistant-weed index</strong> (Seasons mode; systems that rely on herbicides only): it starts at 0 and adds ' + W.inc + " each season. With crop rotation the yearly increase drops to " + W.rot + "; IPM and cover crops each take off " + W.ipm + " more (never below 0). Organic: 0. " + D.orgWeeds + "</p>";
  })();

  // ===== seasons =====
  function resetSeasons(){ S.hist = [0]; S.season = 0; fx.part = null; }
  function curIdx(){ return S.hist[S.season] || 0; }
  function runSeasons(n, cb){
    var target = Math.min(D.weeds.seasons, S.season + n);
    busy = true; paintRun();
    (function step(){
      if (S.season >= target) { busy = false; anim = null; fx.part = null; api.save(); paint(); MV.changed(); if (cb) cb(); return; }
      var i = S.season, v0 = S.hist[i], v1 = v0 + incOf(S.sys, S.pr);
      var c = MV.tween({ dur:560, step:function(t){ fx.part = [i + t, lerp(v0, v1, t)]; drawGraph(); }, done:function(){
        if (!anim || anim.c !== c) return;
        fx.part = null; S.hist.push(v1); S.season = i + 1; paintOne(); paintRead(); paintTable(); drawGraph(); step();
      } });
      anim = { c:c, cancel:c, done:cb };
    })();
  }
  function cancelAnim(){
    if (!anim) return;
    var a = anim; anim = null; busy = false; fx.part = null; fx.vals = null;
    try { a.cancel(); } catch (e) {}
    if (a.done) a.done();
  }
  function userChange(){ cancelAnim(); fx.lit = []; fx.flash = ""; }

  // ===== painting =====
  function readoutVals(){ return fx.vals || vals(S.sys, S.pr); }
  function paintRead(){
    var v = readoutVals(), sys = S.sys, isOrg = sys === "org" && !fx.vals, rows = D.readouts.map(function(r){
      var val = Math.round(v[r.id]), extra = r.id === "inp" && isOrg ? ' <span class="ag-rnote">' + D.orgInputs + "</span>" : "";
      return [r.id, r.t, '<span class="ag-rv"><span class="ag-gt" aria-hidden="true"><i style="width:' + clamp(val, 0, 100) + '%"></i></span><b>' + val + "</b></span>" + extra];
    });
    if (S.mode === "seasons") {
      var ix = curIdx(), n = S.season;
      rows.push(["idx", "Resistant-weed index (after " + D.weeds.seasons + " seasons)", '<span class="ag-rv"><span class="ag-gt" aria-hidden="true"><i style="width:' + clamp(ix, 0, 100) + '%"></i></span><b>' + Math.round(ix) + "</b></span>" +
        ' <span class="ag-rnote">' + (sys === "org" ? D.orgWeeds : "after " + n + " season" + (n === 1 ? "" : "s") + (n < D.weeds.seasons ? " so far" : "")) + "</span>"]);
    }
    rows.push(["cert", "Certification", "<strong>" + D.cert[sys] + "</strong>"]);
    $("#ag-rh").innerHTML = "Readout: " + sysOf(sys).t + ' <span class="hfa-model">' + D.modelTag + "</span>";
    $("#ag-read").innerHTML = rows.map(function(r){ return '<div class="' + (fx.lit.indexOf(r[0]) >= 0 ? "ag-lit" : "") + '" data-row="' + r[0] + '"><dt>' + r[1] + "</dt><dd>" + r[2] + "</dd></div>"; }).join("");
  }
  function paintCmp(){
    var box = $("#ag-cmp");
    MV.keepFocus(box, function(){
      box.innerHTML = D.systems.map(function(s){
        var v = vals(s.id, S.pr), on = s.id === S.sys;
        return '<article class="ag-card' + (on ? " on" : "") + '" data-sys="' + s.id + '"><h4 class="ag-h4">' + s.t + '</h4><p class="ag-selrow">' + (on ? '<span class="tag">Selected</span>' : "") + "</p>" +
          '<svg class="ag-csvg" viewBox="0 0 200 76" aria-hidden="true">' + fieldArt(2, 2, 196, 72, { pr:S.pr }) + "</svg>" +
          '<div class="ag-gauges" role="img" aria-label="' + esc(s.t + ", model index: " + D.readouts.map(function(r){ return r.t + " " + Math.round(v[r.id]); }).join(", ") + ".") + '">' + gaugeHTML(v) + "</div>" +
          '<p class="ag-cert' + (fx.flash === s.id ? " ag-lit" : "") + '"><span class="tiny muted">Certification:</span> <strong>' + D.cert[s.id] + "</strong></p>" +
          '<details class="ag-info" data-info="' + s.id + '"' + (S.open[s.id] ? " open" : "") + "><summary>About this system</summary><p>" + D.info[s.id] + "</p></details></article>";
      }).join("");
    });
  }
  function paintOne(){
    var weeds = S.mode === "seasons" && S.sys !== "org" ? Math.round(curIdx() / 7.5) : 0;
    $("#ag-fsvg").innerHTML = fieldArt(4, 4, 392, 142, { pr:S.pr, weeds:weeds });
    $("#ag-fsvg").setAttribute("aria-label", artDesc(S.sys, S.pr, weeds));
    $("#ag-fleg").innerHTML = "<strong>" + sysOf(S.sys).t + "</strong>" + (prList(S.pr).length ? " with " + listAnd(prList(S.pr).map(prName)) : ", no practices") + artLegend(S.pr, weeds);
  }
  function paintTable(){
    var head = ["Season"], row = ["Index"];
    for (var i = 0; i <= D.weeds.seasons; i++) { head.push(String(i)); row.push(i <= S.season ? String(S.hist[i]) : "—"); }
    $("#ag-stab").innerHTML = MV.tableHTML({ head:head, rows:[row], caption:"Resistant-weed index by season" });
  }
  function drawGraph(){
    if (!plot || S.mode !== "seasons") return;
    var pen = css("--pen"), ink2 = css("--ink-2"), pts = S.hist.slice(0, S.season + 1).map(function(v, i){ return [i, v]; });
    if (fx.part) pts.push(fx.part);
    var pnts = S.hist.slice(0, S.season + 1).map(function(v, i){ return { x:i, y:v, r:4.5, color:pen }; });
    var labels = [{ x:5.35, y:40, text:"40", color:ink2, align:"right", dy:-9, bg:true }];
    if (S.season > 0 && !fx.part) labels.push({ x:S.season, y:S.hist[S.season], text:String(S.hist[S.season]), color:pen, align:S.season > 3 ? "right" : "left", dx:S.season > 3 ? -9 : 9, dy:-10, bg:true });
    plot.draw({ view:{ xmin:-0.8, xmax:5.45, ymin:-6, ymax:84 }, curves:pts.length > 1 ? [{ pts:pts, color:pen, width:3.2 }] : [], points:pnts, labels:labels,
      segments:[{ x1:-0.8, y1:40, x2:5.45, y2:40, color:ink2, width:1.5, dash:[6, 6] }],
      xTicks:{ step:1 }, yTicks:{ step:20 }, xLabel:"season", yLabel:"resistant-weed index",
      describe:"Graph of the resistant-weed index (model data) against season, 0 to 5. " + sysOf(S.sys).t + (prList(S.pr).length ? " with " + listAnd(prList(S.pr).map(prName)) : ", no practices") + ". " +
        (S.season ? "Values so far: " + S.hist.slice(0, S.season + 1).join(", ") + "." : "No seasons run yet; the index is 0.") + " A dashed line marks 40." });
  }
  function paintRun(){
    var full = S.season >= D.weeds.seasons;
    $("#ag-run1").disabled = busy || full; $("#ag-run5").disabled = busy || full; $("#ag-reset").disabled = busy || S.season === 0;
    $("#ag-snote").textContent = (S.sys === "org" ? D.orgWeeds + " " : "") + D.seasonsNote;
  }
  function paint(){
    modeRG.set(S.mode); sysRG.set(S.sys);
    $$("#ag-togs [data-pr]").forEach(function(c){ c.checked = !!S.pr[c.dataset.pr]; });
    var m = S.mode;
    $("#ag-cmp").hidden = m !== "compare"; $("#ag-one").hidden = m === "compare"; $("#ag-seas").hidden = m !== "seasons";
    if (m === "compare") paintCmp(); else paintOne();
    if (m === "seasons") { if (!plot) { plot = new MV.Plot($("#ag-plot"), { xmin:-0.8, xmax:5.45, ymin:-6, ymax:84 }); plot.render = drawGraph; } paintTable(); paintRun(); drawGraph(); }
    paintRead();
  }
  function commit(){ api.save(); paint(); MV.changed(); }
  paint();

  // ===== predictions =====
  function tweenRead(from, to, dur, cb){
    fx.vals = from; paintRead();
    var c = MV.tween({ dur:dur, step:function(t){ var v = {}; KEYS.forEach(function(k){ v[k] = lerp(from[k], to[k], t); }); fx.vals = v; paintRead(); }, done:function(){ if (!anim || anim.c !== c) return; anim = null; fx.vals = null; cb(); } });
    anim = { c:c, cancel:c, done:null };
  }
  var predict = {
    start:function(p){
      userChange(); MV.banner("", "");
      S.pr = normPr({}); resetSeasons();
      if (p.id === "p1") { S.mode = "compare"; S.sys = "conv"; }
      else if (p.id === "p2") { S.mode = "seasons"; S.sys = "gm"; }
      else if (p.id === "p3") { S.mode = "builder"; S.sys = "conv"; }
      else { S.mode = "compare"; S.sys = "conv"; S.open.gm = true; }
      commit();
    },
    run:function(p, done){
      var fin = function(){ api.save(); paint(); MV.changed(); done(); };
      if (p.id === "p1") {
        var a = vals("conv", S.pr), b = vals("org", S.pr);
        tweenRead(a, b, 1300, function(){ S.sys = "org"; fx.lit = ["y", "soil"]; fin(); });
        anim.done = function(){ S.sys = "org"; done(); };
      } else if (p.id === "p2") {
        runSeasons(D.weeds.seasons, function(){ fx.lit = ["idx"]; paintRead(); done(); });
      } else if (p.id === "p3") {
        var b3 = vals(S.sys, S.pr); S.pr.NT = true; paintOne(); $$("#ag-togs [data-pr]").forEach(function(c){ c.checked = !!S.pr[c.dataset.pr]; });
        tweenRead(b3, vals(S.sys, S.pr), 1100, function(){ fx.lit = ["soil", "inp", "cost"]; fin(); });
        anim.done = function(){ done(); };
      } else {
        var c4 = MV.wait(600, function(){ if (!anim || anim.t !== c4) return; anim = null; S.sys = "gm"; fx.lit = ["cert"]; fx.flash = "gm"; fin(); });
        anim = { t:c4, cancel:function(){ clearTimeout(c4); }, done:function(){ S.sys = "gm"; done(); } };
      }
    }
  };

  // ===== challenges (plan's exact tests and named wrong states) =====
  function same(set){ var l = prList(S.pr); return l.length === set.length && set.every(function(k){ return S.pr[k]; }); }
  function challenge(id, opt){
    var c = byId(D.challenges, id), M = c.msgs, v = vals(S.sys, S.pr);
    if (id === "tc1") {
      if (S.sys !== "conv") return { ok:false, msg:M.sys };
      if (v.soil >= 80 && v.y >= 80) return { ok:true };
      if (same(["NT", "CC", "IC"])) return { ok:false, msg:M.close };
      if (!S.pr.R) return { ok:false, msg:fill(M.noR, v) };
      return { ok:false, msg:v.soil < 80 ? fill(M.soil, v) : fill(M.yield, v) };
    }
    if (id === "tc2") {
      if (S.sys !== "org") return { ok:false, msg:M.sys };
      if (v.inp === 0 && v.y >= 70) return { ok:true };
      if (!S.pr.R) return { ok:false, msg:fill(M.noR, v) };
      return { ok:false, msg:[S.pr.IC ? M.ic : "", S.pr.NT ? M.nt : ""].filter(Boolean).join(" ") };
    }
    if (id === "tc3") {
      if (S.sys !== "gm") return { ok:false, msg:M.sys };
      if (S.season < D.weeds.seasons) return { ok:false, msg:M.run };
      var ix = curIdx();
      if (ix < 40) return { ok:true };
      if (same(["IPM", "CC"])) return { ok:false, msg:M.close };
      return { ok:false, msg:fill(M.other, { v:ix }) };
    }
    return { ok:false };
  }
  return { predict:predict, challenge:challenge };
}

// ---------- Part 3: What does the evidence say? (@component F13 claimStations — claim card with a practice-model source, three
// chip rows (source type, evidence strength, verdict), "Check it with data" with an APA citation, a follow-up verdict chip,
// a still-debated sort, and an optional reflection station) ----------
function part3(host, api){
  var D = api.content, S = api.S, ST = D.stations, core = ST.filter(function(s){ return !s.optional; });
  S.st = byId(ST, S.st) ? S.st : ST[0].id;
  S.a = S.a || {}; ST.forEach(function(s){ S.a[s.id] = S.a[s.id] || { src:"", str:"", v:"", checked:false, ok:false, tries:0 }; });
  S.f = S.f || { v:"", checked:false }; S.sort = S.sort || { pick:{}, checked:false }; S.s5 = S.s5 || { ben:"", con:"" };
  function ansOf(s){ return MV.ans(s) || {}; }
  function rowOk(s, k){ var a = ansOf(s), x = S.a[s.id]; return k === "str" ? (a.str || []).indexOf(x.str) >= 0 : x[k] === a[k]; }
  function sortOk(it){ return S.sort.pick[it.id] === MV.ans(it); }
  function done(s){
    if (s.optional) return !!(S.s5.ben.trim() && S.s5.con.trim());
    var x = S.a[s.id]; if (!x.ok) return false;
    if (s.follow) return S.f.checked && S.f.v === MV.ans(s.follow);
    if (s.sort) return S.sort.checked && s.sort.items.every(sortOk);
    return true;
  }
  function stLabels(){ return ST.map(function(s){ return { id:s.id, t:s.t + (done(s) ? ' <span class="ag-stok">✓<span class="vh"> finished</span></span>' : "") }; }); }
  var stOpts = stLabels();
  host.innerHTML = '<p class="tiny muted">' + D.teacherNote + '</p><div id="ag-stn"></div><p class="tiny" id="ag-stp" aria-live="polite"></p>' + ST.map(function(s){ return '<div class="ag-st" id="ag-st-' + s.id + '" hidden></div>'; }).join("");
  var stRG = radios($("#ag-stn", host), { label:"Station", cls:"chips", options:stOpts, value:S.st, onChange:function(v){ S.st = v; api.save(); paintAll(); } });
  function stRepaint(){
    stLabels().forEach(function(x, i){ stOpts[i].t = x.t; }); stRG.repaint();
    $("#ag-stp", host).textContent = "Stations finished: " + core.filter(done).length + " of " + core.length + " (station 5 is optional).";
  }
  function dataHTML(s, open){
    return '<details class="alg ag-data"' + (open ? " open" : "") + "><summary>Check it with data</summary><p>" + s.data + ' <span class="ag-cite">' + s.cite + '</span></p><p class="tiny"><span class="tag">Evidence from</span> ' + s.from + "</p></details>";
  }
  var RG = {};
  ST.forEach(function(s){
    var box = $("#ag-st-" + s.id, host);
    if (s.optional) {
      box.innerHTML = '<h4 class="ag-h4">' + s.claim + '</h4><p>' + s.text + "</p>" + dataHTML(s, true) +
        '<p class="ag-s5q"><strong>' + s.ask + '</strong> <span class="tiny muted">(optional, not scored)</span></p>' +
        '<div class="ag-s5"><label class="ag-s5l" for="ag-ben">' + s.benefit + '</label><textarea id="ag-ben" class="txtin" rows="2" data-k="agben"></textarea>' +
        '<label class="ag-s5l" for="ag-con">' + s.concern + '</label><textarea id="ag-con" class="txtin" rows="2" data-k="agcon"></textarea><p class="saved tiny" id="ag-s5s" aria-live="polite"></p></div>';
      $("#ag-ben", box).value = S.s5.ben; $("#ag-con", box).value = S.s5.con;
      var tm = null;
      box.addEventListener("input", function(e){
        if (e.target.id === "ag-ben") S.s5.ben = e.target.value; else if (e.target.id === "ag-con") S.s5.con = e.target.value; else return;
        clearTimeout(tm); tm = setTimeout(function(){ api.save(); $("#ag-s5s", box).textContent = "Saved"; stRepaint(); }, 400);
      });
      return;
    }
    box.innerHTML = '<article class="ag-claimcard"><p class="tiny"><span class="hfa-model">' + D.tag + '</span></p><blockquote class="ag-claim"><p>“' + s.claim.replace(/\.$/, "") + '.”</p></blockquote>' +
      '<dl class="ag-src"><div><dt>Where you saw it</dt><dd>' + s.seen + "</dd></div><div><dt>Evidence it gives</dt><dd>" + s.gives + "</dd></div></dl></article>" +
      '<div class="ag-pick" id="ag-pk-src-' + s.id + '"></div><div class="ag-pick" id="ag-pk-str-' + s.id + '"></div><div class="ag-pick" id="ag-pk-v-' + s.id + '"></div>' +
      '<div class="q-actions" id="ag-chkw-' + s.id + '"><button type="button" class="btn primary sm" data-chk="1" data-k="agchk' + s.id + '">Check my answers</button></div><div class="ag-fb" id="ag-fb-' + s.id + '"></div><div id="ag-dt-' + s.id + '"></div><div id="ag-ex-' + s.id + '"></div>';
    var x = S.a[s.id];
    RG[s.id] = {
      src:radios($("#ag-pk-src-" + s.id, box), { label:"Source type", cls:"chips", aria:"Source type", options:D.sources, value:x.src, onChange:function(v){ x.src = v; api.save(); } }),
      str:radios($("#ag-pk-str-" + s.id, box), { label:"Evidence strength", cls:"chips", aria:"Evidence strength", options:D.strengths, value:x.str, onChange:function(v){ x.str = v; api.save(); } }),
      v:radios($("#ag-pk-v-" + s.id, box), { label:"Verdict", cls:"chips", aria:"Verdict", options:D.verdicts, value:x.v, onChange:function(v){ x.v = v; api.save(); } })
    };
    box.addEventListener("click", function(e){
      var b = e.target.closest("button"); if (!b || b.disabled) return;
      if (b.dataset.chk) {
        if (!x.src || !x.str || !x.v) { x.msg = "Choose a source type, an evidence strength and a verdict first."; x.skip = true; paintStation(s); MV.focusFb($("#ag-fb-" + s.id, box)); return; }
        x.checked = true; x.skip = false; x.msg = "";
        x.ok = rowOk(s, "src") && rowOk(s, "str") && rowOk(s, "v"); if (!x.ok) x.tries++;
        api.save(); paintStation(s); stRepaint(); MV.focusFb($("#ag-fb-" + s.id, box)); return;
      }
      if (b.dataset.fv) { S.f.v = b.dataset.fv; S.f.checked = true; api.save(); paintStation(s); stRepaint(); MV.focusFb($("#ag-ex-" + s.id, box)); return; }
      if (b.dataset.so) { S.sort.pick[b.dataset.it] = b.dataset.so; S.sort.checked = false; api.save(); paintStation(s); stRepaint(); return; }
      if (b.dataset.sochk) { S.sort.checked = true; api.save(); paintStation(s); stRepaint(); MV.focusFb($("#ag-ex-" + s.id, box)); }
    });
  });
  function paintStation(s){
    if (s.optional) return;
    var box = $("#ag-st-" + s.id, host), x = S.a[s.id], a = ansOf(s), name = function(list, id){ var o = byId(list, id); return o ? o.t : ""; };
    ["src", "str", "v"].forEach(function(k){ RG[s.id][k].lock(x.ok); });
    $("#ag-chkw-" + s.id, box).hidden = x.ok;
    var fb = "";
    if (x.msg) fb = MV.fbHTML("", x.msg);
    else if (x.checked) {
      if (x.ok) fb = MV.fbHTML("good", "<strong>✓ " + D.fbOk + "</strong> " + name(D.sources, a.src) + "; evidence " + name(D.strengths, x.str).toLowerCase() + "; verdict: " + name(D.verdicts, a.v).toLowerCase() + ".");
      else {
        var L = [];
        L.push(rowOk(s, "src") ? "✓ Source type." : "✗ Source type: " + D.fbSrc);
        L.push(rowOk(s, "str") ? "✓ Evidence strength." : "✗ Evidence strength: " + s.strFb);
        L.push(rowOk(s, "v") ? "✓ Verdict." : "✗ Verdict: " + s.vFb);
        fb = '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong> Change the rows marked ✗, then check again.</p><ul class="ag-fbl">' + L.map(function(t){ return "<li>" + t + "</li>"; }).join("") + "</ul></div>";
      }
    }
    $("#ag-fb-" + s.id, box).innerHTML = fb;
    var dt = $("#ag-dt-" + s.id, box);
    if (x.checked && !dt.firstChild) dt.innerHTML = dataHTML(s, true);
    var ex = $("#ag-ex-" + s.id, box), h = "";
    if (x.ok && s.follow) {
      var F = s.follow, fa = MV.ans(F), fr = S.f.checked && S.f.v === fa;
      h = '<div class="ag-follow"><h5 class="ag-h5">Follow-up claim</h5><blockquote class="ag-claim sm"><p>“' + F.claim.replace(/\.$/, "") + '.”</p></blockquote><div class="ag-chipset" role="group" aria-label="Verdict on the follow-up claim">' + D.verdicts.map(function(o){
        var on = S.f.v === o.id; return '<button type="button" data-fv="' + o.id + '" data-k="agfv' + o.id + '" aria-pressed="' + on + '"' + (fr ? " disabled" : "") + ">" + o.t + "</button>";
      }).join("") + "</div>";
      if (S.f.checked) h += fr ? MV.fbHTML("good", "<strong>✓ Right: not supported.</strong> " + F.fb + ' <span class="ag-cite">' + F.cite + "</span>") : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + F.fb);
      h += "</div>";
    }
    if (x.ok && s.sort) {
      var Q = s.sort, all = Q.items.every(function(it){ return S.sort.pick[it.id]; }), right = Q.items.filter(sortOk).length;
      h = '<div class="ag-sort"><h5 class="ag-h5">' + Q.title + "</h5><p>" + Q.ask + '</p><ul class="ag-sitems">' + Q.items.map(function(it){
        var pk = S.sort.pick[it.id], mk = S.sort.checked && pk ? (sortOk(it) ? "right" : "wrong") : "";
        return '<li class="ag-si' + (mk ? " " + mk : "") + '"><span class="ag-sit">' + (mk === "right" ? "✓ " : mk === "wrong" ? "✗ " : "") + it.t + (mk === "right" ? '<span class="tiny ag-swhy">' + it.why + "</span>" : mk === "wrong" ? '<span class="tiny ag-swhy">Try the other column.</span>' : "") + "</span>" +
          '<span class="ag-chipset" role="group" aria-label="' + esc(MV.plain(it.t)) + '">' + Q.cols.map(function(c){ var on = pk === c.id; return '<button type="button" data-so="' + c.id + '" data-it="' + it.id + '" data-k="ag' + it.id + c.id + '" aria-pressed="' + on + '"' + (S.sort.checked && right === Q.items.length ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</span></li>";
      }).join("") + "</ul>";
      if (!(S.sort.checked && right === Q.items.length)) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-sochk="1" data-k="agsochk"' + (all ? "" : " disabled") + '>Check the sort</button>' + (all ? "" : '<span class="tiny muted">Sort all six first.</span>') + "</div>";
      if (S.sort.checked) h += right === Q.items.length ? MV.fbHTML("good", "<strong>✓ " + Q.done + "</strong>") : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + fill(Q.off, { n:Q.items.length - right }));
      h += "</div>";
    }
    MV.keepFocus(ex, function(){ ex.innerHTML = h; });
  }
  function paintAll(){ stRG.set(S.st); stRepaint(); ST.forEach(function(s){ $("#ag-st-" + s.id, host).hidden = s.id !== S.st; }); }
  ST.forEach(paintStation); paintAll();
}

// ---------- Performance task: Farm plan (system + practices; live gauges with goal marks, field art and a 5-season graph) ----------
var task = (function(){
  var api = null, sysRG = null;
  var GOALS = { y:{ v:75, dir:"min", t:"goal ≥ 75" }, soil:{ v:70, dir:"min", t:"goal ≥ 70" }, inp:{ v:50, dir:"max", t:"goal ≤ 50" }, cost:{ v:65, dir:"max", t:"goal ≤ 65" } };
  function st(){ var s = api.S; s.sys = byId(EX().systems, s.sys) ? s.sys : "conv"; s.pr = normPr(s.pr); return s; }
  function read(){ if (!api) return { sys:"conv", pr:normPr({}) }; var s = st(); return { sys:s.sys, pr:normPr(s.pr) }; }
  function idx5(d){ return incOf(d.sys, d.pr) * EX().weeds.seasons; }
  function checks(d){ var v = vals(d.sys, d.pr); return [v.y >= 75, v.soil >= 70, v.inp <= 50, idx5(d) < 40, v.cost <= 65]; }
  function keyOf(d){ return d.sys + ":" + prList(d.pr).join("+"); }
  function fromKey(k){ var p = String(k).split(":"), pr = {}; (p[1] ? p[1].split("+") : []).forEach(function(x){ pr[x] = true; }); return { sys:p[0], pr:normPr(pr) }; }
  function graphSVG(d){
    var inc = incOf(d.sys, d.pr), N = EX().weeds.seasons, x0 = 40, x1 = 290, y0 = 12, y1 = 132, X = function(i){ return x0 + (x1 - x0) * i / N; }, Y = function(v){ return y1 - (y1 - y0) * v / 80; }, h = "";
    [0, 20, 40, 60, 80].forEach(function(v){ h += '<line class="ag-mgrid" x1="' + x0 + '" y1="' + f1(Y(v)) + '" x2="' + x1 + '" y2="' + f1(Y(v)) + '"/>' + svgT(x0 - 6, Y(v) + 4, String(v), "ag-mtick", "end"); });
    for (var i = 0; i <= N; i++) h += svgT(X(i), y1 + 15, String(i), "ag-mtick");
    h += '<line class="ag-mgoal" x1="' + x0 + '" y1="' + f1(Y(40)) + '" x2="' + x1 + '" y2="' + f1(Y(40)) + '"/>' + svgT(x1, Y(40) - 5, "goal: below 40", "ag-mtick", "end");
    var pts = []; for (i = 0; i <= N; i++) pts.push(f1(X(i)) + "," + f1(Y(inc * i)));
    h += '<polyline class="ag-mline" points="' + pts.join(" ") + '"/>';
    for (i = 0; i <= N; i++) h += '<circle class="ag-mdot" cx="' + f1(X(i)) + '" cy="' + f1(Y(inc * i)) + '" r="3.5"/>';
    h += svgT((x0 + x1) / 2, y1 + 30, "season", "ag-mtick");
    return h;
  }
  function paint(){
    var pv = $("#ag-tpv"); if (!pv) return;
    var s = st(), d = read(), v = vals(d.sys, d.pr), ix = idx5(d), inc = incOf(d.sys, d.pr), ok4 = ix < 40;
    sysRG.set(s.sys); $$("#ag-ttogs [data-tpr]").forEach(function(c){ c.checked = !!s.pr[c.dataset.tpr]; });
    pv.innerHTML = '<h4 class="ag-h4">Your farm: ' + planText(d.sys, d.pr) + ' <span class="hfa-model">Model data</span></h4>' +
      '<svg class="ag-tsvg" viewBox="0 0 300 96" role="img" aria-label="' + esc(artDesc(d.sys, d.pr, 0)) + '">' + fieldArt(2, 2, 296, 92, { pr:d.pr }) + "</svg>" +
      '<div class="ag-gauges ag-tg" aria-live="polite">' + gaugeHTML(v, { labels:{ y:"Yield", inp:"Synthetic inputs", soil:"Soil health", bio:"Biodiversity", cost:"Cost" }, goals:GOALS }) + "</div>" +
      '<p class="ag-tidx"><strong>Resistant-weed index after 5 seasons: ' + ix + "</strong> " + (ok4 ? "✓" : "○") + '<span class="vh">' + (ok4 ? " goal met" : " goal not met") + '</span> <span class="tiny muted">(goal: below 40' + (d.sys === "org" ? "; organic stays at 0" : "; +" + inc + " a season") + ")</span></p>" +
      '<svg class="ag-msvg" viewBox="0 0 300 168" role="img" aria-label="' + esc("Graph of the resistant-weed index over seasons 0 to 5: " + [0, 1, 2, 3, 4, 5].map(function(i){ return inc * i; }).join(", ") + ". A dashed line marks the goal, below 40.") + '">' + graphSVG(d) + "</svg>";
  }
  return {
    render:function(inp, pv, a){
      api = a; var s = st(), E = EX();
      inp.innerHTML = '<div id="ag-tsys"></div><div class="ag-rgw ag-prw"><span class="ag-rgl" id="ag-tprl">Practices</span><div class="ag-togs" id="ag-ttogs" role="group" aria-labelledby="ag-tprl">' + E.practices.map(function(x){
        return '<label class="ag-tog"><input type="checkbox" data-tpr="' + x.id + '" data-k="agtpr' + x.id + '"><span>' + x.t + (x.long ? '<span class="vh"> (' + x.long + ")</span>" : "") + "</span></label>";
      }).join("") + "</div></div>";
      pv.innerHTML = '<div class="ag-tpv" id="ag-tpv"></div>';
      sysRG = radios($("#ag-tsys"), { label:"System", cls:"chips", options:E.systems, value:s.sys, onChange:function(v){ st().sys = v; api.save(); paint(); api.update(); } });
      $("#ag-ttogs").addEventListener("change", function(e){ var c = e.target.closest("[data-tpr]"); if (!c) return; st().pr[c.dataset.tpr] = c.checked; api.save(); paint(); api.update(); });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:checks,
    key:keyOf,
    label:function(k){ var d = fromKey(k); return "<strong>" + planText(d.sys, d.pr) + "</strong>"; },
    text:function(k){ var d = fromKey(k); return planText(d.sys, d.pr); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
