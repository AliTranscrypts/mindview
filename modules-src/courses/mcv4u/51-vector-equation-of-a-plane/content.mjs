// MCV4U 51 Vector Equation of a Plane. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/51-vector-equation-of-a-plane.md
// a⃗ is blue (--pen) and b⃗ teal (--f3) where the two directions are named (course plan §3); s and t stay ink (rule 8).
const A = '<span class="pl-ca">`vec{a}`</span>', B = '<span class="pl-cb">`vec{b}`</span>';
// misconception core sentences (plan §3)
const M1 = "Parallel directions point along one line, so `s` and `t` only slide you along that line. A plane needs two directions that aren’t multiples.";
const M3 = "Many equations describe one plane. Check that the new point is on the plane and the new directions lie along it.";
const M4 = "Two equations can always be solved. The point is on the plane only if the <strong>third</strong> equation agrees.";
const M5 = "One parameter gives one direction, `vec{a} + vec{b}`: that’s a line. Each direction needs its own parameter.";
const M6 = "Line up each component: `x` uses the `x`-components of `vec{r}_0`, `vec{a}` and `vec{b}`.";
const M7 = "It tells you which way to move, not where you are. The plane passes through `vec{r}_0`.";

export default {
  id:"51-vector-equation-of-a-plane",
  kind:"topic",
  title:"Vector equation of a plane",
  topic:"Vector Equation of a Plane",
  readyTopic:"vector equations of planes",
  hero:{
    eq:'<span class="pl-heq">`vec{r} = vec{r}_0 + s`' + A + ' `+ t`' + B + "</span>",
    eqLabel:"r vector equals r nought plus s times a vector plus t times b vector",
    eqSize:"md",
    headline:"One point, two directions, a whole plane",
    text:"A line needs one direction; a <strong>plane</strong> needs two. Start at the point `vec{r}_0`, move any amount `s` along <strong>direction vector</strong> " + A + " and any amount `t` along " + B + ", and you can reach every point of the plane. The two directions must not be parallel, or you’re stuck on a line. The <strong>parameters</strong> `s` and `t` are like coordinates on the plane itself.",
    fig:{ shape:"square", aria:"A 3D view: a point at (1, 1, 1), a blue direction arrow and a teal direction arrow. Copies of the blue thread step along the teal direction and build a parallelogram grid that fills in as a flat plane, which turns slowly." }
  },
  goals:[
    "I can explain what each part of `vec{r} = vec{r}_0 + s vec{a} + t vec{b}` does.",
    "I can write vector and parametric equations of a plane from a point and two directions, three points, or a line and a point.",
    "I can decide whether a point lies on a plane by solving for `s` and `t` and checking the third equation.",
    "I can recognize when information does not determine a unique plane (parallel directions, collinear points).",
    "I can tell whether two different vector equations describe the same plane.",
    "I can use vector equations of planes to solve problems (coplanar points, flat surfaces, heights on a sloped plane)."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Lines in R³", goal:1, prompt:"Which point lies on the line `vec{r} = (1, 2, -1) + t(2, 0, 3)`?",
          options:[
            { t:"`(5, 2, 5)`", ok:true, why:"`t = 2` gives `(1 + 4, 2, -1 + 6)`." },
            { t:"`(3, 4, 2)`", why:"The `y`-component of the direction is 0, so `y` stays 2." },
            { t:"`(2, 0, 3)`", why:"`(2, 0, 3)` is the direction, not a point on the line." },
            { t:"`(3, 2, 3)`", why:"`t = 1` fits `x` and `y`, but then `z = 2`, not 3." }],
          hints:["Find `t` from one component, then test the others.", "`x`: `1 + 2t = 5` gives `t = 2`.", "`t = 2`: `(5, 2, 5)`. It works in all three."] },
        { id:"w2", skill:"Vectors from points", goal:2, prompt:"`A(2, -1, 3)` and `B(5, 1, 0)`. Find `vec{AB}`.",
          options:[
            { t:"`(3, 2, -3)`", ok:true, why:"B − A: `(5 - 2, 1 + 1, 0 - 3)`." },
            { t:"`(-3, -2, 3)`", why:"That’s `vec{BA}`: it points the other way." },
            { t:"`(7, 0, 3)`", why:"A vector between points subtracts: end minus start." },
            { t:"`(5, 1, 0)`", why:"That points from the origin to B, not from A to B." }],
          hints:["End minus start.", "B − A.", "`(3, 2, -3)`."] },
        { id:"w3", skill:"Parallel and collinear", goal:4, prompt:"Which pair of vectors is parallel?",
          options:[
            { t:"`(2, -4, 6)` and `(-1, 2, -3)`", ok:true, why:"`(2, -4, 6) = -2(-1, 2, -3)`." },
            { t:"`(1, 2, 3)` and `(2, 3, 4)`", why:"Parallel means one is a <strong>multiple</strong> of the other: `2/1 ≠ 3/2`." },
            { t:"`(2, 0, 1)` and `(0, 2, 1)`", why:"No single multiplier turns one into the other." },
            { t:"`(1, -1, 2)` and `(2, -2, 2)`", why:"The multiplier 2 works for `x` and `y`, but 2 × 2 = 4, not 2." }],
          hints:["Look for one number `k` with `vec{u} = k vec{v}`.", "Check every component with the same `k`.", "`(2, -4, 6) = -2(-1, 2, -3)`."] },
        { id:"w4", skill:"Parallel and collinear", goal:4, prompt:"Are `A(1, 0, 2)`, `B(3, 1, 5)` and `C(7, 3, 11)` collinear?",
          options:[
            { t:"Yes: `vec{AC} = 3vec{AB}`", ok:true, why:"`vec{AB} = (2, 1, 3)`, `vec{AC} = (6, 3, 9)`." },
            { t:"No: their coordinates are all different.", why:"Collinear points can have any coordinates; what matters is the direction between them." },
            { t:"No: `vec{AC} ≠ vec{AB}`.", why:"Parallel vectors can have different lengths." },
            { t:"No: the points aren’t equally spaced.", why:"Points on a line can be any distance apart." }],
          hints:["Find `vec{AB}` and `vec{AC}`.", "`(2, 1, 3)` and `(6, 3, 9)`.", "`vec{AC} = 3vec{AB}`, so yes."] },
        { id:"w5", skill:"Solving for parameters", goal:3, prompt:"Solve `s + 2t = 4` and `2s - t = 3`.",
          options:[
            { t:"`s = 2`, `t = 1`", ok:true, why:"Check: 2 + 2 = 4 and 4 − 1 = 3." },
            { t:"`s = 1`, `t = 2`", why:"1 + 4 = 5, not 4." },
            { t:"`s = 2`, `t = -1`", why:"2 − 2 = 0, not 4." },
            { t:"`s = 4`, `t = 0`", why:"`2(4) - 0 = 8`, not 3." }],
          hints:["Solve the second for `t`.", "`t = 2s - 3`, so `s + 4s - 6 = 4`.", "`s = 2`, `t = 1`."] },
        { id:"w6", skill:"Solving for parameters", goal:3, prompt:"Write `(5, 4)` as `s(2, 1) + t(1, -1)`.",
          options:[
            { t:"`s = 3`, `t = -1`", ok:true, why:"`(6, 3) + (-1, 1) = (5, 4)`." },
            { t:"`s = -1`, `t = 3`", why:"`(-2, -1) + (3, -3) = (1, -4)`." },
            { t:"`s = 3`, `t = 1`", why:"`(6, 3) + (1, -1) = (7, 2)`." },
            { t:"`s = 2`, `t = 1`", why:"`(4, 2) + (1, -1) = (5, 1)`: the `y` fails." }],
          hints:["`2s + t = 5` and `s - t = 4`.", "Add them: `3s = 9`.", "`s = 3`, `t = -1`."] }
      ],
      refreshers:{
        "Lines in R³":"`vec{r} = vec{r}_0 + t vec{m}`: start at `vec{r}_0` and move `t` copies of `vec{m}`. A point is on the line if one value of `t` works in <strong>all three</strong> components.",
        "Vectors from points":"`vec{AB} = B - A` (end minus start). A position vector points from the origin.",
        "Parallel and collinear":"Parallel vectors are multiples: `vec{u} = k vec{v}` with the same `k` in every component. A, B, C are collinear when `vec{AB}` and `vec{AC}` are parallel.",
        "Solving for parameters":"Two equations, two unknowns: eliminate one parameter, solve, then check both equations."
      }
    }
  },
  explore:{
    heading:"Plane weaver",
    intro:"Set a point and two directions, then move the `s` and `t` sliders to travel across the plane. Try to break it: what makes the plane collapse into a line?",
    predIntro:"Make a prediction first. Then the plane weaver shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Change " + B + " to `(2, 4, 0)` while " + A + " `= (1, 2, 0)`. What will the `s` and `t` sliders sweep out now?",
        options:[{ t:"a line", ok:true }, { t:"a plane" }, { t:"a single point" }, { t:"all of space" }],
        explain:"`(2, 4, 0) = 2(1, 2, 0)`, so both directions point the same way." },
      { id:"p2", prompt:"Floor plane with " + A + " `= (1, 0, 0)` and " + B + " `= (0, 1, 0)`. Replace " + B + " with `vec{a} + vec{b} = (1, 1, 0)`. What happens to the plane?",
        options:[{ t:"nothing: it’s the same plane", ok:true }, { t:"it tilts" }, { t:"it moves up" }, { t:"it becomes a line" }],
        explain:"`(1, 1, 0)` lies in the floor, so it’s still a direction along the same plane. The sum of two vectors in a plane lies in the plane." },
      { id:"p3", prompt:"Three points: `A(1, 1, 1)`, `B(2, 3, 2)`, `C(4, 7, 4)`. What plane do A, B and C determine?",
        options:[{ t:"no unique plane: infinitely many contain them", ok:true }, { t:"exactly one plane" }, { t:"no plane at all" }, { t:"exactly two planes" }],
        explain:"`vec{AC} = (3, 6, 3) = 3vec{AB}`: the points are collinear." },
      { id:"p4", prompt:"Floor plane. Change `vec{r}_0` from `(0, 0, 0)` to `(2, 3, 0)`. What happens to the plane?",
        options:[{ t:"nothing: it’s the same plane", ok:true }, { t:"it shifts sideways" }, { t:"it tilts" }, { t:"it becomes a line" }],
        explain:"`(2, 3, 0)` is already on the floor. Any point of the plane can be `vec{r}_0`." }
    ],
    chalIntro:"Use the plane weaver to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"Mode 1 with `vec{r}_0 = (1, 2, 3)`, " + A + " `= (1, 0, 2)`, " + B + " `= (0, 1, -1)`. Move the point to `P(3, 1, 8)`.",
        why:"`s = 2` and `t = -1`: `(1, 2, 3) + 2(1, 0, 2) - (0, 1, -1) = (3, 1, 8)`.",
        hints:["`x = 1 + s` uses only `s`; `y = 2 + t` uses only `t`.", "`1 + s = 3` gives `s = 2`; `2 + t = 1` gives `t = -1`.", "Check `z`: `3 + 2(2) - (-1) = 8` ✓."],
        msgs:{ set:"First set mode 1 (Point + two directions) with `vec{r}_0 = (1, 2, 3)`, `vec{a} = (1, 0, 2)` and `vec{b} = (0, 1, -1)`.",
          swap:"You swapped `s` and `t`: `x` only depends on `s`.", tpos:"`y` is 3, not 1: `t` must be negative.",
          other:"The point is at {p}, not `(3, 1, 8)`." } },
      { id:"tc2", goal:4, prompt:"Mode 2 with `A(1, 0, 0)` and `B(0, 2, 0)`. Place C (whole numbers from −5 to 5, C ≠ A, B) so that A, B and C do <strong>not</strong> determine a unique plane.",
        why:"`vec{AC}` is a multiple of `vec{AB} = (-1, 2, 0)`: A, B and C are collinear.",
        hints:["Three points fail to fix a plane only when they’re collinear.", "`C = A + k vec{AB} = (1 - k, 2k, 0)`.", "`k = -1` gives `C(2, -2, 0)`."],
        msgs:{ set:"First set mode 2 (Three points) and keep `A(1, 0, 0)` and `B(0, 2, 0)`.", same:"C must be different from A and B.",
          floor:"C is on the same floor, but not on line AB, so A, B and C still fix exactly one plane (the floor).",
          off:"These three points aren’t collinear: they fix one plane." } },
      { id:"tc3", goal:5, stretch:true, prompt:"The plane is `vec{r} = (1, 0, 2) + s(1, 1, 0) + t(0, 1, 1)`. In mode 1, enter a <strong>different</strong> equation of the <strong>same</strong> plane: `vec{r}_0 ≠ (1, 0, 2)`, and neither direction a multiple of `(1, 1, 0)` or `(0, 1, 1)`. (Whole-number components from −4 to 4.)",
        why:"Your point is on the plane and both your directions lie along it without being parallel, so your equation describes the same plane.",
        hints:["Any point you can reach with some `s` and `t` can be the new `vec{r}_0`.", "Sums and differences of the old directions still lie along the plane.", "`vec{r}_0 = (1, 0, 2) + (1, 1, 0) = (2, 1, 2)`; `vec{a} = (1, 1, 0) + (0, 1, 1) = (1, 2, 1)`; `vec{b} = (1, 1, 0) - (0, 1, 1) = (1, 0, -1)`."],
        msgs:{ mode:"Switch to mode 1 (Point + two directions) first.", same:"Choose a different starting point.",
          r0:"That point isn’t on the plane: `x` and `y` give `s` = {s} and `t` = {t}, but then `z` = {z}, not {z0}.",
          dir:"{d} isn’t a combination of `(1, 1, 0)` and `(0, 1, 1)`, so it leaves the plane.",
          par:"Your two directions are parallel: that’s a line.",
          old:"{d} is a multiple of one of the old directions. Choose directions that aren’t multiples of `(1, 1, 0)` or `(0, 1, 1)`." } }
    ]
  },
  part3:{
    slug:"on-plane", name:"On the plane?",
    heading:"Is the point on the plane?",
    intro:"Explore built planes with sliders. Here you go the other way: given a point, find `s` and `t` by algebra, and see the result in 3D. Work through the three stations, then try the quick check.",
    stations:[
      { id:"s1", chip:"Station 1: solve two, check the third", title:"Station 1: solve two, check the third",
        text:"Plane `vec{r} = (2, -1, 1) + s(1, 2, 0) + t(0, 1, 3)`. Choose a test point. The 3D view shows the point the plane reaches with the `s` and `t` you solve for.",
        tests:[
          { id:"P", t:"Test `P(3, 3, 3)`", alg:["`x`: `2 + s = 3`, so `s = 1`.", "`y`: `-1 + 2s + t = 3`, so `-1 + 2 + t = 3` and `t = 2`.", "`z`: `1 + 3t = 1 + 6 = 7`, but P has `z = 3`. ✗"],
            verdict:"Not on the plane: `z` is off by 4." },
          { id:"Q", t:"Test `Q(4, 4, 4)`", alg:["`x`: `2 + s = 4`, so `s = 2`.", "`y`: `-1 + 4 + t = 4`, so `t = 1`.", "`z`: `1 + 3t = 1 + 3 = 4` ✓"],
            verdict:"On the plane: `s = 2`, `t = 1`." }
        ] },
      { id:"s2", chip:"Station 2: three points to an equation", title:"Station 2: three points to an equation",
        text:"`A(1, 2, 0)`, `B(3, 2, 1)` and `C(1, 4, -1)`. Use A as the starting point, then build the two directions from the points.",
        useA:"Use A as `vec{r}_0`", build:"Build the directions", check:"Check directions",
        ok:"✓ Correct: `vec{AB} = (2, 0, 1)` and `vec{AC} = (0, 2, -1)`.",
        eq:"`vec{r} = (1, 2, 0) + s(2, 0, 1) + t(0, 2, -1)`", par:"`x = 1 + 2s`, `y = 2 + 2t`, `z = s - t`",
        dq:"Is `D(5, 6, 0)` on this plane?", dbtn:"Test D",
        dalg:["`x`: `1 + 2s = 5`, so `s = 2`.", "`y`: `2 + 2t = 6`, so `t = 2`.", "`z`: `s - t = 2 - 2 = 0` ✓"],
        dverdict:"D is on the plane, so A, B, C and D are coplanar.",
        trap:"Use B and C as directions",
        trapNote:"Trap: this plane goes through A with directions `(3, 2, 1)` and `(1, 4, -1)`, the position vectors of B and C. It misses B and C. Position vectors point from the origin, not along the plane.",
        msgs:{ pos:"`(3, 2, 1)` points from the origin to B, not along the plane. Use `vec{AB} = B - A`.", posC:"`(1, 4, -1)` points from the origin to C, not along the plane. Use `vec{AC} = C - A`.",
          rev:"That’s `B - A` the wrong way round: end minus start.", other:"Subtract each coordinate of A from the matching coordinate of the end point." } },
      { id:"s3", chip:"Station 3: a line and a point", title:"Station 3: a line and a point",
        text:"Line `vec{r} = (0, 1, 2) + u(1, -1, 1)` and point `Q(2, 0, 5)`. The line gives a point P(0, 1, 2) and one direction; `vec{PQ}` gives the second direction.",
        pq:"`vec{PQ} = (2, -1, 3)` isn’t parallel to `(1, -1, 1)`, so the plane is `vec{r} = (0, 1, 2) + s(1, -1, 1) + t(2, -1, 3)`.",
        toggle:"Move Q onto the line",
        onLine:"Now `Q = (1, 0, 3)` and `vec{PQ} = (1, -1, 1)`, the line’s own direction.",
        banner:"Q is on the line: infinitely many planes." }
    ],
    quickCheck:{
      title:"Quick check", summary:"On the plane? quick check",
      items:[
        { id:"q1", goal:3, prompt:"Is `(3, 0, 4)` on `vec{r} = (1, 0, 0) + s(1, 0, 2) + t(0, 1, 0)`?",
          choices:[
            { t:"Yes: `s = 2`, `t = 0`", ok:true, fb:"Right. `x`: `1 + s = 3`, so `s = 2`; `y`: `t = 0`; `z`: `2s = 4` ✓." },
            { t:"No: `z` fails", fb:"`x`: `1 + s = 3`, so `s = 2`; `y`: `t = 0`; `z`: `2s = 4` ✓." },
            { t:"Yes: `s = 3`, `t = 0`", fb:"`x`: `1 + s = 3`, so `s = 2`; `y`: `t = 0`; `z`: `2s = 4` ✓." },
            { t:"Can’t tell without a graph", fb:"`x`: `1 + s = 3`, so `s = 2`; `y`: `t = 0`; `z`: `2s = 4` ✓." }] },
        { id:"q2", goal:4, prompt:"Which does NOT determine a unique plane?",
          choices:[
            { t:"Three collinear points", ok:true, fb:"Right. Collinear points sit on one line, and infinitely many planes contain a line." },
            { t:"A line and a point off it", fb:"Collinear points sit on one line, and infinitely many planes contain a line." },
            { t:"Two intersecting lines", fb:"Collinear points sit on one line, and infinitely many planes contain a line." },
            { t:"A point and two non-parallel directions", fb:"Collinear points sit on one line, and infinitely many planes contain a line." }] },
        { id:"q3", goal:2, prompt:"`A(0, 0, 1)`, `B(1, 2, 1)`, `C(2, 1, 3)`. Which directions work?",
          choices:[
            { t:"`vec{AB} = (1, 2, 0)` and `vec{AC} = (2, 1, 2)`", ok:true, fb:"Right. Both join points of the plane and they aren’t parallel." },
            { t:"`(1, 2, 1)` and `(2, 1, 3)`", fb:"Position vectors point from the origin, not along the plane. Use `vec{AB}` and `vec{AC}`." },
            { t:"`vec{AB}` and `vec{BA}`", fb:"`vec{AB}` and `vec{BA}` are parallel: they sweep only a line." },
            { t:"`vec{AB}` only", fb:"One direction gives a line. A plane needs two." }] },
        { id:"q4", goal:4, prompt:"`vec{r} = (1, 1, 1) + s(1, 0, 0) + t(2, 0, 0)` is …",
          choices:[
            { t:"a line", ok:true, fb:"Right. `(2, 0, 0) = 2(1, 0, 0)`: parallel directions." },
            { t:"a plane", fb:"`(2, 0, 0) = 2(1, 0, 0)`: parallel directions." },
            { t:"a point", fb:"`(2, 0, 0) = 2(1, 0, 0)`: parallel directions." },
            { t:"all of space", fb:"`(2, 0, 0) = 2(1, 0, 0)`: parallel directions." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"build", type:"custom", title:"Build the equation", summary:"Build the equation", goal:[2, 4],
        instruction:"Fill in the coefficients. Any correct equation of the plane is accepted.",
        how:"Type a whole number in every box (0 where a term is missing), then press Check.",
        msgs:{ empty:"Fill in every box with a number (type 0 where a term is missing).", zero:"A direction can’t be `vec{0}`.",
          par:M1, r0:"{p} isn’t on the plane.", dir:"{d} doesn’t lie along the plane." },
        items:[
          { id:"b1", goal:2, kind:"eq", form:"param", prompt:"Point `(2, 0, -1)`; directions `(1, 1, 0)` and `(0, 2, 3)`. Write the <strong>parametric equations</strong>.",
            answer:{ r0:[2, 0, -1], a:[1, 1, 0], b:[0, 2, 3] }, display:"`x = 2 + s`, `y = s + 2t`, `z = -1 + 3t`",
            wrong:[{ coef:[1, 1, 0], fb:"The `y`-component of `(1, 1, 0)` is 1, so `y` also gets `s`." }],
            hints:["Each row uses one component of the point and of each direction.", "`y`: 0 from the point, 1 from `(1, 1, 0)`, 2 from `(0, 2, 3)`.", "`x = 2 + s`, `y = s + 2t`, `z = -1 + 3t`."] },
          { id:"b2", goal:2, kind:"eq", form:"vec", prompt:"Points `A(1, 1, 1)`, `B(2, 3, 1)` and `C(0, 1, 4)`. Write a vector equation of the plane.",
            answer:{ r0:[1, 1, 1], a:[1, 2, 0], b:[-1, 0, 3] }, display:"`vec{r} = (1, 1, 1) + s(1, 2, 0) + t(-1, 0, 3)`",
            wrong:[{ dir:[2, 3, 1], fb:"`(2, 3, 1)` points from the origin to B, not along the plane. Use `vec{AB} = B - A`." },
              { dir:[0, 1, 4], fb:"`(0, 1, 4)` points from the origin to C, not along the plane. Use `vec{AC} = C - A`." }],
            hints:["Use A as `vec{r}_0`.", "`vec{AB} = B - A` and `vec{AC} = C - A`.", "`vec{AB} = (1, 2, 0)`, `vec{AC} = (-1, 0, 3)`."] },
          { id:"b3", goal:2, kind:"eq", form:"vec", prompt:"Line `vec{r} = (3, 0, 1) + u(1, 2, -1)` and point `Q(1, 1, 1)`. Write a vector equation of the plane that contains both.",
            answer:{ r0:[3, 0, 1], a:[1, 2, -1], b:[-2, 1, 0] }, display:"`vec{r} = (3, 0, 1) + s(1, 2, -1) + t(-2, 1, 0)`",
            wrong:[{ dir:[1, 1, 1], fb:"Use `vec{PQ} = Q - P`, not Q’s position vector." }],
            hints:["The line gives a point P(3, 0, 1) and one direction.", "The second direction is `vec{PQ} = Q - P`.", "`vec{PQ} = (-2, 1, 0)`."] },
          { id:"b4", goal:4, kind:"eq", form:"vec", prompt:"Parallel lines `vec{r} = (1, 0, 0) + u(1, 1, 1)` and `vec{r} = (0, 2, 1) + v(1, 1, 1)`. Write a vector equation of the plane that contains both.",
            answer:{ r0:[1, 0, 0], a:[1, 1, 1], b:[-1, 2, 1] }, display:"`vec{r} = (1, 0, 0) + s(1, 1, 1) + t(-1, 2, 1)`",
            wrong:[{ par:true, fb:"The lines share a direction. The second direction joins a point on one line to a point on the other." }],
            hints:["Two parallel lines share a direction; that’s one direction for the plane.", "Join `(1, 0, 0)` to `(0, 2, 1)`.", "`(-1, 2, 1)` and `(1, 1, 1)`: not parallel."] },
          { id:"b5", goal:2, kind:"eq", form:"vec", prompt:"Lines `vec{r} = (2, 1, 0) + u(1, 0, 1)` and `vec{r} = (2, 1, 0) + v(0, 1, -2)`. Write a vector equation of the plane that contains both.",
            answer:{ r0:[2, 1, 0], a:[1, 0, 1], b:[0, 1, -2] }, display:"`vec{r} = (2, 1, 0) + s(1, 0, 1) + t(0, 1, -2)`",
            wrong:[{ r0off:true, fb:"The lines meet at `(2, 1, 0)`: use it as `vec{r}_0` and both directions." }],
            hints:["Where do the two lines meet?", "Both pass through `(2, 1, 0)`.", "Use `(2, 1, 0)` with the directions `(1, 0, 1)` and `(0, 1, -2)`."] },
          { id:"b6", goal:2, star:true, kind:"eq", form:"vec", prompt:"`x = 1 - s + 2t`, `y = 3 + s`, `z = 2t`. Write these in vector form.",
            answer:{ r0:[1, 3, 0], a:[-1, 1, 0], b:[2, 0, 2] }, display:"`vec{r} = (1, 3, 0) + s(-1, 1, 0) + t(2, 0, 2)`",
            wrong:[{ r0:[1, 3, 2], fb:"`z = 2t` has no constant term, so `z_0 = 0`." }],
            hints:["Collect the constants, the `s` terms and the `t` terms.", "Constants `(1, 3, 0)`; `s`-coefficients `(-1, 1, 0)`.", "`t`-coefficients `(2, 0, 2)`."] }
        ] },
      { id:"puzzles", type:"custom", title:"Plane puzzles", summary:"Plane puzzles", star:true, goal:[3, 4, 6],
        instruction:"Solve each puzzle. Puzzles 3 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type a number (or choose an answer), then press Check.",
        msgs:{ empty:"Type your answer first.", err:"Type a number, such as 4 or −2.", vempty:"Fill in all three boxes." },
        items:[
          { id:"n1", goal:3, kind:"num", prompt:"Find `k` so that `P(k, 2, 5)` lies on `vec{r} = (1, 0, 1) + s(1, 1, 0) + t(1, 0, 2)`.", label:"`k =`", answer:5, display:"`k = 5`",
            wrong:[{ v:3, fb:"`y = s = 2` and `z = 1 + 2t = 5` give `t = 2`; `x = 1 + s + t = 5`." }],
            wrongDefault:"Find `s` from `y` and `t` from `z`, then work out `x`.",
            why:"`s = 2`, `t = 2`, so `x = 1 + 2 + 2 = 5`.",
            hints:["`y` uses only `s`; `z` uses only `t`.", "`s = 2`; `1 + 2t = 5` gives `t = 2`.", "`x = 1 + 2 + 2 = 5`."] },
          { id:"n2", goal:4, kind:"num", prompt:"Find `k` so that `A(1, 0, 2)`, `B(2, 1, 3)` and `C(4, k, 5)` do <strong>not</strong> determine a unique plane.", label:"`k =`", answer:3, display:"`k = 3`",
            wrong:[{ v:4, fb:"`vec{AC} = (3, k, 3)` must be `3vec{AB} = (3, 3, 3)`." }],
            wrongDefault:"The points must be collinear: `vec{AC}` must be a multiple of `vec{AB}`.",
            why:"`vec{AB} = (1, 1, 1)` and `vec{AC} = (3, k, 3) = 3vec{AB}` when `k = 3`.",
            hints:["No unique plane means the points are collinear.", "`vec{AB} = (1, 1, 1)`, `vec{AC} = (3, k, 3)`.", "`vec{AC} = 3vec{AB}` needs `k = 3`."] },
          { id:"n3", goal:6, star:true, kind:"num", prompt:"Find `k` so that `O(0, 0, 0)`, `B(1, 0, 1)`, `C(0, 1, 1)` and `D(2, 3, k)` are coplanar.", label:"`k =`", answer:5, display:"`k = 5`",
            wrong:[{ v:1, fb:"`D = s(1, 0, 1) + t(0, 1, 1)` needs `s = 2`, `t = 3`, so `z = 5`." }],
            wrongDefault:"`D = s(1, 0, 1) + t(0, 1, 1)`: find `s` and `t` from `x` and `y`.",
            why:"`s = 2`, `t = 3`, so `k = s + t = 5`.",
            hints:["The plane through O, B and C is `vec{r} = s(1, 0, 1) + t(0, 1, 1)`.", "`x = s = 2`, `y = t = 3`.", "`z = s + t = 5`."] },
          { id:"n4", goal:6, star:true, kind:"num", prompt:"Where does `vec{r} = (1, 1, 1) + s(1, 0, 1) + t(0, 1, 2)` meet the `z`-axis? Enter the `z`-coordinate.", label:"`z =`", answer:-2, display:"`z = -2`",
            wrong:[{ v:1, fb:"On the `z`-axis `x = y = 0`: `s = -1`, `t = -1`, so `z = 1 - 1 - 2 = -2`." }],
            wrongDefault:"On the `z`-axis `x = 0` and `y = 0`. Solve for `s` and `t` first.",
            why:"`x = 1 + s = 0` and `y = 1 + t = 0` give `s = t = -1`, so `z = 1 - 1 - 2 = -2`.",
            hints:["On the `z`-axis, `x = 0` and `y = 0`.", "`1 + s = 0` and `1 + t = 0`.", "`z = 1 + s + 2t = -2`."] },
          { id:"n5", goal:4, star:true, kind:"chips", prompt:"Do the lines `vec{r} = (1, 0, 0) + u(1, 1, 0)` and `vec{r} = (0, 0, 2) + v(0, 1, 1)` lie in one plane?",
            options:[
              { t:"No, they’re skew", ok:true, why:"Not parallel; `x` gives `u = -1`, `y` gives `v = -1`, then `z`: 0 vs 1. They never meet, so no plane contains both." },
              { t:"Yes, they intersect", why:"Not parallel; `x` gives `u = -1`, `y` gives `v = -1`, then `z`: 0 vs 1. They never meet." },
              { t:"Yes, they’re parallel", why:"`(1, 1, 0)` and `(0, 1, 1)` aren’t multiples, so the lines aren’t parallel." },
              { t:"Only if they’re perpendicular", why:"Lines lie in one plane if they intersect or are parallel; the angle doesn’t matter." }],
            why:"Not parallel, and they never meet: skew lines lie in no common plane.",
            hints:["Lines lie in one plane if they intersect or are parallel.", "Set `(1 + u, u, 0) = (0, v, 2 + v)`.", "`u = -1`, `v = -1`, but 0 ≠ 1: skew."] },
          { id:"n6", goal:4, star:true, kind:"vec", prompt:"Give a direction `vec{b}` so that `vec{r} = s(1, 0, 2) + t vec{b}` is the `xz`-plane. (Any valid answer; whole numbers from −4 to 4.)", label:"`vec{b} =`",
            answer:{ n:[0, 1, 0], not:[1, 0, 2] }, display:"any `(p, 0, q)` with `q ≠ 2p`, such as `(0, 0, 1)` or `(1, 0, 0)`",
            msgs:{ zero:"A direction can’t be `vec{0}`.", par:"Parallel to `(1, 0, 2)`: only a line.", off:"That leaves the `xz`-plane (`y` must stay 0).", range:"Use whole numbers from −4 to 4." },
            why:"Your direction has `y = 0` and isn’t a multiple of `(1, 0, 2)`, so together they span the `xz`-plane.",
            hints:["Every point of the `xz`-plane has `y = 0`.", "So `vec{b}` needs a 0 in the middle.", "And it mustn’t be a multiple of `(1, 0, 2)`: `(0, 0, 1)` works."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Benjamin", how:"", goal:[2, 3, 4],
        instruction:"Benjamin made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Find a vector equation of the plane through `A(1, 2, 3)`, `B(2, 0, 4)` and `C(3, 3, 1)`.",
            steps:["Use A as the point: `vec{r}_0 = (1, 2, 3)`.", "Directions: `(2, 0, 4)` and `(3, 3, 1)`.", "`vec{r} = (1, 2, 3) + s(2, 0, 4) + t(3, 3, 1)`."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2. The mistake is earlier."],
            fixes:[
              { t:"Use `vec{AB} = (1, -2, 1)` and `vec{AC} = (2, 1, -2)`.", ok:true, why:"Directions must join points of the plane: B − A and C − A." },
              { t:"Use `vec{r}_0 = (0, 0, 0)` instead.", why:"The plane needn’t pass through the origin." },
              { t:"Use `vec{AB}` and `vec{BA}`.", why:"Those are parallel: they sweep only a line." },
              { t:"Step 2 is correct.", why:"Position vectors point from the origin. Check: no `s` and `t` give B on Benjamin’s plane." }],
            hints:["Does Benjamin’s plane pass through B?", "Directions must join points of the plane.", "`vec{AB} = (1, -2, 1)`, `vec{AC} = (2, 1, -2)`."] },
          { id:"e2", goal:3, task:"Is `P(4, 1, 8)` on the plane `vec{r} = (1, 1, 1) + s(1, 0, 2) + t(1, 1, 1)`?",
            steps:["`x`: `1 + s + t = 4`.", "`y`: `1 + t = 1`, so `t = 0`.", "From `x`: `s = 3`.", "`s` and `t` exist, so P is on the plane."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct. Keep checking.", ""],
            fixes:[
              { t:"Check `z`: `1 + 2(3) + 0 = 7 ≠ 8`, so P is <strong>not</strong> on the plane.", ok:true, why:"The third equation decides: `z` would be 7, not 8." },
              { t:"Solve the `z`-equation first instead.", why:"Order doesn’t matter; all three must agree." },
              { t:"Use `t = 1`.", why:"`y` forces `t = 0`." },
              { t:"Step 4 is correct.", why:M4 }],
            hints:["How many equations has Benjamin used?", "Two. What does the third say?", "`z = 7`, not 8."] },
          { id:"e3", goal:4, task:"Find a vector equation of the plane containing the line `vec{r} = (2, 0, 1) + u(1, 3, -1)` and the point `Q(3, 3, 0)`.",
            steps:["A point on the line: `P(2, 0, 1)`.", "Second direction: `vec{PQ} = (1, 3, -1)`.", "Plane: `vec{r} = (2, 0, 1) + s(1, 3, -1) + t(1, 3, -1)`."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2’s arithmetic is right. Look at what it tells you.", ""],
            fixes:[
              { t:"`vec{PQ}` equals the line’s direction, so Q is <strong>on</strong> the line: a line and a point on it don’t fix one plane (infinitely many planes contain them).", ok:true, why:"Two parallel directions sweep only a line, so there’s no unique plane." },
              { t:"Use `t(3, 3, 0)`, Q’s position vector.", why:"That gives one plane of infinitely many, chosen by accident." },
              { t:"Change `t` to `-t`.", why:"Still parallel." },
              { t:"Step 3 is correct.", why:"Two parallel directions sweep only a line." }],
            hints:["Compare `vec{PQ}` with `(1, 3, -1)`.", "They’re equal, so `Q = P + 1(1, 3, -1)`.", "Q lies on the line: no unique plane."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the plane weaver: the collapse to a line, or that swapping the directions didn’t move the plane?" },
      { id:"j2", q:"In your own words, why does a plane need two non-parallel directions, while a line needs only one?" },
      { id:"j3", q:"Explain to a friend how to decide whether a point is on a plane given in vector form." },
      { id:"j4", q:"Which part still trips you up (directions from points, the third-equation check, recognizing the same plane)? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"For the plane `vec{r} = (2, -1, 4) + s(1, 0, 3) + t(2, 5, -1)`, which statement is true?", options:[
          { t:"`(2, -1, 4)` is a point on the plane, and `(1, 0, 3)` and `(2, 5, -1)` are directions along it.", ok:true, why:"`vec{r}_0` is a point; the vectors multiplied by `s` and `t` are directions." },
          { t:"`(1, 0, 3)` is a point on the plane.", why:"It’s a direction; no `s` and `t` reach the point `(1, 0, 3)`." },
          { t:"The parameters `s` and `t` must be equal.", why:"They vary independently; equal values give only a line." },
          { t:"The plane passes through the origin.", why:"It passes through `(2, -1, 4)`; the origin isn’t reachable here." }] },
        b:{ prompt:"For the plane `vec{r} = (0, 3, -2) + s(4, 1, 0) + t(1, -1, 2)`, which statement is true?", options:[
          { t:"`(0, 3, -2)` is a point on the plane, and `(4, 1, 0)` and `(1, -1, 2)` are directions along it.", ok:true, why:"`vec{r}_0` is a point; the vectors multiplied by `s` and `t` are directions." },
          { t:"`(4, 1, 0)` is a point on the plane.", why:"It’s a direction; no `s` and `t` reach the point `(4, 1, 0)`." },
          { t:"The parameters `s` and `t` must be equal.", why:"They vary independently; equal values give only a line." },
          { t:"The plane passes through the origin.", why:"It passes through `(0, 3, -2)`; the origin isn’t reachable here." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Parametric equations of the plane through `(1, 0, -2)` with directions `(2, 1, 0)` and `(-1, 3, 1)`?", options:[
          { t:"`x = 1 + 2s - t`, `y = s + 3t`, `z = -2 + t`", ok:true, why:"Each row uses one component of the point and of each direction." },
          { t:"`x = 1 + s`, `y = 4s`, `z = -2 + s`", why:"That uses one parameter with `(2, 1, 0) + (-1, 3, 1)`: a line." },
          { t:"`x = 1 + 2s - t`, `y = s + 3t`, `z = -2 + s`", why:"The `z`-components are 0 and 1, so `z = -2 + t`." },
          { t:"`x = 1 + 2s + t`, `y = s + 3t`, `z = -2 + t`", why:"The `x`-component of the second direction is −1." }] },
        b:{ prompt:"Parametric equations of the plane through `(0, 2, 3)` with directions `(1, -1, 2)` and `(3, 0, 1)`?", options:[
          { t:"`x = s + 3t`, `y = 2 - s`, `z = 3 + 2s + t`", ok:true, why:"Each row uses one component of the point and of each direction." },
          { t:"`x = 4s`, `y = 2 - s`, `z = 3 + 3s`", why:"That uses one parameter with `(1, -1, 2) + (3, 0, 1)`: a line." },
          { t:"`x = s + 3t`, `y = 2 - s`, `z = 3 + s + 2t`", why:"The `z`-components are 2 and 1, so `z = 3 + 2s + t`." },
          { t:"`x = s + 3t`, `y = 2 + s`, `z = 3 + 2s + t`", why:"The `y`-component of the first direction is −1, so `y = 2 - s`." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Which information determines exactly one plane?", options:[
          { t:"The points `A(1, 0, 0)`, `B(0, 1, 0)` and `C(0, 0, 1)`", ok:true, why:"`vec{AB} = (-1, 1, 0)` and `vec{AC} = (-1, 0, 1)` aren’t parallel." },
          { t:"The points `(1, 1, 1)`, `(2, 3, 4)` and `(3, 5, 7)`", why:"`vec{AC} = 2vec{AB}`: collinear." },
          { t:"The point `(1, 2, 3)` with directions `(1, -2, 4)` and `(-2, 4, -8)`", why:"Parallel directions." },
          { t:"The line `vec{r} = t(1, 1, 1)` and the point `(2, 2, 2)`", why:"`(2, 2, 2)` is on the line (`t = 2`)." }] },
        b:{ prompt:"Which information determines exactly one plane?", options:[
          { t:"The line `vec{r} = (1, 0, 2) + t(2, 1, 0)` and the point `(1, 1, 1)`", ok:true, why:"`(0, 1, -1)` isn’t parallel to `(2, 1, 0)`." },
          { t:"The points `(0, 1, 2)`, `(1, 3, 3)` and `(3, 7, 5)`", why:"`vec{AC} = 3vec{AB}`: collinear." },
          { t:"The point `(0, 0, 0)` with directions `(3, 0, -6)` and `(-1, 0, 2)`", why:"Parallel directions." },
          { t:"The line `vec{r} = (2, 0, 1) + t(1, 1, 1)` and the point `(4, 2, 3)`", why:"That point is on the line (`t = 2`)." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Is `P(5, 3, 2)` on the plane `vec{r} = (1, 1, 0) + s(2, 0, 1) + t(0, 1, 1)`?", options:[
          { t:"No: `s = 2` and `t = 2` give `z = 4`, not 2.", ok:true, why:"`x` gives `s = 2`, `y` gives `t = 2`, and the third equation fails." },
          { t:"Yes: `s = 2` and `t = 2` satisfy the `x`- and `y`-equations.", why:M4 },
          { t:"Yes: `s = 2` and `t = 0`.", why:"That fits `x` and `z`, but then `y = 1`, not 3." },
          { t:"No: P isn’t a multiple of either direction.", why:"Points of the plane are `vec{r}_0` plus combinations, not multiples of a direction." }] },
        b:{ prompt:"Is `P(3, 4, 6)` on the plane `vec{r} = (1, 0, 2) + s(1, 2, 0) + t(0, 1, 2)`?", options:[
          { t:"No: `s = 2` and `t = 0` give `z = 2`, not 6.", ok:true, why:"`x` gives `s = 2`, `y` gives `t = 0`, and the third equation fails." },
          { t:"Yes: `s = 2` and `t = 0` satisfy the `x`- and `y`-equations.", why:M4 },
          { t:"Yes: `s = 2` and `t = 2`.", why:"That fits `x` and `z`, but then `y = 6`, not 4." },
          { t:"No: P isn’t a multiple of either direction.", why:"Points of the plane are `vec{r}_0` plus combinations, not multiples of a direction." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"For which `k` do `A(2, 1, 0)`, `B(3, 3, 1)` and `C(5, k, 3)` fail to determine a unique plane?", options:[
          { t:"`k = 7`", ok:true, why:"`vec{AB} = (1, 2, 1)`; `vec{AC} = (3, k - 1, 3)` must be `3vec{AB}`, so `k - 1 = 6`." },
          { t:"`k = 6`", why:"That forgets to subtract A’s `y`-coordinate: `vec{AC}` has `k - 1`." },
          { t:"`k = 5`", why:"That subtracts A’s `y` instead of adding it back: `k = 6 + 1`." },
          { t:"No value of `k`: three different points always determine a plane.", why:M1 }] },
        b:{ prompt:"For which `k` do `A(1, 2, 3)`, `B(2, 4, 2)` and `C(4, k, 0)` fail to determine a unique plane?", options:[
          { t:"`k = 8`", ok:true, why:"`vec{AB} = (1, 2, -1)`; `vec{AC} = (3, k - 2, -3) = 3vec{AB}` gives `k - 2 = 6`." },
          { t:"`k = 6`", why:"Forgets to subtract A’s `y`-coordinate." },
          { t:"`k = 4`", why:"Subtracts A’s `y` instead of adding it back." },
          { t:"No value of `k`.", why:"Collinear points don’t determine a unique plane, and `k = 8` makes them collinear." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Which equation describes the same plane as `vec{r} = (0, 0, 1) + s(1, 0, 1) + t(0, 1, 1)`?", options:[
          { t:"`vec{r} = (1, 1, 3) + s(1, 1, 2) + t(1, -1, 0)`", ok:true, why:"`(1, 1, 3) = (0, 0, 1) + (1, 0, 1) + (0, 1, 1)`; the new directions are the sum and difference of the old ones." },
          { t:"`vec{r} = (1, 1, 1) + s(1, 0, 1) + t(0, 1, 1)`", why:"Same directions, but `(1, 1, 1)` isn’t on the plane: this is a parallel plane." },
          { t:"`vec{r} = (0, 0, 1) + s(1, 0, 1) + t(2, 0, 2)`", why:"Parallel directions: a line." },
          { t:"`vec{r} = (0, 0, 1) + s(1, 1, 1) + t(0, 1, 1)`", why:"Same point, but `(1, 1, 1)` isn’t a combination of the old directions: a different plane through that point." }] },
        b:{ prompt:"Which equation describes the same plane as `vec{r} = (1, 0, 0) + s(1, 1, 0) + t(0, 1, 2)`?", options:[
          { t:"`vec{r} = (2, 2, 2) + s(1, 2, 2) + t(1, 0, -2)`", ok:true, why:"`(2, 2, 2) = (1, 0, 0) + (1, 1, 0) + (0, 1, 2)`; the new directions are the sum and difference of the old ones." },
          { t:"`vec{r} = (0, 0, 1) + s(1, 1, 0) + t(0, 1, 2)`", why:"Same directions, but `(0, 0, 1)` isn’t on the plane: this is a parallel plane." },
          { t:"`vec{r} = (1, 0, 0) + s(1, 1, 0) + t(-2, -2, 0)`", why:"Parallel directions: a line." },
          { t:"`vec{r} = (1, 0, 0) + s(1, 1, 0) + t(1, 0, 1)`", why:"Same point, but `(1, 0, 1)` isn’t a combination of the old directions: a different plane through that point." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which is the best explanation of why `vec{r} = (1, 2, 3) + s(2, -1, 4) + t(-4, 2, -8)` is not a plane?", options:[
          { t:"“`(-4, 2, -8) = -2(2, -1, 4)`, so both directions point along one line. Every point is `(1, 2, 3) + (s - 2t)(2, -1, 4)`, which is a line.”", ok:true, why:"It names the parallel directions and shows the single combined parameter." },
          { t:"“The second direction has negative components.”", why:"Negative components are fine." },
          { t:"“A plane in three dimensions needs three direction vectors.”", why:"Two non-parallel directions are enough." },
          { t:"“It is a plane: any two direction vectors make one.”", why:M1 }] },
        b:{ prompt:"Which is the best explanation of why `vec{r} = (0, 1, -1) + s(3, 0, -6) + t(-1, 0, 2)` is not a plane?", options:[
          { t:"“`(3, 0, -6) = -3(-1, 0, 2)`, so both directions point along one line. Every point is `(0, 1, -1) + (t - 3s)(-1, 0, 2)`, which is a line.”", ok:true, why:"It names the parallel directions and shows the single combined parameter." },
          { t:"“A direction with a 0 component can’t be used.”", why:"Zeros are fine." },
          { t:"“A plane in three dimensions needs three direction vectors.”", why:"Two non-parallel directions are enough." },
          { t:"“It is a plane: any two direction vectors make one.”", why:M1 }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Two students wrote `vec{r} = (1, 0, 2) + s(1, 1, 0) + t(0, 1, 1)` and `vec{r} = (2, 2, 3) + s(1, 2, 1) + t(1, 0, -1)`. Which is the best justification that these are the same plane?", options:[
          { t:"“`(2, 2, 3)` is on the first plane (`s = 1`, `t = 1`), and `(1, 2, 1)` and `(1, 0, -1)` are the sum and difference of the first plane’s directions, so they lie along it and aren’t parallel.”", ok:true, why:"It checks both things: a shared point and two non-parallel directions along the plane." },
          { t:"“The equations look different, so the planes are different.”", why:M3 },
          { t:"“Both have two direction vectors, so they’re the same plane.”", why:"Every plane has two; that proves nothing." },
          { t:"“`(2, 2, 3)` is on the first plane, so the planes are the same.”", why:"A shared point isn’t enough: parallel directions are needed too." }] },
        b:{ prompt:"Two students wrote `vec{r} = (0, 1, 1) + s(2, 0, 1) + t(0, 1, -1)` and `vec{r} = (2, 1, 2) + s(2, 1, 0) + t(2, -1, 2)`. Which is the best justification that these are the same plane?", options:[
          { t:"“`(2, 1, 2)` is on the first plane (`s = 1`, `t = 0`), and `(2, 1, 0)` and `(2, -1, 2)` are the sum and difference of the first plane’s directions, so they lie along it and aren’t parallel.”", ok:true, why:"It checks both things: a shared point and two non-parallel directions along the plane." },
          { t:"“The equations look different, so the planes are different.”", why:M3 },
          { t:"“Both have two direction vectors, so they’re the same plane.”", why:"Every plane has two; that proves nothing." },
          { t:"“`(2, 1, 2)` is on the first plane, so the planes are the same.”", why:"A shared point isn’t enough: parallel directions are needed too." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A solar panel frame has corners `A(0, 0, 2)`, `B(4, 0, 2)`, `C(4, 3, 4)` and `D(0, 3, k)`, in metres. For which `k` is the panel flat (all four corners coplanar)?", options:[
          { t:"`k = 4`", ok:true, why:"`vec{AB} = (4, 0, 0)`, `vec{AC} = (4, 3, 2)`; `D - A = (0, 3, k - 2) = -vec{AB} + vec{AC}` needs `k - 2 = 2`." },
          { t:"`k = 2`", why:"That copies A’s height; the frame rises 2 m from A to C." },
          { t:"`k = 6`", why:"That adds the rise twice." },
          { t:"Any `k`: four points always lie in a plane.", why:"Three points fix a plane; a fourth must be checked." }] },
        b:{ prompt:"Corners `A(1, 0, 0)`, `B(1, 4, 0)`, `C(-2, 4, 3)` and `D(-2, 0, k)`, in metres. For which `k` are they coplanar?", options:[
          { t:"`k = 3`", ok:true, why:"`vec{AB} = (0, 4, 0)`, `vec{AC} = (-3, 4, 3)`; `D - A = (-3, 0, k) = -vec{AB} + vec{AC}` needs `k = 3`." },
          { t:"`k = 0`", why:"Copies A’s height; the frame rises 3 m from A to C." },
          { t:"`k = 6`", why:"Adds the rise twice." },
          { t:"Any `k`.", why:"Three points fix a plane; a fourth must be checked." }] } },
      { id:"a2", cat:"A", goal:[3, 6],
        a:{ prompt:"A drone flies in a sloped flight corridor modelled by the plane `vec{r} = (0, 0, 10) + s(1, 0, 0) + t(0, 2, 1)`, in metres. How high is it when it’s above the ground point `(5, 8)`?", options:[
          { t:"14 m", ok:true, why:"`x = s = 5`; `y = 2t = 8` gives `t = 4`; `z = 10 + t = 14`." },
          { t:"18 m", why:"That uses `t = 8`: the `y`-component of the direction is 2, so `t = 4`." },
          { t:"15 m", why:"That puts `s` into `z`; the first direction has `z`-component 0." },
          { t:"10 m", why:"The corridor isn’t horizontal: it rises 1 m for every `t`." }] },
        b:{ prompt:"A corridor is modelled by `vec{r} = (0, 0, 20) + s(1, 0, -1) + t(0, 3, 0)`, in metres. How high is the drone above the ground point `(4, 6)`?", options:[
          { t:"16 m", ok:true, why:"`s = 4`, `t = 2`, `z = 20 - 4 = 16`." },
          { t:"24 m", why:"The `z`-component of `(1, 0, -1)` is −1." },
          { t:"18 m", why:"`t`’s direction has `z`-component 0." },
          { t:"20 m", why:"The corridor slopes down 1 m per unit of `s`." }] } }
    ]
  },
  task:{
    title:"Roof designer", summary:"Roof designer",
    statement:"<p>A roof’s ridge runs from `R_1(0, 0, 4)` to `R_2(6, 0, 4)`, and the roof slopes down to the eave point `E(0, 2, 2)`. Write a vector equation `vec{r} = vec{r}_0 + s vec{a} + t vec{b}` for the roof plane that meets every condition. There’s more than one answer.</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>It’s a genuine plane (the directions aren’t parallel).</li><li>It contains the ridge points `R_1` and `R_2`.</li><li>It contains the eave point E.</li><li>Neither direction runs along the ridge (not parallel to `(1, 0, 0)`).</li><li>`vec{r}_0` isn’t one of `R_1`, `R_2` or E.</li></ol></div>",
    checks:["A genuine plane", "Contains the ridge", "Contains the eave point", "No direction along the ridge", "A new starting point"],
    tips:["Your directions are parallel, so the equation sweeps only a line. Pick a `vec{b}` that isn’t a multiple of `vec{a}`.",
      "Your plane misses `R_1` or `R_2`. Both are on the roof, so `R_2 - R_1 = (6, 0, 0)` runs along the roof.",
      "Your plane misses E. `vec{ER_1} = (0, -2, 2)` also runs along the roof.",
      "`(1, 0, 0)` is along the roof but not allowed here: combine it with `(0, -1, 1)`, e.g. `(1, -1, 1)`.",
      "Start from another roof point: any point you can reach with `s` and `t` works."],
    explainPrompt:"Explain how you know your plane contains `R_1`, `R_2` and E, and why your two directions give a plane.",
    vocab:"Use the words direction vector, parallel, parameter and point on the plane.",
    more:"There’s more than one answer. Can you find another?",
    after3:"Every roof point has `y + z = 4`, and every roof direction has `y + z = 0`. That’s the plane’s scalar equation, coming in module 52."
  },
  cards:[
    ["Vector equation of a plane", "`vec{r} = vec{r}_0 + s vec{a} + t vec{b}`, `s, t ∈ ℝ`: a point and two non-parallel directions."],
    ["Parametric equations", "`x = x_0 + s a_1 + t b_1`, `y = y_0 + s a_2 + t b_2`, `z = z_0 + s a_3 + t b_3`."],
    ["Parallel directions", "Give only a line, never a plane."],
    ["Three points A, B, C", "`vec{r} = vec{OA} + s vec{AB} + t vec{AC}`, if they aren’t collinear."],
    ["Collinear points", "Lie on one line: infinitely many planes contain them."],
    ["Line + point", "Use the line’s point and direction, plus `vec{PQ}`. Fails if Q is on the line."],
    ["Point on the plane?", "Solve two equations for `s` and `t`, then check the third."],
    ["Many equations, one plane", "Any point of the plane, any two non-parallel in-plane directions."],
    ["Sum in a plane", "The sum of two vectors along a plane also lies along the plane."],
    ["Two parameters", "One parameter gives a line; a plane needs two."],
    ["Coplanar points", "Four points are coplanar if the fourth lies on the plane of the other three."],
    ["Skew lines", "Not parallel and never meet: no plane contains both."]
  ]
};
