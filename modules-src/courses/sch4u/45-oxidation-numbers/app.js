// SCH4U 45 Assigning Oxidation Numbers: hero (zinc strip in Cu²⁺ solution; two electrons hop, the tags tick, copper
// deposits), Oxidation number calculator (Explore: C14 redox balancer in annotate mode — Assign mode with the rule rail,
// number boxes, sum bar and unknown-equation builder; Reaction mode with change arrows, electron hop and agent tags),
// Redox or not? (Part 3: tap-to-sort reaction cards with a particle zoom, the patterns table, the antioxidant panel),
// Agents and electrons (custom choice and number items) and One-to-one swap (task: metal + ion designer).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
var MI = "−", X = "<i>x</i>";
function esc(s){ return MV.esc(s); }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function r1(v){ return Math.round(v * 10) / 10; }
function LIN(t){ return t; }
function F(s){ return MV.chem.f(s); }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function near(a, b, tol){ return a != null && b != null && Math.abs(a - b) <= (tol || 1e-6); }
function fracOf(v){ for (var d = 1; d <= 6; d++) { var n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return [n, d]; } return [v, 1]; }
// oxidation number: sign first (+2, −1, 0, +8/3)
function on(v){ var p = fracOf(v), n = p[0], d = p[1]; if (n === 0) return "0"; return (n > 0 ? "+" : MI) + Math.abs(n) + (d > 1 ? "/" + d : ""); }
// ion charge: sign last (2+, −)
function qTxt(q){ return q ? (Math.abs(q) > 1 ? Math.abs(q) : "") + (q > 0 ? "+" : MI) : ""; }
function sub(n){ return n > 1 ? "<sub>" + n + "</sub>" : ""; }
function elColor(el){ return el === "H" ? "var(--ink)" : "var(" + MV.chem.colorVar(el) + ")"; }

// @component radioGroup (from MHF4U 25, via SCH4U 01–17) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock); with no option chosen yet, the first option holds the tab stop.
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange(id), disabled}) -> {set(id), get(), lock(bool), paint()}
function radios(host, o){
  var val = o.value == null ? "" : String(o.value), locked = false;
  function off(id){ return o.disabled ? o.disabled(id) : ""; }
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), first = true;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on1 = String(x.id) === val, d = locked || !!off(x.id), tab = on1 || (!any && first && !d); if (!d) first = false; return '<button type="button" role="radio" aria-checked="' + on1 + '" tabindex="' + (tab ? 0 : -1) + '" data-rg="' + esc(x.id) + '"' + (x.aria ? ' aria-label="' + esc(x.aria) + '"' : "") + (d ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked || off(id)) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(val); if (i < 0) i = d > 0 ? -1 : 0;
    for (var s = 0; s < ids.length; s++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); return; } }
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, paint:paint };
}

// ---------- @component C14 redox balancer (annotate mode) — reaction model, tagged equation, change arrows, electron hop ----------
// A species is {c (coefficient), at:[[el, count, oxidation number] | "(" | ")2"], q (charge), st (state)}. eqHTML(rx, o) draws a
// reaction with a tag above every atom; overlay(wrap, rx, st) measures the cells and draws violet change arrows below
// (↑ oxidation, ↓ reduction, labelled with the change) and the electron hop from reducing agent to oxidizing agent above.
function sp(c, at, q, st){ return { c:c, at:at, q:q || 0, st:st }; }
function spF(s, coef){
  return '<span class="chem">' + (coef && s.c > 1 ? s.c : "") + s.at.map(function(t){ return typeof t === "string" ? (t === "(" ? "(" : ")" + sub(+t.slice(1))) : t[0] + sub(t[1]); }).join("") + (s.q ? "<sup>" + qTxt(s.q) + "</sup>" : "") + "</span>";
}
function eqF(rx){ return rx.L.map(function(s){ return spF(s, true) + "(" + s.st + ")"; }).join(" + ") + " → " + rx.R.map(function(s){ return spF(s, true) + "(" + s.st + ")"; }).join(" + "); }
function cellsOf(list, side){ var out = []; list.forEach(function(s, i){ s.at.forEach(function(t, k){ if (typeof t !== "string") out.push({ key:side + i + "-" + k, el:t[0], v:t[2], si:i }); }); }); return out; }
function changes(rx){
  var L = cellsOf(rx.L, "L"), R = cellsOf(rx.R, "R"), out = [];
  L.forEach(function(a){ R.forEach(function(b){ if (a.el === b.el && !near(a.v, b.v)) out.push({ l:a.key, r:b.key, el:a.el, a:a.v, b:b.v, si:a.si }); }); });
  return out;
}
function changeText(rx){
  var seen = {}, out = [];
  changes(rx).forEach(function(c){ var k = c.el + c.a + c.b; if (seen[k]) return; seen[k] = 1; out.push(c.el + ": " + on(c.a) + " → " + on(c.b) + (c.b > c.a ? " (oxidized)" : " (reduced)")); });
  return out.join("; ");
}
var TAGW = { ox:"oxidized", red:"reduced", oa:"oxidizing agent", ra:"reducing agent" };
function spPlain(s){ return MV.plain(spF(s, true)) + "(" + s.st + "), oxidation numbers " + s.at.filter(function(t){ return typeof t !== "string"; }).map(function(t){ return t[0] + " " + MV.plain(on(t[2])); }).join(", "); }
function spHTML(s, key, o){
  var cells = '<span class="ox-cells">' + s.at.map(function(t, k){
    if (typeof t === "string") return '<span class="ox-cell ox-par"><span class="ox-tag ox-tag0" aria-hidden="true">0</span><span class="ox-el">' + (t === "(" ? "(" : ")" + sub(+t.slice(1))) + "</span></span>";
    return '<span class="ox-cell" data-cell="' + key + "-" + k + '"><span class="ox-tag">' + on(t[2]) + '</span><span class="ox-el" style="color:' + elColor(t[0]) + '">' + t[0] + sub(t[1]) + "</span></span>";
  }).join("") + (s.q ? '<span class="ox-q">' + qTxt(s.q) + "</span>" : "") + "</span>";
  var inner = (s.c > 1 ? '<span class="ox-coef">' + s.c + "</span>" : "") + cells + '<span class="ox-st">(' + s.st + ")</span>";
  var tg = [];
  if (o.tags) Object.keys(TAGW).forEach(function(t){ if (o.tags[t] === key) tg.push(TAGW[t]); });
  var tgH = o.tags ? '<span class="ox-sptags">' + tg.map(function(t){ return '<span class="ox-pill">' + t + "</span>"; }).join("") + "</span>" : "";
  if (o.pick) return '<button type="button" class="ox-sp ox-spb' + (o.sel === key ? " on" : "") + '" data-sp="' + key + '" data-k="' + (o.pref || "") + key + '" aria-pressed="' + (o.sel === key) + '" aria-label="' + esc(spPlain(s) + (tg.length ? "; tagged: " + tg.join(", ") : "")) + '"' + (o.dis ? " disabled" : "") + '><span class="ox-spf" aria-hidden="true">' + inner + "</span>" + tgH + "</button>";
  return '<span class="ox-sp" data-sp="' + key + '"><span class="ox-spf">' + inner + "</span>" + tgH + "</span>";
}
function eqHTML(rx, o){
  o = o || {};
  function side(list, p){ return '<span class="ox-eqs">' + list.map(function(s, i){ return spHTML(s, p + i, o); }).join('<span class="ox-plus" aria-hidden="true">+</span>') + "</span>"; }
  return '<div class="ox-eq">' + side(rx.L, "L") + '<span class="ox-arrow" aria-hidden="true">→</span>' + side(rx.R, "R") + "</div>";
}
function eCell(rx, si){
  var ch = changes(rx).filter(function(c){ return c.si === si; })[0];
  return ch ? ch.l : null;
}
function overlay(wrap, rx, st){
  var svg = wrap && wrap.querySelector("svg.ox-ov"); if (!svg) return;
  var W = wrap.clientWidth, H = wrap.clientHeight;
  if (!W || !H || !st) { svg.innerHTML = ""; return; }
  svg.setAttribute("viewBox", "0 0 " + W + " " + H);
  var box = wrap.getBoundingClientRect();
  function cell(key){
    var c = wrap.querySelector('[data-cell="' + key + '"]'); if (!c) return null;
    var r = c.getBoundingClientRect(), s = c.closest(".ox-sp").getBoundingClientRect();
    return { x:r.left + r.width / 2 - box.left, top:r.top - box.top, bot:s.bottom - box.top };
  }
  function head(x, y, ang, op){ var s = 8, a1 = ang + 2.6, a2 = ang - 2.6; return '<path d="M' + r1(x) + " " + r1(y) + " L" + r1(x + s * Math.cos(a1)) + " " + r1(y + s * Math.sin(a1)) + " L" + r1(x + s * Math.cos(a2)) + " " + r1(y + s * Math.sin(a2)) + 'Z" fill="var(--ec-e)" opacity="' + op + '"/>'; }
  function label(x, y, t, op){ return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ec-e)" stroke="var(--sheet)" stroke-width="4" paint-order="stroke" opacity="' + op + '">' + t + "</text>"; }
  var h = "", op = st.arcs == null ? 1 : st.arcs;
  if (op > 0) changes(rx).forEach(function(c, i){
    var a = cell(c.l), b = cell(c.r); if (!a || !b) return;
    var y0 = a.bot + 3, y1 = b.bot + 3, cy = Math.max(y0, y1) + 26 + (i % 2) * 10, mx = (a.x + b.x) / 2, my = 0.25 * y0 + 0.5 * cy + 0.25 * y1, d = c.b - c.a;
    h += '<path d="M' + r1(a.x) + " " + r1(y0) + " Q" + r1(mx) + " " + r1(cy) + " " + r1(b.x) + " " + r1(y1 + 2) + '" fill="none" stroke="var(--ec-e)" stroke-width="2" opacity="' + op + '"/>' + head(b.x, y1, Math.atan2(y1 - cy, b.x - mx), op);
    h += label(mx, my + 5, (d > 0 ? "↑ " : "↓ ") + on(d), op);
  });
  if (st.e != null && rx.ra != null && rx.ra !== rx.oa) {
    var A = cell(eCell(rx, rx.ra)), B = cell(eCell(rx, rx.oa));
    if (A && B) {
      var ya = A.top - 3, yb = B.top - 3, cx = (A.x + B.x) / 2, cy2 = Math.min(ya, yb) - 30;
      var mid = [0.25 * A.x + 0.5 * cx + 0.25 * B.x, 0.25 * ya + 0.5 * cy2 + 0.25 * yb];
      h += '<path d="M' + r1(A.x) + " " + r1(ya) + " Q" + r1(cx) + " " + r1(cy2) + " " + r1(B.x) + " " + r1(yb - 2) + '" fill="none" stroke="var(--ec-e)" stroke-width="1.8" stroke-dasharray="5 4"/>' + head(B.x, yb, Math.atan2(yb - cy2, B.x - cx), 1);
      h += label(mid[0], mid[1] - 6, rx.e + " e⁻", 1);
      if (typeof st.e === "number" && st.e < 1) {
        var n = Math.min(rx.e, 6);
        for (var i = 0; i < n; i++) {
          var t = clamp(st.e * 1.5 - i * 0.1, 0, 1), u = 1 - t;
          if (t <= 0 || t >= 1) continue;
          var px = u * u * A.x + 2 * u * t * cx + t * t * B.x, py = u * u * ya + 2 * u * t * cy2 + t * t * yb;
          h += '<circle cx="' + r1(px) + '" cy="' + r1(py) + '" r="5" fill="var(--ec-e)"/>';
        }
      }
    }
  }
  svg.innerHTML = h;
}
function watch(el, fn){ if (window.ResizeObserver) { new ResizeObserver(function(){ fn(); }).observe(el); } else window.addEventListener("resize", fn); }

// ---------- data ----------
// Explore: Assign-mode species. st = rule steps [rule, element, value]; x = the element solved by the sum rule (rule 8).
var SP = [
  { id:"o2", f:"O2", q:0, at:[["O", 2]], st:[[1, "O", 0]] },
  { id:"fe3", f:"Fe^3+", q:3, at:[["Fe", 1]], st:[[2, "Fe", 3]] },
  { id:"nacl", f:"NaCl", q:0, at:[["Na", 1], ["Cl", 1]], st:[[4, "Na", 1], [7, "Cl", -1]] },
  { id:"h2o", f:"H2O", q:0, at:[["H", 2], ["O", 1]], st:[[5, "H", 1], [6, "O", -2]] },
  { id:"h2o2", f:"H2O2", q:0, at:[["H", 2], ["O", 2]], st:[[5, "H", 1], [6, "O", -1]], perox:true },
  { id:"nah", f:"NaH", q:0, at:[["Na", 1], ["H", 1]], st:[[4, "Na", 1], [5, "H", -1]] },
  { id:"kmno4", f:"KMnO4", q:0, at:[["K", 1], ["Mn", 1], ["O", 4]], st:[[4, "K", 1], [6, "O", -2]], x:"Mn" },
  { id:"k2cr2o7", f:"K2Cr2O7", q:0, at:[["K", 2], ["Cr", 2], ["O", 7]], st:[[4, "K", 1], [6, "O", -2]], x:"Cr" },
  { id:"so4", f:"SO4^2-", q:-2, at:[["S", 1], ["O", 4]], st:[[6, "O", -2]], x:"S" },
  { id:"so3", f:"SO3^2-", q:-2, at:[["S", 1], ["O", 3]], st:[[6, "O", -2]], x:"S" },
  { id:"nh4", f:"NH4+", q:1, at:[["N", 1], ["H", 4]], st:[[5, "H", 1]], x:"N" },
  { id:"no3", f:"NO3-", q:-1, at:[["N", 1], ["O", 3]], st:[[6, "O", -2]], x:"N" },
  { id:"c2h6", f:"C2H6", q:0, at:[["C", 2], ["H", 6]], st:[[5, "H", 1]], x:"C" },
  { id:"ch3oh", f:"CH3OH", q:0, at:[["C", 1], ["H", 4], ["O", 1]], disp:[["C", 1], ["H", 3], ["O", 1], ["H", 1]], st:[[5, "H", 1], [6, "O", -2]], x:"C" },
  { id:"of2", f:"OF2", q:0, at:[["O", 1], ["F", 2]], st:[[3, "F", -1]], x:"O" },
  { id:"fe3o4", f:"Fe3O4", q:0, at:[["Fe", 3], ["O", 4]], st:[[6, "O", -2]], x:"Fe" }
];
function spById(id){ return SP.filter(function(s){ return s.id === id; })[0]; }
function nSteps(s){ return s.st.length + 1; }
function cnt(s, el){ return s.at.filter(function(t){ return t[0] === el; })[0][1]; }
function xVal(s){ if (!s.x) return null; var sum = 0; s.st.forEach(function(t){ sum += cnt(s, t[1]) * t[2]; }); return (s.q - sum) / cnt(s, s.x); }
function known(s, k){ var m = {}; s.st.forEach(function(t, i){ if (i < k) m[t[1]] = t[2]; }); if (s.x && k >= nSteps(s)) m[s.x] = xVal(s); if (!s.x && k >= nSteps(s)) s.st.forEach(function(t){ m[t[1]] = t[2]; }); return m; }
function term(n, v, first){ return n > 1 ? n + "(" + on(v) + ")" : first ? on(v) : "(" + on(v) + ")"; }
function sumOf(s, kn){ var t = 0; s.at.forEach(function(a){ if (kn[a[0]] != null) t += a[1] * kn[a[0]]; }); return t; }
function ruleLine(s, i){
  if (i >= s.st.length) {
    var tq = s.q ? "the ion’s charge, " + on(s.q) : "0";
    if (s.x) return "Rule 8: the sum must be " + tq + ", so " + s.x + " is " + on(xVal(s)) + (s.id === "of2" ? " (rule 6’s exception: O with F is +2)" : s.id === "fe3o4" ? " (an average over three Fe atoms)" : "");
    return "Rule 8: the numbers add to " + tq + " (checks)";
  }
  var t = s.st[i], r = t[0], el = t[1], v = t[2], h = "Rule " + r + ": " + el + " is " + on(v);
  if (r === 1) h += " (an uncombined element)";
  if (r === 2) h += " (a monatomic ion has its charge)";
  if (r === 3) h += " (in a compound)";
  if (r === 4) h += " (Group 1)";
  if (r === 5) h += v < 0 ? " with a metal (a hydride)" : " with nonmetals";
  if (r === 6 && v === -1) h += " in a peroxide (O–O bond)";
  if (r === 7) h += " (not combined with O)";
  return h;
}
function activeRule(s, k){ return k <= 0 ? 0 : k <= s.st.length ? s.st[k - 1][0] : 8; }

// Explore: Reaction mode (plan R1–R7); ra / oa = reactant index of the reducing / oxidizing agent, e = electrons as written.
var RX = [
  { id:"R1", L:[sp(1, [["Zn", 1, 0]], 0, "s"), sp(1, [["Cu", 1, 2]], 2, "aq")], R:[sp(1, [["Zn", 1, 2]], 2, "aq"), sp(1, [["Cu", 1, 0]], 0, "s")], ra:0, oa:1, e:2 },
  { id:"R2", L:[sp(2, [["Mg", 1, 0]], 0, "s"), sp(1, [["O", 2, 0]], 0, "g")], R:[sp(2, [["Mg", 1, 2], ["O", 1, -2]], 0, "s")], ra:0, oa:1, e:4 },
  { id:"R3", L:[sp(1, [["Cl", 2, 0]], 0, "aq"), sp(2, [["Br", 1, -1]], -1, "aq")], R:[sp(2, [["Cl", 1, -1]], -1, "aq"), sp(1, [["Br", 2, 0]], 0, "aq")], ra:1, oa:0, e:2 },
  { id:"R4", L:[sp(1, [["C", 1, -4], ["H", 4, 1]], 0, "g"), sp(2, [["O", 2, 0]], 0, "g")], R:[sp(1, [["C", 1, 4], ["O", 2, -2]], 0, "g"), sp(2, [["H", 2, 1], ["O", 1, -2]], 0, "l")], ra:0, oa:1, e:8 },
  { id:"R5", L:[sp(1, [["H", 1, 1], ["Cl", 1, -1]], 0, "aq"), sp(1, [["Na", 1, 1], ["O", 1, -2], ["H", 1, 1]], 0, "aq")], R:[sp(1, [["Na", 1, 1], ["Cl", 1, -1]], 0, "aq"), sp(1, [["H", 2, 1], ["O", 1, -2]], 0, "l")], ra:null, oa:null, e:0 },
  { id:"R6", L:[sp(2, [["H", 2, 1], ["O", 2, -1]], 0, "aq")], R:[sp(2, [["H", 2, 1], ["O", 1, -2]], 0, "l"), sp(1, [["O", 2, 0]], 0, "g")], ra:0, oa:0, e:2 },
  { id:"R7", L:[sp(1, [["Fe", 2, 3], ["O", 3, -2]], 0, "s"), sp(3, [["C", 1, 2], ["O", 1, -2]], 0, "g")], R:[sp(2, [["Fe", 1, 0]], 0, "s"), sp(3, [["C", 1, 4], ["O", 2, -2]], 0, "g")], ra:1, oa:0, e:6 }
];
function rxById(id){ return RX.filter(function(r){ return r.id === id; })[0]; }
function agentsText(rx){
  if (rx.ra == null) return "None: nothing is oxidized or reduced";
  if (rx.ra === rx.oa) return spF(rx.L[rx.ra]) + " is both: one molecule gives electrons to another";
  return "Reducing agent: " + spF(rx.L[rx.ra]) + "; oxidizing agent: " + spF(rx.L[rx.oa]);
}
function parseON(s){
  s = String(s == null ? "" : s).trim().replace(/[−–]/g, "-").replace(/\s+/g, "");
  if (!s) return null;
  var m = /^(\d+(?:\.\d+)?(?:\/\d+)?)([+-])$/.exec(s);
  if (m) { var a = MV.parseNum(m[1]); return a ? { v:(m[2] === "-" ? -1 : 1) * a[0], ion:true } : { bad:true }; }
  var r = MV.parseNum(s); if (!r || r.length !== 1) return { bad:true };
  return { v:r[0], nosign:/^\d/.test(s) && r[0] !== 0 };
}

// ---------- hero ----------
function hero(f){
  var eqEl = $("#ox-hx-eq"), svg = $("#ox-hx-svg"), ctr = $("#ox-hx-ctr"), rep = $("#ox-hx-replay"), cap = f && f.cap;
  if (!svg) return;
  eqEl.innerHTML = eqHTML(RX[0], {});
  eqEl.setAttribute("role", "img");
  eqEl.setAttribute("aria-label", "Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s), with oxidation-number tags: Zn 0, Cu +2, then Zn +2, Cu 0.");
  var ZN0 = [240, 158], ZN1 = [352, 214], CU0 = [372, 112], CU1 = [240, 106], CT = [306, 50], run = 0, st;
  function tagS(x, y, t){ return '<rect x="' + (x - 17) + '" y="' + (y - 11) + '" width="34" height="20" rx="5" fill="var(--sheet)" stroke="var(--rule)" stroke-width="1.5"/><text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">' + t + "</text>"; }
  function draw(){
    var m = st.m, zx = lerp(ZN0[0], ZN1[0], m), zy = lerp(ZN0[1], ZN1[1], m), cx = lerp(CU0[0], CU1[0], m), cy = lerp(CU0[1], CU1[1], m), h = "";
    h += '<rect x="42" y="74" width="396" height="186" fill="var(--ox-sol)"/><line x1="42" y1="74" x2="438" y2="74" stroke="var(--ox-sol-line)" stroke-width="2"/>';
    h += '<path d="M40 24 L40 250 Q40 262 52 262 L428 262 Q440 262 440 250 L440 24" fill="none" stroke="var(--ink-2)" stroke-width="2.5"/>';
    h += '<rect x="198" y="8" width="30" height="236" rx="3" fill="var(--ox-zn)" stroke="var(--ink-2)" stroke-width="1.5"/>';
    h += '<text x="213" y="236" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">Zn</text>';
    if (m > 0) h += '<rect x="228" y="' + r1(94) + '" width="' + r1(6 * m) + '" height="26" rx="2" fill="var(--ox-cu)"/>';
    h += '<circle cx="' + r1(zx) + '" cy="' + r1(zy) + '" r="13" fill="var(--ox-zn)" stroke="var(--ink-2)" stroke-width="1.5"/><text x="' + r1(zx) + '" y="' + r1(zy + 4) + '" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">' + (m > 0.5 ? "Zn²⁺" : "Zn") + "</text>";
    h += tagS(zx, zy - 27, m > 0.5 ? "+2" : "0");
    h += '<circle cx="' + r1(cx) + '" cy="' + r1(cy) + '" r="13" fill="' + (m > 0.5 ? "var(--ox-cu)" : "var(--at-m)") + '"/><text x="' + r1(cx) + '" y="' + r1(cy + 4) + '" text-anchor="middle" font-size="11" font-weight="700" fill="var(--sheet)">' + (m > 0.5 ? "Cu" : "Cu²⁺") + "</text>";
    h += tagS(cx, cy - 27, m > 0.5 ? "0" : "+2");
    if (st.e > 0 && st.e < 1) {
      h += '<path d="M' + ZN0[0] + " " + (ZN0[1] - 14) + " Q" + CT[0] + " " + CT[1] + " " + CU0[0] + " " + (CU0[1] - 14) + '" fill="none" stroke="var(--ec-e)" stroke-width="1.5" stroke-dasharray="4 4"/>';
      for (var i = 0; i < 2; i++) {
        var t = clamp(st.e * 1.3 - i * 0.3, 0, 1), u = 1 - t;
        if (t <= 0 || t >= 1) continue;
        var px = u * u * ZN0[0] + 2 * u * t * CT[0] + t * t * CU0[0], py = u * u * (ZN0[1] - 14) + 2 * u * t * CT[1] + t * t * (CU0[1] - 14);
        h += '<circle cx="' + r1(px) + '" cy="' + r1(py) + '" r="6" fill="var(--ec-e)"/><text x="' + r1(px) + '" y="' + r1(py + 4) + '" text-anchor="middle" font-size="11" font-weight="700" fill="var(--sheet)">−</text>';
      }
    }
    if (st.lab > 0) {
      h += '<text x="' + ZN1[0] + '" y="' + (ZN1[1] + 32) + '" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)" opacity="' + st.lab + '">oxidized (number ↑)</text>';
      h += '<text x="262" y="80" font-size="14" font-weight="700" fill="var(--ink)" opacity="' + st.lab + '">reduced (number ↓)</text>';
    }
    svg.innerHTML = h;
  }
  function final(){
    st = { e:1, m:1, lab:1 }; draw();
    ctr.innerHTML = "Zn’s number goes up: oxidized. Cu’s number goes down: reduced. Two electrons moved.";
    if (cap) cap.textContent = ""; rep.hidden = false;
  }
  function play(){
    var id = ++run; st = { e:0, m:0, lab:0 }; rep.hidden = true; draw();
    function ok(){ return id === run; }
    ctr.innerHTML = "A zinc strip sits in a blue solution of Cu²⁺ ions.";
    MV.wait(1100, function(){
      if (!ok()) return;
      ctr.innerHTML = "Two electrons hop from a Zn atom to a Cu²⁺ ion.";
      MV.tween({ dur:1500, ease:LIN, step:function(t){ if (!ok()) return; st.e = t; draw(); }, done:function(){
        if (!ok()) return;
        ctr.innerHTML = "Zn: 0 → +2, into solution as Zn²⁺. Cu: +2 → 0, onto the strip as copper.";
        MV.tween({ dur:1500, step:function(t){ if (!ok()) return; st.m = t; draw(); }, done:function(){
          if (!ok()) return;
          MV.tween({ dur:600, step:function(t){ if (!ok()) return; st.lab = t; draw(); }, done:function(){ if (ok()) MV.wait(500, function(){ if (ok()) final(); }); } });
        } });
      } });
    });
  }
  rep.addEventListener("click", play);
  if (MV.reduceMotion) final(); else play();
}

// ---------- Explore: Oxidation number calculator ----------
function explore(host, api){
  var S = api.S, C = api.content;
  if (S.mode !== "rx") S.mode = "as";
  if (!spById(S.sp)) S.sp = "k2cr2o7";
  S.k = clamp(Math.round(+S.k || 0), 0, nSteps(spById(S.sp)));
  S.box = S.box && typeof S.box === "object" ? S.box : {};
  if (!(typeof S.why3 === "number" && S.why3 >= 0 && S.why3 < C.tc3Why.options.length)) S.why3 = null;
  if (!rxById(S.rx)) S.rx = "R1";
  S.rr = S.rr && typeof S.rr === "object" ? S.rr : {};
  RX.forEach(function(r){ var x = S.rr[r.id] = S.rr[r.id] && typeof S.rr[r.id] === "object" ? S.rr[r.id] : {}; x.shown = !!x.shown; x.tags = x.tags && typeof x.tags === "object" ? x.tags : {}; if (typeof x.e !== "string") x.e = ""; });
  var sel = null, busy = false, seq = 0, tw = null, anim = null, note = "", pop = {};
  function cur(){ return spById(S.sp); }
  function crx(){ return rxById(S.rx); }
  function rr(){ return S.rr[S.rx]; }

  host.innerHTML = '<p class="how">' + C.how + '</p><div class="ox-modes"></div><div class="ox-grid">' +
    '<div class="ox-main"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="ox-pane" data-for="as"><div class="ox-spchips"></div><div class="ox-stage"></div><svg class="ox-sum" viewBox="0 0 340 74" role="img" aria-label=""></svg><div class="ox-why3"></div></div>' +
      '<div class="ox-pane" data-for="rx"><div class="ox-rxchips"></div><div class="ox-eqwrap"><div class="ox-eqbox"></div><svg class="ox-ov" aria-hidden="true"></svg></div><div class="ox-tagbar" role="group" aria-label="Tags"></div>' +
        '<div class="numrow ox-erow"><label for="ox-ein">Electrons transferred (as written):</label><input class="numin" id="ox-ein" data-ein="1" data-k="ein" type="text" inputmode="numeric" autocomplete="off" spellcheck="false"></div></div>' +
      '<div class="ox-btns"></div><p class="ox-cap" aria-live="polite"></p></div>' +
    '<div class="ox-aside"><div class="ox-railw"><h4 class="ox-h4">The rules, in order</h4><ol class="ox-rail"></ol></div>' +
      '<details class="ox-railp"><summary></summary><ol class="ox-rail"></ol></details>' +
      '<dl class="read ox-read" aria-live="polite"></dl><p class="tiny muted">' + C.notation + "</p></div></div>";
  var stage = $(".ox-stage", host), sumSvg = $(".ox-sum", host), wrap = $(".ox-eqwrap", host), eqBox = $(".ox-eqbox", host), btns = $(".ox-btns", host), tagbar = $(".ox-tagbar", host), ein = $("#ox-ein"), capEl = $(".ox-cap", host);

  var RG = {};
  RG.mode = radios($(".ox-modes", host), { label:"Mode", aria:"Calculator mode", options:C.modes, value:S.mode, onChange:function(v){ cancelAnim(); S.mode = v; sel = null; note = ""; api.save(); paint(); } });
  RG.sp = radios($(".ox-spchips", host), { label:"Species", cls:"chips", aria:"Species", options:SP.map(function(s){ return { id:s.id, t:F(s.f), aria:MV.plain(F(s.f)) }; }), value:S.sp,
    onChange:function(v){ cancelAnim(); S.sp = v; S.k = 0; note = ""; pop = {}; api.save(); paint(); } });
  RG.rx = radios($(".ox-rxchips", host), { label:"Reaction", cls:"chips", aria:"Reaction", options:RX.map(function(r){ return { id:r.id, t:r.id + ": " + r.L.map(function(s){ return spF(s, true); }).join(" + "), aria:r.id + ": " + MV.plain(eqF(r)) }; }), value:S.rx,
    onChange:function(v){ cancelAnim(); S.rx = v; sel = null; note = ""; api.save(); paint(); } });
  RG.why = radios($(".ox-why3", host), { label:C.tc3Why.label, cls:"chips ox-whyc", aria:"Explanation for Fe₃O₄", options:C.tc3Why.options.map(function(o, i){ return { id:String(i), t:o.t }; }), value:S.why3 == null ? "" : String(S.why3),
    onChange:function(v){ S.why3 = +v; api.save(); MV.changed(); } });
  function syncRG(){ RG.mode.set(S.mode); RG.sp.set(S.sp); RG.rx.set(S.rx); }
  function lock(b){ busy = b; RG.mode.lock(b); RG.sp.lock(b); RG.rx.lock(b); RG.why.lock(b); paint(); }
  function cancelAnim(){ seq++; if (tw) { tw(); tw = null; } anim = null; }

  // ----- Assign mode -----
  function stageHTML(){
    var s = cur(), kn = known(s, S.k), bx = S.box[s.id] || {}, seen = {}, h = '<div class="ox-form">';
    (s.disp || s.at).forEach(function(t){
      var el = t[0], n = cnt(s, el), v = kn[el], first = !seen[el]; seen[el] = 1;
      var tag = v == null ? '<span class="ox-tag ox-unk">?</span>' : '<span class="ox-tag' + (pop[el] && !MV.reduceMotion ? " pop" : "") + '">' + on(v) + "</span>";
      var mult = n > 1 && first ? '<span class="ox-mult">×' + n + "</span>" : "";
      var mark = "", p = parseON(bx[el]);
      if (first && v != null && p && !p.bad) mark = !p.ion && near(p.v, v, 0.01) ? " ok" : " bad";
      var bxH = first ? '<input class="ox-box' + mark + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" data-box="' + el + '" data-k="bx' + s.id + el + '" aria-label="Your oxidation number for ' + el + '" value="' + esc(bx[el] || "") + '"' + (busy ? " disabled" : "") + ">" : '<span class="ox-boxsp" aria-hidden="true"></span>';
      h += '<span class="ox-acell"><span class="ox-tagrow">' + tag + mult + "</span>" + bxH + '<span class="ox-el ox-big" style="color:' + elColor(el) + '">' + el + sub(t[1]) + "</span></span>";
    });
    if (s.q) h += '<span class="ox-q ox-big">' + qTxt(s.q) + "</span>";
    h += "</div>";
    if (s.perox) h += '<p class="ox-perox' + (S.k >= 2 ? " on" : "") + '">' + (S.k >= 2 ? "O–O bond lit: <strong>peroxide</strong>, so each O is −1." : "Two O atoms bonded to each other: O–O.") + "</p>";
    return h;
  }
  function drawSum(){
    var s = cur(), N = nSteps(s), part = [];
    for (var k = 0; k <= N; k++) part.push(sumOf(s, known(s, k)));
    var L = Math.max(2, Math.abs(s.q)); part.forEach(function(v){ L = Math.max(L, Math.ceil(Math.abs(v))); }); if (L % 2) L++;
    var x0 = 170, sc = 140 / L, now = part[S.k], h = "", step = L <= 12 ? 1 : L <= 24 ? 2 : 4;
    function X1(v){ return x0 + v * sc; }
    h += '<line x1="' + X1(-L) + '" y1="44" x2="' + X1(L) + '" y2="44" stroke="var(--ink-2)" stroke-width="1.5"/>';
    for (var t = -L; t <= L; t += step) h += '<line x1="' + r1(X1(t)) + '" y1="40" x2="' + r1(X1(t)) + '" y2="48" stroke="var(--ink-2)" stroke-width="1"/>';
    [-L, 0, L].forEach(function(t){ h += '<text x="' + r1(X1(t)) + '" y="62" text-anchor="middle" font-size="11" fill="var(--ink-2)">' + on(t) + "</text>"; });
    if (!near(now, 0)) h += '<rect x="' + r1(Math.min(x0, X1(now))) + '" y="34" width="' + r1(Math.abs(X1(now) - x0)) + '" height="20" rx="3" fill="var(--hi-soft)" stroke="var(--hi)" stroke-width="1.5"/>';
    h += '<line x1="' + r1(X1(s.q)) + '" y1="26" x2="' + r1(X1(s.q)) + '" y2="58" stroke="var(--ink)" stroke-width="2.5"/><text x="' + r1(X1(s.q)) + '" y="20" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">target ' + on(s.q) + "</text>";
    h += '<text x="6" y="72" font-size="12" fill="var(--ink)">Sum of known atoms: ' + on(now) + (S.k >= N ? " = target ✓" : "") + "</text>";
    sumSvg.innerHTML = h;
    sumSvg.setAttribute("aria-label", "Sum bar: the known atoms add to " + MV.plain(on(now)) + " so far; the target is " + MV.plain(on(s.q)) + ".");
  }
  function eqRow(s){
    var kn = known(s, Math.min(S.k, s.st.length)), terms = s.at.map(function(a, i){ var el = a[0], n = a[1]; if (el === s.x) return (n > 1 ? n : "") + X; return kn[el] != null ? term(n, kn[el], i === 0) : (n > 1 ? n + "(?)" : "(?)"); });
    if (!s.x) return muted("none: every atom is set by a rule");
    var h = terms.join(" + ") + " = " + on(s.q), all = s.at.every(function(a){ return a[0] === s.x || kn[a[0]] != null; });
    if (all) { var K = sumOf(s, kn), n = cnt(s, s.x); h += "<br>" + (n > 1 ? n : "") + X + (near(K, 0) ? "" : K > 0 ? " + " + on(K).slice(1) : " " + MI + " " + on(K).slice(1)) + " = " + on(s.q); }
    if (S.k >= nSteps(s)) h += " → " + X + " = " + on(xVal(s));
    return h;
  }
  function assignRows(){
    var s = cur(), N = nSteps(s), kn = known(s, S.k), knownT = s.at.filter(function(a){ return kn[a[0]] != null && (S.k < N ? a[0] !== s.x : true); });
    var full = known(s, N);
    return [
      ["Species", F(s.f)],
      ["Rule applied", S.k ? ruleLine(s, S.k - 1) : muted("press Apply next rule")],
      ["Known atoms", knownT.length ? knownT.map(function(a){ return a[0] + ": " + on(kn[a[0]]) + (a[1] > 1 ? " (×" + a[1] + ")" : ""); }).join(", ") : muted("none yet")],
      ["Equation for the unknown", eqRow(s)],
      ["Result", S.k >= N ? (s.x ? s.x + ": " + on(xVal(s)) : s.at.map(function(a){ return a[0] + ": " + on(full[a[0]]); }).join(", ")) : muted("not yet")],
      ["Sum check", S.k >= N ? s.at.map(function(a, i){ return term(a[1], full[a[0]], i === 0); }).join(" + ") + " = " + on(s.q) + " ✓ (checks)" : muted("not yet")]
    ];
  }
  function boxNote(){
    var s = cur(), bx = S.box[s.id] || {}, msg = "";
    s.at.forEach(function(a){ var p = parseON(bx[a[0]]); if (msg || !p) return; if (p.bad) msg = "Type a number such as +6, −2 or 8/3 in the " + a[0] + " box."; else if (p.ion) msg = C.notation.split(". ")[0] + ". Write the sign first (" + MV.plain(on(p.v)) + ") and give one number per atom."; else if (p.nosign) msg = "Write the sign first: " + on(p.v) + "."; });
    return msg;
  }

  // ----- Reaction mode -----
  function paintTagbar(){
    MV.keepFocus(tagbar, function(){
      tagbar.innerHTML = Object.keys(C.tagNames).map(function(t){ return '<button type="button" class="btn ghost sm" data-tag="' + t + '" data-k="tg' + t + '"' + (!sel || busy ? " disabled" : "") + ">" + C.tagNames[t] + "</button>"; }).join("");
    });
  }
  function ov(){ if (S.mode !== "rx") return; overlay(wrap, crx(), anim || (rr().shown ? { arcs:1, e:"static" } : null)); }
  function rxRows(){
    var rx = crx(), r = rr(), sh = r.shown && !anim, wait = muted("press Show the changes");
    return [
      ["Reaction", eqF(rx)],
      ["Oxidized / reduced", sh ? (changeText(rx) || "Nothing: every number stays the same") : wait],
      ["Agents", sh ? agentsText(rx) : wait],
      ["Electrons transferred (as written)", sh ? String(rx.e) : wait],
      ["Redox?", sh ? (rx.e ? "Yes" : "No: no oxidation number changes") : wait]
    ];
  }
  function showChanges(cb){
    var rx = crx(), r = rr(), my = ++seq; r.shown = true; api.save();
    anim = { arcs:0, e:null }; paint();
    tw = MV.tween({ dur:700, step:function(t){ if (my !== seq) return; anim.arcs = t; ov(); }, done:function(){
      if (my !== seq) return;
      if (rx.ra == null || rx.ra === rx.oa) { anim = null; paint(); if (cb) cb(); return; }
      anim.arcs = 1;
      tw = MV.tween({ dur:1700, ease:LIN, step:function(t){ if (my !== seq) return; anim.e = t; ov(); }, done:function(){ if (my !== seq) return; anim = null; tw = null; paint(); if (cb) cb(); } });
    } });
  }

  // ----- paint -----
  function paintBtns(){
    MV.keepFocus(btns, function(){
      if (S.mode === "as") {
        var s = cur(), N = nSteps(s);
        btns.innerHTML = '<button type="button" class="btn primary sm" data-act="next" data-k="anext"' + (busy || S.k >= N ? " disabled" : "") + ">Apply next rule</button>" +
          '<button type="button" class="btn ghost sm" data-act="solve" data-k="asolve"' + (busy || S.k >= N ? " disabled" : "") + ">Solve for the unknown</button>" +
          '<button type="button" class="btn ghost sm" data-act="reset" data-k="areset"' + (busy || !S.k ? " disabled" : "") + ">Reset</button>";
      } else {
        btns.innerHTML = '<button type="button" class="btn primary sm" data-act="show" data-k="rshow"' + (busy ? " disabled" : "") + ">Show the changes</button>" +
          '<button type="button" class="btn ghost sm" data-act="clear" data-k="rclear"' + (busy ? " disabled" : "") + ">Clear tags</button>";
      }
    });
  }
  function paintRail(){
    var s = cur(), a = S.mode === "as" ? activeRule(s, S.k) : 0;
    var h = C.rules.map(function(r, i){ var o = a === i + 1; return "<li" + (o ? ' class="on" aria-current="step"' : "") + ">" + r + "</li>"; }).join("");
    $$(".ox-rail", host).forEach(function(ol){ ol.innerHTML = h; });
    $(".ox-railp summary", host).textContent = a ? "Rule " + a + " of 8" : "The rules (8)";
  }
  function paintCap(){
    if (S.mode === "as") capEl.innerHTML = note || boxNote() || "";
    else capEl.innerHTML = note || (sel ? "Selected: " + spF(sel[0] === "L" ? crx().L[+sel.slice(1)] : crx().R[+sel.slice(1)]) + ". Now tap a tag." : "Tap a species, then a tag.");
  }
  function paint(){
    var m = S.mode;
    $$(".ox-pane", host).forEach(function(p){ p.hidden = p.dataset.for !== m; });
    $(".ox-railw", host).hidden = m !== "as"; $(".ox-railp", host).hidden = m !== "as";
    if (m === "as") {
      MV.keepFocus(stage, function(){ stage.innerHTML = stageHTML(); });
      drawSum();
      $(".ox-why3", host).hidden = S.sp !== "fe3o4";
      $(".ox-read", host).innerHTML = MV.readoutHTML(assignRows());
    } else {
      var r = rr();
      MV.keepFocus(eqBox, function(){ eqBox.innerHTML = eqHTML(crx(), { pick:true, sel:sel, tags:r.tags, pref:"rs", dis:busy }); });
      if (document.activeElement !== ein) ein.value = r.e;
      ein.disabled = busy;
      paintTagbar(); ov();
      $(".ox-read", host).innerHTML = MV.readoutHTML(rxRows());
    }
    paintRail(); paintBtns(); paintCap();
    MV.changed();
  }
  watch(wrap, ov);

  // ----- events -----
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.dataset && t.dataset.box) { var s = cur(); S.box[s.id] = S.box[s.id] || {}; S.box[s.id][t.dataset.box] = t.value; api.save(); note = ""; paintCap(); MV.changed(); return; }
    if (t.dataset && t.dataset.ein) { rr().e = t.value; api.save(); MV.changed(); }
  });
  host.addEventListener("change", function(e){ if (e.target.dataset && e.target.dataset.box) paint(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.act === "next" || b.dataset.act === "solve") {
      var s = cur(), before = known(s, S.k); S.k = b.dataset.act === "next" ? Math.min(nSteps(s), S.k + 1) : nSteps(s);
      var after = known(s, S.k); pop = {}; Object.keys(after).forEach(function(el){ if (before[el] == null) pop[el] = 1; });
      note = ""; api.save(); paint(); return;
    }
    if (b.dataset.act === "reset") { S.k = 0; pop = {}; note = ""; api.save(); paint(); return; }
    if (b.dataset.act === "show") { lock(true); showChanges(function(){ lock(false); }); return; }
    if (b.dataset.act === "clear") { rr().tags = {}; sel = null; note = ""; api.save(); paint(); return; }
    if (b.dataset.sp) { sel = sel === b.dataset.sp ? null : b.dataset.sp; note = ""; paint(); return; }
    if (b.dataset.tag && sel) { rr().tags[b.dataset.tag] = sel; note = "Tagged: " + TAGW[b.dataset.tag] + "."; sel = null; api.save(); paint(); }
  });

  // ----- predictions -----
  function stepTo(k, cb){ var s = cur(), before = known(s, S.k); S.k = k; var after = known(s, S.k); pop = {}; Object.keys(after).forEach(function(el){ if (before[el] == null) pop[el] = 1; }); api.save(); paint(); MV.wait(1000, cb); }
  var hooks = {
    start:function(p){
      cancelAnim(); note = ""; sel = null; pop = {};
      if (p.id === "p1" || p.id === "p2") { S.mode = "as"; S.sp = p.id === "p1" ? "so4" : "h2o2"; S.k = 0; }
      else { S.mode = "rx"; S.rx = p.id === "p3" ? "R5" : "R1"; rr().shown = false; if (p.id === "p4") rr().tags = {}; }
      syncRG(); api.save(); lock(true);
    },
    run:function(p, done){
      function fin(n){ note = n || ""; lock(false); MV.wait(150, done); }
      if (p.id === "p1") stepTo(1, function(){ stepTo(2, function(){ fin("Rule 6 tags each O as −2 (×4 = −8); then " + X + " − 8 = −2 gives S = +6."); }); });
      else if (p.id === "p2") stepTo(1, function(){ stepTo(2, function(){ stepTo(3, function(){ fin("2(+1) + 2(−1) = 0: each O in the peroxide is −1."); }); }); });
      else if (p.id === "p3") showChanges(function(){ fin("Every tag stays the same, and the Redox? row reads No."); });
      else showChanges(function(){ rr().tags.oa = "L1"; api.save(); fin("The electrons travel from Zn to Cu²⁺: the tag “oxidizing agent” lands on Cu²⁺."); });
    }
  };

  // ----- challenges -----
  function chal(id){
    if (id === "tc1") {
      var b = S.box.k2cr2o7 || {}, pK = parseON(b.K), pC = parseON(b.Cr), pO = parseON(b.O);
      if (!pK || !pC || !pO) return { ok:false };
      if (pK.bad || pC.bad || pO.bad) return { ok:false, msg:"Type each number with its sign, such as +1 or −2." };
      if (pK.ion || pC.ion || pO.ion) return { ok:false, msg:"Write the sign first (+2) and give one number per atom." };
      if (near(pC.v, 12)) return { ok:false, msg:"That’s the total for both Cr atoms. Divide by 2." };
      if (near(pC.v, 7)) return { ok:false, msg:"You left out the two K atoms: 2(+1) + 2" + X + " − 14 = 0." };
      if (near(pC.v, -2)) return { ok:false, msg:"That’s the ion charge of dichromate, not the number for Cr." };
      if (!near(pK.v, 1)) return { ok:false, msg:"K is in Group 1, so rule 4 gives +1." };
      if (!near(pO.v, -2)) return { ok:false, msg:"O is −2 here (rule 6): K₂Cr₂O₇ isn’t a peroxide." };
      if (!near(pC.v, 6)) return { ok:false, msg:"Check the sum: 2(+1) + 2" + X + " + 7(−2) = 0." };
      return { ok:true };
    }
    if (id === "tc2") {
      var r = S.rr.R7, t = r.tags, ev = parseON(r.e);
      if (t.ra === "R1") return { ok:false, msg:"Agents are reactants. CO₂ is what CO becomes." };
      if (t.ra === "L0") return { ok:false, msg:"Fe goes +3 → 0, so it is reduced; Fe₂O₃ is the oxidizing agent." };
      if (t.oa === "L1") return { ok:false, msg:"C goes +2 → +4, so CO is oxidized: it is the reducing agent." };
      if ((t.oa && t.oa[0] === "R") || (t.ra && t.ra[0] === "R")) return { ok:false, msg:"Agents are reactants." };
      if (t.oa !== "L0" || t.ra !== "L1") return { ok:false };
      if (!ev || ev.bad) return { ok:false, msg:"Now enter the number of electrons transferred." };
      if (near(ev.v, 3)) return { ok:false, msg:"Each Fe gains 3, and there are 2 Fe: 6." };
      if (near(ev.v, 2)) return { ok:false, msg:"Each C loses 2, and there are 3 CO: 6." };
      if (!near(ev.v, 6)) return { ok:false, msg:"Total rise = total fall: count every Fe atom and every C atom." };
      return { ok:true };
    }
    if (id === "tc3") {
      var p = parseON((S.box.fe3o4 || {}).Fe), w = S.why3 == null ? null : C.tc3Why.options[S.why3];
      if (!p) return { ok:false };
      if (p.bad) return { ok:false, msg:"Type the Fe number as a fraction or a decimal, such as 5/2 or 2.5." };
      if (p.ion) return { ok:false, msg:"Write the sign first (+2) and give one number per atom." };
      if (near(p.v, 8)) return { ok:false, msg:"That’s the total for three Fe atoms." };
      if (near(p.v, 2) || near(p.v, 3)) return { ok:false, msg:"Each of these is right for <em>some</em> of the Fe atoms. The rule gives the average." };
      if (!near(p.v, 8 / 3, 0.01)) return { ok:false, msg:"3" + X + " + 4(−2) = 0: solve for " + X + "." };
      if (!w) return { ok:false, msg:"Your number is right. Now choose the explanation for it." };
      if (!MV.ok(w)) return { ok:false, msg:w.why };
      return { ok:true };
    }
    return { ok:false };
  }
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Redox or not? ----------
// Particle zoom data for the ten cards (plan Part 3, Station 1). cap = the electron-hop sentence.
var CARDZ = {
  c1:{ L:[sp(2, [["Na", 1, 0]], 0, "s"), sp(1, [["Cl", 2, 0]], 0, "g")], R:[sp(2, [["Na", 1, 1], ["Cl", 1, -1]], 0, "s")], ra:0, oa:1, e:2 },
  c2:{ L:[sp(1, [["Ag", 1, 1], ["N", 1, 5], ["O", 3, -2]], 0, "aq"), sp(1, [["Na", 1, 1], ["Cl", 1, -1]], 0, "aq")], R:[sp(1, [["Ag", 1, 1], ["Cl", 1, -1]], 0, "s"), sp(1, [["Na", 1, 1], ["N", 1, 5], ["O", 3, -2]], 0, "aq")], ra:null, e:0 },
  c3:{ L:[sp(1, [["Mg", 1, 0]], 0, "s"), sp(2, [["H", 1, 1], ["Cl", 1, -1]], 0, "aq")], R:[sp(1, [["Mg", 1, 2], ["Cl", 2, -1]], 0, "aq"), sp(1, [["H", 2, 0]], 0, "g")], ra:0, oa:1, e:2 },
  c4:{ L:[sp(1, [["Ca", 1, 2], ["C", 1, 4], ["O", 3, -2]], 0, "s")], R:[sp(1, [["Ca", 1, 2], ["O", 1, -2]], 0, "s"), sp(1, [["C", 1, 4], ["O", 2, -2]], 0, "g")], ra:null, e:0 },
  c5:{ L:[sp(2, [["H", 2, 1], ["O", 1, -2]], 0, "l")], R:[sp(2, [["H", 2, 0]], 0, "g"), sp(1, [["O", 2, 0]], 0, "g")], ra:0, oa:0, e:4, cap:"In water, O gives electrons to H: 4 e⁻ move as written." },
  c6:{ L:[sp(1, [["H", 2, 1], ["S", 1, 6], ["O", 4, -2]], 0, "aq"), sp(2, [["K", 1, 1], ["O", 1, -2], ["H", 1, 1]], 0, "aq")], R:[sp(1, [["K", 2, 1], ["S", 1, 6], ["O", 4, -2]], 0, "aq"), sp(2, [["H", 2, 1], ["O", 1, -2]], 0, "l")], ra:null, e:0 },
  c7:{ L:[sp(1, [["C", 3, -8 / 3], ["H", 8, 1]], 0, "g"), sp(5, [["O", 2, 0]], 0, "g")], R:[sp(3, [["C", 1, 4], ["O", 2, -2]], 0, "g"), sp(4, [["H", 2, 1], ["O", 1, -2]], 0, "l")], ra:0, oa:1, e:20 },
  c8:{ L:[sp(1, [["Cu", 1, 0]], 0, "s"), sp(2, [["Ag", 1, 1], ["N", 1, 5], ["O", 3, -2]], 0, "aq")], R:[sp(1, [["Cu", 1, 2], "(", ["N", 1, 5], ["O", 3, -2], ")2"], 0, "aq"), sp(2, [["Ag", 1, 0]], 0, "s")], ra:0, oa:1, e:2 },
  c9:{ L:[sp(1, [["Pb", 1, 2], "(", ["N", 1, 5], ["O", 3, -2], ")2"], 0, "aq"), sp(2, [["K", 1, 1], ["I", 1, -1]], 0, "aq")], R:[sp(1, [["Pb", 1, 2], ["I", 2, -1]], 0, "s"), sp(2, [["K", 1, 1], ["N", 1, 5], ["O", 3, -2]], 0, "aq")], ra:null, e:0 },
  c10:{ L:[sp(2, [["H", 2, 1], ["O", 2, -1]], 0, "aq")], R:[sp(2, [["H", 2, 1], ["O", 1, -2]], 0, "l"), sp(1, [["O", 2, 0]], 0, "g")], ra:0, oa:0, e:2, cap:"One H₂O₂ gives electrons to another: 2 e⁻ move as written." }
};
function zoomCap(z){
  if (!z.e) return "No oxidation number changes: no electrons move.";
  return changeText(z) + ". " + (z.cap || "Electrons move from " + spF(z.L[z.ra]) + " to " + spF(z.L[z.oa]) + ": " + z.e + " e⁻ as written.");
}
function zoomHTML(id, card){ return '<div class="ox-zcard"><p class="ox-zt"><strong>' + card.eq + "</strong> <span class=\"tiny muted\">(" + card.type + ')</span></p><div class="ox-eqwrap" data-z="' + id + '"><div class="ox-eqbox">' + eqHTML(CARDZ[id], {}) + '</div><svg class="ox-ov" aria-hidden="true"></svg></div><p class="ox-zcap">' + zoomCap(CARDZ[id]) + "</p></div>"; }
function part3(host, api){
  var S = api.S, C = api.content, CARDS = C.cards;
  function card(id){ return CARDS.filter(function(c){ return c.id === id; })[0]; }
  S.bins = S.bins && typeof S.bins === "object" ? S.bins : {};
  Object.keys(S.bins).forEach(function(k){ if (!card(k) || (S.bins[k] !== "redox" && S.bins[k] !== "not")) delete S.bins[k]; });
  S.zoom = card(S.zoom) ? S.zoom : null; S.why = !!S.why;
  var pick = null, msg = "";
  host.innerHTML = '<div class="part ox-st"><h3>' + C.s1.title + "</h3><p>" + C.s1.intro + '</p><div class="ox-deck" role="group" aria-label="Unsorted reaction cards"></div><div class="ox-bins"></div><div class="ox-p3fb" aria-live="polite"></div><div class="ox-zoom"></div></div>' +
    '<div class="part ox-st"><h3>' + C.s2.title + '</h3><div class="ox-s2"></div></div>';
  var deck = $(".ox-deck", host), bins = $(".ox-bins", host), fb = $(".ox-p3fb", host), zoomEl = $(".ox-zoom", host), s2 = $(".ox-s2", host);
  function okCard(id){ return S.bins[id] && S.bins[id] === MV.ans(card(id)); }
  function cardHTML(c, inBin){
    var on1 = pick === c.id, mk = inBin ? (okCard(c.id) ? '<span class="ox-mk ok" aria-label="correct">✓</span>' : '<span class="ox-mk bad" aria-label="not quite">✗</span>') : "";
    return '<div class="ox-card' + (on1 ? " on" : "") + '">' + mk + '<button type="button" class="ox-cardb" data-card="' + c.id + '" data-k="cd' + c.id + '" aria-pressed="' + on1 + '">' + c.eq + '</button><button type="button" class="btn ghost sm ox-zb" data-zoom="' + c.id + '" data-k="zm' + c.id + '" aria-expanded="' + (S.zoom === c.id) + '">Zoom to the particles</button></div>';
  }
  function drawOv(){ $$(".ox-eqwrap[data-z]", host).forEach(function(w){ overlay(w, CARDZ[w.dataset.z], CARDZ[w.dataset.z].e ? { arcs:1, e:"static" } : null); }); }
  function paint(){
    MV.keepFocus(host, function(){
      var un = CARDS.filter(function(c){ return !S.bins[c.id]; });
      deck.innerHTML = un.length ? un.map(function(c){ return cardHTML(c, false); }).join("") : '<p class="tiny muted">All ten cards are in a bin. Tap any card to move it.</p>';
      bins.innerHTML = C.bins.map(function(b){
        var inB = CARDS.filter(function(c){ return S.bins[c.id] === b.id; });
        return '<div class="ox-bin"><button type="button" class="btn ox-binb" data-bin="' + b.id + '" data-k="bin' + b.id + '">Put in: ' + b.t + ' <span class="ox-bn">(' + inB.length + ")</span></button><div class=\"ox-binl\">" + inB.map(function(c){ return cardHTML(c, true); }).join("") + "</div></div>";
      }).join("");
      fb.innerHTML = msg;
      zoomEl.innerHTML = S.zoom ? zoomHTML(S.zoom, card(S.zoom)) + '<button type="button" class="btn ghost sm" data-zclose="1" data-k="zclose">Close the zoom</button>' : "";
      var nOk = CARDS.filter(function(c){ return okCard(c.id); }).length;
      if (nOk < CARDS.length) s2.innerHTML = "<p>" + C.s2.locked + ' <span class="muted">(' + nOk + " of " + CARDS.length + " sorted correctly)</span></p>";
      else s2.innerHTML = MV.tableHTML({ head:C.s2.table.head, rows:C.s2.table.rows }) + '<p><button type="button" class="btn ghost sm" data-why="1" data-k="p3why" aria-expanded="' + S.why + '">' + C.s2.why + "</button></p>" +
        (S.why ? '<div class="ox-pair">' + zoomHTML("c4", card("c4")) + zoomHTML("c5", card("c5")) + '</div><p class="ox-zcap">' + C.s2.whyCap + "</p>" : "");
    });
    drawOv();
    MV.changed();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.card) { pick = pick === b.dataset.card ? null : b.dataset.card; msg = pick ? MV.fbHTML("", "Now tap a bin: <strong>Redox</strong> or <strong>Not redox</strong>.") : ""; paint(); return; }
    if (b.dataset.zoom) { S.zoom = S.zoom === b.dataset.zoom ? null : b.dataset.zoom; api.save(); paint(); return; }
    if (b.dataset.zclose) { S.zoom = null; api.save(); paint(); return; }
    if (b.dataset.why) { S.why = !S.why; api.save(); paint(); return; }
    if (b.dataset.bin) {
      if (!pick) { msg = MV.fbHTML("", "Tap a reaction card first."); paint(); return; }
      var c = card(pick), z = CARDZ[pick]; S.bins[pick] = b.dataset.bin; pick = null;
      if (okCard(c.id)) msg = MV.fbHTML("good", "<strong>✓ Right.</strong> " + c.eq + ": " + (z.e ? "numbers change (" + changeText(z) + "), so this " + c.type + " is redox." : "every atom keeps its number, so this " + c.type + " isn’t redox."));
      else msg = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + (z.e ? "Some oxidation numbers change in " + c.eq + ". Zoom to the particles and look for a number that goes up and one that goes down." : "Check every atom. If no oxidation number changes, it isn’t redox.") + " Tap the card to move it.");
      api.save(); paint(); MV.focusFb(fb); return;
    }
  });
  watch(host, drawOv);
  paint();
  return {};
}

// ---------- Practice: Agents and electrons (choice and number items; first-try scoring) ----------
function agentsAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = {}); if (typeof x.val !== "string") x.val = ""; if (x.pick === undefined) x.pick = null; x.tries = x.tries || 0; x.hint = x.hint || 0; x.solved = !!x.solved; if (x.first === undefined) x.first = null; return x; }
  function chipsHTML(it, x, dis){ return '<div class="chips ox-chiplist" role="radiogroup" aria-label="Choices">' + it.options.map(function(o, k){ var on1 = x.pick === k; return '<button type="button" role="radio" class="chip' + (on1 ? " on" : "") + '" aria-checked="' + on1 + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + dis + ">" + o.t + "</button>"; }).join("") + "</div>"; }
  function numHTML(it, x, dis){ return '<div class="numrow"><label for="ag-' + it.id + '">' + (it.label || "Your answer:") + '</label><input class="numin" id="ag-' + it.id + '" data-cin="' + it.id + '" data-k="' + it.id + 'in" type="text" inputmode="' + (it.keypad || "decimal") + '" autocomplete="off" spellcheck="false" value="' + esc(x.val) + '"' + dis + '><span class="ox-unit">' + (it.unit || "") + "</span></div>"; }
  function itemHTML(it, i){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", h = '<div class="q" data-ci="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    h += it.kind === "num" ? numHTML(it, x, dis) : chipsHTML(it, x, dis);
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) {
      var why = it.kind === "chips" ? (it.options[x.pick] && it.options[x.pick].why) || "" : it.why || "";
      h += MV.fbHTML("good", "<strong>✓ Correct: " + (it.kind === "chips" ? it.options[x.pick].t : it.display) + ".</strong> " + why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    } else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function judge(it, x){
    if (it.kind === "num") {
      var v = MV.parseNum(String(x.val || "").replace(/[a-z⁻]+/gi, "").trim());
      if (!v || v.length !== 1) return { bad:"Enter one number, such as 4." };
      if (near(v[0], MV.ans(it), (it.tol || 0) + 1e-9)) return { ok:true };
      var w = (it.wrong || []).filter(function(z){ return near(v[0], z.match, 0.005); })[0];
      return { fb:w ? w.fb : it.fb };
    }
    if (x.pick == null) return { bad:"Choose an answer first." };
    return MV.ok(it.options[x.pick]) ? { ok:true } : { fb:it.options[x.pick].why };
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.cin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.cin) { var b = host.querySelector('[data-k="' + e.target.dataset.cin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ci]"); if (!bx) return;
    var it = item(bx.dataset.ci), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.op != null) { x.pick = +b.dataset.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = { t:r.bad, soft:true }; paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = { t:r.fb }; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ci="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: One-to-one swap ----------
var task = (function(){
  var S = null, api = null, RGm = null, RGi = null;
  var MET = [["Mg", 2], ["Al", 3], ["Zn", 2], ["Fe", 2], ["Cu", 2], ["Ag", 1]], ION = [["Cu", 2], ["Zn", 2], ["Fe", 2], ["Ag", 1], ["H", 1]];
  var SER = ["Mg", "Al", "Zn", "Fe", "H", "Cu", "Ag"];
  function mOf(el){ var r = MET.filter(function(m){ return m[0] === el; })[0]; return r ? r[1] : 0; }
  function iOf(el){ var r = ION.filter(function(m){ return m[0] === el; })[0]; return r ? r[1] : 0; }
  function ionF(el){ var q = iOf(el); return el + (q > 1 ? "^" + q + "+" : "+"); }
  function read(){ return { m:S && mOf(S.m) ? S.m : "", i:S && iOf(S.i) ? S.i : "" }; }
  function build(d){
    var m = mOf(d.m), x = iOf(d.i), g = gcd(m, x), a = x / g, b = m / g;
    if (d.i === "H" && b % 2) { a *= 2; b *= 2; }
    var prod = d.i === "H" ? sp(b / 2, [["H", 2, 0]], 0, "g") : sp(b, [[d.i, 1, 0]], 0, "s");
    return { L:[sp(a, [[d.m, 1, 0]], 0, "s"), sp(b, [[d.i, 1, x]], x, "aq")], R:[sp(a, [[d.m, 1, m]], m, "aq"), prod], e:a * m, a:a, b:b };
  }
  function paint(){
    var pv = $("#ox-tpv"); if (!pv) return;
    var d = read();
    if (!d.m || !d.i) { pv.innerHTML = '<p class="muted">Choose a metal and an ion to see the reaction with its oxidation numbers.</p>'; pv.setAttribute("aria-label", "No reaction yet."); return; }
    var rx = build(d);
    pv.innerHTML = eqHTML(rx, {}) + '<dl class="read">' + MV.readoutHTML([["Metal atoms : ions", rx.a + " : " + rx.b], ["Electrons transferred (as written)", String(rx.e)], ["Metal’s number", "0 → " + on(mOf(d.m)) + " (rises by " + mOf(d.m) + ")"]]) + "</dl>";
    pv.setAttribute("aria-label", "Your reaction: " + MV.plain(eqF(rx)) + ". " + rx.e + " electrons transferred.");
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; var d = read(); S.m = d.m; S.i = d.i;
      inp.innerHTML = '<div class="ox-tm"></div><div class="ox-ti"></div>';
      pv.innerHTML = '<h4 class="ox-h4">Your reaction</h4><div id="ox-tpv" class="ox-tpv" role="group" aria-label=""></div>';
      RGm = radios($(".ox-tm", inp), { label:"Metal", cls:"chips", aria:"Metal", options:MET.map(function(m){ return { id:m[0], t:m[0] + (m[0] === "Fe" ? " (forms Fe²⁺)" : "") }; }), value:S.m,
        onChange:function(v){ S.m = v; api.save(); paint(); api.update(); } });
      RGi = radios($(".ox-ti", inp), { label:"Ion", cls:"chips", aria:"Ion", options:ION.map(function(m){ return { id:m[0], t:F(ionF(m[0])), aria:MV.plain(F(ionF(m[0]))) }; }), value:S.i,
        onChange:function(v){ S.i = v; api.save(); paint(); api.update(); } });
      paint();
    },
    read:read,
    valid:function(d){ return d.m && d.i ? true : "Choose a metal and an ion."; },
    // Line 3 tests a true 1 : 1 ratio (the metal's rise equals the ion's charge); see the report (plan's line-3 test vs its near-miss table).
    checks:function(d){ var m = mOf(d.m), x = iOf(d.i); return [m === 2, d.m !== d.i, m === x, SER.indexOf(d.m) < SER.indexOf(d.i)]; },
    key:function(d){ return d.m + "|" + d.i; },
    label:function(k){ var p = k.split("|"); return F(p[0] + " + " + ionF(p[1])); },
    text:function(k){ return MV.plain(this.label(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ agents:agentsAct },
  task:task
});
})();
