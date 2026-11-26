// MCV4U 35 Multiplication of a Vector by a Scalar. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/35-scalar-multiplication.md
// misconception core sentences (plan §3)
const M1 = "Lengths are never negative. The minus sign reverses the direction; the length is `|k||vec{u}|`.";
const M2 = "`k vec{u}` always lies on `vec{u}`’s line: same way or opposite way.";
const M3 = "Divide by the magnitude first to get length 1; then multiply by the length you want.";
const M4 = "Collinear means one is `k` times the other, component by component; `k` may be negative.";
const M5 = "AP:PB = 2:3 cuts `vec{AB}` into 5 equal parts; `vec{AP}` takes 2 of them: ⅖`vec{AB}`.";
const M6 = "`vec{MN}` goes from M to N: `vec{AN} - vec{AM}` (end minus start).";
const M7 = "The 2 multiplies both vectors: `2vec{u} - 2vec{v}`.";
const PAIR = "A pair such as (2, −3) means the vector with run 2 and rise −3.";

export default {
  id:"35-scalar-multiplication",
  kind:"topic",
  title:"Multiplication of a vector by a scalar",
  topic:"Multiplication of a Vector by a Scalar",
  readyTopic:"multiplying a vector by a scalar",
  hero:{
    eq:"`@a{k} vec{u}` <span class=\"smv-heq2\">`|@a{k} vec{u}| = |@a{k}| |vec{u}|`</span>",
    eqLabel:"k times vector u. The magnitude of k u equals the absolute value of k times the magnitude of u.",
    eqSize:"sm",
    headline:"Stretch, shrink, flip, but never turn",
    text:"Multiplying a vector by a <strong>scalar</strong> `k` changes its length by a factor of `|k|`. If `k` is negative, the vector also <strong>reverses</strong>. It never turns to a new angle, so `vec{u}` and `k vec{u}` are always <strong>collinear</strong>. Divide a vector by its own length and you get a <strong>unit vector</strong>: length 1, same direction.",
    fig:{ html:'<div class="smv-hero"><canvas class="plot" id="hero-plot" role="img" aria-label="An arrow u on a dashed track line through the origin, stretched, shrunk and reversed by a violet scalar k."></canvas></div>' }
  },
  goals:[
    "I can describe `k vec{u}`: its magnitude `|k||vec{u}|` and its direction.",
    "I can draw `k vec{u}` and combinations such as `2vec{u} - vec{v}`.",
    "I can decide whether two vectors are collinear by finding `k` with `vec{v} = k vec{u}`.",
    "I can find a unit vector, or a vector of a given length, in the direction of `vec{u}`.",
    "I can express vectors in a figure in terms of given vectors, using midpoints and ratios.",
    "I can use scalar multiples to prove geometric facts, such as the midsegment theorem and collinearity."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Vector basics", goal:1, prompt:"`vec{u}` has run 2 and rise −1. What are the run and rise of `vec{u} + vec{u}`?",
          options:[
            { t:"4 and −2", ok:true, why:"Tip to tail, two copies: double each." },
            { t:"4 and −1", why:"Both components double." },
            { t:"2 and −2", why:"The run doubles too." },
            { t:"0 and 0", why:"That’s the difference." }],
          hints:["Place a second copy at the tip.", "Run 2 + 2, rise −1 + (−1).", "4 and −2."] },
        { id:"w2", skill:"Vector basics", goal:5, prompt:"In parallelogram ABCD, `vec{AB} = vec{u}` and `vec{AD} = vec{v}`. What is `vec{AC}`?",
          options:[
            { t:"`vec{u} + vec{v}`", ok:true, why:"A → B → C: `vec{u}` then `vec{v}`." },
            { t:"`vec{u} - vec{v}`", why:"That’s `vec{DB}`." },
            { t:"`vec{v} - vec{u}`", why:"That’s `vec{BD}`." },
            { t:"`vec{u} · vec{v}`", why:"Paths add tip to tail." }],
          hints:["Find a path from A to C along the sides.", "A → B is `vec{u}`; B → C equals `vec{AD}`.", "`vec{u} + vec{v}`."] },
        { id:"w3", skill:"Midpoints and ratios", goal:5, prompt:"What is the midpoint of A(2, −4) and B(8, 6)?",
          options:[
            { t:"(5, 1)", ok:true, why:"Average the coordinates." },
            { t:"(6, 10)", why:"That’s B − A." },
            { t:"(3, 5)", why:"Add half the difference to A." },
            { t:"(10, 2)", why:"Divide the sum by 2." }],
          hints:["Average each coordinate.", "(2 + 8)/2 and (−4 + 6)/2.", "(5, 1)."] },
        { id:"w4", skill:"Midpoints and ratios", goal:5, prompt:"P lies on segment AB with AP:PB = 3:1. What fraction of AB is AP?",
          options:[
            { t:"3/4", ok:true, why:"4 equal parts; AP takes 3." },
            { t:"1/3", why:"That compares PB to AP." },
            { t:"3", why:"AP is part of AB, so less than 1." },
            { t:"1/4", why:"That’s PB’s share." }],
          hints:["How many equal parts in total?", "3 + 1 = 4.", "3/4."] },
        { id:"w5", skill:"Magnitudes and radicals", goal:4, prompt:"What is the magnitude of a vector with run 1 and rise 2?",
          options:[
            { t:"`√5`", ok:true, why:"`√(1 + 4)`." },
            { t:"3", why:"Use Pythagoras." },
            { t:"5", why:"5 is the square." },
            { t:"`√3`", why:"`1^2 + 2^2 = 5`." }],
          hints:["`√(run^2 + rise^2)`.", "`√(1 + 4)`.", "`√5`."] },
        { id:"w6", skill:"Magnitudes and radicals", goal:4, prompt:"Rationalize `3/√5`.",
          options:[
            { t:"`{3√5}/{5}`", ok:true, why:"Multiply top and bottom by `√5`." },
            { t:"`3/5`", why:"`√5 × √5 = 5`, but the top gains a `√5`." },
            { t:"`{√15}/{5}`", why:"`3 × √5 = 3√5`, not `√15`." },
            { t:"`3√5`", why:"Divide by 5." }],
          hints:["Multiply by `√5/√5`.", "`3√5/(√5 · √5)`.", "`{3√5}/{5}`."] }
      ],
      refreshers:{
        "Vector basics":"Adding a vector to itself doubles both run and rise. In a parallelogram ABCD, `vec{AC} = vec{AB} + vec{AD}` and `vec{DB} = vec{AB} - vec{AD}`.",
        "Midpoints and ratios":"The midpoint averages the coordinates. If AP:PB = `m`:`n`, then AP is `m/(m + n)` of AB.",
        "Magnitudes and radicals":"Magnitude = `√(run^2 + rise^2)`. To rationalize `a/√b`, multiply top and bottom by `√b`."
      }
    }
  },
  explore:{
    heading:"Stretch dial",
    intro:"Set a vector, then turn the dial. Watch what the scalar does to its length and direction. Then build unit vectors and combinations.",
    modes:[{ id:"stretch", t:"Stretch" }, { id:"unit", t:"Unit" }, { id:"combine", t:"Combine" }],
    txt:{
      mode:"Mode",
      dragNote:"Drag the tip of `vec{u}` (or Tab to it and use the arrow keys). Run and rise snap to whole numbers from −8 to 8.",
      dragNoteC:"Drag the tips of `vec{u}` and `vec{v}` (or Tab to them and use the arrow keys).",
      kLabel:"Scalar `@a{k}`",
      kNote:"Arrow keys step `k` by 0.25; Shift + arrows by 1. `k` is violet because it stretches, like `a` in a transformation.",
      sLabel:"`s`", tLabel:"`t`",
      stNote:"`s` and `t` are combination coefficients (ink), from −3 to 3 in steps of 0.5.",
      wOn:"Show `vec{w}` (challenge 3)", wOff:"Hide `vec{w}`",
      wNote:"`vec{w}` = run 2, rise −3 is fixed, and `k` is locked at 1.",
      found:"Answers found so far:", noneFound:"none yet",
      L:"Length `L`", div:"Divide by `|vec{u}|`", mul:"Multiply by `L`", again:"Start over",
      unitNote:"Press <strong>Divide by `|vec{u}|`</strong> to make a unit vector, then <strong>Multiply by `L`</strong> to give it length `L`.",
      key:"`vec{u}` in blue on its dashed track; `@a{k} vec{u}` in thick black.",
      keyU:"`vec{u}` in blue; the dashed unit circle has radius 1; the result in thick blue (a unit vector) or thick black.",
      keyC:"`s vec{u}` in blue, then `t vec{v}` in teal from its tip; the result `s vec{u} + t vec{v}` in thick black.",
      rows:{ u:"`vec{u}`", v:"`vec{v}`", k:"`@a{k}`", ku:"`@a{k} vec{u}`", kum:"`|@a{k} vec{u}|`", dir:"Direction", L:"`L`",
        unit:"Unit vector", lu:"`L · vec{u}/|vec{u}|`", mu:"`L vec{u}`", res:"Result", st:"`s`, `t`" },
      same:"same as `vec{u}`", opp:"opposite to `vec{u}`", zero:"zero vector",
      pressDiv:"Press <strong>Divide by `|vec{u}|`</strong>.", length:"length", off:"(runs off the grid)"
    },
    predIntro:"Make a prediction first. Then the stretch dial shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Stretch: `vec{u}` = run 3, rise 4. Set `k = -2`. What is `|k vec{u}|`?",
        options:[{ t:"10", ok:true }, { t:"−10" }, { t:"5" }, { t:"2" }],
        explain:"`|-2| × 5 = 10`. The minus sign reversed the arrow; the length can’t be negative." },
      { id:"p2", prompt:"Stretch: same `vec{u}`, `k = 2`. As `k` slides from 2 down to −2, what happens to `k vec{u}`?",
        options:[{ t:"It shrinks to `vec{0}` at `k = 0`, then grows pointing the opposite way", ok:true }, { t:"It rotates around the origin" }, { t:"It vanishes at `k = -1`" }, { t:"It keeps pointing the same way" }],
        explain:"`k vec{u}` stays on `vec{u}`’s line for every `k`." },
      { id:"p3", prompt:"Unit: `vec{u}` = run 3, rise 4. Which is the unit vector in the direction of `vec{u}`?",
        options:[{ t:"run 3/5, rise 4/5", ok:true }, { t:"run 1, rise 1" }, { t:"run 3/7, rise 4/7" }, { t:"run 1/3, rise 1/4" }],
        explain:"Divide by the magnitude 5. (1, 1) has length `√2` and points a different way; dividing by 3 + 4 gives length 5/7." },
      { id:"p4", prompt:"Combine: `vec{u}` = run 1, rise 2; `vec{v}` = run 3, rise 1; `s = 2`, `t = -1`. What is `2vec{u} - vec{v}`?",
        options:[{ t:"run −1, rise 3", ok:true }, { t:"run −4, rise 2" }, { t:"run 5, rise 5" }, { t:"run −2, rise 1" }],
        explain:"(2, 4) − (3, 1) = (−1, 3). Run −4, rise 2 is `2(vec{u} - vec{v})`, which doubles `vec{v}` too." }
    ],
    chalIntro:"Set up the stretch dial, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Stretch: `vec{u}` = run 2, rise −1. Set `k` so that `k vec{u}` has magnitude `3√5` and points opposite to `vec{u}`.",
        why:"`|vec{u}| = √5`, so `|k| = 3`; opposite means `k = -3`, and `-3vec{u}` = run −6, rise 3.",
        hints:["`|vec{u}| = √5`.", "`|k| × √5 = 3√5`, so `|k| = 3`.", "Opposite: `k = -3`."],
        msgs:{ setU:"Set `vec{u}` to run 2, rise −1 first: drag its tip.", locked:"Hide `vec{w}` first, so that `k` can move.",
          k3:"Right length, wrong way.", k15:"Length `1.5√5`; you need twice that.",
          general:"Not yet: `|k vec{u}|` must be `3√5`, and `k vec{u}` must point opposite to `vec{u}`." } },
      { id:"tc2", goal:4, prompt:"Unit mode: `vec{u}` = run 3, rise −4. Use the buttons and `L` to build a vector of length 10 in the direction of `vec{u}`, then set `k` in Stretch mode to match it.",
        why:"`vec{u}/5` = run 3/5, rise −4/5; times 10 gives run 6, rise −8, which is `2vec{u}`. So `k = 2`.",
        hints:["Unit vector first: divide by 5.", "(3/5, −4/5) × 10.", "(6, −8) = `2vec{u}`, so `k = 2`."],
        msgs:{ setU:"Set `vec{u}` to run 3, rise −4 first: drag its tip.",
          mulFirst:"Length 50. Divide by `|vec{u}| = 5` first.",
          build:"Not yet: build the vector of length 10 in Unit mode first.",
          k10:M3, kneg:"Opposite direction.",
          kset:"Your vector of length 10 is ready. Now set `k` in Stretch mode so that `k vec{u}` matches it." } },
      { id:"tc3", goal:3, stretch:true, prompt:"Stretch mode, with `k` locked at 1: the fixed vector `vec{w}` = run 2, rise −3 is shown in teal. Drag `vec{u}` so it is collinear with `vec{w}` and exactly twice as long. Find <strong>both</strong> answers.",
        why:"`vec{u} = k vec{w}` with `|k| = 2`: `k = 2` gives (4, −6) and `k = -2` gives (−4, 6).",
        hints:["Collinear means `vec{u} = k vec{w}`.", "Twice as long means `|k| = 2`.", "`k = 2` gives (4, −6); `k = -2` gives (−4, 6)."],
        msgs:{ showW:"Press <strong>Show `vec{w}`</strong> in Stretch mode first.", runOnly:"Only the run doubled.",
          swap:"Swapping components turns the arrow; it isn’t a multiple.", self:"That’s `vec{w}` itself.",
          one:"One answer found. Find the other one: `k` may be negative.",
          general:"Not yet: `vec{u}` must be `k vec{w}` with `|k| = 2`. Find both answers." } }
    ]
  },
  part3:{
    slug:"geometry", name:"Geometry",
    heading:"Vectors in geometry",
    intro:"Drag the points and watch a relationship hold for every shape. Then check it with vector algebra and try the quick check.",
    labels:{ steps:"Check it with algebra", line:"Line", drag:"Drag a point, or Tab to it and use the arrow keys (whole numbers from −6 to 6)." },
    st1:{ title:"Station 1: The midsegment",
      text:"Drag A, B or C. M and N are the midpoints of AB and AC. `vec{MN}` is thick black and `vec{BC}` is blue.",
      fig:"Triangle ABC with midpoints M of AB and N of AC, the vector MN and the vector BC.",
      rows:{ mn:"`|vec{MN}|`", bc:"`|vec{BC}|`", ratio:"`|vec{MN}| : |vec{BC}|`", par:"Direction" },
      ratio:"1/2", par:"parallel ✓ (`vec{MN} = ½vec{BC}`)",
      alg:["`vec{AM} = ½vec{AB}` and `vec{AN} = ½vec{AC}`.", "`vec{MN} = vec{AN} - vec{AM}`", "`= ½vec{AC} - ½vec{AB}`", "`= ½(vec{AC} - vec{AB})`", "`= ½vec{BC}`",
        "A scalar multiple of `vec{BC}`: parallel and half as long."] },
    st2:{ title:"Station 2: Collinear or not?",
      text:"Drag A, B and C. When `vec{AC}` is a scalar multiple of `vec{AB}`, the three points lie on one line.",
      fig:"Three points A, B and C with the vectors AB and AC.",
      rows:{ ab:"`vec{AB}`", ac:"`vec{AC}`", verdict:"Verdict" },
      far:"collinear, B is {f} of the way from A to C", near:"collinear, C is {f} of the way from A to B",
      between:"collinear, A lies between B and C", no:"No `k` works: not collinear." },
    st3:{ title:"Station 3: Dividing a segment",
      text:"A and B are fixed. Choose the ratio AP:PB = `m`:`n`. The segment shows `m + n` equal parts, and P takes `m` of them.",
      fig:"Segment AB from A(−5, 1) to B(3, 5), divided into equal parts, with the point P and the vectors OA, OB and OP from the origin.",
      m:"`m`", n:"`n`", rows:{ ratio:"AP:PB", ap:"`vec{AP}`", op:"`vec{OP}`", p:"P" } },
    quickCheck:{
      title:"Quick check", summary:"Vectors in geometry quick check",
      items:[
        { id:"q1", goal:5, prompt:"M is the midpoint of AB. `vec{MB}` = ?",
          choices:[{ t:"½`vec{AB}`", ok:true, fb:"Right. M to B is half of A to B, same direction." }, { t:"−½`vec{AB}`", fb:"M to B is half of A to B, same direction." },
            { t:"2`vec{AB}`", fb:"M to B is half of A to B, same direction." }, { t:"`vec{AB}`", fb:"M to B is half of A to B, same direction." }] },
        { id:"q2", goal:5, prompt:"AP:PB = 1:2. `vec{AP}` = ?",
          choices:[{ t:"⅓`vec{AB}`", ok:true, fb:"Right. 1 + 2 = 3 equal parts; `vec{AP}` takes 1 of them." }, { t:"½`vec{AB}`", fb:"AP:PB = 1:2 cuts `vec{AB}` into 3 equal parts; `vec{AP}` takes 1 of them: ⅓`vec{AB}`." },
            { t:"⅔`vec{AB}`", fb:"AP:PB = 1:2 cuts `vec{AB}` into 3 equal parts; `vec{AP}` takes 1 of them: ⅓`vec{AB}`." }, { t:"2`vec{AB}`", fb:"AP:PB = 1:2 cuts `vec{AB}` into 3 equal parts; `vec{AP}` takes 1 of them: ⅓`vec{AB}`." }] },
        { id:"q3", goal:3, prompt:"`vec{AC} = -2vec{AB}`. Are A, B, C collinear?",
          choices:[{ t:"Yes, with A between B and C", ok:true, fb:"Right. `vec{AC}` is a multiple of `vec{AB}`; the minus sign puts C on the far side of A." },
            { t:"No, `k` is negative", fb:"Negative `k` still means parallel; C is on the far side of A." },
            { t:"Yes, with B between A and C", fb:"Negative `k` still means parallel; C is on the far side of A." },
            { t:"Only if `k > 0`", fb:"Negative `k` still means parallel; C is on the far side of A." }] },
        { id:"q4", goal:6, prompt:"`vec{MN}` joins midpoints of AB and AC. `vec{MN}` = ?",
          choices:[{ t:"½`vec{BC}`", ok:true, fb:"Right. `vec{AN} - vec{AM} = ½(vec{AC} - vec{AB}) = ½vec{BC}`." }, { t:"½`vec{CB}`", fb:M6 + " That gives ½`vec{BC}`." },
            { t:"`vec{BC}`", fb:M6 + " That gives ½`vec{BC}`." }, { t:"2`vec{BC}`", fb:M6 + " That gives ½`vec{BC}`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Same way, opposite way, or not collinear?", summary:"Same way, opposite way, or not collinear?", noun:"pair", goal:[1, 3],
        instruction:"Sort each pair of vectors. " + PAIR,
        boxes:[{ id:"same", label:"Same way" }, { id:"opp", label:"Opposite way" }, { id:"not", label:"Not collinear" }],
        items:[
          { id:"i1", t:"`vec{u}` and `3vec{u}`", answer:"same", why:"`k = 3 > 0`.", wrong:{ opp:"`k = 3 > 0`.", not:"`k = 3 > 0`." } },
          { id:"i2", t:"`vec{u}` and `-½vec{u}`", answer:"opp", why:"`k = -½ < 0`.", wrong:{ same:"`k = -½ < 0`. " + M4, not:"`k = -½ < 0`. " + M4 } },
          { id:"i3", t:"(2, −3) and (−6, 9)", answer:"opp", why:"(−6, 9) = −3(2, −3).", wrong:{ same:"(−6, 9) = −3(2, −3).", not:"(−6, 9) = −3(2, −3)." },
            hints:["Divide matching components.", "−6/2 = −3 and 9/(−3) = −3.", "`k = -3`: opposite way."] },
          { id:"i4", t:"(2, −3) and (3, −2)", answer:"not", why:"Swapping isn’t scaling.", wrong:{ same:"Swapping isn’t scaling. " + M2, opp:"Swapping isn’t scaling. " + M2 } },
          { id:"i5", t:"(4, 6) and (6, 9)", answer:"same", why:"(6, 9) = 1.5(4, 6).", wrong:{ opp:"(6, 9) = 1.5(4, 6).", not:"(6, 9) = 1.5(4, 6)." },
            hints:["Is there one `k` that works for both components?", "6/4 and 9/6.", "Both 1.5: same way."] },
          { id:"i6", t:"(1, 2) and (2, 2)", answer:"not", why:"The run doubled but the rise didn’t.", wrong:{ same:"The run doubled but the rise didn’t. " + M4, opp:"The run doubled but the rise didn’t. " + M4 } },
          { id:"i7", t:"`vec{u} - vec{v}` and `vec{v} - vec{u}`", answer:"opp", why:"`vec{v} - vec{u} = -1(vec{u} - vec{v})`.", wrong:{ same:"`vec{v} - vec{u} = -1(vec{u} - vec{v})`.", not:"`vec{v} - vec{u} = -1(vec{u} - vec{v})`." } },
          { id:"i8", t:"(5, 0) and (0, 5)", answer:"not", why:"Same length, but perpendicular.", wrong:{ same:"Same length, but perpendicular. " + M4, opp:"Same length, but perpendicular. " + M4 } }
        ] },
      { id:"express", type:"custom", title:"Express it", summary:"Express it", star:true, goal:[2, 5, 6],
        instruction:"In triangle OAB, `vec{OA} = vec{a}` and `vec{OB} = vec{b}`. M is the midpoint of AB, N is the midpoint of OA, P lies on OB with OP:PB = 1:2, and G is the centroid (where the medians meet). Fill in the coefficients. Items 4 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type whole numbers or fractions such as 1/3 or −1 in both boxes (0 if a vector isn’t needed), then press Check.",
        fig:"Triangle OAB with a in blue from O to A and b in teal from O to B; M the midpoint of AB, N the midpoint of OA, P one third of the way from O to B, G the centroid and Q three quarters of the way from A to B.",
        msgs:{ fill:"Fill in both boxes (type 0 if a vector isn’t needed).", err:"Type whole numbers or fractions only, such as 2, −1 or 1/3.", general:"Not yet. Go along the figure from start to end, then collect the `vec{a}` and `vec{b}` terms." },
        items:[
          { id:"x1", goal:5, v:"`vec{AB}`", answer:{ a:-1, b:1 }, display:"`vec{AB} = -1vec{a} + 1vec{b}`",
            wrong:[{ a:1, b:-1, fb:"End minus start: `vec{OB} - vec{OA}`. Your answer is `vec{BA}`, the reverse." }],
            why:"End minus start: `vec{OB} - vec{OA} = vec{b} - vec{a}`." },
          { id:"x2", goal:5, v:"`vec{OM}`", answer:{ a:0.5, b:0.5 }, display:"`vec{OM} = ½vec{a} + ½vec{b}`",
            wrong:[{ a:1, b:0.5, fb:"`vec{OA} + ½vec{AB} = vec{a} + ½(vec{b} - vec{a})`." }],
            why:"`vec{OA} + ½vec{AB} = vec{a} + ½(vec{b} - vec{a}) = ½vec{a} + ½vec{b}`." },
          { id:"x3", goal:[5, 6], v:"`vec{NM}`", answer:{ a:0, b:0.5 }, display:"`vec{NM} = 0vec{a} + ½vec{b}`",
            wrong:[{ a:0.5, b:0.5, fb:"Subtract `vec{ON} = ½vec{a}`. The midsegment is half of `vec{OB}`." }],
            why:"`vec{OM} - vec{ON} = ½vec{a} + ½vec{b} - ½vec{a} = ½vec{b}`: the midsegment is half of `vec{OB}`." },
          { id:"x4", goal:5, star:true, v:"`vec{AP}`", answer:{ a:-1, b:1 / 3 }, display:"`vec{AP} = -1vec{a} + ⅓vec{b}`",
            wrong:[{ a:-1, b:0.5, fb:"OP:PB = 1:2, so `vec{OP} = ⅓vec{b}`." }],
            why:"`vec{AP} = vec{OP} - vec{OA} = ⅓vec{b} - vec{a}`." },
          { id:"x5", goal:[5, 6], star:true, v:"`vec{OG}`", answer:{ a:1 / 3, b:1 / 3 }, display:"`vec{OG} = ⅓vec{a} + ⅓vec{b}`",
            wrong:[{ a:0.5, b:0.5, fb:"That’s M. G is ⅔ of the way from O to M." }],
            why:"`vec{OG} = ⅔vec{OM} = ⅔(½vec{a} + ½vec{b})`.",
            hints:["G lies on the median from O to M.", "`vec{OG} = ⅔vec{OM}`.", "`⅔(½vec{a} + ½vec{b}) = ⅓vec{a} + ⅓vec{b}`."] },
          { id:"x6", goal:5, star:true, v:"`vec{OQ}`, where Q lies on AB with AQ:QB = 3:1", answer:{ a:0.25, b:0.75 }, display:"`vec{OQ} = ¼vec{a} + ¾vec{b}`",
            wrong:[{ a:0.75, b:0.25, fb:"Closer to B, so more `vec{b}`: `vec{a} + ¾(vec{b} - vec{a})`." }],
            why:"`vec{OQ} = vec{a} + ¾(vec{b} - vec{a}) = ¼vec{a} + ¾vec{b}`.",
            hints:["`vec{OQ} = vec{OA} + vec{AQ}`.", "`vec{AQ} = ¾vec{AB} = ¾(vec{b} - vec{a})`.", "`vec{a} - ¾vec{a} + ¾vec{b} = ¼vec{a} + ¾vec{b}`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Iris", how:"", goal:[4, 5, 6],
        instruction:"Iris made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"`vec{u}` = run 6, rise −8. Find a vector of length 15 pointing opposite to `vec{u}`.",
            steps:["`|vec{u}| = √(36 + 64) = 10`.", "Unit vector: `vec{u}/10` = run 3/5, rise −4/5.", "Length 15: 15 × (3/5, −4/5) = run 9, rise −12.", "So the answer is run 9, rise −12."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 copies step 3."],
            fixes:[
              { t:"Opposite: −15 × (3/5, −4/5) = run −9, rise 12.", ok:true, why:"Opposite to `vec{u}` needs a negative scalar: −15 times the unit vector." },
              { t:"`15 × vec{u}` = run 90, rise −120.", why:M3 },
              { t:"`-15 × vec{u}` = run −90, rise 120.", why:M3 },
              { t:"Step 3 is correct.", why:"Run 9, rise −12 points the same way as `vec{u}`." }],
            hints:["Which way should the answer point?", "Opposite to `vec{u}`: use a negative scalar.", "−15 × the unit vector."] },
          { id:"e2", goal:5, task:"`vec{OA} = vec{a}`, `vec{OB} = vec{b}`. P lies on AB with AP:PB = 2:3. Find `vec{OP}`.",
            steps:["`vec{AB} = vec{b} - vec{a}`.", "`vec{AP} = ⅔vec{AB}`.", "`vec{OP} = vec{a} + ⅔(vec{b} - vec{a})`.", "`= ⅓vec{a} + ⅔vec{b}`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 uses step 2 correctly.", "The algebra in step 4 is right."],
            fixes:[
              { t:"`vec{AP} = ⅖vec{AB}`, so `vec{OP} = ⅗vec{a} + ⅖vec{b}`.", ok:true, why:M5 },
              { t:"`vec{AP} = ⅗vec{AB}`.", why:"That’s AP:PB = 3:2." },
              { t:"`vec{AP} = 2vec{AB}`.", why:"AP is part of AB." },
              { t:"Step 2 is correct.", why:"2:3 means 5 equal parts in all. " + M5 }],
            hints:["How many equal parts does AB have?", "2 + 3 = 5.", "⅖`vec{AB}`."] },
          { id:"e3", goal:6, task:"M and N are the midpoints of AB and AC. Show that `vec{MN}` is parallel to `vec{BC}` and half as long.",
            steps:["`vec{AM} = ½vec{AB}` and `vec{AN} = ½vec{AC}`.", "`vec{MN} = vec{AM} - vec{AN}`.", "`= ½vec{AB} - ½vec{AC} = ½vec{CB}`.", "So `vec{MN}` is half of `vec{CB}`, so parallel to `vec{BC}`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2.", "The conclusion follows, but the vector equation behind it is reversed."],
            fixes:[
              { t:"`vec{MN} = vec{AN} - vec{AM} = ½(vec{AC} - vec{AB}) = ½vec{BC}`.", ok:true, why:M6 },
              { t:"`vec{MN} = vec{AM} + vec{AN}`.", why:"That’s twice the median to the midpoint of BC." },
              { t:"`vec{MN} = vec{BC}`.", why:"It’s half." },
              { t:"Step 2 is correct.", why:"`vec{AM} - vec{AN} = vec{NM}`, from N to M." }],
            hints:["From M to N: end minus start, measured from A.", "`vec{AN} - vec{AM}`.", "½`vec{BC}`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the stretch dial: watching `k vec{u}` shrink to `vec{0}` and come out the other side?" },
      { id:"j2", q:"In your own words, why does dividing a vector by its magnitude give a unit vector?" },
      { id:"j3", q:"Explain to a friend how to test whether two vectors are collinear." },
      { id:"j4", q:"Which still slows you down: ratios, directions in a figure, or unit vectors? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"`|vec{u}| = 4`. Which describes `-3vec{u}`?", options:[
          { t:"Magnitude 12, opposite to `vec{u}`", ok:true, why:"`|-3| × 4 = 12`; the minus sign reverses the direction." },
          { t:"Magnitude −12, same direction as `vec{u}`", why:M1 },
          { t:"Magnitude 12, same direction as `vec{u}`", why:"Negative `k` reverses." },
          { t:"Magnitude 7, opposite to `vec{u}`", why:"Multiply, don’t add." }] },
        b:{ prompt:"`|vec{v}| = 6`. Which describes `-½vec{v}`?", options:[
          { t:"Magnitude 3, opposite to `vec{v}`", ok:true, why:"`|-½| × 6 = 3`; the minus sign reverses the direction." },
          { t:"Magnitude −3, same direction as `vec{v}`", why:M1 },
          { t:"Magnitude 3, same direction as `vec{v}`", why:"Negative `k` reverses." },
          { t:"Magnitude 12, opposite to `vec{v}`", why:"½ halves the length." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"Which is the unit vector in the direction of `vec{u}` = run 5, rise −12?", options:[
          { t:"run 5/13, rise −12/13", ok:true, why:"`|vec{u}| = √(25 + 144) = 13`; divide each component by 13." },
          { t:"run 5/17, rise −12/17", why:"Divide by the magnitude 13, not by 5 + 12." },
          { t:"run 1, rise −1", why:"Length `√2`, and a different direction." },
          { t:"run −5/13, rise 12/13", why:"That’s the opposite direction." }] },
        b:{ prompt:"Which is the unit vector in the direction of `vec{u}` = run −8, rise 6?", options:[
          { t:"run −4/5, rise 3/5", ok:true, why:"`|vec{u}| = √(64 + 36) = 10`: run −8/10, rise 6/10." },
          { t:"run −8/14, rise 6/14", why:M3 + " The magnitude is 10, not 8 + 6." },
          { t:"run −1, rise 1", why:"Length `√2`, and a different direction." },
          { t:"run 4/5, rise −3/5", why:"That’s the opposite direction." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which vector is collinear with `vec{u}` = run 2, rise −3?", options:[
          { t:"run −6, rise 9", ok:true, why:"`-3vec{u}`." },
          { t:"run 3, rise −2", why:"Swapped, not scaled." },
          { t:"run 4, rise −3", why:"Only the run doubled." },
          { t:"run 2, rise 3", why:"One sign changed: not a multiple." }] },
        b:{ prompt:"Which vector is collinear with `vec{u}` = run −4, rise 1?", options:[
          { t:"run 8, rise −2", ok:true, why:"`-2vec{u}`." },
          { t:"run 1, rise −4", why:"Swapped, not scaled. " + M4 },
          { t:"run −8, rise 1", why:"Only the run doubled. " + M4 },
          { t:"run 4, rise 1", why:"One sign changed: not a multiple." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Which vector has length 15 and points opposite to `vec{u}` = run 3, rise 4?", options:[
          { t:"run −9, rise −12", ok:true, why:"−15 × (3/5, 4/5)." },
          { t:"run 9, rise 12", why:"Same direction." },
          { t:"run −45, rise −60", why:"Length 75. " + M3 },
          { t:"run −3, rise −4", why:"Length 5." }] },
        b:{ prompt:"Which vector has length 26 and points the same way as `vec{u}` = run 5, rise −12?", options:[
          { t:"run 10, rise −24", ok:true, why:"26 × (5/13, −12/13)." },
          { t:"run −10, rise 24", why:"Opposite direction." },
          { t:"run 130, rise −312", why:M3 },
          { t:"run 5, rise −12", why:"Length 13." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"In triangle OAB, `vec{OA} = vec{a}` and `vec{OB} = vec{b}`. P lies on AB with AP:PB = 1:3. Which is `vec{OP}`?", options:[
          { t:"¾`vec{a}` + ¼`vec{b}`", ok:true, why:"`vec{a} + ¼(vec{b} - vec{a})`." },
          { t:"¼`vec{a}` + ¾`vec{b}`", why:"That puts P near B." },
          { t:"⅔`vec{a}` + ⅓`vec{b}`", why:"1:3 means quarters, not thirds." },
          { t:"½`vec{a}` + ½`vec{b}`", why:"That’s the midpoint." }] },
        b:{ prompt:"Same triangle; P lies on AB with AP:PB = 2:1. Which is `vec{OP}`?", options:[
          { t:"⅓`vec{a}` + ⅔`vec{b}`", ok:true, why:"`vec{a} + ⅔(vec{b} - vec{a})`." },
          { t:"⅔`vec{a}` + ⅓`vec{b}`", why:"AP:PB = 2:1 puts P closer to B, so more `vec{b}`." },
          { t:"`-vec{a} + 2vec{b}`", why:"`vec{AP}` is part of `vec{AB}`, not twice it." },
          { t:"½`vec{a}` + ½`vec{b}`", why:"That’s the midpoint." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"A(1, 2), B(4, 3) and C(10, 5). Which statement is true?", options:[
          { t:"They’re collinear: `vec{AC} = 3vec{AB}`, so B is ⅓ of the way from A to C", ok:true, why:"`vec{AB}` = (3, 1) and `vec{AC}` = (9, 3) = 3(3, 1)." },
          { t:"They aren’t collinear: `|vec{AB}| ≠ |vec{AC}|`", why:M4 },
          { t:"They’re collinear because every coordinate is positive", why:"Position isn’t the test." },
          { t:"They aren’t collinear: `vec{AB} ≠ vec{BC}`", why:"`vec{BC} = 2vec{AB}`: still a multiple." }] },
        b:{ prompt:"A(−2, 1), B(0, 2) and C(6, 5). Which statement is true?", options:[
          { t:"They’re collinear: `vec{AC} = 4vec{AB}`, so B is ¼ of the way from A to C", ok:true, why:"`vec{AB}` = (2, 1) and `vec{AC}` = (8, 4) = 4(2, 1)." },
          { t:"They aren’t collinear: `|vec{AB}| ≠ |vec{AC}|`", why:M4 },
          { t:"They’re collinear because B is between A and C on the `x`-axis", why:"That alone doesn’t decide it." },
          { t:"They aren’t collinear: `vec{AB} ≠ vec{BC}`", why:"`vec{BC} = 3vec{AB}`: still a multiple." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why `|-2vec{u}| = 2|vec{u}|`, not `-2|vec{u}|`?", options:[
          { t:"“Multiplying by −2 doubles the length and reverses the direction. A length can’t be negative; the minus sign shows up as the reversal.”", ok:true, why:"The length is multiplied by `|-2| = 2`; the sign only flips the direction." },
          { t:"“`|-2vec{u}|` is negative because −2 is negative.”", why:M1 },
          { t:"“Scalars don’t change magnitude.”", why:"They multiply it by `|k|`." },
          { t:"“Because `-2vec{u} = 2vec{u}`.”", why:"They point opposite ways." }] },
        b:{ prompt:"Which is the best explanation of why `vec{u}` and `-4vec{u}` are collinear?", options:[
          { t:"“`-4vec{u}` is a scalar multiple of `vec{u}`: it lies on `vec{u}`’s line, 4 times as long, pointing the opposite way.”", ok:true, why:"A scalar multiple always lies on the same line." },
          { t:"“They aren’t, because they point in opposite directions.”", why:M4 },
          { t:"“Because they have the same magnitude.”", why:"`-4vec{u}` is 4 times as long." },
          { t:"“Because −4 is a whole number.”", why:"Any real `k` works." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"M and N are the midpoints of AB and AC. Which is the clearest vector proof that `vec{MN}` is parallel to `vec{BC}` and half as long?", options:[
          { t:"“`vec{MN} = vec{AN} - vec{AM} = ½vec{AC} - ½vec{AB} = ½(vec{AC} - vec{AB}) = ½vec{BC}`: a scalar multiple of `vec{BC}` with factor ½.”", ok:true, why:"End minus start, then factor out ½: a scalar multiple of `vec{BC}`." },
          { t:"“`vec{MN} = vec{AM} - vec{AN} = ½vec{AB} - ½vec{AC}`, so it’s parallel.”", why:"That vector is `vec{NM}`. " + M6 },
          { t:"“Measure MN and BC on the diagram: MN is half.”", why:"Measuring one drawing isn’t a proof." },
          { t:"“`vec{MN} = ½vec{AB} + ½vec{AC}`.”", why:"That vector goes from A to the midpoint of BC." }] },
        b:{ prompt:"`vec{AC} = 3vec{AB}`. Which is the clearest argument that A, B and C are collinear?", options:[
          { t:"“`vec{AC}` is a scalar multiple of `vec{AB}`, so they’re parallel. They share the point A, so they lie on one line.”", ok:true, why:"Parallel, plus a shared point, means one line." },
          { t:"“Because 3 is positive.”", why:"Any non-zero `k` would do." },
          { t:"“Because `|vec{AC}| = 3|vec{AB}|`.”", why:"Lengths alone don’t fix direction. " + M4 },
          { t:"“Because `vec{AB} + vec{BC} = vec{AC}`.”", why:"That’s true for any three points." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A drone at the origin must fly 20 m straight toward the point (12, 9) (units in metres). Where does it stop?", options:[
          { t:"(16, 12)", ok:true, why:"Unit vector (12, 9)/15 = (4/5, 3/5); × 20." },
          { t:"(12, 9)", why:"That point is only 15 m away." },
          { t:"(240, 180)", why:"20 × (12, 9) is 300 m long. " + M3 },
          { t:"(20, 20)", why:"That’s not toward (12, 9)." }] },
        b:{ prompt:"A drone at the origin must fly 39 m straight toward the point (−10, 24). Where does it stop?", options:[
          { t:"(−15, 36)", ok:true, why:"Unit vector (−10, 24)/26; × 39." },
          { t:"(−10, 24)", why:"That point is 26 m away." },
          { t:"(−390, 936)", why:M3 },
          { t:"(39, 39)", why:"That’s not toward (−10, 24)." }] } },
      { id:"a2", cat:"A", goal:2,
        a:{ prompt:"In a game, a character moves by `vec{v}` = (4, −2) every second for 3 s, then by `-½vec{v}` every second for 2 s. It starts at (1, 1). Where does it end up?", options:[
          { t:"(8, −4)", why:"That’s the displacement; add the start." },
          { t:"(9, −3)", ok:true, why:"`3vec{v} + 2(-½vec{v}) = 2vec{v}` = (8, −4); from (1, 1)." },
          { t:"(11, −4)", why:"`-½vec{v}` applies for <strong>2</strong> seconds." },
          { t:"(17, −7)", why:"The second part moves backward: `-½vec{v}`." }] },
        b:{ prompt:"A character moves by `vec{v}` = (−2, 6) every second for 2 s, then by `-½vec{v}` every second for 4 s. It starts at (3, 0). Where does it end up?", options:[
          { t:"(0, 0)", why:"That’s the displacement; add the start." },
          { t:"(3, 0)", ok:true, why:"`2vec{v} + 4(-½vec{v}) = vec{0}`: back where it began." },
          { t:"(0, 9)", why:"`-½vec{v}` applies for 4 seconds." },
          { t:"(−5, 24)", why:"The second part moves backward." }] } }
    ]
  },
  task:{
    title:"Undo the stretch", summary:"Undo the stretch",
    statement:"<p>Choose a scalar `k` and a vector `vec{u}` so that every condition holds. Can you find all the answers?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>`k vec{u}` = (6, −6).</li><li>`vec{u}` points opposite to (6, −6).</li><li>`vec{u}` is shorter than `k vec{u}`.</li></ol></div>" +
      "<p class=\"tiny muted\">`k` runs from −3 to 3 in steps of 0.5 (not 0); `vec{u}` has whole-number run and rise from −6 to 6. The drawing shows `vec{u}`, `k vec{u}` and the target (6, −6).</p>",
    checks:["`k vec{u}` = (6, −6)", "`vec{u}` points opposite to (6, −6)", "`vec{u}` is shorter than `k vec{u}`"],
    tips:["`vec{u}` = (6, −6)/`k`: its components must be whole numbers.", "Opposite means `k` is negative.", "`|k vec{u}| = |k||vec{u}|`, so you need `|k| > 1`."],
    explainPrompt:"Explain why `k vec{u}` = (6, −6) means `vec{u}` must be collinear with (1, −1), and how you chose `k`.",
    vocab:"Use the words scalar, collinear, magnitude and opposite.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Line 1 forces `vec{u}` onto the line through (1, −1). Line 2 picks the negative `k` values; line 3 removes `k = -1`. `k = -2.5` would need `vec{u}` = (−2.4, 2.4), which isn’t allowed.",
    labels:{ k:"Scalar `@a{k}`", run:"run of `vec{u}`", rise:"rise of `vec{u}`", range:"(−6 to 6)",
      invalid:"Choose whole numbers from −6 to 6 for the run and rise of `vec{u}`.",
      rows:{ u:"`vec{u}`", ku:"`@a{k} vec{u}`", um:"`|vec{u}|`", kum:"`|@a{k} vec{u}|`" },
      graph:"`vec{u}` in blue, `k vec{u}` in thick black, the target (6, −6) as a dashed grey arrow" }
  },
  cards:[
    ["`k vec{u}`", "Magnitude `|k||vec{u}|`; same direction if `k > 0`, opposite if `k < 0`."],
    ["`0vec{u}`", "The zero vector `vec{0}`."],
    ["Collinear vectors", "`vec{v} = k vec{u}` for some scalar `k` (which may be negative)."],
    ["Testing collinearity", "Divide matching components: one common `k` means collinear."],
    ["Unit vector", "`vec{u}/|vec{u}|`: length 1, same direction."],
    ["Length `L` in the direction of `vec{u}`", "`L · vec{u}/|vec{u}|`."],
    ["Midpoint", "`vec{AM} = ½vec{AB}`."],
    ["Ratio AP:PB = `m`:`n`", "`vec{AP} = [m/(m + n)] vec{AB}`."],
    ["Midsegment theorem", "The segment joining two midpoints of a triangle is ½ of the third side, and parallel to it."],
    ["Collinear points", "A, B, C collinear ⟺ `vec{AC} = k vec{AB}`."],
    ["Vector from M to N", "End minus start: `vec{MN} = vec{AN} - vec{AM}`."],
    ["`2(vec{u} - vec{v})`", "`2vec{u} - 2vec{v}`: the scalar multiplies every term."]
  ]
};
