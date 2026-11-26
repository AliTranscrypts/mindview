// HFA4U 15 Foodborne Illness and Food Safety: hero (thermometer bands, a doubling tray, the four step icons), Kitchen
// detective (Explore, F8: Spot the hazard scene with numbered hotspots and step chips; Danger-zone clock with a dot tray,
// sliders, a reheat switch and big-batch cooling; Thermometer check with food, probe position and reading), Outbreak
// investigation (Part 3: attack-rate table builder with a paired bar chart, pathogen cards, the real-system panel),
// practice (★ decisions set: number entry, chip groups, ordering) and "Safe potluck plan" (task: five choice rows, a stage
// strip, the allergen card and an optional kitchen card). Plan wording lives in content.mjs; this file adds only control
// labels and layout text.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc, css = MV.css;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function f1(v){ return String(Math.round(v * 10) / 10); }
function byId(list, id){ for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i]; return null; }
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : ""; }); }
function numOr(v, d){ return v === null || v === "" || v === undefined || !isFinite(+v) ? d : +v; }
function numIn(raw){ var r = MV.parseNum(String(raw == null ? "" : raw).replace(/°\s*C?|%|minutes?|min|bacteria/gi, "").trim()); return r && r.length === 1 && isFinite(r[0]) ? r[0] : null; }
function minus(v){ return v < 0 ? MV.MINUS + Math.abs(v) : String(v); }
function degC(v){ return minus(v) + " °C"; }
function fmtTime(m){ var h = Math.floor(m / 60), r = m % 60; return h ? h + " h " + r + " min" : r + " min"; }
function pct(v){ return MV.num(v, 1) + "%"; }
function svgT(x, y, s, cls, anchor){ return '<text class="' + cls + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "middle") + '">' + s + "</text>"; }
function arrowKeys(e){ return (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; }

// ---------- @component radioGroup (copied from HFA4U 01 / 12: per-option disabling, function labels, custom layout class) ----------
//   radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips"|<custom → fs-<custom>>, onChange}) -> {set, get, off(ids), repaint}
//   Use a fresh host for every call: it adds its listeners to host.
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), offs = {}, kind = o.cls === "chips" ? "fs-chipset" : o.cls && o.cls !== "seg" ? "fs-" + o.cls : "seg";
  function paint(){
    var f = host.contains(document.activeElement), lab = typeof o.label === "function" ? o.label() : o.label;
    var en = o.options.filter(function(x){ return !offs[x.id]; }), any = en.some(function(x){ return String(x.id) === val; });
    host.innerHTML = '<span class="fs-rgw">' + (lab ? '<span class="fs-rgl">' + lab + "</span>" : "") + '<span class="fs-rg ' + kind + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || lab || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val, dis = offs[x.id], tab = !dis && (on || (!any && en[0] === x)) ? 0 : -1;
        return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + tab + '" data-rg="' + x.id + '"' + (dis ? " disabled" : "") + ">" + (typeof x.t === "function" ? x.t() : x.t) + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]'); if (!b || b.disabled) b = host.querySelector("[data-rg]:not([disabled])"); if (b) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (offs[id]) return; var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && host.contains(b) && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"), d = arrowKeys(e); if (!b || !d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }).filter(function(x){ return !offs[x]; });
    var k = ids.indexOf(val); choose(ids[k < 0 ? 0 : (k + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ id = String(id == null ? "" : id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, repaint:paint,
    off:function(ids){ var n = {}; (ids || []).forEach(function(x){ n[x] = 1; }); if (JSON.stringify(n) !== JSON.stringify(offs)) { offs = n; paint(); } } };
}

// ---------- @component switchBtn (copied from HFA4U 12) — an on/off switch (role="switch" button with a visible On/Off word) ----------
function switchHTML(key, label, on, data){
  return '<button type="button" role="switch" class="fs-sw" aria-checked="' + !!on + '" data-k="' + key + '" ' + data + '><span class="fs-swt" aria-hidden="true"><i></i></span><span class="fs-swl">' + label + '</span><span class="fs-swv" aria-hidden="true">' + (on ? "On" : "Off") + "</span></button>";
}
function setSwitch(b, on){ if (!b) return; b.setAttribute("aria-checked", !!on); b.querySelector(".fs-swv").textContent = on ? "On" : "Off"; }

// ---------- @component stepIcons — clean / separate / cook / chill / not a hazard glyphs (24 × 24, stroke in currentColor;
//   colour from --fs-* via .fs-c-<step>; always shown with the step's word) ----------
var ICON = {
  clean:'<path d="M12 3c3.2 4.6 6 7.7 6 11a6 6 0 0 1-12 0c0-3.3 2.8-6.4 6-11z"/><path d="M9.3 14.4a2.7 2.7 0 0 0 2.7 2.7"/>',
  separate:'<rect x="2.5" y="6" width="8" height="12" rx="1.5"/><rect x="13.5" y="6" width="8" height="12" rx="1.5"/>',
  cook:'<path d="M10 4.6a2 2 0 0 1 4 0v9.1a4 4 0 1 1-4 0z"/><path d="M12 9v6.5"/>',
  chill:'<path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6M9.5 4.3 12 6.6l2.5-2.3M9.5 19.7l2.5-2.3 2.5 2.3"/>',
  none:'<circle cx="12" cy="12" r="8.5"/><path d="M8 12h8"/>'
};
function icon(id, sz){ return '<svg class="fs-ic fs-c-' + id + '" viewBox="0 0 24 24" width="' + (sz || 18) + '" height="' + (sz || 18) + '" aria-hidden="true" focusable="false">' + (ICON[id] || "") + "</svg>"; }
function stepT(id){ var s = byId(MV.C.explore.steps, id); return s ? s.t : ""; }
function stepChip(id){ return '<span class="fs-stp">' + icon(id) + "<span>" + stepT(id) + "</span></span>"; }

// ---------- hero: thermometer bands, a tray of bacteria doubling 1 → 2 → 4 → 8, then the four steps ----------
var HPOS = [[0, 0], [1, 0], [0, 1], [1, 1], [-1, 0], [2, 0], [-1, 1], [2, 1]];   // grid cells; dot i+n splits from dot i
function heroSVG(st, nw){
  var Hc = MV.C.hero, B = Hc.bands, h = "";
  var th = nw ? { x:26, top:14, h:206, w:30, lx:66 } : { x:22, top:18, h:214, w:30, lx:62 };
  var yHot = th.top, yDz = th.top + th.h * 0.24, yCold = th.top + th.h * 0.76, yEnd = th.top + th.h, bx = th.x + th.w / 2;
  h += '<g opacity="' + f1(st.b) + '">';
  h += '<rect class="fs-hhot" x="' + th.x + '" y="' + yHot + '" width="' + th.w + '" height="' + f1(yDz - yHot) + '" rx="6"/>';
  h += '<rect class="fs-hdz" x="' + th.x + '" y="' + f1(yDz) + '" width="' + th.w + '" height="' + f1(yCold - yDz) + '"/>';
  h += '<rect class="fs-hcold" x="' + th.x + '" y="' + f1(yCold) + '" width="' + th.w + '" height="' + f1(yEnd - yCold + 10) + '"/>';
  h += '<circle class="fs-hcold" cx="' + f1(bx) + '" cy="' + f1(yEnd + 20) + '" r="' + f1(th.w * 0.72) + '"/>';
  h += '<rect class="fs-hglass" x="' + th.x + '" y="' + yHot + '" width="' + th.w + '" height="' + f1(yEnd - yHot + 4) + '" rx="6"/><circle class="fs-hglass" cx="' + f1(bx) + '" cy="' + f1(yEnd + 20) + '" r="' + f1(th.w * 0.72) + '"/>';
  h += '<path class="fs-htick" d="M' + (th.x - 6) + " " + f1(yDz) + "h" + (th.w + 12) + "M" + (th.x - 6) + " " + f1(yCold) + "h" + (th.w + 12) + '"/>';
  h += svgT(th.lx, yHot + 18, B.hot, "fs-hlab fs-hhotx", "start") + svgT(th.lx, yHot + 36, "≥ 60 °C", "fs-hsub", "start");
  h += svgT(th.lx, (yDz + yCold) / 2 - 4, B.dz, "fs-hlab", "start") + svgT(th.lx, (yDz + yCold) / 2 + 14, "4–60 °C", "fs-hsub", "start");
  h += svgT(th.lx, yCold + 22, B.cold, "fs-hlab fs-hcoldx", "start") + svgT(th.lx, yCold + 40, "≤ 4 °C", "fs-hsub", "start");
  h += "</g>";
  // tray
  var tr = nw ? { x:168, y:24, w:142, h:150, cx:239, cy:110, s:30 } : { x:196, y:18, w:310, h:206, cx:351, cy:116, s:40 };
  h += '<g opacity="' + f1(st.b) + '"><rect class="fs-htray" x="' + tr.x + '" y="' + tr.y + '" width="' + tr.w + '" height="' + tr.h + '" rx="14"/>';
  if (!nw) h += '<path class="fs-hlink" d="M' + (th.x + th.w + 4) + " " + f1((yDz + yCold) / 2 + 28) + "C" + (th.x + 110) + " " + f1((yDz + yCold) / 2 + 28) + " " + (tr.x - 40) + " " + tr.cy + " " + (tr.x - 4) + " " + tr.cy + '"/>';
  var seq = [1, 2, 4, 8], cx0 = tr.cx - tr.s / 2;
  var cntS = seq.map(function(v){ return '<tspan class="' + (v === st.n ? "on" : v < st.n ? "" : "off") + '">' + v + "</tspan>"; }).join('<tspan class="off"> → </tspan>');
  h += '<text class="fs-hcnt" x="' + (tr.x + tr.w / 2) + '" y="' + (tr.y + (nw ? 26 : 34)) + '" text-anchor="middle">' + cntS + "</text>";
  for (var i = 0; i < st.n; i++) {
    var P = HPOS[i], px = cx0 + P[0] * tr.s, py = tr.cy + P[1] * tr.s, op = 1;
    if (i >= st.from) { var Q = HPOS[i - st.from]; px = lerp(cx0 + Q[0] * tr.s, px, st.g); py = lerp(tr.cy + Q[1] * tr.s, py, st.g); op = st.g; }
    h += '<ellipse class="fs-hdot" cx="' + f1(px) + '" cy="' + f1(py) + '" rx="' + (nw ? 10 : 12.5) + '" ry="' + (nw ? 6.5 : 8) + '" opacity="' + f1(op) + '" transform="rotate(-20 ' + f1(px) + " " + f1(py) + ')"/>';
  }
  var cap = Hc.model, cy = tr.y + tr.h - (nw ? 30 : 18);
  if (nw) h += svgT(160, 288, cap, "fs-hcap");
  else h += svgT(tr.x + tr.w / 2, cy, cap, "fs-hcap");
  h += "</g>";
  // the four steps
  var ids = ["clean", "separate", "cook", "chill"];
  ids.forEach(function(id, j){
    var op = clamp(st.steps - j, 0, 1); if (op <= 0) return;
    var x, y;
    if (nw) { x = 50 + (j % 2) * 150; y = 308 + Math.floor(j / 2) * 66; } else { x = 206 + j * 80; y = 248; }
    h += '<g opacity="' + f1(op) + '"><g class="fs-c-' + id + '" transform="translate(' + x + " " + y + ') scale(1.5)" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICON[id] + "</g>" +
      svgT(x + 18, y + 58, stepT(id), "fs-hstep fs-c-" + id) + "</g>";
  });
  return h;
}
function hero(f){
  var host = $("#fs-hero"); if (!host) return;
  var st = { b:0, n:1, from:1, g:1, steps:0 };
  host.innerHTML = '<svg class="fs-hsvg" viewBox="0 0 520 330" role="img" aria-label="' + esc(MV.C.hero.aria) + '"></svg>';
  var svg = host.firstChild;
  function draw(){ var nw = (host.getBoundingClientRect().width || 520) < 400; svg.setAttribute("viewBox", nw ? "0 0 320 440" : "0 0 520 330"); svg.classList.toggle("nw", nw); svg.innerHTML = heroSVG(st, nw); }
  window.addEventListener("resize", draw);
  if (MV.reduceMotion) { st.b = 1; st.n = 8; st.from = 8; st.steps = 4; draw(); return; }
  draw();
  function dbl(k, done){ st.from = st.n; st.n = k; st.g = 0; MV.tween({ dur:650, step:function(t){ st.g = t; draw(); }, done:function(){ MV.wait(450, done); } }); }
  MV.wait(300, function(){
    MV.tween({ dur:700, step:function(t){ st.b = t; draw(); }, done:function(){
      MV.wait(400, function(){ dbl(2, function(){ dbl(4, function(){ dbl(8, function(){
        MV.tween({ dur:1600, ease:function(t){ return t; }, step:function(t){ st.steps = t * 4; draw(); }, done:function(){ st.steps = 4; draw(); } });
      }); }); }); });
    } });
  });
}

// ---------- Explore: Kitchen detective (@component F8 kitchenDetective — Mode A scene with numbered hotspots and step chips,
// Mode B doubling clock with a dot tray (deterministic: doubles at each full 20 minutes) and big-batch cooling, Mode C
// thermometer with a probe-position chooser) ----------
// Scene A art, 800 × 440 (decorative; the numbered hotspots are real buttons laid over it). Pin centres per spot.
var PIN = { s4:[77, 168], s10:[258, 60], s8:[432, 52], s3:[201, 168], s1:[300, 212], s2:[436, 194], s5:[532, 210], s6:[618, 184], s7:[690, 222], s9:[766, 170] };
function sceneSVG(){
  var h = '<svg class="fs-ssvg" viewBox="0 0 800 440" aria-hidden="true" focusable="false">';
  h += '<rect class="fs-wall" width="800" height="440"/><rect class="fs-floor" y="428" width="800" height="12"/>';
  h += '<rect class="fs-win" x="560" y="24" width="200" height="112" rx="6"/><path class="fs-ln" d="M660 24v112M560 80h200"/>';
  // fridge with its thermometer display (spot 1)
  h += '<rect class="fs-unit" x="16" y="40" width="134" height="388" rx="10"/><path class="fs-ln" d="M16 150h134"/><path class="fs-hdl" d="M134 76v46M134 172v84"/>';
  h += '<rect class="fs-disp" x="38" y="188" width="78" height="40" rx="6"/>' + svgT(77, 215, "8 °C", "fs-dtx");
  // shelf, canned beans (spot 2), bread box (spot 3)
  h += '<rect class="fs-wood" x="186" y="128" width="330" height="9" rx="2"/>';
  [208, 242, 276].forEach(function(x){ h += '<rect class="fs-can" x="' + x + '" y="82" width="30" height="46" rx="4"/><rect class="fs-canl" x="' + x + '" y="96" width="30" height="17"/>' + svgT(x + 15, 108.5, "BEANS", "fs-tls"); });
  h += '<path class="fs-box" d="M374 128V94a22 22 0 0 1 22-22h72a22 22 0 0 1 22 22v34z"/><path class="fs-ln" d="M382 100h100"/>' + svgT(432, 120, "BREAD", "fs-tl");
  // counter and cabinets
  h += '<rect class="fs-ctop" x="160" y="262" width="640" height="16"/><rect class="fs-unit" x="166" y="278" width="628" height="150"/><path class="fs-ln" d="M323 278v150M480 278v150M637 278v150"/>';
  // milk carton (spot 4)
  h += '<path class="fs-milk" d="M182 262v-58l8-14h22l8 14v58z"/><path class="fs-ln" d="M182 204h38"/>' + svgT(201, 240, "MILK", "fs-tl");
  // cutting board: raw chicken beside salad vegetables, one knife (spot 5)
  h += '<rect class="fs-board" x="230" y="240" width="152" height="22" rx="6"/><path class="fs-chick" d="M242 250c6-14 36-16 46-5 8 8 0 15-14 15h-24c-10 0-12-3-8-10z"/>';
  h += '<circle class="fs-leaf" cx="320" cy="248" r="11"/><circle class="fs-leaf" cx="339" cy="244" r="10"/><circle class="fs-tom" cx="362" cy="250" r="9"/>';
  h += '<path class="fs-blade" d="M282 240l56-11 3 5-58 10z"/><rect class="fs-knife" x="340" y="224" width="28" height="8" rx="3" transform="rotate(-11 354 228)"/>';
  // hand in the salad bowl after raw chicken (spot 6)
  h += '<path class="fs-bowl" d="M398 238a38 24 0 0 0 76 0z"/><circle class="fs-leaf" cx="414" cy="235" r="9"/><circle class="fs-leaf" cx="456" cy="235" r="9"/>';
  h += '<path class="fs-arm" d="M506 150c-14 28-30 52-46 72"/><ellipse class="fs-hand" cx="452" cy="227" rx="13" ry="9"/>';
  h += '<circle class="fs-juice" cx="466" cy="214" r="3.2"/><circle class="fs-juice" cx="474" cy="204" r="2.6"/><circle class="fs-juice" cx="458" cy="240" r="2.6"/>';
  // burger cut open to check the colour (spot 7)
  h += '<ellipse class="fs-plate" cx="532" cy="258" rx="42" ry="7"/><rect class="fs-bun" x="503" y="241" width="54" height="10" rx="4"/><rect class="fs-patty" x="500" y="229" width="60" height="13" rx="4"/><path class="fs-bun" d="M503 229a27 17 0 0 1 54 0z"/>';
  h += '<path class="fs-blade" d="M566 254l18-24 4 2-18 24z"/>';
  // one dishcloth over the plates, with meat juice (spot 8)
  h += '<ellipse class="fs-plate" cx="618" cy="258" rx="28" ry="5"/><ellipse class="fs-plate" cx="618" cy="252" rx="28" ry="5"/><ellipse class="fs-plate" cx="618" cy="246" rx="28" ry="5"/>';
  h += '<path class="fs-cloth" d="M598 250c4-14 2-22 6-30h30c-4 8-2 18 2 30z"/><path class="fs-ln" d="M602 228h33M601 238h35"/><circle class="fs-juice" cx="612" cy="243" r="3.4"/><circle class="fs-juice" cx="624" cy="233" r="2.6"/>';
  // bananas (spot 9)
  h += '<path class="fs-ban" d="M664 256c14 8 38 6 50-8 2 6-2 12-10 16-14 6-32 4-42-2z"/><path class="fs-ban" d="M668 246c14 8 36 6 48-8 2 6-2 12-10 16-14 6-30 4-40-2z"/><path class="fs-ln" d="M714 238l6-6"/>';
  // handwashing sink with soap (spot 10)
  h += '<rect class="fs-basin" x="722" y="262" width="70" height="9" rx="3"/><path class="fs-tap" d="M774 262v-38a13 13 0 0 0-26 0v7"/><rect class="fs-soap" x="728" y="236" width="16" height="26" rx="3"/><path class="fs-ln" d="M736 236v-7h7"/>';
  return h + "</svg>";
}
// Mode C food art (360 × 200): shapes with the probe tip for each position (null = no bone in this food)
var FOODART = {
  patty:{ art:function(id){ return '<rect class="fs-crust" x="60" y="80" width="240" height="60" rx="22"/><rect class="' + (id === "gbeef" ? "fs-patb" : "fs-patp") + '" x="74" y="92" width="212" height="36" rx="14"/>'; }, thick:[180, 110], surface:[150, 82] },
  leg:{ art:function(){ return '<path class="fs-bone" d="M196 103h96v14h-96z"/><circle class="fs-bone" cx="298" cy="101" r="9"/><circle class="fs-bone" cx="298" cy="119" r="9"/><ellipse class="fs-meat" cx="140" cy="110" rx="92" ry="56"/><path class="fs-bonein" d="M150 110h52"/>'; }, thick:[104, 112], bone:[152, 104], surface:[96, 60] },
  bird:{ art:function(){ return '<ellipse class="fs-meat" cx="250" cy="92" rx="46" ry="24" transform="rotate(-14 250 92)"/><circle class="fs-bone" cx="298" cy="78" r="7"/><ellipse class="fs-meat" cx="150" cy="118" rx="114" ry="62"/><path class="fs-bonein" d="M216 106l56-18"/>'; }, thick:[116, 112], bone:[226, 102], surface:[70, 74] },
  chop:{ art:function(){ return '<path class="fs-meat" d="M84 66h166c34 0 52 24 52 48s-18 46-54 46H100c-22 0-32-16-32-40V82c0-10 6-16 16-16z"/><path class="fs-bone" d="M84 66h18v94h-2c-22 0-32-16-32-40V82c0-10 6-16 16-16z"/>'; }, thick:[210, 114], bone:[112, 112], surface:[220, 70] },
  fish:{ art:function(){ return '<path class="fs-fish" d="M44 110c42-46 144-54 224-28l44-24v104l-44-24c-80 26-182 18-224-28z"/><path class="fs-ln" d="M120 92c10 12 10 24 0 36M160 86c12 14 12 34 0 48"/>'; }, thick:[180, 110], surface:[110, 82] },
  dish:{ art:function(){ return '<rect class="fs-dish" x="40" y="108" width="20" height="14" rx="5"/><rect class="fs-dish" x="300" y="108" width="20" height="14" rx="5"/><rect class="fs-dish" x="54" y="94" width="252" height="66" rx="12"/><rect class="fs-fill" x="64" y="86" width="232" height="38" rx="12"/>'; }, thick:[180, 122], surface:[180, 90] }
};

function explore(host, api){
  var D = api.content, S = api.S, SC = D.scene, CL = D.clock, TH = D.thermo, R = D.rows;
  var anim = null, pend = null, timers = [];
  S.mode = byId(D.modes, S.mode) ? S.mode : "hazard";
  S.tags = S.tags && typeof S.tags === "object" ? S.tags : {};
  SC.spots.forEach(function(s){ if (S.tags[s.id] && !byId(D.steps, S.tags[s.id])) delete S.tags[s.id]; });
  S.sel = byId(SC.spots, S.sel) ? S.sel : "";
  S.zoom = !!S.zoom;
  S.sub = S.sub === "big" ? "big" : "clock";
  S.food = byId(CL.foods, S.food) ? S.food : "salad";
  S.start = clamp(Math.round(numOr(S.start, 100)), 1, 10000);
  S.temp = clamp(Math.round(numOr(S.temp, 22)), -18, 75);
  S.time = clamp(Math.round(numOr(S.time, 0) / 20) * 20, 0, 360);
  S.reheat = !!S.reheat;
  S.method = byId(CL.big.methods, S.method) ? S.method : "";
  S.cfood = byId(TH.foods, S.cfood) ? S.cfood : "gbeef";
  S.probe = byId(TH.probes, S.probe) ? S.probe : "thick";
  S.read = clamp(Math.round(numOr(S.read, 40)), 0, 100);
  if (S.probe === "bone" && !byId(TH.foods, S.cfood).bone) S.probe = "thick";
  var fx = { from:0, g:1, fade:null, tox:null, readT:null, lit:[] };

  host.innerHTML = '<div id="fs-mode"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="fs-lab" data-mv="graph"><div class="fs-main"><div id="fs-pA"></div><div id="fs-pB" hidden></div><div id="fs-pC" hidden></div></div>' +
    '<div class="fs-side"><h4 class="fs-h4">Readout</h4><dl class="read" id="fs-read" aria-live="polite"></dl></div></div>' +
    '<details class="alg fs-about" id="fs-aboutB" hidden><summary>About this model</summary><p><span class="hfa-model">' + CL.label + '</span></p><ul class="fs-rules">' + CL.rules.map(function(x){ return "<li>" + x + "</li>"; }).join("") + '</ul><p class="tiny muted">' + CL.note + "</p></details>" +
    '<details class="alg fs-about" id="fs-aboutC" hidden><summary>' + TH.tableTitle + "</summary>" + MV.tableHTML({ head:["Food", "Safe internal temperature"], rows:TH.foods.map(function(fd){ return [fd.t, fd.safe + " °C"]; }), caption:TH.tableTitle }) + "</details>";
  var modeRG = radios($("#fs-mode"), { label:"Mode", options:D.modes, value:S.mode, onChange:function(v){ cancelAnim(); S.mode = v; MV.banner("", ""); commit(); } });

  // ===== Mode A: Spot the hazard =====
  var pA = $("#fs-pA");
  pA.innerHTML = '<p class="how">' + SC.how + '</p><div class="fs-zoomw">' + switchHTML("fszoom", "Zoom in on the kitchen (scroll sideways to pan)", S.zoom, 'id="fs-zoom"') + "</div>" +
    '<div class="fs-scroll" id="fs-scroll" role="group" aria-label="Kitchen scene: ten numbered spots"><div class="fs-scene' + (S.zoom ? " zoom" : "") + '" id="fs-scene">' + sceneSVG() + '<div id="fs-pins"></div></div></div>' +
    '<div class="fs-pick" id="fs-pick" aria-live="polite"></div><p class="fs-rgl fs-listh">All spots</p><ul class="fs-spots" id="fs-spots"></ul>';
  var SPOTS = SC.spots.slice().sort(function(a, b){ return a.n - b.n; });
  function isDecoy(s){ var a = MV.ans(s) || []; return a.length === 1 && a[0] === "none"; }
  function accepted(s, tag){ return (MV.ans(s) || []).indexOf(tag) >= 0; }
  function hz(){ var found = 0, err = 0; SC.spots.forEach(function(s){ var t = S.tags[s.id]; if (isDecoy(s)) { if (t && t !== "none") err++; } else if (t && accepted(s, t)) found++; }); return { found:found, err:err }; }
  function pinsPaint(){
    MV.keepFocus($("#fs-pins"), function(){
      $("#fs-pins").innerHTML = SPOTS.map(function(s){
        var tag = S.tags[s.id], P = PIN[s.id];
        return '<button type="button" class="fs-pin' + (tag ? " tagged fs-b-" + tag : "") + '" style="left:' + f1(P[0] / 8) + "%;top:" + f1(P[1] / 4.4) + '%" data-spot="' + s.id + '" data-k="pin' + s.id + '" aria-pressed="' + (S.sel === s.id) + '" aria-label="' + esc(s.n + ". " + s.aria + ": " + (tag ? "tagged " + stepT(tag) : "not tagged")) + '"><span aria-hidden="true">' + s.n + "</span>" + (tag ? '<i class="fs-pintag" aria-hidden="true">' + icon(tag, 15) + "</i>" : "") + "</button>";
      }).join("");
    });
    MV.keepFocus($("#fs-spots"), function(){
      $("#fs-spots").innerHTML = SPOTS.map(function(s){
        var tag = S.tags[s.id];
        return '<li><button type="button" class="fs-spotb' + (tag ? " tagged fs-b-" + tag : "") + '" data-spot="' + s.id + '" data-k="ls' + s.id + '" aria-pressed="' + (S.sel === s.id) + '"><span class="fs-sn">' + s.n + '</span><span class="fs-sname">' + s.short + '</span><span class="fs-stag">' + (tag ? stepChip(tag) : '<span class="muted">not tagged</span>') + "</span></button></li>";
      }).join("");
    });
  }
  function pickPaint(){
    var s = byId(SC.spots, S.sel), box = $("#fs-pick");
    if (!s) { box.innerHTML = '<p class="fs-pickt muted">Tap a numbered spot in the kitchen, or a spot in the list, to tag it.</p>'; return; }
    box.innerHTML = '<p class="fs-pickt"><strong>Spot ' + s.n + ":</strong> " + s.t + '</p><div id="fs-steprg"></div><div class="q-actions fs-pickact"><button type="button" class="btn ghost sm" id="fs-clear" data-k="fsclear"' + (S.tags[s.id] ? "" : " disabled") + ">Clear this tag</button></div>";
    radios($("#fs-steprg"), { label:"Step", aria:"Step for spot " + s.n, cls:"chips", options:D.steps.map(function(x){ return { id:x.id, t:stepChip(x.id) }; }), value:S.tags[s.id] || "",
      onChange:function(v){ cancelAnim(); S.tags[s.id] = v; $("#fs-clear").disabled = false; commitA(); } });
  }
  function commitA(){ api.save(); pinsPaint(); readPaint(); MV.changed(); }
  pA.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.spot) { cancelAnim(); S.sel = b.dataset.spot; api.save(); pinsPaint(); pickPaint(); return; }
    if (b.id === "fs-clear") { cancelAnim(); delete S.tags[S.sel]; api.save(); pickPaint(); commitA(); var c = $("#fs-steprg [data-rg]"); if (c) c.focus({ preventScroll:true }); return; }
    if (b.id === "fs-zoom") { S.zoom = !S.zoom; setSwitch(b, S.zoom); $("#fs-scene").classList.toggle("zoom", S.zoom); api.save(); }
  });

  // ===== Mode B: Danger-zone clock =====
  var pB = $("#fs-pB");
  pB.innerHTML = '<div id="fs-sub"></div><div class="fs-trayw"><canvas class="plot wide fs-tray" id="fs-tray" role="img" aria-label="Dot tray"></canvas><div class="fs-trayo" id="fs-trayo" aria-hidden="true"></div></div>' +
    '<div class="fs-bandw" id="fs-band" aria-hidden="true"></div>' +
    '<div id="fs-bclock"><div id="fs-food"></div><p class="tiny fs-toxnote" id="fs-toxnote" aria-live="polite"></p><div class="fs-numrow"><label for="fs-start">Starting count</label><input class="numin short" id="fs-start" type="text" inputmode="numeric" autocomplete="off" data-k="fsstart" value="' + S.start + '"><span class="tiny muted" id="fs-startnote" aria-live="polite"></span></div><div id="fs-sl"></div><div id="fs-rh">' + switchHTML("fsrh", "<strong>" + CL.reheat + "</strong>", S.reheat, 'id="fs-reheat"') + "</div></div>" +
    '<div id="fs-bbig" hidden><p class="fs-bigt">' + CL.big.t + '</p><div id="fs-meth"></div></div>';
  function food(){ return byId(CL.foods, S.food); }
  function meth(){ return byId(CL.big.methods, S.method); }
  function inDZ(T){ return T > 4 && T < 60; }
  function band(T){ return T <= 4 ? "cold" : T >= 60 ? "hot" : "dz"; }
  function bandWord(T){ return T <= 4 ? "cold" : T >= 60 ? "hot" : "danger zone"; }
  function dzMin(){ return S.sub === "big" ? (meth() ? meth().min : 0) : (inDZ(S.temp) ? S.time : 0); }
  function startN(){ return S.sub === "big" ? 100 : S.start; }
  function count(){ return startN() * Math.pow(2, Math.floor(dzMin() / 20)); }
  var subRG = radios($("#fs-sub"), { label:"Clock", options:[{ id:"clock", t:"Danger-zone clock" }, { id:"big", t:"Big batch" }], value:S.sub, onChange:function(v){ cancelAnim(); S.sub = v; commit(); } });
  var foodRG = radios($("#fs-food"), { label:"Food", cls:"chips", options:CL.foods.map(function(fd){ return { id:fd.id, t:fd.t + (fd.tox ? ' <span class="fs-toxt">toxin-former</span>' : "") }; }), value:S.food, onChange:function(v){ cancelAnim(); S.food = v; commit(); } });
  var sl = MV.sliders($("#fs-sl"), [
    { id:"fstemp", label:"Temperature", min:-18, max:75, step:1, value:S.temp, fmt:degC },
    { id:"fstime", label:"Time", min:0, max:360, step:20, value:S.time, fmt:fmtTime }
  ], function(id, v){ cancelAnim(); if (id === "fstemp") S.temp = v; else S.time = v; commit(); });
  var methRG = radios($("#fs-meth"), { label:"Cooling method", cls:"chips", options:CL.big.methods.map(function(m){ return { id:m.id, t:m.t + ' <span class="fs-mt">' + fmtTime(m.min).replace(" 0 min", "") + " in the danger zone</span>" }; }), value:S.method, onChange:function(v){ cancelAnim(); S.method = v; commit(); } });
  $("#fs-start").addEventListener("input", function(e){
    var v = numIn(e.target.value), note = $("#fs-startnote");
    if (v != null && v >= 1 && v <= 10000 && Math.round(v) === v) { cancelAnim(); S.start = v; note.textContent = ""; commit(); }
    else note.textContent = "Enter a whole number from 1 to 10 000.";
  });
  $("#fs-reheat").addEventListener("click", function(){ cancelAnim(); S.reheat = !S.reheat; commit(); });

  // dot tray: up to 6400 dots as a density field (fixed, seeded positions: a jittered 80 × 80 grid in shuffled order)
  var DOTS = (function(){
    var n = 80, pts = [], seed = 1234567;
    function rnd(){ seed = (Math.imul(seed, 1103515245) + 12345) >>> 0; return seed / 4294967296; }
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) pts.push([(i + 0.15 + 0.7 * rnd()) / n, (j + 0.15 + 0.7 * rnd()) / n]);
    for (var k = pts.length - 1; k > 0; k--) { var m = Math.floor(rnd() * (k + 1)), t = pts[k]; pts[k] = pts[m]; pts[m] = t; }
    return pts;
  })();
  var tray = new MV.Plot($("#fs-tray"), { xmin:0, xmax:1, ymin:0, ymax:1 });
  var HEX = '<svg class="fs-hex" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M8 1.5l5.6 3.25v6.5L8 14.5l-5.6-3.25v-6.5z"/></svg>';
  function fadeNow(){ return fx.fade != null ? fx.fade : (S.sub === "clock" && S.reheat ? 1 : 0); }
  function toxShown(){ var fd = food(); return S.sub === "clock" && S.reheat && fd.tox && count() > S.start && fx.tox !== false; }
  function trayDesc(){
    var n = count(), fd = food();
    if (S.sub === "big") return "Dot tray, model data: chili cooled " + (meth() ? "by “" + meth().t + "”, " + fmtTime(meth().min) + " in the danger zone" : "(no cooling method chosen)") + ". Model count " + MV.num(n) + (n > 6400 ? ", too many to draw" : "") + ".";
    return "Dot tray, model data: " + fd.t.toLowerCase() + " at " + degC(S.temp) + " (" + bandWord(S.temp) + ") for " + fmtTime(S.time) + ", starting at " + S.start + ". Model count " + MV.num(n) + (n > 6400 ? ", too many to draw" : "") + "." +
      (S.reheat ? " Reheated to 74 °C: most bacteria killed" + (toxShown() ? ", but the toxin stays." : ".") : "");
  }
  function drawTray(){
    if (pB.hidden) return;
    var n = count(), N = Math.min(n, 6400), from = fx.g < 1 ? Math.min(fx.from, 6400) : N, fade = fadeNow();
    var bd = S.sub === "big" ? "dz" : (fade > 0.5 ? "hot" : band(S.temp));
    tray.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, describe:trayDesc(), after:function(ctx, p){
      var W = p.W, H = p.H;
      if (bd === "dz") { ctx.fillStyle = css("--hi-soft"); ctx.fillRect(0, 0, W, H); }
      else { ctx.globalAlpha = 0.13; ctx.fillStyle = css(bd === "cold" ? "--p-t" : "--p-k"); ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
      var r = clamp(0.11 * Math.sqrt(W * H / Math.max(N, 100)), 1.1, 4.2), ink = css(fade > 0 ? "--ink-2" : "--ink"), base = 1 - 0.78 * fade;
      function dots(a, b, alpha){ if (b <= a || alpha <= 0) return; ctx.globalAlpha = alpha; ctx.fillStyle = ink; ctx.beginPath(); for (var i = a; i < b; i++) { var x = 6 + DOTS[i][0] * (W - 12), y = 6 + DOTS[i][1] * (H - 12); ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, 6.2832); } ctx.fill(); ctx.globalAlpha = 1; }
      dots(0, Math.min(from, N), base); dots(Math.min(from, N), N, base * fx.g);
    } });
  }
  tray.render = drawTray;
  function trayOver(){
    var n = count(), fd = food(), h = '<div class="fs-trtop">';
    h += '<span class="fs-tc">' + (n > 6400 ? "<b>" + MV.num(n) + "</b>: too many to draw" : "<b>" + MV.num(n) + "</b> bacteria") + "</span>";
    var hot = S.sub === "clock" && fadeNow() > 0.5;
    h += '<span class="fs-tb fs-band-' + (S.sub === "big" ? "dz" : hot ? "hot" : band(S.temp)) + '">' + (S.sub === "big" ? "Cooling 60 °C → 4 °C" : hot ? "Reheated to 74 °C" : MV.cap(bandWord(S.temp)) + " · " + degC(S.temp)) + "</span>";
    h += '</div><div class="fs-trbot">';
    if (toxShown()) h += '<span class="fs-tx on">' + HEX + "Toxin stays</span>";
    h += '<span class="fs-tm hfa-model">' + CL.label + "</span></div>";
    $("#fs-trayo").innerHTML = h;
    $("#fs-toxnote").innerHTML = fd.tox ? '<span class="fs-toxt">toxin-former</span> ' + CL.toxin : "";
  }
  function bandPaint(){
    var X = function(T){ return f1((T + 18) / 93 * 100); }, h = '<div class="fs-band"><span class="cold" style="width:' + X(4) + '%">Cold</span><span class="dz" style="width:' + f1(56 / 93 * 100) + '%">Danger zone</span><span class="hot" style="width:' + f1(15 / 93 * 100) + '%">Hot</span>';
    if (S.sub === "big") h += '<i class="fs-cool" style="left:' + X(4) + "%;width:" + f1(56 / 93 * 100) + '%"></i>';
    else h += '<i class="fs-mark" style="left:' + X(S.temp) + '%"><b>' + degC(S.temp) + "</b></i>";
    h += '</div><div class="fs-ticks"><span style="left:0">' + degC(-18) + '</span><span style="left:' + X(4) + '%">4 °C</span><span style="left:' + X(60) + '%">60 °C</span><span style="left:100%">75 °C</span></div>';
    $("#fs-band").innerHTML = h;
  }
  function paintB(){
    subRG.set(S.sub); foodRG.set(S.food); methRG.set(S.method);
    sl.set("fstemp", S.temp); sl.set("fstime", S.time);
    var si = $("#fs-start"); if (document.activeElement !== si) si.value = S.start;
    setSwitch($("#fs-reheat"), S.reheat);
    $("#fs-bclock").hidden = S.sub !== "clock"; $("#fs-bbig").hidden = S.sub !== "big";
    drawTray(); trayOver(); bandPaint();
  }

  // ===== Mode C: Thermometer check =====
  var pC = $("#fs-pC");
  pC.innerHTML = '<div class="fs-thw"><svg class="fs-fsvg" id="fs-fsvg" viewBox="0 0 360 200" role="img" aria-label=""></svg><div class="fs-dial" id="fs-dial" aria-hidden="true"></div></div>' +
    '<div id="fs-cfood"></div><div id="fs-cprobe"></div><div id="fs-csl"></div>';
  function cfood(){ return byId(TH.foods, S.cfood); }
  function readNow(){ return fx.readT != null ? Math.round(fx.readT) : S.read; }
  function verdict(){
    var fd = cfood(), r = readNow();
    if (S.probe !== "thick") return { ok:false, txt:TH.move[S.probe] };
    return r >= fd.safe ? { ok:true, txt:fill(TH.safe, { s:fd.safe, f:fd.short }) } : { ok:false, txt:fill(TH.notYet, { s:fd.safe }) };
  }
  var cfoodRG = radios($("#fs-cfood"), { label:"Food", cls:"chips", options:TH.foods.map(function(fd){ return { id:fd.id, t:fd.t }; }), value:S.cfood,
    onChange:function(v){ cancelAnim(); S.cfood = v; if (S.probe === "bone" && !cfood().bone) S.probe = "thick"; commit(); } });
  var probeRG = radios($("#fs-cprobe"), { label:"Probe", cls:"chips", aria:"Probe position", options:TH.probes, value:S.probe, onChange:function(v){ cancelAnim(); S.probe = v; commit(); } });
  var rsl = MV.sliders($("#fs-csl"), [{ id:"fsread", label:"Reading", min:0, max:100, step:1, value:S.read, fmt:degC }], function(id, v){ cancelAnim(); S.read = v; commit(); });
  function paintC(){
    var fd = cfood(), A = FOODART[fd.shape], tip = A[S.probe] || A.thick, r = readNow(), v = verdict();
    cfoodRG.set(S.cfood); probeRG.off(fd.bone ? [] : ["bone"]); probeRG.set(S.probe);
    if (fx.readT == null) rsl.set("fsread", S.read);
    var ex = clamp(tip[0] + 64, 20, 344), ey = clamp(tip[1] - 76, 10, 190);
    var h = A.art(fd.id) + '<path class="fs-probe" d="M' + ex + " " + ey + "L" + tip[0] + " " + tip[1] + '"/><circle class="fs-ptip" cx="' + tip[0] + '" cy="' + tip[1] + '" r="4"/><rect class="fs-phead" x="' + (ex - 11) + '" y="' + (ey - 9) + '" width="22" height="18" rx="5"/>';
    if (fd.id === "gbeef") h += svgT(180, 186, TH.brown, "fs-ftl");
    var svg = $("#fs-fsvg"); svg.innerHTML = h;
    svg.setAttribute("aria-label", fd.t + ". Probe: " + byId(TH.probes, S.probe).t.toLowerCase() + ". Reading " + degC(r) + ". " + v.txt + (fd.id === "gbeef" ? ". " + TH.brown + "." : "."));
    $("#fs-dial").innerHTML = '<span class="tiny">Reading</span><b>' + degC(r) + '</b><span class="fs-vd ' + (v.ok ? "ok" : "no") + '">' + (v.ok ? "✓ " : "✗ ") + v.txt + "</span>";
  }

  // ===== readout =====
  function rows(){
    if (S.mode === "hazard") { var h = hz(); return [["found", R.found, "<strong>" + h.found + " of 6</strong>" + (h.err ? " · " + h.err + " non-hazard" + (h.err > 1 ? "s" : "") + " flagged" : "")]]; }
    if (S.mode === "clock") {
      var n = count(), out = [
        ["temp", R.temp, S.sub === "big" ? "60 °C → 4 °C (cooling)" : degC(S.temp) + " (" + bandWord(S.temp) + ")"],
        ["time", R.time, S.sub === "big" && !meth() ? "choose a cooling method" : fmtTime(dzMin())],
        ["count", R.count, "<strong>" + MV.num(n) + "</strong>" + (n > 6400 ? " (too many to draw)" : "")]];
      if (S.sub === "clock" && S.reheat) out.push(["reheat", R.reheat, fx.fade != null && fx.fade < 1 ? "heating…" : (toxShown() ? "<strong>" + CL.toxinStays + "</strong>" : CL.reheated)]);
      return out;
    }
    var v = verdict();
    return [["food", R.food, cfood().t], ["reading", R.reading, degC(readNow())], ["probe", R.probe, byId(TH.probes, S.probe).t], ["verdict", R.verdict, '<strong class="fs-vd ' + (v.ok ? "ok" : "no") + '">' + (v.ok ? "✓ " : "✗ ") + v.txt + "</strong>"]];
  }
  function readPaint(){ $("#fs-read").innerHTML = rows().map(function(r){ return '<div class="' + (fx.lit.indexOf(r[0]) >= 0 ? "fs-lit" : "") + '" data-row="' + r[0] + '"><dt>' + r[1] + "</dt><dd>" + r[2] + "</dd></div>"; }).join(""); }

  function paint(){
    modeRG.set(S.mode);
    pA.hidden = S.mode !== "hazard"; pB.hidden = S.mode !== "clock"; pC.hidden = S.mode !== "thermo";
    $("#fs-aboutB").hidden = S.mode !== "clock"; $("#fs-aboutC").hidden = S.mode !== "thermo";
    if (S.mode === "hazard") { pinsPaint(); pickPaint(); }
    else if (S.mode === "clock") paintB();
    else paintC();
    readPaint();
  }
  function commit(){ fx.lit = []; api.save(); paint(); MV.changed(); }
  function finish(){ anim = null; timers = []; fx.g = 1; fx.fade = null; fx.tox = null; fx.readT = null; api.save(); paint(); MV.changed(); var d = pend; pend = null; if (d) d(); }
  function cancelAnim(){ if (anim) { anim(); anim = null; } timers.forEach(clearTimeout); timers = []; fx.g = 1; fx.fade = null; fx.tox = null; fx.readT = null; if (pend) { var d = pend; pend = null; d(); } }
  function later(ms, fn){ timers.push(MV.wait(ms, fn)); }
  if (window.matchMedia && window.matchMedia("(min-width: 821px)").matches) $("#fs-aboutB").open = true;
  paint();

  // ===== challenges (plan's exact tests and named wrong states) =====
  var CH = {}; D.challenges.forEach(function(c){ CH[c.id] = c; });
  function challenge(id, opt){
    var M = CH[id].msgs, r = { ok:false };
    if (id === "tc1") {
      var T = S.tags;
      var anyTag = SC.spots.some(function(s){ return T[s.id]; });
      var dec = SPOTS.filter(function(s){ return s.id !== "s7" && isDecoy(s) && T[s.id] && T[s.id] !== "none"; })[0];
      var badStep = SC.spots.filter(function(s){ return !isDecoy(s) && s.id !== "s4" && T[s.id] && !accepted(s, T[s.id]) && !(s.id === "s5" && T[s.id] === "chill"); })[0];
      var others = SC.spots.filter(function(s){ return !isDecoy(s) && s.id !== "s4" && T[s.id] && accepted(s, T[s.id]); }).length;
      if (!anyTag) r.msg = M.none;
      else if (T.s7 && T.s7 !== "none") r.msg = M.bananas;
      else if (dec) r.msg = fill(M.decoy, { name:"Spot " + dec.n + " (" + dec.short.toLowerCase() + ")" });
      else if (T.s5 === "chill") r.msg = M.chill;
      else if (T.s4 && T.s4 !== "chill") r.msg = M.fridge;
      else if (badStep) r.msg = M.step;
      else if (hz().found === 6) r = { ok:true };
      else if (!T.s4 && others === 5) r.msg = M.fridge;
      else r.msg = fill(M.count, { n:hz().found });
    } else if (id === "tc2") {
      var n = count();
      if (S.sub !== "clock") r.msg = M.clockMode;
      else if (S.food !== "stew" || S.start !== 100 || S.temp !== 22) r.msg = M.setup;
      else if (S.time === 60) r = { ok:true };
      else if (S.time === 80) r.msg = M.m80;
      else if (S.time === 120) r.msg = M.m120;
      else if (S.time === 40) r.msg = M.m40;
      else r.msg = fill(S.time < 60 ? M.low : M.high, { n:MV.num(n) });
    } else if (id === "tc3") {
      if (S.sub !== "big" || !S.method) r.msg = M.setup;
      else if (S.method === "shallow" || S.method === "ice") r = { ok:true };
      else r.msg = M[S.method];
    }
    if (r.ok && opt && !opt.live && id === "tc3") MV.banner("good", MV.plain(CH[id].why));
    return r;
  }

  // ===== predictions =====
  function reveal(el){ var b = el && el.getBoundingClientRect(); if (b && (b.top < 110 || b.bottom > window.innerHeight)) el.scrollIntoView({ block:"center", behavior:MV.reduceMotion ? "auto" : "smooth" }); }
  function quickB(){ sl.set("fstime", S.time); setSwitch($("#fs-reheat"), S.reheat); drawTray(); trayOver(); bandPaint(); readPaint(); }
  return {
    predict:{
      start:function(p){
        cancelAnim(); fx.lit = [];
        if (p.id === "p4") { S.mode = "thermo"; S.cfood = "gbeef"; S.probe = "thick"; S.read = 20; }
        else {
          S.mode = "clock"; S.sub = "clock"; S.start = 100; S.reheat = false;
          if (p.id === "p1") { S.food = "salad"; S.temp = 22; S.time = 0; }
          else if (p.id === "p2") { S.food = "salad"; S.temp = 4; S.time = 0; }
          else { S.food = "rice"; S.temp = 22; S.time = 360; }
        }
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        pend = done;
        if (p.id === "p1" || p.id === "p2") {
          reveal($("#fs-tray"));
          var k = 0;
          var stepOnce = function(){
            if (k >= 6) { fx.lit = p.id === "p1" ? ["time", "count"] : ["temp", "count"]; finish(); return; }
            fx.from = count(); S.time += 20; fx.g = 0; quickB();
            anim = MV.tween({ dur:p.id === "p1" ? 460 : 300, step:function(t){ fx.g = t; drawTray(); }, done:function(){ anim = null; fx.g = 1; k++; later(p.id === "p1" ? 180 : 120, stepOnce); } });
          };
          later(250, stepOnce);
        } else if (p.id === "p3") {
          reveal($("#fs-tray"));
          later(400, function(){
            S.reheat = true; fx.tox = false; fx.fade = 0; quickB();
            anim = MV.tween({ dur:1400, step:function(t){ fx.fade = t; drawTray(); }, done:function(){ anim = null; fx.fade = 1; fx.tox = null; quickB(); later(500, function(){ fx.lit = ["reheat"]; finish(); }); } });
          });
        } else {
          reveal($("#fs-fsvg"));
          fx.readT = 20; paintC(); readPaint();
          later(300, function(){
            anim = MV.tween({ dur:1500, step:function(t){ fx.readT = lerp(20, 64, t); paintC(); readPaint(); }, done:function(){ anim = null; S.read = 64; fx.readT = null; fx.lit = ["reading", "verdict"]; finish(); } });
          });
        }
      }
    },
    challenge:challenge
  };
}

// ---------- Part 3: Outbreak investigation (@component outbreakTable — N4 attack-rate entry with ✓/✗ cells and a paired
// bar chart; @component pathogenCards — clue cards with a single "fits" pick; the real-system panel) ----------
function part3(host, api){
  var D = api.content, S = api.S, PL = D.potluck, BG = D.bugs, SY = D.system;
  S.st = byId(D.stations, S.st) ? S.st : "rates";
  S.ar = S.ar || {}; S.ar.vals = S.ar.vals || {}; S.ar.marks = S.ar.marks || {};
  S.bug = S.bug || ""; S.seen = S.seen || {};
  S.seen[S.st] = true;
  host.innerHTML = '<div id="fs-stn"></div><p class="tiny" id="fs-stp" aria-live="polite"></p><div class="fs-st" id="fs-st-rates"></div><div class="fs-st" id="fs-st-bugs" hidden></div><div class="fs-st" id="fs-st-system" hidden></div>';
  function done(id){
    if (id === "rates") return !!S.ar.solved && S.ar.pick === MV.ans(PL);
    if (id === "bugs") return S.bug === MV.ans(BG);
    return !!S.seen.system;
  }
  function stLabels(){ return D.stations.map(function(s){ return { id:s.id, t:s.t + (done(s.id) ? ' <span class="fs-stok">✓<span class="vh"> finished</span></span>' : "") }; }); }
  var stOpts = stLabels();
  var stRG = radios($("#fs-stn", host), { label:"Station", cls:"chips", options:stOpts, value:S.st, onChange:function(v){ S.st = v; S.seen[v] = true; api.save(); paintAll(); } });
  function stRepaint(){
    stLabels().forEach(function(x, i){ stOpts[i].t = x.t; }); stRG.repaint();
    $("#fs-stp", host).textContent = "Stations finished: " + D.stations.filter(function(s){ return done(s.id); }).length + " of " + D.stations.length + ".";
  }

  // ===== Station 1: attack rates =====
  var s1 = $("#fs-st-rates", host);
  function rate(pair){ return pair[0] / pair[1] * 100; }
  function cells(){ var out = []; PL.foods.forEach(function(fd){ out.push({ k:fd.id + "-a", fd:fd, pair:fd.ate, who:"ate" }, { k:fd.id + "-n", fd:fd, pair:fd.not, who:"didn’t eat" }); }); return out; }
  s1.innerHTML = '<h4 class="fs-h4">' + PL.title + ' <span class="hfa-model">Model data</span></h4><p>' + PL.text + '</p><p class="how">' + PL.how + '</p><div id="fs-artab"></div><div class="q-actions"><button type="button" class="btn primary sm" id="fs-archk" data-k="fsarchk">Check my rates</button></div><div id="fs-arfb"></div><div id="fs-archart"></div><div id="fs-arpick"></div>';
  function inCell(c){
    var m = S.ar.marks[c.k], dis = S.ar.solved ? " disabled" : "";
    return '<td class="fs-arc' + (m ? " " + m : "") + '"><span class="fs-arin"><input class="numin" type="text" inputmode="decimal" autocomplete="off" data-ar="' + c.k + '" data-k="ar' + c.k + '" aria-label="' + esc(c.fd.t + ", " + c.who + ": % ill") + '" value="' + esc(S.ar.vals[c.k] || "") + '"' + dis + "><span>%</span>" +
      (m ? '<b class="fs-armk" aria-hidden="true">' + (m === "ok" ? "✓" : "✗") + '</b><span class="vh">' + (m === "ok" ? " right" : " check again") + "</span>" : "") + "</span></td>";
  }
  function tabPaint(){
    var C = cells();
    $("#fs-artab", s1).innerHTML = '<div class="tbl-wrap"><table class="fs-ar"><caption class="vh">Potluck attack rates, model data</caption><thead><tr>' + PL.heads.map(function(t){ return '<th scope="col">' + t + "</th>"; }).join("") + "</tr></thead><tbody>" +
      PL.foods.map(function(fd, i){ return '<tr><th scope="row">' + fd.t + "</th><td>" + fd.ate[0] + " / " + fd.ate[1] + "</td>" + inCell(C[2 * i]) + "<td>" + fd.not[0] + " / " + fd.not[1] + "</td>" + inCell(C[2 * i + 1]) + "</tr>"; }).join("") + "</tbody></table></div>";
    $("#fs-archk", s1).hidden = !!S.ar.solved;
  }
  function fbPaint(){ var x = S.ar; $("#fs-arfb", s1).innerHTML = x.solved ? MV.fbHTML("good", "<strong>✓ " + PL.msgs.ok + "</strong> " + PL.rule) : x.msg ? MV.fbHTML(x.skip ? "" : "bad", x.msg) : ""; }
  function chartPaint(){
    if (!S.ar.solved) { $("#fs-archart", s1).innerHTML = ""; $("#fs-arpick", s1).innerHTML = ""; return; }
    var desc = PL.foods.map(function(fd){ return fd.t + ": ate " + pct(rate(fd.ate)) + ", didn’t eat " + pct(rate(fd.not)); }).join("; ");
    $("#fs-archart", s1).innerHTML = '<figure class="fs-arf"><figcaption class="fs-h5">' + PL.chart + ' <span class="hfa-model">Model data</span></figcaption><div class="fs-arleg" aria-hidden="true"><span><i class="a"></i>Ate it</span><span><i class="n"></i>Didn’t eat it</span></div><div class="fs-arbars" role="img" aria-label="' + esc("Paired bar graph, model data. " + desc + ".") + '">' +
      PL.foods.map(function(fd){ var a = rate(fd.ate), b = rate(fd.not), gap = a - b;
        return '<div class="fs-arrow" aria-hidden="true"><span class="fs-arl">' + fd.t + '<small>gap ' + (gap > 0 ? "+" : gap < 0 ? MV.MINUS : "") + MV.num(Math.abs(gap), 1) + ' points</small></span><span class="fs-arbw"><span class="fs-arb a" style="width:' + f1(a) + '%"><b>' + pct(a) + '</b></span><span class="fs-arb n" style="width:' + f1(b) + '%"><b>' + pct(b) + "</b></span></span></div>"; }).join("") + "</div></figure>";
    var y = S.ar, ans = MV.ans(PL), order = MV.shuffle(PL.foods.map(function(fd){ return fd.id; }), "fs-arpick");
    var h = '<div class="q fs-arq"><p class="q-prompt"><strong>' + PL.ask + '</strong></p><div class="fs-chipset" role="radiogroup" aria-label="' + esc(PL.ask) + '">' + order.map(function(id){
      var fd = byId(PL.foods, id), on = y.pick === id; return '<button type="button" role="radio" aria-checked="' + on + '" data-arp="' + id + '" data-k="arp' + id + '"' + (y.pick === ans ? " disabled" : "") + ">" + fd.t + "</button>"; }).join("") + "</div>";
    if (y.pick) h += y.pick === ans ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + PL.pickFb[y.pick]) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + PL.pickFb[y.pick] + " Try another food.");
    MV.keepFocus($("#fs-arpick", s1), function(){ $("#fs-arpick", s1).innerHTML = h + "</div>"; });
  }
  s1.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.ar; if (!k) return; S.ar.vals[k] = e.target.value; S.ar.msg = ""; api.save(); });
  s1.addEventListener("keydown", function(e){
    if (e.target.dataset && e.target.dataset.ar && e.key === "Enter") { e.preventDefault(); $("#fs-archk", s1).click(); return; }
    var c = e.target.closest && e.target.closest("[data-arp]"), d = arrowKeys(e); if (!c || !d) return;
    e.preventDefault(); var sib = $$("[data-arp]", c.parentNode), k = sib.indexOf(c), nb = sib[(k + d + sib.length) % sib.length]; if (nb && !nb.disabled) { nb.focus(); nb.click(); }
  });
  s1.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.id === "fs-archk") {
      var x = S.ar, C = cells(), empty = C.some(function(c){ return numIn(x.vals[c.k]) == null; });
      if (empty) { x.msg = PL.msgs.empty; x.skip = true; }
      else {
        var off = 0, cnt = false; x.marks = {};
        C.forEach(function(c){ var v = numIn(x.vals[c.k]), ok = Math.abs(v - rate(c.pair)) <= 0.5 + 1e-9; x.marks[c.k] = ok ? "ok" : "no"; if (!ok) { off++; if (v === c.pair[0]) cnt = true; } });
        x.skip = false;
        if (!off) { x.solved = true; x.msg = ""; }
        else { x.tries = (x.tries || 0) + 1; x.msg = "<strong>✗ Not quite.</strong> " + fill(PL.msgs.off, { n:off }) + (cnt ? " " + PL.msgs.count : ""); }
      }
      api.save(); tabPaint(); fbPaint(); chartPaint(); stRepaint(); MV.focusFb($("#fs-arfb", s1)); return;
    }
    if (b.dataset.arp) { S.ar.pick = b.dataset.arp; api.save(); chartPaint(); stRepaint(); MV.focusFb($("#fs-arpick", s1)); }
  });

  // ===== Station 2: symptoms and timing =====
  var s2 = $("#fs-st-bugs", host), BR = BG.rows;
  s2.innerHTML = '<h4 class="fs-h4">' + BG.title + '</h4><div class="fs-notes"><h5 class="fs-h5">' + BG.notesTitle + "</h5><ul>" + BG.notes.map(function(n){ return "<li>" + n + "</li>"; }).join("") + '</ul></div><p><strong>' + BG.ask + '</strong></p><div class="fs-bugs" id="fs-bugs"></div><div id="fs-bugfb"></div>';
  var bugOrder = BG.cards.map(function(c){ return c.id; });   // content order (the match isn't first)
  function bugPaint(){
    var ans = MV.ans(BG), solved = S.bug === ans;
    MV.keepFocus($("#fs-bugs", s2), function(){
      $("#fs-bugs", s2).innerHTML = bugOrder.map(function(id){
        var c = byId(BG.cards, id), on = S.bug === id;
        return '<article class="fs-bug' + (on ? (solved ? " right" : " wrong") : "") + '"><h5 class="fs-h5">' + c.t + '</h5><dl><div><dt>' + BR.src + "</dt><dd>" + c.src + "</dd></div><div><dt>" + BR.onset + "</dt><dd>" + c.onset + "</dd></div><div><dt>" + BR.sym + "</dt><dd>" + c.sym + "</dd></div></dl>" +
          '<button type="button" class="btn ' + (on ? "primary" : "ghost") + ' sm" aria-pressed="' + on + '" data-bug="' + id + '" data-k="bug' + id + '"' + (solved ? " disabled" : "") + ">" + (on ? (solved ? "✓ It fits" : "✗ Doesn’t fit") : "This one fits") + "</button></article>";
      }).join("");
    });
    var c = byId(BG.cards, S.bug);
    $("#fs-bugfb", s2).innerHTML = !c ? "" : solved ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + c.fb + " " + BG.after) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + c.fb + " Try another card.");
  }
  s2.addEventListener("click", function(e){ var b = e.target.closest("[data-bug]"); if (!b || b.disabled) return; S.bug = b.dataset.bug; api.save(); bugPaint(); stRepaint(); MV.focusFb($("#fs-bugfb", s2)); });

  // ===== Station 3: Check it with data, the real system =====
  var s3 = $("#fs-st-system", host);
  s3.innerHTML = '<h4 class="fs-h4">' + SY.title + '</h4><details class="alg fs-sys" open><summary>Check it with data: the real system</summary>' + SY.items.map(function(it){ return '<h5 class="fs-h5">' + it.h + "</h5><p>" + it.html + "</p>"; }).join("") + '<p class="tiny muted">' + SY.link + "</p></details>";

  function paintAll(){ stRG.set(S.st); stRepaint(); D.stations.forEach(function(s){ $("#fs-st-" + s.id, host).hidden = s.id !== S.st; }); }
  tabPaint(); fbPaint(); chartPaint(); bugPaint(); paintAll();
}

// ---------- Practice 2: Food-safety decisions (@component decisionSet — custom ★ set: N4 number entry, chip groups, N5
// ordering with Move up / Move down; first try = right on the first check without the worked solution) ----------
function decisions(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {}, sel = {};
  function ist(it){ var x = S.items[it.id]; if (!x) x = S.items[it.id] = { val:"", picks:{}, order:null, tries:0, hint:0, solved:false, first:null }; if (it.kind === "order" && !Array.isArray(x.order)) x.order = (it.start || it.steps.map(function(_, i){ return i; })).slice(); return x; }
  function gOrder(it, g){
    var same = it.groups.every(function(q){ return q.choices.map(function(c){ return c.t; }).join("|") === it.groups[0].choices.map(function(c){ return c.t; }).join("|"); });
    return MV.shuffle(g.choices.map(function(_, i){ return i; }), "fs-" + it.id + (same ? "" : g.id));
  }
  function qHTML(it, i){
    var x = ist(it), dis = x.solved ? " disabled" : "";
    var h = '<div class="q" data-ti="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">D' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★' + (it.inquiry ? " Inquiry" : "") + "</span>" : "") + "</div>";
    if (it.kind === "num") h += '<div class="numrow"><label for="fsd-' + it.id + '">' + it.label + ':</label><input class="numin short" id="fsd-' + it.id + '" data-tn="' + it.id + '" data-k="' + it.id + 'in" type="text" inputmode="decimal" autocomplete="off" value="' + esc(x.val || "") + '"' + dis + ">" + (it.unit ? "<span>" + it.unit + "</span>" : "") + "</div>";
    if (it.kind === "chips") it.groups.forEach(function(g){
      h += '<div class="fs-dg"><span class="fs-rgl">' + g.label + '</span><div class="fs-chipset" role="radiogroup" aria-label="' + esc(MV.plain(g.label)) + '">' + gOrder(it, g).map(function(ci){
        var on = x.picks[g.id] === ci; return '<button type="button" role="radio" aria-checked="' + on + '" data-g="' + g.id + '" data-ci="' + ci + '" data-k="' + it.id + g.id + ci + '"' + dis + ">" + g.choices[ci].t + "</button>";
      }).join("") + "</div></div>";
    });
    if (it.kind === "order") {
      h += '<ol class="olist">' + x.order.map(function(si, pos){
        var isSel = sel[it.id] === pos && !x.solved;
        return '<li><button type="button" class="ostep' + (x.solved ? " good" : "") + '" aria-pressed="' + isSel + '" data-pos="' + pos + '" data-k="' + it.id + "p" + si + '"' + dis + '><span class="sn">' + (pos + 1) + ".</span><span>" + it.steps[si] + "</span></button>" +
          (isSel ? '<span class="omoves"><button type="button" class="btn ghost" data-mv="up" data-k="' + it.id + 'up"' + (pos === 0 ? " disabled" : "") + '>Move up</button><button type="button" class="btn ghost" data-mv="down" data-k="' + it.id + 'down"' + (pos === x.order.length - 1 ? " disabled" : "") + ">Move down</button></span>" : "") + "</li>";
      }).join("") + "</ol>";
    }
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + it.why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].skip ? "" : "bad", msgs[it.id].h);
    return h + "</div>";
  }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(qHTML).join("");
  function repaint(it){
    var box = host.querySelector('[data-ti="' + it.id + '"]'), act = document.activeElement, k = act && box.contains(act) && act.dataset ? act.dataset.k : null;
    var div = document.createElement("div"); div.innerHTML = qHTML(it, a.items.indexOf(it)); var nb = div.firstChild; box.parentNode.replaceChild(nb, box);
    if (k) { var f = nb.querySelector('[data-k="' + k + '"]'); if (f && !f.disabled) f.focus({ preventScroll:true }); }
    return nb;
  }
  function judge(it, x){
    var NQ = "<strong>✗ Not quite.</strong> ";
    if (it.kind === "num") {
      var v = numIn(x.val); if (v == null) return { skip:true, msg:"Enter a number in the box, such as 12." };
      if (Math.abs(v - MV.ans(it)) < 1e-9) return { ok:true };
      var w = (it.wrong || []).filter(function(q){ return Math.abs(v - q.match) < 1e-9; })[0];
      return { msg:NQ + (w ? w.fb : it.wrongDefault) + " Try again." };
    }
    if (it.kind === "chips") {
      if (!it.groups.every(function(g){ return x.picks[g.id] != null; })) return { skip:true, msg:it.groups.length > 1 ? "Choose one in each row." : "Choose an answer." };
      if (it.groups.every(function(g){ return MV.ok(g.choices[x.picks[g.id]]); })) return { ok:true };
      return { msg:NQ + it.fb + " Try again." };
    }
    if (x.order.every(function(v, i){ return v === i; })) return { ok:true };
    return { msg:"<strong>✗ Not yet.</strong> " + it.fb };
  }
  host.addEventListener("input", function(e){ var d = e.target.dataset; if (!d || !d.tn) return; ist(byId(a.items, d.tn)).val = e.target.value; msgs[d.tn] = null; api.save(); });
  host.addEventListener("keydown", function(e){
    if (e.key === "Enter" && e.target.dataset && e.target.dataset.tn) { e.preventDefault(); var b = host.querySelector('[data-k="' + e.target.dataset.tn + 'chk"]'); if (b) b.click(); return; }
    var c = e.target.closest && e.target.closest("[data-ci]"), d = arrowKeys(e); if (!c || !d) return;
    e.preventDefault(); var sib = $$("button", c.parentNode), k = sib.indexOf(c), nb = sib[(k + d + sib.length) % sib.length]; if (nb && !nb.disabled) { nb.focus(); nb.click(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ti]"); if (!box) return;
    var it = byId(a.items, box.dataset.ti), x = ist(it);
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (b.dataset.g) { x.picks[b.dataset.g] = +b.dataset.ci; msgs[it.id] = null; }
    else if (b.dataset.pos != null) { var p = +b.dataset.pos; sel[it.id] = sel[it.id] === p ? null : p; repaint(it); return; }
    else if (b.dataset.mv) {
      var i = sel[it.id], j = b.dataset.mv === "up" ? i - 1 : i + 1; if (i == null || j < 0 || j >= x.order.length) return;
      var t = x.order[i]; x.order[i] = x.order[j]; x.order[j] = t; sel[it.id] = j; msgs[it.id] = null; api.save();
      var nb = repaint(it), f = nb.querySelector('[data-mv="' + b.dataset.mv + '"]'); if (f && !f.disabled) f.focus(); else { var sb = nb.querySelector('[data-pos="' + j + '"]'); if (sb) sb.focus(); }
      return;
    }
    else if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; sel[it.id] = null; }
      else { if (!r.skip) x.tries++; msgs[it.id] = { h:r.msg, skip:!!r.skip }; }
      api.save(); MV.focusFb(repaint(it)); return;
    }
    api.save(); repaint(it);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Safe potluck plan (@component stagePlanner — five choice rows, a thaw → cook → carry → store
// stage strip with temperature-band words, the allergen card and an optional kitchen card) ----------
var task = (function(){
  var api = null, rg = {};
  function TK(){ return MV.C.task; }
  function row(id){ return byId(TK().rows, id); }
  function opt(rid, id){ return byId(row(rid).opts, id); }
  var IDS = ["thaw", "temp", "move", "left", "card"];
  function read(){ var s = (api && api.S) || {}, d = {}; IDS.forEach(function(k){ d[k] = opt(k, s[k]) ? s[k] : ""; }); return d; }
  function checks(d){ return [!!d.thaw && d.thaw !== "counter", !!d.temp && +d.temp >= 74, !!d.move && d.move !== "room", d.left === "shallow", d.card === "mw"]; }
  function keyOf(d){ return IDS.map(function(k){ return d[k]; }).join("|"); }
  function fromKey(k){ var q = k.split("|"), d = {}; IDS.forEach(function(id, i){ d[id] = q[i]; }); return d; }
  function names(d){ return IDS.map(function(k){ var o = d[k] && opt(k, d[k]); return o ? o.short : "?"; }).join(" · "); }
  // stage strip: what temperature band each choice keeps the casserole in (words, not ticks; the checklist does the judging)
  var BANDS = { thaw:{ fridge:["cold", "stays cold in the fridge"], water:["cold", "stays cold: water changed every 30 min"], counter:["dz", "the outside warms to room temperature"], micro:["hot", "thawed, then cooked right away"] },
    move:{ hot:["hot", "kept at 60 °C or hotter"], room:["dz", "not kept hot or cold"], cool:["cold", "kept at 4 °C or colder, then reheated to 74 °C"] },
    left:{ shallow:["cold", "into the fridge within 2 h"], deep:["slow", "a deep pot cools slowly"], out:["dz", "at room temperature overnight"] } };
  var BW = { cold:"cold", hot:"hot", dz:"danger zone", slow:"slow cooling" };
  function stage(label, k, d, info){
    var o = d[k] && opt(k, d[k]), b = o && info ? info[d[k]] : null;
    return '<li class="fs-tks' + (b ? " fs-tk-" + b[0] : "") + '"><span class="fs-tkn">' + label + '</span><span class="fs-tkc">' + (o ? o.t : '<span class="muted">not chosen</span>') + "</span>" + (b ? '<span class="fs-tkb">' + BW[b[0]] + "</span><small>" + b[1] + "</small>" : "") + "</li>";
  }
  function kcLines(){
    var d = read(), K = TK().kitchen, all = checks(d).every(Boolean), L = K.top.slice();
    TK().rows.forEach(function(r){ var o = d[r.id] && opt(r.id, d[r.id]); L.push("- " + r.t + ": " + (o ? MV.plain(o.t) : "(not chosen yet)")); });
    if (!all) L.push("- Note: this plan doesn’t meet every food-safety condition yet.");
    return L.concat(K.bottom);
  }
  function paint(){
    var d = read(), pv = $("#fs-tkpv"); if (!pv) return;
    IDS.forEach(function(k){ rg[k].set(d[k]); });
    var cook = d.temp ? opt("temp", d.temp) : null, card = d.card ? opt("card", d.card) : null;
    var h = '<ol class="fs-tkstrip" aria-label="Your plan, stage by stage">' + stage(row("thaw").stage, "thaw", d, BANDS.thaw) +
      '<li class="fs-tks' + (cook ? " fs-tk-hot" : "") + '"><span class="fs-tkn">' + row("temp").stage + '</span><span class="fs-tkc">' + (cook ? "Cooked to " + cook.t + ", checked with a thermometer" : '<span class="muted">not chosen</span>') + "</span>" + (cook ? '<span class="fs-tkb">hot</span>' : "") + "</li>" +
      stage(row("move").stage, "move", d, BANDS.move) + stage(row("left").stage, "left", d, BANDS.left) + "</ol>";
    h += '<div class="fs-tent" role="img" aria-label="' + esc("Allergen card: " + TK().dish + ". " + (card ? MV.plain(card.t) : "No card chosen yet.")) + '"><span class="fs-tentd">' + TK().dish + '</span><span class="fs-tentc">' + (card ? card.t : "(choose an allergen card)") + "</span></div>";
    pv.innerHTML = h;
  }
  return {
    render:function(inp, pv, a){
      api = a; var s = a.S, K = TK().kitchen;
      inp.innerHTML = '<div class="fs-tin">' + IDS.map(function(k){ return '<div id="tk-' + k + '"></div>'; }).join("") + "</div>";
      IDS.forEach(function(k){
        var r = row(k);
        rg[k] = radios($("#tk-" + k), { label:r.t, cls:"chips", options:r.opts.map(function(o){ return { id:o.id, t:o.t }; }), value:s[k] || "", onChange:function(v){ s[k] = v; a.save(); paint(); a.update(); } });
      });
      pv.innerHTML = '<div class="fs-tpv"><h4 class="fs-h4">Your plan</h4><div id="fs-tkpv" aria-live="polite"></div><div class="fs-kcw"><h4 class="fs-h4">Kitchen card (optional)</h4><p class="tiny muted">Printing is turned off on this site, so the card saves as a text file.</p><div id="fs-kc"></div></div></div>';
      MV.kitchenCardButton($("#fs-kc"), { title:K.title, file:K.file, lines:kcLines, label:K.label });
      paint();
    },
    read:read,
    valid:function(d){ return IDS.every(function(k){ return d[k]; }) ? true : "Choose an option in every row."; },
    checks:checks,
    key:keyOf,
    label:function(k){ return esc(names(fromKey(k))); },
    text:function(k){ return names(fromKey(k)); },
    summary:function(ts){ var f = ts.found || []; return [TK().summary + ": " + (f.length ? "solved (" + f.map(function(k){ return names(fromKey(k)); }).join("; ") + ")" : "not solved yet")]; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ decisions:decisions },
  task:task
});
})();
