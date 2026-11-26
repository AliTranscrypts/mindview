// MCV4U 15 Velocity and Acceleration. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/15-velocity-and-acceleration.md
// misconception core sentences (plan §3), reused where the plan tags an option with M1–M7
const M1 = "Compare signs: `v` and `a` the same sign means speeding up; opposite signs means slowing down.";
const M2 = "Speed is `|v|`. Going from −3 to −5 m/s is speeding up.";
const M3 = "Split the trip where `v = 0` and add the length of every leg.";
const M4 = "At rest means `v = 0`. `s = 0` is a place; `a = 0` is about the velocity not changing.";
const M5 = "At the top `v = 0`, but gravity still acts: `a = -10` m/s².";
const M6 = "The graph plots position against time. The object moves along a straight line.";
// hero equation: s in --pen, v in teal --f3, a in magenta --f4, units under each (built by hand so each term carries its colour)
const HERO_EQ = '<span class="va-heq">' +
  '<span class="va-ht va-hs"><span class="va-hm">`s(t)`</span><span class="va-u">m</span></span>' +
  '<span class="va-arr" aria-hidden="true">→</span>' +
  '<span class="va-ht va-hv"><span class="va-hm">`v(t) = s′(t)`</span><span class="va-u">m/s</span></span>' +
  '<span class="va-arr" aria-hidden="true">→</span>' +
  '<span class="va-ht va-ha"><span class="va-hm">`a(t) = v′(t) = s″(t)`</span><span class="va-u">m/s²</span></span></span>';
// Practice 1 thumbnails: drawn by app.figures (st1–st8 for s–t, vt1–vt8 for v–t)
const TH = (k, aria) => '<span class="va-th"><canvas class="plot va-thc" data-fig="' + k + '" role="img" aria-label="' + aria + '"></canvas></span>';

export default {
  id:"15-velocity-and-acceleration",
  kind:"topic",
  title:"Velocity and acceleration",
  topic:"Velocity and Acceleration",
  readyTopic:"velocity and acceleration",
  hero:{
    eq:HERO_EQ,
    eqLabel:"s of t, in metres; then v of t equals s prime of t, in metres per second; then a of t equals v prime of t equals s double prime of t, in metres per second squared",
    eqSize:"sm",
    headline:"Position, velocity, acceleration: one derivative apart",
    text:"For an object moving along a line, the derivative of <strong>position</strong> is <strong>velocity</strong>, and the derivative of velocity is <strong>acceleration</strong>. The signs tell the story: which way it’s moving, when it’s <strong>at rest</strong>, and whether it’s <strong>speeding up</strong> or <strong>slowing down</strong>.",
    fig:{ aria:"A dot moves along a horizontal track following s(t) = t³ − 6t² + 9t: right to 4 m, back to 0, then right again. A teal velocity arrow above it shrinks, flips and grows; a magenta acceleration arrow flips at t = 2.", shape:"wide" }
  },
  goals:[
    "I can find velocity and acceleration from a position function, with correct units.",
    "I can interpret the sign of `v` (direction), `v = 0` (at rest) and speed = `|v|`.",
    "I can decide when an object is speeding up or slowing down by comparing the signs of `v` and `a`.",
    "I can find the total distance travelled over an interval, splitting it where the direction changes.",
    "I can solve vertical motion problems: maximum height, time in the air and impact velocity.",
    "I can connect `s`–`t`, `v`–`t` and `a`–`t` graphs."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Derivatives", goal:1, prompt:"`s(t) = t^3 - 6t^2 + 9t`. Find `s′(t)`.",
          options:[
            { t:"`3t^2 - 12t + 9`", ok:true, why:"Term by term." },
            { t:"`3t^2 - 12t`", why:"`9t` has derivative 9." },
            { t:"`t^2 - 6t + 9`", why:"Bring each exponent down." },
            { t:"`3t^2 - 12t + 9t`", why:"`9t -> 9`." }],
          hints:["Power rule.", "`3t^2`, `-12t`, 9.", "`3t^2 - 12t + 9`."] },
        { id:"w2", skill:"Derivatives", goal:1, prompt:"`f(t) = -5t^2 + 20t + 3`. Find `f″(t)`.",
          options:[
            { t:"−10", ok:true, why:"`f′ = -10t + 20`, then −10." },
            { t:"`-10t + 20`", why:"Differentiate again." },
            { t:"−5", why:"`-5 · 2 = -10`." },
            { t:"0", why:"`f″` is the second derivative." }],
          hints:["Find `f′` first.", "`f′ = -10t + 20`.", "`f″ = -10`."] },
        { id:"w3", skill:"Solving quadratics", goal:2, prompt:"Solve `3t^2 - 12t + 9 = 0`.",
          options:[
            { t:"`t = 1` or `t = 3`", ok:true, why:"`3(t - 1)(t - 3) = 0`." },
            { t:"`t = -1` or `t = -3`", why:"`t - 1 = 0` at `t = 1`." },
            { t:"`t = 3` only", why:"Both factors can be 0." },
            { t:"`t = 1` or `t = 9`", why:"Factor out 3 first: `t^2 - 4t + 3`." }],
          hints:["Common factor 3.", "`t^2 - 4t + 3 = (t - 1)(t - 3)`.", "1 or 3."] },
        { id:"w4", skill:"Solving quadratics", goal:5, prompt:"Solve `-5t^2 + 20t + 25 = 0` for `t ≥ 0`.",
          options:[
            { t:"`t = 5`", ok:true, why:"`-5(t - 5)(t + 1) = 0`; `t = -1` is rejected." },
            { t:"`t = -1` or `t = 5`", why:"The question says `t ≥ 0`." },
            { t:"`t = 1` or `t = -5`", why:"`t - 5 = 0` at 5." },
            { t:"`t = 2`", why:"That’s where the height is greatest, not where it’s 0." }],
          hints:["Divide by −5.", "`t^2 - 4t - 5 = (t - 5)(t + 1)`.", "`t = 5`."] },
        { id:"w5", skill:"Rates and units", goal:1, prompt:"A cyclist is at 20 m when `t = 2` s and at 50 m when `t = 8` s. What is the average velocity?",
          options:[
            { t:"5 m/s", ok:true, why:"(50 − 20)/(8 − 2) = 30/6." },
            { t:"30 m/s", why:"30 m is the change in position." },
            { t:"6.25 m/s", why:"Use changes: `Δs/Δt`." },
            { t:"10 m/s", why:"Use both readings." }],
          hints:["`Δs/Δt`.", "30/6.", "5 m/s."] },
        { id:"w6", skill:"Rates and units", goal:1, prompt:"`s` is in metres and `t` in seconds. What are the units of `s″(t)`?",
          options:[
            { t:"m/s²", ok:true, why:"Metres per second, per second." },
            { t:"m/s", why:"That’s `s′`." },
            { t:"m", why:"That’s `s`." },
            { t:"m²/s", why:"Differentiating divides by a time unit; it doesn’t square metres." }],
          hints:["Each derivative with respect to `t` divides the units by s.", "m → m/s → ?", "m/s²."] }
      ],
      refreshers:{
        "Derivatives":"Use the power rule term by term. For `f″`, differentiate twice.",
        "Solving quadratics":"Factor out any common factor, then set each factor to 0. In motion problems, reject negative times.",
        "Rates and units":"Average rate = `Δs/Δt`. Units divide: m per s, then m/s per s = m/s²."
      }
    }
  },
  explore:{
    heading:"Motion simulator",
    intro:"Play the motion and watch the dot on its track and the three graphs at once. The readout names what’s happening at every moment.",
    motions:[
      { id:"M1", chip:"`s = t^3 - 6t^2 + 9t`", eq:"`s(t) = t^3 - 6t^2 + 9t`, `0 ≤ t ≤ 4.5`", plain:"s(t) = t³ − 6t² + 9t" },
      { id:"M2", chip:"`s = t^2 - 8t + 12`", eq:"`s(t) = t^2 - 8t + 12`, `0 ≤ t ≤ 8`", plain:"s(t) = t² − 8t + 12" },
      { id:"M3", chip:"vertical `h = -5t^2 + 20t + 25`", eq:"`h(t) = -5t^2 + 20t + 25`, `0 ≤ t ≤ 5` (vertical: height above the ground)", plain:"h(t) = −5t² + 20t + 25" },
      { id:"M4", chip:"`s = t^3 - 12t^2 + 45t`", eq:"`s(t) = t^3 - 12t^2 + 45t`, `0 ≤ t ≤ 7`", plain:"s(t) = t³ − 12t² + 45t" },
      { id:"B", chip:"Build", eq:"`s(t) = t^3 + bt^2 + ct`, `0 ≤ t ≤ 6`", plain:"s(t) = t³ + bt² + ct" }
    ],
    modes:[{ id:"track", t:"Track" }, { id:"graphs", t:"Graphs" }, { id:"sign", t:"Sign chart" }],
    modeHow:{
      track:"The dot moves on its track, leaving a ghost trail. The teal arrow is the velocity `v` (its length grows with the speed); the magenta arrow is the acceleration `a`.",
      graphs:"Linked `s`–`t`, `v`–`t` and `a`–`t` graphs share one time probe. Tap a graph to move the time.",
      sign:"Sign chart of `v` and `a` on the motion’s interval. Fill in the motion row (speeding up or slowing down) for each interval, then press Reveal."
    },
    toggles:[{ id:"trail", t:"Trail" }, { id:"varr", t:"Velocity arrow" }, { id:"aarr", t:"Acceleration arrow" }],
    rows:{ time:"Time", pos:"Position", vel:"Velocity", speed:"Speed", acc:"Acceleration", dir:"Direction", spd:"Speed is…", since:"Since `t = 0`" },
    predIntro:"Make a prediction first. Then the simulator shows you what really happens.",
    predictions:[
      { id:"p1", mo:"M1", prompt:"M1. At `t = 1.5` s the acceleration is −3 m/s². Is the particle speeding up or slowing down?",
        options:[{ t:"speeding up", ok:true }, { t:"slowing down" }, { t:"at rest" }, { t:"moving at constant speed" }],
        explain:"`v(1.5) = -2.25` is negative too. Same signs: speeding up." },
      { id:"p2", mo:"M1", prompt:"M1. When is the particle at rest?",
        options:[{ t:"`t = 1` s and `t = 3` s", ok:true }, { t:"`t = 2` s" }, { t:"`t = 0` s and `t = 3` s" }, { t:"never" }],
        explain:"`v = 3(t - 1)(t - 3) = 0`. At `t = 2` the acceleration is 0, and at `t = 0` and 3 the position is 0; neither means at rest." },
      { id:"p3", mo:"M1", prompt:"M1, played from 0 to 4. The displacement from `t = 0` to `t = 4` is `s(4) - s(0) = 4` m. What’s the total distance?",
        options:[{ t:"12 m", ok:true }, { t:"4 m" }, { t:"8 m" }, { t:"0 m" }],
        explain:"Right 4 m (to `s = 4`), left 4 m (back to 0), right 4 m (to `s = 4`)." },
      { id:"p4", mo:"M3", prompt:"M3, the throw. At the top of the throw, what is the ball’s acceleration?",
        options:[{ t:"−10 m/s²", ok:true }, { t:"0 m/s²" }, { t:"10 m/s²" }, { t:"undefined" }],
        explain:"`a = h″ = -10` the whole time. If `a` were 0 at the top, the ball would hang there." }
    ],
    chalIntro:"Use the simulator to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"M2: set the time when the object is moving left at 4 m/s.",
        why:"`v = 2t - 8 = -4` at `t = 2`: the negative sign means moving left, and the speed is 4 m/s.",
        hints:["Moving left at 4 m/s means `v = -4`.", "`2t - 8 = -4`.", "`t = 2`."],
        msgs:{ mo:"Choose M2 first.", t6:"`v = +4` there: moving right.", t4:"At rest.", other:"Here `v =` {v} m/s. Moving left at 4 m/s means `v = -4`." } },
      { id:"tc2", goal:[2, 3], prompt:"M4: find a time when the particle is moving left <strong>and</strong> speeding up.",
        why:"For `3 < t < 4`, `v < 0` (moving left) and `a < 0`: the same signs, so it’s speeding up.",
        hints:["`v = 3(t - 3)(t - 5)`; `a = 6t - 24`.", "Moving left: `3 < t < 5`. Speeding up needs `a < 0` too.", "`a < 0` when `t < 4`: so `3 < t < 4`."],
        msgs:{ mo:"Choose M4 first.", slow:"Moving left, but `a > 0`: slowing down.", right:"`v > 0`: moving right.", rest:"At rest: `v = 0` here.", a0:"At `t = 4`, `a = 0`: neither speeding up nor slowing down." } },
      { id:"tc3", goal:[2, 3], stretch:true, prompt:"Build: choose `b` and `c` so that the particle is at rest exactly once, at `t = 3`, and never moves left.",
        why:"`b = -9`, `c = 27`: `v = 3t^2 - 18t + 27 = 3(t - 3)^2`, which is 0 only at `t = 3` and never negative.",
        hints:["`v = 3t^2 + 2bt + c` must be 0 only at `t = 3` and never negative.", "So `v` must be `3(t - 3)^2`.", "`3t^2 - 18t + 27`: `b = -9`, `c = 27`."],
        msgs:{ mo:"Choose Build first, then set `b` and `c` with the sliders.", w1:"At rest twice (`t = 1`, 3) and moving left in between.", w2:"At rest at `t = 2` and `t = 4`.", w3:"Never at rest.",
          rest:"Your particle is at rest at {r}.", left:" It moves left on part of the trip.", none:"Your particle is never at rest on `0 ≤ t ≤ 6`." } }
    ]
  },
  part3:{
    slug:"speed", name:"Speeding up?",
    heading:"Speeding up or slowing down?",
    intro:"Explore showed the motion moment by moment. Here you organize it on paper: a sign chart answers “when is it speeding up?” for a whole interval, a leg-by-leg table answers “how far did it go?”, and a vertical throw puts it all together. Then try the quick check.",
    s1:{ title:"Station 1: Two-row sign chart",
      text:"`s(t) = t^3 - 9t^2 + 24t`, `t ≥ 0`, so `v = 3(t - 2)(t - 4)` and `a = 6t - 18`. Place the critical times, mark the signs of `v` and `a`, then fill in the motion row.",
      timesPrompt:"Tap every critical time: where `v = 0` or `a = 0`.",
      candidates:[1, 2, 3, 4, 5, 6],
      answer:{ times:[2, 3, 4], rows:[{ v:1, a:-1, dir:"r", spd:"s" }, { v:-1, a:-1, dir:"l", spd:"u" }, { v:-1, a:1, dir:"l", spd:"s" }, { v:1, a:1, dir:"r", spd:"u" }] },
      rows:[{ iv:"(0, 2)", test:"Test `t = 1`: `v = 9`, `a = -12`." }, { iv:"(2, 3)", test:"Test `t = 2.5`: `v = -2.25`, `a = -3`." },
        { iv:"(3, 4)", test:"Test `t = 3.5`: `v = -2.25`, `a = 3`." }, { iv:"(4, ∞)", test:"Test `t = 5`: `v = 9`, `a = 12`." }],
      fb:{ missA:"`a = 6t - 18` is 0 at `t = 3`, so `a` changes sign there: 3 splits the chart too.", missV:"`v = 3(t - 2)(t - 4)` is 0 at `t = 2` and at `t = 4`.",
        extra:"Neither `v` nor `a` is 0 at {x}.", times:"✓ Critical times 2, 3 and 4. Now fill in the chart.",
        motion:"Moving right when `v > 0`, left when `v < 0`. " + M1, done:"✓ The chart is complete." },
      alg:["`v = 3t^2 - 18t + 24 = 3(t - 2)(t - 4)`, zero at `t = 2` and `t = 4`", "`a = 6t - 18 = 6(t - 3)`, zero at `t = 3`",
        "Same signs on (2, 3) and (4, ∞): speeding up. Opposite signs on (0, 2) and (3, 4): slowing down."] },
    s2:{ title:"Station 2: Distance vs displacement",
      text:"The same motion on [0, 5]. It turns around at `t = 2` and `t = 4`. Fill in the leg table: the positions, each leg’s length, the total distance and the displacement.",
      answer:{ s0:0, s2:20, s4:16, s5:20, l1:20, l2:4, l3:4, dist:28, disp:20 },
      fb:{ pos:"Substitute into `s(t) = t^3 - 9t^2 + 24t`.", leg:"A leg’s length is the size of the change in position: `|s(end) - s(start)|`.",
        dist:M3, disp:"Displacement is `s(5) - s(0)`: where it ends minus where it starts.", done:"✓ Legs 20 + 4 + 4 = 28 m of distance, but the displacement is only `s(5) - s(0) = 20` m: the 4 m back and the 4 m forward cancel." } },
    s3:{ title:"Station 3: A throw from a cliff",
      text:"`h(t) = -5t^2 + 30t + 35`: a ball thrown up from a 35 m cliff, using `g ≈ 10` m/s². Find each answer, then open “Check it with algebra”.",
      answer:{ tt:3, ht:80, tl:7, vi:-40, si:40 },
      groups:[
        { id:"top", title:"The top", boxes:[{ k:"tt", label:"Time of the top", unit:"s" }, { k:"ht", label:"Maximum height", unit:"m" }],
          wrong:[{ k:"ht", v:45, fb:"That’s the rise above the cliff; add the 35 m." }, { k:"ht", v:35, fb:"That’s the height of the cliff, where the ball starts." }],
          hint:"The top is where `v = 0`.", alg:"`v = -10t + 30 = 0` at `t = 3`, `h(3) = 80` m" },
        { id:"land", title:"The landing", boxes:[{ k:"tl", label:"Landing time", unit:"s" }],
          wrong:[{ k:"tl", v:-1, fb:"Reject the negative time: the ball is thrown at `t = 0`." }],
          hint:"It lands where `h = 0`.", alg:"`-5t^2 + 30t + 35 = 0` gives `(t - 7)(t + 1) = 0`, so `t = 7` s" },
        { id:"hit", title:"The impact", boxes:[{ k:"vi", label:"Velocity at impact", unit:"m/s" }, { k:"si", label:"Speed at impact", unit:"m/s" }],
          wrong:[{ k:"vi", v:40, fb:"It’s falling, so the velocity is negative." }, { k:"si", v:-40, fb:"That’s the velocity; speed is its size." }],
          hint:"Find `v` at the landing time.", alg:"`v(7) = -40` m/s, a speed of 40 m/s" }
      ] },
    quickCheck:{
      title:"Quick check", summary:"Speeding up? quick check",
      items:[
        { id:"q1", goal:3, prompt:"`v = -3` m/s and `a = 2` m/s². The object is…",
          choices:[
            { t:"slowing down", ok:true, fb:"Right. Opposite signs: slowing down." },
            { t:"speeding up", fb:"Opposite signs: slowing down." },
            { t:"at rest", fb:"Opposite signs: slowing down." },
            { t:"moving right", fb:"Opposite signs: slowing down." }] },
        { id:"q2", goal:4, prompt:"`s(t) = t^2 - 6t` on [0, 5]. Total distance?",
          choices:[
            { t:"13 m", ok:true, fb:"Right. Turn at `t = 3` (`s = -9`): 9 m left, then 4 m right." },
            { t:"5 m", fb:"Turn at `t = 3` (`s = -9`): 9 m left, then 4 m right." },
            { t:"9 m", fb:"Turn at `t = 3` (`s = -9`): 9 m left, then 4 m right." },
            { t:"14 m", fb:"Turn at `t = 3` (`s = -9`): 9 m left, then 4 m right." }] },
        { id:"q3", goal:5, prompt:"Station 3’s ball: maximum height?",
          choices:[
            { t:"80 m", ok:true, fb:"Right. `v = 0` at `t = 3`, and `h(3) = 80` m." },
            { t:"35 m", fb:"That’s the height of the cliff, where the ball starts." },
            { t:"45 m", fb:"That’s the rise above the cliff; add the 35 m." },
            { t:"3 m", fb:"3 is the time of the top, in seconds." }] },
        { id:"q4", goal:[2, 5], prompt:"Station 3’s ball: speed at impact?",
          choices:[
            { t:"40 m/s", ok:true, fb:"Right. `v(7) = -40` m/s, and speed is its size." },
            { t:"−40 m/s", fb:"That’s the velocity; speed is its size." },
            { t:"30 m/s", fb:"30 m/s is the launch speed. Find `v` when it lands, at `t = 7`." },
            { t:"0 m/s", fb:"The ball is still moving when it lands: `v(7) = -40` m/s." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"graphs", type:"match", title:"`s`–`t` graph ↔ `v`–`t` graph", summary:"s–t ↔ v–t", goal:6,
        instruction:"Match each position–time graph to its velocity–time graph.",
        how:"Tap an `s`–`t` graph, then tap its `v`–`t` graph.",
        leftTitle:"`s`–`t` graphs", rightTitle:"`v`–`t` graphs",
        left:[
          { id:"l1", t:TH("st1", "s–t graph: a straight line rising"), why:"A constant positive slope: `v` is a positive constant." },
          { id:"l2", t:TH("st2", "s–t graph: a horizontal line"), why:"A flat `s`–`t` graph means not moving: `v = 0`." },
          { id:"l3", t:TH("st3", "s–t graph: a parabola opening up, vertex at t = 2"), why:"The slope goes from negative to positive, through 0 at `t = 2`: a rising line." },
          { id:"l4", t:TH("st4", "s–t graph: a parabola opening down, vertex at t = 2"), why:"The slope goes from positive to negative, through 0 at `t = 2`: a falling line." },
          { id:"l5", t:TH("st5", "s–t graph: a cubic rising, falling, rising, turning at t = 1 and t = 3"), why:"Flat at `t = 1` and 3, so `v = 0` there; positive outside, negative between.",
            hints:["Where is the `s`–`t` graph flat?", "At `t = 1` and 3.", "`v = 0` there, positive outside, negative between."] },
          { id:"l6", t:TH("st6", "s–t graph: a straight line falling"), why:"A constant negative slope: `v` is a negative constant." },
          { id:"l7", t:TH("st7", "s–t graph: rising and levelling off"), why:"The slope is positive but getting smaller.",
            hints:["Is the slope positive or negative?", "Positive, but getting smaller.", "`v` positive, decreasing toward 0."] },
          { id:"l8", t:TH("st8", "s–t graph: falling and levelling off"), why:"The slope is negative and getting closer to 0." }
        ],
        right:[
          { id:"r1", t:TH("vt1", "v–t graph: a horizontal line above the axis") },
          { id:"r2", t:TH("vt2", "v–t graph: the t-axis itself, v = 0") },
          { id:"r3", t:TH("vt3", "v–t graph: a rising line crossing the axis at t = 2") },
          { id:"r4", t:TH("vt4", "v–t graph: a falling line crossing the axis at t = 2") },
          { id:"r5", t:TH("vt5", "v–t graph: a parabola opening up with zeros at t = 1 and t = 3") },
          { id:"r6", t:TH("vt6", "v–t graph: a horizontal line below the axis") },
          { id:"r7", t:TH("vt7", "v–t graph: positive, decreasing toward 0") },
          { id:"r8", t:TH("vt8", "v–t graph: negative, rising toward 0") }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l3|r5":"Velocity is the slope of the `s`–`t` graph, not a copy of its shape.",
          "l2|r1":"A flat `s`–`t` graph means not moving: `v = 0`."
        },
        wrongDefault:"Read the slope of the `s`–`t` graph at a few times." },
      { id:"trip", type:"custom", title:"One trip, five questions", summary:"One trip, five questions", star:true, goal:[1, 2, 3, 4, 5],
        instruction:"One motion, several questions, then two more trips. Items 3 to 6 are non-routine.",
        how:"Type a number, such as 12, −3.5, 3/4 or √7, and its unit is shown beside the box. For several times, separate them with commas. Item 4 uses an interval builder.",
        stem:"Items 1 to 4 use `s(t) = 2t^3 - 21t^2 + 60t` metres, `0 ≤ t ≤ 6`.",
        items:[
          { id:"s1", goal:2, kind:"set", prompt:"When is the particle at rest?", unit:"s", label:"Every time, separated by commas:",
            answer:[2, 5], display:"`t = 2` s and `t = 5` s",
            wrong:[{ match:[3.5], fb:"That’s when `a = 0`." }],
            general:"At rest means `v = 0`: solve `v = 6t^2 - 42t + 60 = 0`.",
            why:"`v = 6t^2 - 42t + 60 = 6(t - 2)(t - 5) = 0`." },
          { id:"s2", goal:1, kind:"num", prompt:"Acceleration at `t = 2`.", unit:"m/s²", label:"`a(2) =`",
            answer:-18, display:"−18 m/s²",
            wrong:[{ match:[0], fb:"At rest doesn’t mean `a = 0`." }],
            general:"Differentiate twice: `a = v′`.",
            why:"`a = 12t - 42`, so `a(2) = 24 - 42 = -18` m/s²." },
          { id:"s3", goal:4, star:true, kind:"num", prompt:"Total distance from `t = 0` to `t = 6`.", unit:"m", label:"Distance:",
            answer:90, display:"90 m",
            wrong:[{ match:[36], fb:"That’s the displacement." }, { match:[79], fb:"Include the last leg from `t = 5` to 6." }],
            general:M3,
            why:"`s(0) = 0`, `s(2) = 52`, `s(5) = 25`, `s(6) = 36`: legs 52 + 27 + 11 = 90 m." },
          { id:"s4", goal:3, star:true, kind:"iv", prompt:"Every interval in [0, 6] where it’s speeding up.",
            answer:[[2, 3.5], [5, 6]], display:"(2, 3.5) and (5, 6)",
            wrong:[{ iv:[[5, 6]], fb:"On (2, 3.5), `v` and `a` are both negative." }, { iv:[[3.5, 6]], fb:M1 }],
            general:"Split [0, 6] at the critical times 2, 3.5 and 5, then compare the signs of `v` and `a` on each piece.",
            closed:"Use open ends at 2, 3.5 and 5: at those times the particle is at rest or `a = 0`, so it isn’t speeding up there.",
            why:"`v` and `a` have the same sign on (2, 3.5) (both −) and on (5, 6) (both +).",
            hints:["`v = 6(t - 2)(t - 5)`; `a = 12t - 42`.", "`a` changes sign at 3.5.", "Same signs on (2, 3.5) (both −) and (5, 6) (both +)."] },
          { id:"s5", goal:5, star:true, kind:"num", prompt:"A stone thrown up from a 60 m bridge: `h(t) = -5t^2 + 20t + 60`. Speed when it hits the water?", unit:"m/s", label:"Speed:",
            answer:40, display:"40 m/s",
            wrong:[{ match:[-40], fb:M2 }, { match:[20], fb:"That’s the launch speed." }],
            general:"It hits the water when `h = 0`. Find `v` then, and take its size.",
            why:"`h = 0` gives `(t - 6)(t + 2) = 0`, so `t = 6`; `v(6) = -60 + 20 = -40`, a speed of 40 m/s." },
          { id:"s6", goal:3, star:true, kind:"num", prompt:"`s(t) = t^3 - 12t + 5`, `t ≥ 0`. When is the speed 9 m/s while slowing down?", unit:"s", label:"`t =`",
            answer:1, display:"`t = 1` s",
            wrong:[{ match:[2.6457513110645907], fb:"Speed 9 there too, but `v` and `a` are both positive: speeding up." }],
            general:"Speed 9 means `v = 9` or `v = -9`. Slowing down needs `v` and `a` to have opposite signs.",
            why:"`a = 6t > 0`, so slowing down needs `v < 0`: `3t^2 - 12 = -9` gives `t = 1`.",
            hints:["`v = 3t^2 - 12`, `a = 6t > 0` for `t > 0`.", "Slowing down needs `v < 0`, so `v = -9`.", "`3t^2 - 12 = -9` gives `t = 1`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Oscar", how:"", goal:[3, 4, 5],
        instruction:"Oscar made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"`s(t) = t^3 - 3t^2` m. Is the particle speeding up or slowing down at `t = 1.5` s?",
            steps:["`v(t) = 3t^2 - 6t`", "`a(t) = 6t - 6`", "`a(1.5) = 3 > 0`", "The acceleration is positive, so it’s speeding up."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"`v(1.5) = -2.25 < 0` and `a > 0` have opposite signs, so it’s slowing down.", ok:true, why:M1 },
              { t:"`a > 0`, so it’s moving right.", why:"Direction comes from `v`." },
              { t:"`v < 0`, so it’s slowing down.", why:"The sign of `v` alone doesn’t decide." },
              { t:"Step 4 is correct.", why:M1 }],
            hints:["What else do you need besides `a`?", "`v(1.5) = 6.75 - 9`.", "Opposite signs: slowing down."] },
          { id:"e2", goal:4, task:"`s(t) = t^2 - 4t` m. Total distance from `t = 0` to `t = 5`.",
            steps:["`v(t) = 2t - 4`", "`v = 0` at `t = 2`", "Distance = `|s(5) - s(0)| = |5 - 0| = 5` m"],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"`|s(2) - s(0)| + |s(5) - s(2)| = 4 + 9 = 13` m", ok:true, why:M3 },
              { t:"`s(2) + s(5) = 1` m", why:"Add leg lengths, not positions." },
              { t:"`|s(2)| = 4` m", why:"That’s only the first leg." },
              { t:"Step 3 is correct.", why:M3 }],
            hints:["Why did step 2 find `t = 2`?", "The particle turns there: split the trip.", "4 + 9 = 13 m."] },
          { id:"e3", goal:5, task:"`h(t) = -5t^2 + 40t` m. What is the ball’s acceleration at its highest point?",
            steps:["`v(t) = -10t + 40`", "Highest point when `v = 0`: `t = 4` s", "The ball stops at the top, so `a(4) = 0` m/s²."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"`a(t) = v′(t) = -10`, so `a(4) = -10` m/s²: the velocity is still changing.", ok:true, why:M5 },
              { t:"`a(4) = h(4) = 80`", why:"That’s the height." },
              { t:"`a(4) = -10 × 4 = -40`", why:"`a = -10` for every `t`." },
              { t:"Step 3 is correct.", why:M5 }],
            hints:["Is `v = 0` the same as `a = 0`?", "`a = v′`.", "−10 m/s²."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the simulator: speeding up with negative acceleration, or the distance counter racing past the displacement?" },
      { id:"j2", q:"In your own words, how do you tell whether an object is speeding up or slowing down?" },
      { id:"j3", q:"Explain to a friend how to find the total distance travelled, and why you need the times when `v = 0`." },
      { id:"j4", q:"Which motion idea are you still unsure about? What will you do to check it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"`s(t) = 4t^3 - t^2 + 2t` metres. Find `a(t)`.", options:[
          { t:"`24t - 2` m/s²", ok:true, why:"`v = 12t^2 - 2t + 2`, then `a = 24t - 2`." },
          { t:"`12t^2 - 2t + 2` m/s²", why:"That’s `v(t)`." },
          { t:"`(12t^2 - 2t + 2)^2` m/s²", why:"Acceleration isn’t velocity squared." },
          { t:"`24t` m/s²", why:"`-t^2` gives `-2t`, then −2." }] },
        b:{ prompt:"`s(t) = 2t^3 + 5t^2 - t` metres. Find `a(t)`.", options:[
          { t:"`12t + 10` m/s²", ok:true, why:"`v = 6t^2 + 10t - 1`, then `a = 12t + 10`." },
          { t:"`6t^2 + 10t - 1` m/s²", why:"That’s `v(t)`." },
          { t:"`(6t^2 + 10t - 1)^2` m/s²", why:"Acceleration isn’t velocity squared." },
          { t:"`12t` m/s²", why:"`5t^2` gives `10t`, then 10." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"At `t = 3` s, `v(3) = -6` m/s. Which statement is correct?", options:[
          { t:"“It’s moving in the negative direction with a speed of 6 m/s.”", ok:true, why:"The sign of `v` gives the direction, and the speed is `|v| = 6` m/s." },
          { t:"“Its speed is −6 m/s.”", why:M2 },
          { t:"“It’s slowing down.”", why:"Slowing down depends on `a` as well." },
          { t:"“It’s 6 m behind the starting point.”", why:"That’s a position, not a velocity." }] },
        b:{ prompt:"At `t = 2` s, `v(2) = -4` m/s. Which statement is correct?", options:[
          { t:"“It’s moving in the negative direction with a speed of 4 m/s.”", ok:true, why:"The sign of `v` gives the direction, and the speed is `|v| = 4` m/s." },
          { t:"“Its speed is −4 m/s.”", why:M2 },
          { t:"“It’s slowing down.”", why:"Slowing down depends on `a` as well." },
          { t:"“It’s 4 m behind the starting point.”", why:"That’s a position, not a velocity." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"`s(t) = t^2 - 10t + 16` metres. When is the object at rest?", options:[
          { t:"`t = 5` s", ok:true, why:"`v = 2t - 10 = 0`." },
          { t:"`t = 2` s and `t = 8` s", why:"That’s when `s = 0`. " + M4 },
          { t:"Never, because `a = 2` is never 0.", why:M4 },
          { t:"`t = 0` s", why:"`v(0) = -10`." }] },
        b:{ prompt:"`s(t) = t^2 - 6t + 5` metres. When is the object at rest?", options:[
          { t:"`t = 3` s", ok:true, why:"`v = 2t - 6 = 0`." },
          { t:"`t = 1` s and `t = 5` s", why:"That’s when `s = 0`. " + M4 },
          { t:"Never, because `a = 2` is never 0.", why:M4 },
          { t:"`t = 0` s", why:"`v(0) = -6`." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"`s(t) = t^3 - 9t^2 + 15t`, `t > 0`. When is the particle moving right while slowing down?", options:[
          { t:"`0 < t < 1`", ok:true, why:"`v = 3(t - 1)(t - 5) > 0` there and `a = 6t - 18 < 0`." },
          { t:"`t > 5`", why:"Both `v` and `a` are positive: speeding up. " + M1 },
          { t:"`1 < t < 3`", why:"`v < 0`: moving left." },
          { t:"`3 < t < 5`", why:"`v < 0`: moving left." }] },
        b:{ prompt:"`s(t) = t^3 - 12t^2 + 36t`, `t > 0`. When is the particle moving right while slowing down?", options:[
          { t:"`0 < t < 2`", ok:true, why:"`v = 3(t - 2)(t - 6) > 0` and `a = 6t - 24 < 0`." },
          { t:"`t > 6`", why:"Both `v` and `a` are positive: speeding up. " + M1 },
          { t:"`2 < t < 4`", why:"Moving left: `v < 0`." },
          { t:"`4 < t < 6`", why:"Moving left: `v < 0`." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"`s(t) = 2t^3 - 9t^2 + 12t` metres. Total distance from `t = 0` to `t = 3`?", options:[
          { t:"11 m", ok:true, why:"Turns at `t = 1` (`s = 5`) and `t = 2` (`s = 4`): 5 + 1 + 5." },
          { t:"9 m", why:"That’s the displacement `s(3) - s(0)`. " + M3 },
          { t:"10 m", why:"Include the short leg from `t = 1` to 2." },
          { t:"4 m", why:"`s(2)` is a position, not a distance." }] },
        b:{ prompt:"`s(t) = 2t^3 - 15t^2 + 24t` metres. Total distance from `t = 0` to `t = 5`?", options:[
          { t:"49 m", ok:true, why:"Turns at `t = 1` (`s = 11`) and `t = 4` (`s = -16`): 11 + 27 + 11." },
          { t:"5 m", why:"That’s the size of the displacement `s(5) - s(0) = -5`. " + M3 },
          { t:"38 m", why:"Include the last leg from `t = 4` to 5." },
          { t:"27 m", why:"That’s only the middle leg." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"A ball is thrown up from a 45 m tower: `h(t) = -5t^2 + 40t + 45`. What is its velocity when it’s 80 m above the ground on the way down?", options:[
          { t:"−30 m/s", ok:true, why:"`h = 80` gives `t^2 - 8t + 7 = 0`, so `t = 1` (up) or 7 (down); `v(7) = -70 + 40`." },
          { t:"30 m/s", why:"That’s at `t = 1`, on the way up." },
          { t:"−50 m/s", why:"That’s at the ground (`t = 9`)." },
          { t:"0 m/s", why:"That’s at the very top." }] },
        b:{ prompt:"A ball is thrown up from a 30 m roof: `h(t) = -5t^2 + 25t + 30`. What is its velocity when it’s 50 m up on the way down?", options:[
          { t:"−15 m/s", ok:true, why:"`t^2 - 5t + 4 = 0`, so `t = 4` on the way down; `v(4) = -40 + 25`." },
          { t:"15 m/s", why:"That’s at `t = 1`, going up." },
          { t:"−35 m/s", why:"That’s at the ground (`t = 6`)." },
          { t:"0 m/s", why:"That’s at the very top." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of how negative acceleration can make an object speed up?", options:[
          { t:"“If `v` is also negative, a negative `a` makes `v` more negative, so the speed `|v|` increases.”", ok:true, why:"Same signs mean speeding up, even when both are negative." },
          { t:"“Negative acceleration always means slowing down.”", why:M1 },
          { t:"“Acceleration doesn’t affect speed.”", why:"Acceleration is the rate of change of velocity, so it does." },
          { t:"“It can only happen when `v = 0`.”", why:"At `v = 0` the speed is 0, so it can only increase; the question is about moving objects." }] },
        b:{ prompt:"Which is the best explanation of how positive acceleration can make an object slow down?", options:[
          { t:"“If `v` is negative, a positive `a` pushes `v` toward 0, so the speed `|v|` decreases.”", ok:true, why:"Opposite signs mean slowing down." },
          { t:"“Positive acceleration always means speeding up.”", why:M1 },
          { t:"“Acceleration doesn’t affect speed.”", why:"Acceleration is the rate of change of velocity, so it does." },
          { t:"“It can only happen when `v = 0`.”", why:"At `v = 0` the speed is 0 and can’t decrease; the question is about moving objects." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"An `s`–`t` graph is a parabola opening down with vertex (3, 18). Which describes the `v`–`t` graph?", options:[
          { t:"“A straight line with negative slope, crossing the `t`-axis at `t = 3`.”", ok:true, why:"`v` is the slope of the parabola: positive, then 0 at the vertex, then negative, changing at a steady rate." },
          { t:"“A parabola opening down with vertex at `t = 3`.”", why:"Velocity is the slope, not a copy of the shape." },
          { t:"“A horizontal line at `v = 18`.”", why:"18 m is the greatest position, not a velocity." },
          { t:"“The object moves along an arch-shaped path.”", why:M6 }] },
        b:{ prompt:"An `s`–`t` graph is a parabola opening up with vertex (2, −8). Which describes the `v`–`t` graph?", options:[
          { t:"“A straight line with positive slope, crossing the `t`-axis at `t = 2`.”", ok:true, why:"`v` is the slope of the parabola: negative, then 0 at the vertex, then positive, changing at a steady rate." },
          { t:"“A parabola opening up with vertex at `t = 2`.”", why:"Velocity is the slope, not a copy of the shape." },
          { t:"“A horizontal line at `v = -8`.”", why:"−8 m is the least position, not a velocity." },
          { t:"“The object moves along a U-shaped path.”", why:M6 }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A flare is fired straight up from a boat deck 15 m above the water: `h(t) = -5t^2 + 50t + 15` (metres, seconds). What is its maximum height above the water?", options:[
          { t:"140 m", ok:true, why:"`v = -10t + 50 = 0` at `t = 5`; `h(5) = -125 + 250 + 15`." },
          { t:"125 m", why:"That’s the rise above the deck; add the 15 m." },
          { t:"15 m", why:"That’s the starting height." },
          { t:"5 m", why:"5 is the time in seconds." }] },
        b:{ prompt:"`h(t) = -5t^2 + 40t + 20`. What is the maximum height?", options:[
          { t:"100 m", ok:true, why:"Top at `t = 4`: `h(4) = -80 + 160 + 20`." },
          { t:"80 m", why:"That’s the rise above the start; add the starting 20 m." },
          { t:"20 m", why:"That’s the starting height." },
          { t:"4 m", why:"4 is the time in seconds." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"A braking car’s position is `s(t) = 60t - 3t^2` metres, valid until it stops. How far does it travel while braking?", options:[
          { t:"300 m", ok:true, why:"`v = 60 - 6t = 0` at `t = 10`; `s(10) = 600 - 300`." },
          { t:"600 m", why:"The `-3t^2` term is the braking: keep it." },
          { t:"60 m", why:"60 m/s is the starting velocity, not a distance." },
          { t:"288 m", why:"That’s `s(12)`: the model stops being valid at `t = 10`, when the car stops." }] },
        b:{ prompt:"A braking car’s position is `s(t) = 40t - 2t^2` metres, valid until it stops. How far does it travel while braking?", options:[
          { t:"200 m", ok:true, why:"`v = 40 - 4t = 0` at `t = 10`; `s(10) = 400 - 200`." },
          { t:"400 m", why:"The `-2t^2` term is the braking: keep it." },
          { t:"40 m", why:"40 m/s is the starting velocity, not a distance." },
          { t:"192 m", why:"That’s `s(12)`, after the car has stopped." }] } }
    ]
  },
  task:{
    title:"Turn once, then hurry left", summary:"Turn once, then hurry left",
    statement:"<p>Design a motion `s(t) = t^3 + bt^2 + ct` on `0 ≤ t ≤ 6` that meets every condition.</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>The particle is at rest at `t = 1`.</li><li>It changes direction exactly twice during `0 < t < 6`.</li><li>Its acceleration is zero before `t = 2.5`.</li><li>It is moving left at `t = 2`.</li></ol></div>" +
      "<p class=\"tiny muted\">Choose whole numbers: `b` from −12 to 12 and `c` from −30 to 30. The motion track and the `v`–`t` graph update as you go, with the zeros of `v` marked.</p>",
    checks:["At rest at `t = 1`", "Changes direction exactly twice", "`a = 0` before `t = 2.5`", "Moving left at `t = 2`"],
    tips:["`v(1) = 0` gives `c = -3 - 2b`.",
      "Then `v = (t - 1)(3t + 3 + 2b)`. The other zero must be in (0, 6) and not equal to 1.",
      "`a = 6t + 2b` is 0 at `t = -b/3`.",
      "Moving left at `t = 2` means `t = 2` sits between the two zeros of `v`."],
    explainPrompt:"Explain how you used the factored velocity to meet lines 2 and 4 together.",
    vocab:"Use the words velocity, acceleration, at rest and change direction.",
    after3:"The second turning time is `-(3 + 2b)/3`. Line 4 needs it after 2, and line 3 keeps `b` above −7.5."
  },
  cards:[
    ["Velocity", "`v(t) = s′(t)`, in m/s."],
    ["Acceleration", "`a(t) = v′(t) = s″(t)`, in m/s²."],
    ["Sign of `v`", "Direction: positive one way, negative the other."],
    ["At rest", "`v = 0` (not `s = 0`, not `a = 0`)."],
    ["Speed", "`|v|`, never negative."],
    ["Speeding up", "`v` and `a` have the same sign."],
    ["Slowing down", "`v` and `a` have opposite signs."],
    ["Displacement", "`s`(end) − `s`(start)."],
    ["Total distance", "Split at times where `v` changes sign; add every leg’s length."],
    ["Vertical motion", "`h(t) = -5t^2 + v_0 t + h_0` (`g ≈ 10` m/s²); `a = -10` throughout."],
    ["Maximum height", "Where `v = 0`."],
    ["Impact", "Solve `h = 0` for `t > 0`, then find `v` there."]
  ]
};
