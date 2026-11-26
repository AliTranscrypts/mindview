// MHF4U 35 Applications of Trig Functions. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/35-applications-of-trig-functions.md
// Models use stacked fractions for k ({π}/{30}) in captions, options, tiles and chips; inline π/30 t only in running sentences.

// ---------- hero equation with a small label under each coloured number ----------
const HL = (m, lab) => '<span class="heq-l">' + m + "<small>" + lab + "</small></span>";
const HERO_EQ = "`h(t) =` " + HL("`@a{-10}`", "radius 10 m (the − starts her at the bottom)") + " `cos(`" + HL("`@k{{π}/{30}}`", "one turn every 60 s") + "&#8201;`t) +` " + HL("`@c{12}`", "axle height");

// ---------- Practice 1: matching, with mistake feedback generated from the first feature that differs ----------
// wheel situations: start value at t = 0; tides: value at 2:00
const SIT = {
  S1:{ A:8, C:10, P:40, v:2, wheel:true, who:"This rider boards at the bottom, 2 m." },
  S2:{ A:8, C:10, P:40, v:18, wheel:true, who:"This rider starts at the top, 18 m." },
  S3:{ A:4, C:10, P:40, v:6, wheel:true, who:"This rider boards at the bottom, 6 m." },
  S4:{ A:8, C:10, P:20, v:2, wheel:true, who:"This rider boards at the bottom, 2 m." },
  S5:{ A:8, C:10, P:40, v:10, wheel:true, who:"This rider starts level with the axle, 10 m." },
  S6:{ A:8, C:10, P:80, v:2, wheel:true, who:"This rider boards at the bottom, 2 m." },
  S7:{ A:4, C:5, P:12, v:9, wheel:false, who:"In S7, 2:00 is high tide." },
  S8:{ A:4, C:5, P:12, v:1, wheel:false, who:"In S8, 2:00 is low tide." }
};
const MOD = {
  E1:{ A:8, C:10, P:40, k:"π/20", v:2, gives:"−8 + 10 = 2 m at `t = 0`: the lowest seat." },
  E2:{ A:8, C:10, P:40, k:"π/20", v:18, gives:"8 + 10 = 18 m at `t = 0`: the top." },
  E3:{ A:4, C:10, P:40, k:"π/20", v:6, gives:"−4 + 10 = 6 m at `t = 0`: the lowest seat." },
  E4:{ A:8, C:10, P:20, k:"π/10", v:2, gives:"−8 + 10 = 2 m at `t = 0`: the lowest seat." },
  E5:{ A:8, C:10, P:40, k:"π/20", v:10, gives:"0 + 10 = 10 m at `t = 0`: level with the axle." },
  E6:{ A:8, C:10, P:80, k:"π/40", v:2, gives:"−8 + 10 = 2 m at `t = 0`: the lowest seat." },
  E7:{ A:4, C:5, P:12, k:"π/6", v:9, gives:"9 m at 2:00: high tide." },
  E8:{ A:4, C:5, P:12, k:"π/6", v:1, gives:"1 m at 2:00: low tide." }
};
function matchFb(s, e){
  const S = SIT[s], E = MOD[e];
  if (S.A !== E.A) {
    if (s === "S3") return "The wheel is 8 m <strong>across</strong>, so its radius, and amplitude, is 4 m. " + e + "’s amplitude is " + E.A + ".";
    return e + " has amplitude " + E.A + ", but this situation’s is " + S.A + ".";
  }
  if (S.C !== E.C) return "Check the axis: " + e + "’s is " + E.C + " m, but this situation’s is " + S.C + " m.";
  if (S.P !== E.P) return e + " turns once every 2π ÷ (" + E.k + ") = " + E.P + " s. This wheel takes " + S.P + " s.";
  if (S.v !== E.v) return "Check the start. " + e + " gives " + E.gives + " " + S.who;
  return "";
}
const MATCH_ANS = { S1:"E1", S2:"E2", S3:"E3", S4:"E4", S5:"E5", S6:"E6", S7:"E7", S8:"E8" };
const MATCH_WRONG = {};
Object.keys(SIT).forEach(s => Object.keys(MOD).forEach(e => { if (MATCH_ANS[s] !== e) MATCH_WRONG[s + "|" + e] = matchFb(s, e); }));
const MH1 = "Work out the amplitude, axis, period and starting value of the situation.";

// ---------- Practice 3 sense checks ----------
const SENSE = "Sense check: does your answer fit the story? ";

export default {
  id:"35-applications-of-trig-functions",
  kind:"topic",
  title:"Applications of trig functions",
  topic:"Applications of Trig Functions",
  readyTopic:"applications of trig functions",
  hero:{
    eq:HERO_EQ, eqLabel:"h of t equals negative 10 cos of pi over 30 t, plus 12. Negative 10: radius 10 metres, the minus starts her at the bottom. Pi over 30: one turn every 60 seconds. 12: axle height.", eqSize:"sm",
    headline:"Every number in the model is something you can point to",
    text:"A Ferris wheel turns, and the rider’s height rises and falls in a wave. That wave is a <strong>sinusoidal model</strong>: the radius is its <strong>amplitude</strong>, the axle height is its <strong>axis</strong>, and the time for one turn is its <strong>period</strong>. The same model tells you when the rider reaches any height, and how fast her height is changing: her <strong>average rate of change</strong> over an interval and her <strong>instantaneous rate of change</strong> at a moment. Tides and hours of daylight follow the same pattern.",
    fig:{ html:'<div id="hero-wg" class="wg-hero"></div>' },
    cap:{ end:"`h(t) = @a{-10} cos(@k{{π}/{30}} t) + @c{12}`" }
  },
  goals:[
    "I can build a sinusoidal model for a Ferris wheel or another turning object from its radius, axle height, time per turn and starting position.",
    "I can explain what each parameter means in a situation, with units: amplitude, axis, period and phase shift.",
    "I can build a sinusoidal model from data, such as tide depths or hours of daylight, and use it to make a prediction.",
    "I can use a model to find the value at a given time, and every time in a cycle when the quantity is at or above a given level.",
    "I can calculate an average rate of change from a model, with units, and explain what it means in the situation.",
    "I can estimate an instantaneous rate of change with shrinking intervals, and explain where in the cycle it is greatest, zero, positive or negative."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Sinusoid features", goal:2,
          prompt:"What are the maximum and minimum values of `y = -5 cos[2(x - π/3)] + 7`?",
          options:[
            { t:"max 5, min −5", why:"That’s `y = 5 cos x` without the + 7. The axis is `y = 7`, so the values are 7 + 5 and 7 − 5." },
            { t:"max 9, min 5", why:"2 changes the period, not the height. The amplitude is `|-5| = 5`." },
            { t:"max 12, min 2", ok:true, why:"The axis is `y = 7` and the amplitude is `|-5| = 5`, so the values run from 7 − 5 = 2 to 7 + 5 = 12. The negative sign only flips the wave; it doesn’t change the max or min." },
            { t:"max 17, min −3", why:"That goes 10 above and below the axis. The amplitude is 5, the distance from the axis to a peak." }],
          hints:["Find the axis and the amplitude first.", "Axis `y = 7`. Amplitude `|a| = |-5| = 5`.", "max = 7 + 5 = 12, min = 7 − 5 = 2."] },
        { id:"w2", skill:"Sinusoid features", goal:1,
          prompt:"Which function has a period of 20?",
          options:[
            { t:"`y = sin(20x)`", why:"With `k = 20` the period is 2π/20 = π/10. `k` is not the period; it’s 2π ÷ period." },
            { t:"`y = sin({π}/{20} x)`", why:"Its period is 2π ÷ (π/20) = 40. You need `k = 2π/20 = π/10`." },
            { t:"`y = sin({π}/{10} x)`", ok:true, why:"Period = 2π ÷ (π/10) = 20." },
            { t:"`y = sin({x}/{20})`", why:"Its period is 2π ÷ (1/20) = 40π, about 126. `k = 2π/20`, not 1/20." }],
          hints:["Period = 2π/`k`. So `k` = 2π ÷ period.", "`k = 2π/20`. Simplify.", "`k = π/10`, so the function is `y = sin({π}/{10} x)`."] },
        { id:"w3", skill:"Exact values and equations", goal:4,
          prompt:"What is the exact value of `cos(2π/3)`?",
          options:[
            { t:"`-{√3}/{2}`", why:"`-√3/2` is `cos(5π/6)`. 2π/3 has reference angle π/3, and `cos(π/3) = 1/2`." },
            { t:"`-{1}/{2}`", ok:true, why:"2π/3 is in quadrant 2 with reference angle π/3. `cos(π/3) = 1/2`, and cosine is negative in quadrant 2." },
            { t:"`{1}/{2}`", why:"1/2 is `cos(π/3)`. 2π/3 is left of the `y`-axis, so its cosine is negative." },
            { t:"`{√3}/{2}`", why:"`√3/2` is `sin(2π/3)`. The question asks for cosine." }],
          hints:["Find the quadrant and the reference angle of 2π/3.", "Quadrant 2, reference angle π − 2π/3 = π/3. Is cosine positive or negative in quadrant 2?", "`cos(π/3) = 1/2`, and cosine is negative in quadrant 2: `cos(2π/3) = -1/2`."] },
        { id:"w4", skill:"Exact values and equations", goal:4,
          prompt:"Solve `cos x = -1/2` for `0 ≤ x ≤ 2π`.",
          options:[
            { t:"`x = 2π/3` only", why:"Cosine is negative in quadrants 2 <strong>and</strong> 3, so there’s a second angle: π + π/3 = 4π/3." },
            { t:"`x = π/3` and `5π/3`", why:"`cos(π/3) = +1/2`. The sign puts the angles left of the `y`-axis, in quadrants 2 and 3." },
            { t:"`x = 2π/3` and `4π/3`", ok:true, why:"Reference angle π/3; cosine is negative in quadrants 2 and 3: π − π/3 = 2π/3 and π + π/3 = 4π/3." },
            { t:"`x = 5π/6` and `7π/6`", why:"`cos(5π/6) = -√3/2`. The size 1/2 belongs to reference angle π/3." }],
          hints:["Ignore the sign first: which reference angle has cosine 1/2?", "π/3. Cosine is negative in quadrants 2 and 3.", "`x` = π − π/3 = 2π/3 and `x` = π + π/3 = 4π/3."] },
        { id:"w5", skill:"Rates of change", goal:5,
          prompt:"A drone is 4 m above the ground at `t` = 2 s and 22 m above the ground at `t` = 8 s. What is its average rate of change of height?",
          options:[
            { t:"1/3 m/s", why:"That’s run ÷ rise. Rate of change of height = change in height ÷ change in time." },
            { t:"2.75 m/s", why:"22 ÷ 8 ignores where the drone started. Use the changes: (22 − 4) ÷ (8 − 2)." },
            { t:"3 m/s", ok:true, why:"(22 − 4)/(8 − 2) = 18/6 = 3 m/s: on average the drone rose 3 m each second." },
            { t:"18 m/s", why:"18 m is the change in height. It took 6 s, so the rate is 18 ÷ 6." }],
          hints:["Average rate = (change in height) ÷ (change in time).", "Change in height: 22 − 4 = 18 m. Change in time: 8 − 2 = 6 s.", "18 ÷ 6 = 3 m/s."] },
        { id:"w6", skill:"Rates of change", goal:6,
          prompt:"For `f(x) = x^2`, the slopes of the secants from `P`(1, 1) to points `Q` closer and closer to `P` are 2.6, 2.15, 2.015 and 2.0015. What value are the slopes settling toward?",
          options:[
            { t:"0", why:"When `Q` is very close to `P`, both the rise and the run are tiny, but their ratio isn’t. The slopes are heading toward 2, not 0." },
            { t:"2", ok:true, why:"Each slope is closer to 2 than the last (2.6, 2.15, 2.015, 2.0015). That value is the instantaneous rate of change at `P`." },
            { t:"2.19", why:"The mean of the four slopes is about 2.19, but the early, wide secants are the worst estimates. Look where the sequence is heading." },
            { t:"2.6", why:"2.6 comes from the widest interval. The narrower the interval, the better the estimate." }],
          hints:["Look at how the numbers change as `Q` gets closer to `P`.", "The part after the 2 keeps shrinking: 0.6, 0.15, 0.015, 0.0015.", "The slopes are settling toward 2."] }
      ],
      refreshers:{
        "Sinusoid features":"In `y = a sin[k(x - d)] + c` (or the cosine version), the axis is `y = c`, the amplitude is `|a|`, the maximum is `c + |a|`, the minimum is `c - |a|`, and the period is 2π/`|k|`. Example: `y = -5 cos[2(x - π/3)] + 7` has axis `y = 7`, amplitude 5, max 12, min 2 and period 2π/2 = π. To build `k` from a period `T`, use `k = 2π/T`: a period of 20 gives `k = π/10`.",
        "Exact values and equations":"For an angle in any quadrant, the reference angle gives the size and CAST gives the sign: `cos(2π/3) = -cos(π/3) = -1/2`. To solve `cos x = -1/2` on `0 ≤ x ≤ 2π`, find the reference angle (π/3), then every quadrant where cosine is negative: `x` = 2π/3 and 4π/3. There are usually <strong>two</strong> answers in one cycle.",
        "Rates of change":"The average rate of change over an interval is (change in output) ÷ (change in input), the slope of the secant, with units such as m/s. Example: from (2 s, 4 m) to (8 s, 22 m) it’s 18/6 = 3 m/s. To estimate the instantaneous rate at a point, shrink the interval and watch where the secant slopes settle."
      }
    }
  },
  explore:{
    heading:"Ferris wheel lab",
    intro:"Build a wheel, then ride it. The rider’s height is drawn on the graph as the wheel turns. Switch to Rates to measure how fast her height is changing.",
    ui:{
      modes:["Ride", "Rates"],
      boards:["Bottom", "Axle level, going up", "Top", "Axle level, going down"],
      raised:"Axle raised so the wheel stays above the ground.",
      locked:"Locked for this challenge.",
      camera:"camera at 17 m",
      setup:"Set up this challenge",
      tc3Hidden:"hidden for this challenge"
    },
    predictions:[
      { id:"p1", start:{ mode:"ride", r:10, c:12, T:60, b:0, t:0 },
        prompt:"The park replaces this wheel with one of radius 15 m. The axle is raised so the lowest seat stays 2 m above the ground, and one turn still takes 60 s. Which numbers in the model change?",
        options:[{ t:"−10 and 12 only", ok:true }, { t:"−10 only" }, { t:"12 only" }, { t:"−10, 12 and π/30" }],
        explain:"The radius is the amplitude, so `a` goes from −10 to −15. The axle sits one radius above the lowest seat: 2 + 15 = 17. One turn still takes 60 s, so `k = 2π/60 = π/30` doesn’t change. The rider on the bigger wheel does move faster along the rim (π/2 m/s instead of π/3 m/s), but `k` counts radians per second, not metres." },
      { id:"p2", start:{ mode:"rates", r:10, c:12, T:60, b:0, t1:0, t2:10 },
        prompt:"In the first 30 s the rider rises 20 m, from 2 m to 22 m. How is that climb shared among the three 10-second intervals 0–10 s, 10–20 s and 20–30 s?",
        options:[{ t:"The same in each: about 6.7 m" }, { t:"Most in the first interval" }, { t:"Most in the middle interval", ok:true }, { t:"Most in the last interval" }],
        explain:"Each interval turns the wheel through the same angle, π/3, but the rise depends on where that arc is. Near the bottom the rider moves mostly sideways: only 5 m up. The middle arc goes almost straight up: 10 m. Near the top she’s moving sideways again: 5 m. `h(0) = 2`, `h(10) = 7`, `h(20) = 17`, `h(30) = 22`." },
      { id:"p3", start:{ mode:"rates", r:10, c:12, T:60, b:0, t1:0, t2:10 },
        prompt:"What is the rider’s average rate of change of height over one full turn, from `t = 0` to `t` = 60 s?",
        options:[{ t:"0 m/s", ok:true }, { t:"1/3 m/s" }, { t:"2/3 m/s" }, { t:"π/3 m/s (about 1.05 m/s)" }],
        explain:"Average rate of change = change in height ÷ change in time. She ends the turn at 2 m, where she started, so the change is 0. 1/3 m/s is the 20 m from the bottom to the top divided by 60 s; 2/3 m/s is the 40 m she travels up <strong>and</strong> down divided by 60 s; π/3 m/s is her speed along the rim. None of those is a net change in height." },
      { id:"p4", start:{ mode:"ride", r:10, c:12, T:60, b:0, t:0, camera:true },
        prompt:"A camera on a post is 17 m above the ground. During the first turn, how many times is the rider exactly 17 m high?",
        options:[{ t:"0" }, { t:"1" }, { t:"2", ok:true }, { t:"4" }],
        explain:"`-10 cos(π/30 t) + 12 = 17` gives `cos(π/30 t) = -1/2`, so π/30 `t` = 2π/3 or 4π/3: `t` = 20 s or `t` = 40 s. A level line cuts a circle at two points, so the rider passes 17 m once going up and once coming down. 17 m is the axle plus half the radius (12 + 5), which puts those seats π/3 on either side of the top: the arc between them is one-third of the wheel." }
    ],
    challenges:[
      { id:"tc1", goal:[1, 2],
        prompt:"A wheel is 18 m across, and its lowest seat is 3 m above the ground. It makes 1.5 turns every minute, and the rider boards at the bottom at `t = 0`. Set the lab to model this ride.",
        why:"Radius 18 ÷ 2 = 9 m, axle 3 + 9 = 12 m, 60 ÷ 1.5 = 40 s per turn, boarding at the bottom: `h(t) = -9 cos({π}/{20} t) + 12`.",
        msgs:{
          r18:"18 m is the distance across the wheel, its diameter. The radius, and so the amplitude, is half of it: 9 m.",
          r:"Start with the radius. The wheel is 18 m <strong>across</strong>, and the radius is half of that.",
          c9:"Your lowest seat is at 0 m, on the ground. It should be 3 m up, so the axle is 3 + 9 = 12 m.",
          c21:"21 m is the height of the <strong>top</strong> (3 + 18). The axle is halfway between the lowest seat and the top: 12 m.",
          c:"The radius is right. Your lowest seat is `c - 9` = {v} m, but it should be 3 m. The axle is one radius above the lowest seat.",
          T90:"90 is 60 × 1.5. At 1.5 turns per minute, each turn takes 60 ÷ 1.5 = 40 s.",
          T60:"That’s one turn per minute. This wheel makes 1.5 turns per minute, so each turn is shorter: 40 s.",
          T:"Radius and axle are right. How many seconds does one turn take at 1.5 turns per minute?",
          b:"The wheel is right. Check `h(0)`: the rider boards at the bottom, so `h(0)` should be 3 m."
        },
        hints:["Radius first: what’s half of the width?", "`r = 9`. The axle is the lowest seat plus one radius: 3 + 9 = 12 m. How many seconds does one turn take at 1.5 turns per minute?", "60 ÷ 1.5 = 40 s. Set `r = 9`, `c = 12`, `T = 40` and Boarding point: Bottom. The model is `h(t) = -9 cos({π}/{20} t) + 12`."] },
      { id:"tc2", goal:[5, 6],
        prompt:"Using Rates mode, place a 10-second interval where the rider’s <strong>average rate of change of height is as large as possible</strong>.",
        why:"1 m/s is the best 10-second average. Now press <strong>Shrink toward `t_1`</strong> with `t_1 = 15`: the slopes settle at π/3 ≈ 1.047 m/s, exactly the rider’s speed along the rim.",
        msgs:{
          down:"This is the steepest part of the graph, but the rider is coming <strong>down</strong>: the rate is −1 m/s. You want the largest rate, so look where she’s going up.",
          top:"This interval is centred on the top, where she’s moving sideways. Her height ends where it began: 0 m/s.",
          start:"You <strong>started</strong> at the steepest moment. Half of your interval is on the flatter part above it. Centre the interval on the steepest moment instead.",
          low:"She’s climbing, but slowly: near the bottom she moves mostly sideways.",
          other:"Your average rate is {v} m/s. Find where the graph climbs most steeply, then centre the interval there.",
          setup:"Press <strong>Set up this challenge</strong> first: it puts the wheel back to `r = 10`, `c = 12`, `T = 60`, Bottom, and locks `t_2` to `t_1` + 10 in Rates mode."
        },
        hints:["Where is the graph steepest on the way <strong>up</strong>?", "Steepest going up is where the rider passes the axle on the way up, at `t` = 15 s. Centre the 10-second interval there.", "`t_1 = 10`, `t_2 = 20`: (17 − 7) ÷ 10 = 1 m/s."] },
      { id:"tc3", goal:[1, 6], stretch:true,
        prompt:"Design a wheel whose top is 30 m above the ground and whose lowest seat is 2 m above the ground, so that <strong>at its steepest the rider’s height changes at exactly π/2 m/s</strong> (about 1.57 m/s).",
        why:"`r` = (30 − 2) ÷ 2 = 14 and `c = 16`. At the axle she moves straight up at her speed along the rim, 28π/`T`, and 28π/`T` = π/2 gives `T` = 56 s. Any boarding point works: the steepest rate doesn’t depend on where she boards.",
        msgs:{
          ends:"Check the top (`c + r`) and the lowest seat (`c - r`) first. Right now they’re {v} m and {w} m.",
          T36:"That makes the <strong>average</strong> climb over the half-turn 28 m ÷ 18 s ≈ 1.56 m/s. The steepest moment is faster than the average climb. At the axle she moves straight up, at her full speed along the rim.",
          T112:"2π × 28 ÷ 112 = π/2 uses the diameter. In one turn the rider travels 2π × 14 = 28π m, so her speed is 28π/`T`.",
          T:"Top and bottom are right. At the steepest point she climbs at her speed along the rim, 28π/`T` m/s. With `T` = {v} that’s {w} m/s."
        },
        hints:["Get `r` and `c` from the top and the lowest seat first.", "`r` = (30 − 2) ÷ 2 = 14 and `c = 16`. At the axle the rider moves straight up, so her steepest rate of climb is her speed along the rim: 2π × 14 ÷ `T`.", "28π/`T` = π/2 gives `T` = 56 s."] }
    ]
  },
  part3:{
    slug:"data", name:"Real data",
    heading:"Real data: tides and daylight",
    intro:"Pick a data set. Build its model one number at a time; each number you enter draws its own guide on the plot. Then see how well your model fits, and use it to answer questions.",
    sets:{
      tide:{ label:"Tide", fn:"w", unit:"m", tUnit:"h", tName:"hours after midnight",
        story:"A tide gauge in a harbour records the water depth every hour, from midnight (`t = 0`) to the next midnight (`t = 24`). The readings are rounded to 0.1 m. (Real tides repeat about every 12 h 25 min. These readings are idealized to a 12-hour cycle.)",
        note:"The depth model is written `w(t)`, for water depth, so that the letter `d` stays free for the phase shift.",
        rowLabel:"Depth (m)",
        data:[7.0, 8.5, 9.0, 8.5, 7.0, 5.2, 3.0, 1.5, 1.0, 1.5, 3.0, 4.9, 7.0, 8.5, 9.0, 8.5, 6.8, 5.0, 3.0, 1.6, 1.0, 1.5, 3.0, 5.1, 7.0],
        periodHow:"Tap two neighbouring maximums on the plot (or enter `T`).",
        phaseHow:"Cosine form with `a > 0`: tap a maximum to set `d`, or enter `d`.",
        steps:[
          { id:"c", answer:5, wrong:[{ match:4.5, fb:"That’s half of the high-tide depth. The axis is halfway between high and low: (9 + 1) ÷ 2 = 5." }, { match:8, fb:"8 is the range, 9 − 1. The axis is the average of high and low." }] },
          { id:"a", answer:4, wrong:[{ match:8, fb:"8 is the whole range from low to high. The amplitude is half of it." }, { match:9, fb:"That’s the highest value, which is `c + a`." }] },
          { id:"T", answer:12, wrong:[{ match:6, fb:"From a high to the next low is only half a cycle. Tide: tap the next <strong>high</strong>. Daylight: a full cycle runs from March 21 to the next March 21." }, { match:24, fb:"There are two high tides in the day, so 24 h holds two cycles." }] },
          { id:"d", answer:2, wrong:[{ match:-2, fb:"`cos[k(t - d)]` is largest when `t = d`. A high at `t = 2` gives `cos[{π}/{6} (t - 2)]`, so `d = 2`." }, { match:8, fb:"That’s the time of a <strong>low</strong>. With `a > 0` the cosine form starts at a high." }, { match:20, fb:"That’s the time of a <strong>low</strong>. With `a > 0` the cosine form starts at a high." }] }
        ],
        also:"Also correct; the simplest is `d = 2`.",
        model:"`w(t) = 4 cos[{π}/{6} (t - 2)] + 5`",
        readout:"Model: `w(t) = 4 cos[{π}/{6} (t - 2)] + 5`. Largest gap: {gap} m (at {where}). You predicted: {pred}."
      },
      day:{ label:"Daylight", fn:"D", unit:"h", tUnit:"months", tName:"months after March 21",
        story:"Hours of daylight in a Prairie city near 50° N, on the 21st of each month, starting with the spring equinox on March 21 (`t = 0`). Each month is counted as 1/12 of a year. The values are rounded and idealized to follow the yearly pattern of such a city.",
        rowLabel:"Daylight (h)",
        dates:["Mar 21", "Apr 21", "May 21", "Jun 21", "Jul 21", "Aug 21", "Sep 21", "Oct 21", "Nov 21", "Dec 21", "Jan 21", "Feb 21", "Mar 21"],
        data:[12.0, 14.0, 15.5, 16.0, 15.5, 14.0, 12.2, 10.0, 8.5, 8.0, 8.5, 9.9, 12.0],
        periodHow:"One year of data has only one longest day, so tap the two points one full cycle apart where the data crosses its axis going up: March 21 and the next March 21 (or enter `T`).",
        phaseHow:"Cosine form with `a > 0`: tap a maximum to set `d`, or enter `d`. Or switch to the sine form: `d` is the time the data crosses the axis going up.",
        steps:[
          { id:"c", answer:12, wrong:[{ match:8, fb:"8 h is the shortest day. (It’s also half of the longest day, and the range 16 − 8.) The axis is halfway between the longest and shortest days: (16 + 8) ÷ 2 = 12." }] },
          { id:"a", answer:4, wrong:[{ match:8, fb:"8 is the whole range from low to high. The amplitude is half of it." }, { match:16, fb:"That’s the highest value, which is `c + a`." }] },
          { id:"T", answer:12, wrong:[{ match:6, fb:"From a high to the next low is only half a cycle. Tide: tap the next <strong>high</strong>. Daylight: a full cycle runs from March 21 to the next March 21." }],
            equinox:"September 21 is near 12 h again, but daylight is <strong>falling</strong> then. A cycle ends where the pattern repeats: the same value, changing the same way." },
          { id:"d", answer:3, wrong:[{ match:9, fb:"That’s the time of a <strong>low</strong>. With `a > 0` the cosine form starts at a high." }] },
          { id:"ds", answer:0, wrong:[{ match:6, fb:"September 21 is where the data crosses its axis going <strong>down</strong>. With `a > 0`, `a sin[k(t - d)] + c` crosses its axis going <strong>up</strong> at `t = d`: March 21, `d = 0`." }] }
        ],
        also:"Also correct; the simplest is `d = 3`.", alsoSin:"Also correct; the simplest is `d = 0`.",
        model:"`D(t) = 4 cos[{π}/{6} (t - 3)] + 12`",
        readout:"Model: `D(t) = 4 cos[{π}/{6} (t - 3)] + 12`, the same as `4 sin({π}/{6} t) + 12`. Largest gap: {gap} h ({where}). You predicted: {pred}."
      }
    },
    stepNames:["1. Axis", "2. Amplitude", "3. Period", "4. Phase shift"],
    stepAsk:["Enter `c`.", "Enter `a` (positive).", "", ""],
    stepGeneral:[
      "The axis is halfway between the highest and lowest values: (max + min) ÷ 2.",
      "The amplitude is half the distance from the lowest value to the highest: (max − min) ÷ 2.",
      "The period is the time for the pattern to repeat: from one high to the <strong>next high</strong>, or between two points with the same value, changing the same way.",
      "In `a cos[k(t - d)] + c` with `a > 0`, `d` is the time of a high.",
      "With `a > 0`, `a sin[k(t - d)] + c` crosses its axis going up at `t = d`."
    ],
    kChips:[
      { t:"`{1}/{12}`", fb:"That’s cycles per hour (or month). `k` counts radians: 2π/12." },
      { t:"`{π}/{12}`", fb:"That’s π ÷ 12. `k = 2π/T`." },
      { t:"`{π}/{6}`", ok:true, fb:"Right: `k = 2π/12 = π/6`." },
      { t:"`12`", fb:"12 is the period itself, not `k`." }],
    kAsk:"Then choose `k`:",
    sineForm:"Sine form",
    cosForm:"Cosine form",
    fitAsk:"How close do you expect your model to be?",
    fitChips:["Within 0.5 everywhere", "Off by 0.5 to 1 somewhere", "Off by more than 1 somewhere"],
    fitBtn:"Show my model on the data",
    algSteps:[
      "<strong>Tide, `t = 4`:</strong> `4 cos[{π}/{6} (4 - 2)] + 5 = 4 cos(π/3) + 5 = 2 + 5 = 7`. The reading is 7.0. ✓",
      "<strong>Tide, `t = 7`:</strong> `4 cos(5π/6) + 5 = 5 - 2√3 ≈ 1.54`. The reading is 1.5. ✓",
      "<strong>Tide, `t = 5`:</strong> `4 cos(π/2) + 5 = 5`. The reading is 5.2: a gap of 0.2 m. “Real readings scatter a little around the model.”",
      "<strong>Daylight, `t = 1`:</strong> `4 cos(-π/3) + 12 = 14`. The reading is 14.0. ✓",
      "<strong>Daylight, `t = 8`:</strong> `4 cos(5π/6) + 12 = 12 - 2√3 ≈ 8.54`. The reading is 8.5. ✓"
    ],
    use:{
      harbour:{ id:"u1", goal:4, title:"Harbour closed", answer:[6, 10, 18, 22],
        prompt:"A ferry needs at least 3 m of water. Today, between midnight and midnight, when is the harbour closed to it?",
        frame:["closed from", "to", "and from", "to"],
        work:"`4 cos[{π}/{6} (t - 2)] + 5 < 3` means `cos[{π}/{6} (t - 2)] < -1/2`, so π/6 (`t` − 2) is between 2π/3 and 4π/3: `t` − 2 is between 4 and 8, and 12 h later again.",
        wrongReadings:"You used only the readings below 3 m. The water keeps falling between readings: at 6:00 and 10:00 it’s exactly 3 m, and below 3 m all the way between.",
        wrongLows:"Those are the low tides. The harbour is closed for a stretch of time around each one.",
        general:"Write the model first, then find where it equals 3: the harbour is closed between those times." },
      d1:{ id:"u2", goal:5, title:"Minutes per day", answer:4, unit:"min per day",
        prompt:"Between March 21 and April 21, how many minutes of daylight does the city gain per day, on average? (Use a 30-day month.)",
        wrong:[{ match:2, fb:"2 is hours per month." }, { match:120, fb:"120 is minutes per month; divide by 30 days." }],
        work:"`D(1) - D(0)` = 2 h = 120 min over 30 days: 4 min per day.",
        general:"Find `D(1) - D(0)` in hours, change it to minutes, then divide by 30 days." },
      d2:{ id:"u3", goal:5, answer:1.1, unit:"min per day", use:"`√3 ≈ 1.73`",
        prompt:"Between May 21 and June 21? Answer to one decimal place.",
        wrong:[{ match:4, fb:"Daylight doesn’t grow at a steady rate. Near the longest day the graph is nearly flat." }, { match:32, fb:"That’s minutes per month." }],
        work:"`D(3) - D(2) = 4 - 2√3` ≈ 0.54 h ≈ 32 min, over 30 days ≈ 1.1 min per day.",
        general:"Find `D(3) - D(2)` in hours, change it to minutes, then divide by 30 days." }
    },
    useIntro:"These questions unlock after the model is drawn over the data.",
    bars:{ title:"Monthly change in daylight (from the model)",
      caption:"Daylight changes fastest around the equinoxes, where the graph crosses its axis, and hardly at all around the solstices, where it’s at a max or min. From the shortest day to the longest, the monthly gains run 0.54, 1.46, 2, 2, 1.46, 0.54 h: slow, fast, slow. That’s the rider’s pattern again: 5 m, 10 m, 5 m." },
    reality:{ title:"Model vs reality", btn:"Run 3 days",
      text:"A model is only as good as its period. Real tide tables use many more terms; this one would need correcting every day." },
    blocks:[{ title:"What the data tells you", html:"<div class=\"refresh\"><h4>From data to a sinusoidal model</h4><ol><li><strong>Axis:</strong> `c` = (max + min) ÷ 2.</li><li><strong>Amplitude:</strong> `a` = (max − min) ÷ 2.</li><li><strong>Period:</strong> the time for the pattern to repeat: from one high to the <strong>next high</strong> (not to the next low), or between two points with the same value, changing the same way; then `k = 2π/T`.</li><li><strong>Phase shift:</strong> in `a cos[k(t - d)] + c` with `a > 0`, `d` is the time of a high.</li><li><strong>Check</strong> the model at a few data times, and remember it’s a model: real data scatters around it, and a slightly wrong period drifts over time.</li></ol></div>" }],
    quickCheck:{
      title:"Quick check: “Real data”", summary:"Real data quick check",
      items:[
        { id:"q1", goal:2, prompt:"In the model `w(t) = 4 cos[{π}/{6} (t - 2)] + 5` (`w` in metres, `t` in hours after midnight), what does the 2 tell you?",
          choices:[
            { t:"The time of a high tide", ok:true, fb:"Right. With `a > 0` the cosine form is highest when `t - 2 = 0`: high tide is at 2:00." },
            { t:"The depth at low tide", fb:"The low tide is 5 − 4 = 1 m deep. The 2 sits in the bracket with `t`, so it’s measured in hours. In `cos[k(t - d)]`, `d` is a <strong>time</strong>: the model is highest when `t = d`, so high tide is at 2:00." },
            { t:"The number of high tides each day", fb:"That comes from the period, 2π ÷ (π/6) = 12 h: two highs a day. The 2 is a time. In `cos[k(t - d)]`, `d` is a <strong>time</strong>: the model is highest when `t = d`, so high tide is at 2:00." },
            { t:"The amplitude", fb:"The amplitude is 4, the number in front of cos. In `cos[k(t - d)]`, `d` is a <strong>time</strong>: the model is highest when `t = d`, so high tide is at 2:00." }] },
        { id:"q2", goal:3, prompt:"A city has 9 h of daylight on its shortest day and 15 h on its longest. What is the amplitude of its daylight model?",
          choices:[
            { t:"3 h", ok:true, fb:"Right. (15 − 9) ÷ 2 = 3 h. The axis is (15 + 9) ÷ 2 = 12 h." },
            { t:"6 h", fb:"6 h is the whole difference, 15 − 9. The amplitude is half of it: 3 h." },
            { t:"12 h", fb:"12 h is the axis, (15 + 9) ÷ 2. The amplitude is how far the longest day is above it: 3 h." },
            { t:"15 h", fb:"15 h is the longest day: the axis plus the amplitude, 12 + 3." }] },
        { id:"q3", goal:3, prompt:"High tide is at 3:00 a.m., and the next low tide is at 9:15 a.m. What is the period of the tide?",
          choices:[
            { t:"6 h", fb:"3:00 to 9:15 is 6 h 15 min, and high to the next low is only half a cycle. Double 6.25 h: 12.5 h." },
            { t:"6.25 h", fb:"6.25 h is high to the next low: half a cycle. Double it: 12.5 h." },
            { t:"12 h", fb:"That doubles 6 h, but 3:00 to 9:15 is 6.25 h. Double that: 12.5 h." },
            { t:"12.5 h", ok:true, fb:"Right. High to low is half a cycle, 6.25 h, so a full cycle is 12.5 h." }] },
        { id:"q4", goal:3, prompt:"A tide model uses a 12-hour period, but the real period is about 12.4 h. The model is right at today’s first high tide. About how far off is its prediction for the 6th high tide after that?",
          choices:[
            { t:"0.4 h", fb:"That’s the error after one cycle. It grows by 0.4 h every cycle: 6 × 0.4 = 2.4 h." },
            { t:"2.4 h", ok:true, fb:"Right. Each cycle the model gains 0.4 h on the real tide: 6 × 0.4 = 2.4 h." },
            { t:"6 h", fb:"6 is the number of cycles, not the error. Each cycle adds 0.4 h: 6 × 0.4 = 2.4 h." },
            { t:"12.4 h", fb:"That’s the real period. The error is the difference per cycle, 0.4 h, times 6 cycles: 2.4 h." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Match the ride to its model", summary:"Match the ride to its model", goal:2,
        instruction:"Match each situation to the model that describes it. `h` or `w` is in metres; `t` is in seconds for wheels and in hours after midnight for tides.",
        how:"Tap a situation, then tap its model.", leftTitle:"Situation", rightTitle:"Model",
        left:[
          { id:"S1", goal:[1, 2], t:"S1. Radius 8 m, axle 10 m above the ground, one turn every 40 s. The rider boards at the bottom.",
            why:"Radius 8 is the amplitude, the axle 10 is the axis, 40 s gives `k = π/20`, and boarding at the bottom means −cos.",
            hints:[MH1, "Amplitude 8 m (the radius), axis 10 m (the axle), period 40 s, so `k = 2π/40`. She starts at the lowest seat, 2 m.", "`k = π/20`, and boarding at the bottom means −cos: `h(t) = -8 cos({π}/{20} t) + 10`, model E1."] },
          { id:"S2", goal:[1, 2], t:"S2. Radius 8 m, axle 10 m, one turn every 40 s. The rider starts at the top.",
            why:"Starting at the top means +cos: `h(0)` = 8 + 10 = 18 m.",
            hints:[MH1, "Amplitude 8, axis 10, period 40 s, so `k = π/20`. She starts at the top, 18 m.", "Starting at the top means +cos: `h(t) = 8 cos({π}/{20} t) + 10`, model E2."] },
          { id:"S3", goal:[1, 2], t:"S3. A wheel 8 m across, axle 10 m, one turn every 40 s. The rider boards at the bottom.",
            why:"8 m across is the diameter, so the radius, and amplitude, is 4 m.",
            hints:[MH1, "The wheel is 8 m across, so the radius is 4 m: amplitude 4, axis 10, period 40 s. She starts at the lowest seat, 6 m.", "The radius is half the width: `h(t) = -4 cos({π}/{20} t) + 10`, model E3."] },
          { id:"S4", goal:[1, 2], t:"S4. Radius 8 m, axle 10 m, one turn every 20 s. The rider boards at the bottom.",
            why:"A 20 s turn gives `k = 2π/20 = π/10`.",
            hints:[MH1, "Amplitude 8, axis 10, period 20 s, so `k = 2π/20`. She starts at the lowest seat, 2 m.", "`k = π/10` and she boards at the bottom: `h(t) = -8 cos({π}/{10} t) + 10`, model E4."] },
          { id:"S5", goal:[1, 2], t:"S5. Radius 8 m, axle 10 m, one turn every 40 s. The rider starts level with the axle, going up.",
            why:"Starting level with the axle, going up, means +sin: `h(0)` = 10 m and rising.",
            hints:[MH1, "Amplitude 8, axis 10, period 40 s. She starts at 10 m, level with the axle, going up.", "Starting at the axle going up means +sin: `h(t) = 8 sin({π}/{20} t) + 10`, model E5."] },
          { id:"S6", goal:[1, 2], t:"S6. Lowest seat 2 m above the ground, top 18 m, one turn every 80 s. The rider boards at the bottom.",
            why:"Radius (18 − 2) ÷ 2 = 8, axle (18 + 2) ÷ 2 = 10, and an 80 s turn gives `k = π/40`.",
            hints:["Find the radius and the axle from the lowest seat and the top.", "Radius (18 − 2) ÷ 2 = 8 m, axle (18 + 2) ÷ 2 = 10 m. One turn takes 80 s, so `k = 2π/80`.", "`k = π/40` and she boards at the bottom: `h(t) = -8 cos({π}/{40} t) + 10`, model E6."] },
          { id:"S7", goal:[3, 2], t:"S7. Tide: high tide 9 m deep at 2:00, low tide 1 m deep at 8:00.",
            why:"Axis 5, amplitude 4, period 12 h, and the high at 2:00 gives (`t` − 2).",
            hints:[MH1, "Axis (9 + 1) ÷ 2 = 5, amplitude 4, period 2 × 6 = 12 h, so `k = π/6`. High tide is at 2:00.", "In the cosine form with `a > 0`, `d` is the time of a high: `w(t) = 4 cos[{π}/{6} (t - 2)] + 5`, model E7."] },
          { id:"S8", goal:[3, 2], t:"S8. Tide: low tide 1 m deep at 2:00, high tide 9 m deep at 8:00.",
            why:"The high is at 8:00, so `d = 8`: at 2:00 the model gives 1 m, low tide.",
            hints:["Find the axis, amplitude and period, then decide when the high tide is.", "Axis (9 + 1) ÷ 2 = 5, amplitude 4, period 2 × 6 = 12 h, so `k = π/6`. High tide is at 8:00.", "In the cosine form with `a > 0`, `d` is the time of a high: `w(t) = 4 cos[{π}/{6} (t - 8)] + 5`, model E8."] }
        ],
        right:[
          { id:"E1", t:"E1. `h(t) = -8 cos({π}/{20} t) + 10`" },
          { id:"E2", t:"E2. `h(t) = 8 cos({π}/{20} t) + 10`" },
          { id:"E3", t:"E3. `h(t) = -4 cos({π}/{20} t) + 10`" },
          { id:"E4", t:"E4. `h(t) = -8 cos({π}/{10} t) + 10`" },
          { id:"E5", t:"E5. `h(t) = 8 sin({π}/{20} t) + 10`" },
          { id:"E6", t:"E6. `h(t) = -8 cos({π}/{40} t) + 10`" },
          { id:"E7", t:"E7. `w(t) = 4 cos[{π}/{6} (t - 2)] + 5`" },
          { id:"E8", t:"E8. `w(t) = 4 cos[{π}/{6} (t - 8)] + 5`" }
        ],
        answer:MATCH_ANS, wrong:MATCH_WRONG },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Jun", how:"",
        instruction:"Jun made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"A Ferris wheel is 30 m across, its lowest seat is 2 m above the ground, and it turns once every 50 s. A rider boards at the bottom at `t = 0`. Write a model for her height.",
            steps:["The radius is 30 ÷ 2 = 15 m, so the amplitude is 15.", "The axle is 15 m above the ground, so `c = 15`.", "One turn takes 50 s, so `k = 2π/50 = π/25`.", "She starts at the bottom, so `h(t) = -15 cos({π}/{25} t) + 15`."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 is true. The mistake is earlier.", "Step 4 uses step 2’s axle height. The mistake is earlier."],
            fixes:[
              { t:"The axle is one radius above the lowest seat: 2 + 15 = 17 m. So `h(t) = -15 cos({π}/{25} t) + 17`.", ok:true, why:"Check: `h(0)` = −15 + 17 = 2 m, the lowest seat." },
              { t:"`c = 15` is right, but the amplitude should be 30, so `h(t) = -30 cos({π}/{25} t) + 15`.", why:"30 m is the diameter. And this would put the rider 15 m <strong>below</strong> the ground at `t = 0`." },
              { t:"The axle is at the top of the wheel: 2 + 30 = 32 m, so `c = 32`.", why:"32 m is the height of the top. The axle is at the centre, halfway up." },
              { t:"Step 2 is correct as written.", why:"Check `h(0)` with Jun’s model: −15 + 15 = 0 m. The rider would board at ground level, but the lowest seat is 2 m up." }],
            hints:["Test Jun’s model at `t = 0`. Where should the rider be?", "`h(0)` should be 2 m, the lowest seat. Jun’s model gives 0 m. Which step decides the axle height?", "Step 2 is wrong: the axle is 2 + 15 = 17 m, so `h(t) = -15 cos({π}/{25} t) + 17`."] },
          { id:"e2", goal:5, task:"For `h(t) = -10 cos({π}/{30} t) + 12`, find the average rate of change of height from `t` = 10 s to `t` = 20 s.",
            steps:["`h(10) = -10 cos(π/3) + 12 = -5 + 12 = 7` m.", "`h(20) = -10 cos(2π/3) + 12 = 5 + 12 = 17` m.", "Average rate of change = (17 − 7)/20 = 0.5 m/s.", "So on average the rider rises 0.5 m each second."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: `cos(2π/3) = -1/2`.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"Average rate of change = (17 − 7)/(20 − 10) = 10/10 = 1 m/s.", ok:true, why:"Divide by the time that passed, 20 − 10 = 10 s." },
              { t:"Average rate of change = (17 + 7)/2 = 12 m.", why:"That’s the average <strong>height</strong>, 12 m, not a rate. A rate divides a change in height by a change in time." },
              { t:"Average rate of change = (17 − 7) ÷ (2π/3 − π/3) = 30/π ≈ 9.55 m/s.", why:"π/3 is the angle the wheel turned, in radians, not the time. Dividing by it gives metres per radian." },
              { t:"Step 3 is correct as written.", why:"The run is the time that passed. The interval starts at 10 s, so 10 s passed, not 20 s." }],
            hints:["In a rate of change, what goes in the denominator?", "The change in time: from 10 s to 20 s.", "Step 3 is wrong: (17 − 7)/(20 − 10) = 1 m/s."] },
          { id:"e3", goal:4, task:"For `h(t) = -10 cos({π}/{30} t) + 12`, when during the first turn (`0 ≤ t ≤ 60`) is the rider higher than 17 m?",
            steps:["Set `-10 cos({π}/{30} t) + 12 = 17`.", "So `cos({π}/{30} t) = -1/2`.", "Cosine is −1/2 at 2π/3, so π/30 `t` = 2π/3 and `t` = 20 s.", "So the rider is higher than 17 m from `t` = 20 s until the end of the turn, `t` = 60 s."],
            answer:2,
            stepFb:["Step 1 is correct: find where she is exactly 17 m high first. Keep checking.", "Step 2 is correct: `-10 cos({π}/{30} t) = 5`.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"Cosine is −1/2 at 2π/3 <strong>and</strong> 4π/3, so `t` = 20 s and `t` = 40 s. She’s higher than 17 m for `20 < t < 40`.", ok:true, why:"She passes 17 m going up at 20 s and coming down at 40 s." },
              { t:"Cosine is −1/2 at 2π/3 and 5π/3, so `t` = 20 s and `t` = 50 s.", why:"`cos(5π/3) = +1/2`: quadrant 4. Cosine is negative in quadrants 2 and 3." },
              { t:"Cosine is −1/2 at π/3, so `t` = 10 s.", why:"`cos(π/3) = +1/2`. And at `t = 10` the rider is only 7 m high." },
              { t:"Step 3 is correct as written.", why:"At `t = 50` the rider is at `-10 cos(5π/3) + 12 = 7` m, well below 17 m, so she can’t be above 17 m all the way to 60 s." }],
            hints:["How many times in one turn does the rider pass 17 m?", "Twice: once going up, once coming down. On `0 ≤ {π}/{30} t ≤ 2π`, where is cosine −1/2?", "Step 3 is wrong: π/30 `t` = 2π/3 or 4π/3, so `t` = 20 or 40. She’s above 17 m for `20 < t < 40`."] }
        ] },
      { id:"ride", type:"numeric", title:"Ride, tide and daylight problems", summary:"Ride, tide and daylight problems", star:true,
        instruction:"Each question needs more than one step. Answer in the box, then press Check.",
        how:"Type a number. Decimals are fine where the question says so.",
        general:"Write the model first, then decide what the question is asking for: a height, a time, a length of time, or a rate.",
        items:[
          { id:"r1", goal:4, prompt:"A wheel has radius 12 m and its axle 14 m above the ground, and turns once every 48 s. The rider boards at the bottom. How high is she 8 s after boarding?", answer:8, unit:"m", display:"8 m",
            wrong:[{ match:20, fb:"That uses +12 cos: a rider who starts at the top. Boarding at the bottom needs `-12 cos({π}/{24} t) + 14`." }, { match:2, fb:"2 m is where she boards, at `t = 0`." }],
            why:SENSE + "8 m is between the lowest seat (2 m) and the axle (14 m): 8 s is one-sixth of the turn, and the first sixth lifts her only `r/2` = 6 m.",
            hints:["Write the model: the radius, the axle, `k = 2π/48`, and −cos for a bottom boarding.", "`h(t) = -12 cos({π}/{24} t) + 14`. At `t = 8` the angle is 8π/24 = π/3.", "`h(8) = -12 cos(π/3) + 14 = -6 + 14 = 8` m."] },
          { id:"r2", goal:4, prompt:"Same wheel. When does the rider <strong>first</strong> reach 20 m?", answer:16, unit:"s", display:"16 s",
            wrong:[{ match:32, fb:"At 32 s she passes 20 m on the way <strong>down</strong>. The first time is earlier." }, { match:8, fb:"`cos({π}/{24} t) = -1/2`, not +1/2. At 8 s she’s only 8 m high." }],
            why:SENSE + "20 m is the axle plus half the radius (14 + 6), so she first reaches it one-third of the way through the turn: 48 ÷ 3 = 16 s.",
            hints:["Set the model equal to 20 and solve for the cosine.", "`-12 cos({π}/{24} t) = 6`, so `cos({π}/{24} t) = -1/2`. The first angle is 2π/3.", "π/24 `t` = 2π/3 gives `t` = 16 s."] },
          { id:"r3", goal:4, prompt:"Same wheel. For how many seconds of each turn is she higher than 20 m?", answer:16, unit:"s", display:"16 s",
            wrong:[{ match:32, fb:"That runs from 16 s to the end of the turn, but she comes back down through 20 m at 32 s." }, { match:24, fb:"24 s is half the turn: the time she spends above the <strong>axle</strong>, 14 m." }],
            why:SENSE + "16 s is one-third of the 48 s turn: the arc above 20 m is the third of the wheel centred on the top.",
            hints:["Find both times in the turn when she’s exactly 20 m high.", "`cos({π}/{24} t) = -1/2` at π/24 `t` = 2π/3 and 4π/3: `t` = 16 and `t` = 32.", "She’s above 20 m from 16 s to 32 s: 32 − 16 = 16 s."] },
          { id:"r4", goal:5, prompt:"Same wheel. What is her average rate of change of height from `t` = 8 s to `t` = 16 s, in m/s?", answer:1.5, tol:0.0033, unit:"m/s", display:"1.5 m/s",
            wrong:[{ match:2.5, fb:"20 ÷ 8 uses only the height at 16 s. Use the change: (20 − 8) ÷ (16 − 8)." }, { match:12, fb:"12 m is the change in height. Divide by the 8 s it took." }, { match:0.67, fb:"That’s time ÷ height, upside down." }],
            why:SENSE + "1.5 m/s is a little less than her speed along the rim, 2π × 12 ÷ 48 = π/2 ≈ 1.57 m/s, as an average climb must be.",
            hints:["Find her height at 8 s and at 16 s.", "`h(8)` = 8 m and `h(16)` = 20 m.", "(20 − 8) ÷ (16 − 8) = 12 ÷ 8 = 1.5 m/s."] },
          { id:"r5", goal:1, prompt:"A wheel turns once every 60 s, and a rider boards at the bottom, 2 m above the ground. 10 s later she is 8 m above the ground. What is the radius?", answer:12, unit:"m", display:"12 m",
            wrong:[{ match:6, fb:"She has risen 6 m, but in one-sixth of a turn the rise is only half the radius." }, { match:9, fb:"That assumes a steady climb (1/6 of a turn → 1/3 of the 2`r` climb). Near the bottom she rises slowly: the rise is `r(1 - cos(π/3)) = r/2`." }, { match:36, fb:"6 ÷ (1/6) treats the 6 m rise as one-sixth of the radius. In one-sixth of a turn the rise is `r/2`." }],
            why:SENSE + "With `r = 12` the axle is 14 m and the top 26 m, and one-sixth of a turn lifts the rider `r/2` = 6 m.",
            hints:["Write the height after one-sixth of a turn in terms of `r`.", "`k = π/30`, so after 10 s the wheel has turned π/3. `h(10) = -r cos(π/3) + (2 + r) = 2 + r/2`.", "`2 + r/2 = 8`, so `r` = 12 m."] },
          { id:"r6", goal:1, prompt:"A wheel has radius 10 m, axle 12 m, and the rider boards at the bottom. She <strong>first</strong> reaches 17 m 12 s after boarding. How long does one turn take?", answer:36, unit:"s", display:"36 s",
            wrong:[{ match:24, fb:"That treats 17 m as the top (half a turn). The top is 22 m." }, { match:48, fb:"That treats 17 m as the axle (a quarter turn). The axle is 12 m." }, { match:72, fb:"`cos(k × 12) = -1/2` gives `k × 12 = 2π/3`: one-<strong>third</strong> of a turn, not one-sixth." }],
            why:SENSE + "17 m is the axle plus half the radius, which she reaches one-third of the way through the turn: 36 ÷ 3 = 12 s.",
            hints:["Set `-10 cos(kt) + 12 = 17` with `t = 12`.", "`cos(12k) = -1/2`, and the first angle is 2π/3: one-third of a turn.", "One-third of a turn takes 12 s, so one turn takes 3 × 12 = 36 s."] },
          { id:"r7", goal:4, star:true, prompt:"A paddle wheel on a riverboat has radius 3 m, and its axle is 1.5 m above the water. It turns once every 12 s. For how many seconds of each turn is a given paddle tip under water?", answer:4, unit:"s", display:"4 s",
            wrong:[{ match:6, fb:"That’s half a turn: it would be right if the axle were at water level. Here the axle is 1.5 m up." }, { match:8, fb:"That’s the time the tip spends <strong>above</strong> the water." }, { match:2, fb:"That’s only from entering the water to the lowest point. The tip has to come back up too." }],
            why:SENSE + "The axle is 1.5 m up, half the radius, so the tip is under water for the third of the turn centred on the bottom: 12 ÷ 3 = 4 s.",
            hints:["When is the paddle tip below the water? Write its height above the water.", "Height = 1.5 + 3 sin φ, where φ is the angle turned. It’s under water when sin φ < −1/2.", "sin φ < −1/2 for 7π/6 < φ < 11π/6: an arc of 2π/3, one-third of a turn. One-third of 12 s is 4 s."] },
          { id:"r8", goal:5, prompt:"Daylight is modelled by `D(t) = 4 sin({π}/{6} t) + 12` hours, `t` months after March 21. How many more hours of daylight are there on May 21 than on April 21? Answer to two decimal places.", use:"`√3 ≈ 1.73`", answer:1.46, tol:0.0034, unit:"h", display:"1.46 h",
            wrong:[{ match:2, fb:"Daylight doesn’t grow by a steady 2 h each month. `D(2) - D(1) = (12 + 2√3) - 14 = 2√3 - 2`." }, { match:0.54, fb:"That’s June 21 minus May 21, `4 - 2√3`." }],
            why:SENSE + "1.46 h is less than the 2 h gained the month before: the gains slow down as June 21, the longest day, gets closer.",
            hints:["Find `D(1)` and `D(2)`.", "`D(1) = 4 sin(π/6) + 12 = 14` and `D(2) = 4 sin(π/3) + 12 = 12 + 2√3`.", "`D(2) - D(1) = 2√3 - 2` ≈ 2(1.73) − 2 = 1.46 h."] },
          { id:"r9", goal:6, star:true, prompt:"A wheel has radius 15 m. The operator wants the rider’s height never to change faster than 1 m/s. What is the shortest whole number of seconds one turn can take?", use:"π ≈ 3.14", answer:95, unit:"s", display:"95 s",
            wrong:[{ match:60, fb:"That keeps the <strong>average</strong> climb over the half-turn at 1 m/s (30 m in 30 s). At the axle she climbs at her full speed, 30π/`T`, which is faster." }, { match:94, fb:"30π ≈ 30 × 3.14 = 94.2, so 94 s is just too fast: 94.2 ÷ 94 ≈ 1.002 m/s." }, { match:30, fb:"30 s is how long a steady 1 m/s climb up the 30 m diameter would take. That’s only half a turn, and her climb isn’t steady." }],
            why:SENSE + "At 95 s per turn her fastest climb is 30π ÷ 95 ≈ 0.99 m/s, just under 1 m/s; at 94 s it would be just over.",
            hints:["Her height changes fastest as she passes the axle, where she moves straight up at her speed along the rim.", "Her speed is 2π × 15 ÷ `T` = 30π/`T`. You need 30π/`T` ≤ 1.", "`T` ≥ 30π ≈ 30 × 3.14 = 94.2, so the shortest whole number of seconds is 95 s."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you about how the rider’s climb is shared among equal parts of a turn?" },
      { id:"j2", q:"In your own words, explain why the rider’s height changes fastest as she passes the axle and not at all at the top." },
      { id:"j3", q:"Explain to a friend how to turn a description of a Ferris wheel (radius, axle height, time per turn, boarding point) into an equation." },
      { id:"j4", q:"Which part of modelling (building the equation, finding times, or rates of change) are you still unsure about, and what will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"A Ferris wheel rider’s height is `h(t) = -9 cos({π}/{25} t) + 11`, with `h` in metres and `t` in seconds. How long does one turn take?", options:[
          { t:"1/50 s", why:"That’s `k` ÷ 2π, upside down. The period is 2π ÷ `k`." },
          { t:"π/25 s", why:"π/25 is `k`, the angle the wheel turns each second, in radians." },
          { t:"25 s", why:"That’s π ÷ `k`, which is half a turn: in 25 s the rider goes from the bottom to the top." },
          { t:"50 s", ok:true, why:"`T` = 2π ÷ (π/25) = 2π × 25/π = 50 s." }] },
        b:{ prompt:"A Ferris wheel rider’s height is `h(t) = -6 cos({π}/{40} t) + 8`, with `h` in metres and `t` in seconds. How long does one turn take?", options:[
          { t:"1/80 s", why:"That’s `k` ÷ 2π, upside down." },
          { t:"π/40 s", why:"π/40 is `k`, the angle turned each second." },
          { t:"40 s", why:"That’s π ÷ `k`, half a turn." },
          { t:"80 s", ok:true, why:"`T` = 2π ÷ (π/40) = 80 s." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"In `h(t) = -9 cos({π}/{25} t) + 11` for a Ferris wheel, what does the 11 tell you?", options:[
          { t:"The axle is 11 m above the ground.", ok:true, why:"The axis `h = 11` is the height of the centre of the wheel." },
          { t:"The top of the wheel is 11 m above the ground.", why:"The top is 11 + 9 = 20 m." },
          { t:"The lowest seat is 11 m above the ground.", why:"The lowest seat is 11 − 9 = 2 m." },
          { t:"The radius of the wheel is 11 m.", why:"The radius is the amplitude, 9 m." }] },
        b:{ prompt:"In `h(t) = -6 cos({π}/{40} t) + 8` for a Ferris wheel, what does the 8 tell you?", options:[
          { t:"The axle is 8 m above the ground.", ok:true, why:"The axis `h = 8` is the height of the centre." },
          { t:"The top of the wheel is 8 m above the ground.", why:"The top is 8 + 6 = 14 m." },
          { t:"The lowest seat is 8 m above the ground.", why:"The lowest seat is 8 − 6 = 2 m." },
          { t:"The radius of the wheel is 8 m.", why:"The radius is the amplitude, 6 m." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"`h(t) = -10 cos({π}/{30} t) + 12` gives a rider’s height in metres after `t` seconds. What is the average rate of change of her height from `t = 0` to `t` = 15 s?", options:[
          { t:"2/3 m/s", ok:true, why:"`h(0) = 2` and `h(15) = -10 cos(π/2) + 12 = 12`, so (12 − 2)/(15 − 0) = 10/15 = 2/3 m/s." },
          { t:"0.8 m/s", why:"12 ÷ 15 uses only the height at 15 s. Use the change in height: 12 − 2 = 10 m." },
          { t:"1.5 m/s", why:"15 ÷ 10 is time ÷ height, upside down." },
          { t:"10 m/s", why:"10 m is the change in height. Divide by the 15 s it took." }] },
        b:{ prompt:"`h(t) = -8 cos({π}/{20} t) + 10` gives a rider’s height in metres after `t` seconds. What is the average rate of change of her height from `t = 0` to `t` = 10 s?", options:[
          { t:"0.8 m/s", ok:true, why:"`h(0) = 2` and `h(10) = -8 cos(π/2) + 10 = 10`, so (10 − 2)/10 = 0.8 m/s." },
          { t:"1 m/s", why:"10 ÷ 10 uses only the height at 10 s." },
          { t:"1.25 m/s", why:"10 ÷ 8 is time ÷ height, upside down." },
          { t:"8 m/s", why:"8 m is the change in height. Divide by the 10 s." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"`h(t) = -10 cos({π}/{30} t) + 12` gives a rider’s height in metres after `t` seconds. For how many seconds of each turn is she higher than 7 m?", options:[
          { t:"10 s", why:"10 s is the <strong>first</strong> time she’s at 7 m, on the way up. She stays above 7 m until she comes back down through it." },
          { t:"20 s", why:"20 s is the time she spends <strong>below</strong> 7 m: 10 s at the start of the turn and 10 s at the end." },
          { t:"40 s", ok:true, why:"`-10 cos({π}/{30} t) + 12 = 7` gives `cos({π}/{30} t) = 1/2`, so `t` = 10 or `t` = 50. She’s above 7 m from 10 s to 50 s: 40 s." },
          { t:"50 s", why:"50 s is when she comes back down through 7 m. She was already above it from 10 s on." }] },
        b:{ prompt:"`h(t) = -8 cos({π}/{24} t) + 10` gives a rider’s height in metres after `t` seconds. For how many seconds of each turn is she higher than 6 m?", options:[
          { t:"8 s", why:"8 s is the first time she’s at 6 m." },
          { t:"16 s", why:"16 s is the time she spends <strong>below</strong> 6 m." },
          { t:"32 s", ok:true, why:"`cos({π}/{24} t) = 1/2` gives `t` = 8 or `t` = 40. She’s above 6 m for 40 − 8 = 32 s." },
          { t:"40 s", why:"40 s is when she comes back down through 6 m." }] } },
      { id:"t2", cat:"T", goal:1,
        a:{ prompt:"A wheel turns once every 60 s, and a rider boards at the bottom. 20 s after boarding she has risen 15 m. What is the radius of the wheel?", options:[
          { t:"10 m", ok:true, why:"20 s is 20/60 = 1/3 of a turn, an angle of 2π/3. Her rise is `r - r cos(2π/3) = r + r/2 = 1.5r = 15`, so `r` = 10 m." },
          { t:"11.25 m", why:"That assumes a steady climb: one-third of a turn as two-thirds of the 2`r` climb, so 4`r`/3 = 15. Her climb isn’t steady: by one-third of a turn she has been through the fast middle part, so she has risen 1.5`r`, more than a steady climb gives." },
          { t:"15 m", why:"15 m is the rise. One-third of a turn takes her past the axle, so the rise is more than the radius." },
          { t:"45 m", why:"15 ÷ (1/3) treats the rise as one-third of the radius." }] },
        b:{ prompt:"A wheel turns once every 36 s, and a rider boards at the bottom. 12 s after boarding she has risen 18 m. What is the radius of the wheel?", options:[
          { t:"12 m", ok:true, why:"12 s is 12/36 = 1/3 of a turn, an angle of 2π/3. Her rise is `r - r cos(2π/3) = 1.5r = 18`, so `r` = 12 m." },
          { t:"13.5 m", why:"That assumes a steady climb: one-third of a turn as two-thirds of the 2`r` climb, so 4`r`/3 = 18. Her climb isn’t steady: by one-third of a turn she has risen 1.5`r`." },
          { t:"18 m", why:"18 m is the rise. One-third of a turn takes her past the axle, so the rise is more than the radius." },
          { t:"54 m", why:"18 ÷ (1/3) treats the rise as one-third of the radius." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"A bicycle is upside down on a repair stand, and its wheel spins at exactly 2 turns per second. A reflector is clipped to the spokes 30 cm from the hub. At its fastest, how quickly is the reflector’s height changing?", use:"π ≈ 3.14", options:[
          { t:"0 cm/s", why:"That’s the rate at the very top or bottom, where the reflector moves sideways: the slowest moment, not the fastest." },
          { t:"30π cm/s (about 94 cm/s)", why:"That divides the circumference by 2. At 2 turns per second the reflector travels <strong>two</strong> circumferences each second: 2 × 60π = 120π cm." },
          { t:"240 cm/s", why:"That’s the <strong>average</strong> rate for the half-turn climb: 60 cm in 1/4 s. Passing the hub, the reflector moves straight up at its full speed, which is faster." },
          { t:"120π cm/s (about 377 cm/s)", ok:true, why:"Level with the hub, the reflector moves straight up, so its height changes at its full speed: 2 × (2π × 30) = 120π ≈ 377 cm/s." }] },
        b:{ prompt:"A wind turbine’s blades turn at exactly 15 turns per minute. The tip of a blade is 20 m from the hub. At its fastest, how quickly is the tip’s height changing?", use:"π ≈ 3.14", options:[
          { t:"0 m/s", why:"That’s the rate at the very top or bottom, where the tip moves sideways." },
          { t:"8π/3 m/s (about 8.4 m/s)", why:"That divides the circumference by 15. 15 is turns per <strong>minute</strong>: one turn takes 60 ÷ 15 = 4 s." },
          { t:"20 m/s", why:"That’s the <strong>average</strong> rate for the half-turn climb: 40 m in 2 s. Level with the hub the tip moves straight up, which is faster." },
          { t:"10π m/s (about 31.4 m/s)", ok:true, why:"One turn takes 4 s, so the tip’s speed is 2π × 20 ÷ 4 = 10π ≈ 31.4 m/s. Level with the hub it moves straight up, so that’s how fast its height changes." }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"Which is the best explanation of why a Ferris wheel rider’s height changes fastest as she passes the axle?", options:[
          { t:"At the axle height she is moving straight up or down, so all of her motion changes her height. At the top and bottom she is moving sideways, so for an instant her height stops changing.", ok:true, why:"This links the rate to the direction she’s moving." },
          { t:"Her height is greatest at the axle, so it changes fastest there.", why:"Her height is greatest at the top, where it changes slowest. A large value doesn’t mean a large rate." },
          { t:"The wheel turns faster when the rider is halfway up.", why:"The wheel turns at a steady speed. What changes is the direction she’s moving." },
          { t:"The axle height is the average height, and an average always changes fastest.", why:"That isn’t a rule. The reason is the direction of her motion." }] },
        b:{ prompt:"Daylight is modelled by a sinusoid with axis 12 h. Which is the best explanation of why daylight changes fastest around the spring equinox, when there are 12 h of daylight?", options:[
          { t:"The equinox is where the daylight graph crosses its axis, the steepest part of a sinusoid. Around the longest and shortest days the graph is at a maximum or minimum, where it is flat for an instant.", ok:true, why:"This links the rate to where the sinusoid is steepest." },
          { t:"Daylight is greatest at the equinox, so it changes fastest.", why:"Daylight is greatest at the summer solstice, where it changes slowest." },
          { t:"The months around March are longer, so more daylight is added.", why:"Every month counts as 1/12 of a year here. The reason is the shape of the graph." },
          { t:"At the equinox, daylight is the average of the year, and an average always changes fastest.", why:"That isn’t a rule. The reason is where the graph is steepest." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"For `h(t) = -10 cos({π}/{30} t) + 12` (metres, seconds), the average rate of change from `t` = 10 s to `t` = 20 s is 1 m/s. Which statement best explains what this means?", options:[
          { t:"Between 10 s and 20 s her height rose by 10 m, which is 1 m per second on average. She climbed faster in some of those seconds and slower in others.", ok:true, why:"Net change ÷ time, and an average, not a steady rate." },
          { t:"She rose exactly 1 m during every one of those 10 seconds.", why:"That describes a steady climb. Her rate is changing the whole time; 1 m/s is only the average." },
          { t:"Her height at `t` = 20 s is 1 m.", why:"A rate isn’t a height. At 20 s she’s 17 m high." },
          { t:"She rose 1 m in total between 10 s and 20 s.", why:"She rose 10 m in total. 1 m/s is per second." }] },
        b:{ prompt:"A tide’s depth is `w(t) = 4 cos[{π}/{6} (t - 2)] + 5` (metres, hours after midnight). The average rate of change from `t = 2` to `t = 8` is −4/3 m/h. Which statement best explains what this means?", options:[
          { t:"Between 2:00 and 8:00 the depth fell by 8 m in 6 h, which is 4/3 m per hour on average. It fell faster in some hours and slower in others.", ok:true, why:"Net change ÷ time, and an average, not a steady rate." },
          { t:"The depth fell by exactly 4/3 m in each of those six hours.", why:"That describes a steady fall. The tide falls slowly near high and low tide and fastest in between." },
          { t:"The depth at 8:00 is −4/3 m.", why:"A rate isn’t a depth. At 8:00 the depth is 1 m." },
          { t:"The depth fell by 4/3 m in total between 2:00 and 8:00.", why:"It fell by 8 m in total. −4/3 m/h is per hour." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"In a harbour, high tide is 8.6 m deep at 3:00 a.m. The next low tide is 2.2 m deep at 9:00 a.m. Which model gives the depth `t` hours after midnight?", options:[
          { t:"`w(t) = 3.2 cos[{π}/{6} (t - 3)] + 5.4`", ok:true, why:"Axis (8.6 + 2.2)/2 = 5.4, amplitude (8.6 − 2.2)/2 = 3.2. High to low is half a cycle, so the period is 12 h and `k = π/6`. With `a > 0`, `d` is the time of a high: 3." },
          { t:"`w(t) = 6.4 cos[{π}/{6} (t - 3)] + 5.4`", why:"6.4 is the whole range from low to high. The amplitude is half of it." },
          { t:"`w(t) = 3.2 cos[{π}/{3} (t - 3)] + 5.4`", why:"`k = π/3` means a 6-hour period. High to low is only half a cycle, so the period is 12 h." },
          { t:"`w(t) = 3.2 cos[{π}/{6} (t + 3)] + 5.4`", why:"(`t` + 3) puts the high at `t = -3`. A high at 3:00 needs (`t` − 3)." }] },
        b:{ prompt:"In a harbour, high tide is 7.4 m deep at 5:00 a.m. The next low tide is 1.8 m deep at 11:00 a.m. Which model gives the depth `t` hours after midnight?", options:[
          { t:"`w(t) = 2.8 cos[{π}/{6} (t - 5)] + 4.6`", ok:true, why:"Axis (7.4 + 1.8)/2 = 4.6, amplitude (7.4 − 1.8)/2 = 2.8, period 12 h so `k = π/6`, and a high at 5." },
          { t:"`w(t) = 5.6 cos[{π}/{6} (t - 5)] + 4.6`", why:"5.6 is the whole range." },
          { t:"`w(t) = 2.8 cos[{π}/{3} (t - 5)] + 4.6`", why:"That’s a 6-hour period." },
          { t:"`w(t) = 2.8 cos[{π}/{6} (t + 5)] + 4.6`", why:"A high at 5:00 needs (`t` − 5)." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"A cyclist’s pedal is on a crank 17 cm long. The crank’s axle is 30 cm above the ground. For what fraction of each turn of the crank is the pedal higher than 38.5 cm above the ground?", options:[
          { t:"1/6", why:"That’s only from the moment the pedal passes 38.5 cm to the top. It stays above 38.5 cm until it comes back down." },
          { t:"1/3", ok:true, why:"38.5 = 30 + 8.5: the axle plus half the crank. The pedal is that high when sin φ = 1/2, at φ = π/6 and 5π/6. The arc between them is 2π/3, one-third of a turn." },
          { t:"1/2", why:"Half the turn is the time the pedal spends above the <strong>axle</strong>, 30 cm. 38.5 cm is higher." },
          { t:"2/3", why:"That’s the fraction of the turn the pedal spends <strong>below</strong> 38.5 cm." }] },
        b:{ prompt:"A buoy bobs on steady waves. Its height above the sea floor rises and falls sinusoidally between 11.4 m and 12.6 m, and one wave passes every 4 s. For what fraction of each wave is the buoy lower than 11.7 m?", options:[
          { t:"1/6", why:"That’s only from passing 11.7 m to the lowest point. It stays below 11.7 m until it comes back up." },
          { t:"1/3", ok:true, why:"Axis (12.6 + 11.4) ÷ 2 = 12, amplitude 0.6. 11.7 = 12 − 0.3: the axis minus half the amplitude. With height 12 + 0.6 sin φ, that’s sin φ < −1/2, for 7π/6 < φ < 11π/6: 2π/3 of the 2π in each wave, one-third." },
          { t:"1/2", why:"That’s the time below the <strong>axis</strong>, 12 m. 11.7 m is lower than the axis." },
          { t:"2/3", why:"That’s the fraction of each wave the buoy spends <strong>above</strong> 11.7 m." }] } }
    ]
  },
  task:{
    title:"Design a viewing wheel", summary:"Design a viewing wheel",
    statement:"<p>A city wants a Ferris wheel beside a 20 m viewing deck. Choose the radius `r`, the axle height `c` and the time per turn `T` so that all four checks pass. Riders board at the bottom at `t = 0`. There are many working designs, on three different wheels. Can you find more than one?</p>",
    use:"π ≈ 3.14",
    inputs:[{ id:"r", label:"Radius `r` (m)", min:4, max:20 }, { id:"c", label:"Axle height `c` (m)", min:5, max:40 }, { id:"T", label:"Time per turn `T` (s)", min:20, max:120 }],
    checks:[
      "The lowest seat is between 2 m and 8 m above the ground (the boarding platform)",
      "The rider is above the viewing deck for exactly one-third of each turn",
      "Her height never changes faster than 1 m/s",
      "One turn takes at most 90 s"],
    tips:[
      "The lowest seat is `c - r` = {v} m. It must be between 2 m and 8 m.",
      "Right now the rider is above 20 m for {v} of each turn. One-third of a turn is an arc of 2π/3 centred on the top: its ends are π/3 from the top. How high is a seat π/3 from the top, in terms of `c` and `r`?",
      "At the axle the rider moves straight up, at her full speed along the rim: 2π`r`/`T` = {v} m/s. Use a longer turn, or a smaller wheel.",
      "Riders won’t wait more than 90 s for a turn. Use a smaller `T`, and check line 3 still passes."],
    tipWords:{ more:"more than a third", less:"less than a third", none:"none", all:"all" },
    explainPrompt:"Explain why your wheel keeps the rider above the deck for exactly one-third of each turn, and how you chose `T`.",
    vocab:"Use the words amplitude, axis, period and rate of change.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another?",
    twoWheels:"Every working wheel has `c + r/2 = 20`, and the bigger the wheel, the longer each turn must take: `T ≥ 2πr`. With π ≈ 3.14 the shortest turns are 51 s, 63 s and 76 s.",
    deck:"viewing deck",
    invalid:"Enter whole numbers: `r` from 4 to 20, `c` from 5 to 40 and `T` from 20 to 120."
  },
  cards:[
    ["Ferris wheel model, boarding at the bottom", "`h(t) = -r cos(2π/T · t) + c`: radius `r`, axle height `c`, `T` seconds per turn. Check: `h(0) = c - r`, the lowest seat."],
    ["Amplitude in a situation", "(max − min) ÷ 2. For a wheel, the radius. Example: lowest 2 m, top 22 m → 10 m."],
    ["Axis in a situation", "`y` = (max + min) ÷ 2: the axle height, the mean water level, or the average day length."],
    ["`k` from the period", "`k = 2π/T` and `T = 2π/k`. A 60 s turn gives `k = π/30`; `k = π/6` means a 12-hour (or 12-month) cycle."],
    ["Starting point → function", "Bottom: −cos. Top: +cos. Axle level going up: +sin. Axle level going down: −sin."],
    ["Phase shift `d` in context", "In `a cos[k(t - d)] + c` with `a > 0`, `d` is the time of a maximum. High tide at 2:00 → (`t` − 2)."],
    ["Average rate of change", "[`h(t_2) - h(t_1)`] ÷ (`t_2 - t_1`), with units such as m/s: the net change per unit of time. Over a whole cycle it’s 0."],
    ["Where is a sinusoid’s rate greatest? zero?", "Greatest (up or down) where the graph crosses its axis; zero at every maximum and minimum."],
    ["Steepest rate of climb on a wheel", "The rider’s speed along the rim, 2π`r`/`T`, because at axle height she moves straight up. `r` = 10 m, `T` = 60 s → π/3 ≈ 1.05 m/s."],
    ["Equal times, unequal changes", "From the bottom, each sixth of a turn lifts the rider `r/2`, then `r`, then `r/2` (5 m, 10 m, 5 m when `r = 10`)."],
    ["How many times per cycle is a level reached?", "Twice for any level between the min and the max: once going up, once coming down. `h = 17` for `-10 cos(π/30 t) + 12` at `t` = 20 and 40."],
    ["Levels `c ± a/2` (`a` = the amplitude)", "A sinusoid is above `c + a/2` for one-third of each cycle (an arc of 2π/3 around the top) and above `c - a/2` for two-thirds. Example: 17 m on the 10 m wheel with axle 12 m."]
  ]
};
