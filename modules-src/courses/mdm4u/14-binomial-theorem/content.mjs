// MDM4U 14 The Binomial Theorem. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/14-binomial-theorem.md
// Core feedback sentences for the plan's misconceptions (§3), adapted to each item.
const M1 = "Everything inside the bracket gets the power.";
const M2 = (bin, neg, n) => "`" + bin + "` is `(" + bin.slice(1, bin.indexOf(" ")) + " + (" + neg + "))^" + n + "`: odd powers of " + neg.replace("-", "−") + " are negative.";
const M3 = (t, k) => "The " + t + " term is `t_{k + 1}` with `k = " + k + "`.";
const M4 = "Match the power you want to the right part first, then find `k`.";
const M5 = (bin, n) => "`" + bin + "^{" + n + "}` has `" + n + " + 1 = " + (n + 1) + "` terms: `k` runs from 0 to " + n + ".";
const M6 = "The middle terms come from mixed choices.";
const M7 = "Set `x = 1`. The sum of the coefficients of `(x + 2)^3` is `3^3 = 27`.";

// hero: the theorem, with C(n, k) linked by a line down to row n of a small Pascal's triangle
function heroMini(){
  const rows = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]];
  return '<span class="bt-hmini" aria-hidden="true">' + rows.map((row, n) => '<span class="bt-hmr' + (n === 4 ? " on" : "") + '">' +
    row.map((v, r) => '<span class="bt-hmc' + (n === 4 && r === 2 ? " k" : "") + '">' + v + "</span>").join("") +
    (n === 4 ? '<span class="bt-hmlab">row `n`</span>' : "") + "</span>").join("") + "</span>";
}

export default {
  id:"14-binomial-theorem",
  kind:"topic",
  title:"The binomial theorem",
  topic:"The Binomial Theorem",
  readyTopic:"the binomial theorem",
  hero:{
    eq:'<span class="bt-heq"><span class="bt-hl">`(@n{a} + @d{b})^n =`</span><span class="bt-sig"><span class="bt-sigt">`n`</span><span class="bt-sigs">Σ</span><span class="bt-sigb">`k = 0`</span></span>' +
      '<span class="bt-hc">`C(n, k)`</span><span class="bt-hr">`@n{a}^{n - k} @d{b}^k`</span>' +
      '<span class="bt-hline" aria-hidden="true"></span><span class="bt-htri">' + heroMini() + "</span></span>",
    eqLabel:"a plus b, to the power n, equals the sum from k equals 0 to n of C of n, k times a to the power n minus k times b to the power k. A line links C of n, k to row n of a small Pascal’s triangle.",
    eqSize:"sm",
    headline:"Choose `a` or `b` from every bracket",
    text:"To expand `(a + b)^n`, pick `a` or `b` from each of the `n` brackets. Every way to pick `k` `b`’s gives `a^{n - k}b^k`, and there are <strong>`C(n, k)`</strong> such ways. That’s the <strong>binomial theorem</strong>, and the coefficients are row `n` of <strong>Pascal’s triangle</strong>.",
    fig:{ html:'<div class="bt-h" role="img" aria-label="Three brackets, a plus b, appear. A pointer picks a or b from each bracket and writes the 8 words aaa, aab, aba, baa, abb, bab, bba, bbb. Words with the same letters slide into groups of 1, 3, 3 and 1, which become 1 a cubed, plus 3 a squared b, plus 3 a b squared, plus 1 b cubed, and row 3 of Pascal’s triangle lights up."><svg id="bt-h-svg" viewBox="0 0 400 340" aria-hidden="true" focusable="false"></svg></div>' }
  },
  goals:[
    "I can state how many terms `(a + b)^n` has and which row of Pascal’s triangle gives its coefficients.",
    "I can expand `(a + b)^n` for `n <= 6`, including when `a` or `b` has a coefficient or a negative sign.",
    "I can write the general term `t_{k + 1} = C(n, k) a^{n - k} b^k` and say which `k` gives a particular term.",
    "I can find the coefficient of a particular power of `x`, including a constant term.",
    "I can work backwards from a coefficient to find `n` or a missing constant.",
    "I can use the theorem in context: coin-toss probabilities and quick approximations."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Exponent laws", goal:2, prompt:"Simplify `(3x)^2`.",
          options:[
            { t:"`9x^2`", ok:true, why:"`3^2 × x^2`." },
            { t:"`3x^2`", why:"The 3 is squared too." },
            { t:"`6x^2`", why:"Squaring isn’t doubling." },
            { t:"`9x`", why:"The `x` is squared too: `x × x = x^2`." }],
          hints:["`(3x)^2 = (3x)(3x)`.", "3 × 3 and `x × x`.", "`9x^2`."] },
        { id:"w2", skill:"Exponent laws", goal:4, prompt:"Simplify `x^4 × (1/x)^2`.",
          options:[
            { t:"`x^2`", ok:true, why:"`x^4 × x^{-2} = x^2`." },
            { t:"`x^6`", why:"`1/x` is `x^{-1}`; the powers subtract." },
            { t:"`x^8`", why:"Powers multiply only when one power is raised to another." },
            { t:"1", why:"`x^4 ÷ x^2` is `x^2`." }],
          hints:["`1/x = x^{-1}`.", "`(x^{-1})^2 = x^{-2}`.", "`x^{4 - 2} = x^2`."] },
        { id:"w3", skill:"Expanding products", goal:2, prompt:"Expand `(x + 2)^2`.",
          options:[
            { t:"`x^2 + 4x + 4`", ok:true, why:"`x^2 + 2x + 2x + 4`." },
            { t:"`x^2 + 4`", why:"`(x + 2)^2 = x^2 + 4x + 4`, not `x^2 + 4`. " + M6 },
            { t:"`x^2 + 2x + 4`", why:"There are two middle terms: `2x + 2x`." },
            { t:"`2x + 4`", why:"`(x + 2)^2` isn’t `2(x + 2)`." }],
          hints:["`(x + 2)(x + 2)`.", "Four products: `x^2`, `2x`, `2x`, 4.", "`x^2 + 4x + 4`."] },
        { id:"w4", skill:"Expanding products", goal:2, prompt:"Expand `(x - 3)^2`.",
          options:[
            { t:"`x^2 - 6x + 9`", ok:true, why:"`x^2 - 3x - 3x + 9`." },
            { t:"`x^2 + 9`", why:"`(x - 3)^2` isn’t `x^2 + 9`. " + M6 },
            { t:"`x^2 - 6x - 9`", why:"`(-3)^2 = +9`." },
            { t:"`x^2 + 6x + 9`", why:"The middle term is `2(x)(-3)`." }],
          hints:["`(x - 3)(x - 3)`.", "`-3x - 3x = -6x`; `(-3)(-3) = 9`.", "`x^2 - 6x + 9`."] },
        { id:"w5", skill:"Pascal’s triangle", goal:1, prompt:"What is row 5 of Pascal’s triangle?",
          options:[
            { t:"1 5 10 10 5 1", ok:true, why:"Add neighbours in row 4 (1 4 6 4 1), with a 1 at each end." },
            { t:"1 4 6 4 1", why:"That’s row 4." },
            { t:"1 5 10 5 1", why:"Row 5 has 6 entries." },
            { t:"1 5 25 125", why:"These are powers of 5." }],
          hints:["Row 4 is 1 4 6 4 1.", "Add neighbours.", "1 5 10 10 5 1."] },
        { id:"w6", skill:"Pascal’s triangle", goal:3, prompt:"Evaluate `C(6, 4)`.",
          options:[
            { t:"15", ok:true, why:"`C(6, 4) = C(6, 2) = (6 × 5)/2 = 15`." },
            { t:"24", why:"That’s `4!`." },
            { t:"360", why:"That’s `P(6, 4)`." },
            { t:"6", why:"That’s `C(6, 1)`." }],
          hints:["`C(6, 4) = C(6, 2)`.", "6 × 5 ÷ 2.", "15."] }
      ],
      refreshers:{
        "Exponent laws":"`(ax)^n = a^n x^n`; `x^m × x^n = x^{m + n}`; `1/x = x^{-1}`.",
        "Expanding products":"Multiply every term by every term. `(x + 2)^2` has the middle terms `2x + 2x`.",
        "Pascal’s triangle":"Row `n` holds `C(n, 0) … C(n, n)`; each entry adds the two above."
      }
    }
  },
  explore:{
    heading:"Expansion builder",
    intro:"Pick a binomial and a power. Build the expansion bracket by bracket, then find any term in one step.",
    predIntro:"Make a prediction first. Then the expansion builder will show you what really happens.",
    predictions:[
      { id:"p1", start:{ bin:"ab", n:6, mode:"coef" },
        prompt:'<span class="bt-pctx">`(a + b)`, `n = 6`.</span> How many terms will the expansion have?',
        options:[{ t:"7", ok:true }, { t:"6" }, { t:"12" }, { t:"64" }],
        explain:"`k = 0, 1, …, 6`: seven terms." },
      { id:"p2", start:{ bin:"ab", n:4, mode:"words" },
        prompt:'<span class="bt-pctx">`(a + b)`, `n = 4`, Choice words mode.</span> How many words have exactly two `b`’s?',
        options:[{ t:"6", ok:true }, { t:"4" }, { t:"2" }, { t:"16" }],
        explain:"Choose which 2 of the 4 brackets give `b`: `C(4, 2) = 6`." },
      { id:"p3", start:{ bin:"x-1", n:5, mode:"coef" },
        prompt:'<span class="bt-pctx">`(x - 1)`, `n = 5`.</span> What is the sign of the `x^2` term?',
        options:[{ t:"Negative", ok:true }, { t:"Positive" }, { t:"There is no `x^2` term" }, { t:"It depends on `x`" }],
        explain:"`x^2` needs `k = 3`, and `(-1)^3 = -1`." },
      { id:"p4", start:{ bin:"x+2", n:3, mode:"coef" },
        prompt:'<span class="bt-pctx">`(x + 2)`, `n = 3`.</span> What is the sum of the coefficients?',
        options:[{ t:"27", ok:true }, { t:"8" }, { t:"9" }, { t:"6" }],
        explain:"Set `x = 1`: `(1 + 2)^3 = 27`. Only `(x + 1)^n` gives `2^n`." }
    ],
    chalIntro:"Set up the expansion builder, then press <strong>Check challenge</strong>. For challenges 2 and 3, type your answer in the boxes under the controls. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[4, 5], prompt:"With `n = 4`, choose a binomial `(x + b)` from the chips so that the `x^2` coefficient is <strong>24</strong>.",
        why:"`C(4, 2) × b^2 = 6b^2 = 24`, so `b^2 = 4`: both `(x + 2)^4` and `(x - 2)^4` work.",
        hints:["The `x^2` term needs `k = 2`.", "`C(4, 2) × b^2 = 6b^2 = 24`.", "`b^2 = 4`: `b = 2` or `-2`."] },
      { id:"tc2", goal:4, prompt:"In Term finder mode, find the coefficient of `x^3` in `(2x + 1)^5`. Type it.",
        why:"`k = 2`: `C(5, 2)(2x)^3(1)^2 = 10 × 8x^3 = 80x^3`.",
        hints:["`x^3` comes from `(2x)^3`, so `5 - k = 3`.", "`k = 2`: `C(5, 2)(2x)^3(1)^2`.", "10 × 8 = 80."] },
      { id:"tc3", goal:4, stretch:true, prompt:"Find the constant term of `(x^2 + 2/x)^6`. Type it.",
        why:"`k = 4`: `C(6, 4)(x^2)^2(2/x)^4 = 15 × 16 = 240`.",
        hints:["General term: `C(6, k)(x^2)^{6 - k}(2/x)^k = C(6, k) 2^k x^{12 - 3k}`.", "Constant means `12 - 3k = 0`, so `k = 4`.", "`C(6, 4) × 2^4 = 15 × 16 = 240`."] }
    ]
  },
  part3:{
    slug:"backwards", name:"Backwards",
    heading:"Working backwards",
    intro:"Run the theorem in reverse: find `n`, or a missing constant, from one coefficient. Then use the coefficients of `(H + T)^n` to count coin tosses.",
    stations:[
      { id:"s1", title:"Station 1: find `n`", ask:"In `(1 + x)^n`, the coefficient of `x^2` is 28. Find `n`.",
        how:"Move the `n` slider until the balance levels.",
        alg:["`C(n, 2) = {n(n - 1)}/{2} = 28`", "`n(n - 1) = 56`", "`n = 8` <small>(8 × 7 = 56)</small>"] },
      { id:"s2", title:"Station 2: find the missing constant", ask:"In `(1 + kx)^5`, the coefficient of `x^2` is 90. Find `k`.",
        how:"Move the `k` slider until the balance levels. Find every value that works.",
        alg:["`C(5, 2)k^2 = 10k^2 = 90`", "`k^2 = 9`", "`k = 3` or `k = -3`"] },
      { id:"s3", title:"Station 3: coins and the theorem", ask:"Write H for heads and T for tails. Tap a term of `(H + T)^4` to see the matching coin sequences.",
        alg:["Each of the `2^4 = 16` toss sequences is equally likely.", "`6H^2T^2`: 6 sequences have exactly 2 heads.", "`P`(exactly 2 heads in 4 fair tosses) `= 6/16 = 3/8 = 0.375`"] }
    ],
    quickCheck:{
      title:"Quick check", summary:"Backwards quick check",
      items:[
        { id:"q1", goal:5, prompt:"In `(1 + x)^n`, the coefficient of `x` is 9. Find `n`.",
          right:"Right. The `x` coefficient is `C(n, 1) = n`, so `n = 9`.", wrong:"The `x` coefficient is `C(n, 1) = n`.",
          choices:[{ t:"9", ok:true }, { t:"8" }, { t:"10" }, { t:"3" }] },
        { id:"q2", goal:4, prompt:"Coefficient of `x^2` in `(1 + 2x)^4`?",
          right:"Right. `C(4, 2) × 2^2 = 6 × 4 = 24`.", wrong:"`C(4, 2) × 2^2 = 6 × 4`.",
          choices:[{ t:"24", ok:true }, { t:"12" }, { t:"6" }, { t:"48" }] },
        { id:"q3", goal:3, prompt:"The 4th term of `(a + b)^7`?",
          right:"Right. 4th term: `k = 3`, so `C(7, 3)a^4b^3 = 35a^4b^3`.", wrong:"4th term: `k = 3`.",
          choices:[{ t:"`35a^4b^3`", ok:true }, { t:"`35a^3b^4`" }, { t:"`21a^5b^2`" }, { t:"`7a^6b`" }] },
        { id:"q4", goal:6, prompt:"`P`(exactly 3 heads in 5 fair tosses)?",
          right:"Right. `C(5, 3)/2^5 = 10/32 = 5/16`.", wrong:"`C(5, 3)/2^5 = 10/32`.",
          choices:[{ t:"`5/16`", ok:true }, { t:"`3/5`" }, { t:"`1/32`" }, { t:"`3/32`" }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"expand", type:"custom", title:"Expand it", summary:"Expand it", goal:[1, 2],
        instruction:"Type the coefficients of each expansion, from the highest power down.",
        how:"Type the coefficients separated by commas (for example 2, −5, 7), then press Check. Your expansion appears as you type.",
        items:[
          { id:"x1", goal:[1, 2], bin:"`(x + 1)^4`", first:{ c:1, p:1 }, second:{ c:1, p:0 }, n:4, answer:[1, 4, 6, 4, 1],
            wrong:[{ match:[1, 4, 4, 1], fb:"Five terms. " + M5("(x + 1)", 4) }],
            why:"Row 4 of Pascal’s triangle: 1 4 6 4 1.",
            hints:["Row 4 of Pascal’s triangle.", "There are 5 terms, from `x^4` down to the constant.", "1, 4, 6, 4, 1."] },
          { id:"x2", goal:2, bin:"`(x + 2)^3`", first:{ c:1, p:1 }, second:{ c:2, p:0 }, n:3, answer:[1, 6, 12, 8],
            wrong:[{ match:[1, 3, 3, 1], fb:"Multiply by powers of 2: 3 × 2, 3 × 4, 8." }],
            why:"Row 3 times powers of 2: 1, 3 × 2, 3 × 4, 8.",
            hints:["Row 3: 1 3 3 1.", "Multiply by `2^0`, `2^1`, `2^2`, `2^3`.", "1, 6, 12, 8."] },
          { id:"x3", goal:2, bin:"`(x - 1)^5`", first:{ c:1, p:1 }, second:{ c:-1, p:0 }, n:5, answer:[1, -5, 10, -10, 5, -1],
            wrong:[{ match:[1, 5, 10, 10, 5, 1], fb:M2("(x - 1)^5", "-1", 5) }],
            why:"Row 5 with alternating signs from `(-1)^k`.",
            hints:["Row 5: 1 5 10 10 5 1.", "Multiply by `(-1)^0`, `(-1)^1`, …, `(-1)^5`: the signs alternate.", "1, −5, 10, −10, 5, −1."] },
          { id:"x4", goal:2, bin:"`(2x + 1)^3`", first:{ c:2, p:1 }, second:{ c:1, p:0 }, n:3, answer:[8, 12, 6, 1],
            wrong:[{ match:[2, 3, 3, 1], fb:"`(2x)^3 = 8x^3`. " + M1 }],
            why:"`(2x)^3 = 8x^3`, `3(2x)^2 = 12x^2`, `3(2x) = 6x`, then 1.",
            hints:["Row 3: 1 3 3 1.", "Multiply by `2^3`, `2^2`, `2^1`, `2^0` (from `(2x)^{3 - k}`).", "8, 12, 6, 1."] },
          { id:"x5", goal:2, bin:"`(x - 3)^4`", first:{ c:1, p:1 }, second:{ c:-3, p:0 }, n:4, answer:[1, -12, 54, -108, 81],
            wrong:[{ match:[1, -12, 18, -12, 81], fb:"6 × (−3)² = 54 and 4 × (−3)³ = −108." }],
            why:"Row 4 times powers of −3: 1, −12, 54, −108, 81.",
            hints:["Row 4: 1 4 6 4 1.", "Multiply by `(-3)^0`, `(-3)^1`, …, `(-3)^4`.", "1, −12, 54, −108, 81."] },
          { id:"x6", goal:2, bin:"`(a + 2b)^4`", sym:true, first:{ c:1 }, second:{ c:2 }, n:4, answer:[1, 8, 24, 32, 16],
            note:"for `a^4`, `a^3b`, `a^2b^2`, `ab^3`, `b^4`",
            wrong:[{ match:[1, 4, 6, 4, 1], fb:"`(2b)^k` brings `2^k`. " + M1 }],
            why:"Row 4 times powers of 2, because `(2b)^k` brings `2^k`.",
            hints:["Row 4: 1 4 6 4 1.", "Multiply by `2^0`, `2^1`, …, `2^4` (from `(2b)^k`).", "1, 8, 24, 32, 16."] }
        ] },
      { id:"term", type:"numeric", title:"Find the term", summary:"Find the term", star:true, goal:[3, 4, 5, 6],
        instruction:"Find each coefficient or value. The ★ problems go beyond the usual questions; the last two are harder than the Final Check.",
        how:"Type a number, then press Check. If there’s more than one answer, separate them with commas.",
        items:[
          { id:"t1", goal:4, prompt:"Coefficient of `x^3` in `(x + 2)^5`.", answer:40, display:"40",
            why:"`x^3` needs `k = 2`: `C(5, 2) × 2^2 = 10 × 4 = 40`.",
            wrong:[{ match:20, fb:"`C(5, 2) × 2^2 = 10 × 4`." }, { match:10, fb:"Include `2^2`." }],
            hints:["`x^3` needs `5 - k = 3`, so `k = 2`.", "`C(5, 2) x^3 (2)^2`.", "10 × 4 = 40."] },
          { id:"t2", goal:4, prompt:"Coefficient of `x^2` in `(3x - 1)^4`.", answer:54, display:"54",
            why:"`k = 2`: `C(4, 2)(3x)^2(-1)^2 = 6 × 9x^2 × 1 = 54x^2`.",
            wrong:[{ match:6, fb:"`(3x)^2 = 9x^2`. " + M1 }, { match:-54, fb:"`(-1)^2 = +1`." }],
            hints:["`x^2` comes from `(3x)^2`, so `4 - k = 2` and `k = 2`.", "`C(4, 2)(3x)^2(-1)^2`.", "6 × 9 × 1 = 54."] },
          { id:"t3", goal:4, star:true, prompt:"Constant term of `(x + 1/x)^8`.", answer:70, display:"70",
            why:"Constant needs `8 - 2k = 0`, so `k = 4`: `C(8, 4) = 70`.",
            wrong:[{ match:56, fb:"Constant needs `8 - 2k = 0`, so `k = 4`: `C(8, 4) = 70`." }],
            hints:["General term: `C(8, k)x^{8 - k}(1/x)^k = C(8, k)x^{8 - 2k}`.", "Constant: `8 - 2k = 0`, so `k = 4`.", "`C(8, 4) = 70`."] },
          { id:"t4", goal:3, star:true, prompt:"The 3rd term of `(2x - 3)^5` (give the coefficient).", answer:720, display:"720",
            why:"The 3rd term has `k = 2`: `C(5, 2)(2x)^3(-3)^2 = 10 × 8 × 9 = 720`, so `t_3 = 720x^3`.",
            wrong:[{ match:-1080, fb:"The 3rd term has `k = 2`: `C(5, 2)(2x)^3(-3)^2 = 10 × 8 × 9`." }],
            hints:["3rd term: `k = 2`.", "`C(5, 2)(2x)^3(-3)^2`.", "10 × 8 × 9 = 720, so `720x^3`."] },
          { id:"t5", goal:5, star:true, prompt:"In `(1 + kx)^6` the coefficient of `x^2` is 60. Find every `k`.", answer:[2, -2], label:"`k =`", display:"`k = 2` or `k = -2`",
            why:"`C(6, 2)k^2 = 15k^2 = 60`, so `k^2 = 4` and `k = 2` or `k = -2`.",
            wrong:[{ match:[2], fb:"`k^2 = 4` has two solutions." }, { match:[-2], fb:"`k^2 = 4` has two solutions." }],
            hints:["The `x^2` term is `C(6, 2)(kx)^2`.", "`15k^2 = 60`, so `k^2 = 4`.", "`k = 2` or `k = -2`."] },
          { id:"t6", goal:6, star:true, prompt:"Use the first four terms of `(1 + 0.01)^5` to find `1.01^5` to 4 decimal places.", answer:1.051, display:"1.0510",
            why:"`1 + 0.05 + 0.001 + 0.00001 = 1.05101`, so `1.01^5 ≈ 1.0510`.",
            wrong:[{ match:1.05, fb:"Include `10(0.01)^2 = 0.001` and `10(0.01)^3 = 0.00001`." }, { match:1.05101, fb:"Round to 4 decimal places." }],
            hints:["`1 + 5(0.01) + 10(0.01)^2 + 10(0.01)^3`.", "1 + 0.05 + 0.001 + 0.00001.", "1.05101, so 1.0510."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Nnamdi", how:"", goal:[2, 3, 4],
        instruction:"Nnamdi made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Expand `(x - 2)^3`.",
            steps:["Row 3 of the triangle: 1 3 3 1.", "`x^3 + 3x^2(2) + 3x(2)^2 + (2)^3`.", "`= x^3 + 6x^2 + 12x + 8`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 simplifies step 2 correctly. The mistake is earlier."],
            fixes:[
              { t:"Use −2: `x^3 + 3x^2(-2) + 3x(-2)^2 + (-2)^3 = x^3 - 6x^2 + 12x - 8`.", ok:true, why:M2("(x - 2)^3", "-2", 3) },
              { t:"`x^3 - 8`.", why:"`(x - 2)^3` isn’t `x^3 - 8`. " + M6 },
              { t:"`x^3 - 6x^2 - 12x - 8`.", why:"`(-2)^2 = +4`." },
              { t:"Step 2 is correct.", why:"The second part is −2, not 2." }],
            hints:["What is the second part of the binomial?", "−2.", "Signs alternate: +, −, +, −."] },
          { id:"e2", goal:4, task:"Find the coefficient of `x^2` in `(2x + 1)^4`.",
            steps:["`x^2` needs `(2x)^2`, so `4 - k = 2` and `k = 2`.", "The term is `C(4, 2)(2x)^2(1)^2`.", "`= 6 × 2x^2 × 1 = 12x^2`."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"`(2x)^2 = 4x^2`, so `6 × 4x^2 = 24x^2`: the coefficient is 24.", ok:true, why:"`(2x)^2 = 2^2x^2 = 4x^2`. " + M1 },
              { t:"6.", why:"The `2^2` is missing." },
              { t:"48.", why:"`(2x)^2 = 4x^2`, not `8x^2`." },
              { t:"Step 3 is correct.", why:"The 2 is squared too." }],
            hints:["What is `(2x)^2`?", "`4x^2`.", "6 × 4 = 24."] },
          { id:"e3", goal:3, task:"Find the 4th term of `(a + b)^6`.",
            steps:["The 4th term has `k = 4`.", "`t = C(6, 4)a^2b^4 = 15a^2b^4`."],
            answer:0,
            stepFb:["", "Step 2 follows step 1. The mistake is earlier."],
            fixes:[
              { t:"The 4th term is `t_{k + 1}` with `k = 3`: `C(6, 3)a^3b^3 = 20a^3b^3`.", ok:true, why:M3("4th", 3) + " The 1st term has `k = 0`." },
              { t:"`k = 5`: `6ab^5`.", why:"That’s the 6th term." },
              { t:"`C(6, 4)a^4b^2 = 15a^4b^2`.", why:"Powers are swapped and `k` is still off." },
              { t:"Step 1 is correct.", why:"The 1st term has `k = 0`." }],
            hints:["Which `k` gives the 1st term?", "`k = 0`, so the 4th term has `k = 3`.", "`20a^3b^3`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the choice words: that the coefficients count words, or that they match the triangle?" },
      { id:"j2", q:"In your own words, explain why the coefficient of `a^{n - k}b^k` is `C(n, k)`." },
      { id:"j3", q:"Explain to a friend how to find the constant term of `(x + 2/x)^4`." },
      { id:"j4", q:"Which slip do you make most: signs, coefficients inside brackets, or the value of `k`? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"How many terms are in the expansion of `(x + y)^9`?", options:[
          { t:"10", ok:true, why:"`k = 0` to 9." },
          { t:"9", why:M5("(x + y)", 9) },
          { t:"18", why:"That’s 2 × 9." },
          { t:"512", why:"That’s the sum of the coefficients, `2^9`." }] },
        b:{ prompt:"How many terms are in the expansion of `(a + b)^12`?", options:[
          { t:"13", ok:true, why:"`k = 0` to 12." },
          { t:"12", why:M5("(a + b)", 12) },
          { t:"24", why:"2 × 12." },
          { t:"4096", why:"That’s `2^12`." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"Which are the coefficients of `(a + b)^5`?", options:[
          { t:"1 5 10 10 5 1", ok:true, why:"Row 5 of Pascal’s triangle." },
          { t:"1 4 6 4 1", why:"That’s row 4." },
          { t:"1 5 10 5 1", why:M5("(a + b)", 5) + " Row 5 has 6 entries." },
          { t:"1 5 25 125", why:"Those are powers of 5." }] },
        b:{ prompt:"Which are the coefficients of `(a + b)^6`?", options:[
          { t:"1 6 15 20 15 6 1", ok:true, why:"Row 6 of Pascal’s triangle." },
          { t:"1 5 10 10 5 1", why:"Row 5." },
          { t:"1 6 15 15 6 1", why:M5("(a + b)", 6) + " Row 6 has 7 entries." },
          { t:"1 6 36 216", why:"Powers of 6." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which is the general term `t_{k + 1}` of `(a + b)^n`?", options:[
          { t:"`C(n, k) a^{n - k} b^k`", ok:true, why:"Choose `b` from `k` of the `n` brackets and `a` from the other `n - k`." },
          { t:"`C(n, k) a^k b^k`", why:"The powers must add to `n`." },
          { t:"`P(n, k) a^{n - k} b^k`", why:"Order doesn’t matter in choosing brackets." },
          { t:"`C(n, k + 1) a^{n - k} b^k`", why:"The `k + 1` is the term number, not the bottom of `C`." }] },
        b:{ prompt:"Which is the term containing `b^3` in `(a + b)^7`?", options:[
          { t:"`35a^4b^3`", ok:true, why:"`k = 3`: `C(7, 3)a^4b^3`." },
          { t:"`35a^3b^4`", why:"Here `b` has power 4. " + M4 },
          { t:"`21a^4b^3`", why:"`C(7, 2) = 21`; you need `C(7, 3)`." },
          { t:"`7a^4b^3`", why:"`C(7, 1) = 7`." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"What is the coefficient of `x^3` in `(x + 3)^5`?", options:[
          { t:"90", ok:true, why:"`x^3` needs `k = 2`: `C(5, 2) × 3^2 = 10 × 9`." },
          { t:"10", why:"The `3^2` is missing. " + M1 },
          { t:"30", why:"`3^2 = 9`, not 3." },
          { t:"270", why:"`3^3` belongs to `x^2`, not `x^3`. " + M4 }] },
        b:{ prompt:"What is the coefficient of `x^2` in `(x + 2)^6`?", options:[
          { t:"240", ok:true, why:"`x^2` needs `k = 4`: `C(6, 4) × 2^4 = 15 × 16`." },
          { t:"15", why:"The `2^4` is missing. " + M1 },
          { t:"60", why:"`2^2` belongs to `x^4`, not `x^2`. " + M4 },
          { t:"960", why:"`2^6 = 64` isn’t part of this term." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"What is the coefficient of `x^2` in `(2x - 1)^5`?", options:[
          { t:"−40", ok:true, why:"`k = 3`: `C(5, 3)(2x)^2(-1)^3 = 10 × 4 × (-1)`." },
          { t:"40", why:"`(-1)^3 = -1`." },
          { t:"−20", why:"`(2x)^2 = 4x^2`." },
          { t:"−80", why:"`2^3` belongs to the `x^3` term." }] },
        b:{ prompt:"What is the coefficient of `x^3` in `(3x - 1)^4`?", options:[
          { t:"−108", ok:true, why:"`k = 1`: `C(4, 1)(3x)^3(-1) = 4 × 27 × (-1)`." },
          { t:"108", why:M2("(3x - 1)^4", "-1", 4) },
          { t:"−36", why:"`3^2` belongs to the `x^2` term." },
          { t:"−12", why:"`(3x)^3 = 27x^3`." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"What is the constant term of `(x + 2/x)^4`?", options:[
          { t:"24", ok:true, why:"Constant needs `4 - 2k = 0`, `k = 2`: `C(4, 2) × 2^2 = 24`." },
          { t:"6", why:"`(2/x)^2` brings `2^2 = 4`." },
          { t:"12", why:"`2^2 = 4`, not 2." },
          { t:"16", why:"That’s `2^4`, the last term’s coefficient." }] },
        b:{ prompt:"What is the constant term of `(x - 1/x)^6`?", options:[
          { t:"−20", ok:true, why:"`k = 3`: `C(6, 3)(-1)^3`." },
          { t:"20", why:"`(-1)^3 = -1`: odd powers of −1 are negative." },
          { t:"−15", why:"`C(6, 2)` gives `x^2`." },
          { t:"15", why:"Wrong `k` and sign." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why the coefficients of `(a + b)^n` come from Pascal’s triangle?", options:[
          { t:"Each term comes from choosing `a` or `b` in each of the `n` brackets. The number of ways to choose `b` from exactly `k` brackets is `C(n, k)`, which is entry `k` of row `n`.", ok:true, why:"It says where each coefficient comes from: counting the ways to choose brackets." },
          { t:"Because the triangle and the expansion both start with 1.", why:"True, but not a reason." },
          { t:"Because `(a + b)^n = a^n + b^n` plus some middle terms.", why:"`(a + b)^n` isn’t `a^n + b^n`, and this doesn’t explain the coefficients. " + M6 },
          { t:"Because each coefficient doubles.", why:"Coefficients don’t double; row sums do." }] },
        b:{ prompt:"Which is the best explanation of why the sum of the coefficients of `(x + 1)^n` is `2^n`?", options:[
          { t:"Substituting `x = 1` makes every term equal its coefficient, and `(1 + 1)^n = 2^n`.", ok:true, why:"Setting `x = 1` turns each term into its coefficient." },
          { t:"Every binomial’s coefficients add to `2^n`.", why:M7 },
          { t:"There are `2^n` terms.", why:"`(x + 1)^n` has `n + 1` terms: `k` runs from 0 to `n`." },
          { t:"The middle coefficient is `2^n`.", why:"The middle is much smaller." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which correctly gives the 3rd term of `(x + y)^8`?", options:[
          { t:"`t_3 = C(8, 2)x^6y^2 = 28x^6y^2`", ok:true, why:"The 3rd term has `k = 2`." },
          { t:"`t_3 = C(8, 3)x^5y^3 = 56x^5y^3`", why:M3("3rd", 2) },
          { t:"`t_3 = C(8, 2)x^2y^6 = 28x^2y^6`", why:"The power of `y` is `k = 2`, so `x` gets `8 - 2 = 6`. " + M4 },
          { t:"`t_3 = 28xy`", why:"The powers must add to 8." }] },
        b:{ prompt:"Which correctly gives the 5th term of `(a + b)^10`?", options:[
          { t:"`t_5 = C(10, 4)a^6b^4 = 210a^6b^4`", ok:true, why:"The 5th term has `k = 4`." },
          { t:"`t_5 = C(10, 5)a^5b^5 = 252a^5b^5`", why:M3("5th", 4) },
          { t:"`t_5 = C(10, 4)a^4b^6 = 210a^4b^6`", why:"The power of `b` is `k = 4`, so `a` gets `10 - 4 = 6`. " + M4 },
          { t:"`t_5 = 252a^6b^4`", why:"`C(10, 4) = 210`." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A fair coin is tossed 6 times. Using the expansion of `(H + T)^6`, what is the probability of exactly 4 heads?", options:[
          { t:"`15/64`", ok:true, why:"`C(6, 4)/2^6`." },
          { t:"`4/6`", why:"Outcomes aren’t “out of 6”." },
          { t:"`1/64`", why:"There are 15 sequences with 4 heads, not 1." },
          { t:"`6/64`", why:"`C(6, 1) = 6` counts exactly 1 head (or 5)." }] },
        b:{ prompt:"A fair coin is tossed 5 times. What is the probability of exactly 2 heads?", options:[
          { t:"`5/16`", ok:true, why:"`C(5, 2)/2^5 = 10/32`." },
          { t:"`2/5`", why:"Outcomes aren’t “out of 5”: there are `2^5 = 32` equally likely sequences." },
          { t:"`1/32`", why:"There are `C(5, 2) = 10` sequences with 2 heads, not 1." },
          { t:"`5/32`", why:"`C(5, 1) = 5` counts exactly 1 head." }] } },
      { id:"a2", cat:"A", goal:[5, 6],
        a:{ prompt:"Use the first three terms of `(1 + 0.02)^5` to estimate `1.02^5`.", options:[
          { t:"1.104", ok:true, why:"`1 + 5(0.02) + 10(0.02)^2 = 1 + 0.1 + 0.004`." },
          { t:"1.100", why:"That’s only two terms." },
          { t:"1.140", why:"`10(0.02)^2 = 0.004`, not 0.04." },
          { t:"1.0104", why:"The second term is `5(0.02) = 0.1`." }] },
        b:{ prompt:"Use the first three terms of `(1 + 0.03)^4` to estimate `1.03^4`.", options:[
          { t:"1.1254", ok:true, why:"`1 + 4(0.03) + 6(0.03)^2 = 1 + 0.12 + 0.0054`." },
          { t:"1.12", why:"Only two terms." },
          { t:"1.174", why:"`6(0.03)^2 = 0.0054`, not 0.054." },
          { t:"1.0354", why:"The second term is `4(0.03) = 0.12`." }] } }
    ]
  },
  task:{
    title:"Design a binomial", summary:"Design a binomial",
    statement:"<p>Build a binomial `(ax + b)^n` whose expansion meets every condition. Can you find all the answers?</p>" +
      '<ol class="bt-conds"><li>The coefficient of `x^2` is between 20 and 100.</li><li>The coefficient of `x` is negative.</li><li>The leading coefficient (of the highest power of `x`) is at most 16.</li></ol>',
    checks:["`x^2` coefficient 20–100", "`x` coefficient negative", "Leading coefficient ≤ 16"],
    tips:["The `x^2` term uses `ax` twice and `b` `(n - 2)` times.",
      "The `x` term uses `b` `(n - 1)` times: make that power odd with `b` negative.",
      "`a^n` grows fast: `2^4 = 16` is the most for `a = 2`."],
    explainPrompt:"Explain how you found the `x^2` and `x` coefficients without expanding everything, and why `n` had to be 4.",
    vocab:"Use the words general term, coefficient, k and sign.",
    more:"There’s more than one answer. Can you find them all?",
    afterAll:"Every answer has `n = 4`. The `x` term is negative only when `b` is negative and `n - 1` is odd (so `n` is even). Then `n = 2` makes the `x^2` coefficient too small, and `n = 6` fails line 1 or line 3."
  },
  cards:[
    ["Binomial theorem", "`(a + b)^n = Σ C(n, k) a^{n - k} b^k`, `k = 0` to `n`."],
    ["Number of terms", "`n + 1`."],
    ["Coefficients", "Row `n` of Pascal’s triangle."],
    ["General term", "`t_{k + 1} = C(n, k) a^{n - k} b^k`."],
    ["4th term", "`k = 3`."],
    ["`(2x)^3`", "`8x^3`: the coefficient is raised to the power too."],
    ["`(x - 2)^n`", "Use `b = -2`: signs alternate."],
    ["Term in `x^m`", "Set the power of `x` in the general term equal to `m`; solve for `k`."],
    ["Constant term", "Set the power of `x` to 0."],
    ["Sum of coefficients", "Substitute `x = 1`."],
    ["Coins", "`P`(`k` heads in `n` fair tosses) `= C(n, k)/2^n`."],
    ["(1 + small)`^n`", "A few terms give a good estimate: `1.02^5 ≈ 1.104`."]
  ]
};
