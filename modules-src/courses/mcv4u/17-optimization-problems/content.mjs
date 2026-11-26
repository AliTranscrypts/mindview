// MCV4U 17 Optimization Problems. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/17-optimization-problems.md
// Leibniz "d/dx" built by hand so the d stays upright (as in MCV4U 07/10/11/14)
const DDX = '<span class="m">d/d<i>x</i></span>';
// misconception core sentences (plan §3); "(Mn)" tags in the plan get the item's own numbers where the core sentence doesn't fit
const M1 = "Use the constraint to replace `y`: with `2x + y = 600`, `y = 600 - 2x`.";
const M3 = "Symmetry guesses fail when the sides play different roles (one side is the river, one side costs more).";
const M4 = "A critical number is only a candidate. Here the critical number gives the <strong>minimum</strong> area; the maximum is at an endpoint.";
const M5 = "`x = 10` is the width. The question asked for the area: `A(10) = 100`.";
const M6 = DDX + "`(2x^2) = 4x`.";
const M7 = "`A = 0` gives the zero-area designs. The best design is where `A′ = 0`.";
const HERO_EQ = '<span class="op-heq"><span class="op-ht">constraint</span><span class="op-arr" aria-hidden="true">→</span>' +
  '<span class="op-ht">model `V(x)` on `[0, 12]`</span><span class="op-arr" aria-hidden="true">→</span>' +
  '<span class="op-ht">`V′(x) = 0`</span><span class="op-arr" aria-hidden="true">→</span><span class="op-ht">compare</span></span>';
const COND = '<div class="refresh" style="margin:0 0 12px"><h4>The conditions</h4><ol style="margin:0;padding-left:1.3em">' +
  "<li>The best cut is a whole number of centimetres.</li><li>The sheet is not a square.</li><li>The largest box holds at least 1000 cm³.</li></ol></div>";

export default {
  id:"17-optimization-problems",
  kind:"topic",
  title:"Optimization problems",
  topic:"Optimization Problems",
  readyTopic:"optimization problems",
  hero:{
    eq:HERO_EQ,
    eqLabel:"constraint, then a one-variable model V of x on 0 to 12, then V prime of x equals 0, then compare",
    eqSize:"sm",
    headline:"Find the best design, not just a good one",
    text:"Optimization means finding the <strong>maximum</strong> or <strong>minimum</strong> of a quantity. First build a <strong>model</strong>: one function of one variable, with a <strong>domain</strong> set by the situation. Then use the derivative to find the candidates and compare them, as in module 16.",
    fig:{ html:'<div class="op-hero" id="op-hero"></div>', caption:"`V(x) = x(24 - 2x)^2`" }
  },
  goals:[
    "I can choose a variable and use a constraint to write the quantity to optimize as a function of one variable.",
    "I can state the domain of the model from the physical situation.",
    "I can find the critical numbers of the model and solve `f′(x) = 0` correctly.",
    "I can carry out the whole optimization algorithm, including geometric and surface-area problems.",
    "I can recognize when the best value occurs at an endpoint of the domain.",
    "I can justify that my answer is the maximum or minimum and state the final answer with units."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Formulas", goal:1, prompt:"An open box (no lid) has a square base of side `x` and height `h`. What is its surface area?",
          options:[
            { t:"`x^2 + 4xh`", ok:true, why:"One base plus four sides of `x` by `h`." },
            { t:"`2x^2 + 4xh`", why:"The box is open." },
            { t:"`x^2h`", why:"That’s the volume." },
            { t:"`x^2 + 2xh`", why:"A box has four sides." }],
          hints:["List the faces.", "Base: `x^2`. Each side: `xh`.", "`x^2 + 4xh`."] },
        { id:"w2", skill:"Formulas", goal:1, prompt:"A box is made by cutting squares of side `x` from the corners of a 20 cm × 30 cm sheet. What is its volume?",
          options:[
            { t:"`x(20 - 2x)(30 - 2x)`", ok:true, why:"Each side loses `2x`; the height is `x`." },
            { t:"`x(20 - x)(30 - x)`", why:"Each side loses a square at both ends." },
            { t:"`(20 - 2x)(30 - 2x)`", why:"Multiply by the height `x`." },
            { t:"`x^2(20)(30)`", why:"The base shrinks." }],
          hints:["What happens to the 20 cm side?", "It loses `x` at each end: `20 - 2x`.", "`V = x(20 - 2x)(30 - 2x)`."] },
        { id:"w3", skill:"One variable", goal:1, prompt:"A rectangle has perimeter 50 m and width `x`. What is its length?",
          options:[
            { t:"`25 - x`", ok:true, why:"`2x + 2L = 50`, so `L = 25 - x`." },
            { t:"`50 - x`", why:"`2x + 2L = 50`." },
            { t:"`50 - 2x`", why:"That’s `2L`." },
            { t:"`50/x`", why:"Perimeter adds sides." }],
          hints:["Write the perimeter.", "`2x + 2L = 50`.", "`L = 25 - x`."] },
        { id:"w4", skill:"One variable", goal:1, prompt:"A square-based box has volume 500 cm³ and base side `x`. Write `h` in terms of `x`.",
          options:[
            { t:"`h = 500/x^2`", ok:true, why:"`x^2h = 500`." },
            { t:"`h = 500/x`", why:"The base area is `x^2`." },
            { t:"`h = 500 - x^2`", why:"Volume = base area × height, so divide by `x^2`; don’t subtract." },
            { t:"`h = √{500/x}`", why:"Divide by `x^2`, no root." }],
          hints:["Volume = base area × height.", "`x^2h = 500`.", "`h = 500/x^2`."] },
        { id:"w5", skill:"Derivatives", goal:3, prompt:"If `A(x) = 600x - 2x^2`, which `x` makes `A′(x) = 0`?",
          options:[
            { t:"150", ok:true, why:"`A′ = 600 - 4x = 0`." },
            { t:"300", why:"`A(300) = 0`: that’s a zero of `A`." },
            { t:"600", why:"`A′ = 600 - 4x`." },
            { t:"75", why:"`4x = 600` gives 150." }],
          hints:["Differentiate.", "`600 - 4x`.", "`x = 150`."] },
        { id:"w6", skill:"Derivatives", goal:3, prompt:"If `S(x) = x^2 + 32/x`, what is `S′(x)`?",
          options:[
            { t:"`2x - 32/x^2`", ok:true, why:"`32/x = 32x^{-1}`, whose derivative is `-32x^{-2}`." },
            { t:"`2x + 32/x^2`", why:"`x^{-1} -> -x^{-2}`." },
            { t:"`2x - 32`", why:"Rewrite `32/x` as a power first." },
            { t:"`2x + 32 ln x`", why:"Not this module; and the power rule works for `x^{-1}`." }],
          hints:["Write `32/x` as `32x^{-1}`.", "Power rule: `-32x^{-2}`.", "`2x - 32/x^2`."] }
      ],
      refreshers:{
        "Formulas":"Open box: `S = x^2 + 4xh`. Box from a sheet: `V = x(L - 2x)(W - 2x)`. Draw it and label every edge first.",
        "One variable":"Use the constraint (the fixed perimeter, area or volume) to write the second variable in terms of the first.",
        "Derivatives":"Rewrite `k/x` as `kx^{-1}`. Critical numbers come from the <strong>derivative</strong> = 0, not the function = 0."
      }
    }
  },
  explore:{
    heading:"Box builder",
    intro:"Change the cut and watch the box. Then switch to the field along the river. Find the best design in each.",
    ui:{
      scen:[{ id:"box", t:"Box from a sheet" }, { id:"field", t:"Field along a river" }],
      sheets:[{ id:"24", t:"24 cm × 24 cm" }, { id:"45", t:"45 cm × 24 cm" }],
      fences:[{ id:"600", t:"600 m" }, { id:"1200", t:"1200 m" }],
      showD:"Show `V′`", divider:"Divider",
      how:{ box:"Drag the dot on the graph, or use the slider (arrow keys move the cut by 0.5 cm; Shift + arrows by 2 cm). You can also type a cut and press Enter.",
        field:"Drag the dot on the graph, or use the slider (arrow keys move the width by 5 m; Shift + arrows by 50 m). You can also type a width and press Enter. The divider adds one fence parallel to the widths, making two pens." },
      ansLabel:"Your answer for the challenges:",
      rows:{ model:"Model", domain:"Domain", dims:"Dimensions", qty:"Quantity", slope:"Slope", best:"Best so far" },
      more:"More"
    },
    predIntro:"Make a prediction first. Then the box (or the field) and its graph show you what really happens.",
    predictions:[
      { id:"p1", prompt:"24 × 24 sheet. As the cut grows from 1 cm to 11 cm, what happens to the volume?",
        options:[{ t:"it increases, then decreases", ok:true }, { t:"it always increases" }, { t:"it always decreases" }, { t:"it stays the same" }],
        explain:"Small cuts make a flat tray; big cuts make a thin tower. Somewhere between is the best box." },
      { id:"p2", prompt:"Which cut gives the largest box from the 24 × 24 sheet?",
        options:[{ t:"4 cm", ok:true }, { t:"6 cm" }, { t:"8 cm (the cut that makes a cube)" }, { t:"12 cm" }],
        explain:"`V′(x) = (24 - 2x)(24 - 6x) = 0` at `x = 4`. The cube at `x = 8` holds only 512 cm³." },
      { id:"p3", prompt:"Field, 600 m of fence. Which width gives the largest field?",
        options:[{ t:"150 m", ok:true }, { t:"200 m (all three sides equal)" }, { t:"100 m" }, { t:"300 m" }],
        explain:"The river side is free, so the long side should be twice the width: 150 m by 300 m." },
      { id:"p4", prompt:"If the fence doubles to 1200 m, the largest area …",
        options:[{ t:"is 4 times as big", ok:true }, { t:"doubles" }, { t:"stays the same" }, { t:"triples" }],
        explain:"Both dimensions double, so the area multiplies by 2 × 2." }
    ],
    chalIntro:"Use the box builder to meet each goal, then press <strong>Check challenge</strong>. Type values in the answer box under the controls. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3, 4], prompt:"24 × 24 sheet: set the cut for the largest box and enter its volume.",
        why:"`V′(x) = (24 - 2x)(24 - 6x)` is 0 at `x = 4` and at the endpoint 12. `V(4) = 4 × 16 × 16 = 1024` cm³.",
        hints:["Watch the slope readout: you want “level”.", "`V′(x) = (24 - 2x)(24 - 6x)`.", "`x = 4` (12 is an endpoint): 4 × 16 × 16 = 1024."],
        msgs:{ scen:"Switch to <strong>Box from a sheet</strong> first.", sheet:"Choose the 24 cm × 24 cm sheet.",
          cube:"That makes a cube, which holds only 512 cm³.", six:"864 cm³; try smaller.",
          end:"`V′(12) = 0` too, but 12 is an endpoint: the box has no base, so it holds 0 cm³.",
          other:"At `x = #1` the box holds #2 cm³ and the slope is #3. The largest box is where the slope readout says “level”.",
          noAns:"The cut is right. Now type its volume in the answer box.", badAns:"The cut is right, but that volume isn’t. Read the Quantity row." } },
      { id:"tc2", goal:[3, 4], prompt:"45 × 24 sheet: use `V′(x) = 0` to find the best cut, then set it.",
        why:"`V′(x) = 12x^2 - 276x + 1080 = 12(x - 5)(x - 18)`. Only `x = 5` is in `[0, 12]`: 5 × 35 × 14 = 2450 cm³.",
        hints:["`V(x) = x(45 - 2x)(24 - 2x) = 4x^3 - 138x^2 + 1080x`.", "`V′(x) = 12x^2 - 276x + 1080 = 12(x - 5)(x - 18)`.", "Only `x = 5` is in `[0, 12]`: 5 × 35 × 14 = 2450."],
        msgs:{ scen:"Switch to <strong>Box from a sheet</strong> first.", sheet:"Choose the 45 cm × 24 cm sheet.",
          typed18:"`V′(18) = 0`, but `24 - 36 < 0`: 18 is outside the domain `0 <= x <= 12`.",
          other:"At `x = #1`, `V′(x) = #2`, not 0. Solve `V′(x) = 0`, then set that cut." } },
      { id:"tc3", goal:[3, 4], stretch:true, prompt:"Field mode, 600 m, divider on. Set the width that gives the largest total area, and enter that area.",
        why:"`3x + y = 600`, so `A(x) = x(600 - 3x)` on `[0, 200]`; `A′ = 600 - 6x = 0` at `x = 100`: 100 m by 300 m, 30 000 m².",
        hints:["Count the fence: three widths and one length.", "`A(x) = x(600 - 3x)`, `0 <= x <= 200`.", "`A′ = 600 - 6x = 0` at `x = 100`: 100 m by 300 m, area 30 000 m²."],
        msgs:{ scen:"Switch to <strong>Field along a river</strong> first.", fence:"Use the 600 m fence.", div:"Turn the divider on.",
          w150:"That’s the best width without the divider. Now there are <strong>three</strong> widths: `3x + y = 600`.",
          w200:"That’s where `A = 0`: all the fence is used on widths.",
          other:"At `x = #1`, `A′(x) = #2`, not 0. Count the fence again: three widths and one length.",
          noAns:"The width is right. Now type the total area in the answer box.", badAns:"The width is right, but that area isn’t. Read the Quantity row." } }
    ]
  },
  part3:{
    slug:"algorithm", name:"Algorithm",
    heading:"The optimization algorithm",
    intro:"On a slider you can see the peak. Without one, you need a model. First put the six steps in order. Then build two models from chips. Then try the quick check.",
    st1:{ title:"Station 1: Put the steps in order",
      problem:"A rectangle has its base on the `x`-axis and its two upper corners on the parabola `y = 12 - x^2`. Find the largest possible area.",
      how:"Tap a step, then use Move up and Move down to put it in place. Press Check when the order is right.",
      steps:[
        "Sketch and label: the upper corners are `(±x, 12 - x^2)`.",
        "Write the quantity: `A(x) = 2x(12 - x^2) = 24x - 2x^3`.",
        "State the domain: `0 <= x <= 2√3`.",
        "Differentiate and solve: `A′(x) = 24 - 6x^2 = 0` gives `x = 2`.",
        "Compare: `A(0) = 0`, `A(2) = 32`, `A(2√3) = 0`.",
        "Answer: the largest area is 32 square units (width 4, height 8)."
      ],
      start:[3, 0, 5, 2, 4, 1],
      domainLate:"State the domain before you compare, so you know which endpoints to test.",
      answerEarly:"Compare first; `A′ = 0` alone doesn’t prove a maximum.",
      general:"Ask what has to happen before it can be done.",
      done:"Sketch → model → domain → derivative = 0 → compare → answer.",
      graphCap:"`A(x) = 24x - 2x^3` on `[0, 2√3]`: the three candidates." },
    st2:{ title:"Station 2: Build the model",
      how:"For each problem, fill the four slots from the chip tray: tap a chip, then tap its slot (or tap a slot first). Two chips in each tray are traps.",
      slots:[{ id:"var", label:"Variable" }, { id:"con", label:"Constraint" }, { id:"fn", label:"Function to optimize (one variable)" }, { id:"dom", label:"Domain" }],
      roles:{ var:"the variable", con:"the constraint", fn:"the function to optimize", dom:"the domain" },
      problems:[
        { id:"A", t:"Problem A: An open square-based box must hold 4000 cm³. Use the least material.",
          chips:[
            { t:"`x` = base side", answer:"var" },
            { t:"`x^2h = 4000`", answer:"con" },
            { t:"`S(x) = x^2 + 16 000/x`", answer:"fn" },
            { t:"`x > 0`", answer:"dom" },
            { t:"`S = x^2 + 4xh`", answer:"no", fb:"Still two variables: use `x^2h = 4000` to replace `h`." },
            { t:"`S = 2x^2 + 16 000/x`", answer:"no", fb:"That adds a lid: the box is open." }],
          done:"Model built: `S(x) = x^2 + 16 000/x` for `x > 0`.",
          alg:["`h = 4000/x^2`, so `S = x^2 + 4x(4000/x^2) = x^2 + 16 000/x`, `x > 0`.",
            "`S′(x) = 2x - 16 000/x^2 = {2(x^3 - 8000)}/{x^2}`.",
            "`S′(x) = 0` when `x^3 = 8000`: `x = 20`. Then `h = 4000/20^2 = 10`.",
            "There are no endpoints to compare. `S` decreases before `x = 20` and increases after (sign chart below), so `x = 20` gives the least material: a 20 cm × 20 cm base, 10 cm high, `S = 1200` cm²."] },
        { id:"B", t:"Problem B: Two non-negative numbers add to 16. Make the sum of their squares as small as possible.",
          chips:[
            { t:"`x` = one number", answer:"var" },
            { t:"`y = 16 - x`", answer:"con" },
            { t:"`S(x) = x^2 + (16 - x)^2`", answer:"fn" },
            { t:"`0 <= x <= 16`", answer:"dom" },
            { t:"`S = x^2 + 16^2`", answer:"no", fb:"The second number is `16 - x`, not 16." },
            { t:"`x > 0` only", answer:"no", fb:"The numbers are non-negative, so 0 and 16 are allowed, and those endpoints must be compared." }],
          done:"Model built: `S(x) = x^2 + (16 - x)^2` on `[0, 16]`.",
          alg:["`S(x) = x^2 + (16 - x)^2`, `0 <= x <= 16`.",
            "`S′(x) = 2x - 2(16 - x) = 4x - 32 = 0` gives `x = 8`.",
            "Compare: `S(0) = 256`, `S(8) = 128`, `S(16) = 256`.",
            "The minimum is 128 at `x = 8` (the numbers 8 and 8). The maximum, 256, is at the endpoints (0 and 16)."] }
      ] },
    quickCheck:{
      title:"Quick check", summary:"Optimization algorithm quick check",
      items:[
        { id:"q1", goal:4, prompt:"First step in any optimization problem?",
          choices:[
            { t:"Sketch and label", ok:true, fb:"Right. Sketch and label first; the model comes from the picture." },
            { t:"Differentiate", fb:"You can’t differentiate until you have a model." },
            { t:"Set `f = 0`", fb:"You can’t differentiate until you have a model." },
            { t:"Guess a square", fb:"You can’t differentiate until you have a model." }] },
        { id:"q2", goal:1, prompt:"`A = xy` with `x + 2y = 100`. Write `A` in one variable.",
          choices:[
            { t:"`A = x(100 - x)/2`", ok:true, fb:"Right. `y = (100 - x)/2`, so `A = x(100 - x)/2`." },
            { t:"`A = x(100 - 2x)`", fb:"`y = (100 - x)/2`." },
            { t:"`A = 100x`", fb:"`y = (100 - x)/2`." },
            { t:"`A = xy`", fb:"`y = (100 - x)/2`." }] },
        { id:"q3", goal:2, prompt:"Why state the domain?",
          choices:[
            { t:"To know which endpoints to compare", ok:true, fb:"Right. The best value could be at an endpoint." },
            { t:"Because `f′` needs it", fb:"The best value could be at an endpoint." },
            { t:"To avoid negative derivatives", fb:"The best value could be at an endpoint." },
            { t:"It’s optional", fb:"The best value could be at an endpoint." }] },
        { id:"q4", goal:5, prompt:"Problem B (sum of squares, sum 16): the <strong>largest</strong> value of `S` occurs at …",
          choices:[
            { t:"`x = 0` or `x = 16`", ok:true, fb:"Right. `S(0) = S(16) = 256`; `x = 8` gives the minimum, 128." },
            { t:"`x = 8`", fb:"`x = 8` gives the minimum; the endpoints give 256." },
            { t:"`x = 4`", fb:"`x = 8` gives the minimum; the endpoints give 256." },
            { t:"There is none", fb:"`x = 8` gives the minimum; the endpoints give 256." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"models", type:"custom", title:"Model builder", summary:"Model builder", goal:[1, 2],
        instruction:"For each situation, choose the one-variable function and the domain.",
        how:"Tap one function and one domain, then press Check.",
        items:[
          { id:"m1", t:"Rectangle, perimeter 60 cm, width `x`; maximize area.",
            fn:{ options:[{ t:"`A = x(30 - x)`", ok:true, why:"`2x + 2L = 60`, so the length is `30 - x`." },
              { t:"`A = x(60 - x)`", why:"`2x + 2L = 60`: the length is half of `60 - 2x`." },
              { t:"`A = xy`", why:"Use the constraint to replace `y`: with `2x + 2y = 60`, `y = 30 - x`." },
              { t:"`A = x(60 - 2x)`", why:"That’s a field along a wall; here all four sides count." }] },
            dom:{ options:[{ t:"`0 <= x <= 30`", ok:true, why:"The length `30 - x` can’t be negative." },
              { t:"`0 <= x <= 60`", why:"A width over 30 cm leaves a negative length." },
              { t:"`x > 0`", why:"There’s an upper limit: `30 - x >= 0`." },
              { t:"`0 <= x <= 15`", why:"A 20 cm width (length 10 cm) is possible too." }] },
            why:"`A = x(30 - x)` on `0 <= x <= 30`." },
          { id:"m2", t:"Two numbers with sum 20; maximize the product.",
            fn:{ options:[{ t:"`P = x(20 - x)`", ok:true, why:"The other number is `20 - x`." },
              { t:"`P = xy`", why:"Use the constraint to replace `y`: with `x + y = 20`, `y = 20 - x`." },
              { t:"`P = x(20 + x)`", why:"The other number is `20 - x`." },
              { t:"`P = x + (20 - x)`", why:"That’s the sum, which is always 20." }] },
            dom:{ options:[{ t:"any real `x` (or `0 <= x <= 20` if positive)", ok:true, why:"Nothing limits two real numbers; if they must be positive, `x` stays between 0 and 20." },
              { t:"`0 <= x <= 10`", why:"`x = 15` works too: 15 + 5 = 20." },
              { t:"`x >= 20`", why:"Then the other number, `20 - x`, is 0 or negative; nothing says to start at 20." },
              { t:"`x != 0`", why:"Nothing rules out 0: 0 + 20 = 20." }] },
            why:"`P = x(20 - x)`; `x` can be any real number (or `0 <= x <= 20` if the numbers are positive)." },
          { id:"m3", t:"Box from a 30 cm × 18 cm sheet: squares of side `x` are cut from the corners.",
            fn:{ options:[{ t:"`V = x(30 - 2x)(18 - 2x)`", ok:true, why:"Each side loses `2x`; the height is `x`." },
              { t:"`V = x(30 - x)(18 - x)`", why:"Each side loses a square at both ends: `2x`." },
              { t:"`V = (30 - 2x)(18 - 2x)`", why:"That’s the base area; multiply by the height `x`." },
              { t:"`V = lwh`", why:"Three variables: use the sheet to write the length, width and height in terms of `x`." }] },
            dom:{ options:[{ t:"`0 <= x <= 9`", ok:true, why:"`18 - 2x >= 0`." },
              { t:"`0 <= x <= 18`", why:"The 18 cm side loses `2x`." },
              { t:"`0 <= x <= 15`", why:"That’s the 30 cm side’s limit; the 18 cm side runs out first." },
              { t:"`x >= 0`", why:"There’s an upper limit: `18 - 2x >= 0`." }] },
            why:"`V = x(30 - 2x)(18 - 2x)` on `0 <= x <= 9`." },
          { id:"m4", t:"Field along a wall, 400 m of fence (no fence on the wall side).",
            fn:{ options:[{ t:"`A = x(400 - 2x)`", ok:true, why:"Two widths and one length: `2x + y = 400`." },
              { t:"`A = x(200 - x)`", why:"That fences all four sides; the wall side is free." },
              { t:"`A = xy`", why:"Use the constraint to replace `y`: with `2x + y = 400`, `y = 400 - 2x`." },
              { t:"`A = x(400 - x)`", why:"There are two widths: `2x + y = 400`." }] },
            dom:{ options:[{ t:"`0 <= x <= 200`", ok:true, why:"`400 - 2x >= 0`." },
              { t:"`0 <= x <= 400`", why:"Two 400 m widths would need 800 m of fence." },
              { t:"`0 <= x <= 100`", why:"`x = 150` works too: 2(150) + 100 = 400." },
              { t:"`x > 0`", why:"There’s an upper limit: `400 - 2x >= 0`." }] },
            why:"`A = x(400 - 2x)` on `0 <= x <= 200`." },
          { id:"m5", t:"Open square-based box, volume 32 000 cm³; minimize the material.",
            fn:{ options:[{ t:"`S = x^2 + 128 000/x`", ok:true, why:"`h = 32 000/x^2`, and four sides of `xh`." },
              { t:"`S = x^2 + 4xh`", why:"Still two variables: use `x^2h = 32 000` to replace `h`." },
              { t:"`S = 2x^2 + 128 000/x`", why:"That adds a lid: the box is open." },
              { t:"`S = x^2 + 32 000/x`", why:"There are four sides: `4x · 32 000/x^2 = 128 000/x`." }] },
            dom:{ options:[{ t:"`x > 0`", ok:true, why:"Any positive base side gives a box; there are no endpoints." },
              { t:"`x >= 0`", why:"At `x = 0` there is no base, and `h = 32 000/0` is undefined." },
              { t:"`0 < x <= 40`", why:"A 50 cm base works too (`h = 12.8` cm): there’s no upper limit." },
              { t:"`0 <= x <= 32 000`", why:"`x = 0` gives no box, and nothing stops the base at 32 000 cm." }] },
            hints:["Write `h` from the volume.", "`h = 32 000/x^2`.", "`S = x^2 + 4x(32 000/x^2) = x^2 + 128 000/x`."],
            why:"`S = x^2 + 128 000/x` for `x > 0`." },
          { id:"m6", t:"Rectangle under `y = 9 - x^2`, with its base on the `x`-axis.",
            fn:{ options:[{ t:"`A = 2x(9 - x^2)`", ok:true, why:"Width `2x`, height `9 - x^2`." },
              { t:"`A = x(9 - x^2)`", why:"The rectangle reaches from `-x` to `x`: width `2x`." },
              { t:"`A = 2xy`", why:"Use the curve to replace `y`: `y = 9 - x^2`." },
              { t:"`A = 2x(9 - x)`", why:"The height is the curve’s `y`-value, `9 - x^2`." }] },
            dom:{ options:[{ t:"`0 <= x <= 3`", ok:true, why:"The height `9 - x^2` can’t be negative." },
              { t:"`0 <= x <= 9`", why:"At `x = 4` the height `9 - 16` is negative." },
              { t:"`-3 <= x <= 3`", why:"`x` is the half-width, a distance: `x >= 0`." },
              { t:"`x > 0`", why:"There’s an upper limit where the curve meets the axis: `x = 3`." }] },
            why:"`A = 2x(9 - x^2)` on `0 <= x <= 3`." }
        ] },
      { id:"solve", type:"custom", title:"Solve it", summary:"Solve it", star:true, goal:[3, 4, 5, 6],
        instruction:"Build the model, find the candidates, compare, and enter the answer. Items 4 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type whole numbers, fractions or exact roots (such as 25/2 or √5/2) in the boxes, then press Check.",
        items:[
          { id:"s1", goal:[4, 6], prompt:"Two numbers add to 20. What is their largest possible product?",
            boxes:[{ k:"v", label:"Largest product" }], answer:{ v:100 }, display:"100",
            wrong:[{ v:10, fb:"10 is each number; the product is 100." }],
            why:"`P = x(20 - x)`, `P′ = 20 - 2x = 0` at `x = 10`: 10 × 10 = 100." },
          { id:"s2", goal:[4, 6], prompt:"A rectangle has perimeter 60 cm. What is its largest area?",
            boxes:[{ k:"v", label:"Largest area", unit:"cm²" }], answer:{ v:225 }, display:"225 cm²",
            wrong:[{ v:15, fb:"15 cm is the side length. The question asked for the area." }],
            why:"`A = x(30 - x)`, `A′ = 30 - 2x = 0` at `x = 15`: a 15 cm square, 225 cm²." },
          { id:"s3", goal:[4, 6], prompt:"An open box with a square base must hold 32 000 cm³. Find the base side and height that use the least material.",
            boxes:[{ k:"b", label:"Base side", unit:"cm" }, { k:"h", label:"Height", unit:"cm" }], answer:{ b:40, h:20 }, display:"base 40 cm, height 20 cm",
            wrong:[{ b:20, h:80, fb:"Swapped? `h = 32 000/40^2 = 20`." }, { b:20, h:40, fb:"Swapped? `h = 32 000/40^2 = 20`." }],
            wrongDefault:"Write `S(x) = x^2 + 128 000/x`, solve `S′(x) = 0`, then find `h`.",
            why:"`S = x^2 + 128 000/x`, `S′ = 2x - 128 000/x^2 = 0` when `x^3 = 64 000`: `x = 40`, `h = 32 000/40^2 = 20`. `S` decreases before `x = 40` and increases after." },
          { id:"s4", goal:[4, 6], star:true, prompt:"A rectangle is inscribed in a semicircle of radius 5, with its base on the diameter. What is its largest area?",
            boxes:[{ k:"v", label:"Largest area", unit:"square units" }], answer:{ v:25 }, display:"25",
            wrong:[{ v:12.5, fb:"The width is `2x`, not `x`." }],
            why:"`A(x) = 2x√{25 - x^2}` on `[0, 5]`; `A′(x) = {50 - 4x^2}/{√{25 - x^2}} = 0` at `x^2 = 25/2`, so `A = 2 · 25/2 = 25`." },
          { id:"s5", goal:[3, 5, 6], star:true, prompt:"Which points on `y = x^2` are closest to `(0, 3/2)`? Give the distance.",
            boxes:[{ k:"a", label:"Points: `x = ±`" }, { k:"b", label:"`y =`" }, { k:"d", label:"Distance", exact:true }], answer:{ a:1, b:1, d:"√5/2" }, display:"`(±1, 1)`; distance `√5/2`",
            wrong:[{ a:0, b:0, fb:"`x = 0` is a critical number of `D = x^4 - 2x^2 + 9/4`, but it’s a local maximum of the distance." }],
            wrongDefault:"Minimize the square of the distance, then compare the critical numbers.",
            hints:["Minimize the square of the distance: `D(x) = x^2 + (x^2 - 3/2)^2`.", "`D′(x) = 4x^3 - 4x = 4x(x - 1)(x + 1)`.", "`D(±1) = 5/4 < D(0) = 9/4`, so the distance is `√5/2`."],
            why:"`D(x) = x^4 - 2x^2 + 9/4`; `D′ = 4x(x - 1)(x + 1)`; `D(±1) = 5/4 < D(0) = 9/4`, so the closest points are `(±1, 1)`, at distance `√{5/4} = √5/2`." },
          { id:"s6", goal:[5, 6], star:true, prompt:"A 40 cm wire is cut in two; each piece is bent into a square. Where should it be cut to make the total area as small as possible? As large as possible?",
            note:"Give the length of the first piece. For “don’t cut”, type 0 (or 40).",
            boxes:[{ k:"c1", label:"Smallest: cut at", unit:"cm" }, { k:"a1", label:"total area", unit:"cm²" }, { k:"c2", label:"Largest: cut at", unit:"cm" }, { k:"a2", label:"total area", unit:"cm²" }],
            answer:{ c1:20, a1:50, c2:[0, 40], a2:100 }, display:"smallest: cut at 20 cm (50 cm²); largest: don’t cut (one 10 cm square, 100 cm²)",
            wrong:[{ c2:20, fb:"`A(x) = x^2/16 + (40 - x)^2/16` has its only critical number at the minimum. The maximum is at an endpoint." }],
            wrongDefault:"Write `A(x)` for a cut at `x`, then compare the critical number with the endpoints 0 and 40.",
            hints:["Let `x` be the length bent into the first square; its side is `x/4`.", "`A(x) = (x/4)^2 + ((40 - x)/4)^2`, `0 <= x <= 40`.", "`A′ = 0` at `x = 20` gives 50 (the minimum); `A(0) = A(40) = 100` (the maximum)."],
            why:"`A′ = 0` at `x = 20` gives 50 cm², the minimum. `A(0) = A(40) = 100` cm²: the maximum is at an endpoint, so don’t cut." }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Quinn", how:"", goal:[2, 3, 6],
        instruction:"Quinn made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Find the largest open box made by cutting squares from the corners of a 24 cm × 24 cm sheet.",
            steps:["`V(x) = x(24 - 2x)^2`.", "Domain: `0 <= x <= 24`.",
              "`V′(x) = (24 - 2x)(24 - 6x) = 0`, so `x = 4` or `x = 12`.",
              "Compare: `V(0) = 0`, `V(4) = 1024`, `V(12) = 0`, `V(24) = 13 824`. The best cut is 24 cm."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "The derivative is right.", "Step 4 follows from step 2’s domain. The mistake is earlier."],
            fixes:[
              { t:"Each side loses `2x`, so `24 - 2x >= 0`: `0 <= x <= 12`. Then the best cut is 4 cm, volume 1024 cm³.", ok:true, why:"A cut can use up at most the whole side: `2x <= 24`." },
              { t:"`0 < x < 24`, open.", why:"Still allows impossible cuts." },
              { t:"`0 <= x <= 6`.", why:"Too small; `x = 8` is a possible cut." },
              { t:"Step 2 is correct.", why:"A 24 cm cut leaves no base: `24 - 48 < 0`." }],
            hints:["What’s the base side when `x = 13`?", "`24 - 26 < 0`.", "`0 <= x <= 12`."] },
          { id:"e2", goal:3, task:"600 m of fence encloses a field along a river (no fence on the river side). Find the largest area.",
            steps:["Let `x` be the width; the length is `600 - 2x`.", "`A(x) = x(600 - 2x) = 600x - 2x^2`, `0 <= x <= 300`.",
              "`A′(x) = 600 - 2x = 0`, so `x = 300`.", "`A(300) = 0`, so the field has no area."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"`A′(x) = 600 - 4x = 0`, so `x = 150`: 150 m by 300 m, area 45 000 m².", ok:true, why:"The power rule on `2x^2` gives `4x`, so the critical number is 150." },
              { t:"`A′(x) = 600 - x`.", why:M6 },
              { t:"Set `A = 0` instead.", why:M7 },
              { t:"Step 3 is correct.", why:DDX + "`(2x^2) = 4x`, not `2x`." }],
            hints:["Differentiate `2x^2` carefully.", "Power rule: 2 × `2x`.", "`x = 150`."] },
          { id:"e3", goal:6, task:"A rectangle has perimeter 40 cm. What is its largest possible area?",
            steps:["Width `x`, length `20 - x`.", "`A(x) = x(20 - x) = 20x - x^2`, `0 <= x <= 20`.",
              "`A′(x) = 20 - 2x = 0`, so `x = 10`; `A(0) = A(20) = 0`.", "So the largest area is 10."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"The largest area is `A(10) = 100` cm² (a 10 cm square).", ok:true, why:"Answer the question that was asked, with units." },
              { t:"The largest area is 10 cm².", why:"Units don’t fix it: 10 is the width." },
              { t:"The largest area is 20 cm².", why:"That’s the half-perimeter." },
              { t:"Step 4 is correct.", why:"`x = 10` is where; the question asks for the area. " + M5 }],
            hints:["What did the question ask for?", "The area, not `x`.", "`A(10) = 100` cm²."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in Explore: that the cube isn’t the best box, or that doubling the fence quadruples the area?" },
      { id:"j2", q:"In your own words, why must the function you differentiate have only one variable?" },
      { id:"j3", q:"Explain to a friend the six steps of the optimization algorithm, using the river field as your example." },
      { id:"j4", q:"Which step is hardest for you: building the model, the domain, or the derivative? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"A rectangle has perimeter 80 cm and width `x` cm. Which function gives its area?", options:[
          { t:"`A(x) = x(40 - x)`", ok:true, why:"Length = `40 - x`." },
          { t:"`A(x) = x(80 - x)`", why:"That uses the whole perimeter as one length." },
          { t:"`A(x) = xy`", why:"Two variables: use the perimeter to replace `y`." },
          { t:"`A(x) = x(80 - 2x)`", why:"That’s the river field; here all four sides are fenced." }] },
        b:{ prompt:"A rectangle has perimeter 100 cm and width `x` cm. Which function gives its area?", options:[
          { t:"`A(x) = x(50 - x)`", ok:true, why:"Length = `50 - x`." },
          { t:"`A(x) = x(100 - x)`", why:"That uses the whole perimeter as one length." },
          { t:"`A(x) = xy`", why:"Two variables: use the perimeter to replace `y`." },
          { t:"`A(x) = x(100 - 2x)`", why:"That’s the river field; here all four sides are fenced." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"An open box is made by cutting squares of side `x` cm from the corners of a 20 cm × 20 cm sheet. What is the domain of `V(x)`?", options:[
          { t:"`0 <= x <= 10`", ok:true, why:"`20 - 2x >= 0`." },
          { t:"`0 <= x <= 20`", why:"A 15 cm cut leaves a negative base." },
          { t:"`0 <= x <= 5`", why:"`x = 8` is a possible cut." },
          { t:"`x >= 0`", why:"There’s an upper limit." }] },
        b:{ prompt:"An open box is made by cutting squares of side `x` cm from the corners of a 30 cm × 18 cm sheet. What is the domain of `V(x)`?", options:[
          { t:"`0 <= x <= 9`", ok:true, why:"The 18 cm side limits the cut: `18 - 2x >= 0`." },
          { t:"`0 <= x <= 15`", why:"That’s the longer side’s limit; the shorter side runs out first." },
          { t:"`0 <= x <= 30`", why:"A 20 cm cut leaves a negative base: `18 - 40 < 0`." },
          { t:"`x >= 0`", why:"There’s an upper limit: `18 - 2x >= 0`." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"The area of a field is `A(x) = 800x - 4x^2`. Which `x` makes `A′(x) = 0`?", options:[
          { t:"100", ok:true, why:"`A′ = 800 - 8x`." },
          { t:"200", why:"`A(200) = 0`: a zero of `A`, not of `A′`." },
          { t:"400", why:DDX + "`(4x^2) = 8x`, not `2x`." },
          { t:"50", why:"`8x = 800` gives 100." }] },
        b:{ prompt:"`A(x) = 900x - 3x^2`. Which `x` makes `A′(x) = 0`?", options:[
          { t:"150", ok:true, why:"`A′ = 900 - 6x`." },
          { t:"300", why:"`A(300) = 0`: a zero of `A`, not of `A′`." },
          { t:"450", why:DDX + "`(3x^2) = 6x`, not `2x`." },
          { t:"75", why:"`6x = 900` gives 150." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"600 m of fence encloses a rectangular field along a river (no fence on the river side), with one extra fence across the middle, parallel to the ends. Which width (perpendicular to the river) gives the largest area?", options:[
          { t:"100 m", ok:true, why:"`3x + y = 600`, `A = x(600 - 3x)`, `A′ = 600 - 6x = 0`." },
          { t:"150 m", why:"That ignores the divider: there are three widths." },
          { t:"300 m", why:"That’s the length along the river." },
          { t:"200 m", why:"`A(200) = 0`." }] },
        b:{ prompt:"900 m of fence encloses a rectangular field along a river (no fence on the river side), with one extra fence across the middle, parallel to the ends. Which width (perpendicular to the river) gives the largest area?", options:[
          { t:"150 m", ok:true, why:"`A = x(900 - 3x)`, `A′ = 0` at 150." },
          { t:"225 m", why:"That ignores the divider: there are three widths." },
          { t:"450 m", why:"That’s the length along the river." },
          { t:"300 m", why:"`A(300) = 0`." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"A 40 cm wire is cut into two pieces and each is bent into a square. How should it be cut to make the total area as <strong>large</strong> as possible?", options:[
          { t:"Don’t cut it: one 10 cm square, 100 cm²", ok:true, why:"`A(x) = x^2/16 + (40 - x)^2/16` on `[0, 40]`: `A(0) = A(40) = 100`, `A(20) = 50`." },
          { t:"Cut it in half: two 5 cm squares", why:"`A′ = 0` at 20, but that’s the minimum, 50 cm²." },
          { t:"Cut at 10 cm", why:"`A(10) = 6.25 + 56.25 = 62.5 < 100`." },
          { t:"Cut at 30 cm", why:"Same as cutting at 10 cm." }] },
        b:{ prompt:"A 48 cm wire is cut into two pieces and each is bent into a square. How should it be cut to make the total area as <strong>large</strong> as possible?", options:[
          { t:"Don’t cut it: one 12 cm square, 144 cm²", ok:true, why:"`A(x) = x^2/16 + (48 - x)^2/16` on `[0, 48]`: `A(0) = A(48) = 144`, `A(24) = 72`." },
          { t:"Cut it in half: two 6 cm squares", why:"That’s the minimum, 72 cm²." },
          { t:"Cut at 12 cm", why:"`A(12) = 9 + 81 = 90 < 144`." },
          { t:"Cut at 36 cm", why:"Same as cutting at 12 cm." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"A rectangle has its base on the `x`-axis and its upper corners on `y = 27 - x^2`. What is its largest area?", options:[
          { t:"108", ok:true, why:"`A = 2x(27 - x^2)`, `A′ = 54 - 6x^2 = 0` at `x = 3`: 6 × 18." },
          { t:"54", why:"That’s `x(27 - x^2)`: the width is `2x`." },
          { t:"3", why:"That’s `x`." },
          { t:"18", why:"That’s the height." }] },
        b:{ prompt:"A rectangle has its base on the `x`-axis and its upper corners on `y = 48 - x^2`. What is its largest area?", options:[
          { t:"256", ok:true, why:"`A′ = 96 - 6x^2 = 0` at `x = 4`: 8 × 32." },
          { t:"128", why:"The width is `2x`." },
          { t:"4", why:"That’s `x`." },
          { t:"32", why:"That’s the height." }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"For 800 m of fence along a river, `A(x) = x(800 - 2x)` on `[0, 400]`. Which is the best justification that `x = 200` gives the maximum?", options:[
          { t:"“`x = 200` is the only critical number in the domain, and `A(0) = 0`, `A(200) = 80 000`, `A(400) = 0`, so 80 000 m² is the largest value.”", ok:true, why:"It names every candidate and compares them." },
          { t:"“`A′(200) = 0`, so it must be a maximum.”", why:"`A′ = 0` also happens at minimums." },
          { t:"“200 is in the middle of the domain.”", why:"Being in the middle proves nothing." },
          { t:"“`A(200)` is positive.”", why:"Many designs give a positive area." }] },
        b:{ prompt:"For a 30 × 30 sheet, `V(x) = x(30 - 2x)^2` on `[0, 15]`. Which is the best justification that `x = 5` gives the maximum?", options:[
          { t:"“`x = 5` is the only critical number inside the domain (15 is an endpoint), and `V(0) = 0`, `V(5) = 2000`, `V(15) = 0`, so 2000 cm³ is the largest.”", ok:true, why:"It names every candidate and compares them." },
          { t:"“`V′(5) = 0`, so it’s a maximum.”", why:"`V′ = 0` also happens at minimums: `V′(15) = 0` too, where the volume is 0." },
          { t:"“5 is a third of 15.”", why:"Coincidence isn’t proof." },
          { t:"“`V(5)` is positive.”", why:"Many cuts give a positive volume." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"A student finds `x = 200` for the river field with 800 m of fence. Which final answer best answers “What dimensions give the largest area?”", options:[
          { t:"“200 m by 400 m, with the 400 m side along the river; the area is 80 000 m².”", ok:true, why:"Both dimensions, which side is which, and the area, with units." },
          { t:"“`x = 200`.”", why:"No context, no second dimension, no units." },
          { t:"“80 000.”", why:"That’s the area without units, and the question asked for dimensions." },
          { t:"“About 267 m by 267 m.”", why:"A square uses fence on the river side too; it isn’t optimal here." }] },
        b:{ prompt:"A student finds `x = 5` for the 30 × 30 sheet. Which final answer best answers “What size box holds the most?”", options:[
          { t:"“Cut 5 cm squares: the box is 20 cm × 20 cm × 5 cm and holds 2000 cm³.”", ok:true, why:"The cut, the box’s dimensions and its volume, with units." },
          { t:"“`x = 5`.”", why:"That’s only the cut: no box size and no units." },
          { t:"“2000.”", why:"That’s the volume without units, and the question asked what size box." },
          { t:"“10 cm × 10 cm × 10 cm, a cube.”", why:"The cube (cut 10 cm) holds 1000 cm³." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A 200 m² rectangular storage yard is fenced. The front side costs $30/m; the other three sides cost $10/m. Which dimensions cost the least?", options:[
          { t:"10 m along the front, 20 m deep", ok:true, why:"Cost = `30x + 10x + 2(10)(200/x) = 40x + 4000/x`; `C′ = 0` at `x = 10`. Cost $800." },
          { t:"`10√2` m by `10√2` m", why:"A square ignores the dearer front." },
          { t:"20 m along the front, 10 m deep", why:"Swapped: the expensive side should be the short one." },
          { t:"5 m along the front, 40 m deep", why:"`C(5) = 200 + 800` = $1000 > $800." }] },
        b:{ prompt:"A 300 m² rectangular storage yard is fenced. The front side costs $50/m; the other three sides cost $10/m. Which dimensions cost the least?", options:[
          { t:"10 m along the front, 30 m deep", ok:true, why:"Cost = `60x + 6000/x`; `x = 10`. Cost $1200." },
          { t:"`10√3` m by `10√3` m", why:"A square ignores the dearer front." },
          { t:"30 m along the front, 10 m deep", why:"Swapped: the expensive side should be the short one." },
          { t:"15 m along the front, 20 m deep", why:"`C(15) = 900 + 400` = $1300." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"A poster must have 96 cm² of printed area, with 2 cm margins at the sides and 3 cm margins at the top and bottom. Which poster size uses the least paper?", options:[
          { t:"12 cm wide by 18 cm tall", ok:true, why:"Print `w × 96/w`; paper `(w + 4)(96/w + 6) = 120 + 6w + 384/w`, least at `w = 8`. Print 8 × 12; poster 12 × 18 = 216 cm²." },
          { t:"8 cm wide by 12 cm tall", why:"That’s the printed area, not the poster." },
          { t:"18 cm wide by 12 cm tall", why:"Swapped: the taller margins go on the taller sides." },
          { t:"About 13.8 cm by 15.8 cm, using a square print area", why:"That uses about 218 cm², more than 216." }] },
        b:{ prompt:"A poster must have 150 cm² of printed area, with 3 cm side margins and 2 cm top and bottom margins. Which poster size uses the least paper?", options:[
          { t:"21 cm wide by 14 cm tall", ok:true, why:"Paper `174 + 4w + 900/w`, least at `w = 15`. Print 15 × 10; poster 21 × 14 = 294 cm²." },
          { t:"15 cm wide by 10 cm tall", why:"That’s the printed area, not the poster." },
          { t:"14 cm wide by 21 cm tall", why:"Swapped: with the wider side margins, the poster should be wider than it is tall." },
          { t:"A square print area, `√150` cm on each side", why:"That uses about 296 cm², more than 294." }] } }
    ]
  },
  task:{
    title:"Design a sheet", summary:"Design a sheet",
    statement:"<p>Choose the length and width of a rectangular sheet of card. Squares will be cut from the corners to make the largest possible open box. Meet every condition. Can you find all the answers?</p>" + COND +
      "<p class=\"tiny muted\">Length `L` and width `W` are whole numbers from 2 to 40 cm; either can be the longer side. The shape stage folds the box at its best cut.</p>",
    checks:["Best cut is a whole number", "Not a square", "Volume at least 1000 cm³"],
    tips:["The best cut is `x = {(L + W) - √{L^2 - LW + W^2}}/{6}`. For a whole number, `L^2 - LW + W^2` must be a perfect square.",
      "Squares always work for line 1 when the side is a multiple of 6; this task wants a rectangle.",
      "Bigger sheets give bigger boxes: try sides in the 20s to 40s."],
    explainPrompt:"Explain how you found a sheet whose best cut is a whole number, and how you know the volume at that cut is the largest.",
    vocab:"Use the words model, domain, critical number and endpoint.",
    more:"There’s more than one answer. Find them all.",
    after3:"Smaller rectangles with whole-number cuts exist too, such as 16 × 10 (cut 2) and 21 × 16 (cut 3), but their boxes are under 1000 cm³."
  },
  cards:[
    ["Optimization", "Find the maximum or minimum of a quantity."],
    ["Constraint", "The fixed condition (perimeter, volume, fence length) used to remove a variable."],
    ["Model", "One function of one variable, e.g. `A(x) = x(600 - 2x)`."],
    ["Domain of a model", "The physically possible values, e.g. `0 <= x <= 12` for a 24 cm sheet."],
    ["The algorithm", "Sketch → model → domain → derivative = 0 → compare → answer."],
    ["Candidates", "Critical numbers in the domain and its endpoints."],
    ["Box from a sheet", "`V = x(L - 2x)(W - 2x)`, `0 <= x <= min(L, W)/2`."],
    ["Field along a river", "`A = x(P - 2x)`; best at `x = P/4`, length `P/2`."],
    ["Open square-based box", "`S = x^2 + 4xh` with `h = V/x^2`."],
    ["Squares aren’t always best", "Sides with different roles (river, cost) give unequal sides."],
    ["Endpoint answer", "Two squares from one wire: the largest total area is with no cut."],
    ["Final answer", "Answer the question asked, with units: “150 m by 300 m, 45 000 m²”."]
  ]
};
