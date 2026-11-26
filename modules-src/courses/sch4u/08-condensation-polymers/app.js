// SCH4U 08 Condensation Polymers: hero (diacid + diamine → four amide links, four waters), Condensation chain builder
// (Explore: C1 chainStage with Build / Compare / Cap and cross-link modes, water beaker, readouts, mass ledger),
// Breaking them down (Part 3: hydrolysis on tappable links + particle zoom, breakdown bars + model data, PET recycling
// routes), "Count, calculate, work back" set, "Design a fibre" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, F = MV.chem.f, MM = MV.chem.data.M;
var MINUS = "−";
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function esc(s){ return MV.esc(s); }
function r1(v){ return Math.round(v * 10) / 10; }
function lerp(a, b, t){ return a + (b - a) * t; }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
function num(v){ return MV.num(v, 0); }
function clone(o){ return JSON.parse(JSON.stringify(o)); }
function parseOne(s){ var v = MV.parseNum(String(s || "").replace(/g\/mol/i, "")); return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }

// ---------- monomers (plan §4 Explore and task) ----------
// Molar masses come from the course table (MV.chem.data.M) and are rounded to whole g/mol, as the plan's "Use these
// values" box does (plan §6 risk 4: hexanedioic acid C₆H₁₀O₄ = 146.16 → 146). Ethanoic acid (60) and ethene (28) are
// computed the same way for the caps and the Compare chain; the plan doesn't list them.
function mass(f){ return Math.round((f.C || 0) * MM.C + (f.H || 0) * MM.H + (f.N || 0) * MM.N + (f.O || 0) * MM.O); }
var WATER = mass({ H:2, O:1 });
var MON = {
  hexA:{ nm:"hexanedioic acid", k:"acid2", core:"(CH2)4", f:{ C:6, H:10, O:4 }, cond:"HOOC–(CH2)4–COOH" },
  terA:{ nm:"benzene-1,4-dicarboxylic acid", k:"acid2", core:"C6H4", ring:true, f:{ C:8, H:6, O:4 }, cond:"HOOC–C6H4–COOH" },
  butA:{ nm:"butanedioic acid", k:"acid2", core:"CH2CH2", f:{ C:4, H:6, O:4 }, cond:"HOOC–CH2CH2–COOH" },
  gly:{ nm:"glycine", k:"amino", f:{ C:2, H:5, N:1, O:2 }, cond:"H2N–CH2–COOH", single:true },
  glc:{ nm:"glucose", k:"sugar", f:{ C:6, H:12, O:6 }, cond:"HO–C6H10O4–OH", single:true },
  eg:{ nm:"ethane-1,2-diol", k:"diol", core:"CH2CH2", f:{ C:2, H:6, O:2 }, cond:"HO–CH2CH2–OH", g:2 },
  bd:{ nm:"butane-1,4-diol", k:"diol", core:"(CH2)4", f:{ C:4, H:10, O:2 }, cond:"HO–(CH2)4–OH", g:2 },
  hmda:{ nm:"hexane-1,6-diamine", k:"diamine", core:"(CH2)6", f:{ C:6, H:16, N:2 }, cond:"H2N–(CH2)6–NH2", g:2 },
  ppd:{ nm:"benzene-1,4-diamine", k:"diamine", core:"C6H4", ring:true, f:{ C:6, H:8, N:2 }, cond:"H2N–C6H4–NH2", g:2 },
  etoh:{ nm:"ethanol", k:"ol1", f:{ C:2, H:6, O:1 }, cond:"CH3CH2OH", g:1 },
  acoh:{ nm:"ethanoic acid", k:"acid1", f:{ C:2, H:4, O:2 }, cond:"CH3COOH", g:1 },
  tri:{ nm:"propane-1,2,3-triol", k:"triol", f:{ C:3, H:8, O:3 }, cond:"HOCH2CH(OH)CH2OH", g:3 },
  eth:{ nm:"ethene", k:"alkene", f:{ C:2, H:4 } }
};
Object.keys(MON).forEach(function(k){ MON[k].id = k; MON[k].M = mass(MON[k].f); });
var AS = ["hexA", "terA", "butA", "gly", "glc"], BS = ["eg", "bd", "hmda", "ppd"];

// @component radioGroup (from MHF4U 25, via SCH4U 01–05) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock); with no option chosen yet, the first option holds the tab stop.
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange(id), disabled}) -> {set(id), get(), lock(bool), paint()}
function radios(host, o){
  var val = o.value == null ? "" : String(o.value), locked = false;
  function off(id){ return o.disabled ? o.disabled(id) : ""; }
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), first = true;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val, d = locked || !!off(x.id), tab = on || (!any && first && !d); if (!d) first = false; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (tab ? 0 : -1) + '" data-rg="' + esc(x.id) + '"' + (d ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
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

// @component C1 chainStage (built on SCH4U 05's C1 esterStage scene engine) — semi-structural condensation chains in SVG.
// Each monomer is a token list (C ink, O magenta, N blue, H ink-2, condensed R groups ink) with C=O drawn above and N–H
// below; free ends show their –OH / –H. Chains wrap into rows and collapse to "first f ⋯ (×k more) last 2" when they
// don't fit maxRows. Links get a --hi-soft band (flash --hi); brackets mark a repeating unit; a beaker collects waters.
// Scenes morph by node id (water atoms keep the ids of the end groups they came from), so linking and hydrolysis animate.
//   CS.spec(mon, side) · CS.entries(st, {openAt, broken, f}) · CS.lay(entries, {W, stubs}) · CS.fit(st, o, W, maxRows)
//   CS.bands(s) · CS.bracket(s, idA, idB, label) · CS.water(s, ids, x, y, op) · CS.wids(eA, eB) · CS.svg(s) · CS.mix(A, B, t)
//   CS.stage(svg, {W(), top, maxScale}) -> {load(seq), show(i), play(from, to, onStep, done, durs), cancel(), busy(), vb()}
var CS = (function(){
  var FS = 19, B = 17, HH = 11, UPD = 40, DND = 36, ROWH = 146, X0 = 12, PG = 14, OPEN = 46;
  var COL = { C:"var(--at-c)", O:"var(--at-o)", N:"var(--at-n)", H:"var(--ink-2)", R:"var(--ink)", P:"var(--ink-2)", E:"var(--ink)" };
  function tw(t, fs){
    var w = 0, prev = "";
    String(t).replace(/\^[+\-−]|\d+|[\s\S]/g, function(s){
      if (s.charAt(0) === "^" && s.length > 1) w += 0.42 * fs;
      else if (/^\d/.test(s)) w += s.length * (/[A-Za-z)]$/.test(prev) ? 0.42 : 0.56) * fs;
      else w += (/[A-Z]/.test(s) ? 0.64 : /[a-z]/.test(s) ? 0.5 : /[()]/.test(s) ? 0.34 : s === " " ? 0.28 : s === "′" ? 0.24 : s === "⋯" ? 3.1 : 0.56) * fs;
      prev = s; return s;
    });
    return w;
  }
  function hw(t){ return t ? tw(t, FS) / 2 + 1.5 : 0; }
  function tsp(t, fs){
    var out = "", base = 0, d = fs * 0.3, prev = "";
    String(t).replace(/\d+|[^\d]+/g, function(s){
      var dy, body, size = "";
      if (/^\d/.test(s) && /[A-Za-z)]$/.test(prev)) { dy = d - base; base = d; body = s; size = r1(fs * 0.72); }
      else { dy = -base; base = 0; body = esc(s); }
      out += "<tspan" + (Math.abs(dy) > 0.01 ? ' dy="' + r1(dy) + '"' : "") + (size ? ' font-size="' + size + '"' : "") + ">" + body + "</tspan>";
      prev = s; return s;
    });
    return out;
  }
  var H_ = { t:"H", el:"H" }, O_ = { t:"O", el:"O" };
  function spec(m, side){
    switch (m.k) {
      case "acid2": return { main:[{ k:"c1", t:"C", el:"C", up:1 }, { k:"r", t:m.core, el:"R" }, { k:"c2", t:"C", el:"C", up:1 }], L:[H_, O_], R:[O_, H_] };
      case "diol": return { main:[{ k:"x1", t:"O", el:"O" }, { k:"r", t:m.core, el:"R" }, { k:"x2", t:"O", el:"O" }], L:[H_], R:[H_] };
      case "diamine": return { main:[{ k:"x1", t:"N", el:"N", dn:[H_] }, { k:"r", t:m.core, el:"R" }, { k:"x2", t:"N", el:"N", dn:[H_] }], L:[H_], R:[H_] };
      case "amino": return { main:[{ k:"n", t:"N", el:"N", dn:[H_] }, { k:"r", t:"CH2", el:"R" }, { k:"c", t:"C", el:"C", up:1 }], L:[H_], R:[O_, H_] };
      case "sugar": return { main:[{ k:"r", t:"C6H10O4", el:"R" }, { k:"o", t:"O", el:"O" }], L:[H_, O_], R:[H_] };
      case "acid1": return side === "L" ? { main:[{ k:"r", t:"CH3", el:"R" }, { k:"c", t:"C", el:"C", up:1 }], R:[O_, H_] } : { main:[{ k:"c", t:"C", el:"C", up:1 }, { k:"r", t:"CH3", el:"R" }], L:[H_, O_] };
      case "ol1": return side === "L" ? { main:[{ k:"r", t:"CH3CH2", el:"R" }, { k:"o", t:"O", el:"O" }], R:[H_] } : { main:[{ k:"o", t:"O", el:"O" }, { k:"r", t:"CH2CH3", el:"R" }], L:[H_] };
      case "triol": return { main:[{ k:"x1", t:"O", el:"O" }, { k:"r1", t:"CH2", el:"R" }, { k:"ch", t:"CH", el:"R", dn:[O_, H_], br:1 }, { k:"r2", t:"CH2", el:"R" }, { k:"x2", t:"O", el:"O" }], L:[H_], R:[H_] };
      default: return { main:[{ k:"a", t:"CH2", el:"R" }, { k:"b", t:"CH2", el:"R" }] };
    }
  }
  // st: {A, B (null for one-monomer polymers), n, capL, capR, alt (addition chain)}; o: {openAt, broken:{j:1}, f}
  function mols(st){
    var out = [];
    if (st.capL) out.push({ id:"cL", mon:st.capL, sp:spec(st.capL, "L"), dim:true, cap:1 });
    for (var i = 0; i < st.n; i++) { var m = i % 2 && st.B ? st.B : st.A; out.push({ id:(st.pre || "m") + i, mon:m, sp:spec(m) }); }
    if (st.capR) out.push({ id:"cR", mon:st.capR, sp:spec(st.capR, "R"), dim:true, cap:1 });
    return out;
  }
  function entries(st, o){
    o = o || {}; var ms = mols(st), L = ms.length, br = o.broken || {}, ends = !st.alt;
    var out = ms.map(function(m, k){
      return { id:m.id, mon:m.mon, sp:m.sp, dim:m.dim, cap:m.cap,
        Lf:ends && (k === 0 || !!br[k] || o.openAt === k), Rf:ends && (k === L - 1 || !!br[k + 1] || o.openAt === k + 1),
        join:k === 0 ? "none" : br[k] ? "plus" : o.openAt === k ? "open" : "bond" };
    });
    if (o.f != null && L > o.f + 2) {
      var head = out.slice(0, o.f), tail = out.slice(L - 2);
      head[head.length - 1].Rf = false; tail[0].Lf = false; tail[0].join = "bond";
      out = head.concat([{ id:"ell", ell:true, join:"bond", sub:"×" + (L - o.f - 2) + " more" }], tail);
    }
    return out;
  }
  function sc(){ return { n:{}, b:{}, glow:{}, band:{}, br:{}, tag:{}, ln:{}, bk:null, mol:{}, links:[], rows:1, yLast:0 }; }
  function put(s, id, t, el, x, y, o){ o = o || {}; s.n[id] = { t:t, el:el, x:x, y:y, op:o.op == null ? 1 : o.op, dim:!!o.dim, w:o.w }; }
  function bond(s, a, b, ord, dim){ s.b[a + "|" + b] = { a:a, b:b, o:ord || 1, op:1, dim:!!dim }; }
  function tag(s, k, t, x, y, o){ o = o || {}; s.tag[k] = { t:t, x:x, y:y, col:o.col || "var(--ink)", fs:o.fs || 14, bold:o.bold !== false, a:o.a || "middle", op:o.op == null ? 1 : o.op }; }
  function toks(e){
    if (e.ell) return [{ k:"e", t:"⋯", el:"E" }];
    var sp = e.sp, L = e.Lf && sp.L ? sp.L.map(function(t, i){ return { k:"L" + i, t:t.t, el:t.el }; }) : [], R = e.Rf && sp.R ? sp.R.map(function(t, i){ return { k:"R" + i, t:t.t, el:t.el }; }) : [];
    return L.concat(sp.main, R);
  }
  function wOf(tk){ var w = 0; tk.forEach(function(t, i){ w += 2 * hw(t.t) + (i ? B : 0); }); return w; }
  function lay(list, o){
    var s = sc(), W = o.W, x = X0, row = 0, y = 0, prev = null, prevE = null;
    if (o.stubs) x += B + 4;
    list.forEach(function(e, ei){
      var tk = toks(e), w = wOf(tk), j = ei ? e.join : "none", wrapped = false;
      var gap = j === "bond" ? B : j === "open" ? B + OPEN : j === "plus" ? 2 * PG + 2 * hw("+") : 0;
      if (ei && x + gap + w > W - X0 - (j === "bond" ? 26 : 0) && x > X0 + 1) {
        wrapped = true;
        if (j === "bond") { put(s, prev + "~r", "", "E", x + B + 4, y); bond(s, prev, prev + "~r", 1, prevE.dim && e.dim); }
        row++; y = row * ROWH; x = X0;
        if (j === "bond") { put(s, e.id + "~l", "", "E", x, y); x += B + 4; }
        else if (j === "plus") { put(s, e.id + "+", "+", "P", x + hw("+"), y); x += 2 * hw("+") + PG; }
      } else if (ei) {
        if (j === "plus") put(s, e.id + "+", "+", "P", x + PG + hw("+"), y);
        x += gap;
      }
      var first = null, last = null, fm = null, lm = null;
      tk.forEach(function(t, i){
        var id = e.id + "." + t.k; if (i) x += B;
        var cx = x + hw(t.t); put(s, id, t.t, t.el, cx, y, { dim:e.dim });
        if (last) bond(s, last, id, 1, e.dim);
        if (t.up) { put(s, id + "u", "O", "O", cx, y - UPD, { dim:e.dim }); bond(s, id, id + "u", 2, e.dim); }
        if (t.dn) { var p = id; t.dn.forEach(function(d, k){ var did = id + "d" + k; put(s, did, d.t, d.el, cx, y + DND * (k + 1), { dim:e.dim }); bond(s, p, did, 1, e.dim); p = did; });
          if (t.br) { s.ln[id] = { x1:cx, y1:y + DND * 2 + 13, x2:cx, y2:y + DND * 2 + 38, op:1 }; tag(s, id + "t", "to another chain", cx, y + DND * 2 + 52, { fs:13, bold:false, col:"var(--ink-2)" }); s.net = 1; } }
        x = cx + hw(t.t); if (!first) first = id; last = id;
        if (!/^[LR]\d$/.test(t.k) && t.k !== "e") { if (!fm) fm = id; lm = id; }
      });
      if (e.ell) tag(s, "ellT", e.sub, x - hw("⋯"), y + 26, { fs:13, col:"var(--ink-2)" });
      if (ei && j === "bond") {
        bond(s, wrapped ? e.id + "~l" : prev, first, 1, e.dim && prevE.dim);
        if (!prevE.ell && !e.ell) s.links.push({ a:prev, b:first, wrapped:wrapped, from:prevE.id, to:e.id, y:y, py:prevE._y });
      }
      e._y = y;
      s.mol[e.id] = { first:first, last:last, fm:fm, lm:lm, row:row, y:y, x1:x };
      prev = last; prevE = e;
    });
    if (o.stubs && prev) { var f0 = list[0] && s.mol[list[0].id]; put(s, "stL", "", "E", X0, 0); bond(s, "stL", f0.first); if (o.stubs !== "L") { put(s, "stR", "", "E", x + B + 4, y); bond(s, prev, "stR"); } }
    s.rows = row + 1; s.yLast = y;
    return s;
  }
  function fit(st, o, W, maxRows, lo){
    lo = Object.assign({ W:W }, lo || {});
    var s = lay(entries(st, o), lo), L = mols(st).length;
    if (s.rows <= maxRows || !maxRows) return { s:s, f:null };
    var best = null;
    for (var f = L - 3; f >= 1; f--) { var oo = Object.assign({}, o, { f:f }); best = { s:lay(entries(st, oo), lo), f:f }; if (best.s.rows <= maxRows) return best; }
    return best || { s:s, f:null };
  }
  function bandRect(s, ids){
    var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    ids.forEach(function(id){ var n = s.n[id]; if (!n) return; var h = hw(n.t);
      x0 = Math.min(x0, n.x - h - 6); x1 = Math.max(x1, n.x + h + 6);
      y0 = Math.min(y0, n.y - (s.n[id + "u"] ? UPD + 14 : 17)); y1 = Math.max(y1, n.y + (s.n[id + "d0"] ? DND + 14 : 17)); });
    return { x0:x0, x1:x1, y0:y0, y1:y1, op:1, fl:0 };
  }
  function linkIds(s, L){ return [L.a, L.b].filter(function(id){ var n = s.n[id]; return n && (n.el === "C" || n.el === "O" || n.el === "N"); }); }
  function bands(s){
    s.links.forEach(function(L){
      var ids = linkIds(s, L), k = "bd" + L.a + "|" + L.b; if (!ids.length) return;
      if (!L.wrapped) s.band[k] = bandRect(s, ids);
      else ids.forEach(function(id, i){ s.band[k + i] = bandRect(s, [id]); });
    });
    return s;
  }
  function bracket(s, a, b, label){
    var A = s.n[a], Bn = s.n[b]; if (!A || !Bn || Math.abs(A.y - Bn.y) > 1) return;
    s.br.ru = { x0:A.x - hw(A.t) - 12, x1:Bn.x + hw(Bn.t) + 12, y0:A.y - UPD - 20, y1:A.y + DND + 16, t:label || "repeating unit", op:1 };
  }
  // water atoms (O, left H, right H) at (x, y)
  function water(s, ids, x, y, op){
    if (!ids) return;
    put(s, ids[0], "O", "O", x, y, { op:op }); put(s, ids[1], "H", "H", x - 26, y + 15, { op:op }); put(s, ids[2], "H", "H", x + 26, y + 15, { op:op });
    bond(s, ids[0], ids[1]); bond(s, ids[0], ids[2]);
  }
  // ids of the three atoms that leave as water when entry eA (left) links to eB (right): [O, H (left), H (right)]
  function wids(eA, eB){
    var a = (eA.sp.R || []).map(function(t, i){ return { id:eA.id + ".R" + i, el:t.el }; }), b = (eB.sp.L || []).map(function(t, i){ return { id:eB.id + ".L" + i, el:t.el }; });
    var all = a.concat(b), o = all.filter(function(x){ return x.el === "O"; })[0], h = all.filter(function(x){ return x.el === "H"; });
    return o && h.length === 2 ? [o.id, h[0].id, h[1].id] : null;
  }
  function linkPos(s, from, to){
    var L = s.links.filter(function(x){ return x.from === from && x.to === to; })[0]; if (!L) return null;
    var A = s.n[L.a], Bn = s.n[L.b];
    return L.wrapped ? { x:A.x + hw(A.t) + 14, y:A.y, L:L } : { x:(A.x + Bn.x) / 2, y:A.y, L:L };
  }
  function bbox(list){
    var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    function inc(a, b, c, d){ x0 = Math.min(x0, a); x1 = Math.max(x1, b); y0 = Math.min(y0, c); y1 = Math.max(y1, d); }
    list.forEach(function(s){
      Object.keys(s.n).forEach(function(k){ var n = s.n[k]; if (n.op < 0.02) return; var h = Math.max(hw(n.t), 2); inc(n.x - h, n.x + h, n.y - HH, n.y + HH); });
      Object.keys(s.band).forEach(function(k){ var b = s.band[k]; inc(b.x0, b.x1, b.y0, b.y1); });
      Object.keys(s.br).forEach(function(k){ var b = s.br[k]; inc(b.x0, b.x1, b.y0, b.y1 + 26); });
      Object.keys(s.tag).forEach(function(k){ var g = s.tag[k], w = tw(g.t, g.fs); var a = g.a === "start" ? g.x : g.a === "end" ? g.x - w : g.x - w / 2; inc(a, a + w, g.y - 10, g.y + 10); });
      Object.keys(s.ln).forEach(function(k){ var l = s.ln[k]; inc(Math.min(l.x1, l.x2), Math.max(l.x1, l.x2), Math.min(l.y1, l.y2), Math.max(l.y1, l.y2)); });
      if (s.bk) inc(s.bk.x, s.bk.x + 120, s.bk.y - 6, s.bk.y + 100);
    });
    return { x0:x0, x1:x1, y0:y0, y1:y1 };
  }
  function opA(op){ return op < 0.99 ? ' opacity="' + r1(op) + '"' : ""; }
  function rect(b, fill, op){ return '<rect x="' + r1(b.x0) + '" y="' + r1(b.y0) + '" width="' + r1(b.x1 - b.x0) + '" height="' + r1(b.y1 - b.y0) + '" rx="12" fill="' + fill + '"' + opA(op) + "/>"; }
  function seg(A, Bn, pad){
    var dx = Bn.x - A.x, dy = Bn.y - A.y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, ha = A.t ? hw(A.t) : 0, hb = Bn.t ? hw(Bn.t) : 0;
    var ta = A.t ? Math.min(ux ? ha / Math.abs(ux) : 1e9, uy ? HH / Math.abs(uy) : 1e9) + pad : 0, tb = Bn.t ? Math.min(ux ? hb / Math.abs(ux) : 1e9, uy ? HH / Math.abs(uy) : 1e9) + pad : 0;
    return { ax:A.x + ux * ta, ay:A.y + uy * ta, bx:Bn.x - ux * tb, by:Bn.y - uy * tb, ux:ux, uy:uy, ok:ta + tb < L - 2 };
  }
  function glyph(x, y){
    return '<circle cx="' + r1(x - 6.4) + '" cy="' + r1(y + 3.8) + '" r="3.6" fill="var(--at-h)" stroke="var(--at-h-line)" stroke-width="1"/><circle cx="' + r1(x + 6.4) + '" cy="' + r1(y + 3.8) + '" r="3.6" fill="var(--at-h)" stroke="var(--at-h-line)" stroke-width="1"/><circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="5.6" fill="var(--at-o)"/>';
  }
  function beaker(k){
    var x = k.x, y = k.y, out = '<rect x="' + r1(x + 3) + '" y="' + r1(y + 26) + '" width="110" height="66" rx="6" fill="var(--info-bg)"/>' +
      '<path d="M' + r1(x) + " " + r1(y) + " V" + r1(y + 86) + " Q" + r1(x) + " " + r1(y + 96) + " " + r1(x + 10) + " " + r1(y + 96) + " H" + r1(x + 106) + " Q" + r1(x + 116) + " " + r1(y + 96) + " " + r1(x + 116) + " " + r1(y + 86) + " V" + r1(y) + '" fill="none" stroke="var(--ink-2)" stroke-width="2.6" stroke-linejoin="round"/>';
    if (!k.hide) for (var i = 0; i < Math.min(k.n, 25); i++) out += glyph(x + 15 + (i % 5) * 21.5, y + 82 - Math.floor(i / 5) * 15.5);
    else out += '<text x="' + r1(x + 58) + '" y="' + r1(y + 60) + '" text-anchor="middle" dominant-baseline="central" font-size="30" font-weight="700" fill="var(--ink)">?</text>';
    out += '<text x="' + r1(x + 132) + '" y="' + r1(y + 40) + '" font-size="16" font-weight="700" fill="var(--ink)">' + esc(k.lab || ("Water collected: " + (k.hide ? "?" : k.n))) + "</text>";
    if (k.sub) out += '<text x="' + r1(x + 132) + '" y="' + r1(y + 62) + '" font-size="13" fill="var(--ink-2)">' + esc(k.sub) + "</text>";
    return out;
  }
  function svgOf(s){
    var out = "", N = s.n;
    Object.keys(s.band).forEach(function(k){ var b = s.band[k]; if (b.op < 0.02) return; out += rect(b, "var(--hi-soft)", b.op); if (b.fl > 0.02) out += rect(b, "var(--hi)", b.fl * b.op * 0.85); });
    Object.keys(s.br).forEach(function(k){ var b = s.br[k]; if (b.op < 0.02) return;
      out += '<path d="M' + r1(b.x0 + 9) + " " + r1(b.y0) + " H" + r1(b.x0) + " V" + r1(b.y1) + " H" + r1(b.x0 + 9) + " M" + r1(b.x1 - 9) + " " + r1(b.y0) + " H" + r1(b.x1) + " V" + r1(b.y1) + " H" + r1(b.x1 - 9) + '" fill="none" stroke="var(--ink)" stroke-width="2.4"' + opA(b.op) + "/>";
      if (b.t) out += '<text x="' + r1((b.x0 + b.x1) / 2) + '" y="' + r1(b.y1 + 16) + '" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="var(--ink)"' + opA(b.op) + ">" + esc(b.t) + "</text>"; });
    Object.keys(s.glow).forEach(function(k){ var op = s.glow[k], n = N[k]; if (!n || op * n.op < 0.02) return;
      out += '<circle cx="' + r1(n.x) + '" cy="' + r1(n.y) + '" r="14" fill="var(--hi)" stroke="var(--hi-ink)" stroke-width="1.2"' + opA(op * n.op * 0.9) + "/>"; });
    Object.keys(s.b).forEach(function(k){
      var b = s.b[k], A = N[b.a], Bn = N[b.b]; if (!A || !Bn) return;
      var op = Math.min(b.op, A.op, Bn.op); if (op < 0.02) return;
      var g = seg(A, Bn, 1.5); if (!g.ok) return;
      (b.o === 2 ? [-3.3, 3.3] : [0]).forEach(function(d){
        out += '<line x1="' + r1(g.ax - g.uy * d) + '" y1="' + r1(g.ay + g.ux * d) + '" x2="' + r1(g.bx - g.uy * d) + '" y2="' + r1(g.by + g.ux * d) + '" stroke="' + (b.dim ? "var(--ink-2)" : "var(--ink)") + '" stroke-width="2.1" stroke-linecap="round"' + opA(op) + "/>";
      });
    });
    Object.keys(s.ln).forEach(function(k){ var l = s.ln[k]; if (l.op < 0.02) return;
      out += '<line x1="' + r1(l.x1) + '" y1="' + r1(l.y1) + '" x2="' + r1(l.x2) + '" y2="' + r1(l.y2) + '" stroke="' + (l.col || "var(--ink-2)") + '" stroke-width="2" stroke-dasharray="5 4"' + opA(l.op) + "/>";
      if (l.arrow) { var L = Math.hypot(l.x2 - l.x1, l.y2 - l.y1) || 1, ux = (l.x2 - l.x1) / L, uy = (l.y2 - l.y1) / L;
        out += '<path d="M' + r1(l.x2) + " " + r1(l.y2) + " L" + r1(l.x2 - ux * 11 - uy * 5.5) + " " + r1(l.y2 - uy * 11 + ux * 5.5) + " L" + r1(l.x2 - ux * 11 + uy * 5.5) + " " + r1(l.y2 - uy * 11 - ux * 5.5) + 'Z" fill="' + (l.col || "var(--ink-2)") + '"' + opA(l.op) + "/>"; } });
    Object.keys(N).forEach(function(k){ var n = N[k]; if (n.op < 0.02 || !n.t) return;
      if (n.t === "⋯") { [-13, 0, 13].forEach(function(d){ out += '<circle cx="' + r1(n.x + d) + '" cy="' + r1(n.y) + '" r="3.2" fill="var(--ink)"' + opA(n.op) + "/>"; }); return; }
      out += '<text x="' + r1(n.x) + '" y="' + r1(n.y) + '" text-anchor="middle" dominant-baseline="central" font-size="' + FS + '" font-weight="' + (n.el === "O" || n.el === "N" ? 700 : 400) + '" fill="' + (n.dim ? "var(--ink-2)" : (COL[n.el] || "var(--ink)")) + '"' + opA(n.op) + ">" + tsp(n.t, FS) + "</text>"; });
    Object.keys(s.tag).forEach(function(k){ var g = s.tag[k]; if (g.op < 0.02) return;
      out += '<text x="' + r1(g.x) + '" y="' + r1(g.y) + '" text-anchor="' + g.a + '" dominant-baseline="central" font-size="' + g.fs + '" font-weight="' + (g.bold ? 700 : 400) + '" fill="' + g.col + '"' + opA(g.op) + ">" + tsp(g.t, g.fs) + "</text>"; });
    if (s.bk) out += beaker(s.bk);
    return out;
  }
  function keys2(a, b){ var k = {}; Object.keys(a).forEach(function(x){ k[x] = 1; }); Object.keys(b).forEach(function(x){ k[x] = 1; }); return Object.keys(k); }
  function mixObj(A, Bs, t, nums){
    var S = {};
    keys2(A, Bs).forEach(function(k){ var a = A[k], b = Bs[k];
      if (a && b) { var o = Object.assign({}, t < 0.5 ? a : b); nums.forEach(function(f){ if (a[f] != null && b[f] != null) o[f] = lerp(a[f], b[f], t); }); S[k] = o; }
      else if (a) S[k] = Object.assign({}, a, { op:(a.op == null ? 1 : a.op) * (1 - t) }); else S[k] = Object.assign({}, b, { op:(b.op == null ? 1 : b.op) * t }); });
    return S;
  }
  function mix(A, Bs, t){
    var S = sc();
    S.n = mixObj(A.n, Bs.n, t, ["x", "y", "op"]);
    keys2(A.b, Bs.b).forEach(function(k){ var a = A.b[k], b = Bs.b[k]; S.b[k] = Object.assign({}, a || b, { op:a && b ? 1 : a ? 1 - t : t }); });
    keys2(A.glow, Bs.glow).forEach(function(k){ S.glow[k] = lerp(A.glow[k] || 0, Bs.glow[k] || 0, t); });
    S.band = mixObj(A.band, Bs.band, t, ["x0", "x1", "y0", "y1", "op", "fl"]);
    S.br = mixObj(A.br, Bs.br, t, ["x0", "x1", "y0", "y1", "op"]);
    S.tag = mixObj(A.tag, Bs.tag, t, ["x", "y", "op"]);
    S.ln = mixObj(A.ln, Bs.ln, t, ["x1", "y1", "x2", "y2", "op"]);
    if (A.bk || Bs.bk) { var a = A.bk || Bs.bk, b = Bs.bk || A.bk; S.bk = Object.assign({}, t < 0.7 ? a : b, { x:lerp(a.x, b.x, t), y:lerp(a.y, b.y, t) }); }
    return S;
  }
  function stage(svg, o){
    o = o || {};
    var st = { seq:null, i:0, tok:0, cancel:null, busy:false, vb:[0, 0, 100, 100] };
    function setVB(){
      var bb = bbox(st.seq), W = o.W ? o.W() : 600, x0 = Math.min(0, bb.x0 - 6), x1 = Math.max(W, bb.x1 + 6), y0 = Math.min(o.top == null ? 1e9 : o.top, bb.y0) - 6;
      if (o.fit) { var cwp = svg.getBoundingClientRect().width || W, vw = Math.max(bb.x1 - bb.x0 + 16, cwp / (o.maxScale || 1.15)); x0 = (bb.x0 + bb.x1) / 2 - vw / 2; x1 = x0 + vw; }
      x0 = Math.floor(x0); y0 = Math.floor(y0); // whole-number viewBox origin: Chrome can drop vertical round-capped lines at fractional offsets
      st.vb = [x0, y0, Math.ceil(x1 - x0), Math.ceil(bb.y1 + 8 - y0)];
      svg.setAttribute("viewBox", st.vb.join(" "));
    }
    function draw(s){ svg.innerHTML = svgOf(s); }
    function cancel(){ st.tok++; if (st.cancel) { st.cancel(); st.cancel = null; } st.busy = false; }
    return {
      load:function(seq){ cancel(); st.seq = seq; st.i = 0; setVB(); },
      show:function(i){ cancel(); st.i = clamp(i, 0, st.seq.length - 1); draw(st.seq[st.i]); },
      play:function(from, to, onStep, done, durs){
        cancel(); var tok = ++st.tok; st.busy = true; st.i = from; draw(st.seq[from]);
        (function next(k){
          if (tok !== st.tok) return;
          if (k >= to) { st.i = to; st.busy = false; if (done) done(); return; }
          if (onStep) onStep(k + 1);
          st.cancel = MV.tween({ dur:(durs && durs[k]) || o.dur || 900, step:function(t){ if (tok === st.tok) draw(mix(st.seq[k], st.seq[k + 1], t)); },
            done:function(){ if (tok !== st.tok) return; st.i = k + 1; st.cancel = null; MV.wait(o.pause || 320, function(){ next(k + 1); }); } });
        })(from);
      },
      cancel:cancel, busy:function(){ return st.busy; }, vb:function(){ return st.vb; }
    };
  }
  return { spec:spec, mols:mols, entries:entries, lay:lay, fit:fit, bands:bands, bracket:bracket, water:water, wids:wids, linkPos:linkPos,
    svg:svgOf, mix:mix, stage:stage, bbox:bbox, tag:tag, put:put, bond:bond, hw:hw, tsp:tsp, ROWH:ROWH, X0:X0, UPD:UPD, DND:DND };
})();
function cw(el, fb){ return Math.round(el.getBoundingClientRect().width) || fb || 560; }
function unitsW(px){ return px / (px < 520 ? 0.8 : px < 760 ? 0.92 : 1); }

// ---------- chain chemistry ----------
function stOf(S){ var A = MON[S.a]; return { A:A, B:A.single ? null : MON[S.b], n:S.n, capL:S.capL ? MON[S.capL] : null, capR:S.capR ? MON[S.capR] : null }; }
function polyOf(A, B){
  if (A.k === "amino") return { type:"protein (polypeptide)", link:"amide (peptide), –CO–NH–", amide:true };
  if (A.k === "sugar") return { type:"polysaccharide", link:"glycosidic, C–O–C" };
  if (B.k === "diol") return { type:"polyester" + (A.id === "terA" && B.id === "eg" ? " (PET)" : ""), link:"ester, –COO–", ester:true };
  return { type:"polyamide" + (A.id === "hexA" && B.id === "hmda" ? " (nylon-6,6)" : A.id === "terA" && B.id === "ppd" ? " (Kevlar)" : ""), link:"amide, –CO–NH–", amide:true };
}
function ruOf(A, B){
  if (A.k === "amino") return { f:"–[NH–CH2–CO]–", M:A.M - WATER, line:A.M + " " + MINUS + " " + WATER };
  if (A.k === "sugar") return { f:"–[O–C6H10O4]–", M:A.M - WATER, line:A.M + " " + MINUS + " " + WATER };
  var am = B.k === "diamine";
  return { f:"–[CO–" + A.core + "–CO–" + (am ? "NH–" + B.core + "–NH" : "O–" + B.core + "–O") + "]–", M:A.M + B.M - 2 * WATER, line:A.M + " + " + B.M + " " + MINUS + " 2 × " + WATER };
}
function massOf(st){
  var parts = [], tot = 0;
  if (st.B) { var nA = Math.ceil(st.n / 2), nB = Math.floor(st.n / 2); parts.push(nA + " × " + st.A.M); tot += nA * st.A.M; if (nB) { parts.push(nB + " × " + st.B.M); tot += nB * st.B.M; } }
  else { parts.push(st.n + " × " + st.A.M); tot += st.n * st.A.M; }
  [st.capL, st.capR].forEach(function(c){ if (c) { parts.push(String(c.M)); tot += c.M; } });
  var mols = st.n + (st.capL ? 1 : 0) + (st.capR ? 1 : 0), links = mols - 1, ch = tot - links * WATER;
  return { mols:mols, links:links, tot:tot, chain:ch, sum:parts.join(" + "), line:parts.join(" + ") + " " + MINUS + " " + links + " × " + WATER + " = " + num(ch) + " g/mol" };
}
// reactive group kinds at the chain's ends: "a" (–COOH, or glucose's leaving –OH), "b" (–OH or –NH₂ that loses H), null if capped
function endsOf(st){
  var Rm = st.B && st.n % 2 === 0 ? st.B : st.A, lk = { acid2:"a", amino:"b", sugar:"a" }, rk = { acid2:"a", diol:"b", diamine:"b", amino:"a", sugar:"b" };
  return { L:st.capL ? null : lk[st.A.k], R:st.capR ? null : rk[Rm.k] };
}
function capSide(st, cap){
  var e = endsOf(st), need = cap === "acoh" ? "b" : "a";
  if (e.R === need) return "R";
  if (cap !== "tri" && e.L === need) return "L";
  return null;
}
function statusOf(st){
  if ((st.capR && st.capR.k === "triol") || (st.capL && st.capL.k === "triol")) return "Cross-linked network";
  var c = (st.capL ? 1 : 0) + (st.capR ? 1 : 0);
  return c === 2 ? "Capped at both ends: it can’t grow" : c === 1 ? "Capped at one end" : "Both ends can still react";
}

// ---------- scenes ----------
// Explore / Part 3 decoration: bands, the repeating-unit bracket, cap tags, the beaker
function decorate(s, st, o){
  o = o || {};
  CS.bands(s);
  if (!o.noBr && st.n >= 2) {
    var a = s.mol.m0, b = st.B ? s.mol.m1 : s.mol.m0;
    if (a && b && a.row === b.row) CS.bracket(s, a.fm, b.lm);
  }
  ["cL", "cR"].forEach(function(id){ var m = s.mol[id]; if (!m) return; var A = s.n[m.fm], Bn = s.n[m.lm];
    var up = Object.keys(s.n).some(function(k){ return k.indexOf(id + ".") === 0 && /u$/.test(k); });
    CS.tag(s, id + "t", (st.capR && id === "cR" && st.capR.k === "triol") ? "branch point" : "capped", (A.x + Bn.x) / 2, m.y - (up ? CS.UPD + 26 : 32), { fs:14, col:"var(--ink-2)" }); });
  if (o.bk) s.bk = { x:CS.X0, y:s.yLast + (s.net ? 128 : 92), n:o.bk.n, hide:o.bk.hide, lab:o.bk.lab, sub:o.bk.sub };
  return s;
}
function bkInfo(n, hide){ return { n:n, hide:hide, lab:hide ? "Links: ? · Water: ?" : "Links: " + n + " · Water: " + n, sub:"one water per link" }; }
// One link animation: [before, newcomer arrives, ends glow, water forms above the new link, water drops into the beaker]
// openAt = index (in the after-state molecule list) of the link that forms. o: {W, maxRows, noBr, dest(scene, ids, k)}
function linkSeq(stB, stA, openAt, o){
  var fitA = CS.fit(stA, {}, o.W, o.maxRows), f = fitA.f, waters = massOf(stA).links;
  var before = o.before || decorate(CS.fit(stB, {}, o.W, o.maxRows).s, stB, { noBr:o.noBr, bk:o.bk ? bkInfo(waters - 1) : null });
  var eAll = CS.entries(stA, { openAt:openAt }), ids = CS.wids(eAll[openAt - 1], eAll[openAt]);
  var pre = decorate(CS.lay(CS.entries(stA, { openAt:openAt, f:f }), { W:o.W }), stA, { noBr:o.noBr, bk:o.bk ? bkInfo(waters - 1) : null });
  var glow = clone(pre); if (ids) ids.forEach(function(id){ glow.glow[id] = 1; });
  var post = decorate(fitA.s, stA, { noBr:o.noBr, bk:o.bk ? bkInfo(waters) : null });
  var mid = clone(post); mid.bk = clone(pre.bk);
  var lp = CS.linkPos(post, eAll[openAt - 1].id, eAll[openAt].id);
  if (lp) { Object.keys(mid.band).forEach(function(k){ if (k.indexOf("bd" + lp.L.a + "|" + lp.L.b) === 0) mid.band[k].fl = 1; }); CS.water(mid, ids, lp.x, lp.y - 82, 1); }
  var end = clone(post);
  if (o.dest) o.dest(end, ids); else if (end.bk && ids) CS.water(end, ids, end.bk.x + 58, end.bk.y + 20, 0);
  return { seq:[before, pre, glow, mid, end], post:post, ids:ids };
}
var LINKCAP = ["", "The next molecule arrives at the chain end.", "Its reacting end and the chain’s end light up: an –OH and an –H.",
  "They leave together as one water molecule, and a new link forms.", "The water drops into the beaker: one water for every link."];

// ---------- hero: diacid + diamine, four links, four waters ----------
var HCAP = ["A diacid (two –COOH ends) and a diamine (two –NH₂ ends) drift together.", "At the touching ends, the –OH and the –H glow…",
  "…and leave together as a water molecule. A new C–N bond forms: an amide link.", "Another monomer docks on the free end."];
function hero(){
  var svg = $("#cp-hx-svg"), box = $("#cp-hx-box"), cap = $("#cp-hx-cap"), rep = $("#cp-hx-replay");
  if (!svg) return;
  var A = { k:"acid2", core:"R", M:0 }, Bm = { k:"diamine", core:"R′", M:0 }, lastW = 0, playing = false, frames = [], caps = [], stg = null, s2 = null;
  function W(){ return unitsW(cw(box, 440)); }
  function st(n){ return { A:A, B:Bm, n:n }; }
  function build(){
    lastW = cw(box, 440);
    var w = W(), coll = [], rows = 0, k, i;
    var fin = CS.fit(st(5), {}, w, 3).s, yW = fin.yLast + 118;
    function slot(j){ return [CS.X0 + 34 + j * 82, yW]; }
    function addColl(s, upto, lab){ for (var j = 0; j < upto; j++) CS.water(s, coll[j], slot(j)[0], slot(j)[1], 1); CS.tag(s, "cnt", lab, CS.X0, yW - 34, { a:"start", fs:15 }); return s; }
    frames = []; caps = [];
    for (k = 1; k <= 4; k++) {
      var L = linkSeq(st(k), st(k + 1), k, { W:w, maxRows:3, noBr:true, dest:function(s, ids){ var p = slot(k - 1); CS.water(s, ids, p[0], p[1], 1); } });
      coll[k - 1] = L.ids;
      var lab0 = "Links: " + (k - 1) + " · Water released: " + (k - 1), lab1 = "Links: " + k + " · Water released: " + k;
      if (k === 1) { var a0 = clone(L.seq[1]); Object.keys(a0.n).forEach(function(id){ if (/^m1\./.test(id)) a0.n[id].op = 0; }); frames.push(addColl(a0, 0, lab0)); caps.push(HCAP[0]); }
      for (i = 1; i < 5; i++) frames.push(addColl(L.seq[i], i === 4 ? k - 1 : k - 1, i === 4 ? lab1 : lab0));
      caps.push(k === 1 ? HCAP[0] : HCAP[3], HCAP[1], HCAP[2], lab1 + ".");
    }
    var last = clone(frames[frames.length - 1]); CS.bracket(last, last.mol.m0.fm, last.mol.m1.lm); frames.push(last);
    caps.push("Four links, four waters released. The bracket marks one repeating unit: –[CO–R–CO–NH–R′–NH]–.");
    void rows;
    if (!stg) stg = CS.stage(svg, { W:W, dur:850, pause:260 });
    stg.load(frames);
  }
  var END = "After four links: four waters released (Links: 4 · Water released: 4). The bracket marks one repeating unit, –[CO–R–CO–NH–R′–NH]–.";
  build();
  if (MV.reduceMotion) {
    // before and after frames, with the water count
    var b4 = document.createElementNS("http://www.w3.org/2000/svg", "svg"); b4.setAttribute("class", "cp-svg"); b4.setAttribute("role", "img");
    b4.setAttribute("aria-label", "Before: a diacid and a diamine side by side, not yet linked. Links: 0, water released: 0.");
    var lab = document.createElement("p"); lab.className = "cp-hx-lab"; lab.textContent = "Before"; box.insertBefore(lab, svg); box.insertBefore(b4, svg);
    var lab2 = document.createElement("p"); lab2.className = "cp-hx-lab"; lab2.textContent = "After"; box.insertBefore(lab2, svg);
    s2 = CS.stage(b4, { W:W }); s2.load([frames[1]]); s2.show(0);
    stg.show(frames.length - 1); cap.textContent = END;
  } else {
    var play = function(){
      playing = true; rep.hidden = true;
      stg.play(0, frames.length - 1, function(i){ cap.textContent = caps[i] || ""; }, function(){ playing = false; rep.hidden = false; cap.textContent = END; });
    };
    cap.textContent = caps[0];
    rep.addEventListener("click", function(){ build(); play(); });
    play();
  }
  if (window.ResizeObserver) new ResizeObserver(function(){ var w = cw(box, 0); if (!w || Math.abs(w - lastW) < 30 || playing) return; build(); stg.show(frames.length - 1); if (s2) { s2.load([frames[1]]); s2.show(0); } }).observe(box);
}

// ---------- Explore: Condensation chain builder ----------
function explore(host, api){
  var S = api.S, C = api.content;
  if (AS.indexOf(S.a) < 0) S.a = "hexA";
  if (BS.indexOf(S.b) < 0) S.b = "hmda";
  if (["build", "compare", "cap"].indexOf(S.mode) < 0) S.mode = "build";
  S.n = clamp(+S.n || 6, 1, 20); if (S.n < 2) S.n = 2;
  if (S.mode !== "cap" || ["acoh", "etoh"].indexOf(S.capL) < 0) S.capL = null;
  if (S.mode !== "cap" || ["acoh", "etoh", "tri"].indexOf(S.capR) < 0) S.capR = null;
  S.entry = S.entry == null ? "" : String(S.entry); S.cover = !!S.cover;
  var busy = false, msg = "", hide = {}, pend = false, lastW = 0, ledgerVals = null, seqNow = null;
  host.innerHTML = '<p class="how cp-how">' + C.how + "</p>" +
    '<div class="cp-grid"><div class="cp-view" data-mv="graph"><p class="cp-cap" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<p class="cp-sub cp-lab1">Condensation chain</p><div class="cp-box"><svg class="cp-svg cp-main" role="img" aria-label="Condensation chain"></svg></div><p class="cp-stepcap" aria-live="polite"></p>' +
    '<div class="cp-cmp"><p class="cp-sub">Addition chain: ethene → polyethene</p><div class="cp-box"><svg class="cp-svg cp-add" role="img" aria-label="Addition chain"></svg></div><div class="cp-ledger" aria-live="polite"></div></div></div>' +
    '<div class="cp-ctrl"><div class="cp-modes"></div><div class="cp-as"></div><div class="cp-bs"></div><div class="cp-len"></div>' +
    '<div class="q-actions cp-act"><button type="button" class="btn primary cp-link" data-k="cplink">Link</button></div>' +
    '<div class="cp-capc"><p class="cp-sub">Add to a free end</p><div class="cp-capb">' +
    '<button type="button" class="btn ghost sm" data-cap="acoh" data-k="cpacoh">Cap with ethanoic acid (one –COOH)</button>' +
    '<button type="button" class="btn ghost sm" data-cap="etoh" data-k="cpetoh">Cap with ethanol (one –OH)</button>' +
    '<button type="button" class="btn ghost sm" data-cap="tri" data-k="cptri">Add propane-1,2,3-triol (three –OH)</button>' +
    '<button type="button" class="btn ghost sm" data-cap="none" data-k="cpnone">Remove caps</button></div></div>' +
    '<form class="cp-entry"><label for="cp-ent">Your chain molar mass (challenge 2 reads this box)</label><span class="cp-er"><input type="text" id="cp-ent" class="cp-ent" inputmode="decimal" autocomplete="off"><span class="m">g/mol</span></span></form>' +
    '<label class="cp-cover"><input type="checkbox" class="cp-cin"> Cover the mass rows (work them out yourself)</label><p class="cp-msg" aria-live="polite"></p></div>' +
    '<div class="cp-right"><dl class="read cp-read" aria-live="polite"></dl>' + MV.usesHTML(C.use) + "</div></div>";
  var svg = $(".cp-main", host), box = $(".cp-view .cp-box", host), svgA = $(".cp-add", host), linkBtn = $(".cp-link", host), cin = $(".cp-cin", host), ent = $(".cp-ent", host);
  function W(){ return unitsW(cw(box)); }
  function maxRows(){ return cw(box) < 520 ? 3 : 2; }
  var stg = CS.stage(svg, { W:W, top:-112, dur:820, pause:220 }), stgA = CS.stage(svgA, { W:W, top:-60 });
  var modeRG = radios($(".cp-modes", host), { label:"Mode", aria:"Mode", options:C.modes, value:S.mode, onChange:function(v){ S.mode = v; S.capL = S.capR = null; msg = ""; reset(); api.save(); refresh(); } });
  var aRG = radios($(".cp-as", host), { label:"Monomer A", aria:"Monomer A", cls:"chips", options:AS.map(function(k){ var m = MON[k]; return { id:k, t:m.nm + (m.k === "amino" ? " (amino acid)" : "") }; }), value:S.a, onChange:function(v){ S.a = v; S.capL = S.capR = null; msg = ""; reset(); api.save(); refresh(); } });
  var bRG = radios($(".cp-bs", host), { label:"Monomer B", aria:"Monomer B", cls:"chips", options:BS.map(function(k){ return { id:k, t:MON[k].nm }; }), value:S.b, onChange:function(v){ S.b = v; S.capL = S.capR = null; msg = ""; reset(); api.save(); refresh(); } });
  var sl = MV.sliders($(".cp-len", host), [{ id:"cplen", label:"Chain length", min:2, max:20, step:1, value:Math.max(2, S.n), fmt:function(v){ return v + " molecules"; } }], function(id, v){ if (busy) { sl.set("cplen", S.n); return; } S.n = v; S.capL = S.capR = null; msg = ""; reset(); api.save(); refresh(); });
  cin.checked = S.cover; ent.value = S.entry;
  function reset(){ hide = {}; pend = false; ledgerVals = null; }
  function st(){ return stOf(S); }
  function lock(b){ [modeRG, aRG, bRG].forEach(function(r){ r.lock(b); }); linkBtn.disabled = b || S.n >= 20 || !!S.capR; $$(".cp-capb button, .cp-len input", host).forEach(function(x){ x.disabled = b; }); }
  function staticScene(){
    var s = st(), w = W();
    if (pend) { var prev = Object.assign({}, s, { n:s.n - 1 }); return linkSeq(prev, s, s.n - 1 + (s.capL ? 1 : 0), { W:w, maxRows:maxRows(), bk:true }).seq[1]; }
    var f = CS.fit(s, {}, w, maxRows()), m = massOf(s);
    return decorate(f.s, s, { bk:bkInfo(m.links, !!hide.count) });
  }
  function addScene(){
    var w = W(), s = { A:MON.eth, B:null, n:S.n, alt:true, pre:"e" }, f = CS.fit(s, {}, w, maxRows(), { stubs:true }).s;
    f.bk = { x:CS.X0, y:f.yLast + 52, n:0, lab:"Water collected: 0", sub:"addition: nothing is lost" };
    return f;
  }
  function drawStatic(){
    lastW = cw(box); seqNow = [staticScene()]; stg.load(seqNow); stg.show(0);
    if (S.mode === "compare") { stgA.load([addScene()]); stgA.show(0); }
    ariaMain();
  }
  function ariaMain(){
    var s = st(), m = massOf(s), p = polyOf(s.A, s.B);
    svg.setAttribute("aria-label", "Condensation chain of " + m.mols + " molecules (" + MV.plain(p.type) + "), " + (hide.count || pend ? "water count hidden" : m.links + " links and " + m.links + " water molecules in the beaker") + ". " + statusOf(s) + ".");
    svgA.setAttribute("aria-label", "Addition chain of " + S.n + " ethene units: polyethene, no water released.");
  }
  function paintCap(){
    var s = st(), a = s.A, b = s.B;
    $(".cp-cap", host).innerHTML = F(a.cond) + (b ? " + " + F(b.cond) : "") + ' <span class="cp-capn">→ ' + polyOf(a, b).type + " + water</span>";
  }
  function paintRead(){
    var s = st(), m = massOf(s), p = polyOf(s.A, s.B), ru = ruOf(s.A, s.B), q = "?", cov = S.cover ? muted("covered") : null;
    var hid = hide.count || pend, rows = [
      ["Polymer type", p.type], ["Link", p.link],
      ["Monomer molecules", String(m.mols) + (s.capL || s.capR ? " (including " + ((s.capL ? 1 : 0) + (s.capR ? 1 : 0)) + " on the ends)" : "") + (pend ? " (last one not linked yet)" : "")],
      ["Links", hid ? q : String(m.links) + muted(" (molecules − 1)")], ["Water released", hid ? q : String(m.links)],
      ["Chain molar mass", cov || (hid || hide.mass ? q : m.line)],
      ["Repeating unit", F(ru.f) + ", " + (cov || ru.M + " g/mol" + muted(" (" + ru.line + ")"))],
      ["Chain status", statusOf(s)]];
    $(".cp-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintLedger(){
    if (S.mode !== "compare") return;
    var s = st(), m = massOf(s), ae = MON.eth, at = S.n * ae.M, lv = ledgerVals;
    var wl = hide.ledger ? "?" : lv ? MINUS + " " + lv.k + " × " + WATER + " = " + MINUS + " " + num(lv.k * WATER) + " g/mol" : MINUS + " " + m.links + " × " + WATER + " = " + MINUS + " " + num(m.links * WATER) + " g/mol";
    var cm = hide.ledger ? "?" : lv ? num(m.tot - lv.k * WATER) + " g/mol" : num(m.chain) + " g/mol";
    $(".cp-ledger", host).innerHTML = MV.tableHTML({ head:["", "Condensation chain", "Addition chain"], caption:"Mass ledger: condensation chain vs addition chain", rows:[
      ["Monomer molecules", String(m.mols), String(S.n) + " ethene"], ["Total monomer mass", m.sum + " = " + num(m.tot) + " g/mol", S.n + " × " + ae.M + " = " + num(at) + " g/mol"],
      ["Water lost", wl, hide.ledger ? "?" : "0"], ["Chain molar mass", cm, hide.ledger ? "?" : num(at) + " g/mol (= monomer total)"]] });
  }
  function setVis(){
    var md = S.mode, A = MON[S.a];
    $(".cp-cmp", host).hidden = md !== "compare"; $(".cp-lab1", host).hidden = md !== "compare";
    $(".cp-capc", host).hidden = md !== "cap"; $(".cp-bs", host).hidden = !!A.single;
  }
  function paint(){
    setVis(); paintCap(); paintRead(); paintLedger();
    linkBtn.disabled = busy || S.n >= 20 || !!S.capR;
    linkBtn.textContent = S.capR ? "Link (this end is capped)" : S.n >= 20 ? "Link (20 is the most)" : "Link";
    $(".cp-msg", host).innerHTML = msg;
    MV.changed();
  }
  function refresh(){ sl.set("cplen", Math.max(2, S.n)); drawStatic(); paint(); }
  // animate the next link (n → n + 1), or a cap joining (side "L" / "R")
  function animate(stB, stA, openAt, done){
    busy = true; lock(true); msg = ""; $(".cp-msg", host).innerHTML = "";
    var L = linkSeq(stB, stA, openAt, { W:W(), maxRows:maxRows(), bk:true, before:pend ? seqNow[0] : null });
    var from = pend ? 1 : 0; pend = false;
    stg.load(L.seq);
    if (S.mode === "compare" && stA.n !== stB.n) { stgA.load([addScene()]); stgA.show(0); }
    stg.play(from, L.seq.length - 1, function(i){ $(".cp-stepcap", host).textContent = LINKCAP[i] || ""; }, function(){
      busy = false; lock(false); $(".cp-stepcap", host).textContent = "";
      drawStatic(); paint(); if (done) MV.wait(250, done);
    }, [700, 650, 800, 750]);
  }
  function link(done){
    if (busy) { if (done) done(); return; }
    if (S.capR) { msg = "This end is capped: it can’t grow. Remove the caps, or change the length."; paint(); if (done) done(); return; }
    if (S.n >= 20 && !pend) { msg = "20 molecules is the most this builder shows."; paint(); if (done) done(); return; }
    var stA, stB;
    if (pend) { stA = st(); stB = Object.assign({}, stA, { n:stA.n - 1 }); }
    else { stB = st(); S.n++; stA = st(); sl.set("cplen", S.n); }
    hide = {}; api.save(); paintRead();
    animate(stB, stA, stA.n - 1 + (stA.capL ? 1 : 0), done);
  }
  function capWith(cap, done){
    if (busy) { if (done) done(); return; }
    if (cap === "none") { S.capL = S.capR = null; msg = ""; api.save(); refresh(); if (done) done(); return; }
    var s = st(), side = capSide(s, cap);
    if (!side) {
      var e = endsOf(s);
      msg = !e.L && !e.R ? "Both ends are already capped." : cap === "acoh" ? "Ethanoic acid’s single –COOH needs an –OH or –NH₂ end, and this chain has none free. Press <strong>Link</strong> once to put the partner monomer on the end." :
        cap === "tri" ? "The triol’s –OH links to a –COOH end. Press <strong>Link</strong> once so the chain ends in –COOH." : "Ethanol’s single –OH needs a –COOH end, and this chain has none free.";
      paint(); if (done) done(); return;
    }
    var stB = s;
    if (side === "R") S.capR = cap; else S.capL = cap;
    var stA = st(); api.save();
    animate(stB, stA, side === "R" ? stA.n + (stA.capL ? 1 : 0) : 1, done);
  }
  linkBtn.addEventListener("click", function(){ link(); });
  $(".cp-capb", host).addEventListener("click", function(e){ var b = e.target.closest("[data-cap]"); if (b) capWith(b.dataset.cap); });
  cin.addEventListener("change", function(){ S.cover = cin.checked; api.save(); paintRead(); });
  ent.addEventListener("input", function(){ S.entry = ent.value; api.save(); MV.changed(); });
  $(".cp-entry", host).addEventListener("submit", function(e){ e.preventDefault(); });
  if (window.ResizeObserver) new ResizeObserver(function(){ var w = cw(box, 0); if (!w || busy || Math.abs(w - lastW) < 24) return; drawStatic(); }).observe(box);

  // ---------- predictions ----------
  function setState(o){
    stg.cancel(); busy = false; reset();
    S.mode = o.mode; S.a = o.a; S.b = o.b; S.n = o.n; S.capL = S.capR = null; msg = "";
    modeRG.set(S.mode); aRG.set(S.a); bRG.set(S.b); lock(false);
    if (o.pend) pend = true; if (o.hide) hide = o.hide;
    api.save(); refresh();
  }
  var hooks = {
    start:function(p){
      if (p.id === "p1") setState({ mode:"build", a:"hexA", b:"hmda", n:2, pend:true });
      else if (p.id === "p2") setState({ mode:"build", a:"hexA", b:"hmda", n:10, hide:{ count:1 } });
      else if (p.id === "p3") setState({ mode:"cap", a:"hexA", b:"hmda", n:4 });
      else setState({ mode:"compare", a:"hexA", b:"hmda", n:8, hide:{ ledger:1 } });
    },
    run:function(p, done){
      if (p.id === "p1") { link(done); return; }
      if (p.id === "p3") { capWith("acoh", done); return; }
      busy = true; lock(true);
      var s = st(), m = massOf(s);
      if (p.id === "p2") {
        var base = staticScene();
        MV.tween({ dur:2400, ease:function(t){ return t; }, step:function(t){
          var k = Math.min(m.links, Math.floor(t * (m.links + 0.999))), sc = clone(base); sc.bk = Object.assign({}, sc.bk, bkInfo(k, false));
          var keys = Object.keys(sc.band); if (k > 0 && keys[k - 1]) sc.band[keys[k - 1]].fl = 1;
          svg.innerHTML = CS.svg(sc);
        }, done:function(){ hide = {}; busy = false; lock(false); drawStatic(); paint(); MV.wait(200, done); } });
        return;
      }
      hide = {}; ledgerVals = { k:0 }; paintLedger();
      MV.tween({ dur:1600, ease:function(t){ return t; }, step:function(t){ ledgerVals = { k:Math.round(t * m.links) }; paintLedger(); },
        done:function(){ ledgerVals = null; busy = false; lock(false); paint(); MV.wait(200, done); } });
    }
  };
  // ---------- challenges ----------
  function chal(id){
    var A = MON[S.a], Bm = A.single ? null : MON[S.b], v = parseOne(S.entry);
    if (id === "tc1") {
      if (A.k === "amino" || (Bm && Bm.k === "diamine")) return { ok:true };
      if (A.k === "sugar") return { ok:false, msg:"Glycosidic (C–O–C) links: a polysaccharide." };
      return { ok:false, msg:"That makes ester links: a polyester." };
    }
    if (id === "tc2") {
      if (S.a !== "terA" || S.b !== "eg") return { ok:false, msg:"PET is made from benzene-1,4-dicarboxylic acid and ethane-1,2-diol. Choose those two monomers." };
      if (S.capL || S.capR) return { ok:false, msg:"Remove the caps: the PET chain here has no ends added." };
      if (S.n !== 6) return { ok:false, msg:"Your chain has " + S.n + " molecules. Build exactly 6." };
      if (v == null) return { ok:false, msg:"Now enter the chain’s molar mass in the box under the controls." };
      if (Math.abs(v - 594) <= 1) return { ok:true };
      if (Math.abs(v - 576) < 0.5) return { ok:false, msg:"That subtracts 6 waters; 6 molecules make 5 links." };
      if (Math.abs(v - 684) < 0.5) return { ok:false, msg:"Water leaves at each link." };
      return { ok:false, msg:"Add up the six monomers, then subtract 18 for each link." };
    }
    if (id === "tc3") {
      if (S.a === "hexA" && S.b === "hmda" && !A.single) return { ok:true };
      if (v != null && Math.abs(v - 244) < 0.5) return { ok:false, msg:"A repeating unit contains <strong>two</strong> links’ worth of water loss." };
      if (A.k === "sugar") return { ok:false, msg:"Glycosidic (C–O–C) links, not amide links." };
      if (A.k === "amino") return { ok:false, msg:"Amide links, but glycine’s repeating unit is only " + ruOf(A, null).M + " g/mol." };
      if (S.a === "terA" && S.b === "hmda") return { ok:false, msg:"20 g/mol too heavy." };
      if (S.a === "hexA" && S.b === "ppd") return { ok:false, msg:"8 g/mol too light." };
      if (Bm.k === "diol") return { ok:false, msg:"Not amide links." };
      var d = ruOf(A, Bm).M - 226;
      return { ok:false, msg:"That repeating unit is " + ruOf(A, Bm).M + " g/mol: " + Math.abs(d) + " g/mol too " + (d > 0 ? "heavy." : "light.") };
    }
    return { ok:false };
  }
  refresh();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Breaking them down ----------
// Station 2 model data (plan §4 Part 3): % mass lost over 12 weeks. Plan values: PE 0 (all), PET 0 (all), PLA 2 (cold) and
// 90 (industrial), cellulose 70 (compost). Model values added here to fill the slider's other stops (labelled model):
// PLA 10 in warm compost; cellulose 15 in a cold lake and 95 in an industrial composter.
var BREAK = [
  { nm:"Polyethene", kind:"addition polymer", v:[0, 0, 0], note:"no ester or amide links: it doesn’t hydrolyse" },
  { nm:"PET", kind:"polyester", v:[0, 0, 0], note:"very slow: ester links, but its hydrolysis takes many years" },
  { nm:"PLA", kind:"polyester", v:[2, 10, 90] },
  { nm:"Cellulose", kind:"polysaccharide", v:[15, 70, 95] }];
var MECH = 0.85; // model: average chain length kept after each melt
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  S.br = Array.isArray(S.br) ? S.br.filter(function(j){ return j >= 1 && j <= 3; }) : [];
  if (!s1.conds.some(function(c){ return c.id === S.cond; })) S.cond = "water";
  S.env = clamp(S.env | 0, 0, 2); S.mech = clamp(S.mech | 0, 0, 5); S.chem = clamp(S.chem | 0, 0, 3);
  var busy = false, lastW = 0, barV = BREAK.map(function(b){ return b.v[S.env]; });
  host.innerHTML = '<div class="part cp-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="cp-cond"></div>' +
    '<div class="cp-hy"><div class="cp-box cp-hybox"><svg class="cp-svg cp-hysvg" role="img" aria-label=""></svg><div class="cp-hybtns"></div></div></div>' +
    '<p class="cp-hycap" aria-live="polite"></p><div class="q-actions"><button type="button" class="btn ghost sm" data-hy="reset" data-k="hyreset">Rebuild the chain</button></div><dl class="read cp-hyread" aria-live="polite"></dl>' +
    '<details class="alg cp-zoom"><summary>Zoom to the particles</summary><p>' + s1.zoom + '</p><div class="cp-zgrid"><figure class="cp-zf"><figcaption>1. Water’s O bonds to the C=O carbon (δ+)</figcaption><div class="cp-box"><svg class="cp-svg cp-z1" role="img" aria-label="An amide link: C double-bonded to O, single-bonded to N–H. The C is marked delta plus and its O delta minus. A water molecule sits above, with an arrow from its O to the C."></svg></div></figure>' +
    '<figure class="cp-zf"><figcaption>2. The C–N bond breaks: –OH on the C, –H on the N</figcaption><div class="cp-box"><svg class="cp-svg cp-z2" role="img" aria-label="After hydrolysis: the acid end now ends in C(=O)–O–H and the amine end in N–H with a second H: a –COOH group and an –NH₂ group."></svg></div></figure></div></details></div>' +
    '<div class="part cp-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="cp-envsl"></div><div class="cp-bars" role="img"></div><p class="tiny muted">' + s2.note + "</p>" +
    '<details class="alg"><summary>Check it with data</summary><div class="cp-btab"></div><p class="tiny muted">' + s2.note + "</p></details></div>" +
    '<div class="part cp-st"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><div class="cp-routes">' +
    '<div class="cp-route"><p>' + s3.mech + '</p><div class="cp-rv cp-rv1" aria-live="polite"></div><div class="q-actions"><button type="button" class="btn primary sm" data-rt="melt" data-k="rtmelt">Melt and remould</button><button type="button" class="btn ghost sm" data-rt="mreset" data-k="rtmreset">Start again</button></div></div>' +
    '<div class="cp-route"><p>' + s3.chem + '</p><div class="cp-rv cp-rv2" aria-live="polite"></div><div class="cp-rstep"></div></div></div>' +
    '<p class="cp-ask"><strong>' + s3.ask + '</strong></p><div class="chips cp-rchips" role="radiogroup" aria-label="' + esc(MV.plain(s3.ask)) + '"></div><div class="cp-rfb"></div><p class="cp-canada">' + s3.canada + "</p></div>";

  // station 1: hydrolysis on tappable links
  var NY = { A:MON.hexA, B:MON.hmda, n:4 }, box = $(".cp-hybox", host), hsvg = $(".cp-hysvg", host);
  var hst = CS.stage(hsvg, { W:function(){ return unitsW(cw(box)); }, top:-112 });
  var condRG = radios($(".cp-cond", host), { label:"Conditions", aria:"Conditions", options:s1.conds.map(function(c){ return { id:c.id, t:c.t }; }), value:S.cond, onChange:function(v){ S.cond = v; api.save(); paint1(); } });
  function brk(list){ var o = {}; list.forEach(function(j){ o[j] = 1; }); return o; }
  function scene(list){ return decorate(CS.lay(CS.entries(NY, { broken:brk(list) }), { W:unitsW(cw(box)) }), NY, { noBr:true }); }
  function cond(){ return s1.conds.filter(function(c){ return c.id === S.cond; })[0]; }
  function buttons(s){
    var vb = hst.vb(), out = "";
    [1, 2, 3].forEach(function(j){
      if (busy || S.br.indexOf(j) >= 0) return;
      var p = CS.linkPos(s, "m" + (j - 1), "m" + j); if (!p) return;
      var l = (p.x - vb[0]) / vb[2] * 100, t = (p.y - 84 - vb[1]) / vb[3] * 100;
      out += '<button type="button" class="cp-hyb" style="left:' + r1(l) + "%;top:" + r1(t) + '%" data-lk="' + j + '" data-k="hy' + j + '" aria-label="Add water at amide link ' + j + '"' + (busy ? " disabled" : "") + ">+ H₂O</button>";
    });
    MV.keepFocus($(".cp-hybtns", host), function(){ $(".cp-hybtns", host).innerHTML = out; });
  }
  function draw1(){ lastW = cw(box); var s = scene(S.br); hst.load([s]); hst.show(0); buttons(s); aria1(); }
  function aria1(){
    var left = 3 - S.br.length;
    hsvg.setAttribute("aria-label", "Nylon-6,6 chain of 4 monomer units with " + left + " amide link" + (left === 1 ? "" : "s") + " left; " + (S.br.length ? S.br.length + " link" + (S.br.length === 1 ? " has" : "s have") + " been hydrolysed into separate pieces." : "the chain is whole."));
  }
  function paint1(){
    var left = 3 - S.br.length, c = cond();
    $(".cp-hycap", host).innerHTML = left === 3 ? "Tap <strong>+ H₂O</strong> on any amide link." : left ? "Water was added across " + S.br.length + " link" + (S.br.length > 1 ? "s" : "") + ". Keep going." : "Every link is hydrolysed: the chain is back to its monomers.";
    $(".cp-hyread", host).innerHTML = MV.readoutHTML([["Amide links left", String(left)], ["Water molecules added", String(S.br.length)], ["Pieces", String(S.br.length + 1)],
      ["Products", left ? muted("add water at every link") : "2 hexanedioic acid + 2 hexane-1,6-diamine: the original monomers"], ["Rate (model)", c.rate + muted(". " + c.note)]]);
    $('[data-hy="reset"]', host).disabled = busy || !S.br.length;
  }
  function hydro(j){
    if (busy || S.br.indexOf(j) >= 0) return;
    busy = true; buttons(scene(S.br)); paint1();
    var cur = scene(S.br), nxt = S.br.concat([j]), split = scene(nxt), ents = CS.entries(NY, { broken:brk(nxt) }), ids = CS.wids(ents[j - 1], ents[j]);
    var p = CS.linkPos(cur, "m" + (j - 1), "m" + j), win = clone(cur);
    Object.keys(win.band).forEach(function(k){ if (k.indexOf("bd" + p.L.a + "|" + p.L.b) === 0) win.band[k].fl = 1; });
    CS.water(win, ids, p.x, p.y - 82, 1);
    var slow = S.cond === "water", d = slow ? 1700 : 800;
    hst.load([cur, win, split]);
    $(".cp-hycap", host).textContent = slow ? "A water molecule arrives at the link (in plain water this is very slow)…" : "A water molecule arrives at the link (" + (S.cond === "acid" ? "acid" : "base") + " speeds this up)…";
    hst.play(0, 2, function(i){ if (i === 2) $(".cp-hycap", host).textContent = "It splits: –OH to the C=O carbon, –H to the N. The link breaks."; }, function(){
      S.br = nxt; api.save(); busy = false; draw1(); paint1(); var f = $('.cp-hyb', host); if (f && document.activeElement === document.body) f.focus({ preventScroll:true });
    }, [d, d * 1.2]);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-lk]"); if (b) { hydro(+b.dataset.lk); return; }
    if (e.target.closest('[data-hy="reset"]') && !busy) { S.br = []; api.save(); draw1(); paint1(); }
  });
  // particle zoom: two still frames
  (function(){
    var Z = { A:MON.hexA, B:MON.hmda, n:2 }, w = 640;
    var a = decorate(CS.lay(CS.entries(Z, {}), { W:w }), Z, { noBr:true }), e = CS.entries(Z, { broken:{ 1:1 } }), ids = CS.wids(e[0], e[1]);
    var c = a.n["m0.c2"], o = a.n["m0.c2u"];
    CS.water(a, ids, c.x - 8, c.y + 84, 1);
    CS.tag(a, "dp", "δ+", c.x + 17, c.y + 24, { fs:15, col:"var(--dl-pos)" }); CS.tag(a, "dm", "δ−", o.x + 22, o.y, { fs:15, col:"var(--dl-neg)" });
    a.ln.atk = { x1:c.x - 8, y1:c.y + 70, x2:c.x - 2, y2:c.y + 15, op:1, arrow:1, col:"var(--ink)" };
    var b = decorate(CS.lay(e, { W:w }), Z, { noBr:true });
    var s1v = CS.stage($(".cp-z1", host), { W:function(){ return w; }, fit:1 }), s2v = CS.stage($(".cp-z2", host), { W:function(){ return w; }, fit:1 });
    s1v.load([a]); s1v.show(0); s2v.load([b]); s2v.show(0);
  })();

  // station 2: breakdown bars
  var envSl = MV.sliders($(".cp-envsl", host), [{ id:"cpenv", label:"Conditions", min:0, max:2, step:1, value:S.env, fmt:function(v){ return s2.conds[v]; } }], function(id, v){
    var from = barV.slice(); S.env = v; api.save();
    MV.tween({ dur:700, step:function(t){ barV = BREAK.map(function(b, i){ return lerp(from[i], b.v[v], t); }); paint2(); }, done:function(){ barV = BREAK.map(function(b){ return b.v[v]; }); paint2(); } });
    paintTab();
  });
  void envSl;
  function paint2(){
    var el = $(".cp-bars", host);
    el.innerHTML = BREAK.map(function(b, i){ var v = barV[i];
      return '<div class="cp-brow"><p class="cp-bl"><strong>' + b.nm + "</strong> <span class=\"tiny muted\">(" + b.kind + ")</span></p><div class=\"cp-btrack\"><span class=\"cp-bfill\" style=\"width:" + r1(v) + '%"></span><span class="cp-bval">' + Math.round(v) + "%</span></div>" + (b.note ? '<p class="tiny muted cp-bnote">' + b.note + "</p>" : "") + "</div>"; }).join("");
    el.setAttribute("aria-label", "Mass lost in 12 weeks (model), " + s2.conds[S.env] + ": " + BREAK.map(function(b){ return b.nm + " " + b.v[S.env] + "%"; }).join(", ") + ".");
  }
  function paintTab(){
    $(".cp-btab", host).innerHTML = MV.tableHTML({ head:["Polymer", "Cold lake water", "Warm moist compost", "Industrial composter (≈ 60 °C)"], hiCol:S.env + 1, caption:"Percent mass lost over 12 weeks (model)",
      rows:BREAK.map(function(b){ return [b.nm + " (" + b.kind + ")"].concat(b.v.map(function(v){ return v + "%"; })); }) }) + '<p class="tiny">Percent of the mass lost over 12 weeks. The highlighted column matches the slider.</p>';
  }

  // station 3: recycling routes
  var CHEM = ["Used PET bottles: long chains, with contaminants (dots) mixed in.", "Hydrolyse: water splits every ester link, giving benzene-1,4-dicarboxylic acid and ethane-1,2-diol.",
    "Purify: the small monomer molecules are separated from the contaminants.", "Repolymerize: condensation again, giving full-length PET chains, as good as new."];
  function routeSVG(chain, dots, mono){
    var s = "", W = 300;
    if (mono) { for (var i = 0; i < 16; i++) s += '<rect x="' + (12 + i * 17.5) + '" y="' + (i % 2 ? 30 : 22) + '" width="13" height="10" rx="4" fill="' + (i % 2 ? "var(--at-o)" : "var(--pen)") + '"/>'; }
    else { s += '<rect x="12" y="24" width="' + r1((W - 24) * chain) + '" height="12" rx="6" fill="var(--pen)"/>'; }
    for (var k = 0; k < dots; k++) s += '<circle cx="' + (20 + (k * 37) % 270) + '" cy="' + (56 + (k % 2) * 10) + '" r="4.5" fill="var(--ink-2)"/>';
    return '<svg class="cp-rsvg" viewBox="0 0 ' + W + ' 80" aria-hidden="true">' + s + "</svg>";
  }
  function paint3(){
    var c = Math.pow(MECH, S.mech), d = 2 + 2 * S.mech;
    $(".cp-rv1", host).innerHTML = routeSVG(c, d, false) + '<dl class="read">' + MV.readoutHTML([["Melts", String(S.mech)], ["Average chain length (model)", Math.round(c * 100) + "%"], ["Contaminants", S.mech ? "still mixed in, and building up" : "some, from use"]]) + "</dl>";
    $('[data-rt="melt"]', host).disabled = S.mech >= 5; $('[data-rt="mreset"]', host).disabled = !S.mech;
    var k = S.chem;
    $(".cp-rv2", host).innerHTML = routeSVG(1, k >= 2 ? 0 : 2, k === 1 || k === 2) + "<p class=\"tiny cp-rcap\">" + CHEM[k] + "</p>";
  }
  var chem0 = S.chem, cpl = (function(){ var hb = $(".cp-rstep", host), d = document.createElement("div"); hb.appendChild(d);
    return MV.player(d, { count:4, interval:1500, label:function(i){ return "Step " + (i + 1) + " of 4"; }, render:function(i){ S.chem = i; api.save(); paint3(); } }); })();
  if (chem0) cpl.go(chem0);
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-rt]"); if (!b || b.disabled) return;
    S.mech = b.dataset.rt === "melt" ? Math.min(5, S.mech + 1) : 0; api.save(); paint3();
    var f = $('[data-k="' + (S.mech >= 5 || !S.mech ? (S.mech ? "rtmreset" : "rtmelt") : b.dataset.k) + '"]', host); if (f && !f.disabled) f.focus({ preventScroll:true });
  });
  // route choice (practice only; not scored)
  var rch = $(".cp-rchips", host);
  function paintR(){
    var pick = S.rpick;
    MV.keepFocus(rch, function(){ rch.innerHTML = s3.choices.map(function(o, i){ var on = pick === i; return '<button type="button" class="chip' + (on ? " on" : "") + '" role="radio" aria-checked="' + on + '" data-rp="' + i + '" data-k="rp' + i + '">' + o.t + "</button>"; }).join(""); });
    if (pick == null) { $(".cp-rfb", host).innerHTML = ""; return; }
    var o = s3.choices[pick], good = MV.ok(o);
    $(".cp-rfb", host).innerHTML = MV.fbHTML(good ? "good" : "bad", (good ? "" : "<strong>✗ Not quite.</strong> ") + o.fb + (good ? "" : " Try another."));
  }
  rch.addEventListener("click", function(e){ var b = e.target.closest("[data-rp]"); if (!b) return; S.rpick = +b.dataset.rp; api.save(); paintR(); });
  if (window.ResizeObserver) new ResizeObserver(function(){ var w = cw(box, 0); if (!w || busy || Math.abs(w - lastW) < 24) return; draw1(); }).observe(box);
  draw1(); paint1(); paint2(); paintTab(); paint3(); paintR();
}

// ---------- Practice 2: Count, calculate, work back (number entry + choose-one + investigation) ----------
function calcAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", pick:null, picks:{}, tries:0, hint:0, solved:false, first:null }); }
  function chips(it, x){
    return '<div class="chips cp-pchips" role="radiogroup" aria-label="Choices">' + it.options.map(function(o, k){ var on = x.pick === k;
      return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
  }
  function ivRows(it, x){
    return it.rows.map(function(r){ var p = x.picks[r.id] || [];
      return '<div class="cp-ivrow"><p class="cp-ivl">' + r.label + '</p><div class="chips" role="' + (r.pick > 1 ? "group" : "radiogroup") + '" aria-label="' + esc(r.label) + '">' + r.opts.map(function(o, k){ var on = p.indexOf(k) >= 0;
        return '<button type="button" ' + (r.pick > 1 ? 'aria-pressed="' + on + '"' : 'role="radio" aria-checked="' + on + '"') + ' class="chip' + (on ? " on" : "") + '" data-iv="' + r.id + '" data-ivk="' + k + '" data-k="' + it.id + r.id + k + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div></div>"; }).join("");
  }
  function itemHTML(it, i){
    var x = ist(it.id), h = '<div class="q" data-ci="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "num") h += '<div class="numrow"><label for="cc-' + it.id + '">Your answer:</label><input class="numin" id="cc-' + it.id + '" data-nin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + esc(x.val) + '"' + (x.solved ? " disabled" : "") + ">" + (it.unit ? '<span class="m">' + it.unit + "</span>" : "") + "</div>";
    else if (it.kind === "mc") h += chips(it, x);
    else h += ivRows(it, x);
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct" + (it.display ? ": " + it.display : it.kind === "mc" ? ": " + it.options[x.pick].t : "") + ".</strong> " + (it.kind === "mc" ? it.options[x.pick].why : it.why) + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id] + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + MV.usesHTML(a.use) + a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function judge(it, x){
    if (it.kind === "num") {
      var v = parseOne(x.val); if (v == null) return { bad:"Enter a number, such as 12 or 3/4." };
      var ans = MV.ans(it), tol = it.unit ? 1 : 0.01;
      if (Math.abs(v - ans) <= tol) return { ok:true };
      var w = (it.wrong || []).filter(function(w){ return Math.abs(v - w.match) < 0.01; })[0];
      return { ok:false, fb:w ? w.fb : it.general || "Check your working." };
    }
    if (it.kind === "mc") { if (x.pick == null) return { bad:"Choose an answer first." }; return MV.ok(it.options[x.pick]) ? { ok:true } : { ok:false, fb:it.options[x.pick].why }; }
    var bad = [];
    for (var r = 0; r < it.rows.length; r++) {
      var row = it.rows[r], p = x.picks[row.id] || [];
      if (p.length !== row.pick) return { bad:row.pick > 1 ? "Choose " + row.pick + " controlled variables." : "Choose one option in each row." };
      if (!p.every(function(k){ return MV.ok(row.opts[k]); })) bad.push(row.id);
    }
    if (!bad.length) return { ok:true };
    var T = { iv:"The independent variable is the one thing you change on purpose.", dv:"The dependent variable is what you measure in every trial.", cv:"Controlled variables are kept the same in every trial." };
    return { ok:false, fb:bad.map(function(k){ return T[k]; }).join(" ") + " " + it.why };
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.nin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){
    if (e.key === "Enter" && e.target.dataset && e.target.dataset.nin) { var c = host.querySelector('[data-k="' + e.target.dataset.nin + 'chk"]'); if (c) c.click(); return; }
    var b = e.target.closest('[role="radio"]'); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var all = $$('[role="radio"]', b.parentNode), i = all.indexOf(b), n = all[(i + d + all.length) % all.length]; n.focus(); n.click();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ci]"); if (!box) return;
    var it = item(box.dataset.ci), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.op != null) { x.pick = +b.dataset.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.iv) {
      var row = it.rows.filter(function(r){ return r.id === b.dataset.iv; })[0], k = +b.dataset.ivk, p = (x.picks[row.id] || []).slice();
      if (row.pick === 1) p = [k]; else if (p.indexOf(k) >= 0) p.splice(p.indexOf(k), 1); else { p.push(k); if (p.length > row.pick) p.shift(); }
      x.picks[row.id] = p; msgs[it.id] = null; api.save(); paint(); return;
    }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = r.bad; paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = r.fb; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ci="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Design a fibre ----------
var TA = ["butA", "hexA", "terA"], TB = ["eg", "bd", "hmda", "ppd", "etoh", "tri"];
function ruMass(a, b){ return MON[a].M + MON[b].M - 2 * WATER; }
var task = (function(){
  var S = null, api = null, stg = null, lastW = 0;
  function read(){ return S ? { a:S.a || "", b:S.b || "" } : { a:"", b:"" }; }
  function scene(d){
    var A = MON[d.a], Bm = MON[d.b], w = unitsW(cw($("#cp-tkbox"), 360)), s, st;
    if (Bm.k === "ol1") { st = { A:A, B:null, n:1, capL:Bm, capR:Bm }; s = decorate(CS.lay(CS.entries(st, {}), { W:w }), st, { noBr:true }); }
    else {
      st = { A:A, B:Bm, n:2 };
      var e = CS.entries(st, {}); e[0].Lf = false; e[1].Rf = Bm.k === "triol";
      s = CS.lay(e, { W:w, stubs:Bm.k !== "triol" ? true : "L" }); CS.bands(s);
      if (Bm.k !== "triol") CS.bracket(s, s.mol.m0.fm, s.mol.m1.lm);
      else CS.tag(s, "net", "network", (s.n["m1.x1"].x + s.n["m1.x2"].x) / 2, -CS.UPD - 26, { fs:14, col:"var(--ink-2)" });
    }
    return s;
  }
  function paint(){
    var d = read(), bx = $("#cp-tkbox"), rd = $("#cp-tkread");
    if (!d.a || !d.b) { bx.hidden = true; rd.innerHTML = MV.readoutHTML([["Repeating unit", muted("choose a diacid and a partner")]]); return; }
    bx.hidden = false; lastW = cw(bx, 360);
    var A = MON[d.a], Bm = MON[d.b], ru = ruMass(d.a, d.b), s = scene(d);
    stg.load([s]); stg.show(0);
    var chains = Bm.g === 2 ? "long linear chains" : Bm.g === 1 ? "none: ethanol caps the ends, so no chain grows" : "a cross-linked network (three –OH groups)";
    $("#cp-tksvg").setAttribute("aria-label", Bm.g === 1 ? "Ethanol on both ends of " + A.nm + ": a small capped molecule, not a chain." : "Repeating unit from " + A.nm + " and " + Bm.nm + ", with " + (Bm.k === "diamine" ? "amide" : "ester") + " links" + (Bm.k === "triol" ? " and a branch to another chain." : "."));
    rd.innerHTML = MV.readoutHTML([["Repeating-unit mass", A.M + " + " + Bm.M + " " + MINUS + " 2 × " + WATER + " = <strong>" + ru + " g/mol</strong>"], ["Link", Bm.k === "diamine" ? "amide, –CO–NH–" : "ester, –COO–"],
      ["Chains", chains], ["Benzene ring", A.ring || Bm.ring ? "yes (C₆H₄)" : "no"]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S;
      inp.innerHTML = '<div class="cp-tk"><div class="cp-tka"></div><div class="cp-tkb"></div></div>';
      pv.innerHTML = '<h4 class="cp-h4">Your fibre’s repeating unit</h4><div class="cp-box" id="cp-tkbox"><svg class="cp-svg" id="cp-tksvg" role="img" aria-label=""></svg></div><dl class="read" id="cp-tkread" aria-live="polite"></dl>';
      stg = CS.stage($("#cp-tksvg"), { W:function(){ return unitsW(cw($("#cp-tkbox"), 360)); }, fit:1, maxScale:1.1 });
      function rg(sel, key, label, ids){ radios($(sel, inp), { label:label, aria:label, cls:"chips", options:ids.map(function(id){ return { id:id, t:MON[id].nm + " " + MON[id].M }; }), value:S[key] || "", onChange:function(v){ S[key] = v; api.save(); paint(); api.update(); } }); }
      rg(".cp-tka", "a", "Diacid", TA); rg(".cp-tkb", "b", "Partner monomer", TB);
      if (window.ResizeObserver) new ResizeObserver(function(){ var w = cw($("#cp-tkbox"), 0); if (w && Math.abs(w - lastW) > 24) paint(); }).observe(pv);
      paint();
    },
    read:read,
    valid:function(d){ return d.a && d.b ? true : "Choose a diacid and a partner monomer first."; },
    checks:function(d){
      if (!d.a || !d.b) return [false, false, false, false];
      var A = MON[d.a], Bm = MON[d.b], ru = ruMass(d.a, d.b);
      return [Bm.g === 2, Bm.k === "diamine", ru >= 200 && ru <= 250, !!(A.ring || Bm.ring)];
    },
    key:function(d){ return d.a + "|" + d.b; },
    label:function(k){ var p = k.split("|"); return MON[p[0]].nm + " + " + MON[p[1]].nm + " (" + ruMass(p[0], p[1]) + " g/mol)"; },
    text:function(k){ var p = k.split("|"); return MON[p[0]].nm + " + " + MON[p[1]].nm + " (" + ruMass(p[0], p[1]) + " g/mol)"; }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ calc:calcAct },
  task:task
});
})();
