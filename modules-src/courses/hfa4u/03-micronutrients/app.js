// HFA4U 03 Micronutrients: hero (ship's log → fortified milk), Nutrient detective (Explore: case cards, retention lab,
// food records with persona Sam and the optional private self check; prediction cards; challenges), Water stations
// (Part 3: body outline, drink cards, advisory data chart), support note and private self-check summary (Reflect),
// "Nutrient-kept side dish" task with a kitchen card. Plan wording lives in content.mjs; this file adds only control labels.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function f1(v){ return String(Math.round(v * 10) / 10); }
function txt(x, y, s, cls, anchor){ return '<text class="' + cls + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "middle") + '">' + s + "</text>"; }
function lc(s){ return s.charAt(0).toLowerCase() + s.slice(1); }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }

// ---------- @component radioGroup (copied from HFA4U 02 / 01; adds a per-option class) ----------
//   Segmented control or chip row as a real radio group (arrow keys, roving tabindex). No option needs to be checked.
//   radios(host, {label, aria, options:[{id, t, cls}], value, cls:"seg"|"chips", onChange}) -> {set, get, off(ids), repaint}
//   Use a fresh host for every call: it adds its listeners to host.
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), offs = {};
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), lab = typeof o.label === "function" ? o.label() : o.label;
    host.innerHTML = '<span class="mi-rgw">' + (lab ? '<span class="mi-rgl">' + lab + "</span>" : "") + '<span class="mi-rg ' + (o.cls === "chips" ? "mi-chipset" : "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || lab || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && i === 0) ? 0 : -1) + '" data-rg="' + x.id + '"' + (x.cls ? ' class="' + x.cls + '"' : "") + (offs[x.id] ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (offs[id]) return; var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }).filter(function(x){ return !offs[x]; }); if (!ids.length) return;
    var k = ids.indexOf(val); choose(ids[k < 0 ? (d > 0 ? 0 : ids.length - 1) : (k + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ id = String(id == null ? "" : id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, repaint:paint,
    off:function(ids){ var n = {}; (ids || []).forEach(function(x){ n[x] = 1; }); if (JSON.stringify(n) !== JSON.stringify(offs)) { offs = n; paint(); } } };
}

// ---------- retention model (content.explore.methods; model data) ----------
function EXC(){ return MV.C.explore; }
function meth(id){ return byId(EXC().methods, id); }
function vegOf(id){ return byId(EXC().vegs, id); }
function isBoil(id){ return /^boil/.test(id || ""); }
function kept(L){ var m = meth(L.method); if (!m) return null; var k = isBoil(L.method) && L.water === "use" ? m.keptW : m.kept; return L.cut === "early" ? k - EXC().cutEarly : k; }
function whereText(L){
  var m = meth(L.method); if (!m) return "Choose a method.";
  var w = isBoil(L.method) && L.water === "use" ? m.whereW : m.where;
  return w + (L.cut === "early" ? " Cutting an hour early lost some to air." : "");
}
function methShort(id){ var m = meth(id); return m ? (m.short || m.t) : ""; }
function planText(L){
  var v = vegOf(L.veg), m = meth(L.method); if (!v || !m) return "";
  return v.t + ", " + lc(methShort(L.method)) + (isBoil(L.method) ? (L.water === "use" ? " with the cooking water used" : ", water poured away") : "") + ", cut " + (L.cut === "early" ? "1 hour early" : "just before");
}
// violet retention bar (HTML); value text announced through a separate live region
function rbarHTML(id, label){
  return '<div class="mi-rb" id="' + id + '"><div class="mi-rbh"><strong>' + label + '</strong><span class="hfa-model">Model data</span></div>' +
    '<div class="mi-rtrack" aria-hidden="true"><span class="mi-rfill"></span></div><p class="mi-rval" aria-hidden="true"></p><p class="vh" aria-live="polite"></p></div>';
}
function rbarSet(box, v, hidden){
  if (!box) return;
  $(".mi-rfill", box).style.width = (v == null ? 0 : clamp(v, 0, 100)) + "%";
  var t = v == null ? "Vitamin C kept: –" : hidden ? "Vitamin C kept: …" : "Vitamin C kept: " + Math.round(v) + "%";
  $(".mi-rval", box).textContent = t;
  var live = $(".vh", box); if (!hidden && live.textContent !== t) live.textContent = t;
}

// ---------- @component retentionStage (module-specific SVG: vessel for each method, vegetable pieces, sink or soup bowl, droplets) ----------
function vegGlyph(id, x, y){
  var s = function(v){ return f1(v); };
  if (id === "broccoli") return '<g class="mi-veg"><path d="M' + s(x) + " " + s(y + 9) + "V" + s(y) + '"/><circle cx="' + s(x - 5) + '" cy="' + s(y - 2) + '" r="5"/><circle cx="' + s(x + 5) + '" cy="' + s(y - 2) + '" r="5"/><circle cx="' + s(x) + '" cy="' + s(y - 7) + '" r="5.5"/></g>';
  if (id === "carrots") return '<g class="mi-veg"><circle cx="' + s(x) + '" cy="' + s(y) + '" r="7"/><circle cx="' + s(x) + '" cy="' + s(y) + '" r="2.6"/></g>';
  if (id === "pepper") return '<g class="mi-veg"><rect x="' + s(x - 9) + '" y="' + s(y - 3.5) + '" width="18" height="7" rx="3.5" transform="rotate(-20 ' + s(x) + " " + s(y) + ')"/></g>';
  if (id === "spinach") return '<g class="mi-veg"><ellipse cx="' + s(x) + '" cy="' + s(y) + '" rx="10" ry="5.5" transform="rotate(-15 ' + s(x) + " " + s(y) + ')"/><path d="M' + s(x - 9) + " " + s(y + 2) + "L" + s(x + 9) + " " + s(y - 3) + '"/></g>';
  return '<g class="mi-veg"><rect x="' + s(x - 6.5) + '" y="' + s(y - 6.5) + '" width="13" height="13" rx="3.5"/></g>';
}
function stageSVG(L, fx){
  var h = '<line class="mi-counter" x1="10" y1="160" x2="410" y2="160"/>', m = L.method || "", veg = L.veg || "broccoli", k = m.replace(/\d+$/, "");
  var pieces = function(pts){ return pts.map(function(p){ return vegGlyph(veg, p[0], p[1]); }).join(""); }, side = k === "boil";
  h += '<g transform="translate(' + (side || !m ? 0 : 80) + ' 0)">';
  if (!m) h += txt(130, 120, "Choose a method", "mi-stxt");
  else if (k === "raw") h += '<rect class="mi-board" x="50" y="144" width="160" height="14" rx="4"/>' + pieces([[90, 132], [130, 132], [170, 132]]);
  else if (k === "steam") {
    var so = fx.steam == null ? 0.85 : 0.3 + 0.6 * Math.abs(Math.sin(fx.steam * Math.PI * 3));
    h += '<rect class="mi-pot" x="60" y="86" width="140" height="70" rx="6"/><rect class="mi-water" x="63" y="138" width="134" height="15"/><line class="mi-basket" x1="66" y1="122" x2="194" y2="122"/>' + pieces([[96, 112], [130, 112], [164, 112]]) +
      '<g class="mi-steam" style="opacity:' + f1(so) + '"><path d="M100 80q-7-9 0-18t0-18"/><path d="M130 78q-7-9 0-18t0-18"/><path d="M160 80q-7-9 0-18t0-18"/></g>';
  } else if (k === "mic") {
    h += '<rect class="mi-pot" x="40" y="66" width="190" height="90" rx="6"/><rect class="mi-window" x="50" y="76" width="134" height="70" rx="4"/><circle class="mi-knob" cx="207" cy="92" r="5"/><circle class="mi-knob" cx="207" cy="110" r="5"/><circle class="mi-knob" cx="207" cy="128" r="5"/>' +
      '<ellipse class="mi-water" cx="117" cy="134" rx="40" ry="5"/><ellipse class="mi-dish" cx="117" cy="135" rx="46" ry="8"/>' + pieces([[97, 124], [117, 121], [137, 124]]);
  } else if (k === "boil") {
    h += '<rect class="mi-pot" x="60" y="76" width="140" height="80" rx="6"/><line class="mi-pot" x1="44" y1="86" x2="60" y2="86"/><line class="mi-pot" x1="200" y1="86" x2="216" y2="86"/><rect class="mi-water" x="63" y="92" width="134" height="61"/>' +
      pieces([[96, 124], [130, 130], [164, 122]]) + '<circle class="mi-bubble" cx="82" cy="104" r="3"/><circle class="mi-bubble" cx="150" cy="101" r="2.5"/><circle class="mi-bubble" cx="182" cy="110" r="3"/>';
    if (L.water === "use") h += '<path class="mi-bowl" d="M282 116h108a54 34 0 0 1-108 0z"/><path class="mi-water" d="M287 122h98a49 26 0 0 1-98 0z"/>' + txt(336, 176, "Soup or sauce", "mi-slab");
    else h += '<path class="mi-sink" d="M280 112h110l-10 36h-90z"/><circle class="mi-drain" cx="335" cy="140" r="5"/><path class="mi-sink" d="M384 112V82h-24v10"/>' + txt(335, 176, "Sink", "mi-slab");
  } else h += '<path class="mi-pan" d="M50 126q80 36 160 0"/><line class="mi-pan" x1="210" y1="126" x2="262" y2="112"/>' + pieces([[100, 132], [130, 137], [160, 132]]);
  if (m) h += txt(130, 176, esc((vegOf(veg) || {}).t + " · " + methShort(m)), "mi-slab");
  h += "</g>";
  if (L.cut === "early") h += '<g class="mi-ctag"><circle cx="26" cy="22" r="9"/><path d="M26 16v6l4 3"/></g>' + txt(42, 27, "Cut 1 hour early, uncovered", "mi-stxt", "start");
  // droplets flow from the pot to the sink (P1); none with reduced motion
  if (fx.drops != null && fx.drops < 1 && !MV.reduceMotion && k === "boil" && L.water !== "use") {
    for (var i = 0; i < 8; i++) {
      var u = fx.drops * 2.1 - i * 0.14; if (u <= 0 || u >= 1) continue;
      var x = (1 - u) * (1 - u) * 196 + 2 * (1 - u) * u * 262 + u * u * 330, y = (1 - u) * (1 - u) * 90 + 2 * (1 - u) * u * 34 + u * u * 132;
      h += '<circle class="mi-drop" cx="' + f1(x) + '" cy="' + f1(y) + '" r="4"/>';
    }
  }
  return h;
}

// ---------- @component predCards (P3 storage tanks, P4 iron meters; no numbers) ----------
function cardSVG(id, t){
  var h = "";
  if (id === "p3") {
    var la = lerp(0.12, 0.9, t), lc0 = lerp(0.12, 0.28, Math.min(1, t * 2.5));
    [[40, la, false], [250, lc0, true]].forEach(function(q){
      var x = q[0], lvl = q[1], top = 60, bot = 170, yv = bot - (bot - top) * lvl;
      h += '<path class="mi-pipe" d="M' + (x + 65) + ' 30V52"/>';
      if (t > 0 && t < 1 && !MV.reduceMotion) for (var i = 0; i < 3; i++) { var u = (t * 6 + i / 3) % 1; h += '<circle class="mi-vdrop" cx="' + (x + 65) + '" cy="' + f1(lerp(34, yv - 4, u)) + '" r="3.5"/>'; }
      h += '<rect class="mi-liquid" x="' + (x + 2) + '" y="' + f1(yv) + '" width="126" height="' + f1(bot - yv) + '"/><rect class="mi-tank" x="' + x + '" y="' + top + '" width="130" height="' + (bot - top) + '" rx="4"/>';
      if (q[2]) {
        h += '<path class="mi-pipe" d="M' + (x + 130) + ' 160h22v24"/>';
        if (t > 0.15 && t < 1 && !MV.reduceMotion) for (var j = 0; j < 3; j++) { var w = (t * 5 + j / 3) % 1; h += '<circle class="mi-vdrop" cx="' + (x + 152) + '" cy="' + f1(lerp(190, 204, w)) + '" r="3.2"/>'; }
      }
    });
  } else {
    var gj = lerp(0.5, 0.88, t), gt = lerp(0.5, 0.22, t);
    [[20, "mi-oj", gj], [230, "mi-tea", gt]].forEach(function(q){
      var x = q[0];
      h += '<ellipse class="mi-plate" cx="' + (x + 66) + '" cy="72" rx="58" ry="24"/>';
      for (var i = 0; i < 14; i++) h += '<circle class="mi-lentil" cx="' + f1(x + 66 + 32 * Math.cos(i * 2.4) * (i % 3 + 1) / 3) + '" cy="' + f1(72 + 12 * Math.sin(i * 2.4) * (i % 3 + 1) / 3) + '" r="3.6"/>';
      h += '<path class="mi-glass ' + q[1] + '" d="M' + (x + 136) + " 40h34l-5 58h-24z\"/>";
      h += '<rect class="mi-mtrack" x="' + (x + 6) + '" y="118" width="168" height="22" rx="5"/><rect class="mi-mfill" x="' + (x + 9) + '" y="121" width="' + f1(162 * q[2]) + '" height="16" rx="4"/><line class="mi-mmid" x1="' + (x + 90) + '" y1="112" x2="' + (x + 90) + '" y2="146"/>';
    });
  }
  return h;
}
function cardAria(id, K){ return id === "p3" ? K.title + ". " + K.a + ": " + K.aEnd + ". " + K.c + ": " + K.cEnd + "." : K.title + ". " + K.meter + ": " + K.oj + ", " + lc(K.ojEnd) + ". " + K.tea + ", " + lc(K.teaEnd) + "."; }

// ---------- hero (storyboard: log page, a citrus slice slides in, the page fades beside the milk carton, "Vitamin D added" glows) ----------
function heroSVG(st, LG){
  var po = st.rm ? 1 : lerp(1, 0.42, st.fade), px = st.rm ? 0 : lerp(26, 0, st.fade), h = "";
  h += '<g style="opacity:' + f1(po) + '" transform="translate(' + f1(px) + ' 0) rotate(-3 130 125)">';
  h += '<rect class="mi-page" x="30" y="24" width="190" height="206" rx="4"/>';
  for (var y = 76; y <= 212; y += 22) h += '<line class="mi-prule" x1="44" y1="' + y + '" x2="206" y2="' + y + '"/>';
  h += txt(46, 56, LG.head, "mi-logh", "start") + txt(204, 56, LG.date, "mi-logd", "end");
  LG.lines.forEach(function(l, i){ h += txt(48, 106 + i * 26, esc(l), "mi-logn", "start"); });
  var sx = lerp(470, 182, st.slide);
  h += '<g transform="translate(' + f1(sx) + ' 194) rotate(' + f1(lerp(140, 0, st.slide)) + ')"><circle class="mi-lemon" r="24"/><circle class="mi-lemon2" r="18"/>';
  for (var k = 0; k < 8; k++) { var a = k * Math.PI / 4; h += '<line class="mi-lseg" x1="0" y1="0" x2="' + f1(17 * Math.cos(a)) + '" y2="' + f1(17 * Math.sin(a)) + '"/>'; }
  h += "</g></g>";
  var co = st.rm ? 1 : st.fade;
  if (co > 0) {
    h += '<g style="opacity:' + f1(co) + '" transform="translate(' + f1(lerp(30, 0, st.rm ? 1 : st.fade)) + ' 0)">';
    h += '<path class="mi-cside" d="M388 84l26-14v138l-26 20z"/><path class="mi-carton" d="M268 84h120v144h-120z"/><path class="mi-carton" d="M268 84l10-30h100l10 30z"/><rect class="mi-carton" x="282" y="40" width="92" height="14" rx="2"/>';
    h += txt(328, 118, "MILK", "mi-milk");
    for (var r = 0; r < 3; r++) h += '<line class="mi-prule" x1="280" y1="' + (138 + r * 14) + '" x2="376" y2="' + (138 + r * 14) + '"/>';
    var g = st.rm ? 1 : st.glow;
    h += '<rect class="mi-glow" x="273" y="181" width="110" height="27" rx="5" style="opacity:' + f1(g) + '"/>' + txt(328, 200, "Vitamin D added", "mi-vd");
    h += "</g>";
  }
  return h;
}
function hero(f){
  var host = $("#mi-hero"); if (!host) return;
  var H = MV.C.hero, st = { slide:0, fade:0, glow:0 };
  host.innerHTML = '<svg class="mi-hsvg" viewBox="0 0 480 250" role="img" aria-label="' + esc(H.aria) + '"></svg>';
  var svg = host.firstChild;
  function draw(){ svg.innerHTML = heroSVG(st, H.log); }
  function cap(){ if (f.cap) { f.cap.textContent = H.caption; f.cap.classList.add("mi-cap"); } }
  if (MV.reduceMotion) { st = { slide:1, fade:1, glow:1, rm:true }; draw(); cap(); return; }
  draw();
  MV.wait(500, function(){ MV.tween({ dur:1200, step:function(t){ st.slide = t; draw(); }, done:function(){
    MV.wait(500, function(){ MV.tween({ dur:1500, step:function(t){ st.fade = t; draw(); }, done:function(){
      MV.tween({ dur:900, step:function(t){ st.glow = t; draw(); }, done:function(){ MV.wait(200, cap); } });
    } }); });
  } }); });
}

// ---------- @component foodIcons (picture list for the self check; stroke-only 24 × 24 glyphs in currentColor) ----------
var ICON = {
  carton:'<path d="M7 9l2-5h6l2 5v12H7z"/><path d="M7 9h10"/>', bowl:'<path d="M3 11h18a9 7 0 0 1-18 0z"/><path d="M8 8c1-2 3-2 4 0"/>',
  wedge:'<path d="M3 18l17-10v10z"/><circle cx="13" cy="15" r="1.3"/>', block:'<rect x="4" y="8" width="16" height="10" rx="2"/><path d="M8 8v10M12 8v10M16 8v10"/>',
  bean:'<path d="M6 14c0-5 5-8 9-6s4 8-1 9-8 1-8-3z"/>', meat:'<path d="M4 12c0-4 5-7 10-6s5 6 1 9-11 2-11-3z"/><circle cx="12" cy="11" r="1.6"/>',
  fish:'<path d="M3 12c4-5 10-5 14 0-4 5-10 5-14 0z"/><path d="M17 12l4-3v6z"/>', egg:'<ellipse cx="12" cy="13" rx="6" ry="8"/>',
  bread:'<path d="M5 20V11a7 5 0 0 1 14 0v9z"/>', fruit:'<circle cx="12" cy="13" r="7"/><path d="M12 6c0-2 2-3 3-3"/>',
  pepper:'<path d="M8 8c-3 2-3 10 1 12s7 0 8-5-1-8-4-8c-1-1-2-1-5 1z"/><path d="M12 7V3"/>', leaf:'<path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16z"/><path d="M4 20L14 10"/>',
  nut:'<path d="M12 3c4 4 6 8 4 13s-6 5-8 0 0-9 4-13z"/>'
};
function icon(k){ return '<svg class="mi-ico" viewBox="0 0 24 24" aria-hidden="true">' + (ICON[k] || ICON.fruit) + "</svg>"; }

// optional private self check: in memory only (never saved, scored or summarized)
var SELF = { on:false, picks:{} };
function selfTotals(){
  var X = EXC().self, tot = {}; X.bars.forEach(function(b){ tot[b.id] = 0; });
  X.foods.forEach(function(fd){ if (SELF.picks[fd.id]) X.bars.forEach(function(b){ tot[b.id] += fd[b.id] || 0; }); });
  return tot;
}
function selfStatus(v){ return v >= 100 ? "reaches the general reference" : "below the general reference"; }
var openSelf = null;

// percentage bars against a reference line (F1 adequacy bars; reference = 100% at the middle of a 0–200% track)
function adeqBars(rows){
  return '<div class="mi-abars">' + rows.map(function(r){
    var low = r.v < 100;
    return '<div class="mi-abar' + (low ? " low" : "") + '"><span class="mi-alab">' + r.t + '</span><span class="mi-atrack"><span class="mi-afill" style="width:' + f1(clamp(r.v / 200, 0, 1) * 100) + '%"></span><span class="mi-aref"></span></span><span class="mi-aval">' + (r.v >= 200 ? "200%+" : Math.round(r.v) + "%") + (low ? " · below" : "") + "</span></div>";
  }).join("") + '<p class="tiny muted mi-akey">The dashed line marks the reference (100%).</p></div>';
}

// ---------- reflect: support note under the journal, then the private self-check summary (Mode 3) ----------
function addReflect(){
  var j = $("#journal"); if (!j || $("#mi-support")) return;
  var RF = MV.C.reflect, sh = j.closest(".sheet");
  var sup = document.createElement("div"); sup.className = "sheet mv-block"; sup.id = "mi-support"; sup.innerHTML = RF.support;
  var me = document.createElement("div"); me.className = "sheet"; me.id = "mi-selfsum";
  sh.parentNode.insertBefore(sup, sh.nextSibling); sup.parentNode.insertBefore(me, sup.nextSibling);
  me.addEventListener("click", function(e){ if (e.target.closest("#mi-goself") && openSelf) openSelf(); });
  paintSelfSum();
}
function paintSelfSum(){
  var me = $("#mi-selfsum"); if (!me) return;
  var X = MV.C.reflect.self, E = EXC().self, picked = E.foods.filter(function(fd){ return SELF.picks[fd.id]; }), h = '<h3><span class="hfa-private">Optional and private</span> ' + X.title + "</h3>";
  if (!SELF.on || !picked.length) h += "<p>" + X.none + '</p><div class="q-actions"><button type="button" class="btn ghost sm" id="mi-goself">' + X.open + "</button></div>";
  else {
    var tot = selfTotals();
    h += "<p>Foods marked: " + picked.map(function(fd){ return esc(lc(fd.t)); }).join("; ") + ".</p><ul class=\"mi-slist\">" + E.bars.map(function(b){ return "<li><strong>" + b.t + ":</strong> about " + Math.round(tot[b.id]) + "% of the general reference, " + selfStatus(tot[b.id]) + ".</li>"; }).join("") + "</ul>";
  }
  me.innerHTML = h + '<p class="tiny muted">' + X.privacy + '</p><p class="tiny"><strong>' + X.advice + "</strong></p>";
}

// ---------- Explore: Nutrient detective (Mode 1 cases, Mode 2 retention lab, Mode 3 food records) ----------
function explore(host, api){
  addReflect();
  var D = api.content, S = api.S, CH = {}, P = D.persona, X = D.self, anim = null, pend = null, cmsg = null;
  D.challenges.forEach(function(c){ CH[c.id] = c; });
  var CASE = {}; D.cases.forEach(function(c, i){ c.n = i + 1; CASE[c.id] = c; });
  var NUT = {}; D.nutrients.forEach(function(n){ NUT[n.id] = n; });
  S.mode = ["cases", "lab", "records"].indexOf(S.mode) >= 0 ? S.mode : "cases";
  S.case = CASE[S.case] ? S.case : "c1"; S.pick = S.pick || {}; S.solved = S.solved || {};
  S.lab = S.lab || { veg:"broccoli", method:"boil10", water:"pour", cut:"before" };
  S.rec = S.rec === "self" ? "self" : "sam"; S.low = Array.isArray(S.low) ? S.low : []; S.shelf = S.shelf || "";
  var fx = { level:null, hide:false, drops:null, steam:null, card:null, ct:1 };

  host.innerHTML = '<div class="mi-lab"><div class="mi-main" data-mv="graph"><div class="mi-top" id="mi-mode"></div>' +
    '<p class="banner" data-mv="banner" aria-live="polite"></p><div id="mi-card" hidden></div><div id="mi-m1"></div><div id="mi-m2"></div><div id="mi-m3"></div></div>' +
    '<div class="mi-side"><h4 class="mi-h4">Readout</h4><dl class="read" id="mi-read" aria-live="polite"></dl></div></div>';
  var modeRG = radios($("#mi-mode"), { label:"Mode", options:[{ id:"cases", t:"1. Detective cases" }, { id:"lab", t:"2. Retention lab" }, { id:"records", t:"3. Food records" }], value:S.mode,
    onChange:function(v){ cancelAnim(); fx.card = null; S.mode = v; MV.banner("", ""); commit(); } });

  // ===== Mode 1: detective cases =====
  var m1 = $("#mi-m1");
  m1.innerHTML = '<p class="how">Tap a case card to open it. Read the clues, choose a nutrient and whether it’s a deficiency or an excess, then press Check case.</p>' +
    '<div class="mi-cases" role="group" aria-label="Case cards" id="mi-cards"></div><div class="mi-paper" id="mi-clue"></div>' +
    '<div class="mi-nutbox" id="mi-nut"></div><div id="mi-type"></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="mi-check" data-k="micheck">Check case</button></div><div id="mi-cfb"></div>' +
    '<h4 class="mi-h4">Case file</h4><div id="mi-file" class="mi-file"></div>';
  var nutRG = radios($("#mi-nut"), { label:"Nutrient", aria:"Nutrient (vitamins first, then minerals)", cls:"chips",
    options:D.nutrients.map(function(n){ return { id:n.id, t:n.t, cls:n.g === "v" ? "mi-vit" : "mi-min" }; }), value:"",
    onChange:function(v){ pick().n = v; cmsg = null; commit(); } });
  var typeRG = radios($("#mi-type"), { label:"Type", options:[{ id:"def", t:"Deficiency (missing)" }, { id:"exc", t:"Excess (too much)" }], value:"def",
    onChange:function(v){ pick().t = v; cmsg = null; commit(); } });
  function pick(id){ id = id || S.case; return S.pick[id] || (S.pick[id] = { n:"", t:"def" }); }
  function solvedCount(){ return D.cases.filter(function(c){ return S.solved[c.id]; }).length; }
  function paintCases(){
    var cards = $("#mi-cards");
    MV.keepFocus(cards, function(){ cards.innerHTML = D.cases.map(function(c){ var on = S.case === c.id, sv = S.solved[c.id];
      return '<button type="button" class="mi-cbtn' + (sv ? " solved" : "") + '" data-case="' + c.id + '" data-k="case' + c.id + '" aria-pressed="' + on + '"><strong>Case C' + c.n + "</strong><span>" + c.clues[0][1] + "</span>" + (sv ? '<span class="mi-sv">✓ solved</span>' : "") + "</button>"; }).join(""); });
    var c = CASE[S.case], p = pick();
    $("#mi-clue").innerHTML = "<h4>Case C" + c.n + (S.solved[c.id] ? ' <span class="mi-sv">✓ solved</span>' : "") + '</h4><dl class="mi-clues">' + c.clues.map(function(q){ return "<div><dt>" + q[0] + "</dt><dd>" + q[1] + "</dd></div>"; }).join("") + "</dl>" +
      (S.solved[c.id] ? '<p class="mi-solve"><strong>' + c.label + ".</strong> " + c.note + "</p>" : "");
    nutRG.set(p.n); typeRG.set(p.t);
    $("#mi-cfb").innerHTML = cmsg ? MV.fbHTML(cmsg.k, cmsg.h) : "";
    var sv = D.cases.filter(function(x){ return S.solved[x.id]; });
    $("#mi-file").innerHTML = sv.length ? "<ol>" + sv.map(function(x){ return '<li value="' + x.n + '"><strong>C' + x.n + ": " + x.label + ".</strong> " + x.note + "</li>"; }).join("") + "</ol>" : '<p class="muted tiny">Solved cases are filed here.</p>';
  }
  m1.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.case) { S.case = b.dataset.case; cmsg = null; commit(); return; }
    if (b.id === "mi-check") {
      var c = CASE[S.case], p = pick(), A = String(MV.ans(c)).split("|"), M = D.caseMsgs, T1 = CH.tc1.msgs;
      if (!p.n) cmsg = { k:"", h:M.pick };
      else if (p.n === A[0] && p.t === A[1]) { S.solved[c.id] = true; cmsg = { k:"good", h:"<strong>✓ Case solved: " + c.label + ".</strong> It’s in the case file." }; }
      else if (p.n === A[0]) cmsg = { k:"bad", h:"<strong>✗ Not quite.</strong> " + M.type };
      else if (c.id === "c4" && T1[p.n]) cmsg = { k:"bad", h:"<strong>✗ Not quite.</strong> " + T1[p.n] };
      else cmsg = { k:"bad", h:"<strong>✗ Not quite.</strong> " + M.wrong };
      commit(); MV.focusFb($("#mi-cfb"));
    }
  });

  // ===== Mode 2: retention lab =====
  var m2 = $("#mi-m2");
  m2.innerHTML = '<p class="how">Choose a vegetable, a cooking method and when you cut it. <span class="hfa-model">Model data</span> based on typical findings.</p>' +
    '<div class="mi-stagebox" id="mi-stagebox"><svg class="mi-stage" id="mi-stage" viewBox="0 0 420 182" role="img"></svg>' + rbarHTML("mi-rb", "Vitamin C kept") + "</div>" +
    '<div class="mi-lctl"><div id="mi-veg"></div><div id="mi-meth"></div><div id="mi-water"></div><div id="mi-cut"></div></div>';
  function labSet(k){ return function(v){ cancelAnim(); fx.card = null; S.lab[k] = v; commit(); }; }
  var vegRG = radios($("#mi-veg"), { label:"Vegetable", cls:"chips", options:D.vegs.map(function(v){ return { id:v.id, t:v.t }; }), value:S.lab.veg, onChange:labSet("veg") });
  var methRG = radios($("#mi-meth"), { label:"Method", cls:"chips", options:D.methods.map(function(m){ return { id:m.id, t:m.t }; }), value:S.lab.method, onChange:labSet("method") });
  var waterRG = radios($("#mi-water"), { label:"Cooking water", cls:"chips", options:[{ id:"pour", t:"Pour it away" }, { id:"use", t:"Use it in a soup or sauce" }], value:S.lab.water, onChange:labSet("water") });
  var cutRG = radios($("#mi-cut"), { label:"Cut", cls:"chips", options:[{ id:"before", t:"Just before cooking" }, { id:"early", t:"1 hour early, left uncovered" }], value:S.lab.cut, onChange:labSet("cut") });
  function paintStage(){
    var L = S.lab, svg = $("#mi-stage"), k = kept(L), v = fx.level != null ? fx.level : k;
    svg.innerHTML = stageSVG(L, fx);
    svg.setAttribute("aria-label", "Retention lab: " + planText(L) + ". " + (fx.level != null ? "Vitamin C kept: changing." : "Vitamin C kept: " + k + "%."));
    rbarSet($("#mi-rb"), v, fx.level != null && fx.hide);
  }
  function paintLab(){
    var L = S.lab; vegRG.set(L.veg); methRG.set(L.method); waterRG.set(L.water); cutRG.set(L.cut);
    $("#mi-water").hidden = !isBoil(L.method);
    paintStage();
  }

  // ===== Mode 3: food records (Sam, F1 persona; optional private self check) =====
  var m3 = $("#mi-m3");
  m3.innerHTML = '<div id="mi-rsel"></div><div id="mi-sam"></div><div id="mi-self"></div>';
  var recRG = radios($("#mi-rsel"), { label:"Record", options:[{ id:"sam", t:"Sam (persona)" }, { id:"self", t:"Self check (optional, private)" }], value:S.rec,
    onChange:function(v){ S.rec = v; commit(); } });
  var sam = $("#mi-sam");
  sam.innerHTML = '<div class="mi-persona"><h4 class="mi-h4">' + P.title + ' <span class="hfa-model">Model data</span></h4><p>' + P.intro + '</p><ul class="mi-rec">' + P.record.map(function(r){ return "<li>" + r + "</li>"; }).join("") + "</ul></div>" +
    '<h5 class="mi-h5">Nutrients compared with a general reference</h5>' + adeqBars(P.bars) +
    '<h5 class="mi-h5">Below the reference: tap two</h5><div class="mi-lowc" role="group" aria-label="Nutrients below the reference (choose two)" id="mi-low"></div>' +
    '<h5 class="mi-h5">The shelf: choose one</h5><div id="mi-shelf"></div><p class="tiny" id="mi-samst" aria-live="polite"></p><p class="tiny"><strong>' + P.advice + "</strong></p>";
  var shelfRG = radios($("#mi-shelf"), { label:"", aria:"The shelf", cls:"chips", options:P.shelf.map(function(s){ return { id:s.id, t:s.t }; }), value:S.shelf,
    onChange:function(v){ S.shelf = v; commit(); } });
  function paintSam(){
    var lw = $("#mi-low");
    MV.keepFocus(lw, function(){ lw.innerHTML = P.bars.map(function(b){ var on = S.low.indexOf(b.id) >= 0; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-low="' + b.id + '" data-k="low' + b.id + '" aria-pressed="' + on + '">' + b.t + "</button>"; }).join(""); });
    shelfRG.set(S.shelf);
    var sh = byId(P.shelf, S.shelf);
    $("#mi-samst").textContent = "Chosen: " + (S.low.length ? S.low.map(function(id){ return byId(P.bars, id).t; }).join(" and ") : "no nutrients yet") + " · Shelf: " + (sh ? sh.t : "nothing yet") + ".";
  }
  sam.addEventListener("click", function(e){
    var b = e.target.closest("[data-low]"); if (!b) return;
    var k = S.low.indexOf(b.dataset.low); if (k >= 0) S.low.splice(k, 1); else { S.low.push(b.dataset.low); if (S.low.length > 2) S.low.shift(); }
    commit();
  });
  var self = $("#mi-self");
  self.innerHTML = '<p><span class="hfa-private">Optional and private</span> ' + X.privacy + '</p><div class="q-actions" id="mi-selfgate"><button type="button" class="btn primary sm" id="mi-selfgo">' + X.start + "</button></div>" +
    '<div id="mi-selfbody" hidden><p>' + X.intro + ' <span class="hfa-model">Model data</span></p><div class="mi-foods" role="group" aria-label="Foods eaten yesterday" id="mi-foods"></div>' +
    '<div id="mi-selfbars" aria-live="polite"></div><div class="q-actions"><button type="button" class="btn ghost sm" id="mi-selfclr">Clear my marks</button><button type="button" class="btn ghost sm" id="mi-selfend">Close the self check</button></div><p class="tiny"><strong>' + X.advice + "</strong></p></div>";
  function paintSelf(){
    $("#mi-selfgate").hidden = SELF.on; $("#mi-selfbody").hidden = !SELF.on;
    if (!SELF.on) return;
    var box = $("#mi-foods");
    MV.keepFocus(box, function(){ box.innerHTML = X.foods.map(function(fd){ var on = !!SELF.picks[fd.id]; return '<button type="button" class="mi-food" data-food="' + fd.id + '" data-k="fd' + fd.id + '" aria-pressed="' + on + '">' + icon(fd.icon) + "<span>" + fd.t + "</span></button>"; }).join(""); });
    var tot = selfTotals();
    $("#mi-selfbars").innerHTML = adeqBars(X.bars.map(function(b){ return { t:b.t, v:tot[b.id] }; }));
    paintSelfSum();
  }
  self.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.id === "mi-selfgo") { SELF.on = true; paintSelf(); var f = $("#mi-foods button"); if (f) f.focus(); return; }
    if (b.id === "mi-selfclr") { SELF.picks = {}; paintSelf(); return; }
    if (b.id === "mi-selfend") { SELF.on = false; SELF.picks = {}; paintSelf(); paintSelfSum(); $("#mi-selfgo").focus(); return; }
    if (b.dataset.food) { SELF.picks[b.dataset.food] = !SELF.picks[b.dataset.food]; paintSelf(); }
  });
  function paintRecords(){ recRG.set(S.rec); sam.hidden = S.rec !== "sam"; self.hidden = S.rec !== "self"; if (S.rec === "sam") paintSam(); else paintSelf(); }
  openSelf = function(){ S.mode = "records"; S.rec = "self"; fx.card = null; api.save(); MV.go("explore"); paint(); MV.wait(60, function(){ var r = $("#mi-rsel"); if (r) r.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" }); }); };

  // ===== prediction cards (P3, P4) =====
  var cardBox = $("#mi-card");
  cardBox.innerHTML = '<div class="mi-cardh"><strong id="mi-ctitle"></strong><button type="button" class="btn ghost sm" id="mi-cardx">Back to the modes</button></div>' +
    '<div class="mi-cardp"><div class="mi-ccols"><h5 id="mi-cha"></h5><h5 id="mi-chb"></h5></div><svg class="mi-csvg" id="mi-csvg" role="img"></svg><div class="mi-ccols mi-cends"><p id="mi-cea"></p><p id="mi-ceb"></p></div></div>';
  cardBox.addEventListener("click", function(e){ if (e.target.closest("#mi-cardx")) { cancelAnim(); fx.card = null; paint(); } });
  function paintCard(){
    var K = fx.card && D.cards[fx.card]; cardBox.hidden = !K; if (!K) return;
    $("#mi-ctitle").textContent = "Prediction card: " + K.title;
    var p3 = fx.card === "p3", end = fx.ct >= 1, svg = $("#mi-csvg");
    $("#mi-cha").textContent = p3 ? K.a : K.oj; $("#mi-chb").textContent = p3 ? K.c : K.tea;
    $("#mi-cea").innerHTML = end ? (p3 ? K.aEnd : "<strong>" + K.meter + ":</strong> " + lc(K.ojEnd)) : (p3 ? "" : K.meter);
    $("#mi-ceb").innerHTML = end ? (p3 ? K.cEnd : "<strong>" + K.meter + ":</strong> " + lc(K.teaEnd)) : (p3 ? "" : K.meter);
    svg.setAttribute("viewBox", p3 ? "0 24 440 186" : "0 30 440 122");
    svg.innerHTML = cardSVG(fx.card, fx.ct); svg.setAttribute("aria-label", end ? cardAria(fx.card, K) : K.title + ". Watch what happens.");
  }

  // ===== readout =====
  function readPaint(){
    var L = S.lab, v = vegOf(L.veg), m = meth(L.method), k = kept(L);
    $("#mi-read").innerHTML = MV.readoutHTML([
      ["Vitamin C kept", fx.level != null ? "…" : (k == null ? "–" : k + '% <span class="tiny muted">(model data)</span>')],
      ["Where it went", fx.level != null ? "…" : whereText(L)],
      ["Vitamin A", v ? v.t + ": " + lc(v.vitA) : "–"],
      ["Texture", m ? m.tex : "–"],
      ["Case file", solvedCount() + " of " + D.cases.length + " solved"]
    ]);
  }

  // ===== paint / commit =====
  function paint(){
    modeRG.set(S.mode);
    var card = !!fx.card;
    m1.hidden = card || S.mode !== "cases"; m2.hidden = card || S.mode !== "lab"; m3.hidden = card || S.mode !== "records";
    paintCard();
    if (!card) { if (S.mode === "cases") paintCases(); else if (S.mode === "lab") paintLab(); else paintRecords(); }
    readPaint();
  }
  function commit(){ api.save(); paint(); MV.changed(); }
  function finish(){ anim = null; fx.level = null; fx.hide = false; fx.drops = null; fx.steam = null; fx.ct = 1; paint(); MV.changed(); var d = pend; pend = null; if (d) d(); }
  function cancelAnim(){ if (anim) { anim(); anim = null; } fx.level = null; fx.hide = false; fx.drops = null; fx.steam = null; fx.ct = 1; if (pend) { var d = pend; pend = null; d(); } }
  paint();

  // ===== challenges (plan's exact tests and named wrong states) =====
  function challenge(id, live){
    var C = CH[id], M = C.msgs;
    if (id === "tc1") {
      var p = S.pick.c4, A = MV.ans(C);
      if (!p || !p.n) return { ok:false, msg:M.open };
      if (p.n === A.n && p.t === A.t) { if (!live) MV.banner("good", C.banner); return { ok:true }; }
      if (p.n === A.n) return { ok:false, msg:M.type };
      if (M[p.n]) return { ok:false, msg:M[p.n] };
      return { ok:false };
    }
    if (id === "tc2") {
      var L = S.lab, k = kept(L);
      if (L.veg !== "broccoli") return { ok:false, msg:M.veg };
      if (L.method === "raw") return { ok:false, msg:M.raw };
      if (k >= 80) { if (!live && L.cut === "early") MV.banner("good", M.early); return { ok:true }; }
      if (L.method === "boil5" && L.water !== "use") return { ok:false, msg:M.boil5 };
      return { ok:false, msg:M.low.replace("{k}", k) };
    }
    if (id === "tc3") {
      var low = S.low, need = P.bars.filter(MV.ok).map(function(b){ return b.id; }), sh = byId(P.shelf, S.shelf);
      if (low.indexOf("fe") >= 0) return { ok:false, msg:M.iron };
      if (low.length !== 2) return { ok:false, msg:M.two };
      if (!need.every(function(n){ return low.indexOf(n) >= 0; })) return { ok:false, msg:M.pair };
      if (!sh) return { ok:false, msg:M.shelf };
      if (MV.ok(sh)) return { ok:true };
      if (sh.id === "spinach") return { ok:false, msg:M.spinach };
      if (sh.id === "mush" || sh.id === "seaweed") return { ok:false, msg:M.mush };
      if (sh.id === "tofu") return { ok:false, msg:M.tofu };
      return { ok:false };
    }
    return { ok:false };
  }

  // ===== predictions =====
  function reveal(el){ var r = el && el.getBoundingClientRect(); if (r && (r.top < 110 || r.bottom > window.innerHeight)) el.scrollIntoView({ block:"center", behavior:MV.reduceMotion ? "auto" : "smooth" }); }
  return {
    predict:{
      start:function(p){
        cancelAnim(); fx.card = null;
        if (p.id === "p1") { S.mode = "lab"; S.lab = { veg:"broccoli", method:"boil10", water:"pour", cut:"before" }; fx.level = 100; fx.hide = true; }
        else if (p.id === "p2") { S.mode = "lab"; S.lab = { veg:"broccoli", method:"steam5", water:"pour", cut:"before" }; fx.level = 100; fx.hide = true; }
        else { fx.card = p.id; fx.ct = 0; }
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        pend = done;
        if (p.id === "p1" || p.id === "p2") {
          var to = p.id === "p1" ? 50 : 85; reveal($("#mi-stagebox"));
          anim = MV.tween({ dur:p.id === "p1" ? 2200 : 1600, step:function(t){ fx.level = lerp(100, to, t); fx.hide = t < 1; if (p.id === "p1") fx.drops = t; else fx.steam = t; paintStage(); }, done:finish });
        } else { reveal(cardBox); anim = MV.tween({ dur:2000, step:function(t){ fx.ct = t; paintCard(); }, done:finish }); }
      }
    },
    challenge:function(id, opt){ return challenge(id, !!(opt && opt.live)); }
  };
}

// ---------- Part 3: Water (Station 1 body outline, Station 2 drink cards, Station 3 advisory data chart) ----------
function part3(host, api){
  var D = api.content, S = api.S, J = D.jobs, R = D.drinks, A = D.data;
  S.job = S.job || ""; S.jobs = S.jobs || {}; S.drink = S.drink || ""; S.drinks = S.drinks || {}; S.notes = S.notes || {};
  host.innerHTML = '<div class="mi-st" id="mi-st1"></div><div class="mi-st" id="mi-st2"></div><div class="mi-st" id="mi-st3"></div>';

  // Station 1: @component bodyTapPoints (SBI4U S1-style outline with tap points as buttons in reading order)
  var POS = { temp:[50, 9], trans:[55, 34], cush:[41, 78], react:[50, 48] };
  var s1 = $("#mi-st1", host);
  s1.innerHTML = "<h3>" + J.title + "</h3><p>" + J.intro + '</p><div class="mi-bodyw"><div class="mi-body"><svg viewBox="0 0 200 320" aria-hidden="true" class="mi-bsvg">' +
    '<circle class="mi-bline" cx="100" cy="34" r="24"/><path class="mi-bline" d="M90 56V66L66 70Q54 72 52 86L42 166Q41 178 50 178Q59 178 58 166L66 104L68 182L70 298Q70 310 81 310Q93 310 93 298L97 196H103L107 298Q107 310 119 310Q130 310 130 298L132 182L134 104L142 166Q141 178 150 178Q159 178 158 166L148 86Q146 72 134 70L110 66V56Z"/></svg>' +
    '<div id="mi-pts"></div></div><div class="mi-jobp" id="mi-jobp" aria-live="polite"></div></div>' +
    '<div class="mi-facts">' + J.facts.map(function(x){ return '<div class="mi-fact"><p>' + x + "</p></div>"; }).join("") + '</div><p class="mi-note"><strong>' + J.note + "</strong></p>";
  function paint1(){
    var pts = $("#mi-pts", s1);
    MV.keepFocus(pts, function(){ pts.innerHTML = J.points.map(function(p, i){ var on = S.job === p.id, q = POS[p.id];
      return '<button type="button" class="mi-tap' + (S.jobs[p.id] ? " seen" : "") + '" style="left:' + q[0] + "%;top:" + q[1] + '%" data-job="' + p.id + '" data-k="job' + p.id + '" aria-pressed="' + on + '" aria-label="' + esc((i + 1) + ". " + p.t + " (" + p.sub + ")") + '">' + (i + 1) + "</button>"; }).join(""); });
    var p = byId(J.points, S.job), n = J.points.filter(function(x){ return S.jobs[x.id]; }).length;
    $("#mi-jobp", s1).innerHTML = (p ? "<h4>" + p.t + ' <span class="tiny muted">(' + p.sub + ")</span></h4><p>" + p.text + "</p>" : '<p class="muted">Tap a numbered point on the outline.</p>') +
      '<ol class="mi-joblist">' + J.points.map(function(x){ return "<li>" + (S.jobs[x.id] ? '<span aria-hidden="true">✓ </span>' + x.t : '<span class="muted">' + x.t + "</span>") + "</li>"; }).join("") + '</ol><p class="tiny muted">Jobs opened: ' + n + " of " + J.points.length + "</p>";
  }
  s1.addEventListener("click", function(e){ var b = e.target.closest("[data-job]"); if (!b) return; S.job = b.dataset.job; S.jobs[S.job] = 1; api.save(); paint1(); });
  paint1();

  // Station 2: drink cards (practice model; neutral language)
  var GL = { water:"mi-gw", milk:"mi-gm", juice:"mi-gj", soda:"mi-gs" };
  var s2 = $("#mi-st2", host);
  s2.innerHTML = "<h3>" + R.title + "</h3><p>" + R.intro + '</p><div class="mi-drinks" role="group" aria-label="Drinks" id="mi-dsel"></div><div class="mi-dcard" id="mi-dcard" aria-live="polite"></div><p class="mi-cfg"><strong>' + R.cfg + "</strong></p>";
  function paint2(){
    var sel = $("#mi-dsel", s2);
    MV.keepFocus(sel, function(){ sel.innerHTML = R.list.map(function(d){ var on = S.drink === d.id;
      return '<button type="button" class="mi-drink" data-drink="' + d.id + '" data-k="dr' + d.id + '" aria-pressed="' + on + '"><svg viewBox="0 0 24 30" aria-hidden="true"><path class="' + GL[d.id] + '" d="M5 9h14l-2 18H7z"/><path class="mi-gline" d="M4 3h16l-3 24H7z"/></svg><span>' + (S.drinks[d.id] ? '<span aria-hidden="true">✓ </span>' : "") + d.t + "</span></button>"; }).join(""); });
    var d = byId(R.list, S.drink);
    $("#mi-dcard", s2).innerHTML = d ? "<h4>" + d.t + ' <span class="hfa-model">Practice model</span></h4><p class="tiny muted">What it adds:</p><ul>' + d.adds.map(function(x){ return "<li>" + x + "</li>"; }).join("") + "</ul>" : '<p class="muted">Tap a drink to see what it adds.</p>';
  }
  s2.addEventListener("click", function(e){ var b = e.target.closest("[data-drink]"); if (!b) return; S.drink = b.dataset.drink; S.drinks[S.drink] = 1; api.save(); paint2(); });
  paint2();

  // Station 3: Check it with data (G12 data points on the graph engine, N14 table, prompts with saved notes)
  var s3 = $("#mi-st3", host);
  var rows = A.rows.map(function(r){ return [r.when, r.lifted == null ? "not reported" : MV.num(r.lifted), MV.num(r.remain), r.src]; });
  s3.innerHTML = "<h3>" + A.title + "</h3><p>" + A.intro + '</p><div class="mi-leg"><span><i class="mi-lsw rem"></i>Remaining in effect</span><span><i class="mi-lsw lif"></i>Lifted since November 2015 (running total)</span></div>' +
    '<canvas class="plot wide" id="mi-adv" role="img" aria-label="Line graph of long-term drinking water advisories"></canvas>' +
    MV.tableHTML({ head:["Date", "Lifted since Nov. 2015", "Remaining in effect", "Source"], rows:rows, caption:"Long-term drinking water advisories on public systems on reserves" }) +
    '<div class="mi-prompts">' + A.prompts.map(function(q){ return '<div class="jq"><label for="mi-' + q.id + '">' + q.q + '</label><textarea id="mi-' + q.id + '" data-note="' + q.id + '">' + esc(S.notes[q.id] || "") + "</textarea></div>"; }).join("") + "</div>" +
    '<details class="alg"><summary>Check your reading of the data</summary><ul class="mi-check">' + A.check.map(function(x){ return "<li>" + x + "</li>"; }).join("") + "</ul></details>" +
    '<div class="mi-frame">' + A.framing + "</div>";
  s3.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.note; if (!id) return; S.notes[id] = e.target.value; api.save(); });
  var cv = $("#mi-adv", s3), pl = new MV.Plot(cv, { xmin:2014.4, xmax:2027.8, ymin:-12, ymax:192 });
  pl.render = function(){
    var blue = MV.css("--nu-water"), ink2 = MV.css("--ink-2"), fnt = "700 13px " + (MV.css("--font-ui") || "sans-serif");
    var rem = A.rows.map(function(r){ return [r.x, r.remain]; }), lif = A.rows.filter(function(r){ return r.lifted != null; }).map(function(r){ return [r.x, r.lifted]; });
    var last = A.rows[A.rows.length - 1], first = A.rows[0];
    var narrow = cv.getBoundingClientRect().width < 520;
    pl.draw({ view:{ xmin:2014.4, xmax:2027.8, ymin:-12, ymax:192 }, xTicks:{ step:narrow ? 4 : 2, fmt:function(t){ return String(Math.round(t)); } }, yTicks:{ step:narrow ? 50 : 25 },
      xLabel:"year", yLabel:"advisories",
      curves:[{ pts:rem, color:blue, width:3.2 }, { pts:lif, color:ink2, width:2.6, dash:[7, 6] }],
      points:rem.map(function(p){ return { x:p[0], y:p[1], r:5, color:blue }; }).concat(lif.map(function(p){ return { x:p[0], y:p[1], r:4.5, color:ink2, open:true }; })),
      labels:[{ x:first.x, y:first.remain, text:first.remain + " in effect", color:blue, font:fnt, dx:10, dy:-12, bg:true },
        { x:last.x, y:last.remain, text:last.remain + " remaining", color:blue, font:fnt, align:"right", dx:-10, dy:-14, bg:true },
        { x:last.x, y:last.lifted, text:last.lifted + " lifted", color:ink2, font:fnt, align:"right", dx:-10, dy:-14, bg:true }],
      describe:"Line graph, " + first.when + " to " + last.when + ". Long-term advisories remaining in effect: " + A.rows.map(function(r){ return r.when + " " + r.remain; }).join(", ") + ". Lifted since November 2015 (running total): " + A.rows.filter(function(r){ return r.lifted != null; }).map(function(r){ return r.when + " " + r.lifted; }).join(", ") + "." });
  };
  pl.render();
}

// ---------- Performance task: Nutrient-kept side dish (live retention bar, texture note, kitchen card) ----------
var task = (function(){
  var api = null, rg = {};
  function T(){ return MV.C.task; }
  function read(){ var s = (api && api.S) || {}; return { veg:s.veg || "", method:s.method || "", water:s.water || "pour", cut:s.cut || "" }; }
  function full(d){ return !!(d.veg && d.method && d.cut); }
  function keyOf(d){ return [d.veg, d.method, isBoil(d.method) ? d.water : "-", d.cut].join("|"); }
  function fromKey(k){ var p = k.split("|"); return { veg:p[0], method:p[1], water:p[2] === "-" ? "pour" : p[2], cut:p[3] }; }
  function label(k){ var d = fromKey(k); return planText(d) + " (" + kept(d) + "% kept)"; }
  function cardLines(){
    var d = read(), K = T().kitchen, v = vegOf(d.veg), m = meth(d.method), L = [];
    L.push("## Plan");
    L.push("- Vegetable: " + (v ? v.t : "(choose one in the task)"));
    L.push("- Method: " + (m ? m.t + (isBoil(d.method) ? (d.water === "use" ? ", cooking water used in a soup or sauce" : ", water poured away") : "") : "(choose one in the task)"));
    L.push("- Cut: " + (d.cut === "early" ? "1 hour early" : d.cut ? "just before cooking" : "(choose in the task)"));
    if (full(d)) L.push("- Vitamin C kept (model data): " + kept(d) + "%");
    L.push("## Ingredients");
    L.push("- " + (v ? v.t : "The planned vegetable"));
    L.push("- " + (!m ? "1 tsp oil (for stir-fry) or 2 tbsp water (for steaming or microwaving)" : /^stir/.test(d.method) ? "1 tsp oil (for stir-fry)" : isBoil(d.method) ? "Water for boiling" + (d.water === "use" ? " (keep it for the soup or sauce)" : "") : d.method === "raw" ? "Nothing else: served raw" : "2 tbsp water (for steaming or microwaving)"));
    L.push("## Steps");
    K.steps.forEach(function(s, i){ L.push((i + 1) + ". " + s); });
    L.push("## Safety");
    K.safety.forEach(function(s){ L.push("- " + s); });
    L.push("## Record");
    K.record.forEach(function(s){ L.push("- " + s + ": ____________"); });
    return L;
  }
  function paint(){
    var d = read(); if (!$("#tk-rb")) return;
    rg.veg.set(d.veg); rg.method.set(d.method); rg.water.set(d.water); rg.cut.set(d.cut);
    $("#tk-water").hidden = !isBoil(d.method);
    var v = vegOf(d.veg), m = meth(d.method), k = m ? kept({ method:d.method, water:d.water, cut:d.cut || "before" }) : null;
    rbarSet($("#tk-rb"), full(d) ? k : null, false);
    $("#tk-notes").innerHTML = MV.readoutHTML([["Texture", m ? m.tex : "–"], ["Vitamin A", v ? v.vitA : "–"], ["Where the vitamin C went", full(d) ? whereText(d) : "–"]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; var s = a.S;
      inp.innerHTML = '<div class="mi-tin"><div id="tk-veg"></div><div id="tk-meth"></div><div id="tk-water"></div><div id="tk-cut"></div></div>';
      function on(k){ return function(v){ s[k] = v; a.save(); paint(); a.update(); }; }
      var E = MV.C.explore;
      rg.veg = radios($("#tk-veg"), { label:"Vegetable", cls:"chips", options:E.vegs.map(function(x){ return { id:x.id, t:x.t }; }), value:s.veg || "", onChange:on("veg") });
      rg.method = radios($("#tk-meth"), { label:"Method", cls:"chips", options:E.methods.map(function(x){ return { id:x.id, t:x.t }; }), value:s.method || "", onChange:on("method") });
      rg.water = radios($("#tk-water"), { label:"Cooking water", cls:"chips", options:[{ id:"pour", t:"Pour it away" }, { id:"use", t:"Use it in a soup or sauce" }], value:s.water || "pour", onChange:on("water") });
      rg.cut = radios($("#tk-cut"), { label:"Cut", cls:"chips", options:[{ id:"before", t:"Just before cooking" }, { id:"early", t:"1 hour early" }], value:s.cut || "", onChange:on("cut") });
      pv.innerHTML = '<div class="mi-tpv">' + rbarHTML("tk-rb", "Vitamin C kept") + '<dl class="read" id="tk-notes" aria-live="polite"></dl><div id="tk-kc"></div></div>';
      MV.kitchenCardButton($("#tk-kc"), { title:T().kitchen.title, lines:cardLines, label:"Save the kitchen card" });
      paint();
    },
    read:read,
    valid:function(d){ return full(d) ? true : "Choose a vegetable, a cooking method and when to cut it."; },
    checks:function(d){
      if (!full(d)) return [false, false, false, false];
      var v = vegOf(d.veg);
      return [kept(d) >= 75, !!(v && v.a), d.method !== "raw", d.cut === "before"];
    },
    key:keyOf,
    label:function(k){ return esc(label(k)); },
    text:label
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task,
  onShow:function(v){ if (v === "reflect") paintSelfSum(); }
});
})();
