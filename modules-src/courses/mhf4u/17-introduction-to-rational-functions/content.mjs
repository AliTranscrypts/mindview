// MHF4U 17 Introduction to Rational Functions. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/17-introduction-to-rational-functions.md
const fig = (key, aria, cls) => '<canvas class="plot' + (cls ? " " + cls : "") + '" data-fig="' + key + '" role="img" aria-label="' + aria + '"></canvas>';
// cube root of x with a bar (MV.m only knows √)
const CBX = '<span class="rad"><span class="rs">∛</span><span class="rb"><i>x</i></span></span>';
const CB = '<span class="m">' + CBX + "</span>";
const stack = (n, d) => '<span class="m"><span class="frac"><span class="fn">' + n + '</span><span class="fd">' + d + "</span></span></span>";

// ---------- Practice 1: Rational or not? ----------
const NOTPOLY = (w) => w + " isn’t a polynomial: polynomials only have whole-number powers of `x`. A fraction with `x` in it isn’t automatically rational.";
const sortItems = [
  { id:"s1", t:"`{x + 2}/{x^2 - 9}`", answer:"r", why:"Polynomial over polynomial, and `x^2 - 9 = 0` at `x = ±3`.",
    wrong:{ d:"Check the denominator: it’s 0 at `x = -3` and `x = 3`, so those values are excluded.", n:"It can be written as polynomial ÷ polynomial: `(x + 2)/(x^2 - 9)`. That’s what rational means." },
    hints:["Are the top and bottom both polynomials? Can the denominator be 0?", "`x^2 - 9 = (x - 3)(x + 3)`. Where is that 0?", "It’s polynomial over polynomial, and `x = 3` and `x = -3` make the denominator 0. It goes in <strong>Rational, with restrictions</strong>."] },
  { id:"s2", t:"`x^{-2}`", answer:"r", why:"`x^{-2} = 1/x^2`: polynomial over polynomial, with `x ≠ 0`.",
    wrong:{ d:"`x^{-2} = 1/x^2`, and its denominator `x^2` is 0 at `x = 0`.", n:"It can be written as polynomial ÷ polynomial: `1/x^2`. That’s what rational means." },
    hints:["Rewrite the negative exponent as a fraction.", "`x^{-2} = 1/x^2`. Is that polynomial over polynomial? Is anything excluded?", "`1/x^2` is rational, and `x = 0` makes the denominator 0. It goes in <strong>Rational, with restrictions</strong>."] },
  { id:"s3", t:"`{3}/{x} + x`", answer:"r", why:"Combine it: `(x^2 + 3)/x`. Rational, with `x ≠ 0`.",
    wrong:{ d:"`3/x` needs `x ≠ 0`, even though it’s added to `x`.", n:"It can be written as polynomial ÷ polynomial: `(x^2 + 3)/x`. That’s what rational means." },
    hints:["Can you write it as one fraction?", "`3/x + x = 3/x + x^2/x = (x^2 + 3)/x`. Is that polynomial over polynomial? Is anything excluded?", "`(x^2 + 3)/x` is rational, and `x = 0` makes the denominator 0. It goes in <strong>Rational, with restrictions</strong>."] },
  { id:"s4", t:"`{x}/{x^2 - 2x + 1}`", answer:"r", why:"`x^2 - 2x + 1 = (x - 1)^2`, which is 0 at `x = 1`.",
    wrong:{ d:"Check the denominator: it’s 0 at `x = 1`, so that value is excluded.", n:"It can be written as polynomial ÷ polynomial: `x/(x^2 - 2x + 1)`. That’s what rational means." },
    hints:["Both parts are polynomials. Can the denominator be 0?", "Factor the denominator: `x^2 - 2x + 1 = (x - 1)^2`. Where is that 0?", "`(x - 1)^2 = 0` at `x = 1`, so 1 is excluded. It goes in <strong>Rational, with restrictions</strong>."] },
  { id:"s5", t:"`{x^2 - 1}/{4}`", answer:"d", why:"Dividing by 4 just multiplies by 1/4: this is the polynomial `x^2/4 - 1/4`. Every polynomial is rational (it’s itself over 1), with domain ℝ.",
    wrong:{ r:"Can this denominator ever be 0? The denominator is the number 4. It’s never 0.", n:"A polynomial divided by a number is still a polynomial, and every polynomial is rational." },
    hints:["What is the denominator here? Can it be 0?", "Dividing by 4 is the same as multiplying by 1/4, so this is the polynomial `x^2/4 - 1/4`. Is a polynomial rational?", "Every polynomial is rational (it’s itself over 1), and the denominator 4 is never 0. It goes in <strong>Rational, domain ℝ</strong>."] },
  { id:"s6", t:"`{1}/{x^2 + 4}`", answer:"d", why:"`x^2 + 4` is at least 4, so it’s never 0.",
    wrong:{ r:"Can this denominator ever be 0? `x^2 + 4` is at least 4, so it’s never 0.", n:"Both parts are polynomials, so it’s rational." },
    hints:["Both parts are polynomials. Can the denominator be 0?", "`x^2` is never negative. How small can `x^2 + 4` get?", "`x^2 + 4` is at least 4, so it’s never 0. It goes in <strong>Rational, domain ℝ</strong>."] },
  { id:"s7", t:"`{x + 1}/{x^2 + 2x + 5}`", answer:"d", why:"`x^2 + 2x + 5 = (x + 1)^2 + 4`, at least 4. Its discriminant is 4 − 20 = −16, so it has no real zeros.",
    wrong:{ r:"Can this denominator ever be 0? `x^2 + 2x + 5 = (x + 1)^2 + 4`, which is at least 4, so it’s never 0.", n:"Both parts are polynomials, so it’s rational." },
    hints:["Both parts are polynomials. Can the denominator be 0?", "Complete the square: `x^2 + 2x + 5 = (x + 1)^2 + 4`. How small can that get?", "`(x + 1)^2 + 4` is at least 4, so it’s never 0 (the discriminant 4 − 20 is negative). It goes in <strong>Rational, domain ℝ</strong>."] },
  { id:"s8", t:"`{√x}/{x + 1}`", answer:"n", why:"`√x = x` to the power 1/2. Polynomials only have whole-number powers, so the numerator isn’t a polynomial.",
    wrong:{ r:NOTPOLY("`√x`"), d:NOTPOLY("`√x`") },
    hints:["Is the numerator a polynomial?", "`√x` is `x` to the power 1/2. Is 1/2 a whole-number power?", "`√x` isn’t a polynomial, so this isn’t polynomial over polynomial. It goes in <strong>Not rational</strong>."] },
  { id:"s9", t:"`{2^x}/{x}`", answer:"n", why:"`2^x` has `x` in the exponent: it’s exponential, not a polynomial.",
    wrong:{ r:NOTPOLY("`2^x`"), d:NOTPOLY("`2^x`") },
    hints:["Is the numerator a polynomial?", "In `2^x`, where is the `x`: in the base or in the exponent?", "`2^x` has `x` in the exponent, so it’s exponential, not a polynomial. It goes in <strong>Not rational</strong>."] },
  { id:"s10", t:stack("5", CBX + " − 1"), answer:"n", why:CB + " is `x` to the power 1/3, not a whole-number power, so the denominator isn’t a polynomial.",
    wrong:{ r:NOTPOLY(CB), d:NOTPOLY(CB) },
    hints:["Is the denominator a polynomial?", CB + " is `x` to the power 1/3. Is 1/3 a whole-number power?", CB + " isn’t a polynomial, so this isn’t polynomial over polynomial. It goes in <strong>Not rational</strong>."] }
];

// ---------- Practice 2: Match the graph ----------
const GRAPHS = [
  ["A", "One unbroken U with its bottom at (0, 0), rising toward y = 2 on both sides but staying below it."],
  ["B", "Three pieces, split by vertical asymptotes at x = −1 and x = 1. The middle piece falls from top left to bottom right through (0, 0). The outer pieces flatten toward y = 0: the left one from below, the right one from above."],
  ["C", "Two branches, both above the x-axis, rising steeply on both sides of x = 0 and flattening toward y = 0 far out."],
  ["D", "One unbroken hump with its top at (0, 2), flattening toward y = 0 on both sides."],
  ["E", "Vertical asymptotes at x = −1 and x = 1. The middle piece is an upside-down U with its top at (0, 0). The outer pieces flatten toward y = 2 from above."],
  ["F", "One branch in quadrant 2 and one in quadrant 4. Vertical asymptote x = 0, horizontal asymptote y = 0."]
];
const matchWrong = {
  "l1|rF":"Near 0, `1/x^2` is positive on <strong>both</strong> sides, because `x^2 > 0`. Graph F goes down on one side.",
  "l2|rC":"`-1/x` changes sign at 0: for `x > 0` it’s negative, for `x < 0` positive. Graph C is positive on both sides.",
  "l3|rE":"Same vertical asymptotes. But `2x/(x^2 - 1)` has a lower-degree top, so its horizontal asymptote is `y = 0`, not `y = 2`.",
  "l4|rB":"Same vertical asymptotes. But `2x^2/(x^2 - 1)` has equal degrees, so it levels off at `2x^2/x^2 = 2`, not 0.",
  "l5|rA":"At `x = 0`, `2/(x^2 + 1) = 2`, so its top is (0, 2). Graph A passes through (0, 0) and levels off at `y = 2`.",
  "l6|rD":"At `x = 0`, `2x^2/(x^2 + 1) = 0`. Graph D has its top at (0, 2)."
};
const VA_PM1 = "`x^2 - 1 = 0` at `x = ±1`, so this graph must have vertical asymptotes there.";
const NO_VA = "`x^2 + 1` is never 0, so this graph has no vertical asymptote.";
const ONLY0 = "This denominator is 0 only at `x = 0`.";
["l3", "l4"].forEach(l => ["rA", "rD", "rC", "rF"].forEach(r => { if (!matchWrong[l + "|" + r]) matchWrong[l + "|" + r] = VA_PM1; }));
["l5", "l6"].forEach(l => ["rB", "rE", "rC", "rF"].forEach(r => { if (!matchWrong[l + "|" + r]) matchWrong[l + "|" + r] = NO_VA; }));
["l1", "l2"].forEach(l => ["rB", "rE"].forEach(r => { matchWrong[l + "|" + r] = ONLY0; }));

export default {
  id:"17-introduction-to-rational-functions",
  kind:"topic",
  title:"Introduction to rational functions",
  topic:"Introduction to Rational Functions",
  readyTopic:"rational functions",
  hero:{
    eq:'`y = {1}/{x}`<span class="hero-sub">the simplest rational function</span>', eqLabel:"y equals 1 over x: the simplest rational function",
    headline:"Near zero it explodes. Far away it fades.",
    text:"A <strong>rational function</strong> is one polynomial divided by another, like `y = 1/x` or `y = (x + 1)/(x^2 - 4)`. Wherever the denominator is 0 the function is undefined: that’s a <strong>restriction</strong> on its <strong>domain</strong>. Near a restriction, the graph usually shoots up or down beside a <strong>vertical asymptote</strong>. Far from the origin, it often levels off along a <strong>horizontal asymptote</strong>.",
    fig:{ aria:"Animation: the graph of y = 1/x, traced on both sides of x = 0, with its vertical asymptote x = 0 and horizontal asymptote y = 0" }
  },
  goals:[
    "I can decide whether a function is rational, and explain why using the words polynomial, numerator and denominator.",
    "I can find the restrictions on a rational function and write its domain in set notation and interval notation.",
    "I can describe how `y = 1/x` behaves near `x = 0` and far from the origin, using arrow notation, and state its domain, range and asymptotes.",
    "I can find the vertical asymptotes of a rational function from the zeros of its denominator, and say which way the graph goes on each side.",
    "I can find the horizontal asymptote of a rational function by comparing degrees and leading coefficients, and explain why the leading terms decide it.",
    "I can use restrictions and asymptotes to match a rational function to its graph, check whether a graph crosses its horizontal asymptote, and build an equation with given features."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Reciprocals", goal:3,
          prompt:"What is the value of `1/(-0.02)`?",
          options:[
            { t:"−50", ok:true, why:"0.02 = 2/100 = 1/50, so its reciprocal is 50. The sign stays negative: −50. Check: −50 × (−0.02) = 1." },
            { t:"−500", why:"0.02 is 2 hundredths, or 2/100. So `1/(-0.02) = -100/2 = -50`. −500 would be `1/(-0.002)`." },
            { t:"−0.02", why:"Dividing by a number smaller than 1 makes the result <strong>bigger</strong>. Fifty lots of 0.02 make 1, so the answer has size 50." },
            { t:"50", why:"A reciprocal keeps the sign: 1 divided by a negative number is negative." }],
          hints:["Write 0.02 as a fraction.", "0.02 = 2/100 = 1/50. What’s the reciprocal of 1/50?", "The reciprocal of 1/50 is 50, and the sign stays negative: `1/(-0.02) = -50`."] },
        { id:"w2", skill:"Reciprocals", goal:3,
          prompt:"For which value of `x` is `1/x = 0.04`?",
          options:[
            { t:"25", ok:true, why:"1/25 = 4/100 = 0.04." },
            { t:"0.04", why:"If `x = 0.04`, then `1/x = 25`, not 0.04." },
            { t:"2.5", why:"1/2.5 = 0.4. You need 0.04, which is ten times smaller, so `x` must be ten times bigger." },
            { t:"250", why:"1/250 = 0.004, ten times too small." }],
          hints:["If `1/x = 0.04`, then `x = 1/0.04`.", "0.04 = 4/100 = 1/25.", "`x = 1/(1/25) = 25`. Check: 1/25 = 0.04."] },
        { id:"w3", skill:"Factoring and zeros", goal:2,
          prompt:"Factor `x^2 - x - 12`.",
          options:[
            { t:"`(x - 4)(x + 3)`", ok:true, why:"−4 × 3 = −12 and −4 + 3 = −1, matching the constant and the middle coefficient." },
            { t:"`(x + 4)(x - 3)`", why:"Expand it: `x^2 + x - 12`. The middle term should be `-x`, so the signs are the wrong way round." },
            { t:"`(x - 6)(x + 2)`", why:"−6 × 2 = −12, but −6 + 2 = −4, not −1." },
            { t:"`(x - 12)(x + 1)`", why:"−12 + 1 = −11, not −1." }],
          hints:["Find two numbers that multiply to −12 and add to −1.", "List the factor pairs of −12. Which pair adds to −1?", "−4 and 3: (−4)(3) = −12 and −4 + 3 = −1. So `x^2 - x - 12 = (x - 4)(x + 3)`."] },
        { id:"w4", skill:"Factoring and zeros", goal:2,
          prompt:"Solve `x^3 - 4x = 0`.",
          options:[
            { t:"`x = 0`, `x = 2` and `x = -2`", ok:true, why:"`x^3 - 4x = x(x - 2)(x + 2)`, and each factor gives one solution." },
            { t:"`x = 2` and `x = -2`", why:"Dividing by `x` throws away the solution `x = 0`. Factor instead: `x(x^2 - 4) = 0`." },
            { t:"`x = 0` and `x = 2`", why:"`x^2 = 4` has two solutions, 2 and −2." },
            { t:"`x = 0` and `x = 4`", why:"`x^2 = 4` means `x = ±2`, not 4. Check: `4^3 - 4(4) = 48`, not 0." }],
          hints:["Start with the common factor.", "`x^3 - 4x = x(x^2 - 4)`, and `x^2 - 4` is a difference of squares.", "`x(x - 2)(x + 2) = 0`, so `x = 0`, `x = 2` or `x = -2`."] },
        { id:"w5", skill:"Interval notation", goal:2,
          prompt:"Which is `{x ∈ ℝ | x ≠ -1}` written in interval notation?",
          options:[
            { t:"`(-∞, -1) ∪ (-1, ∞)`", ok:true, why:"Every real number except −1. The round brackets leave −1 out of both pieces, and ∪ joins them." },
            { t:"`(-∞, -1] ∪ [-1, ∞)`", why:"A square bracket <strong>includes</strong> the endpoint, which puts −1 back in. Use round brackets." },
            { t:"`(-∞, -1) ∩ (-1, ∞)`", why:"∩ means “in both pieces”. No number is in both, so this is empty. Join pieces with ∪." },
            { t:"`(-1, ∞)`", why:"This leaves out every number less than −1, like −5. Those are in the set too." }],
          hints:["Which numbers are allowed? Everything except −1.", "That’s two pieces: the numbers less than −1 and the numbers greater than −1. Is −1 itself included?", "`(-∞, -1) ∪ (-1, ∞)`: round brackets at −1, joined with ∪."] },
        { id:"w6", skill:"Leading terms", goal:5,
          prompt:"`f(x) = 5 + 40x^2 - 2x^3`. As `x → ∞`, what happens to `f(x)`?",
          options:[
            { t:"`f(x) → -∞`", ok:true, why:"The term with the highest power, `-2x^3`, wins for large `x`, even though it’s written last. `f(100) = -1 599 995`, and it only gets more negative." },
            { t:"`f(x) → -2`", why:"−2 is the leading coefficient. It tells you which way the ends go, not a value `f` approaches: `f(100)` is about −1 600 000." },
            { t:"`f(x) → 5`", why:"5 is the constant term, `f(0)`. The term that decides the ends has the highest power, wherever it’s written." },
            { t:"`f(x) → ∞`", why:"`40x^2` has the biggest coefficient, but `x^3` outgrows `x^2`: at `x = 100`, `2x^3 = 2 000 000` while `40x^2 = 400 000`." }],
          hints:["For very large `x`, which term has the highest power?", "The leading term is `-2x^3`, even though it’s written last. Is its coefficient positive or negative?", "A cubic leading term with a negative coefficient: as `x → ∞`, `f(x) → -∞`."] }
      ],
      refreshers:{
        "Reciprocals":"The reciprocal of a number `n` is `1/n`. Small numbers have big reciprocals and big numbers have small ones: 1/0.001 = 1000 and 1/1000 = 0.001. The sign never changes: `1/(-0.02) = -50`. And 0 has no reciprocal: 1/0 is undefined, not 0.",
        "Factoring and zeros":"To find where an expression is 0, factor it completely, then set each factor to 0. Example: `x^3 - 4x = x(x - 2)(x + 2) = 0` gives `x = 0`, 2 or −2. Don’t divide by `x`: you’d lose `x = 0`. A sum like `x^2 + 9` is never 0, because `x^2` is never negative.",
        "Interval notation":"All real numbers except `a` is `(-∞, a) ∪ (a, ∞)`. Round brackets leave an endpoint out, ∞ always gets a round bracket, and ∪ joins pieces. Example: `{x ∈ ℝ | x ≠ -1} = (-∞, -1) ∪ (-1, ∞)`.",
        "Leading terms":"For very large |`x`|, the term with the highest power outgrows all the others, so it alone decides how a polynomial behaves far out. In `5 + 40x^2 - 2x^3` that’s `-2x^3`, even though it’s written last, so `f(x) → -∞` as `x → ∞`."
      }
    }
  },
  explore:{
    heading:"Near and far: walk the curve",
    intro:"Walk along the curve, then use the Near ladder to creep up on a restriction and the Far ladder to head out toward infinity. Once you’ve approached from both sides, the asymptote appears on the graph.",
    predictions:[
      { id:"p1", start:{ f:"F1", x:1 },
        prompt:"The walker will move left from `x = 1` toward 0: `x = 0.1`, 0.01, 0.001. What happens to `y`?",
        options:[{ t:"`y` grows without bound: 10, 100, 1000, …", ok:true }, { t:"`y` shrinks toward 0" }, { t:"`y` grows, but levels off at some largest value" }, { t:"`y` reaches a value at `x = 0` and stops there" }],
        explain:"Each step brings `x` ten times closer to 0, and `y = 1/x` gets ten times bigger: 1, 10, 100, 1000. There’s no largest value: for any height you name, a small enough `x` beats it. `x = 0` itself gives 1/0, which is undefined, so the graph never reaches the `y`-axis. (Shrinking toward 0 is what happens far <strong>away</strong>, not near 0.)" },
      { id:"p2", start:{ f:"F1", x:1 },
        prompt:"Now the walker heads right, far away: `x = 10`, 100, 1000, 10 000. What happens to `y`?",
        options:[{ t:"`y` gets closer and closer to 0, but stays positive", ok:true }, { t:"`y` reaches 0 once `x` is big enough" }, { t:"`y` crosses 0 and becomes negative" }, { t:"`y` levels off at 1" }],
        explain:"Ten times farther, ten times smaller. `y` gets as close to 0 as you like, but 1 divided by a positive number is never 0, so `y` stays positive. The line `y = 0` is a <strong>horizontal asymptote</strong>: the graph approaches it as `x → ∞`." },
      { id:"p3", start:{ f:"F2", x:-1, compare:true },
        prompt:"The walker approaches 0 from the left: `x = -0.1`, −0.01, −0.001. What happens to `y = 1/x^2`?",
        options:[{ t:"`y → ∞`: it rises without bound", ok:true }, { t:"`y → -∞`, just like `1/x` on this side" }, { t:"`y` shrinks toward 0" }, { t:"`y` gets closer and closer to −1" }],
        explain:"`x^2` is positive on both sides of 0, so `1/x^2` is positive on both sides: from the left, `y → ∞`, not −∞. It also grows faster. Ten times closer makes `y` a <strong>hundred</strong> times bigger: 1, 100, 10 000, 1 000 000. The faded `1/x` goes down on this side because `x` itself is negative there." },
      { id:"p4", start:{ f:"F3", x:3 },
        prompt:"The walker heads far right: `x = 10`, 100, 1000. What value does `y` approach?",
        options:[{ t:"`y → 2`", ok:true }, { t:"`y → 0`" }, { t:"`y → 1/2`" }, { t:"`y → ∞`" }],
        explain:"For large `x`, the −2 and −4 hardly matter: `2x^2 - 2` is almost `2x^2`, and `x^2 - 4` is almost `x^2`. So `y` is almost `2x^2/x^2 = 2`. When the top and bottom have the <strong>same</strong> degree, the horizontal asymptote is the ratio of the leading coefficients. (`y → 0` is what happens when the bottom’s degree is bigger, as in `1/x`. 1/2 is (−2)/(−4), the ratio of the constant terms, which is `f(0)`: the `y`-intercept, not the asymptote. `y → ∞` would need the top’s degree to be bigger.)" }
    ],
    chalIntro:"Press <strong>Set up this challenge</strong> to load its starting position, use the explorer to meet the goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:3, prompt:"On `y = 1/x`, place the walker where `y = -1000`.",
        start:{ f:"F1", mode:"walk", step:0.1, x:1 },
        why:"`x = 1/y = 1/(-1000) = -0.001`: a tiny negative `x` gives a huge negative `y`.",
        fb:{ pos:"Here `y = 1000`. Right size, wrong side: to the right of 0, `1/x` is positive. Go to the left of 0.",
          ten:"Here `y = -100`. You need `y` ten times bigger, so `x` must be ten times closer to 0.",
          far:"Here `y = -0.001`. That’s far away, where `y` is tiny. To make `y` huge, make `x` tiny.",
          other:"Right now `y` = {y}. Since `y = 1/x`, the `x` you need is `1/y = 1/(-1000)`.",
          fn:"This challenge is on `y = 1/x`. Press <strong>Set up this challenge</strong>, or choose `1/x` in the function menu." },
        hints:["`y = 1/x`, so `x = 1/y`.", "`x = 1/(-1000)`. Is that positive or negative? Big or small?", "`x = -0.001`. Use the Near ladder at `x = 0` from the left, down to distance 0.001, or set the step to 0.001 and walk there."] },
      { id:"tc2", goal:4, prompt:"On `y = (2x^2 - 2)/(x^2 - 4)`, place the walker at a point where `y` is greater than 1000.",
        start:{ f:"F3", mode:"walk", step:0.1, x:3 },
        why:"Just outside each asymptote, `x^2 - 4` is a tiny positive number, so `y` is huge and positive.",
        fb:{ wrongSide:"Right distance, wrong side. Between the asymptotes the graph dives down: here `y ≈ -1498`.",
          close:"`y ≈ 151.6` here. You’re on the right side, but you need to be about ten times closer.",
          restr:"That’s a restriction: the denominator is 0, so there’s no point at all.",
          far:"Far out, `y` settles near 2. Huge values happen near a vertical asymptote.",
          other:"Right now `y` = {y}. Where is this graph’s denominator close to 0?",
          fn:"This challenge is on `y = (2x^2 - 2)/(x^2 - 4)`. Press <strong>Set up this challenge</strong>, or choose it in the function menu." },
        hints:["`y` is huge where the denominator is nearly 0. Where is `x^2 - 4 = 0`?", "At `x = 2` and `x = -2`. On which side of each does the graph shoot <strong>up</strong>? Check the sign of `x^2 - 4` there.", "Outside the asymptotes `x^2 - 4` is positive, so the graph shoots up. Use the Near ladder at `x = 2` from the right, down to distance 0.001: `x = 2.001` gives `y ≈ 1502`."] },
      { id:"tc3", goal:[5, 6], stretch:true,
        prompt:"`y = (x^2 + 2x)/(x^2 + 4)` crosses its own horizontal asymptote exactly once. Place the walker at the `x`-value where it crosses. The curve and every `y`-value are hidden for this challenge, so work it out from the equation.",
        start:{ f:"F4", mode:"walk", step:1, x:-6 },
        why:"The asymptote is `y = 1`, and `x^2 + 2x = x^2 + 4` gives `x = 2`: the graph passes through (2, 1).",
        fb:{ zero:"Here `y = 0`: the graph crosses the `x`-axis. The horizontal asymptote isn’t `y = 0`, because the top and bottom have the same degree.",
          edge:"Far out the graph is close to its asymptote but not on it. The crossing happens at one particular, nearby `x`.",
          hump:"That’s the top of the hump, where `y ≈ 1.207`, above the asymptote. The crossing is where the curve passes through the asymptote’s height.",
          other:"First find the horizontal asymptote, then set the function equal to it and solve.",
          setup:"Press <strong>Set up this challenge</strong> first: it hides the curve and the `y`-values, so the answer comes from the equation." },
        hints:["What’s the horizontal asymptote? Compare the leading terms `x^2` and `x^2`.", "The asymptote is `y = 1`. Solve `(x^2 + 2x)/(x^2 + 4) = 1`.", "Multiply both sides by `x^2 + 4`: `x^2 + 2x = x^2 + 4`, so `2x = 4` and `x = 2`. Put the walker at `x = 2`."] }
    ]
  },
  part3:{
    slug:"equation", name:"Equation",
    heading:"Read the equation: restrictions and asymptotes",
    intro:"For each function, find the restrictions, then the horizontal asymptote. After each answer, the graph shows you what your answer means.",
    algV:"Close to each restriction, the denominator is tiny but the numerator isn’t close to 0, so `y` = (a number not close to 0)/(a tiny number) is huge. At the restriction itself there’s no value at all.",
    algH:"Divide every term by the highest power of `x` in the denominator, then let `x → ∞`. Every term with `x` in its denominator shrinks to 0.",
    crossNote:"The graph crosses its horizontal asymptote here, at `x` = {x}. A horizontal asymptote only describes the ends.",
    m1:"At `x = -1` the <strong>numerator</strong> is 0, so `y = 0` there. That’s an `x`-intercept, not a restriction. Restrictions come from the denominator.",
    noneWrong:"Try `x` = {a}: the denominator is 0 there.",
    teaser:"Module 21 shows this graph follows a slanted line.",
    missedGeneric:"Factor the denominator completely and set every factor to 0.",
    rightLower:"Top’s degree lower: the bottom grows faster, so `y → 0` and the horizontal asymptote is `y = 0`.",
    rightEqual:"Equal degrees: the horizontal asymptote is `y` = (top’s leading coefficient)/(bottom’s leading coefficient).",
    rightHigher:"Top’s degree higher: `y` keeps growing, so there’s no horizontal asymptote.",
    cases:[
      { id:"C1", num:[1, 1], den:[-6, -1, 1], eq:"`{x + 1}/{x^2 - x - 6}`", factored:"`x^2 - x - 6 = (x - 3)(x + 2)`", answer:[-2, 3], numZero:-1, hz:0, cross:-1, crossText:"−1",
        view:{ xmin:-6, xmax:6, ymin:-5, ymax:5 },
        domain:"`{x ∈ ℝ | x ≠ -2, x ≠ 3}`, that is, `(-∞, -2) ∪ (-2, 3) ∪ (3, ∞)`",
        missed:"`x^2 - x - 6 = (x - 3)(x + 2)`. Each factor gives a restriction.",
        slip:{ taps:[-3, 2], fb:"Those are the zeros of `(x - 2)(x + 3) = x^2 + x - 6`. Here the middle term is `-x`." },
        lead:["`x`", "`x^2`"], deg:[1, 2],
        chips:[{ t:"`y = 0`", ok:true, fb:"" }, { t:"`y = 1`", fb:"1/1 is the ratio of the leading coefficients, but the degrees differ: `x` on top, `x^2` below. The bottom grows faster, so `y → 0`." },
          { t:"`y = -1/6`", fb:"That’s 1/(−6), the ratio of the constant terms. It’s `f(0)`, the `y`-intercept." }, { t:"no horizontal asymptote", fb:"The top’s degree is <strong>lower</strong>, so the quotient shrinks toward 0." }],
        alg:"`(1/x + 1/x^2)/(1 - 1/x - 6/x^2) → 0/1 = 0`" },
      { id:"C2", num:[-1, 0, 4], den:[0, 2, 1], eq:"`{4x^2 - 1}/{x^2 + 2x}`", factored:"`x^2 + 2x = x(x + 2)`", answer:[-2, 0], hz:4, cross:-0.125, crossText:"−1/8",
        view:{ xmin:-6, xmax:6, ymin:-10, ymax:14 },
        domain:"`{x ∈ ℝ | x ≠ -2, x ≠ 0}`, that is, `(-∞, -2) ∪ (-2, 0) ∪ (0, ∞)`",
        missed:"`x^2 + 2x = x(x + 2)`. The factor `x` gives the restriction `x ≠ 0`.",
        lead:["`4x^2`", "`x^2`"], deg:[2, 2],
        chips:[{ t:"`y = 0`", fb:"The degrees are equal (2 and 2), so the leading terms `4x^2` and `x^2` decide: `4x^2/x^2 = 4`." }, { t:"`y = 2`", fb:"That compares `4x^2` with `2x`, which isn’t the bottom’s leading term. Compare `4x^2` with `x^2`." },
          { t:"`y = 4`", ok:true, fb:"" }, { t:"no horizontal asymptote", fb:"The degrees are equal, so `y` settles at a number." }],
        alg:"`(4 - 1/x^2)/(1 + 2/x) → 4/1 = 4`" },
      { id:"C3", num:[-3, 6], den:[8, 0, 2], eq:"`{6x - 3}/{2x^2 + 8}`", factored:"`2x^2 + 8 = 2(x^2 + 4)`: never 0", answer:[], hz:0, cross:0.5, crossText:"1/2",
        view:{ xmin:-8, xmax:8, ymin:-1.5, ymax:1.5 },
        domain:"`{x ∈ ℝ}`, that is, `(-∞, ∞)`",
        anyTap:"`2x^2 + 8` is at least 8 for every `x`, because `x^2` is never negative. It’s never 0, so press <strong>No restrictions</strong>.",
        lead:["`6x`", "`2x^2`"], deg:[1, 2],
        chips:[{ t:"`y = 0`", ok:true, fb:"" }, { t:"`y = 3`", fb:"6/2 is the ratio of the leading coefficients, but the degrees differ (1 and 2). The bottom wins: `y → 0`." },
          { t:"`y = -3/8`", fb:"That’s −3/8, the ratio of the constant terms: `f(0)`." }, { t:"no horizontal asymptote", fb:"The top’s degree is lower, so `y → 0`." }],
        alg:"`(6/x - 3/x^2)/(2 + 8/x^2) → 0/2 = 0`" },
      { id:"C4", num:[2, 0, 0, 5], den:[-8, 0, 0, 1], eq:"`{5x^3 + 2}/{x^3 - 8}`", factored:"`x^3 - 8 = (x - 2)(x^2 + 2x + 4)`", answer:[2], hz:5,
        view:{ xmin:-6, xmax:6, ymin:-10, ymax:20 },
        domain:"`{x ∈ ℝ | x ≠ 2}`, that is, `(-∞, 2) ∪ (2, ∞)`",
        cubeFb:"`x^3 - 8 = (x - 2)(x^2 + 2x + 4)`. The quadratic factor has no real zeros (its discriminant is `2^2 - 4(4) = -12`), so `x = 2` is the only restriction.",
        lead:["`5x^3`", "`x^3`"], deg:[3, 3],
        chips:[{ t:"`y = 0`", fb:"Both are degree 3, so the leading terms decide: `5x^3/x^3 = 5`." }, { t:"`y = -1/4`", fb:"That’s 2/(−8), the ratio of the constant terms: `f(0)`." },
          { t:"`y = 5`", ok:true, fb:"" }, { t:"no horizontal asymptote", fb:"Equal degrees give a horizontal asymptote." }],
        alg:"`(5 + 2/x^3)/(1 - 8/x^3) → 5/1 = 5`" },
      { id:"C5", num:[1, 0, 0, 1], den:[-4, 0, 1], eq:"`{x^3 + 1}/{x^2 - 4}`", factored:"`x^2 - 4 = (x - 2)(x + 2)`", answer:[-2, 2], numZero:-1, hz:null,
        view:{ xmin:-8, xmax:8, ymin:-15, ymax:15 },
        domain:"`{x ∈ ℝ | x ≠ -2, x ≠ 2}`, that is, `(-∞, -2) ∪ (-2, 2) ∪ (2, ∞)`",
        missed:"`x^2 - 4 = 0` at `x = 2` <strong>and</strong> `x = -2`.",
        lead:["`x^3`", "`x^2`"], deg:[3, 2],
        chips:[{ t:"`y = 0`", fb:"`y → 0` needs the <strong>bottom’s</strong> degree to be bigger. Here the top’s is (3 vs 2)." }, { t:"`y = 1`", fb:"1/1 is the ratio of the leading coefficients, but the degrees differ: `x^3/x^2 = x`, which keeps growing." },
          { t:"`y = -1/4`", fb:"That’s `f(0)`, the `y`-intercept." }, { t:"no horizontal asymptote", ok:true, fb:"" }],
        alg:"`(x + 1/x^2)/(1 - 4/x^2)`, which behaves like `x`: no horizontal asymptote" }
    ],
    blocks:[{ title:"What the rules say", html:"<p><strong>Restrictions and vertical asymptotes.</strong> Factor the denominator completely. Each real zero `a` is a restriction (`x ≠ a`). If the numerator isn’t also 0 there, the graph has a vertical asymptote `x = a`. (When both are 0 at the same `x`, something different can happen: that’s module 21.)</p><p><strong>Horizontal asymptote.</strong> Compare the degrees of the top and bottom.</p><ul><li>Top lower: `y = 0`.</li><li>Equal: `y` = (top’s leading coefficient)/(bottom’s leading coefficient).</li><li>Top higher: no horizontal asymptote.</li></ul><p>A graph never crosses a vertical asymptote, because that `x` isn’t in the domain. It <strong>can</strong> cross a horizontal asymptote, which only describes the ends.</p>" }],
    quickCheck:{
      title:"Read the equation", summary:"Read the equation quick check",
      items:[
        { id:"q1", goal:4, prompt:"How many vertical asymptotes does `y = 7/(x^2 + 2x - 15)` have?",
          choices:[{ t:"0", fb:"The denominator factors as `(x + 5)(x - 3)`, so it <strong>is</strong> 0 twice." }, { t:"1", fb:"Factor completely: `(x + 5)(x - 3)` has two zeros." },
            { t:"2", ok:true, fb:"Right. `x^2 + 2x - 15 = (x + 5)(x - 3)`, which is 0 at `x = -5` and `x = 3`, and the numerator 7 is never 0." }] },
        { id:"q2", goal:5, prompt:"What is the horizontal asymptote of `y = (3x - 6x^2)/(2x^2 + 5)`?",
          choices:[{ t:"`y = 0`", fb:"The top is degree 2 (its `-6x^2` term), not degree 1." }, { t:"`y = 3/2`", fb:"3 and 2 are the first-written coefficients. Use the highest powers: `-6x^2` and `2x^2`." },
            { t:"`y = -3`", ok:true, fb:"Right. The leading term on top is `-6x^2`, even though it’s written second. Equal degrees: −6/2 = −3." }, { t:"none", fb:"Equal degrees give a horizontal asymptote." }] },
        { id:"q3", goal:2, prompt:"What is the domain of `y = (x + 1)/(x^2 + 9)`?",
          choices:[{ t:"`{x ∈ ℝ}`", ok:true, fb:"Right. `x^2 + 9` is at least 9, so it’s never 0. No restrictions." }, { t:"`{x ∈ ℝ | x ≠ -1}`", fb:"That’s where the <strong>numerator</strong> is 0: an `x`-intercept." },
            { t:"`{x ∈ ℝ | x ≠ -3, x ≠ 3}`", fb:"That’s `x^2 - 9`. `x^2 + 9 = 0` has no real solutions." }] },
        { id:"q4", goal:6, prompt:"Does the graph of `y = (2x^2 + x)/(x^2 + 1)` cross the line `y = 2`?",
          choices:[{ t:"No: a graph can’t cross its asymptote", fb:"Horizontal asymptotes describe the ends only. Solve `2x^2 + x = 2(x^2 + 1)`." }, { t:"Yes, at `x = 2`", ok:true, fb:"Right. `2x^2 + x = 2x^2 + 2` gives `x = 2`, and `f(2) = 10/5 = 2`." },
            { t:"Yes, at `x = 0`", fb:"At `x = 0`, `y = 0`: that’s where it crosses the `x`-axis." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Rational or not?", summary:"Rational or not?", noun:"function", goal:[1, 2],
        instruction:"Sort each function. Is it rational, and if it is, does its domain leave anything out?",
        boxes:[{ id:"r", label:"Rational, with restrictions", sub:"some `x`-values excluded" }, { id:"d", label:"Rational, domain ℝ", sub:"nothing excluded" }, { id:"n", label:"Not rational" }],
        items:sortItems },
      { id:"match", type:"match", title:"Match the graph", summary:"Match the graph", goal:[6, 4, 5], shuffle:false,
        instruction:"Match each equation to its graph.", how:"Tap an equation, then tap its graph.",
        leftTitle:"Equation", rightTitle:"Graph",
        left:[
          { id:"l1", t:"`y = 1/x^2`", why:"`x^2` is positive on both sides of 0, so `1/x^2 → ∞` on both sides, and it fades toward 0 far out.",
            hints:["Where is `x^2` equal to 0? What is the sign of `x^2` on each side of that?", "The only vertical asymptote is `x = 0`, and `x^2` is positive on both sides of it. Which graph with an asymptote at 0 stays above the axis?", "`1/x^2` is positive on both sides of 0 and fades toward 0 far out. That’s Graph C."] },
          { id:"l2", t:"`y = -1/x`", why:"`-1/x` has the opposite sign to `x`: positive on the left (quadrant 2) and negative on the right (quadrant 4).",
            hints:["Where is the denominator 0? What sign does `-1/x` have when `x` is positive?", "The only vertical asymptote is `x = 0`. For `x > 0`, `-1/x` is negative; for `x < 0`, it’s positive.", "Positive on the left, negative on the right: quadrants 2 and 4. That’s Graph F."] },
          { id:"l3", t:"`y = 2x/(x^2 - 1)`", why:"`x^2 - 1 = 0` at `x = ±1`. The top’s degree is lower, so `y → 0` far out, and `f(0) = 0`.",
            hints:["Find the vertical asymptotes first: where is `x^2 - 1 = 0`?", "`x = ±1`, so it’s Graph B or Graph E. Now compare degrees: what happens far out?", "Top degree 1, bottom degree 2: `y → 0` far out. That’s Graph B."] },
          { id:"l4", t:"`y = 2x^2/(x^2 - 1)`", why:"`x^2 - 1 = 0` at `x = ±1`. Equal degrees give `y = 2x^2/x^2 = 2`, and `f(0) = 0` is the top of the middle piece.",
            hints:["Find the vertical asymptotes first: where is `x^2 - 1 = 0`?", "`x = ±1`, so it’s Graph B or Graph E. Now compare degrees: what happens far out?", "Equal degrees: `y → 2x^2/x^2 = 2` far out. That’s Graph E."] },
          { id:"l5", t:"`y = 2/(x^2 + 1)`", why:"`x^2 + 1` is never 0, so there’s no vertical asymptote. `f(0) = 2`, and `y → 0` far out.",
            hints:["Can `x^2 + 1` be 0? What does that tell you about vertical asymptotes?", "It’s never 0, so it’s Graph A or Graph D. Work out `y` at `x = 0`.", "At `x = 0`, `y = 2/1 = 2`, and far out `y → 0`. That’s Graph D."] },
          { id:"l6", t:"`y = 2x^2/(x^2 + 1)`", why:"`x^2 + 1` is never 0, `f(0) = 0`, and equal degrees give `y = 2`. Since `2x^2 < 2(x^2 + 1)`, the graph stays below 2.",
            hints:["Can `x^2 + 1` be 0? What does that tell you about vertical asymptotes?", "It’s never 0, so it’s Graph A or Graph D. Work out `y` at `x = 0`.", "At `x = 0`, `y = 0`, and equal degrees give `y → 2` far out. That’s Graph A."] }
        ],
        right:GRAPHS.map(g => ({ id:"r" + g[0], t:'<span class="mg-name">Graph ' + g[0] + "</span>" + fig("g" + g[0], "Graph " + g[0] + ": " + g[1]) })),
        answer:{ l1:"rC", l2:"rF", l3:"rB", l4:"rE", l5:"rD", l6:"rA" },
        wrong:matchWrong,
        wrongDefault:"Find the vertical asymptotes first: where is the denominator 0? Then compare what happens far out." },
      { id:"backwards", type:"custom", title:"Work backwards: build the function", summary:"Work backwards", star:true, goal:[6, 2, 4, 5],
        instruction:"Fill in the boxes so the function has every feature listed.",
        how:"Type a whole number in each box, then press Check. After each check you’ll see the graph of <strong>your</strong> function.",
        generic:"Your function has {feat}. Compare each feature with the list.",
        items:[
          { id:"b1", goal:[2, 4], num:"[a]", den:"x^2 - [b]", show:["va", "yint"],
            features:"vertical asymptotes `x = -3` and `x = 3`; `y`-intercept −2",
            answer:{ a:18, b:9 }, display:"`y = 18/(x^2 - 9)`",
            why:"`x^2 - 9 = (x - 3)(x + 3)` gives the asymptotes `x = ±3`, and `f(0) = 18/(-9) = -2`.",
            wrong:[{ when:{ b:3 }, fb:"`x^2 - 3 = 0` at `x = ±√3`, not ±3." }, { when:{ b:-9 }, fb:"`x^2 + 9` is never 0: no asymptotes at all." },
              { when:{ a:-18, b:9 }, fb:"Then `f(0) = -18/(-9) = 2`, not −2." }, { when:{ a:-2, b:9 }, fb:"`f(0) = a/(0 - 9) = -a/9`, not `a` itself." }],
            hints:["Which denominator is 0 at exactly `x = ±3`?", "`x^2 - 9`, so `b = 9`. Now `f(0) = a/(-9)`. Set that equal to −2.", "`a/(-9) = -2` gives `a = 18`: `y = 18/(x^2 - 9)`."] },
          { id:"b2", goal:[4, 5], num:"[a]x^2", den:"x^2 + [b]x + [c]", show:["va", "ha"],
            features:"vertical asymptotes `x = 1` and `x = 4`; horizontal asymptote `y = 3`",
            answer:{ a:3, b:-5, c:4 }, display:"`y = 3x^2/(x^2 - 5x + 4)`",
            why:"`(x - 1)(x - 4) = x^2 - 5x + 4` gives the asymptotes `x = 1` and `x = 4`, and equal degrees give `y = 3/1 = 3`.",
            wrong:[{ when:{ b:5, c:4 }, fb:"`(x + 1)(x + 4)` puts the asymptotes at `x = -1` and `x = -4`. The factors are `(x - 1)(x - 4)`." }, { when:{ a:1 }, fb:"Equal degrees, so the asymptote is `y = a/1`. You need `a = 3`." }],
            hints:["Write the denominator in factored form first.", "`(x - 1)(x - 4) = x^2 - 5x + 4`. The degrees are equal, so the horizontal asymptote is `a/1`.", "`a = 3`, `b = -5`, `c = 4`: `y = 3x^2/(x^2 - 5x + 4)`."] },
          { id:"b3", goal:[2, 5], num:"[a]x^2 + [c]", den:"x^2 - 4", show:["ha", "yint"],
            features:"horizontal asymptote `y = -2`; `y`-intercept 1",
            answer:{ a:-2, c:-4 }, display:"`y = (-2x^2 - 4)/(x^2 - 4)`",
            why:"Equal degrees give `y = -2/1 = -2`, and `f(0) = -4/(-4) = 1`.",
            wrong:[{ when:{ c:4 }, fb:"`f(0) = 4/(-4) = -1`: the denominator is negative at `x = 0`." }, { when:{ c:1 }, fb:"`f(0) = c/(-4)`, not `c`." }, { when:{ a:2 }, fb:"The asymptote is `y = a/1`, so `a` must be −2." }],
            hints:["Equal degrees: the horizontal asymptote is `a/1`.", "`a = -2`. At `x = 0`, `y = c/(0 - 4) = -c/4`.", "`-c/4 = 1` gives `c = -4`: `y = (-2x^2 - 4)/(x^2 - 4)`."] },
          { id:"b4", goal:[2, 6], num:"x - [p]", den:"x^2 + [q]", show:["dom", "xint", "yint"],
            features:"domain ℝ; `x`-intercept 3; `y`-intercept −1",
            answer:{ p:3, q:3 }, display:"`y = (x - 3)/(x^2 + 3)`",
            why:"`x^2 + 3` is at least 3, so the domain is ℝ. The numerator is 0 at `x = 3`, and `f(0) = -3/3 = -1`.",
            wrong:[{ when:{ q:-3 }, fb:"Then `x^2 - 3 = 0` at ±√3, so the domain isn’t ℝ, and `f(0) = 1`." }, { when:{ p:-3 }, fb:"The `x`-intercept is where `x - p = 0`, so `p = 3`." }, { when:{ p:3, q:1 }, fb:"`f(0) = -3/1 = -3`, not −1." }],
            hints:["The `x`-intercept is where the numerator is 0.", "`p = 3`. Then `f(0) = -3/q`. For domain ℝ, `q` must be positive.", "`-3/q = -1` gives `q = 3`, which is positive: `y = (x - 3)/(x^2 + 3)`."] },
          { id:"b5", goal:[4, 5, 6], num:"[a]x^2 + [b]x", den:"x^2 + [c]x + [d]", show:["va", "ha", "cross"],
            features:"vertical asymptotes `x = -1` and `x = 2`; horizontal asymptote `y = 2`; the graph crosses its horizontal asymptote at `x = 4`",
            answer:{ a:2, b:-3, c:-1, d:-2 }, display:"`y = (2x^2 - 3x)/(x^2 - x - 2)`",
            why:"`(x + 1)(x - 2)` gives the asymptotes, equal degrees give `y = 2/1 = 2`, and `f(4) = (32 - 12)/10 = 2`, so the graph is on its asymptote at `x = 4`.",
            wrong:[{ when:{ a:2, b:3, c:-1, d:-2 }, fb:"Then `2x^2 + 3x = 2(x^2 - x - 2)` gives `x = -4/5`: your graph crosses at −4/5, not 4." },
              { when:{ a:2, b:-2, c:-1, d:-2 }, fb:"Then the `x`-terms match too, and the graph never crosses `y = 2`." },
              { when:{ a:2, b:-1, c:-1, d:-2 }, fb:"That crosses at `x = -4`." }, { when:{ c:1, d:-2 }, fb:"`(x + 2)(x - 1)` puts the asymptotes at −2 and 1." }],
            hints:["Do the denominator and `a` first, as in B2.", "`(x + 1)(x - 2) = x^2 - x - 2`, and `a = 2`. Now solve `(2x^2 + bx)/(x^2 - x - 2) = 2` at `x = 4`.", "`2x^2 + bx = 2x^2 - 2x - 4` at `x = 4`: `4b = -8 - 4 = -12`, so `b = -3`."] },
          { id:"b6", goal:[4, 6], star:true, stretch:true, num:"[a]x + [c]", den:"x^2 + [b]x + 9", show:["va", "xint", "yint"],
            features:"exactly <strong>one</strong> vertical asymptote, and it’s to the left of the `y`-axis; `x`-intercept 3; `y`-intercept −1",
            answer:{ a:3, b:6, c:-9 }, display:"`y = (3x - 9)/(x^2 + 6x + 9) = (3x - 9)/(x + 3)^2`",
            why:"`(x + 3)^2` is 0 only at `x = -3`, so there’s one vertical asymptote, left of the `y`-axis. `f(3) = 0/36 = 0`, and `f(0) = -9/9 = -1`.",
            wrong:[{ when:{ b:-6 }, fb:"`(x - 3)^2` puts the asymptote at `x = 3`, to the right. And `x = 3` is where your numerator is 0, so the graph would lose its `x`-intercept: it can’t cross the axis at an `x` where it isn’t defined." },
              { when:{ bIn:[-5, 5] }, fb:"`x^2 + bx + 9` has no real zeros when `b^2 < 36`: no asymptote at all." },
              { when:{ bOut:6 }, fb:"Then the denominator has two real zeros, like `(x + 1)(x + 9)`: two asymptotes." },
              { when:{ c:9 }, fb:"`f(0) = 9/9 = 1`, not −1." },
              { when:{ a:-3, c:-9 }, fb:"Then the numerator `-3x - 9` is 0 only at `x = -3`, which is the restriction, so the graph has no `x`-intercept at all. You need `3a - 9 = 0`." }],
            hints:["Exactly one vertical asymptote means the quadratic has exactly one zero. What does that say about its discriminant?", "`b^2 - 36 = 0`, so `b = 6` or `b = -6`. Which puts the zero to the left of 0? Then use `f(0) = c/9`.", "`b = 6` gives `(x + 3)^2`, asymptote `x = -3`. `c/9 = -1` gives `c = -9`. The `x`-intercept 3 needs `3a - 9 = 0`, so `a = 3`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in Explore when the walker got very close to a restriction, or very far away?" },
      { id:"j2", q:"In your own words, explain why a zero of the denominator makes the graph shoot up or down, while very large `x`-values make it level off." },
      { id:"j3", q:"Explain to a friend, step by step, how to find the domain and both kinds of asymptotes of `y = (3x^2 + 1)/(x^2 - 5x + 6)`." },
      { id:"j4", q:"Which is shakiest for you: restrictions, vertical asymptotes, horizontal asymptotes, or the arrow notation? What will you do about it before module 18?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which of these is a rational function?", options:[
          { t:"`y = x^{-2} + 3`", ok:true, why:"It can be written as `(1 + 3x^2)/x^2`: polynomial over polynomial. A negative exponent is just a fraction in disguise." },
          { t:"`y = √x/(x - 4)`", why:"`√x` is `x` to the power 1/2. Polynomials only use whole-number powers, so the numerator isn’t a polynomial." },
          { t:"`y = 2^x/(x - 4)`", why:"`2^x` has `x` in the exponent: it’s exponential, not a polynomial." },
          { t:"`y = (x^2 + 1)/(`" + CB + "` - 4)`", why:CB + " is `x` to the power 1/3, so the denominator isn’t a polynomial." }] },
        b:{ prompt:"Which of these is a rational function?", options:[
          { t:"`y = 3/x + x^2`", ok:true, why:"Combine it: `(3 + x^3)/x`. Polynomial over polynomial." },
          { t:"`y = √{5 - x}/(x^2 + 2)`", why:"`√{5 - x}` isn’t a polynomial." },
          { t:"`y = 3^x/(x^2 + 2)`", why:"`3^x` is exponential, not a polynomial." },
          { t:"`y = (5 - x)/(`" + CB + "` + 2)`", why:CB + " is `x` to the power 1/3, so the denominator isn’t a polynomial." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What is the domain of `f(x) = (x + 3)/(x^2 - 4x - 5)`?", options:[
          { t:"`{x ∈ ℝ | x ≠ -1, x ≠ 5}`", ok:true, why:"`x^2 - 4x - 5 = (x - 5)(x + 1)`, which is 0 at `x = 5` and `x = -1`." },
          { t:"`{x ∈ ℝ | x ≠ -3}`", why:"`x = -3` makes the <strong>numerator</strong> 0, so `f(-3) = 0`. That’s allowed." },
          { t:"`{x ∈ ℝ | x ≠ -5, x ≠ 1}`", why:"`(x - 5) = 0` at `x =` <strong>5</strong>, and `(x + 1) = 0` at `x =` <strong>−1</strong>." },
          { t:"`{x ∈ ℝ | x ≠ -3, x ≠ -1, x ≠ 5}`", why:"−1 and 5 are right, but −3 only makes the numerator 0. `f(-3) = 0` is a real value." }] },
        b:{ prompt:"What is the domain of `f(x) = (x - 2)/(x^2 + x - 12)`?", options:[
          { t:"`{x ∈ ℝ | x ≠ -4, x ≠ 3}`", ok:true, why:"`x^2 + x - 12 = (x + 4)(x - 3)`, which is 0 at `x = -4` and `x = 3`." },
          { t:"`{x ∈ ℝ | x ≠ 2}`", why:"`x = 2` makes the numerator 0, so `f(2) = 0`. That’s allowed." },
          { t:"`{x ∈ ℝ | x ≠ -3, x ≠ 4}`", why:"`(x + 4) = 0` at `x =` <strong>−4</strong>, and `(x - 3) = 0` at `x =` <strong>3</strong>." },
          { t:"`{x ∈ ℝ | x ≠ -4, x ≠ 2, x ≠ 3}`", why:"`x = 2` only makes the numerator 0." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"What is the horizontal asymptote of `y = (6x^2 - 1)/(3x^2 + 2)`?", options:[
          { t:"`y = 2`", ok:true, why:"Equal degrees, so the leading coefficients decide: 6/3 = 2." },
          { t:"`y = -1/2`", why:"−1/2 is the ratio of the constant terms. That’s `f(0)`, the `y`-intercept." },
          { t:"`y = 0`", why:"`y = 0` needs the bottom’s degree to be bigger. Here both are degree 2." },
          { t:"`y = 1/2`", why:"That’s 3/6. The top’s coefficient goes on top: 6/3." }] },
        b:{ prompt:"What is the horizontal asymptote of `y = (2x^2 + 6)/(4x^2 - 3)`?", options:[
          { t:"`y = 1/2`", ok:true, why:"Equal degrees: 2/4 = 1/2." },
          { t:"`y = -2`", why:"6/(−3) = −2 is `f(0)`, the `y`-intercept." },
          { t:"`y = 0`", why:"Both are degree 2, so the asymptote isn’t `y = 0`." },
          { t:"`y = 2`", why:"That’s 4/2. The top’s coefficient goes on top: 2/4." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Which list gives <strong>every</strong> vertical asymptote of `y = (x + 1)/(x^3 - 2x^2 - 9x + 18)`?", options:[
          { t:"`x = -3`, `x = 2` and `x = 3`", ok:true, why:"`x^2(x - 2) - 9(x - 2) = (x - 2)(x - 3)(x + 3)`. The numerator `x + 1` isn’t 0 at any of them." },
          { t:"`x = 2` only", why:"Grouping gives `(x - 2)(x^2 - 9)`, and `x^2 - 9` has zeros too." },
          { t:"`x = 2` and `x = 3`", why:"`x^2 - 9 = 0` gives `x = 3` <strong>and</strong> `x = -3`." },
          { t:"`x = -3`, `x = -1`, `x = 2` and `x = 3`", why:"At `x = -1` the numerator is 0, so `y = 0` there: an `x`-intercept, not an asymptote." }] },
        b:{ prompt:"Which list gives <strong>every</strong> vertical asymptote of `y = (x - 4)/(x^3 + 3x^2 - 4x - 12)`?", options:[
          { t:"`x = -3`, `x = -2` and `x = 2`", ok:true, why:"`x^2(x + 3) - 4(x + 3) = (x + 3)(x - 2)(x + 2)`, and the numerator `x - 4` isn’t 0 at any of them." },
          { t:"`x = -3` only", why:"Grouping gives `(x + 3)(x^2 - 4)`, and `x^2 - 4` has zeros too." },
          { t:"`x = -3` and `x = 2`", why:"`x^2 - 4 = 0` gives `x = 2` <strong>and</strong> `x = -2`." },
          { t:"`x = -3`, `x = -2`, `x = 2` and `x = 4`", why:"At `x = 4` the numerator is 0: an `x`-intercept." }] } },
      { id:"t2", cat:"T", goal:6,
        a:{ prompt:"Where does the graph of `y = (2x^2 + 3x)/(x^2 + 1)` cross its horizontal asymptote?", options:[
          { t:"At (2/3, 2)", ok:true, why:"Equal degrees give `y = 2/1 = 2`. Then `2x^2 + 3x = 2x^2 + 2`, so `3x = 2` and `x = 2/3`." },
          { t:"It never does: a graph can’t cross its asymptote.", why:"A horizontal asymptote only describes the ends. Solve `2x^2 + 3x = 2(x^2 + 1)`." },
          { t:"At (0, 0)", why:"At (0, 0) the graph crosses `y = 0`, the `x`-axis. The asymptote here is `y = 2`." },
          { t:"At (3/2, 2)", why:"`3x = 2` gives `x = 2/3`, not 3/2. Check: `f(3/2) = 9/(13/4) = 36/13`, not 2." }] },
        b:{ prompt:"Where does the graph of `y = (3x^2 - 2x)/(x^2 + 4)` cross its horizontal asymptote?", options:[
          { t:"At (−6, 3)", ok:true, why:"Equal degrees give `y = 3`. Then `3x^2 - 2x = 3x^2 + 12`, so `-2x = 12` and `x = -6`." },
          { t:"It never does: a graph can’t cross its asymptote.", why:"A horizontal asymptote only describes the ends. Solve `3x^2 - 2x = 3(x^2 + 4)`." },
          { t:"At (0, 0)", why:"That’s where it crosses `y = 0`. The asymptote here is `y = 3`." },
          { t:"At (6, 3)", why:"`-2x = 12` gives `x = -6`. Check: `f(6) = 96/40 = 12/5`, not 3." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"Which describes `y = -3/x^2` near `x = 0`?", options:[
          { t:"As `x → 0^{-}`, `y → -∞`, and as `x → 0^{+}`, `y → -∞`", ok:true, why:"`x^2` is a tiny positive number on both sides, so `3/x^2` is huge and positive, and `-3/x^2` is huge and negative on both sides." },
          { t:"As `x → 0^{-}`, `y → ∞`, and as `x → 0^{+}`, `y → ∞`", why:"`x^2` is positive on both sides, but the −3 makes every `y`-value negative." },
          { t:"As `x → 0^{-}`, `y → -∞`, and as `x → 0^{+}`, `y → ∞`", why:"That’s `1/x`. Here `x^2` is positive on both sides, so both sides behave the same way." },
          { t:"As `x → 0^{-}`, `y → ∞`, and as `x → 0^{+}`, `y → -∞`", why:"That’s the pattern for `-1/x`. With `x^2`, both sides have the same sign." }] },
        b:{ prompt:"Which describes `y = -2/x^3` near `x = 0`?", options:[
          { t:"As `x → 0^{-}`, `y → ∞`, and as `x → 0^{+}`, `y → -∞`", ok:true, why:"Just left of 0, `x^3` is a tiny negative number, so `-2/x^3` is huge and positive. Just right of 0, `x^3` is tiny and positive, so `-2/x^3` is huge and negative." },
          { t:"As `x → 0^{-}`, `y → -∞`, and as `x → 0^{+}`, `y → ∞`", why:"That’s the pattern for `2/x^3` (and `1/x`). The −2 flips the sign on both sides." },
          { t:"As `x → 0^{-}`, `y → -∞`, and as `x → 0^{+}`, `y → -∞`", why:"That’s the pattern for `-2/x^2`. But `x^3` keeps the sign of `x`: it’s negative just left of 0, so `-2/x^3` is positive there." },
          { t:"As `x → 0^{-}`, `y → ∞`, and as `x → 0^{+}`, `y → ∞`", why:"That’s the pattern for `2/x^2`. Here `x^3` changes sign at 0, and the −2 flips both sides, so the two sides go opposite ways." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which is the best explanation of why `y = 5/(x^2 + 9)` has no vertical asymptote?", options:[
          { t:"“`x^2` is never negative, so `x^2 + 9` is at least 9. The denominator is never 0, so no `x`-value is excluded.”", ok:true, why:"This explains why the denominator can’t be 0. With nothing excluded, there’s no `x` for the graph to shoot up or down beside." },
          { t:"“The numerator 5 is never 0, so `y` is never 0 and the graph never shoots up or down.”", why:"The numerator decides the `x`-intercepts. Vertical asymptotes come from the denominator being 0." },
          { t:"“`x^2 + 9` can’t be factored, so it can’t equal 0, and no `x`-value is excluded.”", why:"`x^2 - 2` doesn’t factor with whole numbers either, but it’s 0 at `x = ±√2`. What matters is that `x^2 + 9` is always at least 9." },
          { t:"“The graph has a horizontal asymptote, `y = 0`, so it can’t also have a vertical one.”", why:"`y = 1/x` has both kinds." }] },
        b:{ prompt:"Which is the best explanation of why `y = (x - 1)/(x^2 + 2x + 2)` has no vertical asymptote?", options:[
          { t:"“`x^2 + 2x + 2 = (x + 1)^2 + 1`, which is at least 1. The denominator is never 0, so no `x`-value is excluded.”", ok:true, why:"This shows the denominator can’t be 0. With nothing excluded, there’s no `x` for the graph to shoot up or down beside." },
          { t:"“The numerator is 0 at `x = 1`, and that cancels out the vertical asymptote.”", why:"`x = 1` is an `x`-intercept. Vertical asymptotes come from the denominator." },
          { t:"“`x^2 + 2x + 2` can’t be factored, so it can’t equal 0, and no `x`-value is excluded.”", why:"`x^2 - 2` doesn’t factor nicely either, but it has zeros. The reason is that `x^2 + 2x + 2` is always at least 1." },
          { t:"“The degree of the top is less than the degree of the bottom, so there is no vertical asymptote.”", why:"Comparing degrees tells you the <strong>horizontal</strong> asymptote (here `y = 0`). It says nothing about vertical ones." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which statement about `y = 1/x` is written correctly and is true?", options:[
          { t:"“As `x → 0^{+}`, `y → ∞`, and as `x → ∞`, `y → 0`.”", ok:true, why:"Tiny positive `x` gives huge positive `y`; huge `x` gives `y` close to 0." },
          { t:"“As `x → 0^{+}`, `y → 0`, and as `x → ∞`, `y → ∞`.”", why:"Near 0, 1 is divided by a tiny number, so `y` is huge. Far out, `y` is tiny." },
          { t:"“At `x = 0`, `y = ∞`, and as `x → ∞`, `y → 0`.”", why:"The second part is fine. But `x = 0` isn’t in the domain: 1/0 has no value, and ∞ isn’t a number. Arrow notation describes what happens <strong>near</strong> 0." },
          { t:"“As `x → 0^{-}`, `y → ∞`, and as `x → ∞`, `y → 0`.”", why:"The second part is fine. But just left of 0, `x` is negative, so `1/x` is negative: `y → -∞`." }] },
        b:{ prompt:"Which statement about `y = -1/x^2` is written correctly and is true?", options:[
          { t:"“As `x → 0^{-}`, `y → -∞`, and as `x → -∞`, `y → 0`.”", ok:true, why:"Near 0, `-1/x^2` is huge and negative on both sides; far out it’s close to 0." },
          { t:"“As `x → 0^{-}`, `y → 0`, and as `x → -∞`, `y → -∞`.”", why:"Near 0, `x^2` is tiny, so `-1/x^2` is huge and negative. Far out, it’s close to 0." },
          { t:"“At `x = 0`, `y = -∞`, and as `x → -∞`, `y → 0`.”", why:"The second part is fine. But `x = 0` isn’t in the domain, and −∞ isn’t a number. Arrow notation describes what happens near 0." },
          { t:"“As `x → 0^{+}`, `y → ∞`, and as `x → -∞`, `y → 0`.”", why:"The second part is fine. But `x^2` is positive, so `-1/x^2` is negative on both sides: as `x → 0^{+}`, `y → -∞`." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"The temperature of a cup of tea, in °C, `t` minutes after it’s poured is modelled by `T(t) = (20t + 90)/(t + 1)`. After how many minutes is the tea exactly 1 °C warmer than the temperature it levels off at?", options:[
          { t:"69", ok:true, why:"Equal degrees, so `T` levels off at 20/1 = 20 °C. Solve `T(t) = 21`: `20t + 90 = 21t + 21`, so `t = 69`." },
          { t:"70", why:"`T(t) - 20 = 70/(t + 1)`, not `70/t`. Setting `70/(t + 1) = 1` gives `t = 69`." },
          { t:"89", why:"`21(t + 1) = 21t + 21`, not `21t + 1`." },
          { t:"Never: it only gets close to 20 °C.", why:"The tea starts at 90 °C and cools toward 20 °C, so it passes 21 °C on the way." }] },
        b:{ prompt:"A cart’s speed, in m/s, `t` seconds after it starts is `v(t) = (12t + 2)/(t + 5)`. After how many seconds is the cart exactly 1 m/s slower than the speed it levels off at?", options:[
          { t:"53", ok:true, why:"Equal degrees, so `v` levels off at 12/1 = 12 m/s. Solve `v(t) = 11`: `12t + 2 = 11t + 55`, so `t = 53`." },
          { t:"3", why:"`11(t + 5) = 11t + 55`, not `11t + 5`." },
          { t:"58", why:"`12 - v(t) = 58/(t + 5)`, not `58/t`." },
          { t:"Never: it only gets close to 12 m/s.", why:"The cart starts at 0.4 m/s and speeds up toward 12 m/s, so it passes 11 m/s on the way." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"`f(x) = 1/x + 1/(x - 4)`. Which describes all of `f`’s asymptotes?", options:[
          { t:"Vertical `x = 0` and `x = 4`; horizontal `y = 0`", ok:true, why:"Combined, `f(x) = (2x - 4)/(x(x - 4))`. The denominator is 0 at 0 and 4 (the numerator isn’t), and degree 1 over degree 2 gives `y = 0`." },
          { t:"Vertical `x = 0` and `x = 4`; horizontal `y = 2`", why:"The combined numerator `2x - 4` has degree 1, the denominator degree 2, so `y → 0`." },
          { t:"Vertical `x = 2`; horizontal `y = 0`", why:"`2x - 4 = 0` at `x = 2` makes `f(2) = 0`: an `x`-intercept." },
          { t:"Vertical `x = 0` and `x = -4`; horizontal `y = 0`", why:"`x - 4 = 0` at `x = 4`." }] },
        b:{ prompt:"`f(x) = 2/x - 1/(x + 3)`. Which describes all of `f`’s asymptotes?", options:[
          { t:"Vertical `x = 0` and `x = -3`; horizontal `y = 0`", ok:true, why:"Combined, `f(x) = (2(x + 3) - x)/(x(x + 3)) = (x + 6)/(x(x + 3))`. Asymptotes at 0 and −3; degree 1 over degree 2 gives `y = 0`." },
          { t:"Vertical `x = 0` and `x = -3`; horizontal `y = 1`", why:"The combined numerator `x + 6` has degree 1, the denominator degree 2, so `y → 0`." },
          { t:"Vertical `x = -6`; horizontal `y = 0`", why:"`x + 6 = 0` at `x = -6` makes `f(-6) = 0`: an `x`-intercept." },
          { t:"Vertical `x = 0` and `x = 3`; horizontal `y = 0`", why:"`x + 3 = 0` at `x = -3`." }] } }
    ]
  },
  task:{
    title:"Design a rational function", summary:"Design a rational function",
    statement:"<p>Fill in `f(x) = (ax^2 + bx + c)/(x^2 + px + q)` so that all four checks pass. There are many answers. Can you find three?</p><p class=\"tiny muted\">These letters are just coefficients here, so they aren’t coloured. Type a whole number from −20 to 20 in each box.</p>",
    checks:["Exactly two vertical asymptotes", "Horizontal asymptote `y = 2`", "The graph crosses its horizontal asymptote at `x = 1`", "The graph passes through the origin"],
    tips:[
      "Right now `x^2 + px + q` {state}. You need two different real zeros (make `p^2 - 4q` positive, for example a negative `q`), and the numerator must not be 0 there.",
      "The degrees are equal, so the horizontal asymptote is `y = a/1`. Set `a = 2`.",
      "Solve `f(1) = 2`: `(2 + b + c)/(1 + p + q) = 2`. Right now your graph {now}.",
      "`f(0) = c/q`. For the graph to pass through (0, 0), `c` must be 0 and `q` can’t be 0."
    ],
    tipStates:{ none:"has no real zeros", one:"has one repeated zero", shared:"has two real zeros, but the numerator is also 0 at one of them",
      hole:"Module 21 shows that a shared zero makes a hole, not an asymptote.",
      cross:"crosses {L} at {x}", never:"never crosses {L}", undef:"isn’t defined at `x = 1`" },
    explainPrompt:"Explain how you chose each number.",
    vocab:"Use the words restriction, vertical asymptote, horizontal asymptote and leading coefficient.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another?",
    after3:"You found three. Notice that `a = 2` and `c = 0` every time: the asymptote and the origin force them. Once you choose `p` and `q`, the crossing at `x = 1` forces `b = 2(p + q)`."
  },
  cards:[
    ["Rational function", "A function that can be written as `f(x) = p(x)/q(x)`, where `p` and `q` are polynomials and `q` isn’t the zero polynomial. Example: `(x + 1)/(x^2 - 4)`. Not rational: `√x/(x + 1)`."],
    ["Is a polynomial a rational function?", "Yes: `p(x) = p(x)/1`, with domain ℝ. Example: `(x^2 - 1)/4 = x^2/4 - 1/4`."],
    ["Restriction", "An `x`-value that makes the denominator 0. It’s left out of the domain. For `(x + 1)/(x^2 - 4)`: `x ≠ -2`, `x ≠ 2`."],
    ["`y = 1/x`: domain, range and asymptotes", "Domain `{x ∈ ℝ | x ≠ 0}`; range `{y ∈ ℝ | y ≠ 0}`; vertical asymptote `x = 0`; horizontal asymptote `y = 0`."],
    ["`y = 1/x` near 0, in arrow notation", "As `x → 0^{-}`, `y → -∞`. As `x → 0^{+}`, `y → ∞`."],
    ["`y = 1/x^2` near 0", "As `x → 0^{-}` and as `x → 0^{+}`, `y → ∞`, because `x^2` is positive on both sides."],
    ["Vertical asymptote", "A line `x = a` where `y → ∞` or −∞ as `x → a`. It sits at a zero of the denominator where the numerator isn’t 0. The graph never touches it."],
    ["Horizontal asymptote", "A line `y = b` that the graph approaches as `x → ∞` or `x → -∞`. It describes the ends only."],
    ["Horizontal asymptote, by degree", "Top’s degree lower: `y = 0`. Equal: `y` = (top’s leading coefficient)/(bottom’s leading coefficient). Top’s degree higher: no horizontal asymptote."],
    ["Can a graph cross an asymptote?", "A vertical one: never (that `x` isn’t in the domain). A horizontal one: yes, at a finite `x`. Example: `(x^2 + 2x)/(x^2 + 4)` crosses `y = 1` at `x = 2`."],
    ["When is there no vertical asymptote?", "When the denominator is never 0, like `x^2 + 9` (always at least 9). Then the domain is ℝ. Example: `5/(x^2 + 9)`."],
    ["Small ↔ big", "Reciprocals swap small and big: 1/0.001 = 1000 and 1/1000 = 0.001. That’s why `1/x` explodes near 0 and fades far away."]
  ]
};
