// MDM4U 10 Circular Permutations: hero (a table of four turns three times; the line-ups stack into one circle),
// Round table (Explore: D4 circular mode with Round table / Ring that can flip / Numbered seats, rotate, flip, collect
// rotations, list all, lock tool, restriction chips, Your count), Circular with restrictions (Part 3: place tokens on a
// table one at a time and multiply the choices; check by listing), "Table planner" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
var NS = " ";                                                    // narrow no-break space: 40 320
function big(v){ return MV.mdm.fmt(v).replace(/ /g, NS); }
function fact(n){ return MV.mdm.fact(n); }
function M(s){ return MV.m(s); }
function plural(n, w){ return n + " " + w + (n === 1 ? "" : "s"); }
function clampInt(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }
function parseWhole(raw){ var s = String(raw == null ? "" : raw).trim().replace(/[\s,  ]/g, "").replace(/−/g, "-"); return /^-?\d+$/.test(s) ? parseInt(s, 10) : null; }

// @component radioGroup (copied from MDM4U 06) — segmented control or chip row as a real radio group
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id)}) -> {set, get, lock, refresh}
function radios(host, o){
  var val = String(o.value), locked = false;
  function off(id){ return locked || !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = off(val) || ids.indexOf(val) < 0 ? ids.filter(function(id){ return !off(id); })[0] : val;
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

// @component D4 arrangementTiles — circular-table mode (course plan D4: "a circular table mode with rotation equivalence"),
// self-contained. A seating is an array seat -> person (seat 0 is the top seat, seats run clockwise); people are 0 … n − 1
// (letters A–H, or names). Settings: "table" (rotations are the same), "ring" (rotations and flips are the same), "numbered"
// (seats 1 … n are labelled: nothing is the same).
//   D4C.rotate(seat, d)  d = +1 clockwise (everyone moves one seat on), −1 counterclockwise     D4C.mirror(seat)  flip about the top seat
//   D4C.canon(seat, setting) -> representative seating (person 0 at the top; ring: and seat 1 < seat n − 1)
//   D4C.RULE {tog, apart, opp, betw, W}: rules on people 0 (A), 1 (B), 2 (C), 3 (D); D4C.fits(seat, rules)
//   D4C.circles(n, setting) -> every distinct arrangement (canonical forms; numbered: all n!)   D4C.count(n, setting, rules) (brute force, cached)
//   D4C.mini(seat, {num, names}) -> small SVG table      D4C.listHTML(n, setting, rules, {cur, names, as}) -> list of small tables
//   v = D4C.view(host, {}) ; v.render({n, seat:[p | null], label(p) -> html, name(p), num, lock, glow:{k}, seatBtn, cls(p)}) ;
//       v.place(fn(p, k) -> {a, s} (angle in seats, x-scale) | {x, y} (%))  for animation frames
var D4C = (function(){
  var AZ = "ABCDEFGH";
  function rotate(seat, d){ var n = seat.length, out = []; seat.forEach(function(p, k){ out[((k + d) % n + n) % n] = p; }); return out; }
  function mirror(seat){ var n = seat.length; return seat.map(function(_, k){ return seat[(n - k) % n]; }); }
  function posOf(seat){ var p = []; seat.forEach(function(x, k){ if (x != null) p[x] = k; }); return p; }
  function adj(p, n, x, y){ var d = ((p[x] - p[y]) % n + n) % n; return d === 1 || d === n - 1; }
  var RULE = {
    tog:function(p, n){ return adj(p, n, 0, 1); },
    apart:function(p, n){ return !adj(p, n, 0, 1); },
    opp:function(p, n){ return n % 2 === 0 && ((p[2] - p[0]) % n + n) % n === n / 2; },
    betw:function(p, n){ return adj(p, n, 0, 1) && adj(p, n, 0, 2); },
    W:function(p, n){ return adj(p, n, 0, 1) && adj(p, n, 0, 3); }
  };
  function fits(seat, rules){ var p = posOf(seat), n = seat.length; return (rules || []).every(function(r){ return RULE[r](p, n); }); }
  function canon(seat, setting){
    if (setting === "numbered") return seat.slice();
    var n = seat.length, s = rotate(seat, -seat.indexOf(0));
    if (setting === "ring" && n >= 3 && s[1] > s[n - 1]) s = mirror(s);
    return s;
  }
  function each(n, first0, fn){                                  // every seating (person 0 fixed at seat 0 when first0)
    var seat = [], used = [];
    if (first0) { seat[0] = 0; used[0] = true; }
    (function rec(k){
      if (k === n) { fn(seat); return; }
      for (var i = 0; i < n; i++) if (!used[i]) { used[i] = true; seat[k] = i; rec(k + 1); used[i] = false; }
    })(first0 ? 1 : 0);
  }
  var cache = {};
  function circles(n, setting){
    var key = "c" + n + setting; if (cache[key]) return cache[key];
    var out = [];
    each(n, setting !== "numbered", function(s){ if (setting !== "ring" || n < 3 || s[1] < s[n - 1]) out.push(s.slice()); });
    return (cache[key] = out);
  }
  function count(n, setting, rules){
    rules = (rules || []).slice().sort();
    var key = n + setting + rules.join(","); if (key in cache) return cache[key];
    var c = 0;
    each(n, setting !== "numbered", function(s){ if ((setting !== "ring" || n < 3 || s[1] < s[n - 1]) && fits(s, rules)) c++; });
    return (cache[key] = c);
  }
  function firstFit(n, rules){ var out = null; circles(n, "table").some(function(s){ if (fits(s, rules)) { out = s; return true; } return false; }); return out; }
  function xy(a, n, R){ var t = (-90 + 360 * a / n) * Math.PI / 180; return [50 + R * Math.cos(t), 50 + R * Math.sin(t)]; }
  function nameOf(p, o){ return o && o.names ? o.names[p] : AZ[p]; }
  function mini(seat, o){
    o = o || {};
    var n = seat.length, h = '<svg class="cir-mini" viewBox="0 0 60 60" aria-hidden="true" focusable="false"><circle class="cir-md" cx="30" cy="30" r="12"/>';
    seat.forEach(function(p, k){ var q = xy(k, n, 34.5); h += '<text class="cir-mt" x="' + (q[0] * 0.6).toFixed(1) + '" y="' + (q[1] * 0.6).toFixed(1) + '">' + nameOf(p, o) + "</text>"; });
    if (o.num) h += '<text class="cir-mn" x="30" y="24.5">1</text>';
    return h + "</svg>";
  }
  function say(seat, o){ return seat.map(function(p){ return nameOf(p, o); }).join(" "); }
  function listHTML(n, setting, rules, o){
    o = o || {};
    var as = o.as || setting, C = circles(n, as), fitN = 0, cur = o.cur ? canon(o.cur, as).join("") : null, h = "";
    rules = rules || [];
    C.forEach(function(s){
      var ok = !rules.length || fits(s, rules), on = cur === s.join(""); if (ok) fitN++;
      var cls = "cir-li" + (rules.length ? (ok ? " fit" : " nofit") : "") + (on ? " cur" : "");
      var sr = (as === "numbered" ? "Seats 1 to " + n + ": " : "Clockwise from the top: ") + say(s, o) + (as === "ring" ? "; turned over: " + say(mirror(s), o) : "") + (rules.length ? (ok ? ", fits" : ", doesn’t fit") : "") + (on ? ", the seating on the big table" : "");
      if (as === "ring") h += '<li class="' + cls + ' pair">' + mini(s, o) + '<span class="cir-eq" aria-hidden="true">=</span>' + mini(mirror(s), o) + '<span class="vh">' + sr + "</span></li>";
      else h += '<li class="' + cls + '">' + mini(s, { num:as === "numbered", names:o.names }) + '<span class="vh">' + sr + "</span></li>";
    });
    return { html:'<ul class="cir-ul' + (as === "ring" ? " pairs" : "") + '">' + h + "</ul>", total:C.length, fit:fitN };
  }
  function view(host, o){
    o = o || {};
    host.classList.add("cir-tw");
    host.innerHTML = '<div class="cir-disc" aria-hidden="true"><span class="cir-dir">↻</span></div><span class="cir-topm" aria-hidden="true">▼</span><div class="cir-nums" aria-hidden="true"></div><div class="cir-toks"></div>';
    var toks = host.querySelector(".cir-toks"), nums = host.querySelector(".cir-nums"), cur = null, R = 38.5;
    function setPos(el, q){ el.style.left = q[0].toFixed(2) + "%"; el.style.top = q[1].toFixed(2) + "%"; }
    function render(s){
      cur = s;
      var n = s.n, h = "", nh = "";
      host.style.setProperty("--cir-n", n);
      host.classList.toggle("dense", n >= 7);
      for (var k = 0; k < n; k++) {
        var p = s.seat[k], q = xy(k, n, R), st = 'style="left:' + q[0].toFixed(2) + "%;top:" + q[1].toFixed(2) + '%"';
        var g = s.glow && s.glow[k] ? " glow" : "";
        if (p == null) {
          if (s.seatBtn) h += '<button type="button" class="cir-seat' + g + '" data-seat="' + k + '" data-k="seat' + k + '" ' + st + ' aria-label="Seat ' + (k + 1) + ", empty" + (g ? ", allowed" : "") + '"><span aria-hidden="true">' + (k + 1) + "</span></button>";
          else h += '<span class="cir-seat" ' + st + ' aria-hidden="true"></span>';
        } else {
          var lk = s.lock === p ? " lock" : "", cl = s.cls ? " " + s.cls(p) : "";
          h += '<span class="cir-tok' + lk + g + cl + '" data-p="' + p + '" data-s="' + k + '" ' + st + ">" + (s.label ? s.label(p) : AZ[p]) + (lk ? '<span class="cir-lk" aria-hidden="true"></span>' : "") + "</span>";
        }
        if (s.num) { var r = xy(k, n, 22); nh += '<span class="cir-num" style="left:' + r[0].toFixed(2) + "%;top:" + r[1].toFixed(2) + '%">' + (k + 1) + "</span>"; }
      }
      MV.keepFocus(toks, function(){ toks.innerHTML = h; });
      nums.innerHTML = nh;
      host.classList.toggle("numd", !!s.num);
    }
    function place(fn){
      if (!cur) return;
      $$(".cir-tok", toks).forEach(function(el){
        var r = fn(+el.dataset.p, +el.dataset.s); if (!r) return;
        if (r.x != null) { setPos(el, [r.x, r.y]); return; }
        var q = xy(r.a, cur.n, R); setPos(el, [50 + (q[0] - 50) * (r.s == null ? 1 : r.s), q[1]]);
        el.classList.toggle("back", r.s != null && r.s < 0);
      });
    }
    function at(k){ return cur ? xy(k, cur.n, R) : [50, 50]; }
    return { render:render, place:place, at:at, el:host };
  }
  return { AZ:AZ, rotate:rotate, mirror:mirror, posOf:posOf, canon:canon, RULE:RULE, fits:fits, circles:circles, count:count, firstFit:firstFit, mini:mini, say:say, listHTML:listHTML, view:view };
})();

// ---------- Explore: Round table ----------
var SETTINGS = [{ id:"table", t:"Round table" }, { id:"ring", t:"Ring that can flip" }, { id:"numbered", t:"Numbered seats" }];
var SNAME = { table:"Round table", ring:"Ring that can flip", numbered:"Numbered seats" };
var CHIPS = [{ id:"tog", t:"A and B together" }, { id:"apart", t:"A and B apart" }, { id:"opp", t:"C directly opposite A" }, { id:"betw", t:"A between B and C" }];
function chipName(id){ return CHIPS.filter(function(c){ return c.id === id; })[0].t; }
function ident(n){ var s = []; for (var i = 0; i < n; i++) s.push(i); return s; }
function sameSeat(a, b){ return a.length === b.length && a.every(function(x, i){ return x === b[i]; }); }

// distinct arrangements for a setting: [formula source, value]
function distinct(n, set){
  if (set === "ring") return [(n - 1) + "!/2", fact(n - 1) / 2];
  if (set === "numbered") return [n + "!", fact(n)];
  return ["(" + n + " - 1)!", fact(n - 1)];
}
// restriction readout: the chip's own formula (table), then ÷ 2 (ring) or × n (numbered); two chips: by listing
function restrictLine(n, set, chips){
  if (!chips.length) return null;
  var c = D4C.count(n, set, chips);
  if (chips.length > 1) return { txt:chips.map(chipName).join(" + ") + ": " + big(c) + " (by listing every seating)", c:c };
  var id = chips[0], f, fv;                                       // fv: the formula's value for a table (checked against the listing)
  if (id === "tog") { f = "(" + (n - 1) + " - 1)! × 2"; fv = fact(n - 2) * 2; }
  else if (id === "apart") { f = "(" + n + " - 1)! - " + big(fact(n - 2) * 2); fv = fact(n - 1) - fact(n - 2) * 2; }
  else if (id === "opp") { f = "(" + n + " - 2)!"; fv = fact(n - 2); }
  else { f = "2 × (" + n + " - 3)!"; fv = 2 * fact(n - 3); }
  var src = f + (set === "ring" ? " ÷ 2" : set === "numbered" ? " × " + n : "");
  var check = set === "ring" ? fv / 2 : set === "numbered" ? fv * n : fv;
  return { txt:chipName(id) + ": " + M(check === c ? src + " = " + big(c) : big(c)), c:c };
}

function explore(host, api){
  var S = api.S;
  if (!SETTINGS.some(function(x){ return x.id === S.setting; })) S.setting = "table";
  S.n = clampInt(S.n, 3, 8, 5);
  if (!Array.isArray(S.seat) || S.seat.length !== S.n || ident(S.n).some(function(i){ return S.seat.indexOf(i) < 0; })) S.seat = ident(S.n);
  S.lock = S.lock != null && S.lock >= 0 && S.lock < S.n ? S.lock | 0 : null;
  S.chips = Array.isArray(S.chips) ? S.chips.filter(function(c, i, a){ return CHIPS.some(function(x){ return x.id === c; }) && a.indexOf(c) === i && !(c === "opp" && S.n % 2); }).slice(0, 2) : [];
  S.list = !!S.list; S.guess = typeof S.guess === "string" ? S.guess : ""; S.shuf = S.shuf | 0;
  if (S.lock != null && S.seat[0] !== S.lock) S.seat = D4C.rotate(S.seat, -S.seat.indexOf(S.lock));
  var pv = {}, anim = null, msg = "", gfb = "";

  host.innerHTML =
    '<div class="cir-topbar"><div id="cir-set"></div></div>' +
    '<div class="pg cir-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap cir-cap" id="cir-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="cir-stage"><div class="cir-big" id="cir-tbl" tabindex="0" role="group" aria-roledescription="table drawing"></div><div class="cir-stack" id="cir-stack"></div></div>' +
      '<p class="cir-line" id="cir-line"></p><p class="cir-msg" id="cir-msg" aria-live="polite"></p><div class="cir-list" id="cir-list"></div></div>' +
    '<div class="pg-ctrl"><div id="cir-n"></div><div class="q-actions cir-btns" id="cir-btns"></div>' +
      '<div class="cir-lockrow"><label for="cir-lock" class="rg-lab">Lock tool</label><select id="cir-lock" class="cir-sel"></select></div>' +
      '<div class="cir-chipbox"><p class="rg-lab" id="cir-chl">Restriction chips (up to 2)</p><div class="chips cir-chips" id="cir-chips" role="group" aria-labelledby="cir-chl"></div></div>' +
      '<div class="cir-guess"><div class="numrow"><label for="cir-gin">Your count</label><input class="numin short" id="cir-gin" type="text" inputmode="numeric" autocomplete="off"><button type="button" class="btn ghost sm" id="cir-gbtn" data-k="cirg">Compare with the tool</button></div><div id="cir-gfb" aria-live="polite"></div></div>' +
      '<p class="tiny muted cir-how" id="cir-how"></p></div>' +
    '<div class="pg-read"><dl class="read" id="cir-read" aria-live="polite"></dl></div></div>';

  var tbl = $("#cir-tbl", host), view = D4C.view(tbl);
  var setR = radios($("#cir-set", host), { label:"Setting", options:SETTINGS, value:S.setting, cls:"seg",
    onChange:function(v){ user(); S.setting = v; pv.stack = null; msg = ""; save(); render(); MV.changed(); } });
  $("#cir-n", host).innerHTML = '<label class="slider"><span class="slider-top"><span>People ' + M("n") + '</span><output id="cir-n-out"></output></span><input type="range" id="cir-n-in" min="3" max="8" step="1"></label>';
  var nIn = $("#cir-n-in", host), gin = $("#cir-gin", host), lockSel = $("#cir-lock", host);
  gin.value = S.guess;
  nIn.addEventListener("input", function(){
    user(); S.n = +nIn.value; S.seat = ident(S.n); pv.stack = null;
    if (S.lock != null && S.lock >= S.n) S.lock = null;
    if (S.n % 2 && S.chips.indexOf("opp") >= 0) { S.chips = S.chips.filter(function(c){ return c !== "opp"; }); msg = "“C directly opposite A” needs an even number of people, so it’s off."; } else msg = "";
    if (S.n > 5) S.list = false;
    save(); render(); MV.changed();
  });
  lockSel.addEventListener("change", function(){
    user(); var v = lockSel.value === "" ? null : +lockSel.value;
    if (v == null) { S.lock = null; msg = "Unlocked: the table can turn again."; save(); render(); MV.changed(); return; }
    var k = S.seat.indexOf(v);
    S.lock = null; msg = "";
    if (k === 0) { S.lock = v; lockMsg(); save(); render(); MV.changed(); return; }
    var d = k <= S.n / 2 ? -k : S.n - k, target = D4C.rotate(S.seat, d);
    newAnim(function(){ S.seat = target; S.lock = v; lockMsg(); });
    spin(d, finish);
  });
  function lockMsg(){ msg = D4C.AZ[S.lock] + " is locked at the top seat. A circle has no first seat, so fixing one person breaks the symmetry: now arrange the rest in a line."; }
  $("#cir-chips", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-chip]"); if (!b || b.disabled) return;
    user(); var id = b.dataset.chip, i = S.chips.indexOf(id);
    if (i >= 0) { S.chips.splice(i, 1); msg = ""; }
    else if (S.chips.length >= 2) { msg = "Two chips at most. Turn one off first."; render(); return; }
    else { S.chips.push(id); msg = ""; }
    save(); render(); MV.changed();
  });
  $("#cir-btns", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-b]"); if (!b || b.disabled) return;
    var a = b.dataset.b; user();
    if (a === "ccw" || a === "cw") { doRotate(a === "cw" ? 1 : -1); return; }
    if (a === "flip") { doFlip(); return; }
    if (a === "shuffle") { shuffle(); pv.stack = null; msg = ""; save(); render(); MV.changed(); return; }
    if (a === "collect") { var s0 = S.seat.slice(); newAnim(function(){ S.seat = s0; pv.stack = stackFor(s0); pv.stackCur = null; }); collect(s0, finish); return; }
    if (a === "list") { S.list = !S.list; save(); render(); MV.changed(); }
  });
  tbl.addEventListener("keydown", function(e){
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault(); user();
    if (S.lock != null) { msg = "Unlock first: a locked person can’t turn with the table."; render(); return; }
    doRotate(e.key === "ArrowRight" ? 1 : -1);
  });
  gin.addEventListener("input", function(){ S.guess = gin.value; gfb = ""; $("#cir-gfb", host).innerHTML = ""; save(); });
  gin.addEventListener("keydown", function(e){ if (e.key === "Enter") { e.preventDefault(); compare(); } });
  $("#cir-gbtn", host).addEventListener("click", function(){ user(); compare(); });

  function save(){ api.save(); }
  function user(){ if (anim) finish(); if (pv.hide || pv.glow || pv.listAs) { pv.hide = false; pv.glow = null; pv.listAs = null; } MV.banner("", ""); }
  function compare(){
    var v = parseWhole(S.guess), c = toolCount();
    if (v == null) gfb = MV.fbHTML("", "Type a whole number, such as 24.");
    else if (v === c) gfb = MV.fbHTML("good", "<strong>✓ Matches the tool:</strong> " + big(c) + " for this setup.");
    else gfb = MV.fbHTML("bad", "<strong>✗ The tool counts " + big(c) + "</strong> for this setup (" + setupText() + "). Check your reasoning.");
    $("#cir-gfb", host).innerHTML = gfb;
  }
  function toolCount(){ return S.chips.length ? D4C.count(S.n, S.setting, S.chips) : distinct(S.n, S.setting)[1]; }
  function setupText(){ return SNAME[S.setting] + ", " + M("n = " + S.n) + (S.chips.length ? ", " + S.chips.map(function(c){ return "“" + chipName(c) + "”"; }).join(" and ") : ""); }

  // --- animation bookkeeping: any user action finishes the running animation at once (end() sets the final state) ---
  function newAnim(end, done){ if (anim) finish(); anim = { timers:[], stops:[], end:end || null, done:done || null }; paintBtns(); return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function tween(o){ var a = anim; if (!a) return; a.stops.push(MV.tween({ dur:o.dur, step:function(t){ if (anim === a) o.step(t); }, done:function(){ if (anim === a) o.done(); } })); }
  function finish(){
    var a = anim; if (!a) return; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} });
    if (a.end) a.end();
    save(); render(); MV.changed();
    if (a.done) a.done();
  }
  // one turn of the table (d = +1 clockwise, −1 counterclockwise), then next()
  function spin(d, next){
    var steps = Math.abs(d), dir = d > 0 ? 1 : -1, target = D4C.rotate(S.seat, d);
    tween({ dur:380 * steps + 120, step:function(t){ view.place(function(p, k){ return { a:k + dir * steps * t }; }); },
      done:function(){ S.seat = target; paintTable(); paintLine(); paintStack(); if (next) next(); } });
  }
  function doRotate(d){
    if (S.lock != null) { msg = "Unlock first: a locked person can’t turn with the table."; render(); return; }
    var target = D4C.rotate(S.seat, d);
    msg = S.setting === "numbered" ? "Everyone moved one numbered seat " + (d > 0 ? "clockwise" : "counterclockwise") + ": a different seating." : "Same neighbours, so it’s the same " + (S.setting === "ring" ? "ring" : "seating") + ".";
    newAnim(function(){ S.seat = target; });
    spin(d, finish);
  }
  function doFlip(){
    var target = D4C.mirror(S.seat);
    msg = "Turned over: the mirror image is the same ring.";
    newAnim(function(){ S.seat = target; });
    flipSeq(finish);
  }
  function flipSeq(next){
    var target = D4C.mirror(S.seat);
    tween({ dur:650, step:function(t){ view.place(function(p, k){ return { a:k, s:Math.cos(Math.PI * t) }; }); },
      done:function(){ S.seat = target; paintTable(); paintLine(); paintStack(); if (next) next(); } });
  }
  function shuffle(){
    var r = MV.mdm.seededRandom("mdm4u-10-shuffle-" + (S.shuf++)), n = S.n;
    var pool = D4C.circles(n, "table").filter(function(s){ return D4C.fits(s, S.chips); });
    if (!pool.length) { msg = "No seating fits these chips together."; return; }
    var s = pool[r.int(pool.length)];
    if (S.lock == null) s = D4C.rotate(s, r.int(n));
    else s = D4C.rotate(s, -s.indexOf(S.lock));
    S.seat = s;
  }
  // Collect rotations: record the line-up read from the top seat, turn counterclockwise, … (ring: then flip once)
  function stackFor(s0){
    var rows = [], s = s0.slice();
    for (var i = 0; i < S.n; i++) { rows.push(s); s = D4C.rotate(s, -1); }
    return { rows:rows, flips:S.setting === "ring" ? rows.map(D4C.mirror) : null, set:S.setting, n:S.n };
  }
  function collect(s0, next){
    var full = stackFor(s0);
    if (MV.reduceMotion) { S.seat = s0.slice(); pv.stack = full; msg = S.setting === "numbered" ? S.n + " turns: " + S.n + " different seatings." : "Back to the start after " + S.n + " turns."; paintStack(); paintMsg(); next(); return; }
    pv.stack = { rows:[s0.slice()], flips:null, set:S.setting, n:S.n, partial:true }; paintStack();
    var i = 1;
    (function step(){
      if (i < S.n) { later(260, function(){ spin(-1, function(){ pv.stack.rows.push(S.seat.slice()); i++; paintStack(); step(); }); }); return; }
      later(260, function(){ spin(-1, function(){                                  // the n-th turn is back at the start
        msg = S.setting === "numbered" ? S.n + " turns: " + S.n + " different seatings, then back to the start." : "Back to the start after " + S.n + " turns.";
        paintMsg();
        if (S.setting === "ring") later(350, function(){ flipSeq(function(){ pv.stack.flips = full.flips; paintStack(); later(450, function(){ flipSeq(function(){ pv.stack = full; paintStack(); next(); }); }); }); });
        else { pv.stack = full; paintStack(); next(); }
      }); });
    })();
  }

  // --- painting ---
  function render(){
    setR.set(S.setting); paintN(); paintBtns(); paintLock(); paintChips(); paintTable(); paintLine(); paintStack(); paintList(); paintRead(); paintCap(); paintMsg(); paintHow();
  }
  function paintN(){ nIn.value = S.n; nIn.setAttribute("aria-valuetext", "n = " + S.n); $("#cir-n-out", host).textContent = String(S.n); }
  function paintBtns(){
    var lk = S.lock != null, b = [
      ["ccw", "↺", " ghost", lk, "Rotate counterclockwise"], ["cw", "↻ Rotate", "", lk, "Rotate clockwise"]
    ];
    if (S.setting === "ring") b.push(["flip", "Flip", "", false, "Flip the ring over"]);
    b.push(["shuffle", "Shuffle", " ghost", false, ""], ["collect", "Collect rotations", " ghost", lk, ""],["list", S.list ? "Hide the list" : "List all", " ghost", S.n > 5, ""]);
    var box = $("#cir-btns", host);
    MV.keepFocus(box, function(){
      box.innerHTML = b.map(function(x){ return '<button type="button" class="btn sm' + x[2] + '" data-b="' + x[0] + '" data-k="cb' + x[0] + '"' + (x[4] ? ' aria-label="' + x[4] + '"' : "") + (x[0] === "list" ? ' aria-pressed="' + S.list + '"' : "") + (x[3] ? " disabled" : "") + ">" + x[1] + "</button>"; }).join("");
    });
  }
  function paintLock(){
    var h = '<option value="">Nobody locked</option>';
    for (var i = 0; i < S.n; i++) h += '<option value="' + i + '"' + (S.lock === i ? " selected" : "") + ">Lock " + D4C.AZ[i] + " at the top seat</option>";
    lockSel.innerHTML = h; lockSel.value = S.lock == null ? "" : String(S.lock);
  }
  function paintChips(){
    var box = $("#cir-chips", host);
    MV.keepFocus(box, function(){
      box.innerHTML = CHIPS.map(function(c){
        var on = S.chips.indexOf(c.id) >= 0, off = c.id === "opp" && S.n % 2;
        return '<button type="button" class="chip' + (on ? " on" : "") + '" data-chip="' + c.id + '" data-k="ch' + c.id + '" aria-pressed="' + on + '"' + (off ? ' disabled title="Needs an even number of people"' : "") + ">" + c.t + (off ? ' <span class="tiny">(even ' + M("n") + ")</span>" : "") + "</button>";
      }).join("");
    });
  }
  function paintTable(){
    view.render({ n:S.n, seat:S.seat, num:S.setting === "numbered", lock:S.lock, glow:pv.glow });
    tbl.classList.toggle("ringd", S.setting === "ring");
    tbl.setAttribute("aria-label", SNAME[S.setting] + ", " + plural(S.n, S.setting === "ring" ? "bead" : "person").replace("persons", "people") + ". " + lineText() + (S.lock != null ? ". " + D4C.AZ[S.lock] + " is locked at the top seat" : "") + ". Left and right arrow keys rotate the table.");
  }
  function lineText(){ return (S.setting === "numbered" ? "Seats 1 to " + S.n + ": " : "Clockwise from the top seat: ") + D4C.say(S.seat); }
  function paintLine(){
    var fit = S.chips.length ? (D4C.fits(S.seat, S.chips) ? ' <span class="cir-ok">✓ fits the chips</span>' : ' <span class="cir-no">✗ breaks ' + S.chips.filter(function(c){ return !D4C.fits(S.seat, [c]); }).map(function(c){ return "“" + chipName(c) + "”"; }).join(" and ") + "</span>") : "";
    $("#cir-line", host).innerHTML = '<span class="muted">' + (S.setting === "numbered" ? "Seats 1 to " + S.n + ":" : "Clockwise from the top seat:") + '</span> <span class="cir-lu">' + D4C.say(S.seat) + "</span>" + fit;
  }
  function paintMsg(){ $("#cir-msg", host).textContent = msg; }
  function paintHow(){
    $("#cir-how", host).innerHTML = "Rotate with ↺ and ↻, or focus the table and press ← or →. " + (S.setting === "ring" ? "Flip turns the ring over. " : "") +
      "Collect rotations reads the line-up from the top seat after each turn. List all draws every different arrangement for up to 5 people. Your count: type a count and compare it with the tool.";
  }
  function stackLabel(st){
    if (st.set === "numbered") return st.partial ? "Each turn moves everyone to a new numbered seat…" : st.n + " different seatings: the seats are numbered";
    if (st.set === "ring") return st.partial ? "Turning the ring…" : "One ring: " + st.n + " turns × 2 sides = " + 2 * st.n + " line-ups";
    return st.partial ? "Turning the table…" : "Same circle: these " + st.n + " line-ups have the same neighbours";
  }
  function paintStack(){
    var box = $("#cir-stack", host), st = pv.stack;
    if (!st || st.n !== S.n || st.set !== S.setting) { box.innerHTML = ""; box.hidden = true; return; }
    box.hidden = false;
    var curK = S.seat.join(""), col = function(rows, t){ return '<div class="cir-scol">' + (t ? '<p class="cir-sh">' + t + "</p>" : "") + '<ol class="cir-sl">' + rows.map(function(r){ return '<li class="' + (r.join("") === curK ? "cur" : "") + '">' + D4C.say(r) + "</li>"; }).join("") + "</ol></div>"; };
    box.innerHTML = '<p class="cir-slab' + (st.partial ? "" : " done") + '">' + stackLabel(st) + '</p><div class="cir-scols' + (st.set === "numbered" ? " diff" : "") + '">' + col(st.rows, st.flips ? "turned" : "") + (st.flips ? col(st.flips, "flipped") : "") + "</div>";
  }
  function paintList(){
    var box = $("#cir-list", host);
    if (!S.list) { box.innerHTML = ""; box.hidden = true; return; }
    box.hidden = false;
    if (S.n > 5) { box.innerHTML = '<p class="muted">List all draws every arrangement for up to 5 people.</p>'; return; }
    var as = pv.listAs || S.setting, L = D4C.listHTML(S.n, S.setting, S.chips, { cur:S.seat, as:as }), hide = pv.hide;
    var what = as === "ring" ? "rings (each shown with its flipped twin)" : as === "numbered" ? "seatings (seat 1 at the top)" : "circles (A at the top of each)";
    var head = S.chips.length ? (hide ? "? of " + L.total : L.fit + " of " + L.total) + " " + what + " fit the chips (✓)." : (hide && as === S.setting ? "?" : L.total) + " different " + what + ".";
    box.innerHTML = '<p class="cir-lhead">' + head + '</p><div class="cir-lbox">' + L.html + "</div>";
  }
  function paintRead(){
    var n = S.n, set = S.setting, hide = !!pv.hide, rows = [], d = distinct(n, set);
    rows.push(["People", String(n)]);
    rows.push(["Line-ups", M(n + "! = " + big(fact(n)))]);
    rows.push(["Rotations that look the same", set === "ring" ? M("2 × " + n + " = " + 2 * n) + " (rotations and flips)" : set === "numbered" ? "1: numbered seats make every rotation different" : String(n)]);
    rows.push(["Distinct arrangements", hide ? "?" : M(d[0] + " = " + big(d[1]))]);
    var r = restrictLine(n, set, S.chips);
    rows.push(["With restriction", r ? (hide ? chipName(S.chips[0]) + ": ?" : r.txt) : "—"]);
    if (S.lock != null) {
      var L = D4C.AZ[S.lock], rest = fact(n - 1);
      rows.push(["Locked", set === "numbered" ? L + " in seat 1: the other " + (n - 1) + " fill " + (n - 1) + " seats in " + M((n - 1) + "! = " + big(rest)) + " ways; " + L + " could take any of " + n + " seats: " + M(n + " × " + big(rest) + " = " + big(fact(n))) :
        L + " at the top: the other " + (n - 1) + " fill " + (n - 1) + " seats in a line: " + M((n - 1) + "! = " + big(rest)) + (set === "ring" ? "; flipping pairs them: " + M(big(rest) + " ÷ 2 = " + big(rest / 2)) : "")]);
    }
    $("#cir-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(){
    var n = S.n, d = distinct(n, S.setting), cap = $("#cir-cap", host), what = S.setting === "ring" ? " rings" : " seatings";
    if (S.chips.length) { var r = restrictLine(n, S.setting, S.chips); cap.innerHTML = pv.hide ? M("?") + what : M(big(r.c)) + what + ' <span class="cir-capn">with ' + (S.chips.length > 1 ? "both chips" : "the chip") + "</span>"; return; }
    cap.innerHTML = pv.hide ? M(d[0] + " = ?") + what : M(d[0] + " = " + big(d[1])) + what;
  }

  render();

  // --- predictions ---
  function startPred(p){
    if (anim) finish();
    var s = p.start || {};
    S.setting = s.setting; S.n = s.n; S.seat = ident(s.n); S.lock = null; S.chips = (s.chips || []).slice(); S.list = false;
    pv = { hide:true }; msg = ""; save(); render(); MV.changed();
  }
  function runPred(p, done){
    var s0 = S.seat.slice();
    if (p.id === "p1" || p.id === "p3") {
      newAnim(function(){ S.seat = s0; pv.stack = stackFor(s0); S.list = true; pv.hide = false; }, done);
      collect(s0, function(){ later(500, function(){ S.list = true; pv.hide = false; render(); later(900, finish); }); });
      return;
    }
    if (p.id === "p2") {
      var m0 = D4C.mirror(s0);
      newAnim(function(){ S.seat = m0; S.list = true; pv.listAs = null; pv.hide = false; msg = "Flip pairs up the 6 table seatings: each bracelet is a seating and its mirror image."; }, done);
      pv.listAs = "table"; S.list = true; msg = "First, the 6 seatings of 4 people at a table…"; render();
      later(1500, function(){ msg = "Now turn the bracelet over…"; paintMsg(); flipSeq(function(){ pv.listAs = null; pv.hide = false; msg = "Flip pairs up the 6 table seatings: each bracelet is a seating and its mirror image."; render(); later(1200, finish); }); });
      return;
    }
    // p4: lock A, show B's two seats, swap B across, reveal
    var sw = s0.slice(), kB = 1, kO = S.n - 1; sw[kB] = s0[kO]; sw[kO] = s0[kB];
    newAnim(function(){ S.seat = sw; S.lock = 0; pv.glow = null; pv.hide = false; msg = "The block AB plus 4 others is 5 units: (5 − 1)! = 24 circles, × 2 orders inside the block = 48."; }, done);
    S.lock = 0; msg = "Fix A at the top. B must sit beside A: 2 seats."; pv.glow = {}; pv.glow[kB] = 1; pv.glow[kO] = 1; render();
    later(1300, function(){
      msg = "B on A’s right, or B on A’s left: × 2."; paintMsg();
      var a = view.at(kB), b = view.at(kO);
      tween({ dur:900, step:function(t){ view.place(function(pp, k){ if (k === kB) return { x:a[0] + (b[0] - a[0]) * t, y:a[1] + (b[1] - a[1]) * t - 14 * Math.sin(Math.PI * t) }; if (k === kO) return { x:b[0] + (a[0] - b[0]) * t, y:b[1] + (a[1] - b[1]) * t + 6 * Math.sin(Math.PI * t) }; return null; }); },
        done:function(){ S.seat = sw; pv.glow = null; paintTable(); paintLine(); later(900, function(){ pv.hide = false; msg = "The block AB plus 4 others is 5 units: (5 − 1)! = 24 circles, × 2 orders inside the block = 48."; render(); later(700, finish); }); } });
    });
  }

  return {
    predict:{ start:startPred, run:runPred },
    challenge:function(id, opt){ return chal(id, opt || {}); }
  };

  function chal(id, opt){
    var n = S.n, set = S.setting, c = toolCount();
    if (id === "tc1" || id === "tc2") {
      if (S.chips.length) return { ok:false, msg:"Turn off the restriction chips: this challenge counts every seating." };
      if (id === "tc1") {
        if (set === "table" && n === 6) return { ok:true };
        if (set === "table" && n === 5) return { ok:false, msg:M("(5 - 1)! = 24") + "." };
        if (set === "numbered" && n === 5) return { ok:false, msg:"That’s numbered seats. Use the round table." };
        if (set === "table" && n === 7) return { ok:false, msg:M("(7 - 1)! = 720") + ": that’s too many." };
        if (set !== "table") return { ok:false, msg:"That’s the " + SNAME[set].toLowerCase() + " setting (" + big(c) + "). Use the round table." };
        return { ok:false, msg:"The round table with " + M("n = " + n) + " gives " + M("(" + n + " - 1)! = " + big(c)) + (c < 120 ? ": add people." : ": remove people.") };
      }
      if (set === "ring" && n === 6) return { ok:true };
      if (set === "table" && n === 6) return { ok:false, msg:"A necklace can flip: divide by 2." };
      if (set === "ring" && n === 5) return { ok:false, msg:M("(5 - 1)!/2 = 12") + "." };
      if (set !== "ring") return { ok:false, msg:"Switch to the Ring setting: a necklace can be rotated and flipped." };
      return { ok:false, msg:"The ring with " + M("n = " + n) + " gives " + M("(" + n + " - 1)!/2 = " + big(c)) + (c < 60 ? ": add beads." : ": remove beads.") };
    }
    if (id === "tc3") {
      if (opt.live) return { ok:false };                         // a typed count gets no live tick
      var v = parseWhole(S.guess);
      if (v == null) return { ok:false, msg:"Type your count in the <strong>Your count</strong> box above, then press Check challenge." };
      if (v === 480) return { ok:true };
      if (v === 720) return { ok:false, msg:"You placed Mo but forgot Lee’s rule." };
      if (v === 600) return { ok:false, msg:"Lee can’t take Mo’s seat: only 4 seats are allowed." };
      if (v === 3600) return { ok:false, msg:"Mo must sit opposite Kai: only 1 seat." };
      return { ok:false, msg:big(v) + " isn’t it. Lock Kai, then count the seats left for Mo, then for Lee, then for everyone else, and multiply." };
    }
    return { ok:false };
  }
}

// ---------- hero: a table of four turns a quarter turn three times; the four line-ups stack into one circle ----------
function hero(f){
  var host = $("#cir-h-tbl"), ups = $("#cir-h-ups"), lab = $("#cir-h-lab"), ctr = $("#cir-h-ctr"), cap = f.cap;
  if (!host) return;
  var v = D4C.view(host), seat = [0, 1, 2, 3], rows = [];
  function draw(){ v.render({ n:4, seat:seat }); }
  function paintUps(stacked){
    ups.className = "cir-h-ups" + (stacked ? " stacked" : "");
    ups.innerHTML = rows.map(function(r, i){ return '<li style="--i:' + i + '">' + D4C.say(r).replace(/ /g, "") + "</li>"; }).join("");
  }
  function finalFrame(){
    seat = [3, 0, 1, 2]; rows = [[0, 1, 2, 3], [1, 2, 3, 0], [2, 3, 0, 1], [3, 0, 1, 2]]; draw(); paintUps(true);
    lab.textContent = "same circle"; lab.classList.add("on");
    ctr.innerHTML = MV.m("24 ÷ 4 = 6"); cap.innerHTML = "Each circle hides 4 line-ups: " + MV.m("4!/4 = 3! = 6");
  }
  if (MV.reduceMotion) { finalFrame(); return; }
  draw(); rows = [seat.slice()]; paintUps(false); ctr.innerHTML = "&nbsp;"; cap.textContent = "Read clockwise from the top seat";
  function turn(i){
    if (i > 3) { MV.wait(700, function(){ paintUps(true); lab.textContent = "same circle"; lab.classList.add("on"); cap.textContent = "Same neighbours every time: one circle";
      MV.wait(1000, function(){ ctr.innerHTML = MV.m("24 ÷ 4 = 6"); cap.innerHTML = "Each circle hides 4 line-ups: " + MV.m("4!/4 = 3! = 6"); }); }); return; }
    cap.textContent = "A quarter turn…";
    MV.tween({ dur:900, step:function(t){ v.place(function(p, k){ return { a:k - t }; }); }, done:function(){
      seat = D4C.rotate(seat, -1); draw(); rows.push(seat.slice()); paintUps(false); cap.textContent = "Still the same neighbours";
      MV.wait(900, function(){ turn(i + 1); });
    } });
  }
  MV.wait(1200, function(){ turn(1); });
}

// ---------- Part 3: Circular with restrictions (place tokens one at a time; the choices multiply) ----------
var PEOPLE = ["Ana", "Bo", "Cy", "Di", "Eli", "Fay", "Gus"];
var TS = ["T<sub>1</sub>", "T<sub>2</sub>", "T<sub>3</sub>", "S<sub>1</sub>", "S<sub>2</sub>", "S<sub>3</sub>"];
var TSN = ["Teacher 1", "Teacher 2", "Teacher 3", "Student 1", "Student 2", "Student 3"];
var P3 = {
  s1:{ n:7, kind:"tog", total:240, title:"Station 1: together", task:"7 people at a round table; Ana and Bo sit together.",
    alg:["Glue Ana and Bo into one block: the block + 5 others = 6 units.", "6 units around the circle: `(6 - 1)! = 120`.", "× 2 orders inside the block: 120 × 2 = <strong>240</strong>."] },
  s2:{ n:7, kind:"apart", total:480, title:"Station 2: apart", task:"The same table with Ana and Bo apart.",
    alg:["All seatings: `(7 - 1)! = 720`.", "Together (station 1): 240.", "Apart = total − together: 720 − 240 = <strong>480</strong>."] },
  s3:{ n:6, kind:"alt", total:12, title:"Station 3: alternating", task:"3 teachers and 3 students alternate around a table.",
    alg:["Fix one teacher.", "The other 2 teachers take the teacher seats in `2! = 2` ways.", "The 3 students take theirs in `3! = 6` ways: 2 × 6 = <strong>12</strong>."] }
};
function pName(st, p){ return st.kind === "alt" ? TSN[p] : PEOPLE[p]; }
function pLabel(st, p){ return st.kind === "alt" ? TS[p] : PEOPLE[p]; }
function part3(host, api){
  var S = api.S;
  S.st = ["s1", "s2", "s3", "s4"].indexOf(S.st) >= 0 ? S.st : "s1";
  S.c = S.c && typeof S.c === "object" ? S.c : {};
  ["s1", "s2", "s3"].forEach(function(k){ var c = S.c[k]; if (!c || !Array.isArray(c.order) || !Array.isArray(c.ch) || !c.placed) S.c[k] = { placed:{}, order:[], ch:[] }; });
  S.s4 = !!S.s4;
  var sel = null, msg = {}, busy = null;

  host.innerHTML = '<div id="cir3-st"></div>' +
    ["s1", "s2", "s3"].map(function(id){
      var st = P3[id];
      return '<div class="cir3-station" data-st="' + id + '"><h3>' + st.title + "</h3><p>" + MV.md(st.task) + ' Place the tokens one at a time: the reference person first, then the restricted people, then the rest.</p>' +
        '<div class="cir3-wrap"><div class="cir3-tblw"><div class="cir3-tbl" id="cir3-t-' + id + '"></div></div><div class="cir3-side">' +
        '<p class="rg-lab">Tokens to place</p><div class="cir3-tray" id="cir3-tray-' + id + '" role="group" aria-label="Tokens to place"></div>' +
        '<div class="cir3-menu" id="cir3-menu-' + id + '"></div>' +
        '<div class="q-actions"><button type="button" class="btn ghost sm" data-a="undo" data-k="u' + id + '">Undo</button><button type="button" class="btn ghost sm" data-a="rest" data-k="r' + id + '">Seat the rest</button><button type="button" class="btn ghost sm" data-a="reset" data-k="z' + id + '">Start over</button></div>' +
        '<p class="cir3-next" id="cir3-next-' + id + '" aria-live="polite"></p></div></div>' +
        '<div class="cir3-prod" id="cir3-prod-' + id + '" aria-live="polite"></div><div id="cir3-fb-' + id + '" aria-live="polite"></div>' +
        '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' + st.alg.map(function(l){ return "<span>" + MV.md(l) + "</span>"; }).join("") + "</div></details></div>";
    }).join("") +
    '<div class="cir3-station" data-st="s4"><h3>Check it by listing</h3><p>5 people, A to E, at a round table, with A and B together. The block method says ' + M("(4 - 1)! × 2 = 12") + ". List all 24 circles and count the ticks.</p>" +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="cir3-l" data-k="cir3l"></button></div><div id="cir3-lout" aria-live="polite"></div></div>';

  radios($("#cir3-st", host), { label:"Station", options:[{ id:"s1", t:"1. Together" }, { id:"s2", t:"2. Apart" }, { id:"s3", t:"3. Alternating" }, { id:"s4", t:"4. Check it by listing" }], value:S.st, cls:"chips",
    onChange:function(v){ S.st = v; sel = null; api.save(); show(); } });
  var views = {};
  ["s1", "s2", "s3"].forEach(function(id){ views[id] = D4C.view($("#cir3-t-" + id, host)); });

  function show(){ $$(".cir3-station", host).forEach(function(d){ d.hidden = d.dataset.st !== S.st; }); if (S.st === "s4") paintList(); else paint(S.st); }
  function seatsOf(id){ var st = P3[id], c = S.c[id], seat = []; for (var k = 0; k < st.n; k++) seat.push(null); Object.keys(c.placed).forEach(function(p){ seat[c.placed[p]] = +p; }); return seat; }
  function free(id){ var s = seatsOf(id), f = []; s.forEach(function(p, k){ if (p == null) f.push(k); }); return f; }
  function near(n, a, b){ var d = ((a - b) % n + n) % n; return d === 1 || d === n - 1; }
  // seats person p may take now (null when p may not be placed yet), with the reason
  function allowed(id, p){
    var st = P3[id], c = S.c[id], n = st.n, f = free(id), ref = c.placed[0];
    if (c.placed[p] != null) return { seats:null, why:"" };
    if (ref == null && p !== 0) return { seats:null, why:"Fix the reference person first: seat " + pName(st, 0) + ". Any seat will do, since rotations are the same." };
    if (p === 0) return { seats:f, why:"" };
    if (st.kind === "tog" || st.kind === "apart") {
      if (p !== 1 && c.placed[1] == null) return { seats:null, why:"Deal with the restriction first: seat Bo next." };
      if (p === 1) return { seats:f.filter(function(k){ return st.kind === "tog" ? near(n, k, ref) : !near(n, k, ref); }), why:st.kind === "tog" ? "Bo must sit beside Ana." : "Bo can’t sit beside Ana." };
      return { seats:f, why:"" };
    }
    var teacher = p < 3;
    return { seats:f.filter(function(k){ return (((k - ref) % n + n) % n) % 2 === (teacher ? 0 : 1); }), why:teacher ? "Teachers take every second seat, counting from " + "T₁." : "Students take the seats between the teachers." };
  }
  function place(id, p, k){
    var c = S.c[id], a = allowed(id, p);
    c.placed[p] = k; c.order.push(p); c.ch.push(p === 0 ? 1 : a.seats.length);
  }
  function complete(id){ return S.c[id].order.length === P3[id].n; }
  function paint(id){
    var st = P3[id], c = S.c[id], n = st.n, seat = seatsOf(id), a = sel != null && sel.id === id ? allowed(id, sel.p) : null, glow = {};
    if (a && a.seats) a.seats.forEach(function(k){ glow[k] = 1; });
    views[id].render({ n:n, seat:seat, seatBtn:!complete(id), glow:glow, lock:c.placed[0] != null ? 0 : null, label:function(p){ return '<span class="cir3-nm">' + pLabel(st, p) + "</span>"; },
      cls:function(p){ return st.kind === "alt" ? (p < 3 ? "tch" : "stu") : ""; } });
    views[id].el.setAttribute("role", "group");
    views[id].el.setAttribute("aria-label", "Round table with " + n + " seats, numbered 1 to " + n + " clockwise from the top. " + (c.order.length ? c.order.map(function(p){ return pName(st, p) + " in seat " + (c.placed[p] + 1); }).join(", ") : "All seats are empty") + ".");
    // tray
    var tray = $("#cir3-tray-" + id, host);
    MV.keepFocus(tray, function(){
      var left = []; for (var p = 0; p < n; p++) if (c.placed[p] == null) left.push(p);
      tray.innerHTML = left.length ? left.map(function(p){
        var on = sel && sel.id === id && sel.p === p;
        return '<button type="button" class="cir3-tk' + (st.kind === "alt" ? (p < 3 ? " tch" : " stu") : "") + '" data-p="' + p + '" data-k="tk' + id + p + '" aria-pressed="' + on + '" aria-label="' + pName(st, p) + '">' + pLabel(st, p) + "</button>";
      }).join("") : '<span class="muted">Everyone is seated.</span>';
    });
    // menu: "Seat … at position k"
    var menu = $("#cir3-menu-" + id, host), fr = free(id);
    MV.keepFocus(menu, function(){
      menu.innerHTML = complete(id) ? "" : '<label class="cir3-ml">Seat <strong>' + (sel && sel.id === id ? pLabel(st, sel.p) : "…") + '</strong> at position <select class="cir-sel" data-menu="' + id + '" data-k="m' + id + '">' + fr.map(function(k){ return '<option value="' + k + '">' + (k + 1) + (glow[k] ? " (allowed)" : "") + "</option>"; }).join("") + '</select></label> <button type="button" class="btn sm" data-a="menu" data-k="mb' + id + '"' + (sel && sel.id === id ? "" : " disabled") + ">Seat</button>";
    });
    // next step
    var next;
    if (complete(id)) next = "";
    else if (c.placed[0] == null) next = "Next: seat " + pName(st, 0) + ", the reference person. Every seat is the same until someone sits down: 1 choice.";
    else if (st.kind !== "alt" && c.placed[1] == null) next = "Next: seat Bo. Tap Bo to see the allowed seats glow.";
    else next = "Next: seat " + (st.kind === "alt" ? "the others: teachers in teacher seats, students in the gaps." : "everyone else: each one has one fewer seat.");
    if (sel && sel.id === id && a && a.seats) next = pName(st, sel.p) + ": " + plural(a.seats.length, "seat") + " allowed (glowing). Tap one, or use the menu.";
    $("#cir3-next-" + id, host).textContent = msg[id] || next;
    // product chain
    var chain = c.order.map(function(p, i){ return '<span class="cir3-f"><span class="cir3-fn">' + pLabel(st, p) + '</span><span class="cir3-fv">' + c.ch[i] + "</span></span>"; }).join('<span class="cir3-x" aria-hidden="true">×</span>');
    var prod = c.ch.reduce(function(x, y){ return x * y; }, 1);
    $("#cir3-prod-" + id, host).innerHTML = c.order.length ? '<p class="rg-lab">Choices for each person</p><div class="cir3-chain">' + chain + (complete(id) ? '<span class="cir3-x" aria-hidden="true">=</span><span class="cir3-tot">' + big(prod) + "</span>" : "") + "</div>" : "";
    $("#cir3-fb-" + id, host).innerHTML = complete(id) ? MV.fbHTML(prod === st.total ? "good" : "bad", prod === st.total ?
      "<strong>✓ That’s one seating that fits.</strong> Multiplying the choices counts them all: " + M(c.ch.join(" × ") + " = " + big(prod)) + ". Open <strong>Check it with algebra</strong> for the " + (st.kind === "tog" ? "block" : st.kind === "apart" ? "subtract" : "alternating") + " method." :
      "<strong>The choices multiply to " + big(prod) + ".</strong> Start over and place the reference person first, then the restricted people.") : "";
    // buttons
    var box = $('.cir3-station[data-st="' + id + '"]', host);
    $('[data-a="undo"]', box).disabled = !c.order.length || !!busy;
    $('[data-a="rest"]', box).disabled = complete(id) || c.placed[0] == null || (st.kind !== "alt" && c.placed[1] == null) || !!busy;
    $('[data-a="reset"]', box).disabled = !c.order.length || !!busy;
  }
  function tryPlace(id, k){
    var st = P3[id], c = S.c[id];
    if (sel == null || sel.id !== id) { msg[id] = seatsOf(id)[k] != null ? "That seat is taken." : "Tap a token first, then tap a seat."; paint(id); return; }
    if (seatsOf(id)[k] != null) { msg[id] = "That seat is taken."; paint(id); return; }
    var a = allowed(id, sel.p);
    if (!a.seats) { msg[id] = a.why; paint(id); return; }
    if (a.seats.indexOf(k) < 0) { msg[id] = a.why + " Try a glowing seat."; paint(id); return; }
    place(id, sel.p, k); msg[id] = ""; sel = null;
    api.save(); paint(id);
    if (complete(id)) MV.focusFb($('.cir3-station[data-st="' + id + '"]', host));
    void c; void st;
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-st]"); if (!box || busy) return;
    var id = box.dataset.st;
    if (id === "s4") { if (b.id === "cir3-l") { S.s4 = !S.s4; api.save(); paintList(); } return; }
    if (b.dataset.p != null) {
      var p = +b.dataset.p;
      if (sel && sel.id === id && sel.p === p) { sel = null; msg[id] = ""; paint(id); return; }
      var a = allowed(id, p);
      if (!a.seats) { sel = null; msg[id] = a.why; paint(id); return; }
      sel = { id:id, p:p }; msg[id] = ""; paint(id); return;
    }
    if (b.dataset.seat != null) { tryPlace(id, +b.dataset.seat); return; }
    var act = b.dataset.a, c = S.c[id];
    if (act === "menu") { var s = $('[data-menu="' + id + '"]', host); if (s) tryPlace(id, +s.value); return; }
    if (act === "undo") { var last = c.order.pop(); c.ch.pop(); delete c.placed[last]; sel = null; msg[id] = ""; api.save(); paint(id); return; }
    if (act === "reset") { S.c[id] = { placed:{}, order:[], ch:[] }; sel = null; msg[id] = ""; api.save(); paint(id); return; }
    if (act === "rest") { seatRest(id); }
  });
  // "Seat the rest": the remaining people sit one at a time (each has one fewer seat)
  function seatRest(id){
    var st = P3[id], c = S.c[id], todo = [];
    for (var p = 0; p < st.n; p++) if (c.placed[p] == null) todo.push(p);
    sel = null; msg[id] = "";
    function one(p){ var a = allowed(id, p); place(id, p, a.seats[0]); }
    if (MV.reduceMotion) { todo.forEach(one); api.save(); paint(id); MV.focusFb($('.cir3-station[data-st="' + id + '"]', host)); return; }
    busy = id;
    (function step(i){
      one(todo[i]); api.save(); paint(id);
      if (i < todo.length - 1) MV.wait(260, function(){ step(i + 1); });
      else { busy = null; paint(id); MV.focusFb($('.cir3-station[data-st="' + id + '"]', host)); }
    })(0);
  }
  function paintList(){
    var btn = $("#cir3-l", host), out = $("#cir3-lout", host);
    btn.textContent = S.s4 ? "Hide the list" : "List all 24 circles"; btn.setAttribute("aria-pressed", String(S.s4));
    if (!S.s4) { out.innerHTML = ""; return; }
    var L = D4C.listHTML(5, "table", ["tog"], {});
    out.innerHTML = '<p class="cir-lhead"><strong>' + L.fit + " of " + L.total + "</strong> circles fit (✓): " + M("(4 - 1)! × 2 = 12") + ". Every circle has A at the top; the ticked ones have B right beside A.</p>" + '<div class="cir-lbox">' + L.html + "</div>";
  }
  show();
  return {};
}

// ---------- Performance task: Table planner ----------
var GUESTS = ["Ana", "Bo", "Cy", "Di", "Eli", "Fay", "Gus", "Hal"];
var TRULE = { T:"tog", P:"apart", O:"opp", W:"W" };
var TNAME = { T:"Ana and Bo together", P:"Ana and Bo apart", O:"Cy directly opposite Ana", W:"Ana between Bo and Di" };
var task = (function(){
  var api = null, view = null;
  function rulesOf(list){ return list.map(function(r){ return TRULE[r]; }); }
  function read(){ var s = api ? api.S : {}; return { n:s.n == null ? 6 : s.n, rules:(s.rules || []).slice().sort() }; }
  function cnt(d){ return D4C.count(d.n, "table", rulesOf(d.rules)); }
  function matters(d){ var c = cnt(d); return d.rules.length > 0 && d.rules.every(function(r){ return D4C.count(d.n, "table", rulesOf(d.rules.filter(function(x){ return x !== r; }))) !== c; }); }
  function paint(){
    var d = read(), c = cnt(d);
    $("#tp-n").textContent = d.n;
    $('[data-tp="-1"]').disabled = d.n <= 4; $('[data-tp="1"]').disabled = d.n >= 8;
    $$("[data-tr]").forEach(function(b){
      var r = b.dataset.tr, on = d.rules.indexOf(r) >= 0, off = r === "O" && d.n % 2;
      b.setAttribute("aria-pressed", String(on)); b.classList.toggle("on", on); b.disabled = !!off;
    });
    var ex = D4C.firstFit(d.n, rulesOf(d.rules));
    var seat = ex || [];
    if (!ex) for (var k = 0; k < d.n; k++) seat.push(null);
    view.render({ n:d.n, seat:seat, lock:ex ? 0 : null, label:function(p){ return '<span class="cir3-nm">' + GUESTS[p] + "</span>"; } });
    view.el.setAttribute("aria-label", ex ? "One seating that fits, clockwise from the top: " + D4C.say(ex, { names:GUESTS }) : "No seating fits these rules.");
    $("#tp-count").innerHTML = '<span class="cir-big-n">' + big(c) + "</span> " + (c === 1 ? "seating" : "seatings") + ' <span class="muted">(rotations removed, by listing every seating)</span>';
    $("#tp-rules").innerHTML = d.rules.length ? d.rules.map(function(r){ return "<strong>" + r + "</strong>: " + TNAME[r]; }).join("; ") : '<span class="muted">No rules chosen</span>';
    $("#tp-ex").textContent = ex ? "One seating that fits (Ana locked at the top)." : "No seating fits these rules.";
  }
  function keyText(k){ var p = k.split("|"), d = { n:+p[0], rules:p[1] ? p[1].split("+") : [] }; return "n = " + d.n + ", " + d.rules.join(" + ") + ": " + big(cnt(d)).replace(/ /g, " "); }
  return {
    render:function(inp, pvh, a){
      api = a; if (a.S.n == null) a.S.n = 6; if (!Array.isArray(a.S.rules)) a.S.rules = [];
      inp.innerHTML = '<div class="cir-tin"><div class="cir-trow" role="group" aria-label="Number of guests"><span class="rg-lab">Guests ' + M("n") + '</span><button type="button" class="btn ghost sm cir-tb" data-tp="-1" aria-label="Fewer guests">−</button><output class="cir-tout" id="tp-n" aria-live="polite"></output><button type="button" class="btn ghost sm cir-tb" data-tp="1" aria-label="More guests">+</button></div>' +
        '<p class="rg-lab" id="tp-rl">Rules (choose 1 or 2)</p><div class="chips cir-chips" role="group" aria-labelledby="tp-rl">' + ["T", "P", "O", "W"].map(function(r){ return '<button type="button" class="chip" data-tr="' + r + '" aria-pressed="false"><strong>' + r + "</strong>: " + TNAME[r] + (r === "O" ? ' <span class="tiny">(even ' + M("n") + ")</span>" : "") + "</button>"; }).join("") + '</div><p class="tiny muted" id="tp-msg" aria-live="polite"></p></div>';
      pvh.innerHTML = '<div class="cir-tpv"><div class="cir-tpt" id="tp-tbl" role="img"></div><p class="tiny muted" id="tp-ex"></p><p class="cir-tcount" id="tp-count" aria-live="polite"></p><p class="tiny" id="tp-rules"></p></div>';
      view = D4C.view($("#tp-tbl"));
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || b.disabled) return;
        var S = a.S, m = "";
        if (b.dataset.tp) {
          S.n = Math.max(4, Math.min(8, S.n + +b.dataset.tp));
          if (S.n % 2 && S.rules.indexOf("O") >= 0) { S.rules = S.rules.filter(function(r){ return r !== "O"; }); m = "O needs an even number of guests, so it’s off."; }
        } else if (b.dataset.tr) {
          var r = b.dataset.tr, i = S.rules.indexOf(r);
          if (i >= 0) S.rules.splice(i, 1);
          else if (S.rules.length >= 2) m = "Two rules at most. Turn one off first.";
          else S.rules.push(r);
        }
        $("#tp-msg").textContent = m;
        a.save(); paint(); a.update();
      });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var c = cnt(d); return [d.n >= 5, matters(d), c >= 100 && c <= 600]; },
    tips:function(d, res){
      var T = MV.C.task.tips, out = [], c = cnt(d);
      if (!res[0]) out.push(T[0]);
      if (!res[1]) out.push(d.rules.length ? T[1] : "Choose at least one rule.");
      if (!res[2]) out.push("This plan has " + big(c) + (c === 1 ? " seating." : " seatings.") + " " + T[2]);
      return out;
    },
    key:function(d){
      var k = d.n + "|" + d.rules.join("+"), st = MV.taskState(), n = st.found.length + (st.found.indexOf(k) < 0 ? 1 : 0);
      MV.C.task.after3 = n >= 5 ? MV.C.task.afterAll : "";
      return k;
    },
    label:function(k){ var p = k.split("|"), d = { n:+p[0], rules:p[1] ? p[1].split("+") : [] }; return M("n = " + d.n) + ", " + d.rules.join(" + ") + ": " + big(cnt(d)) + " seatings"; },
    text:keyText
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
