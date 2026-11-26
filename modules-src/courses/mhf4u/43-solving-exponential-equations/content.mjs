// MHF4U 43 Solving Exponential Equations. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/43-solving-exponential-equations.md

// Sort by solution: wrong-box feedback (plan: named box first, then the generic lines)
const SUB = "Substitute the box’s value: the two sides don’t match.";
const NOSOL = "This equation has a solution. Isolate the power, then try a common base or logs.";
const BOXES = ["b1", "b2", "b3", "b4"];
const H1 = "Can both sides be written with the same base? If not, isolate the power and use logs. If two terms contain the same power, factor it out. If you see `4^x` and `2^x` together, let `u = 2^x`.";
function sortItem(id, goal, t, box, why, named, hints){
  const wrong = {};
  BOXES.forEach(b => { if (b !== box) wrong[b] = (named && named[b]) || (b === "b4" ? NOSOL : SUB); });
  return { id, goal, t, answer:box, why, wrong, hints };
}
const USE_LAB = { L2:"`log 3 ≈ 0.477`, `log 7 ≈ 0.845`", L3:"`log 2 ≈ 0.301`, `log 12 ≈ 1.079`", L4:"`log 2 ≈ 0.301`, `log 3 ≈ 0.477`" };

export default {
  id:"43-solving-exponential-equations",
  kind:"topic",
  title:"Solving exponential equations",
  topic:"Solving Exponential Equations",
  readyTopic:"solving exponential equations",
  hero:{
    eq:"`@b{b}^x = N  ⟹  x = {log N}/{log @b{b}}`", eqLabel:"b to the power x equals N, so x equals log N divided by log b", eqSize:"md",
    headline:"How do you solve for an exponent?",
    text:"In an <strong>exponential equation</strong> the unknown sits in the exponent: `2^x = 32`, `3^x = 7`, or “when will this culture reach 300 cells?”. If both sides can be written as powers of the same base, a <strong>common base</strong> gives the exponent directly. If not, <strong>take the logarithm of both sides</strong>: the power law brings the exponent down, and `x = log N / log b`. You’ll use both methods to solve problems about <strong>doubling time</strong>, <strong>half-life</strong> and <strong>compound interest</strong>.",
    fig:{ aria:"Animated graph of A = 10 times 2 to the power t. Five doubling periods are marked, each times 2. A target line at 300 crosses the curve at t ≈ 4.91 hours, between 4 and 5 doublings." }
  },
  goals:[
    "I can solve an exponential equation by writing both sides as powers of the same base and setting the exponents equal, including bases and answers that are fractions or negative (such as `9^x = 1/3` or `8^{x+1} = 4^{2x}`).",
    "I can solve an exponential equation by taking the common logarithm of both sides, write the exact answer (such as `x = log 7 / log 3`), and use given values to estimate it.",
    "I can get an equation ready first, by isolating the power, factoring out a common power or substituting `u = 2^x`, and I can tell when an equation has no solution.",
    "I can write a growth or decay model from a doubling time, a half-life or a percent rate per period, and explain what each part of `A = A_0 · 2^{t/d}`, `A = A_0(1/2)^{t/h}` or `A = P(1 + i)^n` means.",
    "I can solve growth, decay, half-life and compound interest problems for the time, the rate or the starting amount, and round the answer in a way that makes sense in context.",
    "I can calculate the average rate of change of an exponential model over an interval and explain why it changes by the same factor over equal intervals."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Powers of a common base", goal:1,
          prompt:"Which expression equals `8^{x+1}`?",
          options:[
            { t:"`2^{x+4}`", why:"`(2^3)^{x+1}` multiplies the exponents: `3(x + 1)`, not `3 + (x + 1)`. Check `x = 0`: `8^1 = 8`, but `2^4 = 16`." },
            { t:"`2^{3x+1}`", why:"The 3 multiplies the <strong>whole</strong> exponent: `3(x + 1) = 3x + 3`. Check `x = 0`: `8^1 = 8`, but `2^1 = 2`." },
            { t:"`2^{3x+3}`", ok:true, why:"`8 = 2^3`, so `8^{x+1} = (2^3)^{x+1} = 2^{3(x+1)} = 2^{3x+3}`." },
            { t:"`8^x + 8`", why:"`b^{x+1} = b^x · b`, a product, not `b^x + b`. Check `x = 0`: `8^1 = 8`, but `8^0 + 8 = 9`." }],
          hints:["Write 8 as a power of 2 first.", "`8^{x+1} = (2^3)^{x+1}`. For a power of a power, multiply the exponents.", "`3 × (x + 1) = 3x + 3`, so `8^{x+1} = 2^{3x+3}`."] },
        { id:"w2", skill:"Powers of a common base", goal:1,
          prompt:"Write `√8` as a power of 2.",
          options:[
            { t:"`2^{2/3}`", why:"`2^{2/3}` is the cube root of `2^2 = 4`. A square root is the power 1/2: `√8 = (2^3)^{1/2}`." },
            { t:"`2^{3/2}`", ok:true, why:"`√8 = 8^{1/2} = (2^3)^{1/2} = 2^{3/2}`." },
            { t:"`2^2`", why:"`√8` isn’t 8 ÷ 2 = 4. It’s the number whose square is 8, about 2.83." },
            { t:"`2^6`", why:"`2^6 = 64 = 8^2`. A square root halves the exponent: 3 × 1/2 = 3/2." }],
          hints:["A square root is the power 1/2.", "`√8 = 8^{1/2}`, and `8 = 2^3`.", "`(2^3)^{1/2} = 2^{3/2}`."] },
        { id:"w3", skill:"Log laws", goal:2,
          prompt:"Which expression equals `log(5^x)` for every `x`?",
          options:[
            { t:"`(log 5)^x`", why:"The power law brings the exponent down as a <strong>multiplier</strong>: `log(5^x) = x log 5`. Check `x = 2`: `log 25 ≈ 1.40`, but `(log 5)^2 ≈ 0.49`." },
            { t:"`log(5x)`", why:"`5^x` isn’t `5x`. Check `x = 2`: `log 25 ≈ 1.40`, but `log 10 = 1`." },
            { t:"`5 log x`", why:"`5 log x = log(x^5)`. Check `x = 2`: `log 25 ≈ 1.40`, but `5 log 2 ≈ 1.51`." },
            { t:"`x log 5`", ok:true, why:"The power law: the exponent comes down in front. `log(5^2) = log 25 = 2 log 5`." }],
          hints:["Which log law deals with an exponent?", "The power law: `log(x^n) = n log x`. Here the number is 5 and the exponent is `x`.", "`log(5^x) = x log 5`."] },
        { id:"w4", skill:"Log laws", goal:2,
          prompt:"Which statement is true?",
          options:[
            { t:"`log 12 - log 3 = log 4`", ok:true, why:"The quotient law: `log 12 - log 3 = log(12/3) = log 4`." },
            { t:"`log 12 ÷ log 3 = log 4`", why:"`log 12 ÷ log 3 ≈ 1.079 ÷ 0.477 ≈ 2.26`, but `log 4 ≈ 0.60`. Dividing logs is a change of base (`log_{3} 12`)." },
            { t:"`log 12 - log 3 = log 9`", why:"Subtracting logs <strong>divides</strong> the numbers: 12 ÷ 3 = 4." },
            { t:"`log(12 - 3) = log 12 - log 3`", why:"A log can’t be split over − or +. `log 9 ≈ 0.95`, but `log 12 - log 3 = log 4 ≈ 0.60`." }],
          hints:["Which law turns subtracting logs into one log?", "The quotient law: `log a - log b = log(a/b)`.", "`log 12 - log 3 = log(12/3) = log 4`."] },
        { id:"w5", skill:"Estimating logarithms", goal:2, fixedOrder:true,
          prompt:"Between which two whole numbers is `log_{2} 40`?",
          options:[
            { t:"1 and 2", why:"`log 40` (base 10) is about 1.6. Here the base is 2: 2 to what power gives 40?" },
            { t:"4 and 5", why:"`2^5 = 32` is still less than 40, so `log_{2} 40` is more than 5." },
            { t:"5 and 6", ok:true, why:"`2^5 = 32 < 40 < 64 = 2^6`, so `log_{2} 40` is between 5 and 6." },
            { t:"20 and 21", why:"A logarithm is an exponent, not a quotient. `2^{20}` is over a million." }],
          hints:["List powers of 2: 2, 4, 8, 16, …", "Find the two powers of 2 that 40 sits between.", "`2^5 = 32` and `2^6 = 64`, so `log_{2} 40` is between 5 and 6."] },
        { id:"w6", skill:"Percent change as a multiplier", goal:4,
          prompt:"The price of a $250 item rises by 8% each year. Which expression gives its price after 3 years?",
          options:[
            { t:"`250(0.08)^3`", why:"Multiplying by 0.08 keeps only 8% of the price. A rise of 8% multiplies by 1 + 0.08 = 1.08." },
            { t:"`250(1.08)^3`", ok:true, why:"Each year the price is multiplied by 1.08, three times." },
            { t:"`250(1.8)^3`", why:"8% = 0.08, so the factor is 1.08. A factor of 1.8 is an 80% rise." },
            { t:"`250(1.24)`", why:"That adds 8% of the <strong>original</strong> price each year. Each rise is 8% of the new, larger price: `250(1.08)^3` ≈ $314.93, not $310." }],
          hints:["What single number do you multiply by to raise a price by 8%?", "100% + 8% = 108%, so multiply by 1.08 each year.", "Three years: 250 × 1.08 × 1.08 × 1.08 = `250(1.08)^3`."] }
      ],
      refreshers:{
        "Powers of a common base":"To change a power to a new base, rewrite the base, then multiply the exponents: `8^{x+1} = (2^3)^{x+1} = 2^{3x+3}`. The 3 multiplies the whole exponent. Roots and fractions are powers too: `√8 = 8^{1/2} = 2^{3/2}`, and `1/9 = 3^{-2}`.",
        "Log laws":"The power law brings an exponent down as a multiplier: `log(5^x) = x log 5`. The quotient law subtracts: `log 12 - log 3 = log(12/3) = log 4`. Careful: `log 12 ÷ log 3` is a different number (about 2.26). By change of base it’s `log_{3} 12`.",
        "Estimating logarithms":"To place `log_{2} 40`, list powers of 2: `2^5 = 32 < 40 < 64 = 2^6`. So `log_{2} 40` is between 5 and 6, a little closer to 5 (it’s about 5.32).",
        "Percent change as a multiplier":"Growing by 8% multiplies by 1 + 0.08 = 1.08 each period; shrinking by 15% multiplies by 1 − 0.15 = 0.85. After `n` years at 8%: `250(1.08)^n`. Adding 8% of the original each year, `250 + 20n`, is simple growth, and it falls behind."
      }
    }
  },
  explore:{
    heading:"Doubling timeline",
    intro:"Choose a mode, set the starting amount and the period, then move the target. The timeline counts whole periods, and the logarithm measures the part of a period left over. Switch to the log scale to see what taking logs does to the curve.",
    dNote:"Here `d` is the doubling time, not a horizontal shift, so it’s written in ink, not in the teal used for shifts.",
    predictions:[
      { id:"p1", start:{ mode:"dbl", A0:5, d:3, N:40 },
        prompt:"It takes 9 h to reach 40. The target will now double, to 80. How much longer will it take to reach the new target?",
        options:[{ t:"3 more hours", ok:true }, { t:"6 more hours" }, { t:"9 more hours" }, { t:"It depends on the starting amount" }],
        explain:"Doubling the target adds one doubling period, 3 h, no matter where the culture starts: `5 · 2^{t/3} = 80` means `2^{t/3} = 16 = 2^4`, so `t = 12`. Multiplying the target <strong>adds</strong> a fixed amount of time. That is what a logarithm does: it turns multiplying into adding. (Six more hours would be right only if the culture kept growing at its last period’s average rate, 20/3 per hour; nine more hours treats time as proportional to the amount.)" },
      { id:"p2", start:{ mode:"dbl", A0:5, d:3, N:40 }, fixedOrder:true,
        prompt:"The target will move to 60, exactly halfway between 40 and 80. When will the culture reach 60?",
        options:[{ t:"Exactly 10.5 h, halfway between 9 h and 12 h" }, { t:"Between 9 h and 10.5 h" }, { t:"Between 10.5 h and 12 h", ok:true }, { t:"After 12 h" }],
        explain:"Halfway through a doubling period the amount has been multiplied by `√2 ≈ 1.41`, not 1.5. At 10.5 h there are `40√2 ≈ 56.6` cells, still short of 60, so 60 comes later than halfway: `2^{t/3} = 12`, so `t = 3 × log 12 / log 2 ≈ 10.75` h. The growth speeds up, so equal steps in value take less and less time. That’s why the answer needs a logarithm, not a straight-line guess." },
      { id:"p3", start:{ mode:"dbl", A0:5, d:3, N:60 },
        prompt:"You’re about to switch to the log scale, where each gridline up is × 2. What will the curve look like?",
        options:[{ t:"A straight line, rising", ok:true }, { t:"A curve that bends upward even more steeply" }, { t:"A curve that rises and then flattens out, like a log graph" }, { t:"A horizontal line" }],
        explain:"Every 3 h the amount doubles, which is one gridline up on this scale. Equal steps across, equal steps up: a straight line. In symbols, taking logs of `A = 5 · 2^{t/3}` gives `log A = log 5 + t × (log 2)/3`, a linear function of `t`. That’s why taking the log of both sides solves the equation: it turns `5 · 2^{t/3} = 60` into a linear equation, `log 5 + (t/3) log 2 = log 60`." },
      { id:"p4", start:{ mode:"half", A0:80, h:5, N:20 },
        prompt:"Compare the average rate of change over the first 5 hours with the average rate over the next 5 hours.",
        options:[{ t:"The amount falls half as fast in the second 5 hours", ok:true }, { t:"It falls at the same rate in both" }, { t:"It falls twice as fast in the second 5 hours" }, { t:"In the second 5 hours the rate is 0, because the drug is gone after two half-lives" }],
        explain:"In the first half-life the amount drops from 80 to 40 mg: (40 − 80) ÷ 5 = −8 mg/h. In the next, from 40 to 20 mg: −4 mg/h. Each half-life removes half of what’s <strong>there</strong>, so the rate of loss halves too. After two half-lives a quarter is left (20 mg), not nothing." }
    ],
    chalIntro:"Press <strong>Load this challenge</strong> first: it sets up the timeline and locks the settings the challenge gives you (the <strong>Set-up</strong> row shows which challenge is loaded). Then adjust the timeline and press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    loadBtn:"Load this challenge", loadedBtn:"Loaded: back to free explore",
    challenges:[
      { id:"tc1", goal:[4, 5],
        prompt:"Half-life mode. The starting amount is locked at 400 mg. Set the half-life so that <strong>exactly 25 mg</strong> is left at `t` = 12 h.",
        why:"With `h = 3`, 12 h is 4 half-lives: 400 → 200 → 100 → 50 → 25.",
        msgs:{ h4:"With `h = 4`, 12 h is 3 half-lives: 400 → 200 → 100 → 50. You’re one halving short of 25.",
          h6:"Only 2 half-lives fit into 12 h, leaving 100 mg.",
          h2:"6 half-lives fit into 12 h, leaving 6.25 mg. Two halvings too many.",
          h075:"You’ve fitted 16 half-lives into 12 h. 400 ÷ 25 = 16 is how many times smaller the sample gets, not the number of halvings.",
          other:"At `t` = 12 h your sample has {A} mg. What fraction of 400 is 25?",
          setup:"Press Load this challenge: it switches to Half-life mode with the starting amount locked at 400 mg." },
        hints:["What fraction of 400 mg is 25 mg?", "25/400 = 1/16 = `(1/2)^4`. So 4 half-lives must fit into 12 h.", "12 ÷ 4 = 3, so `h` = 3 h. Check: 400 → 200 → 100 → 50 → 25 at 3, 6, 9 and 12 h."] },
      { id:"tc2", goal:5,
        prompt:"Interest mode, locked at $1000, 6% per year, compounded quarterly, target $2000. Move the time marker to the <strong>first</strong> quarter-end at which the balance is at least $2000.",
        why:"`n = 47` quarters, which is 11.75 years: $1983.53 after 46 quarters, $2013.28 after 47.",
        msgs:{ n46:"The readout says `n ≈ 46.56`, but you can’t stop partway through a quarter. After 46 quarters the balance is $1983.53, still short. Interest arrives at the end of quarter 47.",
          n48:"At 12 years the balance is $2043.48, which is enough, but it passed $2000 one quarter earlier. If you were heading for `t = 46.56`: `n` counts quarters, not years, and 46.56 quarters is about 11.6 years.",
          early:"The balance here is still under $2000. Use the readout: how many quarters does the equation need?",
          late:"The balance passed $2000 before this. Find the first quarter-end at or above the target line.",
          setup:"Press Load this challenge: it switches to Interest mode, locked at $1000, 6% per year, compounded quarterly, target $2000." },
        hints:["Solve `1000(1.015)^n = 2000`. What does `n` count?", "`n = log 2 / log 1.015 ≈ 46.56` quarters. Interest is added only at the end of each quarter.", "Round <strong>up</strong> to 47 quarters: $1983.53 after 46, $2013.28 after 47. 47 quarters is 11.75 years."] },
      { id:"tc3", goal:[1, 4], stretch:true,
        prompt:"Doubling mode. Two points are marked: (2, 12) and (8, 96). Set the starting amount and the doubling time so the curve passes through <strong>both</strong> points.",
        why:"`A_0 = 6` and `d = 2`: `6 · 2^{2/2} = 12` and `6 · 2^{8/2} = 96`.",
        msgs:{ a12d2:"Your curve starts at 12, but it must be 12 at `t = 2`, not at `t = 0`. Go back one doubling period.",
          a3d2:"Right doubling time, but you went back two doublings from (2, 12). At `t = 2` your curve is at 6.",
          d6:"With `d = 6`, the amount only doubles once between `t = 2` and `t = 8`. It needs to grow × 8.",
          d2:"The doubling time is right: 12 → 96 is three doublings in 6 h. Now fix the start: at `t = 2` your curve is at {A2}.",
          other:"Your curve is at {A2} when `t = 2` and {A8} when `t = 8`. Start with the ratio: how many doublings take 12 to 96?",
          setup:"Press Load this challenge: it switches to Doubling mode and marks the two points." },
        hints:["How many times does the amount double between the two points?", "96 ÷ 12 = 8 = `2^3`: three doublings in 8 − 2 = 6 hours, so `d = 2`. (On the log scale, the line climbs 3 gridlines in 6 h.)", "With `d = 2`, `t = 2` is one doubling after the start, so `A_0` = 12 ÷ 2 = 6. Check: `6 · 2^{8/2}` = 6 × 16 = 96."] }
    ]
  },
  part3:{
    slug:"solve", name:"Solve",
    heading:"Equation lab: two sides, one solution",
    intro:"Before you start each equation, say which tool you think will finish it. Then choose one move at a time. Watch the crossing point: a legal move never moves it.",
    lab:{
      planQ:"Which tool will finish this equation?",
      planNote:"Choose a plan to unlock the moves.",
      tools:{ base:"Common base", logs:"Logs" },
      same:"✓ Same solution",
      never:"These never cross",
      lockLabel:"the solution",
      uNote:"`u = 2^x` is never 0 or negative",
      eqs:[
        { id:"L1", goal:1, tool:"base", prompt:"Solve `4^{x+1} = 8^{x-1}`.", sol:"`x = 5`", used:"a common base: `4 = 2^2` and `8 = 2^3`",
          lines:["`4^{x+1} = 8^{x-1}`", "`2^{2x+2} = 2^{3x-3}`", "`2x + 2 = 3x - 3`", "`x = 5`"],
          steps:[
            { tag:"Same graphs: rewriting a base changes how the equation looks, not what it says.", moves:[
              { id:"a", t:"Write both sides as powers of 2: `2^{2x+2} = 2^{3x-3}`", ok:true },
              { id:"b", t:"Write both sides as powers of 2: `2^{2x+1} = 2^{3x-1}`", line:"`2^{2x+1} = 2^{3x-1}`", fb:"`(2^2)^{x+1} = 2^{2(x+1)} = 2^{2x+2}`: the 2 multiplies the whole exponent." },
              { id:"c", t:"Set the exponents equal: `x + 1 = x - 1`", line:"`x + 1 = x - 1`", fb:"The bases are 4 and 8, which are different. Match them first.", note:"Two parallel lines that never cross, while the original graphs do cross." }] },
            { tag:"Equal powers of 2 need equal exponents, because `y = 2^u` never repeats an output.", moves:[
              { id:"a", t:"Set the exponents equal: `2x + 2 = 3x - 3`", ok:true },
              { id:"b", t:"Take the log of the left side: `(2x + 2) log 2 = 3x - 3`", line:"`(2x + 2) log 2 = 3x - 3`", fb:"Whatever you do to one side, do to the other. Changing only one side changes the equation." }] },
            { tag:"", moves:[
              { id:"a", t:"Solve: `x = 5`", ok:true },
              { id:"b", t:"Solve: `x = -1/5`", line:"`x = -1/5`", fb:"Gather the `x`-terms by subtracting `3x` from both sides: `2x - 3x = -3 - 2` gives `-x = -5`, so `x = 5`. (`-1/5` comes from adding `3x` and moving the 2 with the wrong sign: `5x = -1`.)" }] }
          ],
          finish:"`x = 5`. Check: `4^6 = 4096` and `8^4 = 4096`.",
          hints:["Can 4 and 8 both be written as powers of one number?", "`4 = 2^2` and `8 = 2^3`, so the equation is `2^{2(x+1)} = 2^{3(x-1)}`.", "`2x + 2 = 3x - 3`, so `x = 5`. Check: `4^6 = 4096 = 8^4`."] },
        { id:"L2", goal:2, tool:"logs", prompt:"Solve `3^x = 7`.", use:USE_LAB.L2, sol:"`x = log 7 / log 3`", used:"logs",
          lines:["`3^x = 7`", "`log(3^x) = log 7`", "`x log 3 = log 7`", "`x = log 7 / log 3`"],
          steps:[
            { tag:"The exponential curve straightened into a line, and the crossing didn’t move.", moves:[
              { id:"a", t:"Take the common log of both sides (both are positive): `log(3^x) = log 7`", ok:true },
              { id:"b", t:"Divide both sides by 3: `x = 7/3`", line:"`x = 7/3`", fb:"`3^x` isn’t 3 times `x`. Check: `3^{7/3} ≈ 13.0`, not 7." },
              { id:"c", t:"Rewrite in log form: `x = log_{7} 3`", line:"`x = log_{7} 3`", fb:"`3^x = 7` means `x = log_{3} 7`: the base of the power is the base of the log. `log_{7} 3 ≈ 0.56`, and `3^{0.56}` is less than 2, nowhere near 7." }] },
            { tag:"Step 2 changes only the label: the same line, written differently.", moves:[
              { id:"a", t:"Power law: `x log 3 = log 7`", ok:true },
              { id:"b", t:"`log(3x) = log 7`", line:"`log(3x) = log 7`", fb:"`log(3^x)` is `x log 3`, not `log(3x)`. This would give `3x = 7`." },
              { id:"c", t:"`(log 3)^x = log 7`", line:"`(log 3)^x = log 7`", fb:"The power law brings the exponent down as a multiplier; it doesn’t stay an exponent." }] },
            { tag:"The sides are now `y = x` and `y = log 7 / log 3`, so the crossing’s height is the answer.", moves:[
              { id:"a", t:"Divide by `log 3` (it isn’t 0): `x = log 7 / log 3`", ok:true },
              { id:"b", t:"`x = log 7 - log 3 = log(7/3)`", line:"`x = log(7/3)`", fb:"Dividing by `log 3` gives a <strong>quotient</strong> of logs. `log 7 - log 3 = log(7/3) ≈ 0.37`, a different number." },
              { id:"c", t:"Cancel the logs: `x = 7/3`", line:"`x = 7/3`", fb:"log isn’t a number you can cancel. 0.845 ÷ 0.477 ≈ 1.77, but 7/3 ≈ 2.33." }] }
          ],
          finish:"`x = log 7 / log 3 ≈ 0.845 ÷ 0.477 ≈ 1.77`. Check: it’s between 1 and 2, since 3 < 7 < 9.",
          hints:["Is 7 a power of 3? If not, which tool brings an exponent down?", "Take the log of both sides, then use the power law: `x log 3 = log 7`.", "`x = log 7 / log 3 ≈ 0.845 ÷ 0.477 ≈ 1.77`."] },
        { id:"L3", goal:3, tool:"logs", prompt:"Solve `5 · 2^{x-1} + 4 = 64`.", use:USE_LAB.L3, sol:"`x = 1 + log 12 / log 2`", used:"logs",
          lines:["`5 · 2^{x-1} + 4 = 64`", "`5 · 2^{x-1} = 60`", "`2^{x-1} = 12`", "`(x - 1) log 2 = log 12`", "`x = 1 + log 12 / log 2`"],
          steps:[
            { tag:"Doing the same thing to both sides moves both graphs together.", moves:[
              { id:"a", t:"Subtract 4: `5 · 2^{x-1} = 60`", ok:true },
              { id:"b", t:"Combine `5 · 2` into 10: `10^{x-1} + 4 = 64`", line:"`10^{x-1} + 4 = 64`", fb:"The exponent belongs to the 2 only. `5 · 2^{x-1}` isn’t `10^{x-1}`: at `x = 3`, `5 · 2^2 = 20`, but `10^2 = 100`." },
              { id:"c", t:"Take the log of each term: `log 5 + (x - 1) log 2 + log 4 = log 64`", line:"`log 5 + (x - 1) log 2 + log 4 = log 64`", fb:"A log can’t be split over +: `log(5 · 2^{x-1} + 4)` isn’t `log(5 · 2^{x-1}) + log 4`. Get the power by itself first." }] },
            { tag:"Doing the same thing to both sides moves both graphs together.", moves:[
              { id:"a", t:"Divide by 5: `2^{x-1} = 12`", ok:true },
              { id:"b", t:"Subtract 5: `2^{x-1} = 55`", line:"`2^{x-1} = 55`", fb:"5 multiplies the power, so undo it by dividing." }] },
            { tag:"Taking logs straightened the curve into a line.", moves:[
              { id:"a", t:"Take logs and use the power law: `(x - 1) log 2 = log 12`", ok:true },
              { id:"b", t:"`x - log 2 = log 12`", line:"`x - log 2 = log 12`", fb:"The whole exponent `x - 1` multiplies `log 2`: `(x - 1) log 2`." }] },
            { tag:"", moves:[
              { id:"a", t:"Divide by `log 2`, then add 1: `x = 1 + log 12 / log 2`", ok:true },
              { id:"b", t:"`x = log 12 / log 2 - 1`", line:"`x = log 12 / log 2 - 1`", fb:"`x - 1 = log 12 / log 2`, so <strong>add</strong> 1 to both sides." }] }
          ],
          finish:"`x = 1 + log 12 / log 2 ≈ 1 + 1.079 ÷ 0.301 ≈ 4.58`. Check: `2^{3.58} ≈ 12`, so 5 × 12 + 4 = 64.",
          hints:["Get the power by itself before you take any logs.", "Subtract 4, then divide by 5: `2^{x-1} = 12`.", "`(x - 1) log 2 = log 12`, so `x = 1 + log 12 / log 2 ≈ 1 + 3.58 = 4.58`."] },
        { id:"L4", goal:2, tool:"logs", prompt:"Solve `2^{x+1} = 3^x`.", use:USE_LAB.L4, sol:"`x = log 2 / (log 3 - log 2)`", used:"logs",
          lines:["`2^{x+1} = 3^x`", "`(x + 1) log 2 = x log 3`", "`log 2 = x log 3 - x log 2`", "`x = log 2 / (log 3 - log 2)`"],
          steps:[
            { tag:"Two curves with different bases become two lines with different slopes.", moves:[
              { id:"a", t:"Take logs of both sides, with the power law: `(x + 1) log 2 = x log 3`", ok:true },
              { id:"b", t:"Set the exponents equal: `x + 1 = x`", line:"`x + 1 = x`", fb:"2 and 3 have no common base, so the exponents needn’t match.", note:"Parallel lines: no crossing." },
              { id:"c", t:"`x log 2 + 1 = x log 3`", line:"`x log 2 + 1 = x log 3`", fb:"The whole exponent `x + 1` multiplies `log 2`, so the 1 becomes `log 2`." }] },
            { tag:"", moves:[
              { id:"a", t:"Expand and gather the `x`-terms: `log 2 = x log 3 - x log 2`", ok:true },
              { id:"b", t:"`x log 2 - x log 3 = log 2`", line:"`x log 2 - x log 3 = log 2`", fb:"Moving `x log 3` left and `log 2` right changes both their signs: `x log 2 - x log 3 = -log 2`." }] },
            { tag:"", moves:[
              { id:"a", t:"Factor and divide: `x = log 2 / (log 3 - log 2)`", ok:true },
              { id:"b", t:"`x = log 2 / log 3 - log 2`", line:"`x = log 2 / log 3 - log 2`", fb:"Factor first: `x(log 3 - log 2)`. The whole bracket is the divisor." },
              { id:"c", t:"`x = log 2 / log(3 - 2)`", line:"`x = log 2 / log(3 - 2)`", fb:"`log 3 - log 2` is `log(3/2)`, not `log(3 - 2)`. And `log 1 = 0`, so this would divide by 0." }] }
          ],
          finish:"`x = log 2 / (log 3 - log 2) = log 2 / log 1.5 ≈ 0.301 ÷ 0.176 ≈ 1.71`. Check: `2^{2.71} ≈ 6.5` and `3^{1.71} ≈ 6.5`.",
          hints:["2 and 3 have no common base, so take the log of both sides.", "`(x + 1) log 2 = x log 3`. Expand, then gather the `x`-terms on one side.", "`log 2 = x(log 3 - log 2)`, so `x = log 2 / (log 3 - log 2) ≈ 0.301 ÷ 0.176 ≈ 1.71`."] },
        { id:"L5", goal:3, tool:"base", stretch:true, prompt:"Solve `4^x - 2^x = 12`.", sol:"`x = 2`", used:"a common base: `2^x = 4 = 2^2`",
          lines:["`4^x - 2^x = 12`", "`u^2 - u = 12`", "`u = 4` or `u = -3`", "`x = 2`"],
          steps:[
            { tag:"In the `u`-picture, `y = u^2 - u` meets `y = 12` at `u = 4` and at `u = -3`.", moves:[
              { id:"a", t:"Let `u = 2^x`, so `4^x = u^2`: `u^2 - u = 12`", ok:true },
              { id:"b", t:"`4^x - 2^x = (4 - 2)^x = 2^x`, so `2^x = 12`", line:"`2^x = 12`", fb:"Powers don’t subtract that way. At `x = 2`: `4^2 - 2^2 = 12`, but `2^2 = 4`." },
              { id:"c", t:"Take logs term by term: `x log 4 - x log 2 = log 12`", line:"`x log 4 - x log 2 = log 12`", fb:"`log(4^x - 2^x)` can’t be split into `log(4^x) - log(2^x)`." }] },
            { tag:"Back to `x`: `y = 2^x` meets `y = 4` on the lock, but `y = -3` lies below the asymptote `y = 0`.", moves:[
              { id:"a", t:"`u^2 - u - 12 = 0`, so `(u - 4)(u + 3) = 0`: `u = 4` or `u = -3`", ok:true },
              { id:"b", t:"`(u - 6)(u + 2) = 0`: `u = 6` or `u = -2`", line:"`u = 6` or `u = -2`", fb:"Expand to check: `(u - 6)(u + 2) = u^2 - 4u - 12`.", note:"`u = 6` would mean `x = log 6 / log 2 ≈ 2.58`, off the lock." }] },
            { tag:"One root survives.", moves:[
              { id:"a", t:"`2^x = 4` gives `x = 2`; `2^x = -3` has no solution", ok:true },
              { id:"b", t:"`x = 2` or `x = log(-3) / log 2`", line:"`x = 2` or `x = log(-3) / log 2`", fb:"`log(-3)` doesn’t exist. `2^x` is positive for every `x`, so `2^x = -3` has no solution." },
              { id:"c", t:"`x = 4` or `x = -3`", line:"`x = 4` or `x = -3`", fb:"`u` stands for `2^x`. Undo the substitution: `2^x = 4` gives `x = 2`.", note:"Neither `x = 4` nor `x = -3` is on the lock (`4^4 - 2^4 = 240`)." }] }
          ],
          finish:"`x = 2` only. Check: `4^2 - 2^2 = 16 - 4 = 12`.",
          hints:["`4^x = (2^x)^2`. Let `u = 2^x`.", "`u^2 - u - 12 = 0` factors as `(u - 4)(u + 3) = 0`.", "`2^x = 4` gives `x = 2`. `2^x = -3` is impossible, because `2^x > 0`. So `x = 2`."] }
      ]
    },
    blocks:[{ title:"What the moves mean", html:"<p><strong>Moves that keep the solution</strong></p><ol><li>Do the same thing to both sides: add, subtract, or multiply or divide by a number that isn’t 0.</li><li>Rewrite a side as something equal to it: `8 = 2^3`, so `8^x = 2^{3x}`.</li><li>Take the log of both sides, when both sides are positive.</li><li>Set the exponents equal, when both sides are powers of the <strong>same</strong> base (`y = b^u` never repeats an output).</li></ol><p><strong>Moves that break it:</strong> setting exponents equal when the bases differ; merging a coefficient into a base (`3 · 2^x ≠ 6^x`); splitting a log over + or −; reading `log a / log b` as `log(a/b)`. And `b^x` is never 0 or negative.</p>" }],
    quickCheck:{
      title:"Which method?", summary:"Which method? quick check",
      items:[
        { id:"q1", goal:1, prompt:"Which method gives the exact answer most simply? `4^x = 32`",
          choices:[{ t:"Common base", ok:true, fb:"Right. `4 = 2^2` and `32 = 2^5`, so `2^{2x} = 2^5` and `x = 5/2`. The common base is 2, not 4." },
            { t:"Logs", fb:"Logs would work, but they aren’t needed: 4 and 32 are both powers of 2, so `x = 5/2` exactly." },
            { t:"No solution", fb:"32 is positive, so there is a solution: `2^{2x} = 2^5` gives `x = 5/2`." }] },
        { id:"q2", goal:2, prompt:"Which method gives the exact answer most simply? `5^x = 30`",
          choices:[{ t:"Common base", fb:"30 = 2 × 3 × 5 isn’t a power of 5, so no common base works. Use logs: `x = log 30 / log 5`." },
            { t:"Logs", ok:true, fb:"Right. 30 isn’t a power of 5 (`5^2 = 25`, `5^3 = 125`), so `x = log 30 / log 5`." },
            { t:"No solution", fb:"30 is positive, so there’s a solution, between 2 and 3." }] },
        { id:"q3", goal:3, prompt:"Which method gives the exact answer most simply? `3 · 2^x = -12`",
          choices:[{ t:"Common base", fb:"`2^x = -4` can’t happen: every power of 2 is positive. No method finds an answer that doesn’t exist." },
            { t:"Logs", fb:"`2^x = -4` can’t happen: every power of 2 is positive. No method finds an answer that doesn’t exist." },
            { t:"No solution", ok:true, fb:"Right. Dividing by 3 gives `2^x = -4`, and `2^x` is never negative." }] },
        { id:"q4", goal:3, prompt:"Which method gives the exact answer most simply? `8^x = 3 · 2^x`",
          choices:[{ t:"Common base", fb:"8 and 2 share base 2, but the coefficient 3 is in the way: `2^{3x} = 3 · 2^x` doesn’t have one power of 2 on each side, and `3 · 2^x` isn’t `6^x`. Divide by `2^x` first: `4^x = 3`, and 3 isn’t a power of 2, so you need logs." },
            { t:"Logs", ok:true, fb:"Right. Divide by `2^x`: `4^x = 3`. 3 isn’t a power of 2 or 4, so `x = log 3 / log 4`." },
            { t:"No solution", fb:"Both sides are positive. `4^x = 3` has the solution `x = log 3 / log 4 ≈ 0.79`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Sort by solution", summary:"Sort by solution", noun:"equation", goal:[1, 2, 3],
        instruction:"Solve each equation, then put it in the box with its solution.", how:"Tap an equation, then tap the box it belongs in.",
        boxes:[{ id:"b1", label:"`x = 3`" }, { id:"b2", label:"`x = -1/2`" }, { id:"b3", label:"`x = log 5 / log 2`" }, { id:"b4", label:"No solution" }],
        items:[
          sortItem("s1", 1, "`4^{x-1} = 16`", "b1", "`4^{x-1} = 4^2`, so `x - 1 = 2` and `x = 3`.", { b2:"Check: `4^{-3/2} = 1/8`, not 16." },
            [H1, "Write 16 as a power of 4: `4^{x-1} = 4^2`.", "`4^{x-1} = 4^2`, so `x - 1 = 2` and `x = 3`."]),
          sortItem("s2", 1, "`8^x = 2^{x+6}`", "b1", "`2^{3x} = 2^{x+6}`, so `3x = x + 6` and `x = 3`.", { b4:"Both sides are powers of 2, so set the exponents equal: `3x = x + 6`." },
            [H1, "Write 8 as `2^3`: `2^{3x} = 2^{x+6}`.", "`2^{3x} = 2^{x+6}`, so `3x = x + 6` and `x = 3`."]),
          sortItem("s3", 3, "`4^x - 7 · 2^x - 8 = 0`", "b1", "With `u = 2^x`: `u^2 - 7u - 8 = (u - 8)(u + 1) = 0`. `2^x = 8` gives `x = 3`; `2^x = -1` is impossible.", { b4:"One factor gives `2^x = -1`, which is impossible, but the other gives `2^x = 8`, so `x = 3` works." },
            ["`4^x = (2^x)^2`. Let `u = 2^x`.", "`u^2 - 7u - 8 = 0` factors as `(u - 8)(u + 1) = 0`.", "`2^x = 8` gives `x = 3`. `2^x = -1` is impossible. So `x = 3`."]),
          sortItem("s4", 1, "`9^x = 1/3`", "b2", "`3^{2x} = 3^{-1}`, so `2x = -1` and `x = -1/2`.", { b4:"A power can be a fraction: `9^{-1/2} = 1/√9 = 1/3`." },
            [H1, "Write both sides as powers of 3: `9^x = 3^{2x}` and `1/3 = 3^{-1}`.", "`3^{2x} = 3^{-1}`, so `2x = -1` and `x = -1/2`."]),
          sortItem("s5", 1, "`(1/4)^x = 2`", "b2", "`(1/4)^x = 2^{-2x} = 2^1`, so `-2x = 1` and `x = -1/2`.", { b1:"Check: `(1/4)^3 = 1/64`, not 2. A base less than 1 needs a negative exponent to make a number bigger than 1." },
            [H1, "Write both sides as powers of 2: `(1/4)^x = 2^{-2x}` and `2 = 2^1`.", "`(1/4)^x = 2^{-2x} = 2^1`, so `-2x = 1` and `x = -1/2`."]),
          sortItem("s6", 3, "`6 · 4^x = 3`", "b2", "Divide by 6: `4^x = 1/2`. `4^x = 2^{2x}` and `1/2 = 2^{-1}`, so `2x = -1`.", { b4:"Isolate the power first: `4^x = 1/2` is positive, so there’s a solution." },
            [H1, "Divide both sides by 6: `4^x = 1/2`.", "Divide by 6: `4^x = 1/2`. `4^x = 2^{2x}` and `1/2 = 2^{-1}`, so `2x = -1` and `x = -1/2`."]),
          sortItem("s7", 2, "`4^x = 25`", "b3", "`x = log 25 / log 4 = 2 log 5 / (2 log 2) = log 5 / log 2`. (Or: `(2^x)^2 = 5^2`, so `2^x = 5`.)", { b4:"No common base doesn’t mean no solution. Logs solve it." },
            [H1, "Take logs: `x log 4 = log 25`, so `x = log 25 / log 4`.", "`x = log 25 / log 4 = 2 log 5 / (2 log 2) = log 5 / log 2`. (Or: `(2^x)^2 = 5^2`, so `2^x = 5`.)"]),
          sortItem("s8", 3, "`2^{x+2} - 2^x = 15`", "b3", "`2^{x+2} = 4 · 2^x`, so factor out `2^x`: `2^x(4 - 1) = 3 · 2^x = 15`. Then `2^x = 5` and `x = log 5 / log 2`.", { b4:"Subtracting powers doesn’t subtract exponents: `2^{x+2} - 2^x` isn’t `2^2 = 4`. Both terms contain `2^x`, so factor it out: `3 · 2^x = 15`." },
            ["`2^{x+2} = 2^2 · 2^x = 4 · 2^x`. What do both terms on the left have in common?", "Factor out `2^x`: `2^x(4 - 1) = 15`, so `3 · 2^x = 15` and `2^x = 5`.", "Take logs: `x log 2 = log 5`, so `x = log 5 / log 2`. Check: `2^x = 5` gives 4 × 5 − 5 = 15."]),
          sortItem("s9", 3, "`4^x - 3 · 2^x - 10 = 0`", "b3", "With `u = 2^x`: `(u - 5)(u + 2) = 0`. `2^x = 5` gives `x = log 5 / log 2`; `2^x = -2` is impossible.", { b4:"Only one factor is impossible. `2^x = 5` has a solution." },
            [H1, "With `u = 2^x`, the equation is `u^2 - 3u - 10 = 0`.", "With `u = 2^x`: `(u - 5)(u + 2) = 0`. `2^x = 5` gives `x = log 5 / log 2`; `2^x = -2` is impossible."]),
          sortItem("s10", 3, "`3^x + 9 = 0`", "b4", "`3^x = -9`, but `3^x` is positive for every `x`.", { b2:"Check: `3^{-1/2} = 1/√3`, which is positive. `3^x + 9` is always more than 9." },
            [H1, "Subtract 9: `3^x = -9`.", "`3^x = -9`, but `3^x` is positive for every `x`."]),
          sortItem("s11", 3, "`2^{x+1} = 2^x`", "b4", "Setting the exponents equal gives `x + 1 = x`, which never happens. (Also: `2^{x+1} = 2 · 2^x`, which is always bigger than `2^x`.)", { b1:"Check: `2^4 = 16`, but `2^3 = 8`." },
            [H1, "Both sides are powers of 2, so set the exponents equal: `x + 1 = x`.", "Setting the exponents equal gives `x + 1 = x`, which never happens. (Also: `2^{x+1} = 2 · 2^x`, which is always bigger than `2^x`.)"]),
          sortItem("s12", 3, "`4^x + 2^x + 6 = 0`", "b4", "Every term is positive, so the left side is more than 6 for every `x`.", { b3:"With `u = 2^x`, `u^2 + u + 6 = 0` has no positive root: every term is positive when `u > 0`." },
            [H1, "With `u = 2^x`, the equation is `u^2 + u + 6 = 0`, and `u = 2^x` is positive.", "Every term is positive, so the left side is more than 6 for every `x`."])
        ] },
      { id:"modelit", type:"custom", title:"Model it, then solve it", summary:"Model it, then solve it", star:true, goal:[4, 5, 6],
        instruction:"Write the model, then solve it. The last four items work backwards, change the factor or chain two models.",
        how:"Type your answer and press Check. A “Use these values” box appears where you need one.",
        fallback:"Write the model first: start amount × factor<sup>(number of periods)</sup>. Then isolate the power.",
        items:[
          { id:"r1", goal:[4, 5], prompt:"A culture of 500 cells doubles every 20 minutes. After how many minutes will there be 8000 cells?", answer:80, unit:"minutes",
            wrong:[{ match:320, fb:"8000 ÷ 500 = 16 is the growth factor, not the number of doublings. 16 = `2^4`: 4 doublings of 20 min." }, { match:4, fb:"4 is the number of doublings. The question asks for minutes: 4 × 20." }],
            hints:["Write the model: `500 · 2^{t/20} = 8000`.", "Divide by 500: `2^{t/20} = 16 = 2^4`.", "`t/20 = 4`, so `t` = 80 minutes."] },
          { id:"r2", goal:[4, 5], prompt:"Iodine-131 has a half-life of about 8 days. How many days until a 48 mg sample has 6 mg left?", answer:24, unit:"days",
            wrong:[{ match:64, fb:"48 ÷ 6 = 8 = `2^3`, so 3 half-lives, not 8." }, { match:14, fb:"That assumes 24 mg is lost every 8 days (3 mg a day). Each half-life removes half of what’s left." }, { match:3, fb:"3 is the number of half-lives: 3 × 8 days." }],
            hints:["Write the model: `48(1/2)^{t/8} = 6`.", "`(1/2)^{t/8}` = 6/48 = 1/8 = `(1/2)^3`.", "`t/8 = 3`, so `t` = 24 days."] },
          { id:"r3", goal:[4, 5], prompt:"$4000 is invested at 5% per year, compounded annually. After how many whole years is it first worth at least $6000?", use:"`log 1.5 ≈ 0.176`, `log 1.05 ≈ 0.0212`", answer:9, unit:"years",
            wrong:[{ match:8, fb:"`n ≈ 8.3`, but after 8 years the balance is $5909.82, still short. Interest is added once a year, so round up." }, { match:10, fb:"That’s simple interest ($200 a year). Compound interest grows faster." }, { match:8.3, round:1, fb:"Interest is added only at the end of each year, so the answer is a whole number of years." }],
            hints:["Solve `4000(1.05)^n = 6000` for `n`.", "`(1.05)^n = 1.5`, so `n = log 1.5 / log 1.05 ≈ 0.176 ÷ 0.0212 ≈ 8.3`.", "Interest is added yearly, so round up: 9 years. (After 8 years: $5909.82; after 9: $6205.31.)"] },
          { id:"r4", goal:6, prompt:"`A = 200(1/2)^{t/5}` gives the milligrams of a drug in the body after `t` hours. Find the average rate of change from `t` = 5 to `t` = 15, in mg per hour.", answer:-7.5, abs:0.05, unit:"mg per hour", keypad:"text",
            wrong:[{ match:7.5, fb:"The amount is falling, so the rate is negative: (25 − 100) ÷ 10." }, { match:-15, fb:"The interval is 15 − 5 = 10 hours long, not 5." }],
            hints:["Find `A(5)` and `A(15)` first.", "`A(5) = 200(1/2)^1 = 100` and `A(15) = 200(1/2)^3 = 25`.", "(25 − 100) ÷ (15 − 5) = −75 ÷ 10 = −7.5 mg per hour."] },
          { id:"r5", goal:5, prompt:"<em>Working backwards.</em> A 240 g sample has 30 g left after 15 hours. What is its half-life, in hours?", answer:5, unit:"hours",
            wrong:[{ match:1.875, fb:"That’s 15 ÷ 8. 240 ÷ 30 = 8 is the factor; 8 = `2^3` is <strong>3</strong> half-lives." }, { match:45, fb:"3 half-lives fit <strong>into</strong> 15 hours, so each is 15 ÷ 3." }, { match:7.5, fb:"That assumes exactly 2 half-lives. 240 → 120 → 60 → 30 is 3." }],
            hints:["Write `240(1/2)^{15/h} = 30` and isolate the power.", "`(1/2)^{15/h} = 1/8 = (1/2)^3`, so `15/h = 3`.", "`h` = 15 ÷ 3 = 5 hours. Check: 240 → 120 → 60 → 30 at 5, 10 and 15 h."] },
          { id:"r6", goal:5, prompt:"<em>Working backwards.</em> An account compounded annually grows from $1000 to $1210 in 2 years. What is the annual interest rate, as a percent?", answer:10, unit:"%",
            wrong:[{ match:10.5, fb:"That splits the $210 evenly over 2 years (simple interest). With compounding, `(1 + r)^2 = 1.21`, so `1 + r = 1.1`." }, { match:21, fb:"21% is the growth over 2 years. The rate is per year: `(1 + r)^2 = 1.21`." }, { match:0.1, fb:"Give the rate as a percent, not as a decimal." }],
            hints:["Write `1000(1 + r)^2 = 1210`.", "`(1 + r)^2 = 1.21`, so `1 + r = 1.1` (the positive root).", "`r` = 0.1 = 10%. Check: 1000 → 1100 → 1210."] },
          { id:"r7", goal:4, prompt:"<em>Transfer.</em> Every 4 hours the body clears one third of the medication present. A patient has 270 mg now. After how many hours will 80 mg remain?", answer:12, unit:"hours",
            wrong:[{ match:4.4, round:1, fb:"Clearing one third <strong>leaves</strong> two thirds, so the factor is 2/3, not 1/3." }, { match:8.4, round:1, fb:"That clears 90 mg every 4 hours. Each period clears a third of what’s <strong>left</strong>, which shrinks." }, { match:3, fb:"3 is the number of 4-hour periods: 3 × 4 hours." }],
            hints:["What fraction is <strong>left</strong> after each 4-hour period?", "Two thirds is left: `270(2/3)^{t/4} = 80`, so `(2/3)^{t/4}` = 80/270 = 8/27.", "8/27 = `(2/3)^3`, so `t/4 = 3` and `t` = 12 hours. Check: 270 → 180 → 120 → 80."] },
          { id:"r8", goal:5, prompt:"<em>Multi-step.</em> Town A has 8000 people and doubles every 10 years. Town B has 64 000 people and doubles every 20 years. After how many years will the towns have the same population?", answer:60, unit:"years",
            wrong:[{ match:30, fb:"That’s when A reaches 64 000, but B keeps growing too." }, { match:90, fb:"`t/10 - t/20` isn’t `t/30`. It’s `2t/20 - t/20 = t/20`." }],
            hints:["Write both models and set them equal: `8000 · 2^{t/10} = 64 000 · 2^{t/20}`.", "Divide by 8000 and by `2^{t/20}`: `2^{t/10 - t/20} = 8`.", "`t/10 - t/20 = t/20`, and 8 = `2^3`, so `t/20 = 3` and `t` = 60 years. Both towns then have 512 000 people."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Amelia", how:"",
        instruction:"Amelia made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Solve `9^{x+2} = 27^x`.",
            steps:["`9 = 3^2` and `27 = 3^3`.", "So `(3^2)^{x+2} = (3^3)^x`.", "That gives `3^{2x+2} = 3^{3x}`.", "Set the exponents equal: `2x + 2 = 3x`, so `x = 2`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: each base was replaced by an equal power of 3.", "", "Step 4 solves step 3’s equation correctly. The mistake is earlier."],
            fixes:[
              { t:"`3^{2x+4} = 3^{3x}`, so `2x + 4 = 3x` and `x = 4`.", ok:true, why:"`(3^2)^{x+2} = 3^{2(x+2)} = 3^{2x+4}`. Check: `9^6` = 531 441 and `27^4` = 531 441." },
              { t:"`3^{x+4} = 3^{3x}`, so `x + 4 = 3x` and `x = 2`.", why:"That adds the exponents 2 and `x + 2`. A power of a power <strong>multiplies</strong> them: `2(x + 2)`." },
              { t:"Step 3 is right; step 4 should give `x = -2`.", why:"`2x + 2 = 3x` does give `x = 2`. The problem is the exponent `2x + 2` itself." },
              { t:"Step 3 is correct as written.", why:"Test `x = 2` in the original: `9^4 = 6561`, but `27^2 = 729`." }],
            hints:["Check step 3: how do you simplify a power of a power?", "`(3^2)^{x+2}` means 3 to the power 2 × `(x + 2)`. The 2 must multiply both `x` and 2.", "Step 3 should be `3^{2x+4} = 3^{3x}`. Then `2x + 4 = 3x`, so `x = 4`."] },
          { id:"e2", goal:2, task:"Solve `5^x = 12`. <span class=\"uses x43-uses\"><strong>Use these values</strong>`log 12 ≈ 1.079`, `log 5 ≈ 0.699`</span>",
            steps:["`log(5^x) = log 12`", "`x log 5 = log 12`", "`x = log 12 / log 5`", "`x = log(12/5) = log 2.4`", "`x ≈ 0.380`"],
            answer:3,
            stepFb:["Step 1 is correct: both sides are positive, so you can take the log of each.", "Step 2 is the power law. Keep checking.", "Step 3 divides both sides by `log 5`, which isn’t 0. Correct.", "", "`log 2.4 ≈ 0.380` is evaluated correctly. The mistake is earlier."],
            fixes:[
              { t:"`x = log 12 ÷ log 5 ≈ 1.079 ÷ 0.699 ≈ 1.54`.", ok:true, why:"A quotient of logs isn’t the log of a quotient. Check: `5^{1.5} = 5√5 ≈ 11.2`, so an answer a little above 1.5 makes sense." },
              { t:"`x = log 12 - log 5 ≈ 0.380`.", why:"`log 12 - log 5` is `log(12/5)`: the same mistake, written another way." },
              { t:"`x = 12/5 = 2.4`.", why:"The logs don’t cancel. `5^{2.4}` is more than `5^2 = 25`, far above 12." },
              { t:"Step 4 is correct as written.", why:"Check: `5^{0.38} ≈ 1.84`, nowhere near 12." }],
            hints:["Steps 1 to 3 use the power law and divide correctly. Look closely at step 4.", "Is `log 12 / log 5` the same number as `log(12/5)`? Estimate each one with the given values.", "No. Step 4 is wrong: `x = log 12 / log 5 ≈ 1.079 ÷ 0.699 ≈ 1.54`."] },
          { id:"e3", goal:4, task:"$5000 is invested at 8% per year, compounded semi-annually (interest is added at the end of each half-year). How long until it is worth at least $8000? <span class=\"uses x43-uses\"><strong>Amelia used these values</strong>`log 1.6 ≈ 0.204`, `log 1.08 ≈ 0.0334`</span>",
            steps:["Interest is compounded twice a year, so `n` counts half-years.", "Each half-year the balance grows by 8%: `5000(1.08)^n = 8000`.", "Divide by 5000: `(1.08)^n = 1.6`.", "`n = log 1.6 / log 1.08 ≈ 0.204 ÷ 0.0334 ≈ 6.1`.", "Interest is added only at the end of a half-year, so round up: 7 half-years, which is 3.5 years."],
            answer:1,
            stepFb:["Step 1 is correct: with semi-annual compounding, each period is half a year.", "", "Step 3 isolates the power in step 2’s equation correctly. The mistake is earlier.", "Step 4 solves step 3’s equation correctly. The mistake is earlier.", "Step 5 rounds up and converts half-years to years correctly. The mistake is earlier."],
            fixes:[
              { t:"Each half-year adds 8% ÷ 2 = 4%: `5000(1.04)^n = 8000`, so `n = log 1.6 / log 1.04 ≈ 0.204 ÷ 0.0170 = 12.0` (`log 1.04 ≈ 0.0170`): 12 half-years, which is 6 years.", ok:true, why:"8% is the yearly rate, shared between two half-years. Check: `5000(1.04)^{11}` ≈ $7697 is still short and `5000(1.04)^{12}` ≈ $8005 is enough, so 12 half-years." },
              { t:"Each half-year adds 8% × 2 = 16%: `5000(1.16)^n = 8000`.", why:"That doubles the rate instead of splitting it. With two periods a year, each period gets half of the yearly 8%: 4%." },
              { t:"Keep `5000(1.08)^n = 8000`, but `n` counts years: 6.1 rounds up to 7 years.", why:"`5000(1.08)^n` with `n` in years is annual compounding. Semi-annual compounding changes both parts: `n` counts half-years <strong>and</strong> the rate per half-year is 4%." },
              { t:"Step 2 is correct as written.", why:"Test Amelia’s answer: 3.5 years is 7 half-years at 4% each, and `5000(1.04)^7` ≈ $6580, well short of $8000. 8% is the rate for a whole year." }],
            hints:["Step 1 says `n` counts half-years. How much interest is added in <strong>one</strong> half-year?", "8% is the yearly rate. Compounded twice a year, each half-year adds 8% ÷ 2 = 4%.", "Step 2 should be `5000(1.04)^n = 8000`. Then `(1.04)^n = 1.6` and `n = log 1.6 / log 1.04 ≈ 0.204 ÷ 0.0170 = 12.0`: 12 half-years, which is 6 years."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the doubling timeline: what happened to the time when you doubled the target, or how the curve looked on the log scale?" },
      { id:"j2", q:"In your own words, why does taking the log of both sides solve an equation like `3^x = 7`? What does the log do to the exponent?" },
      { id:"j3", q:"Explain to a friend how you decide between a common base and logs. Use `9^{x+1} = 27` and `9^{x+1} = 20` as your examples." },
      { id:"j4", q:"Which part of a half-life or compound interest problem do you still find tricky: writing the model, the exponent, or rounding the answer? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Solve `8^x = 32`.", options:[
          { t:"3/5", why:"That’s `3x = 5` solved upside down. `2^{3x} = 2^5` gives `x = 5/3`." },
          { t:"5/3", ok:true, why:"`8 = 2^3` and `32 = 2^5`, so `2^{3x} = 2^5` and `3x = 5`." },
          { t:"4", why:"That’s 32 ÷ 8, which treats `8^x` as `8x`." },
          { t:"5", why:"`2^5 = 32`, but the base on the left is 8, not 2. Rewrite 8 as `2^3` first." }] },
        b:{ prompt:"Solve `9^x = 243`.", options:[
          { t:"2/5", why:"That’s `2x = 5` solved upside down. `3^{2x} = 3^5` gives `x = 5/2`." },
          { t:"5/2", ok:true, why:"`9 = 3^2` and `243 = 3^5`, so `3^{2x} = 3^5` and `2x = 5`." },
          { t:"5", why:"`3^5 = 243`, but the base on the left is 9, not 3. Rewrite 9 as `3^2` first." },
          { t:"27", why:"That’s 243 ÷ 9, which treats `9^x` as `9x`." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What is the exact solution of `6^x = 11`?", options:[
          { t:"`log 11 / log 6`", ok:true, why:"Take logs: `x log 6 = log 11`, so `x = log 11 / log 6`, between 1 and 2 since 6 < 11 < 36." },
          { t:"`log 6 / log 11`", why:"Upside down: this solves `11^x = 6`. The number you want goes on top." },
          { t:"`log(11/6)`", why:"A quotient of logs isn’t the log of a quotient. `log(11/6) ≈ 0.26`, and `6^{0.26}` is less than 2." },
          { t:"11/6", why:"That treats `6^x` as `6x`. `6^{11/6} ≈ 26.7`, not 11." }] },
        b:{ prompt:"What is the exact solution of `5^x = 9`?", options:[
          { t:"`log 9 / log 5`", ok:true, why:"Take logs: `x log 5 = log 9`, so `x = log 9 / log 5`, between 1 and 2 since 5 < 9 < 25." },
          { t:"`log 5 / log 9`", why:"Upside down: this solves `9^x = 5`. The number you want goes on top." },
          { t:"`log(9/5)`", why:"A quotient of logs isn’t the log of a quotient. `log(9/5) ≈ 0.26`, and `5^{0.26}` is less than 2." },
          { t:"9/5", why:"That treats `5^x` as `5x`. `5^{9/5} ≈ 18.1`, not 9." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"A 640 mg sample of a substance has a half-life of 3 days. Which expression gives the amount, in milligrams, left after `t` days?", options:[
          { t:"`640(1/2)^{t/3}`", ok:true, why:"`t/3` counts the half-lives in `t` days, and each one halves the amount." },
          { t:"`640(1/2)^{3t}`", why:"That halves the sample 3 times a day. The exponent counts half-lives: `t` days is `t/3` half-lives." },
          { t:"`640(1/2)^t`", why:"That halves the sample every day, but the half-life is 3 days." },
          { t:"`640 - (320/3)t`", why:"That’s a straight line: it loses 320 mg every 3 days and reaches 0 on day 6. With a half-life, 160 mg is left on day 6." }] },
        b:{ prompt:"A 900 g sample of a substance has a half-life of 5 years. Which expression gives the amount, in grams, left after `t` years?", options:[
          { t:"`900(1/2)^{t/5}`", ok:true, why:"`t/5` counts the half-lives in `t` years." },
          { t:"`900(1/2)^{5t}`", why:"That halves the sample 5 times a year. `t` years is `t/5` half-lives." },
          { t:"`900(1/2)^t`", why:"That halves the sample every year, but the half-life is 5 years." },
          { t:"`900 - 90t`", why:"That’s a straight line: it loses 450 g every 5 years and reaches 0 in year 10. With a half-life, 225 g is left in year 10." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Solve `2^{x+3} - 2^x = 56`.", options:[
          { t:"`x = log 7 / log 2`", why:"That drops the `- 2^x` term: `8 · 2^x = 56` gives `2^x = 7`. But `2^{x+3} - 2^x = 8 · 2^x - 2^x = 7 · 2^x`." },
          { t:"`x = 3`", ok:true, why:"Factor out `2^x`: `2^x(2^3 - 1) = 7 · 2^x = 56`, so `2^x = 8` and `x = 3`. Check: 64 − 8 = 56." },
          { t:"`x = 8`", why:"8 is the value of `2^x`, not `x`. `2^x = 8` means `x = 3`." },
          { t:"No solution", why:"Subtracting powers doesn’t subtract exponents: `2^{x+3} - 2^x` isn’t `2^3`. Factor out `2^x` instead." }] },
        b:{ prompt:"Solve `3^{x+2} - 3^x = 72`.", options:[
          { t:"`x = log 8 / log 3`", why:"That drops the `- 3^x` term: `9 · 3^x = 72` gives `3^x = 8`. But `9 · 3^x - 3^x = 8 · 3^x`." },
          { t:"`x = 2`", ok:true, why:"Factor out `3^x`: `3^x(3^2 - 1) = 8 · 3^x = 72`, so `3^x = 9` and `x = 2`. Check: 81 − 9 = 72." },
          { t:"`x = 9`", why:"9 is the value of `3^x`, not `x`. `3^x = 9` means `x = 2`." },
          { t:"No solution", why:"Subtracting powers doesn’t subtract exponents: `3^{x+2} - 3^x` isn’t `3^2`. Factor out `3^x` instead." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"Solve `3^{x+1} = 5^x`, to two decimal places.", use:"`log 3 ≈ 0.477`, `log 5 ≈ 0.699`", fixedOrder:true, options:[
          { t:"≈ −2.15", why:"A sign slip while gathering the `x`-terms. From `x log 3 + log 3 = x log 5`: `log 3 = x(log 5 - log 3)`, which is positive." },
          { t:"≈ 2.15", ok:true, why:"`(x + 1) log 3 = x log 5`, so `log 3 = x(log 5 - log 3)` and `x ≈ 0.477 ÷ 0.222 ≈ 2.15`." },
          { t:"≈ 3.15", why:"That’s `log 5 ÷ (log 5 - log 3)`, which solves `3^x = 5^{x-1}`. The + 1 is on the 3 side." },
          { t:"≈ 4.50", why:"That’s `x log 3 + 1 = x log 5`: the 1 wasn’t multiplied by `log 3`. `(x + 1) log 3 = x log 3 + log 3`." }] },
        b:{ prompt:"Solve `2^{x+2} = 5^x`, to two decimal places.", use:"`log 2 ≈ 0.301`, `log 5 ≈ 0.699`", fixedOrder:true, options:[
          { t:"≈ −1.51", why:"A sign slip while gathering the `x`-terms. From `x log 2 + 2 log 2 = x log 5`: `2 log 2 = x(log 5 - log 2)`, which is positive." },
          { t:"≈ 1.51", ok:true, why:"`(x + 2) log 2 = x log 5`, so `2 log 2 = x(log 5 - log 2)` and `x ≈ 0.602 ÷ 0.398 ≈ 1.51`." },
          { t:"≈ 3.51", why:"That’s `2 log 5 ÷ (log 5 - log 2)`, which solves `2^x = 5^{x-2}`. The + 2 is on the 2 side." },
          { t:"≈ 5.03", why:"That’s `x log 2 + 2 = x log 5`: the 2 wasn’t multiplied by `log 2`." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"For `A(t) = 3 · 2^{t/4}`, with `t` in hours, the average rate of change from `t` = 0 to `t` = 4 is 3/4 per hour. What is the average rate of change from `t` = 8 to `t` = 12?", options:[
          { t:"3/4", why:"Equal intervals don’t give equal rates for an exponential. `A(8) = 12` and `A(12) = 24`." },
          { t:"3/2", why:"That’s the rate from `t` = 4 to 8, one period later. [8, 12] is two periods after [0, 4], so the rate has doubled twice." },
          { t:"3", ok:true, why:"`A(8) = 3 · 2^2 = 12` and `A(12) = 3 · 2^3 = 24`, so the rate is (24 − 12) ÷ 4 = 3. Each 4-hour period doubles the rate: 3/4, 3/2, 3." },
          { t:"6", why:"That doubles the rate three times. [8, 12] is only two periods after [0, 4]. (6 is also 24 ÷ 4, which forgets to subtract `A(8)`.)" }] },
        b:{ prompt:"For `A(t) = 5 · 3^{t/2}`, with `t` in hours, the average rate of change from `t` = 0 to `t` = 2 is 5 per hour. What is the average rate of change from `t` = 4 to `t` = 6?", options:[
          { t:"5", why:"Equal intervals don’t give equal rates for an exponential. `A(4) = 45` and `A(6) = 135`." },
          { t:"15", why:"That’s the rate from `t` = 2 to 4. [4, 6] is two periods after [0, 2], so the rate has tripled twice." },
          { t:"45", ok:true, why:"`A(4) = 5 · 3^2 = 45` and `A(6) = 5 · 3^3 = 135`, so the rate is (135 − 45) ÷ 2 = 45: 5, 15, 45." },
          { t:"135", why:"That triples the rate three times. (135 is also the amount `A(6)`, not a rate.)" }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Why is it correct to set the exponents equal when solving `2^{3x} = 2^{x+4}`?", options:[
          { t:"Any two equal powers have equal exponents, whatever their bases are.", why:"False: `2^2 = 4^1`, but 2 ≠ 1. It works here only because both bases are 2." },
          { t:"Dividing both sides by 2 cancels the bases and leaves just the exponents.", why:"Dividing by 2 gives `2^{3x-1} = 2^{x+3}`: still powers of 2. A base isn’t a factor that cancels." },
          { t:"Because `3x` and `x + 4` are both linear, you’re allowed to set them equal.", why:"Being linear has nothing to do with it. The reason is that `y = 2^u` never repeats an output." },
          { t:"`y = 2^u` never repeats an output, so equal powers of 2 have equal exponents.", ok:true, why:"`y = 2^u` is always increasing, so each output comes from exactly one exponent. That gives `3x = x + 4`." }] },
        b:{ prompt:"Why is it correct to set the exponents equal when solving `5^{2x-1} = 5^{x+3}`?", options:[
          { t:"Any two equal powers have equal exponents, whatever their bases are.", why:"False: `5^2 = 25^1`, but 2 ≠ 1. It works here only because both bases are 5." },
          { t:"Dividing both sides by 5 cancels the bases and leaves just the exponents.", why:"Dividing by 5 gives `5^{2x-2} = 5^{x+2}`: still powers of 5. A base isn’t a factor that cancels." },
          { t:"Because `2x - 1` and `x + 3` are both linear, you’re allowed to set them equal.", why:"Being linear has nothing to do with it. The reason is that `y = 5^u` never repeats an output." },
          { t:"`y = 5^u` never repeats an output, so equal powers of 5 have equal exponents.", ok:true, why:"`y = 5^u` is always increasing, so each output comes from exactly one exponent. That gives `2x - 1 = x + 3`." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"$1000 is invested at 8% per year, compounded quarterly; interest is added at the end of each quarter. A student solves `1000(1.02)^n = 1500` and gets `n ≈ 20.5`. Which statement is correct?", options:[
          { t:"`n` counts years, so the balance first reaches $1500 after about 20.5 years.", why:"`n` counts compounding periods, which are quarters here, not years: 1.02 is the growth factor for one quarter." },
          { t:"`n` counts quarters; 20.5 rounds to 20, so it first reaches $1500 after 5 years.", why:"After 20 quarters the balance is $1485.95, still short. A waiting time is rounded up, not to the nearest whole number." },
          { t:"`n` counts quarters; round up to 21, so it first reaches $1500 after 5.25 years.", ok:true, why:"Interest arrives only at quarter-ends, so round the number of quarters up: $1485.95 after 20 quarters, $1515.67 after 21. 21 quarters is 21 ÷ 4 = 5.25 years." },
          { t:"`n` counts quarters; it is worth exactly $1500 after 20.5 quarters, or 5.125 years.", why:"Interest is added only at the end of each quarter, so the balance never equals exactly $1500. Partway through quarter 21 it is still $1485.95." }] },
        b:{ prompt:"$1000 is invested at 6% per year, compounded semi-annually; interest is added at the end of each half-year. A student solves `1000(1.03)^n = 2000` and gets `n ≈ 23.4`. Which statement is correct?", options:[
          { t:"`n` counts years, so the balance first reaches $2000 after about 23.4 years.", why:"`n` counts compounding periods, which are half-years here, not years: 1.03 is the growth factor for one half-year." },
          { t:"`n` counts half-years; 23.4 rounds to 23, so it first reaches $2000 after 11.5 years.", why:"After 23 half-years the balance is $1973.59, still short. A waiting time is rounded up, not to the nearest whole number." },
          { t:"`n` counts half-years; round up to 24, so it first reaches $2000 after 12 years.", ok:true, why:"Interest arrives only at half-year ends, so round up: $1973.59 after 23 half-years, $2032.79 after 24. 24 half-years is 24 ÷ 2 = 12 years." },
          { t:"`n` counts half-years; it is worth exactly $2000 after 23.4 half-years, or 11.7 years.", why:"Interest is added only at the end of each half-year, so the balance never equals exactly $2000. Partway through half-year 24 it is still $1973.59." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A patient receives 400 mg of a medication with a half-life of 6 hours. It stops working once less than 50 mg remains. For how many hours does it work?", options:[
          { t:"3", why:"3 is the number of half-lives. Each lasts 6 hours." },
          { t:"10.5", why:"That assumes 200 mg is lost every 6 hours. Each half-life removes half of what’s <strong>left</strong>, which is less each time." },
          { t:"18", ok:true, why:"400 → 50 is a factor of 1/8 = `(1/2)^3`: 3 half-lives, 3 × 6 = 18 hours." },
          { t:"48", why:"That uses 8 half-lives because 400 ÷ 50 = 8. But 8 = `2^3`: three halvings." }] },
        b:{ prompt:"A patient receives 1200 mg of a medication with a half-life of 5 hours. It stops working once less than 75 mg remains. For how many hours does it work?", options:[
          { t:"4", why:"4 is the number of half-lives. Each lasts 5 hours." },
          { t:"9.4", why:"That assumes 600 mg is lost every 5 hours. Each half-life removes half of what’s <strong>left</strong>." },
          { t:"20", ok:true, why:"1200 → 75 is a factor of 1/16 = `(1/2)^4`: 4 half-lives, 4 × 5 = 20 hours." },
          { t:"80", why:"That uses 16 half-lives because 1200 ÷ 75 = 16. But 16 = `2^4`: four halvings." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"In a lake, each metre of water absorbs 20% of the light that reaches it. At what depth is the light half as bright as at the surface? Give the depth to two significant figures.", use:"`log 2 ≈ 0.301`, `log 0.8 ≈ -0.097`", fixedOrder:true, options:[
          { t:"0.32 m", why:"That’s log 0.8 ÷ log 0.5, upside down. `0.8^d = 0.5` gives `d = log 0.5 ÷ log 0.8`: the number you want (0.5) goes on top." },
          { t:"0.43 m", why:"That uses 0.2 as the factor. Absorbing 20% <strong>leaves</strong> 80%, so each metre multiplies the light by 0.8." },
          { t:"2.5 m", why:"That assumes each metre removes 20% of the <strong>surface</strong> light. Each metre removes 20% of what’s left, which is less each time." },
          { t:"3.1 m", ok:true, why:"`0.8^d = 0.5`, so `d = log 0.5 ÷ log 0.8 ≈ -0.301 ÷ -0.097 ≈ 3.1` m." }] },
        b:{ prompt:"In a pond, each metre of water absorbs 25% of the light that reaches it. At what depth is the light half as bright as at the surface? Give the depth to two significant figures.", use:"`log 2 ≈ 0.301`, `log 0.75 ≈ -0.125`", fixedOrder:true, options:[
          { t:"0.42 m", why:"That’s log 0.75 ÷ log 0.5, upside down. `0.75^d = 0.5` gives `d = log 0.5 ÷ log 0.75`: the number you want (0.5) goes on top." },
          { t:"0.50 m", why:"That uses 0.25 as the factor. Absorbing 25% <strong>leaves</strong> 75%, so the factor is 0.75." },
          { t:"2.0 m", why:"That assumes each metre removes 25% of the <strong>surface</strong> light. Each metre removes 25% of what’s left." },
          { t:"2.4 m", ok:true, why:"`0.75^d = 0.5`, so `d = log 0.5 ÷ log 0.75 ≈ -0.301 ÷ -0.125 ≈ 2.4` m." }] } }
    ]
  },
  task:{
    title:"Plan a dose", summary:"Plan a dose",
    statement:"<p>A medication works while at least 100 mg is in the body. Design a single dose and choose a half-life (from the list) so that the plan is safe, works for a full 12 hours, and is nearly cleared by the next day. Then find a <strong>second</strong> plan with a <strong>different</strong> half-life.</p><p class=\"tiny muted\">This is a mathematical model, not medical advice.</p>",
    checks:["The dose is safe: at most 800 mg", "It still works at 12 hours: at least 100 mg left", "It’s nearly cleared by 24 hours: less than 50 mg left", "A second working plan with a different half-life"],
    tips:["More than 800 mg isn’t safe. A shorter half-life needs a bigger dose to last 12 hours, so try a longer half-life.",
      "At 12 hours your plan has {A12} mg. In 12 hours, `12/h` half-lives pass, so the dose must be at least `100 × 2^{12/h}` mg.",
      "At 24 hours your plan still has {A24} mg. Between 12 h and 24 h the amount must fall from at least 100 mg to under 50 mg, so it must more than halve: <strong>more than one</strong> half-life has to fit into those 12 hours. If your half-life already does that, the dose is too big: lower it, but keep it at least `100 × 2^{12/h}` mg.",
      "Your first plan works. Now try a different half-life: what dose would last 12 hours with it?"],
    firstWorks:"Your plan works! Now find a plan with a different half-life.",
    allThree:"You’ve found every half-life that works. No plan works with `h = 12`: between 12 h and 24 h the amount must more than halve. And `h = 2` or 3 would need more than 800 mg to last 12 hours.",
    explainPrompt:"Explain why each of your plans works. Show the number of half-lives in 12 hours and in 24 hours.",
    vocab:"Use the words half-life, exponent and number of half-lives.",
    success:"Solved.",
    more:"There are more plans. Can you find one with a third half-life?"
  },
  cards:[
    ["The common base method", "Write both sides as powers of one base, then set the exponents equal. `4^{x+1} = 8^x` → `2^{2x+2} = 2^{3x}` → `2x + 2 = 3x` → `x = 2`."],
    ["Why equal bases mean equal exponents", "`y = b^u` (`b > 0`, `b ≠ 1`) is always increasing or always decreasing, so each output comes from exactly one exponent."],
    ["Taking the log of both sides", "`3^x = 7` → `log(3^x) = log 7` → `x log 3 = log 7` → `x = log 7 / log 3 ≈ 1.77`."],
    ["`log 7 / log 3` vs `log(7/3)`", "Different numbers. `log 7 / log 3 ≈ 1.77` is a quotient of logs; `log(7/3) = log 7 - log 3 ≈ 0.37`."],
    ["Isolate the power first", "`5 · 2^x + 4 = 44` → `5 · 2^x = 40` → `2^x = 8` → `x = 3`. Never merge `5 · 2^x` into `10^x`."],
    ["`b^x = 0` or `b^x` = a negative number", "No solution: `b^x > 0` for every `x` (`b > 0`). In `4^x - 2^x = 12`, the root `2^x = -3` is rejected and only `x = 2` is left."],
    ["Doubling model", "`A = A_0 · 2^{t/d}`, where `d` is the doubling time and `t/d` counts doublings. Doubling the target adds one doubling time."],
    ["Half-life model", "`A = A_0 · (1/2)^{t/h}`, where `h` is the half-life. 1/16 left means `(1/2)^4`: 4 half-lives, not 16."],
    ["Compound interest", "`A = P(1 + i)^n`: `i` is the rate <strong>per period</strong> and `n` the number of periods. 6% a year compounded quarterly: `i = 0.015` and `n = 4t`."],
    ["Growth or decay by `r`% per period", "Factor `1 + r` for growth, `1 - r` for decay: grows 8% → × 1.08; loses 20% → × 0.8."],
    ["Rounding a waiting time with compound interest", "Interest is added at the end of each period, so round the number of periods <strong>up</strong>: `n ≈ 46.56` → 47 quarters."],
    ["Average rate of change of an exponential", "Over equal intervals it changes by the factor per period. `A = 80(1/2)^{t/5}`: −8 mg/h on [0, 5], −4 mg/h on [5, 10]."]
  ]
};
