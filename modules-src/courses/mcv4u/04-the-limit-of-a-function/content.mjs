// MCV4U 04 The Limit of a Function. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/04-the-limit-of-a-function.md
// LIM("x → 2") typesets lim with the approach underneath (course plan §2); the hidden brackets keep plain text readable.
const LIM = (s, cls) => '<span class="lm-lim' + (cls ? " " + cls : "") + '"><span class="lm-lt">lim</span><span class="vh"> (</span><span class="lm-lu">`' + s + '`</span><span class="vh">)</span></span>';
const M1W = (a) => "The limit is where the graph is heading as `x` approaches `" + a + "`. The dot at `x = " + a + "` doesn’t affect it.";
const ONE = "One entry. Check both sides and look at where the values are heading, not at one entry.";

export default {
  id:"04-the-limit-of-a-function",
  kind:"topic",
  title:"The limit of a function",
  topic:"The Limit of a Function",
  readyTopic:"limits",
  hero:{
    eq:LIM("x → a", "lm-hero") + " `f(x) =` <span class=\"lm-L\">`L`</span>",
    eqLabel:"The limit of f of x, as x approaches a, equals L.",
    eqSize:"md",
    headline:"Where is the graph heading?",
    text:"A <strong>limit</strong> describes the value `f(x)` gets close to as `x` approaches `a`, from the <strong>left</strong> (`x → a^{-}`) and from the <strong>right</strong> (`x → a^{+}`). What happens exactly at `a` doesn’t matter: there could be a hole, or a point somewhere else. The limit <strong>exists</strong> only when both sides head to the same number.",
    fig:{ aria:"The line y = x + 1 with an open circle at (2, 3) and a filled dot at (2, 5). Two probes slide along the line toward x = 2, one from each side, and their dashed guides to the y-axis close in on 3: the limit as x approaches 2 is 3. The filled dot at (2, 5) flashes: f(2) = 5, and the limit doesn’t care." }
  },
  goals:[
    "I can read and write limit notation, including one-sided limits.",
    "I can find one-sided and two-sided limits from a graph.",
    "I can estimate a limit from a table of values approaching from both sides.",
    "I can explain when a limit exists, and why it can differ from `f(a)` or exist where `f(a)` is undefined.",
    "I can find limits in the long run, for sequences and for functions approaching horizontal asymptotes."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Reading graphs", goal:2, prompt:"A graph has an open circle at (2, 3) and a filled dot at (2, 5). What is `f(2)`?",
          options:[
            { t:"5", ok:true, why:"The filled dot is the value." },
            { t:"3", why:"An open circle means that point is missing." },
            { t:"Undefined", why:"There is a filled dot at `x = 2`." },
            { t:"4", why:"A function has one value at each `x`: the filled dot." }],
          hints:["Which dot is filled?", "(2, 5).", "`f(2) = 5`."] },
        { id:"w2", skill:"Reading graphs", goal:4, prompt:"A graph has an open circle at (1, 4) and nothing else at `x = 1`. What is `f(1)`?",
          options:[
            { t:"Undefined", ok:true, why:"No filled dot at `x = 1`." },
            { t:"4", why:"Open means not included." },
            { t:"0", why:"Undefined isn’t 0." },
            { t:"1", why:"That’s the `x`-value." }],
          hints:["Is any point at `x = 1` included?", "Only an open circle.", "Undefined."] },
        { id:"w3", skill:"Holes and asymptotes", goal:4, prompt:"Where does `y = {x^2 - 9}/{x - 3}` have a hole?",
          options:[
            { t:"(3, 6)", ok:true, why:"`{(x - 3)(x + 3)}/{x - 3} = x + 3` for `x ≠ 3`." },
            { t:"(3, 0)", why:"The hole’s height comes from `x + 3` at `x = 3`." },
            { t:"(−3, 0)", why:"That’s an `x`-intercept." },
            { t:"It has a vertical asymptote `x = 3` instead.", why:"The factor cancels, so it’s a hole." }],
          hints:["Factor the numerator.", "The `(x - 3)` cancels.", "`y = x + 3` with a hole at (3, 6)."] },
        { id:"w4", skill:"Holes and asymptotes", goal:4, prompt:"What is the vertical asymptote of `y = {1}/{x + 2}`?",
          options:[
            { t:"`x = -2`", ok:true, why:"The denominator is 0 there." },
            { t:"`x = 2`", why:"`x + 2 = 0` at `x = -2`." },
            { t:"`y = 0`", why:"That’s the horizontal asymptote." },
            { t:"`x = 1/2`", why:"Set the denominator to 0." }],
          hints:["Where is the denominator 0?", "`x + 2 = 0`.", "`x = -2`."] },
        { id:"w5", skill:"Sequences and evaluation", goal:5, prompt:"What is the next term of 1/2, 2/3, 3/4, 4/5, …?",
          options:[
            { t:"5/6", ok:true, why:"Numerator `n`, denominator `n + 1`." },
            { t:"4/6", why:"Both parts go up by 1." },
            { t:"6/7", why:"After 4/5 comes 5/6." },
            { t:"5/5", why:"The denominator stays one ahead." }],
          hints:["Look at the numerators, then the denominators.", "`n/(n + 1)`.", "5/6."] },
        { id:"w6", skill:"Sequences and evaluation", goal:3, prompt:"Evaluate `{x^2 - 1}/{x - 1}` at `x = 0.9`.",
          options:[
            { t:"1.9", ok:true, why:"(0.81 − 1)/(−0.1) = 1.9." },
            { t:"−1.9", why:"Negative ÷ negative is positive." },
            { t:"0.19", why:"Dividing by 0.1 multiplies by 10." },
            { t:"19", why:"−0.19/−0.1 = 1.9." }],
          hints:["0.9² = 0.81.", "−0.19 ÷ (−0.1).", "1.9."] }
      ],
      refreshers:{
        "Reading graphs":"A filled dot is the function’s value; an open circle is a missing point. If a vertical line meets only an open circle, the function is undefined there.",
        "Holes and asymptotes":"A factor that cancels from a rational function leaves a hole; a factor left in the denominator gives a vertical asymptote.",
        "Sequences and evaluation":"Find the pattern in the numerator and denominator separately. With decimals, watch the signs: a negative divided by a negative is positive."
      }
    }
  },
  explore:{
    heading:"Approach explorer",
    intro:"Pick a graph. Step a probe toward `x = a` from the left, then from the right, and watch the tables fill. Decide whether the limit exists.",
    predictions:[
      { id:"p1", type:"hole", prompt:"Hole: `f(2)` is undefined. What is " + LIM("x → 2") + " `f(x)`?",
        options:[{ t:"3", ok:true }, { t:"Undefined" }, { t:"0" }, { t:"2" }],
        explain:"Both probes head to 3, and the open circle stays open. The limit looks at `x` near 2, never at 2." },
      { id:"p2", type:"moved", prompt:"Moved point: `f(2) = 5`. What is " + LIM("x → 2") + " `f(x)`?",
        options:[{ t:"3", ok:true }, { t:"5" }, { t:"4" }, { t:"It doesn’t exist" }],
        explain:"The guides meet at 3 while the dot sits at 5. The dot at `x = 2` isn’t part of the approach." },
      { id:"p3", type:"jump", prompt:"Jump (`c = 7`): what is " + LIM("x → 2") + " `f(x)`?",
        options:[{ t:"It doesn’t exist", ok:true }, { t:"3" }, { t:"5" }, { t:"4" }],
        explain:"The left probe heads to 3, the right one to 5. One-sided limits 3 and 5 disagree. 5 is `f(2)`; 4 is their average." },
      { id:"p4", type:"asym", prompt:"Asymptote `f(x) = {1}/{(x - 2)^2}`: as `x → 2` from either side, the values …",
        options:[{ t:"grow without bound, so the limit doesn’t exist", ok:true }, { t:"approach 0" }, { t:"approach 2" }, { t:"approach 1/4" }],
        explain:"The table shows 100, 10 000, 1 000 000 on both sides. There’s no number they settle near." }
    ],
    challenges:[
      { id:"tc1", goal:4, prompt:"<strong>Jump:</strong> set `c` so the two-sided limit at `x = 2` exists.",
        why:"With `c = 5`, the right piece `5 - x` heads to 3, the same number as the left side.",
        hints:["What does the left side head to?", "3. The right side heads to `c - 2`.", "`c - 2 = 3`, so `c = 5`."] },
      { id:"tc2", goal:3, prompt:"Use the table to find " + LIM("x → 1") + " `{x^3 - 1}/{x - 1}`. The table and the answer box are under the explorer.",
        why:"Both columns close in on 3, even though the expression is undefined at 1.",
        hints:["Read both columns.", "Left: 2.71, 2.97, 2.997. Right: 3.31, 3.03, 3.003.", "Both approach 3."] },
      { id:"tc3", goal:4, stretch:true, prompt:"<strong>Two formulas, new pieces:</strong> `f(x) = ax + 1` for `x < 2` and `x^2 - a` for `x ≥ 2`. Set `a` so " + LIM("x → 2") + " `f(x)` exists. (Choose Two formulas, then New pieces.)",
        why:"With `a = 1`, both sides head to 3: `2(1) + 1 = 4 - 1`.",
        hints:["The left side heads to `2a + 1`; the right side to `4 - a`.", "Set them equal.", "`3a = 3`, so `a = 1`."] }
    ]
  },
  part3:{
    slug:"long-run", name:"Long run",
    heading:"Limits in the long run",
    intro:"Limits also describe the long run: what happens as `n → ∞` or `x → ∞`. Watch three sequences settle (or not), see two functions level off toward a horizontal asymptote, then match the notation to the pictures. Then try the quick check.",
    match:{ id:"lr-match", type:"match", shuffle:false, goal:[1, 5], leftTitle:"Statement", rightTitle:"Graph",
      how:"Tap a statement, then tap the graph it describes.",
      left:[
        { id:"s1", t:LIM("x → ∞") + " `f(x) = 2`", why:"The curve levels off toward the dashed line `y = 2` as `x` grows." },
        { id:"s2", t:LIM("n → ∞") + " `t_n = 1`", why:"The dots climb toward 1 and settle there." },
        { id:"s3", t:LIM("x → 3^{+}") + " `f(x)` grows without bound", why:"Just to the right of `x = 3`, the curve shoots upward." },
        { id:"s4", t:"no limit (oscillates)", why:"The dots jump between −1 and 1 forever." }
      ],
      right:[
        { id:"g3", t:"Graph A", sr:"a curve with a vertical asymptote x = 3; below it on the left, shooting up on the right" },
        { id:"g1", t:"Graph B", sr:"a curve that rises and levels off toward the dashed line y = 2 as x increases" },
        { id:"g4", t:"Graph C", sr:"dots for n = 1 to 10 that alternate between −1 and 1" },
        { id:"g2", t:"Graph D", sr:"dots for n = 1 to 10 that climb toward the dashed line at 1" }
      ],
      answer:{ s1:"g1", s2:"g2", s3:"g3", s4:"g4" },
      wrongDefault:"Read the arrow in the statement first: `x → ∞` and `n → ∞` are about the far right; `x → 3^{+}` is about just to the right of 3." },
    quickCheck:{
      title:"Quick check", summary:"Long run quick check",
      items:[
        { id:"q1", goal:5, prompt:LIM("n → ∞") + " `{3n - 1}/{n}`?",
          choices:[
            { t:"3", ok:true, fb:"Right. `{3n - 1}/{n} = 3 - {1}/{n}`, and `{1}/{n} → 0`." },
            { t:"−1", fb:"`{3n - 1}/{n} = 3 - {1}/{n}`, and `{1}/{n} → 0`." },
            { t:"grows without bound", fb:"`{3n - 1}/{n} = 3 - {1}/{n}`, and `{1}/{n} → 0`." },
            { t:"0", fb:"`{3n - 1}/{n} = 3 - {1}/{n}`, and `{1}/{n} → 0`." }] },
        { id:"q2", goal:5, prompt:"Does 1, −1, 1, −1, … have a limit?",
          choices:[
            { t:"No: it keeps alternating", ok:true, fb:"Right. The terms never settle near one number." },
            { t:"Yes: 0", fb:"The terms never settle near one number." },
            { t:"Yes: 1", fb:"The terms never settle near one number." },
            { t:"Yes: −1", fb:"The terms never settle near one number." }] },
        { id:"q3", goal:5, prompt:LIM("x → ∞") + " `{4x - 2}/{2x + 5}`?",
          choices:[
            { t:"2", ok:true, fb:"Right. For huge `x`, the leading terms dominate: `{4x}/{2x} = 2`." },
            { t:"−2/5", fb:"For huge `x`, the leading terms dominate: `{4x}/{2x} = 2`." },
            { t:"4", fb:"For huge `x`, the leading terms dominate: `{4x}/{2x} = 2`." },
            { t:"0", fb:"For huge `x`, the leading terms dominate: `{4x}/{2x} = 2`." }] },
        { id:"q4", goal:5, prompt:"`g(x) = {2x^2 + x}/{x^2 + 1}` crosses `y = 2` at `x = 2`. Is `y = 2` still its horizontal asymptote?",
          choices:[
            { t:"Yes: an asymptote describes the long run", ok:true, fb:"Right. Crossing at a finite `x` is allowed." },
            { t:"No: asymptotes are never crossed", fb:"Crossing at a finite `x` is allowed." },
            { t:"No: the limit is 1", fb:"Crossing at a finite `x` is allowed." },
            { t:"Only for `x < 2`", fb:"Crossing at a finite `x` is allowed." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"read", type:"custom", title:"Read the limits", summary:"Read the limits", goal:[1, 2, 4],
        instruction:"Read each limit or value from the graph. Tap a chip to answer.",
        how:"Tap an item number to move between items. Every item uses the same chips.",
        chips:[{ id:"m1", t:"−1" }, { id:"p1", t:"1" }, { id:"p2", t:"2" }, { id:"p3", t:"3" }, { id:"up", t:"grows without bound" }, { id:"dn", t:"decreases without bound" }, { id:"dne", t:"does not exist" }],
        wrongDefault:"Follow the graph toward `x = a` from the side asked. Try another chip.",
        items:[
          { id:"L1", goal:[2, 4], ask:LIM("x → 0") + " `f(x)`", answer:"p1", why:"Both sides head to the open circle at (0, 1); the filled dot doesn’t matter.",
            wrong:{ m1:"That’s `f(0)`, the filled dot." },
            hints:["Ignore the dot at `x = 0`.", "Where are both sides heading?", "1."] },
          { id:"L2", goal:2, ask:"`f(0)`", answer:"m1", why:"The value is the filled dot, (0, −1).",
            wrong:{ p1:"The value is the filled dot, −1." } },
          { id:"L3", goal:[1, 2], ask:LIM("x → 2^{-}") + " `f(x)`", answer:"p3", why:"From the left, the curve heads to the open circle at (2, 3).",
            wrong:{ p1:"`2^{-}` means from the left." } },
          { id:"L4", goal:[1, 2], ask:LIM("x → 2^{+}") + " `f(x)`", answer:"p1", why:"From the right, the curve starts at the filled dot (2, 1).",
            wrong:{ p3:"`2^{-}` means from the left; `2^{+}` means from the right." } },
          { id:"L5", goal:[2, 4], ask:LIM("x → 2") + " `f(x)`", answer:"dne", why:"The left side heads to 3 and the right side to 1: they disagree.",
            wrong:{ p3:"The sides disagree.", p1:"The sides disagree." } },
          { id:"L6", goal:[1, 2], ask:LIM("x → -2^{+}") + " `f(x)`", answer:"up", why:"Just to the right of the asymptote `x = -2`, the curve shoots upward." },
          { id:"L7", goal:[2, 4], ask:LIM("x → -2") + " `f(x)`", answer:"dne", why:"From the left it decreases without bound and from the right it grows without bound: no limit.",
            wrong:{ up:"From the left it decreases without bound, so the sides disagree." },
            hints:["Check each side of `x = -2` separately.", "Left: decreases without bound. Right: grows without bound.", "They don’t match: no limit."] },
          { id:"L8", goal:2, ask:LIM("x → 4") + " `f(x)`", answer:"p2", why:"The curve passes smoothly through (4, 2), so both sides head to 2." }
        ] },
      { id:"tables", type:"custom", title:"Tables and reasoning", summary:"Tables and reasoning", star:true, goal:[3, 4, 5],
        instruction:"The tool computes each table. Use the tables and your reasoning to find each answer, then press Check.",
        how:"Type a number such as 4, 0.5 or 1/2. If you think a limit doesn’t exist or is undefined, type that in words.",
        items:[
          { id:"T1", goal:[3, 4], prompt:LIM("x → 2") + " `{x^2 - 4}/{x - 2}`", table:{ fn:"t1", a:2 }, answer:4,
            why:"Both sides head to 4: `{(x - 2)(x + 2)}/{x - 2} = x + 2` for `x ≠ 2`.",
            wrong:[{ word:"undef", fb:"Both sides head to 4." }] },
          { id:"T2", goal:3, prompt:LIM("x → 1") + " `{√x - 1}/{x - 1}`", table:{ fn:"t2", a:1, steps:[0.1, 0.01] }, answer:0.5,
            why:"The left column falls toward 0.5 and the right column rises toward 0.5.",
            wrong:[{ match:[0.5132, 0.5013, 0.4881, 0.4988], fb:"That’s one entry." }] },
          { id:"T3", goal:3, star:true, prompt:LIM("x → 0") + " `{2^x - 1}/{x}`, to 3 decimal places", table:{ fn:"t3", a:0 }, answer:0.693, dp:3,
            why:"The closest values from both sides, 0.6929 and 0.6934, both round to 0.693.",
            wrong:[{ match:[0.7], fb:"Use the closest values from both sides." }] },
          { id:"T4", goal:5, star:true, prompt:LIM("n → ∞") + " `(1 + {1}/{n})^n`, to 2 decimal places", table:{ fn:"t4", inf:true }, answer:2.72, dp:2,
            why:"Reading down the table, the values settle near 2.718…, which is 2.72 to 2 decimal places.",
            wrong:[{ match:[1], fb:"`1 + {1}/{n} → 1`, but the power `n` grows too; trust the table." }],
            hints:["Read down the table.", "2.7169, 2.7181, …", "About 2.72. (You’ll meet this number, `e`, in module 25.)"] },
          { id:"T5", goal:4, star:true, prompt:"`f(x) = x^2 - k` for `x < 3` and `kx + 1` for `x > 3`. Find `k` so " + LIM("x → 3") + " `f(x)` exists.", boxes:[{ id:"k", label:"`k =`" }], answer:{ k:2 },
            why:"The left side heads to `9 - k` and the right side to `3k + 1`. `9 - k = 3k + 1` gives `4k = 8`, so `k = 2` (both sides head to 7).",
            wrong:[{ k:4, fb:"`9 - k = 3k + 1` gives `4k = 8`." }] },
          { id:"T6", goal:4, star:true, prompt:"`f(x) = {x^2 + ax - 6}/{x - 2}`. Find `a` so " + LIM("x → 2") + " `f(x)` exists, then find the limit.", boxes:[{ id:"a", label:"`a =`" }, { id:"L", label:"limit =" }], answer:{ a:1, L:5 },
            why:"`a = 1` makes the numerator 0 at `x = 2`; then `{(x + 3)(x - 2)}/{x - 2} = x + 3` for `x ≠ 2`, so the limit is 5.",
            wrong:[{ a:3, fb:"For a finite limit the numerator must be 0 at `x = 2`: `4 + 2a - 6 = 0`." }],
            hints:["If the numerator isn’t 0 at `x = 2`, the values grow without bound.", "`4 + 2a - 6 = 0` gives `a = 1`.", "`x^2 + x - 6 = (x + 3)(x - 2)`, so the limit is 2 + 3 = 5."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Deepa", how:"", goal:[3, 4],
        instruction:"Deepa made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Find " + LIM("x → 3") + " `f(x)`, where `f(x) = 2x + 1` for `x < 3`, `f(3) = 10`, and `f(x) = x^2 - 2` for `x > 3`.",
            steps:["From the left: 2(3) + 1 = 7.", "From the right: 9 − 2 = 7.", "`f(3) = 10`, which doesn’t match 7.", "So the limit does not exist."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "Step 3 is a true statement.", ""],
            fixes:[
              { t:"Both one-sided limits are 7, so the limit is 7; `f(3) = 10` doesn’t affect it.", ok:true, why:"The limit ignores the value at `x = 3`." },
              { t:"The limit is 10.", why:"The limit ignores the value at `x = 3`." },
              { t:"The limit is 8.5.", why:"The limit ignores the value at `x = 3`." },
              { t:"Step 4 is correct.", why:"The limit ignores the value at `x = 3`." }],
            hints:["What decides whether a limit exists?", "Only the two one-sided limits.", "Both are 7."] },
          { id:"e2", goal:3, task:"Find " + LIM("x → 1") + " `{x^2 - 1}/{x - 1}` from a table.",
            steps:["`x = 0.9` gives 1.9; `x = 0.99` gives 1.99.", "`x = 1.1` gives 2.1; `x = 1.01` gives 2.01.", "At `x = 1` the expression is 0/0.", "So the limit does not exist."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is true.", ""],
            fixes:[
              { t:"Both sides approach 2, so the limit is 2, even though the expression is undefined at 1.", ok:true, why:"Undefined at `a` doesn’t stop a limit." },
              { t:"The limit is 0.", why:"Undefined at `a` doesn’t stop a limit." },
              { t:"The limit is 1.99.", why:"Undefined at `a` doesn’t stop a limit." },
              { t:"Step 4 is correct.", why:"Undefined at `a` doesn’t stop a limit." }],
            hints:["Where are both columns heading?", "1.9, 1.99 and 2.1, 2.01.", "2."] },
          { id:"e3", goal:4, task:"Find " + LIM("x → 2") + " `{1}/{x - 2}`.",
            steps:["`x = 2.1` gives 10; `x = 2.01` gives 100.", "`x = 1.9` gives −10; `x = 1.99` gives −100.", "From the right the values grow without bound; from the left they decrease without bound.", "The two sides cancel, so the limit is 0."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"The sides are unbounded in opposite directions, so the limit does not exist.", ok:true, why:"Values near `x = 2` are huge, not near 0." },
              { t:"The limit is 2.", why:"Values near `x = 2` are huge, not near 0." },
              { t:"The limit grows without bound.", why:"Values near `x = 2` are huge, not near 0." },
              { t:"Step 4 is correct.", why:"Values near `x = 2` are huge, not near 0." }],
            hints:["Are the values near 0?", "No: they’re ±100 and beyond.", "No limit."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the approach explorer: a limit existing at a hole, or not existing at a jump?" },
      { id:"j2", q:"In your own words, what’s the difference between " + LIM("x → a") + " `f(x)` and `f(a)`?" },
      { id:"j3", q:"Explain to a friend how to estimate a limit from a table of values." },
      { id:"j4", q:"Which case still confuses you (moved point, jump, asymptote, long run)? What will you try?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What does " + LIM("x → 4^{-}") + " `f(x) = 7` mean?", options:[
          { t:"As `x` approaches 4 through values less than 4, `f(x)` approaches 7.", ok:true, why:"The minus sign means from values less than 4, on the left." },
          { t:"As `x` approaches 4 through values greater than 4, `f(x)` approaches 7.", why:"The minus sign means from values <strong>less</strong> than 4, on the left." },
          { t:"`f(4) = 7`.", why:M1W("4") },
          { t:"`f(x)` is less than 7 near `x = 4`.", why:"The minus sign is about `x`, not `f(x)`." }] },
        b:{ prompt:"What does " + LIM("x → -1^{+}") + " `g(x) = 2` mean?", options:[
          { t:"As `x` approaches −1 through values greater than −1, `g(x)` approaches 2.", ok:true, why:"The plus sign means from values greater than −1, on the right." },
          { t:"As `x` approaches −1 through values less than −1, `g(x)` approaches 2.", why:"The plus sign means from values <strong>greater</strong> than −1, on the right." },
          { t:"`g(-1) = 2`.", why:M1W("-1") },
          { t:"`g(x)` is greater than 2 near `x = -1`.", why:"The plus sign is about `x`, not `g(x)`." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"A graph is one unbroken curve except at `x = 3`, where it has an open circle at (3, 5) and a filled dot at (3, 1). What is " + LIM("x → 3") + " `f(x)`?", options:[
          { t:"5", ok:true, why:"Both sides head to the open circle’s height." },
          { t:"1", why:"That’s `f(3)`. " + M1W("3") },
          { t:"3", why:"That’s the `x`-value." },
          { t:"It doesn’t exist", why:"The sides agree, so it exists." }] },
        b:{ prompt:"Open circle at (−2, 4), filled dot at (−2, 0). What is " + LIM("x → -2") + " `f(x)`?", options:[
          { t:"4", ok:true, why:"Both sides head to the open circle’s height." },
          { t:"0", why:"That’s `f(-2)`. " + M1W("-2") },
          { t:"−2", why:"That’s the `x`-value." },
          { t:"It doesn’t exist", why:"The sides agree, so it exists." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"`x`: 1.9, 1.99, 1.999 give `f(x)`: 4.61, 4.9601, 4.996. `x`: 2.1, 2.01, 2.001 give 5.41, 5.0401, 5.004. What is the best estimate of " + LIM("x → 2") + " `f(x)`?", options:[
          { t:"5", ok:true, why:"Both sides close in on 5." },
          { t:"4.996", why:ONE },
          { t:"5.004", why:ONE },
          { t:"It doesn’t exist, since no entry equals 5.", why:"A limit doesn’t need to be reached." }] },
        b:{ prompt:"`x`: 2.9, 2.99, 2.999 give 6.41, 6.9401, 6.994. `x`: 3.1, 3.01, 3.001 give 7.61, 7.0601, 7.006. Best estimate of " + LIM("x → 3") + " `f(x)`?", options:[
          { t:"7", ok:true, why:"Both sides close in on 7." },
          { t:"6.994", why:ONE },
          { t:"7.006", why:ONE },
          { t:"It doesn’t exist", why:"A limit doesn’t need to be reached: both sides close in on 7." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"`f(x) = {x^2 + 2x - 15}/{x - 3}`. What is " + LIM("x → 3") + " `f(x)`, and is `f(3)` defined?", options:[
          { t:"The limit is 8; `f(3)` is undefined.", ok:true, why:"`{(x + 5)(x - 3)}/{x - 3} = x + 5` for `x ≠ 3`." },
          { t:"Both are undefined.", why:"A hole doesn’t stop the approach. Both sides head to 8, so the limit is 8, even though `f(3)` is undefined." },
          { t:"The limit is 8 and `f(3) = 8`.", why:"`f(3)` is 0/0: undefined." },
          { t:"The limit is 0 and `f(3) = 0`.", why:"0/0 isn’t 0." }] },
        b:{ prompt:"`f(x) = {x^2 - x - 12}/{x - 4}`. What is " + LIM("x → 4") + " `f(x)`, and is `f(4)` defined?", options:[
          { t:"The limit is 7; `f(4)` is undefined.", ok:true, why:"`{(x + 3)(x - 4)}/{x - 4} = x + 3` for `x ≠ 4`." },
          { t:"Both are undefined.", why:"A hole doesn’t stop the approach. Both sides head to 7, so the limit is 7, even though `f(4)` is undefined." },
          { t:"The limit is 7 and `f(4) = 7`.", why:"`f(4)` is 0/0: undefined." },
          { t:"The limit is 0 and `f(4) = 0`.", why:"0/0 isn’t 0." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"`f(x) = x + 2` for `x < 1` and `f(x) = 5 - 2x` for `x ≥ 1`. Which is true?", options:[
          { t:LIM("x → 1") + " `f(x) = 3`", ok:true, why:"Left: 3. Right: 5 − 2 = 3." },
          { t:"The limit doesn’t exist because the formula changes at 1.", why:"Changing formulas is fine if the sides agree." },
          { t:"Left 3, right 5, so there’s no limit.", why:"The right side is 5 − 2(1) = 3." },
          { t:"The limit is 3, but `f(1) = 5`.", why:"`f(1) = 5 - 2 = 3`." }] },
        b:{ prompt:"`f(x) = x^2` for `x < 2` and `f(x) = 8 - 2x` for `x ≥ 2`. Which is true?", options:[
          { t:LIM("x → 2") + " `f(x) = 4`", ok:true, why:"Left: 4. Right: 8 − 4 = 4." },
          { t:"The limit doesn’t exist because the formula changes at 2.", why:"Changing formulas is fine if the sides agree." },
          { t:"Left 4, right 8, so there’s no limit.", why:"The right side is 8 − 2(2) = 4." },
          { t:"The limit is 4, but `f(2) = 8`.", why:"`f(2) = 8 - 4 = 4`." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"`t_n = {5n - 2}/{n + 1}`. What is " + LIM("n → ∞") + " `t_n`?", options:[
          { t:"5", ok:true, why:"For huge `n`, `{5n - 2}/{n + 1} ≈ {5n}/{n}`." },
          { t:"−2", why:"That’s the ratio of the constants." },
          { t:"0", why:"The terms approach 5, not 0." },
          { t:"It grows without bound.", why:"Top and bottom grow at the same rate." }] },
        b:{ prompt:"`t_n = {3n + 7}/{2n}`. What is " + LIM("n → ∞") + " `t_n`?", options:[
          { t:"3/2", ok:true, why:"For huge `n`, `{3n + 7}/{2n} ≈ {3n}/{2n} = {3}/{2}`." },
          { t:"5", why:"That’s the first term, `t_1 = 10/2`." },
          { t:"0", why:"The terms approach 3/2, not 0." },
          { t:"It grows without bound.", why:"Top and bottom grow at the same rate." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"`f` has a jump at `x = 2`: the left-hand limit is 1 and the right-hand limit is 4. Which is the best explanation of why " + LIM("x → 2") + " `f(x)` doesn’t exist?", options:[
          { t:"“A two-sided limit exists only when both one-sided limits exist and are equal. Here they are 1 and 4.”", ok:true, why:"The left side heads to 1 and the right side to 4. They disagree, so the two-sided limit doesn’t exist." },
          { t:"“Because `f(2)` is undefined.”", why:"The value at 2 doesn’t matter." },
          { t:"“Because the limit would be the average, 2.5, which isn’t on the graph.”", why:"A limit is never an average of the two sides. The left side heads to 1 and the right side to 4: they disagree, so the two-sided limit doesn’t exist." },
          { t:"“Because limits never exist where a formula changes.”", why:"They do when the sides agree." }] },
        b:{ prompt:"Left-hand limit −2, right-hand limit 3 at `x = 5`. Best explanation of why the limit doesn’t exist?", options:[
          { t:"“The one-sided limits, −2 and 3, aren’t equal.”", ok:true, why:"A two-sided limit exists only when both one-sided limits exist and are equal." },
          { t:"“Because `f(5)` is undefined.”", why:"The value at 5 doesn’t matter." },
          { t:"“Because the average, 0.5, isn’t on the graph.”", why:"A limit is never an average of the two sides. The left side heads to −2 and the right side to 3: they disagree, so the two-sided limit doesn’t exist." },
          { t:"“Because limits never exist where a formula changes.”", why:"They do when the sides agree." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which statement correctly describes `y = {1}/{(x - 5)^2}` near `x = 5`?", options:[
          { t:"“As `x → 5` from either side, `y` grows without bound, so " + LIM("x → 5") + " `y` does not exist.”", ok:true, why:"Squaring makes both sides positive, and the values grow without bound, so there’s no number to approach." },
          { t:"“" + LIM("x → 5") + " `y = 0`.”", why:"The values grow without bound, so there’s no number to approach. The limit does not exist." },
          { t:"“" + LIM("x → 5") + " `y = 5`.”", why:"That’s the `x`-value." },
          { t:"“`y` decreases without bound from the left and grows without bound from the right.”", why:"Squaring makes both sides positive." }] },
        b:{ prompt:"Which statement correctly describes `y = -{1}/{(x + 1)^2}` near `x = -1`?", options:[
          { t:"“As `x → -1` from either side, `y` decreases without bound, so the limit doesn’t exist.”", ok:true, why:"Squaring makes both sides positive, so `y` is negative on both sides and decreases without bound: there’s no number to approach." },
          { t:"“" + LIM("x → -1") + " `y = 0`.”", why:"The values decrease without bound, so there’s no number to approach. The limit does not exist." },
          { t:"“" + LIM("x → -1") + " `y = -1`.”", why:"That’s the `x`-value." },
          { t:"“`y` grows without bound from the left and decreases from the right.”", why:"Squaring makes both sides the same sign, so both sides decrease without bound." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A drug’s concentration in the blood is `C(t) = {20t}/{t + 4}` mg/L after `t` hours. What happens in the long run?", options:[
          { t:"It approaches 20 mg/L.", ok:true, why:"For huge `t`, `{20t}/{t + 4} ≈ 20`." },
          { t:"It grows without bound.", why:"Top and bottom grow at the same rate." },
          { t:"It approaches 5 mg/L.", why:"20/4 is a ratio of the wrong numbers." },
          { t:"It approaches 0 mg/L.", why:"The numerator grows too." }] },
        b:{ prompt:"`C(t) = {30t}/{t + 6}` mg/L. What happens in the long run?", options:[
          { t:"It approaches 30 mg/L.", ok:true, why:"For huge `t`, `{30t}/{t + 6} ≈ 30`." },
          { t:"It grows without bound.", why:"Top and bottom grow at the same rate." },
          { t:"It approaches 5 mg/L.", why:"30/6 is a ratio of the wrong numbers." },
          { t:"It approaches 0 mg/L.", why:"The numerator grows too." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"A ball’s average velocity over `[2, 2 + h]` is `15 - 5h` m/s, for `h ≠ 0`. What is its instantaneous velocity at `t = 2`?", options:[
          { t:"15 m/s", ok:true, why:LIM("h → 0") + " `(15 - 5h) = 15`." },
          { t:"10 m/s", why:"That uses `h = 1`, one secant." },
          { t:"Undefined, because `h ≠ 0`.", why:"The limit never needs `h = 0` itself." },
          { t:"0 m/s", why:"`15 - 5h` approaches 15." }] },
        b:{ prompt:"Average velocity over `[3, 3 + h]` is `-10 - 5h` m/s. Instantaneous velocity at `t = 3`?", options:[
          { t:"−10 m/s", ok:true, why:LIM("h → 0") + " `(-10 - 5h) = -10`." },
          { t:"−15 m/s", why:"That uses `h = 1`, one secant." },
          { t:"Undefined, because `h ≠ 0`.", why:"The limit never needs `h = 0` itself." },
          { t:"0 m/s", why:"`-10 - 5h` approaches −10." }] } }
    ]
  },
  task:{
    title:"Build a limit puzzle", summary:"Build a limit puzzle",
    statement:"<p>`f(x) = mx + b` for `x < 2`, `f(2) = 5`, and `f(x) = x^2 + c` for `x > 2`. Choose `m`, `b` and `c` to meet every condition. Can you find all the answers?</p><div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>" + LIM("x → 2") + " `f(x)` exists.</li><li>That limit is strictly between 0 and 3.</li><li>The left piece is decreasing.</li></ol></div><p class=\"tiny muted\">Choose whole numbers from −5 to 5 for `m`, `b` and `c`. The graph shows both pieces with their open circles at `x = 2`, the filled dot at (2, 5), and the readout gives both one-sided limits.</p>",
    checks:["The limit at 2 exists", "`0 <` limit `< 3`", "Left piece decreasing"],
    tips:["The left side heads to `2m + b`; the right side to `4 + c`. Make them equal.",
      "The right side’s limit is `4 + c`, so `c` must be −3 or −2.",
      "A decreasing line has a negative slope."],
    explainPrompt:"Explain why the limit at `x = 2` can be 1 even though `f(2) = 5`.",
    vocab:"Use the words left-hand limit, right-hand limit, exists and value.",
    success:"Your puzzle works!",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Each one has a limit (1 or 2) that differs from `f(2) = 5`: a moved point. `m = -2` with `c = -2` would need `b = 6`, outside the range."
  },
  cards:[
    [LIM("x → a") + " `f(x) = L`", "As `x` gets close to `a` (not equal to `a`), `f(x)` gets close to `L`."],
    ["`x → a^{-}`", "From the left: values less than `a`."],
    ["`x → a^{+}`", "From the right: values greater than `a`."],
    ["When a limit exists", "Both one-sided limits exist and are equal."],
    ["Hole", "The limit can exist even though `f(a)` is undefined."],
    ["Moved point", "The limit can differ from `f(a)`."],
    ["Jump", "The one-sided limits differ, so there’s no limit."],
    ["Vertical asymptote", "The values grow (or decrease) without bound, so there’s no limit."],
    ["Estimating from a table", "Use values from both sides, ever closer to `a`, and see where they head."],
    [LIM("n → ∞") + " `{n}/{n + 1}`", "1."],
    ["Fibonacci ratios", "`F_{n+1}/F_n` approaches `{1 + √5}/{2} ≈ 1.618`."],
    ["Horizontal asymptote", "Describes the long run, " + LIM("x → ∞") + " `f(x)`. The graph may cross it."]
  ]
};
