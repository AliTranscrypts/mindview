// MCV4U 43 The Dot Product in R². Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/43-dot-product-in-r2.md
// misconception core sentences (plan §3)
const M1 = "Multiply matching components <strong>and add</strong>: the dot product is a single number.";
const M2 = "The angle in a dot product is between the vectors placed tail to tail. Tip to tail, it’s the supplement: 180° − θ.";
const M3 = "Negative means the angle is obtuse. Zero (for non-zero vectors) means perpendicular.";
const M4 = "`|vec{a}||vec{b}|` alone is the dot product only when the vectors point the same way. Multiply by `cos θ`.";
const M5 = "Pair `x` with `x` and `y` with `y`: `a_1 b_1 + a_2 b_2`.";
const M6 = "`vec{a} · vec{a} = |vec{a}||vec{a}| cos 0° = |vec{a}|^2`.";
const M7 = "`vec{a} · vec{b}` is a number. You can scale `vec{c}` by it, `(vec{a} · vec{b})vec{c}`, but you can’t dot it.";
const M8 = "Only the part of the force along the motion does work: `W = |vec{F}||vec{d}| cos θ`.";
const AB = "`vec{a} · vec{b}`";

export default {
  id:"43-dot-product-in-r2",
  kind:"topic",
  title:"The dot product in R²",
  topic:"The Dot Product in R²",
  readyTopic:"the dot product in R²",
  hero:{
    eq:"<span class=\"dp-ca\">`vec{a}`</span> `·` <span class=\"dp-cb\">`vec{b}`</span> `= |`<span class=\"dp-ca\">`vec{a}`</span>`||`<span class=\"dp-cb\">`vec{b}`</span>`| cos θ = `<span class=\"dp-ca\">`a_1`</span><span class=\"dp-cb\">`b_1`</span>` + `<span class=\"dp-ca\">`a_2`</span><span class=\"dp-cb\">`b_2`</span>",
    eqLabel:"a dot b equals the magnitude of a times the magnitude of b times cos theta, which equals a 1 b 1 plus a 2 b 2.",
    eqSize:"sm",
    headline:"Two vectors in, one number out",
    text:"The <strong>dot product</strong> combines two vectors into a single number that measures how much they point the same way. It’s positive when the angle between them is acute, <strong>zero when they’re perpendicular</strong>, and negative when the angle is obtuse. It also gives the <strong>work</strong> a force does.",
    fig:{ html:'<div class="dp-hero" id="dp-hero" role="img" aria-label="Vector a = (4, 0) in blue is fixed; vector b of length 3 in teal turns from 0° to 180°. The dot product falls from 12 through 6, 0 and −6 to −12."></div>' }
  },
  goals:[
    "I can calculate a dot product from the magnitudes and the angle between two vectors.",
    "I can calculate a dot product from components and explain why the two formulas agree.",
    "I can use the sign of a dot product to tell whether an angle is acute, right or obtuse, and test vectors for perpendicularity.",
    "I can find the angle between two vectors.",
    "I can use the properties of the dot product to expand and simplify expressions.",
    "I can calculate the work done by a force."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Magnitudes and components", goal:2, prompt:"What is `|(-5, 12)|`?",
          options:[
            { t:"13", ok:true, why:"`√{25 + 144} = √169`." },
            { t:"17", why:"That adds the absolute values. Use Pythagoras." },
            { t:"7", why:"`-5 + 12` isn’t a length." },
            { t:"169", why:"That forgets the square root: `√169 = 13`." }],
          hints:["`|(x, y)| = √{x^2 + y^2}`.", "`25 + 144 = 169`.", "`√169 = 13`."] },
        { id:"w2", skill:"Special-angle cosines", goal:1, prompt:"`cos 120°` = ?",
          options:[
            { t:"`-1/2`", ok:true, why:"120° is in quadrant 2, with reference angle 60°." },
            { t:"`1/2`", why:"Cosine is negative in quadrant 2." },
            { t:"`-√3/2`", why:"That’s `cos 150°`." },
            { t:"`√3/2`", why:"That’s `cos 30°`." }],
          hints:["Reference angle?", "60°, in quadrant 2.", "`-cos 60° = -1/2`."] },
        { id:"w3", skill:"Special-angle cosines", goal:4, prompt:"`cos 135°` = ?",
          options:[
            { t:"`-√2/2`", ok:true, why:"Reference angle 45° in quadrant 2." },
            { t:"`√2/2`", why:"Cosine is negative in quadrant 2: keep the minus sign." },
            { t:"`-1/2`", why:"That’s `cos 120°`." },
            { t:"`-√3/2`", why:"That’s `cos 150°`." }],
          hints:["Reference angle 45°.", "Quadrant 2: cosine negative.", "`-√2/2`."] },
        { id:"w4", skill:"Angle between vectors", goal:1, prompt:"`vec{u}` points east and `vec{v}` points north-west. What is the angle between them, tail to tail?",
          options:[
            { t:"135°", ok:true, why:"East to north is 90°; north to north-west is 45° more." },
            { t:"45°", why:"That’s the acute angle with the west axis. Measure from `vec{u}` to `vec{v}`." },
            { t:"225°", why:"That goes the long way round. The angle between vectors is at most 180°." },
            { t:"315°", why:"That’s a direction, not the angle between two vectors." }],
          hints:["Place both tails at one point.", "Turn from east to north-west the short way.", "90° + 45° = 135°."] },
        { id:"w5", skill:"Angle between vectors", goal:1, prompt:"Two vectors drawn tip to tail make an angle of 60° at the joint. What is the angle between the vectors, tail to tail?",
          options:[
            { t:"120°", ok:true, why:"Slide one so the tails meet: the angle becomes 180° − 60°." },
            { t:"60°", why:"Tip to tail shows the supplement. " + M2 },
            { t:"30°", why:"No halving: it’s the supplement." },
            { t:"240°", why:"Angles between vectors stay within 0°–180°." }],
          hints:["Move one vector so the tails touch.", "The joint angle and the tail-to-tail angle are supplementary.", "180° − 60° = 120°."] },
        { id:"w6", skill:"Magnitudes and components", goal:2, prompt:"`vec{u} = (3, -1)` and `vec{v} = (2, 4)`. What is `vec{u} + 2vec{v}`?",
          options:[
            { t:"`(7, 7)`", ok:true, why:"`(3 + 4, -1 + 8)`." },
            { t:"`(5, 3)`", why:"That’s `vec{u} + vec{v}`: scale `vec{v}` by 2 first." },
            { t:"`(10, 6)`", why:"That’s `2(vec{u} + vec{v})`." },
            { t:"`(6, -4)`", why:"That multiplies matching components. That’s not a vector operation we use." }],
          hints:["Scale `vec{v}` first.", "`2vec{v} = (4, 8)`.", "`(3 + 4, -1 + 8) = (7, 7)`."] }
      ],
      refreshers:{
        "Magnitudes and components":"`|(x, y)| = √{x^2 + y^2}`; add vectors and scale them component by component.",
        "Special-angle cosines":"`cos 60° = 1/2`, `cos 45° = √2/2`, `cos 30° = √3/2`; for 120°, 135° and 150°, the same values with a minus sign.",
        "Angle between vectors":"Put the tails together; the angle is measured the short way, from 0° to 180°."
      }
    }
  },
  explore:{
    heading:"Angle and alignment m&#101;ter",
    intro:"Turn two vectors and watch one number respond. Then switch to components and check that a completely different-looking formula gives the same number.",
    modes:[{ id:"polar", t:"Polar" }, { id:"comp", t:"Components" }, { id:"work", t:"Work" }],
    txt:{
      mode:"Mode", pa:"`|vec{a}|`", pb:"`|vec{b}|`", th:"Angle θ", F:"`|vec{F}|`", fa:"Angle above the floor", d:"`|vec{d}|`",
      dragNote:"Drag the tips of `vec{a}` and `vec{b}`. Or Tab to a tip and use the arrow keys (one grid step each).",
      polarNote:"`vec{a}` lies along the positive `x`-axis; `vec{b}` turns.",
      push:"Push", resetBox:"Reset the box",
      setupH:"Load a challenge", setup:["Challenge 1", "Challenge 2", "Challenge 3"],
      locked:"locked for this challenge", unlock:"Unlock",
      key:"`vec{a}` blue, `vec{b}` teal. The yellow band on `vec{b}`’s line is the part of `vec{a}` that lies along `vec{b}`.",
      keyWork:"`vec{F}` blue, `vec{d}` teal. Dashed: the force’s “along the floor” and “lifting” parts.",
      zones:["positive: acute", "zero: right angle", "negative: obtuse"], zonesH:"Sign of the dot product",
      rows:{ a:"`vec{a}`", b:"`vec{b}`", F:"`vec{F}`", d:"`vec{d}`", th:"Angle θ", geo:"`|vec{a}||vec{b}| cos θ`", geoW:"`|vec{F}||vec{d}| cos θ`",
        comp:"`a_1 b_1 + a_2 b_2`", compW:"`F_1 d_1 + F_2 d_2`", sign:"Sign", work:"Work", along:"Along the floor", lift:"Lifting" },
      sign:{ pos:"Positive: acute angle", zero:"Zero: the vectors are perpendicular", neg:"Negative: obtuse angle", zvec:"Zero: one vector is `vec{0}`, so there’s no angle" },
      hidden:"hidden until you press Check challenge", noAngle:"none (zero vector)",
      showAll:"Show all rows", showFew:"Show fewer rows",
      aboveFloor:"above the floor", alongFloor:"along the floor", alongX:"along the positive `x`-axis", at:"at",
      note:"Note", tipA:"Tip of vector a", tipB:"Tip of vector b"
    },
    predIntro:"Make a prediction first. Then the m&#101;ter shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Polar mode: `|vec{a}| = 4`, `|vec{b}| = 5`, θ = 0°. Now `vec{b}` turns to 60°. What will " + AB + " be at 60°?",
        options:[{ t:"10", ok:true }, { t:"20" }, { t:"`10√3`" }, { t:"a vector of length 10" }],
        explain:"`4 × 5 × cos 60° = 20 × 1/2 = 10`. 20 forgets `cos θ` (M4); `10√3` uses sine; and a dot product is a number, not a vector (M1)." },
      { id:"p2", prompt:"Polar mode: `|vec{a}| = 4`, `|vec{b}| = 5`. θ sweeps from 0° to 180°. How does " + AB + " change?",
        options:[{ t:"It falls from 20 to −20, passing 0 at 90°", ok:true }, { t:"It falls from 20 to 0 and never goes below" }, { t:"It stays 20" }, { t:"It rises to 40" }],
        explain:"`cos θ` runs from 1 to −1, so the dot product does too, scaled by 20. A negative value just means an obtuse angle." },
      { id:"p3", prompt:"Components mode: `vec{a} = (3, 4)`, `vec{b} = (4, -3)`. " + AB + " = ?",
        options:[{ t:"0", ok:true }, { t:"7" }, { t:"`(12, -12)`" }, { t:"25" }],
        explain:"`(3)(4) + (4)(-3) = 12 - 12 = 0`, so the vectors are perpendicular. 7 comes from cross-multiplying (M5); `(12, -12)` forgets to add (M1); 25 is `|vec{a}||vec{b}|`, which ignores the angle (M4)." },
      { id:"p4", prompt:"Work mode: `vec{F}` = 10 N at 60° above the floor, `|vec{d}|` = 8 m. How much work does the force do?",
        options:[{ t:"40 J", ok:true }, { t:"80 J" }, { t:"`40√3` J" }, { t:"0 J" }],
        explain:"Only `10 cos 60° = 5` N acts along the motion: `5 × 8 = 40` J. " + M8 }
    ],
    chalIntro:"Use the m&#101;ter, then press <strong>Check challenge</strong>. <strong>Load a challenge</strong> sets the mode and locks the given vector. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3], prompt:"Components mode: `vec{a} = (2, 3)` is locked. Drag `vec{b}` so that " + AB + " `= 0` and `|vec{b}| = √13`.",
        why:"`(2)(3) + (3)(-2) = 0` and `|vec{b}| = √13`. Swap the components and change one sign: `(3, -2)` or `(-3, 2)`.",
        hints:["You need `2b_1 + 3b_2 = 0`.", "Swap the components and change one sign.", "`(3, -2)` or `(-3, 2)`."],
        msgs:{ mode:"Switch to Components mode (or press Challenge 1 under Load a challenge).", a:"Put `vec{a}` back at `(2, 3)`: it stays there for this challenge.",
          swap:"Swapping isn’t enough: `(2)(-2) + (3)(3) = 5`. Swap and change one sign.", twice:"Perpendicular, but twice as long: `|vec{b}| = 2√13`.",
          self:"That’s `vec{a}` itself: `vec{a} · vec{a} = 13`.",
          perpLen:"Perpendicular, but `|vec{b}|` = LEN, not `√13`.", notZero:"`vec{a} · vec{b}` = NUM, not 0." } },
      { id:"tc2", goal:[3, 4], prompt:"Polar mode: `|vec{a}|` is locked at 6. Set `|vec{b}|` and θ so that " + AB + " `= -12`.",
        why:"`6|vec{b}| cos θ = -12` needs `|vec{b}| cos θ = -2`: `(4, 120°)` or `(2, 180°)`.",
        hints:["`6|vec{b}| cos θ = -12`, so `|vec{b}| cos θ = -2`.", "Try `cos θ = -1/2` or −1.", "`(4, 120°)` or `(2, 180°)`."],
        msgs:{ mode:"Switch to Polar mode (or press Challenge 2 under Load a challenge).", a:"Set `|vec{a}|` to 6 first (Challenge 2 locks it there).",
          sign:"Right size, wrong sign: an acute angle gives a positive product. " + M3, perp:"Perpendicular gives 0.",
          another:"There’s another answer. Can you find it?", notVal:"`vec{a} · vec{b}` = NUM, not −12." } },
      { id:"tc3", goal:[4], stretch:true, prompt:"Components mode: `vec{a} = (4, 2)` is locked. Find `vec{b}`, with whole-number components and `|vec{b}| = √10`, so that the angle between them is exactly 45°. (The angle readout is hidden until you press <strong>Check challenge</strong>.)",
        why:"`(1, 3)` gives `4 + 6 = 10` and `(3, -1)` gives `12 - 2 = 10`; `cos θ = 10/(√20 √10) = √2/2`, so θ = 45°.",
        hints:["`cos 45° = (vec{a} · vec{b})/(|vec{a}||vec{b}|)`, so `vec{a} · vec{b} = (√2/2)(√20)(√10) = 10`.", "List vectors with `|vec{b}|^2 = 10`: `(±1, ±3)` and `(±3, ±1)`. Which give `4b_1 + 2b_2 = 10`?", "`(1, 3)` gives `4 + 6 = 10`; `(3, -1)` gives `12 - 2 = 10`."],
        msgs:{ mode:"Switch to Components mode (or press Challenge 3 under Load a challenge).", a:"Put `vec{a}` back at `(4, 2)`: it stays there for this challenge.",
          close:"The angle is only about 8°: too close to `vec{a}`.", far:"About 82°: too far.", long:"`|vec{b}| = √20`, not `√10`.", lenNot:"`|vec{b}|` = LEN, not `√10`.", angNot:"The angle is about NUM°, not 45°." } }
    ]
  },
  part3:{
    slug:"properties", name:"Properties",
    heading:"Properties of the dot product",
    intro:"Tap a property card. Drag the vectors around: both sides are worked out for every position, and a ✓ shows when they agree for every position you’ve tried. The last card tests a law that doesn’t work.",
    cards:[
      { id:"comm", t:"Commutative", law:"`vec{a} · vec{b} = vec{b} · vec{a}`", note:"The angle between them is the same either way." },
      { id:"dist", t:"Distributive", law:"`vec{a} · (vec{b} + vec{c}) = vec{a} · vec{b} + vec{a} · vec{c}`", note:"Shadows on `vec{a}`’s line: the shadow of `vec{b} + vec{c}` is the shadow of `vec{b}` plus the shadow of `vec{c}`." },
      { id:"scal", t:"Scalar multiple", law:"`(@a{k}vec{a}) · vec{b} = @a{k}(vec{a} · vec{b})`", note:"Here `@a{k}` does the job of a stretch, so it’s violet." },
      { id:"self", t:"Self dot product", law:"`vec{a} · vec{a} = |vec{a}|^2`", note:"The angle between `vec{a}` and itself is 0°, and `cos 0° = 1`." },
      { id:"perp", t:"Perpendicular test", law:"`vec{a} · vec{b} = 0` ⇔ `vec{a} ⊥ vec{b}` (non-zero vectors)", note:"`vec{i} · vec{i} = vec{j} · vec{j} = 1` and `vec{i} · vec{j} = 0`." },
      { id:"assoc", t:"“Associative?”", law:"`(vec{a} · vec{b}) · vec{c}` = ?", note:"Try to work it out, one dot at a time." }
    ],
    labels:{ cardsH:"Property cards", left:"Left side", right:"Right side", agree:"✓ Both sides agree for every position you’ve tried", tried:"positions tried",
      differ:"The two sides differ", nonzero:"Use non-zero vectors for this test.", perpYes:"perpendicular", perpNo:"not perpendicular",
      k:"`@a{k}`", kNote:"Here `@a{k}` does the job of a stretch.",
      step1:"Work out `vec{a} · vec{b}`", step2:"Now dot with `vec{c}`", restart:"Start again",
      stuck:"`vec{a} · vec{b}` is the number NUM. You can scale `vec{c}` by it (NUM`vec{c}`), but there’s no dot product of a number and a vector.",
      compareH:"Compare `(vec{a} · vec{b})vec{c}` with `vec{a}(vec{b} · vec{c})`", alongC:"along `vec{c}`", alongA:"along `vec{a}`",
      diffNote:"Different vectors: one lies along `vec{c}`, the other along `vec{a}`. So even the scaled version of “associativity” fails.",
      scaleNote:"(drawn shorter to fit)", more:"Drag a vector to try more positions.", drag:"Drag the tips (or Tab to a tip and use the arrow keys)." },
    algebra:{ title:"Check it with algebra",
      proofs:[
        { h:"Why the component formula works",
          lines:["`vec{a} · vec{b} = (a_1 vec{i} + a_2 vec{j}) · (b_1 vec{i} + b_2 vec{j})`",
            "`= a_1 b_1(vec{i} · vec{i}) + a_1 b_2(vec{i} · vec{j}) + a_2 b_1(vec{j} · vec{i}) + a_2 b_2(vec{j} · vec{j})`",
            "`= a_1 b_1(1) + a_1 b_2(0) + a_2 b_1(0) + a_2 b_2(1) = a_1 b_1 + a_2 b_2`"] },
        { h:"From the cosine law",
          lines:["`|vec{a} - vec{b}|^2 = |vec{a}|^2 + |vec{b}|^2 - 2|vec{a}||vec{b}| cos θ`",
            "Left side in components: `(a_1 - b_1)^2 + (a_2 - b_2)^2 = a_1^2 + a_2^2 + b_1^2 + b_2^2 - 2a_1 b_1 - 2a_2 b_2`.",
            "The squares cancel with `|vec{a}|^2 + |vec{b}|^2`, leaving `-2(a_1 b_1 + a_2 b_2) = -2|vec{a}||vec{b}| cos θ`.",
            "So `a_1 b_1 + a_2 b_2 = |vec{a}||vec{b}| cos θ`."] }
      ] },
    quickCheck:{
      title:"Quick check", summary:"Properties quick check",
      items:[
        { id:"q1", goal:5, prompt:"Which of these is a scalar?",
          choices:[{ t:"`vec{a} · vec{b}`", ok:true, fb:"Right. A dot product is a single number." },
            { t:"`(vec{a} · vec{b})vec{c}`", fb:"`(vec{a} · vec{b})vec{c}` is a number times a vector: a vector." },
            { t:"`vec{a} + vec{b}`", fb:"A sum of two vectors is a vector." },
            { t:"`3vec{a}`", fb:"A number times a vector is a vector." }] },
        { id:"q2", goal:5, prompt:"If `vec{a} · vec{a} = 49`, then `|vec{a}|` = ?",
          choices:[{ t:"7", ok:true, fb:"Right. `|vec{a}|^2 = 49`, so `|vec{a}| = 7`." },
            { t:"49", fb:"`vec{a} · vec{a}` is `|vec{a}|^2`. " + M6 },
            { t:"24.5", fb:"`vec{a} · vec{a}` is `|vec{a}|^2`, not `2|vec{a}|`. " + M6 },
            { t:"`√7`", fb:"`(√7)^2 = 7`, not 49." }] },
        { id:"q3", goal:5, prompt:"Expand `(vec{a} + vec{b}) · (vec{a} - vec{b})`.",
          choices:[{ t:"`|vec{a}|^2 - |vec{b}|^2`", ok:true, fb:"Right. `-vec{a} · vec{b} + vec{b} · vec{a} = 0`, since the dot product is commutative." },
            { t:"`|vec{a}|^2 + |vec{b}|^2`", fb:"`-vec{a} · vec{b} + vec{b} · vec{a} = 0`, since the dot product is commutative, and `-vec{b} · vec{b} = -|vec{b}|^2`." },
            { t:"`|vec{a}|^2 - 2vec{a} · vec{b} + |vec{b}|^2`", fb:"`-vec{a} · vec{b} + vec{b} · vec{a} = 0`, since the dot product is commutative." },
            { t:"0", fb:"`-vec{a} · vec{b} + vec{b} · vec{a} = 0`, since the dot product is commutative, but `|vec{a}|^2 - |vec{b}|^2` remains." }] },
        { id:"q4", goal:5, prompt:"Which expression is meaningless?",
          choices:[{ t:"`(vec{a} · vec{b}) · vec{c}`", ok:true, fb:"Right. " + M7 },
            { t:"`(vec{a} · vec{b})vec{c}`", fb:"That’s a number times a vector: fine. " + M7 },
            { t:"`vec{a} · (vec{b} + vec{c})`", fb:"Fine: dot `vec{a}` with the vector `vec{b} + vec{c}`." },
            { t:"`(2vec{a}) · vec{b}`", fb:"Fine: `2vec{a}` is a vector, and it equals `2(vec{a} · vec{b})`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sign", type:"sorter", title:"Positive, zero or negative?", summary:"Positive, zero or negative?", noun:"pair", goal:3,
        instruction:"Tap a pair, then tap the box for the sign of its dot product.",
        boxes:[{ id:"pos", label:"Positive (acute)" }, { id:"zero", label:"Zero (perpendicular)" }, { id:"neg", label:"Negative (obtuse)" }],
        items:[
          { id:"i1", t:"`(2, 5)` and `(5, -2)`", answer:"zero", why:"`10 - 10 = 0`." },
          { id:"i2", t:"`(-3, 1)` and `(2, 4)`", answer:"neg", why:"`-6 + 4 = -2`.", wrong:{ pos:"Add the products with their signs: `-6 + 4`." } },
          { id:"i3", t:"`|vec{a}| = 3`, `|vec{b}| = 7`, θ = 100°", answer:"neg", why:"`cos 100° < 0`.",
            hints:["What’s the sign of `cos 100°`?", "100° is obtuse.", "Negative."] },
          { id:"i4", t:"`(4, -1)` and `(1, 3)`", answer:"pos", why:"`4 - 3 = 1`: barely acute.", wrong:{ zero:"Close, but `4 - 3 = 1`, not 0." } },
          { id:"i5", t:"`(0, 6)` and `(-9, 0)`", answer:"zero", why:"One is vertical, one horizontal." },
          { id:"i6", t:"`|vec{a}| = 2`, `|vec{b}| = 2`, θ = 89°", answer:"pos", why:"Just under 90°: `cos 89°` is small but positive.", wrong:{ zero:"89° isn’t 90°." } },
          { id:"i7", t:"`vec{a}` and `-vec{a}` (`vec{a} ≠ vec{0}`)", answer:"neg", why:"θ = 180°: `vec{a} · (-vec{a}) = -|vec{a}|^2`.",
            wrong:{ zero:"Opposite vectors aren’t perpendicular: the angle is 180°. " + M3 } },
          { id:"i8", t:"`(1, 1)` and `(-3, 2)`", answer:"neg", why:"`-3 + 2 = -1`." },
          { id:"i9", t:"`vec{i} + vec{j}` and `vec{i} - vec{j}`", answer:"zero", why:"`(1, 1) · (1, -1) = 1 - 1 = 0`.",
            hints:["Write both in components.", "`(1, 1)` and `(1, -1)`.", "`1 - 1 = 0`: zero."] }
        ],
        wrongDefault:"Work out the dot product (or the sign of `cos θ`) first." },
      { id:"angles", type:"custom", title:"Angles and perpendicular vectors", summary:"Angles and perpendicular vectors", star:true, goal:[3, 4, 5],
        instruction:"Find each angle or value. Items 5 to 7 are non-routine (★); 6 and 7 go beyond the Final Check.",
        how:"Type whole numbers or fractions such as 3/2 (angles in degrees). Then press Check.",
        msgs:{ fill:"Fill in every box first.", err:"Type a number, such as 45, −4 or 3/2.", two:"Type both values, separated by a comma.",
          pick:"Tap an angle first.", general:"Not yet. Check your work and try again." },
        items:[
          { id:"a1", goal:4, kind:"num", prompt:"Angle between `(1, 2)` and `(3, 1)`, in degrees?", unit:"°", answer:45, display:"45°",
            general:"`vec{a} · vec{b} = 5`; `|vec{a}||vec{b}| = √5 · √10 = 5√2`.", why:"`cos θ = 5/(5√2) = √2/2`, so θ = 45°." },
          { id:"a2", goal:4, kind:"num", prompt:"Angle between `(1, 2)` and `(-3, -1)`?", unit:"°", answer:135, display:"135°",
            wrong:[{ v:45, fb:"The dot product is −5: obtuse. " + M3 }], why:"`cos θ = -5/(5√2) = -√2/2`, so θ = 135°." },
          { id:"a3", goal:4, kind:"num", prompt:"`|vec{a}| = 4`, `|vec{b}| = 6` and `vec{a} · vec{b} = -12`. Angle between them?", unit:"°", answer:120, display:"120°",
            wrong:[{ v:60, fb:M3 }], why:"`cos θ = -12/24 = -1/2`, so θ = 120°." },
          { id:"a4", goal:3, kind:"num", prompt:"Find `k` so that `(k, 3)` is perpendicular to `(4, -2)`.", label:"`k =`", answer:1.5, display:"`k = 3/2`",
            wrong:[{ v:-1.5, fb:"`4k - 6 = 0` gives `k = +3/2`." }], why:"`4k - 6 = 0`, so `k = 3/2`." },
          { id:"a5", goal:3, kind:"set", star:true, prompt:"Find every `k` that makes `(k, 2)` perpendicular to `(k, -8)`.", label:"`k =`", answer:[4, -4], display:"`k = 4` and `k = -4`",
            note:"Separate the values with a comma.", partial:"`k^2 - 16 = 0` has two solutions.", why:"`k^2 - 16 = 0`, so `k = ±4`." },
          { id:"a6", goal:5, kind:"pair", star:true, prompt:"`|vec{a}| = 3`, `|vec{b}| = 5` and `|vec{a} + vec{b}| = 7`. Find `vec{a} · vec{b}` and the angle between `vec{a}` and `vec{b}`.",
            boxes:[{ k:"dot", label:"`vec{a} · vec{b} =`" }, { k:"th", label:"θ =", unit:"°" }], answer:{ dot:7.5, th:60 }, display:"`vec{a} · vec{b} = 15/2`, θ = 60°",
            general:"`|vec{a} + vec{b}|^2 = |vec{a}|^2 + 2vec{a} · vec{b} + |vec{b}|^2`: `49 = 34 + 2vec{a} · vec{b}`.",
            why:"`49 = 9 + 2vec{a} · vec{b} + 25` gives `vec{a} · vec{b} = 15/2`; `cos θ = (15/2)/15 = 1/2`, so θ = 60°.",
            hints:["Expand `|vec{a} + vec{b}|^2 = (vec{a} + vec{b}) · (vec{a} + vec{b})`.", "`49 = 9 + 2vec{a} · vec{b} + 25`, so `vec{a} · vec{b} = 15/2`.", "`cos θ = (15/2)/15 = 1/2`: θ = 60°."] },
          { id:"a7", goal:3, kind:"chips", star:true, prompt:"Triangle `ABC` has `A(1, 1)`, `B(4, 2)`, `C(0, 4)`. Which angle is 90°?",
            choices:[{ id:"A", t:"Angle `A`" }, { id:"B", t:"Angle `B`" }, { id:"C", t:"Angle `C`" }], answer:"A", display:"Angle `A`",
            general:"`vec{AB} · vec{AC} = (3, 1) · (-1, 3) = 0`. Use vectors that start at the vertex you’re testing.",
            wrong:[{ v:"B", fb:"At `B`: `vec{BA} · vec{BC} = (-3, -1) · (-4, 2) = 10`, not 0. Use vectors that start at the vertex you’re testing." },
              { v:"C", fb:"At `C`: `vec{CA} · vec{CB} = (1, -3) · (4, -2) = 10`, not 0. Use vectors that start at the vertex you’re testing." }],
            why:"`vec{AB} · vec{AC} = (3, 1) · (-1, 3) = -3 + 3 = 0`: the right angle is at `A`.",
            hints:["At vertex `A`, use `vec{AB}` and `vec{AC}`.", "`vec{AB} = (3, 1)`, `vec{AC} = (-1, 3)`.", "`-3 + 3 = 0`: the right angle is at `A`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Rashid", how:"", goal:[1, 4, 5],
        instruction:"Rashid made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Find the angle between `vec{a} = (5, 1)` and `vec{b} = (2, 3)`.",
            steps:["`|vec{a}| = √26` and `|vec{b}| = √13`.", "`vec{a} · vec{b} = (5)(3) + (1)(2) = 17`.", "`cos θ = 17/(√26 · √13) = 17/(13√2)`.", "θ ≈ 23°."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 uses step 2 correctly. The mistake is earlier.", "Step 4 follows step 3."],
            fixes:[
              { t:"Pair matching components: `(5)(2) + (1)(3) = 13`, so `cos θ = 13/(13√2) = √2/2` and θ = 45°.", ok:true, why:M5 },
              { t:"`vec{a} · vec{b} = (10, 3)`.", why:M1 },
              { t:"`vec{a} · vec{b} = √26 × √13 = 13√2`.", why:M4 },
              { t:"Step 2 is correct.", why:"Step 2 cross-multiplies. " + M5 }],
            hints:["Which component of `vec{a}` goes with `b_1`?", "`a_1 b_1 + a_2 b_2`.", "`10 + 3 = 13`: θ = 45°."] },
          { id:"e2", goal:1, task:"In a diagram, `vec{u}` and `vec{v}` are drawn tip to tail with an angle of 120° at the joint; `|vec{u}| = 4` and `|vec{v}| = 3`. Find `vec{u} · vec{v}`.",
            steps:["The diagram shows a 120° angle where the vectors meet.", "So the angle between `vec{u}` and `vec{v}` is 120°.", "`vec{u} · vec{v} = (4)(3) cos 120° = -6`.", "The angle is obtuse, so the dot product is negative."],
            answer:1,
            stepFb:["Step 1 is correct: that’s what the diagram shows.", "", "Step 3 uses step 2’s angle correctly.", "Step 4 follows step 3."],
            fixes:[
              { t:"Tip to tail, the angle between the vectors is 180° − 120° = 60°, so `vec{u} · vec{v} = 12 cos 60° = 6`.", ok:true, why:M2 },
              { t:"Use `sin 120°` instead.", why:"The dot product uses cosine. The real slip is the angle: " + M2 },
              { t:"The angle is 240°.", why:"Angles between vectors are at most 180°." },
              { t:"Step 2 is correct.", why:M2 }],
            hints:["Slide `vec{v}` back so its tail meets `vec{u}`’s tail.", "The angle between them becomes the supplement.", "60°: `vec{u} · vec{v} = 6`."] },
          { id:"e3", goal:5, task:"Given `|vec{a}| = 3`, `|vec{b}| = 2` and `vec{a} · vec{b} = 1`, find `(vec{a} + 2vec{b}) · (vec{a} - vec{b})`.",
            steps:["`= vec{a} · vec{a} - vec{a} · vec{b} + 2vec{b} · vec{a} - 2vec{b} · vec{b}`", "`= vec{a} · vec{a} + vec{a} · vec{b} - 2vec{b} · vec{b}`", "`= 3 + 1 - 2(2)`", "`= 0`"],
            answer:2,
            stepFb:["Step 1 is correct: it uses the distributive law.", "Step 2 is correct: `vec{b} · vec{a} = vec{a} · vec{b}`.", "", "Step 4’s arithmetic matches step 3."],
            fixes:[
              { t:"`vec{a} · vec{a} = |vec{a}|^2 = 9` and `vec{b} · vec{b} = 4`, so the value is `9 + 1 - 8 = 2`.", ok:true, why:M6 },
              { t:"`vec{a} · vec{a} = 2|vec{a}| = 6`.", why:M6 },
              { t:"The `vec{a} · vec{b}` terms cancel, so it’s `9 - 8 = 1`.", why:"`-1 + 2 = +1`, so one `vec{a} · vec{b}` remains." },
              { t:"Step 3 is correct.", why:M6 }],
            hints:["What is `vec{a} · vec{a}` in terms of `|vec{a}|`?", "`|vec{a}|^2 = 9`, `|vec{b}|^2 = 4`.", "`9 + 1 - 8 = 2`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the alignment m&#101;ter: that the dot product went negative, or that the component formula always matched?" },
      { id:"j2", q:"In your own words, what does the sign of a dot product tell you?" },
      { id:"j3", q:"Explain to a friend how to test whether two vectors are perpendicular, using components." },
      { id:"j4", q:"Which still trips you up: the angle between vectors, the component formula, or the properties? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"`|vec{a}| = 6`, `|vec{b}| = 5` and the angle between them is 60°. Find `vec{a} · vec{b}`.", options:[
          { t:"15", ok:true, why:"`30 cos 60° = 15`." },
          { t:"30", why:M4 },
          { t:"`15√3`", why:"That uses `sin 60°`." },
          { t:"−15", why:"`cos 60°` is positive. " + M3 }] },
        b:{ prompt:"`|vec{a}| = 4`, `|vec{b}| = 9` and the angle is 120°. Find `vec{a} · vec{b}`.", options:[
          { t:"−18", ok:true, why:"`36 cos 120° = -18`." },
          { t:"18", why:"`cos 120°` is negative. " + M3 },
          { t:"36", why:M4 },
          { t:"`18√3`", why:"That uses `sin 120°`." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"`(4, -3) · (2, 5)` = ?", options:[
          { t:"−7", ok:true, why:"`8 - 15`." },
          { t:"`(8, -15)`", why:M1 },
          { t:"14", why:"That’s `(4)(5) + (-3)(2)`. " + M5 },
          { t:"23", why:"The signs were dropped: `8 + 15`." }] },
        b:{ prompt:"`(-2, 6) · (3, 1)` = ?", options:[
          { t:"0", ok:true, why:"`-6 + 6`." },
          { t:"`(-6, 6)`", why:M1 },
          { t:"16", why:"That’s `(-2)(1) + (6)(3)`. " + M5 },
          { t:"12", why:"The signs were dropped: `6 + 6`." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which vector is perpendicular to `(6, -4)`?", options:[
          { t:"`(2, 3)`", ok:true, why:"`12 - 12 = 0`." },
          { t:"`(3, 2)`", why:"Swapping without changing a sign gives `18 - 8 = 10`." },
          { t:"`(-3, 2)`", why:"That’s parallel to `(6, -4)`, pointing the other way." },
          { t:"`(1, 1)`", why:"`6 - 4 = 2`: close to 0 isn’t 0." }] },
        b:{ prompt:"Which vector is perpendicular to `(5, 2)`?", options:[
          { t:"`(-2, 5)`", ok:true, why:"`-10 + 10 = 0`." },
          { t:"`(2, 5)`", why:"Swap and change a sign: `10 + 10 = 20`." },
          { t:"`(-5, -2)`", why:"That’s opposite, not perpendicular." },
          { t:"`(1, -2)`", why:"`5 - 4 = 1`, not 0." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Find the angle between `(4, 2)` and `(-1, -3)`.", options:[
          { t:"135°", ok:true, why:"`vec{a} · vec{b} = -10`; `|vec{a}||vec{b}| = √20 · √10 = 10√2`; `cos θ = -√2/2`." },
          { t:"45°", why:"The dot product is negative, so the angle is obtuse. " + M3 },
          { t:"225°", why:"Angles between vectors are at most 180°." },
          { t:"120°", why:"That uses `|vec{a}||vec{b}| = 20` instead of `10√2`." }] },
        b:{ prompt:"Find the angle between `(3, -1)` and `(-2, -1)`.", options:[
          { t:"135°", ok:true, why:"`vec{a} · vec{b} = -5`; `|vec{a}||vec{b}| = √10 · √5 = 5√2`." },
          { t:"45°", why:"The dot product is −5, so the angle is obtuse. " + M3 },
          { t:"225°", why:"Angles between vectors are at most 180°." },
          { t:"120°", why:"That uses `|vec{a}||vec{b}| = 10` instead of `5√2`." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"`|vec{a}| = 5`, `|vec{b}| = 3` and `vec{a} · vec{b} = 6`. Find `|vec{a} - vec{b}|`.", options:[
          { t:"`√22`", ok:true, why:"`|vec{a} - vec{b}|^2 = 25 - 2(6) + 9 = 22`." },
          { t:"`√46`", why:"The middle term is `-2vec{a} · vec{b}`, not +." },
          { t:"2", why:"`|vec{a} - vec{b}|` isn’t `|vec{a}| - |vec{b}|` unless they’re parallel." },
          { t:"`√34`", why:"That ignores the `-2vec{a} · vec{b}` term. " + M6 }] },
        b:{ prompt:"`|vec{a}| = 4`, `|vec{b}| = 2` and `vec{a} · vec{b} = -3`. Find `|vec{a} + vec{b}|`.", options:[
          { t:"`√14`", ok:true, why:"`16 + 2(-3) + 4 = 14`." },
          { t:"`√26`", why:"`2vec{a} · vec{b} = -6`, not +6." },
          { t:"6", why:"`|vec{a} + vec{b}|` isn’t `|vec{a}| + |vec{b}|`." },
          { t:"`√20`", why:"That ignores the `2vec{a} · vec{b}` term." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"For which values of `k` are `(k, 4)` and `(k - 2, -2)` perpendicular?", options:[
          { t:"`k = 4` or `k = -2`", ok:true, why:"`k^2 - 2k - 8 = (k - 4)(k + 2) = 0`." },
          { t:"`k = 4` only", why:"`k = -2` also works: `(-2, 4) · (-4, -2) = 8 - 8 = 0`." },
          { t:"`k = -4` or `k = 2`", why:"Sign slip: `(k - 4)(k + 2) = 0` gives 4 and −2." },
          { t:"`k = 2`", why:"That makes one component 0, but the dot product is −8." }] },
        b:{ prompt:"For which `k` are `(k, 3)` and `(k + 1, -4)` perpendicular?", options:[
          { t:"`k = 3` or `k = -4`", ok:true, why:"`k^2 + k - 12 = (k + 4)(k - 3)`." },
          { t:"`k = 3` only", why:"`k = -4` also works: `(-4, 3) · (-3, -4) = 12 - 12 = 0`." },
          { t:"`k = -3` or `k = 4`", why:"Sign slip: `(k + 4)(k - 3) = 0` gives −4 and 3." },
          { t:"`k = -1`", why:"That zeroes one component; the dot product is −12." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which best explains why `(a_1, a_2) · (b_1, b_2) = a_1 b_1 + a_2 b_2`?", options:[
          { t:"“Write `vec{a} = a_1 vec{i} + a_2 vec{j}` and `vec{b} = b_1 vec{i} + b_2 vec{j}` and expand: `vec{i} · vec{i} = vec{j} · vec{j} = 1` and `vec{i} · vec{j} = 0`, so only `a_1 b_1 + a_2 b_2` remains.”", ok:true, why:"The distributive law and the unit vectors’ dot products leave exactly the matching products." },
          { t:"“It’s a definition with no connection to `|vec{a}||vec{b}| cos θ`.”", why:"The two formulas are proved equal." },
          { t:"“Because `vec{a} · vec{b} = (a_1 b_1, a_2 b_2)`.”", why:M1 },
          { t:"“Because `vec{i} · vec{j} = 1`.”", why:"`vec{i}` and `vec{j}` are perpendicular, so `vec{i} · vec{j} = 0`." }] },
        b:{ prompt:"`vec{a} · vec{b} < 0` for two vectors. Which statement is correct?", options:[
          { t:"“The angle between `vec{a}` and `vec{b}` is obtuse (between 90° and 180°).”", ok:true, why:"`cos θ < 0` exactly when θ is obtuse." },
          { t:"“One of the vectors must have a negative component.”", why:"`(1, 1) · (-3, 2) < 0`, but `(1, 1)` has none." },
          { t:"“There’s an error: dot products can’t be negative.”", why:M3 },
          { t:"“The vectors point in the same direction.”", why:"That gives a positive product." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which expression is meaningless?", options:[
          { t:"`(vec{a} · vec{b}) · vec{c}`", ok:true, why:"`vec{a} · vec{b}` is a number; you can’t dot a number with a vector." },
          { t:"`(vec{a} · vec{b})vec{c}`", why:"That’s a number times a vector: fine." },
          { t:"`vec{a} · (vec{b} + vec{c})`", why:"Fine: dot `vec{a}` with the vector `vec{b} + vec{c}`." },
          { t:"`|vec{a}|^2`", why:"Fine: it equals `vec{a} · vec{a}`." }] },
        b:{ prompt:"Which statement is <strong>not</strong> always true?", options:[
          { t:"`(vec{a} · vec{b})vec{c} = vec{a}(vec{b} · vec{c})`", ok:true, why:"The left side is parallel to `vec{c}`, the right side to `vec{a}`." },
          { t:"`vec{a} · vec{b} = vec{b} · vec{a}`", why:"Always true." },
          { t:"`vec{a} · vec{a} = |vec{a}|^2`", why:"Always true." },
          { t:"`(3vec{a}) · vec{b} = 3(vec{a} · vec{b})`", why:"Always true." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A sled is pulled 20 m along level snow by a rope with tension 50 N at 60° above the horizontal. How much work is done?", options:[
          { t:"500 J", ok:true, why:"`50 × 20 × cos 60°`." },
          { t:"1000 J", why:M8 },
          { t:"`500√3` J", why:"That uses `sin 60°`: the lifting part does no work along the snow." },
          { t:"0 J", why:"The rope isn’t along the motion, but part of its pull is." }] },
        b:{ prompt:"A cart is pushed 12 m along a level floor by a 40 N force directed 30° below the horizontal. Work done?", options:[
          { t:"`240√3` J", ok:true, why:"`40 × 12 × cos 30°`." },
          { t:"480 J", why:M8 },
          { t:"240 J", why:"That uses `sin 30°`." },
          { t:"`-240√3` J", why:"Pushing downward at an angle still moves the cart forward: the work is positive." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A force `vec{F} = (6, 8)` N moves an object from `A(1, 2)` to `B(4, -2)`, in metres. How much work does it do?", options:[
          { t:"−14 J", ok:true, why:"`vec{d} = vec{AB} = (3, -4)`; `vec{F} · vec{d} = 18 - 32`." },
          { t:"`(18, -32)`", why:M1 },
          { t:"50 J", why:"`|vec{F}||vec{d}| = 10 × 5` ignores the angle. " + M4 },
          { t:"14 J", why:"The force mostly opposes the motion: negative work. " + M3 }] },
        b:{ prompt:"`vec{F} = (5, -2)` N moves an object from `A(-1, 3)` to `B(3, 6)`. Work done?", options:[
          { t:"14 J", ok:true, why:"`vec{d} = (4, 3)`; `20 - 6`." },
          { t:"`(20, -6)`", why:M1 },
          { t:"`5√29` J", why:"`|vec{F}||vec{d}| = √29 × 5` ignores the angle. " + M4 },
          { t:"−14 J", why:"That uses `A - B`, the reverse displacement." }] } }
    ]
  },
  task:{
    title:"Design the rhombus", summary:"Design the rhombus",
    statement:"<p>Build a parallelogram `ABCD` from `vec{AB} = vec{a}` and `vec{AD} = vec{b}`. Choose whole-number vectors so that every condition holds. How many can you find?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>The diagonals `vec{AC} = vec{a} + vec{b}` and `vec{DB} = vec{a} - vec{b}` are perpendicular.</li><li>Side `AB` has length 5.</li><li>`vec{a} · vec{b} = -7`.</li></ol></div>" +
      "<p class=\"tiny muted\">`vec{a} = (a_1, a_2)` and `vec{b} = (b_1, b_2)`: whole numbers from −6 to 6. The parallelogram, its diagonals and the angle at `A` update as you go.</p>",
    checks:["Diagonals perpendicular", "`|vec{AB}| = 5`", "`vec{a} · vec{b} = -7`"],
    tips:["Expand `(vec{a} + vec{b}) · (vec{a} - vec{b}) = |vec{a}|^2 - |vec{b}|^2`: the diagonals are perpendicular exactly when the sides are equal.",
      "Which whole-number vectors have length 5? Think 3-4-5.",
      "A negative dot product means an obtuse angle at `A`: try `(3, 4)` with `(3, -4)`."],
    explainPrompt:"Explain why perpendicular diagonals force the two sides to have equal length, and how you found a pair with `vec{a} · vec{b} = -7`.",
    vocab:"Use the words dot product, perpendicular, magnitude and expand.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Every answer is a rhombus with sides 5 and an angle at `A` of about 106° (`cos θ = -7/25`). Condition 1 forced equal sides: that’s the rhombus property, proved with the dot product.",
    labels:{ a1:"`a_1`", a2:"`a_2`", b1:"`b_1`", b2:"`b_2`", range:"(−6 to 6)",
      invalid:"Choose whole numbers from −6 to 6 for every component.",
      rows:{ a:"`vec{a} = vec{AB}`", b:"`vec{b} = vec{AD}`", diag:"`(vec{a} + vec{b}) · (vec{a} - vec{b})`", side:"`|vec{AB}|`", dot:"`vec{a} · vec{b}`", angA:"Angle at `A`" },
      graph:"Parallelogram `ABCD` with its diagonals" }
  },
  cards:[
    ["`vec{a} · vec{b}` (geometric)", "`|vec{a}||vec{b}| cos θ`, θ between the tails, 0° ≤ θ ≤ 180°."],
    ["`vec{a} · vec{b}` (components)", "`a_1 b_1 + a_2 b_2`: a number, not a vector."],
    ["Sign of `vec{a} · vec{b}`", "Positive: acute. Zero: perpendicular. Negative: obtuse."],
    ["Perpendicular test", "Non-zero `vec{a} ⊥ vec{b}` exactly when `vec{a} · vec{b} = 0`."],
    ["Angle between vectors", "`cos θ = (vec{a} · vec{b})/(|vec{a}||vec{b}|)`."],
    ["`vec{a} · vec{a}`", "`|vec{a}|^2`."],
    ["Perpendicular to `(p, q)`", "`(-q, p)` or `(q, -p)`."],
    ["Laws that hold", "Commutative; distributive over +; `(@a{k}vec{a}) · vec{b} = @a{k}(vec{a} · vec{b})`."],
    ["“Associative”", "Meaningless: `vec{a} · vec{b}` is a number, and a number can’t be dotted."],
    ["`vec{i}` and `vec{j}`", "`vec{i} · vec{i} = vec{j} · vec{j} = 1`; `vec{i} · vec{j} = 0`."],
    ["Work", "`W = vec{F} · vec{d} = |vec{F}||vec{d}| cos θ`, in joules (N·m)."],
    ["`(vec{a} + vec{b}) · (vec{a} - vec{b})`", "`|vec{a}|^2 - |vec{b}|^2`: zero exactly when `|vec{a}| = |vec{b}|`."]
  ]
};
