// SCH4U 46 Balancing Redox Reactions: hero (MnO₄⁻ + Fe²⁺ split into halves, balanced, ×5, added, electrons cancel),
// Half-reaction balancer (Explore: C14 redox balancer with a step menu and N4 number boxes, half-reaction and
// oxidation-number methods, basic conversion, live tallies), Special cases (Part 3: flip cards, spectator ions, a
// permanganate titration flask, the breath-test balance), "Balance it" (N4 coefficient boxes) and "Pick a titration
// reaction" (task with a live overall equation).
(function(){
"use strict";
var $ = MV.$;
function esc(s){ return MV.esc(s); }
function F(s){ return MV.chem.f(s); }
var MINUS = "−";
function qs(n){ return n > 0 ? "+" + n : n < 0 ? MINUS + (-n) : "0"; }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function lcm(a, b){ return a && b ? a / gcd(a, b) * b : 0; }
// whole number in [lo, hi]; blank -> dflt; anything else -> null
function int(v, lo, hi, dflt){ var s = String(v == null ? "" : v).trim(); if (s === "") return dflt; if (!/^\d{1,3}$/.test(s)) return null; var n = +s; return n < lo || n > hi ? null : n; }
var HN = { red:"reduction", ox:"oxidation" };

// ---------- @component C14 redox engine — species parser ("Cr2O7^2-", "MnO4-", "e-"), equations as ordered term lists
// {L:[[species, n]], R:[…]}, sum / scale / cancel / combine H⁺ + OH⁻, atom and charge tally, coloured HTML
// (electrons violet, H⁺ magenta, OH⁻ cerulean, water ink, metals cerulean, magenta O letters in O-containing ions). ----------
var PC = {};
function sp(s){
  if (PC[s]) return PC[s];
  if (s === "e-") return (PC[s] = { a:{}, q:-1 });
  var q = 0, b = s, m;
  if ((m = /\^(\d*)([+-])$/.exec(s))) { q = (m[1] ? +m[1] : 1) * (m[2] === "+" ? 1 : -1); b = s.slice(0, m.index); }
  else if ((m = /([+-])$/.exec(s))) { q = m[1] === "+" ? 1 : -1; b = s.slice(0, -1); }
  var a = {}, re = /([A-Z][a-z]?)(\d*)/g, x;
  while ((x = re.exec(b))) a[x[1]] = (a[x[1]] || 0) + (x[2] ? +x[2] : 1);
  return (PC[s] = { a:a, q:q });
}
function eqNew(){ return { L:[], R:[] }; }
function cnt(q, sd, s){ for (var i = 0; i < q[sd].length; i++) if (q[sd][i][0] === s) return q[sd][i][1]; return 0; }
function put(q, sd, s, n){ if (!n) return q; for (var i = 0; i < q[sd].length; i++) if (q[sd][i][0] === s) { q[sd][i][1] += n; return q; } q[sd].push([s, n]); return q; }
function copy(q){ return { L:q.L.map(function(t){ return t.slice(); }), R:q.R.map(function(t){ return t.slice(); }) }; }
function scale(q, k){ var c = copy(q); c.L.forEach(function(t){ t[1] *= k; }); c.R.forEach(function(t){ t[1] *= k; }); return c; }
function sum(a, b){ var c = copy(a); b.L.forEach(function(t){ put(c, "L", t[0], t[1]); }); b.R.forEach(function(t){ put(c, "R", t[0], t[1]); }); return c; }
function clean(q){ q.L = q.L.filter(function(t){ return t[1] > 0; }); q.R = q.R.filter(function(t){ return t[1] > 0; }); return q; }
function cancel(q){ var c = copy(q); c.L.forEach(function(t){ var r = cnt(c, "R", t[0]); if (r && t[1]) { var m = Math.min(r, t[1]); t[1] -= m; put(c, "R", t[0], -m); } }); return clean(c); }
function combine(q){ ["L", "R"].forEach(function(sd){ var m = Math.min(cnt(q, sd, "H+"), cnt(q, sd, "OH-")); if (m) { put(q, sd, "H+", -m); put(q, sd, "OH-", -m); put(q, sd, "H2O", m); } }); return clean(q); }
function addOH(q, n, s){ (s === "both" ? ["L", "R"] : [s]).forEach(function(sd){ put(q, sd, "OH-", n); }); return q; }
function parseEq(str){
  var q = eqNew(), p = str.split("->");
  [["L", p[0]], ["R", p[1]]].forEach(function(x){ x[1].trim().split(/\s\+\s/).forEach(function(t){ var m = /^(\d+)?(.+)$/.exec(t.trim()); put(q, x[0], m[2], m[1] ? +m[1] : 1); }); });
  return q;
}
function keyOf(q){ function k(a){ return a.filter(function(t){ return t[1] > 0; }).map(function(t){ return t[0] + "*" + t[1]; }).sort().join(","); } return k(q.L) + ">" + k(q.R); }
function same(a, b){ return keyOf(a) === keyOf(b); }
function gcdOf(q){ var g = 0; q.L.concat(q.R).forEach(function(t){ g = gcd(g, t[1]); }); return g; }
function propK(q, ans){ var g = gcdOf(q); return g > 1 && same(scale(q, 1 / g), ans) ? g : 0; }
function both(q, s){ return cnt(q, "L", s) > 0 && cnt(q, "R", s) > 0; }
function tally(q){
  var els = [], A = {}, ql = 0, qr = 0;
  ["L", "R"].forEach(function(sd){ q[sd].forEach(function(t){
    var p = sp(t[0]); if (sd === "L") ql += p.q * t[1]; else qr += p.q * t[1];
    Object.keys(p.a).forEach(function(el){ if (!A[el]) { A[el] = { el:el, l:0, r:0 }; els.push(A[el]); } A[el][sd === "L" ? "l" : "r"] += p.a[el] * t[1]; });
  }); });
  var bad = els.filter(function(e){ return e.l !== e.r; });
  return { els:els, ql:ql, qr:qr, bad:bad, qok:ql === qr, ok:!bad.length && ql === qr };
}
function talHTML(t, noQ){
  var parts = t.els.map(function(e){ return e.l === e.r ? e.el + " " + e.l + " = " + e.r : '<span class="rdx-bad">' + e.el + " " + e.l + " ≠ " + e.r + "</span>"; });
  if (!noQ) parts.push(t.qok ? "charge " + qs(t.ql) + " = " + qs(t.qr) : '<span class="rdx-bad">charge ' + qs(t.ql) + " ≠ " + qs(t.qr) + "</span>");
  return parts.join(" · ");
}
function misText(t){ if (t.bad.length) return t.bad[0].el + " " + t.bad[0].l + " ≠ " + t.bad[0].r; return "charge " + qs(t.ql) + " ≠ " + qs(t.qr); }
var MEDR = { "H+":1, "H2O":2, "OH-":3, "e-":4 };
function sorted(arr, ord){ function rk(s){ var i = ord ? ord.indexOf(s) : -1; return i >= 0 ? i : 100 + (MEDR[s] || 0); } return arr.slice().sort(function(a, b){ return rk(a[0]) - rk(b[0]); }); }
var METAL = /^(Cu|Ag|Al|Fe|Mn|Cr|Zn)(\^\d*[+-]|\+)?$/;
function termHTML(s, n, cls){
  var h = F(s), c = s === "e-" ? "rdx-ce" : s === "H+" ? "rdx-ch" : s === "OH-" ? "rdx-coh" : s === "H2O" ? "rdx-cw" : METAL.test(s) ? "rdx-cm" : "";
  if (!c && sp(s).q && sp(s).a.O) h = h.replace(/O(?![a-z])/g, '<span class="rdx-o">O</span>');
  return '<span class="rdx-t ' + c + (cls ? " " + cls : "") + '">' + (n > 1 ? n : "") + h + "</span>";
}
// o: {fl:{"L:H2O":1} flash once, st:{"L:e-":1} cancelling}
function eqHTML(q, ord, o){
  o = o || {};
  function side(sd){
    var a = sorted(q[sd], ord);
    if (!a.length) return '<span class="rdx-t muted">0</span>';
    return a.map(function(t){ var k = sd + ":" + t[0]; return termHTML(t[0], t[1], (o.fl && o.fl[k] && !MV.reduceMotion ? "rdx-new" : "") + (o.st && o.st[k] ? (MV.reduceMotion ? " rdx-strike" : " rdx-gone") : "")); }).join(' <span class="rdx-op">+</span> ');
  }
  return side("L") + ' <span class="rdx-op">→</span> ' + side("R");
}
function eqPlain(q, ord){ return MV.plain(eqHTML(q, ord)).replace(/\s+/g, " ").trim(); }

// ---------- reactions (plan: Explore E1–E5). Units for the oxidation-number method are the atom-balanced halves. ----------
var RX = {
  e1:{ ord:["Cu", "Ag+", "Cu^2+", "Ag"], red:{ L:["Ag+"], R:["Ag"] }, ox:{ L:["Cu"], R:["Cu^2+"] },
    on:{ red:{ u:"Ag+ -> Ag", el:"Ag", from:1, to:0, k:1 }, ox:{ u:"Cu -> Cu^2+", el:"Cu", from:0, to:2, k:1 } } },
  e2:{ ord:["MnO4-", "Fe^2+", "Mn^2+", "Fe^3+"], hasO:true, red:{ L:["MnO4-"], R:["Mn^2+"] }, ox:{ L:["Fe^2+"], R:["Fe^3+"] },
    on:{ red:{ u:"MnO4- -> Mn^2+", el:"Mn", from:7, to:2, k:1 }, ox:{ u:"Fe^2+ -> Fe^3+", el:"Fe", from:2, to:3, k:1 } } },
  e3:{ ord:["Cr2O7^2-", "I-", "Cr^3+", "I2"], hasO:true, red:{ L:["Cr2O7^2-"], R:["Cr^3+"] }, ox:{ L:["I-"], R:["I2"] },
    on:{ red:{ u:"Cr2O7^2- -> 2Cr^3+", el:"Cr", from:6, to:3, k:2 }, ox:{ u:"2I- -> I2", el:"I", from:-1, to:0, k:2 } } },
  e4:{ ord:["MnO4-", "I-", "MnO2", "I2"], hasO:true, basic:true, red:{ L:["MnO4-"], R:["MnO2"] }, ox:{ L:["I-"], R:["I2"] },
    on:{ red:{ u:"MnO4- -> MnO2", el:"Mn", from:7, to:4, k:1 }, ox:{ u:"2I- -> I2", el:"I", from:-1, to:0, k:2 } } },
  e5:{ ord:["Al", "Cu^2+", "Al^3+", "Cu"], red:{ L:["Cu^2+"], R:["Cu"] }, ox:{ L:["Al"], R:["Al^3+"] },
    on:{ red:{ u:"Cu^2+ -> Cu", el:"Cu", from:2, to:0, k:1 }, ox:{ u:"Al -> Al^3+", el:"Al", from:0, to:3, k:1 } } }
};
function dOf(u){ return Math.abs(u.to - u.from) * u.k; }
function skel(r){ var R = RX[r], q = eqNew(); R.red.L.concat(R.ox.L).forEach(function(s){ put(q, "L", s, 1); }); R.red.R.concat(R.ox.R).forEach(function(s){ put(q, "R", s, 1); }); return q; }
function ones(a){ return a.map(function(){ return 1; }); }
function newH(r){
  var R = RX[r], z = function(){ return { red:{ n:0, s:"" }, ox:{ n:0, s:"" } }; };
  return { split:false, at:{ red:{ L:ones(R.red.L), R:ones(R.red.R) }, ox:{ L:ones(R.ox.L), R:ones(R.ox.R) } }, atD:false,
    w:z(), wD:false, h:z(), hD:false, e:z(), eD:false, m:{ red:1, ox:1 }, mD:false, add:false, oh:{ n:0, s:"" }, ohD:false, can:false, chk:false, demo:false };
}
function newOn(){ return { a:"", b:"", w:{ n:"", s:"" }, h:{ n:"", s:"" }, oh:{ n:"", s:"" } }; }
var MSP = { w:"H2O", h:"H+", e:"e-" };
function halfEq(st, r, h, noE){
  var R = RX[r][h], q = eqNew();
  R.L.forEach(function(s, i){ put(q, "L", s, st.at[h].L[i]); });
  R.R.forEach(function(s, i){ put(q, "R", s, st.at[h].R[i]); });
  ["w", "h", "e"].forEach(function(k){ if (noE && k === "e") return; var x = st[k][h]; if (x.n > 0 && x.s) put(q, x.s, MSP[k], x.n); });
  return clean(q);
}
function combined(st, r){ return sum(scale(halfEq(st, r, "red"), st.m.red), scale(halfEq(st, r, "ox"), st.m.ox)); }
function overall(st, r){
  if (!st.add) return null;
  var q = cancel(combined(st, r));
  if (st.ohD && st.oh.n > 0 && st.oh.s) { addOH(q, st.oh.n, st.oh.s); combine(q); if (st.can) q = cancel(q); }
  return clean(q);
}
function eSide(st, r, h){ var q = halfEq(st, r, h, true), t = tally(q); return t.ql === t.qr ? "" : t.ql > t.qr ? "L" : "R"; }
function eCounts(st, r){ var rd = halfEq(st, r, "red"), ox = halfEq(st, r, "ox"); return { g:cnt(rd, "L", "e-"), l:cnt(ox, "R", "e-"), gw:cnt(rd, "R", "e-"), lw:cnt(ox, "L", "e-") }; }

// ---------- @component radioGroup (from MHF4U 25, via SCH4U 01–16) — segmented control or chip row as a real radio group
// (arrow keys, roving tabindex, optional lock) ----------
function radios(host, o){
  var val = o.value == null ? "" : String(o.value), locked = false;
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), first = true;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val, d = locked, tab = on || (!any && first && !d); if (!d) first = false; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (tab ? 0 : -1) + '" data-rg="' + esc(x.id) + '"' + (x.aria ? ' aria-label="' + esc(x.aria) + '"' : "") + (d ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(val); if (i < 0) i = d > 0 ? -1 : 0;
    i = (i + d + ids.length) % ids.length; choose(ids[i]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } } };
}
var SIDES = [{ id:"L", t:"left" }, { id:"R", t:"right" }];
var OHSIDES = [{ id:"both", t:"both sides" }, { id:"L", t:"left only" }, { id:"R", t:"right only" }];

// ---------- hero: the storyboard as HTML frames ----------
function hero(f){
  var stage = $("#rdx-hstage"), ctr = $("#rdx-hctr"), rep = $("#rdx-hreplay"), run = 0;
  if (!stage) return;
  var ORD = RX.e2.ord;
  function row(lab, q, o, badge){ return '<div class="rdx-hr"><span class="rdx-hl">' + lab + '</span><span class="rdx-he">' + eqHTML(q, ORD, o) + (badge ? ' <span class="rdx-badge' + (MV.reduceMotion ? "" : " rdx-stamp") + '">' + badge + "</span>" : "") + "</span></div>"; }
  var red0 = parseEq("MnO4- -> Mn^2+"), ox0 = parseEq("Fe^2+ -> Fe^3+");
  var r1 = parseEq("MnO4- -> Mn^2+ + 4H2O"), r2 = parseEq("MnO4- + 8H+ -> Mn^2+ + 4H2O"), r3 = parseEq("MnO4- + 8H+ + 5e- -> Mn^2+ + 4H2O");
  var o1 = parseEq("Fe^2+ -> Fe^3+ + e-"), o5 = parseEq("5Fe^2+ -> 5Fe^3+ + 5e-");
  var sumq = parseEq("MnO4- + 8H+ + 5e- + 5Fe^2+ -> Mn^2+ + 4H2O + 5Fe^3+ + 5e-"), fin = parseEq("MnO4- + 5Fe^2+ + 8H+ -> Mn^2+ + 5Fe^3+ + 4H2O");
  var FR = [
    { h:row("Skeleton", parseEq("MnO4- + Fe^2+ -> Mn^2+ + Fe^3+")), c:"The unbalanced skeleton." },
    { h:row("Reduction", red0) + row("Oxidation", ox0), c:"Split into two half-reactions." },
    { h:row("Reduction", r1, { fl:{ "R:H2O":1 } }) + row("Oxidation", ox0), c:"4H₂O balance the O." },
    { h:row("Reduction", r2, { fl:{ "L:H+":1 } }) + row("Oxidation", ox0), c:"8H⁺ balance the H." },
    { h:row("Reduction", r3, { fl:{ "L:e-":1 } }) + row("Oxidation", ox0), c:"5e⁻ balance the charge: +7 → +2." },
    { h:row("Reduction", r3) + row("Oxidation", o1, { fl:{ "R:e-":1 } }), c:"1e⁻ balances the iron half." },
    { h:row("Reduction", r3) + row("Oxidation", o5, {}, "×5"), c:"×5 so 5 e⁻ are lost and 5 gained." },
    { h:row("Added", sumq, { st:{ "L:e-":1, "R:e-":1 } }), c:"Add the halves: the 5e⁻ on each side cancel." }
  ];
  function final(){ stage.innerHTML = row("Overall", fin) + '<p class="rdx-htal">atoms: equal · charge: +17 = +17</p>'; ctr.textContent = "Balanced: atoms and charge match."; if (f.cap) f.cap.textContent = "Every acidic balance follows the same moves; the electron count comes from the charge."; rep.hidden = false; }
  function play(){
    var id = ++run, i = 0; rep.hidden = true;
    (function next(){ if (id !== run) return; if (i >= FR.length) { final(); return; } stage.innerHTML = FR[i].h; ctr.textContent = FR[i].c; i++; MV.wait(i === 1 ? 1100 : 1300, next); })();
  }
  rep.addEventListener("click", function(){ if (MV.reduceMotion) final(); else play(); });
  if (MV.reduceMotion) final(); else play();
}

// ---------- Explore: Half-reaction balancer ----------
function explore(host, api){
  var S = api.S, C = api.content, FB = C.stepFb;
  if (!RX[S.rx]) S.rx = "e2";
  if (S.method !== "on") S.method = "half";
  if (!S.h || typeof S.h !== "object") S.h = {};
  if (!S.on || typeof S.on !== "object") S.on = {};
  Object.keys(RX).forEach(function(r){ if (!S.h[r] || !S.h[r].at || !S.h[r].oh) S.h[r] = newH(r); if (!S.on[r] || !S.on[r].w || !S.on[r].oh) S.on[r] = newOn(); });
  var open = "", busy = false, run = 0, ovr = null, fl = null, rowFl = null, note = "", draft = {}, addFx = false, talFx = false, perr = "";

  host.innerHTML = '<p class="how">' + C.how + '</p><div class="rdx-top"><div class="rdx-rx"></div><div class="rdx-meth"></div></div>' +
    '<div class="rdx-view" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p><div class="rdx-grid">' +
    '<div class="rdx-main"><div class="rdx-board" role="group" aria-label="Equations and tallies"></div><div class="rdx-work"></div></div>' +
    '<div class="rdx-sidecol"><dl class="read rdx-read" aria-live="polite"></dl><button type="button" class="btn ghost sm" data-act="reset" data-k="rdxreset">Start again</button></div></div></div>';
  var board = $(".rdx-board", host), work = $(".rdx-work", host), read = $(".rdx-read", host);
  function cur(){ return S.h[S.rx]; }
  function touch(){ ovr = null; talFx = false; addFx = false; }
  var RG = {};
  RG.rx = radios($(".rdx-rx", host), { label:"Reaction", aria:"Reaction", cls:"chips rdx-rxchips", options:C.reactions, value:S.rx, onChange:function(v){ touch(); S.rx = v; open = ""; note = ""; api.save(); paintWork(); paint(); MV.changed(); } });
  RG.m = radios($(".rdx-meth", host), { label:"Method", aria:"Balancing method", options:C.methods, value:S.method, onChange:function(v){ touch(); S.method = v; open = ""; note = ""; api.save(); paintWork(); paint(); MV.changed(); } });

  // ----- status sentences -----
  function hStatus(st, r){
    if (!st.split) return FB.needSplit;
    var hs = ["red", "ox"], i, t;
    for (i = 0; i < 2; i++) { t = tally(halfEq(st, r, hs[i])); var o = t.bad.filter(function(e){ return e.el !== "O" && e.el !== "H"; })[0]; if (o) return "Balance " + o.el + " in the " + HN[hs[i]] + " half."; }
    for (i = 0; i < 2; i++) { t = tally(halfEq(st, r, hs[i])); if (t.bad.some(function(e){ return e.el === "O"; })) return "Balance O in the " + HN[hs[i]] + " half with H₂O."; }
    for (i = 0; i < 2; i++) { t = tally(halfEq(st, r, hs[i])); if (t.bad.some(function(e){ return e.el === "H"; })) return "Balance H in the " + HN[hs[i]] + " half with H⁺."; }
    for (i = 0; i < 2; i++) {
      t = tally(halfEq(st, r, hs[i])); if (t.qok) continue;
      var x = st.e[hs[i]], good = eSide(st, r, hs[i]);
      if (x.n > 0 && good && x.s !== good) return MV.plain(FB.eSide);
      return "Balance the charge in the " + HN[hs[i]] + " half with electrons.";
    }
    var ec = eCounts(st, r), g = ec.g * st.m.red, l = ec.l * st.m.ox;
    if (!st.add) return g !== l ? "Halves balanced. Equalize the electrons next." : "Electrons equal (" + g + " = " + l + "). Add the halves and cancel.";
    var q = overall(st, r), tq = tally(q);
    if (RX[r].basic) {
      if (!st.ohD) return "Balanced for acidic solution. Convert to basic: add OH⁻.";
      if (cnt(q, "L", "H+") || cnt(q, "R", "H+")) return "Basic solution has no H⁺: add OH⁻ to both sides.";
      if (both(q, "H2O")) return "Water appears on both sides: cancel it.";
    }
    if (!tq.ok) return "Atoms or charge don’t match: " + misText(tq) + ".";
    var k = gcdOf(q); if (k > 1) return C.chalMsgs.lowest.replace("{k}", k);
    return "Balanced: atoms and charge match on both sides.";
  }
  function onStatus(r){
    var o = S.on[r], R = RX[r], a = int(o.a, 1, 20, null), b = int(o.b, 1, 20, null);
    if (!a || !b) return "Enter a multiplier for each half so the total rise equals the total fall.";
    var fa = dOf(R.on.red) * a, rb = dOf(R.on.ox) * b;
    if (fa !== rb) return "Total fall " + fa + " ≠ total rise " + rb + ": change a multiplier.";
    var q = onEq(r), t = tally(q), O = t.bad.filter(function(e){ return e.el === "O"; })[0], H = t.bad.filter(function(e){ return e.el === "H"; })[0];
    if (O) return "Balance O with H₂O.";
    if (H) return "Balance H with H⁺.";
    if (t.bad.length) return "Balance " + t.bad[0].el + ".";
    if (!t.qok) return "Charge " + qs(t.ql) + " ≠ " + qs(t.qr) + ": check the H⁺ and the side it’s on.";
    if (R.basic && (cnt(q, "L", "H+") || cnt(q, "R", "H+"))) return "Basic solution has no H⁺: add OH⁻ to both sides.";
    var k = gcdOf(q); if (k > 1) return C.chalMsgs.lowest.replace("{k}", k);
    return "Balanced: atoms and charge match on both sides.";
  }
  function onEq(r){
    var o = S.on[r], R = RX[r], a = int(o.a, 1, 20, null), b = int(o.b, 1, 20, null);
    if (!a || !b) return null;
    var q = sum(scale(parseEq(R.on.red.u), a), scale(parseEq(R.on.ox.u), b)), w = int(o.w.n, 0, 40, 0), h = int(o.h.n, 0, 40, 0);
    if (w && o.w.s) put(q, o.w.s, "H2O", w);
    if (h && o.h.s) put(q, o.h.s, "H+", h);
    if (R.basic) { var n = int(o.oh.n, 0, 40, 0); if (n && o.oh.s) { addOH(q, n, o.oh.s); combine(q); } }
    return cancel(q);
  }

  // ----- board -----
  function rowHTML(lab, q, o, badge, extra){
    var t = q ? tally(q) : null;
    return '<div class="rdx-row' + (extra || "") + '"><p class="rdx-lab">' + lab + (badge ? ' <span class="rdx-badge' + (MV.reduceMotion ? "" : " rdx-stamp") + '">' + badge + "</span>" : "") + '</p><p class="rdx-eq">' + (q ? eqHTML(q, RX[S.rx].ord, o) : '<span class="muted">' + o + "</span>") + "</p>" +
      (t ? '<p class="rdx-tal' + (talFx && !MV.reduceMotion ? " rdx-talfx" : "") + '"><span class="vh">Tally: </span>' + talHTML(t) + "</p>" : "") + "</div>";
  }
  function pre(p){ var o = {}; if (!fl) return o; Object.keys(fl).forEach(function(k){ if (k.indexOf(p + ":") === 0) o[k.slice(p.length + 1)] = 1; }); return o; }
  function paintBoard(){
    var r = S.rx, st = cur(), h = "";
    if (S.method === "on") {
      var q = onEq(r);
      h = rowHTML("Skeleton", skel(r), {}) + (q ? rowHTML("Your equation", q, { fl:pre("all") }) : rowHTML("Your equation", null, "Enter both multipliers to build the equation."));
    } else if (ovr && ovr.row === "skel") h = rowHTML(ovr.lab, ovr.q, { fl:ovr.fl }, ovr.badge);
    else if (!st.split) h = rowHTML("Skeleton", skel(r), {});
    else {
      h = rowHTML("Reduction half", halfEq(st, r, "red"), { fl:pre("red") }, st.mD && st.m.red > 1 ? "×" + st.m.red : "", rowFl && rowFl.red && !MV.reduceMotion ? " rdx-rnew" : "") +
        rowHTML("Oxidation half", halfEq(st, r, "ox"), { fl:pre("ox") }, st.mD && st.m.ox > 1 ? "×" + st.m.ox : "", rowFl && rowFl.ox && !MV.reduceMotion ? " rdx-rnew" : "");
      if (ovr && ovr.row === "all") h += rowHTML("Overall", ovr.q, { fl:ovr.fl, st:ovr.st });
      else if (st.add && addFx) { var c = combined(st, r), sk = {}; c.L.forEach(function(t){ if (cnt(c, "R", t[0])) { sk["L:" + t[0]] = 1; sk["R:" + t[0]] = 1; } }); h += rowHTML("Overall: halves added, cancelling", c, { st:sk }); }
      else if (st.add) h += rowHTML("Overall", overall(st, r), { fl:pre("all") });
      else h += rowHTML("Overall", null, "Add the halves to see the overall equation.");
    }
    board.innerHTML = h; fl = null; rowFl = null;
  }
  function paintRead(){
    var r = S.rx, st = cur(), R = RX[r], rows = [];
    if (S.method === "on") {
      var o = S.on[r], a = int(o.a, 1, 20, null), b = int(o.b, 1, 20, null), q = onEq(r), dr = dOf(R.on.red), dx = dOf(R.on.ox);
      var fa = a ? dr + " × " + a + " = " + dr * a : dr + " × ?", rb = b ? dx + " × " + b + " = " + dx * b : dx + " × ?";
      rows.push(["Total change", "fall " + fa + " · rise " + (a && b && dr * a !== dx * b ? '<span class="rdx-bad">' + rb + "</span>" : rb)]);
      if (q) { var t = tally(q); rows.push(["Atom tally", talHTML(t, true)]); rows.push(["Charge", t.qok ? qs(t.ql) + " = " + qs(t.qr) : '<span class="rdx-bad">' + qs(t.ql) + " ≠ " + qs(t.qr) + "</span>"]); }
      rows.push(["Status", onStatus(r)]);
    } else if (ovr && ovr.row === "skel") {
      var t0 = tally(ovr.q); rows.push(["Atom tally", talHTML(t0, true)]); rows.push(["Charge", qs(t0.ql) + " = " + qs(t0.qr)]); rows.push(["Status", "Balanced: two electrons move from one Cu to two Ag⁺."]);
    } else if (!st.split) {
      var t1 = tally(skel(r)); rows.push(["Atom tally", talHTML(t1, true)]); rows.push(["Charge", t1.qok ? qs(t1.ql) + " = " + qs(t1.qr) : '<span class="rdx-bad">left ' + qs(t1.ql) + " ≠ right " + qs(t1.qr) + "</span>"]); rows.push(["Status", hStatus(st, r)]);
    } else {
      var all = st.add ? overall(st, r) : combined(st, r), ta = tally(ovr && ovr.row === "all" ? ovr.q : all);
      rows.push(["Atom tally (overall)", talHTML(ta, true)]);
      var ch = ["red", "ox"].map(function(hh){ var t = tally(halfEq(st, r, hh)), s = (hh === "red" ? "Reduction: " : "Oxidation: "); return t.qok ? s + qs(t.ql) + " = " + qs(t.qr) : '<span class="rdx-bad">' + s + qs(t.ql) + " ≠ " + qs(t.qr) + "</span>"; });
      rows.push(["Charge (each half)", ch.join(" · ")]);
      var ec = eCounts(st, r), ex;
      if (ec.gw || ec.lw) ex = '<span class="rdx-bad">Electrons on the wrong side of the ' + (ec.gw ? "reduction" : "oxidation") + " half</span>";
      else if (!ec.g && !ec.l) ex = "None added yet";
      else if (st.mD) { var G = ec.g * st.m.red, Lo = ec.l * st.m.ox; ex = "Gained " + ec.g + " × " + st.m.red + " = " + G + " · lost " + ec.l + " × " + st.m.ox + " = " + Lo + (G === Lo ? ": equal" : ' <span class="rdx-bad">≠</span>'); }
      else if (ec.g && ec.l) { var Lc = lcm(ec.g, ec.l), mo = Lc / ec.l, mr = Lc / ec.g; ex = "Gained " + ec.g + " · lost " + ec.l + (ec.g === ec.l ? ": equal" : " → multiply " + [mo > 1 ? "oxidation by " + mo : "", mr > 1 ? "reduction by " + mr : ""].filter(Boolean).join(" and ")); }
      else ex = "Gained " + ec.g + " · lost " + ec.l;
      rows.push(["Electrons", ex]);
      rows.push(["Status", ovr && ovr.row === "all" ? ovr.status : hStatus(st, r)]);
    }
    read.innerHTML = MV.readoutHTML(rows);
  }

  // ----- work area: step menu + panel (half-reaction) or multiplier boxes (oxidation number) -----
  var DONE = { split:"split", atoms:"atD", water:"wD", hplus:"hD", elec:"eD", mult:"mD", add:"add", oh:"ohD", check:"chk" };
  function stepsList(){ return C.steps.filter(function(s){ return !s.basicOnly || RX[S.rx].basic; }); }
  function paintWork(){
    if (S.method === "on") {
      var r = S.rx, R = RX[r], o = S.on[r];
      function chg(u, kind){ var d = u.to - u.from; return '<li><span class="rdx-arr">' + u.el + " " + qs(u.from) + " → " + qs(u.to) + " (" + qs(d) + (u.k > 1 ? " each; " + u.k + " " + u.el + ": " + qs(d * u.k) : "") + ")</span> in " + eqHTML(parseEq(u.u), R.ord) + "</li>"; }
      function box(id, lab, val){ return '<div class="rdx-prow"><label for="on-' + id + '">' + lab + '</label><input class="numin rdx-num" id="on-' + id + '" data-on="' + id + '" type="text" inputmode="numeric" maxlength="2" autocomplete="off" value="' + esc(val) + '"' + (busy ? " disabled" : "") + ">" + "</div>"; }
      var h = '<div class="rdx-on"><h4 class="rdx-h4">Oxidation-number changes</h4><ul class="rdx-chg">' + chg(R.on.red, "red") + chg(R.on.ox, "ox") + "</ul>" +
        box("a", "Multiplier for " + MV.plain(F(R.on.red.u)) + " (falls " + dOf(R.on.red) + ")", o.a) + box("b", "Multiplier for " + MV.plain(F(R.on.ox.u)) + " (rises " + dOf(R.on.ox) + ")", o.b);
      if (R.hasO) {
        h += '<p class="tiny muted">Then finish O and H. Leave a box blank for none.</p>';
        h += '<div class="rdx-prow"><label for="on-wn">H₂O</label><input class="numin rdx-num" id="on-wn" data-on="w.n" type="text" inputmode="numeric" maxlength="2" autocomplete="off" value="' + esc(o.w.n) + '"' + (busy ? " disabled" : "") + '><span class="rdx-sd" data-onside="w"></span></div>';
        h += '<div class="rdx-prow"><label for="on-hn">H⁺</label><input class="numin rdx-num" id="on-hn" data-on="h.n" type="text" inputmode="numeric" maxlength="2" autocomplete="off" value="' + esc(o.h.n) + '"' + (busy ? " disabled" : "") + '><span class="rdx-sd" data-onside="h"></span></div>';
        if (R.basic) h += '<div class="rdx-prow"><label for="on-ohn">OH⁻ (basic)</label><input class="numin rdx-num" id="on-ohn" data-on="oh.n" type="text" inputmode="numeric" maxlength="2" autocomplete="off" value="' + esc(o.oh.n) + '"' + (busy ? " disabled" : "") + '><span class="rdx-sd" data-onside="oh"></span></div>';
      }
      work.innerHTML = h + "</div>";
      MV.$$("[data-onside]", work).forEach(function(el){
        var k = el.dataset.onside, g = radios(el, { aria:"Side for " + (k === "w" ? "H₂O" : k === "h" ? "H⁺" : "OH⁻"), options:k === "oh" ? OHSIDES : SIDES, value:o[k].s, onChange:function(v){ touch(); o[k].s = v; api.save(); paintBoard(); paintRead(); MV.changed(); } });
        if (busy) g.lock(true);
      });
      return;
    }
    work.innerHTML = '<div class="rdx-stepbox"><h4 class="rdx-h4">Steps</h4><ol class="rdx-steps"></ol><div class="rdx-xtra"></div></div><div class="rdx-panel" hidden></div><div class="rdx-note" aria-live="polite"></div>';
    paintSteps(); paintPanel(); paintNote();
  }
  function paintSteps(){
    var ol = $(".rdx-steps", work); if (!ol) return;
    var st = cur();
    MV.keepFocus(ol, function(){
      ol.innerHTML = stepsList().map(function(s, i){ var d = !!st[DONE[s.id]]; return '<li><button type="button" class="rdx-step' + (open === s.id ? " on" : "") + (d ? " done" : "") + '" data-step="' + s.id + '" data-k="st-' + s.id + '"' + (busy ? " disabled" : "") + '><span class="rdx-sn">' + (i + 1) + ".</span> " + s.t + (d ? ' <span class="rdx-ok" aria-hidden="true">✓</span><span class="vh"> (done)</span>' : "") + "</button></li>"; }).join("");
    });
    var x = $(".rdx-xtra", work), q = st.add ? overall(st, S.rx) : null;
    x.innerHTML = st.ohD && !st.can && q && both(q, "H2O") ? '<button type="button" class="btn ghost sm" data-act="cancelw" data-k="cancelw"' + (busy ? " disabled" : "") + ">Cancel water that appears on both sides</button>" : "";
  }
  function paintNote(){ var n = $(".rdx-note", work); if (n) n.innerHTML = note; }
  function numIn(key, val, lab){ return '<input class="numin rdx-num" type="text" inputmode="numeric" maxlength="2" autocomplete="off" data-in="' + key + '" data-k="in-' + key + '" aria-label="' + esc(lab) + '" value="' + esc(val) + '">'; }
  function paintPanel(){
    var p = $(".rdx-panel", work); if (!p) return;
    if (!open) { p.hidden = true; p.innerHTML = ""; return; }
    var r = S.rx, R = RX[r], st = cur(), stp = C.steps.filter(function(s){ return s.id === open; })[0], h = '<h4 class="rdx-h4">' + stp.t + "</h4>", sides = [];
    if (open === "atoms") {
      ["red", "ox"].forEach(function(hh){
        function part(sd){ return R[hh][sd].map(function(s, i){ var k = "at:" + hh + ":" + sd + ":" + i; return '<span class="rdx-cbt">' + numIn(k, draft[k], "Coefficient of " + MV.plain(F(s)) + " in the " + HN[hh] + " half") + " " + termHTML(s, 1) + "</span>"; }).join(" + "); }
        h += '<div class="rdx-prow"><span class="rdx-plab">' + (hh === "red" ? "Reduction" : "Oxidation") + " half</span> " + part("L") + ' <span class="rdx-op">→</span> ' + part("R") + "</div>";
      });
    } else if (open === "water" || open === "hplus" || open === "elec") {
      var k = { water:"w", hplus:"h", elec:"e" }[open], s = MSP[k];
      ["red", "ox"].forEach(function(hh){
        var key = k + ":" + hh;
        h += '<div class="rdx-prow"><span class="rdx-plab">' + (hh === "red" ? "Reduction" : "Oxidation") + " half</span> add " + numIn(key + ":n", draft[key + ":n"], "Number of " + MV.plain(F(s)) + " in the " + HN[hh] + " half") + " " + termHTML(s, 1) + ' on the <span class="rdx-sd" data-pside="' + key + '"></span></div>';
        sides.push(key);
      });
      h += '<p class="tiny muted">Blank means none.</p>';
    } else if (open === "mult") {
      h += '<div class="rdx-prow"><span class="rdx-plab">Reduction half</span> × ' + numIn("m:red", draft["m:red"], "Multiplier for the reduction half") + "</div>";
      h += '<div class="rdx-prow"><span class="rdx-plab">Oxidation half</span> × ' + numIn("m:ox", draft["m:ox"], "Multiplier for the oxidation half") + "</div>";
    } else if (open === "oh") {
      h += '<div class="rdx-prow">Add ' + numIn("oh:n", draft["oh:n"], "Number of OH⁻ to add") + " " + termHTML("OH-", 1) + ' to <span class="rdx-sd" data-pside="oh"></span></div>';
      sides.push("oh");
    }
    h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="apply" data-k="apply">Apply</button><button type="button" class="btn ghost sm" data-act="close" data-k="close">Close</button></div><div class="rdx-perr" aria-live="polite">' + (perr ? MV.fbHTML("bad", perr) : "") + "</div>";
    p.hidden = false; p.innerHTML = h;
    sides.forEach(function(key){
      var el = p.querySelector('[data-pside="' + key + '"]');
      radios(el, { aria:"Side", options:key === "oh" ? OHSIDES : SIDES, value:draft[key + ":s"] || "", onChange:function(v){ draft[key + ":s"] = v; } });
    });
  }
  function initDraft(id, st){
    var d = {}, R = RX[S.rx];
    if (id === "atoms") ["red", "ox"].forEach(function(hh){ ["L", "R"].forEach(function(sd){ R[hh][sd].forEach(function(s, i){ d["at:" + hh + ":" + sd + ":" + i] = String(st.at[hh][sd][i]); }); }); });
    if (id === "water" || id === "hplus" || id === "elec") { var k = { water:"w", hplus:"h", elec:"e" }[id]; ["red", "ox"].forEach(function(hh){ var x = st[k][hh]; d[k + ":" + hh + ":n"] = x.n ? String(x.n) : ""; d[k + ":" + hh + ":s"] = x.s; }); }
    if (id === "mult") { d["m:red"] = String(st.m.red); d["m:ox"] = String(st.m.ox); }
    if (id === "oh") { d["oh:n"] = st.oh.n ? String(st.oh.n) : ""; d["oh:s"] = st.oh.s; }
    return d;
  }
  function blocked(id){
    var st = cur(), R = RX[S.rx];
    if (id === "split") return "";
    if (!st.split) return FB.needSplit;
    if (id === "atoms") return "";
    if (!st.atD) return FB.needAtoms;
    if (id === "water") return "";
    if (id === "hplus") return R.hasO && !st.wD ? FB.hBeforeW : "";
    if (id === "elec") return R.hasO && (!st.wD || !st.hD) ? FB.eBeforeH : "";
    if (id === "mult") return st.eD ? "" : FB.multEarly;
    if (id === "add") {
      if (!st.eD) return FB.multEarly;
      var ec = eCounts(st, S.rx), g = ec.g * st.m.red, l = ec.l * st.m.ox, gw = ec.gw * st.m.red, lw = ec.lw * st.m.ox;
      if (g + lw !== l + gw) return FB.addEarly.replace("{g}", g).replace("{l}", l);
      return "";
    }
    if (id === "oh") return st.add ? "" : FB.ohEarly;
    if (id === "check") return st.add ? "" : FB.checkEarly;
    return "";
  }
  function commit(){ api.save(); paint(); paintSteps(); paintPanel(); paintNote(); MV.changed(); }
  function stepClick(id){
    if (busy) return; touch(); perr = "";
    var st = cur(), why = blocked(id);
    if (why) { note = MV.fbHTML("bad", "<strong>✗ Not yet.</strong> " + why); open = ""; paintSteps(); paintPanel(); paintNote(); paint(); return; }
    note = "";
    if (id === "split") { st.split = true; st.chk = false; rowFl = { red:1, ox:1 }; open = ""; commit(); return; }
    if (id === "add") {
      st.add = true; st.chk = false; open = "";
      addFx = true; var my = ++run;
      window.setTimeout(function(){ if (my !== run || !addFx) return; addFx = false; paint(); }, 1300);
      commit(); return;
    }
    if (id === "check") {
      var q = overall(st, S.rx), t = tally(q), msg = hStatus(st, S.rx);
      st.chk = true; open = "";
      note = t.ok && gcdOf(q) === 1 && !(RX[S.rx].basic && (!st.ohD || cnt(q, "L", "H+") || both(q, "H2O"))) ? MV.fbHTML("good", "<strong>✓ Balanced.</strong> Atoms equal and charge " + qs(t.ql) + " = " + qs(t.qr) + ".") : MV.fbHTML("bad", "<strong>✗ Not yet.</strong> " + msg);
      api.save(); paint(); paintSteps(); paintPanel(); paintNote(); MV.changed(); return;
    }
    open = id; draft = initDraft(id, st); paintSteps(); paintPanel(); paintNote();
    var f = $(".rdx-panel input", work); if (f) f.focus();
  }
  function apply(){
    var st = cur(), r = S.rx, R = RX[r], id = open, nf = {}, err = "";
    if (id === "atoms") {
      var vals = {};
      ["red", "ox"].forEach(function(hh){ ["L", "R"].forEach(function(sd){ R[hh][sd].forEach(function(s, i){ var v = int(draft["at:" + hh + ":" + sd + ":" + i], 1, 20, 1); if (v == null) err = "Enter whole numbers from 1 to 20."; vals[hh + sd + i] = v; }); }); });
      if (err) { perr = err; paintPanel(); return; }
      ["red", "ox"].forEach(function(hh){ ["L", "R"].forEach(function(sd){ R[hh][sd].forEach(function(s, i){ var v = vals[hh + sd + i]; if (v !== st.at[hh][sd][i]) nf[hh + ":" + sd + ":" + s] = 1; st.at[hh][sd][i] = v; }); }); });
      st.atD = true;
    } else if (id === "water" || id === "hplus" || id === "elec") {
      var k = { water:"w", hplus:"h", elec:"e" }[id], nv = {};
      ["red", "ox"].forEach(function(hh){ var n = int(draft[k + ":" + hh + ":n"], 0, 40, 0), s = draft[k + ":" + hh + ":s"] || ""; if (n == null) err = "Enter whole numbers from 0 to 40."; else if (n > 0 && !s) err = err || "Choose a side for the " + HN[hh] + " half."; nv[hh] = { n:n || 0, s:n ? s : "" }; });
      if (err) { perr = err; paintPanel(); return; }
      ["red", "ox"].forEach(function(hh){ var x = nv[hh]; if (x.n && (x.n !== st[k][hh].n || x.s !== st[k][hh].s)) nf[hh + ":" + x.s + ":" + MSP[k]] = 1; st[k][hh] = x; });
      st[k + "D"] = true;
      if (k === "e") ["red", "ox"].forEach(function(hh){ var x = st.e[hh], g = eSide(st, r, hh); if (x.n && g && x.s !== g) note = MV.fbHTML("bad", "<strong>✗ Check the " + HN[hh] + " half.</strong> " + FB.eSide); });
    } else if (id === "mult") {
      var a = int(draft["m:red"], 1, 20, null), b = int(draft["m:ox"], 1, 20, null);
      if (a == null || b == null) { perr = "Enter whole-number multipliers from 1 to 20."; paintPanel(); return; }
      rowFl = { red:a !== st.m.red ? 1 : 0, ox:b !== st.m.ox ? 1 : 0 }; st.m = { red:a, ox:b }; st.mD = true;
    } else if (id === "oh") {
      var n = int(draft["oh:n"], 0, 40, 0), s = draft["oh:s"] || "";
      if (n == null) { perr = "Enter a whole number from 0 to 40."; paintPanel(); return; }
      if (n > 0 && !s) { perr = "Choose where to add the OH⁻."; paintPanel(); return; }
      st.oh = { n:n, s:n ? s : "" }; st.ohD = true; st.can = false; nf["all:L:OH-"] = nf["all:R:OH-"] = nf["all:L:H2O"] = 1;
    }
    st.chk = false; perr = ""; open = ""; fl = nf;
    api.save(); paint(); paintSteps(); paintPanel(); paintNote(); MV.changed();
    var b2 = work.querySelector('[data-k="st-' + id + '"]'); if (b2) b2.focus();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.step) { stepClick(b.dataset.step); return; }
    var a = b.dataset.act; if (!a || busy) return;
    if (a === "apply") apply();
    else if (a === "close") { var id = open; open = ""; perr = ""; paintSteps(); paintPanel(); var sb = work.querySelector('[data-k="st-' + id + '"]'); if (sb) sb.focus(); }
    else if (a === "cancelw") { touch(); cur().can = true; cur().chk = false; fl = { "all:L:H2O":1 }; api.save(); paint(); paintSteps(); MV.changed(); var sb2 = work.querySelector('[data-k="st-check"]'); if (sb2) sb2.focus(); }
    else if (a === "reset") { touch(); S.h[S.rx] = newH(S.rx); S.on[S.rx] = newOn(); open = ""; note = ""; perr = ""; draft = {}; api.save(); paintWork(); paint(); MV.changed(); }
  });
  host.addEventListener("input", function(e){
    var d = e.target.dataset; if (!d) return;
    if (d.in) { draft[d.in] = e.target.value; return; }
    if (d.on) { touch(); var o = S.on[S.rx], p = d.on.split("."); if (p.length > 1) o[p[0]][p[1]] = e.target.value; else o[p[0]] = e.target.value; api.save(); paintBoard(); paintRead(); MV.changed(); }
  });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.in) { e.preventDefault(); apply(); } });
  function paint(){ paintBoard(); paintRead(); }
  function lock(b){ busy = b; RG.rx.lock(b); RG.m.lock(b); paintWork(); paint(); }

  // ----- predictions -----
  function setup(r, st){ run++; touch(); S.rx = r; S.method = "half"; open = ""; note = ""; perr = ""; S.h[r] = st; RG.rx.set(r); RG.m.set("half"); api.save(); }
  var hooks = {
    start:function(p){
      var st;
      if (p.id === "p1") { setup("e1", newH("e1")); }
      else if (p.id === "p2") { st = newH("e2"); st.split = true; st.atD = true; setup("e2", st); }
      else if (p.id === "p3") { st = newH("e2"); st.split = true; st.atD = true; st.w.red = { n:4, s:"R" }; st.wD = true; st.h.red = { n:8, s:"L" }; st.hD = true; setup("e2", st); }
      else {
        st = newH("e4"); st.split = true; st.atD = true; st.at.ox.L = [2]; st.w.red = { n:2, s:"R" }; st.wD = true; st.h.red = { n:4, s:"L" }; st.hD = true;
        st.e.red = { n:3, s:"L" }; st.e.ox = { n:2, s:"R" }; st.eD = true; st.m = { red:2, ox:3 }; st.mD = true; st.add = true; st.demo = true; setup("e4", st);
      }
      lock(true);
    },
    run:function(p, done){
      var my = run, st = cur();
      function fin(){ if (my !== run) return; busy = false; RG.rx.lock(false); RG.m.lock(false); paintWork(); paint(); MV.changed(); MV.wait(150, done); }
      function at(ms, fn){ MV.wait(ms, function(){ if (my === run) fn(); }); }
      if (p.id === "p1") {
        at(500, function(){ talFx = true; paint();
          at(1200, function(){ ovr = { row:"skel", lab:"Skeleton, balanced", q:parseEq("Cu + 2Ag+ -> Cu^2+ + 2Ag"), fl:{ "L:Ag+":1, "R:Ag":1 }, badge:"×2 on Ag⁺ → Ag" }; talFx = false; paint(); at(700, fin); }); });
      } else if (p.id === "p2") {
        at(600, function(){ st.w.red = { n:4, s:"R" }; st.wD = true; fl = { "red:R:H2O":1 }; api.save(); paint(); at(500, fin); });
      } else if (p.id === "p3") {
        at(600, function(){ st.e.red = { n:5, s:"L" }; fl = { "red:L:e-":1 }; api.save(); paint(); at(500, fin); });
      } else {
        var base = overall(st, "e4"), f1 = addOH(copy(base), 8, "both"), f2 = combine(copy(f1)), f3 = copy(f2), f4 = cancel(copy(f2));
        var steps = [
          { q:f1, fl:{ "L:OH-":1, "R:OH-":1 }, s:"8OH⁻ are added to both sides." },
          { q:f2, fl:{ "L:H2O":1 }, s:"8H⁺ + 8OH⁻ on the left become 8H₂O." },
          { q:f3, st:{ "R:H2O":1 }, s:"4H₂O cancels from the right, leaving 4H₂O on the left." },
          { q:f4, fl:{ "R:OH-":1 }, s:"Basic: 2MnO₄⁻ + 6I⁻ + 4H₂O → 2MnO₂ + 3I₂ + 8OH⁻." }];
        var i = 0;
        (function nx(){ if (my !== run) return; if (i >= steps.length) { st.oh = { n:8, s:"both" }; st.ohD = true; st.can = true; ovr = null; api.save(); fin(); return; }
          var s = steps[i++]; ovr = { row:"all", q:s.q, fl:s.fl, st:s.st, status:s.s }; paint(); at(1300, nx); })();
      }
    }
  };

  // ----- challenges -----
  function chal(id){
    var c = C.challenges.filter(function(x){ return x.id === id; })[0], r = c.rx, st = S.h[r], CM = C.chalMsgs, m = c.msgs;
    function bad(t){ return { ok:false, msg:t }; }
    if (S.rx !== r) return bad(CM.pick.replace("{rx}", r.toUpperCase()));
    if (S.method === "half" && st.demo) return bad(FB.demo);
    var q = S.method === "half" ? overall(st, r) : onEq(r);
    if (!q) return bad(S.method === "half" ? CM.unfinishedHalf : CM.unfinishedOn);
    var ans = parseEq(MV.ans(c));
    if (same(q, ans)) return { ok:true };
    var k = propK(q, ans); if (k) return bad(CM.lowest.replace("{k}", k));
    if (id === "tc1") { if (cnt(q, "L", "Fe^2+") === 1) return bad(m.fe1); if (cnt(q, "L", "H+") === 4) return bad(m.h4); if (cnt(q, "L", "e-") || cnt(q, "R", "e-")) return bad(m.eLeft); }
    if (id === "tc2") { if (cnt(q, "R", "Cr^3+") === 1) return bad(m.cr1); if (S.method === "half" && st.e.red.n === 3) return bad(m.e3); if (cnt(q, "L", "I-") === 2) return bad(m.i2); }
    if (id === "tc3") { if (cnt(q, "L", "H+") || cnt(q, "R", "H+")) return bad(m.hplus); if (both(q, "H2O")) return bad(m.water); if (cnt(q, "L", "OH-")) return bad(m.ohLeft); }
    var t = tally(q); if (!t.ok) return bad("Check the tally: " + misText(t) + ".");
    return bad(CM.general);
  }

  paintWork(); paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- @component N4 coefBoxes — coefficient boxes for a skeleton (blank main box = 1), H⁺ / H₂O / OH⁻ boxes with a
// left/right radio pair (blank = 0), live preview equation with an atom and charge tally, Check with first-try tracking
// and three-level hints. coefList(host, items, store, {fb, numbered}) -> {stats(), missed()} ----------
function coefList(host, items, store, o){
  var msgs = {};
  function ist(id){ var x = store[id] || (store[id] = { v:{}, s:{}, tries:0, hint:0, solved:false, first:null }); if (!x.v || typeof x.v !== "object") x.v = {}; if (!x.s || typeof x.s !== "object") x.s = {}; return x; }
  function build(it, x){
    var q = eqNew(), bad = "";
    ["L", "R"].forEach(function(sd){ it[sd].forEach(function(s){ var n = int(x.v[sd + ":" + s], 1, 99, 1); if (n == null) bad = o.fb.whole; else put(q, sd, s, n); }); });
    (it.med || []).forEach(function(s){ var n = int(x.v["m:" + s], 0, 99, 0); if (n == null) bad = o.fb.whole; else if (n > 0) { if (!x.s[s]) bad = bad || o.fb.side.replace("{sp}", MV.plain(F(s))); else put(q, x.s[s], s, n); } });
    return bad ? { bad:bad, q:clean(q) } : { q:clean(q) };
  }
  function ord(it){ return it.L.concat(it.R); }
  function pvHTML(it, x){ var b = build(it, x); return '<span class="tiny muted">Your equation:</span> ' + eqHTML(b.q, ord(it)) + '<br><span class="rdx-tal rdx-tal-in"><span class="vh">Tally: </span>' + talHTML(tally(b.q)) + "</span>"; }
  function boxIn(it, key, ph, lab, x){ return '<input class="numin rdx-num" type="text" inputmode="numeric" maxlength="2" autocomplete="off" placeholder="' + ph + '" data-cv="' + it.id + "|" + key + '" data-k="' + it.id + key + '" aria-label="' + esc(lab) + '" value="' + esc(x.v[key] || "") + '"' + (x.solved ? " disabled" : "") + ">"; }
  function itemHTML(it, i){
    var x = ist(it.id), h = '<div class="q" data-ri="' + it.id + '"><div class="q-head">' + (o.numbered ? '<span class="qn" aria-hidden="true">' + (i + 1) + "</span>" : "") + '<div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    function part(sd){ return it[sd].map(function(s){ return '<span class="rdx-cbt">' + boxIn(it, sd + ":" + s, "1", "Coefficient of " + MV.plain(F(s)), x) + " " + termHTML(s, 1) + "</span>"; }).join(' <span class="rdx-op">+</span> '); }
    h += '<div class="rdx-cb"><p class="rdx-cbeq">' + part("L") + ' <span class="rdx-op">→</span> ' + part("R") + "</p>";
    if ((it.med || []).length) h += '<div class="rdx-cbmed">' + it.med.map(function(s){ return '<div class="rdx-prow">' + boxIn(it, "m:" + s, "0", "Number of " + MV.plain(F(s)), x) + " " + termHTML(s, 1) + ' on the <span class="rdx-sd" data-cs="' + it.id + "|" + s + '"></span></div>'; }).join("") + "</div>";
    h += '<p class="rdx-cbpv" data-pv="' + it.id + '">' + pvHTML(it, x) + "</p></div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){
    MV.keepFocus(host, function(){ host.innerHTML = (o.how ? '<p class="how">' + o.how + "</p>" : "") + items.map(itemHTML).join(""); });
    MV.$$("[data-cs]", host).forEach(function(el){
      var p = el.dataset.cs.split("|"), it = items.filter(function(y){ return y.id === p[0]; })[0], x = ist(p[0]);
      var g = radios(el, { aria:"Side for " + MV.plain(F(p[1])), options:SIDES, value:x.s[p[1]] || "", onChange:function(v){ x.s[p[1]] = v; msgs[it.id] = null; if (o.save) o.save(); pv(it); } });
      if (x.solved) g.lock(true);
    });
  }
  function pv(it){ var el = host.querySelector('[data-pv="' + it.id + '"]'); if (el) el.innerHTML = pvHTML(it, ist(it.id)); }
  function judge(it, x){
    var b = build(it, x); if (b.bad) return { soft:b.bad };
    var q = b.q, ans = parseEq(MV.ans(it));
    if (same(q, ans)) return { ok:true };
    var k = propK(q, ans); if (k) return { fb:o.fb.lowest.replace("{k}", k) };
    var w = (it.wrong || []).filter(function(w){ if (w.eq) return same(q, parseEq(w.eq)); var c = w.side ? cnt(q, w.side, w.sp) : cnt(q, "L", w.sp) + cnt(q, "R", w.sp); return w.min ? c >= w.min : c === w.n; })[0];
    if (w) return { fb:w.fb };
    if (it.medium === "acid" && (cnt(q, "L", "OH-") || cnt(q, "R", "OH-"))) return { fb:o.fb.acidOH };
    var t = tally(q); if (!t.ok) return { fb:"Check the tally: " + misText(t) + "." };
    return { fb:o.fb.other };
  }
  host.addEventListener("input", function(e){ var d = e.target.dataset; if (!d || !d.cv) return; var p = d.cv.split("|"), x = ist(p[0]); x.v[p[1]] = e.target.value; if (o.save) o.save(); pv(items.filter(function(y){ return y.id === p[0]; })[0]); });
  host.addEventListener("keydown", function(e){ var d = e.target.dataset; if (e.key === "Enter" && d && d.cv) { var b = host.querySelector('[data-k="' + d.cv.split("|")[0] + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ri]"); if (!bx) return;
    var it = items.filter(function(y){ return y.id === bx.dataset.ri; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); if (o.save) o.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.soft) { msgs[it.id] = { t:r.soft, soft:true }; paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = { t:r.fb }; }
      if (o.save) o.save(); paint(); MV.focusFb(host.querySelector('[data-ri="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, dn = 0; items.forEach(function(it){ var x = ist(it.id); if (x.solved) dn++; if (x.first) f++; }); return { first:f, total:items.length, done:dn, line:(o.summary || "") + " (first try): " + f + "/" + items.length + (dn < items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}
function balanceAct(host, api, a){
  var S = api.S; if (!S.items || typeof S.items !== "object") S.items = {};
  return coefList(host, a.items, S.items, { fb:a.fb, numbered:true, how:a.how, summary:a.summary, save:api.save });
}

// ---------- Part 3: Special cases ----------
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3, s4 = C.s4;
  if (!S.flip || typeof S.flip !== "object") S.flip = {};
  if (!S.gone || typeof S.gone !== "object") S.gone = {};
  S.vol = Math.max(0, Math.min(2500, Math.round(+S.vol || 0)));
  if (!S.bt || typeof S.bt !== "object") S.bt = {};
  var m1 = "", m2 = "", m3 = "", m3d = "", swirl = false, lastFlip = "";
  host.innerHTML =
    '<div class="rdx-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="rdx-sets"></div><div class="rdx-s1q"><p class="rdx-qp">' + s1.q + '</p><div class="rdx-s1ch"></div><div class="rdx-m1" aria-live="polite"></div></div>' +
      '<details class="alg"><summary>Check it with data</summary>' + s1.data + "</details></div>" +
    '<div class="part rdx-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><p class="tiny muted">' + s2.full + '</p><div class="rdx-tiles" role="group" aria-label="Ionic equation: tap the spectator ions"></div><div class="rdx-m2" aria-live="polite"></div>' +
      '<details class="alg"><summary>Check it with data</summary><p>' + F("K+ + MnO4- + 5Fe^2+ + 5SO4^2- + 8H+ -> K+ + Mn^2+ + 5Fe^3+ + 5SO4^2- + 4H2O") + "</p><p>K 1 = 1 · Mn 1 = 1 · O 24 = 24 · Fe 5 = 5 · S 5 = 5 · H 8 = 8 · charge +8 = +8</p></details></div>" +
    '<div class="part rdx-st"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><div class="rdx-tgrid"><div class="rdx-flaskbox"></div><div><div class="q-actions rdx-tbtns">' +
      '<button type="button" class="btn ghost sm" data-ti="100" data-k="ti100">Add 1.00 mL</button><button type="button" class="btn ghost sm" data-ti="5" data-k="ti5">Add one drop (0.05 mL)</button><button type="button" class="btn ghost sm" data-ti="0" data-k="ti0">Empty and start again</button></div>' +
      '<dl class="read rdx-tread" aria-live="polite"></dl><div class="rdx-m3" aria-live="polite"></div></div></div>' +
      '<details class="alg"><summary>Check it with data</summary><p>' + s3.q + '</p><div class="numrow"><label for="rdx-mol">mol Fe²⁺:</label><input class="numin" id="rdx-mol" type="text" inputmode="decimal" autocomplete="off" spellcheck="false"><button type="button" class="btn primary sm" data-act="mol" data-k="mol">Check</button></div><div class="rdx-m3d" aria-live="polite"></div></details></div>' +
    '<div class="part rdx-st"><h3>' + s4.title + "</h3><p>" + s4.intro + '</p><p class="rdx-sw"><span class="rdx-swatch" style="background:var(--rdx-cr2o7)" aria-hidden="true"></span> orange Cr₂O₇²⁻ → <span class="rdx-swatch" style="background:var(--rdx-cr3)" aria-hidden="true"></span> green Cr³⁺</p><p>' + s4.task + '</p><div class="rdx-bt"></div><p class="tiny muted">' + s4.note + "</p></div>";

  // station 1: flip cards
  function paint1(){
    var box = $(".rdx-sets", host);
    MV.keepFocus(box, function(){
      box.innerHTML = s1.sets.map(function(set){ return '<div class="rdx-set"><p class="rdx-setn"><strong>' + set.name + '</strong></p><div class="rdx-cards">' + set.cards.map(function(c, i){
        var id = set.id + i, on = !!S.flip[id];
        return '<button type="button" class="rdx-card' + (on ? " on" : "") + (on && lastFlip === id && !MV.reduceMotion ? " rdx-flip" : "") + '" data-flip="' + id + '" data-k="fl' + id + '" aria-pressed="' + on + '"><span class="rdx-cf">' + c.front + "</span>" + (on ? '<span class="rdx-cb2">' + F(c.back) + '</span><span class="tiny muted">' + c.note + "</span>" : '<span class="tiny muted">Tap to flip</span>') + "</button>";
      }).join("") + "</div></div>"; }).join("");
    });
    lastFlip = "";
  }
  $(".rdx-sets", host).addEventListener("click", function(e){ var b = e.target.closest("[data-flip]"); if (!b) return; var id = b.dataset.flip; S.flip[id] = !S.flip[id]; lastFlip = S.flip[id] ? id : ""; api.save(); paint1(); });
  paint1();
  radios($(".rdx-s1ch", host), { aria:"Oxidizing agent", cls:"chips", options:s1.opts.map(function(x, i){ return { id:String(i), t:x.t }; }), value:S.s1q == null ? "" : String(S.s1q), onChange:function(v){ S.s1q = +v; api.save(); paintM1(); MV.focusFb($(".rdx-m1", host)); } });
  function paintM1(){ var x = S.s1q == null ? null : s1.opts[S.s1q]; $(".rdx-m1", host).innerHTML = x ? MV.fbHTML(MV.ok(x) ? "good" : "bad", (MV.ok(x) ? "<strong>✓</strong> " : "<strong>✗ Not quite.</strong> ") + x.fb) : ""; }
  paintM1();

  // station 2: spectator tiles
  function paint2(){
    var box = $(".rdx-tiles", host);
    function tile(t){ var off = t.spec && S.gone[t.spec]; return '<button type="button" class="rdx-tile' + (off ? " off" : "") + '" data-tile="' + t.id + '" data-k="tl' + t.id + '" aria-label="' + esc(MV.plain(F(t.sp)) + (off ? ", spectator, faded" : "")) + '"' + (off ? ' aria-disabled="true"' : "") + ">" + F(t.sp) + "</button>"; }
    MV.keepFocus(box, function(){
      box.innerHTML = s2.tiles.filter(function(t){ return t.side === "L"; }).map(tile).join(' <span class="rdx-op">+</span> ') + ' <span class="rdx-op">→</span> ' + s2.tiles.filter(function(t){ return t.side === "R"; }).map(tile).join(' <span class="rdx-op">+</span> ');
    });
    var all = S.gone.k && S.gone.s;
    $(".rdx-m2", host).innerHTML = (m2 || "") + (all ? '<p class="rdx-net"><strong>Net ionic equation:</strong> ' + eqHTML(parseEq(s2.net), RX.e2.ord) + "</p>" + MV.fbHTML("good", "<strong>✓ Both spectators gone.</strong> " + s2.done) : "");
  }
  $(".rdx-tiles", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-tile]"); if (!b) return;
    var t = s2.tiles.filter(function(x){ return x.id === b.dataset.tile; })[0];
    if (t.spec) { if (S.gone[t.spec]) return; S.gone[t.spec] = true; m2 = S.gone.k && S.gone.s ? "" : MV.fbHTML("good", "<strong>✓ Spectator.</strong> " + s2.good[t.spec]); }
    else m2 = MV.fbHTML("bad", "<strong>✗ Not a spectator.</strong> " + t.why);
    api.save(); paint2(); MV.focusFb($(".rdx-m2", host));
  });
  paint2();

  // station 3: titration flask (C9 still, colours named in words)
  var END = Math.round(s3.endV * 100);
  function colour(){ var v = S.vol; if (v <= END) return { c:"--rdx-fe2", w:"pale green: Fe²⁺ remains" }; if (v <= END + 5) return { c:"--rdx-pink", w:"pale pink that stays: the end point" }; return { c:"--rdx-pp", w:"pink-purple: past the end point" }; }
  function mL(v){ return (v / 100).toFixed(2) + " mL"; }
  function paint3(){
    var col = colour(), lvl = 86 * (2500 - S.vol) / 2500;
    $(".rdx-flaskbox", host).innerHTML = '<svg class="rdx-flask" viewBox="0 0 200 230" role="img" aria-label="' + esc("Burette of purple permanganate above a flask. Volume added " + mL(S.vol) + ". The flask is " + col.w + ".") + '">' +
      '<rect x="92" y="' + (6 + 86 - lvl).toFixed(1) + '" width="16" height="' + lvl.toFixed(1) + '" fill="var(--rdx-mno4)"/><rect x="92" y="6" width="16" height="86" fill="none" stroke="var(--ink-2)" stroke-width="1.6"/>' +
      '<path d="M96 92 L104 92 L101 106 L99 106 Z" fill="var(--ink-2)"/>' +
      '<path d="M66 165 L134 165 L160 207 Q162 214 154 214 L46 214 Q38 214 40 207 Z" fill="var(' + col.c + ')"/>' +
      (swirl && !MV.reduceMotion ? '<ellipse class="rdx-swirl" cx="100" cy="190" rx="26" ry="9" fill="var(--rdx-mno4)"/>' : "") +
      '<path d="M82 116 L82 146 L40 207 Q38 214 46 214 L154 214 Q162 214 160 207 L118 146 L118 116" fill="none" stroke="var(--ink-2)" stroke-width="2"/></svg>';
    $(".rdx-tread", host).innerHTML = MV.readoutHTML([["Volume added", mL(S.vol)], ["Colour", col.w]]);
    $(".rdx-m3", host).innerHTML = m3;
    swirl = false;
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-ti]"); if (!b) return;
    var d = +b.dataset.ti, before = S.vol;
    if (!d) { S.vol = 0; m3 = ""; }
    else if (S.vol >= 2500) m3 = MV.fbHTML("", "The burette is empty. Start again.");
    else {
      S.vol = Math.min(2500, S.vol + d);
      if (S.vol <= END) { swirl = true; m3 = MV.fbHTML("", "A purple swirl fades: MnO₄⁻ is reduced to nearly colourless Mn²⁺ while Fe²⁺ remains."); }
      else if (before <= END && S.vol <= END + 5) m3 = MV.fbHTML("good", "<strong>✓ End point.</strong> The first drop stays pink: all the Fe²⁺ is used up, so this MnO₄⁻ isn’t reduced. " + s3.endV.toFixed(1) + " mL reacted.");
      else if (before <= END) m3 = MV.fbHTML("bad", "<strong>Past the end point.</strong> You added too much at once. Start again and add one drop at a time near the end.");
      else m3 = MV.fbHTML("", "Past the end point: extra MnO₄⁻ only deepens the colour.");
    }
    api.save(); paint3();
  });
  paint3();
  function molVal(s){
    s = String(s || "").replace(/[\s  ]/g, "").replace(/mol$/i, "").replace(/−/g, "-");
    var m = /^(\d*\.?\d+)(?:(?:e|×10\^?|x10\^?)(-?\d+))?$/i.exec(s); if (!m) return null;
    return +m[1] * (m[2] ? Math.pow(10, +m[2]) : 1);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest('[data-act="mol"]'); if (!b) return;
    var v = molVal($("#rdx-mol").value), ans = MV.ans(s3);
    if (v == null) m3d = MV.fbHTML("", "Enter a number of moles, such as 0.0012.");
    else if (Math.abs(v - ans) < 1e-7) m3d = MV.fbHTML("good", "<strong>✓ Correct.</strong> " + s3.good);
    else if (Math.abs(v - ans / 25) < 1e-8) m3d = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + s3.div);
    else m3d = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + s3.bad);
    $(".rdx-m3d", host).innerHTML = m3d; MV.focusFb($(".rdx-m3d", host));
  });
  $("#rdx-mol").addEventListener("keydown", function(e){ if (e.key === "Enter") { e.preventDefault(); host.querySelector('[data-act="mol"]').click(); } });

  // station 4: the breath-test balance (N4 boxes, not scored)
  var bal = (MV.C.practice.activities.filter(function(x){ return x.id === "balance"; })[0] || {}).fb;
  coefList($(".rdx-bt", host), [s4.item], S.bt, { fb:bal, numbered:false, save:api.save });
}

// ---------- Performance task: Pick a titration reaction ----------
var task = (function(){
  var S = null, api = null, T = null;
  var OXD = { fe:{ q:"Fe^2+ -> Fe^3+ + e-", e:1 }, i:{ q:"2I- -> I2 + 2e-", e:2 }, zn:{ q:"Zn -> Zn^2+ + 2e-", e:2 }, pe:{ q:"H2O2 -> O2 + 2H+ + 2e-", e:2 }, so:{ q:"SO3^2- + H2O -> SO4^2- + 2H+ + 2e-", e:2 } };
  var RDD = { mn:{ q:"MnO4- + 8H+ + 5e- -> Mn^2+ + 4H2O", e:5, col:true }, cr:{ q:"Cr2O7^2- + 14H+ + 6e- -> 2Cr^3+ + 7H2O", e:6, col:true }, ag:{ q:"Ag+ + e- -> Ag", e:1 }, cu:{ q:"Cu^2+ + 2e- -> Cu", e:2 } };
  function read(){ return { ox:S && OXD[S.ox] ? S.ox : "", red:S && RDD[S.red] ? S.red : "", a:S ? +S.a || 0 : 0, b:S ? +S.b || 0 : 0 }; }
  function mains(q){ return q.L.concat(q.R).map(function(t){ return t[0]; }).filter(function(s){ return !MEDR[s]; }); }
  function overallOf(d){
    var ox = parseEq(OXD[d.ox].q), rd = parseEq(RDD[d.red].q), q = cancel(sum(scale(ox, d.a), scale(rd, d.b)));
    var ordL = mains({ L:ox.L, R:[] }).concat(mains({ L:rd.L, R:[] })), ordR = mains({ L:[], R:ox.R }).concat(mains({ L:[], R:rd.R }));
    return { q:q, ord:ordL.concat(ordR) };
  }
  function paint(){
    var d = read(), pv = $("#rdx-tkpv"); if (!pv) return;
    if (!d.ox || !d.red || !d.a || !d.b) { pv.innerHTML = '<p class="muted">Choose both halves and both multipliers to see the overall equation.</p>'; return; }
    var o = overallOf(d), t = tally(o.q), red = T.red.filter(function(x){ return x.id === d.red; })[0];
    pv.innerHTML = '<p class="rdx-eq">' + eqHTML(o.q, o.ord) + '</p><p class="rdx-tal"><span class="vh">Tally: </span>' + talHTML(t) + "</p>" +
      '<dl class="read">' + MV.readoutHTML([["Electrons", "lost " + OXD[d.ox].e + " × " + d.a + " = " + OXD[d.ox].e * d.a + " · gained " + RDD[d.red].e + " × " + d.b + " = " + RDD[d.red].e * d.b], ["Colour in the burette", red.col]]) + "</dl>";
  }
  function lab(id, list){ return list.filter(function(x){ return x.id === id; })[0]; }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; T = MV.C.task;
      inp.innerHTML = '<div class="rdx-tq"><p class="rdx-lab">' + T.qOx + '</p><div class="rdx-tox"></div></div><div class="rdx-tq"><p class="rdx-lab">' + T.qRed + '</p><div class="rdx-tred"></div></div>' +
        '<div class="rdx-tq"><p class="rdx-lab">' + T.qA + '</p><div class="rdx-ta"></div></div><div class="rdx-tq"><p class="rdx-lab">' + T.qB + '</p><div class="rdx-tb"></div></div>';
      var nums = [1, 2, 3, 4, 5, 6].map(function(n){ return { id:String(n), t:String(n) }; });
      function ch(){ api.save(); paint(); api.update(); }
      radios($(".rdx-tox", inp), { aria:"Oxidation half", cls:"chips rdx-tchips", options:T.ox, value:S.ox || "", onChange:function(v){ S.ox = v; ch(); } });
      radios($(".rdx-tred", inp), { aria:"Reduction half", cls:"chips rdx-tchips", options:T.red, value:S.red || "", onChange:function(v){ S.red = v; ch(); } });
      radios($(".rdx-ta", inp), { aria:"Multiplier a", cls:"chips", options:nums, value:S.a ? String(S.a) : "", onChange:function(v){ S.a = +v; ch(); } });
      radios($(".rdx-tb", inp), { aria:"Multiplier b", cls:"chips", options:nums, value:S.b ? String(S.b) : "", onChange:function(v){ S.b = +v; ch(); } });
      pv.innerHTML = '<h4 class="rdx-h4">Overall equation (live)</h4><div class="rdx-tkpv" id="rdx-tkpv" aria-live="polite"></div>';
      paint();
    },
    read:read,
    valid:function(d){ return d.ox && d.red && d.a && d.b ? true : "Choose both halves and both multipliers first."; },
    checks:function(d){ if (!d.ox || !d.red || !d.a || !d.b) return [false, false, false, false]; return [d.a * OXD[d.ox].e === d.b * RDD[d.red].e, gcd(d.a, d.b) === 1, !!RDD[d.red].col, d.ox !== "zn"]; },
    key:function(d){ return d.ox + "|" + d.red + "|" + d.a + "|" + d.b; },
    label:function(k){ var p = k.split("|"), o = overallOf({ ox:p[0], red:p[1], a:+p[2], b:+p[3] }); return eqHTML(o.q, o.ord) + " (<em>a</em> = " + p[2] + ", <em>b</em> = " + p[3] + ")"; },
    text:function(k){ return MV.plain(this.label(k)).replace(/\s+/g, " ").trim(); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ balance:balanceAct },
  task:task
});
})();
