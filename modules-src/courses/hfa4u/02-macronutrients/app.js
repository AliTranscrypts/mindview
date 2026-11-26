// HFA4U 02 Macronutrients: hero molecules, Macronutrient lab (Explore: Build benches + Measure, predictions, challenges),
// Read the fats and sugars (Part 3, F3 label lab), Energy detective (custom practice), private self check and support note
// (Reflect), "Balanced lunch box" task. Plan wording lives in content.mjs; this file adds only control labels.
(function(){
"use strict";
var $ = MV.$, esc = MV.esc, NT = MV.nutri, R = Math.PI / 180;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function f1(v){ return String(Math.round(v * 10) / 10); }
function P(p){ return f1(p[0]) + "," + f1(p[1]); }
function N(v){ v = +v; return isFinite(v) ? Math.max(0, v) : 0; }
// number typed by a student: units (%, g, kcal) and spaces are ignored; null if not a single number
function gnum(s){ var t = String(s == null ? "" : s).replace(/kcal|%|\s/gi, "").replace(/g$/i, ""); if (!t) return null; var r = MV.parseNum(t); return r && r.length === 1 ? r[0] : null; }
function pc(v){ return v == null ? "–" : MV.num(Math.round(v)) + "%"; }
function list(a){ return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
var NAME = { c:"Carbohydrate", f:"Fat", p:"Protein" }, KEY = { c:"carb", f:"fat", p:"protein" };
function line(a, b, cls){ return '<line class="' + cls + '" x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(b[0]) + '" y2="' + f1(b[1]) + '"/>'; }
function txt(x, y, s, cls, anchor){ return '<text class="' + cls + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "middle") + '">' + s + "</text>"; }

// ---------- @component radioGroup (copied from HFA4U 01 / MHF4U 35; the label may be a function) ----------
//   Segmented control or chip row as a real radio group (arrow keys, roving tabindex).
//   radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange}) -> {set, get, off(ids), repaint}
//   Use a fresh host for every call: it adds its listeners to host.
function radios(host, o){
  var val = String(o.value), offs = {};
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), lab = typeof o.label === "function" ? o.label() : o.label;
    host.innerHTML = '<span class="mn-rgw">' + (lab ? '<span class="mn-rgl">' + lab + "</span>" : "") + '<span class="mn-rg ' + (o.cls === "chips" ? "mn-chipset" : "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || lab || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && i === 0) ? 0 : -1) + '" data-rg="' + x.id + '"' + (offs[x.id] ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (offs[id]) return; var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }).filter(function(x){ return !offs[x]; }); if (!ids.length) return;
    choose(ids[(ids.indexOf(val) + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, repaint:paint,
    off:function(ids){ var n = {}; (ids || []).forEach(function(x){ n[x] = 1; }); if (JSON.stringify(n) !== JSON.stringify(offs)) { offs = n; paint(); } } };
}

// ---------- @component molecule sketches (module-specific SVG: sugar rings, zigzag fatty-acid tails, amino-acid beads) ----------
//   ring(x, y, r, kind, label): glucose hexagon, galactose hexagon with a corner mark, fructose pentagon (carbohydrate orange).
//   zig(x, y, L, n, h0, bends): zigzag chain points; bends[s] (degrees) turns the heading after segment s.
//   tailPts(tail, kink, sign): 18-carbon tail from the carboxyl end (C18, joins glycerol) to the omega carbon (C1);
//     tail[k - 1] is the bond between omega-carbons k and k + 1 (0 single, 1 cis, 2 trans); cis bonds bend the chain by 34° × kink.
//   fit(lists, W, H, pad, maxS): uniform scale + centring of point lists into a W × H box -> point mapper.
function poly(cx, cy, r, n, a0){ var s = []; for (var i = 0; i < n; i++) { var a = (a0 + i * 360 / n) * R; s.push(P([cx + r * Math.cos(a), cy + r * Math.sin(a)])); } return s.join(" "); }
function ring(x, y, r, k, lab){
  var h = k === "fru" ? '<polygon class="mn-ring" points="' + poly(x, y, r * 1.05, 5, -90) + '"/>' : '<polygon class="mn-ring" points="' + poly(x, y, r, 6, 0) + '"/>';
  if (k === "gal") h += '<circle class="mn-gal" cx="' + f1(x + r * 0.5) + '" cy="' + f1(y - r * 0.87) + '" r="' + f1(r * 0.22) + '"/>';
  return h + (lab ? txt(x, y + 3.5, lab, "mn-rt") : "");
}
function zig(x, y, L, n, h0, bends){
  var pts = [[x, y]], h = h0 * R;
  for (var s = 0; s < n; s++) { var d = h + (s % 2 ? -30 : 30) * R; x += L * Math.cos(d); y += L * Math.sin(d); pts.push([x, y]); if (bends && bends[s]) h += bends[s] * R; }
  return pts;
}
function tailPts(tail, kink, sign){
  var bends = {}; for (var s = 0; s < 17; s++) if (tail[16 - s] === 1) bends[s] = sign * 34 * kink;
  return zig(0, 0, 1, 17, 0, bends);
}
function fit(lists, W, H, pad, maxS){
  var xs = [], ys = []; lists.forEach(function(ps){ ps.forEach(function(p){ xs.push(p[0]); ys.push(p[1]); }); });
  var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
  var s = Math.min((W - 2 * pad) / Math.max(x1 - x0, 1e-6), (H - 2 * pad) / Math.max(y1 - y0, 1e-6), maxS);
  var ox = (W - (x1 - x0) * s) / 2 - x0 * s, oy = (H - (y1 - y0) * s) / 2 - y0 * s;
  return function(p){ return [ox + p[0] * s, oy + p[1] * s]; };
}
function dbl(a, b, d){ var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L * d, ny = dx / L * d; return [[a[0] + dx * 0.2 + nx, a[1] + dy * 0.2 + ny], [b[0] - dx * 0.2 + nx, b[1] - dy * 0.2 + ny]]; }
function tailSVG(Q, tail, cls){
  var h = '<polyline class="' + cls + '" points="' + Q.map(P).join(" ") + '"/>';
  for (var s = 0; s < 17; s++) { var b = tail[16 - s]; if (b) { var q = dbl(Q[s], Q[s + 1], s % 2 ? 4.5 : -4.5); h += line(q[0], q[1], "mn-db"); } }
  return h;
}
function enzyme(x, y, r){ var a = 32 * R; return '<path class="mn-enz" d="M' + f1(x) + " " + f1(y) + "L" + f1(x + r * Math.sin(a)) + " " + f1(y + r * Math.cos(a)) + "A" + r + " " + r + " 0 1 0 " + f1(x - r * Math.sin(a)) + " " + f1(y + r * Math.cos(a)) + 'Z"/>' + txt(x + r + 6, y + 4, "enzyme", "mn-enzt", "start"); }

// ---------- hero (storyboard: starch clicks together, a tail kinks, beads link and fold, "Shape → function.") ----------
function heroSVG(st){
  var h = "", cy = 84, i;
  // 1. glucose hexagons click together into a starch chain
  var sp = lerp(44, 30, st.a), r = 11.5;
  for (i = 0; i < 4; i++) {
    var x = 80 + (i - 1.5) * sp;
    if (i < 3 && st.a > 0.7) { var x2 = 80 + (i - 0.5) * sp; h += '<polyline class="mn-link" style="opacity:' + f1((st.a - 0.7) / 0.3) + '" points="' + P([x + r, cy]) + " " + P([(x + x2) / 2, cy + 6]) + " " + P([x2 - r, cy]) + '"/>'; }
    h += ring(x, cy, r, "glc", "");
  }
  // 2. glycerol "E" with three tails; the bottom tail gains a cis double bond and bends
  h += '<polyline class="mn-gly" points="200,54 192,54 192,114 200,114"/>' + line([192, 84], [200, 84], "mn-gly");
  [54, 84, 114].forEach(function(y, k){
    var pts = zig(200, y, 11, 9, 0, k === 2 ? { 4:40 * st.b } : null);
    h += '<polyline class="mn-tl" points="' + pts.map(P).join(" ") + '"/>';
    if (k === 2 && st.b > 0) { var q = dbl(pts[4], pts[5], 4); h += '<line class="mn-db" style="opacity:' + f1(st.b) + '" x1="' + f1(q[0][0]) + '" y1="' + f1(q[0][1]) + '" x2="' + f1(q[1][0]) + '" y2="' + f1(q[1][1]) + '"/>'; }
  });
  if (st.b > 0.85) h += txt(246, 36, "liquid oil", "mn-hnote");
  // 3. beads link into a chain, which folds
  var u = clamp(st.c * 2, 0, 1), v = clamp(st.c * 2 - 1, 0, 1), FO = [[-30, -10], [-15, -20], [3, -22], [20, -13], [24, 5], [8, 16], [-11, 13]], B = [];
  for (i = 0; i < 7; i++) B.push([lerp(400 + (i - 3) * lerp(24, 17, u), 400 + FO[i][0], v), lerp(cy, cy + FO[i][1], v)]);
  if (u > 0.6) for (i = 0; i < 6; i++) h += '<line class="mn-plink" style="opacity:' + f1((u - 0.6) / 0.4) + '" x1="' + f1(B[i][0]) + '" y1="' + f1(B[i][1]) + '" x2="' + f1(B[i + 1][0]) + '" y2="' + f1(B[i + 1][1]) + '"/>';
  B.forEach(function(b, k){ h += '<circle class="mn-bd' + (k % 3 === 1 ? " e" : "") + '" cx="' + f1(b[0]) + '" cy="' + f1(b[1]) + '" r="7"/>'; });
  // labels and energy
  [[80, "Carbohydrate", "(starch)", "4 kcal/g", "c"], [240, "Lipid", "(triglyceride)", "9 kcal/g", "f"], [400, "Protein", "(amino-acid chain)", "4 kcal/g", "p"]].forEach(function(L){
    h += txt(L[0], 168, L[1], "mn-hl") + txt(L[0], 188, L[2], "mn-hs") + txt(L[0], 220, L[3], "mn-hk mn-k" + L[4]);
  });
  return h;
}
function hero(f){
  var host = $("#mn-hero"); if (!host) return;
  var H = MV.C.hero, st = { a:0, b:0, c:0 };
  host.innerHTML = '<svg class="mn-hsvg" viewBox="0 16 480 214" role="img" aria-label="' + esc(H.aria) + '"></svg>';
  var svg = host.firstChild;
  function draw(){ svg.innerHTML = heroSVG(st); }
  function cap(){ if (f.cap) { f.cap.textContent = H.caption; f.cap.classList.add("mn-cap"); } }
  if (MV.reduceMotion) { st = { a:1, b:1, c:1 }; draw(); cap(); return; }
  draw();
  MV.wait(500, function(){ MV.tween({ dur:1300, step:function(t){ st.a = t; draw(); }, done:function(){
    MV.wait(300, function(){ MV.tween({ dur:1300, step:function(t){ st.b = t; draw(); }, done:function(){
      MV.wait(300, function(){ MV.tween({ dur:1800, step:function(t){ st.c = t; draw(); }, done:function(){ MV.wait(300, cap); } }); });
    } }); });
  } }); });
}

// ---------- reflect: support note under the journal, then the optional private self check (nothing saved) ----------
function addReflect(){
  var j = $("#journal"); if (!j || $("#mn-support")) return;
  var RF = MV.C.reflect, X = RF.self, sh = j.closest(".sheet");
  var sup = document.createElement("div"); sup.className = "sheet mv-block"; sup.id = "mn-support"; sup.innerHTML = RF.support;
  var me = document.createElement("div"); me.className = "sheet"; me.id = "mn-self";
  me.innerHTML = '<h3><span class="hfa-private">Optional and private</span> ' + X.title + "</h3><p>" + X.intro + '</p><p class="tiny muted">' + X.privacy + "</p>" +
    '<details class="alg"><summary>' + X.open + '</summary><fieldset class="mn-selfset"><legend class="vh">Sources in your lunch</legend>' +
    X.sources.map(function(s, i){ return '<label class="mn-check"><input type="checkbox" data-src="' + i + '"> ' + s + "</label>"; }).join("") + "</fieldset>" +
    '<div class="numrow"><label for="mn-selfg">' + X.fibreLabel + '</label><input class="numin" id="mn-selfg" type="text" inputmode="decimal" autocomplete="off"><span class="m">g</span></div>' +
    '<div class="mn-selfbar" aria-hidden="true"><span class="mn-selffill"></span><span class="mn-selfref">' + X.ref + ' g a day</span></div>' +
    '<p class="tiny" id="mn-selfmsg" aria-live="polite"></p><p class="tiny muted">' + X.refText + '</p><p class="tiny"><strong>' + X.advice + "</strong></p></details>";
  sh.parentNode.insertBefore(sup, sh.nextSibling); sup.parentNode.insertBefore(me, sup.nextSibling);
  function upd(){
    var g = gnum($("#mn-selfg").value), has = [], not = [];
    MV.$$("[data-src]", me).forEach(function(c){ (c.checked ? has : not).push(MV.plain(X.sources[+c.dataset.src]).toLowerCase()); });
    $(".mn-selffill", me).style.width = (g == null ? 0 : clamp(g / X.ref, 0, 1) * 100) + "%";
    $("#mn-selfmsg").textContent = (has.length ? "Ticked: " + list(has) + ". " : "") + (not.length && has.length ? "Not ticked: " + list(not) + ". " : "") + (g != null ? "About " + MV.num(g) + " g of fibre, out of a whole-day reference of about " + X.ref + " g." : "");
  }
  me.addEventListener("input", upd); me.addEventListener("change", upd);
}

// ---------- Explore: Macronutrient lab (Mode 1 Build: three benches; Mode 2 Measure) ----------
function explore(host, api){
  addReflect();
  var D = api.content, S = api.S, CH = {}, msg = { carb:"", fat:"", prot:"" }, stop = null;
  D.challenges.forEach(function(c){ CH[c.id] = c.msgs; });
  var FD = MV.C.task.foods.concat([D.candy]), FOOD = {}, PL = {}, AA = {};
  FD.forEach(function(x){ FOOD[x.id] = x; }); D.plant.forEach(function(x){ PL[x.id] = x; }); D.amino.forEach(function(x){ AA[x.id] = x; });
  function zeros(){ var a = []; for (var i = 0; i < 17; i++) a.push(0); return a; }
  function food(id){ var x = FOOD[id]; return { name:x.t, id:id, c:String(x.c), f:String(x.f), p:String(x.p), fi:String(x.fi) }; }
  function preset(id){ return D.fatPresets[id].tails.map(function(cis){ var t = zeros(); cis.forEach(function(k){ t[k - 1] = 1; }); return t; }); }
  S.mode = S.mode || "build"; S.bench = S.bench || "carb";
  S.carb = S.carb || { chain:["glc", "glc", "glc", "glc"], bond:"a", branch:"light" };
  S.fat = S.fat || { tail:zeros(), sel:9, slots:[null, null, null] };
  S.prot = S.prot || { chain:["met", "lys", "gly", "ser"], fold:false, foods:["rice"] };
  S.meas = S.meas || { cmp:false, age:"teen", A:food("wrap"), B:food("apple"), ans:{ c:"", f:"", p:"" } };
  var fx = { enz:null, cut:0, kink:1, gap:null, reveal:1, fib:1, fold:S.prot.fold ? 1 : 0 };

  host.innerHTML = '<div class="mn-lab"><div class="mn-main" data-mv="graph"><div class="mn-top"><div id="mn-mode"></div><div id="mn-bsel"></div></div>' +
    '<p class="banner" data-mv="banner" aria-live="polite"></p><div id="mn-b-carb"></div><div id="mn-b-fat"></div><div id="mn-b-prot"></div><div id="mn-meas"></div></div>' +
    '<div class="mn-side"><h4 class="mn-h4">Readout</h4><dl class="read" id="mn-read" aria-live="polite"></dl></div></div>';
  var modeRG = radios($("#mn-mode"), { label:"Mode", options:[{ id:"build", t:"1. Build" }, { id:"measure", t:"2. Measure" }], value:S.mode, onChange:function(v){ S.mode = v; commit(); } });
  var benchRG = radios($("#mn-bsel"), { label:"Bench", options:[{ id:"carb", t:"Carbohydrate" }, { id:"fat", t:"Fat" }, { id:"prot", t:"Protein" }], value:S.bench, onChange:function(v){ S.bench = v; commit(); } });

  // ===== carbohydrate bench =====
  var cb = $("#mn-b-carb");
  cb.innerHTML = '<p class="how">Tap a tile to join it to the chain. Two tiles make a double sugar; three or more glucose tiles make a long chain.</p>' +
    '<div class="mn-svgbox"><svg class="mn-csvg" id="mn-csvg" role="img"></svg></div>' +
    '<div class="mn-tiles" role="group" aria-label="Sugar tiles">' + ["glc", "fru", "gal"].map(function(k){
      return '<button type="button" class="mn-tile" data-tile="' + k + '" data-k="tile' + k + '"><svg viewBox="0 0 30 30" aria-hidden="true">' + ring(15, 15, 11, k, "") + "</svg>" + D.sugars[k].t + "</button>"; }).join("") + "</div>" +
    '<div class="mn-ctl"><div id="mn-bond"></div><div id="mn-branch"></div></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="mn-enz">Test with an enzyme</button><button type="button" class="btn ghost sm" id="mn-undo">Remove the last tile</button><button type="button" class="btn ghost sm" id="mn-cclr">Clear</button></div><p class="tiny mn-msg" id="mn-cmsg" aria-live="polite"></p>';
  var bondRG = radios($("#mn-bond"), { label:"Bond type", options:[{ id:"a", t:"α (digestible)" }, { id:"b", t:"β (fibre)" }], value:S.carb.bond, onChange:function(v){ S.carb.bond = v; fx.cut = 0; msg.carb = ""; commit(); } });
  var branchRG = radios($("#mn-branch"), { label:"Branching", options:[{ id:"light", t:"Light (starch)" }, { id:"heavy", t:"Heavy (glycogen)" }], value:S.carb.branch, onChange:function(v){ S.carb.branch = v; msg.carb = ""; commit(); } });
  function carbInfo(){
    var ch = S.carb.chain, n = ch.length;
    if (!n) return { name:"Empty bench", kind:"–", note:"Tap a tile to start.", cut:null, pieces:"none" };
    var cnt = {}; ch.forEach(function(k){ cnt[k] = (cnt[k] || 0) + 1; });
    var pieces = Object.keys(cnt).map(function(k){ return cnt[k] + " " + D.sugars[k].t.toLowerCase(); }).join(" + ");
    if (n === 1) return { name:D.sugars[ch[0]].t, kind:"single sugar", note:D.sugars[ch[0]].note, cut:null, pieces:pieces };
    if (n === 2) { var pr = D.pairs[ch.slice().sort().join("+")]; return pr ? { name:pr.t, kind:"double sugar", note:pr.note, cut:true, pieces:pieces } : { name:"Not a food double sugar", kind:"two single sugars", note:"Try glucose with fructose, galactose or glucose.", cut:null, pieces:pieces }; }
    var id = S.carb.bond === "b" ? "cellulose" : S.carb.branch === "heavy" ? "glycogen" : "starch", c = D.chains[id];
    return { name:c.t, kind:"long chain", note:c.note, cut:S.carb.bond !== "b", pieces:pieces, id:id };
  }
  function chainMode(){ var ch = S.carb.chain; return ch.length >= 3 && ch.every(function(k){ return k === "glc"; }); }
  var CY = 82, CSP = 50, CR = 16, CX0 = 46;
  function drawCarb(){
    var ch = S.carb.chain, n = ch.length, chain = chainMode(), beta = chain && S.carb.bond === "b", info = carbInfo(), h = "";
    var W = Math.max(380, CX0 * 2 + (n - 1) * CSP + 40), br = chain && !beta, Hh = br ? 178 : 134, x0 = (W - (n - 1) * CSP) / 2 - (br ? 20 : 0);
    var X = function(i){ return x0 + i * CSP + (i >= 1 ? fx.cut * 18 : 0); };
    if (chain && !beta && n >= 3) (S.carb.branch === "heavy" ? [1, 3, 5, 7] : [2]).forEach(function(i){
      if (i >= n) return; var bx = X(i), by = CY + 52;
      h += line([bx, CY + CR], [bx, by - 11], "mn-link") + ring(bx, by, 11, "glc", "") + line([bx + 11, by], [bx + 27, by], "mn-link") + ring(bx + 38, by, 11, "glc", "");
    });
    for (var i = 0; i < n - 1; i++) {
      var xa = X(i) + CR, xb = X(i + 1) - CR, xm = (xa + xb) / 2, dy = n === 2 ? 6 : beta ? (i % 2 ? -9 : 9) : 9;
      if (i === 0 && fx.cut > 0) h += '<polyline class="mn-link" points="' + P([xa, CY]) + " " + P([xa + 7, CY + dy * 0.8]) + '"/><polyline class="mn-link" points="' + P([xb - 7, CY + dy * 0.8]) + " " + P([xb, CY]) + '"/>';
      else h += '<polyline class="mn-link" points="' + P([xa, CY]) + " " + P([xm, CY + dy]) + " " + P([xb, CY]) + '"/>';
      if (chain) h += txt(xm, CY + dy + (dy > 0 ? 15 : -7), beta ? "β" : "α", "mn-bl");
    }
    ch.forEach(function(k, i){ h += ring(X(i), CY, CR, k, D.sugars[k].ab); });
    if (!n) h += txt(W / 2, CY + 4, "Tap a tile below to start.", "mn-empty");
    if (fx.enz) { h += enzyme(fx.enz.x, fx.enz.y, 13); if (fx.enz.no) h += txt(fx.enz.x - 22, fx.enz.y + 6, "✗", "mn-no"); }
    var svg = $("#mn-csvg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + Hh); svg.style.maxWidth = Math.round(W * 1.3) + "px";
    svg.setAttribute("aria-label", "Carbohydrate bench: " + (n ? info.pieces + (n > 1 ? (chain ? " joined by " + (beta ? "β" : "α") + " bonds" : " joined") : "") + ". " + info.name + "." : "empty."));
    svg.innerHTML = h;
  }
  function paintCarb(){
    drawCarb();
    var chain = chainMode(), n = S.carb.chain.length;
    bondRG.set(S.carb.bond); branchRG.set(S.carb.branch);
    bondRG.off(chain ? [] : ["a", "b"]); branchRG.off(chain && S.carb.bond === "a" ? [] : ["light", "heavy"]);
    $("#mn-enz").disabled = n < 2 || carbInfo().cut == null; $("#mn-undo").disabled = !n; $("#mn-cclr").disabled = !n;
    $("#mn-cmsg").textContent = msg.carb || (chain ? "" : "The bond and branching toggles work on chains of three or more glucose tiles.");
  }
  function enzymeTest(done){
    var info = carbInfo(); if (info.cut == null) { if (done) done(); return; }
    cancelAnim(); var n = S.carb.chain.length, br = chainMode() && S.carb.bond === "a", tx = (Math.max(380, CX0 * 2 + (n - 1) * CSP + 40) - (n - 1) * CSP) / 2 - (br ? 20 : 0) + CSP / 2, y0 = CY - 66;
    fx.cut = 0; fx.enz = { x:tx, y:y0, no:false }; msg.carb = "";
    $("#mn-enz").disabled = true;
    stop = MV.tween({ dur:900, step:function(t){ fx.enz.y = y0 + 36 * t; drawCarb(); }, done:function(){
      if (info.cut) stop = MV.tween({ dur:700, step:function(t){ fx.cut = t; drawCarb(); }, done:function(){ fin(true); } });
      else { fx.enz.no = true; stop = MV.tween({ dur:700, step:function(t){ fx.enz.y = y0 + 36 - 36 * t; drawCarb(); }, done:function(){ fin(false); } }); }
    } });
    function fin(c){
      stop = null;
      msg.carb = c ? (S.carb.chain.length === 2 ? "The enzyme split it into single sugars." : "The enzyme cut the bond: glucose is released for fuel.") : "The enzyme bounced off: human enzymes can’t break β-bonds. That’s fibre.";
      paint(); if (done) done();
    }
  }
  cb.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var ch = S.carb.chain;
    if (b.dataset.tile) {
      var k = b.dataset.tile;
      cancelAnim(); fx.cut = 0;
      if (ch.length >= 8) msg.carb = "The bench holds 8 tiles. Remove one or clear the bench.";
      else if (ch.length >= 2 && (k !== "glc" || !ch.every(function(x){ return x === "glc"; }))) msg.carb = "Long chains in this lab are glucose only: starch, glycogen and fibre. Clear the bench, or add glucose.";
      else { ch.push(k); msg.carb = ""; }
      commit(); return;
    }
    if (b.id === "mn-undo") { cancelAnim(); fx.cut = 0; ch.pop(); msg.carb = ""; commit(); return; }
    if (b.id === "mn-cclr") { cancelAnim(); fx.cut = 0; S.carb.chain = []; msg.carb = ""; commit(); return; }
    if (b.id === "mn-enz") enzymeTest();
  });

  // ===== fat bench =====
  var fb = $("#mn-b-fat"), BT = ["single", "cis double", "trans double"];
  fb.innerHTML = '<p class="how">Tap a carbon–carbon bond, then choose single, cis or trans. Bond numbers count from the omega (methyl) end.</p>' +
    '<div class="mn-tailbox"><div class="mn-tail"><svg id="mn-tsvg" viewBox="0 0 640 210" role="img"></svg><div id="mn-tbtns"></div></div></div>' +
    '<div id="mn-btype" class="mn-ctl"></div><p class="tiny mn-msg" id="mn-fmsg" aria-live="polite"></p>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="mn-attach">Attach this tail to glycerol</button><button type="button" class="btn ghost sm" id="mn-tsat">Make the tail saturated</button></div>' +
    '<h4 class="mn-h4">Triglyceride: glycerol and up to three tails</h4><div class="mn-svgbox"><svg id="mn-gsvg" class="mn-gsvg" viewBox="0 0 640 250" role="img"></svg></div><p class="mn-state" id="mn-tgst"></p>' +
    '<div class="mn-slots" id="mn-slots"></div><div class="q-actions">' + Object.keys(D.fatPresets).map(function(k){ return '<button type="button" class="btn ghost sm" data-preset="' + k + '">' + D.fatPresets[k].t + "</button>"; }).join("") + "</div>";
  var typeRG = radios($("#mn-btype"), { label:function(){ return "Bond at omega-" + S.fat.sel + ":"; }, options:[{ id:"0", t:"Single" }, { id:"1", t:"Cis double" }, { id:"2", t:"Trans double" }], value:String(S.fat.tail[S.fat.sel - 1]),
    onChange:function(v){
      var k = S.fat.sel, t = S.fat.tail;
      if (+v && (t[k - 2] || t[k])) { msg.fat = "Two double bonds can’t share a carbon here. Leave a single bond between them."; typeRG.set(String(t[k - 1])); paintFat(); return; }
      t[k - 1] = +v; msg.fat = ""; commit();
    } });
  function tailInfo(t){
    var cis = [], tr = []; t.forEach(function(b, i){ if (b === 1) cis.push(i + 1); else if (b === 2) tr.push(i + 1); });
    var all = cis.concat(tr).sort(function(a, b){ return a - b; });
    return { cis:cis, tr:tr, all:all, liquid:cis.length > 0 };
  }
  function tailDesc(t){
    var I = tailInfo(t);
    if (!I.all.length) return "18 carbons · no double bonds · saturated · solid";
    var p = ["18 carbons"];
    if (I.cis.length) p.push(I.cis.length + " cis double bond" + (I.cis.length > 1 ? "s" : ""));
    if (I.tr.length) p.push(I.tr.length + " trans double bond" + (I.tr.length > 1 ? "s" : ""));
    return p.concat(["first at omega-" + I.all[0], I.liquid ? "liquid" : "solid"]).join(" · ");
  }
  function tailSR(t){
    var I = tailInfo(t);
    if (!I.all.length) return "18 carbons; no double bonds (saturated, straight chain)";
    return "18 carbons; " + [I.cis.length ? "cis double bond" + (I.cis.length > 1 ? "s" : "") + " at omega-" + I.cis.join(", ") : "", I.tr.length ? "trans double bond" + (I.tr.length > 1 ? "s" : "") + " at omega-" + I.tr.join(", ") : ""].filter(Boolean).join("; ");
  }
  function tailShort(t){ var I = tailInfo(t); return !I.all.length ? "saturated" : [I.cis.length ? "cis at omega-" + I.cis.join(", ") : "", I.tr.length ? "trans at omega-" + I.tr.join(", ") : ""].filter(Boolean).join("; "); }
  function tgInfo(){
    var sl = S.fat.slots.filter(Boolean), kinked = sl.filter(function(t){ return tailInfo(t).liquid; }).length, sat = sl.filter(function(t){ return !tailInfo(t).all.length; }).length;
    return { n:sl.length, kinked:kinked, sat:sat, loose:sl.length > 0 && kinked * 2 > sl.length };
  }
  function drawTail(){
    var t = S.fat.tail, Pp = tailPts(t, 1, -1), m = fit([Pp], 640, 210, 40, 32), Q = Pp.map(m), h = tailSVG(Q, t, "mn-cc"), bh = "";
    var ux = Q[17][0] - Q[16][0], uy = Q[17][1] - Q[16][1], uL = Math.hypot(ux, uy) || 1;
    h += '<circle class="mn-cend" cx="' + f1(Q[0][0]) + '" cy="' + f1(Q[0][1]) + '" r="4"/>' + txt(Q[0][0] - 10, Q[0][1] - 4, "joins", "mn-endt", "end") + txt(Q[0][0] - 10, Q[0][1] + 11, "glycerol", "mn-endt", "end") +
      txt(Q[17][0] + ux / uL * 34, Q[17][1] + uy / uL * 34 + 4, "omega end", "mn-endt");
    for (var s = 0; s < 17; s++) {
      var k = 17 - s, b = t[k - 1], a = Q[s], c = Q[s + 1], mx = (a[0] + c[0]) / 2, my = (a[1] + c[1]) / 2, dx = c[0] - a[0], dy = c[1] - a[1], L = Math.hypot(dx, dy) || 1, o = s % 2 ? -17 : 17;
      mx += -dy / L * o; my += dx / L * o;
      bh += '<button type="button" class="mn-bb' + (b ? " d" + b : "") + '" style="left:' + f1(mx / 6.4) + "%;top:" + f1(my / 2.1) + '%" data-bond="' + k + '" data-k="bond' + k + '" aria-pressed="' + (k === S.fat.sel) + '" aria-label="Bond at omega-' + k + ": " + BT[b] + '">' + k + "</button>";
    }
    $("#mn-tsvg").innerHTML = h; $("#mn-tsvg").setAttribute("aria-label", "Fatty-acid tail: " + tailSR(t) + ".");
    var bx = $("#mn-tbtns"); MV.keepFocus(bx, function(){ bx.innerHTML = bh; });
  }
  function drawTG(){
    var sl = S.fat.slots, info = tgInfo(), g = fx.gap != null ? fx.gap : (info.loose ? 1 : 0), sp = lerp(0.62, 1.2, g), SG = [-1, 0.5, 1], lists = [], parts = [];
    sl.forEach(function(t, i){
      var y = (i - 1) * sp, pts = t ? zig(0.55, y, 1, 17, 0, (function(){ var b = {}; for (var s = 0; s < 17; s++) if (t[16 - s] === 1) b[s] = SG[i] * 34 * fx.kink; return b; })()) : [[0.55, y], [3.4, y]];
      lists.push(pts); parts.push({ t:t, pts:pts, y:y });
    });
    lists.push([[-0.6, -sp - 0.4], [0, sp + 0.4]]);
    var m = fit(lists, 640, 250, 22, 34), h = "", top = m([0, -sp]), bot = m([0, sp]);
    h += '<polyline class="mn-gly" points="' + P(m([0.55, -sp])) + " " + P(top) + " " + P(bot) + " " + P(m([0.55, sp])) + '"/>' + line(m([0, 0]), m([0.55, 0]), "mn-gly") + txt(top[0] - 8, (top[1] + bot[1]) / 2 + 4, "glycerol", "mn-endt", "end");
    parts.forEach(function(q){
      var Q = q.pts.map(m);
      if (q.t) h += tailSVG(Q, q.t, "mn-cc");
      else h += line(Q[0], Q[1], "mn-slot0") + txt(Q[1][0] + 6, Q[1][1] + 4, "empty", "mn-endt", "start");
    });
    var svg = $("#mn-gsvg"); svg.innerHTML = h;
    svg.setAttribute("aria-label", "Triglyceride: glycerol with " + sl.map(function(t, i){ return "tail " + (i + 1) + " " + (t ? tailSR(t) : "empty"); }).join("; ") + ".");
  }
  function tgState(){ var I = tgInfo(); return !I.n ? "Attach up to three tails." : I.n + " tail" + (I.n > 1 ? "s" : "") + " · " + I.sat + " saturated · packs " + (I.loose ? "loosely: liquid oil" : "tightly: solid fat"); }
  function paintFat(){
    drawTail(); drawTG();
    typeRG.set(String(S.fat.tail[S.fat.sel - 1])); typeRG.repaint();
    $("#mn-fmsg").textContent = msg.fat;
    $("#mn-tgst").textContent = tgState();
    $("#mn-attach").disabled = S.fat.slots.every(Boolean);
    var sl = $("#mn-slots");
    MV.keepFocus(sl, function(){ sl.innerHTML = S.fat.slots.map(function(t, i){ return '<div class="mn-slot"><span><strong>Tail ' + (i + 1) + ":</strong> " + (t ? tailShort(t) : "empty") + "</span>" + (t ? '<button type="button" class="btn ghost sm" data-rm="' + i + '" data-k="rm' + i + '">Remove</button>' : "") + "</div>"; }).join(""); });
  }
  fb.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.bond) { S.fat.sel = +b.dataset.bond; msg.fat = ""; api.save(); paintFat(); var nb = $('#mn-tbtns [data-bond="' + S.fat.sel + '"]'); if (nb) nb.focus({ preventScroll:true }); return; }
    if (b.id === "mn-attach") { var i = S.fat.slots.indexOf(null); if (i >= 0) { S.fat.slots[i] = S.fat.tail.slice(); msg.fat = "Tail attached to glycerol as tail " + (i + 1) + "."; } commit(); return; }
    if (b.id === "mn-tsat") { S.fat.tail = zeros(); msg.fat = ""; commit(); return; }
    if (b.dataset.rm != null) { S.fat.slots[+b.dataset.rm] = null; msg.fat = ""; commit(); var a = $("#mn-attach"); if (a) a.focus({ preventScroll:true }); return; }
    if (b.dataset.preset) { cancelAnim(); S.fat.slots = preset(b.dataset.preset); msg.fat = ""; commit(); }
  });
  // arrow keys move along the bonds
  $("#mn-tbtns").addEventListener("keydown", function(e){
    var d = e.key === "ArrowRight" ? -1 : e.key === "ArrowLeft" ? 1 : 0; if (!d) return;
    e.preventDefault(); S.fat.sel = clamp(S.fat.sel + d, 1, 17); paintFat(); var nb = $('#mn-tbtns [data-bond="' + S.fat.sel + '"]'); if (nb) nb.focus({ preventScroll:true });
  });

  // ===== protein bench =====
  var pb = $("#mn-b-prot");
  pb.innerHTML = '<h4 class="mn-h4">Amino-acid beads</h4><p class="how">Tap a bead to link it to the chain. <b class="mn-ekey">E</b> marks the nine essential amino acids: the body can’t make them, so they must come from food.</p>' +
    '<div class="mn-beads" role="group" aria-label="Amino-acid beads">' + D.amino.map(function(a){ return '<button type="button" class="mn-bead' + (a.e ? " e" : "") + '" data-aa="' + a.id + '" data-k="aa' + a.id + '" aria-label="' + esc(a.t + (a.e ? ", essential" : ", non-essential")) + '" title="' + esc(a.t) + '">' + a.ab + (a.e ? '<b aria-hidden="true">E</b>' : "") + "</button>"; }).join("") + "</div>" +
    '<div class="mn-svgbox"><svg id="mn-psvg" viewBox="0 0 640 150" role="img"></svg></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="mn-fold" aria-pressed="false">Fold the chain</button><button type="button" class="btn ghost sm" id="mn-pclr">Clear the chain</button></div><p class="tiny mn-msg" id="mn-pmsg" aria-live="polite"></p>' +
    '<h4 class="mn-h4">Plant foods <span class="hfa-model">Model data</span></h4><p class="how">Choose one or two plant foods. Each bar compares an essential amino acid with the reference pattern (100%). Two foods show the pair in equal parts.</p>' +
    '<div class="mn-foods" role="group" aria-label="Plant foods" id="mn-pfoods"></div><div id="mn-aab" class="mn-aab"></div><p class="tiny" id="mn-pnote" aria-live="polite"></p>';
  function beadPos(i, n, f){
    var s = [44 + i * 50, 75], r = i < 6 ? [70 + i * 96, 42] : [70 + (11 - i) * 96, 112];
    if (n <= 6) r = [lerp(70, 550, n > 1 ? i / (n - 1) : 0.5), 42 + 70 * Math.sin(Math.PI * (n > 1 ? i / (n - 1) : 0))];
    return [lerp(s[0], r[0], f), lerp(s[1], r[1], f)];
  }
  function drawChain(){
    var ch = S.prot.chain, n = ch.length, h = "", pts = ch.map(function(_, i){ return beadPos(i, n, fx.fold); });
    for (var i = 0; i < n - 1; i++) h += line(pts[i], pts[i + 1], "mn-plink");
    ch.forEach(function(id, i){ var a = AA[id]; h += '<circle class="mn-bd' + (a.e ? " e" : "") + '" cx="' + f1(pts[i][0]) + '" cy="' + f1(pts[i][1]) + '" r="17"/>' + txt(pts[i][0], pts[i][1] + 4, a.ab, "mn-bt"); });
    if (!n) h += txt(320, 80, "Tap beads above to build a chain.", "mn-empty");
    var svg = $("#mn-psvg"); svg.innerHTML = h;
    svg.setAttribute("aria-label", n ? "Protein chain of " + n + " amino acids" + (S.prot.fold ? ", folded" : "") + ": " + ch.map(function(id){ return AA[id].t; }).join(", ") + "." : "Empty protein chain.");
  }
  function aaVals(ids){ var f = ids.map(function(id){ return PL[id]; }); return f.length ? D.essential.map(function(_, j){ var s = 0; f.forEach(function(x){ s += x.aa[j]; }); return s / f.length; }) : null; }
  function limiting(v){ var lo = Infinity, li = -1; (v || []).forEach(function(x, j){ if (x < lo) { lo = x; li = j; } }); return lo < 100 ? li : -1; }
  function foodLow(id){ var x = PL[id]; if (x.k === "leafy") return x.t + ": too low in protein to count."; var li = limiting(x.aa); return x.t + ": " + (li < 0 ? "complete." : "low in " + AA[D.essential[li]].t.toLowerCase() + "."); }
  function paintProt(){
    drawChain();
    var fd = $("#mn-pfoods");
    MV.keepFocus(fd, function(){ fd.innerHTML = D.plant.map(function(x){ var on = S.prot.foods.indexOf(x.id) >= 0; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-pf="' + x.id + '" data-k="pf' + x.id + '" aria-pressed="' + on + '">' + x.t + "</button>"; }).join(""); });
    var v = aaVals(S.prot.foods), box = $("#mn-aab");
    if (!v) box.innerHTML = '<p class="muted tiny">Choose a plant food to see its amino-acid bars.</p>';
    else box.innerHTML = '<p class="mn-aah">' + S.prot.foods.map(function(id){ return PL[id].t; }).join(" + ") + (S.prot.foods.length > 1 ? " (equal parts)" : "") + "</p>" + D.essential.map(function(e, j){
      var x = v[j], low = x < 100;
      return '<div class="mn-aar' + (low ? " low" : "") + '"><span class="mn-aal">' + AA[e].t + '</span><span class="mn-aat"><span class="mn-aaf" style="width:' + f1(clamp(x / 160, 0, 1) * 100) + '%"></span><span class="mn-ref" style="left:62.5%"></span></span><span class="mn-aav">' + MV.num(Math.round(x)) + "%" + (low ? " low" : "") + "</span></div>";
    }).join("") + '<p class="tiny muted mn-refkey">The dashed line marks 100% of the reference pattern.</p>';
    $("#mn-pnote").textContent = S.prot.foods.map(foodLow).join(" ");
    $("#mn-fold").setAttribute("aria-pressed", String(!!S.prot.fold)); $("#mn-fold").textContent = S.prot.fold ? "Unfold the chain" : "Fold the chain";
    $("#mn-fold").disabled = S.prot.chain.length < 3; $("#mn-pclr").disabled = !S.prot.chain.length;
    $("#mn-pmsg").textContent = msg.prot;
  }
  pb.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.aa) { if (S.prot.chain.length >= 12) msg.prot = "This chain holds 12 beads. Clear it to start again."; else { S.prot.chain.push(b.dataset.aa); msg.prot = ""; } commit(); return; }
    if (b.dataset.pf) {
      var f = S.prot.foods, k = f.indexOf(b.dataset.pf);
      if (k >= 0) f.splice(k, 1); else { f.push(b.dataset.pf); if (f.length > 2) f.shift(); }
      commit(); return;
    }
    if (b.id === "mn-pclr") { S.prot.chain = []; S.prot.fold = false; fx.fold = 0; msg.prot = ""; commit(); return; }
    if (b.id === "mn-fold") {
      S.prot.fold = !S.prot.fold; api.save(); var from = fx.fold, to = S.prot.fold ? 1 : 0;
      cancelAnim(); stop = MV.tween({ dur:900, step:function(t){ fx.fold = lerp(from, to, t); drawChain(); }, done:function(){ stop = null; fx.fold = to; paint(); } });
      paintProt();
    }
  });

  // ===== Mode 2: Measure =====
  var mb = $("#mn-meas"), GQ = [["c", "Carbohydrate"], ["f", "Fat"], ["p", "Protein"], ["fi", "Fibre"]];
  function gRow(w){
    return '<div class="mn-grow" id="mn-row' + w + '"><span class="mn-gw">' + w + "</span>" + GQ.map(function(q){ return '<input type="text" inputmode="decimal" class="numin" autocomplete="off" data-fw="' + w + '" data-g="' + q[0] + '" aria-label="Food ' + w + " " + q[1].toLowerCase() + ' in grams">'; }).join("") + "</div>";
  }
  mb.innerHTML = '<p class="how">Tap a food chip, or type the grams from any label. Compare two foods to see which brings more energy or fibre.</p><div class="mn-mctl"><div id="mn-cmp"></div><div id="mn-age"></div><label class="mn-check"><input type="checkbox" id="mn-pcto"> Show % only (hide kcal)</label></div>' +
    '<div class="mn-food"><div id="mn-fill"></div><div class="mn-fchips" role="group" aria-label="Food chips" id="mn-fchips"></div>' +
    '<div class="mn-grid"><div class="mn-grow mn-ghead" aria-hidden="true"><span></span>' + GQ.map(function(q){ return "<span>" + q[1].replace("Carbohydrate", "Carbo&shy;hydrate") + " (g)</span>"; }).join("") + "</div>" + gRow("A") + gRow("B") + '</div><p class="tiny mn-fnames" id="mn-fnames"></p></div>' +
    '<div class="mn-viz" id="mn-viz"></div>' +
    '<div class="mn-ans"><h4 class="mn-h4">Your % of energy <span class="tiny muted">(for target challenge 1)</span></h4><div class="mn-gin mn-ansrow">' +
    ["c", "f", "p"].map(function(k){ return '<label><span>' + NAME[k] + ' (%)</span><input type="text" inputmode="decimal" class="numin" autocomplete="off" data-ans="' + k + '"></label>'; }).join("") + "</div></div>";
  var cmpRG = radios($("#mn-cmp"), { label:"Foods", options:[{ id:"1", t:"One food" }, { id:"2", t:"Compare two" }], value:S.meas.cmp ? "2" : "1", onChange:function(v){ S.meas.cmp = v === "2"; commit(); } });
  var ageRG = radios($("#mn-age"), { label:"AMDR for", options:[{ id:"teen", t:"Ages 4–18" }, { id:"adult", t:"Adult" }], value:S.meas.age, onChange:function(v){ S.meas.age = v; commit(); } });
  var fillRG = radios($("#mn-fill"), { label:"A chip fills", options:[{ id:"A", t:"Food A" }, { id:"B", t:"Food B" }], value:S.meas.fill || "A", onChange:function(v){ S.meas.fill = v; commit(); } });
  function fillW(){ return S.meas.cmp && S.meas.fill === "B" ? "B" : "A"; }
  function ageNum(){ return S.meas.age === "adult" ? 30 : 16; }
  function ageLab(){ return S.meas.age === "adult" ? "adults" : '<span class="nw">ages 4–18</span>'; }
  function calc(w){
    var F = S.meas[w], c = N(gnum(F.c)), f = N(gnum(F.f)), p = N(gnum(F.p)), fi = N(gnum(F.fi)), kc = c * 4, kf = f * 9, kp = p * 4, E = kc + kf + kp;
    return { c:c, f:f, p:p, fi:fi, kc:kc, kf:kf, kp:kp, E:E, pct:{ c:NT.pctEnergy(kc, E, 2), f:NT.pctEnergy(kf, E, 2), p:NT.pctEnergy(kp, E, 2) }, sug:F.id && FOOD[F.id] ? FOOD[F.id].sug : null };
  }
  function amdrTxt(v){
    if (!v.E) return "Enter grams to see the check.";
    return ["c", "f", "p"].map(function(k){ var b = NT.amdr(KEY[k], ageNum()), x = v.pct[k]; return NAME[k] + " " + (x < b[0] ? "below range" : x > b[1] ? "above range" : "in range"); }).join(" · ");
  }
  function namesPaint(){
    var ws = S.meas.cmp ? ["A", "B"] : ["A"];
    $("#mn-fnames").innerHTML = ws.map(function(w){ return "<strong>Food " + w + ":</strong> " + esc(S.meas[w].name || "custom label"); }).join(" · ");
  }
  function inputsPaint(){
    var fw = fillW(), F = S.meas[fw], ch = $("#mn-fchips");
    ["A", "B"].forEach(function(w){ MV.$$('[data-fw="' + w + '"][data-g]', mb).forEach(function(inp){ if (document.activeElement !== inp) inp.value = S.meas[w][inp.dataset.g]; }); });
    MV.keepFocus(ch, function(){ ch.innerHTML = FD.map(function(x){ var on = F.id === x.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-fid="' + x.id + '" data-k="fc' + x.id + '" aria-pressed="' + on + '">' + x.t + "</button>"; }).join(""); });
    $("#mn-fill").hidden = !S.meas.cmp; fillRG.set(fw); $("#mn-rowB").hidden = !S.meas.cmp;
    namesPaint();
    MV.$$("[data-ans]", mb).forEach(function(inp){ if (document.activeElement !== inp) inp.value = S.meas.ans[inp.dataset.ans]; });
    $("#mn-pcto").checked = !!S.pctOnly;
  }
  function vizPaint(){
    var ws = S.meas.cmp ? ["A", "B"] : ["A"], V = ws.map(calc), po = !!S.pctOnly;
    var mx = Math.max.apply(null, V.map(function(v){ return v.E; }).concat([100])) * 1.08;
    var leg = '<p class="mn-leg"><span><i class="hfa-sw" style="background:var(--nu-carb)"></i>Carbohydrate</span><span><i class="hfa-sw" style="background:var(--nu-fat)"></i>Fat</span><span><i class="hfa-sw" style="background:var(--nu-protein)"></i>Protein</span><span><i class="hfa-sw mn-swband"></i>AMDR band</span></p>';
    var h = leg + '<div class="mn-vp"><h5>Energy (kcal)</h5>' + ws.map(function(w, i){
      var v = V[i], r = fx.reveal, sg = function(k, kc){ return '<span class="mn-seg mn-' + k + '" style="width:' + f1(kc * r / mx * 100) + '%"></span>'; };
      return '<div class="mn-erow"><span class="mn-elab">' + w + '</span><span class="mn-etrack">' + sg("c", v.kc) + sg("f", v.kf) + sg("p", v.kp) + '</span><span class="mn-eval">' + (po ? "" : (r < 1 ? "?" : MV.num(v.E)) + " kcal") + "</span></div>";
    }).join("") + "</div>";
    h += '<div class="mn-vp"><h5>% of energy, with the AMDR band for ' + ageLab() + "</h5>" + ["c", "f", "p"].map(function(k){
      var b = NT.amdr(KEY[k], ageNum());
      return '<div class="mn-prow"><span class="mn-plab">' + NAME[k] + '</span><span class="mn-pbars">' + ws.map(function(w, i){ var x = V[i].pct[k] || 0;
        return '<span class="mn-ptrack"><span class="mn-band" style="left:' + b[0] + "%;width:" + (b[1] - b[0]) + '%"></span><span class="mn-pfill mn-' + k + '" style="width:' + f1(x) + '%"></span>' + (ws.length > 1 ? '<span class="mn-ptag">' + w + "</span>" : "") + "</span>"; }).join("") +
        '</span><span class="mn-pval">' + ws.map(function(w, i){ return (ws.length > 1 ? w + " " : "") + pc(V[i].pct[k]); }).join("<br>") + "</span></div>";
    }).join("") + "</div>";
    var fm = Math.max.apply(null, V.map(function(v){ return v.fi; }).concat([8])) * 1.1;
    h += '<div class="mn-vp"><h5>Fibre (g)</h5>' + ws.map(function(w, i){
      var v = V[i];
      return '<div class="mn-erow"><span class="mn-elab">' + w + '</span><span class="mn-etrack"><span class="mn-seg mn-fib" style="width:' + f1(v.fi * fx.fib / fm * 100) + '%"></span></span><span class="mn-eval">' + (fx.fib < 1 ? "?" : MV.num(v.fi)) + " g</span></div>";
    }).join("") + (V.some(function(v){ return v.sug != null; }) ? '<p class="tiny">' + ws.map(function(w, i){ return V[i].sug != null ? w + " (" + S.meas[w].name + "): sugars " + V[i].sug + " g" : ""; }).filter(Boolean).join(" · ") + "</p>" : "") + "</div>";
    $("#mn-viz").innerHTML = h;
  }
  function paintMeas(){ cmpRG.set(S.meas.cmp ? "2" : "1"); ageRG.set(S.meas.age); inputsPaint(); vizPaint(); }
  mb.addEventListener("click", function(e){
    var b = e.target.closest("[data-fid]"); if (!b) return;
    cancelAnim(); S.meas[fillW()] = food(b.dataset.fid); commit();
  });
  mb.addEventListener("input", function(e){
    var t = e.target, d = t.dataset;
    if (d.fw && d.g) { var F = S.meas[d.fw]; F[d.g] = t.value; F.name = ""; F.id = ""; }
    else if (d.ans) S.meas.ans[d.ans] = t.value;
    else return;
    api.save(); paintLight(d.fw); MV.changed();
  });
  $("#mn-pcto").addEventListener("change", function(){ S.pctOnly = $("#mn-pcto").checked; commit(); if (MV._taskUpdate && MV.APP.task && MV.APP.task.refresh) MV.APP.task.refresh(); });

  // ===== readout =====
  function readRows(){
    if (S.mode === "measure") {
      var ws = S.meas.cmp ? ["A", "B"] : ["A"], V = ws.map(calc), pre = function(i){ return ws.length > 1 ? "<strong>" + ws[i] + ":</strong> " : ""; };
      var lines = function(fn){ return V.map(function(v, i){ return pre(i) + fn(v); }).join("<br>"); };
      var kc = S.pctOnly ? "Hidden (Show % only is on)" : fx.reveal < 1 ? "…" : null;
      return [["kcal from each", kc || lines(function(v){ return "Carbohydrate " + MV.num(v.kc) + " · Fat " + MV.num(v.kf) + " · Protein " + MV.num(v.kp); })],
        ["Total", kc || lines(function(v){ return MV.num(v.E) + " kcal"; })],
        ["% of energy", lines(function(v){ return pc(v.pct.c) + " · " + pc(v.pct.f) + " · " + pc(v.pct.p); }) + '<br><span class="tiny muted">carbohydrate · fat · protein</span>'],
        ["AMDR check (" + ageLab() + ")", lines(amdrTxt)],
        ["Fibre", fx.fib < 1 ? "…" : lines(function(v){ return MV.num(v.fi) + " g"; })]];
    }
    if (S.bench === "carb") { var ci = carbInfo(); return [["Molecule", ci.name], ["Type", ci.kind], ["Built from", ci.pieces], ["Bonds", chainMode() ? (S.carb.bond === "b" ? "β (fibre)" : "α (digestible)") : S.carb.chain.length === 2 ? "one bond" : "none"],
      ["Human enzymes", ci.cut == null ? "Nothing to cut" : ci.cut ? "Can cut it: glucose for fuel, about 4 kcal/g" : "Can’t cut β-bonds: fibre, little energy"], ["Note", ci.note]]; }
    if (S.bench === "fat") return [["Fat bench", tailDesc(S.fat.tail)], ["Triglyceride", tgState()], ["Saturated tails", tgInfo().sat + " of " + tgInfo().n]];
    var v = aaVals(S.prot.foods), li = limiting(v), ch = S.prot.chain;
    return [["Protein bench", v ? "Limiting amino acid: " + (li < 0 ? "none. Every bar reaches 100%." : AA[D.essential[li]].t.toLowerCase()) : "Choose a plant food."],
      ["Foods", S.prot.foods.length ? S.prot.foods.map(function(id){ return PL[id].t; }).join(" + ") : "none"],
      ["Chain", ch.length + " amino acid" + (ch.length === 1 ? "" : "s") + " · " + ch.filter(function(id){ return AA[id].e; }).length + " essential"]];
  }
  function readPaint(){ $("#mn-read").innerHTML = MV.readoutHTML(readRows()); }

  // ===== paint / commit =====
  function paint(){
    modeRG.set(S.mode); benchRG.set(S.bench);
    var m = S.mode === "measure";
    $("#mn-bsel").hidden = m;
    $("#mn-b-carb").hidden = m || S.bench !== "carb"; $("#mn-b-fat").hidden = m || S.bench !== "fat"; $("#mn-b-prot").hidden = m || S.bench !== "prot"; $("#mn-meas").hidden = !m;
    if (m) paintMeas(); else if (S.bench === "carb") paintCarb(); else if (S.bench === "fat") paintFat(); else paintProt();
    readPaint();
  }
  // light repaint while typing (keeps the input's focus and caret): food name, chip highlight, bars, readout
  function paintLight(w){
    if (w) { namesPaint(); if (w === fillW()) MV.$$("#mn-fchips .chip.on").forEach(function(c){ c.classList.remove("on"); c.setAttribute("aria-pressed", "false"); }); }
    vizPaint(); readPaint();
  }
  function commit(){ api.save(); paint(); MV.changed(); }
  function cancelAnim(){ if (stop) { stop(); stop = null; } fx.enz = null; fx.kink = 1; fx.gap = null; fx.reveal = 1; fx.fib = 1; fx.fold = S.prot.fold ? 1 : 0; }
  paint();

  // ===== challenges (plan's exact tests and named wrong states) =====
  function challenge(id){
    var M = CH[id];
    if (id === "tc1") {
      var a = S.meas.ans, v = [gnum(a.c), gnum(a.f), gnum(a.p)], near = function(x, y){ return Math.abs(x - y) <= 1; };
      if (v.some(function(x){ return x == null; })) return { ok:false, msg:M.empty };
      if (near(v[0], 60) && near(v[1], 18) && near(v[2], 22)) return { ok:true };
      var s = v.slice().sort(function(x, y){ return x - y; });
      if (near(s[0], 18) && near(s[1], 22) && near(s[2], 60)) return { ok:false, msg:M.boxes };
      if (near(s[0], 9) && near(s[1], 24) && near(s[2], 67)) return { ok:false, msg:M.grams };
      return { ok:false };
    }
    if (id === "tc2") {
      var I = tailInfo(S.fat.tail);
      if (!I.all.length) return { ok:false, msg:M.none };
      if (I.tr.length) return { ok:false, msg:M.trans };
      if (I.all[0] === 3) return { ok:true };
      return { ok:false, msg:M.omega.replace("{n}", I.all[0]) };
    }
    if (id === "tc3") {
      var f = S.prot.foods; if (f.length !== 2) return { ok:false, msg:M.two };
      var k = f.map(function(x){ return PL[x].k; });
      if (k.indexOf("leafy") >= 0) return { ok:false, msg:M.spinach };
      if (k[0] === "grain" && k[1] === "grain") return { ok:false, msg:M.grains };
      if (k[0] === "legume" && k[1] === "legume") return { ok:false, msg:M.legumes };
      return { ok:true };
    }
    return { ok:false };
  }

  // ===== predictions =====
  // bring the part of the lab that animates into view (phones: it can sit below the controls)
  function reveal(sel){ var el = $(sel), r = el && el.getBoundingClientRect(); if (r && (r.top < 110 || r.bottom > window.innerHeight)) el.scrollIntoView({ block:"center", behavior:MV.reduceMotion ? "auto" : "smooth" }); }
  return {
    predict:{
      start:function(p){
        cancelAnim(); msg.carb = msg.fat = "";
        if (p.id === "p1") { S.mode = "measure"; S.meas.cmp = true; S.meas.A = { name:"10 g of fat", id:"", c:"0", f:"10", p:"0", fi:"0" }; S.meas.B = { name:"20 g of carbohydrate", id:"", c:"20", f:"0", p:"0", fi:"0" }; fx.reveal = 0; }
        else if (p.id === "p2") { S.mode = "build"; S.bench = "fat"; S.fat.slots = preset("butter"); fx.gap = 0; }
        else if (p.id === "p3") { S.mode = "build"; S.bench = "carb"; S.carb = { chain:["glc", "glc", "glc", "glc", "glc"], bond:"b", branch:"light" }; fx.cut = 0; }
        else if (p.id === "p4") { S.mode = "measure"; S.meas.cmp = true; S.meas.A = food("apple"); S.meas.B = food("candy"); fx.fib = 0; }
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        reveal(p.id === "p1" || p.id === "p4" ? "#mn-viz" : p.id === "p2" ? "#mn-gsvg" : "#mn-csvg");
        if (p.id === "p1") stop = MV.tween({ dur:1400, step:function(t){ fx.reveal = t; vizPaint(); }, done:function(){ stop = null; fx.reveal = 1; paint(); done(); } });
        else if (p.id === "p2") { S.fat.slots = preset("canola"); api.save(); fx.kink = 0; stop = MV.tween({ dur:1600, step:function(t){ fx.kink = t; fx.gap = t; drawTG(); }, done:function(){ stop = null; fx.kink = 1; fx.gap = null; paint(); MV.changed(); done(); } }); }
        else if (p.id === "p3") enzymeTest(done);
        else if (p.id === "p4") stop = MV.tween({ dur:1200, step:function(t){ fx.fib = t; vizPaint(); }, done:function(){ stop = null; fx.fib = 1; paint(); done(); } });
        else done();
      }
    },
    challenge:function(id){ return challenge(id); }
  };
}

// ---------- Part 3: Read the fats and sugars (@component F3 labelLab: tappable Nutrition Facts lines, ingredient chips,
//   split sugar bars, label comparison chart, teacher-selected real-example slot) ----------
function part3(host, api){
  var D = api.content, S = api.S;
  S.row = S.row || null; S.rows = S.rows || {}; S.ing = S.ing || {}; S.bread = S.bread || null; S.seen = S.seen || {}; S.real = S.real || {};
  host.innerHTML = '<div class="mn-st" id="mn-st1"></div><div class="mn-st" id="mn-st2"></div><div class="mn-st" id="mn-st3"></div><div class="mn-st" id="mn-real"></div>';
  var NFT = function(head, rows){ return '<table class="hfa-nft"><caption>Nutrition Facts</caption><thead><tr><th scope="col">' + head + '</th><th scope="col">% Daily Value*</th></tr></thead><tbody>' + rows + '</tbody><tfoot><tr><td colspan="2">*5% or less is a little, 15% or more is a lot</td></tr></tfoot></table>'; };

  // Station 1: the fat lines
  var F = D.fat, s1 = $("#mn-st1", host);
  s1.innerHTML = "<h3>" + F.title + "</h3><p>" + F.intro + '</p><div class="mn-st1"><div><div class="mn-nftw" id="mn-nft1"></div><p class="tiny muted"><span class="hfa-model">Practice model</span> The fat lines of a label.</p></div><div class="mn-mean" id="mn-mean" aria-live="polite"></div></div>';
  function paint1(){
    var box = $("#mn-nft1", s1);
    MV.keepFocus(box, function(){
      box.innerHTML = NFT("Per serving", F.rows.map(function(r){ var on = S.row === r.id;
        return '<tr class="' + (r.sub ? "sub" : "") + (on ? " hi" : "") + '"><th scope="row"><button type="button" class="mn-lb" data-row="' + r.id + '" data-k="row' + r.id + '" aria-pressed="' + on + '">' + r.t + "</button></th>" + (r.id === "sat" ? '<td rowspan="2">' + r.dv + "</td>" : r.id === "trans" ? "" : "<td></td>") + "</tr>"; }).join(""));
    });
    var r = F.rows.filter(function(x){ return x.id === S.row; })[0], n = F.rows.filter(function(x){ return S.rows[x.id]; }).length;
    $("#mn-mean", s1).innerHTML = (r ? '<p><strong>' + r.t + ":</strong> " + r.mean + "</p>" : '<p class="muted">Tap a line on the label to see what it means.</p>') + '<p class="tiny muted">Lines read: ' + n + " of " + F.rows.length + "</p>";
  }
  s1.addEventListener("click", function(e){ var b = e.target.closest("[data-row]"); if (!b) return; S.row = b.dataset.row; S.rows[S.row] = 1; api.save(); paint1(); });
  paint1();

  // Station 2: two yogurts, check it with data
  var Y = D.yogurt, s2 = $("#mn-st2", host);
  s2.innerHTML = "<h3>" + Y.title + "</h3><p>" + Y.intro + '</p><div class="mn-yogs">' + Y.labels.map(function(L){
    return '<div class="mn-yog"><h4>' + L.t + '</h4><div class="mn-nftw">' + NFT("Per serving", '<tr class="hi"><th scope="row">Sugars ' + L.sug + " g</th><td>" + L.dv + "</td></tr>") + '</div><p class="mn-ingh">Ingredients:</p><div class="mn-ings" data-y="' + L.id + '"></div></div>';
  }).join("") + '</div><div id="mn-yfb" aria-live="polite"></div><div class="mn-yq"><p><strong>' + Y.prompt + '</strong></p><div class="q-actions"><button type="button" class="btn ghost sm" id="mn-yshow">Show the answer</button></div><div id="mn-yans" aria-live="polite"></div></div>' +
    '<details class="alg"><summary>Check it with data</summary><ul class="mn-data">' + Y.data.map(function(x){ return "<li>" + x + "</li>"; }).join("") + "</ul></details>";
  var yMsg = "";
  function paint2(){
    MV.$$("[data-y]", s2).forEach(function(box){
      var L = Y.labels.filter(function(x){ return x.id === box.dataset.y; })[0];
      MV.keepFocus(box, function(){ box.innerHTML = L.ing.map(function(k){ var I = Y.ing[k], seen = S.ing[L.id + ":" + k];
        return '<button type="button" class="mn-ing' + (seen ? " " + I.kind : "") + '" data-ing="' + k + '" data-yl="' + L.id + '" data-k="ing' + L.id + k + '">' + I.t + (seen ? '<span class="mn-ingk">' + (I.kind === "natural" ? "natural sugar" : I.kind === "added" ? "added sugar" : "no sugar") + "</span>" : "") + "</button>"; }).join(""); });
    });
    $("#mn-yfb", s2).innerHTML = yMsg;
    var a = $("#mn-yans", s2);
    if (!S.yAns) { a.innerHTML = ""; $("#mn-yshow", s2).hidden = false; return; }
    $("#mn-yshow", s2).hidden = true;
    a.innerHTML = '<div class="refresh"><p><strong>' + Y.answerText + '</strong></p><div class="mn-sbars">' + Y.labels.map(function(L){
      var nat = Math.min(6, L.sug), add = L.sug - nat;
      return '<span class="mn-wl">' + L.t + '</span><div class="mn-erow mn-w"><span class="mn-etrack"><span class="mn-seg mn-nat" style="width:' + f1(nat / 20 * 100) + '%"></span><span class="mn-seg mn-add" style="width:' + f1(add / 20 * 100) + '%"></span></span><span class="mn-eval">' + L.sug + " g</span></div>";
    }).join("") + '</div><p class="mn-leg"><span><i class="hfa-sw mn-swnat"></i>Naturally occurring (lactose)</span><span><i class="hfa-sw" style="background:var(--nu-carb)"></i>Added sugar</span></p></div>';
  }
  s2.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.ing) { var I = Y.ing[b.dataset.ing]; S.ing[b.dataset.yl + ":" + b.dataset.ing] = 1; yMsg = MV.fbHTML("", "<strong>" + I.t + ":</strong> " + I.fb); api.save(); paint2(); return; }
    if (b.id === "mn-yshow") { S.yAns = true; api.save(); paint2(); var r = $("#mn-yans .refresh", s2); if (r) { r.setAttribute("tabindex", "-1"); r.focus({ preventScroll:true }); } }
  });
  paint2();

  // Station 3: fibre finder
  var B = D.bread, s3 = $("#mn-st3", host);
  s3.innerHTML = "<h3>" + B.title + "</h3><p>" + B.intro + '</p><div class="mn-breads" role="group" aria-label="Bread labels" id="mn-bsel3"></div><div class="mn-bread" id="mn-bread" aria-live="polite"></div><div class="mn-vp"><h5>Fibre per slice (g)</h5><div id="mn-bchart"></div></div><div id="mn-bpoint" aria-live="polite"></div>';
  function paint3(){
    var sel = $("#mn-bsel3", s3);
    MV.keepFocus(sel, function(){ sel.innerHTML = B.breads.map(function(x){ var on = S.bread === x.id; return '<button type="button" class="mn-bcard" data-bread="' + x.id + '" data-k="br' + x.id + '" aria-pressed="' + on + '">' + (S.seen[x.id] ? '<span aria-hidden="true">✓ </span>' : "") + x.t + "</button>"; }).join(""); });
    var x = B.breads.filter(function(q){ return q.id === S.bread; })[0];
    $("#mn-bread", s3).innerHTML = x ? '<div class="mn-st1"><div class="mn-nftw">' + NFT("Per 1 slice", '<tr class="hi"><th scope="row">Fibre ' + x.fi + " g</th><td></td></tr>") + '</div><div><p><strong>' + x.t + "</strong></p><p>Ingredients: <mark class=\"mn-first\">" + x.ing[0] + "</mark>, " + x.ing.slice(1).join(", ") + '.</p><p class="tiny">First ingredient: ' + x.ing[0].toLowerCase() + ".</p></div></div>" : '<p class="muted">Tap a bread to read its label.</p>';
    $("#mn-bchart", s3).innerHTML = B.breads.map(function(q){ var seen = S.seen[q.id];
      return '<span class="mn-wl">' + q.t + '</span><div class="mn-erow mn-w"><span class="mn-etrack"><span class="mn-seg mn-fib" style="width:' + (seen ? f1(q.fi / 5 * 100) : 0) + '%"></span></span><span class="mn-eval">' + (seen ? q.fi + " g" : "?") + "</span></div>"; }).join("");
    $("#mn-bpoint", s3).innerHTML = B.breads.every(function(q){ return S.seen[q.id]; }) ? '<div class="refresh"><h4>The point</h4><p>' + B.point + "</p></div>" : '<p class="tiny muted">Breads read: ' + B.breads.filter(function(q){ return S.seen[q.id]; }).length + " of " + B.breads.length + "</p>";
  }
  s3.addEventListener("click", function(e){ var b = e.target.closest("[data-bread]"); if (!b) return; S.bread = b.dataset.bread; S.seen[S.bread] = 1; api.save(); paint3(); });
  paint3();

  // Real-example slot (teacher-selected; photos stay in memory only, text fields save on this device)
  var RX = D.real, rb = $("#mn-real", host);
  rb.innerHTML = '<details class="alg"><summary>' + RX.title + '</summary><p class="tiny" style="margin-top:10px">' + RX.intro + "</p>" + RX.slots.map(function(name, n){
    var st = S.real[n] || {};
    return '<div class="mn-slotx"><h5>' + name + '</h5><div class="mn-gin"><label>Add a photo<input type="file" accept="image/*" data-img="' + n + '"></label><label>Product and brand<input type="text" class="txtin" data-real="' + n + '" data-f="src" autocomplete="off" value="' + esc(st.src || "") + '"></label><label>Date<input type="text" class="txtin" data-real="' + n + '" data-f="date" autocomplete="off" value="' + esc(st.date || "") + '"></label></div>' +
      '<figure class="mn-fig" id="mn-fig' + n + '" hidden><img alt=""><figcaption id="mn-cr' + n + '"></figcaption></figure>' +
      RX.prompts.map(function(q, qi){ return '<div class="jq"><label for="mn-r' + n + qi + '">' + q + '</label><textarea id="mn-r' + n + qi + '" data-real="' + n + '" data-f="q' + qi + '">' + esc(st["q" + qi] || "") + "</textarea></div>"; }).join("") + "</div>";
  }).join("") + "</details>";
  function credit(n){ var st = S.real[n] || {}, el = $("#mn-cr" + n, rb); if (el) el.textContent = (st.src || "(add the product and brand)") + ", " + (st.date || "(add the date)") + ". " + RX.credit; }
  rb.addEventListener("input", function(e){ var t = e.target, n = t.dataset.real; if (n == null) return; var st = S.real[n] || (S.real[n] = {}); st[t.dataset.f] = t.value; api.save(); credit(n); });
  rb.addEventListener("change", function(e){
    var t = e.target, n = t.dataset.img; if (n == null || !t.files || !t.files[0] || !window.FileReader) return;
    var r = new FileReader();
    r.onload = function(){ var fig = $("#mn-fig" + n, rb), img = $("img", fig); img.src = r.result; img.alt = "Photo added for " + RX.slots[n]; fig.hidden = false; credit(n); };
    r.readAsDataURL(t.files[0]);
  });
}

// ---------- Practice 2: Energy detective (number entry N4, choose-all N7 and a chip pair, one first-try record) ----------
function detective(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = { val:"", pick:[], tries:0, hint:0, solved:false, first:null }); x.pick = x.pick || []; return x; }
  function chipT(it, id){ return it.chips.filter(function(c){ return c.id === id; })[0]; }
  function disp(it, x){
    if (it.kind === "num") { var v = MV.ans(it); return ": " + MV.num(v) + (it.unit === "%" ? "%" : " " + it.unit); }
    if (it.kind === "pair") { var cs = x.pick.map(function(id){ return chipT(it, id); }), s = cs[0].g + cs[1].g; return ": " + cs[0].t + " + " + cs[1].t.toLowerCase() + ". " + cs[0].g + " + " + cs[1].g + " = " + s + " g, so " + it.have + " + " + s + " = " + (it.have + s) + " g"; }
    return "";
  }
  function qHTML(it, i){
    var x = ist(it.id), h = '<div class="q" data-di="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "num") h += '<div class="numrow"><label for="dn-' + it.id + '">Your answer:</label><input class="numin" id="dn-' + it.id + '" data-dn="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + esc(x.val) + '"' + (x.solved ? " disabled" : "") + '><span class="m">' + it.unit + "</span></div>";
    else if (it.kind === "multi") h += '<div class="opts" role="group" aria-label="Options (choose all that apply)">' + it.options.map(function(o, oi){
      var on = x.pick.indexOf(oi) >= 0; return '<button type="button" class="opt sa-opt' + (x.solved && MV.ok(o) ? " right" : "") + '" role="checkbox" aria-checked="' + on + '" data-oi="' + oi + '" data-k="' + it.id + "o" + oi + '"' + (x.solved ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + (on ? "☑" : "☐") + "</span><span>" + o.t + "</span></button>"; }).join("") + "</div>";
    else h += '<div class="mn-dchips" role="group" aria-label="Food chips (choose two)">' + it.chips.map(function(c){
      var on = x.pick.indexOf(c.id) >= 0; return '<button type="button" class="mn-dchip" aria-pressed="' + on + '" data-chip="' + c.id + '" data-k="' + it.id + c.id + '"' + (x.solved ? " disabled" : "") + "><span>" + c.t + "</span><b>" + c.g + " g</b></button>"; }).join("") + '</div><p class="tiny muted">Chosen: ' + (x.pick.length ? x.pick.map(function(id){ return chipT(it, id).t; }).join(" + ") : "none yet") + "</p>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct' + disp(it, x) + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    return h + "</div>";
  }
  host.innerHTML = '<p class="how">' + a.how + '</p><div id="dt-items">' + a.items.map(qHTML).join("") + "</div>";
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function repaint(it){
    var box = host.querySelector('[data-di="' + it.id + '"]'), act = document.activeElement, k = act && box.contains(act) && act.dataset ? act.dataset.k : null;
    var div = document.createElement("div"); div.innerHTML = qHTML(it, a.items.indexOf(it)); var nb = div.firstChild; box.parentNode.replaceChild(nb, box);
    if (k) { var f = nb.querySelector('[data-k="' + k + '"]'); if (f && !f.disabled) f.focus({ preventScroll:true }); }
    return nb;
  }
  function judge(it, x){
    var NQ = "<strong>✗ Not quite.</strong> ";
    if (it.kind === "num") {
      var v = gnum(x.val); if (v == null) return { skip:true, msg:"Enter a number, such as 12 or 12.5." };
      if (Math.abs(v - MV.ans(it)) <= 0.05) return { ok:true };
      var w = (it.wrong || []).filter(function(q){ return Math.abs(v - q.match) <= 0.6; })[0];
      return { msg:NQ + (w ? w.fb : "Check your work and try again.") };
    }
    if (it.kind === "multi") {
      if (!x.pick.length) return { skip:true, msg:"Choose at least one nutrient." };
      var lines = [], good = true;
      it.options.forEach(function(o, oi){ var on = x.pick.indexOf(oi) >= 0, ok = MV.ok(o); if (on !== ok) { good = false; lines.push(on ? o.why : o.miss); } });
      return good ? { ok:true } : { msg:NQ + lines.join(" ") };
    }
    if (x.pick.length !== 2) return { skip:true, msg:it.wrong.count };
    var p = x.pick.slice().sort(), key = p.join("+");
    if (MV.ans(it).some(function(q){ return q.join("+") === key; })) return { ok:true };
    if (p.indexOf("pasta") >= 0) return { msg:NQ + it.wrong.pasta };
    if (it.wrong[key]) return { msg:NQ + it.wrong[key] };
    var s = chipT(it, p[0]).g + chipT(it, p[1]).g;
    return { msg:NQ + it.wrong.short.replace("{a}", s).replace("{t}", it.have + s).replace("{s}", it.need - it.have - s) };
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.dn; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.dn) { var b = host.querySelector('[data-k="' + e.target.dataset.dn + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-di]"); if (!box) return;
    var it = item(box.dataset.di), x = ist(it.id);
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (b.dataset.oi != null) { var oi = +b.dataset.oi, k = x.pick.indexOf(oi); if (k >= 0) x.pick.splice(k, 1); else x.pick.push(oi); msgs[it.id] = null; }
    else if (b.dataset.chip) { var c = b.dataset.chip, j = x.pick.indexOf(c); if (j >= 0) x.pick.splice(j, 1); else { x.pick.push(c); if (x.pick.length > 2) x.pick.shift(); } msgs[it.id] = null; }
    else if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { if (!r.skip) x.tries++; msgs[it.id] = r.msg; }
      api.save(); MV.focusFb(repaint(it)); return;
    }
    api.save(); repaint(it);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Balanced lunch box (four of twelve foods; checklist tests from the plan) ----------
var task = (function(){
  var api = null;
  function T(){ return MV.C.task; }
  function byId(id){ return T().foods.filter(function(f){ return f.id === id; })[0]; }
  function exS(){ return (MV.S.app && MV.S.app.explore) || {}; }
  function read(){
    var ids = ((api && api.S.pick) || []).slice(), C = 0, F = 0, Pr = 0, Fi = 0, vf = false, wg = false;
    ids.forEach(function(id){ var f = byId(id); C += f.c; F += f.f; Pr += f.p; Fi += f.fi; if (f.g === "vf") vf = true; if (f.g === "wg") wg = true; });
    var E = 4 * C + 9 * F + 4 * Pr;
    return { ids:ids, C:C, F:F, P:Pr, Fi:Fi, E:E, c:E ? 400 * C / E : 0, f:E ? 900 * F / E : 0, p:E ? 400 * Pr / E : 0, vf:vf, wg:wg };
  }
  function paint(){
    var d = read(), t = T(), box = $("#lb-foods"), full = d.ids.length >= 4;
    MV.keepFocus(box, function(){ box.innerHTML = t.foods.map(function(f){ var on = d.ids.indexOf(f.id) >= 0;
      return '<button type="button" class="mn-lbf" data-lb="' + f.id + '" data-k="lb' + f.id + '" aria-pressed="' + on + '"' + (full && !on ? " disabled" : "") + '><span class="mn-lbt">' + (on ? '<span aria-hidden="true">✓ </span>' : "") + f.t + "</span>" +
        '<span class="mn-lbm"><span class="nw">C ' + f.c + '</span> · <span class="nw">F ' + f.f + '</span> · <span class="nw">P ' + f.p + '</span> · <span class="nw">fibre ' + f.fi + " g</span></span>" + (f.g ? '<span class="mn-lbg">' + (f.g === "wg" ? "Whole grain" : "Vegetable or fruit") + "</span>" : "") + "</button>"; }).join(""); });
    $("#lb-count").textContent = d.ids.length + " of 4 foods chosen" + (full ? ". Tap a chosen food to remove it." : ".");
    var po = !!exS().pctOnly, h = "";
    h += '<p class="mn-leg"><span><i class="hfa-sw" style="background:var(--nu-carb)"></i>Carbohydrate</span><span><i class="hfa-sw" style="background:var(--nu-fat)"></i>Fat</span><span><i class="hfa-sw" style="background:var(--nu-protein)"></i>Protein</span><span><i class="hfa-sw mn-swband"></i>AMDR band (ages 4–18)</span></p>';
    h += '<div class="mn-vp"><h5>% of energy</h5>' + ["c", "f", "p"].map(function(k){ var b = NT.amdr(KEY[k], 16), x = d[k];
      return '<div class="mn-prow"><span class="mn-plab">' + NAME[k] + '</span><span class="mn-pbars"><span class="mn-ptrack"><span class="mn-band" style="left:' + b[0] + "%;width:" + (b[1] - b[0]) + '%"></span><span class="mn-pfill mn-' + k + '" style="width:' + f1(x) + '%"></span></span></span><span class="mn-pval">' + (d.E ? MV.num(x, 1) + "%" : "–") + "</span></div>"; }).join("") + "</div>";
    h += '<div class="mn-vp"><h5>Fibre (g)</h5><div class="mn-erow mn-w"><span class="mn-etrack"><span class="mn-seg mn-fib" style="width:' + f1(clamp(d.Fi / 20, 0, 1) * 100) + '%"></span><span class="mn-ref" style="left:40%"></span></span><span class="mn-eval">' + d.Fi + ' g</span></div><p class="tiny muted">The dashed line marks 8 g.</p></div>';
    h += '<p class="tiny">' + (d.ids.length ? "Lunch: " + d.ids.map(function(id){ return byId(id).t; }).join(", ") + "." : "No foods chosen yet.") + (d.E && !po ? " Energy for Jordan’s lunch: " + MV.num(d.E) + " kcal." : "") + "</p>";
    h += '<label class="mn-check tiny"><input type="checkbox" id="lb-pcto"' + (po ? " checked" : "") + "> Show % only (hide kcal)</label>";
    $("#lb-pv").innerHTML = h;
  }
  return {
    refresh:function(){ if (api) paint(); },
    render:function(inp, pv, a){
      api = a; a.S.pick = Array.isArray(a.S.pick) ? a.S.pick : [];
      inp.innerHTML = '<p class="tiny muted">C = carbohydrate, F = fat, P = protein, in grams per serving.</p><p class="tiny" id="lb-count" aria-live="polite"></p><div class="mn-lbfs" id="lb-foods" role="group" aria-label="Foods for the lunch box"></div>';
      pv.innerHTML = '<div id="lb-pv" aria-live="polite"></div>';
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-lb]"); if (!b || b.disabled) return;
        var p = a.S.pick, k = p.indexOf(b.dataset.lb);
        if (k >= 0) p.splice(k, 1); else if (p.length < 4) p.push(b.dataset.lb);
        a.save(); paint(); a.update();
      });
      pv.addEventListener("change", function(e){ if (e.target.id !== "lb-pcto") return; var ex = MV.S.app.explore || (MV.S.app.explore = {}); ex.pctOnly = e.target.checked; a.save(); paint(); var o = $("#mn-pcto"); if (o) o.checked = ex.pctOnly; });
      paint();
    },
    read:read,
    valid:function(d){ return d.ids.length === 4 ? true : "Choose exactly four foods."; },
    checks:function(d){
      if (d.ids.length !== 4) return [false, false, false, false, false, false];
      return [d.c >= 45 && d.c <= 65, d.f >= 25 && d.f <= 35, d.p >= 10 && d.p <= 30, d.Fi >= 8, d.vf, d.wg];
    },
    tips:function(d, c){
      var t = T(), out = [];
      [["c", 45], ["f", 25], ["p", 10]].forEach(function(q, i){ if (!c[i]) out.push(d[q[0]] < q[1] ? t.tips[i] : t.tipsHigh[i]); });
      for (var i = 3; i < 6; i++) if (!c[i]) out.push(t.tips[i]);
      return out;
    },
    key:function(d){ var order = T().foods.map(function(f){ return f.id; }); return d.ids.slice().sort(function(x, y){ return order.indexOf(x) - order.indexOf(y); }).join("+"); },
    label:function(k){ return k.split("+").map(function(id){ return byId(id).t; }).join(", "); },
    text:function(k){ return k.split("+").map(function(id){ return byId(id).t; }).join(", "); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ detective:detective },
  task:task
});
})();
