// MCV4U 01 Rationalizing Radical Expressions: hero storyboard, conjugate machine (Explore), rationalize-the-numerator
// stations (Part 3), "Rationalize and simplify" exact boxes (Practice 2) and the "Make the h cancel" task.
// Exact arithmetic (rationals, surd sums, the V8 judge) comes from toolkit/courses/mcv4u.js (MV.mcv).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
var X = MV.mcv, Q = X.Q, S = X.S;
function m(s){ return MV.m(s); }
function md(h){ return MV.md(h); }
function fx(v, dp){ if (!isFinite(v)) return "undefined"; var s = Math.abs(v).toFixed(dp); return (v < 0 && +s !== 0 ? MINUS : "") + s; }
function close(a, b){ return isFinite(a) && isFinite(b) && Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)); }
function hNum(h){ return String(h).replace("-", MINUS); }

// ---------- pieces: g·(sum of terms), so (1 + √2) can act as one term ----------
function P(list, g){ return { s:S.of(list), g:g || 1 }; }
function pv(p){ return p.g < 0 ? S.neg(p.s) : p.s; }
function sumP(ps){ return ps.reduce(function(a, p){ return S.add(a, pv(p)); }, []); }
function body(p){ return p.s.length > 1 ? "(" + S.src(p.s) + ")" : S.src(p.s); }
function pSrc(ps){ return ps.map(function(p, i){ return (i === 0 ? (p.g < 0 ? "-" : "") : (p.g < 0 ? " - " : " + ")) + body(p); }).join(""); }
function wrap(ps){ var s = pSrc(ps); return ps.length > 1 || ps[0].s.length > 1 || ps[0].g < 0 ? "(" + s + ")" : s; }
function prodSrc(a, b){ var A = wrap(a), B = wrap(b); return A[0] !== "(" && B[0] !== "(" ? A + " · " + B : A + B; }
function piecesOf(A){ return A.map(function(t){ return { s:[{ c:Q.abs(t.c), r:t.r, k:t.k }], g:t.c.n < 0 ? -1 : 1 }; }); }
function joinS(list){ return list.map(function(A, i){ var s = S.src(A); if (A.length > 1 && i) s = "(" + s + ")"; return i === 0 ? s : s[0] === "-" ? " - " + s.slice(1) : " + " + s; }).join(""); }
function radList(A){ return A.filter(function(t){ return t.k > 1; }).map(function(t){ return "`√" + t.r + "`"; }).join(" and "); }

// @component areaTiles — area model of a product of two sums (2 × 2, 2 × 1, 1 × 1) with middle tiles that cancel or double
// T ={rows:[m src], cols:[m src], cells:[[{src, rad}]], comb:"cancel"|"double"|null, merged:src}. Rational tiles are
// outlined in --ink-2, radical tiles filled --hi-soft; the two middle tiles slide together and cancel (or double and stay).
function tileSrc(t, first){
  if (first) return S.src(t);
  if (t.length > 1) return t[0].c.n < 0 ? "-(" + S.src(S.neg(t)) + ")" : "+(" + S.src(t) + ")";
  return S.src(t, { plusFirst:true });
}
function tilesFrom(rows, cols){
  var cells = rows.map(function(a, i){ return cols.map(function(b, j){ var t = S.mul(pv(a), pv(b)); return { S:t, src:tileSrc(t, i + j === 0), rad:!S.rational(t) }; }); });
  var comb = null, merged = null;
  if (rows.length === 2 && cols.length === 2) {
    var s = S.add(cells[0][1].S, cells[1][0].S);
    if (S.zero(s)) comb = "cancel"; else if (S.eq(cells[0][1].S, cells[1][0].S)) { comb = "double"; merged = tileSrc(s, false); }
  }
  var hd = function(p, i){ return (p.g < 0 ? "-" : (i ? "+" : "")) + body(p); };
  return { rows:rows.map(hd), cols:cols.map(hd), cells:cells, comb:comb, merged:merged };
}
function gridAria(T){
  return "Area model. Rows " + T.rows.map(function(r){ return MV.plain(m(r)); }).join(", ") + "; columns " + T.cols.map(function(c){ return MV.plain(m(c)); }).join(", ") +
    ". Tiles: " + T.cells.map(function(r){ return r.map(function(c){ return MV.plain(m(c.src)); }).join(", "); }).join(", ") + ".";
}
function gridHTML(T){
  var h = '<div class="rr-grid" style="--nc:' + T.cols.length + '" role="img" aria-label="' + MV.esc(gridAria(T)) + '"><span class="rr-corner" aria-hidden="true">×</span>' +
    T.cols.map(function(c){ return '<span class="rr-hd rr-hc">' + m(c) + "</span>"; }).join("");
  T.cells.forEach(function(row, i){
    h += '<span class="rr-hd rr-hr">' + m(T.rows[i]) + "</span>";
    row.forEach(function(c, j){ h += '<span class="rr-tile' + (c.rad ? " rad" : "") + '" data-ij="' + i + "," + j + '"><span class="rr-tv">' + m(c.src) + "</span></span>"; });
  });
  return h + "</div>";
}
// show the grid at "plain" (all tiles) or "done" (middle tiles cancelled or merged)
function gridState(grid, T, state){
  var a = grid.querySelector('[data-ij="0,1"]'), b = grid.querySelector('[data-ij="1,0"]');
  $$(".rr-tile", grid).forEach(function(t){ t.classList.remove("gone", "merged", "flash"); t.style.transform = ""; t.style.opacity = ""; });
  if (a && b) { a.querySelector(".rr-tv").innerHTML = m(T.cells[0][1].src); b.querySelector(".rr-tv").innerHTML = m(T.cells[1][0].src); }
  if (state !== "done" || !T.comb || !a) return;
  if (T.comb === "cancel") { a.classList.add("gone"); b.classList.add("gone"); }
  else { b.classList.add("gone"); a.classList.add("merged"); a.querySelector(".rr-tv").innerHTML = m(T.merged); }
}
// slide the middle tiles together, flash, then cancel (fade) or merge; reduced motion jumps to the end
function gridCombine(grid, T, done){
  var a = grid.querySelector('[data-ij="0,1"]'), b = grid.querySelector('[data-ij="1,0"]');
  var fin = function(){ gridState(grid, T, "done"); if (done) done(); };
  if (!a || !b || !T.comb || MV.reduceMotion) { fin(); return; }
  var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
  if (!ra.width) { fin(); return; }
  var cx = (ra.left + ra.right + rb.left + rb.right) / 4, cy = (ra.top + ra.bottom + rb.top + rb.bottom) / 4;
  var da = [cx - (ra.left + ra.right) / 2, cy - (ra.top + ra.bottom) / 2], db = [cx - (rb.left + rb.right) / 2, cy - (rb.top + rb.bottom) / 2];
  MV.tween({ dur:650, step:function(t){
    a.style.transform = "translate(" + (da[0] * t).toFixed(1) + "px," + (da[1] * t).toFixed(1) + "px)";
    b.style.transform = "translate(" + (db[0] * t).toFixed(1) + "px," + (db[1] * t).toFixed(1) + "px)";
  }, done:function(){
    a.classList.add("flash"); b.classList.add("flash");
    MV.wait(420, function(){
      MV.tween({ dur:380, step:function(t){
        if (T.comb === "cancel") { a.style.opacity = b.style.opacity = String(1 - t); }
        else b.style.opacity = String(1 - t);
      }, done:fin });
    });
  } });
}

// ---------- the conjugate machine's expressions ----------
var EXPS = [
  { id:"e1", num:[P([[6]])], den:[P([[1, 3]])], menu:[["rad", [P([[1, 3]])]], ["bot", [P([[1, 3]])]]] },
  { id:"e2", num:[P([[10]])], den:[P([[3, 5]])], menu:[["rad", [P([[1, 5]])]], ["rad3", [P([[3, 5]])]], ["bot", [P([[1, 5]])]]], chal:1 },
  { id:"e3", num:[P([[4]])], den:[P([[3]]), P([[1, 5]], -1)], menu:[["rad", [P([[1, 5]])]], "same", "conj", "bot"] },
  { id:"e4", num:[P([[2]])], den:[P([[1, 7]]), P([[1, 5]])], menu:[["rad", [P([[1, 7]])]], "same", "conj", "bot"] },
  { id:"e5", num:[P([[1, 3]]), P([[1]])], den:[P([[1, 3]]), P([[1]], -1)], menu:[["rad", [P([[1, 3]])]], "same", "conj", "bot"], chal:2 },
  { id:"e6", variable:true },
  { id:"two", two:true, chal:3 }
];
var EX = {}; EXPS.forEach(function(e){ EX[e.id] = e; });
function exprSrc(e){ return e.two ? "{1}/{1 + √2 + √3}" : e.variable ? "{1}/{√x + 3}" : "{" + pSrc(e.num) + "}/{" + pSrc(e.den) + "}"; }
// menu entries -> multipliers {id, kind, ps (bottom factor), top (false: bottom only), label}
function menuOf(den, spec){
  return spec.map(function(s){
    var id = Array.isArray(s) ? s[0] : s, ps;
    if (Array.isArray(s)) ps = s[1];
    else if (s === "same") ps = den;
    else ps = den.map(function(p, i){ return i === den.length - 1 ? { s:p.s, g:-p.g } : p; });
    var kind = id === "rad3" ? "rad" : id, top = id !== "bot", X1 = pSrc(ps);
    return { id:id, kind:kind, ps:ps, top:top, label:top ? m("{" + X1 + "}/{" + X1 + "}") : m(X1) + " on the bottom only" };
  });
}
var TWO = {
  A:{ chip:"(1 + √2) + √3", den:[P([[1], [1, 2]]), P([[1, 3]])] },
  B:{ chip:"1 + (√2 + √3)", den:[P([[1]]), P([[1, 2], [1, 3]])] }
};
// E6: 1/(√x + 3) with a variable, written out by hand
var E6 = {
  rows:["√x", "+3"],
  conj:{ lab:"{√x - 3}/{√x - 3}", cols:["√x", "-3"], cells:[["x", "-3√x"], ["+3√x", "-9"]], comb:"cancel", N:"√x - 3", D:"x - 9", Dline:"(√x + 3)(√x - 3) = x - 9", rat:true, simp:"{√x - 3}/{x - 9}", f:function(x){ return (Math.sqrt(x) - 3) / (x - 9); } },
  same:{ lab:"{√x + 3}/{√x + 3}", cols:["√x", "+3"], cells:[["x", "+3√x"], ["+3√x", "+9"]], comb:"double", merged:"+6√x", N:"√x + 3", D:"x + 6√x + 9", Dline:"(√x + 3)^2 = x + 6√x + 9", rat:false, f:function(x){ return (Math.sqrt(x) + 3) / (x + 6 * Math.sqrt(x) + 9); } },
  rad:{ lab:"{√x}/{√x}", cols:["√x"], cells:[["x"], ["+3√x"]], comb:null, N:"√x", D:"x + 3√x", Dline:"(√x + 3)√x = x + 3√x", rat:false, f:function(x){ return x === 0 ? NaN : Math.sqrt(x) / (x + 3 * Math.sqrt(x)); } },
  bot:{ lab:"√x - 3", cols:["√x", "-3"], cells:[["x", "-3√x"], ["+3√x", "-9"]], comb:"cancel", N:"1", D:"x - 9", Dline:"(√x + 3)(√x - 3) = x - 9", rat:true, simp:"{1}/{x - 9}", f:function(x){ return 1 / (x - 9); } },
  order:["rad", "same", "conj", "bot"]
};
function e6v0(x){ return 1 / (Math.sqrt(x) + 3); }

// ---------- machine state -> model R ----------
var ST = null;
function multOf(e){ return ST.mu ? menuOf(e.den, e.menu).filter(function(u){ return u.id === ST.mu; })[0] || null : null; }
function hidden(e, R){ return e.chal && R.rational && R.same && !(MV.S.chal["tc" + e.chal] || {}).solved; }
function stdStage(numPs, denPs, mu, numS, denS){
  // one multiplication: returns {N1, D1, tiles, nLine (top), dLine (bottom), steps}
  var M = sumP(mu.ps), N1 = mu.top ? S.mul(numS, M) : numS, D1 = S.mul(denS, M), T = tilesFrom(denPs, mu.ps);
  var flat = []; T.cells.forEach(function(r){ r.forEach(function(c){ flat.push(c.S); }); });
  var dShort;
  if (T.comb === "cancel") dShort = joinS([T.cells[0][0].S, T.cells[1][1].S]) + " = " + S.src(D1);
  else if (mu.kind === "same") dShort = wrap(denPs) + "^2 = " + S.src(D1);
  else dShort = prodSrc(denPs, mu.ps) + " = " + S.src(D1);
  var numFlat = []; if (mu.top) numPs.forEach(function(a){ mu.ps.forEach(function(b){ numFlat.push(S.mul(pv(a), pv(b))); }); });
  var topLine = mu.top ? prodSrc(numPs, mu.ps) + (numFlat.length > 2 ? " = " + joinS(numFlat) : "") + " = " + S.src(N1) : null;
  var botLine = prodSrc(denPs, mu.ps) + (flat.length > 1 ? " = " + joinS(flat) : "") + " = " + S.src(D1);
  return { N1:N1, D1:D1, T:T, dShort:dShort, topLine:topLine, botLine:botLine };
}
function multCell(mu){ return mu.top ? mu.label + ' <span class="muted">= 1</span>' : mu.label + ' <span class="muted">(≠ 1)</span>'; }
function model(){
  var e = EX[ST.e] || EX.e3, R = { e:e, src:exprSrc(e), rows:[], steps:[], note:"", tiles:null, v1:null, rational:null, same:null, simp:null };
  if (e.variable) return modelE6(e, R);
  if (e.two) return modelTwo(e, R);
  var N0 = sumP(e.num), D0 = sumP(e.den), mu = multOf(e);
  R.v0 = S.val(N0) / S.val(D0); R.menus = [{ name:"rr-mu", title:"Multiplier", list:menuOf(e.den, e.menu), sel:ST.mu }];
  R.cap = m(R.src);
  R.rows.push(["Expression", m(R.src)], ["Multiplier", mu ? multCell(mu) : '<span class="muted">Choose one</span>']);
  if (!mu) return finishR(R);
  var st = stdStage(e.num, e.den, mu, N0, D0);
  R.mu = mu; R.kind = mu.kind; R.tiles = st.T; R.N1 = st.N1; R.D1 = st.D1;
  R.v1 = S.val(st.N1) / S.val(st.D1); R.rational = S.rational(st.D1); R.same = close(R.v1, R.v0);
  R.simp = R.rational ? S.fracSrc(st.N1, st.D1) : null;
  R.cap = mu.top ? m(R.src + " × {" + pSrc(mu.ps) + "}/{" + pSrc(mu.ps) + "}") : m(R.src) + ' <span class="rr-capn">with ' + m(pSrc(mu.ps)) + " on the bottom only</span>";
  R.nRow = mu.top ? m(S.src(st.N1)) : m(S.src(N0)) + ' <span class="muted">(unchanged)</span>';
  R.dRow = m(st.dShort);
  var X1 = pSrc(mu.ps);
  R.steps.push([mu.top ? "Multiply by a form of 1" : "Multiply the bottom only", mu.top ? m(R.src + " × {" + X1 + "}/{" + X1 + "}") : m("{" + pSrc(e.num) + "}/{" + prodSrc(e.den, mu.ps) + "}")]);
  R.steps.push(["Top", mu.top ? m(st.topLine) : m(S.src(N0)) + " (unchanged)"]);
  R.steps.push(["Bottom", m(st.botLine)]);
  var hide = hidden(e, R);
  if (R.rational && R.same) {
    var lhs = (e.num.length === 1 && e.num[0].s.length === 1 && S.rational(e.num[0].s) && mu.kind === "conj") ? "{" + pSrc(e.num) + wrap(mu.ps) + "}/{" + joinS([st.T.cells[0][0].S, st.T.cells[1][1].S]) + "}" : "{" + S.src(st.N1) + "}/{" + S.src(st.D1) + "}";
    R.steps.push(["Simplify", hide ? m(lhs) + ' <span class="muted">= ? Simplify it yourself in the boxes (challenge ' + e.chal + ").</span>" : m(lhs + " = " + R.simp)]);
  } else if (R.rational) R.steps.push(["Simplify", m("{" + S.src(N0) + "}/{" + S.src(st.D1) + "} = " + R.simp) + " The value changed: " + fx(R.v0, 4) + " became " + fx(R.v1, 4) + "."]);
  else R.steps.push(["Result", "A root is still in the denominator: " + m("{" + S.src(st.N1) + "}/{" + S.src(st.D1) + "}")]);
  R.note = trapNote(mu, R, e.den, st.D1, mu.ps.length === 1 && e.den.length === 1 ? m(pSrc(mu.ps)) : "the conjugate");
  R.hide = hide;
  return finishR(R);
}
function trapNote(mu, R, denPs, D1, what){
  if (mu.kind === "same") return md("The middle terms double instead of cancelling: `" + wrap(denPs) + "^2 = " + S.src(D1) + "` still has " + radList(D1) + ".");
  if (mu.kind === "bot" && !R.same) return "The value changed from " + num(R.v0, 2) + " to " + num(R.v1, 2) + " (" + what + " went on the bottom only). Multiply the top as well.";
  if (mu.kind === "rad" && !R.rational) return md("`{" + pSrc(mu.ps) + "}/{" + pSrc(mu.ps) + "}` keeps the value, but `" + S.src(D1) + "` still has " + radList(D1) + ". A binomial needs its conjugate.");
  if (R.rational && R.same) return "Same value, and no radical in the denominator ✓";
  return "";
}
function finishR(R){
  R.rows.push(["New numerator", R.nRow || '<span class="muted">—</span>'], ["New denominator", R.dRow || '<span class="muted">—</span>'],
    ["Radical left in denominator?", R.rational == null ? '<span class="muted">—</span>' : R.rational ? '<span class="rr-ok">No ✓</span>' : '<span class="rr-no">Yes ✗</span>'],
    ["Value before / after", fx(R.v0, 4) + " / " + (R.v1 == null ? '<span class="muted">—</span>' : fx(R.v1, 4) + (isFinite(R.v1) ? (R.same ? ' · <span class="rr-ok">Same value ✓</span>' : ' · <span class="rr-no">Value changed ✗</span>') : ""))],
    ["Simplified form", R.v1 == null ? '<span class="muted">—</span>' : !R.rational ? '<span class="muted">— (a root is still in the denominator)</span>' : R.hide ? '<span class="muted">Write it yourself in the boxes (challenge ' + R.e.chal + ").</span>" : m(R.simp) + (R.same ? "" : ' <span class="muted">(but the value changed)</span>')]);
  return R;
}
function modelE6(e, R){
  var x = ST.x, mu = ST.mu && E6[ST.mu] ? ST.mu : null, d = mu ? E6[mu] : null;
  R.v0 = e6v0(x);
  R.menus = [{ name:"rr-mu", title:"Multiplier", list:E6.order.map(function(id){ return { id:id, kind:id, top:id !== "bot", label:id === "bot" ? m(E6.bot.lab) + " on the bottom only" : m(E6[id].lab) }; }), sel:mu }];
  R.cap = m(R.src) + ' <span class="rr-capn">at ' + m("x = " + x) + "</span>";
  R.rows.push(["Expression", m(R.src) + ", " + m("x ≥ 0") + ", " + m("x ≠ 9")], ["Multiplier", d ? (mu === "bot" ? m(d.lab) + ' on the bottom only <span class="muted">(≠ 1)</span>' : m(d.lab) + ' <span class="muted">= 1</span>') : '<span class="muted">Choose one</span>']);
  if (!d) return finishR(R);
  R.kind = mu; R.mu = { kind:mu, top:mu !== "bot" };
  R.tiles = { rows:E6.rows, cols:d.cols, cells:d.cells.map(function(r){ return r.map(function(s){ return { src:s, rad:s.indexOf("√") >= 0 }; }); }), comb:d.comb, merged:d.merged };
  R.v1 = d.f(x); R.rational = d.rat; R.same = close(R.v1, R.v0); R.simp = d.simp || null;
  if (mu !== "bot") R.cap = m(R.src + " × " + d.lab) + ' <span class="rr-capn">at ' + m("x = " + x) + "</span>";
  R.nRow = mu === "bot" ? m("1") + ' <span class="muted">(unchanged)</span>' : m(d.N);
  R.dRow = m(d.Dline);
  R.steps.push([mu === "bot" ? "Multiply the bottom only" : "Multiply by a form of 1", mu === "bot" ? m("{1}/{(√x + 3)(√x - 3)}") : m(R.src + " × " + d.lab)]);
  R.steps.push(["Top", mu === "bot" ? m("1") + " (unchanged)" : m("1 · " + (mu === "rad" ? "√x" : "(" + d.N + ")") + " = " + d.N)]);
  R.steps.push(["Bottom", m(d.Dline)]);
  if (d.rat && mu !== "bot") R.steps.push(["Result", m(R.src + " = " + d.simp) + ", for " + m("x ≠ 9")]);
  else if (mu === "bot") R.steps.push(["Result", m("{1}/{x - 9}") + (R.same ? " At " + m("x = 16") + " the factor " + m("√x - 3") + " happens to equal 1." : " The value changed.")]);
  else R.steps.push(["Result", "A root is still in the denominator: " + m("{" + d.N + "}/{" + d.D + "}")]);
  if (mu === "same") R.note = md("The middle terms double instead of cancelling: `(√x + 3)^2 = x + 6√x + 9` still has `√x`.");
  else if (mu === "bot") R.note = R.same ? md("At `x = 16`, `√x - 3 = 1`, so the value happens to stay. Move the slider: the bottom-only multiplier changes the value.") : "The value changed from " + num(R.v0, 2) + " to " + (isFinite(R.v1) ? num(R.v1, 2) : "undefined") + " (the conjugate went on the bottom only). Multiply the top as well.";
  else if (mu === "rad") R.note = isFinite(R.v1) ? md("`{√x}/{√x}` keeps the value, but `x + 3√x` still has `√x`. A binomial needs its conjugate.") : md("At `x = 0`, `{√x}/{√x}` is 0/0, so it isn’t a form of 1 there.");
  else R.note = "Same value, and no radical in the denominator ✓";
  return finishR(R);
}
function modelTwo(e, R){
  var T2 = ST.two, G = TWO[T2.g], N0 = S.of([[1]]), D0 = S.of([[1], [1, 2], [1, 3]]);
  R.v0 = S.val(N0) / S.val(D0); R.cap = m(R.src); R.menus = [];
  R.rows.push(["Expression", m(R.src)], ["Grouping", G ? m(G.chip) : '<span class="muted">Choose one</span>']);
  if (!G) { R.rows.push(["Stage 1 multiplier", '<span class="muted">—</span>']); return finishR(R); }
  var l1 = menuOf(G.den, ["same", "conj", "bot"]), m1 = l1.filter(function(u){ return u.id === T2.m1; })[0] || null;
  R.menus.push({ name:"rr-m1", title:"Stage 1 multiplier", list:l1, sel:T2.m1 });
  R.rows.push(["Stage 1 multiplier", m1 ? multCell(m1) : '<span class="muted">Choose one</span>']);
  if (!m1) return finishR(R);
  var s1 = stdStage(e.num || [P([[1]])], G.den, m1, N0, D0), cur = s1, mu = m1, numPs = [P([[1]])];
  R.steps.push(["Stage 1: " + (m1.top ? "multiply by a form of 1" : "multiply the bottom only"), m1.top ? m(R.src + " × {" + pSrc(m1.ps) + "}/{" + pSrc(m1.ps) + "}") : m("{1}/{" + prodSrc(G.den, m1.ps) + "}")]);
  R.steps.push(["Top", m1.top ? m(s1.topLine) : m("1") + " (unchanged)"], ["Bottom", m(s1.botLine)]);
  var m2 = null;
  if (s1.D1.length <= 2 && !S.rational(s1.D1)) {
    var den2 = piecesOf(s1.D1), spec2 = s1.D1.length === 1 ? [["rad", [P([[1, s1.D1[0].r]])]], ["rad3", [P([[Q.abs(s1.D1[0].c), s1.D1[0].r]])]], ["bot", [P([[1, s1.D1[0].r]])]]] : ["same", "conj", "bot"];
    var l2 = menuOf(den2, spec2); m2 = l2.filter(function(u){ return u.id === T2.m2; })[0] || null;
    R.menus.push({ name:"rr-m2", title:"Stage 2 multiplier (for the new denominator " + m(S.src(s1.D1)) + ")", list:l2, sel:T2.m2 });
    R.rows.push(["Stage 2 multiplier", m2 ? multCell(m2) : '<span class="muted">Choose one</span>']);
    if (m2) {
      var s2 = stdStage(piecesOf(s1.N1), den2, m2, s1.N1, s1.D1); cur = s2; mu = m2;
      R.steps.push(["Stage 2: " + (m2.top ? "multiply by a form of 1" : "multiply the bottom only"), m2.top ? m("{" + S.src(s1.N1) + "}/{" + S.src(s1.D1) + "} × {" + pSrc(m2.ps) + "}/{" + pSrc(m2.ps) + "}") : m("{" + S.src(s1.N1) + "}/{" + prodSrc(den2, m2.ps) + "}")]);
      R.steps.push(["Top", m2.top ? m(s2.topLine) : m(S.src(s1.N1)) + " (unchanged)"], ["Bottom", m(s2.botLine)]);
    }
  }
  R.mu = mu; R.kind = mu.kind; R.tiles = cur.T; R.N1 = cur.N1; R.D1 = cur.D1;
  R.v1 = S.val(cur.N1) / S.val(cur.D1); R.rational = S.rational(cur.D1); R.same = close(R.v1, R.v0);
  R.simp = R.rational ? S.fracSrc(cur.N1, cur.D1) : null;
  R.nRow = m(S.src(cur.N1)); R.dRow = m(cur.dShort);
  R.hide = hidden(e, R);
  if (R.rational) R.steps.push(["Simplify", R.hide ? m("{" + S.src(cur.N1) + "}/{" + S.src(cur.D1) + "}") + ' <span class="muted">= ? Simplify it yourself in the boxes (challenge 3).</span>' : m("{" + S.src(cur.N1) + "}/{" + S.src(cur.D1) + "} = " + R.simp) + (R.same ? "" : " The value changed.")]);
  if (mu.kind === "same") R.note = "The middle terms double instead of cancelling: the denominator gets longer and keeps its radicals. Clear the multiplier and try another.";
  else if (!R.same) R.note = "The value changed from " + num(R.v0, 2) + " to " + num(R.v1, 2) + " (a multiplier went on the bottom only). Multiply the top as well.";
  else if (!R.rational && m1 && !m2) { R.note = md("Stage 1 done: the denominator is now `" + S.src(s1.D1) + "`. One more stage."); R.noteKind = ""; }
  else if (R.rational) R.note = "Same value, and no radical in the denominator ✓";
  return finishR(R);
}

// ---------- number-line range for an expression (fixed while you change multipliers) ----------
function nlRange(e){
  var vals = [];
  if (e.variable) { for (var x = 0; x <= 16; x++) if (x !== 9) { vals.push(e6v0(x)); E6.order.forEach(function(k){ var v = E6[k].f(x); if (isFinite(v)) vals.push(v); }); } }
  else if (e.two) vals = [-0.25, 0.5];
  else { var N0 = sumP(e.num), D0 = sumP(e.den); vals.push(S.val(N0) / S.val(D0)); menuOf(e.den, e.menu).forEach(function(u){ var M = sumP(u.ps); vals.push(S.val(u.top ? S.mul(N0, M) : N0) / S.val(S.mul(D0, M))); }); }
  var lo = Math.min(0, Math.min.apply(null, vals)), hi = Math.max.apply(null, vals), step = MV.niceStep((hi - lo) / 5 || 1);
  lo = Math.floor(lo / step + 1e-9) * step; hi = Math.ceil(hi / step - 1e-9) * step;
  if (hi - Math.max.apply(null, vals) < step * 0.15) hi += step;
  return { min:lo, max:hi, step:step };
}

// @component V8 exactBox — structured exact answer "□√□ + … over □ + □√□" (judge: MV.mcv.exact.judge in toolkit/courses/mcv4u.js)
// Numerator terms (up to o.maxNum) over denominator terms (up to o.maxDen); each term = a box in front (blank = 1, "−" = −1,
// fractions such as 2/3) and a box under the root (blank = no root). o.cube adds a √/∛ switch per term.
// read() -> {num:[{c:{n, d}, r, k}], den:[…]} as typed, or {err}. Judge with MV.mcv.exact.judge.
function exactBox(host, o){
  var st = o.st;
  if (!st.num) { st.num = [{ c:"", r:"", k:2 }]; st.den = [{ c:"", r:"", k:2 }]; }
  var maxN = o.maxNum || 3, maxD = o.maxDen || 2, dis = false;
  function termHTML(row, i, t){
    var id = o.key + row + i, lab = (row === "num" ? "Top" : "Bottom") + " term " + (i + 1);
    return (i ? '<span class="rr-xp" aria-hidden="true">+</span>' : "") + '<span class="rr-xt">' +
      '<input class="rr-xc" data-row="' + row + '" data-i="' + i + '" data-f="c" data-k="' + id + 'c" type="text" inputmode="text" autocomplete="off" spellcheck="false" value="' + MV.esc(t.c) + '" aria-label="' + lab + ': number in front"' + (dis ? " disabled" : "") + ">" +
      (o.cube ? '<button type="button" class="rr-xk" data-row="' + row + '" data-i="' + i + '" data-root="1" data-k="' + id + 'k" aria-label="' + lab + ": " + (t.k === 3 ? "cube root" : "square root") + '. Press to switch."' + (dis ? " disabled" : "") + ">" + (t.k === 3 ? "∛" : "√") + "</button>" : '<span class="rr-xs" aria-hidden="true">√</span>') +
      '<input class="rr-xr" data-row="' + row + '" data-i="' + i + '" data-f="r" data-k="' + id + 'r" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" value="' + MV.esc(t.r) + '" aria-label="' + lab + ': number under the root (leave empty for no root)"' + (dis ? " disabled" : "") + "></span>";
  }
  function rowHTML(row){
    var list = st[row], max = row === "num" ? maxN : maxD;
    return '<div class="rr-xrow" role="group" aria-label="' + (row === "num" ? "Top (numerator)" : "Bottom (denominator)") + '">' + list.map(function(t, i){ return termHTML(row, i, t); }).join("") + "</div>" +
      (dis ? "" : '<span class="rr-xbtns"><button type="button" class="btn ghost sm" data-add="' + row + '" data-k="' + o.key + row + 'add"' + (list.length >= max ? " disabled" : "") + ">+ term</button>" +
      '<button type="button" class="btn ghost sm" data-del="' + row + '" data-k="' + o.key + row + 'del"' + (list.length <= 1 ? " disabled" : "") + ">− term</button></span>");
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<div class="rr-xb"><div class="rr-xn">' + rowHTML("num") + '</div><div class="rr-xbar" aria-hidden="true"></div><div class="rr-xd">' + rowHTML("den") + "</div></div>"; }); }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.f) return; st[t.dataset.row][+t.dataset.i][t.dataset.f] = t.value; if (o.onChange) o.onChange(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || dis) return;
    if (b.dataset.add) { st[b.dataset.add].push({ c:"", r:"", k:2 }); paint(); var ins = $$('.rr-x' + (b.dataset.add === "num" ? "n" : "d") + " .rr-xc", host); if (ins.length) ins[ins.length - 1].focus(); }
    else if (b.dataset.del) { st[b.dataset.del].pop(); paint(); }
    else if (b.dataset.root) { var t = st[b.dataset.row][+b.dataset.i]; t.k = t.k === 3 ? 2 : 3; paint(); }
    else return;
    if (o.onChange) o.onChange();
  });
  function readRow(list){
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var cs = String(list[i].c || "").trim(), rs = String(list[i].r || "").trim(), r = 1, c;
      if (!cs && !rs) continue;
      if (rs) { if (!/^\d+$/.test(rs) || +rs < 1) return { err:"The number under a root must be a whole number, 1 or more." }; r = +rs; }
      c = cs ? Q.raw(cs) : { n:1, d:1 };
      if (!c) return { err:"Use whole numbers or fractions such as 2/3 in the boxes (no decimals)." };
      out.push({ c:c, r:r, k:rs ? (list[i].k === 3 ? 3 : 2) : 1 });
    }
    return out;
  }
  paint();
  return {
    read:function(){
      var n = readRow(st.num), d = readRow(st.den);
      if (n.err) return n; if (d.err) return d;
      if (!n.length) return { err:"Fill in the top first." };
      if (!d.length) d = [{ c:{ n:1, d:1 }, r:1, k:1 }];
      return { num:n, den:d };
    },
    disable:function(v){ dis = v; paint(); }
  };
}
function targetOf(str){ var p = S.parse(str); return { num:S.fromRaw(p.num), den:S.fromRaw(p.den) }; }
function namedWrong(list, entry, target){
  var tv = S.val(target.num) / S.val(target.den), ev = X.exact.value(entry);
  for (var i = 0; i < (list || []).length; i++) {
    var w = list[i];
    if (w.form) { var p = S.parse(w.form), wv = X.exact.value(p); if (close(ev, wv) && (!close(wv, tv) || X.exact.same(entry, p))) return w.fb; }
    if (w.denLike && close(ev, tv)) {
      var D = S.fromRaw(S.parse(w.denLike).num), E = S.fromRaw(entry.den), q = Q.of(S.val(E) / S.val(D));
      if (q && !S.rational(E) && S.eq(S.scale(D, q), E)) return w.fb;
    }
  }
  return null;
}
// judge a surd-frame entry against a target string; -> {ok, msg, err}
function judgeSurd(entry, ansStr, wrongs){
  if (entry.err) return { err:entry.err };
  var target = targetOf(ansStr), nw = namedWrong(wrongs, entry, target);
  if (nw) return { ok:false, msg:nw };
  var j = X.exact.judge(entry, target);
  if (j.issue === "zero") return { err:j.msg };
  if (j.equal && j.simplified) return { ok:true };
  if (j.equal) return { ok:false, msg:j.msg };
  var tv = S.val(target.num) / S.val(target.den);
  return { ok:false, msg:"Your form is about " + fx(j.value, 4) + ", but the expression is about " + fx(tv, 4) + ". Check the multiplying, then try again.", value:j.value };
}

// ---------- hero storyboard ----------
function hero(f){
  var hx = $("#rr-hx"), hg = $("#rr-hg"), hs = $("#rr-hs"), cv = $("#rr-hnl"); if (!hx || !cv) return;
  var V = 4 / (3 - Math.sqrt(5)), T = tilesFrom([P([[3]]), P([[1, 5]], -1)], [P([[3]]), P([[1, 5]])]);
  var nl = new MV.Plot(cv, { xmin:0, xmax:6, ymin:-1, ymax:1 });
  nl.render = function(){ nl.draw({ numberLine:{ min:0, max:6, step:1, dots:[{ x:V, closed:true }], marks:[{ x:V, label:"≈ 5.24" }] } }); };
  nl.render();
  var e0 = m("{4}/{3 - √5}");
  function cap(t){ if (f.cap) f.cap.textContent = t; }
  function final(){
    hx.innerHTML = e0 + " " + m("= 3 + √5");
    hg.innerHTML = gridHTML(T); gridState($(".rr-grid", hg), T, "done"); hg.classList.add("on");
    hs.innerHTML = m("9 - 5 = 4") + ' <span class="rr-hsn">(the middle tiles cancelled)</span>'; hs.classList.add("on");
    cap("The dot never moved: the value is ≈ 5.24 in every form.");
  }
  if (MV.reduceMotion) { final(); return; }
  hx.innerHTML = e0; cap("4/(3 − √5) ≈ 5.24");
  hg.innerHTML = gridHTML(T); hs.innerHTML = "&nbsp;";
  MV.wait(1000, function(){
    hx.innerHTML = e0 + ' <span class="rr-slide">' + m("× {3 + √5}/{3 + √5}") + "</span>";
    MV.wait(60, function(){ var s = $(".rr-slide", hx); if (s) s.classList.add("in"); });
    MV.wait(1300, function(){
      hg.classList.add("on");
      hs.innerHTML = '<span class="rr-hsn">Denominator: (3 − √5)(3 + √5)</span>'; hs.classList.add("on");
      MV.wait(1500, function(){
        gridCombine($(".rr-grid", hg), T, function(){
          hs.innerHTML = m("9 - 5 = 4") + ' <span class="rr-hsn">(the middle tiles cancelled)</span>';
          MV.wait(1200, function(){
            hx.innerHTML = e0 + " " + m("= {4(3 + √5)}/{4}");
            MV.wait(1500, function(){ final(); });
          });
        });
      });
    });
  });
}

// ---------- Explore: the conjugate machine ----------
var EXP = {};
function explore(host, api){
  ST = api.S;
  if (!EX[ST.e]) ST.e = "e3";
  if (ST.mu === undefined) ST.mu = ST.e === "e3" ? "conj" : null;   // first visit: the plan's readout example (E3 with the conjugate)
  ST.view = ST.view || "area"; ST.x = ST.x == null ? 4 : ST.x; ST.two = ST.two || { g:null, m1:null, m2:null };
  ST.entry = ST.entry || {}; ST.notes = ST.notes || {};
  host.innerHTML = '<div class="pg rr-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap rr-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="rr-vseg"></div><div class="rr-vw" data-v="area"></div>' +
    '<div class="rr-vw" data-v="nl" hidden><div class="plot-wrap"><canvas class="plot nl rr-nlc" role="img" aria-label="Number line"></canvas></div><p class="tiny muted rr-nlkey">Hollow ring: the value of the original expression. Filled dot: the value of the current form.</p></div>' +
    '<div class="rr-vw" data-v="steps" hidden></div><p class="rr-note" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><p class="rr-lab">Expression</p><div class="chips rr-exs" role="group" aria-label="Expression"></div><div class="rr-two"></div><div class="rr-sl"></div><div class="rr-menus"></div>' +
    '<div class="q-actions rr-clr"><button type="button" class="btn ghost sm" data-clear="1" data-k="rrclear">Clear the multiplier</button></div><div class="rr-fin"></div></div>' +
    '<div class="pg-read"><dl class="read rr-read" aria-live="polite"></dl></div></div>';
  var E = { cap:$(".rr-cap", host), exs:$(".rr-exs", host), two:$(".rr-two", host), menus:$(".rr-menus", host), sl:$(".rr-sl", host), fin:$(".rr-fin", host),
    read:$(".rr-read", host), note:$(".rr-note", host), area:$('[data-v="area"]', host), nl:$('[data-v="nl"]', host), steps:$('[data-v="steps"]', host), clr:$(".rr-clr", host) };
  EXP.E = E; EXP.api = api;
  var R = null, tok = 0, dotX = null, finKey = null, slKey = null;
  var nlp = new MV.Plot($(".rr-nlc", host), { xmin:0, xmax:6, ymin:-1, ymax:1 });
  nlp.render = function(){
    if (!R) return;
    var rg = nlRange(R.e), cur = R.v1 == null ? R.v0 : R.v1, dots = [{ x:R.v0, closed:false, r:11, color:css("--ink-2") }], marks = [];
    var dx = dotX == null ? cur : dotX;
    if (isFinite(dx)) dots.push({ x:Math.max(rg.min, Math.min(rg.max, dx)), closed:true, color:css("--pen") });
    if (R.v1 == null || close(R.v1, R.v0)) marks.push({ x:R.v0, label:"≈ " + num(R.v0, 2) });
    else { marks.push({ x:R.v0, label:"before ≈ " + num(R.v0, 2), color:css("--ink-2") }); if (isFinite(R.v1)) marks.push({ x:R.v1, label:"after ≈ " + num(R.v1, 2) }); }
    nlp.draw({ numberLine:{ min:rg.min, max:rg.max, step:rg.step, dots:dots, marks:marks, y:0.62 },
      describe:"Number line. The original value, about " + num(R.v0, 3) + ", is a hollow ring." + (R.v1 == null ? "" : isFinite(R.v1) ? " The current form’s value, about " + num(R.v1, 3) + (close(R.v1, R.v0) ? ", sits on the ring: same value." : ", is a filled dot away from the ring: the value changed.") : " The current form is undefined here.") });
  };
  var vseg = MV.seg($(".rr-vseg", host), { label:"View", options:[{ id:"area", t:"Area model" }, { id:"nl", t:"Number line" }, { id:"steps", t:"Steps" }], value:ST.view, onChange:function(v){ ST.view = v; api.save(); tok++; paintView(false); } });
  EXP.seg = function(v){ ST.view = v; vseg.set(v); };

  function paintCtl(){
    MV.keepFocus(E.exs, function(){ E.exs.innerHTML = EXPS.map(function(e){ var on = ST.e === e.id; return '<button type="button" class="fchip' + (e.two ? " rr-twochip" : "") + '" data-ex="' + e.id + '" data-k="ex' + e.id + '" aria-pressed="' + on + '">' + (e.two ? "Two-stage" : m(exprSrc(e))) + "</button>"; }).join(""); });
    MV.keepFocus(E.two, function(){
      E.two.innerHTML = R.e.two ? '<p class="rr-lab">Group the denominator</p><div class="chips" role="group" aria-label="Grouping">' + ["A", "B"].map(function(g){ return '<button type="button" class="chip" data-g="' + g + '" data-k="g' + g + '" aria-pressed="' + (ST.two.g === g) + '">' + m(TWO[g].chip) + "</button>"; }).join("") + "</div>" : "";
    });
    MV.keepFocus(E.menus, function(){
      E.menus.innerHTML = (R.menus || []).map(function(mn){
        return '<fieldset class="rr-menu"><legend>' + mn.title + "</legend>" + mn.list.map(function(u){ var on = mn.sel === u.id; return '<label class="rr-mi' + (on ? " on" : "") + '"><input type="radio" name="' + mn.name + '" value="' + u.id + '" data-k="' + mn.name + u.id + '"' + (on ? " checked" : "") + "><span>" + u.label + "</span></label>"; }).join("") + "</fieldset>";
      }).join("");
    });
    var key = R.e.variable ? "x" : "";
    if (key !== slKey) {
      slKey = key; E.sl.innerHTML = "";
      if (key) { var d = document.createElement("div"); E.sl.appendChild(d); MV.sliders(d, [{ id:"x", label:m("x"), min:0, max:16, step:1, value:ST.x, skip:[9], note:"9 is skipped: there the conjugate is 0." }], function(id, v){ ST.x = v; api.save(); dotX = null; paint(false); }); }
    }
    var b = $("button", E.clr); b.disabled = R.e.two ? !(ST.two.m1 || ST.two.m2) : !ST.mu;
  }
  function paintFin(){
    var key = R.e.chal ? R.e.id : "";
    if (key === finKey) return; finKey = key;
    if (!key) { E.fin.innerHTML = ""; EXP.box = null; return; }
    E.fin.innerHTML = '<div class="rr-finbox"><p class="rr-lab">Your simplified form (challenge ' + R.e.chal + ")</p><div class=\"rr-finin\"></div></div>";
    var inn = $(".rr-finin", E.fin), est = ST.entry[key] || (ST.entry[key] = {});
    if (key === "e5") {
      inn.innerHTML = '<div class="rr-ab">' + '<input type="text" inputmode="text" class="rr-xc" data-ab="a" data-k="aba" aria-label="a, the whole-number part" value="' + MV.esc(est.a || "") + '">' + m("+") + '<input type="text" inputmode="text" class="rr-xc" data-ab="b" data-k="abb" aria-label="b, the number in front of root 3" value="' + MV.esc(est.b || "") + '">' + m("√3") + "</div>";
      inn.addEventListener("input", function(e){ var a = e.target.dataset.ab; if (!a) return; est[a] = e.target.value; api.save(); MV.changed(); });
      EXP.box = null;
    } else {
      EXP.box = exactBox(inn, { key:"x" + key, st:est, maxNum:3, maxDen:2, onChange:function(){ api.save(); MV.changed(); } });
      inn.insertAdjacentHTML("afterend", '<p class="tiny muted rr-finhow">An empty box in front of √ counts as 1 (type − for −1). Leave the box after √ empty for a plain number. Fractions such as 2/3 are fine.</p>');
    }
  }
  function paintRead(){
    E.read.innerHTML = MV.readoutHTML(R.rows);
    E.note.innerHTML = R.note || "";
    var kind = R.noteKind != null ? R.noteKind : R.note ? (/✓$/.test(R.note) ? "good" : "bad") : "";
    E.note.className = "rr-note" + (kind ? " " + kind : "");
    E.cap.innerHTML = R.cap;
  }
  function paintView(auto, fromV){
    $$(".rr-vw", host).forEach(function(v){ v.hidden = v.dataset.v !== ST.view; });
    EXP.areaPl = EXP.stepPl = null;
    var my = ++tok;
    // area
    if (!R.tiles) E.area.innerHTML = '<p class="muted rr-empty">Choose a multiplier to see the denominator multiplied out as an area model.</p>';
    else {
      var T = R.tiles, n = T.comb ? 3 : 2, labs = T.comb ? ["Multiply each term by each term", "Combine the middle tiles", "The new denominator"] : ["Multiply", "The new denominator"], at = 0;
      E.area.innerHTML = '<div class="rr-area">' + gridHTML(T) + '<p class="rr-sum" aria-live="polite"></p></div><div class="rr-pl"></div>';
      var grid = $(".rr-grid", E.area), sum = $(".rr-sum", E.area);
      var sumAt = function(i){
        if (i === n - 1) return "New denominator: " + R.dRow + (R.rational ? ' <span class="rr-ok">no radical ✓</span>' : ' <span class="rr-no">a radical is left ✗</span>') +
          (T.comb === "cancel" ? ' <span class="rr-hsn">(the middle terms cancelled)</span>' : T.comb === "double" ? ' <span class="rr-hsn">(the middle terms doubled)</span>' : "");
        if (i === 1 && T.comb === "cancel") return "The middle tiles cancel: " + m(T.cells[0][1].src + " " + T.cells[1][0].src + " = 0") + '. <span class="rr-hsn">The middle terms cancelled.</span>';
        if (i === 1 && T.comb === "double") return "The middle tiles double: " + m(T.cells[0][1].src + " " + T.cells[1][0].src + " = " + T.merged) + ". A radical stays.";
        return T.cells.length * T.cells[0].length > 1 ? "Multiply each term by each term." : "Multiply the two terms.";
      };
      EXP.areaPl = MV.player($(".rr-pl", E.area), { count:n, label:function(i){ return "Step " + (i + 1) + " of " + n + ": " + labs[i]; }, render:function(i){
        var fwd = i === at + 1; at = i;
        if (i === 0) gridState(grid, T, "plain");
        else if (i === 1 && T.comb) { if (fwd) { gridState(grid, T, "plain"); gridCombine(grid, T); } else gridState(grid, T, "done"); }
        else gridState(grid, T, "done");
        sum.innerHTML = sumAt(i);
      } });
      if (auto && ST.view === "area") {
        if (MV.reduceMotion) EXP.areaPl.go(n - 1);
        else MV.wait(450, function(){ if (my !== tok || !EXP.areaPl) return; EXP.areaPl.go(1); if (n > 2) MV.wait(1500, function(){ if (my !== tok || !EXP.areaPl) return; EXP.areaPl.go(2); }); });
      }
    }
    // steps
    if (!R.steps.length) E.steps.innerHTML = '<p class="muted rr-empty">Choose a multiplier to see the algebra, one step at a time.</p>';
    else {
      E.steps.innerHTML = '<ol class="rr-lines"></ol><div class="rr-pl"></div>';
      var ol = $(".rr-lines", E.steps), L = R.steps;
      ol.innerHTML = L.map(function(l, i){ return '<li data-l="' + i + '"><span class="rr-ll">' + l[0] + '</span><span class="rr-lm">' + l[1] + "</span></li>"; }).join("");
      EXP.stepPl = MV.player($(".rr-pl", E.steps), { count:L.length, label:function(i){ return "Step " + (i + 1) + " of " + L.length; }, render:function(i){ $$("li", ol).forEach(function(li){ li.hidden = +li.dataset.l > i; }); } });
      if (auto && ST.view === "steps") {
        if (MV.reduceMotion) EXP.stepPl.go(L.length - 1);
        else (function next(k){ if (k >= L.length) return; MV.wait(750, function(){ if (my !== tok || !EXP.stepPl) return; EXP.stepPl.go(k); next(k + 1); }); })(1);
      }
    }
    // number line
    var cur = R.v1 == null ? R.v0 : R.v1;
    if (auto && ST.view === "nl" && fromV != null && isFinite(fromV) && isFinite(cur) && !close(fromV, cur) && !MV.reduceMotion) {
      MV.tween({ dur:900, step:function(t){ if (my !== tok) return; dotX = fromV + (cur - fromV) * t; nlp.render(); }, done:function(){ if (my === tok) { dotX = null; nlp.render(); } } });
    } else { dotX = null; }
    nlp.render();
  }
  function paint(auto, fromV){
    R = model(); EXP.R = R;
    paintCtl(); paintFin(); paintRead(); paintView(auto, fromV);
    MV.changed();
  }
  EXP.paint = paint;
  EXP.cur = function(){ return R; };
  EXP.stop = function(){ tok++; };
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.ex) { if (ST.e === b.dataset.ex) return; ST.e = b.dataset.ex; ST.mu = null; api.save(); paint(false); MV.banner("", ""); }
    else if (b.dataset.g) { ST.two = { g:b.dataset.g, m1:null, m2:null }; api.save(); paint(false); }
    else if (b.dataset.clear) { var fv = R.v1; if (R.e.two) { ST.two.m1 = ST.two.m2 = null; } else ST.mu = null; api.save(); paint(true, fv); }
  });
  E.menus.addEventListener("change", function(e){
    var t = e.target; if (t.type !== "radio") return;
    var fv = R.v1 == null ? R.v0 : R.v1;
    if (t.name === "rr-mu") ST.mu = t.value;
    else if (t.name === "rr-m1") { ST.two.m1 = t.value; ST.two.m2 = null; }
    else if (t.name === "rr-m2") ST.two.m2 = t.value;
    api.save(); paint(true, fv);
  });
  // keep any challenge notes on the "why" text after a reload
  Object.keys(ST.notes).forEach(function(id){ setNote(id, ST.notes[id]); });
  paint(false);

  return {
    predict:{
      start:function(p){
        tok++; var cfg = { p1:["e3", "area"], p2:["e1", "nl"], p3:["e3", "area"], p4:["e4", "steps"] }[p.id] || ["e3", "area"];
        ST.e = cfg[0]; ST.mu = null; EXP.seg(cfg[1]); api.save(); paint(false);
      },
      run:function(p, done){
        var fv = EXP.R.v0;
        if (p.id === "p2") { ST.mu = "bot"; api.save(); paint(true, fv); MV.wait(MV.reduceMotion ? 50 : 1100, done); return; }
        ST.mu = "conj"; api.save(); paint(false);
        if (p.id === "p4") {
          var pl = EXP.stepPl, n = EXP.R.steps.length;
          if (!pl || MV.reduceMotion) { if (pl) pl.go(n - 1); done(); return; }
          pl.go(0);
          (function next(k){ if (k >= n) { MV.wait(400, done); return; } MV.wait(800, function(){ pl.go(k); next(k + 1); }); })(1);
          return;
        }
        var apl = EXP.areaPl; if (!apl) { done(); return; }
        if (MV.reduceMotion) { apl.go(2); done(); return; }
        var tiles = $$(".rr-area .rr-tile", EXP.E.area);
        if (p.id === "p3") { tiles.forEach(function(t){ t.classList.add("pre"); }); tiles.forEach(function(t, i){ MV.wait(350 + i * 420, function(){ t.classList.remove("pre"); }); }); }
        MV.wait(p.id === "p3" ? 2300 : 600, function(){ apl.go(1); MV.wait(1700, function(){ apl.go(2); MV.wait(500, done); }); });
      }
    },
    challenge:function(id, opt){
      opt = opt || {};
      var r = chal(id, opt);
      if (r.ok && !opt.live) setTimeout(function(){ paint(false); }, 0);   // the readout's "Simplified form" row opens once its challenge is met
      return r;
    }
  };
}
function setNote(id, note){
  var c = ((MV.C.explore || {}).challenges || []).filter(function(x){ return x.id === id; })[0]; if (!c) return;
  if (c._base == null) c._base = c.why || "";
  c.why = c._base + (note ? " " + md(note) : "");
}
function boxEntry(key){
  var est = ST.entry[key] || {};
  if (key === "e5") return est;
  if (EXP.box && EXP.R && EXP.R.e.id === key) return EXP.box.read();
  return { err:"Write your final form in the boxes under the machine." };
}
var M1msg = function(what){ return "That multiplier went on the bottom only (" + what + "), so the value changed. Multiply the top as well."; };
function chal(id, opt){
  var R = EXP.R; if (!R || !ST) return { ok:false };
  if (id === "tc1") {
    if (ST.e !== "e2") return { ok:false, msg:md("Choose the expression `{10}/{3√5}` first.") };
    if (!ST.mu) return { ok:false, msg:md("Choose a multiplier for `{10}/{3√5}`.") };
    if (ST.mu === "bot") return { ok:false, msg:md(M1msg("`√5`")) };
    var j = judgeSurd(boxEntry("e2"), "2√5/3", []);
    if (j.err) return { ok:false, msg:md(j.err) };
    if (!j.ok) return { ok:false, msg:md(j.msg) };
    if (!opt.live) { ST.notes.tc1 = ST.mu === "rad3" ? "`{√5}/{√5}` is enough; the 3 is already rational." : ""; setNote("tc1", ST.notes.tc1); EXP.api.save(); }
    return { ok:true };
  }
  if (id === "tc2") {
    if (ST.e !== "e5") return { ok:false, msg:md("Choose the expression `{√3 + 1}/{√3 - 1}` first.") };
    if (!ST.mu) return { ok:false, msg:"Choose a multiplier first." };
    if (ST.mu === "same") return { ok:false, msg:md("That squares the denominator: `(√3 - 1)^2 = 4 - 2√3` still has a radical.") };
    if (ST.mu === "bot") return { ok:false, msg:md(M1msg("the conjugate")) };
    if (ST.mu === "rad") return { ok:false, msg:md("`{√3}/{√3}` leaves `3 - √3` in the denominator. Use the conjugate.") };
    var est = ST.entry.e5 || {}, a = Q.raw(String(est.a || "").trim()), b = Q.raw(String(est.b || "").trim());
    if (!a || !b) return { ok:false, msg:md("Fill in both boxes: `a` and `b` (whole numbers or fractions).") };
    var av = Q.val(a), bv = Q.val(b);
    if (av === 2 && bv === 1) return { ok:true };
    if (av === 4 && bv === 2) return { ok:false, msg:"Divide every term by the denominator, 3 − 1 = 2." };
    if (av === 2 && bv === 0) return { ok:false, msg:md("`(√3 + 1)^2` has a middle term, `2√3`.") };
    return { ok:false, msg:md("`" + Q.src(Q.of(a)) + " + " + Q.src(Q.of(b)) + "√3` is about " + fx(av + bv * Math.sqrt(3), 4) + ", but the expression is about 3.7321. Expand the top again and divide every term by the bottom.") };
  }
  if (id === "tc3") {
    var T2 = ST.two;
    if (ST.e !== "two") return { ok:false, msg:"Choose Two-stage first." };
    if (!T2.g) return { ok:false, msg:"Choose a grouping for the denominator first." };
    if (!T2.m1) return { ok:false, msg:"Choose a stage 1 multiplier." };
    if (T2.m1 === "same") return { ok:false, msg:"That multiplier squares the denominator, so the radicals stay. Use the conjugate of your grouping." };
    if (T2.m1 === "bot" || T2.m2 === "bot") return { ok:false, msg:md(M1msg("a conjugate or a root")) };
    if (!T2.m2) return { ok:false, msg:T2.g === "A" ? md("`√2` is still in the denominator: one more stage.") : md("`-4 - 2√6` still has a radical: one more stage.") };
    if (!R.rational) return { ok:false, msg:"A radical is still in the denominator. Choose a stage 2 multiplier that clears it." };
    var j3 = judgeSurd(boxEntry("two"), "(2 + √2 − √6)/4", []);
    if (j3.err) return { ok:false, msg:md(j3.err) };
    if (!j3.ok) return { ok:false, msg:md(j3.msg) };
    if (!opt.live) { ST.notes.tc3 = T2.g === "B" ? "Grouping `(1 + √2) + √3` gives a simpler second stage." : ""; setNote("tc3", ST.notes.tc3); EXP.api.save(); }
    return { ok:true };
  }
  return { ok:false };
}

// ---------- Part 3: rationalize the numerator ----------
var HS = [1, 0.1, 0.01, 0.001, -1, -0.1, -0.01, -0.001];
function f4(h){ return (Math.sqrt(4 + h) - 2) / h; }
function g4(h){ return 1 / (Math.sqrt(4 + h) + 2); }
function dpH(h){ var a = Math.abs(h); return a >= 0.1 ? 4 : a >= 0.01 ? 5 : 6; }
var L1 = [
  ["Multiply by a form of 1", "{√{4 + h} - 2}/{h} × {√{4 + h} + 2}/{√{4 + h} + 2}"],
  ["Top", "(√{4 + h} - 2)(√{4 + h} + 2) = (4 + h) - 4 = h"],
  ["Cancel <i>h</i> (allowed: <i>h</i> ≠ 0)", "{h}/{h(√{4 + h} + 2)} = {1}/{√{4 + h} + 2}"],
  ["Now <i>h</i> = 0 can go in", "{1}/{√4 + 2} = {1}/{4}"]
];
var L3 = {
  rat:[["Multiply by a form of 1", "{√x - 3}/{x - 9} × {√x + 3}/{√x + 3}"], ["Top", "(√x - 3)(√x + 3) = x - 9"], ["Cancel <i>x</i> − 9 (<i>x</i> ≠ 9)", "{x - 9}/{(x - 9)(√x + 3)} = {1}/{√x + 3}"]],
  fac:[["Factor the bottom (a difference of squares, <i>x</i> ≥ 0)", "x - 9 = (√x - 3)(√x + 3)"], ["Cancel √<i>x</i> − 3 (<i>x</i> ≠ 9)", "{√x - 3}/{(√x - 3)(√x + 3)} = {1}/{√x + 3}"]]
};
function linesHTML(L, n){ return L.map(function(l, i){ return '<li' + (i >= n ? " hidden" : "") + '><span class="rr-ll">' + l[0] + '</span><span class="rr-lm">' + m(l[1]) + "</span></li>"; }).join(""); }
function revealLines(ol, L, done){
  var lis = $$("li", ol), i = 0;
  (function next(){ if (i >= lis.length) { if (done) done(); return; } lis[i].hidden = false; i++; MV.wait(MV.reduceMotion ? 0 : 750, next); })();
}
function part3(host, api){
  var P3 = api.S; P3.form = P3.form || "orig"; P3.tried = P3.tried || {};
  host.innerHTML =
    '<section class="rr-st"><h3>Station 1: the shrinking <i>h</i></h3><p>' + md("Watch `{√{4 + h} - 2}/{h}` as `h` shrinks toward 0 from both sides. At `h = 0` it is 0/0, so the original form can’t be evaluated there.") + "</p>" +
    '<div id="rr-t1"></div><div class="q-actions"><button type="button" class="btn primary sm" id="rr-ratb" data-k="rrratb">Rationalize the numerator</button></div><ol class="rr-lines" id="rr-l1" aria-live="polite"></ol>' +
    '<details class="alg" id="rr-alg1"><summary>Check it with algebra</summary><div id="rr-alg1b"></div></details></section>' +
    '<section class="rr-st"><h3>Station 2: the hole in the graph</h3><div class="eq-cap rr-s2cap" id="rr-s2cap" aria-live="polite"></div><div id="rr-s2seg"></div>' +
    '<div class="plot-wrap rr-s2w"><canvas class="plot" id="rr-s2p" role="img" aria-label="Graph"></canvas></div><p class="rr-capt">' + md("The two forms agree everywhere except `h = 0`, where only the new form can be evaluated. In module 02 this number, `{1}/{4}`, turns out to be the slope of `y = √x` at `x = 4`.") + "</p></section>" +
    '<section class="rr-st"><h3>Station 3: a second form</h3><p>' + md("Simplify `{√x - 3}/{x - 9}`, with `x ≠ 9`. Choose a method.") + '</p><div id="rr-s3seg"></div><ol class="rr-lines" id="rr-l3" aria-live="polite"></ol><div id="rr-s3m" aria-live="polite"></div><div id="rr-t3"></div></section>';
  // station 1
  function table1(){
    var rat = !!P3.rat, head = ["<i>h</i>", m("{√{4 + h} - 2}/{h}")].concat(rat ? [m("{1}/{√{4 + h} + 2}")] : []);
    var rows = HS.map(function(h){ return [hNum(h), fx(f4(h), dpH(h))].concat(rat ? [fx(g4(h), dpH(h))] : []); });
    rows.push(["0", "0/0: undefined"].concat(rat ? [m("{1}/{4}") + " = 0.25"] : []));
    $("#rr-t1").innerHTML = '<div class="tbl-wrap rr-tw"><table class="vt"><caption class="vh">Values of the expression for h from 1 down to 0.001 and from −1 up to −0.001, then h = 0</caption><thead><tr>' + head.map(function(c, j){ return '<th scope="col"' + (rat && j === 2 ? ' class="hl"' : "") + ">" + c + "</th>"; }).join("") + "</tr></thead><tbody>" +
      rows.map(function(r, i){ return "<tr" + (i === rows.length - 1 ? ' class="rr-h0"' : "") + ">" + r.map(function(c, j){ return "<td" + (rat && j === 2 ? ' class="hl"' : "") + ">" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
    var agree = HS.filter(function(h){ return fx(f4(h), dpH(h)) === fx(g4(h), dpH(h)); }).length;
    $("#rr-alg1b").innerHTML = '<div class="alg-lines">' + md("<span>For every `h ≠ 0`: `{√{4 + h} - 2}/{h} × {√{4 + h} + 2}/{√{4 + h} + 2} = {(4 + h) - 4}/{h(√{4 + h} + 2)} = {1}/{√{4 + h} + 2}`.</span><small>Multiplying by a form of 1 never changes a value.</small>") + "</div>" +
      '<p style="margin:10px 0 0">' + (rat ? "✓ All " + agree + " of the " + HS.length + " non-zero rows agree to every decimal shown: both columns are the same function, except that only the new one has a value at " + m("h = 0") + "." : "Press <strong>Rationalize the numerator</strong> to get the second column, then compare.") + "</p>";
    var b = $("#rr-ratb"); b.disabled = rat; b.textContent = rat ? "Rationalized ✓" : "Rationalize the numerator";
  }
  $("#rr-l1").innerHTML = linesHTML(L1, P3.rat ? L1.length : 0);
  table1();
  $("#rr-ratb").addEventListener("click", function(){
    if (P3.rat) return;
    var b = $("#rr-ratb"); b.disabled = true;
    revealLines($("#rr-l1"), L1, function(){ P3.rat = true; api.save(); table1(); });
  });
  // station 2
  var plot = new MV.Plot($("#rr-s2p"), { xmin:-4.6, xmax:5.2, ymin:-0.08, ymax:0.6 });
  plot.render = function(){
    var rat = P3.form === "rat";
    plot.draw({ view:{ xmin:-4.6, xmax:5.2, ymin:-0.08, ymax:0.6 }, xTicks:{ step:1 }, yTicks:{ step:0.1 }, xLabel:"h", yLabel:"y",
      segments:[{ x1:0, y1:0.25, x2:-4.6, y2:0.25, color:css("--ink-2"), width:1.2, dash:[4, 5], alpha:0.8 }],
      curves:[{ f:rat ? g4 : function(h){ return Math.abs(h) < 1e-12 ? NaN : f4(h); }, color:css("--pen"), width:3, domain:[-4, 5.2] }],
      points:[{ x:-4, y:0.5, color:css("--pen"), r:5 }, rat ? { x:0, y:0.25, color:css("--pen"), r:5.5, label:"(0, 1/4)" } : { x:0, y:0.25, open:true, r:5.5, color:css("--pen"), label:"(0, 1/4) missing" }],
      describe:rat ? "Graph of y = 1/(√(4 + h) + 2) against h from −4 to 5: a falling curve from (−4, 0.5); the point (0, 1/4) is filled in." : "Graph of y = (√(4 + h) − 2)/h against h from −4 to 5: the same falling curve from (−4, 0.5), with an open circle (a hole) at (0, 1/4)." });
    $("#rr-s2cap").innerHTML = rat ? m("y = {1}/{√{4 + h} + 2}") : m("y = {√{4 + h} - 2}/{h}");
  };
  MV.seg($("#rr-s2seg"), { label:"Form", options:[{ id:"orig", t:"Original form" }, { id:"rat", t:"Rationalized form" }], value:P3.form, onChange:function(v){ P3.form = v; api.save(); plot.render(); } });
  plot.render();
  // station 3
  function s3(animate){
    var k = P3.method, L = k ? L3[k].concat([["Near <i>x</i> = 9", "{1}/{√x + 3} → {1}/{3 + 3} = {1}/{6}"]]) : [];
    var ol = $("#rr-l3"); ol.innerHTML = linesHTML(L, animate ? 0 : L.length);
    var msg = $("#rr-s3m"), both = P3.tried.rat && P3.tried.fac;
    var after = function(){
      msg.innerHTML = !k ? "" : '<p class="fb ' + (both ? "good" : "") + '">' + (both ? md("✓ Both methods lead to `{1}/{√x + 3}`, which approaches `{1}/{6}` near `x = 9`.") : md("Now try the other method. Does it lead to the same form?")) + "</p>";
      if (!k) { $("#rr-t3").innerHTML = ""; return; }
      var xs = [8.99, 8.999, 9, 9.001, 9.01], o = function(x){ return (Math.sqrt(x) - 3) / (x - 9); }, n = function(x){ return 1 / (Math.sqrt(x) + 3); };
      $("#rr-t3").innerHTML = '<div class="tbl-wrap rr-tw"><table class="vt"><caption class="vh">Both forms near x = 9</caption><thead><tr><th scope="col"><i>x</i></th><th scope="col">' + m("{√x - 3}/{x - 9}") + '</th><th scope="col" class="hl">' + m("{1}/{√x + 3}") + "</th></tr></thead><tbody>" +
        xs.map(function(x){ return "<tr" + (x === 9 ? ' class="rr-h0"' : "") + "><td>" + x + "</td><td>" + (x === 9 ? "0/0: undefined" : fx(o(x), 6)) + '</td><td class="hl">' + (x === 9 ? m("{1}/{6}") + " ≈ 0.166667" : fx(n(x), 6)) + "</td></tr>"; }).join("") + "</tbody></table></div>";
    };
    if (animate) { msg.innerHTML = ""; revealLines(ol, L, after); } else after();
  }
  MV.seg($("#rr-s3seg"), { label:"Method", options:[{ id:"rat", t:"Rationalize the numerator" }, { id:"fac", t:"Factor " + m("x - 9") }], value:P3.method || null, onChange:function(v){ P3.method = v; P3.tried[v] = true; api.save(); s3(true); } });
  s3(false);
  return {};
}

// ---------- Practice 2: rationalize and simplify (V8 boxes) ----------
function rsimp(host, api, a){
  var st = api.S; st.items = st.items || {};
  var msgs = {}, boxes = {};
  function ist(id){ return st.items[id] || (st.items[id] = { tries:0, hint:0, solved:false, first:null, v:{} }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q rr-rq" data-rs="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + (it.frame === "num" || it.frame === "r4" ? it.prompt : "Rationalize and simplify " + it.prompt + ".") + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="rr-fr"></div><div class="rr-rc"></div></div>';
  }).join("");
  a.items.forEach(function(it){
    var x = ist(it.id), box = $('[data-rs="' + it.id + '"]', host), fr = $(".rr-fr", box);
    if (it.frame === "surd") boxes[it.id] = exactBox(fr, { key:"rs" + it.id, st:x.v, cube:!!it.cube, maxNum:3, maxDen:2, onChange:function(){ api.save(); } });
    else if (it.frame === "num") {
      fr.innerHTML = '<div class="rr-ab"><label class="rr-nl">' + m("→") + ' <input type="text" inputmode="text" class="rr-xc rr-wide" data-v="n" data-k="' + it.id + 'n" aria-label="The value it approaches (exact, such as a fraction)" value="' + MV.esc(x.v.n || "") + '"></label></div>';
      fr.addEventListener("input", function(e){ if (e.target.dataset.v) { x.v[e.target.dataset.v] = e.target.value; api.save(); } });
    } else if (it.frame === "r4") {
      var paintR4 = function(){
        MV.keepFocus(fr, function(){
          fr.innerHTML = '<div class="rr-r4"><span class="frac"><span class="fn"><input type="text" inputmode="text" class="rr-xc" data-v="n" data-k="' + it.id + 'n" aria-label="Top: a number" value="' + MV.esc(x.v.n || "") + '"' + (x.solved ? " disabled" : "") + '></span><span class="fd"><input type="text" inputmode="text" class="rr-xc" data-v="c" data-k="' + it.id + 'c" aria-label="Bottom: number in front of the bracket (empty for 1)" value="' + MV.esc(x.v.c || "") + '"' + (x.solved ? " disabled" : "") + ">" + m("(√{x + 3}") +
            '<span class="rr-sg" role="group" aria-label="Sign between the roots">' + ["+", "−"].map(function(sg){ return '<button type="button" class="chip" data-sg="' + sg + '" data-k="' + it.id + "sg" + (sg === "+" ? "p" : "m") + '" aria-pressed="' + (x.v.sign === sg) + '"' + (x.solved ? " disabled" : "") + ">" + sg + "</button>"; }).join("") + "</span>" + m("√x)") + "</span></span></div>";
        });
      };
      paintR4();
      fr.addEventListener("input", function(e){ if (e.target.dataset.v) { x.v[e.target.dataset.v] = e.target.value; api.save(); } });
      fr.addEventListener("click", function(e){ var b = e.target.closest("[data-sg]"); if (!b || b.disabled) return; x.v.sign = b.dataset.sg; api.save(); paintR4(); });
      boxes[it.id] = { repaint:paintR4 };
    }
    if (x.solved && boxes[it.id] && boxes[it.id].disable) boxes[it.id].disable(true);
    if (x.solved && it.frame === "num") $$("input", fr).forEach(function(inp){ inp.disabled = true; });
    paintCtl(it);
  });
  function paintCtl(it){
    var x = ist(it.id), box = $('[data-rs="' + it.id + '"]', host), c = $(".rr-rc", box);
    MV.keepFocus(c, function(){
      var h = "";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + MV.hintsHTML(it.hints, x.hint);
      if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
      else if (msgs[it.id]) h += '<div class="fb ' + (msgs[it.id].bad ? "bad" : "") + '" role="status"><p>' + (msgs[it.id].bad ? "<strong>✗ Not quite.</strong> " : "") + msgs[it.id].html + "</p></div>";
      c.innerHTML = h;
    });
  }
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it);
    if (it.frame === "surd") return judgeSurd(boxes[it.id].read(), ans, it.wrong);
    if (it.frame === "num") {
      var q = Q.raw(String(x.v.n || "").trim());
      if (!q) return { err:"Type an exact value: a whole number or a fraction such as 3/4." };
      var nw = (it.wrong || []).filter(function(w){ var p = Q.raw(w.form); return p && Q.eq(Q.of(p), Q.of(q)); })[0];
      if (nw) return { ok:false, msg:nw.fb };
      var t = Q.raw(ans), eq = Q.eq(Q.of(q), Q.of(t));
      if (eq && Q.of(q).n === q.n && Q.of(q).d === q.d) return { ok:true };
      if (eq) return { ok:false, msg:"Same value. Now write the fraction in lowest terms." };
      return { ok:false, msg:"Rationalize the numerator first, then let `x` reach 4 in the new form." };
    }
    if (it.frame === "r4") {
      var n = Q.raw(String(x.v.n || "").trim()), cc = String(x.v.c || "").trim(), c = cc ? Q.raw(cc) : { n:1, d:1 };
      if (!n || !c || !c.n) return { err:"Fill in the top box (and the box in front of the bracket, or leave it empty for 1) with whole numbers or fractions." };
      if (!x.v.sign) return { err:"Choose + or − between the roots." };
      var w = (it.wrong || []).filter(function(w){ return w.sign === x.v.sign; })[0];
      if (w) return { ok:false, msg:w.fb };
      var ratio = Q.div(Q.of(n), Q.of(c));
      if (x.v.sign === ans && ratio.n === 1 && ratio.d === 1) return (n.n === 1 && n.d === 1 && c.n === 1 && c.d === 1) ? { ok:true } : { ok:false, msg:"Same value, but simplify: cancel the common factor." };
      return { ok:false, msg:"That isn’t equal to the original. Multiply out the top again: what is `(√{x + 3} - √x)(√{x + 3} + √x)`?" };
    }
    return { err:"" };
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-rs]"); if (!box) return;
    var it = a.items.filter(function(q){ return q.id === box.dataset.rs; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCtl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:md(r.err) };
    else if (r.ok) {
      x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null;
      if (boxes[it.id] && boxes[it.id].disable) boxes[it.id].disable(true);
      if (boxes[it.id] && boxes[it.id].repaint) boxes[it.id].repaint();
      $$(".rr-fr input", box).forEach(function(inp){ inp.disabled = true; });
    } else { x.tries++; msgs[it.id] = { bad:true, html:md(r.msg) + " Try again." }; }
    api.save(); paintCtl(it); MV.focusFb(box);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- performance task: make the h cancel ----------
var task = (function(){
  var api, plot, HT = [-0.1, -0.01, -0.001, 0.001, 0.01, 0.1];
  function read(){
    var s = api ? api.S : {}, k = Number(s.k), mm = Number(s.m), r = Number(s.r);
    var ok = Number.isInteger(k) && k >= 1 && k <= 100 && Number.isInteger(mm) && mm >= 1 && mm <= 9 && Number.isInteger(r) && r >= 1 && r <= 9 && String(s.k).trim() !== "" && String(s.m).trim() !== "" && String(s.r).trim() !== "";
    return { k:k, m:mm, r:r, valid:ok };
  }
  function F(d, h){ var u = d.k + d.m * h; return u < 0 ? NaN : (Math.sqrt(u) - d.r) / h; }
  function exprSrcT(d){ return "{√{" + d.k + " + " + (d.m === 1 ? "" : d.m) + "h} - " + d.r + "}/{h}"; }
  function preview(){
    var d = read(), cap = $("#mh-cap"), tb = $("#mh-tbl"), nt = $("#mh-note"); if (!cap) return;
    if (!d.valid) { cap.innerHTML = m("{√{k + mh} - r}/{h}"); tb.innerHTML = ""; nt.innerHTML = '<span class="muted">Enter whole numbers: ' + m("k") + " from 1 to 100, " + m("m") + " and " + m("r") + " from 1 to 9.</span>"; plot.render(); return; }
    cap.innerHTML = m(exprSrcT(d));
    var rows = HT.map(function(h){ var v = F(d, h); return [hNum(h), isFinite(v) ? fx(v, dpH(h)) : "undefined"]; });
    rows.splice(3, 0, ["0", d.k === d.r * d.r ? "0/0: undefined" : "undefined"]);
    tb.innerHTML = '<div class="tbl-wrap rr-tw"><table class="vt"><caption class="vh">Values near h = 0</caption><thead><tr><th scope="col"><i>h</i></th><th scope="col">' + m(exprSrcT(d)) + "</th></tr></thead><tbody>" +
      rows.map(function(r){ return "<tr" + (r[0] === "0" ? ' class="rr-h0"' : "") + "><td>" + r[0] + "</td><td>" + r[1] + "</td></tr>"; }).join("") + "</tbody></table></div>";
    var a1 = F(d, 0.001), a2 = F(d, -0.001);
    nt.innerHTML = d.k === d.r * d.r && isFinite(a1) && isFinite(a2) ? "Near " + m("h = 0") + " the values approach about " + fx((a1 + a2) / 2, 4) + "." : "Near " + m("h = 0") + " the values grow without bound: the top doesn’t go to 0.";
    plot.render();
  }
  function draw(){
    var d = read();
    if (!d.valid) { plot.draw({ view:{ xmin:-2, xmax:2, ymin:-1, ymax:1 }, xLabel:"h", describe:"Empty graph. Enter k, m and r." }); return; }
    var hole = d.k === d.r * d.r, L = d.m / (2 * d.r), left = Math.max(-2, -d.k / d.m);
    var top = hole ? Math.max(F(d, left + 1e-9), L * 1.6) * 1.15 : 4, view = hole ? { xmin:-2, xmax:2, ymin:-top * 0.08, ymax:top } : { xmin:-2, xmax:2, ymin:-4, ymax:4 };
    plot.draw({ view:view, xLabel:"h", yLabel:"y", curves:[{ f:function(h){ return Math.abs(h) < 1e-9 ? NaN : F(d, h); }, color:css("--pen"), width:3, domain:[left, 2] }],
      points:hole ? [{ x:0, y:L, open:true, r:5.5, color:css("--pen"), label:"hole at h = 0" }] : [],
      describe:"Graph of y = (√(" + d.k + " + " + d.m + "h) − " + d.r + ")/h against h from " + num(left, 2) + " to 2. " + (hole ? "It has a hole at (0, " + num(L, 4) + ")." : "It grows without bound near h = 0.") });
  }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.k == null) { a.S.k = "4"; a.S.m = "1"; a.S.r = "2"; }
      inp.innerHTML = '<div class="inrow">' + [["k", 1, 100], ["m", 1, 9], ["r", 1, 9]].map(function(q){ return '<label for="mh-' + q[0] + '"><span>' + m(q[0]) + ' <span class="tiny muted">(' + q[1] + " to " + q[2] + ')</span></span><input id="mh-' + q[0] + '" data-mh="' + q[0] + '" type="number" min="' + q[1] + '" max="' + q[2] + '" step="1" autocomplete="off" value="' + MV.esc(a.S[q[0]]) + '"></label>'; }).join("") + "</div>";
      pv.innerHTML = '<div class="eq-cap rr-mhcap" id="mh-cap" aria-live="polite"></div><div class="plot-wrap"><canvas class="plot" id="mh-plot" role="img" aria-label="Graph against h"></canvas></div><p class="tiny" id="mh-note" aria-live="polite"></p><div id="mh-tbl"></div>';
      plot = new MV.Plot($("#mh-plot"), { xmin:-2, xmax:2, ymin:-1, ymax:1 }); plot.render = draw;
      inp.addEventListener("input", function(e){ var k = e.target.dataset.mh; if (!k) return; a.S[k] = e.target.value; a.save(); preview(); a.update(); });
      preview();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Enter whole numbers: k from 1 to 100, and m and r from 1 to 9."; },
    checks:function(d){ if (!d.valid) return [false, false, false]; var c1 = d.k === d.r * d.r; return [c1, c1 && 4 * d.m === 2 * d.r, d.m >= 2]; },
    key:function(d){ return d.k + "," + d.m + "," + d.r; },
    label:function(k){ return "(" + k.split(",").join(", ") + ")"; },
    text:function(k){ var p = k.split(","); return "k = " + p[0] + ", m = " + p[1] + ", r = " + p[2]; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ rsimp:rsimp },
  task:task
});
})();
