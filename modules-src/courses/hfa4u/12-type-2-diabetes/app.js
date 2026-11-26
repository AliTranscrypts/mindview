// HFA4U 12 Type 2 Diabetes: hero (plate → typical and insulin-resistant cell panels with mini glucose curves), Blood glucose
// model (Explore: glucose curves for three fictional personas with meal chips, tweak and walk switches and two pins; Inside
// the cell N13 step-through with a type 1 contrast panel; F7 risk map), Prevention at community level (Part 3: trial bars with
// "Check it with data", program cards with feature tags, a four-criteria strategy matrix), practice (type sorter with a
// Neither box for the myth card; glycemic load and trial data ★ set) and "Raj's plate" (task: plate method with a live panel).
// Plan wording lives in content.mjs; this file adds only control labels and layout text.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc, css = MV.css;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function f1(v){ return String(Math.round(v * 10) / 10); }
function d1(v){ return (Math.round(v * 10) / 10).toFixed(1); }
function seg01(t, a, b){ return clamp((t - a) / (b - a), 0, 1); }
function byId(list, id){ for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i]; return null; }
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : ""; }); }
function lc(s){ return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
function listAnd(a){ return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
function svgT(x, y, s, cls, anchor, extra){ return '<text class="' + cls + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "middle") + '"' + (extra || "") + ">" + s + "</text>"; }
function numIn(raw){ var r = MV.parseNum(String(raw == null ? "" : raw).replace(/%|mmol\/L|per\s*100/gi, "")); return r && r.length === 1 && isFinite(r[0]) ? r[0] : null; }

// ---------- @component radioGroup (copied from HFA4U 09; per-option class, custom layout class, function labels) ----------
//   radios(host, {label, aria, options:[{id, t, cls}], value, cls:"seg"|"chips"|<custom → class dm-<custom>>, onChange}) -> {set, get, repaint}
//   Use a fresh host for every call: it adds its listeners to host.
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), kind = o.cls === "chips" ? "dm-chipset" : o.cls && o.cls !== "seg" ? "dm-" + o.cls : "seg";
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), lab = typeof o.label === "function" ? o.label() : o.label;
    host.innerHTML = '<span class="dm-rgw">' + (lab ? '<span class="dm-rgl">' + lab + "</span>" : "") + '<span class="dm-rg ' + kind + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || lab || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && i === 0) ? 0 : -1) + '" data-rg="' + x.id + '"' + (x.cls ? ' class="' + x.cls + '"' : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]"); if (b) b.focus({ preventScroll:true }); }
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

// ---------- @component switchBtn (copied from HFA4U 09) — an on/off switch (role="switch" button with a visible On/Off word) ----------
function switchHTML(key, label, on, data){
  return '<button type="button" role="switch" class="dm-sw" aria-checked="' + !!on + '" data-k="' + key + '" ' + data + '><span class="dm-swt" aria-hidden="true"><i></i></span><span class="dm-swl">' + label + '</span><span class="dm-swv" aria-hidden="true">' + (on ? "On" : "Off") + "</span></button>";
}

// ---------- glucose model (plan's exact rules; content.explore) ----------
function EX(){ return MV.C.explore; }
function per(id){ return byId(EX().personas, id) || EX().personas[0]; }
function meal(id){ return byId(EX().meals, id) || EX().meals[0]; }
// tweak: −1 to the base, never below 1; walk: −1 after the tweak, never below 0
function adjBase(base, tw, wk){ var b = base; if (tw) b = Math.max(1, b - 1); if (wk) b = Math.max(0, b - 1); return b; }
function peakOf(c){ var p = per(c.p); return p.fast + adjBase(meal(c.m).base, !!c.tw, !!c.wk) * p.factor; }
function sameC(a, b){ return a && b && a.p === b.p && a.m === b.m && !!a.tw === !!b.tw && !!a.wk === !!b.wk; }
function chgT(c){ return c.tw && c.wk ? "tweak + walk" : c.tw ? "tweak only" : c.wk ? "walk only" : "plain"; }
function firstName(p){ return per(p).t.split(",")[0]; }
function cDesc(c){ return firstName(c.p) + ", " + meal(c.m).short + ", " + chgT(c); }
function normC(c){ c = c || {}; return { p:byId(EX().personas, c.p) ? c.p : "t2", m:byId(EX().meals, c.m) ? c.m : "med", tw:!!c.tw, wk:!!c.wk }; }
// drawing only (plan build notes): smooth rise to the peak at 45 minutes, then a linear return over the persona's return time
function gAt(t, f, P, B){ if (t <= 0) return f; if (t <= 0.75) return f + (P - f) * (1 - Math.cos(Math.PI * t / 0.75)) / 2; if (t < B) return f + (P - f) * (B - t) / (B - 0.75); return f; }
function curvePts(f, P, B, upto){ var out = [], x, end = upto == null ? 5.3 : upto; for (x = -0.6; x < end; x += 0.025) out.push([x, gAt(x, f, P, B)]); out.push([end, gAt(end, f, P, B)]); return out; }

// ---------- hero (storyboard: the plate is eaten; panel 1 typical: glucose dots enter the blood, the mini curve rises, insulin
// keys reach the locks, gates open, glucose moves in, the curve returns; panel 2 insulin resistance: stiff locks, more keys,
// one gate opens, a higher and longer curve). Reduced motion: both final frames side by side. ----------
var HD = [[18, 50], [30, 74], [20, 98], [32, 122], [19, 146], [31, 170], [22, 190], [30, 34]];      // dots in the blood band
var HC = [[96, 58], [124, 74], [104, 100], [132, 122], [100, 146], [128, 168], [110, 190], [126, 42]];  // dots inside the cell
var HG = [87, 152];                                                                                 // gate y on the membrane
var HL = [55, 120, 185];                                                                            // lock y on the membrane
function heroPanel(x0, y0, st, res){
  var h = '<g transform="translate(' + x0 + " " + y0 + ')"' + (st.on ? "" : ' opacity="0.4"') + ">";
  h += svgT(4, 14, res ? "Insulin resistance" : "Typical response", "dm-hl", "start");
  h += '<rect class="dm-hblood" x="6" y="26" width="40" height="182" rx="10"/>' + svgT(26, 224, "blood", "dm-hs");
  h += '<rect class="dm-hcell" x="70" y="26" width="84" height="182" rx="18"/>' + svgT(112, 224, "cell", "dm-hs");
  // gates (glucose transporters): open = a gap in the membrane
  HG.forEach(function(gy, i){
    var open = res ? (i === 0 ? st.g : 0) : st.g;
    h += '<rect class="dm-hgate" x="64" y="' + (gy - 11) + '" width="12" height="22" rx="3"/>' + '<line class="dm-hbar" x1="70" y1="' + f1(gy - 9 + 18 * open) + '" x2="70" y2="' + (gy + 9) + '"/>';
  });
  // locks (receptors), stiff in resistance
  HL.forEach(function(ly){ h += '<path class="dm-hlock' + (res ? " stiff" : "") + '" d="M70 ' + (ly - 9) + 'h-9a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h9"/><circle class="dm-hhole" cx="65" cy="' + ly + '" r="2.2"/>'; });
  // keys travel from the blood to the locks (3 typical; 6 crowd in for the resistant cell)
  var nk = res ? 6 : 3;
  for (var k = 0; k < nk; k++) {
    var ly2 = HL[k % 3], tx = k < 3 ? 47 : 40 - (k - 3) * 2, ty = k < 3 ? ly2 : ly2 + (k % 2 ? 13 : -13), sx = 26, sy = 30 + k * 30;
    var kt = clamp(st.k * 1.3 - k * 0.07, 0, 1), kx = lerp(sx, tx, kt), ky = lerp(sy, ty, kt), turn = res ? 0 : st.g * 90;
    if (st.k > 0) h += '<g class="dm-hkey" transform="translate(' + f1(kx) + " " + f1(ky) + ") rotate(" + f1(turn) + ')"><circle r="4.4"/><path d="M4 0h10M10 0v3.5M13 0v3"/></g>';
  }
  // glucose dots: appear in the blood, then move through open gates into the cell
  var nIn = res ? 2 : 7;
  HD.forEach(function(p, i){
    if (st.d0 <= 0) return;
    var mv = i < nIn ? clamp(st.d * 1.2 - i * 0.04, 0, 1) : 0, gy = res ? HG[0] : HG[i % 2], x, y;
    if (mv < 0.5) { x = lerp(p[0], 70, mv * 2); y = lerp(p[1], gy, mv * 2); } else { x = lerp(70, HC[i][0], mv * 2 - 1); y = lerp(gy, HC[i][1], mv * 2 - 1); }
    h += '<circle class="dm-hglu" cx="' + f1(x) + '" cy="' + f1(y) + '" r="4.6" opacity="' + f1(st.d0) + '"/>';
  });
  // mini graph: blood glucose against time
  var gx = 172, gy0 = 112, gw = 104, gh = 80;
  h += '<line class="dm-hax" x1="' + gx + '" y1="' + (gy0 - gh) + '" x2="' + gx + '" y2="' + gy0 + '"/><line class="dm-hax" x1="' + gx + '" y1="' + gy0 + '" x2="' + (gx + gw) + '" y2="' + gy0 + '"/>';
  h += '<line class="dm-hbase" x1="' + gx + '" y1="' + (gy0 - 22) + '" x2="' + (gx + gw) + '" y2="' + (gy0 - 22) + '"/>';
  h += svgT(gx + 4, gy0 - gh - 2, "glucose", "dm-hs", "start") + svgT(gx + gw, gy0 + 18, "time", "dm-hs", "end");
  if (st.c > 0) {
    var P = res ? 56 : 34, back = res ? 1.0 : 0.62, pts = [], n = 40, end = st.c;
    for (var i = 0; i <= n; i++) {
      var u = i / n * end, yv;
      if (u <= 0.2) yv = P * (1 - Math.cos(Math.PI * u / 0.2)) / 2; else if (u < back) yv = P * (back - u) / (back - 0.2); else yv = 0;
      pts.push(f1(gx + u * gw) + "," + f1(gy0 - 22 - yv));
    }
    h += '<polyline class="dm-hcurve' + (res ? " res" : "") + '" points="' + pts.join(" ") + '"/>';
  }
  // caption lines
  // key: the meaning of each mark (right column), then the panel's caption
  h += '<g transform="translate(172 140)"><g class="dm-hkey" transform="translate(6 0)"><circle r="4.4"/><path d="M4 0h10M10 0v3.5M13 0v3"/></g>' + svgT(28, 5, "insulin", "dm-hs", "start") +
    '<circle class="dm-hglu" cx="8" cy="24" r="4.6"/>' + svgT(28, 29, "glucose", "dm-hs", "start") + '<rect class="dm-hgate" x="2" y="40" width="12" height="20" rx="3"/>' + svgT(28, 55, "gate", "dm-hs", "start") +
    '<path class="dm-hlock' + (res ? " stiff" : "") + '" d="M14 70h-9a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h9"/>' + svgT(28, 84, res ? "stiff lock" : "lock", "dm-hs", "start") + "</g>";
  if (st.cap) h += res ? svgT(4, 252, "More keys, fewer gates open,", "dm-hc", "start") + svgT(4, 270, "glucose stays high for longer.", "dm-hc", "start")
    : svgT(4, 252, "Keys turn, gates open, glucose moves", "dm-hc", "start") + svgT(4, 270, "in, and the curve comes back down.", "dm-hc", "start");
  return h + "</g>";
}
// narrow (phone) layout: the two panels stack, so the text stays readable
function heroSVG(st, narrow){
  var h = "", e = st.e, cx = 52, cy = 46, r = 34 * (1 - 0.75 * e);
  // the plate: half vegetables, a quarter roti, a quarter dal
  h += '<circle class="dm-hrim" cx="' + cx + '" cy="' + cy + '" r="38"/>';
  if (r > 1) {
    h += '<path class="dm-hveg" d="M' + cx + " " + f1(cy - r) + "A" + f1(r) + " " + f1(r) + " 0 0 0 " + cx + " " + f1(cy + r) + 'Z"/>' +
      '<path class="dm-hroti" d="M' + cx + " " + cy + "V" + f1(cy - r) + "A" + f1(r) + " " + f1(r) + " 0 0 1 " + f1(cx + r) + " " + cy + 'Z"/>' +
      '<path class="dm-hdal" d="M' + cx + " " + cy + "H" + f1(cx + r) + "A" + f1(r) + " " + f1(r) + " 0 0 1 " + cx + " " + f1(cy + r) + 'Z"/>';
  }
  h += '<g opacity="' + f1(1 - e * 0.6) + '">' + svgT(100, 28, "½ vegetables", "dm-hs", "start") + svgT(100, 48, "¼ roti", "dm-hs", "start") + svgT(100, 68, "¼ dal", "dm-hs", "start") + "</g>";
  if (narrow) return h + svgT(8, 108, "Glucose enters the blood; insulin", "dm-hs", "start") + svgT(8, 126, "signals cells to take it up.", "dm-hs", "start") + heroPanel(6, 142, st.a, false) + heroPanel(6, 428, st.b, true);
  h += '<path class="dm-harr" d="M200 46H246"/><path class="dm-harrh" d="M240 40l8 6-8 6"/>' + svgT(258, 40, "glucose enters the blood;", "dm-hs", "start") + svgT(258, 60, "insulin signals cells to take it up", "dm-hs", "start");
  h += heroPanel(6, 92, st.a, false) + heroPanel(304, 92, st.b, true);
  return h;
}
function hero(f){
  var host = $("#dm-hero"); if (!host) return;
  var Hc = MV.C.hero;
  function panel(){ return { on:false, k:0, g:0, d0:0, d:0, c:0, cap:false }; }
  var st = { e:0, a:panel(), b:panel() };
  st.a.on = true;
  host.innerHTML = '<svg class="dm-hsvg" viewBox="0 0 600 372" role="img" aria-label="' + esc(Hc.aria) + '"></svg>';
  var svg = host.firstChild;
  function draw(){ var nw = (host.getBoundingClientRect().width || 600) < 480; svg.setAttribute("viewBox", nw ? "0 0 300 710" : "0 0 600 372"); svg.innerHTML = heroSVG(st, nw); }
  window.addEventListener("resize", draw);
  function cap(){ if (f.cap) { f.cap.textContent = Hc.caption; f.cap.classList.add("dm-cap"); } }
  function end(p){ p.on = true; p.k = 1; p.g = 1; p.d0 = 1; p.d = 1; p.c = 1; p.cap = true; }
  if (MV.reduceMotion) { st.e = 1; end(st.a); end(st.b); draw(); cap(); return; }
  draw();
  function run(p, done){
    MV.tween({ dur:1300, step:function(t){ p.d0 = t; p.c = 0.22 * t; draw(); }, done:function(){
      MV.tween({ dur:2200, ease:function(t){ return t; }, step:function(t){ p.k = clamp(t * 1.6, 0, 1); p.g = seg01(t, 0.45, 0.7); p.d = seg01(t, 0.55, 1); p.c = 0.22 + 0.78 * t; draw(); },
        done:function(){ p.cap = true; draw(); MV.wait(500, done); } });
    } });
  }
  MV.wait(400, function(){
    MV.tween({ dur:1000, step:function(t){ st.e = t; draw(); }, done:function(){
      run(st.a, function(){ st.b.on = true; draw(); MV.wait(300, function(){ run(st.b, cap); }); });
    } });
  });
}

// ---------- Explore: Blood glucose model (module-specific glucose curves on the plot engine + pins; @component N13 cellSteps;
// @component F7 riskMap) ----------
var KEYSVG = '<g class="dm-key"><circle r="6"/><path d="M6 0h16M17 0v5M21 0v4"/></g>';
function cellSVG(t, narrow){
  var W = narrow ? 390 : 560, kb = clamp(t, 0, 1), sg = seg01(t, 1, 2), mv = seg01(t, 1, 2), gi = seg01(t, 2, 3), r = seg01(t, 3, 4), h = "";
  h += svgT(12, 20, "Blood (outside the cell)", "dm-cl", "start") + svgT(12, 262, "Inside the cell", "dm-cl", "start");
  h += '<rect class="dm-cmem" x="0" y="116" width="' + W + '" height="18"/>' + svgT(W - 12, 154, "cell membrane", "dm-cs", "end");
  // receptor (lock), stiff in resistance
  h += '<path class="dm-clock' + (r > 0.5 ? " stiff" : "") + '" d="M64 116V96a6 6 0 0 1 6-6h6v14h8V90h6a6 6 0 0 1 6 6v20"/>' + '<rect class="dm-clockb" x="62" y="116" width="36" height="34" rx="4"/>' + svgT(6, 174, r > 0.5 ? "receptor (stiff)" : "receptor", "dm-cs", "start");
  // insulin key binds
  h += '<g transform="translate(80 ' + f1(lerp(36, 80, kb)) + ') rotate(90)">' + KEYSVG + "</g>" + svgT(100, lerp(36, 72, kb), "insulin", "dm-cs", "start");
  // resistance: more insulin crowds in
  if (r > 0) [[34, 52], [128, 46], [166, 54]].forEach(function(p){ h += '<g opacity="' + f1(r) + '" transform="translate(' + p[0] + " " + p[1] + ') rotate(60)">' + KEYSVG + "</g>"; });
  if (r > 0) h += '<g opacity="' + f1(r) + '">' + svgT(118, 106, "more insulin needed", "dm-cs", "start") + "</g>";
  // signal inside the cell
  if (sg > 0) {
    var w = lerp(3.2, 1.4, r);
    h += '<path class="dm-csig" style="stroke-width:' + f1(w) + '" opacity="' + f1(sg) + '" d="M100 140C130 196 170 222 216 210"/><path class="dm-csigh" opacity="' + f1(sg) + '" d="M210 203l9 7-10 5"/>' + '<g opacity="' + f1(sg) + '">' + svgT(130, 240, r > 0.5 ? "weaker signal" : "signal", "dm-cs") + "</g>";
  }
  // glucose transporters move from inside the cell to the membrane (only one in resistance)
  var TX = narrow ? [270, 340] : [260, 340, 420, 500];
  TX.forEach(function(x, i){
    var m = i === 0 ? mv : mv * (1 - r), y = lerp(206, 113, m);
    // glucose dots: wait outside, pass through transporters at the membrane
    for (var j = 0; j < 3; j++) {
      var gx = x - 12 + j * 12, oy = 50 + (j % 2) * 26 + i * 4, iy = 176 + (j % 2) * 30, g = (i === 0 ? gi : gi * (1 - r));
      var px = g < 0.5 ? lerp(gx, x, g * 2) : lerp(x, gx, g * 2 - 1);
      h += '<circle class="dm-cglu" cx="' + f1(px) + '" cy="' + f1(lerp(oy, iy, g)) + '" r="5.5"/>';
    }
    h += '<rect class="dm-ctr" x="' + (x - 10) + '" y="' + f1(y - 14) + '" width="20" height="28" rx="5"/><line class="dm-ctrl" x1="' + x + '" y1="' + f1(y - 10) + '" x2="' + x + '" y2="' + f1(y + 10) + '"/>';
  });
  h += svgT((TX[0] + TX[TX.length - 1]) / 2, 258, "glucose transporters", "dm-cs") + svgT(W - 12, 34, "glucose", "dm-cs", "end");
  return h;
}
function riskHTML(R, S){
  var h = '<p class="dm-rintro">' + R.intro + '</p><p class="tiny dm-rkey">Key: <span class="dm-rk fixed">can’t be changed</span> <span class="dm-rk mod">can change</span></p>';
  R.groups.forEach(function(g){
    h += '<h5 class="dm-h5">' + g.t + '</h5><div class="dm-rgrid" role="group" aria-label="' + esc(g.t) + '">' + R.factors.filter(function(x){ return x.g === g.id; }).map(function(x){
      var on = S.risk.open === x.id, seen = !!S.risk.seen[x.id];
      return '<button type="button" class="dm-rcard ' + (x.k === "fixed" ? "fixed" : "mod") + '" data-rf="' + x.id + '" data-k="rf' + x.id + '" aria-pressed="' + on + '"><strong>' + x.t + '</strong><span class="dm-rtag">' + R.tags[x.k] + "</span>" + (seen ? '<span class="dm-rseen">✓<span class="vh"> read</span></span>' : "") + "</button>";
    }).join("") + "</div>";
  });
  h += '<button type="button" class="dm-rwhy" data-rf="why" data-k="rfwhy" aria-pressed="' + (S.risk.open === "why") + '"><strong>' + R.why.t + "</strong>" + (S.risk.seen.why ? ' <span class="dm-rseen">✓<span class="vh"> read</span></span>' : "") + "</button>";
  var n = R.factors.filter(function(x){ return S.risk.seen[x.id]; }).length;
  h += '<p class="tiny dm-rcount">Factors explored: ' + n + " of " + R.factors.length + ".</p>";
  var det = "";
  if (S.risk.open === "why") det = '<h5 class="dm-h5">' + R.why.t + '</h5><div class="hfa-support dm-rnote" role="note"><p>' + R.why.note + "</p></div>" + R.why.html + '<p class="tiny">' + R.why.help + "</p>";
  else { var x = byId(R.factors, S.risk.open); det = x ? '<h5 class="dm-h5">' + x.t + ' <span class="dm-rk ' + (x.k === "fixed" ? "fixed" : "mod") + '">' + R.tags[x.k] + "</span></h5><p>" + x.d + '</p><p class="tiny muted">Population level: this describes patterns across many people, not any one person.</p>' : '<p class="tiny muted">Tap a factor card to read how it links to type 2 diabetes.</p>'; }
  h += '<div class="dm-rdet" aria-live="polite">' + det + '</div><p class="dm-rcap"><strong>' + R.caption + "</strong></p>";
  return h;
}
function explore(host, api){
  var D = api.content, S = api.S, anim = null, pend = null, timers = [], cellT = 1, cellAnim = null;
  S.mode = byId(D.modes, S.mode) ? S.mode : "curves";
  S.c = normC(S.c || { p:"t2", m:"med" });
  S.pins = (Array.isArray(S.pins) ? S.pins : []).slice(0, 2).map(normC);
  S.risk = S.risk || {}; S.risk.seen = S.risk.seen || {}; S.risk.open = S.risk.open || "";
  var fx = { ghosts:[], upto:null, peak:null, lit:[] };

  host.innerHTML = '<div id="dm-mode"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="dm-lab" id="dm-lab" data-mv="graph"><div class="dm-main">' +
      '<div id="dm-pc"><div class="plot-wrap"><canvas class="plot dm-plot" id="dm-plot" role="img" aria-label="Blood glucose curve"></canvas></div><ul class="dm-legend" id="dm-legend"></ul>' +
        '<div class="dm-ctl"><div id="dm-per"></div><div id="dm-meal"></div><div class="dm-togs" id="dm-togs" role="group" aria-label="Changes to the meal"></div>' +
        '<div class="dm-pinw"><p class="dm-rgl">Compare</p><div class="q-actions dm-pinact"><button type="button" class="btn ghost sm" id="dm-pin" data-k="dmpin">Pin this curve</button><button type="button" class="btn ghost sm" id="dm-clr" data-k="dmclr">Clear pins</button></div><p class="tiny muted" id="dm-pinnote" aria-live="polite"></p><ul class="dm-pins" id="dm-pins"></ul></div></div></div>' +
      '<div id="dm-pcell" hidden></div><div id="dm-prisk" hidden></div></div>' +
    '<div class="dm-side" id="dm-side"><h4 class="dm-h4">Readout</h4><dl class="read" id="dm-read" aria-live="polite"></dl></div></div>' +
    '<details class="alg dm-about" id="dm-about"><summary>' + D.about.title + '</summary><div class="dm-aboutw"><ul class="dm-rules">' + D.about.rules.map(function(x){ return "<li>" + x + "</li>"; }).join("") + '</ul><div id="dm-ptab"></div></div><p class="tiny muted">' + D.about.note + "</p></details>";

  var modeRG = radios($("#dm-mode"), { label:"Mode", options:D.modes, value:S.mode, onChange:function(v){ cancelAnim(); S.mode = v; MV.banner("", ""); commit(); } });
  var perRG = radios($("#dm-per"), { label:"Persona", cls:"chips", options:D.personas.map(function(p){ return { id:p.id, t:"<strong>" + p.t + "</strong> · " + p.kind }; }), value:S.c.p, onChange:function(v){ cancelAnim(); S.c.p = v; commit(); } });
  var mealRG = radios($("#dm-meal"), { label:"Meal", cls:"chips", options:D.meals.map(function(m){ return { id:m.id, t:m.t }; }), value:S.c.m, onChange:function(v){ cancelAnim(); S.c.m = v; commit(); } });
  $("#dm-togs").innerHTML = switchHTML("dmtw", "<strong>Meal tweak:</strong> " + D.tweak, S.c.tw, 'data-tog="tw"') + switchHTML("dmwk", "<strong>After the meal:</strong> " + D.walk, S.c.wk, 'data-tog="wk"');
  $("#dm-togs").addEventListener("click", function(e){ var b = e.target.closest("[data-tog]"); if (!b) return; cancelAnim(); S.c[b.dataset.tog] = !S.c[b.dataset.tog]; commit(); });
  $("#dm-pin").addEventListener("click", function(){ cancelAnim(); if (S.pins.length >= 2 || S.pins.some(function(c){ return sameC(c, S.c); })) return; S.pins.push(normC(S.c)); commit(); });
  $("#dm-clr").addEventListener("click", function(){ cancelAnim(); S.pins = []; commit(); });
  $("#dm-pins").addEventListener("click", function(e){ var b = e.target.closest("[data-unpin]"); if (!b) return; cancelAnim(); S.pins.splice(+b.dataset.unpin, 1); commit(); var nb = $("#dm-pins [data-unpin]") || $("#dm-pin"); if (nb && !nb.disabled) nb.focus({ preventScroll:true }); });
  if (window.matchMedia && window.matchMedia("(min-width: 821px)").matches) $("#dm-about").open = true;
  // peak table (built from the rules; matches the plan's table)
  (function(){
    var head = ["Persona", "Meal", "Plain", "Walk", "Tweak", "Tweak + walk"], rows = [];
    D.personas.forEach(function(p){ D.meals.forEach(function(m, i){
      var row = [i === 0 ? MV.cap(p.kind.replace(" diabetes", "").replace(" response", "")) : "", MV.cap(m.short.replace(" mixed meal", "").replace(" meal", ""))];
      [[0, 0], [0, 1], [1, 0], [1, 1]].forEach(function(q){ row.push(d1(peakOf({ p:p.id, m:m.id, tw:q[0], wk:q[1] }))); });
      rows.push(row);
    }); });
    $("#dm-ptab").innerHTML = '<p class="dm-ptt"><strong>Peak table (mmol/L)</strong> <span class="hfa-model">Model data</span></p>' + MV.tableHTML({ head:head, rows:rows, caption:"Peak table, mmol/L" });
  })();

  // ===== glucose curves =====
  var plot = new MV.Plot($("#dm-plot"), { xmin:-0.6, xmax:5.3, ymin:-1.5, ymax:18 });
  function liveVals(){ var p = per(S.c.p), P = fx.peak != null ? fx.peak : peakOf(S.c); return { f:p.fast, P:P, B:p.back }; }
  function draw(){
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), curves = [], labels = [], points = [], L = liveVals(), font = "700 13px " + (css("--font-ui") || "sans-serif");
    function lab(x, y, text, color, align, dx, dy){ labels.push({ x:x, y:y, text:text, color:color, align:align, dx:dx, dy:dy, bg:true, font:font }); }
    fx.ghosts.forEach(function(g){ curves.push({ pts:curvePts(g.f, g.P, g.B), color:ink2, width:2, dash:[3, 5] }); points.push({ x:0.75, y:g.P, r:3.5, color:ink2 }); lab(0.75, g.P, g.label, ink2, "left", 10, -2); });
    S.pins.forEach(function(c, i){
      var p = per(c.p), P = peakOf(c);
      curves.push({ pts:curvePts(p.fast, P, p.back), color:i ? ink : pen, width:i ? 3 : 3.2, dash:i ? [14, 8] : null });
      points.push({ x:0.75, y:P, r:4.5, color:i ? ink : pen });
      lab(0.75, P, (i + 1) + ": " + d1(P), i ? ink : pen, i ? "left" : "right", i ? 10 : -10, i ? 14 : -12);
    });
    var lc2 = S.pins.length ? ink2 : pen;
    curves.push({ pts:curvePts(L.f, L.P, L.B, fx.upto), color:lc2, width:S.pins.length ? 2.4 : 3.2, dash:S.pins.length ? [2, 5] : null });
    if (fx.upto == null || fx.upto >= 0.75) { points.push({ x:0.75, y:L.P, r:4.5, color:lc2 }); if (!S.pins.length || !S.pins.some(function(c){ return sameC(c, S.c); })) lab(0.75, L.P, (S.pins.length ? "now: " : "peak ") + d1(L.P), lc2, "left", 10, -14); }
    var desc = "Graph of blood glucose in the teaching model against hours after eating. Now showing " + cDesc(S.c) + ": starts at " + d1(L.f) + ", peaks at " + d1(L.P) + " mmol/L 45 minutes after eating, back to the start at " + L.B + " hours." +
      S.pins.map(function(c, i){ return " Pinned curve " + (i + 1) + ": " + cDesc(c) + ", peak " + d1(peakOf(c)) + "."; }).join("") + fx.ghosts.map(function(g){ return " Earlier curve: " + g.label + "."; }).join("");
    plot.draw({ curves:curves, points:points, labels:labels, xTicks:{ step:1, fmt:function(v){ return v + " h"; } }, yTicks:{ step:2 }, xLabel:"hours after eating", yLabel:"blood glucose (mmol/L)", describe:desc });
  }
  plot.render = draw;
  function swatch(kind){ var d = kind === 1 ? "14 6" : kind === 2 ? "2 5" : kind === 3 ? "3 5" : ""; return '<svg class="dm-sw' + kind + '" width="34" height="10" aria-hidden="true"><line x1="2" y1="5" x2="32" y2="5"' + (d ? ' stroke-dasharray="' + d + '"' : "") + "/></svg>"; }
  function paintCurves(){
    perRG.set(S.c.p); mealRG.set(S.c.m);
    $$("#dm-togs [data-tog]").forEach(function(b){ var on = !!S.c[b.dataset.tog]; b.setAttribute("aria-checked", on); b.querySelector(".dm-swv").textContent = on ? "On" : "Off"; });
    var L = liveVals(), pinned = S.pins.some(function(c){ return sameC(c, S.c); });
    $("#dm-legend").innerHTML = S.pins.map(function(c, i){ return "<li>" + swatch(i ? 1 : 0) + "<span><strong>Pin " + (i + 1) + (i ? " (long dashes)" : " (solid)") + ":</strong> " + cDesc(c) + " · peak " + d1(peakOf(c)) + " mmol/L</span></li>"; }).join("") +
      "<li>" + swatch(S.pins.length ? 2 : 0) + "<span><strong>Now" + (S.pins.length ? " (dotted)" : "") + ":</strong> " + cDesc(S.c) + " · peak " + d1(L.P) + " mmol/L" + (pinned ? " (pinned)" : "") + "</span></li>" +
      fx.ghosts.map(function(g){ return "<li>" + swatch(3) + "<span><strong>Earlier (short dashes):</strong> " + g.label + " mmol/L</span></li>"; }).join("");
    $("#dm-pin").disabled = S.pins.length >= 2 || pinned; $("#dm-clr").disabled = !S.pins.length;
    $("#dm-pinnote").textContent = S.pins.length >= 2 ? "Two curves pinned. Remove one to pin another." : pinned ? "This curve is pinned. Change a setting, then pin again." : "Pin up to two curves to compare them.";
    MV.keepFocus($("#dm-pins"), function(){ $("#dm-pins").innerHTML = S.pins.map(function(c, i){ return '<li><span>Pin ' + (i + 1) + ": " + cDesc(c) + " · " + d1(peakOf(c)) + ' mmol/L</span><button type="button" class="dm-rm" data-unpin="' + i + '" data-k="unpin' + i + '" aria-label="Remove pin ' + (i + 1) + '">×</button></li>'; }).join(""); });
    draw();
  }
  function readPaint(){
    var R = D.rows, p = per(S.c.p), L = liveVals();
    var rows = [["now", R.now, "<strong>" + p.t + "</strong> (" + p.kind + ") · " + meal(S.c.m).short + " · " + chgT(S.c)], ["fast", R.fast, d1(p.fast) + " mmol/L"], ["peak", R.peak, "<strong>" + d1(L.P) + " mmol/L</strong>"],
      ["rise", R.rise, d1(L.P - p.fast) + " mmol/L"], ["back", R.back, p.back + " h"], ["insulin", R.insulin, p.insulin], ["remind", R.remind, "<strong>" + D.reminder + "</strong>"]];
    $("#dm-read").innerHTML = rows.map(function(r){ return '<div class="' + (fx.lit.indexOf(r[0]) >= 0 ? "dm-lit" : "") + '" data-row="' + r[0] + '"><dt>' + r[1] + "</dt><dd>" + r[2] + "</dd></div>"; }).join("");
  }

  // ===== Inside the cell (N13) =====
  var CE = D.cell, pc = $("#dm-pcell");
  pc.innerHTML = '<div class="dm-cellw"><svg class="dm-csvg" id="dm-csvg" viewBox="0 0 560 272" role="img" aria-label=""></svg><div id="dm-cplay"></div><ol class="dm-csteps" id="dm-csteps">' + CE.steps.map(function(s, i){ return '<li data-cs="' + i + '">' + s + "</li>"; }).join("") + "</ol>" +
    '<div class="dm-t1"><svg viewBox="0 0 120 70" aria-hidden="true"><rect class="dm-cmem" x="0" y="44" width="120" height="10"/><path class="dm-clock" d="M44 44V32a5 5 0 0 1 5-5h4v10h6V27h4a5 5 0 0 1 5 5v12"/><g class="dm-t1k" transform="translate(56 10) rotate(90)"><circle r="6"/><path d="M6 0h16"/></g><path class="dm-t1x" d="M44 4l24 20M68 4L44 24"/></svg><div><h5 class="dm-h5">' + CE.contrastTitle + "</h5><p>" + CE.contrast + "</p></div></div></div>";
  var csvg = $("#dm-csvg");
  function cellNarrow(){ return (pc.getBoundingClientRect().width || 600) < 480; }
  function cellDescribe(i){ var n = cellNarrow() ? "two" : "four"; return "Step " + (i + 1) + " of 4. " + MV.plain(CE.steps[i]) + (i === 3 ? " Only one of " + n + " transporters reaches the membrane, and extra insulin crowds the receptor." : i === 2 ? " Glucose passes through the transporters into the cell." : i === 1 ? " The transporters move up to the membrane." : " The insulin key fits the receptor lock."); }
  function cellDraw(){ var nw = cellNarrow(); csvg.setAttribute("viewBox", nw ? "0 0 390 272" : "0 0 560 272"); csvg.classList.toggle("narrow", nw); csvg.innerHTML = cellSVG(cellT, nw); }
  window.addEventListener("resize", function(){ if (!pc.hidden) cellDraw(); });
  function cellPaint(i){ $$("#dm-csteps li").forEach(function(li){ var on = +li.dataset.cs === i; li.classList.toggle("on", on); if (on) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current"); }); csvg.setAttribute("aria-label", cellDescribe(i)); }
  var cellReady = false, step0 = clamp(+S.step || 0, 0, 3);
  var player = MV.player($("#dm-cplay"), { count:4, interval:1300, label:function(i){ return "Step " + (i + 1) + " of 4"; }, render:function(i){
    S.step = i; cellPaint(i);
    if (cellAnim) { cellAnim(); cellAnim = null; }
    var to = i + 1;
    if (!cellReady || MV.reduceMotion) { cellT = to; cellDraw(); return; }
    var from = cellT;
    cellAnim = MV.tween({ dur:750, step:function(t){ cellT = lerp(from, to, t); cellDraw(); }, done:function(){ cellAnim = null; } });
  } });
  cellReady = true;
  if (step0 > 0) { cellReady = false; player.go(step0); cellReady = true; }

  // ===== Risk map (F7) =====
  var pr = $("#dm-prisk");
  function paintRisk(){ MV.keepFocus(pr, function(){ pr.innerHTML = riskHTML(D.risk, S); }); }
  pr.addEventListener("click", function(e){ var b = e.target.closest("[data-rf]"); if (!b) return; var id = b.dataset.rf; S.risk.open = S.risk.open === id ? "" : id; if (S.risk.open) S.risk.seen[id] = true; api.save(); paintRisk(); });

  function paint(){
    modeRG.set(S.mode);
    $("#dm-pc").hidden = S.mode !== "curves"; pc.hidden = S.mode !== "cell"; pr.hidden = S.mode !== "risk";
    $("#dm-side").hidden = S.mode !== "curves"; $("#dm-about").hidden = S.mode !== "curves"; $("#dm-lab").classList.toggle("solo", S.mode !== "curves");
    if (S.mode === "curves") { paintCurves(); readPaint(); }
    else if (S.mode === "risk") paintRisk();
    else cellDraw();
  }
  function commit(){ fx.ghosts = []; fx.lit = []; fx.peak = null; fx.upto = null; api.save(); paint(); MV.changed(); }
  function finish(){ anim = null; timers = []; fx.peak = null; fx.upto = null; api.save(); paint(); MV.changed(); var d = pend; pend = null; if (d) d(); }
  function cancelAnim(){ if (anim) { anim(); anim = null; } timers.forEach(clearTimeout); timers = []; fx.peak = null; fx.upto = null; if (pend) { var d = pend; pend = null; d(); } }
  function later(ms, fn){ timers.push(MV.wait(ms, fn)); }
  paint();

  // ===== challenges (plan's exact tests and named wrong states) =====
  var CH = {}; D.challenges.forEach(function(c){ CH[c.id] = c; });
  function challenge(id, opt){
    var M = CH[id].msgs, c = S.c, P = peakOf(c), r = { ok:false };
    if (id === "tc1") {
      if (c.p !== "ir") r.msg = M.who;
      else if (P <= 7.5 + 1e-9) r = { ok:true };
      // plan names medium + walk (9.0); medium + tweak (also 9.0, also one change away) gets the same message
      else if (c.m === "med" && c.tw !== c.wk) r.msg = M.close;
      else r.msg = fill(M.high, { v:d1(P) });
    } else if (id === "tc2") {
      var pins = S.pins;
      if (pins.length < 2) r.msg = fill(M.pins, { n:pins.length });
      else if (!pins.every(function(q){ return q.p === "t2"; })) r.msg = M.who;
      else if (pins[0].m !== pins[1].m) r.msg = M.meal;
      else if (pins.some(function(q){ return q.tw && q.wk; })) r.msg = M.both;
      else if (!(pins.some(function(q){ return q.wk && !q.tw; }) && pins.some(function(q){ return q.tw && !q.wk; }))) r.msg = M.pair;
      else if (Math.abs(peakOf(pins[0]) - peakOf(pins[1])) < 1e-9) r = { ok:true };
      else r.msg = M.pair;
    } else if (id === "tc3") {
      if (c.p !== "t2") r.msg = M.who;
      else if (c.m === "low") r.msg = P <= 10 + 1e-9 ? M.low : M.lowHigh;
      else if (c.m === "high") r.msg = M.high;
      else if (P <= 10 + 1e-9) r = { ok:true };
      else if (c.tw !== c.wk) r.msg = M.one;
      else r.msg = M.plain;
    }
    if (r.ok && opt && !opt.live && (id === "tc2" || id === "tc3")) MV.banner("good", MV.plain(CH[id].why));
    return r;
  }

  // ===== predictions =====
  function reveal(el){ var b = el && el.getBoundingClientRect(); if (b && (b.top < 110 || b.bottom > window.innerHeight)) el.scrollIntoView({ block:"center", behavior:MV.reduceMotion ? "auto" : "smooth" }); }
  function ghost(c, label){ var p = per(c.p); fx.ghosts.push({ f:p.fast, P:peakOf(c), B:p.back, label:label }); }
  function drawIn(dur, done){ anim = MV.tween({ dur:dur, ease:function(t){ return t; }, step:function(t){ fx.upto = -0.6 + 5.9 * t; draw(); }, done:function(){ anim = null; fx.upto = null; done(); } }); }
  function peakTo(a, b, dur, done){ anim = MV.tween({ dur:dur, step:function(t){ fx.peak = lerp(a, b, t); paintCurves(); readPaint(); }, done:function(){ anim = null; fx.peak = null; done(); } }); }
  return {
    predict:{
      start:function(p){
        cancelAnim(); fx.ghosts = []; fx.lit = [];
        if (p.id === "p1") { S.mode = "curves"; S.c = normC({ p:"typ", m:"high" }); S.pins = []; }
        else if (p.id === "p2") { S.mode = "curves"; S.c = normC({ p:"typ", m:"high" }); S.pins = []; }
        else if (p.id === "p3") { S.mode = "cell"; player.go(0); }
        else if (p.id === "p4") { S.mode = "curves"; S.c = normC({ p:"t2", m:"high" }); S.pins = []; }
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        pend = done;
        if (p.id === "p1") {
          reveal($("#dm-plot"));
          drawIn(1100, function(){ ghost(S.c, "Mei-Ling " + d1(peakOf(S.c))); S.c.p = "ir"; paintCurves(); readPaint();
            later(250, function(){ drawIn(1100, function(){ ghost(S.c, "Ahmad " + d1(peakOf(S.c))); S.c.p = "t2"; paintCurves(); readPaint();
              later(250, function(){ drawIn(1100, function(){ fx.lit = ["peak"]; finish(); }); }); }); }); });
        } else if (p.id === "p2" || p.id === "p4") {
          reveal($("#dm-plot"));
          var a = peakOf(S.c);
          later(500, function(){
            ghost(S.c, p.id === "p2" ? "no walk " + d1(a) : "high-GI " + d1(a));
            if (p.id === "p2") S.c.wk = true; else S.c.m = "low";
            var b = peakOf(S.c); paintCurves(); readPaint();
            peakTo(a, b, 1400, function(){ fx.lit = ["peak", "rise"]; finish(); });
          });
        } else {
          reveal($("#dm-csvg"));
          later(600, function(){ player.go(1); later(1100, function(){ player.go(2); later(1100, function(){ player.go(3); later(1100, finish); }); }); });
        }
      }
    },
    challenge:challenge
  };
}

// ---------- Part 3: Prevention at community level (@component communityStations — trial bars with "Check it with data",
// program cards with feature tags, a strategies × criteria rating matrix) ----------
function part3(host, api){
  var D = api.content, S = api.S, TR = D.trial, PG = D.programs, RT = D.rate;
  S.st = byId(D.stations, S.st) ? S.st : "trial";
  S.q1 = S.q1 || { val:"", tries:0, solved:false }; S.q2 = S.q2 || { pick:null, solved:false };
  S.tags = S.tags || {}; PG.cards.forEach(function(c){ S.tags[c.id] = S.tags[c.id] || { sel:{}, checked:false }; });
  S.rate = S.rate || {}; S.rchk = S.rchk || {}; RT.strategies.forEach(function(s){ S.rate[s.id] = S.rate[s.id] || {}; });
  host.innerHTML = '<div id="dm-stn"></div><p class="tiny" id="dm-stp" aria-live="polite"></p><div class="dm-st" id="dm-st-trial"></div><div class="dm-st" id="dm-st-programs" hidden></div><div class="dm-st" id="dm-st-rate" hidden></div>';
  function tagOk(c){ var t = S.tags[c.id], key = MV.ans(c) || []; return PG.features.every(function(f){ return !!t.sel[f.id] === key.indexOf(f.id) >= 0; }); }
  function rowOk(s){ var key = MV.ans(s) || {}, v = S.rate[s.id]; return RT.criteria.every(function(c){ return v[c.id] === key[c.id]; }); }
  function done(id){
    if (id === "trial") return S.q1.solved && S.q2.solved;
    if (id === "programs") return PG.cards.every(function(c){ return S.tags[c.id].checked && tagOk(c); });
    return RT.strategies.every(function(s){ return S.rchk[s.id] && rowOk(s); });
  }
  function stLabels(){ return D.stations.map(function(s){ return { id:s.id, t:s.t + (done(s.id) ? ' <span class="dm-stok">✓<span class="vh"> finished</span></span>' : "") }; }); }
  var stOpts = stLabels();
  var stRG = radios($("#dm-stn", host), { label:"Station", cls:"chips", options:stOpts, value:S.st, onChange:function(v){ S.st = v; api.save(); paintAll(); } });
  function stRepaint(){
    stLabels().forEach(function(x, i){ stOpts[i].t = x.t; }); stRG.repaint();
    $("#dm-stp", host).textContent = "Stations finished: " + D.stations.filter(function(s){ return done(s.id); }).length + " of " + D.stations.length + ".";
  }

  // ===== Station 1: trial bars + Check it with data =====
  var s1 = $("#dm-st-trial", host), max = 40;
  s1.innerHTML = '<h4 class="dm-h4">' + TR.title + "</h4><p>" + TR.text + '</p><figure class="dm-trf"><div class="dm-trbars" role="img" aria-label="' + esc("Bar graph, model data: new diagnoses per 100 people over about 3 years. " + TR.bars.map(function(b){ return b.t + " " + b.v; }).join(", ") + ".") + '">' +
    TR.bars.map(function(b){ return '<div class="dm-trrow" aria-hidden="true"><span class="dm-trl">' + b.t + '</span><span class="dm-trt"><i class="dm-trb ' + b.id + '" style="width:' + f1(b.v / max * 100) + '%"></i><b>' + b.v + " per 100</b></span></div>"; }).join("") +
    '</div><figcaption class="tiny muted">' + TR.unit + ', over about 3 years <span class="hfa-model">Model data</span> ' + TR.noWeight + "</figcaption></figure>" +
    '<details class="alg dm-data" open><summary>Check it with data</summary><div id="dm-q1"></div><div id="dm-q2"></div><div id="dm-trtab"></div></details>';
  var q2order = MV.shuffle(TR.q2.choices.map(function(_, i){ return i; }), "dm-q2");
  function paintTrial(){
    var x = S.q1, h = '<div class="q dm-tq" data-tq="q1"><p class="q-prompt"><strong>1.</strong> ' + TR.q1.prompt + '</p><div class="numrow"><label for="dm-q1in">Relative reduction:</label><input class="numin short" id="dm-q1in" type="text" inputmode="decimal" autocomplete="off" data-k="dmq1in" value="' + esc(x.val) + '"' + (x.solved ? " disabled" : "") + '><span>%</span>' +
      (x.solved ? "" : '<button type="button" class="btn primary sm" data-k="dmq1chk" data-tq1="1">Check</button>') + "</div>";
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + TR.q1.why);
    else if (x.msg) h += MV.fbHTML(x.skip ? "" : "bad", x.msg);
    $("#dm-q1", s1).innerHTML = h + "</div>";
    var y = S.q2, h2 = '<div class="q dm-tq" data-tq="q2"><p class="q-prompt"><strong>2.</strong> ' + TR.q2.prompt + '</p><div class="dm-chipset" role="radiogroup" aria-label="' + esc(MV.plain(TR.q2.prompt)) + '">' + q2order.map(function(i){
      var on = y.pick === i; return '<button type="button" role="radio" aria-checked="' + on + '" data-q2="' + i + '" data-k="dmq2' + i + '"' + (y.solved ? " disabled" : "") + ">" + TR.q2.choices[i].t + "</button>";
    }).join("") + "</div>";
    if (y.pick != null) h2 += MV.ok(TR.q2.choices[y.pick]) ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + TR.q2.why) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + TR.q2.wrong);
    MV.keepFocus($("#dm-q2", s1), function(){ $("#dm-q2", s1).innerHTML = h2 + "</div>"; });
    var u = TR.bars[0].v;
    $("#dm-trtab", s1).innerHTML = x.solved ? '<p class="tiny"><strong>The data, worked out</strong> <span class="hfa-model">Model data</span></p><div class="tbl-wrap"><table class="dm-tbl"><thead><tr>' + TR.tableHeads.map(function(t){ return '<th scope="col">' + t + "</th>"; }).join("") + "</tr></thead><tbody>" +
      TR.bars.map(function(b){ var dd = u - b.v; return '<tr><th scope="row">' + b.t + "</th><td>" + b.v + "</td><td>" + (dd ? dd + " per 100" : "—") + "</td><td>" + (dd ? Math.round(dd / u * 100) + "%" : "—") + "</td></tr>"; }).join("") + "</tbody></table></div>" : "";
  }
  s1.addEventListener("input", function(e){ if (e.target.id === "dm-q1in") { S.q1.val = e.target.value; S.q1.msg = ""; api.save(); } });
  s1.addEventListener("keydown", function(e){ if (e.target.id === "dm-q1in" && e.key === "Enter") { e.preventDefault(); var b = $("[data-tq1]", s1); if (b) b.click(); } });
  s1.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.tq1) {
      var x = S.q1, v = numIn(x.val);
      if (v == null) { x.msg = "Enter a percentage, such as 25."; x.skip = true; }
      else if (Math.abs(v - MV.ans(TR.q1)) < 0.51) { x.solved = true; x.msg = ""; }
      else { x.tries++; x.skip = false; var w = TR.q1.wrong.filter(function(q){ return Math.abs(v - q.match) < 0.51; })[0]; x.msg = "<strong>✗ Not quite.</strong> " + (w ? w.fb : TR.q1.wrongDefault); }
      api.save(); paintTrial(); stRepaint(); MV.focusFb($("#dm-q1", s1)); return;
    }
    if (b.dataset.q2 != null) { S.q2.pick = +b.dataset.q2; S.q2.solved = MV.ok(TR.q2.choices[S.q2.pick]); api.save(); paintTrial(); stRepaint(); MV.focusFb($("#dm-q2", s1)); }
  });
  s1.addEventListener("keydown", function(e){
    var c = e.target.closest && e.target.closest("[data-q2]"); if (!c) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var sib = $$("[data-q2]", c.parentNode), k = sib.indexOf(c), nb = sib[(k + d + sib.length) % sib.length]; if (nb && !nb.disabled) { nb.focus(); nb.click(); }
  });

  // ===== Station 2: program cards with feature tags =====
  var s2 = $("#dm-st-programs", host);
  s2.innerHTML = '<h4 class="dm-h4">' + PG.title + "</h4><p><strong>" + PG.ask + '</strong></p><div id="dm-pcards"></div>';
  function paintProg(){
    var box = $("#dm-pcards", s2);
    MV.keepFocus(box, function(){
      box.innerHTML = PG.cards.map(function(c){
        var t = S.tags[c.id], key = MV.ans(c) || [], ok = t.checked && tagOk(c);
        var h = '<article class="dm-pcard' + (c.real ? "" : " model") + '" data-pc="' + c.id + '"><h5 class="dm-h5">' + c.t + (c.real ? "" : ' <span class="hfa-model">Practice model (fictional)</span>') + "</h5><p>" + c.html + "</p>";
        h += '<div class="dm-ftags" role="group" aria-label="' + esc("Features of " + MV.plain(c.t)) + '">' + PG.features.map(function(f){
          var on = !!t.sel[f.id], mark = "";
          if (t.checked) { var inK = key.indexOf(f.id) >= 0; mark = on && inK ? "right" : on && !inK ? "wrong" : ""; }
          return '<button type="button" class="dm-ftag' + (mark ? " " + mark : "") + '" aria-pressed="' + on + '" data-ft="' + f.id + '" data-k="ft' + c.id + f.id + '"' + (ok ? " disabled" : "") + ">" + (on ? "✓ " : "+ ") + f.t + (mark === "wrong" ? '<span class="vh"> (not described)</span>' : mark === "right" ? '<span class="vh"> (described)</span>' : "") + "</button>";
        }).join("") + "</div>";
        if (!ok) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-pchk="1" data-k="pchk' + c.id + '">Check my tags</button></div>';
        if (t.msg) h += MV.fbHTML(ok ? "good" : t.skip ? "" : "bad", t.msg);
        return h + "</article>";
      }).join("");
    });
  }
  s2.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var art = b.closest("[data-pc]"); if (!art) return;
    var c = byId(PG.cards, art.dataset.pc), t = S.tags[c.id], M = PG.msgs;
    if (b.dataset.ft) { t.sel[b.dataset.ft] = !t.sel[b.dataset.ft]; t.checked = false; t.msg = ""; api.save(); paintProg(); stRepaint(); return; }
    if (b.dataset.pchk) {
      var key = MV.ans(c) || [], any = PG.features.some(function(f){ return t.sel[f.id]; });
      if (!any) { t.msg = M.none; t.skip = true; t.checked = false; }
      else {
        t.checked = true; t.skip = false;
        var miss = PG.features.filter(function(f){ return !t.sel[f.id] && key.indexOf(f.id) >= 0; });
        var extra = PG.features.filter(function(f){ return t.sel[f.id] && key.indexOf(f.id) < 0; }).map(function(f){ return "“" + f.t + "”"; });
        t.msg = !miss.length && !extra.length ? "<strong>✓ " + M.done + "</strong>" : "<strong>✗ Not quite.</strong> " + [extra.length ? fill(M.extra, { list:listAnd(extra) }) : "", miss.length ? fill(M.miss, { count:miss.length === 1 ? "1 more feature" : miss.length + " more features" }) : ""].filter(Boolean).join(" ");
      }
      api.save(); paintProg(); stRepaint(); MV.focusFb($('#dm-pcards [data-pc="' + c.id + '"]', s2));
    }
  });

  // ===== Station 3: strategies × criteria =====
  var s3 = $("#dm-st-rate", host);
  s3.innerHTML = '<h4 class="dm-h4">' + RT.title + "</h4><p><strong>" + RT.ask + '</strong></p><div class="dm-strats">' + RT.strategies.map(function(s){
    return '<article class="dm-strat" data-sr="' + s.id + '"><h5 class="dm-h5"><span class="dm-sl">' + s.id + "</span> " + s.t + '</h5><div class="dm-crits">' + RT.criteria.map(function(c){ return '<div class="dm-crit" id="dm-c-' + s.id + c.id + '"></div>'; }).join("") +
      '</div><div class="q-actions"><button type="button" class="btn primary sm" data-rchk="' + s.id + '" data-k="rchk' + s.id + '">Check against the model ratings</button></div><div class="dm-rfb" aria-live="polite"></div></article>';
  }).join("") + "</div>";
  var cRG = {};
  RT.strategies.forEach(function(s){ RT.criteria.forEach(function(c){
    cRG[s.id + c.id] = radios($("#dm-c-" + s.id + c.id, s3), { label:c.t, cls:"chips", aria:s.id + ": " + c.t, options:c.opts.map(function(o){ return { id:o.id, t:o.t }; }), value:S.rate[s.id][c.id] || "",
      onChange:function(v){ S.rate[s.id][c.id] = v; S.rchk[s.id] = false; api.save(); paintRate(); stRepaint(); } });
  }); });
  function paintRate(){
    var M = RT.msgs;
    RT.strategies.forEach(function(s){
      var art = $('[data-sr="' + s.id + '"]', s3), key = MV.ans(s) || {}, v = S.rate[s.id], chk = S.rchk[s.id], fb = $(".dm-rfb", art);
      var all4 = RT.criteria.every(function(c){ return v[c.id]; });
      RT.criteria.forEach(function(c){
        var host2 = $("#dm-c-" + s.id + c.id, s3), good = v[c.id] === key[c.id];
        if (!all4) good = null;
        host2.classList.toggle("right", !!chk && good === true); host2.classList.toggle("wrong", !!chk && good === false);
        var mk = host2.querySelector(".dm-cmk"); if (mk) mk.remove();
        if (chk && good != null) host2.insertAdjacentHTML("beforeend", '<span class="dm-cmk" aria-hidden="true">' + (good ? "✓" : "✗") + "</span>");
      });
      if (!chk) { fb.innerHTML = ""; return; }
      var filled = RT.criteria.every(function(c){ return v[c.id]; });
      if (!filled) { fb.innerHTML = MV.fbHTML("", M.partial); return; }
      var off = RT.criteria.filter(function(c){ return v[c.id] !== key[c.id]; });
      fb.innerHTML = !off.length ? MV.fbHTML("good", "<strong>✓ " + M.ok + "</strong> " + s.why) :
        MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + fill(M.off, { count:off.length === 1 ? "1 rating differs" : off.length + " ratings differ", list:listAnd(off.map(function(c){ return "“" + lc(c.t) + "”"; })) }));
    });
  }
  s3.addEventListener("click", function(e){ var b = e.target.closest("[data-rchk]"); if (!b) return; S.rchk[b.dataset.rchk] = true; api.save(); paintRate(); stRepaint(); MV.focusFb($('[data-sr="' + b.dataset.rchk + '"]', s3)); });

  function paintAll(){ stRG.set(S.st); stRepaint(); D.stations.forEach(function(s){ $("#dm-st-" + s.id, host).hidden = s.id !== S.st; }); }
  paintTrial(); paintProg(); paintRate(); paintAll();
}

// ---------- Practice 1: Type 1, type 2 or both? (@component sorterPlus — the K12 tap-to-sort with an extra box that opens only
// for a flagged card; copied from the toolkit sorter) ----------
function typeSorter(host, api, a){
  var S = api.S; S.placed = S.placed || {}; S.tries = S.tries || {}; S.hints = S.hints || {};
  var sel = null, msg = null, myth = a.items.filter(function(it){ return it.myth; })[0];
  function stats(){
    var placed = 0, first = 0, missed = [];
    a.items.forEach(function(it){ var bad = (S.tries[it.id] || 0) > 0 || (S.hints[it.id] || 0) >= 3; if (S.placed[it.id]) { placed++; if (!bad) first++; } if (bad) missed.push(it); });
    return { total:a.items.length, placed:placed, first:first, missed:missed };
  }
  function boxes(){ var b = a.boxes.slice(); if ((sel && myth && sel === myth.id) || (myth && S.placed[myth.id])) b.push(a.neither); return b; }
  function paint(){
    var s = stats(), un = a.items.filter(function(it){ return !S.placed[it.id]; }), bx = boxes();
    var h = '<p class="how">' + a.how + "</p>";
    h += '<div class="tray" role="group" aria-label="Statements to sort">' + (un.length ? un.map(function(it){
      return '<button type="button" class="tile txt" aria-pressed="' + (sel === it.id) + '" data-k="t' + it.id + '" data-item="' + it.id + '">' + it.t + "</button>";
    }).join("") : '<p class="sort-done">All sorted! You got ' + s.first + " of " + s.total + " right on the first try, without the worked solution.</p>") + "</div>";
    if (sel) {
      var it = byId(a.items, sel), lvl = S.hints[sel] || 0;
      h += '<div class="sel-bar"><span>Selected: ' + it.t + "</span>" + MV.hintBtn("h" + a.id, lvl) + "</div>" + MV.hintsHTML(it.hints, lvl);
      if (it.myth) h += '<p class="tiny dm-nnote">A <strong>Neither</strong> box has opened for this card.</p>';
    }
    if (msg) h += '<div class="fb ' + msg.type + '" role="status"><p>' + msg.html + "</p></div>";
    h += '<div class="bins' + (bx.length === 3 ? " three" : " dm-four") + '">' + bx.map(function(b){
      var inside = a.items.filter(function(it){ return S.placed[it.id] === b.id; });
      return '<button type="button" class="bin' + (sel ? " ready" : "") + (b.id === a.neither.id ? " dm-nbin" : "") + '" data-k="b' + b.id + '" data-bin="' + b.id + '"><span class="bin-head"><span><strong>' + b.label + "</strong>" + (b.sub ? "<small>" + b.sub + "</small>" : "") + '</span></span><span class="bin-items">' + inside.map(function(it){ return '<span class="chip-in txt">' + it.t + "</span>"; }).join("") + "</span></button>";
    }).join("") + "</div>";
    MV.keepFocus(host, function(){ host.innerHTML = h; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.item) { sel = sel === b.dataset.item ? null : b.dataset.item; msg = null; paint(); return; }
    if (b.dataset.act === "hint" && sel) { S.hints[sel] = Math.min(3, (S.hints[sel] || 0) + 1); api.save(); paint(); return; }
    if (b.dataset.bin) {
      if (!sel) { msg = { type:"", html:"Tap a statement first, then tap the box it belongs in." }; paint(); return; }
      var it = byId(a.items, sel), ans = MV.ans(it);
      if (b.dataset.bin === ans) { S.placed[it.id] = ans; msg = { type:"good", html:"<strong>✓ " + it.t + "</strong>: " + it.why }; sel = null; api.save(); paint(); MV.focusFb(host); }
      else {
        S.tries[it.id] = (S.tries[it.id] || 0) + 1;
        var w = (it.wrong && it.wrong[b.dataset.bin]) || "Check the statement again against each box.";
        msg = { type:"bad", html:"<strong>✗ Not that box.</strong> " + w + (it.myth ? "" : " Try another box.") };
        api.save(); paint(); MV.focusFb(host);
      }
    }
  });
  paint();
  return {
    stats:function(){ var s = stats(); return { first:s.first, total:s.total, done:s.placed, line:(a.summary || a.title) + " (first try): " + s.first + "/" + s.total + (s.placed < s.total ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; stats().missed.forEach(function(it){ g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Practice 2: Glycemic load and trial data (custom ★ set: N4 number entry, category chips, choice chips) ----------
function glSet(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  a.items.forEach(function(it){ it.nums = it.nums || []; });
  function ist(id){ return S.items[id] || (S.items[id] = { vals:{}, cat:null, pick:null, multi:{}, tries:0, hint:0, solved:false, first:null }); }
  function order(it, n){ return MV.shuffle(Array.from({ length:n }, function(_, i){ return i; }), "dm-" + it.id); }
  function qHTML(it, i){
    var x = ist(it.id), cat = MV.ans(it), dis = x.solved ? " disabled" : "";
    var h = '<div class="q" data-ti="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">R' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★' + (it.inquiry ? " Inquiry" : "") + "</span>" : "") + "</div>";
    it.nums.forEach(function(n){ h += '<div class="numrow"><label for="dmn-' + it.id + n.id + '">' + n.label + ':</label><input class="numin short" id="dmn-' + it.id + n.id + '" data-tn="' + it.id + '" data-nid="' + n.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + esc(x.vals[n.id] || "") + '"' + dis + ">" + (n.unit ? "<span>" + n.unit + "</span>" : "") + "</div>"; });
    if (cat != null) h += '<div class="dm-gcat"><span class="dm-rgl">Category</span><div class="dm-chipset" role="radiogroup" aria-label="' + esc("R" + (i + 1) + " category") + '">' + a.cats.map(function(c, ci){ var on = x.cat === c.id; return '<button type="button" role="radio" aria-checked="' + on + '" data-cat="' + c.id + '" data-k="' + it.id + "cat" + ci + '"' + dis + ">" + c.t + "</button>"; }).join("") + "</div></div>";
    if (it.choices) {
      h += '<div class="dm-gch"><span class="dm-rgl">' + it.choiceLabel + '</span><div class="dm-chipset' + (it.multi ? " multi" : "") + '" role="' + (it.multi ? "group" : "radiogroup") + '" aria-label="' + esc(MV.plain(it.choiceLabel)) + '">' + order(it, it.choices.length).map(function(ci){
        var on = it.multi ? !!x.multi[ci] : x.pick === ci;
        return '<button type="button" ' + (it.multi ? 'aria-pressed="' + on + '"' : 'role="radio" aria-checked="' + on + '"') + ' data-ci="' + ci + '" data-k="' + it.id + "c" + ci + '"' + dis + ">" + (it.multi ? (on ? "✓ " : "+ ") : "") + it.choices[ci].t + "</button>";
      }).join("") + "</div></div>";
    }
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + it.why + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb ' + (msgs[it.id].skip ? "" : "bad") + '" role="status"><p>' + msgs[it.id].h + "</p></div>";
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
    var NQ = "<strong>✗ Not quite.</strong> ", TA = " Try again.";
    for (var i = 0; i < it.nums.length; i++) { if (numIn(x.vals[it.nums[i].id]) == null) return { skip:true, msg:"Enter a number in " + (it.nums.length > 1 ? "each box" : "the box") + ", such as 12 or 7.5." }; }
    for (i = 0; i < it.nums.length; i++) {
      var n = it.nums[i], v = numIn(x.vals[n.id]);
      if (Math.abs(v - MV.ans(n)) > 0.051) { var w = (it.wrong || []).filter(function(q){ return Math.abs(v - q.match) < 0.051; })[0]; return { msg:NQ + (w ? w.fb : it.wrongDefault) + TA }; }
    }
    var cat = MV.ans(it);
    if (cat != null) { if (!x.cat) return { skip:true, msg:"Your number is right. Now choose its category." }; if (x.cat !== cat) return { msg:NQ + it.catFb + TA }; }
    if (it.choices) {
      if (it.multi) {
        var sel = Object.keys(x.multi).filter(function(k){ return x.multi[k]; }).map(Number);
        if (sel.length < it.need) return { skip:true, msg:"Choose at least " + it.need + " reasons." };
        var good = sel.filter(function(ci){ return MV.ok(it.choices[ci]); }).length;
        if (good < it.need || good < sel.length) return { msg:NQ + it.choiceFb + TA };
      } else {
        if (x.pick == null) return { skip:true, msg:(it.nums.length ? "Your number is right. Now choose" : "Choose") + " an answer: " + lc(MV.plain(it.choiceLabel)) + "." };
        if (!MV.ok(it.choices[x.pick])) return { msg:NQ + it.choiceFb + TA };
      }
    }
    return { ok:true };
  }
  host.addEventListener("input", function(e){ var d = e.target.dataset; if (!d || !d.tn) return; ist(d.tn).vals[d.nid] = e.target.value; msgs[d.tn] = null; api.save(); });
  host.addEventListener("keydown", function(e){
    if (e.key === "Enter" && e.target.dataset && e.target.dataset.tn) { e.preventDefault(); var b = host.querySelector('[data-k="' + e.target.dataset.tn + 'chk"]'); if (b) b.click(); return; }
    var c = e.target.closest && e.target.closest("[data-ci],[data-cat]"); if (!c || c.closest(".multi")) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var sib = $$("button", c.parentNode), k = sib.indexOf(c), nb = sib[(k + d + sib.length) % sib.length]; if (nb && !nb.disabled) { nb.focus(); nb.click(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ti]"); if (!box) return;
    var it = byId(a.items, box.dataset.ti), x = ist(it.id);
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (b.dataset.cat) { x.cat = b.dataset.cat; msgs[it.id] = null; }
    else if (b.dataset.ci != null) { var ci = +b.dataset.ci; if (it.multi) x.multi[ci] = !x.multi[ci]; else x.pick = ci; msgs[it.id] = null; }
    else if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { if (!r.skip) x.tries++; msgs[it.id] = { h:r.msg, skip:!!r.skip }; }
      api.save(); MV.focusFb(repaint(it)); return;
    }
    api.save(); repaint(it);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Raj's plate (@component F2 platePicker — one starch, one protein, one vegetable; plate-method
// view with labelled sections, carbohydrate and fibre bars, tradition tags; optional kitchen card) ----------
function pt(cx, cy, r, a){ return [cx + r * Math.sin(a), cy - r * Math.cos(a)]; }       // a: radians clockwise from 12 o'clock
function wedgeD(cx, cy, r, a0, a1){ var p = pt(cx, cy, r, a0), q = pt(cx, cy, r, a1); return "M" + cx + " " + cy + " L" + f1(p[0]) + " " + f1(p[1]) + " A" + r + " " + r + " 0 " + (a1 - a0 > Math.PI ? 1 : 0) + " 1 " + f1(q[0]) + " " + f1(q[1]) + "Z"; }
function two(s){ s = String(s); if (s.length <= 11) return [s]; var m = Math.floor(s.length / 2), a = s.lastIndexOf(" ", m), b = s.indexOf(" ", m), k = a < 0 ? b : b < 0 ? a : (m - a <= b - m ? a : b); return k < 0 ? [s] : [s.slice(0, k), s.slice(k + 1)]; }
function tlines(x, y, arr, cls, dy){ var h = ""; arr.forEach(function(s, i){ h += svgT(x, y + (i - (arr.length - 1) / 2) * (dy || 13), s, cls); }); return h; }
function kcPreview(lines){
  return '<div class="dm-kcard">' + lines.map(function(l){ return /^##\s*/.test(l) ? "<h5>" + l.replace(/^##\s*/, "") + "</h5>" : /^-\s+/.test(l) ? '<p class="b">• ' + l.replace(/^-\s+/, "") + "</p>" : l ? "<p>" + l + "</p>" : ""; }).join("") + "</div>";
}
var task = (function(){
  var api = null, rg = {};
  function TK(){ return MV.C.task; }
  function row(id){ return byId(TK().rows, id); }
  function item(rid, id){ return byId(row(rid).items, id); }
  function read(){ var s = (api && api.S) || {}; return { s:item("s", s.s) ? s.s : "", p:item("p", s.p) ? s.p : "", v:item("v", s.v) ? s.v : "" }; }
  function parts(d){ return [["s", d.s], ["p", d.p], ["v", d.v]].map(function(q){ return q[1] ? item(q[0], q[1]) : null; }); }
  function tot(d){ var c = 0, f = 0; parts(d).forEach(function(x){ if (x) { c += x.carb; f += x.fib; } }); return { carb:c, fib:f }; }
  function checks(d){
    var P = parts(d), T = tot(d), full = P.every(Boolean);
    return [!!(P[2] && P[2].nsv), full && T.carb >= 45 && T.carb <= 60, full && T.fib >= 10, P.some(function(x){ return x && x.trad; })];
  }
  function keyOf(d){ return d.s + "|" + d.p + "|" + d.v; }
  function fromKey(k){ var q = k.split("|"); return { s:q[0], p:q[1], v:q[2] }; }
  function names(d){ return parts(d).map(function(x){ return x ? x.short : "?"; }).join(" + "); }
  function text(k){ var d = fromKey(k), T = tot(d); return names(d) + " (" + T.carb + " g carbohydrate, " + T.fib + " g fibre)"; }
  function optT(it){ return it.t + ' <span class="dm-tk">' + it.carb + " g carb · " + it.fib + " g fibre" + (it.trad ? " · Raj’s traditions" : "") + (it.nsv === false ? " · starchy" : "") + "</span>"; }
  function plateSVG(d){
    var P = parts(d), cx = 100, cy = 100, r = 82, h = '<circle class="dm-prim" cx="' + cx + '" cy="' + cy + '" r="' + (r + 8) + '"/>';
    var v = P[2], vc = !v ? "dm-pe" : v.nsv ? "dm-pv" : "dm-pvs";
    h += '<path class="' + vc + '" d="' + wedgeD(cx, cy, r, Math.PI, 2 * Math.PI) + '"/><path class="' + (P[0] ? "dm-ps" : "dm-pe") + '" d="' + wedgeD(cx, cy, r, 0, Math.PI / 2) + '"/><path class="' + (P[1] ? "dm-pp" : "dm-pe") + '" d="' + wedgeD(cx, cy, r, Math.PI / 2, Math.PI) + '"/>';
    h += tlines(cx - 42, cy - 8, two(v ? v.short : "vegetable?"), "dm-plt") + svgT(cx - 42, cy + 18, v ? (v.nsv ? "non-starchy" : "starchy") : "½ plate", "dm-pls");
    h += tlines(cx + 36, cy - 40, two(P[0] ? P[0].short : "starch?"), "dm-plt") + svgT(cx + 36, cy - 14, "¼ starch", "dm-pls");
    h += tlines(cx + 36, cy + 34, two(P[1] ? P[1].short : "protein?"), "dm-plt") + svgT(cx + 36, cy + 60, "¼ protein", "dm-pls");
    return h;
  }
  function paint(){
    var d = read(), pv = $("#dm-tkpv"); if (!pv) return;
    ["s", "p", "v"].forEach(function(k){ rg[k].set(d[k]); });
    var P = parts(d), T = tot(d), full = P.every(Boolean), cok = full && T.carb >= 45 && T.carb <= 60, fok = full && T.fib >= 10;
    var aria = "Raj’s plate: " + (P.some(Boolean) ? ["starch", "protein", "vegetable"].map(function(n, i){ return n + " " + (P[i] ? MV.plain(P[i].t) : "not chosen"); }).join("; ") : "empty") + ".";
    var h = '<svg class="dm-psvg" viewBox="0 0 200 200" role="img" aria-label="' + esc(aria) + '">' + plateSVG(d) + "</svg>";
    h += '<div class="dm-bar"><p><strong>Carbohydrate:</strong> ' + T.carb + " g <small>(45–60 g)</small> " + (full ? (cok ? "✓" : "✗") : "") + '</p><span class="dm-btr" aria-hidden="true"><b style="left:' + f1(45 / 90 * 100) + "%;width:" + f1(15 / 90 * 100) + '%"></b><i class="carb" style="width:' + f1(clamp(T.carb / 90, 0, 1) * 100) + '%"></i></span></div>';
    h += '<div class="dm-bar"><p><strong>Fibre:</strong> ' + T.fib + " g <small>(at least 10 g)</small> " + (full ? (fok ? "✓" : "✗") : "") + '</p><span class="dm-btr" aria-hidden="true"><b style="left:' + f1(10 / 25 * 100) + '%;width:0;border-right:0"></b><i class="fib" style="width:' + f1(clamp(T.fib / 25, 0, 1) * 100) + '%"></i></span></div>';
    h += '<ul class="dm-trad">' + P.map(function(x, i){ return x ? "<li><span>" + x.t + '</span> <span class="dm-ttag' + (x.trad ? " yes" : "") + '">' + (x.trad ? "from Raj’s food traditions" : "not from his traditions") + "</span></li>" : ""; }).join("") + "</ul>";
    h += '<p class="tiny muted">Dashed lines mark 45 g and 60 g (carbohydrate) and 10 g (fibre). <span class="hfa-model">Model values</span></p>';
    pv.innerHTML = h;
  }
  return {
    render:function(inp, pv, a){
      api = a; var s = a.S, K = TK().kitchen;
      inp.innerHTML = '<div class="dm-tin">' + ["s", "p", "v"].map(function(k){ return '<div id="tk-' + k + '"></div>'; }).join("") + "</div>";
      ["s", "p", "v"].forEach(function(k){
        var r = row(k);
        rg[k] = radios($("#tk-" + k), { label:r.t, cls:"chips", options:r.items.map(function(it){ return { id:it.id, t:optT(it) }; }), value:s[k] || "", onChange:function(v){ s[k] = v; a.save(); paint(); a.update(); } });
      });
      pv.innerHTML = '<div class="dm-tpv"><div id="dm-tkpv" aria-live="polite"></div><div class="dm-kcw"><h4 class="dm-h4">Kitchen card (optional): ' + K.title + '</h4><p class="tiny muted">Printing is turned off on this site, so the card saves as a text file.</p><div id="dm-kc"></div><details class="dm-kprev"><summary>Preview the kitchen card</summary>' + kcPreview(K.lines) + "</details></div></div>";
      MV.kitchenCardButton($("#dm-kc"), { title:K.title, file:K.file, lines:K.lines, label:K.label });
      paint();
    },
    read:read,
    valid:function(d){ return d.s && d.p && d.v ? true : "Choose one starch, one protein and one vegetable."; },
    checks:checks,
    key:keyOf,
    label:function(k){ return esc(names(fromKey(k))); },
    text:text,
    summary:function(ts){ var f = ts.found || []; return [TK().summary + ": " + (f.length ? "solved (" + f.map(text).join("; ") + ")" : "not solved yet")]; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ types:typeSorter, gl:glSet },
  task:task
});
})();
