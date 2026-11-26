// MHF4U 41 Product and Quotient Laws. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/41-product-and-quotient-laws.md
const B = "@b{b}";                    // the base, in brown (colour key: --p-b)
const LB = "log_{@b{b}}";             // log with a brown b subscript
const law = (s) => "`" + s + "`";

export default {
  id:"41-product-and-quotient-laws",
  kind:"topic",
  title:"Product and quotient laws",
  topic:"Product and Quotient Laws",
  readyTopic:"the product and quotient laws",
  hero:{
    eq:"`" + LB + "(xy) = " + LB + " x + " + LB + " y`", eqLabel:"log base b of x y equals log base b of x plus log base b of y", eqSize:"md",
    headline:"Logs turn multiplying into adding",
    text:"A logarithm is an exponent, and exponents add when you multiply powers: `2^3 × 2^4 = 2^7`. So the logarithm of a product is the sum of the logarithms: `log_2(8 × 16) = log_2 8 + log_2 16 = 3 + 4 = 7`. This is the <strong>product law</strong>. Dividing subtracts exponents, which gives the <strong>quotient law</strong>: `" + LB + "(x/y) = " + LB + " x - " + LB + " y`. From the 1600s until pocket calculators arrived in the 1970s, engineers multiplied this way on a <strong>slide rule</strong>, by adding lengths.",
    fig:{ aria:"A log-scale ruler marked 1, 2, 4, 8, 16, 32, 64 and 128, equally spaced, over a base-2 length axis from 0 to 7. A bar of length 3 (log base 2 of 8) and a bar of length 4 (log base 2 of 16) end to end reach 128, which is 7 units: 2 cubed times 2 to the 4 equals 2 to the 7." }
  },
  goals:[
    "I can explain why `" + LB + "(xy) = " + LB + " x + " + LB + " y` and `" + LB + "(x/y) = " + LB + " x - " + LB + " y`, using the exponent laws and lengths on a log scale.",
    "I can expand the logarithm of a product or quotient into sums and differences, such as `log_2(8x/y) = 3 + log_2 x - log_2 y`.",
    "I can condense sums and differences of logarithms with the same base into a single logarithm, including terms with coefficients such as `2 log 5`.",
    "I can evaluate expressions such as `log_6 4 + log_6 9` without a calculator, and estimate logs from given values such as `log 2 ≈ 0.301`.",
    "I can spot impostor laws, such as `log(x + y) = log x + log y`, and test a claimed law with a counterexample."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Exponent laws", goal:1, prompt:"Simplify `2^3 × 2^4`.",
          options:[
            { t:"`2^7`", ok:true, why:"Multiplying powers with the same base adds the exponents: `2^3 × 2^4 = (2 × 2 × 2) × (2 × 2 × 2 × 2) = 2^7`." },
            { t:"`2^{12}`", why:"Multiplying exponents is the law for a power of a power, `(2^3)^4 = 2^{12}`. Here the powers are multiplied, so the exponents add." },
            { t:"`4^7`", why:"The base stays 2. Count the factors: three 2s times four 2s is seven 2s, which is `2^7 = 128`, while `4^7 = 16 384`." },
            { t:"`4^{12}`", why:"Neither the bases nor the exponents multiply. Three 2s times four 2s is seven 2s: `2^7`." }],
          hints:["Write each power as repeated multiplication.", "`2^3 × 2^4` is three 2s times four 2s. How many 2s is that altogether?", "Seven 2s: `2^3 × 2^4 = 2^{3+4} = 2^7`."] },
        { id:"w2", skill:"Exponent laws", goal:1, prompt:"Simplify `5^8 ÷ 5^2`.",
          options:[
            { t:"`5^6`", ok:true, why:"Dividing powers with the same base subtracts the exponents: `5^8 ÷ 5^2 = 5^{8-2} = 5^6`." },
            { t:"`5^4`", why:"8 ÷ 2 = 4, but dividing powers subtracts exponents: cancelling two 5s from eight leaves six." },
            { t:"`5^{10}`", why:"Adding exponents is for multiplying. Dividing by `5^2` removes two factors of 5." },
            { t:"`1`", why:"The base stays 5. Only the exponents change: 8 − 2 = 6." }],
          hints:["Write `5^8 ÷ 5^2` as a fraction with eight 5s on top and two 5s below.", "Two of the 5s on top cancel with the two below.", "Six 5s are left: `5^8 ÷ 5^2 = 5^{8-2} = 5^6`."] },
        { id:"w3", skill:"Evaluating logarithms", goal:4, prompt:"Evaluate `log_2 32`.",
          options:[
            { t:"`5`", ok:true, why:"`log_2 32` asks: what exponent on 2 gives 32? `2^5 = 32`, so `log_2 32 = 5`." },
            { t:"`4`", why:"2 → 4 → 8 → 16 → 32 is four doublings, but it starts at `2 = 2^1`. From `1 = 2^0` it takes five: `2^5 = 32`." },
            { t:"`16`", why:"32 ÷ 2 = 16 is a quotient. A logarithm is an exponent: `2^5 = 32`." },
            { t:"`1/5`", why:"`32^{1/5} = 2`, so 1/5 is `log_{32} 2`. `log_2 32` asks for the exponent on 2." }],
          hints:["`log_2 32` means: 2 to what power is 32?", "List the powers of 2: `2^1 = 2`, `2^2 = 4`, `2^3 = 8`, `2^4 = 16`, …", "`2^5 = 32`, so `log_2 32 = 5`."] },
        { id:"w4", skill:"Evaluating logarithms", goal:4, prompt:"Evaluate `log_3(1/9)`.",
          options:[
            { t:"`-2`", ok:true, why:"`1/9 = 1/3^2 = 3^{-2}`, so `log_3(1/9) = -2`." },
            { t:"`2`", why:"`3^2 = 9`, not 1/9. A reciprocal needs a negative exponent: `3^{-2} = 1/9`." },
            { t:"`-1/2`", why:"`9^{-1/2} = 1/3`, so −1/2 is `log_9(1/3)`. Here the base is 3." },
            { t:"Undefined", why:"Logs are undefined only for 0 and negative numbers. A fraction between 0 and 1 has a negative log." }],
          hints:["Write 1/9 as a power of 3.", "`9 = 3^2`, and a reciprocal flips the sign of the exponent.", "`1/9 = 3^{-2}`, so `log_3(1/9) = -2`."] },
        { id:"w5", skill:"Power law", goal:3, prompt:"Write `3 log_2 5` as a single logarithm.",
          options:[
            { t:"`log_2 125`", ok:true, why:"The power law moves the coefficient up as an exponent: `3 log_2 5 = log_2(5^3) = log_2 125`." },
            { t:"`log_2 15`", why:"3 × 5 = 15, but the 3 becomes an exponent on 5, not a factor: `5^3 = 125`." },
            { t:"`log_2 8`", why:"3 + 5 = 8 has nothing to do with the power law. The 3 becomes an exponent: `log_2(5^3)`." },
            { t:"`(log_2 5)^3`", why:"The power law puts the exponent on the number inside, `5^3`, not on the log." }],
          hints:["The power law says `n " + LB + " x = " + LB + "(x^n)`.", "Here `n = 3` and `x = 5`.", "`3 log_2 5 = log_2(5^3) = log_2 125`."] },
        { id:"w6", skill:"Change of base", goal:5, prompt:"What is `log 8 ÷ log 2` equal to?",
          options:[
            { t:"`3`", ok:true, why:"By change of base, `log 8 ÷ log 2 = log_2 8 = 3`, because `2^3 = 8`." },
            { t:"`4`", why:"8 ÷ 2 = 4, but the logs don’t cancel. `log 8 ÷ log 2` is `log_2 8`." },
            { t:"`log 4`", why:"`log 4 = log(8/2)`, which is `log 8` <strong>minus</strong> `log 2`. Dividing two logs is a change of base." },
            { t:"`log 6`", why:"8 − 2 = 6 mixes in subtraction. Dividing two logs with the same base gives a log in a new base: `log_2 8`." }],
          hints:["Recall the change of base formula: `" + LB + " x = log x / log " + B + "`.", "`log 8 / log 2` has the form `log x / log " + B + "` with `x = 8` and `" + B + " = 2`.", "So it equals `log_2 8 = 3`."] }
      ],
      refreshers:{
        "Exponent laws":"When you multiply powers with the same base, add the exponents: `2^3 × 2^4 = 2^7`. When you divide, subtract them: `5^8 ÷ 5^2 = 5^6`. The base never changes. Multiplying exponents is a different law, for a power of a power: `(2^3)^4 = 2^{12}`. This module turns the first two laws into laws for logarithms.",
        "Evaluating logarithms":"`" + LB + " x` asks: what exponent on `" + B + "` gives `x`? `log_2 32 = 5` because `2^5 = 32`. Numbers between 0 and 1 have negative logs: `log_3(1/9) = -2` because `3^{-2} = 1/9`. Logs are undefined only for 0 and negative numbers.",
        "Power law":"`n " + LB + " x = " + LB + "(x^n)`: the coefficient becomes an exponent on the number inside. `3 log_2 5 = log_2(5^3) = log_2 125`. It is not `log_2 15`, and not `(log_2 5)^3`.",
        "Change of base":"`" + LB + " x = log x / log " + B + "`, so `log 8 ÷ log 2 = log_2 8 = 3`. Dividing two logs is a change of base. It is <strong>not</strong> the log of a quotient: `log(8/2) = log 4 ≈ 0.602`."
      }
    }
  },
  explore:{
    heading:"Multiply by adding lengths",
    intro:"On these rulers, the distance from 1 to any number is its logarithm. Slide the top ruler, move the cursor, and watch what happens to the numbers when the lengths add or subtract.",
    predictions:[
      { id:"p1", start:{ rul:"log", op:"mul", b:10, x:1, y:1, z:1 },
        prompt:"On the D scale, the gap from 1 to 2 is about 0.301 units long. How long is the gap from 4 to 8?",
        options:[{ t:"About 0.151 (half as long)" }, { t:"About 0.301 (the same)", ok:true }, { t:"About 0.602 (twice as long)" }, { t:"About 1.204 (four times as long)" }],
        explain:"The gap from `a` to `b` is `log b - log a = log(b/a)`. From 4 to 8 the ratio is 2, the same as from 1 to 2, so the gap is `log 2` again. On a log scale, <strong>equal ratios make equal gaps</strong>. (0.602 is `log 4 = log(8 - 4)`: that subtracts the numbers instead of dividing them. 1.204 is what an ordinary ruler would give.)" },
      { id:"p2", start:{ rul:"log", op:"mul", b:10, x:1, y:4, z:4 },
        prompt:"Keep the cursor on C’s 4 and slide the C scale right until its 1 sits above D’s 2. What will D read under the cursor?",
        options:[{ t:"4.301" }, { t:"6" }, { t:"8", ok:true }, { t:"16" }],
        explain:"Sliding C by the length `log 2` adds `log 2` to every length on C, so every number on C now sits above twice itself: `log 2 + log 4 = log 8`. Ordinary rulers add numbers (2 + 4 = 6); log rulers multiply them (2 × 4 = 8). 4.301 adds the length 0.301 to the number 4, and 16 is `2^4`, a power, not a product." },
      { id:"p3", start:{ rul:"log", op:"div", b:10, x:1, y:6, z:6 },
        prompt:"The cursor is on D’s 6. Slide C until its 3 is under the cursor. Where will C’s 1 be?",
        options:[{ t:"Above D’s 0.5" }, { t:"Above D’s 2", ok:true }, { t:"Above D’s 3" }, { t:"Above D’s 18" }],
        explain:"Dividing undoes multiplying: `log 6 - log 3 = log 2`, because 6 ÷ 3 = 2. The lengths subtract, so the numbers divide. D’s 3 would be 6 − 3 (subtracting the numbers), 0.5 is 3 ÷ 6 (the division the wrong way round), and 18 is 6 × 3." },
      { id:"p4", start:{ rul:"log", op:"mul", b:2, x:4, y:1, z:4 },
        prompt:"In base-2 units the slide is 2 units long, because `log_2 4 = 2`. If the cursor moves to C’s 8, what will the total length be, and where will it land on D?",
        options:[{ t:"3 units, at 8" }, { t:"5 units, at 12" }, { t:"5 units, at 32", ok:true }, { t:"6 units, at 64" }],
        explain:"`log_2 4 + log_2 8 = 2 + 3 = 5`, and `2^5 = 32 = 4 × 8`. This is the exponent law `2^2 × 2^3 = 2^5` written with logs: a log is an exponent, so multiplying numbers adds their logs. “6 units at 64” multiplies the lengths (2 × 3); 12 adds the numbers; “3 units at 8” ignores the slide." }
    ],
    challenges:[
      { id:"tc1", goal:[1, 4], prompt:"Using log rulers in base-10 units, make the total length <strong>exactly 1 unit</strong> with two lengths that are not 0. (So C’s 1 can’t sit above D’s 1, and the cursor can’t be on C’s 1.)",
        hints:["A total length of 1 unit in base 10 means the reading on D is `10^1 = 10`.", "So you need two numbers, neither of them 1, that <strong>multiply</strong> to 10.", "Put C’s 1 above D’s 2 and the cursor on C’s 5: `log 2 + log 5 = log 10 = 1`. (2.5 and 4 also work.)"] },
      { id:"tc2", goal:[1, 4], prompt:"Divide mode, log rulers. Make the answer length exactly <strong>`-log 2`</strong>, so the answer bar points left. Don’t use 1 or 2 for the dividend or the divisor.",
        hints:["`-log 2 = log(1/2)`. Which quotient is 1/2?", "The dividend must be half the divisor, for example 3 ÷ 6.", "Put the cursor on D’s 3 and slide C until its 6 is under the cursor. C’s 1 lands above D’s 0.5: `log 3 - log 6 = log 0.5 = -log 2`."] },
      { id:"tc3", goal:[1, 4], stretch:true, prompt:"Switch to base-3 units, Multiply mode. Make the total length <strong>exactly 2 units</strong> using two numbers that are <strong>not</strong> powers of 3, so neither length is a whole number of units.",
        hints:["In base-3 units, which number on D is exactly 2 units from 1?", "`3^2 = 9`, so the product must be 9. Now find two numbers on the rule that multiply to 9 and aren’t powers of 3 (1, 3 and 9 are).", "Try 1.5 × 6 = 9: `log_3 1.5 + log_3 6 ≈ 0.369 + 1.631 = 2`. Neither piece is whole, but they add to exactly 2."] }
    ],
    blocks:[{ title:"Why the slide rule works", html:"<ul><li>On a log scale, the distance from 1 to `x` is `log x`.</li><li>Putting two lengths end to end adds them: `log x + log y`. You land on the number whose log is that total, which is `xy`. So <strong>`log(xy) = log x + log y`</strong>.</li><li>Going back subtracts: `log x - log y` lands on `x/y`. So <strong>`log(x/y) = log x - log y`</strong>.</li><li>In exponent language: if `x = " + B + "^m` and `y = " + B + "^n`, then `xy = " + B + "^{m+n}` and `x/y = " + B + "^{m-n}`. Logs are exponents, so they add and subtract the same way.</li></ul>" }]
  },
  part3:{
    slug:"clinic", name:"Clinic",
    heading:"Law or impostor? The log law clinic",
    intro:"Six claims have come in. Some are real laws; some are impostors that only look like laws. For each one, make your diagnosis first, then test it with numbers and graphs.",
    note:"Every claim is about any base `" + B + "` (with `" + B + " > 0`, `" + B + " ≠ 1`) and positive `x` and `y`. The tester uses base 2, so that powers of 2 give whole-number lengths.",
    ui:{
      diagnose:"Law (true for every positive `x` and `y`) or impostor?", diagnose1:"Law (true for every positive `x`) or impostor?",
      testImp:"Find a <strong>counterexample</strong> (a pair where the sides differ) <strong>and</strong> a <strong>lucky pair</strong> (a pair where they happen to be equal).",
      testImp1:"Find a <strong>counterexample</strong> (a value where the sides differ) <strong>and</strong> a <strong>lucky value</strong> (a value where they happen to be equal).",
      testLaw:"Test three different pairs.",
      after:"Two laws, four impostors. Every impostor had a lucky pair, and every lucky pair came from a number coincidence: 2 + 2 = 2 × 2, 4 − 2 = 4 ÷ 2. One example never proves a law, but one counterexample always disproves one."
    },
    cases:[
      { id:"c1", claim:law(LB + "(x + y) = " + LB + " x + " + LB + " y"), answer:"imp",
        hints:["By the product law, `log_2 x + log_2 y = log_2(xy)`. So the sides are equal exactly when `log_2(x + y) = log_2(xy)`.", "That means `x + y = xy`. Pick `y = 2`: then `x + 2 = 2x`.", "`x = 2`, `y = 2`: 2 + 2 = 4 = 2 × 2, so both sides are `log_2 4 = 2`. (3/2 and 3 also work: 3/2 + 3 = 9/2 = 3/2 × 3.)"],
        verdict:"Impostor. Adding logs multiplies the numbers inside, so the right side is `" + LB + "(xy)`. The two sides agree only when `x + y` happens to equal `xy`.",
        alg:"`" + LB + " x + " + LB + " y = " + LB + "(xy)` by the product law. So the claim says `" + LB + "(x + y) = " + LB + "(xy)`, which is true only when `x + y = xy`, that is, `y = x/(x - 1)`. For `x = 2` that gives `y = 2`. For `x = 2` and `y = 3`: `log_2 5 ≈ 2.322`, but `log_2 6 ≈ 2.585`.",
        q:{ prompt:"Which statement is a true law?", options:[
          { t:law(LB + " x + " + LB + " y = " + LB + "(xy)"), ok:true, why:"Right. Adding logs multiplies the numbers inside. There is no law that splits `" + LB + "(x + y)`." },
          { t:law(LB + "(x + y) = " + LB + " x · " + LB + " y"), why:"That’s another impostor (case 3). In base 2 with `x = y = 2`: `log_2 4 = 2`, but 1 × 1 = 1." },
          { t:law(LB + "(x + y) = " + LB + "(xy)"), why:"Only when `x + y = xy`, as at (2, 2). At (2, 3): `log_2 5 ≠ log_2 6`." },
          { t:law(LB + "(x + y) = " + LB + " x + y"), why:"That pulls `y` out of the log altogether. At `x = y = 2` in base 2: `log_2 4 = 2`, but `log_2 2 + 2 = 3`." }] } },
      { id:"c2", claim:law(LB + "(x/y) = " + LB + " x - " + LB + " y"), answer:"law",
        tip:"Try a pair with `x < y`, such as (2, 8): both sides are −2. Logs of numbers below 1 are negative.",
        verdict:"Law. This is the quotient law. It works for every positive `x` and `y`.",
        alg:"Let `m = " + LB + " x` and `n = " + LB + " y`, so `x = " + B + "^m` and `y = " + B + "^n`. Then `x/y = " + B + "^m ÷ " + B + "^n = " + B + "^{m-n}` by the exponent law, so `" + LB + "(x/y) = m - n = " + LB + " x - " + LB + " y`.",
        q:{ prompt:"Use the quotient law: `log_5 75 - log_5 3 = ?`", options:[
          { t:"`2`", ok:true, why:"Right. `log_5(75 ÷ 3) = log_5 25 = 2`." },
          { t:"`5`", why:"That’s 25 ÷ 5. A log is an exponent: `5^2 = 25`." },
          { t:"`25`", why:"That’s 75 ÷ 3. The answer is its log: `log_5 25 = 2`." },
          { t:"`log_5 72`", why:"Subtracting logs divides the numbers: 75 ÷ 3, not 75 − 3." }] } },
      { id:"c3", claim:law(LB + "(xy) = " + LB + " x · " + LB + " y"), answer:"imp",
        hints:["Use powers of 2, so that every log is a whole number.", "The left side is `log_2 x + log_2 y`. Which whole number, added to itself, gives the same answer as multiplied by itself?", "2 + 2 = 2 × 2, so `log_2 x = log_2 y = 2`: `x = y = 4`. Both sides are 4. (`x = y = 1` also works: 0 + 0 = 0 × 0.)"],
        verdict:"Impostor. The product law <strong>adds</strong> the logs. The sides agree only when the sum of the two logs happens to equal their product.",
        alg:"`" + LB + "(xy) = " + LB + " x + " + LB + " y`. So the claim needs `" + LB + " x + " + LB + " y = " + LB + " x · " + LB + " y`, which is true only for special pairs, such as `x = y = 4` in base 2 (2 + 2 = 2 × 2). With `y = 2`, the right side is just `log_2 x` and the left side is `log_2 x + 1`, so the curves never meet.",
        q:{ prompt:"What does `log_2 8 · log_2 4` equal?", options:[
          { t:"6, since `log_2 8 = 3` and `log_2 4 = 2`", ok:true, why:"Right. A product of two logs is just a product of two numbers. It doesn’t combine into one log." },
          { t:"5, since it equals `log_2 32`", why:"`log_2 32 = log_2 8` <strong>+</strong> `log_2 4 = 3 + 2`. The product of the logs is 3 × 2 = 6." },
          { t:"`log_2 12`", why:"That adds the numbers inside, 8 + 4. It isn’t even a whole number." },
          { t:"`log_2 2 = 1`, since 8 ÷ 4 = 2", why:"That’s `log_2 8 - log_2 4`, a difference of logs." }] } },
      { id:"c4", claim:law(LB + "(x^2y) = 2 " + LB + " x + " + LB + " y"), answer:"law",
        tip:"Try (3, 5): both sides are about 5.492.",
        verdict:"Law. It combines the product law and the power law, so it works for every positive `x` and `y`.",
        alg:"`" + LB + "(x^2y) = " + LB + "(x^2) + " + LB + " y` (product law) `= 2 " + LB + " x + " + LB + " y` (power law).",
        q:{ prompt:"Use the law to evaluate `log_2(8^2 × 4)`.", options:[
          { t:"`8`", ok:true, why:"Right. `2 log_2 8 + log_2 4 = 2(3) + 2 = 8`. Check: `8^2 × 4 = 256 = 2^8`." },
          { t:"`5`", why:"That leaves out the 2 in front of `log_2 8`: 3 + 2 = 5." },
          { t:"`11`", why:"That squares the log: `3^2 + 2`. The power law gives 2 × 3, not `3^2`." },
          { t:"`12`", why:"That multiplies everything: 2 × 3 × 2. The product law adds logs." }] } },
      { id:"c5", claim:law(LB + "(x/y) = " + LB + " x ÷ " + LB + " y"), answer:"imp",
        hints:["Use powers of 2, so that every log is a whole number.", "The left side is `log_2 x - log_2 y`. Which two whole numbers have the same difference as quotient?", "4 − 2 = 4 ÷ 2, so `log_2 x = 4` and `log_2 y = 2`: `x = 16`, `y = 4`. Both sides are 2."],
        verdict:"Impostor. The quotient law <strong>subtracts</strong> the logs. Dividing two logs is something else: a change of base.",
        alg:"`" + LB + " x ÷ " + LB + " y = log_y x`, the change of base formula from module 40. The claim needs `" + LB + " x - " + LB + " y = " + LB + " x ÷ " + LB + " y`, which is true only for special pairs such as `x = 16` and `y = 4` in base 2 (4 − 2 = 4 ÷ 2). When `y = 1` the right side is undefined, because `" + LB + " 1 = 0`.",
        q:{ prompt:"`" + LB + " x ÷ " + LB + " y` isn’t `" + LB + "(x/y)`. What does it equal?", options:[
          { t:"`log_y x`", ok:true, why:"Right. That’s the change of base formula: `log_y x = " + LB + " x / " + LB + " y`." },
          { t:law(LB + " x - " + LB + " y"), why:"That’s `" + LB + "(x/y)`, the quotient law. Dividing the logs is a different operation." },
          { t:"`log_x y`", why:"Upside down: `log_x y = " + LB + " y ÷ " + LB + " x`." },
          { t:law(LB + "(x - y)"), why:"Subtracting inside the log isn’t related to either side." }] } },
      { id:"c6", claim:law(LB + "(2x) = 2 " + LB + " x"), one:true, answer:"imp",
        hints:["`log_2(2x) = log_2 2 + log_2 x = 1 + log_2 x`, and `2 log_2 x = log_2 x + log_2 x`.", "So you need `1 + log_2 x = 2 log_2 x`, which means `log_2 x = 1`.", "`x = 2`: `log_2 4 = 2` and `2 log_2 2 = 2`."],
        verdict:"Impostor. A factor of 2 inside the log adds `" + LB + " 2`. A coefficient of 2 in front squares the number inside. They agree only when `2x = x^2`, at `x = 2`.",
        alg:"`" + LB + "(2x) = " + LB + " 2 + " + LB + " x` (product law), but `2 " + LB + " x = " + LB + "(x^2)` (power law). They’re equal only when `2x = x^2`, which for `x > 0` means `x = 2`.",
        q:{ prompt:"What does `2 " + LB + " x` really equal?", options:[
          { t:law(LB + "(x^2)"), ok:true, why:"Right. By the power law, the coefficient becomes an exponent." },
          { t:law(LB + "(2x)"), why:"That’s `" + LB + " 2 + " + LB + " x`, from the product law. The two agree only at `x = 2`." },
          { t:law("(" + LB + " x)^2"), why:"The 2 is an exponent on `x`, not on the whole log." },
          { t:law("2 + " + LB + " x"), why:"That adds 2 instead of doubling the log." }] } }
    ],
    quickCheck:{
      title:"Law or impostor?", summary:"Law or impostor? quick check",
      items:[
        { id:"q1", goal:4, prompt:"Is `log_4 2 + log_4 8 = log_4 16` true?",
          choices:[
            { t:"True: 2 × 8 = 16, and both sides equal 2.", ok:true, fb:"Right. `log_4 2 = 1/2` and `log_4 8 = 3/2`, which add to 2, and `4^2 = 16`." },
            { t:"False: the right side should be `log_4 10`, since 2 + 8 = 10.", fb:"Adding logs multiplies the numbers inside: 2 × 8 = 16." },
            { t:"False: the left side is `log_4 2 · log_4 8 = 3/4`.", fb:"Adding the logs isn’t multiplying them: 1/2 + 3/2 = 2." }] },
        { id:"q2", goal:4, prompt:"`log 30 - log 3 = ?`",
          choices:[
            { t:"`1`", ok:true, fb:"Right. `log(30 ÷ 3) = log 10 = 1`." },
            { t:"`10`", fb:"That’s 30 ÷ 3. The answer is its log: `log 10 = 1`." },
            { t:"`log 27`", fb:"Subtracting logs divides the numbers: 30 ÷ 3, not 30 − 3." },
            { t:"`log 90`", fb:"That’s `log 30 + log 3`. Subtracting logs divides." }] },
        { id:"q3", goal:5, prompt:"A student checks the claim `log(x + y) = log x + log y` with `x = 2` and `y = 2`, and finds that both sides equal `log 4`. What does this show?",
          choices:[
            { t:"Nothing general: 2 + 2 happens to equal 2 × 2. With `x = 2` and `y = 3` the sides differ.", ok:true, fb:"Right. One matching pair proves nothing, and one counterexample sinks a claim: `log 5 ≈ 0.699`, but `log 6 ≈ 0.778`." },
            { t:"The claim is a law: it worked for the pair tested, and a law is a rule that works.", fb:"A law must work for every pair, not just one. Try `x = 2`, `y = 3`." },
            { t:"The claim is a law whenever `x = y`, because then both sides use the same number twice.", fb:"Try `x = y = 3`: `log 6 ≈ 0.778`, but `log 3 + log 3 = log 9 ≈ 0.954`." }] },
        { id:"q4", goal:5, prompt:"`log_2 64 ÷ log_2 8 = ?`",
          choices:[
            { t:"`2`", ok:true, fb:"Right. `log_2 64 = 6` and `log_2 8 = 3`, so the quotient is 6 ÷ 3 = 2. (By change of base it’s also `log_8 64 = 2`.)" },
            { t:"`3`", fb:"3 is `log_2(64 ÷ 8) = log_2 64` <strong>−</strong> `log_2 8`. Dividing the logs is different from the quotient law." },
            { t:"`8`", fb:"64 ÷ 8 divides the numbers, not the logs." },
            { t:"`1/2`", fb:"Upside down: that’s `log_2 8 ÷ log_2 64`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"moves", type:"custom", title:"One move at a time", summary:"One move at a time", goal:[2, 3, 4],
        instruction:"Choose the next move. Every move must be a law that works for all positive values.",
        how:"Tap the move you’d make next. The line updates when your move is right; a wrong move gets feedback, and you can try again.",
        items:[
          { id:"s1", goal:4, prompt:"Condense, then evaluate: `log_4 2 + log_4 32`", end:"`3`",
            steps:[
              { line:"`log_4 2 + log_4 32`", stamp:"Product law", moves:[
                { t:"Product law: `log_4(2 × 32) = log_4 64`", ok:true },
                { t:"Add the numbers inside: `log_4(2 + 32) = log_4 34`", fb:"The product law multiplies the numbers inside. `log_4 2 + log_4 32 = 1/2 + 5/2 = 3`, but `log_4 34` isn’t even a whole number." },
                { t:"Multiply the logs: `log_4 2 · log_4 32`", fb:"That’s (1/2)(5/2) = 5/4, a different number. Adding logs multiplies the numbers inside, not the logs." },
                { t:"Combine the bases too: `log_8(2 × 32)`", fb:"The base never changes when you combine logs. `log_8 64 = 2`, but the sum is 3." }] },
              { line:"`log_4 64`", stamp:"Evaluate", moves:[
                { t:"`4^3 = 64`, so `log_4 64 = 3`", ok:true },
                { t:"64 ÷ 4 = 16, so `log_4 64 = 16`", fb:"A log is an exponent, not a quotient. `4^{16}` is far bigger than 64." },
                { t:"`8^2 = 64`, so `log_4 64 = 8`", fb:"`8^2 = 64` tells you `log_8 64 = 2`. You need the exponent on 4." }] }],
            hints:["Two logs with the same base are being added. Which law combines them?", "The product law: `log_4 2 + log_4 32 = log_4(2 × 32) = log_4 64`.", "`log_4 64 = 3`, because `4^3 = 64`. (Check: `log_4 2 = 1/2` and `log_4 32 = 5/2`, and 1/2 + 5/2 = 3.)"] },
          { id:"s2", goal:4, prompt:"Condense, then evaluate: `log_3 54 - log_3 2`", end:"`3`",
            steps:[
              { line:"`log_3 54 - log_3 2`", stamp:"Quotient law", moves:[
                { t:"Quotient law: `log_3(54 ÷ 2) = log_3 27`", ok:true },
                { t:"Subtract the numbers inside: `log_3(54 - 2) = log_3 52`", fb:"Subtracting logs divides the numbers inside: 54 ÷ 2, not 54 − 2." },
                { t:"Divide the logs: `log_3 54 ÷ log_3 2`", fb:"Dividing two logs is a change of base: it equals `log_2 54 ≈ 5.75`. The quotient law subtracts logs." },
                { t:"Quotient law: `log_3(2 ÷ 54) = log_3(1/27)`", fb:"The first log’s number goes on top. `log_3(1/27) = -3`, the opposite of the answer." }] },
              { line:"`log_3 27`", stamp:"Evaluate", moves:[
                { t:"`3^3 = 27`, so `log_3 27 = 3`", ok:true },
                { t:"27 ÷ 3 = 9, so `log_3 27 = 9`", fb:"A log is an exponent: 3 to what power is 27?" },
                { t:"`27^{1/3} = 3`, so `log_3 27 = 1/3`", fb:"That’s `log_{27} 3`, the other way round. `log_3 27` asks for the exponent on 3." }] }],
            hints:["Two logs with the same base are being subtracted. Which law combines them?", "The quotient law: `log_3 54 - log_3 2 = log_3(54 ÷ 2) = log_3 27`.", "`log_3 27 = 3`, because `3^3 = 27`."] },
          { id:"s3", goal:3, prompt:"Condense, then evaluate: `2 log 4 + log 50 - log 8`", end:"`2`",
            steps:[
              { line:"`2 log 4 + log 50 - log 8`", stamp:"Power law", moves:[
                { t:"Power law: `2 log 4 = log 16`", ok:true },
                { t:"`2 log 4 = log 8`, since 2 × 4 = 8", fb:"`2 log 4 = log 4 + log 4 = log(4 × 4) = log 16`. The coefficient becomes an exponent." },
                { t:"`2 log 4 = (log 4)^2`", fb:"The 2 is an exponent on 4, not on the log." },
                { t:"`2 log 4 = log 6`, since 2 + 4 = 6", fb:"Nothing gets added. `2 log 4 = log(4^2) = log 16`." }] },
              { line:"`log 16 + log 50 - log 8`", stamp:"Product law", moves:[
                { t:"Product law: `log 16 + log 50 = log 800`", ok:true },
                { t:"`log 16 + log 50 = log 66`", fb:"Adding logs multiplies the numbers: 16 × 50 = 800." },
                { t:"`log 16 + log 50 = log 16 · log 50`", fb:"The product law adds the logs of the factors; it never multiplies logs." }] },
              { line:"`log 800 - log 8`", stamp:"Quotient law", moves:[
                { t:"Quotient law, then evaluate: `log(800 ÷ 8) = log 100 = 2`", ok:true },
                { t:"`log 800 - log 8 = log 792 ≈ 2.90`", fb:"Subtracting logs divides the numbers: 800 ÷ 8 = 100." },
                { t:"`log 800 - log 8 = log(8 ÷ 800) = -2`", fb:"Upside down: the first log’s number goes on top. 800 ÷ 8 = 100, so the answer is +2." },
                { t:"`log 800 - log 8 = log 800 ÷ log 8 ≈ 3.21`", fb:"Dividing two logs is a change of base (`log_8 800`). The quotient law subtracts." }] }],
            hints:["Before you can combine, every log needs a coefficient of 1. Deal with the 2 first.", "Power law: `2 log 4 = log(4^2) = log 16`.", "`log 16 + log 50 - log 8 = log(16 × 50 ÷ 8) = log 100 = 2`."] },
          { id:"s4", goal:2, prompt:"Expand fully: `log_2(8x^3/y)`, for `x > 0` and `y > 0`", end:"`3 + 3 log_2 x - log_2 y`",
            steps:[
              { line:"`log_2({8x^3}/{y})`", stamp:"Quotient law", moves:[
                { t:"Quotient law: `log_2(8x^3) - log_2 y`", ok:true },
                { t:"`log_2(8x^3) ÷ log_2 y`", fb:"The quotient law turns dividing inside into <strong>subtracting</strong> logs." },
                { t:"`log_2 y - log_2(8x^3)`", fb:"The top comes first: `log_2`(top) − `log_2`(bottom)." },
                { t:"`log_2(8x^3 - y)`", fb:"There’s no subtraction inside. The division becomes a subtraction of logs <strong>outside</strong>." }] },
              { line:"`log_2(8x^3) - log_2 y`", stamp:"Product law", moves:[
                { t:"Product law: `log_2 8 + log_2(x^3) - log_2 y`", ok:true },
                { t:"`log_2 8 · log_2(x^3) - log_2 y`", fb:"The product law adds the logs of the factors." },
                { t:"`8 log_2(x^3) - log_2 y`", fb:"8 is a factor, not a coefficient: it becomes `log_2 8 = 3`, added on." }] },
              { line:"`log_2 8 + log_2(x^3) - log_2 y`", stamp:"Power law", moves:[
                { t:"Evaluate `log_2 8` and use the power law: `3 + 3 log_2 x - log_2 y`", ok:true },
                { t:"`3 + (log_2 x)^3 - log_2 y`", fb:"The power law brings the exponent down as a coefficient: `log_2(x^3) = 3 log_2 x`." },
                { t:"`4 + 3 log_2 x - log_2 y`", fb:"`log_2 8 = 3`, since `2^3 = 8`. (8 ÷ 2 = 4 isn’t a log.)" }] }],
            hints:["Inside the log, the last thing that happens is a division by `y`. Start with the quotient law.", "`log_2(8x^3/y) = log_2(8x^3) - log_2 y`. Now split `8x^3` with the product law.", "`log_2 8 + log_2(x^3) - log_2 y = 3 + 3 log_2 x - log_2 y`."] },
          { id:"s5", goal:2, prompt:"Expand fully: `log(x/(100y))`, for `x > 0` and `y > 0`", end:"`log x - 2 - log y`",
            steps:[
              { line:"`log({x}/{100y})`", stamp:"Quotient law", moves:[
                { t:"Quotient law: `log x - log(100y)`", ok:true },
                { t:"`log(100y) - log x`", fb:"The top comes first: `log x - log(100y)`." },
                { t:"`log x ÷ log(100y)`", fb:"Dividing inside becomes <strong>subtracting</strong> logs." }] },
              { line:"`log x - log(100y)`", stamp:"Product law", moves:[
                { t:"Product law inside a bracket: `log x - (log 100 + log y) = log x - 2 - log y`", ok:true },
                { t:"`log x - log 100 + log y = log x - 2 + log y`", fb:"The minus sign applies to the whole of `log(100y)`, so `log y` is subtracted too. Check `x = 100`, `y = 10`: `log(100/1000) = -1`, but `log x - 2 + log y = 1`." },
                { t:"`log x - log 100 · log y = log x - 2 log y`", fb:"`log(100y) = log 100` <strong>+</strong> `log y`. The logs of the factors add." },
                { t:"`log x - log(100 + y)`", fb:"`100y` is a product, so its log is a sum of logs: `log 100 + log y`." }] }],
            hints:["Inside the log, the last thing that happens is a division: `x` divided by `100y`. Start with the quotient law.", "`log x - log(100y)`. Now expand `log(100y)`, keeping it in a bracket.", "`log x - (log 100 + log y) = log x - 2 - log y`."] },
          { id:"s6", goal:3, prompt:"Condense into a single logarithm: `log_3 x + 2 log_3 y - log_3 9`, for `x > 0` and `y > 0`", end:"`log_3({xy^2}/{9})`",
            steps:[
              { line:"`log_3 x + 2 log_3 y - log_3 9`", stamp:"Power law", moves:[
                { t:"Power law: `2 log_3 y = log_3(y^2)`", ok:true },
                { t:"`2 log_3 y = log_3(2y)`", fb:"`log_3(2y) = log_3 2 + log_3 y`. The coefficient 2 becomes an exponent: `log_3(y^2)`." },
                { t:"`2 log_3 y = (log_3 y)^2`", fb:"The 2 is an exponent on `y`, not on the log." }] },
              { line:"`log_3 x + log_3(y^2) - log_3 9`", stamp:"Product law", moves:[
                { t:"Product law: `log_3(xy^2) - log_3 9`", ok:true },
                { t:"`log_3(x + y^2) - log_3 9`", fb:"Adding logs multiplies the numbers inside." },
                { t:"`log_3 x · log_3(y^2) - log_3 9`", fb:"The product law adds logs; it doesn’t multiply them." }] },
              { line:"`log_3(xy^2) - log_3 9`", stamp:"Quotient law", moves:[
                { t:"Quotient law: `log_3(xy^2/9)`", ok:true },
                { t:"`log_3(9/(xy^2))`", fb:"Upside down. The log being subtracted goes on the bottom." },
                { t:"`log_3(xy^2 - 9)`", fb:"Subtracting logs divides the numbers inside." },
                { t:"`log_3(xy^2) ÷ log_3 9`", fb:"Dividing two logs isn’t the quotient law, and it isn’t a single log." }] }],
            hints:["Before you can combine, every log needs a coefficient of 1. Deal with the 2 first.", "Power law: `2 log_3 y = log_3(y^2)`.", "`log_3 x + log_3(y^2) - log_3 9 = log_3(xy^2) - log_3 9 = log_3(xy^2/9)`."] }
        ] },
      { id:"build", type:"custom", title:"Build it, then work backwards", summary:"Build it, then work backwards", star:true, goal:[2, 3, 4],
        instruction:"Find each missing number. The last items work backwards or chain several laws.",
        how:"Type your answer and press Check. Use the fraction boxes where they’re shown.",
        given:"`" + LB + " 2 = p` and `" + LB + " 3 = q`, where `" + B + "` is some base greater than 1.",
        items:[
          { id:"r1", goal:2, kind:"coef", frame:["`" + LB + " 12 =`", null, "`p +`", null, "`q`"], answer:[2, 1], display:"`" + LB + " 12 = 2p + q`",
            wrong:[{ match:[1, 2], fb:"That’s `" + LB + " 18 = " + LB + "(2 × 3^2)`. 12 = `2^2` × 3." }, { match:[1, 1], fb:"That’s `" + LB + " 6`. 12 = 2 × 2 × 3 has two factors of 2." }, { match:[2, 0], fb:"That’s `" + LB + " 4`. Don’t forget the factor 3." }],
            general:"Break the number into prime factors (and powers of `" + B + "`) first, then use one law at a time. Try again.",
            hints:["Write 12 as a product of 2s and 3s.", "12 = `2^2` × 3, so `" + LB + " 12 = " + LB + "(2^2) + " + LB + " 3`.", "`" + LB + "(2^2) + " + LB + " 3 = 2 " + LB + " 2 + " + LB + " 3 = 2p + q`. The boxes are 2 and 1."] },
          { id:"r2", goal:2, kind:"coef", frame:["`" + LB + "(8/9) =`", null, "`p +`", null, "`q`"], answer:[3, -2], display:"`" + LB + "(8/9) = 3p - 2q`",
            wrong:[{ match:[3, 2], fb:"That’s `" + LB + " 72 = " + LB + "(8 × 9)`. Dividing by 9 <strong>subtracts</strong> its log." }, { match:[-3, 2], fb:"That’s `" + LB + "(9/8)`, upside down. The top’s log is added." }, { match:[3, -3], fb:"9 = `3^2`, not `3^3`." }],
            general:"Break the number into prime factors (and powers of `" + B + "`) first, then use one law at a time. Try again.",
            hints:["Write 8 and 9 as powers of 2 and 3, then use the quotient law.", "8/9 = `2^3/3^2`, so `" + LB + "(8/9) = " + LB + "(2^3) - " + LB + "(3^2)`.", "`3 " + LB + " 2 - 2 " + LB + " 3 = 3p - 2q`, so the boxes are 3 and −2."] },
          { id:"r3", goal:2, kind:"coef", frame:["`" + LB + "(6" + B + "^2) =`", null, "`+`", null, "`p +`", null, "`q`"], answer:[2, 1, 1], display:"`" + LB + "(6" + B + "^2) = 2 + p + q`",
            wrong:[{ match:[1, 1, 1], fb:"`" + LB + "(" + B + "^2) = 2`, not 1: `" + B + "^2` is `" + B + "` to the power 2." }, { match:[0, 1, 1], fb:"You left out `" + B + "^2`. `" + LB + "(" + B + "^2) = 2`." }, { match:[2, 2, 2], fb:"The 2 belongs only to `" + B + "`. 6 = 2 × 3 gives `p + q`." }],
            general:"Break the number into prime factors (and powers of `" + B + "`) first, then use one law at a time. Try again.",
            hints:["Split `6" + B + "^2` into factors whose logs you know: 2, 3 and `" + B + "^2`.", "`" + LB + "(6" + B + "^2) = " + LB + " 2 + " + LB + " 3 + " + LB + "(" + B + "^2)`.", "`" + LB + "(" + B + "^2) = 2`, so `" + LB + "(6" + B + "^2) = 2 + p + q`."] },
          { id:"r4", goal:4, kind:"num", box:"number", prompt:"Find `log 0.18` to 3 decimal places.", use:"`log 2 ≈ 0.301` and `log 3 ≈ 0.477`", answer:-0.745, tol:0.002, display:"`log 0.18 ≈ -0.745`",
            wrong:[{ match:1.255, fb:"That’s `log 18`. 0.18 = 18/100, so subtract `log 100 = 2`." }, { match:0.255, fb:"That’s `log 1.8 = log 18 - 1`. 0.18 is 18 ÷ 100, so subtract 2." }, { match:-1.745, fb:"That’s `log 0.018`. 0.18 = 18/100, not 18/1000." }, { match:0.745, fb:"A number between 0 and 1 has a negative log." }],
            general:"Break the number into prime factors (and powers of `" + B + "`) first, then use one law at a time. Try again.",
            hints:["Write 0.18 as a fraction with a power of 10 below, then factor the top.", "0.18 = 18/100 and 18 = 2 × `3^2`, so `log 0.18 = log 2 + 2 log 3 - log 100`.", "`log 0.18 ≈ 0.301 + 2(0.477) - 2 = 0.301 + 0.954 - 2 = -0.745`."] },
          { id:"r5", goal:3, kind:"num", box:"text", prompt:"`log_5 k + log_5 10 = 3`. Find `k`.", label:"`k =`", answer:12.5, tol:1e-9, display:"`k = 12.5`",
            wrong:[{ match:115, fb:"That makes `k + 10 = 125`. Adding logs multiplies the numbers: `10k = 125`." }, { match:1250, fb:"That multiplies 125 by 10. `10k = 125` means `k = 125 ÷ 10`." }, { match:0.08, fb:"That’s 10 ÷ 125, upside down. `10k = 125` means `k = 125 ÷ 10`." }],
            general:"Combine or expand one law at a time, then substitute your answer back to check it. Try again.",
            hints:["Combine the left side into one log first.", "`log_5(10k) = 3`, so `10k = 5^3 = 125`.", "`k = 125 ÷ 10 = 12.5`. Check: `log_5 12.5 + log_5 10 = log_5 125 = 3`."] },
          { id:"r6", goal:3, kind:"frac", prompt:"`log_3 k - log_3 2 = -2`. Find `k` as a fraction.", label:"`k =`", answer:[2, 9], display:"`k = 2/9`",
            wrong:[{ match:18, fb:"That makes `k ÷ 2 = 9`, but `3^{-2} = 1/9`, not 9. (Reading the quotient upside down, `2 ÷ k = 1/9`, also gives 18.)" }, { match:19 / 9, fb:"That makes `k - 2 = 1/9`. Subtracting logs divides: `k ÷ 2 = 1/9`." }, { match:1 / 18, fb:"That’s (1/9) ÷ 2. If `k ÷ 2 = 1/9`, then `k = 2 × (1/9)`." }],
            general:"Combine or expand one law at a time, then substitute your answer back to check it. Try again.",
            hints:["Combine the left side into one log first.", "`log_3(k/2) = -2`, so `k/2 = 3^{-2} = 1/9`.", "`k = 2 × (1/9) = 2/9`. Check: `log_3(2/9) - log_3 2 = log_3(1/9) = -2`."] },
          { id:"r7", goal:4, kind:"num", box:"number", prompt:"Evaluate `log_2 3 + log_2(4/3) + log_2(5/4) + … + log_2(32/31)`.", answer:5, tol:1e-9, display:"5",
            wrong:[{ match:30, fb:"There are 30 terms, but they aren’t each 1. Combine them: the product 3 × 4/3 × 5/4 × … × 32/31 cancels down." }, { match:32, fb:"32 is the product inside. The sum of the logs is `log_2 32`." }],
            general:"Combine or expand one law at a time, then substitute your answer back to check it. Try again.",
            hints:["All the logs have base 2 and they’re added. What does the product law do with a long sum?", "It becomes one log of a product: `log_2(3 × 4/3 × 5/4 × … × 32/31)`. Look at what cancels.", "Every top cancels the next bottom, leaving 32. `log_2 32 = 5`."] },
          { id:"r8", goal:2, kind:"num", box:"number", prompt:"`" + LB + " x = 3` and `" + LB + " y = -2`. Find `" + LB + "(x^2/(" + B + "y^3))`.", answer:11, tol:1e-9, display:"11",
            wrong:[{ match:-1, fb:"The minus sign applies to the whole denominator: subtract (1 + 3(−2)) = −5, which adds 5." }, { match:13, fb:"`" + LB + "(y^3) = 3 " + LB + " y = -6`, not `(" + LB + " y)^3 = -8`." }, { match:12, fb:"`" + LB + " " + B + " = 1`, not 0." }, { match:8, fb:"`" + LB + "(x^2) = 2 " + LB + " x = 6`, not 3." }],
            general:"Combine or expand one law at a time, then substitute your answer back to check it. Try again.",
            hints:["Expand first: quotient law, then product law on the bottom, then the power law.", "`" + LB + "(x^2) - (" + LB + " " + B + " + " + LB + "(y^3)) = 2 " + LB + " x - 1 - 3 " + LB + " y`.", "2(3) − 1 − 3(−2) = 6 − 1 + 6 = 11."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Simran", how:"",
        instruction:"Simran made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Write `2 log 5 + log 8 - log 2` as a single logarithm and evaluate it.",
            steps:["`2 log 5 = log 10`, since 2 × 5 = 10.", "`log 10 + log 8 = log 80`, by the product law.", "`log 80 - log 2 = log 40`, by the quotient law.", "So the expression equals `log 40`, which is between 1 and 2."],
            answer:0,
            stepFb:["", "Step 2 uses the product law correctly on what step 1 gave. The mistake is earlier.", "Step 3 is a correct use of the quotient law: 80 ÷ 2 = 40. The mistake is earlier.", "`log 40` is between 1 and 2, but the mistake is earlier."],
            fixes:[
              { t:"`2 log 5 = log(5^2) = log 25`. Then `log 25 + log 8 - log 2 = log(25 × 8 ÷ 2) = log 100 = 2`.", ok:true, why:"The power law turns the coefficient into an exponent." },
              { t:"`2 log 5 = (log 5)^2`, so the expression is `(log 5)^2 + log 4`.", why:"The power law puts the 2 on the 5, not on the log." },
              { t:"`2 log 5 = log 5 + log 5 = log 10`, so step 1 is right.", why:"`log 5 + log 5 = log(5 × 5) = log 25`. Adding logs multiplies the numbers." },
              { t:"Step 1 is correct; the mistake is in step 3: `log 80 - log 2 = log 78`.", why:"Step 3 is right: subtracting logs divides, and 80 ÷ 2 = 40." }],
            hints:["Check step 1 against the power law: `n log x = log(x^n)`.", "`2 log 5 = log 5 + log 5`. By the product law, that’s `log(5 × 5)`.", "Step 1 is wrong: `2 log 5 = log 25`. Then `log(25 × 8 ÷ 2) = log 100 = 2`."] },
          { id:"e2", goal:2, task:"Expand `log_2(32x/y)` fully, for `x > 0` and `y > 0`.",
            steps:["By the quotient law, `log_2(32x/y) = log_2(32x) - log_2 y`.", "By the product law, `log_2(32x) = log_2 32 · log_2 x`.", "`log_2 32 = 5`, because `2^5 = 32`.", "So `log_2(32x/y) = 5 log_2 x - log_2 y`."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 is true. The mistake is in how `log_2 32` is used.", "Step 4 follows from step 2. The mistake is earlier."],
            fixes:[
              { t:"`log_2(32x) = log_2 32 + log_2 x`, so `log_2(32x/y) = 5 + log_2 x - log_2 y`.", ok:true, why:"The product law adds the logs of the factors. Check `x = 4`, `y = 2`: `log_2 64 = 6`, and 5 + 2 − 1 = 6." },
              { t:"`log_2(32x) = log_2(32 + x)`, so the answer is `log_2(32 + x) - log_2 y`.", why:"`32x` is a product, not a sum." },
              { t:"`log_2(32x) = 32 log_2 x`, so the answer is `32 log_2 x - log_2 y`.", why:"32 is a factor, not an exponent on `x`." },
              { t:"Step 2 is correct; step 1 should be `log_2 y - log_2(32x)`.", why:"Step 1 had the order right: the top’s log comes first. Check `x = 4`, `y = 2` in step 4: 5 × 2 − 1 = 9, but `log_2 64 = 6`." }],
            hints:["Check step 2: does the product law add the logs or multiply them?", "`log_2(32x) = log_2 32 + log_2 x = 5 + log_2 x`.", "Step 2 is wrong. The full expansion is `5 + log_2 x - log_2 y`."] },
          { id:"e3", goal:4, task:"Evaluate `log_2 8 + log_4 16`.",
            steps:["The product law adds two logs, so `log_2 8 + log_4 16 = log_6(8 × 16)`.", "8 × 16 = 128.", "`6^2 = 36` and `6^3 = 216`, so `log_6 128` is between 2 and 3.", "So `log_2 8 + log_4 16` is between 2 and 3."],
            answer:0,
            stepFb:["", "Step 2’s arithmetic is right. The mistake is earlier.", "Step 3 is a true statement about `log_6 128`. The mistake is earlier.", "Step 4 follows from step 1. The mistake is earlier."],
            fixes:[
              { t:"The laws only combine logs with the same base. Evaluate each: `log_2 8 = 3` and `log_4 16 = 2`, so the sum is 5.", ok:true, why:"Different bases can’t be combined, but each log here is easy on its own." },
              { t:"Use base 2 for both: `log_2(8 × 16) = log_2 128 = 7`.", why:"`log_4 16 = 2`, but `log_2 16 = 4`: changing the base changes the value. 7 = 3 + 4 counts `log_2 16` instead." },
              { t:"Multiply the bases: `log_8(8 × 16) = log_8 128 = 7/3`.", why:"Bases don’t combine in any way, by adding or by multiplying." },
              { t:"Step 1 is correct as written.", why:"Check the size: `log_2 8 + log_4 16 = 3 + 2 = 5`, but `log_6 128` is less than 3." }],
            hints:["Look at the bases in step 1. Can the product law combine them?", "The product law needs the same base in every log. Here the bases are 2 and 4.", "Step 1 is wrong. Evaluate separately: 3 + 2 = 5."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the slide rule: how did the numbers behave when the lengths added or subtracted?" },
      { id:"j2", q:"In your own words, explain why `" + LB + "(xy) = " + LB + " x + " + LB + " y`. Use exponents, lengths on the slide rule, or both." },
      { id:"j3", q:"Explain to a friend, step by step, how to evaluate `log_6 4 + log_6 9` without a calculator, and why `log_6 13` is wrong." },
      { id:"j4", q:"Which impostor from the clinic are you most likely to fall for? What quick test will you use to catch it next time?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"Which expression equals `log_3(9x)` for every `x > 0`?", options:[
          { t:"`2 + log_3 x`", ok:true, why:"Product law: `log_3 9 + log_3 x`, and `log_3 9 = 2`." },
          { t:"`2 log_3 x`", why:"That’s `log_3 9 · log_3 x`. The product law adds the logs." },
          { t:"`9 log_3 x`", why:"9 is a factor, not an exponent. It becomes `log_3 9 = 2`, added on." },
          { t:"`3 + log_3 x`", why:"`log_3 9 = 2`, since `3^2 = 9`. (9 ÷ 3 = 3 isn’t a log.)" }] },
        b:{ prompt:"Which expression equals `log_2(x/8)` for every `x > 0`?", options:[
          { t:"`log_2 x - 3`", ok:true, why:"Quotient law: `log_2 x - log_2 8`, and `log_2 8 = 3`." },
          { t:"`3 - log_2 x`", why:"Upside down: that’s `log_2(8/x)`. The top’s log comes first." },
          { t:"`log_2 x / 3`", why:"The quotient law subtracts logs; it doesn’t divide them." },
          { t:"`log_2 x - 4`", why:"`log_2 8 = 3`, since `2^3 = 8`. (8 ÷ 2 = 4 isn’t a log.)" }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"Which statement is the product law of logarithms? (`" + B + " > 0`, `" + B + " ≠ 1`, `x > 0`, `y > 0`)", options:[
          { t:law(LB + "(xy) = " + LB + " x + " + LB + " y"), ok:true, why:"The log of a product is the sum of the logs, because multiplying powers adds exponents." },
          { t:law(LB + "(x + y) = " + LB + " x + " + LB + " y"), why:"Not a law. In base 10 with `x = 2`, `y = 3`: `log 5 ≈ 0.699`, but `log 2 + log 3 = log 6 ≈ 0.778`." },
          { t:law(LB + "(xy) = " + LB + " x · " + LB + " y"), why:"The logs add, not multiply: `log_2 32 = 5`, but `log_2 8 · log_2 4 = 6`." },
          { t:law(LB + "(xy) = y " + LB + " x"), why:"That mixes in the power law, which is about `x^y`, not `xy`." }] },
        b:{ prompt:"Which statement is the quotient law of logarithms? (`" + B + " > 0`, `" + B + " ≠ 1`, `x > 0`, `y > 0`)", options:[
          { t:law(LB + "(x/y) = " + LB + " x - " + LB + " y"), ok:true, why:"The log of a quotient is a difference of logs, because dividing powers subtracts exponents." },
          { t:law(LB + "(x - y) = " + LB + " x - " + LB + " y"), why:"Not a law. In base 10 with `x = 100`, `y = 10`: `log 90 ≈ 1.954`, but 2 − 1 = 1." },
          { t:law(LB + "(x/y) = " + LB + " x ÷ " + LB + " y"), why:"Dividing logs is a change of base: `log 100 ÷ log 10 = 2`, but `log(100/10) = 1`." },
          { t:law(LB + "(x/y) = " + LB + " y - " + LB + " x"), why:"Upside down: that’s `" + LB + "(y/x)`, the opposite number." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Evaluate `log_{12} 8 + log_{12} 18`.", options:[
          { t:"`2`", ok:true, why:"`log_{12}(8 × 18) = log_{12} 144 = 2`, since `12^2 = 144`." },
          { t:"`12`", why:"That’s 144 ÷ 12. A log is an exponent: `12^2 = 144`." },
          { t:"`144`", why:"That’s the product 8 × 18. The answer is its log, `log_{12} 144`." },
          { t:"`log_{12} 26`", why:"Adding logs multiplies the numbers inside: 8 × 18, not 8 + 18." }] },
        b:{ prompt:"Evaluate `log_3 162 - log_3 2`.", options:[
          { t:"`4`", ok:true, why:"`log_3(162 ÷ 2) = log_3 81 = 4`, since `3^4 = 81`." },
          { t:"`27`", why:"That’s 81 ÷ 3. A log is an exponent: `3^4 = 81`." },
          { t:"`81`", why:"That’s the quotient 162 ÷ 2. The answer is its log, `log_3 81`." },
          { t:"`log_3 160`", why:"Subtracting logs divides the numbers inside: 162 ÷ 2, not 162 − 2." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"`2 log 6 + log k - log 9 = 2`, where `k > 0`. Find `k`.", options:[
          { t:"`25`", ok:true, why:"`2 log 6 = log 36` (power law), so the left side is `log(36k ÷ 9) = log(4k)`. `log(4k) = 2` means `4k = 10^2 = 100`, so `k = 25`. Check: `log(36 × 25 ÷ 9) = log 100 = 2`." },
          { t:"`1/2`", why:"That solves `4k = 2`. A log equal to 2 means the number inside is `10^2 = 100`, so `4k = 100`." },
          { t:"`73`", why:"That solves `36 + k - 9 = 100`, adding and subtracting the numbers inside. The laws multiply and divide them: `36k ÷ 9 = 100`." },
          { t:"`75`", why:"That uses `2 log 6 = log 12`. The coefficient becomes an exponent: `2 log 6 = log 36`." }] },
        b:{ prompt:"`2 log_3 6 + log_3 k - log_3 4 = 4`, where `k > 0`. Find `k`.", options:[
          { t:"`9`", ok:true, why:"`2 log_3 6 = log_3 36` (power law), so the left side is `log_3(36k ÷ 4) = log_3(9k)`. `log_3(9k) = 4` means `9k = 3^4 = 81`, so `k = 9`. Check: `log_3(36 × 9 ÷ 4) = log_3 81 = 4`." },
          { t:"`4/9`", why:"That solves `9k = 4`. A log equal to 4 in base 3 means the number inside is `3^4 = 81`, so `9k = 81`." },
          { t:"`27`", why:"That uses `2 log_3 6 = log_3 12`. The coefficient becomes an exponent: `2 log_3 6 = log_3 36`." },
          { t:"`49`", why:"That solves `36 + k - 4 = 81`, adding and subtracting the numbers inside. The laws multiply and divide them: `36k ÷ 4 = 81`." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"`" + LB + " 2 = p` and `" + LB + " 3 = q`. Which expression equals `" + LB + " 54`?", options:[
          { t:"`p + 3q`", ok:true, why:"54 = 2 × `3^3`, so `" + LB + " 54 = " + LB + " 2 + 3 " + LB + " 3 = p + 3q`." },
          { t:"`3p + q`", why:"That’s `" + LB + "(2^3 × 3) = " + LB + " 24`. 54 = 2 × 27 has the cube on the 3." },
          { t:"`3pq`", why:"The logs of the factors add; they don’t multiply." },
          { t:"`p + q^3`", why:"The power law gives `3 " + LB + " 3 = 3q`, not `(" + LB + " 3)^3`." }] },
        b:{ prompt:"`" + LB + " 2 = p` and `" + LB + " 5 = r`. Which expression equals `" + LB + " 0.08`?", options:[
          { t:"`p - 2r`", ok:true, why:"0.08 = 8/100 = 2/25 = `2/5^2`, so `" + LB + " 0.08 = " + LB + " 2 - 2 " + LB + " 5 = p - 2r`." },
          { t:"`2r - p`", why:"That’s `" + LB + "(25/2) = " + LB + " 12.5`, upside down. The top’s log comes first." },
          { t:"`p/(2r)`", why:"That’s `" + LB + " 2 ÷ " + LB + " 25`. The quotient law subtracts the logs; it doesn’t divide them." },
          { t:"`p - r^2`", why:"The power law gives `" + LB + "(5^2) = 2 " + LB + " 5 = 2r`, not `(" + LB + " 5)^2`." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"`log(x + 5) = log x + log 5` is not a law, but it is true for exactly one value of `x`. Which value?", options:[
          { t:"`5/4`", ok:true, why:"`log x + log 5 = log(5x)`, so the equation needs `x + 5 = 5x`, which gives `4x = 5` and `x = 5/4`. Check: `5/4 + 5 = 25/4 = 5 × 5/4`." },
          { t:"`2`", why:"2 + 2 = 2 × 2 made (2, 2) a lucky pair, but one lucky pair says nothing about another equation. Here the second number is 5: `log 7 ≠ log 10`." },
          { t:"`5`", why:"Reusing the number in the equation doesn’t solve it. With `x = 5` the left side is `log 10 = 1`, but the right side is `log 25 ≈ 1.398`." },
          { t:"`5/6`", why:"That comes from `x + 5 = 5x` rearranged as `5 = 6x`. Moving `5x` across gives `5 = 4x`." }] },
        b:{ prompt:"`log_2(x + 4) = log_2 x + log_2 4` is not a law, but it is true for exactly one value of `x`. Which value?", options:[
          { t:"`4/3`", ok:true, why:"`log_2 x + log_2 4 = log_2(4x)`, so the equation needs `x + 4 = 4x`, which gives `x = 4/3`. Check: `4/3 + 4 = 16/3 = 4 × 4/3`." },
          { t:"`2`", why:"(2, 2) was the lucky pair when both numbers were 2, but one lucky pair says nothing about another equation. Here: `log_2 6 ≈ 2.585`, but `log_2 8 = 3`." },
          { t:"`4`", why:"Reusing the number in the equation doesn’t solve it. With `x = 4` the left side is `log_2 8 = 3`, but the right side is `log_2 16 = 4`." },
          { t:"`4/5`", why:"That comes from `x + 4 = 4x` rearranged as `4 = 5x`. Moving `4x` across gives `4 = 3x`." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why `" + LB + "(xy) = " + LB + " x + " + LB + " y`?", options:[
          { t:"“Let `" + LB + " x = m` and `" + LB + " y = n`, so `x = " + B + "^m` and `y = " + B + "^n`. Then `xy = " + B + "^m · " + B + "^n = " + B + "^{m+n}`, so `" + LB + "(xy) = m + n`.”", ok:true, why:"This uses the meaning of a log and the exponent law, and it works for every positive `x` and `y`." },
          { t:"“A log acts on each factor in turn, the way a number in front of brackets multiplies each term inside, so `" + LB + "(xy)` spreads out into `" + LB + " x + " + LB + " y`.”", why:"This names a habit without giving a reason, and “spreading the log out” over each piece is exactly the habit that leads to `log(x + y) = log x + log y`." },
          { t:"“Check it with numbers: for `x = 2` and `y = 5`, `log(2 × 5) = log 10 = 1`, and `log 2 + log 5 ≈ 0.301 + 0.699 = 1`. The sides match, so the law is true.”", why:"One example doesn’t prove a law. `log(2 + 2) = log 2 + log 2` works too, and that claim is false." },
          { t:"“Multiplying is repeated adding, so the product `xy` can be built from `x` and `y` by adding. That makes `log(xy)` the same as `log(x + y)`, which splits into `log x + log y`.”", why:"`log(x + y)` doesn’t split. Check `x = 2`, `y = 3`: `log 5 ≠ log 6`." }] },
        b:{ prompt:"Which is the best explanation of why `" + LB + "(x/y) = " + LB + " x - " + LB + " y`?", options:[
          { t:"“Let `" + LB + " x = m` and `" + LB + " y = n`, so `x = " + B + "^m` and `y = " + B + "^n`. Then `x/y = " + B + "^m ÷ " + B + "^n = " + B + "^{m-n}`, so `" + LB + "(x/y) = m - n`.”", ok:true, why:"This uses the meaning of a log and the exponent law, and it works for every positive `x` and `y`." },
          { t:"“Logs turn every fraction bar into a minus sign: the top of `x/y` becomes `" + LB + " x`, the bottom becomes `" + LB + " y`, and the bar between them becomes a minus.”", why:"This describes what the result looks like without saying why it’s true." },
          { t:"“Check it with numbers: for `x = 100` and `y = 10`, `log(100/10) = log 10 = 1`, and `log 100 - log 10 = 2 - 1 = 1`. The sides match, so the law is true.”", why:"One example doesn’t prove a law. `log(2 + 2) = log 2 + log 2` also matches, and that claim is false." },
          { t:"“Taking the log of `x/y` is the same as taking each log first and then dividing, `" + LB + " x ÷ " + LB + " y`, and that is the same as `" + LB + " x - " + LB + " y`.”", why:"Not true: `log 100 ÷ log 10 = 2`, but `log 100 - log 10 = 1`." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which statement is written correctly and is true for every `x > 0`?", options:[
          { t:"`log_2(8x) = 3 + log_2 x`", ok:true, why:"The base is a subscript, the brackets show what the log acts on, and the product law gives `log_2 8 + log_2 x`." },
          { t:"`log 2(8x) = 3 + log_2 x`", why:"The base must be written as a subscript. “`log 2(8x)`” reads as the common log of 2 × `8x = 16x`." },
          { t:"`log_2(8 + x) = 3 + log_2 x`", why:"A sum inside a log doesn’t split. At `x = 8`: `log_2 16 = 4`, but 3 + 3 = 6." },
          { t:"`log_2(8x) = 3 log_2 x`", why:"That multiplies `log_2 8` by `log_2 x`. The logs add." }] },
        b:{ prompt:"Which statement is written correctly and is true for every `x > 0`?", options:[
          { t:"`log_3(x/9) = log_3 x - 2`", ok:true, why:"The base is a subscript, the brackets show what the log acts on, and the quotient law gives `log_3 x - log_3 9`." },
          { t:"`log 3(x/9) = log_3 x - 2`", why:"The base must be written as a subscript. “`log 3(x/9)`” reads as the common log of 3 × `x/9`." },
          { t:"`log_3(x - 9) = log_3 x - 2`", why:"A difference inside a log doesn’t split. At `x = 27`: `log_3 18 ≈ 2.631`, but 3 − 2 = 1." },
          { t:"`log_3(x/9) = log_3 x / 2`", why:"The quotient law subtracts `log_3 9 = 2`; it doesn’t divide by it." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A whole number `N` has `k` digits exactly when `k - 1 ≤ log N < k`. How many digits does `24^{10}` have?", use:"`log 2 ≈ 0.301` and `log 3 ≈ 0.477`", options:[
          { t:"14", ok:true, why:"24 = `2^3` × 3, so `log 24 = 3 log 2 + log 3 ≈ 0.903 + 0.477 = 1.380`, and `log 24^{10} = 10 log 24 ≈ 13.80`. Since 13 ≤ 13.80 < 14, `24^{10}` has 14 digits." },
          { t:"5", why:"That uses `log 24 = log 8 × log 3 ≈ 0.903 × 0.477 ≈ 0.431`, giving 10 × 0.431 ≈ 4.3, so 5 digits. The logs of the factors add." },
          { t:"13", why:"13 is the whole-number part of 13.80. A number whose log is between 13 and 14 has 14 digits (`10^{13}` itself has 14)." },
          { t:"15", why:"That rounds 13.80 up to 14 and then adds 1, counting one digit twice." }] },
        b:{ prompt:"A whole number `N` has `k` digits exactly when `k - 1 ≤ log N < k`. How many digits does `12^{15}` have?", use:"`log 2 ≈ 0.301` and `log 3 ≈ 0.477`", options:[
          { t:"17", ok:true, why:"`log 12 = 2 log 2 + log 3 ≈ 1.079`, so `log 12^{15} = 15 log 12 ≈ 16.19`. Since 16 ≤ 16.19 < 17, `12^{15}` has 17 digits." },
          { t:"5", why:"That uses `log 12 = log 4 × log 3 ≈ 0.287`, giving 15 × 0.287 ≈ 4.3, so 5 digits. The logs of the factors add." },
          { t:"16", why:"16 is the whole-number part of 16.19. A number whose log is between 16 and 17 has 17 digits." },
          { t:"18", why:"That rounds 16.19 up to 17 and then adds 1, counting one digit twice." }] } },
      { id:"a2", cat:"A", goal:1,
        a:{ prompt:"An engineer’s slide rule has C’s 1 above some unknown mark on D. The cursor on C’s 4 reads 9 on D. Without moving the slide, the cursor moves to C’s 6. What does D read now?", options:[
          { t:"13.5", ok:true, why:"C’s 1 is above 9 ÷ 4 = 2.25, so the rule is multiplying by 2.25: 2.25 × 6 = 13.5. (Or: from C’s 4 to C’s 6 is a ratio of 1.5, and equal ratios make equal gaps, so 9 × 1.5 = 13.5.)" },
          { t:"2.25", why:"That’s the hidden mark under C’s 1. The question asks for the reading at C’s 6: 2.25 × 6." },
          { t:"11", why:"That treats it as an ordinary ruler, where moving from 4 to 6 adds 2. On a log rule the gap multiplies by 6/4 = 1.5." },
          { t:"54", why:"That’s 9 × 6, which forgets that C’s 4 already gave 9. The reading at C’s 6 is 9 × 6/4." }] },
        b:{ prompt:"An engineer’s slide rule has C’s 1 above some unknown mark on D. The cursor on C’s 5 reads 12 on D. Without moving the slide, the cursor moves to C’s 2. What does D read now?", options:[
          { t:"4.8", ok:true, why:"C’s 1 is above 12 ÷ 5 = 2.4, so the rule is multiplying by 2.4: 2.4 × 2 = 4.8. (Or: from C’s 5 to C’s 2 is a ratio of 2/5, so 12 × 2/5 = 4.8.)" },
          { t:"2.4", why:"That’s the hidden mark under C’s 1. The question asks for the reading at C’s 2: 2.4 × 2." },
          { t:"9", why:"That treats it as an ordinary ruler, where moving from 5 to 2 subtracts 3. On a log rule the reading is multiplied by 2/5." },
          { t:"24", why:"That’s 12 × 2, which forgets that C’s 5 already gave 12. The reading at C’s 2 is 12 × 2/5." }] } }
    ]
  },
  task:{
    title:"Land exactly on 2", summary:"Land exactly on 2",
    statement:"<p>Choose a base `" + B + "` and three <strong>different</strong> whole numbers `m`, `n` and `p` from 2 to 60 so that `" + LB + " m + " + LB + " n - " + LB + " p` is <strong>exactly 2</strong>, even though <strong>none</strong> of the three logs is a whole number on its own. There are many answers. Can you find three?</p>",
    checks:["`m`, `n` and `p` are different whole numbers from 2 to 60", "None of `" + LB + " m`, `" + LB + " n`, `" + LB + " p` is a whole number", "The total is exactly 2"],
    tips:["Use three different whole numbers from 2 to 60.", "Choose numbers that aren’t powers of `" + B + "`. They can share a factor with `" + B + "`; they just can’t be made of `" + B + "` alone.", "For exactly 2 you need `m × n ÷ p = " + B + "^2`."],
    explainPrompt:"Explain why your numbers land exactly on 2.",
    vocab:"Use the words product law, quotient law and power.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another? (Swapping `m` and `n` doesn’t count as new.)",
    after3:"You’ve found three. Each one is a way of writing `" + B + "^2` as `m × n ÷ p`. Can you find one in a different base?"
  },
  cards:[
    ["Product law", "`" + LB + "(xy) = " + LB + " x + " + LB + " y`, for `x, y > 0`. Example: `log_6 4 + log_6 9 = log_6 36 = 2`."],
    ["Quotient law", "`" + LB + "(x/y) = " + LB + " x - " + LB + " y`, for `x, y > 0`. Example: `log_2 96 - log_2 3 = log_2 32 = 5`."],
    ["Why the product law works", "If `x = " + B + "^m` and `y = " + B + "^n`, then `xy = " + B + "^{m+n}`. Logs are exponents, so `" + LB + "(xy) = m + n`."],
    ["Why the quotient law works", "If `x = " + B + "^m` and `y = " + B + "^n`, then `x/y = " + B + "^{m-n}`, so `" + LB + "(x/y) = m - n`."],
    ["`" + LB + "(1/x)`", "`-" + LB + " x`, by the quotient law with `" + LB + " 1 = 0`. Example: `log_2(1/8) = -3`."],
    ["The slide rule", "The distance from 1 to `x` is `log x`. Lengths end to end add, so the numbers multiply; going back subtracts, so the numbers divide."],
    ["Equal ratios, equal gaps", "On a log scale the gap from `a` to `b` is `log(b/a)`. From 1 to 2, 2 to 4 and 4 to 8 are all `log 2 ≈ 0.301`."],
    ["Impostor: `log(x + y)`", "It can’t be split. `log x + log y = log(xy)`. Check `x = 2`, `y = 3`: `log 5 ≈ 0.699`, but `log 6 ≈ 0.778`."],
    ["Impostors: `log x · log y` and `log x ÷ log y`", "Neither is a single log of `xy` or `x/y`. `log_2 8 · log_2 4 = 6`, but `log_2 32 = 5`. `log x ÷ log y = log_y x` (change of base)."],
    ["Coefficients when condensing", "Use the power law first: `2 log 5 = log 25`, not `log 10`. So `2 log 5 + log 4 = log 100 = 2`."],
    ["Same base only", "The laws only combine logs with the same base. `log_2 8 + log_4 16 = 3 + 2 = 5`."],
    ["Estimating with `log 2 ≈ 0.301` and `log 3 ≈ 0.477`", "`log 6 ≈ 0.778`, `log 5 = 1 - log 2 ≈ 0.699`, `log 1.5 = log 3 - log 2 ≈ 0.176`, `log 0.6 = log 6 - 1 ≈ -0.222`."]
  ]
};
