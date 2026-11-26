// MHF4U 49 Modelling with Combined Functions. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/49-modelling-with-combined-functions.md
const fig = (key, aria, cls) => '<canvas class="plot' + (cls ? " " + cls : "") + '" data-fig="' + key + '" role="img" aria-label="' + aria + '"></canvas>';

// ---------- Practice 1: generated mismatch feedback (first feature that differs; the plan's written-out pairs override) ----------
const MODEL_IS = {
  e1:"E1 levels off at 22: a level plus a shrinking part.",
  e2:"E2 heads toward 0: a decay on its own, with no level and no swings.",
  e3:"E3 levels off at 22: a level plus a shrinking part.",
  e4:"E4’s swings fade: a wave multiplied by a shrinking envelope.",
  e5:"E5’s swings grow: a wave multiplied by a growing envelope, `(t + 4)`.",
  e6:"E6 swings the same 4 above and below forever: a wave on its own.",
  e7:"E7 is a rising trend plus a yearly wave.",
  e8:"E8 is a rising trend plus a yearly wave."
};
const NEEDS = {
  s1:"This soup cools toward the kitchen’s 22&nbsp;°C, so its model needs the constant 22 plus a shrinking part.",
  s2:"Nothing holds a medicine at a level: the whole amount halves toward 0.",
  s3:"This soup cools toward the kitchen’s 22&nbsp;°C, so its model needs the constant 22 plus a shrinking part.",
  s4:"The string’s swings halve every 8 ms, so the wave is multiplied by a shrinking envelope.",
  s5:"The swing’s swings grow 1 cm every second, so the wave is multiplied by a growing envelope.",
  s6:"The buoy’s waves are steady: the same 4 cm every time.",
  s7:"These visitors grow steadily, with the same yearly swing on top: a trend plus a wave.",
  s8:"These visitors grow steadily, with the same yearly swing on top: a trend plus a wave."
};
const WRITTEN = {
  "s1|e2":"E2 heads toward 0. The soup can only cool to the kitchen’s 22&nbsp;°C, so its model needs the constant 22 plus a shrinking part.",
  "s4|e6":"E6’s swings never fade. The string’s swings halve every 8 ms, so the wave is multiplied by `4(1/2)^{t/8}`.",
  "s4|e5":"E5’s swings grow, `(t + 4)` gets bigger. The string’s swings fade.",
  "s6|e4":"E4’s swings fade. The buoy’s waves are steady: the same 4 cm every time.",
  "s2|e1":"E1 starts at 22 + 64 = 86 too, but it levels off at 22. Nothing keeps a medicine at 22 mg: the amount heads toward 0.",
  "s1|e3":"E3’s difference halves every 4 min: `(1/2)^{t/4}`. This soup’s halves every 8 min.",
  "s3|e1":"E1’s difference halves every 8 min: `(1/2)^{t/8}`. This soup’s halves every 4 min.",
  "s7|e8":"E8 is busiest when `π/6 t = 0`, at `t = 0`: January. This park is busiest in July, so the wave needs `(t - 6)`.",
  "s8|e7":"E7 is busiest when `π/6 (t - 6) = 0`, at `t = 6`: July. This ski hill is busiest in January, so the wave needs no shift: `cos(π/6 t)`."
};
function matchWrong(){
  const w = {};
  for (let i = 1; i <= 8; i++) for (let j = 1; j <= 8; j++) {
    if (i === j) continue;
    const k = "s" + i + "|e" + j;
    w[k] = WRITTEN[k] || (MODEL_IS["e" + j] + " " + NEEDS["s" + i]);
  }
  return w;
}

export default {
  id:"49-modelling-with-combined-functions",
  kind:"topic",
  title:"Modelling with combined functions",
  topic:"Modelling with Combined Functions",
  readyTopic:"modelling with combined functions",
  hero:{
    eq:'<span class="ml-heq"><span class="ml-hp">`P(t) =`</span> <span class="ml-hp">`0.5t + 20`<small>trend</small></span> <span class="ml-hp">`+`</span> <span class="ml-hp">`@a{5} cos[@k{{π}/{6}} (t - @d{6})]`<small>yearly wave</small></span></span>',
    eqLabel:"P of t equals 0.5 t plus 20, the trend, plus 5 cos of pi over 6 times t minus 6, the yearly wave",
    eqSize:"sm",
    headline:"Real data rarely follows one function. Combine two, then check what’s left.",
    text:"A lake ferry carries more passengers every year as a town grows, and more every summer as tourists arrive. No single function does both. A <strong>combined model</strong> does: a linear <strong>trend</strong> plus a sinusoidal <strong>wave</strong>. Other situations need a product, such as a wave inside a shrinking <strong>envelope</strong>, or a level plus a decaying exponential. You’ll judge each model by its <strong>leftovers</strong>, the gaps between the data and the model, and you’ll solve equations that algebra can’t by finding where graphs cross.",
    fig:{ aria:"Ferry passengers each month for three years. A rising trend line runs through the readings; the readings minus the trend form a wave; trend plus wave fits the readings closely." }
  },
  goals:[
    "I can choose a type of function for a situation or a data set from its features: steady differences, steady second differences, steady ratios, a repeating cycle or a level it settles toward.",
    "I can build a model by combining functions (adding a trend and a wave, adding a level and a decay, multiplying a wave by an envelope, or putting one function inside another) and explain what each part means in the situation.",
    "I can judge a model by its leftovers (data − model) and use the pattern in the leftovers to decide what to add or change.",
    "I can solve equations and inequalities that algebra can’t, by finding where two graphs cross and narrowing each crossing down with a table of values.",
    "I can use a combined model to answer questions in context and say where the model stops making sense."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Function types", goal:1,
          prompt:"Which table shows an exponential function? Each table lists `y` for `x = 0, 1, 2, 3`.",
          options:[
            { t:"2, 6, 10, 14", why:"The first differences are all 4, so this is linear. Exponential tables have a steady <strong>ratio</strong>." },
            { t:"2, 6, 18, 54", ok:true, why:"Each value is 3 times the one before: 6/2 = 18/6 = 54/18 = 3. A steady ratio means exponential: `y = 2(3)^x`." },
            { t:"2, 3, 6, 11", why:"The first differences are 1, 3, 5 and the second differences are 2, 2: steady second differences mean quadratic. The ratios 3/2, 6/3, 11/6 aren’t equal." },
            { t:"2, 6, 2, 6", why:"The values go up and back down again: that’s a repeating pattern, not growth. The ratios are 3, 1/3, 3." }],
          hints:["Exponential means the same <strong>ratio</strong> from each value to the next.", "Divide each value by the one before it. Which table gives the same answer every time?", "2, 6, 18, 54: the ratio is 3 every time. That table is exponential."] },
        { id:"w2", skill:"Function types", goal:1,
          prompt:"Which function’s graph has the horizontal asymptote `y = 20`?",
          options:[
            { t:"`y = 20x + 60`", why:"A line with slope 20 keeps rising; it never levels off." },
            { t:"`y = 20 + 60(1/2)^x`", ok:true, why:"As `x` grows, `60(1/2)^x` shrinks toward 0, so `y` gets closer and closer to 20 without reaching it." },
            { t:"`y = 60(1/2)^x`", why:"`60(1/2)^x` shrinks toward 0. Its asymptote is `y = 0`." },
            { t:"`y = 20 + 60 sin x`", why:"This keeps swinging between −40 and 80 forever. `y = 20` is its axis, not a level it settles toward." }],
          hints:["A horizontal asymptote is a level the graph settles toward as `x` grows.", "Which part of each function shrinks to 0 as `x` grows? What’s left over?", "In `20 + 60(1/2)^x` the exponential part shrinks to 0 and leaves 20. The asymptote is `y = 20`."] },
        { id:"w3", skill:"Combining functions", goal:2,
          prompt:"`f(x) = 3x + 2` and `g(x) = x^2`. What is `(f + g)(2)`?",
          options:[
            { t:"12", ok:true, why:"`(f + g)(2) = f(2) + g(2) = 8 + 4 = 12`." },
            { t:"14", why:"14 is `f(g(2)) = f(4) = 14`. `(f + g)(2)` adds the two values at `x = 2`." },
            { t:"32", why:"32 is `f(2) · g(2) = 8 × 4`, the product `(f · g)(2)`." },
            { t:"64", why:"64 is `g(f(2)) = g(8)`. The sum just adds `f(2)` and `g(2)`." }],
          hints:["`(f + g)(2)` means `f(2) + g(2)`.", "`f(2) = 3(2) + 2 = 8` and `g(2) = 2^2 = 4`.", "8 + 4 = 12."] },
        { id:"w4", skill:"Combining functions", goal:2,
          prompt:"`f(t) = 10(1/2)^t` and `g(t) = cos(πt)`. What is `(f · g)(3)`?",
          options:[
            { t:"−1.25", ok:true, why:"`f(3) = 10/8 = 1.25` and `g(3) = cos(3π) = -1`, so the product is −1.25." },
            { t:"0.25", why:"0.25 is 1.25 + (−1), the sum. The product multiplies the two values." },
            { t:"1.25", why:"`cos(3π) = -1`, so the wave flips the value to the other side: −1.25." },
            { t:"20", why:"20 is `f(g(3)) = f(-1) = 10(1/2)^{-1}`. The product multiplies `f(3)` by `g(3)`." }],
          hints:["`(f · g)(3)` means `f(3) × g(3)`.", "`f(3) = 10(1/2)^3 = 10/8`. For `g(3)`, where is 3π on the unit circle?", "`f(3) = 1.25` and `cos(3π) = cos π = -1`, so the product is −1.25."] },
        { id:"w5", skill:"Sinusoid features", goal:2, fixedOrder:true,
          prompt:"What is the period of `y = 5 cos[π/6 (t - 6)] + 20`?",
          options:[
            { t:"`π/6`", why:"π/6 is `k`. The period is 2π ÷ `k`." },
            { t:"5", why:"5 is the amplitude: the wave goes 5 above and below its axis." },
            { t:"12", ok:true, why:"Period = 2π ÷ (π/6) = 12." },
            { t:"20", why:"20 is the axis, `y = 20`." }],
          hints:["Period = `2π/k`. Which number is `k`?", "`k = π/6`, the number multiplying `(t - 6)`.", "2π ÷ (π/6) = 2π × 6/π = 12."] },
        { id:"w6", skill:"Exponential decay", goal:5, fixedOrder:true,
          prompt:"A drink is 48&nbsp;°C above room temperature, and that difference halves every 10 min. How far above room temperature is it after 30 min?",
          options:[
            { t:"6&nbsp;°C", ok:true, why:"30 min is 3 halvings: 48 → 24 → 12 → 6." },
            { t:"16&nbsp;°C", why:"48 ÷ 3 = 16 divides by 3. Three halvings divide by 2 × 2 × 2 = 8." },
            { t:"18&nbsp;°C", why:"48 − 30 = 18 takes off 10&nbsp;°C every 10 min. Halving takes half of <strong>what’s left</strong> each time." },
            { t:"24&nbsp;°C", why:"24 is one halving, after 10 min. In 30 min there are three." }],
          hints:["How many 10-minute halvings fit in 30 min?", "Three. Halve 48 three times.", "48 → 24 → 12 → 6. The drink is 6&nbsp;°C above room temperature."] }
      ],
      refreshers:{
        "Function types":"Test a table before you name its type. Equal steps in `x`, then: steady first differences mean linear; steady second differences mean quadratic; a steady ratio from each value to the next means exponential; values that repeat in a cycle mean sinusoidal. Example: 2, 6, 18, 54 has ratio 3 each time, so it’s exponential. A graph that settles toward a level, like `20 + 60(1/2)^x`, has a horizontal asymptote at that level.",
        "Combining functions":"`(f + g)(x) = f(x) + g(x)`; `(f · g)(x) = f(x) · g(x)`; `f(g(x))` puts `g`’s output into `f`. Always find each function’s value at the <strong>same</strong> `x` first. Example: `f(x) = 3x + 2` and `g(x) = x^2` at `x = 2`: sum 8 + 4 = 12, product 8 × 4 = 32, `f(g(2)) = f(4) = 14`.",
        "Sinusoid features":"In `y = a cos[k(t - d)] + c`: the amplitude is `|a|`, the period is `2π/|k|`, a maximum is at `t = d` (when `a > 0`), and the axis is `y = c`. Example: `5 cos[π/6 (t - 6)] + 20` has amplitude 5, period 12, a peak at `t = 6` and axis `y = 20`.",
        "Exponential decay":"“Halves every `h` minutes” means `A(1/2)^{t/h}`: after each `h` minutes, half of what’s left remains. Count the halvings, then divide by 2 that many times. Example: 48&nbsp;°C halving every 10 min, after 30 min: 48 → 24 → 12 → 6&nbsp;°C."
      }
    }
  },
  explore:{
    heading:"Model lab",
    intro:"Pick a data set. Choose the kind of function for each part, add or multiply them, and tune the sliders until the gaps shrink. Then look at what’s left over: the leftovers tell you what your model is still missing.",
    data:{
      tea:{ name:"Tea", letter:"T", unit:"°C", what:"temperature (°C)", tUnit:"min", tOne:"minute", t0:0, dt:5,
        story:"A mug of tea cools on a desk in a 20&nbsp;°C room. Its temperature is read every 5 minutes for an hour.",
        y:[84.0, 65.5, 51.8, 42.7, 36.0, 31.2, 28.2, 25.5, 24.1, 22.8, 22.1, 21.3, 21.0] },
      ferry:{ name:"Ferry", letter:"P", unit:"thousand", what:"passengers per month (thousands)", tUnit:"months", tOne:"month", t0:0, dt:1,
        story:"A lake ferry’s passengers each month, in thousands, from January of year 1 (`t = 0`) to December of year 3 (`t = 35`). A town on the far shore keeps growing, and summer brings tourists.",
        y:[15.2, 15.9, 18.6, 21.8, 24.3, 26.8, 28.1, 27.7, 26.2, 24.6, 22.5, 21.0, 20.9, 22.5, 24.3, 27.5, 30.7, 32.7, 34.3, 33.6, 32.6, 30.2, 28.7, 27.2, 27.1, 28.0, 30.5, 33.7, 36.2, 38.9, 40.2, 39.6, 38.5, 36.4, 34.7, 33.1] },
      spring:{ name:"Spring", letter:"y", unit:"cm", what:"position above rest (cm)", tUnit:"s", tOne:"second", t0:0, dt:0.5,
        story:"A weight hangs on a long spring in a physics lab, with a paddle in a tub of water to slow it. It’s lifted 24 cm and let go at `t = 0`. Its position (cm above its resting position) is read every 0.5 s.",
        y:[24.0, 14.4, -0.1, -10.0, -12.0, -7.2, 0.1, 5.0, 5.9, 3.7, 0.0, -2.6, -2.9, -1.8, -0.1, 1.4, 1.5] },
      swing:{ name:"Swing", letter:"y", unit:"cm", what:"distance from the lowest point (cm)", tUnit:"s", tOne:"second", t0:0, dt:0.5,
        story:"A parent pushes a swing a little harder each time it comes back. Its distance from the lowest point (cm, + toward the parent) is read every 0.5 s.",
        y:[6.0, 5.5, -0.1, -7.2, -11.9, -9.7, 0.0, 11.8, 17.9, 14.0, 0.0, -16.1, -23.9, -18.1, 0.2, 20.2, 30.1] }
    },
    idealised:"Idealised data, made up for this lab.",
    locked:"Unlocks at challenge 3",
    productNote:"In a product, Part 1 sets the size.",
    noneYet:"None yet: choose a part to add or multiply.",
    zeroNote:"Part 1 is 0 at `t` = {list}, so the data can’t be divided by it there.",
    fit:{ close:"Close fit: every gap is 1 or less. Now check the leftovers for a pattern.", near:"Getting close: the biggest gaps are at `t` = {t1} and `t` = {t2}.", far:"Not a good fit yet. Switch to Leftovers to see what’s missing.", hidden:"Hidden for this challenge." },
    sense:{
      teaLow:"Colder than the 20&nbsp;°C room. A drink can’t cool below its room, so the model breaks down here.",
      teaHigh:"Hotter than the tea started. Something in the model is growing.",
      teaRoom:"About room temperature: the tea has finished cooling. Sensible.",
      teaMid:"Between room temperature and the starting temperature. Sensible so far.",
      ferryNeg:"Negative passengers: impossible.",
      ferryGrow:"This assumes the town keeps adding {m} thousand passengers a month for {yrs} more years. Three years of data can’t tell you whether that’s likely.",
      ferryFlat:"This assumes passenger numbers stop growing.",
      springBig:"Bigger than the spring’s first swing of 24 cm. A damped spring’s swings can’t grow, so the model breaks down here.",
      springNoFade:"The swings never fade: a real spring with a damper comes to rest.",
      springOk:"Small and fading: sensible.",
      swing:"This assumes the parent keeps pushing harder forever. At `t = 24` s the swing would be {env} cm out."
    },
    predIntro:"Make a prediction first. Then the Model lab will show you what really happens.",
    predictions:[
      { id:"p1",
        prompt:"The trend `0.5t + 20` runs through the middle of the ferry data. If you subtract it from every reading (Leftovers, After Part 1), what will the leftover points look like?",
        options:[{ t:"A wave centred on 0 that repeats every 12 months, about 5 above and below", ok:true }, { t:"A straight line rising 0.5 per month" }, { t:"Points scattered around 0 with no pattern" }, { t:"A wave whose swings get bigger each year" }],
        explain:"The trend has taken care of the steady growth. What’s left is what the trend can’t explain: the yearly ups and downs, about 5 above and below 0, peaking every July. That’s the model’s missing second part, a wave. When the leftovers have a pattern, the model isn’t finished." },
      { id:"p2",
        prompt:"Over the three years, the trend is largest in month 35 (37.5), and the wave is largest, 5, in every July. What’s the largest value of the whole model `P(t)` for `t = 0, 1, …, 35`?",
        options:[{ t:"33.2" }, { t:"37.5" }, { t:"40", ok:true }, { t:"42.5" }],
        explain:"The trend’s largest value and the wave’s largest value happen in different months, so you can’t just add them. In December of year 3 the trend is 37.5, but the wave is near its low, so `P(35) ≈ 33.2`. In July of year 3 the wave peaks while the trend is 35: `P(30) = 40`, the most of any month. The largest value of a sum is at most the sum of the largest values, and usually less." },
      { id:"p3",
        prompt:"The envelope `24(1/2)^{t/2}` fits the shrinking swings. If you <strong>divide</strong> every reading by it (Leftovers, After Part 1), what will the leftover points look like?",
        options:[{ t:"A wave between −1 and 1 whose swings don’t shrink", ok:true }, { t:"A wave that still shrinks, but more slowly" }, { t:"A flat line at 1" }, { t:"A wave whose swings grow" }],
        explain:"Dividing by the envelope undoes the shrinking. What’s left is a plain wave between −1 and 1 that repeats every 4 s and starts at its peak: `cos(π/2 t)`. So the model is the envelope times the wave: `y(t) = 24(1/2)^{t/2} cos(π/2 t)`. Same-size swings: add. Swings that shrink or grow in proportion: multiply." },
      { id:"p4", note:"Ravi’s model is within 1.2&nbsp;°C of the first three readings.",
        prompt:"What does Ravi’s model give at `t = 60` min, where the reading is 21.0&nbsp;°C?", fixedOrder:true,
        options:[{ t:"0&nbsp;°C" }, { t:"About 5&nbsp;°C", ok:true }, { t:"20&nbsp;°C" }, { t:"21&nbsp;°C" }],
        explain:"`84(1/2)^{60/15} = 84(1/2)^4 = 84/16 = 5.25` °C. A single exponential shrinks toward 0, so it says the tea will end up colder than the room. Subtract the room temperature from the readings instead: 64.0, 31.8, 16.0, 8.2 at `t = 0, 10, 20, 30`. <strong>Those</strong> halve about every 10 min. Room temperature plus a shrinking exponential is the model to try." }
    ],
    chalIntro:"Set the lab, then press <strong>Check challenge</strong>. Each challenge has three levels of help, and a button that loads its starting state.",
    challenges:[
      { id:"tc1", goal:[2, 3, 5],
        prompt:"The room is 20&nbsp;°C. Build a model of the <strong>Tea</strong> data whose gaps are all 1&nbsp;°C or less <strong>and</strong> which levels off at the room temperature in the long run. <span class=\"ml-tcload\"><button type=\"button\" class=\"btn ghost sm\" data-tcload=\"tc1\">Load the Tea starting state</button></span>",
        why:"Room temperature plus a shrinking extra heat: the constant 20 holds the room’s level, and the exponential carries the heat above the room, which halves every 10 min.",
        hints:["What temperature does the tea end up at? That’s a constant part of the model.", "Make Part 1 Linear with `m = 0` and `b = 20`, and Part 2 an exponential that halves. In Leftovers (After Part 1), the points are the extra heat above the room.", "The extra heat is 64.0 at `t = 0` and about half that, 31.8, at `t = 10`. Set `A = 64` and `h = 10`: `T(t) = 20 + 64(1/2)^{t/10}`."] },
      { id:"tc2", goal:[2, 3],
        prompt:"Build a model of the <strong>Ferry</strong> data whose gaps are all 1 thousand passengers or less. <span class=\"ml-tcload\"><button type=\"button\" class=\"btn ghost sm\" data-tcload=\"tc2\">Load the Ferry starting state</button></span><span class=\"ml-guess\" data-guess-host=\"1\"><span class=\"tiny\">How big do you expect your largest gap to be?</span> <button type=\"button\" class=\"chip\" data-guess=\"lo\" aria-pressed=\"false\">Under 0.5</button> <button type=\"button\" class=\"chip\" data-guess=\"mid\" aria-pressed=\"false\">0.5 to 1</button> <button type=\"button\" class=\"chip\" data-guess=\"hi\" aria-pressed=\"false\">Over 1</button></span>",
        why:"A rising trend carries the town’s growth and an added wave carries the summer peaks: `P(t) = 0.5t + 20 + 5 cos[π/6 (t - 6)]`.",
        hints:["Fit the trend first, then look at what’s left.", "A line through the middle of the data starts near 20 and rises about 6 per year: `m = 0.5` per month. The leftovers then swing about 5 above and below 0 and peak every July.", "Part 1 Linear, `m = 0.5`, `b = 20`. Part 2 Wave, added, `a = 5`, `T = 12`, `d = 6`: `P(t) = 0.5t + 20 + 5 cos[π/6 (t - 6)]`."] },
      { id:"tc3", goal:[1, 2], stretch:true,
        prompt:"Use the <strong>Swing</strong> data. Build a model whose gaps are all 1 cm or less. For this challenge the gap rows and the “After the whole model” leftovers are hidden: read the peaks and reason it out. <span class=\"ml-tcload\"><button type=\"button\" class=\"btn ghost sm\" data-tcload=\"tc3\">Open challenge 3: load the Swing data</button></span>",
        why:"Linear envelope × wave. The swing’s size grows by equal steps, so the envelope is linear; the spring’s size shrank by equal ratios, so its envelope was exponential.",
        hints:["List the sizes of the peaks and troughs, and the times they happen. How do the sizes change?", "6, 12, 18, 24, 30 at `t = 0, 2, 4, 6, 8`: the same increase, 6 cm, every 2 s. That’s a linear envelope, `3t + 6`, multiplying a wave.", "Part 1 Linear, `m = 3`, `b = 6`; ×; Part 2 Wave with `T = 4` (a full swing out and back) and `d = 0`: `y(t) = (3t + 6) cos(π/2 t)`."] }
    ],
    guess:{ lo:"Under 0.5", mid:"0.5 to 1", hi:"Over 1", line:"Your prediction: {guess}. Your largest gap at the last check: {gap} thousand." },
    fb:{
      tc1:{
        set:"This challenge uses the Tea data. Choose Tea, or press the button above to load its starting state.",
        expOnly:"A single exponential heads toward 0&nbsp;°C. The tea can only cool to the room’s 20&nbsp;°C. Make Part 1 Linear with `m = 0` to hold the room temperature, and add an exponential for the extra heat.",
        drift:"Every gap is 1&nbsp;°C or less, but your trend changes by {m} °C every minute forever. In the Forecast view it predicts {v180} °C at `t = 180` min, but the tea will sit at the room’s 20&nbsp;°C. Set `m = 0`.",
        level:"Your model levels off at {b} °C. The room is 20&nbsp;°C.",
        level21:"21.0&nbsp;°C is the last reading, and the tea is still cooling then. The room is 20&nbsp;°C.",
        doubles:"Your exponential part doubles, so the model heats the tea up. The extra heat should halve.",
        close:"The structure is right. Your largest gap is {gap} °C at `t` = {at}. The readings minus 20 are 64.0, 31.8, 16.0 and 8.2 at `t = 0, 10, 20` and 30: what’s the starting extra heat, and how long does it take to halve?",
        other:"Subtract the room temperature first: set Part 1 to Linear, `m = 0`, `b = 20`, and look at Leftovers, After Part 1."
      },
      tc2:{
        set:"This challenge uses the Ferry data. Choose Ferry, or press the button above to load its starting state.",
        none:"One function can’t follow both the growth and the summer peaks. Fit the trend, then look at Leftovers: what’s left?",
        period:"Your wave repeats every {T} months. In the data, one summer peak to the next is 12 months.",
        peak:"Your wave peaks at `t` = {d} ({month}). The data peaks every July: `t = 6, 18` and 30.",
        amp:"Your wave swings {a} above and below the trend. The leftovers only reach about 5 above and below 0: the amplitude is half of the swing from the lowest leftover to the highest.",
        times:"Multiplying a wave by the trend makes the model swing around 0, not around the trend, and the swings grow as the trend grows. Here the data swings around a rising centre by about the same amount each year, so <strong>add</strong> the wave.",
        trend:"The wave is right. Check the trend: in Leftovers (After Part 1), the leftovers should swing evenly around 0 from the first month to the last. Yours drift {dir}.",
        other:"Fit the trend first, then the wave. Your largest gap is {gap} at `t` = {at}."
      },
      tc3:{
        set:"This challenge uses the Swing data. Press the button above to open it.",
        expWave:"Your envelope grows by the same <strong>factor</strong> each time. The peak sizes 6.0, 11.9, 17.9, 23.9 and 30.1 grow by the same <strong>amount</strong>, about 6 every 2 s. Equal steps mean a linear envelope.",
        add:"Adding a wave keeps every swing the same size. These swings get wider, so the wave must be multiplied by something that grows.",
        half:"From +6 at `t = 0` to −11.9 at `t = 2` is only half a swing. Back out to the same side takes 4 s.",
        m6:"Your swings grow 6 cm every second. They grow about 6 cm every <strong>2</strong> s, so `m = 3` cm per second.",
        flip:"Your model starts at −{b} cm, on the other side. The swing starts 6 cm out toward the parent, at a peak.",
        b0:"At `t = 0` the swing is already 6 cm out, so the envelope starts at 6.",
        other:"List the size of each peak and the time it happens, then decide: equal steps or equal ratios?"
      }
    }
  },
  part3:{
    slug:"solve", name:"Solve with graphs",
    heading:"Solve it with graphs",
    intro:"Some equations can’t be solved with algebra, but they still have solutions. Pick a problem. Count the crossings, trap each one between two numbers, then zoom in.",
    steps:{
      s1:{ title:"Make one side zero", btn:"Write it as {h0}", text:"Every crossing of the two graphs is a zero of `h`." },
      s2:{ title:"Count the crossings", text:"Tap each crossing on the top graph, then press <strong>Done</strong>. Zoom in where the graphs are close.", none:"The graphs don’t meet there: `h` is {sign} at that {v}.", empty:"Tap each place where the two graphs cross, then press Done." },
      s3:{ title:"Bracket each crossing", text:"The table lists `h` at {unit}. Tap the two neighbouring rows where the sign of `h` changes, once for each crossing, then press Check.", wrong:"`h` is {sign} at both {p} and {q}, so this pair doesn’t trap a crossing.", apart:"Tap two <strong>neighbouring</strong> rows for each crossing.", missing:"There’s another sign change in the table. Look for it." },
      s4:{ title:"Zoom ×10", text:"The table now lists tenths inside each bracket. Tap the sign change again, then press Check.", again:"Zoom ×10 again", hund:"Hundredths inside the bracket. Tap the sign change to narrow it once more.", zero:"`h` = 0 exactly at {p}: that’s an exact crossing you already know. Find the place where `h` changes sign.", report:"{v} is between {p} and {q}." },
      s5:{ title:"Answer the question" }
    },
    cards:[
      { id:"s1", chip:"S1", v:"t", title:"Ferry demand meets capacity",
        problem:"Ferry demand `P(t) = 0.5t + 20 + 5 cos[π/6 (t - 6)]` (thousands per month) meets capacity, 39 thousand. In which months is demand above capacity?",
        eq:"`P(t) = 39`", h:"`h(t) = P(t) - 39`", fLab:"y = P(t)", gLab:"y = 39", unit:"whole months",
        missing:["There’s another crossing. Look near `t = 29`, where the demand curve first rises above the capacity line.", "There’s another crossing. Look near `t = 32`, where the demand curve falls back below the capacity line."],
        ask:"In which months is demand above capacity?",
        choices:[
          { t:"July and August of year 3", ok:true, fb:"Right. The model is for monthly totals, so read whole months: `t = 30` and `t = 31` are inside the interval. Demand is above capacity in July and August of year 3." },
          { t:"June to August of year 3", fb:"`t = 29` is June: `h(29) ≈ -0.2`, just under capacity." },
          { t:"29.1 and 31.7", fb:"Those are the crossing times; the question asks for the months between them." },
          { t:"Every July", fb:"Years 1 and 2 peak at 28 and 34 thousand, under 39." }],
        answer:"Above capacity for about 29.1 &lt; `t` &lt; 31.7, so the whole months `t = 30` and 31: July and August of year 3." },
      { id:"s2", chip:"S2", v:"t", title:"Plan B overtakes Plan A",
        problem:"Plan A: $1000 plus $150 a year, `A(t) = 1000 + 150t`. Plan B: $500 doubling every 4 years, `B(t) = 500 · 2^{t/4}`. When does Plan B overtake Plan A?",
        eq:"`B(t) = A(t)`", h:"`h(t) = B(t) - A(t)`", fLab:"y = B(t)", gLab:"y = A(t)", unit:"whole years",
        missing:["There’s a crossing for `t ≥ 0`. Look where the doubling curve passes the line, between `t = 8` and `t = 10`."],
        ask:"When does Plan B overtake Plan A?",
        choices:[
          { t:"During the 9th year (between 8 and 9 years)", ok:true, fb:"Right. `h(8) = -200 < 0` and `h(9) ≈ 28 > 0`, so Plan B passes Plan A after about 8.9 years: during the 9th year." },
          { t:"After 4 years", fb:"That’s one doubling: `B(4) = 1000`, still below `A(4) = 1600`." },
          { t:"Never", fb:"A doubling amount always overtakes a steady one: `B(12) = 4000 > 2800`." },
          { t:"After 12 years", fb:"By `t = 12` Plan B is already ahead; the crossing is between 8 and 9." }],
        answer:"After about 8.9 years: during the 9th year." },
      { id:"s3", chip:"S3", v:"x", title:"A wave meets a line",
        problem:"Where does the wave `y = cos x` meet the line `y = x/2`? (`x` in radians)",
        eq:"`cos x = x/2`", h:"`h(x) = cos x - x/2`", fLab:"y = cos x", gLab:"y = x/2", unit:"whole numbers",
        missing:["Look between `x = 0` and `x = 2`, where the falling wave meets the rising line."],
        near:"`h(-2) = cos(-2) + 1 ≈ 0.58 > 0`: the wave is above the line there. For negative `x` the line stays below the wave.",
        answer:"`x ≈ 1.03`" },
      { id:"s4", chip:"S4", v:"x", stretch:true, title:"An inequality",
        problem:"Solve `x^3 < 3^x`.",
        eq:"`x^3 = 3^x`", h:"`h(x) = x^3 - 3^x`", fLab:"y = x³", gLab:"y = 3ˣ", unit:"whole numbers",
        missing:["There’s another crossing. Look between `x = 2` and `x = 3`, where the graphs are close."],
        chipQ:"The whole-number table has no sign change, but you counted two crossings. What does that tell you?",
        chipChoices:[
          { t:"The other crossing hides between two whole numbers, where `h` goes above 0 and comes back", ok:true, fb:"Right." },
          { t:"There’s only one solution, `x = 3`", fb:"You counted two crossings on the graph. A table at whole numbers can step right over a short stretch where `h > 0`." },
          { t:"There are no solutions", fb:"`h(3) = 27 - 27 = 0`, so `x = 3` is an exact solution." },
          { t:"The graph must be wrong", fb:"The graph is right: zoom in between 2 and 3 and look." }],
        after:"`x = 3` is exact, and the other crossing hides between 2 and 3. Whole numbers missed it. Zoom the table to tenths between 2 and 3.",
        ask:"Build the solution of `x^3 < 3^x`. The number line is cut at the crossings `a ≈ 2.48` and 3. Tap the pieces where `h < 0`, then set each cut ○ left out or ● included.",
        ivFb:{ mid:"There `h > 0`, so `x^3 > 3^x`. Check `x = 2.8`: 21.95 vs 21.67.", closed:"At the crossings `x^3 = 3^x` exactly, and the inequality is strict (&lt;), so leave them out.", left:"For negative `x`, `x^3` is negative and `3^x` is positive, so `x^3 < 3^x` there.", right:"Beyond 3 the exponential pulls ahead for good: at `x = 4`, 64 < 81, so `x^3 < 3^x` there." },
        answer:"`(-∞, a) ∪ (3, ∞)`, where `a ≈ 2.48`." }
    ],
    alg:[
      { t:"Why algebra can’t", html:"In `2^x = 3x` or `500 · 2^{t/4} = 1000 + 150t`, the unknown is in an exponent <strong>and</strong> outside it. Taking logs gives `(t/4) log 2 + log 500 = log(1000 + 150t)`: `t` is still inside and outside a log. In `cos x = x/2`, `x` is inside the cosine and outside it. No algebra step can isolate it." },
      { t:"S1 by hand", html:"`P(29) = 14.5 + 20 + 5 cos(23π/6) = 34.5 + 2.5√3 ≈ 38.83 < 39`, and `P(30) = 15 + 20 + 5 cos(4π) = 40 > 39`. The sign of `h` changes, so a crossing lies between 29 and 30.", use:"`√3 ≈ 1.73`" },
      { t:"S2 by hand", html:"`B(8) = 500 · 2^2 = 2000 < 2200 = A(8)`. `B(9) = 2000 · 2^{1/4} ≈ 2000 × 1.19 = 2380 > 2350 = A(9)`. So Plan B overtakes between 8 and 9 years.", use:"`2^{1/4} ≈ 1.19`" },
      { t:"S3 by hand, exactly", html:"1 < π/3, and cosine decreases from 0 to π, so `cos 1 > cos(π/3) = 1/2`: `h(1) > 0`. At `x = π/3`: `h = 1/2 - π/6 < 0`, because π > 3. So the crossing is between 1 and π/3 ≈ 1.05. And why there’s only one: from 0 to 2, `cos x` falls and `x/2` rises, so they cross once. Beyond 2, `x/2 > 1 ≥ cos x`; and for negative `x` the line is below the wave." },
      { t:"S4 by hand", html:"At `x = 2`: 8 < 9. At `x = 2.5`: `2.5^3 = 15.625` but `3^{2.5} = 9√3 ≈ 15.59` (`√3 ≈ 1.732`), so `x^3 > 3^x`. The sign changes between 2 and 2.5. At `x = 3` both are 27." },
      { t:"Why a sign change works", html:"If `h` has an unbroken graph, it can’t get from below 0 to above 0 without crossing 0. That’s why the method needs <strong>no breaks</strong>: across a vertical asymptote, a function can jump from negative to positive without ever being 0." }
    ],
    blocks:[{ title:"What the method means", html:"<div class=\"refresh\"><h4>Solving when algebra can’t</h4><ol class=\"ml-ol\"><li>Move everything to one side: `h(x) = f(x) - g(x)`. The solutions of `f(x) = g(x)` are the zeros of `h`: the `x`-values where the graphs cross.</li><li>Graph first and count the crossings. Look at negative `x` too, and zoom in where the graphs are close.</li><li>Trap each crossing with a sign change: if `h(p)` and `h(q)` have opposite signs and the graph has no break between them, a zero lies between `p` and `q`.</li><li>Zoom ×10 to narrow the bracket to the precision you need.</li><li>For an inequality, read where `h` is negative (or positive) between the crossings. &lt; and &gt; leave the crossings out; ≤ and ≥ keep them.</li></ol></div>" }],
    quickCheck:{
      title:"Solve it with graphs", summary:"Solve it with graphs quick check",
      items:[
        { id:"q1", goal:4, prompt:"`f` and `g` have unbroken graphs, and `h(x) = f(x) - g(x)`. `h(4) = -3` and `h(5) = 2`. Which statement must be true?",
          right:"Right. `h` goes from negative to positive with no break, so it crosses 0 somewhere between 4 and 5. That’s all the two values tell you.",
          wrong:"The sign change only guarantees a crossing <strong>somewhere</strong> between 4 and 5. It doesn’t say where (4.5 is just the middle), and it says nothing about other crossings or about `x > 5`.",
          choices:[{ t:"`f(x) = g(x)` for some `x` between 4 and 5", ok:true }, { t:"`f(4.5) = g(4.5)`" }, { t:"`f(x) = g(x)` has exactly one solution" }, { t:"`f(x) > g(x)` for every `x > 5`" }] },
        { id:"q2", goal:4, prompt:"`k(x) = 1/(x - 3)`. `k(2) = -1` and `k(4) = 1`. Does `k(x) = 0` have a solution between 2 and 4?" + fig("q2", "Graph of y equals 1 over x minus 3, in two pieces either side of the vertical asymptote x equals 3, never touching the x-axis", "fig-sm"),
          right:"Right. `1/(x - 3)` is never 0: a fraction is 0 only when its numerator is, and the numerator is 1. The sign changes across the vertical asymptote `x = 3`, where the graph breaks.",
          wrong:"The graph breaks at the vertical asymptote `x = 3`: `k` jumps from very negative to very positive without passing through 0. A sign change only proves a crossing when there’s no break.",
          choices:[{ t:"Yes, exactly one" }, { t:"No", ok:true }, { t:"Yes, at `x = 3`" }, { t:"There’s no way to tell without a calculator" }] },
        { id:"q3", goal:4, prompt:"How many solutions does `2^x = x^2` have?",
          right:"Right. `x = 2` (4 = 4) and `x = 4` (16 = 16) are exact, and a third hides between −1 and 0: `2^{-1} = 0.5 < 1 = (-1)^2`, but `2^0 = 1 > 0 = 0^2`.",
          wrong:"Check negative `x`: at `x = -1`, `2^x = 0.5` but `x^2 = 1`; at `x = 0`, `2^x = 1` but `x^2 = 0`. The sign changes, so there’s a crossing between −1 and 0, plus the exact solutions 2 and 4: three in all.",
          choices:[{ t:"1" }, { t:"2" }, { t:"3", ok:true }, { t:"4" }] },
        { id:"q4", goal:4, prompt:"The graphs of `y = f(x)` and `y = g(x)` cross at about (1.4, 3.9). What is the solution of `f(x) = g(x)`?",
          right:"Right. The solution is the `x`-value of the crossing. 3.9 is the value both functions share there.",
          wrong:"An equation in `x` is solved by `x`-values. The crossing’s `x`-coordinate, about 1.4, is the solution; 3.9 is the height where the graphs meet. A graph reading is approximate, not exact.",
          choices:[{ t:"`x ≈ 1.4`", ok:true }, { t:"`x ≈ 3.9`" }, { t:"`x ≈ 1.4` and `x ≈ 3.9`" }, { t:"(1.4, 3.9), exactly" }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"custom", title:"Match the story to its model", summary:"Match the story to its model", goal:2,
        instruction:"Match each situation to the model that describes it. `t` is in minutes, hours, milliseconds, seconds or months, as each story says.",
        how:"Tap a situation, then tap its model.", leftTitle:"Situation", rightTitle:"Model", retry:"Try another model.",
        left:[
          { id:"s1", goal:[1, 2], t:"Soup cools in a 22&nbsp;°C kitchen. It starts at 86&nbsp;°C, and the difference between the soup and the kitchen halves every 8 min.",
            why:"Level plus a shrinking difference: 22 is where the soup ends up, and 64 = 86 − 22 halves every 8 min.",
            hints:["What temperature does the soup end up at? What halves?", "It ends at the kitchen’s 22&nbsp;°C. The difference, 86 − 22 = 64, halves every 8 min.", "Level plus a shrinking difference: `T(t) = 22 + 64(1/2)^{t/8}`, model E1."] },
          { id:"s2", goal:[1, 2], t:"An 86 mg dose of a medicine is in the blood, and the amount halves every 8 h.",
            why:"A decay on its own: the whole 86 mg halves every 8 h and heads toward 0.",
            hints:["What does the amount of medicine settle toward?", "Nothing holds it at a level: the whole 86 mg halves every 8 h, toward 0.", "A decay on its own: `M(t) = 86(1/2)^{t/8}`, model E2."] },
          { id:"s3", goal:[1, 2], t:"Soup cools in a 22&nbsp;°C kitchen. It starts at 86&nbsp;°C, and the difference halves every 4 min.",
            why:"Level plus a shrinking difference, halving faster: every 4 min.",
            hints:["What temperature does the soup end up at? How often does the difference halve?", "It ends at the kitchen’s 22&nbsp;°C. The difference, 86 − 22 = 64, halves every 4 min.", "Level plus a shrinking difference: `T(t) = 22 + 64(1/2)^{t/4}`, model E3."] },
          { id:"s4", t:"A guitar string is plucked 4 mm out. It vibrates once every 2 ms, and its swings halve every 8 ms.",
            why:"A wave inside a shrinking envelope: 4 mm halving every 8 ms, one vibration every 2 ms.",
            hints:["Do the swings fade, grow, or stay the same?", "They halve every 8 ms from 4 mm: the envelope is `4(1/2)^{t/8}`. One vibration takes 2 ms, so `k = 2π/2 = π`.", "Shrinking envelope times a wave: `y(t) = 4(1/2)^{t/8} cos(πt)`, model E4."] },
          { id:"s5", t:"A swing is pulled 4 cm out and pushed every time it returns, so its swings grow 1 cm every second. One swing out and back takes 2 s.",
            why:"A wave inside a growing envelope: `t + 4` grows 1 cm every second, one swing every 2 s.",
            hints:["Do the swings fade, grow, or stay the same?", "They grow by 1 cm every second from 4 cm: the envelope is `t + 4`. One swing takes 2 s, so `k = 2π/2 = π`.", "Growing envelope times a wave: `y(t) = (t + 4) cos(πt)`, model E5."] },
          { id:"s6", t:"A buoy in steady waves rises 4 cm above its rest level and falls 4 cm below it, once every 2 s, starting at the top.",
            why:"A wave on its own: amplitude 4, period 2 s, starting at a peak.",
            hints:["Do the swings fade, grow, or stay the same?", "They stay 4 cm every time. One rise and fall takes 2 s, so `k = 2π/2 = π`, and it starts at the top.", "A wave on its own: `y(t) = 4 cos(πt)`, model E6."] },
          { id:"s7", t:"A park’s monthly visitors, in thousands: a trend that starts at 22 and grows 0.5 per month, plus a yearly swing of 4 above and below it, busiest in July (`t = 6`).",
            why:"Trend plus a yearly wave whose peak is shifted to July: `(t - 6)`.",
            hints:["What do the visitors do over the years, and when is it busiest?", "A trend `0.5t + 22` plus a yearly wave of 4 that peaks in July, at `t = 6`.", "Trend plus wave: `V(t) = 0.5t + 22 + 4 cos[π/6 (t - 6)]`, model E7. The `(t - 6)` puts the peak in July."] },
          { id:"s8", t:"A ski hill’s monthly visitors, in thousands: a trend that starts at 22 and grows 0.5 per month, plus a yearly swing of 4 above and below it, busiest in January (`t = 0`).",
            why:"Trend plus a yearly wave with no shift, so its peak is at `t = 0`: January.",
            hints:["What do the visitors do over the years, and when is it busiest?", "A trend `0.5t + 22` plus a yearly wave of 4 that peaks in January, at `t = 0`.", "Trend plus wave: `V(t) = 0.5t + 22 + 4 cos(π/6 t)`, model E8. With no shift, the peak is at `t = 0`: January."] }
        ],
        right:[
          { id:"e1", t:"E1. `T(t) = 22 + 64(1/2)^{t/8}`" },
          { id:"e2", t:"E2. `M(t) = 86(1/2)^{t/8}`" },
          { id:"e3", t:"E3. `T(t) = 22 + 64(1/2)^{t/4}`" },
          { id:"e4", t:"E4. `y(t) = 4(1/2)^{t/8} cos(πt)`" },
          { id:"e5", t:"E5. `y(t) = (t + 4) cos(πt)`" },
          { id:"e6", t:"E6. `y(t) = 4 cos(πt)`" },
          { id:"e7", t:"E7. `V(t) = 0.5t + 22 + 4 cos[π/6 (t - 6)]`" },
          { id:"e8", t:"E8. `V(t) = 0.5t + 22 + 4 cos(π/6 t)`" }
        ],
        answer:{ s1:"e1", s2:"e2", s3:"e3", s4:"e4", s5:"e5", s6:"e6", s7:"e7", s8:"e8" },
        wrong:matchWrong() },
      { id:"spot", type:"spot", title:"Spot the error", student:"Samuel", how:"",
        instruction:"Samuel made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Ana’s ferry model is `P(t) = 0.5t + 20 + 5 cos[π/6 (t - 6)]`, in thousands of passengers, `t` months after January of year 1, for `t = 0` to 35. Find the busiest month and its passengers.",
            steps:["The trend `0.5t + 20` is largest in the last month, `t = 35`: 0.5(35) + 20 = 37.5.", "The wave `5 cos[π/6 (t - 6)]` is largest, 5, in every July: `t = 6, 18` and 30.", "So the busiest month has 37.5 + 5 = 42.5 thousand passengers.", "It’s December of year 3, `t = 35`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: the bracket is 0 at `t = 6`, and again every 12 months.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"The two largest values happen in different months, so they can’t be added. In July of year 3, `P(30) = 15 + 20 + 5 = 40`, more than any other month: the busiest month is July of year 3, with 40 thousand.", ok:true, why:"Add the values at the <strong>same</strong> `t`. July of year 3 has the biggest wave and nearly the biggest trend." },
              { t:"42.5 is right, but it happens in July of year 3.", why:"In July of year 3 the trend is 35, not 37.5: `P(30) = 40`. 42.5 never happens." },
              { t:"Use averages instead: the trend averages 28.75 and the wave averages 0, so the busiest month has 28.75.", why:"An average isn’t a maximum. The busiest month is far above the average." },
              { t:"Step 3 is correct as written.", why:"In December of year 3 the wave is near its low: `P(35) = 37.5 + 5 cos(29π/6) = 37.5 - 2.5√3 ≈ 33.2`, not 42.5." }],
            hints:["Check step 3: do the trend’s maximum and the wave’s maximum happen in the same month?", "The trend peaks at `t = 35` (December); the wave peaks in July. Evaluate `P` at the July of year 3.", "Step 3 is wrong. `P(30) = 15 + 20 + 5 = 40`, the busiest month (July of year 3)."] },
          { id:"e2", goal:2, task:"A mug of tea cools in a 20&nbsp;°C room. It reads 84&nbsp;°C, 52&nbsp;°C, 36&nbsp;°C and 28&nbsp;°C at `t = 0, 10, 20` and 30 min. Build a model.",
            steps:["The ratios 52/84, 36/52 and 28/36 aren’t equal, so a single exponential won’t fit.", "Subtract the room temperature: 64, 32, 16, 8.", "These halve every 10 min, so the extra heat is `64(1/2)^{t/10}`.", "So the model is `T(t) = 64(1/2)^{t/10}`.", "After a long time, the tea approaches 0&nbsp;°C."],
            answer:3,
            stepFb:["Step 1 is correct: about 0.62, 0.69 and 0.78. Keep checking.", "Step 2 is correct: these are the degrees above the room.", "Step 3 is correct.", "", "Step 5 follows from step 4. The mistake is earlier."],
            fixes:[
              { t:"Add the room temperature back: `T(t) = 20 + 64(1/2)^{t/10}`, so the tea approaches 20&nbsp;°C.", ok:true, why:"Check: `T(0) = 84` and `T(10) = 20 + 32 = 52`." },
              { t:"The model is `T(t) = 84(1/2)^{t/10}`.", why:"That halves the whole temperature: `T(10) = 42`, not 52. It’s the temperature <strong>above the room</strong> that halves." },
              { t:"The model is `T(t) = 20 + 64(1/2)^{10t}`.", why:"`(1/2)^{10t}` halves 10 times every minute. Halving every 10 min is `(1/2)^{t/10}`." },
              { t:"Step 4 is correct as written.", why:"Check `t = 0`: `64(1/2)^0 = 64`, but the tea is 84&nbsp;°C. Step 3 found the extra heat; step 4 forgot the room." }],
            hints:["Test Samuel’s model at `t = 0`.", "It gives 64&nbsp;°C, not 84&nbsp;°C. What did step 2 take away that never came back?", "Step 4 is wrong: `T(t) = 20 + 64(1/2)^{t/10}`."] },
          { id:"e3", goal:4, task:"Solve `2^x = x + 2`.",
            steps:["Let `h(x) = 2^x - x - 2`. The solutions are the zeros of `h`.", "`h(1) = 2 - 3 = -1` and `h(2) = 4 - 4 = 0`, so `x = 2` is a solution.", "`h(3) = 8 - 5 = 3`. The sign of `h` only changes once, at `x = 2`, so `x = 2` is the only solution.", "The solution is `x = 2`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: `2^2 = 4 = 2 + 2`.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"Check negative `x` too: `h(-2) = 1/4 + 2 - 2 = 1/4 > 0` and `h(-1) = 1/2 + 1 - 2 = -1/2 < 0`, so there’s a second solution between −2 and −1. The solutions are `x = 2` and `x ≈ -1.7`.", ok:true, why:"The line `y = x + 2` crosses the exponential twice: once on each side of the `y`-axis." },
              { t:"Algebra can’t isolate `x`, so `x = 2` is only approximate.", why:"`2^2 = 4 = 2 + 2` exactly. Graphical methods find approximations, but an exact check like this is exact." },
              { t:"There’s a second solution between 0 and 1.", why:"`h(0) = 1 - 2 = -1` and `h(1) = -1`: no sign change between 0 and 1. Look further left." },
              { t:"Step 3 is correct as written.", why:"Samuel only looked at `x ≥ 1`. `h(-2) = 1/4` is positive and `h(-1) = -1/2` is negative, so `h` changes sign there too." }],
            hints:["Did Samuel check every part of the graph?", "Try negative `x`: find `h(-2)` and `h(-1)`.", "Step 3 is wrong: `h(-2) > 0 > h(-1)`, so there’s another solution between −2 and −1 (`x ≈ -1.7`)."] }
        ] },
      { id:"model", type:"numeric", title:"Model it, solve it", summary:"Model it, solve it", star:true,
        instruction:"Each question needs more than one step. Answer in the box, then press Check.",
        how:"Type a number. Decimals are fine.",
        items:[
          { id:"r1", goal:2, prompt:"Cocoa is 76&nbsp;°C in a 20&nbsp;°C room, and its temperature above the room halves every 12 min. What is its temperature after 36 min, in °C?",
            answer:27, unit:"°C", display:"27&nbsp;°C",
            why:"<span class=\"ml-sense\">Sense check: does your answer fit the story?</span> 27&nbsp;°C is between the room’s 20&nbsp;°C and the start, 76&nbsp;°C, and closer to the room after three halvings.",
            wrong:[{ match:9.5, fb:"That halves the whole temperature, 76/8. It’s the 56&nbsp;°C above the room that halves: 20 + 56/8 = 27." }, { match:34, fb:"That’s two halvings, 20 + 56/4. 36 min is three halvings of 12 min." }, { match:38, fb:"That’s 76/2, one halving of the whole temperature." }],
            hints:["What halves: the whole temperature, or the part above the room?", "The cocoa starts 76 − 20 = 56&nbsp;°C above the room. 36 min is 3 halvings of 12 min.", "56 → 28 → 14 → 7&nbsp;°C above the room, so the temperature is 20 + 7 = 27&nbsp;°C."] },
          { id:"r2", goal:2, prompt:"Soup cools in a 22&nbsp;°C kitchen. It’s 86&nbsp;°C at `t = 0` and 30&nbsp;°C at `t = 24` min. The difference from the kitchen halves at a steady rate. What is the halving time, in minutes?",
            answer:8, unit:"min", display:"8 min",
            why:"<span class=\"ml-sense\">Sense check: does your answer fit the story?</span> Halving every 8 min, the difference goes 64 → 32 → 16 → 8&nbsp;°C at 8, 16 and 24 min, and 22 + 8 = 30&nbsp;°C matches the reading at 24 min.",
            wrong:[{ match:3, fb:"3 is the number of halvings (64 → 32 → 16 → 8). They take 24 min, so each takes 24 ÷ 3." }, { match:12, fb:"64 → 16 is two halvings, but the difference fell to 30 − 22 = 8: three halvings." }, { match:24, fb:"The difference fell from 64 to 8, which is more than one halving." }],
            hints:["Work with the difference from the kitchen, not the temperature.", "The difference goes from 86 − 22 = 64 to 30 − 22 = 8&nbsp;°C. How many halvings is that?", "64 → 32 → 16 → 8 is 3 halvings in 24 min, so each halving takes 24 ÷ 3 = 8 min."] },
          { id:"r3", goal:5, prompt:"A bike-share’s monthly rides (thousands) are modelled by `S(t) = 2t + 30 + 8 cos[π/6 (t - 6)]`, `t` months after January of year 1. In which month of year 2 (`t = 12` to 23) does the model give the most rides? Enter `t`.",
            use:"`√3 ≈ 1.73`", answer:19, label:"`t` =", display:"`t = 19` (August of year 2)",
            why:"<span class=\"ml-sense\">Sense check: does your answer fit the story?</span> August comes one month after the wave’s July peak, while the trend still adds 2 thousand rides a month, so a month just after July is believable: `S(19) ≈ 74.9` is a little more than `S(18) = 74`.",
            wrong:[{ match:18, fb:"July is the wave’s peak, and `S(18) = 74`. But the trend adds 2 every month: `S(19) = 38 + 30 + 4√3 ≈ 74.9`, more than July." }, { match:23, fb:"December has the biggest trend in year 2, but the wave is near its low: `S(23) = 76 - 4√3 ≈ 69.1`." }, { match:20, fb:"`S(20) = 40 + 30 + 4 = 74`, a little less than `S(19)`." }],
            hints:["The trend keeps rising during the July peak. Compare `S` at July and the months either side.", "`S(18) = 36 + 30 + 8 = 74`. `S(19) = 38 + 30 + 8 cos(13π/6) = 68 + 4√3`.", "68 + 4 × 1.73 = 74.92 > 74, and `S(20) = 74`. The busiest month of year 2 is `t = 19` (August)."] },
          { id:"r4", goal:4, prompt:"The positive solution of `2^x = 3x + 5` lies between two consecutive whole numbers. Enter the smaller one.",
            answer:4, display:"4 (the solution is between 4 and 5)",
            why:"<span class=\"ml-sense\">Sense check: does your answer fit the story?</span> `h(4) = -1 < 0` and `h(5) = 12 > 0`, so `h(x) = 2^x - 3x - 5` changes sign between 4 and 5: the doubling `2^x` passes the line there.",
            wrong:[{ match:5, fb:"That’s the larger one. Enter the smaller." }, { match:3, fb:"`h(3) = 8 - 14 = -6` and `h(4) = 16 - 17 = -1` have the same sign. `h(5) = 32 - 20 = 12` is the first positive value." }, { match:-2, fb:"There <strong>is</strong> a solution between −2 and −1, but it’s negative. The question asks for the positive one." }],
            hints:["Let `h(x) = 2^x - 3x - 5` and look for a sign change at whole numbers.", "`h(3) = 8 - 14 = -6` and `h(4) = 16 - 17 = -1` are both negative. Try `x = 5`.", "`h(5) = 32 - 20 = 12 > 0`, so the positive solution is between 4 and 5. The smaller one is 4."] },
          { id:"r5", goal:5, prompt:"A climbing gym charges $25 a visit and gets 400 visits a week. Each $1 increase loses 10 visits a week. What price gives the most weekly revenue, in dollars?",
            answer:32.5, unit:"dollars", display:"$32.50",
            why:"<span class=\"ml-sense\">Sense check: does your answer fit the story?</span> At $32.50 there are 400 − 75 = 325 visits, for $10 562.50 a week: more than the $10 000 at $25. The price sits between the current $25 and the $65 where visits stop.",
            wrong:[{ match:7.5, fb:"That’s the increase `x`. The price is 25 + 7.5." }, { match:45, fb:"That’s `x = 20`, halfway between 0 and the 40 where visits reach 0. The vertex is halfway between the <strong>zeros</strong> of `R(x) = (25 + x)(400 - 10x)`: `x = -25` and `x = 40`." }, { match:65, fb:"At $65 there are no visits at all: revenue $0." }],
            hints:["Let `x` be the price increase in dollars. Write the revenue as (price)(visits).", "`R(x) = (25 + x)(400 - 10x)`. Its zeros are `x = -25` and `x = 40`.", "The vertex is halfway between the zeros: `x = (-25 + 40)/2 = 7.5`. The price is 25 + 7.5 = $32.50."] },
          { id:"r6", goal:2, prompt:"An oil spill is a circle whose radius is `r(t) = 4t + 2` metres after `t` hours. Its area is `A = πr^2`. After how many hours is the area 100π m²?",
            answer:2, unit:"h", display:"2 h",
            why:"<span class=\"ml-sense\">Sense check: does your answer fit the story?</span> After 2 h the radius is 4(2) + 2 = 10 m, and π(10)² = 100π m².",
            wrong:[{ match:24.5, fb:"That solves `4t + 2 = 100`, skipping the square. First `πr^2 = 100π` gives `r = 10`." }, { match:2.5, fb:"That solves `4t = 10`, forgetting the starting radius of 2 m." }, { match:10, fb:"10 m is the radius at that moment. Now solve `4t + 2 = 10`." }],
            hints:["Work backwards: first find the radius that gives that area, then the time.", "`πr^2 = 100π` gives `r^2 = 100`, so `r = 10` m.", "`4t + 2 = 10` gives `4t = 8`, so `t = 2` h."] },
          { id:"r7", goal:5, prompt:"A plucked string’s swings start at 40 mm and halve every 3 ms. The note is silent once the swings are under 2 mm. What is the first whole number of milliseconds at which it’s silent?",
            use:"`2^{1/3} ≈ 1.26`", answer:13, unit:"ms", display:"13 ms",
            why:"<span class=\"ml-sense\">Sense check: does your answer fit the story?</span> 40 → 20 → 10 → 5 → 2.5 mm takes 12 ms, still just above 2 mm, so silence a little after 12 ms makes sense.",
            wrong:[{ match:12, fb:"`40(1/2)^4 = 2.5` mm: not under 2 yet." }, { match:15, fb:"At 15 ms the swings are 1.25 mm, but they were already under 2 mm at 13 ms: 40 ÷ (16 × 1.26) ≈ 1.98." }, { match:6, fb:"That takes 20 mm off every 3 ms. Halving takes half of what’s left: 40, 20, 10, 5, 2.5 …" }],
            hints:["Write the swing size as `40(1/2)^{t/3}` and test whole numbers of ms.", "At 12 ms: `40(1/2)^4 = 2.5`. At 13 ms: `40 ÷ (2^4 × 2^{1/3}) = 40 ÷ (16 × 1.26)`.", "40 ÷ 20.16 ≈ 1.98 < 2, so it’s silent at 13 ms."] },
          { id:"r8", goal:2, prompt:"Two tones are added. One repeats every 4 ms, the other every 6 ms. After how many milliseconds does the combined signal first repeat?",
            answer:12, unit:"ms", display:"12 ms",
            why:"<span class=\"ml-sense\">Sense check: does your answer fit the story?</span> After 12 ms the first tone has done exactly 3 cycles and the second exactly 2, so both start over together.",
            wrong:[{ match:10, fb:"4 + 6 = 10, but after 10 ms the first tone is halfway through a cycle. You need a time that’s a whole number of both cycles." }, { match:24, fb:"24 works, but 12 comes first: 3 cycles of 4 ms and 2 cycles of 6 ms." }, { match:2, fb:"After 2 ms neither tone has finished a cycle." }],
            hints:["The combined signal repeats when both tones finish whole cycles at the same moment.", "The first tone repeats at 4, 8, 12, 16, … ms; the second at 6, 12, 18, … ms.", "The first time on both lists is 12 ms: 3 cycles of 4 ms and 2 cycles of 6 ms."] },
          { id:"r9", goal:5, prompt:"A club’s budget is `B(t) = 200 + 10t` thousand dollars, and its membership is `M(t) = 1000 · 2^{t/20}` people, `t` years from now. Budget per member starts at $200. After how many years does it first fall to half of that, $100?",
            answer:60, unit:"years", display:"60 years",
            why:"<span class=\"ml-sense\">Sense check: does your answer fit the story?</span> At `t = 60` the budget is 800 thousand dollars for 8000 members: $100 each. The budget grows by a steady amount while the membership keeps doubling, so the share per member has to fall in the end.",
            wrong:[{ match:20, fb:"At 20 years, 400 000 ÷ 2000 = $200: the budget grew too. Test `t = 40` and 60." }, { match:40, fb:"At 40 years, 600 000 ÷ 4000 = $150: still above $100." }, { match:80, fb:"At 80 years it’s 1 000 000 ÷ 16 000 = $62.50, but it already reached $100 at 60." }],
            hints:["Budget per member = `B(t) ÷ M(t)`, in dollars: 1000 × `(200 + 10t) ÷ (1000 · 2^{t/20})`.", "Try `t = 20, 40, 60`: `(200 + 10t) ÷ 2^{t/20}` = 400/2, 600/4, 800/8.", "800/8 = 100 at `t = 60`, and it’s above 100 at every earlier time: it first falls to $100 after 60 years."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you when you looked at the leftovers in the Model lab?" },
      { id:"j2", q:"In your own words, how do you decide whether to add two functions or multiply them in a model?" },
      { id:"j3", q:"Explain to a friend, step by step, how to solve `2^x = 3x` without algebra, and how to be sure you found every solution." },
      { id:"j4", q:"Which part of modelling are you least sure about: choosing the type, combining the parts, judging the fit, or solving with graphs? What will you do to practise it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"A table lists `y = 5, 8, 13, 20, 29` for `x = 0, 1, 2, 3, 4`. Which type of function fits it?", options:[
          { t:"Linear", why:"The first differences are 3, 5, 7, 9: not steady, so not linear." },
          { t:"Quadratic", ok:true, why:"The first differences are 3, 5, 7, 9 and the second differences are all 2. Steady second differences mean quadratic." },
          { t:"Exponential", why:"It curves upward, but the ratios 8/5 = 1.6, 13/8 ≈ 1.63, 20/13 ≈ 1.54 aren’t steady. Check the second differences." },
          { t:"Sinusoidal", why:"The values keep rising and never come back down, so there’s no cycle." }] },
        b:{ prompt:"A table lists `y = 4, 6, 9, 13.5, 20.25` for `x = 0, 1, 2, 3, 4`. Which type of function fits it?", options:[
          { t:"Linear", why:"The first differences are 2, 3, 4.5, 6.75: not steady." },
          { t:"Quadratic", why:"The second differences are 1, 1.5, 2.25: not steady. Check the ratios." },
          { t:"Exponential", ok:true, why:"Each value is 1.5 times the one before: a steady ratio means exponential, `y = 4(1.5)^x`." },
          { t:"Sinusoidal", why:"The values keep rising; there’s no cycle." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"A guitar string vibrates back and forth, and its swings halve every 0.5 s. Which structure fits the string’s position?", options:[
          { t:"A halving exponential multiplied by a wave", ok:true, why:"The wave gives the back-and-forth; multiplying by a halving exponential makes each swing half as big every 0.5 s." },
          { t:"A halving exponential plus a wave", why:"Adding a wave keeps the swings the same size around a falling centre. These swings themselves shrink." },
          { t:"A halving exponential on its own", why:"That only shrinks; it never swings back and forth." },
          { t:"A wave on its own", why:"A wave alone keeps the same size forever. These swings fade." }] },
        b:{ prompt:"A town’s monthly water use grows by about 2 ML every month, with a summer peak of the same size every year. Which structure fits?", options:[
          { t:"A linear function plus a wave", ok:true, why:"The line carries the steady growth; adding a wave puts the same-size summer peak on top every year." },
          { t:"A linear function multiplied by a wave", why:"Multiplying would make the summer peaks grow as the trend grows. These stay the same size." },
          { t:"A linear function on its own", why:"A line misses the yearly peak." },
          { t:"A wave on its own", why:"A wave alone misses the growth." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"A drink cools according to `T(t) = 22 + 60(1/2)^{t/8}`, in °C, `t` minutes after it’s poured. What does the 22 represent?", options:[
          { t:"The room temperature: the drink cools toward 22&nbsp;°C", ok:true, why:"As `t` grows, `60(1/2)^{t/8}` shrinks to 0 and leaves 22." },
          { t:"The starting temperature", why:"At `t = 0` the drink is 22 + 60 = 82&nbsp;°C." },
          { t:"The halving time", why:"The halving time is the 8 in the exponent: every 8 min the 60&nbsp;°C above the room halves." },
          { t:"How many degrees the drink cools each minute", why:"It doesn’t cool by a fixed amount each minute; the difference from the room halves." }] },
        b:{ prompt:"A park’s monthly visitors are modelled by `P(t) = 0.8t + 25 + 5 cos[π/6 (t - 6)]`, in thousands, `t` months after January. What does the 0.8 represent?", options:[
          { t:"The trend: on average, monthly visitors grow by 0.8 thousand each month", ok:true, why:"0.8 is the slope of the linear part." },
          { t:"The size of the yearly swing", why:"The wave’s amplitude is 5." },
          { t:"The model’s value at `t = 0`", why:"`P(0) = 25 + 5 cos(-π) = 20`." },
          { t:"The time between peaks", why:"The peaks are 2π ÷ (π/6) = 12 months apart." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"A trend-only model of monthly sales leaves these leftovers (data − model) for `t = 0, 1, …, 11`: 2, 3.5, 4, 3.5, 2, 0, −2, −3.5, −4, −3.5, −2, 0. What should be added to the model?", options:[
          { t:"A wave with amplitude 4 and period 12 months, peaking at `t = 2`", ok:true, why:"The leftovers swing from 4 down to −4 and back over 12 months, with the high at `t = 2`: `4 cos[π/6 (t - 2)]`." },
          { t:"A wave with amplitude 8 and period 12 months, peaking at `t = 2`", why:"8 is the distance from the lowest leftover to the highest. The amplitude is half of it." },
          { t:"A wave with amplitude 4 and period 6 months, peaking at `t = 2`", why:"From the high at `t = 2` to the low at `t = 8` is only half a cycle." },
          { t:"The constant 4", why:"Adding 4 would shift every leftover down by 4. The leftovers go up <strong>and</strong> down, so they need a wave." }] },
        b:{ prompt:"A model of a pendulum’s position leaves these leftovers for `t = 0, 1, …, 6` seconds: 3, 1.5, −1.5, −3, −1.5, 1.5, 3. What should be added to the model?", options:[
          { t:"A wave with amplitude 3 and period 6 s, peaking at `t = 0`", ok:true, why:"From 3 down to −3 and back to 3 takes 6 s: `3 cos(π/3 t)`." },
          { t:"A wave with amplitude 6 and period 6 s, peaking at `t = 0`", why:"6 is the full swing from −3 to 3. The amplitude is half." },
          { t:"A wave with amplitude 3 and period 3 s, peaking at `t = 0`", why:"From the high at `t = 0` to the low at `t = 3` is half a cycle." },
          { t:"The constant 3", why:"The leftovers go up and down; a constant can’t fix that." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"How many solutions does `2^x = x + 3` have, and between which whole numbers is the positive one?", options:[
          { t:"Two; the positive one is between 2 and 3", ok:true, why:"With `h(x) = 2^x - x - 3`: `h(2) = -1` and `h(3) = 2`, and also `h(-3) = 1/8 > 0` and `h(-2) = -3/4 < 0`. Two sign changes, two solutions." },
          { t:"One, between 2 and 3", why:"There’s a second solution for negative `x`: `h(-3) = 1/8` and `h(-2) = -3/4` have opposite signs." },
          { t:"Two; the positive one is between 1 and 2", why:"`h(1) = -2` and `h(2) = -1` have the same sign, so no crossing is trapped there." },
          { t:"None, because algebra can’t isolate `x`", why:"Algebra can’t isolate `x`, but the graphs still cross. A sign change proves it." }] },
        b:{ prompt:"How many solutions does `3^x = 4x + 2` have, and between which whole numbers is the positive one?", options:[
          { t:"Two; the positive one is between 2 and 3", ok:true, why:"With `h(x) = 3^x - 4x - 2`: `h(2) = -1` and `h(3) = 13`, and also `h(-1) = 7/3 > 0` and `h(0) = -1 < 0`. Two solutions." },
          { t:"One, between 2 and 3", why:"`h(-1) = 7/3` and `h(0) = -1` have opposite signs: there’s a negative solution too." },
          { t:"Two; the positive one is between 1 and 2", why:"`h(1) = -3` and `h(2) = -1` have the same sign." },
          { t:"None, because algebra can’t isolate `x`", why:"No algebra step isolates `x`, but the sign changes show two crossings." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"A circular ripple’s radius is `r(t) = 3t + 1` cm after `t` seconds, and its area is `A(r) = πr^2`. At what time is the area 49π cm²?", fixedOrder:true, options:[
          { t:"2 s", ok:true, why:"`πr^2 = 49π` gives `r = 7`. Then `3t + 1 = 7` gives `t = 2`." },
          { t:"7/3 s", why:"That solves `3t = 7`, forgetting the starting radius of 1 cm." },
          { t:"7 s", why:"7 cm is the radius at that moment, not the time." },
          { t:"16 s", why:"That solves `3t + 1 = 49`, skipping the square: the <strong>area</strong> is 49π, so `r^2 = 49`." }] },
        b:{ prompt:"A square ice sheet’s side is `s(t) = 2t + 3` m after `t` hours, and its area is `A(s) = s^2`. At what time is the area 81 m²?", fixedOrder:true, options:[
          { t:"3 h", ok:true, why:"`s^2 = 81` gives `s = 9`. Then `2t + 3 = 9` gives `t = 3`." },
          { t:"4.5 h", why:"That solves `2t = 9`, forgetting the starting side of 3 m." },
          { t:"9 h", why:"9 m is the side at that moment, not the time." },
          { t:"39 h", why:"That solves `2t + 3 = 81`, skipping the square." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Lena models tea cooling in a 20&nbsp;°C room with `T(t) = 84(1/2)^{t/15}`. Which is the best explanation of why her model is poor?", options:[
          { t:"“Her model shrinks toward 0&nbsp;°C, but the tea can only cool to the room’s 20&nbsp;°C. The temperature above the room is what halves, so the model should be 20 plus a shrinking exponential.”", ok:true, why:"This names the flaw, explains it with the situation, and says how to fix it." },
          { t:"“Exponential functions can only model growth, not cooling.”", why:"`(1/2)^{t/15}` models decay perfectly well; the problem is the level it decays toward." },
          { t:"“Her halving time should be 20 min, because the room is 20&nbsp;°C.”", why:"The room temperature is the level, not the halving time. They’re different jobs." },
          { t:"“Her model is fine, because it gives exactly 84&nbsp;°C at `t = 0`.”", why:"One matching point doesn’t make a good model. By `t = 60` hers gives 5.25&nbsp;°C." }] },
        b:{ prompt:"Omar models the Spring data with `y(t) = 24 cos(π/2 t)`. Which is the best explanation of why his model is poor?", options:[
          { t:"“His swings stay 24 cm forever, but the spring’s swings halve every 2 s. The wave should be multiplied by a shrinking envelope, `24(1/2)^{t/2}`.”", ok:true, why:"This names the flaw, explains it with the data, and says how to fix it." },
          { t:"“A cosine model can’t start at a peak.”", why:"Cosine models start at a peak when `d = 0`: that part is right." },
          { t:"“His period should be 2 s, because the swings halve every 2 s.”", why:"The halving time and the period are different jobs: the swings repeat every 4 s." },
          { t:"“His model is fine, because it gives exactly 24 cm at `t = 0`.”", why:"One matching point isn’t enough: at `t = 8` his model gives 24 cm, but the reading is 1.5 cm." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"The graphs of `y = 2^x` and `y = x^2 + 1` cross at (0, 1), (1, 2) and about (4.26, 19.1), and nowhere else. Which is the correct solution of `2^x > x^2 + 1`?", options:[
          { t:"`(0, 1) ∪ (4.26, ∞)`, with 4.26 approximate", ok:true, why:"Between 0 and 1 and beyond 4.26 the exponential is above the parabola. The inequality is strict, so the crossings are left out." },
          { t:"`[0, 1] ∪ [4.26, ∞)`", why:"At the crossings the two sides are equal, so `2^x > x^2 + 1` is false there. Use round brackets." },
          { t:"`(1, 2) ∪ (19.1, ∞)`", why:"Those are `y`-values. The solution is a set of `x`-values." },
          { t:"`(4.26, ∞)`", why:"Between 0 and 1 the exponential is also above: at `x = 1/2`, √2 ≈ 1.41 > 1.25." }] },
        b:{ prompt:"The graphs of `y = 3^x` and `y = 2x + 1` cross at (0, 1) and (1, 3), and nowhere else. Which is the correct solution of `3^x ≤ 2x + 1`?", options:[
          { t:"`[0, 1]`", ok:true, why:"Between 0 and 1 the line is above the exponential, and ≤ includes the crossings, where the two sides are equal." },
          { t:"`(0, 1)`", why:"≤ includes equality, and at `x = 0` and `x = 1` the two sides are equal. Use square brackets." },
          { t:"`[1, 3]`", why:"Those are `y`-values. The solution is a set of `x`-values." },
          { t:"`(-∞, 0] ∪ [1, ∞)`", why:"That’s where `3^x ≥ 2x + 1`: the wrong side. At `x = 2`, 9 > 5." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"The Spring is modelled by `y(t) = 24(1/2)^{t/2} cos(π/2 t)`, in cm, `t` in seconds. Where does the model put the weight at `t = 6` s?", fixedOrder:true, options:[
          { t:"−12 cm", why:"That halves only once. In 6 s there are 3 halvings: 24 → 12 → 6 → 3." },
          { t:"−3 cm", ok:true, why:"The envelope is `24(1/2)^3 = 3`, and `cos(3π) = -1`, so `y(6) = -3`: 3 cm below its resting position." },
          { t:"2 cm", why:"That adds the parts, 3 + (−1). The model multiplies them." },
          { t:"3 cm", why:"That’s the envelope’s size. `cos(3π) = -1` puts the weight below its resting position." }] },
        b:{ prompt:"A car’s bounce after a bump is modelled by `y(t) = 32(1/2)^{t/3} cos(π/3 t)`, in cm, `t` in seconds. Where does the model put the car body at `t = 9` s?", fixedOrder:true, options:[
          { t:"−16 cm", why:"That halves only once. In 9 s there are 3 halvings: 32 → 16 → 8 → 4." },
          { t:"−4 cm", ok:true, why:"The envelope is `32(1/2)^3 = 4`, and `cos(3π) = -1`, so `y(9) = -4`." },
          { t:"3 cm", why:"That adds the parts, 4 + (−1). The model multiplies them." },
          { t:"4 cm", why:"That’s the envelope’s size. `cos(3π) = -1` puts the car body below its resting height." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A ferry charges $20 a trip and carries 300 riders a day. Each $1 increase in the fare loses 10 riders a day, so the daily revenue is `R(x) = (20 + x)(300 - 10x)` dollars for an increase of `x` dollars. Which fare gives the most revenue?", fixedOrder:true, options:[
          { t:"$20", why:"That’s the current fare: `R(0) = 6000`, but `R(5) = 6250` is more." },
          { t:"$25", ok:true, why:"The zeros of `R` are `x = -20` and `x = 30`, so the vertex is halfway, at `x = 5`. The fare is 20 + 5 = $25, for 25 × 250 = $6250." },
          { t:"$35", why:"That’s `x = 15`, halfway between 0 and 30. The vertex is halfway between the two <strong>zeros</strong>, −20 and 30." },
          { t:"$50", why:"At `x = 30` there are no riders at all: revenue $0." }] },
        b:{ prompt:"A theatre charges $15 a seat and sells 400 seats a night. Each $1 increase loses 20 seats, so the revenue is `R(x) = (15 + x)(400 - 20x)` dollars for an increase of `x` dollars. Which price gives the most revenue?", fixedOrder:true, options:[
          { t:"$15", why:"That’s the current price: `R(0) = 6000`, but `R(2.5) = 6125` is more." },
          { t:"$17.50", ok:true, why:"The zeros of `R` are `x = -15` and `x = 20`, so the vertex is at `x = 2.5`. The price is $17.50, for 17.5 × 350 = $6125." },
          { t:"$25", why:"That’s `x = 10`, halfway between 0 and 20. The vertex is halfway between the zeros, −15 and 20." },
          { t:"$35", why:"At `x = 20` no seats sell: revenue $0." }] } }
    ]
  },
  task:{
    title:"Keep the servers ahead", summary:"Keep the servers ahead",
    statement:"<p>A new streaming service expects `U(t) = 5 · 2^{t/6}` thousand users, `t` months after launch: 5 thousand at launch, doubling every 6 months. You plan its server capacity, `C(t) = mt + b` thousand users: `b` at launch, plus `m` more each month. A new data centre opens at `t = 18`. Choose `m` and `b` so that all four checks pass. There are many working plans. Can you find more than one?</p><p class=\"uses\"><strong>Values you need</strong>`U(0) = 5`, `U(6) = 10`, `U(12) = 20` and `U(18) = 40` (thousand users)</p>",
    checks:[
      "At launch, capacity is at most 4 times the number of users (not wasteful)",
      "Capacity is never below the number of users from launch until the new data centre opens (`0 ≤ t ≤ 18`)",
      "At `t = 12` there are at least 1.5 thousand units of capacity per thousand users",
      "The plan costs at most $30 million (the cost is `b + 6m` million dollars)"
    ],
    tips:[
      "At launch there are 5 thousand users, and your capacity is {b} thousand: {r} times as much. Keep `b` at 20 or less.",
      "Check both ends. At `t = 0` there are 5 thousand users and your capacity is {c0}; at `t = 18` there are `5 · 2^3 = 40` thousand and your capacity is {c18}. The users’ curve bends upward, so if you’re ahead at both ends you’re ahead all the way between.",
      "At `t = 12` there are 20 thousand users, so you need `C(12) = 12m + b ≥ 30`. Yours is {c12}.",
      "Your plan costs `b + 6m` = {cost} million dollars. Lower `m` or `b`, then recheck lines 2 and 3."
    ],
    explainPrompt:"Explain how you know your capacity stays ahead of the users all the way from `t = 0` to `t = 18`, not just at the two ends.",
    vocab:"Use the words exponential, linear, difference and ratio.",
    success:"Your plan works!",
    more:"There’s more than one answer. Can you find another?",
    afterM:"Notice the trade-off: a bigger launch capacity lets you grow more slowly, and faster growth lets you launch smaller, but the budget limits both. No plan works with `m = 1` or less: the capacity would have to start above 20 to catch the 40 thousand users at `t = 18`."
  },
  cards:[
    ["Combined model", "A model built from two or more functions joined by +, −, ×, ÷ or composition. Example: `P(t) = 0.5t + 20 + 5 cos[π/6 (t - 6)]`, a trend plus a yearly wave."],
    ["Add or multiply?", "Add when the swings stay the same size around a moving centre (trend + wave). Multiply when the swings grow or shrink in proportion (envelope × wave)."],
    ["Leftovers", "Data − model at each data point. Small leftovers with no pattern: a good model. A pattern in the leftovers shows what the model is missing."],
    ["Level + decay", "room + (start − room)`(1/2)^{t/h}`: a cooling drink approaches room temperature, not 0. Example: `T(t) = 20 + 64(1/2)^{t/10}`."],
    ["Choosing a type from a table", "Equal steps in `x`. Steady first differences: linear. Steady second differences: quadratic. Steady ratios: exponential. Values that repeat: sinusoidal."],
    ["The largest value of a sum", "At most (largest `f`) + (largest `g`), and equal only if both happen at the same `x`. Ferry: trend up to 37.5, wave up to 5, but the busiest month is 40."],
    ["Solving when algebra can’t", "Write `f(x) = g(x)` as `h(x) = f(x) - g(x) = 0`. Its zeros are where the graphs cross. Trap each one with a sign change, then zoom ×10."],
    ["The sign-change rule", "If `h` has no breaks and `h(p)`, `h(q)` have opposite signs, then `h = 0` somewhere between `p` and `q`. Across an asymptote this can fail: `1/(x - 3)` is never 0."],
    ["Count every crossing", "`2^x = x^2` has three solutions: `x ≈ -0.77`, `x = 2` and `x = 4`. Check negative `x`, and zoom in where the graphs are close."],
    ["Inequalities from graphs", "`f(x) < g(x)` where `f`’s graph is below `g`’s. Read the `x`-intervals between crossings: &lt; and &gt; leave the crossings out; ≤ and ≥ keep them."],
    ["Forecasting with a model", "A fitted model is safest inside the data’s range. Further out, check its prediction makes sense: a cooling drink can’t go below room temperature."],
    ["A composition model", "One quantity feeds another: `r(t) = 3t + 1` and `A(r) = πr^2` give `A(r(t)) = π(3t + 1)^2`. Work backwards one function at a time."]
  ]
};
