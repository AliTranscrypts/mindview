// MCV4U 07 Sketching Derivative Functions. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/07-sketching-derivative-functions.md
const DY = '<span class="m">d<i>y</i>/d<i>x</i></span>';
// misconception core sentences (plan §3), reused where the plan tags an option with M1–M7
const M1 = "`f′` records how steep `f` is, not how high it is.";
const M2 = "`f′ = 0` where the tangent is <strong>horizontal</strong>: at turning points, not where `f` crosses the axis.";
const M3 = "Below the axis isn’t the same as going down. A curve can be negative and rising.";
const M4 = "Shifting a line up doesn’t change its slope, so `f + c` has the same derivative. Shifting right moves every slope right.";
const M5 = "`f′` is greatest where `f` is steepest uphill, which is usually between turning points.";
const M6 = "At a corner there’s no single tangent, so `f′` doesn’t exist there: open circles on both sides.";
const M7 = "The derivative of a quadratic is linear: one degree lower.";
const fig = (key, aria) => '<canvas class="plot dp-thumb" data-fig="' + key + '" role="img" aria-label="' + aria + '"></canvas>';
const optFig = (key, aria) => '<canvas class="plot" data-fig="' + key + '" role="img" aria-label="' + aria + '"></canvas>';

export default {
  id:"07-sketching-derivative-functions",
  kind:"topic",
  title:"Sketching derivative functions",
  topic:"Sketching Derivative Functions",
  readyTopic:"sketching derivative functions",
  hero:{
    eq:"`f′(x)` = slope of the tangent to `y = f(x)` at `x`",
    eqLabel:"f prime of x equals the slope of the tangent to y equals f of x at x",
    eqSize:"sm",
    headline:"Every point has a slope. Plot the slopes.",
    text:"Slide a tangent line along a curve and write down its slope at every `x`. Those slopes form a new function, the <strong>derivative</strong>, written <strong>`f′(x)`</strong> or <strong>" + DY + "</strong>. It’s positive where `f` rises, negative where `f` falls, and <strong>zero</strong> at every turning point.",
    fig:{ html:'<div class="dp-hero"><canvas class="plot dp-top" id="hero-plot" role="img" aria-label="Top panel: the parabola y = (x − 2)² − 3 with a tangent line touching it at x = −0.5."></canvas>' +
      '<canvas class="plot dp-low" id="hero-d" role="img" aria-label="Bottom panel: the slope of the tangent plotted against x."></canvas></div>' }
  },
  goals:[
    "I can explain that `f′(x)` is the slope of the tangent to `y = f(x)` at `x`, and use the notations `f′(x)` and " + DY + ".",
    "I can build a table of tangent slopes and graph it to get the derivative.",
    "I can find the intervals where `f′` is positive, negative or zero from the graph of `f`.",
    "I can sketch the graph of `f′` from the graph of `f`, including the effect of translations.",
    "I can connect the type of function to its derivative: linear → constant, quadratic → linear, cubic → quadratic.",
    "I can recognize a point of inflection of `f` as a maximum or minimum of `f′`."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Slope of a line", goal:1, prompt:"What is the slope of the line through (1, 3) and (4, 9)?",
          options:[
            { t:"2", ok:true, why:"Rise 6 over run 3." },
            { t:"1/2", why:"That’s run over rise. Slope is rise ÷ run." },
            { t:"3", why:"That uses the run alone. Divide the rise by the run." },
            { t:"6", why:"That uses the rise alone: 6 ÷ 3." }],
          hints:["Slope = `Δy/Δx`.", "`Δy = 6`, `Δx = 3`.", "2."] },
        { id:"w2", skill:"Slope of a line", goal:1, prompt:"A line is horizontal. What is its slope?",
          options:[
            { t:"0", ok:true, why:"No rise for any run." },
            { t:"Undefined", why:"That mixes up horizontal and vertical. A vertical line has an undefined slope." },
            { t:"1", why:"Slope 1 rises at 45°." },
            { t:"It depends on how high the line is", why:"Height doesn’t affect slope." }],
          hints:["What is the rise along a horizontal line?", "0.", "0 ÷ run = 0."] },
        { id:"w3", skill:"Tangent slopes", goal:2, prompt:"Secants through P(5, 25) on `y = x^2` have slopes 11, 10.1, 10.01, 10.001 as `h` = 1, 0.1, 0.01, 0.001. What is the slope of the tangent at P?",
          options:[
            { t:"10", ok:true, why:"The secant slopes approach 10." },
            { t:"25", why:"25 is the `y`-value, not the slope." },
            { t:"11", why:"That’s the widest secant. Look at the trend as `h` shrinks." },
            { t:"10.001", why:"That stops at the last row. The tangent slope is the value they approach." }],
          hints:["What value are the slopes approaching?", "11, 10.1, 10.01, …", "10."] },
        { id:"w4", skill:"Tangent slopes", goal:3, prompt:"A smooth curve has a local maximum at (2, 5). What is the slope of its tangent there?",
          options:[
            { t:"0", ok:true, why:"The tangent at a smooth turning point is horizontal." },
            { t:"5", why:"5 is the height of the point. A slope records how steep the curve is, not how high it is." },
            { t:"2", why:"2 is the `x`-value of the point, not the slope." },
            { t:"Undefined", why:"The tangent is horizontal, so its slope is 0." }],
          hints:["Picture the tangent at the top of a hill.", "It’s flat.", "0."] },
        { id:"w5", skill:"Increasing and decreasing", goal:3, prompt:"On which interval is `y = (x - 1)^2` decreasing?",
          options:[
            { t:"`(-∞, 1)`", ok:true, why:"The parabola falls until its vertex at `x = 1`." },
            { t:"`(1, ∞)`", why:"That’s reversed. To the right of the vertex, it rises." },
            { t:"Where `y < 0`", why:"`(x - 1)^2` is never negative, but it does fall." },
            { t:"`(0, 1)`", why:"That starts at the `y`-axis. It’s decreasing for every `x < 1`." }],
          hints:["Where is the vertex?", "At `x = 1`; the parabola opens up.", "Falls on `(-∞, 1)`."] },
        { id:"w6", skill:"Increasing and decreasing", goal:3, prompt:"A function is increasing on an interval. What can you say about its tangent slopes there?",
          options:[
            { t:"They’re positive", ok:true, why:"Rising tangents have positive slopes." },
            { t:"They’re negative", why:"That’s reversed: a rising tangent goes up to the right, so its slope is positive." },
            { t:"They’re increasing", why:"That mixes up “rising” with “getting steeper”. A curve can rise while its slope shrinks." },
            { t:"They’re zero", why:"Zero slope is flat." }],
          hints:["Picture a tangent on a rising curve.", "It goes up to the right.", "Positive."] }
      ],
      refreshers:{
        "Slope of a line":"Slope = rise ÷ run = `Δy/Δx`. Horizontal lines have slope 0; lines rising to the right have positive slopes.",
        "Tangent slopes":"The tangent slope at P is the value the secant slopes approach as Q slides toward P (module 02). At a smooth turning point the tangent is horizontal, so its slope is 0.",
        "Increasing and decreasing":"`f` is increasing on an interval if it rises left to right there. Use open intervals of `x`, such as `(-∞, 1)`."
      }
    }
  },
  explore:{
    heading:"Slope tracker",
    intro:"Drag the point of tangency along the curve. Its slope is plotted on the lower panel. Leave a trail and watch the derivative appear.",
    fns:[
      { id:"F1", chip:"`-x/2 + 3`", eq:"`f(x) = -{x}/{2} + 3`" },
      { id:"F2", chip:"`(x - 2)^2 - 3`", eq:"`f(x) = (x - 2)^2 - 3`" },
      { id:"F3", chip:"`x^3 - 3x`", eq:"`f(x) = x^3 - 3x`" },
      { id:"F4", chip:"`x^4/4 - 2x^2`", eq:"`f(x) = {x^4}/{4} - 2x^2`" },
      { id:"F5", chip:"`|x - 1|`", eq:"`f(x) = |x - 1|`" },
      { id:"F6", chip:"Mystery curve", eq:"Mystery curve <span class=\"tiny muted\">(shown only as a graph)</span>" }
    ],
    modes:[{ id:"trail", t:"Trail" }, { id:"table", t:"Table" }, { id:"sketch", t:"Sketch" }],
    modeHow:{
      trail:"As the point moves, the lower panel plots (`x`, slope) and leaves a teal trail.",
      table:"<strong>Record slope</strong> adds a row (`x`, slope) to the table and a dot to the lower panel. <strong>Join the dots</strong> draws a smooth curve through them.",
      sketch:"Place the features of `f′` on the lower panel: tap the `x`-axis for a zero (or press Enter at the probe), mark the sign on each interval, and tap where `f′` has its peak or valley. <strong>Reveal</strong> overlays the true `f′`."
    },
    values:["−1", "−4", "−9", "0"],
    predIntro:"Make a prediction first. Then the slope tracker traces the trail so you can see what really happens.",
    predictions:[
      { id:"p1", fn:"F2", prompt:"F2 `f(x) = (x - 2)^2 - 3`, Trail mode. Before tracing, where will the trail on the lower panel cross the `x`-axis?",
        options:[{ t:"At `x = 2`, below the vertex", ok:true }, { t:"At `f`’s `x`-intercepts, `x = 2 ± √3`" }, { t:"At `x = -3`, the minimum value" }, { t:"It never crosses" }],
        explain:"The trail crosses 0 exactly as the tangent goes flat at the vertex. `f′ = 0` where the tangent is horizontal. `f`’s `x`-intercepts are where its <strong>height</strong> is 0, not its slope." },
      { id:"p2", fn:"F2", prompt:"F2 `f(x) = (x - 2)^2 - 3`, Trail mode. What shape will the trail of slopes make?",
        options:[{ t:"A straight line", ok:true }, { t:"A parabola" }, { t:"A horizontal line" }, { t:"A V shape" }],
        explain:"A straight line with slope 2. Slopes on a parabola change at a steady rate, so they form a line. The derivative of a quadratic is linear." },
      { id:"p3", fn:"F3", prompt:"F3, Trail mode. For `f(x) = x^3 - 3x`, where will the trail be lowest?",
        options:[{ t:"At `x = 0`, where `f` falls most steeply", ok:true }, { t:"At `x = 1`, `f`’s local minimum" }, { t:"At `x = -1`, `f`’s local maximum" }, { t:"At `x = √3`, where `f` crosses the axis" }],
        explain:"The trail bottoms out at (0, −3). At `x = 0` the curve changes from bending down to bending up, and the tangent cuts through it. At `x = 1` the slope is 0. It’s most negative at `x = 0`, the steepest point, which is a point of inflection." },
      { id:"p4", fn:"F5", prompt:"F5 `f(x) = |x - 1|`, Trail mode. What happens to the trail at `x = 1`?",
        options:[{ t:"It jumps from −1 to 1, with no value at `x = 1`", ok:true }, { t:"It passes smoothly through 0" }, { t:"It’s 0 at `x = 1`" }, { t:"It goes to infinity" }],
        explain:"Two horizontal pieces, with open circles at (1, −1) and (1, 1). Left of the corner every slope is −1, and right of it every slope is 1. At the corner there’s no single tangent." }
    ],
    chalIntro:"Use the slope tracker to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 2], prompt:"F3: move the point of tangency to a place where the tangent’s slope is 9.",
        why:"The slope row reads 9: at `x = 2` the slope is 3(4) − 3 = 9, and by symmetry `x = -2` works too.",
        hints:["Watch the slope readout, not `f(x)`.", "The slope is 0 at ±1 and grows quickly beyond.", "At `x = 2` the slope is 3(4) − 3 = 9; by symmetry `x = -2` works too."],
        msgs:{ fn:"Choose F3 first.", x3:"Slope 24: too steep. Come back toward the middle.", height:"That’s where the <strong>height</strong> is 9. Watch the slope row.",
          other:"The slope here is {m}. Watch the slope row and keep moving." } },
      { id:"tc2", goal:[3, 4], prompt:"F4, Sketch: place the zeros of `f′` and the sign of `f′` on each interval.",
        why:"`f` falls, rises, falls, rises, with horizontal tangents at −2, 0 and 2: `f′` is −, +, −, + on `(-∞, -2)`, `(-2, 0)`, `(0, 2)`, `(2, ∞)`.",
        hints:["`f′ = 0` where the tangent is flat.", "`f` has turning points at −2, 0 and 2.", "Falls, rises, falls, rises: −, +, −, +."],
        msgs:{ fn:"Choose F4 and Sketch mode, then place the zeros and the signs on the lower panel.", xint:"Those are where `f = 0`. Look for horizontal tangents.",
          zeros:"Look for every point where the tangent is flat: `f′ = 0` there.", fromf:"`f` can be below the axis and rising.", reversed:"Left of −2, `f` is falling.",
          missing:"Mark the sign of `f′` on every interval.", signs:"Check each interval: is `f` rising (+) or falling (−) there?" } },
      { id:"tc3", goal:[4, 6], stretch:true, prompt:"F6, the mystery curve, shown only as a graph: a local maximum at `x = -3` and a local minimum at `x = 1`. In Sketch mode, tap the `x`-value where `f′` is lowest and choose its approximate value.",
        why:"`f′` is lowest where `f` falls most steeply: at `x = -1`, midway between the turning points, the slope is −4.",
        hints:["`f′` is lowest where `f` falls most steeply.", "`f` falls from `x = -3` to `x = 1`. The steepest point is where it stops bending down and starts bending up, midway for a cubic.", "`x = -1`; drag the tangent there: slope −4."],
        msgs:{ fn:"Choose F6 and Sketch mode, pick the <strong>Peak or valley</strong> tool, and tap the lower panel where `f′` is lowest.", x1:"That’s `f`’s lowest point, where the slope is 0.",
          x3:"`f′ = 0` there.", xother:"`f′` is lowest where `f` falls most steeply.", noval:"Now choose the approximate value of `f′` there.",
          v0:"`f` is falling at `x = -1`, so `f′ < 0`.", v9:"Check with the tangent: the slope at `x = -1` is about −4." } }
    ]
  },
  part3:{
    slug:"match", name:"Graph ↔ derivative",
    heading:"Graph ↔ derivative",
    intro:"Work in both directions. Pair graphs with their derivatives, shift a graph and watch what its derivative does, then hunt for the steepest point. Then try the quick check.",
    stations:[
      { id:"st1", title:"Station 1: Matching gallery",
        text:"Tap a graph of `f`, then tap the graph of `f′` you think belongs to it. <strong>Check it with slopes</strong> draws three tangents on `f` at marked `x`-values and plots their slopes as dots on the `f′` you chose.",
        good:"All three slope dots land on this graph of `f′`.", bad:"The slope dots miss this graph. Try another `f′`.", done:"Every pair is matched." },
      { id:"st2", title:"Station 2: Translations",
        text:"`g(x) = f(x - @d{d}) + @c{c}`, where `f(x) = x^3 - 3x`. Move the sliders. The lower panel shows `f′` (grey dashes) and `g′` (long dashes)." },
      { id:"st3", title:"Station 3: Inflection finder",
        text:"Tap where `f` is steepest, the point where `f′` has a maximum or minimum. Drag the tangent, or move it with the arrow keys and press <strong>Mark this point</strong>.",
        rounds:[
          { name:"Graph 1", prompt:"Graph 1: tap where `f` falls most steeply.",
            why:"At (1, 1) `f` falls most steeply, with slope −3. The curve switches from bending down to bending up there, and the tangent crosses the curve: a point of inflection, at the valley of `f′`." },
          { name:"Graph 2", prompt:"Graph 2: tap where `f` rises most steeply.",
            why:"At (0, 0) the slope is 3, its greatest value. The curve switches from bending up to bending down there: a point of inflection, at the peak of `f′`." },
          { name:"Graph 3", prompt:"Graph 3 models a population. Tap where it grows fastest.",
            why:"At (1, 2) the growth is fastest, with slope 2. Before it the curve bends up; after it, it bends down: a point of inflection, at the peak of `f′`." }
        ],
        wrong:"Not the steepest point: the slope at {x} is {m}. Find where the tangent is steepest." }
    ],
    quickCheck:{
      title:"Quick check", summary:"Graph ↔ derivative quick check",
      items:[
        { id:"q1", goal:[4, 5], prompt:"`f` is a parabola opening down with vertex (1, 6). `f′` is…",
          choices:[
            { t:"A line with negative slope, crossing 0 at `x = 1`", ok:true, fb:"Right. `f` rises then falls: `f′` goes from + to −." },
            { t:"A line with positive slope, crossing 0 at `x = 1`", fb:"`f` rises then falls: `f′` goes from + to −." },
            { t:"A parabola", fb:"`f` rises then falls: `f′` goes from + to −." },
            { t:"A constant 6", fb:"`f` rises then falls: `f′` goes from + to −." }] },
        { id:"q2", goal:4, prompt:"`g(x) = f(x) - 4`. `g′` is…",
          choices:[
            { t:"The same as `f′`", ok:true, fb:"Right. Shifting down doesn’t change any slope." },
            { t:"`f′` shifted down 4", fb:"Shifting down doesn’t change any slope." },
            { t:"`f′ - 4x`", fb:"Shifting down doesn’t change any slope." },
            { t:"`4f′`", fb:"Shifting down doesn’t change any slope." }] },
        { id:"q3", goal:6, prompt:"`f′` has a maximum at `x = 3`. At `x = 3`, `f`…",
          choices:[
            { t:"Is steepest uphill: a point of inflection", ok:true, fb:"Right. `f′` is largest where `f` is steepest." },
            { t:"Has a local maximum", fb:"`f′` is largest where `f` is steepest." },
            { t:"Has a horizontal tangent", fb:"`f′` is largest where `f` is steepest." },
            { t:"Crosses the `x`-axis", fb:"`f′` is largest where `f` is steepest." }] },
        { id:"q4", goal:5, prompt:"`f` is a cubic. `f′` is…",
          choices:[
            { t:"A quadratic", ok:true, fb:"Right. One degree lower." },
            { t:"A cubic", fb:"One degree lower." },
            { t:"A line", fb:"One degree lower." },
            { t:"A constant", fb:"One degree lower." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Match `f` to `f′`", summary:"Match f to f′", goal:[4, 5],
        instruction:"Each graph on the left is a function `f`. Find the graph of its derivative `f′` on the right.",
        how:"Tap a graph of `f`, then tap its derivative on the right.",
        leftTitle:"`f`", rightTitle:"`f′`",
        left:[
          { id:"l1", goal:5, t:fig("m1", "Graph 1: a rising line through (0, 1) and (1, 3)"), why:"A line has the same slope everywhere: `f′` is the horizontal line at 2." },
          { id:"l2", goal:5, t:fig("m2", "Graph 2: a horizontal line at height 5"), why:"A horizontal graph has slope 0 everywhere: `f′` is the `x`-axis." },
          { id:"l3", goal:[4, 5], t:fig("m3", "Graph 3: a parabola opening up with vertex (0, 0)"), why:"It falls, turns at 0, then rises: `f′` is a line through the origin with slope 2." },
          { id:"l4", goal:[4, 5], t:fig("m4", "Graph 4: a parabola opening down with vertex (0, 4)"), why:"It rises, turns at 0, then falls: `f′` is a line through the origin with slope −2." },
          { id:"l5", goal:4, t:fig("m5", "Graph 5: a parabola opening up with vertex (1, 0)"), why:"The vertex moved right to `x = 1`, so `f′` crosses 0 at `x = 1`, with slope 2." },
          { id:"l6", goal:[4, 5], t:fig("m6", "Graph 6: a cubic that rises everywhere, flattening for a moment at the origin"), why:"`x^3` never falls and is flat only at 0: `f′` is a parabola touching 0 at the origin, never negative.",
            hints:["Is `x^3` ever decreasing?", "No; it flattens at 0 for a moment.", "So `f′ ≥ 0` and touches 0 at the origin."] },
          { id:"l7", goal:[4, 5], t:fig("m7", "Graph 7: a cubic with a local maximum at x = −1 and a local minimum at x = 1"), why:"Turning points at −1 and 1, falling between them: `f′` is an upward parabola with zeros at ±1." },
          { id:"l8", goal:4, t:fig("m8", "Graph 8: a V shape with its corner at the origin"), why:"Slope −1 on the left, 1 on the right, and no value at the corner: open circles at 0.",
            hints:["What is the slope of each straight piece?", "−1 on the left, 1 on the right.", "At 0 there’s a corner, so no value there."] }
        ],
        right:[
          { id:"r1", t:fig("d1", "Horizontal line at 2") },
          { id:"r2", t:fig("d2", "The x-axis: 0 everywhere") },
          { id:"r3", t:fig("d3", "Line through the origin with slope 2") },
          { id:"r4", t:fig("d4", "Line through the origin with slope −2") },
          { id:"r5", t:fig("d5", "Line crossing the x-axis at x = 1 with slope 2") },
          { id:"r6", t:fig("d6", "Parabola touching 0 at the origin, never negative") },
          { id:"r7", t:fig("d7", "Upward parabola with zeros at −1 and 1") },
          { id:"r8", t:fig("d8", "−1 for x < 0 and 1 for x > 0, with open circles at x = 0") }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l4|r3":"`f` falls for `x > 0`, so `f′` must be negative there.",
          "l2|r1":"A horizontal graph has slope 0 everywhere.",
          "l1|r3":"The slope of a line is constant: `f′` is a horizontal line.",
          "l1|r5":"The slope of a line is constant: `f′` is a horizontal line.",
          "l6|r7":"`x^3` has one flat point, at 0, and is never decreasing.",
          "l3|r5":"`x^2` turns at 0, so its derivative crosses 0 at 0."
        },
        wrongDefault:"Find where `f` has horizontal tangents; `f′` must be 0 there." },
      { id:"sketch", type:"custom", title:"Sketch the derivative", summary:"Sketch the derivative", star:true, goal:[3, 4, 6],
        instruction:"Build `f′` from the graph of `f`, or work backwards from `f′`. Items 4 to 6 are non-routine.",
        how:"Tap the lower panel’s `x`-axis to place a zero of `f′` (or move the tangent and press <strong>Place at the tangent</strong>); tap a zero again to remove it. Tap an interval to cycle its sign: +, −, blank.",
        shapes:[{ id:"flat", t:"A horizontal line" }, { id:"line", t:"A slanted line" }, { id:"up", t:"An upward parabola" }, { id:"down", t:"A downward parabola" }],
        general:{ zeros:"Find where `f` has horizontal tangents; `f′` must be 0 there.", signs:"Check each interval: where `f` rises, `f′` is +; where it falls, `f′` is −.",
          shape:"Look at how the slopes change from left to right: steadily (a line) or down and back up (a parabola)?", ext:"`f′` peaks where `f` is steepest uphill." },
        items:[
          { id:"s1", goal:[3, 4], kind:"sketch", fn:"s1", need:["zeros", "signs", "shape"],
            prompt:"Here is the graph of `f`. Build `f′`: place its zeros, mark its sign on each interval and choose its shape.",
            answer:{ zeros:[3], signs:[-1, 1], shape:"line" },
            wrong:[{ zeroAt:[1, 5], fb:"Those are `f`’s `x`-intercepts." }],
            why:"`f` falls, turns at `x = 3`, then rises: one zero at 3, − then +, and `f′` is a line." },
          { id:"s2", goal:[3, 4, 6], kind:"sketch", fn:"s2", need:["zeros", "signs", "shape", "ext"],
            prompt:"Here is the graph of `f`. Build `f′`: its zeros, signs and shape, and tap where it has its peak or valley.",
            answer:{ zeros:[0, 2], signs:[-1, 1, -1], shape:"down", ext:1 },
            wrong:[{ extAt:[0, 2], fb:"`f′` is 0 there; it peaks where `f` is steepest, between them." }],
            why:"Zeros at 0 and 2; −, +, −; a downward parabola with its maximum at `x = 1`, where `f` rises most steeply." },
          { id:"s3", goal:[3, 4], kind:"sketch", fn:"s3", need:["zeros", "signs"],
            prompt:"Here is the graph of `f`. Place the zeros of `f′` and mark its sign on each interval.",
            answer:{ zeros:[-1, 0, 1], signs:[-1, 1, -1, 1] },
            why:"Turning points at −1, 0 and 1; `f` falls, rises, falls, rises: −, +, −, +." },
          { id:"s4", goal:[3, 4], star:true, kind:"sketch", fn:"s4", need:["zeros", "signs"],
            prompt:"Here is the graph of `f`: flat at 0, and it never falls. Place the zeros of `f′` and mark its sign on each interval.",
            answer:{ zeros:[0], signs:[1, 1] },
            wrong:[{ signs:[1, -1], fb:"`x^3` never falls; the flat point doesn’t change the sign." }, { signs:[-1, 1], fb:"`x^3` never falls; the flat point doesn’t change the sign." }, { zerosMissing:[0], fb:"The tangent is flat at the origin." }],
            why:"Zero at 0 only, and + on both sides: no sign change.",
            hints:["Trace `x^3` from left to right. Does it ever go down?", "No: it only pauses at 0.", "`f′ = 0` at 0 and positive on both sides."] },
          { id:"s5", goal:4, star:true, kind:"mc",
            prompt:"The graph shows `f′`: a line with positive slope crossing the `x`-axis at `x = -1`. Which could be `f`?" + optFig("s5g", "Graph of f′: a rising line crossing the x-axis at x = −1"),
            options:[
              { t:optFig("s5a", "An upward parabola with its vertex at x = −1"), ok:true, why:"`f′` is negative left of −1 and positive right of it, so `f` falls, then rises, turning at `x = -1`." },
              { t:optFig("s5b", "A downward parabola with its vertex at x = −1"), why:"`f′` goes from − to +, so `f` falls then rises." },
              { t:optFig("s5c", "An upward parabola with its vertex at x = 1"), why:"`f′ = 0` at `x = -1`." },
              { t:optFig("s5d", "A rising line crossing the x-axis at x = −1"), why:M1 }] },
          { id:"s6", goal:6, star:true, kind:"mc",
            prompt:"`f′` has a maximum at `x = 2`, with `f′(2) = 3`. What’s true about `f` at `x = 2`?",
            options:[
              { t:"`f` is increasing most steeply there, with slope 3: a point of inflection", ok:true, why:"`f′(2) = 3` is the greatest slope, so `f` rises most steeply at `x = 2`." },
              { t:"`f` has a local maximum at `x = 2`", why:"A maximum of `f′` isn’t a maximum of `f`. `f′(2) = 3 > 0` means `f` is rising." },
              { t:"`f(2) = 3`", why:"3 is a slope, not a height. " + M1 },
              { t:"`f` has a horizontal tangent at `x = 2`", why:"That needs `f′(2) = 0`." }],
            hints:["`f′(2) = 3` tells you the slope of `f` at 2.", "The slope is at its greatest there: the steepest uphill point.", "Steepest point = point of inflection."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Gurpreet", how:"", goal:4,
        instruction:"Gurpreet made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Sketch `f′` for `f(x) = (x - 1)(x - 5)`, a parabola opening up with vertex (3, −4).",
            steps:["`f` is decreasing on `(-∞, 3)` and increasing on `(3, ∞)`.", "So `f′` is negative on `(-∞, 3)` and positive on `(3, ∞)`.", "`f′ = 0` where `f = 0`, at `x = 1` and `x = 5`.", "So `f′` is a parabola through (1, 0) and (5, 0)."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3. Check step 3."],
            fixes:[
              { t:"`f′ = 0` where the tangent is horizontal, only at the vertex `x = 3`. `f′` is a line through (3, 0) with positive slope.", ok:true, why:"Horizontal tangents happen once on a parabola, at its vertex; steps 1–2 say `f′` changes from − to +." },
              { t:"`f′ = 0` at `x = 1`, 3 and 5.", why:M2 },
              { t:"Step 3 is right, but the parabola opens down.", why:"Step 3 is the mistake: `f′ = 0` only where the tangent is horizontal." },
              { t:"`f′(3) = -4`, the vertex’s height.", why:M1 }],
            hints:["What does `f′ = 0` mean about the tangent?", "Horizontal: that happens once on a parabola.", "Only at `x = 3`; and steps 1–2 say `f′` changes from − to +."] },
          { id:"e2", goal:4, task:"`g(x) = f(x) + 10`. How is `g′` related to `f′`?",
            steps:["`g` is `f` shifted up 10.", "Each tangent to `g` is a tangent to `f` shifted up 10.", "So every tangent slope is 10 greater: `g′(x) = f′(x) + 10`.", "`g′` is `f′` shifted up 10."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"Shifting a line up doesn’t change its slope, so `g′(x) = f′(x)`.", ok:true, why:"Each tangent keeps its slope when it moves up 10, so every slope is the same." },
              { t:"`g′` is `f′` shifted right 10.", why:"Shifting up doesn’t move anything sideways, and it doesn’t change any slope." },
              { t:"`g′(x) = 10f′(x)`.", why:"Shifting up doesn’t stretch anything, and it doesn’t change any slope." },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["Does moving a line up change its steepness?", "No.", "`g′ = f′`."] },
          { id:"e3", goal:4, task:"Sketch `f′` for `f(x) = |x + 2|`.",
            steps:["For `x < -2`, `f(x) = -x - 2`, which has slope −1.", "For `x > -2`, `f(x) = x + 2`, which has slope 1.", "At `x = -2` the graph has a minimum, so `f′(-2) = 0`.", "`f′` is −1, then 0 at −2, then 1."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"At a corner there’s no single tangent, so `f′(-2)` doesn’t exist. Draw open circles at (−2, −1) and (−2, 1).", ok:true, why:"The graph isn’t smooth at `x = -2`: it has a corner, so there’s no tangent and no `f′(-2)`." },
              { t:"`f′(-2) = 1`, using the right piece.", why:"The left piece has slope −1, so neither piece wins. " + M6 },
              { t:"`f′(-2) = -2`, the `x`-value.", why:"−2 is the `x`-value, not a slope. " + M6 },
              { t:"Step 3 is correct.", why:M6 }],
            hints:["Is the graph smooth at `x = -2`?", "No, it has a corner.", "No tangent, so no `f′(-2)`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you when the trail appeared: its shape, or where it crossed zero?" },
      { id:"j2", q:"In your own words, explain the difference between the height of `f` and the height of `f′` at the same `x`." },
      { id:"j3", q:"Explain to a friend how to sketch `f′` from a graph of `f` in four steps." },
      { id:"j4", q:"Which part of sketching `f′` do you still find hard (signs, zeros, steepest points or corners)? What will you practise?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What does `f′(4) = -2` mean?", options:[
          { t:"The tangent to `y = f(x)` at `x = 4` has slope −2", ok:true, why:"`f′(4)` is the slope of the tangent at `x = 4`." },
          { t:"`f(4) = -2`", why:"That’s a height, not a slope." },
          { t:"The graph crosses the `x`-axis at `x = -2`", why:"Unrelated to slope." },
          { t:"`f` decreases by 2 from `x = 0` to `x = 4`", why:"That’s an average over an interval, not the slope at a point." }] },
        b:{ prompt:"What does " + DY + " = 5 at `x = -1` mean?", options:[
          { t:"The tangent at `x = -1` has slope 5", ok:true, why:DY + " is another way to write `f′(x)`: the slope of the tangent." },
          { t:"`y = 5` when `x = -1`", why:"That’s a height, not a slope. " + DY + " records how steep the graph is, not how high it is." },
          { t:"The point (5, −1) is on the graph", why:"Unrelated to slope." },
          { t:"`y` increases by exactly 5 from `x = -1` to `x = 0`", why:"That’s an average rate." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"`f` is a parabola opening down with vertex (2, 7). Where is `f′(x) > 0`?", options:[
          { t:"`(-∞, 2)`", ok:true, why:"`f` rises until the vertex." },
          { t:"`(2, ∞)`", why:"`f` falls there." },
          { t:"Wherever `f(x) > 0`", why:"Above the axis isn’t the same as going up. A curve can be positive and falling." },
          { t:"`(-∞, 7)`", why:"7 is a height; intervals of `x` come from the vertex’s `x`-value." }] },
        b:{ prompt:"`f` is a parabola opening up with vertex (−1, −4). Where is `f′(x) > 0`?", options:[
          { t:"`(-1, ∞)`", ok:true, why:"`f` rises after the vertex." },
          { t:"`(-∞, -1)`", why:"`f` falls there." },
          { t:"Wherever `f(x) > 0`", why:"Above the axis isn’t the same as going up. A curve can be positive and falling." },
          { t:"`(-4, ∞)`", why:"−4 is a height; intervals of `x` come from the vertex’s `x`-value." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"`f` is a cubic function. Its derivative `f′` is…", options:[
          { t:"A quadratic function", ok:true, why:"Derivatives lower the degree by one: cubic → quadratic." },
          { t:"A cubic function", why:"The derivative is one degree lower: cubic → quadratic." },
          { t:"A linear function", why:"Two degrees lower is too many." },
          { t:"A constant function", why:"That’s the derivative of a linear function." }] },
        b:{ prompt:"`f` is a quadratic function. Its derivative `f′` is…", options:[
          { t:"A linear function", ok:true, why:M7 },
          { t:"A quadratic function", why:M7 },
          { t:"A constant function", why:"That’s the derivative of a linear function." },
          { t:"A cubic function", why:"Derivatives lower the degree." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"`f` is a cubic with a local maximum at `x = -1`, a local minimum at `x = 3`, and no other turning points. Which describes `f′`?", options:[
          { t:"An upward parabola with zeros −1 and 3, negative between them", ok:true, why:"+ before −1, − between, + after 3." },
          { t:"A downward parabola with zeros −1 and 3, positive between them", why:"Signs reversed: between a max and a min, `f` falls." },
          { t:"A line through (−1, 0) and (3, 0)", why:"A line has at most one zero unless it’s the `x`-axis." },
          { t:"An upward parabola with zeros at `f`’s `x`-intercepts", why:M2 }] },
        b:{ prompt:"`f` is a cubic with a local minimum at `x = -2`, a local maximum at `x = 2`, and no other turning points. Which describes `f′`?", options:[
          { t:"A downward parabola with zeros −2 and 2, positive between them", ok:true, why:"− before −2, + between, − after 2." },
          { t:"An upward parabola with zeros −2 and 2, negative between them", why:"Signs reversed: between a min and a max, `f` rises, so `f′` is positive there." },
          { t:"A line through (−2, 0) and (2, 0)", why:"A line has at most one zero unless it’s the `x`-axis." },
          { t:"A downward parabola with zeros at `f`’s `x`-intercepts", why:M2 }] } },
      { id:"t2", cat:"T", goal:6,
        a:{ prompt:"The graph of `f′` is a downward parabola with vertex (1, 4). What does this tell you about `f` at `x = 1`?", options:[
          { t:"`f` is increasing most steeply there (slope 4): a point of inflection", ok:true, why:"4 is the greatest value of `f′`, so `f` is steepest uphill at `x = 1`." },
          { t:"`f` has a local maximum at `x = 1`", why:"`f′(1) = 4 > 0`, so `f` is rising there." },
          { t:"`f(1) = 4`", why:"4 is a slope, not a height. " + M1 },
          { t:"`f` has a horizontal tangent at `x = 1`", why:"That needs `f′(1) = 0`." }] },
        b:{ prompt:"The graph of `f′` is an upward parabola with vertex (−2, −3). What does this tell you about `f` at `x = -2`?", options:[
          { t:"`f` is decreasing most steeply there (slope −3): a point of inflection", ok:true, why:"−3 is the least value of `f′`, so `f` is steepest downhill at `x = -2`." },
          { t:"`f` has a local minimum at `x = -2`", why:"`f′(-2) = -3 < 0`, so `f` is falling there." },
          { t:"`f(-2) = -3`", why:"−3 is a slope, not a height. " + M1 },
          { t:"`f` has a horizontal tangent at `x = -2`", why:"That needs `f′(-2) = 0`." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"`g(x) = f(x - 3) + 5`. How is the graph of `g′` related to the graph of `f′`?", options:[
          { t:"It’s `f′` shifted right 3", ok:true, why:"The vertical shift doesn’t change slopes." },
          { t:"It’s `f′` shifted right 3 and up 5", why:"Shifting a graph up doesn’t change its slopes, so the 5 has no effect on `g′`." },
          { t:"It’s `f′` shifted left 3", why:"`x - 3` moves everything right." },
          { t:"It’s the same as `f′`", why:"The horizontal shift moves every slope." }] },
        b:{ prompt:"`g(x) = f(x + 2) - 4`. How is the graph of `g′` related to `f′`?", options:[
          { t:"It’s `f′` shifted left 2", ok:true, why:"`x + 2` moves every slope left 2, and the vertical shift doesn’t change slopes." },
          { t:"It’s `f′` shifted left 2 and down 4", why:"Shifting a graph down doesn’t change its slopes, so the 4 has no effect on `g′`." },
          { t:"It’s `f′` shifted right 2", why:"`x + 2` moves everything left." },
          { t:"It’s the same as `f′`", why:"The horizontal shift moves every slope." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"A student records tangent slopes of `f(x) = x^2`: at `x` = −2, −1, 0, 1, 2 the slopes are −4, −2, 0, 2, 4. Which conclusion is best supported?", options:[
          { t:"“The points lie on the line `y = 2x`, so `f′(x) = 2x` looks likely; checking more `x`-values would make the case stronger.”", ok:true, why:"All five points fit `y = 2x`, and more points would make the pattern more convincing." },
          { t:"“`f′(x) = x^2`, because the slopes come from `x^2`.”", why:"The slopes −4, −2, 0, 2, 4 aren’t values of `x^2`. " + M7 },
          { t:"“`f′(x) = 4`, because the largest slope is 4.”", why:"`f′` is a function, not one number." },
          { t:"“The slopes are symmetric, so `f′` is an even function.”", why:"They’re opposite in sign: the pattern is odd." }] },
        b:{ prompt:"A student records tangent slopes of `f(x) = x^3`: at `x` = −2, −1, 0, 1, 2 the slopes are 12, 3, 0, 3, 12. Which conclusion is best supported?", options:[
          { t:"“The points lie on `y = 3x^2`, so `f′(x) = 3x^2` looks likely; more `x`-values would confirm it.”", ok:true, why:"12, 3, 0, 3, 12 are the values of `3x^2` at −2, −1, 0, 1, 2." },
          { t:"“`f′(x) = x^3`.”", why:"The derivative of a cubic is quadratic, one degree lower. The slopes are never negative, but `x^3` is." },
          { t:"“`f′` is linear, because the `x`-values are evenly spaced.”", why:"The slopes fall from 12 to 0 and rise back to 12, so they don’t lie on a line." },
          { t:"“`f′` is odd, because `f` is odd.”", why:"The slopes are equal at ±`x`: even." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"Which is the best explanation of why `f′(x) = 0` at a smooth turning point of `f`?", options:[
          { t:"“At a turning point the tangent is horizontal, and a horizontal line has slope 0.”", ok:true, why:"A smooth turning point has a horizontal tangent, and its slope is 0." },
          { t:"“Because `f(x) = 0` there.”", why:M2 },
          { t:"“Because the graph changes direction, so the slope is undefined.”", why:"At a smooth turning point the tangent exists and is horizontal, so its slope is 0, not undefined." },
          { t:"“Because `f` is at its largest there, so its slope is largest.”", why:M5 }] },
        b:{ prompt:"Which is the best explanation of why `f′` is negative where `f` is decreasing?", options:[
          { t:"“Where `f` decreases, each tangent falls from left to right, so its slope is negative.”", ok:true, why:"Falling tangents have negative slopes." },
          { t:"“Because `f(x)` is negative there.”", why:M3 },
          { t:"“Because `f′` is always the opposite of `f`.”", why:"`f′` isn’t the opposite of `f`; it records the slope of `f`." },
          { t:"“Because the graph is below the `x`-axis there.”", why:M3 }] } },
      { id:"a1", cat:"A", goal:1,
        a:{ prompt:"A drone’s height `h(t)` rises from `t = 0` to `t = 4` s, hovers at a constant height until `t = 6` s, then descends. Which describes `h′(t)`?", options:[
          { t:"Positive on (0, 4), zero on (4, 6), negative after 6", ok:true, why:"Rising, hovering, then descending: +, 0, −." },
          { t:"Positive throughout, because the drone stays above the ground", why:"Above the ground isn’t the same as going up. The height is positive while the drone descends, but it’s falling." },
          { t:"Zero only at `t = 4` and `t = 6`", why:"Hovering means the height isn’t changing over the whole interval." },
          { t:"Equal to `h(t)`", why:"`h′` records how fast the height changes, not how high the drone is." }] },
        b:{ prompt:"The volume `V(t)` of water in a tank drains from `t = 0` to 5 min, stays constant until `t = 8` min, then rises. Which describes `V′(t)`?", options:[
          { t:"Negative on (0, 5), zero on (5, 8), positive after 8", ok:true, why:"Draining, steady, then filling: −, 0, +." },
          { t:"Positive throughout, because the tank always holds some water", why:"Holding water isn’t the same as filling. The volume is positive while it drains, but it’s falling." },
          { t:"Zero only at `t = 5` and `t = 8`", why:"A constant volume means it isn’t changing over the whole interval." },
          { t:"Equal to `V(t)`", why:"`V′` records how fast the volume changes, not how much water there is." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"A fish population `P(t)` grows slowly at first, grows fastest at `t = 6` years, then levels off near 2000. Which best describes `P′(t)`?", options:[
          { t:"It rises to a maximum at `t = 6`, then falls toward 0", ok:true, why:"The fastest growth at `t = 6` is the peak of `P′`; levelling off means the rate falls toward 0." },
          { t:"It rises toward 2000", why:"2000 is a population, not a rate. `P′` records how fast `P` grows." },
          { t:"It has a zero at `t = 6`", why:"Fastest growth means the largest rate, not zero." },
          { t:"It always increases, because `P` always increases", why:"A curve can rise while its slope shrinks: after `t = 6`, `P` still grows, but more slowly." }] },
        b:{ prompt:"A cup of coffee cools: its temperature `T(t)` drops quickly at first, then more slowly toward room temperature (20 °C). Which best describes `T′(t)`?", options:[
          { t:"It’s negative, starting at its most negative value and rising toward 0", ok:true, why:"The temperature falls fastest at first, so `T′` starts most negative; as the cooling slows, `T′` rises toward 0." },
          { t:"It’s negative and falls toward −20", why:"20 °C is a temperature, not a rate. The cooling slows, so `T′` approaches 0." },
          { t:"It’s positive, because the temperature is positive", why:"A positive temperature can still be falling, so `T′` is negative." },
          { t:"It decreases toward 20", why:"20 °C is a temperature, not a rate. `T′` records how fast `T` changes." }] } }
    ]
  },
  task:{
    title:"Steepest descent at `x = 1`", summary:"Steepest descent at x = 1",
    statement:"<p>Design a cubic by choosing where its turning points go. Its derivative is `f′(x) = 6@a{a}(x - p)(x - q)`. Meet every condition, and find all the answers.</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>`f` has a local maximum at a negative `x`-value.</li><li>`f` is decreasing at `x = 1`.</li><li>`f` falls most steeply at `x = 1`.</li></ol></div>" +
      "<p class=\"tiny muted\">Choose whole numbers from −5 to 5 for `p` and `q` (`p ≠ q`), and `@a{a} = 1` or −1. The tool draws `f(x) = @a{a}(2x^3 - 3(p + q)x^2 + 6pqx)` and, on the lower panel, `f′`. The order of `p` and `q` doesn’t matter.</p>",
    checks:["Local maximum at a negative `x`", "Decreasing at `x = 1`", "Falls most steeply at `x = 1`"],
    tips:["A local max is where `f′` changes from positive to negative. With `@a{a} = 1`, that happens at the smaller of `p` and `q`.",
      "`f′(1) < 0` means 1 lies between the turning points (with `@a{a} = 1`).",
      "`f′` is a parabola. It’s lowest at its vertex, halfway between its zeros, and only if it opens up."],
    explainPrompt:"Explain how the zeros of `f′` and the vertex of `f′` control the three conditions.",
    vocab:"Use the words derivative, local maximum, decreasing and steepest.",
    after3:"Lines 2 and 3 force `p + q = 2` with 1 between them; line 1 makes the smaller one negative. {−4, 6} would work too, but 6 is out of range."
  },
  cards:[
    ["`f′(x)`, " + DY, "The derivative: the slope of the tangent to `y = f(x)` at `x`."],
    ["`f′ > 0`", "`f` is increasing there."],
    ["`f′ < 0`", "`f` is decreasing there."],
    ["`f′ = 0`", "Horizontal tangent, e.g. at a smooth turning point."],
    ["Zeros of `f′`", "Line up with `f`’s turning points (not its `x`-intercepts)."],
    ["Max or min of `f′`", "`f` is steepest there: a point of inflection."],
    ["Corner", "No single tangent, so `f′` doesn’t exist there."],
    ["Degree drops by one", "Linear → constant; quadratic → linear; cubic → quadratic."],
    ["`g = f + c`", "`g′ = f′` (a vertical shift doesn’t change slopes)."],
    ["`g(x) = f(x - d)`", "`g′(x) = f′(x - d)`: `f′` shifts right `d`."],
    ["Sketching `f′` in four steps", "Zeros at flat points; signs from rising and falling; peaks at steepest points; breaks at corners."],
    ["Point of inflection", "Where the curve switches between bending up and bending down; the tangent crosses the curve."]
  ]
};
