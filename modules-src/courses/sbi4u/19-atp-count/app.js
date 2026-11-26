// SBI4U 19 Cellular Respiration ATP Count: hero (token board fills, converter tile flips, shuttle gate, four totals),
// ATP ledger (S3 energyLedger: Build / Explain / Compare modes, token board, per-stage table, H⁺ calculator),
// "Why the real count is lower" (H⁺ budget dot groups, leak dial, P/O data chips), "Design an ATP budget" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small SVG helpers (from SBI4U 17 / 15) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "ac-t", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function op(v){ return v == null || v >= 0.99 ? null : f1(clamp(v, 0, 1) * 100) / 100; }
function grp(a, inner){ return a <= 0.02 ? "" : a < 0.98 ? '<g opacity="' + f1(a * 100) / 100 + '">' + inner + "</g>" : inner; }
function seg(T, a, b){ return clamp((T - a) / (b - a), 0, 1); }
function polyAt(pts, p){
  var segs = [], tot = 0, i;
  for (i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); tot += l; }
  var d = clamp(p, 0, 1) * tot;
  for (i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { var k = segs[i] ? Math.min(1, d / segs[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } d -= segs[i]; }
  return pts[pts.length - 1];
}
// numbers: exact values as they are; anything else to one decimal place with ≈ (fx) or two decimal places (fv)
function same(a, b){ return Math.abs(a - b) < 1e-6; }
function isExact(v, dp){ var p = Math.pow(10, dp), r = Math.round(v * p) / p; return Math.abs(v - r) < 1e-9; }
function fx(v){ return (isExact(v, 1) ? "" : "≈ ") + MV.num(Math.round(v * 10) / 10, 1); }
function fv(v){ return (isExact(v, 2) ? "" : "≈ ") + MV.num(Math.round(v * 100) / 100, 2); }
function ex1(v){ return isExact(v, 1) ? "= " + fx(v) : fx(v); }
function ex2(v){ return isExact(v, 2) ? "= " + fv(v) : fv(v); }
var FRAC = { "1/2":"½", "1/3":"⅓", "2/3":"⅔", "1/4":"¼", "3/4":"¾", "1/5":"⅕", "2/5":"⅖", "3/5":"⅗", "4/5":"⅘", "1/6":"⅙", "5/6":"⅚" };
function fracTxt(a, b){ var g = a, h = b; while (h) { var t = g % h; g = h; h = t; } return FRAC[(a / g) + "/" + (b / g)] || fv(a / b); }
function say(s){ return String(s).replace(/≈ /g, "about "); }
// typed decimals: a point only ("26,4" is not accepted, plan §5)
function parseTyped(raw){
  var s = String(raw == null ? "" : raw).trim().replace(/\s+/g, "").replace(/[−–]/g, "-");
  if (!s || !/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return null;
  var v = parseFloat(s); return isFinite(v) ? v : null;
}

// ---------- @component radioGroup (copied from SBI4U 17 / 13 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list), disable(b)}
function radios(host, o){
  var val = String(o.value), off = false;
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, dis = x.dis || off, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (dis ? -1 : tab) + '" data-rg="' + x.id + '" data-k="rg' + (o.key || "") + x.id + '"' + (dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function firstFree(){ for (var i = 0; i < o.options.length; i++) if (!o.options[i].dis) return i; return 0; }
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
// @component stepper (from SBI4U 15 / 08 / 10) — − / + buttons around a live value: stepper(host, {id, label, min, max, value, unit(v), onChange(v)}) -> {set(v), disable(b)}
function stepper(host, o){
  var v = o.value, off = false, nm = MV.plain(o.label);
  host.innerHTML = '<span class="rg-wrap"><span class="rg-lab" id="' + o.id + '-l">' + o.label + '</span><span class="ac-stp" role="group" aria-labelledby="' + o.id + '-l">' +
    '<button type="button" class="ac-stb" data-d="-1" data-k="' + o.id + 'm" aria-label="' + MV.esc("Decrease " + nm) + '">−</button><output id="' + o.id + '" aria-live="polite"></output>' +
    '<button type="button" class="ac-stb" data-d="1" data-k="' + o.id + 'p" aria-label="' + MV.esc("Increase " + nm) + '">+</button></span></span>';
  var out = $("#" + o.id, host);
  function paint(){ out.textContent = o.unit ? o.unit(v) : v; $$("[data-d]", host).forEach(function(b){ b.disabled = off || (+b.dataset.d < 0 ? v <= o.min : v >= o.max); }); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-d]"); if (!b || b.disabled) return; v = clamp(v + (+b.dataset.d), o.min, o.max); paint(); o.onChange(v); });
  paint();
  return { set:function(x){ v = x; paint(); }, disable:function(b){ off = b; paint(); } };
}

// ---------- @component S3 energyLedger — ATP-count form (course plan S3): carriers per glucose × assumed value per carrier ----------
// cfg = {org:"pro"|"euk", vals:"theo"|"cur"|"custom", shut:"gp"|"ma"}; H = {n, f, a} = H⁺ per NADH, per FADH₂, per ATP (custom)
var VAL = { theo:[3, 2], cur:[2.5, 1.5] };
function led(c, H){
  var sh = c.org === "euk" && c.shut === "gp" ? 2 : 0, v = c.vals === "custom" ? [H.n / H.a, H.f / H.a] : (VAL[c.vals] || VAL.theo);
  var nN = 10 - sh, nF = 2 + sh;
  return { sh:sh, vN:v[0], vF:v[1], nN:nN, nF:nF, aN:nN * v[0], aF:nF * v[1], tot:4 + nN * v[0] + nF * v[1], custom:c.vals === "custom" };
}
function valsText(c, H, r){ return c.vals === "custom" ? H.n + " H⁺/NADH, " + H.f + " H⁺/FADH₂, " + H.a + " H⁺/ATP (" + fv(r.vN) + " ATP/NADH, " + fv(r.vF) + " ATP/FADH₂)" : MV.num(r.vN) + " ATP/NADH, " + MV.num(r.vF) + " ATP/FADH₂"; }
function assume(c, H){ return valsText(c, H, led(c, H)) + ", " + (c.org === "euk" ? (c.shut === "gp" ? "glycerol-phosphate shuttle" : "malate–aspartate shuttle") : "prokaryote (no shuttle)"); }
function srText(c, H){
  var r = led(c, H);
  return (c.org === "euk" ? "Eukaryote" : "Prokaryote") + ", " + ({ theo:"theoretical", cur:"current", custom:"custom" })[c.vals] + " values" +
    (c.org === "euk" ? ", " + (c.shut === "gp" ? "glycerol-phosphate" : "malate–aspartate") + " shuttle" : "") + ": 4 plus " + say(fx(r.aN)) + " plus " + say(fx(r.aF)) + " equals " + say(fx(r.tot)) + " ATP per glucose.";
}
function sumLine(r){ return "4 + " + fx(r.aN) + " + " + fx(r.aF) + " " + ex1(r.tot); }
function energy(t){ var kj = t * 30.5, ex = isExact(t, 1); return fx(t) + " × 30.5 " + (ex ? "= " + MV.num(Math.round(kj * 10) / 10, 1) : "≈ " + MV.num(Math.round(kj))) + " kJ (≈ " + Math.round(kj / 2870 * 100) + "%)"; }
function shuttleRow(c){ return c.org !== "euk" ? "2 NADH (no shuttle needed)" : c.shut === "gp" ? "2 FADH₂ (glycerol-phosphate)" : "2 NADH (malate–aspartate)"; }

// token board (viewBox 520 × 272): rows = stages, columns = ATP / NADH / FADH₂; a shuttle gate in the inner membrane (eukaryote);
// footer = total box, converter tile (× per NADH | × per FADH₂) and the products.
var BX = { atp:[146, 194], nadh:[258, 306, 354], fadh:[432, 480] }, RY = { g:44, p:90, k1:122, k2:146, s:182 }, GATE = [392, 66];
var TOKW = { ATP:44, NADH:48, "FADH₂":52 }, TOKC = { ATP:"--bio-atp", NADH:"--bio-nadh", "FADH₂":"--bio-fadh" };
function pill(lab, x, y, a){ var w = TOKW[lab] || 48; return '<g transform="translate(' + f1(x) + "," + f1(y) + ')"' + (op(a) == null ? "" : ' opacity="' + op(a) + '"') + '><rect x="' + f1(-w / 2) + '" y="-9.5" width="' + w + '" height="19" rx="9.5" style="fill:var(' + TOKC[lab] + ')"/><text y="4" text-anchor="middle" class="ac-tokt">' + lab + "</text></g>"; }
function ghost(x, y){ return sv("rect", { x:x - 24, y:y - 9.5, width:48, height:19, rx:9.5, "class":"ac-ghost" }); }
function shutPath(j, gp){ return [[BX.nadh[j], RY.g], [BX.nadh[j] + (GATE[0] - BX.nadh[j]) * 0.55, RY.g + 6], GATE, [gp ? BX.fadh[j] : BX.nadh[j], RY.s]]; }
// o = {c, H, rows:{g, p, k} (alpha 0–1 each), sk (shuttle progress 0–1), memA (membrane alpha), foot:false | {tile, flip:{from, k}, nN, nF, aN, aF, tot, hide, tick}, four, glow}
function boardSVG(o){
  var c = o.c, r = led(c, o.H), euk = c.org === "euk", gp = euk && c.shut === "gp", rows = o.rows || { g:1, p:1, k:1 }, h = "";
  var sk = o.sk == null ? (euk ? 1 : 0) : o.sk, mA = o.memA == null ? (euk ? 1 : 0) : o.memA;
  if (o.glow) h += sv("rect", { x:118, y:26, width:104, height:134, rx:10, "class":"ac-glow" }) + sv("rect", { x:118, y:214, width:104, height:52, rx:10, "class":"ac-glow" });
  h += txt(170, 18, "ATP made directly", "ac-th", "middle") + txt(306, 18, "NADH", "ac-th", "middle") + txt(456, 18, "FADH₂", "ac-th", "middle");
  h += txt(8, 48, "Glycolysis", "ac-sl") + txt(8, 94, "Pyruvate oxidation", "ac-sl") + txt(8, 138, "Krebs cycle", "ac-sl");
  if (mA > 0.02) {
    var m = sv("line", { x1:6, y1:GATE[1], x2:GATE[0] - 12, y2:GATE[1], "class":"ac-mem" }) + sv("line", { x1:GATE[0] + 12, y1:GATE[1], x2:514, y2:GATE[1], "class":"ac-mem" }) +
      sv("rect", { x:GATE[0] - 12, y:GATE[1] - 8, width:24, height:16, rx:4, "class":"ac-gate" }) + txt(8, GATE[1] + 13, "inner membrane", "ac-ms") +
      txt(456, 94, c.shut === "gp" ? "glycerol-phosphate" : "malate–aspartate", "ac-gl", "middle") + txt(456, 106, "shuttle gate", "ac-gl", "middle") + txt(8, RY.s + 4, "After the shuttle", "ac-sl");
    h += grp(mA, m);
  }
  if (rows.g) h += grp(rows.g, pill("ATP", BX.atp[0], RY.g) + pill("ATP", BX.atp[1], RY.g));
  if (rows.p) h += grp(rows.p, pill("NADH", BX.nadh[0], RY.p) + pill("NADH", BX.nadh[1], RY.p));
  if (rows.k) {
    var kk = pill("ATP", BX.atp[0], RY.k1) + pill("ATP", BX.atp[1], RY.k1) + pill("FADH₂", BX.fadh[0], RY.k1) + pill("FADH₂", BX.fadh[1], RY.k1);
    for (var i = 0; i < 6; i++) kk += pill("NADH", BX.nadh[i % 3], i < 3 ? RY.k1 : RY.k2);
    h += grp(rows.k, kk);
  }
  if (rows.g) {
    // the two cytosolic NADH from glycolysis: through the shuttle gate (eukaryote); teal → cerulean as they pass the gate (glycerol-phosphate)
    var cy = "";
    for (var j = 0; j < 2; j++) {
      var useP = euk && sk > 0, p = useP ? polyAt(shutPath(j, gp), sk) : [BX.nadh[j], RY.g];
      if (useP) cy += ghost(BX.nadh[j], RY.g);
      cy += pill(gp && sk >= 0.62 ? "FADH₂" : "NADH", p[0], p[1]);
    }
    if (euk && sk >= 0.99) cy += txt(gp ? 456 : 282, RY.s + 23, gp ? "now counted as FADH₂" : "still counted as NADH", "ac-note", "middle");
    if (!euk) cy += txt(306, RY.s + 4, "No mitochondrion: no shuttle needed", "ac-note", "middle");
    else if (sk < 0.99) cy += txt(334, RY.g + 4, "made in the cytosol", "ac-note");
    h += grp(rows.g, cy);
  }
  h += sv("line", { x1:6, y1:208, x2:514, y2:208, "class":"ac-sep" });
  if (o.four) h += fourSVG();
  else if (o.foot) h += footSVG(o.foot, r);
  return h;
}
function footSVG(f, r){
  var tile = f.tile || [r.vN, r.vF], v = tile, s = 1, nN = f.nN == null ? r.nN : f.nN, nF = f.nF == null ? r.nF : f.nF;
  var aN = f.aN == null ? r.aN : f.aN, aF = f.aF == null ? r.aF : f.aF, tot = f.tot == null ? r.tot : f.tot;
  function show(x){ return f.tick ? MV.num(Math.round(x)) : fx(x); }
  if (f.flip) { var k = f.flip.k; s = Math.abs(1 - 2 * k); v = k < 0.5 ? f.flip.from : tile; }
  var h = sv("rect", { x:6, y:214, width:104, height:52, rx:8, "class":"ac-totbox" }) + txt(58, 230, "Total ATP", "ac-fl", "middle") + txt(58, 257, f.hide ? "?" : show(tot), "ac-big", "middle");
  h += txt(170, 229, "× 1", "ac-fl", "middle") + txt(170, 256, "4", "ac-fv ac-fatp", "middle");
  h += '<g transform="translate(0 225) scale(1 ' + Math.max(0.04, Math.round(s * 100) / 100) + ') translate(0 -225)">' + sv("rect", { x:232, y:214, width:276, height:22, rx:6, "class":"ac-tile" }) +
    sv("line", { x1:381, y1:217, x2:381, y2:233, "class":"ac-tiled" }) + txt(306, 229, "× " + fv(v[0]) + " per NADH", "ac-tilet", "middle") + txt(456, 229, "× " + fv(v[1]) + " per FADH₂", "ac-tilet", "middle") + "</g>";
  h += txt(306, 256, nN + " × " + fv(tile[0]) + " = " + (f.hide ? "?" : show(aN)), "ac-fv", "middle") + txt(456, 256, nF + " × " + fv(tile[1]) + " = " + (f.hide ? "?" : show(aF)), "ac-fv", "middle");
  return h;
}
var FOUR = [[38, "prokaryote", "3 / 2"], [36, "glycerol-phosphate", "3 / 2"], [32, "no shuttle cost", "2.5 / 1.5"], [30, "glycerol-phosphate", "2.5 / 1.5"]];
function fourSVG(){
  return FOUR.map(function(q, i){ var x = 6 + i * 128; return sv("rect", { x:x, y:213, width:124, height:56, rx:8, "class":"ac-totbox" }) + txt(x + 62, 236, String(q[0]), "ac-big", "middle") + txt(x + 62, 251, q[1], "ac-fs", "middle") + txt(x + 62, 264, q[2], "ac-fs", "middle"); }).join("");
}

// ---------- Explore: ATP ledger ----------
function explore(host, api){
  var C = api.content, S = api.S, B = C.build;
  var D0 = { mode:"build", L:[{ org:"euk", vals:"theo", shut:"gp" }, { org:"euk", vals:"cur", shut:"gp" }], ed:0, H:{ n:10, f:6, a:4 }, typed:"", b:{ g:["", "", ""], p:["", "", ""], k:["", "", ""] }, bok:{}, step:0 };
  Object.keys(D0).forEach(function(k){ if (S[k] === undefined) S[k] = JSON.parse(JSON.stringify(D0[k])); });
  var anim = null, pend = null, hide = false, glow = false, disp = {}, busy = false, rowMsg = {};
  var NM = {}; C.orgs.concat(C.vals, C.shuts, C.modes).forEach(function(x){ NM[x[0]] = x[1]; });
  host.innerHTML = '<div class="pg ac-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="ac-stage"><svg id="ac-board" viewBox="0 0 520 272" role="img" focusable="false"></svg></div>' +
    '<p class="ac-cap" id="ac-cap" aria-live="polite"></p><div id="ac-steps" class="ac-steps"></div><div id="ac-ledger"></div><div id="ac-cmp"></div></div>' +
    '<div class="pg-ctrl"><div id="ac-mode"></div><p class="tiny muted ac-mhelp" id="ac-mhelp"></p><div id="ac-ed"></div><div id="ac-org"></div><div id="ac-vals"></div><div id="ac-shut"></div><div id="ac-calc"></div></div>' +
    '<div class="pg-read"><dl class="read" id="ac-read" aria-live="polite"></dl><p class="tiny ac-note2"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div></div>";
  var svg = $("#ac-board", host), readEl = $("#ac-read", host), capEl = $("#ac-cap", host);
  function ai(){ return S.mode === "compare" ? S.ed : 0; }
  function cfg(){ return S.L[ai()]; }
  var modeR = radios($("#ac-mode", host), { label:"Mode", key:"m", options:C.modes.map(function(m){ return { id:m[0], t:m[1] }; }), value:S.mode, onChange:function(v){ setMode(v); } });
  var edR = radios($("#ac-ed", host), { label:"Settings change", key:"e", options:[{ id:"0", t:"Ledger A" }, { id:"1", t:"Ledger B" }], value:String(S.ed), onChange:function(v){ stopAnim(); S.ed = +v; api.save(); paintAll(); setCap(srText(cfg(), S.H)); MV.changed(); } });
  var orgR = radios($("#ac-org", host), { label:"Organism", key:"o", options:C.orgs.map(function(m){ return { id:m[0], t:m[1] }; }), value:cfg().org, onChange:function(v){ change({ org:v }); } });
  var valR = radios($("#ac-vals", host), { label:"Values", key:"v", options:valOpts(), value:cfg().vals, onChange:function(v){ change({ vals:v }); } });
  var shR = radios($("#ac-shut", host), { label:"Shuttle", key:"s", options:C.shuts.map(function(m){ return { id:m[0], t:m[1] }; }), value:cfg().shut, onChange:function(v){ change({ shut:v }); } });
  function valOpts(){ return C.vals.map(function(m){ return { id:m[0], t:m[1], dis:m[0] === "custom" && S.mode !== "compare" }; }); }
  // H⁺ calculator (Compare mode, custom values)
  var K = C.calc;
  $("#ac-calc", host).innerHTML = '<fieldset class="ac-calc"><legend>' + K.title + '</legend><div id="ac-sn"></div><div id="ac-sf"></div><div id="ac-sa"></div><p class="ac-form" id="ac-form" aria-live="polite"></p>' +
    '<div class="numrow"><label for="ac-typed">' + K.typed + '</label><input class="numin ac-typed" id="ac-typed" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(S.typed) + '"><span>ATP</span></div></fieldset>';
  function hStep(id, key, lab, lo, hi){ return stepper($("#" + id, host), { id:id + "v", label:lab, min:lo, max:hi, value:S.H[key], unit:function(v){ return v + " H⁺"; }, onChange:function(v){ stopAnim(); S.H[key] = v; api.save(); paintAll(); setCap(srText(cfg(), S.H)); MV.changed(); } }); }
  var stN = hStep("ac-sn", "n", K.n, 6, 12), stF = hStep("ac-sf", "f", K.f, 2, 8), stA = hStep("ac-sa", "a", K.a, 3, 6);
  $("#ac-typed", host).addEventListener("input", function(e){ S.typed = e.target.value; api.save(); MV.changed(); });

  function setCap(t){ capEl.textContent = MV.plain(t || ""); }
  function setMode(m){
    stopAnim(); S.mode = m; hide = false; glow = false;
    if (m !== "compare" && S.L[0].vals === "custom") S.L[0].vals = "cur";
    api.save(); paintAll(); MV.changed();
    setCap(m === "build" ? (allOk() ? B.done : C.modeHelp.build) : m === "explain" ? stepCap() : cmpCap());
  }
  function allOk(){ return S.bok.g && S.bok.p && S.bok.k; }
  function stepCap(){
    var st = C.steps[S.step], c = cfg();
    if (S.step === 4) return c.org !== "euk" ? st.capPro : c.shut === "gp" ? st.capGp : st.capMa;
    if (S.step === 5) return st.cap + " " + sumLine(led(c, S.H)) + " ATP per glucose.";
    return st.cap;
  }
  function cmpCap(){ var a = led(S.L[0], S.H), b = led(S.L[1], S.H), d = b.tot - a.tot; return "Ledger A: " + fx(a.tot) + " ATP. Ledger B: " + fx(b.tot) + " ATP. Ledger B − Ledger A = " + (d > 1e-9 ? "+" : d < -1e-9 ? "−" : "") + fx(Math.abs(d)) + " ATP per glucose."; }

  // ---- painting ----
  function paintCtrl(){
    var c = cfg();
    modeR.set(S.mode); edR.set(String(S.ed)); valR.setOptions(valOpts()); orgR.set(c.org); valR.set(c.vals); shR.set(c.shut);
    $("#ac-ed", host).hidden = S.mode !== "compare";
    $("#ac-shut", host).hidden = c.org !== "euk";
    $("#ac-calc", host).hidden = !(S.mode === "compare" && c.vals === "custom");
    $("#ac-mhelp", host).textContent = C.modeHelp[S.mode];
    stN.set(S.H.n); stF.set(S.H.f); stA.set(S.H.a);
    var r = led({ org:"pro", vals:"custom" }, S.H);
    $("#ac-form", host).textContent = "ATP per NADH = " + S.H.n + " ÷ " + S.H.a + " " + ex2(r.vN) + " · ATP per FADH₂ = " + S.H.f + " ÷ " + S.H.a + " " + ex2(r.vF);
  }
  function boardOpts(){
    var c = cfg(), o = { c:c, H:S.H, glow:glow };
    if (S.mode === "build") { o.rows = { g:S.bok.g ? 1 : 0, p:S.bok.p ? 1 : 0, k:S.bok.k ? 1 : 0 }; o.foot = { hide:!allOk() }; }
    else if (S.mode === "explain") { var s = S.step; o.rows = { g:s >= 1 ? 1 : 0, p:s >= 2 ? 1 : 0, k:s >= 3 ? 1 : 0 }; o.sk = c.org === "euk" && s >= 4 ? 1 : 0; o.foot = { hide:s < 5 }; if (s < 4 && c.org === "euk") o.foot.nN = 10, o.foot.nF = 2; }
    else o.foot = {};
    if (hide) o.foot.hide = true;
    if (disp.rows) o.rows = disp.rows;
    if (disp.sk != null) o.sk = disp.sk;
    if (disp.memA != null) o.memA = disp.memA;
    if (disp.foot) Object.keys(disp.foot).forEach(function(k){ o.foot[k] = disp.foot[k]; });
    return o;
  }
  function boardAria(){
    var c = cfg();
    if (S.mode === "build" && !allOk()) return "Token board: tokens appear as you check each ledger row correctly. Rows checked: " + (["g", "p", "k"].filter(function(k){ return S.bok[k]; }).map(function(k){ return byId(C.stages, k).name; }).join(", ") || "none") + ".";
    if (S.mode === "explain" && S.step < 5) return "Token board, step " + (S.step + 1) + " of 6: " + MV.plain(stepCap());
    if (hide) return "Token board: 4 ATP, 10 NADH and 2 FADH₂ tokens. The total is hidden until you predict.";
    return "Token board. " + srText(c, S.H) + (c.org === "euk" && c.shut === "gp" ? " The 2 cytosolic NADH passed through the shuttle gate and are now counted as FADH₂." : "");
  }
  function paintBoard(){ svg.innerHTML = boardSVG(boardOpts()); svg.setAttribute("aria-label", boardAria()); }
  function cell(v, lab){ return '<td data-l="' + MV.esc(lab) + '">' + v + "</td>"; }
  function paintLedger(){
    var box = $("#ac-ledger", host), c = cfg(), r = led(c, S.H), euk = c.org === "euk", bm = S.mode === "build", s = S.mode === "explain" ? S.step : 9;
    if (S.mode === "compare") { box.innerHTML = ""; return; }
    var h = '<div class="ac-lw"><table class="ac-led' + (bm ? " ac-bm" : "") + '"><caption class="vh">ATP ledger for one glucose</caption><thead><tr><th scope="col">Stage</th><th scope="col">Where</th>' + C.cols.map(function(x){ return '<th scope="col">' + x + "</th>"; }).join("") + (bm ? '<th scope="col"><span class="vh">Check</span></th>' : "") + "</tr></thead><tbody>";
    C.stages.forEach(function(st, i){
      var where = euk ? st.where : "Cytoplasm", vis = s >= i + 1;
      h += '<tr data-row="' + st.id + '"' + (bm && S.bok[st.id] ? ' class="ac-ok"' : "") + '><th scope="row">' + st.name + "</th>" + cell(where, "Where");
      st.vals.forEach(function(v, j){
        if (bm) {
          var done = S.bok[st.id];
          h += '<td data-l="' + MV.esc(C.cols[j]) + '"><input class="numin ac-in" type="text" inputmode="decimal" autocomplete="off" data-bi="' + st.id + j + '" data-k="bi' + st.id + j + '" aria-label="' + MV.esc(st.name + ": " + MV.plain(C.cols[j])) + '" value="' + MV.esc(S.b[st.id][j]) + '"' + (done ? " disabled" : "") + "></td>";
        } else h += cell(vis ? v + (st.id === "g" && j === 1 && euk ? " (cytosolic)" : "") : '<span class="muted">…</span>', C.cols[j]);
      });
      if (bm) h += '<td class="ac-chkc">' + (S.bok[st.id] ? '<span class="ac-okm">✓ Right</span>' : '<button type="button" class="btn sm" data-chk="' + st.id + '" data-k="chk' + st.id + '">Check row</button>') + "</td>";
      h += "</tr>";
      if (bm && rowMsg[st.id]) h += '<tr class="ac-fbr"><td colspan="6"><div class="fb ' + rowMsg[st.id][0] + '" role="status"><p>' + rowMsg[st.id][1] + "</p></div></td></tr>";
    });
    var tv = bm ? buildSums() : s >= 3 ? [4, 10, 2] : null;
    h += '<tr class="ac-tot"><th scope="row">Totals</th><td data-l="Where" class="ac-wh"></td>' + [0, 1, 2].map(function(j){ return '<td data-l="' + MV.esc(C.cols[j]) + '" data-tot="' + j + '">' + (tv ? tv[j] : '<span class="muted">…</span>') + "</td>"; }).join("") +
      (bm ? "<td></td>" : "") + '<td class="ac-ph" data-l="Total ATP per glucose">' + (convShown() ? (hide ? "?" : fx(r.tot)) : '<span class="muted">…</span>') + "</td></tr></tbody></table></div>";
    // conversion rows (live)
    var cv = [shuttleRow(c), r.nN + " × " + fv(r.vN) + " " + ex1(r.aN), r.nF + " × " + fv(r.vF) + " " + ex1(r.aF), sumLine(r) + " ATP per glucose"];
    h += '<dl class="ac-conv" aria-live="polite">' + C.conv.map(function(lab, i){
      var shown = bm ? allOk() : i === 0 ? s >= 4 : s >= 5, val = !shown ? '<span class="muted">' + (bm ? "check all three rows first" : "…") + "</span>" : hide && i > 0 ? "?" : cv[i];
      return '<div class="' + (i === 3 ? "ac-cvt" : "") + '"><dt>' + lab + "</dt><dd>" + val + "</dd></div>";
    }).join("") + "</dl>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  function convShown(){ return S.mode === "build" ? allOk() : S.mode === "explain" ? S.step >= 5 : true; }
  function buildSums(){
    return [0, 1, 2].map(function(j){ var t = 0, ok = true; C.stages.forEach(function(st){ var v = parseTyped(S.b[st.id][j]); if (v == null) ok = false; else t += v; }); return ok ? MV.num(t) : '<span class="muted">?</span>'; });
  }
  function paintSteps(){
    var box = $("#ac-steps", host);
    if (S.mode !== "explain") { box.innerHTML = ""; return; }
    var h = '<button type="button" class="btn ghost sm" data-st="back" data-k="stback"' + (S.step <= 0 || busy ? " disabled" : "") + '>Back</button><span class="ac-stc" aria-live="polite">Step ' + (S.step + 1) + " of " + C.steps.length + ": " + C.steps[S.step].t + "</span>" +
      '<button type="button" class="btn primary sm" data-st="next" data-k="stnext"' + (S.step >= C.steps.length - 1 || busy ? " disabled" : "") + ">Next stage</button>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  function cardHTML(i){
    var c = S.L[i], r = led(c, S.H), on = S.ed === i, nm = i ? "Ledger B" : "Ledger A";
    return '<section class="ac-card' + (on ? " on" : "") + '" aria-label="' + nm + '"><h4>' + nm + (on ? ' <span class="tiny muted">(the settings change this one)</span>' : "") + '</h4><p class="ac-as">' + assume(c, S.H) + '</p><dl class="ac-cd">' +
      "<div><dt>Substrate-level ATP</dt><dd>4</dd></div><div><dt>NADH</dt><dd>" + r.nN + " × " + fv(r.vN) + " " + ex1(r.aN) + "</dd></div><div><dt>FADH₂</dt><dd>" + r.nF + " × " + fv(r.vF) + " " + ex1(r.aF) + '</dd></div><div class="ac-ct"><dt>Total</dt><dd>' + fx(r.tot) + " ATP</dd></div></dl></section>";
  }
  function paintCmp(){
    var box = $("#ac-cmp", host);
    if (S.mode !== "compare") { box.innerHTML = ""; return; }
    box.innerHTML = '<div class="ac-cmps">' + cardHTML(0) + cardHTML(1) + '</div><p class="ac-diff" aria-live="polite">' + cmpCap() + "</p>";
  }
  function paintRead(){
    var c = cfg(), r = led(c, S.H), lab = C.readout, ok = convShown() && !hide && !anim, rows = [];
    var q = hide ? "? (make your prediction)" : anim ? "…" : '<span class="muted">' + (S.mode === "build" ? "check all three rows first" : "step to the end") + "</span>";
    rows.push([lab[0], "4"]);
    rows.push([lab[1], convShown() || S.mode === "explain" && S.step >= 4 ? String(r.nN) : q]);
    rows.push([lab[2], convShown() || S.mode === "explain" && S.step >= 4 ? String(r.nF) : q]);
    rows.push([lab[3], ok ? fx(r.aN) : q]);
    rows.push([lab[4], ok ? fx(r.aF) : q]);
    rows.push([lab[5], ok ? "<strong>" + fx(r.tot) + "</strong>" : q]);
    rows.push([lab[6], ok ? energy(r.tot) : q]);
    rows.push([lab[7], assume(c, S.H)]);
    readEl.innerHTML = MV.readoutHTML(rows);
  }
  function paintAll(){ paintCtrl(); paintBoard(); paintSteps(); paintLedger(); paintCmp(); paintRead(); }

  // ---- animation ----
  function stopAnim(){
    if (anim) { anim(); anim = null; }
    disp = {}; busy = false; readEl.setAttribute("aria-live", "polite");
    if (pend) { var d = pend; pend = null; d(); }
  }
  function seqRun(steps, fin){
    var i = 0;
    function next(){ if (i >= steps.length) { anim = null; fin(); return; } var s = steps[i++]; anim = MV.tween({ dur:s.dur, ease:s.ease || MV.ease, step:s.step, done:next }); }
    next();
  }
  // b → a (configs of the active ledger; H unchanged): shuttle through the gate, flip the converter tile, tick the products and total
  function transition(b, a, slow, fin){
    var rb = led(b, S.H), ra = led(a, S.H), seq = [], f = { nN:rb.nN, nF:rb.nF, aN:rb.aN, aF:rb.aF, tot:rb.tot, tile:[rb.vN, rb.vF], tick:true };
    var shut = a.org === "euk" && (b.org !== "euk" || b.shut !== a.shut), memIn = a.org === "euk" && b.org !== "euk", vch = !same(rb.vN, ra.vN) || !same(rb.vF, ra.vF), totCh = !same(rb.tot, ra.tot);
    var vis = boardOpts(), rowsOn = vis.rows ? vis.rows.g : 1;
    disp = { foot:f };
    if (shut && rowsOn) { disp.sk = 0; if (memIn) disp.memA = 0; seq.push({ dur:slow ? 2000 : 1100, ease:lin, step:function(k){ disp.sk = k; if (memIn) disp.memA = Math.min(1, k * 4); paintBoard(); } }); }
    seq.push({ dur:0, step:function(){ f.nN = ra.nN; f.nF = ra.nF; delete disp.sk; delete disp.memA; paintBoard(); } });
    if (vch) seq.push({ dur:slow ? 900 : 600, step:function(k){ f.flip = { from:[rb.vN, rb.vF], k:k }; f.tile = [ra.vN, ra.vF]; paintBoard(); } });
    seq.push({ dur:0, step:function(){ delete f.flip; f.tile = [ra.vN, ra.vF]; } });
    if (totCh || vch) seq.push({ dur:slow ? 1300 : 800, step:function(k){ f.aN = lerp(rb.aN, ra.aN, k); f.aF = lerp(rb.aF, ra.aF, k); f.tot = lerp(rb.tot, ra.tot, k); paintBoard(); } });
    busy = true; paintSteps();
    seqRun(seq, function(){ disp = {}; busy = false; paintBoard(); paintSteps(); paintRead(); if (fin) fin(); });
  }
  function change(patch){
    stopAnim();
    var i = ai(), b = Object.assign({}, S.L[i]);
    Object.keys(patch).forEach(function(k){ S.L[i][k] = patch[k]; });
    hide = false; glow = false;
    api.save(); paintCtrl(); paintLedger(); paintCmp(); MV.changed();
    var a = S.L[i];
    setCap(S.mode === "explain" ? stepCap() : srText(a, S.H));
    readEl.setAttribute("aria-live", "off");
    transition(b, a, false, function(){ readEl.setAttribute("aria-live", "polite"); paintRead(); });
    paintRead();
  }
  // Explain mode: Back / Next stage (the next stage's tokens fade in; the shuttle step slides the cytosolic NADH; the last step ticks the total)
  $("#ac-steps", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-st]"); if (!b || b.disabled) return;
    stopAnim(); hide = false; glow = false;
    if (b.dataset.st === "back") { S.step = Math.max(0, S.step - 1); api.save(); paintAll(); setCap(stepCap()); return; }
    S.step = Math.min(C.steps.length - 1, S.step + 1); api.save();
    var s = S.step, c = cfg(), r = led(c, S.H), rows = { g:s >= 2 ? 1 : 0, p:s >= 3 ? 1 : 0, k:0 }, key = ["", "g", "p", "k"][s], steps = [];
    busy = true; paintAll(); setCap(stepCap());
    if (key) { disp.rows = rows; steps.push({ dur:650, step:function(k){ rows[key] = k; paintBoard(); } }); }
    else if (s === 4 && c.org === "euk") { disp.sk = 0; disp.foot = { nN:10, nF:2 }; steps.push({ dur:1400, ease:lin, step:function(k){ disp.sk = k; paintBoard(); } }); }
    else if (s === 5) { var f = { aN:0, aF:0, tot:0, tick:true }; disp.foot = f; steps.push({ dur:1000, step:function(k){ f.aN = r.aN * k; f.aF = r.aF * k; f.tot = 4 + (r.tot - 4) * k; paintBoard(); } }); }
    readEl.setAttribute("aria-live", "off");
    seqRun(steps, function(){ disp = {}; busy = false; readEl.setAttribute("aria-live", "polite"); paintAll(); });
  });
  // Build mode: typing updates the totals row; Check row judges one stage
  var ledBox = $("#ac-ledger", host);
  ledBox.addEventListener("input", function(e){
    var id = e.target.dataset && e.target.dataset.bi; if (!id) return;
    S.b[id[0]][+id[1]] = e.target.value; api.save();
    var sums = buildSums(); $$("[data-tot]", ledBox).forEach(function(td){ td.innerHTML = sums[+td.dataset.tot]; });
    MV.changed();
  });
  ledBox.addEventListener("keydown", function(e){ var id = e.target.dataset && e.target.dataset.bi; if (e.key === "Enter" && id) { var b = $('[data-chk="' + id[0] + '"]', ledBox); if (b) b.click(); } });
  ledBox.addEventListener("click", function(e){
    var b = e.target.closest("[data-chk]"); if (!b) return;
    e.stopPropagation();
    var id = b.dataset.chk, res = judgeRow(id);
    if (res.ok) { S.bok[id] = true; rowMsg[id] = ["good", "<strong>✓ Correct.</strong> " + B.right[id] + (allOk() ? " " + B.done : "")]; }
    else {
      rowMsg[id] = ["bad", "<strong>✗ Not quite.</strong> " + res.msg];
      // the plan's TC2 asks for every row right "on the first check": a wrong row check counts as a try on that challenge
      if (!res.blank && MV.S && MV.S.chal) { var cs = MV.S.chal.tc2 || (MV.S.chal.tc2 = { tries:0, hint:0, solved:false, first:null }); if (!cs.solved) cs.tries++; }
    }
    api.save(); paintBoard(); paintLedger(); paintRead(); MV.changed();
    if (res.ok && allOk()) setCap(B.done);
    var row = $('[data-row="' + id + '"]', ledBox), nx = row && row.nextElementSibling;
    MV.focusFb(nx && nx.classList.contains("ac-fbr") ? nx : ledBox);
  });
  function judgeRow(id){
    var st = byId(C.stages, id), v = S.b[id].map(parseTyped);
    if (v.some(function(x){ return x == null; })) return { ok:false, blank:true, msg:B.blank };
    if (v.every(function(x, j){ return same(x, st.vals[j]); })) return { ok:true };
    if (id === "g" && same(v[0], 4)) return { ok:false, msg:B.named.g0 };
    if (id === "p" && same(v[1], 0)) return { ok:false, msg:B.named.p1 };
    if (id === "k" && v[2] === 1 && ((v[0] === 1 && v[1] === 3) || (v[0] === 3 && v[1] === 1))) return { ok:false, msg:B.named.k };
    var bad = st.vals.map(function(x, j){ return same(v[j], x) ? null : MV.plain(C.cols[j]); }).filter(Boolean);
    return { ok:false, msg:"Check the " + bad.join(" and ") + " box" + (bad.length > 1 ? "es" : "") + " in this row. Try again." };
  }

  paintAll();
  setCap(S.mode === "build" ? (allOk() ? B.done : C.modeHelp.build) : S.mode === "explain" ? stepCap() : cmpCap());

  // ---- challenges ----
  function chal(id){
    var c = byId(C.challenges, id), W = c.wrong;
    if (id === "tc1") {
      var cf = cfg(), r = led(cf, S.H);
      if (same(r.tot, 32)) return { ok:true };
      if (cf.vals === "cur" && cf.org === "euk" && cf.shut === "gp") return { ok:false, msg:W.gp };
      if (cf.vals === "theo") return { ok:false, msg:W.theo };
      return { ok:false, msg:"That gives " + fx(r.tot) + " ATP per glucose." };
    }
    if (id === "tc2") {
      if (S.mode !== "build") return { ok:false, msg:W.mode };
      var named = null, blank = false, all = true;
      C.stages.forEach(function(st){ var j = judgeRow(st.id); if (!j.ok) { all = false; if (j.blank) blank = true; else if (!named && j.msg.indexOf("Check the") !== 0) named = j.msg; } });
      if (all) return { ok:true };
      if (named) return { ok:false, msg:named };
      return { ok:false, msg:blank ? W.blank : W.other };
    }
    if (id === "tc3") {
      if (S.mode !== "compare") return { ok:false, msg:W.mode };
      var t = parseTyped(S.typed);
      if (t != null && same(t, 22.4)) return { ok:false, msg:W.t224 };
      if (t != null && same(t, 32)) return { ok:false, msg:W.t32 };
      if (t != null && same(t, 26)) return { ok:false, msg:W.t26 };
      var cu = [0, 1].filter(function(i){ return S.L[i].vals === "custom"; });
      if (!cu.length) return { ok:false, msg:W.custom };
      if (!cu.some(function(i){ return S.L[i].org === "pro"; })) return { ok:false, msg:W.org };
      if (S.H.n !== 10 || S.H.f !== 6 || S.H.a !== 5) return { ok:false, msg:W.set };
      if (t == null) return { ok:false, msg:String(S.typed || "").trim() ? W.fmt : W.typed };
      if (same(t, 26.4)) return { ok:true };
      return { ok:false, msg:W.other };
    }
    return { ok:false };
  }

  return {
    predict:{
      start:function(p){
        stopAnim();
        S.mode = "explain"; S.step = 5; S.L[0] = Object.assign({}, p.start);
        hide = !!p.hide; glow = false;
        api.save(); paintAll(); setCap(hide ? "Prokaryote, theoretical values. Make your prediction." : srText(cfg(), S.H)); MV.changed();
      },
      run:function(p, done){
        pend = done;
        readEl.setAttribute("aria-live", "off");
        function fin(){ hide = false; var d = pend; pend = null; readEl.setAttribute("aria-live", "polite"); paintAll(); setCap(p.reveal + " " + srText(cfg(), S.H)); MV.changed(); if (d) MV.wait(350, d); }
        if (p.cycle) {
          var list = [{ org:"pro", vals:"theo", shut:"gp" }, { org:"euk", vals:"theo", shut:"gp" }, { org:"pro", vals:"cur", shut:"gp" }, { org:"euk", vals:"cur", shut:"gp" }];
          glow = true; busy = true; paintSteps();
          seqRun(list.map(function(cf){ var on = false; return { dur:1300, ease:lin, step:function(){ if (on) return; on = true; S.L[0] = Object.assign({}, cf); paintCtrl(); paintLedger(); paintBoard(); paintRead(); setCap(fx(led(cf, S.H).tot) + " ATP (" + assume(cf, S.H) + "). Substrate-level: still 4."); } }; }), function(){ busy = false; api.save(); fin(); });
        } else if (p.to) {
          var b = Object.assign({}, S.L[0]);
          Object.keys(p.to).forEach(function(k){ S.L[0][k] = p.to[k]; });
          api.save(); hide = true; paintCtrl(); paintLedger(); paintRead(); hide = false; MV.changed();
          setCap(p.reveal);
          transition(b, S.L[0], true, fin);
        } else {
          var r = led(cfg(), S.H), f = { aN:0, aF:0, tot:0, tick:true };
          hide = false; disp = { foot:f }; busy = true; setCap(p.reveal);
          seqRun([{ dur:1800, step:function(k){ f.aN = r.aN * k; f.aF = r.aF * k; f.tot = 4 + (r.tot - 4) * k; paintBoard(); } }], function(){ disp = {}; busy = false; fin(); });
        }
      }
    },
    challenge:chal
  };
}

// ---------- @component hDotBudget — H⁺ dots for each carrier, grouped by the H⁺ cost of one ATP (dashed slots show a part group),
// with an ATP token under each group (Part 3 station 1 and the task preview). o = {rows:[{lab, n}], per, k (0 = in a line, 1 = grouped), notes, atpA} ----------
function budgetSVG(o){
  var per = o.per, sp = per >= 5 ? 17 : 20, gw = per * sp + 14, h = "", k = o.k, aa = o.atpA == null ? (k >= 1 ? 1 : 0) : o.atpA;
  o.rows.forEach(function(r, ri){
    var y = 52 + ri * 112, groups = Math.ceil(r.n / per), g;
    h += pill(r.lab, 54, y) + txt(54, y + 28, r.n + " H⁺", "ac-bl", "middle");
    if (aa > 0.02) {
      var bx = "";
      for (g = 0; g < groups; g++) {
        var x0 = 112 + g * gw, inG = Math.min(per, r.n - g * per), full = inG === per;
        bx += sv("rect", { x:x0, y:y - 13, width:per * sp + 4, height:26, rx:8, "class":full ? "ac-gbox" : "ac-gbox ac-gpart" });
        for (var m = inG; m < per; m++) bx += sv("circle", { cx:x0 + 2 + m * sp + sp / 2, cy:y, r:6, "class":"ac-hslot" });
        var lab = full ? "ATP" : fracTxt(inG, per) + " ATP", w = full ? 44 : 54, cx = x0 + 2 + per * sp / 2;
        bx += '<g transform="translate(' + f1(cx) + "," + (y + 32) + ')"><rect x="' + (-w / 2) + '" y="-9.5" width="' + w + '" height="19" rx="9.5" style="fill:var(--bio-atp)"/><text y="4" text-anchor="middle" class="ac-tokt">' + lab + "</text></g>";
      }
      bx += txt(54, y + 52, ex2(r.n / per) + " ATP", "ac-br", "middle");
      if (o.notes && ri === 0 && per === 4) {
        var a0 = 112 + 2 + sp / 2, a2 = 112 + 2 + 2 * sp + sp / 2, a3 = 112 + 2 + 3 * sp + sp / 2;
        bx += sv("path", { d:"M" + f1(a0 - 6) + " " + (y - 18) + " V" + (y - 22) + " H" + f1(a2 + 6) + " V" + (y - 18), "class":"ac-brk" }) + txt(a2 + 6, y - 27, "≈ 3 H⁺: turn the synthase", "ac-bn", "end") +
          sv("path", { d:"M" + f1(a3) + " " + (y - 15) + " L" + f1(a3 + 14) + " " + (y - 33), "class":"ac-brk" }) + txt(a3 + 18, y - 34, "≈ 1 H⁺: transport", "ac-bn");
      }
      h += grp(aa, bx);
    }
    for (var i = 0; i < r.n; i++) {
      g = Math.floor(i / per);
      var xl = 118 + i * 22, xg = 112 + g * gw + 2 + (i % per) * sp + sp / 2;
      h += sv("circle", { cx:lerp(xl, xg, k), cy:y, r:6.5, "class":"ac-hdot" });
    }
  });
  return h;
}

// ---------- Part 3: Why the real count is lower ----------
function part3(host, api){
  var C = api.content, S = api.S, B = C.budget, L = C.leak, D = C.data;
  if (S.spent == null) S.spent = false; if (S.leak == null) S.leak = 0; S.dp = S.dp || {};
  var rowsB = B.rows.map(function(r){ return { lab:r[0], n:r[1] }; }), busy = false;
  host.innerHTML = '<div class="ac-p3">' +
    '<div class="ac-st"><h3>' + B.title + '</h3><details class="alg" open><summary>' + B.panel + "</summary><p>" + B.how + '</p><div class="ac-bstage"><svg id="ac-bsvg" viewBox="0 0 420 232" role="img" focusable="false"></svg></div>' +
      '<p class="tiny ac-legend"><svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true"><circle cx="7" cy="7" r="5" class="ac-hdot"/></svg> one H⁺ · each group of 4: ' + B.group + '</p><div class="q-actions" id="ac-bbtn"></div><p class="ac-bres" id="ac-bres" aria-live="polite"></p><p>' + B.text + "</p></details></div>" +
    '<div class="ac-st"><h3>' + L.title + "</h3><p>" + L.how + '</p><div id="ac-ldial"></div><div class="ac-lbar" id="ac-lbar" role="img"><i class="ac-ls"></i><i class="ac-lc"></i><i class="ac-ll"></i></div>' +
      '<p class="ac-lkey tiny" id="ac-lkey"></p><p class="ac-leq" id="ac-leq" aria-live="polite"></p><p>' + L.text + "</p></div>" +
    '<div class="ac-st"><h3>' + D.title + '</h3><details class="alg" open><summary>' + D.panel + "</summary><p>" + D.intro + "</p>" +
      '<div class="tbl-wrap"><table class="ac-po"><caption class="vh">P/O ratios, model data</caption><thead><tr>' + D.head.map(function(c){ return '<th scope="col">' + c + "</th>"; }).join("") + "</tr></thead><tbody>" +
      D.rows.map(function(r){ return "<tr><th scope=\"row\">" + r[0] + "</th><td>" + r[1] + "</td><td>" + r[2] + "</td></tr>"; }).join("") + '</tbody></table></div><p class="tiny"><span class="bio-model">Model data</span> ' + D.note + "</p>" +
      D.prompts.map(function(q, i){ return '<div class="q ac-dq" data-dp="' + q.id + '"></div>'; }).join("") + "</details></div></div>";

  // Station 1: spend the H⁺ in groups of four
  var bsvg = $("#ac-bsvg", host);
  function drawB(k, aa){ bsvg.innerHTML = budgetSVG({ rows:rowsB, per:4, k:k, atpA:aa, notes:true }); }
  function ariaB(){ bsvg.setAttribute("aria-label", S.spent ? "NADH’s 10 H⁺ dots are grouped in fours: 2 full groups and a half group, so 2.5 ATP. FADH₂’s 6 H⁺ dots make 1 full group and a half group: 1.5 ATP. In each group, about 3 H⁺ turn ATP synthase and about 1 pays for transport." : "Two rows of magenta H⁺ dots: 10 for one NADH and 6 for one FADH₂."); }
  function paintBtn(){ var b = $("#ac-bbtn", host); MV.keepFocus(b, function(){ b.innerHTML = '<button type="button" class="btn ' + (S.spent ? "ghost" : "primary") + ' sm" data-k="acspend" id="ac-spend"' + (busy ? " disabled" : "") + ">" + (S.spent ? B.reset : B.spend) + "</button>"; }); $("#ac-bres", host).textContent = S.spent && !busy ? MV.plain(B.result) : ""; }
  $("#ac-bbtn", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (S.spent) { S.spent = false; api.save(); drawB(0, 0); ariaB(); paintBtn(); return; }
    S.spent = true; api.save(); busy = true; paintBtn();
    MV.tween({ dur:1300, step:function(k){ drawB(k, 0); }, done:function(){
      MV.tween({ dur:500, step:function(k){ drawB(1, k); }, done:function(){ busy = false; drawB(1, 1); ariaB(); paintBtn(); } });
    } });
  });
  drawB(S.spent ? 1 : 0, S.spent ? 1 : 0); ariaB(); paintBtn();

  // Station 2: leak dial (eukaryote, current values, malate–aspartate: 4 + 28 × (1 − leak))
  function paintLeak(){
    var lk = S.leak, car = 28 * (1 - lk / 100), lost = 28 - car, tot = 4 + car, sc = 100 / 32;
    var bar = $("#ac-lbar", host), is = bar.querySelectorAll("i");
    is[0].style.width = f1(4 * sc) + "%"; is[1].style.width = f1(car * sc) + "%"; is[2].style.width = f1(lost * sc) + "%";
    bar.setAttribute("aria-label", "Bar of ATP per glucose: 4 substrate-level, " + MV.num(car) + " from carriers" + (lost ? ", and " + MV.num(lost) + " lost to the leak as heat" : "") + ".");
    $("#ac-lkey", host).innerHTML = '<span><i class="ac-lsw ac-ls" aria-hidden="true"></i>substrate-level: <b>4</b></span><span><i class="ac-lsw ac-lc" aria-hidden="true"></i>from carriers: <b>' + MV.num(car) + '</b></span><span><i class="ac-lsw ac-ll" aria-hidden="true"></i>lost to the leak (heat): <b>' + MV.num(lost) + "</b></span>";
    $("#ac-leq", host).innerHTML = "Leak " + lk + "%: total = " + (lk ? "4 + 28 × " + MV.num(1 - lk / 100) + " = 4 + " + MV.num(car) + " = " : "4 + 28 = ") + "<strong>" + MV.num(tot) + "</strong> ATP per glucose";
  }
  radios($("#ac-ldial", host), { label:"Leak of pumped H⁺", key:"lk", options:L.levels.map(function(l){ return { id:String(l[0]), t:l[1] }; }), value:String(S.leak), onChange:function(v){ S.leak = +v; api.save(); paintLeak(); } });
  paintLeak();

  // Station 3: data prompts (chips; feedback on each tap)
  function paintQ(q){
    var st = S.dp[q.id] || {}, box = $('[data-dp="' + q.id + '"]', host), i = D.prompts.indexOf(q);
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + q.q + '</div></div><div class="chips" role="group" aria-label="Choices for prompt ' + (i + 1) + '">' +
      MV.shuffle(q.chips.map(function(c, j){ return j; }), "ac" + q.id).map(function(j){ var c = q.chips[j], on = st.pick === j; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-dc="' + j + '" data-k="dc' + q.id + j + '"' + (st.solved ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
    if (st.pick != null) { var c = q.chips[st.pick], ok = MV.ok(c); h += MV.fbHTML(ok ? "good" : "bad", "<strong>" + (ok ? "✓ Correct." : "✗ Not quite.") + "</strong> " + c.fb + (ok ? "" : " Try another.")); }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  D.prompts.forEach(function(q){
    var box = $('[data-dp="' + q.id + '"]', host);
    box.addEventListener("click", function(e){
      var b = e.target.closest("[data-dc]"); if (!b || b.disabled) return;
      var st = S.dp[q.id] || (S.dp[q.id] = {}), j = +b.dataset.dc;
      st.pick = j; if (MV.ok(q.chips[j])) st.solved = true; else st.tries = (st.tries || 0) + 1;
      api.save(); paintQ(q); MV.focusFb(box);
    });
    paintQ(q);
  });
}

// ---------- Performance task: Design an ATP budget (chip rows + H⁺ budget preview + live readouts) ----------
var task = (function(){
  var api = null, NS = [6, 8, 10, 12, 14], FS = [2, 4, 6, 8, 10], HS = [3, 4, 5, 6];
  function st(){ var s = api.S; if (s.n == null) s.n = 6; if (s.f == null) s.f = 2; if (s.h == null) s.h = 3; return s; }
  function read(){ if (!api) return { n:6, f:2, h:3 }; var s = st(); return { n:+s.n, f:+s.f, h:+s.h }; }
  function tot(d){ return 4 + (10 * d.n + 2 * d.f) / d.h; }
  function parse(k){ var m = /n(\d+)-f(\d+)-h(\d+)/.exec(k) || [0, 0, 0, 1]; return { n:+m[1], f:+m[2], h:+m[3] }; }
  function lab(k){ var q = parse(k); return "NADH " + q.n + ", FADH₂ " + q.f + ", " + q.h + " H⁺ per ATP (total " + fx(tot(q)) + ")"; }
  function draw(){
    var d = read(), t = $("#ac-tsvg"); if (!t) return;
    var gw = d.h * (d.h >= 5 ? 17 : 20) + 14;
    t.setAttribute("viewBox", "0 0 " + Math.max(420, 112 + Math.ceil(d.n / d.h) * gw + 4) + " 232");
    t.innerHTML = budgetSVG({ rows:[{ lab:"NADH", n:d.n }, { lab:"FADH₂", n:d.f }], per:d.h, k:1 });
    t.setAttribute("aria-label", "H⁺ budget: NADH’s " + d.n + " H⁺ and FADH₂’s " + d.f + " H⁺ grouped in " + d.h + "s, one ATP per group: " + say(fv(d.n / d.h)) + " ATP per NADH and " + say(fv(d.f / d.h)) + " ATP per FADH₂.");
    $("#ac-tread").innerHTML = MV.readoutHTML([["ATP per NADH", d.n + " ÷ " + d.h + " " + ex2(d.n / d.h)], ["ATP per FADH₂", d.f + " ÷ " + d.h + " " + ex2(d.f / d.h)],
      ["Total ATP per glucose", "4 + 10 × " + fv(d.n / d.h) + " + 2 × " + fv(d.f / d.h) + " " + (isExact(tot(d), 1) ? "= " : "≈ ") + "<strong>" + MV.num(Math.round(tot(d) * 10) / 10, 1) + "</strong>"]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; var s = st();
      inp.innerHTML = '<div class="ac-tin"><div id="ac-tn"></div><div id="ac-tf"></div><div id="ac-th"></div></div>';
      function upd(){ a.save(); draw(); a.update(); }
      radios($("#ac-tn"), { label:"H⁺ per NADH", key:"tn", cls:"chips", options:NS.map(function(v){ return { id:String(v), t:String(v) }; }), value:String(s.n), onChange:function(v){ s.n = +v; upd(); } });
      radios($("#ac-tf"), { label:"H⁺ per FADH₂", key:"tf", cls:"chips", options:FS.map(function(v){ return { id:String(v), t:String(v) }; }), value:String(s.f), onChange:function(v){ s.f = +v; upd(); } });
      radios($("#ac-th"), { label:"H⁺ per ATP", key:"th", cls:"chips", options:HS.map(function(v){ return { id:String(v), t:String(v) }; }), value:String(s.h), onChange:function(v){ s.h = +v; upd(); } });
      pv.innerHTML = '<div class="ac-tpv"><h4>Live readouts</h4><div class="ac-bstage"><svg id="ac-tsvg" viewBox="0 0 420 232" role="img" focusable="false"></svg></div><dl class="read" id="ac-tread" aria-live="polite"></dl></div>';
      draw();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var t = tot(d); return [t >= 30 - 1e-9 && t <= 34 + 1e-9, d.f === d.n - 4, d.h >= 4]; },
    key:function(d){ return "n" + d.n + "-f" + d.f + "-h" + d.h; },
    label:lab,
    text:lab
  };
})();

// ---------- hero: columns fill → ×3 / ×2 gives 38 → shuttle gate: 36 → tile flips: 32 → shuttle: 30 → the four totals ----------
function hero(f){
  var box = $("#ac-hero"); if (!box) return;
  var cap = f && f.cap, H = { n:10, f:6, a:4 }, lastCap = -1;
  box.innerHTML = '<svg viewBox="0 0 520 272" aria-hidden="true" focusable="false"></svg>';
  var svg = $("svg", box);
  var CAPS = [
    "One glucose: three stages fill the columns with 4 ATP, 10 NADH and 2 FADH₂.",
    "Theoretical values (× 3 and × 2), no shuttle: 4 + 30 + 4 = 38.",
    "In a eukaryote, 2 cytosolic NADH pass the glycerol-phosphate shuttle and count as FADH₂: 36.",
    "Current values (× 2.5 and × 1.5), no shuttle cost: 32.",
    "Current values with the glycerol-phosphate shuttle: 30.",
    "Same glucose. Different assumptions."];
  function setCap(i){ if (cap && i !== lastCap) { cap.textContent = CAPS[i]; lastCap = i; } }
  var P = { org:"pro", vals:"theo", shut:"gp" }, E = { org:"euk", vals:"theo", shut:"gp" }, PC = { org:"pro", vals:"cur", shut:"gp" }, EC = { org:"euk", vals:"cur", shut:"gp" };
  function finalFrame(){ svg.innerHTML = boardSVG({ c:EC, H:H, four:true }); setCap(5); }
  if (MV.reduceMotion) { finalFrame(); return; }
  function frameAt(T){
    var o;
    if (T < 4.6) {
      o = { c:P, H:H, rows:{ g:seg(T, 0.3, 1.0), p:seg(T, 1.2, 1.9), k:seg(T, 2.1, 2.8) }, foot:T < 3 ? false : { tot:30 * seg(T, 3.2, 4.3) + 4 + 4 * seg(T, 3.2, 4.3), aN:30 * seg(T, 3.2, 4.3), aF:4 * seg(T, 3.2, 4.3), tick:true } };
      setCap(T < 3.1 ? 0 : 1);
    } else if (T < 7.6) {
      var sk = seg(T, 5.0, 6.5), d = seg(T, 6.6, 7.3);
      o = { c:E, H:H, memA:seg(T, 4.6, 5.0), sk:sk, foot:{ nN:sk < 1 ? 10 : 8, nF:sk < 1 ? 2 : 4, aN:lerp(30, 24, d), aF:lerp(4, 8, d), tot:lerp(38, 36, d), tick:true } };
      setCap(2);
    } else if (T < 9.4) {
      var fk = seg(T, 7.9, 8.5), d2 = seg(T, 8.5, 9.2);
      o = { c:PC, H:H, memA:1 - seg(T, 7.6, 7.9), sk:0, foot:{ tile:[2.5, 1.5], flip:fk < 1 ? { from:[3, 2], k:fk } : null, nN:10, nF:2, aN:lerp(30, 25, d2), aF:lerp(4, 3, d2), tot:lerp(36, 32, d2), tick:true } };
      setCap(3);
    } else if (T < 12.2) {
      var sk2 = seg(T, 9.8, 11.2), d3 = seg(T, 11.3, 11.9);
      o = { c:EC, H:H, memA:seg(T, 9.4, 9.8), sk:sk2, foot:{ nN:sk2 < 1 ? 10 : 8, nF:sk2 < 1 ? 2 : 4, aN:lerp(25, 20, d3), aF:lerp(3, 6, d3), tot:lerp(32, 30, d3), tick:true } };
      setCap(4);
    } else { finalFrame(); return; }
    svg.innerHTML = boardSVG(o);
  }
  setCap(0); frameAt(0);
  MV.tween({ dur:13400, ease:lin, step:function(k){ frameAt(k * 13.4); }, done:finalFrame });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
