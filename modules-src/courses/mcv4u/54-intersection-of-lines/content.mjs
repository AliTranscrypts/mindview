// MCV4U 54 Intersection of Lines in R² and R³. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/54-intersection-of-lines.md
// misconception core sentences (plan §3)
const M1 = "Each line has its own parameter. Sharing `t` forces both points to the same parameter value, so you can miss a real intersection.";
const M2 = "Two equations in `s` and `t` nearly always have a solution. The lines meet only if the <strong>third</strong> equation agrees.";
const M3 = "In R³, lines can point different ways and still pass over and under each other: skew.";
const M4 = "Parallel directions give parallel <strong>or</strong> coincident lines. Test a point of one line on the other.";
const M5 = "Rotate the view: from above they cross, from the side one passes over the other.";
const M6 = "`s` and `t` are parameters. Substitute one of them into its line to get the point.";
const M7 = "The paths cross, but the two objects reach that point at different times.";
const R = "`vec{r}`";
// a line in the explore tool: point r, direction m (integers)
const L = (r1, m1, r2, m2) => ({ r1, m1, r2, m2 });

export default {
  id:"54-intersection-of-lines",
  kind:"topic",
  title:"Intersection of lines in R² and R³",
  topic:"Intersection of Lines in R² and R³",
  readyTopic:"intersections of lines",
  hero:{
    eq:"<span class=\"il-c1\">`vec{r}_1`</span>` + s `<span class=\"il-c1\">`vec{m}_1`</span>` = `<span class=\"il-c2\">`vec{r}_2`</span>` + t `<span class=\"il-c2\">`vec{m}_2`</span>",
    eqLabel:"r 1 plus s m 1 equals r 2 plus t m 2: line 1 with parameter s set equal to line 2 with parameter t.",
    eqSize:"md",
    headline:"Same point, different parameters",
    text:"Two lines meet where one point satisfies both equations. Give each line its own <strong>parameter</strong> (`s` and `t`), set the lines equal, solve two component equations, then check the third. In R³ the third check matters: lines that aren’t parallel can still miss each other. Those are <strong>skew lines</strong>.",
    fig:{ html:'<div class="il-hero" id="il-hero"></div>' }
  },
  goals:[
    "I can classify two lines in R² as meeting at one point, parallel and distinct, or coincident.",
    "I can find the intersection point of two lines using a different parameter for each.",
    "I can decide whether two lines in R³ intersect, are parallel, coincide or are skew.",
    "I can explain what skew lines are and why they exist only in R³.",
    "I can solve problems with intersecting lines, including telling “paths cross” from “objects collide”."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Directions and points", goal:1, prompt:"Which line is parallel to " + R + "` = (1, 2) + t(3, -1)`?",
          options:[
            { t:R + "` = (0, 5) + s(-6, 2)`", ok:true, why:"`(-6, 2) = -2(3, -1)`." },
            { t:R + "` = (1, 2) + s(1, 3)`", why:"`(1, 3) · (3, -1) = 0`: perpendicular." },
            { t:R + "` = (3, -1) + s(1, 2)`", why:"Its direction is `(1, 2)`, not a multiple of `(3, -1)`." },
            { t:R + "` = (2, 4) + s(3, 1)`", why:"`(3, 1)` isn’t a multiple of `(3, -1)`." }],
          hints:["Parallel lines have parallel directions.", "Look for a multiple of `(3, -1)`.", "`(-6, 2)`."] },
        { id:"w2", skill:"Solving systems", goal:2, prompt:"Solve `2s - t = 4` and `s + t = 5`.",
          options:[
            { t:"`s = 3`, `t = 2`", ok:true, why:"Add: `3s = 9`." },
            { t:"`s = 2`, `t = 3`", why:"`4 - 3 = 1`, not 4." },
            { t:"`s = 3`, `t = -2`", why:"`3 - 2 = 1`, not 5." },
            { t:"`s = 4`, `t = 1`", why:"`8 - 1 = 7`, not 4." }],
          hints:["Add the equations.", "`3s = 9`.", "`s = 3`, `t = 2`."] },
        { id:"w3", skill:"Directions and points", goal:3, prompt:"Is `(5, 0, 1)` on " + R + "` = (1, 2, 3) + t(2, -1, -1)`?",
          options:[
            { t:"Yes: `t = 2`", ok:true, why:"`(1 + 4, 2 - 2, 3 - 2) = (5, 0, 1)`." },
            { t:"Yes: `t = 4`", why:"`1 + 2t = 5` gives `t = 2`." },
            { t:"No: `(5, 0, 1)` isn’t a multiple of `(2, -1, -1)`", why:"Points are `vec{r}_0 + t vec{m}`, not multiples of `vec{m}`." },
            { t:"No: `(5, 0, 1) - (1, 2, 3) = (4, -2, -2)` isn’t equal to `(2, -1, -1)`", why:"`(4, -2, -2) = 2(2, -1, -1)`." }],
          hints:["Find `t` from `x`, then check `y` and `z`.", "`t = 2`.", "`(5, 0, 1)` ✓."] },
        { id:"w4", skill:"Lines in R²", goal:1, prompt:"The lines `2x + 3y = 6` and `4x + 6y = 12` are …",
          options:[
            { t:"coincident (the same line)", ok:true, why:"The second equation is twice the first." },
            { t:"parallel and distinct", why:"The constants also double: `12 = 2 × 6`." },
            { t:"perpendicular", why:"Normals `(2, 3)` and `(4, 6)` are parallel, not perpendicular." },
            { t:"meeting at one point", why:"Parallel normals: no single crossing." }],
          hints:["Compare the coefficients.", "`(4, 6, 12) = 2(2, 3, 6)`.", "Same line."] },
        { id:"w5", skill:"Lines in R²", goal:1, prompt:"The lines `2x + 3y = 6` and `4x + 6y = 5` are …",
          options:[
            { t:"parallel and distinct", ok:true, why:"Same normal direction, but `5 ≠ 12`." },
            { t:"coincident", why:"Doubling the first gives 12, not 5." },
            { t:"meeting at one point", why:"Parallel normals." },
            { t:"perpendicular", why:"`(2, 3) · (4, 6) ≠ 0`." }],
          hints:["Double the first equation.", "`4x + 6y = 12` vs `4x + 6y = 5`.", "No common point: parallel."] },
        { id:"w6", skill:"Directions and points", goal:3, prompt:"For " + R + "` = (2, -1, 4) + t(1, 0, -3)`, what is `z`?",
          options:[
            { t:"`z = 4 - 3t`", ok:true, why:"`z_0 + t m_3`." },
            { t:"`z = -3 + 4t`", why:"4 is the starting value." },
            { t:"`z = 1`", why:"−3 multiplies `t`." },
            { t:"`z = -3t`", why:"Add `z_0 = 4`." }],
          hints:["`z = z_0 + t m_3`.", "`z_0 = 4`, `m_3 = -3`.", "`4 - 3t`."] }
      ],
      refreshers:{
        "Directions and points":"A point is on a line if one value of the parameter works in every component. Parallel lines have parallel directions.",
        "Solving systems":"Eliminate a variable by adding or subtracting multiples, then substitute back.",
        "Lines in R²":"If one equation is a multiple of the other, the lines coincide; if only the `x`- and `y`-coefficients are proportional, they’re parallel and distinct."
      }
    }
  },
  explore:{
    heading:"Two lines in space",
    intro:"Move a point along each line with its own slider. If you can make the two points meet, the lines intersect. Then rotate the view: are lines that look crossed really crossing?",
    txt:{
      mode:"Space", line1:"Line 1", line2:"Line 2", point:"point", dir:"direction",
      inNote:"Points: whole numbers −6 to 6. Directions: whole numbers −4 to 4, not `vec{0}`.",
      badIn:"Type whole numbers in range; a direction can’t be `vec{0}`. The last valid line is kept.",
      sl:"`s` moves P on line 1", tl:"`t` moves Q on line 2", solve:"Solve", solveNone:"No exact values: the lines don’t meet.",
      solveOff:"Solve is off while a challenge’s lines are loaded.", solveSame:"Same line: `t` set so Q lands on P.",
      gallery:"Gallery", view:"View", rotNote:"Drag the view or use the arrow keys to rotate it (Shift + arrows: bigger steps).",
      flatNote:"R² mode: a flat grid, seen from above.",
      key:"Line 1 in blue with P; line 2 in teal with Q; the dashed segment joins P and Q.",
      onlyView:"crossing in this view only", meet:"P = Q",
      rows:{ l1:"Line 1", l2:"Line 2", dir:"Directions", eqs:"Component equations", solve:"Solve", check:"Check", ptest:"Point test", cls:"Classification", gap:"Gap between P and Q" },
      notPar:"Not parallel", par:"Parallel", noSol:"No solution", match:"match", noMatch:"don’t match",
      parSolve:"No unique `s` and `t`: test a point instead.",
      onL1:"on line 1", notOnL1:"not on line 1",
      cls:{ meet:"Intersect at", parallel:"Parallel and distinct", same:"Coincident", skew:"Skew" },
      hidden:"? (predict first)"
    },
    presets:[
      { id:"cross", t:"Crossing", mode:"r3", L:L([2, 0, 1], [1, 1, 1], [5, 1, 3], [1, -1, 0]) },
      { id:"par", t:"Parallel", mode:"r3", L:L([1, 1, 1], [2, 0, -2], [3, 5, -1], [-1, 0, 1]) },
      { id:"same", t:"Same line", mode:"r3", L:L([0, 1, 2], [1, 1, 1], [2, 3, 4], [3, 3, 3]) },
      { id:"skew", t:"Skew", mode:"r3", L:L([1, 2, 3], [1, 0, -1], [0, 4, 1], [1, -1, 0]) },
      { id:"fake", t:"Fake cross", mode:"r3", L:L([1, 0, 2], [1, 1, 0], [3, 0, 0], [-1, 1, 1]) },
      { id:"c1", t:"Challenge 1", chal:true, mode:"r2", L:L([1, 1, 0], [2, 1, 0], [6, 2, 0], [1, -1, 0]) },
      { id:"c2", t:"Challenge 2", chal:true, mode:"r3", L:L([1, 0, 2], [1, 1, 0], [3, 0, 0], [-1, 1, 1]) },
      { id:"c3", t:"Challenge 3", chal:true, mode:"r3", L:L([0, 0, 0], [1, 1, 1], [2, 1, 0], [1, 0, 1]) }
    ],
    views:[{ id:"iso", t:"Isometric" }, { id:"front", t:"Front" }, { id:"side", t:"Side" }, { id:"top", t:"Look from above" }],
    predIntro:"Make a prediction first. Then the 3D view shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"R² mode: line 1 " + R + "` = s(1, 2)`, line 2 " + R + "` = (3, 0) + t(-1, 2)`." + " " + "How do these lines meet?",
        options:[{ t:"at one point", ok:true }, { t:"they’re parallel" }, { t:"they’re the same line" }, { t:"they’re skew" }],
        explain:"The lines cross at `(3/2, 3)` with `s = t = 3/2`. Directions `(1, 2)` and `(-1, 2)` aren’t parallel, and two non-parallel lines in a plane must cross. Skew is impossible in R².",
        start:{ mode:"r2", view:"top", L:L([0, 0, 0], [1, 2, 0], [3, 0, 0], [-1, 2, 0]), s:0, t:0 } },
      { id:"p2", prompt:"R³, looking from above: line 1 is the `x`-axis, line 2 is " + R + "` = (0, 0, 2) + t(0, 1, 0)`." + " " + "From above they cross at the origin. Do they meet?",
        options:[{ t:"no: they’re skew", ok:true }, { t:"yes, at `(0, 0, 0)`" }, { t:"yes, at `(0, 0, 2)`" }, { t:"no: they’re parallel" }],
        explain:"Line 2 always has `z = 2`; the `x`-axis has `z = 0`. Not parallel, never meeting: skew.",
        start:{ mode:"r3", view:"top", L:L([0, 0, 0], [1, 0, 0], [0, 0, 2], [0, 1, 0]), s:0, t:0 } },
      { id:"p3", prompt:"Line 1 " + R + "` = (1, 1, 1) + s(2, -2, 4)`, line 2 " + R + "` = (0, 2, -1) + t(-1, 1, -2)`." + " " + "The directions are parallel. What are the lines?",
        options:[{ t:"the same line", ok:true }, { t:"parallel and distinct" }, { t:"skew" }, { t:"meeting at one point" }],
        explain:"`(0, 2, -1) - (1, 1, 1) = (-1, 1, -2)`, a multiple of the direction, so `(0, 2, -1)` is on line 1.",
        start:{ mode:"r3", view:"iso", L:L([1, 1, 1], [2, -2, 4], [0, 2, -1], [-1, 1, -2]), s:0, t:0 } },
      { id:"p4", prompt:"Preset “Fake cross”: line 1 " + R + "` = (1, 0, 2) + s(1, 1, 0)`, line 2 " + R + "` = (3, 0, 0) + t(-1, 1, 1)`. The `x`- and `y`-equations give `s = t = 1`. Do the lines meet?",
        options:[{ t:"no: the `z`-values (2 and 1) differ, so they’re skew", ok:true }, { t:"yes, at `(2, 1, 2)`" }, { t:"yes, at `(2, 1, 1)`" }, { t:"they’re parallel" }],
        explain:"Always check the third equation.",
        start:{ mode:"r3", view:"iso", L:L([1, 0, 2], [1, 1, 0], [3, 0, 0], [-1, 1, 1]), s:0, t:0 } }
    ],
    chalIntro:"Load a challenge’s lines from the gallery, set the sliders or the numbers, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"R² mode: line 1 " + R + "` = (1, 1) + s(2, 1)`, line 2 " + R + "` = (6, 2) + t(1, -1)`. Move the sliders so P and Q meet. (Gallery: Challenge 1.)",
        why:"`s = 2` and `t = -1`: P = Q = `(5, 3)`.",
        hints:["`1 + 2s = 6 + t` and `1 + s = 2 - t`.", "Add them: `2 + 3s = 8`, so `s = 2`.", "Then `t = 1 - s = -1`: the point is `(5, 3)`."],
        msgs:{ load:"Load this challenge’s lines first: tap <strong>Challenge 1</strong> in the gallery.",
          same:"You used the same value for both parameters. Q reaches `(5, 3)` at a different `t`.",
          tpos:"Q is at `(7, 1)`: `t` must be negative.",
          general:"Not yet: P and Q must be the same point. Watch the gap between them." } },
      { id:"tc2", goal:3, prompt:"R³: line 1 " + R + "` = (1, 0, 2) + s(1, 1, 0)`, line 2 " + R + "` = (3, 0, k) + t(-1, 1, 1)`. Set `k` (whole numbers −5 to 5) so the lines intersect. (Gallery: Challenge 2; `k` is line 2’s `z` box.)",
        why:"`k = 1`: the lines meet at `(2, 1, 2)`.",
        hints:["`x` and `y` give `s = t = 1` whatever `k` is.", "At those values, line 1’s `z` is 2 and line 2’s `z` is `k + 1`.", "`k + 1 = 2`, so `k = 1`."],
        msgs:{ load:"Load this challenge’s lines first: tap <strong>Challenge 2</strong> in the gallery. Then change only line 2’s `z` box.",
          k2:"You copied line 1’s `z`. At `t = 1`, line 2’s `z` is `k + 1`.",
          k0:"`z`-values 2 and 1 differ: skew.",
          general:"Not yet: the lines must intersect. Watch the classification." } },
      { id:"tc3", goal:3, stretch:true, prompt:"Line 1 is " + R + "` = s(1, 1, 1)`. Line 2 passes through `(2, 1, 0)` and is <strong>horizontal</strong> (`m_3 = 0`). Choose its direction (whole numbers −3 to 3) so the lines are <strong>skew</strong>. (Gallery: Challenge 3.)",
        why:"Line 2 stays at height `z = 0`, where line 1 has only the origin. Any horizontal direction that isn’t a multiple of `(2, 1, 0)` misses it: skew.",
        hints:["Line 2 stays at height `z = 0`. Where is line 1 at height 0?", "Only at `s = 0`: the origin.", "So line 2 meets line 1 only if it passes through the origin, i.e. if `vec{m}_2 ∥ (2, 1, 0)`. Any other horizontal direction gives skew lines."],
        msgs:{ load:"Load this challenge’s lines first: tap <strong>Challenge 3</strong> in the gallery. Then change only line 2’s direction.",
          origin:"Line 2 now passes through the origin, which is on line 1: they intersect.",
          notHoriz:"That direction isn’t horizontal.",
          par:"That’s not horizontal, and parallel lines aren’t skew anyway.",
          range:"Use whole numbers from −3 to 3 for this challenge.",
          general:"Not yet: line 2 must be horizontal and skew to line 1." } }
    ]
  },
  part3:{
    slug:"skew", name:"Skew?",
    heading:"Skew or crossing?",
    intro:"Run the decision flowchart on five pairs of lines. Tap the answer at each step; the next question opens when you’re right. Then rotate the 3D view to confirm the verdict.",
    labels:{ pairs:"Pairs", yes:"Yes", no:"No", solveBtn:"Solve them", restart:"Start this pair again",
      verdict:"Verdict", confirm:"Rotate the view to confirm:", working:"Check it with algebra", done:"✓ Done", r2skip:"In R², the “third equation” step is skipped: two non-parallel lines always meet.",
      nodes:{ par:"Are the directions parallel?", pt:"Is a point of line 2 on line 1?", solve:"Solve two equations for `s` and `t`.", third:"Does the third equation hold?", solve2:"Solve the two equations." },
      verd:{ same:"Coincident", parallel:"Parallel and distinct", meet:"Intersect", skew:"Skew" },
      wrong:{ par:"Compare the directions: is one a multiple of the other?", pt:"Subtract the points: is the difference a multiple of line 1’s direction?", third:"Put `s` into line 1 and `t` into line 2 for the unused component: do the values agree?" } },
    pairs:[
      { id:"k1", t:"K1", L:L([1, 0, 1], [2, 1, -1], [3, 1, 0], [-4, -2, 2]), par:true, onLine:true, kind:"same",
        w:{ par:"`(-4, -2, 2) = -2(2, 1, -1)`: parallel.", pt:"`(3, 1, 0) - (1, 0, 1) = (2, 1, -1)`: `s = 1` on line 1.", v:"The same line: coincident." } },
      { id:"k2", t:"K2", L:L([0, 1, 2], [1, -1, 3], [1, 1, 1], [2, -2, 6]), par:true, onLine:false, kind:"parallel",
        w:{ par:"`(2, -2, 6) = 2(1, -1, 3)`: parallel.", pt:"`(1, 1, 1) - (0, 1, 2) = (1, 0, -1)` isn’t a multiple of `(1, -1, 3)`.", v:"Parallel and distinct." } },
      { id:"k3", t:"K3", L:L([1, 2, 3], [1, 0, -1], [0, 4, 1], [1, -1, 0]), par:false, third:false, kind:"skew", s:1, tt:2,
        w:{ par:"`(1, 0, -1)` and `(1, -1, 0)` aren’t multiples: not parallel.", solve:"`y`: `2 = 4 - t` gives `t = 2`; `x`: `1 + s = t` gives `s = 1`.", third:"`z`: line 1 gives `3 - 1 = 2`; line 2 gives 1. `2 ≠ 1`.", v:"Skew: not parallel and never meeting." } },
      { id:"k4", t:"K4", L:L([2, 0, 1], [1, 1, 1], [5, 1, 3], [1, -1, 0]), par:false, third:true, kind:"meet", s:2, tt:-1,
        w:{ par:"`(1, 1, 1)` and `(1, -1, 0)` aren’t multiples: not parallel.", solve:"`x`: `2 + s = 5 + t`; `y`: `s = 1 - t`. So `s = 2`, `t = -1`.", third:"`z`: `1 + 2 = 3` and `3 + 0 = 3` ✓.", v:"Intersect at `(4, 2, 3)`." } },
      { id:"k5", t:"K5 (R²)", r2:true, eq1:"`3x - y = 5`", eq2:"`x + 2y = 4`", L:L([2, 1, 0], [1, 3, 0], [2, 1, 0], [-2, 1, 0]), par:false, kind:"meet", pt2:[2, 1],
        w:{ par:"Normals `(3, -1)` and `(1, 2)` aren’t multiples: not parallel.", solve:"From the first, `y = 3x - 5`. Then `x + 2(3x - 5) = 4`, so `7x = 14`: `x = 2`, `y = 1`.", v:"Intersect at `(2, 1)`." },
        alg:["The two scalar equations are a system of two linear equations in two variables.", "Solving the system is the same as finding the crossing: `y = 3x - 5`, `x + 2(3x - 5) = 4`, so `x = 2` and `y = 1`.", "Check: `3(2) - 1 = 5` ✓ and `2 + 2(1) = 4` ✓. The lines cross at `(2, 1)`."] }
    ],
    quickCheck:{
      title:"Quick check", summary:"Skew? quick check",
      items:[
        { id:"q1", goal:3, prompt:"Directions `(2, -1, 3)` and `(-4, 2, -6)`. The lines are …",
          choices:[{ t:"parallel or the same line", ok:true, fb:"Right. `(-4, 2, -6) = -2(2, -1, 3)`. Test a point to decide which." }, { t:"skew", fb:"`(-4, 2, -6) = -2(2, -1, 3)`. Test a point to decide which." },
            { t:"intersecting", fb:"`(-4, 2, -6) = -2(2, -1, 3)`. Test a point to decide which." }, { t:"perpendicular", fb:"`(-4, 2, -6) = -2(2, -1, 3)`. Test a point to decide which." }] },
        { id:"q2", goal:3, prompt:"The `x`- and `y`-equations give `s = 1`, `t = 2`, but the `z`-values are 4 and 7. The lines …",
          choices:[{ t:"are skew", ok:true, fb:"Right. The third equation fails, and the directions aren’t parallel (otherwise there’d be no unique `s`, `t`)." }, { t:"meet where `s = 1`", fb:"The third equation fails, and the directions aren’t parallel (otherwise there’d be no unique `s`, `t`)." },
            { t:"meet at `(4, 7)`", fb:"The third equation fails, and the directions aren’t parallel (otherwise there’d be no unique `s`, `t`)." }, { t:"are parallel", fb:"The third equation fails, and the directions aren’t parallel (otherwise there’d be no unique `s`, `t`)." }] },
        { id:"q3", goal:4, prompt:"Can two lines in R² be skew?",
          choices:[{ t:"No: non-parallel lines in a plane always meet", ok:true, fb:"Right. Skew needs a third dimension to pass over." }, { t:"Yes, if they look far apart", fb:"Skew needs a third dimension to pass over." },
            { t:"Yes, if their directions differ", fb:"Skew needs a third dimension to pass over." }, { t:"Only if one is vertical", fb:"Skew needs a third dimension to pass over." }] },
        { id:"q4", goal:2, prompt:"Line 1 " + R + "` = (1, 1) + s(1, 0)`, line 2 " + R + "` = (0, 3) + t(0, 1)`. They meet at …",
          choices:[{ t:"`(0, 1)`", ok:true, fb:"Right. Line 1 is `y = 1`; line 2 is `x = 0`." }, { t:"`(1, 3)`", fb:"Line 1 is `y = 1`; line 2 is `x = 0`. `s` and `t` aren’t the point." },
            { t:"`s = -1`, `t = -2`", fb:"Line 1 is `y = 1`; line 2 is `x = 0`. `s` and `t` aren’t the point." }, { t:"`(1, 1)`", fb:"Line 1 is `y = 1`; line 2 is `x = 0`. `s` and `t` aren’t the point." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Four-way sort", summary:"Four-way sort", noun:"pair", goal:[3, 4],
        instruction:"Tap a pair of lines, then tap the box it belongs in.",
        boxes:[{ id:"b1", label:"Intersect" }, { id:"b2", label:"Parallel and distinct" }, { id:"b3", label:"Coincident" }, { id:"b4", label:"Skew" }],
        items:[
          { id:"s1", t:"`(1, 0, 0) + s(1, 1, 0)`<br>`(0, 1, 0) + t(1, -1, 0)`", answer:"b1", why:"Intersect at `(1, 0, 0)`: `s = 0`, `t = 1`." },
          { id:"s2", t:"`s(1, 2, 3)`<br>`(1, 2, 4) + t(2, 4, 6)`", answer:"b2", why:"Parallel directions, and `(1, 2, 4)` isn’t a multiple of `(1, 2, 3)`: parallel and distinct." },
          { id:"s3", t:"`s(1, 2, 3)`<br>`(2, 4, 6) + t(-1, -2, -3)`", answer:"b3", why:"Parallel directions, and `(2, 4, 6) = 2(1, 2, 3)` is on line 1: coincident." },
          { id:"s4", t:"`(1, 0, 0) + s(0, 1, 0)`<br>`(0, 0, 1) + t(1, 0, 0)`", answer:"b4", why:"Skew: `x` forces `t = 1`, `y` forces `s = 0`, then `z`: 0 vs 1.",
            wrong:{ b1:"`x` forces `t = 1`, `y` forces `s = 0`, then `z`: 0 vs 1." } },
          { id:"s5", t:"`(2, 1, 3) + s(1, 0, -1)`<br>`(0, 2, 1) + t(1, -1, 1)`", answer:"b4", why:"Skew: `s = -1`, `t = 1` from `x` and `y`, but `z`: 4 vs 2.",
            wrong:{ b1:"`s = -1`, `t = 1` from `x` and `y`, but `z`: 4 vs 2. " + M2 } },
          { id:"s6", t:"`(2, 1, 3) + s(1, 0, -1)`<br>`(0, 2, 3) + t(1, -1, 1)`", answer:"b1", why:"Intersect at `(1, 1, 4)`: `t = 1`, `s = -1`, and `z`: `3 - (-1) = 4` and `3 + 1 = 4` ✓.",
            hints:["Not parallel; solve `x` and `y`.", "`t = 1`, `s = -1`.", "`z`: `3 - (-1) = 4` and `3 + 1 = 4` ✓: `(1, 1, 4)`."],
            wrong:{ b4:"Compare it with the pair `(2, 1, 3) + s(1, 0, -1)` and `(0, 2, 1) + t(1, -1, 1)`: they differ only in line 2’s `z_0`. One number decides skew or crossing." } },
          { id:"s7", t:"`(1, 1, 1) + s(2, 0, -2)`<br>`(3, 5, -1) + t(-1, 0, 1)`", answer:"b2", why:"Parallel directions, and `(2, 4, -2)` isn’t a multiple of `(2, 0, -2)`: parallel and distinct.",
            wrong:{ b3:"`(3, 5, -1) - (1, 1, 1) = (2, 4, -2)` isn’t a multiple of `(2, 0, -2)`. " + M4 } },
          { id:"s8", t:"`(0, 1, 2) + s(1, 1, 1)`<br>`(2, 3, 4) + t(3, 3, 3)`", answer:"b3", why:"Parallel directions, and `(2, 3, 4) - (0, 1, 2) = (2, 2, 2)` is a multiple of `(1, 1, 1)`: coincident." }
        ],
        wrongDefault:"Check the directions first, then test a point or solve two equations and check the third." },
      { id:"find", type:"custom", title:"Find it", summary:"Find it", star:true, goal:[2, 3, 5],
        instruction:"Find the points, the missing numbers and the true statements. Items 3 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type whole numbers or fractions such as −2 or 3/2 in the boxes, or tap a chip. Then press Check.",
        msgs:{ fill:"Fill in every box first.", err:"Type numbers only, such as 3, −2 or 3/2.", pick:"Tap a chip first.", general:"Not yet. Check your work and try again." },
        items:[
          { id:"n1", goal:2, form:"pt", prompt:"Intersection of " + R + "` = (1, 2) + s(3, -1)` and " + R + "` = (0, 5) + t(1, 1)`.",
            boxes:[{ k:"x", pre:"(", post:"," }, { k:"y", post:")" }], answer:{ x:-2, y:3 }, display:"`(-2, 3)`",
            wrong:[{ v:{ x:-1, y:-2 }, fb:"`(s, t) = (-1, -2)` are parameters. " + M6 }],
            why:"`1 + 3s = t` and `2 - s = 5 + t` give `s = -1`, `t = -2`; line 1 at `s = -1` is `(-2, 3)`." },
          { id:"n2", goal:3, form:"pt", prompt:"Find `k` so that " + R + "` = (1, 0, 3) + s(1, 2, -1)` and " + R + "` = (0, k, 1) + t(2, 1, 1)` intersect.",
            boxes:[{ k:"k", pre:"`k =`" }], answer:{ k:1 }, display:"`k = 1` (meeting at `(2, 2, 2)`)",
            wrong:[], general:"`x` and `z` give `s = t = 1`; then `y`: `2 = k + 1`.",
            why:"`x`: `1 + s = 2t`; `z`: `3 - s = 1 + t`. So `s = t = 1`, and `y`: `2 = k + 1`." },
          { id:"n3", goal:3, star:true, form:"pt", prompt:"Find `k` so that " + R + "` = (2, -1, 0) + s(k, 2, -4)` and " + R + "` = (1, 1, 1) + t(3, -3, 6)` are parallel.",
            boxes:[{ k:"k", pre:"`k =`" }], answer:{ k:-2 }, display:"`k = -2`",
            wrong:[{ v:{ k:2 }, fb:"The ratio is `2/(-3) = -4/6 = -2/3`, so `k = 3 × (-2/3)`: mind the sign." }], general:"The ratio is `2/(-3) = -4/6 = -2/3`, so `k = 3 × (-2/3)`.",
            hints:["Parallel: one direction is a multiple of the other.", "Compare the `y`- and `z`-components: `2/(-3)` and `-4/6`.", "Both `-2/3`, so `k/3 = -2/3`."],
            why:"`(k, 2, -4) = -2/3 (3, -3, 6)` needs `k = -2`." },
          { id:"n4", goal:[2, 3], star:true, form:"pt", prompt:"" + R + "` = (1, 1, 1) + s(1, 0, 1)` and " + R + "` = (a, 3, 2) + t(0, 1, 1)` intersect. Find `a` and the point.",
            boxes:[{ k:"a", pre:"`a =`", post:";", gap:true }, { k:"x", pre:"point (", post:"," }, { k:"y", post:"," }, { k:"z", post:")" }], answer:{ a:0, x:0, y:1, z:0 }, display:"`a = 0`; point `(0, 1, 0)`",
            wrong:[{ v:{ a:0, x:-1, y:-2 }, fb:"`s = -1` and `t = -2` are parameters. " + M6 }],
            general:"`y`: `1 = 3 + t` gives `t = -2`; `z`: `1 + s = 0` gives `s = -1`; `x`: `a = 1 + s = 0`.",
            why:"`y`: `t = -2`; `z`: `1 + s = 2 + t = 0`, so `s = -1`; `x`: `a = 1 + s = 0`. The point is `(0, 1, 0)`." },
          { id:"n5", goal:[3, 4], star:true, form:"chips", prompt:"Which line through P`(1, 2, 3)` is skew to the `x`-axis?",
            options:[
              { t:R + "` = (1, 2, 3) + t(0, 1, 0)`", ok:true, why:"`(1, 0, 0)` is parallel to the axis; `(0, 2, 3)` reaches `(1, 0, 0)` at `t = -1`; `(1, 2, 3)` passes through the origin. `(0, 1, 0)` keeps `z = 3`, so it never meets the axis, and it isn’t parallel." },
              { t:R + "` = (1, 2, 3) + t(1, 0, 0)`", why:"`(1, 0, 0)` is parallel to the axis, and parallel lines aren’t skew." },
              { t:R + "` = (1, 2, 3) + t(0, 2, 3)`", why:"`(0, 2, 3)` reaches `(1, 0, 0)` at `t = -1`: that point is on the `x`-axis." },
              { t:R + "` = (1, 2, 3) + t(1, 2, 3)`", why:"`(1, 2, 3)` passes through the origin, which is on the `x`-axis." }] },
          { id:"n6", goal:5, star:true, form:"chips", prompt:"Two drones, positions after `t` seconds: A `= (1, 0, 2) + t(1, 1, 0)` and B `= (0, 3, 2) + t(2, -1, 0)`. Choose the true statement.",
            options:[
              { t:"Their paths cross but they don’t collide", ok:true, why:"With separate parameters the paths meet at `(8/3, 5/3, 2)`, A at time `5/3` and B at time `4/3`: different times." },
              { t:"They collide", why:M7 + " With separate parameters the paths meet at `(8/3, 5/3, 2)`, A at time `5/3` and B at time `4/3`." },
              { t:"Their paths never cross", why:M1 },
              { t:"Their paths are parallel", why:"`(1, 1, 0)` and `(2, -1, 0)` aren’t multiples." }],
            hints:["First treat the paths as lines with parameters `s` and `u`.", "`1 + s = 2u` and `s = 3 - u` give `u = 4/3`, `s = 5/3`.", "The paths cross, but A gets there at `5/3` s and B at `4/3` s."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Eva", goal:[2, 3],
        instruction:"Eva made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Where do " + R + "` = (1, 2, 0) + s(1, 0, 1)` and " + R + "` = (0, 4, 1) + t(1, -1, 0)` meet?",
            steps:["Use `t` for both lines: `(1 + t, 2, t)` and `(t, 4 - t, 1)`.", "`x`: `1 + t = t`, which is impossible.", "So the lines don’t intersect."],
            answer:0,
            stepFb:["", "Step 2 follows step 1. The mistake is earlier.", "This conclusion comes from step 1."],
            fixes:[
              { t:"Use `s` for line 1 and `t` for line 2: `x` gives `1 + s = t`, `y` gives `2 = 4 - t`, so `t = 2` and `s = 1`; `z`: `1 = 1` ✓. They meet at `(2, 2, 1)`.", ok:true, why:M1 },
              { t:"Use `t = 0` for both.", why:"That just compares the starting points." },
              { t:"Subtract the direction vectors.", why:"That doesn’t find a common point." },
              { t:"Step 1 is correct.", why:M1 }],
            hints:["Must both lines reach the shared point at the same parameter value?", "No: give line 1 the parameter `s`.", "`s = 1`, `t = 2`: `(2, 2, 1)`."] },
          { id:"e2", goal:3, task:"Do " + R + "` = (0, 1, 1) + s(1, 1, 0)` and " + R + "` = (2, 0, 5) + t(0, 1, -1)` intersect?",
            steps:["`x`: `s = 2`.", "`y`: `1 + s = t`, so `t = 3`.", "The lines meet where `s = 2`: at `(2, 3, 1)`."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct. Keep checking.", ""],
            fixes:[
              { t:"Check `z` first: line 1 gives 1, line 2 gives `5 - 3 = 2`. They don’t match, so the lines are skew.", ok:true, why:M2 },
              { t:"They meet at `(2, 3, 2)`, using line 2.", why:"Each line gives a different point: that’s the sign they don’t meet." },
              { t:"Use `t = 2` instead.", why:"`y` forces `t = 3`." },
              { t:"Step 3 is correct.", why:M2 }],
            hints:["Which equation hasn’t been used?", "`z`.", "`1 ≠ 2`: skew."] },
          { id:"e3", goal:3, task:"Classify " + R + "` = (1, 0, 2) + s(2, -1, 1)` and " + R + "` = (3, 1, 3) + t(-4, 2, -2)`.",
            steps:["`(-4, 2, -2) = -2(2, -1, 1)`, so the directions are parallel.", "Parallel directions mean the lines are the same line.", "Coincident."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"Test a point: `(3, 1, 3) - (1, 0, 2) = (2, 1, 1)` isn’t a multiple of `(2, -1, 1)`, so the lines are parallel and distinct.", ok:true, why:M4 },
              { t:"Parallel directions mean the lines are skew.", why:"Skew lines aren’t parallel." },
              { t:"Solve for `s` and `t` as usual.", why:"With parallel directions the equations have no unique solution; test a point instead." },
              { t:"Step 2 is correct.", why:M4 }],
            hints:["Can parallel lines be different lines?", "Yes: test a point of line 2 on line 1.", "`(2, 1, 1)` isn’t a multiple of `(2, -1, 1)`: distinct."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in Explore: lines that look crossed but miss, or the same line written two different ways?" },
      { id:"j2", q:"In your own words, what are skew lines, and why can’t they exist in R²?" },
      { id:"j3", q:"Explain to a friend why each line needs its own parameter." },
      { id:"j4", q:"Which check do you tend to skip (directions, the third equation, the point test)? How will you remember it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"In R², the lines `3x - 2y = 4` and `6x - 4y = 8` are …", options:[
          { t:"coincident", ok:true, why:"The second equation is 2 × the first." },
          { t:"parallel and distinct", why:"The constants double too. " + M4 },
          { t:"meeting at one point", why:"Parallel normals." },
          { t:"perpendicular", why:"`(3, -2) · (6, -4) ≠ 0`." }] },
        b:{ prompt:"In R², the lines `x + 4y = 3` and `2x + 8y = 5` are …", options:[
          { t:"parallel and distinct", ok:true, why:"Doubling the first gives 6, not 5." },
          { t:"coincident", why:"Doubling the first gives 6, not 5. " + M4 },
          { t:"meeting at one point", why:"Parallel normals: `(2, 8) = 2(1, 4)`." },
          { t:"perpendicular", why:"`(1, 4) · (2, 8) ≠ 0`." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Where do " + R + "` = (1, 5) + s(1, -1)` and " + R + "` = t(1, 2)` meet?", options:[
          { t:"`(2, 4)`", ok:true, why:"`1 + s = t` and `5 - s = 2t` give `s = 1`, `t = 2`." },
          { t:"`s = 1`, `t = 2`", why:"Those are parameters. " + M6 },
          { t:"`(3, 3)`", why:"That puts `t = 2` into line 1. " + M1 },
          { t:"`(1, 5)`", why:"That’s line 1’s starting point; it isn’t on line 2." }] },
        b:{ prompt:"Where do " + R + "` = (2, 8) + s(1, -2)` and " + R + "` = t(1, 1)` meet?", options:[
          { t:"`(4, 4)`", ok:true, why:"`s = 2`, `t = 4`." },
          { t:"`s = 2`, `t = 4`", why:"Those are parameters. " + M6 },
          { t:"`(6, 0)`", why:"That puts `t = 4` into line 1. " + M1 },
          { t:"`(2, 8)`", why:"That’s line 1’s starting point; it isn’t on line 2." }] } },
      { id:"k3", cat:"K", goal:[3, 4],
        a:{ prompt:"Which pair of lines is skew?", options:[
          { t:"The `x`-axis and " + R + "` = (0, 1, 1) + t(0, 0, 1)`", ok:true, why:"Line 2 always has `y = 1`, so it never meets the `x`-axis, and it isn’t parallel." },
          { t:"The `x`-axis and the `y`-axis", why:"They meet at the origin." },
          { t:"The `x`-axis and " + R + "` = (0, 2, 0) + t(1, 0, 0)`", why:"Parallel." },
          { t:"The `x`-axis and " + R + "` = (0, 1, 1) + t(0, 1, 1)`", why:"At `t = -1` it reaches the origin: they intersect." }] },
        b:{ prompt:"Which pair of lines is skew?", options:[
          { t:"The `y`-axis and " + R + "` = (1, 0, 0) + t(0, 0, 1)`", ok:true, why:"Line 2 always has `x = 1`; not parallel." },
          { t:"The `y`-axis and the `z`-axis", why:"They meet at the origin." },
          { t:"The `y`-axis and " + R + "` = (3, 0, 0) + t(0, 2, 0)`", why:"Parallel." },
          { t:"The `y`-axis and " + R + "` = (2, 2, 0) + t(1, 1, 0)`", why:"At `t = -2` it passes through the origin." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Do " + R + "` = (1, 1, 0) + s(1, 0, 1)` and " + R + "` = (2, 3, 2) + t(0, 1, 1)` intersect?", options:[
          { t:"No: they’re skew (`s = 1`, `t = -2` give `z`-values 1 and 0).", ok:true, why:"The third equation fails, and the directions aren’t parallel." },
          { t:"Yes, at `(2, 1, 1)`.", why:"That’s line 1’s point after using only `x` and `y`. " + M2 },
          { t:"Yes, where `s = 1` and `t = -2`.", why:M2 + " Also, `s` and `t` aren’t a point." },
          { t:"No: they’re parallel.", why:"`(1, 0, 1)` and `(0, 1, 1)` aren’t multiples." }] },
        b:{ prompt:"Do " + R + "` = (0, 2, 1) + s(1, 1, 0)` and " + R + "` = (3, 0, 2) + t(0, 1, 1)` intersect?", options:[
          { t:"No: they’re skew (`s = 3`, `t = 5` give `z`-values 1 and 7).", ok:true, why:"The third equation fails, and the directions aren’t parallel." },
          { t:"Yes, at `(3, 5, 1)`.", why:"That’s line 1’s point after using only `x` and `y`. " + M2 },
          { t:"Yes, where `s = 3` and `t = 5`.", why:M2 + " Also, `s` and `t` aren’t a point." },
          { t:"No: they’re parallel.", why:"`(1, 1, 0)` and `(0, 1, 1)` aren’t multiples." }] } },
      { id:"t2", cat:"T", goal:[2, 3],
        a:{ prompt:"For which `k` do " + R + "` = (1, 0, k) + s(1, 1, 1)` and " + R + "` = (0, 3, 2) + t(1, 0, -1)` intersect?", options:[
          { t:"`k = -5`", ok:true, why:"`y`: `s = 3`; `x`: `t = 4`; `z`: `k + 3 = 2 - 4`." },
          { t:"`k = -2`", why:"That forgets the `s` in line 1’s `z`: `k = 2 - 4`." },
          { t:"`k = 3`", why:"Sign slip in line 2’s `z`: `2 - t`, not `2 + t`." },
          { t:"No value: the lines are skew for every `k`.", why:"`k` only shifts line 1 up or down; one height makes them meet." }] },
        b:{ prompt:"For which `k` do " + R + "` = (2, 1, k) + s(0, 1, 1)` and " + R + "` = (0, 0, 1) + t(1, 1, 2)` intersect?", options:[
          { t:"`k = 4`", ok:true, why:"`x`: `t = 2`; `y`: `s = 1`; `z`: `k + 1 = 5`." },
          { t:"`k = 5`", why:"Forgets the `s` in line 1’s `z`." },
          { t:"`k = -4`", why:"Sign slip." },
          { t:"No value: the lines are skew for every `k`.", why:"`k` only shifts line 1 up or down; one height makes them meet." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Boat P is at `(0, 0) + t(2, 1)` and boat Q is at `(10, 0) + t(-1, 2)` after `t` minutes (positions in hundreds of metres). Which is true?", options:[
          { t:"Their paths cross at `(8, 4)`, but P gets there at `t = 4` and Q at `t = 2`, so they don’t collide.", ok:true, why:"With separate parameters the paths meet at `(8, 4)`, but at different times." },
          { t:"They collide at `(8, 4)`.", why:M7 },
          { t:"Their paths never cross.", why:"Using one `t` for both looks for a collision only; with separate parameters the paths cross." },
          { t:"They collide at `t = 3`.", why:"There’s no common time: 3 is just the average of 2 and 4." }] },
        b:{ prompt:"Boat P is at `(0, 0) + t(1, 2)` and boat Q is at `(1, 7) + t(2, -1)` after `t` minutes. Which is true?", options:[
          { t:"Their paths cross at `(3, 6)`, but P gets there at `t = 3` and Q at `t = 1`, so they don’t collide.", ok:true, why:"With separate parameters the paths meet at `(3, 6)`, but at different times." },
          { t:"They collide at `(3, 6)`.", why:M7 },
          { t:"Their paths never cross.", why:"Using one `t` for both looks for a collision only; with separate parameters the paths cross." },
          { t:"They collide at `t = 2`.", why:"There’s no common time: 2 is just the average of 1 and 3." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which is the best explanation of why two lines in R² can’t be skew?", options:[
          { t:"“Two lines in the same plane are either parallel or not. Non-parallel lines in a plane must cross, so ‘not parallel and never meeting’ can’t happen.”", ok:true, why:"Skew needs a third dimension to pass over." },
          { t:"“Because lines in R² have no `z`-coordinate to check.”", why:"That describes the algebra, not why crossing is forced." },
          { t:"“They can be skew if their slopes are very different.”", why:"Non-parallel lines in a plane always cross, however different their slopes." },
          { t:"“Because skew lines must be perpendicular.”", why:"Skew lines can meet at any angle in projection." }] },
        b:{ prompt:"Which is the best explanation of why two non-parallel lines in R³ might not meet?", options:[
          { t:"“In R³ the lines can lie in different planes: they point different ways but pass over and under each other, so no point is on both. They’re skew.”", ok:true, why:M3 },
          { t:"“They always meet: non-parallel lines must cross.”", why:M3 },
          { t:"“They miss only if one line is vertical.”", why:"Any orientation can be skew." },
          { t:"“They miss whenever `s` and `t` have different values.”", why:M1 }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which is the clearest description of how to classify two lines in R³?", options:[
          { t:"“Check whether the directions are parallel. If they are, test a point of one line on the other (same line or parallel). If not, solve two component equations for `s` and `t`, then check the third (intersecting or skew).”", ok:true, why:"Directions first, then the point test or “solve two, check the third”." },
          { t:"“Set both lines equal using the same parameter `t` and solve.”", why:M1 },
          { t:"“Solve two component equations; if they have a solution, the lines meet.”", why:M2 },
          { t:"“If the directions aren’t parallel, find the intersection point.”", why:M3 }] },
        b:{ prompt:"Which statement about “solve two, check the third” is correct?", options:[
          { t:"“If the third equation fails, the lines are skew; if it holds, they intersect at the point given by `s` (or `t`).”", ok:true, why:"The third equation decides between intersecting and skew." },
          { t:"“If the third equation fails, the lines are parallel.”", why:"Parallel lines are caught earlier by the direction test." },
          { t:"“The third equation always holds when the first two do.”", why:M2 },
          { t:"“If the third fails, choose a different pair of equations until one works.”", why:"All three must hold at once." }] } },
      { id:"a1", cat:"A", goal:[4, 5],
        a:{ prompt:"Two straight ski-lift cables (metres): " + R + "` = (0, 0, 10) + s(4, 2, 1)` and " + R + "` = (16, 0, 15) + t(-4, 2, 1)`. Seen from above, they cross. How far above the first cable is the second at that spot?", options:[
          { t:"5 m", ok:true, why:"From above: `4s = 16 - 4t` and `2s = 2t` give `s = t = 2`. Heights: `10 + 2 = 12` and `15 + 2 = 17`." },
          { t:"0 m: they touch.", why:"Crossing in the top view doesn’t mean meeting. " + M5 },
          { t:"3 m", why:"That compares 15 with 12, forgetting cable 2 also rises by `t = 2`." },
          { t:"17 m", why:"That’s cable 2’s height, not the gap." }] },
        b:{ prompt:"Cables " + R + "` = (0, 0, 8) + s(3, 1, 1)` and " + R + "` = (12, 0, 12) + t(-3, 3, 2)` cross when seen from above. How far apart vertically are they there?", options:[
          { t:"3 m", ok:true, why:"`s = 3`, `t = 1`; heights 11 and 14." },
          { t:"0 m", why:"Crossing in the top view doesn’t mean meeting. " + M5 },
          { t:"1 m", why:"That compares 12 with 11, forgetting cable 2’s rise." },
          { t:"14 m", why:"That’s a height, not the gap." }] } },
      { id:"a2", cat:"A", goal:[2, 5],
        a:{ prompt:"A robot moves along " + R + "` = (1, 2) + s(2, 1)` on a factory floor. A rail runs along `2x - 3y = 4`. Where does the robot’s path cross the rail?", options:[
          { t:"`(17, 10)`", ok:true, why:"`2(1 + 2s) - 3(2 + s) = 4` gives `s - 4 = 4`, so `s = 8`." },
          { t:"`s = 8`", why:M6 },
          { t:"`(5, 3)`", why:"That drops the −6: `2 + s = 4`." },
          { t:"It never crosses: the path is parallel to the rail.", why:"The rail’s direction is `(3, 2)`; `(2, 1)` isn’t parallel to it." }] },
        b:{ prompt:"A robot moves along " + R + "` = (0, 1) + s(1, 3)`. A rail runs along `x - y = -5`. Where does the path cross the rail?", options:[
          { t:"`(2, 7)`", ok:true, why:"`s - (1 + 3s) = -5` gives `s = 2`." },
          { t:"`s = 2`", why:M6 },
          { t:"`(1, 4)`", why:"That stops at `s = 1`." },
          { t:"It never crosses: the path is parallel to the rail.", why:"The rail’s direction `(1, 1)` isn’t parallel to `(1, 3)`." }] } }
    ]
  },
  task:{
    title:"Skew partner", summary:"Skew partner",
    statement:"<p>Line 1 is " + R + "` = s(1, 1, 0)`. Line 2 passes through A`(2, 0, 1)`. Choose a direction for line 2 that meets every condition. There are exactly 9 different lines. How many can you find?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>Line 2 isn’t parallel to line 1.</li><li>Line 2 is skew to line 1.</li><li>Line 2 meets the `z`-axis.</li><li>It meets the `z`-axis above the origin.</li></ol></div>" +
      "<p class=\"tiny muted\">`vec{m}_2 = (a, b, c)`: whole numbers from −3 to 3, not all 0. The 3D view shows line 1 (blue), line 2 (teal), the `z`-axis and markers where line 2 meets the `z`-axis or line 1.</p>",
    checks:["Not parallel to line 1", "Skew to line 1", "Meets the `z`-axis", "Above the origin"],
    tips:["A multiple of `(1, 1, 0)` makes the lines parallel.",
      "Line 1 lies in the floor (`z = 0`) along `y = x`. Line 2 hits the floor somewhere: make sure that point isn’t on `y = x`.",
      "To reach the `z`-axis, `y` must stay 0 (so `b = 0`) and `x` must reach 0 (so `a ≠ 0`).",
      "Where line 2 meets the `z`-axis, `z = 1 - 2c/a`. Keep it positive."],
    explainPrompt:"Explain how you know your line 2 never meets line 1.",
    vocab:"Use the words skew, parallel, parameter and direction vector.",
    more:"There are exactly 9 different lines (opposite directions give the same line). How many can you find?",
    after3:"Line 2 stays in the plane `y = 0`. It meets line 1 only if it passes through the origin, the one point of line 1 with `y = 0`. That rules out the direction `(2, 0, 1)`.",
    labels:{ a:"`a`", b:"`b`", c:"`c`", range:"(−3 to 3)", dir:"Direction of line 2: `vec{m}_2 = (a, b, c)`",
      invalid:"Choose whole numbers from −3 to 3, not all 0.",
      rows:{ l2:"Line 2", z:"Meets the `z`-axis", l1:"Meets line 1", same:"Same line as" },
      never:"never", at:"at", no:"no", yes:"yes, at", par:"no: parallel",
      graph:"3D view: line 1, line 2 and the `z`-axis", found:"lines found" }
  },
  cards:[
    ["Two lines in R²", "One point, parallel and distinct, or coincident."],
    ["Two lines in R³", "Intersecting, parallel and distinct, coincident, or skew."],
    ["Skew lines", "Not parallel and never meet; they lie in different planes."],
    ["Different parameters", "Use `s` for one line and `t` for the other."],
    ["Parallel directions", "Test a point of one line on the other: same line or parallel."],
    ["Solve two, check the third", "Third holds: intersect. Third fails: skew."],
    ["Intersection point", "Substitute `s` (or `t`) back into its line."],
    ["Lines in scalar form (R²)", "Solve the system of two equations."],
    ["Looks crossed?", "A 2D view can hide a gap: check algebraically."],
    ["Crossing vs collision", "Collision needs the same time on both paths."],
    ["Coincident test", "Directions parallel <strong>and</strong> a shared point."],
    ["Skew in R²?", "Impossible: non-parallel lines in a plane always meet."]
  ]
};
