// MDM4U 09 Permutations with Restrictions: hero (six people; Ana and Bo glue into a block and swap; a split bar shows
// 240 together | 480 apart), Rule-bound line-up (Explore: D3 counting slots + D4 arrangement tiles; People and Digit modes,
// rule chips, strategy panel, Gap builder, List mode), Strategy chooser (Part 3: strategy cards, templates with blanks,
// check by listing), Seating planner task. Every count is found by listing all arrangements, so it is always exact.
(function(){
"use strict";
var $ = MV.$;
function big(v){ return MV.mdm.fmt(v).replace(/ /g, " "); }
function fact(n){ return n < 0 ? 0 : MV.mdm.fact(n); }
function nPr(n, r){ if (n < 0 || r < 0) return 0; var v = MV.mdm.nPr(n, r); return typeof v === "bigint" ? Number(v) : v; }
function M(s){ return MV.m(s); }
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }
function pos(x){ return Math.max(0, x); }

// @component radioGroup (copied from MDM4U 07 / 02) — segmented control or chip row as a real radio group
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id)}) -> {set, get, lock, refresh}
function radios(host, o){
  var val = String(o.value), locked = false;
  function off(id){ return locked || !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = off(val) ? ids.filter(function(id){ return !off(id); })[0] : val;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + id + '"' + (off(id) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (off(id)) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(b.dataset.rg);
    for (var k = 0; k < ids.length; k++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); var nb = host.querySelector('[data-rg="' + ids[i] + '"]'); if (nb) nb.focus(); return; } }
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, refresh:paint };
}

// @component D3 countingSlots — restriction version (adapted from MDM4U 07): rows of counting slots, one per stage (a seat,
// a digit position, a block's inside order, a gap). Each slot shows its badge, the count (or "?" while a reveal is pending)
// and a word ("choices", "orders", "gaps"); restricted stages get a lock outline and a "filled first" note. A row can carry
// a label (one row per case for the Cases strategy) and shows its product.
// D3.html(rows, o) -> html.  rows: [{lab, slots:[{b, n, w, lk, note}]}]   o: {shown: number of slots revealed (null = all)}
var D3 = {
  html:function(rows, o){
    o = o || {};
    var seen = 0;
    return rows.map(function(row){
      var prod = row.slots.reduce(function(a, s){ return a * s.n; }, 1), allShown = true;
      var h = '<div class="pr-srow">' + (row.lab ? '<p class="pr-slab">' + row.lab + "</p>" : "") + '<div class="pr-slots">';
      h += row.slots.map(function(s){
        var show = o.shown == null || seen < o.shown; seen++; if (!show) allShown = false;
        var cnt = show ? big(s.n) : "?", w = s.w || (s.n === 1 ? "choice" : "choices");
        return '<div class="pr-slot' + (s.lk ? " lk" : "") + (o.hi === seen - 1 ? " hi" : "") + '" role="group" aria-label="' + MV.esc(MV.plain(s.b) + ": " + (show ? s.n + " " + w : "count hidden") + (s.note ? ", " + s.note : "")) + '">' +
          '<span class="pr-badge">' + s.b + '</span><span class="pr-n" aria-hidden="true">' + cnt + '</span><span class="pr-cw" aria-hidden="true">' + (s.note || w) + "</span></div>";
      }).join("");
      return h + '</div><p class="pr-sprod" aria-hidden="true">' + (allShown && row.slots.length > 1 ? row.slots.map(function(s){ return big(s.n); }).join(" × ") + " = " + big(prod) : "") + "</p></div>";
    }).join("");
  }
};

// @component D4 arrangementTiles — restriction version (adapted from MDM4U 06 / 07): a line-up of person or digit tiles in
// numbered seats. Tiles are kept between paints and slide to their new seats (CSS transition on a --x seat index; reduced
// motion jumps); an optional rounded block outline wraps two neighbouring seats (--ink outline, --hi-soft fill). perms(n, r)
// lists every arrangement of r of n objects in dictionary order; listHTML() shows a list of arrangements and ticks the ones
// that satisfy the rules.
//   D4.row(host, {labels:[tile text per object], arr:[object per seat], block:seat | null, mark:{object:true}, cls})
//   D4.perms(n, r) -> [[object per seat]…]     D4.listHTML(items:[{t, on}], o:{label})
var D4 = {
  row:function(host, o){
    var n = o.arr.length, sig = n + "|" + o.labels.join(",") + "|" + (o.cls || ""), seatOf = {};
    o.arr.forEach(function(obj, s){ seatOf[obj] = s; });
    if (host.dataset.sig !== sig) {   // new tiles start in their seats (no slide from nowhere)
      host.dataset.sig = sig;
      var h = '<div class="pr-row ' + (o.cls || "") + '" style="--n:' + n + '" aria-hidden="true">';
      for (var s = 0; s < n; s++) h += '<span class="pr-seat" style="--x:' + s + '"><i>' + (s + 1) + "</i></span>";
      h += '<span class="pr-blk" style="--x:' + (o.block != null ? o.block : 0) + '"></span>';
      for (var i = 0; i < o.labels.length; i++) h += '<span class="pr-tok" data-o="' + i + '" style="--x:' + (seatOf[i] != null ? seatOf[i] : i) + '">' + o.labels[i] + "</span>";
      host.innerHTML = h + "</div>";
    }
    MV.$$(".pr-tok", host).forEach(function(t){
      var i = +t.dataset.o, s = seatOf[i];
      t.hidden = s == null;
      if (s != null) t.style.setProperty("--x", s);
      t.classList.toggle("mk", !!(o.mark && o.mark[i]));
    });
    var b = $(".pr-blk", host);
    b.classList.toggle("on", o.block != null);
    if (o.block != null) b.style.setProperty("--x", o.block);
  },
  perms:function(n, r){
    var out = [];
    (function rec(cur, used){
      if (cur.length === r) { out.push(cur.slice()); return; }
      for (var i = 0; i < n; i++) if (!used[i]) { used[i] = 1; cur.push(i); rec(cur, used); cur.pop(); used[i] = 0; }
    })([], {});
    return out;
  },
  listHTML:function(items, o){
    o = o || {};
    var on = items.filter(function(x){ return x.on; }).length;
    return '<div class="pr-list" role="group" aria-label="' + MV.esc((o.label || "Arrangements") + ": " + items.length + " listed, " + on + " ticked") + '"><ul class="pr-lgrid">' + items.map(function(x){
      return '<li class="pr-li' + (x.on ? " on" : "") + '"><span class="pr-lt" aria-hidden="true">' + (x.on ? "✓" : "") + "</span>" + x.t + '<span class="vh">' + (x.on ? " (fits)" : " (doesn’t fit)") + "</span></li>";
    }).join("") + "</ul></div>";
  }
};

// ---------- the model: people and digit rules; counts by listing every arrangement ----------
var NAMES = ["Ana", "Bo", "Cy", "Di", "Ed", "Fay", "Gus", "Hal"];
var PRULES = [
  { id:"first", t:"Ana is first" }, { id:"end", t:"Ana is at an end" }, { id:"tog", t:"Ana and Bo together" },
  { id:"apart", t:"Ana and Bo apart" }, { id:"all", t:"Ana, Bo and Cy all apart" }, { id:"before", t:"Ana before Bo (anywhere earlier)" }];
var DRULES = [{ id:"lead", t:"No leading zero" }, { id:"even", t:"Even" }, { id:"odd", t:"Odd" }, { id:"g5", t:"Greater than 5000" }];
function adj(a, b){ return Math.abs(a - b) === 1; }
// q[i] = seat of person i
var PF = {
  first:function(q){ return q[0] === 0; },
  end:function(q, n){ return q[0] === 0 || q[0] === n - 1; },
  tog:function(q){ return adj(q[0], q[1]); },
  apart:function(q){ return !adj(q[0], q[1]); },
  all:function(q){ return !adj(q[0], q[1]) && !adj(q[0], q[2]) && !adj(q[1], q[2]); },
  before:function(q){ return q[0] < q[1]; }
};
var DF = {
  lead:function(s){ return s[0] !== 0; },
  even:function(s){ return s[s.length - 1] % 2 === 0; },
  odd:function(s){ return s[s.length - 1] % 2 === 1; },
  g5:function(s){ return s.length === 4 && +s.join("") > 5000; }
};
var PERMS = {}, CNT = {};
function permsOf(n){ return PERMS[n] || (PERMS[n] = D4.perms(n, n)); }
function peopleSat(n, R){
  var key = "p" + n + "|" + R.slice().sort().join("+");
  if (CNT[key]) return CNT[key];
  var P = permsOf(n), idx = [], q = [], k, s, j, ok;
  for (k = 0; k < P.length; k++) {
    for (s = 0; s < n; s++) q[P[k][s]] = s;
    for (ok = true, j = 0; j < R.length && ok; j++) ok = PF[R[j]](q, n);
    if (ok) idx.push(k);
  }
  return (CNT[key] = { list:P, idx:idx, total:P.length });
}
function digitSat(D, r, R){
  var key = "d" + D.join("") + "|" + r + "|" + R.slice().sort().join("+");
  if (CNT[key]) return CNT[key];
  var P = D.length >= r ? D4.perms(D.length, r).map(function(p){ return p.map(function(i){ return D[i]; }); }) : [], idx = [];
  P.forEach(function(s, k){ if (R.every(function(id){ return DF[id](s); })) idx.push(k); });
  return (CNT[key] = { list:P, idx:idx, total:P.length });
}

// Strategy for the rules: {method, f (formula with the numbers in, math source), val, note, rows (D3 slot rows)}
function countdown(from, count, badge){ var o = []; for (var i = 0; i < count; i++) o.push({ b:typeof badge === "function" ? badge(i) : badge, n:pos(from - i) }); return o; }
function pStrat(n, R){
  var has = function(id){ return R.indexOf(id) >= 0; }, key = R.slice().sort().join("+");
  var N = fact(n), A1 = fact(n - 1), A2 = fact(n - 2), A3 = fact(n - 3), G = nPr(n - 2, 3), H = nPr(n - 3, 2);
  var f1 = (n - 1) + "!", f2 = (n - 2) + "!", f3 = (n - 3) + "!";
  var seat = function(i){ return "Seat " + (i + 1); }, next = "Next";
  var ana1 = { b:"Seat 1", n:1, lk:true, note:"Ana" };
  var gapRows = function(pre, gaps){ return [{ slots:pre.concat([{ b:"The others", n:A3, w:"orders", note:f3 + " orders" }, { b:"Ana’s gap", n:pos(gaps), w:"gaps", lk:true }, { b:"Bo’s gap", n:pos(gaps - 1), w:"gaps", lk:true }, { b:"Cy’s gap", n:pos(gaps - 2), w:"gaps", lk:true }]) }]; };
  var gapRows2 = function(pre, gaps){ return [{ slots:pre.concat([{ b:"The others", n:A3, w:"orders", note:f3 + " orders" }, { b:"Bo’s gap", n:pos(gaps), w:"gaps", lk:true }, { b:"Cy’s gap", n:pos(gaps - 1), w:"gaps", lk:true }]) }]; };
  var S = {
    "":{ method:"No rule", f:n + "! = " + big(N), val:N, note:"No rules yet: every line-up counts.", rows:[{ slots:countdown(n, n, seat) }] },
    first:{ method:"Restriction first", f:"1 × " + f1 + " = " + big(A1), val:A1, note:"Ana’s seat is decided. The other " + (n - 1) + " fill the other seats: " + M(f1) + " ways.", rows:[{ slots:[ana1].concat(countdown(n - 1, n - 1, function(i){ return seat(i + 1); })) }] },
    end:{ method:"Restriction first", f:"2 × " + f1 + " = 2 × " + big(A1) + " = " + big(2 * A1), val:2 * A1, note:"Fill Ana’s seat first: one of the 2 ends. Then the other " + (n - 1) + " fill the rest.", rows:[{ slots:[{ b:"Ana’s seat", n:2, lk:true, note:"an end" }].concat(countdown(n - 1, n - 1, next)) }] },
    tog:{ method:"Block", f:f1 + " × 2! = " + big(A1) + " × 2 = " + big(2 * A1), val:2 * A1, note:"Glue Ana and Bo into one block: " + (n - 1) + " items, " + M(f1) + " orders. Then multiply by " + M("2!") + " for the order inside the block.", rows:[{ slots:countdown(n - 1, n - 1, function(i){ return "Item " + (i + 1); }).concat([{ b:"Inside block", n:2, w:"orders", lk:true, note:"AnaBo or BoAna" }]) }] },
    apart:{ method:"Subtract", f:n + "! − " + f1 + " × 2! = " + big(N) + " − " + big(2 * A1) + " = " + big(N - 2 * A1), val:N - 2 * A1, note:"Apart = total − together, and ‘together’ includes the order inside the block.", rows:[] },
    all:{ method:"Gaps", f:f3 + " × " + "P(" + (n - 2) + ", 3) = " + big(A3) + " × " + big(G) + " = " + big(A3 * G), val:A3 * G, note:"Seat the other " + (n - 3) + " first (" + M(f3) + " ways). That leaves " + (n - 2) + " gaps, and Ana, Bo and Cy each need their own gap: " + M("P(" + (n - 2) + ", 3)") + ".", rows:gapRows([], n - 2) },
    before:{ method:"Symmetry", f:n + "! ÷ 2 = " + big(N) + " ÷ 2 = " + big(N / 2), val:N / 2, note:"Swap Ana and Bo in any line-up and you get one where Bo is first. So exactly half have Ana before Bo.", rows:[] },
    "end+first":{ method:"Restriction first", f:"1 × " + f1 + " = " + big(A1), val:A1, note:"Ana first is already at an end, so only ‘Ana is first’ matters: 1 × " + M(f1) + ".", rows:[{ slots:[ana1].concat(countdown(n - 1, n - 1, function(i){ return seat(i + 1); })) }] },
    "first+tog":{ method:"Restriction first", f:"1 × 1 × " + f2 + " = " + big(A2), val:A2, note:"Ana takes seat 1, so Bo must take seat 2 to stand beside her. The other " + (n - 2) + " fill the rest: " + M(f2) + ".", rows:[{ slots:[ana1, { b:"Seat 2", n:1, lk:true, note:"Bo" }].concat(countdown(n - 2, n - 2, function(i){ return seat(i + 2); })) }] },
    "apart+first":{ method:"Restriction first", f:"1 × " + (n - 2) + " × " + f2 + " = " + big((n - 2) * A2), val:(n - 2) * A2, note:"Ana takes seat 1. Bo can’t take seat 2, so Bo has " + (n - 2) + " seats. The other " + (n - 2) + " fill the rest: " + M(f2) + ".", rows:[{ slots:[ana1, { b:"Bo’s seat", n:n - 2, lk:true, note:"not seat 2" }].concat(countdown(n - 2, n - 2, next)) }] },
    "all+first":{ method:"Gaps", f:f3 + " × P(" + (n - 3) + ", 2) = " + big(A3) + " × " + big(H) + " = " + big(A3 * H), val:A3 * H, note:"Ana takes seat 1. Seat the other " + (n - 3) + " after her; Bo and Cy go in different gaps, but not the gap next to Ana: " + (n - 3) + " gaps.", rows:gapRows2([ana1], n - 3) },
    "before+first":{ method:"Restriction first", f:"1 × " + f1 + " = " + big(A1), val:A1, note:"Ana first is always before Bo, so only ‘Ana is first’ matters.", rows:[{ slots:[ana1].concat(countdown(n - 1, n - 1, function(i){ return seat(i + 1); })) }] },
    "end+tog":{ method:"Restriction first", f:"2 × 1 × " + f2 + " = " + big(2 * A2), val:2 * A2, note:"Ana takes an end seat (2 ways) and Bo takes the seat beside her. The other " + (n - 2) + " fill the rest.", rows:[{ slots:[{ b:"Ana’s seat", n:2, lk:true, note:"an end" }, { b:"Bo’s seat", n:1, lk:true, note:"beside Ana" }].concat(countdown(n - 2, n - 2, next)) }] },
    "apart+end":{ method:"Restriction first", f:"2 × " + (n - 2) + " × " + f2 + " = " + big(2 * (n - 2) * A2), val:2 * (n - 2) * A2, note:"Ana: 2 end seats. Bo: not beside her, so " + (n - 2) + " seats. The others: " + M(f2) + ".", rows:[{ slots:[{ b:"Ana’s seat", n:2, lk:true, note:"an end" }, { b:"Bo’s seat", n:n - 2, lk:true, note:"not beside Ana" }].concat(countdown(n - 2, n - 2, next)) }] },
    "all+end":{ method:"Gaps", f:"2 × " + f3 + " × P(" + (n - 3) + ", 2) = 2 × " + big(A3) + " × " + big(H) + " = " + big(2 * A3 * H), val:2 * A3 * H, note:"Ana at either end (2 ways). Seat the other " + (n - 3) + " beside her; Bo and Cy take different gaps, not the one next to Ana.", rows:gapRows2([{ b:"Ana’s seat", n:2, lk:true, note:"an end" }], n - 3) },
    "before+end":{ method:"Cases", f:f1 + " + 0 = " + big(A1), val:A1, note:"Ana at the left end: " + M(f1) + " line-ups, all with Ana before Bo. At the right end, Ana can’t be before Bo: 0.", rows:[{ lab:"Ana at the left end", slots:[{ b:"Seat 1", n:1, lk:true, note:"Ana" }].concat(countdown(n - 1, n - 1, next)) }] },
    "apart+tog":{ method:"Contradiction", f:"0", val:0, note:"These two rules contradict each other: no line-up satisfies both.", rows:[] },
    "all+tog":{ method:"Contradiction", f:"0", val:0, note:"These two rules contradict each other: no line-up satisfies both.", rows:[] },
    "before+tog":{ method:"Block", f:f1 + " × 1 = " + big(A1), val:A1, note:"Glue Ana and Bo into a block. Inside it, Ana must come first, so there’s only 1 order.", rows:[{ slots:countdown(n - 1, n - 1, function(i){ return "Item " + (i + 1); }).concat([{ b:"Inside block", n:1, w:"order", lk:true, note:"Ana, then Bo" }]) }] },
    "all+apart":{ method:"Gaps", f:f3 + " × P(" + (n - 2) + ", 3) = " + big(A3) + " × " + big(G) + " = " + big(A3 * G), val:A3 * G, note:"‘All apart’ already keeps Ana and Bo apart. Seat the other " + (n - 3) + ", then give Ana, Bo and Cy their own gaps.", rows:gapRows([], n - 2) },
    "apart+before":{ method:"Subtract", f:"(" + n + "! − " + f1 + " × 2!) ÷ 2 = (" + big(N) + " − " + big(2 * A1) + ") ÷ 2 = " + big((N - 2 * A1) / 2), val:(N - 2 * A1) / 2, note:"Apart = total − together. Then, by symmetry, exactly half have Ana before Bo.", rows:[] },
    "all+before":{ method:"Gaps", f:f3 + " × P(" + (n - 2) + ", 3) ÷ 2 = " + big(A3 * G) + " ÷ 2 = " + big(A3 * G / 2), val:A3 * G / 2, note:"Count ‘all apart’ with gaps, then halve it: by symmetry, half have Ana before Bo.", rows:[] }
  };
  return S[key] || null;
}
function dStrat(D, r, R){
  var has = function(id){ return R.indexOf(id) >= 0; }, k = D.length, z = D.indexOf(0) >= 0;
  var e = D.filter(function(d){ return d % 2 === 0; }).length, o = k - e;
  var g = D.filter(function(d){ return d >= 5; }).length, ge = D.filter(function(d){ return d === 6 || d === 8; }).length, go = g - ge;
  var dig = function(i){ return "Digit " + (i + 1); }, P = function(a, b){ return "P(" + a + ", " + b + ")"; };
  if (k < r) return { method:"Not enough digits", f:"0", val:0, note:"A " + r + "-digit string with no repeats needs at least " + r + " different digits.", rows:[] };
  var tot = nPr(k, r), key = R.slice().sort().join("+");
  function lastFirst(cnt, word){   // last digit restricted, filled first
    var v = cnt * nPr(k - 1, r - 1);
    return { method:"Restriction first", f:cnt + " × " + P(k - 1, r - 1) + " = " + cnt + " × " + big(nPr(k - 1, r - 1)) + " = " + big(v), val:v,
      note:"Fill the last digit first: it must be " + word + " (" + cnt + " choice" + (cnt === 1 ? "" : "s") + "). Then fill the other " + (r - 1) + " from the " + (k - 1) + " digits left.",
      rows:[{ slots:countdown(k - 1, r - 1, dig).concat([{ b:dig(r - 1), n:cnt, lk:true, note:word }]) }] };
  }
  function g5only(note){
    var v = g * nPr(k - 1, 3);
    return { method:"Restriction first", f:g + " × " + P(k - 1, 3) + " = " + g + " × " + big(nPr(k - 1, 3)) + " = " + big(v), val:v,
      note:(note || "") + "Fill the first digit first: it must be 5 or more (" + g + " choice" + (g === 1 ? "" : "s") + " here). Then fill the other 3.",
      rows:[{ slots:[{ b:dig(0), n:g, lk:true, note:"5 or more" }].concat(countdown(k - 1, 3, function(i){ return dig(i + 1); })) }] };
  }
  function g5parity(word, sameOdd){   // greater than 5000 and even/odd: cases by the first digit
    var lastE = word === "even" ? e : o, mid = nPr(k - 2, 2);
    // first digit odd (5, 7, 9): if the last digit must be odd, one odd digit is used up
    var cA = go * pos(sameOdd ? lastE - 1 : lastE) * mid, cB = ge * pos(sameOdd ? lastE : lastE - 1) * mid;
    var lA = sameOdd ? pos(lastE - 1) : lastE, lB = sameOdd ? lastE : pos(lastE - 1);
    return { method:"Cases", f:go + " × " + lA + " × " + P(k - 2, 2) + " + " + ge + " × " + lB + " × " + P(k - 2, 2) + " = " + big(cA) + " + " + big(cB) + " = " + big(cA + cB), val:cA + cB,
      note:"The first digit (5 or more) and the last digit (" + word + ") can use the same kind of digit, so split into cases by the first digit.",
      rows:[{ lab:"First digit 5, 7 or 9", slots:[{ b:dig(0), n:go, lk:true, note:"5, 7 or 9" }, { b:dig(1), n:pos(k - 2) }, { b:dig(2), n:pos(k - 3) }, { b:dig(3), n:lA, lk:true, note:word }] },
            { lab:"First digit 6 or 8", slots:[{ b:dig(0), n:ge, lk:true, note:"6 or 8" }, { b:dig(1), n:pos(k - 2) }, { b:dig(2), n:pos(k - 3) }, { b:dig(3), n:lB, lk:true, note:word }] }] };
  }
  if (key === "") return { method:"No rule", f:P(k, r) + " = " + big(tot), val:tot, note:"No rules yet: every string of " + r + " different digits counts, even one that starts with 0.", rows:[{ slots:countdown(k, r, dig) }] };
  if (key === "lead") {
    if (!z) return { method:"Restriction first", f:P(k, r) + " = " + big(tot), val:tot, note:"None of the digits is 0, so no string starts with 0: the rule changes nothing.", rows:[{ slots:countdown(k, r, dig) }] };
    var vl = (k - 1) * nPr(k - 1, r - 1);
    return { method:"Restriction first", f:(k - 1) + " × " + P(k - 1, r - 1) + " = " + (k - 1) + " × " + big(nPr(k - 1, r - 1)) + " = " + big(vl), val:vl,
      note:"Fill the first digit first: anything but 0 (" + (k - 1) + " choices). After that, 0 is allowed.", rows:[{ slots:[{ b:dig(0), n:k - 1, lk:true, note:"not 0" }].concat(countdown(k - 1, r - 1, function(i){ return dig(i + 1); })) }] };
  }
  if (key === "even") return lastFirst(e, "even");
  if (key === "odd") return lastFirst(o, "odd");
  if (key === "g5") return g5only("");
  if (key === "even+odd") return { method:"Contradiction", f:"0", val:0, note:"A number can’t be even and odd: no string satisfies both.", rows:[] };
  if (key === "g5+lead") return g5only("‘Greater than 5000’ already rules out a leading 0. ");
  if (key === "even+lead") {
    if (!z) { var lf = lastFirst(e, "even"); lf.note = "None of the digits is 0, so ‘no leading zero’ changes nothing. " + lf.note; return lf; }
    var c1 = nPr(k - 1, r - 1), c2 = pos(e - 1) * (k - 2) * nPr(k - 2, r - 2);
    return { method:"Cases", f:P(k - 1, r - 1) + " + " + pos(e - 1) + " × " + (k - 2) + " × " + P(k - 2, r - 2) + " = " + big(c1) + " + " + big(c2) + " = " + big(c1 + c2), val:c1 + c2,
      note:"Ending in 0 frees up the first digit; ending in another even digit doesn’t (0 can’t lead). Count each case, then add.",
      rows:[{ lab:"Ends in 0", slots:[{ b:dig(0), n:k - 1, lk:true, note:"not 0" }].concat(countdown(k - 2, r - 2, function(i){ return dig(i + 1); })).concat([{ b:dig(r - 1), n:1, lk:true, note:"0" }]) },
            { lab:"Ends in another even digit", slots:[{ b:dig(0), n:k - 2, lk:true, note:"not 0, not last" }].concat(countdown(k - 2, r - 2, function(i){ return dig(i + 1); })).concat([{ b:dig(r - 1), n:pos(e - 1), lk:true, note:"even, not 0" }]) }] };
  }
  if (key === "lead+odd") {
    if (!z) { var lo = lastFirst(o, "odd"); lo.note = "None of the digits is 0, so ‘no leading zero’ changes nothing. " + lo.note; return lo; }
    var vo = o * (k - 2) * nPr(k - 2, r - 2);
    return { method:"Restriction first", f:o + " × " + (k - 2) + " × " + P(k - 2, r - 2) + " = " + big(vo), val:vo,
      note:"Fill the restricted digits first: the last (odd, " + o + " choices), then the first (not 0 and not the last digit, " + (k - 2) + " choices). Then the middle.",
      rows:[{ slots:[{ b:dig(0), n:k - 2, lk:true, note:"not 0, not last" }].concat(countdown(k - 2, r - 2, function(i){ return dig(i + 1); })).concat([{ b:dig(r - 1), n:o, lk:true, note:"odd" }]) }] };
  }
  if (key === "even+g5") return g5parity("even", false);
  if (key === "g5+odd") return g5parity("odd", true);
  return null;
}

// ---------- Explore: Rule-bound line-up ----------
function explore(host, api){
  var S = api.S;
  if (S.mode !== "digits") S.mode = "people";
  S.n = clampI(S.n, 3, 8, 6);
  var pIds = PRULES.map(function(x){ return x.id; }), dIds = DRULES.map(function(x){ return x.id; });
  S.rules = (Array.isArray(S.rules) ? S.rules : []).filter(function(id, i, a){ return pIds.indexOf(id) >= 0 && a.indexOf(id) === i; }).slice(0, 2);
  S.dg = (Array.isArray(S.dg) ? S.dg : [1, 2, 3, 4, 5]).map(Number).filter(function(d, i, a){ return d >= 0 && d <= 9 && a.indexOf(d) === i; }).sort();
  S.r = clampI(S.r, 2, 4, 3);
  S.drules = (Array.isArray(S.drules) ? S.drules : []).filter(function(id, i, a){ return dIds.indexOf(id) >= 0 && a.indexOf(id) === i; }).slice(0, 2);
  if (S.r !== 4) S.drules = S.drules.filter(function(id){ return id !== "g5"; });
  S.list = !!S.list; S.gb = !!S.gb; S.seated = !!S.seated;
  S.gp = S.gp && typeof S.gp === "object" ? S.gp : {};
  S.pred = typeof S.pred === "string" ? S.pred : "";
  S.pick = clampI(S.pick, 0, 1e6, 0);
  var pv = {}, anim = null, msg = "", gsel = null, gmsg = "";

  host.innerHTML =
    '<div class="pr-top" id="pr-mode"></div>' +
    '<div class="pg pr-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap pr-cap" id="pr-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="pr-stage"><p class="pr-rowlab" id="pr-rowlab"></p><div id="pr-row" class="pr-roww"></div>' +
        '<div class="pr-acts"><button type="button" class="btn ghost sm" id="pr-another" data-k="pranother">Show another</button></div></div>' +
      '<div id="pr-share" class="pr-share"></div>' +
      '<div id="pr-strat" class="pr-strat" aria-live="polite"></div>' +
      '<div id="pr-gb" class="pr-gb" hidden></div>' +
      '<div id="pr-list" hidden></div></div>' +
    '<div class="pg-ctrl"><div id="pr-pc" class="pr-sl"></div><div id="pr-dc"><p class="pr-clab">Available digits</p><div class="pr-digits" id="pr-digits" role="group" aria-label="Available digits"></div><div id="pr-rsl" class="pr-sl"></div></div>' +
      '<p class="pr-clab">Rules (up to 2 at once)</p><div class="pr-chips" id="pr-chips" role="group" aria-label="Rules"></div><p class="tiny pr-msg" id="pr-msg" aria-live="polite"></p>' +
      '<div class="pr-tools"><button type="button" class="btn sm" id="pr-listbtn" data-k="prlist" aria-pressed="false">List mode</button><button type="button" class="btn sm" id="pr-gbbtn" data-k="prgb" aria-pressed="false">Gap builder</button></div><p class="tiny muted" id="pr-tnote"></p></div>' +
    '<div class="pg-read"><dl class="read" id="pr-read" aria-live="polite"></dl></div></div>';

  var modeR = radios($("#pr-mode", host), { label:"Mode", options:[{ id:"people", t:"People" }, { id:"digits", t:"Digit mode" }], value:S.mode, cls:"seg",
    onChange:function(v){ user(); S.mode = v; msg = ""; save(); render(); MV.changed(); } });
  var slN = MV.sliders($("#pr-pc", host), [{ id:"prn", label:"People " + M("n"), min:3, max:8, step:1, value:S.n }], function(id, v){ user(); S.n = v; msg = ""; gbSync(); save(); render(); MV.changed(); });
  var slR = MV.sliders($("#pr-rsl", host), [{ id:"prr", label:"Length " + M("r"), min:2, max:4, step:1, value:S.r }], function(id, v){
    user(); S.r = v; msg = "";
    if (v !== 4 && S.drules.indexOf("g5") >= 0) { S.drules = S.drules.filter(function(x){ return x !== "g5"; }); msg = "‘Greater than 5000’ needs " + M("r = 4") + ", so it was turned off."; }
    save(); render(); MV.changed();
  });

  function save(){ api.save(); }
  function people(){ return S.mode === "people"; }
  function rulesNow(){ return people() ? S.rules : S.drules; }
  function user(){ cancelAnim(); pv = {}; MV.banner("", ""); }

  // --- animation bookkeeping (predictions); any user action cancels and finishes it ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], stops:[], fin:fin || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function endAnim(){ var a = anim; anim = null; if (a && a.fin) { var f = a.fin; a.fin = null; f(); } }
  function cancelAnim(){
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} });
    pv = {};
    if (a.fin) { var f = a.fin; a.fin = null; f(); }
    render(); MV.changed();
  }

  // --- the current model ---
  function model(){
    var R = rulesNow(), sat, st, labels, n;
    if (people()) { n = S.n; sat = peopleSat(n, R); st = pStrat(n, R); labels = NAMES.slice(0, n); }
    else { n = S.r; sat = digitSat(S.dg, S.r, R); st = dStrat(S.dg, S.r, R); labels = null; }
    var count = sat.idx.length;
    if (!st || st.val !== count) {
      console.error("[mdm09] strategy check failed for " + (people() ? "n=" + S.n : "digits " + S.dg.join("") + " r=" + S.r) + " rules " + R.join("+") + ": " + (st ? st.val : "none") + " vs " + count);
      st = { method:"Listing", f:big(count), val:count, note:"Counted by listing every arrangement.", rows:[] };
    }
    return { R:R, n:n, sat:sat, st:st, count:count, total:sat.total, labels:labels };
  }
  function sample(m){
    if (!m.count) return null;
    var rnd = MV.mdm.seededRandom("mdm09|" + S.mode + "|" + (people() ? S.n : S.dg.join("") + S.r) + "|" + m.R.slice().sort().join("+") + "|" + S.pick);
    return m.sat.list[m.sat.idx[rnd.int(m.count)]];
  }
  function listAllowed(m){ return people() ? S.n <= 5 : m.total <= 120 && m.total > 0; }

  // --- painting ---
  function render(){
    modeR.set(S.mode);
    slN.set("prn", S.n); slR.set("prr", S.r);
    $("#pr-pc", host).hidden = !people(); $("#pr-dc", host).hidden = people();
    var m = model();
    paintChips(); paintRow(m); paintShare(m); paintStrat(m); paintGB(m); paintList(m); paintTools(m); paintCap(m); paintRead(m);
    $("#pr-msg", host).innerHTML = msg;
  }
  function paintChips(){
    var R = rulesNow(), defs = people() ? PRULES : DRULES, box = $("#pr-chips", host);
    MV.keepFocus(box, function(){
      box.innerHTML = defs.map(function(d){
        var on = R.indexOf(d.id) >= 0, dis = d.id === "g5" && S.r !== 4;
        return '<button type="button" class="chip pr-rc' + (on ? " on" : "") + '" data-rule="' + d.id + '" data-k="rc' + d.id + '" aria-pressed="' + on + '"' + (dis ? " disabled" : "") + ">" + d.t + (d.id === "g5" ? ' <span class="pr-when">(when ' + M("r = 4") + ")</span>" : "") + "</button>";
      }).join("");
    });
    if (!people()) {
      var dg = $("#pr-digits", host);
      MV.keepFocus(dg, function(){
        var h = ""; for (var d = 0; d <= 9; d++) { var on = S.dg.indexOf(d) >= 0; h += '<button type="button" class="pr-dg' + (on ? " on" : "") + '" data-dg="' + d + '" data-k="dg' + d + '" aria-pressed="' + on + '" aria-label="Digit ' + d + (on ? " (available)" : " (not available)") + '">' + d + "</button>"; }
        dg.innerHTML = h;
      });
    }
  }
  function paintRow(m){
    var row = $("#pr-row", host), lab = $("#pr-rowlab", host), arr = pv.arr || sample(m), R = m.R;
    $("#pr-another", host).disabled = m.count < 2 || !!pv.hide;
    if (people()) {
      var none = !arr, shown = arr || permsOf(m.n)[0], q = {};
      shown.forEach(function(p, s){ q[p] = s; });
      var blk = null;
      if (!none && !pv.noBlock && (R.indexOf("tog") >= 0 || pv.block != null) && adj(q[0], q[1])) blk = Math.min(q[0], q[1]);
      var mark = {}; R.forEach(function(id){ mark[0] = 1; if (id !== "first" && id !== "end") mark[1] = 1; if (id === "all") mark[2] = 1; });
      lab.innerHTML = pv.hide ? "The line-up" : none ? "<strong>No line-up fits these rules.</strong>" : R.length ? "A line-up that fits the rules" : "A line-up";
      D4.row(row, { labels:m.labels, arr:shown, block:blk, mark:mark, cls:none ? "none" : "" });
      row.setAttribute("role", "img");
      row.setAttribute("aria-label", (none ? "No line-up fits. Shown: " : "Line-up: ") + shown.map(function(p){ return NAMES[p]; }).join(", ") + (blk != null ? ". Ana and Bo form a block." : ""));
    } else {
      var dn = !arr, ds = arr || [];
      lab.innerHTML = dn ? "<strong>No digit string fits these rules.</strong>" : R.length ? "A number that fits the rules" : "A digit string";
      if (dn) { row.dataset.sig = ""; row.innerHTML = '<p class="muted pr-none">—</p>'; }
      else D4.row(row, { labels:ds.map(String), arr:ds.map(function(_, i){ return i; }), block:null, cls:"dg" });
      row.setAttribute("role", "img");
      row.setAttribute("aria-label", dn ? "No digit string fits." : "Digit string " + ds.join(""));
    }
  }
  function paintShare(m){
    var box = $("#pr-share", host), word = people() ? "line-ups" : "digit strings";
    if (pv.hide && !pv.bar) { box.innerHTML = '<div class="pr-bar" aria-hidden="true"></div><p class="pr-blab"><span>? fit</span><span>' + big(m.total) + " " + word + " in all</span></p>"; return; }
    var segs = pv.bar || [{ v:m.count, cls:"fit", lab:big(m.count) + " fit" }, { v:m.total - m.count, cls:"rest", lab:big(m.total - m.count) + " don’t" }];
    var tot = segs.reduce(function(a, s){ return a + s.v; }, 0) || 1;
    box.innerHTML = '<div class="pr-bar" role="img" aria-label="' + MV.esc(segs.map(function(s){ return s.lab; }).join(", ")) + '">' + segs.map(function(s){ return s.v ? '<span class="pr-b ' + s.cls + '" style="width:' + (100 * s.v / tot).toFixed(2) + '%"></span>' : ""; }).join("") + "</div>" +
      '<p class="pr-blab" aria-hidden="true">' + segs.map(function(s){ return '<span class="' + s.cls + '">' + s.lab + "</span>"; }).join("") + "</p>";
  }
  function paintStrat(m){
    var box = $("#pr-strat", host), st = m.st;
    if (pv.hide) {
      box.innerHTML = '<p class="pr-shead"><span class="pr-meth">Strategy</span> <span class="pr-sf">?</span></p>' + (st.rows.length ? D3.html(st.rows, { shown:pv.shown || 0, hi:pv.shown ? pv.shown - 1 : null }) : "");
      return;
    }
    box.innerHTML = '<p class="pr-shead"><span class="pr-meth">' + st.method + '</span> <span class="pr-sf">' + M(st.f) + "</span></p>" +
      '<p class="pr-snote">' + st.note + "</p>" + (st.rows.length ? D3.html(st.rows) : "");
  }
  function paintTools(m){
    var lb = $("#pr-listbtn", host), gb = $("#pr-gbbtn", host), ok = listAllowed(m), note = [];
    lb.setAttribute("aria-pressed", String(S.list && ok)); lb.disabled = !ok;
    lb.classList.toggle("on", S.list && ok);
    gb.hidden = !people(); gb.setAttribute("aria-pressed", String(S.gb)); gb.classList.toggle("on", S.gb);
    if (!ok) note.push(people() ? "List mode needs " + M("n ≤ 5") + "." : "List mode lists up to 120 digit strings (here " + big(m.total) + ").");
    $("#pr-tnote", host).innerHTML = note.join(" ");
  }
  function paintList(m){
    var box = $("#pr-list", host), show = S.list && listAllowed(m) && !pv.hide;
    box.hidden = !show;
    if (!show) { box.innerHTML = ""; return; }
    var on = {}; m.sat.idx.forEach(function(k){ on[k] = 1; });
    var items = m.sat.list.map(function(a, k){ return { t:people() ? a.map(function(p){ return NAMES[p][0]; }).join(" ") : a.join(""), on:!!on[k] }; });
    var legend = people() ? '<p class="tiny muted pr-leg">' + NAMES.slice(0, S.n).map(function(nm){ return nm[0] + " = " + nm; }).join(", ") + "</p>" : "";
    box.innerHTML = '<p class="pr-lhead"><strong>List mode:</strong> ' + big(m.total) + " " + (people() ? "line-ups" : "digit strings") + ", " + big(m.count) + " ticked.</p>" + legend + D4.listHTML(items, { label:"List mode" });
  }
  function paintCap(m){
    var c = $("#pr-cap", host), t = pv.cap != null ? pv.cap : pv.hide ? "?" : m.st.f;
    c.innerHTML = pv.cap != null ? MV.md(t) : M(t); c.classList.toggle("long", t.length > 26);
  }
  function paintRead(m){
    var hide = !!pv.hide, rows = [], word = people() ? "line-ups" : "digit strings";
    rows.push(["All arrangements", people() ? M(m.n + "!") + " = " + big(m.total) : M("P(" + S.dg.length + ", " + S.r + ")") + " = " + big(m.total) + " digit strings"]);
    rows.push(["Satisfying the rules", hide ? "?" : "<strong>" + big(m.count) + "</strong>"]);
    rows.push(["Strategy", hide ? "?" : m.st.method + ": " + M(m.st.f)]);
    var f = m.total ? MV.mdm.frac.of(m.count, m.total) : null;
    rows.push(["Share", hide ? "?" : !f ? "—" : f.n === 0 ? "none of the " + word : f.n === f.d ? "all " + word : MV.mdm.frac.txt(f) + " of all " + word]);
    if (S.list && listAllowed(m) && !hide) rows.push(["List check", big(m.count) + " ticked"]);
    $("#pr-read", host).innerHTML = MV.readoutHTML(rows);
  }

  // --- Gap builder (people mode, with an 'apart' rule): seat the others, then put the restricted people in different gaps ---
  function gbCfg(){
    if (!people()) return null;
    var R = S.rules, res = R.indexOf("all") >= 0 ? [0, 1, 2] : R.indexOf("apart") >= 0 ? [0, 1] : null;
    if (!res) return null;
    var oth = []; for (var i = 0; i < S.n; i++) if (res.indexOf(i) < 0) oth.push(i);
    return { res:res, oth:oth, m:oth.length, gaps:oth.length + 1, sig:S.n + "|" + res.join(",") };
  }
  function gbSync(){
    var c = gbCfg();
    if (!c) return;
    if (S.gsig !== c.sig) { S.gsig = c.sig; S.seated = false; S.gp = {}; S.oth = null; gsel = null; gmsg = ""; }
    var okOth = Array.isArray(S.oth) && S.oth.length === c.m && c.oth.every(function(p){ return S.oth.indexOf(p) >= 0; });
    if (!okOth) S.oth = c.oth.slice();
    Object.keys(S.gp).forEach(function(p){ var g = S.gp[p]; if (c.res.indexOf(+p) < 0 || !(g >= 0 && g < c.gaps)) delete S.gp[p]; });
  }
  function gapOf(g){ var who = null; Object.keys(S.gp).forEach(function(p){ if (S.gp[p] === g) who = +p; }); return who; }
  function gbPlaced(c){ return c.res.filter(function(p){ return S.gp[p] != null; }).length; }
  function gbLineup(c){
    var out = [];
    for (var g = 0; g < c.gaps; g++) { var w = gapOf(g); if (w != null) out.push(w); if (g < c.m) out.push(S.oth[g]); }
    return out;
  }
  function paintGB(m){
    var box = $("#pr-gb", host), show = people() && S.gb;
    box.hidden = !show;
    if (!show) { box.innerHTML = ""; return; }
    gbSync();
    var c = gbCfg(), h = '<h4 class="pr-gbh">Gap builder</h4>';
    h += '<div class="numrow pr-predrow"><label for="pr-pred">Your prediction</label><input class="numin short" id="pr-pred" data-k="prpred" type="text" inputmode="numeric" autocomplete="off" value="' + MV.esc(S.pred) + '"><span class="tiny muted">Predict the count, then build it.</span></div>';
    if (!c) {
      h += '<p class="muted">The Gap builder works with an ‘apart’ rule. Turn on “Ana and Bo apart” or “Ana, Bo and Cy all apart”.</p>';
      MV.keepFocus(box, function(){ box.innerHTML = h; });
      return;
    }
    var resN = c.res.map(function(p){ return NAMES[p]; }), othN = S.oth.map(function(p){ return NAMES[p]; });
    h += '<p class="pr-step"><strong>Step 1.</strong> Seat the people with no rule: ' + othN.join(", ") + ".</p>";
    h += '<div class="pr-acts"><button type="button" class="btn sm' + (S.seated ? " ghost" : " primary") + '" id="pr-seat" data-k="prseat">' + (S.seated ? "Seat them in another order" : "Seat them") + "</button>" +
      (S.seated ? '<span class="pr-gnote">' + M(c.m + "!") + " = " + big(fact(c.m)) + " orders</span>" : "") + "</div>";
    if (S.seated) {
      h += '<p class="pr-step"><strong>Step 2.</strong> Put ' + resN.join(c.res.length === 3 ? ", " : " and ").replace(/, (?=[^,]*$)/, " and ") + " in different gaps. Tap a name, then tap a gap, or use the menus.</p>";
      h += '<div class="pr-gres">' + c.res.map(function(p){
        var g = S.gp[p];
        return '<div class="pr-gwho"><button type="button" class="pr-tokb' + (gsel === p ? " sel" : "") + (g != null ? " placed" : "") + '" data-gsel="' + p + '" data-k="gs' + p + '" aria-pressed="' + (gsel === p) + '">' + NAMES[p] + "</button>" +
          '<select class="pr-gsel" data-gmenu="' + p + '" data-k="gm' + p + '" aria-label="' + MV.esc("Gap for " + NAMES[p]) + '"><option value="">Not placed</option>' +
          Array.apply(null, { length:c.gaps }).map(function(_, k){ return '<option value="' + k + '"' + (g === k ? " selected" : "") + ">Put in gap " + (k + 1) + "</option>"; }).join("") + "</select></div>";
      }).join("") + "</div>";
      h += '<div class="pr-gaps" role="group" aria-label="Seats and gaps">';
      for (var g = 0; g < c.gaps; g++) {
        var w = gapOf(g);
        h += '<button type="button" class="pr-gap' + (w != null ? " full" : "") + '" data-gap="' + g + '" data-k="gap' + g + '" aria-label="' + MV.esc("Gap " + (g + 1) + (w != null ? ": " + NAMES[w] + ". Tap to take " + NAMES[w] + " out." : ": empty")) + '">' + (w != null ? NAMES[w] : '<span class="pr-gn">gap ' + (g + 1) + "</span>") + "</button>";
        if (g < c.m) h += '<span class="pr-tok st">' + NAMES[S.oth[g]] + "</span>";
      }
      h += "</div>";
      var j = c.res.length, placed = gbPlaced(c), chs = c.res.map(function(p, i){ return NAMES[p] + ": " + (c.gaps - i) + (i ? " left" : " gaps"); }).join(" · ");
      h += '<p class="pr-gbuild">Others: ' + M(c.m + "!") + " = " + big(fact(c.m)) + " · " + chs + "</p>";
      if (placed === j) {
        var v = fact(c.m) * nPr(c.gaps, j), single = m.R.length === 1 || (m.R.indexOf("all") >= 0 && m.R.indexOf("apart") >= 0);
        h += '<p class="pr-gdone"><strong>✓ Built:</strong> ' + M(c.m + "! × P(" + c.gaps + ", " + j + ") = " + big(fact(c.m)) + " × " + big(nPr(c.gaps, j)) + " = " + big(v)) + ". Line-up: " + gbLineup(c).map(function(p){ return NAMES[p]; }).join(" ") + ".</p>";
        h += '<p class="tiny">' + (single ? (v === m.count ? "That matches the count, " + big(m.count) + "." : "") : "The Gap builder counts only the ‘apart’ rule; with your other rule the count is " + big(m.count) + ".") + "</p>";
      } else h += '<p class="tiny muted">' + placed + " of " + j + " placed.</p>";
    } else h += '<p class="tiny muted">Step 2 opens once the others are seated.</p>';
    if (gmsg) h += '<p class="tiny pr-gmsg">' + gmsg + "</p>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  function gbPut(p, g){
    var c = gbCfg(); if (!c) return;
    if (g == null) { delete S.gp[p]; gmsg = ""; return; }
    var w = gapOf(g);
    if (w != null && w !== p) { gmsg = "Gap " + (g + 1) + " already holds " + NAMES[w] + ". Each of them needs a different gap."; return; }
    S.gp[p] = g; gmsg = "";
  }

  // --- events ---
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.closest("#pr-mode")) return;
    if (b.dataset.rule) {
      user();
      var R = rulesNow(), id = b.dataset.rule, i = R.indexOf(id);
      if (i >= 0) { R.splice(i, 1); msg = ""; }
      else if (R.length >= 2) msg = "Up to 2 rules at once. Turn one off first.";
      else { R.push(id); msg = ""; }
      gbSync(); save(); render(); MV.changed(); return;
    }
    if (b.dataset.dg != null) {
      user(); var d = +b.dataset.dg, k = S.dg.indexOf(d);
      if (k >= 0) S.dg.splice(k, 1); else { S.dg.push(d); S.dg.sort(); }
      msg = ""; save(); render(); MV.changed(); return;
    }
    if (b.id === "pr-another") { user(); S.pick++; save(); render(); return; }
    if (b.id === "pr-listbtn") { user(); S.list = !S.list; save(); render(); return; }
    if (b.id === "pr-gbbtn") { user(); S.gb = !S.gb; gbSync(); save(); render(); MV.changed(); return; }
    if (b.id === "pr-seat") {
      user(); var c = gbCfg(); if (!c) return;
      if (S.seated) S.oth = MV.shuffle(S.oth.slice(), "mdm09-oth-" + (S.pick++));
      S.seated = true; gmsg = ""; save(); render(); MV.changed(); return;
    }
    if (b.dataset.gsel != null) { var p = +b.dataset.gsel; gsel = gsel === p ? null : p; gmsg = ""; render(); return; }
    if (b.dataset.gap != null) {
      var g = +b.dataset.gap, w = gapOf(g);
      if (gsel != null) { gbPut(gsel, g); if (!gmsg) gsel = null; }
      else if (w != null) gbPut(w, null);
      else gmsg = "Tap a name first, then tap a gap.";
      save(); render(); MV.changed(); return;
    }
  });
  host.addEventListener("change", function(e){
    var t = e.target; if (!t.dataset || t.dataset.gmenu == null) return;
    gbPut(+t.dataset.gmenu, t.value === "" ? null : +t.value); gsel = null;
    save(); render(); MV.changed();
  });
  host.addEventListener("input", function(e){
    if (e.target.id !== "pr-pred") return;
    S.pred = e.target.value; save(); MV.changed();
  });

  gbSync();
  render();

  // --- predictions ---
  function startPred(p){
    cancelAnim();
    var s = p.start || {};
    S.mode = "people"; S.n = s.n; S.rules = (s.rules || []).slice(); S.list = false; msg = "";
    gbSync();
    pv = { hide:true, shown:0 };
    if (p.id === "p1") pv.arr = [1, 2, 0, 3, 4];
    if (p.id === "p2") { pv.arr = [0, 2, 1, 3, 4]; pv.noBlock = true; }
    if (p.id === "p4") pv.arr = [3, 1, 4, 0, 2, 5];
    save(); render();
  }
  function reveal(arr){ pv = { arr:arr, fresh:true }; render(); MV.changed(); later(MV.reduceMotion ? 0 : 350, endAnim); }
  function runPred(p, done){
    newAnim(done);
    var m = model(), slow = MV.reduceMotion ? 0 : 1;
    if (p.id === "p1") {
      later(300 * slow, function(){ pv.arr = [0, 1, 2, 3, 4]; pv.cap = "Ana takes seat 1"; render(); });
      var k = 0;
      later(1000 * slow, function step(){
        k++; pv.shown = k; pv.cap = "`1 × " + [4, 3, 2, 1].slice(0, k - 1).join(" × ") + (k < 5 ? " × …`" : " = 24`"); if (k === 1) pv.cap = "`1 × …`"; render();
        if (k < 5) later(480 * slow, step); else later(700 * slow, function(){ reveal([0, 1, 2, 3, 4]); });
      });
      return;
    }
    if (p.id === "p2") {
      later(300 * slow, function(){ pv.arr = [0, 1, 2, 3, 4]; pv.cap = "Bo moves next to Ana"; render(); });
      later(1100 * slow, function(){ pv.noBlock = false; pv.block = 0; pv.cap = "`4! = 24` (the block + 3 people)"; render(); });
      later(2300 * slow, function(){ pv.arr = [1, 0, 2, 3, 4]; pv.cap = "`4! × 2! = 48`"; render(); });
      later(3400 * slow, function(){ reveal([1, 0, 2, 3, 4]); });
      return;
    }
    if (p.id === "p3") {
      later(200 * slow, function(){ pv.cap = "`5! = 120` line-ups"; pv.bar = [{ v:120, cls:"all", lab:"120 line-ups" }]; render(); });
      later(1200 * slow, function(){ pv.cap = "together: `4! × 2! = 48`"; pv.bar = [{ v:48, cls:"bad", lab:"48 together" }, { v:72, cls:"rest", lab:"the rest" }]; render(); });
      later(2400 * slow, function(){ pv.cap = "apart: `120 - 48 = 72`"; pv.bar = [{ v:48, cls:"rest", lab:"48 together" }, { v:72, cls:"fit", lab:"72 apart" }]; render(); });
      later(3400 * slow, function(){ reveal(null); });
      return;
    }
    if (p.id === "p4") {
      later(300 * slow, function(){ pv.cap = "Here Bo comes before Ana"; render(); });
      later(1200 * slow, function(){ pv.arr = [3, 0, 4, 1, 2, 5]; pv.cap = "Swap them: now Ana comes first"; render(); });
      later(2300 * slow, function(){ pv.arr = [3, 1, 4, 0, 2, 5]; pv.cap = "Every line-up pairs with its swap"; render(); });
      later(3300 * slow, function(){ pv.arr = [3, 0, 4, 1, 2, 5]; pv.cap = "`720 ÷ 2 = 360`"; pv.bar = [{ v:360, cls:"fit", lab:"360 Ana first" }, { v:360, cls:"rest", lab:"360 Bo first" }]; render(); });
      later(4300 * slow, function(){ reveal([3, 0, 4, 1, 2, 5]); });
      return;
    }
    reveal(null);
    void m;
  }

  return {
    predict:{ start:startPred, run:runPred },
    challenge:function(id){ return chal(id); }
  };

  function chal(id){
    var m = model(), R = m.R, c = m.count, has = function(x){ return R.indexOf(x) >= 0; };
    if (id === "tc1") {
      if (people()) return { ok:false, msg:"Switch to Digit mode." };
      if (S.dg.join(",") !== "0,1,2,3,4") return { ok:false, msg:"Choose the digits 0, 1, 2, 3 and 4 (and no others)." };
      if (S.r !== 3) return { ok:false, msg:"Set the length " + M("r") + " to 3." };
      if (!R.length) return { ok:false, msg:"These include codes like 012. A number can’t start with 0." };
      if (R.length === 1 && has("lead")) return { ok:true };
      if (R.length === 2 && has("lead") && has("even")) return { ok:false, msg:"That adds an extra rule." };
      return { ok:false, msg:"Your count is " + big(c) + ", not 48." };
    }
    if (id === "tc2") {
      if (!people()) return { ok:false, msg:"Switch to People mode." };
      if (S.n !== 6) return { ok:false, msg:"Set " + M("n") + " to 6." };
      if (!R.length) return { ok:false, msg:"Choose one rule." };
      if (R.length > 1) return { ok:false, msg:"Use only <strong>one</strong> rule." };
      if (has("tog") || has("end")) return { ok:true };
      if (has("apart")) return { ok:false, msg:"That’s the other 480." };
      if (has("before")) return { ok:false, msg:"Half of 720." };
      if (has("first")) return { ok:false, msg:"Allow either end." };
      return { ok:false, msg:"Your count is " + big(c) + ", not 240." };
    }
    if (id === "tc3") {
      if (!people()) return { ok:false, msg:"Switch to People mode." };
      if (S.n !== 6) return { ok:false, msg:"Set " + M("n") + " to 6." };
      if (!has("all")) return { ok:false, msg:"Turn on “Ana, Bo and Cy all apart”." };
      if (R.some(function(x){ return x !== "all" && x !== "apart"; })) return { ok:false, msg:"Use only the ‘all apart’ rule." };
      var pr = MV.parseNum(S.pred), v = pr && pr.length === 1 ? pr[0] : null;
      if (v == null) return { ok:false, msg:"Open the Gap builder and enter your prediction first." };
      if (v === 576) return { ok:false, msg:"That only removes line-ups with all three together. Two of them could still be side by side." };
      if (v === 480) return { ok:false, msg:"That handles only Ana and Bo." };
      if (v !== 144) return { ok:false, msg:"Your prediction is " + big(v) + ". Build it in the Gap builder to see the count." };
      var cfg = gbCfg();
      if (!S.gb || !cfg) return { ok:false, msg:"Now build it: open the Gap builder." };
      if (!S.seated) return { ok:false, msg:"Now build it: seat Di, Ed and Fay first." };
      if (gbPlaced(cfg) < 3) return { ok:false, msg:"Put Ana, Bo and Cy in different gaps." };
      return { ok:true };
    }
    return { ok:false };
  }
}

// ---------- hero: six people; Ana and Bo slide together into a block (5! = 120), swap (× 2! = 240); split bar 240 | 480 ----------
function hero(f){
  var svg = $("#pr-hsvg"), cap = f.cap;
  if (!svg) return;
  var Y = 92, R = 19, NM = ["Cy", "Ana", "Di", "Bo", "Ed", "Fay"];
  var X0 = NM.map(function(_, i){ return 40 + i * 56; });
  var X1 = [150, 44, 206, 88, 262, 318], X2 = [150, 88, 206, 44, 262, 318];
  var st = { x:X0.slice(), blk:0, cnt:"6! = 720", bar:0 };
  function r1(v){ return Math.round(v * 10) / 10; }
  function draw(){
    var h = '<text class="pr-hcnt" x="180" y="38">' + st.cnt + "</text>";
    if (st.blk > 0) h += '<rect class="pr-hblk" x="' + r1(18 + (1 - st.blk) * 20) + '" y="' + (Y - 28) + '" width="' + r1(96 - (1 - st.blk) * 40) + '" height="56" rx="18" style="opacity:' + st.blk.toFixed(2) + '"/>';
    NM.forEach(function(nm, i){
      var ab = nm === "Ana" || nm === "Bo";
      h += '<g class="pr-ht' + (ab ? " ab" : "") + '"><circle cx="' + r1(st.x[i]) + '" cy="' + Y + '" r="' + R + '"/><text x="' + r1(st.x[i]) + '" y="' + (Y + 4.5) + '">' + nm + "</text></g>";
    });
    if (st.bar > 0) {
      var W = 300 * st.bar;
      h += '<rect class="pr-hbar t" x="30" y="146" width="' + r1(W / 3) + '" height="22" rx="3"/><rect class="pr-hbar a" x="' + r1(30 + W / 3) + '" y="146" width="' + r1(W * 2 / 3) + '" height="22" rx="3"/>';
      if (st.bar >= 1) h += '<text class="pr-hbl" x="80" y="190">240 together</text><text class="pr-hbl" x="230" y="190">480 apart</text>';
    }
    svg.innerHTML = h;
  }
  function last(){ st = { x:X2.slice(), blk:1, cnt:"5! × 2! = 240", bar:1 }; draw(); cap.textContent = "720 line-ups: 240 with Ana and Bo together, 480 with them apart"; }
  if (MV.reduceMotion) { last(); return; }
  draw(); cap.textContent = "Six people in a row: 6! = 720 line-ups";
  function move(to, dur, done){
    var from = st.x.slice();
    MV.tween({ dur:dur, step:function(t){ st.x = from.map(function(x, i){ return x + (to[i] - x) * t; }); draw(); }, done:done });
  }
  MV.wait(1200, function(){
    cap.textContent = "Ana and Bo slide together";
    move(X1, 900, function(){
      MV.tween({ dur:500, step:function(t){ st.blk = t; draw(); }, done:function(){
        st.cnt = "5! = 120"; draw(); cap.textContent = "One block + 4 people = 5 items: 5! = 120";
        MV.wait(1400, function(){
          cap.textContent = "Ana and Bo swap inside the block";
          move(X2, 800, function(){
            st.cnt = "5! × 2! = 240"; draw(); cap.textContent = "× 2! for the order inside the block = 240";
            MV.wait(1400, function(){
              MV.tween({ dur:900, step:function(t){ st.bar = t; draw(); }, done:function(){ st.bar = 1; draw(); cap.textContent = "720 line-ups: 240 with Ana and Bo together, 480 with them apart"; } });
            });
          });
        });
      } });
    });
  });
}

// ---------- Part 3: Strategy chooser (strategy cards, templates with blanks, check by listing) ----------
var P3RULE = {
  vowelFirst:function(s){ return "AEIOU".indexOf(s[0]) >= 0; },
  mpTogether:function(s){ return adj(s.indexOf("M"), s.indexOf("P")); },
  vowelsApart:function(s){ return !adj(s.indexOf("A"), s.indexOf("E")); },
  evenNumber:function(s){ return s[0] !== "0" && +s[s.length - 1] % 2 === 0; }
};
function p3Items(cfg){
  var objs = cfg.letters ? cfg.letters.split("") : cfg.digits.map(String), r = cfg.r || objs.length;
  return D4.perms(objs.length, r).map(function(p){ var s = p.map(function(i){ return objs[i]; }); return { t:s.join(""), on:P3RULE[cfg.rule](s) }; });
}
function part3(host, api){
  var S = api.S, P3 = api.content || {}, ST = P3.stations || [];
  if (!ST.length) return {};
  S.st = S.st && typeof S.st === "object" ? S.st : {};
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = ST[0].id;
  var msgs = {}, cardMsg = {};
  host.innerHTML = '<div id="ps-tabs" class="ps-tabs"></div><div id="ps-body" class="ps-body"></div>';
  function sst(id){ var x = S.st[id] || (S.st[id] = {}); x.vals = x.vals || {}; x.ok = x.ok || {}; return x; }
  function done(s){ var x = sst(s.id); return x.cardOk && s.rows.every(function(_, i){ return x.ok[i]; }); }
  var tabOpts = ST.map(function(s){ return { id:s.id, t:"" }; });
  function tabText(){ ST.forEach(function(s, i){ tabOpts[i].t = "Station " + (i + 1) + (done(s) ? ' <span class="ps-tick" aria-label="done">✓</span>' : ""); }); }
  tabText();
  var tabs = radios($("#ps-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; api.save(); paint(); } });
  function rowHTML(s, x, row, i){
    var parts = row.t.split("[[]]"), okd = !!x.ok[i], id = "ps-" + s.id + "-" + i;
    var inp = '<input class="numin ps-in' + (okd ? " ok" : "") + '" id="' + id + '" data-ps="' + i + '" data-k="psi' + s.id + i + '" type="text" inputmode="numeric" autocomplete="off" aria-label="' + MV.esc(MV.plain(parts[0]).replace(/[:\s]+$/, "")) + '" value="' + MV.esc(x.vals[i] || "") + '"' + (okd ? " disabled" : "") + ">";
    var h = '<li class="ps-row' + (okd ? " ok" : "") + '"><span class="ps-rt">' + parts[0] + inp + (parts[1] || "") + (okd ? ' <span class="ps-mk" aria-label="correct">✓</span>' : "") + "</span>";
    var mm = msgs[s.id + "|" + i];
    if (mm && !okd) h += '<span class="ps-rfb">' + mm + "</span>";
    return h + "</li>";
  }
  function listHTML(s, x){
    var L = s.list || {}, which = x.full && L.full ? L.full : L.small; if (!which) return "";
    var items = p3Items(which), on = items.filter(function(t){ return t.on; }).length;
    var h = (L.full ? '<div class="ps-lsw" role="group" aria-label="Which version to list"><button type="button" class="chip' + (!x.full ? " on" : "") + '" data-psl="small" data-k="psls" aria-pressed="' + !x.full + '">Smaller version</button><button type="button" class="chip' + (x.full ? " on" : "") + '" data-psl="full" data-k="pslf" aria-pressed="' + !!x.full + '">Full problem</button></div>' : "");
    h += "<p>" + (x.full ? "The full problem" : "A smaller version") + ": " + which.task + ". <strong>" + on + " of " + items.length + "</strong> ticked.</p>";
    h += D4.listHTML(items, { label:which.task });
    h += '<p class="ps-lf">The same strategy: ' + which.f + (x.cardOk ? "" : "") + ' <span class="ps-match">' + "✓ matches the " + on + " ticked.</span></p>";
    return h;
  }
  function paint(){
    tabText(); tabs.refresh();
    var s = ST.filter(function(q){ return q.id === S.cur; })[0], x = sst(s.id), body = $("#ps-body", host);
    var dOld = $("details.alg", body), algOpen = dOld ? dOld.open : false;
    var h = '<div class="ps-card"><span class="ps-lab">Station ' + (ST.indexOf(s) + 1) + '</span><p class="ps-prob">' + s.problem + "</p></div>";
    h += '<h4 class="ps-h">Step 1. Pick a strategy card</h4><div class="ps-cards" role="group" aria-label="Strategy cards">' + s.options.map(function(o, i){
      var on = x.card === i, good = on && x.cardOk;
      return '<button type="button" class="ps-sc' + (on ? (good ? " right" : " wrong") : "") + '" data-pc="' + i + '" data-k="psc' + i + '" aria-pressed="' + on + '"' + (x.cardOk ? " disabled" : "") + ">" + o.t + "</button>";
    }).join("") + "</div>";
    if (x.card != null) { var oc = s.options[x.card]; h += MV.fbHTML(x.cardOk ? "good" : "bad", (x.cardOk ? "<strong>✓ Good choice.</strong> " : "<strong>✗ Not the best fit.</strong> ") + (oc.why || "") + (x.cardOk ? "" : " Try another card.")); }
    h += '<h4 class="ps-h">Step 2. Fill in the template</h4>';
    if (!x.cardOk) h += '<p class="muted">The template opens once you pick the card that fits.</p>';
    else {
      h += '<ol class="ps-rows">' + s.rows.map(function(row, i){ return rowHTML(s, x, row, i); }).join("") + "</ol>";
      if (done(s)) h += '<p class="ps-done"><strong>✓ Station ' + (ST.indexOf(s) + 1) + " complete:</strong> " + s.done + (ST.every(done) ? " All four stations done. Try the quick check below." : " Choose another station above.") + "</p>";
      else h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="pscheck" data-k="pscheck">Check</button></div>';
    }
    h += '<details class="alg"' + (algOpen ? " open" : "") + '><summary>Check it by listing</summary><div class="ps-list">' + listHTML(s, x) + "</div></details>";
    MV.keepFocus(body, function(){ body.innerHTML = h; });
  }
  host.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset || t.dataset.ps == null) return;
    sst(S.cur).vals[t.dataset.ps] = t.value; api.save();
  });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.ps != null) { var b = $('[data-act="pscheck"]', host); if (b) { e.preventDefault(); b.click(); } } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !$("#ps-body", host).contains(b)) return;
    var s = ST.filter(function(q){ return q.id === S.cur; })[0], x = sst(s.id), body = $("#ps-body", host);
    if (b.dataset.pc != null) { x.card = +b.dataset.pc; x.cardOk = MV.ok(s.options[x.card]); api.save(); paint(); MV.focusFb(body); return; }
    if (b.dataset.psl) { x.full = b.dataset.psl === "full"; api.save(); paint(); return; }
    if (b.dataset.act === "pscheck") {
      s.rows.forEach(function(row, i){
        if (x.ok[i]) return;
        var raw = (x.vals[i] || "").trim(), k = s.id + "|" + i;
        if (!raw) { msgs[k] = "Fill in this blank."; return; }
        var p = MV.parseNum(raw), v = p && p.length === 1 ? p[0] : null, ans = MV.ans(row);
        if (v == null) { msgs[k] = "Type a whole number."; return; }
        if (Math.abs(v - ans) < 1e-9) { x.ok[i] = true; msgs[k] = null; return; }
        var named = (row.wrong || []).filter(function(w){ return Math.abs(w.match - v) < 1e-9; })[0];
        msgs[k] = "✗ " + (named ? named.fb : "Not quite. Check this step against the strategy.");
      });
      api.save(); paint();
      var first = body.querySelector(".ps-rfb"); if (first) { first.setAttribute("tabindex", "-1"); first.focus({ preventScroll:true }); } else MV.focusFb(body);
      return;
    }
  });
  paint();
  return {};
}

// ---------- Performance task: Seating planner ----------
var task = (function(){
  var api = null, msg = "";
  var TR = {
    R1:function(q){ return q[0] === 0; }, R2:function(q){ return q[0] === 0 || q[0] === 5; }, R3:function(q){ return q[0] !== 0 && q[0] !== 5; },
    R4:function(q){ return adj(q[1], q[2]); }, R5:function(q){ return !adj(q[1], q[2]); }, R6:function(q){ return q[3] < q[4]; }, R7:function(q){ return q[5] === 5; }
  };
  var HINT = {
    R1:"R1 fixes Ana’s seat (restriction first): 1 × " + M("5!") + ".",
    R2:"R2 gives Ana 2 seats (restriction first).",
    R3:"R3 gives Ana the 4 middle seats (restriction first).",
    R4:"R4: glue Bo and Cy into a block, then × " + M("2!") + ".",
    R5:"R5: subtract, total − together.",
    R6:"R6: by symmetry, Di is before Ed in exactly half the seatings.",
    R7:"R7 fixes Fay’s seat (restriction first)."
  };
  function rulesDef(){ return (api && api.content && api.content.rules) || []; }
  function read(){ var s = api ? api.S : {}; return { rules:(Array.isArray(s.rules) ? s.rules : []).slice().sort() }; }
  function count(d){ var c = peopleSat(6, []), out = 0, q = [];
    c.list.forEach(function(p){ for (var s = 0; s < 6; s++) q[p[s]] = s; if (d.rules.every(function(id){ return TR[id](q); })) out++; });
    return out;
  }
  function firstFit(d){ var q = [], c = peopleSat(6, []); for (var k = 0; k < c.list.length; k++) { var p = c.list[k]; for (var s = 0; s < 6; s++) q[p[s]] = s; if (d.rules.every(function(id){ return TR[id](q); })) return p; } return null; }
  function paint(){
    var d = read(), box = $("#sp-chips");
    MV.keepFocus(box, function(){
      box.innerHTML = rulesDef().map(function(r){ var on = d.rules.indexOf(r.id) >= 0; return '<button type="button" class="chip sp-rc' + (on ? " on" : "") + '" data-spr="' + r.id + '" data-k="sp' + r.id + '" aria-pressed="' + on + '"><strong>' + r.id + "</strong> " + r.t + "</button>"; }).join("");
    });
    $("#sp-msg").textContent = msg;
    var c = d.rules.length ? count(d) : null, pvw = $("#sp-pv");
    var h = '<p class="tiny muted" style="margin:0 0 4px">Your plan</p>';
    h += '<p class="sp-count">' + (c == null ? "Choose a rule to start." : "Seatings: <strong>" + big(c) + "</strong>") + "</p>";
    if (d.rules.length) h += '<ul class="sp-hints">' + d.rules.map(function(id){ return "<li>" + HINT[id] + "</li>"; }).join("") + "</ul>";
    pvw.innerHTML = h + '<div id="sp-row" class="pr-roww sm"></div><p class="tiny muted" id="sp-rowlab"></p>';
    var fit = d.rules.length ? firstFit(d) : null, row = $("#sp-row");
    if (fit) { D4.row(row, { labels:NAMES.slice(0, 6), arr:fit, block:null, mark:{} }); row.setAttribute("role", "img"); row.setAttribute("aria-label", "One seating that fits: " + fit.map(function(p){ return NAMES[p]; }).join(", ")); $("#sp-rowlab").textContent = "One seating that fits your rules."; }
    else if (d.rules.length) { row.innerHTML = ""; $("#sp-rowlab").textContent = "No seating fits these rules."; }
  }
  function keyText(k){ var rs = k.split("+"); return rs.join(" + ") + ": " + big(count({ rules:rs })); }
  return {
    render:function(inp, pv, a){
      api = a; if (!Array.isArray(a.S.rules)) a.S.rules = [];
      inp.innerHTML = '<p class="pr-clab">Rule menu (choose 1 to 3)</p><div class="sp-chips" id="sp-chips" role="group" aria-label="Rule menu"></div><p class="tiny pr-msg" id="sp-msg" aria-live="polite"></p>';
      pv.innerHTML = '<div class="sp-pv" id="sp-pv" aria-live="polite"></div>';
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-spr]"); if (!b) return;
        var s = a.S, id = b.dataset.spr, i = s.rules.indexOf(id);
        if (i >= 0) { s.rules.splice(i, 1); msg = ""; }
        else if (s.rules.length >= 3) msg = "Up to three rules. Turn one off first.";
        else { s.rules.push(id); msg = ""; }
        a.save(); paint(); a.update();
      });
      paint();
    },
    read:read,
    valid:function(d){ return d.rules.length >= 1 && d.rules.length <= 3 ? true : "Choose 1 to 3 rules from the menu."; },
    checks:function(d){
      var c = d.rules.length ? count(d) : -1, has = function(x){ return d.rules.indexOf(x) >= 0; };
      return [has("R4") || has("R5"), has("R1") || has("R2") || has("R3") || has("R7"), c >= 100 && c <= 200];
    },
    key:function(d){ return d.rules.join("+"); },
    label:function(k){ return keyText(k); },
    text:function(k){ return keyText(k); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
