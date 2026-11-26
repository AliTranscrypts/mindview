// MCV4U 03 Rates of Change. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/03-rates-of-change.md
const LIM = '<span class="rc-lim"><span class="rc-lt">lim</span> <span class="rc-lu">`h → 0`</span></span>';
const DQ = "`{f(a + h) - f(a)}/{h}`";
const Q1FB = "The quotient is `4 + 0.01(100 + h) → 5`. $4.50 is the average over [0, 50]; $725 is `C(50)`.";
const Q2FB = "“At 10:00” is a single moment.";
const Q3FB = "Volume per unit of radius.";
const Q4FB = "The sign gives the direction of change; the volume itself is positive.";

export default {
  id:"03-rates-of-change",
  kind:"topic",
  title:"Rates of change",
  topic:"Rates of Change",
  readyTopic:"rates of change",
  hero:{
    eq:'<span class="rc-eql"><span class="rc-nw"><span class="rc-hw">average rate</span> `{Δs}/{Δt}`</span></span> <span class="rc-eql"><span class="rc-nw"><span class="rc-arr">⟶</span> <span class="rc-hw">instantaneous rate</span></span> <span class="rc-nw">' + LIM + ' <span class="rc-qbox">`{s(t + h) - s(t)}/{h}`</span></span></span>',
    eqLabel:"Average rate equals delta s over delta t, leading to the instantaneous rate: the limit, as h approaches 0, of s of t plus h, minus s of t, all over h.",
    eqSize:"sm",
    headline:"How fast, on average, and how fast right now?",
    text:"An <strong>average rate of change</strong> compares two moments: the change in a quantity divided by the change in time, with units. An <strong>instantaneous rate of change</strong> is the rate at a single moment, found by shrinking the interval to nothing. For motion, these are <strong>average velocity</strong> and <strong>instantaneous velocity</strong>.",
    fig:{ shape:"wide", aria:"A ball rises up a vertical track beside its height graph s(t) = 30t − 5t². A bracket marks the window from t = 1 to t = 3 and the secant shows an average velocity of 10 m/s. The window shrinks toward t = 1 and the secant turns into the tangent: 20 m/s at t = 1." }
  },
  goals:[
    "I can calculate an average rate of change from an equation, a table or a graph, with units.",
    "I can find an instantaneous rate of change using " + LIM + " " + DQ + ".",
    "I can tell average velocity over an interval from instantaneous velocity at a moment.",
    "I can interpret the sign, size and units of a rate in context.",
    "I can decide whether a question asks for an average rate, an instantaneous rate or a value."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Average rates", goal:1, prompt:"A car’s distance from home: at `t = 0` h, 0 km; at `t = 2` h, 150 km; at `t = 5` h, 390 km. What is its average speed from `t = 2` to `t = 5`?",
          options:[
            { t:"80 km/h", ok:true, why:"(390 − 150)/(5 − 2)." },
            { t:"78 km/h", why:"390/5 covers `t = 0` to 5." },
            { t:"240 km/h", why:"Divide by the 3 hours." },
            { t:"1/80 h per km", why:"Speed is km per h." }],
          hints:["Change in distance ÷ change in time.", "240 km in 3 h.", "80 km/h."] },
        { id:"w2", skill:"Average rates", goal:1, prompt:"`f(x) = x^2 - 4x`. What is the average rate of change from `x = 1` to `x = 5`?",
          options:[
            { t:"2", ok:true, why:"`f(5) = 5`, `f(1) = -3`: 8/4." },
            { t:"−2", why:"Keep the same order: `{f(5) - f(1)}/{5 - 1}`." },
            { t:"8", why:"Divide by 4." },
            { t:"6", why:"That’s the rate at one point, not over [1, 5]." }],
          hints:["Find `f(5)` and `f(1)`.", "5 and −3.", "8/4 = 2."] },
        { id:"w3", skill:"Evaluating and expanding", goal:3, prompt:"`s(t) = 30t - 5t^2` metres. What is `s(2)`?",
          options:[
            { t:"40 m", ok:true, why:"60 − 20." },
            { t:"50 m", why:"`5t^2 = 5 × 4 = 20`." },
            { t:"−40 m", why:"Only `t` is squared." },
            { t:"10 m", why:"That’s how fast it’s moving; `s(2)` is where it is." }],
          hints:["Substitute `t = 2`.", "`30(2) - 5(4)`.", "40 m."] },
        { id:"w4", skill:"Evaluating and expanding", goal:2, prompt:"`s(t) = 30t - 5t^2`. Simplify `s(1 + h) - s(1)`.",
          options:[
            { t:"`20h - 5h^2`", ok:true, why:"`30 + 30h - 5(1 + 2h + h^2) - 25`." },
            { t:"`30h - 5h^2`", why:"`-5(2h) = -10h`." },
            { t:"`20h - 5h^2 + 25`", why:"`s(1) = 25` must be subtracted." },
            { t:"`20h + 5h^2`", why:"`-5h^2`, from `-5(h^2)`." }],
          hints:["Find `s(1 + h)` by substituting.", "`25 + 20h - 5h^2`.", "Subtract 25."] },
        { id:"w5", skill:"Units and signs", goal:4, prompt:"A pool’s volume falls from 50 000 L to 38 000 L in 4 h. What is the average rate of change of the volume?",
          options:[
            { t:"−3000 L/h", ok:true, why:"(38 000 − 50 000)/4." },
            { t:"3000 L/h", why:"The volume went down, so the rate is negative." },
            { t:"−12 000 L", why:"A rate is per hour." },
            { t:"−1/3000 h per L", why:"A rate of `y` with respect to `x` has units of `y` per `x`: litres per hour, not hours per litre." }],
          hints:["Change in volume ÷ change in time.", "−12 000 L in 4 h.", "−3000 L/h."] },
        { id:"w6", skill:"Units and signs", goal:4, prompt:"Which units fit the rate of change of a car’s fuel (in litres) with respect to distance driven (in kilometres)?",
          options:[
            { t:"L/km", ok:true, why:"Output per input: litres per kilometre." },
            { t:"km/L", why:"That’s distance per litre, the reverse rate." },
            { t:"L · km", why:"Rates divide." },
            { t:"km/h", why:"That’s speed." }],
          hints:["“Rate of `A` with respect to `B`” is `A` per `B`.", "`A` = fuel (L), `B` = distance (km).", "L/km."] }
      ],
      refreshers:{
        "Average rates":"Average rate = `{f(b) - f(a)}/{b - a}`, the slope of the secant. Keep the same order on top and bottom.",
        "Evaluating and expanding":"Substitute carefully: `5t^2` means `5 × t^2`. When `t = 1 + h`, expand `(1 + h)^2 = 1 + 2h + h^2` before multiplying by 5.",
        "Units and signs":"Units are “output per input”. A negative rate means the quantity is decreasing, not that it’s negative."
      }
    }
  },
  explore:{
    heading:"Motion lab",
    intro:"Choose a time window to see the average rate as a secant. Then shrink the window to catch the rate at a single moment.",
    contexts:{
      ball:{ chip:"Ball", eq:"`s(t) = 30t - 5t^2` m, `0 ≤ t ≤ 6`", note:"Vertical track, using g ≈ 10 m/s² so the numbers stay clean." },
      track:{ chip:"Track", eq:"`s(t) = t^3 - 6t^2 + 9t` m, `0 ≤ t ≤ 4`", note:"Horizontal track: it moves forward, back, then forward." },
      fish:{ chip:"Fish", eq:"`P(t) = 500 + 20t + 3t^2` fish in a pond, `0 ≤ t ≤ 10` years", note:"Not motion: a graph only." }
    },
    predictions:[
      { id:"p1", prompt:"Ball, window [0, 6]. What is the average velocity over the whole flight?",
        options:[{ t:"0 m/s", ok:true }, { t:"15 m/s" }, { t:"30 m/s" }, { t:"−30 m/s" }],
        explain:"`s(0) = s(6) = 0`, so the change in position is 0. The ball travelled 90 m up and down, but average velocity uses the change in position." },
      { id:"p2", prompt:"Ball, Speedometer mode, playing up to `t = 3` (the top). At the highest point, the instantaneous velocity is …",
        options:[{ t:"0 m/s", ok:true }, { t:"45 m/s" }, { t:"30 m/s, its greatest" }, { t:"−10 m/s" }],
        explain:"At the top the ball stops rising and starts falling: its velocity is 0 there. 45 m is the height. The ball is at its slowest at the top, not its fastest." },
      { id:"p3", prompt:"Ball, `a = 4`, Shrink mode. As the window shrinks, the secant slopes approach …",
        options:[{ t:"−10 m/s", ok:true }, { t:"10 m/s" }, { t:"40 m/s" }, { t:"0 m/s" }],
        explain:"The quotient `30 - 10(4) - 5h = -10 - 5h` approaches −10. Negative: the ball is falling. 40 m is `s(4)`." },
      { id:"p4", prompt:"Track, window [0, 4]. What is the average velocity over [0, 4]?",
        options:[{ t:"1 m/s", ok:true }, { t:"3 m/s" }, { t:"0 m/s" }, { t:"9 m/s" }],
        explain:"Change in position: `s(4) - s(0) = 4` m over 4 s. 3 m/s is the total distance (12 m) ÷ 4, which is the average speed." }
    ],
    chalIntro:"Use the motion lab to meet each goal, then press <strong>Check challenge</strong>. For “the moment” in challenge 2, use the time slider in Speedometer mode (or the start time `a`). Challenge 3 has its own answer box below the lab. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Ball: set a window 1 s wide whose average velocity is exactly 5 m/s.",
        why:"On [2, 3], `s(2) = 40` and `s(3) = 45`: a change of 5 m in 1 s.",
        hints:["For a window `[a, a + 1]`, the average velocity is `30 - 10a - 5`.", "`25 - 10a = 5`.", "`a = 2`: the window [2, 3]."],
        msgs:{ straddle:"That window straddles the top, so its average is 0 m/s.", falling:"That’s −5 m/s: the ball is falling." } },
      { id:"tc2", goal:[2, 3], prompt:"Ball: find the moment when the instantaneous velocity equals the average velocity over [0, 4].",
        why:"The average over [0, 4] is `s(4)/4 = 10` m/s, and the velocity `30 - 10t` is 10 at `t = 2`.",
        hints:["Average over [0, 4]: `s(4)/4`.", "40/4 = 10 m/s.", "`30 - 10t = 10` at `t = 2`."],
        msgs:{ ends:"Those are the window’s ends. The velocity there is 30 or −10 m/s.", top:"At the top the velocity is 0; the average over [0, 4] is 10 m/s." } },
      { id:"tc3", goal:3, stretch:true, prompt:"Track: find both times in [0, 4] when the particle is at rest, then the total distance it travels from `t = 0` to `t = 4`.",
        why:"The velocity `3t^2 - 12t + 9 = 3(t - 1)(t - 3)` is 0 at `t = 1` and `t = 3`. The legs 0 → 4 m, 4 → 0 m and 0 → 4 m add to 12 m.",
        hints:["At rest means instantaneous velocity 0. The simplified quotient’s `h`-free part is `3a^2 - 12a + 9`.", "`3(a - 1)(a - 3) = 0`, so `t = 1` and `t = 3`. Positions: `s(0) = 0`, `s(1) = 4`, `s(3) = 0`, `s(4) = 4`.", "Legs of 4 m, 4 m and 4 m: 12 m."],
        msgs:{ dist4:"That’s the change in position. Add the distance for each leg of the trip.", t0:"`s(0) = 0` is a position, not a velocity." } }
    ]
  },
  part3:{
    slug:"contexts", name:"Contexts",
    heading:"Rates in the real world",
    intro:"Rates aren’t only about motion. Sort statements into average and instantaneous, find both kinds of rate for three new contexts, then say what a rate means in words. Work through the three stations, then try the quick check.",
    s1:{ title:"Station 1: average or instantaneous?", how:"Read each card and decide. Your choice flips the card to show its kind and why.",
      cards:[
        { id:"c1", t:"“The speedometer reads 80 km/h.”", answer:"inst", why:"A speedometer shows the rate at one moment." },
        { id:"c2", t:"“The trip averaged 80 km/h.”", answer:"avg", why:"“Averaged” means over the whole trip: an interval of time." },
        { id:"c3", t:"“At noon the temperature was rising 2 °C per hour.”", answer:"inst", why:"“At noon” is a single moment." },
        { id:"c4", t:"“From 2000 to 2020 the town grew by 1500 people per year.”", answer:"avg", why:"“From 2000 to 2020” is an interval." },
        { id:"c5", t:"“When the photo was taken, the balloon’s volume was growing at 30 cm³ per second.”", answer:"inst", why:"“When the photo was taken” is a single moment." },
        { id:"c6", t:"“Over the 4 hours, the pool drained at 3000 L/h.”", answer:"avg", why:"“Over the 4 hours” is an interval." }
      ] },
    s2:{ title:"Station 2: three contexts, one method", how:"Choose a context, then step through it: the formula, an average rate over an interval, then shrink the interval to get the instantaneous rate.",
      contexts:{
        cost:{ chip:"Cost", eq:"`C(x) = 500 + 4x + 0.01x^2` dollars for `x` items",
          avg:"`C(100) = 1000`, `C(200) = 1700`: (1700 − 1000)/100 = $7 per item on [100, 200].",
          inst:"The quotient `6 + 0.01h → 6`: $6 per item at `x = 100` (often called the <strong>marginal cost</strong>).",
          alg:"`C(100 + h) = 500 + 4(100 + h) + 0.01(100 + h)^2 = 1000 + 6h + 0.01h^2`, so `{C(100 + h) - C(100)}/{h} = 6 + 0.01h`, which approaches 6 as `h → 0`." },
        fish:{ chip:"Fish", eq:"`P(t) = 500 + 20t + 3t^2` fish after `t` years",
          avg:"`P(0) = 500`, `P(5) = 675`: 35 fish per year on [0, 5].",
          inst:"Rate at `t = 5`: `20 + 30 = 50` fish per year.",
          alg:"`P(5 + h) = 500 + 20(5 + h) + 3(5 + h)^2 = 675 + 50h + 3h^2`, so the quotient is `20 + 3(10 + h) = 50 + 3h`, which approaches 50 as `h → 0`." },
        balloon:{ chip:"Balloon", eq:"`V(r) = {4}/{3}πr^3` cm³",
          avg:"`V(0) = 0`, `V(3) = 36π`: 12π cm³ per cm on [0, 3].",
          inst:"Rate with respect to the radius at `r = 3`: `4π(3)^2 = 36π` cm³ per cm.",
          alg:"`{(3 + h)^3 - 27}/{h} = 27 + 9h + h^2`, times `{4}/{3}π` → 36π as `h → 0`." }
      } },
    s3:{ title:"Station 3: say what it means", how:"A rate with a sign and units can be said in plain words. Tap a blank, then choose the words for it. Build all three sentences.",
      tpl:"At {moment}, the {quantity} is {dir} at {size} {units}.",
      items:[
        { id:"sb1", name:"Ball", stmt:"At `t = 4` s, the ball’s height is changing at −10 m/s.", done:"At 4 s the ball is <strong>falling</strong> at <strong>10 m/s</strong>.",
          slots:{
            moment:{ label:"moment", chips:[{ t:"4 s", ok:true }, { t:"10 s", fb:"10 is the size of the rate. The moment is `t = 4`." }, { t:"40 s", fb:"40 m is the height at 4 s, not a time." }] },
            quantity:{ label:"quantity", chips:[{ t:"ball", ok:true }, { t:"velocity", fb:"The velocity is the rate. The ball is what moves." }, { t:"time", fb:"Time is the input. The ball is what moves." }] },
            dir:{ label:"direction word", chips:[{ t:"rising", fb:"The rate is negative: the height is going down." }, { t:"falling", ok:true }, { t:"increasing", fb:"The rate is negative, so the height is going down. For a ball, say rising or falling." }, { t:"decreasing", fb:"Right direction, but a ball moves up or down: say rising or falling." }] },
            size:{ label:"size", chips:[{ t:"10", ok:true }, { t:"−10", fb:"“Falling” already says which way, so the size is 10." }, { t:"40", fb:"40 m is `s(4)`, where the ball is, not how fast it moves." }] },
            units:{ label:"units", chips:[{ t:"m/s", ok:true }, { t:"s/m", fb:"Units are output per input: metres per second." }, { t:"m", fb:"A rate needs a “per”: metres per second." }] }
          } },
        { id:"sb2", name:"Fish", stmt:"At `t = 5` years, the fish population `P` is changing at 50 fish per year.", done:"At 5 years the fish population is <strong>increasing</strong> at <strong>50 fish per year</strong>.",
          slots:{
            moment:{ label:"moment", chips:[{ t:"5 years", ok:true }, { t:"50 years", fb:"50 is the size of the rate. The moment is `t = 5`." }, { t:"10 years", fb:"The moment is `t = 5`." }] },
            quantity:{ label:"quantity", chips:[{ t:"fish population", ok:true }, { t:"time", fb:"Time is the input. The population is what changes." }, { t:"rate", fb:"The rate says how fast; the population is what changes." }] },
            dir:{ label:"direction word", chips:[{ t:"rising", ok:true }, { t:"falling", fb:"The rate is positive: the population is growing." }, { t:"increasing", ok:true }, { t:"decreasing", fb:"The rate is positive: the population is growing." }] },
            size:{ label:"size", chips:[{ t:"50", ok:true }, { t:"675", fb:"675 is `P(5)`, the number of fish." }, { t:"35", fb:"35 fish per year is the average over [0, 5], not the rate at `t = 5`." }] },
            units:{ label:"units", chips:[{ t:"fish per year", ok:true }, { t:"years per fish", fb:"Units are output per input: fish per year." }, { t:"fish", fb:"A rate needs a “per”: fish per year." }] }
          } },
        { id:"sb3", name:"Cost", stmt:"At `x = 100` items, the cost `C` is changing at $6 per item.", done:"At 100 items the cost is <strong>increasing</strong> at <strong>$6 per item</strong>.",
          slots:{
            moment:{ label:"moment", chips:[{ t:"100 items", ok:true }, { t:"6 items", fb:"6 is the size of the rate. The moment is `x = 100`." }, { t:"200 items", fb:"The moment is `x = 100`." }] },
            quantity:{ label:"quantity", chips:[{ t:"cost", ok:true }, { t:"number of items", fb:"The number of items is the input. The cost is what changes." }, { t:"rate", fb:"The rate says how fast; the cost is what changes." }] },
            dir:{ label:"direction word", chips:[{ t:"rising", ok:true }, { t:"falling", fb:"The rate is positive: the cost is going up." }, { t:"increasing", ok:true }, { t:"decreasing", fb:"The rate is positive: the cost is going up." }] },
            size:{ label:"size", chips:[{ t:"$6", ok:true }, { t:"$7", fb:"$7 per item is the average from 100 to 200 items." }, { t:"$1000", fb:"`C(100) = 1000` is the total cost of 100 items." }] },
            units:{ label:"units", chips:[{ t:"per item", ok:true }, { t:"items per dollar", fb:"Units are output per input: dollars per item." }, { t:"in total", fb:"A rate isn’t a total: it’s dollars per item." }] }
          } }
      ] },
    blocks:[
      { title:"Three contexts side by side", html:'<div class="tbl-wrap"><table class="vt rc-sum"><caption class="vh">Average and instantaneous rates in three contexts</caption><thead><tr><th scope="col">Context</th><th scope="col">Average rate (interval)</th><th scope="col">Instantaneous rate</th></tr></thead><tbody>' +
        "<tr><td>Cost</td><td>`C(100) = 1000`, `C(200) = 1700`: (1700 − 1000)/100 = $7 per item on [100, 200]</td><td>$6 per item at `x = 100`</td></tr>" +
        "<tr><td>Fish</td><td>`P(0) = 500`, `P(5) = 675`: 35 fish per year on [0, 5]</td><td>50 fish per year at `t = 5`</td></tr>" +
        "<tr><td>Balloon</td><td>`V(0) = 0`, `V(3) = 36π`: 12π cm³ per cm on [0, 3]</td><td>36π cm³ per cm at `r = 3`</td></tr></tbody></table></div>" }
    ],
    quickCheck:{
      title:"Quick check", summary:"Contexts quick check",
      items:[
        { id:"q1", goal:2, prompt:"`C(x) = 500 + 4x + 0.01x^2`. Instantaneous rate of change of cost at `x = 50`?",
          choices:[
            { t:"$5 per item", ok:true, fb:"Right. The quotient is `4 + 0.01(100 + h)`, which approaches 5." },
            { t:"$4.50 per item", fb:Q1FB },
            { t:"$725", fb:Q1FB },
            { t:"$1 per item", fb:Q1FB }] },
        { id:"q2", goal:5, prompt:"Which is an instantaneous rate?",
          choices:[
            { t:"“The tide was rising 0.3 m/h at 10:00”", ok:true, fb:"Right. " + Q2FB },
            { t:"“The tide rose 1.2 m from 8:00 to 12:00”", fb:Q2FB },
            { t:"“The average depth was 3 m”", fb:Q2FB },
            { t:"“The tide rose 0.3 m/h on average from 8:00 to 12:00”", fb:Q2FB }] },
        { id:"q3", goal:4, prompt:"Units of the rate of change of a balloon’s volume (cm³) with respect to its radius (cm)?",
          choices:[
            { t:"cm³/cm", ok:true, fb:"Right. " + Q3FB },
            { t:"cm/cm³", fb:Q3FB },
            { t:"cm³", fb:Q3FB },
            { t:"cm³/s", fb:Q3FB }] },
        { id:"q4", goal:4, prompt:"A rate of −15 L/min at `t = 2` means …",
          choices:[
            { t:"At `t = 2` the volume is decreasing by 15 L each minute", ok:true, fb:"Right. " + Q4FB },
            { t:"The volume is −15 L", fb:Q4FB },
            { t:"The volume fell 15 L in 2 min", fb:Q4FB },
            { t:"The tank empties in 15 min", fb:Q4FB }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Average, instantaneous or not a rate?", noun:"card", txt:true, goal:[3, 5],
        instruction:"Sort each card: is it an average rate, an instantaneous rate, or not a rate at all?",
        boxes:[{ id:"avg", label:"Average", sub:"over an interval" }, { id:"inst", label:"Instantaneous", sub:"at one moment" }, { id:"none", label:"Not a rate", sub:"a value or a change" }],
        wrongDefault:"Ask: is there a “per”, and is it over an interval or at a moment? Try another box.",
        items:[
          { id:"i1", t:"“The car’s speedometer reads 90 km/h.”", answer:"inst", why:"A speedometer shows the rate at one moment." },
          { id:"i2", t:"“The 12 km hike took 4 h: 3 km/h.”", answer:"avg", why:"12 km ÷ 4 h is a rate over the whole hike." },
          { id:"i3", t:"“The stock price fell $6 from Monday to Friday.”", answer:"none", why:"$6 is a change in price, with no “per”.",
            wrong:{ avg:"It’s a change, but not divided by time: no “per”." },
            hints:["Is anything divided by time?", "No: $6 is a change.", "Not a rate."] },
          { id:"i4", t:"“At 3 p.m. the temperature was dropping 2 °C per hour.”", answer:"inst", why:"“At 3 p.m.” is a single moment." },
          { id:"i5", t:"“From 2010 to 2020 the town grew by 400 people per year.”", answer:"avg", why:"“From 2010 to 2020” is an interval." },
          { id:"i6", t:"“The slope of the tangent to the height graph at `t = 2`.”", answer:"inst", why:"A tangent slope is the rate at one moment." },
          { id:"i7", t:"“The slope of the secant from `t = 1` to `t = 5`.”", answer:"avg", why:"A secant slope is the average rate over [1, 5]." },
          { id:"i8", t:"“The ball’s height at `t = 2` is 40 m.”", answer:"none", why:"A height is a value, not a rate.",
            wrong:{ avg:"A height is a value.", inst:"A height is a value." } },
          { id:"i9", t:LIM + " `{V(3 + h) - V(3)}/{h}`", answer:"inst", why:"The limit shrinks the interval to the single time 3.",
            wrong:{ avg:"The limit shrinks the interval to one moment." },
            hints:["What does " + LIM + " do to the interval?", "It shrinks [3, 3 + `h`] to the single time 3.", "Instantaneous."] },
          { id:"i10", t:"`{P(8) - P(2)}/{6}`", answer:"avg", why:"No limit: it’s the slope of the secant over [2, 8].",
            wrong:{ inst:"No limit: it’s the secant over [2, 8]." } }
        ] },
      { id:"rates", type:"custom", title:"Rate problems", summary:"Rate problems", star:true, goal:[1, 2, 3, 4],
        instruction:"Solve each problem. Type a number in each box; the units are shown beside it.",
        how:"Type whole numbers, decimals or fractions such as 5/2. Press Check when every box is filled.",
        items:[
          { id:"r1", goal:1, prompt:"`s(t) = 40t - 5t^2` m. Average velocity over [1, 3]?",
            boxes:[{ k:"v", label:"Average velocity", unit:"m/s" }], answer:{ v:20 },
            wrong:[{ k:"v", v:75, fb:"That’s `s(3)`, a position." }],
            why:"`{s(3) - s(1)}/{3 - 1} = {75 - 35}/{2} = 20` m/s.",
            hints:["Average velocity = change in position ÷ change in time.", "`s(1) = 35` and `s(3) = 75`.", "(75 − 35)/2 = 20 m/s."] },
          { id:"r2", goal:2, prompt:"Same ball. Instantaneous velocity at `t = 3`?",
            boxes:[{ k:"v", label:"Instantaneous velocity", unit:"m/s" }], answer:{ v:10 },
            wrong:[{ k:"v", v:20, fb:"That’s the average over [1, 3]." }],
            why:"The quotient `{s(3 + h) - s(3)}/{h}` simplifies to `10 - 5h`, which approaches 10 m/s.",
            hints:["Simplify the quotient `{s(3 + h) - s(3)}/{h}`.", "It simplifies to `10 - 5h`.", "As `h → 0`: 10 m/s."] },
          { id:"r3", goal:3, star:true, prompt:"When does it reach its maximum height, and what is that height?",
            boxes:[{ k:"t", label:"Time of the top", pre:"`t =`", unit:"s" }, { k:"s", label:"Maximum height", unit:"m" }], answer:{ t:4, s:80 },
            wrong:[{ k:"t", v:8, fb:"That’s when it lands; the top is where the velocity is 0." }],
            why:"The velocity `40 - 10t` is 0 at `t = 4`, and `s(4) = 160 - 80 = 80` m.",
            hints:["At the top, the velocity is 0.", "The quotient’s `h`-free part is `40 - 10t`, which is 0 at `t = 4`.", "`s(4) = 160 - 80 = 80`: `t = 4` s and 80 m."] },
          { id:"r4", goal:3, star:true, prompt:"At what time does its instantaneous velocity equal its average velocity over [0, 6]?",
            boxes:[{ k:"t", label:"Time", pre:"`t =`", unit:"s" }], answer:{ t:3 },
            wrong:[{ k:"t", v:6, fb:"Average over [0, 6] = `s(6)/6` = 10 m/s; solve `40 - 10t = 10`." }],
            why:"The average over [0, 6] is `s(6)/6 = 60/6 = 10` m/s, and `40 - 10t = 10` at `t = 3`.",
            hints:["Find the average velocity over [0, 6] first.", "`s(6)/6 = 60/6 = 10` m/s.", "`40 - 10t = 10` gives `t = 3` s."] },
          { id:"r5", goal:3, star:true, prompt:"A particle moves along a line: `s(t) = t^3 - 9t^2 + 24t` m, `0 ≤ t ≤ 5`. Total distance travelled?",
            boxes:[{ k:"d", label:"Total distance", unit:"m" }], answer:{ d:28 },
            wrong:[{ k:"d", v:20, fb:"That’s the change in position. It turns back at `t = 2` and `t = 4`." }],
            why:"It turns back at `t = 2` and `t = 4`: legs of 20 m, 4 m and 4 m, so 28 m.",
            hints:["Find when the velocity is 0: the quotient’s `h`-free part is `3t^2 - 18t + 24`.", "`3(t - 2)(t - 4) = 0`. Positions: `s(0) = 0`, `s(2) = 20`, `s(4) = 16`, `s(5) = 20`.", "20 + 4 + 4 = 28 m."] },
          { id:"r6", goal:4, star:true, prompt:"A balloon’s volume is `V = {4}/{3}πr^3`. At what radius is the rate of change of volume with respect to radius 100π cm³ per cm?",
            boxes:[{ k:"r", label:"Radius", pre:"`r =`", unit:"cm" }], answer:{ r:5 },
            wrong:[{ k:"r", v:25, fb:"`4πr^2 = 100π` gives `r^2 = 25`." }],
            why:"The rate is `4πr^2`, and `4πr^2 = 100π` gives `r = 5` cm.",
            hints:["The rate of change of `{4}/{3}πr^3` with respect to `r` is `4πr^2` (Part 3).", "`4πr^2 = 100π`.", "`r = 5` cm."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Carlos", how:"", goal:[3, 4],
        instruction:"Carlos made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"`s(t) = 20t - 5t^2` m. Find the average velocity from `t = 1` to `t = 3`.",
            steps:["`s(1) = 15`.", "`s(3) = 60 - 45 = 15`.", "The ball rises to 20 m at `t = 2`, then falls back, so it travels 5 + 5 = 10 m.", "Average velocity = distance ÷ time = 10/2 = 5 m/s.", "So the ball moved upward at 5 m/s on average."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "Step 3 is true: that’s the distance travelled.", "", "Step 5 follows step 4. The mistake is earlier."],
            fixes:[
              { t:"Average velocity = change in position ÷ time = (15 − 15)/2 = 0 m/s.", ok:true, why:"Distance ÷ time is the average <strong>speed</strong>; velocity uses displacement, which is 0 here." },
              { t:"= 15/3 = 5 m/s.", why:"That’s `s(3)/3`, as if the trip started at `t = 0`. Velocity uses the change in position over [1, 3]." },
              { t:"= (20 − 15)/1 = 5 m/s.", why:"That’s only [1, 2], while the ball rose. The window is [1, 3]." },
              { t:"Step 4 is correct.", why:"Distance ÷ time is the average <strong>speed</strong>; velocity uses displacement." }],
            hints:["What does average velocity divide?", "The change in position.", "0 m/s."] },
          { id:"e2", goal:4, task:"`C(x) = 300 + 3x + 0.02x^2` dollars for `x` items. Find and interpret the instantaneous rate of change of cost at `x = 100`.",
            steps:["Use `{C(100 + h) - C(100)}/{h}`.", "`C(100 + h) = 300 + 300 + 3h + 0.02(10 000 + 200h + h^2) = 800 + 7h + 0.02h^2`.", "`C(100) = 800`, so the quotient is `7 + 0.02h`.", "As `h → 0`, the rate is 7.", "So 100 items cost $7 in total."],
            answer:4,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "Step 4 is correct.", ""],
            fixes:[
              { t:"At `x = 100`, the cost is rising by about $7 per extra item.", ok:true, why:"A rate has units of dollars <strong>per item</strong>: one more item adds about $7." },
              { t:"The 100th item costs $800.", why:"$800 is the total for 100 items." },
              { t:"Each item costs $8 on average.", why:"That’s `C(100)/100`, the average cost, a different idea." },
              { t:"Step 5 is correct.", why:"A rate isn’t a total: its units are dollars <strong>per item</strong>." }],
            hints:["What are the units of the rate?", "Dollars per item.", "About $7 more for each extra item at `x = 100`."] },
          { id:"e3", goal:4, task:"A town’s population is `P(t) = 4000 + 30t^2`, with `t` in years. How fast is it growing at `t = 5`?",
            steps:["Quotient: `{30(5 + h)^2 - 30(25)}/{h}` (the 4000s cancel).", "`= {300h + 30h^2}/{h} = 300 + 30h`.", "As `h → 0`, the rate is 300.", "So the population grows by 300 years per person."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"It grows by 300 people per year at `t = 5`.", ok:true, why:"A rate of population with respect to time has units of people per year." },
              { t:"300 people.", why:"A rate needs “per year”." },
              { t:"4750 people per year.", why:"`P(5) = 4750` is the population." },
              { t:"Step 4 is correct.", why:"Population per time: people per year." }],
            hints:["Rate of population with respect to time: what over what?", "People per year.", "300 people per year."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the motion lab: an average velocity of 0 for a moving ball, or a velocity of 0 at the very top?" },
      { id:"j2", q:"In your own words, what’s the difference between an average rate of change and an instantaneous one?" },
      { id:"j3", q:"Explain to a friend how to find the instantaneous rate of change of a cost function at one value." },
      { id:"j4", q:"Which do you mix up most: rates and values, signs, or units? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Temperature readings: 90 °C at `t = 0` min, 70 °C at `t = 4` min, 52 °C at `t = 10` min. What is the average rate of change from `t = 4` to `t = 10`?", options:[
          { t:"−3 °C/min", ok:true, why:"(52 − 70)/6." },
          { t:"3 °C/min", why:"The temperature fell." },
          { t:"−3.8 °C/min", why:"That’s from `t = 0` to 10." },
          { t:"−18 °C", why:"Divide by the 6 minutes." }] },
        b:{ prompt:"20 °C at `t = 0` min, 35 °C at `t = 5` min, 47 °C at `t = 8` min. Average rate from `t = 5` to `t = 8`?", options:[
          { t:"4 °C/min", ok:true, why:"(47 − 35)/3." },
          { t:"−4 °C/min", why:"Keep the same order: (47 − 35)/(8 − 5)." },
          { t:"3.375 °C/min", why:"That’s from `t = 0` to 8." },
          { t:"12 °C", why:"Divide by the 3 minutes." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which expression gives the instantaneous rate of change of `f` at `x = 3`?", options:[
          { t:LIM + " `{f(3 + h) - f(3)}/{h}`", ok:true, why:"The limit shrinks the interval [3, 3 + `h`] to the single value 3." },
          { t:"`{f(3 + h) - f(3)}/{h}`", why:"Without the limit, it’s an average over [3, 3 + `h`]." },
          { t:LIM + " `[f(3 + h) - f(3)]`", why:"That approaches 0: you need to divide by `h`." },
          { t:"`{f(3) - f(0)}/{3}`", why:"That’s the average over [0, 3]." }] },
        b:{ prompt:"Which expression gives the instantaneous rate of change of `s` at `t = 5`?", options:[
          { t:LIM + " `{s(5 + h) - s(5)}/{h}`", ok:true, why:"The limit shrinks the interval [5, 5 + `h`] to the single time 5." },
          { t:"`{s(5 + h) - s(5)}/{h}`", why:"Without the limit, it’s an average over [5, 5 + `h`]." },
          { t:LIM + " `[s(5 + h) - s(5)]`", why:"That approaches 0: you need to divide by `h`." },
          { t:"`{s(5) - s(0)}/{5}`", why:"That’s the average over [0, 5]." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"At 2 p.m., the rate of change of a pool’s depth is −4 cm/h. Which statement is correct?", options:[
          { t:"At 2 p.m. the depth is decreasing by 4 cm per hour.", ok:true, why:"−4 cm/h means the depth is decreasing by 4 cm each hour. The depth itself is positive." },
          { t:"The depth at 2 p.m. is −4 cm.", why:"The sign gives the direction of change; the depth itself is positive." },
          { t:"The depth fell 4 cm between 1 p.m. and 2 p.m.", why:"That’s an average over an hour, not the rate at 2 p.m." },
          { t:"The depth is increasing by 4 cm per hour.", why:"The negative sign means decreasing." }] },
        b:{ prompt:"On day 10, a company’s profit is changing at +250 $/day. Which statement is correct?", options:[
          { t:"On day 10 the profit is increasing by $250 per day.", ok:true, why:"A positive rate means the profit is increasing." },
          { t:"The profit on day 10 is $250.", why:"That’s a value. $250 per day is how fast the profit is changing." },
          { t:"The profit rose $250 from day 9 to day 10.", why:"That’s an average over a day, not the rate on day 10." },
          { t:"The profit is decreasing by $250 per day.", why:"The positive sign means increasing." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"`s(t) = 45t - 5t^2` m. At what time is the instantaneous velocity 15 m/s?", options:[
          { t:"`t = 3` s", ok:true, why:"The quotient gives `45 - 10t`; `45 - 10t = 15`." },
          { t:"`t = 6` s", why:"The average velocity over `[0, t]` is `45 - 5t`, which is 15 at 6 s; that’s not the velocity at a moment." },
          { t:"`t = 4.5` s", why:"That’s the top, where the velocity is 0." },
          { t:"`t = 9` s", why:"That’s when the ball lands." }] },
        b:{ prompt:"`s(t) = 60t - 5t^2` m. At what time is the instantaneous velocity 20 m/s?", options:[
          { t:"`t = 4` s", ok:true, why:"`60 - 10t = 20`." },
          { t:"`t = 8` s", why:"The average velocity over `[0, t]` is `60 - 5t`, which is 20 at 8 s; that’s not the velocity at a moment." },
          { t:"`t = 6` s", why:"That’s the top, where the velocity is 0." },
          { t:"`t = 12` s", why:"That’s when the ball lands." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"Use the limit of the difference quotient to find the instantaneous rate of change of `f(x) = x^2 - 5x` at `x = 4`.", options:[
          { t:"3", ok:true, why:"The quotient is `2(4) - 5 + h = 3 + h`, which approaches 3." },
          { t:"−4", why:"`f(4) = -4` is a value." },
          { t:"−1", why:"That’s the average over [0, 4]." },
          { t:"8", why:"The `-5x` term contributes −5." }] },
        b:{ prompt:"Find the instantaneous rate of change of `f(x) = x^2 + 3x` at `x = -2`.", options:[
          { t:"−1", ok:true, why:"`2(-2) + 3`." },
          { t:"−2", why:"`f(-2) = -2` is a value." },
          { t:"1", why:"That’s the average over [−2, 0]." },
          { t:"−4", why:"Include the `3x` term: it contributes 3." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"An oil spill is a circle with area `A = πr^2`. How fast is the area changing with respect to the radius when `r = 10` m?", options:[
          { t:"20π m² per m", ok:true, why:"The quotient is `π(20 + h)`, which approaches 20π." },
          { t:"100π m²", why:"That’s the area." },
          { t:"10π m² per m", why:"That’s the average over [0, 10]." },
          { t:"20 m² per m", why:"Keep the π: `A = πr^2`." }] },
        b:{ prompt:"A square tile has area `A = s^2`. How fast is the area changing with respect to the side length when `s = 7` cm?", options:[
          { t:"14 cm² per cm", ok:true, why:"The quotient is `14 + h`." },
          { t:"49 cm²", why:"That’s the area." },
          { t:"7 cm² per cm", why:"That’s the average over [0, 7]." },
          { t:"14 cm per cm²", why:"Units are output per input: cm² per cm, not cm per cm²." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Over [0, 6] a ball’s average velocity is 0 m/s, yet it clearly moved. Which explanation is best?", options:[
          { t:"“Average velocity uses the change in position. The ball rose and fell back to its starting height, so its displacement is 0, even though the distance it travelled wasn’t.”", ok:true, why:"Up and down by the same amount is a change in position of 0." },
          { t:"“The ball was at rest the whole time.”", why:"It moved 90 m." },
          { t:"“Thrown balls always have average velocity 0.”", why:"Only when the window starts and ends at the same height." },
          { t:"“The velocity was 0 at `t = 3`, so the average is 0.”", why:"One moment doesn’t set the average." }] },
        b:{ prompt:"A runner completes one 400 m lap of a track, finishing where she started, in 80 s. Why is her average velocity 0 m/s but her average speed 5 m/s?", options:[
          { t:"“Velocity uses displacement, which is 0 for a full lap; speed uses the 400 m of distance.”", ok:true, why:"400 m ÷ 80 s = 5 m/s is the average speed; a full lap’s displacement is 0." },
          { t:"“She stopped at the finish line, so her velocity is 0.”", why:"Average velocity doesn’t depend on the final moment." },
          { t:"“Velocity and speed are the same, so one of the numbers is wrong.”", why:"Average velocity uses the change in position; average speed uses the distance travelled." },
          { t:"“Her velocity was 0 at the start, so the average is 0.”", why:"One moment doesn’t set the average." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which question asks for an instantaneous rate of change?", options:[
          { t:"“How fast was the water level rising at exactly 3 p.m.?”", ok:true, why:"“At exactly 3 p.m.” is a single moment." },
          { t:"“How much did the water level rise from 1 p.m. to 3 p.m.?”", why:"That’s a change, not a rate." },
          { t:"“What was the average rate of rise from 1 p.m. to 3 p.m.?”", why:"That’s an average." },
          { t:"“What was the water level at 3 p.m.?”", why:"That’s a value." }] },
        b:{ prompt:"Which question asks for an instantaneous rate of change?", options:[
          { t:"“What did the car’s speedometer read as it passed the school?”", ok:true, why:"A speedometer reads the rate at one moment." },
          { t:"“How far did the car go between the two lights?”", why:"That’s a distance, not a rate." },
          { t:"“What was the car’s average speed between the lights?”", why:"That’s an average." },
          { t:"“How far from home was the car at 4 p.m.?”", why:"That’s a value." }] } },
      { id:"a1", cat:"A", goal:2,
        a:{ prompt:"A bakery’s profit from selling `x` loaves is `P(x) = 3x - 0.01x^2` dollars (`0 ≤ x ≤ 200`). What is the instantaneous rate of change of profit at `x = 100`, and what does it mean?", options:[
          { t:"$1 per loaf: one more loaf adds about $1 of profit", ok:true, why:"The quotient is `3 - 0.01(200 + h)`, which approaches 1." },
          { t:"$200: the profit at 100 loaves", why:"That’s `P(100)`, a value, not a rate." },
          { t:"$2 per loaf: the average from 0 to 100 loaves", why:"That’s the average over [0, 100], not the rate at `x = 100`." },
          { t:"−$1 per loaf: profit is falling", why:"The rate is positive at `x = 100`." }] },
        b:{ prompt:"`P(x) = 5x - 0.02x^2` dollars (`0 ≤ x ≤ 250`). Instantaneous rate of change at `x = 50`, and its meaning?", options:[
          { t:"$3 per loaf: one more loaf adds about $3", ok:true, why:"The quotient is `5 - 0.02(100 + h)`, which approaches 3." },
          { t:"$200: the profit at 50 loaves", why:"That’s `P(50)`, a value, not a rate." },
          { t:"$4 per loaf: the average from 0 to 50", why:"That’s the average over [0, 50], not the rate at `x = 50`." },
          { t:"−$3 per loaf: profit is falling", why:"The rate is positive at `x = 50`." }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"A cart’s position is `s(t) = t^2 - 6t` metres from a sensor, `0 ≤ t ≤ 8`. When is the cart at rest, and what is its velocity at `t = 5`?", options:[
          { t:"At rest at `t = 3` s; 4 m/s at `t = 5`", ok:true, why:"The quotient gives `2t - 6`: 0 at `t = 3` and 4 at `t = 5`." },
          { t:"At rest at `t = 0` and 6 s; −5 m/s at `t = 5`", why:"Those are where `s = 0`, and −5 is `s(5)`." },
          { t:"At rest at `t = 3` s; −5 m/s at `t = 5`", why:"−5 m is the position at `t = 5`." },
          { t:"At rest at `t = 3` s; −1 m/s at `t = 5`", why:"That’s the average velocity over [0, 5]." }] },
        b:{ prompt:"`s(t) = t^2 - 8t` metres, `0 ≤ t ≤ 10`. When is the cart at rest, and what is its velocity at `t = 6`?", options:[
          { t:"At rest at `t = 4` s; 4 m/s at `t = 6`", ok:true, why:"The quotient gives `2t - 8`: 0 at `t = 4` and 4 at `t = 6`." },
          { t:"At rest at `t = 0` and 8 s; −12 m/s at `t = 6`", why:"Those are where `s = 0`, and −12 is `s(6)`." },
          { t:"At rest at `t = 4` s; −12 m/s at `t = 6`", why:"−12 m is the position at `t = 6`." },
          { t:"At rest at `t = 4` s; −2 m/s at `t = 6`", why:"That’s the average velocity over [0, 6]." }] } }
    ]
  },
  task:{
    title:"Design a launch", summary:"Design a launch",
    statement:"<p>A ball is launched upward with height `s(t) = vt - 5t^2` metres. Choose the launch speed `v` and a time window [`a`, `b`] that meet every condition. Can you find all the answers?</p>" +
      '<div class="refresh" style="margin:0 0 12px"><h4>The conditions</h4><ol style="margin:0;padding-left:1.3em"><li>The average velocity on [`a`, `b`] is 0 m/s.</li><li>The window lasts exactly 4 s.</li><li>The instantaneous velocity at `t = a` is 20 m/s.</li><li>The maximum height is less than 100 m.</li><li>The window lies within the flight (the ball hasn’t landed).</li></ol></div>' +
      '<p class="tiny muted">Set `v` from 5 to 50 m/s in steps of 5, and `a` and `b` from 0 to 10 s in steps of 0.5, with `a < b`. The preview shows the ball on its track and the height graph with your window bracketed, its secant, and the tangent at `t = a`.</p>',
    checks:["Average velocity 0 on [`a`, `b`]", "Window lasts 4 s", "Velocity 20 m/s at `t = a`", "Maximum height under 100 m", "Window within the flight"],
    tips:["Zero average velocity means the ball is at the same height at `a` and `b`: the window is centred on the top, at `t = v/10`.",
      "Make `b - a = 4`.",
      "The velocity at `a` is `v - 10a`.",
      "The top is at `t = v/10`, height `v^2/20`.",
      "The ball lands at `t = v/5`."],
    explainPrompt:"Explain why a zero average velocity forces the window to be centred on the moment the ball is highest.",
    vocab:"Use the words average velocity, instantaneous velocity, change in position and maximum height.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find them all?",
    afterAll:"Every answer has `a = (v - 20)/10` and `b = a + 4`. `v = 45` would reach 101.25 m, just over the limit."
  },
  cards:[
    ["Average rate of change", "`{f(b) - f(a)}/{b - a}`: the secant slope, with units."],
    ["Instantaneous rate of change", LIM + " " + DQ + ": the tangent slope."],
    ["Average velocity", "Change in position ÷ change in time. Can be 0 even if the object moved."],
    ["Average speed", "Distance travelled ÷ time. Never negative."],
    ["Instantaneous velocity", "The velocity at one moment, like a speedometer reading."],
    ["At the top of a throw", "The velocity is 0."],
    ["Sign of a rate", "Positive: increasing. Negative: decreasing."],
    ["Units of a rate", "Output units per input unit: m/s, $/item, people/year."],
    ["Rate vs value", "`s(2) = 40` m is a position; a velocity of 10 m/s is a rate."],
    ["Ball `s(t) = vt - 5t^2`", "Velocity `v - 10t`; top at `t = v/10`."],
    ["Marginal cost", "The instantaneous rate of change of cost: about the cost of one more item."],
    ["Total distance", "Add the distance of each leg between turning moments (velocity 0)."]
  ]
};
