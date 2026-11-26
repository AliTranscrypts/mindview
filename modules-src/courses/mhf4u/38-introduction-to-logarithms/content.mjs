// MHF4U 38 Introduction to Logarithms. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/38-introduction-to-logarithms.md
const B = "@b{b}";                    // the base, in brown (colour key: --p-b)
const LB = "log_{@b{b}}";             // log with a brown b subscript

// Practice 1 (sort by value): mistake feedback built from the item (plan "Mistake feedback").
const SIGN = "Right size, wrong sign. Is the number above 1 or between 0 and 1? Is the base above 1 or between 0 and 1? With a base above 1, numbers between 0 and 1 have negative logarithms; a base between 0 and 1 flips that.";
const KIND = "Write the base and the number as powers of the same number, like `8 = 2^3` and `4 = 2^2`. Then compare the exponents.";
const recip = (item, b, x, less) => "You’ve swapped the base and the number. In " + item + " the base is " + b + ": " + b + " to what power gives " + x + "? " + x + " is " + (less ? "less" : "more") + " than " + b + ", so the exponent is " + (less ? "less" : "more") + " than 1.";
const BOXES = ["bm3", "b3", "b23", "b32"];
function sortItem(id, t, box, why, hints, rb, rx, less){
  const wrong = {};
  BOXES.forEach(k => {
    if (k === box) return;
    const whole = k === "b3" || k === "bm3", ansWhole = box === "b3" || box === "bm3";
    if (whole !== ansWhole) wrong[k] = KIND;
    else if (whole) wrong[k] = SIGN;
    else wrong[k] = recip(t, rb, rx, less);
  });
  return { id, t, answer:box, why, hints, wrong };
}

export default {
  id:"38-introduction-to-logarithms",
  kind:"topic",
  title:"Introduction to logarithms",
  topic:"Introduction to Logarithms",
  readyTopic:"logarithms",
  hero:{
    eq:"`" + LB + " x = y` `⟺ " + B + "^y = x`", eqLabel:"log base b of x equals y means b to the power y equals x", eqSize:"md",
    headline:"A logarithm is an exponent",
    text:"Ask “2 to what power gives 32?” The answer, 5, is the <strong>logarithm</strong> of 32 with <strong>base</strong> 2: `log_2 32 = 5`. Every positive number has a logarithm, even one that isn’t a whole-number power of the base: `log_3 29` is a little more than 3. The <strong>common logarithm</strong>, written `log x`, uses base 10. In this module you’ll evaluate logarithms, estimate them by <strong>systematic trial</strong>, and meet the graph of `y = " + LB + " x`, with its <strong>domain</strong>, <strong>range</strong> and <strong>vertical asymptote</strong>.",
    fig:{ aria:"A base-2 power ladder: rungs 0 to 5 with values 1, 2, 4, 8, 16 and 32, then rungs −1 to −3 with values 1/2, 1/4 and 1/8", shape:"square" },
    captions:["`2^5 = 32`, so `log_2 32 = 5`. The logarithm is the rung number.", "Below 1 the values are fractions, and the rung numbers are negative: `log_2(1/8) = -3`."]
  },
  goals:[
    "I can explain what a logarithm is (the exponent you put on the base to get a number) and evaluate logarithms that are whole numbers, such as `log_2 32` and `log 1000`.",
    "I can evaluate logarithms that are negative or fractions, such as `log_2(1/8)`, `log 0.01` and `log_8 4`, and work backwards to find a missing base or number.",
    "I can say which two whole numbers a logarithm lies between, and use systematic trial to approximate it to a given number of decimal places.",
    "I can state the domain, range, intercept and asymptote of `y = " + LB + " x`, and explain why `" + LB + " x` is undefined when `x ≤ 0` and why the base must be positive and not 1.",
    "I can sketch `y = " + LB + " x` from its key points `(1/" + B + ", -1)`, (1, 0) and `(" + B + ", 1)`, and explain how the base decides whether the graph increases or decreases.",
    "I can use logarithms to answer questions in context, such as how many rounds a tournament needs, or how large a number is from its common logarithm."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Negative exponents", goal:2, prompt:"Evaluate `4^{-2}`.",
          options:[
            { t:"`-16`", why:"A negative exponent means “one over”, not “negative”: `4^{-2} = 1/4^2 = 1/16`." },
            { t:"`-8`", why:"`4^{-2}` isn’t 4 × (−2). It means `1/4^2`." },
            { t:"`1/16`", ok:true, why:"`4^{-2} = 1/4^2 = 1/16`. A negative exponent on a positive base gives a fraction, never a negative number." },
            { t:"`1/8`", why:"`4^2` is 4 × 4 = 16, not 4 × 2 = 8." }],
          hints:["A negative exponent means “one over” the positive power.", "`4^{-2} = 1/4^2`.", "`4^2 = 16`, so `4^{-2} = 1/16`."] },
        { id:"w2", skill:"Rational exponents", goal:2, prompt:"Evaluate `8^{2/3}`.",
          options:[
            { t:"`2`", why:"`∛8 = 2` is only the first step. The numerator 2 says to square it: `2^2 = 4`." },
            { t:"`4`", ok:true, why:"`8^{2/3} = (∛8)^2 = 2^2 = 4`." },
            { t:"`16/3`", why:"8 × 2/3 = 16/3, but an exponent isn’t a multiplier. `8^{2/3} = (∛8)^2`." },
            { t:"`64`", why:"`8^2 = 64` is only half the job. The denominator 3 says to take the cube root: `∛64 = 4`." }],
          hints:["In a fractional exponent, the denominator is a root and the numerator is a power.", "`8^{2/3} = (∛8)^2`.", "`∛8 = 2`, and `2^2 = 4`."] },
        { id:"w3", skill:"Log and exponential form", goal:1, prompt:"Which equation says the same thing as `log_2 32 = 5`?",
          options:[
            { t:"`5^2 = 32`", why:"The base of the logarithm, 2, stays the base. (Also, `5^2 = 25`, not 32.)" },
            { t:"`32^5 = 2`", why:"`32^5` is huge, not 2. The base is 2, and the logarithm, 5, is the exponent." },
            { t:"`2^5 = 32`", ok:true, why:"`log_2 32 = 5` says the exponent on 2 that gives 32 is 5: `2^5 = 32`." },
            { t:"`2^{32} = 5`", why:"The answer to a logarithm is the exponent, so 5 goes up top: `2^5 = 32`." }],
          hints:["In `" + LB + " x = y`, `" + B + "` is the base and `y` is the exponent.", "Here the base is 2 and the exponent is 5.", "`2^5 = 32`."] },
        { id:"w4", skill:"Log and exponential form", goal:2, prompt:"Which equation says the same thing as `10^{-2} = 0.01`?",
          options:[
            { t:"`log 0.01 = -2`", ok:true, why:"The base 10 becomes the base of the logarithm (written log, with no subscript), and the exponent −2 is the answer." },
            { t:"`log(-2) = 0.01`", why:"A logarithm gives the exponent, so −2 goes on the right: `log 0.01 = -2`." },
            { t:"`log_{0.01} 10 = -2`", why:"The base of the power, 10, is the base of the logarithm." },
            { t:"`log_{-2} 0.01 = 10`", why:"−2 is the exponent, so it’s the answer, not the base. (A base can’t be negative anyway.)" }],
          hints:["The base of the power becomes the base of the logarithm, and the exponent is the answer.", "The base is 10. A logarithm with no base written means base 10.", "`log 0.01 = -2`."] },
        { id:"w5", skill:"Exponential graphs and inverses", goal:5, prompt:"Which point is on the graph of the inverse of `y = 3^x`?",
          options:[
            { t:"`(-2, -9)`", why:"An inverse swaps `x` and `y`; it doesn’t change their signs." },
            { t:"`(2, 1/9)`", why:"(2, 1/9) is on `y = 1/3^x`, the reciprocal. The inverse swaps the coordinates." },
            { t:"`(2, 9)`", why:"`3^2 = 9`, so (2, 9) is on `y = 3^x`. Swap it to get a point on the inverse." },
            { t:"`(9, 2)`", ok:true, why:"(2, 9) is on `y = 3^x`, and the inverse swaps the coordinates: (9, 2). In log form, `log_3 9 = 2`." }],
          hints:["An inverse swaps the coordinates of every point.", "Find a point on `y = 3^x` first: `x = 2` gives `3^2 = 9`.", "(2, 9) is on `y = 3^x`, so (9, 2) is on its inverse."] },
        { id:"w6", skill:"Exponential graphs and inverses", goal:4, prompt:"What is the range of `y = 2^x`?",
          options:[
            { t:"`{y ∈ ℝ}`", why:"`2^x` is never negative or 0. Try `x = -10`: `2^{-10} = 1/1024`, small but positive." },
            { t:"`{y ∈ ℝ | y ≥ 0}`", why:"`2^x` gets closer and closer to 0 but never equals it. That’s why `y = 0` is an asymptote." },
            { t:"`{y ∈ ℝ | y ≥ 1}`", why:"For negative `x`, `2^x` is a fraction: `2^{-1} = 1/2`." },
            { t:"`{y ∈ ℝ | y > 0}`", ok:true, why:"Every positive number is a power of 2 for some real `x`, and nothing else is." }],
          hints:["Can `2^x` be negative? Can it be 0? Can it be less than 1?", "`2^{-10} = 1/1024`: small but positive. `2^x` never reaches 0.", "Every positive `y` is reached, and nothing else: `{y ∈ ℝ | y > 0}`."] }
      ],
      refreshers:{
        "Negative exponents":"A negative exponent means “one over” the positive power: `" + B + "^{-n} = 1/" + B + "^n`. So `2^{-3} = 1/8` and `10^{-2} = 1/100 = 0.01`. The answer is a fraction, not a negative number. You’ll use this to see why `log_2(1/8) = -3`.",
        "Rational exponents":"In `" + B + "^{m/n}`, the denominator `n` is a root and the numerator `m` is a power: `" + B + "^{m/n} = (^n√{" + B + "})^m`. Examples: `8^{2/3} = (∛8)^2 = 2^2 = 4`, and `4^{3/2} = (√4)^3 = 8`. Exponents can also be negative fractions: `4^{-1/2} = 1/√4 = 1/2`.",
        "Log and exponential form":"`" + LB + " x = y` and `" + B + "^y = x` say the same thing. The base stays the base, and the logarithm is the exponent: `log_2 32 = 5 ⟺ 2^5 = 32`. With no base written, the base is 10: `log 0.01 = -2 ⟺ 10^{-2} = 0.01`.",
        "Exponential graphs and inverses":"`y = " + B + "^x` (with `" + B + " > 0`, `" + B + " ≠ 1`) has domain `{x ∈ ℝ}`, range `{y ∈ ℝ | y > 0}`, horizontal asymptote `y = 0`, and passes through (0, 1). Its inverse, `y = " + LB + " x`, swaps every point: (2, 9) on `y = 3^x` becomes (9, 2) on `y = log_3 x`."
      }
    }
  },
  explore:{
    heading:"Power ladder",
    intro:"Each rung of the ladder is a power of the base. Climb to the rung for a number: its rung number is the logarithm. When a number sits between rungs, switch to Squeeze and trap it by systematic trial.",
    // Climb target chips per base (plan table "Target chips"); Squeeze library chips.
    chips:{ "2":["32", "1/8", "1", "0", "−8"], "3":["81", "1/9", "29"], "4":["2", "8", "1/16"], "5":["125", "1/25", "0.2"], "8":["2", "16", "1/2"], "9":["3", "27", "1/3"], "10":["1000", "0.01", "0.000 001"], "1/2":["8", "1/8", "1/2"] },
    library:[
      { id:"l1", base:"3", t:"29", label:"`log_3 29`" },
      { id:"l2", base:"2", t:"50", label:"`log_2 50`" },
      { id:"l3", base:"10", t:"448", label:"`log 448`" },
      { id:"l4", base:"5", t:"0.03", label:"`log_5 0.03`" },
      { id:"l5", base:"10", t:"2", label:"`log 2`" }
    ],
    log2Note:"That’s where the course’s “Use these values: `log 2 ≈ 0.301`” boxes come from.",
    squeezeNote:"Squeeze uses bases greater than 1.",
    // "Decide the rounding" (K11 chips) for log₃ 29, worded exactly as the plan; other targets follow the same pattern in app.js.
    decide:{
      q:"Which one trial decides whether {L} rounds to {lo} or {hi}?",
      mid:"Right. The halfway exponent decides it. If {pmid} is below {t}, the logarithm is above {mid} and rounds up.",
      lo:"You already know {plo} is too low. That tells you the logarithm is above {lo}, not which way it rounds.",
      hi:"You already know {phi} is too high. Try the exponent halfway between.",
      shortcut:"No trial: {t} is closer to the value at {near}",
      log329:"It’s true that 29 is a little closer to `3^{3.07} ≈ 29.1583` than to `3^{3.06} ≈ 28.8397`, and here that happens to point the right way. But comparing values isn’t a reliable test, because the values don’t grow evenly between rungs. For example, 50 is closer to `3^3 = 27` than to `3^4 = 81`, yet `3^{3.5} ≈ 46.8` is below 50 (P3), so `log_3 50` is above 3.5 and rounds <strong>up</strong> to 4. The halfway exponent always decides it.",
      example:"For example, 50 is closer to `3^3 = 27` than to `3^4 = 81`, yet `3^{3.5} ≈ 46.8` is below 50 (P3), so `log_3 50` is above 3.5 and rounds <strong>up</strong> to 4. The halfway exponent always decides it."
    },
    found:{
      title:"What you found",
      items:[
        "<strong>A logarithm is an exponent:</strong> `" + LB + " x = y` means `" + B + "^y = x`. On the ladder, it’s the rung number.",
        "<strong>Two rungs every ladder has:</strong> `" + LB + " 1 = 0` (because `" + B + "^0 = 1`) and `" + LB + " " + B + " = 1`. Also `" + LB + "(" + B + "^n) = n` and `" + B + "^{" + LB + " x} = x`: the logarithm and the power undo each other.",
        "<strong>Below rung 0</strong> (for a base above 1): the values are fractions between 0 and 1, so their logarithms are negative: `log_2(1/8) = -3`, `log 0.01 = -2`.",
        "<strong>Never 0 or negative:</strong> `" + B + "^y > 0` for every `y`, so `" + LB + " x` needs `x > 0`.",
        "<strong>Between rungs:</strong> fractional rungs give fractional logarithms: `log_8 4 = 2/3`, because `8^{2/3} = 4`. Half a rung multiplies by `√{" + B + "}`, so halfway in the exponent is not halfway in the value.",
        "<strong>The common logarithm</strong>, `log x`, has base 10: `log 1000 = 3`, `log 0.001 = -3`.",
        "<strong>A base between 0 and 1</strong> turns the ladder upside down: `log_{1/2} 8 = -3`."
      ]
    },
    predictions:[
      { id:"p1", start:{ base:"2", size:1, k:0, arcs:true, ts:false },
        prompt:"The climber will go <strong>down</strong> three whole rungs from 1. What value will it reach?",
        options:[{ t:"`-8`" }, { t:"`-6`" }, { t:"`0`" }, { t:"`1/8`", ok:true }],
        explain:"Each rung down divides by 2: 1 → 1/2 → 1/4 → 1/8. So `2^{-3} = 1/8`, and `log_2(1/8) = -3`. A negative rung number gives a fraction, not a negative value. (−8 treats the exponent as a sign; −6 is 2 × (−3); 0 assumes the ladder runs out below 1.)" },
      { id:"p2", start:{ base:"10", size:1, k:0, arcs:true, ts:true, strip:1 },
        prompt:"Keep climbing down the base-10 ladder from 1. What happens to the value?",
        options:[{ t:"It reaches 0 after a few rungs" }, { t:"It turns negative below rung −1" }, { t:"It gets closer and closer to 0 but never reaches it", ok:true }, { t:"It stops shrinking at 0.1" }],
        explain:"Each rung down divides by 10, and dividing a positive number by 10 never gives 0 or a negative number. So `10^y > 0` for every `y`. That’s why `log 0` and the logarithm of a negative number are undefined, and why very small numbers have large negative logarithms: `log 0.000 001 = -6`. In Part 3 this becomes a vertical asymptote." },
      { id:"p3", start:{ base:"3", size:2, k:18, arcs:true, ts:true, strip:100 }, fixedOrder:true,
        prompt:"The climber will move up <strong>half</strong> a rung, from `3^3 = 27` toward `3^4 = 81`. What will the value be?",
        options:[{ t:"28.5" }, { t:"40.5" }, { t:"about 46.8", ok:true }, { t:"54" }],
        explain:"Two half rungs make one whole rung, so each half rung multiplies by the same number `m`, with `m × m = 3`. That’s `m = √3 ≈ 1.73`, so the value is `27 × √3 ≈ 46.8`. Halfway in the exponent is <strong>not</strong> halfway in the value. (54 is the halfway value; 40.5 multiplies by 3/2 instead of √3; 28.5 adds half of 3.) So `log_3 50` is more than 3.5, not less." },
      { id:"p4", start:{ base:"1/2", size:1, k:0, arcs:true, ts:false },
        prompt:"The base is now 1/2. The climber will go <strong>up</strong> three whole rungs from 1. What value will it reach?",
        options:[{ t:"`-1/8`" }, { t:"`1/8`", ok:true }, { t:"`3/2`" }, { t:"`8`" }],
        explain:"With base 1/2, each rung up multiplies by 1/2, so the values shrink as you climb: `(1/2)^3 = 1/8`. The ladder is upside down compared with base 2: `log_{1/2}(1/8) = 3` and `log_{1/2} 8 = -3`. (8 is what base 2 would give; 3/2 is 3 × 1/2; −1/8 has the right size, but no power of 1/2 is negative.)" }
    ],
    chalIntro:"Set the ladder, then press <strong>Check challenge</strong>. For challenge 3, first press <strong>Start challenge 3</strong> under the Squeeze controls: it sets up `log 448` and counts your trials from 0. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 2], prompt:"In Climb mode, put the climber on the rung that shows `log_4(1/64)`.",
        why:"`4^{-3} = 1/4^3 = 1/64`, so `log_4(1/64) = -3`.",
        hints:["Write 64 as a power of 4.", "`4^3 = 64`, so `1/64 = 1/4^3 = 4^{-3}`.", "`log_4(1/64) = -3`. Set the base to 4 and climb down to rung −3."] },
      { id:"tc2", goal:2, prompt:"Put the climber on the rung that shows `log_8 4`.",
        why:"`8^{2/3} = (∛8)^2 = 2^2 = 4`, so `log_8 4 = 2/3`.",
        hints:["4 is less than 8, so `log_8 4` is between 0 and 1. Is it a half or a third?", "Write both as powers of 2: `8 = 2^3` and `4 = 2^2`. So `8^{1/3} = ∛8 = 2`. Which power of 8 gives `2^2 = 4`?", "`8^{2/3} = (∛8)^2 = 2^2 = 4`, so `log_8 4 = 2/3`. Set the base to 8, choose Thirds, and climb to rung 2/3."] },
      { id:"tc3", goal:3, stretch:true,
        prompt:"In Squeeze, find `log 448` to <strong>one</strong> decimal place using <strong>at most 4 trials</strong>, and make sure your trials prove the rounding. Then type it in the box: `log 448 ≈` [ ].",
        why:"Your trials show `log 448` is between <span class=\"lg-tc3lo\">2.65</span> and <span class=\"lg-tc3hi\">2.7</span>, so it rounds to 2.7. Notice the trap: 448 is closer to 398 than to 501 (49.9 above versus 53.2 below), yet the logarithm rounds <strong>up</strong>. The values bunch up at the bottom of each gap, so only the halfway exponent can decide.",
        hints:["You don’t need trials for the whole numbers: `10^2 = 100` and `10^3 = 1000`.", "Try 2.6 and 2.7 to find the tenths. To round, you need to know whether the logarithm is above or below the halfway exponent, 2.65.", "`10^{2.6} ≈ 398` is too low, `10^{2.7} ≈ 501` is too high, and `10^{2.65} ≈ 447` is too low. So `log 448` is between 2.65 and 2.7: it rounds to 2.7."] }
    ]
  },
  part3:{
    slug:"features", name:"Features",
    heading:"From ladder to graph: the features of `y = " + LB + " x`",
    intro:"Lay the ladder on its side: every rung slides out to its value. Then change the base, probe the edges, and build key points yourself.",
    steps:["A. Slide the rungs", "B. Change the base", "C. Probe the edges", "D. Build it from the definition"],
    note10:"The next rung, (100, 2), is far off the right edge: to climb one more unit, `x` must multiply by 10.",
    skipNote:"`" + B + " = 1` is skipped: `1^y = 1` for every `y`, so no number except 1 has a base-1 logarithm.",
    recipNote:"`(1/" + B + ")^y = " + B + "^{-y}`, so `log_{1/" + B + "} x = -" + LB + " x`.",
    scaleNote:"The axes have different scales here",
    // D. Build it from the definition (fraction boxes; first-try tracked). Each row asks for x or y.
    build:[
      { id:"d1", fn:"`y = log_4 x`", base:"4", view:{ xmin:-1.5, xmax:18, ymin:-2.6, ymax:3.4 },
        rows:[
          { y:"−1", ask:"x", answer:"1/4", wrong:[{ match:"−4", fb:"`4^{-1} = 1/4`, not −4. A negative exponent gives a fraction." }] },
          { x:"1", ask:"y", answer:"0", wrong:[{ match:"1", fb:"`log_4 1 = 0`, because `4^0 = 1`." }] },
          { y:"1", ask:"x", answer:"4", wrong:[] },
          { y:"2", ask:"x", answer:"16", wrong:[{ match:"8", fb:"`4^2 = 16`, not 4 × 2." }] }],
        chips:[{ t:"Increasing", ok:true, fb:"Right. As `x` grows from 1/4 to 16, `y` rises from −1 to 2: the base is greater than 1." },
          { t:"Decreasing", fb:"Look at your points: as `x` grows from 1/4 to 16, `y` rises from −1 to 2." }],
        hints:["`y = log_4 x` means `4^y = x`. Put each `y` into `4^y`.", "`4^{-1} = 1/4`, because a negative exponent gives a fraction. `4^0 = 1`.", "`x` = 1/4, 1, 4, 16 for `y` = −1, 0, 1, 2. As `x` grows, `y` rises: increasing."] },
      { id:"d2", fn:"`y = log_{1/3} x`", base:"1/3", view:{ xmin:-0.6, xmax:4.2, ymin:-1.8, ymax:2.8 },
        rows:[
          { y:"−1", ask:"x", answer:"3", wrong:[{ match:"1/3", fb:"`(1/3)^{-1} = 3`: a negative exponent flips the fraction." }] },
          { x:"1", ask:"y", answer:"0", wrong:[] },
          { y:"1", ask:"x", answer:"1/3", wrong:[{ match:"3", fb:"`(1/3)^1 = 1/3`." }] },
          { y:"2", ask:"x", answer:"1/9", wrong:[{ match:"2/3", fb:"`(1/3)^2 = 1/9`, not 2 × 1/3." }] }],
        chips:[{ t:"Increasing", fb:"Look at your points: as `x` grows from 1/9 to 3, `y` falls from 2 to −1." },
          { t:"Decreasing", ok:true, fb:"Right. As `x` grows from 1/9 to 3, `y` falls from 2 to −1: the base is between 0 and 1." }],
        hints:["`y = log_{1/3} x` means `(1/3)^y = x`. Put each `y` into `(1/3)^y`.", "`(1/3)^{-1} = 3`, because a negative exponent flips the fraction. `(1/3)^0 = 1`.", "`x` = 3, 1, 1/3, 1/9 for `y` = −1, 0, 1, 2. As `x` grows, `y` falls: decreasing."] },
      { id:"d3", fn:"`y = log x`", base:"10", view:{ xmin:-1, xmax:11.5, ymin:-2.9, ymax:1.9 },
        rows:[
          { y:"−2", ask:"x", answer:"1/100", wrong:[{ match:"−100", fb:"`10^{-2} = 1/100 = 0.01`, not a negative number." }, { match:"0.001", fb:"0.001 is `10^{-3}`. `10^{-2} = 0.01`." }] },
          { y:"−1", ask:"x", answer:"1/10", wrong:[] },
          { x:"1", ask:"y", answer:"0", wrong:[{ match:"1", fb:"`log 1 = 0`, because `10^0 = 1`." }] },
          { y:"1", ask:"x", answer:"10", wrong:[] }],
        chips:[{ t:"Increasing", ok:true, fb:"Right. As `x` grows from 1/100 to 10, `y` rises from −2 to 1: the base is greater than 1." },
          { t:"Decreasing", fb:"Look at your points: as `x` grows from 1/100 to 10, `y` rises from −2 to 1." }],
        hints:["`y = log x` means `10^y = x`. Put each `y` into `10^y`.", "`10^{-2} = 1/100 = 0.01`, because a negative exponent gives a fraction. `10^0 = 1`.", "`x` = 1/100, 1/10, 1, 10 for `y` = −2, −1, 0, 1. As `x` grows, `y` rises: increasing."] }
    ],
    blocks:[
      { html:"<details class=\"alg\"><summary>Check it with algebra</summary>" +
        "<p>`y = " + LB + " x` means `" + B + "^y = x`, with `" + B + " > 0` and `" + B + " ≠ 1`.</p>" +
        "<p><strong>Domain:</strong> `" + B + "^y > 0` for every real `y`, so `x = " + B + "^y` must be positive: `{x ∈ ℝ | x > 0}`.</p>" +
        "<p><strong>Range:</strong> every positive `x` sits on the ladder somewhere, on a rung or between two, so every real `y` occurs: `{y ∈ ℝ}`.</p>" +
        "<p><strong>`x`-intercept:</strong> `y = 0` gives `x = " + B + "^0 = 1`. <strong>No `y`-intercept:</strong> `x = 0` would need `" + B + "^y = 0`.</p>" +
        "<p><strong>Vertical asymptote:</strong> for `" + B + " > 1`, as `y → -∞`, `" + B + "^y → 0^{+}`. So as `x → 0^{+}`, `y → -∞`, and the curve hugs the `y`-axis: `x = 0`. (For `0 < " + B + " < 1`, `y → ∞` instead.)</p>" +
        "<p><strong>Key points:</strong> `y` = −1, 0 and 1 give `x = " + B + "^{-1} = 1/" + B + "`, 1 and `" + B + "`.</p>" +
        "<p><strong>Increasing or decreasing:</strong> if `" + B + " > 1`, a bigger exponent gives a bigger power, so `y` rises as `x` rises. If `0 < " + B + " < 1`, a bigger exponent gives a smaller power, so `y` falls as `x` rises.</p>" +
        "<p><strong>Why `" + B + " > 0` and `" + B + " ≠ 1`:</strong> `1^y = 1` for every `y`, so `log_1 5` would have no answer and `log_1 1` would have every answer. A negative base fails for fractional exponents: `(-4)^{1/2}` isn’t a real number.</p>" +
        "<p><strong>Check with step A:</strong> for base 2, the rung at `y = -3` slid to `x = 2^{-3} = 1/8`, which is the point (1/8, −3) on the curve.</p></details>" },
      { title:"What the features mean", html:"<p><strong>`y = " + LB + " x`, in five lines</strong></p><ol>" +
        "<li>Domain `{x ∈ ℝ | x > 0}`: only positive numbers have logarithms.</li>" +
        "<li>Range `{y ∈ ℝ}`: a logarithm can be any real number.</li>" +
        "<li>Vertical asymptote `x = 0`; `x`-intercept 1; no `y`-intercept.</li>" +
        "<li>Key points `(1/" + B + ", -1)`, (1, 0), `(" + B + ", 1)`.</li>" +
        "<li>`" + B + " > 1`: increasing, and negative for `0 < x < 1`. `0 < " + B + " < 1`: decreasing, and negative for `x > 1`.</li></ol>" }
    ],
    quickCheck:{
      title:"Read the graph", summary:"Read the graph quick check",
      items:[
        { id:"q1", goal:5, prompt:"Which graph passes through (9, 2)?",
          choices:[{ t:"`y = log_3 x`", ok:true, fb:"Right. `3^2 = 9`, so `log_3 9 = 2`." },
            { t:"`y = log_9 x`", fb:"`9^1 = 9`, so (9, 1) is on `y = log_9 x`, not (9, 2)." },
            { t:"`y = log_2 x`", fb:"`2^2 = 4`, not 9. `log_2 9` is between 3 and 4." },
            { t:"`y = 3^x`", fb:"On `y = 3^x` the point is (2, 9). The log graph swaps it to (9, 2)." }] },
        { id:"q2", goal:5, prompt:"Which point is on `y = log_{1/4} x`?",
          choices:[{ t:"`(4, -1)`", ok:true, fb:"Right. `(1/4)^{-1} = 4`." },
            { t:"`(4, 1)`", fb:"`(1/4)^1 = 1/4`, not 4. (4, 1) is on `y = log_4 x`." },
            { t:"`(-4, 1)`", fb:"`x` must be positive: `(1/4)^y` is never negative." },
            { t:"`(1/4, -1)`", fb:"`(1/4)^{-1} = 4`, not 1/4." }] },
        { id:"q3", goal:4, prompt:"Where is `y = log_7 x` negative?",
          choices:[{ t:"`0 < x < 1`", ok:true, fb:"Right. Below 1 the values are fractions: `7^{-1} = 1/7`, so `log_7(1/7) = -1`." },
            { t:"`x < 0`", fb:"There’s no graph for `x < 0`: `7^y` is always positive." },
            { t:"`x > 1`", fb:"For `x > 1` the logarithm is positive: `log_7 49 = 2`." },
            { t:"Nowhere", fb:"`log_7(1/7) = -1` is negative." }] },
        { id:"q4", goal:5, prompt:"For `x > 1`, which graph is higher: `y = log_2 x` or `y = log_5 x`?",
          choices:[{ t:"`y = log_2 x`", ok:true, fb:"Right. A smaller base needs a bigger exponent to reach the same `x`. At `x = 25`, `log_5 25 = 2`, but `log_2 25` is between 4 and 5." },
            { t:"`y = log_5 x`", fb:"A bigger base climbs faster per rung, so it needs fewer rungs: its logarithm is smaller." },
            { t:"Same height", fb:"They meet only at (1, 0). At `x = 25` they’re 2 and about 4.6." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Sort by value", summary:"Sort by value", noun:"logarithm", goal:[1, 2],
        instruction:"Sort each logarithm into the box with its exact value.", how:"Tap a logarithm, then tap the box it belongs in.",
        boxes:[{ id:"bm3", label:"`-3`" }, { id:"b3", label:"`3`" }, { id:"b23", label:"`2/3`" }, { id:"b32", label:"`3/2`" }],
        items:[
          sortItem("i1", "`log 1000`", "b3", "`10^3 = 1000`.", ["Ask: 10 to what power gives 1000?", "Count the rungs from 1 to 1000 on the base-10 ladder.", "`10^3 = 1000`, so `log 1000 = 3`."]),
          sortItem("i2", "`log_7 7^3`", "b3", "A logarithm undoes its own power: `log_7 7^3 = 3`.", ["Ask: 7 to what power gives `7^3`?", "Count the rungs from 1 to `7^3` on the base-7 ladder.", "`7^3 = 343`, so `log_7 7^3 = 3`."]),
          sortItem("i3", "`log_{1/2}(1/8)`", "b3", "`(1/2)^3 = 1/8`.", ["Ask: 1/2 to what power gives 1/8?", "Count the rungs from 1 to 1/8 on the base-1/2 ladder.", "`(1/2)^3 = 1/8`, so `log_{1/2}(1/8) = 3`."]),
          sortItem("i4", "`log 0.001`", "bm3", "`0.001 = 1/1000 = 10^{-3}`.", ["Ask: 10 to what power gives 0.001?", "Count the rungs from 1 to 0.001 on the base-10 ladder.", "`10^{-3} = 0.001`, so `log 0.001 = -3`."]),
          sortItem("i5", "`log_2(1/8)`", "bm3", "`2^{-3} = 1/2^3 = 1/8`.", ["Ask: 2 to what power gives 1/8?", "Count the rungs from 1 to 1/8 on the base-2 ladder.", "`2^{-3} = 1/8`, so `log_2(1/8) = -3`."]),
          sortItem("i6", "`log_{1/2} 8`", "bm3", "`(1/2)^{-3} = 2^3 = 8`.", ["Ask: 1/2 to what power gives 8?", "Powers of 1/2 shrink as the exponent grows: `(1/2)^1 = 1/2`. To get a number bigger than 1, the exponent must be negative.", "`(1/2)^{-3} = 2^3 = 8`, so `log_{1/2} 8 = -3`."]),
          sortItem("i7", "`log_8 4`", "b23", "`8^{2/3} = (∛8)^2 = 2^2 = 4`.", ["Ask: 8 to what power gives 4?", "Write both as powers of 2: `8 = 2^3` and `4 = 2^2`.", "`8^{2/3} = 4`, so `log_8 4 = 2/3`."], "8", "4", true),
          sortItem("i8", "`log_{27} 9`", "b23", "`27^{2/3} = (∛27)^2 = 3^2 = 9`.", ["Ask: 27 to what power gives 9?", "Write both as powers of 3: `27 = 3^3` and `9 = 3^2`.", "`27^{2/3} = 9`, so `log_{27} 9 = 2/3`."], "27", "9", true),
          sortItem("i9", "`log_{1000} 100`", "b23", "`1000^{2/3} = (∛1000)^2 = 10^2 = 100`.", ["Ask: 1000 to what power gives 100?", "Write both as powers of 10: `1000 = 10^3` and `100 = 10^2`. 100 is less than 1000, so the answer is less than 1.", "`1000^{2/3} = (10^3)^{2/3} = 10^2 = 100`, so `log_{1000} 100 = 2/3`."], "1000", "100", true),
          sortItem("i10", "`log_4 8`", "b32", "`4^{3/2} = (√4)^3 = 2^3 = 8`.", ["Ask: 4 to what power gives 8?", "Write both as powers of 2: `4 = 2^2` and `8 = 2^3`.", "`4^{3/2} = 8`, so `log_4 8 = 3/2`."], "4", "8", false),
          sortItem("i11", "`log_9 27`", "b32", "`9^{3/2} = (√9)^3 = 3^3 = 27`.", ["Ask: 9 to what power gives 27?", "Write both as powers of 3: `9 = 3^2` and `27 = 3^3`.", "`9^{3/2} = 27`, so `log_9 27 = 3/2`."], "9", "27", false),
          sortItem("i12", "`log_{100} 1000`", "b32", "`100^{3/2} = (√100)^3 = 10^3 = 1000`.", ["Ask: 100 to what power gives 1000?", "Write both as powers of 10: `100 = 10^2` and `1000 = 10^3`.", "`100^{3/2} = 1000`, so `log_{100} 1000 = 3/2`."], "100", "1000", false)
        ] },
      { id:"missing", type:"custom", title:"Find the missing piece", summary:"Find the missing piece", star:true, goal:[1, 2, 3, 5, 6],
        instruction:"Find each missing value. The last four are puzzles: they need more than one step.",
        how:"Type your answer and press Check. Fractions like 3/2 or −1/8 are fine. Use decimals only where the question asks for them.",
        items:[
          { id:"n1", goal:2, box:"frac", prompt:"`log_2(1/32) = ?`", answer:"-5",
            wrong:[{ match:"5", fb:"That’s `log_2 32`. 1/32 is between 0 and 1, so its base-2 logarithm is negative." },
              { match:"1/5", fb:"`log(1/x)` isn’t `1/log x`. `2^{1/5} ≈ 1.15`, not 1/32." },
              { match:"−16", fb:"That’s 32 ÷ 2 with a negative sign. A logarithm is an exponent: 2 to what power gives 1/32?" }],
            hints:["Write 1/32 as a power of 2.", "`32 = 2^5`, so `1/32 = 2^{-5}`.", "`log_2(1/32) = -5`."] },
          { id:"n2", goal:2, box:"frac", prompt:"`log_{25} 125 = ?`", answer:"3/2",
            wrong:[{ match:"2/3", fb:"That’s `log_{125} 25`: the base and the number are swapped." },
              { match:"5", fb:"That’s 125 ÷ 25. A logarithm is an exponent." },
              { match:"3", fb:"That’s `log_5 125`. The base here is 25." }],
            hints:["Write 25 and 125 as powers of 5.", "`25 = 5^2` and `125 = 5^3`. You need `(5^2)^? = 5^3`.", "2 × ? = 3, so ? = 3/2: `log_{25} 125 = 3/2`."] },
          { id:"n3", goal:3, box:"pair", prompt:"`log_5 0.03` lies between which two consecutive integers? Enter the smaller one first.", answer:["-3", "-2"],
            wrong:[{ match:["2", "3"], fb:"0.03 is less than 1, so its logarithm is negative." },
              { match:["−2", "−1"], fb:"`5^{-2} = 1/25 = 0.04`, which is already more than 0.03. Go one rung lower." },
              { match:["0", "1"], fb:"0.03 is less than `5^0 = 1`, so the logarithm is below 0." }],
            hints:["Find the powers of 5 on either side of 0.03.", "`5^{-2} = 1/25 = 0.04` and `5^{-3} = 1/125 = 0.008`.", "0.008 < 0.03 < 0.04, so `log_5 0.03` is between −3 and −2."] },
          { id:"n4", goal:2, box:"frac", prompt:"`log_4 x = -3/2`. Find `x`.", answer:"1/8",
            wrong:[{ match:"−8", fb:"A negative exponent gives a fraction, not a negative number: `4^{-3/2} = 1/4^{3/2}`." },
              { match:"8", fb:"`4^{3/2} = 8`, but the exponent here is −3/2." },
              { match:"−6", fb:"That’s 4 × (−3/2). An exponent isn’t a multiplier." },
              { match:"1/64", fb:"That’s `4^{-3}`. The exponent is −3/2: take a square root too." }],
            hints:["Rewrite in exponential form: `x = 4^{-3/2}`.", "`4^{3/2} = (√4)^3 = 8`.", "`4^{-3/2} = 1/8`, so `x = 1/8`."] },
          { id:"n5", goal:1, box:"frac", prompt:"Evaluate `log_3(log_2 512)`.", answer:"2",
            wrong:[{ match:"9", fb:"`log_2 512 = 9` is the inside. Now take `log_3` of it." },
              { match:"1/2", fb:"That’s `log_9 3`: the base and the number are swapped in the second step." }],
            hints:["Work from the inside out: find `log_2 512` first.", "`2^9 = 512`, so `log_2 512 = 9`. Now find `log_3 9`.", "`3^2 = 9`, so `log_3(log_2 512) = log_3 9 = 2`."] },
          { id:"n6", goal:3, box:"dec", star:true, prompt:"Find `log 0.005`.", use:"`log 5 ≈ 0.699` (so `10^{0.699} ≈ 5`)", answer:"-2.301", tol:0.001,
            wrong:[{ match:"−3.699", fb:"That’s −3 − 0.699, as if the 0.699 were negative too. `0.005 = 5 × 10^{-3} = 10^{0.699} × 10^{-3} = 10^{0.699 - 3}`. The exponents add: 0.699 + (−3)." },
              { match:"−1.301", fb:"That’s `log 0.05`. `0.005 = 5 × 10^{-3}`: the decimal point moves three places." },
              { match:"2.301", fb:"0.005 is less than 1, so its logarithm is negative." }],
            hints:["Write 0.005 as 5 times a power of 10.", "`0.005 = 5 × 10^{-3}`, and `5 ≈ 10^{0.699}`. Multiply powers of 10 by adding exponents.", "`0.005 ≈ 10^{0.699} × 10^{-3} = 10^{0.699 - 3} = 10^{-2.301}`. So `log 0.005 ≈ -2.301`."] },
          { id:"n7", goal:5, box:"frac", star:true, prompt:"The graph of `y = " + LB + " x` passes through (32, −5/2). Find the `x`-coordinate of the point on the same graph whose `y`-coordinate is −1/2.", answer:"2",
            wrong:[{ match:"1/2", fb:"That uses `" + B + " = 4`, but `4^{-5/2} = 1/32`, not 32. A negative logarithm with `x > 1` means the base is between 0 and 1." },
              { match:"1/4", fb:"That’s the base, `" + B + " = 1/4`. Now put `y = -1/2` into `(1/4)^y`." },
              { match:"−1/8", fb:"`(1/4)^{-1/2}` isn’t 1/4 × (−1/2). A negative exponent flips the fraction, and the 1/2 means a square root." },
              { match:"4", fb:"`(1/4)^{-1} = 4`, but the exponent is −1/2: take the square root too." }],
            hints:["First find the base. Write the point as an equation: `" + B + "^{-5/2} = 32`.", "Flip both sides: `" + B + "^{5/2} = 1/32 = (1/2)^5`. So `(√{" + B + "})^5 = (1/2)^5`, which gives `√{" + B + "} = 1/2` and `" + B + " = 1/4`.", "`x = (1/4)^{-1/2} = 4^{1/2} = 2`. Check: `(1/4)^{-5/2} = 4^{5/2} = 32`, so (32, −5/2) is on the graph. (Shortcut: −1/2 is a fifth of −5/2, so `x = 32^{1/5} = 2`.)"] },
          { id:"n8", goal:3, box:"whole", star:true, prompt:"How many whole numbers `n` satisfy `2 < log_3 n < 4`?", answer:"71",
            wrong:[{ match:"1", fb:"You counted only `n = 27`, where the logarithm is a whole number. Every `n` between 9 and 81 has a logarithm between 2 and 4." },
              { match:"72", fb:"That’s 81 − 9, which counts one end. `log_3 9 = 2` and `log_3 81 = 4` aren’t strictly between 2 and 4, so count 10 to 80." },
              { match:"73", fb:"Both ends are included. The inequalities are strict." }],
            hints:["Rewrite the inequalities in exponential form.", "`2 < log_3 n < 4` means `3^2 < n < 3^4`, that is, `9 < n < 81`.", "The whole numbers from 10 to 80: 80 − 10 + 1 = 71."] },
          { id:"n9", goal:6, box:"whole", star:true, prompt:"A photocopier set to 200% doubles the length of an image each time. A 1 cm logo is copied, then the copy is copied, and so on. After how many copies is the logo first longer than 1 km?", use:"`2^{10} = 1024`", answer:"17",
            wrong:[{ match:"16", fb:"`2^{16} = 65 536`, so after 16 copies the logo is 65 536 cm, about 655 m: still short of 1 km. `log_2 100 000` is between 16 and 17, so it’s copy 17." },
              { match:"10", fb:"1 km is 100 000 cm, not 1000 cm. After 10 copies the logo is only 1024 cm, about 10 m." },
              { match:"5", fb:"`log 100 000 = 5` counts powers of 10, but each copy multiplies by 2. You need 2 to what power passes 100 000." },
              { match:"50000", fb:"That’s 100 000 ÷ 2. A logarithm is an exponent: 2 to what power passes 100 000?" }],
            hints:["Write the length after `n` copies in centimetres, `2^n`, and change 1 km to centimetres.", "1 km = 1000 m = 100 000 cm, so you need the first `n` with `2^n > 100 000`. Build powers of 2 from `2^{10} = 1024`.", "`2^{16} = 2^{10} × 2^6 = 1024 × 64 = 65 536 < 100 000` and `2^{17} = 131 072 > 100 000`. So `log_2 100 000` is between 16 and 17, and copy 17 is the first one longer than 1 km."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Elijah", how:"", goal:[2, 3, 4],
        instruction:"Elijah made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Evaluate `log_8(1/4)`.",
            steps:["Let `x = log_8(1/4)`. Then `8^x = 1/4`.", "Write both sides as powers of 2: `8 = 2^3` and `1/4 = 2^{-2}`.", "So `(2^3)^x = 2^{-2}`, which means `2^{3 + x} = 2^{-2}`.", "Then `3 + x = -2`, so `x = -5`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: `2^3 = 8` and `2^{-2} = 1/4`.", "", "Step 4 is the right algebra for step 3. The mistake is earlier."],
            fixes:[
              { t:"`(2^3)^x = 2^{3x}`, so `3x = -2` and `x = -2/3`.", ok:true, why:"A power of a power multiplies the exponents. Check: `8^{-2/3} = 1/(∛8)^2 = 1/4`." },
              { t:"`(2^3)^x = 2^{3x}`, so `3x = 2` and `x = 2/3`.", why:"The exponent law is right now, but `1/4 = 2^{-2}`, not `2^2`. `8^{2/3} = 4`, not 1/4." },
              { t:"`(2^3)^x = 2^{x^3}`, so `x^3 = -2`.", why:"The 3 multiplies `x`; `x` doesn’t become cubed. `(a^m)^n = a^{mn}`." },
              { t:"Step 3 is correct as written.", why:"Check `x = -5`: `8^{-5} = 1/32 768`, not 1/4. Raising a power to a power multiplies the exponents; it doesn’t add them." }],
            hints:["Check the exponent law used in step 3.", "`(a^m)^n = a^{mn}`: a power of a power multiplies the exponents.", "Step 3 is wrong: `(2^3)^x = 2^{3x}`. So `3x = -2` and `x = -2/3`."] },
          { id:"e2", goal:4, task:"State the domain and the asymptote of `y = log_3 x`.",
            steps:["`y = log_3 x` means `3^y = x`.", "`y` can be any real number, so `3^y` can be any real number.", "So `x` can be any real number: the domain is `{x ∈ ℝ}`.", "Since every `x` is allowed, the graph has no vertical asymptote."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 follows from step 2. The mistake is earlier.", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"`y` can be any real number, but `3^y` is always positive, so `x > 0`. The domain is `{x ∈ ℝ | x > 0}` and the vertical asymptote is `x = 0`.", ok:true, why:"Powers of 3 are never 0 or negative, so only positive `x` have logarithms, and the graph hugs the `y`-axis." },
              { t:"`y` can be any real number, but `3^y` is never 0, so the domain is `{x ∈ ℝ | x ≠ 0}`.", why:"`3^y` is never negative either. Try `x = -9`: `3^y = -9` has no solution." },
              { t:"`y` must be positive, so `3^y > 1` and the domain is `{x ∈ ℝ | x > 1}`.", why:"`y` can be negative: `3^{-2} = 1/9`, so `x = 1/9` is in the domain, with `y = -2`." },
              { t:"Step 2 is correct as written.", why:"Try to make `3^y` equal −3 or 0. No exponent works, because a power of 3 is always positive." }],
            hints:["Check step 2: can a power of 3 ever be negative or 0?", "`3^y > 0` for every real `y`. What does that say about `x = 3^y`?", "Step 2 is wrong: `3^y` is always positive, so `x > 0`. Domain `{x ∈ ℝ | x > 0}`; vertical asymptote `x = 0`."] },
          { id:"e3", goal:3, task:"Estimate `log_3 50` to one decimal place.",
            steps:["`3^3 = 27` and `3^4 = 81`, so `log_3 50` is between 3 and 4.", "50 is 23/54 of the way from 27 to 81.", "So `log_3 50` is 23/54 of the way from 3 to 4: `log_3 50 ≈ 3 + 23/54 ≈ 3.43`.", "To one decimal place, `log_3 50 ≈ 3.4`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is true arithmetic: 50 − 27 = 23 and 81 − 27 = 54. The question is how it’s used next.", "", "Step 4 rounds step 3 correctly. The mistake is earlier."],
            fixes:[
              { t:"The values don’t grow evenly between rungs. Trials give `3^{3.5} ≈ 46.8` and `3^{3.6} ≈ 52.2`, and `3^{3.55} ≈ 49.4` is below 50, so `log_3 50 ≈ 3.6`.", ok:true, why:"Each tenth of a rung multiplies the value, so the values bunch up near 27. Systematic trial, with the halfway exponent to round, gives 3.6." },
              { t:"The values grow evenly, but 50 is about halfway, so `log_3 50 ≈ 3.5`.", why:"50 isn’t halfway (54 is), and the values don’t grow evenly anyway: `3^{3.5} ≈ 46.8`, which is less than 50." },
              { t:"Use 50 ÷ 3 ≈ 16.7, so `log_3 50 ≈ 16.7`.", why:"A logarithm is an exponent, not a quotient. `3^{16.7}` is about 93 million." },
              { t:"Step 3 is correct as written.", why:"Check it: `3^{3.43} ≈ 43.3`, not 50. Each step up the ladder multiplies the value, so the logarithm isn’t spread evenly between 27 and 81." }],
            hints:["Check step 3: does the value grow evenly as the exponent goes from 3 to 4?", "Each tenth of a rung multiplies the value by the same amount, so the values bunch up near 27. For example, `3^{3.5} ≈ 46.8`.", "Step 3 is wrong. `3^{3.5} ≈ 46.8 < 50 < 52.2 ≈ 3^{3.6}`, and `3^{3.55} ≈ 49.4 < 50`, so `log_3 50 ≈ 3.6`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the power ladder: the negative rungs, the half rungs, or the upside-down ladder for base 1/2? Why?" },
      { id:"j2", q:"In your own words, what is a logarithm? Use `log_2 32 = 5` and `log_2(1/8) = -3` in your explanation." },
      { id:"j3", q:"Explain to a friend how to estimate `log_2 50` to one decimal place by systematic trial, and why the halfway exponent decides the rounding." },
      { id:"j4", q:"Which is harder for you right now: fractional logarithms like `log_8 4`, or the features of `y = " + LB + " x`? What will you do to practise it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What is the value of `log_3 81`?", options:[
          { t:"`1/4`", why:"That’s `log_{81} 3`, because `81^{1/4} = 3`. Here the base is 3." },
          { t:"`4`", ok:true, why:"`3^4 = 81`, so `log_3 81 = 4`." },
          { t:"`9`", why:"9 is the square root of 81. The logarithm is the exponent on 3 that gives 81: `3^4 = 81`." },
          { t:"`27`", why:"That’s 81 ÷ 3. A logarithm is an exponent, not a quotient." }] },
        b:{ prompt:"What is the value of `log_2 64`?", options:[
          { t:"`1/6`", why:"That’s `log_{64} 2`, because `64^{1/6} = 2`. Here the base is 2." },
          { t:"`6`", ok:true, why:"`2^6 = 64`, so `log_2 64 = 6`." },
          { t:"`8`", why:"8 is the square root of 64. The logarithm is the exponent on 2 that gives 64: `2^6 = 64`." },
          { t:"`32`", why:"That’s 64 ÷ 2. A logarithm is an exponent, not a quotient." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What is `log 0.0001`?", options:[
          { t:"`-4`", ok:true, why:"`0.0001 = 1/10 000 = 10^{-4}`, so `log 0.0001 = -4`." },
          { t:"`-3`", why:"That counts the three zeros after the decimal point. The decimal point moves 4 places: `0.0001 = 10^{-4}`." },
          { t:"`1/4`", why:"`log(1/10 000)` isn’t `1/log 10 000`. `10^{1/4} ≈ 1.78`, not 0.0001." },
          { t:"`4`", why:"That’s `log 10 000`. 0.0001 is less than 1, so its logarithm is negative." }] },
        b:{ prompt:"What is `log 0.000 01`?", options:[
          { t:"`-5`", ok:true, why:"`0.000 01 = 1/100 000 = 10^{-5}`, so `log 0.000 01 = -5`." },
          { t:"`-4`", why:"That counts the four zeros after the decimal point. The decimal point moves 5 places: `0.000 01 = 10^{-5}`." },
          { t:"`1/5`", why:"`log(1/100 000)` isn’t `1/log 100 000`. `10^{1/5} ≈ 1.58`, not 0.000 01." },
          { t:"`5`", why:"That’s `log 100 000`. 0.000 01 is less than 1, so its logarithm is negative." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"What is the domain of `y = log_5 x`?", options:[
          { t:"`{x ∈ ℝ}`", why:"That’s the range of the logarithm, and the domain of `y = 5^x`. Here `x = 5^y` can’t be 0 or negative." },
          { t:"`{x ∈ ℝ | x ≥ 0}`", why:"`x = 0` isn’t allowed: `5^y` is never 0. That’s why `x = 0` is an asymptote." },
          { t:"`{x ∈ ℝ | x > 0}`", ok:true, why:"`5^y` is positive for every `y`, so `x` must be positive, and every positive `x` has a logarithm." },
          { t:"`{x ∈ ℝ | x ≥ 1}`", why:"Numbers between 0 and 1 have logarithms too: `log_5(1/5) = -1`." }] },
        b:{ prompt:"What is the domain of `y = log_{1/4} x`?", options:[
          { t:"`{x ∈ ℝ}`", why:"That’s the range of the logarithm, and the domain of `y = (1/4)^x`. Here `x = (1/4)^y` can’t be 0 or negative." },
          { t:"`{x ∈ ℝ | x ≥ 0}`", why:"`x = 0` isn’t allowed: `(1/4)^y` is never 0. That’s why `x = 0` is an asymptote." },
          { t:"`{x ∈ ℝ | x > 0}`", ok:true, why:"`(1/4)^y` is positive for every `y`, so `x` must be positive, and every positive `x` has a logarithm. A base between 0 and 1 doesn’t change the domain." },
          { t:"`{x ∈ ℝ | 0 < x < 1}`", why:"Numbers above 1 have base-1/4 logarithms too: `log_{1/4} 4 = -1`." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"What is `log_3 45`, to one decimal place?", use:"`3^{3.4} ≈ 41.9`, `3^{3.45} ≈ 44.3`, `3^{3.5} ≈ 46.8`", options:[
          { t:"`3.3`", why:"That spreads the logarithm evenly from `3^3 = 27` to `3^4 = 81`: 3 + 18/54 ≈ 3.33. The values don’t grow evenly, so use the given values." },
          { t:"`3.4`", why:"45 is between `3^{3.4}` and `3^{3.5}`, but that doesn’t mean you round down. 45 is above `3^{3.45} ≈ 44.3`, so the logarithm is above 3.45." },
          { t:"`3.5`", ok:true, why:"41.9 < 45 < 46.8, so `log_3 45` is between 3.4 and 3.5. And `45 > 44.3 ≈ 3^{3.45}`, so it’s above the halfway exponent: it rounds to 3.5." },
          { t:"`15`", why:"That’s 45 ÷ 3. A logarithm is an exponent, not a quotient." }] },
        b:{ prompt:"What is `log_4 40`, to one decimal place?", use:"`4^{2.6} ≈ 36.8`, `4^{2.65} ≈ 39.4`, `4^{2.7} ≈ 42.2`", options:[
          { t:"`2.5`", why:"That spreads the logarithm evenly from `4^2 = 16` to `4^3 = 64`: 2 + 24/48 = 2.5. The values don’t grow evenly, so use the given values." },
          { t:"`2.6`", why:"40 is between `4^{2.6}` and `4^{2.7}`, but that doesn’t mean you round down. 40 is above `4^{2.65} ≈ 39.4`, so the logarithm is above 2.65." },
          { t:"`2.7`", ok:true, why:"36.8 < 40 < 42.2, so `log_4 40` is between 2.6 and 2.7. And `40 > 39.4 ≈ 4^{2.65}`, so it rounds up to 2.7." },
          { t:"`10`", why:"That’s 40 ÷ 4. A logarithm is an exponent, not a quotient." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"If `" + LB + " 8 = -3/2`, what is `" + B + "`?", options:[
          { t:"`-4`", why:"A base can’t be negative. The negative exponent means a reciprocal: `" + B + "^{3/2} = 1/8`." },
          { t:"`1/4`", ok:true, why:"`" + B + "^{-3/2} = 8`, so `" + B + "^{3/2} = 1/8` and `" + B + " = (1/8)^{2/3} = 1/4`. Check: `(1/4)^{-3/2} = 4^{3/2} = 8`." },
          { t:"`1/2`", why:"That’s `8^{-1/3}`: a cube root without the square. `(1/2)^{-3/2} = 2√2`, not 8." },
          { t:"`4`", why:"`4^{3/2} = 8`, so this ignores the negative sign: `log_4 8 = 3/2`, not −3/2." }] },
        b:{ prompt:"If `" + LB + " 27 = -3/2`, what is `" + B + "`?", options:[
          { t:"`-9`", why:"A base can’t be negative. The negative exponent means a reciprocal: `" + B + "^{3/2} = 1/27`." },
          { t:"`1/9`", ok:true, why:"`" + B + "^{-3/2} = 27`, so `" + B + "^{3/2} = 1/27` and `" + B + " = (1/27)^{2/3} = 1/9`. Check: `(1/9)^{-3/2} = 9^{3/2} = 27`." },
          { t:"`1/3`", why:"That’s `27^{-1/3}`: a cube root without the square. `(1/3)^{-3/2} = 3√3`, not 27." },
          { t:"`9`", why:"`9^{3/2} = 27`, so this ignores the negative sign: `log_9 27 = 3/2`, not −3/2." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"The graph of `y = " + LB + " x` passes through (8, −3). Which other point is on the same graph?", options:[
          { t:"`(-3, 8)`", why:"That swaps the coordinates, so it’s on `y = (1/2)^x`, the inverse. A log graph has no points with `x < 0`." },
          { t:"`(1/4, 2)`", ok:true, why:"`" + B + "^{-3} = 8` gives `" + B + "^3 = 1/8`, so `" + B + " = 1/2`. Then `(1/2)^2 = 1/4`, so (1/4, 2) is on the graph." },
          { t:"`(4, 2)`", why:"That’s on `y = log_2 x`. From (8, −3), `" + B + "^{-3} = 8`, so `" + B + " = 1/2`, not 2." },
          { t:"`(8, 3)`", why:"That reflects the point in the `x`-axis, which gives a different graph, `y = log_2 x`. With `" + B + " = 1/2`, `(1/2)^3 = 1/8`, not 8." }] },
        b:{ prompt:"The graph of `y = " + LB + " x` passes through (9, −2). Which other point is on the same graph?", options:[
          { t:"`(-2, 9)`", why:"That swaps the coordinates, so it’s on `y = (1/3)^x`, the inverse. A log graph has no points with `x < 0`." },
          { t:"`(1/27, 3)`", ok:true, why:"`" + B + "^{-2} = 9` gives `" + B + "^2 = 1/9`, and `" + B + " > 0`, so `" + B + " = 1/3`. Then `(1/3)^3 = 1/27`, so (1/27, 3) is on the graph." },
          { t:"`(27, 3)`", why:"That’s on `y = log_3 x`. From (9, −2), `" + B + "^{-2} = 9`, so `" + B + " = 1/3`, not 3." },
          { t:"`(9, 2)`", why:"That reflects the point in the `x`-axis, which gives a different graph, `y = log_3 x`. With `" + B + " = 1/3`, `(1/3)^2 = 1/9`, not 9." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which is the best explanation of why `log_2(-8)` is undefined?", options:[
          { t:"`2^y` is positive for every real `y`, so no exponent can make `2^y` equal −8.", ok:true, why:"It names the real reason: powers of 2 are never negative." },
          { t:"−8 isn’t in the list 1, 2, 4, 8, 16, …, and only numbers in that list have base-2 logarithms.", why:"Numbers off that list have logarithms too: `log_2 5` is between 2 and 3." },
          { t:"The answer would be −3, and a logarithm can never be a negative number.", why:"Logarithms can be negative: `log_2(1/8) = -3`. And `2^{-3} = 1/8`, not −8." },
          { t:"You can’t take the logarithm of a number that is smaller than the base.", why:"`log_2 1 = 0` and `log_2(1/2) = -1` are fine, and 1 and 1/2 are smaller than 2." }] },
        b:{ prompt:"Which is the best explanation of why `log_3 0` is undefined?", options:[
          { t:"0 isn’t in the list 1, 3, 9, 27, …, and only numbers in that list have base-3 logarithms.", why:"Numbers off that list have logarithms too: `log_3 29` is about 3.07." },
          { t:"`log_3 0` would have to be 0, and a logarithm can never be 0.", why:"Logarithms can be 0: `log_3 1 = 0`, because `3^0 = 1`." },
          { t:"`3^y` is positive for every real `y`. It gets close to 0 as `y` becomes very negative, but never equals 0.", ok:true, why:"It names the reason, and it explains the asymptote too." },
          { t:"You can’t take the logarithm of a number that is smaller than the base.", why:"`log_3 1 = 0` and `log_3(1/3) = -1` are fine." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which is the best explanation of why the graph of `y = log_2 x` has the vertical asymptote `x = 0`?", options:[
          { t:"The graph of `y = 2^x` has the asymptote `y = 0`, so the log graph, its inverse, must have exactly the same asymptote.", why:"The inverse swaps `x` and `y`, so the horizontal asymptote `y = 0` turns into a different line, the vertical asymptote `x = 0`." },
          { t:"Near the `y`-axis, `x = 2^y` is tiny and positive, so `y` is a large negative number. And `x = 0` is never reached, because `2^y > 0`.", ok:true, why:"It explains both parts: the graph gets ever closer to `x = 0`, and never touches it." },
          { t:"As `x` gets larger and larger, the graph levels off and gets closer and closer to a fixed height that it never reaches.", why:"That would be a horizontal asymptote, and log graphs don’t have one: `log_2 x` reaches every height, for example `log_2 1024 = 10`." },
          { t:"The graph crosses the `y`-axis at (0, 1), and a function’s graph can cross the `y`-axis only once, so it can’t cross it again.", why:"(0, 1) is on `y = 2^x`. The log graph never reaches the `y`-axis at all." }] },
        b:{ prompt:"Which is the best explanation of why the graph of `y = log_{1/3} x` has the vertical asymptote `x = 0`?", options:[
          { t:"The graph of `y = (1/3)^x` has the asymptote `y = 0`, so the log graph, its inverse, must have exactly the same asymptote.", why:"The inverse swaps `x` and `y`, so the horizontal asymptote `y = 0` turns into a different line, the vertical asymptote `x = 0`." },
          { t:"As `x` gets larger and larger, the graph levels off and gets closer and closer to a fixed height that it never reaches.", why:"That would be a horizontal asymptote. `log_{1/3} x` keeps falling: `log_{1/3} 81 = -4`." },
          { t:"The graph crosses the `y`-axis at (0, 1), and a function’s graph can cross the `y`-axis only once, so it can’t cross it again.", why:"(0, 1) is on `y = (1/3)^x`. The log graph never reaches the `y`-axis at all." },
          { t:"Near the `y`-axis, `x = (1/3)^y` is tiny and positive, so `y` is a large positive number. And `x = 0` is never reached, because `(1/3)^y > 0`.", ok:true, why:"With a base between 0 and 1 the curve shoots up along the `y`-axis instead of down, but the reason is the same." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A single-elimination tournament starts with 128 teams. Each game has two teams, the loser is out, and each round halves the number of teams left. How many rounds does it take to find the champion?", options:[
          { t:"`6`", why:"After 6 rounds, `128 ÷ 2^6 = 2` teams are left. One more round, the final, decides the champion." },
          { t:"`7`", ok:true, why:"`2^7 = 128`, so 7 halvings take 128 teams down to 1: `log_2 128 = 7` rounds." },
          { t:"`64`", why:"That’s the number of games in round 1 (128 ÷ 2), not the number of rounds." },
          { t:"`127`", why:"That’s the total number of games: each game knocks out one team, and 127 teams must be knocked out." }] },
        b:{ prompt:"A puzzle league starts with 243 players. In each round the players are split into groups of 3, and only each group’s winner moves on. How many rounds does it take to find the champion?", options:[
          { t:"`4`", why:"After 4 rounds, `243 ÷ 3^4 = 3` players are left. One more round decides the champion." },
          { t:"`5`", ok:true, why:"`3^5 = 243`, so 5 rounds take 243 players down to 1: `log_3 243 = 5`." },
          { t:"`81`", why:"That’s the number of groups in round 1 (243 ÷ 3), not the number of rounds." },
          { t:"`121`", why:"That’s the total number of groups played: 81 + 27 + 9 + 3 + 1." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"The common logarithm of a town’s population is between 4.3 and 4.4. Which could be the town’s population?", use:"`10^{0.3} ≈ 2.0` and `10^{0.4} ≈ 2.5`", options:[
          { t:"`2 300`", why:"That’s about `10^{3.36}`, so its logarithm is between 3.3 and 3.4. `10^4` means tens of thousands." },
          { t:"`23 000`", ok:true, why:"`10^{4.3} = 10^4 × 10^{0.3} ≈ 20 000` and `10^{4.4} = 10^4 × 10^{0.4} ≈ 25 000`. 23 000 is between them." },
          { t:"`43 000`", why:"That reads 4.3 as the leading digits. But 4.3 isn’t `10^{0.3}`: `log 43 000 ≈ 4.63`." },
          { t:"`230 000`", why:"That’s about `10^{5.36}`: one power of 10 too many." }] },
        b:{ prompt:"The common logarithm of the volume of water in a lake, in litres, is between 7.6 and 7.7. Which could be the volume?", use:"`10^{0.6} ≈ 4.0` and `10^{0.7} ≈ 5.0`", fixedOrder:true, options:[
          { t:"4 500 000 L", why:"That’s about `10^{6.65}`: one power of 10 too few." },
          { t:"45 000 000 L", ok:true, why:"`10^{7.6} = 10^7 × 10^{0.6} ≈ 40 000 000` and `10^{7.7} = 10^7 × 10^{0.7} ≈ 50 000 000`. 45 000 000 is between them." },
          { t:"76 000 000 L", why:"That reads 7.6 as the leading digits. But 7.6 isn’t `10^{0.6}`: `log 76 000 000 ≈ 7.88`." },
          { t:"450 000 000 L", why:"That’s about `10^{8.65}`: one power of 10 too many." }] } }
    ]
  },
  task:{
    title:"Between the rungs", summary:"Between the rungs",
    statement:"<p>Choose a base `" + B + "` and a number `x` greater than 1 so that `" + LB + " x` is an exact fraction, not a whole number, between −2 and −1. There’s more than one design. How many can you find?</p><p class=\"tiny muted\">Pick the base from the menu. Type `x` as a fraction: a numerator and a denominator, each a whole number from 1 to 1000 (the denominator starts at 1).</p>",
    checks:["The base is allowed (`" + B + " > 0` and `" + B + " ≠ 1`)", "`x` is greater than 1", "`" + LB + " x` is between −2 and −1", "`" + LB + " x` is an exact fraction, not a whole number"],
    tips:["A base must be positive and not 1. `1^y = 1` for every `y`, and a negative base such as −4 gives `(-4)^{1/2}`, which isn’t a real number.", "Choose `x` greater than 1.",
      "Right now `" + LB + " x` = {v}. For a number greater than 1 to have a negative logarithm, the base must be between 0 and 1.",
      "`" + LB + " x` = {v} is {kind}. Try a base that is a perfect power, like `1/4 = (1/2)^2` or `1/8 = (1/2)^3`, so that a fractional rung lands exactly on a whole number."],
    tip3small:"Right now `" + LB + " x` = {v}. With `" + B + "` = {b}, `" + LB + " x` is between −2 and −1 exactly when {lo} < `x` < {hi}, because the rungs −1 and −2 have the values `1/" + B + "` and `1/" + B + "^2`.",
    cantCheck:"(can’t check until the base is allowed)",
    noLadder:"No ladder for this base",
    explainPrompt:"Explain why your base had to be between 0 and 1, and how you know `" + LB + " x` is exactly the fraction you found.",
    vocab:"Use the words base, exponent, rung and negative.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another?",
    all7:"You found all seven. In every one, the base is between 0 and 1, so a number above 1 gets a negative logarithm. And the base is a perfect power, `(1/2)^2`, `(1/2)^3`, `(1/2)^4` or `(1/3)^2`, so a fractional rung lands exactly on a whole number. Bases 1/2 and 1/10 aren’t perfect powers: between −2 and −1, their rungs never land on a whole number or a fraction."
  },
  cards:[
    ["`" + LB + " x`", "The exponent you put on `" + B + "` to get `x`: `" + LB + " x = y` means `" + B + "^y = x`. Example: `log_2 32 = 5`, because `2^5 = 32`."],
    ["The common logarithm", "`log x` means `log_{10} x`. `log 1000 = 3` and `log 0.01 = -2`."],
    ["`" + LB + " 1` and `" + LB + " " + B + "`", "`" + LB + " 1 = 0`, because `" + B + "^0 = 1`. `" + LB + " " + B + " = 1`, because `" + B + "^1 = " + B + "`."],
    ["`" + LB + "(" + B + "^n)` and `" + B + "^{" + LB + " x}`", "`n` and `x`: the logarithm and the power undo each other. `log_7 7^3 = 3`, and `10^{log 3} = 3`."],
    ["A negative logarithm", "With `" + B + " > 1`, numbers between 0 and 1 have negative logarithms: `log_3(1/9) = -2`, because `3^{-2} = 1/9`. It never means a negative number."],
    ["A fractional logarithm", "`log_8 4 = 2/3`, because `8^{2/3} = (∛8)^2 = 4`. Swapping the base and the number gives the reciprocal: `log_4 8 = 3/2`."],
    ["Which numbers have logarithms?", "Only positive ones: `" + B + "^y > 0` for every `y`. `log 0` and `log(-5)` are undefined."],
    ["Allowed bases", "`" + B + " > 0` and `" + B + " ≠ 1`. `1^y = 1` for every `y`, and a negative base isn’t real for exponents like 1/2."],
    ["Features of `y = " + LB + " x`", "Domain `{x ∈ ℝ | x > 0}`; range `{y ∈ ℝ}`; vertical asymptote `x = 0`; `x`-intercept 1; no `y`-intercept."],
    ["Key points of `y = " + LB + " x`", "`(1/" + B + ", -1)`, (1, 0), `(" + B + ", 1)`. For `y = log_5 x`: (1/5, −1), (1, 0), (5, 1)."],
    ["A base between 0 and 1", "`y = " + LB + " x` decreases, and numbers above 1 get negative logarithms: `log_{1/2} 8 = -3`."],
    ["Systematic trial", "`log_3 29`: `3^3 = 27 < 29 < 81 = 3^4`, so it’s between 3 and 4. `3^{3.0} = 27 < 29 < 30.1 ≈ 3^{3.1}`, so it’s between 3.0 and 3.1. Keep narrowing: `log_3 29 ≈ 3.07`."]
  ]
};
