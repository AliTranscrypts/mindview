// MHF4U 31 Graphing the Six Trig Functions. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/31-graphing-the-six-trig-functions.md
const fig = (key, aria, cls) => '<canvas class="plot' + (cls ? " " + cls : "") + '" data-fig="' + key + '" role="img" aria-label="' + aria + '"></canvas>';

// ---------- Practice 1: property grid feedback (plan §Practice, Activity 1) ----------
const FN = { sin:"`sin x`", cos:"`cos x`", tan:"`tan x`", csc:"`csc x`", sec:"`sec x`", cot:"`cot x`" };
const PARTNER = { csc:"`cos x`", sec:"`cos x`" };
const ZEROS = { sin:["`x = nπ`", "`sin π = 0`"], cos:["`x = π/2 + nπ`", "`cos(π/2) = 0`"], tan:["`x = nπ`", "`tan π = 0`"], cot:["`x = π/2 + nπ`", "`cot(π/2) = 0`"] };
const DIV = { tan:["`cos x`", "`x = π/2 + nπ`"], csc:["`sin x`", "`x = nπ`"], sec:["`cos x`", "`x = π/2 + nπ`"], cot:["`sin x`", "`x = nπ`"] };
function gridFb(f){
  const per = {}, rng = {}, zer = {}, asy = {};
  const two = f === "tan" || f === "cot";
  per.h = "π/2 is a quarter lap, and the values don’t repeat after it: `sin 0 = 0`, but `sin(π/2) = 1`.";
  if (two) per.p2 = "`tan x` repeats every half lap: the arm for `x + π` lies on the same line. Its period is π, and `cot x = 1/tan x` repeats whenever `tan x` does.";
  else per.p = "Half a lap later `P` is on the opposite side: `" + f + "(x + π) = -" + f + " x`, not `" + f + " x`. These repeat only every full lap, 2π. A reciprocal repeats exactly when its partner does.";
  if (f === "sin" || f === "cos") rng.all = rng.out = rng.outo = "`P` never goes above 1 or below −1, so its height and run stay in `[-1, 1]`.";
  if (f === "csc" || f === "sec") {
    rng.b = "That’s the partner’s range. Reciprocals of numbers between −1 and 1 are 1 or more in size.";
    rng.all = FN[f] + " is never strictly between −1 and 1: that would need " + (f === "sec" ? "`cos x`" : "`sin x`") + " to be bigger than 1 in size.";
    rng.outo = "`csc(π/2) = 1` and `sec 0 = 1`, so ±1 are reached: use square brackets.";
  }
  if (two) rng.b = rng.out = rng.outo = FN[f] + " takes every value: near its asymptotes it gets as large as you like in size, and " + (f === "tan" ? "`tan(π/6) = √3/3`" : "`cot(π/3) = √3/3`") + " is between −1 and 1.";
  const M1 = "`sin x` is the height, which is 0 at the far right and far left of the circle (`x = nπ`). `cos x` is the run, which is 0 at the top and bottom (`x = π/2 + nπ`).";
  if (f === "sin") zer.h = M1;
  if (f === "cos") zer.n = M1;
  if (f === "tan") zer.h = "At π/2, `tan x = 1/0` is undefined, not 0. `tan x = 0` where its numerator, `sin x`, is 0: `x = nπ`.";
  if (f === "cot") zer.n = "At `x = π`, `cot x = cos π/sin π = -1/0`: undefined. `cot x = 0` where `cos x = 0`: `x = π/2 + nπ`.";
  if (f === "csc" || f === "sec") zer.n = zer.h = "1 divided by a number is never 0, so a reciprocal function has no zeros. Where the partner is 0, the reciprocal is undefined: an asymptote.";
  if (ZEROS[f]) zer.none = FN[f] + " is 0 at " + ZEROS[f][0] + ": for example, " + ZEROS[f][1] + ".";
  if (f === "sin" || f === "cos") asy.n = asy.h = "`sin x` and `cos x` are defined for every `x`: `P` always has a height and a run.";
  if (f === "tan") asy.n = "At `x = nπ`, `tan x = 0/(±1) = 0`: a zero. The asymptotes are where the denominator, `cos x`, is 0.";
  if (f === "csc") asy.h = "csc pairs with sine and sec pairs with cosine. Asymptotes are at the zeros of the partner.";
  if (f === "sec") asy.n = "csc pairs with sine and sec pairs with cosine. Asymptotes are at the zeros of the partner.";
  if (f === "cot") asy.h = "At π/2, `tan x` is undefined, but `cot x = cos x/sin x = 0/1 = 0`: a zero. `cot x` is undefined where `sin x = 0`.";
  if (DIV[f]) asy.none = FN[f] + " divides by " + DIV[f][0] + ", which is 0 at " + DIV[f][1] + ": those are vertical asymptotes.";
  void PARTNER;
  return { period:per, range:rng, zeros:zer, asym:asy };
}
const gridRow = (f, ans, hints) => ({ id:f, label:"`y = " + f + " x`", answer:ans, fb:gridFb(f), hints });

// ---------- Practice 2: Track it down items ----------
const OUT = "That’s outside the interval. Add or subtract 2π (or π for tan and cot) to move into it.";

export default {
  id:"31-graphing-the-six-trig-functions",
  kind:"topic",
  title:"Graphing the six trig functions",
  topic:"Graphing the 6 Trig Functions",
  readyTopic:"graphing the six trig functions",
  hero:{
    eq:"`y = sin @t{x}`", eqLabel:"y equals sine x",
    headline:"One circle, six graphs",
    text:"A point `P` travels around the unit circle. After it has travelled a distance `x`, its height is `sin x` and its run is `cos x`. Plot them as `P` moves and two waves appear, each with <strong>period</strong> 2π and <strong>amplitude</strong> 1. The <strong>tangent function</strong> comes from where `P`’s arm meets a line touching the circle. The <strong>reciprocal functions</strong> `csc x`, `sec x` and `cot x` come from flipping the first three: wherever a function is 0, its reciprocal has a <strong>vertical asymptote</strong>.",
    fig:{ html:'<canvas class="plot hero-cgl" id="hero-plot" role="img" aria-label="A point travels once around the unit circle while its height traces the graph of y = sin x from 0 to 2π. The lap unrolls onto the x-axis as 2π. Then the graph of y = csc x appears beside the dashed sine curve, with vertical asymptotes at 0, π and 2π."></canvas>' },
    cap:{ lap:"One lap = 2π along the axis", end:"`sin x` and its reciprocal, `csc x`" }
  },
  goals:[
    "I can explain how the graphs of `y = sin x` and `y = cos x` come from the height and the run of a point travelling around the unit circle, with `x` in radians as the distance travelled.",
    "I can sketch `y = sin x` and `y = cos x` and state their key properties: period 2π, amplitude 1, maximum and minimum points, zeros, domain and range, and where they increase or decrease.",
    "I can sketch `y = tan x` and explain its zeros, its vertical asymptotes and its period of π, using the unit circle or `tan x = sin x/cos x`.",
    "I can sketch `y = csc x`, `y = sec x` and `y = cot x` from the graphs of `sin x`, `cos x` and `tan x`: zeros become asymptotes, points at height 1 or −1 stay put, and maximums and minimums swap.",
    "I can state the domain, range, period, zeros and asymptotes of all six functions in correct notation, and explain why `csc x = 1/sin x` is not `sin^{-1} x`.",
    "I can use the six graphs to solve problems: find where a function has a given value or sign, count solutions over several laps, and apply the graphs in a context."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Unit circle", goal:1,
          prompt:"`P` is the point on the unit circle at angle 4π/3. What is `P`’s `y`-coordinate?",
          options:[
            { t:"`-√3/2`", ok:true, why:"4π/3 = π + π/3 is in quadrant 3 with reference angle π/3. The `y`-coordinate is `sin(4π/3)`: size `√3/2` from π/3, negative below the `x`-axis." },
            { t:"`-1/2`", why:"`-1/2` is `cos(4π/3)`, `P`’s `x`-coordinate. The `y`-coordinate is the sine." },
            { t:"`√3/2`", why:"Right size, wrong sign. 4π/3 is below the `x`-axis, so the `y`-coordinate is negative." },
            { t:"`√3`", why:"`√3` is `tan(4π/3) = y/x`. The `y`-coordinate itself is `-√3/2`." }],
          hints:["Find the quadrant and the reference angle of 4π/3.", "4π/3 = π + π/3: quadrant 3, reference angle π/3. `P`’s `y`-coordinate is `sin(4π/3)`.", "`sin(π/3) = √3/2`, and `y` is negative in quadrant 3, so the `y`-coordinate is `-√3/2`."] },
        { id:"w2", skill:"Unit circle", goal:5,
          prompt:"What is the exact value of `csc(5π/6)`?",
          options:[
            { t:"2", ok:true, why:"csc = 1/sin, and `sin(5π/6) = 1/2` (quadrant 2, reference angle π/6, sine positive). `1 ÷ 1/2 = 2`." },
            { t:"`1/2`", why:"`1/2` is `sin(5π/6)`. csc is its reciprocal, `1 ÷ 1/2`." },
            { t:"−2", why:"In quadrant 2 sine is positive, so its reciprocal is positive too." },
            { t:"`-2√3/3`", why:"`-2√3/3 = 1/cos(5π/6)`, which is `sec(5π/6)`. csc pairs with sine." }],
          hints:["csc is the reciprocal of which ratio?", "`csc θ = 1/sin θ`. 5π/6 is in quadrant 2 with reference angle π/6, so `sin(5π/6) = 1/2`.", "`csc(5π/6) = 1 ÷ 1/2 = 2`."] },
        { id:"w3", skill:"Radian measure", goal:1,
          prompt:"A point starts at (1, 0) and travels counterclockwise around the unit circle a distance of 3π/2. Where does it stop?",
          options:[
            { t:"(0, −1)", ok:true, why:"On the unit circle, the distance travelled equals the angle in radians. A lap is 2π, so 3π/2 is three quarters of a lap: the bottom of the circle." },
            { t:"(0, 1)", why:"Three quarters of a lap <strong>clockwise</strong> ends at the top. Counterclockwise, it ends at the bottom." },
            { t:"(−1, 0)", why:"(−1, 0) is a distance of π, half a lap. 3π/2 goes a further quarter lap." },
            { t:"`(-√2/2, √2/2)`", why:"That’s the angle 3π/4, which you’d get from `3π/2 = 2θ`. On a circle of radius 1 the arc length <em>is</em> the angle: `θ = 3π/2`." }],
          hints:["On a circle of radius 1, arc length = angle in radians (`a = rθ` with `r = 1`).", "So the angle is 3π/2. A full lap is 2π, and 3π/2 is three quarters of it.", "Three quarters of a lap counterclockwise from (1, 0) ends at the bottom of the circle: (0, −1)."] },
        { id:"w4", skill:"Reciprocals", goal:4,
          prompt:"The numbers 0.1, 0.01, 0.001, … get closer and closer to 0. What happens to their reciprocals?",
          options:[
            { t:"They grow larger and larger, without limit.", ok:true, why:"1 ÷ 0.1 = 10, 1 ÷ 0.01 = 100, 1 ÷ 0.001 = 1000. Each number is one-tenth of the one before, so its reciprocal is 10 times as large." },
            { t:"They get closer and closer to 0 as well.", why:"1 ÷ 0.01 = 100, which is far from 0. A tiny number fits into 1 many times." },
            { t:"They get closer and closer to 1.", why:"1 ÷ 0.1 = 10 and 1 ÷ 0.01 = 100: they move away from 1." },
            { t:"They switch to negative values.", why:"The reciprocal of a positive number is positive: 1 ÷ 0.001 = 1000." }],
          hints:["Work out 1 ÷ 0.1 and 1 ÷ 0.01.", "1 ÷ 0.1 = 10 and 1 ÷ 0.01 = 100.", "Each time the number becomes one-tenth as large, its reciprocal becomes 10 times as large: 10, 100, 1000, … without limit."] },
        { id:"w5", skill:"Reciprocals", goal:4,
          prompt:"Which numbers are equal to their own reciprocals?",
          options:[
            { t:"1 and −1 only", ok:true, why:"`x = 1/x` means `x^2 = 1`, so `x = 1` or `x = -1`. Check: 1 ÷ (−1) = −1." },
            { t:"1 only", why:"−1 works too: 1 ÷ (−1) = −1." },
            { t:"0, 1 and −1", why:"0 has no reciprocal: `1/0` has no value." },
            { t:"Every number between −1 and 1", why:"`1 ÷ 1/2 = 2`, which isn’t `1/2`. Numbers between −1 and 1 have reciprocals outside that band." }],
          hints:["Solve `x = 1/x`.", "Multiply both sides by `x` (which can’t be 0): `x^2 = 1`.", "`x = 1` or `x = -1`. 0 can’t be one, because `1/0` has no value."] },
        { id:"w6", skill:"Sine graph in degrees", goal:2,
          prompt:"In Grade 11 you graphed `y = sin x` with `x` in degrees. What are its period and amplitude?",
          options:[
            { t:"Period 360°, amplitude 1", ok:true, why:"The graph repeats every full turn, 360°. It rises 1 above its axis `y = 0` and falls 1 below it." },
            { t:"Period 360°, amplitude 2", why:"2 is the distance from the maximum, 1, down to the minimum, −1. The amplitude is half of that." },
            { t:"Period 180°, amplitude 1", why:"sin 180° = sin 0° = 0, but the graph doesn’t repeat after 180°: it’s above the axis from 0° to 180° and below it from 180° to 360°." },
            { t:"Period 90°, amplitude 1", why:"90° is where the first maximum is. One full cycle takes four times as long." }],
          hints:["Period: how far along the `x`-axis before the whole pattern starts again? Amplitude: how far above its middle line does the graph rise?", "The maximum is 1 and the minimum is −1, so the middle line is `y = 0`. The pattern starts again after one full turn.", "Period 360°; amplitude `(1 - (-1))/2 = 1`."] }
      ],
      refreshers:{
        "Unit circle":"The point at angle `x` on the unit circle is `(cos x, sin x)`. For a special angle, the reference angle gives the size and the quadrant gives the sign: 4π/3 is in quadrant 3 with reference angle π/3, so its point is `(-1/2, -√3/2)`. The reciprocal ratios are `csc x = 1/sin x`, `sec x = 1/cos x` and `cot x = cos x/sin x`, so `csc(5π/6) = 1 ÷ 1/2 = 2`. `tan x = sin x/cos x` is undefined where its denominator, `cos x`, is 0.",
        "Radian measure":"On a circle of radius 1, an arc’s length equals its angle in radians (`a = rθ` with `r = 1`). A full lap is 2π, half a lap is π and a quarter lap is π/2. Travelling 3π/2 counterclockwise from (1, 0) is three quarters of a lap, ending at (0, −1).",
        "Reciprocals":"The reciprocal of a number is 1 divided by it. Reciprocals keep the sign and swap big and small: 1 ÷ 0.01 = 100 and 1 ÷ 100 = 0.01. Only 1 and −1 are their own reciprocals. 0 has no reciprocal, because `1/0` has no value.",
        "Sine graph in degrees":"`y = sin x` (in degrees) starts at 0, rises to 1 at 90°, is back to 0 at 180°, falls to −1 at 270° and is back to 0 at 360°. Then the whole pattern repeats, so the period is 360°. The amplitude is half the distance from the maximum to the minimum: `(1 - (-1))/2 = 1`."
      }
    }
  },
  explore:{
    heading:"Unwrap the circle",
    intro:"Move `P` around the unit circle and watch its height and run become graphs. Then switch to the tangent line and watch `tan x` appear, asymptotes and all. The panel lists every value as you go.",
    ui:{
      halfNote:"The `x`-axis is drawn at half scale in this view.",
      trueNote:"Drawn to true scale on wider screens.",
      carryCap:"The run, stood up, is the height of the cosine graph.",
      unrollLab:"distance travelled = x",
      offScreen:"T is off the screen",
      tangentLab:"tangent line x = 1",
      p4Banner:"No meeting point: `tan(π/2)` is undefined",
      movingNote:"Increasing and decreasing describe the graph read from left to right, which is `P` moving counterclockwise.",
      waveFacts:"Period 2π (one lap) · Amplitude `1 = (1 - (-1))/2` · Range `{y ∈ ℝ | -1 ≤ y ≤ 1}`",
      lock:"The slider is locked until you check your angle for challenge 3.",
      tc3Hint:"Type the number in front of π as a fraction: choose the top and the bottom."
    },
    predictions:[
      { id:"p1", prompt:"`P` is about to travel one lap, tracing both `y = sin x` and `y = cos x`. On which interval will <strong>both</strong> graphs be going down?",
        options:[{ t:"`π/2 < x < π`", ok:true }, { t:"`0 < x < π/2`" }, { t:"`π < x < 3π/2`" }, { t:"`3π/2 < x < 2π`" }],
        explain:"`sin x` falls while `P` moves down, from the top (π/2) to the bottom (3π/2). `cos x` falls while `P` moves left, from the far right (0) to the far left (π). Both happen only in quadrant 2, where `P` is moving down <strong>and</strong> to the left. In quadrant 1 the height is rising; in quadrant 3 the run is rising; in quadrant 4 both are rising." },
      { id:"p2", prompt:"You’ve traced `y = sin x` from 0 to 2π. Now `P` will travel <strong>clockwise</strong>, from `x = 0` to `x = -2π`. What will the new piece of graph, from −2π to 0, look like?",
        options:[{ t:"An exact copy of the piece from 0 to 2π, moved 2π to the left", ok:true }, { t:"The mirror image of the piece from 0 to 2π in the `y`-axis" }, { t:"A wave that stays below the `x`-axis the whole way, because the angles are negative" }, { t:"Nothing: negative angles have no sine" }],
        explain:"Going clockwise a distance π/2 puts `P` at the bottom of the circle, the same point as 3π/2, so `sin(-π/2) = sin(3π/2) = -1`. Every `x` and `x + 2π` end at the same point, so the graph repeats every 2π, in both directions: that’s what period 2π means. A mirror image would need `sin(-π/2)` to equal `sin(π/2) = 1`, but it’s −1. And negative angles don’t force negative heights: at −3π/2, `P` is at the top." },
      { id:"p3", prompt:"The arm is at π/6, where `tan x = √3/3`. It will turn half a lap further, to 7π/6. What will `tan(7π/6)` be?",
        options:[{ t:"`√3/3`", ok:true }, { t:"`-√3/3`" }, { t:"`√3`" }, { t:"Undefined: an arm pointing into quadrant 3 can’t reach the tangent line" }],
        explain:"At 7π/6 the arm points the opposite way along the <strong>same line</strong> as at π/6. Extended back through the origin, it meets the tangent line at the same point, so `tan(7π/6) = tan(π/6) = √3/3`. In numbers: both `sin x` and `cos x` change sign, so their quotient doesn’t. Tangent repeats every half lap: its period is π, not 2π." },
      { id:"p4", prompt:"The arm will turn slowly from 5π/12 to 7π/12, passing straight up at π/2. What happens to `tan x`?",
        options:[{ t:"It grows larger and larger, has no value at π/2, then continues from very large negative values", ok:true }, { t:"It reaches a maximum at π/2, then decreases smoothly" }, { t:"It falls through 0 at π/2" }, { t:"It levels off at 1 near π/2" }],
        explain:"Just before π/2 the arm is very steep, so its line meets `x = 1` very high up. At π/2 the arm is vertical, parallel to the tangent line, so there’s no meeting point: `tan(π/2) = 1/0` is undefined. Just after π/2 the arm leans left, and its line, extended back through the origin, meets `x = 1` very far <strong>below</strong> the axis. That jump is a vertical asymptote. It happens wherever `cos x = 0`, the denominator of `sin x/cos x`." }
    ],
    chalIntro:"Set the unwrapper, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 6], prompt:"Two laps view. Set the angle so that `P`’s height is −1/2 <strong>and</strong> `P` is to the right of the `y`-axis.",
        why:"Quadrant 4 with reference angle π/6: 11π/6, or −π/6 going clockwise. Both are the same point.",
        named:{
          side:"The height is right, −1/2, but `P` is left of the `y`-axis: its run is negative. Go to the other side, still below the axis.",
          plus:"Here `sin x = +1/2`: `P` is above the `x`-axis. You need a height of −1/2.",
          deep:"`P` is in the right quadrant, but its height is `-√3/2 ≈ -0.87`. A drop of only 1/2 needs reference angle π/6.",
          bottom:"That’s the bottom of the circle: height −1.",
          swap:"Here the <strong>run</strong> is −1/2 and `P` is above the axis. The height is `sin x`, the `y`-coordinate: you need `P` below the `x`-axis at height −1/2, and to the right of the `y`-axis.",
          other:"Check the readout: you need `sin x = -1/2` (the height) and `cos x > 0` (`P` right of the `y`-axis)."
        },
        hints:["Which quadrant has `P` below the `x`-axis and to the right of the `y`-axis?", "Quadrant 4. A height of −1/2 means reference angle π/6.", "2π − π/6 = 11π/6. Going clockwise, −π/6 is the same point. Either works."] },
      { id:"tc2", goal:[3, 6], prompt:"Tangent line mode, Two laps view. Find <strong>every</strong> slider angle from −2π to 2π where `tan x = -1`. Press <strong>Pin this angle</strong> at each one (tap a pin to remove it), then press <strong>Check challenge</strong>.",
        why:"`tan x = -1` at 3π/4 and 7π/4, and tan repeats every π: −5π/4, −π/4, 3π/4 and 7π/4.",
        named:{
          one:"At {a}, `tan x = 1`: the arm’s line slopes up. `tan x = -1` needs the arm in quadrant 2 or 4.",
          undef:"At {a} the arm is vertical, so `tan x` is undefined.",
          other:"At {a}, `tan x = ` {v}, not −1.",
          half:"Both right, but the slider goes back to −2π too. `tan x` repeats every π: keep subtracting π from 3π/4 until you pass −2π.",
          some:"You have {n} of them. From any answer, add or subtract π to find the next one on the line.",
          none:"Pin at least one angle first: set the slider, then press <strong>Pin this angle</strong>."
        },
        hints:["`tan x` is the slope of the arm’s line. Where does the line have slope −1?", "`tan x = -1` at 3π/4 (quadrant 2) and at 7π/4 (quadrant 4). `tan x` repeats every π.", "Step back π at a time from 3π/4: 3π/4 − π = −π/4, then −π/4 − π = −5π/4 (one more step, −9π/4, is past −2π). The four angles are −5π/4, −π/4, 3π/4 and 7π/4."] },
      { id:"tc3", goal:[1, 3], stretch:true,
        prompt:"Commit first. Find an angle `x`, with `-2π ≤ x ≤ 2π`, where, as `x` increases, `P`’s height is <strong>decreasing</strong> and its run is <strong>increasing</strong>, and `tan x = √3`. Enter it before `P` moves.<p class=\"tiny muted\" style=\"margin:6px 0 0\">“As `x` increases” means `P` moves counterclockwise, which is how the graphs are read, left to right.</p><div class=\"tc3-box\"></div>",
        why:"Quadrant 3 has `P` moving down and to the right, and reference angle π/3 gives `tan x = √3`: 4π/3, or −2π/3 going clockwise.",
        named:{
          q1:"`tan x = √3` here, but `P` is in quadrant 1: as `x` increases it moves up and to the left, so its height is increasing and its run is decreasing.",
          sixth:"Right quadrant, but here `tan x = √3/3`. `√3` needs reference angle π/3.",
          quarter:"Right quadrant, but here `tan x = 1`.",
          neg:"`tan x = -√3` here: the arm’s line slopes down. In the quadrant you need, `tan x` is positive.",
          range:"Keep `x` between −2π and 2π.",
          other:"Work it out before you check: which quadrant has `P` moving down and to the right? Which reference angle has tangent `√3`?",
          empty:"Enter your angle first: choose the number on top and the number underneath."
        },
        hints:["As `x` increases, `P` moves counterclockwise. Which quadrant has `P` moving down and to the right?", "Quadrant 3: the height falls and the run rises. `tan x = √3` needs reference angle π/3.", "π + π/3 = 4π/3. Going clockwise, 4π/3 − 2π = −2π/3 is the same point."] }
    ],
    blocks:[{ title:"What the graphs show", html:"<p class=\"tiny muted\">`n` is any integer, written `n ∈ ℤ`.</p><div class=\"tbl-wrap\"><table class=\"vt wg-tbl\"><thead><tr><th scope=\"col\"></th><th scope=\"col\">`y = sin x`</th><th scope=\"col\">`y = cos x`</th><th scope=\"col\">`y = tan x`</th></tr></thead><tbody>" +
      "<tr><th scope=\"row\">Period</th><td>2π</td><td>2π</td><td>π</td></tr>" +
      "<tr><th scope=\"row\">Amplitude</th><td>1</td><td>1</td><td>none (no maximum or minimum)</td></tr>" +
      "<tr><th scope=\"row\">Domain</th><td>`{x ∈ ℝ}`</td><td>`{x ∈ ℝ}`</td><td>`{x ∈ ℝ | x ≠ {π}/{2} + nπ, n ∈ ℤ}`</td></tr>" +
      "<tr><th scope=\"row\">Range</th><td>`{y ∈ ℝ | -1 ≤ y ≤ 1}`</td><td>`{y ∈ ℝ | -1 ≤ y ≤ 1}`</td><td>`{y ∈ ℝ}`</td></tr>" +
      "<tr><th scope=\"row\">Zeros</th><td>`x = nπ`</td><td>`x = {π}/{2} + nπ`</td><td>`x = nπ`</td></tr>" +
      "<tr><th scope=\"row\">Vertical asymptotes</th><td>none</td><td>none</td><td>`x = {π}/{2} + nπ`</td></tr>" +
      "<tr><th scope=\"row\">One lap, `0 ≤ x ≤ 2π`</th><td>max `({π}/{2}, 1)`, min `({3π}/{2}, -1)`</td><td>max (0, 1) and (2π, 1), min (π, −1)</td><td>rises on every piece</td></tr>" +
      "</tbody></table></div>" }]
  },
  part3:{
    slug:"reciprocals", name:"Reciprocals",
    heading:"Build the reciprocal graphs",
    intro:"Each reciprocal function is built from its partner: `csc x = 1/sin x`, `sec x = 1/cos x`, `cot x = 1/tan x`. Build each graph in layers. The curve draws only when every layer is right.",
    builder:{
      layerNames:["Asymptotes", "Zeros", "Points that stay put", "The shape of each piece", "Draw and probe"],
      l1:"Tap every `x`-value where the partner is 0. The reciprocal has a vertical asymptote there.",
      l1b:"Now tap where `tan x` has its own asymptotes. What happens to `cot x` there?",
      l1bRight:"Where `tan x` is undefined, `cos x = 0` and `sin x = ±1`, so `cot x = cos x/sin x = 0`. Where the partner is huge, the reciprocal is tiny.",
      l1bWrong:"Those are `tan x`’s zeros; they’re already the asymptotes of `cot x`.",
      l2:"Tap every point of the dashed graph at height 1 or −1. These points are on both graphs.",
      l3:"Between the asymptotes, how does each piece of the reciprocal look? Use the signs and ‘big ↔ small’.",
      l4:"Press <strong>Play</strong> to draw the pieces left to right, or <strong>Step</strong> to draw one piece at a time.",
      chips:[{ id:"up", t:"∪ opens up" }, { id:"down", t:"∩ opens down" }, { id:"rise", t:"↗ rises" }, { id:"fall", t:"↘ falls" }],
      stay1:"1/1 = 1: stays put", stayM1:"1/(−1) = −1: stays put", zeroLab:"cot x = 0",
      fb:{
        cscHalf:"At {v}, `sin x = ` {s}, not 0, and 1 ÷ {s} is a perfectly good value. Asymptotes come only from the zeros of the partner.",
        secPi:"At {v}, `cos x = ` {s}, not 0. Those are the zeros of `sin x`. `sec x` is `1/cos x`, so look for the zeros of `cos x`.",
        cotHalf:"At {v}, `tan x` is undefined, not 0. Asymptotes of `cot x` come from the <strong>zeros</strong> of `tan x`. (You’ll deal with π/2 and 3π/2 in the next step.)",
        odd:"At {v}, the partner is {s}, not 0.",
        edge:"The edges of the window count too: `sin 0 = 0` and `sin 2π = 0` (and `tan 0 = tan 2π = 0`).",
        other1:"Check each tap: does the dashed graph cross the `x`-axis there? You may have missed one.",
        other1b:"Look at where the dashed graph of `tan x` breaks and jumps: that’s where `tan x` is undefined.",
        moves:"At `x = ` {v}, {p} ≈ {pd}. Its reciprocal is {r} ≈ {rd}, so this point moves.",
        zero:"At {v} the partner is 0; that’s an asymptote, not a point that stays put.",
        missing2:"Some points at height 1 or −1 are still untapped.",
        none:"Tap at least one first.",
        partner:"Big ↔ small: where the partner is largest in size, its reciprocal is smallest in size, and where the partner rises, its reciprocal falls. The reciprocal’s piece is the partner’s shape turned the other way.",
        whole:"The partner turns around inside this piece (at a peak or a trough), so its reciprocal turns around too: the piece is ∪ or ∩.",
        half:"This piece runs from an edge of the window to an asymptote, so it only goes one way. Is `cos x` rising or falling here?",
        cot:"`tan x` rises all the way across each of its pieces, so `cot x` never turns around: it only goes one way."
      },
      band:"Band `-1 < y < 1`", bandLab:"small heights",
      bandMsg:"Wherever the dashed graph is inside the band (but not 0), its reciprocal is outside it, and the other way round. Where the dashed graph is 0, the reciprocal has no value at all: that’s an asymptote.",
      builds:[
        { id:"csc", fn:"csc", partner:"sin", chip:"`csc x` from `sin x`", asym:[0, 4, 8], stay:[[2, 1], [6, -1]],
          pieces:[{ lab:"`0 < x < π`", answer:"up", whole:true, why:"`sin x` is positive here, rising to 1 at π/2 and falling back. Its reciprocal is positive, falls to 1 at π/2 and rises again: a ∪ with lowest point (π/2, 1)." },
                  { lab:"`π < x < 2π`", answer:"down", whole:true, why:"`sin x` is negative here, with its minimum −1 at 3π/2. Its reciprocal is negative, with its <strong>highest</strong> point (3π/2, −1): a ∩." }],
          summary:"`csc x`: period 2π; domain `{x ∈ ℝ | x ≠ nπ, n ∈ ℤ}`; range `{y ∈ ℝ | y ≤ -1 or y ≥ 1}`; no zeros; local minimum (π/2, 1), local maximum (3π/2, −1) in each lap.",
          describe:"Graph of y = csc x with the dashed graph of y = sin x. Vertical asymptotes at 0, π and 2π. Local minimum (π/2, 1), local maximum (3π/2, −1)." },
        { id:"sec", fn:"sec", partner:"cos", chip:"`sec x` from `cos x`", asym:[2, 6], stay:[[0, 1], [4, -1], [8, 1]],
          pieces:[{ lab:"`0 ≤ x < π/2`", answer:"rise", half:true, why:"`cos x` falls from 1 toward 0, so `sec x` rises from 1 toward +∞." },
                  { lab:"`π/2 < x < 3π/2`", answer:"down", whole:true, why:"`cos x` is negative here, lowest (−1) at π. `sec x` is negative, highest (−1) at π." },
                  { lab:"`3π/2 < x ≤ 2π`", answer:"fall", half:true, why:"`cos x` rises from 0 to 1, so `sec x` falls from +∞ to 1." }],
          summary:"`sec x`: period 2π; domain `{x ∈ ℝ | x ≠ π/2 + nπ, n ∈ ℤ}`; range `{y ∈ ℝ | y ≤ -1 or y ≥ 1}`; no zeros; local minimum (0, 1), local maximum (π, −1) in each lap.",
          describe:"Graph of y = sec x with the dashed graph of y = cos x. Vertical asymptotes at π/2 and 3π/2. Local minimum (0, 1), local maximum (π, −1)." },
        { id:"cot", fn:"cot", partner:"tan", chip:"`cot x` from `tan x`", asym:[0, 4, 8], zeros:[2, 6], stay:[[1, 1], [3, -1], [5, 1], [7, -1]],
          pieces:[{ lab:"`0 < x < π`", answer:"fall", cot:true, why:"`tan x` rises on every piece, so its reciprocal falls: from +∞ near 0, through 0 at π/2, to −∞ near π." },
                  { lab:"`π < x < 2π`", answer:"fall", cot:true, why:"The same shape again: `cot x` has period π." }],
          summary:"`cot x`: period π; domain `{x ∈ ℝ | x ≠ nπ, n ∈ ℤ}`; range `{y ∈ ℝ}`; zeros `x = π/2 + nπ`; falls on every piece.",
          describe:"Graph of y = cot x with the dashed graph of y = tan x. Vertical asymptotes at 0, π and 2π. Zeros at π/2 and 3π/2. It falls on every piece." }
      ],
      alg:{
        tables:{
          csc:{ head:["`x`", "`{π}/{6}`", "`{π}/{4}`", "`{π}/{3}`", "`{π}/{2}`", "`{2π}/{3}`", "`{3π}/{4}`", "`{5π}/{6}`", "π"],
            rows:[["`sin x`", "`{1}/{2}`", "`{√2}/{2}`", "`{√3}/{2}`", "1", "`{√3}/{2}`", "`{√2}/{2}`", "`{1}/{2}`", "0"],
                  ["`csc x = 1/sin x`", "2", "`√2`", "`{2√3}/{3}`", "1", "`{2√3}/{3}`", "`√2`", "2", "undefined"]] },
          sec:{ head:["`x`", "0", "`{π}/{6}`", "`{π}/{4}`", "`{π}/{3}`", "`{π}/{2}`", "`{2π}/{3}`", "`{3π}/{4}`", "`{5π}/{6}`", "π"],
            rows:[["`cos x`", "1", "`{√3}/{2}`", "`{√2}/{2}`", "`{1}/{2}`", "0", "`-{1}/{2}`", "`-{√2}/{2}`", "`-{√3}/{2}`", "−1"],
                  ["`sec x = 1/cos x`", "1", "`{2√3}/{3}`", "`√2`", "2", "undefined", "−2", "`-√2`", "`-{2√3}/{3}`", "−1"]] },
          cot:{ head:["`x`", "`{π}/{6}`", "`{π}/{4}`", "`{π}/{3}`", "`{π}/{2}`", "`{2π}/{3}`", "`{3π}/{4}`", "`{5π}/{6}`"],
            rows:[["`tan x`", "`{√3}/{3}`", "1", "`√3`", "undefined", "`-√3`", "−1", "`-{√3}/{3}`"],
                  ["`cot x = cos x/sin x`", "`√3`", "1", "`{√3}/{3}`", "0", "`-{√3}/{3}`", "−1", "`-√3`"]] }
        },
        closeTitle:"Close-up near the asymptote `x = π` (values computed by the tool)",
        closeSec:"Close-up near the asymptote `x = π/2` (values computed by the tool)",
        words:"`csc x = 1/sin x` is undefined exactly where `sin x = 0`, so its domain leaves out `x = nπ`. Because `-1 ≤ sin x ≤ 1`, its reciprocal is never between −1 and 1, so the range is `y ≤ -1` or `y ≥ 1`. 1 divided by a number is never 0, so `csc x` has no zeros. `cot x` is defined as `cos x/sin x`, which equals `1/tan x` wherever both are defined; at `x = π/2 + nπ`, `tan x` is undefined but `cot x = 0`.",
        notation:"The reciprocal of `f(x) = sin x` can be written `csc x`, `1/sin x` or `1/f(x)`. It is <strong>not</strong> `sin^{-1} x` or `f^{-1}(x)`: those mean the inverse function."
      }
    },
    blocks:[{ title:"What the builder shows", html:"<p><strong>Building `y = 1/f(x)` from `y = f(x)`</strong></p><ol><li>Zeros of `f` become vertical asymptotes. (Where `f` has a vertical asymptote of its own, as `tan x` does at π/2, `1/f(x)` shrinks toward 0; `cot x = cos x/sin x` is exactly 0 there.)</li><li>Points at height 1 or −1 stay put.</li><li>Same sign, but big ↔ small: a maximum of `f` becomes a local minimum, a minimum becomes a local maximum, and where `f` rises, `1/f` falls.</li><li>Same period as `f`.</li></ol>" }],
    quickCheck:{
      title:"Reciprocal quick check", summary:"Reciprocal quick check",
      items:[
        { id:"q1", goal:5, prompt:"The graph of `y = sin x` passes through (`a`, 0.2). Which point is on the graph of `y = csc x`?",
          choices:[{ t:"(`a`, 5)", ok:true, fb:"Right. Same `x`, reciprocal height: 1 ÷ 0.2 = 5." },
                   { t:"(0.2, `a`)", fb:"Swapping the coordinates is what an inverse does (`sin^{-1}`). The reciprocal keeps `x` and flips the height." },
                   { t:"(`a`, −5)", fb:"Reciprocals keep the sign: 1 ÷ 0.2 = +5." },
                   { t:"(`a`, 0.8)", fb:"0.8 is 1 − 0.2. The reciprocal is 1 ÷ 0.2." }] },
        { id:"q2", goal:4, prompt:"On `0 < x < π`, where is `y = csc x` increasing?",
          choices:[{ t:"`π/2 < x < π`", ok:true, fb:"Right. `csc x` rises where `sin x` falls, and `sin x` falls from 1 to 0 on (π/2, π)." },
                   { t:"`0 < x < π/2`", fb:"There `sin x` rises from 0 to 1, so `csc x` falls toward 1." },
                   { t:"All of `0 < x < π`", fb:"`csc x` has a local minimum at π/2: it falls first, then rises." },
                   { t:"Nowhere", fb:"It rises on the right half of the piece, (π/2, π)." }] },
        { id:"q3", goal:4, prompt:"Which function has zeros exactly where `y = tan x` has its vertical asymptotes?",
          choices:[{ t:"`cot x`", ok:true, fb:"Right. Where `tan x` is undefined, `cos x = 0` and `sin x = ±1`, so `cot x = cos x/sin x = 0`." },
                   { t:"`sec x`", fb:"`sec x` has asymptotes there too (`cos x = 0`), not zeros." },
                   { t:"`csc x`", fb:"`csc x` has its asymptotes at `x = nπ`, and no zeros at all." },
                   { t:"`sin x`", fb:"`sin x` is 0 at `x = nπ`, which are `tan x`’s zeros, not its asymptotes." }] },
        { id:"q4", goal:5, prompt:"What is the range of `y = sec x`?",
          choices:[{ t:"`(-∞, -1] ∪ [1, ∞)`", ok:true, fb:"Right. `cos x` is between −1 and 1, so its reciprocal is always 1 or more in size. The ends are reached: `sec 0 = 1` and `sec π = -1`." },
                   { t:"`[-1, 1]`", fb:"That’s the range of `cos x`. Reciprocals of numbers between −1 and 1 are 1 or more in size." },
                   { t:"`(-∞, ∞)`", fb:"`sec x` is never strictly between −1 and 1: `sec x = 1/2` would need `cos x = 2`." },
                   { t:"`(-∞, -1) ∪ (1, ∞)`", fb:"`sec 0 = 1` and `sec π = -1`, so ±1 are reached: use square brackets." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"grid", type:"custom", title:"Property grid", summary:"Property grid", goal:[5, 2, 3, 4],
        instruction:"Fill in each row, then press Check row. `n` stands for any integer (`n ∈ ℤ`).",
        how:"Tap one chip in each cell. Check row marks any cell that’s wrong.",
        cols:[
          { id:"period", label:"Period", chips:[{ id:"h", t:"π/2" }, { id:"p", t:"π" }, { id:"p2", t:"2π" }] },
          { id:"range", label:"Range", chips:[{ id:"b", t:"`[-1, 1]`" }, { id:"all", t:"`(-∞, ∞)`" }, { id:"out", t:"`(-∞, -1] ∪ [1, ∞)`" }, { id:"outo", t:"`(-∞, -1) ∪ (1, ∞)`" }] },
          { id:"zeros", label:"Zeros", chips:[{ id:"n", t:"`x = nπ`" }, { id:"h", t:"`x = π/2 + nπ`" }, { id:"none", t:"none" }] },
          { id:"asym", label:"Vertical asymptotes", chips:[{ id:"n", t:"`x = nπ`" }, { id:"h", t:"`x = π/2 + nπ`" }, { id:"none", t:"none" }] }
        ],
        fixLine:"Fix the red cells and check again.",
        rows:[
          gridRow("sin", { period:"p2", range:"b", zeros:"n", asym:"none" }, ["Think of `sin x` as `P`’s height. Where is the height 0, and is it ever undefined?", "`sin x = 0` at `x = nπ` (the far right and far left of the circle). `P` always has a height, so there are no asymptotes.", "Asymptotes none; zeros `x = nπ`; period 2π (`P` is back at the same point after a lap); range `[-1, 1]` (`P` never leaves the circle)."]),
          gridRow("cos", { period:"p2", range:"b", zeros:"h", asym:"none" }, ["Think of `cos x` as `P`’s run. Where is the run 0, and is it ever undefined?", "`cos x = 0` at `x = π/2 + nπ` (the top and bottom of the circle). `P` always has a run, so there are no asymptotes.", "Asymptotes none; zeros `x = π/2 + nπ`; period 2π (`P` is back at the same point after a lap); range `[-1, 1]` (`P` never leaves the circle)."]),
          gridRow("tan", { period:"p", range:"all", zeros:"n", asym:"h" }, ["Write `tan x` in terms of `sin x` and `cos x`. Where is its denominator 0, and where is its numerator 0?", "`tan x = sin x/cos x`. The denominator is 0 at `x = π/2 + nπ`; the numerator is 0 at `x = nπ`.", "Asymptotes `x = π/2 + nπ`; zeros `x = nπ`; period π (the arm’s line repeats every half lap); range `(-∞, ∞)` (near each asymptote it takes every value)."]),
          gridRow("csc", { period:"p2", range:"out", zeros:"none", asym:"n" }, ["Write `csc x` in terms of `sin x`. Where is its denominator 0, and can it ever be 0 itself?", "`csc x = 1/sin x`. The denominator is 0 at `x = nπ`. The numerator is 1, which is never 0.", "Asymptotes `x = nπ`; no zeros; period 2π (the same as `sin x`); range `(-∞, -1] ∪ [1, ∞)` (reciprocals of numbers in `[-1, 1]`, leaving out 0)."]),
          gridRow("sec", { period:"p2", range:"out", zeros:"none", asym:"h" }, ["Write `sec x` in terms of `cos x`. Where is its denominator 0, and can it ever be 0 itself?", "`sec x = 1/cos x`. The denominator is 0 at `x = π/2 + nπ`. The numerator is 1, which is never 0.", "Asymptotes `x = π/2 + nπ`; no zeros; period 2π (the same as `cos x`); range `(-∞, -1] ∪ [1, ∞)` (reciprocals of numbers in `[-1, 1]`, leaving out 0)."]),
          gridRow("cot", { period:"p", range:"all", zeros:"h", asym:"n" }, ["Write `cot x` in terms of `sin x` and `cos x`. Where is its denominator 0, and where is its numerator 0?", "`cot x = cos x/sin x`. The denominator is 0 at `x = nπ`; the numerator is 0 at `x = π/2 + nπ`.", "Asymptotes `x = nπ`; zeros `x = π/2 + nπ`; period π (the same as `tan x`); range `(-∞, ∞)` (near each asymptote it takes every value)."])
        ] },
      { id:"track", type:"custom", title:"Track it down", summary:"Track it down", star:true, goal:[6, 3, 4],
        instruction:"Use the graphs to find each value. Type the number in front of π as a fraction (5/2 for 5π/2), or a whole number for a count, then press Check.",
        how:"After each check, a small graph of the function over the stated interval appears, with your answer marked, so you can see why it’s right or wrong.",
        outside:OUT,
        fallback:"Not quite. The preview shows the graph over the interval: find the feature you need and read its `x`-value.",
        both:"Enter both `x`-values.",
        items:[
          { id:"td1", goal:[6, 4], kind:"pi", prompt:"`y = csc x` has a local minimum at (`a`, 1) with `2π < a < 4π`. Find `a`.", lab:"`a =`", lo:2, hi:4, answer:[2.5], show:"5π/2",
            wrong:[{ v:[3.5], fb:"`csc(7π/2) = -1`: that’s a local <strong>maximum</strong>, on a piece below the axis." }, { v:[3], fb:"At 3π, `sin x = 0`: that’s an asymptote of `csc x`." }],
            hints:["In the first lap, where does `csc x` have its local minimum at height 1?", "At `x = π/2`, where `sin x = 1`. The graph repeats every 2π.", "π/2 + 2π = 5π/2, which is between 2π and 4π. `a = 5π/2`."] },
          { id:"td2", goal:[6, 3], kind:"pi", prompt:"Find the vertical asymptote of `y = tan x` that lies strictly between −2π and −π.", lab:"`x =`", lo:-2, hi:-1, answer:[-1.5], show:"−3π/2",
            wrong:[{ v:[-1], fb:"`tan(-π) = 0`: that’s a zero, and it’s an end of the interval." }, { v:[1.5], fb:"3π/2 is an asymptote, but it isn’t between −2π and −π: watch the sign." }],
            hints:["Where is `tan x` undefined?", "`tan x` has vertical asymptotes where `cos x = 0`: `x = π/2 + nπ`. Which of these lies between −2π and −π?", "The asymptotes are …, −5π/2, −3π/2, −π/2, π/2, …; only −3π/2 is strictly between −2π and −π."] },
          { id:"td3", goal:[6, 4], kind:"pi", prompt:"The graph of `y = cot x` passes through (`a`, −1) with `π < a < 2π`. Find `a`.", lab:"`a =`", lo:1, hi:2, answer:[1.75], show:"7π/4",
            wrong:[{ v:[1.25], fb:"`cot(5π/4) = 1`: in quadrant 3, `cos x` and `sin x` are both negative." }, { v:[1.5], fb:"`cot(3π/2) = 0/(-1) = 0`." }],
            hints:["In which quadrants is `cot x` negative?", "`cot x = cos x/sin x` is negative in quadrants 2 and 4. Between π and 2π, that means quadrant 4. `cot x = ±1` needs reference angle π/4.", "2π − π/4 = 7π/4: `cot(7π/4) = (√2/2)/(-√2/2) = -1`. `a = 7π/4`."] },
          { id:"td4", goal:[6, 4], kind:"pi2", prompt:"On `0 < x < 2π`, where do the graphs of `y = sec x` and `y = csc x` cross? Enter both `x`-values.", lab:"`x =`", lo:0, hi:2, answer:[0.25, 1.25], show:"π/4 and 5π/4",
            wrong:[{ v:[0.25], fb:"There’s a second crossing, where `sin x` and `cos x` are both negative." }, { v:[0.75, 1.75], fb:"There `sec x = -csc x`: the sizes match (`√2`), but the signs are opposite." }],
            hints:["`sec x = csc x` means `1/cos x = 1/sin x`. What does that say about `cos x` and `sin x`?", "`cos x = sin x`, so `tan x = 1`. Where is `tan x = 1` between 0 and 2π?", "`x = π/4` and `x = 5π/4`. Check: `sec(π/4) = csc(π/4) = √2`, and `sec(5π/4) = csc(5π/4) = -√2`."] },
          { id:"td5", goal:[6, 4], kind:"count", prompt:"On `0 ≤ x ≤ 2π`, at how many points do the graphs of `y = sin x` and `y = csc x` meet?", lab:"Number of points:", answer:[2],
            wrong:[{ v:[0], fb:"They do meet: a number equals its own reciprocal when it’s 1 or −1." }, { v:[4], fb:"Each meeting point is on both graphs, so count it once: (π/2, 1) and (3π/2, −1)." }, { v:[1], fb:"`sin x = -1` counts too: (3π/2, −1)." }],
            hints:["A point is on both graphs when `sin x = 1/sin x`. Which numbers equal their own reciprocals?", "Only 1 and −1. Where on `0 ≤ x ≤ 2π` is `sin x = 1` or `sin x = -1`?", "`sin x = 1` at π/2 and `sin x = -1` at 3π/2: the graphs meet at (π/2, 1) and (3π/2, −1). That’s 2 points."] },
          { id:"td6", goal:[6, 4], kind:"count", prompt:"How many vertical asymptotes does `y = sec x` have on `0 ≤ x ≤ 6π`?", lab:"Number of asymptotes:", answer:[6],
            wrong:[{ v:[3], fb:"`cos x` is 0 twice in every lap (top and bottom of the circle), not once." }, { v:[7], fb:"Those are `x = 0`, π, …, 6π, the asymptotes of `csc x`. `sec x` is undefined where `cos x = 0`." }],
            hints:["Where is `sec x` undefined?", "`sec x = 1/cos x` is undefined where `cos x = 0`: twice in every lap, at the top and bottom of the circle.", "`0 ≤ x ≤ 6π` is three laps, so 3 × 2 = 6 asymptotes: π/2, 3π/2, 5π/2, 7π/2, 9π/2 and 11π/2."] },
          { id:"td7", goal:[6, 4], kind:"count", prompt:"How many solutions does `csc x = 4` have on `0 ≤ x ≤ 6π`?", lab:"Number of solutions:", answer:[6],
            wrong:[{ v:[0], fb:"4 is outside the range of `sin x`, but not of `csc x`: `csc x = 4` means `sin x = 1/4`." }, { v:[3], fb:"`sin x = 1/4` happens twice per lap, once in quadrant 1 and once in quadrant 2." }, { v:[12], fb:"That counts `csc x = -4` as well." }],
            hints:["Rewrite `csc x = 4` using `sin x`.", "`csc x = 4` means `sin x = 1/4`. How many times per lap does `sin x` equal 1/4?", "Twice per lap (once in quadrant 1, once in quadrant 2). `0 ≤ x ≤ 6π` is three laps: 3 × 2 = 6 solutions."] },
          { id:"td8", goal:[6, 3], kind:"count", star:true, prompt:"How many solutions does `tan x = 5` have on `-2π ≤ x ≤ 2π`?", lab:"Number of solutions:", answer:[4],
            wrong:[{ v:[2], fb:"`tan x` repeats every π, not every 2π: each piece of the graph reaches 5 once." }, { v:[5], fb:"Five pieces of the graph touch this interval, but the piece at the right edge, `3π/2 < x ≤ 2π`, only climbs from −∞ to 0, so it never reaches 5." }],
            hints:["How many times does one whole piece of `y = tan x` reach the value 5?", "Each whole piece rises from −∞ to +∞, so it crosses `y = 5` exactly once. Count the whole pieces inside `-2π ≤ x ≤ 2π`, then look closely at the two pieces cut off by the edges.", "Whole pieces: (−3π/2, −π/2), (−π/2, π/2) and (π/2, 3π/2): 3 solutions. Left edge, `-2π ≤ x < -3π/2`: `tan x` starts at `tan(-2π) = 0`, below 5, and climbs to +∞, so it passes 5 once: 1 more. Right edge, `3π/2 < x ≤ 2π`: `tan x` climbs from −∞ only up to 0, so it never reaches 5. Total: 4."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Arjun", how:"",
        instruction:"Arjun made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Find the vertical asymptotes and the period of `y = tan x`.",
            steps:["`tan x = sin x/cos x`.", "A fraction is undefined where its numerator is 0, so `tan x` is undefined where `sin x = 0`.", "`sin x = 0` at `x = 0`, π, 2π, …, so the asymptotes are `x = nπ`.", "The asymptotes are π apart, so the period is π."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 solves `sin x = 0` correctly. The mistake is in why step 2 chose `sin x`.", "The period π happens to be right, but it rests on step 3’s asymptotes. The mistake is earlier."],
            fixes:[
              { t:"A fraction is undefined where its <strong>denominator</strong> is 0, so `tan x` is undefined where `cos x = 0`: the asymptotes are `x = π/2 + nπ`.", ok:true, why:"At π/2, `tan x = 1/0`: undefined. At π, `tan x = 0/(-1) = 0`: a zero, not an asymptote." },
              { t:"A fraction is undefined where its numerator or its denominator is 0, so the asymptotes are `x = nπ/2`.", why:"A 0 on top is fine: `0/(-1) = 0`. Only a 0 on the bottom makes a fraction undefined." },
              { t:"`tan x` is undefined where `sin x = cos x`, at `x = π/4 + nπ`.", why:"There `tan x = 1`. Undefined means dividing by 0." },
              { t:"Step 2 is correct as written.", why:"Try `x = π`: `sin π = 0` and `cos π = -1`, so `tan π = 0/(-1) = 0`, which is defined. The graph crosses the `x`-axis there." }],
            hints:["When is a fraction undefined?", "Only when its denominator is 0. Which part of `sin x/cos x` is the denominator?", "Step 2 is wrong: `tan x` is undefined where `cos x = 0`, so the asymptotes are `x = π/2 + nπ`. The zeros are at `x = nπ`."] },
          { id:"e2", goal:4, task:"Describe the graph of `y = csc x` on `0 < x < π`.",
            steps:["`csc x = 1/sin x`.", "On `0 < x < π`, `sin x` is positive, so `csc x` is positive too.", "`sin x` has a maximum of 1 at `x = π/2`, so `csc x` also has a maximum there, at (π/2, 1).", "So on `0 < x < π`, `csc x` is never more than 1."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: reciprocals keep the sign. Keep checking.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"`sin x` is largest at π/2, so its reciprocal is smallest there: `csc x` has a local <strong>minimum</strong> at (π/2, 1), and `csc x ≥ 1` on `0 < x < π`.", ok:true, why:"Check π/6: `sin(π/6) = 1/2`, so `csc(π/6) = 2`, which is more than 1." },
              { t:"`csc x` has a maximum at (π/2, −1).", why:"Reciprocals keep the sign. On `0 < x < π` the piece is above the axis." },
              { t:"`csc x` has no turning point on `0 < x < π`, because it has asymptotes at both ends.", why:"Asymptotes at both ends don’t rule out a turning point between them: the piece comes down from +∞, turns at (π/2, 1), and goes back up." },
              { t:"Step 3 is correct as written.", why:"Check `x = π/6`: `csc(π/6) = 2`, which is more than 1, so (π/2, 1) can’t be the highest point." }],
            hints:["Test one more point: what is `csc(π/6)`?", "`csc(π/6) = 1 ÷ 1/2 = 2`, which is bigger than `csc(π/2) = 1`.", "Step 3 is wrong. Where `sin x` is largest, `csc x` is smallest: a local minimum at (π/2, 1)."] },
          { id:"e3", goal:2, task:"State the amplitude and the range of `y = cos x`.",
            steps:["The maximum value of `cos x` is 1 (for example, at `x = 0`).", "The minimum value of `cos x` is −1 (for example, at `x = π`).", "The amplitude is the maximum minus the minimum: 1 − (−1) = 2.", "So the graph reaches 2 above and 2 below its axis, and the range is `{y ∈ ℝ | -2 ≤ y ≤ 2}`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct. Keep checking.", "", "Step 4 uses step 3’s amplitude. The mistake is earlier."],
            fixes:[
              { t:"The amplitude is <strong>half</strong> of that: `(1 - (-1))/2 = 1`, and the range is `{y ∈ ℝ | -1 ≤ y ≤ 1}`.", ok:true, why:"Amplitude is the distance from the axis, `y = 0`, up to a peak." },
              { t:"The amplitude is the maximum plus the minimum: 1 + (−1) = 0.", why:"Adding the maximum and minimum (then halving) finds the axis, `y = 0`, not the amplitude. The graph clearly rises above its axis." },
              { t:"The amplitude is 2, but the range is `{y ∈ ℝ | -1 ≤ y ≤ 1}`.", why:"The range is right now, but 2 is still the full drop from peak to trough. The graph rises only 1 above its axis." },
              { t:"Step 3 is correct as written.", why:"If the amplitude were 2, the graph would reach `y = 2`. But `cos x` is never more than 1." }],
            hints:["How far above its middle line does the graph of `y = cos x` rise?", "Its middle line is `y = 0`, halfway between 1 and −1, and its highest point is `y = 1`.", "Step 3 is wrong: amplitude = (max − min)/2 = 1. The range is `{y ∈ ℝ | -1 ≤ y ≤ 1}`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you when you watched `P` unwrap the circle into graphs, or when `tan x` jumped at π/2?" },
      { id:"j2", q:"In your own words, why does `y = tan x` have a vertical asymptote at `x = π/2`, and why does it repeat every π instead of every 2π?" },
      { id:"j3", q:"Explain to a friend, step by step, how to sketch `y = sec x` from the graph of `y = cos x`." },
      { id:"j4", q:"Which of the six graphs do you still find hardest to sketch or describe? What will you do to fix that?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"On `0 ≤ x ≤ 2π`, where does the graph of `y = sin x` reach its minimum?", options:[
          { t:"`x = π/2`", why:"That’s the top of the circle: `sin(π/2) = 1`, the maximum." },
          { t:"`x = π`", why:"At `x = π`, `P = (-1, 0)`: its height is 0. π is where `cos x` has its minimum." },
          { t:"`x = 3π/2`", ok:true, why:"`sin x` is `P`’s height, and `P` is lowest at the bottom of the circle, three quarters of a lap round: `sin(3π/2) = -1`." },
          { t:"`x = 2π`", why:"At 2π, `P` is back at (1, 0), so `sin 2π = 0`. The lowest point comes earlier." }] },
        b:{ prompt:"On `0 ≤ x ≤ 2π`, where does the graph of `y = cos x` reach its minimum?", options:[
          { t:"`x = 0`", why:"`cos 0 = 1`: that’s the maximum." },
          { t:"`x = π/2`", why:"`cos(π/2) = 0`: that’s a zero of `cos x`, not its minimum." },
          { t:"`x = π`", ok:true, why:"`cos x` is `P`’s run, most negative on the far left of the circle: `cos π = -1`." },
          { t:"`x = 3π/2`", why:"That’s where `sin x` has its minimum. At 3π/2, `P = (0, -1)`, so `cos(3π/2) = 0`." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"The graph of `y = tan x` passes through `(π/6, √3/3)`. Which of these points is also on the graph?", options:[
          { t:"`(-π/6, √3/3)`", why:"That treats `tan x` like `cos x`, whose graph is symmetric about the `y`-axis. But `tan(-π/6) = -√3/3`." },
          { t:"`(2π/3, √3/3)`", why:"That uses a period of π/2. `tan(2π/3) = -√3`." },
          { t:"`(5π/6, √3/3)`", why:"That mirrors the graph in `x = π/2`, the way the sine graph is symmetric. But `tan(5π/6) = -√3/3`: tan is negative in quadrant 2." },
          { t:"`(7π/6, √3/3)`", ok:true, why:"`tan x` has period π. Half a lap later the arm lies on the same line, so `tan(7π/6) = tan(π/6) = √3/3`." }] },
        b:{ prompt:"The graph of `y = tan x` passes through `(π/3, √3)`. Which of these points is also on the graph?", options:[
          { t:"`(-π/3, √3)`", why:"`tan(-π/3) = -√3`. The tangent graph isn’t symmetric about the `y`-axis." },
          { t:"`(2π/3, √3)`", why:"That mirrors the graph in `x = π/2`. But `tan(2π/3) = -√3`." },
          { t:"`(5π/6, √3)`", why:"That uses a period of π/2. `tan(5π/6) = -√3/3`." },
          { t:"`(4π/3, √3)`", ok:true, why:"`tan x` has period π: `tan(4π/3) = tan(π/3) = √3`." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"What is the domain of `y = csc x`?", options:[
          { t:"`{x ∈ ℝ | x ≠ nπ, n ∈ ℤ}`", ok:true, why:"`csc x = 1/sin x` is undefined exactly where `sin x = 0`, at every multiple of π." },
          { t:"`{x ∈ ℝ | x ≠ π/2 + nπ, n ∈ ℤ}`", why:"Those are the zeros of `cos x`, so this is the domain of `sec x`. csc pairs with sin." },
          { t:"`{x ∈ ℝ}`", why:"`sin x = 0` at 0, π, 2π, …, and `1/0` has no value, so those `x`-values must be left out." },
          { t:"`{x ∈ ℝ | x ≤ -1 or x ≥ 1}`", why:"That’s the set of values `csc x` takes, its range, written with `x`. The domain lists the allowed inputs." }] },
        b:{ prompt:"What is the domain of `y = sec x`?", options:[
          { t:"`{x ∈ ℝ | x ≠ π/2 + nπ, n ∈ ℤ}`", ok:true, why:"`sec x = 1/cos x` is undefined exactly where `cos x = 0`, at `π/2 + nπ`." },
          { t:"`{x ∈ ℝ | x ≠ nπ, n ∈ ℤ}`", why:"Those are the zeros of `sin x`, so this is the domain of `csc x`. sec pairs with cos." },
          { t:"`{x ∈ ℝ}`", why:"`cos x = 0` at π/2, 3π/2, …, and `1/0` has no value, so those `x`-values must be left out." },
          { t:"`{x ∈ ℝ | x ≤ -1 or x ≥ 1}`", why:"That’s the range of `sec x`, written with `x`. The domain lists the allowed inputs." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Between `x = π` and `x = 2π`, the graph of `y = csc x` has exactly one turning point. What is it?", options:[
          { t:"(3π/2, −1), a local maximum", ok:true, why:"On (π, 2π), `sin x` is negative and reaches its lowest value, −1, at 3π/2. Elsewhere on the piece `sin x` is between −1 and 0, so `csc x` is below −1 (`sin x = -1/2` gives −2). So −1 is the <strong>highest</strong> value: a local maximum." },
          { t:"(3π/2, −1), a local minimum", why:"`sin x` has a minimum there, but reciprocals swap them: `csc x = -2` when `sin x = -1/2`, which is lower than −1." },
          { t:"(3π/2, 1), a local minimum", why:"`csc x` has the same sign as `sin x`, which is negative on (π, 2π). The whole piece is below the `x`-axis." },
          { t:"(π/2, 1), a local minimum", why:"That’s the turning point of the other piece, `0 < x < π`." }] },
        b:{ prompt:"Between `x = π/2` and `x = 3π/2`, the graph of `y = sec x` has exactly one turning point. What is it?", options:[
          { t:"(π, −1), a local maximum", ok:true, why:"On (π/2, 3π/2), `cos x` is negative, lowest (−1) at π. Elsewhere on the piece `cos x` is between −1 and 0, so `sec x` is below −1. So −1 is the highest value: a local maximum." },
          { t:"(π, −1), a local minimum", why:"`cos x` has a minimum there, but reciprocals swap them: `sec x = -2` when `cos x = -1/2`." },
          { t:"(π, 1), a local minimum", why:"`sec x` has the same sign as `cos x`, which is negative on (π/2, 3π/2)." },
          { t:"(0, 1), a local minimum", why:"That’s the turning point of the piece `-π/2 < x < π/2`." }] } },
      { id:"t2", cat:"T", goal:6,
        a:{ prompt:"On which interval are `y = tan x` and `y = sec x` both negative?", options:[
          { t:"`0 < x < π/2`", why:"Both are positive here: every ratio is positive in quadrant 1." },
          { t:"`π/2 < x < π`", ok:true, why:"`tan x` is negative in quadrants 2 and 4. `sec x` has the sign of `cos x`, negative in quadrants 2 and 3. Only quadrant 2 is in both." },
          { t:"`π < x < 3π/2`", why:"`sec x` is negative here, but `tan x = sin x/cos x` is positive: both `sin x` and `cos x` are negative." },
          { t:"`3π/2 < x < 2π`", why:"`tan x` is negative here, but `sec x = 1/cos x` is positive, since `cos x` is positive in quadrant 4." }] },
        b:{ prompt:"On which interval are `y = cot x` and `y = csc x` both negative?", options:[
          { t:"`0 < x < π/2`", why:"Both are positive here: every ratio is positive in quadrant 1." },
          { t:"`π/2 < x < π`", why:"`cot x` is negative here, but `csc x = 1/sin x` is positive, since `sin x` is positive in quadrant 2." },
          { t:"`π < x < 3π/2`", why:"`csc x` is negative here, but `cot x = cos x/sin x` is positive: both are negative." },
          { t:"`3π/2 < x < 2π`", ok:true, why:"`cot x` is negative in quadrants 2 and 4. `csc x` has the sign of `sin x`, negative in quadrants 3 and 4. Only quadrant 4 is in both." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"How many solutions does `sec x = 3` have on `0 ≤ x ≤ 4π`?", options:[
          { t:"0", why:"3 is outside the range of `cos x`, but not of `sec x`: `sec x` takes every value of 1 or more. `sec x = 3` where `cos x = 1/3`." },
          { t:"2", why:"That’s one lap. `0 ≤ x ≤ 4π` is two full laps." },
          { t:"4", ok:true, why:"`sec x = 3` means `cos x = 1/3`. In each lap the cosine graph crosses the line `y = 1/3` twice (in quadrants 1 and 4). Two laps give 4 solutions." },
          { t:"8", why:"That also counts `sec x = -3`. Only `cos x = 1/3` gives `sec x = 3`, twice per lap." }] },
        b:{ prompt:"How many solutions does `csc x = -2` have on `0 ≤ x ≤ 4π`?", options:[
          { t:"0", why:"−2 is outside the range of `sin x`, but not of `csc x`. `csc x = -2` where `sin x = -1/2`." },
          { t:"2", why:"That’s one lap. `0 ≤ x ≤ 4π` is two full laps." },
          { t:"4", ok:true, why:"`csc x = -2` means `sin x = -1/2`, which happens twice per lap (7π/6 and 11π/6 in the first). Two laps give 4." },
          { t:"8", why:"That also counts `csc x = 2`. Only `sin x = -1/2` gives `csc x = -2`." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why the graph of `y = sin x` repeats every 2π?", options:[
          { t:"“On the unit circle, `x` is the distance `P` has travelled. The circumference is 2π, so after travelling another 2π, `P` is back at the same point, with the same height.”", ok:true, why:"This explains why <strong>every</strong> value repeats, using what `sin x` means." },
          { t:"“Because `sin 2π = 0 = sin 0`.”", why:"One matching value doesn’t make a period: `sin π = 0` too, but `sin(π/2) = 1` while `sin(3π/2) = -1`, so π isn’t a period." },
          { t:"“Because 2π radians is 360°, and every trig function has period 360°.”", why:"Not every trig function: `tan x` has period π (180°). And changing 2π to 360° only renames the number; it doesn’t explain why the heights repeat. The reason is what happens to `P`." },
          { t:"“Because the graph reaches its maximum at π/2, and 2π is four times π/2.”", why:"That’s a pattern in the numbers, not a reason the heights must repeat." }] },
        b:{ prompt:"Which is the best explanation of why the graph of `y = cos x` repeats every 2π?", options:[
          { t:"“On the unit circle, `x` is the distance `P` has travelled. The circumference is 2π, so after travelling another 2π, `P` is back at the same point, with the same run.”", ok:true, why:"This explains why every value repeats, using what `cos x` means." },
          { t:"“Because `cos 2π = 1 = cos 0`.”", why:"One matching value doesn’t make a period: `cos(π/3) = cos(5π/3) = 1/2`, but `cos x` doesn’t repeat every 4π/3 (`cos 0 = 1`, `cos(4π/3) = -1/2`)." },
          { t:"“Because 2π radians is 360°, and every trig function has period 360°.”", why:"Not every trig function: `tan x` has period π (180°). And changing 2π to 360° only renames the number; it doesn’t explain why the runs repeat. The reason is what happens to `P`." },
          { t:"“Because the graph reaches its minimum at π, and 2π is twice π.”", why:"That’s a pattern in the numbers, not a reason the run must repeat." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which is the best explanation of why `y = csc x` has a vertical asymptote at `x = π`?", options:[
          { t:"“`csc x = 1/sin x`, and `sin π = 0`. Close to `x = π`, `sin x` is very close to 0, so its reciprocal is very large in size; at π itself, `csc x` is undefined.”", ok:true, why:"This links the asymptote to dividing by a number close to 0." },
          { t:"“`csc x = sin^{-1} x`, and `sin^{-1} π` doesn’t exist.”", why:"`sin^{-1}` means the inverse function. `csc x` is the reciprocal, `1/sin x`." },
          { t:"“`csc π = 1/0 = 0`, so the graph touches the `x`-axis there.”", why:"`1/0` isn’t 0: it has no value. An asymptote is a line the graph approaches, not a point on the axis." },
          { t:"“The graph of `y = sin x` has a vertical asymptote at `x = π`, and its reciprocal keeps it.”", why:"`y = sin x` has no asymptotes: it’s defined for every `x`. The asymptote comes from `sin π = 0`." }] },
        b:{ prompt:"Which is the best explanation of why `y = sec x` has a vertical asymptote at `x = π/2`?", options:[
          { t:"“`sec x = 1/cos x`, and `cos(π/2) = 0`. Close to `x = π/2`, `cos x` is very close to 0, so its reciprocal is very large in size; at π/2 itself, `sec x` is undefined.”", ok:true, why:"This links the asymptote to dividing by a number close to 0." },
          { t:"“`sec x = cos^{-1} x`, and `cos^{-1}(π/2)` doesn’t exist.”", why:"`cos^{-1}` means the inverse function. `sec x` is the reciprocal, `1/cos x`." },
          { t:"“`sec(π/2) = 1/0 = 0`, so the graph touches the `x`-axis there.”", why:"`1/0` isn’t 0: it has no value." },
          { t:"“The graph of `y = cos x` has a vertical asymptote at `x = π/2`, and its reciprocal keeps it.”", why:"`y = cos x` has no asymptotes. The asymptote comes from `cos(π/2) = 0`." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"A security light `L` is 1 m from a long, straight wall; `N` is the point on the wall nearest the light. The light turns so that its beam makes an angle `x` with the segment `LN`. It turns from `x = π/6` to `x = π/3`. How far does the spot of light move along the wall?" + fig("a1", "Diagram: a light L is 1 metre from a straight wall. N is the point on the wall nearest the light, so LN is 1 metre. The beam leaves L at angle x to LN and lights a spot on the wall. No lengths along the wall are marked.", "fig-sm"), options:[
          { t:"`(√3 - 1)/2` m", why:"That’s `sin(π/3) - sin(π/6)`. The beam, `LN` and the wall make a right triangle with adjacent side 1, so the spot is 1 × `tan x` = `tan x` from `N`: the wall plays the part of the tangent line `x = 1`." },
          { t:"π/6 m", why:"That’s the angle the light turned through, π/3 − π/6. The spot moves along a straight wall, not around a circle." },
          { t:"`2√3/3` m", ok:true, why:"In the right triangle with adjacent side `LN` = 1, the spot is `tan x` from `N`, just as `T` is `tan x` up the tangent line. `tan(π/3) - tan(π/6) = √3 - √3/3 = 2√3/3 ≈ 1.15` m." },
          { t:"`√3` m", why:"That’s where the spot ends up, `tan(π/3)`. It started at `tan(π/6) = √3/3`, so subtract." }] },
        b:{ prompt:"A security light `L` is 1 m from a long, straight wall; `N` is the point on the wall nearest the light. The light turns so that its beam makes an angle `x` with the segment `LN`. It turns from `x = π/4` to `x = π/3`. How far does the spot of light move along the wall?" + fig("a1", "Diagram: a light L is 1 metre from a straight wall. N is the point on the wall nearest the light, so LN is 1 metre. The beam leaves L at angle x to LN and lights a spot on the wall. No lengths along the wall are marked.", "fig-sm"), options:[
          { t:"`(√3 - √2)/2` m", why:"That’s `sin(π/3) - sin(π/4)`. The beam, `LN` and the wall make a right triangle with adjacent side 1, so the spot is `tan x` from `N`." },
          { t:"π/12 m", why:"That’s the angle the light turned through, π/3 − π/4." },
          { t:"`√3 - 1` m", ok:true, why:"With adjacent side `LN` = 1, the spot is `tan x` from `N`. `tan(π/3) - tan(π/4) = √3 - 1 ≈ 0.73` m." },
          { t:"`√3` m", why:"That’s where the spot ends up. It started at `tan(π/4) = 1`, so subtract." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"Use the reciprocal ideas on a new function, `y = 1/(2 + sin x)`. What is its largest value, and where on `0 ≤ x ≤ 2π` does it occur?", options:[
          { t:"1/3, at `x = π/2`", why:"At π/2, `2 + sin x` is largest (3), so its reciprocal is <strong>smallest</strong> there: 1/3 is the minimum." },
          { t:"1, at `x = π/2`", why:"At π/2 the denominator is 2 + 1 = 3, so `y = 1/3` there, not 1." },
          { t:"1, at `x = 3π/2`", ok:true, why:"`2 + sin x` is between 1 and 3 and is never 0, so there are no asymptotes. Its reciprocal is largest where `2 + sin x` is smallest: 2 + (−1) = 1 at `x = 3π/2`, giving 1/1 = 1." },
          { t:"There is no largest value, because the graph has vertical asymptotes.", why:"Asymptotes come from zeros of the denominator, and `2 + sin x` is never 0: it’s always at least 1." }] },
        b:{ prompt:"Use the reciprocal ideas on a new function, `y = 1/(3 - cos x)`. What is its smallest value, and where on `0 ≤ x ≤ 2π` does it occur?", options:[
          { t:"1/2, at `x = 0`", why:"At 0, `3 - cos x` is smallest (2), so its reciprocal is <strong>largest</strong> there: 1/2 is the maximum." },
          { t:"1/4, at `x = 0`", why:"At 0 the denominator is 3 − 1 = 2, so `y = 1/2` there, not 1/4." },
          { t:"1/4, at `x = π`", ok:true, why:"`3 - cos x` is between 2 and 4 and is never 0. Its reciprocal is smallest where `3 - cos x` is largest: 3 − (−1) = 4 at `x = π`, giving 1/4." },
          { t:"There is no smallest value, because the graph has vertical asymptotes.", why:"`3 - cos x` is never 0 (it’s at least 2), so there are no asymptotes." }] } }
    ]
  },
  task:{
    title:"Rising below the axis", summary:"Rising below the axis",
    statement:"<p>Choose one of the six functions and an interval `a < x < b`, with `0 ≤ a < b ≤ 2π`, at least π/2 long, on which the function is defined everywhere, <strong>increasing</strong> and <strong>negative</strong>. There are six different answers. Can you find them all?</p>",
    checks:["The interval is at least π/2 long", "No vertical asymptote inside the interval", "Increasing on the whole interval", "Negative on the whole interval"],
    tips:["Make the interval longer: at least π/2, a whole quadrant.",
      "{f} has a vertical asymptote at `x = ` {v}, inside your interval. Move `a` or `b` so the asymptote is at an end or outside.",
      "{f} isn’t increasing on all of your interval: it falls on {part}. For csc and sec, remember that the reciprocal rises where its partner falls.",
      "{f} isn’t negative on all of your interval: it’s {sign} on {part}. Check the signs quadrant by quadrant."],
    tipJump:"{f} rises on each piece, but at `x = ` {v} it jumps from +∞ down to −∞, so it isn’t increasing across the whole interval. Fix line 2 first.",
    chooseB:"Choose `b > a`",
    explainPrompt:"Pick one of your answers. Explain why the function is increasing and negative there, using the unit circle or the function’s partner.",
    vocab:"Use the words quadrant, increasing, reciprocal and asymptote.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another?",
    allSix:"You found all six. Every answer is exactly one quadrant. Notice that `cot x` never works: between its asymptotes it always falls. And `csc x` and `sec x` rise exactly where `sin x` and `cos x` fall."
  },
  cards:[
    ["`y = sin x`", "`P`’s height on the unit circle. Period 2π, amplitude 1, range `[-1, 1]`, zeros `x = nπ`. In each lap: maximum (π/2, 1), minimum (3π/2, −1)."],
    ["`y = cos x`", "`P`’s run (its `x`-coordinate). Period 2π, amplitude 1, range `[-1, 1]`, zeros `x = π/2 + nπ`. In each lap: maximum (0, 1), minimum (π, −1)."],
    ["Why the graphs use radians", "On the unit circle, the angle in radians is the distance `P` has travelled. One lap is 2π, so `sin x` and `cos x` repeat every 2π along the `x`-axis."],
    ["Period", "The length of the shortest stretch that repeats: `f(x + p) = f(x)` for <strong>every</strong> `x`. One matching value isn’t enough: `sin π = sin 0`, but π is not a period of `sin x`."],
    ["Amplitude", "Half the distance from the maximum to the minimum: `(1 - (-1))/2 = 1` for `sin x` and `cos x`. `tan x` has no amplitude: it has no maximum or minimum."],
    ["`y = tan x`", "`sin x/cos x`. Period π; range `(-∞, ∞)`; zeros `x = nπ`; vertical asymptotes `x = π/2 + nπ`, where `cos x = 0`. Rises on every piece."],
    ["`tan x` on the unit circle", "Extend `P`’s arm to meet the tangent line `x = 1`: the meeting point is `(1, tan x)`. Half a lap later the arm lies on the same line, so `tan x` repeats every π."],
    ["`y = csc x`", "`1/sin x`. Asymptotes `x = nπ`; no zeros; range `(-∞, -1] ∪ [1, ∞)`; period 2π. In each lap: local minimum (π/2, 1), local maximum (3π/2, −1)."],
    ["`y = sec x`", "`1/cos x`. Asymptotes `x = π/2 + nπ`; no zeros; range `(-∞, -1] ∪ [1, ∞)`; period 2π. In each lap: local minimum (0, 1), local maximum (π, −1)."],
    ["`y = cot x`", "`cos x/sin x`. Period π; range `(-∞, ∞)`; zeros `x = π/2 + nπ`; asymptotes `x = nπ`. Falls on every piece."],
    ["Building `y = 1/f(x)`", "Zeros of `f` → vertical asymptotes. Height ±1 → stays put. Same sign; big ↔ small, so a maximum becomes a local minimum and rising becomes falling. Same period."],
    ["`csc x` vs `sin^{-1} x`", "`csc x = 1/sin x = 1/f(x)`, the reciprocal: same `x`, height flipped (`sin x = 1/2` → `csc x = 2`). `sin^{-1} x` and `f^{-1}(x)` mean the inverse function, which swaps `x` and `y`."]
  ]
};
