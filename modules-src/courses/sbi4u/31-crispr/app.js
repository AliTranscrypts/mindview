// SBI4U 31 CRISPR Gene Editing: hero (phage → bacterial Cas cut → human nucleus), Cas9 targeting simulator (S5 pattern strip,
// display-only with no letters; Cas9 slider; cell panel; bacterial defence / genome editing / experiment modes), Should we?
// (four stations, S12 claim builder), toolkit sorter / mc / spot practice, "Plan an edit" (task).
// Scope (plan): concepts only. No sequences anywhere: matches are counts, targets are abstract colour patterns.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small helpers (from SBI4U 21) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "cr-st", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function poly(pts, cls){ return sv("polygon", { points:pts.map(function(p){ return f1(p[0]) + "," + f1(p[1]); }).join(" "), "class":cls }); }
function hexPts(cx, cy, r){ var p = []; for (var k = 0; k < 6; k++) { var a = (30 + 60 * k) * Math.PI / 180; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return p; }

// ---------- @component radioGroup (copied from SBI4U 21 / 15 / 08 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list), disable(b)}
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), off = false;
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, dis = x.dis || off, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (dis ? -1 : tab) + '" data-rg="' + x.id + '" data-k="rg' + x.id + '"' + (dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function firstFree(){ for (var i = 0; i < o.options.length; i++) if (!o.options[i].dis) return i; return 0; }
  function choose(id){ id = String(id); var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b || off) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); e.stopPropagation();
    var ids = o.options.filter(function(x){ return !x.dis; }).map(function(x){ return String(x.id); }); if (!ids.length) return;
    var i = ids.indexOf(String(b.dataset.rg)); choose(ids[(i + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ id = String(id == null ? "" : id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; },
    setOptions:function(list){ o.options = list; paint(); }, disable:function(b){ if (b !== off) { off = b; paint(); } } };
}

// ---------- @component switchBtn (from SBI4U 09 cc-swb / HFA4U 09) — role="switch" button with a visible On/Off word ----------
// switchBtn(host, {label, value, onChange(bool)}) -> {set(bool), disable(b)}
function switchBtn(host, o){
  var on = !!o.value, off = false;
  function paint(){
    var f = host.contains(document.activeElement);
    host.innerHTML = '<button type="button" class="cr-swb" role="switch" aria-checked="' + on + '" data-k="sw' + MV.esc(o.key || "") + '"' + (off ? " disabled" : "") + '><span>' + o.label + '</span> <b>' + (on ? "On" : "Off") + "</b></button>";
    if (f) { var b = host.querySelector("button"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  host.addEventListener("click", function(e){ var b = e.target.closest(".cr-swb"); if (!b || b.disabled) return; on = !on; paint(); if (o.onChange) o.onChange(on); });
  paint();
  return { set:function(v){ v = !!v; if (v !== on) { on = v; paint(); } }, disable:function(b){ if (b !== off) { off = b; paint(); } } };
}

// ---------- @component S5 patternStrip (display-only form; plan: abstract coloured squares, no letters, match shown as a count) ----------
// patCols(seed) -> 20 colour classes (cr-p0…cr-p3); misSet(seed, k) -> {position:true} for the 20 − k positions that don't pair.
function patCols(seed){ var r = MV.bio.rng("crp" + seed), a = []; for (var j = 0; j < 20; j++) a.push(r.int(4)); return a; }
function misSet(seed, k){
  var r = MV.bio.rng("crm" + seed), idx = [], j, s = {};
  for (j = 0; j < 20; j++) idx.push(j);
  for (j = 19; j > 0; j--) { var q = r.int(j + 1), t = idx[j]; idx[j] = idx[q]; idx[q] = t; }
  for (j = 0; j < 20 - k; j++) s[idx[j]] = true;
  return s;
}
// pattern(x0, y, h, cols) and guideRow(x0, y, h, mis) draw a row of 20 squares, 4.6 apart
function pattern(x0, y, h, cols){ var s = ""; for (var j = 0; j < 20; j++) s += sv("rect", { x:x0 + j * 4.6, y:y, width:4, height:h, "class":"cr-p cr-p" + cols[j] }); return s; }
function guideRow(x0, y, h, mis){ var s = ""; for (var j = 0; j < 20; j++) s += sv("rect", { x:x0 + j * 4.6 + (mis && mis[j] ? 0.5 : 0), y:y + (mis && mis[j] ? 0.5 : 0), width:mis && mis[j] ? 3 : 4, height:mis && mis[j] ? h - 1 : h, "class":"cr-g" + (mis && mis[j] ? " mis" : "") }); return s; }
function band(xa, xb, y1, y2, skip, op){
  var s = sv("line", { x1:xa, y1:y1, x2:xb, y2:y1, "class":"cr-s1", opacity:op }) + sv("line", { x1:xa, y1:y2, x2:xb, y2:y2, "class":"cr-s2", opacity:op });
  for (var x = xa + 6; x < xb - 3; x += 9) { if (skip && skip(x)) continue; s += sv("line", { x1:x, y1:y1 + 3, x2:x, y2:y2 - 3, "class":"cr-rung", opacity:op }); }
  return s;
}
function zig(x, y1, y2){ var d = "M" + x + " " + y1, n = 4, h = (y2 - y1) / n; for (var i = 1; i <= n; i++) d += " L" + (x + (i % 2 ? -5 : 5)) + " " + f1(y1 + h * i - (i === n ? 0 : 0)); return sv("path", { d:d, "class":"cr-cut" }); }
// Cas9 (an --ink-2 rounded shape) carrying its teal guide; open = guide lowered to pair with the target
function cas9(x, yTop, yBot, gy, mis, label){
  return sv("rect", { x:x - 50, y:yTop, width:100, height:yBot - yTop, rx:24, "class":"cr-cas" }) + guideRow(x - 46, gy, 9, mis) + (label ? txt(clamp(x, 84, 796), yTop - 8, label, "cr-cnt", "middle") : "");
}

// ---------- the genome strip (viewBox 880 × 190) ----------
var GX = [150, 270, 390, 510, 630, 750], REST = 52, BY1 = 108, BY2 = 136, SW = 880;
var PATS = GX.map(function(_, i){ return patCols("site" + i); });
function stripSVG(o){
  var h = "", i;
  h += sv("rect", { x:88, y:30, width:256, height:132, rx:10, "class":"cr-goi" }) + txt(96, 46, "gene of interest", "cr-glab");
  h += sv("rect", { x:452, y:30, width:130, height:132, rx:10, "class":"cr-genex" }) + txt(460, 46, "gene X", "cr-glab");
  h += band(16, 864, BY1, BY2, function(x){ return GX.some(function(g){ return Math.abs(x - g) < 50; }); });
  for (i = 0; i < 6; i++) {
    var g = GX[i], r = o.res[i], dec = i < o.k;
    h += pattern(g - 46, BY1 + 5, BY2 - BY1 - 10, PATS[i]);
    if (o.pam[i]) h += sv("rect", { x:g + 52, y:BY1 - 2, width:12, height:BY2 - BY1 + 4, rx:2, "class":"cr-pam" }) + txt(g + 58, BY1 - 7, "PAM", "cr-pamt", "middle");
    h += txt(g, 158, "T" + (i + 1), "cr-sl", "middle");
    if (dec) h += txt(g, 177, r.cut ? "cut" : !r.pam ? "no PAM" : r.k + " of 20", r.cut ? "cr-st cr-stc" : "cr-st", "middle");
    if (dec && r.cut) h += zig(g, 98, 146);
  }
  var x = o.cas, d = o.dock, open = d >= 0 && o.res[d].k >= 18;
  h += cas9(x, 70, 150, open ? 96 : 78, open ? misSet("site" + d, o.res[d].k) : null, d >= 0 ? o.res[d].k + " of 20" : "Cas9 + guide " + o.guide);
  return h;
}
// bacterial defence scene (same viewBox): phage outside, its DNA injected into the bacterium, the Cas complex with the chosen spacer's guide
var PHPAT = patCols("phage");
function bactSVG(f){
  var h = "", i;
  h += sv("rect", { x:190, y:24, width:520, height:156, rx:70, "class":"cr-bact" }) + txt(450, 172, "bacterium", "cr-st", "middle");
  for (i = 0; i < 3; i++) h += sv("rect", { x:300 + i * 38, y:38, width:30, height:16, rx:3, "class":"cr-spc" + (f.sp === i ? " on" : "") }) + txt(315 + i * 38, 50, String(i + 1), "cr-st", "middle");
  h += txt(420, 51, "stored spacers (from past viruses)", "cr-st");
  h += poly(hexPts(104, 100, 24), "cr-phage") + sv("line", { x1:128, y1:100, x2:188, y2:100, "class":"cr-tail" }) + sv("line", { x1:180, y1:100, x2:190, y2:88, "class":"cr-tail" }) + sv("line", { x1:180, y1:100, x2:190, y2:112, "class":"cr-tail" });
  h += txt(104, 144, "phage", "cr-st", "middle");
  if (f.p < 1) h += sv("path", { d:"M92 96 q6 -10 12 0 t12 0", "class":"cr-coil", opacity:f1(1 - f.p) });
  if (f.p > 0) {
    var xe = 200 + 460 * f.p, op = f.fade ? f1(1 - 0.75 * f.fade) : null;
    h += '<g' + (op != null ? ' opacity="' + op + '"' : "") + ">" + band(200, xe, 104, 128, function(x){ return x > 466 && x < 566; });
    if (xe > 566) h += pattern(470, 109, 14, PHPAT) + sv("rect", { x:568, y:102, width:12, height:28, rx:2, "class":"cr-pam" }) + txt(574, 97, "PAM", "cr-pamt", "middle");
    h += "</g>";
  }
  var open = f.dock && f.k >= 18;
  h += cas9(f.cx, 82, 150, open ? 92 : 86, open ? misSet("phage", f.k) : null, f.dock ? f.k + " of 20" : "Cas + guide from spacer " + (f.sp + 1));
  if (f.cut) h += zig(516, 96, 136);
  if (f.res) h += txt(330, 162, f.res, "cr-res", "middle");
  return h;
}
// ---------- cell panel (viewBox 880 × 150): the cut site up close, the template, and the protein of the gene of interest ----------
function cellSVG(c){
  var h = "", t = c.t, L = 40, R = 520, mid = 280, gap = 0;
  h += txt(20, 22, c.title, "cr-glab");
  if (c.kind === "none") h += band(L, R, 74, 98);
  else {
    gap = c.kind === "nhej" ? 26 * (1 - clamp(t / 0.7, 0, 1)) : 26;
    h += band(L, mid - gap / 2 - 13, 74, 98) + band(mid + gap / 2 + 13, R, 74, 98);
    if (gap === 0) { // NHEJ joined: one rung lost at the join
      h += sv("line", { x1:mid - 13, y1:74, x2:mid + 13, y2:74, "class":"cr-s1" }) + sv("line", { x1:mid - 13, y1:98, x2:mid + 13, y2:98, "class":"cr-s2" });
      h += poly([[mid, 104], [mid - 6, 114], [mid + 6, 114]], "cr-lost") + txt(mid, 130, "1 base lost", "cr-st", "middle");
    }
    if (c.kind === "hdr") {
      var ty = lerp(28, 58, clamp(t / 0.5, 0, 1)), fill = clamp((t - 0.5) / 0.5, 0, 1);
      h += sv("line", { x1:150, y1:ty, x2:410, y2:ty, "class":"cr-tpl" }) + txt(150, ty - 6, "template (matching arms on both sides)", "cr-st");
      var n = Math.round(4 * fill);
      for (var k = 0; k < n; k++) { var xx = mid - 13 - gap / 2 + 6 + k * ((gap + 26 - 12) / 3); h += sv("line", { x1:f1(xx), y1:77, x2:f1(xx), y2:95, "class":"cr-tplr" }); }
      if (fill > 0) h += sv("line", { x1:mid - 13 - gap / 2, y1:74, x2:f1(mid - 13 - gap / 2 + (gap + 26) * fill), y2:74, "class":"cr-tpl" }) + sv("line", { x1:mid - 13 - gap / 2, y1:98, x2:f1(mid - 13 - gap / 2 + (gap + 26) * fill), y2:98, "class":"cr-tpl" });
      if (t >= 1) h += txt(mid, 130, "gap filled by copying the template", "cr-st", "middle");
    }
    if (c.kind === "nhej" && c.tpl) {
      var dy = 30 * clamp(t, 0, 1);
      h += '<g opacity="' + f1(1 - 0.8 * clamp(t, 0, 1)) + '">' + sv("line", { x1:150, y1:28 - dy * 0.3, x2:410, y2:28 - dy * 0.3, "class":"cr-tpl" }) + "</g>" + txt(420, 30, "template unused", "cr-st");
    }
    if (c.kind === "open") h += txt(mid, 130, "cut", "cr-st", "middle");
  }
  // protein icon: ink (working), --ink-2 at 40 % (non-working), with a --pen bead where the template's change is (corrected)
  var pc = c.prot === "off" ? "cr-prot off" : "cr-prot", beads = [[600, 70], [622, 56], [646, 62], [664, 82], [688, 74], [708, 56], [732, 64], [748, 86], [770, 78]];
  h += sv("path", { d:"M" + beads.map(function(b){ return b[0] + " " + b[1]; }).join(" L"), "class":"cr-pchain" + (c.prot === "off" ? " off" : "") });
  beads.forEach(function(b, i){ h += sv("circle", { cx:b[0], cy:b[1], r:8, "class":c.prot === "fix" && i === 4 ? "cr-prot fix" : pc }); });
  h += txt(686, 118, "protein: " + (c.prot === "off" ? "non-working" : c.prot === "fix" ? "corrected" : "working"), "cr-st", "middle");
  return h;
}

// ---------- hero: phage injects DNA; a Cas–guide complex cuts it and it fades; cross-fade to a nucleus where Cas9 cuts a chromosome
// (storyboard, 4 s); reduced motion: the final frame only ----------
function hero(f){
  var box = $("#cr-hero"); if (!box) return;
  var cap = f && f.cap, CAPS = ["A virus (phage) injects its DNA into a bacterium.", "Bacteria do this to remember and destroy viruses.", "Scientists borrowed it."];
  function setCap(i){ if (cap && cap.textContent !== CAPS[i]) cap.textContent = CAPS[i]; }
  function cplx(x, y, dock){ return sv("ellipse", { cx:x, cy:y, rx:34, ry:22, "class":"cr-cas" }) + (function(){ var s = ""; for (var j = 0; j < 8; j++) s += sv("rect", { x:x - 20 + j * 5, y:dock ? y - 4 : y - 13, width:4, height:6, "class":"cr-g" }); return s; })(); }
  function helix(x0, x1, y, amp, cut){
    var a = [], b = [], s = "";
    for (var x = x0; x <= x1; x += 4) { var th = (x - x0) / 60 * 2 * Math.PI; a.push(x + " " + f1(y - amp * Math.cos(th))); b.push(x + " " + f1(y + amp * Math.cos(th))); }
    for (var r = x0 + 5; r < x1; r += 10) { if (cut && Math.abs(r - cut) < 6) continue; var t2 = (r - x0) / 60 * 2 * Math.PI; s += sv("line", { x1:r, y1:f1(y - amp * Math.cos(t2)), x2:r, y2:f1(y + amp * Math.cos(t2)), "class":"cr-rung" }); }
    s += sv("path", { d:"M" + a.join(" L"), "class":"cr-hs1" }) + sv("path", { d:"M" + b.join(" L"), "class":"cr-hs2" });
    if (cut) s += sv("rect", { x:cut - 5, y:y - amp - 4, width:10, height:2 * amp + 8, "class":"cr-gap" });
    return s;
  }
  function draw(t){
    var h = "", a = t < 2 ? 1 : t < 2.6 ? 1 - (t - 2) / 0.6 : 0, b = 1 - a;
    if (a > 0) {
      var pI = clamp(t / 0.9, 0, 1), fade = clamp((t - 1.5) / 0.5, 0, 1), cx = lerp(90, 232, clamp((t - 0.9) / 0.5, 0, 1)), dock = t >= 1.4;
      h += '<g opacity="' + f1(a) + '">' + sv("rect", { x:40, y:92, width:320, height:150, rx:72, "class":"cr-bact" });
      h += poly(hexPts(200, 32, 20), "cr-phage") + sv("line", { x1:200, y1:52, x2:200, y2:92, "class":"cr-tail" }) + sv("line", { x1:200, y1:88, x2:188, y2:98, "class":"cr-tail" }) + sv("line", { x1:200, y1:88, x2:212, y2:98, "class":"cr-tail" });
      if (pI > 0) {
        var w = 110 * pI;
        h += '<g opacity="' + f1(1 - 0.85 * fade) + '">' + band(200 - w, 200 + w, 160, 176, pI >= 1 ? function(x){ return x > 182 && x < 280; } : null) + (pI >= 1 ? pattern(186, 163, 10, PHPAT) + sv("rect", { x:281, y:157, width:8, height:22, rx:2, "class":"cr-pam" }) : "") + "</g>";
        if (pI < 1) h += sv("line", { x1:200, y1:94, x2:200, y2:160, "class":"cr-tail" });
      }
      if (t >= 0.9) h += cplx(cx, 168, dock);
      if (t >= 1.5) h += zig(232, 148, 188);
      h += "</g>";
    }
    if (b > 0) {
      var cx2 = lerp(80, 200, clamp((t - 2.6) / 0.6, 0, 1)), cut = t >= 3.3;
      h += '<g opacity="' + f1(b) + '">' + sv("circle", { cx:200, cy:140, r:112, "class":"cr-nuc" }) + txt(200, 48, "human cell nucleus", "cr-st", "middle");
      h += helix(76, 324, 150, 14, cut ? 200 : 0);
      h += sv("rect", { x:238, y:130, width:12, height:40, rx:2, "class":"cr-pam" }) + txt(244, 124, "PAM", "cr-pamt", "middle");
      h += sv("rect", { x:cx2 - 34, y:122, width:68, height:56, rx:22, "class":"cr-cas" });
      for (var j = 0; j < 10; j++) h += sv("rect", { x:cx2 - 25 + j * 5, y:cut || t >= 3.2 ? 141 : 128, width:4, height:7, "class":"cr-g" });
      h += txt(cx2, 194, "Cas9", "cr-glab", "middle") + txt(cx2 - 40, 112, "guide RNA", "cr-gt");
      if (cut) h += zig(200, 128, 172);
      h += "</g>";
    }
    box.innerHTML = '<svg viewBox="0 0 400 260" class="cr-svg cr-hsvg" aria-hidden="true" focusable="false">' + h + "</svg>";
  }
  if (MV.reduceMotion) { draw(4); setCap(2); return; }
  draw(0); setCap(0);
  setTimeout(function(){
    MV.tween({ dur:4000, ease:lin, step:function(k){ var t = k * 4; draw(t); setCap(t < 1.5 ? 0 : t < 2.6 ? 1 : 2); }, done:function(){ draw(4); setCap(2); } });
  }, 700);
}

// ---------- Explore: Cas9 targeting simulator ----------
var EXF = null;
function explore(host, api){
  var S = api.S, X = api.content, SITES = X.sites;
  if (!S.mode) S.mode = "edit";
  if (!S.guide) S.guide = "A";
  S.tpl = !!S.tpl;
  if (!S.cell) S.cell = "div";
  if (!S.pam) S.pam = X.pam.slice();
  if (S.sp == null) S.sp = 1;
  S.k = S.k || 0; S.bk = S.bk || 0; S.runs = S.runs || []; S.runN = S.runN || 0;
  if (S.x3pred == null) S.x3pred = ""; if (S.x3run == null) S.x3run = "";
  if (S.sel == null) S.sel = -1;
  var disp = null, anim = null, timer = null, busy = false, playing = false, pend = null, rep = null;

  host.innerHTML = '<div class="pg cr-pg cr-ex"><div class="pg-graph" data-mv="graph"><div class="cr-row" id="cr-mode"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="cr-scroll" id="cr-scroll"><div class="cr-stage"><svg class="cr-svg" id="cr-ssvg" viewBox="0 0 880 190" role="img" focusable="false"></svg><div class="cr-ov" id="cr-ov" role="group" aria-label="Sites T1 to T6"></div></div></div>' +
      '<p class="tiny muted cr-hint" id="cr-sinfo"></p>' +
      '<div class="cr-cellp" id="cr-cellp"><svg class="cr-svg" id="cr-csvg" viewBox="0 0 880 150" role="img" focusable="false"></svg></div><p class="cr-cap" id="cr-cap"></p>' +
      '<ul class="cr-key" aria-label="Colour key"><li><i class="cr-sw cr-swg"></i>guide RNA</li><li><i class="cr-sw cr-swp"></i>PAM tag</li><li><i class="cr-sw cr-swc"></i>Cas9</li><li><i class="cr-sw cr-swt"></i>template</li><li><i class="cr-sw cr-swh"></i>gene of interest</li></ul>' +
      '<p class="vh" id="cr-live" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div class="cr-panel" id="cr-ectl"><div class="cr-row" id="cr-guide"></div><div class="cr-row" id="cr-tpl"></div><div class="cr-row" id="cr-cell"></div></div>' +
      '<div class="cr-panel" id="cr-bctl"><div class="cr-row" id="cr-sp"></div><p class="tiny muted">The phage is destroyed only if its DNA matches the loaded spacer’s guide and has a PAM.</p></div>' +
      '<div class="cr-panel" id="cr-xctl"><h4 class="cr-h">Site switches</h4><div class="cr-pams" id="cr-pams"></div>' +
        '<h4 class="cr-h">Challenge 3: your prediction for Guide C</h4><div id="cr-x3"></div></div>' +
      '<div class="player cr-player" role="group" aria-label="Search controls"><button type="button" class="btn primary sm" id="cr-run" data-k="crrun">Run search</button><button type="button" class="btn ghost sm" id="cr-step" data-k="crstep">Step</button><button type="button" class="btn ghost sm" id="cr-reset" data-k="crreset">Reset</button></div>' +
      '<details class="cr-about"><summary>About this model <span class="bio-model">Model</span></summary>' + X.about + "</details>" +
      '<div id="cr-runs"></div></div>' +
    '<div class="pg-read"><dl class="read" id="cr-read"></dl><div id="cr-mt"></div></div></div>';
  var ssvg = $("#cr-ssvg", host), csvg = $("#cr-csvg", host), ov = $("#cr-ov", host);
  var modeR = radios($("#cr-mode", host), { label:"Mode", options:[{ id:"bact", t:"Bacterial defence" }, { id:"edit", t:"Genome editing" }, { id:"exp", t:"Experiment" }], value:S.mode, onChange:function(v){ S.mode = v; reset(); } });
  var guideR = radios($("#cr-guide", host), { label:"Guide", options:["A", "B", "C"].map(function(g){ return { id:g, t:"Guide " + g }; }), value:S.guide, onChange:function(v){ S.guide = v; reset(); } });
  var tplS = switchBtn($("#cr-tpl", host), { label:"Template supplied:", key:"tpl", value:S.tpl, onChange:function(v){ S.tpl = v; reset(); } });
  var cellR = radios($("#cr-cell", host), { label:"Cell type", cls:"chips", options:[{ id:"div", t:"Dividing body cells" }, { id:"non", t:"Non-dividing body cells (e.g. mature nerve cells)" }], value:S.cell, onChange:function(v){ S.cell = v; reset(); } });
  var spR = radios($("#cr-sp", host), { label:"Load the guide from spacer", options:[0, 1, 2].map(function(i){ return { id:i, t:String(i + 1) }; }), value:S.sp, onChange:function(v){ S.sp = +v; reset(); } });
  var C3 = byId(X.challenges, "tc3");
  var x3R = radios($("#cr-x3", host), { aria:"Prediction for Guide C", cls:"chips", options:C3.chips.map(function(c){ return { id:c.id, t:c.t }; }), value:S.x3pred, onChange:function(v){ S.x3pred = v; api.save(); MV.changed(); } });
  var pamS = SITES.map(function(s, i){
    var d = document.createElement("div"); $("#cr-pams", host).appendChild(d);
    return switchBtn(d, { label:s.id + " PAM:", key:"pam" + i, value:!!S.pam[i], onChange:function(v){ S.pam[i] = v ? 1 : 0; reset(); } });
  });
  ov.innerHTML = GX.map(function(g, i){ return '<button type="button" class="cr-sb" data-site="' + i + '" data-k="site' + i + '" style="left:' + f1((g - 52) / SW * 100) + "%;top:" + f1(96 / 190 * 100) + "%;width:" + f1(118 / SW * 100) + "%;height:" + f1(72 / 190 * 100) + '%"></button>'; }).join("");

  // ---- model (plan rules 1–3) ----
  function pams(){ return S.mode === "exp" ? S.pam : X.pam; }
  function model(){
    var m = X.match[S.guide], P = pams(), res = SITES.map(function(s, i){
      var p = !!P[i], k = m[i], cut = p && k >= 18;
      return { i:i, id:s.id, pam:p, k:k, cut:cut, gene:s.gene,
        why:!p ? "no PAM: not cut" : k === 20 ? "20 of 20 match and PAM: cut" : k >= 18 ? k + " of 20 match and PAM: cut (off-target risk)" : k + " of 20 match: not cut" };
    });
    var cuts = res.filter(function(r){ return r.cut; }), hdr = S.tpl && S.cell === "div", goi = "unchanged", other = [];
    cuts.forEach(function(r){
      r.out = hdr ? "precise change" : r.gene ? "gene disrupted" : "change outside the gene";
      if (r.gene === "goi") goi = hdr ? "precise change" : "disrupted";
      else if (r.gene === "x") other.push("gene X (" + r.id + ")");
    });
    return { res:res, cuts:cuts.map(function(r){ return r.id; }), cutRes:cuts, rep:cuts.length ? (hdr ? "HDR" : "NHEJ") : "", goi:goi, other:other };
  }
  function pamDefault(){ return S.pam.every(function(v, i){ return !!v === !!X.pam[i]; }); }
  function bMatch(){ return X.spacers[S.sp]; }

  // ---- painting ----
  function casX(){ return disp ? disp.x : S.k === 0 ? REST : GX[Math.min(S.k, 6) - 1]; }
  function paintStrip(){
    if (S.mode === "bact") {
      var f = disp && disp.b ? disp.b : bFrame(S.bk, 1);
      ssvg.innerHTML = bactSVG(f);
      ssvg.setAttribute("aria-label", "A bacterium with stored spacers 1 to 3, and a phage outside it. " + (S.bk === 0 ? "The phage has not injected its DNA yet." : "The phage’s DNA is inside the bacterium, with a target pattern and a PAM beside it.") + " The Cas complex carries the guide from spacer " + (S.sp + 1) + "." + (S.bk >= 2 ? " Match: " + bMatch() + " of 20." : "") + (S.bk === 3 ? " " + bResult() + "." : ""));
      return;
    }
    var M = model();
    ssvg.innerHTML = stripSVG({ res:M.res, k:S.k, pam:pams(), cas:casX(), dock:disp && disp.dock != null ? disp.dock : -1, guide:S.guide });
    var P = pams();
    ssvg.setAttribute("aria-label", "Genome strip with sites T1 to T6. The gene of interest is shaded over T1 and T2; gene X surrounds T4. PAM tags at " + SITES.filter(function(s, i){ return P[i]; }).map(function(s){ return s.id; }).join(", ") + ". Cas9 with Guide " + S.guide + (S.k === 0 ? " waits at the left end." : " has checked " + Math.min(S.k, 6) + " sites; cut: " + (cutSoFar(M).join(", ") || "none") + "."));
  }
  function cutSoFar(M){ return M.res.filter(function(r){ return r.i < S.k && r.cut; }).map(function(r){ return r.id; }); }
  function mainCut(M){ var g = M.cutRes.filter(function(r){ return r.gene === "goi"; })[0]; return g || M.cutRes[0]; }
  function paintCell(){
    if (S.mode === "bact") return;
    var M = model(), c = { t:1, tpl:S.tpl, prot:"on" }, mc = mainCut(M), cap = "";
    if (S.k < 6 || (S.k === 6 && !rep)) {
      var any = cutSoFar(M);
      c.kind = any.length ? "open" : "none"; c.title = any.length ? "Cell panel: the cut at " + any[0] + " waits for repair" : "Cell panel: DNA at the target";
      cap = S.k === 0 ? "Run the search (or Step) to see where Cas9 cuts and what the cell does." : S.k < 6 ? "Searching… " + Math.min(S.k, 6) + " of 6 sites checked." : "Search done. Step once more to see the repair.";
    } else {
      var t = rep ? rep.t : 1;
      if (!mc) { c.kind = "none"; c.title = "Cell panel: no cut, so nothing to repair"; cap = "Nothing was cut, so the DNA is unchanged."; }
      else {
        c.kind = M.rep === "HDR" ? "hdr" : "nhej"; c.t = t; c.title = "Cell panel: repair at " + mc.id + " (" + M.rep + ")";
        if (M.goi === "disrupted" && t >= 0.7) c.prot = "off";
        if (M.goi === "precise change" && t >= 1) c.prot = "fix";
        cap = M.cutRes.map(function(r){ return r.id + ": " + r.out; }).join(" · ") + ". " + (M.rep === "HDR" ? "HDR copied the template. Cas9 only cut." : "NHEJ joined the ends, losing a base." + (S.tpl ? " HDR works mainly in dividing cells, so the template went unused." : ""));
      }
      if (!rep) cap += " " + X.aha;
    }
    csvg.innerHTML = cellSVG(c);
    csvg.setAttribute("aria-label", MV.plain(c.title + ". Protein from the gene of interest: " + (c.prot === "off" ? "non-working" : c.prot === "fix" ? "corrected" : "working") + "."));
    $("#cr-cap", host).innerHTML = cap;
  }
  function bResult(){ return bMatch() >= 18 ? "Phage destroyed" : "Phage survives"; }
  function paintRead(){
    var rows;
    if (S.mode === "bact") {
      rows = [["Spacer loaded", String(S.sp + 1)], ["Match with the phage’s DNA", S.bk >= 2 ? bMatch() + " of 20" : "—"], ["PAM next to the phage’s target", S.bk >= 1 ? "yes" : "—"], ["Result", S.bk === 3 ? "<strong>" + bResult() + "</strong>" : "—"]];
      $("#cr-mt", host).innerHTML = "";
    } else {
      var M = model(), dec = M.res.filter(function(r){ return r.i < S.k; }), done = S.k >= 7;
      rows = [["Guide loaded", S.guide], ["Sites checked", String(Math.min(S.k, 6))], ["Sites cut", S.k ? (cutSoFar(M).join(", ") || "none") : "—"],
        ["Why each site was or wasn’t cut", dec.length ? '<ul class="cr-why">' + dec.map(function(r){ return "<li>" + r.id + ": " + r.why + "</li>"; }).join("") + "</ul>" : '<span class="muted">Run the search.</span>'],
        ["Repair", done ? (M.rep || "none: nothing was cut") : "—"], ["Gene of interest", done ? M.goi : "—"], ["Other genes changed", done ? (M.other.join(", ") || "none") : "—"]];
      var P = pams(), m = X.match[S.guide];
      $("#cr-mt", host).innerHTML = '<h4 class="cr-h">Match list: Guide ' + S.guide + '</h4><table class="cr-tbl cr-mt"><thead><tr><th scope="col">Site</th><th scope="col">Match</th><th scope="col">PAM</th><th scope="col">Location</th></tr></thead><tbody>' +
        SITES.map(function(s, i){ return '<tr><th scope="row">' + s.id + '</th><td data-h="Match">' + m[i] + ' of 20</td><td data-h="PAM">' + (P[i] ? "yes" : "no") + '</td><td data-h="Location">' + s.where + "</td></tr>"; }).join("") + "</tbody></table>";
    }
    $("#cr-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintRuns(){
    var box = $("#cr-runs", host);
    if (S.mode !== "exp") { box.innerHTML = ""; return; }
    box.innerHTML = '<h4 class="cr-h">Results table (Experiment runs)</h4>' + (S.runs.length ? '<div class="tbl-wrap"><table class="cr-tbl"><thead><tr><th scope="col">Run</th><th scope="col">Settings</th><th scope="col">Sites cut</th><th scope="col">Outcome</th></tr></thead><tbody>' +
      S.runs.map(function(r){ return '<tr><th scope="row">' + r.n + "</th><td>Guide " + r.g + "; PAM off: " + (r.off.join(", ") || "none") + "; template " + (r.tpl ? "on" : "off") + "; " + (r.cell === "div" ? "dividing" : "non-dividing") + "</td><td>" + (r.cuts.join(", ") || "none") + "</td><td>" + (r.rep ? r.rep + "; gene of interest " + r.goi + "; other genes: " + (r.other.join(", ") || "none") : "no cut") + "</td></tr>"; }).join("") +
      '</tbody></table></div><div class="q-actions"><button type="button" class="btn ghost sm" data-act="clear" data-k="crclear">Clear table</button></div>' : '<p class="tiny muted">Each finished run (search and repair) adds a row here, so you can compare runs side by side.</p>');
  }
  function paintSiteInfo(){
    var el = $("#cr-sinfo", host);
    if (S.mode === "bact" || S.sel < 0) { el.textContent = S.mode === "bact" ? "" : "Tap a site (or tab to it) for its details. On a narrow screen, scroll the strip sideways."; return; }
    var s = SITES[S.sel], i = S.sel, P = pams();
    el.textContent = s.id + ": " + s.where + "; PAM " + (P[i] ? "yes" : "no") + "; Guide " + S.guide + " matches " + X.match[S.guide][i] + " of 20.";
  }
  function labelSites(){
    var P = pams();
    $$(".cr-sb", ov).forEach(function(b, i){ b.setAttribute("aria-label", SITES[i].id + ", " + SITES[i].where + ", PAM " + (P[i] ? "yes" : "no") + ", Guide " + S.guide + " matches " + X.match[S.guide][i] + " of 20"); b.setAttribute("aria-pressed", String(S.sel === i)); });
    ov.hidden = S.mode === "bact";
  }
  function paintCtl(){
    $("#cr-ectl", host).hidden = S.mode === "bact"; $("#cr-bctl", host).hidden = S.mode !== "bact"; $("#cr-xctl", host).hidden = S.mode !== "exp";
    $("#cr-cellp", host).hidden = S.mode === "bact"; $("#cr-cap", host).hidden = S.mode === "bact";
    $("#cr-run", host).textContent = S.mode === "bact" ? "Run infection" : "Run search";
    modeR.set(S.mode); guideR.set(S.guide); tplS.set(S.tpl); cellR.set(S.cell); spR.set(S.sp); x3R.set(S.x3pred);
    pamS.forEach(function(p, i){ p.set(!!S.pam[i]); });
  }
  function sync(){
    var lock = busy || playing || !!pend, done = S.mode === "bact" ? S.bk >= 3 : S.k >= 7;
    $("#cr-run", host).disabled = lock || done; $("#cr-step", host).disabled = lock || done; $("#cr-reset", host).disabled = !!pend || (busy && !playing);
    [modeR, guideR, cellR, spR, x3R, tplS].concat(pamS).forEach(function(c){ c.disable(lock); });
    host.dataset.busy = lock ? "1" : "0";
  }
  function paintAll(){ paintCtl(); paintStrip(); paintCell(); paintRead(); paintRuns(); paintSiteInfo(); labelSites(); sync(); }
  function say(t){ var L = $("#cr-live", host); L.textContent = ""; setTimeout(function(){ L.textContent = MV.plain(t); }, 30); }
  function stop(){
    playing = false;
    if (anim) { anim(); anim = null; } if (timer) { clearTimeout(timer); timer = null; }
    disp = null; rep = null; busy = false;
    if (pend) { if (S.mode === "bact") S.bk = 3; else { S.k = 7; } var d = pend; pend = null; api.save(); paintAll(); d(); }
  }
  function reset(){ stop(); S.k = 0; S.bk = 0; api.save(); paintAll(); MV.changed(); }

  // ---- one step of the search (Cas9 slides to the next site, pauses at a PAM, cuts if the match is ≥ 18), then the repair ----
  function step(cb){
    if (busy) return;
    if (S.mode === "bact") return stepB(cb);
    if (S.k >= 7) { if (cb) cb(); return; }
    var M = model();
    busy = true; sync();
    if (S.k < 6) {
      var i = S.k, r = M.res[i], from = casX(), to = GX[i];
      anim = MV.tween({ dur:260 + Math.abs(to - from) * 2.2, ease:MV.ease, step:function(t){ disp = { x:lerp(from, to, t), dock:-1 }; paintStrip(); }, done:function(){
        anim = null;
        if (r.pam) { disp = { x:to, dock:i }; paintStrip(); timer = MV.wait(r.cut ? 750 : 500, fin); } else fin();
      } });
      function fin(){
        timer = null; disp = null; S.k = i + 1;
        if (S.k === 6 && S.mode === "exp" && S.guide === "C" && pamDefault()) S.x3run = S.x3pred || "-";
        api.save(); busy = false; paintAll(); say(r.id + ": " + r.why + "."); MV.changed(); if (cb) cb();
      }
    } else {
      rep = { t:0 };
      anim = MV.tween({ dur:M.cuts.length ? 1600 : 200, ease:lin, step:function(t){ rep.t = t; S.k = 6; paintCellRep(); }, done:function(){
        anim = null; rep = null; S.k = 7;
        if (S.mode === "exp") { S.runN++; S.runs.push({ n:S.runN, g:S.guide, off:SITES.filter(function(s, j){ return !S.pam[j]; }).map(function(s){ return s.id; }), tpl:S.tpl, cell:S.cell, cuts:M.cuts, rep:M.rep, goi:M.goi, other:M.other }); if (S.runs.length > 8) S.runs.shift(); }
        api.save(); busy = false; paintAll();
        say(M.rep ? "Repair: " + M.rep + ". Gene of interest: " + M.goi + ". Other genes changed: " + (M.other.join(", ") || "none") + "." : "Nothing was cut, so there is nothing to repair.");
        MV.changed(); if (cb) cb();
      } });
    }
  }
  function paintCellRep(){ var k = S.k; S.k = 7; paintCell(); S.k = k; }
  // bacterial defence: 0 ready → 1 phage DNA injected → 2 Cas complex docks on the phage target → 3 destroyed or survives
  function bFrame(bk, t){
    var k = bMatch(), f = { sp:S.sp, k:k, p:0, cx:290, dock:false, cut:false, fade:0, res:"" };
    if (bk >= 1) f.p = bk === 1 ? t : 1;
    if (bk === 2) { f.cx = lerp(290, 516, t); f.dock = t >= 1; }
    if (bk === 3) {
      if (k >= 18) { f.cx = 516; f.dock = true; f.cut = true; f.fade = t; f.res = t >= 1 ? "phage destroyed" : ""; }
      else { f.cx = lerp(516, 290, t); f.res = t >= 1 ? "phage survives" : ""; }
    }
    return f;
  }
  function stepB(cb){
    if (S.bk >= 3) { if (cb) cb(); return; }
    var nb = S.bk + 1; busy = true; sync();
    anim = MV.tween({ dur:nb === 1 ? 1000 : nb === 2 ? 800 : 900, ease:nb === 1 ? lin : MV.ease, step:function(t){ disp = { b:bFrame(nb, t) }; paintStrip(); }, done:function(){
      anim = null;
      timer = MV.wait(nb === 2 ? 450 : 0, function(){
        timer = null; disp = null; S.bk = nb; api.save(); busy = false; paintAll();
        say(nb === 1 ? "The phage injects its DNA into the bacterium." : nb === 2 ? "The guide from spacer " + (S.sp + 1) + " matches the phage’s DNA at " + bMatch() + " of 20, beside a PAM." : bResult() + ".");
        MV.changed(); if (cb) cb();
      });
    } });
  }
  function runAll(cb){
    playing = true; sync();
    (function next(){
      if (!playing) return;
      if (S.mode === "bact" ? S.bk >= 3 : S.k >= 7) { playing = false; sync(); if (cb) cb(); return; }
      step(function(){ timer = MV.wait(160, next); });
    })();
  }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.id === "cr-run") { runAll(); return; }
    if (b.id === "cr-step") { step(); return; }
    if (b.id === "cr-reset") { reset(); return; }
    if (b.dataset.act === "clear") { S.runs = []; api.save(); paintRuns(); var r = $("#cr-run", host); if (r && !r.disabled) r.focus(); return; }
    if (b.dataset.site != null) { S.sel = +b.dataset.site; api.save(); paintSiteInfo(); labelSites(); }
  });

  // ---- challenges (plan: exact tests and named wrong states) ----
  function chal(id){
    var C = byId(X.challenges, id), m = C.msgs, M = model();
    if (id === "tc1" || id === "tc2") {
      if (S.mode === "bact") return { ok:false, msg:m.mode };
      if (S.guide === "B") return { ok:false, msg:m.guideB };
      if (S.guide === "C") return { ok:false, msg:m.guideC };
      if (id === "tc1") {
        if (S.tpl && S.cell === "div") return { ok:false, msg:m.tplDiv };
        if (S.tpl) return { ok:false, msg:m.tplNon };
      } else {
        if (!S.tpl) return { ok:false, msg:m.noTpl };
        if (S.cell !== "div") return { ok:false, msg:m.non };
      }
      if (M.cuts.join(",") !== "T1") return { ok:false, msg:m.sites };
      return { ok:true };
    }
    if (id === "tc3") {
      if (S.tpl) return { ok:false, msg:m.tpl };
      if (S.mode !== "exp") return { ok:false, msg:m.mode };
      if (S.guide !== "C") return { ok:false, msg:m.guide };
      if (S.pam[2]) return { ok:false, msg:m.t3 };
      if (!S.x3pred) return { ok:false, msg:m.pred };
      if (!S.x3run) return { ok:false, msg:m.run };
      if (S.x3run === "-") return { ok:false, msg:m.pred + " Then run it again with the original switches." };
      var ch = byId(C.chips, S.x3run);
      if (!ch || !MV.ok(ch)) return { ok:false, msg:m.predWrong + (ch && ch.fb ? " " + ch.fb : "") };
      var diff = S.pam.map(function(v, i){ return !!v !== !!X.pam[i] ? i : -1; }).filter(function(i){ return i >= 0; });
      if (!diff.length) return { ok:false, msg:m.zero };
      if (diff.length > 1) return { ok:false, msg:m.many };
      if (diff[0] === 3) return { ok:true };
      return { ok:false, msg:m.other };
    }
    return { ok:false };
  }

  EXF = { show:function(v){ if (!v) stop(); else paintAll(); } };
  paintAll();
  return {
    predict:{
      start:function(p){
        stop();
        S.mode = "edit"; S.guide = p.start.guide; S.tpl = !!p.start.tpl; S.cell = p.start.cell; S.k = 0; S.bk = 0;
        api.save(); paintAll(); MV.changed();
      },
      run:function(p, done){
        pend = done; sync();
        runAll(function(){ var d = pend; pend = null; sync(); paintAll(); MV.changed(); if (d) d(); });
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: Should we? (four stations, one at a time) ----------
function part3(host, api){
  var S = api.S, P = MV.C.part3, ST = P.stations, CARDS = ST[0].cards;
  if (!S.cur) S.cur = "s1";
  S.st = S.st || {};
  function st(id){ return S.st[id] || (S.st[id] = { placed:{}, seen:{}, pick:{}, ch:{} }); }
  host.innerHTML = '<div class="cr-p3"><div class="cr-row" id="cr-nav"></div><div id="cr-stn" class="cr-stn"></div></div>';
  var nav = radios($("#cr-nav", host), { label:"Station", cls:"chips", options:navOpts(), value:S.cur, onChange:function(v){ S.cur = v; api.save(); paint(true); } });
  function navOpts(){ return ST.map(function(s){ return { id:s.id, t:(st(s.id).done ? "✓ " : "") + s.n + " " + s.t }; }); }
  function fb(x){ return x.msg ? MV.fbHTML(x.msgK || "", x.msg) : ""; }
  function body(s){
    var x = st(s.id), h = "";
    if (s.id === "s1") {
      var left = s.cards.filter(function(c){ return !x.placed[c.id]; });
      h += '<p class="tiny"><strong>Cards</strong></p><div class="cr-cards1" role="group" aria-label="Cards to sort">' + (left.length ? left.map(function(c){ return '<button type="button" class="cr-card" data-card="' + c.id + '" data-k="cd' + c.id + '" aria-pressed="' + (x.sel === c.id) + '">' + c.t + "</button>"; }).join("") : '<p class="tiny muted">All five cards are sorted.</p>') + "</div>" +
        '<div class="cr-bins" role="group" aria-label="Bins">' + s.bins.map(function(bn){
          var inBin = s.cards.filter(function(c){ return x.placed[c.id] === bn.id; });
          return '<div class="cr-binw"><button type="button" class="cr-bin" data-bin="' + bn.id + '" data-k="bn' + bn.id + '"' + (x.done ? " disabled" : "") + "><strong>" + bn.t + "</strong>" + (bn.sub ? '<span class="tiny muted"> (' + bn.sub + ")</span>" : "") + "</button>" +
            '<ul class="cr-binl">' + inBin.map(function(c){ return "<li>✓ " + c.t + "</li>"; }).join("") + "</ul></div>";
        }).join("") + "</div>" + fb(x);
    } else if (s.id === "s2") {
      h += s.cases.map(function(c){ return '<details class="cr-case" data-case="' + c.id + '"' + (x.seen[c.id] ? " open" : "") + "><summary><strong>" + c.t + "</strong>" + (x.seen[c.id] ? ' <span class="cr-tag">' + c.tag + "</span>" : "") + "</summary><p>" + c.text + '</p><p class="tiny"><strong>Zoom to the molecules:</strong> ' + c.zoom + "</p></details>"; }).join("") +
        (x.done ? MV.fbHTML("good", "<strong>✓ All three cases read.</strong> Somatic, not human, germline: the same tool, very different questions.") : '<p class="tiny muted">Open all three cases to finish this station.</p>');
    } else if (s.id === "s3") {
      h += '<p class="cr-law">' + s.text + '</p><p><strong>' + s.ask + '</strong></p><div class="chips" role="group" aria-label="Station 1 cards">' + CARDS.map(function(c){ var on = !!x.pick[c.id]; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-pick="' + c.id + '" data-k="pk' + c.id + '"' + (x.done ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>" +
        (x.done ? "" : '<div class="q-actions"><button type="button" class="btn primary sm" data-act="lawcheck" data-k="lawcheck">Check</button></div>') + fb(x);
    } else if (s.id === "s4") {
      h += s.groups.map(function(g){ return '<div class="cr-row" data-grp="' + g.id + '"></div>'; }).join("");
      var full = s.groups.every(function(g){ return x.ch[g.id]; });
      if (full) {
        var t = function(gid){ var g = byId(s.groups, gid); return byId(g.chips, x.ch[gid]); }, B = t("ben"), R = t("risk"), Cn = t("cond");
        h += '<div class="cr-claim"><p><strong>Your claim:</strong> The medical therapy offers a real benefit: ' + B.t + ". But " + R.t + ". So it should be used only if " + Cn.t + ".</p></div>" +
          MV.fbHTML("good", "<strong>✓ A complete claim.</strong> You weighed one benefit (" + B.t + ") against one risk (" + R.t + ") and set a condition (" + Cn.t + "). People can weigh the same evidence differently; what counts is that your claim names its evidence. Try other chips to see a different claim.") +
          '<p class="tiny cr-zoom"><strong>Zoom to the molecules:</strong> ' + R.zoom + "</p>";
      } else h += '<p class="tiny muted">' + s.need + "</p>";
    }
    return h;
  }
  function paint(focusTop){
    var s = byId(ST, S.cur), x = st(s.id), box = $("#cr-stn", host);
    MV.keepFocus(box, function(){
      box.innerHTML = '<h3 class="cr-sth">Station ' + s.n + ": " + s.t + "</h3>" + (s.id !== "s3" ? "<p>" + s.text + "</p>" : "") + '<div class="cr-data">' + body(s) + "</div>" +
        '<div class="q-actions cr-snav"><button type="button" class="btn ghost sm" data-act="sprev" data-k="sprev"' + (s.n === 1 ? " disabled" : "") + '>Previous station</button><button type="button" class="btn ' + (x.done ? "primary" : "ghost") + ' sm" data-act="snext" data-k="snext"' + (s.n === ST.length ? " disabled" : "") + ">Next station</button></div>";
    });
    if (s.id === "s4") s.groups.forEach(function(g){
      radios($('[data-grp="' + g.id + '"]', box), { label:g.t, cls:"chips", options:g.chips.map(function(c){ return { id:c.id, t:c.t }; }), value:x.ch[g.id] || "",
        onChange:function(v){ x.ch[g.id] = v; if (s.groups.every(function(q){ return x.ch[q.id]; })) x.done = true; api.save(); paint(); var b = $('[data-grp="' + g.id + '"] [data-rg="' + v + '"]', box); if (b) b.focus({ preventScroll:true }); } });
    });
    nav.setOptions(navOpts()); nav.set(S.cur);
    if (focusTop === true) { var hh = $(".cr-sth", box); hh.setAttribute("tabindex", "-1"); hh.focus({ preventScroll:true }); }
  }
  host.addEventListener("toggle", function(e){
    var d = e.target; if (!d || !d.dataset || !d.dataset.case || !d.open) return;
    var s = byId(ST, "s2"), x = st("s2");
    if (x.seen[d.dataset.case]) return;
    x.seen[d.dataset.case] = true; if (s.cases.every(function(c){ return x.seen[c.id]; })) x.done = true; api.save(); paint();
    var sm = $('[data-case="' + d.dataset.case + '"] summary', host); if (sm) sm.focus({ preventScroll:true });
  }, true);
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest(".rg")) return;
    var s = byId(ST, S.cur), x = st(s.id);
    if (b.dataset.act === "sprev" || b.dataset.act === "snext") { var i = ST.indexOf(s) + (b.dataset.act === "snext" ? 1 : -1); if (ST[i]) { S.cur = ST[i].id; api.save(); paint(true); } return; }
    if (b.dataset.card) { x.sel = x.sel === b.dataset.card ? null : b.dataset.card; x.msg = null; api.save(); paint(); return; }
    if (b.dataset.bin) {
      if (!x.sel) { x.msg = "Tap a card first, then a bin."; x.msgK = ""; api.save(); paint(); return; }
      var c = byId(s.cards, x.sel), want = MV.ans(c), bin = b.dataset.bin;
      if (want === bin) { x.placed[c.id] = bin; x.sel = null; x.msg = "<strong>✓ Correct.</strong> " + c.why; x.msgK = "good"; if (s.cards.every(function(q){ return x.placed[q.id]; })) x.done = true; }
      else { x.msg = "<strong>✗ Not quite.</strong> " + (want === "nh" ? s.wrongNh : bin === "nh" ? s.wrongHuman : s.wrong) + " Try another bin."; x.msgK = "bad"; }
      api.save(); paint(); MV.focusFb($("#cr-stn", host)); return;
    }
    if (b.dataset.pick) { x.pick[b.dataset.pick] = !x.pick[b.dataset.pick]; x.msg = null; api.save(); paint(); return; }
    if (b.dataset.act === "lawcheck") {
      var A = MV.ans(s), picked = CARDS.filter(function(q){ return x.pick[q.id]; }), bad = picked.filter(function(q){ return A.indexOf(q.id) < 0; }), miss = A.filter(function(id){ return !x.pick[id]; });
      if (bad.length) { var w = MV.ans(bad[0]); x.msg = "<strong>✗ Not quite.</strong> " + (w === "nh" ? s.fb.nh : s.fb.som) + " Try again."; x.msgK = "bad"; }
      else if (miss.length) { x.msg = "<strong>✗ Not quite.</strong> " + s.fb.missing; x.msgK = "bad"; }
      else { x.done = true; x.msg = "<strong>✓ Correct.</strong> " + s.fb.good; x.msgK = "good"; }
      api.save(); paint(); MV.focusFb($("#cr-stn", host)); return;
    }
  });
  paint();
}

// ---------- Performance task: Plan an edit (four chip groups; the live checklist does the judging) ----------
var task = (function(){
  var api = null, T = null;
  var CELLS = { div:"dividing body cells", non:"non-dividing body cells", emb:"embryo" };
  function read(){ var s = api ? api.S : {}; return { site:s.site || "", goal:s.goal || "", tpl:s.tpl || "", cell:s.cell || "" }; }
  function draw(){
    var d = read(), box = $("#cr-tpv"); if (!box) return;
    var site = d.site ? byId(T.sites, d.site) : null, full = d.site && d.goal && d.tpl && d.cell;
    var repair = !full ? "—" : !site.pam ? "none: Cas9 can’t cut without a PAM" : (d.tpl === "yes" && d.cell === "div" ? "HDR copies the template" : "NHEJ joins the ends" + (d.tpl === "yes" ? " (the template goes unused)" : ""));
    box.innerHTML = '<h4 class="cr-h">Your plan</h4><dl class="read">' + MV.readoutHTML([
      ["Target site", site ? site.id + ": PAM " + (site.pam ? "yes" : "no") + "; " + (site.other ? "a near-match (19/20) in another gene" : "no other matches") + "; " + (site.inGene ? "inside the gene" : "outside any gene") : "—"],
      ["Goal", d.goal ? (d.goal === "ko" ? "knock out" : "correct") : "—"],
      ["Template", d.tpl || "—"], ["Cells", d.cell ? CELLS[d.cell] : "—"],
      ["What the cell will do", repair],
      ["Who is affected", d.cell ? (d.cell === "emb" ? "descendants too (germline)" : "only the patient (somatic)") : "—"]]) + "</dl>";
  }
  function lab(k){
    var p = k.split("|");
    return p[0] + ", " + (p[1] === "ko" ? "knock out" : "correct") + ", " + (p[2] === "yes" ? "template" : "no template") + ", " + CELLS[p[3]];
  }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task;
      inp.innerHTML = '<div class="cr-tin"><div class="cr-row" id="cr-tsite"></div><div class="cr-row" id="cr-tgoal"></div><div class="cr-row" id="cr-ttpl"></div><div class="cr-row" id="cr-tcell"></div></div>';
      function grp(id, key, label, opts){ radios($(id, inp), { label:label, cls:"chips", options:opts, value:a.S[key] || "", onChange:function(v){ a.S[key] = v; a.save(); draw(); a.update(); } }); }
      grp("#cr-tsite", "site", "Target site", T.sites.map(function(s){ return { id:s.id, t:s.id }; }));
      grp("#cr-tgoal", "goal", "Goal", [{ id:"ko", t:"Knock out" }, { id:"fix", t:"Correct" }]);
      grp("#cr-ttpl", "tpl", "Template", [{ id:"yes", t:"Yes" }, { id:"no", t:"No" }]);
      grp("#cr-tcell", "cell", "Cells", [{ id:"div", t:"Dividing body cells" }, { id:"non", t:"Non-dividing body cells" }, { id:"emb", t:"Embryo" }]);
      pv.innerHTML = '<div class="cr-tpv" id="cr-tpv"></div>';
      draw();
    },
    read:read,
    valid:function(d){ return d.site && d.goal && d.tpl && d.cell ? true : "Choose a target site, a goal, a template option and a cell type first."; },
    checks:function(d){
      var s = byId(MV.C.task.sites, d.site) || {};
      return [!!s.pam, !!d.site && !s.other, !!s.inGene, d.goal === "ko" ? d.tpl === "no" : d.goal === "fix" && d.tpl === "yes" && d.cell === "div", !!d.cell && d.cell !== "emb"];
    },
    key:function(d){ return [d.site, d.goal, d.tpl, d.cell].join("|"); },
    label:lab,
    text:lab
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task,
  onShow:function(v){ if (EXF) EXF.show(v === "explore"); }
});
})();
