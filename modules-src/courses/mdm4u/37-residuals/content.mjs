// MDM4U 37 Residuals & Goodness of Fit. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/37-residuals.md
// Math is written as HTML (italic letters, true minus) because x̄, ȳ and ŷ don't typeset inside backticks.
const x = "<i>x</i>", y = "<i>y</i>", r = "<i>r</i>", r2 = "<i>r</i>²", yh = "<i>ŷ</i>", xb = "<i>x̄</i>", yb = "<i>ȳ</i>", e = "<i>e</i>";
// Core feedback sentences for the plan's misconceptions (§3), used where the plan names only the code.
const M1 = "Residual = <strong>observed</strong> − predicted. A point above the line has a positive residual.";
const M2 = `${r2} measures how much variation the line explains, not whether a line is the right shape. Check the residual plot.`;
const M3 = `${r2} is ${r} × ${r}. ${r} = 0.9 gives 0.81: 81% of the variation in ${y} is explained.`;
const M4 = "Size isn’t the test; pattern is. A U-shape means the relationship curves.";
const M5 = `A point at ${xb} can’t tilt the line. A point far from ${xb} can drag the line so hard that its own residual looks small.`;
const M6 = "Investigate an outlier before removing it: it may be an error, or the most important data point.";
const M7 = "Compare residual plots too: a model with random residuals and a smaller SSR is better.";

// A small residual plot as inline SVG (residuals in increasing x order, equally spaced). Styled by app.css (.rs-*).
function resSVG(res, label){
  const W = 220, H = 96, pad = 14, mx = Math.max(4, ...res.map(v => Math.abs(v))), n = res.length;
  const X = i => pad + (W - 2 * pad) * (n === 1 ? 0.5 : i / (n - 1)), Y = v => H / 2 - (H / 2 - 10) * v / mx;
  const dots = res.map((v, i) => `<line class="rs-seg" x1="${X(i).toFixed(1)}" y1="${(H / 2).toFixed(1)}" x2="${X(i).toFixed(1)}" y2="${Y(v).toFixed(1)}"/><circle class="rs-dot" cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="4.5"/>`).join("");
  return `<svg class="rs-mini" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}"><line class="rs-zero" x1="4" y1="${H / 2}" x2="${W - 4}" y2="${H / 2}"/>${dots}</svg>`;
}
const aria = res => "Residual plot. Residuals in increasing x order: " + res.map(v => (v > 0 ? "+" : v < 0 ? "minus " : "") + Math.abs(v)).join(", ");
const SORT = [
  [[1, -2, 2, -1, 0, 1, -1], "fit", "No bend, no widening, no stand-out: the signs mix at random."],
  [[4, 0, -4, -4, 0, 4], "curve", "Positive at both ends, negative in the middle: a U, so the data curve."],
  [[-3, 0, 2, 3, 1, -3], "curve", "Negative at both ends, positive in the middle: a ∩, so the data curve."],
  [[0.5, -0.5, 1, -1.5, 3.5, -3], "fan", "The residuals alternate but get bigger as x increases: the spread grows."],
  [[1, -2, 0, -2, 8, -3, -2], "one", "One residual, +8, stands far from the rest: one unusual point."],
  [[-0.2, 0.3, -0.1, 0.2, -0.2], "fit", "Small and patternless: the line fits well."],
  [[4, 1, -2, -4, -2, 1, 2], "curve", "High at the ends, low in the middle: a U, so the data curve."],
  [[0, 1, -1, 3, -4, 6, -5], "fan", "The signs alternate and the size keeps growing: a fan."]
];
const BOX = { fit:"Line fits well", curve:"Curved", fan:"Spread grows", one:"One unusual point" };

export default {
  id:"37-residuals",
  kind:"topic",
  title:"Residuals & goodness of fit",
  topic:"Residuals & Goodness of Fit",
  readyTopic:"residuals and goodness of fit",
  hero:{
    eq:`residual = observed − predicted<br>${r2} = 1 − SSR ÷ Σ(${y} − ${yb})²`,
    eqLabel:"Residual equals observed minus predicted. r squared equals 1 minus SSR divided by the sum of (y minus y-bar) squared.",
    eqSize:"sm",
    headline:"The leftovers tell the truth.",
    text:`A line can look great and still be the wrong model. Plot the <strong>residuals</strong>, what’s left over after the line’s predictions, against ${x}. Random scatter means the line has captured the pattern. A curve in the residuals means the data curve too. <strong>${r2}</strong> tells you how much of the variation the line explains, but only the residual plot tells you whether a line was the right choice.`,
    fig:{ aria:"Braking distance against car speed: five points and their least-squares line. Orange residual segments drop from each point to the line. Then the plot folds: the line flattens into the zero line of a residual plot below, and the five residual dots land at +2, −1, −2, −1, +2, tracing a U. Caption: r² = 0.96, but the residuals smile.", shape:"wide" }
  },
  goals:[
    "I can calculate a residual and say what its sign means in context.",
    "I can read a residual plot and decide whether a linear model is appropriate.",
    `I can calculate and interpret ${r2} as the proportion of variation explained.`,
    `I can explain why a high ${r2} alone doesn’t prove a linear model is right.`,
    "I can tell an outlier from an influential point by how it changes the line.",
    `I can choose the better of two models using residuals, SSR and ${r2}.`
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Predictions from a line", goal:1, prompt:`Using ${yh} = 4${x} + 6, what is the predicted ${y} at ${x} = 5?`,
          options:[
            { t:"26", ok:true, why:"4(5) + 6." },
            { t:"30", why:"4 × 5 first." },
            { t:"20", why:"Add the 6." },
            { t:"54", why:`Slope × ${x}, then add <i>b</i>.` }],
          hints:[`Substitute ${x} = 5.`, "4 × 5 = 20.", "20 + 6 = 26."] },
        { id:"w2", skill:"Predictions from a line", goal:1, prompt:`A point (5, 25) sits near the line ${yh} = 4${x} + 6. How far above or below the line is it?`,
          options:[
            { t:"1 below", ok:true, why:"Predicted 26; observed 25." },
            { t:"1 above", why:"Observed 25 is less than 26: below." },
            { t:"25 above", why:"Compare with the prediction, 26." },
            { t:"On the line", why:"26 ≠ 25." }],
          hints:[`Find the predicted ${y}.`, "26.", "25 − 26 = −1: below."] },
        { id:"w3", skill:"Correlation", goal:3, prompt:`Which ${r} shows the strongest linear relationship?`,
          options:[
            { t:"−0.92", ok:true, why:"Largest size, |−0.92|." },
            { t:"0.85", why:`Strength is |${r}|.` },
            { t:"0.50", why:"Moderate." },
            { t:"0", why:"No linear relationship." }],
          hints:["Compare sizes, ignoring the sign.", "0.92 > 0.85.", "−0.92."] },
        { id:"w4", skill:"Correlation", goal:4, prompt:`Points lie exactly on the curve ${y} = ${x}² for ${x} = 1, 2, 3, 4, 5. Which is true?`,
          options:[
            { t:`${r} is close to 1, even though the pattern is curved`, ok:true, why:`Over this range the curve rises steadily, so ${r} ≈ 0.98.` },
            { t:`${r} = 0, because it’s a curve`, why:"A rising curve still has strong positive correlation." },
            { t:`${r} = 1 exactly`, why:`Only points exactly on a straight line give ${r} = 1.` },
            { t:`${r} is negative`, why:`${y} increases as ${x} increases.` }],
          hints:[`As ${x} rises, does ${y} rise?`, "Yes, steadily.", `${r} is high but not 1.`] },
        { id:"w5", skill:"Squaring and proportions", goal:3, prompt:"What is 0.9²?",
          options:[
            { t:"0.81", ok:true, why:"0.9 × 0.9 = 0.81." },
            { t:"1.8", why:"Squaring multiplies by itself." },
            { t:"0.09", why:"0.9 × 0.9 = 0.81." },
            { t:"0.18", why:"0.9 × 0.9, not 0.9 × 0.2." }],
          hints:["0.9 × 0.9.", "9 × 9 = 81.", "Two decimal places: 0.81."] },
        { id:"w6", skill:"Squaring and proportions", goal:3, prompt:"A line explains 640 of 800 units of variation. What proportion is that?",
          options:[
            { t:"0.80", ok:true, why:"640 ÷ 800." },
            { t:"0.64", why:"Divide by the total, 800." },
            { t:"1.25", why:"That’s 800 ÷ 640: part over whole." },
            { t:"0.20", why:"That’s the unexplained part." }],
          hints:["Part ÷ whole.", "640 ÷ 800.", "0.8 = 80%."] }
      ],
      refreshers:{
        "Predictions from a line":"Substitute <i>x</i>, multiply by the slope, then add the intercept. Compare the prediction with the observed value.",
        "Correlation":`Strength is |${r}|. A rising curve can still have a large ${r}.`,
        "Squaring and proportions":`${r2} = ${r} × ${r}. A proportion is part ÷ whole, often written as a percentage.`
      }
    }
  },
  explore:{
    heading:"Residual inspector",
    intro:`Every point leaves a residual. Drop them onto a residual plot and look for a pattern. Then add or drag points and watch what happens to the line, ${r2} and the residuals.`,
    predIntro:"Make a prediction first. Then the inspector shows you what really happens.",
    predictions:[
      { id:"p1", start:{ ds:"A7", mode:"ins" },
        prompt:"Data A7. What will the residual plot look like?",
        options:[{ t:"Random scatter around 0", ok:true }, { t:"A U-shape" }, { t:"A fan" }, { t:"All residuals 0" }],
        explain:"The residual dots fall at −2, 2, −1, 2, −1, 2, −2. No curve or growing spread: a line is a good model here." },
      { id:"p2", start:{ ds:"B", mode:"ins" },
        prompt:`Data B. ${r2} = 0.963. What will the residual plot show?`,
        options:[{ t:"A U-shape", ok:true }, { t:"Random scatter" }, { t:"A fan" }, { t:"All residuals 0" }],
        explain:`The residual dots land at +2, −1, −2, −1, +2. The braking distance curves upward. The line is too high in the middle and too low at both ends, even though ${r2} is high.` },
      { id:"p3", start:{ ds:"A7", mode:"add", x:4, y:5 },
        prompt:"Data A7, Add a point. A new point at (4, 5) is far below the line. What happens to the slope?",
        options:[{ t:"It stays 4", ok:true }, { t:"It increases" }, { t:"It decreases" }, { t:"It becomes negative" }],
        explain:`The line drops slightly but stays parallel; ${r2} falls from 0.953 to 0.620. ${x} = 4 is ${xb}. A point at the mean ${x} has no leverage: it lowers the intercept and ${r2}, not the slope.` },
      { id:"p4", start:{ ds:"A7", mode:"add", x:20, y:50 },
        prompt:`Data A7; add (20, 50). The original line predicts 86 at ${x} = 20. The new point is at 50. What happens?`,
        options:[{ t:"The line swings toward the new point, and the slope drops to about 2", ok:true }, { t:"The slope stays 4" }, { t:"The new point gets a residual of −36" }, { t:`${r2} rises` }],
        explain:`The line pivots; the new slope is 2.0; the new point’s residual is only −3.5. A point far from ${xb} has huge leverage. It drags the line toward itself, so its own residual looks small. That’s an influential point.` }
    ],
    chalIntro:"Use the inspector to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"Data B, Compare models: choose the model that removes the pattern from the residuals.",
        why:`The curve ${y} = 0.01${x}² + 1 fits every point, so all its residuals are 0: the pattern is gone.`,
        hints:["Which way do the residuals bend?", "Up at both ends: the data curve upward.", "Choose ‘curve opening up’."] },
      { id:"tc2", goal:5, prompt:`Data A7: add <strong>one point</strong> that drops ${r2} <strong>below 0.8</strong> but changes the slope by <strong>no more than 0.1</strong>.`,
        why:`A point at ${x} = 4 = ${xb} can’t tilt the line. Far enough from 22 (the line’s prediction there), it drops ${r2} below 0.8 and only shifts the intercept.`,
        hints:["Where can a point sit without tilting the line?", `At ${xb} = 4.`, "Put it at (4, 5) or (4, 40)."] },
      { id:"tc3", goal:5, stretch:true, prompt:`Data A7: add a point at ${x} = 20 that changes the slope by <strong>more than 1</strong>, but whose <strong>own residual</strong> (from the new line) is <strong>smaller than 5</strong> in size.`,
        why:"An influential point can hide in plain sight: its residual looks ordinary because it moved the line.",
        hints:[`Points far from ${xb} drag the line toward themselves.`, "You need to be far enough from 86 to tilt the line by more than 1, but not so far that the line can’t follow.", `Try ${y} = 50: slope 2.0, residual −3.5.`] }
    ]
  },
  part3:{
    slug:"is-linear-right", name:"Is linear right?",
    heading:"Is linear right?",
    intro:"Three data sets, side by side. Compare a line with a curve using residual plots and SSR, then decide what to do about an outlier. Each station’s <strong>Check it with data</strong> panel reveals where its model data come from.",
    stations:[
      { id:"s1", title:"Braking (curved)",
        text:`Car speed (km/h) vs braking distance (m). The line has ${r2} = 0.963 and SSR = 14, and its residuals are U-shaped. The curve ${y} = 0.01${x}² + 1 has SSR = 0.`,
        items:[
          { id:"s1a", goal:6, label:"Which model is better?", choices:[{ id:"line", t:"The line" }, { id:"curve", t:"The curve" }], answer:"curve",
            why:"The curve leaves no residuals at all, and the line’s residuals smile.",
            wrong:`The line’s residuals smile: +2, −1, −2, −1, +2. ${M2}` },
          { id:"s1b", goal:[2, 6], label:"Why?", choices:[{ id:"pat", t:"The residual pattern disappears" }, { id:"r2", t:`The line’s ${r2} is too low` }, { id:"cx", t:"A curve is always better than a line" }, { id:"or", t:"It passes through (0, 0)" }], answer:"pat",
            why:"The residual pattern disappears: the curve has captured the shape the line missed.",
            wrongs:{ r2:`${r2} = 0.963 is high. ${M2}`, cx:"Not always: for data A7, the residuals were random and a line was the right model.", or:`At ${x} = 0 the curve gives 1, not 0. Look at the residuals instead.` } }],
        data:`Braking distance grows with the <strong>square</strong> of speed: double the speed and the distance roughly quadruples. That’s why a curve opening up fits and a line can’t, however high ${r2} is.` },
      { id:"s2", title:"Savings growing (curved, slowly)",
        text:"Model data: an account balance over 10 years, starting at $1000 and growing by 13% each year.",
        items:[
          { id:"s2a", goal:[1, 4], label:"Use the line to predict the balance in year 15: $", answer:4336, tol:30,
            why:"Line: 235.3(15) + 806.5 ≈ $4336.",
            wrong:[{ match:6254, fb:"That’s the growth model’s value. Use the line." }, { match:3395, fb:"That’s the balance in year 10. Substitute 15 into the line." }] }],
        data:`A fixed percentage each year multiplies the balance by 1.13 every year, so it curves upward. The line has ${r2} = 0.97, but the U in its residuals warned that it under-predicts late years.` },
      { id:"s3", title:"An unusual point",
        text:"The kiosk data (daily high °C vs iced drinks sold) plus a 45 °C day with only 60 drinks sold.",
        items:[
          { id:"s3a", goal:5, label:"What should you do about the 45 °C day?", choices:[{ id:"rm", t:"Remove it" }, { id:"both", t:"Keep it and report both" }, { id:"inv", t:"Investigate why" }], answer:"inv",
            why:"Investigate first: the kiosk ran out of cups that day (model note). Report the fit with and without it.",
            wrongs:{ rm:M6, both:"Reporting both fits is part of it, but investigate first: the point may be an error, or the most important data point." } }],
        data:"The kiosk’s log (model note) shows it ran out of cups at noon on the 45 °C day, so sales stopped. That explains the point; it doesn’t make it vanish. Report the fit with it (slope 0.86) and without it (slope 2.0), and say why." }
    ],
    quickCheck:{
      title:"Is linear right? quick check", summary:"Is linear right? quick check",
      items:[
        { id:"q1", goal:2, prompt:`Residuals: +3, −1, −3, −1, +2 against increasing ${x}. Pattern?`,
          choices:[
            { t:"U-shape", ok:true, fb:"Right. Positive at the ends, negative in the middle." },
            { t:"Random", fb:"Positive at the ends, negative in the middle." },
            { t:"Fan", fb:"Positive at the ends, negative in the middle." },
            { t:"Outlier", fb:"Positive at the ends, negative in the middle." }] },
        { id:"q2", goal:3, prompt:`${r} = −0.8. What is ${r2}?`,
          choices:[
            { t:"0.64", ok:true, fb:`Right. (−0.8)² = 0.64; ${r2} is never negative.` },
            { t:"−0.64", fb:`(−0.8)² = 0.64; ${r2} is never negative.` },
            { t:"0.8", fb:`(−0.8)² = 0.64; ${r2} is never negative.` },
            { t:"1.6", fb:`(−0.8)² = 0.64; ${r2} is never negative.` }] },
        { id:"q3", goal:2, prompt:`Residuals spread wider as ${x} increases. Meaning?`,
          choices:[
            { t:`Predictions are less precise for large ${x}`, ok:true, fb:"Right. A fan means the scatter grows; the trend may still be linear." },
            { t:"The line has the wrong slope", fb:"A fan means the scatter grows; the trend may still be linear." },
            { t:`${r2} must be 1`, fb:"A fan means the scatter grows; the trend may still be linear." },
            { t:"There are no outliers", fb:"A fan means the scatter grows; the trend may still be linear." }] },
        { id:"q4", goal:5, prompt:"Which point is most likely to be influential?",
          choices:[
            { t:`One far from ${xb}`, ok:true, fb:`Right. Leverage comes from distance from ${xb}.` },
            { t:`One at ${xb}`, fb:`Leverage comes from distance from ${xb}.` },
            { t:"One with residual 0", fb:`Leverage comes from distance from ${xb}.` },
            { t:"One in the middle of the data", fb:`Leverage comes from distance from ${xb}.` }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"read", type:"sorter", title:"Read the residuals", summary:"Read the residuals", goal:[2, 4], noun:"residual plot",
        instruction:"Each tile is a residual plot (residual against increasing <i>x</i>). Tap a plot, then tap the box that describes it.",
        boxes:Object.keys(BOX).map(k => ({ id:k, label:BOX[k] })),
        items:SORT.map((s, i) => ({ id:"i" + (i + 1), t:resSVG(s[0], aria(s[0])), answer:s[1], why:s[2],
          hints:["Read the signs left to right.", "Is there a bend, a widening, or a single stand-out?", BOX[s[1]] + ". " + s[2]],
          wrong:i === 1 ? { fit:"Small isn’t the test: positive at both ends, negative in the middle is a curve." } : i === 3 ? { curve:"No bend: the residuals alternate but get bigger." } : {} })),
        wrongDefault:"Look at the pattern, not the size." },
      { id:"reason", type:"custom", title:"Residual reasoning", summary:"Residual reasoning", goal:[1, 3, 5], star:true,
        instruction:"Work out each value. Items marked ★ are non-routine; the last two go beyond the Final Check.",
        how:"Type a number such as 30, −1.5 or 0.91, choose where asked, then press Check.",
        items:[
          { id:"r1", goal:1, prompt:`${yh} = 20${x} + 270 (rent $ vs m²). An 80 m² apartment rents for $1900. Residual?`, answer:30, display:"+$30", label:"Residual: $",
            why:"Predicted 20(80) + 270 = $1870; residual = observed − predicted = 1900 − 1870 = +30.",
            wrong:[{ match:-30, fb:M1 + " Observed − predicted = 1900 − 1870." }],
            hints:["Find the predicted rent first.", "20(80) + 270 = 1870.", "1900 − 1870 = 30."] },
          { id:"r2", goal:3, prompt:`${r} = 0.6. What percentage of the variation in ${y} does the line explain?`, answer:36, display:"36%", label:"Percentage:", unit:"%",
            why:`${r2} = 0.6 × 0.6 = 0.36, so the line explains 36% of the variation.`,
            wrong:[{ match:60, fb:M3 + " Square it: 0.36." }, { match:0.36, fb:"0.36 is right as a proportion. Write it as a percentage." }, { match:1.2, fb:M3 }],
            hints:[`${r2} = ${r} × ${r}.`, "0.6 × 0.6 = 0.36.", "36%."] },
          { id:"r3", goal:3, prompt:"Residuals 2, −1, −2, −1, 2. SSR?", answer:14, display:"SSR = 14", label:"SSR =",
            why:"4 + 1 + 4 + 1 + 4 = 14.",
            wrong:[{ match:0, fb:"Square before adding." }],
            hints:["SSR is the sum of the squared residuals.", "2² = 4 and (−1)² = 1.", "4 + 1 + 4 + 1 + 4 = 14."] },
          { id:"r4", goal:3, star:true, prompt:`SSR = 36 and Σ(${y} − ${yb})² = 400. ${r2}?`, answer:0.91, display:`${r2} = 0.91`, label:`${r2} =`,
            why:`${r2} = 1 − 36 ÷ 400 = 1 − 0.09 = 0.91.`,
            wrong:[{ match:0.09, fb:`${r2} = 1 − 36 ÷ 400.` }],
            hints:["SSR is the unexplained variation; Σ(<i>y</i> − <i>ȳ</i>)² is the total.", "36 ÷ 400 = 0.09 is the unexplained share.",
              `${r2} = 1 − 0.09 = 0.91. <strong>Investigate:</strong> A lab measured SSR on new data with a different ${yb}. Why must you recompute Σ(${y} − ${yb})² before comparing ${r2}?`] },
          { id:"r5", goal:1, star:true, prompt:"Four of five least-squares residuals are −2, 3, 1, −4. What is the fifth?", answer:2, display:"2", label:"Fifth residual:",
            why:"Least-squares residuals add to 0: −2 + 3 + 1 − 4 = −2, so the fifth is +2.",
            wrong:[{ match:-2, fb:"Least-squares residuals add to 0. The four add to −2, so the fifth must cancel that." }],
            general:"Least-squares residuals add to 0.",
            hints:["What do least-squares residuals add to?", "−2 + 3 + 1 − 4 = −2.", "The fifth is +2."] },
          { id:"r6", goal:5, star:true, prompt:`For ${x} = 2, 3, 4, 5, 6, 7, 8 (${xb} = 5), a line leaves residuals +6 at ${x} = 2, −6 at ${x} = 8 and 0 elsewhere. Enter Σ(${x} − ${xb}) × residual. Is it the least-squares line?`,
            answer:-36, display:"−36; no", label:`Σ(${x} − ${xb}) × residual =`, pickLabel:"Least-squares line?",
            pick:[{ t:"No", ok:true }, { t:"Yes", why:"Least squares needs Σ(<i>x</i> − <i>x̄</i>) × residual = 0, and −36 ≠ 0." }],
            why:`Least squares needs Σ(${x} − ${xb}) × residual = 0: (−3)(6) + (3)(−6) = −36. So it isn’t the least-squares line.`,
            general:`Least squares needs Σ(${x} − ${xb}) × residual = 0: (−3)(6) + (3)(−6) = −36.`,
            hints:[`Least squares needs two balances: residuals sum to 0, and Σ(${x} − ${xb}) × residual = 0.`, "(2 − 5)(6) = −18 and (8 − 5)(−6) = −18.", "−36 ≠ 0, so the line could be tilted to fit better."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Moses", goal:[1, 4],
        instruction:"Moses made one mistake in each analysis. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Is a line a good model for the braking data?",
            steps:[`The least-squares line is ${yh} = 0.6${x} − 6.`, `${r} = 0.981, so ${r2} = 0.963.`, `Since ${r2} is above 0.9, the linear model is the right model.`, "So predict 54 m at 100 km/h."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"Check the residual plot first: +2, −1, −2, −1, +2 is a U, so the data curve and a line is the wrong shape.", ok:true, why:"A U in the residuals means the data curve, whatever the size of <i>r</i>²." },
              { t:`Use ${r} instead of ${r2}.`, why:"That doesn’t check the shape." },
              { t:`${r2} must be above 0.99.`, why:`No ${r2} cutoff proves the shape.` },
              { t:"Step 3 is correct.", why:`High ${r2} ≠ right model. ${M2}` }],
            hints:[`What does ${r2} measure?`, "Variation explained, not shape.", "Look at the residual plot."] },
          { id:"e2", goal:1, task:`${yh} = 20${x} + 270 for rent. A 60 m² apartment rents for $1350. Is it a bargain?`,
            steps:["Predicted rent = 20(60) + 270 = $1470.", "Residual = 1470 − 1350 = +120.", "A positive residual means it costs more than predicted, so it’s not a bargain."],
            answer:1,
            stepFb:["Correct.", "", "Step 3 reads step 2’s sign. The mistake is earlier."],
            fixes:[
              { t:"Residual = observed − predicted = 1350 − 1470 = −120: it rents for $120 less than predicted, a relative bargain.", ok:true, why:"Observed comes first, so the residual is negative: below the line." },
              { t:"Residual = 1350 ÷ 1470.", why:"Residuals are differences." },
              { t:"Residual = 60 − 1350.", why:`Use ${y}-values only.` },
              { t:"Step 2 is correct.", why:"The order is observed − predicted. " + M1 }],
            hints:["Which comes first?", "Observed.", "−120."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:`In the inspector, which surprised you more: the high ${r2} on curved data, or the influential point that hid its residual?` },
      { id:"j2", q:`In your own words, why is the residual plot a better test of ‘is a line right?’ than ${r2}?` },
      { id:"j3", q:"Explain to a friend the difference between an outlier and an influential point, with a sketch in words." },
      { id:"j4", q:"Which pattern (U, fan, unusual point) do you still find hardest to recognize? How will you practise it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:`A point has observed ${y} = 52 and predicted ${y} = 50. Its residual is…`, options:[
          { t:"+2", ok:true, why:"52 − 50." },
          { t:"−2", why:M1 },
          { t:"102", why:"Subtract; don’t add." },
          { t:"1.04", why:"Residuals are differences, not ratios." }] },
        b:{ prompt:`A point has observed ${y} = 66 and predicted ${y} = 70. Its residual is…`, options:[
          { t:"−4", ok:true, why:"66 − 70." },
          { t:"+4", why:M1 },
          { t:"136", why:"Subtract." },
          { t:"0.94", why:"Residuals are differences." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:`${r} = 0.9. Which statement about ${r2} is correct?`, options:[
          { t:`${r2} = 0.81: 81% of the variation in ${y} is explained by the line`, ok:true, why:"0.9 × 0.9 = 0.81, a proportion of variation." },
          { t:`${r2} = 0.9: 90% of points lie on the line`, why:M3 },
          { t:`${r2} = 1.8`, why:M3 },
          { t:`${r2} = 0.81: 81% of the points are within 1 unit of the line`, why:`${r2} is about variation, not counts of points.` }] },
        b:{ prompt:`${r} = −0.7. Which statement about ${r2} is correct?`, options:[
          { t:`${r2} = 0.49: 49% of the variation in ${y} is explained by the line`, ok:true, why:"(−0.7)² = 0.49." },
          { t:`${r2} = −0.49`, why:"Squares aren’t negative." },
          { t:`${r2} = 0.7: 70% explained`, why:M3 },
          { t:`${r2} = 1.4`, why:M3 }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"Which residual plot shows that a linear model is appropriate?", options:[
          { t:"Random scatter around 0 with no pattern", ok:true, why:"No pattern means the line has captured the trend." },
          { t:"A U-shape", why:"That’s a curve. " + M4 },
          { t:"Residuals growing steadily from negative to positive", why:"That’s a missed trend: the line has the wrong slope." },
          { t:"All residuals positive", why:"Least-squares residuals add to 0, so that can’t happen." }] },
        b:{ prompt:"A residual plot is ∩-shaped (negative, positive, positive, negative). What does it mean?", options:[
          { t:"The relationship curves; a line over-predicts at the ends and under-predicts in the middle", ok:true, why:"Negative residuals at the ends mean the line is too high there." },
          { t:"The line fits well", why:M4 },
          { t:"The spread grows", why:"That’s a fan." },
          { t:"There’s one outlier", why:"The whole set bends." }] } },
      { id:"t1", cat:"T", goal:[1, 5],
        a:{ prompt:`Model line ${yh} = 2${x} + 10. Points: (15, 38), (20, 52), (25, 62), (30, 75), (35, 80). Which point fits worst?`, options:[
          { t:"(30, 75), residual +5", ok:true, why:"Residuals −2, 2, 2, 5, 0." },
          { t:"(15, 38), residual +2", why:"38 − 40 = −2, and 5 is larger in size." },
          { t:"(35, 80), residual 0", why:"It’s on the line." },
          { t:"(25, 62), residual +2", why:"+5 is larger." }] },
        b:{ prompt:`Model line ${yh} = −13${x} + 378. Points: (4, 330), (5, 312), (6, 300), (7, 276), (8, 282). Which point fits worst?`, options:[
          { t:"(7, 276), residual −11", ok:true, why:"Residuals 4, −1, 0, −11, 8." },
          { t:"(8, 282), residual +8", why:"−11 is larger in size." },
          { t:"(4, 330), residual −4", why:"330 − 326 = +4." },
          { t:"(6, 300), residual 0", why:"It’s on the line." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:`A linear model has ${r2} = 0.96, and its residual plot is U-shaped. What is the best conclusion?`, options:[
          { t:`The relationship is curved; a curve would model it better, even though ${r2} is high`, ok:true, why:"The U shows the line is the wrong shape." },
          { t:`The line is excellent, because ${r2} > 0.9`, why:M2 },
          { t:"The data have no relationship", why:`${r2} = 0.96 shows a strong relationship.` },
          { t:"Remove the end points to fix it", why:M6 }] },
        b:{ prompt:`A linear model has ${r2} = 0.45, and its residual plot shows random scatter. What is the best conclusion?`, options:[
          { t:"A line is the right shape, but the relationship is moderate, so predictions will be imprecise", ok:true, why:"Random residuals: right shape. Moderate <i>r</i>²: lots of scatter." },
          { t:"A curve would fit better", why:"No pattern means no curve. " + M4 },
          { t:"The line is useless", why:"It explains 45% of the variation." },
          { t:`${r2} must be wrong`, why:`Random residuals and a moderate ${r2} go together.` }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:`Kiosk data: without a 45 °C day, slope 2.0 and ${r} = 0.99. With it: slope 0.86 and ${r} = 0.65. What best describes the 45 °C point?`, options:[
          { t:`Influential: being far from ${xb}, it pulls the line and changes the slope a lot`, ok:true, why:"The slope fell from 2.0 to 0.86: that’s influence." },
          { t:"Not influential, because its own residual is small", why:M5 },
          { t:"An error that must be deleted", why:M6 },
          { t:`It has no effect on ${r}`, why:`${r} dropped from 0.99 to 0.65.` }] },
        b:{ prompt:`Kiosk data: a point at (25, 75) is added. Before: slope 2, intercept 10, ${r} = 0.99. After: slope 2, intercept 12.5, ${r} = 0.91. What best describes the point?`, options:[
          { t:`An outlier in ${y} at ${xb}: it raises the line and lowers ${r}, but can’t tilt it`, ok:true, why:`${x} = 25 is ${xb}, so the slope stays 2.` },
          { t:"Influential, because it changed the slope", why:"The slope stayed 2." },
          { t:"Not an outlier, since the slope didn’t change", why:M5 },
          { t:"It doubled the intercept", why:"10 → 12.5." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"A rent model gives a 60 m² apartment a residual of −$120. Which statement is correct?", options:[
          { t:"“It rents for $120 less than the model predicts for its size.”", ok:true, why:"A negative residual means observed < predicted." },
          { t:"“It rents for $120 more than predicted.”", why:M1 },
          { t:"“The model is wrong by 120 m².”", why:"The units are dollars." },
          { t:"“It should be removed from the data.”", why:M6 }] },
        b:{ prompt:"A rent model gives a 70 m² apartment a residual of +$30. Which statement is correct?", options:[
          { t:"“It rents for $30 more than the model predicts for its size.”", ok:true, why:"A positive residual means observed > predicted." },
          { t:"“It rents for $30 less than predicted.”", why:M1 },
          { t:"“It’s 30 m² larger than predicted.”", why:"The units are dollars." },
          { t:"“The model fits this apartment perfectly.”", why:"Off by $30." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which is the strongest evidence that a linear model fits a data set well?", options:[
          { t:`“${r2} is high and the residual plot shows random scatter.”`, ok:true, why:"Strength and shape, both checked." },
          { t:`“${r2} = 0.97.”`, why:M2 },
          { t:`“The line passes through (${xb}, ${yb}).”`, why:"Every least-squares line does." },
          { t:"“The residuals add to 0.”", why:"Every least-squares line does that too." }] },
        b:{ prompt:"Which display best shows whether a straight line is the right model?", options:[
          { t:"A residual plot", ok:true, why:"It shows any pattern the line missed." },
          { t:`A histogram of ${y}`, why:`That ignores ${x}.` },
          { t:`A table of ${r} and ${r2}`, why:M2 },
          { t:`A box plot of ${x}`, why:"It shows one variable only." }] } },
      { id:"a1", cat:"A", goal:1,
        a:{ prompt:`Rent ($) vs size (m²): ${yh} = 20${x} + 270. A 60 m² unit rents for $1350. How does it compare with the model?`, options:[
          { t:"$120 cheaper than predicted", ok:true, why:"Predicted $1470; residual −$120." },
          { t:"$120 more expensive than predicted", why:M1 },
          { t:"$1080 cheaper", why:"Compare with the predicted $1470, not with 270." },
          { t:"Exactly as predicted", why:"1470 ≠ 1350." }] },
        b:{ prompt:"Same model. A 70 m² unit rents for $1700. How does it compare?", options:[
          { t:"$30 more expensive than predicted", ok:true, why:"Predicted $1670." },
          { t:"$30 cheaper", why:M1 },
          { t:"$330 more", why:"20(70) + 270 = 1670." },
          { t:"Exactly as predicted", why:"1700 ≠ 1670." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:`Two models for the same data. Model P: SSR = 40, ${r2} = 0.82, residuals U-shaped. Model Q: SSR = 16, ${r2} = 0.93, residuals random. Which should be used?`, options:[
          { t:"Q: smaller SSR and no residual pattern", ok:true, why:"Q leaves less unexplained and has no pattern left." },
          { t:"P: its residuals show a pattern, so it’s more interesting", why:"A pattern means the model missed something." },
          { t:`Either: both ${r2} are above 0.8`, why:M7 },
          { t:`Neither: remove points until ${r2} = 1`, why:M6 }] },
        b:{ prompt:`World population vs year since 1900 fits a line with ${r2} = 0.93, but the residual plot is a U. What is the best conclusion?`, options:[
          { t:"Growth isn’t linear; a curved model would fit better, and the line will under-predict recent years", ok:true, why:"Positive residuals at the right end mean the line is too low there." },
          { t:`The line is excellent: ${r2} = 0.93`, why:M2 + " " + M7 },
          { t:"Population isn’t related to year", why:`${r2} is high.` },
          { t:"Remove the recent years", why:M6 }] } }
    ]
  },
  task:{
    title:"Hidden curve", summary:"Hidden curve",
    statement:`<p>Build braking-style data that fools ${r2}: the line fits ‘well’ by ${r2}, but the residuals reveal a curve. Choose ${y} for ${x} = 1, 2, 3, 4, 5 (speed in tens of km/h). Can you find all the answers? <span class="mdm-model">model data</span></p>` +
      `<ol class="rs-conds"><li>The least-squares line is exactly ${yh} = 6${x} − 6.</li><li>The residual plot is U-shaped: positive at ${x} = 1 and 5, negative at ${x} = 2, 3 and 4.</li><li>Every residual is between −3 and 3.</li><li>${r2} is at least 0.9.</li></ol>`,
    checks:[`Line is ${yh} = 6${x} − 6`, "U-shaped residuals", "Residuals between −3 and 3", `${r2} at least 0.9`],
    tips:["The line’s own values are 0, 6, 12, 18, 24. Add a residual to each.",
      `For the line to stay put, the residuals must add to 0 and balance left vs right: −2${e}₁ − ${e}₂ + ${e}₄ + 2${e}₅ = 0.`,
      "A U: push the ends up and the middle down.",
      `Keep the residuals small so ${r2} stays high.`],
    explainPrompt:`Explain why your data have a high ${r2} but a linear model is still the wrong choice.`,
    vocab:`Use the words residual, residual plot, ${r2} and curve.`,
    more:"There’s more than one answer. Can you find them all?",
    after3:`Each one has ${r2} above 0.9, yet its residuals smile. That’s why you always check the residual plot.`,
    afterAt:4
  },
  cards:[
    ["Residual", `Observed ${y} − predicted ${y}. Positive: above the line.`],
    ["Sum of least-squares residuals", "Always 0."],
    ["Residual plot", `Residuals vs ${x}; the best check of whether a line is the right shape.`],
    ["Random scatter", "A linear model is appropriate."],
    ["U or ∩ shape", "The relationship is curved."],
    ["Fan shape", "The spread grows; predictions are less precise where it’s wide."],
    [r2, `The proportion of variation in ${y} explained by the line; ${r2} = ${r} × ${r}.`],
    [`${r2} = 1 − SSR ÷ Σ(${y} − ${yb})²`, "Unexplained over total, subtracted from 1."],
    [`High ${r2} trap`, `Curved data can have ${r2} > 0.95; check the residuals.`],
    ["Outlier", "A point with an unusually large residual."],
    ["Influential point", `A point far from ${xb} that changes the line a lot when included; its own residual may look small.`],
    [`Outlier at ${xb}`, `Changes the intercept and ${r}, not the slope.`]
  ]
};
