// SBI4U 22 DNA Direction of Construction: hero (a fork opens one step; the leading strand follows; a new Okazaki fragment is primed,
// built away from the fork until it meets the previous one; polymerase I swaps that primer and ligase seals the nick), the fork
// board centrepiece (One fork · Replication bubble), "Proofreading and repair" (N13 step-throughs at base-pair scale, error-rate
// data, telomere model), Put the steps in order (routeBuilder with pattern feedback), Direction and counting puzzles (S5 sequence
// entry, chips, N4 numbers), "Origins on the map" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small helpers (SVG helpers from SBI4U 10 / 14 / 18) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "dd-tx", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function ln(x1, y1, x2, y2, cls){ return sv("line", { x1:x1, y1:y1, x2:x2, y2:y2, "class":cls }); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function seg(k, a, b){ return clamp((k - a) / (b - a), 0, 1); }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (String(list[i].id) === String(id)) return list[i]; return null; }
function plural(n, w){ return n + " " + w + (n === 1 ? "" : "s"); }
function star(x, y, r){ var p = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.42 : r; p.push(f1(x + rr * Math.cos(a)) + "," + f1(y + rr * Math.sin(a))); } return sv("polygon", { points:p.join(" "), "class":"dd-spark" }); }
// run steps one after another: each step is function(next)
function chain(steps, fin){ var i = 0; (function nx(){ if (i >= steps.length) { if (fin) fin(); return; } steps[i++](nx); })(); }

// ---------- @component S5 forkBoard — a replication fork (One fork) or a bubble (two forks) with tappable template positions.
// Shared by the hero and Explore. Templates: top --ink, 3′ → 5′ left to right; bottom --ink-2, 5′ → 3′. New DNA --pen grows 5′ → 3′,
// so top pieces grow right and bottom pieces grow left. RNA primers --bio-h sit at 10-nt boundaries ("positions"). A piece extends
// from its primer continuously when it grows toward a fork (leading) and 10 nt when it grows away from one (an Okazaki fragment),
// stopping at the next piece or at the fork. Piece = {b, ext, rna, seal} (seal: the nick at this piece's 5′ end is sealed).
// A primer whose 3′ end has no exposed template ahead is flagged. fkAnalyze() gives every readout and challenge test. ----------
var FW = 510, FH = 232, YT = 40, YTN = 64, YBN = 168, YB = 192, YD1 = 104, YD2 = 128;
function fkX(mode, x){ return (mode === "bub" ? 255 : 62) + 6 * x; }
function fkB(mode, open){ return mode === "bub" ? { lo:-open, hi:open } : { lo:0, hi:open }; }
function fkLead(mode, dir, b){ return mode === "bub" ? (dir > 0 ? b >= 0 : b <= 0) : dir > 0; }
function fkFlag(mode, open, dir, b){ var B = fkB(mode, open); return dir > 0 ? b >= B.hi : b <= B.lo; }
function fkSide(mode, dir, b){ return mode !== "bub" ? "A" : dir > 0 ? (b >= 0 ? "R" : "L") : (b > 0 ? "R" : "L"); }
// pieces in growth order (top: left to right; bottom: right to left)
function fkPieces(st, dir){ return (dir > 0 ? st.top : st.bot).slice().sort(function(p, q){ return dir > 0 ? p.b - q.b : q.b - p.b; }); }
// where a piece's 3′ end is (pot: where it would be once extended), for an opening that may be fractional while animating
function fkEnd(st, dir, p, open, pot){
  if (!(p.ext || pot) || fkFlag(st.mode, open, dir, p.b)) return p.b;
  var B = fkB(st.mode, open), L = fkPieces(st, dir), nx = L[L.indexOf(p) + 1];
  if (dir > 0) return Math.min(fkLead(st.mode, 1, p.b) ? Infinity : p.b + 10, nx ? nx.b : Infinity, B.hi);
  return Math.max(fkLead(st.mode, -1, p.b) ? -Infinity : p.b - 10, nx ? nx.b : -Infinity, B.lo);
}
function fkUnits(mode){
  if (mode !== "bub") return [{ id:"lead", dir:1, side:"A", role:"leading" }, { id:"lag", dir:-1, side:"A", role:"lagging" }];
  return [{ id:"tR", dir:1, side:"R", role:"leading" }, { id:"tL", dir:1, side:"L", role:"lagging" }, { id:"bR", dir:-1, side:"R", role:"lagging" }, { id:"bL", dir:-1, side:"L", role:"leading" }];
}
function fkAnalyze(st){
  var mode = st.mode, open = st.open, B = fkB(mode, open), U = fkUnits(mode);
  var out = { units:U.map(function(u){ return { u:u, segs:0, built:0, gaps:0, waits:0, used:0, frags:0, rna:0, nicks:0, flagged:0, nt:0, joins:0 }; }), used:0, rna:0, nicks:0, sealable:0 };
  function unit(dir, side){ for (var i = 0; i < U.length; i++) if (U[i].dir === dir && (U[i].side === "A" || U[i].side === side)) return out.units[i]; return out.units[0]; }
  [1, -1].forEach(function(dir){
    var L = fkPieces(st, dir), spans = [];
    L.forEach(function(p, i){
      var fl = fkFlag(mode, open, dir, p.b), e = fkEnd(st, dir, p, open, false), pe = fkEnd(st, dir, p, open, true), R = unit(dir, fkSide(mode, dir, p.b));
      R.used++; out.used++;
      if (p.rna) { R.rna++; out.rna++; }
      if (fl) R.flagged++;
      var built = p.ext && !fl;
      if (built) { R.frags++; R.nt += Math.abs(e - p.b); }
      spans.push({ fl:fl, built:built, a:Math.min(p.b, e), b:Math.max(p.b, e), pa:Math.min(p.b, pe), pb:Math.max(p.b, pe) });
      var y = L[i + 1];
      if (built && y && y.b === e) { var Y = unit(dir, fkSide(mode, dir, y.b)); if (y.seal) Y.joins++; else { Y.nicks++; out.nicks++; if (!y.rna) out.sealable++; } }
    });
    for (var k = B.lo; k < B.hi; k += 10) {
      var R = unit(dir, k >= 0 ? "R" : "L");
      var bt = spans.some(function(s){ return s.built && s.a <= k && s.b >= k + 10; }), pt = spans.some(function(s){ return !s.fl && s.pa <= k && s.pb >= k + 10; });
      R.segs++; if (bt) R.built++; else if (pt) R.waits++; else R.gaps++;
    }
  });
  out.units.forEach(function(R){ R.complete = R.segs > 0 && R.built === R.segs && !R.rna && !R.nicks && !R.flagged; });
  return out;
}
function fkPiece(st, dir, b){ var L = dir > 0 ? st.top : st.bot; for (var i = 0; i < L.length; i++) if (L[i].b === b) return L[i]; return null; }
// is template position b already inside new DNA on this strand?
function fkCovered(st, dir, b){
  return fkPieces(st, dir).some(function(p){ if (!p.ext || p.b === b) return false; var e = fkEnd(st, dir, p, st.open, false); return dir > 0 ? (b > p.b && b < e) : (b < p.b && b > e); });
}
function fkKey(dir, b){ return (dir > 0 ? "t" : "b") + b; }
// D (display): {open (may be fractional), grow:{key:0…1}, fade:{key:0…1}, born:{key:0…1}, sparks:[{dir, x, k}], ticks:[{dir, x}], hiLag}
function boardSVG(st, D, o){
  o = o || {};
  var mode = st.mode, op = D.open, B = fkB(mode, op), xl = fkX(mode, B.lo), xr = fkX(mode, B.hi), h = "", r = "", x, i;
  function X(v){ return fkX(mode, v); }
  // ---- base rungs: the duplex beyond each fork, and stubs or full pairs in the opened region ----
  for (x = xr + 21; x < 484; x += 6) r += ln(x, YD1 + 2, x, YD2 - 2, "dd-rung");
  if (mode === "bub") for (x = 37; x < xl - 20; x += 6) r += ln(x, YD1 + 2, x, YD2 - 2, "dd-rung");
  var spans = { 1:[], "-1":[] };
  [1, -1].forEach(function(dir){
    fkPieces(st, dir).forEach(function(p){
      var key = fkKey(dir, p.b), e = fkEnd(st, dir, p, op, false), g = D.grow[key];
      if (g != null) e = p.b + (e - p.b) * g;
      var pr = p.b + 2 * dir, a = dir > 0 ? p.b : Math.min(pr, e), b = dir > 0 ? Math.max(pr, e) : p.b;
      spans[dir].push({ p:p, key:key, e:e, a:a, b:b, g:g == null ? 1 : g, fl:fkFlag(mode, op, dir, p.b) });
    });
  });
  function covered(dir, n){ return spans[dir].some(function(s){ return !s.fl && n >= s.a - 0.01 && n + 1 <= s.b + 0.01; }); }
  for (i = Math.ceil(B.lo); i < Math.floor(B.hi); i++) {
    x = X(i) + 3;
    r += covered(1, i) ? ln(x, YT + 2, x, YTN - 3, "dd-pair") : ln(x, YT + 2, x, YT + 9, "dd-rung");
    r += covered(-1, i) ? ln(x, YB - 2, x, YBN + 3, "dd-pair") : ln(x, YB - 2, x, YB - 9, "dd-rung");
  }
  h += r;
  // ---- templates ----
  var tp = [], bp = [];
  if (mode === "bub") { tp.push([34, YD1], [xl - 18, YD1]); bp.push([34, YD2], [xl - 18, YD2]); }
  tp.push([xl, YT], [xr, YT], [xr + 18, YD1], [486, YD1]); bp.push([xl, YB], [xr, YB], [xr + 18, YD2], [486, YD2]);
  function pl(P){ return P.map(function(q){ return f1(q[0]) + "," + f1(q[1]); }).join(" "); }
  h += sv("polyline", { points:pl(tp), "class":"dd-t1" }) + sv("polyline", { points:pl(bp), "class":"dd-t2" });
  // ---- end labels, names, fork arrows, origin ----
  if (mode === "bub") { h += txt(28, YD1 + 4, "3′", "dd-end dd-c1", "end") + txt(28, YD2 + 4, "5′", "dd-end dd-c2", "end"); }
  else { h += txt(xl - 18, YT + 5, "3′", "dd-end dd-c1", "end") + txt(xl - 18, YB + 5, "5′", "dd-end dd-c2", "end"); }
  h += txt(492, YD1 + 4, "5′", "dd-end dd-c1") + txt(492, YD2 + 4, "3′", "dd-end dd-c2");
  var nx0 = mode === "bub" ? 34 : 50;
  h += txt(nx0, 18, "top template", "dd-tn dd-c1") + txt(nx0, 224, "bottom template", "dd-tn dd-c2");
  // fork tags sit on the duplex beyond the fork; in a bubble opened 15 nt or more they move inside, next to their fork
  var inside = mode === "bub" && B.hi >= 15;
  function forkTag(xa, right){
    var w = 46, x0 = inside ? (right ? xa - 10 - w : xa + 10) : right ? xa + 22 : xa - 22 - w;
    return sv("rect", { x:x0, y:YD1 + 4, width:w, height:YD2 - YD1 - 8, rx:4, "class":"dd-ftag" }) + txt(x0 + w / 2, (YD1 + YD2) / 2 + 4, right ? "fork →" : "← fork", "dd-fork", "middle");
  }
  h += forkTag(xr, true);
  if (mode === "bub") { h += forkTag(xl, false) + ln(X(0), YB + 6, X(0), YB + 13, "dd-ori") + txt(X(0), 224, "origin", "dd-tn", "middle"); }
  // ---- roles ----
  if (!o.noRoles && B.hi - B.lo >= (mode === "bub" ? 30 : 15)) {
    if (mode === "bub") {
      h += txt(X(0) + 4, 100, "leading", "dd-role") + txt(xl + 4, 100, "lagging", "dd-role") + txt(X(0) + 4, 140, "lagging", "dd-role") + txt(xl + 4, 140, "leading", "dd-role");
    } else h += txt(xl + 2, 100, "leading strand", "dd-role") + txt(xl + 2, 140, "lagging strand", "dd-role");
  }
  // ---- new strands ----
  [1, -1].forEach(function(dir){
    var y = dir > 0 ? YTN : YBN, S = spans[dir];
    S.forEach(function(s, j){
      var p = s.p, nxt = S[j + 1], born = D.born[s.key], fade = D.fade[s.key], g = "";
      var touch = !s.fl && p.ext && s.g >= 1 && nxt && Math.abs(s.e - nxt.p.b) < 0.01, nick = touch && !nxt.p.seal;
      var x5 = X(p.b), xp = X(p.b + 2 * dir), x3 = X(s.e);
      // DNA beyond the primer
      if (p.ext && !s.fl && Math.abs(s.e - p.b) > 2.05) {
        var xe = x3 - dir * (nick ? 2.5 : touch ? 0 : 5);
        g += ln(xp, y, xe, y, "dd-new");
        if (!touch) g += sv("polygon", { points:f1(x3) + "," + y + " " + f1(x3 - dir * 8) + "," + (y - 5.5) + " " + f1(x3 - dir * 8) + "," + (y + 5.5), "class":"dd-head" });
        if (Math.abs(s.e - p.b) >= 7) g += txt((x5 + x3) / 2, dir > 0 ? y + 17 : y - 9, dir > 0 ? "5′ → 3′" : "3′ ← 5′", "dd-plab" + (D.hiLag && dir < 0 ? " hi" : ""), "middle");
      }
      // the primer (RNA, or DNA once polymerase I has replaced it)
      var pcls = p.rna ? "dd-pri" : "dd-new";
      if (fade != null && !p.rna) g += ln(x5, y, xp, y, "dd-new") + '<g opacity="' + f1(1 - fade) + '">' + ln(x5, y, xp, y, "dd-pri") + "</g>";
      else g += ln(x5, y, xp, y, pcls);
      if (s.fl) g += txt(x5 + dir * 6, dir > 0 ? y - 8 : y - 9, "✗", "dd-flag", "middle");
      if (nick) g += txt(X(nxt.p.b), dir > 0 ? y + 17 : y - 9, "✂", "dd-nick", "middle");
      h += born != null && born < 1 ? '<g opacity="' + f1(born) + '">' + g + "</g>" : g;
    });
  });
  (D.sparks || []).forEach(function(k){ var y = k.dir > 0 ? YTN : YBN; if (k.k > 0) h += star(fkX(mode, k.x), y, 4 + 7 * Math.sin(Math.PI * k.k)); });
  (D.ticks || []).forEach(function(k){ h += txt(fkX(mode, k.x), k.dir > 0 ? YTN - 7 : YBN + 17, "✓", "dd-tick", "middle"); });
  return '<svg viewBox="0 0 ' + FW + " " + FH + '" class="dd-bsvg" aria-hidden="true" focusable="false">' + h + "</svg>";
}
function boardSay(st){
  var A = fkAnalyze(st), U = A.units;
  if (st.mode === "bub") return "Replication bubble opened " + st.open + " nucleotides each way from the origin. " + U.map(function(R){ return (R.u.id[0] === "t" ? "Top" : "Bottom") + " template, " + (R.u.side === "R" ? "right" : "left") + " fork (" + R.u.role + "): " + strandTxt(R, R.u.role === "lagging") + "."; }).join(" ") + " Primers still RNA: " + A.rna + ". Nicks to seal: " + A.nicks + ".";
  return "One fork opened " + st.open + " nucleotides, moving right. Top template 3′ to 5′ left to right; bottom template 5′ to 3′. Leading strand: " + strandTxt(U[0], false) + ". Lagging strand: " + strandTxt(U[1], true) + ". Primers still RNA: " + A.rna + ". Nicks to seal: " + A.nicks + ".";
}
function strandTxt(R, lag){
  if (!R.used) return R.segs ? "not started: needs a primer" : "nothing exposed yet";
  var first;
  if (R.frags) { var pc = R.frags - R.joins; first = lag ? plural(R.frags, "fragment") + " of 10 nt" + (R.frags > 1 && pc === 1 ? ", all joined" : "") : R.nt + " nt, " + (pc <= 1 ? "continuous" : "in " + pc + " pieces"); }
  else first = R.used > 1 ? "primers only" : "primer only";
  var bits = [first + (lag ? "" : ", " + plural(R.used, "primer"))];
  if (R.waits) bits.push("waiting for polymerase III");
  if (R.gaps) bits.push("gaps waiting for a primer: " + R.gaps);
  if (R.flagged) bits.push(plural(R.flagged, "primer") + " with nothing to copy");
  return bits.join("; ");
}
function fkClean(s, mode, max, def){
  if (!s || typeof s !== "object") s = { open:def };
  var o = { mode:mode, open:clamp(Math.round((+s.open || 0) / 10) * 10, 0, max), top:[], bot:[] };
  ["top", "bot"].forEach(function(k){
    var seen = {};
    (Array.isArray(s[k]) ? s[k] : []).forEach(function(p){ if (!p || !isFinite(+p.b) || +p.b % 10 || seen[+p.b]) return; seen[+p.b] = 1; o[k].push({ b:+p.b, ext:!!p.ext, rna:p.rna !== false, seal:!!p.seal }); });
  });
  fkPrune(o); return o;
}
function fkPrune(s){
  var B = fkB(s.mode, s.open);
  s.top = s.top.filter(function(p){ return p.b >= B.lo && p.b <= B.hi; });
  s.bot = s.bot.filter(function(p){ return p.b >= B.lo && p.b <= B.hi; });
  s.top.forEach(function(p){ if (fkFlag(s.mode, s.open, 1, p.b)) p.ext = false; });
  s.bot.forEach(function(p){ if (fkFlag(s.mode, s.open, -1, p.b)) p.ext = false; });
}
function pc(b, ext, rna, seal){ return { b:b, ext:!!ext, rna:!!rna, seal:!!seal }; }

// range slider with output (from SBI4U 18): slider(host, {id, label, min, max, step, value, unit(v), short(v), onChange(v)}) -> {set(v), disable(b)}
function slider(host, o){
  host.innerHTML = '<label class="slider dd-sl"><span class="slider-top"><span>' + o.label + '</span><output id="' + o.id + '-out" for="' + o.id + '"></output></span><input type="range" id="' + o.id + '" min="' + o.min + '" max="' + o.max + '" step="' + o.step + '" value="' + o.value + '"></label>';
  var inp = $("#" + o.id, host), out = $("#" + o.id + "-out", host);
  function show(v){ out.textContent = o.short ? o.short(v) : o.unit(v); inp.setAttribute("aria-valuetext", o.unit(v)); }
  inp.addEventListener("change", function(){ o.onChange(+inp.value, true); });
  inp.addEventListener("input", function(){ show(+inp.value); });
  show(o.value);
  return { set:function(v){ inp.value = v; show(v); }, disable:function(b){ inp.disabled = b; } };
}

// ---------- Explore: Leading and lagging strands (fork board) ----------
var EX = null;
function explore(host, api){
  var C = api.content, S = api.S;
  S.one = fkClean(S.one, "one", 60, 20); S.bub = fkClean(S.bub, "bub", 30, 10);
  if (S.mode !== "bub") S.mode = "one";
  if (S.entered == null) S.entered = "";
  function st(){ return S.mode === "bub" ? S.bub : S.one; }
  var D = { open:st().open, grow:{}, fade:{}, born:{}, sparks:[], ticks:[], hiLag:false };
  var sel = null, anim = null, busy = false, what = "", pend = null, readSig = "";
  host.innerHTML = '<div class="pg dd-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="dd-scroll"><div class="dd-board"><div id="dd-svg" role="img"></div><div class="dd-posl" id="dd-pos" role="group" aria-label="Template positions"></div></div></div>' +
    '<p class="dd-leg tiny"><span><i class="dd-sw dd-sw1"></i>top template</span><span><i class="dd-sw dd-sw2"></i>bottom template</span><span><i class="dd-sw dd-sw3"></i>new DNA</span><span><i class="dd-sw dd-sw4"></i>RNA primer</span><span>✂ nick</span><span>✗ nothing to copy</span></p>' +
    '<p class="dd-cap" id="dd-cap" aria-live="polite"></p><p class="tiny muted dd-how">' + C.howBoard + "</p></div>" +
    '<div class="pg-ctrl"><div id="dd-mode"></div><div id="dd-open"></div>' +
      '<div class="dd-prow"><button type="button" class="btn primary sm" id="dd-prim" data-k="ddprim">Primase here</button><span class="tiny" id="dd-sel" aria-live="polite"></span></div>' +
      '<div class="dd-enz" role="group" aria-label="Enzymes"><button type="button" class="btn sm dd-eb" data-enz="p3" data-k="ddp3">Polymerase III: extend all primers</button><button type="button" class="btn sm dd-eb" data-enz="p1" data-k="ddp1">Polymerase I: replace primers</button><button type="button" class="btn sm dd-eb" data-enz="lig" data-k="ddlig">Ligase: seal nicks</button><button type="button" class="btn ghost sm" data-enz="clr" data-k="ddclr">Clear new strands</button></div>' +
      '<div class="dd-entry" id="dd-entry"><label for="dd-num">Primers this bubble needs (for challenge 3):</label> <input class="numin short" id="dd-num" type="text" inputmode="numeric" autocomplete="off"></div></div>' +
    '<div class="pg-read"><dl class="read dd-read" id="dd-read" aria-live="polite"></dl><p class="tiny muted dd-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div></div>";
  var svgEl = $("#dd-svg", host), posEl = $("#dd-pos", host), primBtn = $("#dd-prim", host), numIn = $("#dd-num", host);
  numIn.value = S.entered;
  numIn.addEventListener("input", function(){ S.entered = numIn.value; api.save(); MV.changed(); });
  var modeSeg = MV.seg($("#dd-mode", host), { label:"Mode", options:[{ id:"one", t:"One fork" }, { id:"bub", t:"Replication bubble" }], value:S.mode, onChange:function(v){ setMode(v); } });
  var openS = null;
  function mkSlider(){
    var bub = S.mode === "bub";
    openS = slider($("#dd-open", host), { id:"dd-os", label:"Open the fork", min:0, max:bub ? 30 : 60, step:10, value:st().open,
      short:function(v){ return v + " nt" + (bub ? " each way" : ""); }, unit:function(v){ return v + " nucleotides unwound" + (bub ? " each way from the origin" : ""); },
      onChange:function(v){ openTo(v, 0); } });
  }
  // ---- painting ----
  function paintBoard(){ svgEl.innerHTML = boardSVG(st(), D); }
  function paintPos(focusSel){
    var s = st(), B = fkB(s.mode, s.open), h = "", tab = sel ? fkKey(sel.dir, sel.b) : fkKey(1, B.lo);
    [1, -1].forEach(function(dir){
      for (var b = B.lo; b <= B.hi; b += 10) {
        var k = fkKey(dir, b), on = !!sel && sel.dir === dir && sel.b === b, p = fkPiece(s, dir, b), fl = fkFlag(s.mode, s.open, dir, b);
        var say = p ? (p.ext && !fl ? "new DNA starts here" + (p.rna ? " (primer still RNA)" : "") : "RNA primer" + (fl ? ", nothing to copy" : "")) : fkCovered(s, dir, b) ? "inside new DNA" : "empty";
        h += '<button type="button" class="dd-pb' + (dir > 0 ? " t" : " b") + (on ? " sel" : "") + (p && p.rna ? " has" : p ? " dna" : "") + '" data-pos="' + k + '" data-k="pos' + k + '" tabindex="' + (k === tab ? 0 : -1) + '" aria-pressed="' + on + '" style="left:' + f1(fkX(s.mode, b) / FW * 100) + "%;top:" + f1((dir > 0 ? YT : YB) / FH * 100) + '%" aria-label="' + MV.esc((dir > 0 ? "Top" : "Bottom") + " template at " + b + " nt: " + say) + '"></button>';
      }
    });
    var had = posEl.contains(document.activeElement);
    posEl.innerHTML = h;
    if ((had || focusSel) && sel) { var fb = posEl.querySelector('[data-pos="' + fkKey(sel.dir, sel.b) + '"]'); if (fb) fb.focus({ preventScroll:true }); }
  }
  function paintPrim(){
    var s = st(), t = "Primase here", dis = busy, info = "Tap a template position first.";
    if (!sel) dis = true;
    else {
      var p = fkPiece(s, sel.dir, sel.b);
      info = "Selected: " + (sel.dir > 0 ? "top" : "bottom") + " template at " + sel.b + " nt.";
      if (p && !p.ext) t = "Remove primer";
      else if (p || fkCovered(s, sel.dir, sel.b)) { t = "Already copied here"; dis = true; }
    }
    primBtn.textContent = t; primBtn.disabled = dis; $("#dd-sel", host).textContent = info;
  }
  function rows(){
    var s = st(), A = fkAnalyze(s), U = A.units, R = [];
    if (s.mode === "bub") {
      var right = U[0].used + U[2].used, left = U[3].used + U[1].used, done = U.filter(function(u){ return u.complete; }).length;
      R.push(["Bubble opened", s.open + " nt each way"]);
      R.push(["Forks", "2"]);
      R.push(["Primers per fork", "left fork " + left + " (leading " + U[3].used + ", lagging " + U[1].used + "); right fork " + right + " (leading " + U[0].used + ", lagging " + U[2].used + ")"]);
      R.push(["Top template", "leading on the right fork, lagging on the left fork"]);
      R.push(["Bottom template", "lagging on the right fork, leading on the left fork"]);
      R.push(["New strands complete", done + " of 4"]);
    } else {
      R.push(["Fork opened", s.open + " nt"]);
      R.push(["Leading strand", strandTxt(U[0], false)]);
      R.push(["Lagging strand", strandTxt(U[1], true)]);
    }
    R.push(["Primers in place (RNA left)", String(A.rna)]);
    R.push(["Nicks to seal", String(A.nicks)]);
    R.push(["Primers laid down (total)", String(A.used)]);
    R.push(["New strands’ direction", s.mode === "bub" ? "5′ → 3′ (all four)" : "5′ → 3′ (both)"]);
    R.push(["Template read", s.mode === "bub" ? "3′ → 5′ (all four)" : "3′ → 5′ (both)"]);
    return R;
  }
  function paintRead(){ var h = MV.readoutHTML(rows()); if (h !== readSig) { readSig = h; $("#dd-read", host).innerHTML = h; } }
  function capDefault(){ var s = st(); if (!s.open) return "The DNA is still closed. Open the fork to expose some template."; return s.top.length + s.bot.length ? "Every blue piece grows 5′ → 3′: its arrowhead is the 3′ end." : "Both templates are exposed. Where can polymerase start on each one?"; }
  function paintCap(){ $("#dd-cap", host).innerHTML = what || capDefault(); }
  function paintAll(){
    modeSeg.set(S.mode); $("#dd-entry", host).hidden = S.mode !== "bub";
    paintBoard(); paintPos(false); paintPrim(); paintRead(); paintCap();
    svgEl.setAttribute("aria-label", boardSay(st()));
  }
  function setBusy(b){ busy = b; $$("[data-enz]", host).forEach(function(x){ x.disabled = b; }); if (openS) openS.disable(b); paintPrim(); }
  function stop(){
    if (anim) { anim(); anim = null; }
    D.grow = {}; D.fade = {}; D.born = {}; D.sparks = []; D.hiLag = false; D.open = st().open;
    if (busy) setBusy(false);
    if (pend) { var d = pend; pend = null; d(); }
  }
  function changed(){ api.save(); paintAll(); MV.changed(); }
  function tw(dur, step, done){ anim = MV.tween({ dur:dur, ease:lin, step:step, done:function(){ anim = null; if (done) done(); } }); }
  // ---- actions ----
  function setMode(v){
    stop(); S.mode = v === "bub" ? "bub" : "one"; sel = null; what = ""; D.ticks = []; D.open = st().open;
    mkSlider(); api.banner("", ""); changed();
  }
  function openTo(v, dur, done){
    stop();
    var s = st(), old = s.open; v = clamp(v, 0, s.mode === "bub" ? 30 : 60);
    if (openS) openS.set(v);
    s.open = v; fkPrune(s); D.ticks = [];
    if (sel && (sel.b < fkB(s.mode, v).lo || sel.b > fkB(s.mode, v).hi)) sel = null;
    what = ""; api.banner("", "");
    if (v <= old) { D.open = v; changed(); if (done) done(); return; }
    D.open = old; changed(); D.open = old; paintBoard(); setBusy(true);
    tw(dur || Math.max(500, (v - old) * 45), function(k){ D.open = lerp(old, v, k); paintBoard(); }, function(){
      D.open = v; setBusy(false); what = openMsg(); paintAll(); if (done) done();
    });
  }
  function openMsg(){
    var s = st(), A = fkAnalyze(s), lead = s.mode === "bub" ? A.units[0].frags + A.units[3].frags : A.units[0].frags, gaps = A.units.reduce(function(t, R){ return t + (R.u.role === "lagging" ? R.gaps : 0); }, 0);
    var m = "";
    if (lead) m += "The leading strand" + (s.mode === "bub" ? "s followed their forks" : " followed the fork") + ": its 3′ end faces the fork, so no new primer is needed. ";
    if (gaps) m += "The lagging template has " + (gaps === 1 ? "a 10-nt gap" : gaps + " gaps") + " waiting for a primer.";
    return m || null;
  }
  function primase(){
    if (busy || !sel) return;
    stop(); D.ticks = [];
    var s = st(), p = fkPiece(s, sel.dir, sel.b), L = sel.dir > 0 ? s.top : s.bot, nm = sel.dir > 0 ? "top" : "bottom";
    if (p && !p.ext) { L.splice(L.indexOf(p), 1); what = "Primer removed."; changed(); return; }
    if (p || fkCovered(s, sel.dir, sel.b)) { what = "New DNA already covers this position."; paintCap(); return; }
    var np = pc(sel.b, false, true, false); L.push(np);
    var fl = fkFlag(s.mode, s.open, sel.dir, sel.b);
    what = "Primer placed on the " + nm + " template at " + sel.b + " nt. Its 3′ end points " + (sel.dir > 0 ? "right" : "left") + ", the way the new strand grows (5′ → 3′)." + (fl ? " <strong>✗ " + C.flagMsg + "</strong>" : "");
    var key = fkKey(sel.dir, sel.b); D.born[key] = 0; changed(); setBusy(true);
    tw(380, function(k){ D.born[key] = k; paintBoard(); }, function(){ delete D.born[key]; setBusy(false); paintBoard(); });
  }
  function pol3(done, only){
    stop(); D.ticks = [];
    var s = st(), keys = [], lagN = 0;
    [1, -1].forEach(function(dir){ (dir > 0 ? s.top : s.bot).forEach(function(p){
      if (p.ext || fkFlag(s.mode, s.open, dir, p.b) || (only && only.indexOf(fkKey(dir, p.b)) < 0)) return;
      p.ext = true; keys.push(fkKey(dir, p.b)); if (!fkLead(s.mode, dir, p.b)) lagN++;
    }); });
    if (!keys.length) { var anyFl = s.top.concat(s.bot).some(function(p){ return !p.ext; }); what = s.top.length + s.bot.length ? (anyFl ? "Polymerase III can’t extend a primer with nothing to copy." : "Every primer is already extended.") : "No primers to extend. Place a primer first."; paintCap(); if (done) done(); return; }
    var A = fkAnalyze(s), gaps = A.units.reduce(function(t, R){ return t + R.gaps; }, 0);
    what = "Polymerase III extended " + plural(keys.length, "primer") + ". Each piece grows 5′ → 3′" + (lagN ? "; on the lagging side that means away from the fork, 10 nt at a time" : "") + "." + (gaps ? " Gaps waiting for a primer: " + gaps + "." : "");
    keys.forEach(function(k){ D.grow[k] = 0; });
    changed(); setBusy(true);
    tw(950, function(k){ keys.forEach(function(q){ D.grow[q] = k; }); paintBoard(); }, function(){ D.grow = {}; setBusy(false); paintBoard(); if (done) done(); });
  }
  function pol1(done){
    stop(); D.ticks = [];
    var s = st(), keys = [], left = 0;
    [1, -1].forEach(function(dir){ (dir > 0 ? s.top : s.bot).forEach(function(p){ if (!p.rna) return; if (p.ext && !fkFlag(s.mode, s.open, dir, p.b)) { p.rna = false; keys.push(fkKey(dir, p.b)); } else left++; }); });
    if (!keys.length) { what = left ? "Polymerase I replaces a primer only after its piece has been built." : "There are no RNA primers to replace."; paintCap(); if (done) done(); return; }
    what = "Polymerase I replaced " + plural(keys.length, "RNA primer") + " with DNA." + (left ? " " + plural(left, "primer") + " that " + (left === 1 ? "hasn’t" : "haven’t") + " been extended stay" + (left === 1 ? "s" : "") + " as RNA." : "");
    keys.forEach(function(k){ D.fade[k] = 0; });
    changed(); setBusy(true);
    tw(750, function(k){ keys.forEach(function(q){ D.fade[q] = k; }); paintBoard(); }, function(){ D.fade = {}; setBusy(false); paintBoard(); if (done) done(); });
  }
  function ligase(done){
    stop(); D.ticks = [];
    var s = st(), list = [], blocked = 0;
    [1, -1].forEach(function(dir){
      var L = fkPieces(s, dir);
      L.forEach(function(p, i){
        var y = L[i + 1]; if (!p.ext || fkFlag(s.mode, s.open, dir, p.b) || !y || y.seal) return;
        if (fkEnd(s, dir, p, s.open, false) !== y.b) return;
        if (y.rna) { blocked++; return; }
        y.seal = true; list.push({ dir:dir, x:y.b, k:0 });
      });
    });
    if (!list.length) { what = blocked ? "Ligase can’t join DNA to RNA: replace the primers first." : "There are no nicks to seal."; paintCap(); if (done) done(); return; }
    what = "Ligase sealed " + plural(list.length, "nick") + "." + (blocked ? " " + plural(blocked, "nick") + " still " + (blocked === 1 ? "has" : "have") + " RNA on one side." : "");
    D.sparks = list; changed(); setBusy(true);
    tw(800, function(k){ list.forEach(function(q){ q.k = k; }); paintBoard(); }, function(){
      D.sparks = []; if (MV.reduceMotion) D.ticks = list.map(function(q){ return { dir:q.dir, x:q.x }; });
      setBusy(false); paintBoard(); if (done) done();
    });
  }
  function clearAll(){ stop(); var s = st(); s.top = []; s.bot = []; D.ticks = []; what = "New strands cleared."; changed(); }
  // ---- events ----
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.pos) { var m = /^([tb])(-?\d+)$/.exec(b.dataset.pos); var nx = { dir:m[1] === "t" ? 1 : -1, b:+m[2] }; sel = sel && sel.dir === nx.dir && sel.b === nx.b ? null : nx; paintPos(true); paintPrim(); return; }
    if (b === primBtn) { primase(); return; }
    var z = b.dataset.enz;
    if (z === "p3") pol3(); else if (z === "p1") pol1(); else if (z === "lig") ligase(); else if (z === "clr") clearAll();
  });
  posEl.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-pos]"); if (!b) return;
    var m = /^([tb])(-?\d+)$/.exec(b.dataset.pos), dir = m[1] === "t" ? 1 : -1, x = +m[2], B = fkB(st().mode, st().open);
    if (e.key === "Enter") { e.preventDefault(); sel = { dir:dir, b:x }; paintPos(true); primase(); return; }
    var nd = dir, nb = x;
    if (e.key === "ArrowRight") nb = Math.min(B.hi, x + 10); else if (e.key === "ArrowLeft") nb = Math.max(B.lo, x - 10);
    else if (e.key === "ArrowUp" || e.key === "ArrowDown") nd = e.key === "ArrowUp" ? 1 : -1; else return;
    e.preventDefault(); sel = { dir:nd, b:nb }; paintPos(true); paintPrim();
  });
  mkSlider(); paintAll();

  // ---- challenges ----
  function chal(id){
    var c = byId(C.challenges, id), N = c.named || {}, A, U;
    if (id === "tc1") {
      if (S.mode !== "one" || S.one.open !== 30) return { ok:false, msg:N.setup };
      U = fkAnalyze(S.one).units[1];
      if (U.complete) return { ok:true };
      if (U.flagged) return { ok:false, msg:N.facing };
      if (U.gaps) return { ok:false, msg:N.gaps };
      if (U.waits) return { ok:false, msg:N.unbuilt };
      if (U.rna) return { ok:false, msg:N.rna };
      return { ok:false, msg:N.nicks };
    }
    if (id === "tc2") {
      if (S.mode !== "one" || S.one.open !== 40) return { ok:false, msg:N.setup };
      A = fkAnalyze(S.one); U = A.units;
      if (U[0].complete && U[1].complete && A.used === 5) return { ok:true };
      if (U[0].used > 1) return { ok:false, msg:N.lead };
      if (U[1].gaps || U[1].used < 4) return { ok:false, msg:N.lag };
      if (!(U[0].complete && U[1].complete)) return { ok:false, msg:N.finish };
      return { ok:false, msg:N.extra };
    }
    if (id === "tc3") {
      if (S.mode !== "bub" || S.bub.open !== 30) return { ok:false, msg:N.setup };
      var n = String(S.entered || "").trim(), v = /^\d+$/.test(n) ? +n : null;
      if (v === 2 || v === 4 || v === 6) return { ok:false, msg:N["n" + v] };
      A = fkAnalyze(S.bub);
      if (!A.units.every(function(R){ return R.complete; })) return { ok:false, msg:N.finish };
      if (A.used > 8) return { ok:false, msg:N.extra };
      if (v !== 8) return { ok:false, msg:v == null ? N.enter : N.count };
      return { ok:true };
    }
    return { ok:false };
  }
  // ---- predictions ----
  function build(kind){
    if (kind === "done") return { top:[pc(0, 1, 0, 0)], bot:[pc(10, 1, 0, 1), pc(20, 1, 0, 0)] };
    if (kind === "right") return { top:[pc(0, 1, 1, 0)], bot:[pc(10, 1, 1, 0), pc(20, 1, 1, 0)] };
    if (kind === "lagPrimers") return { top:[pc(0, 1, 1, 0)], bot:[pc(10, 0, 1, 0), pc(20, 0, 1, 0), pc(30, 0, 1, 0), pc(40, 0, 1, 0)] };
    return { top:[], bot:[] };
  }
  function bornAll(dir, list, done){
    chain(list.map(function(b){ return function(next){
      var s = st(); (dir > 0 ? s.top : s.bot).push(pc(b, 0, 1, 0)); var key = fkKey(dir, b); D.born[key] = 0; api.save(); paintAll(); MV.changed();
      tw(380, function(k){ D.born[key] = k; paintBoard(); }, function(){ delete D.born[key]; paintBoard(); MV.wait(120, next); });
    }; }), done);
  }
  function growOne(dir, b, dur, done){
    var s = st(), p = fkPiece(s, dir, b), key = fkKey(dir, b); if (!p) { done(); return; }
    p.ext = true; D.grow[key] = 0; api.save(); paintAll(); MV.changed();
    tw(dur, function(k){ D.grow[key] = k; paintBoard(); }, function(){ delete D.grow[key]; paintBoard(); done(); });
  }
  EX = { show:function(){ paintBoard(); } };
  return {
    predict:{
      start:function(p){
        stop(); var s0 = p.start;
        S.mode = s0.mode; var s = st(), b = build(s0.build);
        s.open = s0.open; s.top = b.top; s.bot = b.bot; fkPrune(s);
        sel = null; what = ""; D.ticks = []; D.open = s.open; mkSlider(); api.save(); paintAll(); MV.changed();
      },
      run:function(p, done){
        stop(); pend = done; setBusy(true);
        function fin(msg){ D.hiLag = false; what = msg; setBusy(false); paintAll(); var d = pend; pend = null; if (d) MV.wait(350, d); }
        if (p.act === "open") {
          var s = st(), old = s.open; s.open = 30; openS.set(30); api.save(); paintAll(); MV.changed(); D.open = old; paintBoard();
          tw(1500, function(k){ D.open = lerp(old, 30, k); paintBoard(); }, function(){ D.open = 30; fin("The leading strand grew 10 nt with no new primer: its 3′ end faces the fork. The lagging template now has a 10-nt gap waiting for a primer."); });
          return;
        }
        if (p.act === "primeLag") {
          bornAll(-1, [40, 30, 20, 10], function(){ chain([function(nx){ MV.wait(250, nx); }, function(nx){
            var s = st(), keys = s.bot.map(function(q){ q.ext = true; return fkKey(-1, q.b); }); keys.forEach(function(k){ D.grow[k] = 0; }); api.save(); paintAll(); MV.changed();
            tw(1000, function(k){ keys.forEach(function(q){ D.grow[q] = k; }); paintBoard(); }, function(){ D.grow = {}; nx(); });
          }], function(){ fin("Four primers, one per 10-nt fragment. Each fragment starts from its own primer."); }); });
          return;
        }
        if (p.act === "leftTop") {
          bornAll(1, [-20, -10], function(){
            chain([function(nx){ growOne(1, -20, 800, nx); }, function(nx){ growOne(1, -10, 800, nx); }], function(){ fin("On the left fork the top template carries the lagging strand: its fragments grow 5′ → 3′, away from that fork."); });
          });
          return;
        }
        if (p.act === "extendLag") {
          D.hiLag = true;
          chain([40, 30, 20, 10].map(function(b){ return function(nx){ growOne(-1, b, 650, nx); }; }), function(){ fin("Each fragment is built 5′ → 3′, pointing away from the fork. Nothing is ever built 3′ → 5′."); });
          return;
        }
        fin("");
      }
    },
    challenge:chal
  };
}

// ---------- Hero: the fork opens one step; the leading strand follows; primase lays a primer near the fork; polymerase III builds
// the fragment away from the fork until it meets the previous one; polymerase I swaps that primer; ligase seals. Reduced motion:
// final frame with all labels. ----------
function hero(f){
  var box = $("#dd-hero"); if (!box) return;
  var cap = f && f.cap;
  var CAPS = ["The fork opens one step, and the leading strand follows it.", "Primase lays a new primer near the fork.", "Polymerase III builds the fragment away from the fork until it meets the previous one.",
    "Polymerase I swaps the old primer for DNA…", "…and ligase seals the nick.", "Continuous on one side, stitched on the other."];
  function setCap(i){ if (cap && cap.textContent !== CAPS[i]) cap.textContent = CAPS[i]; }
  function stAt(T){
    var s = { mode:"one", open:30, top:[pc(0, 1, 0, 0)], bot:[pc(10, 1, 0, 1), pc(20, 1, 0, 1), pc(30, 1, 1, 0)] }, D = { open:30, grow:{}, fade:{}, born:{}, sparks:[], ticks:[] };
    D.open = lerp(30, 40, MV.ease(seg(T, 0.6, 2.2))); if (T >= 0.6) s.open = 40;
    if (T >= 2.4) { s.bot.push(pc(40, T >= 3.1, 1, 0)); if (T < 2.9) D.born.b40 = seg(T, 2.4, 2.9); }
    if (T >= 3.1 && T < 4.6) D.grow.b40 = seg(T, 3.1, 4.6);
    if (T >= 4.9) { s.bot[2].rna = false; if (T < 5.6) D.fade.b30 = seg(T, 4.9, 5.6); }
    if (T >= 5.8) { s.bot[2].seal = true; if (T < 6.6) D.sparks = [{ dir:-1, x:30, k:seg(T, 5.8, 6.6) }]; }
    return { s:s, D:D };
  }
  function draw(T){ var o = stAt(T); box.innerHTML = boardSVG(o.s, o.D, {}); }
  var END = 7.2;
  if (MV.reduceMotion) { draw(END); setCap(5); return; }
  draw(0); setCap(0);
  MV.tween({ dur:END * 1000, ease:lin, step:function(k){ var T = k * END; draw(T); setCap(T < 2.3 ? 0 : T < 3.0 ? 1 : T < 4.8 ? 2 : T < 5.7 ? 3 : T < 6.9 ? 4 : 5); }, done:function(){ draw(END); setCap(5); } });
}

// ---------- Part 3: Proofreading and repair ----------
// @component baseZoom — "Zoom to the molecules": a 10-base-pair stretch, letters in boxes, rungs between pairs. Options: mismatch
// (✗ + red outline), bump, cut-out gaps (dashed), a thymine dimer (--hi bracket and a kink), enzyme blobs, a removed base drifting
// off, parent-strand tags, ligase sparks (✓ with reduced motion), a UV photon (wavy arrow in ink). viewBox 380 × 196. ----------
function zx(i){ return 46 + i * 32; }
function zoomSVG(o){
  var h = "", N = o.top.length, i, TY = 62, BY = 126;
  var gapT = o.gapTop || [-1, -2], gapB = o.gapBot || [-1, -2];
  function inGap(g, j){ return j >= g[0] && j <= g[1]; }
  function isDim(j){ return o.dimer != null && (j === o.dimer || j === o.dimer + 1); }
  // backbones, cut-out stretches, ends and strand names
  // backbones run only under bases that are there (a strand being built stops at its 3′ end; a cut-out stretch is a dashed gap)
  function back(has, y, cls){
    var out = "", j = 0, last = -1;
    while (j < N) { if (!has(j)) { j++; continue; } var k0 = j; while (j < N && has(j)) j++; out += ln(k0 ? zx(k0) - 16 : zx(0) - 20, y, j < N ? zx(j - 1) + 16 : zx(N - 1) + 20, y, cls); last = j - 1; }
    return { h:out, last:last };
  }
  var BT = back(function(j){ return !inGap(gapT, j) && !!o.top[j]; }, 36, "dd-zb1"), BB = back(function(j){ return !inGap(gapB, j) && !!o.bot[j]; }, 152, o.botOld ? "dd-zb2" : "dd-zbn");
  h += BT.h + BB.h;
  if (o.gapTop) h += sv("rect", { x:zx(gapT[0]) - 15, y:30, width:zx(gapT[1]) - zx(gapT[0]) + 30, height:12, "class":"dd-zgapc" });
  if (o.gapBot) h += sv("rect", { x:zx(gapB[0]) - 15, y:146, width:zx(gapB[1]) - zx(gapB[0]) + 30, height:12, "class":"dd-zgapc" });
  var bx3 = BB.last >= N - 1 || o.gapBot ? zx(N - 1) + 24 : zx(BB.last) + 26;
  h += txt(zx(0) - 24, 40, o.ends[0], "dd-zend", "end") + txt(zx(N - 1) + 24, 40, o.ends[1], "dd-zend") + txt(zx(0) - 24, 156, o.ends[1], "dd-zend", "end") + txt(bx3, 156, o.ends[0], "dd-zend");
  h += txt(zx(N - 1) + 20, 12, o.topLab, "dd-zlab dd-c1", "end") + txt(zx(N - 1) + 20, 206, o.botLab, o.botOld ? "dd-zlab dd-c2" : "dd-zlab dd-cn", "end");
  for (i = 0; i < N; i++) {
    var x = zx(i), t = inGap(gapT, i) ? null : o.top[i], b = inGap(gapB, i) ? null : o.bot[i], bad = (o.bad || []).indexOf(i) >= 0, by = BY + (o.bump === i ? 10 : 0), ty = TY - (isDim(i) ? 9 : 0);
    var tNew = (o.topNew || []).indexOf(i) >= 0, bNew = (o.botNew || []).indexOf(i) >= 0;
    if (t && b && !isDim(i)) h += ln(x, ty + 12, x, by - 13, bad ? "dd-zrung bad" : "dd-zrung");
    if (t) h += sv("rect", { x:x - 11, y:ty - 11, width:22, height:22, rx:4, "class":"dd-zbox" + (tNew ? " nw" : "") }) + txt(x, ty + 5, t, "dd-zl" + (tNew ? " dd-cn" : " dd-c1"), "middle");
    else h += sv("rect", { x:x - 11, y:TY - 11, width:22, height:22, rx:4, "class":"dd-zempty" });
    if (b) h += sv("rect", { x:x - 11, y:by - 11, width:22, height:22, rx:4, "class":"dd-zbox" + (bad ? " bad" : "") + (bNew ? " nw" : "") }) + txt(x, by + 5, b, "dd-zl " + (o.botOld && !bNew ? "dd-c2" : "dd-cn"), "middle");
    else h += sv("rect", { x:x - 11, y:BY - 11, width:22, height:22, rx:4, "class":"dd-zempty" });
    if (bad && t && b) h += txt(x + 16, (ty + by) / 2 + 4, "✗", "dd-zx");
  }
  if (o.dimer != null) { var dx = zx(o.dimer), dy = TY + 6; h += sv("path", { d:"M" + (dx - 12) + " " + dy + " L" + (dx - 12) + " " + (dy + 6) + " L" + (dx + 44) + " " + (dy + 6) + " L" + (dx + 44) + " " + dy, "class":"dd-zdim" }) + txt(dx + 16, dy + 24, "thymine dimer", "dd-zdl", "middle"); }
  (o.tags || []).forEach(function(j){ h += sv("path", { d:"M" + zx(j) + " 34 l-5 -9 l10 0 z", "class":"dd-ztag" + (o.tagHi ? " hi" : "") }); });
  (o.enz || []).forEach(function(z){
    var cx = (zx(z.a) + zx(z.b)) / 2, w = zx(z.b) - zx(z.a) + 40, cy = z.top ? TY : BY + 2;
    h += sv("rect", { x:cx - w / 2, y:cy - 21, width:w, height:42, rx:20, "class":"dd-zenz" }) + txt(cx, z.top ? 26 : 174, z.lab, "dd-zel", "middle");
    if (z.arrow) h += txt(cx + (z.arrow > 0 ? w / 2 + 11 : -w / 2 - 11), cy + 6, z.arrow > 0 ? "→" : "←", "dd-zarr", "middle");
  });
  if (o.float) { var fx = zx(o.float.i) + 84; h += sv("rect", { x:fx - 11, y:160, width:22, height:22, rx:4, "class":"dd-zbox bad" }) + txt(fx, 176, o.float.ch, "dd-zl dd-cn", "middle") + txt(fx + 18, 175, o.float.lab, "dd-zdl"); }
  if (o.uv) {
    var ex = zx(o.dimer) - 6, ey = 32, sx0 = ex - 70, sy0 = 2, d = "", k;
    for (k = 0; k <= 30; k++) { var s = k / 30, px = lerp(sx0, ex - 6, s), py = lerp(sy0, ey - 6, s) + 3.5 * Math.sin(s * Math.PI * 6); d += (k ? " L" : "M") + f1(px) + " " + f1(py); }
    h += sv("path", { d:d, "class":"dd-zuv" }) + sv("path", { d:"M" + f1(ex - 13) + " " + f1(ey - 4) + " L" + f1(ex) + " " + f1(ey) + " L" + f1(ex - 5) + " " + f1(ey - 13), "class":"dd-zuv" }) + txt(sx0 - 4, 14, "UV", "dd-zdl", "end");
  }
  (o.spark || []).forEach(function(q){ var sx = (zx(q.i) + zx(q.i - 1)) / 2, sy = q.top ? 36 : 152; h += MV.reduceMotion ? txt(sx, sy + (q.top ? -6 : 16), "✓", "dd-tick", "middle") : star(sx, sy, 8); });
  return '<svg viewBox="0 0 380 214" aria-hidden="true" focusable="false">' + h + "</svg>";
}
var ZT1 = "TACGTACCGA".split(""), ZC1 = "ATGCATGGCT".split("");
function st1Frame(i){
  var bot = ZC1.map(function(c, j){ return j < 4 ? c : null; });
  if (i === 0) { bot[4] = "G"; return { bot:bot, bad:[4], enz:[{ a:4, b:5, lab:"DNA polymerase" }] }; }
  if (i === 1) { bot[4] = "G"; return { bot:bot, bad:[4], bump:4, enz:[{ a:3, b:4, lab:"polymerase backs up", arrow:-1 }] }; }
  if (i === 2) return { bot:bot, float:{ i:4, ch:"G", lab:"cut off" }, enz:[{ a:3, b:4, lab:"3′ → 5′ exonuclease" }] };
  bot[4] = "A"; bot[5] = "T"; return { bot:bot, botNew:[4, 5], enz:[{ a:5, b:6, lab:"polymerase continues", arrow:1 }] };
}
var ZT2 = "TACGTTCCGA".split(""), ZC2 = "ATGCAAGGCT".split("");
function st2Frame(i){
  var bot = ZC2.slice(); bot[5] = "G";
  var o = { bot:bot, bad:[5], tags:[1, 4, 8] };
  if (i === 1) { o.enz = [{ a:4, b:6, lab:"repair proteins" }]; o.tagHi = true; }
  if (i === 2) { o.bad = []; o.gapBot = [3, 7]; o.enz = [{ a:3, b:7, lab:"new stretch cut out" }]; }
  if (i >= 3) { o.bad = []; o.bot = ZC2.slice(); o.botNew = [3, 4, 5, 6, 7]; if (i === 3) o.enz = [{ a:3, b:7, lab:"polymerase refills" }]; else o.spark = [{ i:3 }, { i:8 }]; }
  return o;
}
var ZT3 = "AGCTTACGAT".split(""), ZC3 = "TCGAATGCTA".split("");
function st3Frame(i){
  var o = { top:ZT3.slice(), bot:ZC3, botOld:true, ends:["5′", "3′"], topLab:"strand exposed to UV", botLab:"partner strand" };
  if (i === 0) { o.dimer = 3; o.uv = true; }
  if (i === 1) { o.gapTop = [2, 5]; o.enz = [{ a:2, b:5, lab:"repair enzymes cut", top:true }]; }
  if (i === 2) { o.topNew = [2, 3, 4, 5]; o.enz = [{ a:2, b:5, lab:"polymerase refills", top:true }]; }
  if (i === 3) { o.topNew = [2, 3, 4, 5]; o.spark = [{ i:2, top:true }, { i:6, top:true }]; }
  return o;
}
// station 5: a linear chromosome end; repeats drawn as blocks (TTAGGG), the last lagging primer at the tip
function endSVG(i){
  var h = "", tip = 330, blk = 30, y1 = 52, y2 = 108, k;
  var topEnd = i === 2 ? tip - blk : i === 3 ? tip + blk : tip;
  h += ln(20, y1, topEnd, y1, "dd-t1") + txt(14, y1 + 4, "5′", "dd-end dd-c1", "end") + txt(topEnd + 8, y1 + 4, "3′", "dd-end dd-c1");
  for (k = 0; k < 6; k++) { var x0 = 150 + k * blk; if (x0 + blk > topEnd + 0.5) break; h += sv("rect", { x:x0 + 1, y:y1 - 9, width:blk - 2, height:8, rx:2, "class":"dd-rep" }); }
  if (i === 3) h += sv("rect", { x:tip + 1, y:y1 - 9, width:blk - 2, height:8, rx:2, "class":"dd-rep nw" });
  h += txt(150, y1 - 16, "telomere: TTAGGG repeats", "dd-zdl");
  var botEnd = i === 0 ? tip : tip - blk;
  for (k = 20; k < Math.min(topEnd, botEnd) - 2; k += 8) h += ln(k + 4, y1 + 3, k + 4, y2 - 3, "dd-rung");
  h += ln(20, y2, Math.min(botEnd, topEnd) - (i === 0 ? blk : 0), y2, "dd-new") + txt(14, y2 + 4, "3′", "dd-end dd-cn", "end");
  if (i === 0) h += ln(tip - blk, y2, tip, y2, "dd-pri") + txt(tip - blk / 2, y2 + 20, "last primer", "dd-zdl", "middle");
  if (i === 1) h += sv("rect", { x:tip - blk, y:y2 - 6, width:blk, height:12, "class":"dd-zgapc" }) + txt(tip - blk / 2, y2 + 22, "gap: no 3′ end to extend", "dd-zdl", "middle");
  if (i === 2) { h += sv("rect", { x:tip - blk, y:y1 - 10, width:blk, height:y2 - y1 + 20, "class":"dd-ghost" }) + txt(tip - blk / 2, y2 + 22, "lost this round", "dd-zdl", "middle"); }
  if (i === 3) { h += sv("rect", { x:tip - blk - 8, y:y1 - 28, width:2 * blk + 16, height:46, rx:18, "class":"dd-zenz" }) + ln(tip - blk + 4, y1 + 9, tip + blk - 4, y1 + 9, "dd-trna") + txt(tip, y1 + 34, "its RNA template", "dd-zdl", "middle") + txt(tip, y1 - 33, "telomerase", "dd-zel", "middle"); }
  h += txt(20, 150, i === 0 ? "chromosome tip: parent strand above, new lagging strand below" : i === 1 ? "primer removed: nothing can fill the tip" : i === 2 ? "next round: this copy is one block shorter" : "telomerase adds a repeat to the 3′ end", "dd-zdl");
  return '<svg viewBox="0 0 400 160" aria-hidden="true" focusable="false">' + h + "</svg>";
}
function parseVal(raw){
  var s = String(raw == null ? "" : raw).replace(/(\d)[\s  ](?=\d{3}\b)/g, "$1").replace(/,(?=\d{3}\b)/g, "").replace(/,/g, ".").replace(/[−–]/g, "-").replace(/[×x]\s*$/i, "").replace(/[^0-9.\-\/]+/g, " ").trim().split(/\s+/)[0] || "";
  var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null;
}
function part3(host, api){
  var P = api.content, S = api.S; S.st4 = S.st4 || { v:{}, done:{} }; S.tel = S.tel || { cell:"body", n:0 };
  if (!byId(P.st5.cells, S.tel.cell)) S.tel.cell = "body";
  function station(n, Q, inDetails){
    return '<section class="dd-st" aria-labelledby="dd-h' + n + '"><h3 id="dd-h' + n + '">' + Q.title + "</h3>" +
      '<div class="dd-row"><figure class="dd-zf"><div class="dd-zsvg" id="dd-z' + n + '" role="img"></div><figcaption class="dd-zcap" id="dd-c' + n + '" aria-live="polite"></figcaption><div id="dd-pl' + n + '"></div></figure>' +
      '<p class="dd-card">' + Q.card + "</p></div></section>";
  }
  host.innerHTML = '<div class="dd-p3"><details class="alg dd-zoom" open><summary>Zoom to the molecules</summary>' + station(1, P.st1) + station(2, P.st2) + station(3, P.st3) + "</details>" +
    '<section class="dd-st" aria-labelledby="dd-h4"><h3 id="dd-h4">' + P.st4.title + '</h3><details class="alg dd-data" open><summary>Check it with data</summary><p class="tiny muted"><span class="bio-model">Approximate</span> Rounded textbook values.</p><div id="dd-tb"></div><p class="how">' + P.st4.how + '</p><div id="dd-f"></div></details></section>' +
    station(5, P.st5) + '<div class="dd-tel" id="dd-tel"></div></div>';
  var FR = {
    1:function(i){ var o = st1Frame(i); o.top = ZT1; o.ends = ["3′", "5′"]; o.topLab = "template strand"; o.botLab = "new strand (built 5′ → 3′)"; return zoomSVG(o); },
    2:function(i){ var o = st2Frame(i); o.top = ZT2; o.ends = ["3′", "5′"]; o.topLab = "parent strand (tagged)"; o.botLab = "new strand (no tags yet)"; return zoomSVG(o); },
    3:function(i){ return zoomSVG(st3Frame(i)); },
    5:function(i){ return endSVG(i); }
  };
  var DESC = { 1:"A template strand of ten bases over a new strand being built.", 2:"A parent strand with small tags over a finished new strand.", 3:"Two partner strands of old DNA.", 5:"The tip of a linear chromosome." };
  [1, 2, 3, 5].forEach(function(n){
    var Q = P["st" + n], fig = $("#dd-z" + n, host), capEl = $("#dd-c" + n, host);
    MV.player($("#dd-pl" + n, host), { count:Q.steps.length, interval:2600, label:function(i){ return "Step " + (i + 1) + " of " + Q.steps.length + ": " + Q.short[i]; },
      render:function(i){ fig.innerHTML = FR[n](i); capEl.innerHTML = "<strong>Step " + (i + 1) + ".</strong> " + Q.steps[i]; fig.setAttribute("aria-label", DESC[n] + " Step " + (i + 1) + ": " + MV.plain(Q.steps[i])); } });
  });
  // ---- Station 4: error-rate data ----
  var Q4 = P.st4, msgs = {};
  $("#dd-tb", host).innerHTML = MV.tableHTML({ head:Q4.head, rows:Q4.rows, caption:"Approximate errors per base copied at each stage" });
  function paint4(){
    var allDone = Q4.asks.every(function(q){ return S.st4.done[q.id]; });
    var h = Q4.asks.map(function(q){
      var d = S.st4.done[q.id], id = "dd-in-" + q.id;
      return '<div class="dd-frow"><label for="' + id + '">' + q.t + "</label> <span class=\"dd-fin\"><input class=\"numin short\" id=\"" + id + '" data-f="' + q.id + '" type="text" inputmode="numeric" autocomplete="off" value="' + MV.esc(S.st4.v[q.id] || "") + '"' + (d ? " disabled" : "") + '><span aria-hidden="true">×</span></span>' +
        (d ? ' <span class="dd-ok">✓</span>' : "") + (msgs[q.id] ? MV.fbHTML("bad", msgs[q.id]) : "") + "</div>";
    }).join("");
    h += allDone ? MV.fbHTML("good", "<strong>" + Q4.done + "</strong>") : '<div class="q-actions"><button type="button" class="btn primary sm" data-f4="check" data-k="f4chk">Check</button></div>';
    MV.keepFocus($("#dd-f", host), function(){ $("#dd-f", host).innerHTML = h; });
  }
  $("#dd-f", host).addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.f; if (id) { S.st4.v[id] = e.target.value; api.save(); } });
  $("#dd-f", host).addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.f) { var b = $('[data-f4="check"]', host); if (b) b.click(); } });
  $("#dd-f", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-f4]"); if (!b) return;
    Q4.asks.forEach(function(q){
      if (S.st4.done[q.id]) return;
      var v = parseVal(S.st4.v[q.id]); msgs[q.id] = null;
      if (v == null) { msgs[q.id] = "Type a whole number, such as 10."; return; }
      if (Math.abs(v - MV.ans(q)) < 1e-9) { S.st4.done[q.id] = true; return; }
      var w = (q.wrong || []).filter(function(x){ return Math.abs(x.match - v) < 1e-9; })[0];
      msgs[q.id] = "<strong>✗ Not quite.</strong> " + (w ? w.fb : Q4.general) + " Try again.";
    });
    api.save(); paint4(); MV.focusFb($("#dd-f", host));
  });
  paint4();
  // ---- Station 5: telomere model (cell type + Divide) ----
  var Q5 = P.st5, TEL0 = 8, TELMIN = 2, tmsg = "";
  function cell(){ return byId(Q5.cells, S.tel.cell); }
  function blocks(){ return cell().tel ? TEL0 : Math.max(TELMIN, TEL0 - S.tel.n); }
  function paintTel(){
    var el = $("#dd-tel", host), c = cell(), nb = blocks(), stopped = !c.tel && nb <= TELMIN;
    var bar = ""; for (var k = 0; k < TEL0; k++) bar += '<i class="dd-tb' + (k < nb ? " on" : "") + '"></i>';
    var h = '<h4 class="dd-th">Telomere model</h4><div id="dd-cells"></div>' +
      '<div class="dd-tbar" role="img" aria-label="' + MV.esc("Telomere: " + nb + " of " + TEL0 + " repeat blocks left after " + S.tel.n + " divisions.") + '"><span class="dd-tch">chromosome</span>' + bar + "</div>" +
      '<dl class="read dd-tread">' + MV.readoutHTML([["Divisions", String(S.tel.n)], ["Telomere", nb + " of " + TEL0 + " repeat blocks"], ["Telomerase", c.tel ? "active: adds back what each division loses" : "off: each division loses a block"], ["Cell", stopped ? "has stopped dividing" : "still dividing"]]) + "</dl>" +
      '<div class="q-actions"><button type="button" class="btn primary sm" data-tl="div" data-k="tldiv"' + (stopped ? " disabled" : "") + '>Divide</button><button type="button" class="btn ghost sm" data-tl="reset" data-k="tlreset">Start again</button></div>' +
      (tmsg ? '<p class="dd-tmsg" aria-live="polite">' + tmsg + "</p>" : '<p class="dd-tmsg" aria-live="polite"></p>') + '<p class="tiny muted"><span class="bio-model">Model</span> ' + Q5.model + "</p>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
    var cr = MV.seg($("#dd-cells", host), { label:"Cell type", options:Q5.cells.map(function(x){ return { id:x.id, t:x.t }; }), value:S.tel.cell, onChange:function(v){ S.tel.cell = v; S.tel.n = 0; tmsg = ""; api.save(); paintTel(); var b = $('#dd-cells [data-seg="' + v + '"]', host); if (b) b.focus(); } });
  }
  $("#dd-tel", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-tl]"); if (!b || b.disabled) return;
    if (b.dataset.tl === "reset") { S.tel.n = 0; tmsg = ""; }
    else { S.tel.n++; var c = cell(); tmsg = c.tel ? "Division " + S.tel.n + ": the end lost a little DNA, and telomerase added a repeat back." : blocks() <= TELMIN ? "Division " + S.tel.n + ": the telomere is down to its limit, so this cell stops dividing." : "Division " + S.tel.n + ": the end-replication problem cost one repeat block."; }
    api.save(); paintTel();
  });
  paintTel();
  return {};
}

// ---------- Practice 1: Put the steps in order (@component routeBuilder — from SBI4U 16: tap tiles in order; a tile can be left out,
// so a distractor works; pattern feedback "X placed before Y" from SBI4U 14) ----------
function orderAct(host, api, a){
  var S = api.S; S.seq = S.seq || {};
  var msgs = {};
  function sq(s){ return S.seq[s.id] || (S.seq[s.id] = { placed:[], tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">Tap the steps in order, first to last. Tap a step in your list to send it back. Press Check when your list is complete.</p>' + a.sequences.map(function(s, i){ return '<div class="q' + (i ? " part" : "") + '" data-seq="' + s.id + '" style="border-bottom:0"></div>'; }).join("");
  function paintSeq(s){
    var i = a.sequences.indexOf(s), x = sq(s), box = host.querySelector('[data-seq="' + s.id + '"]');
    var order = MV.shuffle(s.tiles.map(function(_, k){ return k; }), MV.meta.id + s.id);
    var h = '<p class="task">Sequence ' + (i + 1) + ": " + s.prompt + "</p>";
    h += '<div class="dd-rlab">Your order:</div><ol class="dd-route" aria-label="Your order">' + (x.placed.length ? x.placed.map(function(t, p){ return '<li><button type="button" class="dd-rt' + (x.solved ? " good" : "") + '" data-rm="' + p + '" data-k="' + s.id + "r" + t + '"' + (x.solved ? " disabled" : "") + ' aria-label="' + MV.esc("Step " + (p + 1) + ": " + MV.plain(s.tiles[t]) + (x.solved ? "" : ". Tap to send it back.")) + '"><span class="sn">' + (p + 1) + ".</span><span>" + s.tiles[t] + "</span></button></li>"; }).join("") : '<li class="muted dd-rempty">Empty: tap a step below.</li>') + "</ol>";
    if (!x.solved) {
      var left = order.filter(function(t){ return x.placed.indexOf(t) < 0; });
      h += '<div class="dd-rlab">Steps:</div><div class="dd-bank" role="group" aria-label="Steps to place">' + (left.length ? left.map(function(t){ return '<button type="button" class="dd-tile" data-add="' + t + '" data-k="' + s.id + "t" + t + '">' + s.tiles[t] + "</button>"; }).join("") : '<span class="muted tiny">All steps placed.</span>') + "</div>";
      h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + s.id + 'chk">Check the order</button><button type="button" class="btn ghost sm" data-act="clear" data-k="' + s.id + 'clr">Clear</button>' + (s.hints ? MV.hintBtn(s.id + "hint", x.hint) : "") + "</div>" + (s.hints ? MV.hintsHTML(s.hints, x.hint) : "");
    }
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ That order works.</strong> ' + s.why + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[s.id]) h += '<div class="fb bad" role="status"><p>' + msgs[s.id] + "</p></div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  function judge(s, placed){
    var ans = MV.ans(s);
    if (placed.length === ans.length && placed.every(function(v, k){ return v === ans[k]; })) return null;
    var bad = (s.bad || []).filter(function(q){ return placed.indexOf(q.tile) >= 0; })[0]; if (bad) return bad.fb;
    var w = (s.wrongIf || []).filter(function(q){ var i = placed.indexOf(q.before[0]), j = placed.indexOf(q.before[1]); return i >= 0 && j >= 0 && i < j; })[0]; if (w) return w.fb;
    if (placed.length < ans.length) return "Some steps are still missing: every step of the process needs a place.";
    for (var p = 0; p < placed.length; p++) if (placed[p] !== ans[p]) return "Step " + (p + 1) + " is out of place. Ask what has to happen before it can be done.";
    return "Ask what has to happen before each step can be done.";
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-seq]"); if (!box) return;
    var s = byId(a.sequences, box.dataset.seq), x = sq(s);
    if (b.dataset.add != null) { x.placed.push(+b.dataset.add); msgs[s.id] = null; api.save(); paintSeq(s); var nb = box.querySelector(".dd-tile"); if (nb && !box.contains(document.activeElement)) nb.focus(); return; }
    if (b.dataset.rm != null) { x.placed.splice(+b.dataset.rm, 1); msgs[s.id] = null; api.save(); paintSeq(s); return; }
    if (b.dataset.act === "clear") { x.placed = []; msgs[s.id] = null; api.save(); paintSeq(s); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintSeq(s); return; }
    if (b.dataset.act === "check") {
      if (!x.placed.length) { msgs[s.id] = "Tap the steps in order first."; paintSeq(s); return; }
      var fb = judge(s, x.placed);
      if (!fb) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[s.id] = null; }
      else { x.tries++; msgs[s.id] = "<strong>✗ Not yet.</strong> " + fb + " Try again."; }
      api.save(); paintSeq(s); MV.focusFb(box);
    }
  });
  a.sequences.forEach(paintSeq);
  return {
    stats:function(){ var f = 0, d = 0; a.sequences.forEach(function(s){ var x = sq(s); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.sequences.length, done:d, line:a.summary + " (first try): " + f + "/" + a.sequences.length + (d < a.sequences.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.sequences.forEach(function(s){ var x = sq(s); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(s.goal != null ? s.goal : a.goal)); }); return g; }
  };
}

// ---------- Practice 2: Direction and counting puzzles (@component seqEntry — S5 sequence entry: choose the left end, type the bases;
// chips; N4 numbers with named wrong answers; adapted from SBI4U 18's arith) ----------
var COMP = { A:"T", T:"A", G:"C", C:"G" };
function puzzles(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = { val:"", end:"", pick:null, tries:0, hint:0, solved:false, first:null }); return x; }
  host.innerHTML = '<p class="how">Answer each puzzle, then press Check (or tap a chip). You can try again as often as you need.</p>' + a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), el = host.querySelector('[data-li="' + it.id + '"]'), id = "dd-li-" + it.id;
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "seq") {
      var other = x.end === "5" ? "3′" : x.end === "3" ? "5′" : "?";
      h += '<div class="dd-seqbox"><div class="dd-sqrow"><span class="dd-sqlab">Template</span><span class="dd-seq">3′-' + it.template + '-5′</span></div>' +
        '<div class="dd-sqrow"><span class="dd-sqlab">New strand</span><span class="dd-endc" role="radiogroup" aria-label="Left end of the new strand">' + ["5", "3"].map(function(e){ var on = x.end === e; return '<button type="button" role="radio" aria-checked="' + on + '" class="dd-endb' + (on ? " on" : "") + '" data-end="' + e + '" data-k="' + it.id + "e" + e + '"' + (x.solved ? " disabled" : "") + ">" + e + "′</button>"; }).join("") + '</span><span class="dd-seq">-</span>' +
        '<label class="vh" for="' + id + '">Bases of the new strand, left to right</label><input class="numin dd-basein" id="' + id + '" data-lin="' + it.id + '" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="12" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + '><span class="dd-seq">-' + other + "</span></div></div>";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button></div>';
    } else if (it.kind === "chips") {
      h += '<div class="chips dd-chips" role="group" aria-label="Choices">' + it.options.map(function(o, k){ var on = x.pick === k; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-ci="' + k + '" data-k="' + it.id + "c" + k + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
    } else {
      h += '<div class="numrow"><label for="' + id + '">Your answer:</label><input class="numin" id="' + id + '" data-lin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + "></div>";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    }
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct' + (it.display ? ": " + it.display : "") + ".</strong> " + (x.note || it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function judgeSeq(it, x){
    var bases = String(x.val || "").toUpperCase().replace(/[^A-Z]/g, ""), want = MV.ans(it), rev = want[1].split("").reverse().join("");
    if (!x.end || !bases) return { msg:"Choose the new strand’s left end (5′ or 3′) and type its bases." };
    if (/U/.test(bases)) return { bad:it.wrongU };
    if (x.end === want[0] && bases === want[1]) return { ok:true };
    if (x.end !== want[0] && bases === rev) return { ok:true, note:it.sameStrand };
    if (x.end !== want[0] && bases === want[1]) return { bad:it.wrongEnds };
    if (bases === it.template) return { bad:"That copies the template. Pair each base with its partner." };
    if (bases === rev) return { bad:"Line the new strand up under the template, base for base, before you read it off." };
    return { bad:it.wrongBases };
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lin) { var b = host.querySelector('[data-k="' + e.target.dataset.lin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var el = b.closest("[data-li]"); if (!el) return;
    var it = byId(a.items, el.dataset.li), x = ist(it.id), r;
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it); return; }
    if (b.dataset.end) { x.end = b.dataset.end; msgs[it.id] = null; api.save(); paintItem(it); return; }
    if (b.dataset.ci != null) {
      var k = +b.dataset.ci, o = it.options[k]; x.pick = k;
      if (MV.ok(o)) { x.solved = true; x.first = x.tries === 0; x.note = o.why; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + o.why + " Try another chip."; }
      api.save(); paintItem(it); MV.focusFb(el); return;
    }
    if (b.dataset.act !== "check") return;
    if (it.kind === "seq") {
      r = judgeSeq(it, x);
      if (r.msg) { msgs[it.id] = r.msg; paintItem(it); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0; x.note = r.note || null; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + r.bad + " Try again."; }
    } else {
      var v = parseVal(x.val);
      if (v == null) { msgs[it.id] = "Enter a number, such as 12."; paintItem(it); return; }
      if (Math.abs(v - MV.ans(it)) < 1e-9) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { var w = (it.wrong || []).filter(function(q){ return Math.abs(q.match - v) < 1e-9; })[0]; x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (w ? w.fb : it.general) + " Try again."; }
    }
    api.save(); paintItem(it); MV.focusFb(el);
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Origins on the map (@component originStrip — a 0–120 nt chromosome strip with tappable origin
// markers; bubbles open 10 nt per step and merge; steps and primers by the plan's model) ----------
var LEN = 120, SPOTS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110];
function oriModel(O){
  O = O.slice().sort(function(a, b){ return a - b; });
  var forks = [];
  O.forEach(function(o, i){
    forks.push({ o:o, dir:-1, d:i ? (o - O[i - 1]) / 2 : o });
    forks.push({ o:o, dir:1, d:i < O.length - 1 ? (O[i + 1] - o) / 2 : LEN - o });
  });
  var maxD = forks.reduce(function(m, f){ return Math.max(m, f.d); }, 0);
  var gaps = O.slice(1).map(function(o, i){ return o - O[i]; });
  return { O:O, forks:forks, steps:O.length ? Math.ceil(maxD / 10 - 1e-9) : null, primers:2 * O.length + forks.reduce(function(t, f){ return t + Math.ceil(f.d / 10 - 1e-9); }, 0),
    minGap:gaps.length ? Math.min.apply(null, gaps) : null };
}
function stripSVG(M, step){
  var X = function(v){ return 20 + v * 3.3; }, h = "", y = 46;
  h += ln(X(0), y - 6, X(LEN), y - 6, "dd-t1") + ln(X(0), y + 6, X(LEN), y + 6, "dd-t2");
  for (var v = 0; v <= LEN; v += 10) h += ln(X(v), y + 14, X(v), y + 19, "dd-rung") + (v % 20 === 0 ? txt(X(v), y + 31, String(v), "dd-stk", "middle") : "");
  M.forks.forEach(function(f){
    var t = Math.min(f.d, 10 * step), a = f.o, b = f.o + f.dir * t;
    if (t <= 0) return;
    var x1 = X(Math.min(a, b)), x2 = X(Math.max(a, b));
    h += sv("rect", { x:x1, y:y - 15, width:x2 - x1, height:30, "class":"dd-bub" }) + ln(x1, y - 13, x2, y - 13, "dd-t1") + ln(x1, y + 13, x2, y + 13, "dd-t2") + ln(x1, y - 7, x2, y - 7, "dd-new") + ln(x1, y + 7, x2, y + 7, "dd-new");
    if (t < f.d) h += txt(X(b), y + 4, f.dir > 0 ? "›" : "‹", "dd-fk", "middle");
  });
  M.O.forEach(function(o){ h += sv("path", { d:"M" + f1(X(o)) + " " + (y - 20) + " l-6 -10 l12 0 z", "class":"dd-orim" }); });
  return '<svg viewBox="0 0 436 84" aria-hidden="true" focusable="false">' + h + "</svg>";
}
var task = (function(){
  var api = null, T = null, step = 99, run = null;
  function st(){ var s = api.S; if (!Array.isArray(s.O)) s.O = []; s.O = s.O.filter(function(v){ return SPOTS.indexOf(v) >= 0; }); return s; }
  function read(){ return { O:api ? st().O.slice().sort(function(a, b){ return a - b; }) : [] }; }
  function setTxt(O){ return "{" + O.join(", ") + "}"; }
  function preview(){
    var el = $("#dd-tpv"); if (!el) return;
    var M = oriModel(read().O), shown = M.steps == null ? 0 : Math.min(step, M.steps);
    var sAria = M.O.length ? "Origins at " + M.O.join(", ") + " nucleotides. " + (shown >= M.steps ? "Copying is finished." : "Step " + shown + " of " + M.steps + ".") : "No origins placed.";
    el.innerHTML = '<div class="dd-strip" role="img" aria-label="' + MV.esc(sAria) + '">' + stripSVG(M, shown) + "</div>" +
      '<p class="dd-stepl" aria-live="polite">' + (M.O.length ? (shown >= M.steps ? "Copying finished after " + plural(M.steps, "step") + "." : "Step " + shown + " of " + M.steps) : "Place an origin to start.") + "</p>" +
      '<dl class="read dd-tread">' + MV.readoutHTML([["Origins", M.O.length ? setTxt(M.O) : "none"], ["Steps to finish", M.steps == null ? "—" : String(M.steps)], ["Primers used", M.O.length ? String(M.primers) : "—"], ["Smallest gap between origins", M.minGap == null ? "—" : M.minGap + " nt"]]) + "</dl>";
  }
  function paintIn(){
    var s = st(), el = $("#dd-tin"); if (!el) return;
    MV.keepFocus(el, function(){
      el.innerHTML = '<p class="how">' + T.how + '</p><div class="dd-spots" role="group" aria-label="Origin positions">' + SPOTS.map(function(v){ var on = s.O.indexOf(v) >= 0; return '<button type="button" class="dd-spot' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-spot="' + v + '" data-k="sp' + v + '" aria-label="Origin at ' + v + ' nt">' + v + "</button>"; }).join("") + "</div>" +
        '<div class="q-actions"><button type="button" class="btn sm" data-trun="1" data-k="trun"' + (s.O.length ? "" : " disabled") + '>Run copying</button><button type="button" class="btn ghost sm" data-tclr="1" data-k="tclr">Clear origins</button></div>';
    });
  }
  function stopRun(){ if (run) { run(); run = null; } }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content; st();
      inp.innerHTML = '<div id="dd-tin"></div>';
      pv.innerHTML = '<div class="dd-tpvw"><h4>Your chromosome</h4><div id="dd-tpv"></div><p class="tiny muted"><span class="bio-model">Model</span> ' + T.model + "</p></div>";
      paintIn(); preview();
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || b.disabled) return;
        var s = st();
        if (b.dataset.spot) { stopRun(); step = 99; var v = +b.dataset.spot, i = s.O.indexOf(v); if (i >= 0) s.O.splice(i, 1); else s.O.push(v); a.save(); paintIn(); preview(); a.update(); return; }
        if (b.dataset.tclr) { stopRun(); step = 99; s.O = []; a.save(); paintIn(); preview(); a.update(); return; }
        if (b.dataset.trun) {
          stopRun(); var M = oriModel(read().O); if (!M.O.length) return;
          var n = M.steps, rb = b; rb.disabled = true; step = 0; preview();
          run = MV.tween({ dur:700 * n + 300, ease:lin, step:function(k){ var sNow = Math.min(n, Math.floor(k * (n + 0.43))); if (sNow !== step) { step = sNow; preview(); } }, done:function(){ run = null; step = 99; preview(); var r2 = $('[data-trun]'); if (r2) r2.disabled = false; } });
        }
      });
    },
    read:read,
    valid:function(d){ return d.O.length ? true : "Place at least one origin first."; },
    checks:function(d){ var M = oriModel(d.O); return [M.steps != null && M.steps <= 3, M.O.length === 3, M.minGap == null || M.minGap >= 40, M.primers <= 18]; },
    key:function(d){ return d.O.join(","); },
    label:function(k){ return MV.esc(setTxt(k.split(","))); },
    text:function(k){ return setTxt(k.split(",")); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ order:orderAct, puzzles:puzzles },
  task:task,
  onShow:function(v){ if (v === "explore" && EX) EX.show(); }
});
})();
