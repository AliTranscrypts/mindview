// MHF4U 14 Family of Polynomial Functions: hero fan, the Family fan (Explore: Fan / Catch, zero slots, exact k box,
// height ruler, y-zoom), the Part 3 build sheet, the "Find the member" practice set and the "Bridge the gap" task.
(function(){
"use strict";
var $ = MV.$, css = MV.css, num = MV.num, MINUS = MV.MINUS;

// @component exactQ — exact rational arithmetic (n/d), a parser for integers, p/q and finite decimals, and display helpers
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function Q(n, d){ if (d == null) d = 1; if (d < 0) { n = -n; d = -d; } var g = gcd(n, d); return { n:n / g, d:d / g }; }
function parseQ(raw){
  var s = String(raw == null ? "" : raw).replace(/\s+/g, "").replace(/[−–]/g, "-");
  var m = /^([+-]?)(\d*)(?:\.(\d*))?(?:\/([+-]?)(\d+))?$/.exec(s);
  if (!m || !(m[2] || m[3])) return null;
  var fp = m[3] || "";
  if (fp && m[5] != null) return null;
  var n = parseInt((m[2] || "0") + fp, 10), d = Math.pow(10, fp.length);
  if (!isFinite(n) || n > 1e12) return null;
  if (m[5] != null) { d = parseInt(m[5], 10); if (!d) return null; }
  var neg = (m[1] === "-") !== (m[4] === "-");
  return { q:Q(neg ? -n : n, d), dec:fp.length > 0 };
}
var q = {
  mul:function(a, b){ return Q(a.n * b.n, a.d * b.d); },
  div:function(a, b){ return Q(a.n * b.d, a.d * b.n); },
  add:function(a, b){ return Q(a.n * b.d + b.n * a.d, a.d * b.d); },
  sub:function(a, b){ return Q(a.n * b.d - b.n * a.d, a.d * b.d); },
  eq:function(a, b){ return !!a && !!b && a.n === b.n && a.d === b.d; },
  v:function(a){ return a.n / a.d; },
  abs:function(a){ return Q(Math.abs(a.n), a.d); },
  pow:function(a, k){ var r = Q(1); for (var i = 0; i < k; i++) r = q.mul(r, a); return r; },
  of:function(x){
    if (x && typeof x === "object") return x;
    if (typeof x === "string") { var p = parseQ(x); return p ? p.q : null; }
    var d = 1; while (Math.abs(x * d - Math.round(x * d)) > 1e-9 && d < 1e9) d *= 10;
    return Q(Math.round(x * d), d);
  },
  term:function(a){ var d = a.d; while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; }
};
// math-markup source for MV.m: "-{5}/{3}" (stacked) or "-5/3"; integers plain
function qSrc(a, stack){ if (a.d === 1) return String(a.n); return (a.n < 0 ? "-" : "") + (stack ? "{" + Math.abs(a.n) + "}/{" + a.d + "}" : Math.abs(a.n) + "/" + a.d); }
function decSrc(a){ return String(+(a.n / a.d).toFixed(6)); }
function srcTxt(s){ return s.replace(/[{}]/g, "").replace(/-/g, MINUS); }
function fill(str, vals){ return String(str).replace(/§(\d)/g, function(_, i){ return vals[+i - 1]; }); }
function uniq(a){ return a.filter(function(x, i){ return a.indexOf(x) === i; }); }

// ---------- polynomial helpers on zero lists [[r, order], …] (integer zeros) ----------
var P = {
  deg:function(zs){ return zs.reduce(function(s, z){ return s + z[1]; }, 0); },
  f:function(zs){ return function(x){ var y = 1; for (var i = 0; i < zs.length; i++) y *= Math.pow(x - zs[i][0], zs[i][1]); return y; }; },
  at:function(zs, xq){ var r = Q(1); zs.forEach(function(z){ r = q.mul(r, q.pow(q.sub(xq, Q(z[0])), z[1])); }); return r; },
  coefs:function(zs){ var c = [1]; zs.forEach(function(z){ for (var i = 0; i < z[1]; i++) c = mulLin(c, -z[0]); }); return c; },
  factor:function(r, k){ var b = r === 0 ? "x" : "(x " + (r < 0 ? "+ " : "- ") + Math.abs(r) + ")"; return k > 1 ? b + "^" + k : b; },
  // x (the zero 0) first, then the others in the order given
  prod:function(zs){ var z0 = zs.filter(function(z){ return z[0] === 0; }), rest = zs.filter(function(z){ return z[0] !== 0; }); return z0.concat(rest).map(function(z){ return P.factor(z[0], z[1]); }).join(""); },
  asc:function(zs){ return zs.slice().sort(function(a, b){ return a[0] - b[0]; }); }
};
function mulLin(c, a){ var out = []; for (var i = 0; i <= c.length; i++) out[i] = (i > 0 ? c[i - 1] : 0) + (i < c.length ? c[i] * a : 0); return out; }
// polynomial source from Q coefficients (index = power); cf(|c|) formats a coefficient that isn't 1
function polySrc(cs, cf){
  var out = "";
  for (var p = cs.length - 1; p >= 0; p--) {
    var c = cs[p]; if (!c.n) continue;
    var a = q.abs(c), one = a.n === 1 && a.d === 1 && p > 0, cc = one ? "" : cf(a), xs = p === 0 ? "" : p === 1 ? "x" : "x^" + p;
    out += out ? (c.n < 0 ? " - " : " + ") + cc + xs : (c.n < 0 ? "-" : "") + cc + xs;
  }
  return out || "0";
}
function listAnd(a){ return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
function endB(kv, deg){
  var ev = deg % 2 === 0, pos = kv > 0, L = ev ? (pos ? "∞" : "-∞") : (pos ? "-∞" : "∞"), R = pos ? "∞" : "-∞";
  var qd = ev ? (pos ? "Q2 to Q1" : "Q3 to Q4") : (pos ? "Q3 to Q1" : "Q2 to Q4");
  var words = ev ? (pos ? "Rises on both sides." : "Falls on both sides.") : (pos ? "Falls to the left, rises to the right." : "Rises to the left, falls to the right.");
  return { q:qd, words:words, html:'<span class="qpath">' + qd + "</span>: as " + MV.m("x → -∞") + ", " + MV.m("y → " + L) + "; as " + MV.m("x → ∞") + ", " + MV.m("y → " + R) };
}
// pinch rings (--hi) at the zeros; pulse 0..1 grows them
function rings(ctx, pl, xs, pulse, color){
  ctx.save(); ctx.strokeStyle = color || css("--hi"); ctx.lineWidth = 3;
  xs.forEach(function(x){ var X = pl.X(x), Y = pl.Y(0); if (X < -20 || X > pl.W + 20 || Y < -20 || Y > pl.H + 20) return; ctx.beginPath(); ctx.arc(X, Y, 9 + 5 * (pulse || 0), 0, 2 * Math.PI); ctx.stroke(); });
  ctx.restore();
}
function dot(ctx, X, Y, r, color, ring){
  if (ring) { ctx.beginPath(); ctx.arc(X, Y, r + 5, 0, 2 * Math.PI); ctx.lineWidth = 3.5; ctx.strokeStyle = ring; ctx.stroke(); }
  ctx.beginPath(); ctx.arc(X, Y, r, 0, 2 * Math.PI); ctx.fillStyle = color; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = css("--sheet"); ctx.stroke();
}
var FAN = [-3, -2, -1, -0.5, 0.5, 1, 2, 3];

// ---------- hero: base member, rings, members grow out of it, the k = 3 member through (2, −12) ----------
function hero(f){
  var p = new MV.Plot(f.canvas, { xmin:-4, xmax:5, ymin:-20, ymax:20 }), H = (MV.C.hero.fig || {}).captions || [], aria = (MV.C.hero.fig || {}).aria || "";
  var b = function(x){ return (x + 2) * (x - 1) * (x - 3); }, KS = [2, 3, 0.5, -1, -2], lin = function(t){ return t; };
  var st = { draw:0, pulse:0, done:[], grow:null, fade:1, target:0, final:false };
  p.render = function(){
    var ink2 = css("--ink-2"), pen = css("--pen"), curves = [];
    st.done.forEach(function(k){
      var hl = st.final && k === 3;
      curves.push({ f:function(x){ return k * b(x); }, color:hl ? pen : ink2, alpha:hl ? 1 : 0.35 * st.fade, width:hl ? 3.2 : 2, arrows:hl });
    });
    if (st.grow) { var kk = st.grow.k; curves.push({ f:function(x){ return kk * b(x); }, color:ink2, alpha:0.9 - 0.55 * st.grow.t, width:2.2 }); }
    curves.push({ f:b, color:st.final ? ink2 : pen, alpha:st.final ? 0.35 * st.fade : 1, width:st.final ? 2 : 3.2, domain:[-4.2, -4.2 + 9.4 * st.draw], arrows:st.draw >= 1 && !st.final });
    p.draw({ curves:curves, xTicks:{ step:1 }, yTicks:{ step:5 }, describe:aria, after:function(ctx, pl){
      if (st.draw >= 1) rings(ctx, pl, [-2, 1, 3], st.pulse);
      if (st.target > 0) {
        ctx.save(); ctx.globalAlpha = st.target; dot(ctx, pl.X(2), pl.Y(-12), 6, css("--ink"), st.final ? css("--green") : css("--hi")); ctx.restore();
        pl.label({ x:2, y:-12, text:"(2, " + MINUS + "12)" + (st.final ? " ✓" : ""), dx:12, dy:10, bg:true, color:st.final ? css("--green") : css("--ink") });
      }
    } });
  };
  if (MV.reduceMotion) { st.draw = 1; st.done = KS.slice(); st.fade = 0.6; st.target = 1; st.final = true; f.cap.innerHTML = H[1] || ""; p.render(); return; }
  f.cap.innerHTML = "&nbsp;"; p.render();
  function pulse(cb){ MV.tween({ dur:700, ease:lin, step:function(t){ st.pulse = Math.sin(Math.PI * t); p.render(); }, done:function(){ st.pulse = 0; p.render(); cb(); } }); }
  function grow(i){
    if (i >= KS.length) { f.cap.innerHTML = H[0] || ""; MV.wait(2000, finale); return; }
    var K = KS[i];
    MV.tween({ dur:500, step:function(t){ st.grow = { k:1 + (K - 1) * t, t:t }; p.render(); }, done:function(){ st.grow = null; st.done.push(K); p.render(); MV.wait(160, function(){ grow(i + 1); }); } });
  }
  function finale(){ MV.tween({ dur:800, step:function(t){ st.fade = 1 - 0.4 * t; st.target = t; p.render(); }, done:function(){ st.final = true; f.cap.innerHTML = H[1] || ""; p.render(); } }); }
  MV.tween({ dur:1200, ease:lin, step:function(t){ st.draw = t; p.render(); }, done:function(){ pulse(function(){ grow(0); }); } });
}

// @component N21 zeroSlots — slot-style zero builder (controls only): each slot has a whole-number box with − / + steppers,
// order chips and Clear; options for range, max degree, max order and locked positions. Pair it with any Plot (drag zeros there).
//   var zb = zeroSlots(host, { uid, slots:[{ v:"2", k:1 }, …] (live array, mutated), min, max, maxDeg, maxOrder:3, lock:false,
//     onChange(how) });   zb.paint()   zb.parse() -> { zs:[[r, k], …], bad:{ i, kind:"range"|"dup", j } | null, deg }
function parseSlots(slots, min, max){
  var zs = [], bad = null, seen = {};
  slots.forEach(function(s, i){
    var t = String(s.v == null ? "" : s.v).trim().replace(MINUS, "-"); if (t === "") return;
    var v = Number(t);
    if (!/^-?\d+$/.test(t) || v < min || v > max) { if (!bad) bad = { i:i, kind:"range" }; return; }
    if (seen[v] != null) { if (!bad) bad = { i:i, kind:"dup", j:seen[v] }; return; }
    seen[v] = i; zs.push([v, s.k]);
  });
  return { zs:zs, bad:bad };
}
function zeroSlots(host, o){
  o = Object.assign({ min:-5, max:5, maxDeg:99, maxOrder:3, lock:false, uid:"zs" }, o);
  var note = "";
  function parse(){ var r = parseSlots(o.slots, o.min, o.max); r.deg = P.deg(r.zs); return r; }
  function filled(s){ return String(s.v == null ? "" : s.v).trim() !== ""; }
  function msg(r){
    if (r.bad && r.bad.kind === "range") return "Zero " + (r.bad.i + 1) + ": use a whole number from " + num(o.min) + " to " + num(o.max) + ".";
    if (r.bad && r.bad.kind === "dup") return "Zero " + (r.bad.i + 1) + " repeats zero " + (r.bad.j + 1) + ". To repeat a zero, use its order chip.";
    if (r.deg > o.maxDeg) return "Degree " + o.maxDeg + " is the most here. Lower an order or clear a zero.";
    return note;
  }
  function paint(){
    var r = parse();
    MV.keepFocus(host, function(){
      host.innerHTML = '<div class="zs" role="group" aria-label="Zeros and their orders">' + o.slots.map(function(s, i){
        var fl = filled(s), lab = "Zero " + (i + 1), chips = "";
        for (var k = 1; k <= o.maxOrder; k++) {
          var on = fl && k === s.k, dis = !fl || (!on && r.deg - s.k + k > o.maxDeg);
          chips += '<button type="button" class="chip' + (on ? " on" : "") + '" data-zk="' + k + '" data-zi="' + i + '" data-k="' + o.uid + i + "k" + k + '" aria-pressed="' + on + '"' + (dis ? " disabled" : "") + ">" + k + "</button>";
        }
        var pos = o.lock ? '<span class="zs-fix">' + MV.m("x = " + s.v) + "</span>" :
          '<span class="zs-pos"><button type="button" class="btn ghost sm zs-st" data-zs="dec" data-zi="' + i + '" data-k="' + o.uid + i + 'd" aria-label="' + lab + ': one less">' + MINUS + "</button>" +
          '<input class="zs-in" type="number" step="1" min="' + o.min + '" max="' + o.max + '" data-zin="' + i + '" data-k="' + o.uid + i + 'in" aria-label="' + lab + " (a whole number from " + num(o.min) + " to " + num(o.max) + ')" value="' + MV.esc(s.v) + '">' +
          '<button type="button" class="btn ghost sm zs-st" data-zs="inc" data-zi="' + i + '" data-k="' + o.uid + i + 'u" aria-label="' + lab + ': one more">+</button></span>';
        return '<div class="zs-row' + (fl ? "" : " empty") + '"><span class="zs-lab">' + lab + "</span>" + pos +
          '<span class="zs-ord" role="group" aria-label="Order of ' + lab.toLowerCase() + '"><span class="tiny">Order</span>' + chips + "</span>" +
          (o.lock ? "" : '<button type="button" class="btn ghost sm zs-clr" data-zs="clr" data-zi="' + i + '" data-k="' + o.uid + i + 'c"' + (fl ? "" : " disabled") + ">Clear</button>") + "</div>";
      }).join("") + '</div><p class="tiny zs-msg" aria-live="polite">' + msg(r) + "</p>";
    });
    note = "";
  }
  function taken(v, i){ return o.slots.some(function(t, j){ return j !== i && filled(t) && Number(String(t.v).replace(MINUS, "-")) === v; }); }
  function step(i, dir){
    var s = o.slots[i], t = String(s.v).trim().replace(MINUS, "-"), cur = /^-?\d+$/.test(t) ? Number(t) : null, v;
    if (cur == null) {
      if (parse().deg + s.k > o.maxDeg) { note = "Degree " + o.maxDeg + " is the most here. Lower an order first."; return false; }
      for (var d = 0, found = false; d <= o.max - o.min && !found; d++) [d, -d].forEach(function(c){ if (!found && c >= o.min && c <= o.max && !taken(c, i)) { v = c; found = true; } });
      if (!found) return false;
    } else {
      v = Math.max(o.min, Math.min(o.max, cur + dir));
      while (v >= o.min && v <= o.max && taken(v, i)) v += dir;
      if (v < o.min || v > o.max) return false;
    }
    s.v = String(v); return true;
  }
  // typing updates the rows in place (no re-render, so focus and the caret stay put)
  function sync(){
    var r = parse(), rows = host.querySelectorAll(".zs-row");
    o.slots.forEach(function(s, i){
      var fl = filled(s), row = rows[i]; if (!row) return;
      row.classList.toggle("empty", !fl);
      Array.prototype.forEach.call(row.querySelectorAll("[data-zk]"), function(b){ var k = +b.dataset.zk, on = fl && k === s.k; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); b.disabled = !fl || (!on && r.deg - s.k + k > o.maxDeg); });
      var c = row.querySelector('[data-zs="clr"]'); if (c) c.disabled = !fl;
    });
    var m = host.querySelector(".zs-msg"); if (m) m.textContent = msg(r);
  }
  host.addEventListener("input", function(e){
    var i = e.target.dataset && e.target.dataset.zin; if (i == null) return;
    o.slots[+i].v = e.target.value; sync();
    o.onChange("type");
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var i = +b.dataset.zi, s = o.slots[i]; if (!s) return;
    if (b.dataset.zk) { var k = +b.dataset.zk; if (k === s.k || parse().deg - s.k + k > o.maxDeg) return; s.k = k; paint(); o.onChange("order"); return; }
    if (b.dataset.zs === "clr") { s.v = ""; s.k = 1; paint(); o.onChange("clear"); return; }
    if (b.dataset.zs === "inc" || b.dataset.zs === "dec") { step(i, b.dataset.zs === "inc" ? 1 : -1); paint(); o.onChange("step"); }
  });
  return { paint:paint, parse:parse, step:step, sync:sync };
}

// small radio group of chips with arrow keys (mode control, family chips, rounds)
function radios(host, o){
  function paint(){
    var v = o.get(), any = o.options.some(function(x){ return x.id === v; });
    MV.keepFocus(host, function(){
      host.innerHTML = '<div class="chips ff-radio" role="radiogroup" aria-label="' + MV.esc(o.label) + '">' + o.options.map(function(x, i){
        var on = x.id === v;
        return '<button type="button" class="chip' + (on ? " on" : "") + '" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && i === 0) ? 0 : -1) + '" data-rv="' + x.id + '" data-k="' + o.uid + x.id + '">' + (o.mark && o.mark(x.id) ? "✓ " : "") + x.t + "</button>";
      }).join("") + "</div>";
    });
  }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rv]"); if (b) o.set(b.dataset.rv); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rv]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var ids = o.options.map(function(x){ return x.id; }), i = (ids.indexOf(b.dataset.rv) + d + ids.length) % ids.length;
    o.set(ids[i]);
    var nb = host.querySelector('[data-rv="' + ids[i] + '"]'); if (nb) nb.focus();
  });
  return { paint:paint };
}

// ---------- Explore: the Family fan ----------
var FAMS = {
  F1:{ zs:[[-2, 1], [1, 1], [3, 1]], zoom:1, label:"F1: `k(x + 2)(x - 1)(x - 3)`" },
  F2:{ zs:[[-1, 2], [3, 1]], zoom:1, label:"F2: `k(x + 1)^2(x - 3)`" },
  F3:{ zs:[[-3, 1], [-1, 1], [2, 1], [4, 1]], zoom:2, label:"F3: `k(x + 3)(x + 1)(x - 2)(x - 4)`" },
  own:{ zoom:1, label:"Build your own" },
  tc3:{ zoom:2 }
};
var ZOOMS = [15, 30, 60, 120];
function explore(host, api){
  var EC = api.content, U = EC.ui, S = api.S;
  if (!S.mode) S.mode = "fan"; if (!S.fam) S.fam = "F1"; if (!S.k) S.k = { n:1, d:1 }; S.exact = !!S.exact;
  if (S.fan == null) S.fan = true; S.ruler = !!S.ruler; S.expanded = !!S.expanded; if (S.x0 == null) S.x0 = 2;
  if (S.zoom == null) S.zoom = 1; if (S.tx == null) { S.tx = -1; S.ty = 12; }
  S.own = S.own || [{ v:"-3", k:1 }, { v:"0", k:2 }, { v:"4", k:1 }, { v:"", k:1 }];
  S.tc3 = S.tc3 || [1, 1, 1]; S.showK = S.showK || 0; S.ex = S.ex || { neg:false, p:"", q:"" };
  var ov = {}, pulse = 0, pulsing = null, shown = false, noteTxt = "", noteTimer = null, anim = 0, pending = null;
  function chal(id){ return (EC.challenges || []).filter(function(c){ return c.id === id; })[0]; }
  if (S.setup && !chal(S.setup)) S.setup = null;

  host.innerHTML = '<div class="ff-top"></div><div class="ff-pg"></div>';
  var modeHost = $(".ff-top", host), L = MV.pgLayout($(".ff-pg", host), { aria:"Graph of a member of the family" });
  L.cap.insertAdjacentHTML("afterend", '<p class="ff-sub" aria-live="polite"></p>');
  L.canvas.parentNode.insertAdjacentHTML("afterend", '<p class="ff-note" aria-live="polite"></p>');
  L.ctrl.innerHTML = '<div class="ff-fam"></div><div class="ff-setup" aria-live="polite"></div><div class="ff-zs"></div><div class="ff-sl"></div>' +
    '<div class="ff-ex" role="group" aria-label="Exact k"><span class="m"><i>k</i> =</span><button type="button" class="btn ghost sm ff-pm" data-ex="pm" data-k="ffpm"></button>' +
    '<input class="ff-pq" id="ff-p" type="text" inputmode="numeric" autocomplete="off" aria-label="Numerator p, a whole number from 1 to 99"><span class="ff-bar" aria-hidden="true">/</span>' +
    '<input class="ff-pq" id="ff-q" type="text" inputmode="numeric" autocomplete="off" aria-label="Denominator q, a whole number from 1 to 99"><button type="button" class="btn sm" data-ex="apply" data-k="ffap">Apply</button></div>' +
    '<p class="tiny ff-exmsg" aria-live="polite"></p><div class="ff-tog"></div><div class="ff-zoom"></div><div class="ff-show"></div>';
  var sub = $(".ff-sub", host), noteEl = $(".ff-note", host), famHost = $(".ff-fam", host), setupHost = $(".ff-setup", host), zsHost = $(".ff-zs", host),
    togHost = $(".ff-tog", host), zoomHost = $(".ff-zoom", host), showHost = $(".ff-show", host), exMsg = $(".ff-exmsg", host);
  var pIn = $("#ff-p", host), qIn = $("#ff-q", host); pIn.value = S.ex.p; qIn.value = S.ex.q;
  var plot = new MV.Plot(L.canvas, { xmin:-6, xmax:6, ymin:-30, ymax:30 });

  // ----- state helpers -----
  function ownZs(){ var r = zb.parse(), zs = r.zs.slice(); while (P.deg(zs) > 6) zs.pop(); return zs; }
  function zeros(){
    if (S.fam === "tc3") return [[-2, S.tc3[0]], [1, S.tc3[1]], [3, S.tc3[2]]];
    if (S.fam === "own") return P.asc(ownZs());
    return FAMS[S.fam].zs;
  }
  function targets(){ return S.setup ? chal(S.setup).setup.targets : [[S.tx, S.ty]]; }
  // x from −6 to 6, with a little room so a target or ruler at x = ±6 stays fully visible
  function view(){ var Z = ZOOMS[S.zoom]; return { xmin:-6.4, xmax:6.4, ymin:-Z, ymax:Z }; }
  function ensureTarget(){ if (S.mode !== "catch") return; var m = Math.max.apply(null, targets().map(function(t){ return Math.abs(t[1]); })); while (S.zoom < 3 && m > ZOOMS[S.zoom] * 0.92) S.zoom++; }
  function minZoom(){ if (S.mode !== "catch") return 0; var m = Math.max.apply(null, targets().map(function(t){ return Math.abs(t[1]); })), z = 0; while (z < 3 && m > ZOOMS[z] * 0.92) z++; return z; }
  // value display: integers; fractions in exact mode or when the decimal doesn't end; otherwise decimals
  function vSrc(a, stack){ if (a.d === 1) return String(a.n); if (!S.exact && q.term(a)) return decSrc(a); return qSrc(a, stack); }
  function vTxt(a){ return srcTxt(vSrc(a)); }
  function vM(a){ return MV.m(vSrc(a)); }
  function par(a){ return a.n < 0 ? "(" + vSrc(a) + ")" : vSrc(a); }
  function kCoef(stack){ var k = S.k; if (k.n === k.d) return ""; if (k.n === -k.d) return "@a{-}"; return "@a{" + vSrc(k, stack) + "}"; }
  function memberSrc(stack){ var zs = zeros(); return "y = " + kCoef(stack) + P.prod(zs); }
  function expandedSrc(){ var cs = P.coefs(zeros()).map(function(c){ return q.mul(S.k, Q(c)); }); return polySrc(cs, function(a){ return vSrc(a, true); }); }
  function shareList(zs){
    if (!zs.length) return "";
    var same = zs.every(function(z){ return z[1] === zs[0][1]; }), xs = zs.map(function(z){ return num(z[0]); });
    if (zs.length === 1) return xs[0] + " (order " + zs[0][1] + ")";
    if (same) return listAnd(xs) + " (each of order " + zs[0][1] + ")";
    return listAnd(zs.map(function(z){ return num(z[0]) + " (order " + z[1] + ")"; }));
  }
  function baseExpr(zs, x0){ return zs.map(function(z){ return "(" + vSrc(q.sub(x0, Q(z[0]))) + ")" + (z[1] > 1 ? "^" + z[1] : ""); }).join(""); }
  function status(t){
    var zs = zeros(), tx = t[0], ty = t[1], isZero = zs.some(function(z){ return z[0] === tx; });
    if (isZero && ty !== 0) return { kind:"zeroNon", html:fill(U.zeroNon, [num(tx), num(tx)]) };
    if (isZero) return { kind:"zeroZero", html:U.zeroZero };
    if (ty === 0) return { kind:"axis", html:U.axis };
    var b = P.at(zs, Q(tx)), need = q.div(Q(ty), b), reach = Math.abs(need.n) <= 99 && need.d <= 99, h = q.mul(S.k, b), miss = q.sub(h, Q(ty));
    var o = { b:b, need:need, h:h, miss:miss };
    if (!miss.n) { o.kind = "caught"; o.html = U.caught; }
    else if (!reach) { o.kind = "far"; o.html = fill(U.far, [srcTxt(qSrc(need))]); }
    else { o.kind = miss.n > 0 ? "high" : "low"; o.html = fill(miss.n > 0 ? U.high : U.low, [vM(q.abs(miss))]); }
    return o;
  }

  // ----- drawing -----
  plot.render = function(){
    var zs = zeros(), v = view(), f = P.f(zs), kv = q.v(S.k), ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), hi = css("--hi"), green = css("--green");
    var catchM = S.mode === "catch", curves = [], has = zs.length > 0;
    if (has && S.fan) FAN.forEach(function(k){ curves.push({ f:function(x){ return k * f(x); }, color:ink2, alpha:catchM ? 0.15 : 0.35, width:2 }); });
    if (has && ov.second) curves.push({ f:function(x){ return ov.second * f(x); }, color:ink, width:2.6, dash:[14, 8] });
    if (has) curves.push({ f:function(x){ return kv * f(x); }, color:pen, width:3.2, arrows:true });
    plot.draw({ view:v, curves:curves, xTicks:{ step:1 }, describe:describe(), after:function(ctx, pl){
      if (!has) { pl.label({ x:0, y:v.ymax * 0.5, text:"Add at least one zero.", align:"center", bg:true }); return; }
      rings(ctx, pl, zs.map(function(z){ return z[0]; }), pulse);
      var clampY = function(y){ return Math.max(v.ymin, Math.min(v.ymax, y)); };
      // height rulers
      var rl = ov.rulers || (S.ruler ? [S.x0] : []);
      rl.forEach(function(x0, ri){
        var X = pl.X(x0);
        ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.5; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, pl.H); ctx.stroke(); ctx.restore();
        if (S.fan && !ov.rulers) FAN.forEach(function(k){ var y = k * f(x0); if (y >= v.ymin && y <= v.ymax) { ctx.save(); ctx.globalAlpha = 0.7; dot(ctx, X, pl.Y(y), 3.2, ink2); ctx.restore(); } });
        var yb = f(x0), y = kv * yb, lab;
        if (ov.rulers) lab = ov.ride ? num(yb) + " → " + num(Math.round(y * 100) / 100) : "(" + num(x0) + ", " + num(yb) + ")";
        else { var bq = P.at(zs, q.of(x0)), hq = q.mul(S.k, bq); lab = S.k.n === S.k.d ? "b(" + num(x0) + ") = " + vTxt(bq) : srcTxt(vSrc(S.k)) + " × " + srcTxt(par(bq)) + " = " + vTxt(hq); }
        if (y >= v.ymin && y <= v.ymax) dot(ctx, X, pl.Y(y), 5.5, pen);
        pl.label({ x:x0, y:clampY(y), text:lab, dx:X > pl.W - 150 ? -10 : 10, dy:y > v.ymax * 0.8 ? 16 : -14, align:X > pl.W - 150 ? "right" : "left", bg:true, color:ink });
        void ri;
      });
      if (S.ruler && !ov.rulers) { var gx = pl.X(S.x0); ctx.save(); ctx.fillStyle = ink2; ctx.beginPath(); ctx.moveTo(gx - 7, 4); ctx.lineTo(gx + 7, 4); ctx.lineTo(gx, 14); ctx.closePath(); ctx.fill(); ctx.restore(); }
      // P4 scan line
      if (ov.scan) {
        var sx = ov.scan.x, X2 = pl.X(sx), y1 = f(sx), y2 = 2 * f(sx);
        ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X2, 0); ctx.lineTo(X2, pl.H); ctx.stroke(); ctx.restore();
        if (y1 >= v.ymin && y1 <= v.ymax) dot(ctx, X2, pl.Y(y1), 5, pen);
        if (y2 >= v.ymin && y2 <= v.ymax) dot(ctx, X2, pl.Y(y2), 5, ink);
        if (Math.abs(y2 - y1) > (v.ymax - v.ymin) * 0.04) {
          pl.label({ x:sx, y:clampY(y1), text:num(Math.round(y1 * 10) / 10), dx:10, dy:0, bg:true, color:pen });
          pl.label({ x:sx, y:clampY(y2), text:num(Math.round(y2 * 10) / 10), dx:10, dy:0, bg:true, color:ink });
          pl.label({ x:sx, y:clampY((y1 + y2) / 2), text:ov.scan.diff ? "different" : "×2", dx:-10, align:"right", bg:true, color:ink });
        }
      }
      (ov.meet || []).forEach(function(m){ dot(ctx, pl.X(m), pl.Y(0), 5.5, ink, hi); pl.label({ x:m, y:0, text:"(" + num(m) + ", 0)", dx:8, dy:16, bg:true }); });
      // catch mode: targets, guides, gap bars
      if (catchM) targets().forEach(function(t){
        var tx = t[0], ty = t[1], X3 = pl.X(tx), Y3 = pl.Y(ty), stt = status(t);
        ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.3; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(X3, Y3); ctx.lineTo(X3, pl.Y(0)); ctx.stroke(); ctx.restore();
        if (stt.miss && stt.kind !== "caught") {
          var hy = clampY(q.v(stt.h));
          ctx.save(); ctx.strokeStyle = hi; ctx.lineWidth = 6; ctx.lineCap = "butt"; ctx.beginPath(); ctx.moveTo(X3, pl.Y(hy)); ctx.lineTo(X3, Y3); ctx.stroke(); ctx.restore();
          var right = X3 < pl.W - 110;
          var my = Math.max(v.ymin + (v.ymax - v.ymin) * 0.06, Math.min(v.ymax - (v.ymax - v.ymin) * 0.06, (hy + ty) / 2));
          pl.label({ x:tx, y:my, text:"miss: " + vTxt(q.abs(stt.miss)), dx:right ? 12 : -12, align:right ? "left" : "right", bg:true });
        }
        dot(ctx, X3, Y3, 6, ink, stt.kind === "caught" ? green : hi);
        if (stt.kind === "caught") pl.label({ x:tx, y:ty, text:"Caught ✓", dx:0, dy:ty > v.ymax * 0.7 ? 24 : -22, align:"center", bg:true, color:green });
        else pl.label({ x:tx, y:ty, text:"(" + num(tx) + ", " + num(ty) + ")", dx:X3 < pl.W - 110 ? 12 : -12, dy:ty > v.ymax * 0.7 ? 18 : -16, align:X3 < pl.W - 110 ? "left" : "right", bg:true });
      });
    } });
    L.canvas.style.touchAction = S.mode === "catch" && !S.setup ? "none" : "pan-y";
  };
  function describe(){
    var zs = zeros(); if (!zs.length) return "Empty graph: add at least one zero.";
    var s = "Graph of " + MV.plain(MV.m(memberSrc(false))) + ". Zeros at " + listAnd(zs.map(function(z){ return num(z[0]); })) + ". y-intercept " + vTxt(q.mul(S.k, P.at(zs, Q(0)))) + ". " + endB(q.v(S.k), P.deg(zs)).words;
    if (S.fan) s += " A fan of eight members of the family is shown faintly.";
    if (S.mode === "catch") targets().forEach(function(t){ s += " Target (" + num(t[0]) + ", " + num(t[1]) + "): " + MV.plain(status(t).html).toLowerCase().replace(/\.$/, "") + "."; });
    return s;
  }

  // ----- text panels -----
  function paintCap(){
    var zs = zeros();
    if (!zs.length) { L.cap.innerHTML = MV.m("y = ?"); sub.innerHTML = ""; return; }
    L.cap.innerHTML = MV.m(memberSrc(true));
    sub.innerHTML = S.expanded ? MV.m("= " + expandedSrc()) : "";
  }
  function compare(){
    var k = S.k, kv = q.v(k);
    if (kv === 1) return "This is the base member.";
    if (kv === -1) return "Every height is multiplied by " + MV.m("-1") + ": a reflection in the " + MV.m("x") + "-axis only";
    var s = "Every height is multiplied by " + MV.m(vSrc(k)) + ": a vertical " + (Math.abs(kv) > 1 ? "stretch" : "compression") + " by a factor of " + MV.m(vSrc(q.abs(k)));
    return s + (kv < 0 ? " and a reflection in the " + MV.m("x") + "-axis" : "");
  }
  function paintRead(){
    var zs = zeros(), rows = [];
    if (!zs.length) { L.read.innerHTML = MV.readoutHTML([["Family", "Add at least one zero to build a family."]]); return; }
    var deg = P.deg(zs), k = S.k, kv = q.v(k), b0 = P.at(zs, Q(0)), y0 = q.mul(k, b0);
    rows.push(["Family", MV.m("y = @a{k}" + P.prod(zs)) + ", " + MV.m("k ≠ 0")]);
    rows.push(["Shared zeros", shareList(zs), !!ov.hl]);
    rows.push(["Degree", deg + ", for every member"]);
    rows.push(["This member", kv === 1 ? MV.m("k = 1") + ": the base member, " + MV.m(memberSrc(false)) : MV.m("k = " + vSrc(k)) + ": " + MV.m(memberSrc(false))]);
    if (S.expanded) rows.push(["Expanded", MV.m("y = " + expandedSrc())]);
    rows.push([MV.m("y") + "-intercept", MV.m(vSrc(y0) + " = " + vSrc(k) + " × " + par(b0)) + ' <span class="muted">(' + MV.m("k") + " times the base " + MV.m("y") + "-intercept)</span>"]);
    rows.push(["End behaviour", endB(kv, deg).html]);
    rows.push(["Compared with the base member", compare()]);
    if (S.ruler) {
      var x0 = q.of(S.x0), atZero = zs.some(function(z){ return z[0] === S.x0; });
      if (atZero) rows.push(["Height ruler", fill(U.rulerZero, [num(S.x0)])]);
      else { var bq = P.at(zs, x0); rows.push(["Height ruler", "At " + MV.m("x = " + num(S.x0)) + ": base height " + MV.m("b(" + num(S.x0) + ") = " + baseExpr(zs, x0) + " = " + vSrc(bq)) + "; this member " + MV.m(vSrc(k) + " × " + par(bq) + " = " + vSrc(q.mul(k, bq)))]); }
    }
    if (S.mode === "catch") {
      var T = targets();
      rows.push(["Target", T.map(function(t){ return "(" + num(t[0]) + ", " + num(t[1]) + ")"; }).join(" and ")]);
      T.forEach(function(t){
        var stt = status(t), lab = "Your member at " + MV.m("x = " + num(t[0]));
        if (stt.b) rows.push([lab, MV.m(vSrc(k) + " × " + par(stt.b) + " = " + vSrc(stt.h))]);
        rows.push([T.length > 1 ? "Status for (" + num(t[0]) + ", " + num(t[1]) + ")" : "Status", '<span class="ff-st ' + stt.kind + '">' + stt.html + "</span>"]);
      });
    }
    L.read.innerHTML = rows.map(function(r){ return "<div" + (r[2] ? ' class="ff-hl"' : "") + "><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("");
  }
  function paintNote(){ noteEl.innerHTML = noteTxt || ov.after || ""; }
  function showNote(html, ms){ noteTxt = html; paintNote(); clearTimeout(noteTimer); noteTimer = setTimeout(function(){ noteTxt = ""; paintNote(); }, MV.reduceMotion ? Math.max(ms, 2000) : ms); }

  // ----- controls -----
  var modeR = radios(modeHost, { uid:"ffm", label:"Mode", options:[{ id:"fan", t:"Fan" }, { id:"catch", t:"Catch the point" }], get:function(){ return S.mode; },
    set:function(m){ if (m === S.mode) return; userChange(); S.mode = m; if (m === "fan" && S.setup) leaveSetup(); shown = false; ensureTarget(); save(); paintAll(); } });
  var famR = radios(famHost, { uid:"fff", label:"Family", options:["F1", "F2", "F3", "own"].map(function(id){ return { id:id, t:MV.md(FAMS[id].label) }; }), get:function(){ return S.fam; },
    set:function(id){ if (id === S.fam && !S.setup) return; userChange(); if (S.setup) S.setup = null; S.fam = id; S.zoom = FAMS[id].zoom; shown = false; ensureTarget(); save(); paintAll(); } });
  zsHost.innerHTML = '<div class="ff-zs-own"></div><div class="ff-zs-tc"></div>';
  var ownHost = $(".ff-zs-own", zsHost), tcHostEl = $(".ff-zs-tc", zsHost);
  var zb = zeroSlots(ownHost, { uid:"ffz", slots:S.own, min:-5, max:5, maxDeg:6, onChange:function(){ userChange(); shown = false; save(); paintLive(); } });
  // TC3: positions locked, order chips 1 and 2 only
  var tcSl = [-2, 1, 3].map(function(r, i){ return { v:String(r), k:S.tc3[i] }; });
  var tcZb = zeroSlots(tcHostEl, { uid:"fft", slots:tcSl, lock:true, maxOrder:2, onChange:function(){ userChange(); S.tc3 = tcSl.map(function(t){ return t.k; }); save(); paintLive(); } });
  var sl = MV.sliders($(".ff-sl", host), [{ id:"ffk", param:"a", label:"Stretch factor " + MV.m("@a{k}"), min:-5, max:5, step:0.25, value:nearStep(q.v(S.k)), skip:[0] }],
    function(id, v){ var old = q.v(S.k); userChange(); S.k = q.of(v); S.exact = false; if ((old > 0) !== (v > 0)) showNote(U.kZero, 2000); setOut(); pulseRings(); save(); paintLive(); });
  function nearStep(v){ var s = Math.max(-5, Math.min(5, Math.round(v * 4) / 4)); if (s === 0) s = v < 0 ? -0.25 : 0.25; return s; }
  function setOut(){ var o = document.getElementById("sl-ffk-out"); if (o) o.innerHTML = MV.m("k = " + (S.exact ? qSrc(S.k) : decSrc(S.k))) + (S.exact ? ' <span class="ff-exact">(exact)</span>' : ""); }
  function syncSlider(){ sl.set("ffk", nearStep(q.v(S.k))); setOut(); }
  function paintEx(){ var b = host.querySelector('[data-ex="pm"]'); b.textContent = S.ex.neg ? MINUS : "+"; b.setAttribute("aria-label", "Sign of k: " + (S.ex.neg ? "negative" : "positive") + ". Press to switch."); }
  function paintFam(){
    famR.paint();
    ownHost.hidden = S.fam !== "own"; tcHostEl.hidden = S.fam !== "tc3";
    if (S.fam === "own") zb.paint();
    if (S.fam === "tc3") { tcSl.forEach(function(t, i){ t.k = S.tc3[i]; }); tcZb.paint(); }
  }
  function paintSetup(){
    if (!S.setup) { setupHost.innerHTML = ""; return; }
    var i = (EC.challenges || []).map(function(c){ return c.id; }).indexOf(S.setup) + 1;
    MV.keepFocus(setupHost, function(){ setupHost.innerHTML = '<div class="refresh ff-setinfo"><p>' + fill(U.setupOn, [String(i)]) + '</p><div class="q-actions" style="margin-top:6px"><button type="button" class="btn ghost sm" data-ff="leave" data-k="ffleave">' + U.leave + "</button></div></div>"; });
  }
  function paintTog(){
    var T = [["fan", "Show the fan"], ["ruler", "Height ruler"], ["expanded", "Expanded form"]];
    MV.keepFocus(togHost, function(){ togHost.innerHTML = '<div class="chips" role="group" aria-label="Show on the graph">' + T.map(function(t){ return '<button type="button" class="chip' + (S[t[0]] ? " on" : "") + '" aria-pressed="' + !!S[t[0]] + '" data-tog="' + t[0] + '" data-k="fft' + t[0] + '">' + t[1] + "</button>"; }).join("") + "</div>"; });
  }
  function paintZoom(){
    var mz = minZoom();
    MV.keepFocus(zoomHost, function(){ zoomHost.innerHTML = '<div class="q-actions ff-zoomrow"><span class="tiny"><i class="m">y</i>-window: ±' + ZOOMS[S.zoom] + '</span><button type="button" class="btn ghost sm ff-zb" data-zoom="out" data-k="ffzo" aria-label="Zoom out: a larger y-window"' + (S.zoom >= 3 ? " disabled" : "") + ">" + MINUS + '</button><button type="button" class="btn ghost sm ff-zb" data-zoom="in" data-k="ffzi" aria-label="Zoom in: a smaller y-window"' + (S.zoom <= mz ? " disabled" : "") + ">+</button></div>"; });
  }
  function paintShow(){
    if (S.mode !== "catch" || S.setup) { showHost.innerHTML = ""; return; }
    var t = targets()[0], stt = status(t), txt = "";
    if (shown) {
      if (stt.need) txt = MV.m("k") + " = " + MV.m(num(t[1]) + " ÷ " + par(stt.b) + " = " + qSrc(stt.need)) + ".";
      else txt = stt.html;
    }
    MV.keepFocus(showHost, function(){ showHost.innerHTML = '<div class="q-actions"><button type="button" class="btn ghost sm" data-ff="showk" data-k="ffshow"' + (shown ? " disabled" : "") + ">" + U.showK + '</button></div><p class="ff-reveal" aria-live="polite">' + txt + "</p>"; });
  }
  function paintLive(){ paintCap(); paintRead(); paintShow(); plot.render(); MV.changed(); }
  function paintAll(){ modeR.paint(); paintFam(); paintSetup(); paintTog(); paintZoom(); paintEx(); setOut(); paintNote(); paintLive(); }
  function save(){ api.save(); }
  function pulseRings(){
    if (MV.reduceMotion || pulsing) return;
    pulsing = MV.tween({ dur:600, ease:function(t){ return t; }, step:function(t){ pulse = Math.sin(Math.PI * t); plot.render(); }, done:function(){ pulse = 0; pulsing = null; plot.render(); } });
  }
  function finishPred(){ var d = pending; pending = null; if (d) d(); }
  function userChange(){ anim++; var had = ov.hl; ov = {}; if (had) paintRead(); finishPred(); }
  function leaveSetup(){ if (S.fam === "tc3") { S.fam = "F1"; S.zoom = FAMS.F1.zoom; } S.setup = null; }
  function doSetup(id){
    var c = chal(id); if (!c) return;
    userChange(); S.setup = id; S.mode = "catch"; S.fam = c.setup.fam; S.k = Q(1); S.exact = false; shown = false;
    S.zoom = FAMS[S.fam].zoom; ensureTarget(); syncSlider(); save(); paintAll();
    var top = host.getBoundingClientRect().top; if (top < 0 || top > window.innerHeight * 0.6) host.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
  }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.tog) { userChange(); var t = b.dataset.tog; S[t] = !S[t]; save(); paintTog(); paintLive(); return; }
    if (b.dataset.zoom) { S.zoom = Math.max(minZoom(), Math.min(3, S.zoom + (b.dataset.zoom === "out" ? 1 : -1))); save(); paintZoom(); plot.render(); return; }
    if (b.dataset.ff === "leave") { userChange(); leaveSetup(); save(); paintAll(); return; }
    if (b.dataset.ff === "showk") { S.showK++; shown = true; save(); paintShow(); MV.paintSummary && MV.paintSummary(); return; }
    if (b.dataset.ex === "pm") { S.ex.neg = !S.ex.neg; save(); paintEx(); return; }
    if (b.dataset.ex === "apply") {
      var p = (pIn.value || "").trim(), qq = (qIn.value || "").trim();
      if (!/^\d+$/.test(p) || !/^\d+$/.test(qq) || +p < 1 || +p > 99 || +qq < 1 || +qq > 99) { exMsg.textContent = "Enter whole numbers from 1 to 99 for p and q."; return; }
      var old = q.v(S.k); userChange(); S.k = Q(S.ex.neg ? -p : +p, +qq); S.exact = true; exMsg.textContent = "";
      if ((old > 0) !== (q.v(S.k) > 0)) showNote(U.kZero, 2000);
      syncSlider(); pulseRings(); save(); paintLive();
    }
  });
  [pIn, qIn].forEach(function(inp){
    inp.addEventListener("input", function(){ S.ex.p = pIn.value; S.ex.q = qIn.value; save(); });
    inp.addEventListener("keydown", function(e){ if (e.key === "Enter") { e.preventDefault(); host.querySelector('[data-ex="apply"]').click(); } });
  });

  // ----- drag: target, ruler, own zeros (G7) -----
  MV.drag(plot, {
    handles:function(){
      var hs = [], v = view();
      if (S.mode === "catch" && !S.setup) hs.push({ id:"tg", x:S.tx, y:S.ty, label:"Target at (" + num(S.tx) + ", " + num(S.ty) + "). Arrow keys move it by 1; Shift moves by 5." });
      if (S.ruler && !ov.rulers) hs.push({ id:"rl", x:S.x0, y:v.ymax - (v.ymax - v.ymin) * 0.03, label:"Height ruler at x = " + num(S.x0) + ". Left and right arrow keys move it by 0.5; Shift moves by 2.5." });
      if (S.fam === "own") S.own.forEach(function(s, i){ var t = String(s.v).trim(); if (/^-?\d+$/.test(t) && ownZs().some(function(z){ return z[0] === +t; })) hs.push({ id:"z" + i, x:+t, y:0, label:"Zero " + (i + 1) + " at " + num(+t) + ", order " + s.k + ". Left and right arrow keys move it; 1, 2 or 3 sets its order." }); });
      return hs;
    },
    snap:function(x, y, id){ if (id === "tg") return [Math.round(x), Math.round(y)]; if (id === "rl") return [Math.round(x * 2) / 2, y]; return [Math.round(x), 0]; },
    key:function(id, e){
      if (id === "tg") return false;
      var d = (e.key === "ArrowRight" || e.key === "ArrowUp") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowDown") ? -1 : 0;
      if (id.charAt(0) === "z" && /^[123]$/.test(e.key)) { var s = S.own[+id.slice(1)], k = +e.key, deg = P.deg(ownZs()); if (deg - s.k + k <= 6) { userChange(); s.k = k; save(); zb.paint(); paintLive(); } return true; }
      if (!d) return false;
      if (id === "rl") { move("rl", S.x0 + d * 0.5 * (e.shiftKey ? 5 : 1), 0, "key"); return true; }
      var i = +id.slice(1); userChange(); for (var n = 0; n < (e.shiftKey ? 5 : 1); n++) zb.step(i, d); save(); zb.paint(); paintLive(); return true;
    },
    move:function(id, x, y, how){ move(id, x, y, how); }
  });
  function move(id, x, y){
    if (id === "tg") {
      x = Math.max(-6, Math.min(6, Math.round(x))); y = Math.max(-120, Math.min(120, Math.round(y)));
      if (x === S.tx && y === S.ty) return;
      userChange(); S.tx = x; S.ty = y; shown = false; ensureTarget(); save(); paintZoom(); paintLive(); return;
    }
    if (id === "rl") { x = Math.max(-6, Math.min(6, Math.round(x * 2) / 2)); if (x === S.x0) return; userChange(); S.x0 = x; save(); paintLive(); return; }
    var i = +id.slice(1), s = S.own[i]; x = Math.max(-5, Math.min(5, Math.round(x)));
    if (String(x) === String(s.v).trim() || S.own.some(function(t, j){ return j !== i && String(t.v).trim() === String(x); })) return;
    userChange(); s.v = String(x); shown = false; save(); zb.paint(); paintLive();
  }

  // ----- "Set up the explorer" buttons inside the toolkit's challenge cards -----
  var chalHost = $("#chal");
  function inject(){
    (EC.challenges || []).forEach(function(c){
      var box = chalHost.querySelector('[data-c="' + c.id + '"]'); if (!box || box.querySelector(".ff-setrow")) return;
      var row = document.createElement("div"); row.className = "q-actions ff-setrow";
      row.innerHTML = '<button type="button" class="btn sm" data-setup="' + c.id + '">' + U.setup + "</button>";
      var head = box.querySelector(".q-head"); if (head) head.parentNode.insertBefore(row, head.nextSibling);
    });
  }
  if (chalHost) {
    new MutationObserver(inject).observe(chalHost, { childList:true });
    chalHost.addEventListener("click", function(e){ var b = e.target.closest("[data-setup]"); if (b) doSetup(b.dataset.setup); });
  }

  // ----- prediction animations (K10 tweens; reduced motion jumps to the end) -----
  function tw(o){ var my = anim; return MV.tween({ dur:o.dur, ease:o.ease, step:function(t){ if (my === anim) o.step(t); }, done:function(){ if (my === anim && o.done) o.done(); } }); }
  function wt(ms, fn){ var my = anim; MV.wait(ms, function(){ if (my === anim) fn(); }); }
  function setK(v){ S.k = q.of(Math.round(v * 100) / 100); S.exact = false; sl.set("ffk", nearStep(v)); setOut(); }
  function sweep(a, b, dur, cb){ tw({ dur:dur, step:function(t){ setK(a + (b - a) * t); paintLive(); }, done:function(){ setK(b); paintLive(); cb(); } }); }
  function end(p){ ov.after = p.after; paintNote(); save(); finishPred(); }
  var predict = {
    start:function(p){
      userChange(); S.setup = null; S.mode = "fan"; S.fam = "F1"; S.zoom = 1; S.ruler = false; S.expanded = false; S.fan = !!p.start.fan; shown = false;
      setK(p.start.k);
      ov = {};
      if (p.start.rulers) ov.rulers = p.start.rulers.slice();
      if (p.start.second) ov.second = p.start.second;
      paintAll();
    },
    run:function(p, done){
      pending = done;
      if (p.id === "p1") { ov.hl = true; paintRead(); pulseRings(); sweep(1, 3, 1500, function(){ pulseRings(); end(p); }); }
      else if (p.id === "p2") { ov.ride = true; sweep(1, 3, 1500, function(){ end(p); }); }
      else if (p.id === "p3") {
        sweep(2, 0.25, 1300, function(){ showNote(U.kZero, 2200); wt(1000, function(){ setK(-0.25); paintLive(); sweep(-0.25, -2, 1300, function(){ end(p); }); }); });
      } else if (p.id === "p4") {
        var stops = [-6, -2, 0, 1, 3, 6]; ov.meet = [];
        var seg = function(i){
          if (i >= stops.length - 1) { ov.scan = null; plot.render(); end(p); return; }
          var a = stops[i], b = stops[i + 1];
          tw({ dur:(b - a) * 330, ease:function(t){ return t; }, step:function(t){ ov.scan = { x:a + (b - a) * t }; plot.render(); }, done:function(){
            ov.scan = { x:b, diff:b === 0 }; if ([-2, 1, 3].indexOf(b) >= 0) ov.meet.push(b); plot.render();
            if (b === 6) seg(i + 1); else wt(750, function(){ seg(i + 1); });
          } });
        };
        seg(0);
      } else end(p);
    }
  };

  // ----- challenges -----
  function challenge(id){
    var c = chal(id), k = S.k; if (!c) return { ok:false };
    if (id === "tc1" || id === "tc2") {
      if (S.fam !== c.setup.fam) return { ok:false, msg:c.fam };
      var t = c.setup.targets[0], h = q.mul(k, P.at(zeros(), Q(t[0])));
      if (q.eq(h, Q(t[1]))) return { ok:true };
      var nm = (c.named || []).filter(function(n){ return [].concat(n.k).some(function(s){ return q.eq(q.of(s), k); }); })[0];
      return { ok:false, msg:fill(nm ? nm.fb : c.other, [vM(h)]) };
    }
    if (id === "tc3") {
      if (S.fam !== "tc3") return { ok:false, msg:c.fam };
      var zs = zeros(), T = c.setup.targets, hs = T.map(function(tt){ return q.mul(k, P.at(zs, Q(tt[0]))); }), hit = T.map(function(tt, i){ return q.eq(hs[i], Q(tt[1])); });
      if (hit[0] && hit[1]) return { ok:true };
      var nm3 = (c.named || []).filter(function(n){ return n.orders.join() === S.tc3.join() && q.eq(q.of(n.k), k); })[0];
      if (nm3) return { ok:false, msg:nm3.fb };
      if (hit[0] || hit[1]) return { ok:false, msg:fill(c.one, [vM(hs[hit[0] ? 1 : 0])]) };
      return { ok:false, msg:c.neither };
    }
    return { ok:false };
  }

  if (S.setup) { S.mode = "catch"; } else if (S.fam === "tc3") S.fam = "F1";
  ensureTarget(); syncSlider(); paintAll();
  return { predict:predict, challenge:challenge, showCount:function(){ return S.showK || 0; } };
}

// ---------- Part 3: build the equation from conditions ----------
var B3 = {
  r1:{ view:{ xmin:-2.5, xmax:5.5, ymin:-28, ymax:28 }, base:function(x){ return (x + 1) * (x - 2) * (x - 4); }, k:2, zeros:[-1, 2, 4], pt:[3, -8], yi:16 },
  r2:{ view:{ xmin:-5.5, xmax:3.5, ymin:-36, ymax:36 }, base:function(x){ return (x + 3) * (x - 1) * (x - 1); }, k:3, zeros:[-3, 1], pt:[2, 15], yi:9, given:true },
  r3:{ view:{ xmin:-2.5, xmax:4.5, ymin:-25, ymax:25 }, base:function(x){ return (x * x - 2 * x - 1) * (x - 3); }, k:-2, zeros:[1 - Math.SQRT2, 1 + Math.SQRT2, 3], zlab:["≈ " + MINUS + "0.41", "≈ 2.41", ""], pt:[-1, 16], yi:-6 }
};
function part3(host, api){
  var C = api.content, R = C.rounds, G = C.general, S = api.S;
  if (S.round == null) S.round = 0; S.st = S.st || {};
  var msgs = {}, bads = {}, glow = 0;
  host.innerHTML = '<div class="b3-rounds"></div><div class="sym b3"><div class="b3-left"><p class="b3-cond"></p><div class="plot-wrap"><canvas class="plot" role="img" aria-label="Graph for this round"></canvas></div>' +
    '<p class="eq-cap b3-eq" aria-live="polite"></p><p class="b3-note" aria-live="polite"></p></div><div class="b3-sheet"></div></div>' +
    '<details class="alg b3-alg"><summary>Check it with algebra</summary><div class="b3-algb"></div></details>';
  var plot = new MV.Plot($("canvas", host), B3.r1.view), sheet = $(".b3-sheet", host);
  function rs(ri){ var r = R[ri]; return S.st[r.id] || (S.st[r.id] = { step:0, steps:r.steps.map(function(){ return { tries:0, hint:0, first:null, solved:false, vals:{}, pick:{}, tile:null }; }) }); }
  var roundR = radios($(".b3-rounds", host), { uid:"b3r", label:"Choose a round", options:R.map(function(r, i){ return { id:String(i), t:r.name }; }), get:function(){ return String(S.round); },
    mark:function(id){ return rs(+id).step >= R[+id].steps.length; }, set:function(id){ S.round = +id; api.save(); paint(); } });

  plot.render = function(){
    var ri = S.round, r = R[ri], g = B3[r.id], s = rs(ri).step, ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), curves = [], pts = [];
    if (s >= 1) FAN.forEach(function(k){ curves.push({ f:function(x){ return k * g.base(x); }, color:ink2, alpha:0.35, width:2 }); });
    var member = g.given || s >= 3, mf = function(x){ return g.k * g.base(x); };
    if (member && glow > 0) curves.push({ f:mf, color:css("--hi"), width:11, alpha:0.7 * glow });
    if (member) curves.push({ f:mf, color:pen, width:3.2, arrows:true });
    var ptLab = "(" + num(g.pt[0]) + ", " + num(g.pt[1]) + ")" + (s >= 3 && !g.given ? " ✓" : "");
    pts.push({ x:g.pt[0], y:g.pt[1], r:6, color:ink, ring:!g.given, label:ptLab });
    if (s >= 4) pts.push({ x:0, y:g.yi, r:6, color:ink, ring:true, label:"(0, " + num(g.yi) + ")" });
    var desc = r.title + ". " + (g.given ? "The graph of a cubic crosses the x-axis at −3, touches it at 1, and passes through the labelled point (2, 15)." : "Zeros marked on the x-axis and the target " + "(" + num(g.pt[0]) + ", " + num(g.pt[1]) + ").") +
      (s >= 1 ? " A fan of members of the family is shown." : "") + (s >= 3 && !g.given ? " The member through the target is drawn." : "") + (s >= 4 ? " The y-intercept (0, " + num(g.yi) + ") is marked." : "");
    plot.draw({ view:g.view, curves:curves, points:pts, xTicks:{ step:1 }, describe:desc, after:function(ctx, pl){
      if (!g.given || s >= 1) {
        rings(ctx, pl, g.zeros, 0);
        (g.zlab || []).forEach(function(t, i){ if (t) pl.label({ x:g.zeros[i], y:0, text:t, dy:24, dx:g.zeros[i] < 0 ? 6 : 0, align:g.zeros[i] < 0 ? "right" : "center", bg:true, color:ink2, font:"13px " + pl.fontUI }); });
      }
    } });
  };
  function inp(key, id, label, x, dis, cls){
    var bad = bads[key] && bads[key][id];
    return '<input class="b3-in' + (cls ? " " + cls : "") + (bad ? " bad" : "") + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" data-b3="' + id + '" data-k="b3' + key + id + '" aria-label="' + MV.esc(label) + '" value="' + MV.esc(x.vals[id] || "") + '"' + (dis ? " disabled" : "") + ">";
  }
  function tileBtn(key, i, t, on, dis, role, extra){
    return '<button type="button" class="fchip b3-tile" role="' + role + '" aria-checked="' + on + '" data-' + extra + '="' + i + '" data-k="b3' + key + extra + i + '"' + (dis ? " disabled" : "") + ">" + t.t + "</button>";
  }
  function inputsHTML(ri, si, sp, x, dis){
    var key = R[ri].id + si;
    if (sp.kind === "tiles" || sp.kind === "tilesOrder") {
      return '<div class="b3-tiles' + (sp.kind === "tilesOrder" ? " two" : "") + '" role="group" aria-label="Factor tiles (select all that apply)">' + sp.tiles.map(function(t, i){
        var on = !!x.pick[i], h = '<div class="b3-cell">' + tileBtn(key, i, t, on, dis, "checkbox", "tile");
        if (sp.kind === "tilesOrder" && on) h += '<span class="b3-ord" role="group" aria-label="Order of ' + MV.esc(MV.plain(t.t)) + '"><span class="tiny">Order</span>' + [1, 2, 3].map(function(k){ return '<button type="button" class="chip' + (x.pick[i] === k ? " on" : "") + '" aria-pressed="' + (x.pick[i] === k) + '" data-ord="' + i + "|" + k + '" data-k="b3' + key + "o" + i + k + '"' + (dis ? " disabled" : "") + ">" + k + "</button>"; }).join("") + "</span>";
        return h + "</div>";
      }).join("") + "</div>";
    }
    if (sp.kind === "pair") {
      return '<p class="b3-frame">' + sp.frame.replace(/\{(\w+)\}/g, function(_, id){ return inp(key, id, id === "b" ? "coefficient of x" : "constant term", x, dis, "short"); }) + "</p>" +
        '<p class="b3-ask2">' + sp.tileAsk + '</p><div class="b3-tiles two" role="radiogroup" aria-label="Factor for the third zero">' + sp.tiles.map(function(t, i){ return '<div class="b3-cell">' + tileBtn(key, i, t, x.tile === i, dis, "radio", "pt") + "</div>"; }).join("") + "</div>";
    }
    if (sp.kind === "coef") {
      var lab = ["coefficient of x cubed", "coefficient of x squared", "coefficient of x", "constant term"];
      return '<p class="b3-frame b3-coef">' + MV.m("y =") + " " + inp(key, "a", lab[0], x, dis, "co") + MV.m("x^3 +") + " " + inp(key, "b", lab[1], x, dis, "co") + MV.m("x^2 +") + " " + inp(key, "c", lab[2], x, dis, "co") + MV.m("x +") + " " + inp(key, "d", lab[3], x, dis, "co") + "</p>";
    }
    return '<p class="b3-frame"><label>' + sp.label + " " + inp(key, "v", MV.plain(sp.label), x, dis) + "</label></p>";
  }
  function stepHTML(ri, si){
    var r = R[ri], st = rs(ri), sp = r.steps[si], x = st.steps[si], key = r.id + si, cur = st.step === si, done = st.step > si;
    var h = '<div class="b3-step' + (done ? " done" : cur ? " cur" : " locked") + '" data-si="' + si + '"><h4>' + (done ? '<span class="b3-ok" aria-hidden="true">✓</span> ' : "") + "Step " + (si + 1) + ". " + sp.title + (done ? '<span class="vh"> (done)</span>' : "") + "</h4>";
    if (!cur && !done) return h + '<p class="tiny muted">Unlocks when step ' + si + " is right.</p></div>";
    h += '<p class="b3-ask">' + sp.ask + "</p>" + inputsHTML(ri, si, sp, x, done);
    if (cur) {
      h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="b3chk' + key + '">Check</button>' + MV.hintBtn("b3h" + key, x.hint) + "</div>" + MV.hintsHTML(sp.hints, x.hint);
      var m = msgs[key]; if (m) h += '<div class="fb' + (m.soft ? "" : " bad") + '" role="status"><p>' + (m.soft ? "" : "<strong>✗ Not quite.</strong> ") + m.html + "</p></div>";
    }
    if (done) h += '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + (sp.right || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    return h + "</div>";
  }
  function paint(){
    var ri = S.round, r = R[ri], st = rs(ri), s = st.step;
    roundR.paint();
    $(".b3-cond", host).innerHTML = "<strong>" + r.title + ".</strong> " + r.cond;
    $(".b3-eq", host).innerHTML = s >= 4 ? r.eqs[2] : s >= 3 ? r.eqs[1] : s >= 1 ? r.eqs[0] : '<span class="tiny muted">The equation builds here, step by step.</span>';
    $(".b3-note", host).innerHTML = s >= 4 ? r.steps[3].right : "";
    MV.keepFocus(sheet, function(){ sheet.innerHTML = r.steps.map(function(_, si){ return stepHTML(ri, si); }).join("") + (s >= r.steps.length ? '<p class="b3-done">✓ Round complete. ' + (ri < R.length - 1 ? '<button type="button" class="btn sm" data-next="' + (ri + 1) + '" data-k="b3next">Go to ' + R[ri + 1].name + "</button>" : "") + "</p>" : ""); });
    var alg = $(".b3-alg", host), open = alg.open;
    $(".b3-algb", host).innerHTML = s >= r.steps.length ? '<div class="alg-lines">' + r.alg.map(function(l){ return "<div>" + l + "</div>"; }).join("") + "</div>" : '<p class="tiny muted" style="margin:10px 0 0">Finish this round to see the whole solution in one block.</p>';
    alg.open = open;
    plot.render();
  }
  function near(a, b, tol){ return Math.abs(q.v(a) - q.v(b)) < tol; }
  function judge(sp, x){
    var A = MV.ans(sp), picked;
    if (sp.kind === "tiles" || sp.kind === "tilesOrder") {
      picked = Object.keys(x.pick).filter(function(k){ return x.pick[k]; }).map(Number);
      if (!picked.length) return { soft:true, msg:G.pick };
      var wr = picked.filter(function(j){ return !MV.ok(sp.tiles[j]); });
      if (wr.length) return { msg:uniq(wr.map(function(j){ return sp.tiles[j].fb; })).join(" ") };
      if (sp.kind === "tiles") {
        var need = sp.tiles.map(function(t, j){ return MV.ok(t) ? j : -1; }).filter(function(j){ return j >= 0; });
        if (need.some(function(j){ return !x.pick[j]; })) return { msg:sp.fewer };
        return { ok:true };
      }
      var sum = picked.reduce(function(s, j){ return s + x.pick[j]; }, 0);
      if (sum > 3) return { msg:sp.sum };
      var om = picked.filter(function(j){ return A[j] != null && x.pick[j] !== A[j]; }).map(function(j){ return (sp.tiles[j].ordFb || {})[x.pick[j]]; }).filter(Boolean);
      if (om.length) return { msg:uniq(om).join(" ") };
      if (Object.keys(A).some(function(j){ return !x.pick[j]; })) return { msg:sp.fewer };
      if (sum !== 3) return { msg:sp.sum };
      return { ok:true };
    }
    var ids = sp.kind === "coef" ? ["a", "b", "c", "d"] : sp.kind === "pair" ? ["b", "c"] : ["v"], v = {}, dec = {}, empty = false;
    ids.forEach(function(id){ var p = parseQ(x.vals[id]); if (!p) empty = true; else { v[id] = p.q; dec[id] = p.dec; } });
    if (empty) return { soft:true, msg:G.fill };
    var want = {};
    if (sp.kind === "coef") ids.forEach(function(id, j){ want[id] = q.of(A[j]); });
    else if (sp.kind === "pair") ids.forEach(function(id){ want[id] = q.of(A[id]); });
    else want.v = q.of(A);
    var bad = {}; ids.forEach(function(id){ if (!q.eq(v[id], want[id])) bad[id] = 1; });
    if (!Object.keys(bad).length) {
      if (sp.kind !== "pair") return { ok:true };
      if (x.tile == null) return { soft:true, msg:G.tileNext };
      if (!MV.ok(sp.tiles[x.tile])) return { msg:sp.tiles[x.tile].fb };
      return { ok:true };
    }
    if (ids.some(function(id){ return bad[id] && dec[id] && near(v[id], want[id], 0.01); })) return { msg:G.exact, bad:bad };
    var w = (sp.wrong || []).filter(function(wr){
      var mm = wr.match;
      if (sp.kind === "coef") return mm.every(function(val, j){ return q.eq(v[ids[j]], q.of(val)); });
      if (sp.kind === "pair") return Object.keys(mm).every(function(id){ return q.eq(v[id], q.of(mm[id])); });
      return q.eq(v.v, q.of(mm)) || (dec.v && near(v.v, q.of(mm), 0.005));
    })[0];
    return { msg:w ? w.fb : G[sp.kind] || G.num, bad:bad };
  }
  function check(si){
    var ri = S.round, r = R[ri], st = rs(ri), sp = r.steps[si], x = st.steps[si], key = r.id + si, res = judge(sp, x);
    if (res.soft) { msgs[key] = { soft:true, html:res.msg }; paint(); MV.focusFb(sheet.querySelector('[data-si="' + si + '"]')); return; }
    if (res.ok) {
      x.solved = true; x.first = x.tries === 0 && x.hint < 3; st.step = si + 1; msgs[key] = null; bads[key] = null; api.save(); paint();
      if (si === 2) { glow = 1; MV.tween({ dur:MV.reduceMotion ? 0 : 1200, step:function(t){ glow = 1 - t; plot.render(); } }); }
      MV.focusFb(sheet.querySelector('[data-si="' + si + '"]'));
      return;
    }
    x.tries++; msgs[key] = { html:res.msg }; bads[key] = res.bad || null; api.save(); paint(); MV.focusFb(sheet.querySelector('[data-si="' + si + '"]'));
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !sheet.contains(b)) return;
    if (b.dataset.next) { S.round = +b.dataset.next; api.save(); paint(); var c = $(".b3-rounds", host); if (c) c.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" }); return; }
    var stepEl = b.closest("[data-si]"); if (!stepEl) return;
    var si = +stepEl.dataset.si, r = R[S.round], st = rs(S.round), x = st.steps[si], key = r.id + si;
    if (st.step !== si) return;
    if (b.dataset.act === "check") { check(si); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.tile != null) { var ti = +b.dataset.tile; if (x.pick[ti]) delete x.pick[ti]; else x.pick[ti] = 1; msgs[key] = null; api.save(); paint(); return; }
    if (b.dataset.ord) { var pr = b.dataset.ord.split("|"); x.pick[+pr[0]] = +pr[1]; msgs[key] = null; api.save(); paint(); return; }
    if (b.dataset.pt != null) { x.tile = +b.dataset.pt; msgs[key] = null; api.save(); paint(); return; }
  });
  host.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset || !t.dataset.b3) return;
    var stepEl = t.closest("[data-si]"); if (!stepEl) return;
    rs(S.round).steps[+stepEl.dataset.si].vals[t.dataset.b3] = t.value; api.save();
  });
  host.addEventListener("keydown", function(e){
    var t = e.target; if (e.key !== "Enter" || !t.dataset || !t.dataset.b3) return;
    e.preventDefault();
    var stepEl = t.closest("[data-si]"), all = Array.prototype.slice.call(stepEl.querySelectorAll(".b3-in")), nx = all.slice(all.indexOf(t) + 1).filter(function(n){ return !n.value.trim(); })[0];
    if (nx) nx.focus(); else check(+stepEl.dataset.si);
  });
  paint();
  // Part 3 counts in the results summary and the goals to review
  MV.ACTS.build = { a:{ id:"build" },
    stats:function(){ var f = 0, d = 0, n = 0; R.forEach(function(r, ri){ rs(ri).steps.forEach(function(x){ n++; if (x.solved) d++; if (x.first) f++; }); }); return { first:f, total:n, done:d, line:C.summary + ": " + f + "/" + n + (d < n ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; R.forEach(function(r, ri){ if (rs(ri).steps.some(function(x){ return x.tries > 0 || x.hint >= 3; })) g = g.concat(MV.goalIdx(r.goal)); }); return g; } };
  return {};
}

// ---------- Practice 2: find the member (number boxes, exact fractions) ----------
function member(host, api, a){
  var S = api.S; if (S.i == null) S.i = 0; S.items = S.items || {};
  var msgs = {}, bads = {}, G = MV.C.part3.general;
  function ist(it){ return S.items[it.id] || (S.items[it.id] = { vals:{}, tries:0, hint:0, solved:false, first:null }); }
  function inp(it, id){ var x = ist(it), bad = bads[it.id] && bads[it.id][id]; return '<input class="mb-in' + (bad ? " bad" : "") + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" data-mb="' + id + '" data-k="mb' + it.id + id + '" aria-label="' + MV.esc((it.labels || {})[id] || id) + '" value="' + MV.esc(x.vals[id] || "") + '"' + (x.solved ? " disabled" : "") + ">"; }
  function paint(){
    var it = a.items[S.i], x = ist(it);
    var h = '<p class="how">' + a.how + '</p><div class="pred-top"><span class="tiny muted">Problem ' + (S.i + 1) + " of " + a.items.length + (it.star ? " ★ (non-routine)" : "") + '</span><span class="dots" aria-hidden="true">' +
      a.items.map(function(qq, i){ var y = S.items[qq.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("") + "</span></div>";
    h += '<div class="mb-item"><p class="mb-prompt">' + it.prompt + '</p><p class="mb-frame">' + it.frame.replace(/\{(\w+)\}/g, function(_, id){ return inp(it, id); }) + "</p></div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="mbchk">Check</button>' + MV.hintBtn("mbh" + it.id, x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb' + (msgs[it.id].soft ? "" : " bad") + '" role="status"><p>' + msgs[it.id].html + "</p></div>";
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="prev" data-k="mbprev"' + (S.i === 0 ? " disabled" : "") + '>Previous</button><button type="button" class="btn ' + (x.solved ? "primary" : "ghost") + ' sm" data-act="next" data-k="mbnext"' + (S.i === a.items.length - 1 ? " disabled" : "") + ">Next problem</button></div>";
    MV.keepFocus(host, function(){ host.innerHTML = h; });
  }
  function check(){
    var it = a.items[S.i], x = ist(it), A = MV.ans(it), v = {}, dec = {}, empty = false;
    Object.keys(A).forEach(function(id){ var p = parseQ(x.vals[id]); if (!p) empty = true; else { v[id] = p.q; dec[id] = p.dec; } });
    if (empty) { msgs[it.id] = { soft:true, html:"Fill in every box first. Fractions like −3/2 are fine." }; paint(); MV.focusFb(host); return; }
    var bad = {}; Object.keys(A).forEach(function(id){ if (!q.eq(v[id], q.of(A[id]))) bad[id] = 1; });
    if (!Object.keys(bad).length) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; bads[it.id] = null; api.save(); paint(); MV.focusFb(host); return; }
    x.tries++; bads[it.id] = bad;
    var exact = Object.keys(bad).some(function(id){ return dec[id] && Math.abs(q.v(v[id]) - q.v(q.of(A[id]))) < 0.01; });
    var w = (it.wrong || []).filter(function(wr){ return Object.keys(wr.match).every(function(id){ return v[id] && q.eq(v[id], q.of(wr.match[id])); }); })[0];
    msgs[it.id] = { html:"<strong>✗ Not quite.</strong> " + (exact ? G.exact : w ? w.fb : a.general) };
    api.save(); paint(); MV.focusFb(host);
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.mb) return; ist(a.items[S.i]).vals[t.dataset.mb] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){
    var t = e.target; if (e.key !== "Enter" || !t.dataset || !t.dataset.mb) return;
    e.preventDefault(); var all = Array.prototype.slice.call(host.querySelectorAll(".mb-in")), nx = all.slice(all.indexOf(t) + 1).filter(function(n){ return !n.value.trim(); })[0];
    if (nx) nx.focus(); else check();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = a.items[S.i], x = ist(it);
    if (b.dataset.act === "check") { check(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "prev" || b.dataset.act === "next") { S.i += b.dataset.act === "prev" ? -1 : 1; api.save(); paint(); }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Bridge the gap ----------
var task = (function(){
  var api = null, plot = null, zb = null;
  function st(){ var s = api.S; s.slots = s.slots || [{ v:"", k:1 }, { v:"", k:1 }, { v:"", k:1 }]; s.kx = s.kx || { neg:false, p:"", q:"" }; return s; }
  function readK(s){ var p = String(s.kx.p).trim(), qq = String(s.kx.q).trim(); if (!/^\d+$/.test(p) || !/^\d+$/.test(qq) || +p < 1 || +p > 99 || +qq < 1 || +qq > 99) return null; return Q(s.kx.neg ? -p : +p, +qq); }
  function read(){
    if (!api) return { zs:[], bad:null, k:null };
    var s = st(), r = parseSlots(s.slots, -10, 10);
    return { zs:r.zs, bad:r.bad, k:readK(s) };
  }
  // order: the zero 0, then 6, then the rest (as the plan's examples)
  function ordered(zs){ var rank = function(z){ return z[0] === 0 ? -2 : z[0] === 6 ? -1 : 0; }; return zs.slice().sort(function(a, b){ return rank(a) - rank(b) || a[0] - b[0]; }); }
  function kCoef(k){ if (k.n === k.d) return ""; if (k.n === -k.d) return "-"; if (k.d === 1) return String(k.n); return (k.n < 0 ? "-" : "") + "(" + Math.abs(k.n) + "/" + k.d + ")"; }
  function eqSrc(zs, k){ return "y = " + kCoef(k) + ordered(zs).map(function(z){ return P.factor(z[0], z[1]); }).join(""); }
  function vH(a){ return MV.m(qSrc(a)); }
  function draw(){
    var d = read(), v = { xmin:-2, xmax:8, ymin:-20, ymax:40 }, ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), curves = [];
    var f = P.f(d.zs), kv = d.k ? q.v(d.k) : null;
    if (d.zs.length && d.k) curves.push({ f:function(x){ return kv * f(x); }, color:pen, width:3.2, arrows:true });
    var desc = d.zs.length && d.k ? "Preview of " + MV.plain(MV.m(eqSrc(d.zs, d.k))) + ", with the target (3, 27) and the gap from 0 to 6 below the x-axis shaded." : "Preview: the target (3, 27) and the gap from 0 to 6 below the x-axis shaded. Fill the zero slots and k to see your cubic.";
    plot.draw({ view:v, xTicks:{ step:1 }, yTicks:{ step:10 }, regions:[{ f:function(){ return 0; }, g:function(){ return v.ymin; }, x0:0, x1:6 }], curves:curves,
      points:[{ x:3, y:27, r:6, color:ink, ring:true, label:"(3, 27)" }],
      labels:[{ x:3, y:-11, text:"stay above here", align:"center", color:ink2, font:"italic 600 13px " + css("--font-ui") }], describe:desc,
      after:function(ctx, pl){
        var inside = d.zs.filter(function(z){ return z[0] >= v.xmin && z[0] <= v.xmax; }).map(function(z){ return z[0]; });
        rings(ctx, pl, inside, 0);
        var left = 0, right = 0;
        d.zs.forEach(function(z){
          if (z[0] < v.xmin) { pl.label({ x:v.xmin, y:0, text:"← zero at x = " + num(z[0]), dx:6, dy:18 + 20 * left++, align:"left", bg:true, font:"600 13px " + pl.fontUI }); }
          if (z[0] > v.xmax) { pl.label({ x:v.xmax, y:0, text:"zero at x = " + num(z[0]) + " →", dx:-6, dy:18 + 20 * right++, align:"right", bg:true, font:"600 13px " + pl.fontUI }); }
        });
      } });
  }
  function paintCap(){
    var d = read(), cap = $("#tk-cap"); if (!cap) return;
    cap.innerHTML = d.zs.length && d.k ? MV.m(eqSrc(d.zs, d.k)) : '<span class="tiny muted">Your equation appears here.</span>';
  }
  function paintK(){ var b = $("#tk-pm"); if (!b) return; var s = st(); b.textContent = s.kx.neg ? MINUS : "+"; b.setAttribute("aria-label", "Sign of k: " + (s.kx.neg ? "negative" : "positive") + ". Press to switch."); }
  function refresh(){ paintCap(); draw(); api.update(); }
  function unkey(key){ var p = key.split("|"), zs = p[0] ? p[0].split(",").map(function(t){ var r = t.split(":"); return [+r[0], +r[1]]; }) : [], kk = p[1].split("/"); return { zs:zs, k:Q(+kk[0], +kk[1]) }; }
  return {
    render:function(inp, pv, a){
      api = a; var s = st();
      inp.innerHTML = '<h4 class="tk-h">Zeros</h4><div class="tk-zs"></div><h4 class="tk-h">' + MV.m("k") + ' as a fraction</h4><div class="ff-ex" role="group" aria-label="k as a fraction"><span class="m"><i>k</i> =</span><button type="button" class="btn ghost sm ff-pm" id="tk-pm" data-k="tkpm"></button>' +
        '<input class="ff-pq" id="tk-p" type="text" inputmode="numeric" autocomplete="off" aria-label="Numerator p, a whole number from 1 to 99" value="' + MV.esc(s.kx.p) + '"><span class="ff-bar" aria-hidden="true">/</span>' +
        '<input class="ff-pq" id="tk-q" type="text" inputmode="numeric" autocomplete="off" aria-label="Denominator q, a whole number from 1 to 99" value="' + MV.esc(s.kx.q) + '"></div>';
      pv.innerHTML = '<div class="eq-cap tk-cap" id="tk-cap" aria-live="polite"></div><div class="plot-wrap"><canvas class="plot" id="tk-plot" role="img" aria-label="Preview of your cubic"></canvas></div>';
      zb = zeroSlots($(".tk-zs", inp), { uid:"tkz", slots:s.slots, min:-10, max:10, maxDeg:9, onChange:function(){ a.save(); refresh(); } });
      zb.paint();
      plot = new MV.Plot($("#tk-plot"), { xmin:-2, xmax:8, ymin:-20, ymax:40 }); plot.render = draw;
      $("#tk-pm").addEventListener("click", function(){ s.kx.neg = !s.kx.neg; a.save(); paintK(); refresh(); });
      ["p", "q"].forEach(function(id){ $("#tk-" + id).addEventListener("input", function(e){ s.kx[id] = e.target.value; a.save(); refresh(); }); });
      paintK(); paintCap(); draw();
    },
    read:read,
    valid:function(d){
      if (d.bad && d.bad.kind === "range") return "Zero " + (d.bad.i + 1) + ": use a whole number from −10 to 10.";
      if (d.bad && d.bad.kind === "dup") return "Zero " + (d.bad.i + 1) + " repeats zero " + (d.bad.j + 1) + ". To repeat a zero, use its order chip.";
      if (!d.zs.length) return "Fill at least one zero slot.";
      if (!d.k) return "Enter " + MV.m("k") + " as a fraction: whole numbers from 1 to 99 for p and q, and choose its sign.";
      return true;
    },
    checks:function(d){
      if (!d.zs.length) return [false, false, false, false];
      var deg = P.deg(d.zs), has = function(r){ return d.zs.some(function(z){ return z[0] === r; }); }, h = d.k ? q.mul(d.k, P.at(d.zs, Q(3))) : null;
      var inside = d.zs.some(function(z){ return z[0] > 0 && z[0] < 6; });
      return [deg === 3, has(0) && has(6), !!h && q.eq(h, Q(27)), !!h && !inside && h.n > 0];
    },
    tips:function(d, c){
      var T = MV.C.task, out = [], b3 = P.at(d.zs, Q(3)), h = q.mul(d.k, b3);
      if (!c[0]) out.push(fill(T.tips[0], [String(P.deg(d.zs))]));
      if (!c[1]) out.push(T.tips[1]);
      if (!c[2]) out.push(fill(T.tips[2], [vH(h), vH(b3)]));
      if (!c[3]) { var ins = d.zs.filter(function(z){ return z[0] > 0 && z[0] < 6; }); out.push(ins.length ? fill(T.tipInside, [num(ins[0][0])]) : T.tips[3]); }
      return out;
    },
    key:function(d){ return P.asc(d.zs).map(function(z){ return z[0] + ":" + z[1]; }).join(",") + "|" + d.k.n + "/" + d.k.d; },
    label:function(key){ var u = unkey(key); return MV.m(eqSrc(u.zs, u.k)); },
    text:function(key){ var u = unkey(key); return MV.plain(MV.m(eqSrc(u.zs, u.k))); }
  };
})();

var EX = null;
MV.module({
  hero:hero,
  explore:function(host, api){ EX = explore(host, api); return EX; },
  part3:part3,
  activities:{ member:member },
  task:task,
  summaryLines:function(){ var n = EX && EX.showCount ? EX.showCount() : 0; return ["Show the k that works used: " + n + " time" + (n === 1 ? "" : "s")]; }
});
})();
