// MHF4U 02 Stating Intervals. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/02-stating-intervals.md
const fig = (key, aria, cls) => '<canvas class="plot' + (cls ? " " + cls : "") + '" data-fig="' + key + '" role="img" aria-label="' + aria + '"></canvas>';

// Small number-line pictures for sorter tiles (−5 … 5); dots at −3 and 2.
function nlSVG(leftClosed, rightClosed){
  const X = v => 10 + (v + 5) * 14;
  const dot = (v, closed) => '<circle cx="' + X(v) + '" cy="12" r="4.5" fill="' + (closed ? "var(--pen)" : "var(--sheet)") + '" stroke="var(--pen)" stroke-width="2"/>';
  return '<svg width="160" height="30" viewBox="0 0 160 30" aria-hidden="true" style="vertical-align:middle"><path d="M4 12H156" stroke="currentColor" stroke-width="1.3"/>' +
    [-5,-4,-3,-2,-1,0,1,2,3,4,5].map(v => '<path d="M' + X(v) + ' 8V16" stroke="currentColor" stroke-width="1"/>').join("") +
    '<path d="M' + X(-3) + " 12H" + X(2) + '" stroke="var(--pen)" stroke-width="4"/>' + dot(-3, leftClosed) + dot(2, rightClosed) +
    '<text x="' + X(-3) + '" y="28" font-size="10" text-anchor="middle" fill="currentColor">−3</text><text x="' + X(2) + '" y="28" font-size="10" text-anchor="middle" fill="currentColor">2</text></svg>';
}

const M1 = "The numbers match, but check each end: is the endpoint included (≤, ≥, closed dot, “at least”, “at most”) or not (<, >, open dot, “not including”)?";
const M5 = "“Or” (or “not in”) makes two separate pieces. “And” with two bounds makes one piece.";
const NOLOW = "Check the left end: this set has no lower bound, so it runs all the way to −∞.";
const HASLOW = "Check the left end: this set starts at −3, so it doesn’t run to −∞.";
const BOX = { b1:"one-ray", b2:"one", b3:"one", b4:"two" };
function wrongFor(box, special){
  const w = {};
  for (const b of ["b1", "b2", "b3", "b4"]) {
    if (b === box) continue;
    if (special && (b === "b2" || b === "b3")) { w[b] = "Read 2 ≥ `x` as “`x` is at most 2”. There’s no lower bound, so the set runs to −∞."; continue; }
    if ((BOX[b] === "two") !== (BOX[box] === "two")) w[b] = M5;
    else if ((box === "b2" && b === "b3") || (box === "b3" && b === "b2")) w[b] = M1;
    else if (box === "b1") w[b] = NOLOW;
    else w[b] = HASLOW;
  }
  return w;
}
const H1 = "Rewrite the item as an inequality in `x`, smaller number on the left.";
const H2 = "Is each endpoint included? Is there one piece or two?";
const sortItem = (id, t, box, why, ineq, iv, special, hints) => ({ id, t, answer:box, why, goal:[1, 2], wrong:wrongFor(box, special),
  hints:hints || [H1, H2, MD(t) + " is " + ineq + ", which is " + iv + "."] });
function MD(t){ return t.startsWith("<svg") ? "This number line" : t; }

export default {
  id:"02-stating-intervals",
  kind:"topic",
  title:"Stating intervals",
  topic:"Stating Intervals",
  readyTopic:"stating intervals",
  hero:{
    eq:"`(-2, 5]`", eqLabel:"the interval from negative 2, not included, to 5, included", eqSize:"md",
    headline:"One set, three ways to write it",
    text:"Mathematicians describe sets of numbers all the time: where a graph rises, where it’s above the axis, which inputs are allowed. An <strong>inequality</strong> (`-2 < x ≤ 5`), <strong>set notation</strong> (`{x ∈ ℝ | -2 < x ≤ 5}`) and <strong>interval notation</strong> (`(-2, 5]`) all say the same thing. The brackets do the work: a <strong>square bracket</strong> includes the endpoint and a <strong>round bracket</strong> leaves it out.",
    fig:{ html:'<div class="hero-nl"><canvas class="plot nl" id="hero-nl1" role="img" aria-label="Number line with an open dot at negative 2, a closed dot at 5 and the segment between them shaded"></canvas><p class="hero-forms" id="hero-f1" aria-live="polite"></p><canvas class="plot nl" id="hero-nl2" role="img" aria-label="Number line with a closed dot at negative 3 shaded to the left, and an open dot at 1 shaded to the right"></canvas><p class="hero-forms" id="hero-f2" aria-live="polite"></p></div>' }
  },
  goals:[
    "I can translate between an inequality, set notation and interval notation, including pieces joined with ∪.",
    "I can choose round or square brackets correctly, including at ±∞.",
    "I can read from a graph the intervals where a function is increasing or decreasing.",
    "I can read from a graph the intervals where a function is positive or negative.",
    "I can state the domain and range of a graph that has open or closed endpoints.",
    "I can combine conditions (for example “increasing and positive”) and work backwards from intervals to a graph."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Inequalities on a number line", goal:2,
          prompt:"A number line has an open dot at 3, with shading from the dot to the left. Which inequality does it show?",
          options:[
            { t:"`x < 3`", ok:true, why:"The open dot means 3 itself is left out, and the shading goes left, toward smaller numbers." },
            { t:"`x ≤ 3`", why:"An open dot means the endpoint is <strong>not</strong> in the set. A closed (filled) dot would mean ≤." },
            { t:"`x > 3`", why:"Shading to the left covers the numbers <strong>smaller</strong> than 3, like 2, 0 and −5." },
            { t:"`x ≥ 3`", why:"This has the direction and the dot both reversed. Left of 3 means smaller than 3; an open dot means 3 is left out." }],
          hints:["Ask two questions: which way does the shading go, and is the dot filled in?", "Shading to the left means smaller numbers. An open dot means the endpoint isn’t included.", "Smaller than 3, not including 3: `x < 3`."] },
        { id:"w2", skill:"Inequalities on a number line", goal:1,
          prompt:"Which list gives <strong>every</strong> integer that satisfies `-2 < x ≤ 1`?",
          options:[
            { t:"−1, 0, 1", ok:true, why:"−2 is left out (the < is strict) and 1 is included (≤). The integers in between are −1 and 0." },
            { t:"−2, −1, 0", why:"This includes −2 but leaves out 1. The inequality says the opposite: `-2 < x` excludes −2 and `x ≤ 1` includes 1." },
            { t:"−2, −1, 0, 1", why:"`-2 < x` means `x` must be bigger than −2, so −2 itself doesn’t count." },
            { t:"−1, 0", why:"`x ≤ 1` includes 1. Only the strict sign (<) leaves its endpoint out." }],
          hints:["Check each end separately: is the sign strict (<) or not (≤)?", "`-2 < x`: −2 is left out. `x ≤ 1`: 1 is included.", "The integers bigger than −2 and up to 1 are −1, 0 and 1."] },
        { id:"w3", skill:"Solving linear inequalities", goal:1,
          prompt:"Solve `5 - 2x > 11`.",
          options:[
            { t:"`x < -3`", ok:true, why:"Subtract 5: `-2x > 6`. Divide by −2 and flip the sign: `x < -3`. Check `x = -4`: 5 + 8 = 13 > 11." },
            { t:"`x > -3`", why:"Dividing both sides by −2 reverses the inequality. Test `x = 0`: 5 > 11 is false, so `x > -3` can’t be right." },
            { t:"`x > 3`", why:"The term is `-2x`, not `2x`. Test `x = 4`: 5 − 8 = −3, which isn’t greater than 11." },
            { t:"`x < -8`", why:"Moving the 5 means subtracting it from both sides: `-2x > 11 - 5 = 6`, not 16." }],
          hints:["Get `-2x` alone first, then divide.", "Subtract 5 from both sides: `-2x > 6`. What happens to the sign when you divide by a negative?", "Dividing by −2 flips > to <: `x < -3`."] },
        { id:"w4", skill:"Domain and range", goal:5,
          prompt:"What is the range of `y = x^2 - 4`?",
          options:[
            { t:"`{y ∈ ℝ | y ≥ -4}`", ok:true, why:"`x^2` is never negative, so the smallest `y` is 0 − 4 = −4, at `x = 0`. Every value above −4 is reached too." },
            { t:"`{y ∈ ℝ | y ≤ -4}`", why:"The coefficient of `x^2` is +1, so the parabola opens up. −4 is its lowest point, not its highest." },
            { t:"`{x ∈ ℝ}`", why:"That’s the domain: every `x` is allowed. The range is about the `y`-values the graph reaches." },
            { t:"`{y ∈ ℝ | y ≥ 4}`", why:"The vertex is (0, −4). The graph goes down to −4, below the `x`-axis." }],
          hints:["What’s the smallest value `x^2` can be?", "`x^2 ≥ 0`, so `x^2 - 4 ≥ -4`. Does the parabola open up or down?", "It opens up with lowest point (0, −4), so the range is `{y ∈ ℝ | y ≥ -4}`."] },
        { id:"w5", skill:"Domain and range", goal:5,
          prompt:"A graph is a single straight segment from a closed dot at (−3, 2) to an open dot at (4, −1). What is its domain?",
          options:[
            { t:"`{x ∈ ℝ | -3 ≤ x < 4}`", ok:true, why:"The `x`-values run from −3 (closed dot, included) to 4 (open dot, left out)." },
            { t:"`{x ∈ ℝ | -3 < x ≤ 4}`", why:"The closed dot is at `x = -3`, so −3 is included; the open dot at `x = 4` leaves 4 out." },
            { t:"`{x ∈ ℝ | -1 < x ≤ 2}`", why:"−1 and 2 are the `y`-coordinates. That’s the range. The domain uses the `x`-coordinates." },
            { t:"`{x ∈ ℝ | -3 ≤ x ≤ 4}`", why:"The open dot at (4, −1) means the graph stops just before `x = 4`, so 4 is not in the domain." }],
          hints:["The domain is the set of `x`-values the graph covers. Look at the `x`-coordinates of the two ends.", "The ends are at `x = -3` (closed) and `x = 4` (open).", "From −3, included, up to 4, not included: `{x ∈ ℝ | -3 ≤ x < 4}`."] },
        { id:"w6", skill:"Reading a graph", goal:3,
          prompt:"The graph of `y = (x - 1)^2 - 4` is shown (vertex (1, −4), zeros −1 and 3). For which `x`-values does the graph go <strong>down</strong> as you move to the right?" + fig("w6", "Parabola opening up with vertex (1, negative 4) and zeros at negative 1 and 3"),
          options:[
            { t:"`x < 1`", ok:true, why:"Left of the vertex, the parabola falls as you move right. After `x = 1` it rises." },
            { t:"`x > 1`", why:"Right of the vertex the parabola rises. Trace it with your finger from left to right." },
            { t:"`y > -4`", why:"The question asks for `x`-values: where along the horizontal axis the graph is falling." },
            { t:"`-1 < x < 3`", why:"Between the zeros the graph is <strong>below</strong> the axis, but it falls only until `x = 1` and then rises." }],
          hints:["Imagine walking along the graph from left to right. Where are you walking downhill?", "The lowest point is the vertex (1, −4). You walk downhill until you reach it.", "The graph falls for every `x` less than 1: `x < 1`."] }
      ],
      refreshers:{
        "Inequalities on a number line":"A closed dot means the endpoint is included (≤ or ≥); an open dot means it’s left out (< or >). The shading shows which side: left for smaller numbers, right for bigger ones. Example: `-2 < x ≤ 1` has an open dot at −2, a closed dot at 1, and shading between them.",
        "Solving linear inequalities":"Solve like an equation, with one extra rule: multiplying or dividing both sides by a negative number reverses the sign. Example: `-2x > 6` becomes `x < -3`. Check with a test value: `x = -4` gives 8 > 6, which is true.",
        "Domain and range":"The domain is every `x`-value the graph covers; the range is every `y`-value. Look at the ends of the graph and at its highest and lowest points. A closed dot includes its value; an open dot leaves it out. Example: a segment from a closed dot at (−3, 2) to an open dot at (4, −1) has domain `-3 ≤ x < 4`.",
        "Reading a graph":"Read graphs from left to right. Going up means increasing; going down means decreasing. Above the `x`-axis means positive; below means negative. These are four different questions, and each answer is a set of `x`-values."
      }
    }
  },
  explore:{
    heading:"Interval builder",
    intro:"Drag the endpoints, choose open or closed, and watch the three notations change together. Add a second piece, or switch to “Everything else” to see the numbers left out.",
    predIntro:"Make a prediction first. Then the builder will show you what really happens.",
    predictions:[
      { id:"p1", start:{ pieces:[{ a:-2, b:5, aIn:true, bIn:false }] },
        prompt:"The right handle will be dragged off the end of the line, to ∞. What will the interval notation become?",
        options:[{ t:"`[-2, ∞)`", ok:true }, { t:"`[-2, ∞]`" }, { t:"`(-2, ∞)`" }, { t:"`(-∞, -2]`" }],
        explain:"Only the right end changed. −2 is still included, so its square bracket stays. ∞ isn’t a number the set can reach, so it always takes a round bracket. `[-2, ∞]` would claim ∞ is in the set, and `(-∞, -2]` is the numbers on the other side." },
      { id:"p2", start:{ pieces:[{ a:-5, b:1, aIn:false, bIn:false, aInf:true, bInf:false }, { a:3, b:7, aIn:false, bIn:false, aInf:false, bInf:true }] },
        prompt:"The second piece’s left handle will slide from 3 down to 1 and be set to closed. What will the set be?",
        options:[{ t:"Every real number, `(-∞, ∞)`", ok:true }, { t:"`(-∞, 1) ∪ (1, ∞)`" }, { t:"`(-∞, 1) ∪ [1, ∞)`, which can’t be simplified" }, { t:"The pieces overlap, so the set is empty" }],
        explain:"The first piece gives every number below 1, and the second now starts at 1 and includes it. Together they cover every real number with no gap, so the set is `(-∞, ∞)`, all of ℝ. If both pieces were open at 1, the value 1 would be missing." },
      { id:"p3", start:{ pieces:[{ a:-3, b:4, aIn:false, bIn:true }] },
        prompt:"Switch to “Everything else”. What is the set of numbers <strong>not</strong> in `(-3, 4]`?",
        options:[{ t:"`(-∞, -3] ∪ (4, ∞)`", ok:true }, { t:"`(-∞, -3) ∪ [4, ∞)`" }, { t:"`(-∞, -3) ∪ (4, ∞)`" }, { t:"`(-∞, -3] ∩ (4, ∞)`" }],
        explain:"−3 wasn’t in the set, so it belongs to everything else: closed. 4 was in the set, so it’s left out of everything else: open. Every endpoint flips. The two outside pieces are joined with ∪, because a number is in one piece <strong>or</strong> the other. ∩ would ask for numbers in both, and there are none." },
      { id:"p4", start:{ pieces:[{ a:-3, b:3, aIn:false, bIn:false, aInf:true, bInf:true }] },
        prompt:"A tool will punch out the single value 2. How do you write what’s left?",
        options:[{ t:"`(-∞, 2) ∪ (2, ∞)`", ok:true }, { t:"`(-∞, ∞)`, since one number doesn’t matter" }, { t:"`(-∞, 2] ∪ [2, ∞)`" }, { t:"`(-∞, 2) ∩ (2, ∞)`" }],
        explain:"Leaving out one value splits the line into two pieces that touch at an open dot. Square brackets at 2 would put 2 back in. You’ll meet this shape again in module 17, where a function like `y = 1/(x - 2)` has domain `{x ∈ ℝ | x ≠ 2}`." }
    ],
    chalIntro:"Set the builder, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 2], prompt:"Build the set of numbers that are <strong>at least −4 but less than 6</strong>.",
        why:"“At least −4” is −4 ≤ `x` (closed) and “less than 6” is `x < 6` (open): `[-4, 6)`.",
        hints:["“At least” means ≥. “Less than” means <.", "`-4 ≤ x < 6`: closed at −4, open at 6.", "Drag the handles to −4 and 6. Set −4 to closed and 6 to open: `[-4, 6)`."] },
      { id:"tc2", goal:[1, 2], prompt:"Build the set whose “Everything else” is <strong>`[-1, 4)`</strong>. (The check looks at the set itself.)",
        why:"−1 is in `[-1, 4)`, so it’s left out of your set; 4 isn’t, so it’s in your set: `(-∞, -1) ∪ [4, ∞)`.",
        hints:["Your set is everything to the left of −1 and everything from 4 on. What happens at each endpoint?", "Each endpoint belongs to exactly one of the two sets. −1 is in `[-1, 4)`; 4 is not.", "So your set leaves out −1 and includes 4: `(-∞, -1) ∪ [4, ∞)`."] },
      { id:"tc3", goal:[2, 6], stretch:true,
        prompt:"Using <strong>two pieces</strong> whose endpoints are all <strong>integers</strong>, build a set that contains <strong>exactly</strong> these integers: −3, −2, 2 and 3. No other integer may be in the set.",
        why:"Each integer endpoint is closed if you want that integer and open if you don’t. There are 16 answers, such as `[-3, -2] ∪ [2, 3]` and `(-4, -1) ∪ (1, 4)`.",
        hints:["You need a gap that removes −1, 0 and 1. That means two pieces.", "Endpoints must be integers. At each one, ask: do I want this integer? If yes, closed. If no, open.", "One answer: `[-3, -2] ∪ [2, 3]`. Another: `(-4, -1) ∪ (1, 4)`. The open dots at −4, −1, 1 and 4 leave those integers out. There are 16 answers in all."] }
    ]
  },
  part3:{
    slug:"detective", name:"Detective",
    heading:"Graph detective",
    intro:"Each graph comes with four questions. Tap the stretches of the axis that answer the question, then decide at each split point whether it belongs.",
    blocks:[{ title:"What the split points mean", html:"<p><strong>Four rules for split points</strong></p><ol><li>A <strong>zero</strong> is never in a positive or negative interval: 0 is neither.</li><li>A <strong>turning point</strong> is never in an increasing or decreasing interval: there the graph is neither rising nor falling.</li><li>A point where the graph <strong>levels off without turning</strong> does not split an increasing or decreasing interval.</li><li>A <strong>domain endpoint</strong> is in the domain if its dot is closed. For the range, check whether any solid point of the graph reaches that height.</li></ol>" }],
    quickCheck:{
      title:"Detective’s questions", summary:"Detective’s questions",
      items:[
        { id:"q1", goal:4, prompt:"On Graph A, is `x = 3` in the positive interval?",
          choices:[{ t:"Yes", fb:"`f(3) = 0`. Zeros are neither positive nor negative, so 3 is left out, even though the graph is positive on both sides." }, { t:"No", ok:true, fb:"Right. `f(3) = 0`: the graph touches the axis there, and 0 isn’t positive." }] },
        { id:"q2", goal:3, prompt:"On Graph B, is `g` increasing on `(-1, 1)`?",
          choices:[{ t:"Yes", ok:true, fb:"Right. `g(-1) = -5`, `g(0) = 0` and `g(1) = 3`: it rises the whole way, even though it levels off at 0." }, { t:"No", fb:"Check the values: `g(-1) = -5 < g(0) = 0 < g(1) = 3`. Levelling off for an instant is not turning." }] },
        { id:"q3", goal:5, prompt:"On Graph C, is 4 in the range?",
          choices:[{ t:"Yes", ok:true, fb:"Right. The open dot misses `y = 4` at `x = 5`, but the solid peak (−1, 4) reaches it." }, { t:"No", fb:"The peak (−1, 4) is a solid point of the graph, so the height 4 is reached." }] },
        { id:"q4", goal:3, prompt:"On Graph C, should the decreasing interval be written `[-1, 3]`?",
          choices:[{ t:"Yes", fb:"At `x = -1` and `x = 3` the graph turns. It’s neither rising nor falling there, so the brackets are round: `(-1, 3)`." }, { t:"No", ok:true, fb:"Right. −1 and 3 are turning points, so the interval is `(-1, 3)`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Same set, different clothes", summary:"Same set, different clothes",
        instruction:"Sort each description into the box with the same set of numbers.", noun:"description", goal:[1, 2],
        boxes:[{ id:"b1", label:"`(-∞, 2]`" }, { id:"b2", label:"`[-3, 2)`" }, { id:"b3", label:"`(-3, 2)`" }, { id:"b4", label:"`(-∞, -3) ∪ [2, ∞)`" }],
        items:[
          sortItem("i1", "`x ≤ 2`", "b1", "Every number up to 2, including 2.", "`x ≤ 2`", "`(-∞, 2]`"),
          sortItem("i2", "`{x ∈ ℝ | 2 ≥ x}`", "b1", "2 ≥ `x` is `x ≤ 2` read from the other side.", "", "", true,
            ["Read the inequality starting from `x`.", "2 ≥ `x` means `x ≤ 2`: every number up to 2, including 2.", "`(-∞, 2]`."]),
          sortItem("i3", "“at most 2”", "b1", "“At most” means ≤.", "`x ≤ 2`", "`(-∞, 2]`"),
          sortItem("i4", "`-3 ≤ x < 2`", "b2", "Closed at −3, open at 2.", "`-3 ≤ x < 2`", "`[-3, 2)`"),
          sortItem("i5", nlSVG(true, false) + '<span class="vh">Number line: closed dot at −3, open dot at 2, shaded between</span>', "b2", "A closed dot is a square bracket; an open dot is a round one.", "`-3 ≤ x < 2`", "`[-3, 2)`"),
          sortItem("i6", "`{x ∈ ℝ | x ≥ -3 and x < 2}`", "b2", "Both conditions at once give one piece from −3 (in) to 2 (out).", "`-3 ≤ x < 2`", "`[-3, 2)`"),
          sortItem("i7", "`-3 < x < 2`", "b3", "Both inequalities are strict, so both ends are open.", "`-3 < x < 2`", "`(-3, 2)`"),
          sortItem("i8", "“between −3 and 2, not including either”", "b3", "Neither endpoint is included.", "`-3 < x < 2`", "`(-3, 2)`"),
          sortItem("i9", nlSVG(false, false) + '<span class="vh">Number line: open dots at −3 and 2, shaded between</span>', "b3", "Two open dots: two round brackets.", "`-3 < x < 2`", "`(-3, 2)`"),
          sortItem("i10", "`x < -3` or `x ≥ 2`", "b4", "Two separate pieces joined by “or”, so ∪.", "`x < -3` or `x ≥ 2`", "`(-∞, -3) ∪ [2, ∞)`"),
          sortItem("i11", "“every number <strong>not</strong> in `[-3, 2)`”", "b4", "The outside of `[-3, 2)`: −3 was in, so now it’s out; 2 was out, so now it’s in.", "", "", false,
            ["Picture `[-3, 2)` on a number line. What’s outside it?", "Outside means left of −3 or right of 2. −3 is inside `[-3, 2)`, so it’s not outside; 2 is not inside, so it is outside.", "`(-∞, -3) ∪ [2, ∞)`."]),
          sortItem("i12", "`{x ∈ ℝ | x < -3 or x ≥ 2}`", "b4", "Set notation for the same two pieces.", "`x < -3` or `x ≥ 2`", "`(-∞, -3) ∪ [2, ∞)`")
        ] },
      { id:"builds", type:"custom", title:"Work backwards from the clues", summary:"Work backwards from the clues", star:true, goal:[3, 4, 6],
        instruction:"Build each answer on the number line. Some clues take more than one step.",
        how:"Drag the handles, choose open or closed, add a second piece if you need it, then press Check.",
        items:[
          { id:"r1", goal:4, clue:"A parabola opens down and has zeros −1 and 5. Build where it’s positive.", answer:"(−1, 5)",
            wrong:{ "[−1, 5]":"At the zeros the value is 0, so they’re left out.", "(−∞, −1) ∪ (5, ∞)":"That’s where it’s negative. Opening down, it’s above the axis <strong>between</strong> the zeros." },
            hints:["Opening down, where is the parabola above the axis: between the zeros or outside them?", "Between −1 and 5. Are the zeros themselves positive?", "The value at each zero is 0, so both ends are open: `(-1, 5)`."] },
          { id:"r2", goal:3, clue:"A parabola opens up and its vertex is (3, −2). Build where it’s decreasing.", answer:"(−∞, 3)",
            wrong:{ "(3, ∞)":"Opening up, it falls until the vertex and rises after.", "(−∞, −2)":"−2 is the `y`-coordinate of the vertex. Intervals use `x`-values." },
            hints:["Picture a parabola opening up. Which side of the vertex goes downhill?", "It falls until it reaches the vertex at `x = 3`.", "Decreasing on `(-∞, 3)`; the turning point 3 is left out."] },
          { id:"r3", goal:4, star:true, clue:"A function is defined only for `-6 < x < 4` (open dots at both ends). It’s positive on `(-2, 1)` and has no zeros except −2 and 1. Build where it’s negative.", answer:"(−6, −2) ∪ (1, 4)",
            wrong:{ "(−∞, −2) ∪ (1, ∞)":"The function only exists for `-6 < x < 4`.", "[−2, 1]":"−2 and 1 are zeros, so they’re left out.", "(−6, −2] ∪ [1, 4)":"−2 and 1 are zeros, so they’re left out.", "(−2, 1)":"That’s where it’s positive. Where else is the function defined?" },
            hints:["Where is the function defined? Where is it positive?", "Everywhere in the domain that isn’t positive and isn’t a zero must be negative.", "Negative on `(-6, -2) ∪ (1, 4)`: the domain minus `[-2, 1]`."] },
          { id:"r4", goal:5, star:true, clue:"A function is defined for every `x ≥ -8` except `x = -5`. Build its domain.", answer:"[−8, −5) ∪ (−5, ∞)",
            wrong:{ "[−8, ∞)":"−5 is excluded. Leaving out one value splits the piece in two.", "(−8, −5) ∪ (−5, ∞)":"“Every `x ≥ -8`” includes −8." },
            hints:["Start with every `x ≥ -8`. Then remove one value.", "Removing −5 splits the piece into two pieces that meet at an open dot.", "`[-8, -5) ∪ (-5, ∞)`."] },
          { id:"r5", goal:6, star:true, clue:"`y = x^2 - 6x + 5`. Build where it is <strong>both</strong> decreasing <strong>and</strong> positive.", answer:"(−∞, 1)",
            wrong:{ "(−∞, 3)":"That’s where it decreases. It’s only positive outside its zeros, 1 and 5.", "(−∞, 1) ∪ (5, ∞)":"That’s where it’s positive. Right of 5 it’s rising." },
            hints:["Answer two questions separately, then keep only the `x`-values that pass both.", "`x^2 - 6x + 5 = (x - 1)(x - 5)`. It opens up, so it decreases on `(-∞, 3)` (the vertex is halfway between the zeros) and is positive on `(-∞, 1) ∪ (5, ∞)`.", "Both at once: the overlap of `(-∞, 3)` with `(-∞, 1) ∪ (5, ∞)` is `(-∞, 1)`."] },
          { id:"r6", goal:6, star:true, clue:"A graph rises from the lower left to a local maximum at `x = -4`, falls to a local minimum at `x = 2`, then rises forever. It meets the `x`-axis only at −6, −1 and 5, crossing each time. Build where it is <strong>both</strong> decreasing <strong>and</strong> negative.", answer:"(−1, 2)",
            wrong:{ "(−4, 2)":"That’s where it decreases. Between −4 and −1 it’s still above the axis.", "(−1, 5)":"That’s where it’s negative. From 2 to 5 it’s below the axis but already rising." },
            hints:["Sketch it from the description: low on the left, up to a peak at `x = -4`, down to a valley at `x = 2`, then up forever.", "It crosses the axis at −6 (going up), at −1 (coming down) and at 5 (going up). So it’s below the axis for `x < -6` and for `-1 < x < 5`.", "Decreasing is `(-4, 2)`. Negative is `(-∞, -6) ∪ (-1, 5)`. The overlap is `(-1, 2)`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Mateo", how:"",
        instruction:"Mateo made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"`f(x) = x^2 - 4x` (graph shown, vertex (2, −4)). State where `f` is negative and where it’s decreasing.",
            fig:fig("e1", "Parabola opening up through (0, 0) and (4, 0) with vertex (2, negative 4)", "fig-sm"),
            steps:["`x^2 - 4x = x(x - 4)`, so the zeros are 0 and 4.", "The parabola opens up, so it’s below the `x`-axis between the zeros.", "Negative: `[0, 4]`.", "The vertex is (2, −4), so `f` falls until `x = 2`.", "Decreasing: `(-∞, 2)`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct.", "", "Step 4 is true. The mistake is earlier.", "Step 5 is correct. The mistake is earlier."],
            fixes:[
              { t:"Negative: `(0, 4)`, because `f(0) = f(4) = 0`, and 0 isn’t negative.", ok:true, why:"Zeros are left out of positive and negative intervals." },
              { t:"Negative: `(-4, 0)`.", why:"−4 and 0 are `y`-values (the vertex’s height and the axis). Intervals use `x`-values." },
              { t:"Negative: `(0, 4]`.", why:"4 is a zero too: `f(4) = 16 - 16 = 0`. Both zeros are left out." },
              { t:"Step 3 is correct as written.", why:"Square brackets would include 0 and 4, where `f = 0`. Zero isn’t negative." }],
            hints:["Check every bracket. What is `f` at each endpoint?", "`f(0) = 0` and `f(4) = 0`. Is 0 negative?", "Step 3 is wrong: the zeros are left out, so the negative interval is `(0, 4)`."] },
          { id:"e2", goal:5, task:"A graph is a single straight segment from an open dot at (−2, 1) to a closed dot at (3, 6). State its domain and range.",
            steps:["The graph runs from `x = -2` to `x = 3`.", "The dot at (−2, 1) is open, so −2 is not in the domain.", "Domain: `(-2, 3]`.", "The `y`-values run from 1 up to 6.", "Range: `[1, 6]`.", "So the range is `{y ∈ ℝ | 1 ≤ y ≤ 6}`."],
            answer:4,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct.", "Step 3 is correct.", "Step 4 is true. The question is which ends are included.", "", "Step 6 copies step 5. The mistake is earlier."],
            fixes:[
              { t:"Range: `(1, 6]`, because the only point at height 1 is the open dot.", ok:true, why:"The segment rises steadily, so `y = 1` happens only at the missing point (−2, 1)." },
              { t:"Range: `(-2, 3]`.", why:"That’s the domain again. The range uses `y`-values." },
              { t:"Range: `[1, 6)`.", why:"The brackets are swapped: the closed dot (3, 6) means 6 <strong>is</strong> reached." },
              { t:"Step 5 is correct as written.", why:"`y = 1` is reached only at (−2, 1), and that point is missing, so 1 is not in the range." }],
            hints:["For each end of the range, find the point of the graph at that height. Is it a solid point?", "Height 1 occurs only at (−2, 1). What kind of dot is that?", "Step 5 is wrong: the open dot leaves 1 out, so the range is `(1, 6]`."] },
          { id:"e3", goal:2, task:"Write `x ≤ -1` or `x > 4` in interval notation.",
            steps:["`x ≤ -1` is every number from −∞ up to −1, including −1.", "That piece is `(-∞, -1]`.", "`x > 4` is every number above 4, not including 4: `(4, ∞]`.", "Joined: `(-∞, -1] ∪ (4, ∞]`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct.", "", "Step 4 copies step 3’s bracket. The mistake is earlier."],
            fixes:[
              { t:"`(4, ∞)`, because ∞ is not a number the set can include.", ok:true, why:"∞ always takes a round bracket." },
              { t:"`[4, ∞)`.", why:"`x > 4` is strict, so 4 is left out: round bracket." },
              { t:"`(4, ∞)`, and join the pieces with ∩.", why:"“Or” is ∪. ∩ would ask for numbers in both pieces, and there aren’t any." },
              { t:"Step 3 is correct as written.", why:"A square bracket at ∞ would claim ∞ is in the set. ∞ isn’t a number, so it always gets a round bracket." }],
            hints:["Look closely at the bracket next to ∞.", "Can a set of real numbers include ∞?", "Step 3 is wrong: write `(4, ∞)`. The full answer is `(-∞, -1] ∪ (4, ∞)`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the interval builder? Think about P2 (pieces joining) or P3 (“everything else”)." },
      { id:"j2", q:"In your own words, why does ∞ always get a round bracket?" },
      { id:"j3", q:"Explain to a friend how to decide, at each split point on a graph, whether that `x`-value belongs in the interval." },
      { id:"j4", q:"Which do you still mix up: brackets, `x`- vs `y`-values, or increasing vs positive? What will you do to keep them straight?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which is `-4 < x ≤ 7` in interval notation?", options:[
          { t:"`(-4, 7)`", why:"That leaves out 7, but ≤ includes it." },
          { t:"`(-4, 7]`", ok:true, why:"−4 is left out (<), so round; 7 is included (≤), so square." },
          { t:"`[-4, 7)`", why:"The brackets are swapped: −4 is the strict end." },
          { t:"`[-4, 7]`", why:"That includes −4, but `-4 < x` leaves it out." }] },
        b:{ prompt:"Which is `-6 ≤ x < 1` in interval notation?", options:[
          { t:"`(-6, 1)`", why:"That leaves out −6, but ≤ includes it." },
          { t:"`(-6, 1]`", why:"The brackets are swapped: 1 is the strict end." },
          { t:"`[-6, 1)`", ok:true, why:"−6 is included (≤), so square; 1 is left out (<), so round." },
          { t:"`[-6, 1]`", why:"That includes 1, but `x < 1` leaves it out." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which is `x ≥ -2` in interval notation?", options:[
          { t:"`[-2, ∞)`", ok:true, why:"−2 is included, and ∞ always takes a round bracket." },
          { t:"`[-2, ∞]`", why:"∞ can’t be included: always a round bracket." },
          { t:"`(-2, ∞)`", why:"≥ includes −2, so it needs a square bracket." },
          { t:"`(-∞, -2]`", why:"That’s `x ≤ -2`, the other direction." }] },
        b:{ prompt:"Which is `x < 9` in interval notation?", options:[
          { t:"`(-∞, 9)`", ok:true, why:"Every number below 9; 9 itself is left out." },
          { t:"`[-∞, 9)`", why:"−∞ can’t be included: always a round bracket." },
          { t:"`(-∞, 9]`", why:"< leaves 9 out, so it needs a round bracket." },
          { t:"`(9, ∞)`", why:"That’s `x > 9`, the other direction." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"The graph of `y = (x + 1)(x - 5)` is shown, with vertex (2, −9). Where is it negative?" + fig("k3a", "Parabola opening up with zeros at negative 1 and 5 and vertex (2, negative 9)"), options:[
          { t:"`(-1, 5)`", ok:true, why:"It opens up, so it’s below the axis between its zeros, −1 and 5. The zeros themselves are left out." },
          { t:"`[-1, 5]`", why:"At −1 and 5 the value is 0, which isn’t negative." },
          { t:"`(-∞, -1) ∪ (5, ∞)`", why:"That’s where it’s positive." },
          { t:"`(-9, 0)`", why:"Those are `y`-values: the heights below the axis. Intervals use `x`-values." }] },
        b:{ prompt:"The graph of `y = -(x - 2)(x + 4)` is shown, with vertex (−1, 9). Where is it positive?" + fig("k3b", "Parabola opening down with zeros at negative 4 and 2 and vertex (negative 1, 9)"), options:[
          { t:"`(-4, 2)`", ok:true, why:"It opens down, so it’s above the axis between its zeros, −4 and 2." },
          { t:"`[-4, 2]`", why:"At −4 and 2 the value is 0, which isn’t positive." },
          { t:"`(-∞, -4) ∪ (2, ∞)`", why:"That’s where it’s negative." },
          { t:"`(0, 9)`", why:"Those are `y`-values. Intervals use `x`-values." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"No graph is given. On which interval is `f(x) = x^2 + 6x + 5` decreasing?", options:[
          { t:"`(-∞, -3)`", ok:true, why:"The parabola opens up, with its vertex at `x = -6/2 = -3` (halfway between the zeros −5 and −1). It falls until the vertex." },
          { t:"`(-3, ∞)`", why:"That’s where it rises. An upward parabola falls first, then rises." },
          { t:"`(-5, -1)`", why:"That’s where it’s negative, between the zeros. Negative isn’t the same as decreasing." },
          { t:"`(-∞, -4)`", why:"−4 is the `y`-coordinate of the vertex, `f(-3) = -4`. Intervals use `x`-values." }] },
        b:{ prompt:"No graph is given. On which interval is `g(x) = -x^2 + 4x + 5` increasing?", options:[
          { t:"`(-∞, 2)`", ok:true, why:"The parabola opens down, with its vertex at `x = 2` (halfway between the zeros −1 and 5). It rises until the vertex." },
          { t:"`(2, ∞)`", why:"That’s where it falls. A downward parabola rises first, then falls." },
          { t:"`(-1, 5)`", why:"That’s where it’s positive, between the zeros. Positive isn’t the same as increasing." },
          { t:"`(-∞, 9)`", why:"9 is the `y`-coordinate of the vertex, `g(2) = 9`. Intervals use `x`-values." }] } },
      { id:"t2", cat:"T", goal:6,
        a:{ prompt:"`p(x) = (x + 4)(x - 2)^2` is shown, with a local maximum at (−2, 32) and a local minimum at (2, 0). Where is `p` <strong>both</strong> increasing <strong>and</strong> positive?" + fig("t2a", "Cubic through (negative 4, 0) with a local maximum at (negative 2, 32) and touching the x-axis at (2, 0)"), options:[
          { t:"`(-∞, -2) ∪ (2, ∞)`", why:"That’s where it increases. Left of −4 it’s rising but below the axis." },
          { t:"`(-4, 2) ∪ (2, ∞)`", why:"That’s where it’s positive. Between −2 and 2 it’s above the axis but falling." },
          { t:"`(-4, -2) ∪ (2, ∞)`", ok:true, why:"Increasing: `(-∞, -2) ∪ (2, ∞)`. Positive: `(-4, 2) ∪ (2, ∞)`. The overlap is `(-4, -2) ∪ (2, ∞)`." },
          { t:"`(-4, -2] ∪ [2, ∞)`", why:"−2 and 2 are turning points, so they can’t be in an increasing interval; and `p(2) = 0`." }] },
        b:{ prompt:"`q(x) = -(x - 4)(x + 2)^2` is shown, with a local minimum at (−2, 0) and a local maximum at (2, 32). Where is `q` <strong>both</strong> decreasing <strong>and</strong> positive?" + fig("t2b", "Cubic touching the x-axis at (negative 2, 0), with a local maximum at (2, 32) and crossing at (4, 0)"), options:[
          { t:"`(-∞, -2) ∪ (2, ∞)`", why:"That’s where it decreases. Right of 4 it’s falling but below the axis." },
          { t:"`(-∞, -2) ∪ (-2, 4)`", why:"That’s where it’s positive. Between −2 and 2 it’s above the axis but rising." },
          { t:"`(-∞, -2) ∪ (2, 4)`", ok:true, why:"Decreasing: `(-∞, -2) ∪ (2, ∞)`. Positive: `(-∞, -2) ∪ (-2, 4)`. The overlap is `(-∞, -2) ∪ (2, 4)`." },
          { t:"`(-∞, -2] ∪ [2, 4)`", why:"−2 and 2 are turning points, so they can’t be in a decreasing interval; and `q(-2) = 0`." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"A graph is made of two straight segments: from a closed dot at (−5, 3) down to (−1, −3), then up to an open dot at (4, 7). What are its domain and range?", options:[
          { t:"Domain `[-5, 4)`, range `[3, 7)`", why:"The range uses the lowest point the graph reaches, (−1, −3), not just the ends." },
          { t:"Domain `[-5, 4)`, range `[-3, 7)`", ok:true, why:"`x` runs from −5 (closed) to 4 (open). `y` goes down to −3 (reached at (−1, −3)) and up toward 7, which the open dot never reaches." },
          { t:"Domain `[-5, 4]`, range `[-3, 7]`", why:"The open dot at (4, 7) leaves out `x = 4` and `y = 7`." },
          { t:"Domain `[-3, 7)`, range `[-5, 4)`", why:"These are swapped: the domain uses `x`-values." }] },
        b:{ prompt:"A graph is made of two straight segments: from an open dot at (−6, −4) up to (0, 5), then down to a closed dot at (3, 1). What are its domain and range?", options:[
          { t:"Domain `(-6, 3]`, range `(-4, 1]`", why:"The range uses the highest point the graph reaches, (0, 5), not just the ends." },
          { t:"Domain `(-6, 3]`, range `(-4, 5]`", ok:true, why:"`x` runs from −6 (open) to 3 (closed). `y` starts just above −4 (the open dot) and reaches 5 at (0, 5)." },
          { t:"Domain `[-6, 3]`, range `[-4, 5]`", why:"The open dot at (−6, −4) leaves out `x = -6` and `y = -4`." },
          { t:"Domain `(-4, 5]`, range `(-6, 3]`", why:"These are swapped: the domain uses `x`-values." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which statement is written correctly?", options:[
          { t:"`{x ∈ ℝ | x < -1 or x ≥ 3} = (-∞, -1) ∪ [3, ∞)`", ok:true, why:"Correct brackets, and ∪ for “or”." },
          { t:"`{x ∈ ℝ | x < -1 or x ≥ 3} = (-∞, -1) ∩ [3, ∞)`", why:"∩ means “in both”. No number is in both pieces." },
          { t:"`{x ∈ ℝ | x < -1 or x ≥ 3} = (-∞, -1] ∪ [3, ∞]`", why:"−1 is left out (<), and ∞ always takes a round bracket." },
          { t:"`{x ∈ ℝ | x < -1 or x ≥ 3} = (-1, -∞) ∪ [3, ∞)`", why:"Write the smaller endpoint first: `(-∞, -1)`." }] },
        b:{ prompt:"Which statement is written correctly?", options:[
          { t:"`{x ∈ ℝ | x ≤ 0 or x > 5} = (-∞, 0] ∪ (5, ∞)`", ok:true, why:"Correct brackets, and ∪ for “or”." },
          { t:"`{x ∈ ℝ | x ≤ 0 or x > 5} = (-∞, 0] ∩ (5, ∞)`", why:"∩ means “in both”. No number is in both pieces." },
          { t:"`{x ∈ ℝ | x ≤ 0 or x > 5} = [-∞, 0] ∪ (5, ∞]`", why:"∞ and −∞ always take round brackets." },
          { t:"`{x ∈ ℝ | x ≤ 0 or x > 5} = [0, -∞) ∪ (5, ∞)`", why:"Write the smaller endpoint first: `(-∞, 0]`." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"`f` is increasing on `(-∞, 2)` and decreasing on `(2, ∞)`. Which is the best explanation of why `x = 2` is left out of both intervals?", options:[
          { t:"At `x = 2` the graph turns: for an instant it is neither rising nor falling, so it belongs to neither interval.", ok:true, why:"That’s the meaning of a turning point." },
          { t:"Because 2 is a zero of `f`.", why:"A turning point isn’t necessarily a zero. Nothing here says `f(2) = 0`." },
          { t:"Because interval notation always uses round brackets.", why:"Square brackets are used whenever an endpoint is included, as in `[-2, ∞)`." },
          { t:"Because `f(2)` is negative.", why:"The height at the turning point doesn’t matter. What matters is that the graph is neither rising nor falling there." }] },
        b:{ prompt:"`f` is positive on `(-3, ∞)`. Which is the best explanation of why `x = -3` is left out?", options:[
          { t:"`f(-3) = 0`, and 0 is neither positive nor negative.", ok:true, why:"Zeros are always left out of positive and negative intervals." },
          { t:"Because −3 is a turning point.", why:"Nothing here says the graph turns at −3. It’s left out because the value there is 0." },
          { t:"Because interval notation always uses round brackets.", why:"Square brackets are used whenever an endpoint is included." },
          { t:"Because −3 is a negative number.", why:"The sign of the `x`-value doesn’t matter: `f` could be positive at `x = -2`. What matters is the value of `f`." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"A diver’s height above the water is `h(t) = -5t^2 + 10t + 15` metres, `t` seconds after leaving the board, for `0 ≤ t ≤ 3`. During which time interval is the diver rising?", options:[
          { t:"`(0, 1)`", ok:true, why:"The vertex is at `t = -10/(2 × (-5)) = 1`, where `h` = 20 m. The diver rises from the board until `t` = 1 s." },
          { t:"`(0, 3)`", why:"That’s the whole time the diver is in the air (positive height). Above the water isn’t the same as rising." },
          { t:"`(1, 3)`", why:"After `t = 1` the height decreases: that’s the fall." },
          { t:"`(15, 20)`", why:"Those are heights in metres, from the board (15 m) to the top (20 m). The question asks for times." }] },
        b:{ prompt:"A drone’s height is `h(t) = -2t^2 + 12t` metres, `t` seconds after take-off, for `0 ≤ t ≤ 6`. During which time interval is the drone descending?", options:[
          { t:"`(3, 6)`", ok:true, why:"The vertex is at `t = -12/(2 × (-2)) = 3`, where `h` = 18 m. After that the drone comes down until it lands at `t = 6`." },
          { t:"`(0, 6)`", why:"That’s the whole flight (positive height). In the air isn’t the same as descending." },
          { t:"`(0, 3)`", why:"Before `t = 3` the drone is climbing." },
          { t:"`(0, 18)`", why:"Those are heights in metres. The question asks for times." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"A company’s monthly profit, in thousands of dollars, is `P(x) = -(x - 2)(x - 8)`, where `x` is the number of units made, in hundreds, with `0 < x < 10`. For which production levels does the company <strong>lose</strong> money?", options:[
          { t:"`(2, 8)`", why:"That’s where `P` is positive: the profitable levels." },
          { t:"`[0, 2] ∪ [8, 10]`", why:"At `x = 2` and `x = 8` the profit is exactly 0 (break-even), not a loss. Also, `0 < x < 10` leaves out 0 and 10." },
          { t:"`(0, 2) ∪ (8, 10)`", ok:true, why:"`P` opens down with zeros 2 and 8, so it’s negative outside them. Inside the allowed levels, that’s `(0, 2) ∪ (8, 10)`." },
          { t:"`(0, 2) ∩ (8, 10)`", why:"∩ asks for levels in both pieces at once, and there are none. “Either piece” is ∪." }] },
        b:{ prompt:"A greenhouse’s temperature, in degrees above its target, is `T(h) = (h - 3)(h - 9)`, `h` hours after midnight, with `0 < h < 12`. During which times is the greenhouse <strong>above</strong> its target?", options:[
          { t:"`(3, 9)`", why:"That’s where `T` is negative: below target." },
          { t:"`[0, 3] ∪ [9, 12]`", why:"At `h = 3` and `h = 9` the temperature is exactly on target, not above it. Also, `0 < h < 12` leaves out 0 and 12." },
          { t:"`(0, 3) ∪ (9, 12)`", ok:true, why:"`T` opens up with zeros 3 and 9, so it’s positive outside them. Inside the allowed times, that’s `(0, 3) ∪ (9, 12)`." },
          { t:"`(0, 3) ∩ (9, 12)`", why:"∩ asks for times in both pieces at once, and there are none. “Either piece” is ∪." }] } }
    ]
  },
  task:{
    title:"Build the graph from its report", summary:"Build the graph from its report",
    statement:"<p>A detective’s report describes a graph. Build a graph that matches the whole report. There are many answers. Can you find more than one?</p><div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The report</h4><p>Domain: `[-4, 4)`<br>Increasing on `(-4, -2) ∪ (0, 4)`; decreasing on `(-2, 0)`<br>Exactly three zeros<br>Range: `[-3, 5)`</p></div><p class=\"tiny muted\">Set the height of the graph at <i>x</i> = −4, −2, 0, 2 and 4 (whole numbers from −6 to 6). The graph joins the five points with straight segments.</p>",
    checks:["Domain is `[-4, 4)`", "Increasing on `(-4, -2) ∪ (0, 4)`; decreasing on `(-2, 0)`", "Exactly three zeros", "Range is `[-3, 5)`"],
    tips:["`[-4, 4)` means `x = -4` is in (closed dot) and `x = 4` is out (open dot).", "", "", ""],
    explainPrompt:"Write your graph’s positive and negative intervals in interval notation, and explain how you made the range `[-3, 5)` and not `[-3, 5]`.",
    vocab:"Use the words open dot, closed dot, zero and range.",
    success:"Your design works!",
    after3:"Notice what every answer shares: the height at `x = 4` must be 5 with an open dot, and the lowest height must be exactly −3."
  },
  cards:[
    ["Round bracket ( ) vs square bracket [ ]", "Round: the endpoint is left out (<, >, open dot). Square: the endpoint is included (≤, ≥, closed dot)."],
    ["Brackets at ∞", "Always round: `[-2, ∞)`. ∞ is a direction, not a number the set can contain."],
    ["`-2 < x ≤ 5` in three forms", "Inequality `-2 < x ≤ 5`; set `{x ∈ ℝ | -2 < x ≤ 5}`; interval `(-2, 5]`."],
    ["∪ (union)", "“Or”: joins separate pieces. `x ≤ -3` or `x > 1` is `(-∞, -3] ∪ (1, ∞)`."],
    ["All real numbers", "`{x ∈ ℝ} = (-∞, ∞)`."],
    ["Increasing / decreasing intervals", "The `x`-values where the graph rises / falls as you move right. Open intervals; turning points are left out."],
    ["Positive / negative intervals", "The `x`-values where the graph is above / below the `x`-axis. Zeros are left out."],
    ["Increasing vs positive", "Different questions. Increasing: going up. Positive: above the axis. Left of a local minimum below the axis, a graph is negative <strong>and</strong> decreasing; right of it, negative <strong>and</strong> increasing."],
    ["A point where the graph levels off but doesn’t turn", "It doesn’t split the interval. `y = x^3(4 - x)` is increasing on `(-∞, 3)`, straight through (0, 0)."],
    ["Domain and range with open dots", "An open dot leaves out its `x`-value. It leaves out its `y`-value only if no solid point of the graph reaches that height."],
    ["`x ≠ 2` in interval notation", "`(-∞, 2) ∪ (2, ∞)`: one missing value splits the line in two."],
    ["Everything not in `[-3, 2)`", "`(-∞, -3) ∪ [2, ∞)`. Taking “everything else” flips every endpoint’s bracket."]
  ]
};
