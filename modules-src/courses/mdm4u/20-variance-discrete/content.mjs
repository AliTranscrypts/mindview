// MDM4U 20 Variance & Standard Deviation of Discrete Random Variables. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/20-variance-discrete.md
// Core feedback sentences for the plan's misconceptions (§3).
const M1 = "Rare values should count less. Multiply each `(x - μ)^2` by `P(x)`.";
const M2 = "`Σ(x - μ)P(x)` is always 0. Square first.";
const M3 = "`σ = √{Var(X)}`. Variance 9 means `σ = 3`.";
const M4 = "The mean says where the centre is; `σ` says how far values spread from it.";
const M6 = "Shifting every value by 5 moves the centre, not the spread.";
const M7 = "`σ` scales by `|a|`; the variance scales by `a^2`.";
const VAR = "That’s the variance; `σ = √{Var(X)}`.";

export default {
  id:"20-variance-discrete",
  kind:"topic",
  title:"Variance and standard deviation",
  topic:"Variance & Standard Deviation of Discrete Random Variables",
  readyTopic:"variance and standard deviation",
  hero:{
    eq:'<span class="vd-nw">`Var(X) = Σ (x - μ)^2 P(x)`,</span> <span class="vd-nw">`σ = √{Var(X)}`</span>',
    eqLabel:"Var of X equals the sum of x minus mu, squared, times P of x; sigma equals the square root of Var of X.",
    eqSize:"sm",
    headline:"Same average, different story",
    text:"Expected value tells you the centre. <strong>Variance</strong> and <strong>standard deviation</strong> tell you how far the values usually land from it. Square each distance from the mean, weight it by its probability, add, and take the square root: that’s `σ`, a typical distance in the same units as `X`.",
    fig:{ aria:"Two probability histograms, both balanced on a fulcrum at 5. The left one is tight, with bars at 4, 5 and 6; the right one is wide, with bars at 1, 5 and 9. Both have probabilities 0.25, 0.5 and 0.25. Brackets of plus or minus one standard deviation grow from each mean: plus or minus 0.71 on the left and plus or minus 2.83 on the right. Caption: Same mu = 5. Sigma: 0.71 vs 2.83.", shape:"wide" }
  },
  goals:[
    "I can calculate `Var(X)` and `σ` for a discrete distribution.",
    "I can interpret `σ` as a typical distance from the mean and compare spreads of distributions with the same mean.",
    "I can use the shortcut `Var(X) = E(X^2) - μ^2`.",
    "I can compare distributions using tables, histograms, `μ` and `σ`.",
    "I can use `μ` and `σ` together to compare risk in decisions.",
    "I can predict `μ` and `σ` after a change `Y = aX + b`."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Expected value", goal:1, prompt:"`X` = 0, 2, 4 with `P` = 0.25, 0.5, 0.25. Find `μ = E(X)`.",
          options:[
            { t:"2", ok:true, why:"0 + 1 + 1." },
            { t:"1", why:"Add all three products." },
            { t:"6", why:"That adds the values. Multiply each value by its probability, then add." },
            { t:"0.5", why:"0.5 is a probability, not the mean. Find `Σ x P(x)`." }],
          hints:["`Σ x P(x)`.", "0(0.25) + 2(0.5) + 4(0.25).", "2."] },
        { id:"w2", skill:"Expected value", goal:3, prompt:"`X` = 1, 3 with `P` = 0.5, 0.5. Find `E(X^2)`.",
          options:[
            { t:"5", ok:true, why:"`1^2(0.5) + 3^2(0.5) = 0.5 + 4.5`." },
            { t:"4", why:"That’s `(E(X))^2 = 2^2`. `E(X^2)` squares each value first." },
            { t:"2", why:"That’s `E(X)`. Square each value first." },
            { t:"10", why:"That adds the squares without their probabilities." }],
          hints:["Square each value.", "1 and 9, each with `P = 0.5`.", "5."] },
        { id:"w3", skill:"Squares and roots", goal:1, prompt:"`√2.25` = ?",
          options:[
            { t:"1.5", ok:true, why:"1.5 × 1.5 = 2.25." },
            { t:"1.125", why:"That halves 2.25. Find the number whose square is 2.25." },
            { t:"5.0625", why:"That squares 2.25 instead of taking its square root." },
            { t:"0.15", why:"`0.15^2 = 0.0225`." }],
          hints:["Which number squared is 2.25?", "Think `15^2 = 225`.", "1.5."] },
        { id:"w4", skill:"Squares and roots", goal:1, prompt:"`(-3)^2 × 0.25` = ?",
          options:[
            { t:"2.25", ok:true, why:"9 × 0.25." },
            { t:"−2.25", why:"A square is never negative." },
            { t:"−0.75", why:"That skips the square. Square −3 first." },
            { t:"0.75", why:"That uses 3, not `(-3)^2 = 9`." }],
          hints:["Square first.", "`(-3)^2 = 9`.", "9 × 0.25 = 2.25."] },
        { id:"w5", skill:"Distance from the mean", goal:2, prompt:"A distribution has mean 5. How far is the value 2 from the mean, and what is its squared deviation?",
          options:[
            { t:"3; 9", ok:true, why:"2 − 5 = −3, and `(-3)^2 = 9`." },
            { t:"−3; −9", why:"Squares aren’t negative." },
            { t:"3; 6", why:"That doubles 3 instead of squaring it." },
            { t:"7; 49", why:"That adds 2 and 5. The deviation is `x - μ`." }],
          hints:["`x - μ`.", "−3.", "Squared: 9."] },
        { id:"w6", skill:"Changing every value", goal:6, prompt:"Every mark on a test is raised by 5. What happens to the class mean and to the range?",
          options:[
            { t:"The mean rises by 5; the range stays the same", ok:true, why:"Every mark moves together." },
            { t:"Both rise by 5", why:"The highest and lowest both rise by 5, so their gap doesn’t change." },
            { t:"Neither changes", why:"The centre moves." },
            { t:"The mean stays; the range rises", why:"That’s reversed: the centre moves and the gap stays." }],
          hints:["Think of the highest and lowest marks.", "Both rise by 5.", "The gap is unchanged."] }
      ],
      refreshers:{
        "Expected value":"`μ = Σ x P(x)`.",
        "Squares and roots":"Squares are never negative; √ undoes squaring. Use these values: `√2 ≈ 1.41`, `√0.5 ≈ 0.71`, `√8 ≈ 2.83`, `√{35/12} ≈ 1.71`.",
        "Distance from the mean":"Deviation = `x - μ`; squared deviation is always ≥ 0.",
        "Changing every value":"Adding a constant moves the centre but not the spread; multiplying stretches both."
      }
    }
  },
  explore:{
    heading:"Spread m&#101;ter",
    intro:"Build `σ` term by term, then compare two distributions with the same mean.",
    predIntro:"Make a prediction first. Then the spread m&#101;ter will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"compare", a:"tight", b:"wide" },
        prompt:"Compare: Tight (4, 5, 6) vs Wide (1, 5, 9), both with probabilities 0.25, 0.5, 0.25. Which has the larger `σ`, and by how much?",
        options:[{ t:"Wide, 4 times as large", ok:true }, { t:"Wide, 3 times as large" }, { t:"They’re equal, because both means are 5" }, { t:"Tight" }],
        explain:"The brackets grow to ±0.71 and ±2.83. Every deviation is 4 times as far, so `σ` is 4 times as large." },
      { id:"p2", start:{ mode:"transform", x:"die", a:1, b:0, to:{ b:10 } },
        prompt:"Transform, the die with `b = 10`: `Y = X + 10`. What happens to `σ`?",
        options:[{ t:"It stays 1.71", ok:true }, { t:"It becomes 11.71" }, { t:"It becomes 17.1" }, { t:"It becomes 0" }],
        explain:"The histogram slides right, and the brackets keep their width. " + M6.replace("5", "10") },
      { id:"p3", start:{ mode:"transform", x:"die", a:1, b:0, to:{ a:3 } },
        prompt:"Transform, the die with `a = 3`: `Y = 3X`. `σ` becomes…",
        options:[{ t:"3 × 1.71 ≈ 5.12", ok:true }, { t:"9 × 1.71" }, { t:"1.71" }, { t:"1.71 + 3" }],
        explain:"The bars spread to 3, 6, …, 18. Distances triple, so `σ` triples; the variance is multiplied by 9." },
      { id:"p4", start:{ mode:"build", rows:[{ x:"3", p:"1" }] },
        prompt:"Build mode: `P(X = 3) = 1`. `σ` = ?",
        options:[{ t:"0", ok:true }, { t:"3" }, { t:"1" }, { t:"It’s undefined" }],
        explain:"One bar, with no bracket. No spread at all." }
    ],
    chalIntro:"Use the spread m&#101;ter to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Build mode: complete the table for `X` = 0, 2, 4 with `P` = 0.25, 0.5, 0.25 and enter `Var(X)` and `σ`. <span class=\"tiny muted\">(Choose Custom, type the table, show every column with Next column, then fill in the Σ row.)</span>",
        why:"Deviations −2, 0, 2; weighted squares 4(0.25) + 0 + 4(0.25) = 2, so `Var(X) = 2` and `σ = √2 ≈ 1.41`.",
        hints:["Deviations: −2, 0, 2.", "Weighted squares: 4(0.25) + 0 + 4(0.25).", "`Var = 2`, `σ = √2 ≈ 1.41`."] },
      { id:"tc2", goal:2, prompt:"Compare mode: A is Tight (4, 5, 6; `σ = √0.5`). Edit B so that it has the <strong>same mean</strong> (5) and <strong>exactly twice</strong> A’s standard deviation.",
        why:"`σ_B = √2 = 2σ_A`: twice the spread needs four times the variance, 4 × 0.5 = 2.",
        hints:["Twice `σ` means four times the variance: 4 × 0.5 = 2.", "Keep the same shape and spread the values out from 5.", "3, 5, 7 with 0.25, 0.5, 0.25: `Var` = 4(0.25) × 2 = 2."] },
      { id:"tc3", goal:6, stretch:true, prompt:"Transform mode: `X` has `μ = 4` and `σ = 3`. Set `a > 0` and `b` so that `Y = aX + b` has `μ_Y = 50` and `σ_Y = 6`. <span class=\"tiny muted\">(The preset 1 or 7 has `μ = 4` and `σ = 3`.)</span>",
        why:"`σ_Y = aσ`, so `a` = 6 ÷ 3 = 2; `μ_Y = 2(4) + b = 50`, so `b = 42`.",
        hints:["Only `a` changes `σ`.", "6 = `a` × 3.", "`a = 2`; 50 = 2(4) + `b`, so `b = 42`."] }
    ]
  },
  part3:{
    slug:"risk", name:"Risk",
    heading:"Risk vs return",
    intro:"Three offers have the same expected value. Here `σ` turns into a decision about risk: rank the offers, match them to people, then check them with data.",
    stations:[
      { id:"s1", title:"Three summer offers",
        text:"Three summer offers each pay once a week (model numbers). All three have `μ` = $100. Tap the offers in order, from the smallest `σ` to the largest, then check your ranking.",
        offers:[
          { id:"A", t:"$100 guaranteed", vals:[100], ps:[1] },
          { id:"B", t:"$0 or $200, equally likely", vals:[0, 200], ps:[0.5, 0.5] },
          { id:"C", t:"$50 or $150, equally likely", vals:[50, 150], ps:[0.5, 0.5] }],
        right:"A ($0), C ($50), B ($100). All three average $100, but B’s outcomes land $100 from the mean, C’s land $50 away, and A never moves.",
        notFirst:"A never varies: every week pays $100, so `σ` = $0. It belongs first.",
        swap:"B’s outcomes land $100 from the mean; C’s land only $50 away. Which spreads out more?" },
      { id:"s2", title:"Who should choose what?",
        text:"Match each person to an offer. Think about `σ` and about the smallest amount each offer can pay.",
        profiles:[
          { id:"p1", t:"Needs at least $50 for a bill", ok:["A", "C"],
            fb:{ A:"A pays $100 every week (`σ` = $0), so the bill is always covered.", B:"B could pay $0: with `σ` = $100, a $0 week is half the outcomes.", C:"C never pays less than $50 (`σ` = $50), so the bill is covered." } },
          { id:"p2", t:"Can absorb a loss and enjoys a chance at $200", ok:["B"],
            fb:{ A:"A never pays more than $100. Only B offers a chance at $200.", B:"Only B can pay $200; its large `σ` ($100) is the risk this person can accept.", C:"C tops out at $150. Only B offers a chance at $200." } },
          { id:"p3", t:"Wants the safest option", ok:["A"],
            fb:{ A:"`σ` = $0: the pay never changes.", B:"B is the riskiest offer (`σ` = $100).", C:"C still varies (`σ` = $50). One offer never varies at all." } }],
        done:"Equal expected values, different choices: each person weighs `σ` and the minimum outcome." },
      { id:"s3", title:"Check it with data",
        text:"1000 simulated weeks of each offer (seeded, so the same weeks every time). Dots are weekly results; the dark line is the running average.",
        after:"The weekly averages all settle near $100, but the spread of the weekly results differs: A’s dots never move, C’s sit $50 away, and B’s sit $100 away." }
    ],
    quickCheck:{
      title:"Quick check", summary:"Risk vs return quick check",
      items:[
        { id:"q1", goal:2, prompt:"Same mean, larger `σ` means…",
          choices:[
            { t:"more variability (risk)", ok:true, fb:"Right. `σ` measures how far results land from the mean." },
            { t:"a higher expected payout", fb:"`σ` measures spread, not centre." },
            { t:"fewer possible values", fb:"`σ` measures spread, not centre." },
            { t:"a lower minimum always", fb:"`σ` measures spread, not centre." }] },
        { id:"q2", goal:1, prompt:"`σ` of a guaranteed $100?",
          choices:[
            { t:"$0", ok:true, fb:"Right. Every outcome is the mean, so every deviation is 0." },
            { t:"$100", fb:"Every outcome is the mean." },
            { t:"$10", fb:"Every outcome is the mean." },
            { t:"$50", fb:"Every outcome is the mean." }] },
        { id:"q3", goal:1, prompt:"Offer B: $0 or $200, equally likely. `σ`?",
          choices:[
            { t:"$100", ok:true, fb:"Right. Both outcomes are $100 from the mean." },
            { t:"$200", fb:"Both outcomes are $100 from the mean." },
            { t:"$50", fb:"Both outcomes are $100 from the mean." },
            { t:"$0", fb:"Both outcomes are $100 from the mean." }] },
        { id:"q4", goal:5, prompt:"Someone who must have at least $50 would prefer…",
          choices:[
            { t:"A or C", ok:true, fb:"Right. A always pays $100 and C never pays less than $50." },
            { t:"B", fb:"B can pay $0." },
            { t:"any of them", fb:"B can pay $0." },
            { t:"none of them", fb:"B can pay $0." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"find", type:"custom", title:"Find σ", summary:"Find σ", goal:[1, 3, 6],
        instruction:"Find each standard deviation. Round to 2 decimals where an answer doesn’t end.",
        how:"Type a number such as 1.71 or a fraction such as 35/12, then press Check.",
        use:"`√2 ≈ 1.41`, `√0.5 ≈ 0.71`, `√{35/12} ≈ 1.71`",
        items:[
          { id:"v1", goal:1, prompt:"`X` = 2, 6, each with `P` = 0.5: `σ`?", label:"`σ` =", answer:2, display:"`σ = 2`",
            why:"`μ = 4`; `Var(X)` = 4(0.5) + 4(0.5) = 4, so `σ = √4 = 2`.",
            wrong:[{ match:4, fb:VAR }] },
          { id:"v2", goal:1, prompt:"`X` = 0 (`P` = 0.9) or 10 (`P` = 0.1): `σ`?", label:"`σ` =", answer:3, display:"`σ = 3`",
            why:"`μ = 1`; `Var(X)` = 1(0.9) + 81(0.1) = 9, so `σ = 3`.",
            wrong:[{ match:9, fb:VAR }, { match:5, fb:"Weight: 1(0.9) + 81(0.1) = 9." }],
            hints:["`μ = 0(0.9) + 10(0.1) = 1`.", "Squared deviations: 1 and 81.", "1(0.9) + 81(0.1) = 9, so `σ = 3`."] },
          { id:"v3", goal:1, prompt:"A fair die: `Var(X)` and `σ` (2 decimals).", parts:["`Var(X)` =", "`σ` ="], answer:[35 / 12, Math.sqrt(35 / 12)], display:"`Var(X) = 35/12 ≈ 2.92`; `σ ≈ 1.71`",
            why:"`E(X^2) = 91/6`, `μ = 3.5`: `Var(X) = 91/6 - 3.5^2 = 35/12 ≈ 2.92`, and `σ = √{35/12} ≈ 1.71`.",
            wrong:[{ part:0, match:91 / 6, fb:"That’s `E(X^2) = 91/6`. Subtract the square of the mean: `91/6 - 3.5^2`." }] },
          { id:"v4", goal:3, prompt:"`X` = 0, 1, 2, 3 with `P` = 0.4, 0.3, 0.2, 0.1: `σ`?", label:"`σ` =", answer:1, display:"`σ = 1`",
            why:"`μ = 1`; `E(X^2) = 0.3 + 0.8 + 0.9 = 2`; `Var(X) = 2 - 1 = 1`, so `σ = 1`.",
            wrong:[{ match:Math.SQRT2, fb:"`E(X^2) = 2`, `μ^2 = 1`, so `Var = 1`." }] },
          { id:"v5", goal:3, prompt:"`E(X) = 3` and `E(X^2) = 13`: `σ`?", label:"`σ` =", answer:2, display:"`σ = 2`",
            why:"`Var(X) = 13 - 3^2 = 4`, so `σ = 2`.",
            wrong:[{ match:Math.sqrt(13), fb:"`√13` forgets to subtract 9." }] },
          { id:"v6", goal:6, prompt:"`X` has `μ = 4` and `σ = 1.5`. `Y = 2X - 3`: `μ_Y` and `σ_Y`?", parts:["`μ_Y` =", "`σ_Y` ="], answer:[5, 3], display:"`μ_Y = 5`; `σ_Y = 3`",
            why:"`μ_Y = 2(4) - 3 = 5`; `σ_Y = 2 × 1.5 = 3`: the −3 shifts but doesn’t spread.",
            wrong:[{ part:1, match:0, fb:"Subtracting 3 doesn’t cancel the spread." }] }
        ] },
      { id:"compare", type:"custom", title:"Compare and transform", summary:"Compare and transform", goal:[2, 4, 5, 6], star:true,
        instruction:"Compare spreads and predict the effect of a change. Items marked ★ are non-routine; the last two go beyond the Final Check.",
        how:"Type each number (2 decimals where an answer doesn’t end) and tap a choice where there is one, then press Check.",
        items:[
          { id:"b1", goal:4, prompt:"A: 0 or 4 (equally likely). B: 1 or 3 (equally likely). Which has the larger `σ`, and how many times larger?",
            parts:[{ t:"Larger `σ`:", choices:["A", "B", "Neither: they’re equal"] }, "How many times larger?"], answer:["A", 2], display:"A, 2 times as large",
            why:"Both means are 2. A’s values are 2 from the mean (`σ = 2`); B’s are 1 away (`σ = 1`).",
            wrong:[{ part:0, match:"Neither: they’re equal", fb:"Equal means don’t mean equal spreads. " + M4 }] },
          { id:"b2", goal:2, prompt:"`X` = 5 − `d` or 5 + `d`, equally likely. Find `d` so `σ = 3`.", label:"`d` =", answer:3, display:"`d = 3`",
            why:"Both values are `d` from the mean 5, so `σ = d = 3`.",
            wrong:[{ match:9, fb:M3 }] },
          { id:"b3", goal:4, star:true, prompt:"`X` = 0 (`P = p`) or 10 (`P = 1 - p`) with `μ = 2`. Find `p`, then `σ`.", parts:["`p` =", "`σ` ="], answer:[0.8, 4], display:"`p = 0.8`; `σ = 4`",
            why:"10(1 − `p`) = 2 gives `p = 0.8`; `Var(X)` = 4(0.8) + 64(0.2) = 16, so `σ = 4`.",
            wrong:[{ part:1, match:16, fb:VAR }] },
          { id:"b4", goal:2, star:true, prompt:"Number of heads in 2 coin tosses: `σ`? (2 decimals)", label:"`σ` =", answer:Math.SQRT1_2, display:"`σ = √0.5 ≈ 0.71`",
            why:"`P` = 0.25, 0.5, 0.25 for 0, 1, 2 heads; `μ = 1`; `Var` = 1(0.25) + 0 + 1(0.25) = 0.5; `σ = √0.5 ≈ 0.71`.",
            wrong:[{ match:0.5, fb:"`Var = 0.5`; `σ = √0.5`." }] },
          { id:"b5", goal:6, star:true, prompt:"A game pays $9 with `P = 0.1`, else $0. Find `μ` and `σ`. Then the prizes are doubled: new `μ` and `σ`?",
            parts:["`μ` =", "`σ` =", "new `μ` =", "new `σ` ="], answer:[0.9, 2.7, 1.8, 5.4], display:"`μ` = $0.90, `σ` = $2.70; doubled: `μ` = $1.80, `σ` = $5.40",
            why:"`E(X^2) = 8.1`, so `Var = 8.1 - 0.81 = 7.29` and `σ = 2.7`. Doubling doubles both `μ` and `σ`.",
            wrong:[{ part:3, match:10.8, fb:"`σ` doubles, the variance quadruples." }],
            hints:["`μ = 0.9`; `E(X^2) = 81(0.1) = 8.1`.", "`Var = 8.1 - 0.81 = 7.29`, so `σ = 2.7`.", "Doubling: `μ = 1.8`, `σ = 5.4`."] },
          { id:"b6", goal:5, star:true, prompt:"Game P pays $0 or $4, equally likely. Game Q pays $0 or $`x` with `P`(win) = 0.2 and has the same mean as P. Find `x`, Q’s `σ`, and which game is riskier.",
            parts:["`x` =", "Q’s `σ` =", { t:"Riskier:", choices:["Game P", "Game Q", "Equally risky"] }], answer:[10, 4, "Game Q"], display:"`x = 10`; Q’s `σ = 4`; Game Q is riskier",
            fb:"`μ_P = 2 = 0.2x`, so `x = 10`; `Var_Q = 0.2(64) + 0.8(4) = 16`.",
            why:"`μ_P = 2 = 0.2x`, so `x = 10`; `Var_Q = 0.2(64) + 0.8(4) = 16`, so `σ_Q = 4`, twice P’s `σ` of 2.",
            wrong:[{ part:2, match:"Equally risky", fb:M4 }] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Uriel", how:"", goal:[1, 6],
        instruction:"Uriel made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"`X` = 1, 3, 5 with `P` = 0.25, 0.5, 0.25. Find `σ`.",
            steps:["`μ` = 0.25 + 1.5 + 1.25 = 3.", "Deviations: −2, 0, 2. Squares: 4, 0, 4.", "`Var` = (4 + 0 + 4) ÷ 3 = `8/3`.", "`σ = √{8/3} ≈ 1.63`."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 uses step 3’s value."],
            fixes:[
              { t:"`Var` = 4(0.25) + 0(0.5) + 4(0.25) = 2, so `σ = √2 ≈ 1.41`.", ok:true, why:M1 },
              { t:"`Var` = 4 + 0 + 4 = 8.", why:"That adds the squares without their probabilities." },
              { t:"`Var` = (−2 + 0 + 2) ÷ 3 = 0.", why:"Unsquared deviations cancel. Square them, then weight each by its probability." },
              { t:"Step 3 is correct.", why:"The values aren’t equally likely: weight by probability." }],
            hints:["Which probability goes with each square?", "0.25, 0.5, 0.25.", "2, so `σ ≈ 1.41`."] },
          { id:"e2", goal:1, task:"`X` = 0 (`P` = 0.9) or 10 (`P` = 0.1). Find `σ`.",
            steps:["`μ = 1`.", "Squared deviations: 1 and 81.", "`Var` = 1(0.9) + 81(0.1) = 9.", "So `σ = 9`."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"`σ = √9 = 3`.", ok:true, why:M3 },
              { t:"`σ = 81`.", why:"That squares the variance; `σ` is its square root." },
              { t:"`σ = 4.5`.", why:"That halves the variance; `σ` is its square root." },
              { t:"Step 4 is correct.", why:"`σ` is the square root of the variance." }],
            hints:["`Var` or `σ`?", "`σ = √{Var}`.", "3."] },
          { id:"e3", goal:6, task:"`X` has `σ = 2`. A bonus adds 5 to every value: `Y = X + 5`. Find `σ_Y`.",
            steps:["Every value moves up by 5.", "So the mean moves up by 5.", "And `σ_Y = 2 + 5 = 7`."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"Distances from the mean don’t change, so `σ_Y = 2`.", ok:true, why:M6 },
              { t:"`σ_Y = 10`.", why:"Adding 5 doesn’t stretch anything: every distance from the mean stays the same." },
              { t:"`σ_Y = 2 × 5`.", why:"Multiplying would stretch the distances, but this change only adds 5." },
              { t:"Step 3 is correct.", why:"Shifting doesn’t spread the values." }],
            hints:["Does the gap between values change?", "No.", "`σ` stays 2."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most: `σ` quadrupling from Tight to Wide, or `σ` staying put when every value shifted?" },
      { id:"j2", q:"In your own words, why do we square the deviations and then take a square root?" },
      { id:"j3", q:"Explain to a friend how to compare two games with the same expected value." },
      { id:"j4", q:"Describe a choice in your life where the spread matters as much as the average. What would you choose, and why?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"`X` = 1 or 3, each with `P` = 0.5. Find `Var(X)`.", options:[
          { t:"1", ok:true, why:"`μ = 2`; `(-1)^2(0.5) + 1^2(0.5)`." },
          { t:"0", why:"The unsquared deviations cancel." },
          { t:"2", why:"That adds the squares without the probabilities." },
          { t:"5", why:"That’s `E(X^2)`; subtract `μ^2 = 4`." }] },
        b:{ prompt:"`X` = 2 or 6, each with `P` = 0.5. Find `Var(X)`.", options:[
          { t:"4", ok:true, why:"`μ = 4`; 4(0.5) + 4(0.5)." },
          { t:"0", why:M2 },
          { t:"8", why:"That adds the squares without the probabilities." },
          { t:"20", why:"`E(X^2) = 20`; subtract 16." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"`Var(X) = 2.25`. Find `σ`.", options:[
          { t:"1.5", ok:true, why:"`√2.25`." },
          { t:"2.25", why:"That’s the variance itself. `σ = √{Var(X)}`." },
          { t:"5.0625", why:"That squares the variance." },
          { t:"1.125", why:"That halves it." }] },
        b:{ prompt:"`Var(X) = 0.36`. Find `σ`.", options:[
          { t:"0.6", ok:true, why:"`√0.36`." },
          { t:"0.36", why:"That’s the variance itself. `σ = √{Var(X)}`." },
          { t:"0.1296", why:"That squares it." },
          { t:"0.18", why:"That halves it." }] } },
      { id:"k3", cat:"K", goal:6,
        a:{ prompt:"`Y = X + 7`. How does `σ_Y` compare with `σ_X`?", options:[
          { t:"They’re equal", ok:true, why:"Adding a constant doesn’t change spread." },
          { t:"`σ_Y = σ_X + 7`", why:"Shifting every value by 7 moves the centre, not the spread." },
          { t:"`σ_Y = 7σ_X`", why:"That’s for multiplying by 7." },
          { t:"`σ_Y = σ_X + 49`", why:"Adding 7 doesn’t change the spread at all, and nothing gets squared." }] },
        b:{ prompt:"`Y = 4X`. How does `σ_Y` compare with `σ_X`?", options:[
          { t:"`σ_Y = 4σ_X`", ok:true, why:"Every distance from the mean becomes 4 times as far." },
          { t:"`σ_Y = 16σ_X`", why:"That’s how the variance scales." },
          { t:"`σ_Y = σ_X + 4`", why:"Multiplying stretches the distances; it doesn’t add to them. " + M7 },
          { t:"They’re equal", why:"Multiplying stretches the distances." }] } },
      { id:"t1", cat:"T", goal:1,
        a:{ prompt:"`X` = 0, 2, 4 with `P` = 0.125, 0.75, 0.125. Find `σ`.", options:[
          { t:"1", ok:true, why:"`μ = 2`; `Var` = 4(0.125) + 0 + 4(0.125) = 1." },
          { t:"About 1.63", why:"Averaging 4, 0, 4 equally gives `8/3`." },
          { t:"0", why:"The unsquared deviations cancel. Square first." },
          { t:"About 2.24", why:"`√5`: `E(X^2) = 5` without subtracting `μ^2 = 4`." }] },
        b:{ prompt:"`X` = 1, 3, 5 with `P` = 0.125, 0.75, 0.125. Find `σ`.", options:[
          { t:"1", ok:true, why:"`μ = 3`; `Var` = 4(0.125) + 0 + 4(0.125)." },
          { t:"About 1.63", why:"Averaging 4, 0, 4 equally gives `8/3`. " + M1 },
          { t:"0", why:"The unsquared deviations cancel. Square first." },
          { t:"About 3.16", why:"`√10` forgets to subtract 9." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Game A always pays $2. Game B pays $0 or $4 (equally likely). Game C pays $1 or $3 (equally likely). Order the games from smallest to largest `σ`.", options:[
          { t:"A, C, B", ok:true, why:"`σ` = 0, 1, 2." },
          { t:"All equal, because each has a mean of $2", why:M4 },
          { t:"B, C, A", why:"Reversed." },
          { t:"A, B, C", why:"C’s values are closer to the mean than B’s." }] },
        b:{ prompt:"Three distributions each have mean 10: A is 9 or 11, B is 6 or 14 (each equally likely), and C is always 10. Order from smallest to largest `σ`.", options:[
          { t:"C, A, B", ok:true, why:"`σ` = 0, 1, 4." },
          { t:"All equal", why:M4 },
          { t:"B, A, C", why:"Reversed." },
          { t:"A, C, B", why:"C has no spread at all." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"A tutor charges $20 per month plus $15 per session. The number of sessions `X` a student books in a month has `μ = 4` and `σ = 1.5`. Find the mean and standard deviation of the monthly bill `Y = 15X + 20`.", options:[
          { t:"`μ` = $80, `σ` = $22.50", ok:true, why:"15(4) + 20; 15 × 1.5." },
          { t:"`μ` = $80, `σ` = $42.50", why:"The $20 fee doesn’t add spread." },
          { t:"`μ` = $60, `σ` = $22.50", why:"The mean includes the $20 fee." },
          { t:"`μ` = $80, `σ` = $337.50", why:"`15^2 × 1.5` mixes variance and `σ`." }] },
        b:{ prompt:"A delivery bill is `Y = 10X + 5`, where `X` (the number of parcels) has `μ = 3` and `σ = 2`. Find `μ_Y` and `σ_Y`.", options:[
          { t:"`μ` = $35, `σ` = $20", ok:true, why:"10(3) + 5; 10 × 2." },
          { t:"`μ` = $35, `σ` = $25", why:"The $5 doesn’t add spread." },
          { t:"`μ` = $30, `σ` = $20", why:"Include the $5 in the mean." },
          { t:"`μ` = $35, `σ` = $200", why:"`10^2 × 2` mixes variance and `σ`: `σ` scales by 10." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"`X` = goals per game for a team, with `μ = 2.4` and `σ = 0.8`. Which best explains what `σ` means?", options:[
          { t:"“In a typical game, the number of goals is about 0.8 away from the 2.4 average.”", ok:true, why:"`σ` is a typical distance from the mean." },
          { t:"“The team scores 0.8 goals per game.”", why:"That would be a mean." },
          { t:"“80% of games have 2 or 3 goals.”", why:"`σ` isn’t a percentage." },
          { t:"“The probability of scoring is 0.8.”", why:"`σ` isn’t a probability." }] },
        b:{ prompt:"Two players both average 20 points per game. Player A has `σ = 2` and player B has `σ = 9`. Which best compares them?", options:[
          { t:"“A is more consistent: A’s games usually land near 20, while B’s vary much more.”", ok:true, why:"Same mean; a smaller `σ` means results stay closer to it." },
          { t:"“B is better, because 9 > 2.”", why:"A larger `σ` means more variation, not more points. " + M4 },
          { t:"“They’re the same, because their means are equal.”", why:M4 },
          { t:"“A scores 2 points per game.”", why:"`σ` isn’t a score." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Why are the deviations squared when finding the variance?", options:[
          { t:"“Positive and negative deviations would cancel to 0; squaring makes every deviation count as a positive amount.”", ok:true, why:"Unsquared deviations always sum to 0, so squaring is needed." },
          { t:"“To make the numbers bigger and easier to compare.”", why:"Size isn’t the reason." },
          { t:"“Because probabilities are squared too.”", why:"Only the deviations are squared." },
          { t:"“Squaring isn’t needed; it’s a convention.”", why:M2 }] },
        b:{ prompt:"Why do we usually report `σ` rather than the variance?", options:[
          { t:"“`σ` is in the same units as `X`, so it’s easier to interpret as a typical distance.”", ok:true, why:"Squaring changes the units (dollars become square dollars); the square root brings them back." },
          { t:"“`σ` is always smaller than the variance.”", why:"Not when the variance is less than 1." },
          { t:"“The variance can be negative.”", why:"A variance is never negative." },
          { t:"“`σ` ignores the probabilities.”", why:"`σ` comes from the weighted variance." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"Job A pays $600 a week, guaranteed. Job B (commission) pays $400 or $800 a week, equally likely. Which statement is correct?", options:[
          { t:"Both have `μ` = $600; A has `σ` = $0 and B has `σ` = $200, so B is riskier", ok:true, why:"B averages (400 + 800) ÷ 2 = $600, and each outcome is $200 from the mean." },
          { t:"B has a higher expected pay.", why:"Both average $600." },
          { t:"B has `σ` = $400.", why:"Each outcome is $200 from the mean." },
          { t:"Both have `σ` = $0, because their means are equal.", why:M4 }] },
        b:{ prompt:"Investment A returns $50, guaranteed. Investment B returns $0 or $100, equally likely. Which statement is correct?", options:[
          { t:"Both have `μ` = $50; B has `σ` = $50, so B is riskier", ok:true, why:"B averages $50, and each outcome is $50 from the mean." },
          { t:"B has a higher mean.", why:"Both average $50. " + M4 },
          { t:"B has `σ` = $100.", why:"Each outcome is $50 from the mean." },
          { t:"Both have `σ` = $0.", why:M4 }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"An app’s number of crashes per week, `X`, is 0, 1, 2 or 3 with `P` = 0.4, 0.3, 0.2, 0.1. Find `σ`.", options:[
          { t:"1", ok:true, why:"`μ = 1`; `E(X^2) = 0.3 + 0.8 + 0.9 = 2`; `Var` = 2 − 1 = 1." },
          { t:"About 1.41", why:"`√2` forgets to subtract `μ^2 = 1`." },
          { t:"About 1.22", why:"Averaging the squared deviations equally gives 1.5." },
          { t:"1.5", why:"That’s an unweighted variance, with no square root." }] },
        b:{ prompt:"`X` is 0, 1, 2 or 3 with `P` = 0.1, 0.2, 0.3, 0.4. Find `σ`.", options:[
          { t:"1", ok:true, why:"`μ = 2`; `E(X^2) = 0.2 + 1.2 + 3.6 = 5`; `Var` = 5 − 4 = 1." },
          { t:"About 2.24", why:"`√5` forgets to subtract 4." },
          { t:"About 1.22", why:"Averaging the squared deviations equally gives 1.5. " + M1 },
          { t:"1.5", why:"That’s an unweighted variance, with no square root." }] } }
    ]
  },
  task:{
    title:"Same mean, different risk", summary:"Same mean, different risk",
    statement:"<p>Design a prize wheel with 2 or 3 different prize amounts. It must meet every condition. Can you find all the answers?</p>" +
      '<ol class="vd-conds"><li>The expected prize is $5.</li><li>The standard deviation is exactly $2.</li><li>There’s at least a 50% chance of winning more than $5.</li></ol>',
    checks:["Expected prize $5", "`σ` = $2", "At least 50% chance of more than $5"],
    tips:["Balance the wheel at 5: big prizes need small probabilities.", "`σ = 2` means the weighted squared distances from 5 add to 4.", "Put at least half the probability on prizes above $5."],
    explainPrompt:"Explain how you balanced the mean at $5 and how you got the spread to exactly `σ` = 2.",
    vocab:"Use the words expected value, deviation, variance and standard deviation.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Two more wheels have `μ = 5` and `σ = 2`: $4/$9 (0.8/0.2) and $3/$4/$8 (0.2/0.5/0.3). But they win more than $5 only 20% or 30% of the time."
  },
  cards:[
    ["Variance", "`Var(X) = Σ (x - μ)^2 P(x)`."],
    ["Standard deviation", "`σ = √{Var(X)}`: a typical distance from the mean, in `X`’s units."],
    ["Why square?", "Unsquared deviations always sum to 0."],
    ["Weighting", "Each squared deviation is multiplied by its probability."],
    ["Shortcut", "`Var(X) = E(X^2) - μ^2`."],
    ["`σ = 0`", "Every outcome equals the mean: no spread."],
    ["Same mean, different `σ`", "Different risk: compare `σ`, not just `μ`."],
    ["`Y = X + b`", "`μ` shifts by `b`; `σ` is unchanged."],
    ["`Y = aX`", "`μ` and `σ` multiply by `a` (`σ` by `|a|`); the variance by `a^2`."],
    ["Two equally likely values `m ± d`", "`μ = m`, `σ = d`."],
    ["Die", "`μ = 3.5`, `Var = 35/12 ≈ 2.92`, `σ ≈ 1.71`."],
    ["Risk", "A large `σ` means results often land far from the expected value."]
  ]
};
