// MCV4U 48 Equations of Lines in R². Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/48-equations-of-lines-in-r2.md
// misconception core sentences (plan §3), reused where the plan tags an option with M1–M8
const M1 = "The vector added on its own is a point <strong>on</strong> the line; the one multiplied by `t` is the direction.";
const M2 = "Any point on the line and any non-zero multiple of the direction give the same line.";
const M3 = "One point needs one `t`. If `x` needs `t = 3` and `y` needs `t = 2`, the point is not on the line.";
const M4 = "Slope = rise ÷ run = `m_2/m_1`. Slope 2 means (1, 2): one right, two up.";
const M5 = "The direction from A to B is B − A, not A + B.";
const M6 = "Parallel directions give either the same line or two parallel lines. Test a point to decide.";
const M7 = "All real `t` give the whole line. `0 <= t <= 1` gives only the segment from A to B.";
const M8 = "`t = 2`, `s = 2` are parameter values. Substitute to get the point.";
const R = "`vec{r}`";

export default {
  id:"48-equations-of-lines-in-r2",
  kind:"topic",
  title:"Equations of lines in R²",
  topic:"Equations of Lines in R²",
  readyTopic:"equations of lines in R²",
  hero:{
    eq:'<span class="ln-heq"><span class="ln-nw">`vec{r} = vec{r}_0 + t`<span class="ln-m">`vec{m}`</span></span><span class="ln-hpar">`x = x_0 + t m_1`, &nbsp;`y = y_0 + t m_2`</span></span>',
    eqLabel:"r equals r zero plus t times m; x equals x zero plus t m one, y equals y zero plus t m two",
    eqSize:"md",
    headline:"A point and a direction make a line",
    text:"Stand at a point `vec{r}_0` and face along a <strong>direction vector</strong> `vec{m}`. Taking `t` steps of `vec{m}` lands you at `vec{r}_0 + t vec{m}`. Every real <strong>parameter</strong> `t`, positive or negative, gives a point, and together they make the whole line. That’s its <strong>vector equation</strong>; written one coordinate at a time, it’s the <strong>parametric equations</strong>.",
    fig:{ aria:"A grid. The point (1, 2) appears with a dashed position arrow from the origin; the blue direction arrow (3, −1) is drawn from it; a dot steps along by whole multiples, t = 1, 2, 3, then −1, −2, leaving a dotted trail that fills into a solid line extending both ways, labelled r = (1, 2) + t(3, −1).", shape:"wide" }
  },
  goals:[
    "I can write a vector equation of a line from a point and a direction vector.",
    "I can write parametric equations and find points on a line by choosing `t`.",
    "I can write a vector equation of the line through two points.",
    "I can decide whether a point is on a line by finding one value of `t` that works for both coordinates.",
    "I can tell whether two vector equations describe the same line, parallel lines or crossing lines, and find where crossing lines meet.",
    "I can connect direction vectors to slope and to `y = mx + b`, and use lines in simple motion problems."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Vectors from points", goal:3, prompt:"A(2, −1) and B(5, 3). `vec{AB}` = ?",
          options:[
            { t:"(3, 4)", ok:true, why:"B − A = (5 − 2, 3 − (−1))." },
            { t:"(7, 2)", why:"That’s A + B. " + M5 },
            { t:"(−3, −4)", why:"That’s `vec{BA}` = A − B." },
            { t:"(3, 2)", why:"3 − (−1) = 4." }],
          hints:["Head minus tail.", "(5 − 2, 3 − (−1)).", "(3, 4)."] },
        { id:"w2", skill:"Vectors from points", goal:1, prompt:"Which vector is parallel to (6, −4)?",
          options:[
            { t:"(−3, 2)", ok:true, why:"(−3, 2) = `-{1}/{2}`(6, −4)." },
            { t:"(4, −6)", why:"(4, −6) isn’t a multiple of (6, −4)." },
            { t:"(6, 4)", why:"A multiple keeps the ratio −4 : 6." },
            { t:"(2, 3)", why:"(2, 3) · (6, −4) = 0: that’s perpendicular." }],
          hints:["Parallel vectors are multiples of each other.", "Divide (6, −4) by −2.", "(−3, 2)."] },
        { id:"w3", skill:"Slope and lines", goal:6, prompt:"Slope of the line through (1, 2) and (4, −4)?",
          options:[
            { t:"−2", ok:true, why:"(−4 − 2)/(4 − 1) = −6/3." },
            { t:"−1/2", why:"Slope is rise ÷ run. " + M4 },
            { t:"2", why:"`y` falls as `x` rises." },
            { t:"−6", why:"Divide by 3." }],
          hints:["Rise ÷ run.", "Rise −6, run 3.", "−2."] },
        { id:"w4", skill:"Slope and lines", goal:6, prompt:"Which point is on `y = 3x - 5`?",
          options:[
            { t:"(2, 1)", ok:true, why:"3(2) − 5 = 1." },
            { t:"(1, 2)", why:"3(1) − 5 = −2." },
            { t:"(0, 5)", why:"The `y`-intercept is −5." },
            { t:"(3, −5)", why:"3(3) − 5 = 4." }],
          hints:["Substitute `x` and check `y`.", "Try `x = 2`.", "(2, 1)."] },
        { id:"w5", skill:"Linear systems", goal:5, prompt:"Solve `x + y = 5` and `x - y = 1`.",
          options:[
            { t:"(3, 2)", ok:true, why:"Add: `2x = 6`." },
            { t:"(2, 3)", why:"Check `x - y = 1`: 2 − 3 = −1." },
            { t:"(4, 1)", why:"Check `x - y = 1`: 4 − 1 = 3." },
            { t:"(6, −1)", why:"Adding gives `2x = 6`, so `x = 3`, not 6." }],
          hints:["Add the equations.", "`2x = 6`.", "`x = 3`, `y = 2`."] },
        { id:"w6", skill:"Linear systems", goal:5, prompt:"How many solutions does the system `y = 2x + 1`, `y = 2x - 3` have?",
          options:[
            { t:"None", ok:true, why:"Same slope, different intercepts: parallel lines." },
            { t:"One", why:"Lines with equal slopes don’t cross unless they coincide." },
            { t:"Infinitely many", why:"That needs the same line: the intercepts differ." },
            { t:"Two", why:"Two lines meet at most once unless they coincide." }],
          hints:["Compare slopes and intercepts.", "Slopes equal, intercepts 1 and −3.", "Parallel: no solution."] }
      ],
      refreshers:{
        "Vectors from points":"`vec{AB}` = B − A (head minus tail). Parallel vectors are scalar multiples: (−3, 2) ∥ (6, −4).",
        "Slope and lines":"Slope = rise ÷ run. A point is on `y = mx + b` if its coordinates make the equation true.",
        "Linear systems":"Two lines in the plane meet once (different slopes), never (parallel), or everywhere (the same line)."
      }
    }
  },
  explore:{
    heading:"Point and direction",
    intro:"Drag the point and the direction arrow. Slide `t` to move along the line. Then try to describe the same line a different way.",
    modes:[{ id:"build", t:"Build" }, { id:"two", t:"Two descriptions" }, { id:"seg", t:"Segment" }],
    modeHow:{
      build:"Drag the point `vec{r}_0` (whole numbers from −6 to 6) and the tip of the blue arrow `vec{m}` (components from −4 to 4). Tab to a handle and use the arrow keys to move it one grid step.",
      two:"L₁ is ink with a blue arrow. The second description, L₂: " + R + " = `vec{r}_0′ + s vec{m}′`, is teal with dashes. Drag either point or arrow tip; the verdict says how the lines are related.",
      seg:"Drag A and B. The direction is set to `vec{m}` = B − A, and `t` runs only from 0 to 1: the highlighted segment AB. `t = 1/2` marks the midpoint."
    },
    rows:{ vec:"Vector equation", par:"Parametric", pt:"Current point", slope:"Slope", ymxb:"`y = mx + b` form", second:"Second description", verdict:"Verdict", mid:"Midpoint" },
    vertical:"undefined (vertical line)",
    verdict:{
      same:"Directions parallel; {p} is on the first line at {t}: <strong>same line</strong>",
      par:"Directions parallel; {p} is not on the first line: <strong>parallel, distinct</strong>",
      cross:"Directions not parallel: <strong>cross at {p}</strong> ({ts})"
    },
    stepsLabel:"Show the steps",
    playLabel:"Play",
    note:"`t` can be any real number. Scaling `vec{m}` or moving `vec{r}_0` along the line changes the equation, not the line.",
    predIntro:"Make a prediction first. Then the board shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Build, " + R + " = (1, 2) + `t`(3, −1). Where is the point when `t = -2`?",
        options:[{ t:"(−5, 4)", ok:true }, { t:"(7, 0)" }, { t:"(−6, 2)" }, { t:"there is no point for negative `t`" }],
        explain:"(1, 2) − 2(3, −1) = (1 − 6, 2 + 2). (7, 0) uses `t = +2`, and (−6, 2) forgets to add the starting point. Negative `t` goes backwards. " + M7 },
      { id:"p2", prompt:"Change `vec{m}` from (3, −1) to (6, −2). What happens to the line?",
        options:[{ t:"nothing; it’s the same line", ok:true }, { t:"it rotates" }, { t:"it gets twice as steep" }, { t:"it shifts up" }],
        explain:"(6, −2) is parallel to (3, −1): same direction, longer steps. " + M2 },
      { id:"p3", prompt:"Move `vec{r}_0` from (1, 2) to (4, 1), keeping `vec{m}` = (3, −1). Is it the same line?",
        options:[{ t:"yes", ok:true }, { t:"no, a parallel line" }, { t:"no, a crossing line" }, { t:"no line at all" }],
        explain:"(4, 1) = (1, 2) + 1(3, −1) is already on the line. " + M2 },
      { id:"p4", prompt:"Is (10, 0) on " + R + " = (1, 2) + `t`(3, −1)?",
        options:[{ t:"no: `x` needs `t = 3` but `y` needs `t = 2`", ok:true }, { t:"yes, at `t = 3`" }, { t:"yes, at `t = 2`" }, { t:"yes, because both equations can be solved" }],
        explain:"One point, one `t`. At `t = 3` the dot lands at (10, −1), just below (10, 0). " + M3 }
    ],
    chalIntro:"Use the board to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 3], prompt:"Build mode: make the line pass through A(−2, 3) and B(4, −1).",
        why:"Any direction parallel to B − A = (6, −4), such as (3, −2) or (−3, 2), and any starting point on the line, such as A, B, (1, 1) or (−5, 5).",
        hints:["Direction = B − A.", "(6, −4), or the shorter (3, −2).", R + " = (−2, 3) + `t`(3, −2)."],
        msgs:{ mode:"Switch to Build mode first.", ab:"That’s A + B. " + M5, swap:"Components swapped: the slope from A to B is −2/3. " + M4,
          off:"Parallel to AB, but A isn’t on it.", other:"The direction must be parallel to B − A, and the line must pass through A and B." } },
      { id:"tc2", goal:[1, 6], prompt:"Make the line parallel to `y = 2x + 1` through (1, −3), using a direction vector with `x`-component 1.",
        why:"`vec{m}` = (1, 2) has slope 2; any starting point on `y = 2x - 5`, such as (1, −3), (0, −5), (2, −1) or (3, 1), works.",
        hints:["Slope 2 means rise 2 for run 1.", "`vec{m}` = (1, 2).", R + " = (1, −3) + `t`(1, 2)."],
        msgs:{ mode:"Switch to Build mode first.", swap:"Slope 1/2: run and rise swapped. " + M4, orig:"That’s the original line, not a parallel one through (1, −3).",
          xone:"Parallel to `y = 2x + 1`, but use a direction vector with `x`-component 1.", off:"Right direction, but (1, −3) isn’t on your line.",
          other:"Your line’s slope is {m}. A line parallel to `y = 2x + 1` has slope 2." } },
      { id:"tc3", goal:[5], stretch:true, prompt:"Two descriptions mode. L₁: " + R + " = (2, 1) + `t`(4, −2). Set `vec{r}_0′` and `vec{m}′` so the second description is the <strong>same line</strong>, with `vec{r}_0′` ≠ (2, 1) and `vec{m}′` having a <strong>negative</strong> `x`-component.",
        why:"`vec{m}′` = (−2, 1) or (−4, 2), and `vec{r}_0′` any other point of L₁, such as (0, 2), (4, 0), (−2, 3) or (6, −1).",
        hints:["Same line: parallel direction <strong>and</strong> a shared point.", "Directions: multiples of (2, −1) with a negative first component. Points: (2, 1) + `t`(4, −2) for other `t`.", R + " = (0, 2) + `s`(−2, 1) works (it’s `t = -1/2` on L₁)."],
        msgs:{ mode:"Switch to Two descriptions mode first.", l1:"Keep L₁ as " + R + " = (2, 1) + `t`(4, −2): its point at (2, 1) and its blue arrow at (4, −2).",
          origin:"Parallel but distinct: (0, 0) needs `t = -1/2` for `x` but `t = 1/2` for `y`. " + M6,
          notpar:"Not parallel: (−4, −2) has slope 1/2, but L₁ has slope −1/2.", pos:"Same line, but `vec{m}′` needs a <strong>negative</strong> `x`-component.",
          same0:"Same line, but start somewhere other than (2, 1).", dist:"Parallel but distinct: {p} isn’t on L₁. " + M6, cross:"Not parallel: these lines cross at one point." } }
    ]
  },
  part3:{
    slug:"same-line", name:"Same line?",
    heading:"Same line or not?",
    intro:"Each station shows two vector equations, drawn on the grid: L₁ in ink, L₂ in teal dashes. Choose a verdict first. Then step through “Check it with algebra” to test it: are the directions multiples? If yes, is L₂’s point on L₁ (one `t` for both coordinates)? If no, solve for `t` and `s`, then substitute to get the point.",
    verdicts:[{ id:"same", t:"Same line" }, { id:"par", t:"Parallel, distinct" }, { id:"cross", t:"Cross at one point" }],
    verdictFb:{
      right:"Right. Step through the algebra to confirm it.",
      sameWhenPar:"Not quite. " + M6 + " Step through the algebra to see which.",
      parWhenSame:"Not quite. " + M2 + " Step through the algebra: is L₂’s point on L₁?",
      crossWhenPar:"Not quite. The directions are multiples, so the lines are parallel or the same: they can’t cross at just one point.",
      parWhenCross:"Not quite. The directions aren’t multiples, so the lines aren’t parallel: they cross once."
    },
    algTitle:"Check it with algebra",
    locked:"Choose a verdict first.",
    stations:[
      { id:"st1", title:"Station 1", l1:{ p:[1, 1], d:[2, 3] }, l2:{ p:[5, 7], d:[-4, -6] }, answer:"same",
        steps:["Are the directions multiples? (−4, −6) = −2(2, 3). Yes: parallel.",
          "Is (5, 7) on L₁? `x`: `1 + 2t = 5` gives `t = 2`; `y`: `1 + 3(2) = 7` ✓.",
          "One `t` works for both coordinates, so the lines share a point: <strong>same line</strong>."] },
      { id:"st2", title:"Station 2", l1:{ p:[0, 2], d:[1, -1] }, l2:{ p:[3, 3], d:[2, -2] }, answer:"par",
        steps:["Are the directions multiples? (2, −2) = 2(1, −1). Yes: parallel.",
          "Is (3, 3) on L₁? `x`: `0 + t = 3` needs `t = 3`, but then `y = 2 - 3 = -1`, not 3.",
          "No `t` gives (3, 3), so there’s no shared point: <strong>parallel, distinct</strong>."] },
      { id:"st3", title:"Station 3", l1:{ p:[1, 0], d:[1, 2] }, l2:{ p:[0, 7], d:[1, -1] }, answer:"cross",
        steps:["Are the directions multiples? (1, 2) and (1, −1) aren’t: the lines cross at exactly one point.",
          "Set the coordinates equal: `1 + t = s` and `2t = 7 - s`.",
          "Substitute: `2t = 7 - (1 + t)`, so `3t = 6`: `t = 2` and `s = 3`.",
          "Substitute `t = 2` into L₁: (1, 0) + 2(1, 2) = <strong>(3, 4)</strong>. Check on L₂: (0, 7) + 3(1, −1) = (3, 4) ✓."],
        banner:"(2, 3) are the parameter values; (3, 4) is the point. " + M8 },
      { id:"st4", title:"Station 4: the same two lines as `y = mx + b`", l1:{ p:[1, 0], d:[1, 2] }, l2:{ p:[0, 7], d:[1, -1] }, slope:true,
        text:"The pair from station 3, written the Grade 10 way.",
        steps:["L₁: `x = 1 + t`, `y = 2t`. So `t = x - 1` and `y = 2x - 2`.",
          "L₂: `x = s`, `y = 7 - s`. So `y = -x + 7`.",
          "Solve the system: `2x - 2 = -x + 7`, so `3x = 9`: `x = 3` and `y = 4`.",
          "The point (3, 4) again. Two ways to write two lines; one intersection."] }
    ],
    quickCheck:{
      title:"Quick check", summary:"Same line or not? quick check",
      items:[
        { id:"q1", goal:4, prompt:"Which point is on " + R + " = (2, −1) + `t`(1, 3)?",
          choices:[
            { t:"(4, 5)", ok:true, fb:"Right. `t = 2`: (2 + 2, −1 + 6)." },
            { t:"(3, 3)", fb:"`t = 2`: (2 + 2, −1 + 6). (1, 3) is the direction, not a point. " + M1 },
            { t:"(1, 3)", fb:"`t = 2`: (2 + 2, −1 + 6). (1, 3) is the direction, not a point. " + M1 },
            { t:"(2, 3)", fb:"`t = 2`: (2 + 2, −1 + 6). (1, 3) is the direction, not a point. " + M1 }] },
        { id:"q2", goal:5, prompt:R + " = (0, 4) + `t`(2, −1) and " + R + " = (6, 1) + `s`(−4, 2)?",
          choices:[
            { t:"Same line", ok:true, fb:"Right. Parallel directions, and (6, 1) is on the first line at `t = 3`." },
            { t:"Parallel, distinct", fb:"Parallel directions, and (6, 1) is on the first line at `t = 3`." },
            { t:"Cross at one point", fb:"Parallel directions, and (6, 1) is on the first line at `t = 3`." },
            { t:"Perpendicular", fb:"Parallel directions, and (6, 1) is on the first line at `t = 3`." }] },
        { id:"q3", goal:5, prompt:R + " = (1, 1) + `t`(1, −1) and " + R + " = `s`(1, 1)?",
          choices:[
            { t:"Cross at (1, 1)", ok:true, fb:"Right. `1 + t = s` and `1 - t = s` give `t = 0`, `s = 1`: the point (1, 1)." },
            { t:"Same line", fb:"`1 + t = s` and `1 - t = s` give `t = 0`, `s = 1`: the point (1, 1)." },
            { t:"Parallel, distinct", fb:"`1 + t = s` and `1 - t = s` give `t = 0`, `s = 1`: the point (1, 1)." },
            { t:"Cross at (0, 0)", fb:"`1 + t = s` and `1 - t = s` give `t = 0`, `s = 1`: the point (1, 1)." }] },
        { id:"q4", goal:6, prompt:"A direction vector for `y = -3x + 2`?",
          choices:[
            { t:"(1, −3)", ok:true, fb:"Right. Run 1, rise −3." },
            { t:"(−3, 1)", fb:"Run 1, rise −3. (−3, 1) has slope −1/3. " + M4 },
            { t:"(3, 1)", fb:"Run 1, rise −3. (3, 1) has slope 1/3. " + M4 },
            { t:"(0, 2)", fb:"Run 1, rise −3. (0, 2) is the `y`-intercept, not a direction." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Description ↔ vector equation", summary:"Description ↔ vector equation", goal:[1, 2, 3, 6],
        instruction:"Match each description to its vector equation. One equation on the right has no partner.",
        how:"Tap a description, then tap its vector equation on the right.",
        leftTitle:"Description", rightTitle:"Vector equation",
        left:[
          { id:"l1", goal:1, t:"Through (2, −1), parallel to (3, 4)", why:"Point (2, −1) added; direction (3, 4) multiplied by `t`." },
          { id:"l2", goal:3, t:"Through (0, 0) and (2, 5)", why:"Start at the origin; direction (2, 5) − (0, 0)." },
          { id:"l3", goal:6, t:"`y = 3x - 2`", why:"`y`-intercept (0, −2); slope 3 gives direction (1, 3)." },
          { id:"l4", goal:6, t:"The vertical line `x = 4`", why:"(4, 0) is on it; vertical means direction (0, 1)." },
          { id:"l5", goal:6, t:"The horizontal line through (1, −3)", why:"Horizontal means direction (1, 0)." },
          { id:"l6", goal:3, t:"Through A(1, 2) and B(−3, 4)", why:"B − A = (−4, 2), which is parallel to (2, −1).",
            hints:["Direction B − A.", "(−4, 2), which is parallel to (2, −1).", R + " = (1, 2) + `t`(2, −1)."] },
          { id:"l7", goal:2, t:"`x = 3 - t`, `y = 2t`", why:"The constants give the point (3, 0); the coefficients of `t` give the direction (−1, 2)." },
          { id:"l8", goal:6, t:"`y = -{1}/{2}x + 1`", why:"`y`-intercept (0, 1); slope `-{1}/{2}` means run 2, rise −1.",
            hints:["Slope `-{1}/{2}` means run 2, rise −1.", "`y`-intercept 1 gives the point (0, 1).", R + " = (0, 1) + `t`(2, −1)."] }
        ],
        right:[
          { id:"r1", t:R + " = (2, −1) + `t`(3, 4)" },
          { id:"r2", t:R + " = `t`(2, 5)" },
          { id:"r3", t:R + " = (0, −2) + `t`(1, 3)" },
          { id:"r4", t:R + " = (4, 0) + `t`(0, 1)" },
          { id:"r5", t:R + " = (1, −3) + `t`(1, 0)" },
          { id:"r6", t:R + " = (1, 2) + `t`(2, −1)" },
          { id:"r7", t:R + " = (3, 0) + `t`(−1, 2)" },
          { id:"r8", t:R + " = (0, 1) + `t`(2, −1)" },
          { id:"r9", t:R + " = (3, 4) + `t`(2, −1)" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l6|r8":"Same direction, but is (1, 2) on `y = -{1}/{2}x + 1`? `-{1}/{2} + 1 = {1}/{2} ≠ 2`. " + M6,
          "l8|r6":"Same direction, but is (1, 2) on `y = -{1}/{2}x + 1`? `-{1}/{2} + 1 = {1}/{2} ≠ 2`. " + M6,
          "l4|r5":"`x = 4` is vertical: direction (0, 1).",
          "l5|r4":"`x = 4` is vertical: direction (0, 1). A horizontal line has direction (1, 0).",
          "l1|r9":"(3, 4) is the direction here, not a point. " + M1
        },
        wrongDefault:"Check the point first, then the direction." },
      { id:"missing", type:"custom", title:"The missing piece", summary:"The missing piece", star:true, goal:[2, 3, 4, 5, 6],
        instruction:"Find the missing number or point. Items 4 to 7 are non-routine; 6 and 7 go beyond the Final Check.",
        how:"Type whole numbers or fractions, such as 5 or −2/3. A point takes two boxes.",
        items:[
          { id:"n1", goal:4, prompt:"For which `t` is (−1, 8) on " + R + " = (3, 0) + `t`(−2, 4)?",
            boxes:[{ k:"t", pre:"`t =`", label:"t" }], answer:{ t:"2" }, display:"`t = 2`",
            wrong:[{ v:{ t:"−2" }, fb:"3 − 2(−2) = 7, not −1." }],
            why:"`x`: `3 - 2t = -1` gives `t = 2`; `y`: `0 + 4(2) = 8` ✓." },
          { id:"n2", goal:4, prompt:"(`k`, −5) lies on " + R + " = (1, 3) + `t`(2, −4). Find `k`.",
            boxes:[{ k:"k", pre:"`k =`", label:"k" }], answer:{ k:"5" }, display:"`k = 5`",
            wrong:[{ v:{ k:"2" }, fb:"That’s `t`. Substitute it: `k = 1 + 2(2)`. " + M8 }],
            why:"`y`: `3 - 4t = -5` gives `t = 2`, so `k = 1 + 2(2) = 5`." },
          { id:"n3", goal:2, prompt:"Where does " + R + " = (2, 6) + `t`(1, −3) cross the `x`-axis? Enter `x`.",
            boxes:[{ k:"x", pre:"`x =`", label:"x" }], answer:{ x:"4" }, display:"`x = 4`",
            wrong:[{ v:{ x:"2" }, fb:"That’s `t`; `x = 2 + 2 = 4`." }],
            why:"On the `x`-axis, `y = 0`: `6 - 3t = 0` gives `t = 2`, so `x = 2 + 2 = 4`." },
          { id:"n4", goal:3, star:true, prompt:"Line through (1, 2) and (7, 5). Find the point two-thirds of the way from the first to the second.",
            point:true, answer:{ x:"5", y:"4" }, display:"(5, 4)",
            wrong:[{ v:{ x:"3", y:"3" }, fb:"That’s one-third of the way." }, { v:{ x:"11", y:"7" }, fb:"Add `{2}/{3}` of B − A to A, not to B." },
              { v:{ x:"8", y:"7" }, fb:"That’s A + B. Add `{2}/{3}` of B − A to A." }],
            why:"B − A = (6, 3), so (1, 2) + `{2}/{3}`(6, 3) = (1 + 4, 2 + 2) = (5, 4)." },
          { id:"n5", goal:6, star:true, prompt:R + " = (`a`, 1) + `t`(2, `b`) is the same line as `y = 3x - 5`. Find `a` and `b`.",
            boxes:[{ k:"a", pre:"`a =`", label:"a" }, { k:"b", pre:"`b =`", label:"b" }], answer:{ a:"2", b:"6" }, display:"`a = 2`, `b = 6`",
            wrong:[{ v:{ b:"3" }, fb:"(2, `b`) must be parallel to (1, 3): `b = 6`. " + M4 }],
            why:"(2, `b`) = 2(1, 3) gives `b = 6`; (`a`, 1) on the line: `1 = 3a - 5`, so `a = 2`.",
            hints:["Same line: parallel direction and a shared point.", "`y = 3x - 5` has direction (1, 3), so (2, `b`) = 2(1, 3).", "(`a`, 1) on the line: `1 = 3a - 5`, so `a = 2`."] },
          { id:"n6", goal:5, star:true, prompt:"Find `k` so that " + R + " = (1, 1) + `t`(2, 1) and " + R + " = (7, 0) + `s`(`k`, 3) are parallel.",
            boxes:[{ k:"k", pre:"`k =`", label:"k" }], answer:{ k:"6" }, display:"`k = 6`",
            wrong:[{ v:{ k:"2/3" }, fb:"(`k`, 3) = 3(2, 1) needs `k = 6`." }],
            why:"Parallel means (`k`, 3) is a multiple of (2, 1). The `y`-components give the multiple 3, so `k = 3(2) = 6`." },
          { id:"n7", goal:5, star:true, prompt:"Where do " + R + " = (0, 1) + `t`(1, 1) and " + R + " = (6, 1) + `s`(−2, 1) meet?",
            point:true, answer:{ x:"2", y:"3" }, display:"(2, 3)",
            wrong:[{ v:{ x:"2", y:"2" }, fb:"`t = s = 2` are parameters; substitute. " + M8 }],
            why:"`t = 6 - 2s` and `1 + t = 1 + s` give `t = s = 2`, so the point is (0, 1) + 2(1, 1) = (2, 3).",
            hints:["Set the `x`’s equal and the `y`’s equal.", "`t = 6 - 2s` and `1 + t = 1 + s`, so `t = s`.", "`s = 6 - 2s` gives `s = 2`, so `t = 2` and the point is (0, 1) + 2(1, 1) = (2, 3)."] }
        ],
        msgs:{
          wrong:"Write the equations one coordinate at a time, find one `t` that works for both, then substitute.",
          half:"Your {k} is right; check the other box.",
          empty:"Fill in every box first.",
          err:"Type a whole number or a fraction such as 5 or −2/3 in each box."
        } },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Yara", how:"", goal:[3, 4, 5],
        instruction:"Yara made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Find a vector equation of the line through A(2, −1) and B(5, 3).",
            steps:["A point on the line: A(2, −1).", "Direction: `vec{m}` = B − A = (3, 4).", R + " = (3, 4) + `t`(2, −1).", "Check: `t = 1` gives (5, 3) = B. ✓"],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 checks only one point. The mistake is earlier."],
            fixes:[
              { t:R + " = (2, −1) + `t`(3, 4).", ok:true, why:M1 },
              { t:R + " = (2, −1) + `t`(5, 3).", why:"(5, 3) is B’s position, not the direction. " + M5 },
              { t:R + " = (3, 4) + `t`(5, 3).", why:"(3, 4) is the direction, so it can’t be the added point, and (5, 3) is B’s position, not a direction. " + M1 },
              { t:"Step 3 is correct; step 4 proves it.", why:"Passing through B isn’t enough: `t = 0` gives (3, 4), and the slope from A to (3, 4) is 5, not 4/3. " + M1 }],
            hints:["Which vector is the point and which is the direction?", "The point is added; the direction is multiplied by `t`.", "(2, −1) + `t`(3, 4)."] },
          { id:"e2", goal:4, task:"Is P(7, 3) on the line `x = 1 + 3t`, `y = 5 - 2t`?",
            steps:["`x`: `1 + 3t = 7`, so `t = 2`.", "`y`: `5 - 2t = 3`, so `t = 1`.", "Each coordinate has a value of `t`, so P is on the line.", "P is the point at `t = 1.5`."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 builds on step 3. The mistake is earlier."],
            fixes:[
              { t:"The `t`-values differ (2 and 1), so no single `t` gives P. P is not on the line.", ok:true, why:M3 },
              { t:"Average them: `t = 1.5`.", why:"`t = 1.5` gives (5.5, 2)." },
              { t:"Use `t = 2`: P is on the line.", why:"`t = 2` gives (7, 1)." },
              { t:"Step 3 is correct.", why:M3 }],
            hints:["How many `t`-values does one point have?", "One.", "2 ≠ 1, so P is not on the line."] },
          { id:"e3", goal:5, task:"Are L₁: " + R + " = (1, 4) + `t`(2, −6) and L₂: " + R + " = (3, −1) + `s`(−1, 3) the same line?",
            steps:["(2, −6) = −2(−1, 3), so the directions are parallel.", "Parallel directions mean the lines are the same.", "So L₁ and L₂ coincide."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2. The mistake is earlier."],
            fixes:[
              { t:"Parallel directions give the same line <strong>or</strong> parallel lines. Test (3, −1) on L₁: `t = 1` gives (3, −2), not (3, −1). They are parallel and distinct.", ok:true, why:M6 },
              { t:"The directions aren’t parallel, because −2 is negative.", why:"A negative multiple is still parallel." },
              { t:"The lines cross at (3, −1).", why:"Parallel lines don’t cross." },
              { t:"Step 2 is correct.", why:M6 }],
            hints:["What else must be true for the same line?", "They must share a point.", "(3, −1) isn’t on L₁: parallel, distinct."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in Explore: that negative `t` works, or that so many different equations draw the same line?" },
      { id:"j2", q:"In your own words, what does the parameter `t` do in `vec{r} = vec{r}_0 + t vec{m}`?" },
      { id:"j3", q:"Explain to a friend how to decide whether two vector equations describe the same line." },
      { id:"j4", q:"Which part (two points, testing a point, or intersections) still feels shaky? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which is a vector equation of the line through (4, −2) with direction vector (1, 5)?", options:[
          { t:R + " = (4, −2) + `t`(1, 5)", ok:true, why:"The point is added; the direction (1, 5) is multiplied by `t`." },
          { t:R + " = (1, 5) + `t`(4, −2)", why:"Point and direction swapped. " + M1 },
          { t:R + " = (4, −2) + `t`(5, 1)", why:"The direction is (1, 5), not (5, 1). " + M4 },
          { t:R + " = (4, −2) + (1, 5)", why:"With no `t`, that’s a single point." }] },
        b:{ prompt:"Which is a vector equation of the line through (−3, 1) with direction vector (2, −7)?", options:[
          { t:R + " = (−3, 1) + `t`(2, −7)", ok:true, why:"The point is added; the direction (2, −7) is multiplied by `t`." },
          { t:R + " = (2, −7) + `t`(−3, 1)", why:"Point and direction swapped. " + M1 },
          { t:R + " = (−3, 1) + `t`(−7, 2)", why:"The direction is (2, −7), not (−7, 2). " + M4 },
          { t:R + " = (−3, 1) + (2, −7)", why:"No parameter: one point." }] } },
      { id:"k2", cat:"K", goal:[2, 4],
        a:{ prompt:"`x = 2 - t`, `y = 3 + 4t`. Which point is on the line?", options:[
          { t:"(0, 11)", ok:true, why:"`t = 2` gives (0, 11)." },
          { t:"(1, 6)", why:"`x = 1` needs `t = 1`, which gives `y = 7`. " + M3 },
          { t:"(3, 7)", why:"Sign slip: `x = 3` needs `t = -1`, which gives `y = -1`." },
          { t:"(−1, 4)", why:"`x = -1` needs `t = 3`, which gives `y = 15`. " + M3 }] },
        b:{ prompt:"`x = -1 + 2t`, `y = 5 - t`. Which point is on the line?", options:[
          { t:"(5, 2)", ok:true, why:"`t = 3` gives (5, 2)." },
          { t:"(5, 3)", why:"`x = 5` needs `t = 3`, which gives `y = 2`. " + M3 },
          { t:"(−3, 4)", why:"Sign slips: `x = -3` needs `t = -1`, which gives `y = 6`." },
          { t:"(3, 6)", why:"`x = 3` needs `t = 2`, which gives `y = 3`. " + M3 }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which could be a direction vector for the line through P(3, −1) and Q(−1, 5)?", options:[
          { t:"(−2, 3)", ok:true, why:"Q − P = (−4, 6) = 2(−2, 3)." },
          { t:"(2, 4)", why:"That’s P + Q. " + M5 },
          { t:"(4, 6)", why:"The two components were subtracted in different orders." },
          { t:"(−1, 5)", why:"That’s Q’s position vector. " + M5 }] },
        b:{ prompt:"Which could be a direction vector for the line through P(−2, 4) and Q(4, 1)?", options:[
          { t:"(2, −1)", ok:true, why:"Q − P = (6, −3) = 3(2, −1)." },
          { t:"(2, 5)", why:"P + Q. " + M5 },
          { t:"(6, 3)", why:"Mixed subtraction order." },
          { t:"(4, 1)", why:"Q’s position vector. " + M5 }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"For which value of `k` is (`k`, 7) on " + R + " = (2, −1) + `t`(3, 4)?", options:[
          { t:"8", ok:true, why:"`-1 + 4t = 7` gives `t = 2`, so `k = 2 + 6`." },
          { t:"2", why:"That’s `t`, not `k`. " + M8 },
          { t:"6.5", why:"`4t = 7 - (-1) = 8`, not 6." },
          { t:"23", why:"That uses `t = 7`, the `y`-value." }] },
        b:{ prompt:"For which value of `k` is (−4, `k`) on " + R + " = (5, 2) + `t`(−3, 1)?", options:[
          { t:"5", ok:true, why:"`5 - 3t = -4` gives `t = 3`, so `k = 2 + 3`." },
          { t:"3", why:"That’s `t`. " + M8 },
          { t:"−1", why:"Sign slip: `t = 3`, not −3." },
          { t:"−2", why:"That uses `t = -4`, the `x`-value." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"L₁: " + R + " = (1, 2) + `t`(3, −6), L₂: " + R + " = (4, −4) + `s`(−1, 2). How are they related?", options:[
          { t:"They are the same line", ok:true, why:"(3, −6) = −3(−1, 2), and (4, −4) is on L₁ at `t = 1`." },
          { t:"Parallel and distinct", why:"Different equations can describe one line; (4, −4) is on L₁. " + M2 },
          { t:"They cross only at (4, −4)", why:"They share every point, not just one." },
          { t:"Perpendicular", why:"(3, −6) · (−1, 2) = −15 ≠ 0." }] },
        b:{ prompt:"L₁: " + R + " = (2, 0) + `t`(1, 3), L₂: " + R + " = (0, −5) + `s`(−2, −6). How are they related?", options:[
          { t:"Parallel and distinct", ok:true, why:"(−2, −6) = −2(1, 3), but (0, −5) isn’t on L₁: `t = -2` gives (0, −6)." },
          { t:"The same line", why:M6 },
          { t:"They cross at (0, −5)", why:"Parallel lines don’t cross." },
          { t:"They cross once, because the directions point opposite ways", why:"Opposite directions are still parallel." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Where do " + R + " = (−1, 0) + `t`(2, 1) and " + R + " = (5, −2) + `s`(−1, 2) meet?", options:[
          { t:"(3, 2)", ok:true, why:"`-1 + 2t = 5 - s` and `t = -2 + 2s` give `t = 2`, `s = 2`; then (−1, 0) + 2(2, 1) = (3, 2)." },
          { t:"(2, 2)", why:"Those are the parameter values. " + M8 },
          { t:"(5, −2)", why:"That’s only L₂’s point at `s = 0`; it isn’t on L₁." },
          { t:"They don’t meet, because the directions aren’t multiples", why:"Non-parallel lines in R² always meet exactly once." }] },
        b:{ prompt:"Where do " + R + " = (2, −1) + `t`(1, 1) and " + R + " = (−4, 5) + `s`(3, −1) meet?", options:[
          { t:"(5, 2)", ok:true, why:"`t = 3`, `s = 3`; then (2, −1) + 3(1, 1) = (5, 2)." },
          { t:"(3, 3)", why:"Those are the parameter values. " + M8 },
          { t:"(−4, 5)", why:"L₂’s starting point isn’t on L₁." },
          { t:"They don’t meet", why:"Non-parallel lines meet once." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which best explains why " + R + " = (1, 3) + `t`(2, 4) and " + R + " = (2, 5) + `s`(1, 2) describe the same line?", options:[
          { t:"“The directions are parallel ((2, 4) = 2(1, 2)) and (2, 5) is on the first line (at `t = 1/2`), so every point of one is on the other.”", ok:true, why:"Same line: parallel directions <strong>and</strong> a shared point." },
          { t:"“The directions are parallel, so the lines must be the same.”", why:"Parallel lines would also have parallel directions. " + M6 },
          { t:"“Both pass through (0, 1).”", why:"One shared point isn’t enough: crossing lines share a point too." },
          { t:"“Both direction vectors have positive components.”", why:"That says nothing about where the lines are." }] },
        b:{ prompt:"Which best explains why " + R + " = (0, −2) + `t`(3, 1) and " + R + " = (6, 0) + `s`(−6, −2) describe the same line?", options:[
          { t:"“(−6, −2) = −2(3, 1), so the directions are parallel, and (6, 0) is on the first line at `t = 2`.”", ok:true, why:"Same line: parallel directions <strong>and</strong> a shared point." },
          { t:"“The directions are parallel, so the lines are the same.”", why:M6 },
          { t:"“Both pass through (3, −1).”", why:"One shared point isn’t enough." },
          { t:"“The second direction is negative, so it’s the first line reversed.”", why:"Reversing a direction alone doesn’t make the lines the same; they must share a point." }] } },
      { id:"c2", cat:"C", goal:[1, 2],
        a:{ prompt:"Which statement about vector equations of a line is true?", options:[
          { t:"“A line has infinitely many vector equations: any point on it can be `vec{r}_0`, and any non-zero multiple of a direction vector can be `vec{m}`.”", ok:true, why:M2 },
          { t:"“Each line has exactly one vector equation.”", why:M2 },
          { t:"“The direction vector must have a positive `x`-component.”", why:"(−3, 2) and (3, −2) describe the same direction of line." },
          { t:"“`t` must be between 0 and 1.”", why:"That gives a segment, not the line. " + M7 }] },
        b:{ prompt:"In " + R + " = `vec{A} + t(vec{B} - vec{A})`, which points do `0 <= t <= 1` give?", options:[
          { t:"“The segment from A to B: `t = 0` at A, `t = 1` at B, `t = 1/2` at the midpoint.”", ok:true, why:M7 },
          { t:"“The whole line through A and B.”", why:"That needs every real `t`. " + M7 },
          { t:"“The ray starting at A and going away from B.”", why:"The direction B − A points toward B." },
          { t:"“Only the points A and B.”", why:"Every `t` between 0 and 1 gives a point between them." }] } },
      { id:"a1", cat:"A", goal:[2, 6],
        a:{ prompt:"A drone flies in a straight line. Its position (in metres) after `t` seconds is (`x`, `y`) = (−20, 40) + `t`(6, −8). When and where does it cross the `x`-axis?", options:[
          { t:"After 5 s, at (10, 0)", ok:true, why:"`40 - 8t = 0` gives `t = 5`; `x = -20 + 30`." },
          { t:"After 5 s, at (−20, 0)", why:"`x` changes too: −20 + 6(5) = 10." },
          { t:"After 5 s, at (30, 0)", why:"6 × 5 = 30, but the drone started at `x = -20`." },
          { t:"After 10/3 s", why:"That’s when `x = 0`: it crosses the `y`-axis then." }] },
        b:{ prompt:"Position (m) after `t` seconds: (`x`, `y`) = (60, −30) + `t`(−10, 6). When and where does it cross the `x`-axis?", options:[
          { t:"After 5 s, at (10, 0)", ok:true, why:"`-30 + 6t = 0` gives `t = 5`; `x = 60 - 50`." },
          { t:"After 5 s, at (60, 0)", why:"`x` changes too." },
          { t:"After 5 s, at (−50, 0)", why:"Forgot the start, 60." },
          { t:"After 6 s", why:"That’s when `x = 0`." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A rail line follows `y = {1}/{2}x + 3` (in km). A survey team starts at (0, 3) and walks along it at a steady pace, covering √5 km each hour. Which equation, with `t` in hours, describes their walk?", options:[
          { t:R + " = (0, 3) + `t`(2, 1)", ok:true, why:"(2, 1) has slope `{1}/{2}` and length √5." },
          { t:R + " = (0, 3) + `t`(1, 2)", why:"Slope 2: run and rise swapped. " + M4 },
          { t:R + " = (0, 3) + `t`(1, `{1}/{2}`)", why:"The right line, but each hour covers only `√{1 + {1}/{4}} = {√5}/{2}` km." },
          { t:R + " = (3, 0) + `t`(2, 1)", why:"(3, 0) isn’t on the rail line: coordinates swapped." }] },
        b:{ prompt:"A trail follows `y = -2x + 1` (km). Hikers start at (0, 1) heading toward positive `x`, covering √5 km each hour. Which equation describes their walk?", options:[
          { t:R + " = (0, 1) + `t`(1, −2)", ok:true, why:"Slope −2, length √5." },
          { t:R + " = (0, 1) + `t`(−2, 1)", why:"Run and rise swapped: slope `-{1}/{2}`. " + M4 },
          { t:R + " = (0, 1) + `t`(2, −4)", why:"The right line, but 2√5 km each hour." },
          { t:R + " = (1, 0) + `t`(1, −2)", why:"(1, 0) isn’t on the trail: −2(1) + 1 = −1." }] } }
    ]
  },
  task:{
    title:"Quadrant to quadrant", summary:"Quadrant to quadrant",
    statement:"<p>Line L passes through P(1, 2) and Q(5, 0). Design a vector equation " + R + " = (`a`, `b`) + `t`(`c`, `d`) that meets every condition. Can you find all the answers?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>It describes line L.</li><li>Its starting point (`t = 0`) is in quadrant 2.</li><li>Its point at `t = 2` is in quadrant 4.</li></ol></div>" +
      "<p class=\"tiny muted\">`a`, `b`, `c` and `d` are whole numbers from −6 to 6, and (`c`, `d`) can’t be (0, 0). The graph shows L (faint dashes), your line and its points at `t = 0`, 1 and 2.</p>",
    checks:["Same line as L", "Start in quadrant 2", "`t = 2` point in quadrant 4"],
    tips:["L’s direction is Q − P = (4, −2), so (`c`, `d`) must be a multiple of (2, −1); the start must satisfy `x + 2y = 5`.",
      "Points of L in quadrant 2 have `x < 0`: try (−1, 3).",
      "Two steps of (`c`, `d`) must carry you past the `x`-axis into quadrant 4: use a longer step."],
    explainPrompt:"Explain why all your answers describe the same line, and how the starting point and step length control where `t = 2` lands.",
    vocab:"Use the words direction vector, parameter, point on the line and parallel.",
    after3:"All four are the same line L. They differ only in where they start and how long each step is.",
    afterAt:4
  },
  cards:[
    ["Vector equation of a line", "`vec{r} = vec{r}_0 + t vec{m}`, `t ∈ ℝ`: a point plus multiples of a direction."],
    ["Parametric equations", "`x = x_0 + t m_1`, `y = y_0 + t m_2`."],
    ["Direction through A and B", "`vec{m} = vec{AB}` = B − A."],
    ["Many equations, one line", "Any point on the line; any non-zero multiple of `vec{m}`."],
    ["Is P on the line?", "Find `t` from one coordinate; it must work in the other too."],
    ["Direction from slope `m`", "(1, `m`); e.g. slope −3 → (1, −3)."],
    ["Slope from direction (`m_1`, `m_2`)", "`m_2/m_1` (undefined if `m_1 = 0`: vertical)."],
    ["Same line", "Parallel directions <strong>and</strong> a shared point."],
    ["Parallel, distinct", "Parallel directions, no shared point."],
    ["Crossing lines", "Solve `vec{r}_0 + t vec{m} = vec{r}_0′ + s vec{m}′` for `t` and `s`; substitute to get the point."],
    ["Segment AB", "`vec{r} = vec{A} + t(vec{B} - vec{A})` with `0 <= t <= 1`; `t = 1/2` is the midpoint."]
  ]
};
