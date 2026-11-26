// MHF4U 15 Polynomial Inequalities. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/15-polynomial-inequalities.md
const fig = (key, aria, cls) => '<canvas class="plot' + (cls ? " " + cls : "") + '" data-fig="' + key + '" role="img" aria-label="' + aria + '"></canvas>';
// Quick-check chips are not reordered by the build, so give them a fixed, varied order here (answer not always first).
const rot = (list, k) => list.slice(k).concat(list.slice(0, k));

// Practice 1: the generated hint pattern (plan: "Hints, generated per stage")
const G1 = "Find each zero: set each factor equal to 0. Then pick one test value in each interval.";
const G2 = "At the test value, find the sign of each factor. An odd number of negative factors makes the product negative.";

export default {
  id:"15-polynomial-inequalities",
  kind:"topic",
  title:"Polynomial inequalities",
  topic:"Polynomial Inequalities",
  readyTopic:"polynomial inequalities",
  hero:{
    eq:"`(x + 2)(x - 1)(x - 3)` <span class=\"hgt\">&gt;</span> `0`", eqLabel:"(x + 2)(x − 1)(x − 3) is greater than 0", eqSize:"md",
    headline:"Not <em>where is it zero?</em> but <em>where is it positive?</em>",
    text:"A <strong>polynomial inequality</strong> asks for every `x` that makes a polynomial positive (or negative). The <strong>zeros</strong> split the number line into intervals, and the polynomial keeps the same sign on each one. A <strong>sign chart</strong> records those signs, the graph shows them as above or below the axis, and the answer is written in <strong>interval notation</strong>.",
    fig:{ aria:"Graph of y = (x + 2)(x − 1)(x − 3) crossing the x-axis at −2, 1 and 3, shaded where it is above the axis, with a sign strip −, +, −, + and a number line showing (−2, 1) ∪ (3, ∞)" }
  },
  goals:[
    "I can explain the difference between solving an equation and solving an inequality, and check whether a value satisfies an inequality.",
    "I can rearrange a polynomial inequality so that one side is 0, and factor the other side, without dividing by a variable.",
    "I can build a sign chart and use the order of each zero to decide where the sign changes.",
    "I can solve a polynomial inequality from a graph, including deciding where one graph is above or below another.",
    "I can write the solution in interval notation, deciding which endpoints (and single points) to include.",
    "I can solve problems modelled by polynomial inequalities and give an answer that makes sense in the context."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Linear inequalities", goal:1, prompt:"Solve `5 - 3x > 11`.",
          options:[
            { t:"`x < -2`", ok:true, why:"Subtract 5: `-3x > 6`. Dividing both sides by −3 flips the inequality: `x < -2`. Check `x = -3`: 5 + 9 = 14, and 14 > 11 is true." },
            { t:"`x > -2`", why:"Dividing by −3 reverses the inequality. Check `x = 0`, which your answer includes: 5 > 11 is false." },
            { t:"`x < -{16}/{3}`", why:"Subtracting 5 from both sides gives `-3x > 11 - 5 = 6`, not 16." },
            { t:"`x > 2`", why:"The term is `-3x`, so you divide by −3: `x < -2`. Check `x = 3`: 5 − 9 = −4, which isn’t greater than 11." }],
          hints:["Get the `x`-term alone first, then divide.", "Subtract 5 from both sides: `-3x > 6`. What happens to the inequality when you divide by a negative number?", "Dividing by −3 flips > to <: `x < -2`."] },
        { id:"w2", skill:"Interval notation", goal:5, prompt:"Which is the interval notation for “`x ≤ -1` or `x > 4`”?",
          options:[
            { t:"`(-∞, -1] ∪ (4, ∞)`", ok:true, why:"≤ includes −1, so it gets a square bracket. > excludes 4, so it gets a round one. “Or” joins the two pieces with ∪." },
            { t:"`(-∞, -1) ∪ [4, ∞)`", why:"−1 is included (≤), so it needs a square bracket. 4 is not included (>), so it needs a round bracket." },
            { t:"`[-1, 4)`", why:"`[-1, 4)` is the numbers <strong>between</strong> −1 and 4. The inequality describes the numbers outside that gap." },
            { t:"`(-∞, -1] ∩ (4, ∞)`", why:"∩ means “and”: numbers in both pieces at once, and there are none. “Or” is ∪." }],
          hints:["Write each piece separately, then decide how to join them.", "`x ≤ -1` is `(-∞, -1]`. `x > 4` is `(4, ∞)`. Which symbol means “or”?", "Join with ∪: `(-∞, -1] ∪ (4, ∞)`."] },
        { id:"w3", skill:"Interval notation", goal:5, prompt:"Which inequality describes the interval `[-3, 2)`?",
          options:[
            { t:"`-3 ≤ x < 2`", ok:true, why:"The square bracket includes −3 (≤); the round bracket excludes 2 (<)." },
            { t:"`-3 < x ≤ 2`", why:"The square bracket is next to −3, so −3 is the included endpoint." },
            { t:"`x ≤ -3` or `x > 2`", why:"`[-3, 2)` is the stretch <strong>between</strong> −3 and 2." },
            { t:"`-3 ≤ x ≤ 2`", why:"The round bracket at 2 means 2 itself is not included." }],
          hints:["A square bracket includes its endpoint. A round bracket doesn’t.", "−3 has a square bracket and 2 has a round one.", "So `-3 ≤ x < 2`."] },
        { id:"w4", skill:"Factoring", goal:2, prompt:"Factor fully: `x^3 - x^2 - 6x`.",
          options:[
            { t:"`x(x - 3)(x + 2)`", ok:true, why:"Take out the common factor `x`: `x(x^2 - x - 6)`. Then −3 and 2 multiply to −6 and add to −1." },
            { t:"`(x - 3)(x + 2)`", why:"Expanding `(x - 3)(x + 2)` gives `x^2 - x - 6`, which has no `x^3`. The common factor `x` is also a factor, and it gives the zero `x = 0`." },
            { t:"`x(x + 3)(x - 2)`", why:"`(x + 3)(x - 2) = x^2 + x - 6`. The middle term must be `-x`." },
            { t:"`x(x - 6)(x + 1)`", why:"`(x - 6)(x + 1) = x^2 - 5x - 6`." }],
          hints:["Is there a common factor in all three terms?", "`x^3 - x^2 - 6x = x(x^2 - x - 6)`. Which two numbers multiply to −6 and add to −1?", "−3 and 2, so `x(x - 3)(x + 2)`."] },
        { id:"w5", skill:"Reading graphs", goal:4,
          prompt:"The graph of `f(x) = -(x + 1)(x - 3)` is a parabola that opens down, with zeros −1 and 3 and vertex (1, 4). For which `x`-values is `f(x) > 0`?" + fig("w5", "Parabola opening down with zeros at negative 1 and 3 and vertex (1, 4)"),
          options:[
            { t:"`(-1, 3)`", ok:true, why:"`f(x) > 0` where the graph is above the `x`-axis: between the zeros. The zeros themselves give 0, so they’re excluded." },
            { t:"`(-∞, -1) ∪ (3, ∞)`", why:"Outside the zeros this parabola is below the axis, where `f(x) < 0`." },
            { t:"`[-1, 3]`", why:"At −1 and 3, `f(x) = 0`, and 0 > 0 is false. Use round brackets." },
            { t:"`(-∞, 4]`", why:"`(-∞, 4]` is the set of `y`-values the graph reaches. The question asks for `x`-values." }],
          hints:["`f(x) > 0` means the point on the graph is above the `x`-axis.", "This parabola opens down and crosses the axis at −1 and 3. Where is it above the axis?", "Between the zeros, not including them: `(-1, 3)`."] },
        { id:"w6", skill:"Reading graphs", goal:3, prompt:"How does the graph of `y = (x + 2)(x - 1)^2` behave at `x = 1`?",
          options:[
            { t:"It touches the `x`-axis at (1, 0) and turns back", ok:true, why:"`(x - 1)` is squared, so `x = 1` is a zero of order 2. The graph touches the axis there and turns back." },
            { t:"It crosses the `x`-axis at (1, 0)", why:"Crossing happens at a zero of order 1. Here the factor is squared." },
            { t:"It crosses the `x`-axis at (1, 0) and flattens out", why:"Crossing and flattening is order 3. This zero has order 2." },
            { t:"It touches the `x`-axis at (−1, 0)", why:"`(x - 1)` is zero when `x = 1`, not −1." }],
          hints:["What is the order of the zero at `x = 1`?", "`(x - 1)` is squared, so the order is 2. What does a graph do at a zero of order 2?", "Order 2: it touches the axis at (1, 0) and turns back."] }
      ],
      refreshers:{
        "Linear inequalities":"Solve an inequality like an equation, with one extra rule: when you multiply or divide both sides by a <strong>negative</strong> number, flip the inequality sign. Example: `5 - 3x > 11` → `-3x > 6` → `x < -2`. Check with a value: `x = -3` gives 14 > 11, which is true.",
        "Interval notation":"A square bracket includes an endpoint (≤, ≥); a round bracket excludes it (<, >). Infinity always takes a round bracket. Join separate pieces with ∪, which means “or”. Example: `x ≤ -1` or `x > 4` is `(-∞, -1] ∪ (4, ∞)`, and `[-3, 2)` means `-3 ≤ x < 2`.",
        "Factoring":"Always take out a common factor first, then factor what’s left. Example: `x^3 - x^2 - 6x = x(x^2 - x - 6) = x(x - 3)(x + 2)`. Check by expanding. A dropped common factor `x` means a lost zero at `x = 0`.",
        "Reading graphs":"`f(x) > 0` where the graph is above the `x`-axis, and `f(x) < 0` where it’s below. The answer is a set of `x`-values. At a zero of order 1 the graph crosses the axis; at order 2 it touches and turns back; at order 3 it crosses and flattens. Example: `y = (x + 2)(x - 1)^2` crosses at −2 and touches at 1."
      }
    }
  },
  explore:{
    heading:"Sign chart builder",
    intro:"The graph, the sign chart and the number line below share one `x`-axis. First build a chart step by step. Then switch to <strong>Scan</strong>, slide the scanner across, and watch each factor’s sign decide the sign of the whole product.",
    stageNames:{ factor:"Factor", zeros:"Zeros", tests:"Test values", signs:"Signs", sol:"Solution" },
    stageHow:{
      factor:"Choose the form you will chart, then press Check.",
      zeros:"Tap the number line to place each zero (it snaps to 0.5), or move the marker with − and + and press Place.",
      tests:"Keep or change one test value per interval (− and + move it by 0.5). It must stay strictly inside its interval.",
      signs:"Tap each cell to set + or −, then the product row.",
      sol:"Tap intervals to include them and tap each zero to open or close it. The interval notation builds as you go."
    },
    msgs:{
      wrongSignZero:"{f} is zero when {e}, so {z}.",
      missingZero:"Each factor gives a zero. You have {n} of {m}.",
      extraZero:"No factor is zero at {z}.",
      testOnZero:"A zero isn’t inside any interval. Pick a value strictly between the zeros.",
      fillCells:"Set every cell to + or − first.",
      factorCell:"At {x}, {f} = {v}, which is {pn}.",
      productCell:"Count the negative entries in this column. An odd number of negatives makes the product negative; an even number makes it positive.",
      wrongSign:"This interval’s product is {sign}, but the inequality needs {need}.",
      endpoints:"With `<` or `>` the zeros give 0, which doesn’t count: use open circles. With `≤` or `≥` they count: use filled dots.",
      zerosOnly:"Those are where `P(x) = 0`. The inequality asks for whole intervals.",
      missing:"An interval with the sign you need is missing. Check every column of the product row.",
      empty:"Tap at least one interval or zero first."
    },
    builds:[
      { id:"b1", label:"B1 (required)", ineq:"`(x + 2)(x - 1)(x - 3) > 0`", sym:">", a:1, f:[[-2, 1], [1, 1], [3, 1]], tests:[-3, 0, 2, 4],
        answer:"(−2, 1) ∪ (3, ∞)", done:"`(x + 2)(x - 1)(x - 3) > 0` when `x` is in `(-2, 1) ∪ (3, ∞)`.",
        hints:{
          zeros:["Each factor is zero at exactly one `x`. Which `x` makes `x + 2` equal to 0?", "Set each factor equal to 0: `x + 2 = 0`, `x - 1 = 0` and `x - 3 = 0`.", "The zeros are −2, 1 and 3. Tap each one on the number line."],
          tests:["The zeros split the number line into four intervals. Each interval needs one value strictly inside it.", "The intervals are `(-∞, -2)`, `(-2, 1)`, `(1, 3)` and `(3, ∞)`. Any value inside each one works, so pick easy ones.", "For example −3, 0, 2 and 4."],
          signs:["Substitute the test value into each factor. Only the sign of the result matters.", "At `x = 0`: `x + 2 = 2` is +, `x - 1 = -1` is − and `x - 3 = -3` is −. Two negatives make a positive.", "At −3: (−)(−)(−) = −. At 0: (+)(−)(−) = +. At 2: (+)(+)(−) = −. At 4: (+)(+)(+) = +. The product row is −, +, −, +."],
          sol:["`> 0` asks where the product is positive. Which columns are +?", "The + columns are `(-2, 1)` and `(3, ∞)`. Do the zeros themselves count?", "With >, the zeros give 0, which doesn’t count, so use open circles: `(-2, 1) ∪ (3, ∞)`."]
        } },
      { id:"b2", label:"B2 (optional)", ineq:"`(x + 1)(x - 2)^2 ≤ 0`", sym:"≤", a:1, f:[[-1, 1], [2, 2]], tests:[-2, 0, 3],
        answer:"(−∞, −1] ∪ {2}", done:"`(x + 1)(x - 2)^2 ≤ 0` when `x` is in `(-∞, -1] ∪ {2}`, that is, `x ≤ -1` or `x = 2`.",
        hints:[G1, G2, "Zeros −1 (order 1) and 2 (order 2). The product row is −, +, +: the sign doesn’t change at 2. The product is negative on `(-∞, -1)` and 0 at −1 and at 2. With ≤, the zeros count: `(-∞, -1] ∪ {2}`, that is, `x ≤ -1` or `x = 2`."] },
      { id:"b3", label:"B3 (optional)", ineq:"`-(x + 3)(x - 1)(x - 4) ≥ 0`", sym:"≥", a:-1, f:[[-3, 1], [1, 1], [4, 1]], tests:[-4, 0, 2, 5],
        answer:"(−∞, −3] ∪ [1, 4]", done:"`-(x + 3)(x - 1)(x - 4) ≥ 0` when `x` is in `(-∞, -3] ∪ [1, 4]`.",
        hints:[G1, G2, "Zeros −3, 1 and 4, each of order 1, and `a = -1` makes the far right negative. The product row is +, −, +, −. With ≥, the zeros count: `(-∞, -3] ∪ [1, 4]`."] }
    ],
    predIntro:"These use <strong>Scan</strong> mode. Make a prediction first. Then the scanner will show you what really happens.",
    predictions:[
      { id:"p1", start:{ preset:"hero", sym:">", a:1, scan:4 },
        prompt:"The scanner will slide left from `x = 4` to `x = -3`, crossing all three zeros. What sign will the product have at `x = -3`?",
        options:[{ t:"Negative", ok:true }, { t:"Positive" }, { t:"Zero" }, { t:"It depends on how far −3 is from the zeros" }],
        counter:"Sign changes: ",
        explain:"Each time the scanner crosses a zero of order 1, exactly one factor changes sign, so the product changes sign. Three crossings take + to −, then +, then −. The distance from the zeros only changes the size of `P(x)`, never its sign." },
      { id:"p2", start:{ preset:"p2", sym:">", a:1, scan:-4, hideProduct:true },
        prompt:"Predict the product row, from left to right.",
        options:[{ t:"−, +, +", ok:true }, { t:"−, +, −" }, { t:"+, −, +" }, { t:"+, +, +" }],
        explain:"`(x - 1)^2` is a square, so it’s never negative. Crossing `x = 1` flips `(x - 1)` twice, which leaves the product’s sign alone. So the signs are −, +, +, not alternating. The graph touches the axis at 1 instead of crossing." },
      { id:"p3", start:{ preset:"hero", sym:">", a:1, scan:2.5 },
        prompt:"The symbol will change from > to ≥. What will the solution be?",
        options:[{ t:"`[-2, 1] ∪ [3, ∞)`", ok:true }, { t:"`(-2, 1) ∪ (3, ∞)`, with no change" }, { t:"`(-∞, -2] ∪ [1, 3]`" }, { t:"`[-2, 1] ∪ [3, ∞]`" }],
        explain:"At the zeros `P(x) = 0`, and 0 ≥ 0 is true, so the three zeros join the solution: `[-2, 1] ∪ [3, ∞)`. The intervals themselves don’t change. Infinity isn’t a number you can reach, so it always takes a round bracket." },
      { id:"p4", start:{ preset:"hero", sym:">", a:1, scan:2.5 },
        prompt:"`a` will change from 1 to 3, and then from 3 to −2. What will the solution of `@a{a}(x + 2)(x - 1)(x - 3) > 0` be at the end?",
        options:[{ t:"`(-∞, -2) ∪ (1, 3)`", ok:true }, { t:"`(-2, 1) ∪ (3, ∞)`, unchanged" }, { t:"`(-∞, -2] ∪ [1, 3]`" }, { t:"Each interval becomes twice as wide" }],
        still:"Still `(-2, 1) ∪ (3, ∞)`",
        explain:"`a` stretches the graph vertically, so its size never moves a zero or changes a sign. Its sign multiplies every column of the chart, so a negative `a` flips every sign. With > (strict) the zeros still aren’t included: `(-∞, -2) ∪ (1, 3)`." }
    ],
    chalIntro:"Use <strong>Scan</strong> mode: set the zeros, orders, `a` and the symbol, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3, 5], prompt:"The symbol is locked to >. Set the zeros, orders and `a` so the solution is `(-3, 1) ∪ (4, ∞)`.",
        msgs:{
          aNeg:"Your solution is `(-∞, -3) ∪ (1, 4)`: the other intervals. The far-right interval must be positive, so `a` must be positive.",
          flipped:"Your solution is `(-4, -1) ∪ (3, ∞)`. Read the target’s endpoints: the zeros are −3, 1 and 4.",
          order2:"At that zero the sign no longer changes, so two intervals merge. Every endpoint of the target needs a sign change: order 1.",
          other:"Compare your number line with the target. Every endpoint of the target must be a zero where the sign changes."
        },
        hints:["The endpoints of the target are where the sign changes. What zeros do you need?", "Zeros at −3, 1 and 4, each of order 1. Now look at the far right: should `(4, ∞)` be positive or negative?", "`(4, ∞)` is in the solution of `P(x) > 0`, so `P` is positive there: `a > 0`. `P(x) = (x + 3)(x - 1)(x - 4)` works."] },
      { id:"tc2", goal:[3, 5], prompt:"Make the solution exactly `(-∞, -2) ∪ (-2, 3)`: every number less than 3 <strong>except</strong> −2. You choose the zeros, orders, `a` and the symbol.",
        msgs:{
          le:"Your solution is `(-∞, 3]`: ≤ includes −2 and 3. To leave out exactly those points, use a strict symbol.",
          order1:"Your solution is `(-2, 3)`: the sign changes at −2. To leave out only the single point −2, the sign must not change there.",
          gt:"Your solution is `(3, ∞)`, the other side. Flip the symbol, or make `a` negative.",
          gap2:"Your gap is at 2. The factor `(x + 2)` gives the zero −2.",
          other:"Where must the sign change, and where must it stay the same?"
        },
        hints:["−2 is missing from the solution, but the numbers on both sides of it are in. What kind of zero keeps the same sign on both sides?", "A zero of order 2 at −2, and a sign change at 3 (order 1). Which side of 3 do you want, and should the zeros be included?", "`(x + 2)^2(x - 3)` is negative left of 3 (except at −2, where it’s 0). So `(x + 2)^2(x - 3) < 0` gives `(-∞, -2) ∪ (-2, 3)`."] },
      { id:"tc3", goal:[3, 5], stretch:true, prompt:"Make the solution exactly `x ≤ -2` or `x = 1` or `x ≥ 3`, that is, `(-∞, -2] ∪ {1} ∪ [3, ∞)`. Decide why each choice is forced before you check.",
        msgs:{
          strict:"Your solution is `(-∞, -2) ∪ (3, ∞)`. With a strict symbol, the zeros −2 and 3 drop out, and so does the single point 1. Use ≥.",
          order1:"Your solution is `[-2, 1] ∪ [3, ∞)`: the sign changes at 1, so a whole interval joined. Make 1 a zero where the sign doesn’t change.",
          aNeg:"Your solution is `[-2, 3]`: the middle, not the outside. Make `a` positive or change the symbol to ≤.",
          no1:"Close: `(-∞, -2] ∪ [3, ∞)`. But `x = 1` must also be a solution, and right now `P(1)` is negative. Add a zero at 1 that doesn’t change the sign, which also makes the degree 4.",
          other:"Work from the target: which numbers are endpoints, and which point stands alone?"
        },
        hints:["A single point like `x = 1` can only be a solution if `P(1) = 0` and the symbol includes 0. What must happen to the sign on both sides of 1?", "The sign must change at −2 and at 3 (order 1) and must <strong>not</strong> change at 1 (order 2). That’s 1 + 2 + 1 = 4, a degree 4 polynomial.", "`(x + 2)(x - 1)^2(x - 3)` is positive outside `[-2, 3]` and negative inside it, except at 1, where it’s 0. With ≥: `(-∞, -2] ∪ {1} ∪ [3, ∞)`."] }
    ]
  },
  part3:{
    slug:"compare", name:"Compare",
    heading:"Above or below? Two graphs, one inequality",
    intro:"Mark where one graph is above the other. Then press <strong>Flatten</strong> and watch the second graph slide down onto the `x`-axis. What’s left is a single polynomial whose sign answers the question.",
    how:"Build your answer on the number line under the graph (drag the ends, choose open or closed, add a piece), then press Check.",
    other:"Your answer is {got}. Compare it with the graphs: check each piece and each endpoint.",
    note:"Your marked answer is {got}. Compare it with the algebra’s solution above.",
    flatCap:"Where the graphs met, `f(x) - g(x) = 0`. Where `f` was above `g`, `f(x) - g(x) > 0`.",
    rounds:[
      { id:"r1", chip:"Round 1", title:"“Is the cube bigger?”", text:"`f(x) = x^3`, `g(x) = 4x`. Solve `x^3 > 4x`.",
        steps:[{ prompt:"Mark where `x^3 > 4x`.", answer:"(−2, 0) ∪ (2, ∞)",
          wrong:{
            "(−∞, −2) ∪ (2, ∞)":"That’s the solution of `x^2 > 4`, which is what you get by dividing both sides by `x`. Look left of −2: the cube is <strong>below</strong> the line there (try `x = -3`: −27 < −12). Dividing by a negative `x` would have flipped the sign.",
            "(2, ∞)":"Look between −2 and 0 too: try `x = -1`. `(-1)^3 = -1` and `4(-1) = -4`, and −1 > −4.",
            "(−∞, −2) ∪ (0, 2)":"That’s where the cube is <strong>below</strong> the line.",
            "[−2, 0] ∪ [2, ∞)":"Where the graphs meet, `x^3 = 4x`, so `x^3 > 4x` is false. Use open circles."
          } }],
        alg:["`x^3 - 4x > 0`", "`x(x - 2)(x + 2) > 0`"], chart:{ a:1, f:[[-2, 1], [0, 1], [2, 1]] }, sol:"`(-2, 0) ∪ (2, ∞)`",
        hints:["Find where the graphs meet first. Those are the only places where “above” can switch to “below”.", "`x^3 = 4x` at `x = -2`, 0 and 2. In each of the four intervals, is the cube above or below the line? Try `x = -3`, −1, 1 and 3.", "`x = -3`: −27 < −12 (below). `x = -1`: −1 > −4 (above). `x = 1`: 1 < 4 (below). `x = 3`: 27 > 12 (above). With >, the meeting points don’t count: `(-2, 0) ∪ (2, ∞)`."] },
      { id:"r2", chip:"Round 2", title:"“Below the line”", text:"`f(x) = x^3 + x^2`, `g(x) = 4x + 4`. Solve `f(x) ≤ g(x)`.",
        steps:[{ prompt:"Mark where `f(x) ≤ g(x)`.", answer:"(−∞, −2] ∪ [−1, 2]",
          wrong:{
            "[−2, −1] ∪ [2, ∞)":"That’s where `f` is <strong>above</strong> `g`. ≤ asks where `f` is below `g` or touching it.",
            "(−∞, −2) ∪ (−1, 2)":"≤ includes the points where the graphs meet. Close those circles.",
            "[−2, 2]":"Between −2 and −1 the cubic is above the line (try `x = -1.5`: `f = -1.125` and `g = -2`). Check each piece separately."
          } }],
        alg:["`x^3 + x^2 - 4x - 4 ≤ 0`", "<small>grouping:</small> `x^2(x + 1) - 4(x + 1) = (x + 1)(x^2 - 4)`", "`(x + 2)(x + 1)(x - 2) ≤ 0`"], chart:{ a:1, f:[[-2, 1], [-1, 1], [2, 1]] }, sol:"`(-∞, -2] ∪ [-1, 2]`",
        hints:["≤ asks where `f` is below `g` or touching it. Find the meeting points first.", "The graphs meet at `x = -2`, −1 and 2. Test one `x`-value in each interval, for example `x = -3`, −1.5, 0 and 3.", "`x = -3`: `f = -18`, `g = -8` (below). `x = -1.5`: `f = -1.125`, `g = -2` (above). `x = 0`: `f = 0`, `g = 4` (below). `x = 3`: `f = 36`, `g = 16` (above). With ≤, the meeting points count: `(-∞, -2] ∪ [-1, 2]`."] },
      { id:"r3", chip:"Round 3", title:"“The box” (graphs and words)", text:"A card is 14 cm by 10 cm. Squares of side `x` cm are cut from the corners and the sides are folded up to make an open box with volume `V(x) = x(14 - 2x)(10 - 2x)`. For which cut sizes does the box hold <strong>at least 96 cm³</strong>?",
        band:"possible cuts",
        steps:[
          { prompt:"Step 1 (algebra first): mark `V(x) ≥ 96` on the whole number line.", answer:"[1, 3] ∪ [8, ∞)",
            wrong:{ "(−∞, 1] ∪ [3, 8]":"That’s where the volume is <strong>at most</strong> 96 cm³. “At least 96” means on or above the line `y = 96`." } },
          { prompt:"Step 2 (context): mark the answer to the question, the cut sizes that make a box holding at least 96 cm³.", answer:"[1, 3]",
            wrong:{
              "[1, 3] ∪ [8, ∞)":"The algebra is right, but `x = 8` would need 16 cm cut from a 10 cm side. Only `0 < x < 5` makes a box.",
              "(1, 3)":"“At least 96” includes 96 itself, so 1 and 3 count.",
              "(0, 1] ∪ [3, 5)":"That’s where the volume is <strong>at most</strong> 96 cm³. “At least 96” means on or above the line `y = 96`."
            } }],
        alg:["`V(x) = 4x^3 - 48x^2 + 140x`", "`V(x) - 96 ≥ 0` → `4(x^3 - 12x^2 + 35x - 24) ≥ 0`", "<small>Test `x = 1`: 1 − 12 + 35 − 24 = 0, so `(x - 1)` is a factor (factor theorem).</small>", "`4(x - 1)(x^2 - 11x + 24) = 4(x - 1)(x - 3)(x - 8) ≥ 0`"],
        chart:{ a:4, f:[[1, 1], [3, 1], [8, 1]] }, sol:"Solution `[1, 3] ∪ [8, ∞)`; the cut must satisfy `0 < x < 5` (the card is 10 cm wide), so `1 ≤ x ≤ 3`. Check: `V(2)` = 2 × 10 × 6 = 120 ≥ 96.",
        why96:{ title:"Why not set each factor ≥ 96?", html:"At `x = 1` the three factors are 1, 12 and 8. None of them is anywhere near 96, yet their product is exactly 96. A product can reach 96 in endless ways, so the factors only tell you something when the other side is 0. That’s why you subtract 96 first." },
        hints:["Step 1: where is the curve on or above the line `y = 96`? Step 2: which of those cuts can really be made from a card 10 cm wide?", "The curve meets the line at `x = 1`, 3 and 8, and it is on or above the line on `[1, 3]` and from 8 on. A cut of `x` cm uses `2x` cm of the 10 cm side.", "`V(x) ≥ 96` on `[1, 3] ∪ [8, ∞)`. A box needs `0 < x < 5`, so the answer is `[1, 3]`, that is, `1 ≤ x ≤ 3`."] }
    ],
    blocks:[{ title:"What it means", html:"<p><strong>Comparing two graphs</strong></p><ul><li>`f(x) > g(x)` means the graph of `f` is above the graph of `g`.</li><li>Subtract: `f(x) > g(x)` is the same inequality as `f(x) - g(x) > 0`. The places where the graphs meet become the zeros of `f - g`.</li><li>Never divide by `x` (or by any expression that could be negative or 0). Subtract, factor, then use a sign chart.</li><li>In a real problem, finish by keeping only the values that make sense in the situation.</li></ul>" }],
    quickCheck:{
      title:"Above or below?", summary:"Above or below?",
      items:[
        { id:"q1", goal:2, prompt:"Dividing both sides of `x^3 > 9x` by `x` gives `x^2 > 9`. Is that step valid?",
          choices:rot([
            { t:"No: `x` could be negative or 0", ok:true, fb:"Right. Dividing by a negative flips the sign and dividing by 0 is impossible, and you don’t know which `x` you have. `x = -1` shows it: −1 > −9 is true, but 1 > 9 is false." },
            { t:"Yes: you can divide both sides by the same thing", fb:"That rule is for numbers you know are positive. `x = -1` satisfies `x^3 > 9x` but not `x^2 > 9`." },
            { t:"Yes, as long as you flip the sign", fb:"Flipping is right only when `x` is negative. For positive `x` it’s wrong, and `x = 0` can’t be divided by at all. You’d have to split into cases; subtracting `9x` and factoring avoids all of that." },
            { t:"No: you must take the cube root first", fb:"Cube roots don’t help with `9x` on the other side. Subtract `9x` and factor." }], 1) },
        { id:"q2", goal:4, prompt:"The graphs of `f` and `g` cross only at `x = -1` and `x = 3`, and `f` is above `g` between them. What is the solution of `f(x) - g(x) ≥ 0`?",
          choices:rot([
            { t:"`[-1, 3]`", ok:true, fb:"Right. `f - g ≥ 0` means `f` is above `g` or meeting it: between the crossings, endpoints included." },
            { t:"`(-1, 3)`", fb:"≥ includes the points where the graphs meet." },
            { t:"`(-∞, -1] ∪ [3, ∞)`", fb:"That’s where `f` is below `g`." },
            { t:"`x = -1` or `x = 3`", fb:"Those are the solutions of the equation `f(x) = g(x)`, not the inequality." }], 2) },
        { id:"q3", goal:6, prompt:"A length `x`, in centimetres, must satisfy `(x + 4)(x - 2)(x - 7) < 0`. Which values make sense?",
          choices:rot([
            { t:"`2 < x < 7`", ok:true, fb:"Right. The algebra gives `(-∞, -4) ∪ (2, 7)`, and a length must be positive, so only `(2, 7)` is left." },
            { t:"`x < -4` or `2 < x < 7`", fb:"The algebra is right, but a length can’t be less than −4 cm." },
            { t:"`0 < x < 2` or `x > 7`", fb:"That’s where the product is positive." },
            { t:"`2 ≤ x ≤ 7`", fb:"< excludes the zeros." }], 3) },
        { id:"q4", goal:2, prompt:"Which inequality has the same solutions as `f(x) < g(x)`?",
          choices:rot([
            { t:"`g(x) - f(x) > 0`", ok:true, fb:"Right. `f` is below `g` exactly when `g - f` is positive." },
            { t:"`f(x) - g(x) > 0`", fb:"That says `f` is above `g`." },
            { t:"`{f(x)}/{g(x)} < 1`", fb:"Dividing by `g(x)` flips the sign wherever `g(x)` is negative, so this isn’t equivalent." },
            { t:"`g(x) - f(x) < 0`", fb:"That says `g` is below `f`, the opposite." }], 1) }
      ]
    }
  },
  practice:{
    activities:[
      { id:"chart", type:"custom", title:"Solve with a sign chart", summary:"Solve with a sign chart", goal:[3, 5],
        instruction:"Solve each inequality with a sign chart. Factor first if you need to.",
        how:"Choose the factored form if asked, place the zeros, fill in the signs, then tap the intervals and endpoints that make up the solution.",
        items:[
          { id:"s1", goal:[3, 5], ineq:"`(x + 4)(x - 1)(x - 5) < 0`", sym:"<", a:1, f:[[-4, 1], [1, 1], [5, 1]], answer:"(−∞, −4) ∪ (1, 5)",
            why:"Three zeros of order 1, so the sign changes at each one. The far right is + (all factors positive), giving −, +, −, +. The product is negative on `(-∞, -4)` and `(1, 5)`.",
            wrong:{ "(−∞, −4] ∪ [1, 5]":"< excludes the zeros: open circles. Try again." },
            hints:[G1, G2, "Zeros −4, 1 and 5, each of order 1. The product row is −, +, −, +. With <, the zeros give 0, which doesn’t count: `(-∞, -4) ∪ (1, 5)`."] },
          { id:"s2", goal:[3, 5], ineq:"`(x - 3)^2(x + 1) ≤ 0`", sym:"≤", a:1, f:[[-1, 1], [3, 2]], answer:"(−∞, −1] ∪ {3}",
            why:"`(x - 3)^2` is never negative, so the sign comes from `(x + 1)`: negative left of −1. At `x = 3` the product is 0, and 0 ≤ 0 is true, so 3 is a solution standing on its own.",
            wrong:{ "(−∞, −1]":"Check `x = 3`: `(0)^2(4) = 0`, and 0 ≤ 0 is true. A zero of even order can be a solution all by itself. Try again." },
            rowWrong:{ "+-+":"The sign only changes at a zero of odd order. 3 has order 2. Try again." },
            hints:["The zeros are 3 and −1. What is the order of each?", "3 has order 2, so the sign doesn’t change there. Test `x = -2`: (25)(−1) = −25, negative. Test `x = 0`: (9)(1) = 9, positive. Test `x = 4`: (1)(5) = 5, positive.", "The product is negative on `(-∞, -1)` and 0 at −1 and at 3. With ≤, all of those count: `(-∞, -1] ∪ {3}`, that is, `x ≤ -1` or `x = 3`."] },
          { id:"s3", goal:[2, 3, 5], ineq:"`-x^3 + 9x > 0`", sym:">", a:-1, f:[[-3, 1], [0, 1], [3, 1]], answer:"(−∞, −3) ∪ (0, 3)",
            factor:{ prompt:"Which is the <strong>fully</strong> factored form of the left side, ready for a sign chart?", options:[
              { t:"`-x(x - 3)(x + 3)`", ok:true },
              { t:"`x(x - 3)(x + 3)`", why:"Expand it: you get `x^3 - 9x`, the opposite of `-x^3 + 9x`. The common factor is `-x`. Try again." },
              { t:"`-x(x^2 + 9)`", why:"`-x(x^2 + 9) = -x^3 - 9x`. The bracket must be `x^2 - 9`. Try again." }] },
            why:"`-x^3 + 9x = -x(x^2 - 9) = -x(x - 3)(x + 3)`. The −1 makes the far right negative: +, −, +, −.",
            hints:[G1, G2, "`-x^3 + 9x = -x(x - 3)(x + 3)`: zeros −3, 0 and 3, each of order 1, and the −1 makes the far right negative. The product row is +, −, +, −. With >, the zeros don’t count: `(-∞, -3) ∪ (0, 3)`."] },
          { id:"s4", goal:[3, 5], ineq:"`(2 - x)(x + 1)^2 ≥ 0`", sym:"≥", a:1, f:[[-1, 2], [2, 1, true]], answer:"(−∞, 2]",
            why:"`(2 - x)` is positive left of 2 and negative right of 2. `(x + 1)^2` is never negative. So the product is ≥ 0 for every `x ≤ 2` (at −1 it’s 0, which counts).",
            wrong:{ "{−1} ∪ [2, ∞)":"`(2 - x)` is positive when `x` is small. Test `x = 0`: (2)(1) = 2 ≥ 0, so 0 is a solution. Try again." },
            hints:[G1, G2, "Zeros −1 (order 2) and 2 (order 1). `(2 - x)` is + left of 2 and − right of it, so the product row is +, +, −. With ≥, the zeros count, and −1 sits inside the + stretch: `(-∞, 2]`."] },
          { id:"s5", goal:[2, 3, 5], ineq:"`x^4 - 5x^2 + 4 > 0`", sym:">", a:1, f:[[-2, 1], [-1, 1], [1, 1], [2, 1]], answer:"(−∞, −2) ∪ (−1, 1) ∪ (2, ∞)",
            factor:{ prompt:"Which is the <strong>fully</strong> factored form of the left side, ready for a sign chart?", options:[
              { t:"`(x + 2)(x + 1)(x - 1)(x - 2)`", ok:true },
              { t:"`(x^2 - 1)(x^2 - 4)`", why:"That’s equal to `x^4 - 5x^2 + 4`, but it isn’t fully factored: each bracket is a difference of squares. A sign chart needs linear factors. Try again." },
              { t:"`(x + 2)^2(x - 1)^2`", why:"That expands to `x^4 + 2x^3 - 3x^2 - 4x + 4`, which has odd powers; `x^4 - 5x^2 + 4` has none. Factor it as `(x^2 - 1)(x^2 - 4)` first. Try again." }] },
            why:"Treat it as a quadratic in `x^2`: `(x^2 - 1)(x^2 - 4)`, then difference of squares twice. Four zeros of order 1: +, −, +, −, +.",
            hints:["Think of `x^4 - 5x^2 + 4` as a quadratic in `x^2`: `u^2 - 5u + 4`.", "`u^2 - 5u + 4 = (u - 1)(u - 4)`, so the polynomial is `(x^2 - 1)(x^2 - 4)`. Factor each difference of squares.", "`(x + 2)(x + 1)(x - 1)(x - 2)`: four zeros of order 1, far right +, so the signs are +, −, +, −, +. The solution of > 0 is `(-∞, -2) ∪ (-1, 1) ∪ (2, ∞)`."] },
          { id:"s6", goal:[2, 3, 5], ineq:"`x^3 + 2x^2 ≥ 3x`", sym:"≥", a:1, f:[[-3, 1], [0, 1], [1, 1]], answer:"[−3, 0] ∪ [1, ∞)",
            factor:{ prompt:"Which inequality has the same solutions, with 0 on one side and the other side fully factored?", options:[
              { t:"`x(x + 3)(x - 1) ≥ 0`", ok:true },
              { t:"`x(x - 3)(x + 1) ≥ 0`", why:"Expand `(x - 3)(x + 1)`: `x^2 - 2x - 3`. The middle term must be `+2x`. Try again." },
              { t:"`x^2 + 2x ≥ 3`", why:"That divides both sides by `x`, which might be negative or 0. Subtract `3x` instead. Try again." }] },
            why:"Subtract `3x` first: `x^3 + 2x^2 - 3x = x(x^2 + 2x - 3) = x(x + 3)(x - 1)`. ≥ includes all three zeros.",
            hints:[G1, G2, "`x^3 + 2x^2 - 3x = x(x + 3)(x - 1)`: zeros −3, 0 and 1, each of order 1. The product row is −, +, −, +. With ≥, the zeros count: `[-3, 0] ∪ [1, ∞)`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the Error", student:"Daniel", how:"",
        instruction:"Daniel made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Solve `x^3 ≥ 16x`.",
            steps:["Check a value first: `x = 5` gives 125 ≥ 80, so 5 is a solution.", "Divide both sides by `x`: `x^2 ≥ 16`.", "Subtract 16 and factor: `(x - 4)(x + 4) ≥ 0`.", "The product is ≥ 0 outside the zeros, so `x ≤ -4` or `x ≥ 4`.", "Solution: `(-∞, -4] ∪ [4, ∞)`."],
            answer:1,
            stepFb:["Step 1 is correct: 125 ≥ 80 is true. Keep checking the steps after it.", "", "Step 3 factors `x^2 - 16` correctly, but it’s working on the wrong inequality. The mistake is earlier.", "Step 4 reads its own sign chart correctly. The mistake is earlier.", "Step 5 follows from step 4. The mistake is earlier."],
            fixes:[
              { t:"Subtract `16x` instead: `x^3 - 16x ≥ 0`, so `x(x - 4)(x + 4) ≥ 0`. The sign chart gives `[-4, 0] ∪ [4, ∞)`.", ok:true, why:"Subtracting keeps every solution. Check `x = -1`: −1 ≥ −16 is true, and −1 is in `[-4, 0]`." },
              { t:"Divide by `x` and flip the sign: `x^2 ≤ 16`, so `[-4, 4]`.", why:"Flipping is only right when `x` is negative. Test `x = 1`, which is in `[-4, 4]`: 1 ≥ 16 is false." },
              { t:"Divide by `x` only for positive `x`: `x^2 ≥ 16` with `x > 0`, so `x ≥ 4`.", why:"That’s right for positive `x`, but it ignores every `x ≤ 0`. Test `x = -1`: −1 ≥ −16 is true, so −1 is a solution this fix loses, and so is `x = 0` (0 ≥ 0)." },
              { t:"Step 2 is correct as written.", why:"Test `x = -1`: `(-1)^3 = -1` and `16(-1) = -16`, and −1 ≥ −16 is true. So −1 is a solution of `x^3 ≥ 16x`, but 1 ≥ 16 is false. Dividing by `x` lost it." }],
            hints:["Check each step that changes the inequality. Is each one allowed for every `x`?", "Dividing by `x` is only safe when you know `x` is positive. Here `x` could be negative or 0.", "Step 2 is wrong. Subtract instead: `x(x - 4)(x + 4) ≥ 0`, which gives `[-4, 0] ∪ [4, ∞)`."] },
          { id:"e2", goal:3, task:"Solve `(x - 1)^2(x + 3) < 0`.",
            steps:["The zeros are `x = 1` and `x = -3`.", "They split the number line into `(-∞, -3)`, `(-3, 1)` and `(1, ∞)`.", "Test `x = 2`: `(1)^2(5) = 5`, which is positive.", "The signs alternate at each zero, so the chart reads +, −, + from right to left.", "So the solution is `(-3, 1)`."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: two zeros make three intervals.", "Step 3 is correct: `(2 - 1)^2(2 + 3) = 5`.", "", "Step 5 reads step 4’s chart correctly. The mistake is earlier."],
            fixes:[
              { t:"The sign only changes at a zero of odd order. `(x - 1)^2` doesn’t change sign at 1, so from right to left the chart reads +, +, −, and the solution is `(-∞, -3)`.", ok:true, why:"Test `x = 0`: (1)(3) = 3, positive, so `(-3, 1)` can’t be part of the solution." },
              { t:"The chart reads +, +, −, and the solution is `(-∞, -3) ∪ {1}`.", why:"The chart is right now, but `x = 1` makes the product 0, and 0 < 0 is false." },
              { t:"The square makes the product positive for every `x`, so there is no solution.", why:"Only the square is never negative. Test `x = -4`: (25)(−1) = −25, which is negative." },
              { t:"Step 4 is correct as written.", why:"Test `x = 0`, which is in `(-3, 1)`: `(1)^2(3) = 3`, positive, not negative." }],
            hints:["Check step 4 with a test value in the middle interval.", "Try `x = 0`: `(0 - 1)^2(0 + 3) = 3`. Is that what step 4 says?", "Step 4 is wrong: the sign doesn’t change at a zero of order 2. The chart is −, +, + from left to right, so the solution is `(-∞, -3)`."] },
          { id:"e3", goal:2, task:"Solve `x(x + 4)(x - 1) ≥ 12`.",
            steps:["The left side is already factored.", "So set each factor ≥ 12: `x ≥ 12` or `x + 4 ≥ 12` or `x - 1 ≥ 12`.", "That gives `x ≥ 12` or `x ≥ 8` or `x ≥ 13`.", "Any one of them will do, so `x ≥ 8`.", "Solution: `[8, ∞)`."],
            answer:1,
            stepFb:["Step 1 is true: the left side is a product of three factors. Keep checking.", "", "Step 3 solves step 2’s inequalities correctly. The mistake is earlier.", "Step 4 combines step 3 correctly. The mistake is earlier.", "Step 5 follows from step 4. The mistake is earlier."],
            fixes:[
              { t:"Move 12 across first: `x^3 + 3x^2 - 4x - 12 ≥ 0`. Grouping gives `(x + 3)(x + 2)(x - 2) ≥ 0`, so the solution is `[-3, -2] ∪ [2, ∞)`.", ok:true, why:"A product can equal 12 in endless ways, so only 0 on one side lets you use the factors. Check `x = 2`: 2 × 6 × 1 = 12 ≥ 12." },
              { t:"Set each factor ≥ 0 instead: `x ≥ 0`, `x ≥ -4` or `x ≥ 1`, so `x ≥ -4`.", why:"Comparing each factor with 0 doesn’t tell you when the product reaches 12. Test `x = 0`, which is in `[-4, ∞)`: 0 × 4 × (−1) = 0, which isn’t ≥ 12." },
              { t:"Divide both sides by `x` first: `(x + 4)(x - 1) ≥ 12/x`.", why:"Dividing by `x` is unsafe (it could be negative or 0), and it still leaves `x` on both sides." },
              { t:"Step 2 is correct as written.", why:"Test `x = 2`: 2 × 6 × 1 = 12, so 2 satisfies the inequality, but it isn’t in `[8, ∞)`. The zero product idea only works with 0." }],
            hints:["Which step uses an idea that only works when one side is 0?", "If `ab = 0` then `a = 0` or `b = 0`. Nothing like that is true for `ab ≥ 12`.", "Step 2 is wrong. Subtract 12: `x^3 + 3x^2 - 4x - 12 = x^2(x + 3) - 4(x + 3) = (x + 3)(x + 2)(x - 2) ≥ 0`, so `[-3, -2] ∪ [2, ∞)`."] }
        ] },
      { id:"back", type:"custom", title:"Work backwards", summary:"Work backwards", star:true, goal:[3, 5, 6],
        instruction:"These go further than the examples so far. Some run backwards, from the answer to the question. Take your time.",
        how:"",
        items:[
          { id:"b1", kind:"num", goal:3, prompt:"The solution of `(x + 1)(x - 2)(x - k) ≤ 0` is `(-∞, -1] ∪ [2, 5]`. What is `k`?", label:"`k =`", answer:5,
            why:"The endpoints of the solution are the zeros: −1, 2 and `k`. So `k = 5`. Check: `(x + 1)(x - 2)(x - 5)` is negative on `(-∞, -1)` and `(2, 5)`, and ≤ includes the zeros.",
            wrong:[{ v:-5, fb:"`(x - k)` is zero at `x = k`. The missing endpoint is 5, so `k = 5`, not −5." }],
            hints:["Where do the endpoints of a solution set come from?", "They’re the zeros of the polynomial: −1, 2 and `k`.", "The endpoints are −1, 2 and 5, so `k = 5`."] },
          { id:"b2", kind:"num", goal:3, prompt:"`P` is a cubic. The solution of `P(x) ≥ 0` is `[-2, 1] ∪ [3, ∞)`, and `P(0) = 12`. What is `P(2)`?", label:"`P(2) =`", answer:-8,
            why:"The solution’s endpoints are the zeros and the far right is in the solution, so `P(x) = a(x + 2)(x - 1)(x - 3)` with `a > 0`. `P(0) = a(2)(-1)(-3) = 6a = 12`, so `a = 2`. Then `P(2) = 2(4)(1)(-1) = -8`.",
            wrong:[{ v:-4, fb:"You used `a = 1`. Use `P(0) = 12` to find `a` first." }, { v:8, fb:"Check the sign: 2 − 3 = −1, so `P(2)` is negative. That matches the chart: 2 is in `(1, 3)`, which isn’t in the solution." }],
            hints:["Write `P` in factored form from the zeros, with an unknown `a`.", "`P(x) = a(x + 2)(x - 1)(x - 3)`. Substitute `x = 0` to find `a`.", "`6a = 12`, so `a = 2`, and `P(2) = 2(4)(1)(-1) = -8`."] },
          { id:"b3", kind:"iv", goal:2, prompt:"Solve `x^3 - 3x^2 + 4x - 12 > 0`.", answer:"(3, ∞)",
            why:"Grouping: `x^2(x - 3) + 4(x - 3) = (x - 3)(x^2 + 4)`. `x^2 + 4` is never 0 (it’s always at least 4), so it never changes sign and is always positive. The sign comes from `(x - 3)` alone.",
            wrong:{ "(−2, 2) ∪ (3, ∞)":"`x^2 + 4` isn’t `(x - 2)(x + 2)`: that’s `x^2 - 4`. A sum of squares has no real zeros." },
            hints:["Try grouping the first two terms and the last two terms.", "`(x - 3)(x^2 + 4)`. Can `x^2 + 4` ever be 0 or negative?", "`x^2 + 4 > 0` for every `x`, so the inequality is the same as `x - 3 > 0`: `(3, ∞)`."] },
          { id:"b4", kind:"num", goal:5, prompt:"How many integers satisfy `x(x - 4)(x + 2)^2 ≤ 0`?", label:"Number of integers:", answer:6,
            why:"`(x + 2)^2` is never negative, so the sign comes from `x(x - 4)`, which is ≤ 0 on `[0, 4]`. `x = -2` also works, because there the product is 0. So the solution is `{-2} ∪ [0, 4]`: the integers −2, 0, 1, 2, 3, 4.",
            wrong:[{ v:5, fb:"You found `[0, 4]`. Check `x = -2`: the product is 0, and 0 ≤ 0." }, { v:3, fb:"≤ includes the zeros: 0 and 4 count, and so does −2, where the product is also 0." }, { v:7, fb:"That counts every integer from −2 to 4. Check `x = -1`: `(-1)(-5)(1)^2 = 5`, which isn’t ≤ 0." }],
            hints:["Which factor can never be negative?", "`(x + 2)^2 ≥ 0`, so the sign comes from `x(x - 4)`. Where is that ≤ 0? And where is the whole product exactly 0?", "`{-2} ∪ [0, 4]`: the integers −2, 0, 1, 2, 3, 4. That’s 6."] },
          { id:"b5", kind:"iv", goal:2, prompt:"Solve `x^4 + 36 ≤ 13x^2`.", answer:"[−3, −2] ∪ [2, 3]",
            why:"Move `13x^2` across: `x^4 - 13x^2 + 36 ≤ 0`. As a quadratic in `x^2`: `(x^2 - 4)(x^2 - 9) ≤ 0`, so `(x + 3)(x + 2)(x - 2)(x - 3) ≤ 0`. Four zeros of order 1: +, −, +, −, +.",
            wrong:{ "[4, 9]":"Those are the values of `x^2`, not `x`. If `4 ≤ x^2 ≤ 9`, then `x` is between 2 and 3 or between −3 and −2.", "(−∞, −3] ∪ [−2, 2] ∪ [3, ∞)":"That’s where the product is ≥ 0.", "[−3, 3]":"Test `x = 0`: 36 ≤ 0 is false." },
            hints:["Get 0 on one side first.", "`x^4 - 13x^2 + 36 = (x^2 - 4)(x^2 - 9)`. Factor each one again.", "`(x + 3)(x + 2)(x - 2)(x - 3) ≤ 0` on `[-3, -2] ∪ [2, 3]`."] },
          { id:"b6", kind:"mc", goal:6, star:true, prompt:"An open box is made from a 16 cm by 10 cm card by cutting squares of side `x` cm from the corners, so `V(x) = x(16 - 2x)(10 - 2x)`. Can the box hold <strong>more than</strong> 144 cm³?",
            options:[
              { t:"No: the volume is at most 144 cm³, reached only at `x = 2`.", ok:true, why:"`V(x) - 144 = 4(x - 2)^2(x - 9)`. For every possible cut (`0 < x < 5`), `(x - 2)^2 ≥ 0` and `x - 9 < 0`, so `V(x) - 144 ≤ 0`, with equality only at `x = 2`. The largest possible volume is exactly 144 cm³." },
              { t:"Yes: for every cut with `2 < x < 5`.", why:"The sign doesn’t change at 2: `(x - 2)^2` is a square. Check `x = 3`: `V(3)` = 3 × 10 × 4 = 120." },
              { t:"Yes: for every cut with `x > 9`.", why:"The algebra is right, but the card is 10 cm wide, so `x` must be less than 5." },
              { t:"Yes: for the cut with `x = 2` exactly.", why:"At `x = 2` the volume is exactly 144 cm³, not more than 144." }],
            hints:["Write `V(x) - 144 > 0` and expand `V(x)`.", "`V(x) - 144 = 4x^3 - 52x^2 + 160x - 144 = 4(x^3 - 13x^2 + 40x - 36)`. Test `x = 2`.", "`x = 2` is a root, and the polynomial factors as `4(x - 2)^2(x - 9)`. For `0 < x < 5` this is never positive, so the answer is no; the maximum is 144 cm³ at `x = 2`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Look back at your prediction in P2 or P4. What did you expect, and what actually happened? Why?" },
      { id:"j2", q:"In your own words, why can a polynomial only change sign at its zeros, and why doesn’t it change sign at a zero of order 2?" },
      { id:"j3", q:"Explain to a friend, step by step, how to solve `x^3 > 4x`, and why dividing both sides by `x` gives the wrong answer." },
      { id:"j4", q:"Which part of solving inequalities still trips you up (rearranging, the signs, the endpoints, or the context)? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:5,
        a:{ prompt:"Solve `(x + 5)(x + 1)(x - 2) > 0`.", options:[
          { t:"`(-5, -1) ∪ (2, ∞)`", ok:true, why:"Three zeros of order 1 and a positive leading coefficient give −, +, −, +. With >, the zeros aren’t included." },
          { t:"`(-∞, -5) ∪ (-1, 2)`", why:"That’s where the product is negative." },
          { t:"`[-5, -1] ∪ [2, ∞)`", why:"With >, the zeros give 0, which doesn’t count. Use round brackets." },
          { t:"`x = -5`, `x = -1` or `x = 2`", why:"Those solve the equation. The inequality’s solution is intervals." }] },
        b:{ prompt:"Solve `(x + 2)(x - 3)(x - 5) < 0`.", options:[
          { t:"`(-∞, -2) ∪ (3, 5)`", ok:true, why:"The signs are −, +, −, +, and < asks for the negative intervals." },
          { t:"`(-2, 3) ∪ (5, ∞)`", why:"That’s where the product is positive." },
          { t:"`(-∞, -2] ∪ [3, 5]`", why:"With <, the zeros aren’t included." },
          { t:"`x = -2`, `x = 3` or `x = 5`", why:"Those solve the equation, not the inequality." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"`P(x) = (x - 4)^2(x + 1)`. Which is the sign row of its chart on `(-∞, -1)`, `(-1, 4)` and `(4, ∞)`?", options:[
          { t:"−, +, +", ok:true, why:"`(x - 4)^2` is never negative, so the sign changes only at −1, the zero of odd order." },
          { t:"+, −, +", why:"That alternates at every zero. The sign doesn’t change at 4, a zero of order 2." },
          { t:"−, +, −", why:"That alternates from the left. At 4 the squared factor keeps the sign the same." },
          { t:"+, +, +", why:"Only `(x - 4)^2` is never negative. Test `x = -2`: (36)(−1) = −36." }] },
        b:{ prompt:"`P(x) = (x + 3)^2(x - 1)`. Which is the sign row of its chart on `(-∞, -3)`, `(-3, 1)` and `(1, ∞)`?", options:[
          { t:"−, −, +", ok:true, why:"`(x + 3)^2` is never negative, so the sign changes only at 1." },
          { t:"+, −, +", why:"That alternates at every zero. The sign doesn’t change at −3." },
          { t:"−, +, −", why:"That alternates from the left. At −3 the squared factor keeps the sign the same." },
          { t:"+, +, +", why:"Only `(x + 3)^2` is never negative. Test `x = 0`: (9)(−1) = −9." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"Which inequality has the same solutions as `x^3 + 2x^2 > 15x`?", options:[
          { t:"`x(x + 5)(x - 3) > 0`", ok:true, why:"Subtract `15x`: `x^3 + 2x^2 - 15x = x(x^2 + 2x - 15) = x(x + 5)(x - 3)`." },
          { t:"`x^2 + 2x > 15`", why:"That divides both sides by `x`, which could be negative or 0." },
          { t:"`x(x - 5)(x + 3) > 0`", why:"Expand `(x - 5)(x + 3)`: `x^2 - 2x - 15`. The middle term must be `+2x`." },
          { t:"`x(x + 5)(x - 3) < 0`", why:"Subtracting `15x` from both sides doesn’t flip the sign. Only multiplying or dividing by a negative does." }] },
        b:{ prompt:"Which inequality has the same solutions as `x^3 - x^2 ≥ 12x`?", options:[
          { t:"`x(x - 4)(x + 3) ≥ 0`", ok:true, why:"Subtract `12x`: `x(x^2 - x - 12) = x(x - 4)(x + 3)`." },
          { t:"`x^2 - x ≥ 12`", why:"That divides both sides by `x`, which could be negative or 0." },
          { t:"`x(x + 4)(x - 3) ≥ 0`", why:"Expand `(x + 4)(x - 3)`: `x^2 + x - 12`. The middle term must be `-x`." },
          { t:"`x(x - 4)(x + 3) ≤ 0`", why:"Subtracting doesn’t flip the sign." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"The graphs of `f(x) = x^3 + x^2` and `g(x) = 6x` are shown on a grid; their three meeting points are not labelled. Solve `f(x) ≤ g(x)`." + fig("t1a", "Graphs of a cubic f of x equals x cubed plus x squared and the line g of x equals 6x on a grid, meeting three times"), options:[
          { t:"`(-∞, -3] ∪ [0, 2]`", ok:true, why:"`f - g = x^3 + x^2 - 6x = x(x + 3)(x - 2)`, so the graphs meet at `x = -3`, 0 and 2, and the signs are −, +, −, +. `f ≤ g` where `f - g ≤ 0`, including the meeting points." },
          { t:"`[-3, 0] ∪ [2, ∞)`", why:"That’s where `f` is above `g`." },
          { t:"`(-∞, -3) ∪ (0, 2)`", why:"≤ includes the points where the graphs meet." },
          { t:"`[-3, 2]`", why:"That comes from dividing by `x`: `x^2 + x ≤ 6`. Between −3 and 0 the cubic is above the line (try `x = -1`: 0 > −6)." }] },
        b:{ prompt:"The graphs of `f(x) = x^3 - 2x^2` and `g(x) = 3x` are shown on a grid; their three meeting points are not labelled. Solve `f(x) ≤ g(x)`." + fig("t1b", "Graphs of a cubic f of x equals x cubed minus 2 x squared and the line g of x equals 3x on a grid, meeting three times"), options:[
          { t:"`(-∞, -1] ∪ [0, 3]`", ok:true, why:"`f - g = x^3 - 2x^2 - 3x = x(x - 3)(x + 1)`, so the graphs meet at `x = -1`, 0 and 3, and the signs are −, +, −, +. Keep the negative intervals and the meeting points." },
          { t:"`[-1, 0] ∪ [3, ∞)`", why:"That’s where `f` is above `g`." },
          { t:"`(-∞, -1) ∪ (0, 3)`", why:"≤ includes the meeting points." },
          { t:"`[-1, 3]`", why:"That comes from dividing by `x`: `x^2 - 2x ≤ 3`. Between −1 and 0 the cubic is above the line (try `x = -0.5`: `f = -0.625` and `g = -1.5`)." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"Solve `x^4 < 9x^2`.", options:[
          { t:"`(-3, 0) ∪ (0, 3)`", ok:true, why:"`x^4 - 9x^2 = x^2(x - 3)(x + 3)`. `x^2` is never negative and is 0 at `x = 0`, so the product is negative on `(-3, 3)` except at 0, where it’s 0." },
          { t:"`(-3, 3)`", why:"That divides by `x^2`. At `x = 0`, 0 < 0 is false." },
          { t:"`(-∞, -3) ∪ (3, ∞)`", why:"That’s where `x^4 > 9x^2`." },
          { t:"`(-∞, -3) ∪ (0, 3)`", why:"That alternates the sign at 0, but 0 is a zero of order 2." }] },
        b:{ prompt:"Solve `x^4 < 4x^2`.", options:[
          { t:"`(-2, 0) ∪ (0, 2)`", ok:true, why:"`x^4 - 4x^2 = x^2(x - 2)(x + 2)`, which is negative on `(-2, 2)` except at 0." },
          { t:"`(-2, 2)`", why:"At `x = 0`, 0 < 0 is false." },
          { t:"`(-∞, -2) ∪ (2, ∞)`", why:"That’s where `x^4 > 4x^2`." },
          { t:"`(-∞, -2) ∪ (0, 2)`", why:"0 is a zero of order 2: the sign doesn’t change there." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"How many integers satisfy `(x + 4)(x - 1)^2(x - 3) < 0`?", options:[
          { t:"5", ok:true, why:"The solution is `(-4, 1) ∪ (1, 3)`: the sign doesn’t change at 1, and `x = 1` gives 0. The integers are −3, −2, −1, 0, 2." },
          { t:"6", why:"That counts `x = 1`, where the product is 0, and 0 < 0 is false." },
          { t:"8", why:"That counts every integer from −4 to 3, including the zeros −4, 1 and 3. The product is 0 there, and with < the zeros don’t count." },
          { t:"Infinitely many", why:"That alternates the sign at 1. Left of −4 the product is positive." }] },
        b:{ prompt:"How many integers satisfy `(x + 3)(x - 2)^2(x - 5) < 0`?", options:[
          { t:"6", ok:true, why:"The solution is `(-3, 2) ∪ (2, 5)`. The integers are −2, −1, 0, 1, 3, 4." },
          { t:"7", why:"That counts `x = 2`, where the product is 0." },
          { t:"9", why:"That counts every integer from −3 to 5, including the zeros −3, 2 and 5, where the product is 0." },
          { t:"Infinitely many", why:"That alternates the sign at 2. Left of −3 the product is positive." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which correctly describes the solution of `x(x - 2)^2 ≤ 0`?", options:[
          { t:"`(-∞, 0] ∪ {2}`", ok:true, why:"`x ≤ 0` makes the product ≤ 0, and `x = 2` makes it 0. A single point is written in braces." },
          { t:"`(-∞, 0]`", why:"`x = 2` also works: the product is 0 there, and 0 ≤ 0." },
          { t:"`[-∞, 0] ∪ {2}`", why:"Infinity always takes a round bracket." },
          { t:"`(-∞, 0] ∩ {2}`", why:"∩ means “and”, which would leave nothing. Use ∪." }] },
        b:{ prompt:"Which correctly describes the solution of `(x - 2)^2(x + 3) ≤ 0`?", options:[
          { t:"`(-∞, -3] ∪ {2}`", ok:true, why:"`x ≤ -3` makes the product ≤ 0, and `x = 2` makes it 0." },
          { t:"`(-∞, -3]`", why:"`x = 2` also works: the product is 0 there." },
          { t:"`[-∞, -3] ∪ {2}`", why:"Infinity always takes a round bracket." },
          { t:"`(-∞, -3] ∩ {2}`", why:"∩ means “and”. Use ∪." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why `x = 2` is <strong>not</strong> a solution of `(x - 2)^2(x + 5) > 0`?", options:[
          { t:"At `x = 2` the product equals 0, and 0 > 0 is false.", ok:true, why:"Checking a value means substituting it and testing the inequality." },
          { t:"Because the graph crosses the `x`-axis at `x = 2`.", why:"It touches the axis there (order 2), and crossing or not doesn’t decide this anyway." },
          { t:"Because `(x - 2)^2` is negative when `x < 2`.", why:"A square is never negative." },
          { t:"Because a zero of a polynomial is never a solution of an inequality.", why:"Zeros are solutions of ≤ and ≥ inequalities." }] },
        b:{ prompt:"Which is the best explanation of why `x = -2` <strong>is</strong> a solution of `(x + 2)^2(x - 4) ≤ 0`?", options:[
          { t:"At `x = -2` the product equals 0, and 0 ≤ 0 is true.", ok:true, why:"Substitute and test: that’s what makes it a solution." },
          { t:"Because the graph crosses the `x`-axis at `x = -2`.", why:"It touches the axis there (order 2), and crossing or not doesn’t decide this anyway." },
          { t:"Because `(x + 2)^2` is negative when `x < -2`.", why:"A square is never negative." },
          { t:"Because every zero of a polynomial is a solution of every inequality.", why:"Not for < or >: there, 0 doesn’t count." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A shipping container has width `x` m, height `(x + 1)` m and length `(x + 2)` m. For which `x` is its volume <strong>at least</strong> 60 m³?", options:[
          { t:"`[3, ∞)`", ok:true, why:"`x(x + 1)(x + 2) - 60 = x^3 + 3x^2 + 2x - 60`. `x = 3` gives 0, so it factors as `(x - 3)(x^2 + 6x + 20)`. The quadratic has no real zeros (36 − 80 < 0) and is always positive, so the sign comes from `x - 3`." },
          { t:"`(3, ∞)`", why:"“At least 60” includes 60: at `x = 3` the volume is 3 × 4 × 5 = 60." },
          { t:"`(0, 3]`", why:"That’s where the volume is at most 60 m³." },
          { t:"`[∛60, ∞)`", why:"That treats the container as a cube of side `x`. Its three dimensions are different." }] },
        b:{ prompt:"A storage bin has width `x` m, height `(x + 1)` m and length `(x + 3)` m. For which `x` is its volume <strong>at least</strong> 72 m³?", options:[
          { t:"`[3, ∞)`", ok:true, why:"`x^3 + 4x^2 + 3x - 72 = (x - 3)(x^2 + 7x + 24)`. The quadratic has no real zeros (49 − 96 < 0), so the sign comes from `x - 3`." },
          { t:"`(3, ∞)`", why:"At `x = 3` the volume is 3 × 4 × 6 = 72, which counts." },
          { t:"`(0, 3]`", why:"That’s where the volume is at most 72 m³." },
          { t:"`[∛72, ∞)`", why:"That treats the bin as a cube of side `x`." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A small company’s profit is `P(x) = -x^3 + 12x^2 - 20x` thousand dollars, where `x` is the number of items made, in hundreds (`0 ≤ x ≤ 12`). For which production levels is the profit <strong>positive</strong>?", options:[
          { t:"`2 < x < 10`", ok:true, why:"`P(x) = -x(x - 2)(x - 10)`. With the leading −1, the signs are +, −, +, −, so `P > 0` on `(-∞, 0) ∪ (2, 10)`. Only `0 ≤ x ≤ 12` makes sense, so the profit is positive for `2 < x < 10`: between 200 and 1000 items." },
          { t:"`x < 0` or `2 < x < 10`", why:"A company can’t make a negative number of items." },
          { t:"`0 < x < 2` or `10 < x ≤ 12`", why:"That ignores the leading −1. Test `x = 5`: `P(5)` = −125 + 300 − 100 = 75, a profit." },
          { t:"`2 ≤ x ≤ 10`", why:"At `x = 2` and `x = 10` the profit is 0, which isn’t positive." }] },
        b:{ prompt:"A company’s profit is `P(x) = -x^3 + 10x^2 - 16x` thousand dollars, where `x` is the number of items made, in hundreds (`0 ≤ x ≤ 10`). For which production levels is the profit <strong>positive</strong>?", options:[
          { t:"`2 < x < 8`", ok:true, why:"`P(x) = -x(x - 2)(x - 8)`, which is positive on `(-∞, 0) ∪ (2, 8)`. Only `0 ≤ x ≤ 10` makes sense, so the profit is positive for `2 < x < 8`: between 200 and 800 items." },
          { t:"`x < 0` or `2 < x < 8`", why:"A company can’t make a negative number of items." },
          { t:"`0 < x < 2` or `8 < x ≤ 10`", why:"That ignores the leading −1. Test `x = 4`: `P(4)` = −64 + 160 − 64 = 32, a profit." },
          { t:"`2 ≤ x ≤ 8`", why:"Zero profit isn’t positive." }] } }
    ]
  },
  task:{
    title:"Design the solution set", summary:"Design the solution set",
    statement:"<p>Design an inequality `P(x)` □ 0, with `P` in factored form, so that:</p><ul><li>`P` has <strong>degree 4</strong>;</li><li>`x = 1` <strong>is</strong> a solution, but <strong>no other number strictly between 0 and 2</strong> is (0 and 2 themselves may or may not be solutions);</li><li><strong>every</strong> `x ≥ 4` is a solution;</li><li>`x = -2` is <strong>not</strong> a solution.</li></ul><p>There’s more than one answer. Reason it out before you build: each condition forces something.</p>",
    how:"Each zero is a whole number from −5 to 5 (no repeats) with an order. The dashed marks on the number line are the targets: the points −2 and 1, the interval `(0, 2)` and the ray `[4, ∞)`.",
    checks:["`P` has degree 4", "`x = 1` is a solution", "No other number in `(0, 2)` is a solution", "Every `x ≥ 4` is a solution", "`x = -2` is not a solution"],
    tips:[
      "Add the orders: right now they total {sum}. You need 4.",
      "Right now {p1}. A single point like `x = 1` is easiest to include as a zero, with ≤ or ≥.",
      "If 1 is a solution but the numbers right next to it aren’t, the sign must stay the “wrong” sign on both sides of 1. What order of zero keeps the sign the same?",
      "Look at the far right: there, `P` has the sign of `a`. Every zero must be at 4 or to its left, and the sign to the right of the last zero must satisfy the inequality.",
      "Right now {p2}, which satisfies the inequality. Where can the fourth zero go so that the sign at −2 is the “wrong” one?"
    ],
    explainPrompt:"Explain why your design meets each condition. Which condition forced the order of the zero at 1, and which forced where your fourth zero went?",
    vocab:"Use the words order, sign change, included and leading coefficient.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another?",
    after3:"Notice what was forced: an order-2 zero at 1 with ≤ or ≥; a zero of order 1 at 2, 3 or 4, so that the sign changes before 4 and stays right from 4 on; and the fourth zero to the <strong>left of −2</strong>, because a zero at −2 or to its right would put −2 in the solution."
  },
  cards:[
    ["Equation vs inequality", "`P(x) = 0` has a few solutions (the zeros). `P(x) > 0` has whole intervals of solutions."],
    ["First step for any polynomial inequality", "Move everything to one side so the other side is 0. Never divide by `x`: it could be negative or 0."],
    ["Why a sign chart works", "A polynomial can only change sign at its zeros, so its sign is constant between neighbouring zeros. One test value per interval is enough."],
    ["Zero of odd order vs even order", "Odd order (1, 3): the sign changes, and the graph crosses. Even order (2): the sign stays the same, and the graph touches."],
    ["Sign at the far right", "For large `x`, `P(x)` has the sign of the leading coefficient `a`. `(2 - x)` counts as `-(x - 2)`."],
    ["< and > vs ≤ and ≥", "< and >: zeros excluded, round brackets, open circles. ≤ and ≥: zeros included, square brackets, filled dots. ∞ always takes a round bracket."],
    ["A single-point solution", "`x(x - 3)^2 ≤ 0` has solution `(-∞, 0] ∪ {3}`, that is, `x ≤ 0` or `x = 3`. The zero of even order counts on its own."],
    ["`f(x) > 0` on a graph", "The `x`-values where the graph is above the `x`-axis. `f(x) < 0`: below."],
    ["`f(x) > g(x)`", "Where the graph of `f` is above the graph of `g`. Same as `f(x) - g(x) > 0`; the meeting points are the boundaries."],
    ["A factor with no real zeros, like `x^2 + 4`", "It never changes sign (`x^2 + 4 ≥ 4 > 0`), so it doesn’t affect the solution. `(x - 3)(x^2 + 4) > 0` means `x > 3`."],
    ["The zero product idea and inequalities", "It only works with 0. For `(x + 2)(x - 4) ≥ 7`, subtract 7 first: `(x - 5)(x + 3) ≥ 0`."],
    ["Answer in context", "Solve the inequality, then keep only the values that make sense (lengths positive, cuts smaller than half the width)."]
  ]
};
