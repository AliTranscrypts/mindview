// MDM4U 35 The Pearson correlation coefficient r. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/35-pearson-r.md
// x̄ and ȳ are written as HTML (an overlined italic letter), outside backticks.
const XB = '<i class="pr-bar">x</i>', YB = '<i class="pr-bar">y</i>';
const DX = "(`x` − " + XB + ")", DY = "(`y` − " + YB + ")";
// Core feedback sentences for the plan's misconceptions (§3)
const M1 = "`r` measures how closely the points fit a line, not how steep the line is.";
const M2 = "`r = 0` means no <strong>linear</strong> relationship. Curves can still be strong.";
const M3 = "`r` is unitless and symmetric: rescale or swap, and `r` stays the same.";
const M4 = "The sign is the direction. Compare strength with `|r|`.";
const M5 = "Use deviations from the means, and divide by √(Σ`x`-squares × Σ`y`-squares).";
const M6 = "`r` shows that the variables move together. A third variable, or chance, can explain it.";
const M7 = "A single point far from the others can raise or lower `r` dramatically.";

export default {
  id:"35-pearson-r",
  kind:"topic",
  title:"The Pearson correlation coefficient r",
  topic:"The Pearson Correlation Coefficient r",
  readyTopic:"the correlation coefficient",
  hero:{
    eq:'<span class="m"><i>r</i> = <span class="frac"><span class="fn">Σ(<i>x</i> − ' + XB + ")(<i>y</i> − " + YB + ')</span><span class="fd">√[Σ(<i>x</i> − ' + XB + ")² × Σ(<i>y</i> − " + YB + ")²]</span></span></span>",
    eqLabel:"r equals the sum of the products of the deviations, divided by the square root of the product of the sums of the squared deviations.",
    eqSize:"sm",
    headline:"One number for ‘how straight’",
    text:"Draw lines through the mean of `x` and the mean of `y`. Points in the ‘+’ quadrants pull `r` toward 1, and points in the ‘−’ quadrants pull it toward −1. The <strong>correlation coefficient</strong> `r` adds up those pulls, scaled so the answer always lands between −1 and 1.",
    fig:{ html:'<div id="pr-hero" class="pr-hero"></div>' }
  },
  goals:[
    "I can interpret the sign and size of `r` using the course’s strength words.",
    "I can compute `r` for a small data set using a deviation table.",
    "I can explain how `r` is built from paired deviations (the quadrant picture).",
    "I can predict how unit changes, swapping variables, outliers and a restricted range affect `r`.",
    "I can recognize when `r` is misleading and describe the relationship more accurately."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Means and deviations", goal:2, prompt:"`y` = 6, 8, 10, 12, 14. What are the deviations from the mean?",
          options:[
            { t:"−4, −2, 0, 2, 4", ok:true, why:"The mean is 10." },
            { t:"4, 2, 0, 2, 4", why:"Below the mean is negative." },
            { t:"−2, −1, 0, 1, 2", why:"Those are deviations from 10 divided by 2." },
            { t:"6, 8, 10, 12, 14", why:"Subtract the mean." }],
          hints:["Find the mean first.", "50 ÷ 5 = 10.", "Subtract 10 from each value."] },
        { id:"w2", skill:"Means and deviations", goal:2, prompt:"What is the sum of the squared deviations of 6, 8, 10, 12, 14?",
          options:[
            { t:"40", ok:true, why:"16 + 4 + 0 + 4 + 16." },
            { t:"0", why:"The deviations sum to 0; the squares don’t." },
            { t:"20", why:"Adds the absolute values, 4 + 2 + 0 + 2 + 4 = 12, then guesses." },
            { t:"10", why:"That’s the sum of squares for 1–5." }],
          hints:["Square each deviation.", "16, 4, 0, 4, 16.", "40."] },
        { id:"w3", skill:"Signed products", goal:3, prompt:"What is (−2)(−3) + (1)(−4)?",
          options:[
            { t:"2", ok:true, why:"6 − 4." },
            { t:"10", why:"(1)(−4) is −4, not +4." },
            { t:"−10", why:"(−2)(−3) is +6." },
            { t:"−2", why:"6 + (−4) = 2." }],
          hints:["Negative × negative = positive.", "6 and −4.", "2."] },
        { id:"w4", skill:"Signed products", goal:3, prompt:"A point is above the mean of `y` but left of the mean of `x`. Its deviation product " + DX + DY + " is…",
          options:[
            { t:"negative", ok:true, why:"(−)(+) = −." },
            { t:"positive", why:"Only (+)(+) or (−)(−) give a positive." },
            { t:"zero", why:"Only when the point is on a mean line." },
            { t:"undefined", why:"It’s just a product." }],
          hints:["Left of " + XB + " means `x` − " + XB + " &lt; 0.", "Above " + YB + " means `y` − " + YB + " &gt; 0.", "(−)(+) = −."] },
        { id:"w5", skill:"Describing scatter plots", goal:1, prompt:"Points cluster tightly along a falling line. Which description fits?",
          options:[
            { t:"Strong negative linear", ok:true, why:"Falling means negative; tight means strong." },
            { t:"Weak negative linear", why:"Tight means strong." },
            { t:"Strong positive linear", why:"Falling means negative." },
            { t:"No correlation", why:"There’s a clear pattern." }],
          hints:["Direction first.", "Falling means negative.", "Tight means strong."] },
        { id:"w6", skill:"Describing scatter plots", goal:5, prompt:"Points form a clear upside-down U. Which statement is best?",
          options:[
            { t:"A strong curved relationship", ok:true, why:"The points follow a clear curve: a strong pattern, but not a line." },
            { t:"No relationship", why:"A clear curve is a relationship." },
            { t:"A strong positive linear one", why:"Half rises, half falls." },
            { t:"A weak negative linear one", why:"Not linear at all." }],
          hints:["Is there a pattern?", "Yes: a curve.", "A strong curved relationship."] }
      ],
      refreshers:{
        "Means and deviations":"Deviation = value − mean. Square them before adding, or they cancel to 0.",
        "Signed products":"Same signs give a positive; different signs give a negative.",
        "Describing scatter plots":"Direction, form, strength, outliers (module 34)."
      }
    }
  },
  explore:{
    heading:"`r`-m&#101;ter",
    intro:"Drag points and watch `r`. Turn on the quadrants to see which points push `r` up or down, then step through the calculation.",
    predIntro:"Make a prediction first. Then the `r`-m&#101;ter will show you what really happens.",
    predictions:[
      { id:"p1", start:{ preset:"start", mode:"drag" },
        prompt:"Start state. Swap the axes. What happens to `r`?",
        options:[{ t:"It stays 0.80", ok:true }, { t:"It becomes −0.80" }, { t:"It becomes 1 ÷ 0.80" }, { t:"It becomes 0" }],
        explain:"The formula treats `x` and `y` the same way. The points reflected across the diagonal, and the dial didn’t move." },
      { id:"p2", start:{ preset:"start", mode:"drag" },
        prompt:"Start state. Change `x` from hours to minutes (× 60). What happens to `r`?",
        options:[{ t:"It stays 0.80", ok:true }, { t:"It becomes 48" }, { t:"It becomes 0.013" }, { t:"It becomes 1" }],
        explain:"Rescaling multiplies the top and the bottom of the formula by the same amount. The `x`-axis relabelled from 60 to 300, the points kept their places, and `r` stayed 0.80." },
      { id:"p3", start:{ preset:"moderate", mode:"quad" },
        prompt:"‘Moderate set’ (`r` = 0.50). Add the point (10, 10). `r` becomes about…",
        options:[{ t:"0.90", ok:true }, { t:"0.50" }, { t:"0.20" }, { t:"−0.50" }],
        explain:"One far point in a ‘+’ quadrant can dominate the total. The new point landed far up the trend with a large ‘+’ bar, and the dial jumped to 0.90." },
      { id:"p4", start:{ preset:"u", mode:"drag" },
        prompt:"‘U-shape’. What is `r`?",
        options:[{ t:"0", ok:true }, { t:"About 0.9" }, { t:"About −0.9" }, { t:"It can’t be computed" }],
        explain:"`r` = 0, yet the points follow a perfect curve. `r` only sees straight-line patterns: the left points sit in ‘−’ quadrants, the right points in ‘+’ quadrants, and their bars cancel exactly." }
    ],
    chalIntro:"Use the `r`-m&#101;ter to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 3], prompt:"Cards mode: place the `y`-cards 8, 9, 10, 11, 12 (each once) at `x` = 1–5 so that `r` = 0.90 exactly.",
        why:"Your order gives a product sum of 9, so `r` = 9 ÷ √(10 × 10) = 0.90. The four answers are 8, 9, 10, 12, 11 · 8, 9, 11, 10, 12 · 8, 10, 9, 11, 12 · 9, 8, 10, 11, 12: one neighbouring swap of the perfect order.",
        hints:["With these cards, both sums of squares are 10, so `r` = (sum of products) ÷ 10.", "You need a product sum of 9. The perfect order gives 10.", "Swap one neighbouring pair: each neighbour swap costs exactly 1."] },
      { id:"tc2", goal:2, prompt:"Steps mode, start state: complete the table and enter `r`.",
        why:"Products 4, 0, 0, 2, 2 sum to 8; both sums of squares are 10; `r` = 8 ÷ √(10 × 10) = 8 ÷ 10 = 0.8.",
        hints:[XB + " = 3 and " + YB + " = 10.", "Products: (−2)(−2) = 4, (−1)(0) = 0, (0)(−1) = 0, (1)(2) = 2, (2)(1) = 2.", "8 ÷ √100 = 0.8."] },
      { id:"tc3", goal:[1, 3], stretch:true, prompt:"‘Moderate set’ (`r` = 0.50): add <strong>one</strong> point (whole numbers, 0–10) so that `r` becomes strong (≥ 0.67).",
        why:"Your point sits far out in a ‘+’ quadrant, so its large positive product lifts `r` to at least 0.67. Exactly 26 points work: (0, 0), or any point with `x` ≥ 6 and `y` ≥ 6; (10, 10) gives `r` = 0.90.",
        hints:["Which quadrants add to `r`?", "Upper-right or lower-left, far from the mean point (3, 3).", "Try (10, 10), or (0, 0) in the far lower-left."] }
    ]
  },
  part3:{
    slug:"mislead", name:"Mislead",
    heading:"`r` can mislead",
    intro:"`r` measures only how well a <em>straight line</em> fits. Work through the four stations to see what `r` hides when the pattern is curved, when one point is in charge, when the range is cut off, and when a third variable is at work. Each station shows its `r` beside the plot.",
    stations:[
      { id:"s1", title:"Four plots, one `r`",
        text:"Anscombe’s quartet (1973): four published data sets that each have `r` ≈ 0.82. Tap every plot where “`r` = 0.82, strong linear” is a fair description, then press Check.",
        plots:[
          { t:"Data set I", fb:"A linear cloud: “strong linear” is fair here." },
          { t:"Data set II", fb:"A smooth curve. The pattern is strong, but it isn’t linear." },
          { t:"Data set III", fb:"A perfect line with one outlier. Without the outlier `r` would be almost 1." },
          { t:"Data set IV", fb:"A vertical cluster with one far point. That single point creates the whole correlation." }],
        after:"Same `r`, four different stories. Always plot the data before you trust `r`." },
      { id:"s2", title:"One point in charge",
        text:"A tight cluster with no pattern (`r` ≈ 0) plus one far point gives `r` ≈ 0.9. Drag the far point (orange) back into the cluster and watch `r`. Keyboard: focus the plot and use the arrow keys.",
        after:"One point carried the correlation. Report an influential point, and show `r` with and without it." },
      { id:"s3", title:"A restricted range",
        text:"Height vs arm span for all Grade 9–12 students in a school gives `r` = 0.90. Now keep only the students 170–172 cm tall.",
        filters:[{ id:"all", t:"All students" }, { id:"cut", t:"Only students 170–172 cm tall" }],
        after:"Cutting the range hides the trend." },
      { id:"s4", title:"Chance and common causes",
        text:"Over 10 years, a town’s streaming subscriptions and its number of bike lanes give `r` = 0.94. What does the correlation show?",
        choices:[
          { t:"Both grew over time; the correlation doesn’t show that one affects the other.", ok:true, why:"Right. Time (and the town’s growth) is a common cause. " + M6 },
          { t:"More streaming subscriptions lead the town to build bike lanes.", why:M6 },
          { t:"New bike lanes make people subscribe to streaming.", why:M6 },
          { t:"`r` = 0.94 is too weak to show anything.", why:"0.94 is strong. The question is what causes it: " + M6 }],
        after:"A high `r` never proves cause. Look for a common cause, such as time, or for chance." }
    ],
    quickCheck:{
      title:"Mislead quick check", summary:"Mislead quick check",
      items:[
        { id:"q1", goal:5, prompt:"`r` = 0 for a perfect U. The relationship is…",
          choices:[
            { t:"strong but not linear", ok:true, fb:"Right. `r` misses curves." },
            { t:"nonexistent", fb:"`r` misses curves." },
            { t:"weak linear", fb:"`r` misses curves." },
            { t:"negative", fb:"`r` misses curves." }] },
        { id:"q2", goal:4, prompt:"Removing one far point makes `r` drop from 0.9 to 0.1. That point was…",
          choices:[
            { t:"influential", ok:true, fb:"Right. One point carried the correlation." },
            { t:"typical", fb:"One point carried the correlation." },
            { t:"an error by definition", fb:"One point carried the correlation." },
            { t:"irrelevant", fb:"One point carried the correlation." }] },
        { id:"q3", goal:4, prompt:"Restricting the range of `x` usually makes `|r|`…",
          choices:[
            { t:"smaller", ok:true, fb:"Right. Less spread in `x` hides the trend." },
            { t:"larger", fb:"Less spread in `x` hides the trend." },
            { t:"unchanged", fb:"Less spread in `x` hides the trend." },
            { t:"negative", fb:"Less spread in `x` hides the trend." }] },
        { id:"q4", goal:5, prompt:"`r` = 0.94 between two things that both grew over time shows…",
          choices:[
            { t:"an association", ok:true, fb:"Right. Time is a common cause." },
            { t:"causation", fb:"Time is a common cause." },
            { t:"a mistake", fb:"Time is a common cause." },
            { t:"nothing at all", fb:"Time is a common cause." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"describe", type:"match", title:"`r` ↔ description", summary:"r ↔ description", goal:1,
        instruction:"Tap a value of `r`, then tap the description that fits it.",
        leftTitle:"`r`", rightTitle:"Description",
        left:[
          { id:"l1", t:"1", why:"`r` = 1 only when every point lies exactly on a rising line." },
          { id:"l2", t:"0.92", why:"0.92 ≥ 0.67, and positive: strong positive linear." },
          { id:"l3", t:"0.50", why:"0.50 is between 0.33 and 0.67: moderate positive linear." },
          { id:"l4", t:"0.05", why:"0.05 is below 0.33: no meaningful linear correlation." },
          { id:"l5", t:"−0.45", why:"`|r|` = 0.45 is between 0.33 and 0.67, and the sign says falling: moderate negative linear.",
            hints:["Ignore the sign: 0.45.", "Between 0.33 and 0.67.", "Moderate negative."] },
          { id:"l6", t:"−0.95", why:"`|r|` = 0.95 is strong; the sign says falling." }],
        right:[
          { id:"r1", t:"Every point exactly on a rising line" },
          { id:"r2", t:"Strong positive linear" },
          { id:"r3", t:"Moderate positive linear" },
          { id:"r4", t:"No linear correlation" },
          { id:"r5", t:"Moderate negative linear" },
          { id:"r6", t:"Strong negative linear" }],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6" },
        wrong:{
          "l6|r5":"`|−0.95|` = 0.95 is strong. The sign is only the direction.",
          "l4|r3":"0.05 is below 0.33: no meaningful linear correlation." },
        wrongDefault:"Use `|r|` for strength and the sign for direction." },
      { id:"compute", type:"numeric", title:"Compute `r`", summary:"Compute r", goal:[2, 3, 4], star:true,
        instruction:"Every data set uses `x` = 1, 2, 3, 4, 5, so Σ" + DX + "² = 10. Items marked ★ are non-routine; the last two go beyond the Final Check.",
        how:"Type `r` as a decimal (to 2 places is fine), such as 0.75 or −0.4, then press Check.",
        items:[
          { id:"c1", goal:2, prompt:"`y` = 8, 9, 10, 12, 11", answer:0.9, tol:0.01, display:"`r` = 0.9", label:"`r` =", keypad:"decimal",
            why:YB + " = 10; the products are 4, 1, 0, 2, 2, which sum to 9; Σ" + DY + "² = 10, so `r` = 9 ÷ √(10 × 10) = 0.9.",
            wrong:[{ match:0.09, fb:"√(10 × 10) = 10, not 100." }, { match:9, fb:M5 }],
            hints:["Find " + YB + " and the deviations.", "The products are 4, 1, 0, 2, 2: sum 9.", "9 ÷ √(10 × 10) = 0.9."] },
          { id:"c2", goal:2, prompt:"`y` = 12, 10, 11, 9, 8", answer:-0.9, tol:0.01, display:"`r` = −0.9", label:"`r` =", keypad:"decimal",
            why:YB + " = 10; the products are −4, 0, 0, −1, −4, which sum to −9; `r` = −9 ÷ 10 = −0.9.",
            wrong:[{ match:0.9, fb:"The deviation products are mostly negative." }, { match:-0.09, fb:"√(10 × 10) = 10, not 100." }],
            hints:["Find " + YB + " and the deviations.", "The products are −4, 0, 0, −1, −4: sum −9.", "−9 ÷ √(10 × 10) = −0.9."] },
          { id:"c3", goal:2, star:true, prompt:"`y` = 6, 8, 12, 10, 14 (Σ" + DY + "² = 40)", answer:0.9, tol:0.01, display:"`r` = 0.9", label:"`r` =", keypad:"decimal",
            why:"18 ÷ √(10 × 40) = 18 ÷ 20 = 0.9.",
            wrong:[{ match:0.45, fb:"Divide by √(10 × 40) = 20, not 40." }, { match:0.045, fb:"Divide by √(10 × 40) = 20, not 400." }],
            hints:[YB + " = 10; the deviations are −4, −2, 2, 0, 4.", "The products total 8 + 2 + 0 + 0 + 8 = 18.", "18 ÷ √(10 × 40) = 18 ÷ 20 = 0.9."] },
          { id:"c4", goal:4, star:true, prompt:"Data have `r` = 0.62. Every `x` is converted from km to m, and 5 is subtracted from every `y`. New `r`?", answer:0.62, tol:0.001, display:"`r` = 0.62", label:"`r` =", keypad:"decimal",
            why:"Rescaling and shifting don’t change `r`: it stays 0.62.",
            wrong:[{ match:620, fb:"Rescaling and shifting don’t change `r`." }, { match:0.57, fb:"Rescaling and shifting don’t change `r`." }, { match:-0.62, fb:"Subtracting 5 shifts the points; it doesn’t flip the direction. Rescaling and shifting don’t change `r`." }],
            hints:["What does × 1000 do to the top and the bottom of the formula?", "Subtracting 5 doesn’t change any deviation from the mean.", "`r` stays 0.62."] },
          { id:"c5", goal:3, star:true, prompt:"`n` = 5 and Σ`z_x z_y` = 3.2. What is `r`?", answer:0.8, tol:0.01, display:"`r` = 0.8", label:"`r` =", keypad:"decimal",
            why:"`r` = Σ`z_x z_y` ÷ (`n` − 1) = 3.2 ÷ 4 = 0.8.",
            wrong:[{ match:0.64, fb:"Divide by `n` − 1 = 4, not 5." }, { match:3.2, fb:"Divide the sum by `n` − 1." }],
            hints:["Use the `z`-score form.", "`r` = Σ`z_x z_y` ÷ (`n` − 1).", "3.2 ÷ 4 = 0.8."] },
          { id:"c6", goal:[2, 3], star:true, prompt:"`x` = 1–5 and the `y`-values are a rearrangement of 6, 7, 8, 9, 10. What is the largest possible `r` that is less than 1?", answer:0.9, tol:0.01, display:"`r` = 0.9", label:"`r` =", keypad:"decimal",
            why:"The perfect order gives `r` = 1; swapping one neighbouring pair lowers the product sum by 1, so `r` = 9 ÷ 10 = 0.9.",
            wrong:[{ match:0.8, fb:"One neighbouring swap costs only 0.1." }, { match:0.99, fb:"The product sum changes in whole steps, so `r` moves in steps of 0.1." }],
            hints:["With these values, `r` = (sum of deviation products) ÷ 10.", "The perfect order gives 10 ÷ 10 = 1.", "The smallest change (swapping one neighbouring pair) lowers the sum by 1: `r` = 0.9."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Ramona", goal:[1, 2, 5],
        instruction:"Ramona made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Find `r` for (1, 8), (2, 10), (3, 9), (4, 12), (5, 11).",
            steps:[XB + " = 3 and " + YB + " = 10.", "The deviation products are 4, 0, 0, 2, 2; their sum is 8.", "Σ" + DX + "² = 10 and Σ" + DY + "² = 10.", "`r` = 8 ÷ (10 × 10) = 0.08.", "So the correlation is weak."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 follows from the wrong value."],
            fixes:[
              { t:"`r` = 8 ÷ √(10 × 10) = 8 ÷ 10 = 0.8: strong positive.", ok:true, why:"The denominator is the square root of the product of the sums." },
              { t:"`r` = 8 ÷ (10 + 10) = 0.4.", why:"The denominator is a square root of a product." },
              { t:"`r` = 8.", why:"`r` must be between −1 and 1." },
              { t:"Step 4 is correct.", why:"0.08 forgets the square root." }],
            hints:["What does the denominator need?", "√(10 × 10).", "0.8."] },
          { id:"e2", goal:1, task:"Interpret `r` = −0.92 for screen time vs hours of sleep.",
            steps:["`r` is negative: more screen time tends to go with less sleep.", "`|r|` = 0.92, which is at least 0.67.", "But negative correlations are weak, so this relationship is weak."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"A strong negative linear relationship.", ok:true, why:"The sign gives the direction; `|r|` = 0.92 gives the strength." },
              { t:"A moderate relationship, because it’s negative.", why:M4 },
              { t:"No relationship, because `r` &lt; 0.", why:M4 },
              { t:"Step 3 is correct.", why:"The sign is direction; `|r|` is strength." }],
            hints:["What does the sign tell you?", "Direction only.", "`|r|` = 0.92 is strong."] },
          { id:"e3", goal:5, task:"The points (1, 10), (2, 5), (3, 2), (4, 1), (5, 2), (6, 5), (7, 10) give `r` = 0. Describe the relationship.",
            steps:["`r` = 0 for these points.", "So there’s no relationship between `x` and `y`.", "Knowing `x` doesn’t help predict `y`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows from step 2."],
            fixes:[
              { t:"There’s no <strong>linear</strong> relationship, but the points follow a clear U: a strong curved relationship, so `x` predicts `y` well.", ok:true, why:"`r` only detects straight lines; the U is a strong curved pattern." },
              { t:"A weak positive relationship.", why:"There is a strong pattern." },
              { t:"`r` must have been calculated wrongly.", why:"`r` = 0 is right for a symmetric U." },
              { t:"Step 2 is correct.", why:"`r` only detects straight lines." }],
            hints:["Plot the points. Is there a pattern?", "A U.", "Strong, but curved."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in Explore: the swap, the unit change, the one far point or the U?" },
      { id:"j2", q:"In your own words, explain why points in the upper-right and lower-left quadrants make `r` larger." },
      { id:"j3", q:"Explain to a friend the steps for computing `r` from a deviation table." },
      { id:"j4", q:"When could you be fooled by `r`? What will you check before trusting it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which value of `r` shows the strongest linear relationship?", options:[
          { t:"−0.91", ok:true, why:"The largest `|r|`." },
          { t:"0.85", why:"`|−0.91|` is larger. " + M4 },
          { t:"−0.40", why:"`|−0.40|` = 0.40 is only moderate." },
          { t:"0.10", why:"0.10 is weak." }] },
        b:{ prompt:"Which value of `r` shows the strongest linear relationship?", options:[
          { t:"−0.88", ok:true, why:"The largest `|r|`." },
          { t:"0.78", why:"`|−0.88|` is larger. " + M4 },
          { t:"0.30", why:"0.30 is weak." },
          { t:"−0.05", why:"`|−0.05|` = 0.05 is close to no linear correlation." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"How is `r` = −0.45 described?", options:[
          { t:"Moderate negative", ok:true, why:"0.45 is between 0.33 and 0.67." },
          { t:"Weak negative", why:"Weak is below 0.33." },
          { t:"Strong negative", why:"Strong is 0.67 or more." },
          { t:"No correlation, because it’s negative", why:M4 }] },
        b:{ prompt:"How is `r` = 0.25 described?", options:[
          { t:"Weak positive", ok:true, why:"0.25 is below 0.33, and positive." },
          { t:"Moderate positive", why:"Moderate is 0.33 to 0.67; 0.25 is below that." },
          { t:"Strong positive", why:"Strong is 0.67 or more." },
          { t:"No correlation at all", why:"0.25 is weak, but not zero." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Every `x`-value is converted from centimetres to metres. What happens to `r`?", options:[
          { t:"It doesn’t change", ok:true, why:"`r` has no units." },
          { t:"It’s divided by 100", why:M3 },
          { t:"It’s multiplied by 100", why:M3 },
          { t:"It becomes 0", why:"The pattern is unchanged." }] },
        b:{ prompt:"The `x` and `y` variables are swapped. What happens to `r`?", options:[
          { t:"It doesn’t change", ok:true, why:"The formula is symmetric." },
          { t:"It changes sign", why:M3 },
          { t:"It becomes 1 ÷ `r`", why:M3 },
          { t:"It can’t be computed", why:"It can." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"Find `r` for (1, 7), (2, 9), (3, 8), (4, 10), (5, 11).", options:[
          { t:"0.9", ok:true, why:YB + " = 9; products 4, 0, 0, 1, 4 sum to 9; 9 ÷ √(10 × 10)." },
          { t:"0.09", why:"√(10 × 10) = 10. " + M5 },
          { t:"0.45", why:"Divide by √100, not 20." },
          { t:"9", why:"Divide by √(10 × 10). " + M5 }] },
        b:{ prompt:"Find `r` for (1, 13), (2, 11), (3, 12), (4, 9), (5, 10).", options:[
          { t:"−0.8", ok:true, why:YB + " = 11; products −4, 0, 0, −2, −2 sum to −8; −8 ÷ 10." },
          { t:"−8", why:"Divide by √(10 × 10). " + M5 },
          { t:"−0.08", why:"√(10 × 10) = 10, not 100. " + M5 },
          { t:"0.8", why:"The products are negative." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"The points (1, 3), (2, 1), (3, 4), (4, 2), (5, 5) have `r` = 0.50. The point (10, 10) is added. `r` becomes about…", options:[
          { t:"0.90", ok:true, why:"A large positive product dominates." },
          { t:"−0.50", why:"It’s in a ‘+’ quadrant." },
          { t:"0.20", why:"(10, 10) is far up and to the right of the mean point: a large positive product raises `r`." },
          { t:"0.50", why:"One far point changes `r` a lot. " + M7 }] },
        b:{ prompt:"Same five points (`r` = 0.50). The point (10, 0) is added instead. `r` becomes about…", options:[
          { t:"−0.42", ok:true, why:"It sits far right and far below the mean: a large negative product." },
          { t:"0.42", why:"Check the sign: right of " + XB + ", below " + YB + "." },
          { t:"0.50", why:M7 },
          { t:"0.90", why:"That would be (10, 10)." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"Most points lie in the upper-left and lower-right quadrants formed by the lines `x` = " + XB + " and `y` = " + YB + ". What is the sign of `r`?", options:[
          { t:"Negative", ok:true, why:"Those quadrants have products of opposite signs." },
          { t:"Positive", why:"Upper-right and lower-left give positive." },
          { t:"Zero", why:"The products don’t cancel when most points are in two opposite quadrants." },
          { t:"Can’t tell without the values", why:"The quadrants decide the sign." }] },
        b:{ prompt:"Most points lie in the upper-right and lower-left quadrants. What is the sign of `r`?", options:[
          { t:"Positive", ok:true, why:"In those quadrants both deviations have the same sign, so the products are positive." },
          { t:"Negative", why:"Upper-left and lower-right give negative; upper-right and lower-left give positive." },
          { t:"Zero", why:"The products don’t cancel when most points are in two opposite quadrants." },
          { t:"Can’t tell", why:"The quadrants decide the sign." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"A data set has `r` = 0.02, but its scatter plot shows a clear U shape. Which statement is best?", options:[
          { t:"“`r` measures only linear association; the U shows a strong nonlinear relationship.”", ok:true, why:"`r` ≈ 0 rules out only a linear pattern." },
          { t:"“There’s no relationship, because `r` ≈ 0.”", why:M2 },
          { t:"“`r` must be miscalculated.”", why:"`r` ≈ 0 is correct for a U." },
          { t:"“The relationship is weak and positive.”", why:"The pattern is strong, but curved." }] },
        b:{ prompt:"A tight cluster of points plus one far point gives `r` = 0.95. Which statement is best?", options:[
          { t:"“`r` is inflated by one influential point; without it there’s little linear pattern.”", ok:true, why:"One far point can create a high `r`." },
          { t:"“`r` = 0.95 proves a strong linear relationship.”", why:M7 },
          { t:"“The far point should be deleted and never mentioned.”", why:"Report it, and show `r` both ways." },
          { t:"“`r` is wrong, because outliers can’t affect it.”", why:M7 }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which statement about `r` is correct?", options:[
          { t:"“`r` measures how closely the points fit a straight line, not how steep the line is.”", ok:true, why:"`r` is about fit, not slope." },
          { t:"“`r` = 0.9 means the line of best fit has slope 0.9.”", why:M1 },
          { t:"“`r` has the units of `y` divided by `x`.”", why:"`r` is unitless." },
          { t:"“`r` = −0.9 shows a weaker relationship than `r` = 0.5.”", why:M4 }] },
        b:{ prompt:"What does `r` = 1 tell you?", options:[
          { t:"“Every point lies exactly on a straight line that rises.”", ok:true, why:"`r` = 1 is a perfect positive linear fit." },
          { t:"“The slope of the line is 1.”", why:M1 },
          { t:"“`x` causes `y`.”", why:M6 },
          { t:"“Every `y`-value equals its `x`-value.”", why:"Any rising line works, not only `y` = `x`." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"Model data: across 10 Ontario towns, `r` = 0.88 between the number of public libraries and the number of car accidents. Which conclusion is best?", options:[
          { t:"“Both probably grow with population; the strong `r` doesn’t mean libraries cause accidents.”", ok:true, why:"Population is a common cause." },
          { t:"“Libraries cause accidents.”", why:M6 },
          { t:"“Accidents lead towns to build libraries.”", why:M6 },
          { t:"“`r` = 0.88 is too weak to mean anything.”", why:"0.88 is strong." }] },
        b:{ prompt:"Model data: among children aged 5 to 12, `r` = 0.91 between shoe size and reading level. Which conclusion is best?", options:[
          { t:"“Both increase with age; age is a common cause.”", ok:true, why:"Older children have bigger feet and read better." },
          { t:"“Bigger feet improve reading.”", why:M6 },
          { t:"“Reading makes feet grow.”", why:M6 },
          { t:"“The data must be wrong.”", why:"The association is real; the cause is age." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"For all Grade 9–12 students, height and arm span have `r` = 0.90. If only students between 170 cm and 172 cm tall are included, `r` will most likely…", options:[
          { t:"decrease", ok:true, why:"A restricted range hides the trend." },
          { t:"increase", why:"Less spread in `x` weakens the visible pattern." },
          { t:"stay at 0.90", why:"`r` depends on the range included." },
          { t:"become −0.90", why:"The direction won’t reverse." }] },
        b:{ prompt:"For students aged 5 to 18, age and reading score have `r` = 0.85. If only 16-year-olds are included, `r` will most likely…", options:[
          { t:"decrease", ok:true, why:"A restricted range hides the trend: with one age, there’s no spread in `x` left." },
          { t:"increase", why:"Less spread in `x` weakens the visible pattern." },
          { t:"stay at 0.85", why:"`r` depends on the range included." },
          { t:"become −0.85", why:"The direction won’t reverse." }] } }
    ]
  },
  task:{
    title:"Rank the study hours", summary:"Rank the study hours",
    statement:"<p>Five students studied 1, 2, 3, 4 and 5 hours. Rank their quiz results 1 (lowest) to 5 (highest), using each rank once, so the data meet every condition. Can you find all the answers?</p>" +
      '<ol class="pr-conds"><li>The correlation is strong and positive.</li><li>The pattern isn’t a perfect line.</li><li>The top-ranked student (rank 5) is <strong>not</strong> the one who studied 5 hours.</li></ol>',
    checks:["Strong positive", "Not perfect", "Top rank not at 5 hours"],
    tips:["With ranks 1–5 against hours 1–5, `r` = (sum of deviation products) ÷ 10.", "Strong needs a product sum of 7 or more; perfect is 10.", "Rank 5 must sit at 1–4 hours. Where does that cost the least?"],
    explainPrompt:"Explain how each swap changed `r`, and how you kept `r` strong while moving rank 5 away from 5 hours.",
    vocab:"Use the words deviation, product, strong, linear and correlation.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Moving rank 5 away from 5 hours costs at least one swap, and every further swap lowers `r` by at least 0.1. That’s why only these five survive.",
    afterAt:5
  },
  cards:[
    ["`r`", "The Pearson correlation coefficient, from −1 to 1, measuring linear association."],
    ["Sign of `r`", "Direction: + rises, − falls."],
    ["Strength words", "`|r|` ≥ 0.67 strong; 0.33–0.67 moderate; &lt; 0.33 weak."],
    ["Formula", "`r` = Σ" + DX + DY + " ÷ √[Σ" + DX + "² Σ" + DY + "²]."],
    ["`z`-score form", "`r` = Σ`z_x z_y` ÷ (`n` − 1)."],
    ["Quadrant picture", "Upper-right and lower-left add to `r`; upper-left and lower-right subtract."],
    ["`r` = ±1", "Every point lies exactly on a line."],
    ["Unitless", "Changing units or swapping `x` and `y` leaves `r` unchanged."],
    ["`r` ≈ 0", "No <strong>linear</strong> relationship; a curve may still be strong."],
    ["Influential point", "One far point can raise or lower `r` a lot."],
    ["Restricted range", "Cutting the range of `x` usually weakens `r`."],
    ["Correlation ≠ causation", "A high `r` can come from a common cause or chance."]
  ]
};
