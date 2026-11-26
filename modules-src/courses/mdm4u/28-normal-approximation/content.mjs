// MDM4U 28 Normal Approximation to the Binomial. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/28-normal-approximation.md
const P = s => "<i>P</i>(" + s + ")";        // P(words) with an italic P and upright words
// Core feedback sentences for the plan's misconceptions (§3).
const M1 = "`npq` is the variance. `σ = √{npq}`: for `n = 400`, `p = 0.2`, `σ = √64 = 8`.";
const M2 = "Each whole number is a bar of width 1. Use `k - 0.5` or `k + 0.5` as the boundary.";
const M3 = "`X >= 60` <strong>includes</strong> the bar at 60, which starts at 59.5.";
const M4 = "`n = 1000` with `p = 0.002` gives `np = 2`: still skewed. Check `np` and `nq`.";
const M5 = "‘More than 140’ starts at 141: the boundary is 140.5.";
const M6 = "Use the bar from `k - 0.5` to `k + 0.5`: that has area.";
const M7 = "`μ = np`: for `p = 0.2` and `n = 400`, `μ = 80`, not 200.";

export default {
  id:"28-normal-approximation",
  kind:"topic",
  title:"Normal approximation to the binomial",
  topic:"Normal Approximation to the Binomial",
  readyTopic:"the normal approximation to the binomial",
  hero:{
    eq:'<span class="na-heq"><span>`X ∼ B(n, p) ≈ N(np, npq)`</span><span class="na-hsub">`np > 5` and `nq > 5`</span></span>',
    eqLabel:"X is binomial with n and p, approximately normal with mean n p and variance n p q, when n p is greater than 5 and n q is greater than 5.",
    eqSize:"md",
    headline:"Bars become a bell",
    text:"Adding up dozens of binomial probabilities by hand is slow. When there are enough trials, the binomial histogram takes on a bell shape, so a <strong>normal curve</strong> with mean <strong>`np`</strong> and standard deviation <strong>`√{npq}`</strong> can estimate it. One adjustment matters: the <strong>continuity correction</strong>, which turns each whole number into a bar from `k - 0.5` to `k + 0.5`.",
    fig:{ aria:"A binomial histogram for n = 10, p = 0.5 grows to n = 100 as the bars narrow and multiply. A normal curve fades in over the bars. The bar at 60 is picked out, with its edges at 59.5 and 60.5 marked, and the area under the curve over that bar is shaded to match it.", shape:"wide" }
  },
  goals:[
    "I can check whether the normal approximation is allowed (`np > 5` and `nq > 5`).",
    "I can find the mean and standard deviation of the approximating normal distribution.",
    "I can apply the continuity correction for ≥, >, ≤, <, = and ‘between’.",
    "I can approximate binomial probabilities using `z`-scores and the table.",
    "I can judge how good the approximation is, and when it fails.",
    "I can use the approximation in real contexts such as quality control and testing whether a coin is fair."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Binomial mean and SD", goal:2, prompt:"A binomial distribution has `n = 100` and `p = 0.2`. What is its mean?",
          options:[
            { t:"20", ok:true, why:"`np = 100 × 0.2`." },
            { t:"80", why:"That’s the expected number of failures." },
            { t:"50", why:"`n ÷ 2` only works when `p = 0.5`." },
            { t:"0.2", why:"Multiply by `n`." }],
          hints:["Mean of a binomial?", "`μ = np`.", "`100 × 0.2 = 20`."] },
        { id:"w2", skill:"Binomial mean and SD", goal:2, prompt:"For `n = 100` and `p = 0.2`, what is the standard deviation?",
          options:[
            { t:"4", ok:true, why:"`√{100 × 0.2 × 0.8} = √16`." },
            { t:"16", why:"16 is the variance." },
            { t:"20", why:"That’s `np`." },
            { t:"2", why:"`√{npq} = √16 = 4`." }],
          hints:["`σ = √{npq}`.", "`npq = 100 × 0.2 × 0.8 = 16`.", "`√16 = 4`."] },
        { id:"w3", skill:"The z-table", goal:4, prompt:"Use the table: `P(Z > 1.90) = ?`",
          options:[
            { t:"0.0287", ok:true, why:"`1 - 0.9713`." },
            { t:"0.9713", why:"‘Greater than’ needs 1 − left area." },
            { t:"0.4713", why:"Subtract from 1." },
            { t:"1.90", why:"Look `z` up in the table." }],
          hints:["What does the table give?", "The left area, 0.9713.", "`1 - 0.9713 = 0.0287`."] },
        { id:"w4", skill:"The z-table", goal:4, prompt:"Use the table: `P(-1.10 < Z < 1.10) = ?`",
          options:[
            { t:"0.7286", ok:true, why:"`0.8643 - 0.1357`." },
            { t:"1.0000", why:"Subtract the left areas." },
            { t:"0.8643", why:"Remove the part below −1.10." },
            { t:"0.1357", why:"That’s below −1.10." }],
          hints:["Find both left areas.", "0.8643 and 0.1357.", "Subtract: 0.7286."] },
        { id:"w5", skill:"Inequality words", goal:3, prompt:"`X` counts heads (whole numbers). Which values make ‘`X` is more than 60’ true?",
          options:[
            { t:"61, 62, 63, …", ok:true, why:"‘More than 60’ excludes 60." },
            { t:"60, 61, 62, …", why:"That’s ‘60 or more’." },
            { t:"59, 60, 61, …", why:"59 isn’t more than 60." },
            { t:"60 only", why:"‘More than’ is a range of values." }],
          hints:["Is 60 more than 60?", "No.", "61 and up."] },
        { id:"w6", skill:"Inequality words", goal:3, prompt:"‘At most 40 defects’ means…",
          options:[
            { t:"`X <= 40`", ok:true, why:"40 is allowed, nothing above it." },
            { t:"`X < 40`", why:"40 itself is allowed." },
            { t:"`X >= 40`", why:"‘At most’ caps the value." },
            { t:"`X > 40`", why:"‘At most’ means no more than." }],
          hints:["Can there be exactly 40?", "Yes.", "`X <= 40`."] }
      ],
      refreshers:{
        "Binomial mean and SD":"`μ = np`, `σ = √{npq}` with `q = 1 - p`. Choose numbers so that `npq` is a perfect square: `n = 400`, `p = 0.2` gives `npq = 64`, so `σ = 8`.",
        "The z-table":"The table gives the left area. Right area = 1 − left; between = bigger left − smaller left.",
        "Inequality words":"‘At least `k`’ and ‘`k` or more’ mean `>= k`. ‘More than `k`’ means `>= k + 1`. ‘At most’ and ‘no more than’ mean `<= k`. ‘Fewer than `k`’ means `<= k - 1`."
      }
    }
  },
  explore:{
    heading:"Overlay",
    intro:"Set `n` and `p`, watch how well the bell curve fits the bars, then pick an event and compare the exact answer with the approximation.",
    predIntro:"Make a prediction first. Then the overlay will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"over", n:10, p:50 },
        prompt:"Which will the normal curve fit better: `n = 10` or `n = 100` (both `p = 0.5`)?",
        options:[{ t:"`n = 100`", ok:true }, { t:"`n = 10`" }, { t:"Both the same" }, { t:"Neither" }],
        explain:"More trials give more, narrower bars, which hug the curve." },
      { id:"p2", start:{ mode:"over", n:100, p:2 },
        prompt:"Will the normal curve fit this binomial well?",
        options:[{ t:"No: `np = 2`, and the bars are bunched against 0 with a long right tail", ok:true }, { t:"Yes, because `n` is large" }, { t:"Yes, because `p` is small" }, { t:"Yes, a normal curve always fits" }],
        explain:"Check `np` and `nq`, not just `n`." },
      { id:"p3", start:{ mode:"corr", n:100, p:50, ev:"ge", k:60 },
        prompt:"Where should the normal area start?",
        options:[{ t:"59.5", ok:true }, { t:"60.5" }, { t:"60" }, { t:"59" }],
        explain:"`X >= 60` includes the whole bar for 60." },
      { id:"p4", start:{ mode:"corr", n:100, p:50, ev:"eq", k:50 },
        prompt:"Without a correction, what probability does the normal curve give for exactly 50?",
        options:[{ t:"0", ok:true }, { t:"0.0796" }, { t:"0.5000" }, { t:"0.3989" }],
        explain:"A line has no area; the bar does. With the correction, 49.5 to 50.5 gives `0.5398 - 0.4602 = 0.0796` (the exact value is also 0.0796)." }
    ],
    chalIntro:"Use the overlay to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"With `p = 0.1`, find the smallest `n` for which both conditions hold.",
        why:"`n = 51`: `np = 5.1 > 5` and `nq = 45.9 > 5`.",
        hints:["Which condition is harder to meet when `p = 0.1`?", "`np > 5`, so `n > 50`.", "The smallest whole number is 51."] },
      { id:"tc2", goal:3, prompt:"Set up the approximation of `P(45 <= X <= 55)` for `n = 100`, `p = 0.5`.",
        why:"The boundaries are 44.5 and 55.5: `0.8643 - 0.1357 = 0.7286` (the exact value is 0.7287).",
        hints:["Which bars are included?", "45 through 55: from 44.5 to 55.5.", "`z = ±1.10`: `0.8643 - 0.1357 = 0.7286`."] },
      { id:"tc3", goal:3, stretch:true, prompt:"A coin is tossed 400 times. Choose the smallest cutoff `k` so that, using the approximation, a fair coin reaches `k` or more heads at most 2.5% of the time.",
        why:"`k = 221`: `z = (220.5 - 200) ÷ 10 = 2.05`, area 0.0202 ≤ 0.025. For `k = 220`, `z = 1.95` and the area is 0.0256 > 0.025.",
        hints:["`μ = 200` and `σ = √100 = 10`.", "You need `(k - 0.5 - 200) ÷ 10 >= 1.96`.", "`k - 0.5 >= 219.6`, so `k = 221`. Check: `z = 2.05` gives 0.0202."] }
    ]
  },
  part3:{
    slug:"fails", name:"When it fails",
    heading:"When does it fail?",
    intro:"Here you judge evidence instead of computing it. Each station shows the exact binomial value (worked out by the tool) beside the approximation. Decide whether to trust it. The <strong>Check it with data</strong> panel lists the errors.",
    stations:[
      { id:"s1", t:"A great fit", n:100, p:0.5, badge:"`np = nq = 50`",
        rows:[{ ev:"le", k:45, label:"`P(X <= 45)`", exact:"0.1841", apx:"0.1841", z:"`z = -0.90`", err:"0.0000" }],
        q:"Should you trust the approximation here?",
        opts:[{ t:"Yes: the bars are symmetric and plentiful, and the error is about 0", ok:true, fb:"Right. `np = nq = 50`, and exact and approximate agree to 4 places." },
          { t:"No: the curve misses the bars", fb:"Look at the overlay and the error: exact and approximate agree to 4 places." }] },
      { id:"s2", t:"A poor fit", n:20, p:0.05, badge:"`np = 1`",
        rows:[{ ev:"le", k:0, label:"`P(X = 0)`", exact:"0.3585", apx:"0.3050", z:"`z = -0.51`", err:"0.05" },
          { ev:"ge", k:3, label:"`P(X >= 3)`", exact:"0.0755", apx:"0.0618", z:"`z = 1.54`", err:"0.01" }],
        note:"The histogram leans hard to the left, and the normal curve puts area below 0.",
        q:"Should you trust the approximation here?",
        opts:[{ t:"No: the histogram is skewed and the errors are large for probabilities this small", ok:true, fb:"Right. `np = 1`: the bars pile up at 0, and the curve spills below 0." },
          { t:"Yes: 0.05 and 0.01 are small errors", fb:"An error of 0.01 on 0.0755 is almost 20% of the answer. The bars are skewed: `np = 1`." }] },
      { id:"s3", t:"A huge `n` that still fails", n:1000, p:0.002, badge:"`np = 2`",
        note:"The histogram is a narrow spike at 0–4; the curve spills into negative counts.",
        q:"Why does the approximation fail, even with `n = 1000`?",
        opts:[{ t:"`np` is small, however large `n` is", ok:true, fb:"Right. " + M4 },
          { t:"`n` is too large for the curve", fb:"Large `n` helps. The problem is `np = 2`." },
          { t:"The continuity correction wasn’t used", fb:"No correction can fix a skewed histogram. Check `np`." },
          { t:"`p` is too close to 0.5", fb:"`p = 0.002` is far from 0.5. That’s why `np` is so small." }] },
      { id:"s4", t:"A surprise", n:8, p:0.5, badge:"`np = 4`",
        rows:[{ ev:"ge", k:6, label:"`P(X >= 6)`", exact:"0.1445", apx:"0.1446", z:"`z = 1.06`", err:"0.0001" }],
        note:"The rule of thumb is cautious: for `p = 0.5` the bars are symmetric, so even small `n` fits. The rule protects you when `p` is far from 0.5.",
        q:"The rule says no (`np = 4`). How good is the approximation here?",
        opts:[{ t:"Very good: 0.1446 against an exact 0.1445", ok:true, fb:"Right. Symmetric bars fit the curve well even for small `n`." },
          { t:"Poor, because `np < 5`", fb:"Compare the numbers: 0.1446 against an exact 0.1445." }] }
    ],
    quickCheck:{
      title:"Quick check", summary:"When it fails quick check",
      items:[
        { id:"q1", goal:1, prompt:"Which setting fails the conditions?",
          choices:[
            { t:"`n = 60`, `p = 0.05`", ok:true, fb:"Right. `np = 3`." },
            { t:"`n = 60`, `p = 0.5`", fb:"`np = 3` for `p = 0.05`. (For `p = 0.9`, `nq = 6 > 5`.)" },
            { t:"`n = 60`, `p = 0.2`", fb:"`np = 3` for `p = 0.05`. (For `p = 0.9`, `nq = 6 > 5`.)" },
            { t:"`n = 60`, `p = 0.9`", fb:"`np = 3` for `p = 0.05`. (For `p = 0.9`, `nq = 6 > 5`.)" }] },
        { id:"q2", goal:5, prompt:"Why does the curve fit badly when `np` is small?",
          choices:[
            { t:"The histogram is skewed", ok:true, fb:"Right. Bars pile up near 0 with a long right tail." },
            { t:"`n` is too big", fb:"Bars pile up near 0 with a long right tail." },
            { t:"The mean is 0", fb:"Bars pile up near 0 with a long right tail." },
            { t:"The curve is too wide", fb:"Bars pile up near 0 with a long right tail." }] },
        { id:"q3", goal:5, prompt:"`n = 1000`, `p = 0.002`. Use the normal approximation?",
          choices:[
            { t:"No", ok:true, fb:"Right. `np = 2`." },
            { t:"Yes", fb:"`np = 2`. " + M4 },
            { t:"Only with the correction", fb:"`np = 2`. " + M4 },
            { t:"Only for `X = 0`", fb:"`np = 2`. " + M4 }] },
        { id:"q4", goal:5, prompt:"In Station 1, why is the error almost 0?",
          choices:[
            { t:"`p = 0.5` and `n` is large, so the bars are symmetric and fine", ok:true, fb:"Right. Symmetric bars plus many trials: a near-perfect bell." },
            { t:"The correction was skipped", fb:"Symmetric bars plus many trials: a near-perfect bell." },
            { t:"`n` is small", fb:"Symmetric bars plus many trials: a near-perfect bell." },
            { t:"The event is in the tail", fb:"Symmetric bars plus many trials: a near-perfect bell." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Correction matcher", summary:"Correction matcher", goal:3,
        instruction:"Match each binomial event with the normal area that the continuity correction gives.",
        leftTitle:"Binomial event", rightTitle:"Normal area",
        left:[
          { id:"l1", t:"`X >= 60`", why:"60 is included, and its bar starts at 59.5." },
          { id:"l2", t:"`X > 60`", why:"The first value is 61, whose bar starts at 60.5." },
          { id:"l3", t:"`X <= 40`", why:"40 is included, and its bar ends at 40.5." },
          { id:"l4", t:"`X < 40`", why:"The last value is 39, whose bar ends at 39.5." },
          { id:"l5", t:"`X = 50`", why:"One bar: 49.5 to 50.5." },
          { id:"l6", t:"`45 <= X <= 55`", why:"45 through 55: from 44.5 to 55.5." },
          { id:"l7", t:"`45 < X < 55`", why:"46 through 54: from 45.5 to 54.5.",
            hints:["Which whole numbers satisfy `45 < X < 55`?", "46 through 54.", "`45.5 < Y < 54.5`."] },
          { id:"l8", t:"‘at least 30’", why:"30 or more: the bar at 30 starts at 29.5." }],
        right:[
          { id:"r1", t:"`Y > 59.5`" }, { id:"r2", t:"`Y > 60.5`" }, { id:"r3", t:"`Y < 40.5`" }, { id:"r4", t:"`Y < 39.5`" },
          { id:"r5", t:"`49.5 < Y < 50.5`" }, { id:"r6", t:"`44.5 < Y < 55.5`" }, { id:"r7", t:"`45.5 < Y < 54.5`" }, { id:"r8", t:"`Y > 29.5`" }],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l1|r2":"≥ 60 includes the bar at 60, which starts at 59.5.",
          "l2|r1":"> 60 starts at 61, whose bar starts at 60.5.",
          "l4|r3":"< 40 stops at 39.",
          "l7|r6":"Strict inequalities leave out 45 and 55." },
        wrongDefault:"Find the first and last whole numbers included, then go half a unit outward." },
      { id:"approx", type:"numeric", title:"Approximate it", summary:"Approximate it", goal:[1, 2, 3, 4, 6],
        instruction:"Use the normal approximation with the continuity correction and the `z`-table. Give probabilities to 4 decimal places. Items marked ★ are non-routine; items 5 and 6 go beyond the Final Check.",
        items:[
          { id:"n1", goal:4, prompt:"`n = 100`, `p = 0.5`. Approximate `P(X >= 60)`.", answer:0.0287, tol:0.0002, display:"0.0287",
            why:"`μ = 50`, `σ = 5`; `X >= 60` → `Y > 59.5`: `z = 1.90`, `1 - 0.9713 = 0.0287`.",
            wrong:[{ match:0.0228, fb:M2 + " Use 59.5." }],
            hints:["`μ = 50`, `σ = √25 = 5`.", "`X >= 60` becomes `Y > 59.5`.", "`z = (59.5 - 50) ÷ 5 = 1.90`: `1 - 0.9713 = 0.0287`."] },
          { id:"n2", goal:3, prompt:"`n = 100`, `p = 0.5`. Approximate `P(X < 45)`.", answer:0.1357, tol:0.0002, display:"0.1357",
            why:"`X < 45` stops at 44: `Y < 44.5`, `z = -1.10`, area 0.1357.",
            wrong:[{ match:0.1841, fb:"`X < 45` stops at 44: use 44.5." }],
            hints:["Which whole numbers are included?", "44 and below: the boundary is 44.5.", "`z = (44.5 - 50) ÷ 5 = -1.10`: 0.1357."] },
          { id:"n3", goal:2, star:true, prompt:"`n = 625`, `p = 0.2`. Approximate `P(X <= 110)`.", answer:0.0735, tol:0.0002, display:"0.0735",
            why:"`μ = 125`, `σ = √100 = 10`; `Y < 110.5`: `z = -1.45`, area 0.0735.",
            wrong:[{ match:0.0668, fb:M2 }, { match:0.4404, fb:"`σ = √100 = 10`." }, { match:0.4443, fb:"`σ = √100 = 10`." }],
            hints:["`μ = 625 × 0.2 = 125`; `npq = 100`.", "`σ = √100 = 10`; the boundary is 110.5.", "`z = (110.5 - 125) ÷ 10 = -1.45`: 0.0735."] },
          { id:"n4", goal:3, star:true, prompt:"`n = 400`, `p = 0.5`. Approximate `P(X = 200)`.", answer:0.0398, tol:0.0002, display:"0.0398",
            why:"One bar, 199.5 to 200.5: `z = ±0.05`, `0.5199 - 0.4801 = 0.0398` (the exact value is 0.0399).",
            wrong:[{ match:0, fb:"Use 199.5 to 200.5: `z = ±0.05`." }],
            hints:["One bar: 199.5 to 200.5.", "`z = ±0.05`.", "`0.5199 - 0.4801 = 0.0398` (the exact value is 0.0399)."] },
          { id:"n5", goal:6, star:true, prompt:"A guesser answers 100 true/false questions. What is the lowest passing score that a pure guesser reaches at most 2.5% of the time (using the approximation)?", answer:61, tol:0.0002, display:"61",
            why:"`P(X >= 61)`: `z = (60.5 - 50) ÷ 5 = 2.10`, area 0.0179 ≤ 0.025. A pass mark of 60 gives 0.0287.",
            wrong:[{ match:60, fb:"`z = (59.5 - 50) ÷ 5 = 1.90` gives 0.0287 > 0.025." }],
            hints:["`μ = 50`, `σ = 5`; you need `P(X >= k) <= 0.025`.", "`(k - 0.5 - 50) ÷ 5 >= 1.96`, so `k >= 60.3`.", "`k = 61`: `z = 2.10` gives 0.0179."] },
          { id:"n6", goal:1, star:true, prompt:"For `n = 60`, which values of `p` allow the approximation: 0.05, 0.1, 0.2, 0.5, 0.9, 0.95?", answer:[0.1, 0.2, 0.5, 0.9], tol:1e-6, display:"0.1, 0.2, 0.5, 0.9",
            label:"Every value that works, separated by commas:",
            why:"`np` and `nq`: 0.1 gives 6 and 54; 0.2 gives 12 and 48; 0.5 gives 30 and 30; 0.9 gives 54 and 6. For 0.05, `np = 3`; for 0.95, `nq = 3`.",
            wrong:[{ missing:0.9, fb:"Include 0.9: `nq = 6 > 5` and `np = 54`." },
              { match:[0.05, 0.1, 0.2, 0.5, 0.9], fb:"0.05 fails: `np = 3`." },
              { match:[0.05, 0.1, 0.2, 0.5], fb:"0.05 fails: `np = 3`. And 0.9 works: `nq = 6 > 5` and `np = 54`." },
              { match:[0.1, 0.2, 0.5, 0.9, 0.95], fb:"0.95 fails: `nq = 60 × 0.05 = 3`." }],
            hints:["Check `np > 5` and `nq > 5` for each value.", "For 0.05, `np = 3`; for 0.95, `nq = 3`.", "0.1, 0.2, 0.5 and 0.9 work."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Desmond", goal:[2, 3, 5],
        instruction:"Desmond made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"`n = 400`, `p = 0.2`. Approximate `P(X <= 72)`.",
            steps:["`np = 80 > 5` and `nq = 320 > 5`, so the approximation is allowed.", "`μ = 80` and `σ = npq = 64`.", "`z = (72.5 - 80) ÷ 64 ≈ -0.12`, so `P ≈ 0.4522`."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 uses the correction properly, but with the wrong `σ`."],
            fixes:[
              { t:"`σ = √64 = 8`, so `z = (72.5 - 80) ÷ 8 ≈ -0.94` and `P ≈ 0.1736`.", ok:true, why:M1 },
              { t:"`σ = 80`.", why:"That’s the mean." },
              { t:"`σ = 0.2 × 0.8 = 0.16`.", why:"Multiply by `n` too, then take the root." },
              { t:"Step 2 is correct.", why:M1 }],
            hints:["Is 64 the variance or the SD?", "The variance.", "`σ = 8`."] },
          { id:"e2", goal:3, task:"`n = 100`, `p = 0.5`. Approximate `P(X >= 56)`.",
            steps:["`μ = 50` and `σ = 5`.", "With the correction, `X >= 56` becomes `Y > 56.5`.", "`z = 1.30`, so `P ≈ 1 - 0.9032 = 0.0968`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows the wrong boundary."],
            fixes:[
              { t:"`X >= 56` includes the bar at 56, so use `Y > 55.5`: `z = 1.10` and `P ≈ 0.1357`.", ok:true, why:"`X >= 56` includes the bar at 56, which starts at 55.5." },
              { t:"Use `Y > 56`: `z = 1.20`.", why:M2 },
              { t:"Use `Y < 55.5`.", why:"The direction stays ‘greater than’." },
              { t:"Step 2 is correct.", why:"`X >= 56` <strong>includes</strong> the bar at 56, which starts at 55.5." }],
            hints:["Is 56 included?", "Yes; its bar starts at 55.5.", "`z = 1.10`: 0.1357."] },
          { id:"e3", goal:5, task:"`n = 40`, `p = 0.05`. Approximate `P(X >= 4)`.",
            steps:["`n = 40` is a fairly large sample, so the normal approximation works.", "`μ = 2` and `σ = √{1.9} ≈ 1.38`.", "`z = (3.5 - 2) ÷ 1.38 ≈ 1.09`, so `P ≈ 0.1379`."],
            answer:0,
            stepFb:["", "The arithmetic is right; the decision to approximate is the problem.", "This follows step 1’s choice."],
            fixes:[
              { t:"Check the conditions first: `np = 2 < 5`, so don’t use the normal approximation; use the exact binomial (the tool gives 0.1381).", ok:true, why:"Even when it comes out close, an unchecked approximation is a lucky guess." },
              { t:"Use `n = 400` instead.", why:"You can’t change the data." },
              { t:"Skip the continuity correction.", why:"That makes it worse." },
              { t:"Step 1 is correct.", why:M4 }],
            hints:["What do the conditions say?", "`np = 40 × 0.05 = 2`.", "2 < 5: use the exact binomial."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the Overlay: how well the curve fits for `p = 0.5`, or how badly it fits when `np` is small?" },
      { id:"j2", q:"In your own words, why does the continuity correction add or subtract 0.5?" },
      { id:"j3", q:"Explain to a friend how to turn ‘`X > 60`’ into a normal area." },
      { id:"j4", q:"Which step do you most often forget: checking the conditions, the square root or the correction? How will you remember it?" }
    ]
  },
  final:{
    intro:"This shows what you’ve learned, so there are no hints here. Answer all 10 questions and say how sure you are. Then submit to see your results. Each question is labelled with its achievement chart category. The `z`-table below is available throughout.",
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which binomial setting allows the normal approximation (`np > 5` and `nq > 5`)?", options:[
          { t:"`n = 50`, `p = 0.2`", ok:true, why:"`np = 10`, `nq = 40`." },
          { t:"`n = 20`, `p = 0.1`", why:"`np = 2`." },
          { t:"`n = 1000`, `p = 0.002`", why:"`np = 2` despite the large `n`." },
          { t:"`n = 8`, `p = 0.5`", why:"`np = 4`." }] },
        b:{ prompt:"Which setting allows the approximation?", options:[
          { t:"`n = 40`, `p = 0.25`", ok:true, why:"`np = 10`, `nq = 30`." },
          { t:"`n = 30`, `p = 0.1`", why:"`np = 3`." },
          { t:"`n = 500`, `p = 0.008`", why:"`np = 4`. A large `n` alone isn’t enough: check `np` and `nq`." },
          { t:"`n = 9`, `p = 0.5`", why:"`np = 4.5`." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Approximate `B(400, 0.2)` with a normal distribution. What are its mean and standard deviation?", options:[
          { t:"`μ = 80`, `σ = 8`", ok:true, why:"`√{400 × 0.2 × 0.8} = √64`." },
          { t:"`μ = 80`, `σ = 64`", why:M1 },
          { t:"`μ = 200`, `σ = 10`", why:"That’s for `p = 0.5`. " + M7 },
          { t:"`μ = 80`, `σ = 0.4`", why:"That is `√{pq}` without `n`." }] },
        b:{ prompt:"Approximate `B(900, 0.1)`. Mean and standard deviation?", options:[
          { t:"`μ = 90`, `σ = 9`", ok:true, why:"`√{900 × 0.1 × 0.9} = √81`." },
          { t:"`μ = 90`, `σ = 81`", why:"81 is the variance, `npq`. `σ = √81 = 9`." },
          { t:"`μ = 450`, `σ = 15`", why:"`μ = np = 900 × 0.1 = 90`; `n ÷ 2` only works when `p = 0.5`." },
          { t:"`μ = 90`, `σ = 0.3`", why:"Include `n`." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"With the continuity correction, `P(X >= 30)` becomes…", options:[
          { t:"`P(Y > 29.5)`", ok:true, why:"`X >= 30` includes the bar at 30, which starts at 29.5." },
          { t:"`P(Y > 30.5)`", why:"`X >= 30` <strong>includes</strong> the bar at 30, which starts at 29.5." },
          { t:"`P(Y > 30)`", why:"Each whole number is a bar of width 1. Use 29.5 as the boundary." },
          { t:"`P(Y < 29.5)`", why:"The direction stays ‘greater than’." }] },
        b:{ prompt:"With the continuity correction, `P(X < 30)` becomes…", options:[
          { t:"`P(Y < 29.5)`", ok:true, why:"`X < 30` stops at 29." },
          { t:"`P(Y < 30.5)`", why:"‘Fewer than 30’ stops at 29: the boundary is 29.5." },
          { t:"`P(Y < 30)`", why:"Each whole number is a bar of width 1. Use 29.5 as the boundary." },
          { t:"`P(Y > 29.5)`", why:"The direction stays ‘less than’." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"`n = 100`, `p = 0.5`. Approximate `P(X >= 60)`.", options:[
          { t:"0.0287", ok:true, why:"`z = (59.5 - 50) ÷ 5 = 1.90`." },
          { t:"0.0228", why:"No correction: `z = 2.00`." },
          { t:"0.0179", why:"60.5 gives `z = 2.10`. " + M3 },
          { t:"0.9713", why:"That’s the left area." }] },
        b:{ prompt:"`n = 100`, `p = 0.5`. Approximate `P(X <= 45)`.", options:[
          { t:"0.1841", ok:true, why:"`z = (45.5 - 50) ÷ 5 = -0.90`." },
          { t:"0.1587", why:"No correction: `z = -1.00`." },
          { t:"0.1357", why:"44.5 leaves out the bar at 45." },
          { t:"0.8159", why:"That’s the right area." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"`n = 100`, `p = 0.5`. Approximate `P(45 <= X <= 55)`.", options:[
          { t:"0.7286", ok:true, why:"44.5 to 55.5: `z = ±1.10`." },
          { t:"0.6826", why:"No correction. " + M2 },
          { t:"0.6318", why:"45.5 to 54.5 leaves out 45 and 55." },
          { t:"1.7286", why:"Subtract the left areas." }] },
        b:{ prompt:"`n = 100`, `p = 0.5`. Approximate `P(45 < X < 55)`.", options:[
          { t:"0.6318", ok:true, why:"46 to 54: 45.5 to 54.5, `z = ±0.90`." },
          { t:"0.7286", why:"That includes 45 and 55." },
          { t:"0.6826", why:"No correction. " + M2 },
          { t:"0.5160", why:"46.5 to 53.5 leaves out 46 and 54." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"For which situation is the normal approximation <strong>least</strong> trustworthy?", options:[
          { t:"`n = 30`, `p = 0.05`", ok:true, why:"`np = 1.5`: strongly skewed." },
          { t:"`n = 30`, `p = 0.5`", why:"`np = nq = 15`." },
          { t:"`n = 200`, `p = 0.3`", why:"`np = 60`." },
          { t:"`n = 100`, `p = 0.9`", why:"`nq = 10 > 5`." }] },
        b:{ prompt:"For which situation is it least trustworthy?", options:[
          { t:"`n = 1000`, `p = 0.003`", ok:true, why:"`np = 3`: a large `n` doesn’t save it." },
          { t:"`n = 50`, `p = 0.5`", why:"`np = 25`." },
          { t:"`n = 80`, `p = 0.25`", why:"`np = 20`." },
          { t:"`n = 60`, `p = 0.85`", why:"`nq = 9 > 5`." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of why the continuity correction is needed?", options:[
          { t:"“A binomial puts its probability on whole numbers, like bars of width 1. To match a bar, the normal area must run from `k - 0.5` to `k + 0.5`.”", ok:true, why:"Each bar has width 1, centred on its whole number." },
          { t:"“It makes the normal curve symmetric.”", why:"The curve is already symmetric." },
          { t:"“It’s needed only when `n` is small.”", why:"It’s always used." },
          { t:"“The normal curve overestimates every probability.”", why:"The correction fixes boundaries, not a constant bias." }] },
        b:{ prompt:"Which is the best explanation of why `P(X = 50)` can’t be approximated by `P(Y = 50)`?", options:[
          { t:"“For a continuous variable `P(Y = 50) = 0`; the bar for 50 corresponds to the area from 49.5 to 50.5.”", ok:true, why:"A line has no area; the bar does." },
          { t:"“The curve is undefined at 50.”", why:"It’s defined everywhere." },
          { t:"“50 is the mean, which has no probability.”", why:"Every single value has 0 probability under a curve, not just the mean." },
          { t:"“Use 50.5 to 51.5 instead.”", why:"That’s the bar for 51." }] } },
      { id:"c2", cat:"C", goal:[1, 2],
        a:{ prompt:"Which is a complete, correct justification for approximating `B(400, 0.2)` by `N(80, 8^2)`?", options:[
          { t:"“`np = 80 > 5` and `nq = 320 > 5`; `μ = np = 80` and `σ = √{npq} = √64 = 8`.”", ok:true, why:"Both conditions, then both parameters." },
          { t:"“`n` is large, so any binomial is normal.”", why:M4 },
          { t:"“`μ = 80` and `σ = npq = 64`.”", why:M1 },
          { t:"“`p < 0.5`, so it’s normal.”", why:"The value of `p` alone doesn’t decide." }] },
        b:{ prompt:"Which justifies approximating `B(900, 0.1)` by `N(90, 9^2)`?", options:[
          { t:"“`np = 90 > 5` and `nq = 810 > 5`; `μ = 90` and `σ = √81 = 9`.”", ok:true, why:"Both conditions, then both parameters." },
          { t:"“`n = 900` is large enough on its own.”", why:"A large `n` alone isn’t enough. Check `np` and `nq`." },
          { t:"“`μ = 90` and `σ = 81`.”", why:"81 is the variance, `npq`. `σ = √81 = 9`." },
          { t:"“`p` is small, so it’s normal.”", why:"Small `p` makes things worse, not better." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A fair coin is tossed 400 times. Approximate the probability of <strong>at least 220</strong> heads.", options:[
          { t:"0.0256", ok:true, why:"`z = (219.5 - 200) ÷ 10 = 1.95`." },
          { t:"0.0228", why:"No correction." },
          { t:"0.0202", why:"220.5 leaves out the bar at 220." },
          { t:"0.9744", why:"That’s the left area." }] },
        b:{ prompt:"A fair coin is tossed 400 times. Approximate the probability of <strong>at most 185</strong> heads.", options:[
          { t:"0.0735", ok:true, why:"`z = (185.5 - 200) ÷ 10 = -1.45`." },
          { t:"0.0668", why:"No correction: `z = -1.50`." },
          { t:"0.0606", why:"184.5 leaves out 185." },
          { t:"0.9265", why:"That’s the right area." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"20% of a factory’s parts need rework. In a batch of 625, approximate the probability that <strong>more than 140</strong> need rework.", options:[
          { t:"0.0606", ok:true, why:"`μ = 125`, `σ = 10`; `X >= 141` → `Y > 140.5`: `z = 1.55`." },
          { t:"0.0668", why:"No correction: `z = 1.50`." },
          { t:"0.0735", why:"139.5 includes 140, which isn’t ‘more than 140’." },
          { t:"0.9394", why:"That’s the left area." }] },
        b:{ prompt:"Same factory, a batch of 625. Approximate the probability that <strong>fewer than 110</strong> need rework.", options:[
          { t:"0.0606", ok:true, why:"`X <= 109` → `Y < 109.5`: `z = -1.55`." },
          { t:"0.0668", why:"No correction: `z = -1.50`. " + M2 },
          { t:"0.0735", why:"110.5 includes 110." },
          { t:"0.9394", why:"That’s the right area." }] } }
    ]
  },
  task:{
    title:"Catch a biased coin", summary:"Catch a biased coin",
    statement:"<p>Design a test for whether a coin is biased toward heads. You choose how many times to toss it (`n`) and how many heads (`k` or more) will make you call it biased. Use the normal approximation with the continuity correction. Can you find all the answers?</p>" +
      '<ol class="na-conds"><li>The normal approximation is allowed for a fair coin.</li><li>A fair coin is wrongly called biased at most 5% of the time.</li><li>The test is sensitive: the cutoff is at most 55% of the tosses.</li></ol>',
    checks:["Approximation allowed", "Fair coin flagged ≤ 5% of the time", "Cutoff ≤ 55% of tosses"],
    tips:["`n = 10` gives `np = 5`, which isn’t more than 5.", "Raise `k` until the shaded tail is 5% or less; remember the boundary is `k - 0.5`.", "A cutoff above 55% would miss coins that are only slightly biased. More tosses let the cutoff sit closer to 50%."],
    explainPrompt:"Explain how you used `μ`, `σ` and the continuity correction to check line 2, and why more tosses made the test possible.",
    vocab:"Use the words normal approximation, continuity correction, `z`-score and sample size.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"With 100 tosses, a fair coin would need a cutoff of 59 to stay under 5%, which is above 55%. Only 400 tosses gives a test that is both safe and sensitive.",
    afterAt:4
  },
  cards:[
    ["When to approximate", "`np > 5` and `nq > 5`."],
    ["Mean of the normal model", "`μ = np`."],
    ["SD of the normal model", "`σ = √{npq}`; `npq` is the variance."],
    ["Continuity correction", "Each whole number `k` becomes the interval `k - 0.5` to `k + 0.5`."],
    ["`X >= k`", "`Y > k - 0.5`"],
    ["`X > k`", "`Y > k + 0.5`"],
    ["`X <= k`", "`Y < k + 0.5`"],
    ["`X < k`", "`Y < k - 0.5`"],
    ["`X = k`", "`k - 0.5 < Y < k + 0.5`"],
    ["When it fails", "Small `np` or `nq`: the histogram is skewed, however large `n` is."],
    ["Clean numbers", "`n = 400`, `p = 0.2` → `σ = 8`; `n = 625`, `p = 0.2` → `σ = 10`."]
  ]
};
