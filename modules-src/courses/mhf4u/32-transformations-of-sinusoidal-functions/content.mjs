// MHF4U 32 Transformations of Sinusoidal Functions. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/32-transformations-of-sinusoidal-functions.md
// π-multiples in data are [numerator, denominator] coefficients of π.

const FORM = "`y = @a{a} sin[@k{k}(x - @d{d})] + @c{c}`";
const MHINT1 = "Find the axis and amplitude first, then factor the inside to find where the cycle starts.";

export default {
  id:"32-transformations-of-sinusoidal-functions",
  kind:"topic",
  title:"Transformations of sinusoidal functions",
  topic:"Transformations of Sinusoidal Functions",
  readyTopic:"transformations of sinusoidal functions",
  hero:{
    eq:FORM, eqLabel:"y equals a sine of k times the quantity x minus d, plus c", eqSize:"md",
    headline:"Four numbers tune every wave",
    text:"Every sine or cosine wave you’ll meet is `y = sin x` or `y = cos x`, stretched, flipped and shifted. In " + FORM + ", the <strong>amplitude</strong> is `|@a{a}|`, the <strong>period</strong> is `2π/|@k{k}|`, the <strong>phase shift</strong> is `@d{d}` and the <strong>axis</strong> is `y = @c{c}`. The two numbers outside the brackets act up and down. The two inside act left and right, and they work the opposite way to how they look.",
    fig:{ aria:"Animation: y = sin x with its five key points, then stretched to amplitude 2, squeezed to period π, shifted π/6 right and lifted so its axis is y = 1, ending at y = 2 sin[2(x − π/6)] + 1 with the parent dashed behind it", shape:"" }
  },
  goals:[
    "I can state the amplitude, period, phase shift, equation of the axis, maximum, minimum, domain and range of `y = a sin[k(x - d)] + c` or `y = a cos[k(x - d)] + c`.",
    "I can describe how each of `a`, `k`, `d` and `c` transforms the graph of `y = sin x` or `y = cos x`, including stretch factors and reflections, and map points with `(x, y) -> (x/k + d, ay + c)`.",
    "I can use period = `2π/|k|` in both directions, including when `k` contains π.",
    "I can find the phase shift when the inside of the brackets isn’t factored, such as `sin(2x - π/3)`, by factoring out `k`.",
    "I can sketch one cycle of a transformed sinusoid by finding its five key points.",
    "I can use these features to answer questions about a wave, such as where its first maximum is or when a model reaches its lowest value."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Sine and cosine graphs", goal:1,
          prompt:"On the interval `0 ≤ x ≤ 2π`, where does `y = cos x` reach its minimum?",
          options:[
            { t:"`x = π`", ok:true, why:"`cos x` is the `x`-coordinate of the point on the unit circle, and it’s smallest, −1, at the far left: angle π." },
            { t:"`x = 3π/2`", why:"At 3π/2 it’s `sin x` that reaches −1. `cos(3π/2) = 0`." },
            { t:"`x = 2π`", why:"At 2π, `cos x = 1`: that’s a maximum, where the next cycle starts." },
            { t:"`x = π/2`", why:"`cos(π/2) = 0`. The graph crosses the axis there, on its way down to −1." }],
          hints:["`cos x` is the `x`-coordinate of the point on the unit circle at angle `x`.", "The `x`-coordinate is smallest at the leftmost point of the circle, (−1, 0).", "That point is at angle π, so the minimum of `y = cos x` is at `x = π`, where `cos π = -1`."] },
        { id:"w2", skill:"Sine and cosine graphs", goal:5,
          prompt:"Which list gives the values of `sin x` at `x = 0`, π/2, π, 3π/2 and 2π, in that order?",
          options:[
            { t:"0, 1, 0, −1, 0", ok:true, why:"These are the heights of the unit-circle points (1, 0), (0, 1), (−1, 0), (0, −1) and (1, 0)." },
            { t:"1, 0, −1, 0, 1", why:"Those are the `x`-coordinates of the same points: the values of `cos x`." },
            { t:"0, −1, 0, 1, 0", why:"That’s `-sin x`, the graph flipped upside down. `sin(π/2) = 1`, because the point at π/2 is at the top." },
            { t:"0, 1, 0, 1, 0", why:"At 3π/2 the point is (0, −1), at the bottom of the circle, so `sin(3π/2) = -1`." }],
          hints:["`sin x` is the height of the unit-circle point at angle `x`.", "The points are (1, 0), (0, 1), (−1, 0), (0, −1) and back to (1, 0).", "Their heights are 0, 1, 0, −1, 0."] },
        { id:"w3", skill:"Transformations", goal:2,
          prompt:"The point (6, 5) is on the graph of `y = f(x)`. Where is it on the graph of `y = 2f[3(x - 1)] - 4`?",
          options:[
            { t:"(3, 6)", ok:true, why:"Mapping rule `(x, y) -> (x/k + d, ay + c)`: `x` = 6/3 + 1 = 3 and `y` = 2(5) − 4 = 6." },
            { t:"(19, 6)", why:"6 × 3 + 1 = 19. A `k` of 3 inside squeezes the graph, so `x`-values are divided by 3." },
            { t:"(7/3, 6)", why:"(6 + 1) ÷ 3 = 7/3. Divide first, then shift: 6 ÷ 3 + 1 = 3." },
            { t:"(3, 2)", why:"2(5 − 4) = 2 applies the shift first. The order is stretch, then shift: 2(5) − 4 = 6." }],
          hints:["Use `(x, y) -> (x/k + d, ay + c)`. Here `a = 2`, `k = 3`, `d = 1` and `c = -4`.", "`x`: 6 ÷ 3, then + 1. `y`: 2 × 5, then − 4.", "`x` = 2 + 1 = 3 and `y` = 10 − 4 = 6, so the point is (3, 6)."] },
        { id:"w4", skill:"Transformations", goal:2,
          prompt:"How is the graph of `y = f(x/2)` related to the graph of `y = f(x)`?",
          options:[
            { t:"It is stretched horizontally by a factor of 2.", ok:true, why:"`f(x/2)` reaches the value `f(3)` at `x = 6`, twice as far out. Every point moves twice as far from the `y`-axis." },
            { t:"It is compressed horizontally by a factor of 1/2.", why:"Dividing `x` by 2 inside slows the graph down, so it gets wider: the point at `x = 3` moves to `x = 6`." },
            { t:"It is compressed vertically by a factor of 1/2.", why:"A vertical change would be outside: `(1/2)f(x)`. Inside the brackets, the change acts on `x`." },
            { t:"It is translated 2 units to the right.", why:"`f(x - 2)` moves the graph right 2. Dividing `x` by 2 stretches it instead." }],
          hints:["Ask: which `x` now gives the output that `f(x)` gave at `x = 3`?", "`f(x/2) = f(3)` when `x/2 = 3`, so at `x = 6`.", "Every point moves twice as far from the `y`-axis: a horizontal stretch by a factor of 2."] },
        { id:"w5", skill:"Factoring the inside", goal:4,
          prompt:"Which expression is equal to `2x + π/3`?",
          options:[
            { t:"`2(x + π/6)`", ok:true, why:"Expand to check: `2x + 2(π/6) = 2x + π/3`." },
            { t:"`2(x + π/3)`", why:"`2(x + π/3) = 2x + 2π/3`. The π/3 must be divided by 2 as well." },
            { t:"`2(x + 2π/3)`", why:"`2(x + 2π/3) = 2x + 4π/3`. Factoring out 2 divides each term by 2." },
            { t:"`2(x - π/6)`", why:"`2(x - π/6) = 2x - π/3`. The sign inside stays a plus." }],
          hints:["Factoring out 2 means dividing each term by 2.", "`2x` ÷ 2 = `x`, and (π/3) ÷ 2 = π/6.", "`2x + π/3 = 2(x + π/6)`. Expand it to check."] },
        { id:"w6", skill:"Sinusoids in degrees", goal:3,
          prompt:"In degrees, what is the period of `y = sin 3x`?",
          options:[
            { t:"60°", why:"180° ÷ 3 = 60°. The period of `sin x` is a full turn, 360°." },
            { t:"120°", ok:true, why:"The period of `y = sin kx` is 360°/`k` = 360°/3 = 120°: three cycles fit into 360°." },
            { t:"360°", why:"`k = 3` squeezes three cycles into 360°, so each cycle is shorter." },
            { t:"1080°", why:"360° × 3 would make the wave three times longer. A bigger `k` makes it shorter: 360° ÷ 3." }],
          hints:["In Grade 11 you used period = 360°/`k`.", "Here `k = 3`.", "360° ÷ 3 = 120°."] }
      ],
      refreshers:{
        "Sine and cosine graphs":"In radians, `y = sin x` runs 0 → 1 → 0 → −1 → 0 at `x = 0`, π/2, π, 3π/2, 2π: it starts on its axis and rises. `y = cos x` runs 1 → 0 → −1 → 0 → 1 at the same `x`-values: it starts at its maximum. Both have period 2π, amplitude 1 and range `{y ∈ ℝ | -1 ≤ y ≤ 1}`.",
        "Transformations":"For `y = a f[k(x - d)] + c`, each point `(x, y)` of `y = f(x)` moves to `(x/k + d, ay + c)`. Inside changes act on `x` and work backwards: `k = 3` divides `x`-values by 3 (a horizontal compression by a factor of 1/3), and `x - 1` moves the graph right 1. Outside changes act on `y`. Do the stretches first, then the shifts: (6, 5) → (6/3 + 1, 2(5) − 4) = (3, 6).",
        "Factoring the inside":"To find a phase shift, the inside must look like `k(x - d)`. Factor out `k` by dividing each term by it: `2x + π/3 = 2(x + π/6)`, and `3x - π/2 = 3(x - π/6)`. Check by expanding.",
        "Sinusoids in degrees":"In Grade 11, `y = a sin[k(x - d)] + c` had period 360°/`k`. Everything carries over to radians, with 2π in place of 360°: the period of `y = sin 3x` is 360°/3 = 120°, which is 2π/3 radians."
      }
    }
  },
  explore:{
    heading:"Wave tuner: four numbers, four brackets",
    intro:"Move the sliders and watch the brackets. Violet measures the amplitude, orange the period, teal the phase shift and magenta the axis. The shaded box always holds exactly one cycle, split into quarters.",
    predictions:[
      { id:"p1", start:{ form:"F", f:"sin", a:1, k:1, d:[0, 1], c:0 },
        prompt:"`k` is about to change from 1 to 3. What will the period be?",
        options:[{ t:"2π/3", ok:true }, { t:"π/3" }, { t:"6π" }, { t:"Still 2π: the wave gets taller instead" }],
        explain:"`k` multiplies `x` inside the brackets, so the inside angle `3x` runs three times as fast. It reaches 2π when `x = 2π/3`, so a full cycle takes only 2π/3. Period = 2π ÷ `k`: a bigger `k` gives a shorter period. (π/3 is only the first half-wave, and 6π is 2π × 3, which would be a longer wave.)" },
      { id:"p2", start:{ form:"F", f:"sin", a:1, k:3, d:[0, 1], c:0, ghost:true },
        prompt:"`d` is about to slide from 0 to 2π/3. When it stops, how will the new graph compare with the starting graph?",
        options:[{ t:"It will be exactly the same graph", ok:true }, { t:"It will be the same shape, but 2π/3 further right: a different graph" }, { t:"It will be different: a sine wave only lands on itself after a shift of 2π" }, { t:"It will be compressed even more" }],
        explain:"A shift of one whole period moves each cycle onto the next one, so the graph doesn’t change: `sin[3(x - 2π/3)] = sin(3x - 2π) = sin 3x`. So a phase shift is never unique: `d` and `d` plus any multiple of the period draw the same wave. The period is 2π only when `k = 1`." },
      { id:"p3", start:{ form:"E", f:"sin", a:1, k:1, b:[-1, 2], c:0 },
        prompt:"`k` is about to change from 1 to 2, keeping the −π/2: `y = sin(2x - π/2)`. Where will the cycle start now?",
        options:[{ t:"`x = π/4`", ok:true }, { t:"`x = π/2`: it stays where it was" }, { t:"`x = π`" }, { t:"`x = -π/4`" }],
        explain:"In `sin(2x - π/2)`, the inside is 0 when `2x = π/2`, so at `x = π/4`. Factor out the 2: `2x - π/2 = 2(x - π/4)`. The phase shift is π/4, not π/2. In Expanded form, `k` squeezes the whole graph toward the `y`-axis, so the start moves; in Factored form the start `x = d` stays put. That’s why you factor before reading the phase shift." },
      { id:"p4", start:{ form:"F", f:"cos", a:2, k:1, d:[0, 1], c:1, ghost:true },
        prompt:"`a` is about to change from 2 to −2: `y = -2 cos x + 1`. The new graph is the old one reflected in a horizontal line. Which line?",
        options:[{ t:"`y = 1`, the axis", ok:true }, { t:"`y = 0`, the `x`-axis" }, { t:"`y = 3`, the line through the maximums" }, { t:"`y = -1`, the line through the minimums" }],
        explain:"`a` measures distance from the axis, so changing its sign flips the wave about its own axis, `y = c`. The amplitude and the range stay the same. Starting from `y = cos x`, the steps are: stretch by 2 and reflect in the `x`-axis, <strong>then</strong> translate up 1. Because the reflection happens before the shift, the finished graph is flipped about `y = 1`, not about the `x`-axis." }
    ],
    chalIntro:"Tap a challenge to set up the tuner for it (some controls lock), set the tuner, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:1,
        prompt:"Fit the band. Two dashed lines mark `y = 4` and `y = -2`. With `f` = sin, `k = 1` and `d = 0` locked, make the wave reach exactly up to `y = 4` and down to `y = -2`.",
        why:"The axis is halfway between 4 and −2, so `c = 1`, and the amplitude is half the band’s height, 3. (`a = -3` also fits: the wave is upside down but fills the same band.)",
        hints:["The axis is halfway between the highest and lowest values.", "The axis is (4 + (−2)) ÷ 2 = 1, so `c = 1`. The amplitude is half the height of the band.", "(4 − (−2)) ÷ 2 = 3, so `a = 3` and `c = 1`. (`a = -3` also fits: the wave is upside down but fills the same band.)"] },
      { id:"tc2", goal:[1, 4],
        prompt:"Set the tuner to `y = 2 sin(3x - π/2) + 1`. (Factored form only; `f` = sin and `a = 2` are locked. The target isn’t drawn until after your first check.)",
        why:"`3x - π/2 = 3(x - π/6)`, so the phase shift is π/6 to the right.",
        whySame:"Same graph. Your `d` is π/6 plus or minus a whole number of periods (2π/3 each), so every cycle lines up. The equation’s own phase shift is π/6.",
        hints:["The tuner needs the form `2 sin[k(x - d)] + c`. Factor the 3 out of `3x - π/2`.", "`3x - π/2 = 3(x - π/6)`. So `k = 3` and `d = π/6`.", "Set `k = 3`, `d = π/6` and `c = 1`."] },
      { id:"tc3", goal:[3, 5], stretch:true,
        prompt:"Commit first. The wave is `y = sin[k(x - d)]`, with `a = 1` and `c = 0` locked. It must have a <strong>maximum at `x = π/3`</strong> and the <strong>very next minimum at `x = 5π/6`</strong>. Choose `k` and enter `d` (between −π and π) <strong>before</strong> the graph moves.",
        why:"From a maximum to the next minimum is half a period, so the period is π and `k = 2`. Sine peaks a quarter period after its start, so `d = π/3 - π/4 = π/12` (or `π/12 - π = -11π/12`).",
        hints:["From a maximum to the next minimum is half a period.", "Half a period is `5π/6 - π/3 = π/2`, so the period is π and `k = 2π ÷ π = 2`. A sine cycle starts on its axis and reaches its maximum a quarter period later.", "A quarter period is π/4, so the cycle starts at `π/3 - π/4 = π/12`: `d = π/12`. (`d = π/12 - π = -11π/12` also works.)"] }
    ],
    chalFb:{
      tc1:{
        a3c0:"The height is right: the band is 6 tall, so the amplitude is 3. But the axis is still `y = 0`. The axis sits halfway between 4 and −2.",
        c1:"The axis is right. Now the wave reaches {max} and {min}. The amplitude is half the band’s height: (4 − (−2)) ÷ 2.",
        a2c2:"The top is right, but the bottom is at 0. You need the axis halfway between −2 and 4, and an amplitude of half the gap.",
        a3cm1:"The height is right, but the wave runs from −4 to 2: it’s shifted down instead of up.",
        cm2:"`c` is the middle line of the wave, not its lowest value. The axis sits halfway between 4 and −2.",
        other:"Compare the readout’s maximum and minimum with 4 and −2."
      },
      tc2:{
        dpi2:"You’ve made `2 sin[3(x - π/2)] + 1 = 2 sin(3x - 3π/2) + 1`: the π/2 got multiplied by 3. Factor 3 out of `3x - π/2` first.",
        dm6:"That’s a shift to the left. `3x - π/2 = 3(x - π/6)`, so `d = +π/6`: right.",
        k:"`k` is the number multiplying `x` inside the brackets: 3. Your `k` of {k} gives a period of {P}, but this wave repeats every 2π/3.",
        c:"The axis is `y = c`. In this equation, `c = 1`.",
        other:"Find where the inside, `3x - π/2`, equals 0. That’s where the cycle starts, and it’s `d`."
      },
      tc3:{
        k1:"With `k = 1` a minimum comes π after a maximum. Here the gap is `5π/6 - π/3 = π/2`, and from a maximum to the next minimum is half a period. So the period is π.",
        k4:"With `k = 4` the period is π/2: you used the maximum-to-minimum gap as a whole period. That gap is only half a cycle.",
        dpi3:"The period is right, but `d = π/3` starts the sine cycle at π/3, on its axis going up. Sine reaches its maximum a quarter period after the start.",
        dpi6:"You’ve solved `2x - d = π/2`, as if the wave were `sin(2x - d)`. In `sin[2(x - d)]`, `d` is multiplied by 2 too: `2(π/3 - d) = π/2`.",
        d7:"This puts a <strong>minimum</strong> at π/3: you moved a quarter period the wrong way.",
        range:"Keep `d` between −π and π.",
        other:"Work it out before you check: how far is it from a maximum to the next minimum, and what fraction of a cycle is that?"
      }
    },
    blocks:[{ title:"What the brackets mean", html:"<p><strong>Reading `y = a sin[k(x - d)] + c` (or cos)</strong></p><ul><li><strong>Outside, vertical:</strong> amplitude `|a|`; axis `y = c`; max `c + |a|`; min `c - |a|`. A negative `a` flips the wave about its axis.</li><li><strong>Inside, horizontal:</strong> period `2π/|k|`; phase shift `d`, where the inside is 0. Both work “backwards”: a bigger `k` means a shorter wave, and `x - d` moves it right.</li><li><strong>Factor first:</strong> if the inside reads `kx + b`, write it as `k(x + b/k)` before reading `d`.</li></ul>" }]
  },
  part3:{
    slug:"detective", name:"Detective",
    heading:"Period and phase detective",
    intro:"Each equation hides its phase shift and period inside the brackets. Find where one cycle starts and ends, then place its five key points. Press <strong>Draw it</strong> to see the true curve.",
    cases:[
      { id:"c1", name:"Case 1", goal:[4, 5], eq:"`y = sin(2x - π/3)`", inside:"`2x - π/3`",
        f:"sin", a:1, k:[2, 1], b:[-1, 3], c:0, view:{ x0:[0, 1], x1:[3, 2], y0:-2, y1:2 },
        answer:{ s:[1, 6], e:[7, 6] },
        wrongStart:[
          { v:[1, 3], fb:"At `x = π/3` the inside is `2(π/3) - π/3 = π/3`, not 0. Solve `2x - π/3 = 0`: divide π/3 by 2." },
          { v:[2, 3], fb:"At `x = 2π/3` the inside is π. You multiplied by 2 instead of dividing." },
          { v:[-1, 6], fb:"At `x = -π/6` the inside is −2π/3. `2x - π/3 = 0` gives a positive `x`." }],
        wrongEnd:[
          { v:[13, 6], fb:"That’s the start plus 2π, the period of `sin x`. This wave’s period is 2π/2 = π." },
          { v:[7, 3], fb:"Solve `2x - π/3 = 2π`: `2x = 7π/3`, then divide by 2." }],
        mix:{},
        hints:["The cycle starts where the inside, `2x - π/3`, is 0, and ends where it’s 2π.", "`2x - π/3 = 0` gives `x = π/6`, and `2x - π/3 = 2π` gives `x = 7π/6`.", "Period π, quarter π/4: points at π/6, 5π/12, 2π/3, 11π/12, 7π/6. Sine with `a = 1`: heights 0, 1, 0, −1, 0."],
        alg:["`2x - π/3 = 2(x - π/6)`, so `k = 2` and `d = π/6`.", "Period = 2π/2 = π; quarter period = π/4.", "Key `x`-values: π/6, 5π/12, 2π/3, 11π/12, 7π/6.", "Sine with `a = 1 > 0` starts on its axis going up: 0. Then maximum 1, axis 0, minimum −1, axis 0."] },
      { id:"c2", name:"Case 2", goal:[4, 5], eq:"`y = 3 cos(2x + π/2) - 1`", inside:"`2x + π/2`",
        f:"cos", a:3, k:[2, 1], b:[1, 2], c:-1, view:{ x0:[-1, 2], x1:[1, 1], y0:-5, y1:3 },
        answer:{ s:[-1, 4], e:[3, 4] },
        wrongStart:[
          { v:[1, 4], fb:"At `x = π/4` the inside is π. `2x + π/2 = 0` gives `x = -π/4`: the shift is to the left." },
          { v:[-1, 2], fb:"At `x = -π/2` the inside is −π/2. Divide by 2: `x = -π/4`." }],
        wrongEnd:[
          { v:[7, 4], fb:"That’s −π/4 + 2π. The period is 2π/2 = π, so the cycle ends at −π/4 + π." }],
        mix:{ "sin+":"That’s the sine pattern. Cosine with `a > 0` starts at its maximum, `c + |a| = 2`." },
        hints:["Solve `2x + π/2 = 0` for the start and `2x + π/2 = 2π` for the end.", "Start −π/4, end 3π/4: period π, quarter π/4.", "Cosine with `a = 3`: max, axis, min, axis, max. Max = −1 + 3 = 2, min = −1 − 3 = −4. Points (−π/4, 2), (0, −1), (π/4, −4), (π/2, −1), (3π/4, 2)."],
        alg:["`2x + π/2 = 2(x + π/4)`, so `k = 2` and `d = -π/4`.", "Period = 2π/2 = π; quarter period = π/4.", "Key `x`-values: −π/4, 0, π/4, π/2, 3π/4.", "Cosine with `a = 3 > 0` starts at its maximum: −1 + 3 = 2. Then axis −1, minimum −4, axis −1, maximum 2."] },
      { id:"c3", name:"Case 3", goal:[3, 4, 5], eq:"`y = -2 sin(x/2 + π/4) + 1`", inside:"`x/2 + π/4`",
        f:"sin", a:-2, k:[1, 2], b:[1, 4], c:1, view:{ x0:[-1, 1], x1:[4, 1], y0:-2, y1:4 },
        answer:{ s:[-1, 2], e:[7, 2] },
        wrongStart:[
          { v:[-1, 8], fb:"At `x = -π/8` the inside is 3π/16. `x/2 = -π/4` means `x = 2 × (-π/4)`: multiply by 2, don’t divide." },
          { v:[-1, 4], fb:"At `x = -π/4` the inside is π/8. `x/2 = -π/4` gives `x = -π/2`." }],
        wrongEnd:[
          { v:[7, 8], fb:"`x/2 = 7π/4` means `x = 7π/2`. You divided by 2 instead of multiplying." },
          { v:[3, 2], fb:"That’s the start plus 2π. With `k = 1/2` the period is 2π ÷ ½ = 4π." }],
        mix:{ "sin+":"That’s the pattern for `a > 0`. With `a = -2` the sine wave goes <strong>down</strong> first: point 2 is a minimum, 1 − 2 = −1." },
        hints:["Solve `x/2 + π/4 = 0` and `x/2 + π/4 = 2π`. To undo `x/2`, multiply by 2.", "Start −π/2, end 7π/2: the period is 4π and a quarter is π.", "Sine with `a = -2`: axis, min, axis, max, axis, with axis 1, min −1, max 3. Points (−π/2, 1), (π/2, −1), (3π/2, 1), (5π/2, 3), (7π/2, 1)."],
        alg:["`x/2 + π/4 = ½(x + π/2)`, so `k = 1/2` and `d = -π/2`.", "Period = 2π ÷ ½ = 4π; quarter period = π.", "Key `x`-values: −π/2, π/2, 3π/2, 5π/2, 7π/2.", "Sine with `a = -2 < 0` starts on its axis going down: 1. Then minimum −1, axis 1, maximum 3, axis 1."] }
    ],
    msg:{
      startGen:"At {x}, {inside} = {th}, not 0.",
      endGen:"At {x}, {inside} = {th}, not 2π.",
      startOk:"✓ At {x}, {inside} = 0.",
      endOk:"✓ At {x}, {inside} = 2π.",
      col:"Key points are a quarter period apart. Point {n} belongs at {xv} = {start} + ({n} − 1) × {q} = {v}.",
      height:"At {xv} the inside is {th}, and {fth} = {fv}, so the height is {calc} = {h}.",
      mix:"That’s the {name}. {F} with {sign} goes {words}."
    },
    blocks:[{ title:"How the detective sketches", html:"<p><strong>Sketch any sinusoid in four steps</strong></p><ol><li><strong>Factor</strong> the inside: `kx + b = k(x - d)`.</li><li><strong>Period</strong> `2π/|k|`, and a quarter of it.</li><li><strong>Five `x`-values:</strong> `d`, then add a quarter period four times.</li><li><strong>Heights</strong> from the pattern: sine goes axis, max, axis, min, axis; cosine goes max, axis, min, axis, max; a negative `a` swaps max and min. Axis `c`, max `c + |a|`, min `c - |a|`.</li></ol><p><strong>If `k` is negative,</strong> make it positive first with module 27’s identities: `cos(-θ) = cos θ` and `sin(-θ) = -sin θ`. So `y = cos(-2x) = cos 2x`, and `y = sin(-2x) = -sin 2x`. The period is still `2π/|k|`.</p>" }],
    quickCheck:{
      title:"Detective quick check", summary:"Detective quick check",
      items:[
        { id:"q1", goal:4, prompt:"What is the phase shift of `y = cos(4x - π/3)`?",
          choices:[
            { t:"π/12 to the right", ok:true, fb:"Right. `4x - π/3 = 4(x - π/12)`." },
            { t:"π/3 to the right", fb:"That’s the number before factoring. `4x - π/3 = 4(x - π/12)`: divide π/3 by 4." },
            { t:"4π/3 to the right", fb:"That multiplies π/3 by 4. Factoring out 4 divides each term by 4." },
            { t:"π/12 to the left", fb:"`x - π/12` is a shift to the right: the inside is 0 at `x = π/12`." }] },
        { id:"q2", goal:3, prompt:"What is the period of `y = sin(x/3 + π/6)`?",
          choices:[
            { t:"2π/3", fb:"That’s 2π × 1/3. `k = 1/3` stretches the wave, so the period gets longer: 2π ÷ (1/3)." },
            { t:"2π", fb:"`x/3` means `k = 1/3`, which stretches the wave. The period changes." },
            { t:"12", fb:"That divides 2π by π/6, the shift term. The period uses `k`, the number multiplying `x`." },
            { t:"6π", ok:true, fb:"Right. `k = 1/3`, so the period is 2π ÷ (1/3) = 6π. The + π/6 only shifts the wave." }] },
        { id:"q3", goal:5, prompt:"On `y = 4 sin(2x - π/2)`, where is the first maximum to the right of the `y`-axis?",
          choices:[
            { t:"π/4", fb:"That’s where the inside is 0: the cycle starts there, on its axis. Sine peaks a quarter period later." },
            { t:"π/2", ok:true, fb:"Right. The cycle starts at π/4 (`2x - π/2 = 0`), the period is π, and the maximum is a quarter period later: π/4 + π/4 = π/2." },
            { t:"3π/4", fb:"At 3π/4 the inside is π: the wave is back on its axis, going down." },
            { t:"π", fb:"At π the inside is 3π/2, where sine is −1: that’s the minimum." }] },
        { id:"q4", goal:4, prompt:"Which equation has the same graph as `y = sin[2(x - π/3)]`?",
          choices:[
            { t:"`sin(2x - 2π/3)`", ok:true, fb:"Right. Multiply out: `2(x - π/3) = 2x - 2π/3`." },
            { t:"`sin(2x - π/3)`", fb:"That forgets to multiply π/3 by 2. `sin(2x - π/3)` starts its cycle at π/6, not π/3." },
            { t:"`sin(2x - π/6)`", fb:"That divides π/3 by 2 instead of multiplying. Expanding `2(x - π/3)` multiplies both terms by 2." },
            { t:"`sin(2x + 2π/3)`", fb:"The sign changed. `2(x - π/3) = 2x - 2π/3`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"custom", title:"Match the equation to its graph", summary:"Match the equation to its graph", goal:[1, 4, 5],
        instruction:"Match each equation to its graph.",
        how:"Tap an equation, then tap the graph it makes.",
        items:[
          { id:"A", eq:"`y = 2 sin(2x - π/3) + 1`", eqR:"`2 sin(2x - π/3) + 1`", fact:"`2x - π/3 = 2(x - π/6)`", p:{ f:"sin", a:2, k:2, d:[1, 6], c:1 },
            why:"`2x - π/3 = 2(x - π/6)`: the cycle starts at π/6 going up.",
            hints:[MHINT1, "Axis `y = 1`, range −1 to 3, period π. `2x - π/3 = 2(x - π/6)`, so the cycle starts at π/6.", "Look for the graph that crosses `y = 1` going <strong>up</strong> at `x = π/6` and peaks at 3 when `x = 5π/12`."] },
          { id:"B", eq:"`y = 2 sin[2(x - π/3)] + 1`", eqR:"`2 sin[2(x - π/3)] + 1`", fact:"`2(x - π/3)`", p:{ f:"sin", a:2, k:2, d:[1, 3], c:1 },
            why:"Already factored: the cycle starts at π/3.",
            hints:[MHINT1, "Axis `y = 1`, range −1 to 3, period π. The inside `2(x - π/3)` is already factored, so the cycle starts at π/3.", "Look for the graph that crosses `y = 1` going <strong>up</strong> at `x = π/3` and peaks at 3 when `x = 7π/12`."] },
          { id:"C", eq:"`y = 2 sin(2x + π/3) + 1`", eqR:"`2 sin(2x + π/3) + 1`", fact:"`2x + π/3 = 2(x + π/6)`", p:{ f:"sin", a:2, k:2, d:[-1, 6], c:1 },
            why:"`2x + π/3 = 2(x + π/6)`: the cycle starts at −π/6, a shift left.",
            hints:[MHINT1, "Axis `y = 1`, range −1 to 3, period π. `2x + π/3 = 2(x + π/6)`, so the cycle starts at −π/6.", "Look for the graph that crosses `y = 1` going <strong>up</strong> at `x = -π/6` and peaks at 3 when `x = π/12`."] },
          { id:"D", eq:"`y = -2 sin(2x - π/3) + 1`", eqR:"`-2 sin(2x - π/3) + 1`", fact:"`2x - π/3 = 2(x - π/6)`", p:{ f:"sin", a:-2, k:2, d:[1, 6], c:1 },
            why:"`a = -2` turns the wave upside down: at π/6 it crosses its axis going down.",
            hints:[MHINT1, "Axis `y = 1`, range −1 to 3, period π. `2x - π/3 = 2(x - π/6)`, so the cycle starts at π/6, and `a = -2 < 0` turns it upside down.", "Look for the graph that crosses `y = 1` going <strong>down</strong> at `x = π/6` and reaches its minimum, −1, at `x = 5π/12`."] },
          { id:"E", eq:"`y = 2 cos(2x - π/3) + 1`", eqR:"`2 cos(2x - π/3) + 1`", fact:"`2x - π/3 = 2(x - π/6)`", p:{ f:"cos", a:2, k:2, d:[1, 6], c:1 },
            why:"Cosine starts its cycle at a maximum, and the cycle starts at π/6.",
            hints:["Is this sine or cosine? Where does that function start its cycle?", "Cosine starts at a maximum. `2x - π/3 = 2(x - π/6)`, so the cycle starts at π/6.", "Look for the graph with a maximum of 3 at `x = π/6` and a period of π."] },
          { id:"F", eq:"`y = 2 sin(x - π/3) + 1`", eqR:"`2 sin(x - π/3) + 1`", fact:"`x - π/3`", p:{ f:"sin", a:2, k:1, d:[1, 3], c:1 },
            why:"`k = 1`: the period is 2π, twice as long as the first equation’s.",
            hints:[MHINT1, "Axis `y = 1`, range −1 to 3. `k = 1`, so the period is 2π, and the cycle starts at π/3.", "Look for the graph that crosses `y = 1` going <strong>up</strong> at `x = π/3`, peaks at 3 when `x = 5π/6`, and repeats every 2π."] },
          { id:"G", eq:"`y = 2 sin(2x - π/3) - 1`", eqR:"`2 sin(2x - π/3) - 1`", fact:"`2x - π/3 = 2(x - π/6)`", p:{ f:"sin", a:2, k:2, d:[1, 6], c:-1 },
            why:"`c = -1`: the axis is `y = -1`.",
            hints:[MHINT1, "Axis `y = -1`, range −3 to 1, period π. `2x - π/3 = 2(x - π/6)`, so the cycle starts at π/6.", "Look for the graph that crosses `y = -1` going <strong>up</strong> at `x = π/6` and peaks at 1 when `x = 5π/12`."] },
          { id:"H", eq:"`y = sin(2x - π/3) + 1`", eqR:"`sin(2x - π/3) + 1`", fact:"`2x - π/3 = 2(x - π/6)`", p:{ f:"sin", a:1, k:2, d:[1, 6], c:1 },
            why:"`a = 1`: the wave reaches only 1 above and below its axis.",
            hints:[MHINT1, "Axis `y = 1`, range 0 to 2, period π. `2x - π/3 = 2(x - π/6)`, so the cycle starts at π/6.", "Look for the graph that crosses `y = 1` going <strong>up</strong> at `x = π/6` and peaks at 2 when `x = 5π/12`."] }
        ],
        graphs:["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8"],
        answer:{ A:"g3", B:"g7", C:"g1", D:"g5", E:"g8", F:"g2", G:"g6", H:"g4" },
        wrong:{
          "A|B":"That graph’s cycle starts at π/3. In `2 sin(2x - π/3) + 1`, factor first: `2x - π/3 = 2(x - π/6)`, so the cycle starts at π/6.",
          "B|A":"That graph starts at π/6. `2 sin[2(x - π/3)] + 1` is already factored, so its cycle starts at π/3. Multiplied out, it’s `2 sin(2x - 2π/3) + 1`.",
          "A|C":"That graph starts at −π/6, a shift left. `2x - π/3 = 2(x - π/6)` is a shift right.",
          "C|A":"`2x + π/3 = 2(x + π/6)`: the inside is 0 at `x = -π/6`, so this wave is shifted left.",
          "A|D":"That graph goes <strong>down</strong> as it crosses its axis at π/6: it’s upside down, so its `a` is negative.",
          "A|E":"That graph has a maximum at π/6, which is where a <strong>cosine</strong> cycle starts. A sine cycle starts on its axis going up.",
          "E|A":"In `2 cos(2x - π/3) + 1` the cycle starts at π/6 at a maximum, because it’s cosine. That graph is only on its axis at π/6.",
          "B|F":"Both start at π/3 going up, but that graph repeats every 2π. With `k = 2` the period is π."
        },
        msg:{
          axis:"That graph’s axis is {ax2}. In {eq}, {cEq}.",
          amp:"That graph reaches {A2} above and below its axis. In {eq}, the amplitude is {A}.",
          period:"That graph repeats every {P2}. In {eq}, {kEq}, so the period is {Pcalc}.",
          start:"Factor the inside: {fact}. This cycle starts at {xd} {how}. That graph doesn’t.",
          tail:"Try another graph.",
          desc:"Wave between {lo} and {hi} around the line {ax}, repeating every {P}. It {move} at {d} and peaks at {pk}.",
          up:"going up", down:"going down", max:"at a maximum", min:"at a minimum"
        } },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Emma", how:"",
        instruction:"Emma made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Find the phase shift of `y = 3 sin(4x - π) + 2` and the interval for one cycle.",
            steps:["The amplitude is 3 and the axis is `y = 2`.", "`k = 4`, so the period is 2π/4 = π/2.", "The phase shift is π to the right.", "So one cycle runs from `x = π` to `x = 3π/2`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: 2π ÷ 4 = π/2.", "", "Step 4 adds the period to step 3’s start correctly. The mistake is earlier."],
            fixes:[
              { t:"Factor first: `4x - π = 4(x - π/4)`. The phase shift is π/4 to the right, and one cycle runs from π/4 to 3π/4.", ok:true, why:"Check: at `x = π/4` the inside is `4(π/4) - π = 0`, and at 3π/4 it’s 2π." },
              { t:"The phase shift is π to the left, so one cycle runs from −π to −π/2.", why:"That changes the direction but still doesn’t factor. `x - π/4` is a shift to the right." },
              { t:"The phase shift is 4π to the right, so one cycle runs from 4π to 9π/2.", why:"That multiplies by 4. Factoring out 4 divides π by 4." },
              { t:"Step 3 is correct as written.", why:"At `x = π` the inside is 4π − π = 3π, so the wave is crossing its axis going <strong>down</strong>, halfway through a cycle. A sine cycle starts where the inside is 0." }],
            hints:["Before reading a phase shift, the inside must look like `k(x - d)`.", "Factor 4 out of `4x - π`.", "Step 3 is wrong: `4x - π = 4(x - π/4)`, so the phase shift is π/4 right and one cycle runs from π/4 to π/4 + π/2 = 3π/4."] },
          { id:"e2", goal:3, task:"Find the period of `y = 5 cos(x/4) - 2`, and the `x`-values of the key points of the cycle that starts at `x = 0`.",
            steps:["`x/4 = (1/4)x`, so `k = 1/4`.", "The period is 2π × 1/4 = π/2.", "A quarter period is π/8, so the key points are at `x = 0`, π/8, π/4, 3π/8 and π/2.", "Cosine with `a = 5` starts at its maximum, 5 − 2 = 3."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 divides step 2’s period into quarters correctly. The mistake is earlier.", "Step 4 is true: the maximum is `c + |a| = 3`. The mistake is earlier."],
            fixes:[
              { t:"The period is 2π ÷ (1/4) = 8π, so the key points are at `x = 0`, 2π, 4π, 6π and 8π.", ok:true, why:"`k = 1/4` stretches the wave by a factor of 4, so the period is 4 × 2π = 8π." },
              { t:"The period is 2π, because `k` only changes how tall the wave is.", why:"`k` is inside the brackets, so it acts horizontally. The height is set by `a`." },
              { t:"The period is 2π/4 = π/2, because `x/4` means `k = 4`.", why:"`x/4` is `(1/4)x`, so `k = 1/4`, as step 1 says. This gives the same wrong period." },
              { t:"Step 2 is correct as written.", why:"2π × 1/4 multiplies by `k`. A `k` less than 1 stretches the wave, so the period must be <strong>longer</strong> than 2π." }],
            hints:["Is the period found by multiplying 2π by `k` or by dividing?", "Period = 2π/`k`. A `k` smaller than 1 makes the period longer than 2π.", "Step 2 is wrong: 2π ÷ (1/4) = 8π, with a quarter period of 2π."] },
          { id:"e3", goal:2, task:"On `y = cos x`, the minimum is at (π, −1). Where does that point land on `y = 3 cos[2(x + π/3)] + 1`?",
            steps:["`a = 3`, `k = 2`, `d = -π/3` and `c = 1`.", "The mapping rule is `(x, y) -> (x/2 - π/3, 3y + 1)`.", "`x`: (π − π/3) ÷ 2 = (2π/3) ÷ 2 = π/3.", "`y`: 3(−1) + 1 = −2.", "So the minimum lands at (π/3, −2)."],
            answer:2,
            stepFb:["Step 1 is correct: `x + π/3 = x - (-π/3)`.", "Step 2 is correct: `(x/k + d, ay + c)`.", "", "Step 4 is true. The mistake is earlier.", "Step 5 uses step 3’s `x`. The mistake is earlier."],
            fixes:[
              { t:"`x`: π ÷ 2 − π/3 = π/2 − π/3 = π/6, so the minimum lands at (π/6, −2).", ok:true, why:"Check: `2(π/6 + π/3) = π`, and `3 cos π + 1 = -2`." },
              { t:"`x`: π × 2 − π/3 = 5π/3, so the minimum lands at (5π/3, −2).", why:"A compression by a factor of 1/2 halves `x`-values; it doesn’t double them." },
              { t:"`x`: π ÷ 2 + π/3 = 5π/6, so the minimum lands at (5π/6, −2).", why:"`d = -π/3`, so the shift is to the left: subtract π/3." },
              { t:"Step 3 is correct as written.", why:"Put `x = π/3` back in: `2(π/3 + π/3) = 4π/3`, not π. So (π/3, −2) isn’t a minimum: `3 cos(4π/3) + 1 = -1/2`." }],
            hints:["Step 2’s rule says: divide by `k` first, then add `d`. Does step 3 follow it?", "Step 3 subtracts π/3 before dividing by 2.", "Step 3 is wrong: π ÷ 2 − π/3 = π/6. The minimum lands at (π/6, −2)."] }
        ] },
      { id:"multi", type:"custom", title:"Multi-step and work backwards", summary:"Multi-step and work backwards", star:true, goal:[3, 4, 5, 6],
        instruction:"Each question takes more than one step. Enter the answer, then press Check.",
        how:"π-boxes take the number in front of π as a fraction, for example 1/2 for π/2. After each check, a small graph shows the wave with the feature you found.",
        fallback:"Not quite. The preview shows your value; compare it with what the question asks for.",
        items:[
          { id:"n1", goal:[5, 6], prompt:"`y = 3 sin(2x - π/2) + 1`. Find the first `x > 0` where `y` reaches its maximum.",
            boxes:[{ kind:"pi", pre:"`x =`" }], answer:[0.5], display:"`x = π/2`",
            wrong:[
              { v:[0.25], fb:"That’s where the inside is 0: the cycle starts there, on the axis. Sine peaks a quarter period later." },
              { v:[1], fb:"You’ve ignored `k = 2`: solve `2x - π/2 = π/2`." },
              { v:[0.75], fb:"At 3π/4 the inside is π: the wave is back on its axis." }],
            hints:["Sine reaches its maximum where its inside equals π/2.", "Solve `2x - π/2 = π/2`.", "`2x = π`, so `x = π/2`. (The cycle starts at π/4, and the maximum is a quarter period, π/4, later.)"] },
          { id:"n2", goal:[3, 6], prompt:"How many maximum points does `y = cos 3x` have for `0 ≤ x ≤ 2π`, counting the endpoints?",
            boxes:[{ kind:"num", pre:"Number of maximums:" }], answer:[4], display:"4 maximums",
            wrong:[
              { v:[3], fb:"Three full cycles fit, but the maximums are at 0, 2π/3, 4π/3 <strong>and</strong> 2π: both endpoints count." },
              { v:[7], fb:"7 counts the minimums too (π/3, π, 5π/3)." }],
            hints:["What is the period of `y = cos 3x`, and where in its cycle does cosine have its maximum?", "The period is 2π/3. A cosine cycle starts at a maximum, so the maximums are where `3x` is a multiple of 2π: `x = 0`, 2π/3, 4π/3, …", "The maximums are at 0, 2π/3, 4π/3 and 2π: 4 of them, counting both endpoints."] },
          { id:"n3", goal:3, prompt:"Find `k > 0` so that `y = sin kx` repeats every 4 units.",
            boxes:[{ kind:"fracpi", pre:"`k =`" }], answer:[1.5707963267948966], display:"`k = π/2`",
            wrong:[
              { v:[0.5], fb:"With `k = 1/2` the period is 2π ÷ ½ = 4π, about 12.6, not 4. Solve `2π/k = 4`." },
              { v:[25.132741228718345], fb:"That’s 2π × 4. Period = `2π/k`, so `k` = 2π ÷ period." },
              { v:[6.283185307179586], fb:"`k = 2π` gives a period of 1." }],
            hints:["Period = `2π/k`. Here the period is 4.", "Solve `2π/k = 4` for `k`.", "`k` = 2π ÷ 4 = π/2. Enter 1/2 and turn on × π."] },
          { id:"n4", goal:3, prompt:"`y = sin[k(x - π/6)]`, with `k > 0`, completes exactly 3 cycles from `x = π/6` to `x = 7π/6`. Find `k`.",
            boxes:[{ kind:"fracpi", pre:"`k =`" }], answer:[6], display:"`k = 6`",
            wrong:[
              { v:[3], fb:"3 cycles fit in a length of π, not 2π, so each cycle is π/3 long and `k` = 2π ÷ (π/3)." },
              { v:[2], fb:"`k = 2` gives one cycle in that interval." },
              { v:[1.0471975511965976], fb:"π/3 is the period. `k` = 2π ÷ period." }],
            hints:["How long is the interval from π/6 to 7π/6?", "It’s π long, and 3 cycles fit in it, so one cycle is π/3.", "Period π/3 means `k` = 2π ÷ (π/3) = 6."] },
          { id:"n5", goal:[4, 3], prompt:"Write `y = 2 cos(π/3 - 2x)` in the form `y = 2 cos[k(x - d)]` with `k > 0` and 0 ≤ `d` < period. Enter `k` and `d`.",
            boxes:[{ kind:"num", pre:"`k =`", name:"`k`" }, { kind:"pi", pre:"`d =`", name:"`d`" }], answer:[2, 0.16666666666666666], display:"`k = 2` and `d = π/6`",
            wrong:[
              { box:0, v:-2, fb:"The form asks for `k > 0`. Cosine is even, so `cos(π/3 - 2x) = cos(2x - π/3)`." },
              { box:1, v:0.3333333333333333, fb:"Factor first: `2x - π/3 = 2(x - π/6)`." },
              { box:1, v:0.6666666666666666, fb:"That multiplies π/3 by 2. Factoring out 2 divides it by 2." },
              { box:1, v:-0.16666666666666666, fb:"`2x - π/3 = 2(x - π/6)`, so `d = +π/6`. Also, `d` must be at least 0." }],
            hints:["Cosine is even: `cos(-θ) = cos θ`. Use it to make the coefficient of `x` positive.", "`cos(π/3 - 2x) = cos(2x - π/3)`. Now factor out the 2.", "`2x - π/3 = 2(x - π/6)`, so `k = 2` and `d = π/6`, which is between 0 and the period, π."] },
          { id:"n6", goal:[1, 6], prompt:"`y = a sin x + c` has a maximum value of 7, passes through (0, 3), and is going <strong>down</strong> as it passes `x = 0`. Find `a` and `c`.",
            boxes:[{ kind:"num", pre:"`a =`", name:"`a`" }, { kind:"num", pre:"`c =`", name:"`c`" }], answer:[-4, 3], display:"`a = -4` and `c = 3`",
            wrong:[
              { box:0, v:4, fb:"With `a > 0` a sine wave goes up as it crosses its axis at `x = 0`. Going down needs `a < 0`." },
              { box:1, v:7, fb:"7 is the maximum. At `x = 0`, `sin 0 = 0`, so `y = c = 3`." },
              { box:0, v:7, fb:"The amplitude is the maximum minus the axis: 7 − 3 = 4." }],
            hints:["At `x = 0`, `sin 0 = 0`, so `y = c`. What does the point (0, 3) tell you?", "`c = 3`. The maximum is the axis plus the amplitude, so `|a|` = 7 − 3 = 4.", "Going down at `x = 0` means the wave is upside down: `a = -4` and `c = 3`."] },
          { id:"n7", goal:[4, 6], prompt:"The graph of `y = sin(3x + π/4)` is the graph of `y = sin(3x - π/2)` translated horizontally. Find the smallest translation: how far, and which way?",
            boxes:[{ kind:"pi", pre:"Distance:", name:"the distance" }, { kind:"dir", pre:"Direction:", name:"the direction" }], answer:[0.25, "L"], display:"π/4 to the left",
            wrong:[
              { v:[0.75, "L"], fb:"That compares π/4 and −π/2 before factoring. Factor both: `3(x + π/12)` and `3(x - π/6)`. The starts are −π/12 and π/6." },
              { v:[0.25, "R"], fb:"From π/6 to −π/12 is a move to the left." },
              { v:[0.4166666666666667, "R"], fb:"That translation works too (π/4 left plus one period, 2π/3), but it isn’t the smallest." }],
            hints:["Factor the inside of each equation to find where each cycle starts.", "`3x - π/2 = 3(x - π/6)` starts at π/6; `3x + π/4 = 3(x + π/12)` starts at −π/12.", "From π/6 to −π/12 is π/6 + π/12 = π/4 to the left. (Going right instead takes 2π/3 − π/4 = 5π/12, which is longer.)"] },
          { id:"n8", goal:[5, 6], prompt:"`y = sin(kx - π/2)`, with `k > 0`, has its first maximum to the right of the `y`-axis at `x = π/3`. Find `k`.",
            boxes:[{ kind:"frac", pre:"`k =`" }], answer:[3], display:"`k = 3`",
            wrong:[
              { v:[1.5], fb:"`kx - π/2 = 0` at `x = π/3` makes π/3 the <strong>start</strong> of the cycle, on the axis. The maximum is where the inside is π/2." },
              { v:[4.5], fb:"That’s where the inside is π: back on the axis." },
              { v:[6], fb:"That puts the inside at 3π/2 at `x = π/3`: a minimum." }],
            hints:["Sine reaches its maximum when its inside equals π/2.", "Set `kx - π/2 = π/2` with `x = π/3`. (With `k > 0`, the maximums where the inside is π/2 + 2π, π/2 + 4π, … come later, and the one where it’s π/2 − 2π is at a negative `x`, so the first maximum to the right of the `y`-axis is where the inside is π/2.)", "`k(π/3) = π`, so `k = 3`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the Wave tuner, especially about how `k` and `d` behave compared with `a` and `c`?" },
      { id:"j2", q:"In your own words, why does a bigger `k` make the period shorter?" },
      { id:"j3", q:"Explain to a friend how to find the phase shift of `y = 3 cos(2x + π/2) - 1`, and where one cycle starts and ends." },
      { id:"j4", q:"Which feature do you still find hardest to read from an equation, and what will you do to practise it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What are the amplitude and period of `y = -4 cos 3x + 2`?",
          options:[
            { t:"Amplitude −4, period 2π/3", why:"Amplitude is a distance, so it’s never negative: `|-4| = 4`. The minus sign means a reflection." },
            { t:"Amplitude 4, period 2π/3", ok:true, why:"Amplitude `|a| = |-4| = 4`, and period `2π/|k|` = 2π/3." },
            { t:"Amplitude 4, period 6π", why:"6π is 2π × 3. `k = 3` makes the wave repeat three times as often, so the period is 2π ÷ 3." },
            { t:"Amplitude 6, period 2π/3", why:"6 is the maximum value, 2 + 4. Amplitude is the distance from the axis to the maximum: 4." }] },
        b:{ prompt:"What are the amplitude and period of `y = -2 sin 4x + 1`?",
          options:[
            { t:"Amplitude −2, period π/2", why:"Amplitude is a distance, so it’s never negative: `|-2| = 2`. The minus sign means a reflection." },
            { t:"Amplitude 2, period π/2", ok:true, why:"Amplitude `|a| = |-2| = 2`, and period `2π/|k|` = 2π/4 = π/2." },
            { t:"Amplitude 2, period 8π", why:"8π is 2π × 4. A bigger `k` gives a shorter period: 2π ÷ 4." },
            { t:"Amplitude 3, period π/2", why:"3 is the maximum value, 1 + 2. Amplitude is the distance from the axis to the maximum: 2." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"What is the phase shift of `y = cos(4x + π/2)`?",
          options:[
            { t:"π/8 to the left", ok:true, why:"`4x + π/2 = 4(x + π/8)`, so `d = -π/8`: a shift of π/8 to the left." },
            { t:"π/8 to the right", why:"`x + π/8 = x - (-π/8)`, so `d` is negative: the shift is to the left." },
            { t:"π/2 to the left", why:"That reads the shift before factoring. `4x + π/2 = 4(x + π/8)`: divide π/2 by 4." },
            { t:"2π to the left", why:"That multiplies π/2 by 4. Factoring out 4 divides each term by 4." }] },
        b:{ prompt:"What is the phase shift of `y = sin(2x - 5π/6)`?",
          options:[
            { t:"5π/12 to the right", ok:true, why:"`2x - 5π/6 = 2(x - 5π/12)`, so `d = 5π/12`: right." },
            { t:"5π/12 to the left", why:"`x - 5π/12` means the inside is 0 at `x = +5π/12`: a shift right." },
            { t:"5π/6 to the right", why:"Factor first: `2x - 5π/6 = 2(x - 5π/12)`: divide 5π/6 by 2." },
            { t:"5π/3 to the right", why:"That multiplies 5π/6 by 2. Factoring out 2 divides each term by 2." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"What is the range of `y = -5 sin 2x + 1`?",
          options:[
            { t:"`{y ∈ ℝ | -6 ≤ y ≤ 4}`", why:"That shifts down 1 instead of up. The “+ 1” outside raises the wave." },
            { t:"`{y ∈ ℝ | -5 ≤ y ≤ 5}`", why:"That ignores `c = 1`: the whole wave is shifted up 1." },
            { t:"`{y ∈ ℝ | -4 ≤ y ≤ 6}`", ok:true, why:"The axis is `y = 1` and the amplitude is `|-5| = 5`, so the wave runs from 1 − 5 = −4 to 1 + 5 = 6. The reflection doesn’t change the range." },
            { t:"`{y ∈ ℝ | 1 ≤ y ≤ 6}`", why:"That runs from the axis to the maximum. The wave goes as far below its axis as above it." }] },
        b:{ prompt:"What is the range of `y = -2 cos(x/2) + 3`?",
          options:[
            { t:"`{y ∈ ℝ | -5 ≤ y ≤ -1}`", why:"That shifts down 3 instead of up. The “+ 3” outside raises the wave." },
            { t:"`{y ∈ ℝ | -2 ≤ y ≤ 2}`", why:"That ignores `c = 3`." },
            { t:"`{y ∈ ℝ | 1 ≤ y ≤ 5}`", ok:true, why:"The axis is `y = 3` and the amplitude is `|-2| = 2`: from 1 to 5. The reflection doesn’t change the range." },
            { t:"`{y ∈ ℝ | 3 ≤ y ≤ 5}`", why:"That runs from the axis to the maximum. The wave also goes 2 below its axis." }] } },
      { id:"t1", cat:"T", goal:5,
        a:{ prompt:"Where is the first maximum to the right of the `y`-axis on the graph of `y = 4 sin(2x - π/4) - 1`?",
          options:[
            { t:"`x = π/8`", why:"π/8 is where the cycle starts. For sine, that’s on the axis going up; the maximum is a quarter period later." },
            { t:"`x = 3π/8`", ok:true, why:"`2x - π/4 = 2(x - π/8)`: the cycle starts at π/8 and the period is π. Sine peaks a quarter period after the start: π/8 + π/4 = 3π/8." },
            { t:"`x = π/2`", why:"That adds a quarter period to π/4, the shift before factoring. Factor first: the cycle starts at π/8." },
            { t:"`x = 3π/4`", why:"That’s π/4 + π/2: it ignores `k` altogether. With `k = 2` the cycle starts at π/8 and a quarter period is π/4, not π/2." }] },
        b:{ prompt:"Where is the first maximum to the right of the `y`-axis on the graph of `y = 3 cos(2x + π/6) - 2`?",
          options:[
            { t:"`x = π/12`", why:"That moves the start the wrong way: the inside is 0 at `x = -π/12`, not +π/12. At `x = π/12` the inside is π/3, so `y` = 3(1/2) − 2 = −1/2, not the maximum." },
            { t:"`x = π/6`", why:"That uses the sine pattern, a quarter period after the start: −π/12 + π/4 = π/6. At π/6 the inside is π/2, so the wave is on its axis: `y = -2`. Cosine is at its maximum where the inside is 0." },
            { t:"`x = 5π/6`", why:"That starts the cycle at −π/6, the shift before factoring, then adds a period. Factor first: `2x + π/6 = 2(x + π/12)`." },
            { t:"`x = 11π/12`", ok:true, why:"`2x + π/6 = 2(x + π/12)`: the cycle starts at −π/12 with a maximum, because it’s cosine, and the period is π. The next maximum is at −π/12 + π = 11π/12." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"The graph of `y = 4 sin[k(x - d)] + 3`, with `k > 0`, has a maximum at `x = 1` and its next minimum at `x = 5`. What is `k`?",
          options:[
            { t:"π/8", why:"That treats the 4 units from the maximum to the minimum as a quarter period, so the period would be 16. From a maximum to the next minimum is half a period." },
            { t:"π/4", ok:true, why:"From a maximum to the next minimum is half a period, so the period is 2 × (5 − 1) = 8. Then `k` = 2π ÷ 8 = π/4." },
            { t:"4/π", why:"That’s period ÷ 2π = 8 ÷ 2π, the formula upside down. `k` = 2π ÷ period." },
            { t:"π/2", why:"That treats the 4 units as a whole period. From a maximum to the next minimum is only half a cycle, so the period is 8." }] },
        b:{ prompt:"The graph of `y = 2 cos[k(x - d)] - 1`, with `k > 0`, has a minimum at `x = -1` and its next maximum at `x = 4`. What is `k`?",
          options:[
            { t:"π/10", why:"That treats the 5 units from the minimum to the maximum as a quarter period, so the period would be 20. From a minimum to the next maximum is half a period." },
            { t:"π/5", ok:true, why:"From a minimum to the next maximum is half a period, so the period is 2 × (4 − (−1)) = 10. Then `k` = 2π ÷ 10 = π/5." },
            { t:"2π/5", why:"That treats the 5 units as a whole period. From a minimum to the next maximum is only half a cycle, so the period is 10." },
            { t:"5/π", why:"That’s period ÷ 2π = 10 ÷ 2π, the formula upside down. `k` = 2π ÷ period." }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"The point (π/2, 1) is on the graph of `y = sin x`. Where does it land on the graph of `y = 3 sin[2(x + π/4)] - 2`?",
          options:[
            { t:"(0, 1)", ok:true, why:"`(x, y) -> (x/k + d, ay + c)` with `k = 2`, `d = -π/4`, `a = 3`, `c = -2`: `x` = π/4 − π/4 = 0 and `y` = 3 − 2 = 1." },
            { t:"(π/8, 1)", why:"That shifts before dividing: (π/2 − π/4) ÷ 2. Divide by `k` first, then shift: π/2 ÷ 2 − π/4 = 0." },
            { t:"(π/2, 1)", why:"That shifts the wrong way: π/4 + π/4. `x + π/4` means `d = -π/4`, a shift left." },
            { t:"(3π/4, 1)", why:"That multiplies by `k`: π/2 × 2 − π/4. A horizontal compression divides `x`-values by `k`." }] },
        b:{ prompt:"The point (π, −1) is on the graph of `y = cos x`. Where does it land on the graph of `y = 2 cos[2(x - π/6)] + 4`?",
          options:[
            { t:"(π/3, 2)", why:"That shifts the wrong way: π/2 − π/6. `x - π/6` means a shift right." },
            { t:"(7π/12, 2)", why:"That shifts before dividing: (π + π/6) ÷ 2. Divide first: π/2 + π/6 = 2π/3." },
            { t:"(2π/3, 2)", ok:true, why:"`x` = π/2 + π/6 = 2π/3 and `y` = 2(−1) + 4 = 2." },
            { t:"(13π/6, 2)", why:"That multiplies by `k`: 2π + π/6. A compression divides `x`-values by 2." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which describes how to get the graph of `y = 2 cos[3(x - π/4)]` from the graph of `y = cos x`?",
          options:[
            { t:"Stretch vertically by a factor of 2, compress horizontally by a factor of 1/3, then translate π/4 to the right.", ok:true, why:"`a = 2` stretches, `k = 3` compresses by 1/3, and `d = π/4` shifts right, with the stretches first." },
            { t:"Stretch vertically by a factor of 2, stretch horizontally by a factor of 3, then translate π/4 to the right.", why:"`k = 3` squeezes the wave: the horizontal factor is `1/k` = 1/3, a compression." },
            { t:"Stretch vertically by a factor of 2, compress horizontally by a factor of 1/3, then translate 3π/4 to the right.", why:"`d` is the number inside the factored brackets, π/4. 3π/4 is `kd`." },
            { t:"Stretch vertically by a factor of 2, compress horizontally by a factor of 1/3, then translate π/4 to the left.", why:"`x - π/4` shifts right." }] },
        b:{ prompt:"Which describes how to get the graph of `y = -3 sin[½(x + π/3)]` from the graph of `y = sin x`?",
          options:[
            { t:"Stretch vertically by a factor of 3 and reflect in the `x`-axis, stretch horizontally by a factor of 2, then translate π/3 to the left.", ok:true, why:"`a = -3` stretches and reflects, `k = 1/2` stretches by `1/k` = 2, and `d = -π/3` shifts left." },
            { t:"Stretch vertically by a factor of 3 and reflect in the `x`-axis, compress horizontally by a factor of 1/2, then translate π/3 to the left.", why:"`k = 1/2` makes the wave wider: a stretch by a factor of 2." },
            { t:"Stretch vertically by a factor of 3 and reflect in the `x`-axis, stretch horizontally by a factor of 2, then translate π/6 to the left.", why:"π/6 is `kd`. The shift is the number inside the factored brackets, π/3." },
            { t:"Stretch vertically by a factor of 3 and reflect in the `x`-axis, stretch horizontally by a factor of 2, then translate π/3 to the right.", why:"`x + π/3` shifts left." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"A student says the graphs of `y = cos(2x - π)` and `y = cos[2(x - π)]` are the same. Which response is correct and best explained?",
          options:[
            { t:"No. `2x - π = 2(x - π/2)`, so the first graph is `y = cos 2x` shifted π/2 right. The second is shifted π right, which is a whole period, so it’s just `y = cos 2x`.", ok:true, why:"This factors the first equation and uses the period, π, to explain the second." },
            { t:"Yes. Both have `k = 2` and a shift of π to the right.", why:"In `cos(2x - π)` the π hasn’t been divided by 2. Factored, its shift is π/2." },
            { t:"No. The first is shifted π right and the second is shifted 2π right.", why:"The first is shifted π/2 (factor out the 2); the second is shifted π, the number inside its brackets." },
            { t:"Yes. Shifting a cosine graph by π never changes it.", why:"A shift of π turns `y = cos x` upside down. What matters here is the period of `y = cos 2x`, which is π: only the second graph is shifted by a whole period." }] },
        b:{ prompt:"A student says the graphs of `y = cos(4x + π)` and `y = cos[4(x + π)]` are the same. Which response is correct and best explained?",
          options:[
            { t:"No. `4x + π = 4(x + π/4)`, so the first graph is `y = cos 4x` shifted π/4 left. The second is shifted π left, which is two whole periods, so it’s just `y = cos 4x`.", ok:true, why:"This factors the first equation and uses the period, π/2, to explain the second." },
            { t:"Yes. Both have `k = 4` and a shift of π to the left.", why:"Factored, the first is `4(x + π/4)`: a shift of π/4." },
            { t:"No. The first is shifted π left and the second is shifted 4π left.", why:"The first is shifted π/4; the second is shifted π, the number inside its brackets." },
            { t:"Yes. Shifting a cosine graph by π never changes it.", why:"A shift of π turns `y = cos x` upside down. The period of `y = cos 4x` is π/2, so a shift of π is two periods, but a shift of π/4 is only half of one." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A buoy on Georgian Bay rises and falls with the waves. Its height above the lake bottom is `h(t) = 0.8 sin[(π/3)(t - 1)] + 2` metres, `t` seconds after a timer starts. What is the buoy’s greatest height, and when does it first reach that height after the timer starts?",
          options:[
            { t:"0.8 m, at `t` = 2.5 s", why:"0.8 m is the amplitude: how far the buoy rises above its middle height. The greatest height is 2 + 0.8 = 2.8 m." },
            { t:"2.8 m, at `t` = 0.5 s", why:"That starts the cycle at `t = -1`. `t - 1` means the cycle starts at `t = 1`, so the first peak is a quarter period later: 1 + 1.5 = 2.5 s." },
            { t:"2.8 m, at `t` = 1 s", why:"At `t = 1` the inside is 0: the buoy is at its middle height, 2 m, on the way up. Sine peaks a quarter period after the start of its cycle." },
            { t:"2.8 m, at `t` = 2.5 s", ok:true, why:"Greatest height `c + |a|` = 2 + 0.8 = 2.8 m. The period is 2π ÷ (π/3) = 6 s, so a quarter period is 1.5 s. The cycle starts at `t = 1` on its axis, going up, so the first peak is at 1 + 1.5 = 2.5 s." }] },
        b:{ prompt:"A marked paddle on a slowly turning water wheel at a heritage mill is at height `h(t) = 1.5 sin[(π/6)(t - 1)] + 2` metres above the riverbed, `t` seconds after a timer starts. What is the paddle’s greatest height, and when does it first reach that height after the timer starts?",
          options:[
            { t:"1.5 m, at `t` = 4 s", why:"1.5 m is the amplitude: how far the paddle rises above the axle’s height. The greatest height is 2 + 1.5 = 3.5 m." },
            { t:"3.5 m, at `t` = 1 s", why:"At `t = 1` the inside is 0: the paddle is at its middle height, 2 m, on the way up. Sine peaks a quarter period after the start of its cycle." },
            { t:"3.5 m, at `t` = 2 s", why:"That starts the cycle at `t = -1`. `t - 1` means the cycle starts at `t = 1`, so the first peak is a quarter period later: 1 + 3 = 4 s." },
            { t:"3.5 m, at `t` = 4 s", ok:true, why:"Greatest height `c + |a|` = 2 + 1.5 = 3.5 m. The period is 2π ÷ (π/6) = 12 s, so a quarter period is 3 s. The cycle starts at `t = 1` on its axis, going up, so the first peak is at 1 + 3 = 4 s." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"The temperature in a greenhouse is `T(t) = 4 cos[(π/12)(t - 15)] + 22` degrees Celsius, `t` hours after midnight. At what time of day is it coolest, and what is the temperature then?",
          options:[
            { t:"3:00 a.m., 18 °C", ok:true, why:"Cosine is at its maximum where the inside is 0, at `t = 15` (3:00 p.m.). The period is 2π ÷ (π/12) = 24 h, so the minimum comes half a period, 12 h, from 3:00 p.m.: 3:00 a.m. The temperature is 22 − 4 = 18 °C." },
            { t:"3:00 a.m., 14 °C", why:"The time is right, but 14 = 22 − 8 subtracts the whole height from maximum to minimum. The minimum is the axis minus the amplitude: 22 − 4." },
            { t:"9:00 a.m., 18 °C", why:"9:00 a.m. is a quarter period from 3:00 p.m.: the temperature is crossing its axis, 22 °C. The minimum is half a period from the maximum." },
            { t:"3:00 p.m., 18 °C", why:"At 3:00 p.m. the inside is 0, where cosine is at its <strong>maximum</strong>: 26 °C." }] },
        b:{ prompt:"The oxygen level in a pond is `L(t) = 3 cos[(π/12)(t - 14)] + 9` milligrams per litre, `t` hours after midnight. At what time of day is it lowest, and what is the level then?",
          options:[
            { t:"2:00 a.m., 6 mg/L", ok:true, why:"The maximum is at `t = 14` (2:00 p.m.). The period is 24 h, so the minimum is 12 h away, at 2:00 a.m. The level is 9 − 3 = 6 mg/L." },
            { t:"2:00 a.m., 3 mg/L", why:"3 = 9 − 6 subtracts the whole height. The minimum is 9 − 3." },
            { t:"8:00 a.m., 6 mg/L", why:"8:00 a.m. is a quarter period from 2:00 p.m.: the level is on its axis, 9 mg/L." },
            { t:"2:00 p.m., 6 mg/L", why:"At 2:00 p.m. the inside is 0: cosine’s <strong>maximum</strong>, 12 mg/L." }] } }
    ]
  },
  task:{
    title:"Wave to order", summary:"Wave to order",
    statement:"<p>Build a wave in <strong>expanded form</strong>, `y = @a{a} sin(@k{k}x + b) + @c{c}` or `y = @a{a} cos(@k{k}x + b) + @c{c}`, that rises as high as 7, falls as low as 1, repeats every π, and has a <strong>maximum at `x = π/3`</strong>. There are four designs with −π < `b` ≤ π. Can you find them all?</p>",
    checks:["Rises as high as 7", "Falls as low as 1", "Repeats every π", "Has a maximum at `x = π/3`"],
    tips:[
      "Your wave’s highest value is `c + |a|` = {v}. It needs to be 7.",
      "Your wave’s lowest value is `c - |a|` = {v}. It needs to be 1. The axis is halfway between 7 and 1, and the amplitude is half the gap.",
      "Your wave repeats every `2π/k` = {v}. For a period of π, solve `2π/k = π`.",
      "At `x = π/3` your wave is at {v}, not at its maximum. Work out the inside, `k(π/3) + b`. Cosine with `a > 0` peaks where the inside is 0; sine with `a > 0` where it’s π/2; cosine with `a < 0` where it’s π; sine with `a < 0` where it’s 3π/2. Then solve for `b`."
    ],
    bRange:"Keep `b` between −π (not included) and π.",
    invalid:"Fill in every box: `a` from −6 to 6 in steps of 1/2 (not 0), `k` as a fraction `p/q` with whole numbers from 1 to 12, `b` as a whole number over the chosen denominator, and `c` from −6 to 6 in steps of 1/2.",
    wide:"Your wave goes outside the band from −1 to 9, so the window has widened to −12.5 ≤ `y` ≤ 12.5.",
    explainPrompt:"Choose one of your designs. Explain how you found `b`, and state the wave’s phase shift.",
    vocab:"Use the words amplitude, axis, period, phase shift and factor.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another?",
    allFour:"You found all four, one for each starting pattern. Look at the factored forms: each phase shift is π/3 minus the distance from that pattern’s start to its maximum: 0 for cosine, a quarter period for sine, half a period for upside-down cosine and three quarters of a period for upside-down sine."
  },
  cards:[
    [FORM, "`@a{a}`: amplitude `|a|` (and a flip if `a < 0`). `@k{k}`: period `2π/|k|`. `@d{d}`: phase shift. `@c{c}`: axis `y = c`. The cosine version works the same way."],
    ["Amplitude", "`|a|`: half the distance from the maximum to the minimum. Never negative: `y = -6 sin x` has amplitude 6."],
    ["Period", "`2π/|k|`. A bigger `k` gives a shorter period: `sin 5x` has period 2π/5, and `sin(x/2)` has period 4π."],
    ["Phase shift", "`d` in `k(x - d)`: to the right when `d > 0`, to the left when `d < 0`. `y = cos(x + π/4)` is shifted π/4 to the left."],
    ["Factor first", "`sin(2x - π/3) = sin[2(x - π/6)]`, so the phase shift is π/6, not π/3."],
    ["Axis, maximum and minimum", "Axis `y = c`; maximum `c + |a|`; minimum `c - |a|`. For `y = 3 sin 2x - 1`: axis `y = -1`, maximum 2, minimum −4."],
    ["Domain and range", "Domain `{x ∈ ℝ}`. Range `{y ∈ ℝ | c - |a| ≤ y ≤ c + |a|}`."],
    ["Horizontal stretch or compression", "By a factor of `1/|k|`. `k = 2` compresses by a factor of 1/2; `k = 1/3` stretches by a factor of 3."],
    ["The five key points of a cycle", "Start at `x = d` and step a quarter period, `P/4`: `x = d`, `d + P/4`, `d + P/2`, `d + 3P/4`, `d + P`."],
    ["Sine and cosine cycle patterns", "Sine: axis, max, axis, min, axis. Cosine: max, axis, min, axis, max. A negative `a` swaps max and min."],
    ["Mapping rule", "A point `(x, y)` on the parent moves to `(x/k + d, ay + c)`. Divide by `k` first, then shift."],
    ["When `k` contains π", "`y = sin(πx/10)` has `k = π/10` and period 2π ÷ (π/10) = 20. The π’s cancel, so the period is a whole number."]
  ]
};
