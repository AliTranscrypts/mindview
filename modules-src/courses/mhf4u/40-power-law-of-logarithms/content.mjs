// MHF4U 40 Power Law of Logarithms. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/40-power-law-of-logarithms.md
const LB = "log_{@b{b}}";             // log with a brown b subscript (colour key: b is --p-b)
const N = "@n{n}";                    // the exponent n in blue (--pen)

// ---------- Practice 1 (sort by value): feedback and hints built from each item (plan "Mistake feedback") ----------
const BOX = { b1:[3, 2], b2:[2, 3], b3:[-3, 2], b4:[-2, 3] };          // box values as [num, den]
const VAL = { b1:"3/2", b2:"2/3", b3:"−3/2", b4:"−2/3" };
const upside = (q, p) => "Right sign, but upside down. Divide the <strong>number’s</strong> exponent by the <strong>base’s</strong> exponent: " + q + " ÷ " + p + ".";
const SIGNR = { num:["The number is less than 1", "the count is negative"], base:["The base is less than 1", "the count is negative"], both:["The base and the number are both greater than 1", "the count is positive"] };
const wrongSign = r => "Right size, wrong sign. " + SIGNR[r][0] + ", so " + SIGNR[r][1] + ".";
const bothWrong = (q, p, r) => "Upside down. Divide the <strong>number’s</strong> exponent by the <strong>base’s</strong> exponent: " + q + " ÷ " + p + ". Wrong sign too. " + SIGNR[r][0] + ", so " + SIGNR[r][1] + ".";
// sortItem(id, tile, box, why, base, number, c (common base), p, q (exponent texts), reason for the sign, hints?)
function sortItem(id, t, box, why, base, number, c, p, q, r, hints){
  const wrong = {}, [an, ad] = BOX[box];
  for (const k of Object.keys(BOX)) {
    if (k === box) continue;
    const [kn, kd] = BOX[k], sameSign = Math.sign(kn) === Math.sign(an), sameSize = Math.abs(kn) === Math.abs(an) && kd === ad;
    wrong[k] = sameSign ? upside(q, p) : sameSize ? wrongSign(r) : bothWrong(q, p, r);
  }
  return { id, t, answer:box, why, wrong, hints:hints || [
    "Write " + base + " and " + number + " as powers of one common base.",
    base + " = `" + c + "^{" + p.replace(/[()]/g, "") + "}` and " + number + " = `" + c + "^{" + q.replace(/[()]/g, "") + "}`.",
    q + " ÷ " + p + " = " + VAL[box] + ", so it goes in the " + VAL[box] + " box."] };
}

export default {
  id:"40-power-law-of-logarithms",
  kind:"topic",
  title:"Power law of logarithms",
  topic:"Power Law of Logarithms",
  readyTopic:"the power law of logarithms",
  hero:{
    eq:"`" + LB + "(x^{" + N + "}) = " + N + " " + LB + " x`", eqLabel:"log base b of x to the power n equals n times log base b of x", eqSize:"md",
    headline:"A power inside a log comes out as a multiplier",
    text:"A logarithm is an exponent: `" + LB + " x` is the power you raise `@b{b}` to, to get `x`. So the exponent law `(@b{b}^m)^{" + N + "} = @b{b}^{m" + N + "}` has a logarithm twin, the <strong>power law of logarithms</strong>: `" + LB + "(x^{" + N + "}) = " + N + " " + LB + " x`, for `x > 0`. It turns a power into a multiplication. It also gives the <strong>change of base formula</strong>, `" + LB + " x = log x / log @b{b}`, which lets you find a logarithm in any base using only common logarithms.",
    fig:{ aria:"A base-2 log ruler with numbers 1, 2, 4, 8, 16, 32 and 64 equally spaced. A block from 1 to 4 is copied end to end three times and lands on 64. Then the length labels change to base-10 lengths while the blocks stay where they are." }
  },
  goals:[
    "I can explain why `" + LB + "(x^{" + N + "}) = " + N + " " + LB + " x`, using the exponent law `(@b{b}^m)^{" + N + "} = @b{b}^{m" + N + "}` and the picture of `" + N + "` equal lengths laid end to end.",
    "I can use the power law to evaluate logarithms of powers, roots and reciprocals, such as `log_2 ∛16` or `log(1/1000)`, and to write `" + N + " " + LB + " x` as a single logarithm.",
    "I can use the change of base formula `" + LB + " x = log x / log @b{b}`: exactly when both numbers are powers of a common base, and approximately from given values when they aren’t.",
    "I can tell equivalent logarithmic expressions from ones that only look alike, such as `log(x^2)` and `(log x)^2`, and say for which `x` the power law holds.",
    "I can use the power law and change of base to solve problems: estimate a logarithm, work backwards to an unknown base or number, and answer questions about size and number of steps."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Exponent laws", goal:1, prompt:"Simplify `(2^3)^4`.",
          options:[
            { t:"`2^{12}`", ok:true, why:"A power of a power: multiply the exponents. `(2^3)^4 = 2^3 × 2^3 × 2^3 × 2^3 = 2^{3 + 3 + 3 + 3} = 2^{12}`." },
            { t:"`2^7`", why:"Adding exponents is for multiplying two powers, like `2^3 × 2^4`. Here `2^3` is used 4 times, so the exponent is 3 × 4 = 12." },
            { t:"`2^{81}`", why:"That’s 2 to the power `3^4`. `(2^3)^4` means `2^3` multiplied by itself 4 times, so the exponent is 3 × 4." },
            { t:"`6^4`", why:"`2^3` is 8, not 2 × 3 = 6. `(2^3)^4 = 8^4 = 2^{12}`." }],
          hints:["`(2^3)^4` means `2^3 × 2^3 × 2^3 × 2^3`.", "Multiplying powers of 2 adds their exponents: 3 + 3 + 3 + 3.", "That’s 3 × 4 = 12, so `(2^3)^4 = 2^{12} = 4096`."] },
        { id:"w2", skill:"Exponent laws", goal:1, prompt:"`5^m = 7`. What is `5^{3m}`?",
          options:[
            { t:"343", ok:true, why:"`5^{3m} = (5^m)^3 = 7^3 = 343`." },
            { t:"21", why:"21 = 3 × 7 would be `3 × 5^m`. Tripling the <strong>exponent</strong> cubes the power: `5^{3m} = (5^m)^3`." },
            { t:"10", why:"Adding 3 to 7 isn’t an exponent law. `5^{3m} = (5^m)^3`." },
            { t:"2187", why:"That’s `3^7`. You need `7^3 = 343`." }],
          hints:["Write `5^{3m}` using `5^m`.", "By the power-of-a-power law, `5^{3m} = (5^m)^3`.", "`(5^m)^3 = 7^3 = 343`."] },
        { id:"w3", skill:"Rational and negative exponents", goal:2, prompt:"Write `1/√8` as a power of 2.",
          options:[
            { t:"`2^{-3/2}`", ok:true, why:"8 = `2^3`, so `√8 = (2^3)^{1/2} = 2^{3/2}`, and 1 over it is `2^{-3/2}`." },
            { t:"`2^{3/2}`", why:"That’s `√8` itself. Putting a power under 1 makes its exponent negative." },
            { t:"`2^{-2/3}`", why:"A square root multiplies the exponent by 1/2: 3 × 1/2 = 3/2, not 2/3." },
            { t:"`2^{-3}`", why:"`2^{-3} = 1/8`. The square root halves the exponent, so `1/√8 = 2^{-3/2}`." }],
          hints:["Write 8 as a power of 2 first.", "8 = `2^3`. A square root is the power 1/2, so `√8 = 2^{3/2}`.", "`1/√8 = 1/2^{3/2} = 2^{-3/2}`."] },
        { id:"w4", skill:"Exponential and logarithmic form", goal:1, prompt:"If `log_b x = m`, which equation must be true?",
          options:[
            { t:"`b^m = x`", ok:true, why:"A logarithm is an exponent: `log_b x = m` says that `b` to the power `m` is `x`." },
            { t:"`x^m = b`", why:"Test it with `log_2 8 = 3`: `2^3 = 8` is true, but `8^3 = 2` is not." },
            { t:"`m^b = x`", why:"Test it with `log_2 8 = 3`: `3^2 = 9`, not 8. The base is the one being raised to a power." },
            { t:"`b^x = m`", why:"Test it with `log_2 8 = 3`: `2^8 = 256`, not 3." }],
          hints:["Try a log you know: `log_2 8 = 3`.", "`log_2 8 = 3` because `2^3 = 8`. Which letter plays the part of 2, which plays 3, and which plays 8?", "The base `b` raised to the log `m` gives the number `x`: `b^m = x`."] },
        { id:"w5", skill:"Evaluating logarithms", goal:2, prompt:"Evaluate `log_2 32`.",
          options:[
            { t:"5", ok:true, why:"`2^5 = 32`, so `log_2 32 = 5`." },
            { t:"1/5", why:"1/5 is `log_32 2`. `log_2 32` asks what power of 2 gives 32." },
            { t:"4", why:"That product has four × signs but five 2s: `2^5 = 32`." },
            { t:"16", why:"`log_2 32` isn’t 32 ÷ 2. It’s the exponent: 2 to what power is 32?" }],
          hints:["What power of 2 gives 32?", "Count the doublings from 1: 2, 4, 8, 16, 32.", "Five doublings: `2^5 = 32`, so `log_2 32 = 5`."] },
        { id:"w6", skill:"Evaluating logarithms", goal:2, prompt:"Evaluate `log 0.001`.",
          options:[
            { t:"−3", ok:true, why:"0.001 = 1/1000 = `10^{-3}`, so `log 0.001 = -3`." },
            { t:"−2", why:"0.001 has two zeros after the point, but it is 1/1000 = `10^{-3}`." },
            { t:"3", why:"`log 1000 = 3`. 0.001 is less than 1, so its log is negative." },
            { t:"It’s undefined", why:"The number inside, 0.001, is positive, so its log exists. It’s the log itself that’s negative: −3." }],
          hints:["Write 0.001 as a power of 10.", "0.001 = 1/1000 = `1/10^3 = 10^{-3}`.", "`log 0.001 = log 10^{-3} = -3`."] }
      ],
      refreshers:{
        "Exponent laws":"Multiplying powers of the same base adds the exponents: `2^3 × 2^4 = 2^7`. A power of a power multiplies them: `(2^3)^4 = 2^{12}`, because `2^3` is used four times. The same law works backwards: `5^{3m} = (5^m)^3`. This law is the whole reason the power law of logarithms works.",
        "Rational and negative exponents":"A negative exponent means “one over”: `2^{-3} = 1/8`. A fractional exponent means a root: `x^{1/2} = √x` and `x^{1/3} = ∛x`. They combine: `1/√8 = 1/(2^3)^{1/2} = 2^{-3/2}`.",
        "Exponential and logarithmic form":"`log_b x = m` and `b^m = x` say the same thing. A logarithm is an exponent: `log_2 8 = 3` because `2^3 = 8`. “`log x`” with no base written means base 10 (module 38).",
        "Evaluating logarithms":"Ask: what power of the base gives the number? `log_2 32 = 5` because `2^5 = 32`; `log 0.001 = -3` because `10^{-3} = 0.001`. The number inside must be positive, but the log can be negative, zero or positive (module 38)."
      }
    }
  },
  explore:{
    heading:"Power stacker",
    intro:"A logarithm is a length on a log ruler. Lay copies of one length end to end and see where they land. Then measure one length in steps of another, and compare the graphs. Three modes, one idea.",
    predictions:[
      { id:"p1", start:{ mode:"stack", b:10, x:"2", n:[1, 1] },
        prompt:"One block runs from 1 to 2 on a base-10 ruler. The stack will grow to three of these blocks in all, laid end to end. Where will the stack end?",
        options:[{ t:"8", ok:true }, { t:"6" }, { t:"9" }, { t:"1000" }],
        explain:"Each block is a factor of 2: 1 to 2, 2 to 4 and 4 to 8 are the same length on a log ruler. Three blocks reach 2 × 2 × 2 = `2^3 = 8`, so `log 8 = 3 log 2`. The stack doesn’t add 2 each time (that would give 6), it doesn’t reach `3^2 = 9`, and three blocks reach 1000 only when each block runs from 1 to 10.",
        rm:"`@n{n}` went from 1 to 3; the stack now ends at 8." },
      { id:"p2", start:{ mode:"stack", b:3, x:"9", n:[1, 1] },
        prompt:"`@n{n}` will change from 1 to 1/2, so only half of the block is used. Where will the half block end?",
        options:[{ t:"3", ok:true }, { t:"1" }, { t:"4.5" }, { t:"81" }],
        explain:"Half the <strong>length</strong> means half the <strong>exponent</strong>: `9^{1/2} = √9 = 3`, and `log_3 3 = 1`, which is half of `log_3 9 = 2`. Halving the number gives 4.5, but `log_3 4.5 ≈ 1.37`, not 1. The half block’s length is 1, but it ends at the number 3. And 81 is what two blocks reach (`@n{n} = 2`).",
        rm:"`@n{n}` went from 1 to 1/2; the half block now ends at 3, and 4.5 is marked further right." },
      { id:"p3", start:{ mode:"measure", b:"8", x:"32", units:"2", swap:false },
        prompt:"The ruler’s units will change from base 2 to base 10. Both lengths will be relabelled. What will happen to the count of 8-sticks?",
        options:[{ t:"It stays 5/3", ok:true }, { t:"It becomes 4, because 32 ÷ 8 = 4" }, { t:"It becomes `log 4 ≈ 0.602`" }, { t:"It shrinks to about 0.3 times as much, because the lengths are multiplied by `log 2 ≈ 0.301`" }],
        explain:"Changing the units multiplies <strong>both</strong> lengths by the same number (here `log 2 ≈ 0.301`), so their ratio doesn’t change. That’s the change of base formula: `log_8 32 = log 32 / log 8 = log_2 32 / log_2 8 = 5/3`, whichever base you measure in. Dividing 32 by 8, or taking `log(32/8)`, treats a ratio of <strong>logs</strong> as if it were a ratio of numbers.",
        rm:"The units changed from base 2 to base 10: the lengths now read ≈ 1.505 and ≈ 0.903, and the count is still 5/3." },
      { id:"p4", start:{ mode:"graph", law:"power", b:10, n:2 },
        prompt:"The teal curve is `y = 2 log x`. The blue curve `y = log(x^2)` will be drawn next. What will you see?",
        options:[{ t:"It lies exactly on the teal curve for `x > 0`, and also has a mirror-image branch for `x < 0`", ok:true }, { t:"It lies exactly on the teal curve, and nowhere else" }, { t:"It lies on the teal curve only where `x > 1`" }, { t:"It’s a U-shaped curve, the graph of `(log x)^2`" }],
        explain:"For `x > 0`, `log(x^2) = 2 log x`: that’s the power law, including `0 < x < 1`, where both are negative. But `x^2` is positive for negative `x` too, so `log(x^2)` also exists for `x < 0`, where `2 log x` doesn’t. The power law needs `x > 0`. And `(log x)^2` is something else again: at `x = 1000`, `log(1000^2) = 6` but `(log 1000)^2 = 9`.",
        rm:"The blue curve `y = log(x^2)` was drawn: it lies on the teal curve for `x > 0` and has a second branch for `x < 0`." }
    ],
    challenges:[
      { id:"tc1", goal:[2, 5],
        prompt:"Stack mode. The base is 3 and the block is `log_3 9` (both locked). Choose `@n{n}` so the stack lands <strong>exactly</strong> on 1/81.",
        fb:{
          n2:"Your stack lands on 81: right distance, wrong direction. 1/81 is between 0 and 1, so it’s to the left of 1, and the blocks must point backwards.",
          nm4:"Your stack lands on 1/6561. Each 9-block is 2 units long on the base-3 ruler, so four of them go 8 units left. 1/81 = `3^{-4}` is only 4 units left of 1.",
          nmh:"Half a backward block reaches `9^{-1/2} = 1/3`. You need to go further.",
          nm1:"One backward block reaches 1/9. 1/81 is twice as far.",
          other:"Your stack lands on `9^{@n{n}}` = {v}. You need 1/81." },
        general:"Set up the stacker for this challenge first: Stack mode, base 3, block 9.",
        hints:["1/81 is less than 1. Which way must the blocks point?", "On the base-3 ruler, 1/81 = `3^{-4}` is 4 units left of 1, and each block is `log_3 9 = 2` units long.", "−4 ÷ 2 = −2, so `@n{n} = -2`. Check: `9^{-2} = 1/81`."] },
      { id:"tc2", goal:[2, 3],
        prompt:"Stack mode. The base is 2 and the block is `log_2 8` (both locked). Make the stack land <strong>exactly</strong> on 4. No slider step reaches it, so use the exact `@n{n}` box.",
        fb:{
          nh:"Half a block is a square root: `8^{1/2} = √8 ≈ 2.828`. 4 is a little further than half a block.",
          n13:"A third of a block is a cube root: `∛8 = 2`. 4 is two of those thirds.",
          n32:"You flipped the fraction: `8^{3/2} = 16√2 ≈ 22.627`. You need (length to 4) ÷ (length of the block).",
          n1:"One whole block reaches 8. 4 is less than one block.",
          other:"Your stack lands on `8^{@n{n}}` = {v}. You need 4." },
        general:"Set up the stacker for this challenge first: Stack mode, base 2, block 8.",
        hints:["On the base-2 ruler, how long is the block, and how far is 4 from 1?", "The block is `log_2 8 = 3` units, and 4 is `log_2 4 = 2` units from 1. You need `@n{n} × 3 = 2`.", "`@n{n} = 2/3`. Check: `8^{2/3} = (∛8)^2 = 2^2 = 4`. (You’ve just found `log_8 4 = 2/3` by change of base.)"] },
      { id:"tc3", goal:[3, 5], stretch:true,
        prompt:"Measure mode. Choose a base `@b{b}` and a number `x`, with `x ≠ @b{b}`, so that `log_{@b{b}} x` and `log_x @b{b}` are <strong>equal</strong>. Turn on Swap roles to see both measurements.",
        fb:{
          same:"Both values are 1, but that’s the same number twice. Choose `x ≠ @b{b}`.",
          one:"`log_{@b{b}} 1 = 0`, and 1 can’t be a base, so `log_1 @b{b}` doesn’t exist.",
          pair:"{L1} = {v1} but {L2} = {v2}. Swapping the two numbers always turns the value into its reciprocal. Which numbers equal their own reciprocal?",
          other:"Your values are {v1} and {v2}: reciprocals, as always when you swap. Make them equal." },
        general:"Switch the stacker to Measure mode first.",
        hints:["Turn on Swap roles. What happens to the count when `@b{b}` and `x` trade places?", "Swapping turns `log_{@b{b}} x` into `1/(log_{@b{b}} x)`, because (length to `@b{b}`) ÷ (length to `x`) is the upside-down ratio. So you need a number equal to its own reciprocal.", "Only 1 and −1 equal their own reciprocals. 1 needs `x = @b{b}`, which isn’t allowed. So `log_{@b{b}} x = -1`, which means `x = 1/@b{b}`: for example `@b{b} = 2` and `x = 1/2`."] }
    ]
  },
  part3:{
    slug:"base", name:"Change base",
    heading:"Base bridge: change of base without a calculator",
    intro:"Three rounds. In each one, find the logarithm without a calculator. The block bars check every step you make.",
    rounds:[
      { id:"r1", goal:3, title:"Round 1: a common base", find:"Find `log_4 128`.", base:"4", num:"128", c:2, p:2, q:7, copies:"3½ copies = 7/2",
        steps:[
          { id:"r1s1", kind:"chips", label:"Step 1, choose a common base", chips:["2", "3", "4", "10"], answer:"2",
            wrong:{ "3":"4 and 128 aren’t powers of 3. Both are built from 2s.", "10":"4 and 128 aren’t powers of 10. Both are built from 2s.", "4":"4 is a power of 4, but 128 isn’t a whole-number power of 4: `4^3 = 64` and `4^4 = 256`. Choose a base that builds both numbers in whole steps." },
            hints:["Which small number multiplies by itself to make both 4 and 128?", "4 = 2 × 2. Is 128 made only of 2s too?", "Choose 2: `4 = 2^2` and `128 = 2^7`."] },
          { id:"r1s2", kind:"boxes", label:"Step 2, write the powers", boxes:[{ pre:"`4 = 2`", sup:true }, { pre:"and `128 = 2`", sup:true }], answer:[2, 7],
            wrong:[{ box:1, v:6, fb:"`2^6 = 64`. Double once more." }, { box:1, v:64, fb:"64 is 128 ÷ 2. The exponent counts the 2s: `2^7 = 128`." }],
            general:"Check each power: 2 to your exponent should give the number.",
            hints:["Count the doublings from 1.", "2, 4 is two doublings. Keep going: 8, 16, 32, 64, 128.", "Enter 2 and 7."] },
          { id:"r1s3", kind:"frac", label:"Step 3, the logarithm", boxes:[{ pre:"`log_4 128 = log_2 128 / log_2 4 =`" }], answer:3.5, display:"`7/2`",
            wrong:[{ v:2 / 7, fb:"Upside down. The number’s exponent goes on top: 7 ÷ 2." }, { v:32, fb:"That’s 128 ÷ 4. Divide the <strong>exponents</strong>, not the numbers." }, { v:5, fb:"That’s 7 − 2. Counting 4-steps divides: 7 ÷ 2." }, { v:14, fb:"That’s 7 × 2. Each 4-step is two 2-steps, so there are <strong>fewer</strong> 4-steps, not more." }],
            general:"Divide the number’s exponent by the base’s exponent.",
            check:"`4^{7/2} = (√4)^7 = 2^7 = 128` ✓",
            hints:["`log_4 128` asks: how many 4-bars fit into the 128-bar?", "The 4-bar is 2 blocks long and the 128-bar is 7 blocks long.", "7 ÷ 2 = 7/2. Check: `4^{7/2} = 2^7 = 128`."] }
        ] },
      { id:"r2", goal:[2, 3], title:"Round 2: roots and reciprocals", find:"Find `log_{√3}(1/27)`.", base:"√3", num:"1/27", c:3, p:0.5, q:-3, copies:"−6",
        steps:[
          { id:"r2s1", kind:"chips", label:"Step 1, choose a common base", chips:["2", "3", "10"], answer:"3",
            wrongAll:"`√3` and 1/27 are both built from 3s.",
            hints:["What number is under the root sign, and what is 27 made of?", "`√3` is built from 3, and 27 = 3 × 3 × 3.", "Choose 3."] },
          { id:"r2s2", kind:"boxes", label:"Step 2, write the powers", boxes:[{ pre:"`√3 = 3`", sup:true }, { pre:"and `1/27 = 3`", sup:true }], answer:[0.5, -3],
            wrong:[{ box:0, v:2, fb:"A square root is the power 1/2, not 2: `(3^{1/2})^2 = 3`." }, { box:1, v:3, fb:"27 = `3^3`, so 1/27 = `3^{-3}`. One over a power makes its exponent negative." }],
            general:"Check each power: 3 to your exponent should give the number.",
            hints:["Write each number as 3 to some power. A square root is a power, and so is a reciprocal.", "`√3 = 3^{1/2}`. 27 = `3^3`, so 1/27 = `3^{-3}`.", "Enter 1/2 and −3."] },
          { id:"r2s3", kind:"frac", label:"Step 3, the logarithm", boxes:[{ pre:"`log_{√3}(1/27) = log_3(1/27) / log_3 √3 =`" }], answer:-6, display:"−6",
            wrong:[{ v:-1.5, fb:"That’s (−3) × (1/2). A half block is a short step, so it takes <strong>more</strong> steps: divide by 1/2." }, { v:6, fb:"Right size, wrong sign. 1/27 is to the left of the start and `√3` is to the right, so the count is negative." }, { v:-1 / 6, fb:"Upside down: that’s (1/2) ÷ (−3). The number’s exponent goes on top." }],
            general:"Divide the number’s exponent by the base’s exponent.",
            check:"`(√3)^{-6} = (3^{1/2})^{-6} = 3^{-3} = 1/27` ✓",
            hints:["How many `√3`-steps reach 1/27? Divide the number’s exponent by the base’s exponent.", "`log_3(1/27) = -3` and `log_3 √3 = 1/2`, so you need (−3) ÷ (1/2).", "(−3) ÷ (1/2) = −3 × 2 = −6. Check: `(√3)^{-6} = (3^{1/2})^{-6} = 3^{-3} = 1/27`."] }
        ] },
      { id:"r3", goal:[3, 5], title:"Round 3: no common base", find:"Estimate `log_2 5`.", use:"`log 2 ≈ 0.301`, `log 5 ≈ 0.699`", base:"2", num:"5", c:2, p:1, q:2.32,
        steps:[
          { id:"r3s1", kind:"boxes", label:"Step 1, bracket it", boxes:[{ pre:"`2`", sup:true }, { pre:"`< 5 < 2`", sup:true }], post:", so `log_2 5` is between those two whole numbers.", answer:[2, 3],
            wrong:[{ v:[1, 2], fb:"`2^1 = 2` and `2^2 = 4` are both less than 5." }, { v:[4, 8], fb:"Those are the powers. Enter the exponents: `4 = 2^2` and `8 = 2^3`." }],
            general:"Find the two whole-number powers of 2 on either side of 5.",
            note:"5 isn’t a whole-number power of 2, and 2 and 5 have no common base, so there’s no exact fraction. `log_2 5` still exists: it’s the exponent that turns 2 into 5.",
            hints:["List the powers of 2: 2, 4, 8, 16. Where does 5 fit?", "`2^2 = 4` is less than 5, and `2^3 = 8` is more.", "Enter 2 and 3."] },
          { id:"r3s2", kind:"boxes", label:"Step 2, change of base with the given values", boxes:[{ pre:"`log_2 5 = log 5 / log 2 ≈`" }, { pre:"/" }], answer:[0.699, 0.301],
            wrong:[{ v:[0.301, 0.699], fb:"Upside down: that’s `log_5 2`, which is less than 1. The number goes on top." }],
            general:"Use the given values: the number’s log over the base’s log.",
            hints:["Change of base: the number’s log over the base’s log.", "The number is 5 and the base is 2, so `log 5 ≈ 0.699` goes on top.", "Enter 0.699 / 0.301."] },
          { id:"r3s3", kind:"dec", label:"Step 3, estimate", boxes:[{ pre:"`log_2 5 ≈`" }], post:" (to one decimal place)", answer:{ v:2.3, lo:2.3, hi:2.34 }, display:"2.3",
            wrong:[{ v:2.5, fb:"That’s 5 ÷ 2: the logs were cancelled. Divide 0.699 by 0.301." }, { v:0.4, fb:"That’s 0.699 − 0.301 = 0.398, which is `log 2.5`, not `log_2 5`. Change of base divides." }, { v:0.398, fb:"That’s 0.699 − 0.301 = 0.398, which is `log 2.5`, not `log_2 5`. Change of base divides." }, { v:0.43, fb:"That’s 0.301 ÷ 0.699, upside down." }],
            outside:"Your answer should be between 2 and 3 (step 1).",
            inside:"Inside the bracket, but not close enough. Test it: 0.301 × {a} = {p}, and you need 0.699. Is your product too big or too small?",
            check:"0.301 × 2.3 ≈ 0.692 and 0.301 × 2.4 ≈ 0.722. 0.699 is between them, so 2.3 < `log_2 5` < 2.4 ✓",
            hints:["Divide 0.699 by 0.301. You can do it by testing products: 0.301 × 2.3 and 0.301 × 2.4.", "0.301 × 2.3 = 0.6923 and 0.301 × 2.4 = 0.7224. 0.699 is between them, much closer to the first.", "`log_2 5 ≈ 2.3` (more precisely about 2.32). It’s between 2 and 3, as step 1 said."] }
        ] }
    ],
    why:{
      title:"Why it works",
      intro:"Two short proofs. Choose the reason for each line. A wrong pick gets one line of feedback and another try.",
      reasons:["Definition of a logarithm", "Power-of-a-power law", "Power law of logarithms", "Take the common log of both sides", "Divide both sides by `log b`"],
      // one line of feedback per wrong reason (the plan gives the Proof 2, line 3 sample; the others describe what that reason does)
      wrongFb:[
        "The definition switches between `log_b x = m` and `b^m = x`. This line doesn’t switch forms.",
        "That law is about exponents: `(b^m)^n = b^{mn}`. This line doesn’t raise a power to a power.",
        "That law brings an exponent out of a logarithm. No exponent comes out of a log on this line.",
        "This line doesn’t take the logarithm of both sides of an equation.",
        "Nothing is divided on this line."],
      proofs:[
        { id:"pf1", title:"Proof 1: the power law", lines:[
          { t:"Let `m = log_b x`. Then `b^m = x`.", answer:0 },
          { t:"`x^n = (b^m)^n = b^{mn}`.", answer:1 },
          { t:"So `log_b(x^n) = mn = n log_b x`.", answer:0 }] },
        { id:"pf2", title:"Proof 2: change of base", lines:[
          { t:"Let `y = log_b x`. Then `b^y = x`.", answer:0 },
          { t:"`log(b^y) = log x`.", answer:3 },
          { t:"`y log b = log x`.", answer:2, special:{ "1":"That law is about exponents: `(b^m)^n = b^{mn}`. This line brings an exponent out of a <strong>logarithm</strong>. That’s the power law of logarithms." } },
          { t:"`y = log x / log b`.", answer:4, note:"This is allowed because `b ≠ 1`, so `log b ≠ 0`." }] }
      ],
      closing:"Change of base is the power law at work: line 3 brings the exponent `y` down."
    },
    blocks:[{ title:"What the methods mean", html:"<p><strong>Change of base without a calculator</strong></p><ol><li><strong>Look for a common base.</strong> Write both numbers as powers of it: `b = c^p` and `x = c^q`. Then `log_b x = q/p`, exactly.</li><li><strong>No common base?</strong> Bracket first with whole-number powers of `b`. Then use the given common logs: `log_b x = log x / log b`. Check that your answer sits inside the bracket.</li><li><strong>Check:</strong> `b` raised to your answer should give `x`.</li></ol>" }],
    quickCheck:{
      title:"Base check", summary:"Base check",
      items:[
        { id:"q1", goal:3, prompt:"`log_16 32`",
          choices:[{ t:"4/5", fb:"Upside down: that’s `log_32 16`." }, { t:"1", fb:"That’s 5 − 4. Change of base divides the exponents: 5 ÷ 4." }, { t:"5/4", ok:true, fb:"Right. 16 = `2^4` and 32 = `2^5`, so `log_16 32 = 5/4`. Check: `16^{5/4} = (2^4)^{5/4} = 2^5 = 32`." }, { t:"2", fb:"That’s 32 ÷ 16: the logs were cancelled." }] },
        { id:"q2", goal:3, prompt:"`log_8(1/16)`",
          choices:[{ t:"−4/3", ok:true, fb:"Right. 8 = `2^3` and 1/16 = `2^{-4}`, so the count is −4 ÷ 3 = −4/3. Check: `8^{-4/3} = 1/(∛8)^4 = 1/2^4 = 1/16`." }, { t:"−3/4", fb:"Upside down: that’s `log_{1/16} 8`." }, { t:"−1/3", fb:"That’s `log_8(1/2)`. 1/16 is four halvings, not one." }, { t:"4/3", fb:"Right size, wrong sign: 1/16 is less than 1." }] },
        { id:"q3", goal:3, fixedOrder:true, prompt:"`log_2 10` lies between…",
          choices:[{ t:"1 and 2", fb:"`log 10 = 1` is the base-10 log. In base 2, count doublings: 2, 4, 8, 16." }, { t:"2 and 3", fb:"`2^3 = 8` is still less than 10." }, { t:"3 and 4", ok:true, fb:"Right. `2^3 = 8 < 10 < 16 = 2^4`. (In fact `log_2 10 = 1/log 2 ≈ 3.32`.)" }, { t:"5 and 6", fb:"That’s 10 ÷ 2 = 5. A logarithm isn’t a division." }] },
        { id:"q4", goal:3, prompt:"Which expression equals `log_5 7`?",
          choices:[{ t:"`log 7 / log 5`", ok:true, fb:"Right. Change of base: the number’s log over the base’s log." }, { t:"`log 5 / log 7`", fb:"Upside down: that’s `log_7 5`, which is less than 1." }, { t:"`log(7/5)`", fb:"A quotient of logs isn’t the log of a quotient." }, { t:"7/5", fb:"The logs can’t be cancelled." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Sort by value", summary:"Sort by value", noun:"expression", goal:[3, 2],
        instruction:"Sort each logarithm into the box with its value. No calculator needed.",
        how:"Tap an expression, then tap the box it belongs in.",
        boxes:[{ id:"b1", label:"`3/2`" }, { id:"b2", label:"`2/3`" }, { id:"b3", label:"`-3/2`" }, { id:"b4", label:"`-2/3`" }],
        items:[
          sortItem("s1", "`log_4 8`", "b1", "4 = `2^2` and 8 = `2^3`, so the count is 3 ÷ 2.", "4", "8", "2", "2", "3", "both"),
          sortItem("s2", "`log_9 27`", "b1", "9 = `3^2` and 27 = `3^3`: 3 ÷ 2.", "9", "27", "3", "2", "3", "both"),
          sortItem("s3", "`log √1000`", "b1", "`√1000 = 10^{3/2}`, so `log √1000 = (1/2) × 3 = 3/2`. That’s the power law with `n = 1/2`.", "10", "`√1000`", "10", "1", "(3/2)", "both"),
          sortItem("s4", "`log_8 4`", "b2", "8 = `2^3` and 4 = `2^2`: 2 ÷ 3.", "8", "4", "2", "3", "2", "both"),
          sortItem("s5", "`log_27 9`", "b2", "27 = `3^3` and 9 = `3^2`: 2 ÷ 3.", "27", "9", "3", "3", "2", "both"),
          { id:"s6", t:"`(1/3) log_2 4`", answer:"b2", why:"`log_2 4 = 2`, and a third of it is 2/3. (By the power law it’s also `log_2 ∛4`.)",
            wrong:{ b1:"Right sign, but upside down. `log_2 4 = 2`, and a third of 2 is 2/3.", b3:"Right size, wrong sign. `log_2 4 = 2` is positive, and a third of it is positive too.", b4:"Right size, wrong sign. `log_2 4 = 2` is positive, and a third of it is positive too." },
            hints:["Work out `log_2 4` first.", "`log_2 4 = 2`. What is a third of it?", "(1/3) × 2 = 2/3, so it goes in the 2/3 box. (By the power law it’s also `log_2 ∛4 = log_2 2^{2/3} = 2/3`.)"] },
          sortItem("s7", "`log_4(1/8)`", "b3", "1/8 = `2^{-3}` and 4 = `2^2`: −3 ÷ 2.", "4", "1/8", "2", "2", "(−3)", "num"),
          sortItem("s8", "`log(1/√1000)`", "b3", "`1/√1000 = 10^{-3/2}`.", "10", "`1/√1000`", "10", "1", "(−3/2)", "num"),
          sortItem("s9", "`log_{1/4} 8`", "b3", "1/4 = `2^{-2}` and 8 = `2^3`: 3 ÷ (−2). The base is less than 1, so its sticks point left while 8 is to the right.", "1/4", "8", "2", "(−2)", "3", "base",
            ["Write 1/4 and 8 as powers of one common base.", "1/4 = `2^{-2}` and 8 = `2^3`. How many (1/4)-steps reach 8?", "3 ÷ (−2) = −3/2. Check: `(1/4)^{-3/2} = 4^{3/2} = 8`."]),
          sortItem("s10", "`log_8(1/4)`", "b4", "8 = `2^3` and 1/4 = `2^{-2}`: −2 ÷ 3.", "8", "1/4", "2", "3", "(−2)", "num"),
          sortItem("s11", "`log_{1/27} 9`", "b4", "1/27 = `3^{-3}` and 9 = `3^2`: 2 ÷ (−3).", "1/27", "9", "3", "(−3)", "2", "base"),
          sortItem("s12", "`log_{√8}(1/2)`", "b4", "`√8 = 2^{3/2}` and 1/2 = `2^{-1}`: −1 ÷ (3/2) = −2/3.", "`√8`", "1/2", "2", "(3/2)", "(−1)", "num",
            ["Write `√8` and 1/2 as powers of 2.", "`√8 = (2^3)^{1/2} = 2^{3/2}`, and 1/2 = `2^{-1}`.", "−1 ÷ (3/2) = −2/3. Check: `(√8)^{-2/3} = 2^{-1} = 1/2`."])
        ] },
      { id:"moves", type:"custom", title:"Power moves", summary:"Power moves", star:true, goal:[2, 3, 5],
        instruction:"Find each value without a calculator. The last four are puzzles: they need more than one step.",
        how:"Type your answer, then press Check. Fractions like −4/3 are fine.",
        items:[
          { id:"n1", goal:2, box:"fraction", prompt:"Evaluate `log_2(1/∛16)`.", answer:-4 / 3, display:"`-4/3`",
            wrong:[{ v:4 / 3, fb:"Right size, wrong sign. `1/∛16` is less than 1, so its log is negative." }, { v:-4, fb:"That’s `log_2(1/16)`. The cube root takes a third of that." }, { v:-3 / 4, fb:"Upside down. The cube root multiplies the exponent −4 by 1/3." }, { v:-16 / 3, fb:"That divides the <strong>number</strong> 16 by 3. Take a third of its <strong>log</strong>, `log_2 16 = 4`." }],
            hints:["Write `1/∛16` as a power of 2.", "16 = `2^4`, so `∛16 = 2^{4/3}` and `1/∛16 = 2^{-4/3}`.", "`log_2 2^{-4/3} = -4/3`."] },
          { id:"n2", goal:3, box:"fraction", prompt:"Evaluate `log_32 8`.", answer:3 / 5, display:"`3/5`",
            wrong:[{ v:5 / 3, fb:"Upside down: that’s `log_8 32`." }, { v:4, fb:"That’s 32 ÷ 8. Divide the exponents, not the numbers." }, { v:2, fb:"That’s 5 − 3. Divide: 3 ÷ 5." }],
            hints:["Write 32 and 8 as powers of 2.", "32 = `2^5` and 8 = `2^3`. What fraction of a 32-step is an 8?", "3 ÷ 5 = 3/5. Check: `32^{3/5} = 2^3 = 8`."] },
          { id:"n3", goal:3, box:"number", prompt:"`log_2 x = 12`. Find `log_8 x`.", answer:4, display:"`log_8 x = 4`",
            wrong:[{ v:36, fb:"8 = `2^3` is a bigger base, so it takes <strong>fewer</strong> steps: 12 ÷ 3, not 12 × 3." }, { v:1.5, fb:"That’s 12 ÷ 8. Divide by `log_2 8 = 3`, not by 8." }, { v:4096, fb:"That’s `x` itself (`2^{12}`). The question asks for `log_8 x`." }],
            hints:["Change of base: `log_8 x = log_2 x / log_2 8`.", "`log_2 8 = 3`.", "`log_8 x = 12 ÷ 3 = 4`. Check: `8^4 = 2^{12}`, and `log_2 2^{12} = 12`."] },
          { id:"n4", goal:5, box:"number", prompt:"`log_b 32 = 5/2`. Find `b`.", answer:4, display:"`b = 4`",
            wrong:[{ v:2, fb:"`log_2 32 = 5`, not 5/2. You took the fifth root of 32 but didn’t square it." }, { v:80, fb:"That’s 32 × 5/2. The log is an exponent: `b^{5/2} = 32`." }, { v:12.8, fb:"That’s 32 ÷ 5/2. Solve `b^{5/2} = 32` instead." }],
            hints:["Rewrite in exponential form: `b^{5/2} = 32`.", "Raise both sides to the power 2/5: `b = 32^{2/5}`.", "The fifth root of 32 is 2, and `2^2 = 4`, so `b = 4`. Check: `4^{5/2} = 2^5 = 32`."] },
          { id:"n5", goal:5, box:"decimal", star:true, prompt:"Estimate `log_3 29` to one decimal place.", use:"`log 3 ≈ 0.477` and `log 29 ≈ 1.462`",
            answer:{ v:3.1, lo:3.05, hi:3.1 }, display:"`log_3 29 ≈ 3.1`",
            wrong:[{ v:3, fb:"`3^3 = 27` is less than 29, so `log_3 29` is a little more than 3: 0.477 × 3 = 1.431 < 1.462." }, { v:0.33, fb:"Upside down: 0.477 ÷ 1.462 is `log_29 3`." }, { v:0.99, fb:"That’s 1.462 − 0.477. Change of base divides." }, { v:0.985, fb:"That’s 1.462 − 0.477. Change of base divides." }, { v:9.7, fb:"That’s 29 ÷ 3: the logs were cancelled." }],
            hints:["Change of base: `log_3 29 = log 29 / log 3`. Bracket first: 27 < 29 < 81, so it’s between 3 and 4.", "≈ 1.462 ÷ 0.477. Test 0.477 × 3 = 1.431 and 0.477 × 3.1 = 1.4787.", "1.462 is between 1.431 and 1.479, nearer the second, so `log_3 29 ≈ 3.06`, which is 3.1 to one decimal place."] },
          { id:"n6", goal:5, box:"number", star:true, prompt:"How many digits does `2^{100}` have when it’s written out in full?", use:"`log 2 ≈ 0.301`", answer:31, display:"31 digits",
            wrong:[{ v:30, fb:"`log(2^{100}) = 100 log 2 ≈ 30.1`, so `2^{100} ≈ 10^{30.1}`. That’s more than `10^{30}`, which already has 31 digits (a 1 and thirty 0s)." }, { v:100, fb:"100 is the exponent. Each factor of 2 adds only about 0.301 of a digit." }],
            hints:["A whole number with `k` digits is at least `10^{k - 1}` and less than `10^k`. Find the common log of `2^{100}`.", "`log(2^{100}) = 100 log 2 ≈ 30.1`, so `2^{100} ≈ 10^{30.1}`: between `10^{30}` and `10^{31}`.", "Numbers from `10^{30}` up to just below `10^{31}` have 31 digits, so `2^{100}` has 31 digits."] },
          { id:"n7", goal:5, box:"number", star:true, prompt:"`log_8 x = log_2 3`. Find `x`.", answer:27, display:"`x = 27`",
            wrong:[{ v:3, fb:"The bases are different, so the numbers can’t match: `log_8 3` is smaller than `log_2 3`." }, { v:24, fb:"That multiplies 8 by 3. Use change of base: `log_8 x = log_2 x / 3`." }, { v:9, fb:"8 = `2^3`, not `2^2`. So `log_2 x = 3 log_2 3`." }],
            hints:["Write `log_8 x` in base 2 using change of base.", "`log_8 x = log_2 x / log_2 8 = log_2 x / 3`. So `log_2 x / 3 = log_2 3`.", "`log_2 x = 3 log_2 3 = log_2 3^3 = log_2 27` (the power law), so `x = 27`."] },
          { id:"n8", goal:5, box:"fraction", star:true, prompt:"Exactly one fraction `p/q` in lowest terms, with `q` = 2, 3 or 4, lies strictly between `log_3 5` and `log_2 3`. Find it without a calculator.", answer:1.5, display:"`3/2`",
            wrong:[{ v:4 / 3, fb:"4/3 is below `log_3 5`: `3^4 = 81 < 125 = 5^3`, so `3^{4/3} < 5`." }, { v:5 / 3, fb:"5/3 is above `log_2 3`: `2^5 = 32 > 27 = 3^3`, so `2^{5/3} > 3`." }, { v:5 / 4, fb:"5/4 is below `log_3 5`: `3^5 = 243 < 625 = 5^4`." }, { v:7 / 4, fb:"7/4 is above `log_2 3`: `2^7 = 128 > 81 = 3^4`." }],
            hints:["Try 3/2. Is `log_2 3` bigger or smaller than 3/2? Compare `2^{3/2}` with 3 by squaring both.", "`(2^{3/2})^2 = 8 < 9 = 3^2`, so `2^{3/2} < 3` and `log_2 3 > 3/2`. Now compare `3^{3/2}` with 5 the same way.", "`(3^{3/2})^2 = 27 > 25 = 5^2`, so `3^{3/2} > 5` and `log_3 5 < 3/2`. So 3/2 lies between them."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the Error", student:"Nathan", how:"",
        instruction:"Nathan made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Evaluate `log_4 32` without a calculator.",
            steps:["By change of base, `log_4 32 = log 32 / log 4`.", "`log 32 / log 4 = log(32/4)`", "`= log 8`", "`= 3 log 2 ≈ 0.903`"],
            answer:1,
            stepFb:["Step 1 is correct: the number’s log over the base’s log. Keep checking the steps after it.", "", "Step 3 simplifies step 2 correctly. The mistake is earlier.", "Step 4 uses the power law correctly on `log 8`. The mistake is earlier."],
            fixes:[
              { t:"Use the power law on both logs: `log 32 / log 4 = 5 log 2 / (2 log 2) = 5/2`.", ok:true, why:"`log 2` cancels because it’s a common <strong>factor</strong> of the top and bottom. Check: `4^{5/2} = (√4)^5 = 2^5 = 32`." },
              { t:"`log 32 / log 4 = 32/4 = 8`.", why:"The word “log” isn’t a number you can cancel. `log 32 / log 4 = 5/2`, not 8." },
              { t:"`log 32 / log 4 = log 4 / log 32 = 2/5`.", why:"Upside down: 2/5 is `log_32 4`." },
              { t:"Step 2 is correct as written.", why:"Nathan’s answer, about 0.903, is less than 1, so 4 to that power is less than `4^1 = 4`, nowhere near 32. And `4^2 = 16 < 32 < 64 = 4^3`, so `log_4 32` must be between 2 and 3. A quotient of logs isn’t the log of a quotient." }],
            hints:["Test the final answer: does 4 raised to it give 32?", "0.903 is less than 1, so `4^{0.903}` is less than 4. But `4^2 = 16 < 32 < 64 = 4^3`, so `log_4 32` is between 2 and 3. Which step changed the value? Is (`log 32`) ÷ (`log 4`) the same as `log(32 ÷ 4)`?", "Step 2 is wrong. Use the power law: `log 32 = 5 log 2` and `log 4 = 2 log 2`, so `log_4 32 = 5/2`."] },
          { id:"e2", goal:4, task:"Find every value of `x` that makes `log(x^2) = 4` true.",
            steps:["By the power law, `log(x^2) = 2 log x`.", "So `2 log x = 4`, and `log x = 2`.", "`x = 10^2 = 100`.", "The only solution is `x = 100`."],
            answer:0,
            stepFb:["", "Step 2 follows correctly from step 1. The mistake is earlier.", "Step 3 converts `log x = 2` correctly. The mistake is earlier.", "Step 4 sums up the steps before it. Something earlier lost a solution."],
            fixes:[
              { t:"`log(x^2) = 4` means `x^2 = 10^4 = 10 000`, so `x = 100` or `x = -100`.", ok:true, why:"`x^2` is positive for both. Check: `log((-100)^2) = log 10 000 = 4`. The power law only works for `x > 0`, so step 1 threw away the negative solution." },
              { t:"`log(x^2) = (log x)^2`, so `log x = ±2` and `x = 100` or `x = 1/100`.", why:"`log(x^2)` isn’t `(log x)^2`. Check `x = 1/100`: `log(1/10 000) = -4`, not 4." },
              { t:"Step 1 is right, and `x = -100` can’t be a solution, because `log(-100)` is undefined.", why:"Test `x = -100` in the <strong>original</strong> equation: `log((-100)^2) = log 10 000 = 4`. It works, and `log(-100)` never appears." },
              { t:"Step 1 is correct as written.", why:"Try `x = -100`: `log((-100)^2) = 4`, so it’s a solution, but `2 log(-100)` is undefined. Step 1 is only true when `x > 0`." }],
            hints:["Test `x = -100` in the original equation.", "`log((-100)^2) = log 10 000 = 4`, so −100 is a solution. Which step lost it?", "Step 1: `log(x^2) = 2 log x` is only true for `x > 0`. Convert instead: `x^2 = 10 000`, so `x = ±100`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the Power stacker? Think about the half block, the backward blocks, or the two branches of `log(x^2)`." },
      { id:"j2", q:"In your own words, why does `log_b(x^n) = n log_b x`? Use the idea that a logarithm is an exponent." },
      { id:"j3", q:"Explain to a friend how to find `log_27 81` without a calculator, and what you would do differently for `log_3 20`." },
      { id:"j4", q:"Which part is still shaky for you: the power law, change of base, or knowing when the power law needs `x > 0`? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"What is the value of `log_2(16^3)`?", options:[
          { t:"12", ok:true, why:"`log_2(16^3) = 3 log_2 16 = 3 × 4 = 12`. Check: `16^3 = (2^4)^3 = 2^{12}`." },
          { t:"7", why:"That adds: 4 + 3. The power law multiplies the log by the exponent: 3 × 4." },
          { t:"48", why:"That’s 3 × 16: you multiplied the number, not its log. `log_2 16 = 4`, so the answer is 3 × 4." },
          { t:"64", why:"That’s `(log_2 16)^3 = 4^3`. The exponent is on 16, inside the log, so it comes out as a multiplier." }] },
        b:{ prompt:"What is the value of `log_3(9^4)`?", options:[
          { t:"8", ok:true, why:"`log_3(9^4) = 4 log_3 9 = 4 × 2 = 8`. Check: `9^4 = (3^2)^4 = 3^8`." },
          { t:"6", why:"That adds: 2 + 4. The power law multiplies: 4 × 2." },
          { t:"16", why:"That’s `(log_3 9)^4 = 2^4`. The exponent comes out as a multiplier." },
          { t:"36", why:"That’s 4 × 9: you multiplied the number, not its log." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Which expression is equal to `log_6 11`?", options:[
          { t:"`log 11 / log 6`", ok:true, why:"Change of base: `log_b x = log x / log b`. The number’s log goes on top." },
          { t:"`log 6 / log 11`", why:"Upside down: that’s `log_11 6`. Check the pattern with `log_2 8 = 3`: `log 8 / log 2 = 3`, but `log 2 / log 8 = 1/3`." },
          { t:"`log 11 - log 6`", why:"Change of base divides the logs. `log 11 - log 6 ≈ 0.26`, but `log_6 11` is more than 1, because 11 > 6." },
          { t:"`(log 11)/6`", why:"Divide by `log 6`, not by 6. The base enters through its logarithm." }] },
        b:{ prompt:"Which expression is equal to `log_7 20`?", options:[
          { t:"`log 20 / log 7`", ok:true, why:"Change of base: the number’s log over the base’s log." },
          { t:"`log 7 / log 20`", why:"Upside down: that’s `log_20 7`, which is less than 1." },
          { t:"`log 20 - log 7`", why:"Change of base divides the logs. `log 20 - log 7 ≈ 0.46`, but `log_7 20` is more than 1, because 20 > 7." },
          { t:"`(log 20)/7`", why:"Divide by `log 7`, not by 7." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"Which single logarithm is equal to `3 log_5 2`?", options:[
          { t:"`log_5 8`", ok:true, why:"The power law in reverse: `3 log_5 2 = log_5(2^3) = log_5 8`." },
          { t:"`log_5 6`", why:"That multiplies the number 2 by 3. A multiplier in front of a log becomes an exponent on the number: `2^3`, not 2 × 3." },
          { t:"`log_5 9`", why:"That’s `3^2`, with the base and exponent swapped. The 3 becomes the exponent on 2: `2^3 = 8`." },
          { t:"`log_125 2`", why:"That moves the 3 onto the base, `5^3 = 125`. But `log_125 2 = (1/3) log_5 2`: a third, not three times." }] },
        b:{ prompt:"Which single logarithm is equal to `2 log_3 5`?", options:[
          { t:"`log_3 25`", ok:true, why:"`2 log_3 5 = log_3(5^2) = log_3 25`." },
          { t:"`log_3 10`", why:"That multiplies 5 by 2. The 2 becomes an exponent: `5^2`." },
          { t:"`log_3 32`", why:"That’s `2^5`, with the base and exponent swapped." },
          { t:"`log_9 5`", why:"That moves the 2 onto the base, `3^2 = 9`. But `log_9 5 = (1/2) log_3 5`." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"For which values of `x` is the statement `log(x^4) = 4 log x` true?", options:[
          { t:"Only for `x > 0`", ok:true, why:"`log(x^4)` exists for every `x ≠ 0`, because `x^4 > 0`. But `4 log x` exists only for `x > 0`. Where both exist, the power law makes them equal, so the statement is true exactly when `x > 0`." },
          { t:"For every `x ≠ 0`", why:"Try `x = -10`: `log((-10)^4) = log 10 000 = 4`, but `4 log(-10)` is undefined." },
          { t:"For every real number `x`", why:"At `x = 0` neither side exists, and for `x < 0` the right side doesn’t." },
          { t:"Only for `x ≥ 1`", why:"Try `x = 1/10`: `log(10^{-4}) = -4` and `4 log(1/10) = 4 × (-1) = -4`. Negative logs are fine." }] },
        b:{ prompt:"For which values of `x` is the statement `log_2(x^{-2}) = -2 log_2 x` true?", options:[
          { t:"Only for `x > 0`", ok:true, why:"`x^{-2} = 1/x^2` is positive for every `x ≠ 0`, so the left side exists for `x ≠ 0`. The right side needs `x > 0`. Where both exist, the power law makes them equal." },
          { t:"For every `x ≠ 0`", why:"Try `x = -2`: `log_2((-2)^{-2}) = log_2(1/4) = -2`, but `-2 log_2(-2)` is undefined." },
          { t:"Never, because a negative exponent makes the logarithm undefined", why:"`x^{-2}` is still positive. Try `x = 2`: `log_2(1/4) = -2` and `-2 log_2 2 = -2`." },
          { t:"Only for `x ≥ 1`", why:"Try `x = 1/2`: `log_2 4 = 2` and `-2 log_2(1/2) = 2`." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"`log_b 64 = 3/2`. What is `b`?", options:[
          { t:"16", ok:true, why:"`b^{3/2} = 64`, so `b = 64^{2/3} = (∛64)^2 = 4^2 = 16`. Check: `16^{3/2} = (√16)^3 = 4^3 = 64`." },
          { t:"4", why:"That’s `∛64` without the square. `log_4 64 = 3`, not 3/2." },
          { t:"96", why:"That’s 64 × 3/2. The log is an exponent: `b^{3/2} = 64`." },
          { t:"512", why:"That’s `64^{3/2}`: the power is the wrong way up. `log_512 64 = 2/3`." }] },
        b:{ prompt:"`log_b 729 = 3/2`. What is `b`?", options:[
          { t:"81", ok:true, why:"`b = 729^{2/3} = (∛729)^2 = 9^2 = 81`. Check: `81^{3/2} = 9^3 = 729`." },
          { t:"9", why:"That’s `∛729` without the square. `log_9 729 = 3`, not 3/2." },
          { t:"1093.5", why:"That’s 729 × 3/2. The log is an exponent: `b^{3/2} = 729`." },
          { t:"19 683", why:"That’s `729^{3/2} = 27^3`: the power is the wrong way up. `log_19683 729 = 2/3`." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"Which is the best estimate of `log_3 8`?", use:"`log 2 ≈ 0.301` and `log 3 ≈ 0.477`", options:[
          { t:"1.89", ok:true, why:"`log_3 8 = log 8 / log 3 = 3 log 2 / log 3 ≈ 0.903 / 0.477 ≈ 1.89`. It fits the bracket: 3 < 8 < 9, so `log_3 8` is between 1 and 2." },
          { t:"0.43", why:"That’s 0.903 − 0.477: you subtracted the logs. Change of base divides them." },
          { t:"0.53", why:"That’s 0.477 ÷ 0.903, upside down. It’s `log_8 3`, which is less than 1 because 3 < 8." },
          { t:"2.67", why:"That’s 8 ÷ 3: the logs were cancelled. `log 8 / log 3` isn’t 8/3, and 2.67 is outside the bracket 1 to 2." }] },
        b:{ prompt:"Which is the best estimate of `log_7 16`?", use:"`log 2 ≈ 0.301` and `log 7 ≈ 0.845`", options:[
          { t:"1.42", ok:true, why:"`log_7 16 = log 16 / log 7 = 4 log 2 / log 7 ≈ 1.204 / 0.845 ≈ 1.42`. It fits the bracket: 7 < 16 < 49." },
          { t:"0.36", why:"That’s 1.204 − 0.845: you subtracted the logs." },
          { t:"0.70", why:"That’s 0.845 ÷ 1.204, upside down. It’s `log_16 7`, which is less than 1." },
          { t:"2.29", why:"That’s 16 ÷ 7: the logs were cancelled. 2.29 is outside the bracket 1 to 2." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why `log_b(x^n) = n log_b x` for `x > 0`?", options:[
          { t:"Let `m = log_b x`, so `b^m = x`. Then `x^n = (b^m)^n = b^{mn}`. The exponent that turns `b` into `x^n` is `mn`, so `log_b(x^n) = mn = n log_b x`.", ok:true, why:"This uses what a logarithm is, an exponent, and the power-of-a-power law. It works for every `x > 0`." },
          { t:"An exponent can always be moved to the front of an expression as a multiplier. So the `n` on `x` can come down in front of the log, and `log_b(x^n) = n log_b x` for any `x`.", why:"Not true in general: `(x + 1)^2` isn’t `2(x + 1)`. It works for logs because a log is an exponent." },
          { t:"`log_b(x^n)` means `(log_b x)^n`, the log raised to the power `n`. Raising a number to the power `n` is the same as multiplying it by `n`, so this equals `n log_b x`.", why:"`(log_b x)^n` is a different expression, and raising to a power isn’t multiplying." },
          { t:"Test it with `b = 2` and `x = 8`: `log_2(8^2) = log_2 64 = 6`, and `2 log_2 8 = 2 × 3 = 6`. The two sides agree, so the law is always true.", why:"One example can’t show that something is always true. You need a reason that works for every `x`." }] },
        b:{ prompt:"Which is the best explanation of why `log_b √x = (1/2) log_b x` for `x > 0`?", options:[
          { t:"Let `m = log_b x`, so `b^m = x`. Then `√x = (b^m)^{1/2} = b^{m/2}`. The exponent that turns `b` into `√x` is `m/2`, so `log_b √x = (1/2) log_b x`.", ok:true, why:"This uses what a logarithm is and the power-of-a-power law, so it works for every `x > 0`." },
          { t:"Taking a square root always halves a number. So `√x` is half of `x`, and the log of half a number is half its log: `log_b √x = (1/2) log_b x`.", why:"A square root doesn’t halve a number: `√16 = 4`, not 8. It’s the <strong>log</strong> that halves." },
          { t:"`log_b √x` means `√(log_b x)`, the square root of the log. Taking a square root is the same as dividing by 2, so this equals `(1/2) log_b x`.", why:"`√(log_b x)` is a different expression, and a square root isn’t division by 2." },
          { t:"Test it with `x = 100`: `log √100 = log 10 = 1`, and `(1/2) log 100 = (1/2) × 2 = 1`. The two sides agree, so the law is always true.", why:"One example can’t show that something is always true. You need a reason that works for every `x`." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Mei writes `log_2 5 = 2.32`. Which comment about her work is correct?", options:[
          { t:"The value is right, but it’s an approximation, so she should write `log_2 5 ≈ 2.32`.", ok:true, why:"`log_2 5 = log 5 / log 2 ≈ 2.32`, and `2^{2.32} ≈ 4.99`, not exactly 5. The exact value is `log_2 5` itself (or `log 5 / log 2`)." },
          { t:"It’s exact, because `2^{2.32} = 5`.", why:"`2^{2.32} ≈ 4.993`. `log_2 5` has no exact decimal form, so use ≈." },
          { t:"It’s wrong: `log_2 5` doesn’t exist, because 5 isn’t a power of 2.", why:"`log_2 5` exists: it’s the exponent between 2 and 3 that turns 2 into 5, since `2^2 = 4 < 5 < 8 = 2^3`. It just isn’t a whole number." },
          { t:"It’s wrong: `log_2 5 = log 5 / log 2 = 5/2 = 2.5`.", why:"`log 5 / log 2 ≈ 0.699 / 0.301 ≈ 2.32`. The logs can’t be cancelled." }] },
        b:{ prompt:"Jae writes `log_3 10 = 2.1`. Which comment about his work is correct?", options:[
          { t:"The value is right to one decimal place, but it’s an approximation, so he should write `log_3 10 ≈ 2.1`.", ok:true, why:"`log_3 10 = log 10 / log 3 = 1/log 3 ≈ 2.096`, and `3^{2.1} ≈ 10.05`, not exactly 10." },
          { t:"It’s exact, because `3^{2.1} = 10`.", why:"`3^{2.1} ≈ 10.05`. `log_3 10` has no exact decimal form, so use ≈." },
          { t:"It’s wrong: `log_3 10` doesn’t exist, because 10 isn’t a power of 3.", why:"`log_3 10` exists: it’s between 2 and 3, since `3^2 = 9 < 10 < 27 = 3^3`." },
          { t:"It’s wrong: `log_3 10 = log 10 / log 3 = 10/3 ≈ 3.3`.", why:"The logs can’t be cancelled. `log 10 / log 3 = 1/log 3 ≈ 2.1`." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A data centre gives every file an ID made of `n` binary digits (bits), which allows `2^n` different IDs. What is the smallest `n` that allows at least `10^{12}` IDs?", use:"`log 2 ≈ 0.301`", options:[
          { t:"40", ok:true, why:"The exponent that gives exactly `10^{12}` is `log_2(10^{12}) = 12 log_2 10 = 12/log 2 ≈ 12/0.301 ≈ 39.9`. So `n` must be at least 39.9, and the smallest whole number that works is 40." },
          { t:"4", why:"That’s 12 × 0.301 ≈ 3.6, rounded up: you multiplied by `log 2` instead of dividing. `2^4 = 16` IDs is far too few." },
          { t:"6", why:"That’s 12 ÷ 2: you divided by the base, not by its logarithm." },
          { t:"39", why:"That’s 39.9 rounded down. `2^{39} ≈ 5.5 × 10^{11}` IDs, which is fewer than `10^{12}`. Round <strong>up</strong>." }] },
        b:{ prompt:"A code uses `n` symbols, each one of 3 colours, which allows `3^n` different codes. What is the smallest `n` that allows at least `10^6` codes?", use:"`log 3 ≈ 0.477`", options:[
          { t:"13", ok:true, why:"The exponent that gives exactly `10^6` is `log_3(10^6) = 6 log_3 10 = 6/log 3 ≈ 6/0.477 ≈ 12.6`, so the smallest whole number that works is 13." },
          { t:"2", why:"That’s 6 ÷ 3: you divided by the base, not by its logarithm." },
          { t:"3", why:"That’s 6 × 0.477 ≈ 2.9, rounded up: you multiplied by `log 3` instead of dividing." },
          { t:"12", why:"That’s 12.6 rounded down. `3^{12} = 531 441` codes, which is fewer than `10^6`. Round <strong>up</strong>." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"On a piano, each key up multiplies a note’s frequency by `2^{1/12}`. How many keys up from a 220 Hz note is the 880 Hz note?", options:[
          { t:"24", ok:true, why:"880 ÷ 220 = 4, so you need `(2^{1/12})^k = 4`. Then `k = log_{2^{1/12}} 4 = log_2 4 / log_2 2^{1/12} = 2 ÷ (1/12) = 24`." },
          { t:"1/6", why:"That’s 2 ÷ 12. Each key is a small step of 1/12 of a doubling, so it takes <strong>many</strong> keys: divide by 1/12." },
          { t:"2", why:"That’s `log_2 4 = 2` doublings (octaves). Each doubling takes 12 keys." },
          { t:"48", why:"That’s 12 × 4: you multiplied by the ratio 4 instead of by its logarithm, `log_2 4 = 2`." }] },
        b:{ prompt:"On a piano, each key up multiplies a note’s frequency by `2^{1/12}`. How many keys up from a 110 Hz note is the 880 Hz note?", options:[
          { t:"36", ok:true, why:"880 ÷ 110 = 8 = `2^3`, so `k = log_2 8 ÷ (1/12) = 3 × 12 = 36`." },
          { t:"1/4", why:"That’s 3 ÷ 12. Divide by 1/12, not by 12." },
          { t:"3", why:"That’s `log_2 8 = 3` doublings (octaves). Each doubling takes 12 keys." },
          { t:"96", why:"That’s 12 × 8: you multiplied by the ratio 8 instead of by its logarithm, `log_2 8 = 3`." }] } }
    ]
  },
  task:{
    title:"Same graph, new recipe", summary:"Same graph, new recipe",
    statement:"<p>The dashed target graph has two mirror-image branches. It passes through (1/2, −1), (2, 1), (4, 2) and (8, 3), and through (−2, 1), (−4, 2) and (−8, 3). Design `y = " + LB + "(x^{" + N + "})` whose graph is exactly the target. One base is off limits: `@b{b} = 4`. There’s more than one answer. Can you find them all?</p>",
    checks:["The right branch passes through (4, 2)", "There is a left branch, like the target", "The left branch passes through (−8, 3)", "Not the off-limits base: `@b{b} ≠ 4`"],
    tips:[
      "At `x = 4` your graph is at {v}. You need 2. Try writing `@b{b}` as a power of 2: if `@b{b} = 2^k`, then `" + LB + "(4^{" + N + "}) = 2" + N + "/k`.",
      "With an odd `" + N + "`, `x^{" + N + "}` is negative whenever `x` is negative, and negative numbers have no logarithm. So your graph has no left branch. Use an even `" + N + "`.",
      "Your left branch is at {v} when `x = -8`, but the target is at 3. Get the right branch through (4, 2) first: with an even `" + N + "`, the left branch is its mirror image.",
      "`log_4(x^2)` is the off-limits recipe. What happens to the graph if you double `" + N + "`? What must happen to `@b{b}` to undo it?"],
    explainPrompt:"Explain why your recipe draws exactly the target graph.",
    vocab:"Use the words power law, change of base and even.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another?",
    after3:"Every recipe you’ve found has `@b{b} = 2^{" + N + "}` with an even `" + N + "`. Here’s why. For `x > 0`, `" + LB + "(x^{" + N + "}) = " + N + " " + LB + " x = " + N + " · log_2 x / log_2 @b{b}` (the power law, then change of base). That equals `log_2 x`, the target’s right branch, exactly when `log_2 @b{b} = " + N + "`. An even `" + N + "` gives the mirror-image left branch.",
    after5:"You found all five. With `@b{b} = 4` allowed, `" + N + " = 2` would make six. A negative `" + N + "` works with a fractional base because the two reflections cancel."
  },
  cards:[
    ["The power law of logarithms", "`" + LB + "(x^{" + N + "}) = " + N + " " + LB + " x`, for `x > 0` and any real `" + N + "`. Example: `log_2(8^5) = 5 × 3 = 15`."],
    ["Why the power law works", "If `log_b x = m`, then `x = b^m`, so `x^n = b^{mn}`. The exponent is `mn`, so `log_b(x^n) = mn = n log_b x`."],
    ["Roots and reciprocals", "`log_b √x = (1/2) log_b x` and `log_b(1/x) = -log_b x`. Example: `log √1000 = 3/2` and `log(1/100) = -2`."],
    ["`log(x^2)` vs `(log x)^2`", "Different! At `x = 1000`: `log(1000^2) = 6`, but `(log 1000)^2 = 9`."],
    ["Change of base formula", "`log_b x = log x / log b`. Example: `log_4 32 = log 32 / log 4 = 5 log 2 / (2 log 2) = 5/2`."],
    ["Why change of base works", "`y = log_b x` means `b^y = x`. Take logs: `y log b = log x` (the power law), so `y = log x / log b`."],
    ["`log_b x` as a measurement", "How many `b`-lengths fit into the `x`-length on a log ruler. It’s a ratio of two lengths, so any ruler gives the same count."],
    ["The common base method", "Write both numbers as powers of one base: `log_9 27 = log_3 27 / log_3 9 = 3/2`."],
    ["No common base?", "Bracket, then use given values: `2^2 < 5 < 2^3`, and `log_2 5 = log 5 / log 2 ≈ 0.699 / 0.301 ≈ 2.32`. Write ≈, not =."],
    ["`log 8 / log 2` vs `log(8/2)`", "Not the same! `log 8 / log 2 = 3 log 2 / log 2 = 3`, but `log(8/2) = log 4 ≈ 0.602`."],
    ["When the power law needs care", "`log(x^2)` exists for every `x ≠ 0`, but `2 log x` only for `x > 0`. They agree only when `x > 0`, so `log(x^2) = 4` has two solutions, ±100."],
    ["Swapping the base and the number", "`log_a b = 1/log_b a`. Example: `log_8 2 = 1/3`, because `log_2 8 = 3`."]
  ]
};
