// MHF4U 11 Remainder Theorem & Synthetic Division: hero, division stepper (Explore: synthetic grid + long-division twin
// + graph), the remainder shortcut (Part 3: radar, proof order, matching remainders), Divide it / Work backwards
// (Practice) and Design by remainders (task).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, m = MV.m;

// ---------- exact fractions ----------
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function F(n, d){ if (d == null) d = 1; if (d < 0) { n = -n; d = -d; } var g = gcd(n, d) || 1; return { n:n / g, d:d / g }; }
function fadd(x, y){ return F(x.n * y.d + y.n * x.d, x.d * y.d); }
function fmul(x, y){ return F(x.n * y.n, x.d * y.d); }
function fdiv(x, y){ return F(x.n * y.d, x.d * y.n); }
function fneg(x){ return F(-x.n, x.d); }
function fval(x){ return x.n / x.d; }
function feq(x, y){ return x.n === y.n && x.d === y.d; }
function fz(x){ return x.n === 0; }
function fs(x){ var a = Math.abs(x.n); return (x.n < 0 ? "-" : "") + (x.d === 1 ? a : "{" + a + "}/{" + x.d + "}"); }   // math source
function ft(x){ return (x.n < 0 ? MINUS : "") + Math.abs(x.n) + (x.d === 1 ? "" : "/" + x.d); }                          // plain text
function fm(x){ return m(fs(x)); }
function fpar(x){ return x.n < 0 ? "(" + fs(x) + ")" : fs(x); }
function fsig(x){ return (x.n < 0 ? "" : "+") + fs(x); }
function toF(v){ for (var d = 1; d <= 2000; d++) { var n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return F(n, d); } return null; }
function near(a, b){ return Math.abs(a - b) < 1e-6; }
// coefficient sliders aren't transformation parameters: ink, not the pen blue (colour key rule 1)
function inkSl(h){ MV.$$("input", h).forEach(function(i){ i.style.accentColor = "var(--ink)"; }); MV.$$("output", h).forEach(function(o){ o.style.color = "var(--ink)"; }); }
function fv(v){ var f = toF(v); return f && f.d <= 64 ? ft(f) : num(v, 2); }   // plain text of a value for canvas labels

// ---------- polynomial notation (N3) ----------
function pw(p){ return p === 0 ? "" : p === 1 ? "x" : "x^" + p; }
function tsrc(c, p, first){                       // one term, e.g. "2x^3", " - 5x^2", " + 0x"
  var a = F(Math.abs(c.n), c.d), body = (p > 0 && a.n === 1 && a.d === 1) ? pw(p) : fs(a) + pw(p);
  return first ? (c.n < 0 ? "-" : "") + body : (c.n < 0 ? " - " : " + ") + body;
}
function qfac(c, p){ return p === 0 ? fs(c) : tsrc(c, p, true); }   // a quotient term used as a factor: 2x^2, x, -1
function psrc(cs, keep){ var n = cs.length - 1, out = "", first = true; cs.forEach(function(c, i){ if (fz(c) && !keep) return; out += tsrc(c, n - i, first); first = false; }); return out || "0"; }
function ints(a){ return a.map(function(v){ return F(v); }); }
function dsrc(a, b){ var x = (a === 1 ? "" : a) + "x"; return b === 0 ? x : x + (b > 0 ? " - " : " + ") + Math.abs(b); }   // divisor ax − b
function dfsrc(z){ return fz(z) ? "x" : "x" + (z.n > 0 ? " - " : " + ") + fs(F(Math.abs(z.n), z.d)); }                      // x − z
function evalP(top, x){ var v = 0; top.forEach(function(c){ v = v * x + c; }); return v; }
function list(arr){ return arr.map(fm).join(", "); }
// P(z) written out: "P(3) = 2(3)^3 - 5(3)^2 - 4(3) + 7 = 54 - 45 - 12 + 7 = 4"
function subst(T, z, withSub){
  var n = T.length - 1, inp = "(" + fs(z) + ")", a = "", b = "", first = true, R = F(0);
  T.forEach(function(c, i){
    var p = n - i; if (fz(c)) return;
    var zp = F(Math.pow(z.n, p), Math.pow(z.d, p)), val = fmul(c, zp); R = fadd(R, val);
    var ac = F(Math.abs(c.n), c.d), coef = (ac.n === 1 && ac.d === 1 && p > 0) ? "" : fs(ac);
    a += (first ? (c.n < 0 ? "-" : "") : (c.n < 0 ? " - " : " + ")) + (p === 0 ? coef : coef + inp + (p > 1 ? "^" + p : ""));
    b += first ? fs(val) : (val.n < 0 ? " - " : " + ") + fs(F(Math.abs(val.n), val.d));
    first = false;
  });
  return { src:"P(" + fs(z) + ") = " + (withSub === false ? "" : a + " = ") + b + " = " + fs(R), R:R };
}

// ---------- division core ----------
function divide(top, a, b, axb){
  var T = ints(top), z = F(b, a), n = T.length - 1, bot = [T[0]], mid = [null], A = F(a);
  for (var i = 1; i <= n; i++) { mid[i] = fmul(bot[i - 1], z); bot[i] = fadd(T[i], mid[i]); }
  var adj = !!axb && a !== 1;
  return { top:top, T:T, n:n, a:a, b:b, z:z, bot:bot, mid:mid, q:bot.slice(0, n).map(function(c){ return fdiv(c, A); }), R:bot[n], adj:adj, total:2 * n + 1 + (adj ? 1 : 0) };
}
function divLead(D){ return D.a === 1 ? "x" : D.a + "x"; }
function synSentence(D, s){
  var n = D.n;
  if (s === 1) return "Bring down the leading coefficient, " + fm(D.bot[0]) + ".";
  if (s > 2 * n + 1) return m(dsrc(D.a, D.b)) + " = " + m(D.a + "(" + dfsrc(D.z) + ")") + ", so divide the quotient numbers by " + D.a + ": " + list(D.bot.slice(0, n)) + " become " + list(D.q) + ". The remainder stays " + fm(D.R) + ".";
  var i = Math.floor(s / 2);
  if (s % 2 === 0) return i === 1 ? "Multiply " + fm(D.bot[0]) + " by the zero, " + fm(D.z) + ". Write " + fm(D.mid[1]) + " under " + fm(D.T[1]) + "." :
    "Multiply " + fm(D.bot[i - 1]) + " by " + fm(D.z) + ". Write " + fm(D.mid[i]) + " under " + fm(D.T[i]) + ".";
  var sum = m(fs(D.T[i]) + " + " + fpar(D.mid[i]) + " = " + fs(D.bot[i]));
  return i < n ? "Add the column: " + sum + "." : "Add the last column: " + sum + ". This last number is the remainder.";
}
function prodSrc(D, k){ return tsrc(D.bot[k], D.n - k, true) + tsrc(fneg(D.mid[k + 1]), D.n - k - 1, false); }
function lineSrc(D, k){ return tsrc(k === 0 ? D.T[0] : D.bot[k], D.n - k, true) + tsrc(D.T[k + 1], D.n - k - 1, false); }
function twinSentence(D, s){
  var n = D.n, dl = divLead(D);
  if (s === 1) return "Divide: " + m(tsrc(D.T[0], n, true) + " ÷ " + dl + " = " + qfac(D.q[0], n - 1)) + ". Write " + m(qfac(D.q[0], n - 1)) + " in the quotient.";
  if (s > 2 * n + 1) return "The long-division quotient is already " + m(psrc(D.q)) + ", with remainder " + fm(D.R) + ".";
  var i = Math.floor(s / 2), k = i - 1;
  if (s % 2 === 0) return "Multiply: " + m(qfac(D.q[k], n - 1 - k) + "(" + dsrc(D.a, D.b) + ") = " + prodSrc(D, k)) + ".";
  var left = tsrc(D.bot[i], n - i, true), h = "Subtract: " + m("(" + lineSrc(D, k) + ") - (" + prodSrc(D, k) + ") = " + left) + ".";
  if (i < n) return h + " Bring down " + m(tsrc(D.T[i + 1], n - i - 1, true)) + ". Divide: " + m(left + " ÷ " + dl + " = " + qfac(D.q[i], n - i - 1)) + ".";
  return h + " Nothing is left to bring down, so " + fm(D.R) + " is the remainder.";
}

// @component N22 syntheticDivision — synthetic grid (corner box, top/products/bottom rows, placeholder tags, L-shaped
// remainder bracket, editable cells) and its long-division twin aligned by power; both render any stage of a division
// made by divide(top, a, b, axb). o: {pos, edit:{cell:html}, hl, same:{}, fresh:"cell", tags:{cell:html}, adjDone, small}
var POWN = ["constant", "x", "x squared", "x cubed", "x to the fourth"];
function powHead(p){ return p === 0 ? '<span class="sg-c">constant</span>' : m(pw(p)); }
function gridHTML(D, o){
  o = o || {};
  var n = D.n, pos = o.pos == null ? D.total : o.pos, e = o.edit || {}, tg = o.tags || {}, sm = o.same || {};
  function cell(id, html, cls){
    var c = (cls || "") + (o.hl === col(id) ? " hl" : "") + (sm[id] ? " same" : "") + (o.fresh === id || (Array.isArray(o.fresh) && o.fresh.indexOf(id) >= 0) ? " fresh" : "");
    return '<td data-g="' + id + '" class="' + c.trim() + '">' + (e[id] != null ? e[id] : html) + (tg[id] ? '<small class="sg-tag">' + tg[id] + "</small>" : "") + "</td>";
  }
  function col(id){ var k = +id.slice(1); return id === "z" ? -1 : k; }
  var h = '<table class="sg' + (o.small ? " sm" : "") + '"><caption class="vh">' + (o.caption || "Synthetic division grid") + "</caption><thead><tr><td></td>";
  for (var p = n; p >= 0; p--) h += '<th scope="col"><span class="vh">' + POWN[p] + " column</span><span aria-hidden=\"true\">" + powHead(p) + "</span></th>";
  h += '</tr></thead><tbody><tr class="sg-top"><th scope="row"><span class="vh">Top row. Zero of the divisor: </span>' + (e.z != null ? e.z : '<span class="sg-box">' + fm(D.z) + "</span>") + "</th>";
  D.T.forEach(function(c, i){ h += cell("t" + i, fz(c) && i > 0 ? fm(c) + '<small class="sg-ph">placeholder</small>' : fm(c), fz(c) && i > 0 ? "ph" : ""); });
  h += '</tr><tr class="sg-mid"><th scope="row"><span class="vh">Products</span></th>';
  for (var i = 0; i <= n; i++) h += cell("m" + i, i > 0 && pos >= 2 * i ? fm(D.mid[i]) + (o.fresh === "m" + i && o.times ? '<small class="sg-x">× ' + ft(D.z) + "</small>" : "") : "");
  h += '</tr><tr class="sg-bot"><th scope="row"><span class="vh">Bottom row</span></th>';
  for (i = 0; i <= n; i++) {
    var shown = pos >= (i === 0 ? 1 : 2 * i + 1), v = "";
    if (shown) {
      if (i < n && o.adjDone) v = fm(D.q[i]) + '<small class="sg-x">' + ft(D.bot[i]) + " ÷ " + D.a + "</small>";
      else v = fm(D.bot[i]);
    }
    h += cell("b" + i, v, i === n ? "sg-rem" + (shown || e["b" + i] != null ? " on" : "") : "");
  }
  return h + "</tr></tbody></table>";
}
// long-division twin. o: {pos, hl:"rowid", same:{}, fresh, hidden}
function twinHTML(D, o){
  o = o || {};
  var n = D.n, pos = o.pos == null ? D.total : o.pos, sm = o.same || {}, cols = n + 1, rows = [];
  function cellHTML(c, p, first, id, extra){
    var s = first ? tsrc(c, p, true) : tsrc(c, p, false);
    return '<td data-g="' + id + '" class="' + ((fz(c) ? "ph " : "") + (sm[id] ? "same " : "") + (o.hl && (o.hl.indexOf(id) >= 0 || o.hl.indexOf(id.split("_")[0]) >= 0) ? "hl " : "") + (extra || "")).trim() + '">' + m(s) + "</td>";
  }
  function row(cls, lead, cells){ var r = '<tr class="' + cls + '"><td class="ld-l">' + lead + "</td>"; for (var p = n; p >= 0; p--) r += cells[p] || "<td></td>"; return r + "</tr>"; }
  // quotient
  var qc = {};
  for (var k = 0; k < n; k++) if (pos >= 2 * k + 1) {
    qc[n - 1 - k] = cellHTML(D.q[k], n - 1 - k, k === 0, "q_" + k, o.fresh === "q" + k ? "fresh" : "");
    if (o.qlab === k) qc[n - 1 - k] = qc[n - 1 - k].replace("</td>", '<small class="ld-flip">' + m(tsrc(k === 0 ? D.T[0] : D.bot[k], n - k, true) + " ÷ " + divLead(D)) + "</small></td>");
  }
  rows.push(row("ld-q", "", qc));
  var dv = {}, sx = pos >= 3 ? "x-out" : "";
  D.T.forEach(function(c, i){ dv[n - i] = cellHTML(c, n - i, i === 0, i === 0 ? "d_0" : "d_" + i, i === 0 ? sx : ""); });
  rows.push(row("ld-dvd", m(dsrc(D.a, D.b)) + '<span class="ld-par" aria-hidden="true">)</span>', dv));
  for (k = 0; k < n; k++) {
    if (pos >= 2 * k + 2) {
      var pc = {}, flipped = pos >= 2 * k + 3;
      pc[n - k] = cellHTML(D.bot[k], n - k, true, "p" + k + "_0", (flipped ? "x-out " : "") + (o.fresh === "p" + k ? "fresh" : "")).replace("</td>", flipped ? '<small class="ld-flip">' + m(tsrc(fneg(D.bot[k]), n - k, true)) + "</small></td>" : "</td>");
      pc[n - k - 1] = cellHTML(fneg(D.mid[k + 1]), n - k - 1, false, "p" + k + "_1", o.fresh === "p" + k ? "fresh" : "").replace("</td>", flipped ? '<small class="ld-flip">' + m(tsrc(D.mid[k + 1], n - k - 1, false)) + "</small></td>" : "</td>");
      rows.push(row("ld-prod", '<span class="ld-minus" aria-label="subtract">−</span>', pc));
    }
    if (pos >= 2 * k + 3) {
      var lc = {}, last = k === n - 1;
      lc[n - k - 1] = cellHTML(D.bot[k + 1], n - k - 1, true, "l" + k + "_0", (last ? "ld-rem " : "") + (pos >= 2 * k + 5 && !last ? "x-out " : "") + (o.fresh === "l" + k ? "fresh" : ""));
      if (last && pos >= 2 * n + 1) lc[0] = lc[0].replace("</td>", '<small class="sg-tag">remainder</small></td>');
      if (!last) lc[n - k - 2] = cellHTML(D.T[k + 2], n - k - 2, false, "l" + k + "_1", o.fresh === "l" + k ? "fresh" : "");
      rows.push(row("ld-left", "", lc));
    }
  }
  return '<table class="ld" style="--cols:' + cols + '"><caption class="vh">Long division of ' + MV.plain(m(psrc(D.T))) + " by " + MV.plain(m(dsrc(D.a, D.b))) + "</caption><tbody>" + rows.join("") + "</tbody></table>";
}
// which cells to highlight / outline at a stage (linked highlighting)
function linkAt(D, s){
  var n = D.n, r = { col:null, rows:[], same:{}, tsame:{} };
  if (s < 1) return r;
  if (s > 2 * n + 1) { r.rows = ["q"]; for (var k = 0; k < n; k++) { r.same["b" + k] = 1; r.tsame["q_" + k] = 1; } return r; }
  if (s === 1) { r.col = 0; r.rows = ["d_0", "q_0"]; r.same.b0 = 1; r.tsame.d_0 = 1; return r; }
  var i = Math.floor(s / 2);
  r.col = i;
  if (s % 2 === 0) r.rows = ["p" + (i - 1)];
  else { r.rows = ["l" + (i - 1), "q_" + i]; r.same["b" + i] = 1; r.tsame["l" + (i - 1) + "_0"] = 1; }
  return r;
}

// ---------- graph helpers (G13 value bars, framed zero marker) ----------
function zeroBox(ctx, p, x, s){
  var X = p.X(x), Y = p.Y(0); s = s || 12;
  ctx.save(); ctx.fillStyle = css("--sheet"); ctx.strokeStyle = css("--ink"); ctx.lineWidth = 2;
  ctx.fillRect(X - s / 2, Y - s / 2, s, s); ctx.strokeRect(X - s / 2, Y - s / 2, s, s); ctx.restore();
}
// @component G13 valueBar — value bar from (x, 0) to (x, v·t) with --hi fill and --ink outline, ring at 0, edge arrow
// and "(above the window)" when off-screen; label at the tip. opt: {label, t, side}
function valueBar(ctx, p, x, v, opt){
  opt = opt || {};
  var t = opt.t == null ? 1 : opt.t, X = p.X(x), Y0 = p.Y(0), vv = v * t, lab = opt.label, v0 = p.v;
  ctx.save(); ctx.font = "600 14px " + (p.fontM || "serif"); ctx.textBaseline = "middle";
  var right = X < p.W - 120 && opt.side !== "left";
  ctx.textAlign = right ? "left" : "right";
  if (Math.abs(v) < 1e-9) {
    ctx.beginPath(); ctx.arc(X, Y0, 9, 0, Math.PI * 2); ctx.lineWidth = 2.5; ctx.strokeStyle = css("--hi"); ctx.stroke();
    ctx.lineWidth = 1; ctx.strokeStyle = css("--ink"); ctx.beginPath(); ctx.arc(X, Y0, 11, 0, Math.PI * 2); ctx.stroke();
    if (lab && t >= 1) { bgText(ctx, lab, X + (right ? 14 : -14), Y0 - 16); }
    ctx.restore(); return;
  }
  var out = vv > v0.ymax ? "above" : vv < v0.ymin ? "below" : null, tip = Math.max(v0.ymin, Math.min(v0.ymax, vv)), Yt = p.Y(tip);
  ctx.fillStyle = css("--hi"); ctx.strokeStyle = css("--ink"); ctx.lineWidth = 1;
  var top = Math.min(Y0, Yt), hgt = Math.abs(Yt - Y0);
  ctx.fillRect(X - 3, top, 6, hgt); ctx.strokeRect(X - 3, top, 6, hgt);
  if (out) { ctx.fillStyle = css("--ink"); ctx.beginPath(); var d = out === "above" ? 1 : -1, ye = out === "above" ? 2 : p.H - 2; ctx.moveTo(X, ye); ctx.lineTo(X - 7, ye + d * 12); ctx.lineTo(X + 7, ye + d * 12); ctx.closePath(); ctx.fill(); }
  if (lab && t >= 1) {
    var txt = out ? lab + " (" + out + " the window)" : lab;
    bgText(ctx, txt, X + (right ? 10 : -10), Math.max(12, Math.min(p.H - 12, Yt + (v > 0 ? -2 : 2))));
  }
  ctx.restore();
}
function bgText(ctx, txt, x, y){
  var w = ctx.measureText(txt).width, al = ctx.textAlign, bx = al === "right" ? x - w : al === "center" ? x - w / 2 : x;
  ctx.save(); ctx.globalAlpha = 0.88; ctx.fillStyle = css("--sheet"); ctx.fillRect(bx - 3, y - 10, w + 6, 20); ctx.restore();
  ctx.fillStyle = css("--ink"); ctx.fillText(txt, x, y);
}
// x-values in [x0, x1] where f(x) = c (sign changes, refined)
function solveEq(f, c, x0, x1){
  var N = 1200, out = [], px = x0, pv = f(x0) - c;
  for (var i = 1; i <= N; i++) {
    var x = x0 + (x1 - x0) * i / N, v = f(x) - c;
    if (Math.abs(v) < 1e-12) { out.push(x); }
    else if (pv * v < 0) { var a = px, b = x, fa = pv; for (var j = 0; j < 50; j++) { var mm = (a + b) / 2, fm2 = f(mm) - c; if (fa * fm2 <= 0) b = mm; else { a = mm; fa = fm2; } } out.push((a + b) / 2); }
    px = x; pv = v;
  }
  return out.filter(function(x, i){ return i === 0 || Math.abs(x - out[i - 1]) > 1e-4; });
}
function crit(top, x0, x1){ var der = []; var n = top.length - 1; top.slice(0, n).forEach(function(c, i){ der.push(c * (n - i)); }); return der.length ? solveEq(function(x){ return evalP(der, x); }, 0, x0, x1) : []; }

// ---------- hero ----------
function hero(f){
  var p = new MV.Plot(f.canvas, { xmin:-1.5, xmax:3.5, ymin:-7, ymax:10 }), top = [2, -5, -4, 7], D = divide(top, 1, 3);
  var st = { k:0, br:false, curve:0, marker:0, pulse:0 }, fn = function(x){ return evalP(top, x); };
  function mini(ctx, pl){
    var cw = Math.max(24, Math.min(32, pl.W * 0.066)), rh = cw * 0.72, x0 = pl.X(0.62), y0 = 8, fontS = Math.round(cw * 0.46);
    ctx.save(); ctx.globalAlpha = 0.94; ctx.fillStyle = css("--sheet"); ctx.fillRect(x0 - 6, y0 - 4, cw * 5 + 12, rh * 3 + 12); ctx.globalAlpha = 1;
    ctx.strokeStyle = css("--rule"); ctx.lineWidth = 1; ctx.strokeRect(x0 - 6, y0 - 4, cw * 5 + 12, rh * 3 + 12);
    ctx.font = fontS + "px " + (pl.fontM || "serif"); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = css("--ink");
    // corner box with 3
    var bs = rh * 0.9, pul = st.pulse ? 1 + 0.25 * st.pulse : 1;
    ctx.lineWidth = 2; ctx.strokeStyle = css("--ink"); ctx.strokeRect(x0 + cw / 2 - bs / 2, y0 + rh / 2 - bs / 2, bs, bs); ctx.fillText("3", x0 + cw / 2, y0 + rh / 2);
    ctx.beginPath(); ctx.moveTo(x0 + cw, y0); ctx.lineTo(x0 + cw, y0 + rh * 2); ctx.lineTo(x0 + cw * 5, y0 + rh * 2); ctx.lineWidth = 1.4; ctx.stroke();
    D.T.forEach(function(c, i){ ctx.fillText(ft(c), x0 + cw * (i + 1.5), y0 + rh / 2); });
    for (var i = 0; i < st.k; i++) {
      if (i > 0) { ctx.fillStyle = css("--ink-2"); ctx.fillText(ft(D.mid[i]), x0 + cw * (i + 1.5), y0 + rh * 1.5); ctx.fillStyle = css("--ink"); }
      ctx.font = "600 " + fontS + "px " + (pl.fontM || "serif"); ctx.fillText(ft(D.bot[i]), x0 + cw * (i + 1.5), y0 + rh * 2.5); ctx.font = fontS + "px " + (pl.fontM || "serif");
    }
    if (st.br) {
      var bx = x0 + cw * 4.08, by = y0 + rh * 2.05;
      if (st.pulse) { ctx.fillStyle = css("--hi"); ctx.globalAlpha = 0.55 * st.pulse; ctx.fillRect(bx, by, cw * 0.92, rh * 0.95); ctx.globalAlpha = 1; ctx.fillStyle = css("--ink"); ctx.font = "600 " + fontS + "px " + (pl.fontM || "serif"); ctx.fillText("4", x0 + cw * 4.5, y0 + rh * 2.5); }
      ctx.lineWidth = 2 * pul; ctx.strokeStyle = css("--ink"); ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + rh * 0.95); ctx.lineTo(bx + cw * 0.92, by + rh * 0.95); ctx.stroke();
    }
    ctx.restore();
  }
  p.render = function(){
    var span = 5.2, curves = st.curve > 0 ? [{ f:fn, color:css("--pen"), width:3, domain:[-1.6, -1.6 + span * st.curve], arrows:st.curve >= 1 }] : [];
    p.draw({ curves:curves, after:function(ctx, pl){
      if (st.marker) {
        ctx.save(); ctx.setLineDash([2, 4]); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.6; ctx.globalAlpha = st.marker;
        ctx.beginPath(); ctx.moveTo(pl.X(3), pl.Y(0)); ctx.lineTo(pl.X(3), pl.Y(0) + (pl.Y(4) - pl.Y(0)) * st.marker); ctx.stroke(); ctx.restore();
        zeroBox(ctx, pl, 3, 12 * (st.pulse ? 1 + 0.35 * st.pulse : 1));
      }
      mini(ctx, pl);
    }, describe:"Synthetic division of P(x) = 2x³ − 5x² − 4x + 7 by x − 3: bottom row 2, 1, −1 and remainder 4 in an L-shaped bracket. The graph of y = P(x) with a framed marker on the x-axis at x = 3 and a dotted line up to the curve. No height is labelled." });
  };
  var cap = "Remainder 4. Divisor " + m("x - 3") + ". Is there a 4 somewhere on this graph?";
  if (MV.reduceMotion) { st = { k:4, br:true, curve:1, marker:1, pulse:0 }; p.render(); f.cap.innerHTML = cap; return; }
  p.render();
  var k = 0, t = setInterval(function(){
    k++; st.k = k; p.render();
    if (k < 4) return;
    clearInterval(t); st.br = true; p.render();
    MV.wait(500, function(){
      MV.tween({ dur:1400, ease:function(x){ return x; }, step:function(x){ st.curve = x; p.render(); }, done:function(){
        MV.tween({ dur:600, step:function(x){ st.marker = x; p.render(); }, done:function(){
          f.cap.innerHTML = cap;
          var n2 = 0;
          (function pulse(){ MV.tween({ dur:700, ease:function(x){ return Math.sin(x * Math.PI); }, step:function(x){ st.pulse = x; p.render(); }, done:function(){ st.pulse = 0; p.render(); if (++n2 < 2) MV.wait(150, pulse); } }); })();
        } });
      } });
    });
  }, 500);
}

// ---------- Explore: division stepper ----------
function explore(host, api){
  var S = api.S, C = api.content, M = C.msgs, YD = C.youDivide;
  if (!S.type) { S.type = "xb"; S.mode = "watch"; S.deg = 3; S.coef = { 4:1, 3:2, 2:-5, 1:-4, 0:7 }; S.a = 2; S.b = 3; S.twin = true; S.graph = false; S.lineR = false; S.p2 = false; S.p3 = false; S.log = []; S.logKey = ""; S.lock = null; S.pins = []; S.tab = "syn"; }
  var pos = 0, play = null, autoT = null, yd = null, fx = {}, twinHidden = false, twinPos = null, sq = null, pendingDone = null, timers = [], tweens = [], anim = null, plot;
  var TC3 = [2, -1, -5, 1];
  function aEff(){ return S.type === "xb" ? 1 : S.a; }
  function topArr(){ var t = []; for (var p = S.deg; p >= 0; p--) t.push(+S.coef[p]); return t; }
  function cur(){ return divide(topArr(), aEff(), S.b, S.type === "axb"); }
  function later(ms, fn){ var t = MV.wait(ms, fn); timers.push(t); return t; }
  function tw(o){ var c = MV.tween(o); tweens.push(c); return c; }
  function stopAll(){
    timers.forEach(clearTimeout); timers = []; tweens.forEach(function(c){ c(); }); tweens = [];
    if (play) { clearInterval(play); play = null; }
    clearTimeout(autoT);
    if (pendingDone) { var d = pendingDone; pendingDone = null; fx = {}; twinHidden = false; twinPos = null; d(); }
  }

  // ----- skeleton -----
  host.innerHTML = '<div class="ds" id="ds"><div class="ds-main" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<p class="ds-now-ph" id="ds-now-ph" aria-hidden="true"></p><p class="vh" id="ds-live" aria-live="polite"></p><div class="ds-tabs" role="group" aria-label="Show">' +
    [["syn", "Synthetic"], ["long", "Long"], ["graph", "Graph"]].map(function(t){ return '<button type="button" data-tab="' + t[0] + '" data-k="tab' + t[0] + '">' + t[1] + "</button>"; }).join("") + "</div>" +
    '<div class="ds-twins"><section class="ds-pane p-syn" aria-label="Synthetic division"><h3 class="ds-h">Synthetic division</h3><div class="sg-wrap" id="ds-grid"></div><div id="ds-yd"></div></section>' +
    '<section class="ds-pane p-long" aria-label="Long-division twin"><h3 class="ds-h">Long-division twin</h3><div id="ds-twin"></div></section></div>' +
    '<section class="ds-pane p-graph" aria-label="Graph view"><h3 class="ds-h">Graph view</h3><div class="plot-wrap"><canvas class="plot" id="ds-plot" role="img" aria-label="Graph of y = P(x)"></canvas></div>' +
    '<div class="chips ds-lr"><button type="button" class="chip" data-act="lineR" data-k="lineR">Line ' + m("y = R") + '</button><span class="tiny muted" id="ds-lr-note"></span></div><p class="gr-off tiny muted" id="ds-gr-off"></p></section></div>' +
    '<div class="ds-side"><div id="ds-lock"></div><div id="ds-type"></div><div id="ds-mode"></div>' +
    '<h4 class="ds-sub">Dividend</h4><div class="chips ds-deg" id="ds-deg" role="group" aria-label="Degree"></div><p class="tiny muted" id="ds-deg-note"></p><div id="ds-sl"></div>' +
    '<h4 class="ds-sub">Divisor</h4><div class="chips" id="ds-a" role="group" aria-label="a, the coefficient of x in the divisor"></div><div id="ds-bsl"></div><p class="ds-divlab" id="ds-divlab" aria-live="polite"></p>' +
    '<p class="tiny muted">Here ' + m("a") + " and " + m("b") + ' are just the numbers in the divisor.</p><div id="ds-pins"></div>' +
    '<div class="ds-step" id="ds-step" tabindex="0" role="group" aria-label="Stepper. Right arrow steps, left arrow goes back, space plays or pauses, Home resets, End jumps to the end."></div>' +
    '<div class="chips ds-views" role="group" aria-label="Views"><button type="button" class="chip" data-act="twin" data-k="vtwin">Long-division twin</button><button type="button" class="chip" data-act="graph" data-k="vgraph">Graph</button></div>' +
    '<p class="tiny muted" id="ds-graph-note"></p><div class="q-actions"><button type="button" class="btn ghost sm" data-act="squeeze" data-k="squeeze">Squeeze long division into synthetic</button></div><p class="tiny muted" id="ds-sq-note"></p>' +
    '<dl class="read ds-read" id="ds-read"></dl></div></div><div class="ds-log" id="ds-log"></div>';
  var ds = $("#ds", host);
  plot = new MV.Plot($("#ds-plot", host), { xmin:-2, xmax:4, ymin:-8, ymax:10 });

  // ----- sliders (fresh hosts each time: MV.sliders adds a listener per call) -----
  var csl = null, bsl = null;
  function buildCoefSliders(){
    var h = document.createElement("div"); $("#ds-sl", host).replaceChildren(h);
    var defs = [];
    for (var p = S.deg; p >= 0; p--) defs.push({ id:"c" + p, label:p === 0 ? "constant" : m(pw(p)), min:-9, max:9, step:1, value:+S.coef[p], skip:p === S.deg ? [0] : null });
    csl = MV.sliders(h, defs, function(id, v){ S.coef[+id.slice(1)] = v; changed(); }); inkSl(h);
  }
  function buildBSlider(){
    var h = document.createElement("div"); $("#ds-bsl", host).replaceChildren(h);
    bsl = MV.sliders(h, [{ id:"b", label:m("b"), min:-6, max:6, step:1, value:S.b }], function(id, v){ S.b = v; changed(); }); inkSl(h);
  }
  function seg(name, label, opts, val, dis){
    return '<div class="seg-wrap"><span class="tiny" style="font-weight:700">' + label + '</span><span class="seg" role="group" aria-label="' + MV.esc(MV.plain(label)) + '">' +
      opts.map(function(o){ return '<button type="button" data-' + name + '="' + o[0] + '" data-k="' + name + o[0] + '" aria-pressed="' + (val === o[0]) + '"' + (dis ? " disabled" : "") + ">" + o[1] + "</button>"; }).join("") + "</span></div>";
  }

  // ----- graph -----
  function view(D){
    var top = D.top, z = fval(D.z), xmin = Math.min(-2, z - 1), xmax = Math.max(4, z + 1);
    if (top.join() === "2,-5,-4,7" && z >= -1 && z <= 3) return { xmin:-2, xmax:4, ymin:-8, ymax:10 };
    var keys = [fval(D.R), evalP(top, 0), 0].concat(crit(top, xmin, xmax).map(function(x){ return evalP(top, x); }));
    var lo = Math.min.apply(null, keys), hi = Math.max.apply(null, keys);
    return { xmin:xmin, xmax:xmax, ymin:Math.max(-60, Math.min(-8, Math.floor(lo - 3))), ymax:Math.min(60, Math.max(10, Math.ceil(hi + 3))) };
  }
  plot.render = function(){
    var D = cur(), top = D.top, v = view(D), f = function(x){ return evalP(top, x); }, z = fval(D.z), R = fval(D.R);
    var bx = fx.barX != null ? fx.barX : z, fin = pos >= 2 * D.n + 1 || !!fx.forceBar, span = v.xmax - v.xmin;
    var curves = [{ f:f, color:css("--pen"), width:3, arrows:fx.curveT == null || fx.curveT >= 1, domain:fx.curveT != null ? [v.xmin - 1, v.xmin + span * fx.curveT] : null }];
    if (fx.curveT == null || fx.curveT >= 1) curves[0].domain = null;
    var others = [];
    if (S.lineR && fin) others = solveEq(f, R, v.xmin, v.xmax).filter(function(x){ return Math.abs(x - bx) > 1e-3; });
    plot.draw({ view:v, curves:curves, xLabel:"x", yLabel:"y", xTicks:{ step:1 }, after:function(ctx, p){
      if (S.lineR && fin && fx.lineT !== 0) {
        var t = fx.lineT == null ? 1 : fx.lineT;
        ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, p.Y(R)); ctx.lineTo(p.W * t, p.Y(R)); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.font = "italic 13px " + p.fontM; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillStyle = css("--ink-2"); ctx.fillText("y = " + fv(R), 6, p.Y(R) - 3); ctx.restore();
        if (t >= 1) others.forEach(function(x){
          var pr = fx.pulse && Math.abs(x - fx.qx) < 1e-3 ? 5 + 4 * fx.pulse : 5;
          ctx.save(); ctx.beginPath(); ctx.arc(p.X(x), p.Y(R), pr, 0, Math.PI * 2); ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = css("--ink"); ctx.stroke(); ctx.restore();
          if (fx.qx != null && Math.abs(x - fx.qx) < 1e-3) { ctx.save(); ctx.font = "700 16px " + p.fontM; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillStyle = css("--ink"); ctx.fillText("?", p.X(x) + 7, p.Y(R) - 6); ctx.restore(); }
        });
      }
      if (fin && fx.barT !== 0) valueBar(ctx, p, bx, R, { t:fx.barT == null ? 1 : fx.barT, label:"R = " + fv(R) });
      if (fx.tag) { ctx.save(); ctx.font = "600 14px " + p.fontM; ctx.textAlign = "right"; ctx.textBaseline = "middle"; bgText(ctx, fx.tag, p.X(bx) - 12, p.Y(R) - (R >= 0 ? 14 : -14)); ctx.restore(); }
      zeroBox(ctx, p, bx, 12 * (fx.mpulse ? 1 + 0.4 * fx.mpulse : 1));
    }, describe:"Graph of y = P(x), " + MV.plain(m("P(x) = " + psrc(D.T))) + ". Divisor’s zero at x = " + ft(D.z) + ". " + (fin ? "The graph is at height " + ft(D.R) + " there, the remainder." : "Finish the division to see the remainder bar.") + (S.lineR && fin ? " The dashed line y = " + ft(D.R) + " meets the graph at " + others.length + " other point" + (others.length === 1 ? "" : "s") + "." : "") });
  };

  // ----- painting -----
  function heightWords(D){ var R = D.R; return R.n === 0 ? "on the " + m("x") + "-axis (height 0)" : R.n < 0 ? "below the " + m("x") + "-axis, at height " + fm(R) : "at height " + fm(R); }
  function paintGrid(an){
    var D = cur(), n = D.n, L = linkAt(D, pos), o = { pos:pos, hl:L.col, same:L.same, adjDone:D.adj && pos >= D.total, tags:{} };
    if (an && an.fresh) { o.fresh = an.fresh; o.times = an.times; }
    if (pos >= 2 * n + 1) { o.tags["b" + n] = "remainder" + (S.p2 && S.graph && fx.barT == null && fx.curveT == null ? "</small><small class=\"sg-tag\">" + m("P(" + fs(D.z) + ") = " + fs(D.R)) : ""); }
    if (D.adj && pos >= D.total) o.tags["b" + n] = "stays";
    if (fx.same1) { o.tags.b1 = "same number"; }
    if (S.mode === "you") ydEdit(D, o);
    $("#ds-grid", host).innerHTML = gridHTML(D, o) + '<svg class="sg-svg" aria-hidden="true"></svg>';
    if (an && an.arrow) drawArrow(an.arrow);
    // twin
    var tw2 = $("#ds-twin", host);
    if (sq) return;
    if (twinHidden) { tw2.innerHTML = '<div class="ld-hidden"><button type="button" class="btn primary sm" data-act="runTwin" data-k="runTwin"' + (MV.S.preds.p4 ? "" : " disabled") + ">Run long division by " + m(dsrc(D.a, D.b)) + "</button></div>"; return; }
    var tp = twinPos == null ? pos : twinPos, TL = linkAt(D, tp);
    var tsame = TL.tsame; if (fx.same1) tsame = { "l0_0":1 };
    var ql = tp === 1 ? 0 : tp >= 3 && tp % 2 === 1 && tp <= 2 * D.n - 1 ? (tp - 1) / 2 : null;
    tw2.innerHTML = twinHTML(D, { pos:tp, hl:TL.rows, same:tsame, fresh:an && an.tfresh, qlab:ql }) + (fx.same1 ? '<p class="tiny ld-same">' + m("x^2") + " here and 1 in the synthetic bottom row: same number.</p>" : "");
  }
  function drawArrow(a){
    var wrap = $("#ds-grid", host), svg = $(".sg-svg", wrap); if (!svg || MV.reduceMotion) return;
    var wr = wrap.getBoundingClientRect();
    function c(id){ var el = id === "z" ? $(".sg-box", wrap) : $('[data-g="' + id + '"]', wrap); if (!el) return null; var r = el.getBoundingClientRect(); return [r.left - wr.left + r.width / 2 + wrap.scrollLeft, r.top - wr.top + r.height / 2]; }
    var pts = a.map(c); if (pts.some(function(x){ return !x; })) return;
    var d = "M" + pts[0][0] + " " + pts[0][1];
    for (var i = 1; i < pts.length; i++) { var p0 = pts[i - 1], p1 = pts[i], mx = (p0[0] + p1[0]) / 2, my = Math.min(p0[1], p1[1]) - 18; d += a.length > 2 ? " Q" + mx + " " + my + " " + p1[0] + " " + p1[1] : " L" + p1[0] + " " + p1[1]; }
    svg.setAttribute("width", wrap.scrollWidth); svg.setAttribute("height", wrap.scrollHeight);
    svg.innerHTML = '<defs><marker id="ds-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs><path class="sg-arrow" d="' + d + '" marker-end="url(#ds-ah)"/>';
  }
  function readout(){
    var D = cur(), n = D.n, rows = [], fin = pos >= 2 * n + 1, done = pos >= D.total, pA = psrc(D.T), dA = dsrc(D.a, D.b);
    rows.push(["Dividend", m("P(x) = " + pA)]);
    var g = gcd(D.a, D.b);
    rows.push(["Divisor", m(dA) + (D.a > 1 && D.b !== 0 && g > 1 ? ' <span class="muted">= ' + m(D.a + "(" + dfsrc(D.z) + ")") + "</span>" : "")]);
    rows.push(["Zero of the divisor", m("x = " + fs(D.z)) + ", because " + m(dA + " = 0") + " when " + m("x = " + fs(D.z))]);
    var miss = []; D.T.forEach(function(c, i){ if (i > 0 && fz(c)) miss.push(m(pw(n - i))); });
    rows.push(["Top row", list(D.T) + (miss.length ? ' <span class="muted">(0 holds the place of ' + miss.join(" and ") + ")</span>" : "")]);
    rows.push(["Now", '<span id="ds-now">' + nowHTML(D) + "</span>"]);
    var qh, built = 0; for (var k = 0; k < n; k++) if (pos >= 2 * k + 1) built++;
    if (D.adj) qh = done ? m("Q(x) = " + psrc(D.q)) + ' <span class="muted">(the bottom row ' + list(D.bot.slice(0, n)) + " divided by " + D.a + ")</span>" : '<span class="muted">' + m("Q(x)") + " appears after the adjust step.</span>";
    else if (fin) qh = m("Q(x) = " + psrc(D.q)) + ' <span class="muted">(degree ' + (n - 1) + ", one less than " + m("P") + ")</span>";
    else qh = built ? m("Q(x) = " + partialQ(D, built)) : '<span class="muted">Not started.</span>';
    rows.push(["Quotient", qh]);
    rows.push(["Remainder", fin ? m("R = " + fs(D.R)) + (fz(D.R) ? ' <span class="muted">(the divisor divides ' + m("P(x)") + " evenly)</span>" : "") : '<span class="muted">Appears once the last column is added.</span>']);
    if (done) {
      var Rt = fz(D.R) ? " + 0" : (D.R.n < 0 ? " - " : " + ") + fs(F(Math.abs(D.R.n), D.R.d));
      rows.push(["Division statement", m(pA + " = (" + dA + ")(" + psrc(D.q) + ")" + Rt)]);
      var fr = fz(D.R) ? "" : (D.R.n < 0 ? " - " : " + ") + "{" + ft(F(Math.abs(D.R.n), D.R.d)).replace(MINUS, "") + "}/{" + dA + "}";
      rows.push(["Fraction form", m("{" + pA + "}/{" + dA + "} = " + psrc(D.q) + fr + ", x != " + fs(D.z))]);
    } else {
      rows.push(["Division statement", '<span class="muted">Appears when the division is finished.</span>']);
    }
    if (S.p2) { var sb = subst(D.T, D.z); rows.push([m("P") + " at the zero", m(sb.src + (fin ? " = R" : ""))]); }
    if (S.graph) rows.push(["Graph", "At " + m("x = " + fs(D.z)) + " the graph of " + m("y = P(x)") + " is " + heightWords(D) + "."]);
    $("#ds-read", host).innerHTML = MV.readoutHTML(rows);
    var ph = $("#ds-now-ph", host), nh = nowHTML(D, true); ph.innerHTML = nh; var lv = $("#ds-live", host), pt = MV.plain(nh); if (lv.textContent !== pt) lv.textContent = pt;
  }
  function partialQ(D, k){ var s = ""; for (var i = 0; i < k; i++) s += tsrc(D.q[i], D.n - 1 - i, i === 0); return s + " + …"; }
  function nowHTML(D, short){
    var s = pos, tot = D.total;
    if (S.mode === "you") {
      if (!yd || !yd.zOk) return "You divide: type the zero of the divisor in the box.";
      if (s < 2 * D.n + 1) return "You divide: step " + (s + 1) + " of " + tot + ". " + (s === 0 ? "Bring down the leading coefficient." : s % 2 ? "Multiply by the number in the box." : "Add the column.");
    }
    if (s === 0) return "Step 0 of " + tot + ". The top row holds the coefficients; the box holds the zero, " + fm(D.z) + ". Press Step or Play.";
    var h = "Step " + s + " of " + tot + ". " + synSentence(D, s);
    return short ? h : h + '<span class="ds-twin-s">' + (twinHidden ? "" : twinSentence(D, s)) + "</span>";
  }
  function paintLog(){
    var L = S.log || [], host2 = $("#ds-log", host);
    if (!L.length) { host2.innerHTML = '<h4 class="ds-sub">Division log</h4><p class="tiny muted">Each division you finish is added here, newest first. The log starts again when you change the dividend.</p>'; return; }
    var head = ["Divisor", "Quotient", "Remainder"].concat(S.p2 ? [m("P") + "(zero)"] : []);
    var rows = L.map(function(r){ return [m(r.d), m(r.q), m(r.r)].concat(S.p2 ? [m("P(" + r.z + ") = " + r.r)] : []); });
    host2.innerHTML = '<h4 class="ds-sub">Division log</h4>' + (S.p2 ? '<p class="tiny"><strong>Compare the last two columns for every row you make.</strong></p>' : "") +
      MV.tableHTML({ head:head, rows:rows, caption:"Division log, newest first" }) + '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="clearLog" data-k="clearLog">Clear log</button><span class="tiny muted">Newest first, up to 6 rows. The log starts again when you change the dividend.</span></div>';
  }
  function addLog(D){
    var tk = D.top.join(",");
    if (S.logKey !== tk) { S.log = []; S.logKey = tk; }
    var key = tk + "|" + D.a + "|" + D.b;
    if (S.log.some(function(r){ return r.k === key; })) return;
    S.log.unshift({ k:key, d:dsrc(D.a, D.b), q:psrc(D.q), r:fs(D.R), z:fs(D.z) });
    S.log = S.log.slice(0, 6); api.save();
  }
  function paintCtl(){
    var D = cur(), L = S.lock;
    MV.keepFocus($("#ds-lock", host), function(){
      $("#ds-lock", host).innerHTML = L ? '<div class="ds-lockbar" tabindex="-1"><p><strong>' + (L === "tc2" ? "Challenge 2 set-up:</strong> the divisor is locked at " + m("x - 2") + "." : "Challenge 3 set-up:</strong> the dividend is locked at " + m("P(x) = 2x^3 - x^2 - 5x + 1") + ".") + '</p><button type="button" class="btn ghost sm" data-act="unlock" data-k="unlock">Unlock</button></div>' : "";
    });
    MV.keepFocus($("#ds-type", host), function(){ $("#ds-type", host).innerHTML = seg("type", "Divisor type", [["xb", m("x - b")], ["axb", m("ax - b")]], S.type, L === "tc2"); });
    MV.keepFocus($("#ds-mode", host), function(){ $("#ds-mode", host).innerHTML = seg("mode", "Mode", [["watch", "Watch"], ["you", "You divide"]], S.mode); });
    MV.keepFocus($("#ds-deg", host), function(){
      $("#ds-deg", host).innerHTML = '<span class="tiny" style="font-weight:700;align-self:center">Degree</span>' + [2, 3, 4].map(function(d){ var dis = L === "tc3" || (d === 4 && S.type === "axb"); return '<button type="button" class="chip' + (S.deg === d ? " on" : "") + '" data-deg="' + d + '" data-k="deg' + d + '" aria-pressed="' + (S.deg === d) + '"' + (dis ? " disabled" : "") + ">" + d + "</button>"; }).join("");
    });
    $("#ds-deg-note", host).textContent = S.type === "axb" ? "Degree 4 with " + MV.plain(m("ax - b")) + " makes the fractions too big to read. Use " + MV.plain(m("x - b")) + " for quartics." : "";
    $("#ds-deg-note", host).hidden = S.type !== "axb";
    $$("#ds-sl input", host).forEach(function(el){ el.disabled = L === "tc3"; });
    MV.keepFocus($("#ds-a", host), function(){
      $("#ds-a", host).innerHTML = S.type === "axb" ? '<span class="tiny" style="font-weight:700;align-self:center">' + m("a") + "</span>" + [1, 2, 3].map(function(a){ return '<button type="button" class="chip' + (S.a === a ? " on" : "") + '" data-a="' + a + '" data-k="a' + a + '" aria-pressed="' + (S.a === a) + '">' + a + "</button>"; }).join("") : "";
    });
    $$("#ds-bsl input", host).forEach(function(el){ el.disabled = L === "tc2"; });
    $("#ds-divlab", host).innerHTML = (S.type === "xb" ? m("x - b") : m("ax - b")) + " = " + m(dsrc(D.a, D.b));
    // pins
    MV.keepFocus($("#ds-pins", host), function(){
      if (L !== "tc3") { $("#ds-pins", host).innerHTML = ""; return; }
      var P = S.pins || [];
      $("#ds-pins", host).innerHTML = '<div class="ds-pinbox"><button type="button" class="btn primary sm" data-act="pin" data-k="pin"' + (P.length >= 3 ? " disabled" : "") + ">Pin this divisor</button>" +
        '<ul class="ds-pinlist">' + (P.length ? P.map(function(q, i){ var Dq = divide(TC3, q.a, q.b, true); return "<li>" + m(dsrc(q.a, q.b)) + ': zero ' + fm(Dq.z) + ", remainder " + fm(Dq.R) + ' <button type="button" class="linkbtn" data-unpin="' + i + '" data-k="unpin' + i + '">Remove</button></li>'; }).join("") : '<li class="muted">No divisors pinned yet.</li>') + "</ul></div>";
    });
    // stepper
    MV.keepFocus($("#ds-step", host), function(){
      var you = S.mode === "you", tot = D.total;
      $("#ds-step", host).innerHTML = you ? '<button type="button" class="btn ghost sm" data-pl="reset" data-k="plreset">Reset</button><span class="tiny muted">In You divide, you fill in each cell.</span>' :
        '<button type="button" class="btn ghost sm" data-pl="back" data-k="plback"' + (pos <= 0 ? " disabled" : "") + ">Back</button>" +
        '<button type="button" class="btn primary sm" data-pl="step" data-k="plstep"' + (pos >= tot ? " disabled" : "") + ">Step</button>" +
        (MV.reduceMotion ? "" : '<button type="button" class="btn ghost sm" data-pl="play" data-k="plplay"' + (pos >= tot && !play ? " disabled" : "") + ">" + (play ? "Pause" : "Play") + "</button>") +
        '<button type="button" class="btn ghost sm" data-pl="reset" data-k="plreset">Reset</button><button type="button" class="btn ghost sm" data-pl="end" data-k="plend"' + (pos >= tot ? " disabled" : "") + ">Jump to end</button>";
    });
    var vt = $('[data-act="twin"]', host), vg = $('[data-act="graph"]', host), vl = $('[data-act="lineR"]', host);
    vt.setAttribute("aria-pressed", !!S.twin); vt.classList.toggle("on", !!S.twin);
    vg.setAttribute("aria-pressed", !!S.graph); vg.classList.toggle("on", !!S.graph); vg.disabled = !S.p2;
    vl.setAttribute("aria-pressed", !!S.lineR); vl.classList.toggle("on", !!S.lineR); vl.disabled = !S.p3;
    $("#ds-graph-note", host).textContent = S.p2 ? "" : "The graph switches on in prediction P2.";
    $("#ds-lr-note", host).textContent = S.p3 ? "" : "Turns on in prediction P3.";
    var canSq = aEff() === 1 && S.twin && pos >= D.total && S.mode === "watch" && !twinHidden;
    $('[data-act="squeeze"]', host).disabled = !canSq || !!sq;
    $("#ds-sq-note", host).textContent = canSq ? "" : "Available when a division by " + MV.plain(m("x - b")) + " is finished in Watch mode with the twin on.";
    ds.classList.toggle("g-on", !!S.graph); ds.classList.toggle("t-on", !!S.twin); ds.dataset.tab = S.tab || "syn";
    $$(".ds-tabs [data-tab]", host).forEach(function(b){ b.setAttribute("aria-pressed", b.dataset.tab === (S.tab || "syn")); });
    $("#ds-gr-off", host).textContent = S.graph ? "" : (S.p2 ? "Graph view is off. Turn it on with the Graph button." : "Graph view is off until prediction P2.");
  }
  function paint(an){ paintGrid(an); paintYd(); readout(); paintCtl(); paintLog(); plot.render(); MV.changed(); }

  // ----- stepping -----
  function animFor(D, s){
    var n = D.n;
    if (s === 1) return { fresh:"b0", tfresh:"q0" };
    if (s > 2 * n + 1) { var all = []; for (var q = 0; q < n; q++) all.push("b" + q); return { fresh:all }; }
    var i = Math.floor(s / 2);
    if (s % 2 === 0) return { fresh:"m" + i, times:true, tfresh:"p" + (i - 1), arrow:["b" + (i - 1), "z", "m" + i] };
    return { fresh:"b" + i, tfresh:"l" + (i - 1), arrow:["t" + i, "b" + i] };
  }
  function setPos(p, animate){
    var D = cur(); p = Math.max(0, Math.min(D.total, p));
    var fwd = p === pos + 1; pos = p; fx.same1 = false;
    if (pos >= D.total && S.mode === "watch") addLog(D);
    paint(animate && fwd ? animFor(D, pos) : null);
    if (animate && fwd && pos === 2 * D.n + 1 && S.graph && !fx.forceBar) growBar();
    if (animate && fwd && pos === D.total) pulseQ();
  }
  function growBar(){ fx.barT = 0; tw({ dur:500, step:function(t){ fx.barT = t; plot.render(); }, done:function(){ fx.barT = null; plot.render(); } }); }
  function pulseQ(){ if (MV.reduceMotion) return; var D = cur(); $$('#ds-grid [data-g^="b"], #ds-twin [data-g^="q_"]', host).forEach(function(el){ if (el.dataset.g !== "b" + D.n) el.classList.add("pulse"); }); }
  function pulseRem(){ if (MV.reduceMotion) return; var el = $('#ds-grid [data-g="b' + cur().n + '"]', host); if (el) el.classList.add("pulse"); }
  function stopPlay(){ if (play) { clearInterval(play); play = null; } }
  function togglePlay(){
    if (play) { stopPlay(); paintCtl(); return; }
    var D = cur(); if (pos >= D.total) pos = 0;
    play = setInterval(function(){ var D2 = cur(); if (pos >= D2.total) { stopPlay(); paintCtl(); return; } setPos(pos + 1, true); if (pos >= D2.total) { stopPlay(); paintCtl(); } }, 900);
    setPos(pos + 1, true);
  }
  // any change to the set-up: reset the stepper; Watch jumps to the end after 400 ms
  function changed(){
    stopAll(); fx = {}; sq = null; twinHidden = false; twinPos = null; yd = S.mode === "you" ? newYd() : null;
    if (S.lock === "tc3") { S.deg = 3; S.coef[3] = 2; S.coef[2] = -1; S.coef[1] = -5; S.coef[0] = 1; }
    if (S.lock === "tc2") { S.type = "xb"; S.b = 2; }
    pos = 0; api.save(); paint();
    if (S.mode === "watch") autoT = setTimeout(function(){ setPos(cur().total, false); }, 400);
  }

  // ----- You divide -----
  function newYd(){ return { zOk:false, vals:{}, msg:"", bad:false, wrong:{}, adj:null, adjOk:false, read:null, readOk:false, chips:null }; }
  function nextCell(D){ var s = pos + 1; if (s > 2 * D.n + 1) return null; return s === 1 ? "b0" : s % 2 === 0 ? "m" + (s / 2) : "b" + ((s - 1) / 2); }
  function expect(D, id){ var k = +id.slice(1); return id[0] === "m" ? D.mid[k] : D.bot[k]; }
  function inputHTML(id, label){ return '<input class="sg-in' + (yd.bad ? " bad" : "") + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" data-cell="' + id + '" data-k="yd' + id + '" aria-label="' + MV.esc(label) + '" value="' + MV.esc(yd.vals[id] || "") + '">'; }
  function ydEdit(D, o){
    if (!yd) yd = newYd();
    o.edit = {};
    if (!yd.zOk) { o.edit.z = '<span class="sg-box">' + inputHTML("z", "The zero of the divisor") + "</span>"; return; }
    var id = nextCell(D); if (!id) return;
    var p = D.n - (+id.slice(1));
    o.edit[id] = inputHTML(id, (id[0] === "m" ? "Products row, " : "Bottom row, ") + POWN[p] + " column");
    o.hl = +id.slice(1);
  }
  function paintYd(){
    var el = $("#ds-yd", host), D = cur();
    if (S.mode !== "you" || !yd) { el.innerHTML = ""; return; }
    var h = "";
    var need = !yd.zOk || nextCell(D);
    if (need) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="ydcheck" data-k="ydcheck">Check this cell</button><span class="tiny muted">Or press Enter.</span></div>';
    else if (D.adj && !yd.adjOk) {
      h += '<p class="pred-q">Adjust for ' + m(dsrc(D.a, D.b)) + ":</p><div class=\"chips\">" + YD.adjust.map(function(c, i){ return '<button type="button" class="chip' + (yd.adj === i ? " on" : "") + '" data-adj="' + i + '" data-k="adj' + i + '">' + c.t + "</button>"; }).join("") + "</div>";
    } else if (!yd.readOk) {
      if (!yd.chips) yd.chips = readChips(D);
      h += '<p class="pred-q">Read the result. So the quotient and remainder are…</p><div class="chips">' + yd.chips.map(function(c, i){ return '<button type="button" class="chip' + (yd.read === i ? " on" : "") + '" data-read="' + i + '" data-k="read' + i + '">' + c.t + "</button>"; }).join("") + "</div>";
    }
    if (yd.msg) h += '<div class="fb ' + (yd.good ? "good" : "bad") + '" role="status"><p>' + yd.msg + "</p></div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function readChips(D){
    var Q = D.q, R = D.R, qs = psrc(Q), out = [
      { t:m(qs) + ", remainder " + fm(R), ok:true, fb:YD.readRight },
      { t:m(psrc(Q.concat([F(0)]))) + ", remainder " + fm(R), fb:YD.readDeg },
      { t:m(psrc(Q.concat([R]))), fb:YD.readTerm }];
    if (!fz(R)) out.push({ t:m(qs) + ", remainder " + fm(fneg(R)), fb:YD.readSign });
    return MV.shuffle(out, D.top.join() + D.a + D.b);
  }
  function activeChal(){ var t = topArr().join(); return S.lock || (t === "1,0,-6,4" ? "tc1" : null); }
  function penalize(cell){
    var id = activeChal(); if (!id || yd.wrong[cell]) return; yd.wrong[cell] = 1;
    var st = MV.S.chal[id] || (MV.S.chal[id] = { tries:0, hint:0, solved:false, first:null }); if (!st.solved) { st.tries++; MV.save(); }
  }
  function zeroMsg(D, v){
    var z = D.z, a = D.a, b = D.b, dA = dsrc(a, b), zv = fval(z);
    if (!near(zv, 0) && near(v, -zv)) return "That’s the zero of " + m(dsrc(a, -b)) + ". For " + m(dA) + ", solve " + m(dA + " = 0") + ": the zero is " + fm(z) + ".";
    if (a !== 1 && near(v, b)) return "That would be the zero of " + m(dsrc(1, b)) + ". Solve " + m(dA + " = 0") + ".";
    if (a !== 1 && b !== 0 && near(v, a / b)) return "Upside down. " + m(dA + " = 0") + " gives " + m("x = " + fs(z)) + ".";
    if (a !== 1 && near(v, a)) return a + " is the coefficient of " + m("x") + ". The zero solves " + m(dA + " = 0") + ".";
    return "Solve " + m(dA + " = 0") + " to find the number for the box.";
  }
  function ydCheck(){
    var D = cur(), id = yd.zOk ? nextCell(D) : "z"; if (!id) return;
    var r = MV.parseNum(yd.vals[id]);
    if (!r || r.length !== 1) { yd.msg = "Type a number, such as −2 or 1/2."; yd.good = false; yd.bad = true; paint(); focusYd(); return; }
    var v = r[0], ok, msg = "";
    if (id === "z") { ok = near(v, fval(D.z)); if (!ok) msg = zeroMsg(D, v); }
    else {
      var e = expect(D, id), k = +id.slice(1); ok = near(v, fval(e));
      if (!ok && id === "b0") msg = YD.bring;
      else if (!ok && id[0] === "m") {
        if (near(v, -fval(fmul(D.bot[k - 1], D.z)))) msg = "That’s the product with " + fm(fneg(D.z)) + ". Multiply by the number in the box, " + m(fsig(D.z)) + ".";
        else if (near(v, fval(fmul(D.T[k - 1], D.z))) || near(v, fval(fmul(D.T[k], D.z)))) msg = YD.top;
        else msg = "Multiply the bottom number " + fm(D.bot[k - 1]) + " by the number in the box, " + fm(D.z) + ".";
      } else if (!ok) {
        if (near(v, fval(D.T[k]) - fval(D.mid[k]))) msg = "Synthetic division adds the column. Long division subtracts, but the box already holds " + m(fsig(D.z)) + " instead of " + m(fsig(fneg(D.z))) + ", so here you add.";
        else msg = "Add the two numbers in this column: " + m(fs(D.T[k]) + " + " + fpar(D.mid[k])) + ".";
      }
    }
    if (ok) {
      yd.msg = ""; yd.bad = false;
      if (id === "z") { yd.zOk = true; paint(); focusYd(); return; }
      setPos(pos + 1, true);
      if (pos >= D.total && !D.adj) {}
      focusYd(); return;
    }
    penalize(id); yd.msg = "<strong>✗ Not quite.</strong> " + msg; yd.good = false; yd.bad = true; paint(); focusYd();
  }
  function focusYd(){ var el = $("#ds-grid .sg-in", host); if (el) { el.focus({ preventScroll:true }); el.select(); } else { var c = $("#ds-yd .chip", host); if (c) c.focus({ preventScroll:true }); } }

  // ----- squeeze (five beats) -----
  function squeeze(){
    var D = cur(), n = D.n, el = $("#ds-twin", host);
    sq = { beat:0 };
    var before = '<table class="ld sq-ld"><tbody>' + sqRows(D) + "</tbody></table>", after = gridHTML(D, { pos:D.total, caption:"The same division as a synthetic grid" });
    var nz = fneg(D.z), cap = C.squeezeCaption.replace("+3", (D.z.n >= 0 ? "+" : "") + ft(D.z)).replace("−3", (nz.n >= 0 ? "+" : "") + ft(nz));
    var notes = sqNotes(D);
    if (MV.reduceMotion) {
      el.innerHTML = '<div class="sq-side"><div><p class="tiny"><strong>Long division</strong></p>' + before + '</div><div><p class="tiny"><strong>Synthetic division</strong></p>' + after + "</div></div><ol class=\"sq-notes\">" + notes.map(function(t){ return "<li>" + t + "</li>"; }).join("") + '</ol><p class="sq-cap">' + cap + '</p><button type="button" class="btn ghost sm" data-act="sqclose" data-k="sqclose">Back to the twin</button>';
      paintCtl(); return;
    }
    el.innerHTML = '<div class="sq-stage" id="sq-stage">' + before + '<div class="sq-after">' + after + '</div></div><p class="sq-beat" id="sq-beat" aria-live="polite"></p><p class="sq-cap" id="sq-cap"></p><button type="button" class="btn ghost sm" data-act="sqclose" data-k="sqclose">Back to the twin</button>';
    paintCtl();
    var stage = $("#sq-stage", el), beatEl = $("#sq-beat", el);
    function beat(k){
      if (!sq) return;
      stage.classList.add("b" + k);
      if (k <= 4) beatEl.innerHTML = k + ". " + notes[k - 1];
      if (k === 4) $$("[data-flip]", stage).forEach(function(s){ s.innerHTML = s.dataset.flip; });
      if (k === 5) { beatEl.innerHTML = "5. Everything slides into the three-row synthetic grid."; $("#sq-cap", el).innerHTML = cap; return; }
      later(800, function(){ beat(k + 1); });
    }
    later(300, function(){ beat(1); });
  }
  function sqTerm(c, p, first){ var one = Math.abs(c.n) === 1 && c.d === 1 && p > 0; return { sign:c.n < 0 ? (first ? "-" : " - ") : (first ? "" : " + "), c:fz(c) ? "0" : one ? "" : fs(F(Math.abs(c.n), c.d)), one:one, x:pw(p) }; }
  function sqCell(c, p, first, cls, flip){   // a hidden "1" appears once the x's fade (beat 1)
    var t = sqTerm(c, p, first), signed = (t.sign || t.c ? m(t.sign + t.c) : "") + (t.one ? '<span class="sq-one">' + m("1") + "</span>" : ""), fl = flip ? ' data-flip="' + MV.esc(flip) + '"' : "";
    return '<td class="' + (cls || "") + '"><span class="sq-c"' + fl + ">" + signed + '</span><span class="sq-x">' + (t.x ? m(t.x) : "") + "</span></td>";
  }
  function sqRows(D){
    var n = D.n, h = "", k, i;
    function tr(cls, lead, cells){ var r = '<tr class="' + cls + '"><td class="ld-l">' + lead + "</td>"; for (var p = n; p >= 0; p--) r += cells[p] || "<td></td>"; return r + "</tr>"; }
    var qc = {}; for (k = 0; k < n; k++) qc[n - 1 - k] = sqCell(D.q[k], n - 1 - k, k === 0, "sq-q");
    h += tr("ld-q", "", qc);
    var dv = {}; D.T.forEach(function(c, i2){ dv[n - i2] = sqCell(c, n - i2, i2 === 0, i2 === 0 ? "sq-lead sq-first" : ""); });
    h += tr("ld-dvd", '<span class="sq-x">' + m("x") + '</span> <span class="sq-dv" data-flip="' + MV.esc('<span class="sg-box">' + fm(D.z) + "</span>") + '">' + m((D.z.n > 0 ? "- " : "+ ") + fs(F(Math.abs(D.z.n), D.z.d))) + '</span><span class="ld-par" aria-hidden="true">)</span>', dv);
    for (k = 0; k < n; k++) {
      var pc = {};
      pc[n - k] = sqCell(D.bot[k], n - k, true, "sq-lead");
      pc[n - k - 1] = sqCell(fneg(D.mid[k + 1]), n - k - 1, false, "sq-pr", m(fsig(D.mid[k + 1])));
      h += tr("ld-prod", '<span class="ld-minus" data-flip="+">−</span>', pc);
      var lc = {}, last = k === n - 1;
      lc[n - k - 1] = sqCell(D.bot[k + 1], n - k - 1, true, (last ? "ld-rem" : "sq-lead sq-first"));
      if (!last) lc[n - k - 2] = sqCell(D.T[k + 2], n - k - 2, false, "");
      h += tr("ld-left", "", lc);
    }
    var dr = {}; for (i = 0; i <= n; i++) dr[n - i] = '<td class="sq-dropc">' + fm(D.bot[i]) + "</td>";
    h += tr("sq-drop", '<span class="tiny">one row:</span>', dr);
    return h;
  }
  function sqNotes(D){
    var n = D.n, xs = []; for (var p = n; p >= 1; p--) xs.push(m(pw(p)));
    var leads = [], prods = [], flips = [];
    for (var k = 0; k < n; k++) { var lt = tsrc(D.bot[k], n - k, true); leads.push(m(lt + " - " + (D.bot[k].n < 0 ? "(" + lt + ")" : lt))); prods.push(fm(fneg(D.mid[k + 1]))); flips.push(fm(D.mid[k + 1])); }
    return ["Every " + xs.reverse().join(", ") + " in the long division fades out, leaving the coefficients in their columns.",
      "The leading terms that always cancel (" + leads.join(", ") + ") strike through and fade.",
      "The quotient numbers " + list(D.q) + " are the same as the first number of each leftover line, so they drop to a single row.",
      "The divisor’s " + fm(fneg(D.z)) + " flips to " + m(fsig(D.z)) + " and moves into a corner box. The subtracted products " + prods.join(", ") + " flip to " + flips.join(", ") + ", and every “subtract” becomes “add”."];
  }

  // ----- events -----
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var d = b.dataset;
    if (d.tab) { S.tab = d.tab; api.save(); paintCtl(); plot.render(); return; }
    if (d.type) { if (S.type === d.type) return; S.type = d.type; if (S.type === "axb") { S.a = 2; S.b = 1; if (S.deg === 4) { S.deg = 3; if (!+S.coef[3]) S.coef[3] = 1; buildCoefSliders(); } } else S.b = 3; bsl.set("b", S.b); changed(); return; }
    if (d.mode) { if (S.mode === d.mode) return; S.mode = d.mode; changed(); return; }
    if (d.deg) { var nd = +d.deg; if (nd === S.deg) return; if (nd > S.deg) for (var p = S.deg + 1; p <= nd; p++) S.coef[p] = p === nd ? 1 : 0; else if (!+S.coef[nd]) S.coef[nd] = 1; S.deg = nd; buildCoefSliders(); changed(); return; }
    if (d.a) { S.a = +d.a; changed(); return; }
    if (d.pl) {
      var D = cur();
      if (d.pl === "reset") { if (S.mode === "you") { changed(); stopAll(); return; } stopAll(); setPos(0); return; }
      if (d.pl === "back") { stopPlay(); setPos(pos - 1); return; }
      if (d.pl === "step") { stopPlay(); setPos(pos + 1, true); return; }
      if (d.pl === "play") { togglePlay(); return; }
      if (d.pl === "end") { stopPlay(); setPos(D.total, false); return; }
    }
    if (d.act === "twin") { S.twin = !S.twin; if (!S.twin) sq = null; api.save(); paint(); return; }
    if (d.act === "graph") { S.graph = !S.graph; if (S.graph && (S.tab || "syn") !== "graph") {} api.save(); paint(); return; }
    if (d.act === "lineR") { S.lineR = !S.lineR; api.save(); paint(); return; }
    if (d.act === "clearLog") { S.log = []; api.save(); paintLog(); return; }
    if (d.act === "unlock") { S.lock = null; changed(); return; }
    if (d.act === "pin") { S.pins = (S.pins || []).concat([{ a:aEff(), b:S.b }]).slice(0, 3); api.save(); paintCtl(); MV.changed(); return; }
    if (d.unpin != null) { S.pins.splice(+d.unpin, 1); api.save(); paintCtl(); MV.changed(); return; }
    if (d.act === "squeeze") { squeeze(); return; }
    if (d.act === "sqclose") { stopAll(); sq = null; paint(); return; }
    if (d.act === "runTwin") { runP4Twin(function(){}); return; }
    if (d.act === "ydcheck") { ydCheck(); return; }
    if (d.adj != null) {
      var D2 = cur(), c = YD.adjust[+d.adj]; yd.adj = +d.adj;
      if (MV.ok(c)) { yd.adjOk = true; yd.msg = "<strong>✓ Correct.</strong> " + c.fb; yd.good = true; setPos(pos + 1, true); paintYd(); focusYd(); }
      else { penalize("adj"); yd.msg = "<strong>✗ Not quite.</strong> " + c.fb; yd.good = false; paintYd(); }
      void D2; return;
    }
    if (d.read != null) {
      var ch = yd.chips[+d.read]; yd.read = +d.read;
      if (ch.ok) { yd.readOk = true; yd.msg = "<strong>✓ Correct.</strong> " + ch.fb; yd.good = true; addLog(cur()); paint(); }
      else { penalize("read"); yd.msg = "<strong>✗ Not quite.</strong> " + ch.fb; yd.good = false; paintYd(); }
      return;
    }
  });
  host.addEventListener("input", function(e){ var t = e.target; if (t.dataset && t.dataset.cell && yd) { yd.vals[t.dataset.cell] = t.value; } });
  host.addEventListener("keydown", function(e){
    var t = e.target;
    if (t.dataset && t.dataset.cell && e.key === "Enter") { e.preventDefault(); ydCheck(); return; }
    if (t.id === "ds-step" || (t.closest && t.closest("#ds-step") && e.key !== " " && e.key !== "Enter")) {
      if (S.mode === "you") return;
      var D = cur(), k = e.key;
      if (k === "ArrowRight") { e.preventDefault(); stopPlay(); setPos(pos + 1, true); }
      else if (k === "ArrowLeft") { e.preventDefault(); stopPlay(); setPos(pos - 1); }
      else if (k === " " && t.id === "ds-step") { e.preventDefault(); if (!MV.reduceMotion) togglePlay(); else setPos(pos + 1, true); }
      else if (k === "Home") { e.preventDefault(); stopAll(); setPos(0); }
      else if (k === "End") { e.preventDefault(); stopPlay(); setPos(D.total); }
    }
  });
  // challenge set-up buttons live inside the challenge prompts (rendered by the toolkit)
  document.addEventListener("click", function(e){
    var b = e.target.closest("[data-setup]"); if (!b) return;
    S.lock = b.dataset.setup;
    if (S.lock === "tc3") { S.pins = S.pins || []; buildCoefSliders(); }
    changed(); buildCoefSliders(); bsl.set("b", S.b); paintCtl();
    host.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
    var lb = $(".ds-lockbar", host); if (lb) lb.focus({ preventScroll:true });
  });


  // ----- prediction reveals -----
  function setup(st){
    stopAll(); fx = {}; sq = null; yd = null; S.mode = "watch"; S.lock = null;
    S.type = st.type; S.deg = st.coef.length - 1; st.coef.forEach(function(c, i){ S.coef[S.deg - i] = c; });
    if (st.type === "axb") S.a = st.a; S.b = st.b; S.graph = !!st.graph;
    twinHidden = !!st.twinHidden; twinPos = null;
    buildCoefSliders(); bsl.set("b", S.b);
    var D = cur(); pos = st.pos === "end" ? D.total : st.pos;
    api.save();
  }
  function runP4Twin(done){
    var D = cur(); twinHidden = false; twinPos = 0; paint();
    var k = 0;
    (function nx(){ k++; twinPos = k; paint({ tfresh:animFor(D, k).tfresh }); if (k < 2 * D.n + 1) later(MV.reduceMotion ? 0 : 280, nx); else { twinPos = null; later(400, function(){ setPos(D.total, true); done(); }); } })();
  }
  var preds = {
    start:function(p){ setup(p.start); S.tab = p.id === "p1" ? "long" : p.id === "p2" ? "syn" : p.id === "p4" ? "long" : "graph"; if (p.id === "p4") { S.lineR = true; fx = { barX:-1, qx:0.5 }; } paint(); },
    run:function(p, done){
      pendingDone = done;
      var fin = function(){ if (pendingDone === done) { pendingDone = null; done(); } };
      var D = cur();
      if (p.id === "p1") {
        S.tab = "long"; paintCtl(); setPos(3, true); fx.same1 = true; later(250, function(){ paint(); later(1200, fin); });
      } else if (p.id === "p2") {
        S.graph = true; S.tab = "graph"; S.p2 = true; api.save(); fx = { curveT:0, barT:0 }; paint();
        tw({ dur:1200, ease:function(t){ return t; }, step:function(t){ fx.curveT = t; plot.render(); }, done:function(){
          fx.curveT = null; fx.mpulse = 0;
          tw({ dur:500, step:function(t){ fx.barT = t; plot.render(); }, done:function(){
            fx.barT = null; fx.tag = "P(3) = 4"; paint(); pulseRem();
            tw({ dur:900, ease:function(t){ return Math.sin(t * Math.PI * 2) * 0.5 + 0.5; }, step:function(t){ fx.mpulse = t; plot.render(); }, done:function(){ fx.mpulse = 0; plot.render(); later(400, fin); } });
          } });
        } });
      } else if (p.id === "p3") {
        S.graph = true; S.tab = "graph"; S.b = -1; bsl.set("b", -1); api.save();
        var D3 = cur(), k = 0; pos = 0; fx = { barX:3, forceBar:true }; paint();
        (function nx(){ k++; setPos(k, true); if (k < D3.total) later(MV.reduceMotion ? 0 : 160, nx); else after(); })();
        tw({ dur:1000, step:function(t){ fx.barX = 3 - 4 * t; plot.render(); }, done:function(){ fx.barX = null; plot.render(); } });
        function after(){
          later(300, function(){
            S.lineR = true; S.p3 = true; api.save(); fx = { lineT:0, qx:0.5 }; paint();
            tw({ dur:700, ease:function(t){ return t; }, step:function(t){ fx.lineT = t; plot.render(); }, done:function(){
              fx.lineT = null;
              tw({ dur:1200, ease:function(t){ return Math.abs(Math.sin(t * Math.PI * 2)); }, step:function(t){ fx.pulse = t; plot.render(); }, done:function(){ fx.pulse = 0; plot.render(); fin(); } });
            } });
          });
        }
      } else if (p.id === "p4") {
        S.tab = "long"; paintCtl();
        runP4Twin(function(){
          S.tab = "graph"; paintCtl();
          tw({ dur:900, step:function(t){ fx.barX = -1 + 1.5 * t; plot.render(); }, done:function(){ fx.barX = null; fx.qx = null; fx.tag = "P(1/2) = 4"; paint(); later(500, fin); } });
        });
      } else fin();
      void D;
    }
  };

  // ----- challenges -----
  function challenge(id){
    var D = cur(), t = topArr().join(), a1 = aEff() === 1, m2 = a1 && S.b === -2, p2 = a1 && S.b === 2, T = M[id];
    if (id === "tc1") {
      if (t === "1,0,-6,4" && m2) return pos >= D.total ? { ok:true } : { ok:false, msg:T.run };
      if (t === "1,-6,4" && p2) return { ok:false, msg:T.both };
      if (t === "1,-6,4") return { ok:false, msg:T.deg2 };
      if (t === "1,0,-6,4" && p2) return { ok:false, msg:T.b2 };
      return { ok:false, msg:T.other };
    }
    if (id === "tc2") {
      if (!p2) return { ok:false, msg:T.lock };
      if (t === "1,-3,4,-1") return { ok:true };
      if (t === "1,1,0,7") return { ok:false, msg:T.plus };
      if (t === "1,-3,4,-4") return { ok:false, msg:T.zero };
      var tp = topArr();
      if (tp.length === 4 && tp[0] === 1 && tp[1] === -3 && tp[2] === 4) return { ok:false, msg:T.quot };
      if (tp[0] !== 1) return { ok:false, msg:T.lead };
      return { ok:false, msg:T.other };
    }
    if (id === "tc3") {
      if (S.lock !== "tc3") return { ok:false, msg:T.lock };
      var P = (S.pins || []).map(function(q){ var Dq = divide(TC3, q.a, q.b, true); return { a:q.a, b:q.b, z:Dq.z, R:Dq.R }; });
      if (P.length < 3) return { ok:false, msg:T.few };
      var distinct = !P.some(function(x, i){ return P.some(function(y, j){ return j > i && feq(x.z, y.z); }); });
      if (distinct && P.every(function(x){ return feq(x.R, F(3)); })) return { ok:true };
      for (var i = 0; i < P.length; i++) for (var j = i + 1; j < P.length; j++) if (feq(P[i].z, P[j].z)) return { ok:false, msg:T.same.replace("{z}", ft(P[i].z)) };
      if (P.some(function(x){ return x.a === 2 && x.b === 1; })) return { ok:false, msg:T.half };
      if (P.some(function(x){ return x.a === 1 && x.b === 1; })) return { ok:false, msg:T.one };
      if (P.some(function(x){ return x.a === 1 && x.b === -2; })) return { ok:false, msg:T.two };
      return { ok:false, msg:T.other };
    }
    return { ok:false };
  }

  // ----- start -----
  buildCoefSliders(); buildBSlider();
  if (S.lock === "tc3") { S.deg = 3; S.coef[3] = 2; S.coef[2] = -1; S.coef[1] = -5; S.coef[0] = 1; buildCoefSliders(); }
  yd = S.mode === "you" ? newYd() : null;
  pos = S.mode === "watch" ? cur().total : 0;
  paint();
  return { predict:preds, challenge:function(id){ return challenge(id); } };
}

// ---------- Part 3: the remainder shortcut ----------
function part3(host, api){
  var S = api.S, C = api.content, RD = C.radar, PF = C.proof, MT = C.match, PA = [1, -2, -3, 5];
  if (!S.stage) { S.stage = "A"; S.ci = 0; S.cards = {}; S.ord = PF.start.slice(); S.os = { tries:0, hint:0, solved:false, first:null }; S.ax = null; S.rd = 0; S.k = [0, 0]; S.locks = [0, 0]; S.m1 = false; S.noted = false; S.ex = { open:false, vals:{}, solved:false, tries:0, hint:0 }; S.kx = false; }
  var gx = { mx:null, barT:null, pic:0 }, msgs = {}, sel = null, oMsg = null, exMsg = null, lockMsg = null, ksl = null, timers = [];
  function later(ms, fn){ var t = MV.wait(ms, fn); timers.push(t); return t; }
  function stop(){ timers.forEach(clearTimeout); timers = []; }
  host.innerHTML = '<div class="sym sc"><div><div class="plot-wrap"><canvas class="plot" id="sc-plot" role="img" aria-label="Graph"></canvas></div><p class="tiny muted" id="sc-cap" aria-live="polite"></p></div>' +
    '<div><div class="chips" id="sc-stages" role="group" aria-label="Stage"></div><div id="sc-panel"></div></div></div>';
  var plot = new MV.Plot($("#sc-plot", host), { xmin:-2.5, xmax:3.5, ymin:-6, ymax:8 });
  function card(){ return RD.cards[S.ci]; }
  function cst(id){ return S.cards[id] || (S.cards[id] = { val:"", tries:0, hint:0, solved:false, first:null }); }
  function cz(c){ return F(c.b, c.a); }
  function round(){ return MT.rounds[S.rd]; }
  function kNow(){ return S.rd === 1 && S.kx ? -2 / 3 : S.k[S.rd]; }
  function rP(k){ var c = round().c.slice(); c[1] = k; return c; }
  function rem(k){ var R = round(); return R.z.map(function(z){ return evalP(rP(k), z); }); }

  plot.render = function(){
    var st = S.stage;
    if (st === "C") {
      var R = round(), k = kNow(), top = rP(k), rr = rem(k), eq = Math.abs(rr[0] - rr[1]) < 1e-9;
      plot.draw({ view:{ xmin:-2, xmax:3, ymin:-14, ymax:14 }, curves:[{ f:function(x){ return evalP(top, x); }, color:css("--pen"), width:3, arrows:true }], xLabel:"x", yLabel:"y", xTicks:{ step:1 }, after:function(ctx, p){
        if (eq) { ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, p.Y(rr[0])); ctx.lineTo(p.W, p.Y(rr[0])); ctx.stroke(); ctx.restore(); }
        R.z.forEach(function(z, i){ valueBar(ctx, p, z, rr[i], { label:"R" + (i ? "₂" : "₁") + " = " + kval(rr[i]), side:i ? "right" : "left" }); zeroBox(ctx, p, z); });
      }, describe:"Graph of " + MV.plain(m("y = " + rsrc(k))) + " with remainder bars at x = " + R.z.join(" and x = ") + ": R₁ = " + kval(rr[0]) + ", R₂ = " + kval(rr[1]) + (eq ? ". They are equal, so the line y = " + kval(rr[0]) + " joins them." : ".") });
      return;
    }
    var f = function(x){ return evalP(PA, x); }, V = { xmin:-2.5, xmax:3.5, ymin:-6, ymax:8 };
    if (st === "B") {
      var pic = gx.pic, curves = [{ f:f, color:css("--pen"), width:3, arrows:true }];
      if (pic >= 1) curves.unshift({ f:function(x){ return f(x) + 1; }, color:css("--f3"), width:2.6, arrows:true });
      plot.draw({ view:V, curves:curves, xLabel:"x", yLabel:"y", xTicks:{ step:1 }, after:function(ctx, p){
        if (pic >= 2) zeroBox(ctx, p, 2);
        if (pic >= 3) { ctx.save(); ctx.beginPath(); ctx.arc(p.X(2), p.Y(0), 9, 0, Math.PI * 2); ctx.fillStyle = css("--hi"); ctx.globalAlpha = 0.7; ctx.fill(); ctx.restore(); ctx.save(); ctx.font = "600 14px " + p.fontM; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; bgText(ctx, "(2 − 2)Q(2) = 0", p.X(2) + 12, p.Y(0) - 14); ctx.restore(); zeroBox(ctx, p, 2); }
        if (pic >= 4) { valueBar(ctx, p, 2, -1, { label:"P(2) = R = −1" }); zeroBox(ctx, p, 2); }
      }, describe:"Graph of y = P(x) = x³ − 2x² − 3x + 5" + (pic >= 1 ? ", with the teal curve y = P(x) − R = (x − 2)Q(x), the blue curve shifted up by 1" : "") + (pic >= 3 ? ". The teal curve passes through (2, 0)" : "") + (pic >= 4 ? ". The blue curve is at height −1 at x = 2: P(2) = R = −1." : ".") });
      return;
    }
    var c = card(), z = fval(cz(c)), mx = gx.mx == null ? (cst(c.id).solved ? z : null) : gx.mx, show = cst(c.id).solved, bt = gx.barT == null ? 1 : gx.barT;
    plot.draw({ view:V, curves:[{ f:f, color:css("--pen"), width:3, arrows:true }], xLabel:"x", yLabel:"y", xTicks:{ step:1 }, after:function(ctx, p){
      if (mx != null) zeroBox(ctx, p, mx);
      if (show && gx.mx == null) valueBar(ctx, p, z, f(z), { t:bt, label:"R = " + fv(f(z)) });
    }, describe:"Graph of y = P(x) = x³ − 2x² − 3x + 5." + (show ? " The remainder bar at x = " + ft(cz(c)) + " reaches height " + fv(f(z)) + "." : "") });
  };
  function rsrc(k){ var c = round().c; return psrc([F(1), toF(k) || F(0), F(c[2]), F(1)]); }
  function kval(v){ if (S.rd === 1 && S.kx) { var f = toF(v); return f ? ft(f) : num(v, 2); } return num(v, 2); }

  function paintStages(){
    MV.keepFocus($("#sc-stages", host), function(){
      $("#sc-stages", host).innerHTML = [["A", "A. Remainder radar"], ["B", "B. Why it always works"], ["C", "C. Make two remainders match"]].map(function(s){ return '<button type="button" class="fchip sc-st" data-stage="' + s[0] + '" data-k="st' + s[0] + '" aria-pressed="' + (S.stage === s[0]) + '">' + s[1] + "</button>"; }).join("");
    });
  }
  // ----- stage A -----
  function paintA(anim){
    var c = card(), x = cst(c.id), el = $("#sc-panel", host), z = cz(c);
    var dots = RD.cards.map(function(q, i){ var y = S.cards[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.ci ? " cur" : "") + '"></span>'; }).join("");
    var h = '<div class="pred-top"><span class="tiny muted">Card ' + (S.ci + 1) + " of " + RD.cards.length + '</span><span class="dots" aria-hidden="true">' + dots + "</span></div>";
    h += '<p class="pred-q">' + RD.prompt.replace("{d}", m(dsrc(c.a, c.b))) + "</p>";
    h += '<div class="numrow"><label for="sc-in">Remainder:</label><input class="numin short" id="sc-in" type="text" inputmode="text" autocomplete="off" spellcheck="false" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + "></div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="reveal" data-k="reveal">Reveal</button>' + MV.hintBtn("rh" + c.id, x.hint) + "</div>" + MV.hintsHTML(c.hints, x.hint);
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: the remainder is ' + fm(toF(MV.ans(c))) + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[c.id]) h += '<div class="fb bad" role="status"><p>' + msgs[c.id] + "</p></div>";
    if (x.solved) {
      h += '<div class="sc-sub" aria-live="polite">' + c.lines.map(function(l, i){ return '<p class="sc-line' + (anim ? " hide" : "") + '" data-li="' + i + '">' + l + "</p>"; }).join("") + "</div>";
      var D = divide(PA, c.a, c.b, false);
      h += '<div class="sc-mini' + (anim ? " hide" : "") + '"><p class="tiny muted">Synthetic division with ' + fm(z) + " confirms the remainder:</p>" + gridHTML(D, { pos:2 * D.n + 1, small:true, tags:{ b3:"remainder" }, caption:"Synthetic division of P(x) with " + ft(z) }) + "</div>";
    }
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="cprev" data-k="cprev"' + (S.ci === 0 ? " disabled" : "") + '>Previous card</button><button type="button" class="btn ' + (x.solved ? "primary" : "ghost") + ' sm" data-act="cnext" data-k="cnext"' + (S.ci === RD.cards.length - 1 ? " disabled" : "") + ">Next card</button></div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function revealA(){
    var c = card(), x = cst(c.id), r = MV.parseNum(x.val);
    if (!r || r.length !== 1) { msgs[c.id] = "Enter a number, such as −2 or 13/8."; paintA(); return; }
    var v = r[0], ans = MV.ans(c);
    if (near(v, ans)) {
      x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[c.id] = null; api.save();
      var z = fval(cz(c)), from = S.lastMx == null ? 0 : S.lastMx; S.lastMx = z;
      paintA(true); MV.focusFb($("#sc-panel", host));
      gx.mx = from; gx.barT = 0;
      MV.tween({ dur:700, step:function(t){ gx.mx = from + (z - from) * t; plot.render(); }, done:function(){
        gx.mx = null; gx.barT = 0;
        MV.tween({ dur:500, step:function(t){ gx.barT = t; plot.render(); }, done:function(){ gx.barT = null; plot.render(); } });
        $$(".sc-line", host).forEach(function(el, i){ later(200 + i * 450, function(){ el.classList.remove("hide"); }); });
        later(200 + c.lines.length * 450, function(){ var mn = $(".sc-mini", host); if (mn) mn.classList.remove("hide"); });
      } });
      return;
    }
    x.tries++;
    var w = (c.wrong || []).filter(function(q){ return near(q.v, v); })[0];
    msgs[c.id] = "<strong>✗ Not quite.</strong> " + (w ? w.fb : "Solve " + m(dsrc(c.a, c.b) + " = 0") + " for the input, then substitute it into " + m("P(x)") + ".") + " Try again.";
    api.save(); paintA(); MV.focusFb($("#sc-panel", host));
  }
  // ----- stage B -----
  function ordFb(o){
    var at = function(s){ return o.indexOf(s); };
    if (o[0] === 1) return PF.fb.s2first;
    if (at(2) < at(1)) return PF.fb.s3before2;
    if (at(3) < at(2)) return PF.fb.s4before3;
    if (at(4) < at(3)) return PF.fb.s5before4;
    var p = 0; while (p < o.length && o[p] === p) p++;
    return "Step " + (p + 1) + " is out of place. Ask what has to happen before it can be done.";
  }
  function paintB(){
    var el = $("#sc-panel", host), O = S.os;
    var h = "<p>" + PF.instruction + '</p><ol class="olist">' + S.ord.map(function(si, p){
      var isSel = sel === p && !O.solved, bad = oMsg && oMsg.pos === p;
      return '<li><button type="button" class="ostep' + (O.solved ? " good" : bad ? " bad" : "") + (gx.hl === si ? " sc-now" : "") + '" aria-pressed="' + isSel + '" data-pos="' + p + '" data-k="op' + si + '"' + (O.solved ? " disabled" : "") + '><span class="sn">' + (p + 1) + ".</span><span>" + PF.steps[si] + "</span></button>" +
        (isSel ? '<span class="omoves"><button type="button" class="btn ghost" data-mv="up" data-k="omup"' + (p === 0 ? " disabled" : "") + '>Move up</button><button type="button" class="btn ghost" data-mv="down" data-k="omdown"' + (p === S.ord.length - 1 ? " disabled" : "") + ">Move down</button></span>" : "") + "</li>";
    }).join("") + "</ol>";
    if (!O.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="ocheck" data-k="ocheck">Check the order</button>' + MV.hintBtn("oh", O.hint) + "</div>" + MV.hintsHTML(PF.hints, O.hint);
    if (O.solved) h += '<div class="fb good" role="status"><p><strong>✓ That order works.</strong>' + (O.first ? "" : ' <span class="muted">(not first try)</span>') + '</p></div><div class="sc-pics" aria-live="polite"><p class="tiny"><strong>Proof in pictures</strong> (with ' + m("P(x) = x^3 - 2x^2 - 3x + 5") + ", " + m("b = 2") + ", " + m("R = -1") + ")</p>" + PF.pics.map(function(t, i){ return '<p class="sc-line' + (gx.pic >= i + 1 ? "" : " hide") + '">' + (i + 2) + ". " + t + "</p>"; }).join("") + '<button type="button" class="btn ghost sm" data-act="pics" data-k="pics">Play the proof again</button></div>';
    else if (oMsg) h += '<div class="fb bad" role="status"><p><strong>✗ Not yet.</strong> ' + oMsg.html + "</p></div>";
    h += '<div class="part sc-ax"><p class="pred-q">Then, for ' + m("ax - b") + ": " + PF.ax.prompt + '</p><div class="chips" role="group" aria-label="Choices">' + PF.ax.chips.map(function(c, i){ return '<button type="button" class="chip' + (S.ax === i ? " on" : "") + '" aria-pressed="' + (S.ax === i) + '" data-ax="' + i + '" data-k="ax' + i + '">' + c.t + "</button>"; }).join("") + "</div>";
    if (S.ax != null) { var ch = PF.ax.chips[S.ax], good = MV.ok(ch); h += '<div class="fb ' + (good ? "good" : "bad") + '" role="status"><p>' + (good ? "" : "<strong>✗ Not quite.</strong> ") + ch.fb + "</p></div>"; }
    h += "</div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function playPics(){
    stop(); gx.pic = 0; gx.hl = null;
    if (MV.reduceMotion) { gx.pic = 4; plot.render(); paintB(); return; }
    plot.render(); paintB();
    [1, 2, 3, 4].forEach(function(k){ later(k * 1100, function(){ gx.pic = k; gx.hl = k; plot.render(); paintB(); if (k === 4) later(1200, function(){ gx.hl = null; paintB(); }); }); });
  }
  // ----- stage C -----
  function paintC(){
    var el = $("#sc-panel", host), R = round(), k = kNow(), rr = rem(k), eq = Math.abs(rr[0] - rr[1]) < 1e-9, X = S.ex;
    var h = '<div class="chips" role="group" aria-label="Round">' + MT.rounds.map(function(r, i){ return '<button type="button" class="chip' + (S.rd === i ? " on" : "") + '" data-rd="' + i + '" data-k="rd' + i + '" aria-pressed="' + (S.rd === i) + '">Round ' + (i + 1) + "</button>"; }).join("") + "</div>";
    h += '<p class="eq-cap sc-eq">' + m("P(x) = x^3 + kx^2 " + (R.c[2] < 0 ? "- " + -R.c[2] : "+ " + R.c[2]) + "x + 1") + "</p><p>" + MT.instruction + "</p>";
    h += '<div id="sc-ksl"></div>' + (S.rd === 1 && X.solved ? '<div class="kpin-wrap"><span class="kpin" style="left:' + ((-2 / 3 + 3) / 6 * 100) + '%">exact ' + m("k = -2/3") + "</span></div>" : "");
    h += '<div class="gauges"><canvas class="plot gauge" id="sc-gauge" role="img" aria-label="Remainder gauges"></canvas><div class="g-labs"><span>' + m("R_1") + " (for " + R.div[0] + ")<br><b>" + kval(rr[0]) + '</b></span><span>' + m("R_2") + " (for " + R.div[1] + ")<br><b>" + kval(rr[1]) + "</b></span></div></div>";
    if (S.rd === 0 && S.noted) h += '<p class="tiny">' + R.note + "</p>";
    h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="lock" data-k="lock">Lock in</button>' + (S.rd === 1 && !X.open ? '<button type="button" class="btn ghost sm" data-act="cant" data-k="cant">The slider can’t do it</button>' : "") + (S.rd === 1 ? MV.hintBtn("mh", X.hint) : "") + "</div>";
    if (S.rd === 1) h += MV.hintsHTML(R.hints, X.hint);
    if (lockMsg) h += '<div class="fb ' + (lockMsg.good ? "good" : "bad") + '" role="status"><p>' + lockMsg.html + "</p></div>";
    else if (S.rd === 0 && S.m1) h += '<div class="fb good" role="status"><p>' + R.right + "</p></div>";
    if (S.rd === 1 && X.open) {
      var box = function(id, lab){ var bad = X.bad && X.bad[id]; return '<input class="numin sc-box' + (bad ? " bad" : "") + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" data-ex="' + id + '" data-k="ex' + id + '" aria-label="' + lab + '" value="' + MV.esc(X.vals[id] || "") + '"' + (X.solved ? " disabled" : "") + ">"; };
      h += '<div class="part sc-exact"><h4>Find ' + m("k") + ' exactly</h4><p class="sc-fill">' + m("R_1 = P(1) = ") + box("c1", "coefficient of k in R1") + m("k + ") + box("k1", "constant part of R1") + "</p>" +
        '<p class="sc-fill">' + m("R_2 = P(2) = ") + box("c2", "coefficient of k in R2") + m("k + ") + box("k2", "constant part of R2") + "</p>" +
        '<p class="sc-fill">' + m("R_1 = R_2") + " gives " + m("k = ") + box("kn", "numerator of k") + "<span class=\"m\">/</span>" + box("kd", "denominator of k") + "</p>";
      if (!X.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="excheck" data-k="excheck">Check</button></div>';
      if (X.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + R.exact.solved + "</p></div>";
      else if (exMsg) h += '<div class="fb bad" role="status"><p>' + exMsg + "</p></div>";
      h += "</div>";
    }
    MV.keepFocus(el, function(){ el.innerHTML = h; });
    var hh = document.createElement("div"); $("#sc-ksl", host).replaceChildren(hh);
    ksl = MV.sliders(hh, [{ id:"k", label:m("k"), min:-3, max:3, step:0.25, value:S.k[S.rd], fmt:function(v){ return S.rd === 1 && S.kx ? ft(F(-2, 3)) : num(v, 2); } }], function(id, v){ S.k[S.rd] = v; S.kx = false; lockMsg = null; api.save(); plot.render(); paintGauge(); labC(); });
    inkSl(hh);
    gauge =new MV.Plot($("#sc-gauge", host), { xmin:0, xmax:2, ymin:-14, ymax:14 }); gauge.render = drawGauge; drawGauge();
  }
  var gauge = null;
  function labC(){ var R = round(), rr = rem(kNow()), b = $$(".g-labs b", host); if (b.length === 2) { b[0].textContent = kval(rr[0]); b[1].textContent = kval(rr[1]); } }
  function paintGauge(){ if (gauge) drawGauge(); }
  function drawGauge(){
    if (!gauge || !gauge.c.isConnected) return;
    var rr = rem(kNow()), eq = Math.abs(rr[0] - rr[1]) < 1e-9;
    gauge.draw({ view:{ xmin:0, xmax:2, ymin:-14, ymax:14 }, grid:false, axes:false, after:function(ctx, p){
      var y0 = p.Y(0); ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(4, y0); ctx.lineTo(p.W - 4, y0); ctx.stroke();
      [0.5, 1.5].forEach(function(x, i){ var X = p.X(x), Y = p.Y(Math.max(-14, Math.min(14, rr[i]))), w = Math.min(46, p.W * 0.22); ctx.fillStyle = css("--hi"); ctx.strokeStyle = css("--ink"); ctx.fillRect(X - w / 2, Math.min(y0, Y), w, Math.abs(Y - y0)); ctx.strokeRect(X - w / 2, Math.min(y0, Y), w, Math.abs(Y - y0)); });
      if (eq) { ctx.setLineDash([4, 4]); ctx.strokeStyle = css("--ink"); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(p.X(0.5), p.Y(rr[0])); ctx.lineTo(p.X(1.5), p.Y(rr[1])); ctx.stroke(); }
      ctx.restore();
    }, describe:"Remainder gauges: R₁ = " + kval(rr[0]) + ", R₂ = " + kval(rr[1]) + (eq ? ". They match." : ".") });
  }
  function lockIn(){
    var R = round(), rr = rem(kNow()), eq = Math.abs(rr[0] - rr[1]) < 1e-9;
    if (S.rd === 0) { S.noted = true; if (eq) { S.m1 = true; lockMsg = { good:true, html:R.right }; } else lockMsg = { good:false, html:"<strong>✗</strong> " + MT.wrongLock.replace("{r1}", kval(rr[0])).replace("{r2}", kval(rr[1])) }; }
    else {
      if (eq && S.kx) lockMsg = { good:true, html:"<strong>✓</strong> " + R.exact.solved };
      else { S.locks[1]++; lockMsg = { good:false, html:"<strong>✗</strong> " + MT.wrongLock.replace("{r1}", kval(rr[0])).replace("{r2}", kval(rr[1])) }; if (S.locks[1] >= 2) S.ex.open = true; }
    }
    api.save(); paintC(); plot.render(); MV.focusFb($("#sc-panel", host));
  }
  function exCheck(){
    var X = S.ex, A = MV.ans(round().exact), v = {}, empty = false;
    ["c1", "k1", "c2", "k2", "kn", "kd"].forEach(function(id){ var r = MV.parseNum(X.vals[id]); if (!r || r.length !== 1) empty = true; else v[id] = r[0]; });
    if (empty) { exMsg = "Enter a number in every box."; paintC(); return; }
    var kv = v.kd ? v.kn / v.kd : NaN, bad = {};
    ["c1", "k1", "c2", "k2"].forEach(function(id){ if (!near(v[id], A[id])) bad[id] = 1; });
    if (!near(kv, A.kv)) { bad.kn = 1; bad.kd = 1; }
    X.bad = bad;
    if (!Object.keys(bad).length) { X.solved = true; S.kx = true; exMsg = null; lockMsg = null; api.save(); paintC(); plot.render(); MV.focusFb($("#sc-panel", host)); return; }
    X.tries++;
    var W = round().exact.wrong, fbs = W.filter(function(w){ return w.box === "kv" ? near(kv, w.v) : near(v[w.box], w.v); }).map(function(w){ return w.fb; });
    exMsg = "<strong>✗ Not quite.</strong> " + (fbs.length ? fbs.join(" ") + " " : "") + "Check the boxes outlined in red.";
    api.save(); paintC(); MV.focusFb($("#sc-panel", host));
  }
  function paintAll(){
    paintStages(); stop(); gx = { mx:null, barT:null, pic:S.stage === "B" && S.os.solved ? 4 : 0 };
    $("#sc-cap", host).innerHTML = S.stage === "C" ? "The blue curve is " + m("y = P(x)") + "; the bars are the two remainders." : "The blue curve is " + m("y = P(x) = x^3 - 2x^2 - 3x + 5") + ".";
    if (S.stage === "A") paintA(); else if (S.stage === "B") paintB(); else paintC();
    plot.render();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var d = b.dataset;
    if (d.stage) { S.stage = d.stage; lockMsg = null; api.save(); paintAll(); return; }
    if (S.stage === "A") {
      var c = card(), x = cst(c.id);
      if (d.act === "reveal") { revealA(); return; }
      if (d.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintA(); return; }
      if (d.act === "cprev" || d.act === "cnext") { S.ci += d.act === "cprev" ? -1 : 1; api.save(); paintAll(); return; }
    }
    if (S.stage === "B") {
      var O = S.os;
      if (d.pos != null) { var p = +d.pos; sel = sel === p ? null : p; paintB(); return; }
      if (d.mv) { var i = sel, j = d.mv === "up" ? i - 1 : i + 1; if (i == null || j < 0 || j >= S.ord.length) return; var t = S.ord[i]; S.ord[i] = S.ord[j]; S.ord[j] = t; sel = j; oMsg = null; api.save(); paintB(); var nb = $('[data-mv="' + d.mv + '"]', host); if (nb && !nb.disabled) nb.focus(); else { var sb = $('[data-pos="' + j + '"]', host); if (sb) sb.focus(); } return; }
      if (d.act === "hint") { O.hint = Math.min(3, O.hint + 1); api.save(); paintB(); return; }
      if (d.act === "ocheck") {
        if (S.ord.every(function(v, k){ return v === k; })) { O.solved = true; O.first = O.tries === 0 && O.hint < 3; oMsg = null; sel = null; api.save(); playPics(); MV.focusFb($("#sc-panel", host)); return; }
        O.tries++; var q = 0; while (q < S.ord.length && S.ord[q] === q) q++;
        oMsg = { pos:q, html:ordFb(S.ord) }; api.save(); paintB(); MV.focusFb($("#sc-panel", host)); return;
      }
      if (d.act === "pics") { playPics(); return; }
      if (d.ax != null) { S.ax = +d.ax; api.save(); paintB(); MV.focusFb($(".sc-ax", host)); return; }
    }
    if (S.stage === "C") {
      if (d.rd != null) { S.rd = +d.rd; lockMsg = null; exMsg = null; api.save(); paintC(); plot.render(); return; }
      if (d.act === "lock") { lockIn(); return; }
      if (d.act === "cant") { S.ex.open = true; api.save(); paintC(); var f = $('[data-ex="c1"]', host); if (f) f.focus(); return; }
      if (d.act === "hint") { S.ex.hint = Math.min(3, S.ex.hint + 1); api.save(); paintC(); return; }
      if (d.act === "excheck") { exCheck(); return; }
    }
  });
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.id === "sc-in") { cst(card().id).val = t.value; api.save(); }
    if (t.dataset && t.dataset.ex) { S.ex.vals[t.dataset.ex] = t.value; api.save(); }
  });
  host.addEventListener("keydown", function(e){
    if (e.key !== "Enter") return;
    if (e.target.id === "sc-in") { e.preventDefault(); revealA(); }
    else if (e.target.dataset && e.target.dataset.ex) { e.preventDefault(); exCheck(); }
  });
  paintAll();
  // radar counts in the results summary and in "skills to review"
  MV.ACTS.radar = { a:{ id:"radar" }, stats:function(){ var f = 0, d = 0; RD.cards.forEach(function(c){ var y = S.cards[c.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:RD.cards.length, done:d, line:"Remainder radar (first try): " + f + "/" + RD.cards.length + (d < RD.cards.length ? " (unfinished)" : "") }; },
    missed:function(){ return RD.cards.some(function(c){ var y = S.cards[c.id]; return y && (y.tries > 0 || y.hint >= 3); }) ? [3] : []; } };
  return {};
}

// ---------- Practice: number-box items (Divide it, Work backwards) ----------
// @component N4 boxSet — one-at-a-time items whose frame holds several number boxes (fractions allowed); whole-row
// known-wrong matching, wrong boxes outlined, three-level hints, first-try scoring. opt: {noun, frame(it, box), right(it), general}
function boxSet(host, api, a, opt){
  var S = api.S; S.i = S.i || 0; S.items = S.items || {};
  var msgs = {}, bads = {};
  function ist(it){ return S.items[it.id] || (S.items[it.id] = { vals:{}, tries:0, hint:0, solved:false, first:null }); }
  function inp(it, id, label){ var x = ist(it), bad = bads[it.id] && bads[it.id][id]; return '<input class="bx-in' + (bad ? " bad" : "") + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" data-bx="' + id + '" data-k="bx' + it.id + id + '" aria-label="' + MV.esc(label) + '" value="' + MV.esc(x.vals[id] || "") + '"' + (x.solved ? " disabled" : "") + ">"; }
  function paint(){
    var it = a.items[S.i], x = ist(it);
    var h = (a.how ? '<p class="how">' + a.how + "</p>" : "") + '<div class="pred-top"><span class="tiny muted">' + opt.noun + " " + (S.i + 1) + " of " + a.items.length + (it.star ? " ★ (above Final Check level)" : "") + '</span><span class="dots" aria-hidden="true">' +
      a.items.map(function(q, i){ var y = S.items[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("") + "</span></div>";
    h += '<div class="bx-item" data-it="' + it.id + '">' + opt.frame(it, function(id, label){ return inp(it, id, label); }) + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="bxchk">Check</button>' + MV.hintBtn("bxh" + it.id, x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += '<div class="fb good" role="status"><p>' + opt.right(it) + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="prev" data-k="bxprev"' + (S.i === 0 ? " disabled" : "") + '>Previous</button><button type="button" class="btn ' + (x.solved ? "primary" : "ghost") + ' sm" data-act="next" data-k="bxnext"' + (S.i === a.items.length - 1 ? " disabled" : "") + ">Next</button></div>";
    MV.keepFocus(host, function(){ host.innerHTML = h; });
  }
  function check(){
    var it = a.items[S.i], x = ist(it), A = MV.ans(it), v = {}, empty = false;
    Object.keys(A).forEach(function(id){ var r = MV.parseNum(x.vals[id]); if (!r || r.length !== 1) empty = true; else v[id] = r[0]; });
    if (empty) { msgs[it.id] = "Fill in every box first. Fractions like −3/2 are fine."; paint(); MV.focusFb(host); return; }
    var bad = {}; Object.keys(A).forEach(function(id){ if (!near(v[id], A[id])) bad[id] = 1; });
    if (!Object.keys(bad).length) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; bads[it.id] = null; api.save(); paint(); MV.focusFb(host); return; }
    x.tries++; bads[it.id] = bad;
    var w = (it.wrong || []).filter(function(q){ return Object.keys(q.match).every(function(id){ return v[id] != null && near(v[id], q.match[id]); }); })[0];
    msgs[it.id] = "<strong>✗ Not quite.</strong> " + (w ? w.fb : opt.general);
    api.save(); paint(); MV.focusFb(host);
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; ist(a.items[S.i]).vals[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){
    var t = e.target; if (e.key !== "Enter" || !t.dataset || !t.dataset.bx) return;
    e.preventDefault(); var all = $$(".bx-in", host), nx = all.slice(all.indexOf(t) + 1).filter(function(n){ return !n.value.trim(); })[0];
    if (nx) { nx.focus(); return; }
    check();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = a.items[S.i], x = ist(it);
    if (b.dataset.act === "check") { check(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "prev" || b.dataset.act === "next") { S.i += b.dataset.act === "prev" ? -1 : 1; api.save(); paint(); return; }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}
function divideIt(host, api, a){
  function frame(it, box){
    var D = divide(it.top, it.a, it.b, it.a !== 1), n = D.n, h = '<p class="task">' + it.task + "</p>";
    if (it.kind === "long") {
      var row = function(cells, lead, cls){ var r = '<tr class="' + (cls || "") + '"><td class="ld-l">' + (lead || "") + "</td>"; for (var p = n; p >= 0; p--) r += "<td" + (cells[p] && cells[p].cls ? ' class="' + cells[p].cls + '"' : "") + ">" + (cells[p] ? cells[p].h : "") + "</td>"; return r + "</tr>"; };
      var qc = {}; for (var k = 0; k < n; k++) qc[n - 1 - k] = { h:(k ? '<span class="m"> + </span>' : "") + box("q" + k, "quotient coefficient of " + POWN[n - 1 - k]) + (n - 1 - k ? m(pw(n - 1 - k)) : "") };
      var dv = {}; D.T.forEach(function(c, i){ dv[n - i] = { h:m(tsrc(c, n - i, i === 0)) }; });
      var rows = row(qc, "", "ld-q") + row(dv, m(dsrc(it.a, it.b)) + '<span class="ld-par" aria-hidden="true">)</span>', "ld-dvd");
      for (k = 0; k < n; k++) {
        var lc = {}, last = k === n - 1;
        lc[n - k - 1] = { h:box(last ? "r" : "l" + k, last ? "remainder" : "leading coefficient of the line left after subtraction " + (k + 1)) + (last ? "" : m(pw(n - k - 1))), cls:"ld-rule" + (last ? " ld-rem" : "") };
        if (!last) lc[n - k - 2] = { h:m(tsrc(D.T[k + 2], n - k - 2, false)), cls:"ld-rule" };
        rows += row(lc, "", "ld-left");
      }
      return h + '<div class="tbl-scroll"><table class="ld dv-ld">' + rows + '</table></div><p class="tiny muted">The boxes on the lower lines are the leading coefficients of the lines left after each subtraction; the last box is the remainder.</p>';
    }
    var o = { pos:0, edit:{ z:'<span class="sg-box">' + box("z", "the zero of the divisor") + "</span>" } };
    for (var i = 0; i <= n; i++) {
      o.edit["b" + i] = box("b" + i, "bottom row, " + POWN[n - i] + " column");
      if (it.setup) o.edit["t" + i] = box("t" + i, "top row, " + POWN[n - i] + " coefficient");
    }
    var g = gridHTML(D, o);
    h += '<div class="tbl-scroll">' + g + "</div>";
    if (it.setup) h += '<p class="tiny muted">Set-up: fill in the top row too. Each box is labelled with its power.</p>';
    if (D.adj) {
      h += '<p class="dv-adj">For ' + m(dsrc(it.a, it.b)) + ": quotient ";
      for (var k2 = 0; k2 < n; k2++) h += (k2 ? m(" + ") : "") + box("q" + k2, "adjusted quotient coefficient of " + POWN[n - 1 - k2]) + (n - 1 - k2 ? m(pw(n - 1 - k2)) : "");
      h += ", remainder " + box("r", "remainder") + "</p>";
    }
    return h;
  }
  return boxSet(host, api, a, { noun:"Division", frame:frame, general:"Some boxes aren’t right yet: they’re outlined in red. Fix them and check again.",
    right:function(it){ var D = divide(it.top, it.a, it.b); return a.right.replace("{check}", m(subst(D.T, D.z, false).src)); } });
}
function backwards(host, api, a){
  function frame(it, box){
    var h = '<p class="task">' + it.prompt + "</p>", f = it.frame;
    if (/^(\{\w+\}\s*)+$/.test(f)) return h + '<div class="bx-row">' + it.boxes.map(function(b){ return '<label class="bx-lab">' + b.label + ' <span class="m">=</span> ' + box(b.id, MV.plain(b.label)) + "</label>"; }).join("") + "</div>";
    var labs = {}; it.boxes.forEach(function(b){ labs[b.id] = b.label; });
    return h + '<p class="bx-frame">' + f.replace(/\{(\w+)\}/g, function(_, id){ return box(id, MV.plain(labs[id])); }) + "</p>";
  }
  return boxSet(host, api, a, { noun:"Problem", frame:frame, general:"Substitute your answer back in to check it, then try again.",
    right:function(it){ return "<strong>✓ Correct.</strong> " + it.check + (it.example ? "</p><p>" + it.example : ""); } });
}

// ---------- Performance task: design by remainders ----------
var task = (function(){
  var api, plot, KEYS = ["p", "q", "r"];
  function read(){
    var s = api ? api.S : {}, v = KEYS.map(function(k){ var r = MV.parseNum(s[k]); return r && r.length === 1 ? r[0] : NaN; });
    return { p:v[0], q:v[1], r:v[2], ok:v.every(function(x){ return isFinite(x); }) };
  }
  function P(d, x){ return x * x * x + d.p * x * x + d.q * x + d.r; }
  function src(d){ return "P(x) = " + psrc(ints([1, d.p, d.q, d.r])); }
  function draw(){
    var d = read();
    if (!d.ok) { plot.draw({ view:{ xmin:-2.5, xmax:2.5, ymin:-10, ymax:10 }, describe:"Empty graph. Enter p, q and r." }); return; }
    var ys = [0, 3]; for (var i = 0; i <= 50; i++) ys.push(P(d, -2.2 + 4.4 * i / 50));
    [-1, 0, 1, 2].forEach(function(x){ ys.push(P(d, x)); });
    var lo = Math.max(-150, Math.min.apply(null, ys)), hi = Math.min(150, Math.max.apply(null, ys)), pad = Math.max(2, (hi - lo) * 0.12);
    var v = { xmin:-2.5, xmax:2.5, ymin:lo - pad, ymax:hi + pad }, eq = near(P(d, 1), P(d, -1));
    plot.draw({ view:v, curves:[{ f:function(x){ return P(d, x); }, color:css("--pen"), width:3, arrows:true }], xLabel:"x", yLabel:"y", xTicks:{ step:1 }, after:function(ctx, p){
      if (eq) { ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = css("--ink"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(p.X(-1), p.Y(P(d, -1))); ctx.lineTo(p.X(1), p.Y(P(d, 1))); ctx.stroke(); ctx.restore(); }
      [-1, 0, 1, 2].forEach(function(x){ var R = P(d, x); valueBar(ctx, p, x, R, { label:num(R) }); zeroBox(ctx, p, x, 10); });
      ctx.save(); ctx.strokeStyle = css("--ink"); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(p.X(2) - 11, p.Y(3)); ctx.lineTo(p.X(2) + 11, p.Y(3)); ctx.stroke();
      ctx.font = "12px " + p.fontUI; ctx.fillStyle = css("--ink-2"); ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText("target 3", p.X(2) - 14, p.Y(3)); ctx.restore();
    }, describe:"Graph of " + MV.plain(m(src(d))) + ". Remainder bars: P(−1) = " + num(P(d, -1)) + ", P(0) = " + num(P(d, 0)) + ", P(1) = " + num(P(d, 1)) + ", P(2) = " + num(P(d, 2)) + ". Target: 3 at x = 2." });
  }
  function paintEq(){
    var d = read();
    $("#tk-eq").innerHTML = d.ok ? m(src(d)) : '<span class="muted">Enter ' + m("p") + ", " + m("q") + " and " + m("r") + ".</span>";
    $("#tk-tbl").innerHTML = MV.tableHTML({ head:["Divisor", "Its zero", "Remainder"], caption:"Remainders for each divisor", rows:[[m("x + 1"), "−1", -1], [m("x"), "0", 0], [m("x - 1"), "1", 1], [m("x - 2"), "2", 2]].map(function(r){ return [r[0], r[1], d.ok ? m("P(" + r[2] + ") = " + num(P(d, r[2])).replace(MINUS, "-")) : "—"]; }) });
  }
  return {
    render:function(inp, pv, a){
      api = a; var S = a.S;
      KEYS.forEach(function(k){ if (S[k] == null) S[k] = "0"; });
      inp.innerHTML = '<p class="eq-cap tk-eq" id="tk-eq" aria-live="polite"></p><div class="inrow tk-row">' + KEYS.map(function(k){
        return '<label for="tk-' + k + '"><span>' + m(k) + '</span><span class="tk-box"><button type="button" class="btn ghost sm" data-dk="' + k + '" data-d="-1" aria-label="Decrease ' + k + '">−</button><input id="tk-' + k + '" data-tk="' + k + '" type="number" step="1" min="-9" max="9" value="' + MV.esc(S[k]) + '"><button type="button" class="btn ghost sm" data-dk="' + k + '" data-d="1" aria-label="Increase ' + k + '">+</button></span></label>';
      }).join("") + "</div>";
      pv.innerHTML = '<canvas class="plot" id="tk-plot" role="img" aria-label="Graph of your polynomial"></canvas><div id="tk-tbl" style="margin-top:12px"></div>';
      plot = new MV.Plot($("#tk-plot"), { xmin:-2.5, xmax:2.5, ymin:-10, ymax:10 }); plot.render = draw;
      function upd(){ a.save(); paintEq(); draw(); a.update(); }
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tk; if (!k) return; S[k] = e.target.value; upd(); });
      inp.addEventListener("click", function(e){ var b = e.target.closest("[data-dk]"); if (!b) return; var k = b.dataset.dk, r = MV.parseNum(S[k]), v = r && r.length === 1 ? Math.round(r[0]) : 0; v = Math.max(-9, Math.min(9, v + +b.dataset.d)); S[k] = String(v); $("#tk-" + k).value = v; upd(); });
      paintEq(); draw();
    },
    read:read,
    valid:function(d){ return d.ok ? true : MV.C.task.tips[0]; },
    checks:function(d){
      if (!d.ok) return [false, false, false, false];
      var whole = KEYS.every(function(k){ return Number.isInteger(d[k]) && d[k] >= -9 && d[k] <= 9; });
      return [whole, near(P(d, 1), P(d, -1)), near(P(d, 2), 3), P(d, 0) > 0];
    },
    tips:function(d, c){
      var T = MV.C.task.tips, out = [];
      c.forEach(function(ok, i){ if (!ok) out.push(T[i].replace("{v1}", num(P(d, 1))).replace("{v2}", num(P(d, -1))).replace("{v3}", num(P(d, 2)))); });
      return out;
    },
    key:function(d){ return [d.p, d.q, d.r].join(","); },
    label:function(k){ var p = k.split(",").map(Number); return "(" + p.map(function(v){ return num(v); }).join(", ") + ")"; },
    text:function(k){ var p = k.split(",").map(Number); return "p = " + num(p[0]) + ", q = " + num(p[1]) + ", r = " + num(p[2]); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ divide:divideIt, backwards:backwards },
  task:task
});
})();
