// MHF4U 06 Even and Odd Functions: hero (flipping term tiles), term sign-flipper (Explore), mirror lab (Part 3),
// "Use the symmetry" practice set and the "Build an odd function to spec" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
var POWS = [5, 4, 3, 2, 1, 0];

// ---------- polynomials: c[p] is the coefficient of x^p, p = 0…5 ----------
function clean(c){ var o = []; for (var p = 0; p <= 5; p++) o.push(c && +c[p] ? Math.round(+c[p]) : 0); return o; }
function evalP(c, x){ var s = 0; for (var p = c.length - 1; p >= 0; p--) s = s * x + c[p]; return s; }
function fNegX(c){ return c.map(function(v, p){ return p % 2 ? -v : v; }); }
function fNeg(c){ return c.map(function(v){ return -v; }); }
function isZero(c){ return c.every(function(v){ return !v; }); }
function kindOf(c){
  var ev = c.every(function(v, p){ return p % 2 === 0 || !v; }), od = c.every(function(v, p){ return p % 2 === 1 || !v; });
  return ev && od ? "zero" : ev ? "even" : od ? "odd" : "neither";
}
function present(c, parity){ return POWS.filter(function(p){ return c[p] && p % 2 === parity; }); }
function evenPart(c){ return c.map(function(v, p){ return p % 2 ? 0 : v; }); }
function oddPart(c){ return c.map(function(v, p){ return p % 2 ? v : 0; }); }
function powSrc(p){ return p === 0 ? "" : p === 1 ? "x" : "x^" + p; }
function termSrc(v, p, first){
  var a = Math.abs(v), body = p === 0 ? String(a) : (a === 1 ? "" : String(a)) + powSrc(p);
  return first ? (v < 0 ? "-" : "") + body : (v < 0 ? "- " : "+ ") + body;
}
function polySrc(c){ var out = []; for (var p = c.length - 1; p >= 0; p--) if (c[p]) out.push(termSrc(c[p], p, !out.length)); return out.length ? out.join(" ") : "0"; }
function polyM(c){ return MV.m(polySrc(c)); }
function eqM(name, c){ return MV.m(name + " = " + polySrc(c)); }
function termName(p){ return MV.m(powSrc(p)); }
function andList(a){ return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
// "the x³ and x terms", "the x⁴ term and the constant 3", "the constant 1"
function termsPhrase(ps, c){
  var pw = ps.filter(function(p){ return p > 0; }), parts = [];
  if (pw.length) parts.push("the " + andList(pw.map(termName)) + (pw.length > 1 ? " terms" : " term"));
  if (ps.indexOf(0) >= 0) parts.push("the constant " + num(c[0]));
  return parts.join(" and ");
}
function same(a, b){ return Math.abs(a - b) < 1e-9; }

// Exact count of distinct real zeros of an integer polynomial (Sturm sequence with rational arithmetic).
var B0 = BigInt(0), B1 = BigInt(1);
function bgcd(a, b){ if (a < B0) a = -a; if (b < B0) b = -b; while (b !== B0) { var t = a % b; a = b; b = t; } return a; }
function rq(n, d){ if (d === undefined) d = B1; if (d < B0) { n = -n; d = -d; } var g = bgcd(n, d); if (g === B0) g = B1; return [n / g, d / g]; }
function rsub(a, b){ return rq(a[0] * b[1] - b[0] * a[1], a[1] * b[1]); }
function rmul(a, b){ return rq(a[0] * b[0], a[1] * b[1]); }
function rdiv(a, b){ return rq(a[0] * b[1], a[1] * b[0]); }
function rtrim(p){ while (p.length && p[p.length - 1][0] === B0) p.pop(); return p; }
function rrem(a, b){
  a = a.slice(); var db = b.length - 1;
  while (a.length - 1 >= db) {
    var da = a.length - 1, f = rdiv(a[da], b[db]);
    for (var i = 0; i <= db; i++) a[da - db + i] = rsub(a[da - db + i], rmul(f, b[i]));
    a[da] = [B0, B1]; rtrim(a);
  }
  return a;
}
function realZeros(c){
  var p = rtrim(c.map(function(v){ return rq(BigInt(v)); }));
  if (!p.length) return Infinity;
  if (p.length === 1) return 0;
  var seq = [p, rtrim(p.slice(1).map(function(v, i){ return rmul(v, rq(BigInt(i + 1))); }))];
  for (;;) { var r = rrem(seq[seq.length - 2], seq[seq.length - 1]); if (!r.length) break; seq.push(r.map(function(v){ return [-v[0], v[1]]; })); }
  var chg = function(sg){ var n = 0, prev = 0; sg.forEach(function(s){ if (prev && s !== prev) n++; prev = s; }); return n; };
  var pos = seq.map(function(s){ return s[s.length - 1][0] > B0 ? 1 : -1; });
  var neg = seq.map(function(s, i){ return (s.length - 1) % 2 ? -pos[i] : pos[i]; });
  return chg(neg) - chg(pos);
}

// ---------- graph helpers ----------
function autoView(c){
  var M = 1, R = [3, 4, 6, 8, 12, 16, 24, 32], i;
  for (i = 0; i <= 72; i++) M = Math.max(M, Math.abs(evalP(c, -1.8 + 3.6 * i / 72)));
  for (i = 0; i < R.length; i++) if (R[i] >= M * 1.1) break;
  var r = R[Math.min(i, R.length - 1)];
  return { xmin:-2.5, xmax:2.5, ymin:-r, ymax:r };
}
// Points of y = f(x) moved by a fold over the y-axis ("mirror") or a turn about the origin ("half"), t from 0 to 1.
// The turn is done in screen units so the copy really rotates; at t = 1 it is exactly (x, y) -> (−x, −y).
function movedPts(plot, f, v, kind, t){
  var pts = [], N = 600, xr = Math.max(-v.xmin, v.xmax) * 1.4, yr = Math.max(-v.ymin, v.ymax) * 1.6;
  var co = Math.cos(Math.PI * t), si = Math.sin(Math.PI * t), k = (plot.W / (v.xmax - v.xmin)) / ((plot.H || 1) / (v.ymax - v.ymin));
  for (var i = 0; i <= N; i++) {
    var x = -xr + 2 * xr * i / N, y = f(x);
    if (!isFinite(y) || Math.abs(y) > yr) { pts.push([NaN, NaN]); continue; }
    pts.push(movePt(x, y, kind, co, si, k));
  }
  return pts;
}
function movePt(x, y, kind, co, si, k){
  if (kind === "mirror") return [x * co, y];
  return [x * co - (y / k) * si, (x * k) * si + y * co];
}
var GHOST = { mirror:[7, 9], half:[1, 7] };
// A ghost curve (dashed mirror image or dotted half-turn image) with a paper-coloured halo, so it stays visible
// when it lands exactly on the blue graph. o: {f} or {pts}.
function ghost(o, kind){
  var w = kind === "mirror" ? 2.2 : 2.8, base = { f:o.f, pts:o.pts, dash:GHOST[kind] };
  return [Object.assign({ color:css("--sheet"), width:w + 1.6 }, base), Object.assign({ color:css("--ink-2"), width:w }, base)];
}
// A label placed on a curve near the right of the view.
function curveLabel(f, v, text, color){
  for (var x = v.xmax - 0.35; x > v.xmin + 0.3; x -= 0.05) { var y = f(x); if (y > v.ymin + (v.ymax - v.ymin) * 0.08 && y < v.ymax - (v.ymax - v.ymin) * 0.08) return { x:x, y:y, text:text, color:color, dx:6, dy:-12, bg:true, align:"right" }; }
  return null;
}

// @component termTiles — polynomial term tiles: rows f(x), f(−x), −f(x) where the odd-power tiles card-flip in row 2,
//   match lights comparing the rows, and coefficient steppers (x⁵ … constant, −5 to 5). Candidate for N15's display.
function tileHTML(v, p, first, o){
  var front = MV.m(termSrc(v, p, first)), back = o.flippable ? MV.m(termSrc(-v, p, first)) + '<span class="tt-mk">↻</span>' : front;
  return '<span class="tt' + (o.flip ? " flip" : "") + (o.dis ? " dis" : "") + (o.pop ? " pop" : "") + '" data-p="' + p + '"><span class="tt-in"><span class="tt-face tt-f">' + front + '</span><span class="tt-face tt-b">' + back + "</span></span></span>";
}
function plainTile(html, cls){ return '<span class="tt' + (cls ? " " + cls : "") + '"><span class="tt-in"><span class="tt-face tt-f">' + html + "</span></span></span>"; }
function lightsOf(c){ var od = present(c, 1), ev = present(c, 0); return { l1:{ ok:!od.length, p:od[0] }, l2:{ ok:!ev.length, p:ev[0] } }; }
function lightsHTML(c, o){
  if (o.unexp) return '<div class="tt-lights"><p class="tt-light">Expand the bracket first, then compare the rows.</p></div>';
  if (o.anim) return '<div class="tt-lights"><p class="tt-light wait"><span class="mk" aria-hidden="true">…</span> Row 2 = Row 1?</p><p class="tt-light wait"><span class="mk" aria-hidden="true">…</span> Row 2 = Row 3?</p></div>';
  var L = lightsOf(c);
  var one = function(lab, l){ return '<p class="tt-light ' + (l.ok ? "yes" : "no") + '"><span class="mk" aria-hidden="true">' + (l.ok ? "✓" : "✗") + "</span> " + lab + " <strong>" + (l.ok ? "Yes" : "No") + "</strong>" + (l.ok ? "" : '<span class="tt-why">: first difference is ' + (l.p === 0 ? "the constant" : "the " + termName(l.p) + " term") + "</span>") + "</p>"; };
  return '<div class="tt-lights">' + one("Row 2 = Row 1?", L.l1) + one("Row 2 = Row 3?", L.l2) + "</div>";
}
// o: {unexp: html of an unexpanded form, anim: row 2 drawn before its flips, pop: power whose tiles pop in (or "all"), noLights}
function rowsHTML(c, o){
  o = o || {};
  var L = lightsOf(c), pw = POWS.filter(function(p){ return c[p]; }), names = ["f(x)", "f(-x)", "-f(x)"], fn = [c, fNegX(c), fNeg(c)];
  function row(i){
    var h = "";
    if (o.unexp) h = i === 0 ? plainTile(o.unexp, "wide") : plainTile("?", "q");
    else if (!pw.length) h = plainTile(MV.m("0"));
    else pw.forEach(function(p, k){
      var v = c[p], pop = o.pop === "all" || o.pop === p, d1 = !o.anim && !L.l1.ok && p === L.l1.p, d3 = !o.anim && !L.l2.ok && p === L.l2.p;
      if (i === 0) h += tileHTML(v, p, k === 0, { dis:d1, pop:pop });
      else if (i === 1) h += tileHTML(v, p, k === 0, { flippable:p % 2 === 1, flip:!o.anim && p % 2 === 1, dis:d1 || d3, pop:pop });
      else h += tileHTML(-v, p, k === 0, { dis:d3, pop:pop });
    });
    var said = o.unexp ? (i ? "not expanded yet" : MV.plain(o.unexp)) : MV.plain(polyM(fn[i]));
    return '<div class="tt-line"><span class="tt-lab">' + MV.m(names[i] + " =") + '</span><div class="tt-row" data-row="' + (i + 1) + '"><span class="vh">Row ' + (i + 1) + ": " + MV.plain(MV.m(names[i])) + " = " + said + '</span><span class="tt-tiles" aria-hidden="true">' + h + "</span>" +
      (i === 1 ? '<span class="tt-stamp" aria-hidden="true" hidden>' + MV.m("-x") + "</span>" : "") + "</div></div>";
  }
  return '<div class="tt-rows">' + row(0) + row(1) + row(2) + "</div>" + (o.noLights ? "" : lightsHTML(c, o));
}
// Slide the "−x" stamp along a row; each odd-power tile flips (0.4 s) as the stamp reaches it.
function stampRun(row, tok, done, onStart){
  var stamp = row.querySelector(".tt-stamp"), tiles = $$(".tt", row);
  if (MV.reduceMotion || !stamp || !tiles.length) { tiles.forEach(function(t){ if (t.querySelector(".tt-mk")) t.classList.add("flip"); }); done(); return; }
  if (onStart) onStart();
  var at = function(t){ return { x:t.offsetLeft + t.offsetWidth / 2, y:t.offsetTop }; };
  var cur = at(tiles[0]); cur.x -= tiles[0].offsetWidth / 2 + 14;
  var put = function(){ stamp.style.transform = "translate(" + cur.x.toFixed(1) + "px," + cur.y.toFixed(1) + "px) translate(-50%,-100%)"; };
  put(); stamp.hidden = false;
  var i = 0;
  (function next(){
    if (tok.dead) return;
    if (i >= tiles.length) { MV.wait(260, function(){ if (tok.dead) return; stamp.hidden = true; done(); }); return; }
    var t = tiles[i], to = at(t), from = { x:cur.x, y:cur.y };
    MV.tween({ dur:300, step:function(k){ if (tok.dead) return; cur.x = from.x + (to.x - from.x) * k; cur.y = from.y + (to.y - from.y) * k; put(); }, done:function(){
      if (tok.dead) return;
      i++;
      if (t.querySelector(".tt-mk")) { t.classList.add("flip"); MV.wait(440, next); } else MV.wait(160, next);
    } });
  })();
}
function stepsHTML(c, pre){
  return '<div class="stps-wrap"><div class="stps" role="group" aria-label="Term tiles: coefficients from x to the 5 down to the constant">' + POWS.map(function(p){
    var v = c[p], nm = p === 0 ? "constant" : MV.m(powSrc(p)), pl = p === 0 ? "constant" : "coefficient of " + MV.plain(nm);
    return '<div class="stp' + (v ? "" : " off") + '"><span class="stp-t' + (p ? "" : " c0") + '">' + nm + '</span><span class="stp-b">' +
      '<button type="button" class="stp-btn" data-st="' + p + '" data-d="-1" data-k="' + pre + p + 'm" aria-label="Decrease the ' + pl + '">' + MINUS + "</button>" +
      '<output class="stp-v">' + num(v) + "</output>" +
      '<button type="button" class="stp-btn" data-st="' + p + '" data-d="1" data-k="' + pre + p + 'p" aria-label="Increase the ' + pl + '">+</button></span></div>';
  }).join("") + "</div></div>";
}

// ---------- hero: three rows of tiles; the −x stamp flips the odd-power tiles (reduced motion: final frame) ----------
function hero(){
  var host = $("#hero-eo"); if (!host) return;
  var R = [
    { n:"f", c:[3, 0, -2, 0, 1, 0], lab:"nothing flipped: even", view:{ xmin:-2.2, xmax:2.2, ymin:-1.5, ymax:9 }, mark:"mirror" },
    { n:"g", c:[0, -4, 0, 1, 0, 0], lab:"everything flipped: odd", view:{ xmin:-3, xmax:3, ymin:-6, ymax:6 }, mark:"half" },
    { n:"h", c:[0, 0, 1, 1, 0, 0], lab:"some flipped: neither", view:{ xmin:-1.8, xmax:1.2, ymin:-1.2, ymax:1.2 }, mark:null }];
  host.innerHTML = R.map(function(r, i){
    var pw = POWS.filter(function(p){ return r.c[p]; });
    return '<div class="he-row" aria-hidden="true"><div class="he-left"><div class="tt-row he-tiles"><span class="he-name">' + MV.m(r.n + "(x) =") + "</span>" +
      pw.map(function(p, k){ return tileHTML(r.c[p], p, k === 0, { flippable:p % 2 === 1 }); }).join("") + '<span class="tt-stamp" hidden>' + MV.m("-x") + '</span></div><p class="he-lab">' + r.lab + '</p></div><canvas class="plot square he-plot" id="he-p' + i + '"></canvas></div>';
  }).join("");
  var rows = $$(".he-row", host);
  R.forEach(function(r, i){
    var p = new MV.Plot($("#he-p" + i), r.view), f = function(x){ return evalP(r.c, x); };
    p.render = function(){
      var mir = r.mark === "mirror";
      p.draw({ view:r.view, ticks:false, axes:!mir, curves:[{ f:f, color:css("--pen"), width:2.4 }],
        segments:mir ? [{ x1:r.view.xmin, y1:0, x2:r.view.xmax, y2:0, color:css("--plot-axis"), width:1.5 }, { x1:0, y1:r.view.ymin, x2:0, y2:r.view.ymax, color:css("--ink-2"), width:2.2, dash:[5, 4] }] : [],
        after:r.mark === "half" ? function(ctx, pl){ var X = pl.X(0), Y = pl.Y(0), rad = 15; ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(X, Y, rad, Math.PI * 0.15, Math.PI * 1.15); ctx.stroke(); ctx.restore();
          var a = Math.PI * 1.15, tx = X + rad * Math.cos(a), ty = Y + rad * Math.sin(a), d = 6; ctx.fillStyle = css("--ink-2"); ctx.beginPath(); ctx.moveTo(tx + d * 0.9, ty - d * 0.2); ctx.lineTo(tx - d * 0.6, ty - d * 0.9); ctx.lineTo(tx - d * 0.4, ty + d * 0.9); ctx.closePath(); ctx.fill(); } : null });
    };
    p.render();
  });
  function finish(i){ var row = rows[i]; $(".he-name", row).innerHTML = MV.m(R[i].n + "(-x) ="); $(".he-lab", row).classList.add("on"); $(".he-plot", row).classList.add("on"); }
  if (MV.reduceMotion) { rows.forEach(function(row, i){ $$(".tt", row).forEach(function(t){ if (t.querySelector(".tt-mk")) t.classList.add("flip"); }); finish(i); }); return; }
  var i = 0, tok = { dead:false };
  (function step(){
    if (i >= rows.length) return;
    var row = rows[i];
    MV.wait(i ? 450 : 900, function(){
      stampRun($(".he-tiles", row), tok, function(){
        $(".he-lab", row).classList.add("on");
        MV.wait(350, function(){ $(".he-plot", row).classList.add("on"); i++; MV.wait(650, step); });
      }, function(){ $(".he-name", row).innerHTML = MV.m(R[i].n + "(-x) ="); });
    });
  })();
}

// ---------- Explore: the term sign-flipper ----------
var PRESETS = [
  { c:[3, 0, -2, 0, 1, 0] }, { c:[0, -4, 0, 1, 0, 0] }, { c:[1, -4, 0, 1, 0, 0] }, { c:[0, 4, 0, -5, 0, 1] }, { c:[1, -2, 1, 0, 0, 0], label:MV.m("(x - 1)^2") + " expanded" }];
function explore(host, api){
  var S = api.S;
  S.c = clean(S.c || [1, -4, 0, 1, 0, 0]); S.view = S.view === "graph" ? "graph" : "tiles"; S.a = S.a || 2; S.mirror = !!S.mirror; S.half = !!S.half;
  var tr = { unexp:false, marks:[], moving:[], anim:null }, tok = { dead:true }, pend = null;
  host.innerHTML = '<div class="pg sf"><div class="pg-graph" data-mv="graph"><div class="eq-cap" id="sf-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="sf-top"><div id="sf-view"></div><button type="button" class="btn primary sm" id="sf-run"><span>Replace ' + MV.m("x") + " with " + MV.m("-x") + "</span></button></div>" +
    '<div id="sf-tiles" class="sf-tiles"></div>' +
    '<div id="sf-graph" hidden><div class="plot-wrap"><canvas class="plot" id="sf-plot" role="img" aria-label="Graph of f"></canvas></div>' +
    '<div class="chips sf-tog" role="group" aria-label="Overlays"><button type="button" class="chip" id="sf-mir" data-k="sfmir">Mirror in the ' + MV.m("y") + '-axis</button><button type="button" class="chip" id="sf-half" data-k="sfhalf">Half-turn about the origin</button></div>' +
    '<p class="tiny muted sf-key">Blue: ' + MV.m("y = f(x)") + ". Dashed ghost: " + MV.m("y = f(-x)") + ". Dotted ghost: " + MV.m("y = -f(-x)") + ".</p></div></div>" +
    '<div class="pg-ctrl"><h3 class="sf-h">Term tiles</h3><div id="sf-steps"></div>' +
    '<p class="tiny sf-pl">Presets:</p><div class="chips" id="sf-pre" role="group" aria-label="Presets">' + PRESETS.map(function(p, i){ return '<button type="button" class="fchip" data-pre="' + i + '" data-k="sfpre' + i + '">' + (p.label || polyM(p.c)) + "</button>"; }).join("") + "</div>" +
    '<div id="sf-sl"></div><div class="vbars" id="sf-bars"></div></div>' +
    '<div class="pg-read"><dl class="read" id="sf-read" aria-live="polite"></dl></div></div>';
  var viewSeg = MV.seg($("#sf-view"), { label:"View:", value:S.view, options:[{ id:"tiles", t:"Tiles" }, { id:"graph", t:"Graph" }], onChange:function(v){ stopAnim(); S.view = v; api.save(); paint(); } });
  var sl = MV.sliders($("#sf-sl"), [{ id:"a", label:"Test one value: " + MV.m("x = a"), min:0.5, max:3, step:0.5, value:S.a }], function(id, v){ S.a = v; api.save(); paintRead(); plot.render(); });
  var plot = new MV.Plot($("#sf-plot"), autoView(S.c));

  function stopAnim(){ tok.dead = true; tr.anim = null; tr.moving = []; if (pend) { var d = pend; pend = null; d(); } }
  function newTok(done){ stopAnim(); tok = { dead:false }; pend = done || null; return tok; }
  function finishAnim(t){ if (t.dead) return; t.dead = true; var d = pend; pend = null; paint(); if (d) d(); }
  function setView(v){ S.view = v; viewSeg.set(v); $("#sf-tiles").hidden = v !== "tiles"; $("#sf-graph").hidden = v !== "graph"; plot.render(); }

  plot.render = function(){
    if (S.view !== "graph") return;
    var c = S.c, v = autoView(c), f = function(x){ return evalP(c, x); }, k = kindOf(c);
    var curves = [{ f:f, color:css("--pen"), width:3.2, arrows:true }], pts = [], ink2 = css("--ink-2");
    if (S.mirror) curves = curves.concat(ghost({ f:function(x){ return f(-x); } }, "mirror"));
    if (S.half) curves = curves.concat(ghost({ f:function(x){ return -f(-x); } }, "half"));
    if (tr.anim) {
      curves = curves.concat(ghost({ pts:movedPts(plot, f, v, tr.anim.kind, tr.anim.t) }, tr.anim.kind));
      var co = Math.cos(Math.PI * tr.anim.t), si = Math.sin(Math.PI * tr.anim.t), kk = (plot.W / (v.xmax - v.xmin)) / (plot.H / (v.ymax - v.ymin));
      tr.moving.forEach(function(m){ var q = movePt(m[0], m[1], tr.anim.kind, co, si, kk); pts.push({ x:q[0], y:q[1], r:6, open:true, color:ink2 }); });
    }
    pts.push({ x:S.a, y:f(S.a), r:4.5, color:css("--ink") }, { x:-S.a, y:f(-S.a), r:4.5, color:css("--ink") });
    pts = pts.concat(tr.marks.map(function(m){ return { x:m.x, y:m.y, label:m.label, open:m.open, r:5, color:m.open ? ink2 : css("--ink") }; }));
    var d = "Graph of " + MV.plain(eqM("f(x)", c)) + ". " + { even:"Even: symmetric in the y-axis.", odd:"Odd: a half-turn about the origin maps it onto itself.", neither:"Neither: no mirror symmetry in the y-axis and no half-turn symmetry about the origin.", zero:"The zero function." }[k];
    if (S.mirror) d += " Dashed ghost y = f(−x)" + (k === "even" || k === "zero" ? ", lying exactly on the graph." : ", the mirror image, which does not match the graph.");
    if (S.half) d += " Dotted ghost y = −f(−x)" + (k === "odd" || k === "zero" ? ", lying exactly on the graph." : ", the half-turn image, which does not match the graph.");
    if (tr.marks.length) d += " Marked: " + tr.marks.map(function(m){ return m.label + (m.open ? " on the ghost" : " on the graph"); }).join(", ") + ".";
    plot.draw({ view:v, curves:curves, points:pts, describe:d });
  };

  function paintRead(){
    var c = S.c, k = kindOf(c), a = S.a, fa = evalP(c, a), fma = evalP(c, -a), od = present(c, 1), ev = present(c, 0), rows;
    var A = num(a), mA = num(-a);
    var oneVal = MV.m("f(" + A + ") = " + num(fa, 5)) + ", " + MV.m("f(" + mA + ") = " + num(fma, 5)) + ", " + MV.m("-f(" + A + ") = " + num(-fa, 5));
    var fluke = (k === "neither" || k === "odd") && same(fa, fma) || (k === "neither" || k === "even") && same(fma, -fa);
    if (fluke) oneVal += '<br><span class="tiny muted">These match at ' + MV.m("a = " + A) + ", but the terms don’t. Try another value.</span>";
    if (tr.unexp) rows = [[MV.m("f(x)"), MV.m("(x - 1)^2")], [MV.m("f(-x)"), '<span class="muted">Expand the bracket first: the tiles need one term each.</span>'], ["One-value test (" + MV.m("a = " + A) + ")", oneVal]];
    else rows = [
      [MV.m("f(x)"), polyM(c)], [MV.m("f(-x)"), polyM(fNegX(c))], [MV.m("-f(x)"), polyM(fNeg(c))],
      ["Even?", od.length ? "<strong>No:</strong> " + termsPhrase(od, c) + " changed sign." : "<strong>Yes.</strong> No term changed sign: " + MV.m("f(-x) = f(x)") + "."],
      ["Odd?", ev.length ? "<strong>No:</strong> " + termsPhrase(ev, c) + " didn’t change sign." : "<strong>Yes.</strong> Every term changed sign: " + MV.m("f(-x) = -f(x)") + "."],
      ["Classification", '<span class="qpath">' + { even:"Even", odd:"Odd", neither:"Neither", zero:"Both even and odd" }[k] + "</span>" + (k === "zero" ? ' <span class="tiny muted">(only the zero function is both)</span>' : "")],
      ["Symmetry", { even:"Symmetric in the " + MV.m("y") + "-axis.", odd:"A half-turn about the origin maps the graph onto itself.", neither:"No mirror symmetry in the " + MV.m("y") + "-axis and no half-turn symmetry about the origin.", zero:"The graph is the " + MV.m("x") + "-axis, which has both symmetries." }[k]],
      ["One-value test (" + MV.m("a = " + A) + ")", oneVal]];
    $("#sf-read").innerHTML = MV.readoutHTML(rows);
    var vals = [[MV.m("f(" + A + ")"), fa, "b1"], [MV.m("f(" + mA + ")"), fma, "b2"], [MV.m("-f(" + A + ")"), -fa, "b3"]], M = 1;
    vals.forEach(function(x){ M = Math.max(M, Math.abs(x[1])); });
    $("#sf-bars").innerHTML = '<p class="tiny muted" style="margin:0 0 4px">Value bars (left of the centre line means negative)</p>' + vals.map(function(x){ var w = Math.abs(x[1]) / M * 50; return '<div class="vb"><span class="vb-l">' + x[0] + '</span><span class="vb-t"><i class="' + x[2] + '" style="' + (x[1] >= 0 ? "left:50%" : "right:50%") + ";width:" + w.toFixed(2) + '%"></i></span><span class="vb-v">' + num(x[1], 5) + "</span></div>"; }).join("");
  }
  function paint(o){
    o = o || {};
    var c = S.c;
    $("#sf-cap").innerHTML = tr.unexp ? MV.m("f(x) = (x - 1)^2") : eqM("f(x)", c);
    MV.keepFocus($("#sf-steps"), function(){ $("#sf-steps").innerHTML = stepsHTML(c, "sf"); });
    $("#sf-tiles").innerHTML = rowsHTML(c, { unexp:tr.unexp ? MV.m("(x - 1)^2") : null, anim:o.anim, pop:o.pop });
    $("#sf-tiles").hidden = S.view !== "tiles"; $("#sf-graph").hidden = S.view !== "graph";
    [["#sf-mir", S.mirror], ["#sf-half", S.half]].forEach(function(b){ var el = $(b[0]); el.setAttribute("aria-pressed", String(b[1])); el.classList.toggle("on", b[1]); });
    paintRead(); plot.render(); MV.changed();
  }
  // Animations used by the button and the predictions.
  function flipRun(done, o){
    o = o || {};
    var t = newTok(done);
    if (S.view !== "tiles") setView("tiles");
    paint({ anim:true, pop:o.pop });
    MV.wait(o.delay || 0, function(){ if (!t.dead) stampRun($('#sf-tiles [data-row="2"]'), t, function(){ finishAnim(t); }); });
  }
  function turnRun(kind, dur, done, moving){
    var t = newTok(done);
    if (S.view !== "graph") setView("graph");
    tr.anim = { kind:kind, t:0 }; tr.moving = moving || [];
    MV.tween({ dur:dur, step:function(k){ if (t.dead) return; tr.anim.t = k; plot.render(); }, done:function(){
      if (t.dead) return; tr.anim = null; tr.moving = []; if (kind === "mirror") S.mirror = true; else S.half = true; api.save(); finishAnim(t); } });
  }
  function userChange(){ stopAnim(); tr.unexp = false; tr.marks = []; MV.banner("", ""); }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.st != null) { userChange(); var p = +b.dataset.st; S.c[p] = Math.max(-5, Math.min(5, S.c[p] + +b.dataset.d)); api.save(); paint(); }
    else if (b.dataset.pre != null) { userChange(); S.c = clean(PRESETS[+b.dataset.pre].c); api.save(); paint(); }
    else if (b.id === "sf-run") { var wasUnexp = tr.unexp; stopAnim(); tr.unexp = false; tr.marks = []; flipRun(null, wasUnexp ? { pop:"all", delay:600 } : {}); }
    else if (b.id === "sf-mir" || b.id === "sf-half") { stopAnim(); tr.marks = []; if (b.id === "sf-mir") S.mirror = !S.mirror; else S.half = !S.half; api.save(); paint(); }
  });
  // "Load this function" buttons inside the challenge prompts.
  document.addEventListener("click", function(e){
    var b = e.target.closest("[data-load]"); if (!b) return;
    var ch = (api.content.challenges || []).filter(function(x){ return x.id === b.dataset.load; })[0]; if (!ch) return;
    userChange(); S.c = clean(ch.start); S.view = "tiles"; viewSeg.set("tiles"); api.save(); paint();
    var nm = b.dataset.load === "tc2" ? "g(x)" : "f(x)";
    MV.banner("", "Loaded " + MV.plain(eqM(nm, S.c)) + ".");
    b.textContent = "Loaded ✓ (the tiles above now show it)";
  });

  function chal(id){
    var c = S.c, k = kindOf(c), C = (api.content.challenges || []).filter(function(x){ return x.id === id; })[0], st = C && C.start, M = function(s){ return { ok:false, msg:MV.md(s) }; };
    if (id === "tc1") {
      var diff = [0, 1, 2, 3, 4, 5].filter(function(p){ return c[p] !== st[p]; });
      if (diff.length === 1 && diff[0] === 3 && c[3] === 0) return { ok:true };
      if (!diff.length) return M("That’s the starting function. Change one coefficient so that no term flips.");
      if (diff.length > 1) return M("Only one change is allowed." + (diff.length > 2 ? " Press <strong>Load this function</strong> to start again from `f(x) = 2x^4 + 3x^3 - x^2 + 5`." : ""));
      var p = diff[0];
      if (p === 0) return M("The constant is an even power, so it was never the problem. Which term flips?");
      if (p === 4 || p === 2) return M("Even powers never flip. Change the odd-power term.");
      if (p === 3) return M("The `x^3` term is still there, so it still flips. Which coefficient makes it disappear?");
      return M("That adds another odd-power term, which flips too. Change the odd-power term that’s already there.");
    }
    if (id === "tc2") {
      var removed = [0, 1, 2, 3, 4, 5].filter(function(p){ return st[p] && !c[p]; }), changed = [0, 1, 2, 3, 4, 5].filter(function(p){ return c[p] !== st[p] && !(st[p] && !c[p]); });
      if (k === "odd" && removed.length === 3 && !changed.length) return { ok:true };
      if (k === "even") return M("That’s even. The challenge asks for odd.");
      if (removed.some(function(p){ return p % 2; })) return M("Odd-power terms are what an odd function is made of. Remove the even-power terms instead.");
      if (changed.length) return M("Only remove terms (set them to 0). Press <strong>Load this function</strong> to start again from `g(x) = x^5 - 2x^4 + 3x^2 - x + 4`.");
      if (c[0]) return M("The constant is an even power (`x^0`): it doesn’t flip, so it stops `g` from being odd.");
      if (c[4] || c[2]) return M("Still not odd: " + termsPhrase(present(c, 0), c) + (present(c, 0).length > 1 ? " don’t" : " doesn’t") + " flip.");
      return M("Check which terms flip when `x → -x`.");
    }
    if (id === "tc3") {
      var hasOdd = !!(c[1] || c[3] || c[5]), hasEven = !!(c[2] || c[4]), sOdd = c[1] + c[3] + c[5];
      if (c[0]) return M("The graph must pass through the origin, so the constant is 0.");
      if (!hasOdd && !hasEven) return M("Add some tiles first: you need at least one odd-power term and one even-power term.");
      if (!hasOdd) return M("That’s even, not neither. Include an odd-power term.");
      if (!hasEven && sOdd === 0) return M("`f(1) = f(-1) = 0`, but that’s odd. Add an even-power term.");
      if (sOdd !== 0) return M("`f(1) - f(-1)` is twice the sum of the odd-power coefficients. Make them add to 0.");
      return { ok:true };
    }
    return { ok:false };
  }

  setView(S.view); paint();
  return {
    predict:{
      start:function(p){
        stopAnim(); var s = p.start || {};
        S.c = clean(s.c); S.mirror = false; S.half = false; tr.unexp = !!s.unexp; tr.marks = []; tr.moving = [];
        api.save(); setView(s.view || "tiles"); paint();
      },
      run:function(p, done){
        if (p.id === "p1") flipRun(function(){ MV.wait(700, function(){ turnRun("mirror", 1300, done); }); });
        else if (p.id === "p2") { S.c[0] = 1; api.save(); flipRun(done, { pop:0, delay:650 }); }
        else if (p.id === "p3") {
          var xm = Math.sqrt((15 - Math.sqrt(145)) / 10), ym = evalP(S.c, xm);
          tr.marks = [{ x:1, y:0, label:"(1, 0)" }, { x:-1, y:0, label:"(−1, 0)" }, { x:xm, y:ym, label:"max ≈ (0.5, 1.4)" }, { x:-xm, y:-ym, label:"min ≈ (−0.5, −1.4)" }];
          turnRun("half", 1500, done, [[1, 0], [xm, ym]]);
        } else if (p.id === "p4") {
          setView("tiles");
          MV.wait(450, function(){
            tr.unexp = false;
            flipRun(function(){ MV.wait(600, function(){ tr.marks = [{ x:1, y:0, label:"(1, 0)" }, { x:-1, y:0, label:"(−1, 0)", open:true }]; turnRun("mirror", 1300, done); }); }, { pop:"all", delay:700 });
          });
        } else done();
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// ---------- Part 3: mirror lab ----------
function part3(host, api){
  var P = api.content, R = P.rounds, S = api.S;
  S.r = Math.min(R.length - 1, S.r || 0); S.parts = S.parts !== false; S.rs = S.rs || {};
  var V = { xmin:-3, xmax:3, ymin:-6, ymax:6 }, tr = { anim:null, tok:{ dead:true } }, msgs = {}, lastEk = null;
  function rs(i){ var r = R[i]; var x = S.rs[r.id]; if (!x) x = S.rs[r.id] = { c:clean(r.start), off:{}, solved:false, pick:null, test:null }; return x; }
  function eff(x){ return x.c.map(function(v, p){ return x.off[p] ? 0 : v; }); }
  function sig(c){ return c.join(","); }
  host.innerHTML = '<div class="chips" id="ml-rounds" role="group" aria-label="Rounds"></div><div class="sym">' +
    '<div><p class="eq-cap" id="ml-cap" aria-live="polite"></p><div class="plot-wrap"><canvas class="plot square" id="ml-plot" role="img" aria-label="Mirror lab graph"></canvas></div>' +
    '<div class="legend ml-leg"><span><i class="sw" style="background:var(--pen)"></i>' + MV.m("y = f(x)") + '</span><span><i class="sw sw-dash"></i>even part ' + MV.m("E") + ' (dashed)</span><span><i class="sw sw-dot"></i>odd part ' + MV.m("O") + " (dotted)</span></div>" +
    '<div class="chips"><button type="button" class="chip" id="ml-parts" data-k="mlparts">Show the two parts</button></div></div>' +
    '<div><h3 id="ml-title" style="margin-top:0"></h3><p class="ml-goal" id="ml-goal"></p><div id="ml-edit"></div>' +
    '<h3>Run a test</h3><div class="q-actions" style="margin-top:0"><button type="button" class="btn primary sm" id="ml-mir" data-k="mlmir"><span>Mirror in the ' + MV.m("y") + '-axis</span></button><button type="button" class="btn primary sm" id="ml-half" data-k="mlhalf">Half-turn about the origin</button></div>' +
    '<div id="ml-res" aria-live="polite"></div><div id="ml-fb" aria-live="polite"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="ml-reset" data-k="mlreset">Start this round again</button></div>' +
    '<details class="alg" id="ml-alg"><summary>Check it with algebra</summary><p style="margin:10px 0 0">' + P.alg + '</p><div class="alg-lines" id="ml-lines"></div></details></div></div>';
  var plot = new MV.Plot($("#ml-plot"), V), cplots = [];

  plot.render = function(){
    var r = R[S.r], x = rs(S.r), c = eff(x), f = function(z){ return evalP(c, z); }, E = evenPart(c), O = oddPart(c), ink2 = css("--ink-2");
    var fe = function(z){ return evalP(E, z); }, fo = function(z){ return evalP(O, z); }, curves = [], labels = [];
    if (S.parts) {
      curves.push({ f:fe, color:ink2, width:1.8, dash:[6, 6], alpha:0.6 }, { f:fo, color:ink2, width:2.2, dash:[2, 5], alpha:0.6 });
      [curveLabel(fe, V, "E", ink2), curveLabel(fo, V, "O", ink2)].forEach(function(l){ if (l) labels.push(l); });
    }
    curves.push({ f:f, color:css("--pen"), width:3.2, arrows:true });
    if (S.parts) { var lf = curveLabel(f, V, "f", css("--pen")); if (lf) labels.push(lf); }
    var t = tr.anim, test = x.test && x.test.sig === sig(c) ? x.test : null;
    if (t) curves = curves.concat(ghost({ pts:movedPts(plot, f, V, t.kind, t.t) }, t.kind));
    else if (test) curves = curves.concat(ghost({ pts:movedPts(plot, f, V, test.kind, 1) }, test.kind));
    var k = kindOf(c), d = "Graph of " + MV.plain(eqM("f(x)", c)) + (S.parts ? ", with its even part E(x) = " + MV.plain(polyM(E)) + " dashed and its odd part O(x) = " + MV.plain(polyM(O)) + " dotted" : "") + ". ";
    if (test) d += (test.kind === "mirror" ? "Mirror test: " : "Half-turn test: ") + (test.match ? "the moved copy lands exactly on the graph." : "the moved copy does not match the graph.");
    plot.draw({ view:V, curves:curves, labels:labels, describe:d });
  };
  function candCoef(cd){ var c = R[2].start, E = evenPart(c), O = oddPart(c); return E.map(function(v, p){ return cd.e * v + cd.o * O[p]; }); }
  function candDesc(cc){
    var zs = []; for (var z = -5; z <= 5; z++) if (same(evalP(cc, z), 0)) zs.push(num(z));
    var lead = cc[3];
    return (zs.length ? "crosses the x-axis at " + andList(zs) + "; " : "") + "y-intercept " + num(cc[0]) + "; " + (lead > 0 ? "falls to the left and rises to the right" : "rises to the left and falls to the right");
  }
  function editHTML(r, x){
    if (r.target === "pick") {
      return '<div class="ml-cands" role="radiogroup" aria-label="Which curve is y = f(−x)?">' + r.cands.map(function(cd, i){
        var L = String.fromCharCode(65 + i), on = x.pick === i, cls = "ml-cand" + (on ? (MV.ok(cd) ? " right" : " wrong") : "");
        return '<button type="button" role="radio" class="' + cls + '" aria-checked="' + on + '" data-cand="' + i + '" data-k="mlc' + i + '" aria-label="Curve ' + L + ": " + candDesc(candCoef(cd)) + '"' + (x.solved ? " disabled" : "") + '><canvas class="plot square" id="ml-c' + i + '" aria-hidden="true"></canvas><span class="ml-cl">Curve ' + L + (x.solved ? ": " + cd.name : "") + "</span></button>";
      }).join("") + "</div>";
    }
    var shown = POWS.filter(function(p){ return r.start[p]; });
    return '<p class="how">Tap a term to remove it; tap it again to put it back. Use ' + MINUS + " and + to change a coefficient.</p>" + '<div class="ml-terms">' + shown.map(function(p, i){
      var off = !!x.off[p], v = x.c[p], t = MV.m(termSrc(v, p, i === 0)), nm = p === 0 ? "constant" : "coefficient of " + MV.plain(termName(p));
      return '<div class="ml-term' + (off ? " off" : "") + '"><button type="button" class="fchip ml-tog" data-tog="' + p + '" data-k="mlt' + p + '" aria-pressed="' + !off + '" aria-label="' + MV.esc(MV.plain(t)) + (off ? ": removed. Tap to put it back." : ": in the function. Tap to remove it.") + '"' + (x.solved ? " disabled" : "") + ">" + t + "</button>" +
        '<span class="stp-b"><button type="button" class="stp-btn" data-mst="' + p + '" data-d="-1" data-k="mls' + p + 'm" aria-label="Decrease the ' + nm + '"' + (off || x.solved ? " disabled" : "") + ">" + MINUS + '</button><output class="stp-v">' + num(v) + '</output><button type="button" class="stp-btn" data-mst="' + p + '" data-d="1" data-k="mls' + p + 'p" aria-label="Increase the ' + nm + '"' + (off || x.solved ? " disabled" : "") + ">+</button></span></div>";
    }).join("") + "</div>";
  }
  function linesHTML(c){
    var E = evenPart(c), O = oddPart(c), eZ = isZero(E), oZ = isZero(O);
    return "<div>" + eqM("f(x)", c) + "</div><div>" + eqM("E(x)", E) + " <small>even-power terms, constant included</small></div><div>" + eqM("O(x)", O) + " <small>odd-power terms</small></div>" +
      "<div>" + MV.m("f(-x) = E(x) - O(x) = " + polySrc(fNegX(c))) + "</div><div><small>" + (eZ && oZ ? "Both parts are 0: the zero function is even and odd." : oZ ? MV.m("O = 0") + ", so " + MV.m("f(-x) = f(x)") + ": even." : eZ ? MV.m("E = 0") + ", so " + MV.m("f(-x) = -f(x)") + ": odd." : "Neither part is 0, so " + MV.m("f") + " is neither even nor odd.") + "</small></div>";
  }
  function resHTML(x, c){
    var t = x.test && x.test.sig === sig(c) ? x.test : null;
    if (tr.anim) return '<p class="fb">' + (tr.anim.kind === "mirror" ? "Reflecting a copy in the " + MV.m("y") + "-axis…" : "Turning a copy half a turn about the origin…") + "</p>";
    if (!t) return "";
    var txt = t.kind === "mirror" ? (t.match ? "<strong>✓ Match.</strong> The mirror image lands exactly on the graph: " + MV.m("f(-x) = f(x)") + "." : "<strong>✗ No match.</strong> The mirror image lands somewhere else, so " + MV.m("f(-x) ≠ f(x)") + ".")
      : (t.match ? "<strong>✓ Match.</strong> After a half-turn the copy lands exactly on the graph: " + MV.m("f(-x) = -f(x)") + "." : "<strong>✗ No match.</strong> After a half-turn the copy lands somewhere else, so " + MV.m("f(-x) ≠ -f(x)") + ".");
    return '<div class="fb ' + (t.match ? "good" : "bad") + '"><p>' + txt + "</p></div>";
  }
  function judge(r, x){
    var c = eff(x), k = kindOf(c), removed = POWS.filter(function(p){ return r.start[p] && x.off[p]; }), want = r.target === "odd" ? "half" : "mirror";
    var met = removed.length === 1 && k === r.target;
    if (met && x.test.kind === want && x.test.match) { x.solved = true; return null; }
    var named = (r.wrong || []).filter(function(w){ return w.removed.length === removed.length && w.removed.every(function(p){ return removed.indexOf(p) >= 0; }); })[0];
    if (named) return named.fb;
    if (!removed.length) return "Remove one term first, then run the test again.";
    if (removed.length > 1) return "Remove only one term. Tap a removed term to put it back.";
    if (met) return MV.m("f") + " is " + r.target + " now. Run the " + (want === "half" ? "half-turn" : "mirror") + " test to show it.";
    if (r.target === "odd") { var ev = present(c, 0); return "Still not odd: " + termsPhrase(ev, c) + (ev.length > 1 ? " don’t flip." : " doesn’t flip."); }
    var od = present(c, 1); return "Still not even: " + termsPhrase(od, c) + (od.length > 1 ? " still flip." : " still flips.");
  }
  function paint(){
    var r = R[S.r], x = rs(S.r), c = eff(x);
    MV.keepFocus($("#ml-rounds"), function(){ $("#ml-rounds").innerHTML = R.map(function(q, i){ var y = rs(i); return '<button type="button" class="chip' + (i === S.r ? " on" : "") + '" data-round="' + i + '" data-k="mlr' + i + '" aria-pressed="' + (i === S.r) + '">' + (y.solved ? "✓ " : "") + "Round " + (i + 1) + "</button>"; }).join(""); });
    $("#ml-cap").innerHTML = r.eq || eqM("f(x)", c);
    $("#ml-title").textContent = "Round " + (S.r + 1);
    $("#ml-goal").innerHTML = "<strong>Goal:</strong> " + r.goal + ' <span class="tiny muted">(' + r.parts + " at the start)</span>";
    var ek = S.r + "|" + (r.target === "pick" ? x.pick + "|" + x.solved : JSON.stringify([x.c, x.off, x.solved]));
    if (ek !== lastEk) { lastEk = ek; MV.keepFocus($("#ml-edit"), function(){ $("#ml-edit").innerHTML = editHTML(r, x); }); if (r.target === "pick") drawCands(r); }
    $("#ml-parts").setAttribute("aria-pressed", String(S.parts)); $("#ml-parts").classList.toggle("on", S.parts);
    $("#ml-mir").disabled = $("#ml-half").disabled = !!tr.anim;
    $("#ml-res").innerHTML = resHTML(x, c);
    var fb = "";
    if (x.solved) fb = MV.fbHTML("good", "<strong>✓ Round " + (S.r + 1) + " solved.</strong> " + (r.target === "pick" ? r.cands[x.pick].fb.replace(/^Right\.\s*/, "") : r.why));
    else if (msgs[r.id]) fb = MV.fbHTML("bad", "<strong>✗ Not yet.</strong> " + msgs[r.id]);
    $("#ml-fb").innerHTML = fb;
    $("#ml-lines").innerHTML = linesHTML(c);
    plot.render();
  }
  function drawCands(r){
    cplots = r.cands.map(function(cd, i){
      var cv = $("#ml-c" + i); if (!cv) return null;
      var cc = candCoef(cd), p = new MV.Plot(cv, V);
      p.render = function(){ p.draw({ view:V, ticks:false, curves:[{ f:function(z){ return evalP(cc, z); }, color:css("--pen"), width:2.6, arrows:true }], points:[{ x:0, y:cc[0], r:3.5, color:css("--ink") }] }); };
      p.render(); return p;
    });
  }
  function runTest(kind){
    if (tr.anim) return;
    var x = rs(S.r), r = R[S.r], c = eff(x), k = kindOf(c), t = { dead:false };
    tr.tok.dead = true; tr.tok = t; msgs[r.id] = null; x.test = null;
    tr.anim = { kind:kind, t:0 }; paint();
    MV.tween({ dur:1500, step:function(q){ if (t.dead) return; tr.anim.t = q; plot.render(); }, done:function(){
      if (t.dead) return;
      tr.anim = null;
      x.test = { kind:kind, match:kind === "mirror" ? (k === "even" || k === "zero") : (k === "odd" || k === "zero"), sig:sig(c) };
      if (r.target !== "pick" && !x.solved) msgs[r.id] = judge(r, x);
      api.save(); paint(); MV.focusFb($("#ml-fb").firstChild ? $("#ml-fb") : $("#ml-res"));
    } });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var r = R[S.r], x = rs(S.r);
    if (b.dataset.round != null) { tr.tok.dead = true; tr.anim = null; S.r = +b.dataset.round; }
    else if (b.id === "ml-parts") S.parts = !S.parts;
    else if (b.id === "ml-mir" || b.id === "ml-half") { runTest(b.id === "ml-mir" ? "mirror" : "half"); return; }
    else if (b.id === "ml-reset") { tr.tok.dead = true; tr.anim = null; S.rs[r.id] = null; delete S.rs[r.id]; msgs[r.id] = null; }
    else if (b.dataset.tog != null) { tr.tok.dead = true; tr.anim = null; var p = +b.dataset.tog; x.off[p] = !x.off[p]; msgs[r.id] = null; }
    else if (b.dataset.mst != null) {
      tr.tok.dead = true; tr.anim = null;
      var q = +b.dataset.mst, d = +b.dataset.d, v = x.c[q] + d; if (v === 0) v += d; if (v >= -5 && v <= 5) x.c[q] = v; msgs[r.id] = null;
    } else if (b.dataset.cand != null) {
      var i = +b.dataset.cand, cd = r.cands[i]; x.pick = i;
      if (MV.ok(cd)) { x.solved = true; msgs[r.id] = null; } else msgs[r.id] = cd.fb + " Try another curve.";
      api.save(); paint(); MV.focusFb($("#ml-fb")); return;
    } else return;
    api.save(); paint();
  });
  // Arrow keys move between the curve choices (radio group).
  host.addEventListener("keydown", function(e){
    var b = e.target.closest && e.target.closest("[data-cand]"); if (!b) return;
    var d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0; if (!d) return;
    e.preventDefault(); var all = $$("[data-cand]", host), n = (all.indexOf(b) + d + all.length) % all.length; all[n].focus();
  });
  paint();
  return {};
}

// ---------- Practice 2: use the symmetry (number entry, and one multiple-choice item with retry) ----------
function symm(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it){ return '<div class="q" data-u="' + it.id + '"></div>'; }).join("");
  function paintItem(it, i){
    var box = host.querySelector('[data-u="' + it.id + '"]'), x = ist(it.id);
    MV.keepFocus(box, function(){
      if (it.kind === "mc") { box.innerHTML = MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true, topicLabel:it.star ? "★" : "" }); return; }
      var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
      h += '<div class="numrow"><label for="u-' + it.id + '">' + (it.label || "Your answer:") + '</label><input class="numin short" id="u-' + it.id + '" data-uin="' + it.id + '" type="number" step="any" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + "></div>";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
      if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
      else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
      box.innerHTML = h;
    });
  }
  function paintAll(){ a.items.forEach(paintItem); }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.uin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.uin) { var b = host.querySelector('[data-k="' + e.target.dataset.uin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-u]"); if (!box) return;
    var it = a.items.filter(function(q){ return q.id === box.dataset.u; })[0], i = a.items.indexOf(it), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it, i); return; }
    if (it.kind === "mc") {
      if (b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
      else if (b.dataset.act === "check") { x.checked = true; if (MV.ok(it.options[x.choice])) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++; }
      api.save(); paintItem(it, i); if (b.dataset.act === "check") MV.focusFb(box); return;
    }
    if (b.dataset.act === "check") {
      var r = MV.parseNum(x.val);
      if (!r || r.length !== 1) { msgs[it.id] = "Enter a number, such as 7 or −3."; paintItem(it, i); return; }
      var v = r[0], ans = MV.ans(it);
      if (same(v, ans)) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else {
        x.tries++;
        var named = (it.wrong || []).filter(function(w){ return same(w.match, v); })[0];
        msgs[it.id] = "<strong>✗ Not quite.</strong> " + (named ? named.fb : it.general) + " Try again.";
      }
      api.save(); paintItem(it, i); MV.focusFb(box);
    }
  });
  paintAll();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: build an odd function to spec ----------
var task = (function(){
  var api, plot, VIEW = { xmin:-3, xmax:3, ymin:-10, ymax:10 };
  function read(){ return { c:clean(api ? api.S.c : null) }; }
  function draw(){
    var c = read().c, curves = isZero(c) ? [] : [{ f:function(x){ return evalP(c, x); }, color:css("--pen"), width:3.2, arrows:true }];
    plot.draw({ view:VIEW, curves:curves, points:[{ x:-1, y:-2, r:5, ring:true, color:css("--ink"), label:"(−1, −2)" }],
      describe:(isZero(c) ? "Empty graph" : "Graph of " + MV.plain(eqM("f(x)", c))) + ", with the point (−1, −2) marked. Window −3 ≤ x ≤ 3, −10 ≤ y ≤ 10." });
  }
  function paint(){
    var c = read().c;
    MV.keepFocus($("#tk-steps"), function(){ $("#tk-steps").innerHTML = stepsHTML(c, "tk"); });
    $("#tk-cap").innerHTML = eqM("f(x)", c);
    $("#tk-rows").innerHTML = rowsHTML(c, {});
    draw();
  }
  function zeroText(n){ return n === Infinity ? "infinitely many" : String(n); }
  return {
    render:function(inp, pv, a){
      api = a; a.S.c = clean(a.S.c);
      inp.innerHTML = '<p class="tiny muted" style="margin:0 0 6px">Term tiles: whole-number coefficients from −5 to 5.</p><div id="tk-steps"></div>';
      pv.innerHTML = '<p class="eq-cap" id="tk-cap" aria-live="polite"></p><canvas class="plot square" id="tk-plot" role="img" aria-label="Graph of your function"></canvas><div class="sf-tiles" id="tk-rows"></div>';
      plot = new MV.Plot($("#tk-plot"), VIEW); plot.render = draw;
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-st]"); if (!b) return;
        var p = +b.dataset.st; a.S.c[p] = Math.max(-5, Math.min(5, a.S.c[p] + +b.dataset.d)); a.save(); paint(); a.update();
      });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){
      var c = d.c;
      return [!c[4] && !c[2] && !c[0] && !isZero(c), c[5] < 0, evalP(c, -1) === -2, realZeros(c) === 3];
    },
    tips:function(d, res){
      var T = MV.C.task.tips, c = d.c, out = [], n = realZeros(c);
      if (!res[0]) out.push(T[0]);
      if (!res[1]) out.push(T[1]);
      if (!res[2]) out.push(T[2].replace("{value}", num(evalP(c, -1))));
      if (!res[3]) { var t4 = T[3].replace("{k}", zeroText(n)); if (n === 1) t4 = t4.replace("-intercepts", "-intercept"); out.push(t4); }
      return out;
    },
    key:function(d){ return d.c.join(","); },
    label:function(k){ return eqM("f(x)", k.split(",").map(Number)); },
    text:function(k){ return MV.plain(eqM("f(x)", k.split(",").map(Number))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ symm:symm },
  task:task
});
})();
