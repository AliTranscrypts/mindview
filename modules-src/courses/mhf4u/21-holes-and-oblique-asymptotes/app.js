// MHF4U 21 Holes and Oblique Asymptotes: hero morph, Cancel-and-divide lab (Explore: N26 factor tiles + N22 division
// board, gap probe, zoom), Under the microscope (Part 3), matching, missing numbers, and the task.
// Plan: mhf4u/plan/modules/21-holes-and-oblique-asymptotes.md
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, M = MV.m;
function F(s, a){ return String(s == null ? "" : s).replace(/§(\d)/g, function(m, k){ var v = a[+k - 1]; return v == null ? m : v; }); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function uniq(a){ var o = []; a.forEach(function(v){ if (o.indexOf(v) < 0) o.push(v); }); return o; }
function sortN(a){ return a.slice().sort(function(x, y){ return x - y; }); }
function eqArr(a, b){ return a.length === b.length && a.every(function(v, i){ return v === b[i]; }); }
function cnt(a, v){ return a.filter(function(x){ return x === v; }).length; }
function cp(v){ return { xmin:v.xmin, xmax:v.xmax, ymin:v.ymin, ymax:v.ymax }; }
function lerpV(a, b, t){ return { xmin:a.xmin + (b.xmin - a.xmin) * t, xmax:a.xmax + (b.xmax - a.xmax) * t, ymin:a.ymin + (b.ymin - a.ymin) * t, ymax:a.ymax + (b.ymax - a.ymax) * t }; }
function sgnInf(s){ return s > 0 ? "+∞" : MINUS + "∞"; }

// ---------- exact fractions ----------
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function Q(n, d){ if (d == null) d = 1; if (d < 0) { n = -n; d = -d; } var g = gcd(n, d) || 1; return { n:n / g, d:d / g }; }
function qadd(a, b){ return Q(a.n * b.d + b.n * a.d, a.d * b.d); }
function qmul(a, b){ return Q(a.n * b.n, a.d * b.d); }
function qdiv(a, b){ return Q(a.n * b.d, a.d * b.n); }
function qv(a){ return a.n / a.d; }
function qT(a){ return (a.n < 0 ? MINUS : "") + Math.abs(a.n) + (a.d === 1 ? "" : "/" + a.d); }
function qS(a){ return (a.n < 0 ? "-" : "") + Math.abs(a.n) + (a.d === 1 ? "" : "/" + a.d); }
function ptT(x, y){ return "(" + qT(x) + ", " + qT(y) + ")"; }
function sig(v, k){ if (!isFinite(v)) return "—"; if (v === 0) return "0"; var s = v.toPrecision(k); if (/e/.test(s)) return num(Number(s), 0); return s.replace("-", MINUS); }
function half(x){ return Q(Math.round(x * 2), 2); }

// ---------- polynomials (integer coefficients, highest power first) ----------
function pmul(a, b){ var r = []; for (var i = 0; i < a.length + b.length - 1; i++) r.push(0); a.forEach(function(x, i){ b.forEach(function(y, j){ r[i + j] += x * y; }); }); return r; }
function pRoots(c, roots){ var p = [c]; roots.forEach(function(t){ p = pmul(p, [1, -t]); }); return p; }
function pval(p, x){ var v = 0; p.forEach(function(c){ v = v * x + c; }); return v; }
function pvalQ(p, X){ var v = Q(0); p.forEach(function(c){ v = qadd(qmul(v, X), Q(c)); }); return v; }
function pdiv(p, d){ var r = p.slice(), q = [], n = r.length - d.length; for (var i = 0; i <= n; i++) { var k = r[i] / d[0]; q.push(k); for (var j = 0; j < d.length; j++) r[i + j] -= k * d[j]; } return { q:q, r:r.slice(Math.max(0, n + 1)) }; }
function psrc(p){
  var n = p.length - 1, out = "", first = true;
  p.forEach(function(c, i){
    if (!c) return;
    var e = n - i, a = Math.abs(c), body = (e > 0 && a === 1 ? "" : a) + (e === 0 ? "" : e === 1 ? "x" : "x^" + e);
    out += first ? (c < 0 ? "-" : "") + body : (c < 0 ? " - " : " + ") + body; first = false;
  });
  return out || "0";
}
function fac(r){ return r === 0 ? "x" : r > 0 ? "x - " + r : "x + " + (-r); }
function facP(r){ return r === 0 ? "x" : "(" + fac(r) + ")"; }
// c·(x − r)… with repeated factors as powers (first-appearance order); bare: a lone (x − r) loses its brackets
function prodSrc(c, roots, bare){
  if (!roots.length) return c < 0 ? "-" + (-c) : String(c);
  var seen = uniq(roots), body = seen.map(function(t){ var k = cnt(roots, t); return k > 1 ? (t === 0 ? "x" : "(" + fac(t) + ")") + "^" + k : facP(t); }).join("");
  if (bare && c === 1 && roots.length === 1) return fac(roots[0]);
  return (c === 1 ? "" : c === -1 ? "-" : String(c)) + body;
}
function ratSrc(c, top, bot){ var t = prodSrc(c, top, true); return bot.length ? "{" + t + "}/{" + prodSrc(1, bot, true) + "}" : t; }

// ---------- canvas helpers ----------
function dashV(ctx, p, x, o){
  o = o || {}; var X = p.X(x); if (X < -2 || X > p.W + 2) return;
  ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.strokeStyle = o.color || css("--ink-2"); ctx.lineWidth = 1.5; ctx.setLineDash(o.dash || [8, 6]);
  var y0 = o.from == null ? 0 : o.from, y1 = o.to == null ? p.H : o.to;
  ctx.beginPath(); ctx.moveTo(X, y0); ctx.lineTo(X, y1); ctx.stroke(); ctx.restore();
  if (o.label) { ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.font = "italic 13px " + p.fontM; ctx.fillStyle = o.color || css("--ink-2"); ctx.textBaseline = "middle"; var right = X > p.W - 60; ctx.textAlign = right ? "right" : "left"; ctx.fillText(o.label, X + (right ? -5 : 5), 14); ctx.restore(); }
}
// oblique (or any) line y = m x + b, dashed, drawn left to right up to `reveal`, label placed where the line is in view
function dashLine(ctx, p, m, b, o){
  o = o || {}; var v = p.v, rev = o.reveal == null ? 1 : o.reveal, x1 = v.xmin + (v.xmax - v.xmin) * rev;
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, p.W, p.H); ctx.clip();
  ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.strokeStyle = o.color || css("--ink-2"); ctx.lineWidth = o.width || 1.5; ctx.setLineDash(o.dash || [8, 6]);
  ctx.beginPath(); ctx.moveTo(p.X(v.xmin), p.Y(m * v.xmin + b)); ctx.lineTo(p.X(x1), p.Y(m * x1 + b)); ctx.stroke(); ctx.restore();
  if (o.label && rev >= 1) {
    var fr = o.at || [0.86, 0.76, 0.66, 0.14, 0.24, 0.5], yr = v.ymax - v.ymin;
    for (var i = 0; i < fr.length; i++) {
      var x = v.xmin + (v.xmax - v.xmin) * fr[i], y = m * x + b;
      if (y > v.ymin + yr * 0.1 && y < v.ymax - yr * 0.1) { p.label({ x:x, y:y, text:o.label, dy:m >= 0 ? -16 : 16, align:"right", bg:true, color:o.color || css("--ink-2"), font:"italic 13px " + p.fontM }); break; }
    }
  }
}
function openDot(ctx, p, x, y, o){
  o = o || {}; var X = p.X(x), Y = p.Y(y), r = o.r || 5;
  if (X < -12 || X > p.W + 12 || Y < -12 || Y > p.H + 12) return false;
  ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.beginPath(); ctx.arc(X, Y, r, 0, Math.PI * 2); ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.lineWidth = 2.2; ctx.strokeStyle = css("--pen"); ctx.stroke(); ctx.restore();
  if (o.label) p.label({ x:x, y:y, text:o.label, dx:X > p.W - 90 ? -10 : 10, dy:Y < 30 ? 16 : -16, align:X > p.W - 90 ? "right" : "left", bg:true });
  return true;
}
// a hole outside the window: a small arrow at the edge pointing toward it, with its coordinates
function edgeMark(ctx, p, x, y, label){
  var X = p.X(x), Y = p.Y(y), cx = clamp(X, 14, p.W - 14), cy = clamp(Y, 14, p.H - 14), ang = Math.atan2(Y - cy, X - cx), ink = css("--ink");
  ctx.save(); ctx.fillStyle = ink; ctx.translate(cx, cy); ctx.rotate(ang); ctx.beginPath(); ctx.moveTo(9, 0); ctx.lineTo(-5, -6); ctx.lineTo(-5, 6); ctx.closePath(); ctx.fill(); ctx.restore();
  p.label({ x:p.xOf(cx), y:p.yOf(cy), text:label, dx:cx > p.W / 2 ? -12 : 12, dy:cy > p.H / 2 ? -14 : 14, align:cx > p.W / 2 ? "right" : "left", bg:true, font:"600 13px " + p.fontM });
}
// y tick labels drawn inside the left edge (the engine's labels clip when the y-axis is off-screen)
function yLabelsLeft(ctx, p){
  var v = p.v, sy = MV.niceStep((v.ymax - v.ymin) / (p.H < 320 ? 6 : 9));
  ctx.save(); ctx.fillStyle = css("--ink-2"); ctx.font = "12px " + p.fontUI; ctx.textAlign = "left"; ctx.textBaseline = "middle";
  for (var y = Math.ceil(v.ymin / sy - 1e-9) * sy; y <= v.ymax + 1e-9; y += sy) { var Y = p.Y(y); if (Y < 10 || Y > p.H - 10 || Math.abs(y) < sy * 1e-6) continue; ctx.fillText(num(y, 4), 4, Y); }
  ctx.restore();
}
function blank(){ return ""; }
function yAxisOff(v){ return v.xmin > -0.06 * (v.xmax - v.xmin); }

// ---------- N26 factor tiles ----------
// @component N26 factorTiles — numerator/denominator rows of (x − r) tiles (r from −5 to 5) with a constant-factor stepper,
// add/remove, pair-by-pair match highlighting with link lines, struck (cancelled) state; ftAnalyse gives exact features by counting copies
function ftAnalyse(st){
  var c = st.c, top = st.top.slice(), bot = st.bot.slice();
  var restr = sortN(uniq(bot)), holes = [], vas = [], lt = top.slice(), lb = bot.slice(), common = [];
  uniq(top).forEach(function(a){ var k = Math.min(cnt(top, a), cnt(bot, a)); if (k > 0) { common.push({ r:a, k:k }); for (var i = 0; i < k; i++) { lt.splice(lt.indexOf(a), 1); lb.splice(lb.indexOf(a), 1); } } });
  var P = pRoots(c, lt), D = pRoots(1, lb);
  function f(x){ return pval(P, x) / pval(D, x); }
  function fQ(X){ var d = pvalQ(D, X); return d.n === 0 ? null : qdiv(pvalQ(P, X), d); }
  function side(a, s){ var g = c > 0 ? 1 : -1; lt.concat(lb).forEach(function(t){ g *= t === a ? s : (a - t > 0 ? 1 : -1); }); return g; }
  restr.forEach(function(a){ if (cnt(bot, a) <= cnt(top, a)) holes.push({ a:a, h:fQ(Q(a)) }); else vas.push({ a:a, l:side(a, -1), r:side(a, 1) }); });
  var dt = lt.length, db = lb.length, far;
  if (!db) far = { k:"poly", p:P, deg:dt };
  else if (dt < db) far = { k:"zero" };
  else if (dt === db) far = { k:"eq", v:c };
  else if (dt === db + 1) far = { k:"ob", q:pdiv(P, D).q };
  else far = { k:"none", d:dt - db };
  return { c:c, top:top, bot:bot, restr:restr, holes:holes, vas:vas, common:common, lt:lt, lb:lb, P:P, D:D, f:f, fQ:fQ, far:far,
    xints:sortN(uniq(lt)).filter(function(t){ return restr.indexOf(t) < 0; }),
    xnotes:sortN(uniq(top)).filter(function(t){ return restr.indexOf(t) >= 0; }).map(function(t){ return { a:t, hole:holes.some(function(h){ return h.a === t; }) }; }),
    yint:restr.indexOf(0) >= 0 ? null : fQ(Q(0)) };
}
function ftPairs(st){ var used = {}, out = []; st.top.forEach(function(t, i){ for (var j = 0; j < st.bot.length; j++) if (!used[j] && st.bot[j] === t) { used[j] = 1; out.push([i, j]); return; } }); return out; }
function farText(A, U){
  var f = A.far;
  if (f.k === "zero") return U.far0;
  if (f.k === "eq") return F(U.farEq, [num(f.v)]);
  if (f.k === "ob") return F(U.farOb, [M("y = " + psrc(f.q))]);
  if (f.k === "none") return F(U.farNone, [f.d]);
  return F(U.farPoly, [M("y = " + psrc(f.p)), U.kinds[f.deg], A.holes.length, A.holes.length === 1 ? U.hole1 : U.holeN]);
}
function holesText(A, U, shown){
  if (!A.holes.length) return U.none;
  if (!shown) return A.holes.map(function(h){ return F(U.holeQ, [num(h.a)]); }).join("; ");
  return A.holes.map(function(h){ return ptT(Q(h.a), h.h) + (h.h.n === 0 ? " " + U.onAxis : ""); }).join("; ");
}
function vasText(A, U){ return A.vas.length ? A.vas.map(function(v){ return F(U.vaRow, [num(v.a), sgnInf(v.l), sgnInf(v.r)]); }).join("<br>") : U.none; }
function simpText(A, U, shown){
  if (!A.common.length) return U.nothing;
  if (!shown) return U.pressCancel;
  return M("f(x) = " + ratSrc(A.c, A.lt, A.lb)) + (A.holes.length ? ", " + A.holes.map(function(h){ return M("x ≠ " + h.a); }).join(", ") : "");
}
// scene pieces for a tile function: asymptotes under the curve, holes (with labels) and off-window markers in after()
function ftScene(A, o){
  o = o || {};
  var sc = { asymptotes:[], curves:[{ f:A.f, color:css("--pen"), width:o.width || 3, arrows:o.arrows !== false }] };
  if (!o.rough) {
    A.vas.forEach(function(v){ sc.asymptotes.push({ x:v.a, label:o.noLabels ? "" : "x = " + num(v.a) }); });
    if (A.far.k === "zero") sc.asymptotes.push({ y:0, label:o.noLabels ? "" : "y = 0" });
    if (A.far.k === "eq") sc.asymptotes.push({ y:A.c, label:o.noLabels ? "" : "y = " + num(A.c) });
  }
  sc.after = function(ctx, p){
    if (o.rough) return;
    if (A.far.k === "ob") dashLine(ctx, p, A.far.q[0], A.far.q[1], { label:o.noLabels ? "" : MV.plain(M("y = " + psrc(A.far.q))) });
    A.holes.forEach(function(h){
      var y = qv(h.h), lab = o.noLabels ? "" : (o.q ? "?" : ptT(Q(h.a), h.h));
      if (o.drop != null && o.drop < 1) y = p.v.ymax + (y - p.v.ymax) * o.drop;
      if (!openDot(ctx, p, h.a, y, { label:o.drop != null && o.drop < 1 ? "" : lab }) && !o.noLabels) edgeMark(ctx, p, h.a, qv(h.h), lab);
    });
  };
  return sc;
}
function ftDescribe(A, U){
  var s = "Graph of " + MV.plain(M("f(x) = " + ratSrc(A.c, A.top, A.bot))) + ".";
  if (A.holes.length) s += " " + A.holes.map(function(h){ return "Hole at " + ptT(Q(h.a), h.h) + "."; }).join(" ");
  if (A.vas.length) s += " Vertical asymptote" + (A.vas.length > 1 ? "s " : " ") + A.vas.map(function(v){ return "x = " + num(v.a); }).join(" and ") + ".";
  return s + " " + MV.plain(farText(A, U)) + ".";
}
function ftBuilder(host, o){
  var U = o.ui;
  host.innerHTML = '<div class="ft"><div class="ft-row" data-row="top" role="group" aria-label="' + MV.esc(U.top) + '"></div><div class="ft-bar" aria-hidden="true"></div><div class="ft-row" data-row="bot" role="group" aria-label="' + MV.esc(U.bottom) + '"></div><svg class="ft-links" aria-hidden="true"></svg></div>';
  var wrap = host.firstChild;
  function btn(act, row, i, txt, lab, dis, cls){ return '<button type="button" class="' + (cls || "ft-b") + '" data-act="' + act + '" data-row="' + row + '" data-i="' + i + '" data-k="ft' + row + i + act + '" aria-label="' + MV.esc(lab) + '"' + (dis ? " disabled" : "") + ">" + txt + "</button>"; }
  function tile(row, i, r, cls, canRm){
    var f = M(facP(r)), name = (row === "top" ? U.top : U.bottom) + " tile " + (i + 1) + ", " + MV.plain(f);
    return '<span class="ft-tile' + cls + '" data-row="' + row + '" data-i="' + i + '">' + btn("dec", row, i, MINUS, name + ": " + U.dec + " r", r <= -5) +
      '<span class="ft-f">' + f + "</span>" + btn("inc", row, i, "+", name + ": " + U.inc + " r", r >= 5) + (canRm ? btn("rm", row, i, "×", U.remove + " " + name, false, "ft-x") : "") + "</span>";
  }
  function paint(){
    var st = o.get(), pairs = ftPairs(st), mt = {}, mb = {}, hide = o.hidden && o.hidden(), cancelled = o.cancelled && o.cancelled();
    pairs.forEach(function(p){ mt[p[0]] = 1; mb[p[1]] = 1; });
    var extra = o.cls || function(){ return ""; };
    var top = '<span class="ft-lab">' + U.top + "</span>" + '<span class="ft-const"><span class="ft-cl">' + U.constant + '</span><span class="ft-cb">' +
      btn("cdec", "c", 0, MINUS, U.constant + ": " + U.dec, st.c <= -3) + '<span class="ft-cv' + (st.c === 1 ? " one" : "") + '" aria-label="' + MV.esc(U.constant + " " + MV.plain(num(st.c))) + '">' + (st.c === -1 ? MINUS : num(st.c)) + "</span>" +
      btn("cinc", "c", 0, "+", U.constant + ": " + U.inc, st.c >= 3) + "</span></span>" +
      st.top.map(function(r, i){ return tile("top", i, r, (mt[i] ? " match" + (cancelled ? " struck" : "") : "") + extra("top", i), true); }).join("") +
      '<button type="button" class="btn ghost sm ft-add" data-act="add" data-row="top" data-i="0" data-k="fttopadd"' + (st.top.length >= (o.maxTop || 3) ? " disabled" : "") + ">" + U.addTile + "</button>";
    var bot = '<span class="ft-lab">' + U.bottom + "</span>" + st.bot.map(function(r, i){ return tile("bot", i, r, (mb[i] ? " match" + (cancelled ? " struck" : "") : "") + extra("bot", i), st.bot.length > 1); }).join("") +
      '<button type="button" class="btn ghost sm ft-add" data-act="add" data-row="bot" data-i="0" data-k="ftbotadd"' + (st.bot.length >= (o.maxBot || 2) ? " disabled" : "") + ">" + U.addTile + "</button>";
    MV.keepFocus(host, function(){ $('[data-row="top"].ft-row', wrap).innerHTML = top; $('[data-row="bot"].ft-row', wrap).innerHTML = bot; });
    wrap.classList.toggle("hid", !!hide);
    links();
  }
  function links(){
    var svg = $(".ft-links", wrap), st = o.get(), wr = wrap.getBoundingClientRect(); if (!wr.width) return;
    svg.setAttribute("width", wr.width); svg.setAttribute("height", wr.height);
    svg.innerHTML = ftPairs(st).map(function(p){
      var a = tileEl("top", p[0]), b = tileEl("bot", p[1]); if (!a || !b) return "";
      var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      return '<line x1="' + (ra.left - wr.left + ra.width / 2) + '" y1="' + (ra.bottom - wr.top) + '" x2="' + (rb.left - wr.left + rb.width / 2) + '" y2="' + (rb.top - wr.top) + '"/>';
    }).join("");
  }
  function tileEl(row, i){ return wrap.querySelector('.ft-tile[data-row="' + row + '"][data-i="' + i + '"]'); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button[data-act]"); if (!b || b.disabled || (o.busy && o.busy())) return;
    var st = o.get(), n = { c:st.c, top:st.top.slice(), bot:st.bot.slice() }, act = b.dataset.act, row = b.dataset.row, i = +b.dataset.i, arr = n[row];
    if (act === "cdec" || act === "cinc") { var c = n.c + (act === "cinc" ? 1 : -1); if (c === 0) c += act === "cinc" ? 1 : -1; if (c < -3 || c > 3) return; n.c = c; }
    else if (act === "dec" || act === "inc") arr[i] = clamp(arr[i] + (act === "inc" ? 1 : -1), -5, 5);
    else if (act === "rm") arr.splice(i, 1);
    else if (act === "add") arr.push(0);
    o.set(n, act);
  });
  if (window.ResizeObserver) new ResizeObserver(links).observe(wrap);
  return { paint:paint, links:links, tile:tileEl, wrap:wrap };
}

// ---------- N22 division board (synthetic division of a quadratic by x − r) ----------
// @component N22 syntheticDivision (adapted from MHF4U 11) — corner box, top / products / bottom rows, staged cells with a
// highlight and an arrow from the number being multiplied; quotient bold and remainder boxed at the end
function divInfo(d){ var q0 = d.p1 + d.p2 * d.r, R = d.p0 + d.r * q0; return { p:[d.p2, d.p1, d.p0], q:[d.p2, q0], q0:q0, R:R, r:d.r, m1:d.p2 * d.r, m2:q0 * d.r,
  f:function(x){ return (d.p2 * x * x + d.p1 * x + d.p0) / (x - d.r); }, line:function(x){ return d.p2 * x + q0; } }; }
function boardHTML(d, s, U){
  var D = divInfo(d), fin = s >= 5;
  function td(id, v, show, cls){ return '<td data-g="' + id + '" class="' + (cls || "") + '">' + (show ? num(v) : "") + "</td>"; }
  return '<table class="sg"><caption class="vh">' + U.board + "</caption><thead><tr><td></td><th scope=\"col\">" + M("x^2") + '</th><th scope="col">' + M("x") + '</th><th scope="col"><span class="sg-c">constant</span></th></tr></thead><tbody>' +
    '<tr class="sg-top"><th scope="row"><span class="vh">' + U.corner + ' </span><span class="sg-box">' + num(d.r) + "</span></th>" + td("t0", d.p2, true) + td("t1", d.p1, true) + td("t2", d.p0, true) + "</tr>" +
    '<tr class="sg-mid"><th scope="row"></th><td></td>' + td("m1", D.m1, s >= 2) + td("m2", D.m2, s >= 4) + "</tr>" +
    '<tr class="sg-bot"><th scope="row"></th>' + td("b0", d.p2, s >= 1, fin ? "q fin" : "q") + td("b1", D.q0, s >= 3, fin ? "q fin" : "q") + td("b2", D.R, s >= 5, "sg-rem" + (fin ? " fin" : "")) + "</tr></tbody></table>";
}
function boardSay(d, s, U){
  var D = divInfo(d), par = function(v){ return v < 0 ? "(" + num(v) + ")" : num(v); };
  if (s === 0) return U.startStep;
  if (s === 1) return F(U.bring, [num(d.p2)]);
  if (s === 2) return F(U.mult, [num(d.p2), par(d.r), num(D.m1)]);
  if (s === 3) return F(U.add, [num(d.p1), par(D.m1), num(D.q0)]);
  if (s === 4) return F(U.mult, [num(D.q0), par(d.r), num(D.m2)]);
  return F(U.add, [num(d.p0), par(D.m2), num(D.R)]) + " " + F(U.doneStep, [M(psrc(D.q)), num(D.R)]);
}

// ---------- hero ----------
var HV = { xmin:-5, xmax:7, ymin:-5, ymax:9 };
function hero(f){
  if (!f.canvas) return;
  var U = MV.C.hero.ui, sign = $("#h21-sign"), eqP = sign ? sign.closest(".hero-eq") : null, p = new MV.Plot(f.canvas, HV), st = { phase:1, draw:0, t:0 };
  function line(x){ return x + 1; }
  p.render = function(){
    var pen = css("--pen"), ink2 = css("--ink-2"), t = st.t, sc = { view:HV, curves:[], segments:[], describe:st.phase === 3 ? U.desc2 : U.desc1 };
    if (st.phase === 1) {
      var xr = HV.xmin + (HV.xmax - HV.xmin) * st.draw;
      sc.curves.push({ f:line, domain:[HV.xmin - 1, xr], color:pen, width:3.2 });
      sc.after = function(ctx, q){ if (xr >= 1) openDot(ctx, q, 1, 2, { label:U.hole }); };
    } else if (st.phase === 2) {
      sc.curves.push({ f:line, color:pen, width:3.2, alpha:1 - t });
      sc.curves.push({ f:function(x){ return x + 1 + 2 * t / (x - 1); }, color:pen, width:3.2 });
      sc.after = function(ctx, q){
        dashLine(ctx, q, 1, 1, { alpha:t, label:"" });
        dashV(ctx, q, 1, { to:q.H * t });
        openDot(ctx, q, 1, 2, { alpha:1 - t });
      };
    } else {
      sc.asymptotes = [{ x:1, label:U.va }];
      sc.curves.push({ f:function(x){ return (x * x + 1) / (x - 1); }, color:pen, width:3.2, arrows:true });
      sc.after = function(ctx, q){ dashLine(ctx, q, 1, 1, { label:U.line, at:[0.9, 0.82, 0.2] }); };
    }
    p.draw(sc);
  };
  function endFrame(){ st.phase = 3; if (sign) sign.textContent = "+"; if (eqP) eqP.setAttribute("aria-label", "f of x equals x squared plus 1, all over x minus 1"); f.cap.innerHTML = '<span class="h21-end"><strong>' + U.end1 + "</strong> " + U.cap1 + '</span><span class="h21-end"><strong>' + U.end2 + "</strong> " + U.cap2 + "</span>"; p.render(); }
  if (MV.reduceMotion) { endFrame(); return; }
  f.cap.innerHTML = U.cap1; p.render();
  MV.tween({ dur:1600, ease:function(t){ return t; }, step:function(t){ st.draw = t; p.render(); }, done:function(){
    MV.wait(1000, function(){
      if (sign) sign.classList.add("pulse");
      MV.wait(1200, function(){
        if (sign) { sign.textContent = "+"; sign.classList.remove("pulse"); }
        st.phase = 2;
        MV.tween({ dur:2000, ease:function(t){ return t; }, step:function(t){ st.t = t; p.render(); }, done:function(){
          st.phase = 3; f.cap.innerHTML = U.cap2; p.render();
          MV.wait(3000, endFrame);
        } });
      });
    });
  } });
}

// ---------- Explore: Cancel-and-divide lab ----------
var CV = { xmin:-8, xmax:8, ymin:-8, ymax:8 };
var ZV = [{ xmin:-10, xmax:10, ymin:-12, ymax:12 }, { xmin:-40, xmax:40, ymin:-48, ymax:48 }, { xmin:-160, xmax:160, ymin:-192, ymax:192 }];
var ZSTEP = [0.5, 2, 8], ZNAME = [1, 4, 16];
var EXP = null;
function explore(host, api){
  var C = api.content, U = C.ui, R = U.rows, S = api.S;
  if (!S.mode) S.mode = "cancel";
  if (!S.cancel) S.cancel = { c:1, top:[-1, 2], bot:[2, -3], cancelled:false };
  if (!S.div) S.div = { p2:1, p1:1, p0:-2, r:2, z:0, x0:8, divided:false, table:false };
  var T = { view:cp(S.mode === "cancel" ? CV : ZV[S.div.z]), busy:false, anim:null, rough:false, hideTiles:false, drop:null, freeze:null, p2t:null, pulse:null,
    oaReveal:1, hideProbe:false, cmp:false, gaps26:false, morph:null, pop:1, deferOA:false, silent:false, lastR:null, fresh:null };
  var L = MV.pgLayout(host, { aria:"Cancel-and-divide lab graph" });
  host.firstChild.classList.add("h21");
  L.graph.insertAdjacentHTML("afterbegin", '<div id="h21-mode"></div>');
  L.cap.insertAdjacentHTML("afterend", '<div class="h21-sub" id="h21-sub" aria-live="polite"></div>');
  L.graph.insertAdjacentHTML("beforeend", '<p class="tiny muted h21-note" id="h21-note" aria-live="polite"></p><div id="h21-zoom" class="q-actions h21-zoom"><button type="button" class="btn ghost sm" id="h21-zo">' + U.zoomOut + '</button><button type="button" class="btn ghost sm" id="h21-zi">' + U.zoomIn + '</button><button type="button" class="btn ghost sm" id="h21-zr">' + U.reset + '</button><span class="tiny muted" id="h21-zl"></span></div>' +
    '<div id="h21-gt" class="h21-gt"><button type="button" class="btn ghost sm" id="h21-gtb" aria-expanded="false"></button><div id="h21-tbl"></div></div>');
  L.ctrl.innerHTML = '<div id="h21-cancel"><div id="h21-tiles"></div><div class="q-actions"><button type="button" class="btn primary sm" id="h21-cbtn">' + U.cancelBtn + '</button></div><p class="tiny muted">' + U.tileNote + "</p></div>" +
    '<div id="h21-divide"><div class="h21-st" id="h21-p2"></div><div id="h21-sl"></div><p class="tiny muted">' + U.boxNote + '</p><h3 class="h21-bh">' + U.board + '</h3><div class="sg-wrap" id="h21-board" tabindex="0" aria-label="' + MV.esc(U.board) + '"></div><div id="h21-pl"></div><p class="h21-say" id="h21-say" aria-live="polite"></p></div>';
  L.read.classList.add("h21-read");
  var plot = new MV.Plot(L.canvas, T.view);

  // ----- mode switch -----
  var modeSeg = MV.seg($("#h21-mode", host), { label:"Mode", options:[{ id:"cancel", t:U.modes[0] }, { id:"divide", t:U.modes[1] }], value:S.mode, onChange:function(v){
    if (T.busy) { modeSeg.set(S.mode); return; }
    S.mode = v; clearTransient(); stopAnim(); T.view = cp(v === "cancel" ? CV : ZV[S.div.z]); api.save(); paintAll(); MV.changed();
  } });

  // ----- Cancel mode: tiles -----
  var tb = ftBuilder($("#h21-tiles", host), { ui:U, get:function(){ return S.cancel; }, cancelled:function(){ return S.cancel.cancelled; }, hidden:function(){ return T.hideTiles; },
    busy:function(){ return T.busy; }, cls:function(row, i){ return (T.pulse && T.pulse[0] === row && T.pulse[1] === i ? " pulse" : "") + (T.fresh && T.fresh[0] === row && T.fresh[1] === i ? " drop" : ""); },
    set:function(n){ S.cancel = { c:n.c, top:n.top, bot:n.bot, cancelled:false }; clearTransient(); api.save(); paintAll(); MV.changed(); } });
  $("#h21-cbtn", host).addEventListener("click", function(){ if (T.busy || S.cancel.cancelled || !ftPairs(S.cancel).length) return; cancelAnim(); });
  function cancelAnim(done){
    var pairs = ftPairs(S.cancel), els = [];
    pairs.forEach(function(p){ els.push(tb.tile("top", p[0]), tb.tile("bot", p[1])); });
    els = els.filter(Boolean); T.busy = true; syncButtons();
    els.forEach(function(e){ e.classList.add("glow"); });
    MV.wait(200, function(){
      els.forEach(function(e){ e.classList.add("slide"); });
      MV.wait(400, function(){
        els.forEach(function(e){ e.classList.add("striking"); });
        MV.wait(200, function(){
          var old = snap();
          T.busy = false; S.cancel.cancelled = true; api.save(); paintAll(); flash(old);
          var sub = $("#h21-sub", host); sub.classList.remove("fade"); void sub.offsetWidth; sub.classList.add("fade");
          var A = ftAnalyse(S.cancel), msg = F(U.cancelled, [A.common.map(function(c){ return M(facP(c.r)) + (c.k > 1 ? " ×" + c.k : ""); }).join(", ")]);
          A.common.forEach(function(c){ var h = A.holes.filter(function(x){ return x.a === c.r; })[0]; msg += " " + (h ? F(U.holeAt, [ptT(Q(h.a), h.h)]) : F(U.noHoleLeft, [M(facP(c.r)), num(c.r)])); });
          banner("", msg); MV.changed();
          if (done) done();
        });
      });
    });
  }

  // ----- Divide mode: controls -----
  var P2V = [-2, -1, 1, 2];
  function paintP2(){ MV.keepFocus($("#h21-p2", host), function(){ $("#h21-p2", host).innerHTML = '<span class="h21-stl">' + U.p2 + '</span><span class="ft-cb"><button type="button" class="ft-b" data-p2="-1" data-k="p2d" aria-label="' + MV.esc(MV.plain(U.p2) + ": " + U.dec) + '"' + (S.div.p2 <= -2 ? " disabled" : "") + ">" + MINUS + '</button><output class="h21-p2v">' + num(S.div.p2) + '</output><button type="button" class="ft-b" data-p2="1" data-k="p2i" aria-label="' + MV.esc(MV.plain(U.p2) + ": " + U.inc) + '"' + (S.div.p2 >= 2 ? " disabled" : "") + ">+</button></span>"; }); }
  $("#h21-p2", host).addEventListener("click", function(e){ var b = e.target.closest("[data-p2]"); if (!b || T.busy) return; var i = P2V.indexOf(S.div.p2) + (+b.dataset.p2); if (i < 0 || i > 3) return; S.div.p2 = P2V[i]; divChange(); });
  var sl = MV.sliders($("#h21-sl", host), [
    { id:"p1", label:U.p1, min:-9, max:9, step:1, value:S.div.p1 },
    { id:"p0", label:U.p0, min:-9, max:9, step:1, value:S.div.p0 },
    { id:"r", label:U.r, min:-5, max:5, step:1, value:S.div.r, fmt:function(v){ return MV.plain(M(fac(v))); } }], function(id, v){ if (T.busy) { sl.set(id, S.div[id]); return; } S.div[id] = v; divChange(); });
  $$("input", $("#h21-sl", host)).forEach(function(i){ i.style.accentColor = "var(--ink)"; });
  $$("output", $("#h21-sl", host)).forEach(function(o){ o.style.color = "var(--ink)"; });
  var boardStep = 0;
  var pl = MV.player($("#h21-pl", host), { count:6, interval:700, label:function(i){ return i === 0 ? "" : F(U.stepOf, [i, 5]); }, render:function(i){ boardStep = i; paintBoard(true); if (i === 5 && !S.div.divided) finishDivision(); } });
  function paintBoard(fresh){
    var bw = $("#h21-board", host); bw.innerHTML = boardHTML(S.div, boardStep, U) + '<svg class="sg-svg" aria-hidden="true"></svg>';
    $("#h21-say", host).innerHTML = boardSay(S.div, boardStep, U);
    if (!fresh || !boardStep) return;
    var ids = [null, "b0", "m1", "b1", "m2", "b2"], cell = $('[data-g="' + ids[boardStep] + '"]', bw);
    if (cell) { cell.classList.add("hl"); MV.wait(500, function(){ cell.classList.remove("hl"); }); }
    if (boardStep === 2 || boardStep === 4) arrow(bw, boardStep === 2 ? "b0" : "b1", boardStep === 2 ? "m1" : "m2");
  }
  function arrow(wrap, a, b){
    var svg = $(".sg-svg", wrap), ea = $('[data-g="' + a + '"]', wrap), eb = $('[data-g="' + b + '"]', wrap); if (!svg || !ea || !eb || MV.reduceMotion) return;
    var wr = wrap.getBoundingClientRect(), ra = ea.getBoundingClientRect(), rb = eb.getBoundingClientRect();
    var x0 = ra.left - wr.left + ra.width / 2 + wrap.scrollLeft, y0 = ra.top - wr.top + 6, x1 = rb.left - wr.left + rb.width / 2 - 8 + wrap.scrollLeft, y1 = rb.top - wr.top + rb.height / 2;
    svg.setAttribute("width", wrap.scrollWidth); svg.setAttribute("height", wrap.scrollHeight);
    svg.innerHTML = '<defs><marker id="h21-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs><path class="sg-arrow" d="M' + x0 + " " + y0 + " Q" + ((x0 + x1) / 2) + " " + (Math.min(y0, y1) - 14) + " " + x1 + " " + y1 + '" marker-end="url(#h21-ah)"/>';
  }
  $("#h21-board", host).addEventListener("keydown", function(e){ if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); pl.go(boardStep + (e.key === "ArrowRight" ? 1 : -1)); } });
  function finishDivision(){
    S.div.divided = true; api.save();
    if (T.silent || T.deferOA) { T.oaReveal = T.deferOA ? 0 : 1; paintAll(); MV.changed(); return; }
    T.oaReveal = 0; paintAll(); MV.changed();
    T.anim = MV.tween({ dur:600, ease:function(t){ return t; }, step:function(t){ T.oaReveal = t; plot.render(); }, done:function(){ T.anim = null; T.oaReveal = 1; plot.render(); } });
  }
  function divChange(){
    var was = divInfo(T.lastD || S.div);
    clearTransient(); S.div.divided = false; T.oaReveal = 1;
    var now = divInfo(S.div);
    if (now.R === 0 && was.R !== 0 && !MV.reduceMotion) {
      T.morph = { from:{ p2:T.lastD.p2, p1:T.lastD.p1, p0:T.lastD.p0, r:T.lastD.r }, t:0 };
      stopAnim(); T.anim = MV.tween({ dur:300, step:function(t){ T.morph.t = t; T.pop = t; plot.render(); }, done:function(){ T.morph = null; T.pop = 1; T.anim = null; plot.render(); } });
    }
    S.div.x0 = skipR(S.div.x0, 1);
    api.save(); T.silent = true; pl.go(0); T.silent = false; paintAll(); MV.changed();
  }
  function skipR(x, dir){ return x === S.div.r ? x + dir * ZSTEP[S.div.z] : x; }

  // ----- zoom (G10) -----
  function stopAnim(){ if (T.anim) { T.anim(); T.anim = null; } }
  function goView(target, dur, done){
    stopAnim(); var from = cp(T.view);
    T.anim = MV.tween({ dur:dur, step:function(t){ T.view = lerpV(from, target, t); plot.render(); }, done:function(){ T.anim = null; T.view = cp(target); plot.render(); if (done) done(); } });
  }
  function zoomTo(z, done){
    if (z < 0 || z > 2) return;
    S.div.z = z; var v = ZV[z]; S.div.x0 = clamp(S.div.x0, v.xmin, v.xmax); S.div.x0 = skipR(S.div.x0, -1); api.save(); syncButtons();
    goView(v, 800, function(){ paintAll(); if (done) done(); });
  }
  $("#h21-zo", host).addEventListener("click", function(){ if (!T.busy) zoomTo(S.div.z + 1); });
  $("#h21-zi", host).addEventListener("click", function(){ if (!T.busy) zoomTo(S.div.z - 1); });
  $("#h21-zr", host).addEventListener("click", function(){ if (!T.busy) zoomTo(0); });
  $("#h21-gtb", host).addEventListener("click", function(){ S.div.table = !S.div.table; api.save(); paintTable(); });

  // ----- gap probe (G7) -----
  var drag = MV.drag(plot, {
    axis:"x",
    handles:function(){
      if (S.mode !== "divide" || T.hideProbe || T.busy) return [];
      var D = divInfo(S.div), v = plot.v || T.view, y = D.R === 0 ? D.line(S.div.x0) : D.f(S.div.x0);
      return [{ id:"P", x:S.div.x0, y:clamp(isFinite(y) ? y : 0, v.ymin, v.ymax), label:F(U.probe, [num(S.div.x0)]) }];
    },
    move:function(id, x){ var st = ZSTEP[S.div.z], v = ZV[S.div.z], nx = clamp(Math.round(x / st) * st, v.xmin, v.xmax); if (nx === S.div.r) nx += x > S.div.x0 ? st : -st; if (nx === S.div.x0) return; S.div.x0 = nx; api.save(); paintAll(); },
    key:function(id, e){
      var st = ZSTEP[S.div.z], v = ZV[S.div.z], k = e.key, d = k === "ArrowRight" || k === "ArrowUp" ? 1 : k === "ArrowLeft" || k === "ArrowDown" ? -1 : 0, nx;
      if (k === "Home") nx = Math.ceil(v.xmin / st) * st; else if (k === "End") nx = Math.floor(v.xmax / st) * st; else if (d) nx = S.div.x0 + d * st * (e.shiftKey ? 10 : 1); else return false;
      nx = clamp(nx, v.xmin, v.xmax); if (nx === S.div.r) nx += (d || (k === "Home" ? 1 : -1)) * st;
      S.div.x0 = nx; api.save(); paintAll(); return true;
    }
  });

  // ----- drawing -----
  plot.render = function(){ if (S.mode === "cancel") drawCancel(); else drawDivide(); };
  function drawCancel(){
    var st = T.freeze || S.cancel, A = ftAnalyse(st), sc;
    if (T.p2t != null) {
      var t = T.p2t, pen = css("--pen");
      sc = { curves:[{ f:function(x){ return x + 2; }, color:pen, width:3, alpha:1 - t }, { f:function(x){ return (x + 2) / (x - 1); }, color:pen, width:3, alpha:t }], asymptotes:t >= 1 ? [{ x:1 }, { y:1 }] : [],
        after:function(ctx, p){ if (t < 1) { var Y = p.Y(3); dashV(ctx, p, 1, { from:Y - Y * t, to:Y + (p.H - Y) * t }); openDot(ctx, p, 1, 3, { alpha:1 - t }); } } };
    } else sc = ftScene(A, { rough:T.rough, q:!st.cancelled, drop:T.drop });
    sc.view = T.view; sc.describe = ftDescribe(A, U);
    if (yAxisOff(T.view)) { sc.yTicks = { fmt:blank }; var af = sc.after; sc.after = function(ctx, p){ if (af) af(ctx, p); yLabelsLeft(ctx, p); }; }
    plot.draw(sc);
  }
  function drawDivide(){
    var d = S.div, D = divInfo(d), pen = css("--pen"), ink2 = css("--ink-2"), mo = T.morph, sc = { view:T.view, curves:[], asymptotes:[] };
    if (mo) { var O = divInfo(mo.from); sc.curves.push({ f:function(x){ return (1 - mo.t) * O.f(x) + mo.t * D.line(x); }, color:pen, width:3 }); }
    else sc.curves.push({ f:D.R === 0 ? D.line : D.f, color:pen, width:3, arrows:true });
    var showOA = d.divided && D.R !== 0;
    if (D.R !== 0 && !mo) sc.asymptotes.push({ x:d.r, label:"x = " + num(d.r) });
    if (showOA && T.oaReveal >= 1) sc.asymptotes.push({ m:D.q[0], b:D.q0, label:"" });
    sc.after = function(ctx, p){
      if (mo) dashV(ctx, p, mo.from.r, { alpha:1 - mo.t });
      if (T.cmp) [[1, 1], [1, 0], [0, 1, "y = 1"]].forEach(function(l){ dashLine(ctx, p, l[0], l[1], { dash:[2, 5], alpha:0.75, label:l[2] || "", at:[0.9] }); });
      if (showOA) dashLine(ctx, p, D.q[0], D.q0, { reveal:T.oaReveal, label:T.oaReveal >= 1 ? MV.plain(M("y = " + psrc(D.q))) : "", dash:T.oaReveal >= 1 ? [0, 1e9] : [8, 6] });
      if (D.R === 0 && !mo) openDot(ctx, p, d.r, D.line(d.r), { r:5 * T.pop, label:T.pop >= 1 ? ptT(Q(d.r), Q(D.line(d.r))) : "" });
      if (!T.hideProbe && S.mode === "divide") {
        var x0 = d.x0, X = p.X(x0);
        ctx.save(); ctx.strokeStyle = ink2; ctx.globalAlpha = 0.8; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, p.H); ctx.stroke(); ctx.restore();
        if (showOA && T.oaReveal >= 1) {
          var y1 = D.f(x0), y2 = D.line(x0), Y1 = clamp(p.Y(y1), -20, p.H + 20), Y2 = clamp(p.Y(y2), -20, p.H + 20), hi = css("--hi");
          ctx.save(); ctx.strokeStyle = hi; ctx.lineWidth = 5; ctx.lineCap = "butt"; ctx.beginPath(); ctx.moveTo(X, Y1); ctx.lineTo(X, Y2); ctx.moveTo(X - 7, Y1); ctx.lineTo(X + 7, Y1); ctx.moveTo(X - 7, Y2); ctx.lineTo(X + 7, Y2); ctx.stroke(); ctx.restore();
          var g = qdiv(Q(D.R), qadd(half(x0), Q(-d.r)));
          p.label({ x:x0, y:p.yOf((Y1 + Y2) / 2), text:(g.n > 0 ? "+" : "") + qT(g), dx:X > p.W - 90 ? -12 : 12, align:X > p.W - 90 ? "right" : "left", bg:true, font:"600 14px " + p.fontM });
        }
      }
    };
    var desc = "Graph of " + MV.plain(M("f(x) = {" + psrc(D.p) + "}/{" + fac(d.r) + "}")) + ". " + (D.R === 0 ? "The line " + MV.plain(M("y = " + psrc(D.q))) + " with a hole at " + ptT(Q(d.r), Q(D.line(d.r))) + "." : "Vertical asymptote x = " + num(d.r) + "." + (showOA ? " Oblique asymptote " + MV.plain(M("y = " + psrc(D.q))) + "." : "")) + (T.hideProbe ? "" : " Probe at x = " + num(d.x0) + ".");
    sc.describe = desc;
    plot.draw(sc);
  }

  // ----- caption, readout, table -----
  function banner(kind, html){ L.banner.className = "banner" + (kind ? " " + kind : ""); L.banner.innerHTML = html || ""; }
  function rowsHTML(rows){ return rows.map(function(r){ return '<div data-r="' + r[0] + '"><dt>' + R[r[0]] + "</dt><dd>" + r[1] + "</dd></div>"; }).join(""); }
  function snap(){ var o = {}; $$("[data-r]", L.read).forEach(function(d){ o[d.dataset.r] = d.querySelector("dd").innerHTML; }); return o; }
  function flash(old, keys){ $$("[data-r]", L.read).forEach(function(d){ var k = d.dataset.r; if (keys ? keys.indexOf(k) >= 0 : (old && old[k] !== d.querySelector("dd").innerHTML)) { d.classList.remove("flash"); void d.offsetWidth; d.classList.add("flash"); } }); MV.wait(1100, function(){ $$("[data-r].flash", L.read).forEach(function(d){ d.classList.remove("flash"); }); }); }
  function cancelRows(A, cancelled){
    var xs = A.xints.map(function(t){ return "(" + num(t) + ", 0)"; }).join(", ") || U.none, notes = A.xnotes.map(function(n){ return F(n.hole ? U.xNoteHole : U.xNoteVA, [num(n.a)]); }).join(" ");
    return [["fn", M("f(x) = " + ratSrc(A.c, A.top, A.bot))], ["restr", A.restr.map(function(a){ return M("x ≠ " + a); }).join(", ")],
      ["common", A.common.map(function(c){ return M(facP(c.r)) + ", " + (c.k === 1 ? U.once : U.twice); }).join("; ") || U.none],
      ["simp", simpText(A, U, cancelled)], ["dom", M("{x ∈ ℝ | " + A.restr.map(function(a){ return "x ≠ " + a; }).join(", ") + "}")],
      ["holes", holesText(A, U, cancelled)], ["va", vasText(A, U)], ["far", farText(A, U)], ["xint", xs + (notes ? ". " + notes : "")], ["yint", A.yint ? ptT(Q(0), A.yint) : U.yNone]];
  }
  function xIntsText(d){
    var a = d.p2, b = d.p1, c = d.p0, Dsc = b * b - 4 * a * c, out = [];
    if (Dsc >= 0) {
      var s = Math.round(Math.sqrt(Dsc));
      if (s * s === Dsc) uniq([-b - s, -b + s]).map(function(n){ return Q(n, 2 * a); }).sort(function(x, y){ return qv(x) - qv(y); }).forEach(function(v){ if (Math.abs(qv(v) - d.r) > 1e-9 && !out.some(function(o){ return o === "(" + qT(v) + ", 0)"; })) out.push("(" + qT(v) + ", 0)"); });
      else [(-b - Math.sqrt(Dsc)) / (2 * a), (-b + Math.sqrt(Dsc)) / (2 * a)].sort(function(x, y){ return x - y; }).forEach(function(v){ out.push("≈ (" + num(v, 2) + ", 0)"); });
    }
    return out.length ? out.join(" " + U.and + " ") : U.intsNoneX;
  }
  function divRows(){
    var d = S.div, D = divInfo(d), dv = d.divided, rows = [], q = psrc(D.q), term = "{" + (D.R < 0 ? "-" : "") + Math.abs(D.R) + "}/{" + fac(d.r) + "}";
    var div = d.r === 0 ? "x" : "(" + fac(d.r) + ")", prod = D.q0 === 0 && d.r !== 0 ? q + div : div + "(" + q + ")";
    rows.push(["div", dv ? M(psrc(D.p) + " = " + prod + (D.R ? (D.R > 0 ? " + " : " - ") + Math.abs(D.R) : "")) : U.runDiv]);
    rows.push(["rew", dv ? M("f(x) = " + q + (D.R ? (D.R > 0 ? " + " : " - ") + "{" + Math.abs(D.R) + "}/{" + fac(d.r) + "}" : "")) + (D.R ? "" : ", " + M("x ≠ " + d.r)) : U.q]);
    rows.push(["va1", D.R ? F(U.vaRow, [num(d.r), sgnInf(-D.R), sgnInf(D.R)]) : F(U.vaHole, [num(d.r), ptT(Q(d.r), Q(D.line(d.r)))])]);
    rows.push(["oa", D.R === 0 ? F(U.oaNone, [M("y = " + q)]) : dv ? M("y = " + q) : U.q]);
    rows.push(["side", D.R === 0 ? U.sideLine : dv ? F(D.R > 0 ? U.sideAbove : U.sideBelow, [M("y = " + q), M(term), num(d.r)]) : U.q]);
    if (D.R !== 0) rows.push(["cross", dv ? F(U.cross, [M(term)]) : U.q]);
    if (D.R !== 0) {
      if (dv && !T.hideProbe) {
        var X0 = half(d.x0), g = qdiv(Q(D.R), qadd(X0, Q(-d.r))), den = String(d.x0) + (d.r >= 0 ? " - " + d.r : " + " + (-d.r));
        rows.push(["gap", F(U.gapRow, [num(d.x0), M("{" + D.R + "}/{" + den + "}"), qT(g), sig(qv(g), 3), g.n > 0 ? U.above : U.below])]);
      } else rows.push(["gap", U.q]);
    }
    if (T.gaps26) rows.push(["gaps26", U.gaps26]);
    rows.push(["ints", F(U.intsRow, [xIntsText(d), d.r === 0 ? U.yNone : ptT(Q(0), Q(d.p0, -d.r))])]);
    return rows;
  }
  function paintTable(){
    var b = $("#h21-gtb", host), box = $("#h21-tbl", host), d = S.div, D = divInfo(d);
    b.textContent = S.div.table ? U.gapTableHide : U.gapTable; b.setAttribute("aria-expanded", String(!!S.div.table));
    if (!S.div.table) { box.innerHTML = ""; return; }
    if (!d.divided) { box.innerHTML = '<p class="tiny muted">' + U.gapNeedsDiv + "</p>"; return; }
    box.innerHTML = MV.tableHTML({ head:U.gapHead, caption:U.gapTable, rows:[-1000, -100, -10, 10, 100, 1000].map(function(x){ var g = Q(D.R, x - d.r); return [num(x), num(D.f(x), 3), num(D.line(x), 3), qT(g), sig(qv(g), 3)]; }) });
  }
  function syncButtons(){
    var cm = S.mode === "cancel";
    $("#h21-cancel", host).hidden = !cm; $("#h21-divide", host).hidden = cm; $("#h21-zoom", host).hidden = cm; $("#h21-gt", host).hidden = cm;
    $("#h21-cbtn", host).disabled = T.busy || S.cancel.cancelled || !ftPairs(S.cancel).length || T.hideTiles;
    $("#h21-zo", host).disabled = T.busy || S.div.z >= 2; $("#h21-zi", host).disabled = T.busy || S.div.z <= 0; $("#h21-zr", host).disabled = T.busy || S.div.z === 0;
    $("#h21-zl", host).textContent = F(U.zoomLab, [ZNAME[S.div.z]]);
  }
  function paintAll(){
    var cm = S.mode === "cancel";
    syncButtons();
    if (cm) {
      var st = S.cancel, A = ftAnalyse(st);
      tb.paint();
      L.cap.innerHTML = T.hideTiles ? M("f(x) = {x^2 - 2x - 3}/{x - 3}") : M("f(x) = " + ratSrc(A.c, A.top, A.bot));
      $("#h21-sub", host).innerHTML = st.cancelled && A.common.length ? "= " + M(ratSrc(A.c, A.lt, A.lb)) + (A.holes.length ? ", " + A.holes.map(function(h){ return M("x ≠ " + h.a); }).join(", ") : "") : "";
      L.read.innerHTML = rowsHTML(cancelRows(A, st.cancelled));
    } else {
      var d = S.div, D = divInfo(d);
      paintP2(); ["p1", "p0", "r"].forEach(function(k){ sl.set(k, d[k]); });
      L.cap.innerHTML = M("f(x) = {" + psrc(D.p) + "}/{" + fac(d.r) + "}");
      $("#h21-sub", host).innerHTML = d.divided ? "= " + M(psrc(D.q) + (D.R ? (D.R > 0 ? " + " : " - ") + "{" + Math.abs(D.R) + "}/{" + fac(d.r) + "}" : "")) + (D.R ? "" : ", " + M("x ≠ " + d.r)) : "";
      L.read.innerHTML = rowsHTML(divRows());
      if (D.R === 0) banner("", F(U.remainder0, [M(fac(d.r)), M("y = " + psrc(D.q)), ptT(Q(d.r), Q(D.line(d.r)))]));
      else if (L.banner.dataset.r0) banner("", "");
      L.banner.dataset.r0 = D.R === 0 ? "1" : "";
      paintTable();
    }
    $("#h21-note", host).innerHTML = S.mode === "divide" && T.cmp ? U.cmp : "";
    T.lastD = { p2:S.div.p2, p1:S.div.p1, p0:S.div.p0, r:S.div.r };
    plot.render();
  }
  function clearTransient(){ T.rough = false; T.hideTiles = false; T.drop = null; T.freeze = null; T.p2t = null; T.pulse = null; T.fresh = null; T.hideProbe = false; T.cmp = false; T.gaps26 = false; T.deferOA = false; banner("", ""); }

  // ----- predictions -----
  function predStart(p){
    stopAnim(); T.busy = false; clearTransient();
    if (p.mode === "cancel") { S.mode = "cancel"; S.cancel = { c:p.start.c, top:p.start.top.slice(), bot:p.start.bot.slice(), cancelled:!!p.start.cancelled }; T.view = cp(CV); if (p.id === "p1") { T.rough = true; T.hideTiles = true; } }
    else {
      S.mode = "divide"; S.div = { p2:p.start.p2, p1:p.start.p1, p0:p.start.p0, r:p.start.r, z:0, x0:8, divided:false, table:false }; T.view = cp(ZV[0]);
      if (p.id === "p4") T.hideProbe = true;
      T.silent = true; T.lastD = null; pl.go(p.start.divided ? 5 : 0); T.silent = false;
    }
    modeSeg.set(S.mode); api.save(); paintAll();
  }
  function predRun(p, done){
    T.busy = true; syncButtons();
    var end = function(){ T.busy = false; api.save(); paintAll(); MV.changed(); done(); };
    if (p.id === "p1") {
      T.hideTiles = false; paintAll(); T.busy = true; syncButtons();
      MV.wait(700, function(){
        cancelAnim(function(){
          T.busy = true;
          goView({ xmin:2.2, xmax:3.8, ymin:3.2, ymax:4.8 }, 800, function(){
            T.rough = false; T.drop = 0;
            T.anim = MV.tween({ dur:500, step:function(t){ T.drop = t; plot.render(); }, done:function(){ T.drop = null; T.anim = null; plot.render(); flash(null, ["dom", "holes"]);
              MV.wait(1600, function(){ goView(CV, 800, end); }); } });
          });
        });
      });
    } else if (p.id === "p2") {
      T.freeze = { c:S.cancel.c, top:S.cancel.top.slice(), bot:S.cancel.bot.slice(), cancelled:true };
      S.cancel.bot.push(1); S.cancel.cancelled = false; T.fresh = ["bot", 1]; paintAll(); T.busy = true; syncButtons();
      MV.wait(700, function(){
        T.fresh = null; T.busy = false;
        cancelAnim(function(){
          T.busy = true; var A = ftAnalyse(S.cancel), li = S.cancel.bot.lastIndexOf(1); T.pulse = ["bot", li]; void A; tb.paint();
          T.freeze = null; T.p2t = 0;
          T.anim = MV.tween({ dur:1400, step:function(t){ T.p2t = t; plot.render(); }, done:function(){ T.anim = null; T.p2t = null; T.pulse = null; MV.wait(400, end); } });
        });
      });
    } else if (p.id === "p3") {
      T.deferOA = true; var i = 0;
      var step = function(){ i++; pl.go(i); if (i < 5) MV.wait(700, step); else MV.wait(700, after); };
      var after = function(){
        zoomTo(1, function(){
          T.busy = true; T.cmp = true; T.oaReveal = 0;
          T.anim = MV.tween({ dur:600, ease:function(t){ return t; }, step:function(t){ T.oaReveal = t; plot.render(); }, done:function(){ T.anim = null; T.oaReveal = 1; T.deferOA = false; S.div.x0 = 26; T.gaps26 = true; paintAll(); MV.wait(500, end); } });
        });
      };
      MV.wait(300, step);
    } else if (p.id === "p4") {
      T.hideProbe = false; S.div.x0 = 3; paintAll();
      MV.wait(500, function(){
        T.anim = MV.tween({ dur:1800, ease:function(t){ return t; }, step:function(t){ var x = Math.round((3 + 5 * t) * 2) / 2; if (x !== S.div.x0) { S.div.x0 = x; paintAll(); } }, done:function(){
          T.anim = null; S.div.x0 = 8; S.div.table = true; paintAll();
          MV.wait(1800, function(){ S.div.x0 = -6; paintAll(); MV.wait(500, end); });
        } });
      });
    } else end();
  }

  // ----- challenges -----
  var CH = {}; C.challenges.forEach(function(c){ CH[c.id] = c.fb; });
  function chal(id){
    if (id === "tc1") {
      var st = S.cancel, A = ftAnalyse(st), tiles = !A.lb.length && eqArr(sortN(A.lt), [2]) && eqArr(A.restr, [1]), tp = sortN(st.top), bt = sortN(st.bot), fb = CH.tc1;
      if (tiles && st.c === 1) return { ok:true };
      if (st.c === 1 && eqArr(tp, [-2, 1]) && eqArr(bt, [1])) return { ok:false, msg:fb.plus2 };
      if (st.c === 1 && eqArr(tp, [-1, 2]) && eqArr(bt, [-1])) return { ok:false, msg:fb.holeNeg };
      if (st.c === 1 && eqArr(tp, [2]) && eqArr(bt, [1])) return { ok:false, msg:fb.noCancel };
      if (tiles) return { ok:false, msg:F(fb.constant, [num(st.c), M("y = " + (st.c === -1 ? "-" : st.c) + "(x - 2) = " + psrc([st.c, -2 * st.c]))]) };
      if (A.holes.length >= 2) return { ok:false, msg:fb.twoHoles };
      return { ok:false, msg:fb.other };
    }
    var d = S.div, D = divInfo(d), zero = F(CH.tc2.zero, [M(fac(d.r)), M("y = " + psrc(D.q)), ptT(Q(d.r), Q(D.line(d.r)))]);
    if (id === "tc2") {
      var f2 = CH.tc2;
      if (d.r === 3 && d.p2 === 1 && d.p1 === -5 && D.R !== 0) return { ok:true };
      if (D.R === 0) return { ok:false, msg:d.p2 === 1 && d.p1 === -5 && d.r === 3 && d.p0 === 6 ? f2.zeroLikely : zero };
      if (d.p1 === -2 && d.p2 === 1 && d.r === 3) return { ok:false, msg:f2.p1 };
      if (d.r === -3) return { ok:false, msg:f2.r };
      if (d.p2 !== 1) return { ok:false, msg:f2.p2 };
      return { ok:false, msg:f2.other };
    }
    if (id === "tc3") {
      var f3 = CH.tc3;
      if (d.r === -1 && d.p2 === 2 && d.p1 === 3 && D.R < 0) return { ok:true };
      if (D.R === 0) return { ok:false, msg:d.p2 === 2 && d.p1 === 3 && d.r === -1 && d.p0 === 1 ? f3.zeroLikely : zero };
      if (d.p1 === -1 && d.p2 === 2 && d.r === -1) return { ok:false, msg:f3.p1m1 };
      if (d.p1 === 1 && d.p2 === 2 && d.r === -1) return { ok:false, msg:f3.p1p1 };
      if (d.p2 === 2 && d.p1 === 3 && d.r === -1 && d.p0 >= 2) return { ok:false, msg:f3.above };
      if (d.r === 1) return { ok:false, msg:f3.r };
      if (d.p2 !== 2) return { ok:false, msg:f3.p2 };
      return { ok:false, msg:f3.other };
    }
    return { ok:false };
  }

  T.silent = true; pl.go(S.div.divided ? 5 : 0); T.silent = false;
  paintAll();
  EXP = { repaint:function(){ tb.links(); plot.render(); } };
  return { predict:{ start:predStart, run:predRun }, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Hole or asymptote? Under the microscope ----------
var PV = { xmin:-6, xmax:6, ymin:-6, ymax:6 };
var P3 = null;
function part3(host, api){
  var C = api.content, U = C.ui, S = api.S;
  S.ci = S.ci || 0; S.calls = S.calls || {}; S.zoom = S.zoom || {}; S.sel = S.sel || {};
  var CD = C.cases.map(function(cs, ci){
    var A = ftAnalyse({ c:1, top:cs.top, bot:cs.bot });
    return { cs:cs, i:ci, A:A, f:function(x){ var n = 1, d = 1; cs.top.forEach(function(t){ n *= x - t; }); cs.bot.forEach(function(t){ d *= x - t; }); return d === 0 ? NaN : n / d; },
      list:cs.order.map(function(a){ var h = A.holes.filter(function(x){ return x.a === a; })[0], va = A.vas.filter(function(x){ return x.a === a; })[0]; return { a:a, key:cs.id + ":" + a, hole:!!h, h:h ? h.h : null, va:va, m:cnt(cs.top, a), n:cnt(cs.bot, a) }; }) };
  });
  var ALL = []; CD.forEach(function(c){ c.list.forEach(function(r){ ALL.push({ c:c, r:r }); }); });
  host.innerHTML = '<div class="mc"><div class="pred-top"><span class="tiny muted" id="mc-n"></span><span class="dots" id="mc-dots" aria-hidden="true"></span></div>' +
    '<p class="eq-cap mc-fn" id="mc-fn"></p><div class="chips" id="mc-rs" role="group" aria-label="Restrictions"></div>' +
    '<div class="mc-main"><div class="mc-g"><canvas class="plot" id="mc-plot" role="img" aria-label="Rough plot"></canvas><p class="tiny muted" id="mc-zl"></p>' +
    '<div id="mc-call"></div><div class="q-actions"><button type="button" class="btn primary sm" id="mc-zoom">' + U.zoom + '</button></div><div id="mc-tbl"></div>' +
    '<details class="alg" id="mc-alg"><summary>' + U.alg + '</summary><div id="mc-algb"></div></details><div id="mc-fb" aria-live="polite"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="mc-prev">' + U.prevCase + '</button><button type="button" class="btn ghost sm" id="mc-next"></button></div></div>' +
    '<div class="mc-side"><h3>' + U.board + '</h3><div class="mc-cols"><div><h4>' + U.holes + '</h4><div id="mc-bh" class="mc-chips"></div></div><div><h4>' + U.vas + '</h4><div id="mc-bv" class="mc-chips"></div></div></div><p class="mc-score" id="mc-score" aria-live="polite"></p></div></div></div>';
  var plot = new MV.Plot($("#mc-plot", host), PV), view = cp(PV), anim = null;
  function cur(){ var c = CD[S.ci]; var i = S.sel[c.cs.id]; if (i == null) { i = 0; for (var k = 0; k < c.list.length; k++) if ((S.zoom[c.list[k].key] || 0) < 3) { i = k; break; } S.sel[c.cs.id] = i; } return { c:c, r:c.list[i], ri:i }; }
  function viewFor(r, k){ if (!k) return cp(PV); var hw = 0.6 / Math.pow(10, k - 1), cy = r.hole ? qv(r.h) : 0; return { xmin:r.a - hw, xmax:r.a + hw, ymin:cy - hw, ymax:cy + hw }; }
  function done(r){ return (S.zoom[r.key] || 0) >= 3; }
  function right(r){ return S.calls[r.key] === (r.hole ? "hole" : "va"); }
  plot.render = function(){
    var x = cur(), c = x.c, r = x.r, k = S.zoom[r.key] || 0, hi = css("--hi");
    var sc = { view:view, curves:[{ f:c.f, color:css("--pen"), width:3 }], asymptotes:[], describe:"" };
    c.list.forEach(function(q){ if (done(q) && !q.hole) sc.asymptotes.push({ x:q.a }); });
    if (yAxisOff(view)) sc.yTicks = { fmt:blank };
    sc.after = function(ctx, p){
      if (yAxisOff(view)) yLabelsLeft(ctx, p);
      if (!done(r)) { var X = p.X(r.a); ctx.save(); ctx.strokeStyle = hi; ctx.lineWidth = 3; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, p.H); ctx.stroke(); ctx.restore(); p.label({ x:r.a, y:p.yOf(p.H - 16), text:"x = " + num(r.a), dx:8, bg:true }); }
      c.list.forEach(function(q){ if (done(q) && q.hole) openDot(ctx, p, q.a, qv(q.h), { label:ptT(Q(q.a), q.h) }); });
      if (k > 0 && !r.hole) {
        var hw = (view.xmax - view.xmin) / 2, ink = css("--ink");
        [[-1, r.va.l], [1, r.va.r]].forEach(function(s){
          var xs = r.a + s[0] * hw * 0.45, up = s[1] > 0, Y0 = up ? 46 : p.H - 46, Y1 = up ? 8 : p.H - 8;
          p.segment({ x1:xs, y1:p.yOf(Y0), x2:xs, y2:p.yOf(Y1), color:ink, width:2.5, arrow:true });
          p.label({ x:xs, y:p.yOf(up ? 60 : p.H - 60), text:up ? U.offTop : U.offBot, align:"center", bg:true, font:"600 13px " + p.fontM });
        });
      }
    };
    var d = k ? F(U.descZoom, [num(r.a), num(view.xmin, 4), num(view.xmax, 4)]) : F(U.descRough, [MV.plain(c.cs.fn), num(r.a)]);
    c.list.forEach(function(q){ if (done(q)) d += " " + (q.hole ? F(U.descHole, [ptT(Q(q.a), q.h)]) : F(U.descVA, [num(q.a)])); });
    sc.describe = d;
    plot.draw(sc);
  };
  function goView(t, done2){ if (anim) anim(); var from = cp(view); anim = MV.tween({ dur:700, step:function(s){ view = lerpV(from, t, s); plot.render(); }, done:function(){ anim = null; view = cp(t); plot.render(); if (done2) done2(); } }); }
  function algHTML(c, r){
    var f = M(facP(r.a)), h = "<p>" + c.cs.fact + "</p><p>" + F(U.count, [f, r.m, r.m === 1 ? U.time : U.times, r.n, r.n === 1 ? U.time : U.times]) + "</p>";
    if (r.hole) h += "<p>" + F(U.holeLine, [num(r.a)]) + "</p><p>" + F(U.holeSub, [c.cs.simp, num(r.a), qT(r.h), ptT(Q(r.a), r.h)]) + "</p>";
    else { var k = r.n - r.m; h += "<p>" + F(U.vaLine, [k, k === 1 ? U.copy1 : U.copyN, num(r.a)]) + "</p>"; }
    if (c.cs.note && c.list.every(done)) h += '<p class="muted">' + c.cs.note + "</p>";
    return h;
  }
  function reason(r){ return r.hole ? F(U.holeLine, [num(r.a)]) : F(U.vaLine, [r.n - r.m, r.n - r.m === 1 ? U.copy1 : U.copyN, num(r.a)]); }
  function score(){ return ALL.filter(function(x){ return done(x.r) && right(x.r); }).length; }
  function paint(){
    var x = cur(), c = x.c, r = x.r, k = S.zoom[r.key] || 0, call = S.calls[r.key];
    $("#mc-n", host).textContent = MV.plain(F(U.caseOf, [S.ci + 1, CD.length]));
    $("#mc-dots", host).innerHTML = CD.map(function(q, i){ return '<span class="dot' + (q.list.every(done) ? " done" : "") + (i === S.ci ? " cur" : "") + '"></span>'; }).join("");
    $("#mc-fn", host).innerHTML = c.cs.fn;
    MV.keepFocus($("#mc-rs", host), function(){ $("#mc-rs", host).innerHTML = c.list.map(function(q, i){ return '<button type="button" class="chip' + (i === x.ri ? " on" : "") + '" data-ri="' + i + '" data-k="mcr' + i + '" aria-pressed="' + (i === x.ri) + '">' + (done(q) ? "✓ " : "") + F(U.restr, [num(q.a)]) + "</button>"; }).join(""); });
    $("#mc-zl", host).textContent = k ? MV.plain(F(U.zoomLevel, [k])) : MV.plain(F(U.restrOf, [x.ri + 1, c.list.length]));
    MV.keepFocus($("#mc-call", host), function(){ $("#mc-call", host).innerHTML = '<p class="mc-ask">' + F(U.call, [num(r.a)]) + '</p><div class="chips" role="radiogroup" aria-label="' + MV.esc(MV.plain(F(U.call, [num(r.a)]))) + '">' +
      [["hole", U.hole], ["va", U.va]].map(function(o){ return '<button type="button" class="chip' + (call === o[0] ? " on" : "") + '" role="radio" aria-checked="' + (call === o[0]) + '" data-call="' + o[0] + '" data-k="mcc' + o[0] + '"' + (call ? " disabled" : "") + ">" + o[1] + "</button>"; }).join("") + "</div>" + (call ? '<p class="tiny muted">' + U.callNote + "</p>" : ""); });
    var zb = $("#mc-zoom", host); zb.disabled = !call || k >= 3; zb.textContent = k >= 3 ? U.zoomDone : U.zoom;
    var rows = [0.1, 0.01, 0.001].slice(0, k).map(function(dx){ return [num(r.a - dx, 3), sig(c.f(r.a - dx), 4), num(r.a + dx, 3), sig(c.f(r.a + dx), 4)]; });
    $("#mc-tbl", host).innerHTML = call ? (rows.length ? MV.tableHTML({ head:U.tblHead, rows:rows, caption:U.tblHead.join(", ") }) : '<p class="tiny muted">' + U.tblEmpty + "</p>") : '<p class="tiny muted">' + U.zoomFirst + "</p>";
    var alg = $("#mc-alg", host), was = alg.open; $("#mc-algb", host).innerHTML = algHTML(c, r) + (k < 3 ? '<p class="tiny muted">' + U.algWait + "</p>" : ""); alg.open = was || k >= 3;
    $("#mc-fb", host).innerHTML = k >= 3 ? '<div class="fb ' + (right(r) ? "good" : "bad") + '" role="status"><p>' + (right(r) ? "<strong>" + U.right + "</strong> " + reason(r) : "<strong>" + F(call === "hole" ? U.wrongHole : U.wrongVA, [M(facP(r.a))]) + "</strong>") + "</p></div>" : "";
    var nb = $("#mc-next", host), lastR = x.ri >= c.list.length - 1;
    nb.textContent = lastR ? U.nextCase : U.next; nb.disabled = lastR ? S.ci >= CD.length - 1 : false;
    $("#mc-prev", host).disabled = S.ci === 0;
    var chip = function(q){ var ok = right(q.r); return '<span class="mc-chip' + (ok ? "" : " chg") + '">' + (q.r.hole ? ptT(Q(q.r.a), q.r.h) : M("x = " + q.r.a)) + " · " + F(U.chipCase, [q.c.i + 1]) + (ok ? ' <span aria-hidden="true">✓</span><span class="vh">' + U.confirmed + "</span>" : ' <span class="tag">' + U.changed + "</span>") + "</span>"; };
    $("#mc-bh", host).innerHTML = ALL.filter(function(q){ return done(q.r) && q.r.hole; }).map(chip).join("");
    $("#mc-bv", host).innerHTML = ALL.filter(function(q){ return done(q.r) && !q.r.hole; }).map(chip).join("");
    var nd = ALL.filter(function(q){ return done(q.r); }).length;
    $("#mc-score", host).innerHTML = nd >= ALL.length ? F(U.score, [score()]) : F(U.scoreSoFar, [nd]);
    plot.render();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var x = cur(), r = x.r;
    if (b.dataset.ri != null) { S.sel[x.c.cs.id] = +b.dataset.ri; api.save(); var y = cur(); view = viewFor(y.r, S.zoom[y.r.key] || 0); paint(); return; }
    if (b.dataset.call) { if (S.calls[r.key]) return; S.calls[r.key] = b.dataset.call; api.save(); paint(); return; }
    if (b.id === "mc-zoom") { if (anim) return; var k = (S.zoom[r.key] || 0) + 1; if (k > 3) return; S.zoom[r.key] = k; api.save(); paint(); goView(viewFor(r, k), function(){ if (k >= 3) { paint(); MV.focusFb($("#mc-fb", host)); } }); return; }
    if (b.id === "mc-prev") { S.ci = Math.max(0, S.ci - 1); api.save(); view = viewFor(cur().r, S.zoom[cur().r.key] || 0); paint(); return; }
    if (b.id === "mc-next") {
      if (x.ri < x.c.list.length - 1) S.sel[x.c.cs.id] = x.ri + 1; else { S.ci = Math.min(CD.length - 1, S.ci + 1); }
      api.save(); var z = cur(); view = viewFor(z.r, S.zoom[z.r.key] || 0); paint();
    }
  });
  view = viewFor(cur().r, S.zoom[cur().r.key] || 0);
  paint();
  P3 = { line:function(){ var nd = ALL.filter(function(q){ return done(q.r); }).length; return MV.plain(F(U.summary, [score()])) + (nd < ALL.length ? " (unfinished)" : ""); } };
  return {};
}

// ---------- Practice 1: Match the equation to its graph ----------
// @component N6 graphMatch (adapted from MHF4U 20) — equations on the left, K5 graph thumbnails on the right drawn from
// tile or divide data; pair-specific mismatch feedback, then grouped feedback by graph kind
function fnScene(fn){
  if (fn.p) {
    var d = { p2:fn.p[0], p1:fn.p[1], p0:fn.p[2], r:fn.r }, D = divInfo(d);
    return { asymptotes:[{ x:fn.r, label:"" }], curves:[{ f:D.f, color:css("--pen"), width:2.6 }], after:function(ctx, p){ dashLine(ctx, p, D.q[0], D.q0, {}); } };
  }
  return ftScene(ftAnalyse(fn), { noLabels:true, width:2.6, arrows:false });
}
function matchAct(host, api, a){
  var S = api.S; S.done = S.done || {}; S.tries = S.tries || {}; S.hints = S.hints || {};
  var sel = null, msg = null, K = MV.ans(a), right = MV.shuffle(a.right, MV.meta.id + a.id), G = a.wrongGroups;
  function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
  host.innerHTML = '<p class="how">' + a.how + '</p><div id="mg-sel"></div><div id="mg-msg"></div><p class="sort-done" id="mg-done" hidden></p>' +
    '<div class="mg"><div class="mg-eqs"><h4>' + a.eqTitle + '</h4><div class="mg-eqrow" role="group" aria-label="' + MV.esc(a.eqTitle) + '">' + a.left.map(function(L){ return '<button type="button" class="mitem mg-eq" data-l="' + L.id + '" data-k="mgl' + L.id + '" aria-pressed="false"><span class="pair-n"></span><span>' + L.t + "</span></button>"; }).join("") + "</div></div>" +
    '<div class="mg-gs"><h4>' + a.gTitle + '</h4><div class="mg-grid" role="group" aria-label="' + MV.esc(a.gTitle) + '">' + right.map(function(R, i){ return '<button type="button" class="mg-th" data-r="' + R.id + '" data-k="mgr' + R.id + '"><span class="mg-tag">' + F(a.graphN, [i + 1]) + '</span><canvas class="plot mg-c" role="img" aria-label="' + MV.esc(R.desc) + '"></canvas><span class="mg-eqd"></span></button>'; }).join("") + "</div></div></div>";
  right.forEach(function(R){
    var cv = host.querySelector('[data-r="' + R.id + '"] canvas'), p = new MV.Plot(cv, a.view);
    p.render = function(){ var sc = fnScene(R.fn); sc.view = a.view; sc.describe = R.desc; sc.xTicks = { step:1, fmt:function(t){ return Math.round(t) % 2 === 0 ? num(t) : ""; } }; sc.yTicks = { step:2, fmt:function(t){ return Math.round(t) % 4 === 0 ? num(t) : ""; } }; p.draw(sc); };
    p.render();
  });
  function stats(){ var f = 0, d = 0, miss = []; a.left.forEach(function(L){ var bad = (S.tries[L.id] || 0) > 0 || (S.hints[L.id] || 0) >= 3; if (S.done[L.id]) { d++; if (!bad) f++; } if (bad) miss.push(L); }); return { first:f, done:d, total:a.left.length, miss:miss }; }
  function paint(){
    var doneR = {};
    a.left.forEach(function(L, i){ if (S.done[L.id]) doneR[K[L.id]] = { i:i + 1, L:L }; });
    $$(".mg-eq", host).forEach(function(b, i){ var id = b.dataset.l, d = !!S.done[id]; b.classList.toggle("done", d); b.disabled = d; b.setAttribute("aria-pressed", String(sel === id)); b.querySelector(".pair-n").textContent = d ? "✓ " + (i + 1) : ""; });
    $$(".mg-th", host).forEach(function(b){ var dr = doneR[b.dataset.r]; b.classList.toggle("done", !!dr); b.disabled = !!dr; b.querySelector(".mg-eqd").innerHTML = dr ? '<span class="pair-n">✓ ' + dr.i + "</span> " + dr.L.t : ""; });
    var L = sel ? byId(a.left, sel) : null, lv = L ? (S.hints[sel] || 0) : 0;
    MV.keepFocus($("#mg-sel", host), function(){ $("#mg-sel", host).innerHTML = L ? '<div class="sel-bar"><span>Selected: ' + L.t + "</span>" + MV.hintBtn("mgh" + a.id, lv) + "</div>" + MV.hintsHTML(L.hints, lv) : ""; });
    $("#mg-msg", host).innerHTML = msg ? '<div class="fb ' + msg.type + '" role="status"><p>' + msg.html + "</p></div>" : "";
    var s = stats(), dn = $("#mg-done", host); dn.hidden = s.done < s.total; dn.textContent = "All matched! You got " + s.first + " of " + s.total + " right on the first try, without the worked solution.";
  }
  function mismatch(L, R){
    var w = a.wrong[L.id + "|" + R.id]; if (w) return w;
    if (L.kind === "oblique" && R.kind === "line") return G.obliqueLine;
    if (L.kind === "line" && R.kind === "oblique") return G.lineCurve;
    if (L.kind === "flat") return G.flatOther;
    return G.otherFlat;
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.l) { sel = sel === b.dataset.l ? null : b.dataset.l; msg = null; paint(); return; }
    if (b.dataset.act === "hint" && sel) { S.hints[sel] = Math.min(3, (S.hints[sel] || 0) + 1); api.save(); paint(); return; }
    if (b.dataset.r) {
      if (!sel) { msg = { type:"", html:a.pickFirst }; paint(); return; }
      var L = byId(a.left, sel), R = byId(a.right, b.dataset.r);
      if (K[sel] === R.id) { S.done[sel] = true; msg = { type:"good", html:"<strong>✓ Matched.</strong> " + L.why }; sel = null; api.save(); paint(); MV.focusFb($("#mg-msg", host)); }
      else { S.tries[sel] = (S.tries[sel] || 0) + 1; msg = { type:"bad", html:"<strong>✗ Not a match.</strong> " + mismatch(L, R) + " " + a.tail }; api.save(); paint(); MV.focusFb($("#mg-msg", host)); }
    }
  });
  paint();
  return {
    stats:function(){ var s = stats(); return { first:s.first, total:s.total, done:s.done, line:a.summary + " (first try): " + s.first + "/" + s.total + (s.done < s.total ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; stats().miss.forEach(function(L){ g = g.concat(MV.goalIdx(L.goal != null ? L.goal : a.goal)); }); return g; }
  };
}

// ---------- Practice 2: Find the missing numbers ----------
// @component N4 blankBoxes — one item at a time; a frame with [] slots becomes number boxes (fractions and decimals),
// whole-item check, named wrong entries (full or partial patterns), three-level help, first-try scoring
function missingAct(host, api, a){
  var S = api.S; S.i = S.i || 0; S.items = S.items || {};
  var msg = {};
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="pred-top"><span class="tiny muted" id="mn-n"></span><span class="dots" id="mn-dots" aria-hidden="true"></span></div><p class="pred-q" id="mn-q"></p>' +
    '<div class="mn-frame" id="mn-frame"></div><div class="q-actions"><button type="button" class="btn primary sm" id="mn-check">Check</button><span id="mn-hb"></span></div><div id="mn-hints"></div><div id="mn-fb"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="mn-prev">Previous</button><button type="button" class="btn ghost sm" id="mn-next">Next item</button></div>';
  function cur(){ return a.items[S.i]; }
  function ist(it){ it = it || cur(); return S.items[it.id] || (S.items[it.id] = { v:[], tries:0, hint:0, solved:false, first:null }); }
  function near(x, y){ return Math.abs(x - y) < 1e-9; }
  function paint(load){
    var it = cur(), x = ist(it);
    $("#mn-n", host).textContent = "Item " + (S.i + 1) + " of " + a.items.length + (it.star ? " ★" : "");
    $("#mn-dots", host).innerHTML = a.items.map(function(q, i){ var y = S.items[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    $("#mn-q", host).innerHTML = it.prompt;
    if (load) { var parts = it.frame.split("[]"), h = parts[0]; for (var k = 1; k < parts.length; k++) h += '<input class="numin mn-in" id="mn-' + (k - 1) + '" data-bi="' + (k - 1) + '" type="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(it.labels[k - 1] || "Box " + k) + '">' + parts[k]; $("#mn-frame", host).innerHTML = h; $$(".mn-in", host).forEach(function(el, i){ el.value = x.v[i] || ""; }); }
    $$(".mn-in", host).forEach(function(el){ el.disabled = x.solved; });
    $("#mn-check", host).disabled = x.solved;
    MV.keepFocus($("#mn-hb", host), function(){ $("#mn-hb", host).innerHTML = x.solved ? "" : MV.hintBtn("mnh" + it.id, x.hint); });
    $("#mn-hints", host).innerHTML = x.solved ? "" : MV.hintsHTML(it.hints, x.hint);
    $("#mn-fb", host).innerHTML = x.solved ? '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>" : (msg[it.id] ? '<div class="fb bad" role="status"><p>' + msg[it.id] + "</p></div>" : "");
    $("#mn-prev", host).disabled = S.i === 0; $("#mn-next", host).disabled = S.i === a.items.length - 1;
  }
  host.addEventListener("input", function(e){ var i = e.target.dataset.bi; if (i == null) return; ist().v[+i] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset.bi != null) $("#mn-check", host).click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = cur(), x = ist(it);
    if (b.id === "mn-prev" || b.id === "mn-next") { S.i += b.id === "mn-prev" ? -1 : 1; api.save(); paint(true); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.id !== "mn-check") return;
    var ans = MV.ans(it), vals = [];
    for (var k = 0; k < ans.length; k++) { var r = MV.parseNum(x.v[k] || ""); if (!r || r.length !== 1) { msg[it.id] = a.empty; paint(); MV.focusFb($("#mn-fb", host)); return; } vals.push(r[0]); }
    if (vals.every(function(v, i){ return near(v, ans[i]); })) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msg[it.id] = null; }
    else {
      x.tries++;
      var w = (it.wrong || []).filter(function(w){ return Array.isArray(w.v) ? w.v.every(function(v, i){ return near(vals[i], v); }) : Object.keys(w.v).every(function(k){ return near(vals[+k], w.v[k]); }); })[0];
      msg[it.id] = w ? "<strong>✗ Not quite.</strong> " + w.fb + " " + a.tryAgain : "<strong>✗</strong> " + a.other;
    }
    api.save(); paint(); MV.focusFb($("#mn-fb", host));
  });
  paint(true);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Three features, one function ----------
var TV = { xmin:-8, xmax:8, ymin:-10, ymax:12 };
var task = (function(){
  var api, tb, plot;
  function U(){ return MV.C.explore.ui; }
  function st(){ return api ? api.S.st : { c:1, top:[], bot:[0] }; }
  function read(){ var s = st(); return { c:s.c, top:s.top.slice(), bot:s.bot.slice(), A:ftAnalyse(s) }; }
  function checks(d){ var A = d.A; return [eqArr(A.holes.map(function(h){ return h.a; }), [-1]), eqArr(A.vas.map(function(v){ return v.a; }), [3]), A.lb.length >= 1 && A.lt.length === A.lb.length + 1 && A.far.k === "ob" && eqArr(A.far.q, [1, 2])]; }
  function keyOf(d){ return d.c + "|" + sortN(d.top).join(",") + "|" + sortN(d.bot).join(","); }
  function unkey(k){ var p = k.split("|"), sp = function(s){ return s ? s.split(",").map(Number) : []; }; return { c:+p[0], top:sp(p[1]), bot:sp(p[2]) }; }
  function preview(){
    var d = read(), A = d.A, sc = ftScene(A, {}); sc.view = TV; sc.describe = ftDescribe(A, U()); plot.draw(sc);
    var u = U(), R = u.rows;
    $("#tk-read").innerHTML = MV.readoutHTML([[R.simp, simpText(A, u, true)], [R.holes, holesText(A, u, true)], [R.va, vasText(A, u)], [R.far, farText(A, u)]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; a.S.st = a.S.st || { c:1, top:[], bot:[0] };
      inp.innerHTML = '<div id="tk-tiles"></div><p class="tiny muted">' + U().tileNote + "</p>";
      pv.innerHTML = '<h4 class="tk-h">' + MV.C.task.ui.preview + '</h4><canvas class="plot" id="tk-plot" role="img" aria-label="Preview graph"></canvas><p class="tiny muted">' + MV.C.task.ui.rowsNote + '</p><dl class="read" id="tk-read" aria-live="polite"></dl>';
      plot = new MV.Plot($("#tk-plot"), TV); plot.render = preview;
      tb = ftBuilder($("#tk-tiles"), { ui:U(), get:function(){ return a.S.st; }, cancelled:function(){ return false; }, set:function(n){ a.S.st = n; a.save(); tb.paint(); preview(); a.update(); } });
      tb.paint(); preview();
      document.addEventListener("click", function(e){
        if (!e.target.closest || !e.target.closest("#task-check")) return;
        setTimeout(function(){ var ts = MV.taskState(), g = $("#task-fb .fb.good"); if (g && ts.found.length >= 4 && !g.querySelector(".tk-all")) g.insertAdjacentHTML("beforeend", '<p class="tk-all">' + MV.C.task.all4 + "</p>"); }, 0);
      });
    },
    read:read,
    valid:function(){ return true; },
    checks:checks,
    tips:function(d, res){
      var A = d.A, T = MV.C.task, u = U(), out = [], none = T.ui.none;
      if (!res[0]) out.push(F(T.tips[0], [A.holes.length ? A.holes.map(function(h){ return ptT(Q(h.a), h.h); }).join(", ") : none]));
      if (!res[1]) out.push(F(T.tips[1], [A.vas.length ? A.vas.map(function(v){ return M("x = " + v.a); }).join(", ") : none]));
      if (!res[2]) out.push(F(T.tips[2], [farText(A, u)]));
      return out;
    },
    key:keyOf,
    label:function(k){ var s = unkey(k); return M(ratSrc(s.c, s.top, s.bot)); },
    text:function(k){ var s = unkey(k); return MV.plain(M(ratSrc(s.c, s.top, s.bot))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ match:matchAct, missing:missingAct },
  task:task,
  summaryLines:function(){ return P3 ? [P3.line()] : []; },
  onShow:function(v){ if (v === "explore" && EXP) EXP.repaint(); }
});
})();
