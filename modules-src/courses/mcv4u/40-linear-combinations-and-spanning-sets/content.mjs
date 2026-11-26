// MCV4U 40 Linear Combinations and Spanning Sets. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/40-linear-combinations-and-spanning-sets.md
// misconception core sentences (plan §3), reused where the plan tags an option with M1–M7
const M1 = "Parallel vectors are multiples of each other, so every combination stays on one line.";
const M2 = "Two vectors only reach a plane. A third vector helps only if it’s off that plane.";
const M3 = "`s` and `t` must work in <strong>every</strong> component. Check the third equation before you say yes.";
const M4 = "`s` and `t` are how many of each vector you use. Find them by solving; they’re rarely the target’s numbers.";
const M5 = "`s` can be any real number: negative `s` goes the other way along the same line.";
const M6 = "`s = t = 0` gives `vec{0}`, so every span contains the origin.";
const M7 = "Distribute carefully: `2(3s - 1) = 6s - 2`.";
const A = '<span class="lc-a">`vec{a}`</span>', B = '<span class="lc-b">`vec{b}`</span>';
const R2 = "R²", R3 = "R³";
// What does it span? sorter: the plan gives one "feedback if misplaced" line per item, so every wrong box gets it
const BOXES = ["line", "plane", "r2", "r3"];
function srt(id, t, box, fb, extra){
  const wrong = {}; BOXES.filter(b => b !== box).forEach(b => { wrong[b] = fb; });
  return Object.assign({ id, t, answer:box, why:fb, wrong }, extra || {});
}

export default {
  id:"40-linear-combinations-and-spanning-sets",
  kind:"topic",
  title:"Linear combinations and spanning sets",
  topic:"Linear Combinations and Spanning Sets",
  readyTopic:"linear combinations and spanning sets",
  hero:{
    eq:'<span class="lc-heq"><span class="lc-nw">`s`' + A + " `+ t`" + B + '</span> <span class="lc-sep">·</span> <span class="lc-nw">span{' + A + ", " + B + "}</span> = every such combination</span>",
    eqLabel:"s times vector a plus t times vector b. The span of a and b is every such combination.",
    eqSize:"sm",
    headline:"How far can two arrows take you?",
    text:"Stretch `vec{a}` by any amount `s` and `vec{b}` by any amount `t`, then add: that’s a <strong>linear combination</strong>. Everything you can reach this way is the <strong>span</strong>. Two arrows that aren’t parallel reach every point of the plane. Parallel arrows reach only a line. In space, two arrows reach a plane, and you need a third arrow off that plane to reach everything.",
    fig:{ aria:"The vectors a = (2, 1) and b = (−1, 2) from the origin with a skewed grid of lines parallel to them; 2a + 1b lands on (3, 4). When b turns to line up with a, the grid collapses into one line.", shape:"square" }
  },
  goals:[
    "I can write a vector as a linear combination `s vec{a} + t vec{b}`, by reading a skewed grid or by solving equations.",
    "I can describe the span of one or two vectors in " + R2 + ": a line through the origin, or all of " + R2 + ".",
    "I can decide whether a set of vectors spans " + R2 + " or " + R3 + ", and explain why.",
    "I can decide whether a vector is in the span of two vectors in " + R3 + ", checking all three equations.",
    "I can test whether three vectors in " + R3 + " are coplanar.",
    "I can use linear combinations to solve problems: mixtures, motors and movement."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Linear systems", goal:1, prompt:"Solve `x + y = 5` and `x - y = 1`.",
          options:[
            { t:"`x = 3`, `y = 2`", ok:true, why:"Adding: `2x = 6`." },
            { t:"`x = 2`, `y = 3`", why:"The values are swapped. Check: 2 − 3 ≠ 1." },
            { t:"`x = 6`, `y = -1`", why:"Adding gives `2x = 6`: divide by 2." },
            { t:"`x = 3`, `y = -2`", why:"Sign slip: 3 + (−2) ≠ 5." }],
          hints:["Add the equations.", "`2x = 6`.", "`x = 3`, `y = 2`."] },
        { id:"w2", skill:"Linear systems", goal:1, prompt:"Solve `2s - t = 4` and `s + 3t = 9`.",
          options:[
            { t:"`s = 3`, `t = 2`", ok:true, why:"`t = 2s - 4`, so `7s - 12 = 9`." },
            { t:"`s = 2`, `t = 3`", why:"The values are swapped. Check: 2(2) − 3 ≠ 4." },
            { t:"`s = 3`, `t = -2`", why:"Sign slip moving `t`. Check: 6 + 2 ≠ 4." },
            { t:"`s = 6`, `t = 1`", why:"6 + 3 = 9, but 12 − 1 ≠ 4. Check the solution in both equations." }],
          hints:["Solve the first equation for `t`.", "`t = 2s - 4`; substitute.", "`s = 3`, `t = 2`."] },
        { id:"w3", skill:"Parallel test", goal:2, prompt:"Which vector is parallel to (2, −3)?",
          options:[
            { t:"(−4, 6)", ok:true, why:"`-2(2, -3)`." },
            { t:"(3, −2)", why:"Swapping the components isn’t a scalar multiple." },
            { t:"(2, 3)", why:"Changing one sign isn’t a scalar multiple." },
            { t:"(4, −9)", why:"Squaring a component isn’t scaling: 4 = 2 × 2, but −9 ≠ 2 × (−3)." }],
          hints:["Parallel means a scalar multiple.", "Both components must scale by the same number.", "(−4, 6) = −2(2, −3)."] },
        { id:"w4", skill:"Parallel test", goal:3, prompt:"Are (1, 2, −1) and (−2, −4, 3) parallel?",
          options:[
            { t:"No: the third ratio is −3, not −2", ok:true, why:"−2/1 = −2 and −4/2 = −2, but 3/(−1) = −3." },
            { t:"Yes: (−2, −4) = −2(1, 2)", why:"That checks only two components. The third ratio is 3/(−1) = −3." },
            { t:"Yes: any two vectors with negative parts are opposite", why:"Signs alone don’t decide." },
            { t:"You can’t tell without drawing", why:"Ratios decide it." }],
          hints:["Compare all three ratios.", "−2/1, −4/2, 3/(−1).", "−2, −2, −3: not parallel."] },
        { id:"w5", skill:"Component arithmetic", goal:1, prompt:"`2(3, -1) - 3(1, 2) = ?`",
          options:[
            { t:"(3, −8)", ok:true, why:"(6, −2) − (3, 6)." },
            { t:"(9, 4)", why:"That adds instead of subtracting." },
            { t:"(2, −3)", why:"Scale first: multiply by 2 and by 3." },
            { t:"(3, 4)", why:"−2 − 6 = −8." }],
          hints:["Scale first.", "(6, −2) − (3, 6).", "(3, −8)."] },
        { id:"w6", skill:"Component arithmetic", goal:4, prompt:"Evaluate `s(1, 0, 2) + t(0, 1, -1)` for `s = 3` and `t = -2`.",
          options:[
            { t:"(3, −2, 8)", ok:true, why:"(3, 0, 6) + (0, −2, 2)." },
            { t:"(3, −2, 4)", why:"−2 × (−1) = +2." },
            { t:"(−2, 3, −7)", why:"`s` and `t` are swapped: `s` goes with (1, 0, 2)." },
            { t:"(1, 1, 1)", why:"That adds the vectors without the scalars. " + M4 }],
          hints:["Scale each vector.", "(3, 0, 6) and (0, −2, 2).", "(3, −2, 8)."] }
      ],
      refreshers:{
        "Linear systems":"Eliminate or substitute; then check the solution in <strong>both</strong> equations.",
        "Parallel test":"`vec{v} ∥ vec{u}` exactly when `vec{v} = k vec{u}`: every component ratio is the same `k`.",
        "Component arithmetic":"Scale every component, then add matching components."
      }
    }
  },
  explore:{
    heading:"Span painter",
    intro:"Choose two arrows and stretch them with `s` and `t`. Paint every point you can reach. When does the painting fill everything, and when does it collapse?",
    predIntro:"Make a prediction first. Then the span painter shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"2D, `vec{a} = (2, 1)`, `vec{b} = (-1, 2)`, target (7, −4). Can `s vec{a} + t vec{b}` reach (7, −4)?",
        options:[{ t:"Yes", ok:true }, { t:"No: it’s outside both arrows’ directions" }, { t:"Only if `s` and `t` are positive" }, { t:"Only if (7, −4) is parallel to `vec{a}`" }],
        explain:"Non-parallel arrows span " + R2 + ", so every point is reachable; here `t` is negative (`s = 2`, `t = -3`). " + M5 },
      { id:"p2", prompt:"2D; `vec{b}` is about to be dragged to (4, 2). What will the painted region become?",
        options:[{ t:"A line through the origin", ok:true }, { t:"Still the whole plane" }, { t:"A strip between two lines" }, { t:"A single point" }],
        explain:"(4, 2) = 2(2, 1), so every combination is a multiple of (2, 1). " + M1 },
      { id:"p3", prompt:"3D, `vec{a} = (1, 0, 1)`, `vec{b} = (0, 1, 1)`. What does span{`vec{a}`, `vec{b}`} look like?",
        options:[{ t:"A plane through the origin", ok:true }, { t:"All of " + R3 }, { t:"A line" }, { t:"The plane through the tips of `vec{a}` and `vec{b}` only" }],
        explain:"Two non-parallel arrows give a plane, and `s = t = 0` puts the origin in it." },
      { id:"p4", prompt:"3D; `vec{c} = (1, 1, 2)` is added. Will the span grow?",
        options:[{ t:"No: `vec{c}` lies in the same plane", ok:true }, { t:"Yes: three vectors always span " + R3 }, { t:"Yes, it becomes a cube" }, { t:"No, it shrinks to a line" }],
        explain:"`vec{c} = vec{a} + vec{b}`, so it adds nothing new. " + M2 }
    ],
    chalIntro:"Use the span painter to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"2D, `vec{a} = (2, 1)`, `vec{b} = (-1, 2)`. Set `s` and `t` to reach (−1, 7).",
        why:"`s = 1`, `t = 3`: (2, 1) + (−3, 6) = (−1, 7).",
        hints:["One equation per component.", "`2s - t = -1` and `s + 2t = 7`.", "`s = 1`, `t = 3`."],
        msgs:{ setup:"Choose 2D, and set `vec{a} = (2, 1)` and `vec{b} = (-1, 2)` first.", swap:"That reaches (5, 5). The values are swapped.",
          target:M4, other:"That reaches {r}. You need (−1, 7)." } },
      { id:"tc2", goal:1, prompt:"Same arrows. Reach (−4, 3).",
        why:"`s = -1`, `t = 2`: (−2, −1) + (−2, 4) = (−4, 3).",
        hints:["Negative values are allowed.", "`2s - t = -4` and `s + 2t = 3`.", "`t = 2s + 4`, so `5s + 8 = 3`: `s = -1`, `t = 2`."],
        msgs:{ setup:"Choose 2D, and set `vec{a} = (2, 1)` and `vec{b} = (-1, 2)` first.", pos:"That reaches (0, 5). The `vec{a}` part has to go backwards. " + M5,
          half:"(−2, 4): close, but you still need (−2, −1) = `-1vec{a}`.", other:"That reaches {r}. You need (−4, 3)." } },
      { id:"tc3", goal:[4, 5], stretch:true, prompt:"3D, `vec{a} = (1, 0, 1)`, `vec{b} = (0, 1, 1)`. Set `vec{c} = (1, 2, z)` so that `vec{a}`, `vec{b}` and `vec{c}` do <strong>not</strong> span " + R3 + ".",
        why:"`z = 3`: `vec{c} = (1, 2, 3) = vec{a} + 2vec{b}` lies in the plane of `vec{a}` and `vec{b}`, so the three vectors span only that plane.",
        hints:["They fail to span " + R3 + " exactly when `vec{c}` is in span{`vec{a}`, `vec{b}`}.", "`s(1, 0, 1) + t(0, 1, 1) = (1, 2, z)`: the first two components give `s = 1` and `t = 2`.", "The third component is `s + t = 3`, so `z = 3`."],
        msgs:{ setup:"Choose 3D, and keep `vec{a} = (1, 0, 1)` and `vec{b} = (0, 1, 1)`.", c12:"Set the first two components of `vec{c}` to 1 and 2: `vec{c} = (1, 2, z)`.",
          z0:"(1, 2, 0) is off the plane: the first two components force `s = 1` and `t = 2`, which give `z = 3`.", z2:"Still off the plane, by 1.",
          other:"(1, 2, {z}) is off the plane, so the three vectors still span " + R3 + "." } }
    ]
  },
  part3:{
    slug:"target", name:"Target",
    heading:"Reach the target",
    intro:"In Explore you found combinations by sliding. Here you find them by solving, which is how the idea is used later, and you meet the " + R3 + " check that sliders hide. Work through the three stations, then try the quick check.",
    s1:{ title:"Station 1: solve for `s` and `t` (" + R2 + ")",
      text:"Write the target (1, 8) as `s vec{a} + t vec{b}` with `vec{a} = (3, 2)` and `vec{b} = (-1, 2)`. First build one equation per component.",
      eqHow:"Type the coefficients: whole numbers such as 3 or −1.",
      eqWrong:{ swap:"Each equation uses one component: the `x`-equation takes the first components of `vec{a}`, `vec{b}` and (1, 8); the `y`-equation takes the second ones.",
        sign:"Check the signs: `vec{b} = (-1, 2)`.", other:"Compare each box with the matching component of `vec{a}`, `vec{b}` and (1, 8)." },
      eqDone:"Right: `3s - t = 1` and `2s + 2t = 8`. Now solve by substitution: choose each move.",
      moves:[
        { prompt:"Solve the first equation for `t`.", choices:[
          { t:"`t = 3s - 1`", ok:true },
          { t:"`t = 1 - 3s`", fb:"Move `t` across: `3s - 1 = t`." },
          { t:"`t = 3s + 1`", fb:"`3s - t = 1` gives `t = 3s - 1`." }] },
        { prompt:"Substitute into the second equation.", choices:[
          { t:"`2s + 2(3s - 1) = 8`, so `8s - 2 = 8`", ok:true },
          { t:"`2s + 2(3s - 1) = 8`, so `8s - 1 = 8`", fb:M7 },
          { t:"`2s + 3s - 1 = 8`, so `5s - 1 = 8`", fb:"Multiply all of `(3s - 1)` by 2." }] },
        { prompt:"Solve for `s`.", choices:[
          { t:"`8s = 10`, so `s = 5/4`", ok:true },
          { t:"`8s = 6`, so `s = 3/4`", fb:"Add 2 to both sides: `8s = 10`." },
          { t:"`8s = 10`, so `s = 4/5`", fb:"Divide 10 by 8: `s = 10/8`." }] },
        { prompt:"Find `t`.", choices:[
          { t:"`t = 3(5/4) - 1 = 11/4`", ok:true },
          { t:"`t = 3(5/4) + 1 = 19/4`", fb:"`t = 3s - 1`, not `3s + 1`." },
          { t:"`t = 5/4 - 1 = 1/4`", fb:"Multiply `s` by 3 first: `t = 3s - 1`." }] }
      ],
      done:"`s = 5/4` and `t = 11/4`: `{5}/{4}(3, 2) + {11}/{4}(-1, 2) = (1, 8)`. The result lands on (1, 8) even though `s` and `t` aren’t whole.",
      note:"Whole numbers aren’t required." },
    s2:{ title:"Station 2: in the span or not? (" + R3 + ")",
      text:"Here `vec{a} = (1, 2, -1)` and `vec{b} = (2, -1, 3)`. Choose a target. The first two components give `s` and `t`; the third decides.",
      targets:[
        { id:"in", p:[4, 3, 1], st:[2, 1], first:"`x`: `s + 2t = 4` and `y`: `2s - t = 3` give `s = 2`, `t = 1`.",
          yes:"Right. The third check: `-2 + 3 = 1` ✓, so (4, 3, 1) = `2vec{a} + vec{b}` is in the span. The point lights up <strong>on</strong> the plane.",
          no:"`s = 2`, `t = 1` give `z`: `-2 + 3 = 1`, which matches. All three equations hold." },
        { id:"out", p:[1, 7, 0], st:[3, -1], first:"`x`: `s + 2t = 1` and `y`: `2s - t = 7` give `s = 3`, `t = -1`.",
          yes:"The third: `-3 - 3 = -6 ≠ 0`. " + M3,
          no:"Right. The third: `-3 - 3 = -6 ≠ 0`, so (1, 7, 0) is <strong>not</strong> in the span. Rotate the view: the point hovers off the plane; `3vec{a} - vec{b}` lands at (1, 7, −6) instead." }
      ],
      ask:"Check the third component. Is the target in span{`vec{a}`, `vec{b}`}?", yesT:"Yes: it’s in the span", noT:"No: it isn’t in the span" },
    s3:{ title:"Station 3: coplanar?",
      text:"Three vectors: `vec{a} = (1, 2, k)`, (2, −1, 1) and (0, 5, 1). The plane shows the span of the last two. Tilt `vec{a}` with the `k` slider until its tip lands on the plane.",
      on:"At `k = 1` the tip of `vec{a}` lands on the plane: the three vectors are coplanar.",
      off:"The tip of `vec{a}` is off the plane: the three vectors aren’t coplanar, so they span " + R3 + ".",
      alg:["`(0, 5, 1) = s(1, 2, k) + t(2, -1, 1)`", "`x`: `s + 2t = 0`; `y`: `2s - t = 5`. So `s = 2`, `t = -1`.", "`z`: `sk + t = 1` gives `2k - 1 = 1`, so `k = 1`."] },
    quickCheck:{
      title:"Quick check", summary:"Reach the target quick check",
      items:[
        { id:"q1", goal:2, prompt:"span{(3, −6)} in " + R2 + " is…",
          choices:[
            { t:"the line `y = -2x`", ok:true, fb:"Right. Every multiple `s(3, -6)` lies on `y = -2x`, and `s` can be negative." },
            { t:"the arrow from (0, 0) to (3, −6)", fb:"`s` can be any real number, including negatives: the whole line." },
            { t:"all of " + R2, fb:"`s` can be any real number, including negatives: the whole line, and only that line." },
            { t:"the half of `y = -2x` with `x ≥ 0`", fb:"`s` can be any real number, including negatives: the whole line." }] },
        { id:"q2", goal:3, prompt:"Do (2, 4) and (−3, −6) span " + R2 + "?",
          choices:[
            { t:"No: they’re parallel", ok:true, fb:"Right. (−3, −6) = −1.5(2, 4)." },
            { t:"Yes: any two vectors do", fb:"(−3, −6) = −1.5(2, 4). " + M1 },
            { t:"Yes: they point opposite ways", fb:"(−3, −6) = −1.5(2, 4). Opposite still counts as parallel." },
            { t:"No: their lengths differ", fb:"(−3, −6) = −1.5(2, 4). It’s the direction that matters, not the length." }] },
        { id:"q3", goal:4, prompt:"Is (5, −1, 3) in span{(1, 1, 0), (2, −1, 2)}?",
          choices:[
            { t:"No", ok:true, fb:"Right. `s = 1`, `t = 2` fit the first two, but give `z = 4`, not 3." },
            { t:"Yes: `s = 1`, `t = 2`", fb:"`s = 1`, `t = 2` fit the first two, but give `z = 4`, not 3." },
            { t:"Yes: every vector in " + R3 + " is", fb:"`s = 1`, `t = 2` fit the first two, but give `z = 4`, not 3." },
            { t:"You can’t tell without a graph", fb:"`s = 1`, `t = 2` fit the first two, but give `z = 4`, not 3." }] },
        { id:"q4", goal:3, prompt:"`vec{a}` and `vec{b}` aren’t parallel. span{`vec{a}`, `vec{b}`, `2vec{a} - vec{b}`} in " + R3 + " is…",
          choices:[
            { t:"a plane through the origin", ok:true, fb:"Right. `2vec{a} - vec{b}` is already in the plane." },
            { t:"all of " + R3, fb:"`2vec{a} - vec{b}` is already in the plane." },
            { t:"a line", fb:"`2vec{a} - vec{b}` is already in the plane, and two non-parallel vectors span a plane." },
            { t:"a single point", fb:"`2vec{a} - vec{b}` is already in the plane, and two non-parallel vectors span a plane." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"span", type:"sorter", title:"What does it span?", summary:"What does it span?", goal:[2, 3, 5], noun:"set", txt:false,
        instruction:"Sort each set of vectors by what it spans.",
        how:"Tap a set, then tap the box it belongs in.",
        boxes:[{ id:"line", label:"A line" }, { id:"plane", label:"A plane through the origin" }, { id:"r2", label:"All of " + R2 }, { id:"r3", label:"All of " + R3 }],
        items:[
          srt("i1", "{(1, −2)}", "line", "One non-zero vector spans a line.", { goal:2 }),
          srt("i2", "{(1, 2), (2, 1)}", "r2", "Not parallel: they reach every point.", { goal:2 }),
          srt("i3", "{(2, −4), (−1, 2)}", "line", "(2, −4) = −2(−1, 2): parallel. " + M1, { goal:2 }),
          srt("i4", "{(1, 0, 0), (0, 1, 0)}", "plane", "Every combination has `z = 0`: the `xy`-plane. " + M2, { goal:3 }),
          srt("i5", "{(1, 0, 0), (0, 1, 0), (0, 0, 1)}", "r3", "`vec{i}`, `vec{j}`, `vec{k}` reach everything.", { goal:3 }),
          srt("i6", "{(1, 2, 3), (2, 4, 6)}", "line", "Parallel.", { goal:3 }),
          srt("i7", "{(1, 1, 0), (0, 1, 1), (1, 2, 1)}", "plane", "(1, 2, 1) is the sum of the first two. " + M2, { goal:5 }),
          srt("i8", "{(1, 1, 0), (0, 1, 1), (1, 0, 1)}", "r3", "None of them is a combination of the other two.", { goal:5,
            hints:["Try to write (1, 0, 1) = `s(1, 1, 0) + t(0, 1, 1)`.", "`x`: `s = 1`; `z`: `t = 1`; `y`: `s + t = 2 ≠ 0`.", "Not coplanar: all of " + R3 + "."] }),
          srt("i9", "{(3, 1), (0, 0)}", "line", "The zero vector adds nothing.", { goal:2 }),
          srt("i10", "{(1, 2), (3, 4), (5, 6)}", "r2", "Two of them already span " + R2 + "; extra vectors don’t hurt.", { goal:3 }),
          srt("i11", "{(2, 0, 1), (−4, 0, −2), (0, 3, 0)}", "plane", "The first two are parallel, so only two directions.", { goal:3 }),
          srt("i12", "{(1, −1, 2), (2, 1, 1), (0, 3, −3)}", "plane", "(0, 3, −3) = −2(1, −1, 2) + 1(2, 1, 1). " + M3, { goal:5,
            hints:["Test the third against the first two.", "`s + 2t = 0` and `-s + t = 3` give `t = 1`, `s = -2`.", "`z`: 2(−2) + 1 = −3 ✓. Coplanar: a plane."] })
        ] },
      { id:"combo", type:"custom", title:"Find the combination", summary:"Find the combination", star:true, goal:[1, 4, 5, 6],
        instruction:"Fill in `s` and `t` (or `k`). Items 3 to 6 are non-routine.",
        how:"Type whole numbers or fractions, such as 3/2 or −4.",
        items:[
          { id:"s1", goal:1, prompt:"`(7, 5) = s(1, 1) + t(2, 1)`", boxes:[{ k:"s", label:"`s`" }, { k:"t", label:"`t`" }],
            answer:{ s:"3", t:"2" }, display:"`s = 3`, `t = 2`",
            wrong:[{ s:"2", t:"3", fb:"Check: (2, 2) + (6, 3) = (8, 5)." }],
            why:"`s + 2t = 7` and `s + t = 5` give `t = 2`, `s = 3`." },
          { id:"s2", goal:1, prompt:"`(-1, -10) = s(3, -2) + t(1, 2)`", boxes:[{ k:"s", label:"`s`" }, { k:"t", label:"`t`" }],
            answer:{ s:"1", t:"−4" }, display:"`s = 1`, `t = -4`",
            wrong:[{ s:"1", t:"4", fb:"3(1) + 4 = 7, not −1." }],
            why:"`3s + t = -1` and `-2s + 2t = -10` give `s = 1`, `t = -4`." },
          { id:"s3", goal:4, star:true, prompt:"`(4, -1, 9) = s(1, 1, 1) + t(1, -1, 3)`", boxes:[{ k:"s", label:"`s`" }, { k:"t", label:"`t`" }],
            answer:{ s:"3/2", t:"5/2" }, display:"`s = 3/2`, `t = 5/2`",
            fb:"Solve `s + t = 4` and `s - t = -1`, then check `z`: 3/2 + 15/2 = 9 ✓.",
            why:"`s + t = 4` and `s - t = -1` give `s = 3/2`, `t = 5/2`; `z`: 3/2 + 15/2 = 9 ✓." },
          { id:"s4", goal:4, star:true, prompt:"Find `k` so that `(2, k, 5)` is in span{(1, 0, 1), (0, 1, 2)}.", boxes:[{ k:"k", label:"`k`" }],
            answer:{ k:"3/2" }, display:"`k = 3/2`",
            wrong:[{ k:"3", fb:"`s = 2` and `t = k`; the `z`-component is `2 + 2k = 5`." }],
            why:"`s = 2` and `t = k`; the `z`-component gives `2 + 2k = 5`, so `k = 3/2`." },
          { id:"s5", goal:5, star:true, prompt:"Find `k` so that `(1, 2, k)`, (2, −1, 1) and (0, 5, 1) are coplanar.", boxes:[{ k:"k", label:"`k`" }],
            answer:{ k:"1" }, display:"`k = 1`",
            fb:"`(0, 5, 1) = s(1, 2, k) + t(2, -1, 1)`: `s = 2`, `t = -1`, then `2k - 1 = 1`.",
            why:"`(0, 5, 1) = 2(1, 2, k) - (2, -1, 1)` needs `2k - 1 = 1`.",
            hints:["Coplanar means one vector is a combination of the other two.",
              "Use the first two components of `(0, 5, 1) = s(1, 2, k) + t(2, -1, 1)`: `s + 2t = 0` and `2s - t = 5`.",
              "`s = 2`, `t = -1`; the third component gives `2k - 1 = 1`, so `k = 1`."] },
          { id:"s6", goal:6, star:true, prompt:"Fertilizer A has (N, P, K) = (2, 1, 1) units per scoop; B has (1, 1, 3). How many scoops of each give exactly (7, 4, 6)?",
            boxes:[{ k:"s", label:"Scoops of A" }, { k:"t", label:"Scoops of B" }],
            answer:{ s:"3", t:"1" }, display:"3 scoops of A and 1 scoop of B",
            fb:"`2s + t = 7` and `s + t = 4` give `s = 3`, `t = 1`; check K: 3 + 3 = 6 ✓.",
            why:"N and P give `s = 3`, `t = 1`; K: 3(1) + 1(3) = 6 ✓.",
            hints:["`s` scoops of A and `t` of B: `s(2, 1, 1) + t(1, 1, 3)`.", "N and P give `s = 3`, `t = 1`.", "K: 3(1) + 1(3) = 6 ✓, so 3 of A and 1 of B."] }
        ],
        msgs:{ boxes:"Set up one equation per component, solve two of them, then check the rest.", err:"Type a whole number or a fraction such as 3/2 or −4 in each box." } },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Nia", how:"", goal:[1, 2, 4],
        instruction:"Nia made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Is (3, 5, 2) in span{(1, 2, 0), (1, 1, 1)}?",
            steps:["`s(1, 2, 0) + t(1, 1, 1) = (3, 5, 2)`", "`x`: `s + t = 3`; `y`: `2s + t = 5`", "Subtracting: `s = 2`, so `t = 1`.", "So (3, 5, 2) = 2(1, 2, 0) + 1(1, 1, 1), and it’s in the span."],
            answer:3,
            stepFb:["Step 1 sets it up correctly.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"Check `z`: 0(2) + 1(1) = 1, not 2. So (3, 5, 2) is not in the span.", ok:true, why:M3 },
              { t:"Use `s = 1`, `t = 2` instead.", why:"That gives (3, 4, 2)." },
              { t:"Two vectors span " + R3 + ", so it’s in the span anyway.", why:"Two vectors only span a plane. " + M2 },
              { t:"Step 4 is correct.", why:"2(1, 2, 0) + (1, 1, 1) = (3, 5, 1). " + M3 }],
            hints:["Did step 4 use all three components?", "Work out the `z`-component of 2(1, 2, 0) + 1(1, 1, 1).", "1 ≠ 2: not in the span."] },
          { id:"e2", goal:2, task:"Do `vec{a} = (2, -1)` and `vec{b} = (-6, 3)` span " + R2 + "?",
            steps:["Two vectors in " + R2 + " span " + R2 + " if they aren’t parallel.", "(−6, 3) = −3(2, −1)", "The scalar is negative, so they point opposite ways and aren’t parallel.", "So they span " + R2 + "."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"Opposite directions still count as parallel: `vec{b} = -3vec{a}`, so the span is only the line `y = -{1}/{2}x`.", ok:true, why:M1 },
              { t:"They span " + R2 + " because their lengths differ.", why:"Length doesn’t matter; direction does." },
              { t:"They span only the ray in `vec{a}`’s direction.", why:"Negative multiples cover the other half of the line. " + M5 },
              { t:"Step 3 is correct.", why:M1 }],
            hints:["What does ‘parallel’ mean for vectors?", "One is a scalar multiple of the other, positive or negative.", "Parallel: a line."] },
          { id:"e3", goal:1, task:"Write (1, 8) as a linear combination of `vec{a} = (3, 2)` and `vec{b} = (-1, 2)`.",
            steps:["`s(3, 2) + t(-1, 2) = (1, 8)`", "`3s - t = 1` and `2s + 2t = 8`", "From the first, `t = 3s - 1`.", "`2s + 2(3s - 1) = 8`, so `8s - 1 = 8`.", "`s = 9/8` and `t = 19/8`."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 follows step 4."],
            fixes:[
              { t:"`2(3s - 1) = 6s - 2`, so `8s = 10`: `s = 5/4` and `t = 11/4`.", ok:true, why:M7 },
              { t:"`8s = 9` is right, but `t = 3(9/8) + 1`.", why:"The sign in step 3 was right; the slip is the distributing." },
              { t:"Guess `s = 1` and `t = 2`.", why:"(3, 2) + (−2, 4) = (1, 6), not (1, 8)." },
              { t:"Step 4 is correct.", why:"2 × (−1) = −2. " + M7 }],
            hints:["Expand `2(3s - 1)` carefully.", "`6s - 2`.", "`s = 5/4`, `t = 11/4`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the span painter: the collapse to a line, or that a third arrow sometimes adds nothing?" },
      { id:"j2", q:"In your own words, what is the span of two vectors in " + R3 + ", and why does it contain the origin?" },
      { id:"j3", q:"Explain to a friend how to decide whether a vector is in the span of two others in " + R3 + "." },
      { id:"j4", q:"What still confuses you about spanning sets? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"Which describes span{(−2, 3)} in " + R2 + "?", options:[
          { t:"The whole line through the origin with direction (−2, 3), that is, `y = -3x/2`", ok:true, why:"Every multiple `s(-2, 3)` is on that line, and `s` can be any real number." },
          { t:"The arrow from (0, 0) to (−2, 3).", why:"`s` can be any real number. " + M5 },
          { t:"All of " + R2 + ".", why:"One vector spans a line." },
          { t:"The half of that line going up and to the left.", why:"Negative `s` covers the other half." }] },
        b:{ prompt:"Which describes span{(4, 1)} in " + R2 + "?", options:[
          { t:"The whole line through the origin with direction (4, 1), that is, `y = x/4`", ok:true, why:"Every multiple `s(4, 1)` is on that line, and `s` can be any real number." },
          { t:"The arrow from (0, 0) to (4, 1).", why:M5 },
          { t:"All of " + R2 + ".", why:"One vector spans a line." },
          { t:"The half of that line with `x ≥ 0`.", why:M5 }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"`(7, -2) = s(2, -1) + t(1, 1)`. Find `s` and `t`.", options:[
          { t:"`s = 3`, `t = 1`", ok:true, why:"`2s + t = 7` and `-s + t = -2`: subtract to get `3s = 9`." },
          { t:"`s = 1`, `t = 3`", why:"Swapped: (2, −1) + (3, 3) = (5, 2)." },
          { t:"`s = 3`, `t = -1`", why:"Check: (6, −3) + (−1, −1) = (5, −4)." },
          { t:"`s = 7`, `t = -2`", why:M4 }] },
        b:{ prompt:"`(-1, 5) = s(2, -1) + t(1, 1)`. Find `s` and `t`.", options:[
          { t:"`s = -2`, `t = 3`", ok:true, why:"`2s + t = -1` and `-s + t = 5`: subtract to get `3s = -6`." },
          { t:"`s = 3`, `t = -2`", why:"Swapped: (6, −3) + (−2, −2) = (4, −5)." },
          { t:"`s = 2`, `t = 3`", why:"Check: (4, −2) + (3, 3) = (7, 1)." },
          { t:"`s = -1`, `t = 5`", why:M4 }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which set spans " + R3 + "?", options:[
          { t:"{(1, 0, 0), (0, 1, 0), (1, 1, 1)}", ok:true, why:"(1, 1, 1) has a `z`-component, so it’s off the `xy`-plane spanned by the first two." },
          { t:"{(1, 0, 0), (0, 1, 0)}", why:"Two vectors span only a plane. " + M2 },
          { t:"{(1, 0, 0), (0, 1, 0), (1, 1, 0)}", why:"All three have `z = 0`: coplanar." },
          { t:"{(1, 2, 3), (2, 4, 6), (0, 0, 1)}", why:"The first two are parallel, so there are only two directions." }] },
        b:{ prompt:"Which set does <strong>not</strong> span " + R2 + "?", options:[
          { t:"{(3, −1), (−6, 2)}", ok:true, why:"(−6, 2) = −2(3, −1): parallel." },
          { t:"{(1, 0), (0, 1)}", why:"`vec{i}` and `vec{j}` span " + R2 + "." },
          { t:"{(1, 2), (2, 1)}", why:"Not parallel: they span " + R2 + "." },
          { t:"{(1, 1), (1, −1), (2, 0)}", why:"Extra vectors don’t stop a set from spanning: (1, 1) and (1, −1) already span " + R2 + "." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"`vec{a} = (1, 2, 3)` and `vec{b} = (-1, 0, -1)`. Is (1, 4, 5) in span{`vec{a}`, `vec{b}`}?", options:[
          { t:"Yes: (1, 4, 5) = `2vec{a} + vec{b}`", ok:true, why:"`y`: `2s = 4` gives `s = 2`; `x`: `s - t = 1` gives `t = 1`; `z`: 6 − 1 = 5, which checks." },
          { t:"No: two vectors can’t reach a vector with three coordinates.", why:"They reach every point on their plane. " + M2 },
          { t:"Yes: (1, 4, 5) = `vec{a} + 2vec{b}`", why:"That’s (−1, 2, 1)." },
          { t:"No: `s = 2`, `t = 1` fit the first two equations but fail the third.", why:"Check again: 3(2) − 1 = 5, so the third equation holds too." }] },
        b:{ prompt:"`vec{a} = (1, 1, 0)` and `vec{b} = (1, -1, 2)`. Is (3, 1, 4) in span{`vec{a}`, `vec{b}`}?", options:[
          { t:"No: `s = 2`, `t = 1` fit the first two components but give `z = 2`, not 4", ok:true, why:"`s + t = 3` and `s - t = 1` give `s = 2`, `t = 1`; then `z = 2t = 2`." },
          { t:"Yes: (3, 1, 4) = `2vec{a} + vec{b}`", why:"`2vec{a} + vec{b} = (3, 1, 2)`. " + M3 },
          { t:"Yes: every vector in " + R3 + " is.", why:M2 },
          { t:"No: two vectors span only a line.", why:"Two non-parallel vectors span a plane." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"For which `k` are (1, 0, 2), (0, 1, −1) and `(3, -2, k)` coplanar?", options:[
          { t:"`k = 8`", ok:true, why:"`(3, -2, k) = 3(1, 0, 2) - 2(0, 1, -1)`, so `k = 6 + 2 = 8`." },
          { t:"`k = 4`", why:"−2 × (−1) = +2, so 6 + 2." },
          { t:"`k = 1`", why:"That’s `s + t`; use the third components." },
          { t:"No value: three vectors are never coplanar.", why:M2 }] },
        b:{ prompt:"For which `k` are (1, 1, 0), (0, 2, 1) and `(2, k, 3)` coplanar?", options:[
          { t:"`k = 8`", ok:true, why:"`x` gives `s = 2`, `z` gives `t = 3`, so `k = 2 + 6`." },
          { t:"`k = 4`", why:"The `y`-component is `s + 2t`." },
          { t:"`k = 5`", why:"That’s `s + t`." },
          { t:"No value.", why:"Three vectors can be coplanar: here `(2, k, 3) = 2(1, 1, 0) + 3(0, 2, 1)` when `k = 8`. " + M2 }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"`vec{a}` and `vec{b}` are non-parallel vectors in " + R3 + ". Which vector, added to {`vec{a}`, `vec{b}`}, is <strong>guaranteed not</strong> to make the set span " + R3 + "?", options:[
          { t:"`2vec{a} - 3vec{b}`", ok:true, why:"It’s a combination of `vec{a}` and `vec{b}`, so it lies in their plane." },
          { t:"Any vector that isn’t parallel to `vec{a}` or `vec{b}`.", why:"It could still lie in their plane, or it could leave it: not guaranteed either way." },
          { t:"A vector longer than both `vec{a}` and `vec{b}`.", why:"Length doesn’t decide it." },
          { t:"Any third vector, since three vectors always span " + R3 + ".", why:M2 }] },
        b:{ prompt:"`vec{a}` and `vec{b}` are non-parallel vectors in " + R2 + ". Which statement about span{`vec{a}`, `vec{b}`, `vec{a} + vec{b}`} is true?", options:[
          { t:"It’s all of " + R2 + "; the vector `vec{a} + vec{b}` isn’t needed", ok:true, why:"`vec{a}` and `vec{b}` already span " + R2 + "; `vec{a} + vec{b}` adds nothing new." },
          { t:"It’s a plane in " + R3 + ".", why:"These are vectors in " + R2 + "." },
          { t:"It’s only a line, because `vec{a} + vec{b}` depends on `vec{a}` and `vec{b}`.", why:"Dependence makes it redundant, not smaller." },
          { t:"It’s bigger than " + R2 + ".", why:"Nothing in " + R2 + " can span more than " + R2 + "." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why (2, 1) and (−4, −2) don’t span " + R2 + "?", options:[
          { t:"“(−4, −2) = −2(2, 1), so every combination `s(2, 1) + t(-4, -2) = (s - 2t)(2, 1)` is a multiple of (2, 1). The span is only the line `y = x/2`.”", ok:true, why:M1 },
          { t:"“They point opposite ways, so they cancel to `vec{0}`.”", why:"They cancel only for particular `s` and `t`." },
          { t:"“Their lengths are different.”", why:"Length doesn’t matter." },
          { t:"“Two vectors never span " + R2 + ".”", why:"Non-parallel pairs do." }] },
        b:{ prompt:"Which is the best explanation of why (1, 0, 0) and (0, 1, 0) don’t span " + R3 + "?", options:[
          { t:"“Every combination `s(1, 0, 0) + t(0, 1, 0) = (s, t, 0)` has `z = 0`, so (0, 0, 1) can’t be reached. The span is only the `xy`-plane.”", ok:true, why:M2 },
          { t:"“They’re perpendicular, and perpendicular vectors never span.”", why:"`vec{i}`, `vec{j}`, `vec{k}` are perpendicular and span " + R3 + "." },
          { t:"“They’re unit vectors, too short to reach far.”", why:"Scalars fix length." },
          { t:"“They do span " + R3 + " if `s` and `t` are large enough.”", why:M2 }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"A student solves `s(1, 2, 1) + t(0, 1, 3) = (2, 5, 4)` using the first two components and gets `s = 2`, `t = 1`. Which statement is correct?", options:[
          { t:"“The third component must be checked: 2(1) + 1(3) = 5 ≠ 4, so (2, 5, 4) is not in the span.”", ok:true, why:M3 },
          { t:"“The student is done: two equations find two unknowns.”", why:M3 },
          { t:"“The student should have used the last two components instead; those decide it.”", why:"All three must hold; no pair decides alone." },
          { t:"“The answer is `s = 2`, `t = 1`, because the first component works.”", why:M3 }] },
        b:{ prompt:"A student solves `s(1, 0, 2) + t(1, 1, 0) = (3, 1, 4)` and gets `s = 2`, `t = 1` from the first two components. Which statement is correct?", options:[
          { t:"“The third component checks: 2(2) + 1(0) = 4, so (3, 1, 4) = 2(1, 0, 2) + (1, 1, 0) is in the span.”", ok:true, why:"All three equations hold, so the vector is in the span." },
          { t:"“Two vectors can’t reach a vector in " + R3 + ".”", why:M2 },
          { t:"“It’s in the span because 3 + 1 = 4.”", why:"A coincidence of the target’s numbers proves nothing." },
          { t:"“Since the first two equations have a solution, no check is needed.”", why:M3 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Paint colour A is (red, blue, white) = (1, 0, 2) parts per tin; colour B is (0, 1, 1). How many tins of each make a batch of exactly (3, 2, 8)?", options:[
          { t:"3 tins of A and 2 tins of B", ok:true, why:"Red gives `s = 3`, blue gives `t = 2`; white: 6 + 2 = 8, which checks." },
          { t:"2 tins of A and 3 tins of B", why:"That’s (2, 3, 7)." },
          { t:"Impossible: two colours can’t make three amounts.", why:"Some batches are possible: check this one with all three components. " + M2 },
          { t:"3 tins of A, 2 tins of B, plus 2 extra parts of white", why:"3(2) + 2(1) = 8 already; no extra is needed." }] },
        b:{ prompt:"Same colours: A is (1, 0, 2) and B is (0, 1, 1) parts of (red, blue, white) per tin. How many tins make exactly (2, 4, 7)?", options:[
          { t:"Impossible: 2 tins of A and 4 of B give 8 parts white, not 7", ok:true, why:"Red forces `s = 2` and blue `t = 4`; white: 4 + 4 = 8 ≠ 7." },
          { t:"2 tins of A and 4 tins of B", why:"That gives 8 parts white, not 7. " + M3 },
          { t:"4 tins of A and 2 tins of B", why:"That’s (4, 2, 10)." },
          { t:"Impossible: two colours can never make three amounts.", why:"Some batches are possible; this one isn’t." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A crane moves its hook with two motors. One turn of motor 1 moves it by `vec{a} = (2, 0, 1)`; one turn of motor 2 by `vec{b} = (0, 1, 2)`. A negative number of turns means running in reverse. Can the hook be moved by (4, −3, −4)?", options:[
          { t:"Yes: 2 turns of motor 1 and 3 reverse turns of motor 2", ok:true, why:"`s = 2`, `t = -3`; `z`: 2 − 6 = −4, which checks." },
          { t:"Yes: 2 turns of motor 1 and 3 turns of motor 2", why:"That’s (4, 3, 8)." },
          { t:"No: reverse turns aren’t allowed in a combination.", why:M5 },
          { t:"No: two motors can’t make a 3D move.", why:M2 }] },
        b:{ prompt:"Motor 1 moves `vec{a} = (1, 2, 0)` per turn; motor 2 moves `vec{b} = (0, -1, 1)`. A negative number of turns means running in reverse. Can the hook be moved by (−2, −7, 3)?", options:[
          { t:"Yes: 2 reverse turns of motor 1 and 3 turns of motor 2", ok:true, why:"`s = -2`; `y`: `-4 - t = -7` gives `t = 3`; `z`: 3, which checks." },
          { t:"Yes: 2 turns of motor 1 and 3 turns of motor 2", why:"That’s (2, 1, 3)." },
          { t:"No: reverse turns aren’t allowed.", why:M5 },
          { t:"No: two motors can’t make a 3D move.", why:M2 }] } }
    ]
  },
  task:{
    title:"Through the target", summary:"Through the target",
    statement:"<p>`vec{a} = (1, 2, 2)` is fixed. Choose a second vector `vec{b}` so that the plane they span passes through the target point (3, 2, 4). Find every answer.</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>`vec{b}` is not parallel to `vec{a}`.</li><li>(3, 2, 4) is in span{`vec{a}`, `vec{b}`}.</li><li>`|vec{b}| = √5`.</li></ol></div>" +
      "<p class=\"tiny muted\">`vec{b}`’s components are whole numbers from −3 to 3. The 3D view shows `vec{a}`, `vec{b}`, their span plane and the target, which glows when it lies on the plane. The <strong>`s`, `t` finder</strong> solves for the combination when the target is in the span.</p>",
    checks:["`vec{b}` is not parallel to `vec{a}`", "The target is in the span", "`|vec{b}| = √5`"],
    tips:["A multiple of (1, 2, 2) gives only a line; the target isn’t on that line.",
      "Any `vec{b}` of the form `(3, 2, 4) - s vec{a}` (or a multiple of it) puts the target in the span. Try `s = 2` or `s = 3`.",
      "Length √5 means the squares add to 5, so the components are 0, 1 and 2 in some order, with signs."],
    explainPrompt:"Explain how you found a `vec{b}` that puts the target in the span, and why each answer’s opposite also works.",
    vocab:"Use the words linear combination, span and plane.",
    after3:"They come in opposite pairs, because `vec{b}` and `-vec{b}` span the same plane. `(3, 2, 4) - 2vec{a} = (1, -2, 0)`, and `(3, 2, 4) - 3vec{a} = (0, -4, -2) = 2(0, -2, -1)`.",
    afterAt:4
  },
  cards:[
    ["Linear combination", "`s vec{a} + t vec{b}` for any real `s`, `t` (negatives and fractions allowed)."],
    ["Span", "The set of all linear combinations."],
    ["span{`vec{a}`}", "The whole line through the origin along `vec{a}` (both directions)."],
    ["Two vectors in " + R2, "Not parallel: span " + R2 + ". Parallel: span a line."],
    ["Two vectors in " + R3, "Not parallel: a plane through the origin. Never all of " + R3 + "."],
    ["Three vectors in " + R3, "Span " + R3 + " unless they’re coplanar."],
    ["Every span contains…", "the origin (take all coefficients 0)."],
    ["Finding `s` and `t`", "One equation per component; solve, then check every equation."],
    ["In " + R3 + ", check the third!", "Two equations find `s`, `t`; the third decides whether the vector is in the span."],
    ["Coplanar test", "`vec{c} = s vec{a} + t vec{b}` has a solution."],
    ["Redundant vector", "A vector already in the span adds nothing."],
    ["`vec{i}`, `vec{j}`, `vec{k}` span " + R3, "`(a, b, c) = a vec{i} + b vec{j} + c vec{k}`."]
  ]
};
