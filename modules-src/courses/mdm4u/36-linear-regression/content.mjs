// MDM4U 36 Linear Regression & Line of Best Fit. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/36-linear-regression.md
// Notation helpers (HTML, so the accented letters stay italic like the other variables).
const x = "<i>x</i>", y = "<i>y</i>", xb = "<i>x̄</i>", yb = "<i>ȳ</i>", yh = "<i>ŷ</i>", r = "<i>r</i>", m = "<i>m</i>", b = "<i>b</i>", k = "<i>k</i>";
const sx = "<i>s</i><sub><i>x</i></sub>", sy = "<i>s</i><sub><i>y</i></sub>";
const SXY = `Σ(${x} − ${xb})(${y} − ${yb})`, SXX = `Σ(${x} − ${xb})²`, SYY = `Σ(${y} − ${yb})²`;
// Core feedback sentences for the plan's misconceptions (§3).
const M1 = "The best line is judged by all the residuals together. The least-squares line has the smallest sum of squared residuals.";
const M2 = `Residuals are <strong>vertical</strong>: observed ${y} − predicted ${y}. We’re predicting ${y}.`;
const M3 = `Slope = ${SXY} ÷ ${SXX}. The bottom only uses ${x}.`;
const M4 = `Slope = ${r} × (spread of ${y}) ÷ (spread of ${x}): rise over run.`;
const M5 = `Slope is the predicted <strong>change</strong> in ${y} for each increase of 1 in ${x}, with both units.`;
const M6 = `The data only tell us about ${x} between the smallest and largest values. Beyond that, the pattern may change.`;
const M7 = `${x} = 0 may be far outside the data or impossible; then the intercept just positions the line.`;

export default {
  id:"36-linear-regression",
  kind:"topic",
  title:"Linear regression and line of best fit",
  topic:"Linear Regression & Line of Best Fit",
  readyTopic:"linear regression",
  hero:{
    eq:`${yh} = <i>mx</i> + ${b}<span class="lr-heq2">${m} = ${r} · ${sy} ÷ ${sx}&emsp;${b} = ${yb} − ${m}${xb}</span>`,
    eqLabel:"y hat equals m x plus b, where m equals r times s y divided by s x, and b equals y bar minus m times x bar.",
    eqSize:"md",
    headline:"The best line is the one that misses least.",
    text:`A <strong>line of best fit</strong> summarizes a linear pattern. Every point misses the line by a <strong>residual</strong>. Square each miss, add them up, and the <strong>least-squares line</strong> is the line that makes that total as small as possible. It always passes through the point of means (${xb}, ${yb}).`,
    fig:{ aria:"Five points: daily high temperature against iced drinks sold at a park kiosk (model data). A rough line drops in and tilts; vertical residual segments run from each point to the line, each with a small square on it, and a Sum of squares counter changes as the line tilts. The line settles where the counter is smallest, 16, and a ring marks the point of means (25, 60) on the line.", shape:"wide" }
  },
  goals:[
    "I can explain what “least squares” means and why the least-squares line is the line of best fit.",
    `I can find the least-squares line for a small data set, or from summary values (${xb}, ${yb}, ${sx}, ${sy}, ${r}).`,
    `I can interpret the slope and ${y}-intercept of a regression line in context, with units.`,
    "I can use a regression line to make predictions and tell interpolation from extrapolation.",
    "I can predict how changing or adding data points changes the line.",
    "I can judge when a regression prediction should not be trusted."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Slope and equations", goal:2, prompt:"Find the slope of the line through (2, 9) and (6, 21).",
          options:[
            { t:"3", ok:true, why:"(21 − 9) ÷ (6 − 2) = 12 ÷ 4." },
            { t:"`1/3`", why:`Slope is rise ÷ run: Δ${y} ÷ Δ${x}.` },
            { t:"12", why:"12 is the rise; divide by the run, 4." },
            { t:"7.5", why:"Use the changes between the points." }],
          hints:["Rise over run.", "Rise 21 − 9 = 12; run 6 − 2 = 4.", "12 ÷ 4 = 3."] },
        { id:"w2", skill:"Slope and equations", goal:2, prompt:`A line has slope 2 and passes through (25, 60). What is its ${y}-intercept?`,
          options:[
            { t:"10", ok:true, why:`60 = 2(25) + ${b}, so ${b} = 10.` },
            { t:"60", why:`60 is ${y} when ${x} = 25, not when ${x} = 0.` },
            { t:"110", why:`${b} = 60 − 50.` },
            { t:"35", why:"Multiply by the slope first: 2 × 25 = 50." }],
          hints:[`Substitute the point into ${y} = 2${x} + ${b}.`, `60 = 50 + ${b}.`, `${b} = 10.`] },
        { id:"w3", skill:"Means", goal:2, prompt:"Find the mean of 38, 52, 62, 68, 80.",
          options:[
            { t:"60", ok:true, why:"300 ÷ 5." },
            { t:"62", why:"62 is the middle value; the mean is the total ÷ 5." },
            { t:"59", why:"The total is 300." },
            { t:"75", why:"There are 5 values." }],
          hints:["Add, then divide by how many.", "The sum is 300.", "300 ÷ 5 = 60."] },
        { id:"w4", skill:"Correlation", goal:1, prompt:`A scatter plot has ${r} = −0.95. Which describes it?`,
          options:[
            { t:"A strong negative linear pattern", ok:true, why:`|${r}| close to 1, negative sign.` },
            { t:"A weak negative pattern", why:`Strength is the size of |${r}|: 0.95 is strong.` },
            { t:"A strong positive pattern", why:`Negative ${r}: ${y} falls as ${x} rises.` },
            { t:"No pattern", why:`A negative ${r} still shows a relationship.` }],
          hints:["The sign gives direction; the size gives strength.", "|−0.95| = 0.95 ≥ 0.67.", "Strong and negative."] },
        { id:"w5", skill:"Reading a scatter plot", goal:4, prompt:`A scatter plot shows temperatures from 15 °C to 35 °C. Which ${x}-value is inside the data’s range?`,
          options:[
            { t:"28 °C", ok:true, why:"Between 15 and 35." },
            { t:"40 °C", why:`That’s beyond the largest ${x}.` },
            { t:"0 °C", why:`That’s below the smallest ${x}.` },
            { t:"−5 °C", why:"That’s far below the range." }],
          hints:[`Find the smallest and largest ${x}.`, "15 and 35.", "28 is between them."] },
        { id:"w6", skill:"Reading a scatter plot", goal:3, prompt:`On the line ${y} = 2${x} + 10, what happens to ${y} when ${x} increases by 1?`,
          options:[
            { t:`${y} increases by 2`, ok:true, why:"That’s what the slope means." },
            { t:`${y} increases by 10`, why:"10 is the starting value." },
            { t:`${y} becomes 12`, why:`That’s ${y} when ${x} = 1, not the change.` },
            { t:`${y} doubles`, why:`Slope 2 adds 2; it doesn’t double ${y}.` }],
          hints:["What does slope measure?", `Change in ${y} per 1 unit of ${x}.`, "+2."] }
      ],
      refreshers:{
        "Slope and equations":`Slope = rise ÷ run. To find ${b}, substitute a point into ${y} = ${m}${x} + ${b}.`,
        "Means":"Mean = sum ÷ count. The mean is the balance point; the median is the middle.",
        "Correlation":`${r} runs from −1 to 1. The sign is the direction. Strength guide: |${r}| ≥ 0.67 strong, 0.33–0.67 moderate, below 0.33 weak.`,
        "Reading a scatter plot":`Note the ${x}-range of the data. The slope is the change in ${y} per unit of ${x}.`
      }
    }
  },
  explore:{
    heading:"Fit duel",
    intro:"Draw your own line, then let least squares draw its line. The squares show every miss. Whose total is smaller?",
    predIntro:"Make a prediction first. Then the fit duel will show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Which line has the smaller sum of squared residuals?",
        options:[{ t:"The least-squares line", ok:true }, { t:"The line through the end points" }, { t:"They tie" }, { t:"It depends on the units" }],
        explain:"The end-point line ignores the three middle points, which all sit above it. Least squares balances every residual. " + M1 },
      { id:"p2", prompt:"The least-squares line always passes through which point?",
        options:[{ t:"(25, 60)", ok:true }, { t:"(15, 38)" }, { t:"(35, 80)" }, { t:"(0, 10)" }],
        explain:`${xb} = 25 and ${yb} = 60. The least-squares line always passes through (${xb}, ${yb}).` },
      { id:"p3", prompt:"The 35 °C point moves up from 80 to 90. What happens to the least-squares slope?",
        options:[{ t:"It increases", ok:true }, { t:"It decreases" }, { t:"It stays 2" }, { t:"It becomes 0" }],
        explain:`A point far to the right of ${xb} has a lot of leverage. Raising it tilts the line up: the slope becomes 2.4.` },
      { id:"p4", prompt:`This new point lies exactly on ${yh} = 2${x} + 10. What happens to the least-squares line?`,
        options:[{ t:"It doesn’t change", ok:true }, { t:"The slope increases" }, { t:"The intercept decreases" }, { t:"It no longer passes through the point of means" }],
        explain:"A point with residual 0 adds nothing to the sum of squares, and the old line still balances every residual. The point of means moves to (27.5, 65), which is still on the line." }
    ],
    chalIntro:"Use the fit duel to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Data A: drag your own line so that its sum of squared residuals is <strong>below 20</strong>.",
        why:"Any line with a sum of squared residuals below 20 works. The least-squares line’s 16 is the smallest possible.",
        hints:["Look at the squares: which ones are biggest?", "Try passing through (25, 60), the point of means.", `${yh} = 2${x} + 10 gives 16.`] },
      { id:"tc2", goal:5, prompt:"Edit points mode, data A: drag <strong>only the 35 °C point</strong> so that the least-squares slope is <strong>exactly 2.4</strong>.",
        why:`Raising the 35 °C point by 10 adds (35 − 25) × 10 = 100 to ${SXY}: 600 ÷ 250 = 2.4.`,
        hints:[`Slope = Σ(${x} − 25)·${y} ÷ 250 here, because ${SXX} = 250.`, `Raising the 35 °C point by ${k} adds (35 − 25)${k} = 10${k} to the top. You need the top to go from 500 to 600.`, `${k} = 10: move it to 90.`] },
      { id:"tc3", goal:[1, 5], stretch:true, prompt:"Data A, original points: <strong>add one point</strong> so that the least-squares line <strong>does not change at all</strong>.",
        why:`A point on ${yh} = 2${x} + 10 has residual 0, so the old line still balances every residual and keeps the same sum of squares. Any point on the line works, such as (25, 60), (40, 90) or (5, 20).`,
        hints:["Which point would have a residual of 0?", "If the new residual is 0, the old line still balances the residuals and keeps the same SSR.", `Put it on ${yh} = 2${x} + 10, e.g. (40, 90).`] }
    ]
  },
  part3:{
    slug:"extrapolation", name:"Predictions",
    heading:"Predictions with care",
    intro:"A regression line will give you a number for any " + x + ". Your job now is to judge whether that number deserves trust. Visit each station, move the probe and watch the trust m&#101;ter.",
    stations:[
      { id:"s1", title:"Inside or outside?",
        text:`Data A (kiosk): ${yh} = 2${x} + 10, from days between 15 °C and 35 °C. Move the probe, or tap a temperature.` },
      { id:"s2", title:"Growing up",
        text:`Children’s heights at ages 2, 4, 6, 8 and 10 lie close to ${yh} = 6${x} + 80 (cm). Predict age 7, then age 30.` },
      { id:"s3", title:"Does the intercept mean anything?",
        text:`The intercept is the prediction at ${x} = 0. For each model, tap <strong>Meaningful</strong> or <strong>Just positions the line</strong>.`,
        cards:[
          { id:"c1", t:`Data C (taxi): ${yh} = 1.85${x} + 4.9, trips of 2–10 km. ${b} = 4.9 is the fare for a 0 km trip.`, answer:"mean",
            why:"A $4.90 base fare before any distance is driven makes sense, and 0 km is close to the data.",
            wrong:"Here a 0 km trip makes sense and is near the 2–10 km data: $4.90 is a sensible base fare." },
          { id:"c2", t:`Data B (sleep): ${yh} = −13${x} + 378, nights of 4–8 h. ${b} = 378 ms is the reaction time after 0 hours of sleep.`, answer:"pos",
            why:"0 h of sleep is far outside the 4–8 h data, so 378 ms isn’t meaningful. " + M7,
            wrong:"0 h is far outside the 4–8 h data. " + M7 }
        ] }
    ],
    quickCheck:{
      title:"Quick check", summary:"Predictions with care quick check",
      items:[
        { id:"q1", goal:4, prompt:"Data B: predict reaction time at 6.5 h of sleep.",
          choices:[
            { t:"293.5 ms", ok:true, fb:"Right. −13(6.5) + 378 = 293.5." },
            { t:"300 ms", fb:"−13(6.5) + 378 = 293.5." },
            { t:"291 ms", fb:"−13(6.5) + 378 = 293.5." },
            { t:"284.5 ms", fb:"−13(6.5) + 378 = 293.5." }] },
        { id:"q2", goal:4, prompt:"Which prediction is extrapolation for data C (2–10 km)?",
          choices:[
            { t:"25 km", ok:true, fb:"Right. 25 is outside 2–10." },
            { t:"7 km", fb:"25 is outside 2–10." },
            { t:"3 km", fb:"25 is outside 2–10." },
            { t:"9.5 km", fb:"25 is outside 2–10." }] },
        { id:"q3", goal:3, prompt:"In data C, what does 1.85 mean?",
          choices:[
            { t:"Each extra km adds about $1.85", ok:true, fb:"Right. Slope = change in fare per km." },
            { t:"The fare for 1 km is $1.85", fb:"Slope = change in fare per km. " + M5 },
            { t:"The base fare is $1.85", fb:"Slope = change in fare per km. " + M5 },
            { t:"Fares rise 1.85% per km", fb:"Slope = change in fare per km. " + M5 }] },
        { id:"q4", goal:6, prompt:`Is ${b} = 378 in data B meaningful?`,
          choices:[
            { t:"No: 0 h is far outside the data", ok:true, fb:`Right. Intercepts can matter (taxi), but only when ${x} = 0 makes sense and is near the data.` },
            { t:"Yes: it’s the starting value", fb:`Intercepts can matter (taxi), but only when ${x} = 0 makes sense and is near the data.` },
            { t:"Yes: intercepts always matter", fb:`Intercepts can matter (taxi), but only when ${x} = 0 makes sense and is near the data.` },
            { t:"No: intercepts are never meaningful", fb:`Intercepts can matter (taxi), but only when ${x} = 0 makes sense and is near the data.` }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"meaning", type:"match", title:"Line ↔ meaning", summary:"Line ↔ meaning", goal:[3, 4],
        instruction:"Match each part of a regression model to what it means.",
        leftTitle:"Statement", rightTitle:"Meaning",
        left:[
          { id:"l1", goal:3, t:`Slope 2 in ${yh} = 2${x} + 10 (drinks, °C)`, why:"Slope is a rate with both units: drinks per °C." },
          { id:"l2", goal:3, t:`Slope −13 in ${yh} = −13${x} + 378 (ms, hours)`, why:`A negative slope means ${y} decreases as ${x} increases: faster reactions with more sleep.`,
            hints:[`Which way does ${y} move when ${x} rises?`, "Down 13 ms per hour.", "Faster reactions with more sleep."] },
          { id:"l3", goal:3, t:`Intercept 4.9 in ${yh} = 1.85${x} + 4.9 ($, km)`, why:`At ${x} = 0 km the model gives $4.90: a base fare.` },
          { id:"l4", goal:3, t:"Intercept 378 in the sleep model", why:"0 h is far outside 4–8 h, so 378 only positions the line." },
          { id:"l5", goal:4, t:"Predicting at 28 °C with data A", why:"28 °C is inside 15–35 °C." },
          { id:"l6", goal:4, t:"Predicting at 45 °C with data A", why:"45 °C is outside 15–35 °C." }
        ],
        right:[
          { id:"r1", t:"About 2 more drinks sold per 1 °C warmer" },
          { id:"r2", t:"Reaction time about 13 ms faster per extra hour of sleep" },
          { id:"r3", t:"About $4.90 before any distance is driven" },
          { id:"r4", t:"Positions the line; 0 h of sleep is outside the data" },
          { id:"r5", t:"Interpolation" },
          { id:"r6", t:"Extrapolation" },
          { id:"r7", t:"Reaction time about 13 ms slower per extra hour of sleep" },
          { id:"r8", t:"Reaction time with no sleep" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6" },
        wrong:{ "l2|r7":`A negative slope means ${y} decreases as ${x} increases: faster reactions.`, "l4|r8":`${x} = 0 is far outside 4–8 h.` },
        wrongDefault:`Slope is a rate with both units; the intercept is ${y} at ${x} = 0.` },
      { id:"compute", type:"custom", title:"Compute and predict", summary:"Compute and predict", goal:[2, 4, 5], star:true,
        instruction:"Find each line, value or prediction. Items marked ★ are non-routine; the last two go beyond the Final Check.",
        how:"Type numbers such as 1.5, −13 or 3/4 in each box, then press Check.",
        items:[
          { id:"L1", goal:2, form:"mb", prompt:`${xb} = 12, ${yb} = 40, ${r} = 0.75, ${sx} = 4, ${sy} = 8. Find ${m} and ${b}.`, answer:[1.5, 22],
            display:`${m} = 1.5, ${b} = 22`, why:`${m} = 0.75 × 8 ÷ 4 = 1.5; ${b} = 40 − 1.5(12) = 22.`,
            wrongM:[{ match:0.375, fb:`${sy} goes on top. ` + M4 }] },
          { id:"L2", goal:2, form:"line", prompt:"Data (0, 2), (1, 3), (2, 7), (3, 8), (4, 10). Find the least-squares line.", answer:[2.1, 1.8],
            display:`${yh} = 2.1${x} + 1.8`, why:`${SXY} = 21 and ${SXX} = 10, so ${m} = 2.1 and ${b} = 6 − 2.1(2) = 1.8.`,
            wrongM:[{ match:2, fb:`${SXY} = 21 and ${SXX} = 10.` }],
            hints:[`${xb} = 2, ${yb} = 6.`, `Deviations: ${x}: −2, −1, 0, 1, 2; ${y}: −4, −3, 1, 2, 4. Products: 8, 3, 0, 2, 8.`, `21 ÷ 10 = 2.1; ${b} = 6 − 2.1(2) = 1.8.`] },
          { id:"L3", goal:4, form:"num", prompt:"Data C: predict the fare for 7 km.", label:"Fare: $", answer:17.85, tol:0.005,
            display:"$17.85", why:"1.85 × 7 = 12.95, then add 4.9: $17.85.",
            wrong:[{ match:12.95, fb:"Multiply first: 1.85 × 7 = 12.95, then add 4.9." }] },
          { id:"L4", goal:2, star:true, form:"num", prompt:`A least-squares line is ${yh} = 3${x} + 5 and ${xb} = 4. Find ${yb}.`, label:`${yb} =`, answer:17,
            display:`${yb} = 17`, why:`The line passes through (${xb}, ${yb}): 3(4) + 5 = 17.`,
            general:`The line passes through (${xb}, ${yb}): 3(4) + 5.` },
          { id:"L5", goal:5, star:true, form:"line", prompt:`Every ${y}-value in a data set is doubled. The old line was ${yh} = 3${x} + 5. What is the new line?`, answer:[6, 10],
            display:`${yh} = 6${x} + 10`, why:"Every predicted value doubles, including the intercept.",
            wrong:[{ match:[6, 5], fb:"Every predicted value doubles, including the intercept." }] },
          { id:"L6", goal:2, star:true, form:"num", prompt:`For a data set, (${xb}, ${yb}) = (10, 50). A student claims the least-squares line is ${yh} = 4${x} + 15. If the slope 4 is right, what must the intercept be?`, label:`${b} =`, answer:10,
            display:`${b} = 10`, why:`50 = 4(10) + ${b}, so ${b} = 10.`,
            wrong:[{ match:15, fb:"4(10) + 15 = 55 ≠ 50, so the claim fails the point-of-means test." }],
            hints:["Which point must every least-squares line pass through?", `50 = 4(10) + ${b}.`, `${b} = 10.`] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Sunita", how:"", goal:[2, 6],
        instruction:"Sunita made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Find the least-squares line for (1, 4), (2, 5), (3, 8), (4, 9), (5, 9).",
            steps:[`${xb} = 3, ${yb} = 35 ÷ 5 = 7.`, `${SXY} = (−2)(−3) + (−1)(−2) + 0 + (1)(2) + (2)(2) = 14.`, `${SYY} = 9 + 4 + 1 + 4 + 4 = 22, so ${m} = 14 ÷ 22 ≈ 0.64.`, `${b} = 7 − 0.64(3) ≈ 5.09.`],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 uses step 3’s slope. The mistake is earlier."],
            fixes:[
              { t:`Divide by ${SXX} = 4 + 1 + 0 + 1 + 4 = 10: ${m} = 1.4, ${b} = 7 − 4.2 = 2.8.`, ok:true, why:`The bottom of the slope formula is ${SXX}: ${yh} = 1.4${x} + 2.8.` },
              { t:`Divide by 5, the number of points: ${m} = 2.8.`, why:"That’s not the formula." },
              { t:`Divide by Σ${x} = 15.`, why:`Use squared deviations of ${x}.` },
              { t:"Step 3 is correct.", why:`The bottom of the slope formula uses only ${x}. ` + M3 }],
            hints:["What is in the denominator of the slope formula?", `${SXX} = 10.`, `${yh} = 1.4${x} + 2.8.`] },
          { id:"e2", goal:6, task:`Use ${yh} = 2${x} + 10 (data A, 15–35 °C) to plan for a 50 °C heat warning.`,
            steps:[`The model fits well: ${r} = 0.992.`, `${yh} = 2(50) + 10 = 110 drinks.`, "Because the fit is so strong, 110 is a reliable prediction.", "So order exactly 110 cups."],
            answer:2,
            stepFb:["Step 1 is correct: it fits well inside 15–35 °C.", "The arithmetic is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"50 °C is far outside 15–35 °C. This is extrapolation; the pattern may not hold, so treat 110 with caution.", ok:true, why:M6 },
              { t:`Use ${r}² instead: 0.984 × 110 ≈ 108.`, why:`${r}² doesn’t adjust predictions.` },
              { t:"Round up to 120 to be safe.", why:"The issue is extrapolation, not rounding." },
              { t:"Step 3 is correct.", why:"A strong fit inside the data says nothing about outside it." }],
            hints:[`What ${x}-values were in the data?`, "15 to 35 °C.", "50 is extrapolation."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"In the fit duel, how close did your own line get to 16? What did the squares teach you that the points alone didn’t?" },
      { id:"j2", q:`In your own words, what does ‘least squares’ mean, and why must the line pass through (${xb}, ${yb})?` },
      { id:"j3", q:`Explain to a friend how to find a regression line from ${xb}, ${yb}, ${sx}, ${sy} and ${r}.` },
      { id:"j4", q:"Describe a real situation where an extrapolated prediction could cause harm. What would you do instead?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"The least-squares line is the line that…", options:[
          { t:"makes the sum of the squared residuals as small as possible", ok:true, why:"That’s what “least squares” means." },
          { t:"passes through the first and last data points.", why:M1 },
          { t:"passes through the most data points.", why:"It may pass through none. " + M1 },
          { t:"makes every residual 0.", why:"That’s only possible when all points lie on one line." }] },
        b:{ prompt:"Which point does every least-squares line pass through?", options:[
          { t:`(${xb}, ${yb})`, ok:true, why:"Every least-squares line passes through the point of means." },
          { t:"(0, 0)", why:"Only if the means are both 0." },
          { t:`The point with the largest ${x}.`, why:M1 },
          { t:`(0, ${yb})`, why:`The line passes through ${yb} at ${x} = ${xb}, not at ${x} = 0.` }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:`For ${yh} = 2${x} + 10 (iced drinks sold vs °C), the slope means…`, options:[
          { t:"about 2 more drinks are sold for each 1 °C warmer", ok:true, why:"Slope = predicted change in drinks per 1 °C." },
          { t:"2 drinks are sold at 1 °C.", why:M5 },
          { t:"10 more drinks per °C.", why:"10 is the intercept. " + M5 },
          { t:"drink sales double each degree.", why:"Slope adds; it doesn’t multiply." }] },
        b:{ prompt:`For ${yh} = 1.85${x} + 4.9 (taxi fare in $ vs km), the intercept means…`, options:[
          { t:"about $4.90 is charged before any distance is driven", ok:true, why:`At ${x} = 0 km the model gives $4.90, a sensible base fare.` },
          { t:"the fare rises $4.90 per km.", why:"The rate per km is the slope, 1.85. " + M5 },
          { t:"a 1 km trip costs $4.90.", why:"A 1 km trip costs about $6.75." },
          { t:"nothing, because intercepts are never meaningful.", why:`Here ${x} = 0 makes sense.` }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:`Use ${yh} = −13${x} + 378 (reaction time in ms vs hours of sleep, data 4–8 h) to predict for 6.5 h.`, options:[
          { t:"293.5 ms", ok:true, why:"−84.5 + 378." },
          { t:"462.5 ms", why:"The slope is negative: subtract 84.5." },
          { t:"284.5 ms", why:"−13 × 6.5 = −84.5, not −93.5." },
          { t:"300 ms", why:"That’s the mean, not the prediction at 6.5 h." }] },
        b:{ prompt:`Use ${yh} = 1.85${x} + 4.9 to predict the fare for 6 km.`, options:[
          { t:"$16.00", ok:true, why:"11.10 + 4.90." },
          { t:"$11.10", why:"Add the 4.90." },
          { t:"$15.85", why:"1.85 × 6 = 11.10." },
          { t:"$40.50", why:"That multiplies 6 by the 1 km fare, $6.75; the base fare is only paid once." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:`${xb} = 20, ${yb} = 50, ${sx} = 5, ${sy} = 10, ${r} = 0.8. Find the least-squares line.`, options:[
          { t:`${yh} = 1.6${x} + 18`, ok:true, why:`${m} = 0.8 × 10 ÷ 5 = 1.6; ${b} = 50 − 1.6(20) = 18.` },
          { t:`${yh} = 0.4${x} + 42`, why:`${sy} goes on top. ` + M4 },
          { t:`${yh} = 2${x} + 10`, why:`Multiply by ${r}. ` + M4 },
          { t:`${yh} = 1.6${x} + 50`, why:`${b} = ${yb} − ${m}${xb}, not ${yb}.` }] },
        b:{ prompt:`${xb} = 10, ${yb} = 70, ${sx} = 4, ${sy} = 12, ${r} = −0.6. Find the least-squares line.`, options:[
          { t:`${yh} = −1.8${x} + 88`, ok:true, why:`${m} = −0.6 × 12 ÷ 4 = −1.8; ${b} = 70 + 18 = 88.` },
          { t:`${yh} = −0.2${x} + 72`, why:M4 },
          { t:`${yh} = −3${x} + 100`, why:`Multiply by ${r}. ` + M4 },
          { t:`${yh} = −1.8${x} + 52`, why:`${b} = 70 − (−1.8)(10) = 88.` }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"Find the least-squares line for (1, 3), (2, 7), (3, 5), (4, 11), (5, 9).", options:[
          { t:`${yh} = 1.6${x} + 2.2`, ok:true, why:`${SXY} = 16, ${SXX} = 10, ${b} = 7 − 4.8.` },
          { t:`${yh} = 1.5${x} + 2.5`, why:"That line passes through (3, 7), but its slope isn’t the least-squares slope." },
          { t:`${yh} = 0.4${x} + 5.8`, why:`Divide by ${SXX} = 10, not ${SYY} = 40.` },
          { t:`${yh} = 1.6${x} + 7`, why:`${b} = ${yb} − ${m}${xb} = 7 − 4.8.` }] },
        b:{ prompt:"Find the least-squares line for (2, 5), (4, 9), (6, 8), (8, 14), (10, 14).", options:[
          { t:`${yh} = 1.15${x} + 3.1`, ok:true, why:`${SXY} = 46, ${SXX} = 40, ${b} = 10 − 6.9.` },
          { t:`${yh} = 1.125${x} + 2.75`, why:"That line joins the first and last points. " + M1 },
          { t:`${yh} = 0.74${x} + 5.5`, why:`The bottom is ${SXX} = 40, not ${SYY} = 62.` },
          { t:`${yh} = 1.15${x} + 10`, why:`${b} = ${yb} − ${m}${xb}.` }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:`Every ${y}-value in a data set increases by 5. How does the least-squares line change?`, options:[
          { t:"Same slope; the intercept increases by 5", ok:true, why:"Every point and prediction moves up 5." },
          { t:"The slope increases by 5.", why:"Shifting up doesn’t tilt the line." },
          { t:"Both slope and intercept increase by 5.", why:"The slope is unchanged." },
          { t:"It doesn’t change.", why:"The points moved, so the line moves too." }] },
        b:{ prompt:"A new point is added exactly on the current least-squares line. What happens to the line?", options:[
          { t:"It stays the same", ok:true, why:"Its residual is 0, so the old line still balances every residual." },
          { t:"The slope increases.", why:"Only points off the line can tilt it." },
          { t:"It must now pass through the new point and the old means.", why:"It already does; nothing changes." },
          { t:"The intercept becomes 0.", why:"No reason for that." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why the least-squares line is called the line of best fit?", options:[
          { t:"“Of all possible lines, it has the smallest total of squared vertical distances from the points to the line.”", ok:true, why:"Least squares judges a line by all the squared vertical misses together." },
          { t:"“It goes through as many points as possible.”", why:M1 },
          { t:"“It has the smallest total of perpendicular distances to the points.”", why:"Residuals are vertical. " + M2 },
          { t:`“It always has ${r} = 1.”`, why:`${r} describes the data, not the line.` }] },
        b:{ prompt:"Which is the best description of a residual?", options:[
          { t:`“The observed ${y} minus the predicted ${y} for that point’s ${x}.”`, ok:true, why:"A residual is a vertical miss: observed − predicted." },
          { t:`“The predicted ${y} minus the observed ${x}.”`, why:M2 },
          { t:"“The shortest distance from the point to the line.”", why:M2 },
          { t:`“The difference between ${x} and ${xb}.”`, why:"That’s a deviation, not a residual." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:`The model ${yh} = 5.6${x} + 47.2 links hours studied (1–5 h) to test score (%). Which statement is correct?`, options:[
          { t:"“Each extra hour of study predicts about 5.6 more percentage points; 47.2 is the predicted score for 0 hours, just outside the data, so use it with care.”", ok:true, why:"The slope is a rate with both units, and the intercept is a prediction at 0 h, just outside 1–5 h." },
          { t:"“Studying 1 hour gives a score of 5.6%.”", why:M5 },
          { t:"“Each hour adds 47.2 points.”", why:M5 },
          { t:"“47.2% is guaranteed for anyone who doesn’t study.”", why:"A prediction is never a guarantee, and 0 h is outside the data. " + M7 }] },
        b:{ prompt:`The model ${yh} = −13${x} + 378 links hours of sleep (4–8 h) to reaction time (ms). Which statement is correct?`, options:[
          { t:"“Each extra hour of sleep predicts a reaction about 13 ms faster; 378 ms at 0 hours is far outside the data and not meaningful.”", ok:true, why:"Negative slope: faster reactions with more sleep; 0 h is far outside 4–8 h." },
          { t:"“Reaction time is 13 ms after 1 hour of sleep.”", why:M5 },
          { t:"“Each hour of sleep slows reactions by 13 ms.”", why:"Negative slope: faster." },
          { t:"“With no sleep, reaction time will be 378 ms.”", why:M7 }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:`For used cars of one model, value (thousands of $) vs age (years, 1–8) fits ${yh} = −2.5${x} + 30. Predict the value of a 4-year-old car.`, options:[
          { t:"$20 000", ok:true, why:"−10 + 30 = 20 (thousand)." },
          { t:"$40 000", why:"The slope is negative: subtract." },
          { t:"$27 500", why:"−2.5 × 4 = −10." },
          { t:"$10 000", why:"That’s the drop, not the value." }] },
        b:{ prompt:`Phone battery (%) vs minutes of video (0–200) fits ${yh} = −0.4${x} + 100. After how many minutes does the model predict 20%?`, options:[
          { t:"200 minutes", ok:true, why:`20 = −0.4${x} + 100, so ${x} = 200.` },
          { t:"50 minutes", why:`Solve −0.4${x} = −80.` },
          { t:"92 minutes", why:"That’s the battery after 20 minutes: −0.4(20) + 100 = 92." },
          { t:"300 minutes", why:"−0.4 × 300 = −120: that gives −20%." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:`Children’s heights (ages 2–10) fit ${yh} = 6${x} + 80 cm with ${r} = 0.99. Someone predicts an adult height at age 30 of 260 cm. What is the best judgement?`, options:[
          { t:"Don’t trust it: age 30 is far outside the data, and growth stops", ok:true, why:M6 },
          { t:`Trust it, because ${r} = 0.99.`, why:"A strong fit inside the data says nothing about outside it." },
          { t:"Trust it, but round to 250 cm.", why:"Rounding doesn’t fix extrapolation." },
          { t:"Use the intercept instead: 80 cm.", why:M7 }] },
        b:{ prompt:`Kiosk sales fit ${yh} = 2${x} + 10 for 15–35 °C. The manager uses it to predict sales on a 0 °C day: 10 drinks. What is the best judgement?`, options:[
          { t:"Don’t trust it: 0 °C is outside 15–35 °C, and the pattern may not hold", ok:true, why:M6 },
          { t:"Trust it: the intercept gives sales at 0 °C.", why:M7 },
          { t:`Trust it: the line passes through (${xb}, ${yb}).`, why:"That’s true for any least-squares line and says nothing about 0 °C." },
          { t:"Double it to be safe.", why:"The issue is extrapolation." }] } }
    ]
  },
  task:{
    title:"Hit the target line", summary:"Hit the target line",
    statement:`<p>Choose ${y}-values for ${x} = 1, 2, 3, 4, 5 so that the least-squares line is exactly ${yh} = 2${x} + 1, but the points are not all on it. Can you find all the answers?</p>` +
      '<ol class="lr-conds"><li>Least-squares slope is exactly 2.</li><li>Least-squares intercept is exactly 1.</li><li>No residual is bigger than 1 in size.</li><li>At least one point is off the line.</li></ol>' +
      `<p class="tiny muted">Each ${y} is a whole number from 0 to 12.</p>`,
    checks:["Slope 2", "Intercept 1", "No residual bigger than 1", "Not all on the line"],
    tips:[`The slope depends on Σ(${x} − 3)·${y}. Points left of 3 count negatively and points right of 3 count positively.`,
      `The line passes through (${xb}, ${yb}) = (3, ${yb}). For intercept 1 you need ${yb} = 7, so the ${y}’s add to 35.`,
      "Start from the line’s own values 3, 5, 7, 9, 11, then move points up or down by 1.",
      "The residuals must add to 0 <strong>and</strong> balance left vs right."],
    explainPrompt:"Explain how you made the slope exactly 2 and the intercept exactly 1 while moving points off the line.",
    vocab:"Use the words residual, least squares, point of means and slope.",
    more:"There’s more than one answer. Can you find them all?",
    after3:`In every answer the residuals add to 0 and Σ(${x} − 3) × residual = 0. Those two balances are exactly what least squares requires.`,
    afterAt:6
  },
  cards:[
    ["Residual", `Observed ${y} − predicted ${y}: a vertical distance.`],
    ["Least squares", "The line that makes Σ(residual)² as small as possible."],
    ["Point of means", `Every least-squares line passes through (${xb}, ${yb}).`],
    ["Slope from data", `${m} = ${SXY} ÷ ${SXX}.`],
    ["Slope from summaries", `${m} = ${r} × ${sy} ÷ ${sx}.`],
    ["Intercept", `${b} = ${yb} − ${m}${xb}.`],
    ["Meaning of the slope", `Predicted change in ${y} per 1-unit increase in ${x}, with both units.`],
    ["Meaning of the intercept", `Predicted ${y} at ${x} = 0; meaningful only if ${x} = 0 makes sense and is near the data.`],
    ["Interpolation", `Predicting inside the data’s ${x}-range: usually reasonable.`],
    ["Extrapolation", `Predicting outside the data’s ${x}-range: risky; the pattern may change.`],
    ["Leverage", `Points far from ${xb} tilt the line most when they move.`],
    [`Shifting ${y}`, `Adding <i>c</i> to every ${y} adds <i>c</i> to the intercept; the slope is unchanged.`]
  ]
};
