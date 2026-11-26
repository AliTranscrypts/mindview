// MCV4U 53 Intersection of Lines with Planes. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/53-intersection-of-lines-with-planes.md
// misconception core sentences (plan §3)
const M1 = "`t = 2` is a parameter value. Substitute it into the line to get the point.";
const M2 = "No value of `t` makes `0t = 5` true, so there’s no intersection. `0t = 0` is true for <strong>every</strong> `t`.";
const M3 = "`vec{m} · vec{n} = 0` means `vec{m}` is perpendicular to the <strong>normal</strong>, so the line runs <strong>along</strong> the plane’s direction: parallel.";
const M4 = "Parallel lines can also lie <strong>in</strong> the plane. Test a point of the line.";
const M5 = "The line is `vec{r}_0 + t vec{m}`: include `vec{r}_0` when you substitute and when you find the point.";
const M6 = "Substitution gives a linear equation in `t`: one solution, none, or all of them.";
const tOnly = (t) => "`t = " + t + "` is a parameter value. Substitute it into the line to get the point.";

export default {
  id:"53-intersection-of-lines-with-planes",
  kind:"topic",
  title:"Intersection of lines with planes",
  topic:"Intersection of Lines with Planes",
  readyTopic:"intersections of lines with planes",
  hero:{
    eq:"`(@c{vec{n}} · vec{r}_0 + D) + (@c{vec{n}} · @n{vec{m}}) t = 0`",
    eqLabel:"n dot r zero plus D, plus n dot m times t, equals 0",
    eqSize:"md",
    headline:"One equation, three possible endings",
    text:"Put the line’s <strong>parametric equations</strong> into the plane’s <strong>scalar equation</strong> and you get one linear equation in `t`. If it has one solution, the line pierces the plane at one <strong>point of intersection</strong>. If it reads `0t = 5`, the line is <strong>parallel</strong> and never touches. If it reads `0t = 0`, the whole line <strong>lies in the plane</strong>.",
    fig:{ html:'<div class="lp-hero" id="lp-hero"></div>' }
  },
  goals:[
    "I can find the point where a line meets a plane by substituting the line’s parametric equations into the plane’s scalar equation.",
    "I can interpret `0t = c` (no intersection) and `0t = 0` (the line lies in the plane).",
    "I can use `vec{m} · vec{n}` and a point test to predict how a line and a plane meet.",
    "I can work with lines and planes given in any form (vector, parametric, symmetric, scalar).",
    "I can solve problems with line–plane intersections (a beam hitting a surface, the foot of a perpendicular)."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Lines in R³", goal:1, prompt:"Parametric equations of `vec{r} = (2, -1, 0) + t(1, 3, -2)`?",
          options:[
            { t:"`x = 2 + t`, `y = -1 + 3t`, `z = -2t`", ok:true, why:"Point plus `t` times direction, component by component." },
            { t:"`x = 1 + 2t`, `y = 3 - t`, `z = -2`", why:"`(2, -1, 0)` is the point; `(1, 3, -2)` multiplies `t`." },
            { t:"`x = 2t`, `y = -t`, `z = 0`", why:"The direction gets the `t`." },
            { t:"`x = 2 + t`, `y = -1 + 3t`, `z = -2`", why:"`z = 0 + (-2)t`." }],
          hints:["`x = x_0 + t m_1`, and so on.", "`x = 2 + t`.", "`z = 0 - 2t`."] },
        { id:"w2", skill:"Normals", goal:3, prompt:"A normal to `3x - y + 4z = 2`?",
          options:[
            { t:"`(3, -1, 4)`", ok:true, why:"The coefficients of `x`, `y`, `z`." },
            { t:"`(3, -1, 2)`", why:"2 isn’t the `z`-coefficient." },
            { t:"`(3, 1, 4)`", why:"The `y`-coefficient is −1." },
            { t:"`(1, 3, 0)`", why:"That lies along the plane." }],
          hints:["Read the coefficients.", "`A = 3`, `B = -1`, `C = 4`.", "`(3, -1, 4)`."] },
        { id:"w3", skill:"Solving for `t`", goal:1, prompt:"Solve `2(1 + t) + 3(2 - t) - t = 4`.",
          options:[
            { t:"`t = 2`", ok:true, why:"`8 - 2t = 4`." },
            { t:"`t = -2`", why:"`-2t = -4`." },
            { t:"`t = 6`", why:"`-2t = 4 - 8`." },
            { t:"`t = 1/2`", why:"`-2t = -4`, so `t = 2`." }],
          hints:["Expand and collect.", "`2 + 2t + 6 - 3t - t = 8 - 2t`.", "`t = 2`."] },
        { id:"w4", skill:"Solving for `t`", goal:2, prompt:"Solve `3(2 + t) - 3t = 6`.",
          options:[
            { t:"Every value of `t` works", ok:true, why:"`6 = 6`, true for all `t`." },
            { t:"`t = 0`", why:"Any `t` works, not just 0." },
            { t:"No value of `t`", why:"`6 = 6` is true." },
            { t:"`t = 6`", why:"The `t`-terms cancel." }],
          hints:["Expand.", "`6 + 3t - 3t = 6`.", "`0t = 0`: true for every `t`."] },
        { id:"w5", skill:"Solving for `t`", goal:2, prompt:"Solve `2(1 + t) - 2t = 5`.",
          options:[
            { t:"No value of `t` works", ok:true, why:"`2 = 5` is false." },
            { t:"`t = 0`", why:"`0t = 3` has no solution." },
            { t:"`t = 3`", why:"`0 × 3 = 0`, not 3." },
            { t:"Every value of `t`", why:"That’s `0t = 0`." }],
          hints:["Expand.", "`2 + 2t - 2t = 2`.", "`2 = 5` is impossible: no solution."] },
        { id:"w6", skill:"Dot product", goal:3, prompt:"Are `(1, 2, -1)` and `(3, -1, 1)` perpendicular?",
          options:[
            { t:"Yes: the dot product is 0", ok:true, why:"`3 - 2 - 1 = 0`." },
            { t:"No: the dot product is 6", why:"`3 + (-2) + (-1) = 0`." },
            { t:"No: they aren’t multiples of each other", why:"Multiples means parallel; perpendicular means dot product 0." },
            { t:"No: perpendicular vectors need a zero component", why:"`(1, 2, -1) · (3, -1, 1) = 0` with no zeros." }],
          hints:["Compute `a_1 b_1 + a_2 b_2 + a_3 b_3`.", "`3 - 2 - 1`.", "0: perpendicular."] }
      ],
      refreshers:{
        "Lines in R³":"`x = x_0 + t m_1`, `y = y_0 + t m_2`, `z = z_0 + t m_3`.",
        "Normals":"`Ax + By + Cz + D = 0` has normal `(A, B, C)`.",
        "Solving for `t`":"A linear equation has one solution, or reduces to `0t = 0` (every `t`) or `0t = c ≠ 0` (none).",
        "Dot product":"Perpendicular ⇔ dot product 0."
      }
    }
  },
  explore:{
    heading:"Line meets plane",
    intro:"Set a plane and a line, then slide the point along the line and watch the m&#101;ter. When the m&#101;ter reads 0, the point is on the plane.",
    modes:[{ id:"free", t:"Free" }, { id:"three", t:"Three cases" }, { id:"perp", t:"Perpendicular from a point" }],
    presets:[{ id:"pierce", t:"pierce", r0:[0, 0, 0], m:[1, 2, 3] }, { id:"hover", t:"hover", r0:[1, 1, 1], m:[1, -1, 0] }, { id:"lie", t:"lie in", r0:[2, 2, 2], m:[1, -1, 0] }],
    setups:[
      { id:"tc1", t:"Challenge 1", P:[3, -1, 1, -13], r0:[1, 0, 2], m:[2, 1, -1] },
      { id:"tc2", t:"Challenge 2", P:[1, 2, -1, -4], r0:[1, 2, 3], m:[1, 1, 1] },
      { id:"tc3", t:"Challenge 3", P:[2, -1, 3, -6], r0:[0, 0, 0], m:[1, 0, 0] }
    ],
    txt:{
      mode:"Mode", plane:"Plane `Ax + By + Cz + D = 0`", point:"Point `vec{r}_0`", dir:"Direction `vec{m}`", Q:"Point `Q`",
      planeFixed:"Plane `x + y + z = 6` (fixed in this mode)", lines:"Preset lines", setups:"Challenge setups",
      dirLocked:"Direction `vec{m} = vec{n}` (the line through `Q` along the normal)",
      tLab:"Parameter `t`", tNote:"The slider snaps to the exact intersection when you come within 0.05 of it.",
      snap:"Snap to intersection", drop:"Drop", entry:"Intersection point (challenge 1)", entryPh:"(x, y, z)",
      entryNote:"Type a point such as (5, 2, 0); fractions like 7/2 are fine.",
      view:"View", views:[{ id:"iso", t:"Isometric" }, { id:"front", t:"Front" }, { id:"side", t:"Side" }, { id:"top", t:"Top" }],
      rotate:"Drag the view or use the arrow keys on it to rotate.",
      meter:"Plane m&#101;ter `vec{n} · vec{r}(t) + D`", meterZero:"0: the point is on the plane",
      graph:"M&#101;ter against `t`", showGraph:"Show graph", hideGraph:"Hide graph",
      key:"Line and direction `vec{m}` in blue, normal `vec{n}` in magenta, the plane in light blue, `P(t)` in black.",
      rows:{ line:"Line", plane:"Plane", dot:"`vec{m} · vec{n}`", meter:"M&#101;ter at current `t`", sub:"Substitution", res:"Result" },
      dot0:"0: the line is parallel to the plane or lies in it",
      onePt:"One point: `t = #1` gives `#2`", noPt:"No intersection: `0t = #1`", inPl:"The line lies in the plane: `0t = 0`",
      noSnap:"There’s no single intersection to snap to.", outRange:"The intersection is at `t = #1`, outside the slider’s range.",
      zeroDir:"Choose a direction that isn’t `vec{0}`.", zeroN:"`A`, `B` and `C` can’t all be 0.",
      foot:"Foot of the perpendicular: `#1`", onPlane:"`Q` is already on the plane: it is its own foot."
    },
    predIntro:"Make a prediction first. Then the 3D view shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Plane `z = 2`; line `vec{r} = (0, 0, 5) + t(0, 0, -1)`. Where does the line meet the plane?",
        options:[{ t:"`(0, 0, 2)`, when `t = 3`", ok:true }, { t:"`(0, 0, 3)`, when `t = 2`" }, { t:"at `t = 2`" }, { t:"never" }],
        explain:"`5 - t = 2` gives `t = 3`; the point is `(0, 0, 2)`." },
      { id:"p2", prompt:"Three cases mode, line `vec{r} = (1, 1, 1) + t(1, -1, 0)`. What will the m&#101;ter do as `t` changes?",
        options:[{ t:"stay at −3 forever: no intersection", ok:true }, { t:"cross 0 once" }, { t:"stay at 0" }, { t:"cross 0 twice" }],
        explain:"`vec{m} · vec{n} = 1 - 1 + 0 = 0`, and `(1, 1, 1)` gives `3 - 6 = -3`." },
      { id:"p3", prompt:"Same direction, line through `(2, 2, 2)`. Now what?",
        options:[{ t:"the m&#101;ter stays at 0: the line lies in the plane", ok:true }, { t:"one point" }, { t:"no intersection" }, { t:"two points" }],
        explain:"`(2, 2, 2)` is on the plane (`2 + 2 + 2 = 6`) and the line runs parallel to it." },
      { id:"p4", prompt:"Line direction `(1, 1, 1)`. `(1, 1, 1)` is parallel to the plane’s normal. How does the line meet the plane?",
        options:[{ t:"once, at a right angle", ok:true }, { t:"it’s parallel to the plane" }, { t:"it lies in the plane" }, { t:"twice" }],
        explain:"`vec{m} ∥ vec{n}` means the line is perpendicular to the plane. Parallel to the plane is `vec{m} · vec{n} = 0`." }
    ],
    chalIntro:"Use the 3D view, the m&#101;ter and the controls to meet each goal, then press <strong>Check challenge</strong>. The <strong>Challenge setups</strong> chips in Free mode load each challenge’s plane and line. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 3], prompt:"Free mode: `vec{r} = (1, 0, 2) + t(2, 1, -1)` and `3x - y + z = 13`. Slide to the intersection and enter the point.",
        why:"`5 + 4t = 13` gives `t = 2`, and `t = 2` gives the point `(5, 2, 0)`.",
        hints:["Substitute `x = 1 + 2t`, `y = t`, `z = 2 - t`.", "`3 + 6t - t + 2 - t = 13`, so `5 + 4t = 13`.", "`t = 2`: `(5, 2, 0)`."],
        msgs:{ setup:"In Free mode, set the plane to `3x - y + z = 13` and the line to `(1, 0, 2) + t(2, 1, -1)` (the Challenge 1 chip does this).",
          blank:"Enter the point in the box under the slider.", bad:"Type a point with three coordinates, such as (5, 2, 0).",
          t:"That’s `t`. Substitute it into the line.", tm:"That’s `t vec{m}` only: add `vec{r}_0`.", t1:"That’s `t = 1`: check `9 - 1 + 1 = 9 ≠ 13`.",
          slide:"The point is right. Now slide `t` to the intersection too.", general:"That point isn’t on both the line and the plane. Watch the m&#101;ter: it reads 0 at the intersection." } },
      { id:"tc2", goal:3, prompt:"Keep `vec{r}_0 = (1, 2, 3)`. Change the direction so the line <strong>never</strong> meets the plane `x + 2y - z = 4`.",
        why:"With `m_1 + 2m_2 - m_3 = 0` the m&#101;ter never changes, and `(1, 2, 3)` gives `1 + 4 - 3 = 2 ≠ 4`, so it stays off 0 forever.",
        hints:["The m&#101;ter must never change: its rate `vec{m} · vec{n}` must be 0.", "`m_1 + 2m_2 - m_3 = 0`.", "`(1, 0, 1)`: `1 + 0 - 1 = 0`."],
        msgs:{ setup:"In Free mode, set the plane to `x + 2y - z = 4` and `vec{r}_0 = (1, 2, 3)` (the Challenge 2 chip does this).",
          zero:"Choose a direction that isn’t `vec{0}`.", normal:"That’s the normal direction: the line hits the plane head-on.",
          moves:"The m&#101;ter still moves, so it crosses 0 somewhere." } },
      { id:"tc3", goal:[3, 4], stretch:true, prompt:"Choose `vec{r}_0` and `vec{m}` (whole numbers −4 to 4) so the line lies <strong>entirely in</strong> the plane `2x - y + 3z = 6` <strong>and</strong> is horizontal (parallel to the `xy`-plane).",
        why:"`vec{m}` is a multiple of `(1, 2, 0)`: horizontal (`m_3 = 0`) and perpendicular to `(2, -1, 3)`. With `vec{r}_0` on the plane, the m&#101;ter is stuck at 0.",
        hints:["Horizontal means `m_3 = 0`.", "In the plane: `vec{m} · (2, -1, 3) = 2m_1 - m_2 = 0`, so `vec{m}` is a multiple of `(1, 2, 0)`.", "Start at a point of the plane, such as its `x`-intercept `(3, 0, 0)`."],
        msgs:{ setup:"In Free mode, set the plane to `2x - y + 3z = 6` (the Challenge 3 chip does this).", range:"Keep the coordinates of `vec{r}_0` and `vec{m}` between −4 and 4.",
          zero:"Choose a direction that isn’t `vec{0}`.", off:"Parallel and horizontal, but not in the plane: the m&#101;ter is stuck at a non-zero value.",
          tilt302:"That lies in the plane (`6 - 0 - 6 = 0`) but it tilts: `m_3` must be 0.", tilt:"That runs along the plane, but it tilts: `m_3` must be 0.",
          normal:"That’s the normal: perpendicular to the plane.", cross:"Horizontal, but the m&#101;ter still moves, so the line crosses the plane: you need `2m_1 - m_2 = 0`.",
          moves:"The m&#101;ter still moves, so the line crosses the plane once. It needs `vec{m} · vec{n} = 0`." } }
    ]
  },
  part3:{
    slug:"classify", name:"Classify",
    heading:"Classify before you compute",
    intro:"Predict the case before you solve, with two quick calculations: first `vec{m} · vec{n}`, then a point test. Tap through the decision tree for each case, then compute. The 3D view confirms.",
    cases:[
      { id:"c1", chip:"Case 1", line:"`vec{r} = (1, 1, 0) + t(1, -1, 2)`", plane:"`x + y - z = 2`", r0:[1, 1, 0], m:[1, -1, 2], P:[1, 1, -1, -2],
        read:"`vec{m} = (1, -1, 2)`, `vec{n} = (1, 1, -1)`", dot:"`1 - 1 - 2 = -2`", kind:"one",
        sub:"`(1 + t) + (1 - t) - 2t = 2`, so `2 - 2t = 2`", t:"0", pt:["1", "1", "0"], ptTxt:"(1, 1, 0)", tm:["0", "0", "0"],
        done:"`t = 0`: the point is `(1, 1, 0)` itself." },
      { id:"c2", chip:"Case 2", line:"`vec{r} = (0, 2, 1) + t(2, 1, 3)`", plane:"`x + y - z = 2`", r0:[0, 2, 1], m:[2, 1, 3], P:[1, 1, -1, -2],
        read:"`vec{m} = (2, 1, 3)`, `vec{n} = (1, 1, -1)`", dot:"`2 + 1 - 3 = 0`", kind:"none",
        test:"`(0, 2, 1)` gives `0 + 2 - 1 = 1 ≠ 2`", done:"Parallel, no intersection: substituting gives `0t = 1`." },
      { id:"c3", chip:"Case 3", line:"`vec{r} = (1, 2, 1) + t(2, 1, 3)`", plane:"`x + y - z = 2`", r0:[1, 2, 1], m:[2, 1, 3], P:[1, 1, -1, -2],
        read:"`vec{m} = (2, 1, 3)`, `vec{n} = (1, 1, -1)`", dot:"`2 + 1 - 3 = 0`", kind:"in",
        test:"`(1, 2, 1)` gives `1 + 2 - 1 = 2` ✓", done:"The line lies in the plane: substituting gives `0t = 0`." },
      { id:"c4", chip:"Case 4 (symmetric form)", line:"`{x - 1}/{2} = {y}/{-1} = {z + 1}/{1}`", plane:"`2x + y - z = 7`", r0:[1, 0, -1], m:[2, -1, 1], P:[2, 1, -1, -7],
        read:"From the symmetric form: `vec{r}_0 = (1, 0, -1)`, `vec{m} = (2, -1, 1)`; `vec{n} = (2, 1, -1)`", dot:"`4 - 1 - 1 = 2`", kind:"one",
        sub:"`2(1 + 2t) + (-t) - (-1 + t) = 7`, so `3 + 2t = 7`", t:"2", pt:["5", "−2", "1"], ptTxt:"(5, −2, 1)", tm:["4", "−2", "2"],
        done:"`t = 2`: the point is `(5, -2, 1)`." },
      { id:"c5", chip:"Case 5 (plane in vector form)", line:"`vec{r} = (1, 1, 5) + t(1, 1, 1)`", plane:"`vec{r} = s(1, 0, 1) + u(0, 1, 1)`", r0:[1, 1, 5], m:[1, 1, 1], P:[1, 1, -1, 0],
        read:"`vec{n} = (1, 0, 1) × (0, 1, 1) = (-1, -1, 1)`: the plane is `x + y - z = 0`, so use `vec{n} = (1, 1, -1)`; `vec{m} = (1, 1, 1)`", dot:"`1 + 1 - 1 = 1`", kind:"one",
        sub:"`(1 + t) + (1 + t) - (5 + t) = 0`, so `-3 + t = 0`", t:"3", pt:["4", "4", "8"], ptTxt:"(4, 4, 8)", tm:["3", "3", "3"],
        done:"`t = 3`: the point is `(4, 4, 8)`." }
    ],
    tree:{
      n1:"Compute `vec{m} · vec{n}`", ne:"≠ 0: one point (then solve)", eq:"= 0: test `vec{r}_0` in the plane",
      n2:"Test `vec{r}_0` in the plane", on:"On the plane: the line lies in it", off:"Off: parallel, no intersection",
      solve:"Solve: enter the point of intersection", check:"Check", entryPh:"(x, y, z)",
      wrongNe:"`vec{m} · vec{n} = #1`, not 0: the m&#101;ter moves, so the line crosses the plane once.",
      wrongEq:"`vec{m} · vec{n} = 0`: the line runs parallel to the plane. Test a point before you decide.",
      wrongOn:"The point test fails: `#1`. Parallel and off the plane: the line never meets it.",
      wrongOff:"`#1`: the line’s point is on the plane. " + M4,
      ptT:"That’s `t`. Substitute it into the line.", ptTm:"That’s `t vec{m}` without `vec{r}_0`. " + M5, ptBad:"Type a point with three coordinates, such as (5, 2, 0).",
      ptGen:"Not quite. Use the substitution, solve for `t`, then substitute `t` back into the line.",
      reset:"Start this case again", start:"Start with the top of the tree.", view:"3D view of this case"
    },
    alg:{ title:"Check it with algebra",
      lines:["`x = x_0 + t m_1`, `y = y_0 + t m_2`, `z = z_0 + t m_3` into `Ax + By + Cz + D = 0`:",
        "`A(x_0 + t m_1) + B(y_0 + t m_2) + C(z_0 + t m_3) + D = 0`",
        "`(Ax_0 + By_0 + Cz_0 + D) + (Am_1 + Bm_2 + Cm_3)t = 0`",
        "`(vec{n} · vec{r}_0 + D) + (vec{n} · vec{m})t = 0`"],
      end:"The first bracket is the <strong>point test</strong> (0 when `vec{r}_0` is on the plane); the second is the <strong>parallel test</strong> (0 when the line runs parallel to the plane).",
      here:"For this case:" },
    quickCheck:{
      title:"Quick check", summary:"Classify quick check",
      items:[
        { id:"q1", goal:3, prompt:"`vec{m} · vec{n} = 0` and `vec{r}_0` is on the plane. The line …",
          choices:[{ t:"lies in the plane", ok:true, fb:"Right. Parallel and sharing a point: every point is shared." },
            { t:"is parallel and never meets it", fb:"Parallel and sharing a point: every point is shared." },
            { t:"meets it once", fb:"Parallel and sharing a point: every point is shared." },
            { t:"is perpendicular to it", fb:"Parallel and sharing a point: every point is shared." }] },
        { id:"q2", goal:2, prompt:"Substituting gives `0t = -4`. The line …",
          choices:[{ t:"never meets the plane", ok:true, fb:"Right. No `t` makes `0t = -4` true." },
            { t:"meets it at `t = -4`", fb:"No `t` makes `0t = -4` true." },
            { t:"meets it at `t = 0`", fb:"No `t` makes `0t = -4` true." },
            { t:"lies in the plane", fb:"No `t` makes `0t = -4` true." }] },
        { id:"q3", goal:3, prompt:"`vec{m} = (2, 4, -2)` and the plane is `x + 2y - z = 1`. The line …",
          choices:[{ t:"meets it once, at a right angle", ok:true, fb:"Right. `vec{m} = 2vec{n}`: perpendicular to the plane. `vec{m} · vec{n} = 12 ≠ 0`, so one point whatever `vec{r}_0` is." },
            { t:"is parallel to it", fb:"`vec{m} = 2vec{n}`: perpendicular to the plane. `vec{m} · vec{n} = 12 ≠ 0`, so one point whatever `vec{r}_0` is." },
            { t:"lies in it", fb:"`vec{m} = 2vec{n}`: perpendicular to the plane. `vec{m} · vec{n} = 12 ≠ 0`, so one point whatever `vec{r}_0` is." },
            { t:"can’t be classified without `vec{r}_0`", fb:"`vec{m} = 2vec{n}`: perpendicular to the plane. `vec{m} · vec{n} = 12 ≠ 0`, so one point whatever `vec{r}_0` is." }] },
        { id:"q4", goal:1, prompt:"For `vec{r} = (1, 0, 2) + t(1, 1, 0)`, substituting gives `3t - 6 = 0`. The intersection is …",
          choices:[{ t:"`(3, 2, 2)`", ok:true, fb:"Right. `t = 2` gives `(1 + 2, 0 + 2, 2)`." },
            { t:"`t = 2`", fb:"`t = 2` gives `(1 + 2, 0 + 2, 2)`. `(2, 2, 0)` forgets `vec{r}_0`." },
            { t:"`(2, 2, 0)`", fb:"`t = 2` gives `(1 + 2, 0 + 2, 2)`. `(2, 2, 0)` forgets `vec{r}_0`." },
            { t:"`(1, 0, 2)`", fb:"`t = 2` gives `(1 + 2, 0 + 2, 2)`. `(2, 2, 0)` forgets `vec{r}_0`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"find", type:"custom", title:"Find it", summary:"Find it", goal:[1, 2, 4],
        instruction:"For each line and plane, choose what happens. If they meet at one point, enter the point.",
        how:"Choose <strong>One point</strong>, <strong>No intersection</strong> or <strong>Lies in the plane</strong>. For one point, type it as (x, y, z); fractions like 7/2 are fine. Then press Check.",
        choices:[{ id:"pt", t:"One point" }, { id:"none", t:"No intersection" }, { id:"in", t:"Lies in the plane" }],
        msgs:{ choose:"Choose one of the three outcomes first.", bad:"Type a point with three coordinates, such as (4, 1, 2).", pointLab:"Point" },
        items:[
          { id:"f1", goal:1, prompt:"`vec{r} = (2, 1, 0) + t(1, 0, 1)`; `x + y + z = 7`", answer:{ kind:"pt", p:["4", "1", "2"] },
            wrong:[{ v:"2", fb:tOnly(2) }],
            fb:"Substitute `x = 2 + t`, `y = 1`, `z = t`, solve for `t`, then substitute `t` back into the line.",
            hints:["Substitute `x = 2 + t`, `y = 1`, `z = t` into `x + y + z = 7`.", "`3 + 2t = 7`.", "`t = 2`: `(4, 1, 2)`."] },
          { id:"f2", goal:1, prompt:"`vec{r} = t(1, 2, 3)`; `2x - y + z = 6`", answer:{ kind:"pt", p:["2", "4", "6"] },
            wrong:[{ v:"2", fb:tOnly(2) }],
            fb:"The `x`- and `y`-terms cancel: `3t = 6`.",
            hints:["Substitute `x = t`, `y = 2t`, `z = 3t`.", "`2t - 2t + 3t = 6`.", "`t = 2`: `(2, 4, 6)`."] },
          { id:"f3", goal:2, prompt:"`vec{r} = (1, 1, 1) + t(1, -1, 0)`; `x + y + 2z = 5`", answer:{ kind:"none" },
            wrong:[{ pt:["1", "1", "1"], fb:"`0t = 1`: the point isn’t on the plane, and nothing else is either." }],
            fb:"`0t = 1`: the point isn’t on the plane, and nothing else is either.",
            hints:["Substitute `x = 1 + t`, `y = 1 - t`, `z = 1`.", "`(1 + t) + (1 - t) + 2 = 4`, so `4 + 0t = 5`.", "`0t = 1` has no solution: no intersection."] },
          { id:"f4", goal:[2, 4], prompt:"`x = 3 - t`, `y = 2t`, `z = 1 + t`; `2x + y = 6`", answer:{ kind:"in" },
            wrong:[{ kind:"none", fb:"`0t = 0` is true for every `t`." }],
            fb:"`0t = 0` is true for every `t`.",
            hints:["Substitute: `2(3 - t) + 2t`.", "`6 = 6`.", "True for every `t`: the line lies in the plane."] },
          { id:"f5", goal:[1, 4], prompt:"`vec{r} = (2, -1, 4) + t(1, 1, -2)`; the `xy`-plane", answer:{ kind:"pt", p:["4", "1", "0"] },
            wrong:[{ v:"2", fb:tOnly(2) }],
            fb:"The `xy`-plane is `z = 0`: `4 - 2t = 0`.",
            hints:["The `xy`-plane is `z = 0`.", "`4 - 2t = 0`.", "`t = 2`: `(4, 1, 0)`."] },
          { id:"f6", goal:4, prompt:"`{x - 2}/{1} = {y + 1}/{2} = {z}/{-1}`; `x - y + z = 0`", answer:{ kind:"pt", p:["7/2", "2", "−3/2"] },
            wrong:[{ v:"3/2", fb:tOnly("3/2") }],
            fb:"From symmetric form: `vec{r}_0 = (2, -1, 0)`, `vec{m} = (1, 2, -1)`; `3 - 2t = 0`.",
            hints:["Read `vec{r}_0` from the numerators and `vec{m}` from the denominators.", "`(2 + t) - (-1 + 2t) + (-t) = 0`.", "`t = 3/2`: `(7/2, 2, -3/2)`."] }
        ] },
      { id:"back", type:"custom", title:"Work backwards", summary:"Work backwards", star:true, goal:[2, 3, 5],
        instruction:"Work backwards from what the line and plane must do. Items 3 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type a whole number or fraction for `k`, or a point as (x, y, z). Then press Check.",
        msgs:{ blank:"Fill in the box first.", bad:"Type a point with three coordinates, such as (1, 0, 2).", badK:"Type one number for `k`, such as 3 or −1/2.", kLab:"`k =`", pointLab:"Point" },
        items:[
          { id:"r1", goal:2, kind:"k", prompt:"Find `k` so that `vec{r} = (1, 0, k) + t(2, 1, 1)` lies in the plane `x - y - z = 1`.", answer:{ k:"0" },
            fb:"`vec{m} · vec{n} = 0` already; the point must satisfy `1 - 0 - k = 1`.",
            hints:["Check `vec{m} · vec{n}` first: `2 - 1 - 1`.", "It’s 0, so the line runs parallel to the plane; now its point must be on the plane.", "`1 - 0 - k = 1` gives `k = 0`."] },
          { id:"r2", goal:3, kind:"k", prompt:"Find `k` so that `vec{r} = (0, 1, 2) + t(1, k, 3)` never meets `2x + y - z = 5`.", answer:{ k:"1" },
            fb:"Need `vec{m} · vec{n} = 2 + k - 3 = 0`, and `(0, 1, 2)` is off the plane (`-1 ≠ 5`) ✓.",
            hints:["Never meets: `vec{m} · vec{n} = 0` and the point off the plane.", "`2(1) + k - 3 = 0`.", "`k = 1`; `(0, 1, 2)` gives `-1 ≠ 5` ✓."] },
          { id:"r3", goal:5, star:true, kind:"pt", prompt:"Find the point of the plane `x + y + z = 3` closest to `Q(4, 3, 5)`.", answer:{ p:["1", "0", "2"] },
            wrong:[{ v:"−3", fb:tOnly(-3) }],
            fb:"Go along the normal: `(4 + t) + (3 + t) + (5 + t) = 3` gives `t = -3`. " + M5,
            hints:["The closest point lies along the normal from `Q`.", "Line `Q + t(1, 1, 1)`.", "`12 + 3t = 3`, `t = -3`: `(1, 0, 2)`."] },
          { id:"r4", goal:5, star:true, kind:"pt", prompt:"Reflect `Q(4, 3, 5)` in the plane `x + y + z = 3`.", answer:{ p:["−2", "−3", "−1"] },
            wrong:[{ pt:["1", "0", "2"], fb:"That’s the foot (the midpoint). Go twice as far: `t = -6`." }],
            fb:"Go from `Q` along the normal `(1, 1, 1)` to the foot of the perpendicular, then the same distance again.",
            hints:["The image is as far beyond the plane as `Q` is in front of it.", "The foot is at `t = -3` on the line `Q + t(1, 1, 1)`.", "`t = -6`: `(-2, -3, -1)`."] },
          { id:"r5", goal:[4, 5], star:true, kind:"pt", prompt:"The line through `A(1, 2, 3)` and `B(3, 2, 1)` meets `x + 2y + 3z = 6` where?", answer:{ p:["5", "2", "−1"] },
            wrong:[{ v:"2", fb:tOnly(2) }],
            fb:"`vec{m} = B - A = (2, 0, -2)`; `14 - 4t = 6` gives `t = 2` (beyond B).",
            hints:["Use `vec{m} = B - A` and start at `A`.", "`(1 + 2t) + 2(2) + 3(3 - 2t) = 6`.", "`14 - 4t = 6`, `t = 2`: `(5, 2, -1)`."] },
          { id:"r6", goal:[2, 3], star:true, kind:"k", prompt:"For which `k` does `vec{r} = (k, 0, 1) + t(1, k, 2)` <strong>not</strong> meet `x - y + z = 3`?", answer:{ k:"3" },
            fb:"`vec{m} · vec{n} = 3 - k = 0` gives `k = 3`; then `(3, 0, 1)` gives `4 ≠ 3`, so no intersection. For every other `k` there’s one point.",
            hints:["No intersection needs `vec{m} · vec{n} = 0` <strong>and</strong> the point off the plane.", "`1 - k + 2 = 0`.", "`k = 3`; check `(3, 0, 1)`: `3 - 0 + 1 = 4 ≠ 3` ✓."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Dev", goal:[1, 2, 3],
        instruction:"Dev made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Where does `vec{r} = (1, 2, 0) + t(1, -1, 3)` meet `2x + y + z = 10`?",
            steps:["`2(1 + t) + (2 - t) + 3t = 10`.", "`2 + 2t + 2 - t + 3t = 10`, so `4 + 4t = 10`.", "`t = 3/2`.", "The line meets the plane at `3/2`."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"Substitute `t = 3/2` into the line: `(5/2, 1/2, 9/2)`.", ok:true, why:"`t` is the parameter; the intersection is the point `(1 + 3/2, 2 - 3/2, 9/2)`." },
              { t:"The point is `(3/2, 3/2, 3/2)`.", why:"`t` isn’t a coordinate." },
              { t:"The point is `(3/2, -3/2, 9/2)`.", why:"That’s `t vec{m}` without `vec{r}_0`." },
              { t:"Step 4 is correct.", why:tOnly("3/2") }],
            hints:["Is `3/2` a point?", "It’s the parameter.", "`(1 + 3/2, 2 - 3/2, 9/2)`."] },
          { id:"e2", goal:2, task:"Where does `vec{r} = (2, 0, 1) + t(1, 1, -2)` meet `x + y + z = 5`?",
            steps:["`(2 + t) + t + (1 - 2t) = 5`.", "`3 + 0t = 5`.", "`0t = 2`, so `t = 0`.", "The point is `(2, 0, 1)`."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"`0t = 2` has no solution: the line is parallel to the plane and never meets it.", ok:true, why:"No value of `t` makes `0t = 2` true." },
              { t:"`0t = 2`, so `t = 2`: `(4, 2, -3)`.", why:"No value of `t` makes `0t = 2` true, so there’s no intersection." },
              { t:"`0t = 2`, so every `t` works.", why:"Only `0t = 0` is true for every `t`; `0t = 2` is true for none." },
              { t:"Step 3 is correct.", why:"Check `(2, 0, 1)`: `2 + 0 + 1 = 3 ≠ 5`." }],
            hints:["What times 0 gives 2?", "Nothing.", "No intersection."] },
          { id:"e3", goal:3, task:"Does `vec{r} = (1, 1, 1) + t(2, -1, 1)` meet `2x + 3y - z = 4`?",
            steps:["`vec{m} = (2, -1, 1)`, `vec{n} = (2, 3, -1)`.", "`vec{m} · vec{n} = 4 - 3 - 1 = 0`.", "So the line is parallel to the plane and never meets it.", "No intersection."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct. Keep checking.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"`vec{m} · vec{n} = 0` means parallel <strong>or</strong> in the plane. Test `(1, 1, 1)`: `2 + 3 - 1 = 4`, so the whole line lies in the plane.", ok:true, why:M4 },
              { t:"`vec{m} · vec{n} = 0` means the line is perpendicular: one point.", why:M3 },
              { t:"Solve for `t`: `t = 0`, so they meet once at `(1, 1, 1)`.", why:"Substituting gives `0t = 0`: true for <strong>every</strong> `t`, not just `t = 0`." },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["What else can `vec{m} · vec{n} = 0` mean?", "Test the line’s point in the plane.", "It satisfies the plane: the line lies in it."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in Explore: the frozen m&#101;ter, or that a line can lie completely inside a plane?" },
      { id:"j2", q:"In your own words, why can a line and a plane never meet in exactly two points?" },
      { id:"j3", q:"Explain to a friend the fastest way to tell which of the three cases you’re in." },
      { id:"j4", q:"Which step still trips you up (substituting, interpreting `0t`, finishing with the point)? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Where does `vec{r} = (0, 1, 2) + t(1, 1, 1)` meet `x + y + z = 9`?", options:[
          { t:"`(2, 3, 4)`", ok:true, why:"`3 + 3t = 9` gives `t = 2`." },
          { t:"`(2, 2, 2)`", why:"That’s `t vec{m}`; add `vec{r}_0`." },
          { t:"`(3, 4, 5)`", why:"That uses `t = 3`, forgetting the constant 3: `3 + 3t = 9`." },
          { t:"`(0, 1, 2)`", why:"That’s the line’s starting point: `0 + 1 + 2 = 3 ≠ 9`." }] },
        b:{ prompt:"Where does `vec{r} = (1, 0, 2) + t(2, 1, 1)` meet `x + y + z = 11`?", options:[
          { t:"`(5, 2, 4)`", ok:true, why:"`3 + 4t = 11` gives `t = 2`." },
          { t:"`(4, 2, 2)`", why:"That’s `t vec{m}`; add `vec{r}_0`." },
          { t:"`(7, 3, 5)`", why:"That uses `t = 3`." },
          { t:"`(1, 0, 2)`", why:"The starting point gives `3 ≠ 11`." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Substituting a line into a plane’s equation gives `0t = 7`. What does that mean?", options:[
          { t:"The line is parallel to the plane and never meets it.", ok:true, why:"No value of `t` makes `0t = 7` true." },
          { t:"They meet where `t = 7`.", why:"No value of `t` makes `0t = 7` true, so there’s no intersection." },
          { t:"They meet where `t = 0`.", why:"No value of `t` makes `0t = 7` true, so there’s no intersection." },
          { t:"The line lies in the plane.", why:"That’s `0t = 0`." }] },
        b:{ prompt:"Substituting gives `0t = 0`. What does that mean?", options:[
          { t:"The line lies in the plane: every point of the line is on it.", ok:true, why:"`0t = 0` is true for <strong>every</strong> `t`." },
          { t:"They meet only where `t = 0`.", why:"`0t = 0` is true for <strong>every</strong> `t`, not just 0." },
          { t:"The line never meets the plane.", why:"That’s `0t =` non-zero." },
          { t:"They meet at two points.", why:M6 }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"A line has direction `(3, -1, 2)`; a plane is `x + 5y + z = 4`. Which is true?", options:[
          { t:"The line is parallel to the plane or lies in it.", ok:true, why:"`vec{m} · vec{n} = 3 - 5 + 2 = 0`." },
          { t:"The line is perpendicular to the plane.", why:M3 },
          { t:"The line meets the plane in exactly one point.", why:"That needs `vec{m} · vec{n} ≠ 0`." },
          { t:"The line is parallel to the plane, so it never meets it.", why:"It might lie in the plane: test a point." }] },
        b:{ prompt:"A line has direction `(2, 2, -1)`; a plane is `3x - y + 4z = 1`. Which is true?", options:[
          { t:"The line is parallel to the plane or lies in it.", ok:true, why:"`6 - 2 - 4 = 0`." },
          { t:"The line is perpendicular to the plane.", why:M3 },
          { t:"The line meets the plane in exactly one point.", why:"That needs `vec{m} · vec{n} ≠ 0`, but `6 - 2 - 4 = 0`." },
          { t:"The line is parallel to the plane, so it never meets it.", why:M4 }] } },
      { id:"t1", cat:"T", goal:[2, 3],
        a:{ prompt:"Does `vec{r} = (2, 1, -1) + t(1, 3, 2)` meet `4x - 2y + z = 5`?", options:[
          { t:"It lies in the plane.", ok:true, why:"`vec{m} · vec{n} = 4 - 6 + 2 = 0`, and `(2, 1, -1)` gives `8 - 2 - 1 = 5`, so the point is on the plane." },
          { t:"No: `vec{m} · vec{n} = 0`, so it’s parallel and never meets the plane.", why:M4 },
          { t:"Yes, at one point, where `t = 0`.", why:"Substituting gives `0t = 0`: true for <strong>every</strong> `t`, not just `t = 0`." },
          { t:"Yes, at a right angle, because `vec{m} · vec{n} = 0`.", why:M3 }] },
        b:{ prompt:"Does `vec{r} = (1, 0, 3) + t(2, 1, -1)` meet `x - y + z = 2`?", options:[
          { t:"No: it’s parallel to the plane and never meets it.", ok:true, why:"`vec{m} · vec{n} = 0` and `(1, 0, 3)` gives `4 ≠ 2`." },
          { t:"It lies in the plane.", why:"The point test fails." },
          { t:"Yes, at one point, where `t = 0`.", why:"Substituting gives `0t = 2`: no value of `t` works." },
          { t:"Yes, at a right angle.", why:M3 }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"Find the point of the plane `2x - y + 2z = 1` closest to `Q(4, 1, 6)`.", options:[
          { t:"`(0, 3, 2)`", ok:true, why:"Line `Q + t(2, -1, 2)`: `18 + 9t = 0`, so `t = -2`." },
          { t:"`(8, -1, 10)`", why:"Sign slip: `t = +2` goes away from the plane." },
          { t:"`(-4, 2, -4)`", why:"That’s `t vec{n}` without `Q`." },
          { t:"`t = -2`", why:tOnly(-2) }] },
        b:{ prompt:"Find the point of the plane `x + 2y - 2z = 3` closest to `Q(3, 6, -3)`.", options:[
          { t:"`(1, 2, 1)`", ok:true, why:"Line `Q + t(1, 2, -2)`: `18 + 9t = 0`, so `t = -2`." },
          { t:"`(5, 10, -7)`", why:"Sign slip: `t = +2` goes away from the plane." },
          { t:"`(-2, -4, 4)`", why:"That’s `t vec{n}` without `Q`." },
          { t:"`t = -2`", why:tOnly(-2) }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"Where does `vec{r} = (1, 2, 4) + t(1, 0, 1)` meet the plane `vec{r} = s(1, 0, 0) + u(0, 1, 1)`?", options:[
          { t:"`(-1, 2, 2)`", ok:true, why:"`vec{n} = (1, 0, 0) × (0, 1, 1) = (0, -1, 1)`: the plane is `z = y`. Then `4 + t = 2`, so `t = -2`." },
          { t:"`(3, 2, 6)`", why:"Sign slip: `t = 2` gives `z = 6 ≠ y`." },
          { t:"`(1, 2, 4)`", why:"That’s the line’s starting point; `4 ≠ 2`." },
          { t:"No intersection: `(1, 0, 1)` isn’t a combination of the plane’s directions.", why:"A line doesn’t have to lie along a plane to cross it." }] },
        b:{ prompt:"Where does `vec{r} = (2, 3, 1) + t(0, 1, 1)` meet the plane `vec{r} = s(1, 1, 0) + u(0, 0, 1)`?", options:[
          { t:"`(2, 2, 0)`", ok:true, why:"`vec{n} = (1, -1, 0)`: the plane is `x = y`. Then `2 = 3 + t`, so `t = -1`." },
          { t:"`(2, 4, 2)`", why:"Sign slip: `t = 1` gives `y = 4 ≠ x`." },
          { t:"`(2, 3, 1)`", why:"That’s the starting point; `2 ≠ 3`." },
          { t:"No intersection: `(0, 1, 1)` isn’t a combination of the plane’s directions.", why:"A line doesn’t have to lie along a plane to cross it." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of why `vec{m} · vec{n} = 0` doesn’t prove that a line misses a plane?", options:[
          { t:"“`vec{m} · vec{n} = 0` only says the line runs parallel to the plane. If one point of the line is on the plane, the whole line lies in it, so you must test a point.”", ok:true, why:M4 },
          { t:"“Because `vec{m} · vec{n} = 0` means the line is perpendicular to the plane.”", why:M3 },
          { t:"“It does prove it: lines parallel to a plane never meet it.”", why:M4 },
          { t:"“Because you also need `vec{m} × vec{n} = vec{0}`.”", why:"`vec{m} × vec{n} = vec{0}` means `vec{m} ∥ vec{n}`: a perpendicular line." }] },
        b:{ prompt:"Which is the best explanation of what `0t = 0` means after substituting a line into a plane?", options:[
          { t:"“The equation is true for every `t`, so every point of the line satisfies the plane’s equation: the line lies in the plane.”", ok:true, why:"`0t = 0` is true for <strong>every</strong> `t`." },
          { t:"“`t = 0`, so they meet at the line’s starting point.”", why:"`0t = 0` is true for <strong>every</strong> `t`, not just 0." },
          { t:"“No value of `t` works, so they don’t meet.”", why:"That’s `0t = c ≠ 0`." },
          { t:"“The line is perpendicular to the plane.”", why:M3 }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which is the best description of how to find where a line meets a plane?", options:[
          { t:"“Write the line’s parametric equations, substitute `x`, `y` and `z` into the plane’s scalar equation, solve for `t`, then substitute `t` back into the line’s equations.”", ok:true, why:"The value of `t` is not the answer; the point is." },
          { t:"“Set the line’s direction vector equal to the plane’s normal and solve.”", why:"`vec{m} = vec{n}` isn’t an equation for the point." },
          { t:"“Solve for `t`; `t` is the intersection.”", why:"`t` is a parameter value. Substitute it into the line to get the point." },
          { t:"“Substitute the plane’s normal into the line’s equation.”", why:M5 }] },
        b:{ prompt:"Which is the clearest statement of the possible outcomes?", options:[
          { t:"“One point (`vec{m} · vec{n} ≠ 0`); no points (`vec{m} · vec{n} = 0` and the line’s point is off the plane); infinitely many (`vec{m} · vec{n} = 0` and the point is on the plane).”", ok:true, why:M6 },
          { t:"“One point, two points or none.”", why:M6 },
          { t:"“One point when `vec{m} · vec{n} = 0`; none otherwise.”", why:M3 },
          { t:"“One point or none; a line can’t lie in a plane.”", why:"Lines can lie in planes." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A laser starts at `L(1, 2, 9)` and points in the direction `(1, 1, -3)`, in metres. Where does it hit the floor `z = 0`?", options:[
          { t:"`(4, 5, 0)`", ok:true, why:"`9 - 3t = 0` gives `t = 3`." },
          { t:"`(3, 3, -9)`", why:"That’s `t vec{m}` without `L`." },
          { t:"`(2, 3, 6)`", why:"That stops at `t = 1`." },
          { t:"3", why:tOnly(3) }] },
        b:{ prompt:"A laser starts at `L(2, -1, 8)` and points in the direction `(1, 2, -4)`. Where does it hit the floor `z = 0`?", options:[
          { t:"`(4, 3, 0)`", ok:true, why:"`8 - 4t = 0` gives `t = 2`." },
          { t:"`(2, 4, -8)`", why:"That’s `t vec{m}` without `L`." },
          { t:"`(3, 1, 4)`", why:"That stops at `t = 1`." },
          { t:"2", why:tOnly(2) }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A drone flies in a straight line from `(0, 0, 10)` in the direction `(1, 1, -2)`, in metres. A ramp lies in the plane `x + 2z = 8`. Where does the drone’s path meet the ramp?", options:[
          { t:"`(4, 4, 2)`", ok:true, why:"`t + 2(10 - 2t) = 8`, so `20 - 3t = 8` and `t = 4`." },
          { t:"`(4, 4, -8)`", why:"That’s `t vec{m}` without the starting point." },
          { t:"`(2, 2, 6)`", why:"That forgets the 2 in front of `z`: `t + 10 - 2t = 8`." },
          { t:"4", why:tOnly(4) }] },
        b:{ prompt:"A drone flies from `(0, 0, 9)` in the direction `(1, 2, -1)`. A ramp lies in `x + 2z = 12`. Where does the path meet the ramp?", options:[
          { t:"`(6, 12, 3)`", ok:true, why:"`t + 2(9 - t) = 12`, so `18 - t = 12` and `t = 6`." },
          { t:"`(6, 12, -6)`", why:"That’s `t vec{m}` without the starting point." },
          { t:"The path never meets the ramp.", why:"Dropping the 2 in front of `z` gives `9 = 12`, a false ‘parallel’ result." },
          { t:"6", why:tOnly(6) }] } }
    ]
  },
  task:{
    title:"Aim the laser", summary:"Aim the laser",
    statement:"<p>A laser sits at `S(0, 0, 6)`. A triangular target panel lies in the plane `x + y + z = 3` where `x`, `y` and `z` are all ≥ 0. Choose a direction `(a, b, c)` so the beam meets every condition. There are exactly 5 different beams. Can you find them all?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>The beam meets the panel’s plane at exactly one point.</li><li>The beam travels forward to get there (`t > 0`).</li><li>The hit point is on the panel (all coordinates ≥ 0).</li><li>The hit point has whole-number coordinates.</li></ol></div>" +
      "<p class=\"tiny muted\">Choose whole numbers from −4 to 4 for `a`, `b` and `c` (not all 0). Multiples of a direction, such as `(0, 0, -2)` and `(0, 0, -1)`, are the same beam.</p>",
    checks:["Exactly one point", "Forward", "On the panel", "Whole-number hit point"],
    tips:["`vec{m} · vec{n} = a + b + c = 0` makes the beam parallel to the plane.",
      "Substituting gives `6 + (a + b + c)t = 3`. For `t > 0` you need `a + b + c < 0`.",
      "The panel is the part with `x`, `y`, `z ≥ 0`: keep `a` and `b` from going negative.",
      "The hit point is `(-3a/k, -3b/k, 6 - 3c/k)` with `k = a + b + c`: choose numbers that divide evenly."],
    explainPrompt:"Explain how you used the substituted equation to choose your direction.",
    vocab:"Use the words parameter, normal, dot product and point of intersection.",
    success:"Your beam hits the panel!",
    more:"There are exactly 5 different beams. Can you find them all?",
    afterAt:5,
    after3:"Each answer aims at a whole-number point of the panel that you can reach with directions in range. Points like `(1, 1, 1)` need `(1, 1, -5)`, outside the range.",
    labels:{ a:"`a`", b:"`b`", c:"`c`", range:"(−4 to 4)", invalid:"Choose whole numbers from −4 to 4 for `a`, `b` and `c`, not all 0.",
      dir:"Direction", dot:"`vec{m} · vec{n} = a + b + c`", sub:"Substitution", t:"Parameter `t`", hit:"Hit point", parallel:"parallel: no single point",
      behind:"behind the laser", forward:"forward", onPanel:"on the panel", offPanel:"off the panel", whole:"whole numbers", notWhole:"not whole numbers",
      view:"3D view: the laser at S, the panel (blue triangle) in its plane, the beam and the hit point" }
  },
  cards:[
    ["Line meets plane: method", "Substitute the line’s parametric equations into the plane, solve for `t`, substitute back."],
    ["One solution for `t`", "One point of intersection."],
    ["`0t = c`, `c ≠ 0`", "No intersection: parallel and off the plane."],
    ["`0t = 0`", "The line lies in the plane."],
    ["`vec{m} · vec{n} ≠ 0`", "The line crosses the plane at exactly one point."],
    ["`vec{m} · vec{n} = 0`", "Parallel to the plane or in it: test a point."],
    ["`vec{m} ∥ vec{n}`", "The line is perpendicular to the plane."],
    ["`t` is not the answer", "Substitute `t` back into the line to get the point."],
    ["Foot of the perpendicular", "Line from `Q` along `vec{n}`; intersect with the plane."],
    ["Two points?", "Impossible: the equation in `t` is linear."],
    ["Symmetric form", "`(x - x_0)/m_1 = …`: `vec{r}_0` from the numerators, `vec{m}` from the denominators."]
  ]
};
