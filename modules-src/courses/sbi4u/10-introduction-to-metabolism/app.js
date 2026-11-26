// SBI4U 10 Introduction to Metabolism: hero (an enzyme lowers glucose's hill), Energy landscape (energyLandscape on a Plot canvas
// with an ATP-coupling panel and ΔG bars; Mode B energy accounting with a simple S3 energy ledger), "Enzymes and their control"
// (enzymeZoom step-through, rate-vs-substrate data with inhibitors, feedback-inhibition pathway), ΔG calculator (custom N4),
// "Couple it, don't waste it" task.
(function(){
"use strict";
var $ = MV.$;

// ---------- small helpers (SVG helpers from SBI4U 06) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "ez-t", "text-anchor":anchor || null }, s); }
function sgn(v){ var r = Math.round(v * 10) / 10; return (r > 0 ? "+" : "") + MV.num(r, 1); }
function kj(v){ return sgn(v) + " kJ/mol"; }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (String(list[i].id) === String(id)) return list[i]; return null; }
function isDark(){ return getComputedStyle(document.documentElement).colorScheme === "dark"; }
var ATP_DG = -30.5;

// ---------- @component radioGroup (copied from SBI4U 06 / 03 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list)}
function radios(host, o){
  var val = String(o.value);
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (x.dis ? -1 : tab) + '" data-rg="' + x.id + '"' + (x.dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function firstFree(){ for (var i = 0; i < o.options.length; i++) if (!o.options[i].dis) return i; return 0; }
  function choose(id){ id = String(id); var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var ids = o.options.filter(function(x){ return !x.dis; }).map(function(x){ return String(x.id); }); if (!ids.length) return;
    var i = ids.indexOf(String(b.dataset.rg)); choose(ids[(i + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, setOptions:function(list){ o.options = list; paint(); } };
}
// @component stepper — − / + buttons around a live value: stepper(host, {id, label, min, max, value, unit(v), onChange(v)}) -> {set(v), get()}
function stepper(host, o){
  var val = o.value;
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<span class="rg-wrap"><span class="rg-lab" id="' + o.id + '-l">' + o.label + '</span><span class="em-step" role="group" aria-labelledby="' + o.id + '-l">' +
        '<button type="button" class="em-stb" data-st="-1" data-k="' + o.id + 'm" aria-label="One fewer"' + (val <= o.min ? " disabled" : "") + ">−</button>" +
        '<output class="em-sto" aria-live="polite">' + o.unit(val) + "</output>" +
        '<button type="button" class="em-stb" data-st="1" data-k="' + o.id + 'p" aria-label="One more"' + (val >= o.max ? " disabled" : "") + ">+</button></span></span>";
    });
  }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-st]"); if (!b || b.disabled) return; var v = clamp(val + (+b.dataset.st), o.min, o.max); if (v !== val) { val = v; paint(); o.onChange(v); } });
  paint();
  return { set:function(v){ if (v !== val) { val = v; paint(); } }, get:function(){ return val; } };
}
// range slider with output (from SBI4U 06): slider(host, {id, label, min, max, step, value, unit(v), short(v), onChange(v)}) -> {set(v), input}
function slider(host, o){
  host.innerHTML = '<label class="slider em-sl"><span class="slider-top"><span>' + o.label + '</span><output id="' + o.id + '-out" for="' + o.id + '"></output></span><input type="range" id="' + o.id + '" min="' + o.min + '" max="' + o.max + '" step="' + o.step + '" value="' + o.value + '"></label>';
  var inp = $("#" + o.id, host), out = $("#" + o.id + "-out", host);
  function show(v){ out.textContent = o.short ? o.short(v) : o.unit(v); inp.setAttribute("aria-valuetext", o.unit(v)); }
  inp.addEventListener("input", function(){ var v = +inp.value, r = o.onChange(v); if (typeof r === "number") { inp.value = r; v = r; } show(v); });
  show(o.value);
  return { set:function(v){ inp.value = v; show(v); }, input:inp };
}

// ---------- @component energyLandscape — free-energy diagram on a Plot canvas (C3.3): reactants at 0, a hill (activation energy),
// products at ΔG; the uncatalysed hill as a dashed outline; an R1-style staircase of small hills ("many enzymes"); an orange
// ATP-hydrolysis panel that slides in underneath for coupling; ΔG and Ea brackets; a ball that tries the crossing. kJ/mol, to scale.
// L = {dg, ea, eaUnc, steps, showUnc, rl, pl, atp:{n, k 0…1, ea}|null, ball, atpBall, glucose, schematic, dgLab, eaLab, enzK, describe} ----------
function prof(dg, ea, x, steps){
  if (x <= 2.5) return 0;
  if (x >= 7.5) return dg;
  if (steps) {
    var w = 5 / steps, i = Math.min(steps - 1, Math.floor((x - 2.5) / w)), s = (x - 2.5 - i * w) / w, base = dg * i / steps, next = dg * (i + 1) / steps;
    if (s < 0.4) return base + ea * (1 - Math.cos(Math.PI * s / 0.4)) / 2;
    return base + ea + (next - base - ea) * (1 - Math.cos(Math.PI * (s - 0.4) / 0.6)) / 2;
  }
  if (x <= 5) return ea * (1 - Math.cos(Math.PI * (x - 2.5) / 2.5)) / 2;
  return ea + (dg - ea) * (1 - Math.cos(Math.PI * (x - 5) / 2.5)) / 2;
}
var XS = 1.4, XE = 8.6, XB = 9.95;
function xAtFrac(f){ return 2.5 + 2.5 * Math.acos(clamp(1 - 2 * f, -1, 1)) / Math.PI; }
function landView(L, H){
  var top = Math.max(L.eaUnc, L.ea, L.dg, 0), bot = Math.min(0, L.dg), span = top - bot, k = L.atp ? L.atp.k : 0, low = bot, lay = { span:span, top:top, bot:bot };
  if (k > 0) { lay.yA0 = bot - span * 0.22 - L.atp.ea; low = lerp(bot, lay.yA0 + ATP_DG * L.atp.n, k); }
  var per = Math.max(40, (H || 300) - 46 - 28) / Math.max(1e-6, top - low);   // pixels per kJ/mol: 46 px headroom for labels, 28 px at the foot
  return { view:{ xmin:-1.25, xmax:L.xmax || 12.4, ymax:top + 46 / per, ymin:low - 28 / per }, lay:lay };
}
function drawLandscape(p, L){
  var V = landView(L, p.c ? p.c.getBoundingClientRect().height : 300), lay = V.lay, css = MV.css;
  var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), atpC = css("--bio-atp"), carb = css("--bio-carbon"), sheet = css("--sheet"), dark = isDark();
  p.draw({ view:V.view, grid:false, axes:false, describe:L.describe, after:function(ctx, P){
    var font = P.fontUI || "sans-serif", W = P.W, H = P.H, small = W < 440, fs = small ? 11.5 : 13;
    function X(x){ return P.X(x); } function Y(y){ return P.Y(y); }
    function line(pts, color, width, dash, alpha){
      ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = "round"; ctx.lineCap = "round";
      if (dash) ctx.setLineDash(dash);
      ctx.beginPath(); pts.forEach(function(q, i){ if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }); ctx.stroke(); ctx.restore();
    }
    function curve(y0, dg, ea, steps){ var pts = []; for (var i = 0; i <= 260; i++) { var x = 0.3 + 9.4 * i / 260; pts.push([X(x), Y(y0 + prof(dg, ea, x, steps))]); } return pts; }
    function label(s, x, y, o){
      o = o || {}; ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.font = (o.w || "600") + " " + (o.size || fs) + "px " + font; ctx.textAlign = o.align || "center"; ctx.textBaseline = o.base || "alphabetic";
      if (o.bg) { var tw = ctx.measureText(s).width, bx = o.align === "left" ? x : o.align === "right" ? x - tw : x - tw / 2, by = o.base === "middle" ? y - fs * 0.62 : y - fs; ctx.fillStyle = sheet; ctx.globalAlpha *= 0.88; ctx.fillRect(bx - 3, by - 1, tw + 6, fs * 1.3); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; }
      ctx.fillStyle = o.color || ink; ctx.fillText(s, x, y); ctx.restore();
    }
    function head(x, y, dir, color, s){ s = s || 7; ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - s * 0.6, y - dir * s); ctx.lineTo(x + s * 0.6, y - dir * s); ctx.closePath(); ctx.fill(); }
    function bracket(xd, y1, y2, color, lines, alpha){
      var x = X(xd), a = Y(y1), b = Y(y2); if (Math.abs(b - a) < 2) return;
      ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
      line([[x, a], [x, b]], color, 1.8, null, alpha);
      if (Math.abs(b - a) > 14) { var d = b > a ? 1 : -1; head(x, b, d, color, 7); head(x, a, -d, color, 7); }
      line([[x - 5, a], [x + 5, a]], color, 1.5, null, alpha); line([[x - 5, b], [x + 5, b]], color, 1.5, null, alpha);
      var mid = (a + b) / 2, n = lines.length;
      lines.forEach(function(s, i){ label(s, x + 7, mid + (i - (n - 1) / 2) * (fs + 3), { align:"left", base:"middle", color:color, bg:true, alpha:alpha }); });
      ctx.restore();
    }
    // energy axis
    var ax = Math.max(X(-0.72), 28);
    line([[ax, H - 8], [ax, 14]], ink2, 1.6); head(ax, 10, -1, ink2, 8);
    ctx.save(); ctx.translate(ax - 7, H / 2); ctx.rotate(-Math.PI / 2); ctx.font = "600 " + (small ? 11 : 12) + "px " + font; ctx.fillStyle = ink2; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText("free energy, G", 0, 0); ctx.restore();
    label("progress of the reaction →", X(0.1), H - 6, { align:"left", size:small ? 10.5 : 11.5, w:"400", color:ink2 });
    // reaction panel
    var dashAlpha = dark ? 0.7 : 0.9;
    if (L.dg !== 0) line([[X(2.5), Y(0)], [X(XB), Y(0)]], ink2, 1, [3, 4], 0.8);
    if (L.showUnc) line(curve(0, L.dg, L.eaUnc, 0), ink2, 2, [7, 6], dashAlpha);
    line(curve(0, L.dg, L.ea, L.steps), pen, 3.2);
    if (L.rl) label(L.rl, X(XS), Y(0) - 23);
    if (L.pl) label(L.pl, X(XE), L.dg < 0 ? Y(L.dg) + 17 : Y(L.dg) - 23);
    if (L.eaLab) {
      if (L.steps) { var w1 = 5 / L.steps, xp = 2.5 + 0.4 * w1; label("Eₐ = " + Math.round(L.ea) + " kJ/mol per step", X(xp) + 8, Y(L.ea) - 8, { align:"left", color:ink, bg:true }); }
      else {
        var xe = X(5), ye0 = Y(0), ye1 = Y(L.ea);
        line([[xe, ye0], [xe, ye1 + 3]], ink, 1.6); if (ye0 - ye1 > 16) { head(xe, ye1 + 1, -1, ink, 7); }
        label(L.schematic ? "Eₐ" : "Eₐ = " + Math.round(L.ea), xe, ye1 - 9, { bg:true });
        if (L.showUnc && !L.schematic && Y(L.ea) - Y(L.eaUnc) > 22) label("without enzyme: " + Math.round(L.eaUnc), X(5), Y(L.eaUnc) - 8, { size:small ? 10.5 : 11.5, w:"400", color:ink2, bg:true });
      }
    }
    bracket(XB, 0, L.dg, ink, L.dgLab || ["ΔG", sgn(L.dg)]);
    // ATP panel (coupling)
    if (L.atp && L.atp.k > 0.001) {
      var A = L.atp, y0 = lay.yA0, drop = ATP_DG * A.n, al = clamp(A.k * 1.4 - 0.2, 0, 1), nn = Math.max(1, Math.round(A.n));
      line([[X(2.5), Y(y0)], [X(XB), Y(y0)]], ink2, 1, [3, 4], 0.8 * al);
      line(curve(y0, drop, A.ea, 0), atpC, 3, null, al);
      label((nn > 1 ? nn + " ATP + " + nn + " H₂O" : "ATP + H₂O"), X(XS), Y(y0) - 21, { color:atpC, alpha:al });
      label((nn > 1 ? nn + " ADP + " + nn + " Pᵢ" : "ADP + Pᵢ"), X(XE), Y(y0 + drop) + 17, { color:ink2, alpha:al });
      bracket(XB, y0, y0 + drop, atpC, [nn + " ATP", sgn(drop)], al);
      label("coupled: ATP hydrolysis", X(-0.35), Y(y0 + A.ea) - 4, { align:"left", size:small ? 10.5 : 11.5, color:atpC, alpha:al, w:"700" });
      if (L.atpBall != null) { var ab = L.atpBall; ctx.save(); ctx.globalAlpha = al; ctx.beginPath(); ctx.arc(X(ab), Y(y0 + prof(drop, A.ea, ab, 0)) - 8, 7, 0, Math.PI * 2); ctx.fillStyle = atpC; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = sheet; ctx.stroke(); ctx.restore(); }
    }
    // enzyme glyph (hero)
    if (L.enzK > 0) {
      var ek = 1 - Math.pow(1 - clamp(L.enzK, 0, 1), 3), gx = lerp(X(12.6), X(5), ek), gy = Y(L.ea) - (small ? 16 : 20), gw = small ? 30 : 38, gh = small ? 15 : 19;
      ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.fillStyle = sheet; ctx.beginPath();
      ctx.moveTo(gx - gw, gy); ctx.bezierCurveTo(gx - gw, gy - gh * 1.3, gx + gw, gy - gh * 1.3, gx + gw, gy);
      ctx.bezierCurveTo(gx + gw, gy + gh * 0.6, gx + gw * 0.5, gy + gh * 0.7, gx + gw * 0.32, gy + gh * 0.5);
      ctx.lineTo(gx, gy + gh * 0.05); ctx.lineTo(gx - gw * 0.32, gy + gh * 0.5);
      ctx.bezierCurveTo(gx - gw * 0.5, gy + gh * 0.7, gx - gw, gy + gh * 0.6, gx - gw, gy); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
      label("enzyme", gx, gy - gh * 0.25, { color:ink2, base:"middle", size:small ? 10.5 : 12 });
    }
    // the ball
    if (L.ball != null) {
      var bx = X(L.ball), by = Y(prof(L.dg, L.ea, L.ball, L.steps));
      ctx.save();
      if (L.glucose) {
        var r = small ? 10 : 12, cy = by - r - 1; ctx.beginPath();
        for (var i = 0; i < 6; i++) { var an = Math.PI / 6 + i * Math.PI / 3, px = bx + r * Math.cos(an), py = cy + r * Math.sin(an); if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
        ctx.closePath(); ctx.fillStyle = carb; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = sheet; ctx.stroke();
        if (L.ball < 7) label("glucose", bx, cy - r - 5, { color:carb, w:"700" });
      } else { ctx.beginPath(); ctx.arc(bx, by - 9, 8, 0, Math.PI * 2); ctx.fillStyle = pen; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = sheet; ctx.stroke(); }
      ctx.restore();
    }
  } });
}

// ---------- @component S3 energyLedger (accounting form) — energy in / useful / heat bars with a typical-value tick and a laws panel ----------
function ledgerHTML(cv, u, blocked, C){
  var h = 100 - u;
  function row(lab, cls, w, val, inner){ return '<div class="em-arow"><span class="em-al">' + lab + '</span><span class="em-at"><i class="em-af ' + cls + '" style="width:' + w + '%">' + (inner || "") + "</i>" + (cls === "em-fuse" ? '<i class="em-typ" style="left:' + cv.lo + "%;width:" + Math.max(1.2, cv.hi - cv.lo) + '%" title="typical cell value"></i>' : "") + "</span><b>" + val + "</b></div>"; }
  return '<div class="em-acct" role="group" aria-label="' + MV.esc("Energy accounting for " + MV.plain(cv.t) + ": energy in 100 units, useful output " + u + ", heat " + h + ".") + '">' +
    '<p class="em-ah"><b>' + cv.id + "</b> " + cv.t + "</p>" +
    row("Energy in", "em-fin", 100, "100") + row("Useful output", "em-fuse", u, String(u)) + row("Heat", "em-fheat", h, String(h), h >= 14 ? "<span>heat</span>" : "") +
    '<p class="tiny em-typl"><i class="em-typk" aria-hidden="true"></i> Typical cell value: ' + cv.typ + " (approximate)</p>" +
    '<div class="em-laws"><p><strong>First law</strong> Energy is converted, never created or destroyed: in 100 = useful ' + u + " + heat " + h + ' <span class="em-ok">✓ balanced</span></p>' +
    "<p><strong>Second law</strong> Every conversion releases some energy as heat: " + (blocked ? '<span class="em-blk">' + C.blockedRow + "</span>" : "heat " + h + ' &gt; 0 <span class="em-ok">✓</span>') + "</p></div></div>";
}
// ΔG bars (waterfall): reaction, ATP, net. Scale −100 … +60 kJ/mol.
function barsHTML(dg, nLab, atp, net){
  var lo = -100, hi = 60;
  function P(v){ return (clamp(v, lo, hi) - lo) / (hi - lo) * 100; }
  function bar(name, a, b, cls, val){ var x0 = Math.min(P(a), P(b)), w = Math.abs(P(b) - P(a)); return '<div class="em-brow"><span class="em-bl">' + name + '</span><span class="em-bt"><i class="em-bz" style="left:' + f1(P(0)) + '%"></i><i class="em-bf ' + cls + '" style="left:' + f1(x0) + "%;width:" + f1(Math.max(w, 0.5)) + '%"></i></span><span class="em-bv">' + val + "</span></div>"; }
  return '<div class="em-bars" role="img" aria-label="' + MV.esc("ΔG bars in kJ/mol: reaction " + sgn(dg) + ", " + nLab + " " + sgn(atp) + ", net " + sgn(net)) + '">' +
    bar("Reaction", 0, dg, "em-bpen", sgn(dg)) + bar(nLab, dg, dg + atp, "em-batp", sgn(atp)) + bar("Net ΔG", 0, net, "em-bnet", sgn(net)) +
    '<p class="tiny muted em-bsc">ΔG in kJ/mol. The thin line marks 0: bars to the left are downhill.</p></div>';
}

// ---------- Explore: Energy landscape ----------
function explore(host, api){
  var C = api.content, S = api.S, RX = C.reactions, R2 = byId(RX, "R2");
  var D = { mode:"A", r:"R5", enz:false, n:0, conv:"B1", useful:50 };
  Object.keys(D).forEach(function(k){ if (S[k] === undefined) S[k] = D[k]; });
  if (!byId(RX, S.r)) S.r = "R5";
  if (!byId(C.conversions, S.conv)) S.conv = "B1";
  S.blocked = false;
  function rx(){ return byId(RX, S.r); }
  function eaOf(){ var r = rx(); return S.enz ? r.eaE : r.ea; }
  function stepsOf(){ var r = rx(); return S.enz && r.steps ? r.steps : 0; }
  function netOf(){ return rx().dg + ATP_DG * S.n; }
  function aEaOf(){ return S.enz ? R2.eaE : R2.ea; }
  var disp = { ea:0, k:0, n:0, net:0, aEa:50, ball:XS, atpBall:null }, anim = null, runAnim = null, pend = null, what = "", readSig = "";
  var legend = '<span><svg viewBox="0 0 26 8" aria-hidden="true"><line x1="1" y1="4" x2="25" y2="4" class="em-lg-pen"/></svg>reaction</span>' +
    '<span><svg viewBox="0 0 26 8" aria-hidden="true"><line x1="1" y1="4" x2="25" y2="4" class="em-lg-unc"/></svg>without the enzyme</span>' +
    '<span><svg viewBox="0 0 26 8" aria-hidden="true"><line x1="1" y1="4" x2="25" y2="4" class="em-lg-atp"/></svg>ATP hydrolysis (coupled)</span>';
  host.innerHTML = '<div class="pg em-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div id="em-ga"><div class="plot-wrap"><canvas class="plot" id="em-cv" role="img" aria-label="Energy diagram"></canvas></div><p class="em-legend tiny">' + legend + '</p><div id="em-bars"></div></div>' +
    '<div id="em-gb" hidden></div><p class="em-cap" id="em-cap" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div id="em-mode"></div>' +
      '<div class="em-panel" id="em-ca"><div id="em-rx"></div><div id="em-enz"></div><div id="em-atpw"></div><p class="tiny muted em-pnote" id="em-atpno">Coupling with ATP is offered for the anabolic steps R4–R6.</p>' +
        '<div class="q-actions em-runrow"><button type="button" class="btn primary sm" id="em-run" data-k="emrun">Run</button><button type="button" class="btn ghost sm" id="em-reset" data-k="emreset">Reset</button></div></div>' +
      '<div class="em-panel" id="em-cb"><div id="em-conv"></div><div id="em-use"></div></div></div>' +
    '<div class="pg-read"><dl class="read em-read" id="em-read" aria-live="polite"></dl><button type="button" class="btn ghost sm em-more" id="em-more" aria-expanded="false" data-k="emmore">More rows</button>' +
      '<p class="tiny muted em-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div></div>";
  var plot = new MV.Plot($("#em-cv", host), { xmin:0, xmax:1, ymin:0, ymax:1 }), runBtn = $("#em-run", host), bars = $("#em-bars", host);
  var modeR = radios($("#em-mode", host), { label:"Mode", options:[{ id:"A", t:"A: Landscape" }, { id:"B", t:"B: Energy accounting" }], value:S.mode, onChange:function(v){ change({ mode:v }); } });
  var rxR = radios($("#em-rx", host), { label:"Reaction", cls:"chips em-rxc", options:RX.map(function(r){ return { id:r.id, t:"<b>" + r.id + "</b> " + r.t }; }), value:S.r, onChange:function(v){ change({ r:v }); } });
  var enzR = radios($("#em-enz", host), { label:"Enzyme", options:[{ id:"0", t:"None" }, { id:"1", t:"Present" }], value:S.enz ? "1" : "0", onChange:function(v){ change({ enz:v === "1" }); } });
  var atpSt = stepper($("#em-atpw", host), { id:"em-n", label:"Couple with ATP", min:0, max:3, value:S.n, unit:function(v){ return v + " ATP hydrolyzed"; }, onChange:function(v){ change({ n:v }); } });
  var convR = radios($("#em-conv", host), { label:"Conversion", cls:"chips em-rxc", options:C.conversions.map(function(c){ return { id:c.id, t:"<b>" + c.id + "</b> " + c.t }; }), value:S.conv, onChange:function(v){ S.blocked = false; change({ conv:v }); } });
  var useS = slider($("#em-use", host), { id:"em-u", label:"Useful output (energy in: 100 units)", min:0, max:100, step:5, value:S.useful, short:function(v){ return v + " units"; }, unit:function(v){ return v + " units of useful output"; },
    onChange:function(v){
      var blocked = v >= 100; if (blocked) v = 95;
      S.useful = v; S.blocked = blocked; api.save();
      api.banner("", blocked ? C.blocked : "");
      what = blocked ? "" : "Useful " + v + " + heat " + (100 - v) + " = 100 units in."; paintCap(); paintB(); paintRead(); MV.changed();
      return blocked ? 95 : undefined;
    } });

  function scene(){
    var r = rx();
    return { dg:r.dg, ea:disp.ea, eaUnc:r.ea, steps:stepsOf(), showUnc:S.enz || disp.ea < r.ea - 0.5, rl:r.rl, pl:r.pl,
      atp:disp.k > 0.001 ? { n:Math.max(disp.n, 0.001), k:disp.k, ea:disp.aEa } : null, ball:disp.ball, atpBall:disp.atpBall, eaLab:true, describe:describe() };
  }
  function describe(){
    var r = rx(), d = "Energy diagram (model values) for " + r.id + ", " + MV.plain(r.t) + ". The reactants start at 0. ";
    d += stepsOf() ? "With enzymes the path is a staircase of small hills of 40 kJ/mol each" : "The hill (activation energy) is " + Math.round(eaOf()) + " kJ/mol" + (S.enz ? " with the enzyme; a dashed outline shows " + r.ea + " kJ/mol without it" : "");
    d += ". The products end at " + kj(r.dg) + ".";
    if (S.n) d += " Underneath, the orange ATP diagram drops " + kj(ATP_DG * S.n) + " for " + S.n + " ATP. Net ΔG " + kj(netOf()) + ".";
    if (disp.ball != null && Math.abs(disp.ball - XE) < 0.05) d += " The ball has reached the products.";
    return d;
  }
  function snap(){ disp.ea = eaOf(); disp.k = S.n > 0 ? 1 : 0; disp.n = S.n; disp.net = netOf(); disp.aEa = aEaOf(); disp.ball = XS; disp.atpBall = S.n > 0 ? XS : null; }
  function target(){ return { ea:eaOf(), k:S.n > 0 ? 1 : 0, n:S.n > 0 ? S.n : disp.n, net:netOf(), aEa:aEaOf() }; }
  function draw(){ if (S.mode !== "A") return; plot.render(); paintBars(); }
  plot.render = function(){ drawLandscape(plot, scene()); };
  function tweenTo(dur, done){
    if (anim) { anim(); anim = null; }
    var a = { ea:disp.ea, k:disp.k, n:disp.n, net:disp.net, aEa:disp.aEa }, b = target();
    disp.ball = XS; disp.atpBall = S.n > 0 ? XS : null;
    anim = MV.tween({ dur:dur, ease:MV.ease, step:function(t){ Object.keys(a).forEach(function(k){ disp[k] = lerp(a[k], b[k], t); }); draw(); },
      done:function(){ anim = null; snap(); draw(); if (done) done(); } });
  }
  function stop(){
    if (anim) { anim(); anim = null; }
    if (runAnim) { runAnim(); runAnim = null; }
    runBtn.disabled = false;
    if (pend) { var d = pend; pend = null; d(); }
  }
  function paintBars(){
    var r = rx(), show = S.mode === "A" && !!r.couple && (S.n > 0 || disp.k > 0.001);
    bars.hidden = !show; if (!show) { bars.innerHTML = ""; return; }
    var nn = S.n || Math.max(1, Math.round(disp.n));
    bars.innerHTML = barsHTML(r.dg, nn + " ATP", ATP_DG * disp.n, disp.net);
  }
  function rowsA(){
    var r = rx(), ea = eaOf(), net = netOf(), m = ' <span class="bio-model">model</span>', rows = [];
    rows.push(["Reaction", r.t, 0]);
    rows.push(["Type", r.cat ? "Catabolic (breaking down)" : "Anabolic (building up)", 0]);
    rows.push(["ΔG of the reaction", kj(r.dg) + " (" + (r.dg < 0 ? "exergonic" : "endergonic") + ")" + (r.dgModel ? m : ""), 1]);
    rows.push(["Activation energy", (stepsOf() ? ea + " kJ/mol per step (" + r.ea + " without enzymes)" : S.enz ? ea + " kJ/mol (" + r.ea + " without the enzyme)" : ea + " kJ/mol (no enzyme)") + m, 1]);
    if (S.n) rows.push(["Coupled ATP", S.n + " × (−30.5) = " + kj(ATP_DG * S.n), 0]);
    rows.push(["Net ΔG", kj(net) + " (" + (net < 0 ? "exergonic" : "endergonic") + (S.n ? " overall" : "") + ")", 1]);
    rows.push(["Can it proceed on its own?", net < 0 ? "Yes" : "No", 1]);
    rows.push(["How fast?", net >= 0 ? "Not at all: it’s uphill" : ea >= 90 ? "Very slow" : ea >= 50 ? "Slow" : "Fast", 1]);
    return rows;
  }
  function rowsB(){
    var cv = byId(C.conversions, S.conv), u = S.useful, h = 100 - u;
    return [["Conversion", cv.t, 0], ["Energy in", "100 units", 0], ["Useful output", u + " units (" + u + "%)", 1], ["Heat", h + " units", 1],
      ["First law", "In 100 = useful " + u + " + heat " + h + " ✓ balanced", 1], ["Second law", S.blocked ? C.blockedRow : "Heat &gt; 0 ✓", 1], ["Typical cell value", cv.typ + " (approximate)", 1]];
  }
  function paintRead(){
    var rows = S.mode === "A" ? rowsA() : rowsB(), h = rows.map(function(r){ return "<div" + (r[2] ? "" : ' class="em-x"') + "><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("");
    if (h !== readSig) { readSig = h; $("#em-read", host).innerHTML = h; }
  }
  function paintB(){ if (S.mode === "B") $("#em-gb", host).innerHTML = ledgerHTML(byId(C.conversions, S.conv), S.useful, S.blocked, C); }
  function paintCap(){ $("#em-cap", host).innerHTML = what || (S.mode === "A" ? "Choose a reaction, then press Run. Toggle the enzyme or add ATP and run it again." : "Move the useful-output slider. Whatever isn’t useful leaves as heat."); }
  function sync(){
    var A = S.mode === "A", r = rx();
    modeR.set(S.mode); rxR.set(S.r); enzR.set(S.enz ? "1" : "0"); atpSt.set(S.n); convR.set(S.conv); useS.set(S.useful);
    $("#em-ga", host).hidden = !A; $("#em-gb", host).hidden = A; $("#em-ca", host).hidden = !A; $("#em-cb", host).hidden = A;
    $("#em-atpw", host).hidden = !r.couple; $("#em-atpno", host).hidden = !!r.couple;
  }
  function capFor(patch, before){
    var r = rx();
    if (patch.mode) return "";
    if (patch.r) return "<strong>" + r.id + "</strong>: " + r.t + ". Press Run to watch the ball try the crossing.";
    if (patch.enz !== undefined) {
      if (r.steps) return S.enz ? "Enzymes present: one big hill becomes many small steps of 40 kJ/mol. The total drop, ΔG = −2870 kJ/mol, is unchanged." : "No enzymes: one big hill of 200 kJ/mol. ΔG is still −2870 kJ/mol.";
      return S.enz ? "Enzyme present: the hill drops from " + r.ea + " to " + r.eaE + " kJ/mol. ΔG stays at " + kj(r.dg) + "." : "No enzyme: the hill is back to " + r.ea + " kJ/mol. ΔG is still " + kj(r.dg) + ".";
    }
    if (patch.n !== undefined) return S.n ? "Coupled with " + S.n + " ATP: net ΔG = " + sgn(r.dg) + " + " + S.n + " × (−30.5) = " + kj(netOf()) + "." : "No ATP coupled: net ΔG is the reaction’s own " + kj(r.dg) + ".";
    if (patch.conv) return "";
    return "";
  }
  function change(patch){
    stop();
    var before = { r:S.r, n:S.n };
    Object.keys(patch).forEach(function(k){ S[k] = patch[k]; });
    if (patch.r && patch.r !== before.r) S.n = 0;
    api.banner("", "");
    what = capFor(patch, before);
    api.save(); sync(); paintRead(); paintB(); paintCap(); MV.changed();
    if (patch.mode || patch.r || patch.conv || (patch.enz !== undefined && rx().steps)) { snap(); draw(); }
    else tweenTo(800, null);
  }
  function runBall(done){
    stop();
    var ea = eaOf(), net = netOf(), kind = net >= 0 ? "back" : ea >= 90 ? "stuck" : ea >= 50 ? "slow" : "fast", cp = S.n > 0, dur, pos;
    snap();
    if (kind === "back") { var xc = xAtFrac(0.6); dur = 2600; pos = function(k){ return [XS + (xc - XS) * Math.sin(Math.PI * k), XS]; }; }
    else if (kind === "stuck") { var xr = xAtFrac(0.3); dur = 3600; pos = function(k){ return [XS + (xr - XS) * (1 - Math.cos(6 * Math.PI * k)) / 2, XS]; }; }
    else if (kind === "slow") { var xr2 = xAtFrac(0.5); dur = 5200; pos = function(k){ if (k < 0.5) return [XS + (xr2 - XS) * (1 - Math.cos(8 * Math.PI * k)) / 2, XS]; var q = MV.ease((k - 0.5) / 0.5); return [lerp(XS, XE, q), lerp(XS, XE, q)]; }; }
    else { dur = 2200; pos = function(k){ var q = MV.ease(k); return [lerp(XS, XE, q), lerp(XS, XE, q)]; }; }
    runBtn.disabled = true; api.banner("", ""); what = "Running…"; paintCap();
    runAnim = MV.tween({ dur:dur, ease:lin, step:function(k){ var q = pos(k); disp.ball = q[0]; disp.atpBall = cp ? q[1] : null; draw(); },
      done:function(){ runAnim = null; runBtn.disabled = false; api.banner("", C.runMsg[kind]); what = C.runMsg[kind]; paintCap(); draw(); if (done) done(); } });
  }
  runBtn.addEventListener("click", function(){ if (!runBtn.disabled) runBall(null); });
  $("#em-reset", host).addEventListener("click", function(){ stop(); snap(); api.banner("", ""); what = ""; paintCap(); draw(); });
  $("#em-more", host).addEventListener("click", function(e){ var dl = $("#em-read", host), open = !dl.classList.contains("open"); dl.classList.toggle("open", open); e.currentTarget.setAttribute("aria-expanded", String(open)); e.currentTarget.textContent = open ? "Fewer rows" : "More rows"; });
  snap(); sync(); paintRead(); paintB(); paintCap(); draw();

  function chal(id){
    var c = byId(C.challenges, id), N = c.named || {};
    if (id === "tc3") {
      if (S.mode !== "B") return { ok:false, msg:N.mode };
      if (S.conv !== "B1") return { ok:false, msg:N.conv };
      if (S.blocked) return { ok:false, msg:N.blocked };
      if (S.useful === 40) return { ok:true };
      if (S.useful === 35) return { ok:false, msg:N.u35 };
      if (S.useful === 30) return { ok:false, msg:N.u30 };
      return { ok:false, msg:c.general };
    }
    if (S.mode !== "A") return { ok:false, msg:N.mode };
    if (id === "tc1") {
      if (S.r !== "R5") return { ok:false, msg:N.rx };
      if (S.n === 1) return { ok:true };
      if (S.n >= 2) return { ok:false, msg:N.spare };
      if (S.enz) return { ok:false, msg:N.enz0 };
      return { ok:false, msg:N.zero };
    }
    if (id === "tc2") {
      if (S.r !== "R6") return { ok:false, msg:N.rx };
      if (S.n === 2 && S.enz) return { ok:true };
      if (S.n === 3 && S.enz) return { ok:false, msg:N.n3 };
      if (S.n >= 2) return { ok:false, msg:N.noEnz };
      if (S.n === 1) return { ok:false, msg:N.n1 };
      return { ok:false, msg:N.zero };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        stop(); var s = p.start;
        S.mode = "A"; S.r = s.r; S.enz = s.enz; S.n = s.n; S.blocked = false;
        snap(); what = ""; api.banner("", ""); api.save(); sync(); paintRead(); paintCap(); draw(); MV.changed();
      },
      run:function(p, done){
        function fin(){ var d = pend; pend = null; if (d) MV.wait(350, d); }
        if (p.act === "run") { runBall(fin); pend = done; return; }
        var r = rx();
        if (p.act === "enzyme") {
          S.enz = true; api.save(); sync(); paintRead(); MV.changed();
          what = ""; paintCap();
          tweenTo(2000, function(){ what = "The hill shrank from " + r.ea + " to " + r.eaE + " kJ/mol. The ΔG bracket stayed at " + kj(r.dg) + "."; paintCap(); fin(); });
        } else {
          S.n = 1; api.save(); sync(); paintRead(); MV.changed();
          what = ""; paintCap();
          tweenTo(2000, function(){ what = "The orange ATP diagram slid in under the reaction. Net ΔG: " + sgn(r.dg) + " + (−30.5) = " + kj(netOf()) + "."; paintCap(); fin(); });
        }
        pend = done;
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: Enzymes and their control ----------
// @component enzymeZoom (rewritten from SBI4U 04's rubisco zoom) — schematic enzyme with an active-site pocket that grips the substrate
// (induced fit) or fits it rigidly (lock and key), an optional allosteric notch, distortion when denatured, and a bent-shut site.
// enzymeSVG(cx, cy, scale, {g 0…1 grip, lock, d 0…1 denatured, shut 0…1, allo, cls}) — local body ±96 × ±54, mouth at y = −50.
function crPath(pts){
  var d = "";
  for (var i = 0; i < pts.length - 1; i++) {
    var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += " C" + f1(p1[0] + (p2[0] - p0[0]) / 6) + " " + f1(p1[1] + (p2[1] - p0[1]) / 6) + " " + f1(p2[0] - (p3[0] - p1[0]) / 6) + " " + f1(p2[1] - (p3[1] - p1[1]) / 6) + " " + f1(p2[0]) + " " + f1(p2[1]);
  }
  return d;
}
var FIT = [[-20, -50], [-20, -40], [0, -20], [20, -40], [20, -50]], OPEN = [[-28, -50], [-28, -44], [0, -27], [28, -44], [28, -50]], SHUT = [[-5, -50], [-5, -47], [0, -42], [5, -47], [5, -50]];
function enzPathD(o){
  var g = o.lock ? 0 : (o.g || 0), d = o.d || 0, s = o.shut || 0;
  var pk = (o.lock ? FIT : OPEN).map(function(p, i){ return [lerp(p[0], FIT[i][0], g), lerp(p[1], FIT[i][1], g)]; });
  pk = pk.map(function(p, i){ return [lerp(p[0], SHUT[i][0], s), lerp(p[1], SHUT[i][1], s)]; });
  var lip = 7 * g * (1 - s); pk[0][1] -= lip; pk[4][1] -= lip;
  if (d) { pk[2][0] += 15 * d; pk[2][1] -= 13 * d; pk[1][0] -= 9 * d; pk[3][1] += 7 * d; pk[0][0] -= 7 * d; pk[4][1] -= 9 * d; pk[4][0] += 6 * d; }
  var right = [[45, -54], [80, -42], [96, -6], [86, 30], [62, 47]], left = [[0, 52], [-44, 49], [-84, 32], [-96, -4], [-80, -42], [-45, -54]];
  if (d) {
    right = right.map(function(p, i){ return [p[0] + 6 * d * Math.cos(i * 2.3 + 1), p[1] + 8 * d * Math.sin(i * 1.9 + 0.5)]; });
    left = left.map(function(p, i){ return [p[0] + 6 * d * Math.cos(i * 2.1 + 2), p[1] + 8 * d * Math.sin(i * 1.7 + 1.5)]; });
  }
  var path = "M" + f1(pk[4][0]) + " " + f1(pk[4][1]) + crPath([pk[4]].concat(right));
  if (o.allo) path += " L52 33 L40 48" + crPath([[40, 48]].concat(left, [pk[0]]));
  else path += crPath([right[right.length - 1], [52, 49]].concat(left, [pk[0]]));
  return path + " L" + pk.slice(1, 4).map(function(p){ return f1(p[0]) + " " + f1(p[1]); }).join(" L") + " Z";
}
function enzymeSVG(cx, cy, sc, o){
  o = o || {};
  var h = sv("path", { d:enzPathD(o), "class":o.cls || "ez-enz", "vector-effect":"non-scaling-stroke" });
  if (o.inh) h += sv("polygon", { points:"42,48 52,36 62,47", "class":o.inhCls || "ez-allo", "vector-effect":"non-scaling-stroke" });
  if (o.inner) h += o.inner;
  return '<g transform="translate(' + f1(cx) + " " + f1(cy) + ") scale(" + sc + ')">' + h + "</g>";
}
// molecule shapes (top-centre at x, y): substrate pentagon, its two halves, competitor (notched top)
function polyAt(pts, x, y, sc){ return pts.map(function(p){ return f1(x + p[0] * sc) + "," + f1(y + p[1] * sc); }).join(" "); }
var SUBP = [[-20, 0], [20, 0], [20, 10], [0, 30], [-20, 10]], HL = [[-20, 0], [0, 0], [0, 30], [-20, 10]], HR = [[0, 0], [20, 0], [20, 10], [0, 30]], COMP = [[-20, 0], [-7, 0], [0, 7], [7, 0], [20, 0], [20, 10], [0, 30], [-20, 10]];
function subSVG(x, y, sc, cls){ return sv("polygon", { points:polyAt(SUBP, x, y, sc || 1), "class":cls || "ez-sub" }); }
function compSVG(x, y, sc){ return sv("polygon", { points:polyAt(COMP, x, y, sc || 1), "class":"ez-comp" }); }
function triD(x, y, sc){ return sv("polygon", { points:polyAt([[0, -13], [11, 7], [-11, 7]], x, y, sc || 1), "class":"ez-dtok" }); }
function lead(x1, y1, x2, y2){ return sv("line", { x1:x1, y1:y1, x2:x2, y2:y2, "class":"ez-lead" }); }
// temperature / pH model (model enzyme: optimum 37 °C, pH 7; denatures above about 45 °C)
function actT(T){ return T <= 37 ? Math.pow(2, (T - 37) / 10) : T <= 45 ? 1 - 0.3 * (T - 37) / 8 : Math.max(0, 0.7 * (1 - (T - 45) / 6)); }
function actPH(p){ return Math.exp(-Math.pow((p - 7) / 1.6, 2)); }
function dT(T){ return T <= 40 ? 0 : T <= 45 ? 0.12 * (T - 40) / 5 : Math.min(1, 0.12 + 0.88 * (T - 45) / 5); }
function dPH(p){ var e = Math.abs(p - 7); return e <= 1.5 ? 0 : Math.min(1, (e - 1.5) / 2.5); }
// rate models (plan: exact model curves)
function rN(s){ return 100 * s / (2 + s); }
function rC(s){ return 100 * s / (6 + s); }
function rA(s){ return 50 * s / (2 + s); }
var MOLPOS = (function(){
  var out = [];
  [0, 1].forEach(function(k){ var r = MV.bio.rng("ez-mol" + k), pts = [], n = 0, cx = 90 + 180 * k;
    while (pts.length < 12 && n++ < 8000) { var x = r.range(cx - 82, cx + 82), y = r.range(30, 146); if (Math.abs(x - cx) < 64 && y > 62 && y < 140) continue; if (Math.abs(x - cx) < 22 && y < 74) continue; if (pts.some(function(p){ return Math.hypot(p[0] - x, p[1] - y) < (pts.length < 10 ? 22 : 16); })) continue; pts.push([x, y]); }
    while (pts.length < 12) pts.push([cx - 76 + 13 * pts.length, 146]);
    out.push(pts); });
  return out;
})();

function part3(host, api){
  var P = api.content, S = api.S;
  if (S.model !== "lock") S.model = "induced";
  if (S.T == null) S.T = 37; if (S.pH == null) S.pH = 7; if (S.sub == null) S.sub = 2; if (S.D == null) S.D = 0;
  host.innerHTML = '<div class="ez-p3">' +
    '<section class="ez-st" aria-labelledby="ez-h1"><h3 id="ez-h1">' + P.st1.title + "</h3><p>" + P.st1.how + "</p>" +
      '<div class="ez-row"><figure class="ez-fig"><div class="ez-stage ez-stage1"><svg id="ez-s1" viewBox="0 0 360 230" role="img" focusable="false"></svg></div><figcaption class="ez-cap" id="ez-cap1" aria-live="polite"></figcaption><div id="ez-play"></div></figure>' +
      '<div class="ez-side"><div id="ez-model"></div><div id="ez-T"></div><div id="ez-pH"></div><dl class="read ez-read" id="ez-r1" aria-live="polite"></dl><p class="tiny muted"><span class="bio-model">Model</span> ' + P.st1.note + "</p></div></div></section>" +
    '<section class="ez-st" aria-labelledby="ez-h2"><h3 id="ez-h2">' + P.st2.title + "</h3><p>" + P.st2.how + "</p>" +
      '<div class="ez-row"><div class="ez-gwrap"><div class="plot-wrap"><canvas class="plot" id="ez-rate" role="img" aria-label="Rate against substrate concentration"></canvas></div><p class="ez-cap" id="ez-cap2" aria-live="polite"></p></div>' +
      '<div class="ez-side"><div id="ez-S"></div><div class="ez-stage ez-stage2"><svg id="ez-s2" viewBox="0 0 360 160" role="img" focusable="false"></svg></div><p class="tiny ez-leg2"><span class="ez-k ez-k-sub"></span>substrate <span class="ez-k ez-k-comp"></span>competitive inhibitor <span class="ez-k ez-k-allo"></span>allosteric inhibitor</p>' +
        '<p class="tiny">' + P.st2.comp + "</p><p class=\"tiny\">" + P.st2.allo + "</p></div></div>" +
      '<details class="alg ez-data" open><summary>Check it with data</summary><p class="tiny muted">' + P.st2.curves + '</p><div id="ez-tbl"></div><p class="ez-key"><strong>' + P.st2.key + "</strong></p></details></section>" +
    '<section class="ez-st" aria-labelledby="ez-h3"><h3 id="ez-h3">' + P.st3.title + "</h3><p>" + P.st3.how + "</p>" +
      '<div class="ez-row"><figure class="ez-fig ez-fig3"><div class="ez-stage ez-stage3"><svg id="ez-s3" viewBox="0 0 520 232" role="img" focusable="false"></svg></div></figure>' +
      '<div class="ez-side"><div id="ez-D"></div><div class="ez-flow" id="ez-flow"></div><dl class="read ez-read" id="ez-r3" aria-live="polite"></dl></div></div><p class="ez-ex">' + P.st3.example + "</p></section></div>";

  // ---- Station 1: active site step-through ----
  var s1 = $("#ez-s1", host), s1Prev = null, s1i = 0, s1Anim = null;
  function dist(){ return Math.max(dT(S.T), dPH(S.pH)); }
  function pose(i){
    var lock = S.model === "lock", d = dist();
    if (d >= 0.5 && i >= 1) return { hx:0, hy:60, g:0 };
    return [{ hx:0, hy:22, g:0 }, { hx:0, hy:112, g:lock ? 0 : 1 }, { hx:0, hy:112, g:lock ? 0 : 1, halo:true }, { hx:34, hy:72, g:lock ? 0 : 0.4, strain:true }, { hx:124, hy:30, g:0 }][i];
  }
  function s1SVG(i, q){
    var lock = S.model === "lock", d = dist(), den = d >= 0.5, h = "";
    if (q.halo && !den) h += sv("rect", { x:72, y:96, width:216, height:128, rx:22, "class":"ez-halo" });
    h += enzymeSVG(180, 162, 1, { g:q.g, lock:lock, d:d });
    h += txt(180, 190, den ? "enzyme (denatured)" : "enzyme", "ez-lab", "middle");
    if (q.hx < 0.5) h += subSVG(180, q.hy, 1);
    else h += sv("polygon", { points:polyAt(HL, 180 - q.hx, q.hy, 1), "class":"ez-sub" }) + sv("polygon", { points:polyAt(HR, 180 + q.hx, q.hy, 1), "class":"ez-sub" });
    if (q.strain && !den) h += sv("path", { d:"M180 " + f1(q.hy - 4) + " l-5 6 l5 6 l-5 6 l5 6 l-5 6", "class":"ez-strain" });
    // labels for the step being shown
    if (i === 0) { h += txt(208, 40, "substrate", "ez-lab"); h += txt(16, 92, "active site", "ez-lab") + lead(86, 96, 160, 116); }
    else if (den) h += txt(16, 92, "active site lost its shape", "ez-lab") + lead(60, 98, 168, 118) + txt(214, 58, "substrate can’t bind", "ez-lab");
    else if (i === 1) h += txt(16, 92, lock ? "rigid active site: exact fit" : "active site grips the substrate", "ez-lab") + lead(70, 98, 160, 112);
    else if (i === 2) h += txt(180, 88, "enzyme–substrate complex", "ez-lab ez-lab-b", "middle");
    else if (i === 3) h += txt(246, 90, "bonds strain", "ez-lab") + txt(180, 52, "products", "ez-lab ez-lab-b", "middle");
    else h += txt(56, 82, "products", "ez-lab", "middle") + txt(304, 82, "products", "ez-lab", "middle") + txt(180, 92, "enzyme unchanged, ready again", "ez-lab ez-lab-b", "middle");
    return h;
  }
  function s1Draw(from, to, k){
    var a = pose(from), b = pose(to), q = { hx:lerp(a.hx, b.hx, k), hy:lerp(a.hy, b.hy, k), g:lerp(a.g, b.g, k), halo:k > 0.6 && b.halo, strain:k > 0.4 && b.strain };
    s1.innerHTML = sv("rect", { x:0, y:0, width:360, height:230, rx:8, "class":"ez-bg" }) + s1SVG(to, q);
    var d = dist(), cap = to === 1 && S.model === "lock" ? P.st1.lock : P.st1.steps[to];
    if (d >= 0.5 && to >= 1) cap = P.st1.denat; else if (d >= 0.15 && to >= 1) cap += " " + P.st1.poor;
    $("#ez-cap1", host).innerHTML = "<strong>Step " + (to + 1) + ".</strong> " + cap;
    s1.setAttribute("aria-label", "Step " + (to + 1) + " of 5, " + (S.model === "lock" ? "lock-and-key model" : "induced-fit model") + ", " + S.T + " °C, pH " + MV.num(S.pH, 1) + ". " + MV.plain(cap));
  }
  function s1Go(i){
    if (s1Anim) { s1Anim(); s1Anim = null; }
    var from = s1Prev; s1Prev = i; s1i = i;
    if (from === null || i !== from + 1 || MV.reduceMotion) { s1Draw(i, i, 1); return; }
    s1Anim = MV.tween({ dur:1000, ease:MV.ease, step:function(k){ s1Draw(from, i, k); }, done:function(){ s1Anim = null; s1Draw(i, i, 1); } });
  }
  function s1Read(){
    var d = dist(), act = Math.round(actT(S.T) * actPH(S.pH) * 100 * (d >= 0.5 ? 0 : 1));
    $("#ez-r1", host).innerHTML = MV.readoutHTML([["Conditions", S.T + " °C, pH " + MV.num(S.pH, 1)], ["Active site", d < 0.15 ? "Normal shape" : d < 0.5 ? "Distorted" : "Lost its shape (denatured)"], ["Relative activity", act + '% <span class="bio-model">model</span>']]);
  }
  function s1Redraw(){ if (s1Anim) { s1Anim(); s1Anim = null; } s1Draw(s1i, s1i, 1); s1Read(); }
  radios($("#ez-model", host), { label:"Model", options:[{ id:"induced", t:"Induced fit" }, { id:"lock", t:"Lock and key" }], value:S.model, onChange:function(v){ S.model = v; api.save(); s1Redraw(); } });
  slider($("#ez-T", host), { id:"ez-t", label:"Temperature", min:0, max:60, step:1, value:S.T, unit:function(v){ return v + " °C"; }, onChange:function(v){ S.T = v; api.save(); s1Redraw(); } });
  slider($("#ez-pH", host), { id:"ez-ph", label:"pH", min:2, max:12, step:0.5, value:S.pH, unit:function(v){ return "pH " + MV.num(v, 1); }, onChange:function(v){ S.pH = v; api.save(); s1Redraw(); } });
  MV.player($("#ez-play", host), { count:5, render:s1Go, label:function(i){ return "Step " + (i + 1) + " of 5: " + P.st1.short[i]; }, interval:2800 });
  s1Read();

  // ---- Station 2: rate vs substrate with inhibitors (@component S7 rateProbe — curves, probe, data table) ----
  var rp = new MV.Plot($("#ez-rate", host), { xmin:-1.6, xmax:21.5, ymin:-10, ymax:114 });
  rp.render = function(){
    var css = MV.css, s = S.sub, pen = css("--pen"), te = css("--f3"), vi = css("--acol"), ink = css("--ink"), ink2 = css("--ink-2"), uf = "600 12px " + (css("--font-ui") || "sans-serif");
    rp.draw({ view:{ xmin:-1.6, xmax:21.5, ymin:-10, ymax:114 }, xTicks:{ step:4 }, yTicks:{ step:20 }, xLabel:"S (mM)", yLabel:"rate (model units)",
      asymptotes:[{ y:100, label:"", color:ink2 }],
      curves:[{ f:rN, color:pen, width:3, domain:[0, 20.6] }, { f:rC, color:te, width:3, dash:[9, 6], domain:[0, 20.6] }, { f:rA, color:vi, width:3.4, dash:[1, 6], domain:[0, 20.6] }],
      segments:[{ x1:s, y1:0, x2:s, y2:108, color:ink2, width:1.5, dash:[4, 4] }],
      points:[{ x:s, y:rN(s), color:pen, r:5.5 }, { x:s, y:rC(s), color:te, r:5.5 }, { x:s, y:rA(s), color:vi, r:5.5 }],
      labels:[{ x:12.5, y:rN(12.5), text:"no inhibitor", align:"left", dy:-13, bg:true, color:ink, font:uf }, { x:12.5, y:rC(12.5), text:"competitive", align:"left", dy:14, bg:true, color:ink, font:uf },
        { x:12.5, y:rA(12.5), text:"allosteric", align:"left", dy:-13, bg:true, color:ink, font:uf }, { x:0.4, y:100, text:"saturation: 100", align:"left", dy:-10, color:ink2, font:"400 11px " + (css("--font-ui") || "sans-serif"), bg:true }],
      describe:"Rate against substrate concentration S, 0 to 20 mM (model curves). No inhibitor (solid) rises and levels off at 100. Competitive inhibitor (dashed) rises more slowly but approaches 100. Allosteric inhibitor (dotted) levels off at 50. Probe at S = " + s + " mM: " + MV.num(rN(s), 1) + ", " + MV.num(rC(s), 1) + " and " + MV.num(rA(s), 1) + "." });
  };
  function s2Mol(){
    var s = S.sub, nTok = Math.round(s / 2), h = sv("rect", { x:0, y:0, width:360, height:160, rx:8, "class":"ez-bg" }) + sv("line", { x1:180, y1:10, x2:180, y2:150, "class":"ez-div" });
    h += txt(90, 20, "Competitive", "ez-lab ez-lab-b", "middle") + txt(270, 20, "Allosteric", "ez-lab ez-lab-b", "middle");
    // competitive panel: whoever holds the site; substrate wins from S = 6 mM (where the model rate is half of 100)
    var wins = s >= 6;
    h += enzymeSVG(90, 104, 0.6, { g:1, allo:true });
    h += wins ? subSVG(90, 74, 0.6) : compSVG(90, 74, 0.6);
    MOLPOS[0].slice(0, nTok).forEach(function(p){ h += subSVG(p[0], p[1], 0.42); });
    h += compSVG(MOLPOS[0][11][0], MOLPOS[0][11][1], 0.42) + compSVG(MOLPOS[0][10][0], MOLPOS[0][10][1], 0.42);
    // allosteric panel: inhibitor in the second site, active site bent shut
    h += enzymeSVG(270, 104, 0.6, { shut:1, allo:true, inh:true });
    MOLPOS[1].slice(0, nTok).forEach(function(p){ h += subSVG(p[0], p[1], 0.42); });
    $("#ez-s2", host).innerHTML = h;
    $("#ez-s2", host).setAttribute("aria-label", "Molecular view at S = " + s + " mM. Left, competitive: " + (wins ? "substrate now holds the active site; the competitor is out-numbered." : "the competitor sits in the active site.") + " Right, allosteric: the inhibitor sits in a second site and the active site is bent shut, so no substrate binds.");
  }
  function s2Table(){
    var rows = []; for (var s = 0; s <= 20; s += 2) rows.push(s);
    MV.keepFocus($("#ez-tbl", host), function(){
      $("#ez-tbl", host).innerHTML = '<div class="tbl-wrap ez-tw"><table class="ez-tbl"><caption class="vh">Model data: rate at each substrate concentration</caption><thead><tr><th scope="col"><i>S</i> (mM)</th><th scope="col">No inhibitor</th><th scope="col">Competitive</th><th scope="col">Allosteric</th></tr></thead><tbody>' +
        rows.map(function(v){ var on = v === S.sub; return "<tr" + (on ? ' class="on"' : "") + '><th scope="row">' + (on ? '<span aria-hidden="true">▸ </span>' : "") + v + "</th><td>" + MV.num(rN(v), 1) + "</td><td>" + MV.num(rC(v), 1) + "</td><td>" + MV.num(rA(v), 1) + "</td></tr>"; }).join("") + "</tbody></table></div>";
    });
  }
  function s2Cap(){
    var s = S.sub, extra = s <= 4 && s > 0 ? " At low substrate both inhibitors look the same." : s >= 14 ? " Lots of substrate: the competitive inhibitor is out-competed, but the allosteric one isn’t." : "";
    $("#ez-cap2", host).innerHTML = "<strong><i>S</i> = " + s + " mM:</strong> no inhibitor " + MV.num(rN(s), 1) + ", competitive " + MV.num(rC(s), 1) + ", allosteric " + MV.num(rA(s), 1) + " (model units)." + extra;
  }
  function s2All(){ rp.render(); s2Mol(); s2Table(); s2Cap(); }
  slider($("#ez-S", host), { id:"ez-sub", label:"Substrate concentration, <i>S</i>", min:0, max:20, step:2, value:S.sub, unit:function(v){ return v + " mM"; }, onChange:function(v){ S.sub = v; api.save(); s2All(); } });
  s2Mol(); s2Table(); s2Cap();

  // ---- Station 3: feedback inhibition (@component S2 pathwayStepper, feedback form) ----
  var CX = [36, 160, 284, 408];
  function s3SVG(){
    var D = S.D, flow = 100 - 9 * D, w = 1.5 + 4 * flow / 100, h = sv("rect", { x:0, y:0, width:520, height:232, rx:8, "class":"ez-bg" });
    ["A", "B", "C", "D"].forEach(function(n, i){ h += sv("rect", { x:CX[i] - 25, y:101, width:50, height:34, rx:8, "class":"ez-cpd" }) + txt(CX[i], 123, n, "ez-cpdt", "middle"); });
    [0, 1, 2].forEach(function(i){
      var x1 = CX[i] + 27, x2 = CX[i + 1] - 29;
      h += sv("line", { x1:x1, y1:118, x2:x2 - 6, y2:118, "class":"ez-flowl", "stroke-width":f1(w) }) + sv("path", { d:"M" + (x2 - 8) + " " + f1(118 - 4 - w) + " L" + x2 + " 118 L" + (x2 - 8) + " " + f1(118 + 4 + w) + " Z", "class":"ez-flowh" });
      var ex = (CX[i] + CX[i + 1]) / 2, shut = i === 0 && D > 0 ? 0.35 + 0.65 * D / 10 : 0;
      h += enzymeSVG(ex, 168, 0.4, { g:1, allo:i === 0, shut:shut, inh:i === 0 && D > 0, inhCls:"ez-dtok" }) + txt(ex, 174, "enzyme " + (i + 1), "ez-lab ez-lab-s", "middle");
    });
    // feedback arrow from D to enzyme 1's allosteric site, in ink with a minus sign
    h += sv("path", { d:"M408 137 C414 228, 162 234, 121 204", "class":"ez-fb" }) + sv("path", { d:"M113 205 L119 192 L127 203 Z", "class":"ez-fbh" });
    h += sv("circle", { cx:282, cy:215, r:11, "class":"ez-minus" }) + txt(282, 220, "−", "ez-minust", "middle");
    // pool of D: one token per unit
    for (var k = 0; k < D; k++) h += triD(446 + (k % 5) * 15, 92 + Math.floor(k / 5) * 22, 0.62);
    h += txt(476, 140, "D: " + D, "ez-lab", "middle");
    // intermediates stay low
    h += txt(222, 92, "B and C don’t pile up", "ez-lab ez-lab-s", "middle");
    return h;
  }
  function s3All(){
    var D = S.D, flow = 100 - 9 * D, el = $("#ez-s3", host);
    el.innerHTML = s3SVG();
    el.setAttribute("aria-label", "Pathway A to B to C to D with enzymes 1, 2 and 3. An arrow with a minus sign runs from D back to enzyme 1’s allosteric site. D = " + D + " units; flow through the pathway " + flow + "%. " + (D ? "D is bound to enzyme 1, so its active site is " + (D >= 7 ? "nearly shut." : "partly shut.") : "Enzyme 1 is free."));
    $("#ez-flow", host).innerHTML = '<p class="ez-fl"><span>Flow through the pathway</span><b>' + flow + '%</b></p><span class="ez-ft" aria-hidden="true"><i style="width:' + flow + '%"></i></span>';
    $("#ez-r3", host).innerHTML = MV.readoutHTML([["End product D", D + " units"], ["Enzyme 1", D ? "D bound at its allosteric site: active site " + (D >= 7 ? "nearly shut" : "partly shut") : "Free: active site open"], ["Intermediates B and C", "Low: nothing piles up"], ["Flow through pathway", flow + '% <span class="bio-model">model</span>']]);
  }
  slider($("#ez-D", host), { id:"ez-d", label:"End product D", min:0, max:10, step:1, value:S.D, unit:function(v){ return v + " units of D"; }, short:function(v){ return v + " units"; }, onChange:function(v){ S.D = v; api.save(); s3All(); } });
  s3All();
  return {};
}

// ---------- Practice 2: ΔG calculator (custom N4: ΔG answers need their sign; one two-box item; adapted from SBI4U 06 calc) ----------
function parseVal(raw){
  var s = String(raw == null ? "" : raw).replace(/,/g, ".").replace(/[−–]/g, "-").replace(/[^0-9.+\-\/]+/g, " ").trim().split(/\s+/)[0] || "";
  var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null;
}
function hasSign(raw){ return /^\s*[+\-−–]/.test(String(raw == null ? "" : raw)); }
function calc(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {}, SIGN = "Include the sign: + for endergonic (uphill), − for exergonic (downhill).";
  function ist(id){ var x = S.items[id] || (S.items[id] = { val:"", vals:["", ""], tries:0, hint:0, solved:false, first:null }); if (!x.vals) x.vals = ["", ""]; return x; }
  host.innerHTML = '<p class="how">Type your answer, then press Check. Write ΔG values with a + or − sign, such as +12 or −7.5.</p>' + a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function near(v, t, tol){ return Math.abs(v - t) <= (tol || 1e-6 * Math.max(1, Math.abs(t))); }
  function box(it, x, k, lab, unit){
    var id = "li-" + it.id + (k == null ? "" : k), v = k == null ? x.val : x.vals[k];
    return '<div class="numrow"><label for="' + id + '">' + lab + '</label><input class="numin" id="' + id + '" data-lin="' + it.id + '"' + (k == null ? "" : ' data-ix="' + k + '"') + ' type="text" inputmode="text" autocomplete="off" value="' + MV.esc(v) + '"' + (x.solved ? " disabled" : "") + ">" + (unit ? '<span class="em-unit">' + unit + "</span>" : "") + "</div>";
  }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), el = host.querySelector('[data-li="' + it.id + '"]');
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + MV.usesHTML(it.use) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    h += it.kind === "pair" ? '<div class="em-pair">' + box(it, x, 0, it.labels[0] + ":", "ATP") + box(it, x, 1, it.labels[1] + ":", "") + "</div>" : box(it, x, null, "Your answer:", it.unit);
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lin; if (!id) return; var x = ist(id); if (e.target.dataset.ix != null) x.vals[+e.target.dataset.ix] = e.target.value; else x.val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lin) { var b = host.querySelector('[data-k="' + e.target.dataset.lin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var el = b.closest("[data-li]"); if (!el) return;
    var it = byId(a.items, el.dataset.li), x = ist(it.id), ok = false, ans = MV.ans(it);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it); return; }
    if (b.dataset.act !== "check") return;
    if (it.kind === "pair") {
      var v0 = parseVal(x.vals[0]), v1 = parseVal(x.vals[1]);
      if (v0 == null || v1 == null) { msgs[it.id] = "Enter a number in both boxes, such as 2 and −4.5."; paintItem(it); return; }
      if (v1 !== 0 && !hasSign(x.vals[1])) { msgs[it.id] = SIGN; paintItem(it); return; }
      ok = near(v0, ans[0]) && near(v1, ans[1]);
      msgs[it.id] = ok ? null : "<strong>✗ Not quite.</strong> " + it.general + " Try again.";
    } else {
      var v = parseVal(x.val);
      if (v == null) { msgs[it.id] = it.kind === "dg" ? "Enter a ΔG value with its sign, such as +12 or −7.5." : "Enter a number, such as 3 or 50."; paintItem(it); return; }
      if (it.kind === "dg" && v !== 0 && !hasSign(x.val)) { msgs[it.id] = SIGN; paintItem(it); return; }
      ok = near(v, ans, it.tol);
      if (!ok) {
        var w = (it.wrong || []).filter(function(q){ return near(v, q.match, it.tol); })[0];
        var fb = w ? w.fb : it.unit === "%" && near(v, ans / 100, 0.012) ? "That’s the fraction captured. Multiply by 100 for the percentage." : it.general || "Check your working and try again.";
        msgs[it.id] = "<strong>✗ Not quite.</strong> " + fb + (/Try again\.?$/.test(fb) ? "" : " Try again.");
      } else msgs[it.id] = null;
    }
    if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
    api.save(); paintItem(it); MV.focusFb(el);
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Couple it, don't waste it ----------
var task = (function(){
  var api = null, T = null, plot = null;
  function st(){ var s = api.S; if (s.dg == null) s.dg = 14; if (s.n == null) s.n = 0; s.enz = !!s.enz; return s; }
  function read(){ if (!api) return { dg:14, n:0, enz:false }; var s = st(); return { dg:+s.dg, n:+s.n, enz:!!s.enz }; }
  function net(d){ return d.dg + ATP_DG * d.n; }
  function parse(k){ var m = /dg(\d+)-n(\d)-e(\d)/.exec(k) || [0, 0, 0, 0]; return { dg:+m[1], n:+m[2], enz:m[3] === "1" }; }
  function text(d){ return "+" + d.dg + " kJ/mol, " + d.n + " ATP, " + (d.enz ? "enzyme" : "no enzyme") + ": net " + sgn(net(d)) + " kJ/mol"; }
  function draw(){
    var d = read(); if (!plot) return;
    plot.render();
    var el = $("#em-tnet"); if (el) el.innerHTML = "Net ΔG = +" + d.dg + (d.n ? " + " + d.n + " × (−30.5)" : "") + " = <strong>" + kj(net(d)) + "</strong>" + (net(d) < 0 ? " (exergonic)" : " (not exergonic)") + ". Hill: " + (d.enz ? "40" : "100") + " kJ/mol.";
  }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content; var s = st();
      inp.innerHTML = '<div class="em-tin"><div id="em-tr"></div><div id="em-tn"></div><div id="em-te"></div></div>';
      function upd(){ a.save(); draw(); a.update(); }
      radios($("#em-tr"), { label:"Reaction ΔG", cls:"chips", options:T.reactions.map(function(v){ return { id:v, t:"+" + v + " kJ/mol" }; }), value:s.dg, onChange:function(v){ s.dg = +v; upd(); } });
      stepper($("#em-tn"), { id:"em-tns", label:"ATP coupled", min:0, max:4, value:s.n, unit:function(v){ return v + " ATP"; }, onChange:function(v){ s.n = v; upd(); } });
      radios($("#em-te"), { label:"Enzyme", options:[{ id:"0", t:"None" }, { id:"1", t:"Present" }], value:s.enz ? "1" : "0", onChange:function(v){ s.enz = v === "1"; upd(); } });
      pv.innerHTML = '<div class="em-tpv"><h4>Your design</h4><div class="plot-wrap"><canvas class="plot" id="em-tcv" role="img" aria-label="Energy diagram of your design"></canvas></div><p class="em-tnet" id="em-tnet" aria-live="polite"></p><p class="tiny muted"><span class="bio-model">Model</span> ' + T.modelNote + "</p></div>";
      plot = new MV.Plot($("#em-tcv"), { xmin:0, xmax:1, ymin:0, ymax:1 });
      plot.render = function(){
        var d = read(), ea = d.enz ? 40 : 100;
        drawLandscape(plot, { dg:d.dg, ea:ea, eaUnc:100, steps:0, showUnc:d.enz, rl:"reactants", pl:"products", atp:d.n ? { n:d.n, k:1, ea:d.enz ? 50 : 120 } : null, ball:null, eaLab:true,
          describe:"Energy diagram of your design (model values): a reaction with ΔG +" + d.dg + " kJ/mol and a hill of " + ea + " kJ/mol" + (d.n ? ", coupled with " + d.n + " ATP (orange diagram underneath)" : ", not coupled") + ". Net ΔG " + kj(net(d)) + "." });
      };
      draw();
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){ setTimeout(function(){
        var g = $("#task-fb .fb.good"); if (!g || MV.taskState().found.length < 3) return;
        var ps = g.querySelectorAll("p"); if (ps[1] && T.more) ps[1].innerHTML = ps[1].innerHTML.replace(T.more, T.allFound);
      }, 0); });
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var n = net(d); return [n < 0, d.dg + ATP_DG * (d.n - 1) >= 0, d.enz, n >= -20]; },
    key:function(d){ return "dg" + d.dg + "-n" + d.n + "-e" + (d.enz ? 1 : 0); },
    label:function(k){ return MV.esc(text(parse(k))); },
    text:function(k){ return text(parse(k)); }
  };
})();

// ---------- hero: glucose can't cross a tall hill; an enzyme lowers it to a third; glucose rolls down; ΔG unchanged ----------
function hero(f){
  var cv = f && f.canvas; if (!cv) return;
  var cap = f.cap, aria = cv.getAttribute("aria-label") || "", p = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 });
  var st = { ea:1.8, enzK:0, ball:XS, lab:["ΔG"] }, lastCap = -1;
  var CAPS = ["Glucose holds more free energy than CO₂ and water.", "Downhill overall… but the hill is in the way.", "An enzyme slides in…", "…and lowers the hill to a third.", "Glucose rolls over and down. ΔG is unchanged."];
  function setCap(i){ if (cap && i !== lastCap) { cap.textContent = CAPS[i]; lastCap = i; } }
  p.render = function(){ drawLandscape(p, { dg:-1, ea:st.ea, eaUnc:1.8, steps:0, showUnc:st.ea < 1.79, rl:"", pl:"6CO₂ + 6H₂O", schematic:true, xmax:13.4, eaLab:false, ball:st.ball, glucose:true, enzK:st.enzK, dgLab:st.lab, describe:aria }); };
  function finalFrame(){ st.ea = 0.6; st.enzK = 1; st.ball = XE; st.lab = ["ΔG", "unchanged"]; p.render(); setCap(4); }
  if (MV.reduceMotion) { finalFrame(); return; }
  var xr = xAtFrac(0.3);
  function seg(T, a, b){ return clamp((T - a) / (b - a), 0, 1); }
  function frame(T){
    if (T < 0.8) { setCap(0); st.ball = XS; }
    else if (T < 4.0) { setCap(1); st.ball = XS + (xr - XS) * (1 - Math.cos(2 * Math.PI * 3 * seg(T, 0.8, 4.0))) / 2; }
    else if (T < 5.2) { setCap(2); st.ball = XS; st.enzK = seg(T, 4.0, 5.2); }
    else if (T < 6.6) { setCap(3); st.enzK = 1; st.ea = lerp(1.8, 0.6, MV.ease(seg(T, 5.2, 6.6))); st.lab = ["ΔG", "unchanged"]; }
    else { setCap(4); st.ea = 0.6; st.ball = lerp(XS, XE, MV.ease(seg(T, 6.6, 8.8))); }
    p.render();
  }
  setCap(0); frame(0);
  MV.tween({ dur:9600, ease:lin, step:function(k){ frame(k * 9.6); }, done:finalFrame });
}

// sorter: add the plan's closing explanation under "All sorted!"
function sortNote(note){
  var host = $("#act-sort"); if (!host || !note) return;
  function add(){ var d = host.querySelector(".sort-done"); if (d && !d.querySelector(".em-sortx")) d.insertAdjacentHTML("beforeend", ' <span class="em-sortx">' + note + "</span>"); }
  new MutationObserver(add).observe(host, { childList:true, subtree:true }); add();
}

MV.module({
  hero:hero,
  explore:function(host, api){
    try { var sa = byId(MV.C.practice.activities, "sort"); sortNote(sa && sa.doneNote); } catch (e) { /* optional */ }
    return explore(host, api);
  },
  part3:part3,
  activities:{ calc:calc },
  task:task
});
})();
