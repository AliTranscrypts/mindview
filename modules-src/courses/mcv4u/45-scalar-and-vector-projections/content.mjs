// MCV4U 45 Scalar and Vector Projections. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/45-scalar-and-vector-projections.md
// misconception core sentences (plan §3)
const M1 = "Divide by the length of the vector you project <strong>onto</strong>: `(vec{a} · vec{b})/|vec{b}|`.";
const M2 = "Turn `vec{b}` into a unit vector first. Overall you divide by `|vec{b}|` twice: `(vec{a} · vec{b})/(vec{b} · vec{b})`.";
const M3 = "A negative scalar projection means the shadow points opposite `vec{b}`: the angle is obtuse.";
const M4 = "Different lines catch different shadows. `(8, 0)` on `(4, 3)` gives 32/5, but `(4, 3)` on `(8, 0)` gives 4.";
const M5 = "The shadow lies on `vec{b}`’s line, so the vector projection is a multiple of `vec{b}`.";
const M6 = "`vec{a} · vec{b} = |vec{b}| ×` (scalar projection). Divide by `|vec{b}|`.";
const M7 = "Perpendicular part `= vec{a} - proj_{vec{b}} vec{a}`. Check: its dot product with `vec{b}` must be 0.";
const A = "`vec{a}`", B = "`vec{b}`";

export default {
  id:"45-scalar-and-vector-projections",
  kind:"topic",
  title:"Scalar and vector projections",
  topic:"Scalar and Vector Projections",
  readyTopic:"scalar and vector projections",
  hero:{
    eq:"`proj_{vec{b}} vec{a} = [{vec{a} · vec{b}}/{vec{b} · vec{b}}] vec{b}` <span class=\"pj-heq2\">scalar projection `{vec{a} · vec{b}}/{|vec{b}|}`</span>",
    eqLabel:"The vector projection of a on b equals a dot b over b dot b, times b. The scalar projection is a dot b over the magnitude of b.",
    eqSize:"sm",
    headline:"Every vector casts a shadow",
    text:"Shine light straight down onto the line of " + B + " and " + A + " casts a shadow. The shadow’s signed length is the <strong>scalar projection</strong>; the shadow itself, as a vector along " + B + ", is the <strong>vector projection</strong>. What’s left over is <strong>perpendicular</strong> to " + B + ", and that split solves problems about work, forces and distances.",
    fig:{ html:'<div class="pj-hero" id="pj-hero" role="img" aria-label="Vector a at 60 degrees to vector b. Light falls straight down onto the line of b, and a casts a highlighted shadow along b. A dashed perpendicular part joins the shadow’s end to the tip of a. Then a swings to 120 degrees and the shadow slides behind the tail: a negative scalar projection."></div>' }
  },
  goals:[
    "I can explain a projection as a shadow and calculate the scalar projection `(vec{a} · vec{b})/|vec{b}|`.",
    "I can calculate the vector projection of `vec{a}` on `vec{b}`.",
    "I can interpret the sign of a scalar projection and the direction of a vector projection.",
    "I can split a vector into a part parallel to `vec{b}` and a part perpendicular to `vec{b}`.",
    "I can use projections to solve problems: work, the part of a force along a direction, and the distance from a point to a line."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Dot product", goal:1, prompt:"`(3, 4) · (2, -1)` = ?",
          options:[
            { t:"2", ok:true, why:"`6 - 4`." },
            { t:"10", why:"`(4)(-1) = -4`." },
            { t:"`(6, -4)`", why:"The dot product is a number." },
            { t:"5", why:"`(3)(-1) + (4)(2)` pairs the wrong components." }],
          hints:["`a_1 b_1 + a_2 b_2`.", "`(3)(2) + (4)(-1)`.", "2."] },
        { id:"w2", skill:"Dot product", goal:1, prompt:"`|vec{a}| = 4`, `|vec{b}| = 10` and the angle between them is 60°. What is `vec{a} · vec{b}`?",
          options:[
            { t:"20", ok:true, why:"`40 cos 60°`." },
            { t:"40", why:"That forgets the `cos θ`: `|vec{a}||vec{b}| cos θ`." },
            { t:"`20√3`", why:"That uses `sin 60°`; the dot product uses `cos θ`." },
            { t:"10", why:"`cos 60° = 1/2`, so `40 × 1/2 = 20`, not 10." }],
          hints:["`|vec{a}||vec{b}| cos θ`.", "`40 × 1/2`.", "20."] },
        { id:"w3", skill:"Unit vectors", goal:2, prompt:"What is the unit vector in the direction of `(6, -8)`?",
          options:[
            { t:"`(3/5, -4/5)`", ok:true, why:"Divide by `|(6, -8)| = 10`." },
            { t:"`(6/14, -8/14)`", why:"Divide by the magnitude." },
            { t:"`(1, -1)`", why:"That has length `√2`, and the wrong direction." },
            { t:"`(-3/5, 4/5)`", why:"That’s the opposite direction." }],
          hints:["Find the magnitude.", "`√(36 + 64) = 10`.", "`(6/10, -8/10)`."] },
        { id:"w4", skill:"Unit vectors", goal:2, prompt:"What vector of length 15 points in the direction of `(1, 2, 2)`?",
          options:[
            { t:"`(5, 10, 10)`", ok:true, why:"`|(1, 2, 2)| = 3`, so multiply the unit vector by 15: `5(1, 2, 2)`." },
            { t:"`(15, 30, 30)`", why:"Make a unit vector first. That has length 45." },
            { t:"`(1/3, 2/3, 2/3)`", why:"That’s the unit vector. Multiply it by 15." },
            { t:"`(3, 6, 6)`", why:"Divide by the magnitude, 3." }],
          hints:["Unit vector first.", "`(1, 2, 2)/3`.", "15 × that `= (5, 10, 10)`."] },
        { id:"w5", skill:"Right-triangle trig", goal:1, prompt:"A 10 m ladder makes a 60° angle with the ground. How far is its foot from the wall?",
          options:[
            { t:"5 m", ok:true, why:"`10 cos 60°`." },
            { t:"`5√3` m", why:"That’s the height up the wall." },
            { t:"10 m", why:"The ladder is the hypotenuse." },
            { t:"20 m", why:"That divides by `cos 60°`. Multiply instead." }],
          hints:["The distance is next to the 60° angle.", "Cosine.", "`10 × 1/2 = 5` m."] },
        { id:"w6", skill:"Right-triangle trig", goal:3, prompt:"A vector of length 8 makes 135° with the positive `x`-axis. What is its `x`-component?",
          options:[
            { t:"`-4√2`", ok:true, why:"`8 cos 135° = 8(-√2/2)`." },
            { t:"`4√2`", why:"It points left." },
            { t:"`-4`", why:"That uses `cos 120°`." },
            { t:"8", why:"Only part of it is horizontal." }],
          hints:["`x = r cos θ`.", "`cos 135° = -√2/2`.", "`-4√2`."] }
      ],
      refreshers:{
        "Dot product":"`vec{a} · vec{b} = a_1 b_1 + a_2 b_2 (+ a_3 b_3) = |vec{a}||vec{b}| cos θ`.",
        "Unit vectors":"Divide a vector by its magnitude to get length 1; multiply by `k` to get length `k`.",
        "Right-triangle trig":"The side next to the angle is hypotenuse × `cos θ`. A negative cosine means the side points backward."
      }
    }
  },
  explore:{
    heading:"Shadow caster",
    intro:"Light falls straight down onto the line of " + B + ". Move " + A + " and " + B + " and watch " + A + "’s shadow: its signed length, its direction, and the part of " + A + " that’s left over.",
    txt:{
      space:"Space", input:"Input", drag:"Drag", polar:"Polar",
      swap:"Project `vec{b}` on `vec{a}` instead", swapOn:"Swapped: projecting `vec{b}` on `vec{a}`",
      setup:"Set up a challenge", c1:"Challenge 1", c2:"Challenge 2", c3:"Challenge 3", free:"Free play",
      locked:"`vec{a}` is locked for the challenge.",
      stretch:"Stretch `vec{b}`: `@a{k}`", stretchNote:"Replaces `vec{b}` by `@a{k}vec{b}` (`@a{k}` from −3 to 3, never 0).",
      show:"Show", rays:"light rays", perp:"perpendicular part", line:"the line of `vec{b}`",
      ma:"`|vec{a}|`", mb:"`|vec{b}|`", th:"Angle θ between them",
      a3:"`vec{a}` components", b3:"`vec{b}` components", turn:"Turn", tilt:"Tilt", resetView:"Reset view",
      dragNote:"Drag the tips of `vec{a}` (blue) and `vec{b}` (teal), or Tab to a tip and use the arrow keys.",
      key:"`vec{a}` blue, `vec{b}` teal. Shadow (vector projection): yellow band under a thin arrow. Perpendicular part: dashed.",
      showAll:"Show all rows", showFew:"Show fewer rows", hidden:"Hidden until you press Check challenge.",
      noLine:"`vec{b} = vec{0}` has no line, so nothing casts a shadow. Move `vec{b}`.",
      noLineA:"`vec{a} = vec{0}` has no line, so nothing casts a shadow. Move `vec{a}`.",
      rows:{ vecs:"Vectors", dot:"Dot product", mag:"Length of the line vector", scal:"Scalar projection", vec:"Vector projection",
        perp:"Perpendicular part", check:"Check", dir:"Shadow direction" },
      along:"Along", opposite:"Opposite", none:"No shadow:"
    },
    predIntro:"Make a prediction first. Then the shadow caster shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"`vec{a} = (4, 3)`, `vec{b} = (5, 0)`. What is the scalar projection of `vec{a}` on `vec{b}`?",
        options:[{ t:"4", ok:true }, { t:"20" }, { t:"5" }, { t:"4/5" }],
        explain:"`(vec{a} · vec{b})/|vec{b}| = 20/5 = 4`. 20 is `vec{a} · vec{b}` (" + M6 + "); 5 is `|vec{a}|`; 4/5 divides by `|vec{b}|^2` (that’s the multiplier for the vector projection)." },
      { id:"p2", prompt:"Same vectors. Now stretch `vec{b}` to `(10, 0)` with the `@a{k}` slider. What happens to the scalar projection of `vec{a}` on `vec{b}`?",
        options:[{ t:"It stays 4", ok:true }, { t:"It doubles" }, { t:"It halves" }, { t:"It becomes 0" }],
        explain:"The shadow depends on the line, not on how long `vec{b}` is: `40/10 = 4`." },
      { id:"p3", prompt:"Polar input: `|vec{a}| = 6`, and θ swings from 60° to 120°. What is the scalar projection at 120°?",
        options:[{ t:"`-3`", ok:true }, { t:"3" }, { t:"0" }, { t:"`-3√3`" }],
        explain:"`6 cos 120° = -3`: the shadow points opposite `vec{b}`. " + M3 },
      { id:"p4", prompt:"`vec{a} = (4, 3)`, `vec{b} = (8, 0)`; press <strong>Swap</strong>. Now project `vec{b}` on `vec{a}`. What is the scalar projection?",
        options:[{ t:"32/5", ok:true }, { t:"4" }, { t:"32" }, { t:"8" }],
        explain:"`(vec{b} · vec{a})/|vec{a}| = 32/5`. Before the swap it was `32/8 = 4`: projections aren’t symmetric. " + M4 }
    ],
    chalIntro:"Press <strong>Challenge 1</strong>, <strong>2</strong> or <strong>3</strong> above the board to set it up (it locks `vec{a}`). Then move `vec{b}` and press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1], prompt:"R²: `vec{a} = (6, 2)` is locked. Drag `vec{b}` so the scalar projection of `vec{a}` on `vec{b}` is exactly 6.",
        why:"`(6b_1 + 2b_2)/|vec{b}| = 6`: `(1, 0)` gives `6/1`, and `(4, 3)` gives `30/5`.",
        hints:["You need `(6b_1 + 2b_2)/|vec{b}| = 6`.", "Try `vec{b}` along the `x`-axis first.", "`(1, 0)` works; so does `(4, 3)`: `(24 + 6)/5 = 6`."],
        msgs:{ setup:"Press <strong>Challenge 1</strong> above the board first: it sets R² and locks `vec{a} = (6, 2)`.",
          swap:"Turn Swap off: this challenge projects `vec{a}` on `vec{b}`.", zero:"`vec{b}` can’t be `vec{0}`: it needs a line.",
          back:"−6: the shadow points backward.", yaxis:"2: that’s the shadow on the `y`-axis.", self:"Projecting `vec{a}` on itself gives `|vec{a}| = 2√10`.",
          general:"Not yet: the scalar projection is {v}. You need exactly 6.",
          more:"Can you find a `vec{b}` in a different direction?" } },
      { id:"tc2", goal:[2], prompt:"R²: `vec{a} = (5, -1)` is locked. Choose `vec{b}` so the vector projection of `vec{a}` on `vec{b}` is `(2, 2)`.",
        why:"`vec{b}` must lie along `(1, 1)`: `(4/2)(1, 1) = (2, 2)`. Even `(-1, -1)` works: the vector projection depends only on the line.",
        hints:["The vector projection lies along `vec{b}`, so `vec{b}` must be parallel to `(2, 2)`.", "Try `vec{b} = (1, 1)`: `vec{a} · vec{b} = 4` and `vec{b} · vec{b} = 2`.", "`(4/2)(1, 1) = (2, 2)`. Even `(-1, -1)` works: the vector projection depends only on the line."],
        msgs:{ setup:"Press <strong>Challenge 2</strong> above the board first: it sets R² and locks `vec{a} = (5, -1)`.",
          swap:"Turn Swap off: this challenge projects `vec{a}` on `vec{b}`.", zero:"`vec{b}` can’t be `vec{0}`: it needs a line.",
          cross:"That gives `(3, -3)`.", self:"Projecting `vec{a}` on itself gives `vec{a}`.",
          general:"Not yet: the vector projection is {v}. You need `(2, 2)`." } },
      { id:"tc3", goal:[4], stretch:true, prompt:"R³: `vec{a} = (3, 1, 2)` is locked. Choose `vec{b}` (components −3 to 3) so the <strong>perpendicular part</strong> `vec{a} - proj_{vec{b}} vec{a}` is exactly `(1, -1, 0)`. (The perpendicular-part readout stays hidden until you press <strong>Check challenge</strong>.)",
        why:"`vec{b}` along `(1, 1, 1)`: `proj = 2(1, 1, 1) = (2, 2, 2)`, and `(3, 1, 2) - (2, 2, 2) = (1, -1, 0)` ✓.",
        hints:["If the perpendicular part is `(1, -1, 0)`, the projection is `vec{a} - (1, -1, 0)`.", "`proj = (2, 2, 2)`, so `vec{b}` must lie along `(1, 1, 1)`.", "Check: `(3, 1, 2) · (1, 1, 1) = 6` and `vec{b} · vec{b} = 3`, so `proj = 2(1, 1, 1)` ✓, and `(1, -1, 0) · (1, 1, 1) = 0` ✓."],
        msgs:{ setup:"Press <strong>Challenge 3</strong> above the board first: it sets R³ and locks `vec{a} = (3, 1, 2)`.",
          swap:"Turn Swap off: this challenge projects `vec{a}` on `vec{b}`.", zero:"`vec{b}` can’t be `vec{0}`: it needs a line.",
          roles:"That makes the <em>projection</em> `(1, -1, 0)` and the perpendicular part `(2, 2, 2)`: the roles are swapped.",
          self:"Projecting `vec{a}` on itself leaves a perpendicular part of `vec{0}`.",
          general:"Not yet: the perpendicular part is {v}, not `(1, -1, 0)`." } }
    ]
  },
  part3:{
    slug:"work", name:"At work",
    heading:"Projections at work",
    intro:"In each station only one part of a vector matters and the rest doesn’t. Drag the arrows, read the projections, and open <strong>Check it with algebra</strong>. Then try the quick check.",
    labels:{ working:"Check it with algebra", dragNote:"Drag the arrow tips (or Tab to a tip and use the arrow keys)." },
    st1:{ title:"Station 1: Work done",
      text:"A crate is dragged along a straight path `vec{d}` (m) by a force `vec{F}` (N). Only the part of the force along the path does work: it glows, and the perpendicular part is greyed out.",
      fig:"A crate at the origin, the path d in teal and the force F in blue, split into a highlighted part along d and a dashed perpendicular part.",
      rows:{ F:"Force `vec{F}`", d:"Path `vec{d}`", along:"Part of `vec{F}` along `vec{d}`", work:"Work" },
      noPath:"The path can’t be `vec{0}`: move its tip.",
      alg:["Scalar projection of `vec{F}` on `vec{d}`: `(vec{F} · vec{d})/|vec{d}|` N.", "Work = (that part) × `|vec{d}|`.", "`[(vec{F} · vec{d})/|vec{d}|] × |vec{d}| = vec{F} · vec{d}`: the lengths cancel, so the work is just the dot product (in J)."] },
    st2:{ title:"Station 2: The useful part of a force",
      text:"A train runs on a straight track with direction `(4, 3)`. A wind force `vec{F}` (N) pushes it. Only the part along the track moves the train; the perpendicular part presses on the rails.",
      fig:"A straight track in the direction (4, 3) with a train on it and the wind force F in blue, split into a highlighted part along the track and a dashed perpendicular part.",
      rows:{ F:"Wind force `vec{F}`", along:"Force along the track", vec:"Vector projection", perp:"Push on the rails (perpendicular part)" },
      alg:["Force along the track = scalar projection of `vec{F}` on `(4, 3)` `= (vec{F} · (4, 3))/5`.", "Example: `vec{F} = (10, -5)` N gives `(40 - 15)/5 = 5` N along the track.", "Vector projection: `(25/25)(4, 3) = (4, 3)`. Perpendicular part: `(10, -5) - (4, 3) = (6, -8)`, a 10 N push on the rails."] },
    st3:{ title:"Station 3: Distance from a point to a line (first look)",
      text:"The line through the origin has direction `vec{b} = (4, 3)`, and `P(5, 10)` is off the line. The perpendicular part of `vec{OP}` is the shortest segment from `P` to the line. Slide `Q` along the line and watch `|PQ|`.",
      fig:"The line through the origin with direction (4, 3), the point P(5, 10), the projection of OP along the line, the dashed perpendicular part from the foot to P, and a point Q on the line joined to P.",
      slider:"Slide `Q` along the line", rows:{ proj:"`proj_{vec{b}} vec{OP}`", perp:"Perpendicular part", dist:"Distance from `P` to the line", pq:"`|PQ|`" },
      shortest:"shortest: `PQ ⊥` the line ✓", note:"(Module 58 turns this into a formula.)",
      alg:["`vec{OP} = (5, 10)` and `vec{OP} · vec{b} = 20 + 30 = 50`, `vec{b} · vec{b} = 25`.", "`proj = (50/25)(4, 3) = (8, 6)`.", "Perpendicular part `= (5, 10) - (8, 6) = (-3, 4)`, so the distance is `√(9 + 16) = 5`."] },
    quickCheck:{
      title:"Quick check", summary:"Projections at work quick check",
      items:[
        { id:"q1", goal:5, prompt:"`vec{F} = (6, 8)` N; displacement `vec{d} = (3, 0)` m. Work done?",
          choices:[{ t:"18 J", ok:true, fb:"Right. `vec{F} · vec{d} = 18 + 0 = 18` J." }, { t:"30 J", fb:"`|vec{F}||vec{d}|` ignores the angle." },
            { t:"6 J", fb:"That’s the part of the force along `vec{d}`; multiply by 3 m." }, { t:"24 J", fb:"That uses the 8 N part, which is perpendicular to the path." }] },
        { id:"q2", goal:1, prompt:"Scalar projection of `(1, 8)` on `(4, 3)`?",
          choices:[{ t:"28/5", ok:true, fb:"Right. `(4 + 24)/5 = 28/5`." }, { t:"28", fb:M6 },
            { t:"28/25", fb:"That divides by `|vec{b}|^2`: the multiplier for the vector projection." }, { t:"`28/√65`", fb:M1 }] },
        { id:"q3", goal:5, prompt:"Distance from `P(5, 10)` to the line through the origin with direction `(4, 3)`?",
          choices:[{ t:"5", ok:true, fb:"Right. The perpendicular part `(-3, 4)` has length 5." }, { t:"10", fb:"That’s the scalar projection, the distance <em>along</em> the line." },
            { t:"`5√5`", fb:"That’s `|vec{OP}|`." }, { t:"50", fb:"That’s `vec{OP} · vec{b}`, not a distance." }] },
        { id:"q4", goal:3, prompt:"The scalar projection of `vec{a}` on `vec{b}` is negative. So:",
          choices:[{ t:"the angle between them is obtuse", ok:true, fb:"Right. `cos θ < 0`, so θ is obtuse." }, { t:"`|vec{a}| < |vec{b}|`", fb:M3 },
            { t:"`vec{a}` has a negative component", fb:M3 }, { t:"a mistake was made", fb:M3 }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"projset", type:"custom", title:"Projection set", summary:"Projection set", star:true, goal:[1, 2, 4],
        instruction:"Find each projection exactly. Items 6 to 8 are non-routine; 7 and 8 go beyond the Final Check.",
        how:"Type whole numbers or fractions such as −8/9 in the boxes (one box per component), then press Check.",
        msgs:{ fill:"Fill in every box first.", err:"Type numbers only, such as 3, −8/9 or 7/5.", general:"Not yet. Check your work and try again." },
        items:[
          { id:"j1", goal:1, prompt:"Scalar projection of `(7, 1)` on `(3, 4)`?", form:"s", answer:5, display:"5",
            wrong:[{ v:25, fb:M6 }, { v:3.5355339059327378, fb:M1 }], why:"`(21 + 4)/5 = 5`." },
          { id:"j2", goal:2, prompt:"Vector projection of `(7, 1)` on `(3, 4)`?", form:"v2", answer:[3, 4], display:"`(3, 4)`",
            wrong:[{ v:[15, 20], fb:"`5 × (3, 4)` uses `vec{b}`, not the unit vector. " + M2 }], why:"`(25/25)(3, 4) = (3, 4)`." },
          { id:"j3", goal:1, prompt:"Scalar projection of `(1, -2, 2)` on `(2, 3, 6)`?", form:"s", answer:1.1428571428571428, display:"8/7",
            wrong:[{ v:2.6666666666666665, fb:M1 }], why:"`(2 - 6 + 12)/7 = 8/7`." },
          { id:"j4", goal:2, prompt:"Vector projection of `(4, -1, 3)` on `(1, 2, 2)`?", form:"v3", answer:[0.8888888888888888, 1.7777777777777777, 1.7777777777777777], display:"`(8/9, 16/9, 16/9)`",
            wrong:[{ v:[2.6666666666666665, 5.333333333333333, 5.333333333333333], fb:M2 }], why:"`(8/9)(1, 2, 2)`: `vec{a} · vec{b} = 8` and `vec{b} · vec{b} = 9`." },
          { id:"j5", goal:1, prompt:"Scalar projection of `(-3, 4)` on `(6, 8)`?", form:"s", answer:1.4, display:"7/5",
            wrong:[{ v:14, fb:M6 }], why:"`(-18 + 32)/10 = 14/10 = 7/5`." },
          { id:"j6", goal:1, star:true, prompt:"Find `k` so that the scalar projection of `(k, 4)` on `(3, -4)` is 1.", form:"k", answer:7, display:"`k = 7`",
            wrong:[], general:"`(3k - 16)/5 = 1`.", why:"`(3k - 16)/5 = 1`, so `3k = 21` and `k = 7`." },
          { id:"j7", goal:4, star:true, prompt:"Write `vec{a} = (4, 7)` as a vector parallel to `(1, 2)` plus a vector perpendicular to `(1, 2)`.", form:"split",
            answer:[[3.6, 7.2], [0.4, -0.2]], display:"`(18/5, 36/5) + (2/5, -1/5)`",
            wrong:[{ v:[[3.6, 7.2], [7.6, 14.2]], fb:M7 }], general:"Perpendicular part `= vec{a} -` proj; check it with a dot product.",
            why:"proj `= (18/5)(1, 2) = (18/5, 36/5)`, and `(4, 7) - (18/5, 36/5) = (2/5, -1/5)`; `(2/5)(1) + (-1/5)(2) = 0` ✓.",
            hints:["proj `= [(vec{a} · vec{b})/(vec{b} · vec{b})] vec{b}`.", "`18/5 × (1, 2) = (18/5, 36/5)`.", "`vec{a} -` proj `= (2/5, -1/5)`; check `(2/5)(1) + (-1/5)(2) = 0`."] },
          { id:"j8", goal:3, star:true, prompt:"`|vec{a}| = 6` and the vector projection of `vec{a}` on `vec{b}` has length 3. Find both possible angles between `vec{a}` and `vec{b}`.", form:"ang2",
            answer:[60, 120], display:"60° and 120°",
            wrong:[{ has:60, fb:"The vector projection’s length ignores direction: `|cos θ| = 1/2`." }], general:"Length of the vector projection `= |vec{a}||cos θ|`.",
            why:"`6|cos θ| = 3`, so `cos θ = ±1/2`: 60° or 120°.",
            hints:["Length of the vector projection `= |vec{a}||cos θ|`.", "`6|cos θ| = 3`.", "`cos θ = ±1/2`: 60° or 120°."] }
        ] },
      { id:"shadow", type:"sorter", title:"Which way does the shadow point?", summary:"Which way does the shadow point?", noun:"pair", goal:3,
        instruction:"Each card gives `vec{a}` and `vec{b}`. Sort the vector projection of `vec{a}` on `vec{b}`: does it point along `vec{b}`, opposite `vec{b}`, or is it the zero vector?",
        boxes:[{ id:"along", label:"Along `vec{b}`" }, { id:"opp", label:"Opposite `vec{b}`" }, { id:"zero", label:"Zero vector" }],
        wrongDefault:"Only the sign of `vec{a} · vec{b}` decides: positive, negative or zero.",
        items:[
          { id:"i1", t:"`(2, 3)` on `(1, 1)`", answer:"along", why:"`vec{a} · vec{b} = 5 > 0`." },
          { id:"i2", t:"`(-4, 1)` on `(2, 3)`", answer:"opp", why:"`-8 + 3 = -5 < 0`.", wrong:{ along:"Add with signs: `-8 + 3 = -5`." } },
          { id:"i3", t:"`(6, -3)` on `(1, 2)`", answer:"zero", why:"`6 - 6 = 0`: `vec{a} ⊥ vec{b}`, no shadow.", wrong:{ along:"`6 - 6 = 0`: no shadow at all." } },
          { id:"i4", t:"`(0, 5)` on `(3, -1)`", answer:"opp", why:"`-5 < 0`." },
          { id:"i5", t:"`(1, 2, 3)` on `(3, 0, -1)`", answer:"zero", why:"`3 + 0 - 3 = 0`." },
          { id:"i6", t:"`(-1, -1, -1)` on `(-2, 1, 0)`", answer:"along", why:"`2 - 1 + 0 = 1 > 0`, even though `vec{a}`’s components are all negative.",
            wrong:{ opp:"Negative components don’t decide it: the dot product does, and it’s +1. " + M3 },
            hints:["Only the sign of `vec{a} · vec{b}` matters.", "`(-1)(-2) + (-1)(1) + (-1)(0)`.", "`= 1`: along `vec{b}`."] },
          { id:"i7", t:"`|vec{a}| = 5`, `|vec{b}| = 2`, θ = 150°", answer:"opp", why:"`cos 150° < 0`." },
          { id:"i8", t:"`vec{a} = vec{b}` (non-zero)", answer:"along", why:"A vector’s shadow on itself is itself." }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Theo", how:"", goal:[1, 2, 5],
        instruction:"Theo made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Find the scalar projection of `vec{a} = (2, 6)` on `vec{b} = (3, 4)`.",
            steps:["`vec{a} · vec{b} = 6 + 24 = 30`.", "`|vec{a}| = √40 = 2√10` and `|vec{b}| = 5`.", "Scalar projection `= (vec{a} · vec{b})/|vec{a}| = 30/(2√10) = 3√10/2`.", "The shadow on `vec{b}`’s line has length `3√10/2`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 reads step 3."],
            fixes:[
              { t:"Divide by the length of the vector you project onto: `30/|vec{b}| = 30/5 = 6`.", ok:true, why:"The shadow falls on `vec{b}`’s line, so divide by `|vec{b}|`." },
              { t:"The scalar projection is `vec{a} · vec{b} = 30`.", why:M6 },
              { t:"Divide by `|vec{a}||vec{b}|`: `30/(10√10)`.", why:"That’s `cos θ`, not a length." },
              { t:"Step 3 is correct.", why:M1 }],
            hints:["Which vector’s line catches the shadow?", "`vec{b}`’s line, so divide by `|vec{b}|`.", "`30/5 = 6`."] },
          { id:"e2", goal:2, task:"Find the vector projection of `vec{a} = (5, 1)` on `vec{b} = (2, -1)`.",
            steps:["`vec{a} · vec{b} = 10 - 1 = 9`.", "`|vec{b}| = √5`.", "The scalar projection is `9/√5`.", "So the vector projection is `(9/√5) vec{b} = (18/√5, -9/√5)`."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"Multiply the scalar projection by the <strong>unit</strong> vector `vec{b}/|vec{b}|`: `(9/√5)(2, -1)/√5 = (9/5)(2, -1) = (18/5, -9/5)`.", ok:true, why:"Now its length is `9/√5`, the scalar projection." },
              { t:"`(9/√5) vec{a}`.", why:M5 },
              { t:"`9vec{b} = (18, -9)`.", why:"That’s `vec{a} · vec{b}` times `vec{b}`: far too long." },
              { t:"Step 4 is correct.", why:M2 }],
            hints:["What’s the length of `(18/√5, -9/√5)`? Does it match `9/√5`?", "Its length is 9, so it’s `√5` times too long.", "Use `vec{b}/|vec{b}|`: `(18/5, -9/5)`."] },
          { id:"e3", goal:5, task:"Find the distance from `P(4, 7)` to the line through the origin with direction `vec{b} = (1, 1)`.",
            steps:["Let `vec{a} = vec{OP} = (4, 7)`.", "`proj_{vec{b}} vec{a} = (11/2)(1, 1) = (11/2, 11/2)`.", "The perpendicular part is `vec{a} +` proj `= (19/2, 25/2)`.", "Distance `= |(19/2, 25/2)| = √986/2`."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct: `vec{a} · vec{b} = 11` and `vec{b} · vec{b} = 2`.", "", "Step 4 finds the length of step 3’s vector correctly."],
            fixes:[
              { t:"Subtract: `vec{a} -` proj `= (-3/2, 3/2)`, so the distance is `√(9/4 + 9/4) = 3√2/2`.", ok:true, why:"`(-3/2, 3/2) · (1, 1) = 0` ✓: it really is perpendicular." },
              { t:"The distance is the scalar projection, `11/√2`.", why:"That’s how far along the line, not how far from it." },
              { t:"The distance is `|vec{a}| = √65`.", why:"That’s the distance to the origin." },
              { t:"Step 3 is correct.", why:M7 }],
            hints:["Is `(19/2, 25/2)` perpendicular to `(1, 1)`?", "No: its dot product with `(1, 1)` is 22.", "Subtract instead: `(-3/2, 3/2)`, length `3√2/2`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you about shadows: that stretching `vec{b}` didn’t change anything, or that swapping `vec{a}` and `vec{b}` did?" },
      { id:"j2", q:"In your own words, what’s the difference between the scalar projection and the vector projection?" },
      { id:"j3", q:"Explain to a friend how to split a vector into a part along `vec{b}` and a part perpendicular to `vec{b}`, and how to check your answer." },
      { id:"j4", q:"Which still trips you up: what to divide by, or turning the scalar projection into a vector? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Find the scalar projection of `(3, 4)` on `(12, 5)`.", options:[
          { t:"56/13", ok:true, why:"`(36 + 20)/13`." },
          { t:"56/5", why:"That divides by `|(3, 4)|`. " + M1 },
          { t:"56", why:M6 },
          { t:"56/169", why:"That divides by `|vec{b}|^2`: the multiplier for the vector projection." }] },
        b:{ prompt:"Find the scalar projection of `(2, -1, 2)` on `(1, 4, 8)`.", options:[
          { t:"14/9", ok:true, why:"`(2 - 4 + 16)/9`." },
          { t:"14/3", why:"That divides by `|(2, -1, 2)| = 3`. " + M1 },
          { t:"14", why:M6 },
          { t:"14/81", why:"That divides by `|vec{b}|^2 = 81`: the multiplier for the vector projection." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Find the vector projection of `(4, 2)` on `(1, 3)`.", options:[
          { t:"`(1, 3)`", ok:true, why:"`vec{a} · vec{b} = 10`, `vec{b} · vec{b} = 10`: `(10/10)(1, 3)`." },
          { t:"`√10 (1, 3)`", why:"That multiplies the scalar projection by `vec{b}`, not the unit vector. " + M2 },
          { t:"`(2, 1)`", why:"That’s the projection of `(1, 3)` on `(4, 2)`. " + M4 },
          { t:"`(10, 30)`", why:"You need to divide by `vec{b} · vec{b}`." }] },
        b:{ prompt:"Find the vector projection of `(3, -1, 2)` on `(1, 1, 1)`.", options:[
          { t:"`(4/3, 4/3, 4/3)`", ok:true, why:"`(4/3)(1, 1, 1)`." },
          { t:"`(4/√3)(1, 1, 1)`", why:M2 },
          { t:"`(6/7, -2/7, 4/7)`", why:"That’s the projection of `(1, 1, 1)` on `(3, -1, 2)`. " + M4 },
          { t:"`(4, 4, 4)`", why:"You need to divide by `vec{b} · vec{b} = 3`." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"The angle between `vec{a}` and `vec{b}` is 150° and `|vec{a}| = 8`. What is the scalar projection of `vec{a}` on `vec{b}`?", options:[
          { t:"`-4√3`", ok:true, why:"`8 cos 150° = 8(-√3/2)`." },
          { t:"`4√3`", why:"An obtuse angle gives a negative projection. " + M3 },
          { t:"`-4`", why:"That uses `sin 150°` (with a sign)." },
          { t:"8", why:"That’s `|vec{a}|`, the length of `vec{a}` itself." }] },
        b:{ prompt:"The angle is 135° and `|vec{a}| = 6`. Scalar projection of `vec{a}` on `vec{b}`?", options:[
          { t:"`-3√2`", ok:true, why:"`6 cos 135° = 6(-√2/2)`." },
          { t:"`3√2`", why:M3 },
          { t:"`-3`", why:"`cos 135° = -√2/2`, not `-1/2`." },
          { t:"6", why:"That’s `|vec{a}|`, the length of `vec{a}` itself." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Write `vec{a} = (3, 4)` as a part parallel to `vec{b} = (2, 1)` plus a part perpendicular to `vec{b}`.", options:[
          { t:"Parallel `(4, 2)`, perpendicular `(-1, 2)`", ok:true, why:"proj `= (10/5)(2, 1)`; `(3, 4) - (4, 2) = (-1, 2)`; check `(-1, 2) · (2, 1) = 0`." },
          { t:"Parallel `(4, 2)`, perpendicular `(7, 6)`", why:M7 },
          { t:"Parallel `(2, 1)`, perpendicular `(1, 3)`", why:"`(2, 1)` is `vec{b}` itself, and `(1, 3) · (2, 1) = 5 ≠ 0`." },
          { t:"Parallel `(-1, 2)`, perpendicular `(4, 2)`", why:"Swapped: the parallel part must be a multiple of `(2, 1)`." }] },
        b:{ prompt:"Write `vec{a} = (1, 7)` as a part parallel to `vec{b} = (1, 1)` plus a part perpendicular to `vec{b}`.", options:[
          { t:"Parallel `(4, 4)`, perpendicular `(-3, 3)`", ok:true, why:"proj `= (8/2)(1, 1)`; `(1, 7) - (4, 4) = (-3, 3)`; check `(-3, 3) · (1, 1) = 0`." },
          { t:"Parallel `(4, 4)`, perpendicular `(5, 11)`", why:M7 },
          { t:"Parallel `(1, 1)`, perpendicular `(0, 6)`", why:"`(1, 1)` is `vec{b}` itself, and `(0, 6) · (1, 1) = 6 ≠ 0`." },
          { t:"Parallel `(-3, 3)`, perpendicular `(4, 4)`", why:"Swapped: the parallel part must be a multiple of `(1, 1)`." }] } },
      { id:"t2", cat:"T", goal:1,
        a:{ prompt:"Find `k` so that the scalar projection of `(2, k)` on `(4, 3)` is 5.", options:[
          { t:"`k = 17/3`", ok:true, why:"`(8 + 3k)/5 = 5`, so `3k = 17`." },
          { t:"`k = -1`", why:"That sets `vec{a} · vec{b} = 5`. " + M6 },
          { t:"`k = 39`", why:"That divides by `|vec{b}|^2 = 25`." },
          { t:"`k = 17`", why:"The `k` is multiplied by 3." }] },
        b:{ prompt:"Find `k` so that the scalar projection of `(k, 1)` on `(5, 12)` is 2.", options:[
          { t:"`k = 14/5`", ok:true, why:"`(5k + 12)/13 = 2`, so `5k = 14`." },
          { t:"`k = -2`", why:"That sets `vec{a} · vec{b} = 2`. " + M6 },
          { t:"`k = 326/5`", why:"That divides by 169." },
          { t:"`k = 14`", why:"The `k` is multiplied by 5." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"`|vec{a}| = 10`, `vec{b} = (3, -4)`, and the vector projection of `vec{a}` on `vec{b}` is `(-3, 4)`. Find the angle between `vec{a}` and `vec{b}`.", options:[
          { t:"120°", ok:true, why:"The projection is `-vec{b}`: opposite `vec{b}`, so the angle is obtuse; its length 5 `= 10|cos θ|`, so `cos θ = -1/2`." },
          { t:"60°", why:"The projection points against `vec{b}`. " + M3 },
          { t:"150°", why:"`cos 150° = -√3/2`; the length 5 needs `|cos θ| = 1/2`." },
          { t:"90°", why:"Perpendicular vectors cast no shadow." }] },
        b:{ prompt:"`|vec{a}| = 4`, `vec{b} = (1, 2, 2)`, and the vector projection of `vec{a}` on `vec{b}` is `(2/3, 4/3, 4/3)`. Find the angle.", options:[
          { t:"60°", ok:true, why:"The projection is `(2/3)vec{b}`: along `vec{b}`; its length 2 `= 4|cos θ|`." },
          { t:"120°", why:"It points along `vec{b}`, so the angle is acute." },
          { t:"30°", why:"`cos 30° = √3/2`; you need 1/2." },
          { t:"90°", why:"Perpendicular vectors cast no shadow." }] } },
      { id:"c1", cat:"C", goal:[1, 3],
        a:{ prompt:"Which statement is correct?", options:[
          { t:"“The scalar projection of `vec{a}` on `vec{b}` stays the same if `vec{b}` is replaced by `3vec{b}`: only the line of `vec{b}` matters.”", ok:true, why:"`(vec{a} · 3vec{b})/|3vec{b}| = (vec{a} · vec{b})/|vec{b}|`." },
          { t:"“Doubling `vec{b}` doubles the scalar projection of `vec{a}` on `vec{b}`.”", why:"`(vec{a} · 2vec{b})/|2vec{b}|` is unchanged." },
          { t:"“The scalar projection of `vec{a}` on `vec{b}` equals the scalar projection of `vec{b}` on `vec{a}`.”", why:M4 },
          { t:"“Scalar projections are never negative.”", why:M3 }] },
        b:{ prompt:"Which describes the vector projection of `vec{a}` on `vec{b}`?", options:[
          { t:"“A vector along the line of `vec{b}` with length `|vec{a}||cos θ|`. It points with `vec{b}` when the angle is acute, against it when obtuse.”", ok:true, why:"The shadow lies on `vec{b}`’s line, and its direction follows the sign of `cos θ`." },
          { t:"“A vector along `vec{a}`.”", why:M5 },
          { t:"“A vector perpendicular to `vec{b}`.”", why:"That’s the leftover part, `vec{a} -` proj." },
          { t:"“The number `(vec{a} · vec{b})/|vec{b}|`.”", why:"That’s the scalar projection." }] } },
      { id:"c2", cat:"C", goal:[2, 4],
        a:{ prompt:"Why is `vec{a} - proj_{vec{b}} vec{a}` perpendicular to `vec{b}`?", options:[
          { t:"“It runs along a light ray from the shadow’s tip to `vec{a}`’s tip, and the rays hit `vec{b}`’s line at right angles. Algebraically, `(vec{a} -` proj`) · vec{b} = vec{a} · vec{b} - [(vec{a} · vec{b})/(vec{b} · vec{b})](vec{b} · vec{b}) = 0`.”", ok:true, why:"Both the picture and the algebra show it." },
          { t:"“Because `vec{a}` and `vec{b}` are perpendicular.”", why:"`vec{a}` and `vec{b}` can be at any angle." },
          { t:"“Because subtracting vectors always gives a perpendicular vector.”", why:"Not in general." },
          { t:"“It isn’t; `vec{a} +` proj is.”", why:M7 }] },
        b:{ prompt:"Which formula gives the vector projection of `vec{a}` on `vec{b}`, and why?", options:[
          { t:"“`[(vec{a} · vec{b})/|vec{b}|](vec{b}/|vec{b}|)`: the scalar projection times a unit vector along `vec{b}`.”", ok:true, why:"Signed length times a unit direction gives the shadow as a vector." },
          { t:"“`[(vec{a} · vec{b})/|vec{b}|] vec{b}`: the scalar projection times `vec{b}`.”", why:M2 },
          { t:"“`[(vec{a} · vec{b})/|vec{a}|](vec{a}/|vec{a}|)`, since it’s `vec{a}`’s shadow.”", why:"That’s `vec{b}`’s shadow on `vec{a}`. " + M1 },
          { t:"“`(vec{a} · vec{b}) vec{b}`.”", why:"Too long by a factor of `|vec{b}|^2`." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"Wind pushes a sailboat with force `vec{F} = (20, -10)` N. The boat moves in the direction `(3, 4)`. How much of the wind’s force acts along the boat’s direction?", options:[
          { t:"4 N", ok:true, why:"`(60 - 40)/5`." },
          { t:"20 N", why:M6 },
          { t:"4/5 N", why:"That divides by 25." },
          { t:"`2√5/5` N", why:"That divides by `|vec{F}| = 10√5`. " + M1 }] },
        b:{ prompt:"A force `vec{F} = (6, 9)` N pulls a cart that moves in the direction `(2, -1)`. How much of the force acts along the motion?", options:[
          { t:"`3√5/5` N", ok:true, why:"`(12 - 9)/√5 = 3/√5`." },
          { t:"3 N", why:M6 },
          { t:"3/5 N", why:"That divides by `|(2, -1)|^2 = 5`." },
          { t:"`√13/13` N", why:"That divides by `|vec{F}| = 3√13`. " + M1 }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"Find the distance from `P(2, 9)` to the line through the origin with direction `(3, 4)`.", options:[
          { t:"19/5", ok:true, why:"proj `= (42/25)(3, 4) = (126/25, 168/25)`; perpendicular part `= (-76/25, 57/25)`, length `95/25 = 19/5`." },
          { t:"42/5", why:"That’s the scalar projection: distance along the line." },
          { t:"`√85`", why:"That’s `|vec{OP}|`." },
          { t:"42", why:"That’s `vec{OP} · vec{b}`." }] },
        b:{ prompt:"Find the distance from `P(7, 2, 2)` to the line through the origin with direction `(1, 2, 2)`.", options:[
          { t:"`4√2`", ok:true, why:"proj `= (15/9)(1, 2, 2)`; perpendicular part `= (16/3, -4/3, -4/3)`, length `√32`." },
          { t:"5", why:"That’s the scalar projection." },
          { t:"`√57`", why:"That’s `|vec{OP}|`." },
          { t:"15", why:"That’s `vec{OP} · vec{b}`." }] } }
    ]
  },
  task:{
    title:"Push back along the track", summary:"Push back along the track",
    statement:"<p>A cart runs on a straight track in the direction `vec{b} = (3, 4)`. Design a force `vec{a}` that does all of this. Find every answer.</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>It pushes the cart <strong>backward</strong> along the track with exactly 2 N.</li><li>Its sideways part (perpendicular to the track) is at least 4 N.</li><li>The whole force is less than 10 N.</li></ol></div>" +
      "<p class=\"tiny muted\">`vec{a} = (a_1, a_2)`: whole numbers from −10 to 10. The picture shows the track, `vec{a}`, its shadow on the track and its perpendicular part.</p>",
    checks:["Pushes back along the track with 2 N", "Sideways part at least 4 N", "Whole force under 10 N"],
    tips:["The scalar projection on `(3, 4)` is `(3a_1 + 4a_2)/5`. You need it to equal `-2`.",
      "The sideways part is what’s left after removing the shadow: `vec{a} -` proj. Its length is `|-4a_1 + 3a_2|/5`.",
      "`|vec{a}|` must stay below 10."],
    explainPrompt:"Explain how you made the force push back with exactly 2 N, and how you checked the sideways part.",
    vocab:"Use the words scalar projection, vector projection, perpendicular part and magnitude.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Every force that pushes back with exactly 2 N lies on the line `3a_1 + 4a_2 = -10`, with whole-number points every `(4, -3)` apart: …, `(-10, 5)`, `(-6, 2)`, `(-2, -1)`, `(2, -4)`, `(6, -7)`, `(10, -10)`. Line 2 rules out `(-2, -1)`; line 3 rules out the two ends.",
    labels:{ a1:"`a_1`", a2:"`a_2`", range:"(−10 to 10)", invalid:"Choose whole numbers from −10 to 10 for `a_1` and `a_2`.",
      scal:"Scalar projection on the track", vec:"Vector projection (shadow)", perp:"Perpendicular part", side:"Sideways part", mag:"Whole force `|vec{a}|`",
      back:"backward", fwd:"forward", zero:"no push along the track",
      graph:"The track (direction `(3, 4)`), `vec{a}` in blue, its shadow and its dashed perpendicular part" }
  },
  cards:[
    ["Projection", "The shadow of `vec{a}` on the line of `vec{b}`, with light perpendicular to that line."],
    ["Scalar projection of `vec{a}` on `vec{b}`", "`(vec{a} · vec{b})/|vec{b}| = |vec{a}| cos θ`: a signed length."],
    ["Vector projection", "`proj_{vec{b}} vec{a} = [(vec{a} · vec{b})/(vec{b} · vec{b})] vec{b}`."],
    ["Negative scalar projection", "The angle is obtuse; the shadow points against `vec{b}`."],
    ["Zero projection", "`vec{a} ⊥ vec{b}`: no shadow."],
    ["Stretch `vec{b}`", "The projections don’t change: only `vec{b}`’s line matters."],
    ["Not symmetric", "`vec{a}` on `vec{b}` ≠ `vec{b}` on `vec{a}` in general."],
    ["Perpendicular part", "`vec{a} - proj_{vec{b}} vec{a}`; its dot product with `vec{b}` is 0."],
    ["Work", "(part of `vec{F}` along `vec{d}`) × `|vec{d}| = vec{F} · vec{d}`."],
    ["Useful part of a force", "Scalar projection of `vec{F}` on the direction of motion."],
    ["Distance from `P` to a line through `O`", "`|vec{OP} - proj_{vec{b}} vec{OP}|`."],
    ["Check a vector projection", "It’s a multiple of `vec{b}`, and its length is |scalar projection|."]
  ]
};
