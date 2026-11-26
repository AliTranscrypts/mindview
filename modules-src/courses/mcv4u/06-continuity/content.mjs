// MCV4U 06 Continuity. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/06-continuity.md
// LIM("x → 2") typesets lim with the approach underneath (course plan §2; copied from MCV4U 04); the hidden brackets keep plain text readable.
const LIM = (s, cls) => '<span class="ct-lim' + (cls ? " " + cls : "") + '"><span class="ct-lt">lim</span><span class="vh"> (</span><span class="ct-lu">`' + s + '`</span><span class="vh">)</span></span>';
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M6 but gives no other feedback.
const M1 = "Being defined isn’t enough. The graph must also arrive at that value from both sides.";
const M2 = "A hole has a limit but no point (or the wrong point). The limit must <strong>equal</strong> `f(a)`.";
const M3 = "If the factor cancels, there’s a hole, not an asymptote.";
const M4 = "To the left of the join, use the rule for `x < a`; to the right, the rule for `x ≥ a`.";
const M5 = "A corner doesn’t lift the pencil. It’s continuous, just not smooth.";
const M6 = "Changing one point can fill a hole. It can’t close a jump or tame an asymptote.";

export default {
  id:"06-continuity",
  kind:"topic",
  title:"Continuity",
  topic:"Continuity",
  readyTopic:"continuity",
  hero:{
    eq:LIM("x → a", "ct-hero") + " `f(x) = f(a)`",
    eqLabel:"The limit of f of x, as x approaches a, equals f of a.",
    eqSize:"md",
    headline:"No surprises at `x = a`",
    text:"A function is <strong>continuous</strong> at `x = a` when the graph arrives at `x = a` from both sides at the same height, and the point is actually there. Break any part of that and you get a <strong>discontinuity</strong>: a <strong>removable</strong> hole, a <strong>jump</strong>, or an <strong>infinite</strong> asymptote.",
    fig:{ shape:"wide", aria:"A pencil dot traces a curve from left to right. At x = 1 the curve has a hole: the pencil lifts, hops the gap and lands again (Lifted: hole). At x = 3 the curve jumps from an open circle at (3, 2) up to a filled dot at (3, 4), and the pencil lifts again (Lifted: jump). At x = 5 it turns a sharp corner without lifting (Corner: no lift). Then the equation limit of f of x as x approaches a equals f of a fades in." }
  },
  goals:[
    "I can state and check the three conditions for continuity at `x = a`.",
    "I can classify a discontinuity as removable, jump or infinite, from a graph or an equation.",
    "I can find where a rational or piecewise function is discontinuous.",
    "I can choose constants so that a piecewise function is continuous.",
    "I can explain the difference between continuous and smooth."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Limits from graphs", goal:1, prompt:"On a graph, as `x → 2^{-}` the `y`-values approach 3, and as `x → 2^{+}` they approach 5. What is " + LIM("x → 2") + " `f(x)`?",
          options:[
            { t:"It does not exist", ok:true, why:"The two one-sided limits disagree." },
            { t:"3", why:"The right side approaches 5." },
            { t:"5", why:"The left side approaches 3." },
            { t:"4", why:"A limit isn’t an average; both sides must agree." }],
          hints:["A two-sided limit needs both sides to agree.", "Left → 3, right → 5.", "They differ, so the limit does not exist."] },
        { id:"w2", skill:"Limits from graphs", goal:1, prompt:"A graph is an unbroken curve except for an open circle at (1, 4) and a filled dot at (1, 2). What is " + LIM("x → 1") + " `f(x)`?",
          options:[
            { t:"4", ok:true, why:"Both sides head to the open circle’s height, 4." },
            { t:"2", why:"The limit is about the approach, not the dot." },
            { t:"It does not exist", why:"Both sides agree on 4." },
            { t:"3", why:"Follow the curve to the open circle." }],
          hints:["Ignore the dot. Where is the curve heading?", "Both sides approach the open circle.", "4."] },
        { id:"w3", skill:"Factor and cancel", goal:3, prompt:"Simplify `{x^2 - 4}/{x + 2}` for `x ≠ -2`.",
          options:[
            { t:"`x - 2`", ok:true, why:"`{(x - 2)(x + 2)}/{x + 2}`." },
            { t:"`x + 2`", why:"`(x + 2)^2 = x^2 + 4x + 4`." },
            { t:"`x^2 - 2`", why:"Only common <strong>factors</strong> cancel." },
            { t:"−2", why:"Factor first." }],
          hints:["Difference of squares.", "`(x - 2)(x + 2)`.", "`x - 2`."] },
        { id:"w4", skill:"Factor and cancel", goal:3, prompt:"Find " + LIM("x → 1") + " `{x^2 + 2x - 3}/{x - 1}`.",
          options:[
            { t:"4", ok:true, why:"`{(x + 3)(x - 1)}/{x - 1} = x + 3 → 4`." },
            { t:"It does not exist, because it’s 0/0.", why:"0/0 means simplify first." },
            { t:"3", why:"Cancel, then substitute `x = 1` into `x + 3`." },
            { t:"0", why:"The bottom is 0 too." }],
          hints:["Substituting gives 0/0, so factor.", "`x^2 + 2x - 3 = (x + 3)(x - 1)`.", "`x + 3 → 4`."] },
        { id:"w5", skill:"Piecewise functions", goal:4, prompt:"`f(x) = x + 4` for `x < 2`, and `f(x) = x^2` for `x ≥ 2`. Find `f(2)`.",
          options:[
            { t:"4", ok:true, why:"`x = 2` belongs to `x ≥ 2`: `2^2 = 4`." },
            { t:"6", why:"2 is not less than 2." },
            { t:"10", why:"Only one rule applies at each `x`." },
            { t:"Undefined", why:"≥ includes 2." }],
          hints:["Which condition does `x = 2` satisfy?", "`x ≥ 2`.", "`2^2 = 4`."] },
        { id:"w6", skill:"Piecewise functions", goal:4, prompt:"Same `f`. Find " + LIM("x → 2^{-}") + " `f(x)`.",
          options:[
            { t:"6", ok:true, why:"Left of 2, `f(x) = x + 4 → 6`." },
            { t:"4", why:"From the left, use the `x < 2` rule." },
            { t:"2", why:"The limit is a `y`-value." },
            { t:"It does not exist", why:"One side only: it’s 6." }],
          hints:["From the left means `x < 2`.", "Use `x + 4`.", "2 + 4 = 6."] }
      ],
      refreshers:{
        "Limits from graphs":LIM("x → a") + " `f(x)` is where the `y`-values head as `x` gets close to `a` from both sides. A dot at `x = a` doesn’t change it. If the sides disagree, the limit does not exist.",
        "Factor and cancel":"If substitution gives 0/0, factor the top and bottom and cancel the common factor; then substitute. `{x^2 - 9}/{x - 3} = x + 3 → 6` as `x → 3`.",
        "Piecewise functions":"Check which condition `x` satisfies, then use only that rule. Near a join, the left side uses one rule and the right side the other."
      }
    }
  },
  explore:{
    heading:"Pencil test",
    intro:"Press <strong>Trace</strong> and watch the pencil. Then open the checklist to see exactly which condition fails.",
    predictions:[
      { id:"p1", prompt:"The pencil traces `y = {x^2 - 4}/{x - 2}`. What happens at `x = 2`?",
        options:[{ t:"It lifts for one missing point", ok:true }, { t:"It passes straight through, since the function simplifies to `x + 2`" }, { t:"It jumps to a new height" }, { t:"It shoots off to infinity" }],
        explain:"Simplifying to `x + 2` is true only for `x ≠ 2`. At `x = 2` the formula gives 0/0, so there’s no point, and one missing point is enough to lift the pencil." },
      { id:"p2", prompt:"Now `g(2) = 1` is defined. Is `g` continuous at `x = 2`?",
        options:[{ t:"No: the limit is 4, but `g(2) = 1`", ok:true }, { t:"Yes: `g(2)` is defined now" }, { t:"Yes: the limit exists" }, { t:"No: the limit doesn’t exist" }],
        explain:"Defined (row 1) and limit exists (row 2) aren’t enough. The curve arrives at height 4, but the point sits at 1." },
      { id:"p3", prompt:"Could you repair the break in `h` at `x = 1` by changing the value of `h(1)`?",
        options:[{ t:"No: the two sides approach different heights", ok:true }, { t:"Yes: set `h(1) = 2`" }, { t:"Yes: set `h(1) = 0.5`, the average" }, { t:"Yes: remove the point `x = 1`" }],
        explain:"A jump has no single height to fill in. Redefining one point can only fix a hole." },
      { id:"p4", prompt:"`y = |x - 1| + 1` has a sharp corner at `x = 1`. Will the pencil lift?",
        options:[{ t:"No: it’s continuous, just not smooth", ok:true }, { t:"Yes: a corner is a break" }, { t:"Yes: `m(1)` is undefined" }, { t:"Only when traced from the right" }],
        explain:"`m(1) = 1`, and both sides approach 1. The graph is continuous. But there’s no single tangent at the corner, so it isn’t smooth." }
    ],
    challenges:[
      { id:"tc1", goal:1, prompt:"Find the function whose limit at `a` exists and whose value `f(a)` exists, but which is still discontinuous at `a`.",
        why:"`g` has a hole at (2, 4) and a separate dot at (2, 1): rows 1 and 2 pass, and row 3 fails because 4 ≠ 1.",
        hints:["You need rows 1 and 2 to pass and row 3 to fail.", "Look for a hole with a separate dot.", "`g`: hole at (2, 4), dot at (2, 1)."] },
      { id:"tc2", goal:4, prompt:"<strong>Builder:</strong> `f(x) = x^2 + c` for `x < 1`, and `3x - 1` for `x ≥ 1`. Set `c` so that `f` is continuous at `x = 1`. <span class=\"tiny muted\">(Choose Builder, then Two pieces.)</span>",
        why:"With `c = 1`, the left limit is 1 + `c` = 2 = `f(1)`.",
        hints:["Make the two pieces meet at `x = 1`.", "Left: `1^2 + c`. Right: `3(1) - 1 = 2`.", "`1 + c = 2`, so `c = 1`."] },
      { id:"tc3", goal:4, stretch:true, prompt:"<strong>Builder:</strong> `f(x) = x + a` for `x < 1`; `bx^2` for `1 ≤ x < 2`; `2x + 4` for `x ≥ 2`. Set `a` and `b` so that `f` is continuous everywhere. <span class=\"tiny muted\">(Choose Builder, then Three pieces.)</span>",
        why:"At `x = 2`: `4b = 8`, so `b = 2`. At `x = 1`: `1 + a = b`, so `a = 1`.",
        hints:["There are two joins. Start with the one that has only one unknown.", "At `x = 2`: `b(2)^2 = 2(2) + 4`, so `4b = 8` and `b = 2`.", "At `x = 1`: `1 + a = b(1)^2 = 2`, so `a = 1`."] }
    ]
  },
  part3:{
    slug:"repair", name:"Repair shop",
    heading:"Make it continuous",
    intro:"Four broken graphs, with each break glowing. At each station, choose a repair from the menu, set it, then press <strong>Retrace</strong> to see whether the pencil gets through. Some breaks can’t be repaired, and the last station asks for more than continuity.",
    quickCheck:{
      title:"Quick check", summary:"Repair shop quick check",
      items:[
        { id:"q1", goal:[2, 4], prompt:"`f(x) = {x^2 - 1}/{x - 1}`. How do you make `f` continuous at `x = 1`?",
          choices:[
            { t:"Define `f(1) = 2`", ok:true, fb:"Right. Cancel: `x + 1 → 2` as `x → 1`." },
            { t:"Define `f(1) = 0`", fb:"Cancel: `x + 1 → 2` as `x → 1`. 0/0 isn’t the value." },
            { t:"Define `f(1) = 1`", fb:"Cancel: `x + 1 → 2` as `x → 1`. 0/0 isn’t the value." },
            { t:"It can’t be done", fb:"Cancel: `x + 1 → 2` as `x → 1`. 0/0 isn’t the value." }] },
        { id:"q2", goal:4, prompt:"`f(x) = x + 2` for `x < 0`, and `x^2 + k` for `x ≥ 0`. Which `k` makes `f` continuous?",
          choices:[
            { t:"2", ok:true, fb:"Right. Left → 0 + 2 = 2; right gives 0 + `k`. So `k = 2`." },
            { t:"0", fb:"Left → 0 + 2 = 2; right gives 0 + `k`. So `k = 2`." },
            { t:"−2", fb:"Left → 0 + 2 = 2; right gives 0 + `k`. So `k = 2`." },
            { t:"Any `k`", fb:"Left → 0 + 2 = 2; right gives 0 + `k`. So `k = 2`." }] },
        { id:"q3", goal:2, prompt:"Can `f(x) = {1}/{x - 3}` be made continuous at `x = 3` by choosing `f(3)`?",
          choices:[
            { t:"No: it’s an infinite discontinuity", ok:true, fb:"Right. The graph shoots to ±∞; no single value fills that." },
            { t:"Yes: `f(3) = 0`", fb:"The graph shoots to ±∞; no single value fills that." },
            { t:"Yes: `f(3) = 3`", fb:"The graph shoots to ±∞; no single value fills that." },
            { t:"Yes: `f(3) = ∞`", fb:"The graph shoots to ±∞; no single value fills that." }] },
        { id:"q4", goal:5, prompt:"`y = |x|` at `x = 0` is…",
          choices:[
            { t:"Continuous but not smooth", ok:true, fb:"Right. It passes the three checks; the corner means no single tangent." },
            { t:"Discontinuous", fb:"It passes the three checks; the corner means no single tangent." },
            { t:"Smooth but not continuous", fb:"It passes the three checks; the corner means no single tangent." },
            { t:"Neither", fb:"It passes the three checks; the corner means no single tangent." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"classify", type:"sorter", title:"Classify the point", summary:"Classify the point", noun:"function", goal:[1, 2, 3, 5],
        instruction:"Decide what happens at the given point: is the function continuous there, or which kind of discontinuity is it?",
        boxes:[{ id:"b1", label:"Continuous" }, { id:"b2", label:"Removable" }, { id:"b3", label:"Jump" }, { id:"b4", label:"Infinite" }],
        wrongDefault:"Check the three conditions in order. Try another box.",
        items:[
          { id:"i1", goal:[2, 3], t:"`{x^2 - 9}/{x + 3}` at `x = -3`", answer:"b2", why:"`x + 3` cancels, leaving `x - 3`: a hole at (−3, −6).",
            wrong:{ b1:"−3 makes the denominator 0, so `f(-3)` isn’t defined." } },
          { id:"i2", goal:[2, 3], t:"`{x + 1}/{x - 2}` at `x = 2`", answer:"b4", why:"The denominator is 0 at `x = 2` and no factor cancels: a vertical asymptote." },
          { id:"i3", goal:[1, 5], t:"`|x + 4|` at `x = -4`", answer:"b1", why:"`f(-4) = 0`, and both sides approach 0. It has a corner, but the pencil doesn’t lift." },
          { id:"i4", goal:[1, 5], t:"`x^2` for `x < 1`; `2 - x` for `x ≥ 1`, at `x = 1`", answer:"b1", why:"Both pieces give 1 at `x = 1`: continuous, with a corner.",
            wrong:{ b3:"Both pieces give 1 at `x = 1`. The corner doesn’t break the graph." } },
          { id:"i5", goal:2, t:"`x + 3` for `x < 0`; `x^2 + 1` for `x ≥ 0`, at `x = 0`", answer:"b3", why:"Left → 3, right → 1: finite but different." },
          { id:"i6", goal:2, t:"`x/|x|` at `x = 0`", answer:"b3", why:"Left → −1, right → 1: two different one-sided limits.",
            wrong:{ b2:"Left → −1, right → 1: the sides disagree." },
            hints:["For `x > 0`, `|x| = x`; for `x < 0`, `|x| = -x`.", "So `x/|x|` is 1 on the right and −1 on the left.", "Two different one-sided limits: a jump."] },
          { id:"i7", goal:[2, 3], t:"`{x - 1}/{x^2 - 1}` at `x = 1`", answer:"b2", why:"`x - 1` cancels: `{1}/{x + 1}` for `x ≠ 1`, so there’s a hole at (1, 1/2).",
            wrong:{ b4:"`(x - 1)` cancels: `{1}/{x + 1}` for `x ≠ 1`, so there’s a hole at (1, 1/2), not an asymptote." },
            hints:["Factor `x^2 - 1`.", "`{x - 1}/{(x - 1)(x + 1)}`.", "The factor cancels, so it’s a hole: removable."] },
          { id:"i8", goal:[2, 3], t:"`{x - 1}/{x^2 - 1}` at `x = -1`", answer:"b4", why:"`x + 1` stays in the denominator after cancelling: a vertical asymptote." },
          { id:"i9", goal:[2, 3], t:"`{1}/{x^2}` at `x = 0`", answer:"b4", why:"Both sides grow without bound: a vertical asymptote." },
          { id:"i10", goal:[1, 2], t:"`{x^2 - 4}/{x - 2}` for `x ≠ 2`, with value 5 at `x = 2`", answer:"b2", why:"The limit is 4, but `f(2) = 5`: redefining one point fixes it.",
            wrong:{ b1:"`f(2) = 5`, but the limit is 4." } }
        ] },
      { id:"constants", type:"custom", title:"Repair the constants", summary:"Repair the constants", star:true, goal:[3, 4, 5],
        instruction:"Find the constant (or constants) that repair each function. Items 3 to 6 are non-routine.",
        how:"Type a number in each box, then press Check. Fractions such as 1/4 are fine.",
        items:[
          { id:"R1", goal:4, prompt:"`f(x) = kx - 1` for `x < 2`; `x^2 + 1` for `x ≥ 2`. Find `k`.", boxes:[{ k:"k", label:"`k =`" }], answer:{ k:3 },
            why:"The pieces meet when `2k - 1 = 2^2 + 1 = 5`, so `k = 3`.",
            wrong:[{ k:2, fb:"Solve `2k - 1 = 5` carefully." }] },
          { id:"R2", goal:[3, 4], prompt:"`f(x) = {x^2 - 25}/{x - 5}` for `x ≠ 5`; `f(5) = k`. Find `k`.", boxes:[{ k:"k", label:"`k =`" }], answer:{ k:10 },
            why:"`{(x - 5)(x + 5)}/{x - 5} = x + 5 → 10`, so `f(5)` must be 10.",
            wrong:[{ k:0, fb:"0/0 isn’t a value. Cancel to `x + 5`." }] },
          { id:"R3", goal:[3, 4], star:true, prompt:"`f(x) = {√x - 2}/{x - 4}` for `x ≠ 4`; `f(4) = k`. Find `k`.", boxes:[{ k:"k", label:"`k =`" }], answer:{ k:0.25 },
            why:"`{√x - 2}/{x - 4} = {1}/{√x + 2}` for `x ≠ 4`, which approaches 1/4.",
            wrong:[{ k:0, fb:"Rationalize the numerator (module 01): `{1}/{√x + 2} → {1}/{4}`." }, { word:"undef", fb:"Rationalize the numerator (module 01): `{1}/{√x + 2} → {1}/{4}`." }] },
          { id:"R4", goal:4, star:true, prompt:"`f(x) = x^2 + a` for `x < -1`; `ax + 7` for `x ≥ -1`. Find `a`.", boxes:[{ k:"a", label:"`a =`" }], answer:{ a:3 },
            why:"Left → `1 + a`; right `-a + 7`. `1 + a = 7 - a` gives `2a = 6`, so `a = 3`.",
            wrong:[{ a:4, fb:"The right piece at −1 is `-a + 7`, not `a + 7`." }] },
          { id:"R5", goal:[3, 4], star:true, prompt:"`f(x) = {x^2 + ax + b}/{x - 3}` for `x ≠ 3`; `f(3) = 7`. Find `a` and `b`.", boxes:[{ k:"a", label:"`a =`" }, { k:"b", label:"`b =`" }], answer:{ a:1, b:-12 },
            why:"`x^2 + x - 12 = (x - 3)(x + 4)`, and `x + 4 → 7` as `x → 3`.",
            general:"For a finite limit the top must be 0 at `x = 3`. Write it as `(x - 3)(x + c)` with `3 + c = 7`.",
            hints:["If the top weren’t 0 at `x = 3`, the limit would be infinite.", "So `x^2 + ax + b = (x - 3)(x + c)`, and the limit is `3 + c`.", "`3 + c = 7` gives `c = 4`: `(x - 3)(x + 4) = x^2 + x - 12`."] },
          { id:"R6", goal:[4, 5], star:true, prompt:"`f(x) = x^2` for `x ≤ 2`; `mx + b` for `x > 2`. Find `m` and `b` so the graph is continuous <strong>and</strong> has no corner at `x = 2`.", boxes:[{ k:"m", label:"`m =`" }, { k:"b", label:"`b =`" }], answer:{ m:4, b:-4 },
            why:"Same slope: `m = 4`. Same height: `2m + b = 4`, so `b = 4 - 8 = -4`.",
            wrong:[{ m:2, fb:"The slope of `x^2` at `x = 2` is 4 (module 02)." }, { m:4, b:0, fb:"Then `2m + b = 8 ≠ 4`." }],
            hints:["Two conditions: same height and same slope at `x = 2`.", "Slope: `m = 4`. Height: `2m + b = 4`.", "`b = 4 - 8 = -4`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Farah", how:"", goal:[3, 4],
        instruction:"Farah made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Is `f(x) = x^2 + 1` for `x < 2`, `3x - 2` for `x ≥ 2`, continuous at `x = 2`?",
            steps:["`f(2) = 3(2) - 2 = 4`.", "Left-hand limit: " + LIM("x → 2^{-}") + " `f(x) = 3(2) - 2 = 4`.", "Right-hand limit: " + LIM("x → 2^{+}") + " `f(x) = 4`.", "Both sides give 4 and `f(2) = 4`, so `f` is continuous at 2."],
            answer:1,
            stepFb:["Step 1 is correct: `x = 2` uses the second rule.", "", "Step 3 is fine; the problem is earlier.", "Step 4 follows from step 2. Check step 2."],
            fixes:[
              { t:"For `x < 2`, use `x^2 + 1`: the left-hand limit is 5. The sides disagree, so there’s a jump at `x = 2`.", ok:true, why:M4 },
              { t:"Recalculate `f(2)` with `x^2 + 1 = 5`.", why:"`x = 2` belongs to `x ≥ 2`." },
              { t:"Average the sides: the limit is 4.5.", why:"A limit isn’t an average." },
              { t:"Step 2 is correct.", why:"Left of 2, the rule is `x^2 + 1`." }],
            hints:["Which rule applies when `x < 2`?", "`x^2 + 1`.", "`2^2 + 1 = 5 ≠ 4`: a jump."] },
          { id:"e2", goal:3, task:"Where is `f(x) = {x^2 - x - 6}/{x^2 - 9}` discontinuous, and what type is each discontinuity?",
            steps:["Factor: `{(x - 3)(x + 2)}/{(x - 3)(x + 3)}`.", "`f` is undefined at `x = 3` and `x = -3`.", "Cancel: `f(x) = {x + 2}/{x + 3}` for `x ≠ 3`.", "So there are vertical asymptotes at `x = 3` and `x = -3`.", "Both are infinite discontinuities."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 follows step 4. The mistake is earlier."],
            fixes:[
              { t:"`x = 3` cancelled, so it’s a hole at (3, 5/6): removable. `x = -3` is a vertical asymptote: infinite.", ok:true, why:M3 },
              { t:"There’s no discontinuity at `x = 3`, because it cancelled.", why:"Cancelling doesn’t create `f(3)`; the point is still missing." },
              { t:"The hole is at `x = -3` and the asymptote at `x = 3`.", why:"`x + 3` is the factor that remains." },
              { t:"Step 4 is correct.", why:M3 }],
            hints:["Which factor cancelled?", "`x - 3` cancelled; `x + 3` didn’t.", "Hole at `x = 3`, value `{3 + 2}/{3 + 3} = {5}/{6}`; asymptote at `x = -3`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the pencil test: the hole that a formula hid, or the corner that didn’t lift the pencil?" },
      { id:"j2", q:"In your own words, why does continuity need all three conditions? Give a graph that passes two and fails one." },
      { id:"j3", q:"Explain to a friend how to find a constant that makes a piecewise function continuous." },
      { id:"j4", q:"Which kind of discontinuity do you still mix up? What will you check next time?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which three conditions together mean `f` is continuous at `x = a`?", options:[
          { t:"`f(a)` is defined; " + LIM("x → a") + " `f(x)` exists; the limit equals `f(a)`", ok:true, why:"`f(a)` defined, the limit exists, and they’re equal: all three must hold." },
          { t:"`f(a)` is defined; `f(a) ≠ 0`; the graph has no corner", why:"Corners are allowed; zero values are allowed." },
          { t:"Both one-sided limits exist; `f(a)` is defined; `f` is a polynomial", why:"They must also agree and equal `f(a)`." },
          { t:"`f(a)` is defined; `f(a)` is finite; the graph is smooth", why:M1 + " " + M5 }] },
        b:{ prompt:"`f(4) = 7` and " + LIM("x → 4") + " `f(x) = 7`. What can you conclude?", options:[
          { t:"`f` is continuous at `x = 4`", ok:true, why:"All three conditions hold." },
          { t:"Nothing yet; the graph must also be smooth at 4", why:M5 },
          { t:"`f` has a removable discontinuity at 4", why:"Removable means the limit ≠ `f(4)` or `f(4)` is missing." },
          { t:"`f` is continuous only if 7 is also the right-hand limit of `f′`", why:"Derivatives aren’t part of continuity." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"`f(x) = x + 2` for `x < 1`, and `5 - x` for `x ≥ 1`. What happens at `x = 1`?", options:[
          { t:"A jump discontinuity", ok:true, why:"Left → 3, right → 4." },
          { t:"A removable discontinuity", why:"The sides disagree, so no single point fixes it." },
          { t:"An infinite discontinuity", why:"Both sides stay finite." },
          { t:"It’s continuous, since `f(1) = 4` is defined", why:M1 + " To the left of 1, use `x + 2`: the left side arrives at 3, not 4." }] },
        b:{ prompt:"`f(x) = 2x` for `x < 3`, and `x + 4` for `x ≥ 3`. What happens at `x = 3`?", options:[
          { t:"A jump discontinuity", ok:true, why:"Left → 6, right → 7." },
          { t:"A removable discontinuity", why:"The sides disagree, so no single point fixes it." },
          { t:"An infinite discontinuity", why:"Both sides stay finite." },
          { t:"It’s continuous, since `f(3) = 7` is defined", why:M1 + " To the left of 3, use `2x`: the left side arrives at 6, not 7." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Where is `f(x) = {x + 1}/{x^2 - 4}` discontinuous?", options:[
          { t:"`x = 2` and `x = -2`", ok:true, why:"`x^2 - 4 = 0` there, and neither factor cancels." },
          { t:"`x = -1`", why:"That’s a zero of `f`, not a break." },
          { t:"`x = 4`", why:"Solve `x^2 - 4 = 0`, not `x - 4 = 0`." },
          { t:"`x = 2` only", why:"`(-2)^2 - 4 = 0` too." }] },
        b:{ prompt:"Where is `f(x) = {x - 5}/{x^2 - 1}` discontinuous?", options:[
          { t:"`x = 1` and `x = -1`", ok:true, why:"`x^2 - 1 = 0` there, and neither factor cancels." },
          { t:"`x = 5`", why:"That’s a zero of `f`, not a break." },
          { t:"`x = 1` only", why:"`(-1)^2 - 1 = 0` too." },
          { t:"Nowhere, because `x - 5` doesn’t cancel", why:"A zero denominator always breaks the graph." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"`f(x) = kx^2 - 3` for `x < 2`, and `kx + 5` for `x ≥ 2`. Find `k` so that `f` is continuous.", options:[
          { t:"`k = 4`", ok:true, why:"`4k - 3 = 2k + 5`, so `2k = 8`." },
          { t:"`k = 2`", why:"That uses only the constant 5 on the right; the right piece is `2k + 5`." },
          { t:"`k = 1`", why:"Sign slip: that solves `4k + 3 = 2k + 5`." },
          { t:"`k = -1`", why:"Sign slip: that solves `4k - 3 = 2k - 5`." }] },
        b:{ prompt:"`f(x) = kx + 1` for `x < 3`, and `kx^2 - 5` for `x ≥ 3`. Find `k`.", options:[
          { t:"`k = 1`", ok:true, why:"`3k + 1 = 9k - 5`, so `6 = 6k`." },
          { t:"`k = -2`", why:"That solves `3k + 1 = -5`, ignoring `9k`." },
          { t:"`k = -2/3`", why:"Sign slip: `3k + 1 = 9k + 5`." },
          { t:"`k = 1/2`", why:"That adds `9k` instead of subtracting: `12k = 6`." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"Which describes the discontinuities of `f(x) = {x^2 - 3x + 2}/{x^2 - 1}`?", options:[
          { t:"Removable at `x = 1` (a hole at (1, −1/2)); infinite at `x = -1`", ok:true, why:"`{(x - 1)(x - 2)}/{(x - 1)(x + 1)}`: `x - 1` cancels." },
          { t:"Infinite at both `x = 1` and `x = -1`", why:M3 },
          { t:"Removable at `x = -1`, infinite at `x = 1`", why:"`x + 1` is the factor that stays." },
          { t:"Removable at `x = 2`, infinite at `x = -1`", why:"`x = 2` is a zero of `f`, not a break." }] },
        b:{ prompt:"Which describes the discontinuities of `f(x) = {x^2 + x - 6}/{x^2 - 4}`?", options:[
          { t:"Removable at `x = 2` (a hole at (2, 5/4)); infinite at `x = -2`", ok:true, why:"`{(x + 3)(x - 2)}/{(x - 2)(x + 2)}`: `x - 2` cancels." },
          { t:"Infinite at both `x = 2` and `x = -2`", why:M3 },
          { t:"Removable at `x = -2`, infinite at `x = 2`", why:"`x + 2` is the factor that stays." },
          { t:"Removable at `x = -3`, infinite at `x = -2`", why:"`x = -3` is a zero of `f`." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"`f(x) = x^2 + ax` for `x < 1`; `b` at `x = 1`; `2x + 3` for `x > 1`. `f` is continuous at `x = 1`. Find `a` and `b`.", options:[
          { t:"`a = 4`, `b = 5`", ok:true, why:"Right → 5, so `b = 5`; left `1 + a = 5`." },
          { t:"`a = 5`, `b = 5`", why:"`1^2 + a`, so the left side is `1 + a`, not `a`." },
          { t:"`a = 4`, `b` can be any number", why:"`f(1)` must equal the limit." },
          { t:"`a = -4`, `b = 5`", why:"Sign slip: `1 + a = 5`." }] },
        b:{ prompt:"`f(x) = ax - x^2` for `x < 2`; `b` at `x = 2`; `x + 6` for `x > 2`. `f` is continuous at `x = 2`. Find `a` and `b`.", options:[
          { t:"`a = 6`, `b = 8`", ok:true, why:"Right → 8; left `2a - 4 = 8`." },
          { t:"`a = 4`, `b = 8`", why:"That forgets the `-x^2` term: `2a = 8`." },
          { t:"`a = 6`, `b` can be any number", why:"`f(2)` must equal the limit." },
          { t:"`a = 2`, `b = 8`", why:"That subtracts 4 instead of adding: `2a = 4`." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:LIM("x → 3") + " `g(x) = 6` and `g(3) = 2`. Which is the best description?", options:[
          { t:"“`g` has a removable discontinuity at 3. The limit exists but doesn’t equal `g(3)`; redefining `g(3) = 6` would fix it.”", ok:true, why:"A hole: the limit exists, but `g(3)` is different. Redefining one point fixes it." },
          { t:"“`g` is continuous at 3 because `g(3)` is defined.”", why:M1 },
          { t:"“`g` has a jump at 3 because 6 and 2 differ.”", why:"A jump needs the <strong>left and right limits</strong> to differ." },
          { t:"“`g` is continuous at 3 because the limit exists.”", why:M2 }] },
        b:{ prompt:LIM("x → -1") + " `h(x) = 4`, and `h(-1)` is undefined. Which is the best description?", options:[
          { t:"“`h` has a removable discontinuity at −1: there’s a hole at (−1, 4). Defining `h(-1) = 4` would make it continuous.”", ok:true, why:"A hole: the limit exists, but `h(-1)` is missing. Defining one point fixes it." },
          { t:"“`h` is continuous at −1 because the limit exists.”", why:M2 },
          { t:"“`h` has an infinite discontinuity, because `h(-1)` is undefined.”", why:"Undefined isn’t the same as infinite." },
          { t:"“`h` has a jump at −1.”", why:"Both sides approach 4." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which statement about `y = |x - 2|` at `x = 2` is correct?", options:[
          { t:"“It’s continuous at 2 but not smooth: the graph has a corner, so there’s no single tangent there.”", ok:true, why:"It passes the three checks; the corner means no single tangent." },
          { t:"“It’s discontinuous at 2 because of the corner.”", why:M5 },
          { t:"“It’s smooth at 2 because it’s continuous.”", why:M5 },
          { t:"“It’s undefined at 2 because |0| has no value.”", why:"`|0| = 0`." }] },
        b:{ prompt:"`f(x) = x^2` for `x < 1`, and `x` for `x ≥ 1`. Which statement is correct?", options:[
          { t:"“It’s continuous but not smooth: the pieces meet at (1, 1), but their slopes there are 2 and 1.”", ok:true, why:"A smooth join needs the same height <strong>and</strong> the same slope at the join." },
          { t:"“It’s discontinuous because the pieces are different formulas.”", why:M4 + " Here both rules give 1 at `x = 1`, so the pieces meet." },
          { t:"“It’s smooth because the pieces meet.”", why:M5 },
          { t:"“It’s discontinuous because the slopes differ.”", why:"Different slopes make a corner, not a break." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A parking garage charges `C(t) = 4t` dollars for `0 < t ≤ 3` hours, and `C(t) = 2t + k` for `t > 3`. The owner wants no sudden jump in price at 3 h. Find `k`.", options:[
          { t:"6", ok:true, why:"`C(3) = 12`, and `2(3) + k = 12`." },
          { t:"12", why:"That ignores the `2t` part: the second rule at `t = 3` is `6 + k`." },
          { t:"0", why:"“No jump” means the pieces meet, not `k = 0`." },
          { t:"18", why:"That adds 6 to 12 instead of subtracting." }] },
        b:{ prompt:"A courier charges `C(m) = 3m` dollars for `0 < m ≤ 4` kg, and `C(m) = m + k` for `m > 4`. Find `k` so the price has no jump at 4 kg.", options:[
          { t:"8", ok:true, why:"12 = 4 + `k`." },
          { t:"12", why:"That ignores the `m` part: the second rule at `m = 4` is `4 + k`." },
          { t:"0", why:"“No jump” means the pieces meet, not `k = 0`." },
          { t:"16", why:"That adds 4 to 12 instead of subtracting." }] } },
      { id:"a2", cat:"A", goal:2,
        a:{ prompt:"A depth sensor’s model is `D(t) = {t^2 - 16}/{t - 4}` cm, but the formula fails at `t = 4` s. What depth should be recorded for `t = 4` so the model is continuous?", options:[
          { t:"8 cm", ok:true, why:"`{(t - 4)(t + 4)}/{t - 4} = t + 4 → 8`." },
          { t:"0 cm", why:"0/0 isn’t 0; it means simplify." },
          { t:"4 cm", why:"That’s the time, not the depth." },
          { t:"It can’t be determined.", why:"This is a hole, which can be filled by its limit." }] },
        b:{ prompt:"A model is `D(t) = {t^2 - 6t + 5}/{t - 5}` cm, which fails at `t = 5` s. What value at `t = 5` makes it continuous?", options:[
          { t:"4 cm", ok:true, why:"`{(t - 1)(t - 5)}/{t - 5} = t - 1 → 4`." },
          { t:"0 cm", why:"0/0 isn’t 0; it means simplify." },
          { t:"5 cm", why:"That’s the time, not the depth." },
          { t:"It can’t be determined.", why:"This is a hole, which can be filled by its limit." }] } }
    ]
  },
  task:{
    title:"Smooth join", summary:"Smooth join",
    statement:"<p>Design `f(x) = ax + b` for `x < 1`, and `x^2 + c` for `x ≥ 1`, that meets every condition. There’s more than one answer.</p><div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>`f` is continuous at `x = 1`.</li><li>`f` has no corner at `x = 1` (the two pieces have the same slope there).</li><li>`f(0)` is negative.</li><li>`f(2)` is positive.</li></ol></div><p class=\"tiny muted\">Choose whole numbers from −10 to 10 for `a`, `b` and `c`. The graph marks the join; the tool shows the left and right heights at `x = 1` and the slope of each piece there (the slope of `x^2 + c` at `x = 1` is 2).</p>",
    checks:["Continuous at `x = 1`", "No corner at `x = 1`", "`f(0)` negative", "`f(2)` positive"],
    tips:["Make the heights match: `a(1) + b` must equal `1^2 + c`.",
      "The right piece has slope 2 at `x = 1`, so the line needs slope 2 too.",
      "`f(0)` uses the left piece: it’s `b`.",
      "`f(2)` uses the right piece: `4 + c`."],
    explainPrompt:"Explain why every answer has `a = 2`, and how you chose `c`.",
    vocab:"Use the words continuous, smooth, corner and slope.",
    afterAll:"Lines 1 and 2 force `a = 2` and `b = c - 1`. Line 3 needs `c < 1`, and line 4 needs `c > -4`."
  },
  cards:[
    ["Continuous at `x = a`", "`f(a)` defined, " + LIM("x → a") + " `f(x)` exists, and they’re equal."],
    ["Removable discontinuity", "A hole: the limit exists, but `f(a)` is missing or different. Fix it by redefining one point."],
    ["Jump discontinuity", "Left and right limits are finite but different. Can’t be fixed by one point."],
    ["Infinite discontinuity", "At least one side → ±∞: a vertical asymptote."],
    ["Rational function: hole or asymptote?", "A cancelled factor gives a hole; a remaining factor of the denominator gives an asymptote."],
    ["Piecewise join", "Continuous when the left and right pieces give the same height at the join."],
    ["Smooth", "Continuous with no corners: one tangent at every point."],
    ["`y = |x|` at 0", "Continuous, not smooth (a corner)."],
    ["Pencil test", "Can you trace through `x = a` without lifting?"],
    ["0/0", "Not a value. Simplify, then take the limit."],
    ["Smooth join of two pieces", "Same height <strong>and</strong> same slope at the join."]
  ]
};
