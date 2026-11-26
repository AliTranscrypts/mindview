// MHF4U 03 Characteristics of Polynomial Functions. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/03-characteristics-of-polynomial-functions.md
const fig = (key, aria, cls) => '<canvas class="plot' + (cls ? " " + cls : "") + '" data-fig="' + key + '" role="img" aria-label="' + aria + '"></canvas>';

// ---------- Practice 1: Polynomial or not? (sorter; mistake feedback built from the item and the box) ----------
const NOT = "b1", ODD = "b2", EVEN = "b3";
const BOXNAME = { b1:"Not a polynomial", b2:"Polynomial, odd degree", b3:"Polynomial, even degree" };
const POLY_IN_NOT = "Every power of `x` here is a whole number 0, 1, 2, …. Dividing by a number (like `x^2/4`) is allowed.";
const SH1 = "Are all the powers of `x` whole numbers?";
const SH2 = "If so, find the highest power (add degrees for a product).";
function sortItem(id, t, box, why, o){
  const wrong = {};
  for (const b of [NOT, ODD, EVEN]) {
    if (b === box) continue;
    if (box === NOT) wrong[b] = "Look at the powers of `x`: " + t + " has " + o.has + ".";
    else if (b === NOT) wrong[b] = o.notMsg || POLY_IN_NOT;
    else wrong[b] = o.swap;
  }
  return { id, t, answer:box, why, goal:o.goal || 1, wrong,
    hints:o.hints || [SH1, SH2, t + ": " + o.reason + ", so it goes in <strong>" + BOXNAME[box] + "</strong>."] };
}

// ---------- Part 3 card feedback (rule names) ----------
const RULES = [
  { id:"ends", t:"End behaviour doesn’t match", name:"end behaviour" },
  { id:"turns", t:"Too many turning points", name:"number of turning points" },
  { id:"ints", t:"Too many `x`-intercepts", name:"number of `x`-intercepts" },
  { id:"parity", t:"Wrong kind of number of turning points (odd/even)", name:"kind of number of turning points (odd or even)" }
];

export default {
  id:"03-characteristics-of-polynomial-functions",
  kind:"topic",
  title:"Characteristics of polynomial functions",
  topic:"Characteristics of Polynomial Functions",
  readyTopic:"characteristics of polynomial functions",
  hero:{
    eq:'y = <span class="va">a</span>x<sup class="vn">n</sup> + <span class="lt">(lower terms)</span>', eqLabel:"y equals a x to the power n, plus lower terms", eqSize:"md",
    headline:"The leading term runs the show",
    text:"A <strong>polynomial function</strong> adds up terms like `3x^4`, `-x^2` and 7, with whole-number powers. The highest power is the <strong>degree</strong> `@n{n}`, and its coefficient is the <strong>leading coefficient</strong> `@a{a}`. The lower terms make the bumps in the middle. But far out, the leading term wins, and `@n{n}` also caps how many times the graph can cross the axis and turn.",
    fig:{ html:'<canvas class="plot" id="hero-plot" role="img" aria-label="Graph of y = x⁴ − 5x² + 4 with its 4 x-intercepts and 3 turning points, then zoomed out until it matches y = x⁴"></canvas><div class="bud hero-bud" id="hero-bud" aria-hidden="true"></div>' }
  },
  goals:[
    "I can decide whether a function is a polynomial and state its degree and leading coefficient, even when it isn’t written in standard form.",
    "I can use the degree and the sign of the leading coefficient to describe end behaviour, in quadrant form and in arrow form.",
    "I can state the most `x`-intercepts and turning points a polynomial of degree `n` can have, and which numbers of turning points are possible.",
    "I can state the domain and describe the range of a polynomial function from its degree and leading coefficient.",
    "I can tell polynomial functions apart from exponential and sinusoidal functions by their graphs and equations.",
    "I can decide whether a sketch could be the graph of a polynomial with a given degree and leading coefficient, and name the rule it breaks if not."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Power functions", goal:2, prompt:"What is the end behaviour of `y = -2x^3`?",
          options:[
            { t:"Q2 to Q4", ok:true, why:"Odd degree: the arms point opposite ways. The negative coefficient sends the left arm up (Q2) and the right arm down (Q4)." },
            { t:"Q3 to Q1", why:"That’s `y = 2x^3`. A negative `a` reflects the graph in the `x`-axis." },
            { t:"Q3 to Q4", why:"Both arms down happens for even degree with `a < 0`. Odd degree sends the arms opposite ways." },
            { t:"Q2 to Q1", why:"Both arms up is `x^2`, `x^4`, … with a positive coefficient." }],
          hints:["Is the degree even or odd? Then look at the sign of `a`.", "Odd degree: opposite directions. With `a < 0` the right arm goes down.", "Right arm down (Q4), left arm up (Q2): Q2 to Q4."] },
        { id:"w2", skill:"Power functions", goal:2, prompt:"The graph of `y = ax^n` has both arms pointing down. What must be true?",
          options:[
            { t:"`n` is even and `a < 0`", ok:true, why:"Even degree sends both arms the same way; a negative coefficient makes that way down." },
            { t:"`n` is odd and `a < 0`", why:"With odd `n` the arms point opposite ways, whatever the sign of `a`." },
            { t:"`n` is even and `a > 0`", why:"Even with `a > 0` is `x^2`, both arms up." },
            { t:"`n` is odd and `a > 0`", why:"That’s `x^3`: Q3 to Q1." }],
          hints:["First decide: same direction or opposite directions?", "Same direction means even degree. Up or down depends on the sign of `a`.", "Both down: even `n` and negative `a`."] },
        { id:"w3", skill:"Multiplying polynomials", goal:1, prompt:"When `(x^2 + 3)(2x^3 - x)` is expanded, which term has the highest power?",
          options:[
            { t:"`2x^5`", ok:true, why:"`x^2 × 2x^3 = 2x^5`: the exponents add. No other pair of terms gives a higher power." },
            { t:"`2x^6`", why:"`x^2 × x^3 = x · x · x · x · x = x^5`. Exponents add when you multiply." },
            { t:"`6x^3`", why:"`3 × 2x^3 = 6x^3` is one of the terms, but `x^2 × 2x^3` gives a higher power." },
            { t:"`x^5`", why:"The power is right, but the coefficient is 1 × 2 = 2." }],
          hints:["The highest power comes from multiplying the highest-power term in each bracket.", "That’s `x^2` from the first bracket and `2x^3` from the second.", "`x^2 × 2x^3 = 2x^5`."] },
        { id:"w4", skill:"Exponents and function types", goal:1, prompt:"Which expression equals `1/x^2`?",
          options:[
            { t:"`x^{-2}`", ok:true, why:"A negative exponent means a reciprocal: `x^{-2} = 1/x^2`." },
            { t:"`x^{1/2}`", why:"`x^{1/2}` is `√x`, not `1/x^2`." },
            { t:"`-x^2`", why:"`-x^2` is negative for every `x ≠ 0`; `1/x^2` is positive." },
            { t:"`x^{-1/2}`", why:"`x^{-1/2} = 1/√x`." }],
          hints:["What does a negative exponent mean?", "`x^{-n} = 1/x^n`.", "So `1/x^2 = x^{-2}`."] },
        { id:"w5", skill:"Exponents and function types", goal:5, prompt:"Which function’s graph has a horizontal asymptote?",
          options:[
            { t:"`y = 2^x`", ok:true, why:"As `x → -∞`, `2^x` gets closer and closer to 0, so `y = 0` is a horizontal asymptote." },
            { t:"`y = x^2`", why:"A parabola’s arms go up forever. Near the vertex it’s flat for a moment, but it doesn’t approach a line." },
            { t:"`y = x^3`", why:"`x^3` flattens at the origin, then keeps going: its arms go to ±∞." },
            { t:"`y = sin x`", why:"`sin x` keeps oscillating between −1 and 1. It never settles toward one value." }],
          hints:["An asymptote is a line the graph gets closer and closer to, far out.", "Which graph levels off as `x` goes far to one side?", "`2^x` shrinks toward 0 as `x → -∞`: `y = 0` is its horizontal asymptote."] },
        { id:"w6", skill:"Domain and range", goal:4, prompt:"What is the range of `y = -(x - 3)^2 + 4`?",
          options:[
            { t:"`{y ∈ ℝ | y ≤ 4}`", ok:true, why:"The parabola opens down with vertex (3, 4), so 4 is its highest value." },
            { t:"`{y ∈ ℝ | y ≥ 4}`", why:"The −1 in front makes it open down: 4 is the top, not the bottom." },
            { t:"`{y ∈ ℝ}`", why:"A parabola only goes one way from its vertex. Values above 4 are never reached." },
            { t:"`{y ∈ ℝ | y ≤ 3}`", why:"3 is the `x`-coordinate of the vertex. The range uses its `y`-coordinate, 4." }],
          hints:["Find the vertex and the direction of opening.", "Vertex (3, 4); the −1 means it opens down.", "Highest value 4: `{y ∈ ℝ | y ≤ 4}`."] }
      ],
      refreshers:{
        "Power functions":"For `y = ax^n`: even `n` sends both arms the same way (up if `a > 0`, down if `a < 0`); odd `n` sends them opposite ways (Q3 to Q1 if `a > 0`, Q2 to Q4 if `a < 0`). Example: `-2x^3` goes Q2 to Q4.",
        "Multiplying polynomials":"When you multiply powers, the exponents add: `x^2 · x^3 = x^5`. So the highest-power term of a product comes from multiplying the highest-power terms of the factors: `(x^2 + 3)(2x^3 - x)` starts with `2x^5`.",
        "Exponents and function types":"`x^{-n} = 1/x^n` and `x^{1/2} = √x`. In an exponential function like `2^x`, the variable is the exponent; its graph levels off toward a horizontal asymptote on one side. A sinusoidal function like `sin x` repeats forever between a highest and a lowest value.",
        "Domain and range":"The range is every `y`-value the graph reaches. For a parabola, find the vertex: if it opens down, the range is `y ≤` (vertex’s `y`); if up, `y ≥` (vertex’s `y`). Example: `-(x - 3)^2 + 4` has range `{y ∈ ℝ | y ≤ 4}`."
      }
    }
  },
  explore:{
    heading:"Polynomial shape lab",
    intro:"Pick a degree and a leading coefficient, then use the other sliders to bend the graph. Watch the two budget bars: can you ever beat them? Then zoom out and see who’s really in charge.",
    predIntro:"Make a prediction first. Then the shape lab will show you what really happens.",
    predictions:[
      { id:"p1", start:{ n:4, a:1, p:0, q:-5, r:0, s:4 },
        prompt:"The graph shows `y = x^4 - 5x^2 + 4`. The constant term `s` will slide from 4 up to 10. How many `x`-intercepts will the graph have at the end?",
        options:[{ t:"0", ok:true }, { t:"2" }, { t:"3" }, { t:"4, because a degree 4 graph has 4 intercepts" }],
        explain:"Changing `s` moves the whole graph up without changing its shape, so it keeps its 3 turning points. The valleys’ lowest height is `s - 6.25`, so once `s > 6.25` the graph never meets the axis. Degree 4 allows <strong>up to</strong> 4 intercepts, not exactly 4." },
      { id:"p2", start:{ n:3, a:-1, p:0, q:9, r:0, s:4 },
        prompt:"The lab shows `y = 4 + 9x^2 - x^3`, written here in that order. Switch to Zoom out and go to ×100. Which way will the arms point?",
        options:[{ t:"Q2 to Q4", ok:true }, { t:"Q3 to Q1" }, { t:"Q2 to Q1" }, { t:"Q3 to Q4" }],
        explain:"The leading term is `-x^3`: the highest power, even though it’s written last. At `x = 100`, `-x^3 = -1 000 000` while `9x^2 = 90 000` and 4 is nothing. Odd degree, negative coefficient: Q2 to Q4. 9 is the biggest coefficient, but a bigger power always wins far out." },
      { id:"p3", start:{ n:3, a:1, p:0, q:0, r:-3, s:0 },
        prompt:"The graph shows `y = x^3 - 3x`. A tiny term, `0.1x^4`, will be added. What happens?",
        options:[{ t:"Far to the left, the left arm turns up, and a new turning point appears", ok:true }, { t:"Nothing changes: `0.1x^4` is too small to matter" }, { t:"Both arms now point down" }, { t:"The right arm turns down" }],
        explain:"Now the degree is 4 and `a = 0.1 > 0`, so both arms must point up. Near the origin `0.1x^4` is tiny, but at `x = -20` it’s 16 000, while `x^3` is only −8000. To turn the left arm around, the graph needs one more turning point: 3, an odd number, as degree 4 requires." },
      { id:"p4", start:{ n:5, a:1, p:0, q:0, r:0, s:0 },
        prompt:"The graph shows `y = x^5`. Which numbers of turning points can a degree 5 polynomial have?",
        options:[{ t:"0, 2 or 4", ok:true }, { t:"Any number from 0 to 4" }, { t:"Exactly 4" }, { t:"1, 3 or 5" }],
        explain:"Degree 5 has its arms pointing opposite ways. Starting from the left arm, every turn reverses direction, and you must end heading the way the right arm points. So the turns come in pairs: 0, 2 or 4, never 1 or 3. And never 5, because the most is `n - 1 = 4`." }
    ],
    chalIntro:"Set the lab, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3, 6], prompt:"With degree 4 and a positive leading coefficient, make a graph with exactly <strong>2</strong> `x`-intercepts and <strong>3</strong> turning points.",
        why:"With the middle hump below the axis, only the two outer arms cross it, as in `y = x^4 - 5x^2 - 2`.",
        hints:["Start from the W-shape preset. It has 3 turning points already.", "Count the crossings: two valleys and a hump. Which part has to stay on the other side of the axis?", "Push the middle hump below the axis: `y = x^4 - 5x^2 - 2` crosses only twice."] },
      { id:"tc2", goal:[3, 6], prompt:"With degree 3 and a negative leading coefficient, make a graph with exactly <strong>1</strong> `x`-intercept but <strong>2</strong> turning points.",
        why:"Both turning points are on the same side of the axis, so the cubic crosses only once, as in `y = -x^3 + 3x + 5`.",
        hints:["First get 2 turning points: a cubic needs a positive `r` here to bend.", "A cubic always crosses at least once. To cross only once, both turning points must be on the same side of the axis.", "`y = -x^3 + 3x + 5`: turning points at (−1, 3) and (1, 7), both above the axis, so it crosses once, on the right."] },
      { id:"tc3", goal:[3, 6], stretch:true,
        prompt:"With degree 4, try to make a graph with exactly <strong>2</strong> turning points. When you’re convinced it can’t be done, press <strong>It’s impossible</strong> and choose the reason.",
        reasons:[
          { t:"A quartic’s arms point the same way, so it must turn an odd number of times.", ok:true, why:"" },
          { t:"2 is more than `n - 1`.", why:"`n - 1 = 3`, and 2 is less than that. The maximum isn’t the problem." },
          { t:"Every quartic has exactly 3 turning points.", why:"`y = x^4` has only 1. The rule is about which counts are possible." },
          { t:"It can be done with a negative `a`.", why:"Flipping the graph doesn’t change how many times it turns." }],
        why:"The arms are fixed by the leading term, so turns come in pairs. Degree 4 (arms the same way) needs an odd number: 1 or 3, never 2.",
        hints:["Trace a quartic with `a > 0` from the left: it comes down from Q2. Which way must it be heading at the very end?", "Each turn reverses direction. After 2 turns, which way is it heading?", "After an even number of turns it would be heading down again, but the right arm must go up. So the number of turns must be odd: reason A."] }
    ]
  },
  part3:{
    slug:"possible", name:"Possible?",
    heading:"Possible or impossible?",
    intro:"Each card shows a sketch and a claim about its degree and leading coefficient. Decide whether a polynomial like that could have this graph. If not, name the rule it breaks.",
    rules:RULES,
    cards:[
      { id:"s1", claim:"Degree 4, `a > 0`", desc:"Sketch: both arms up; 3 turning points; crosses the x-axis 4 times.", view:{ xmin:-3, xmax:3, ymin:-5, ymax:11 },
        answer:{ v:"P", co:[4, 0, -5, 0, 1], eq:"`y = x^4 - 5x^2 + 4`",
          fb:{ ends:"Degree 4 with `a > 0` sends both arms up, and that’s what the sketch shows.", turns:"Degree 4 allows up to 3 turning points; 3 is fine.", ints:"Degree 4 allows up to 4 `x`-intercepts; 4 is fine.", parity:"Degree 4 turns an odd number of times; 3 is odd, so that’s fine." } } },
      { id:"s2", claim:"Degree 3, `a < 0`", desc:"Sketch: rises from Q3 to Q1; 2 turning points; crosses the x-axis 3 times.", view:{ xmin:-3, xmax:3, ymin:-8, ymax:8 },
        answer:{ v:"I", rules:["ends"], tp:[[-1.2, 3], [1.2, -3]], arms:[-1, 1],
          rule:"End behaviour: a cubic with `a < 0` goes Q2 to Q4.", look:"A cubic with `a < 0` starts in Q2 and ends in Q4. This sketch does the opposite." } },
      { id:"s3", claim:"Degree 4, `a > 0`", desc:"Sketch: both arms up; 5 turning points; crosses the x-axis 4 times.", view:{ xmin:-3, xmax:3, ymin:-5, ymax:6 },
        answer:{ v:"I", rules:["turns"], tp:[[-2, -3], [-1, 2], [0, -3], [1, -1], [2, -3]], arms:[1, 1],
          rule:"Too many turning points: degree 4 allows at most 3.", look:"This sketch turns 5 times, but degree 4 allows at most 3 turning points." } },
      { id:"s4", claim:"Degree 5, `a > 0`", desc:"Sketch: rises from Q3 to Q1; 4 turning points; crosses the x-axis 5 times.", view:{ xmin:-2.6, xmax:2.6, ymin:-7, ymax:7 },
        answer:{ v:"P", co:[0, 4, 0, -5, 0, 1], eq:"`y = x^5 - 5x^3 + 4x`",
          fb:{ ends:"Degree 5 with `a > 0` goes Q3 to Q1, just like the sketch.", turns:"Degree 5 allows up to 4 turning points; 4 is fine.", ints:"Degree 5 allows up to 5 `x`-intercepts; 5 is fine.", parity:"Degree 5 turns an even number of times; 4 is even, so that’s fine." } } },
      { id:"s5", claim:"Degree 3, `a > 0`", desc:"Sketch: rises from Q3 to Q1; no turning points, flattens at the origin; crosses the x-axis once.", view:{ xmin:-2.5, xmax:2.5, ymin:-8, ymax:8 },
        answer:{ v:"P", co:[0, 0, 0, 1], eq:"`y = x^3`",
          fb:{ ends:"A cubic with `a > 0` goes Q3 to Q1, like the sketch.", turns:"Degree 3 allows up to 2 turning points; 0 is fine. Flattening at the origin isn’t a turn.", ints:"Degree 3 allows up to 3 `x`-intercepts; 1 is fine, because 3 is the most, not an exact count.", parity:"Degree 3 turns an even number of times; 0 is even, so that’s fine." } } },
      { id:"s6", claim:"Degree 3, `a > 0`", desc:"Sketch: both arms up; 1 turning point; never meets the x-axis.", view:{ xmin:-3, xmax:3, ymin:-4, ymax:8 },
        answer:{ v:"I", rules:["ends"], tp:[[0, 2]], arms:[1, 1],
          rule:"End behaviour: a cubic’s arms point opposite ways (so it must cross).", look:"A cubic’s arms point opposite ways, one up and one down, so it must cross the axis. This sketch has both arms up." } },
      { id:"s7", claim:"Degree 4, `a < 0`", desc:"Sketch: both arms down; 3 turning points; crosses the x-axis twice, and the middle dip stays above the axis.", view:{ xmin:-3, xmax:3, ymin:-6, ymax:11 },
        answer:{ v:"P", co:[2, 0, 5, 0, -1], eq:"`y = -x^4 + 5x^2 + 2`",
          fb:{ ends:"Degree 4 with `a < 0` sends both arms down, like the sketch.", turns:"Degree 4 allows up to 3 turning points; 3 is fine.", ints:"Degree 4 allows up to 4 `x`-intercepts; 2 is fine, because 4 is the most, not an exact count.", parity:"Degree 4 turns an odd number of times; 3 is odd, so that’s fine." } } },
      { id:"s8", claim:"Degree 3, `a > 0`", desc:"Sketch: rises from Q3 to Q1; 4 turning points; meets the x-axis 4 times, once as a touch.", view:{ xmin:-3.2, xmax:2.8, ymin:-6, ymax:6 },
        answer:{ v:"I", rules:["turns", "ints"], tp:[[-2.2, 2.5], [-1, -2], [0.3, 2], [1.4, 0]], arms:[-1, 1],
          rule:"Too many turning points (and too many `x`-intercepts): degree 3 allows at most 2 and 3.", look:"This sketch turns 4 times and meets the axis 4 times, but degree 3 allows at most 2 turning points and 3 `x`-intercepts." } },
      { id:"s9", claim:"Degree 5, `a < 0`", desc:"Sketch: falls from Q2 to Q4; 2 turning points; crosses the x-axis 3 times.", view:{ xmin:-2.6, xmax:2.6, ymin:-12, ymax:12 },
        answer:{ v:"P", co:[0, 4, 0, 3, 0, -1], eq:"`y = -x^5 + 3x^3 + 4x`",
          fb:{ ends:"Degree 5 with `a < 0` goes Q2 to Q4, like the sketch.", turns:"Degree 5 allows up to 4 turning points; 2 is fine, because 2 is even.", ints:"Degree 5 allows up to 5 `x`-intercepts; 3 is fine.", parity:"Degree 5 allows up to 4 turning points; 2 is fine, because 2 is even." } } },
      { id:"s10", claim:"Degree 6, `a > 0`", text:"A polynomial of degree 6 with `a > 0` and exactly 4 turning points",
        answer:{ v:"I", rules:["parity"],
          rule:"Wrong kind of number: even degree needs an odd number of turning points.", look:"Degree 6 turns an odd number of times: 1, 3 or 5. Exactly 4 can’t happen." } }
    ],
    blocks:[{ title:"What the rules say", html:"<p><strong>Four checks for any polynomial sketch</strong></p><ol><li><strong>Ends:</strong> even degree, same direction; odd degree, opposite directions. `a > 0` means the right arm goes up.</li><li><strong>Crossings:</strong> at most `n` `x`-intercepts. Odd degree crosses at least once.</li><li><strong>Turns:</strong> at most `n - 1` turning points.</li><li><strong>Pairs:</strong> even degree turns an odd number of times; odd degree an even number of times.</li></ol>" }],
    quickCheck:{
      title:"Could it exist?", summary:"Could it exist?",
      items:[
        { id:"q1", goal:[3, 6], prompt:"A degree 3 polynomial with no `x`-intercepts",
          choices:[{ t:"Possible", fb:"A cubic goes from one infinity to the other, one arm up and one down, so it must pass through height 0." }, { t:"Impossible", ok:true, fb:"Right. Its arms point opposite ways, so it must cross the axis somewhere in between." }] },
        { id:"q2", goal:[3, 6], prompt:"A degree 4 polynomial with exactly 1 `x`-intercept",
          choices:[{ t:"Possible", ok:true, fb:"Right. `y = x^4` touches the axis only at the origin." }, { t:"Impossible", fb:"`y = x^4` meets the axis only at 0. “At most 4” allows 1." }] },
        { id:"q3", goal:[3, 6], prompt:"A degree 5 polynomial with exactly 1 turning point",
          choices:[{ t:"Possible", fb:"With its arms pointing opposite ways, a quintic needs its turns in pairs. 1 turn would leave both arms heading the same way." }, { t:"Impossible", ok:true, fb:"Right. Odd degree turns an even number of times: 0, 2 or 4." }] },
        { id:"q4", goal:[3, 6], prompt:"A degree 4 polynomial with 4 `x`-intercepts and only 1 turning point",
          choices:[{ t:"Possible", fb:"To cross at 4 places, the graph has to come back down (or up) between each pair of crossings: at least 3 turns." }, { t:"Impossible", ok:true, fb:"Right. Between each pair of neighbouring crossings the graph must turn back, so 4 crossings need at least 3 turns." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Polynomial or not?", summary:"Polynomial or not?", noun:"function", goal:[1, 5],
        instruction:"Sort each function. If it’s a polynomial, decide whether its degree is odd or even.",
        how:"Tap a function, then tap the box it belongs in.",
        boxes:[{ id:"b1", label:"Not a polynomial" }, { id:"b2", label:"Polynomial, odd degree" }, { id:"b3", label:"Polynomial, even degree" }],
        items:[
          sortItem("i1", "`y = 5 + 2x - 3x^4`", EVEN, "The highest power is 4, even though `-3x^4` is written last.",
            { swap:"The first term written isn’t the leading term. Find the highest power: the powers are 0, 1 and 4, so the degree is 4.", reason:"the highest power is 4" }),
          sortItem("i2", "`y = 2^x`", NOT, "`x` is the exponent. That’s an exponential function.", { has:"`x` as an exponent", reason:"`x` is the exponent", goal:[1, 5] }),
          sortItem("i3", "`y = (x^2 + 1)(x^3 - 2)`", ODD, "Degrees add when you multiply: 2 + 3 = 5.",
            { swap:"Add the degrees of the factors: 2 + 3 = 5.", reason:"the degrees add: 2 + 3 = 5" }),
          sortItem("i4", "`y = √x + 1`", NOT, "`√x = x^{1/2}`: the power isn’t a whole number.", { has:"a fractional power", reason:"`√x = x^{1/2}` is a fractional power" }),
          sortItem("i5", "`y = 3/x^2`", NOT, "`3/x^2 = 3x^{-2}`: a negative power.", { has:"a negative power",
            hints:["Rewrite it with a power of `x`.", "`3/x^2 = 3x^{-2}`. Is −2 a whole number 0, 1, 2, …?", "No: a negative power, so it’s not a polynomial."] }),
          sortItem("i6", "`y = -7`", EVEN, "A constant is `-7x^0`: degree 0, which is even. Its graph is a horizontal line, with both “arms” the same way.",
            { notMsg:"A constant counts: `-7 = -7x^0`.", swap:"Find the highest power: `-7 = -7x^0`, so the degree is 0, which is even.", reason:"a constant is `-7x^0`, degree 0" }),
          sortItem("i7", "`y = x(x - 1)(x + 2)^2`", EVEN, "1 + 1 + 2 = 4.",
            { swap:"Add the degrees of the factors: 1 + 1 + 2 = 4.",
              hints:["Are all the powers of `x` whole numbers? Yes: it’s a product of polynomials.", "Add the degrees of the factors: `x` has degree 1, `(x - 1)` degree 1, `(x + 2)^2` degree 2.", "1 + 1 + 2 = 4: <strong>Polynomial, even degree</strong>."] }),
          sortItem("i8", "`y = sin x`", NOT, "A sinusoidal function: it repeats forever and never goes off to infinity.", { has:"a trig function", reason:"it’s a trig function", goal:[1, 5] }),
          sortItem("i9", "`y = (2x - 1)^3`", ODD, "Degree 3. Its leading term is `(2x)^3 = 8x^3`.",
            { swap:"Find the highest power: `(2x - 1)^3` starts with `(2x)^3 = 8x^3`, so the degree is 3.", reason:"its leading term is `(2x)^3 = 8x^3`, degree 3" }),
          sortItem("i10", "`y = x^3 - x^5 + 4`", ODD, "The highest power is 5.",
            { swap:"Find the highest power: the powers are 3, 5 and 0, so the degree is 5.", reason:"the highest power is 5" }),
          sortItem("i11", "`y = x^2/4 - 3x`", EVEN, "Dividing by the number 4 is fine: it’s `(1/4)x^2`, degree 2.",
            { swap:"Find the highest power: `x^2/4 = (1/4)x^2`, so the degree is 2.", reason:"`x^2/4 = (1/4)x^2`, degree 2" }),
          sortItem("i12", "`y = x + 1/x`", NOT, "`1/x = x^{-1}` is a negative power.", { has:"a negative power", reason:"`1/x = x^{-1}` is a negative power" })
        ] },
      { id:"deduce", type:"custom", title:"Deduce it", summary:"Deduce it", star:true, goal:[3, 4, 6],
        instruction:"Each clue describes a polynomial without showing it. Work out what must be true.",
        how:"Choose an answer (for question 3, every answer that applies), then press Check answer. If it’s wrong, read the feedback and try again.",
        items:[
          { id:"d1", goal:3, prompt:"A polynomial’s graph crosses the `x`-axis at 5 different points. What’s the lowest degree it can have?",
            options:[
              { t:"3", why:"A cubic meets the axis at most 3 times." },
              { t:"4", why:"Degree 4 allows at most 4 intercepts." },
              { t:"5", ok:true, why:"Degree `n` allows at most `n` `x`-intercepts, so 5 crossings need degree 5 or more." },
              { t:"6", why:"6 works, but it isn’t the lowest." }],
            hints:["How many `x`-intercepts can a polynomial of degree `n` have at most?", "At most `n`. So the degree must be at least the number of crossings.", "5 crossings need `n ≥ 5`. The lowest degree is 5."] },
          { id:"d2", goal:[3, 6], prompt:"A polynomial has 3 turning points and both arms point down. Lowest degree, and the sign of `a`?",
            options:[
              { t:"3, `a < 0`", why:"A cubic allows only 2 turning points, and its arms point opposite ways." },
              { t:"4, `a < 0`", ok:true, why:"3 turning points need `n - 1 ≥ 3`, so `n ≥ 4`. Both arms down needs even degree and `a < 0`." },
              { t:"4, `a > 0`", why:"`a > 0` sends the arms up." },
              { t:"5, `a < 0`", why:"Odd degree points the arms opposite ways." }],
            hints:["Which degrees allow 3 turning points? Which degrees send both arms the same way?", "3 turning points need `n ≥ 4`. Both arms down needs even degree and a negative `a`.", "The lowest is degree 4, with `a < 0`."] },
          { id:"d3", goal:[3, 6], star:true, kind:"sa", prompt:"A graph has exactly 4 turning points. Which of these degrees are possible? Select all.",
            options:[
              { t:"4", why:"Degree 4 allows at most 3 turning points." },
              { t:"5", ok:true, why:"Degree 5 allows up to 4 turning points, and 4 is even, as odd degree needs." },
              { t:"6", why:"Even degree turns an odd number of times." },
              { t:"7", ok:true, why:"Degree 7 allows up to 6 turning points, and 4 is an even number, as odd degree needs." }],
            answer:{ miss:{ "3":"Degree 7 allows up to 6 turning points, and 4 is an even number, as odd degree needs." } },
            why:"4 turning points need `n ≥ 5`, and an even number of turns needs an odd degree: 5 and 7.",
            hints:["Use two rules: at most `n - 1` turning points, and which numbers of turns each kind of degree allows.", "4 turning points need `n ≥ 5`. An even number of turns needs an odd degree.", "The odd degrees of at least 5 in the list: 5 and 7."] },
          { id:"d4", goal:4, star:true, prompt:"A polynomial’s range is `{y ∈ ℝ | y ≤ 6}`. What must be true?",
            options:[
              { t:"Odd degree, `a < 0`", why:"Odd degree reaches every `y`-value." },
              { t:"Even degree, `a < 0`", ok:true, why:"A highest value and no lowest value means both arms point down: even degree with `a < 0`." },
              { t:"Even degree, `a > 0`", why:"`a > 0` sends both arms up, so the range would have a lowest value, not a highest." },
              { t:"Degree exactly 2", why:"Any even degree with `a < 0` works, e.g. `-x^4 + 6`." }],
            hints:["The range has a highest value, 6, but no lowest value. Which way do the arms point?", "Both arms must point down. Which degrees and signs do that?", "Both arms down: even degree with `a < 0`."] },
          { id:"d5", goal:[1, 2], star:true, prompt:"`f(x) = (3 - x)^2(2x + 1)^3(x^2 + 4)`. Degree and end behaviour?",
            options:[
              { t:"Degree 7; Q3 to Q1", ok:true, why:"The leading term is `x^2 · 8x^3 · x^2 = 8x^7`: odd degree with a positive coefficient." },
              { t:"Degree 12; Q2 to Q1", why:"Degrees add: 2 + 3 + 2 = 7. 12 multiplies them." },
              { t:"Degree 7; Q2 to Q4", why:"The leading term is `(-x)^2 · (2x)^3 · x^2 = x^2 · 8x^3 · x^2 = 8x^7`. The minus in `(3 - x)` is squared away." },
              { t:"Degree 7; Q2 to Q1", why:"Odd degree points the arms opposite ways." }],
            hints:["Find the leading term of each factor, then multiply them.", "`(3 - x)^2` starts with `(-x)^2 = x^2`. `(2x + 1)^3` starts with `(2x)^3 = 8x^3`. `(x^2 + 4)` starts with `x^2`.", "`x^2 · 8x^3 · x^2 = 8x^7`: degree 7, `a = 8 > 0`, so Q3 to Q1."] },
          { id:"d6", goal:[3, 6], star:true, prompt:"A degree 4 polynomial with `a > 0` has `x`-intercepts only at −2, 1 and 3. It crosses the axis at −2 and at 3. What happens at `x = 1`, and how many turning points does it have?",
            options:[
              { t:"It touches the axis at 1; 3 turning points", ok:true, why:"Between −2 and 3 it must stay negative, so at 1 it touches the axis and turns back: a valley, a peak at (1, 0), a valley." },
              { t:"It crosses at 1; 3 turning points", why:"Follow the signs from the left arm (positive): crossing at −2 makes it negative; crossing at 1 would make it positive; crossing at 3 negative again. But the right arm must be positive. So it can’t cross at 1." },
              { t:"It touches at 1; 2 turning points", why:"Degree 4 turns an odd number of times." },
              { t:"It crosses at 1; 4 turning points", why:"At most 3 turning points for degree 4, and the sign argument rules out crossing." }],
            hints:["Follow the sign of the graph from left to right. With `a > 0` and even degree, where does it start?", "It starts positive (Q2). Crossing at −2 makes it negative. What sign must it have at the far right?", "It must end positive (Q1). Crossing at 3 makes it positive, so between −2 and 3 it must stay negative: at 1 it touches and turns back. Turns: a valley, a peak at (1, 0), a valley: 3 turning points."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Aisha", how:"",
        instruction:"Aisha made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Describe the end behaviour of `y = 2x^3 - 5x^4 + x - 7`.",
            steps:["The terms are `2x^3`, `-5x^4`, `x` and −7.", "The leading term is `2x^3`, because it comes first.", "Degree 3 is odd and the coefficient 2 is positive.", "So the end behaviour is Q3 to Q1."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 follows from step 2. The mistake is earlier.", "Step 4 follows from step 2. The mistake is earlier."],
            fixes:[
              { t:"The leading term is `-5x^4`, the highest power. Degree 4, `a = -5`: Q3 to Q4.", ok:true, why:"The highest power decides, wherever it’s written." },
              { t:"The leading term is −7, the last term.", why:"The constant has the lowest power, 0. The leading term has the highest." },
              { t:"The leading term is `2x^3`, but its sign is negative because of the −5.", why:"Each term keeps its own sign. And `2x^3` isn’t the leading term anyway." },
              { t:"Step 2 is correct as written.", why:"The leading term is the term with the highest power, not the first one written." }],
            hints:["Check which term has the highest power.", "The powers are 3, 4, 1 and 0. Which is highest?", "Step 2 is wrong: the leading term is `-5x^4`, so the end behaviour is Q3 to Q4."] },
          { id:"e2", goal:3, task:"State the possible numbers of `x`-intercepts and turning points for a polynomial of degree 5.",
            steps:["Degree 5 allows at most 5 `x`-intercepts.", "It has at least 1, because its arms point in opposite directions.", "It allows at most 4 turning points.", "So it can have 0, 1, 2, 3 or 4 turning points.", "And it can have 1, 2, 3, 4 or 5 `x`-intercepts."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 is true: for example, `x^2(x - 1)(x^2 + 1)` has exactly 2. The mistake is earlier."],
            fixes:[
              { t:"0, 2 or 4 turning points: the arms point opposite ways, so the turns come in pairs.", ok:true, why:"Odd degree means an even number of turning points." },
              { t:"Exactly 4 turning points.", why:"4 is the most, not the only possibility: `x^5` has none." },
              { t:"1, 3 or 5 turning points.", why:"Odd degree needs an even number of turns, and 5 is more than `n - 1`." },
              { t:"Step 4 is correct as written.", why:"With 1 or 3 turns, a quintic would end heading the wrong way. The turns come in pairs." }],
            hints:["Check step 4 against the arms: a quintic must end heading the opposite way from where it started.", "Each turn reverses direction. Can an odd number of turns work?", "Step 4 is wrong: degree 5 has 0, 2 or 4 turning points."] },
          { id:"e3", goal:4, task:"State the range of `y = -2x^4 + 4x^2 + 1`. (The graph is shown: highest points (−1, 3) and (1, 3), and a dip at (0, 1).)",
            fig:fig("e3", "Graph of y = −2x⁴ + 4x² + 1: both arms down, highest points (−1, 3) and (1, 3), and a dip at (0, 1)", "fig-sm"),
            steps:["Degree 4 with `a = -2 < 0`, so both arms point down.", "So the graph has a highest value but no lowest value.", "The `y`-intercept is 1.", "The range is `{y ∈ ℝ | y ≤ 1}`."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct.", "Step 3 is true. The question is what it’s used for.", ""],
            fixes:[
              { t:"The highest points are (±1, 3), so the range is `{y ∈ ℝ | y ≤ 3}`.", ok:true, why:"The range stops at the graph’s highest value, not at the `y`-intercept." },
              { t:"The range is `{y ∈ ℝ}`.", why:"Both arms point down, so values above the highest point are never reached." },
              { t:"The range is `{y ∈ ℝ | y ≥ 3}`.", why:"The arms point down, so the range goes down from 3, not up." },
              { t:"Step 4 is correct as written.", why:"(0, 1) is a dip between two higher peaks. Heights up to 3 are reached at `x = ±1`." }],
            hints:["The range runs down from the highest height the graph reaches. Where is that?", "The graph is higher at `x = ±1` than at `x = 0`.", "Step 4 is wrong: the highest value is 3, so the range is `{y ∈ ℝ | y ≤ 3}`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the shape lab: the budget bars, the pairs of turning points, or zooming out?" },
      { id:"j2", q:"In your own words, why does only the leading term decide the end behaviour?" },
      { id:"j3", q:"Explain to a friend how to check whether a sketch could be a degree 4 polynomial. Mention all four checks." },
      { id:"j4", q:"Which rule are you least sure about? Write one example that would help you remember it." }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What are the degree and leading coefficient of `f(x) = 4 + 3x^2 - 2x^5 + x`?", options:[
          { t:"Degree 5, leading coefficient −2", ok:true, why:"The highest power is 5, in the term `-2x^5`." },
          { t:"Degree 5, leading coefficient 4", why:"4 is the first term written, the constant. The leading coefficient belongs to the highest power." },
          { t:"Degree 2, leading coefficient 3", why:"`3x^2` is the second term written, not the highest power." },
          { t:"Degree 5, leading coefficient 2", why:"The coefficient includes its sign: −2." }] },
        b:{ prompt:"What are the degree and leading coefficient of `g(x) = 7x - x^4 + 6x^3 - 1`?", options:[
          { t:"Degree 4, leading coefficient −1", ok:true, why:"The highest power is 4, in `-x^4 = -1x^4`." },
          { t:"Degree 4, leading coefficient 7", why:"7 belongs to `7x`, the first term written." },
          { t:"Degree 3, leading coefficient 6", why:"6 is the biggest coefficient, but `6x^3` isn’t the highest power." },
          { t:"Degree 4, leading coefficient 1", why:"The coefficient includes its sign: −1." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What is the end behaviour of `y = -3x^5 + 2x^2 - 8`?", options:[
          { t:"Q2 to Q4", ok:true, why:"Odd degree, negative leading coefficient: up on the left, down on the right." },
          { t:"Q3 to Q1", why:"That ignores the negative leading coefficient." },
          { t:"Q3 to Q4", why:"Both arms down needs even degree. Degree 5 is odd." },
          { t:"Q2 to Q1", why:"Both arms up needs even degree and `a > 0`." }] },
        b:{ prompt:"What is the end behaviour of `y = 6 - x^4 + 5x^3`?", options:[
          { t:"Q3 to Q4", ok:true, why:"Even degree, negative leading coefficient (`-x^4`): both arms down." },
          { t:"Q2 to Q1", why:"That ignores the negative leading coefficient." },
          { t:"Q3 to Q1", why:"That’s the end behaviour of `5x^3`, a middle term." },
          { t:"Q2 to Q4", why:"Opposite directions needs odd degree. The degree is 4." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"A polynomial function has degree 6. What are the most `x`-intercepts and the most turning points it can have?", options:[
          { t:"6 `x`-intercepts and 5 turning points", ok:true, why:"At most `n` intercepts and `n - 1` turning points." },
          { t:"5 `x`-intercepts and 6 turning points", why:"These are swapped." },
          { t:"6 `x`-intercepts and 6 turning points", why:"Turning points max out at `n - 1`." },
          { t:"6 `x`-intercepts and 4 turning points", why:"4 is possible, but the most is 5." }] },
        b:{ prompt:"A polynomial function has degree 7. What are the most `x`-intercepts and the most turning points it can have?", options:[
          { t:"7 `x`-intercepts and 6 turning points", ok:true, why:"At most `n` intercepts and `n - 1` turning points." },
          { t:"6 `x`-intercepts and 7 turning points", why:"These are swapped." },
          { t:"7 `x`-intercepts and 7 turning points", why:"Turning points max out at `n - 1`." },
          { t:"7 `x`-intercepts and 5 turning points", why:"5 is not even possible for degree 7: odd degree turns an even number of times. The most is 6." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Which of these could be the number of turning points of a polynomial of degree 5?", options:[
          { t:"1", why:"Odd degree turns an even number of times." },
          { t:"3", why:"Odd degree turns an even number of times." },
          { t:"4", ok:true, why:"At most 5 − 1 = 4, and 4 is even, as odd degree requires." },
          { t:"5", why:"At most `n - 1 = 4`." }] },
        b:{ prompt:"Which of these could be the number of turning points of a polynomial of degree 6?", options:[
          { t:"2", why:"Even degree turns an odd number of times." },
          { t:"3", ok:true, why:"At most 5, and 3 is odd, as even degree requires." },
          { t:"4", why:"Even degree turns an odd number of times." },
          { t:"6", why:"At most `n - 1 = 5`." }] } },
      { id:"t2", cat:"T", goal:6,
        a:{ prompt:"A graph rises from Q3, has exactly 4 turning points, crosses the `x`-axis 3 times, and ends in Q1. What is the lowest degree a polynomial with this graph could have?", options:[
          { t:"3", why:"That counts the crossings. A cubic allows only 2 turning points." },
          { t:"4", why:"Degree 4 allows only 3 turning points, and its arms would point the same way." },
          { t:"5", ok:true, why:"4 turning points need `n - 1 ≥ 4`, so `n ≥ 5`. Opposite arms need odd degree. 5 works." },
          { t:"6", why:"Degree 6 allows 5 turning points, but even degree sends both arms the same way." }] },
        b:{ prompt:"A graph falls from Q2, has exactly 3 turning points, touches the `x`-axis twice without crossing, and ends in Q1. What is the lowest degree a polynomial with this graph could have?", options:[
          { t:"2", why:"That counts the touch points. A parabola has only 1 turning point." },
          { t:"3", why:"A cubic allows only 2 turning points, and its arms point opposite ways." },
          { t:"4", ok:true, why:"3 turning points need `n ≥ 4`. Both arms up needs even degree. 4 works, e.g. `(x - 1)^2(x + 1)^2`." },
          { t:"5", why:"Odd degree sends the arms opposite ways." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"Which function has range `{y ∈ ℝ | y ≥ -5}`?", options:[
          { t:"`y = x^4 - 2x^2 - 5`", why:"Its `y`-intercept is −5, but it dips lower: at `x = ±1` it’s 1 − 2 − 5 = −6." },
          { t:"`y = x^4 - 2x^2 - 4`", ok:true, why:"Both arms up, and its lowest points are at `x = ±1`: 1 − 2 − 4 = −5." },
          { t:"`y = x^5 - 5`", why:"Odd degree: the range is every real number." },
          { t:"`y = -x^4 + 2x^2 - 5`", why:"Both arms point down, so the range has a highest value (−4), not a lowest." }] },
        b:{ prompt:"Which function has range `{y ∈ ℝ | y ≤ 7}`?", options:[
          { t:"`y = -x^4 + 8x^2 + 7`", why:"Its `y`-intercept is 7, but it rises higher: at `x = ±2` it’s −16 + 32 + 7 = 23." },
          { t:"`y = -x^4 + 8x^2 - 9`", ok:true, why:"Both arms down, and its highest points are at `x = ±2`: −16 + 32 − 9 = 7." },
          { t:"`y = -x^3 + 7`", why:"Odd degree: the range is every real number." },
          { t:"`y = x^4 - 8x^2 + 7`", why:"Both arms point up, so the range has a lowest value (−9), not a highest." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which statement correctly describes the end behaviour of `y = -2x^6 + x`?", options:[
          { t:"As `x → -∞`, `y → -∞`, and as `x → ∞`, `y → -∞`.", ok:true, why:"Even degree, negative leading coefficient: both arms down." },
          { t:"As `x → -∞`, `y → ∞`, and as `x → ∞`, `y → -∞`.", why:"That’s odd-degree behaviour. Degree 6 sends both arms the same way." },
          { t:"As `y → -∞`, `x → -∞`, and as `y → -∞`, `x → ∞`.", why:"The arrows are written the wrong way round: describe what `y` does as `x` goes to ±∞." },
          { t:"As `x → -∞`, `y → ∞`, and as `x → ∞`, `y → ∞`.", why:"That ignores the negative leading coefficient." }] },
        b:{ prompt:"Which statement correctly describes the end behaviour of `y = 3x^5 - x^2`?", options:[
          { t:"As `x → -∞`, `y → -∞`, and as `x → ∞`, `y → ∞`.", ok:true, why:"Odd degree, positive leading coefficient: Q3 to Q1." },
          { t:"As `x → -∞`, `y → ∞`, and as `x → ∞`, `y → ∞`.", why:"That’s even-degree behaviour. Degree 5 sends the arms opposite ways." },
          { t:"As `y → -∞`, `x → -∞`, and as `y → ∞`, `x → ∞`.", why:"The arrows are written the wrong way round: describe what `y` does as `x` goes to ±∞." },
          { t:"As `x → -∞`, `y → ∞`, and as `x → ∞`, `y → -∞`.", why:"That’s Q2 to Q4, for a negative leading coefficient." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of why a polynomial of degree 4 can’t have exactly 2 turning points?", options:[
          { t:"“Its arms point the same way. After 2 turns it would be heading the way it started, but it has to end heading back the other way. So it must turn an odd number of times.”", ok:true, why:"The pairing argument." },
          { t:"“2 is more than 4 − 1.”", why:"4 − 1 = 3, and 2 is less than that." },
          { t:"“A quartic always has exactly 3 turning points.”", why:"`y = x^4` has only 1." },
          { t:"“It would need exactly 2 `x`-intercepts.”", why:"Intercepts and turning points are separate counts." }] },
        b:{ prompt:"Which is the best explanation of why every polynomial of degree 3 crosses the `x`-axis at least once?", options:[
          { t:"“Its arms point in opposite directions, one up and one down, so somewhere in between the graph must pass through height 0.”", ok:true, why:"End behaviour forces a crossing." },
          { t:"“Degree 3 means exactly 3 `x`-intercepts.”", why:"At most 3: `y = x^3 + 1` has only one." },
          { t:"“Its constant term is always 0.”", why:"`y = x^3 + 1` has constant term 1." },
          { t:"“It always has 2 turning points.”", why:"`y = x^3` has none." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A scientist’s graph flattens toward the line `y = 0` far to the left and climbs ever more steeply to the right, with no turning points. Which type of function fits it best?", options:[
          { t:"Exponential", ok:true, why:"Only an exponential levels off toward a horizontal line on one side while growing faster and faster on the other." },
          { t:"A polynomial of odd degree", why:"An odd-degree polynomial’s left arm goes to −∞ or ∞; it can’t level off toward `y = 0`." },
          { t:"A polynomial of even degree", why:"Both arms of an even-degree polynomial go to infinity; neither levels off." },
          { t:"Sinusoidal", why:"A sinusoid repeats; it doesn’t climb forever." }] },
        b:{ prompt:"A tide-height graph repeats the same rise and fall every 12.4 hours, for as long as it’s recorded, and always stays between −2 m and 2 m. Which type of function fits it best?", options:[
          { t:"Sinusoidal", ok:true, why:"Repeating forever between a highest and a lowest value is what sinusoidal functions do." },
          { t:"A polynomial of even degree", why:"Both arms of an even-degree polynomial go off to infinity, so it can’t stay between −2 and 2 forever." },
          { t:"A polynomial of high degree", why:"A polynomial of degree `n` turns at most `n - 1` times, so it can’t rise and fall forever." },
          { t:"Exponential", why:"An exponential keeps growing (or shrinking toward 0); it doesn’t repeat." }] } },
      { id:"a2", cat:"A", goal:2,
        a:{ prompt:"A company models its profit, in thousands of dollars, by `P(x) = -0.5x^4 + 6x^3 - 10x + 3`, where `x` is the number of units made, in hundreds. If the model were used for very large `x`, what would it predict?", options:[
          { t:"Profit eventually falls without limit (bigger and bigger losses), because the leading term `-0.5x^4` wins.", ok:true, why:"Even degree with `a < 0`: as `x → ∞`, `P → -∞`." },
          { t:"Profit grows without limit, because `6x^3` has the largest coefficient.", why:"Far out, the higher power wins whatever the coefficients: at `x = 100`, `-0.5x^4 = -50 000 000` and `6x^3 = 6 000 000`." },
          { t:"Profit levels off at 3.", why:"3 is the profit at `x = 0`. Polynomials don’t level off." },
          { t:"Profit eventually rises again, because the degree is even.", why:"Even degree with a <strong>negative</strong> leading coefficient sends both arms down." }] },
        b:{ prompt:"A biologist models a population by `N(t) = 2t^3 - 0.1t^4 + 50`, where `t` is time in years. If the model were used far into the future, what would it predict?", options:[
          { t:"The population eventually falls without limit (to impossible negative values), because the leading term `-0.1t^4` wins.", ok:true, why:"Even degree with `a < 0`: as `t → ∞`, `N → -∞`. That’s a sign the model only works for a limited time." },
          { t:"The population grows without limit, because `2t^3` has the larger coefficient.", why:"Far out, the higher power wins: at `t = 100`, `-0.1t^4 = -10 000 000` and `2t^3 = 2 000 000`." },
          { t:"The population levels off at 50.", why:"50 is the starting value. Polynomials don’t level off." },
          { t:"The population eventually rises again, because the degree is even.", why:"Even degree with a <strong>negative</strong> leading coefficient sends both arms down." }] } }
    ]
  },
  task:{
    title:"Design to spec", summary:"Design to spec",
    statement:"<p>An engineer needs a polynomial with the graph described below, and with the <strong>lowest degree</strong> that can do it. Use the shape lab’s sliders to build one. There are many answers. Can you find more than one?</p><div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The spec</h4><ul style=\"margin:4px 0 0;padding-left:1.2em\"><li>Both arms point up.</li><li>Exactly 3 turning points.</li><li>Exactly 2 `x`-intercepts.</li><li>`y`-intercept −3.</li></ul></div>",
    checks:["Both arms point up", "Exactly 3 turning points", "Exactly 2 `x`-intercepts", "`y`-intercept −3", "Lowest degree that can do all this"],
    tips:["Both arms up needs an even degree and a positive leading coefficient.",
      "You have {k} turning points. A W-shape has 3: try a negative `q`.",
      "You have {k} `x`-intercepts. With 3 turning points, keep the middle hump on the other side of the axis from at least one valley.",
      "The `y`-intercept is the constant term `s`.",
      "Your degree is {n}. Could a lower even degree have 3 turning points? Degree `n` allows at most `n - 1`."],
    explainPrompt:"Explain why degree 4 is the lowest degree that can meet the spec, and how you got exactly 2 `x`-intercepts.",
    vocab:"Use the words degree, leading coefficient, turning point and end behaviour.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another?",
    after3:"Every answer has degree 4: degree 2 allows only 1 turning point, and degree 3 has its arms pointing opposite ways."
  },
  cards:[
    ["Polynomial function", "A sum of terms `ax^n` with whole-number powers `n = 0, 1, 2, …`. Not polynomials: `2^x`, `√x`, `1/x`, `sin x`."],
    ["Degree and leading coefficient", "The highest power, and its coefficient, wherever it’s written. `4 + 3x^2 - 2x^5`: degree 5, `a = -2`."],
    ["Degree of a product", "Add the degrees: `(x^2 + 1)(x^3 - 2)` has degree 2 + 3 = 5."],
    ["End behaviour: even degree", "Both arms the same way: up if `a > 0` (Q2 to Q1), down if `a < 0` (Q3 to Q4)."],
    ["End behaviour: odd degree", "Opposite ways: Q3 to Q1 if `a > 0`; Q2 to Q4 if `a < 0`."],
    ["Why only the leading term matters far out", "A higher power beats any coefficient for large `|x|`: at `x = 100`, `-x^3 = -1 000 000` but `9x^2 = 90 000`."],
    ["Most `x`-intercepts and turning points", "Degree `n`: at most `n` `x`-intercepts and at most `n - 1` turning points. These are maximums, not exact counts."],
    ["Which numbers of turning points are possible?", "Even degree: an odd number (1, 3, …). Odd degree: an even number (0, 2, …). Turns come in pairs."],
    ["Odd degree and the `x`-axis", "Odd degree always crosses at least once, because its arms point opposite ways."],
    ["Range of a polynomial", "Odd degree: `{y ∈ ℝ}`. Even degree: `y ≥` (lowest value) if `a > 0`, `y ≤` (highest value) if `a < 0`."],
    ["Domain of a polynomial", "Always `{x ∈ ℝ}`."],
    ["Polynomial, exponential or sinusoidal?", "Polynomial: both arms go to ±∞, finitely many turns. Exponential: levels off toward a horizontal asymptote on one side. Sinusoidal: repeats forever between two values."]
  ]
};
