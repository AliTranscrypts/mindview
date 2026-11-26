// MDM4U 35 The Pearson correlation coefficient r: hero (five points, mean lines and tinted quadrants, product bars feeding a
// running total, a dial turning to 0.80), r-meter (Explore: D11 scatter tool with Drag, Quadrants, Steps and Guess modes,
// presets including a Cards mode, unit change and swap axes, an r dial), r can mislead (Part 3: four stations: Anscombe's
// quartet, one point in charge, a restricted range, a common cause), Rank the study hours task (card slots). Model data are
// labelled; the guess sets are seeded and repeatable.
(function(){
"use strict";
var $ = MV.$;
function M(s){ return MV.m(s); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? clamp(v, lo, hi) : def; }
function obj(o){ return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }
function mi(s){ return String(s).replace(/-/g, MV.MINUS); }
// a number with up to dp decimals (zeros trimmed), true minus
function dN(v, dp){ dp = dp == null ? 2 : dp; var p = Math.pow(10, dp), s = (Math.round(v * p) / p).toFixed(dp); if (s.indexOf(".") >= 0) s = s.replace(/\.?0+$/, ""); if (s === "-0" || s === "") s = "0"; return mi(s); }
// signed: "+4", "−2", "0"
function sg(v, dp){ var t = dN(v, dp); return v > 1e-9 && t !== "0" ? "+" + t : t; }
// r to 2 decimals, always two places
function rTxt(r){ if (r == null) return "undefined"; var s = (Math.round(r * 100) / 100).toFixed(2); if (s === "-0.00") s = "0.00"; return mi(s); }
var XB = '<i class="pr-bar">x</i>', YB = '<i class="pr-bar">y</i>', RI = "<i>r</i>";
function swHTML(id, lab, on){ return '<button type="button" class="cc-switch pr-sw" role="switch" id="' + id + '" data-k="' + id + '" aria-checked="' + !!on + '"><span class="cc-track" aria-hidden="true"><span class="cc-knob"></span></span>' + lab + "</button>"; }

// ---------- statistics ----------
function stats(P){
  var n = P.length, o = { n:n, r:null };
  if (!n) return o;
  var mx = 0, my = 0; P.forEach(function(p){ mx += p[0]; my += p[1]; }); mx /= n; my /= n;
  var dx = [], dy = [], pr = [], sxy = 0, sxx = 0, syy = 0;
  P.forEach(function(p){ var a = p[0] - mx, b = p[1] - my; dx.push(a); dy.push(b); pr.push(a * b); sxy += a * b; sxx += a * a; syy += b * b; });
  o.mx = mx; o.my = my; o.dx = dx; o.dy = dy; o.pr = pr; o.sxy = sxy; o.sxx = sxx; o.syy = syy;
  if (n >= 2 && sxx > 1e-12 && syy > 1e-12) o.r = clamp(sxy / Math.sqrt(sxx * syy), -1, 1);
  return o;
}
function rOf(P){ return stats(P).r; }
// course strength words (course guide thresholds 0.67 / 0.33)
function strength(r){
  if (r == null) return "undefined (no spread)";
  var a = Math.abs(r), dir = r > 0 ? "positive" : "negative";
  if (a < 0.005) return "no linear correlation";
  if (a > 1 - 1e-9) return "perfect " + dir + " linear";
  return (a >= 0.67 - 1e-9 ? "strong " : a >= 0.33 - 1e-9 ? "moderate " : "weak ") + dir;
}

// ---------- @component D11 scatterSVG — scatter plot in SVG (tokens via CSS): ticks, grid, axis labels, optional mean lines
// with tinted '+'/'−' quadrants, a shaded x-band, point classes and labels, a selection ring, per-point product bars.
// geom(o) -> {X, Y, inv(svg, clientX, clientY) -> [x, y]}; scatterSVG(o) -> svg html. o: {x0, x1, y0, y1, w, h, xt, yt (tick
// lists [{v, t}]), xl, yl, pts:[{x, y, cls, lab, sel, bar}], mean:{x, y}, quads, band:{x0, x1}, aria, cls}
function geom(o){
  var W = o.w || 420, H = o.h || 330, L = o.L || 46, R = 14, T = 14, B = 42;
  var g = { W:W, H:H, L:L, R:R, T:T, B:B };
  g.X = function(x){ return L + (x - o.x0) / (o.x1 - o.x0) * (W - L - R); };
  g.Y = function(y){ return H - B - (y - o.y0) / (o.y1 - o.y0) * (H - T - B); };
  g.inv = function(svg, cx, cy){
    var rc = svg.getBoundingClientRect(); if (!rc.width) return null;
    var sx = (cx - rc.left) / rc.width * W, sy = (cy - rc.top) / rc.height * H;
    return [o.x0 + (sx - L) / (W - L - R) * (o.x1 - o.x0), o.y0 + (H - B - sy) / (H - T - B) * (o.y1 - o.y0)];
  };
  return g;
}
function ticks(a, b, step, lab){ var L = []; for (var v = a; v <= b + 1e-9; v += step) L.push({ v:v, t:lab ? lab(v) : dN(v, 2) }); return L; }
function f1(v){ return v.toFixed(1); }
function scatterSVG(o){
  var g = geom(o), X = g.X, Y = g.Y, W = g.W, H = g.H, L = g.L, R = g.R, T = g.T, B = g.B, h = "";
  var px0 = L, px1 = W - R, py0 = T, py1 = H - B;
  if (o.band) { var b0 = clamp(X(o.band.x0), px0, px1), b1 = clamp(X(o.band.x1), px0, px1); h += '<rect class="pr-band" x="' + f1(b0) + '" y="' + py0 + '" width="' + f1(Math.max(2, b1 - b0)) + '" height="' + (py1 - py0) + '"/>'; }
  if (o.mean && o.quads) {
    var mx = clamp(X(o.mean.x), px0, px1), my = clamp(Y(o.mean.y), py0, py1);
    h += '<rect class="pr-qp" x="' + f1(mx) + '" y="' + py0 + '" width="' + f1(px1 - mx) + '" height="' + f1(my - py0) + '"/>' +
      '<rect class="pr-qm" x="' + px0 + '" y="' + py0 + '" width="' + f1(mx - px0) + '" height="' + f1(my - py0) + '"/>' +
      '<rect class="pr-qp" x="' + px0 + '" y="' + f1(my) + '" width="' + f1(mx - px0) + '" height="' + f1(py1 - my) + '"/>' +
      '<rect class="pr-qm" x="' + f1(mx) + '" y="' + f1(my) + '" width="' + f1(px1 - mx) + '" height="' + f1(py1 - my) + '"/>';
    h += '<text class="pr-ql" x="' + (px1 - 8) + '" y="' + (py0 + 22) + '" text-anchor="end">+</text><text class="pr-ql" x="' + (px0 + 8) + '" y="' + (py0 + 22) + '">−</text>' +
      '<text class="pr-ql" x="' + (px0 + 8) + '" y="' + (py1 - 8) + '">+</text><text class="pr-ql" x="' + (px1 - 8) + '" y="' + (py1 - 8) + '" text-anchor="end">−</text>';
  }
  (o.xt || []).forEach(function(t){ var x = f1(X(t.v)); h += '<line class="pr-grid" x1="' + x + '" x2="' + x + '" y1="' + py0 + '" y2="' + py1 + '"/>' + (t.t ? '<text class="pr-tl" x="' + x + '" y="' + (py1 + 16) + '" text-anchor="middle">' + t.t + "</text>" : ""); });
  (o.yt || []).forEach(function(t){ var y = f1(Y(t.v)); h += '<line class="pr-grid" x1="' + px0 + '" x2="' + px1 + '" y1="' + y + '" y2="' + y + '"/>' + (t.t ? '<text class="pr-tl" x="' + (px0 - 6) + '" y="' + y + '" dy="4" text-anchor="end">' + t.t + "</text>" : ""); });
  h += '<line class="pr-axis" x1="' + px0 + '" x2="' + px1 + '" y1="' + py1 + '" y2="' + py1 + '"/><line class="pr-axis" x1="' + px0 + '" x2="' + px0 + '" y1="' + py0 + '" y2="' + py1 + '"/>';
  if (o.xl) h += '<text class="pr-al" x="' + ((px0 + px1) / 2) + '" y="' + (H - 6) + '" text-anchor="middle">' + o.xl + "</text>";
  if (o.yl) h += '<text class="pr-al" transform="translate(13 ' + ((py0 + py1) / 2) + ') rotate(-90)" text-anchor="middle">' + o.yl + "</text>";
  if (o.mean) {
    var mx2 = X(o.mean.x), my2 = Y(o.mean.y);
    if (mx2 >= px0 && mx2 <= px1) h += '<line class="pr-mean" x1="' + f1(mx2) + '" x2="' + f1(mx2) + '" y1="' + py0 + '" y2="' + py1 + '"/>';
    if (my2 >= py0 && my2 <= py1) h += '<line class="pr-mean" x1="' + px0 + '" x2="' + px1 + '" y1="' + f1(my2) + '" y2="' + f1(my2) + '"/>';
  }
  (o.pts || []).forEach(function(p){
    var x = X(p.x), y = Y(p.y);
    if (p.bar) { var bh = p.bar.h, top = bh > 0 ? y - 9 - bh : y + 9; h += '<rect class="' + (bh >= 0 ? "pr-bp" : "pr-bm") + '" x="' + f1(x - 4) + '" y="' + f1(top) + '" width="8" height="' + f1(Math.max(1, Math.abs(bh))) + '"/>' + (p.bar.t ? '<text class="pr-btl" x="' + f1(x + 8) + '" y="' + f1(bh > 0 ? y - 10 : y + 20) + '">' + p.bar.t + "</text>" : ""); }
    if (p.sel) h += '<circle class="pr-ring" cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + ((p.r || 6) + 5) + '"/>';
    h += '<circle class="pr-pt' + (p.cls ? " " + p.cls : "") + '" cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + (p.r || 6) + '"/>';
    if (p.lab) h += '<text class="pr-plab" x="' + f1(x + 9) + '" y="' + f1(y - 8) + '">' + p.lab + "</text>";
  });
  return '<svg class="pr-svg' + (o.cls ? " " + o.cls : "") + '" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + MV.esc(o.aria || "Scatter plot") + '">' + h + "</svg>";
}

// ---------- @component rDial — a −1 to 1 dial with a needle, ticks at ±0.33 and ±0.67 (the course's strength cut-offs) ----------
function dialSVG(v, sub){
  var cx = 120, cy = 118, R = 96, h = "";
  function pt(val, rad){ var th = Math.PI * (1 - (val + 1) / 2); return [cx + rad * Math.cos(th), cy - rad * Math.sin(th)]; }
  function arc(a, b, cls){ var p = pt(a, R), q = pt(b, R); return '<path class="' + cls + '" d="M' + f1(p[0]) + " " + f1(p[1]) + " A" + R + " " + R + " 0 0 1 " + f1(q[0]) + " " + f1(q[1]) + '"/>'; }
  h += arc(-1, -0.67, "pr-dz pr-dzs") + arc(-0.67, -0.33, "pr-dz pr-dzm") + arc(-0.33, 0.33, "pr-dz pr-dzw") + arc(0.33, 0.67, "pr-dz pr-dzm") + arc(0.67, 1, "pr-dz pr-dzs");
  [-1, -0.67, -0.33, 0, 0.33, 0.67, 1].forEach(function(t){
    var a = pt(t, R + 6), b = pt(t, R - 8), c = pt(t, R + 18), big = t === -1 || t === 0 || t === 1;
    h += '<line class="pr-dt" x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(b[0]) + '" y2="' + f1(b[1]) + '"/>' +
      '<text class="pr-dtl' + (big ? "" : " sm") + '" x="' + f1(c[0]) + '" y="' + f1(c[1] + 4) + '" text-anchor="middle">' + mi(t === -1 ? "-1" : t === 1 ? "1" : t === 0 ? "0" : String(t).replace(/^(-?)0/, "$1")) + "</text>";
  });
  if (v != null && isFinite(v)) { var e = pt(clamp(v, -1, 1), R - 14); h += '<line class="pr-needle" x1="' + cx + '" y1="' + cy + '" x2="' + f1(e[0]) + '" y2="' + f1(e[1]) + '"/>'; }
  h += '<circle class="pr-hub" cx="' + cx + '" cy="' + cy + '" r="6"/>';
  h += '<text class="pr-dval" x="' + cx + '" y="' + (cy + 34) + '" text-anchor="middle">' + (sub || (v == null ? "r undefined" : "r = " + rTxt(v))) + "</text>";
  return '<svg class="pr-dsvg" viewBox="0 0 240 160" role="img" aria-label="' + MV.esc(v == null ? "Dial: r is " + (sub ? "hidden" : "undefined") : "Dial reading r = " + rTxt(v).replace(MV.MINUS, "minus ")) + '">' + h + "</svg>";
}

// ---------- @component radioGroup (copied from MDM4U 19) — segmented control or chip row as a real radio group ----------
function radios(host, o){
  var val = String(o.value), locked = false;
  function off(id){ return locked || !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = off(val) || ids.indexOf(val) < 0 ? ids.filter(function(id){ return !off(id); })[0] : val;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + id + '"' + (off(id) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector('[tabindex="0"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (off(id)) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(b.dataset.rg);
    if (i < 0) i = 0;
    for (var k = 0; k < ids.length; k++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); var nb = host.querySelector('[data-rg="' + ids[i] + '"]'); if (nb) nb.focus(); return; } }
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, refresh:paint };
}

// ---------- @component cardSlots — tap-to-place number cards in labelled slots (Tab + Enter works; each card once) ----------
// slotsHTML({id, labels, vals:[v|null], cards, sel:{from:"pool"|index, v}, slotName}) ; slotsClick(st, button) mutates
// st.vals / st.sel and returns "sel" | "place" | "clear" | null.
function slotsHTML(o){
  var pool = o.cards.filter(function(c){ return o.vals.indexOf(c) < 0; }), sel = o.sel;
  var h = '<div class="pr-cards" role="group" aria-label="Cards to place"><span class="rg-lab">Cards:</span>' + pool.map(function(c){
    var on = !!(sel && sel.from === "pool" && sel.v === c);
    return '<button type="button" class="pr-card" data-cs="' + o.id + '" data-card="' + c + '" data-k="' + o.id + "c" + c + '" aria-pressed="' + on + '">' + c + "</button>"; }).join("") +
    (pool.length ? "" : '<span class="tiny muted">All placed. Tap a slot, then another slot, to swap two cards.</span>') + "</div>";
  h += '<div class="pr-slots" role="group" aria-label="' + MV.esc(o.slotName || "Slots") + '">' + o.labels.map(function(lab, i){
    var v = o.vals[i], on = !!(sel && sel.from === i);
    return '<button type="button" class="pr-slot' + (v == null ? " empty" : "") + '" data-cs="' + o.id + '" data-slot="' + i + '" data-k="' + o.id + "s" + i + '" aria-pressed="' + on + '" aria-label="' + MV.esc(MV.plain(lab) + ": " + (v == null ? "empty" : "card " + v)) + '">' +
      '<span class="pr-slab">' + lab + '</span><span class="pr-sval">' + (v == null ? "—" : v) + "</span></button>"; }).join("") + "</div>" +
    '<div class="q-actions"><button type="button" class="btn ghost sm" data-cs="' + o.id + '" data-csclear="1" data-k="' + o.id + 'clr">Clear the slots</button></div>';
  return h;
}
function slotsClick(st, b){
  if (b.dataset.csclear) { st.vals = st.vals.map(function(){ return null; }); st.sel = null; return "clear"; }
  if (b.dataset.card != null) { var v = +b.dataset.card; st.sel = st.sel && st.sel.from === "pool" && st.sel.v === v ? null : { from:"pool", v:v }; return "sel"; }
  if (b.dataset.slot != null) {
    var i = +b.dataset.slot, cur = st.vals[i];
    if (st.sel) {
      var s = st.sel;
      if (s.from === "pool") st.vals[i] = s.v;
      else if (s.from !== i) { st.vals[s.from] = cur; st.vals[i] = s.v; }
      st.sel = null; return "place";
    }
    if (cur != null) { st.sel = { from:i, v:cur }; return "sel"; }
  }
  return null;
}
function cleanVals(a, cards, n){
  var seen = {}; a = Array.isArray(a) && a.length === n ? a : [];
  var out = []; for (var i = 0; i < n; i++) { var v = a[i]; v = v == null ? null : +v; if (v != null && (cards.indexOf(v) < 0 || seen[v])) v = null; if (v != null) seen[v] = 1; out.push(v); }
  return out;
}

// ---------- @component stepsTable — the deviation table (x, y, deviations, products, squares, sums; optional z-scores) ----------
function stepsHTML(P, o){
  o = o || {}; var s = stats(P), xs = o.xs || 1;
  if (s.n < 2) return '<p class="tiny muted">Place at least two points to see the table.</p>';
  var head = [M("x"), M("y"), M("x") + " − " + XB, M("y") + " − " + YB, "Product", "(" + M("x") + " − " + XB + ")²", "(" + M("y") + " − " + YB + ")²"];
  var sx = Math.sqrt(s.sxx / (s.n - 1)), sy = Math.sqrt(s.syy / (s.n - 1)), zOk = o.z && sx > 0 && sy > 0, szz = 0;
  if (zOk) head = head.concat([M("z_x"), M("z_y"), M("z_x z_y")]);
  var rows = P.map(function(p, i){
    var row = [dN(p[0], 2), dN(p[1], 2), dN(s.dx[i], 2), dN(s.dy[i], 2), "<strong>" + dN(s.pr[i], 2) + "</strong>", dN(s.dx[i] * s.dx[i], 2), dN(s.dy[i] * s.dy[i], 2)];
    if (zOk) { var zx = s.dx[i] / sx, zy = s.dy[i] / sy; szz += zx * zy; row = row.concat([dN(zx, 2), dN(zy, 2), dN(zx * zy, 2)]); }
    return row;
  });
  var sum = ["<strong>Σ</strong>", "", "", "", "<strong>" + dN(s.sxy, 2) + "</strong>", "<strong>" + dN(s.sxx, 2) + "</strong>", "<strong>" + dN(s.syy, 2) + "</strong>"];
  if (zOk) sum = sum.concat(["", "", "<strong>" + dN(szz, 2) + "</strong>"]);
  rows.push(sum);
  var h = '<p class="tiny pr-means">' + XB + " = " + dN(s.mx, 2) + ", " + YB + " = " + dN(s.my, 2) + (xs !== 1 ? " (" + M("x") + " in minutes)" : "") + "</p>" +
    MV.tableHTML({ head:head, rows:rows, caption:"Deviation table" });
  h += '<p class="pr-form">' + RI + " = " + "Σproducts ÷ √(Σ" + M("x") + "-squares × Σ" + M("y") + "-squares) = " + dN(s.sxy, 2) + " ÷ √(" + dN(s.sxx, 2) + " × " + dN(s.syy, 2) + ") = <strong>" + rTxt(s.r) + "</strong></p>";
  if (zOk) h += '<p class="pr-form">' + RI + " = Σ" + M("z_x z_y") + " ÷ (" + M("n") + " − 1) = " + dN(szz, 2) + " ÷ " + (s.n - 1) + " = <strong>" + rTxt(s.r) + "</strong></p>";
  return h;
}

// ---------- @component productBars — each point's deviation product as a signed bar, with the running total ----------
function barsHTML(P, xs){
  var s = stats(P); if (s.n < 2) return "";
  var mx = Math.max.apply(null, s.pr.map(Math.abs).concat([1e-9]));
  return '<div class="pr-bars" role="list" aria-label="Deviation products">' + '<p class="pr-bh">Each point’s product (' + M("x") + " − " + XB + ")(" + M("y") + " − " + YB + ")</p>" + P.map(function(p, i){
    var v = s.pr[i], w = Math.abs(v) / mx * 50;
    return '<div class="pr-brow" role="listitem"><span class="pr-blab">(' + dN(p[0] * xs, 2) + ", " + dN(p[1], 2) + ')</span><span class="pr-btrack" aria-hidden="true"><i class="' + (v >= 0 ? "pr-bpos" : "pr-bneg") + '" style="' + (v >= 0 ? "left:50%" : "right:50%") + ";width:" + w.toFixed(1) + '%"></i></span><span class="pr-bval">' + sg(v * xs, 2) + "</span></div>";
  }).join("") + '<div class="pr-brow pr-btot" role="listitem"><span class="pr-blab">Total</span><span class="pr-btrack" aria-hidden="true"></span><span class="pr-bval">' + sg(s.sxy * xs, 2) + "</span></div></div>";
}

// ---------- Explore: r-meter (D11) ----------
var PRE = { start:[[1, 8], [2, 10], [3, 9], [4, 12], [5, 11]], moderate:[[1, 3], [2, 1], [3, 4], [4, 2], [5, 5]], u:[[1, 10], [2, 5], [3, 2], [4, 1], [5, 2], [6, 5], [7, 10]] };
var CARDS = [8, 9, 10, 11, 12], TC1_OK = ["8,9,10,12,11", "8,9,11,10,12", "8,10,9,11,12", "9,8,10,11,12"];
// Guess the r: seeded model sets (same on every device)
function guessSet(k){
  var g = MV.mdm.seededRandom("mdm35-guess-" + k), sign = g() < 0.5 ? -1 : 1, noise = [0.6, 1.6, 2.8, 4.5, 7][g.int(5)], P = [];
  for (var i = 0; i < 10; i++) { var x = 1 + g.int(14), y = Math.round(7.5 + sign * 0.75 * (x - 7.5) + noise * (g() * 2 - 1)); P.push([x, clamp(y, 0, 15)]); }
  if (rOf(P) == null) P[0] = [1, 1];
  return P;
}
function samePts(a, b){ return a.length === b.length && a.every(function(p, i){ return p[0] === b[i][0] && p[1] === b[i][1]; }); }

function explore(host, api){
  var S = api.S;
  function applyPreset(k){ S.preset = k; if (PRE[k]) S.pts = PRE[k].map(function(p){ return p.slice(); }); S.sel = 0; if (k === "cards") S.cards = [null, null, null, null, null]; }
  (function sanitize(){
    if (["drag", "quad", "steps", "guess"].indexOf(S.mode) < 0) S.mode = "drag";
    if (["start", "moderate", "u", "cards", ""].indexOf(S.preset) < 0) S.preset = "start";
    if (!Array.isArray(S.pts) || !S.pts.length || S.pts.length > 10) applyPreset("start");
    S.pts = S.pts.map(function(p){ p = Array.isArray(p) ? p : [0, 0]; return [clampI(p[0], 0, 15, 0), clampI(p[1], 0, 15, 0)]; });
    S.sel = clampI(S.sel, 0, S.pts.length - 1, 0);
    S.unit = S.unit === 60 ? 60 : 1; S.z = !!S.z; S.fill = !!S.fill;
    S.cards = cleanVals(S.cards, CARDS, 5);
    S.tc2 = obj(S.tc2); if (!Array.isArray(S.tc2.p) || S.tc2.p.length !== 5) S.tc2.p = ["", "", "", "", ""];
    ["s", "sxx", "syy", "r"].forEach(function(k){ if (typeof S.tc2[k] !== "string") S.tc2[k] = ""; });
    S.g = obj(S.g); S.g.k = clampI(S.g.k, 0, 9999, 0); S.g.v = clamp(isFinite(+S.g.v) ? Math.round(+S.g.v * 20) / 20 : 0, -1, 1); S.g.shown = !!S.g.shown;
  })();
  var pv = {}, anim = null, msg = "", dialV = null, dialStop = null, csel = null, drag = null;

  host.innerHTML =
    '<div class="pr-top"><div id="pr-pre"></div><div id="pr-mode"></div></div>' +
    '<div class="pg pr-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="pr-box" id="pr-box" tabindex="0" role="group" aria-label="Scatter plot. Arrow keys move the selected point by 1."></div>' +
      '<p class="tiny muted pr-modeltag"><span class="mdm-model">model data</span> <span id="pr-cap"></span></p>' +
      '<div id="pr-bars"></div><div id="pr-steps" class="pr-steps"></div></div>' +
    '<div class="pg-ctrl"><div id="pr-ctrl"></div><p class="tiny pr-msg" id="pr-msg" aria-live="polite"></p></div>' +
    '<div class="pg-read"><div id="pr-dial" class="pr-dial"></div><dl class="read" id="pr-read" aria-live="polite"></dl></div></div>';
  var box = $("#pr-box", host);
  var preR = radios($("#pr-pre", host), { label:"Presets", options:[{ id:"start", t:"Start" }, { id:"moderate", t:"Moderate set" }, { id:"u", t:"U-shape" }, { id:"cards", t:"Cards" }], value:S.preset, cls:"chips",
    disabled:function(){ return S.mode === "guess"; },
    onChange:function(v){ user(); applyPreset(v); msg = ""; S.fill = false; save(); render(); MV.changed(); } });
  var modeR = radios($("#pr-mode", host), { label:"Mode", options:[{ id:"drag", t:"Drag" }, { id:"quad", t:"Quadrants" }, { id:"steps", t:"Steps" }, { id:"guess", t:"Guess the " + RI }], value:S.mode, cls:"seg",
    onChange:function(v){ user(); S.mode = v; msg = ""; save(); render(); MV.changed(); } });

  function save(){ api.save(); }
  function guessing(){ return S.mode === "guess"; }
  function data(){
    if (guessing()) return guessSet(S.g.k);
    if (S.preset === "cards") { var L = []; S.cards.forEach(function(y, i){ if (y != null) L.push([i + 1, y]); }); return L; }
    return S.pts;
  }
  function xs(){ return guessing() ? 1 : S.unit; }
  function shown(){ return data().map(function(p){ return [p[0] * xs(), p[1]]; }); }
  function hidden(){ return pv.hide || (guessing() && !S.g.shown); }
  function user(){ cancelAnim(); pv = {}; MV.banner("", ""); }

  // --- animation bookkeeping ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], stops:[], fin:fin || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function cancelAnim(){
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} });
    pv = {}; if (a.fin) { var f = a.fin; a.fin = null; f(); }
    render(); MV.changed();
  }
  function endAnim(){ var a = anim; anim = null; if (a && a.fin) { var f = a.fin; a.fin = null; f(); } }

  // --- dial ---
  function stopDial(){ if (dialStop) { dialStop(); dialStop = null; } }
  function dialTo(v, instant){
    if (v == null || dialV == null || instant || MV.reduceMotion) { stopDial(); dialV = v; paintDial(); return; }
    if (Math.abs(v - dialV) < 1e-9) { paintDial(); return; }
    stopDial(); var from = dialV;
    dialStop = MV.tween({ dur:650, step:function(t){ dialV = from + (v - from) * t; paintDial(); }, done:function(){ dialStop = null; dialV = v; paintDial(); } });
  }
  function paintDial(){ $("#pr-dial", host).innerHTML = hidden() ? dialSVG(null, "r = ?") : dialSVG(dialV); }

  // --- plot ---
  function view(){ var u = xs(); return { x0:0, x1:15, y0:0, y1:15, xt:ticks(0, 15, 1, function(v){ return u === 60 ? (v % 2 ? String(v * 60) : "") : String(v); }), yt:ticks(0, 15, 1, function(v){ return v % 3 ? "" : String(v); }) }; }
  function paintPlot(){
    var P = pv.pts || data(), s = stats(P), v = view(), quad = S.mode === "quad" && s.n >= 2 && !hidden();
    var mxp = Math.max.apply(null, (s.pr || [1]).map(Math.abs).concat([1e-9]));
    v.pts = P.map(function(p, i){
      var o = { x:p[0], y:p[1], sel:!guessing() && S.preset !== "cards" && i === S.sel && !pv.pts };
      if (quad && s.pr) o.bar = { h:s.pr[i] / mxp * 34, t:sg(s.pr[i] * xs(), 2) };
      return o;
    });
    if (quad) { v.mean = { x:s.mx, y:s.my }; v.quads = true; }
    v.xl = guessing() ? "x" : S.unit === 60 ? "x (minutes)" : "x (hours)"; v.yl = "y";
    v.aria = "Scatter plot of " + P.length + " points" + (P.length ? ": " + P.map(function(p){ return "(" + dN(p[0] * xs(), 2) + ", " + dN(p[1], 2) + ")"; }).join(", ") : "") + (quad ? ". Mean lines at x = " + dN(s.mx * xs(), 2) + " and y = " + dN(s.my, 2) + " split the plot into + and − quadrants" : "") + ".";
    if (pv.flash) v.cls = "pr-flash";
    box.innerHTML = scatterSVG(v);
    $("#pr-cap", host).textContent = guessing() ? "Guess the r: data set " + (S.g.k + 1) : S.preset === "cards" ? "Cards: y-cards at x = 1 to 5" : "";
  }
  function readRows(){
    var P = data(), s = stats(P), u = xs(), hid = hidden();
    if (s.n < 2) return [["n", String(s.n)], [RI, '<span class="muted">needs at least two points</span>']];
    var big = 0; s.pr.forEach(function(v, i){ if (Math.abs(v) > Math.abs(s.pr[big]) + 1e-9) big = i; });
    return [["n", String(s.n)], [XB + ", " + YB, dN(s.mx * u, 2) + ", " + dN(s.my, 2)],
      ["Σ(" + M("x") + " − " + XB + ")(" + M("y") + " − " + YB + ")", hid ? "?" : dN(s.sxy * u, 2)],
      ["Σ(" + M("x") + " − " + XB + ")², Σ(" + M("y") + " − " + YB + ")²", hid ? "?" : dN(s.sxx * u * u, 2) + ", " + dN(s.syy, 2)],
      [RI, hid ? "?" : "<strong>" + rTxt(s.r) + "</strong>"], ["Strength", hid ? "?" : strength(s.r)],
      ["Biggest contributor", hid ? "?" : "(" + dN(P[big][0] * u, 2) + ", " + dN(P[big][1], 2) + "): " + sg(s.pr[big] * u, 2)]];
  }
  function paintRead(){ $("#pr-read", host).innerHTML = MV.readoutHTML(readRows()); }
  function paintMsg(){ $("#pr-msg", host).innerHTML = msg; }
  function fillHTML(){
    var P = data(), s = stats(P), t = S.tc2;
    function inp(f, val, lab){ return '<input class="numin pr-fin" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" data-f="' + f + '" data-k="pf' + f + '" aria-label="' + MV.esc(lab) + '" value="' + MV.esc(val) + '">'; }
    var rows = P.map(function(p, i){ return [String(p[0]), String(p[1]), dN(s.dx[i], 2), dN(s.dy[i], 2), inp("p" + i, t.p[i] || "", "Product for (" + p[0] + ", " + p[1] + ")")]; });
    rows.push(["<strong>Σ</strong>", "", "", "", inp("s", t.s, "Sum of the products")]);
    return '<p class="tiny">Fill in each product (' + M("x") + " − " + XB + ")(" + M("y") + " − " + YB + "), the sums and " + RI + ", then press <strong>Check challenge</strong> (Explore challenge 2).</p>" +
      MV.tableHTML({ head:[M("x"), M("y"), M("x") + " − " + XB, M("y") + " − " + YB, "Product"], rows:rows, caption:"Deviation table to fill in" }) +
      '<div class="pr-frow"><label>Σ(' + M("x") + " − " + XB + ")² = " + inp("sxx", t.sxx, "Sum of the squared x-deviations") + "</label><label>Σ(" + M("y") + " − " + YB + ")² = " + inp("syy", t.syy, "Sum of the squared y-deviations") + "</label><label>" + RI + " = " + inp("r", t.r, "r") + "</label></div>";
  }
  function paintBelow(){
    var P = data(), bars = $("#pr-bars", host), st = $("#pr-steps", host);
    bars.innerHTML = S.mode === "quad" && !hidden() ? barsHTML(pv.pts || P, xs()) : "";
    if (S.mode === "steps") {
      MV.keepFocus(st, function(){ st.innerHTML = '<div class="pr-swrow">' + swHTML("pr-z", M("z") + "-score columns", S.z) + swHTML("pr-fill", "Fill in the table myself", S.fill) + "</div>" +
        (S.fill ? (data().length >= 2 ? fillHTML() : "") : stepsHTML(shown(), { z:S.z, xs:xs() })); });
    } else st.innerHTML = "";
  }
  function ctrlHTML(){
    var h = "", P = data(), busy = !!anim;
    if (guessing()) {
      var s = stats(P);
      h += '<label class="slider pr-gsl"><span class="slider-top"><span>Your guess for ' + RI + '</span><output id="pr-gout">' + rTxt(S.g.v) + '</output></span><input type="range" id="pr-g" data-k="prg" min="-1" max="1" step="0.05" value="' + S.g.v + '" aria-valuetext="' + rTxt(S.g.v).replace(MV.MINUS, "minus ") + '"' + (S.g.shown ? " disabled" : "") + "></label>" +
        '<div class="q-actions"><button type="button" class="btn primary sm" id="pr-reveal" data-k="prrev"' + (S.g.shown ? " disabled" : "") + ">Reveal " + RI + '</button><button type="button" class="btn sm" id="pr-new" data-k="prnew">New data set</button></div>';
      if (S.g.shown) { var gap = Math.abs(S.g.v - s.r); h += MV.fbHTML(gap <= 0.1 + 1e-9 ? "good" : "", "Your guess " + rTxt(S.g.v) + "; actual " + RI + " = " + rTxt(s.r) + ". Off by " + (Math.round(gap * 100) / 100).toFixed(2) + (gap <= 0.1 + 1e-9 ? ": a close read." : ". Look at how tightly the points hug a line, and which way it slopes.")); }
      return h;
    }
    if (S.preset === "cards") {
      h += '<p class="tiny">Tap a ' + M("y") + "-card, then tap the slot for its " + M("x") + "-value.</p>" + slotsHTML({ id:"pc", labels:[1, 2, 3, 4, 5].map(function(x){ return M("x") + " = " + x; }), vals:S.cards, cards:CARDS, sel:csel, slotName:"x-value slots" });
    } else {
      var n = S.pts.length, p = S.pts[S.sel] || [0, 0];
      h += '<div class="pr-pick" role="group" aria-label="Selected point"><button type="button" class="btn ghost sm" id="pr-prev" data-k="prprev" aria-label="Previous point"' + (n < 2 || busy ? " disabled" : "") + '>◀</button><span class="pr-pickt">Point ' + (S.sel + 1) + " of " + n + ": (" + dN(p[0] * S.unit, 2) + ", " + p[1] + ')</span><button type="button" class="btn ghost sm" id="pr-next" data-k="prnext" aria-label="Next point"' + (n < 2 || busy ? " disabled" : "") + ">▶</button></div>" +
        '<div class="pr-move" role="group" aria-label="Move the selected point">' + [["←", -1, 0, "left"], ["→", 1, 0, "right"], ["↑", 0, 1, "up"], ["↓", 0, -1, "down"]].map(function(a){ return '<button type="button" class="btn ghost sm" data-mvp="' + a[1] + "," + a[2] + '" data-k="prmv' + a[3] + '" aria-label="Move ' + a[3] + '"' + (busy ? " disabled" : "") + ">" + a[0] + "</button>"; }).join("") + "</div>" +
        '<div class="q-actions"><button type="button" class="btn sm" id="pr-add" data-k="pradd"' + (n >= 10 || busy ? " disabled" : "") + '>Add a point</button><button type="button" class="btn sm" id="pr-del" data-k="prdel"' + (n <= 2 || busy ? " disabled" : "") + ">Remove this point</button></div>" +
        '<p class="tiny muted">Drag a point on the plot, or focus the plot and use the arrow keys (up to 10 points, 0–15 on each axis).</p>';
    }
    h += '<div class="q-actions pr-tools"><button type="button" class="btn sm" id="pr-unit" data-k="prunit" aria-pressed="' + (S.unit === 60) + '"' + (busy ? " disabled" : "") + ">" + (S.unit === 60 ? "Back to hours" : "Change " + M("x") + " to minutes (× 60)") + "</button>" +
      '<button type="button" class="btn sm" id="pr-swap" data-k="prswap"' + (S.preset === "cards" || busy ? " disabled" : "") + ">Swap axes</button></div>";
    return h;
  }
  function paintCtrl(){ var c = $("#pr-ctrl", host); MV.keepFocus(c, function(){ c.innerHTML = ctrlHTML(); }); }
  function render(){
    preR.set(S.preset); preR.refresh(); modeR.set(S.mode);
    paintPlot(); paintRead(); paintBelow(); paintCtrl(); paintMsg();
    if (!anim) { var r = rOf(data()); if (dialV == null || !dialStop) dialTo(r, true); }
    paintDial();
  }
  function after(){ save(); var r = rOf(data()); paintPlot(); paintRead(); paintBelow(); paintCtrl(); paintMsg(); dialTo(r, true); MV.changed(); }

  // --- dragging and keys ---
  function canDrag(){ return !guessing() && S.preset !== "cards" && !anim; }
  function setPt(i, x, y){ x = clamp(Math.round(x), 0, 15); y = clamp(Math.round(y), 0, 15); var p = S.pts[i]; if (p[0] === x && p[1] === y) return false; S.pts[i] = [x, y]; if (S.preset !== "") { S.preset = ""; } return true; }
  box.addEventListener("pointerdown", function(e){
    if (!canDrag()) { if (S.preset === "cards" && !guessing()) { msg = "In Cards mode, move the cards, not the points."; paintMsg(); } return; }
    var svg = box.querySelector("svg"); if (!svg) return;
    var q = geom(view()).inv(svg, e.clientX, e.clientY); if (!q) return;
    var best = -1, bd = 1.1; S.pts.forEach(function(p, i){ var d = Math.hypot(p[0] - q[0], p[1] - q[1]); if (d < bd) { bd = d; best = i; } });
    if (best < 0) return;
    user(); S.sel = best; drag = { id:e.pointerId };
    try { box.setPointerCapture(e.pointerId); } catch (err) {}
    e.preventDefault(); msg = ""; render();
  });
  box.addEventListener("pointermove", function(e){
    if (!drag || drag.id !== e.pointerId) return;
    var svg = box.querySelector("svg"), q = svg && geom(view()).inv(svg, e.clientX, e.clientY); if (!q) return;
    if (setPt(S.sel, q[0], q[1])) { paintPlot(); paintRead(); paintBelow(); dialTo(rOf(data()), true); }
  });
  function endDrag(e){ if (!drag || drag.id !== e.pointerId) return; drag = null; after(); }
  box.addEventListener("pointerup", endDrag); box.addEventListener("pointercancel", endDrag);
  function movePt(dx, dy){ if (!canDrag()) return; user(); var p = S.pts[S.sel]; if (setPt(S.sel, p[0] + dx, p[1] + dy)) after(); }
  box.addEventListener("keydown", function(e){
    var k = { ArrowLeft:[-1, 0], ArrowRight:[1, 0], ArrowUp:[0, 1], ArrowDown:[0, -1] }[e.key]; if (!k) return;
    if (!canDrag()) return;
    e.preventDefault(); movePt(k[0], k[1]);
  });

  // --- controls ---
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest(".rg") || !host.contains(b)) return;
    if (b.dataset.cs === "pc") {
      user(); var st = { vals:S.cards, sel:csel }, r = slotsClick(st, b); S.cards = st.vals; csel = st.sel;
      if (r) { msg = ""; after(); } return;
    }
    if (b.dataset.mvp) { var d = b.dataset.mvp.split(","); movePt(+d[0], +d[1]); return; }
    if (b.id === "pr-prev" || b.id === "pr-next") { user(); S.sel = (S.sel + (b.id === "pr-next" ? 1 : -1) + S.pts.length) % S.pts.length; save(); render(); return; }
    if (b.id === "pr-add") {
      user(); if (S.pts.length >= 10) return;
      var used = {}; S.pts.forEach(function(p){ used[p[0] + "," + p[1]] = 1; });
      var cand = [[7, 7], [8, 8], [6, 6], [9, 9], [7, 8], [8, 7]].filter(function(p){ return !used[p[0] + "," + p[1]]; })[0] || [0, 0];
      S.pts.push(cand); S.sel = S.pts.length - 1; S.preset = ""; msg = "Added a point at (" + dN(cand[0] * S.unit, 2) + ", " + cand[1] + "). Drag it or use the arrows."; after(); return;
    }
    if (b.id === "pr-del") { user(); if (S.pts.length <= 2) return; S.pts.splice(S.sel, 1); S.sel = Math.min(S.sel, S.pts.length - 1); S.preset = ""; msg = ""; after(); return; }
    if (b.id === "pr-unit") { user(); S.unit = S.unit === 60 ? 1 : 60; msg = S.unit === 60 ? "Every " + M("x") + " is now in minutes (hours × 60)." : ""; after(); return; }
    if (b.id === "pr-swap") { user(); swapAnim(null); return; }
    if (b.id === "pr-reveal") { user(); S.g.shown = true; save(); render(); dialTo(rOf(data())); return; }
    if (b.id === "pr-new") { user(); S.g.k++; S.g.shown = false; S.g.v = 0; save(); render(); return; }
    if (b.id === "pr-z") { S.z = !S.z; save(); paintBelow(); return; }
    if (b.id === "pr-fill") { S.fill = !S.fill; save(); paintBelow(); MV.changed(); return; }
  });
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.id === "pr-g") { S.g.v = Math.round(+t.value * 20) / 20; var o = $("#pr-gout", host); if (o) o.textContent = rTxt(S.g.v); t.setAttribute("aria-valuetext", rTxt(S.g.v).replace(MV.MINUS, "minus ")); save(); return; }
    if (t.dataset && t.dataset.f) { var f = t.dataset.f; if (f.charAt(0) === "p" && f.length === 2) S.tc2.p[+f.charAt(1)] = t.value; else S.tc2[f] = t.value; save(); }
  });

  // swap x and y; animated reflection across the diagonal
  function swapAnim(fin){
    var from = S.pts.map(function(p){ return p.slice(); }), to = from.map(function(p){ return [p[1], p[0]]; });
    function finish(){ S.pts = to; S.preset = ""; pv = {}; save(); render(); MV.changed(); }
    if (MV.reduceMotion) { finish(); if (fin) fin(); return; }
    newAnim(function(){ S.pts = to; S.preset = ""; save(); if (fin) fin(); }); var a = anim;
    paintCtrl();
    var stop = MV.tween({ dur:1000, step:function(t){ pv.pts = from.map(function(p, i){ return [p[0] + (to[i][0] - p[0]) * t, p[1] + (to[i][1] - p[1]) * t]; }); paintPlot(); }, done:function(){
      if (anim !== a) return; pv = {}; S.pts = to; S.preset = ""; save(); endAnim(); render(); MV.changed();
    } });
    a.stops.push(stop);
  }

  render();

  // --- predictions ---
  function startPred(p){
    cancelAnim(); msg = ""; csel = null;
    var st = p.start || {};
    applyPreset(st.preset || "start"); S.mode = st.mode || "drag"; S.unit = 1; S.fill = false;
    pv = p.id === "p4" ? { hide:true } : {};
    save(); render();
  }
  function runPred(p, done){
    if (p.id === "p1") { pv = {}; swapAnim(done); return; }
    newAnim(done);
    if (p.id === "p2") {
      later(MV.reduceMotion ? 0 : 400, function(){ S.unit = 60; pv = { flash:true }; save(); render(); later(MV.reduceMotion ? 0 : 1100, function(){ pv = {}; render(); endAnim(); MV.changed(); }); });
      return;
    }
    if (p.id === "p3") {
      S.mode = "quad"; S.pts.push([10, 10]); S.sel = S.pts.length - 1; S.preset = ""; save();
      var base = S.pts.slice(0, 5);
      pv = { pts:base.concat([[10, 15]]) }; paintPlot(); paintBelow();
      var stop = MV.tween({ dur:900, step:function(t){ pv.pts = base.concat([[10, 15 - 5 * t]]); paintPlot(); }, done:function(){
        pv = {}; render(); dialV = 0.5; dialTo(rOf(data()));
        later(MV.reduceMotion ? 0 : 800, function(){ endAnim(); MV.changed(); });
      } });
      anim.stops.push(stop);
      return;
    }
    if (p.id === "p4") {
      S.mode = "quad"; save(); pv = {}; render(); dialTo(rOf(data()), true);
      later(MV.reduceMotion ? 0 : 900, function(){ endAnim(); MV.changed(); });
      return;
    }
    endAnim();
  }

  // --- challenges ---
  function num(s){ s = String(s == null ? "" : s).trim(); if (!s) return null; var r = MV.parseNum(s); return r && r.length === 1 && isFinite(r[0]) ? r[0] : null; }
  function chal(id){
    var R = function(m){ return { ok:false, msg:MV.md(m) }; };
    if (id === "tc1") {
      if (S.preset !== "cards" || guessing()) return R("Choose the <strong>Cards</strong> preset (in Drag, Quadrants or Steps mode).");
      if (S.cards.some(function(v){ return v == null; })) return R("Place all five `y`-cards, one at each `x`.");
      var key = S.cards.join(",");
      if (TC1_OK.indexOf(key) >= 0) return { ok:true };
      if (key === "8,9,10,11,12") return R("That’s a perfect line (`r` = 1). Swap one neighbouring pair.");
      var r1 = rOf(data());
      if (Math.abs(r1 - 0.8) < 1e-9) return R("One swap too many. (`r` = 0.80.)");
      return R("`r` = " + rTxt(r1) + ". You need a product sum of 9, so `r` = 0.90.");
    }
    if (id === "tc2") {
      if (guessing() || S.preset === "cards" || !samePts(S.pts, PRE.start)) return R("Press <strong>Start</strong> to load the start state.");
      if (S.unit !== 1) return R("Switch `x` back to hours.");
      if (S.mode !== "steps" || !S.fill) return R("Use <strong>Steps</strong> mode and turn on <strong>Fill in the table myself</strong>.");
      var t = S.tc2, want = [4, 0, 0, 2, 2], raw = [8, 20, 27, 48, 55], got = t.p.map(num);
      if (got.some(function(v){ return v == null; })) return R("Fill in all five products.");
      if (got.every(function(v, i){ return v === raw[i]; }) || num(t.s) === 158) return R("Use deviations from the means, not raw values.");
      for (var i = 0; i < 5; i++) if (Math.abs(got[i] - want[i]) > 1e-9) { var P0 = PRE.start[i]; return R("Check the product for (" + P0[0] + ", " + P0[1] + "): multiply its two deviations, " + dN(P0[0] - 3, 2) + " and " + dN(P0[1] - 10, 2) + "."); }
      var sv = num(t.s); if (sv == null || Math.abs(sv - 8) > 1e-9) return R("Add the five products for the Σ row.");
      var a = num(t.sxx), b = num(t.syy);
      if (a == null || b == null) return R("Fill in both sums of squared deviations.");
      if (Math.abs(a - 10) > 1e-9 || Math.abs(b - 10) > 1e-9) return R("Square each deviation, then add: both sums of squares come to the same value here.");
      var rv = num(t.r); if (rv == null) return R("Enter `r`.");
      if (Math.abs(rv - 0.8) < 1e-9) return { ok:true };
      if (Math.abs(rv - 0.08) < 1e-9) return R("You divided by 10 × 10. Take the square root of the product of the sums.");
      if (Math.abs(rv - 8) < 1e-9) return R("Divide the sum of products by √(10 × 10).");
      if (Math.abs(rv - 0.4) < 1e-9) return R("The denominator is √(10 × 10), not 10 + 10.");
      return R("`r` = Σproducts ÷ √(Σ`x`-squares × Σ`y`-squares).");
    }
    if (id === "tc3") {
      if (guessing() || S.preset === "cards") return R("Leave Cards and Guess, press <strong>Moderate set</strong>, then add one point.");
      if (S.pts.length < 6 || !samePts(S.pts.slice(0, 5), PRE.moderate)) return R("Press <strong>Moderate set</strong>, then add <strong>one</strong> point.");
      if (S.pts.length > 6) return R("Add only <strong>one</strong> point: remove the extras.");
      var q = S.pts[5];
      if (q[0] > 10 || q[1] > 10) return R("Keep the new point’s coordinates between 0 and 10.");
      var r3 = rOf(S.pts);
      if (r3 != null && r3 >= 0.67 - 1e-12) return { ok:true };
      if (q[0] === 3 && q[1] === 3) return R("A point at the means adds nothing; its product is 0.");
      if (q[0] === 10 && q[1] === 0) return R("That point is in a ‘−’ quadrant; `r` drops to about −0.42.");
      if (q[0] === 7 && q[1] === 5) return R("Close: `y` needs to be 6 or more when `x` is 7.");
      return R("`r` = " + rTxt(r3) + ", not yet strong (≥ 0.67). Put the point far out in a ‘+’ quadrant.");
    }
    return { ok:false };
  }
  return { predict:{ start:startPred, run:runPred }, challenge:function(id){ return chal(id); } };
}

// ---------- hero: five points, mean lines and tinted quadrants, bars to a running total, the dial turns to 0.80 ----------
function hero(f){
  var el = $("#pr-hero"); if (!el) return;
  var P = PRE.start, PR = [4, 0, 0, 2, 2], st = { k:0, mean:false, bars:0, dial:null }, cap = f.cap;
  var V = { x0:0, x1:6, y0:6, y1:13, w:340, h:300, L:40, xt:ticks(0, 6, 1, String), yt:ticks(6, 13, 1, String), xl:"x", yl:"y" };
  function paint(){
    var v = Object.assign({}, V), tot = 0;
    for (var i = 0; i < st.bars; i++) tot += PR[i];
    v.pts = P.slice(0, st.k).map(function(p, i){ return { x:p[0], y:p[1], bar:i < st.bars ? { h:PR[i] * 9, t:sg(PR[i]) } : null }; });
    if (st.mean) { v.mean = { x:3, y:10 }; v.quads = true; }
    v.aria = "Five points (1, 8), (2, 10), (3, 9), (4, 12), (5, 11)" + (st.mean ? " with dashed mean lines at x = 3 and y = 10; the upper-right and lower-left quadrants are marked +, the other two −" : "") + ".";
    var th = 220, top = 30, bh = tot / 10 * th;
    var side = '<svg class="pr-svg pr-tot" viewBox="0 0 120 300" role="img" aria-label="Running total of the products: ' + tot + '">' +
      '<text class="pr-al" x="60" y="18" text-anchor="middle">Running total</text>' +
      '<rect class="pr-ttrack" x="40" y="' + top + '" width="40" height="' + th + '"/>' +
      '<rect class="pr-bp" x="40" y="' + (top + th - bh).toFixed(1) + '" width="40" height="' + bh.toFixed(1) + '"/>' +
      '<text class="pr-dval" x="60" y="' + (top + th + 30) + '" text-anchor="middle">Σ = ' + tot + "</text></svg>";
    el.innerHTML = '<div class="pr-hrow">' + scatterSVG(v) + side + '<div class="pr-hdial">' + dialSVG(st.dial, st.dial == null ? "r = ?" : null) + (st.dial != null ? '<p class="tiny pr-hform">8 ÷ √(10 × 10) = 0.80</p>' : "") + "</div></div>";
  }
  function last(){ st = { k:5, mean:true, bars:5, dial:0.8 }; paint(); cap.textContent = "Products +4, 0, 0, +2, +2 add to 8, and r = 8 ÷ √(10 × 10) = 0.80: a strong positive correlation."; }
  if (MV.reduceMotion) { last(); return; }
  paint(); cap.textContent = "Five points appear";
  var i = 0;
  (function addPt(){
    if (i < 5) { i++; st.k = i; paint(); MV.wait(320, addPt); return; }
    MV.wait(500, function(){
      st.mean = true; paint(); cap.textContent = "Mean lines at x = 3 and y = 10 split the plot into + and − quadrants";
      MV.wait(1300, function(){
        var b = 0;
        (function bar(){
          if (b < 5) { b++; st.bars = b; paint(); cap.textContent = "(" + P[b - 1][0] + ", " + P[b - 1][1] + ") adds " + sg(PR[b - 1]) + " to the running total"; MV.wait(750, bar); return; }
          cap.textContent = "The dial turns to 8 ÷ √(10 × 10) = 0.80";
          MV.tween({ dur:1300, step:function(t){ st.dial = -1 + 1.8 * t; paint(); }, done:function(){ MV.wait(400, last); } });
        })();
      });
    });
  })();
}

// ---------- Part 3: r can mislead (four stations) ----------
// VERIFY: Anscombe's quartet values (Anscombe 1973, The American Statistician 27(1)) before release.
var ANS = { x:[10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5],
  y1:[8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68],
  y2:[9.14, 8.14, 8.74, 8.77, 9.26, 8.10, 6.13, 3.10, 9.13, 7.26, 4.74],
  y3:[7.46, 6.77, 12.74, 7.11, 7.81, 8.84, 6.08, 5.39, 8.15, 6.42, 5.73],
  x4:[8, 8, 8, 8, 8, 8, 8, 19, 8, 8, 8], y4:[6.58, 5.76, 7.71, 8.84, 8.47, 7.04, 5.25, 12.50, 5.56, 7.91, 6.89] };
function ansSet(k){ var xs = k === 3 ? ANS.x4 : ANS.x, ys = ANS["y" + (k + 1)]; return xs.map(function(x, i){ return [x, ys[i]]; }); }
// model data: a cluster with no pattern (r ≈ 0.02) and one far point (r ≈ 0.89 with it)
var CL = [[2, 3], [3, 5], [4, 2], [5, 4], [3, 3], [4, 5], [2, 4], [5, 3], [3, 2]], FAR0 = [13, 13];
// model data: height (cm) vs arm span (cm) for 36 students; r = 0.90; the 6 students 170–172 cm tall give r = 0.30
var HA = [[158, 165], [187, 196], [177, 187], [166, 167], [178, 181], [153, 150], [184, 194], [172, 172], [180, 171], [157, 167], [186, 182], [153, 157], [160, 158], [180, 188], [179, 188], [165, 167], [166, 165], [171, 169], [180, 178], [169, 173], [163, 169], [156, 163], [180, 191], [168, 177], [169, 176], [170, 164], [177, 182], [170, 174], [192, 184], [153, 148], [153, 147], [171, 178], [157, 154], [171, 171], [157, 159], [187, 193]];
// model data: a town over 10 years; streaming subscriptions (thousands) and bike lanes; r = 0.94
var TOWN = { yr:[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], subs:[1.2, 1.9, 2.4, 3.1, 3.9, 4.6, 5.8, 6.1, 6.6, 7.4], lanes:[3, 3, 5, 4, 5, 7, 6, 8, 8, 9] };

function part3(host, api){
  var S = api.S, P3 = api.content || {}, ST = P3.stations || [];
  if (!ST.length) return {};
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = ST[0].id;
  S.s1 = obj(S.s1); if (!Array.isArray(S.s1.sel) || S.s1.sel.length !== 4) S.s1.sel = [false, false, false, false]; S.s1.sel = S.s1.sel.map(Boolean); S.s1.solved = !!S.s1.solved;
  S.s2 = obj(S.s2); if (!Array.isArray(S.s2.far) || S.s2.far.length !== 2) S.s2.far = FAR0.slice(); S.s2.far = [clampI(S.s2.far[0], 0, 15, 13), clampI(S.s2.far[1], 0, 15, 13)]; S.s2.done = !!S.s2.done;
  S.s3 = obj(S.s3); S.s3.f = S.s3.f === "cut" ? "cut" : "all"; S.s3.seen = !!S.s3.seen;
  S.s4 = obj(S.s4); S.s4.pick = S.s4.pick == null ? null : clampI(S.s4.pick, 0, 3, 0); S.s4.solved = !!S.s4.solved;
  var s1msg = "", s4msg = "", drag = null;
  function st(id){ return ST.filter(function(s){ return s.id === id; })[0]; }
  function done(id){ return id === "s1" ? S.s1.solved : id === "s2" ? S.s2.done : id === "s3" ? S.s3.seen : S.s4.solved; }
  var tabOpts = ST.map(function(s){ return { id:s.id, t:"" }; });
  function tabText(){ ST.forEach(function(s, i){ tabOpts[i].t = "Station " + (i + 1) + (done(s.id) ? ' <span class="pr-tick" aria-label="done">✓</span>' : ""); }); }
  host.innerHTML = '<div id="ml-tabs" class="ml-tabs"></div><div id="ml-body" class="ml-body"></div>';
  tabText();
  var tabsR = radios($("#ml-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; api.save(); paint(); } });
  function retab(){ tabText(); tabsR.refresh(); }
  function save(){ api.save(); }
  function dataPanel(head, rows, note){ return '<details class="alg"><summary>Check it with data</summary>' + MV.tableHTML({ head:head, rows:rows, caption:"Data" }) + (note ? '<p class="tiny muted">' + note + "</p>" : "") + "</details>"; }

  function s1HTML(s){
    var h = '<p class="ml-text">' + s.text + '</p><div class="ml-grid">';
    s.plots.forEach(function(pl, k){
      var P = ansSet(k), r = rOf(P), on = S.s1.sel[k];
      var svg = scatterSVG({ x0:2, x1:20, y0:2, y1:14, w:300, h:230, L:34, xt:ticks(4, 20, 4, String), yt:ticks(4, 14, 2, function(v){ return v % 4 ? "" : String(v); }), pts:P.map(function(p){ return { x:p[0], y:p[1], r:5 }; }),
        aria:pl.t.replace(/<[^>]+>/g, "") + ": 11 points, r = " + rTxt(r) });
      h += '<button type="button" class="ml-plot" data-pl="' + k + '" data-k="mlpl' + k + '" aria-pressed="' + on + '"' + (S.s1.solved ? " disabled" : "") + '><span class="ml-pt">' + pl.t + " · " + RI + " = " + rTxt(r) + "</span>" + svg + "</button>";
    });
    h += "</div>";
    if (!S.s1.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" id="ml-s1chk" data-k="mls1chk">Check</button></div>' + (s1msg ? MV.fbHTML("bad", s1msg) : "");
    else {
      h += MV.fbHTML("good", "<strong>✓ Correct.</strong> Only data set I fits “strong linear”. " + s.plots.map(function(pl){ return "<br>" + pl.t + ": " + pl.fb; }).join("")) + '<p class="ml-after">' + s.after + "</p>" +
        dataPanel(["Data set", "Pattern", M("r")], s.plots.map(function(pl, k){ return [pl.t, ["linear cloud", "smooth curve", "line + one outlier", "vertical cluster + one far point"][k], dN(rOf(ansSet(k)), 3)]; }), "Published data: Anscombe, F. J. (1973). Graphs in statistical analysis. <i>The American Statistician</i>, 27(1), 17–21.");
    }
    return h;
  }
  function s2Pts(){ return CL.concat([S.s2.far]); }
  function s2Plot(){
    var P = s2Pts(), r = rOf(P), box = $("#ml-s2box", host); if (!box) return;
    box.innerHTML = scatterSVG({ x0:0, x1:15, y0:0, y1:15, xt:ticks(0, 15, 1, function(v){ return v % 3 ? "" : String(v); }), yt:ticks(0, 15, 1, function(v){ return v % 3 ? "" : String(v); }), xl:"x", yl:"y",
      pts:CL.map(function(p){ return { x:p[0], y:p[1] }; }).concat([{ x:S.s2.far[0], y:S.s2.far[1], cls:"pr-far", r:8, sel:true, lab:"(" + S.s2.far[0] + ", " + S.s2.far[1] + ")" }]),
      aria:"A cluster of 9 points near (3, 3) and one orange far point at (" + S.s2.far[0] + ", " + S.s2.far[1] + "); r = " + rTxt(r) });
    var rd = $("#ml-s2r", host); if (rd) rd.innerHTML = MV.readoutHTML([[RI + " with the far point", "<strong>" + rTxt(r) + "</strong> (" + strength(r) + ")"], [RI + " for the cluster alone", rTxt(rOf(CL))]]);
  }
  function s2Check(){
    var f = S.s2.far;
    if (!S.s2.done && f[0] <= 6 && f[1] <= 6) { S.s2.done = true; save(); paint(); MV.focusFb($("#ml-body", host)); }
  }
  function s2HTML(s){
    var h = '<p class="ml-text">' + s.text + ' <span class="mdm-model">model data</span></p>' +
      '<div class="pr-box ml-s2box" id="ml-s2box" tabindex="0" role="group" aria-label="Plot with a draggable far point. Arrow keys move it by 1."></div><dl class="read" id="ml-s2r" aria-live="polite"></dl>' +
      '<div class="q-actions"><button type="button" class="btn ghost sm" id="ml-s2reset" data-k="mls2reset">Put the far point back at (13, 13)</button></div>';
    if (S.s2.done) h += MV.fbHTML("good", "<strong>✓ " + RI + " collapsed.</strong> With the far point inside the cluster, " + RI + " is close to 0. " + s.after) +
      dataPanel(["Far point at", M("r")], [["(13, 13)", rTxt(rOf(CL.concat([FAR0])))], ["inside the cluster, e.g. (4, 4)", rTxt(rOf(CL.concat([[4, 4]])))], ["removed", rTxt(rOf(CL))]]);
    return h;
  }
  function s3HTML(s){
    var cut = S.s3.f === "cut", P = cut ? HA.filter(function(p){ return p[0] >= 170 && p[0] <= 172; }) : HA, r = rOf(P);
    var v = cut ? { x0:168, x1:174, y0:160, y1:182, xt:ticks(168, 174, 1, String), yt:ticks(160, 182, 2, function(v){ return v % 4 ? "" : String(v); }) }
      : { x0:150, x1:195, y0:145, y1:200, xt:ticks(150, 195, 5, function(v){ return v % 10 ? "" : String(v); }), yt:ticks(145, 200, 5, function(v){ return v % 10 ? "" : String(v); }), band:{ x0:169.5, x1:172.5 } };
    v.xl = "height (cm)"; v.yl = "arm span (cm)"; v.L = 50;
    v.pts = P.map(function(p){ return { x:p[0], y:p[1], r:cut ? 7 : 5 }; });
    v.aria = (cut ? "Only the " + P.length + " students 170 to 172 cm tall" : "All " + P.length + " students; a shaded band marks 170 to 172 cm") + "; r = " + rTxt(r);
    var h = '<p class="ml-text">' + s.text + ' <span class="mdm-model">model data</span></p><div id="ml-s3f"></div>' +
      '<div class="pr-box">' + scatterSVG(v) + "</div>" +
      '<dl class="read" aria-live="polite">' + MV.readoutHTML([["Students", String(P.length)], [RI, "<strong>" + rTxt(r) + "</strong> (" + strength(r) + ")"]]) + "</dl>";
    if (S.s3.seen) h += MV.fbHTML(cut ? "good" : "", (cut ? "<strong>✓ " + RI + " drops from 0.90 to " + rTxt(r) + ".</strong> " : "") + s.after + " Within 3 cm of height, the small differences in arm span are mostly noise.") +
      dataPanel(["Group", "Students", M("r")], [["All students", String(HA.length), rTxt(rOf(HA))], ["170–172 cm only", String(HA.filter(function(p){ return p[0] >= 170 && p[0] <= 172; }).length), rTxt(rOf(HA.filter(function(p){ return p[0] >= 170 && p[0] <= 172; })))]]);
    return h;
  }
  function s4HTML(s){
    var P = TOWN.subs.map(function(v, i){ return [v, TOWN.lanes[i]]; }), r = rOf(P);
    var svg = scatterSVG({ x0:0, x1:8, y0:0, y1:10, xt:ticks(0, 8, 1, String), yt:ticks(0, 10, 1, function(v){ return v % 2 ? "" : String(v); }), xl:"streaming subscriptions (thousands)", yl:"bike lanes",
      pts:P.map(function(p, i){ return { x:p[0], y:p[1], lab:i === 0 || i === 9 ? String(TOWN.yr[i]) : "" }; }), aria:"Bike lanes against streaming subscriptions for 10 years, 2015 to 2024, rising together; r = " + rTxt(r) });
    var h = '<p class="ml-text">' + s.text + ' <span class="mdm-model">model data</span></p><div class="pr-box">' + svg + '</div><dl class="read">' + MV.readoutHTML([[RI, "<strong>" + rTxt(r) + "</strong> (" + strength(r) + ")"]]) + "</dl>" +
      '<div class="ml-choices" role="group" aria-label="What does the correlation show?">' + s.choices.map(function(c, k){
        return '<button type="button" class="btn ghost sm ml-ch" data-ch="' + k + '" data-k="mlch' + k + '" aria-pressed="' + (S.s4.pick === k) + '"' + (S.s4.solved ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
    if (S.s4.solved) h += MV.fbHTML("good", s.choices.filter(function(c){ return MV.ok(c); })[0].why + " " + s.after) +
      dataPanel(["Year", "Subscriptions (thousands)", "Bike lanes"], TOWN.yr.map(function(y, i){ return [String(y), dN(TOWN.subs[i], 1), String(TOWN.lanes[i])]; }), "Both columns simply rise with the years.");
    else if (s4msg) h += MV.fbHTML("bad", s4msg);
    return h;
  }
  function paint(){
    retab();
    var s = st(S.cur), body = $("#ml-body", host), inner = s.id === "s1" ? s1HTML(s) : s.id === "s2" ? s2HTML(s) : s.id === "s3" ? s3HTML(s) : s4HTML(s);
    MV.keepFocus(body, function(){ body.innerHTML = '<div class="ml-card"><h4 class="ml-lab">Station ' + (ST.indexOf(s) + 1) + ": " + s.title + "</h4>" + inner + "</div>"; });
    if (s.id === "s2") s2Plot();
    if (s.id === "s3") radios($("#ml-s3f", host), { label:"Filter", options:s.filters, value:S.s3.f, cls:"chips", onChange:function(v){ S.s3.f = v; if (v === "cut") S.s3.seen = true; save(); paint(); var b = $("#ml-s3f [data-rg='" + v + "']", host); if (b) b.focus(); } });
  }
  var V2 = { x0:0, x1:15, y0:0, y1:15 };
  host.addEventListener("pointerdown", function(e){
    var box = e.target.closest("#ml-s2box"); if (!box) return;
    var svg = box.querySelector("svg"), q = svg && geom(V2).inv(svg, e.clientX, e.clientY); if (!q) return;
    if (Math.hypot(q[0] - S.s2.far[0], q[1] - S.s2.far[1]) > 1.6) return;
    drag = { id:e.pointerId }; try { box.setPointerCapture(e.pointerId); } catch (err) {} e.preventDefault();
  });
  host.addEventListener("pointermove", function(e){
    if (!drag || drag.id !== e.pointerId) return;
    var box = $("#ml-s2box", host), svg = box && box.querySelector("svg"), q = svg && geom(V2).inv(svg, e.clientX, e.clientY); if (!q) return;
    var x = clamp(Math.round(q[0]), 0, 15), y = clamp(Math.round(q[1]), 0, 15);
    if (x !== S.s2.far[0] || y !== S.s2.far[1]) { S.s2.far = [x, y]; s2Plot(); }
  });
  function endDrag(e){ if (!drag || drag.id !== e.pointerId) return; drag = null; save(); s2Check(); }
  host.addEventListener("pointerup", endDrag); host.addEventListener("pointercancel", endDrag);
  host.addEventListener("keydown", function(e){
    if (!e.target.closest || !e.target.closest("#ml-s2box")) return;
    var k = { ArrowLeft:[-1, 0], ArrowRight:[1, 0], ArrowUp:[0, 1], ArrowDown:[0, -1] }[e.key]; if (!k) return;
    e.preventDefault(); S.s2.far = [clamp(S.s2.far[0] + k[0], 0, 15), clamp(S.s2.far[1] + k[1], 0, 15)]; save(); s2Plot();
    if (!S.s2.done && S.s2.far[0] <= 6 && S.s2.far[1] <= 6) { S.s2.done = true; save(); paint(); var b = $("#ml-s2box", host); if (b) b.focus(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest(".rg")) return;
    if (b.dataset.pl != null) { var k = +b.dataset.pl; S.s1.sel[k] = !S.s1.sel[k]; s1msg = ""; save(); paint(); return; }
    if (b.id === "ml-s1chk") {
      var sel = S.s1.sel, s = st("s1");
      if (sel[0] && !sel[1] && !sel[2] && !sel[3]) { S.s1.solved = true; s1msg = ""; }
      else if (!sel.some(Boolean)) s1msg = "Tap at least one plot first.";
      else { var fb = []; if (!sel[0]) fb.push(s.plots[0].fb); sel.forEach(function(on, i){ if (on && i > 0) fb.push(s.plots[i].fb); }); s1msg = "<strong>✗ Not quite.</strong> " + fb.join(" ") + " Try again."; }
      save(); paint(); MV.focusFb($("#ml-body", host)); return;
    }
    if (b.id === "ml-s2reset") { S.s2.far = FAR0.slice(); save(); s2Plot(); return; }
    if (b.dataset.ch != null) {
      var c = +b.dataset.ch, ch = st("s4").choices[c]; S.s4.pick = c;
      if (MV.ok(ch)) { S.s4.solved = true; s4msg = ""; } else s4msg = "<strong>✗ Not quite.</strong> " + ch.why + " Try again.";
      save(); paint(); MV.focusFb($("#ml-body", host)); return;
    }
  });
  paint();
  return {};
}

// ---------- Performance task: Rank the study hours ----------
var task = (function(){
  var api = null, sel = null, RK = [1, 2, 3, 4, 5];
  function st(){ var s = api ? api.S : {}; s.v = cleanVals(s.v, RK, 5); return s; }
  function read(){ return { v:st().v.slice() }; }
  function pts(v){ var L = []; v.forEach(function(y, i){ if (y != null) L.push([i + 1, y]); }); return L; }
  function lab(k){ var v = k.split(",").map(Number); return "ranks " + v.join(", ") + " (r = " + rTxt(rOf(pts(v))) + ")"; }
  function paint(){
    var s = st(), inp = $("#rk-in"), pv = $("#rk-pv"); if (!inp || !pv) return;
    MV.keepFocus(inp, function(){ inp.innerHTML = '<p class="tiny">Tap a rank card, then tap the hours it belongs to.</p>' + slotsHTML({ id:"rk", labels:RK.map(function(h){ return h + " h"; }), vals:s.v, cards:RK, sel:sel, slotName:"Hours studied" }); });
    var P = pts(s.v), r = rOf(P);
    var svg = scatterSVG({ x0:0, x1:6, y0:0, y1:6, w:340, h:280, L:40, xt:ticks(0, 6, 1, function(v){ return v >= 1 && v <= 5 ? String(v) : ""; }), yt:ticks(0, 6, 1, function(v){ return v >= 1 && v <= 5 ? String(v) : ""; }), xl:"hours studied", yl:"quiz rank",
      pts:P.map(function(p){ return { x:p[0], y:p[1] }; }), aria:"Quiz rank against hours studied: " + (P.length ? P.map(function(p){ return "(" + p[0] + ", " + p[1] + ")"; }).join(", ") : "no cards placed yet") });
    pv.innerHTML = '<div class="pr-box">' + svg + "</div>" +
      '<dl class="read" aria-live="polite">' + MV.readoutHTML([[RI, P.length === 5 ? "<strong>" + rTxt(r) + "</strong> (" + strength(r) + ")" : '<span class="muted">place all five cards</span>']]) + "</dl>" +
      (P.length === 5 ? '<details class="alg"><summary>Steps table</summary>' + stepsHTML(P) + "</details>" : "");
  }
  return {
    render:function(inp, pvw, a){
      api = a; st();
      inp.innerHTML = '<div id="rk-in" class="rk-in"></div>';
      pvw.innerHTML = '<div id="rk-pv" class="rk-pv"></div>';
      $("#rk-in").addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || b.disabled || b.dataset.cs !== "rk") return;
        var s = st(), o = { vals:s.v, sel:sel }, r = slotsClick(o, b); s.v = o.vals; sel = o.sel;
        if (r) { api.save(); paint(); if (r !== "sel") api.update(); }
      });
      paint();
    },
    read:read,
    valid:function(d){ return d.v.every(function(v){ return v != null; }) ? true : "Place all five rank cards, one at each number of hours."; },
    checks:function(d){ var r = rOf(pts(d.v)); return [r != null && r >= 0.67 - 1e-9, r != null && r < 1 - 1e-9, d.v[4] !== 5]; },
    key:function(d){ return d.v.join(","); },
    label:function(k){ return lab(k).replace("r =", RI + " ="); },
    text:function(k){ return lab(k); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
