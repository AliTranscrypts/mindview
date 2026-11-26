// MCV4U 44 The Dot Product in R³. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/44-dot-product-in-r3.md
// Plan error fixed here: the plan's hero and P2 give θ ≈ 120° for (1, 0, 3) and (0, 1, −2); cos θ = −6/√50 ≈ −0.85, so θ ≈ 148°.
// misconception core sentences (plan §3), reused where the plan tags an option with M1–M7
const M1 = "In R³ there are three products to add: `a_1b_1 + a_2b_2 + a_3b_3`.";
const M2 = "In 3D, a whole plane of directions is perpendicular to one vector. Two conditions narrow it to a line.";
const M3 = "The rule is `cos^2 α + cos^2 β + cos^2 γ = 1`. The angles themselves have no fixed sum.";
const M4 = "Track every sign in the three products.";
const M5 = "A flat drawing distorts angles. Compute the dot product.";
const M6 = "Check both: `vec{w} · vec{u} = 0` <strong>and</strong> `vec{w} · vec{v} = 0`.";
const M7 = "Any non-zero multiple works: (1, −2, 1) and (−3, 6, −3) point along the same line.";
const USE = '<span class="uses dp-uses"><strong>Use these values</strong>';

export default {
  id:"44-dot-product-in-r3",
  kind:"topic",
  title:"The dot product in R³",
  topic:"The Dot Product in R³",
  readyTopic:"the dot product in R³",
  hero:{
    eq:"`vec{a} · vec{b} = a_1b_1 + a_2b_2 + a_3b_3 = |vec{a}||vec{b}| cos θ`",
    eqLabel:"a dot b equals a1 b1 plus a2 b2 plus a3 b3, which equals the magnitude of a times the magnitude of b times cos theta",
    eqSize:"sm",
    headline:"One more term, and the screen can lie",
    text:"The <strong>dot product</strong> in three dimensions adds one more product, `a_3b_3`. It still finds the <strong>angle</strong> between vectors and still tests for <strong>perpendicular</strong> vectors (dot product 0). In 3D, though, a drawing can make a right angle look acute or obtuse, so the numbers decide.",
    fig:{ aria:"Seen from the top, a = (1, 0, 3) and b = (0, 1, −2) look perpendicular. Turned to an isometric view they open past 90°: the dot product is −6 and θ ≈ 148°. A second pair, (1, 2, 2) and (2, −2, 1), looks skewed but has dot product 0: a right angle.", shape:"wide" }
  },
  goals:[
    "I can calculate the dot product of two vectors in R³ from components.",
    "I can find the angle between two vectors in R³.",
    "I can test vectors in R³ for perpendicularity and find unknown components that make them perpendicular.",
    "I can find a vector perpendicular to two given vectors by solving a system.",
    "I can find the direction cosines and direction angles of a vector.",
    "I can solve 3D problems with the dot product, such as angles in boxes and work."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"3D magnitude", goal:2, prompt:"What is |(2, −3, 6)|?",
          options:[
            { t:"7", ok:true, why:"`√(4 + 9 + 36) = √49`." },
            { t:"11", why:"That adds the absolute values. Square, add, then take the root." },
            { t:"5", why:"2 − 3 + 6 isn’t a length." },
            { t:"49", why:"That forgets the root: `√49 = 7`." }],
          hints:["`|vec{a}| = √(a_1^2 + a_2^2 + a_3^2)`.", "4 + 9 + 36 = 49.", "7."] },
        { id:"w2", skill:"3D magnitude", goal:5, prompt:"What is |(1, 4, 8)|?",
          options:[
            { t:"9", ok:true, why:"`√(1 + 16 + 64) = √81`." },
            { t:"13", why:"That adds the components. Square, add, then take the root." },
            { t:"81", why:"That forgets the root: `√81 = 9`." },
            { t:"`√17`", why:"That drops the third component. In R³ there are three squares to add." }],
          hints:["Three squares.", "1 + 16 + 64 = 81.", "9."] },
        { id:"w3", skill:"Dot product in R²", goal:1, prompt:"(3, −2) · (4, 6) = ?",
          options:[
            { t:"0", ok:true, why:"12 − 12." },
            { t:"(12, −12)", why:"The dot product is a number." },
            { t:"24", why:"(−2)(6) = −12." },
            { t:"10", why:"Pair `x` with `x`, `y` with `y`." }],
          hints:["`a_1b_1 + a_2b_2`.", "(3)(4) + (−2)(6).", "12 − 12 = 0."] },
        { id:"w4", skill:"Dot product in R²", goal:2, prompt:"If `vec{a} · vec{b} = |vec{a}||vec{b}|` for non-zero vectors, what is the angle between them?",
          options:[
            { t:"0°", ok:true, why:"`cos θ = 1`." },
            { t:"90°", why:"That needs `vec{a} · vec{b} = 0`." },
            { t:"180°", why:"That needs `-|vec{a}||vec{b}|`." },
            { t:"45°", why:"cos 45° isn’t 1." }],
          hints:["Divide both sides by `|vec{a}||vec{b}|`.", "`cos θ = 1`.", "`θ = 0°`: same direction."] },
        { id:"w5", skill:"Systems", goal:4, prompt:"Solve `x + 2y = 0` and `3x - y = 7`.",
          options:[
            { t:"`x = 2`, `y = -1`", ok:true, why:"2 − 2 = 0 and 6 + 1 = 7." },
            { t:"`x = -2`, `y = 1`", why:"Sign slip: 3(−2) − 1 = −7." },
            { t:"`x = 7`, `y = 0`", why:"Check the first equation: 7 ≠ 0." },
            { t:"`x = 1`, `y = -1/2`", why:"That satisfies only the first: 3(1) + 1/2 ≠ 7." }],
          hints:["From the first, `x = -2y`.", "`-6y - y = 7`, so `y = -1`.", "`x = 2`."] },
        { id:"w6", skill:"Special angles", goal:2, prompt:"`cos θ = -√3/2` with 0° ≤ θ ≤ 180°. What is θ?",
          options:[
            { t:"150°", ok:true, why:"Reference angle 30°, in quadrant 2." },
            { t:"30°", why:"That ignores the sign: the cosine is negative, so θ is obtuse." },
            { t:"120°", why:"cos 120° = −1/2." },
            { t:"210°", why:"Outside 0°–180°." }],
          hints:["Which angle has cosine `√3/2`?", "30°.", "Negative in quadrant 2: 150°."] }
      ],
      refreshers:{
        "3D magnitude":"`|(a_1, a_2, a_3)| = √(a_1^2 + a_2^2 + a_3^2)`. Handy triples: (1, 2, 2) → 3, (2, 3, 6) → 7, (1, 4, 8) → 9.",
        "Dot product in R²":"`a_1b_1 + a_2b_2 = |vec{a}||vec{b}| cos θ`; 0 means perpendicular.",
        "Systems":"Solve one equation for a variable and substitute.",
        "Special angles":"Obtuse cosines are negative: cos 120° = −1/2, cos 135° = `-√2/2`, cos 150° = `-√3/2`."
      }
    }
  },
  explore:{
    heading:"3D angle finder",
    intro:"Set two vectors in space, turn the view, and find the angle between them. Then look at one vector’s angles with the three axes.",
    presets:[
      { id:"look", t:"Look-alike pair", a:[1, 0, 3], b:[0, 1, -2] },
      { id:"hidden", t:"Hidden right angle", a:[1, 2, 2], b:[2, -2, 1] },
      { id:"cube", t:"Cube diagonal and edge", a:[1, 1, 1], b:[1, 0, 0] }
    ],
    views:[{ id:"iso", t:"Isometric" }, { id:"top", t:"Top (`xy`)" }, { id:"front", t:"Front (`xz`)" }, { id:"side", t:"Side (`yz`)" }],
    modes:[{ id:"angle", t:"Angle" }, { id:"dir", t:"Direction angles" }, { id:"look", t:"Look-alike" }],
    modeHow:{
      angle:"Both vectors start at the origin. The plane that contains them is lightly shaded, and the angle arc is drawn in that plane.",
      dir:"Only `vec{a}` is shown, with dashed box guides to the axes and its three angles: α to the `x`-axis, β to the `y`-axis, γ to the `z`-axis.",
      look:"The view is locked and the readout is hidden. Judge the angle by eye, then see the true angle."
    },
    viewHow:"Drag the view, or focus it and use the arrow keys, to turn it (Shift turns 15°).",
    lookAsk:"Judge by eye. The angle between the vectors…",
    looks:[{ id:"perp", t:"looks perpendicular" }, { id:"acute", t:"looks acute" }, { id:"obtuse", t:"looks obtuse" }],
    status:{ perp:"Perpendicular", acute:"Acute", obtuse:"Obtuse", same:"Parallel (same direction)", opp:"Parallel (opposite)", zero:"No angle: a zero vector has no direction" },
    note:"The screen can’t be trusted: only the dot product decides.",
    predIntro:"Make a prediction first. Then the 3D angle finder shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Angle mode, `vec{a} = (1, 2, 2)`, `vec{b} = (2, -2, 1)`. `vec{a} · vec{b} = ` ?",
        options:[{ t:"0", ok:true }, { t:"9" }, { t:"(2, −4, 2)" }, { t:"−2" }],
        explain:"2 − 4 + 2 = 0. 9 is `|vec{a}||vec{b}|` (no angle); (2, −4, 2) forgets to add; −2 drops the `z`-term." },
      { id:"p2", prompt:"Look-alike mode, top view, `vec{a} = (1, 0, 3)`, `vec{b} = (0, 1, -2)`. From the top these vectors look perpendicular. Are they?",
        options:[{ t:"No: the angle is obtuse", ok:true }, { t:"Yes" }, { t:"No: the angle is acute" }, { t:"You can’t tell" }],
        explain:"The top view hides the `z`-components, 3 and −2, whose product is −6. So `vec{a} · vec{b} = -6` and θ ≈ 148°. " + M5 },
      { id:"p3", prompt:"Direction-angles mode, `vec{a} = (2, 2, 1)`. Which axis makes the largest angle with `vec{a}`?",
        options:[{ t:"The `z`-axis", ok:true }, { t:"The `x`-axis" }, { t:"The `y`-axis" }, { t:"All three are equal" }],
        explain:"`cos γ = 1/3` is the smallest cosine. The smallest component gives the smallest cosine, and so the largest angle." },
      { id:"p4", prompt:"Preset “Cube diagonal and edge”: (1, 1, 1) and (1, 0, 0). The angle between them is closest to:",
        options:[{ t:"55°", ok:true }, { t:"45°" }, { t:"30°" }, { t:"60°" }],
        explain:"`cos θ = 1/√3`. A cube’s body diagonal leans more steeply than a face diagonal (45°)." + USE + "cos 55° ≈ 0.574, `1/√3` ≈ 0.577</span>" }
    ],
    chalIntro:"Use the 3D angle finder to meet each goal, then press <strong>Check challenge</strong>. A set-up button locks the vectors each challenge fixes. Each challenge has three levels of help.",
    setups:[{ id:"tc1", t:"Set up challenge 1" }, { id:"tc2", t:"Set up challenge 2" }, { id:"tc3", t:"Set up challenge 3" }, { id:"free", t:"Unlock all" }],
    lockNote:{ tc1:"Challenge 1: `vec{a} = (2, -1, 3)` and `b_1 = 1`, `b_2 = 5` are locked. Choose `b_3 = k`.", tc2:"Challenge 2: `vec{a} = (1, 1, 0)` is locked. Components of `vec{b}` run from −3 to 3.", tc3:"Challenge 3: direction-angles mode, components of `vec{a}` from −3 to 3. Then choose γ." },
    gammas:[0, 45, 60, 90],
    challenges:[
      { id:"tc1", goal:3, prompt:"`vec{a} = (2, -1, 3)` is locked. Set `vec{b} = (1, 5, k)`: choose `k` to make `vec{b}` perpendicular to `vec{a}`.",
        why:"2 − 5 + 3(1) = 0: with `k = 1`, `vec{a} · vec{b} = 0`.",
        hints:["Set `vec{a} · vec{b} = 0`.", "`2 - 5 + 3k = 0`.", "`k = 1`."],
        msgs:{ setup:"Press “Set up challenge 1”: `vec{a} = (2, -1, 3)` and `vec{b} = (1, 5, k)`.", m1:"2 − 5 − 3 = −6: check the sign of `3k`.", z:"2 − 5 = −3: you still need `3k = 3`.",
          other:"`vec{a} · vec{b} = 2 - 5 + 3k = {d}`. You need 0." } },
      { id:"tc2", goal:2, prompt:"`vec{a} = (1, 1, 0)` is locked. Choose `vec{b}` (components −3 to 3) so the angle between them is exactly 60°. Then find a second answer that isn’t a multiple of the first.",
        why:"`cos θ = 1/2` needs `vec{a} · vec{b} = (1/2)|vec{a}||vec{b}|`. The answers are the multiples of (0, 1, 1), (0, 1, −1), (1, 0, 1) and (1, 0, −1).",
        hints:["cos 60° = 1/2, so `vec{a} · vec{b} = (1/2)|vec{a}||vec{b}|`.", "Try `vec{b}` with two components equal to 1 and one 0.", "(0, 1, 1): `vec{a} · vec{b} = 1` and `|vec{a}||vec{b}| = 2`."],
        msgs:{ setup:"Press “Set up challenge 2”: `vec{a} = (1, 1, 0)`.", range:"Keep each component of `vec{b}` between −3 and 3.", zero:"`vec{b}` can’t be the zero vector.",
          y:"45°: close.", one:"About 35°.", obt:"`cos θ = -1/2`: that’s 120°.",
          first:"That’s one 60° answer, {v}. Now find a second answer that isn’t a multiple of it, and check again.", other:"θ {t} now. You need exactly 60°." } },
      { id:"tc3", goal:5, stretch:true, prompt:"Direction-angles mode. Choose `vec{a}` (components −3 to 3) so that α = 45° and β = 45°. What must γ be?",
        why:"`cos^2 α + cos^2 β + cos^2 γ = 1` gives `1/2 + 1/2 + cos^2 γ = 1`, so γ = 90°: `vec{a} = (k, k, 0)` with `k > 0`.",
        hints:["`cos^2 α + cos^2 β + cos^2 γ = 1`.", "`1/2 + 1/2 + cos^2 γ = 1`, so `cos γ = 0`.", "γ = 90°: `vec{a} = (1, 1, 0)`, or any positive multiple."],
        msgs:{ setup:"Press “Set up challenge 3” (direction-angles mode).", range:"Keep each component of `vec{a}` between −3 and 3.", ones:"α = β, but each is about 55°.",
          ones45:"Three 45° angles would need `cos^2` values adding to 3/2.", neg:"α = β = 135°: the components must be positive.",
          gam:"α = β = 45°. Now choose γ with its chip.", gwrong:"α = β = 45°, so `cos^2 γ = 1 - 1/2 - 1/2`. Check your γ.", other:"α {a} and β {b}. You need both to be 45°." } }
    ]
  },
  part3:{
    slug:"orthogonal", name:"Perpendicular",
    heading:"Find the missing component",
    intro:"In R², one direction (and its opposite) is perpendicular to a vector. In R³ there are far more. Build the set of perpendicular vectors one condition at a time, then measure angles in a cube. Then try the quick check.",
    turnHow:"Drag the view, or focus it and use the arrow keys, to turn it (Shift turns 15°).",
    dragHow:"Drag the tip of the vector, or use Previous and Next, to move it between whole-number points. Drag anywhere else (or use the arrow keys on the focused view) to turn the view.",
    stations:[
      { id:"s1", title:"Station 1: one condition, a plane of answers",
        text:"`vec{a} = (1, 2, 3)` is drawn in blue. Every vector perpendicular to it lies in the shaded plane through the origin. Move `vec{b}`’s tip around that plane: `vec{a} · vec{b}` stays 0.",
        count:"Perpendicular vectors found: {n} (there are infinitely many)",
        plane:"The plane’s equation: `x + 2y + 3z = 0`. (You’ll meet this again in module 52.)" },
      { id:"s2", title:"Station 2: two conditions, one line",
        text:"Add `vec{c} = (2, 1, 0)` in orange. A second plane, perpendicular to `vec{c}`, appears. The two planes meet in a line (ink): every vector on it is perpendicular to both `vec{a}` and `vec{c}`.",
        alg:["`x + 2y + 3z = 0` and `2x + y = 0`.", "From the second, `y = -2x`.", "Substituting gives `x - 4x + 3z = 0`, so `z = x`.", "Let `x = t`: `vec{w} = t(1, -2, 1)`."],
        after:"Check `vec{w} · vec{a} = 1 - 4 + 3 = 0` and `vec{w} · vec{c} = 2 - 2 = 0`, then move along the line: (2, −4, 2) and (−1, 2, −1) also work. " + M7 },
      { id:"s3", title:"Station 3: angles in a cube",
        text:"A unit cube has a vertex at the origin. Tap two of its edges, face diagonals or body diagonals from the origin, and the angle computes.",
        vecs:[
          { id:"ex", t:"edge (1, 0, 0)", v:[1, 0, 0] }, { id:"ey", t:"edge (0, 1, 0)", v:[0, 1, 0] }, { id:"ez", t:"edge (0, 0, 1)", v:[0, 0, 1] },
          { id:"fxy", t:"face diagonal (1, 1, 0)", v:[1, 1, 0] }, { id:"fxz", t:"face diagonal (1, 0, 1)", v:[1, 0, 1] }, { id:"fyz", t:"face diagonal (0, 1, 1)", v:[0, 1, 1] },
          { id:"bd", t:"body diagonal (1, 1, 1)", v:[1, 1, 1] }],
        pick:"Tap two vectors." }
    ],
    quickCheck:{
      title:"Quick check", summary:"Find the missing component quick check",
      items:[
        { id:"q1", goal:3, prompt:"How many directions are perpendicular to (1, 2, 3) in R³?",
          choices:[
            { t:"infinitely many (a plane of them)", ok:true, fb:"Right. Every (`x`, `y`, `z`) with `x + 2y + 3z = 0`: a whole plane." },
            { t:"exactly one", fb:M2 },
            { t:"two (opposite)", fb:M2 },
            { t:"none", fb:M2 }] },
        { id:"q2", goal:3, prompt:"Find `k` so that (`k`, 2, −1) is perpendicular to (3, `k`, 4).",
          choices:[
            { t:"4/5", ok:true, fb:"Right. `3k + 2k - 4 = 0`, so `5k = 4`." },
            { t:"4", fb:"`5k = 4`, so divide by 5." },
            { t:"−4/5", fb:"`3k + 2k - 4 = 0` gives `5k = 4`: check the sign." },
            { t:"4/3", fb:"You dropped the middle term `2k`: `3k + 2k - 4 = 0`." }] },
        { id:"q3", goal:4, prompt:"Which vector is perpendicular to both (1, 0, 1) and (0, 1, 1)?",
          choices:[
            { t:"(1, 1, −1)", ok:true, fb:"Right. 1 + 0 − 1 = 0 and 0 + 1 − 1 = 0." },
            { t:"(1, 1, 1)", fb:"(1, 1, 1) · (1, 0, 1) = 2. " + M6 },
            { t:"(1, −1, 0)", fb:"It fails with (1, 0, 1): 1 ≠ 0. " + M6 },
            { t:"(0, 0, 1)", fb:"(0, 0, 1) · (1, 0, 1) = 1. " + M6 }] },
        { id:"q4", goal:6, prompt:"Angle between face diagonals (1, 1, 0) and (0, 1, 1) of a cube?",
          choices:[
            { t:"60°", ok:true, fb:"Right. `1/(√2 · √2) = 1/2`." },
            { t:"90°", fb:"They can look perpendicular in a drawing: `1/(√2 · √2) = 1/2`." },
            { t:"45°", fb:"`cos θ = 1/(√2 · √2) = 1/2`, not `√2/2`." },
            { t:"120°", fb:"The dot product is positive: `1/(√2 · √2) = 1/2`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"angles", type:"numeric", title:"Angles in 3D", summary:"Angles in 3D", star:true, goal:[1, 2, 6],
        instruction:"Find each dot product, cosine or angle. Items 6 to 8 are non-routine.",
        how:"Type whole numbers or fractions such as 3/4. Angles are in degrees.",
        items:[
          { id:"d1", goal:1, prompt:"(1, 2, 2) · (2, 3, 6) = ? Then give `cos θ` as a fraction.", answer:[20, 20 / 21], set:true, keypad:"text",
            label:"The dot product, then `cos θ`, separated by a comma:", display:"20, then `cos θ = 20/21`",
            why:"2 + 6 + 12 = 20, and `|vec{a}||vec{b}| = 3 × 7 = 21`.",
            wrong:[{ match:8, fb:M1 }, { match:[8, 8 / 21], fb:M1 }, { match:20, fb:"Now give `cos θ` too, after a comma." }] },
          { id:"d2", goal:2, prompt:"Angle between (1, −1, 0) and (1, 0, −1), in degrees?", answer:60, unit:"°", display:"60°",
            why:"`vec{a} · vec{b} = 1`; `|vec{a}||vec{b}| = 2`, so `cos θ = 1/2`.", general:"`vec{a} · vec{b} = 1`; `|vec{a}||vec{b}| = 2`." },
          { id:"d3", goal:2, prompt:"Angle between (1, 1, 0) and (−1, 0, 1)?", answer:120, unit:"°", display:"120°",
            why:"`cos θ = -1/2`.", wrong:[{ match:60, fb:"The dot product is −1: obtuse." }] },
          { id:"d4", goal:2, prompt:"Angle between (3, −2, 4) and (2, 5, 1)?", answer:90, unit:"°", display:"90°",
            why:"6 − 10 + 4 = 0.", general:"6 − 10 + 4 = 0." },
          { id:"d5", goal:2, prompt:"Angle between (0, 2, 2) and (0, −3, 0)?", answer:135, unit:"°", display:"135°",
            why:"`cos θ = -6/(2√2 · 3) = -√2/2`.", wrong:[{ match:45, fb:"−6 is negative: obtuse." }] },
          { id:"d6", goal:6, star:true, prompt:"A box measures 2 by 3 by 6. Give `cos θ` for the angle between its long diagonal and its edge of length 6.", answer:6 / 7, keypad:"text", display:"6/7",
            why:"Diagonal (2, 3, 6), length 7; edge (0, 0, 6): 36/(7 × 6) = 6/7.", general:"Diagonal (2, 3, 6), length 7; edge (0, 0, 6): 36/(7 × 6)." },
          { id:"d7", goal:6, star:true, prompt:"Triangle `P`(1, 0, 2), `Q`(3, 1, 4), `R`(2, 2, 0). What is the angle at `P`?", answer:90, unit:"°", display:"90°",
            why:"`vec{PQ} = (2, 1, 2)`, `vec{PR} = (1, 2, -2)`: 2 + 2 − 4 = 0.", general:"`vec{PQ} = (2, 1, 2)`, `vec{PR} = (1, 2, -2)`: 2 + 2 − 4 = 0. Use vectors from `P`.",
            hints:["Build both vectors from `P`.", "`vec{PQ} = (2, 1, 2)`, `vec{PR} = (1, 2, -2)`.", "Dot product 0: 90°."] },
          { id:"d8", goal:6, star:true, prompt:"`|vec{a}| = |vec{b}|` and neither is `vec{0}`. Find the angle between `vec{a} + vec{b}` and `vec{a} - vec{b}`.", answer:90, unit:"°", display:"90°",
            why:"`(vec{a} + vec{b}) · (vec{a} - vec{b}) = |vec{a}|^2 - |vec{b}|^2 = 0`: a rhombus’s diagonals.",
            general:"`(vec{a} + vec{b}) · (vec{a} - vec{b}) = |vec{a}|^2 - |vec{b}|^2 = 0`: a rhombus’s diagonals.",
            hints:["Expand the dot product.", "The `vec{a} · vec{b}` terms cancel.", "`|vec{a}|^2 - |vec{b}|^2 = 0`, so 90°."] }
        ] },
      { id:"dircos", type:"match", title:"Direction cosines", summary:"Direction cosines", goal:5,
        instruction:"Match each vector to its direction cosines or direction angles.",
        how:"Tap a vector, then tap its direction cosines on the right.",
        leftTitle:"Vector", rightTitle:"Direction cosines or angles",
        left:[
          { id:"l1", t:"(1, 2, 2)", why:"`|vec{a}| = 3`." },
          { id:"l2", t:"(2, −1, 2)", why:"`|vec{a}| = 3`, and the `y`-cosine keeps its sign." },
          { id:"l3", t:"(0, 3, 4)", why:"`|vec{a}| = 5`." },
          { id:"l4", t:"(2, 3, 6)", why:"`|vec{a}| = 7`." },
          { id:"l5", t:"(1, 1, 1)", why:"`|vec{a}| = √3`, and `1/√3 = √3/3`." },
          { id:"l6", t:"(−4, 0, 3)", why:"`|vec{a}| = 5`." },
          { id:"l7", t:"(0, 1, 1)", why:"cos α = 0 gives α = 90°; cos β = cos γ = `1/√2 = √2/2` gives 45°.",
            hints:["An angle of 90° means cos α = 0.", "So the `x`-component is 0.", "cos 45° = `√2/2` for the other two: (0, 1, 1)."] }
        ],
        right:[
          { id:"r1", t:"(1/3, 2/3, 2/3)" },
          { id:"r2", t:"(2/3, −1/3, 2/3)" },
          { id:"r3", t:"(0, 3/5, 4/5)" },
          { id:"r4", t:"(2/7, 3/7, 6/7)" },
          { id:"r5", t:"(`√3/3`, `√3/3`, `√3/3`)" },
          { id:"r6", t:"(−4/5, 0, 3/5)" },
          { id:"r7", t:"α = 90°, β = 45°, γ = 45°" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7" },
        wrong:{
          "l1|r2":"Check the sign of the `y`-component.", "l2|r1":"Check the sign of the `y`-component.",
          "l3|r6":"Which component is 0? It’s the `x` in (0, 3, 4) and the `y` in (−4, 0, 3).", "l6|r3":"Which component is 0? It’s the `x` in (0, 3, 4) and the `y` in (−4, 0, 3).",
          "l5|r7":"(1, 1, 1) has no right angle with an axis; (0, 1, 1) makes 90° with the `x`-axis.", "l7|r5":"(1, 1, 1) has no right angle with an axis; (0, 1, 1) makes 90° with the `x`-axis."
        },
        wrongDefault:"Divide each component by the magnitude. There’s no rule that the angles add to 180°." },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Sofia", how:"", goal:[2, 4, 5],
        instruction:"Sofia made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Find the angle between `vec{a} = (2, 1, -2)` and `vec{b} = (1, 0, 1)`.",
            steps:["`|vec{a}| = √(4 + 1 + 4) = 3`.", "`|vec{b}| = √(1 + 0 + 1) = √2`.", "`vec{a} · vec{b} = (2)(1) + (1)(0) + (-2)(1) = 2 + 0 + 2 = 4`.", "`cos θ = 4/(3√2) = 2√2/3`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 uses step 3 correctly."],
            fixes:[
              { t:"(−2)(1) = −2, so `vec{a} · vec{b} = 0`: the vectors are perpendicular and θ = 90°.", ok:true, why:"(−2)(1) = −2. " + M4 },
              { t:"Ignore the `z`-components: 2 + 0 = 2.", why:M1 },
              { t:"`vec{a} · vec{b} = (2, 0, -2)`.", why:"That’s a vector; add the products." },
              { t:"Step 3 is correct.", why:"(−2)(1) = −2. " + M4 }],
            hints:["Recheck each product’s sign.", "(−2)(1) = −2.", "2 + 0 − 2 = 0: 90°."] },
          { id:"e2", goal:4, task:"Find a vector perpendicular to both `vec{u} = (1, 1, 0)` and `vec{v} = (0, 1, 2)`.",
            steps:["Let `vec{w} = (x, y, z)`. Then `vec{u} · vec{w} = x + y = 0`.", "And `vec{v} · vec{w} = y + 2z = 0`.", "From the first equation, `y = -x`.", "Choose `x = 1`, so `y = -1` and `vec{w} = (1, -1, 0)`.", "Check: `vec{u} · vec{w} = 1 - 1 + 0 = 0` ✓"],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "", "This check only tests one condition."],
            fixes:[
              { t:"Use the second equation too: `-1 + 2z = 0`, so `z = 1/2` and `vec{w} = (1, -1, 1/2)`, or (2, −2, 1).", ok:true, why:M6 },
              { t:"`vec{w} = (0, 0, 0)` works.", why:"The zero vector has no direction; the question wants a direction." },
              { t:"Choose `z = 0`; then any `x` works.", why:"`vec{v} · vec{w} = y ≠ 0` unless `y = 0`." },
              { t:"Step 4 is correct.", why:M6 }],
            hints:["Does (1, −1, 0) satisfy `y + 2z = 0`?", "−1 + 0 ≠ 0.", "`z = 1/2`: (2, −2, 1) after scaling."] },
          { id:"e3", goal:5, task:"Find the direction angles of `vec{a} = (2, -2, 1)`. Use these values: cos 48° ≈ 0.67, cos 71° ≈ 0.33.",
            steps:["`|vec{a}| = √(4 + 4 + 1) = 3`.", "`cos α = 2/3`, `cos β = -2/3`, `cos γ = 1/3`.", "Check: 4/9 + 4/9 + 1/9 = 1 ✓", "So α ≈ 48°, β ≈ 48° and γ ≈ 71°.", "The vector leans equally toward the `x`- and `y`-axes."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 reads step 4."],
            fixes:[
              { t:"`cos β < 0`, so β is obtuse: β ≈ 180° − 48° = 132°.", ok:true, why:"A negative cosine means an obtuse angle." },
              { t:"β = −48°.", why:"Direction angles are between 0° and 180°." },
              { t:"α + β + γ must be 180°, so γ = 84°.", why:M3 },
              { t:"Step 4 is correct.", why:"`cos β = -2/3` is negative, so β is obtuse." }],
            hints:["What does a negative cosine tell you about an angle?", "It’s obtuse.", "β ≈ 132°."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most: a pair of vectors that looked perpendicular but wasn’t, or the plane of perpendicular vectors?" },
      { id:"j2", q:"In your own words, why does finding a vector perpendicular to two vectors give a whole line of answers?" },
      { id:"j3", q:"Explain to a friend how to find the direction angles of a vector." },
      { id:"j4", q:"Which still trips you up in 3D: signs in the products, the third component, or setting up the system? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"(3, −1, 4) · (2, 5, −1) = ?", options:[
          { t:"−3", ok:true, why:"6 − 5 − 4." },
          { t:"1", why:"That drops the `z`-term. " + M1 },
          { t:"(6, −5, −4)", why:"Add the products." },
          { t:"15", why:"Signs dropped. " + M4 }] },
        b:{ prompt:"(−2, 3, 1) · (4, 1, 5) = ?", options:[
          { t:"0", ok:true, why:"−8 + 3 + 5." },
          { t:"−5", why:"That drops the `z`-term. " + M1 },
          { t:"(−8, 3, 5)", why:"Add the products." },
          { t:"16", why:"Signs dropped. " + M4 }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Which vector is perpendicular to (2, −1, 3)?", options:[
          { t:"(1, 5, 1)", ok:true, why:"2 − 5 + 3 = 0." },
          { t:"(−2, 1, −3)", why:"That’s the opposite vector, not a perpendicular one." },
          { t:"(1, 2, 1)", why:"The `x`- and `y`-terms cancel, but the `z`-term adds 3. " + M1 },
          { t:"(2, 1, −3)", why:"4 − 1 − 9 = −6." }] },
        b:{ prompt:"Which vector is perpendicular to (1, 4, −2)?", options:[
          { t:"(2, 0, 1)", ok:true, why:"2 + 0 − 2 = 0." },
          { t:"(−1, −4, 2)", why:"Opposite, not perpendicular." },
          { t:"(4, −1, 1)", why:"`x` and `y` cancel, but `z` gives −2. " + M1 },
          { t:"(1, 1, 2)", why:"1 + 4 − 4 = 1, not 0." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"What are the direction cosines of (6, −2, 3)?", options:[
          { t:"(6/7, −2/7, 3/7)", ok:true, why:"`|vec{a}| = √49 = 7`." },
          { t:"(6/11, −2/11, 3/11)", why:"11 adds the absolute values; use the magnitude." },
          { t:"(6, −2, 3)", why:"Divide by the magnitude." },
          { t:"(6/7, 2/7, 3/7)", why:"The `y`-cosine keeps its sign." }] },
        b:{ prompt:"Direction cosines of (−1, 4, 8)?", options:[
          { t:"(−1/9, 4/9, 8/9)", ok:true, why:"`|vec{a}| = 9`." },
          { t:"(−1/13, 4/13, 8/13)", why:"13 adds the absolute values; use the magnitude." },
          { t:"(−1, 4, 8)", why:"Divide by the magnitude, 9." },
          { t:"(1/9, 4/9, 8/9)", why:"Keep the sign." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"Find the angle between (1, −1, 0) and (0, 1, −1).", options:[
          { t:"120°", ok:true, why:"`vec{a} · vec{b} = -1`, `|vec{a}||vec{b}| = 2`, `cos θ = -1/2`." },
          { t:"60°", why:"The dot product is negative: obtuse." },
          { t:"90°", why:"Only 0 would mean perpendicular. " + M5 },
          { t:"150°", why:"cos 150° = `-√3/2`, not −1/2." }] },
        b:{ prompt:"Find the angle between (2, 0, 2) and (0, 3, 3).", options:[
          { t:"60°", ok:true, why:"`6/(2√2 · 3√2) = 6/12 = 1/2`." },
          { t:"120°", why:"The dot product is positive: acute." },
          { t:"90°", why:"Only a dot product of 0 means perpendicular. " + M5 },
          { t:"30°", why:"cos 30° = `√3/2`, not 1/2." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"For which values of `k` are (`k`, 2, −1) and (`k`, −3, `k`) perpendicular?", options:[
          { t:"`k = 3` or `k = -2`", ok:true, why:"`k^2 - 6 - k = 0`, so `(k - 3)(k + 2) = 0`." },
          { t:"`k = 3` only", why:"`k = -2` also gives 0: 4 − 6 + 2." },
          { t:"`k = ±√6`", why:"That drops the `z`-product, `-k`. " + M1 },
          { t:"`k = -3` or `k = 2`", why:"Sign slip in the factors." }] },
        b:{ prompt:"For which `k` are (`k`, 1, 2) and (`k`, −8, `k`) perpendicular?", options:[
          { t:"`k = 2` or `k = -4`", ok:true, why:"`k^2 - 8 + 2k = (k + 4)(k - 2)`." },
          { t:"`k = 2` only", why:"`k = -4` also gives 0: 16 − 8 − 8." },
          { t:"`k = ±2√2`", why:"That drops the `z`-product, `2k`. " + M1 },
          { t:"`k = -2` or `k = 4`", why:"Sign slip in the factors." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"Which vector is perpendicular to both (1, 2, 0) and (0, 1, 3)?", options:[
          { t:"(6, −3, 1)", ok:true, why:"`x + 2y = 0` and `y + 3z = 0`: `y = -3z`, `x = 6z`." },
          { t:"(2, −1, 0)", why:"Perpendicular to the first only: (2, −1, 0) · (0, 1, 3) = −1. " + M6 },
          { t:"(0, 3, −1)", why:"Perpendicular to the second only. " + M6 },
          { t:"(6, 3, 1)", why:"Sign slip: 6 + 6 ≠ 0." }] },
        b:{ prompt:"Which vector is perpendicular to both (1, 0, 2) and (0, 2, 1)?", options:[
          { t:"(4, 1, −2)", ok:true, why:"`x + 2z = 0` and `2y + z = 0`: `z = -2y`, `x = 4y`." },
          { t:"(2, 0, −1)", why:"Perpendicular to the first only: (2, 0, −1) · (0, 2, 1) = −1. " + M6 },
          { t:"(0, 1, −2)", why:"Perpendicular to the second only. " + M6 },
          { t:"(4, 1, 2)", why:"Sign slip: 4 + 4 ≠ 0." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which statement about the vectors perpendicular to `vec{a} = (1, 2, 3)` is correct?", options:[
          { t:"“There are infinitely many. Together they fill a plane through the origin: every (`x`, `y`, `z`) with `x + 2y + 3z = 0`.”", ok:true, why:M2 },
          { t:"“There’s exactly one: (3, 2, 1).”", why:"(3, 2, 1) · (1, 2, 3) = 10, and there are infinitely many anyway. " + M2 },
          { t:"“There are exactly two: one vector and its opposite.”", why:M2 },
          { t:"“Only vectors with a zero component can be perpendicular to it.”", why:"(1, 1, −1) works." }] },
        b:{ prompt:"A drawing shows two 3D vectors meeting at what looks like a right angle. What’s the best way to decide whether they’re perpendicular?", options:[
          { t:"“Compute the dot product from the components: they’re perpendicular exactly when it’s 0.”", ok:true, why:M5 },
          { t:"“Measure the angle on the screen.”", why:M5 },
          { t:"“Check whether their magnitudes are equal.”", why:"Length has nothing to do with it." },
          { t:"“Check whether each has a zero component.”", why:"Not needed, and not enough." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which statement about the direction angles α, β, γ of a vector is always true?", options:[
          { t:"`cos^2 α + cos^2 β + cos^2 γ = 1`", ok:true, why:"They’re the components of a unit vector." },
          { t:"α + β + γ = 180°", why:M3 },
          { t:"α + β + γ = 90°", why:M3 },
          { t:"`cos α + cos β + cos γ = 1`", why:"It’s the squares that add to 1." }] },
        b:{ prompt:"A vector has α = 90°. What does this tell you?", options:[
          { t:"Its `x`-component is 0: it’s parallel to the `yz`-plane.", ok:true, why:"cos 90° = 0, so `a_1 = 0`." },
          { t:"It points along the `x`-axis.", why:"That would make α = 0°." },
          { t:"Its `x`-component is 1.", why:"cos 90° = 0." },
          { t:"β and γ must also be 90°.", why:"Then it would be the zero vector." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A force `vec{F} = (2, 3, -1)` N moves an object through `vec{d} = (4, 0, 2)` m. How much work is done?", options:[
          { t:"6 J", ok:true, why:"8 + 0 − 2." },
          { t:"10 J", why:"Signs dropped. " + M4 },
          { t:"8 J", why:"That drops the `z`-term. " + M1 },
          { t:"(8, 0, −2)", why:"Work is a number: add the products." }] },
        b:{ prompt:"`vec{F} = (-1, 4, 2)` N moves an object through `vec{d} = (3, 2, 5)` m. Work?", options:[
          { t:"15 J", ok:true, why:"−3 + 8 + 10." },
          { t:"21 J", why:"Signs dropped. " + M4 },
          { t:"5 J", why:"That drops the `z`-term. " + M1 },
          { t:"(−3, 8, 10)", why:"Work is a number: add the products." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A cube has a vertex at the origin and edges along the positive axes. What is the angle between the face diagonals (1, 1, 0) and (1, 0, 1)?", options:[
          { t:"60°", ok:true, why:"`1/(√2 · √2) = 1/2`." },
          { t:"90°", why:M5 },
          { t:"45°", why:"That’s the angle between a face diagonal and an edge." },
          { t:"120°", why:"The dot product is positive." }] },
        b:{ prompt:"A box measures 3 by 4 by 12. What is `cos θ` for the angle between its long diagonal (3, 4, 12) and the floor diagonal (3, 4, 0)?", options:[
          { t:"5/13", ok:true, why:"25/(13 × 5)." },
          { t:"12/13", why:"That’s the angle with the vertical edge." },
          { t:"5/12", why:"Divide by the magnitudes, 13 and 5." },
          { t:"25/169", why:"Divide by `|vec{a}||vec{b}| = 65`, not by `13^2`." }] } }
    ]
  },
  task:{
    title:"Square corner", summary:"Square corner",
    statement:"<p>`vec{a} = (2, -1, 2)` is one edge of a cube’s corner. Choose the other two edges `vec{b}` and `vec{c}` so the three edges meet at right angles and have equal lengths. Find as many corners as you can.</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>`vec{b}` is perpendicular to `vec{a}`.</li><li>`vec{c}` is perpendicular to `vec{a}`.</li><li>`vec{b}` is perpendicular to `vec{c}`.</li><li>`|vec{b}| = |vec{c}| = |vec{a}| = 3`.</li></ol></div>" +
      "<p class=\"tiny muted\">Components are whole numbers from −4 to 4. The 3D view shows the three edges and the box they would build; right-angle marks appear as conditions are met.</p>",
    checks:["`vec{b} ⊥ vec{a}`", "`vec{c} ⊥ vec{a}`", "`vec{b} ⊥ vec{c}`", "All three edges have length 3"],
    tips:["`vec{b} · vec{a}` must be 0.", "`vec{c} · vec{a}` must be 0.",
      "Check `vec{b} · vec{c}` too: two vectors perpendicular to `vec{a}` aren’t automatically perpendicular to each other.",
      "Whole-number vectors of length 3 are rearrangements of (±1, ±2, ±2) or (±3, 0, 0)."],
    explainPrompt:"Explain how you found vectors of length 3 perpendicular to `vec{a}`, and why there are only eight answers.",
    vocab:"Use the words dot product, perpendicular, magnitude and direction.",
    after3:"Only two lines are possible for the other edges: along (2, 2, −1) and along (−1, 2, 2). Each can point either way, and `vec{b}` and `vec{c}` can swap roles: 2 × 2 × 2 = 8 corners."
  },
  cards:[
    ["`vec{a} · vec{b}` in R³", "`a_1b_1 + a_2b_2 + a_3b_3 = |vec{a}||vec{b}| cos θ`."],
    ["Angle in 3D", "`cos θ = {vec{a} · vec{b}}/{|vec{a}||vec{b}|}`."],
    ["Perpendicular in 3D", "`vec{a} · vec{b} = 0` (non-zero vectors). Never trust the drawing."],
    ["Perpendicular to one vector", "A whole plane of directions: for (1, 2, 3), every (`x`, `y`, `z`) with `x + 2y + 3z = 0`."],
    ["Perpendicular to two vectors", "Solve two equations; the answers are all multiples of one vector."],
    ["Direction angles", "α, β, γ: the angles with the positive `x`-, `y`-, `z`-axes."],
    ["Direction cosines", "(`a_1/|vec{a}|`, `a_2/|vec{a}|`, `a_3/|vec{a}|`): the unit vector."],
    ["Direction-cosine rule", "`cos^2 α + cos^2 β + cos^2 γ = 1`."],
    ["Handy 3D lengths", "(1, 2, 2) → 3, (2, 3, 6) → 7, (1, 4, 8) → 9, (2, 6, 9) → 11."],
    ["Cube face diagonals", "(1, 1, 0) and (0, 1, 1) meet at 60°."],
    ["Work in 3D", "`W = vec{F} · vec{d}`, adding all three products."],
    ["Angle at a vertex", "Use vectors that start at that vertex."]
  ]
};
