// MCV4U 01 Rationalizing Radical Expressions. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/01-rationalizing-radical-expressions.md
const M1 = "Multiply top and bottom by the radical or the conjugate, then simplify.";

export default {
  id:"01-rationalizing-radical-expressions",
  kind:"topic",
  title:"Rationalizing radical expressions",
  topic:"Rationalizing Radical Expressions",
  readyTopic:"rationalizing radical expressions",
  hero:{
    eq:"`{4}/{3 - √5} ×` <span class=\"rr-hl\">`{3 + √5}/{3 + √5}`</span> `= 3 + √5`",
    eqLabel:"4 over 3 minus root 5, times 3 plus root 5 over 3 plus root 5, equals 3 plus root 5",
    eqSize:"sm",
    headline:"Same value, better form",
    text:"To <strong>rationalize</strong> a denominator, multiply the top and bottom by the same expression, so the value doesn’t change but the radicals leave the denominator. For a binomial, that expression is the <strong>conjugate</strong>: `(a + √b)(a - √b) = a^2 - b`. In calculus you’ll often rationalize the <strong>numerator</strong> instead, to make an `h` cancel.",
    fig:{ html:'<div class="rr-hero" id="rr-hero"><p class="rr-hx" id="rr-hx" aria-hidden="true"></p><div class="rr-hg" id="rr-hg" aria-hidden="true"></div><p class="rr-hs" id="rr-hs" aria-hidden="true"></p><canvas class="plot nl" id="rr-hnl" role="img" aria-label="Number line from 0 to 6 with a dot at about 5.24. The dot never moves while the form changes."></canvas><p class="vh">Animation: 4 over (3 − √5) is multiplied by (3 + √5) over (3 + √5). The denominator expands into four tiles, 9, +3√5, −3√5 and −5; the two middle tiles cancel, leaving 9 − 5 = 4. The fraction becomes 4(3 + √5) over 4, then 3 + √5. The value stays about 5.24.</p></div>',
      caption:"" }
  },
  goals:[
    "I can simplify radicals and multiply radical expressions, including binomials.",
    "I can rationalize a denominator with one radical term, such as `{6}/{√3}` or `{10}/{3√5}`.",
    "I can rationalize a binomial denominator using its conjugate.",
    "I can rationalize a numerator and explain why this helps when `h` gets close to 0.",
    "I can explain why rationalizing doesn’t change an expression’s value."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Simplifying radicals", goal:1, prompt:"Simplify `√48`.",
          options:[
            { t:"`4√3`", ok:true, why:"48 = 16 × 3, and `√16 = 4`." },
            { t:"`2√12`", why:"`√12` still holds a perfect square: `2√12 = 4√3`." },
            { t:"`16√3`", why:"`√16 = 4`, not 16." },
            { t:"24", why:"24² = 576, not 48." }],
          hints:["Find the largest perfect square that divides 48.", "48 = 16 × 3.", "`√48 = √16 · √3 = 4√3`."] },
        { id:"w2", skill:"Simplifying radicals", goal:1, prompt:"Simplify `√50 + √18`.",
          options:[
            { t:"`8√2`", ok:true, why:"`5√2 + 3√2 = 8√2`." },
            { t:"`√68`", why:"`√50 + √18 ≈ 11.3`, but `√68 ≈ 8.2`." },
            { t:"`15√2`", why:"Like terms add: 5 + 3." },
            { t:"`8√4`", why:"Keep `√2`: `5√2 + 3√2 = 8√2`." }],
          hints:["Simplify each radical first.", "`√50 = 5√2` and `√18 = 3√2`.", "`8√2`."] },
        { id:"w3", skill:"Multiplying radicals", goal:1, prompt:"Expand `(3 + √2)(1 + √2)`.",
          options:[
            { t:"`5 + 4√2`", ok:true, why:"`3 + 3√2 + √2 + 2`." },
            { t:"5", why:"There are two middle terms: `3√2` and `√2`." },
            { t:"`5 + 3√2`", why:"`√2 · 1 = √2` also counts." },
            { t:"`7 + 4√2`", why:"`√2 · √2 = 2`." }],
          hints:["Multiply each term by each term (four products).", "3, `3√2`, `√2`, `√2 · √2`.", "`3 + 4√2 + 2 = 5 + 4√2`."] },
        { id:"w4", skill:"Multiplying radicals", goal:1, prompt:"Simplify `2√3 · 5√6`.",
          options:[
            { t:"`30√2`", ok:true, why:"`10√18 = 10 · 3√2`." },
            { t:"`10√18`", why:"`√18 = 3√2`." },
            { t:"21", why:"Multiply: 2 × 5 and `√3 · √6`." },
            { t:"`10√2`", why:"`√18 = √9 · √2 = 3√2`." }],
          hints:["Multiply numbers with numbers, roots with roots.", "`10√18`.", "`10 · 3√2 = 30√2`."] },
        { id:"w5", skill:"Difference of squares", goal:3, prompt:"Expand `(x - 5)(x + 5)`.",
          options:[
            { t:"`x^2 - 25`", ok:true, why:"The middle terms `-5x` and `+5x` cancel." },
            { t:"`x^2 - 10x - 25`", why:"`-5x + 5x = 0`." },
            { t:"`x^2 + 25`", why:"`(-5)(+5) = -25`." },
            { t:"`x^2 - 10`", why:"5 × 5 = 25." }],
          hints:["Expand all four products.", "`x^2 + 5x - 5x - 25`.", "`x^2 - 25`."] },
        { id:"w6", skill:"Difference of squares", goal:3, prompt:"Expand `(4 - √3)(4 + √3)`.",
          options:[
            { t:"13", ok:true, why:"16 − 3 = 13." },
            { t:"`16 - √3`", why:"`(√3)^2 = 3`." },
            { t:"19", why:"The product of conjugates is `a^2 - b`." },
            { t:"7", why:"`(√3)^2 = 3`, not 9." }],
          hints:["This is `(a - b)(a + b)` with `b = √3`.", "`a^2 - b^2 = 16 - (√3)^2`.", "16 − 3 = 13."] }
      ],
      refreshers:{
        "Simplifying radicals":"Pull out the largest perfect square: `√72 = √36 · √2 = 6√2`. Only like radicals add: `2√5 + 3√5 = 5√5`.",
        "Multiplying radicals":"`√a · √b = √{ab}`, and `√b · √b = b`. Expand binomials term by term: `(2 + √3)(1 + √3) = 2 + 2√3 + √3 + 3 = 5 + 3√3`.",
        "Difference of squares":"`(a - b)(a + b) = a^2 - b^2`. With a radical: `(5 + √2)(5 - √2) = 25 - 2 = 23`. No radical survives."
      }
    }
  },
  explore:{
    heading:"Conjugate machine",
    intro:"Pick an expression and a multiplier. Watch what happens to the denominator, and check that the value never moves.",
    predIntro:"Make a prediction first. Then the machine will show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Which multiplier removes the radical from the denominator of `{4}/{3 - √5}`?",
        options:[{ t:"`{3 + √5}/{3 + √5}`", ok:true }, { t:"`{3 - √5}/{3 - √5}`" }, { t:"`{√5}/{√5}`" }, { t:"`3 + √5` on the bottom only" }],
        explain:"Conjugates differ only in the middle sign, so their middle terms cancel. The area model shows 9, `+3√5`, `-3√5` and −5: the middle tiles cancel, leaving 9 − 5 = 4." },
      { id:"p2", prompt:"The machine shows `{6}/{√3}`. Now `√3` goes on the bottom only. What happens to the dot on the number line?",
        options:[{ t:"It moves: the value becomes 2 instead of `2√3`", ok:true }, { t:"It stays put" }, { t:"It moves to 6" }, { t:"It moves to 18" }],
        explain:"Multiplying only the bottom divides the value by `√3`. Multiplying top and bottom multiplies by 1. The dot jumps from about 3.46 to 2." },
      { id:"p3", prompt:"The area model will multiply `(3 + √5)(3 - √5)`. What is the product?",
        options:[{ t:"4", ok:true }, { t:"14" }, { t:"`9 - √5`" }, { t:"6" }],
        explain:"The tiles are 9, `+3√5`, `-3√5` and −5. 9 − 5 = 4. The radical squares to 5." },
      { id:"p4", prompt:"What does `{2}/{√7 + √5}` become once it’s rationalized?",
        options:[{ t:"`√7 - √5`", ok:true }, { t:"`{√7 - √5}/{6}`" }, { t:"`√7 + √5`" }, { t:"`{√3}/{3}`" }],
        explain:"`{2(√7 - √5)}/{7 - 5}`: the denominator is 7 − 5 = 2, which cancels the 2 on top. `{√3}/{3}` comes from adding under one root, `√7 + √5 = √12`, which is false." }
    ],
    chalIntro:"Set up the machine, write your final form in the boxes under it, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"Rationalize `{10}/{3√5}` and simplify fully. Write your final form in the boxes under the machine.",
        why:"× `{√5}/{√5}` gives `{10√5}/{3 · 5} = {10√5}/{15} = {2√5}/{3}`. The value never moved.",
        hints:["Only `√5` needs removing.", "× `{√5}/{√5}` gives `{10√5}/{3 · 5}`.", "`{10√5}/{15} = {2√5}/{3}`."] },
      { id:"tc2", goal:3, prompt:"Rationalize `{√3 + 1}/{√3 - 1}` and write it as `a + b√3`.",
        why:"Top: `(√3 + 1)^2 = 4 + 2√3`. Bottom: 3 − 1 = 2. So `{4 + 2√3}/{2} = 2 + √3`: `a = 2` and `b = 1`.",
        hints:["Multiply by the conjugate of the denominator, `{√3 + 1}/{√3 + 1}`.", "Top: `(√3 + 1)^2 = 4 + 2√3`. Bottom: 3 − 1 = 2.", "`{4 + 2√3}/{2} = 2 + √3`."] },
      { id:"tc3", goal:3, stretch:true, prompt:"Two-stage mode: rationalize `{1}/{1 + √2 + √3}`. Choose <strong>Two-stage</strong>, group the denominator, apply a multiplier, then a second one, and write your final form in the boxes.",
        why:"Both stages multiply by a form of 1, so the value never moved: `{1}/{1 + √2 + √3} = {2 + √2 - √6}/{4}`.",
        hints:["Treat `(1 + √2)` as one term. Its conjugate partner is `(1 + √2) - √3`.", "The denominator becomes `(1 + √2)^2 - 3 = 2√2`.", "`{1 + √2 - √3}/{2√2} × {√2}/{√2} = {√2 + 2 - √6}/{4}`."] }
    ]
  },
  part3:{
    slug:"numerator", name:"Numerator",
    heading:"Rationalize the numerator",
    intro:"Calculus needs the reverse move. When an `h` in the denominator is about to become 0, rationalizing the <strong>numerator</strong> makes it cancel. Work through the three stations, then try the quick check.",
    quickCheck:{
      title:"Quick check", summary:"Rationalize the numerator quick check",
      items:[
        { id:"q1", goal:4, prompt:"Rationalize the numerator of `{√{9 + h} - 3}/{h}`.",
          choices:[
            { t:"`{1}/{√{9 + h} + 3}`", ok:true, fb:"Right. The numerator becomes `(9 + h) - 9 = h`, which cancels the `h` below." },
            { t:"`{√{9 + h} + 3}/{h}`", fb:"The numerator becomes `(9 + h) - 9 = h`, which cancels the `h` below." },
            { t:"`{h}/{√{9 + h} + 3}`", fb:"The numerator becomes `(9 + h) - 9 = h`, which cancels the `h` below." },
            { t:"`{1}/{√{9 + h} - 3}`", fb:"The numerator becomes `(9 + h) - 9 = h`, which cancels the `h` below." }] },
        { id:"q2", goal:4, prompt:"So, as `h` gets close to 0, the value approaches …",
          choices:[
            { t:"`{1}/{6}`", ok:true, fb:"Right. Substitute `h = 0` into the new form: `{1}/{3 + 3} = {1}/{6}`." },
            { t:"0", fb:"Substitute `h = 0` into the new form: `{1}/{3 + 3}`." },
            { t:"`{1}/{3}`", fb:"Substitute `h = 0` into the new form: `{1}/{3 + 3}`." },
            { t:"nothing (it’s 0/0)", fb:"Substitute `h = 0` into the new form: `{1}/{3 + 3}`." }] },
        { id:"q3", goal:4, prompt:"Why may you cancel `h`?",
          choices:[
            { t:"Because `h ≠ 0` in the expression", ok:true, fb:"Right. The original is undefined at `h = 0`, so every `h` it uses is non-zero; `h/h = 1`." },
            { t:"Because `h` is small", fb:"The original is undefined at `h = 0`, so every `h` it uses is non-zero; `h/h = 1`." },
            { t:"Because `h = 0`", fb:"The original is undefined at `h = 0`, so every `h` it uses is non-zero; `h/h = 1`." },
            { t:"Because any `h` cancels", fb:"The original is undefined at `h = 0`, so every `h` it uses is non-zero; `h/h = 1`." }] },
        { id:"q4", goal:4, prompt:"`{√x - 5}/{x - 25}`, `x ≠ 25`, simplifies to …",
          choices:[
            { t:"`{1}/{√x + 5}`", ok:true, fb:"Right. `x - 25 = (√x - 5)(√x + 5)`, so `√x - 5` cancels." },
            { t:"`{1}/{√x - 5}`", fb:"`x - 25 = (√x - 5)(√x + 5)`." },
            { t:"`√x + 5`", fb:"`x - 25 = (√x - 5)(√x + 5)`." },
            { t:"`{1}/{10}`", fb:"`x - 25 = (√x - 5)(√x + 5)`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Expression ↔ rationalized form", summary:"Expression ↔ rationalized form", goal:[2, 3],
        instruction:"Match each expression with its rationalized form. Some forms on the right don’t match any expression.",
        leftTitle:"Expression", rightTitle:"Rationalized form",
        left:[
          { id:"l1", goal:2, t:"`{12}/{√6}`", why:"`{12√6}/{6} = 2√6`." },
          { id:"l2", goal:2, t:"`{3}/{2√3}`", why:"`{3√3}/{2 · 3} = {√3}/{2}`." },
          { id:"l3", goal:3, t:"`{1}/{√5 - 2}`", why:"`{√5 + 2}/{5 - 4} = √5 + 2`." },
          { id:"l4", goal:3, t:"`{6}/{3 + √3}`", why:"`{6(3 - √3)}/{9 - 3} = 3 - √3`." },
          { id:"l5", goal:3, t:"`{4}/{√6 - √2}`", why:"`{4(√6 + √2)}/{6 - 2} = √6 + √2`." },
          { id:"l6", goal:3, t:"`{√2 + 1}/{√2 - 1}`", why:"`{(√2 + 1)^2}/{2 - 1} = 3 + 2√2`." },
          { id:"l7", goal:3, t:"`{√3}/{√3 + 1}`", why:"`{√3(√3 - 1)}/{3 - 1} = {3 - √3}/{2}`.",
            hints:["Conjugate of `√3 + 1`?", "`√3(√3 - 1) = 3 - √3`; denominator 3 − 1 = 2.", "`{3 - √3}/{2}`."] },
          { id:"l8", goal:2, t:"`{2√5}/{√10}`", why:"`{√5}/{√10} = {1}/{√2}`, so `{2√5}/{√10} = {2}/{√2} = √2`.",
            hints:["Can you simplify before rationalizing?", "`{√5}/{√10} = √{1/2}`.", "`{2}/{√2} = √2`."] }
        ],
        right:[
          { id:"r1", t:"`2√6`" }, { id:"r2", t:"`{√3}/{2}`" }, { id:"r3", t:"`√5 + 2`" }, { id:"r4", t:"`3 - √3`" },
          { id:"r5", t:"`√6 + √2`" }, { id:"r6", t:"`3 + 2√2`" }, { id:"r7", t:"`{3 - √3}/{2}`" }, { id:"r8", t:"`√2`" },
          { id:"d1", t:"`√5 - 2`" }, { id:"d2", t:"`3 + √3`" }, { id:"d3", t:"3" }, { id:"d4", t:"`2√2`" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l3|d1":"Multiply by the conjugate, `√5 + 2`; the denominator is 5 − 4 = 1.",
          "l4|d2":"The conjugate of `3 + √3` is `3 - √3`, and `6/(9 - 3) = 1`.",
          "l6|d3":"`(√2 + 1)^2 = 3 + 2√2`: don’t drop the middle term.",
          "l8|d4":"Simplify first: `{√5}/{√10} = {1}/{√2}`."
        },
        wrongDefault:M1 },
      { id:"rsimp", type:"custom", title:"Rationalize and simplify", summary:"Rationalize and simplify", star:true, goal:[1, 2, 3, 4],
        instruction:"Rationalize each expression and simplify it fully. Build your answer in the boxes.",
        how:"Type whole numbers or fractions in the boxes; a box in front of √ can stay empty for 1, or hold − for −1. Leave the box after √ empty for a term with no root. Use <strong>+ term</strong> for more terms, and type a negative number for a minus sign.",
        items:[
          { id:"r1", goal:2, frame:"surd", prompt:"`{15}/{√5}`", answer:"3√5",
            why:"`{15√5}/{5} = 3√5`.",
            wrong:[{ form:"15√5", fb:"Divide by 5: `√5 · √5 = 5` is on the bottom." }],
            hints:["Multiply the top and bottom by `√5`.", "`{15}/{√5} × {√5}/{√5} = {15√5}/{5}`.", "`{15√5}/{5} = 3√5`."] },
          { id:"r2", goal:3, frame:"surd", prompt:"`{√6 - √2}/{√6 + √2}`", answer:"2 − √3",
            why:"`{(√6 - √2)^2}/{6 - 2} = {8 - 4√3}/{4} = 2 - √3`.",
            wrong:[{ form:"8 − 4√3", fb:"Divide by 6 − 2 = 4." }, { form:"(8 − 4√3)/8", fb:"`(√6)^2 - (√2)^2 = 4`, not 8." }],
            hints:["Multiply by the conjugate of the denominator, `{√6 - √2}/{√6 - √2}`.", "Top: `(√6 - √2)^2 = 6 - 2√12 + 2 = 8 - 4√3`. Bottom: 6 − 2 = 4.", "`{8 - 4√3}/{4} = 2 - √3`."] },
          { id:"r3", goal:2, star:true, frame:"surd", cube:true, prompt:"`{1}/{∛2}` (transfer: a cube root)", answer:"∛4/2",
            why:"`{1}/{∛2} × {∛4}/{∛4} = {∛4}/{∛8} = {∛4}/{2}`.",
            wrong:[{ form:"√2/2", fb:"That’s for a square root. You need `∛2 · ∛4 = ∛8 = 2`." }],
            hints:["What times `∛2` gives a perfect cube?", "`∛2 · ∛4 = ∛8`.", "`{∛4}/{2}`."] },
          { id:"r4", goal:4, star:true, frame:"r4", prompt:"Rationalize the <strong>numerator</strong>: `{√{x + 3} - √x}/{3}`", answer:"+",
            why:"`{(x + 3) - x}/{3(√{x + 3} + √x)} = {3}/{3(√{x + 3} + √x)} = {1}/{√{x + 3} + √x}`.",
            wrong:[{ sign:"−", fb:"Multiply by the conjugate, with a plus sign." }],
            hints:["Multiply the top and bottom by `√{x + 3} + √x`.", "The top becomes `(x + 3) - x = 3`.", "`{3}/{3(√{x + 3} + √x)} = {1}/{√{x + 3} + √x}`."] },
          { id:"r5", goal:[1, 3], star:true, frame:"surd", prompt:"`{2}/{√2 + √3 - 1}`", answer:"(√2 + √6 − 2)/2",
            why:"`(√2 + √3)^2 - 1 = 4 + 2√6`, and `(4 + 2√6)(4 - 2√6) = 16 - 24 = -8`. The result is `{√2 + √6 - 2}/{2}`.",
            wrong:[{ denLike:"2 + √6", fb:"One more stage: multiply by `4 - 2√6`." }],
            hints:["Group as `(√2 + √3) - 1` and multiply by `(√2 + √3) + 1`.", "The denominator becomes `(√2 + √3)^2 - 1 = 4 + 2√6`; multiply by `4 - 2√6` next.", "`(4 + 2√6)(4 - 2√6) = 16 - 24 = -8`; the result is `{√2 + √6 - 2}/{2}`."] },
          { id:"r6", goal:4, star:true, frame:"num", prompt:"As `x → 4`, what value does `{√{x + 5} - 3}/{x - 4}` approach?", answer:"1/6",
            why:"`{1}/{√{x + 5} + 3} → {1}/{3 + 3} = {1}/{6}`.",
            wrong:[{ form:"0", fb:"0/0 isn’t 0. Rationalize the numerator first." }],
            hints:["Multiply top and bottom by `√{x + 5} + 3`.", "The numerator becomes `x + 5 - 9 = x - 4`, which cancels.", "`{1}/{√{x + 5} + 3} → {1}/{3 + 3} = {1}/{6}`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Aiden", how:"", goal:[3, 4],
        instruction:"Aiden made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Rationalize `{6}/{2 + √3}`.",
            steps:["Multiply the numerator and denominator by `2 - √3`.", "Numerator: `6(2 - √3) = 12 - 6√3`.", "Denominator: `(2 + √3)(2 - √3) = 4 + 3 = 7`.", "Answer: `{12 - 6√3}/{7}`."],
            answer:2,
            stepFb:["Step 1 is correct: that’s the conjugate. Keep checking.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"`(2)^2 - (√3)^2 = 4 - 3 = 1`, so the answer is `12 - 6√3`.", ok:true, why:"Conjugates give `a^2 - b`: the radical squares to 3, and the sign is minus." },
              { t:"`4 - √3`.", why:"`(√3)^2 = 3`." },
              { t:"4 − 9 = −5.", why:"`(√3)^2` is 3, not 9." },
              { t:"Step 3 is correct.", why:"Conjugates give `a^2 - b`: the sign is minus." }],
            hints:["Check the sign in `(a + b)(a - b)`.", "It’s `a^2 - b^2`.", "4 − 3 = 1."] },
          { id:"e2", goal:4, task:"Simplify `{√{25 + h} - 5}/{h}` so it can be evaluated at `h = 0`.",
            steps:["`√{25 + h} = √25 + √h = 5 + √h`.", "So the numerator is `5 + √h - 5 = √h`.", "`{√h}/{h} = {1}/{√h}`.", "As `h → 0` this grows without bound."],
            answer:0,
            stepFb:["", "Step 2 follows step 1. The mistake is earlier.", "Step 3 is correct algebra, but it starts from a false line.", "Step 4 follows. Look earlier."],
            fixes:[
              { t:"A root doesn’t split over a sum. Multiply top and bottom by `√{25 + h} + 5` to get `{1}/{√{25 + h} + 5}`, which approaches `{1}/{10}`.", ok:true, why:"Try `√{9 + 16}`: it’s `√25 = 5`, not 3 + 4. A root doesn’t split over + or −." },
              { t:"`√{25 + h} = 25 + √h`.", why:"Try `h = 0`: `√25 = 5`, not 25. A root doesn’t split over a sum." },
              { t:"`√{25 + h} = 5h`.", why:"Try `h = 0`: `√25 = 5`, not 0. A root doesn’t split over a sum." },
              { t:"Step 1 is correct.", why:"Try `h = 11`: `√36 = 6`, but `5 + √11` is more than 8." }],
            hints:["Is `√{9 + 16}` equal to 3 + 4?", "No: `√25 = 5`. So step 1 is false.", "Rationalize the numerator instead: `{1}/{10}`."] },
          { id:"e3", goal:3, task:"Rationalize `{√5 + √2}/{√5 - √2}`.",
            steps:["Multiply the top and bottom by `√5 + √2`.", "Denominator: 5 − 2 = 3.", "Numerator: `(√5 + √2)^2 = 5 + 2 = 7`.", "Answer: `{7}/{3}`."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"`(√5 + √2)^2 = 5 + 2√10 + 2 = 7 + 2√10`, so the answer is `{7 + 2√10}/{3}`.", ok:true, why:"Squaring a sum gives three terms: the middle term is `2√5√2 = 2√10`." },
              { t:"`(√5 + √2)^2 = 10`.", why:"Expand `(√5 + √2)(√5 + √2)`: 5 + 2 plus two middle terms, not 10." },
              { t:"`(√5 + √2)^2 = 7 + √10`.", why:"The middle term is `2√5√2 = 2√10`." },
              { t:"Step 3 is correct.", why:"Squaring a sum gives three terms." }],
            hints:["Expand `(√5 + √2)(√5 + √2)` fully.", "There are two middle terms, each `√10`.", "`7 + 2√10`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the conjugate machine: the middle tiles cancelling, or the dot never moving?" },
      { id:"j2", q:"In your own words, why doesn’t rationalizing change an expression’s value?" },
      { id:"j3", q:"Explain to a friend how to pick the multiplier for a binomial denominator." },
      { id:"j4", q:"Rationalizing the numerator felt backwards at first. Does it make sense now? What would help?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"Rationalize `{14}/{√7}`.", options:[
          { t:"`2√7`", ok:true, why:"`{14√7}/{7} = 2√7`." },
          { t:"`14√7`", why:"The bottom became 7; divide by it." },
          { t:"`√2`", why:"That’s `√{14/7}`, not `{14}/{√7}`." },
          { t:"2", why:"`{14}/{√7} ≈ 5.3`, not 2: `√7` doesn’t cancel like that." }] },
        b:{ prompt:"Rationalize `{12}/{√6}`.", options:[
          { t:"`2√6`", ok:true, why:"`{12√6}/{6} = 2√6`." },
          { t:"`12√6`", why:"The bottom became 6; divide by it." },
          { t:"`√2`", why:"`√{12/6}` isn’t `{12}/{√6}`." },
          { t:"2", why:"`{12}/{√6} ≈ 4.9`." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Rationalize `{3}/{4 - √7}`.", options:[
          { t:"`{4 + √7}/{3}`", ok:true, why:"`{3(4 + √7)}/{16 - 7} = {3(4 + √7)}/{9}`." },
          { t:"`{12 + 3√7}/{23}`", why:"16 + 7: conjugates give `a^2 - b`." },
          { t:"`{4 - √7}/{3}`", why:"The conjugate of `4 - √7` is `4 + √7`." },
          { t:"`{12 + 3√7}/{16 - √7}`", why:"`(√7)^2 = 7`." }] },
        b:{ prompt:"Rationalize `{4}/{5 - √21}`.", options:[
          { t:"`5 + √21`", ok:true, why:"`{4(5 + √21)}/{25 - 21}`." },
          { t:"`{10 + 2√21}/{23}`", why:"25 + 21: conjugates give `a^2 - b`." },
          { t:"`5 - √21`", why:"The conjugate of `5 - √21` is `5 + √21`." },
          { t:"`{20 + 4√21}/{25 - √21}`", why:"`(√21)^2 = 21`." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"Expand `(2√3 - 1)(2√3 + 1)`.", options:[
          { t:"11", ok:true, why:"`(2√3)^2 - 1 = 12 - 1`." },
          { t:"5", why:"`(2√3)^2 = 4 × 3 = 12`, not 6." },
          { t:"13", why:"The product of conjugates subtracts." },
          { t:"`11 + 4√3`", why:"The middle terms cancel." }] },
        b:{ prompt:"Expand `(3√2 + 4)(3√2 - 4)`.", options:[
          { t:"2", ok:true, why:"18 − 16." },
          { t:"−10", why:"`(3√2)^2 = 9 × 2 = 18`, not 6." },
          { t:"34", why:"The product of conjugates subtracts." },
          { t:"`2 + 24√2`", why:"The middle terms cancel." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Write `{√6 + 2}/{√6 - 2}` in the form `a + b√6`.", options:[
          { t:"`5 + 2√6`", ok:true, why:"`{(√6 + 2)^2}/{6 - 4} = {10 + 4√6}/{2}`." },
          { t:"`10 + 4√6`", why:"Divide by the denominator, 6 − 4 = 2." },
          { t:"5", why:"`(√6 + 2)^2` has a middle term, `4√6`." },
          { t:"`1 + {2√6}/{5}`", why:"The denominator is 6 − 4, not 6 + 4." }] },
        b:{ prompt:"Write `{√11 + 3}/{√11 - 3}` in the form `a + b√11`.", options:[
          { t:"`10 + 3√11`", ok:true, why:"`{20 + 6√11}/{2}`." },
          { t:"`20 + 6√11`", why:"Divide by 11 − 9 = 2." },
          { t:"10", why:"`(√11 + 3)^2` has a middle term, `6√11`." },
          { t:"`1 + {3√11}/{10}`", why:"The denominator is 11 − 9, not 11 + 9." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"What value does `{√{x + 1} - 2}/{x - 3}` approach as `x` gets close to 3?", options:[
          { t:"`{1}/{4}`", ok:true, why:"Rationalizing gives `{1}/{√{x + 1} + 2}`, which approaches `{1}/{2 + 2}`." },
          { t:"0", why:"0/0 isn’t 0; simplify first." },
          { t:"4", why:"The fraction is flipped: it’s `{1}/{√4 + 2}`." },
          { t:"No value: it’s 0/0", why:"0/0 means ‘simplify first’, not ‘no value’." }] },
        b:{ prompt:"What value does `{√{x + 4} - 3}/{x - 5}` approach as `x` gets close to 5?", options:[
          { t:"`{1}/{6}`", ok:true, why:"Rationalizing gives `{1}/{√{x + 4} + 3}`, which approaches `{1}/{3 + 3}`." },
          { t:"0", why:"0/0 isn’t 0; simplify first." },
          { t:"6", why:"The fraction is flipped: it’s `{1}/{√9 + 3}`." },
          { t:"No value: it’s 0/0", why:"0/0 means ‘simplify first’, not ‘no value’." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"Rationalize `{6}/{∛9}`.", options:[
          { t:"`2∛3`", ok:true, why:"× `{∛3}/{∛3}`: `∛27 = 3`, so `{6∛3}/{3}`." },
          { t:"`{2∛9}/{3}`", why:"`∛9 · ∛9 = ∛81`, which isn’t a whole number. You need `∛3`." },
          { t:"`2√3`", why:"These are cube roots, not square roots." },
          { t:"`6∛3`", why:"The bottom became 3; divide by it." }] },
        b:{ prompt:"Rationalize `{10}/{∛4}`.", options:[
          { t:"`5∛2`", ok:true, why:"× `{∛2}/{∛2}`: `∛8 = 2`." },
          { t:"`{5∛4}/{2}`", why:"`∛4 · ∛4 = ∛16` isn’t whole." },
          { t:"`5√2`", why:"Cube roots, not square roots." },
          { t:"`10∛2`", why:"The bottom became 2; divide by it." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the best explanation of why multiplying `{5}/{√2}` by `{√2}/{√2}` is allowed?", options:[
          { t:"“`{√2}/{√2}` equals 1, so the value doesn’t change; only the form changes, to `{5√2}/{2}`.”", ok:true, why:"Multiplying by a form of 1 keeps the value and changes only the form." },
          { t:"“You may multiply the bottom of a fraction by anything.”", why:"Multiplying only the bottom changes the value." },
          { t:"“It makes the number smaller, which is simpler.”", why:"The value stays the same." },
          { t:"“Because `√2 · √2 = 4` is a whole number.”", why:"`√2 · √2 = 2`." }] },
        b:{ prompt:"Which is the best explanation of why multiplying `{√7 - 2}/{3}` by `{√7 + 2}/{√7 + 2}` is allowed?", options:[
          { t:"“`{√7 + 2}/{√7 + 2}` equals 1, so the value is unchanged; it rewrites the numerator as `{3}/{3(√7 + 2)} = {1}/{√7 + 2}`.”", ok:true, why:"It’s a form of 1, so only the form changes." },
          { t:"“You may multiply the top of a fraction by anything.”", why:"Multiplying only the top changes the value." },
          { t:"“It always makes the expression larger.”", why:"The value doesn’t change." },
          { t:"“Because the conjugate cancels the 3.”", why:"The 3 cancels only after expanding `(√7)^2 - 4 = 3`." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Why does rationalizing the numerator of `{√{4 + h} - 2}/{h}` help when `h` is close to 0?", options:[
          { t:"“The numerator becomes `h`, which cancels the `h` below (`h ≠ 0`). The new form `{1}/{√{4 + h} + 2}` can be evaluated at `h = 0`, giving `{1}/{4}`.”", ok:true, why:"The new form has no 0/0 problem at `h = 0`." },
          { t:"“It makes the denominator rational, which is always required.”", why:"Here the denominator is `h`, already rational; the problem is that it becomes 0." },
          { t:"“It makes the expression equal 0 at `h = 0`.”", why:"The new form gives `{1}/{4}`, not 0." },
          { t:"“It lets you substitute `h = 0` into the original form.”", why:"The original form is still 0/0 at `h = 0`." }] },
        b:{ prompt:"Why does rationalizing the numerator of `{√{9 + h} - 3}/{h}` help when `h` is close to 0?", options:[
          { t:"“The numerator becomes `h`, which cancels (`h ≠ 0`), leaving `{1}/{√{9 + h} + 3}`, which equals `{1}/{6}` at `h = 0`.”", ok:true, why:"The new form has no 0/0 problem at `h = 0`." },
          { t:"“It makes the denominator rational.”", why:"Here the denominator is `h`, already rational; the problem is that it becomes 0." },
          { t:"“It makes the expression equal 0 at `h = 0`.”", why:"The new form gives `{1}/{6}`, not 0." },
          { t:"“It lets you substitute `h = 0` into the original form.”", why:"The original form is still 0/0 at `h = 0`." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A stone dropped from a height of `d` metres takes `t = √{d/5}` seconds to land. As the height changes from 20 m to (20 + `h`) m, the fall time changes at an average rate of `{√{(20 + h)/5} - 2}/{h}` seconds per metre. What value does this approach as `h → 0`?", options:[
          { t:"`{1}/{20}` s per m", ok:true, why:"`√{(20 + h)/5} = √{4 + h/5}`. Rationalizing gives `{1/5}/{√{4 + h/5} + 2}`, which approaches `{1/5}/{4} = {1}/{20}`." },
          { t:"`{1}/{4}` s per m", why:"The numerator becomes `h/5`, not `h`: keep the 1/5." },
          { t:"0 s per m", why:"0/0 isn’t 0." },
          { t:"`{1}/{10}` s per m", why:"The denominator approaches 2 + 2 = 4, not 2." }] },
        b:{ prompt:"Same rule, `t = √{d/5}`. As the height changes from 45 m to (45 + `h`) m, the average rate is `{√{(45 + h)/5} - 3}/{h}` s per m. What does it approach as `h → 0`?", options:[
          { t:"`{1}/{30}` s per m", ok:true, why:"`{1/5}/{3 + 3} = {1}/{30}`." },
          { t:"`{1}/{6}` s per m", why:"Keep the 1/5." },
          { t:"0 s per m", why:"0/0 isn’t 0." },
          { t:"`{1}/{15}` s per m", why:"The denominator approaches 3 + 3 = 6." }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"A rectangle has an area of 4 m² and a width of (`√5 + 1`) m. What is its length, in simplest form?", options:[
          { t:"(`√5 - 1`) m", ok:true, why:"`{4}/{√5 + 1} = {4(√5 - 1)}/{5 - 1}`." },
          { t:"`{2√5 - 2}/{3}` m", why:"The denominator is 5 − 1, not 5 + 1." },
          { t:"(`4√5 - 4`) m", why:"Divide by the denominator, 4." },
          { t:"`{4}/{√6}` m", why:"`√5 + 1` isn’t `√6`." }] },
        b:{ prompt:"A rectangle has an area of 6 m² and a width of (`3 + √3`) m. What is its length?", options:[
          { t:"(`3 - √3`) m", ok:true, why:"`{6(3 - √3)}/{9 - 3}`." },
          { t:"`{3 - √3}/{2}` m", why:"9 − 3, not 9 + 3." },
          { t:"(`18 - 6√3`) m", why:"Divide by 6." },
          { t:"`√3` m", why:"`3 + √3` isn’t `√12`." }] } }
    ]
  },
  task:{
    title:"Make the `h` cancel", summary:"Make the h cancel",
    statement:"<p>Design an expression `{√{k + mh} - r}/{h}` that meets every condition. Can you find all the answers?</p><div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>Rationalizing the numerator turns it into a multiple of `h`.</li><li>As `h → 0`, the expression approaches `{1}/{4}`.</li><li>`m` is at least 2 (so it isn’t the Part 3 example).</li></ol></div><p class=\"tiny muted\">Choose whole numbers: `k` from 1 to 100, `m` from 1 to 9 and `r` from 1 to 9. The table and the graph against `h` update as you type.</p>",
    checks:["Rationalizing gives a multiple of `h`", "Approaches `{1}/{4}` as `h → 0`", "`m` is at least 2"],
    tips:["Rationalize: the numerator becomes `k + mh - r^2`. For only `h`-terms to remain, the constant part must be 0.",
      "After cancelling, the expression is `{m}/{√{k + mh} + r}`, which approaches `{m}/{2r}`. Make that `{1}/{4}`.",
      "`m = 1` gives the Part 3 example. Try a larger `m`."],
    explainPrompt:"Explain why `k` must equal `r^2`, and how you chose `m` once `r` was fixed.",
    vocab:"Use the words conjugate, numerator, cancel and approaches.",
    success:"Your expression works!",
    more:"There’s more than one answer. Can you find them all?",
    after3:"`r = 2m` and `k = r^2`. The next one, (100, 5, 10), needs `r = 10`, which is outside the range."
  },
  cards:[
    ["Rationalize", "Rewrite so no radical is in the denominator (or numerator, when asked), without changing the value."],
    ["Multiply by 1", "`{√3}/{√3}` or `{2 + √5}/{2 + √5}` equals 1, so the value is unchanged."],
    ["`√b · √b`", "`b`. Example: `√7 · √7 = 7`."],
    ["Conjugate", "`a + √b` and `a - √b`: same terms, opposite middle sign."],
    ["Conjugate product", "`(a + √b)(a - √b) = a^2 - b`."],
    ["`{6}/{√3}`", "`{6√3}/{3} = 2√3`."],
    ["`{1}/{√5 - 2}`", "`{√5 + 2}/{5 - 4} = √5 + 2`."],
    ["`√{a + b}`", "Not `√a + √b`: `√{9 + 16} = 5`, not 7."],
    ["Rationalize the numerator", "`{√{4 + h} - 2}/{h} = {1}/{√{4 + h} + 2}` for `h ≠ 0`."],
    ["Why calculus needs it", "The new form can be evaluated at `h = 0`, so the 0/0 problem disappears."],
    ["Cube root denominators", "Multiply to make a perfect cube: `{1}/{∛2} = {∛4}/{2}`."]
  ]
};
