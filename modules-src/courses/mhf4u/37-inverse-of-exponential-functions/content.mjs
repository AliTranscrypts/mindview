// MHF4U 37 Inverse of Exponential Functions. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/37-inverse-of-exponential-functions.md

// ---------- Practice 1 (sorter): heights on the four log curves, mistake feedback built per item ----------
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; };
const fr = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); n /= g; d /= g; return (n < 0 ? "−" : "") + Math.abs(n) + (d === 1 ? "" : "/" + d); };
// box -> [multiplier of log₂ value as n/d]
const BOXV = { b2:[1, 1], b4:[1, 2], bh:[-1, 1], bq:[-1, 2] };
const BOXSUB = { b2:"2", b4:"4", bh:"1/2", bq:"1/4" };
const REC = { b2:"bh", bh:"b2", b4:"bq", bq:"b4" }, SQ = { b2:"b4", b4:"b2", bh:"bq", bq:"bh" };
const HALF = "Base 4 is 2² (and 1/4 is (1/2)²), so it reaches the same number with half the exponent: `4^{3/2} = 2^3 = 8`.";
// L = log₂ x as [n, d]; xs = x as math source; ys = the point's y as math source
function sortWrong(box, L, xs, ys){
  const w = {};
  for (const b of ["b2", "b4", "bh", "bq"]) {
    if (b === box) continue;
    const v = fr(L[0] * BOXV[b][0], L[1] * BOXV[b][1]);
    const core = "On `y = log_{" + BOXSUB[b] + "} x`, the point with `x = " + xs + "` has height " + v + ", not " + ys + ".";
    if (REC[box] === b) w[b] = "Right size, wrong sign. " + core + " A base and its reciprocal give opposite logs.";
    else if (SQ[box] === b) w[b] = "Right sign, wrong size. " + core + " " + HALF;
    else w[b] = "Check the sign and the size. " + core;
  }
  return w;
}
// a small sketch of y = log_b x for each sorter box: axes, the teal curve, and dots at (1, 0) and (b, 1)
function logIcon(b){
  const X = x => 10 + x * 7, Y = y => 26 - y * 5, pts = [];
  for (let k = 0; k <= 80; k++) { const t = -4.6 + k * 9.2 / 80, x = Math.pow(b, t); if (x <= 8.9) pts.push(X(x).toFixed(1) + " " + Y(t).toFixed(1)); }
  return '<svg width="72" height="50" viewBox="0 0 72 50" aria-hidden="true" style="flex:0 0 auto"><path d="M2 26H71M10 1V49" stroke="currentColor" stroke-width="1" opacity=".55" fill="none"/>' +
    '<path d="M' + pts.join("L") + '" fill="none" stroke="var(--f3)" stroke-width="2.2"/><circle cx="' + X(1) + '" cy="' + Y(0) + '" r="2.4" fill="var(--f3)"/><circle cx="' + X(b) + '" cy="' + Y(1) + '" r="2.4" fill="var(--f3)"/></svg>';
}
const tileT = (shown, spoken) => '<span aria-hidden="true">' + shown + '</span><span class="vh">' + spoken + "</span>";
const sItem = (id, shown, spoken, box, why, L, xs, ys, hints) => ({ id, t:tileT(shown, spoken), answer:box, why, wrong:sortWrong(box, L, xs, ys), hints });
const onLog = sub => " The point is on `y = log_{" + sub + "} x`.";

// ---------- Part 3 Round B: statement-builder items ----------
const HB1 = "Find the base first: it’s the number being raised to a power, or the small number written under “log”. It stays the base.";
const HB2 = "The log’s value is the exponent, and the number inside the log is the result of the power.";
const rb = (id, given, build, form, tiles, answer, roles, view, pts, labels, wrong, note) => ({ id, goal:3, given, build, form, tiles, answer, view, pts, labels, wrong, note,
  hints:[HB1, HB2, "For " + given + ": base " + roles[0] + ", exponent " + roles[1] + ", result " + roles[2] + ", so the other form is " + build + "."] });

export default {
  id:"37-inverse-of-exponential-functions",
  kind:"topic",
  title:"Inverse of exponential functions",
  topic:"Inverse of Exponential Functions",
  readyTopic:"the inverse of exponential functions",
  hero:{
    eq:"`@b{b}^y = x ⟺ y = log_{@b{b}} x`", eqLabel:"b to the power y equals x, which means y equals log base b of x", eqSize:"md",
    headline:"A logarithm is an exponent",
    text:"The exponential function `y = @b{b}^x` takes an exponent and gives a power: `2^3 = 8`. Its <strong>inverse</strong> runs the other way: give it 8 and it gives back 3. To find the inverse, swap `x` and `y` to get `x = @b{b}^y`, then give the exponent `y` a name: `y =` <strong>`log_{@b{b}} x`</strong>, read “log base `@b{b}` of `x`”. On a graph, the inverse is the <strong>reflection</strong> of `y = @b{b}^x` in the line `y = x`.",
    fig:{ aria:"The line y = x, the graph of y = 2 to the x, and its mirror image y = log base 2 of x, with twin points joined across y = x", shape:"square" }
  },
  goals:[
    "I can find the inverse of an exponential function by swapping `x` and `y`, in a table, on a graph and in an equation.",
    "I can explain why the graph of `y = log_{b} x` is the reflection of `y = b^x` in the line `y = x`, and use the reflection to find its key points, asymptote, domain and range.",
    "I can rewrite `b^y = x` as `log_{b} x = y`, and the reverse, including fractional bases and negative or fractional exponents.",
    "I can solve a simple exponential equation by rewriting it in logarithmic form, such as `3^x = 10 ⟹ x = log_{3} 10`, and say which two whole numbers the answer lies between.",
    "I can explain why `log_{b}(b^x) = x` and `b^{log_{b} x} = x`: a function and its inverse undo each other."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Exponent rules", goal:3, prompt:"Evaluate `2^{-3}`.",
          options:[
            { t:"`1/8`", ok:true, why:"A negative exponent means “one over the positive power”: `2^{-3} = 1/2^3 = 1/8`. It’s small, but positive." },
            { t:"`-8`", why:"A negative exponent doesn’t make the number negative. It means “one over”: `2^{-3} = 1/2^3 = 1/8`." },
            { t:"`-6`", why:"That’s 2 × (−3). An exponent counts repeated multiplication, and a negative one means divide: 1/(2 × 2 × 2) = 1/8." },
            { t:"`1/6`", why:"That’s 1/(2 × 3). The exponent 3 means 2 × 2 × 2 = 8, so `2^{-3} = 1/8`." }],
          hints:["A negative exponent means “one over the positive power”.", "`2^{-3} = 1/2^3`.", "`2^3` = 2 × 2 × 2 = 8, so `2^{-3} = 1/8`."] },
        { id:"w2", skill:"Exponent rules", goal:3, prompt:"Evaluate `8^{2/3}`.",
          options:[
            { t:"`4`", ok:true, why:"In a fractional exponent, the bottom is a root and the top is a power: `8^{2/3} = (^{3}√8)^2 = 2^2 = 4`." },
            { t:"`2`", why:"2 is `^{3}√8 = 8^{1/3}`. The 2 on top of the exponent then squares it: `2^2 = 4`." },
            { t:"`16/3`", why:"That’s 8 × 2/3. A fractional exponent is a root and a power, not a product." },
            { t:"`64`", why:"64 is `8^2`. The 3 under the 2 means take the cube root as well: `(^{3}√8)^2 = 4`." }],
          hints:["In `a^{m/n}`, the `n` is a root and the `m` is a power.", "`8^{2/3} = (^{3}√8)^2`.", "`^{3}√8 = 2`, and `2^2 = 4`."] },
        { id:"w3", skill:"Inverse functions", goal:1, prompt:"The point (2, 5) is on the graph of `y = f(x)`. Which point must be on the graph of `y = f^{-1}(x)`?",
          options:[
            { t:"(5, 2)", ok:true, why:"`f` sends 2 to 5, so `f^{-1}` sends 5 back to 2. Every point `(a, b)` on `f` becomes `(b, a)` on `f^{-1}`." },
            { t:"(−2, 5)", why:"(−2, 5) is the reflection in the `y`-axis, which is on `y = f(-x)`. An inverse swaps the coordinates." },
            { t:"(2, 1/5)", why:"(2, 1/5) is on `y = 1/f(x)`. The −1 in `f^{-1}` isn’t an exponent; it means “inverse”." },
            { t:"(−2, −5)", why:"(−2, −5) is a half turn about the origin, on `y = -f(-x)`. The inverse swaps the coordinates instead." }],
          hints:["`f(2) = 5`. What does `f^{-1}` do to 5?", "`f^{-1}` undoes `f`, so `f^{-1}(5) = 2`.", "So (5, 2) is on `y = f^{-1}(x)`: the coordinates swap."] },
        { id:"w4", skill:"Inverse functions", goal:1, prompt:"`f(x) = 3x - 6`. What is `f^{-1}(x)`?",
          options:[
            { t:"`(x + 6)/3`", ok:true, why:"Swap `x` and `y`: `x = 3y - 6`. Solve: `x + 6 = 3y`, so `y = (x + 6)/3`. Check: `f(4) = 6`, and (6 + 6)/3 = 4." },
            { t:"`x/3 + 6`", why:"`f` multiplies by 3, then subtracts 6, so `f^{-1}` must add 6 <strong>first</strong>, then divide by 3. Check: `f(4) = 6`, but 6/3 + 6 = 8, not 4." },
            { t:"`1/(3x - 6)`", why:"That’s `1/f(x)`. Check: `f(4) = 6`, but 1/(3 × 6 − 6) = 1/12, not 4." },
            { t:"`-3x + 6`", why:"That’s `-f(x)`, the reflection in the `x`-axis. Check: `f(4) = 6`, but −3 × 6 + 6 = −12." }],
          hints:["Write `y = 3x - 6`, then swap `x` and `y`.", "`x = 3y - 6`. Now solve for `y`.", "`x + 6 = 3y`, so `y = (x + 6)/3`."] },
        { id:"w5", skill:"One-to-one functions", goal:2, prompt:"For which function is the inverse <strong>not</strong> a function?",
          options:[
            { t:"`y = x^2`", ok:true, why:"`x = 2` and `x = -2` both give 4, so the inverse would have to send 4 back to two different numbers. The graph of `y = x^2` fails the horizontal line test." },
            { t:"`y = 2x + 1`", why:"A slanted line never repeats an output, so it passes the horizontal line test. Its inverse, `y = (x - 1)/2`, is a function." },
            { t:"`y = x^3`", why:"`y = x^3` always increases, so each output comes from exactly one input. Its inverse, `y = ^{3}√x`, is a function." },
            { t:"`y = 2^x`", why:"`y = 2^x` always increases, so no two inputs give the same output. Its inverse is a function, and it’s the subject of this module." }],
          hints:["An inverse is a function only if no two inputs give the same output.", "Look for two different `x`-values with the same `y`-value: the horizontal line test.", "For `y = x^2`, `2^2 = (-2)^2 = 4`. A horizontal line at `y = 4` hits the graph twice, so the inverse isn’t a function."] },
        { id:"w6", skill:"Exponential graphs", goal:2, prompt:"Which statement about the graph of `y = 3^x` is true?",
          options:[
            { t:"It passes through (0, 1) and has the horizontal asymptote `y = 0`.", ok:true, why:"`3^0 = 1`, and as `x` goes to −∞ the values 1/3, 1/9, 1/27, … shrink toward 0 without reaching it." },
            { t:"It passes through (0, 0) and has the horizontal asymptote `y = 0`.", why:"Any non-zero base to the power 0 is 1: `3^0 = 1`. The graph never touches `y = 0`." },
            { t:"It passes through (0, 3) and has the horizontal asymptote `y = 0`.", why:"`3^0` is 1, not 3. It’s `3^1` that equals 3, at the point (1, 3)." },
            { t:"It passes through (0, 1) and has the vertical asymptote `x = 0`.", why:"Near `x = 0` the values of `3^x` stay close to `3^0 = 1`; they don’t shoot off toward ±∞, so `x = 0` isn’t an asymptote. It’s on the far left that the values shrink toward `y = 0`: a horizontal asymptote." }],
          hints:["Find `y` when `x = 0`.", "`3^0 = 1`. Now try `x` = −1, −2, −3: `y` = 1/3, 1/9, 1/27.", "The values shrink toward 0 but never reach it: the asymptote is `y = 0`. So the graph passes through (0, 1) with asymptote `y = 0`."] }
      ],
      refreshers:{
        "Exponent rules":"A negative exponent means “one over”: `b^{-n} = 1/b^n`, so `2^{-3} = 1/8`, which is positive. A fractional exponent is a root and a power: `b^{m/n} = (^{n}√b)^m`, so `8^{2/3} = (^{3}√8)^2 = 4`. And `b^0 = 1` for any `b ≠ 0`.",
        "Inverse functions":"The inverse `f^{-1}` undoes `f`. If `f(2) = 5`, then `f^{-1}(5) = 2`, so every point `(a, b)` on `f` becomes `(b, a)` on `f^{-1}`, and the graph reflects in the line `y = x`. To find the equation, swap `x` and `y` and solve for `y`: `y = 3x - 6 -> x = 3y - 6 -> y = (x + 6)/3`. Careful: `f^{-1}(x)` is not `1/f(x)`.",
        "One-to-one functions":"An inverse is a function only when every output comes from exactly one input. The horizontal line test checks this. `y = x^2` fails, because 2 and −2 both give 4. `y = 2^x` passes, because it always increases.",
        "Exponential graphs":"For `b > 1`, `y = b^x` passes through (0, 1) because `b^0 = 1`. It rises, and on the left it approaches `y = 0` without touching it: the horizontal asymptote is `y = 0`. Domain `{x ∈ ℝ}`, range `{y ∈ ℝ | y > 0}`. For `0 < b < 1`, such as `y = (1/2)^x`, the graph falls instead, with the same point (0, 1) and the same asymptote."
      }
    }
  },
  explore:{
    heading:"The swap machine",
    intro:"Every point on `y = @b{b}^x` has a twin with its coordinates swapped. Swap the table one row at a time, or fold the whole graph across `y = x`, and watch the inverse appear.",
    predictions:[
      { id:"p1", prompt:"The row (3, 8) of `y = 2^x` is about to be swapped. Where will its twin land?",
        options:[{ t:"(8, 3)", ok:true }, { t:"(−3, 8)" }, { t:"(3, 1/8)" }, { t:"(−8, −3)" }],
        explain:"Swapping the coordinates sends (3, 8) to (8, 3). The segment between them crosses `y = x` at a right angle, exactly at its midpoint (5.5, 5.5), so (8, 3) is the mirror image of (3, 8) in `y = x`. The other options are other moves: (−3, 8) is the reflection in the `y`-axis, (3, 1/8) is the reciprocal `1/2^3`, and (−8, −3) is the reflection in the line `y = -x`." },
      { id:"p2", prompt:"On the left, `y = 2^x` gets closer and closer to the line `y = 0`. After the fold across `y = x`, which line will the new graph get closer and closer to?",
        options:[{ t:"The `y`-axis, `x = 0`", ok:true }, { t:"The `x`-axis, `y = 0`" }, { t:"The line `x = 1`" }, { t:"The line `y = x`" }],
        explain:"Every point on the line `y = 0` swaps to a point on `x = 0`. The exponential’s points (−3, 1/8), (−2, 1/4), (−1, 1/2) creep toward `y = 0`; their twins (1/8, −3), (1/4, −2), (1/2, −1) creep toward `x = 0`, heading down. So `y = log_{2} x` has the vertical asymptote `x = 0`: as `x -> 0^{+}`, `y -> -∞`." },
      { id:"p3", prompt:"Now the base will change to `b = 1/2`. The graph of `y = (1/2)^x` falls from left to right. What will its inverse, `y = log_{1/2} x`, do?",
        options:[{ t:"It falls from left to right too", ok:true }, { t:"It rises from left to right" }, { t:"It is the same graph as `y = log_{2} x`" }, { t:"There’s no inverse, because the base is a fraction" }],
        explain:"On `y = (1/2)^x`, bigger `x`-values go with smaller `y`-values. The twins pair the same numbers the other way round, so the inverse falls too. In fact `log_{1/2} x = -log_{2} x` for every `x > 0`: for example, `log_{1/2} 8 = -3`, because `(1/2)^{-3} = 8`." },
      { id:"p4", prompt:"The base will slide down to `b = 1`. What will the inverse become?",
        options:[{ t:"The vertical line `x = 1`, which is not a function", ok:true }, { t:"The horizontal line `y = 1`" }, { t:"The line `y = x`" }, { t:"An ordinary log curve, `y = log_{1} x`" }],
        explain:"`1^x = 1` for every `x`, so `y = 1^x` is the flat line `y = 1`. Swapping gives `x = 1`, a vertical line: at `x = 1` there are infinitely many `y`-values, so it isn’t a function. That’s why a logarithm’s base can’t be 1. A negative base fails too: `(-2)^{1/2}` isn’t a real number, so `y = (-2)^x` doesn’t even make a smooth graph." }
    ],
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"Fold and probe, with `b = 2`. Move `P` so that its twin `P′` is the point on `y = log_{2} x` with `x`-coordinate 1/8. Then read off `log_{2}(1/8)`.",
        why:"`2^{-3} = 1/8`, so `P = (-3, 1/8)`, `P′ = (1/8, -3)` and `log_{2}(1/8) = -3`.",
        hints:["`P′` has `P`’s numbers, swapped. Which point on `y = 2^x` has `y`-coordinate 1/8?", "`2^{-1} = 1/2`, `2^{-2} = 1/4`, …", "`2^{-3} = 1/8`, so `P = (-3, 1/8)`, `P′ = (1/8, -3)` and `log_{2}(1/8) = -3`."] },
      { id:"tc2", goal:[2, 3], prompt:"Choose the base so that the log curve passes through the ringed point (1/16, 2). The ring sits just right of the `y`-axis, where the curves crowd together, so check with numbers, not just your eyes.",
        why:"`(1/4)^2 = 1/16`, so `log_{1/4}(1/16) = 2`: the curve passes through the ring.",
        hints:["Translate: the curve passes through (1/16, 2) means `log_{b}(1/16) = 2`.", "In exponential form, that’s `b^2 = 1/16`.", "`b = 1/4`, because `(1/4)^2 = 1/16`. (−1/4 also squares to 1/16, but a base must be positive.)"] },
      { id:"tc3", goal:[1, 3], stretch:true, prompt:"Commit first. The log curve must pass through the ringed point (8, 3/2). While this challenge is open, the inverse curve is hidden. Set the base, press <strong>Check challenge</strong>, and only then does the curve draw.",
        why:"`4^{3/2} = (√4)^3 = 8`, so `log_{4} 8 = 3/2`: the curve passes through the ring.",
        hints:["Translate `log_{b} 8 = 3/2` into exponential form.", "`b^{3/2} = 8`. Raise both sides to the power 2/3: `b = 8^{2/3}`.", "`8^{2/3} = (^{3}√8)^2 = 2^2 = 4`. Check: `4^{3/2} = (√4)^3 = 8`. So `b = 4`."] }
    ],
    blocks:[{ title:"What the machine shows", html:"<p><strong>The inverse of `y = @b{b}^x`</strong></p><ul><li><strong>Swap:</strong> `x = @b{b}^y`. <strong>Name it:</strong> `y = log_{@b{b}} x`. So `log_{@b{b}} x` is the exponent you put on `@b{b}` to get `x`.</li><li><strong>Picture:</strong> the reflection of `y = @b{b}^x` in `y = x`. The key points `(-1, 1/@b{b})`, (0, 1) and `(1, @b{b})` become `(1/@b{b}, -1)`, (1, 0) and `(@b{b}, 1)`; the asymptote `y = 0` becomes `x = 0`; the domain and range swap.</li><li><strong>Base rules:</strong> `@b{b} > 0` and `@b{b} ≠ 1`.</li></ul>" }]
  },
  part3:{
    slug:"translator", name:"Translator",
    heading:"The form translator: one fact, two ways to write it",
    intro:"Every exponential statement has a logarithmic twin. Move the three pieces (base, exponent and result) into their new places, and see the same fact as two mirrored points.",
    roundA:{ title:"Round A: Watch the tiles", intro:"Press Play or Step. Each fact starts in exponential form; watch where each piece goes.",
      facts:[{ b:"2", e:"3", r:"8", view:[-4, 10] }, { b:"3", e:"−2", r:"1/9", view:[-4, 4] }, { b:"25", e:"1/2", r:"5", view:[-4, 7] }],
      after:"The log’s value is always the exponent." },
    roundB:{ title:"Round B: Translate", intro:"Write each fact in the other form. Tap a tile, then a slot. Press Check when all three tiles are placed.",
      again:"Move the tiles and check again.",
      all:"None of the pieces is in its place. Start with the base: it stays the base.",
      items:[
        rb("r1", "`2^5 = 32`", "`log_{2} 32 = 5`", "log", ["2", "5", "32"], { base:0, exp:1, res:2 }, ["2", "5", "32"], [-4, 34], [[5, 32], [32, 5]], ["2^{5} = 32", "log_{2} 32 = 5"],
          { BR:"`log_{32} 2 = 5` would mean `32^5 = 2`. The base of the power, 2, is also the base of the log.",
            BE:"`log_{5} 32 = 2` would mean `5^2 = 32`, but `5^2 = 25`. The base doesn’t change between the forms: it’s 2 in both.",
            ER:"`log_{2} 5 = 32` would mean `2^{32} = 5`. The log’s value is the exponent, 5; the result, 32, goes inside the log." }),
        rb("r2", "`log_{3} 9 = 2`", "`3^2 = 9`", "exp", ["3", "9", "2"], { base:0, exp:2, res:1 }, ["3", "2", "9"], [-4, 11], [[2, 9], [9, 2]], ["3^{2} = 9", "log_{3} 9 = 2"],
          { BR:"`9^2 = 3` isn’t true: `9^2 = 81`. The base of the log, 3, is also the base of the power.",
            BE:"`2^3 = 9` isn’t true: `2^3 = 8`. The base doesn’t change between the forms: it’s 3 in both.",
            ER:"`3^9 = 2` isn’t true: `3^9` is far bigger than 2. The log’s value, 2, is the exponent; the number inside the log, 9, is the result." }),
        rb("r3", "`10^{-2} = 1/100`", "`log_{10}(1/100) = -2`", "log", ["10", "−2", "1/100"], { base:0, exp:1, res:2 }, ["10", "−2", "1/100"], [-4, 4], [[-2, 0.01], [0.01, -2]], ["10^{−2} = 1/100", "log_{10}(1/100) = −2"],
          { BR:"`log_{1/100} 10 = -2` would mean `(1/100)^{-2} = 10`, but `(1/100)^{-2} = 10 000`. The base of the power, 10, is also the base of the log.",
            BE:"`log_{-2}(1/100) = 10` would mean `(-2)^{10} = 1/100`, but `(-2)^{10} = 1024`. The base doesn’t change between the forms: it’s 10 in both.",
            ER:"`log_{10}(-2) = 1/100` would mean `10^{1/100} = -2`, and a power of 10 is never negative. The log’s value is the exponent, −2; the result, 1/100, goes inside the log." },
          "Both points hug an axis: (−2, 1/100) sits just above the `x`-axis, and (1/100, −2) sits just right of the `y`-axis."),
        rb("r4", "`log_{8} 2 = 1/3`", "`8^{1/3} = 2`", "exp", ["8", "2", "1/3"], { base:0, exp:2, res:1 }, ["8", "1/3", "2"], [-4, 4], [[1 / 3, 2], [2, 1 / 3]], ["8^{1/3} = 2", "log_{8} 2 = 1/3"],
          { BR:"`2^{1/3} = 8` isn’t true: `2^{1/3} = ^{3}√2`, which is less than 2. The base of the log, 8, is also the base of the power.",
            BE:"`(1/3)^8 = 2` isn’t true: `(1/3)^8 = 1/6561`. The base doesn’t change between the forms: it’s 8 in both.",
            ER:"`8^2 = 1/3` isn’t true: `8^2 = 64`. The log’s value, 1/3, is the exponent; the number inside the log, 2, is the result." }),
        rb("r5", "`(1/2)^{-3} = 8`", "`log_{1/2} 8 = -3`", "log", ["1/2", "−3", "8"], { base:0, exp:1, res:2 }, ["1/2", "−3", "8"], [-4, 10], [[-3, 8], [8, -3]], ["(1/2)^{−3} = 8", "log_{1/2} 8 = −3"],
          { BR:"`log_{8}(1/2) = -3` would mean `8^{-3} = 1/2`, but `8^{-3} = 1/512`. The base of the power, 1/2, is also the base of the log.",
            BE:"`log_{-3} 8 = 1/2` would mean `(-3)^{1/2} = 8`, but `(-3)^{1/2}` isn’t a real number. The base doesn’t change between the forms: it’s 1/2 in both.",
            ER:"`log_{1/2}(-3) = 8` would mean `(1/2)^8 = -3`, and a power of 1/2 is never negative. The log’s value is the exponent, −3; the result, 8, goes inside the log." })
      ] },
    roundC:{ title:"Round C: Solve by translating", intro:"Two steps each: choose the translated statement, then the answer. The picture draws after step 2.",
      items:[
        { id:"s1", goal:4, prompt:"Solve `3^x = 10`.", b:3, kind:"expEq", c:10, view:[-4, 11],
          step1:{ q:"Step 1: which statement is the translation?", options:[
            { t:"`x = log_{3} 10`", ok:true, why:"The base of the power, 3, stays the base of the log." },
            { t:"`x = log_{10} 3`", why:"`log_{10} 3` means `10^x = 3`. Your equation has base 3, so the log has base 3." },
            { t:"`x = 10/3`", why:"3 × 10/3 = 10, but 3 to the power 10/3 is about 39. Exponents aren’t undone by dividing." },
            { t:"`x = 10^3`", why:"`10^3 = 1000`. That makes 10 the base." }] },
          step2:{ q:"Step 2: between which two whole numbers is `x`?", options:[
            { t:"2 and 3", ok:true, why:"`3^2 = 9 < 10 < 27 = 3^3`, so `log_{3} 10` is between 2 and 3, just above 2. That’s an exact answer: `log_{3} 10` is a number, and module 38 shows how to pin down its decimals." },
            { t:"1 and 2", why:"`3^1 = 3` and `3^2 = 9` are both less than 10, so `x` is more than 2." },
            { t:"3 and 4", why:"`3^3 = 27` is already more than 10, so `x` is less than 3." },
            { t:"9 and 27", why:"9 and 27 are the powers `3^2` and `3^3`. `x` is the exponent, between 2 and 3." }] },
          hints:["The base of the power stays the base of the log.", "`x = log_{3} 10`. Now compare 10 with the powers `3^1`, `3^2`, `3^3`.", "`3^2 = 9 < 10 < 27 = 3^3`, so `x = log_{3} 10` is between 2 and 3."] },
        { id:"s2", goal:4, prompt:"Solve `log_{x} 9 = 2`.", b:3, kind:"base", view:[-4, 11],
          step1:{ q:"Step 1: which statement is the translation?", options:[
            { t:"`x^2 = 9`", ok:true, why:"In `log_{x} 9 = 2`, the unknown `x` is the base, so `x^2 = 9`." },
            { t:"`2^x = 9`", why:"That makes 2 the base. In `log_{x} 9 = 2`, the base is the unknown `x`." },
            { t:"`9^2 = x`", why:"That makes 9 the base and gives 81." },
            { t:"`x = 9/2`", why:"A log isn’t a division." }] },
          step2:{ q:"Step 2: what is `x`?", options:[
            { t:"`x = 3`", ok:true, why:"`3^2 = 9`, and a base must be positive." },
            { t:"`x = -3`", why:"`(-3)^2 = 9` too, but a log’s base must be positive." },
            { t:"`x = 81`", why:"`81 = 9^2`. That puts 9 in the base." },
            { t:"`x = 9/2`", why:"`(9/2)^2 = 81/4`, not 9." }] },
          hints:["In `log_{x} 9 = 2`, the unknown `x` is the base.", "So `x^2 = 9`.", "`x = 3`, because `3^2 = 9`. (−3 also squares to 9, but a base must be positive.)"] },
        { id:"s3", goal:4, prompt:"Solve `log_{9} x = 3/2`.", b:9, kind:"logEq", c:1.5, view:[-4, 30],
          step1:{ q:"Step 1: which statement is the translation?", options:[
            { t:"`x = 9^{3/2}`", ok:true, why:"The base of the log, 9, is the base of the power, and the log’s value 3/2 is the exponent." },
            { t:"`x = (3/2)^9`", why:"That makes 3/2 the base. The base of the log, 9, is the base of the power." },
            { t:"`9 = x^{3/2}`", why:"That makes `x` the base. In `log_{9} x`, the unknown is the result." },
            { t:"`x = 9 × 3/2`", why:"A log isn’t a product." }] },
          step2:{ q:"Step 2: what is `x`?", options:[
            { t:"`x = 27`", ok:true, why:"`9^{3/2} = (√9)^3 = 3^3 = 27`." },
            { t:"`x = 3`", why:"`3 = √9 = 9^{1/2}`. The 3 on top of the exponent also cubes it: `(√9)^3 = 27`." },
            { t:"`x = 27/2`", why:"27/2 = 9 × 3/2. The 3/2 is an exponent." },
            { t:"`x = 729`", why:"`729 = 9^3`. The 2 under the 3 means a square root as well: `(√9)^3 = 27`." }] },
          hints:["In `log_{9} x = 3/2`, the base is 9 and the log’s value 3/2 is the exponent.", "`x = 9^{3/2} = (√9)^3`.", "`√9 = 3` and `3^3 = 27`, so `x = 27`. Check: `9^{3/2} = 27`."] }
      ] },
    blocks:[{ html:"<details class=\"alg\"><summary>Check it with algebra</summary><p style=\"margin:10px 0 6px\"><strong>What `log_{@b{b}} x` means</strong><br>For `@b{b} > 0` and `@b{b} ≠ 1`: `y = log_{@b{b}} x` means exactly `@b{b}^y = x`.</p><ul><li><strong>Round trip 1:</strong> `log_{@b{b}}(@b{b}^x) = x` for every real `x`, because the exponent on `@b{b}` that gives `@b{b}^x` is `x`. Example: `log_{2}(2^5) = 5`.</li><li><strong>Round trip 2:</strong> `@b{b}^{log_{b} x} = x` for every `x > 0`, because `log_{@b{b}} x` is the exponent that turns `@b{b}` into `x`. Example: `3^{log_{3} 10} = 10`.</li><li>These are `f^{-1}(f(x)) = x` and `f(f^{-1}(x)) = x` for `f(x) = @b{b}^x`: a function and its inverse undo each other. Module 48 shows this for every kind of function.</li><li><strong>Why `x > 0`:</strong> `@b{b}^y` is always positive, so `log_{@b{b}} x` exists only for `x > 0`. `log_{2}(-8)` has no real value.</li><li><strong>Why `@b{b} > 0` and `@b{b} ≠ 1`:</strong> `1^y = 1` for every `y` (the vertical line from P4), and a negative base such as `(-2)^{1/2}` isn’t real.</li></ul></details>" }],
    quickCheck:{
      title:"Translator quick check", summary:"Translator quick check",
      items:[
        { id:"q1", goal:3, prompt:"Which is the exponential form of `log_{10} 0.001 = -3`?",
          choices:[
            { t:"`10^{-3} = 0.001`", ok:true, fb:"Right. The base 10 stays the base, the log’s value −3 is the exponent, and 0.001 is the result." },
            { t:"`(-3)^{10} = 0.001`", fb:"That makes the log’s value the base. `(-3)^{10} = 59 049`." },
            { t:"`0.001^{-3} = 10`", fb:"That swaps the base and the result. `0.001^{-3} = 1 000 000 000`." },
            { t:"`10^{0.001} = -3`", fb:"That swaps the exponent and the result. A power of 10 is never negative." }] },
        { id:"q2", goal:4, prompt:"Solve `7^x = 30` exactly. Which answer is right?",
          choices:[
            { t:"`x = log_{7} 30`, between 1 and 2", ok:true, fb:"Right. In log form, `x = log_{7} 30`. And `7^1 = 7 < 30 < 49 = 7^2`, so `x` is between 1 and 2." },
            { t:"`x = log_{30} 7`, between 0 and 1", fb:"That makes 30 the base: `log_{30} 7` means `30^x = 7`. The base of the power, 7, is the base of the log." },
            { t:"`x = 30/7`, between 4 and 5", fb:"Exponents aren’t undone by dividing. `7^{30/7}` is far more than 30." },
            { t:"`x = log_{7} 30`, between 4 and 5", fb:"The form is right, but the bracket comes from 30 ÷ 7 ≈ 4.3, and a log isn’t a division: `7^4 = 2401`. Compare 30 with `7^1 = 7` and `7^2 = 49`." }] },
        { id:"q3", goal:3, prompt:"`log_{5} x = -2`. What is `x`?",
          choices:[
            { t:"1/25", ok:true, fb:"Right. In exponential form, `x = 5^{-2} = 1/25`." },
            { t:"−25", fb:"A negative exponent doesn’t make a negative number: `5^{-2} = 1/5^2 = 1/25`." },
            { t:"−10", fb:"That’s 5 × (−2). The −2 is an exponent, not a multiplier." },
            { t:"25", fb:"`5^2 = 25`, but the exponent is −2, so take one over: 1/25." }] },
        { id:"q4", goal:5, prompt:"`f(x) = 2^x`, so `f^{-1}(x) = log_{2} x`. What is `f^{-1}(f(6))`?",
          choices:[
            { t:"6", ok:true, fb:"Right. `f` turns 6 into `2^6 = 64`, and `f^{-1}` turns 64 back into `log_{2} 64 = 6`. A function and its inverse undo each other." },
            { t:"64", fb:"64 is `f(6)`. Then `f^{-1}` undoes it: `log_{2} 64 = 6`." },
            { t:"1/64", fb:"`f^{-1}` isn’t `1/f`. It undoes `f`, so it gives back 6." },
            { t:"`log_{2} 6`", fb:"That’s `f^{-1}(6)`. Here `f` acts first, then `f^{-1}` undoes it." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"curves", type:"sorter", title:"Which curve is it on?", summary:"Which curve is it on?", goal:[3, 1, 2], noun:"point",
        instruction:"Sort each point into the box of the log curve it lies on.",
        how:"Tap a point, then tap the box it belongs in. For a mirror image, swap the coordinates first.",
        boxes:[
          { id:"b2", label:"`y = log_{2} x`", icon:logIcon(2) }, { id:"b4", label:"`y = log_{4} x`", icon:logIcon(4) },
          { id:"bh", label:"`y = log_{1/2} x`", icon:logIcon(1 / 2) }, { id:"bq", label:"`y = log_{1/4} x`", icon:logIcon(1 / 4) }],
        items:[
          sItem("i1", "the point `(1/8, -3)`", "the point one eighth, negative 3", "b2", "`2^{-3} = 1/8`, so `log_{2}(1/8) = -3`.", [-3, 1], "1/8", "−3",
            ["Write the point as a statement: which base `b` makes `b^{-3} = 1/8`?", "`b^{-3} = 1/8` means `1/b^3 = 1/8`, so `b^3 = 8`.", "`b = 2`, because `2^{-3} = 1/8`." + onLog("2")]),
          sItem("i2", "the point `(√2, 1/2)`", "the point square root of 2, one half", "b2", "`2^{1/2} = √2`, so `log_{2} √2 = 1/2`.", [1, 2], "√2", "1/2",
            ["Write the point as a statement: which base `b` makes `b^{1/2} = √2`?", "`b^{1/2}` means `√b`. So `√b = √2`.", "`b = 2`, because `2^{1/2} = √2`." + onLog("2")]),
          sItem("i3", "the mirror image of `(6, 64)` in `y = x`", "the mirror image of 6, 64 in the line y equals x", "b2", "The mirror image is (64, 6), and `2^6 = 64`.", [6, 1], "64", "6",
            ["First swap the coordinates: the mirror image is (64, 6). Which base `b` makes `b^6 = 64`?", "64 = 2 × 2 × 2 × 2 × 2 × 2.", "`b = 2`, because `2^6 = 64`." + onLog("2")]),
          sItem("i4", "the point `(2, 1/2)`", "the point 2, one half", "b4", "`4^{1/2} = √4 = 2`, so `log_{4} 2 = 1/2`.", [1, 1], "2", "1/2",
            ["Write the point as a statement: which base `b` makes `b^{1/2} = 2`?", "`b^{1/2}` means `√b`. So `√b = 2`.", "`b = 4`, because `4^{1/2} = √4 = 2`." + onLog("4")]),
          sItem("i5", "the mirror image of `(-3, 1/64)` in `y = x`", "the mirror image of negative 3, one sixty-fourth in the line y equals x", "b4", "The mirror image is (1/64, −3), and `4^{-3} = 1/64`.", [-6, 1], "1/64", "−3",
            ["First swap the coordinates: the mirror image is (1/64, −3). Which base `b` makes `b^{-3} = 1/64`?", "`b^{-3} = 1/64` means `1/b^3 = 1/64`, so `b^3 = 64`.", "`b = 4`, because `4^{-3} = 1/64`." + onLog("4")]),
          sItem("i6", "the point `(1/8, -3/2)`", "the point one eighth, negative three halves", "b4", "`4^{-3/2} = 1/(√4)^3 = 1/2^3 = 1/8`, so `log_{4}(1/8) = -3/2`.", [-3, 1], "1/8", "−3/2",
            ["Write the point as a statement: which base `b` makes `b^{-3/2} = 1/8`?", "`b^{-3/2} = 1/8` means `(√b)^3 = 8`, so `√b = 2`.", "`b = 4`, because `4^{-3/2} = 1/(√4)^3 = 1/8`." + onLog("4")]),
          sItem("i7", "the point `(8, -3)`", "the point 8, negative 3", "bh", "`(1/2)^{-3} = 2^3 = 8`, so `log_{1/2} 8 = -3`.", [3, 1], "8", "−3",
            ["Write the point as a statement: which base `b` makes `b^{-3} = 8`?", "`b^{-3} = 8` means `1/b^3 = 8`, so `b^3 = 1/8`.", "`b = 1/2`, because `(1/2)^{-3} = 2^3 = 8`." + onLog("1/2")]),
          sItem("i8", "the point `(1/4, 2)`", "the point one quarter, 2", "bh", "`(1/2)^2 = 1/4`, so `log_{1/2}(1/4) = 2`.", [-2, 1], "1/4", "2",
            ["Write the point as a statement: which base `b` makes `b^2 = 1/4`?", "`b^2 = 1/4`, and a base must be positive.", "`b = 1/2`, because `(1/2)^2 = 1/4`." + onLog("1/2")]),
          sItem("i9", "the mirror image of `(-5, 32)` in `y = x`", "the mirror image of negative 5, 32 in the line y equals x", "bh", "The mirror image is (32, −5), and `(1/2)^{-5} = 2^5 = 32`.", [5, 1], "32", "−5",
            ["First swap the coordinates: the mirror image is (32, −5). Which base `b` makes `b^{-5} = 32`?", "`b^{-5} = 32` means `1/b^5 = 32`, so `b^5 = 1/32`.", "`b = 1/2`, because `(1/2)^{-5} = 2^5 = 32`." + onLog("1/2")]),
          sItem("i10", "the point `(2, -1/2)`", "the point 2, negative one half", "bq", "`(1/4)^{-1/2} = 4^{1/2} = 2`, so `log_{1/4} 2 = -1/2`.", [1, 1], "2", "−1/2",
            ["Write the point as a statement: which base `b` makes `b^{-1/2} = 2`?", "`b^{-1/2} = 2` means `1/√b = 2`, so `√b = 1/2`.", "`b = 1/4`, because `(1/4)^{-1/2} = 4^{1/2} = 2`." + onLog("1/4")]),
          sItem("i11", "the point `(1/64, 3)`", "the point one sixty-fourth, 3", "bq", "`(1/4)^3 = 1/64`, so `log_{1/4}(1/64) = 3`.", [-6, 1], "1/64", "3",
            ["Write the point as a statement: which base `b` makes `b^3 = 1/64`?", "`b^3 = 1/64`. Which number cubes to 64?", "`b = 1/4`, because `(1/4)^3 = 1/64`." + onLog("1/4")]),
          sItem("i12", "the mirror image of `(-2, 16)` in `y = x`", "the mirror image of negative 2, 16 in the line y equals x", "bq", "The mirror image is (16, −2), and `(1/4)^{-2} = 4^2 = 16`.", [4, 1], "16", "−2",
            ["First swap the coordinates: the mirror image is (16, −2). Which base `b` makes `b^{-2} = 16`?", "`b^{-2} = 16` means `1/b^2 = 16`, so `b^2 = 1/16`.", "`b = 1/4`, because `(1/4)^{-2} = 4^2 = 16`." + onLog("1/4")])
        ] },
      { id:"twins", type:"custom", title:"Translate, solve, work backwards", summary:"Translate, solve, work backwards", star:true, goal:[3, 4, 1, 5],
        instruction:"Find each value. Type a whole number or a fraction, such as −5 or 2/7, then press Check.",
        how:"Fractions go in as top/bottom. After each check, the mini-graph shows the twin points your answer makes.",
        fallback:"Not this one. Write the statement in the other form, then check your answer by putting it back in.",
        items:[
          { id:"n1", goal:4, prompt:"Solve `(1/5)^x = 40`. `x` lies between two whole numbers next to each other. Type the smaller one, then the larger one.",
            boxes:[{ id:"lo", label:"Smaller" }, { id:"hi", label:"Larger" }], answer:{ lo:-3, hi:-2 },
            right:"✓ Correct. `x = log_{1/5} 40`. `(1/5)^{-2} = 25 < 40 < 125 = (1/5)^{-3}`, so `x` is between −3 and −2.",
            wrong:[{ match:{ lo:2, hi:3 }, fb:"`(1/5)^2 = 1/25` and `(1/5)^3 = 1/125` are both less than 1. To make 40 from a base below 1, the exponent must be negative." },
              { match:{ lo:-2, hi:-1 }, fb:"`(1/5)^{-2} = 5^2 = 25` is still less than 40. Should `x` be above or below −2?" },
              { match:{ lo:25, hi:125 }, fb:"25 and 125 are the powers `5^2` and `5^3`. `x` is the exponent." },
              { match:{ lo:200, hi:201 }, fb:"That’s 40 ÷ 1/5. Exponents aren’t undone by dividing." }],
            hints:["Write it in log form, then compare 40 with powers of 1/5.", "`(1/5)^x = 5^{-x}`. Which powers of 5 sit just below and just above 40?", "`5^2 = 25 < 40 < 125 = 5^3`, so `-x` is between 2 and 3, and `x = log_{1/5} 40` is between −3 and −2."] },
          { id:"n2", goal:3, prompt:"`log_{3} x = -4`. Find `x`.", boxes:[{ id:"v", label:"`x =`" }], answer:{ v:1 / 81 }, display:"`x = 1/81`",
            wrong:[{ match:{ v:-81 }, fb:"A negative exponent doesn’t make a negative number. What does a negative exponent mean?" },
              { match:{ v:-12 }, fb:"That’s 3 × (−4). The −4 is an exponent." },
              { match:{ v:81 }, fb:"`3^4 = 81`, but the exponent is −4." }],
            hints:["Write it in exponential form.", "`x = 3^{-4}`. A negative exponent means “one over”.", "`x = 3^{-4} = 1/3^4 = 1/81`. Check: `log_{3}(1/81) = -4`, because `3^{-4} = 1/81`."] },
          { id:"n3", goal:3, prompt:"`log_{b} 32 = 5/2`. Find `b`.", boxes:[{ id:"v", label:"`b =`" }], answer:{ v:4 }, display:"`b = 4`",
            wrong:[{ match:{ v:2 }, fb:"`2^5 = 32` uses the exponent 5, not 5/2." },
              { match:{ v:64 / 5 }, fb:"That’s 32 ÷ 5/2. Dividing doesn’t undo an exponent." },
              { match:{ v:80 }, fb:"That’s 32 × 5/2." }],
            hints:["Write it in exponential form.", "`b^{5/2} = 32`. Raise both sides to the power 2/5.", "`b = 32^{2/5} = (^{5}√32)^2 = 2^2 = 4`. Check: `4^{5/2} = (√4)^5 = 32`."] },
          { id:"n4", goal:[1, 3], prompt:"The graph of `y = b^x` passes through (3, 1/27). Its inverse passes through `(k, -2)`. Find `k`.", boxes:[{ id:"v", label:"`k =`" }], answer:{ v:9 }, display:"`k = 9`",
            wrong:[{ match:{ v:1 / 9 }, fb:"1/9 is `(1/3)^2` or `3^{-2}`. Check both steps: which `b` makes `b^3 = 1/27`? Then the inverse’s point `(k, -2)` means `k` = `b` to the power −2, not 2." },
              { match:{ v:-9 }, fb:"A negative exponent doesn’t make `k` negative." }],
            hints:["First find the base: which `b` makes `b^3 = 1/27`?", "`b = 1/3`, because `(1/3)^3 = 1/27`. The inverse is `y = log_{1/3} x`, so `(k, -2)` means `k = (1/3)^{-2}`.", "`k = (1/3)^{-2} = 3^2 = 9`. Check: (−2, 9) is on `y = (1/3)^x`, and its twin is (9, −2)."] },
          { id:"n5", goal:3, prompt:"`log_{2}(log_{4} x) = -1`. Find `x`.", boxes:[{ id:"v", label:"`x =`" }], answer:{ v:2 }, display:"`x = 2`",
            wrong:[{ match:{ v:0.5 }, fb:"1/2 is the value of `log_{4} x`, not `x`. Translate once more." },
              { match:{ v:1 / 16 }, fb:"`log_{2} u = -1` means `u = 2^{-1}`, not −2. Redo the inside step." }],
            hints:["Work from the outside in. Call the inside `u = log_{4} x`, so `log_{2} u = -1`.", "`log_{2} u = -1` means `u = 2^{-1} = 1/2`. So `log_{4} x = 1/2`.", "`x = 4^{1/2} = 2`. Check: `log_{4} 2 = 1/2`, and `log_{2}(1/2) = -1`."] },
          { id:"n6", goal:[1, 5], prompt:"`f(x) = 2^x + 3`. Find `k` so that `f^{-1}(k) = 5`.", boxes:[{ id:"v", label:"`k =`" }], answer:{ v:35 },
            right:"✓ Correct. `f^{-1}(k) = 5` means `(k, 5)` is on `f^{-1}`, so its twin `(5, k)` is on `f`: `k = f(5) = 2^5 + 3 = 35`.",
            wrong:[{ match:{ v:32 }, fb:"`2^5 = 32`, but `f` also adds 3." },
              { match:{ v:29 }, fb:"`f` adds 3; it doesn’t subtract it." },
              { match:{ v:13 }, fb:"That’s 2 × 5 + 3. `2^x` is a power, not 2 times `x`." }],
            hints:["`f^{-1}(k) = 5` means `f(5) = k`: the twin of `(k, 5)` is `(5, k)`.", "So `k = f(5) = 2^5 + 3`.", "`k` = 32 + 3 = 35. Check: `f(5) = 35`, so `f^{-1}(35) = 5`."] },
          { id:"n7", goal:[1, 5], prompt:"`f(x) = 2^x - 3`. Find `f^{-1}(61)`.", boxes:[{ id:"v", label:"`f^{-1}(61) =`" }], answer:{ v:6 }, display:"`f^{-1}(61) = 6`",
            wrong:[{ match:{ v:64 }, fb:"`2^x = 64` is right, but the answer is the exponent `x`." },
              { match:{ v:32 }, fb:"That’s 64 ÷ 2. The answer is the exponent that turns 2 into 64." }],
            hints:["`f^{-1}(61)` is the `x` that makes `f(x) = 61`.", "`2^x - 3 = 61`, so `2^x = 64`.", "`2^6 = 64`, so `x = 6` and `f^{-1}(61) = 6`. Check: `f(6)` = 64 − 3 = 61."] },
          { id:"n8", goal:1, prompt:"The graphs of `y = (1/16)^x` and its inverse `y = log_{1/16} x` both pass through (1/4, 1/2), which is <strong>not</strong> on the line `y = x`. Find another point on <strong>both</strong> graphs that is not on `y = x`.",
            boxes:[{ id:"x", label:"`x`" }, { id:"y", label:"`y`" }], point:true, answer:{ x:0.5, y:0.25 },
            right:"✓ Correct. `(1/16)^{1/2} = 1/4`, and `log_{1/16}(1/2) = 1/4` because `(1/16)^{1/4} = 1/2`. Reflecting in `y = x` swaps the two graphs, so the mirror image of a shared point is also shared. These two graphs meet three times: at (1/4, 1/2), at (1/2, 1/4), and once on `y = x`, near (0.36, 0.36). A falling exponential can meet its inverse away from `y = x`; a rising one can’t.",
            wrong:[{ match:{ x:0.25, y:0.5 }, fb:"That’s the point you were given." },
              { match:{ x:0.5, y:0.5 }, fb:"(1/2, 1/2) is on the line `y = x`, which the question rules out. Test your point in `y = (1/16)^x` before you check." },
              { match:{ x:-0.25, y:-0.5 }, fb:"That’s a half turn about the origin, not a reflection in `y = x`. `(1/16)^{-1/4} = 2`." }],
            hints:["Reflecting in `y = x` sends `y = (1/16)^x` onto its inverse, and the inverse back onto `y = (1/16)^x`. What does it do to a point that’s on both?", "The mirror image of (1/4, 1/2) is (1/2, 1/4). Test it on `y = (1/16)^x`.", "`(1/16)^{1/2} = 1/4`, and `log_{1/16}(1/2) = 1/4` because `(1/16)^{1/4} = 1/2`. So (1/2, 1/4) is on both graphs."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Maya", how:"",
        instruction:"Maya made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Find the inverse of `y = 3^x`, then find the point on the inverse with `x = 9`.",
            steps:["Swap `x` and `y`: `x = 3^y`.", "In `x = 3^y`, the base is 3, the exponent is `y` and the result is `x`.", "In log form: `y = log_{x} 3`.", "At `x = 9`: `y = log_{9} 3 = 1/2`, because `9^{1/2} = 3`. So the point is (9, 1/2)."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: Maya named the pieces properly. Keep checking.", "", "Step 4 evaluates step 3’s equation correctly. The mistake is earlier."],
            fixes:[
              { t:"The base stays the base: `y = log_{3} x`. At `x = 9`, `y = log_{3} 9 = 2`, so the point is (9, 2).", ok:true, why:"Check: (2, 9) is on `y = 3^x`, and its twin is (9, 2)." },
              { t:"The inverse is `y = 1/3^x`, so at `x = 9`, `y = 1/3^9`.", why:"`1/3^x` is the reciprocal, not the inverse. The inverse undoes `3^x`." },
              { t:"`y = log_{3} x`, so at `x = 9`, `y = 3^9`.", why:"The equation is right now, but `log_{3} 9` asks “what exponent on 3 gives 9?”. The answer is 2, not `3^9`." },
              { t:"Step 3 is correct as written.", why:"`log_{x} 3` makes `x` the base. In `x = 3^y` the base is 3, so the log must be `log_{3} x`." }],
            hints:["In step 2, Maya named the base. Is it still the base in step 3?", "`x = 3^y` has base 3, so the log form is `y = log_{3} x`.", "Step 3 is wrong. The inverse is `y = log_{3} x`, and at `x = 9`, `y = log_{3} 9 = 2`: the point (9, 2)."] },
          { id:"e2", goal:1, task:"Find `f^{-1}(x)` for `f(x) = 2^x - 3`, then find `f^{-1}(5)`.",
            steps:["Write `y = 2^x - 3` and swap `x` and `y`: `x = 2^y - 3`.", "Write this in log form: `y = log_{2} x - 3`.", "So `f^{-1}(x) = log_{2} x - 3`.", "`f^{-1}(5) = log_{2} 5 - 3`."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 copies step 2. The mistake is earlier.", "Step 4 uses step 3’s formula correctly. The mistake is earlier."],
            fixes:[
              { t:"First isolate the power: `2^y = x + 3`. Then `y = log_{2}(x + 3)`, and `f^{-1}(5) = log_{2} 8 = 3`.", ok:true, why:"Check: `f(3) = 2^3 - 3 = 5`, so `f^{-1}(5) = 3`." },
              { t:"First isolate the power: `2^y = x - 3`, so `y = log_{2}(x - 3)`.", why:"To undo “− 3”, add 3 to both sides: `2^y = x + 3`." },
              { t:"Translate first, then move the 3 across: `y = log_{2} x + 3`.", why:"Only `b^y = (something)` can be rewritten as a log, so the 3 must move <strong>before</strong> you translate, and it ends up inside the log." },
              { t:"Step 2 is correct as written.", why:"Check: `f(3) = 5`, so `f^{-1}(5)` should be 3. But `log_{2} 5 - 3` is negative, because `log_{2} 5` is less than 3 (`2^3 = 8 > 5`)." }],
            hints:["Before you rewrite a statement as a log, what must it look like?", "It must be `b^y = (something)`. From `x = 2^y - 3`, first add 3 to both sides.", "Step 2 is wrong. `2^y = x + 3`, so `f^{-1}(x) = log_{2}(x + 3)` and `f^{-1}(5) = log_{2} 8 = 3`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you when you swapped the table or folded the graph in Explore?" },
      { id:"j2", q:"In your own words, what does `log_{2} 8 = 3` mean? Use the word exponent." },
      { id:"j3", q:"Explain to a friend how to solve `5^x = 40` by rewriting it in log form, and how to tell which two whole numbers the answer lies between." },
      { id:"j4", q:"Which still trips you up: putting the pieces in the right places when you convert, or picturing the reflection? What will you do about it before module 38?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:3,
        a:{ prompt:"Which is the logarithmic form of `3^4 = 81`?", options:[
          { t:"`log_{3} 81 = 4`", ok:true, why:"The base stays the base (3), the exponent (4) becomes the value of the log, and the result (81) goes inside the log." },
          { t:"`log_{4} 81 = 3`", why:"That makes the exponent the base. It would mean `4^3 = 81`, but `4^3 = 64`." },
          { t:"`log_{81} 3 = 4`", why:"That swaps the base and the result. It would mean `81^4 = 3`." },
          { t:"`log_{3} 4 = 81`", why:"That swaps the exponent and the result. It would mean `3^{81} = 4`." }] },
        b:{ prompt:"Which is the logarithmic form of `4^3 = 64`?", options:[
          { t:"`log_{4} 64 = 3`", ok:true, why:"The base stays the base (4), the exponent (3) becomes the value of the log, and the result (64) goes inside the log." },
          { t:"`log_{3} 64 = 4`", why:"That makes the exponent the base. It would mean `3^4 = 64`, but `3^4 = 81`." },
          { t:"`log_{64} 4 = 3`", why:"That swaps the base and the result. It would mean `64^3 = 4`." },
          { t:"`log_{4} 3 = 64`", why:"That swaps the exponent and the result. It would mean `4^{64} = 3`." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"The point (2, 9) is on the graph of `y = 3^x`. Which point is on the graph of its inverse?", options:[
          { t:"(9, 2)", ok:true, why:"The inverse swaps the coordinates: `log_{3} 9 = 2`." },
          { t:"(−2, 9)", why:"That’s the reflection in the `y`-axis. It’s on `y = 3^{-x} = (1/3)^x`, not on the inverse." },
          { t:"(2, 1/9)", why:"That’s on the reciprocal `y = 1/3^x`. The inverse swaps the coordinates instead." },
          { t:"(2, −9)", why:"That’s the reflection in the `x`-axis, on `y = -3^x`." }] },
        b:{ prompt:"The point (−1, 1/5) is on the graph of `y = 5^x`. Which point is on the graph of its inverse?", options:[
          { t:"(1/5, −1)", ok:true, why:"Swap the coordinates: `log_{5}(1/5) = -1`." },
          { t:"(1, 1/5)", why:"That’s the reflection in the `y`-axis, on `y = (1/5)^x`." },
          { t:"(−1, 5)", why:"That’s on the reciprocal `y = 1/5^x`." },
          { t:"(−1, −1/5)", why:"That’s the reflection in the `x`-axis, on `y = -5^x`." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"What is the value of `7^{log_{7} 5}`?", options:[
          { t:"5", ok:true, why:"`log_{7} 5` is the exponent that turns 7 into 5, so putting it on 7 gives 5: `b^{log_{b} x} = x`. You never need the value of `log_{7} 5` itself." },
          { t:"7", why:"7 is the base. The power gives back the number inside the log, 5." },
          { t:"35", why:"That’s 7 × 5. The log and the power undo each other." },
          { t:"`7^5`", why:"That ignores the log. The exponent is `log_{7} 5`, not 5." }] },
        b:{ prompt:"What is the value of `4^{log_{4} 9}`?", options:[
          { t:"9", ok:true, why:"`log_{4} 9` is the exponent that turns 4 into 9, so putting it on 4 gives 9: `b^{log_{b} x} = x`." },
          { t:"4", why:"4 is the base. The power gives back the number inside the log, 9." },
          { t:"36", why:"That’s 4 × 9. The log and the power undo each other." },
          { t:"`4^9`", why:"That ignores the log. The exponent is `log_{4} 9`, not 9." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Solve `log_{x} 16 = -2`.", options:[
          { t:"`x = 1/4`", ok:true, why:"In exponential form, `x^{-2} = 16`, so `1/x^2 = 16` and `x^2 = 1/16`. A base must be positive, so `x = 1/4`. Check: `(1/4)^{-2} = 4^2 = 16`." },
          { t:"`x = 4`", why:"`4^{-2} = 1/16`, not 16. A negative exponent turns a whole-number base into a fraction, so to get 16 the base must be a fraction." },
          { t:"`x = -4`", why:"A log’s base must be positive. And `(-4)^{-2} = 1/16`, not 16." },
          { t:"`x = -8`", why:"That’s 16 ÷ (−2). A log isn’t a division." }] },
        b:{ prompt:"Solve `log_{x} 81 = -4`.", options:[
          { t:"`x = 1/3`", ok:true, why:"In exponential form, `x^{-4} = 81`, so `1/x^4 = 81` and `x^4 = 1/81`. A base must be positive, so `x = 1/3`. Check: `(1/3)^{-4} = 3^4 = 81`." },
          { t:"`x = 3`", why:"`3^{-4} = 1/81`, not 81. To get 81 with a negative exponent, the base must be a fraction." },
          { t:"`x = -3`", why:"A log’s base must be positive. And `(-3)^{-4} = 1/81`, not 81." },
          { t:"`x = -81/4`", why:"That’s 81 ÷ (−4). A log isn’t a division." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Solve `(1/2)^x = 20`. Between which two whole numbers is the exact solution?", options:[
          { t:"−5 and −4", ok:true, why:"In log form, `x = log_{1/2} 20`. `(1/2)^x = 2^{-x}`, and `2^4 = 16 < 20 < 32 = 2^5`, so `-x` is between 4 and 5 and `x` is between −5 and −4." },
          { t:"−4 and −3", why:"`(1/2)^{-3} = 8` and `(1/2)^{-4} = 16` are both less than 20, so `x` is below −4. A number such as −4.3 lies between −5 and −4." },
          { t:"4 and 5", why:"`(1/2)^4 = 1/16`, far below 20. A base below 1 needs a negative exponent to make a number bigger than 1." },
          { t:"40 and 41", why:"That’s 20 ÷ 1/2 = 40. Exponents aren’t undone by dividing." }] },
        b:{ prompt:"Solve `(1/3)^x = 50`. Between which two whole numbers is the exact solution?", options:[
          { t:"−4 and −3", ok:true, why:"`x = log_{1/3} 50`. `(1/3)^x = 3^{-x}`, and `3^3 = 27 < 50 < 81 = 3^4`, so `-x` is between 3 and 4 and `x` is between −4 and −3." },
          { t:"−3 and −2", why:"`(1/3)^{-2} = 9` and `(1/3)^{-3} = 27` are both less than 50, so `x` is below −3. A number such as −3.6 lies between −4 and −3." },
          { t:"3 and 4", why:"`(1/3)^3 = 1/27`, far below 50. A base below 1 needs a negative exponent to make a number bigger than 1." },
          { t:"150 and 151", why:"That’s 50 ÷ 1/3 = 150. Exponents aren’t undone by dividing." }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"The graph of `y = 2^x + 3` has the horizontal asymptote `y = 3` and passes through (0, 4). Which describes the graph of its inverse?", options:[
          { t:"Vertical asymptote `x = 3`; it passes through (4, 0)", ok:true, why:"Reflecting in `y = x` swaps everything: the line `y = 3` becomes `x = 3`, and (0, 4) becomes (4, 0). (The inverse is `y = log_{2}(x - 3)`, and `log_{2} 1 = 0`.)" },
          { t:"Vertical asymptote `x = 3`; it passes through (0, 4)", why:"The asymptote swapped, but the point didn’t. (0, 4) becomes (4, 0)." },
          { t:"Horizontal asymptote `y = 3`; it passes through (4, 0)", why:"The point swapped, but the asymptote didn’t. The horizontal line `y = 3` becomes the vertical line `x = 3`." },
          { t:"Vertical asymptote `x = -3`; it passes through (4, 0)", why:"Swapping `y = 3` gives `x = 3`. A sign change would come from a reflection in an axis, not in `y = x`." }] },
        b:{ prompt:"The graph of `y = 3^x - 2` has the horizontal asymptote `y = -2` and passes through (0, −1). Which describes the graph of its inverse?", options:[
          { t:"Vertical asymptote `x = -2`; it passes through (−1, 0)", ok:true, why:"`y = -2` becomes `x = -2`, and (0, −1) becomes (−1, 0). (The inverse is `y = log_{3}(x + 2)`, and `log_{3} 1 = 0`.)" },
          { t:"Vertical asymptote `x = -2`; it passes through (0, −1)", why:"The point didn’t swap." },
          { t:"Horizontal asymptote `y = -2`; it passes through (−1, 0)", why:"The asymptote didn’t swap." },
          { t:"Vertical asymptote `x = 2`; it passes through (−1, 0)", why:"Swapping `y = -2` gives `x = -2`; the sign stays." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why the graph of `y = log_{3} x` is the reflection of the graph of `y = 3^x` in the line `y = x`?", options:[
          { t:"`y = log_{3} x` is the inverse of `y = 3^x`, so each point `(p, q)` becomes `(q, p)`, and swapping the coordinates of every point reflects a graph in `y = x`.", ok:true, why:"This links the inverse, the swap and the reflection, and it works for every point." },
          { t:"`y = log_{3} x` is the reciprocal of `y = 3^x`, so each height `q` becomes `1/q`, and taking one over every height reflects a graph in `y = x`.", why:"`log_{3} x` isn’t `1/3^x`: at `x = 1`, `log_{3} 1 = 0` but `1/3^1 = 1/3`. And taking one over the heights doesn’t reflect a graph in `y = x`." },
          { t:"`y = log_{3} x` is `y = 3^x` with `x` replaced by `-x`, so each point `(p, q)` becomes `(-p, q)`, and that change reflects a graph in `y = x`.", why:"Replacing `x` with `-x` reflects in the `y`-axis, and it gives `y = (1/3)^x`, a different exponential." },
          { t:"Both graphs pass through the point (1, 1), which is on `y = x`, and two graphs that share a point on `y = x` are reflections of each other in it.", why:"Neither graph passes through (1, 1): `3^1 = 3` and `log_{3} 1 = 0`. And sharing one point wouldn’t prove a reflection anyway." }] },
        b:{ prompt:"Which is the best explanation of why the graph of `y = log_{1/2} x` is the reflection of the graph of `y = (1/2)^x` in the line `y = x`?", options:[
          { t:"`y = log_{1/2} x` is the inverse of `y = (1/2)^x`, so each point `(p, q)` becomes `(q, p)`, and swapping the coordinates of every point reflects a graph in `y = x`.", ok:true, why:"This links the inverse, the swap and the reflection, and it works for every point, whether the base is above or below 1." },
          { t:"`y = log_{1/2} x` is the reciprocal of `y = (1/2)^x`, so each height `q` becomes `1/q`, and taking one over every height reflects a graph in `y = x`.", why:"The reciprocal of `(1/2)^x` is `2^x`, not `log_{1/2} x`: at `x = 1`, `log_{1/2} 1 = 0` but `2^1 = 2`. And taking one over the heights doesn’t reflect a graph in `y = x`." },
          { t:"`y = log_{1/2} x` is `y = (1/2)^x` with `x` replaced by `-x`, so each point `(p, q)` becomes `(-p, q)`, and that change reflects a graph in `y = x`.", why:"Replacing `x` with `-x` reflects in the `y`-axis, and it gives `y = 2^x`, a different exponential." },
          { t:"Both graphs pass through the point (1, 1), which is on `y = x`, and two graphs that share a point on `y = x` are reflections of each other in it.", why:"Neither graph passes through (1, 1): `(1/2)^1 = 1/2` and `log_{1/2} 1 = 0`. And sharing one point wouldn’t prove a reflection anyway." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which statement is written correctly and is true?", options:[
          { t:"`log_{16} 4 = 1/2`, because `16^{1/2} = 4`", ok:true, why:"The base 16 is the subscript, 4 is inside the log, and the value 1/2 is the exponent." },
          { t:"`log_{4} 16 = 1/2`, because `16^{1/2} = 4`", why:"`log_{4} 16 = 2`, since `4^2 = 16`. The base of the power, 16, must be the base of the log." },
          { t:"`log_{16} = 1/2`, because `16^{1/2} = 4`", why:"`log_{16}` needs an input: `log_{16} 4`. On its own, “`log_{16}`” isn’t a number." },
          { t:"`log_{16}(1/2) = 4`, because `16^{1/2} = 4`", why:"The log’s value is the exponent, 1/2, and the result, 4, goes inside: `log_{16} 4 = 1/2`." }] },
        b:{ prompt:"Which statement is written correctly and is true?", options:[
          { t:"`log_{9} 3 = 1/2`, because `9^{1/2} = 3`", ok:true, why:"The base 9 is the subscript, 3 is inside the log, and the value 1/2 is the exponent." },
          { t:"`log_{3} 9 = 1/2`, because `9^{1/2} = 3`", why:"`log_{3} 9 = 2`, since `3^2 = 9`. The base of the power, 9, must be the base of the log." },
          { t:"`log_{9} = 1/2`, because `9^{1/2} = 3`", why:"`log_{9}` needs an input: `log_{9} 3`. On its own, “`log_{9}`” isn’t a number." },
          { t:"`log_{9}(1/2) = 3`, because `9^{1/2} = 3`", why:"The log’s value is the exponent, 1/2, and the result, 3, goes inside: `log_{9} 3 = 1/2`." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A lab culture triples every hour, so after `t` hours there are `N = 3^t` thousand cells. Which equation gives `t` in terms of `N`, and when does the culture reach 243 thousand cells?", options:[
          { t:"`t = log_{3} N`; after 5 hours", ok:true, why:"Rewrite `N = 3^t` in log form: `t = log_{3} N`. Then `t = log_{3} 243 = 5`, because `3^5 = 243`." },
          { t:"`t = log_{N} 3`; after 1/5 of an hour", why:"That swaps the base and the input. `log_{243} 3 = 1/5` is true (`243^{1/5} = 3`), but it answers a different question." },
          { t:"`t = N/3`; after 81 hours", why:"Tripling every hour isn’t dividing by 3. After 81 hours the culture would be unimaginably large." },
          { t:"`t = log_{3} N`; after 81 hours", why:"The equation is right, but `log_{3} 243` isn’t 243 ÷ 3. `3^5 = 243`, so `t = 5`." }] },
        b:{ prompt:"The number of people who have seen a video quadruples every day, so after `d` days `N = 4^d` hundred people have seen it. Which equation gives `d` in terms of `N`, and when does `N` reach 1024 hundred?", options:[
          { t:"`d = log_{4} N`; after 5 days", ok:true, why:"`d = log_{4} N`, and `log_{4} 1024 = 5` because `4^5 = 1024`." },
          { t:"`d = log_{N} 4`; after 1/5 of a day", why:"That swaps the base and the input. `log_{1024} 4 = 1/5` answers a different question." },
          { t:"`d = N/4`; after 256 days", why:"Quadrupling every day isn’t dividing by 4." },
          { t:"`d = log_{4} N`; after 256 days", why:"The equation is right, but `log_{4} 1024` isn’t 1024 ÷ 4. `4^5 = 1024`, so `d = 5`." }] } },
      { id:"a2", cat:"A", goal:1,
        a:{ prompt:"`f(x) = 3 · 2^x`. Which is the equation of `f^{-1}(x)`?", options:[
          { t:"`f^{-1}(x) = log_{2}(x/3)`", ok:true, why:"Swap: `x = 3 · 2^y`. Isolate the power: `2^y = x/3`. Rewrite: `y = log_{2}(x/3)`. Check: `f(2) = 12`, and `log_{2}(12/3) = log_{2} 4 = 2`." },
          { t:"`f^{-1}(x) = log_{6} x`", why:"`3 · 2^x` isn’t `6^x`: only the 2 is raised to the power. Check: `f(2) = 12`, but `log_{6} 12` isn’t 2, since `6^2 = 36`." },
          { t:"`f^{-1}(x) = (1/3) log_{2} x`", why:"The 3 has to be undone <strong>before</strong> you rewrite, so it divides `x` inside the log. Check: `f(2) = 12`, but `(1/3) log_{2} 12` is less than 4/3, because `log_{2} 12 < log_{2} 16 = 4`." },
          { t:"`f^{-1}(x) = log_{2} x - 3`", why:"Subtracting 3 doesn’t undo multiplying by 3. Check: `f(2) = 12`, but `log_{2} 12 - 3` is less than 1." }] },
        b:{ prompt:"`f(x) = 5 · 3^x`. Which is the equation of `f^{-1}(x)`?", options:[
          { t:"`f^{-1}(x) = log_{3}(x/5)`", ok:true, why:"Swap: `x = 5 · 3^y`. Isolate: `3^y = x/5`. Rewrite: `y = log_{3}(x/5)`. Check: `f(2) = 45`, and `log_{3}(45/5) = log_{3} 9 = 2`." },
          { t:"`f^{-1}(x) = log_{15} x`", why:"`5 · 3^x` isn’t `15^x`. Check: `f(2) = 45`, but `15^2 = 225`." },
          { t:"`f^{-1}(x) = (1/5) log_{3} x`", why:"Undo the 5 before you rewrite. Check: `f(2) = 45`, but `(1/5) log_{3} 45` is less than 4/5, because `log_{3} 45 < log_{3} 81 = 4`." },
          { t:"`f^{-1}(x) = log_{3} x - 5`", why:"Subtracting 5 doesn’t undo multiplying by 5. Check: `f(2) = 45`, but `log_{3} 45 - 5` is negative." }] } }
    ]
  },
  task:{
    title:"Land it in the window", summary:"Land it in the window",
    statement:"<p>Design an exponential equation `@b{b}^x = c` whose solution is <strong>between −2 and −1</strong>, with `c` a whole number <strong>greater than 1</strong>. There are many answers. Can you find three with different bases?</p><p class=\"tiny muted\">Choose the base `@b{b}` as a fraction (top and bottom from 1 to 9) and `c` from 1 to 30.</p>",
    checks:["The base is allowed: `@b{b} > 0` and `@b{b} ≠ 1`", "`c` is a whole number greater than 1", "The solution `x = log_{@b{b}} c` is negative", "The solution is between −2 and −1"],
    tips:["A base can’t be 1, because `1^x = 1` for every `x`. Choose a numerator and a denominator that are different.",
      "Choose `c` from 2 to 30.",
      "Right now your solution is {sign}. `c` is bigger than 1, but you want a negative exponent. Which bases turn a negative exponent into a number bigger than 1?",
      "Your solution is negative, but not between −2 and −1. For your base, `b^{-1}` = {b1} and `b^{-2}` = {b2}, so `c` must be strictly between them. Right now `c` = {c}, which is {where}."],
    explainPrompt:"Explain why your base has to be less than 1, and how you know your solution is between −2 and −1.",
    vocab:"Use the words exponent, logarithmic form, base and between.",
    success:"Your design works!", more:"There’s more than one answer. Can you find another?",
    after3:"Notice the pattern: with `b = 1/k`, `c` must be strictly between `k` and `k^2`. Those are the heights of `y = (1/k)^x` at the edges of the band, `x = -1` and `x = -2`, because `(1/k)^{-1} = k` and `(1/k)^{-2} = k^2`. In the log view they are where the curve crosses heights −1 and −2."
  },
  cards:[
    ["The inverse of `y = b^x`", "Swap `x` and `y`: `x = b^y`. Name the exponent: `y = log_{b} x`."],
    ["What `log_{b} x` means", "The exponent you put on `b` to get `x`. `log_{2} 8 = 3`, because `2^3 = 8`."],
    ["Exponential form ⟺ log form", "`b^y = x ⟺ log_{b} x = y`. The base stays the base, the exponent is the log’s value, and the result goes inside the log."],
    ["Reflecting a point in `y = x`", "`(p, q) -> (q, p)`. The segment between them crosses `y = x` at a right angle, at its midpoint. Example: (3, 8) → (8, 3)."],
    ["Key points of `y = b^x` and `y = log_{b} x`", "`(-1, 1/b)`, (0, 1), `(1, b)` on `y = b^x` become `(1/b, -1)`, (1, 0), `(b, 1)` on `y = log_{b} x`."],
    ["Asymptotes", "`y = b^x`: horizontal asymptote `y = 0`. `y = log_{b} x`: vertical asymptote `x = 0`. For `b > 1`: as `x -> 0^{+}`, `log_{b} x -> -∞`."],
    ["Domain and range", "`y = b^x`: domain `{x ∈ ℝ}`, range `{y ∈ ℝ | y > 0}`. `y = log_{b} x`: domain `{x ∈ ℝ | x > 0}`, range `{y ∈ ℝ}`. They swap."],
    ["Allowed bases", "`b > 0` and `b ≠ 1`. With `b = 1`, `x = 1^y` is the vertical line `x = 1`, not a function; a negative base gives values like `(-2)^{1/2}`, which aren’t real."],
    ["Bases between 0 and 1", "`y = (1/2)^x` and `y = log_{1/2} x` both fall. `log_{1/2} 8 = -3`, because `(1/2)^{-3} = 8`."],
    ["Solving `b^x = c`", "Rewrite in log form: `x = log_{b} c`. Example: `3^x = 10` gives `x = log_{3} 10`, between 2 and 3 because `3^2 = 9 < 10 < 27 = 3^3`."],
    ["Undoing", "`log_{b}(b^x) = x` for every `x`; `b^{log_{b} x} = x` for every `x > 0`. Examples: `log_{2}(2^5) = 5` and `3^{log_{3} 10} = 10`."],
    ["Inverse vs reciprocal", "`f^{-1}` undoes `f`; `1/f` is one over `f`. The inverse of `2^x` is `log_{2} x`, not `1/2^x = (1/2)^x`."]
  ]
};
