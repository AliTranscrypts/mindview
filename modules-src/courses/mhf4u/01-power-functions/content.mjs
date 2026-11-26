// MHF4U 01 Power Functions: the reference module's content, plus the back-port (version B Final Check,
// plan modules/01-power-functions-backport.md). Storage key kept as mhf4u-power-functions-v1.
const num = v => { const r = Math.round(v * 1000) / 1000; return String(Object.is(r, -0) ? 0 : r); };
const term = (a, n) => n === 0 ? num(a) : (a === 1 ? "" : a === -1 ? "-" : num(a)) + (n === 1 ? "x" : "x^" + n);
const eq = (a, n) => "`y = " + term(a, n) + "`";

function endInfo(a, n){
  const L = (l, r) => "As `x → -∞`, `y → " + l + "`, and as `x → ∞`, `y → " + r + "`.";
  if (n === 0) return { flat:true, words:"Flat on both sides: the graph is a horizontal line." };
  const ev = n % 2 === 0;
  if (ev && a > 0) return { from:2, to:1, key:"upup", words:"Both arms point up.", limits:L("∞", "∞") };
  if (ev && a < 0) return { from:3, to:4, key:"downdown", words:"Both arms point down.", limits:L("-∞", "-∞") };
  if (a > 0) return { from:3, to:1, key:"downup", words:"Starts low on the left and ends high on the right.", limits:L("-∞", "∞") };
  return { from:2, to:4, key:"updown", words:"Starts high on the left and ends low on the right.", limits:L("∞", "-∞") };
}
function iconSVG(kind){
  const P = { upup:[[6,4],[14,40],[30,40],[38,4]], downdown:[[6,30],[14,-6],[30,-6],[38,30]], downup:[[6,30],[18,2],[26,32],[38,4]], updown:[[6,4],[18,32],[26,2],[38,30]] }[kind];
  const head = (tip, from) => {
    const dx = tip[0] - from[0], dy = tip[1] - from[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, s = 7;
    const bx = tip[0] - ux * s, by = tip[1] - uy * s;
    return '<path d="M' + tip[0] + " " + tip[1] + " L" + (bx - uy * s * 0.6).toFixed(1) + " " + (by + ux * s * 0.6).toFixed(1) + " L" + (bx + uy * s * 0.6).toFixed(1) + " " + (by - ux * s * 0.6).toFixed(1) + 'Z" fill="currentColor"/>';
  };
  return '<svg width="44" height="34" viewBox="0 0 44 34" aria-hidden="true" style="color:var(--pen)"><path d="M0 17H44M22 0V34" stroke="var(--rule)" stroke-width="1.2"/><path d="M' + P[0].join(" ") + " C" + P[1].join(" ") + " " + P[2].join(" ") + " " + P[3].join(" ") + '" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>' + head(P[0], P[1]) + head(P[3], P[2]) + "</svg>";
}

const MATCH_DATA = [[3,4],[-1,2],[2,5],[-0.5,3],[-4,6],[1,7],[-1,1],[0.1,8]];
const matchItems = MATCH_DATA.map(([a, n], i) => {
  const e = endInfo(a, n), ev = n % 2 === 0, par = ev ? "even" : "odd", sign = a > 0 ? "positive" : "negative";
  const wrong = {};
  for (const bin of ["upup", "downdown", "downup", "updown"]) {
    if (bin === e.key) continue;
    const same = bin === "upup" || bin === "downdown";
    if (same !== ev) wrong[bin] = ev ? "The degree " + n + " is even, so both arms point the same way." : "The degree " + n + " is odd, so the arms point in opposite directions.";
    else {
      const tail = ev ? (a > 0 ? "both arms point up." : "both arms point down.") : (a > 0 ? "the right arm points up." : "the right arm points down.");
      wrong[bin] = "Check the sign of `a`: `a = " + num(a) + "` is " + sign + ", so " + tail;
    }
  }
  return {
    id:"m" + (i + 1), t:eq(a, n), answer:e.key, goal:2,
    why:e.words + " The degree " + n + " is " + par + " and `a` is " + sign + ".",
    hints:["Ask two questions: is the degree even or odd? Is `a` positive or negative?",
      "The degree is " + n + ", which is " + par + ", so the arms point " + (ev ? "the same way." : "in opposite directions."),
      "Degree " + n + " is " + par + " and `a = " + num(a) + "` is " + sign + ". So: " + e.words + " That’s Q" + e.from + " to Q" + e.to + "."],
    wrong
  };
});
const ONE = "A power function has just one term, and this has only one term.";

export default {
  id:"01-power-functions",
  storageKey:"mhf4u-power-functions-v1",
  kind:"topic",
  title:"Power functions",
  topic:"Power Functions",
  readyTopic:"power functions",
  hero:{
    eq:'y = <span class="va">a</span>x<sup class="vn">n</sup>', eqLabel:"y equals a x to the power n",
    headline:"Two numbers control the whole graph",
    text:"A power function has the form <span class=\"m\"><i>y</i> = <i class=\"va\">a</i><i>x</i><sup><i class=\"vn\">n</i></sup></span>. The number <span class=\"m\"><i class=\"va\">a</i></span> is the <strong>leading coefficient</strong> and the whole number <span class=\"m\"><i class=\"vn\">n</i></span> is the <strong>degree</strong>. In this module you’ll find out exactly how those two numbers shape the graph: by experimenting first, then practising, then checking yourself.",
    fig:{ aria:"Graphs of y equals x to the power 1 through 6, drawn one after another" }
  },
  goals:[
    "I can tell whether a function is a power function, and name its degree and leading coefficient.",
    "I can describe the end behaviour of `y = ax^n` using the degree and the sign of `a`.",
    "I can state the domain and range of a power function.",
    "I can tell whether a power function is even or odd, and describe its symmetry.",
    "I can describe how the graph changes shape as the degree increases."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Exponents and negative numbers", goal:4, prompt:"Evaluate `(-2)^3`.",
          options:[
            { t:"`-8`", ok:true, why:"(−2)(−2)(−2) = −8. Three negative factors give a negative answer." },
            { t:"`8`", why:"Close! You found the size correctly, but three negative factors multiply to a negative number." },
            { t:"`-6`", why:"That’s −2 × 3. An exponent means repeated multiplication: (−2)(−2)(−2)." },
            { t:"`6`", why:"That’s 2 × 3. An exponent means repeated multiplication: (−2)(−2)(−2)." }],
          hints:["An exponent tells you how many times to multiply the base by itself.", "Write it out: (−2)(−2)(−2). Multiply the first two, then the last one.", "(−2)(−2) = 4, then 4 × (−2) = −8."] },
        { id:"w2", skill:"Exponents and negative numbers", goal:4, prompt:"Evaluate `(-3)^2`.",
          options:[
            { t:"`9`", ok:true, why:"(−3)(−3) = 9. Two negative factors give a positive answer." },
            { t:"`-9`", why:"That would be `-3^2`, where only the 3 is squared. Here the brackets mean the whole −3 is squared." },
            { t:"`6`", why:"That’s 3 × 2. Squaring means multiplying a number by itself: (−3)(−3)." },
            { t:"`-6`", why:"That’s −3 × 2. Squaring means (−3)(−3), and two negatives make a positive." }],
          hints:["The brackets matter: the whole −3 is being squared.", "Write it as (−3)(−3). What is a negative times a negative?", "(−3)(−3) = 9."] },
        { id:"w3", skill:"Exponent laws", goal:1, prompt:"Simplify `x^3 · x^4`.",
          options:[
            { t:"`x^7`", ok:true, why:"When you multiply powers with the same base, add the exponents: 3 + 4 = 7." },
            { t:"`x^12`", why:"That’s what you get by multiplying the exponents. When you multiply powers with the same base, add the exponents instead." },
            { t:"`2x^7`", why:"There’s no 2 in front. `x^3 · x^4` is just seven x’s multiplied together." },
            { t:"`2x^12`", why:"Two mix-ups: there’s no 2 in front, and the exponents should be added, not multiplied." }],
          hints:["Write it out: `x^3` means x·x·x and `x^4` means x·x·x·x.", "How many x’s are multiplied together in total?", "3 + 4 = 7 x’s multiplied together, so the answer is `x^7`."] },
        { id:"w4", skill:"Domain and range", goal:3, prompt:"What is the domain of `y = x^2`?",
          options:[
            { t:"`{x ∈ ℝ}`", ok:true, why:"You can square any real number, so every x-value works." },
            { t:"`{x ∈ ℝ | x ≥ 0}`", why:"Negative x-values work too: (−3)² = 9. You may be thinking of the range." },
            { t:"`{y ∈ ℝ | y ≥ 0}`", why:"That’s the range (the y-values). The domain is about the x-values." },
            { t:"`{x ∈ ℝ | x ≠ 0}`", why:"x = 0 works fine: 0² = 0." }],
          hints:["Domain means all the x-values you’re allowed to put in.", "Is there any number you can’t square?", "Every real number can be squared, so the domain is all real numbers: `{x ∈ ℝ}`."] },
        { id:"w5", skill:"Domain and range", goal:3, prompt:"What is the range of `y = x^2`?",
          options:[
            { t:"`{y ∈ ℝ | y ≥ 0}`", ok:true, why:"Squaring never gives a negative answer, and 0² = 0, so y can be 0 or anything above it." },
            { t:"`{y ∈ ℝ}`", why:"Can x² ever be negative? Squaring always gives 0 or a positive number." },
            { t:"`{y ∈ ℝ | y > 0}`", why:"So close! But y = 0 is reached when x = 0, so use ≥ instead of >." },
            { t:"`{x ∈ ℝ}`", why:"That’s the domain. The range is about the y-values that come out." }],
          hints:["Range means all the y-values the graph can reach.", "Can x² ever be negative? What’s the smallest value it can be?", "The smallest value is 0 (when x = 0), and it can be any positive number, so `{y ∈ ℝ | y ≥ 0}`."] },
        { id:"w6", skill:"Evaluating functions", goal:1, prompt:"Which point is on the graph of `y = 2x^3`?",
          options:[
            { t:"(2, 16)", ok:true, why:"2 × 2³ = 2 × 8 = 16." },
            { t:"(2, 12)", why:"It looks like you did 2 × 2 × 3. The exponent means 2³ = 2 × 2 × 2 = 8, then multiply by 2." },
            { t:"(2, 64)", why:"You cubed the 2 in front as well: (2 × 2)³ = 64. Only x is cubed: 2 × 2³ = 16." },
            { t:"(2, 8)", why:"You found 2³ = 8 but forgot to multiply by the 2 in front." }],
          hints:["Substitute x = 2 into the equation.", "Do the exponent first (order of operations), then multiply by 2.", "2³ = 8, then 2 × 8 = 16, so the point is (2, 16)."] }
      ],
      refreshers:{
        "Exponents and negative numbers":"An exponent means repeated multiplication: (−2)³ = (−2)(−2)(−2). An even number of negative factors gives a positive answer, and an odd number gives a negative answer. Watch the brackets: (−3)² = 9, but −3² = −9 because only the 3 is squared. This exact idea is why even and odd powers behave differently later on.",
        "Exponent laws":"When you multiply powers with the same base, add the exponents. So `x^3 · x^4 = x^7`.",
        "Domain and range":"The domain is every x-value you can put in. The range is every y-value that comes out. For `y = x^2`, any x works, so the domain is `{x ∈ ℝ}`. Squares are never negative, so the range is `{y ∈ ℝ | y ≥ 0}`.",
        "Evaluating functions":"Substitute, then follow the order of operations: exponents before multiplication. For `y = 2x^3` at x = 2, work out 2³ = 8 first, then 2 × 8 = 16."
      }
    }
  },
  explore:{
    heading:"Power function playground",
    intro:"Drag the sliders and watch the graph change. The highlighted quadrants show where the graph’s two arms point. The panel lists everything you can say about the function.",
    predIntro:"Make a prediction first. Then the graph will show you what really happens.",
    predictions:[
      { id:"p1", start:{ a:2, n:2 }, end:{ a:-2, n:2 },
        prompt:"The graph shows " + eq(2, 2) + ". What will happen if you change `a` from 2 to −2?",
        options:[{ t:"Both arms flip to point down", ok:true }, { t:"Nothing changes" }, { t:"Only the right arm flips down" }, { t:"The graph slides down 2 units" }],
        explain:"A negative `a` flips the whole graph upside down (a reflection in the x-axis). Both arms now point down, from Q3 to Q4." },
      { id:"p2", start:{ a:1, n:2 }, end:{ a:1, n:3 },
        prompt:"The graph shows " + eq(1, 2) + ". What will happen if you change `n` from 2 to 3?",
        options:[{ t:"The left arm flips down and the right arm stays up", ok:true }, { t:"Both arms point down" }, { t:"It looks the same, just steeper" }, { t:"The right arm flips down" }],
        explain:"With an odd degree, the arms point in opposite directions. For `y = x^3`, negative x-values cubed stay negative, so the left arm goes down into Q3 while the right arm goes up into Q1." },
      { id:"p3", start:{ a:1, n:2 }, end:{ a:1, n:6 },
        prompt:"The graph shows " + eq(1, 2) + ". If you change `n` to 6, what happens to the graph between x = −1 and x = 1?",
        options:[{ t:"It gets flatter, hugging the x-axis", ok:true }, { t:"It gets steeper" }, { t:"It stays exactly the same" }, { t:"It becomes a straight line" }],
        explain:"Numbers between −1 and 1 get smaller when you raise them to higher powers: 0.5² = 0.25, but 0.5⁶ ≈ 0.016. So higher powers stay flatter near the origin, then shoot up faster once x is past 1 or −1." },
      { id:"p4", start:{ a:1, n:1 }, cycle:true,
        prompt:"With `a = 1`, which point will the graph pass through no matter what `n` is (for n = 1 and up)?",
        options:[{ t:"(1, 1)", ok:true }, { t:"(0, 1)" }, { t:"(2, 2)" }, { t:"(1, 0)" }],
        explain:"1 raised to any power is still 1, so every graph of `y = x^n` passes through (1, 1). They all pass through (0, 0) as well. Even powers also share (−1, 1), and odd powers share (−1, −1)." }
    ],
    challenges:[]
  },
  part3:{
    slug:"symmetry", name:"Symmetry",
    heading:"Even or odd? Test the symmetry",
    intro:"Pick a function, then move a copy of its graph. If the copy lands exactly on the original, the graph has that kind of symmetry.",
    blocks:[{ title:"What the tests mean", html:"<p><strong>Even function:</strong> fold it over the <i>y</i>-axis and it lands on itself. This is called <em>line symmetry about the y-axis</em>. In symbols, `f(-x) = f(x)`.</p><p><strong>Odd function:</strong> spin it half a turn (180°) around the origin and it lands on itself. This is called <em>point symmetry about the origin</em>. In symbols, `f(-x) = -f(x)`.</p>" }],
    quickCheck:{
      title:"Quick check: even or odd?", summary:"Symmetry quick check", intro:"Decide without the animation. Use the degree.", store:"sym",
      items:[[ "sq1", -4, 6 ], [ "sq2", 2, 7 ], [ "sq3", 5, 0 ], [ "sq4", -1, 1 ]].map(([id, a, n]) => {
        const ev = n % 2 === 0, ans = ev ? "even" : "odd";
        const right = n === 0 ? "Right. `y = 5` is the same as `5x^0`, and 0 is even. A horizontal line folds onto itself over the y-axis."
          : "Right. The degree " + n + " is " + ans + ", so `(-x)^" + n + " = " + (ev ? "" : "-") + "x^" + n + "` and `f(-x) = " + (ev ? "f(x)" : "-f(x)") + "`.";
        const wrong = n === 0 ? "Not quite. Write `y = 5` as `5x^0`. Is the exponent 0 even or odd? Picture the flat line: does it fold onto itself over the y-axis?"
          : "Not quite. Look at the exponent: " + n + " is " + ans + ". " + (ev ? "An even number of negative signs cancel out, so the graph folds onto itself." : "An odd number of negative signs leaves a negative, so the graph matches itself after a half-turn.");
        return { id, goal:4, prompt:eq(a, n), choices:[{ t:"Even", ok:ev, fb:ev ? right : wrong }, { t:"Odd", ok:!ev, fb:ev ? wrong : right }] };
      })
    }
  },
  practice:{
    activities:[
      { id:"match", type:"sorter", title:"End behaviour match", summary:"End behaviour match", instruction:"Sort each function by where its arms point.", noun:"function", goal:2,
        boxes:[
          { id:"upup", label:"Both arms up", sub:"Q2 to Q1", icon:iconSVG("upup") },
          { id:"downdown", label:"Both arms down", sub:"Q3 to Q4", icon:iconSVG("downdown") },
          { id:"downup", label:"Down on the left, up on the right", sub:"Q3 to Q1", icon:iconSVG("downup") },
          { id:"updown", label:"Up on the left, down on the right", sub:"Q2 to Q4", icon:iconSVG("updown") }],
        items:matchItems },
      { id:"poly", type:"sorter", title:"Polynomial or not?", summary:"Polynomial or not?", noun:"function", goal:1,
        instruction:"A <strong>power function</strong> has exactly one term, `ax^n`, with a whole-number exponent. A <strong>polynomial</strong> can have several terms, but every exponent must still be a whole number.",
        boxes:[
          { id:"power", label:"Power function", sub:"One term: a number times x to a whole-number power" },
          { id:"poly", label:"Polynomial, but not a power function", sub:"More than one term, whole-number exponents" },
          { id:"not", label:"Not a polynomial", sub:"Uses an exponent that isn’t a whole number, or x in the exponent" }],
        items:[
          { id:"s1", t:"`y = 5x^3`", answer:"power", why:"One term: a number (5) times x to a whole-number power (3).",
            hints:["Count the terms. Then look at the exponent: is it a whole number?", "There’s one term, and the exponent 3 is a whole number.", "It matches `y = ax^n` with a = 5 and n = 3, so it’s a power function."],
            wrong:{ poly:ONE + " That makes it a power function.", not:"The exponent 3 is a whole number, so this is a polynomial, and with one term it’s a power function." } },
          { id:"s2", t:"`y = x^½`", answer:"not", why:"The exponent ½ isn’t a whole number. (This is the square root function, √x.)",
            hints:["Look closely at the exponent.", "Whole numbers are 0, 1, 2, 3, … Is ½ one of them?", "½ isn’t a whole number, so this isn’t a polynomial at all."],
            wrong:{ power:"It has one term, but the exponent must be a whole number (0, 1, 2, …). ½ isn’t.", poly:"Polynomials only use whole-number exponents, and ½ isn’t one." } },
          { id:"s3", t:"`y = 2^x`", answer:"not", why:"The variable is in the exponent. That makes it an exponential function, not a power function.",
            hints:["Where is the x? Is it the base or the exponent?", "In a power function, x is the base: `ax^n`. Here x is up in the exponent.", "With x in the exponent, this is an exponential function, so it isn’t a polynomial."],
            wrong:{ power:"Careful: here x is the exponent, not the base. In a power function, x is the base, as in `ax^n`.", poly:"Careful: x is in the exponent here, which polynomials never do." } },
          { id:"s4", t:"`y = 4/x`", answer:"not", why:"4/x is the same as `4x^-1`. The exponent −1 is negative, so it isn’t a whole number.",
            hints:["Try rewriting the division as a power of x.", "Dividing by x is the same as multiplying by `x^-1`.", "`4/x = 4x^-1`, and −1 isn’t a whole number, so it isn’t a polynomial."],
            wrong:{ power:"Rewrite it: `4/x = 4x^-1`. The exponent −1 isn’t a whole number.", poly:"Rewrite it: `4/x = 4x^-1`. Polynomials can’t have negative exponents." } },
          { id:"s5", t:"`y = -7`", answer:"power", why:"It’s a constant, which you can write as `-7x^0`. Degree 0 is a whole number, so it’s a power function.",
            hints:["Where’s the x? Remember that `x^0 = 1`.", "You can write −7 as `-7x^0`.", "That’s `ax^n` with a = −7 and n = 0. Since 0 is a whole number, it’s a power function."],
            wrong:{ poly:"There’s only one term here.", not:"Try rewriting it as `-7x^0`. Is 0 a whole number?" } },
          { id:"s6", t:"`y = x^2 + 3x`", answer:"poly", why:"Two terms, both with whole-number exponents. It’s a polynomial, but a power function has only one term.",
            hints:["Count the terms.", "There are two terms: `x^2` and `3x`. Are both exponents whole numbers?", "Both exponents (2 and 1) are whole numbers, so it’s a polynomial. Two terms means it isn’t a power function."],
            wrong:{ power:"A power function has just one term. This has two: `x^2` and `3x`.", not:"Both exponents (2 and 1) are whole numbers, so it is a polynomial." } },
          { id:"s7", t:"`y = -0.5x^6`", answer:"power", why:"One term, with a = −0.5 and n = 6. Decimals and negatives are fine for `a`.",
            hints:["What rules does `a` have to follow? What about `n`?", "`a` can be any real number (except 0). Only `n` has to be a whole number.", "a = −0.5 and n = 6 fit `y = ax^n`, so it’s a power function."],
            wrong:{ poly:ONE, not:"The coefficient `a` can be any real number, even a negative decimal. Only the exponent has to be a whole number." } },
          { id:"s8", t:"`y = πx^2`", answer:"power", why:"π is just a number (about 3.14), so a = π and n = 2. It’s the formula for the area of a circle!",
            hints:["What kind of thing is π?", "π is a number, about 3.14. So what are a and n?", "a = π and n = 2, so it’s a power function."],
            wrong:{ poly:ONE, not:"π looks unusual, but it’s just a number (about 3.14)." } },
          { id:"s9", t:"`y = 3x^4 - 2x + 1`", answer:"poly", why:"Three terms with whole-number exponents (4, 1 and 0). It’s a polynomial, but a power function needs just one term.",
            hints:["Count the terms.", "There are three terms. Are all the exponents whole numbers?", "The exponents are 4, 1 and 0, all whole numbers, so it’s a polynomial. Three terms means it isn’t a power function."],
            wrong:{ power:"Count the terms: there are three.", not:"All the exponents (4, 1 and 0) are whole numbers, so it’s a polynomial." } },
          { id:"s10", t:"`y = x/5`", answer:"power", why:"x/5 is the same as `(1/5)x^1`, so a = 1/5 and n = 1.",
            hints:["Dividing by 5 is the same as multiplying by what?", "x/5 = (1/5)x. Compare this with 4/x, where x was on the bottom.", "`x/5 = (1/5)x^1`: one term, whole-number exponent, so it’s a power function."],
            wrong:{ poly:ONE, not:"Dividing by 5 is the same as multiplying by 1/5, so `x/5 = (1/5)x`. The x isn’t on the bottom." } }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Jordan",
        instruction:"Jordan made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.", how:"",
        problems:[
          { id:"e1", goal:2, task:"Describe the end behaviour and range of `y = -2x^4`.",
            steps:["The degree is 4, which is even.", "The leading coefficient is −2, which is negative.", "Even degree and negative `a`, so the graph goes from Q2 to Q4.", "Range: `{y ∈ ℝ | y ≤ 0}`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct. Keep checking the steps after it.", "", "Step 4 is actually correct: the highest point is (0, 0). The mistake is earlier, and step 4 doesn’t even agree with it!"],
            fixes:[
              { t:"Even degree and negative `a`, so both arms point down: Q3 to Q4.", ok:true, why:"Even degree means both arms point the same way, and a negative `a` points them down." },
              { t:"Even degree and negative `a`, so both arms point up: Q2 to Q1.", why:"A negative `a` flips the graph, so the arms point down, not up." },
              { t:"Even degree and negative `a`, so the graph goes from Q3 to Q1.", why:"Q3 to Q1 is the pattern for an odd degree with a positive `a`." },
              { t:"Step 3 is correct as written.", why:"Q2 to Q4 means the arms point in opposite directions, which only happens with an odd degree." }],
            hints:["Check each step against the four end-behaviour patterns.", "Even degree means both arms point the same way. Do the arms point the same way in ‘Q2 to Q4’?", "Step 3 is wrong: Q2 to Q4 means the arms point in opposite directions, which only happens with an odd degree."] },
          { id:"e2", goal:4, task:"Is `y = 3x^5` even, odd, or neither? What symmetry does it have?",
            steps:["Substitute −x: `f(-x) = 3(-x)^5`.", "`(-x)^5 = x^5`, so `f(-x) = 3x^5`.", "So `f(-x) = f(x)`, which means the function is even.", "It has line symmetry about the y-axis."],
            answer:1,
            stepFb:["Step 1 is correct: replacing x with −x is the right first move.", "", "This step follows logically from the one before it. The first mistake happens earlier.", "This step follows logically from the ones before it. The first mistake happens earlier."],
            fixes:[
              { t:"`(-x)^5 = -x^5`, so `f(-x) = -3x^5 = -f(x)`. It’s odd, with point symmetry about the origin.", ok:true, why:"Five negative factors multiply to a negative, so `f(-x) = -f(x)`." },
              { t:"`(-x)^5 = x^5` is right, but it’s odd because 5 is odd.", why:"`(-x)^5` is five negative factors multiplied together, so it’s negative: `-x^5`." },
              { t:"`(-x)^5 = -5x`, so `f(-x) = -15x`.", why:"An exponent isn’t multiplication by 5. `(-x)^5` means (−x)(−x)(−x)(−x)(−x)." },
              { t:"`(-x)^5 = -x^5`, so `f(-x) = -3x^5`, which means it’s even.", why:"The algebra is right this time, but `f(-x) = -f(x)` means odd, not even." }],
            hints:["Try a number: what is (−2)⁵? Is it the same as 2⁵?", "`(-x)^5` is five negative factors multiplied together. Is the result positive or negative?", "Step 2 is wrong: `(-x)^5 = -x^5`, because an odd number of negatives multiply to a negative."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you when you played with the sliders?" },
      { id:"j2", q:"In your own words, why does `y = x^4` have line symmetry about the y-axis?" },
      { id:"j3", q:"Explain to a friend how to figure out the end behaviour of `y = ax^n` without drawing the graph." },
      { id:"j4", q:"What’s one thing you’re still unsure about? What will you do about it?" }
    ]
  },
  final:{
    intro:"This shows what you’ve learned, so there are no hints here. Answer all 10 questions and say how sure you are. Then submit to see your results. Each question is labelled with its achievement chart category.",
    questions:[
      { id:"f1", cat:"K", goal:1,
        a:{ prompt:"What is the degree of `y = -3x^5`?", options:[{ t:"5", ok:true, why:"The degree is the exponent, 5." }, { t:"−3", why:"−3 is the leading coefficient, not the degree." }, { t:"3", why:"The degree is the exponent on x, which is 5." }, { t:"15", why:"Don’t multiply anything. The degree is just the exponent, 5." }] },
        b:{ prompt:"What is the degree of `y = -4x^6`?", options:[{ t:"6", ok:true, why:"The degree is the exponent, 6." }, { t:"−4", why:"−4 is the leading coefficient, not the degree." }, { t:"4", why:"The degree is the exponent on <i>x</i>, which is 6. 4 is the size of the coefficient." }, { t:"24", why:"Don’t multiply anything. The degree is just the exponent, 6." }] } },
      { id:"f2", cat:"K", goal:1,
        a:{ prompt:"Which of these is a power function?", options:[{ t:"`y = 4x^3`", ok:true, why:"One term with a whole-number exponent: a = 4 and n = 3." }, { t:"`y = 3^x`", why:"Here x is in the exponent, so it’s an exponential function." }, { t:"`y = x^2 + 1`", why:"It has two terms, so it’s a polynomial but not a power function." }, { t:"`y = x^{1/3}`", why:"The exponent 1/3 isn’t a whole number." }] },
        b:{ prompt:"Which of these is a power function?", options:[{ t:"`y = -5x^2`", ok:true, why:"One term with a whole-number exponent: `a = -5` and `n = 2`." }, { t:"`y = 2^x`", why:"Here <i>x</i> is in the exponent, so it’s an exponential function." }, { t:"`y = x^3 - x`", why:"It has two terms, so it’s a polynomial but not a power function." }, { t:"`y = 4x^-1`", why:"The exponent −1 isn’t a whole number." }] } },
      { id:"f3", cat:"K", goal:2,
        a:{ prompt:"Which describes the end behaviour of `y = -x^4`?", options:[{ t:"Q3 to Q4 (both arms down)", ok:true, why:"Even degree means the arms point the same way, and a negative `a` points them down." }, { t:"Q2 to Q1 (both arms up)", why:"That’s `y = x^4`. The negative sign flips both arms down." }, { t:"Q2 to Q4", why:"Arms pointing in opposite directions only happens with an odd degree." }, { t:"Q3 to Q1", why:"Arms pointing in opposite directions only happens with an odd degree." }] },
        b:{ prompt:"Which describes the end behaviour of `y = -3x^5`?", options:[{ t:"Q2 to Q4", ok:true, why:"Odd degree means the arms point opposite ways, and a negative `a` sends the right arm down." }, { t:"Q3 to Q1", why:"That’s `y = 3x^5`. The negative sign flips the graph." }, { t:"Q3 to Q4 (both arms down)", why:"Arms pointing the same way only happens with an even degree." }, { t:"Q2 to Q1 (both arms up)", why:"Arms pointing the same way only happens with an even degree." }] } },
      { id:"f4", cat:"T", goal:4,
        a:{ prompt:"A power function has point symmetry about the origin, and its graph goes from Q2 to Q4. Which could it be?", options:[{ t:"`y = -2x^3`", ok:true, why:"Point symmetry means an odd degree, and Q2 to Q4 means `a` is negative." }, { t:"`y = 2x^3`", why:"This one goes from Q3 to Q1, because `a` is positive." }, { t:"`y = -2x^4`", why:"An even degree gives line symmetry about the y-axis, not point symmetry." }, { t:"`y = 2x^4`", why:"An even degree gives line symmetry, and both of its arms point up." }] },
        b:{ prompt:"A power function has line symmetry about the <i>y</i>-axis, and both of its arms point down. Which could it be?", options:[{ t:"`y = -2x^6`", ok:true, why:"Line symmetry means an even degree, and both arms down means `a` is negative." }, { t:"`y = 2x^6`", why:"Both of this one’s arms point up, because `a` is positive." }, { t:"`y = -2x^5`", why:"An odd degree gives point symmetry about the origin, not line symmetry." }, { t:"`y = 2x^5`", why:"An odd degree gives point symmetry, and its arms point opposite ways." }] } },
      { id:"f5", cat:"T", goal:5,
        a:{ prompt:"For values of x between 0 and 1, how do `y = x^6` and `y = x^2` compare?", options:[{ t:"`x^6` is smaller, so its graph is closer to the x-axis", ok:true, why:"Numbers between 0 and 1 shrink with higher powers: 0.5⁶ ≈ 0.016, but 0.5² = 0.25." }, { t:"`x^6` is larger, so its graph is higher", why:"Try x = 0.5: 0.5⁶ ≈ 0.016 and 0.5² = 0.25. The higher power is smaller here." }, { t:"They are equal", why:"They’re only equal at x = 0 and x = 1." }, { t:"`x^6` is negative", why:"An even power is never negative." }] },
        b:{ prompt:"For values of <i>x</i> between 0 and 1, how do `y = x^5` and `y = x^3` compare?", options:[{ t:"`x^5` is smaller, so its graph is closer to the <i>x</i>-axis", ok:true, why:"Numbers between 0 and 1 shrink with higher powers: 0.5⁵ = 0.03125, but 0.5³ = 0.125." }, { t:"`x^5` is larger, so its graph is higher", why:"Try <i>x</i> = 0.5: 0.5⁵ = 0.03125 and 0.5³ = 0.125. The higher power is smaller here." }, { t:"They are equal", why:"They’re only equal at <i>x</i> = 0 and <i>x</i> = 1 (and <i>x</i> = −1)." }, { t:"`x^5` is negative", why:"For <i>x</i> between 0 and 1, every power of <i>x</i> is positive." }] } },
      { id:"f6", cat:"T", goal:4,
        a:{ prompt:"The graph of `y = ax^n` passes through (1, −5) and (−1, −5). What can you conclude?", options:[{ t:"`n` is even and `a = -5`", ok:true, why:"At x = 1, y = a, so a = −5. The same y-value at x = 1 and x = −1 means the graph is symmetric about the y-axis, so n is even." }, { t:"`n` is odd and `a = -5`", why:"For an odd n, the point at x = −1 would be (−1, 5), the opposite of (1, −5)." }, { t:"`n` is even and `a = 5`", why:"Substitute x = 1: y = a(1)ⁿ = a, so a must be −5." }, { t:"`n` is odd and `a = 5`", why:"Substitute x = 1 to find a: y = a, so a = −5. Then the matching y-values tell you n is even." }] },
        b:{ prompt:"The graph of `y = ax^n` passes through (1, 3) and (−1, −3). What can you conclude?", options:[{ t:"`n` is odd and `a = 3`", ok:true, why:"At <i>x</i> = 1, <i>y</i> = <i>a</i>, so <i>a</i> = 3. Opposite <i>y</i>-values at <i>x</i> = 1 and <i>x</i> = −1 mean point symmetry about the origin, so <i>n</i> is odd." }, { t:"`n` is even and `a = 3`", why:"For an even <i>n</i>, the point at <i>x</i> = −1 would be (−1, 3), the same as at <i>x</i> = 1." }, { t:"`n` is odd and `a = -3`", why:"Substitute <i>x</i> = 1: <i>y</i> = <i>a</i>(1)ⁿ = <i>a</i>, so <i>a</i> must be 3." }, { t:"`n` is even and `a = -3`", why:"Substitute <i>x</i> = 1 to find <i>a</i>: <i>y</i> = <i>a</i>, so <i>a</i> = 3. Then the opposite <i>y</i>-values tell you <i>n</i> is odd." }] } },
      { id:"f7", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of why `y = x^3` has no maximum or minimum value?", options:[{ t:"Its left arm goes down forever and its right arm goes up forever, so its range is all real numbers.", ok:true, why:"This explains it fully, using end behaviour and range." }, { t:"Because `x^3` is always positive.", why:"`x^3` is negative when x is negative. For example, (−2)³ = −8." }, { t:"Because odd-degree graphs have exactly one turning point.", why:"`y = x^3` has no turning points. It flattens out at the origin but keeps rising." }, { t:"Because it passes through the origin.", why:"`y = x^2` also passes through the origin, and it has a minimum. That isn’t the reason." }] },
        b:{ prompt:"Which is the best explanation of why `y = x^4` has a minimum value but no maximum value?", options:[{ t:"Both arms go up forever, and the lowest point is (0, 0), so the range is `{y ∈ ℝ | y ≥ 0}`.", ok:true, why:"This explains it fully, using end behaviour and range." }, { t:"Because `x^4` is always positive.", why:"`x^4 = 0` at <i>x</i> = 0, so it isn’t always positive, and being positive alone doesn’t explain why there’s no maximum." }, { t:"Because even-degree graphs have no turning points.", why:"`y = x^4` has a turning point at the origin: that’s its minimum." }, { t:"Because it passes through the origin.", why:"`y = x^3` also passes through the origin, and it has no minimum." }] } },
      { id:"f8", cat:"C", goal:3,
        a:{ prompt:"Which uses correct notation for the range of `y = -2x^8`?", options:[{ t:"`{y ∈ ℝ | y ≤ 0}`", ok:true, why:"Even degree with a negative `a`: the highest point is (0, 0), and every other y-value is below it." }, { t:"`{x ∈ ℝ | x ≤ 0}`", why:"The range is about y-values, so the set should use y." }, { t:"`{y ∈ ℝ | y ≥ -2}`", why:"The −2 is the leading coefficient, not a boundary. The graph keeps going down forever." }, { t:"`{y ∈ ℝ}`", why:"With an even degree and negative `a`, the graph never goes above 0, so not every y-value is reached." }] },
        b:{ prompt:"Which uses correct notation for the range of `y = 5x^6`?", options:[{ t:"`{y ∈ ℝ | y ≥ 0}`", ok:true, why:"Even degree with a positive `a`: the lowest point is (0, 0), and every other <i>y</i>-value is above it." }, { t:"`{x ∈ ℝ | x ≥ 0}`", why:"The range is about <i>y</i>-values, so the set should use <i>y</i>." }, { t:"`{y ∈ ℝ | y ≥ 5}`", why:"The 5 is the leading coefficient, not a boundary. The graph reaches 0 at the origin." }, { t:"`{y ∈ ℝ}`", why:"With an even degree and positive `a`, the graph never goes below 0, so not every <i>y</i>-value is reached." }] } },
      { id:"f9", cat:"A", goal:1,
        a:{ prompt:"The volume of a cube is `V = s^3`. If you double the side length, what happens to the volume?", options:[{ t:"It’s multiplied by 8", ok:true, why:"`(2s)^3 = 2^3s^3 = 8s^3`." }, { t:"It doubles", why:"All three dimensions double, so the volume is multiplied by 2 × 2 × 2." }, { t:"It’s multiplied by 6", why:"That’s 2 × 3. Use exponents instead: `(2s)^3 = 2^3 × s^3`." }, { t:"It’s multiplied by 3", why:"Try it with s = 1 and s = 2: the volumes are 1 and 8." }] },
        b:{ prompt:"The area of a square is `A = s^2`. If you triple the side length, what happens to the area?", options:[{ t:"It’s multiplied by 9", ok:true, why:"`(3s)^2 = 3^2s^2 = 9s^2`." }, { t:"It triples", why:"Both dimensions triple, so the area is multiplied by 3 × 3." }, { t:"It’s multiplied by 6", why:"That’s 3 × 2. Use exponents instead: `(3s)^2 = 3^2 × s^2`." }, { t:"It’s multiplied by 27", why:"That cubes the 3. Area uses `s^2`, so the factor is 3²." }] } },
      { id:"f10", cat:"A", goal:1,
        a:{ prompt:"An object dropped from a cliff falls `d = 4.9t^2` metres in `t` seconds. How far has it fallen after 3 seconds?", options:[{ t:"44.1 m", ok:true, why:"4.9 × 3² = 4.9 × 9 = 44.1." }, { t:"29.4 m", why:"That’s 4.9 × 3 × 2. Square the 3 instead: 3² = 9." }, { t:"14.7 m", why:"That’s 4.9 × 3. You need 3² = 9." }, { t:"216.09 m", why:"You squared the 4.9 as well: (4.9 × 3)². Only t is squared." }] },
        b:{ prompt:"An object dropped from a bridge falls `d = 4.9t^2` metres in `t` seconds. How far has it fallen after 4 seconds?", options:[{ t:"78.4 m", ok:true, why:"4.9 × 4² = 4.9 × 16 = 78.4." }, { t:"39.2 m", why:"That’s 4.9 × 4 × 2. Square the 4 instead: 4² = 16." }, { t:"19.6 m", why:"That’s 4.9 × 4. You need 4² = 16." }, { t:"384.16 m", why:"You squared the 4.9 as well: (4.9 × 4)². Only `t` is squared." }] } }
    ]
  },
  task:{
    title:"Design a function", summary:"Design a function", store:"design",
    statement:"<p>Create a power function whose graph <strong>falls to the left</strong>, <strong>rises to the right</strong>, and <strong>passes through the point (2, 24)</strong>.</p>",
    checks:["It’s a power function (`a ≠ 0`, whole-number `n`)", "Falls to the left", "Rises to the right", "Passes through (2, 24)"],
    explainPrompt:"Explain how you know your function works.",
    vocab:"Use the words degree, leading coefficient and end behaviour.",
    success:"Your function works!"
  },
  cards:[
    ["Power function", "A function of the form `y = ax^n`, where `a` is a real number (not 0) and `n` is a whole number (0, 1, 2, 3, …)."],
    ["Degree and leading coefficient of `y = -4x^5`", "Degree = 5 (the exponent). Leading coefficient = −4 (the number in front)."],
    ["End behaviour", "What the graph does at the far left and far right: as `x → -∞` and as `x → ∞`."],
    ["Even degree, `a > 0`", "Both arms point up: Q2 to Q1. Example: `y = x^2`."],
    ["Even degree, `a < 0`", "Both arms point down: Q3 to Q4. Example: `y = -x^2`."],
    ["Odd degree, `a > 0`", "Starts low, ends high: Q3 to Q1. Example: `y = x^3`."],
    ["Odd degree, `a < 0`", "Starts high, ends low: Q2 to Q4. Example: `y = -x^3`."],
    ["Even function", "`f(-x) = f(x)`. Line symmetry about the y-axis: fold the graph and it lands on itself. Every even-degree power function is even."],
    ["Odd function", "`f(-x) = -f(x)`. Point symmetry about the origin: spin the graph half a turn and it lands on itself. Every odd-degree power function is odd."],
    ["Domain of any power function", "`{x ∈ ℝ}`. You can put in any real number."],
    ["Range of a power function (degree 1 or more)", "Odd degree: `{y ∈ ℝ}`. Even degree: `{y ∈ ℝ | y ≥ 0}` if `a > 0`, or `{y ∈ ℝ | y ≤ 0}` if `a < 0`."],
    ["As the degree increases…", "The graph gets flatter between −1 and 1, and steeper outside that range. With a = 1, every graph passes through (0, 0) and (1, 1)."]
  ],
  // Module 01 predates target challenges (back-port §2), so Explore has none.
  exceptions:{ challenges:"Module 01 has no Explore target challenges (back-port plan §2).", warmupGoals:"Reference warm-up had no goal tags; tags added." }
};
