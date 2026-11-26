// MHF4U 30 Chapter 4 Summary & Review: the plan's content as data (plan modules/30-chapter-4-review.md).
// Review module: Start (goals + diagnostic), Connect (identity toolbox map), Mixed practice, Reflect, Final Check.

// M-table core sentences (plan section 3), used where the plan tags an option with the misconception only.
const M1 = "π = 180°, not 360°.";
const M2 = "Reference angle for the size, CAST for the sign.";
const M3 = "`sin(a + b) = sin a cos b + cos a sin b`. Try `a = b = π/2`: `sin π = 0`, not 2.";
const M4 = "Cosine flips the sign: `cos(a ∓ b) = cos a cos b ± sin a sin b`.";
const M6 = "Start with one side and transform it until it is the other side.";

export default {
  id:"30-chapter-4-review",
  kind:"review",
  title:"Chapter 4 summary and review",
  topic:"Chapter 4 Summary & Review",
  hero:{
    headline:"One circle, the whole toolbox",
    text:"Every Chapter 4 idea starts on the unit circle: radians measure the arc, the point gives `cos @t{θ}` and `sin @t{θ}`, CAST gives the signs, and each identity is a fact about that point or about adding two angles.",
    muted:"Work through the five parts in order. Your answers save on this device as you go.",
    fig:{ shape:"square",
      aria:"Unit circle. The terminal arm is at 5π/6, with the arc from 0 to 5π/6 marked and the point (−√3/2, 1/2). A mirror line flips the point to π/6; a second arm adds π/4 to reach 13π/12; a right triangle under the arm shows (√3/2)² + (1/2)² = 1. Five identities sit around the circle, each joined to it by a thin line: a = rθ, (cos θ, sin θ), sin(π − θ) = sin θ, sin(a + b) and (√3/2)² + (1/2)² = 1.",
      steps:[
        { cap:"The arm sweeps to `5π/6`: arc length = `5π/6` for `r = 1` · module 25" },
        { cap:"The point is `(-{√3}/{2}, 1/2)`: `(cos @t{θ}, sin @t{θ})` · module 26" },
        { cap:"A mirror line flips it to `π/6`: `sin(π - @t{θ}) = sin @t{θ}` · module 27" },
        { cap:"A second arm adds `π/4` to make `13π/12`: `sin(a + b)` · module 28" },
        { cap:"Beside the right triangle: `({√3}/{2})^2 + (1/2)^2 = 1` · module 29" }] }
  },
  goals:[
    "I can convert between radians and degrees and use arc length `a = rθ` and angular velocity.",
    "I can find exact primary and reciprocal trig ratios of special angles in any quadrant.",
    "I can use cofunction and related-angle identities, such as `sin(π/2 - x) = cos x`.",
    "I can use compound- and double-angle formulas to find exact values and simplify.",
    "I can prove trig identities and disprove non-identities with a counterexample.",
    "I can explain where each identity comes from and choose the identity that unlocks a step."
  ],

  // Key idea and where to look for each topic module (diagnostic, mixed practice and Final Check tables).
  // "Where to look" uses the built modules' Explore and Part 3 headings, with the step-bar name in brackets.
  keyIdeas:{
    "25":{ idea:"A radian is the angle that cuts off one radius of arc; π = 180°; `a = rθ`; angular velocity = angle ÷ time.",
      look:"Radius wrapper (Explore); Spin lab: how fast is it turning? (Spin lab)" },
    "26":{ idea:"The point is `(cos θ, sin θ)`; reference angle for size, CAST for sign; reciprocals undefined where their partner is 0.",
      look:"Unit circle explorer (Explore); Angle families: one triangle, four quadrants (CAST)" },
    "27":{ idea:"`sin(π/2 - x) = cos x`; related angles `π ± x`, `2π - x` keep the size and follow CAST.",
      look:"Slide, flip, match (Explore); Cofunction pairs from a right triangle (Cofunctions)" },
    "28":{ idea:"`sin(a ± b)` and `cos(a ± b)`; with `a = b`, the double-angle formulas; exact values like `sin(π/12)`.",
      look:"Compound angle visualiser (Explore); Exact values: split an angle, double an angle (Exact values)" },
    "29":{ idea:"Prove by transforming one side; disprove with one counterexample.",
      look:"Proof workbench (Explore); Identity or equation? Hunt for a counterexample (Counterexamples)" }
  },

  start:{
    diagnostic:{
      title:"Diagnostic: which modules should I revisit?",
      intro:"Nine questions, one or two from each Chapter 4 module. Pick an answer, say how sure you are, then check it. At the end you’ll see which modules to revisit.",
      questions:[
        { id:"d1", topic:"25", goal:1, fixedOrder:true,   // π-multiples in increasing order
          prompt:"What is 225° in radians?",
          options:[
            { t:"`5π/8`", why:"That treats a full turn as π." },
            { t:"`4π/5`", why:"The factor is upside down." },
            { t:"`5π/4`", ok:true, why:"`225 × π/180 = 5π/4`." },
            { t:"`225π`", why:"Multiply by `π/180`, not π." }],
          hints:["Multiply by `π/180`.", "`225/180 = 5/4`.", "`5π/4`."] },
        { id:"d2", topic:"25", goal:1, fixedOrder:true,   // lengths in increasing order
          prompt:"A circle has radius 6 cm. How long is the arc cut off by a central angle of `2π/3`?",
          options:[
            { t:"`π/9` cm", why:"That’s `θ ÷ r`." },
            { t:"`4π` cm", ok:true, why:"`a = rθ = 6 × 2π/3`." },
            { t:"`12π` cm", why:"That’s the whole circumference." },
            { t:"720 cm", why:"That uses 120° instead of `2π/3`." }],
          hints:["`a = rθ`, `θ` in radians.", "`6 × 2π/3`.", "`4π` cm."] },
        { id:"d3", topic:"26", goal:2, fixedOrder:true,   // exact values in increasing order
          prompt:"Find `cos(4π/3)` exactly.",
          options:[
            { t:"`-{√3}/{2}`", why:"That’s the size for reference angle `π/6`." },
            { t:"`-1/2`", ok:true, why:"Reference angle `π/3`, quadrant 3: cosine negative." },
            { t:"`1/2`", why:"Quadrant 3: cosine is negative." },
            { t:"`{√3}/{2}`", why:"Wrong size and wrong sign." }],
          hints:["Quadrant and reference angle?", "Q3, `π/3`.", "`-1/2`."] },
        { id:"d4", topic:"26", goal:2, fixedOrder:true,
          prompt:"What is the exact value of `csc(7π/4)`?",
          options:[
            { t:"`-√2`", ok:true, why:"`sin(7π/4) = -√2/2`, so `csc = -2/√2 = -√2`." },
            { t:"−1", why:"That’s `tan(7π/4)`." },
            { t:"`-{√2}/{2}`", why:"That’s `sin(7π/4)`; csc is its reciprocal." },
            { t:"`√2`", why:"Sine is negative in quadrant 4." }],
          hints:["`csc = 1/sin`.", "`sin(7π/4) = -√2/2`.", "`-√2`."] },
        { id:"d5", topic:"27", goal:3,
          prompt:"Which expression equals `cos(π/2 - x)`?",
          options:[
            { t:"`sin x`", ok:true, why:"Cofunction identity." },
            { t:"`cos x`", why:"Subtracting from `π/2` swaps sine and cosine." },
            { t:"`-sin x`", why:"`cos(π/2 - x) = 0 · cos x + 1 · sin x`: positive." },
            { t:"`-cos x`", why:"That’s `cos(π - x)`." }],
          hints:["Think of a right triangle with acute angles `x` and `π/2 - x`.", "Or use `cos(a - b)`.", "`sin x`."] },
        { id:"d6", topic:"28", goal:4, fixedOrder:true,   // exact values in increasing order
          prompt:"Use `π/12 = π/3 - π/4` to find `sin(π/12)` exactly.",
          options:[
            { t:"`{√3 - √2}/{2}`", why:"That’s `sin(π/3) - sin(π/4)`." },
            { t:"`1/4`", why:"`sin(π/12) ≈ 0.26` isn’t `1/4` exactly." },
            { t:"`{√6 - √2}/{4}`", ok:true, why:"`sin(π/3 - π/4) = (√3/2)(√2/2) - (1/2)(√2/2)`." },
            { t:"`{√6 + √2}/{4}`", why:"That’s `cos(π/12)`." }],
          hints:["`π/12 = π/3 - π/4`.", "`sin(a - b) = sin a cos b - cos a sin b`.", "`{√6 - √2}/{4}`."] },
        { id:"d7", topic:"28", goal:4,
          prompt:"Simplify `2 sin x cos x`.",
          options:[
            { t:"`sin 2x`", ok:true, why:"The double-angle formula." },
            { t:"`sin(x^2)`", why:"The double angle is `2x`, not `x^2`." },
            { t:"`2 sin 2x`", why:"The 2 is already used up." },
            { t:"`cos 2x`", why:"`cos 2x = cos^2 x - sin^2 x`." }],
          hints:["Which formula has `2 sin x cos x`?", "`sin(x + x)`.", "`sin 2x`."] },
        { id:"d8", topic:"29", goal:5,
          prompt:"Which equation is an identity (true for every `x` where both sides are defined)?",
          options:[
            { t:"`tan x cos x = sin x`", ok:true, why:"`(sin x/cos x) · cos x = sin x` wherever `cos x ≠ 0`." },
            { t:"`sin 2x = 2 sin x`", why:"At `x = π/2`: `0 ≠ 2`." },
            { t:"`sin(x + π) = sin x`", why:"A half turn flips the sign: `-sin x`." },
            { t:"`cos x = √{1 - sin^2 x}`", why:"Fails where `cos x < 0`, e.g. `x = π`." }],
          hints:["Test each with a value.", "Rewrite `tan x` as `sin x/cos x`.", "Only `tan x cos x = sin x` always holds."] },
        { id:"d9", topic:"29", goal:5,
          prompt:"Which values show that `sin(x + y) = sin x + sin y` is <strong>not</strong> an identity?",
          options:[
            { t:"`x = y = π/2`", ok:true, why:"`sin π = 0`, but `sin(π/2) + sin(π/2) = 2`." },
            { t:"`x = y = 0`", why:"Both sides are 0: they agree." },
            { t:"`x = 0`, `y = π`", why:"Both sides are 0." },
            { t:"`x = y = π`", why:"`sin 2π = 0 = 0 + 0`." }],
          hints:["A counterexample makes the sides <strong>different</strong>.", "Try angles with sine 1.", "`π/2` and `π/2`."] }
      ]
    }
  },

  // ---------- Connect: identity toolbox map (N18 connection builder, rendered by app.connect) ----------
  connect:{
    heading:"Identity toolbox map",
    intro:"You met the Chapter 4 identities one module at a time, but they’re a family: each one comes from the circle or from another identity, and each job needs a particular one. Link the cards to build the map.",
    summary:"Toolbox map",
    how:"Tap two cards, choose the link word, then press Link.",
    ui:{ src:"Where it comes from", id:"Identities", job:"Jobs", from:"comes from", use:"is used to", word:"Link word:", link:"Link", clear:"Clear",
      card1:"Card 1", card2:"Card 2", none:"none yet",
      needAll:"Choose two cards and a link word first.",
      notStem:"This link is about §1. Make it one of your two cards.",
      labelFrom:"This link says where an identity comes from: choose “comes from”.",
      labelUse:"A job doesn’t come from an identity; the identity is used to do the job. Choose “is used to”.",
      chainHead:"Tools in order:", chainCheck:"Check the order", chainReset:"Start over", chainFull:"Two tools are in. Check the order, or start over.",
      chainNeed:"Link at least one tool to this job first.", chainAdded:"Added as tool §1. Link the next tool, or check the order.",
      splitQ:"Which way of writing `cos(π/12)` would you use? Tap one.", done:"All eight links made." },
    cards:{
      src:[
        { id:"s_circle", t:"the point `(cos x, sin x)` on a circle of radius 1" },
        { id:"s_tri", t:"the right triangle with angles `x` and `π/2 - x`" },
        { id:"s_divc", t:"dividing `sin^2 x + cos^2 x = 1` by `cos^2 x`" },
        { id:"s_divs", t:"dividing `sin^2 x + cos^2 x = 1` by `sin^2 x`" },
        { id:"s_sinab", t:"`sin(a + b)` with `a = b = x`" },
        { id:"s_cosab", t:"`cos(a + b)` with `a = b = x`" },
        { id:"s_cosamb", t:"`cos(a - b)` with `a = π/2`" }],
      id:[
        { id:"i_pyth", name:"Pythagorean", t:"`sin^2 x + cos^2 x = 1`" },
        { id:"i_tan", name:"Pythagorean (tan and sec)", t:"`1 + tan^2 x = sec^2 x`" },
        { id:"i_quot", name:"Quotient", t:"`tan x = {sin x}/{cos x}`" },
        { id:"i_rec", name:"Reciprocal", t:"`csc x = 1/sin x`, `sec x = 1/cos x`, `cot x = 1/tan x`" },
        { id:"i_cof", name:"Cofunction", t:"`cos(π/2 - x) = sin x`" },
        { id:"i_rel", name:"Related angle", t:"`cos(π - x) = -cos x`: reference angle and CAST" },
        { id:"i_comp", name:"Compound angle", t:"`sin(a ± b)`, `cos(a ± b)`" },
        { id:"i_dbl", name:"Double angle", t:"`sin 2x = 2 sin x cos x`, `cos 2x = cos^2 x - sin^2 x`" }],
      job:[
        { id:"j_76", t:"find `cos(7π/6)` exactly" },
        { id:"j_12", t:"find `cos(π/12)` exactly" },
        { id:"j_pr", t:"prove `{1 - cos^2 x}/{sin x} = sin x`" },
        { id:"j_c2", t:"write `cos 2x` using only `sin x`" }]
    },
    challenges:[
      { id:"TM1", topics:["26", "29"], goal:6, type:"link", stem:"i_pyth", label:"from",
        prompt:"`sin^2 x + cos^2 x = 1` <strong>comes from</strong> …",
        answer:"s_circle|s_tri",
        why:{ s_circle:"The point `(cos x, sin x)` is 1 unit from the origin, so the Pythagorean theorem on its reference triangle (legs `cos x` and `sin x`, hypotenuse 1) gives `cos^2 x + sin^2 x = 1`.",
          s_tri:"That works too: in any right triangle, `(opposite/hypotenuse)^2 + (adjacent/hypotenuse)^2 = 1`. On the unit circle the hypotenuse is 1 and the legs are `cos x` and `sin x`." },
        fb:{ i_comp:"It’s the Pythagorean theorem on the reference triangle with hypotenuse 1.",
          def:"That card doesn’t lead to `sin^2 x + cos^2 x = 1`. Which picture has legs `cos x` and `sin x` and hypotenuse 1?" } },
      { id:"TM2", topics:["29"], goal:6, type:"link", stem:"i_tan", label:"from",
        prompt:"`1 + tan^2 x = sec^2 x` <strong>comes from</strong> …",
        answer:"s_divc",
        why:{ s_divc:"`{sin^2 x}/{cos^2 x} + {cos^2 x}/{cos^2 x} = {1}/{cos^2 x}` is `tan^2 x + 1 = sec^2 x`." },
        fb:{ s_divs:"Dividing by `sin^2 x` gives `1 + cot^2 x = csc^2 x`.",
          i_pyth:"Close: it does come from the Pythagorean identity. Which card says what you do to it?",
          def:"Which card turns `sin x` and `cos x` into `tan x` and `sec x`?" } },
      { id:"TM3", topics:["28"], goal:[4, 6], type:"link", stem:"i_dbl", label:"from",
        prompt:"`sin 2x = 2 sin x cos x` <strong>comes from</strong> …",
        answer:"s_sinab",
        why:{ s_sinab:"`sin(x + x) = sin x cos x + cos x sin x = 2 sin x cos x`." },
        fb:{ s_cosab:"That gives `cos 2x`.",
          i_comp:"Close: it comes from one compound-angle formula with both angles the same. Which card says that?",
          def:"`2x = x + x`. Which card adds an angle to itself?" } },
      { id:"TM4", topics:["27"], goal:[3, 6], type:"link", stem:"i_cof", label:"from",
        prompt:"`cos(π/2 - x) = sin x` <strong>comes from</strong> …",
        answer:"s_cosamb|s_tri",
        why:{ s_cosamb:"`cos(π/2 - x) = cos(π/2) cos x + sin(π/2) sin x = 0 + sin x = sin x`.",
          s_tri:"In the right triangle, the side opposite `x` is adjacent to `π/2 - x`, so `cos(π/2 - x) = sin x`." },
        fb:{ i_rel:"That gives `-cos x` for cosine.",
          i_comp:"Close: which compound-angle formula, with which value of `a`?",
          def:"That card doesn’t swap cosine for sine. Which one subtracts `x` from `π/2`?" } },
      { id:"TM5", topics:["26"], goal:[2, 6], type:"link", stem:"j_76", label:"use",
        prompt:"The job “find `cos(7π/6)` exactly” <strong>uses</strong> …",
        answer:"i_rel|i_comp",
        why:{ i_rel:"`7π/6 = π + π/6`: reference angle `π/6` for the size, and cosine is negative in quadrant 3 (CAST), so `cos(7π/6) = -√3/2`.",
          i_comp:"That works too: `cos(π + π/6) = cos π cos(π/6) - sin π sin(π/6) = -√3/2`. The reference angle `π/6` and CAST get there faster." },
        fb:{ i_dbl:"`7π/6` isn’t double a special angle in a helpful way; it’s `π + π/6`.",
          def:"`7π/6 = π + π/6`. Which card handles an angle past π?" } },
      { id:"TM6", topics:["28"], goal:[4, 6], type:"link", stem:"j_12", label:"use",
        prompt:"The job “find `cos(π/12)` exactly” <strong>uses</strong> …",
        answer:"i_comp",
        why:{ i_comp:"`π/12` isn’t a special angle, but it’s a difference of two special angles, so the compound-angle formula `cos(a - b)` gives its cosine exactly." },
        fb:{ def:"`π/12` isn’t a special angle. Can you write it as a difference of two special angles?" },
        split:[
          { t:"`cos(π/12) = cos(π/3 - π/4)`", ok:true, why:"`cos(π/3 - π/4) = (1/2)(√2/2) + (√3/2)(√2/2) = {√2 + √6}/{4}`." },
          { t:"`cos(π/12) = cos(π/4 - π/6)`", ok:true, why:"`cos(π/4 - π/6) = (√2/2)(√3/2) + (√2/2)(1/2) = {√6 + √2}/{4}`: the same value as `π/3 - π/4` gives." },
          { t:"`cos(π/12) = cos(π/3) - cos(π/4)`", why:"Functions don’t distribute over a difference." }] },
      { id:"TM7", topics:["29"], goal:[5, 6], type:"link", stem:"j_pr", label:"use",
        prompt:"The job “prove `{1 - cos^2 x}/{sin x} = sin x`” <strong>uses</strong> …",
        answer:"i_pyth",
        why:{ i_pyth:"LS: `1 - cos^2 x = sin^2 x`, so `{sin^2 x}/{sin x} = sin x` = RS." },
        fb:{ i_dbl:"There’s no `2x` here; `1 - cos^2 x` is `sin^2 x`.",
          def:"Look at the top: `1 - cos^2 x`. Which identity rewrites it?" } },
      { id:"TM8", topics:["28", "29"], goal:[4, 6], type:"chain", stem:"j_c2", label:"use", stretch:true,
        prompt:"The job “write `cos 2x` using only `sin x`” <strong>uses, in order</strong> …",
        answer:"i_dbl>i_pyth",
        why:{ chain:"Double angle first: `cos 2x = cos^2 x - sin^2 x`. Then the Pythagorean identity replaces `cos^2 x` with `1 - sin^2 x`: `cos 2x = 1 - 2 sin^2 x`." },
        fb:{ one:"`cos 2x = cos^2 x - sin^2 x` still has a cosine; replace it with `1 - sin^2 x`.",
          order:"Start with `cos 2x` itself: the double angle turns it into `cos^2 x - sin^2 x` first. Then the Pythagorean identity replaces `cos^2 x`.",
          def:"You need two tools: one that writes `cos 2x` with `cos x` and `sin x`, then one that swaps `cos^2 x` for something in `sin x`." } }
    ],
    onePage:{
      title:"The chapter on one page",
      intro:"The finished map: the unit circle in the centre, and each identity card with where it comes from and the module that taught it.",
      aria:"Unit circle with the point (cos x, sin x) and its reference triangle: legs cos x and sin x, hypotenuse 1. The eight identity cards sit around it.",
      ids:[
        { id:"i_pyth", from:"comes from the point `(cos x, sin x)` on a circle of radius 1", mods:"26 and 29" },
        { id:"i_tan", from:"comes from dividing `sin^2 x + cos^2 x = 1` by `cos^2 x`", mods:"29" },
        { id:"i_quot", from:"comes from the point: `tan x = y/x`", mods:"26 and 29" },
        { id:"i_rec", from:"flips sin, cos and tan: each pair has exactly one “co”", mods:"26" },
        { id:"i_cof", from:"comes from `cos(a - b)` with `a = π/2`, or the right triangle", mods:"27" },
        { id:"i_rel", from:"comes from reflecting the point: same size, CAST for the sign", mods:"26 and 27" },
        { id:"i_comp", from:"comes from turning on from angle `a` by angle `b`", mods:"28" },
        { id:"i_dbl", from:"comes from `sin(a + b)` and `cos(a + b)` with `a = b = x`", mods:"28" }],
      jobsTitle:"Jobs and their tools",
      jobs:[
        "Find `cos(7π/6)` exactly: reference angle `π/6` and CAST.",
        "Find `cos(π/12)` exactly: `cos(a - b)` with `π/3` and `π/4` (or `π/4` and `π/6`).",
        "Prove `{1 - cos^2 x}/{sin x} = sin x`: the Pythagorean identity.",
        "Write `cos 2x` using only `sin x`: double angle, then Pythagorean, giving `1 - 2 sin^2 x`."] }
  },

  // ---------- Mixed practice: 12 items in a fixed, interleaved order (rendered by app.activities.mx) ----------
  mixed:{
    heading:"Mixed practice",
    intro:"Twelve questions from every Chapter 4 module, mixed up on purpose, so you practise choosing the right idea. Each has three levels of help. You can try again after a wrong answer.",
    activities:[
      { id:"mx", type:"custom", title:"Twelve questions from all five modules", summary:"Mixed practice",
        items:[
          { id:"mp1", topic:"28", goal:4, kind:"num", star:true,
            prompt:"`sin a = 3/5` and `cos b = 5/13`, with `a` and `b` in quadrant 1. Find `sin(a + b)`.",
            label:"`sin(a + b) =`", answer:63 / 65, display:"`sin(a + b) = 63/65`",
            why:"`cos a = 4/5` and `sin b = 12/13`: `(3/5)(5/13) + (4/5)(12/13)`.",
            hints:["Find `cos a` and `sin b` first.", "Pythagorean identity: `4/5` and `12/13`.", "`15/65 + 48/65 = 63/65`."] },
          { id:"mp2", topic:"25", goal:1, kind:"pi",
            prompt:"A wheel turns at 120 revolutions per minute. What is its angular velocity in radians per second?",
            label:"Angular velocity:", unit:"rad/s", answer:4, display:"`4π` rad/s",
            why:"One revolution is `2π`, so `120 × 2π = 240π` rad per minute; divide by 60 to get `4π` rad/s.",
            wrong:[{ match:240, fb:"That’s per minute. Divide by 60." }],
            hints:["One revolution = `2π`.", "`120 × 2π = 240π` per minute.", "`4π` rad/s."] },
          { id:"mp3", topic:"29", goal:5, kind:"mc",
            prompt:"To prove `sec x - cos x = sin x tan x`, which is the best first step?",
            options:[
              { t:"Rewrite the left side as `1/cos x - cos x`", ok:true, why:"Then `{1 - cos^2 x}/{cos x} = {sin^2 x}/{cos x} = sin x tan x`, working on one side only." },
              { t:"Multiply both sides by `cos x`", why:M6 },
              { t:"Replace `sin x tan x` by `sin^2 x`", why:"`sin x tan x = {sin^2 x}/{cos x}`." },
              { t:"Square both sides", why:"That works on both sides at once. " + M6 }],
            hints:["Work on the more complicated side.", "`sec = 1/cos`.", "`{1 - cos^2 x}/{cos x} = {sin^2 x}/{cos x} = sin x tan x`."] },
          { id:"mp4", topic:"26", goal:2, kind:"circle",
            prompt:"All `θ` in `[0, 2π]` with `tan θ = -1`.",
            ratio:"tan", value:"−1",
            answer:[9, 21], display:"`θ = 3π/4` and `θ = 7π/4`",
            why:"`tan θ = -1` needs `sin θ` and `cos θ` the same size with opposite signs: reference angle `π/4` in quadrants 2 and 4.",
            rules:[{ any:[15], fb:"`tan(5π/4) = +1`." }],
            hints:["`tan θ = -1` when `sin θ` and `cos θ` have the same size and opposite signs.", "Same size: reference angle `π/4`. Opposite signs: quadrants 2 and 4.", "`3π/4` and `7π/4`."] },
          { id:"mp5", topic:"27", goal:3, kind:"mc",
            prompt:"`sin(π - x)` equals…",
            options:[
              { t:"`sin x`", ok:true, why:"`π - x` mirrors `x` in the `y`-axis: same height." },
              { t:"`-sin x`", why:"`π - x` mirrors `x` in the `y`-axis: same height." },
              { t:"`cos x`", why:"That’s `sin(π/2 - x)`." },
              { t:"`-cos x`", why:"That’s `cos(π - x)`." }],
            hints:["Where is the point for `π - x`, compared with the point for `x`?", "It’s the reflection in the `y`-axis: the same `y`-coordinate.", "`sin x`."] },
          { id:"mp6", topic:"25", goal:1, kind:"num", keypad:"decimal",
            prompt:"Convert `3π/5` to degrees.",
            label:"`3π/5` =", unit:"°", answer:108, display:"108°",
            why:"π = 180°, so `3π/5` = 3 × 36° = 108°.",
            wrong:[{ match:216, fb:"π = 180°, so `3π/5` = 3 × 36°." }],
            hints:["Replace π with 180°.", "180° ÷ 5 = 36°.", "3 × 36° = 108°."] },
          { id:"mp7", topic:"28", goal:4, kind:"num",
            prompt:"If `sin x = 1/3`, find `cos 2x`.",
            label:"`cos 2x =`", answer:7 / 9, display:"`cos 2x = 7/9`",
            why:"`cos 2x = 1 - 2 sin^2 x = 1 - 2/9 = 7/9`.",
            wrong:[{ match:2 / 3, fb:"`cos 2x = 1 - 2 sin^2 x = 1 - 2/9`." }],
            hints:["Choose the `cos 2x` form with sin only.", "`1 - 2 sin^2 x`.", "`7/9`."] },
          { id:"mp8", topic:"26", goal:2, kind:"mc", star:true,
            prompt:"A point on a circle of radius 10 centred at the origin is at angle `4π/3`. What are its coordinates?",
            options:[
              { t:"`(-5, -5√3)`", ok:true, why:"`(10 cos(4π/3), 10 sin(4π/3)) = (10(-1/2), 10(-√3/2))`." },
              { t:"`(-5√3, -5)`", why:"Sizes swapped." },
              { t:"`(5, -5√3)`", why:"Quadrant 3: `x` negative." },
              { t:"`(-1/2, -√3/2)`", why:"Multiply by 10." }],
            hints:["The point is `(10 cos(4π/3), 10 sin(4π/3))`.", "Reference angle `π/3`, quadrant 3: both coordinates negative.", "`(-5, -5√3)`."] },
          { id:"mp9", topic:"29", goal:5, kind:"mc", star:true,
            prompt:"Is `(sin x + cos x)^2 = 1 + sin 2x` an identity?",
            options:[
              { t:"Yes: the left side expands to `sin^2 x + 2 sin x cos x + cos^2 x = 1 + sin 2x`", ok:true, why:"`sin^2 x + cos^2 x = 1` and `2 sin x cos x = sin 2x`, so the left side becomes the right side." },
              { t:"No: at `x = 0` the sides are 1 and 1", why:"Agreeing at a value doesn’t disprove it; that’s backwards." },
              { t:"No: `(a + b)^2 = a^2 + b^2`", why:"That drops the middle term." },
              { t:"Yes, because both sides equal 1 for every `x`", why:"At `x = π/4` both sides are 2." }],
            hints:["Expand the left side.", "`(sin x + cos x)^2 = sin^2 x + 2 sin x cos x + cos^2 x`.", "`= 1 + sin 2x`: it’s an identity."] },
          { id:"mp10", topic:"27", goal:3, kind:"mc", star:true,
            prompt:"Which expression equals `cos(x + π/2)`?",
            options:[
              { t:"`-sin x`", ok:true, why:"`cos(x + π/2) = cos x · 0 - sin x · 1 = -sin x`." },
              { t:"`sin x`", why:"`cos(x + π/2) = cos x · 0 - sin x · 1`." },
              { t:"`cos x`", why:"Adding `π/2` turns the point a quarter turn, so the value changes. Use `cos(a + b)`." },
              { t:"`-cos x`", why:"That’s `cos(x + π)`." }],
            hints:["Use `cos(a + b) = cos a cos b - sin a sin b`.", "`cos(π/2) = 0` and `sin(π/2) = 1`.", "`-sin x`."] },
          { id:"mp11", topic:"25", goal:1, kind:"num", star:true, keypad:"decimal",
            prompt:"An arc of length `5π` cm subtends an angle of `5π/6` at the centre. What is the radius?",
            label:"`r =`", unit:"cm", answer:6, display:"6 cm",
            why:"`r = a/θ = 5π ÷ 5π/6 = 6` cm.",
            wrong:[{ match:25 * Math.PI * Math.PI / 6, fb:"That multiplies; `r = a/θ`." }],
            hints:["`a = rθ`, so `r = a/θ`.", "`5π ÷ 5π/6 = 5π × 6/(5π)`.", "6 cm."] },
          { id:"mp12", topic:"28", goal:4, kind:"mc", star:true, fixedOrder:true,   // exact values in increasing order
            prompt:"`tan(π/12)` exactly?",
            options:[
              { t:"`{√6 - √2}/{4}`", why:"That’s `sin(π/12)`." },
              { t:"`2 - √3`", ok:true, why:"`tan(π/3 - π/4) = {√3 - 1}/{1 + √3}`; rationalized, that’s `2 - √3`." },
              { t:"`√3 - 1`", why:"That’s `tan(π/3) - tan(π/4)`. " + M3 },
              { t:"`2 + √3`", why:"That’s `tan(5π/12)`." }],
            hints:["`tan(π/3 - π/4)`.", "`{√3 - 1}/{1 + √3}`.", "Rationalize: `2 - √3`."] }
        ] }
    ]
  },

  reflect:{
    journal:[
      { id:"j1", q:"Which link in the toolbox map surprised you most?" },
      { id:"j2", q:"In your own words, why is one counterexample enough to show an equation isn’t an identity, but one agreeing value proves nothing?" },
      { id:"j3", q:"Explain to a friend how to find `sin(7π/12)` exactly." },
      { id:"j4", q:"Which module will you revisit, and what exactly will you practise there?" }
    ]
  },

  final:{
    intro:"This shows what you’ve learned across the whole chapter, so there are no hints here. Answer all 15 questions and say how sure you are. Then submit to see your results by category and by module. Each question is labelled with its achievement chart category and its module.",
    questions:[
      { id:"f1", cat:"K", topic:"25", goal:1,
        a:{ fixedOrder:true, prompt:"What is `3π/4` in degrees?",
          options:[
            { t:"45°", why:"That’s `π/4`." },
            { t:"135°", ok:true, why:"`3π/4` = 3 × 180° ÷ 4 = 135°." },
            { t:"270°", why:M1 },
            { t:"540°", why:"That’s 3 × 180 ÷ 1." }] },
        b:{ fixedOrder:true, prompt:"What is `7π/6` in degrees?",
          options:[
            { t:"30°", why:"That’s `π/6`." },
            { t:"210°", ok:true, why:"`7π/6` = 7 × 180° ÷ 6 = 210°." },
            { t:"420°", why:M1 },
            { t:"1260°", why:"That’s 7 × 180 ÷ 1." }] } },
      { id:"f2", cat:"K", topic:"26", goal:2,
        a:{ fixedOrder:true, prompt:"What is the exact value of `sec(2π/3)`?",
          options:[
            { t:"−2", ok:true, why:"`cos(2π/3) = -1/2`." },
            { t:"`-{2√3}/{3}`", why:"That’s csc’s partner: `1/sin`." },
            { t:"`-1/2`", why:"That’s cos; sec is its reciprocal." },
            { t:"2", why:M2 }] },
        b:{ fixedOrder:true, prompt:"What is the exact value of `cot(5π/4)`?",
          options:[
            { t:"`-√2`", why:"That’s `csc(5π/4)`." },
            { t:"−1", why:"Tangent is positive in quadrant 3." },
            { t:"0", why:"cot is 0 only where cos is 0, at `π/2` and `3π/2`." },
            { t:"1", ok:true, why:"`tan(5π/4) = 1`." }] } },
      { id:"f3", cat:"K", topic:"28", goal:4,
        a:{ prompt:"Which expression is identical to `cos(a - b)`?",
          options:[
            { t:"`cos a cos b + sin a sin b`", ok:true, why:M4 },
            { t:"`cos a cos b - sin a sin b`", why:M4 },
            { t:"`cos a - cos b`", why:"Functions don’t distribute over a difference: try `a = b`, where `cos 0 = 1`, not 0." },
            { t:"`sin a cos b - cos a sin b`", why:"That’s `sin(a - b)`." }] },
        b:{ prompt:"Which expression is identical to `sin(a + b)`?",
          options:[
            { t:"`sin a cos b + cos a sin b`", ok:true, why:"The sine of a sum keeps the plus: `sin a cos b + cos a sin b`." },
            { t:"`sin a + sin b`", why:M3 },
            { t:"`cos a cos b - sin a sin b`", why:"That’s `cos(a + b)`." },
            { t:"`sin a cos b - cos a sin b`", why:"That’s `sin(a - b)`." }] } },
      { id:"f4", cat:"K", topic:"29", goal:5,
        a:{ prompt:"Which Pythagorean identity relates tan and sec?",
          options:[
            { t:"`1 + tan^2 x = sec^2 x`", ok:true, why:"Divide `sin^2 x + cos^2 x = 1` by `cos^2 x`: `tan^2 x + 1 = sec^2 x`." },
            { t:"`tan^2 x - 1 = sec^2 x`", why:"Divide `sin^2 x + cos^2 x = 1` by `cos^2 x`." },
            { t:"`1 + sec^2 x = tan^2 x`", why:"Divide `sin^2 x + cos^2 x = 1` by `cos^2 x`." },
            { t:"`tan^2 x + sec^2 x = 1`", why:"Divide `sin^2 x + cos^2 x = 1` by `cos^2 x`." }] },
        b:{ prompt:"Which Pythagorean identity relates cot and csc?",
          options:[
            { t:"`1 + cot^2 x = csc^2 x`", ok:true, why:"Divide `sin^2 x + cos^2 x = 1` by `sin^2 x`: `1 + cot^2 x = csc^2 x`." },
            { t:"`cot^2 x - 1 = csc^2 x`", why:"Divide `sin^2 x + cos^2 x = 1` by `sin^2 x`." },
            { t:"`1 + csc^2 x = cot^2 x`", why:"Divide `sin^2 x + cos^2 x = 1` by `sin^2 x`." },
            { t:"`cot^2 x + csc^2 x = 1`", why:"Divide `sin^2 x + cos^2 x = 1` by `sin^2 x`." }] } },
      { id:"f5", cat:"T", topic:"26", goal:2,
        a:{ fixedOrder:true, prompt:"`cos θ = -√3/2` and `tan θ > 0`, with `0 ≤ θ ≤ 2π`. Find `θ`.",
          options:[
            { t:"`5π/6`", why:"In quadrant 2, tangent is negative." },
            { t:"`7π/6`", ok:true, why:"Cosine negative, tangent positive: quadrant 3; reference `π/6`." },
            { t:"`4π/3`", why:"`cos(4π/3) = -1/2`." },
            { t:"`7π/4`", why:"`cos(7π/4)` is positive." }] },
        b:{ fixedOrder:true, prompt:"`sin θ = -√2/2` and `cos θ > 0`, with `0 ≤ θ ≤ 2π`. Find `θ`.",
          options:[
            { t:"`3π/4`", why:"`sin(3π/4)` is positive." },
            { t:"`5π/4`", why:"In quadrant 3, cosine is negative." },
            { t:"`5π/3`", why:"`sin(5π/3) = -√3/2`." },
            { t:"`7π/4`", ok:true, why:"Quadrant 4; reference `π/4`." }] } },
      { id:"f6", cat:"T", topic:"28", goal:4,
        a:{ fixedOrder:true, prompt:"What is the exact value of `cos(5π/12)`?",
          options:[
            { t:"`{√2 - √6}/{4}`", why:"That subtracts in the wrong order: it’s negative, but `5π/12` is in quadrant 1." },
            { t:"`{√6 - √2}/{4}`", ok:true, why:"`cos(π/4 + π/6) = (√2/2)(√3/2) - (√2/2)(1/2)`." },
            { t:"`{√6 + √2}/{4}`", why:"Cosine of a sum has a minus." },
            { t:"`{√2 + √3}/{2}`", why:"That’s `cos(π/4) + cos(π/6)`." }] },
        b:{ fixedOrder:true, prompt:"What is the exact value of `sin(7π/12)`?",
          options:[
            { t:"`{√2 - √6}/{4}`", why:"Negative, but `7π/12` is in quadrant 2, where sine is positive." },
            { t:"`{√6 - √2}/{4}`", why:"Cosine flips the sign, but sine keeps it: `sin(a + b) = sin a cos b + cos a sin b`." },
            { t:"`{√6 + √2}/{4}`", ok:true, why:"`sin(π/3 + π/4) = (√3/2)(√2/2) + (1/2)(√2/2)`." },
            { t:"`{√3 + √2}/{2}`", why:"That’s `sin(π/3) + sin(π/4)`." }] } },
      { id:"f7", cat:"T", topic:"29", goal:5,
        a:{ fixedOrder:true, prompt:"Which value of `x` shows that `sin 2x = 2 sin x` is <strong>not</strong> an identity?",
          options:[
            { t:"`x = 0`", why:"Both sides are 0." },
            { t:"`x = π/2`", ok:true, why:"`sin π = 0`, but `2 sin(π/2) = 2`." },
            { t:"`x = π`", why:"Both sides are 0." },
            { t:"`x = 2π`", why:"Both sides are 0." }] },
        b:{ fixedOrder:true, prompt:"Which value of `x` shows that `cos(x + π) = cos x` is <strong>not</strong> an identity?",
          options:[
            { t:"`x = -π/2`", why:"Both sides are 0." },
            { t:"`x = 0`", ok:true, why:"`cos π = -1`, but `cos 0 = 1`." },
            { t:"`x = π/2`", why:"Both sides are 0." },
            { t:"`x = 3π/2`", why:"Both sides are 0." }] } },
      { id:"f8", cat:"T", topic:"28", goal:4,
        a:{ prompt:"`sin x = 4/5` and `π/2 < x < π`. Find `sin 2x`.",
          options:[
            { t:"`-24/25`", ok:true, why:"`cos x = -3/5` in quadrant 2; `2(4/5)(-3/5)`." },
            { t:"`24/25`", why:"Cosine is negative in quadrant 2." },
            { t:"`8/5`", why:"That’s `2 sin x`; it’s bigger than 1, which is impossible for a sine." },
            { t:"`-7/25`", why:"That’s `cos 2x`." }] },
        b:{ prompt:"`cos x = -5/13` and `π < x < 3π/2`. Find `sin 2x`.",
          options:[
            { t:"`120/169`", ok:true, why:"`sin x = -12/13` in quadrant 3; `2(-12/13)(-5/13)`." },
            { t:"`-120/169`", why:"Sine is negative in quadrant 3 too, so the product is positive." },
            { t:"`-10/13`", why:"That’s `2 cos x`." },
            { t:"`-119/169`", why:"That’s `cos 2x`." }] } },
      { id:"f9", cat:"C", topic:"27", goal:3,
        a:{ prompt:"Which is the best explanation of why `sin(π/2 - x) = cos x`?",
          options:[
            { t:"“In a right triangle the acute angles `x` and `π/2 - x` share the hypotenuse, and the side opposite one is adjacent to the other, so the sine of one is the cosine of the other.”", ok:true,
              why:"One triangle, two acute angles: the opposite side for one is the adjacent side for the other." },
            { t:"“Because sine and cosine have the same period.”", why:"Equal periods don’t make values equal." },
            { t:"“Because `π/2 - x` is the reference angle of `x`.”", why:"Reference angles are measured to the `x`-axis." },
            { t:"“Because sine is an odd function.”", why:"Oddness gives `sin(-x) = -sin x`." }] },
        b:{ prompt:"Which is the best explanation of why `cos(π - x) = -cos x`?",
          options:[
            { t:"“`π - x` is the reflection of `x` in the `y`-axis: its point has the same `y`-coordinate and the opposite `x`-coordinate, so its cosine is `-cos x`.”", ok:true,
              why:"Reflecting in the `y`-axis keeps the height and flips the `x`-coordinate, which is the cosine." },
            { t:"“Because cosine is an odd function.”", why:"Cosine is even." },
            { t:"“Because `π - x` is in quadrant 3.”", why:"For small `x`, `π - x` is in quadrant 2." },
            { t:"“Because `cos π = -1`, so `cos(π - x) = -1 - cos x`.”", why:"Cosine doesn’t distribute over a difference: `cos(π - x) ≠ cos π - cos x`." }] } },
      { id:"f10", cat:"C", topic:"29", goal:5,
        a:{ prompt:"Which is a correctly written proof that `tan x csc x = sec x`?",
          options:[
            { t:"“LS = `(sin x/cos x)(1/sin x) = 1/cos x = sec x` = RS”", ok:true, why:"It starts with one side and transforms it, step by step, into the other side." },
            { t:"“`tan x csc x = sec x`, so `(sin x/cos x)(1/sin x) = 1/cos x`, so 1 = 1.”", why:"It starts from what it’s trying to prove." },
            { t:"“LS = `(sin x/cos x)(1/cos x) = sec x` = RS.”", why:"`csc x = 1/sin x`." },
            { t:"“Multiply both sides by `cos x`: `sin x csc x = 1`, which is true.”", why:M6 }] },
        b:{ prompt:"Which is a correctly written proof that `cot x sec x = csc x`?",
          options:[
            { t:"“LS = `(cos x/sin x)(1/cos x) = 1/sin x = csc x` = RS”", ok:true, why:"It starts with one side and transforms it, step by step, into the other side." },
            { t:"“`cot x sec x = csc x`, so `(cos x/sin x)(1/cos x) = 1/sin x`, so 1 = 1.”", why:"It starts from what it’s trying to prove." },
            { t:"“LS = `(cos x/sin x)(1/sin x) = csc x` = RS.”", why:"`sec x = 1/cos x`." },
            { t:"“Multiply both sides by `sin x`: `cos x sec x = 1`, which is true.”", why:M6 }] } },
      { id:"f11", cat:"C", topic:"25", goal:1,
        a:{ prompt:"Which best explains what 1 radian is?",
          options:[
            { t:"“The central angle that cuts off an arc as long as the radius.”", ok:true, why:"Arc length equal to the radius: `θ = a/r = 1`." },
            { t:"“1/360 of a full turn.”", why:"That’s a degree." },
            { t:"“The angle whose sine is 1.”", why:"That’s `π/2`." },
            { t:"“π degrees.”", why:"π radians = 180°." }] },
        b:{ prompt:"Which best explains why a full turn is `2π` radians?",
          options:[
            { t:"“The circumference is `2πr`, so exactly `2π` radius-lengths fit around the circle.”", ok:true, why:"`θ = a/r = 2πr/r = 2π`." },
            { t:"“Because 360 ÷ 180 = 2.”", why:"That gives 2, not `2π`." },
            { t:"“Because π is half a circle by definition.”", why:"π = 180° is a result, not the definition of a radian." },
            { t:"“Because the circle’s area is `πr^2`.”", why:"Area isn’t involved." }] } },
      { id:"f12", cat:"A", topic:"25", goal:1,
        a:{ fixedOrder:true, prompt:"A bike wheel of radius 35 cm turns through `4π/5` radians without slipping. How far does the bike move?",
          options:[
            { t:"`4π/175` cm", why:"That’s `θ ÷ r`." },
            { t:"`28π` cm", ok:true, why:"`a = rθ = 35 × 4π/5`." },
            { t:"`56π` cm", why:"That doubles the arc." },
            { t:"5040 cm", why:"That uses 144° instead of `4π/5`." }] },
        b:{ fixedOrder:true, prompt:"A wheel of radius 40 cm turns through `3π/4` radians. How far does it roll?",
          options:[
            { t:"`3π/160` cm", why:"That’s `θ ÷ r`." },
            { t:"`30π` cm", ok:true, why:"`a = rθ = 40 × 3π/4`." },
            { t:"`60π` cm", why:"That doubles the arc." },
            { t:"5400 cm", why:"That uses 135° instead of `3π/4`." }] } },
      { id:"f13", cat:"A", topic:"26", goal:2,
        a:{ prompt:"A Ferris-wheel seat moves on a circle of radius 12 m centred at the origin. It has rotated `5π/6` from the positive `x`-axis. What are its coordinates?",
          options:[
            { t:"`(-6√3, 6)`", ok:true, why:"`(12 cos(5π/6), 12 sin(5π/6))`." },
            { t:"`(6√3, 6)`", why:"Quadrant 2: `x` negative." },
            { t:"`(-6, 6√3)`", why:"Sizes swapped: `cos(π/6) = √3/2` is the larger." },
            { t:"`(-√3/2, 1/2)`", why:"Multiply by 12." }] },
        b:{ prompt:"A seat on a circle of radius 8 m has rotated `5π/3`. What are its coordinates?",
          options:[
            { t:"`(4, -4√3)`", ok:true, why:"`(8 cos(5π/3), 8 sin(5π/3))`." },
            { t:"`(-4, -4√3)`", why:"Quadrant 4: `x` positive." },
            { t:"`(4√3, -4)`", why:"Sizes swapped: `cos(π/3) = 1/2` is the smaller." },
            { t:"`(1/2, -√3/2)`", why:"Multiply by 8." }] } },
      { id:"f14", cat:"A", topic:"28", goal:4,
        a:{ prompt:"A ladder makes an angle `θ` with the ground, with `sin θ = 3/5`. A second ladder makes angle `2θ`. What is the sine of the second ladder’s angle?",
          options:[
            { t:"`24/25`", ok:true, why:"`cos θ = 4/5`; `sin 2θ = 2(3/5)(4/5)`." },
            { t:"`6/5`", why:"A sine can’t exceed 1: `2 sin θ` isn’t `sin 2θ`." },
            { t:"`7/25`", why:"That’s `cos 2θ`." },
            { t:"`9/25`", why:"That’s `sin^2 θ`." }] },
        b:{ prompt:"A cable makes an acute angle `θ` with a pole, with `cos θ = 12/13`. What is `sin 2θ`?",
          options:[
            { t:"`120/169`", ok:true, why:"`sin θ = 5/13`; `2(5/13)(12/13)`." },
            { t:"`24/13`", why:"A sine can’t exceed 1: `2 cos θ` isn’t `sin 2θ`." },
            { t:"`119/169`", why:"That’s `cos 2θ`." },
            { t:"`144/169`", why:"That’s `cos^2 θ`." }] } },
      { id:"f15", cat:"A", topic:"29", goal:5,
        a:{ prompt:"An engineer’s formula contains `{1 - cos^2 x}/{sin x cos x}`. Which simpler expression equals it wherever it’s defined?",
          options:[
            { t:"`tan x`", ok:true, why:"`{sin^2 x}/{sin x cos x} = {sin x}/{cos x}`." },
            { t:"`cot x`", why:"That’s `cos x/sin x`." },
            { t:"1", why:"`1 - cos^2 x` isn’t `sin x cos x`." },
            { t:"`sin x`", why:"Divide by `cos x` too." }] },
        b:{ prompt:"Which simpler expression equals `{1 - sin^2 x}/{sin x cos x}` wherever it’s defined?",
          options:[
            { t:"`cot x`", ok:true, why:"`{cos^2 x}/{sin x cos x} = {cos x}/{sin x}`." },
            { t:"`tan x`", why:"That’s `sin x/cos x`." },
            { t:"1", why:"`1 - sin^2 x` isn’t `sin x cos x`." },
            { t:"`cos x`", why:"Divide by `sin x` too." }] } }
    ]
  },

  task:{
    title:"Build an exact value", summary:"Build an exact value",
    statement:"<p>Choose two special angles `a` and `b` and build `θ = a - b` so that every check passes. Then explain how the compound-angle formula gives `sin θ` exactly. There’s more than one answer.</p>",
    checks:[
      "`a` and `b` are special angles (multiples of `π/6` or `π/4`) from 0 to `2π`.",
      "`θ = a - b` lies between 0 and `2π`.",
      "`sin θ = {√6 + √2}/{4}`.",
      "`cos θ < 0`.",
      "`a` and `b` are in different quadrants, and neither is in quadrant 1 or on an axis."],
    tips:[
      "",
      "",
      "`{√6 + √2}/{4}` is `sin(5π/12)`. Which angle in quadrant 2 has the same sine?",
      "",
      "Try `a` in quadrant 3 or 4 and subtract an angle from a different quadrant."],
    tipNow:[
      "Right now {who} {isnt} a multiple of `π/6` or `π/4` from 0 to `2π`.",
      "Right now `θ = a - b = ` {th}.",
      "Right now `sin θ` {sin}.",
      "Right now `cos θ` {cos}.",
      "Right now `a` is {qa} and `b` is {qb}."],
    ui:{ how:"Type each angle as a multiple of π (for example 5/4 for `5π/4`), or step through the special angles with − and +.",
      dec:"previous special angle", inc:"next special angle", preview:"Your angles on the unit circle",
      rows:{ a:"`a`", b:"`b`", th:"`θ = a - b`", sin:"`sin θ`", cos:"`cos θ`" },
      notSpecial:"not a multiple of `π/12`", invalid:"Enter a multiple of π in each box, such as 5/4 for `5π/4`.",
      q:["on an axis", "in quadrant 1", "in quadrant 2", "in quadrant 3", "in quadrant 4"] },
    explainPrompt:"Use `sin(a - b) = sin a cos b - cos a sin b` to show your `θ` gives `{√6 + √2}/{4}`, and explain why line 4 rules out `5π/12`.",
    success:"Your angles pass all five checks.",
    more:"There’s more than one answer. Can you find another?",
    all4:"That’s all four pairs: (`5π/4`, `2π/3`), (`4π/3`, `3π/4`), (`7π/4`, `7π/6`) and (`11π/6`, `5π/4`). Each gives `θ = 7π/12`."
  },

  cards:[
    ["1 radian", "The central angle that cuts off an arc equal to the radius. π = 180°."],
    ["Arc length and angular velocity", "`a = rθ` (`θ` in radians); `ω = θ/t`."],
    ["The unit circle point", "`(cos θ, sin θ)`."],
    ["Exact values of `π/6`, `π/4`, `π/3`", "sin: `1/2`, `√2/2`, `√3/2`; cos: `√3/2`, `√2/2`, `1/2`."],
    ["CAST", "Q1 All, Q2 Sine, Q3 Tangent, Q4 Cosine positive."],
    ["Reciprocal ratios", "`csc = 1/sin`, `sec = 1/cos`, `cot = 1/tan`."],
    ["Cofunction identities", "`sin(π/2 - x) = cos x`; `cos(π/2 - x) = sin x`."],
    ["Related angles", "`sin(π - x) = sin x`; `cos(π - x) = -cos x`; `sin(π + x) = -sin x`."],
    ["Compound angles", "`sin(a ± b) = sin a cos b ± cos a sin b`; `cos(a ± b) = cos a cos b ∓ sin a sin b`."],
    ["Double angles", "`sin 2x = 2 sin x cos x`; `cos 2x = cos^2 x - sin^2 x = 1 - 2 sin^2 x = 2 cos^2 x - 1`."],
    ["Pythagorean identities", "`sin^2 x + cos^2 x = 1`; `1 + tan^2 x = sec^2 x`; `1 + cot^2 x = csc^2 x`."],
    ["Proving an identity", "Start with one side; transform it until it equals the other."],
    ["Disproving", "One counterexample (the sides differ) is enough."]
  ]
};
