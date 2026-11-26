// MHF4U 29 Proving Trig Identities. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/29-proving-trig-identities.md
// Workbench expressions are m() sources (no backticks); app.js typesets them. Every legal line of a proof has the same graph.

// ---------- TC3 move map: each LS state is a top over a bottom ----------
const TOPS = { N0:"sin 2x", N1:"2 sin x cos x" };
const BOTS = { D0:"1 + cos 2x", Db:"2cos^2x", Dc:"2 - 2sin^2x", Dc2:"2(1 - sin^2x)", Dd:"1 + cos^2x - sin^2x" };
function tc3(){
  const st = {}, map = {}, traps = {};
  for (const t of Object.keys(TOPS)) for (const b of Object.keys(BOTS)) { st[t + b] = "{" + TOPS[t] + "}/{" + BOTS[b] + "}"; map[t + b] = {}; }
  Object.assign(st, { F1:"{sin x}/{cos x}", F2:"tan x", H1:"{sin x cos x}/{1 - sin^2x}", H2:"{sin x cos x}/{cos^2x}" });
  for (const b of Object.keys(BOTS)) map["N0" + b].double = { sin:"N1" + b };
  for (const t of Object.keys(TOPS)) {
    map[t + "D0"].double = Object.assign(map[t + "D0"].double || {}, { cos:{ cs:t + "Dd", c2:t + "Db", s2:t + "Dc" } });
    map[t + "Dd"].pyth = t + "Db"; map[t + "Dc"].factor = t + "Dc2"; map[t + "Dc2"].pyth = t + "Db";
    map[t + "Dd"].split = { trap:"sd" + t }; map[t + "Dc"].split = { trap:"sc" + t };
    traps["sd" + t] = { m:"{" + TOPS[t] + "}/{1} + {" + TOPS[t] + "}/{cos^2x} - {" + TOPS[t] + "}/{sin^2x}", fb:"split" };
    traps["sc" + t] = { m:"{" + TOPS[t] + "}/{2} - {" + TOPS[t] + "}/{2sin^2x}", fb:"split" };
  }
  map.N0D0.split = { trap:"s0" }; traps.s0 = { m:"{sin 2x}/{1} + {sin 2x}/{cos 2x}", fb:"split" };
  map.N1D0.cancel = { trap:"c2" }; traps.c2 = { m:"{sin x cos x}/{1 + cos x}", fb:"two" };
  map.N1Db.cancel = "F1"; map.N1Dc2.cancel = "H1";
  Object.assign(map, { H1:{ pyth:"H2" }, H2:{ cancel:"F1" }, F1:{ quotUp:"F2" }, F2:{ quotDown:"F1" } });
  return { states:st, map, traps };
}
const T3 = tc3();
const SPLIT = "A fraction splits over a sum on top, never on the bottom: `{1}/{1 + 1}` isn’t `1/1 + 1/1`.";

export default {
  id:"29-proving-trig-identities",
  kind:"topic",
  title:"Proving trig identities",
  topic:"Proving Trig Identities",
  readyTopic:"proving trig identities",
  hero:{
    eq:'<span class="he-part">`sec^2x` <span class="he-hl" id="he-plus">+</span> `csc^2x`</span> <span class="he-part">= <span class="he-hl" id="he-prod">`sec^2x csc^2x`</span></span>',
    eqLabel:"secant squared x plus cosecant squared x equals secant squared x times cosecant squared x", eqSize:"md",
    contrastEq:'<span class="he-part">`sec x + csc x`</span> <span class="he-part">= `sec x csc x` ?</span>',
    headline:"A sum that equals a product, for every `x`",
    text:"An <strong>identity</strong> is an equation that is true for every value of `x` where both sides are defined, like `sin^2x + cos^2x = 1`. A statement that isn’t an identity can be knocked down by a single <strong>counterexample</strong>. To <strong>prove</strong> an identity, you rewrite the <strong>left side (LS)</strong> and the <strong>right side (RS)</strong> separately, using identities you already know, until both sides are the same expression.",
    fig:{ html:'<div class="h29"><canvas class="plot" id="hero-plot" role="img" aria-label="Graphs of y = sec squared x + csc squared x and y = sec squared x csc squared x for x from 0 to 2π: one curve in four U-shaped pieces, lowest point y = 4, with asymptotes at π/2, π and 3π/2"></canvas>' +
      '<div class="h29-row"><div class="h29-proof" id="h29-proof"></div></div><div id="h29-player"></div></div>' },
    caps:{ same:"Different on paper. The same graph.", one:"One counterexample is enough to sink a claim.", id:"✓ identity" },
    proof:{ ls:["{1}/{cos^2x} + {1}/{sin^2x}", "{sin^2x + cos^2x}/{sin^2x cos^2x}", "{1}/{sin^2x cos^2x}"], rs:["{1}/{cos^2x} · {1}/{sin^2x}", "{1}/{sin^2x cos^2x}"] }
  },
  goals:[
    "I can explain the difference between an identity and an equation, and use a counterexample to show that a statement is not an identity.",
    "I can use the reciprocal, quotient and Pythagorean identities, including `1 + tan^2x = sec^2x` and `1 + cot^2x = csc^2x`, to rewrite trig expressions.",
    "I can write a proof in left side / right side form, working on one side at a time and never doing the same thing to both sides.",
    "I can choose a strategy for a proof: rewrite in sine and cosine, combine or split fractions, expand or factor, or multiply by a conjugate.",
    "I can use the compound-angle and double-angle formulas in proofs, choosing the form of `cos 2x` that fits.",
    "I can say where the sides of an identity are undefined, and explain why those values of `x` are not counterexamples."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Algebra of fractions", goal:4,
          prompt:"Write `1/a + 1/b` as a single fraction (`a, b ≠ 0`).",
          options:[
            { t:"`{a + b}/{ab}`", ok:true, why:"The common denominator is `ab`: `1/a + 1/b = {b}/{ab} + {a}/{ab} = {a + b}/{ab}`." },
            { t:"`{2}/{a + b}`", why:"Fractions don’t add top-to-top and bottom-to-bottom. Try `a = b = 1`: `1/1 + 1/1 = 2`, but `{2}/{1 + 1} = 1`." },
            { t:"`{1}/{a + b}`", why:"Try `a = b = 1`: the sum is 2, but `{1}/{1 + 1} = 1/2`." },
            { t:"`{2}/{ab}`", why:"Over the denominator `ab`, `1/a` becomes `{b}/{ab}`, not `{1}/{ab}`. Try `a = 1`, `b = 2`: the sum is `3/2`, not `2/2 = 1`." }],
          hints:["What’s a common denominator for `a` and `b`?", "Use `ab`. Rewrite `1/a = {b}/{ab}` and `1/b = {a}/{ab}`.", "Add the tops: `{b + a}/{ab} = {a + b}/{ab}`."] },
        { id:"w2", skill:"Expanding and factoring", goal:4,
          prompt:"Expand `(a + b)^2`.",
          options:[
            { t:"`a^2 + 2ab + b^2`", ok:true, why:"`(a + b)(a + b) = a^2 + ab + ba + b^2 = a^2 + 2ab + b^2`." },
            { t:"`a^2 + b^2`", why:"That misses the middle term. Try `a = b = 1`: `(1 + 1)^2 = 4`, but `1^2 + 1^2 = 2`." },
            { t:"`a^2 + ab + b^2`", why:"There are two middle products, `ab` and `ba`, so the middle term is `2ab`. Try `a = b = 1`: you’d get 3, not 4." },
            { t:"`2a + 2b`", why:"Squaring means multiplying the bracket by itself, not by 2. Try `a = b = 1`: 2 + 2 = 4 happens to match, but try `a = 2`, `b = 1`: `(2 + 1)^2 = 9`, not 6." }],
          hints:["Write `(a + b)^2` as `(a + b)(a + b)`.", "Multiply each term in the first bracket by each term in the second. There are four products.", "`a^2 + ab + ba + b^2 = a^2 + 2ab + b^2`."] },
        { id:"w3", skill:"Algebra of fractions", goal:4,
          prompt:"Simplify `{s + s^2}/{s}`, for `s ≠ 0`.",
          options:[
            { t:"`1 + s`", ok:true, why:"Factor the top: `{s(1 + s)}/{s}`. Now `s` is a factor of the whole top and the whole bottom, so it cancels, leaving `1 + s`." },
            { t:"`s^2`", why:"You crossed out the term `s` on top against the `s` below. Only factors cancel. Try `s = 2`: `(2 + 4)/2 = 3`, not 4." },
            { t:"`1 + s^2`", why:"Every term on top must be divided by `s`: `s/s + s^2/s = 1 + s`." },
            { t:"It can’t be simplified, because the top is a sum.", why:"A sum can have a common factor: `s + s^2 = s(1 + s)`. Factor first, then cancel." }],
          hints:["Look for a factor common to every term on top.", "`s + s^2 = s(1 + s)`.", "`{s(1 + s)}/{s} = 1 + s`."] },
        { id:"w4", skill:"Identities you know", goal:2,
          prompt:"Which statement is true for every angle `x`?",
          options:[
            { t:"`sin^2x + cos^2x = 1`", ok:true, why:"The point `(cos x, sin x)` on the unit circle is 1 unit from the origin, so `cos^2x + sin^2x = 1^2 = 1`." },
            { t:"`sin x + cos x = 1`", why:"Try `x = π/4`: `√2/2 + √2/2 = √2`, not 1. Only the squares add to 1." },
            { t:"`sin^2x - cos^2x = 1`", why:"Try `x = 0`: `0 - 1 = -1`, not 1." },
            { t:"`tan x = cos x/sin x`", why:"`cos x/sin x` is `cot x`. At `x = π/3`, `tan x = √3` but `cos x/sin x = √3/3`." }],
          hints:["Think of the point `(cos x, sin x)` on the unit circle.", "Its distance from the origin is 1. Use the Pythagorean theorem.", "`cos^2x + sin^2x = 1` for every `x`."] },
        { id:"w5", skill:"Exact values", goal:1,
          prompt:"What is the exact value of `sin^2(π/3)`?",
          options:[
            { t:"`3/4`", ok:true, why:"`sin(π/3) = √3/2`, and `(√3/2)^2 = 3/4`." },
            { t:"`√3/2`", why:"`√3/2` is `sin(π/3)`. `sin^2(π/3)` means `(sin(π/3))^2`." },
            { t:"`3/2`", why:"`(√3/2)^2 = (√3)^2/2^2 = 3/4`. The bottom is squared too." },
            { t:"`1/4`", why:"`1/4 = (1/2)^2` is `sin^2(π/6)`. `π/3` is the larger angle, with the larger sine, `√3/2`." }],
          hints:["`sin^2(π/3)` means `(sin(π/3))^2`.", "`sin(π/3) = √3/2`.", "`(√3/2)^2 = 3/4`."] },
        { id:"w6", skill:"Identities you know", goal:5,
          prompt:"Which expression equals `sin(x + y)` for every `x` and `y`?",
          options:[
            { t:"`sin x cos y + cos x sin y`", ok:true, why:"This is the compound-angle formula for sine (module 28)." },
            { t:"`sin x + sin y`", why:"Try `x = y = π/2`: `sin π = 0`, but `sin(π/2) + sin(π/2) = 2`." },
            { t:"`cos x cos y + sin x sin y`", why:"That’s `cos(x - y)`. At `x = y = 0` it gives 1, but `sin 0 = 0`." },
            { t:"`sin x cos y - cos x sin y`", why:"That’s `sin(x - y)`. At `x = y = π/4` it gives 0, but `sin(π/2) = 1`." }],
          hints:["The sine formula mixes sine and cosine: “sin cos, cos sin”.", "For a sum, the sign in the middle is +.", "`sin(x + y) = sin x cos y + cos x sin y`."] }
      ],
      refreshers:{
        "Algebra of fractions":"To add fractions, rewrite each one over a common denominator, then add the tops: `1/a + 1/b = {b + a}/{ab}`. In this module the “numbers” are trig expressions: `{1}/{sin x} - sin x = {1 - sin^2x}/{sin x}`. To cancel, factor first, then cancel a factor of the whole top and the whole bottom: `{s + s^2}/{s} = {s(1 + s)}/{s} = 1 + s`. Never cancel a single term.",
        "Expanding and factoring":"`(a + b)^2 = a^2 + 2ab + b^2`: don’t drop the middle term. `(a - b)(a + b) = a^2 - b^2`, so `(1 - sin x)(1 + sin x) = 1 - sin^2x`, which the Pythagorean identity turns into `cos^2x`.",
        "Identities you know":"`sin^2x + cos^2x = 1` for every `x`. `tan x = sin x/cos x` and `cot x = cos x/sin x`. `csc x = 1/sin x`, `sec x = 1/cos x`, `cot x = 1/tan x`. From module 28: `sin(x + y) = sin x cos y + cos x sin y`. Test any claim at a special angle: at `x = π/4`, `sin x + cos x = √2`, so “`sin x + cos x = 1`” is not an identity.",
        "Exact values":"`sin(π/6) = 1/2`, `sin(π/4) = √2/2`, `sin(π/3) = √3/2`; the cosines are the same three values in reverse order. A squared ratio means the whole value is squared: `sin^2(π/3) = (√3/2)^2 = 3/4`."
      }
    }
  },
  explore:{
    heading:"Proof workbench",
    intro:"Pick a side, then pick a move. Each legal move rewrites that side without changing its value, so its graph stays exactly where it is. Keep going until the two sides are the same expression.",
    predIntro:"Each prediction sets up the workbench above. Make a prediction first. Then the workbench will show you what really happens.",
    wb:{
      modes:{ prove:"Prove", test:"Test a claim" }, proofLabel:"Proof", claimLabel:"Claim",
      sideLabels:{ L:"Left side", R:"Right side" }, colHeads:{ L:"Left side (LS)", R:"Right side (RS)" },
      panels:{ graph:"Graph twin", map:"Proof map" }, phone:{ board:"Board", graph:"Graph", map:"Map" },
      groups:[{ id:"id", t:"Identities" }, { id:"alg", t:"Algebra" }, { id:"eq", t:"Equation moves" }],
      keyLine:"↓ unpacks a ratio into a fraction (`sec x → 1/cos x`). ↑ packs a fraction back into a ratio.",
      moves:[
        { id:"recipDown", g:"id", t:"Reciprocal ↓", ex:"sec x → {1}/{cos x}" },
        { id:"recipUp", g:"id", t:"Reciprocal ↑", ex:"{1}/{cos x} → sec x" },
        { id:"quotDown", g:"id", t:"Quotient ↓", ex:"tan x → {sin x}/{cos x}" },
        { id:"quotUp", g:"id", t:"Quotient ↑", ex:"{sin x}/{cos x} → tan x" },
        { id:"pyth", g:"id", t:"Pythagorean", ex:"1 - sin^2x → cos^2x" },
        { id:"compound", g:"id", t:"Compound angle", ex:"sin(a + b) → sin a cos b + cos a sin b" },
        { id:"double", g:"id", t:"Double angle", ex:"sin 2x → 2 sin x cos x" },
        { id:"exact", g:"id", t:"Exact value", ex:"cos(π/6) → {√3}/{2}" },
        { id:"commonDen", g:"alg", t:"Common denominator", ex:"{1}/{a} + {1}/{b} → {a + b}/{ab}" },
        { id:"split", g:"alg", t:"Split the fraction", ex:"{A + B}/{C} → {A}/{C} + {B}/{C}" },
        { id:"multOut", g:"alg", t:"Multiply out", ex:"{1}/{a} · {1}/{b} → {1}/{ab}" },
        { id:"asProduct", g:"alg", t:"Write as a product", ex:"{sin^2x}/{cos x} → sin x · {sin x}/{cos x}" },
        { id:"expand", g:"alg", t:"Expand", ex:"(1 - s)(1 + s) → 1 - s^2" },
        { id:"factor", g:"alg", t:"Factor", ex:"2 - 2s^2 → 2(1 - s^2)" },
        { id:"collect", g:"alg", t:"Collect like terms", ex:"A + A → 2A" },
        { id:"cancel", g:"alg", t:"Cancel a common factor", ex:"{AB}/{AC} → {B}/{C}" },
        { id:"conj", g:"alg", t:"Multiply by the conjugate", ex:"{1}/{1 - c} → {1 + c}/{1 - c^2}" },
        { id:"eqSame", g:"eq", t:"Do the same to both sides", ex:"A = B → kA = kB" },
        { id:"eqCross", g:"eq", t:"Cross-multiply", ex:"{A}/{B} = {C}/{D} → AD = BC" },
        { id:"eqSquare", g:"eq", t:"Square both sides", ex:"A = B → A^2 = B^2" }
      ],
      dbl:{ title:"Double angle: what should it rewrite?", sin:"sin 2x → 2 sin x cos x", cs:"cos 2x → cos^2x - sin^2x", c2:"cos 2x → 2cos^2x - 1", s2:"cos 2x → 1 - 2sin^2x", cancel:"Cancel" },
      eqMsg:"That’s a move for solving an equation. In a proof you don’t know yet that the two sides are equal, so you can’t do the same thing to both. Work on one side at a time.",
      neutral:"That move doesn’t fit here, or it leads away from the goal. Undo is free; try another.",
      doneMsg:"This proof is complete. Undo a line or press Reset proof to try another route.",
      coachOther:"In this first proof, follow the coach marks.",
      coach:["The left side is selected. Tap <strong>Quotient ↓</strong> to write `cot x` in sine and cosine.", "`sin x` is now a factor of the top and of the bottom. Tap <strong>Cancel a common factor</strong>.", "Both sides are `cos x`, so LS = RS. Notice the graph never moved: every line is the same function."],
      p2coach:"Two legal routes: on the left, Split the fraction, Cancel a common factor, Quotient ↑ (3 moves); or on the right, Quotient ↓ then Common denominator (2 moves).",
      read:{ goal:"Goal", ls:"Left side now", rs:"Right side now", status:"Status", last:"Last move", probe:"Probe", undef:"Undefined at", moves:"Moves used", claim:"Claim", here:"Here" },
      notYet:"Not yet: the two sides are still different expressions.",
      complete:"✓ LS = RS. Both sides are now {e}. Proof complete in {n} moves.",
      legal:"{move}: same graph ✓", trapLast:"✗ {move}: that line draws a different graph, so the move changed the value. It has been removed.", refused:"Refused: that’s an equation move.",
      agree:"They happen to agree at this `x`, but the graphs are different. Move the probe to see.", oneUndef:"One of the lines is undefined at this `x`. Move the probe to see.",
      sameChip:"Same graph ✓", diffLabel:"✗ different graph", lsrs:"LS = RS ✓",
      route:"Your route: {n} moves.", shortest:"Shortest possible: {m} moves.", bonus:"Bonus proofs completed: {x}/3",
      undo:"Undo", reset:"Reset proof", probeLabel:"Value probe", hidden:"The graphs appear when the prediction is revealed.",
      reasons:{ sin:"`sin x = 0` on a bottom", cos:"`cos x = 0` on a bottom", sc:"`sin x = 0` or `cos x = 0` on a bottom", c2x:"`1 + cos 2x = 0` on a bottom", omc:"`1 - cos x = 0` on a bottom" },
      trapFb:{ split:SPLIT, two:"The 2 in `2x` belongs to the angle, not to a factor of the bottom. Only factors of the whole top and whole bottom cancel." }
    },
    proofs:[
      { id:"G0", label:"Guided proof: sin x cot x = cos x", ls:"A0", rs:"A2", ywin:[-2, 2], undef:{ ls:"sin" }, guided:true, shortest:2,
        undefAt:"`x = 0`, `π` and `2π` (where `sin x = 0`). The identity is claimed for every other `x`.",
        states:{ A0:"sin x cot x", A1:"sin x · {cos x}/{sin x}", A2:"cos x" },
        map:{ A0:{ quotDown:"A1" }, A1:{ cancel:"A2" } } },
      { id:"G1", label:"Raj’s proof: (sin x + cos x)/sin x = 1 + cot x", ls:"Q0", rs:"Q3", ywin:[-6, 6], undef:{ ls:"sin", rs:"sin" }, shortest:2,
        undefAt:"`x = 0`, `π` and `2π` (where `sin x = 0`). The identity is claimed for every other `x`.",
        mapNote:"The 2-move route works on the right side: Quotient ↓, then Common denominator turns `1 + cot x` back into the left side. Sometimes the simpler-looking side is the one to rewrite.",
        states:{ Q0:"{sin x + cos x}/{sin x}", Q1:"{sin x}/{sin x} + {cos x}/{sin x}", Q1b:"{sin x}/{sin x} + cot x", Q2:"1 + {cos x}/{sin x}", Q3:"1 + cot x" },
        map:{ Q0:{ split:"Q1", cancel:{ trap:"q" } }, Q1:{ cancel:"Q2", quotUp:"Q1b", commonDen:"Q0" }, Q1b:{ cancel:"Q3", quotDown:"Q1" }, Q2:{ quotUp:"Q3", commonDen:"Q0" }, Q3:{ quotDown:"Q2" } },
        traps:{ q:{ m:"1 + cos x", fb:"You can cancel only a factor of the whole top and the whole bottom. In `{sin x + cos x}/{sin x}`, `sin x` is a term on top, not a factor: split the fraction instead.", who:"Raj’s line" } } },
      { id:"TC1", label:"Challenge 1: sec x − cos x = sin x tan x", ls:"L0", rs:"L5", ywin:[-6, 6], undef:{ ls:"cos", rs:"cos" }, shortest:5,
        undefAt:"`x = π/2` and `3π/2` (where `cos x = 0`). The identity is claimed for every other `x`.",
        states:{ L0:"sec x - cos x", L1:"{1}/{cos x} - cos x", L2:"{1 - cos^2x}/{cos x}", L2s:"{1}/{cos x} - {cos^2x}/{cos x}", L3:"{sin^2x}/{cos x}", L4:"sin x · {sin x}/{cos x}", L5:"sin x tan x" },
        map:{ L0:{ recipDown:"L1" }, L1:{ commonDen:"L2", recipUp:"L0" }, L2:{ pyth:"L3", split:"L2s", cancel:{ trap:"c" } }, L2s:{ cancel:"L1", commonDen:"L2" }, L3:{ asProduct:"L4" }, L4:{ quotUp:"L5", multOut:"L3" }, L5:{ quotDown:"L4" } },
        traps:{ c:{ m:"1 - cos x", fb:"`cos x` is a factor of `cos^2x`, but not of `1 - cos^2x`. You can’t cancel it from one term." } } },
      { id:"TC2", label:"Challenge 2: tan x + cot x = sec x csc x", ls:"S0", rs:"S5", ywin:[-8, 8], undef:{ ls:"sc", rs:"sc" }, shortest:5, maxMoves:5,
        undefAt:"`x = 0`, `π/2`, `π`, `3π/2` and `2π` (where `sin x = 0` or `cos x = 0`). The identity is claimed for every other `x`.",
        states:{ S0:"tan x + cot x", S1:"{sin x}/{cos x} + {cos x}/{sin x}", S2:"{sin^2x + cos^2x}/{sin x cos x}", S2s:"{sin^2x}/{sin x cos x} + {cos^2x}/{sin x cos x}", S3:"{1}/{sin x cos x}",
          S4:"{1}/{cos x} · {1}/{sin x}", S5:"sec x csc x", T1:"tan x + {1}/{tan x}", T1q:"{sin x}/{cos x} + {1}/{{sin x}/{cos x}}", T2:"{tan^2x + 1}/{tan x}", T3:"{sec^2x}/{tan x}",
          T4a:"{{1}/{cos^2x}}/{tan x}", T4b:"{sec^2x}/{{sin x}/{cos x}}", T5:"{{1}/{cos^2x}}/{{sin x}/{cos x}}" },
        map:{ S0:{ quotDown:"S1", recipDown:"T1" }, S1:{ commonDen:"S2", quotUp:"S0", cancel:{ trap:"c" } }, S2:{ pyth:"S3", split:"S2s" }, S2s:{ cancel:"S1", commonDen:"S2" }, S3:{ asProduct:"S4" },
          S4:{ recipUp:"S5", multOut:"S3" }, S5:{ recipDown:"S4" }, T1:{ commonDen:"T2", quotDown:"T1q", recipUp:"S0" }, T1q:{ multOut:"S1", quotUp:"T1" }, T2:{ pyth:"T3" },
          T3:{ recipDown:"T4a", quotDown:"T4b" }, T4a:{ quotDown:"T5", recipUp:"T3" }, T4b:{ recipDown:"T5", quotUp:"T3" }, T5:{ multOut:"S3" } },
        traps:{ c:{ m:"1 + 1 = 2", fb:"`sin x` on top of one fraction and `sin x` below another can’t cancel. To add fractions, use a common denominator." } } },
      { id:"TC3", label:"Challenge 3: sin 2x/(1 + cos 2x) = tan x", ls:"N0D0", rs:"F2", ywin:[-6, 6], undef:{ ls:"c2x", rs:"cos" }, shortest:4, maxMoves:4, angles:"x2",
        undefAt:"`x = π/2` and `3π/2` (where `cos x = 0`, so `1 + cos 2x = 0`). The identity is claimed for every other `x`.",
        states:T3.states, map:T3.map, traps:T3.traps },
      { id:"B1", label:"Bonus 1: sin(x + π/6) + sin(x − π/6) = √3 sin x", ls:"C0", rs:"C4", ywin:[-2, 2], undef:{}, shortest:3, bonus:true, angles:"b1",
        undefAt:"Nowhere: both sides are defined for every `x`.",
        states:{ C0:"sin(x + π/6) + sin(x - π/6)", C1:"sin x cos(π/6) + cos x sin(π/6) + sin x cos(π/6) - cos x sin(π/6)", C1e:"{√3}/{2} sin x + {1}/{2} cos x + {√3}/{2} sin x - {1}/{2} cos x",
          C2:"2 sin x cos(π/6)", C3:"2 sin x · {√3}/{2}", C4:"√3 sin x" },
        map:{ C0:{ compound:"C1" }, C1:{ collect:"C2", exact:"C1e" }, C1e:{ collect:"C4" }, C2:{ exact:"C3" }, C3:{ multOut:"C4" } } },
      { id:"B2", label:"Bonus 2: (1 − sin x)(1 + sin x) sec²x = 1", ls:"E0", rs:"E4", ywin:[-0.5, 2], undef:{ ls:"cos" }, shortest:4, bonus:true,
        undefAt:"`x = π/2` and `3π/2` (where `cos x = 0`). The identity is claimed for every other `x`.",
        states:{ E0:"(1 - sin x)(1 + sin x) sec^2x", E0r:"(1 - sin x)(1 + sin x) · {1}/{cos^2x}", E1:"(1 - sin^2x) sec^2x", E1r:"(1 - sin^2x) · {1}/{cos^2x}", E2:"cos^2x sec^2x",
          E3:"cos^2x · {1}/{cos^2x}", E3m:"{cos^2x}/{cos^2x}", E4:"1" },
        map:{ E0:{ expand:"E1", recipDown:"E0r", pyth:{ trap:"p" } }, E0r:{ expand:"E1r", recipUp:"E0" }, E1:{ pyth:"E2", recipDown:"E1r" }, E1r:{ pyth:"E3" }, E2:{ recipDown:"E3" }, E3:{ cancel:"E4", multOut:"E3m" }, E3m:{ cancel:"E4" } },
        traps:{ p:{ m:"cos x (1 + sin x) sec^2x", fb:"“`1 - sin x = cos x`” drops the squares: the Pythagorean identity is `1 - sin^2x = cos^2x`. Every Pythagorean identity comes from `sin^2x + cos^2x = 1`. Test any form at `x = 0` or `π/4` before you use it." } } },
      { id:"B3", label:"Bonus 3: sin x/(1 − cos x) = (1 + cos x)/sin x", ls:"K0", rs:"K4", ywin:[-6, 6], undef:{ ls:"omc", rs:"sin" }, shortest:4, bonus:true,
        undefAt:"`x = 0`, `π` and `2π` (where `sin x = 0` or `1 - cos x = 0`). The identity is claimed for every other `x`.",
        states:{ K0:"{sin x}/{1 - cos x}", K1:"{sin x (1 + cos x)}/{(1 - cos x)(1 + cos x)}", K2:"{sin x (1 + cos x)}/{1 - cos^2x}", K3:"{sin x (1 + cos x)}/{sin^2x}", K4:"{1 + cos x}/{sin x}" },
        map:{ K0:{ conj:"K1", split:{ trap:"s" } }, K1:{ expand:"K2" }, K2:{ pyth:"K3" }, K3:{ cancel:"K4" } },
        traps:{ s:{ m:"{sin x}/{1} - {sin x}/{cos x}", fb:SPLIT } } }
    ],
    claims:[
      { id:"c1", label:"sin 2x = 2 sin x", ls:"sin 2x", rs:"2 sin x", ywin:[-2.5, 2.5], angles:"x2", undefAt:"Nowhere: both sides are defined for every `x`." },
      { id:"c2", label:"cos x = √(1 − sin²x)", ls:"cos x", rs:"√{1 - sin^2x}", ywin:[-1.5, 1.5], undefAt:"Nowhere: both sides are defined for every `x`.",
        note:"Tia’s argument: “Square both sides: `cos^2x = 1 - sin^2x`. That’s the Pythagorean identity, so the claim is an identity.”" }
    ],
    predictions:[
      { id:"p1", prompt:"The left side is `sin x cot x` and the right side is `cos x`. Before any moves are made, both sides will be graphed. What will you see?",
        options:[{ t:"One curve: the two graphs lie on top of each other, with open circles on the left side’s graph where `cot x` is undefined", ok:true }, { t:"Two different curves that the proof will gradually bring together" }, { t:"Two curves that cross at only a few points" }, { t:"Two curves that are mirror images in the `x`-axis" }],
        explain:"An identity’s two sides are already equal at every `x` where both are defined, so their graphs are already one curve. The proof doesn’t change the graph; it shows <em>why</em> the two expressions are equal. The open circles are where `sin x = 0`, because `cot x = cos x/sin x` has `sin x` on the bottom. Those `x`-values are left out of the identity; they aren’t counterexamples." },
      { id:"p2", prompt:"Raj “cancels” `sin x` on the left side and writes `1 + cos x`. When his line is added, what will the graph twin show?",
        options:[{ t:"The new line’s graph jumps away from the line above it", ok:true }, { t:"The graph stays exactly the same, because cancelling is always allowed" }, { t:"The graph stays the same except at `x = 0`" }, { t:"The new line’s graph moves onto the right side’s graph" }],
        explain:"You can cancel only a factor of the <em>whole</em> top and the <em>whole</em> bottom. In `{sin x + cos x}/{sin x}`, `sin x` is one term on top, not a factor. The legal move is to split the fraction: `{sin x}/{sin x} + {cos x}/{sin x} = 1 + cot x`. At `x = π/4` the left side is 2, but Raj’s line gives `1 + √2/2`, so his move changed the value." },
      { id:"p3", prompt:"The two sides are equal at `x = 0` and at `x = π`. The probe will now sweep every position from 0 to 2π. Where will the two sides be equal?",
        options:[{ t:"Only at 0, π and 2π", ok:true }, { t:"At every `x`: it’s an identity" }, { t:"At every multiple of `π/2`" }, { t:"At every multiple of `π/4`" }],
        explain:"`sin 2x = 2 sin x cos x`, not `2 sin x`: the 2 in `2x` doubles the angle, not the value. The sides are equal only where `2 sin x cos x = 2 sin x`, which means `sin x = 0` or `cos x = 1`: at 0, π and 2π. Two matching values proved nothing; one counterexample, `x = π/2`, shows it isn’t an identity." },
      { id:"p4", prompt:"Tia squared both sides and got a true identity. When both sides of her <strong>original</strong> claim are graphed, what will you see?",
        options:[{ t:"They match only where `cos x ≥ 0` (from 0 to `π/2` and from `3π/2` to 2π)", ok:true }, { t:"They match everywhere, because squaring proved it" }, { t:"They match only where `sin x ≥ 0` (from 0 to π)" }, { t:"They never match" }],
        explain:"`√{1 - sin^2x}` is a square root, so it’s never negative, but `cos x` is negative between `π/2` and `3π/2`. Squaring both sides threw that sign away: −1 and 1 have the same square. That’s why an identity proof never does the same thing to both sides. Squaring (or multiplying both sides) can turn a false statement into a true one." }
    ],
    chalIntro:"Work on the workbench, then press <strong>Check challenge</strong>. Choose the challenge’s proof in the Proof menu first. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"Prove `sec x - cos x = sin x tan x` working on the <strong>left side only</strong>: take it all the way to `sin x tan x`.",
        why:"Reciprocal ↓, Common denominator, Pythagorean, Write as a product, Quotient ↑: every line rewrites the left side alone, so nothing is assumed.",
        hints:["Write everything in sine and cosine first. Which move turns `sec x` into a fraction?", "Reciprocal ↓ gives `{1}/{cos x} - cos x`. Combine it into one fraction, then use a Pythagorean identity on the top.", "Reciprocal ↓, Common denominator, Pythagorean: `{sin^2x}/{cos x}`. Then Write as a product: `sin x · {sin x}/{cos x}`, and Quotient ↑: `sin x tan x`."],
        msgs:{ pick:"Choose “Challenge 1” in the Proof menu, then work on the left side.", rs:"This challenge is left side only. Undo the right-side lines (or press Reset) and take the left side all the way to `sin x tan x`.",
          L0:"Write everything in sine and cosine first. Which move turns `sec x` into a fraction?", L1:"Two terms, one of them a fraction: combine them over one denominator.", L2:"Which identity rewrites `1 - cos^2x`?",
          L3:"Nearly there. `sin^2x` is `sin x · sin x`: use Write as a product to split off `sin x · {sin x}/{cos x}`.", L4:"One move left. Which ratio is `sin x/cos x`?" } },
      { id:"tc2", goal:[2, 4], prompt:"Prove `tan x + cot x = sec x csc x` in <strong>at most 5 moves</strong> in total. You may work on both sides.",
        why:"Three moves on the left and two on the right meet at `{1}/{sin x cos x}`. Working on both sides, one at a time, is still a proof.",
        hints:["Write the left side in sine and cosine and combine the fractions. What does the top become?", "Quotient ↓, Common denominator, Pythagorean gives `{1}/{sin x cos x}`. That’s 3 moves. What can the right side do in 2?", "On the right: Reciprocal ↓ gives `{1}/{cos x} · {1}/{sin x}`, and Multiply out gives `{1}/{sin x cos x}`. The sides meet after 5 moves."],
        msgs:{ pick:"Choose “Challenge 2” in the Proof menu, then start moving.", viaT:"Proof complete, in {n} moves. Rewriting `cot x` as `1/tan x` keeps tan in the way. Try writing everything in sine and cosine first.",
          long:"Proof complete in {n} moves. Can you do it without the detour?", notYet:"Not yet: the left side is {L}, the right side is {R}. Can the right side meet the left side halfway?" } },
      { id:"tc3", goal:[4, 5], stretch:true, prompt:"Prove `{sin 2x}/{1 + cos 2x} = tan x` in <strong>at most 4 moves</strong>.",
        why:"The form `2cos^2x - 1` turns `1 + cos 2x` into `2cos^2x` in one move, so `2 sin x cos x` cancels straight away.",
        hints:["Look at the bottom, `1 + cos 2x`. Which form of `cos 2x` will cancel the 1?", "`cos 2x = 2cos^2x - 1` makes the bottom `2cos^2x` in one move. Expand `sin 2x` too.", "Double angle (`sin 2x`): `{2 sin x cos x}/{1 + cos 2x}`. Double angle (`2cos^2x - 1`): `{2 sin x cos x}/{2cos^2x}`. Cancel `2 cos x`: `{sin x}/{cos x}`. Quotient ↑: `tan x`. Four moves."],
        msgs:{ pick:"Choose “Challenge 3” in the Proof menu, then start moving.", cs:"Proof complete in {n} moves. With `cos^2x - sin^2x`, the bottom `1 + cos^2x - sin^2x` needs a Pythagorean step. Which form of `cos 2x` makes `1 + cos 2x` collapse straight away?",
          s2:"Proof complete in {n} moves. `1 + (1 - 2sin^2x) = 2 - 2sin^2x` needs factoring and a Pythagorean step. A different form of `cos 2x` cancels the 1 at once.", notYet:"Not yet. Look at the bottom: which form of `cos 2x` turns `1 + cos 2x` into a single term?" } }
    ],
    blocks:[{ title:"How a proof works", html:"<p><strong>Proving an identity</strong></p><ul><li>Every legal move rewrites an expression as one that is equal to it for every `x` where both are defined. That’s why the graph never moves.</li><li>Work on one side at a time, until both sides are the same expression. Then write LS = RS.</li><li>Never do the same thing to both sides, cross-multiply, or move a term across the equals sign. Those are equation moves, and they assume what you’re trying to prove.</li><li>Good first moves: rewrite in sine and cosine; combine fractions; expand double angles; look for `1 - sin^2x`, `1 - cos^2x`, `sec^2x - 1` or `csc^2x - 1` to swap with a Pythagorean identity; multiply by a conjugate when the bottom is `1 ± sin x` or `1 ± cos x`.</li><li>The graph twin is your check, not your proof: it can show a move is wrong, but only the chain of legal moves proves the identity for every `x`.</li></ul>" }]
  },
  part3:{
    slug:"counterexamples", name:"Counterexamples",
    heading:"Identity or equation? Hunt for a counterexample",
    intro:"Each round shows a claim. Give your hunch first, then look at the graphs and use the probe. If the claim isn’t an identity, find an `x` that proves it.",
    ui:{ verdicts:[{ id:"id", t:"Identity" }, { id:"some", t:"True for some `x` only" }, { id:"never", t:"Never true" }],
      lock:"Lock in my hunch", use:"Use this `x` as my counterexample", submit:"Submit verdict", fine:"Fine", diff:"Show where they differ", probe:"Probe",
      hunchQ:"Your hunch: is this claim an identity, true for some `x` only, or never true?", finalQ:"Your final verdict", hidden:"Lock in your hunch to see the graphs.",
      equal:"Equal", differ:"Not equal. This `x` is a counterexample.", undef:"{side} side undefined ({reason}). Not a counterexample.",
      cxNone:"No counterexample chosen yet.", cxSet:"Your counterexample: {x}", cxNeed:"Set the probe on a counterexample and press <strong>Use this `x` as my counterexample</strong> before you submit.",
      summary:"Your hunch: {h}. Final verdict: {v}.", solved:"✓ Round solved.", notFirst:"(not first try)", rightCx:"Your verdict is right, but this `x` isn’t a counterexample.",
      alg:"Check it with algebra", prev:"Previous round", next:"Next round", round:"Round {i} of 6", rightSide:"right side: `y = 0`" },
    rounds:[
      { id:"R1", goal:1, claim:"cos 2x = 2 cos x", ywin:[-2.5, 2.5], answer:"some", angles:"x2",
        fb:{ id:"Put the probe at `x = 0`: the left side is `cos 0 = 1`, but the right side is `2 cos 0 = 2`.", never:"The graphs cross twice. At those two `x`-values the sides are equal, so the claim is true for some `x`." },
        alg:"`cos 2x = 2cos^2x - 1`, so the claim says `2cos^2x - 1 = 2 cos x`. At `x = 0`: 1 ≠ 2, so it isn’t an identity. The 2 in `2x` doubles the angle, not the value. (The sides are equal only where `2cos^2x - 2 cos x - 1 = 0`, at two `x`-values that aren’t special angles.)" },
      { id:"R2", goal:[1, 6], claim:"tan x cos x = sin x", ywin:[-1.5, 1.5], answer:"id", undef:{ ls:"cos" }, reasons:{ ls:"`cos x = 0` under tan" },
        fb:{ some:"Where both sides are defined, the graphs are one curve. The open circles at `π/2` and `3π/2` are where `tan x` is undefined; they aren’t counterexamples.", never:"Where both sides are defined, the graphs are one curve. The open circles at `π/2` and `3π/2` are where `tan x` is undefined; they aren’t counterexamples.",
          cxUndef:"The left side is undefined here (`cos x = 0` under tan), so this isn’t a counterexample." },
        alg:"LS = `{sin x}/{cos x} · cos x = sin x` = RS, for every `x` with `cos x ≠ 0`. In `0 ≤ x ≤ 2π` that leaves out `π/2` and `3π/2`." },
      { id:"R3", goal:1, claim:"cos(x - π/3) = cos x - cos(π/3)", ywin:[-2, 2], answer:"some", angles:"r3",
        fb:{ id:"It works at `x = 0`, but put the probe at `π/3`: the left side is `cos 0 = 1`, the right side is `1/2 - 1/2 = 0`.", never:"At `x = 0` both sides are `1/2`, so it’s true for some `x`.",
          cxEqual:"Both sides are equal here ({v}). A counterexample needs them to differ. Try another `x`." },
        alg:"`cos(x - π/3) = cos x cos(π/3) + sin x sin(π/3) = {1}/{2} cos x + {√3}/{2} sin x`. That is not `cos x - 1/2`: at `x = π/3` the left side is 1 and the right side is 0. Cosine doesn’t split over a subtraction; the claim is true only at 0, `4π/3` and 2π." },
      { id:"R4", goal:[1, 6], claim:"tan^2x - sec^2x = 1", ywin:[-2, 2], answer:"never", undef:{ ls:"cos" }, reasons:{ ls:"`cos x = 0`, so `tan x` and `sec x` are undefined" },
        fb:{ some:"The two graphs are parallel lines, 2 apart: the left side is −1 wherever it’s defined. They never meet.", id:"The left side is always −1 and the right side is 1.",
          cxUndef:"Both `tan x` and `sec x` are undefined here. Pick an `x` where the left side has a value." },
        alg:"`1 + tan^2x = sec^2x`, so `tan^2x - sec^2x = -1` wherever both are defined. −1 never equals 1, so no `x` works." },
      { id:"R5", goal:[1, 2], claim:"(sin x + cos x)^2 = 1 + sin 2x", ywin:[-0.5, 2.5], answer:"id", angles:"x2",
        fb:{ some:"The graphs are one curve everywhere. Hunt for an `x` where they differ: you won’t find one. The algebra panel shows why.", never:"The graphs are one curve everywhere. Hunt for an `x` where they differ: you won’t find one. The algebra panel shows why." },
        alg:"LS = `sin^2x + 2 sin x cos x + cos^2x = (sin^2x + cos^2x) + 2 sin x cos x = 1 + sin 2x` = RS. The middle term of the square is what makes it work." },
      { id:"R6", goal:1, stretch:true, claim:"sin 12x = 0", ywin:[-1.5, 1.5], answer:"some", angles:"r6", zeroRS:true,
        note:"Marco checked this at all 25 probe positions (every multiple of `π/12` from 0 to 2π), and it was true every time.",
        fb:{ id:"Turn on <strong>Fine</strong> and look between the probe positions. The wave rises and falls between them.", never:"At every multiple of `π/12` the sides are equal (both 0), so it’s true for some `x`.",
          cxEqual:"Equal here: `12x` is a multiple of π, so `sin 12x = 0`. Those were exactly the positions Marco checked. Look between them with Fine." },
        alg:"At `x = π/24`, `12x = π/2` and `sin 12x = 1 ≠ 0`. Every probe position made `12x` a multiple of π, which is exactly where `sin 12x = 0`. No number of checked values proves an identity." }
    ],
    blocks:[{ title:"What the hunt shows", html:"<p><strong>Identity, equation, or never true?</strong></p><ul><li>An <strong>identity</strong> is true for every `x` where both sides are defined. Only a proof shows that; graphs and values can only suggest it.</li><li>A statement that is <strong>true for some `x` only</strong> is an equation with solutions. <strong>One counterexample</strong>, an `x` where both sides are defined but different, shows it isn’t an identity.</li><li>A statement can be <strong>never true</strong>, like `tan^2x - sec^2x = 1`.</li><li>An `x` where a side is undefined is <strong>not</strong> a counterexample. It’s outside the domain.</li><li>Checking many values, even every probe position, never proves an identity.</li></ul>" }],
    quickCheck:{
      title:"Identity or not?", summary:"Identity or not? quick check",
      items:[
        { id:"q1", goal:1, prompt:"Which value of `x` is a counterexample to `tan x = sin x`?",
          choices:[{ t:"`x = π/4`", ok:true, fb:"Right. `tan(π/4) = 1` but `sin(π/4) = √2/2`, and both are defined. One counterexample is enough." },
            { t:"`x = π`", fb:"`tan π = 0 = sin π`. The sides are equal there, so it isn’t a counterexample." },
            { t:"`x = π/2`", fb:"`tan(π/2)` is undefined, so the claim says nothing there. A counterexample needs both sides defined." },
            { t:"None: it’s an identity, since both sides are 0 at `x = 0`", fb:"Agreeing at one value doesn’t make an identity. It fails at `π/4`." }] },
        { id:"q2", goal:6, prompt:"The left side of `sec x - cos x = sin x tan x` is undefined at `x = π/2`. Is `x = π/2` a counterexample?",
          choices:[{ t:"No: an identity only claims the sides are equal where both are defined", ok:true, fb:"Right. This is the identity from TC1; `π/2` is simply outside its domain." },
            { t:"Yes: the sides aren’t equal there", fb:"Neither side has a value at `π/2` (both need `cos x ≠ 0`), so there’s nothing to compare." },
            { t:"Yes: so the statement is an equation, not an identity", fb:"Undefined values are left out, not counted against an identity." },
            { t:"No: both sides equal 0 there", fb:"Neither side is 0 at `π/2`. Both are undefined, because `cos(π/2) = 0` sits on a bottom." }] },
        { id:"q3", goal:1, prompt:"Ana checks a claim at `x = 0`, `π/6`, `π/4`, `π/3` and `π/2`. It’s true at all five. What can she conclude?",
          choices:[{ t:"Nothing for sure yet: it might be an identity, but only a proof can show that", ok:true, fb:"Right. `sin 12x = 0` is true at all five of those values and still isn’t an identity." },
            { t:"It’s an identity", fb:"Five values can’t cover every `x`. `sin 12x = 0` passes all five checks and fails at `π/24`." },
            { t:"It’s an identity, at least for `0 ≤ x ≤ π/2`", fb:"`sin 12x = 0` fails at `π/24`, which is between 0 and `π/2`." },
            { t:"It’s an equation, not an identity", fb:"She hasn’t found a counterexample, so she can’t say that either. `sin^2x + cos^2x = 1` would pass her five checks too." }] },
        { id:"q4", goal:1, prompt:"Which statement is <strong>never</strong> true?",
          choices:[{ t:"`csc^2x - cot^2x = 0`", ok:true, fb:"Right. `1 + cot^2x = csc^2x`, so `csc^2x - cot^2x = 1` wherever both are defined. It can never be 0." },
            { t:"`sin 2x = 2 sin x`", fb:"Both sides are 0 at 0, π and 2π, so it’s sometimes true." },
            { t:"`sin^2x - cos^2x = 1`", fb:"At `x = π/2`: `1 - 0 = 1`. It’s true at `π/2` and `3π/2`." },
            { t:"`1 + cot^2x = csc^2x`", fb:"That’s a Pythagorean identity: true for every `x` where both sides are defined." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"order", type:"custom", title:"Put the proof in order", summary:"Put the proof in order", goal:[3, 4],
        instruction:"Put the lines of each proof in order. One line doesn’t belong in the proof at all: move it to the tray.",
        how:"Tap a line, then use Move up or Move down. Use <strong>To tray</strong> for the line that doesn’t belong. Press Check when you’re done.",
        ui:{ tray:"Tray (one line)", trayEmpty:"Empty: move the line that doesn’t belong here.", up:"Move up", down:"Move down", toTray:"To tray", back:"Back to list", check:"Check",
          trayBad:"The tray holds a line that belongs in the proof.", decoyIn:"A line in the proof doesn’t belong; one move can’t produce it.", out:"Line {n} is out of place. Ask what has to happen before it can be done.",
          good:"✓ That proof works.", notFirst:"(not first try)", seq:"Proof {i}: " },
        sequences:[
          { id:"o1", goal:4, prompt:"Prove `{1}/{1 - cos x} + {1}/{1 + cos x} = 2csc^2x`.",
            first:"LS = `{1}/{1 - cos x} + {1}/{1 + cos x}`", last:"= RS, so LS = RS.",
            steps:["= `{2}/{sin^2x}`", "Multiply both sides by `(1 - cos x)(1 + cos x)`.", "= `{(1 + cos x) + (1 - cos x)}/{(1 - cos x)(1 + cos x)}`", "= `2csc^2x`", "= `{2}/{1 - cos^2x}`"],
            answer:{ order:[2, 4, 0, 3], decoy:1, tags:["Common denominator", "Collect like terms; expand the bottom", "Pythagorean", "Reciprocal ↑"], decoyTag:"Decoy: an equation move" },
            wrong:[{ above:3, below:2, fb:"`sin^2x` can only appear once the bottom is `1 - cos^2x`, so line 2 comes first." },
              { above:4, below:3, fb:"`2csc^2x = {2}/{sin^2x}` needs `sin^2x` on the bottom first." },
              { above:2, below:1, fb:"The top 2 comes from adding the two tops over the common denominator, so line 1 comes first." }],
            decoyFb:"Multiplying both sides is an equation move. A proof only rewrites one side at a time.",
            hints:["Start by combining the two fractions. Which line does that?", "After the common denominator, the tops add to 2 and the bottom multiplies out to `1 - cos^2x`. Then a Pythagorean identity, then a reciprocal.", "Order: common denominator, `{2}/{1 - cos^2x}`, `{2}/{sin^2x}`, `2csc^2x`. The “multiply both sides” line goes in the tray."] },
          { id:"o2", goal:5, prompt:"Prove `csc 2x + cot 2x = cot x`.",
            first:"LS = `csc 2x + cot 2x`", last:"= `cot x` = RS, so LS = RS.",
            steps:["= `{2cos^2x}/{2 sin x cos x}`", "= `{1}/{sin 2x} + {cos 2x}/{sin 2x}`", "= `{1 + cos 2x}/{2 sin 2x}`", "= `{cos x}/{sin x}`", "= `{1 + 2cos^2x - 1}/{2 sin x cos x}`", "= `{1 + cos 2x}/{sin 2x}`"],
            answer:{ order:[1, 5, 4, 0, 3], decoy:2, tags:["Reciprocal ↓ and Quotient ↓", "Common denominator", "Double angle (both)", "Collect like terms", "Cancel a common factor"], decoyTag:"Decoy: adds the bottoms" },
            wrong:[{ above:3, below:2, fb:"Line 3 is a single fraction, so the two fractions have to be combined first." },
              { above:5, below:4, fb:"Cancel after the like terms are collected: `1 + 2cos^2x - 1` becomes `2cos^2x` first." }],
            decoyFb:"Fractions with the same bottom add their tops; the bottom stays `sin 2x`, it doesn’t double.",
            hints:["Write csc and cot in terms of sine and cosine of `2x` first.", "Both fractions have the bottom `sin 2x`, so add the tops. Then choose the double-angle form that cancels the 1.", "Order: `{1}/{sin 2x} + {cos 2x}/{sin 2x}`; `{1 + cos 2x}/{sin 2x}`; `{1 + 2cos^2x - 1}/{2 sin x cos x}`; `{2cos^2x}/{2 sin x cos x}`; `{cos x}/{sin x}`. The `{1 + cos 2x}/{2 sin 2x}` line goes in the tray."] },
          { id:"o3", goal:5, prompt:"Prove `sin(x + π/6) + cos(x + π/3) = cos x`.",
            first:"LS = `sin(x + π/6) + cos(x + π/3)`", last:"= RS, so LS = RS.",
            steps:["= `{√3}/{2} sin x + {1}/{2} cos x + {1}/{2} cos x - {√3}/{2} sin x`", "= `cos x`", "= `sin x + sin(π/6) + cos x + cos(π/3)`", "= `sin x cos(π/6) + cos x sin(π/6) + cos x cos(π/3) - sin x sin(π/3)`", "= `{1}/{2} cos x + {1}/{2} cos x`"],
            answer:{ order:[3, 0, 4, 1], decoy:2, tags:["Compound angle", "Exact value", "Collect like terms (the sine terms cancel)", "Collect like terms"], decoyTag:"Decoy: splits sine and cosine over a sum" },
            wrong:[{ above:2, below:1, fb:"The exact values replace `cos(π/6)`, `sin(π/6)` and so on, which only appear after the compound-angle expansion." },
              { above:4, below:3, fb:"Line 3 shows the sine terms cancelling; line 4 then adds the two halves." }],
            decoyFb:"`sin(x + π/6)` isn’t `sin x + sin(π/6)`. Test `x = π/3`: `sin(π/2) = 1`, but `sin(π/3) + sin(π/6) = {√3 + 1}/{2}`.",
            hints:["Both terms are a function of a sum. Which formulas expand `sin(x + π/6)` and `cos(x + π/3)`?", "Expand both, then replace `cos(π/6)`, `sin(π/6)`, `cos(π/3)` and `sin(π/3)` with their exact values. Watch the minus sign in the cosine formula.", "Order: the compound-angle expansion; the exact values; `{1}/{2} cos x + {1}/{2} cos x` once the sine terms cancel; `cos x`. The line `sin x + sin(π/6) + cos x + cos(π/3)` goes in the tray."] }
        ] },
      { id:"make", type:"custom", title:"Make it an identity", summary:"Make it an identity", star:true, goal:[2, 4, 5],
        instruction:"Fill in the boxes so that the statement is true for every `x` where both sides are defined. Prove it on paper first; then check.",
        how:"Type an integer in each box (a fraction in MI8), then press Check. After each check, a small graph shows both sides, so you can see where they agree.",
        ui:{ item:"MI{i} of 8", check:"Check", prev:"Previous", next:"Next statement", range:"Use an integer from −6 to 6 for `a` and `b`, from 1 to 6 for `k`, and from 1 to 4 for `n`.", fracRange:"Type a whole number on top and a nonzero whole number on the bottom.",
          fill:"Fill in every box first.", gap:"Largest gap: {g}", gap0:"Largest gap: 0. The two graphs are one curve.", gapNote:"(where both sides are on screen)", good:"✓ Correct.", notFirst:"(not first try)",
          fallback:"Those numbers give a different graph. The preview shows where the sides part: test that `x` by hand to see which part of your working went wrong." },
        items:[
          { id:"mi1", goal:2, parts:["(1 - sin x)(1 + sin x) = ", "#a", "cos", "^n", " x"], boxes:{ a:"ab", n:"n" }, ywin:[-2, 2], answer:{ a:1, n:2 },
            wrong:[{ v:{ a:1, n:1 }, fb:"`(1 - sin x)(1 + sin x) = 1 - sin^2x = cos^2x`. The squares matter: at `x = π`, `cos x = -1` but `1 - sin^2x = 1`." },
              { v:{ a:-1, n:2 }, fb:"The left side is 1 at `x = 0`, but `-cos^2 0 = -1`. `1 - sin^2x` is `cos^2x`, with a plus sign." }],
            hints:["Expand the left side: it’s a difference of squares.", "`(1 - sin x)(1 + sin x) = 1 - sin^2x`. Which Pythagorean identity rewrites it?", "`1 - sin^2x = cos^2x`, so `a = 1` and `n = 2`."] },
          { id:"mi2", goal:[2, 5], parts:["tan x + cot x = ", "#a", " csc(", "#k", "x)"], boxes:{ a:"ab", k:"k" }, ywin:[-6, 6], answer:{ a:2, k:2 },
            wrong:[{ v:{ a:1, k:2 }, fb:"`csc 2x = {1}/{2 sin x cos x}`, which is half of `tan x + cot x = {1}/{sin x cos x}`. At `x = π/4` you’d get 1, not 2." },
              { v:{ a:2, k:1 }, fb:"`2 csc x = 2/sin x`. At `x = π/4` that’s `2√2`, but tan + cot = 2." }],
            hints:["You proved `tan x + cot x = {1}/{sin x cos x}` in Explore. Which double angle has `sin x cos x` in it?", "`sin 2x = 2 sin x cos x`, so `sin x cos x = {1}/{2} sin 2x`.", "`{1}/{sin x cos x} = {2}/{sin 2x} = 2 csc 2x`. So `a = 2` and `k = 2`."] },
          { id:"mi3", goal:[2, 5], parts:["sin^4x - cos^4x = ", "#a", " cos(", "#k", "x)"], boxes:{ a:"ab", k:"k" }, ywin:[-2, 2], answer:{ a:-1, k:2 },
            wrong:[{ v:{ a:1, k:2 }, fb:"Factor: `(sin^2x - cos^2x)(sin^2x + cos^2x) = sin^2x - cos^2x`, which is `-(cos^2x - sin^2x) = -cos 2x`. At `x = 0` the left side is −1." },
              { v:{ a:-1, k:1 }, fb:"At `x = π/2` the left side is 1, but `-cos(π/2) = 0`." }],
            hints:["`sin^4x - cos^4x` is a difference of squares: `(sin^2x)^2 - (cos^2x)^2`.", "`(sin^2x - cos^2x)(sin^2x + cos^2x) = sin^2x - cos^2x`. Compare it with `cos 2x = cos^2x - sin^2x`.", "`sin^2x - cos^2x = -(cos^2x - sin^2x) = -cos 2x`, so `a = -1` and `k = 2`."] },
          { id:"mi4", goal:[2, 5], parts:["sec^2x + csc^2x = ", "#a", " csc^2(", "#k", "x)"], boxes:{ a:"ab", k:"k" }, ywin:[0, 16], answer:{ a:4, k:2 },
            wrong:[{ v:{ a:1, k:2 }, fb:"`csc^2 2x = {1}/{4 sin^2x cos^2x}`, a quarter of the left side." },
              { v:{ a:2, k:2 }, fb:"Squaring `sin 2x = 2 sin x cos x` squares the 2 as well: `sin^2 2x = 4 sin^2x cos^2x`." }],
            hints:["Write the left side in sine and cosine and combine the fractions.", "`{1}/{cos^2x} + {1}/{sin^2x} = {1}/{sin^2x cos^2x}`. Which double angle has `sin x cos x` in it?", "`sin^2 2x = 4 sin^2x cos^2x`, so `{1}/{sin^2x cos^2x} = {4}/{sin^2 2x} = 4csc^2 2x`. So `a = 4` and `k = 2`."] },
          { id:"mi5", goal:5, star:true, parts:["cos 3x = ", "#a", " cos^3x + ", "#b", " cos x"], boxes:{ a:"ab", b:"ab" }, ywin:[-3, 3], answer:{ a:4, b:-3 },
            wrong:[{ v:{ a:3, b:-2 }, fb:"That comes from forgetting the 2 in `sin 2x = 2 sin x cos x`." },
              { v:{ a:0, b:1 }, fb:"`cos 2x cos x + sin 2x sin x` is `cos(2x - x) = cos x`. For `cos(2x + x)` the middle sign is minus." },
              { v:{ a:2, b:-1 }, fb:"That’s only `cos 2x cos x`: the `-sin 2x sin x` part is missing." }],
            hints:["Write `3x = 2x + x` and use the compound-angle formula for cosine.", "`cos 3x = cos 2x cos x - sin 2x sin x`. Use `cos 2x = 2cos^2x - 1` and `sin 2x = 2 sin x cos x`.", "`(2cos^2x - 1) cos x - 2sin^2x cos x = 2cos^3x - cos x - 2(1 - cos^2x) cos x = 4cos^3x - 3 cos x`. So `a = 4`, `b = -3`."] },
          { id:"mi6", goal:5, star:true, parts:["sin 3x = ", "#a", " sin x + ", "#b", " sin^3x"], boxes:{ a:"ab", b:"ab" }, ywin:[-3, 3], answer:{ a:3, b:-4 },
            wrong:[{ v:{ a:2, b:-3 }, fb:"That comes from forgetting the 2 in `sin 2x`." },
              { v:{ a:1, b:-2 }, fb:"That’s only `cos 2x sin x`: the `sin 2x cos x` part is missing." },
              { v:{ a:3, b:0 }, fb:"`cos^2x = 1 - sin^2x`, not `1 + sin^2x`." }],
            hints:["Write `3x = 2x + x` and use the compound-angle formula for sine.", "`sin 3x = sin 2x cos x + cos 2x sin x`. Use `sin 2x = 2 sin x cos x` and `cos 2x = 1 - 2sin^2x`.", "`2 sin x cos^2x + (1 - 2sin^2x) sin x = 2 sin x(1 - sin^2x) + sin x - 2sin^3x = 3 sin x - 4sin^3x`. So `a = 3`, `b = -4`."] },
          { id:"mi7", goal:5, star:true, parts:["tan(x + π/4) = ", { num:["#a", " + tan x"], den:["#b", " - tan x"] }], boxes:{ a:"ab", b:"ab" }, ywin:[-6, 6], answer:{ a:1, b:1 },
            wrong:[{ v:{ a:-1, b:1 }, fb:"That simplifies to −1 for every `x`: the top and bottom are opposites. `tan(x + π/4) = {tan x + tan(π/4)}/{1 - tan x tan(π/4)}`, and `tan(π/4) = 1`." },
              { v:{ a:1, b:-1 }, fb:"That simplifies to −1 for every `x`: the top and bottom are opposites. `tan(x + π/4) = {tan x + tan(π/4)}/{1 - tan x tan(π/4)}`, and `tan(π/4) = 1`." }],
            hints:["Use the compound-angle formula for tangent: `tan(a + b) = {tan a + tan b}/{1 - tan a tan b}`.", "`tan(π/4) = 1`.", "`tan(x + π/4) = {tan x + 1}/{1 - tan x} = {1 + tan x}/{1 - tan x}`. So `a = 1` and `b = 1`."] },
          { id:"mi8", goal:5, star:true, parts:["cos(x + π/6) cos(x - π/6) = cos^2x - ", { num:["#p"], den:["#q"] }], boxes:{ p:"int", q:"int" }, ywin:[-1.5, 1.5], answer:{ frac:0.25 },
            wrong:[{ val:0.75, fb:"That’s `cos^2(π/6)`. Multiplying out gives `{3}/{4}cos^2x - {1}/{4}sin^2x`; replace `sin^2x` with `1 - cos^2x` and the constant is `sin^2(π/6) = 1/4`." },
              { val:0.5, fb:"That’s `sin(π/6)`. The constant is `sin^2(π/6) = 1/4`." }],
            hints:["Expand both brackets with the compound-angle formulas. The product has the form `(A - B)(A + B)`.", "`(cos x cos(π/6) - sin x sin(π/6))(cos x cos(π/6) + sin x sin(π/6)) = cos^2x cos^2(π/6) - sin^2x sin^2(π/6) = {3}/{4}cos^2x - {1}/{4}sin^2x`.", "Replace `sin^2x` with `1 - cos^2x`: `{3}/{4}cos^2x - {1}/{4} + {1}/{4}cos^2x = cos^2x - {1}/{4}`. The fraction is `1/4`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Grace", how:"",
        instruction:"Grace made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Prove `sec x - tan x sin x = cos x`.",
            steps:["To prove: `sec x - tan x sin x = cos x`.", "Multiply both sides by `cos x`: `1 - sin^2x = cos^2x`.", "By the Pythagorean identity, `cos^2x = cos^2x`.", "The two sides are the same, so the identity is proved."],
            answer:1,
            stepFb:["Step 1 just states the goal. Keep checking the steps after it.", "", "Step 3 uses the Pythagorean identity correctly. The mistake is in how Grace got to step 3’s starting point.", "Step 4 is the conclusion of the earlier steps. The mistake is earlier."],
            fixes:[
              { t:"Work on the left side alone: LS = `{1}/{cos x} - {sin x}/{cos x} · sin x = {1 - sin^2x}/{cos x} = {cos^2x}/{cos x} = cos x` = RS.", ok:true, why:"Every line rewrites one side, so nothing is assumed. The arithmetic Grace did is still useful; it just has to happen on one side." },
              { t:"Multiply both sides by `sin x` instead.", why:"That’s still doing the same thing to both sides. Any “both sides” move assumes the identity is already true." },
              { t:"Move `tan x sin x` to the right side: `sec x = cos x + tan x sin x`.", why:"Moving a term across the equals sign is also an equation move." },
              { t:"Step 2 is correct as written.", why:"Multiplying both sides assumes the sides are equal, which is what Grace is trying to prove. Remember Tia’s squaring in P4: a “both sides” move can make a false claim look true." }],
            hints:["Look at what each step does to the equals sign.", "In a proof, are you allowed to do the same thing to both sides?", "Step 2 is wrong. Work on the left side alone: `{1}/{cos x} - {sin^2x}/{cos x} = {1 - sin^2x}/{cos x} = {cos^2x}/{cos x} = cos x`."] },
          { id:"e2", goal:2, task:"Is `(1 + tan x)^2 = sec^2x + 2 tan x` an identity? Prove it or disprove it.",
            steps:["LS = `(1 + tan x)^2`", "= `1 + tan^2x`", "= `sec^2x`", "At `x = π/4` the left side is `sec^2(π/4) = 2`, but the right side is 2 + 2 = 4. That’s a counterexample, so the statement is not an identity."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 uses `1 + tan^2x = sec^2x` correctly. The mistake is earlier.", "Step 4 would be right if step 3 were: it tests one `x` with both sides defined, which is how to disprove a claim. The mistake is earlier."],
            fixes:[
              { t:"= `1 + 2 tan x + tan^2x = sec^2x + 2 tan x` = RS, so it <strong>is</strong> an identity.", ok:true, why:"`(a + b)^2` has a middle term `2ab`. With it, the left side becomes the right side." },
              { t:"= `1 + tan x + tan^2x`.", why:"The middle term is `2 tan x`: there are two middle products, `tan x` and `tan x`." },
              { t:"= `1 + 2 tan x`.", why:"Squaring `tan x` gives `tan^2x`; it can’t disappear." },
              { t:"Step 2 is correct; the error is in step 3, which should be `1 + tan^2x = csc^2x`.", why:"`1 + tan^2x = sec^2x` is right; csc pairs with cot. The real error is the missing middle term in step 2." }],
            hints:["Check step 2: how do you square a sum?", "`(a + b)^2 = a^2 + 2ab + b^2`. What’s the middle term here?", "Step 2 is wrong. `(1 + tan x)^2 = 1 + 2 tan x + tan^2x = sec^2x + 2 tan x`, so it is an identity."] },
          { id:"e3", goal:5, task:"Prove `{cos 2x}/{cos x + sin x} = cos x - sin x`.",
            steps:["LS = `{cos 2x}/{cos x + sin x}`", "= `{cos^2x + sin^2x}/{cos x + sin x}`", "= `{1}/{cos x + sin x}`", "At `x = π/4` the left side is `{1}/{√2/2 + √2/2} = √2/2`, but the right side is `√2/2 - √2/2 = 0`. That’s a counterexample, so the statement is not an identity."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 applies `sin^2x + cos^2x = 1` correctly to step 2’s top. The mistake is earlier.", "Step 4 would be right if step 3 were: it tests one `x` with both sides defined, which is how to disprove a claim. The mistake is earlier."],
            fixes:[
              { t:"`cos 2x = cos^2x - sin^2x = (cos x - sin x)(cos x + sin x)`, so LS = `cos x - sin x` = RS.", ok:true, why:"With the minus sign, the top is a difference of squares, and the factor `cos x + sin x` cancels." },
              { t:"`cos 2x = 2 cos x`, so LS = `{2 cos x}/{cos x + sin x}`.", why:"The 2 in `2x` doubles the angle, not the value: at `x = 0`, `cos 0 = 1` but `2 cos 0 = 2`." },
              { t:"`cos 2x = 1 - 2cos^2x`, so LS = `{1 - 2cos^2x}/{cos x + sin x}`.", why:"`1 - 2cos^2x` is `-cos 2x`. The three correct forms are `cos^2x - sin^2x`, `2cos^2x - 1` and `1 - 2sin^2x`." },
              { t:"Step 2 is correct; the error is in step 4.", why:"`cos^2x + sin^2x` is 1, not `cos 2x`. At `x = π/2`, `cos 2x = -1`." }],
            hints:["Check step 2 against the three forms of `cos 2x`.", "`cos 2x = cos^2x - sin^2x`: a minus, not a plus. What does `cos^2x - sin^2x` factor into?", "Step 2 is wrong. `cos 2x = (cos x - sin x)(cos x + sin x)`; cancel `cos x + sin x` to get `cos x - sin x` (for `cos x + sin x ≠ 0`)."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the proof workbench: what the graphs did before you made any moves, or what happened when a move wasn’t legal?" },
      { id:"j2", q:"In your own words, what is the difference between an identity and an equation? Give an example of each, and a counterexample for the equation." },
      { id:"j3", q:"Explain to a friend how you would start proving `tan x + cot x = sec x csc x`, and why you aren’t allowed to multiply both sides by something." },
      { id:"j4", q:"Which identity or algebra move do you still reach for last, or get wrong? What will you do to make it automatic?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"Which statement is an identity?", options:[
          { t:"`1 + tan^2x = sec^2x`", ok:true, why:"Divide `sin^2x + cos^2x = 1` by `cos^2x`: `tan^2x + 1 = sec^2x`." },
          { t:"`1 + tan^2x = csc^2x`", why:"tan pairs with sec. At `x = π/3`: 1 + 3 = 4, but `csc^2(π/3) = 4/3`." },
          { t:"`tan^2x - 1 = sec^2x`", why:"The sign is wrong. At `x = 0` the left side is −1 and the right side is 1." },
          { t:"`sec^2x + tan^2x = 1`", why:"At `x = π/4`: 2 + 1 = 3, not 1. The identity is `sec^2x - tan^2x = 1`." }] },
        b:{ prompt:"Which statement is an identity?", options:[
          { t:"`1 + cot^2x = csc^2x`", ok:true, why:"Divide `sin^2x + cos^2x = 1` by `sin^2x`: `1 + cot^2x = csc^2x`." },
          { t:"`1 + cot^2x = sec^2x`", why:"cot pairs with csc. At `x = π/6`: 1 + 3 = 4, but `sec^2(π/6) = 4/3`." },
          { t:"`cot^2x - 1 = csc^2x`", why:"At `x = π/2` the left side is −1 and the right side is 1." },
          { t:"`csc^2x + cot^2x = 1`", why:"At `x = π/4`: 2 + 1 = 3, not 1. The identity is `csc^2x - cot^2x = 1`." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"You are proving `tan x sin x + cos x = sec x`. Which step is <strong>not</strong> allowed?", options:[
          { t:"Multiply both sides by `cos x`.", ok:true, why:"That’s an equation move: it treats the two sides as already equal. In a proof you work on each side on its own." },
          { t:"Rewrite `tan x` on the left side as `sin x/cos x`.", why:"That’s allowed: the quotient identity replaces `tan x` with an expression equal to it wherever `tan x` is defined." },
          { t:"Write the left side over the common denominator `cos x`.", why:"That’s allowed: combining fractions doesn’t change the value." },
          { t:"Rewrite `sec x` on the right side as `1/cos x`.", why:"That’s allowed: you may work on the right side too, as long as you work on it alone." }] },
        b:{ prompt:"You are proving `(1 - cos^2x) csc x = sin x`. Which step is <strong>not</strong> allowed?", options:[
          { t:"Square both sides.", ok:true, why:"Squaring both sides is an equation move, and it can make a false claim look true. Work on one side at a time." },
          { t:"Replace `1 - cos^2x` on the left side with `sin^2x`.", why:"That’s allowed: it’s the Pythagorean identity." },
          { t:"Rewrite `csc x` on the left side as `1/sin x`.", why:"That’s allowed: it’s the reciprocal identity." },
          { t:"Expand the left side to `csc x - cos^2x csc x`.", why:"That’s allowed, though it isn’t the quickest route: expanding doesn’t change the value." }] } },
      { id:"k3", cat:"K", goal:6,
        a:{ prompt:"`tan x = sin x/cos x` is an identity. For `0 ≤ x ≤ 2π`, at which values of `x` are its sides undefined?", options:[
          { t:"`x = π/2` and `x = 3π/2`", ok:true, why:"Both sides need `cos x ≠ 0`, and `cos x = 0` at `π/2` and `3π/2`." },
          { t:"`x = 0`, `π` and `2π`", why:"Those are where `sin x = 0`, which is where `cot x = cos x/sin x` is undefined." },
          { t:"`x = π/2` only", why:"`cos x` is also 0 at `3π/2`." },
          { t:"Nowhere: an identity is true for every real `x`.", why:"An identity is true for every `x` where both sides are <strong>defined</strong>. Here that leaves out `π/2` and `3π/2`." }] },
        b:{ prompt:"`cot x = cos x/sin x` is an identity. For `0 ≤ x ≤ 2π`, at which values of `x` are its sides undefined?", options:[
          { t:"`x = 0`, `π` and `2π`", ok:true, why:"Both sides need `sin x ≠ 0`, and `sin x = 0` at 0, π and 2π." },
          { t:"`x = π/2` and `3π/2`", why:"Those are where `cos x = 0`, which is where `tan x` is undefined." },
          { t:"`x = π` only", why:"`sin x` is also 0 at 0 and 2π." },
          { t:"Nowhere: an identity is true for every real `x`.", why:"An identity is true for every `x` where both sides are <strong>defined</strong>. Here that leaves out 0, π and 2π." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"To prove `{cos x}/{1 - sin x} = {1 + sin x}/{cos x}`, which first step on the left side is legal <strong>and</strong> leads to the right side?", options:[
          { t:"Multiply the top and bottom by `1 + sin x`.", ok:true, why:"That multiplies by 1, so it’s legal, and it brings in a Pythagorean identity: `{cos x(1 + sin x)}/{1 - sin^2x} = {cos x(1 + sin x)}/{cos^2x} = {1 + sin x}/{cos x}`." },
          { t:"Multiply both sides by `cos x(1 - sin x)`.", why:"That’s cross-multiplying, an equation move. It assumes the sides are already equal." },
          { t:"Split the fraction into `{cos x}/{1} - {cos x}/{sin x}`.", why:"A fraction splits over a sum on top, never on the bottom. At `x = π/6` the left side is `√3`, but `cos(π/6) - {cos(π/6)}/{sin(π/6)} = -√3/2`." },
          { t:"Replace `cos x` on top with `1 - sin x`.", why:"`cos^2x = 1 - sin^2x` has squares; without them it’s false. At `x = π/6`, `cos x = √3/2` but `1 - sin x = 1/2`." }] },
        b:{ prompt:"To prove `{sin x}/{1 + cos x} = {1 - cos x}/{sin x}`, which first step on the left side is legal <strong>and</strong> leads to the right side?", options:[
          { t:"Multiply the top and bottom by `1 - cos x`.", ok:true, why:"`{sin x(1 - cos x)}/{1 - cos^2x} = {sin x(1 - cos x)}/{sin^2x} = {1 - cos x}/{sin x}`." },
          { t:"Cross-multiply to get `sin^2x = (1 - cos x)(1 + cos x)`.", why:"Cross-multiplying is an equation move. It assumes the sides are already equal." },
          { t:"Split the fraction into `{sin x}/{1} + {sin x}/{cos x}`.", why:"A fraction can’t be split over a sum in its bottom. At `x = π/3` the left side is `√3/3`, but `sin(π/3) + tan(π/3) = {3√3}/{2}`." },
          { t:"Replace `sin x` on top with `1 - cos x`.", why:"`sin^2x = 1 - cos^2x` has squares. At `x = π/3`, `sin x = √3/2` but `1 - cos x = 1/2`." }] } },
      { id:"t2", cat:"T", goal:1,
        a:{ fixedOrder:true, prompt:"Which value of `x` is a counterexample showing that `tan x + cot x = 2` is <strong>not</strong> an identity?", options:[
          { t:"`x = π/6`", ok:true, why:"`tan(π/6) + cot(π/6) = √3/3 + √3 = {4√3}/{3}`, which isn’t 2, and both sides are defined. One such value is enough." },
          { t:"`x = π/4`", why:"`tan(π/4) + cot(π/4) = 1 + 1 = 2`. The sides are equal there, so it isn’t a counterexample." },
          { t:"`x = π/2`", why:"`tan(π/2)` is undefined, so `π/2` is outside the domain. A counterexample needs both sides defined." },
          { t:"`x = 5π/4`", why:"In quadrant 3, tan and cot are both positive: 1 + 1 = 2. Equal again." }] },
        b:{ fixedOrder:true, prompt:"Which value of `x` is a counterexample showing that `tan x - cot x = 0` is <strong>not</strong> an identity?", options:[
          { t:"`x = π/4`", why:"1 − 1 = 0: the sides are equal there." },
          { t:"`x = π/3`", ok:true, why:"`tan(π/3) - cot(π/3) = √3 - √3/3 = {2√3}/{3}`, which isn’t 0, and both sides are defined." },
          { t:"`x = 3π/4`", why:"(−1) − (−1) = 0: equal again." },
          { t:"`x = π`", why:"`cot π` is undefined (`sin π = 0`), so π is outside the domain." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Which expression equals `{1 - cos 2x}/{sin 2x}` for every `x` where both are defined?", options:[
          { t:"`tan x`", ok:true, why:"`1 - cos 2x = 1 - (1 - 2sin^2x) = 2sin^2x`, and `sin 2x = 2 sin x cos x`. So the fraction is `{2sin^2x}/{2 sin x cos x} = {sin x}/{cos x} = tan x`." },
          { t:"`-tan x`", why:"`1 - (1 - 2sin^2x) = 1 - 1 + 2sin^2x = +2sin^2x`: the minus sign changes both terms in the bracket." },
          { t:"`cot x`", why:"That comes from `cos 2x = 1 - 2cos^2x`, which is the wrong form (it equals `-cos 2x`). At `x = π/6` the fraction is `{1/2}/{√3/2} = √3/3 = tan(π/6)`, not `cot(π/6) = √3`." },
          { t:"`2 tan x`", why:"That forgets the 2 in `sin 2x = 2 sin x cos x`: the bottom becomes `sin x cos x`, and `{2sin^2x}/{sin x cos x} = 2 tan x`." }] },
        b:{ prompt:"Which expression equals `{sin 2x}/{1 - cos 2x}` for every `x` where both are defined?", options:[
          { t:"`cot x`", ok:true, why:"`{sin 2x}/{1 - cos 2x} = {2 sin x cos x}/{2sin^2x} = {cos x}/{sin x} = cot x`." },
          { t:"`-cot x`", why:"`1 - (1 - 2sin^2x) = +2sin^2x`: the minus sign changes both terms in the bracket." },
          { t:"`tan x`", why:"That comes from the wrong form `cos 2x = 1 - 2cos^2x`. At `x = π/6` the fraction is `{√3/2}/{1/2} = √3 = cot(π/6)`." },
          { t:"`{1}/{2} cot x`", why:"That forgets the 2 in `sin 2x = 2 sin x cos x`: the top becomes `sin x cos x`, and `{sin x cos x}/{2sin^2x} = {1}/{2} cot x`." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which is a correctly written proof that `csc x - sin x = cos x cot x`?", options:[
          { t:"“LS = `{1}/{sin x} - sin x = {1 - sin^2x}/{sin x} = {cos^2x}/{sin x} = cos x · {cos x}/{sin x} = cos x cot x` = RS. Therefore LS = RS.”", ok:true, why:"It works on the left side alone, every line is a legal rewrite, and it ends by showing LS = RS." },
          { t:"“Multiply both sides by `sin x`: `1 - sin^2x = cos^2x`, so `cos^2x = cos^2x`. This is true, so the identity is proved.”", why:"It starts from the statement it’s trying to prove and changes both sides. That’s solving an equation, not proving an identity." },
          { t:"“At `x = π/6`, LS = 2 − 1/2 = 3/2 and RS = `(√3/2)(√3) = 3/2`. The sides are equal, so it’s an identity.”", why:"The values are right, but one value can agree by coincidence. This checks `π/6`; it doesn’t prove every `x`." },
          { t:"“RS = `cos x · {cos x}/{sin x} = {cos^2x}/{sin x}`. Since `cos^2x = 1 - sin^2x`, LS = RS.”", why:"The left side is never rewritten, so the proof never shows that `csc x - sin x` equals `{cos^2x}/{sin x}`. Each side must be carried to the same expression." }] },
        b:{ prompt:"Which is a correctly written proof that `sin x + cos x cot x = csc x`?", options:[
          { t:"“LS = `sin x + cos x · {cos x}/{sin x} = sin x + {cos^2x}/{sin x} = {sin^2x + cos^2x}/{sin x} = {1}/{sin x} = csc x` = RS. Therefore LS = RS.”", ok:true, why:"It works on the left side alone, every line is a legal rewrite, and it ends by showing LS = RS." },
          { t:"“Multiply both sides by `sin x`: `sin^2x + cos^2x = 1`, so 1 = 1. This is true, so the identity is proved.”", why:"It starts from the statement it’s trying to prove and changes both sides. That’s solving an equation, not proving an identity." },
          { t:"“At `x = π/6`, LS = `1/2 + (√3/2)(√3) = 2` and RS = 2. The sides are equal, so it’s an identity.”", why:"The values are right, but one value can agree by coincidence. This checks `π/6`; it doesn’t prove every `x`." },
          { t:"“RS = `{1}/{sin x} = {sin^2x + cos^2x}/{sin x}`. Since `cot x = cos x/sin x`, LS = RS.”", why:"The left side is never rewritten, so the proof never shows that `sin x + cos x cot x` equals `{sin^2x + cos^2x}/{sin x}`. Each side must be carried to the same expression." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Emma says: “`sin(x + π/6) = sin x + sin(π/6)` is an identity, because it’s true when `x = 0`.” Which is the best response?", options:[
          { t:"“An identity has to be true for every `x` where both sides are defined. At `x = π/3` the left side is 1, but the right side is `√3/2 + 1/2`, so it isn’t an identity.”", ok:true, why:"This says what an identity is and gives one counterexample, which is all it takes." },
          { t:"“It is an identity, because sine can be split over a sum.”", why:"Sine isn’t a multiplier, so it doesn’t split: `sin(π/2 + π/2) = 0`, but `sin(π/2) + sin(π/2) = 2`." },
          { t:"“It isn’t an identity, because the two sides look different.”", why:"The conclusion is right, but the reason isn’t: `sin^2x + cos^2x` and 1 look different and are identical. You need a counterexample." },
          { t:"“It is an identity, but only for `x = 0`.”", why:"“Identity” means every `x`. A claim that’s true only at some `x` is an equation with those solutions." }] },
        b:{ prompt:"Jun says: “`cos(x - π/2) = cos x - cos(π/2)` is an identity, because it’s true when `x = π/4`.” Which is the best response?", options:[
          { t:"“An identity has to be true for every `x` where both sides are defined. At `x = 0` the left side is 0, but the right side is 1, so it isn’t an identity.”", ok:true, why:"This says what an identity is and gives one counterexample, which is all it takes." },
          { t:"“It is an identity, because cosine can be split over a subtraction.”", why:"Cosine doesn’t split: `cos(π/2 - π/2) = cos 0 = 1`, but `cos(π/2) - cos(π/2) = 0`." },
          { t:"“It isn’t an identity, because the two sides look different.”", why:"The conclusion is right, but the reason isn’t: different-looking sides can be identical. You need a counterexample." },
          { t:"“It is an identity, but only for `x = π/4`.”", why:"“Identity” means every `x`. A claim that’s true only at some `x` is an equation with those solutions." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ fixedOrder:true, prompt:"A soccer ball is kicked from the ground at 20 m/s, at an angle θ above the horizontal (`0 < θ < π/2`). Ignoring air resistance, it lands `d = (400/9.8) · 2 sin θ cos θ` metres away. Which <strong>other</strong> angle gives the same distance as `θ = π/6`?", options:[
          { t:"`π/12`", why:"`sin(2 · π/12) = sin(π/6) = 1/2`, not `√3/2`. Halving θ halves 2θ too." },
          { t:"`π/4`", why:"`π/4` gives the <strong>longest</strong> distance, since `sin(π/2) = 1` is more than `√3/2`." },
          { t:"`π/3`", ok:true, why:"`2 sin θ cos θ = sin 2θ`, so `d = (400/9.8) sin 2θ`. For `θ = π/6`, `sin 2θ = sin(π/3) = √3/2`. The other angle in `(0, π/2)` with `sin 2θ = √3/2` has `2θ = 2π/3`, so `θ = π/3`." },
          { t:"`5π/6`", why:"That’s `π - π/6`. It’s outside `0 < θ < π/2`, and `sin(5π/3)` is negative." }] },
        b:{ fixedOrder:true, prompt:"A soccer ball is kicked from the ground at 20 m/s, at an angle θ above the horizontal (`0 < θ < π/2`). Ignoring air resistance, it lands `d = (400/9.8) · 2 sin θ cos θ` metres away. Which <strong>other</strong> angle gives the same distance as `θ = π/12`?", options:[
          { t:"`π/24`", why:"`sin(2 · π/24) = sin(π/12)`, which is less than `sin(π/6) = 1/2`." },
          { t:"`π/4`", why:"`π/4` gives the longest distance, since `sin(π/2) = 1`." },
          { t:"`5π/12`", ok:true, why:"`d = (400/9.8) sin 2θ`. For `θ = π/12`, `sin 2θ = sin(π/6) = 1/2`. The other angle in `(0, π/2)` with `sin 2θ = 1/2` has `2θ = 5π/6`, so `θ = 5π/12`." },
          { t:"`11π/12`", why:"That’s `π - π/12`. It’s outside `0 < θ < π/2`, and `sin(11π/6)` is negative." }] } },
      { id:"a2", cat:"A", goal:2,
        a:{ fixedOrder:true, prompt:"A point starts at (4, 0) on a wheel of radius 4 m centred at the origin, and the wheel turns through an angle `t`. The straight-line distance `d` from the point’s start to its new position satisfies `d^2 = (4 cos t - 4)^2 + (4 sin t)^2`. How far is the point from its start when `t = 2π/3`?", options:[
          { t:"4 m", why:"That’s `d^2 = 16`, from `32 + 32 cos t` (a sign slip) or from `cos(2π/3) = +1/2`. Cosine is negative in quadrant 2, and the middle term is `-32 cos t`." },
          { t:"`4√2` m", why:"That’s `d^2 = 32`: the middle term `-32 cos t` was dropped when `(4 cos t - 4)^2` was expanded." },
          { t:"`4√3` m", ok:true, why:"Expand: `16cos^2t - 32 cos t + 16 + 16sin^2t`. Since `16cos^2t + 16sin^2t = 16`, `d^2 = 32 - 32 cos t`. At `t = 2π/3`, `cos t = -1/2`, so `d^2 = 48` and `d = 4√3`." },
          { t:"`8π/3` m", why:"That’s the arc length `4 × 2π/3`, the distance <strong>along</strong> the wheel. `d` is the straight-line distance." }] },
        b:{ fixedOrder:true, prompt:"A point starts at (6, 0) on a wheel of radius 6 m centred at the origin, and the wheel turns through an angle `t`. The straight-line distance `d` from the point’s start to its new position satisfies `d^2 = (6 cos t - 6)^2 + (6 sin t)^2`. How far is the point from its start when `t = 4π/3`?", options:[
          { t:"6 m", why:"That’s `d^2 = 36`, from `72 + 72 cos t` (a sign slip) or from `cos(4π/3) = +1/2`. Cosine is negative in quadrant 3, and the middle term is `-72 cos t`." },
          { t:"`6√2` m", why:"That’s `d^2 = 72`: the middle term `-72 cos t` was dropped when `(6 cos t - 6)^2` was expanded." },
          { t:"`6√3` m", ok:true, why:"Expand: `36cos^2t - 72 cos t + 36 + 36sin^2t`. Since `36cos^2t + 36sin^2t = 36`, `d^2 = 72 - 72 cos t`. At `t = 4π/3`, `cos t = -1/2`, so `d^2 = 108` and `d = 6√3`." },
          { t:"`8π` m", why:"That’s the arc length `6 × 4π/3`, the distance <strong>along</strong> the wheel. `d` is the straight-line distance." }] } }
    ]
  },
  task:{
    title:"Flatten the wave", summary:"Flatten the wave",
    statement:"<p>Choose integers `p`, `q` and `r` from −6 to 6 so that the graph of `y = p sin^2x + q cos^2x + r cos 2x` is the horizontal line `y = 3`, with `p ≠ q`. There are six answers. Can you find them all?</p>",
    checks:["`p`, `q` and `r` are integers from −6 to 6", "`p` and `q` are different", "The graph is flat: the same height at every `x`", "The graph passes through `(π/4, 3)`"],
    tips:["Use integers from −6 to 6 in every box.",
      "With `p = q` the expression is `p(sin^2x + cos^2x) + r cos 2x`. That uses only the Pythagorean identity. Make `p` and `q` different, so `cos 2x` has work to do.",
      "Your graph still waves, from {min} to {max}. Rewrite `sin^2x` and `cos^2x` using `cos 2x = 1 - 2sin^2x = 2cos^2x - 1`. What must `r` be to cancel every `cos 2x`?",
      "Your graph is flat, but at height {v}, not 3. At `x = π/4`, `sin^2x = cos^2x = 1/2` and `cos 2x = 0`. What does that tell you about `p + q`?"],
    ui:{ hi:"Highest value: {max}. Lowest value: {min}.", empty:"Enter `p`, `q` and `r` to see your graph.", target:"target `y = 3`", minus:"Decrease", plus:"Increase" },
    explainPrompt:"Prove, in left side / right side form, that your expression equals 3 for every `x`.",
    vocab:"Use the words double-angle identity, Pythagorean identity and left side.",
    success:"Your design works!", more:"There’s more than one answer. Can you find another?",
    all6:"You found all six. In every one, `p + q = 6` and `r = (p - q)/2`. Your proof in the box below shows why."
  },
  cards:[
    ["Identity", "An equation that is true for every value of `x` where both sides are defined. Example: `sin^2x + cos^2x = 1`."],
    ["Counterexample", "One `x` where both sides are defined but not equal. One is enough to show a claim is not an identity. Example: `x = π/2` for `sin 2x = 2 sin x` (0 ≠ 2)."],
    ["The reciprocal identities", "`csc x = 1/sin x`, `sec x = 1/cos x`, `cot x = 1/tan x`"],
    ["The quotient identities", "`tan x = sin x/cos x` and `cot x = cos x/sin x`"],
    ["The Pythagorean identities", "`sin^2x + cos^2x = 1`; `1 + tan^2x = sec^2x`; `1 + cot^2x = csc^2x`. The last two come from dividing the first by `cos^2x` or `sin^2x`."],
    ["The double-angle identities", "`sin 2x = 2 sin x cos x`; `cos 2x = cos^2x - sin^2x = 2cos^2x - 1 = 1 - 2sin^2x`"],
    ["The compound-angle identities", "`sin(a ± b) = sin a cos b ± cos a sin b`; `cos(a ± b) = cos a cos b ∓ sin a sin b`"],
    ["The LS/RS proof format", "Write “LS = …” and rewrite the left side alone (or each side separately) until both sides are the same expression. Finish with “LS = RS”."],
    ["Why not do the same thing to both sides?", "It assumes the sides are already equal. Squaring both sides of `cos x = √{1 - sin^2x}` gives a true identity, yet the original is false at `x = π` (−1 ≠ 1)."],
    ["Good first moves in a proof", "Rewrite in sine and cosine; combine fractions; expand double angles; swap `1 - sin^2x`, `1 - cos^2x` or `sec^2x - 1` using a Pythagorean identity; multiply by a conjugate."],
    ["The conjugate trick", "`(1 - sin x)(1 + sin x) = 1 - sin^2x = cos^2x`. Multiply the top and bottom by the conjugate to bring in a Pythagorean identity."],
    ["Restrictions", "An identity holds only where both sides are defined. `tan x cos x = sin x` leaves out `π/2` and `3π/2` (in `0 ≤ x ≤ 2π`). An `x` where a side is undefined is not a counterexample."]
  ]
};
