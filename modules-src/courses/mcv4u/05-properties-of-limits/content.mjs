// MCV4U 05 Properties of Limits. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/05-properties-of-limits.md
// LIM("x → 2") typesets lim with the approach underneath (course plan §2); the hidden brackets keep plain text readable.
const LIM = (s, cls) => '<span class="pl-lim' + (cls ? " " + cls : "") + '"><span class="pl-lt">lim</span><span class="vh"> (</span><span class="pl-lu">`' + s + '`</span><span class="vh">)</span></span>';
const M1 = "0/0 is indeterminate: it says “simplify first”. The limit could be any number.";
const M2C = "There’s no common factor; it isn’t 0/0.";

// Practice 1 (sorter): boxes ds direct substitution, fc factor and cancel, ra rationalize, cd common denominator
const NOT00 = "Substitute first: it isn’t 0/0.";
const BOXGOAL = { ds:1, fc:3, ra:4, cd:4 };
const sortItem = (id, t, box, why, wrong, hints) => Object.assign({ id, t:LIM(t[0]) + " " + t[1], answer:box, why, wrong, goal:BOXGOAL[box] }, hints ? { hints } : {});

export default {
  id:"05-properties-of-limits",
  kind:"topic",
  title:"Properties of limits",
  topic:"Properties of Limits",
  readyTopic:"properties of limits",
  hero:{
    eq:LIM("x → 3") + " `{x^2 - 9}/{x - 3}` <span class=\"pl-harr\">→</span> <span class=\"pl-badge\">0/0?</span> <span class=\"pl-harr\">→</span> <span class=\"nw\">" + LIM("x → 3") + " `(x + 3) = 6`</span>",
    eqLabel:"The limit of (x squared minus 9) over (x minus 3), as x approaches 3: substitution gives 0 over 0, so simplify; the limit of x plus 3, as x approaches 3, is 6.",
    eqSize:"sm",
    headline:"0/0 means: do more work",
    text:"The <strong>limit laws</strong> say limits of sums, products and quotients combine just like the functions do, so often you can simply <strong>substitute</strong>. When substitution gives <strong>0/0</strong>, the form is <strong>indeterminate</strong>: simplify by factoring, rationalizing or combining fractions, then substitute into the simpler expression.",
    fig:{ aria:"The graph of y = (x² − 9)/(x − 3): the line y = x + 3 with an open circle at (3, 6). Substituting x = 3 gives 0/0. The numerator factors into (x − 3)(x + 3), the x − 3 factors cancel because x ≠ 3, and a ring marks the limit 6 at the hole, which stays open." }
  },
  goals:[
    "I can use the limit laws and direct substitution when they apply.",
    "I can recognize the indeterminate form 0/0 and explain what it does and doesn’t tell me.",
    "I can evaluate 0/0 limits by factoring and cancelling.",
    "I can evaluate 0/0 limits by rationalizing, combining fractions or changing the variable.",
    "I can find one-sided limits of piecewise and absolute-value functions and decide whether the limit exists."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Factoring", goal:3, prompt:"Factor `x^2 - 5x + 6`.",
          options:[
            { t:"`(x - 2)(x - 3)`", ok:true, why:"Product 6, sum −5." },
            { t:"`(x + 2)(x + 3)`", why:"That expands to `x^2 + 5x + 6`." },
            { t:"`(x - 1)(x - 6)`", why:"The sum is −7." },
            { t:"`(x - 2)(x + 3)`", why:"That gives `+x - 6`." }],
          hints:["Two numbers: product 6, sum −5.", "−2 and −3.", "`(x - 2)(x - 3)`."] },
        { id:"w2", skill:"Factoring", goal:3, prompt:"Factor `x^3 - 8`.",
          options:[
            { t:"`(x - 2)(x^2 + 2x + 4)`", ok:true, why:"Difference of cubes." },
            { t:"`(x - 2)^3`", why:"`(x - 2)^3 = x^3 - 6x^2 + 12x - 8`." },
            { t:"`(x - 2)(x^2 + 4)`", why:"Expand: you’d get `-2x^2` and `+4x` left over." },
            { t:"`(x - 2)(x^2 - 2x + 4)`", why:"For a difference, the middle sign is +." }],
          hints:["`a^3 - b^3 = (a - b)(a^2 + ab + b^2)`.", "`a = x`, `b = 2`.", "`(x - 2)(x^2 + 2x + 4)`."] },
        { id:"w3", skill:"Rationalizing and fractions", goal:4, prompt:"Rationalize the numerator of `{√x - 3}/{x - 9}`, `x ≠ 9`.",
          options:[
            { t:"`{1}/{√x + 3}`", ok:true, why:"`{x - 9}/{(x - 9)(√x + 3)}`." },
            { t:"`{√x + 3}/{x - 9}`", why:"Multiply top and bottom by `√x + 3`." },
            { t:"`{1}/{√x - 3}`", why:"The conjugate has the opposite sign." },
            { t:"`x - 9`", why:"The `x - 9` cancels; a fraction remains." }],
          hints:["Multiply by `{√x + 3}/{√x + 3}`.", "The numerator becomes `x - 9`.", "`{1}/{√x + 3}`."] },
        { id:"w4", skill:"Rationalizing and fractions", goal:4, prompt:"Simplify `{1}/{x} - {1}/{3}`.",
          options:[
            { t:"`{3 - x}/{3x}`", ok:true, why:"Common denominator `3x`." },
            { t:"`{x - 3}/{3x}`", why:"`{3}/{3x} - {x}/{3x}`." },
            { t:"0", why:"Fractions need a common denominator." },
            { t:"`-{1}/{3x}`", why:"The numerators are 3 and `x`." }],
          hints:["Common denominator?", "`{3}/{3x} - {x}/{3x}`.", "`{3 - x}/{3x}`."] },
        { id:"w5", skill:"Absolute value", goal:5, prompt:"Evaluate `|-4| + |2 - 5|`.",
          options:[
            { t:"7", ok:true, why:"4 + 3." },
            { t:"−1", why:"Absolute values are never negative." },
            { t:"1", why:"`|2 - 5| = 3`, so 4 + 3." },
            { t:"−7", why:"Absolute values are positive." }],
          hints:["`|-4| = 4`.", "`|2 - 5| = |-3| = 3`.", "7."] },
        { id:"w6", skill:"Absolute value", goal:5, prompt:"For `x < 2`, `|x - 2|` equals …",
          options:[
            { t:"`2 - x`", ok:true, why:"`x - 2` is negative, so take its opposite." },
            { t:"`x - 2`", why:"That’s negative when `x < 2`." },
            { t:"`x + 2`", why:"Opposite of `x - 2` is `-x + 2`." },
            { t:"`-x - 2`", why:"Distribute the minus: `-(x - 2) = -x + 2`." }],
          hints:["Try `x = 0`: `|0 - 2| = 2`.", "Which expression gives 2 at `x = 0`?", "`2 - x`."] }
      ],
      refreshers:{
        "Factoring":"Common factor, then trinomial or pattern: `a^2 - b^2 = (a - b)(a + b)`; `a^3 - b^3 = (a - b)(a^2 + ab + b^2)`; `a^3 + b^3 = (a + b)(a^2 - ab + b^2)`.",
        "Rationalizing and fractions":"Multiply by the conjugate to clear a radical binomial. Combine fractions over a common denominator: `{1}/{x} - {1}/{4} = {4 - x}/{4x}`.",
        "Absolute value":"`|u| = u` when `u ≥ 0` and `-u` when `u < 0`. So `|x - 2| = x - 2` to the right of 2 and `2 - x` to the left."
      }
    }
  },
  explore:{
    heading:"0/0 detective",
    intro:"Substitute first. If you get 0/0, choose a technique, simplify, then substitute again. Watch the graph: the hole stays open, but the limit appears.",
    predictions:[
      { id:"p1", prompt:"Limit L1, " + LIM("x → 3") + " `{x^2 - 9}/{x - 3}`: “Substitute directly” shows 0/0. What does 0/0 tell you about the limit?",
        options:[{ t:"More work is needed: the limit could be any number, or not exist", ok:true }, { t:"The limit is 0" }, { t:"The limit doesn’t exist" }, { t:"The limit is 1" }],
        explain:"The graph is a line with a hole at (3, 6). Here it’s 6. Other 0/0 limits give other answers." },
      { id:"p2", prompt:"Limit L6, " + LIM("x → 2") + " `{x + 1}/{x - 2}`: substitution gives 3/0. Near `x = 2`, the graph …",
        options:[{ t:"has a vertical asymptote, so the limit doesn’t exist", ok:true }, { t:"has a hole" }, { t:"approaches 0" }, { t:"approaches 3" }],
        explain:"The values are 31, 301 on the right and −29, −299 on the left. A non-zero number divided by something tiny is huge." },
      { id:"p3", prompt:"Limit L3, " + LIM("x → 4") + " `{√x - 2}/{x - 4}`: after rationalizing, what is the limit?",
        options:[{ t:"1/4", ok:true }, { t:"0" }, { t:"1/2" }, { t:"4" }],
        explain:"`{1}/{√4 + 2} = {1}/{4}`. 1/2 forgets the + 2; 4 flips the fraction." },
      { id:"p4", prompt:"Limit laws mode: " + LIM("x → a") + " `f(x) = 4` and " + LIM("x → a") + " `g(x) = -2`. What is " + LIM("x → a") + " `[f(x) · g(x) + 3]`?",
        options:[{ t:"−5", ok:true }, { t:"−8" }, { t:"11" }, { t:"You can’t tell without the formulas" }],
        explain:"Product law, then sum law: 4(−2) + 3 = −5. The laws let you combine the limits without knowing the functions. A quotient would need " + LIM("x → a") + " `g(x) ≠ 0`; here it’s −2, so `f/g → -2` as well." }
    ],
    chalIntro:"Use the detective and the challenge workbench under it, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:3, prompt:"Find " + LIM("x → -1") + " `{x^2 + 4x + 3}/{x + 1}`. Type it in the workbench.",
        why:"`{(x + 1)(x + 3)}/{x + 1} = x + 3` for `x ≠ -1`, so the limit is −1 + 3 = 2.",
        hints:["Substitute: 0/0. Factor the numerator.", "`{(x + 1)(x + 3)}/{x + 1} = x + 3` for `x ≠ -1`.", "−1 + 3 = 2."] },
      { id:"tc2", goal:4, prompt:"Find " + LIM("x → 0") + " `{√{9 + x} - 3}/{x}`. Type it in the workbench.",
        why:"Rationalizing gives `{1}/{√{9 + x} + 3}`, which approaches `{1}/{3 + 3} = {1}/{6}`.",
        hints:["0/0: rationalize the numerator.", "You get `{1}/{√{9 + x} + 3}`.", "`{1}/{3 + 3} = {1}/{6}`."] },
      { id:"tc3", goal:4, stretch:true, prompt:"Find the value of `a` so that " + LIM("x → 0") + " `{√{ax + 9} - 3}/{x} = 2`. Use the `a` slider and its live table in the workbench.",
        why:"Rationalizing gives `{a}/{√{ax + 9} + 3}`, which approaches `{a}/{6}`; `{a}/{6} = 2` when `a = 12`.",
        hints:["Rationalize: the numerator becomes `ax + 9 - 9 = ax`.", "The expression simplifies to `{a}/{√{ax + 9} + 3}`, which approaches `{a}/{6}`.", "`{a}/{6} = 2`, so `a = 12`."] }
    ]
  },
  part3:{
    slug:"one-sided", name:"One-sided",
    heading:"One-sided limits and piecewise functions",
    intro:"Not every limit problem yields to algebra on one formula. Absolute values and piecewise rules need each side checked separately. Visit the three stations, send the probes toward the point from each side, then try the quick check.",
    quickCheck:{
      title:"Quick check", summary:"One-sided quick check",
      items:[
        { id:"q1", goal:5, prompt:LIM("x → 5^{-}") + " `{|x - 5|}/{x - 5}`?",
          choices:[
            { t:"−1", ok:true, fb:"Right. Left of 5, `|x - 5| = -(x - 5)`, so the quotient is −1." },
            { t:"1", fb:"Left of 5, `|x - 5| = -(x - 5)`." },
            { t:"0", fb:"Left of 5, `|x - 5| = -(x - 5)`." },
            { t:"does not exist", fb:"Left of 5, `|x - 5| = -(x - 5)`." }] },
        { id:"q2", goal:5, prompt:"`f(x) = 2x + 1` for `x < 3` and `x^2 - k` for `x ≥ 3`. Which `k` makes the limit at 3 exist?",
          choices:[
            { t:"2", ok:true, fb:"Right. The left side heads to 7 and the right side to `9 - k`, so `7 = 9 - k` and `k = 2`." },
            { t:"−2", fb:"The left side heads to 2(3) + 1 = 7: `7 = 9 - k`." },
            { t:"7", fb:"The left side heads to 2(3) + 1 = 7: `7 = 9 - k`." },
            { t:"16", fb:"The left side heads to 2(3) + 1 = 7: `7 = 9 - k`." }] },
        { id:"q3", goal:5, prompt:LIM("x → 0^{+}") + " `√x`?",
          choices:[
            { t:"0", ok:true, fb:"Right. From the right, `√x` approaches 0." },
            { t:"does not exist", fb:"From the right, `√x` approaches 0." },
            { t:"undefined", fb:"From the right, `√x` approaches 0." },
            { t:"grows without bound", fb:"From the right, `√x` approaches 0." }] },
        { id:"q4", goal:5, prompt:LIM("x → 0") + " `{|x|}/{x}`?",
          choices:[
            { t:"does not exist", ok:true, fb:"Right. Left −1, right 1: the one-sided limits disagree." },
            { t:"1", fb:"Left −1, right 1." },
            { t:"−1", fb:"Left −1, right 1." },
            { t:"0", fb:"Left −1, right 1." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"tech", type:"sorter", title:"Choose the technique", summary:"Choose the technique", noun:"limit", goal:[1, 3, 4],
        instruction:"Substitute first. Then tap a limit and tap the technique that evaluates it.",
        how:"Tap a limit, then tap the box it belongs in. Its value shows after it’s sorted.",
        boxes:[{ id:"ds", label:"Direct substitution" }, { id:"fc", label:"Factor and cancel" }, { id:"ra", label:"Rationalize" }, { id:"cd", label:"Common denominator" }],
        wrongDefault:"Substitute, then ask what makes both parts 0. Try another box.",
        items:[
          sortItem("s1", ["x → 2", "`{x^2 + x - 6}/{x - 2}`"], "fc", "Substitution gives 0/0. `{(x + 3)(x - 2)}/{x - 2} = x + 3`, so the limit is 5.", {}),
          sortItem("s2", ["x → 9", "`{√x - 3}/{x - 9}`"], "ra", "The radical makes it 0/0. Rationalizing gives `{1}/{√x + 3}`, so the limit is `{1}/{6}`.", { fc:"The radical is what makes it 0/0; rationalize." }),
          sortItem("s3", ["x → 1", "`{x^2 + 1}/{x + 3}`"], "ds", "Substitution gives `{1 + 1}/{1 + 3}`: the limit is `{1}/{2}`.", { fc:NOT00, ra:NOT00, cd:NOT00 }),
          sortItem("s4", ["x → 0", "`{{1}/{x + 4} - {1}/{4}}/{x}`"], "cd", "Combine the fractions on top: `{-x}/{4(x + 4)}`. Dividing by `x` leaves `{-1}/{4(x + 4)}`, so the limit is `-{1}/{16}`.", { fc:"Combine the fractions in the numerator first." }),
          sortItem("s5", ["x → -3", "`{x^3 + 27}/{x + 3}`"], "fc", "Sum of cubes: `(x + 3)(x^2 - 3x + 9)`. Cancel `x + 3`: the limit is 27.", {},
            ["Substitute: 0/0.", "Sum of cubes: `(x + 3)(x^2 - 3x + 9)`.", "Factor and cancel; the limit is 9 + 9 + 9 = 27."]),
          sortItem("s6", ["x → 0", "`{√{x + 1} - 1}/{x}`"], "ra", "The radical makes it 0/0. Rationalizing gives `{1}/{√{x + 1} + 1}`, so the limit is `{1}/{2}`.", { fc:"The radical is what makes it 0/0; rationalize." }),
          sortItem("s7", ["x → 3", "`{{1}/{x} - {1}/{3}}/{x - 3}`"], "cd", "`{1}/{x} - {1}/{3} = {3 - x}/{3x}`, so the expression is `-{1}/{3x}` and the limit is `-{1}/{9}`.", { fc:"Combine the fractions in the numerator first." }),
          sortItem("s8", ["x → 2", "`{x^4 - 16}/{x - 2}`"], "fc", "`x^4 - 16 = (x - 2)(x + 2)(x^2 + 4)`. Cancel `x - 2`: the limit is 32.", { ds:"Substitution gives 0/0." },
            ["`x^4 - 16` is a difference of squares.", "`(x^2 - 4)(x^2 + 4) = (x - 2)(x + 2)(x^2 + 4)`.", "Factor and cancel: 4 × 8 = 32."]),
          sortItem("s9", ["x → 5", "`√{x + 4}`"], "ds", "Substitution gives `√9`: the limit is 3.", { fc:NOT00, ra:NOT00, cd:NOT00 }),
          sortItem("s10", ["x → 0", "`{2x^2 - 3x}/{x}`"], "fc", "Common factor: `{x(2x - 3)}/{x} = 2x - 3`, so the limit is −3.", {})
        ] },
      { id:"evaluate", type:"custom", title:"Evaluate the limit", summary:"Evaluate the limit", star:true, goal:[3, 4],
        instruction:"Evaluate each limit exactly. Type a whole number or a fraction, then press Check.",
        how:"Fill in the top and bottom boxes of the fraction. Leave the bottom empty for a whole number. Use − for a negative answer.",
        items:[
          { id:"v1", goal:3, ask:LIM("x → -2") + " `{x^2 - 4}/{x + 2}`", answer:"-4",
            why:"`{(x - 2)(x + 2)}/{x + 2} = x - 2`, which approaches −4.",
            wrong:[{ v:"4", fb:"`x - 2` at `x = -2` is −4." }] },
          { id:"v2", goal:3, ask:LIM("x → 1") + " `{x^3 - 1}/{x^2 - 1}`", answer:"3/2",
            why:"`{(x - 1)(x^2 + x + 1)}/{(x - 1)(x + 1)} = {x^2 + x + 1}/{x + 1}`, which approaches `{3}/{2}`.",
            wrong:[{ v:"3", fb:"Cancel `x - 1` from both: `{x^2 + x + 1}/{x + 1}`." }] },
          { id:"v3", goal:4, star:true, ask:LIM("x → 0") + " `{√{4 + x} - √{4 - x}}/{x}`", answer:"1/2",
            why:"The numerator becomes `2x`, so the expression is `{2}/{√{4 + x} + √{4 - x}}`, which approaches `{2}/{4} = {1}/{2}`.",
            wrong:[{ v:"1/4", fb:"The numerator becomes `(4 + x) - (4 - x) = 2x`." }],
            hints:["Multiply by the conjugate `√{4 + x} + √{4 - x}`.", "The numerator becomes `2x`.", "`{2}/{2 + 2} = {1}/{2}`."] },
          { id:"v4", goal:3, star:true, ask:LIM("x → 0") + " `{(x + 3)^2 - 9}/{x}`", answer:"6",
            why:"`{x^2 + 6x}/{x} = x + 6`, which approaches 6.",
            wrong:[{ v:"9", fb:"Expand: `x^2 + 6x`." }] },
          { id:"v5", goal:4, star:true, ask:LIM("x → 8") + " `{∛x - 2}/{x - 8}` (change of variable)", answer:"1/12",
            why:"With `u = ∛x`, `{u - 2}/{u^3 - 8} = {1}/{u^2 + 2u + 4}`, which approaches `{1}/{12}`.",
            wrong:[{ v:"1/4", fb:"With `u = ∛x`, `x - 8 = u^3 - 8 = (u - 2)(u^2 + 2u + 4)`." }],
            hints:["Let `u = ∛x`. As `x → 8`, `u → 2`.", "`{u - 2}/{u^3 - 8} = {1}/{u^2 + 2u + 4}`.", "`{1}/{4 + 4 + 4} = {1}/{12}`."] },
          { id:"v6", goal:4, star:true, ask:LIM("x → 0") + " `{{1}/{(x + 1)^2} - 1}/{x}`", answer:"-2",
            why:"`{1 - (x + 1)^2}/{(x + 1)^2} = {-2x - x^2}/{(x + 1)^2}`; dividing by `x` gives `{-2 - x}/{(x + 1)^2}`, which approaches −2.",
            wrong:[{ v:"2", fb:"The numerator is `1 - (x + 1)^2`, which is negative near 0." }],
            hints:["Combine: `{1 - (x + 1)^2}/{(x + 1)^2}`.", "`1 - (x + 1)^2 = -2x - x^2`, so dividing by `x` gives `{-2 - x}/{(x + 1)^2}`.", "`{-2}/{1} = -2`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Eli", how:"", goal:[3, 4, 5],
        instruction:"Eli made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Find " + LIM("x → 3") + " `{x^2 - 2x - 3}/{x - 3}`.",
            steps:["Direct substitution gives 0/0, so more work is needed.", "Factor: `{(x - 3)(x + 1)}/{x - 3}`.", "Cancel the `x` terms everywhere, leaving `{(-3)(1)}/{-3}`.", "So the limit is 1."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"Cancel the common factor `(x - 3)`, since `x ≠ 3`, leaving `x + 1`, which approaches 4.", ok:true, why:"Only whole factors cancel, not individual terms." },
              { t:"The limit is 0.", why:"Only whole factors cancel, not individual terms. " + M1 },
              { t:"The limit is −1.", why:"Only whole factors cancel, not individual terms." },
              { t:"Step 3 is correct.", why:"Only whole factors cancel, not individual terms." }],
            hints:["What exactly can cancel in a fraction?", "Common factors: `(x - 3)` on top and bottom.", "`x + 1 → 4`."] },
          { id:"e2", goal:4, task:"Find " + LIM("x → 1") + " `{√x - 1}/{x - 1}`.",
            steps:["Substitution gives 0/0, so rationalize.", "Multiply the top and bottom by `√x + 1`.", "Numerator: `(√x)^2 - 1 = x - 1`.", "So the expression is `{x - 1}/{(x - 1)(√x - 1)}`.", "`= {1}/{√x - 1}`, so the limit doesn’t exist."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 follows step 4."],
            fixes:[
              { t:"The denominator is `(x - 1)(√x + 1)`, so the expression is `{1}/{√x + 1}`, and the limit is `{1}/{2}`.", ok:true, why:"The bottom was multiplied by `√x + 1`, not `√x - 1`." },
              { t:"The limit is 0.", why:"The bottom was multiplied by `√x + 1`, not `√x - 1`." },
              { t:"The limit is 1.", why:"The bottom was multiplied by `√x + 1`, not `√x - 1`." },
              { t:"Step 4 is correct.", why:"The bottom was multiplied by `√x + 1`, not `√x - 1`." }],
            hints:["What was the bottom multiplied by in step 2?", "`√x + 1`.", "`{1}/{1 + 1} = {1}/{2}`."] },
          { id:"e3", goal:5, task:"Find " + LIM("x → 2") + " `{|x - 2|}/{x - 2}`.",
            steps:["Direct substitution gives 0/0.", "For `x > 2`, `|x - 2| = x - 2`, so the expression is 1.", "For `x < 2`, `|x - 2| = x - 2` as well, so the expression is 1.", "So the limit is 1."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"For `x < 2`, `|x - 2| = -(x - 2)`, so the expression is −1. The one-sided limits differ, so the limit doesn’t exist.", ok:true, why:"Try `x = 1`: `|1 - 2| = 1`, but `1 - 2 = -1`." },
              { t:"The limit is 0.", why:"Try `x = 1`: `|1 - 2| = 1`, but `1 - 2 = -1`." },
              { t:"The limit is −1.", why:"Try `x = 1`: `|1 - 2| = 1`, but `1 - 2 = -1`." },
              { t:"Step 3 is correct.", why:"Try `x = 1`: `|1 - 2| = 1`, but `1 - 2 = -1`." }],
            hints:["Test a value just left of 2.", "`x = 1.9`: `{|-0.1|}/{-0.1} = -1`.", "Left −1, right 1: no limit."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the 0/0 detective: that 0/0 limits can give different answers, or that the hole never closes?" },
      { id:"j2", q:"In your own words, what’s the difference between 0/0 and 5/0 when you substitute?" },
      { id:"j3", q:"Explain to a friend how you decide which technique to use on a 0/0 limit." },
      { id:"j4", q:"Which technique is least comfortable for you? What will you practise?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:LIM("x → 2") + " `f(x) = 5` and " + LIM("x → 2") + " `g(x) = -3`. What is " + LIM("x → 2") + " `[2f(x) - g(x)]^2`?", options:[
          { t:"169", ok:true, why:"(10 + 3)²." },
          { t:"49", why:"`-g` gives +3, not −3: (10 − 3)² is a sign slip." },
          { t:"13", why:"Square the result." },
          { t:"64", why:"Multiply `f`’s limit by 2 first: (5 + 3)² forgets it." }] },
        b:{ prompt:LIM("x → 1") + " `f(x) = -2` and " + LIM("x → 1") + " `g(x) = 3`. What is " + LIM("x → 1") + " `[f(x) - 2g(x)]^2`?", options:[
          { t:"64", ok:true, why:"(−2 − 6)²." },
          { t:"16", why:"That’s a sign slip: (−2 + 6)²." },
          { t:"−8", why:"Square the result." },
          { t:"25", why:"(−2 − 3)² forgets the 2." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Direct substitution in " + LIM("x → 4") + " `{x^2 - 16}/{x - 4}` gives 0/0. What does this mean?", options:[
          { t:"The expression is undefined at 4, but the limit may still exist: simplify first.", ok:true, why:M1 + " Here `{(x - 4)(x + 4)}/{x - 4} = x + 4`, so the limit is 8." },
          { t:"The limit is 0.", why:M1 },
          { t:"The limit does not exist.", why:M1 },
          { t:"The limit is 1.", why:"0/0 isn’t 1. " + M1 }] },
        b:{ prompt:"Direct substitution in " + LIM("x → -5") + " `{x^2 - 25}/{x + 5}` gives 0/0. What does this mean?", options:[
          { t:"The expression is undefined at −5, but the limit may exist: simplify first.", ok:true, why:M1 + " Here `{(x + 5)(x - 5)}/{x + 5} = x - 5`, so the limit is −10." },
          { t:"The limit is 0.", why:M1 },
          { t:"The limit does not exist.", why:M1 },
          { t:"The limit is 1.", why:"0/0 isn’t 1. " + M1 }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Evaluate " + LIM("x → -4") + " `{x^2 + x - 12}/{x + 4}`.", options:[
          { t:"−7", ok:true, why:"`{(x + 4)(x - 3)}/{x + 4} = x - 3 → -7`." },
          { t:"0", why:M1 },
          { t:"7", why:"`x - 3` at `x = -4` is −7." },
          { t:"Doesn’t exist (0/0).", why:M1 }] },
        b:{ prompt:"Evaluate " + LIM("x → -3") + " `{x^2 - 2x - 15}/{x + 3}`.", options:[
          { t:"−8", ok:true, why:"`{(x + 3)(x - 5)}/{x + 3} = x - 5 → -8`." },
          { t:"0", why:M1 },
          { t:"8", why:"`x - 5` at `x = -3` is −8." },
          { t:"Doesn’t exist", why:M1 }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Evaluate " + LIM("x → 0") + " `{√{x + 16} - 4}/{x}`.", options:[
          { t:"1/8", ok:true, why:"Rationalize: `{1}/{√{x + 16} + 4} → {1}/{8}`." },
          { t:"1/4", why:"The denominator is `√16 + 4 = 8`." },
          { t:"0", why:M1 },
          { t:"8", why:"The fraction is flipped." }] },
        b:{ prompt:"Evaluate " + LIM("x → 0") + " `{√{x + 25} - 5}/{x}`.", options:[
          { t:"1/10", ok:true, why:"Rationalize: `{1}/{√{x + 25} + 5} → {1}/{10}`." },
          { t:"1/5", why:"The denominator is `√25 + 5 = 10`." },
          { t:"0", why:M1 },
          { t:"10", why:"The fraction is flipped." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Evaluate " + LIM("x → 2") + " `{{1}/{x} - {1}/{2}}/{x - 2}`.", options:[
          { t:"−1/4", ok:true, why:"`{2 - x}/{2x(x - 2)} = -{1}/{2x} → -{1}/{4}`." },
          { t:"1/4", why:"`2 - x = -(x - 2)`: the sign is negative." },
          { t:"0", why:M1 },
          { t:"Doesn’t exist (0/0).", why:M1 }] },
        b:{ prompt:"Evaluate " + LIM("x → 5") + " `{{1}/{x} - {1}/{5}}/{x - 5}`.", options:[
          { t:"−1/25", ok:true, why:"`{5 - x}/{5x(x - 5)} = -{1}/{5x} → -{1}/{25}`." },
          { t:"1/25", why:"`5 - x = -(x - 5)`: the sign is negative." },
          { t:"0", why:M1 },
          { t:"Doesn’t exist", why:M1 }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"`f(x) = {x^2 - 9}/{|x - 3|}`. Which is true near `x = 3`?", options:[
          { t:"The right-hand limit is 6, the left-hand limit is −6, so " + LIM("x → 3") + " `f(x)` doesn’t exist.", ok:true, why:"Right of 3, `f(x) = x + 3 → 6`. Left of 3, `|x - 3| = 3 - x`, so `f(x) = -(x + 3) → -6`." },
          { t:LIM("x → 3") + " `f(x) = 6`.", why:"Left of 3, `|x - 3| = 3 - x`." },
          { t:LIM("x → 3") + " `f(x) = 0`.", why:"That averages the two sides." },
          { t:"The limit doesn’t exist because `f(3)` is undefined.", why:"The reason is that the sides disagree, not that `f(3)` is undefined." }] },
        b:{ prompt:"`f(x) = {x^2 - 1}/{|x - 1|}`. Which is true near `x = 1`?", options:[
          { t:"Right-hand limit 2, left-hand limit −2, so no limit.", ok:true, why:"Right of 1, `f(x) = x + 1 → 2`. Left of 1, `|x - 1| = 1 - x`, so `f(x) = -(x + 1) → -2`." },
          { t:"The limit is 2.", why:"Left of 1, `|x - 1| = 1 - x`." },
          { t:"The limit is 0.", why:"That averages the two sides." },
          { t:"No limit because `f(1)` is undefined.", why:"The reason is that the sides disagree, not that `f(1)` is undefined." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"A student writes " + LIM("x → 2") + " `{x^2 + 1}/{x - 2} = {5}/{0} = 0`. What’s the best response?", options:[
          { t:"“5/0 isn’t 0, and it isn’t 0/0. Near `x = 2` the top is about 5 and the bottom is tiny, so the values grow without bound, with opposite signs on each side. The limit doesn’t exist.”", ok:true, why:"5/0 isn’t indeterminate. The numerator stays near 5 while the denominator shrinks, so the values grow without bound." },
          { t:"“Correct: anything over 0 is 0.”", why:"5/0 isn’t indeterminate. The numerator stays near 5 while the denominator shrinks, so the values grow without bound." },
          { t:"“Factor and cancel to find the limit.”", why:M2C },
          { t:"“The limit is 5, the value of the numerator.”", why:"The denominator matters." }] },
        b:{ prompt:"A student writes " + LIM("x → 1") + " `{x + 3}/{x - 1} = {4}/{0} = 0`. Best response?", options:[
          { t:"“4/0 isn’t 0 or 0/0: the values grow without bound with opposite signs on each side, so there’s no limit.”", ok:true, why:"4/0 isn’t indeterminate. The numerator stays near 4 while the denominator shrinks, so the values grow without bound." },
          { t:"“Correct: anything over 0 is 0.”", why:"4/0 isn’t indeterminate. The numerator stays near 4 while the denominator shrinks, so the values grow without bound." },
          { t:"“Factor and cancel.”", why:M2C },
          { t:"“The limit is 4.”", why:"The denominator matters." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Why may you cancel `(x - 3)` in `{(x - 3)(x + 2)}/{x - 3}` when finding the limit as `x → 3`?", options:[
          { t:"“The limit uses only `x`-values near 3, never 3 itself, so `x - 3 ≠ 0` and `{x - 3}/{x - 3} = 1` there.”", ok:true, why:"`x + 2` equals the original only for `x ≠ 3`. The original is still undefined at 3; only the limit is 5." },
          { t:"“Because `{x - 3}/{x - 3} = 0`.”", why:"It equals 1 when `x ≠ 3`." },
          { t:"“Because the function is defined at `x = 3` after cancelling.”", why:"The original is still undefined at 3." },
          { t:"“Because any matching `x` terms cancel.”", why:"Only factors cancel." }] },
        b:{ prompt:"Why may you cancel `(x + 1)` in `{(x + 1)(x - 4)}/{x + 1}` when finding the limit as `x → -1`?", options:[
          { t:"“Near −1, but not at −1, `x + 1 ≠ 0`, so the factor equals 1 there.”", ok:true, why:"`x - 4` equals the original only for `x ≠ -1`. The original is still undefined at −1; only the limit is −5." },
          { t:"“Because `{x + 1}/{x + 1} = 0`.”", why:"It equals 1 when `x ≠ -1`." },
          { t:"“Because the function is then defined at −1.”", why:"The original is still undefined at −1." },
          { t:"“Because matching `x` terms cancel.”", why:"Only factors cancel." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A ball’s height is `s(t) = 20t - 5t^2` m. Its instantaneous velocity at `t = 1` is " + LIM("h → 0") + " `{s(1 + h) - s(1)}/{h}`. Evaluate it.", options:[
          { t:"10 m/s", ok:true, why:"`{10h - 5h^2}/{h} = 10 - 5h → 10`." },
          { t:"15 m/s", why:"`s(1) = 15` m is the height." },
          { t:"0 m/s", why:"0/0 isn’t 0." },
          { t:"20 m/s", why:"That’s the launch velocity at `t = 0`." }] },
        b:{ prompt:"`s(t) = 40t - 5t^2` m. Evaluate " + LIM("h → 0") + " `{s(2 + h) - s(2)}/{h}`.", options:[
          { t:"20 m/s", ok:true, why:"`{20h - 5h^2}/{h} = 40 - 20 - 5h → 20`." },
          { t:"60 m/s", why:"`s(2) = 60` m is the height." },
          { t:"0 m/s", why:"0/0 isn’t 0." },
          { t:"40 m/s", why:"That’s the launch velocity at `t = 0`." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A parking garage charges `C(t) = 4t` dollars for `t < 3` hours and `5 + 2t` dollars for `t ≥ 3`. What happens at `t = 3`?", options:[
          { t:"The left-hand limit is $12 and the right-hand limit is $11, so the charge jumps and " + LIM("t → 3") + " `C(t)` doesn’t exist.", ok:true, why:"Left: 4(3) = 12. Right: 5 + 2(3) = 11. The sides disagree." },
          { t:"The limit is $11, because `C(3) = 11`.", why:"`C(3)` is the value at 3. The limit needs both sides, and the left side heads to $12." },
          { t:"The limit is $12.", why:"That’s only the left side." },
          { t:"The limit is $11.50.", why:"Limits don’t average the sides." }] },
        b:{ prompt:"`C(t) = 6t` dollars for `t < 2` hours and `2 + 4t` dollars for `t ≥ 2`. What happens at `t = 2`?", options:[
          { t:"Left-hand limit $12, right-hand limit $10: the charge jumps, so no limit.", ok:true, why:"Left: 6(2) = 12. Right: 2 + 4(2) = 10. The sides disagree." },
          { t:"The limit is $10, because `C(2) = 10`.", why:"`C(2)` is the value at 2. The limit needs both sides, and the left side heads to $12." },
          { t:"The limit is $12.", why:"That’s only the left side." },
          { t:"The limit is $11.", why:"Limits don’t average the sides." }] } }
    ]
  },
  task:{
    title:"Design a fillable hole", summary:"Design a fillable hole",
    statement:"<p>Design `f(x) = {x^2 + bx + c}/{x - a}` that meets every condition. Can you find all the answers?</p><div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>Direct substitution at `x = a` gives 0/0.</li><li>" + LIM("x → a") + " `f(x) = 5`.</li><li>The graph crosses the `x`-axis at a negative `x`-value.</li><li>The hole is at a positive `x`-value.</li></ol></div><p class=\"tiny muted\">Choose whole numbers from −10 to 10 for `a`, `b` and `c`. The graph marks the hole, and the badge shows what direct substitution gives.</p>",
    checks:["Substitution gives 0/0", "The limit is 5", "Crosses the `x`-axis at a negative `x`", "Hole at a positive `x`"],
    tips:["For 0/0 the numerator must be 0 at `x = a`: `x - a` must be a factor.",
      "Write the numerator as `(x - a)(x - r)`. After cancelling, `f(x) = x - r`, so the limit is `a - r`.",
      "The graph crosses the axis at `x = r`; make `r` negative.",
      "The hole is at `x = a`; make `a` positive."],
    explainPrompt:"Explain why `(x - a)` must be a factor of the numerator, and how the limit is found once it cancels.",
    vocab:"Use the words indeterminate, factor, cancel and limit.",
    success:"Your function works!",
    more:"There’s more than one answer. Can you find them all?",
    after4:"Each has `r = a - 5`, so `a` must be between 1 and 4 for the hole to be right of the axis and the crossing left of it."
  },
  cards:[
    ["Limit laws", "Limits of sums, differences, constant multiples, products, quotients (non-zero denominator), powers and roots combine the same way."],
    ["Direct substitution", "Works for polynomials, and for rational functions where the denominator isn’t 0."],
    ["0/0", "Indeterminate: simplify first. The limit could be any number or not exist."],
    ["Nonzero/0", "The values grow without bound: no limit (a vertical asymptote)."],
    ["Factor and cancel", LIM("x → 3") + " `{x^2 - 9}/{x - 3} =` " + LIM("x → 3") + " `(x + 3) = 6`."],
    ["Rationalize", LIM("x → 4") + " `{√x - 2}/{x - 4} =` " + LIM("x → 4") + " `{1}/{√x + 2} = {1}/{4}`."],
    ["Common denominator", "Combine fractions in the numerator first, then cancel."],
    ["Change of variable", "`u = ∛x` turns `{∛x - 1}/{x - 1}` into `{u - 1}/{u^3 - 1}`."],
    ["Why cancelling is allowed", "The limit uses `x` near `a`, never `x = a`, so the cancelled factor isn’t 0."],
    ["`|x - a|`", "Equals `x - a` to the right of `a` and `a - x` to the left."],
    ["`{|x - 2|}/{x - 2}` at 2", "Left −1, right 1: no limit."],
    ["Piecewise limits", "Find each side with its own formula; the limit exists only if they agree."]
  ]
};
