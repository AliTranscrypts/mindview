// MCV4U 19 Related Rates. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/19-related-rates.md
// In math (`backticks`), app.js typesets the d of dx/dt, dV/dt and d/dt upright (as in MCV4U 13).
// misconception core sentences (plan §3), reused where the plan tags an option with M1–M7
const M1 = "`x` is changing. If you replace it by 6 first, its derivative becomes 0. Differentiate, then substitute.";
const M2 = "`r` depends on `t`, so `d/dt (r^3) = 3r^2 dr/dt`.";
const M3 = "The rates are linked by `x dx/dt + y dy/dt = 0`, so they’re equal only when `x = y`.";
const M4 = "Draining means the volume is decreasing: `dV/dt = -5` L/min.";
const M5 = "In this cone the radius is half the height: `r/h = 3/6`.";
const M6 = "`dV/dt = -3` m³/min describes how fast the volume changes, not the volume itself.";
const M7 = "The tip is at `x + s` from the post; its speed is `dx/dt + ds/dt`.";
const COND = '<div class="refresh" style="margin:0 0 12px"><h4>The conditions</h4><ol style="margin:0;padding-left:1.3em">' +
  "<li>The top of the ladder is at a whole number of metres up the wall.</li><li>The top slides down faster than the foot slides out.</li>" +
  "<li>The top is sliding down at exactly 1.2 m/s.</li><li>The foot moves slower than 1 m/s.</li></ol></div>";

export default {
  id:"19-related-rates",
  kind:"topic",
  title:"Related rates",
  topic:"Related Rates",
  readyTopic:"related rates",
  hero:{
    eq:'<span class="rr-heq"><span class="rr-nw">`x^2 + y^2 = 100`</span> <span class="rr-arr">⟶ `d/dt` ⟶</span> <span class="rr-nw">`2x dx/dt + 2y dy/dt = 0`</span></span>',
    eqLabel:"x squared plus y squared equals 100; differentiate with respect to t; 2x dx/dt plus 2y dy/dt equals 0",
    eqSize:"sm",
    headline:"When one thing moves, everything linked to it moves too",
    text:"If quantities are linked by an equation, their <strong>rates of change</strong> are linked too. <strong>Differentiate the equation with respect to time</strong> (every changing variable gets a chain-rule factor like `dx/dt`), then substitute the values at the <strong>moment</strong> you care about. These are <strong>related rates</strong>.",
    fig:{ html:'<div class="rr-hero" id="rr-hero"></div>', caption:"" }
  },
  goals:[
    "I can differentiate an equation with respect to time, writing `dx/dt`, `dy/dt` for every changing quantity.",
    "I can find a related rate in a one-variable formula (area, volume) at a given moment.",
    "I can identify the given rate, the wanted rate and their signs and units from a description.",
    "I can solve related-rates problems that use the Pythagorean theorem, differentiating before substituting.",
    "I can use similar triangles to remove a variable (cones, shadows) before differentiating.",
    "I can solve and interpret a related-rates problem in context and explain each step."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Implicit differentiation", goal:1, prompt:"Differentiate `x^2 + y^2 = 25` with respect to `x`.",
          options:[
            { t:"`2x + 2y dy/dx = 0`", ok:true, why:"`y` depends on `x`, so `y^2` differentiates to `2y dy/dx`." },
            { t:"`2x + 2y = 0`", why:"That treats `y` as independent of `x`. `y` depends on `x`, so `y^2` needs the chain-rule factor `dy/dx`." },
            { t:"`2x + 2y dy/dx = 25`", why:"The derivative of 25 is 0." },
            { t:"`2x dy/dx + 2y = 0`", why:"The chain-rule factor goes with `y`." }],
          hints:["Which variable depends on `x`?", "`d/dx (y^2) = 2y dy/dx`.", "`2x + 2y dy/dx = 0`."] },
        { id:"w2", skill:"Implicit differentiation", goal:1, prompt:"If `r` depends on `t`, what is `d/dt (πr^2)`?",
          options:[
            { t:"`2πr dr/dt`", ok:true, why:"Chain rule: outside `2πr`, times inside `dr/dt`." },
            { t:"`2πr`", why:"`r` depends on `t`, so you multiply by `dr/dt`." },
            { t:"`πr^2 dr/dt`", why:"Differentiate `r^2` first." },
            { t:"`2π dr/dt`", why:"The `r` stays: `2πr`." }],
          hints:["Treat `r` as a function of `t`.", "`d/dt (r^2) = 2r dr/dt`.", "`2πr dr/dt`."] },
        { id:"w3", skill:"Geometry formulas", goal:2, prompt:"Which is the volume of a cone with radius `r` and height `h`?",
          options:[
            { t:"`(1/3)πr^2h`", ok:true, why:"A cone holds a third of the cylinder with the same base and height." },
            { t:"`πr^2h`", why:"That’s the cylinder." },
            { t:"`(4/3)πr^3`", why:"That’s the sphere." },
            { t:"`(1/3)πrh`", why:"The base area is `πr^2`." }],
          hints:["A cone is a third of a cylinder.", "Cylinder: `πr^2h`.", "`(1/3)πr^2h`."] },
        { id:"w4", skill:"Geometry formulas", goal:4, prompt:"A 13 m ladder’s foot is 5 m from a wall. How high up the wall does it reach?",
          options:[
            { t:"12 m", ok:true, why:"`13^2 - 5^2 = 144`." },
            { t:"8 m", why:"That subtracts the lengths. Use the squares." },
            { t:"`√194` m", why:"That adds the squares. The ladder is the hypotenuse." },
            { t:"18 m", why:"That adds the lengths. Use the squares: the height is `√{13^2 - 5^2}`." }],
          hints:["Which side is the hypotenuse?", "`y^2 = 169 - 25`.", "12 m."] },
        { id:"w5", skill:"Similar triangles", goal:5, prompt:"A cone-shaped tank (point down) is 6 m tall with a top radius of 3 m. When the water is `h` m deep, what is the water’s surface radius `r`?",
          options:[
            { t:"`r = h/2`", ok:true, why:"`r/h = 3/6`." },
            { t:"`r = 2h`", why:"That’s the ratio upside down. " + M5 },
            { t:"`r = 3`", why:"That uses the top radius at every depth." },
            { t:"`r = h - 3`", why:"That subtracts instead of scaling." }],
          hints:["The water forms a smaller, similar cone.", "`r/h = 3/6`.", "`r = h/2`."] },
        { id:"w6", skill:"Similar triangles", goal:5, prompt:"A 2 m person stands `x` m from a 6 m lamp post. Their shadow has length `s`. Which equation is right?",
          options:[
            { t:"`6/(x + s) = 2/s`", ok:true, why:"Big triangle (post) and small triangle (person) share the shadow’s tip." },
            { t:"`6/x = 2/s`", why:"The big triangle’s base runs from the post to the shadow’s tip: `x + s`." },
            { t:"`6/s = 2/(x + s)`", why:"That pairs the wrong sides: the post goes with the long base `x + s`." },
            { t:"`6 - 2 = x - s`", why:"That subtracts. Similar triangles use ratios." }],
          hints:["Draw both triangles from the shadow’s tip.", "Post: height 6, base `x + s`. Person: height 2, base `s`.", "`6/(x + s) = 2/s`."] }
      ],
      refreshers:{
        "Implicit differentiation":"Every variable that changes with `t` gets a chain-rule factor: `d/dt (y^2) = 2y dy/dt`. Constants differentiate to 0.",
        "Geometry formulas":"Circle `A = πr^2`; sphere `V = (4/3)πr^3`; cone `V = (1/3)πr^2h`; Pythagoras `x^2 + y^2 = L^2`.",
        "Similar triangles":"Matching sides are in the same ratio. Draw both triangles and label every side before writing the ratio."
      }
    }
  },
  explore:{
    heading:"Rates in motion",
    intro:"Two scenes, one idea. Press Play or drag the slider, and watch how a steady rate in one quantity makes a changing rate in another.",
    ui:{
      scenes:[{ id:"ladder", t:"Sliding ladder" }, { id:"cone", t:"Filling cone" }],
      rates:[{ id:"1", t:"π" }, { id:"2", t:"2π" }, { id:"4", t:"4π" }, { id:"8", t:"8π" }],
      sceneLab:"Scene", rateLab:"Inflow rate (m³/min)",
      xLab:"Foot distance `x`", hLab:"Depth `h`",
      both:"Show both speed arrows", alg:"Show the algebra", showGraph:"Show graph", hideGraph:"Hide graph",
      how:{
        ladder:"Drag the slider (arrow keys move the foot by 0.5 m; Shift + arrows by 2 m). Play slides the foot out at a steady 0.6 m/s from where it is; Space on the slider plays or pauses.",
        cone:"Choose an inflow rate, then drag the slider (arrow keys change the depth by 0.5 m; Shift + arrows by 2 m). Play fills the tank at the chosen rate; Space on the slider plays or pauses."
      },
      rows:{ rel:"Relation", pos:"Position", given:"Given rate", related:"Related rate", words:"In words" },
      algHead:"The related-rates equation at this moment",
      exact:{ label:"Exact answer for challenge 3:", place:"Place the foot there", note:"Leave the root box empty for a whole number, and the first box empty for a coefficient of 1." }
    },
    predIntro:"Make a prediction first. Then the scene, its readout and its graph show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Ladder, starting at `x = 1` m. The foot moves out at a steady 0.6 m/s. How does the top move?",
        options:[{ t:"slowly at first, then faster and faster", ok:true }, { t:"at a steady 0.6 m/s" }, { t:"fast at first, then slower" }, { t:"it doesn’t move until the end" }],
        explain:"`dy/dt = -(x/y)(0.6)`. As `x` grows and `y` shrinks, `x/y` grows. " + M3 },
      { id:"p2", prompt:"Ladder, paused at `x = 6` m. How fast is the top sliding down right now?",
        options:[{ t:"0.45 m/s", ok:true }, { t:"0.6 m/s" }, { t:"0.8 m/s" }, { t:"4.8 m/s" }],
        explain:"`dy/dt = -7.2/16 = -0.45`. 0.8 m/s is what you get with the ratio upside down (`y/x`). " + M3 },
      { id:"p3", prompt:"Cone, inflow 4π m³/min, starting at `h = 0.5` m. Water pours in at a steady rate. How does the depth rise?",
        options:[{ t:"fast at first, then slower", ok:true }, { t:"steadily" }, { t:"slowly at first, then faster" }, { t:"it stops halfway" }],
        explain:"Higher up the cone is wider, so the same volume makes a thinner layer." },
      { id:"p4", prompt:"Cone, inflow 4π m³/min. When the depth doubles from 2 m to 4 m, the rate `dh/dt` …",
        options:[{ t:"becomes a quarter as big", ok:true }, { t:"halves" }, { t:"doubles" }, { t:"stays the same" }],
        explain:"`dh/dt = 16/h^2` here, so doubling `h` divides the rate by 4." }
    ],
    chalIntro:"Use the scenes to meet each goal, then press <strong>Check challenge</strong>. For challenge 3, type `x` in the exact-answer box under the ladder’s controls. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:4, prompt:"Ladder: set `x` so that the top is sliding down at exactly 0.8 m/s.",
        why:"At `x = 8`, `y = 6`, so `dy/dt = -(8/6)(0.6) = -0.8`: the top slides down at 0.8 m/s.",
        hints:["You need `(x/y)(0.6) = 0.8`.", "`x/y = 4/3`.", "`x = 8`, `y = 6`."],
        msgs:{ scen:"Switch to the <strong>Sliding ladder</strong> first.",
          x6:"At `x = 6` the top moves at 0.45 m/s. `(y/x) × 0.6 = 0.8` there, which is the ratio upside down; the top’s speed uses `x/y`.",
          x5:"`(5/√75)(0.6) ≈ 0.35` m/s: move the foot farther out.",
          other:"With the foot {x} m out, the top slides down at {v} m/s. You need `(x/y)(0.6) = 0.8`: {dir}.",
          out:"move the foot farther out", back:"move the foot closer to the wall" } },
      { id:"tc2", goal:5, prompt:"Cone: choose the inflow rate so that the depth rises at 2 m/min when `h = 4` m.",
        why:"`dV/dt = (π/4)h^2 dh/dt = (π/4)(16)(2) = 8π` m³/min.",
        hints:["`dV/dt = (π/4)h^2 dh/dt`.", "Substitute `h = 4` and `dh/dt = 2`.", "`dV/dt = (π/4)(16)(2) = 8π`."],
        msgs:{ scen:"Switch to the <strong>Filling cone</strong> first.", h:"Set the depth to `h = 4` m first.",
          r4:"At `h = 4` that gives 1 m/min.", r2:"That gives 1/2 m/min.",
          other:"At a depth of 4 m, an inflow of {q} m³/min makes the level rise at {v} m/min. Use `dV/dt = (π/4)h^2 dh/dt`." } },
      { id:"tc3", goal:4, stretch:true, prompt:"Ladder: where is the top sliding down at <strong>exactly the same speed</strong> as the foot moves out? Enter `x` exactly.",
        why:"Equal speeds mean `x/y = 1`, so `x = y` and `2x^2 = 100`: `x = √50 = 5√2` m (about 7.07 m).",
        hints:["Equal speeds means `x/y = 1`.", "`x = y`, so `2x^2 = 100`.", "`x = √50 = 5√2`."],
        msgs:{ empty:"Type `x` in the exact-answer box (□√□) under the ladder’s controls first.",
          whole:"Use whole numbers in the boxes, such as 3 and 7 for `3√7`.",
          five:"`y = √75` there, not 5.", seven:"Close, but `y = √51 ≠ 7`.",
          long:"The ladder is 10 m long, so the foot must be less than 10 m from the wall.",
          other:"With the foot {x} m out, the top is {y} m high. The speeds are equal only when `x = y`." } }
    ]
  },
  part3:{
    slug:"setup", name:"Set up",
    heading:"Set up the relation",
    intro:"Most people can differentiate; the hard part is the start. For each scene, fill the five slots from the chips: the <strong>given rate</strong> (with its sign and units), the <strong>wanted rate</strong>, the <strong>relation</strong> that links the quantities, the fact you need <strong>at the moment</strong>, and the <strong>answer</strong>. Then open <strong>Check it with algebra</strong> to follow the differentiation line by line.",
    how:"Tap a chip, then tap its slot (or tap a slot first, then a chip). A chip in the right slot locks in; a wrong one stays in the tray with feedback. Two or three chips in each tray are traps.",
    sceneLab:"Scene",
    slots:[{ id:"given", label:"Given rate" }, { id:"want", label:"Wanted rate" }, { id:"rel", label:"Relation" }, { id:"moment", label:"At the moment" }, { id:"ans", label:"Answer" }],
    roles:{ given:"the given rate", want:"the wanted rate", rel:"the relation", moment:"the fact you need at the moment", ans:"the answer" },
    nextLine:"Show the next line", allLines:"Show every line",
    scenes:[
      { id:"s1", tab:"Ripple", t:"<strong>Ripple.</strong> A pebble drops into a still pond. The circular ripple’s radius grows at 0.5 m/s. How fast is the area inside the ripple growing when the radius is 4 m?",
        aria:"A circular ripple of radius r spreading on a pond.",
        chips:[
          { t:"`dr/dt = 0.5` m/s", answer:"given" },
          { t:"`dA/dt` when `r = 4` m", answer:"want" },
          { t:"`A = πr^2`", answer:"rel" },
          { t:"`r = 4` m", answer:"moment" },
          { t:"4π m²/s", answer:"ans" },
          { t:"`dr/dt = -0.5` m/s", answer:"no", fb:"The ripple is spreading, so its radius is increasing: the rate is positive." },
          { t:"`A = 2πr`", answer:"no", fb:"That’s the circumference. The area inside the ripple is `A = πr^2`." },
          { t:"16π m²", answer:"no", fb:"That’s the area at the moment, not its rate. A rate of area has units m²/s." }],
        done:"Setup complete: `A = πr^2`, so `dA/dt = 2πr dr/dt = 4π` m²/s.",
        alg:["Relation: `A = πr^2`.", "Differentiate with respect to `t`: `dA/dt = 2πr dr/dt`.", "Substitute the moment, `r = 4` and `dr/dt = 0.5`: `dA/dt = 2π(4)(0.5)`.", "`dA/dt = 4π` m²/s (about 12.6 m²/s): the area grows at 4π m²/s."] },
      { id:"s2", tab:"Shadow", t:"<strong>Shadow.</strong> A 2 m person walks away from a 6 m lamp post at 1.5 m/s. How fast does their shadow lengthen, and how fast does the tip of the shadow move? (Let `x` be the person’s distance from the post and `s` the shadow’s length.)",
        aria:"A 6 m lamp post and a 2 m person at distance x from it; light from the lamp passes over the person’s head to the shadow’s tip, so the shadow has length s.",
        chips:[
          { t:"`dx/dt = 1.5` m/s", answer:"given" },
          { t:"`ds/dt` and the tip’s speed", answer:"want" },
          { t:"`6/(x + s) = 2/s`, so `s = x/2`", answer:"rel" },
          { t:"Any moment: no value of `x` is needed", answer:"moment" },
          { t:"0.75 m/s; tip 2.25 m/s", answer:"ans" },
          { t:"`6/x = 2/s`", answer:"no", fb:"The big triangle’s base runs from the post to the shadow’s tip: `x + s`." },
          { t:"`x = 4` m", answer:"no", fb:"Nothing in the question fixes `x`. With `s = x/2`, `ds/dt` is the same at every moment." },
          { t:"0.75 m/s; tip 0.75 m/s", answer:"no", fb:M7 }],
        done:"Setup complete: `s = x/2`, so the shadow lengthens at 0.75 m/s and its tip moves at 2.25 m/s.",
        alg:["`6/(x + s) = 2/s` gives `6s = 2x + 2s`, so `4s = 2x` and `s = x/2`.", "Differentiate: `ds/dt = (1/2) dx/dt = (1/2)(1.5) = 0.75` m/s.", "The tip is at `x + s` from the post: its speed is `dx/dt + ds/dt = 1.5 + 0.75 = 2.25` m/s."],
        note:"The shadow’s length grows at 0.75 m/s at <strong>every</strong> moment (the rate doesn’t depend on `x`), and the tip moves at 1.5 + 0.75 = 2.25 m/s." },
      { id:"s3", tab:"Balloon", t:"<strong>Balloon.</strong> Air is pumped into a spherical balloon at 100π cm³/s. How fast is the radius growing when the radius is 5 cm?",
        aria:"A spherical balloon of radius r.",
        chips:[
          { t:"`dV/dt = 100π` cm³/s", answer:"given" },
          { t:"`dr/dt` when `r = 5` cm", answer:"want" },
          { t:"`V = (4/3)πr^3`", answer:"rel" },
          { t:"`r = 5` cm", answer:"moment" },
          { t:"1 cm/s", answer:"ans" },
          { t:"`dr/dt = 100π` cm/s", answer:"no", fb:"100π cm³/s is a volume per second, so it’s `dV/dt`, not `dr/dt`." },
          { t:"`V = 4πr^2`", answer:"no", fb:"That’s the surface area. A sphere’s volume is `V = (4/3)πr^3`." },
          { t:"3 cm/s", answer:"no", fb:"That uses `(4/3)πr^2` as the derivative. Bring down the 3: `dV/dt = 4πr^2 dr/dt`." }],
        done:"Setup complete: `dV/dt = 4πr^2 dr/dt`, so `dr/dt = 1` cm/s.",
        alg:["`V = (4/3)πr^3`, so `dV/dt = 4πr^2 dr/dt`.", "`100π = 4π(25) dr/dt`.", "`dr/dt = 1`: the radius grows at 1 cm/s."] },
      { id:"s4", tab:"Two cars", t:"<strong>Two cars.</strong> From one corner, car A drives north at 60 km/h and car B drives east at 80 km/h; they leave at the same time. How fast is the distance between them changing after 1 h? (Let `x` be B’s distance east, `y` be A’s distance north and `z` the distance between them.)",
        aria:"Two roads at right angles from a corner: car B at distance x east, car A at distance y north, and the distance z between them across the right triangle.",
        chips:[
          { t:"`dx/dt = 80` km/h and `dy/dt = 60` km/h", answer:"given" },
          { t:"`dz/dt` after 1 h", answer:"want" },
          { t:"`z^2 = x^2 + y^2`", answer:"rel" },
          { t:"`x = 80`, `y = 60`, `z = 100`", answer:"moment" },
          { t:"100 km/h", answer:"ans" },
          { t:"`z = x + y`", answer:"no", fb:"The roads meet at a right angle, so use the Pythagorean theorem: `z^2 = x^2 + y^2`." },
          { t:"`x = 80`, `y = 60`, `z = 140`", answer:"no", fb:"`z` is the hypotenuse: `√{80^2 + 60^2} = 100`." },
          { t:"140 km/h", answer:"no", fb:"Adding the speeds would be right only if the cars drove in opposite directions." }],
        done:"Setup complete: `z dz/dt = x dx/dt + y dy/dt`, so `dz/dt = 100` km/h.",
        alg:["`z^2 = x^2 + y^2`, so `2z dz/dt = 2x dx/dt + 2y dy/dt`.", "After 1 h: `x = 80`, `y = 60`, `z = 100`.", "`100 dz/dt = 80(80) + 60(60) = 10 000`, so `dz/dt = 100` km/h."],
        note:"The distance grows at 100 km/h at every moment, because both cars started together and the triangle keeps its shape." }
    ],
    quickCheck:{
      title:"Quick check", summary:"Set up the relation quick check",
      items:[
        { id:"q1", goal:4, prompt:"When do you substitute the moment’s values?",
          choices:[
            { t:"After differentiating", ok:true, fb:"Right. Differentiate while every changing quantity is still a variable, then substitute." },
            { t:"Before differentiating", fb:"Substituting first freezes a changing quantity." },
            { t:"Either", fb:"Substituting first freezes a changing quantity." },
            { t:"Never", fb:"You do need the moment’s values, but only after differentiating. Substituting first freezes a changing quantity." }] },
        { id:"q2", goal:3, prompt:"A tank drains at 3 L/s. Write the given rate.",
          choices:[
            { t:"`dV/dt = -3` L/s", ok:true, fb:"Right. Draining means `V` is decreasing, so its rate is negative." },
            { t:"`dV/dt = 3` L/s", fb:"Draining means `V` is decreasing." },
            { t:"`V = -3` L", fb:"Draining means `V` is decreasing, and a rate is a change per second, not a volume." },
            { t:"`dt/dV = -3`", fb:"Draining means `V` is decreasing: the rate of volume with respect to time is `dV/dt`." }] },
        { id:"q3", goal:5, prompt:"Shadow scene: how fast does the shadow’s tip move?",
          choices:[
            { t:"2.25 m/s", ok:true, fb:"Right. The tip is at `x + s`: 1.5 + 0.75." },
            { t:"0.75 m/s", fb:"The tip is at `x + s`: 1.5 + 0.75." },
            { t:"1.5 m/s", fb:"The tip is at `x + s`: 1.5 + 0.75." },
            { t:"3 m/s", fb:"The tip is at `x + s`: 1.5 + 0.75." }] },
        { id:"q4", goal:1, prompt:"Balloon: `d/dt [(4/3)πr^3] =` …",
          choices:[
            { t:"`4πr^2 dr/dt`", ok:true, fb:"Right. Chain rule: 3 × (4/3) = 4, times `dr/dt`." },
            { t:"`4πr^2`", fb:"Chain rule: 3 × (4/3) = 4, times `dr/dt`." },
            { t:"`(4/3)πr^2 dr/dt`", fb:"Chain rule: 3 × (4/3) = 4, times `dr/dt`." },
            { t:"`4πr dr/dt`", fb:"Chain rule: 3 × (4/3) = 4, times `dr/dt`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"steps", type:"custom", title:"Put the steps in order", summary:"Steps in order", goal:[4, 6],
        instruction:"Put each solution’s steps in a working order.",
        how:"Tap a step, then use Move up and Move down to put it in place. Press Check when the order is right.",
        general:"Ask what has to happen before it can be done.",
        sequences:[
          { id:"o1", goal:[4, 6], prompt:"A 13 m ladder’s foot slides out at 1 m/s. How fast is the top moving when the foot is 5 m out?",
            steps:[
              "Draw and label: foot `x`, top `y`, ladder 13.",
              "Relation: `x^2 + y^2 = 169`.",
              "Differentiate with respect to `t`: `2x dx/dt + 2y dy/dt = 0`.",
              "Find the missing value at the moment: `x = 5`, so `y = 12`.",
              "Substitute: `2(5)(1) + 2(12) dy/dt = 0`.",
              "Solve and interpret: `dy/dt = -5/12`; the top slides down at 5/12 m/s."],
            start:[1, 4, 0, 2, 5, 3],
            accept:[[0, 1, 3, 2, 4, 5]],
            rules:[{ a:4, b:2, fb:"`x` is changing. If you replace it by 5 first, its derivative becomes 0. Differentiate, then substitute." }],
            hints:["What must you have before you can differentiate?", "Relation first, then differentiate, then put in the moment’s values.", "Draw → relation → differentiate → find `y` → substitute → solve and interpret."],
            why:"Draw → relation → differentiate → find the missing value → substitute → solve. (Finding `y = 12` before differentiating also works; substituting must wait.)" },
          { id:"o2", goal:[5, 6], prompt:"A cone (point down) has top radius 4 cm and height 12 cm and drains at 2π cm³/s. How fast is the level changing when `h = 6` cm?",
            steps:[
              "Similar triangles: `r = h/3`.",
              "Volume in one variable: `V = πh^3/27`.",
              "Differentiate: `dV/dt = (πh^2/9) dh/dt`.",
              "Substitute `h = 6` and `dV/dt = -2π`.",
              "Solve: `dh/dt = -1/2` cm/s; the level falls at 0.5 cm/s."],
            start:[3, 1, 2, 0, 4],
            rules:[{ a:3, b:2, fb:"`h` is changing. If you replace it by 6 first, its derivative becomes 0. Differentiate, then substitute." },
              { a:1, b:0, fb:"You need `r` in terms of `h` first." }],
            hints:["Which variable has to go before you can write `V` with one variable?", "Similar triangles give `r = h/3`; then `V` uses `h` only.", "Similar triangles → one-variable volume → differentiate → substitute → solve."],
            why:"Similar triangles → volume in one variable → differentiate → substitute → solve." }
        ] },
      { id:"solve", type:"custom", title:"Solve it", summary:"Solve it", star:true, goal:[2, 3, 4, 5, 6],
        instruction:"Set up, differentiate, then substitute the moment. Items 4 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type numbers, fractions, π or exact roots (such as 60π, 5/12 or 3√2/2), then press Check.",
        items:[
          { id:"s1", goal:[2, 3], prompt:"A circle’s radius grows at 3 cm/s. How fast is its area growing when `r = 10` cm?",
            boxes:[{ k:"v", label:"`dA/dt =`", unit:"cm²/s" }], answer:{ v:"60π" }, display:"60π cm²/s",
            wrong:[{ v:"20π", fb:"`r` depends on `t`, so `dA/dt = 2πr dr/dt`. Multiply by `dr/dt = 3`." }],
            hints:["Relation: `A = πr^2`.", "Differentiate with respect to `t`: `dA/dt = 2πr dr/dt`.", "`dA/dt = 2π(10)(3) = 60π` cm²/s."],
            why:"`dA/dt = 2πr dr/dt = 2π(10)(3) = 60π` cm²/s." },
          { id:"s2", goal:2, prompt:"A cube’s edge grows at 2 cm/s. How fast is its volume growing when the edge is 5 cm?",
            boxes:[{ k:"v", label:"`dV/dt =`", unit:"cm³/s" }], answer:{ v:"150" }, display:"150 cm³/s",
            wrong:[{ v:"75", fb:"The edge `x` depends on `t`, so `d/dt (x^3) = 3x^2 dx/dt`. Multiply by `dx/dt = 2`." }],
            hints:["Relation: `V = x^3` for an edge `x`.", "`dV/dt = 3x^2 dx/dt`.", "`dV/dt = 3(25)(2) = 150` cm³/s."],
            why:"`dV/dt = 3x^2 dx/dt = 3(25)(2) = 150` cm³/s." },
          { id:"s3", goal:[2, 3], prompt:"Air is pumped into a spherical balloon at 36π cm³/s. How fast is the radius growing when `r = 3` cm?",
            boxes:[{ k:"v", label:"`dr/dt =`", unit:"cm/s" }], answer:{ v:"1" }, display:"1 cm/s",
            wrong:[{ v:"1/3", fb:"`4πr^2` at `r = 3` is 36π." }],
            hints:["`V = (4/3)πr^3`, so `dV/dt = 4πr^2 dr/dt`.", "At `r = 3`: `4πr^2 = 36π`.", "`36π = 36π dr/dt`, so `dr/dt = 1` cm/s."],
            why:"`36π = 4π(9) dr/dt = 36π dr/dt`, so `dr/dt = 1` cm/s." },
          { id:"s4", goal:4, star:true, prompt:"A 13 m ladder’s foot slides away at 1 m/s. How fast does the top slide down when the foot is 5 m from the wall?",
            boxes:[{ k:"v", label:"The top slides down at", unit:"m/s" }], answer:{ v:"5/12" }, display:"5/12 m/s",
            wrong:[{ v:"12/5", fb:"The ratio is `x/y = 5/12`." }],
            hints:["`x^2 + y^2 = 169`; at `x = 5`, `y = 12`.", "Differentiate: `2x dx/dt + 2y dy/dt = 0`.", "`2(5)(1) + 2(12) dy/dt = 0`, so `dy/dt = -5/12`: the top slides down at 5/12 m/s."],
            why:"`2(5)(1) + 2(12) dy/dt = 0` gives `dy/dt = -5/12`: the top slides down at 5/12 m/s (about 0.42 m/s)." },
          { id:"s5", goal:[3, 5], star:true, prompt:"A cone-shaped cup (point down) has top radius 4 cm and height 12 cm. Water drains at 2π cm³/s. How fast is the level falling when it’s 6 cm deep?",
            note:"Give the speed (0.5) or the signed rate `dh/dt` (−0.5): both are accepted.",
            boxes:[{ k:"v", label:"The level falls at", unit:"cm/s" }], answer:{ v:"1/2" }, anySign:true, display:"0.5 cm/s (`dh/dt = -1/2`)",
            wrong:[{ v:"1/18", fb:"`r = h/3`, not `3h`: with `r/h = 4/12` the radius is a third of the height. (1/18 comes from dividing by `πh^2 = 36π`, as if `r = h`.)" },
              { v:"1/162", fb:"`r = h/3`, not `3h`." }],
            hints:["`r = h/3`.", "`V = πh^3/27`, `dV/dt = (πh^2/9) dh/dt`.", "`-2π = 4π dh/dt`: `dh/dt = -1/2`."],
            why:"`r = h/3`, `V = πh^3/27`, `dV/dt = (πh^2/9) dh/dt`; at `h = 6`: `-2π = 4π dh/dt`, so `dh/dt = -1/2`. The level falls at 0.5 cm/s." },
          { id:"s6", goal:[4, 6], star:true, prompt:"Ship A is 30 km east of a port, sailing west at 20 km/h. At the same moment ship B leaves the port sailing north at 15 km/h. How fast is the distance between them changing after 1 hour? Is it growing or shrinking?",
            boxes:[{ k:"v", label:"`dz/dt =`", unit:"km/h", exact:true }],
            choose:{ k:"dir", label:"The distance is", options:[{ id:"grow", t:"growing" }, { id:"shrink", t:"shrinking" }] },
            answer:{ v:"5√13/13", dir:"grow" }, display:"growing at `{5√13}/{13}` km/h (about 1.39 km/h)",
            wrong:[{ v:"−5√13/13", fb:"`x dx/dt + y dy/dt = 10(-20) + 15(15) = +25 > 0`, so the distance is growing." },
              { dir:"shrink", fb:"`x dx/dt + y dy/dt = 10(-20) + 15(15) = +25 > 0`, so the distance is growing." }],
            hints:["After 1 h: A is 10 km east (`x = 10`, `dx/dt = -20`); B is 15 km north (`y = 15`, `dy/dt = 15`).",
              "`z^2 = x^2 + y^2`, so `z dz/dt = x dx/dt + y dy/dt`, with `z = √325 = 5√13`.",
              "`dz/dt = 25/(5√13) = {5√13}/{13} > 0`: growing."],
            why:"`z dz/dt = 10(-20) + 15(15) = 25` with `z = 5√13`, so `dz/dt = 25/(5√13) = {5√13}/{13}` km/h. It’s positive, so the distance is growing." }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Sanjay", how:"", goal:[2, 4, 5],
        instruction:"Sanjay made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"A 10 m ladder’s foot slides out at 0.6 m/s. How fast is the top sliding down when the foot is 6 m from the wall?",
            steps:["`x^2 + y^2 = 100`.", "At this moment `x = 6`, so `y = 8`.", "Since `x = 6`, the relation becomes `36 + y^2 = 100`.", "Differentiate: `2y dy/dt = 0`, so `dy/dt = 0`. The top isn’t moving."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Finding `y` at the moment is fine.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"Differentiate `x^2 + y^2 = 100` first: `2x dx/dt + 2y dy/dt = 0`. Then `2(6)(0.6) + 2(8) dy/dt = 0`, so `dy/dt = -0.45` m/s.", ok:true, why:"Differentiating while `x` is still a variable keeps `dx/dt` in the equation; the top slides down at 0.45 m/s." },
              { t:"Use `x = 6` and differentiate 36 as 12.", why:"36 is a constant once you substitute; that’s the problem." },
              { t:"The top moves at 0.6 m/s too.", why:M3 },
              { t:"Step 3 is correct.", why:"`x` is changing; fixing it at 6 makes its rate 0." }],
            hints:["Is `x` constant?", "No: it grows at 0.6 m/s.", "Differentiate before substituting."] },
          { id:"e2", goal:2, task:"Air enters a spherical balloon at 72π cm³/s. How fast is the radius growing when `r = 3` cm?",
            steps:["`V = (4/3)πr^3`.", "Differentiate: `dV/dt = 4πr^2`.", "At `r = 3`: `dV/dt = 36π`.", "So the radius grows at 36π cm/s."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2. The mistake is earlier.", "Step 4 follows step 2’s derivative. The mistake is earlier."],
            fixes:[
              { t:"`dV/dt = 4πr^2 dr/dt`, so `72π = 36π dr/dt` and `dr/dt = 2` cm/s.", ok:true, why:"The chain rule puts `dr/dt` in the derivative, so the radius grows at 2 cm/s." },
              { t:"`dV/dt = (4/3)πr^2`.", why:"Bring down the 3." },
              { t:"`dV/dt = 4πr^2 dt/dr`.", why:"The factor is `dr/dt`." },
              { t:"Step 2 is correct.", why:"`r` depends on `t`, so a `dr/dt` is missing." }],
            hints:["Is `r` changing with time?", "Yes, so use the chain rule.", "`dr/dt = 2` cm/s."] },
          { id:"e3", goal:5, task:"A cone tank (point down) is 6 m deep with top radius 3 m. Water flows in at 4π m³/min. How fast is the level rising when `h = 4` m?",
            steps:["`V = (1/3)πr^2h`.", "Similar triangles: `r = 2h`.", "`V = (4/3)πh^3`, so `dV/dt = 4πh^2 dh/dt`.", "`4π = 64π dh/dt`, so `dh/dt = 1/16` m/min."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 is right for step 2’s `r`. The mistake is earlier.", "Step 4 follows step 2’s `r`. The mistake is earlier."],
            fixes:[
              { t:"`r/h = 3/6`, so `r = h/2` and `V = πh^3/12`. Then `4π = (π/4)(16) dh/dt`, so `dh/dt = 1` m/min.", ok:true, why:"With the right ratio the level rises at 1 m/min." },
              { t:"`r = 3` at every depth.", why:"The water’s radius shrinks with depth." },
              { t:"`r = h - 3`.", why:"Similar triangles scale; they don’t subtract." },
              { t:"Step 2 is correct.", why:"At the top, `h = 6` would give `r = 12`, but the radius there is 3." }],
            hints:["Check `r = 2h` at the top of the tank.", "`h = 6` should give `r = 3`.", "`r = h/2`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in Explore: the ladder’s top speeding up, or the cone filling more and more slowly?" },
      { id:"j2", q:"In your own words, why must you differentiate before you substitute the values at the moment?" },
      { id:"j3", q:"Explain to a friend how similar triangles help in the cone problem." },
      { id:"j4", q:"Which step do you find hardest: the relation, the derivative, or the signs and units? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"`x` and `y` both change with time, and `x^2 + y^2 = 169`. Which equation is true?", options:[
          { t:"`2x dx/dt + 2y dy/dt = 0`", ok:true, why:"Each variable gets its own rate factor, and the derivative of 169 is 0." },
          { t:"`2x + 2y = 0`", why:"Each term needs its rate factor." },
          { t:"`2x dx/dt + 2y dy/dt = 169`", why:"The derivative of 169 is 0." },
          { t:"`2x dy/dt + 2y dx/dt = 0`", why:"`d/dt (x^2) = 2x dx/dt`: each variable with its own rate." }] },
        b:{ prompt:"`a` and `b` both change with time, and `a^2 + b^2 = 400`. Which equation is true?", options:[
          { t:"`2a da/dt + 2b db/dt = 0`", ok:true, why:"Each variable gets its own rate factor, and the derivative of 400 is 0." },
          { t:"`2a + 2b = 0`", why:"Each term needs its rate factor." },
          { t:"`2a da/dt + 2b db/dt = 400`", why:"The derivative of 400 is 0." },
          { t:"`2a db/dt + 2b da/dt = 0`", why:"`d/dt (a^2) = 2a da/dt`: each variable with its own rate." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"A circle’s radius grows at 2 cm/s. How fast is its area growing when `r = 5` cm?", options:[
          { t:"20π cm²/s", ok:true, why:"`dA/dt = 2πr dr/dt = 2π(5)(2)`." },
          { t:"10π cm²/s", why:"That’s `2πr` without `dr/dt`." },
          { t:"4π cm²/s", why:"That’s `π(dr/dt)^2`." },
          { t:"25π cm²/s", why:"That’s the area, not its rate." }] },
        b:{ prompt:"A circle’s radius grows at 3 cm/s. How fast is its area growing when `r = 4` cm?", options:[
          { t:"24π cm²/s", ok:true, why:"`dA/dt = 2πr dr/dt = 2π(4)(3)`." },
          { t:"8π cm²/s", why:"That’s `2πr` without `dr/dt`." },
          { t:"9π cm²/s", why:"That’s `π(dr/dt)^2`." },
          { t:"16π cm²/s", why:"That’s the area, not its rate." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Water drains from a tank at 5 L/min. Which statement is correct?", options:[
          { t:"`dV/dt = -5` L/min", ok:true, why:"The volume is decreasing." },
          { t:"`dV/dt = 5` L/min", why:M4 },
          { t:"`V = -5` L", why:"That’s a volume, and a negative one." },
          { t:"`dt/dV = -5` min/L", why:"The rate of volume with respect to time is `dV/dt`." }] },
        b:{ prompt:"A balloon loses air at 20 cm³/s. Which statement is correct?", options:[
          { t:"`dV/dt = -20` cm³/s", ok:true, why:"Losing air means the volume is decreasing." },
          { t:"`dV/dt = 20` cm³/s", why:"Losing air means the volume is decreasing: `dV/dt = -20` cm³/s." },
          { t:"`V = -20` cm³", why:"That’s a volume, and a negative one." },
          { t:"`dt/dV = -20` s/cm³", why:"The rate of volume with respect to time is `dV/dt`." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"A 13 m ladder’s foot slides away from a wall at 0.5 m/s. How fast is the top sliding down when the foot is 12 m from the wall?", options:[
          { t:"1.2 m/s", ok:true, why:"`y = 5`; `2(12)(0.5) + 2(5) dy/dt = 0`, so `dy/dt = -1.2`." },
          { t:"0.5 m/s", why:"The speeds are equal only when `x = y`." },
          { t:"5/24 m/s", why:"That uses `y/x` instead of `x/y`." },
          { t:"0 m/s", why:"Substituting `x = 12` before differentiating freezes `x`." }] },
        b:{ prompt:"A 10 m ladder’s foot slides away at 0.3 m/s. How fast is the top sliding down when the foot is 8 m from the wall?", options:[
          { t:"0.4 m/s", ok:true, why:"`y = 6`; `dy/dt = -(8/6)(0.3)`." },
          { t:"0.3 m/s", why:"The speeds are equal only when `x = y`." },
          { t:"0.225 m/s", why:"Ratio upside down: that uses `y/x` instead of `x/y`." },
          { t:"0 m/s", why:"Substituting `x = 8` before differentiating freezes `x`." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"A cone tank (point down) has top radius 2 m and height 8 m. Water flows in at π m³/min. How fast is the level rising when the water is 4 m deep?", options:[
          { t:"1 m/min", ok:true, why:"`r = h/4`, `V = πh^3/48`, `dV/dt = (πh^2/16) dh/dt`; `π = π dh/dt`." },
          { t:"1/256 m/min", why:"That uses `r = 4h`." },
          { t:"3/4 m/min", why:"That keeps `r = 2` at every depth, as if the tank were a cylinder-like shape." },
          { t:"0 m/min", why:"Substituting `h = 4` before differentiating." }] },
        b:{ prompt:"A cone tank (point down) has top radius 3 m and height 9 m. Water flows in at 2π m³/min. How fast is the level rising when the water is 6 m deep?", options:[
          { t:"1/2 m/min", ok:true, why:"`r = h/3`, `V = πh^3/27`; `2π = (π(36)/9) dh/dt`." },
          { t:"1/162 m/min", why:"That uses `r = 3h`." },
          { t:"2/3 m/min", why:"`r` isn’t constant." },
          { t:"0 m/min", why:"Substituting `h = 6` before differentiating freezes `h`." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"A 1.8 m student walks away from a 5.4 m lamp post at 1.2 m/s. How fast is the tip of their shadow moving?", options:[
          { t:"1.8 m/s", ok:true, why:"`5.4/(x + s) = 1.8/s` gives `s = x/2`; the tip is at `x + s = 1.5x`, so it moves at 1.5 × 1.2." },
          { t:"0.6 m/s", why:"That’s how fast the shadow lengthens." },
          { t:"1.2 m/s", why:"That’s the student’s speed; the tip moves faster." },
          { t:"3.6 m/s", why:"That multiplies by the ratio of heights, 5.4/1.8, which isn’t how the tip’s distance depends on `x`." }] },
        b:{ prompt:"A 2 m person walks away from an 8 m lamp post at 1.5 m/s. How fast is the tip of their shadow moving?", options:[
          { t:"2 m/s", ok:true, why:"`8s = 2(x + s)` gives `s = x/3`; tip at `4x/3`." },
          { t:"0.5 m/s", why:"That’s how fast the shadow lengthens." },
          { t:"1.5 m/s", why:"That’s the person’s speed; the tip moves faster." },
          { t:"6 m/s", why:"That multiplies by the ratio of heights, 8/2, which isn’t how the tip’s distance depends on `x`." }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"Which is the best explanation of why you differentiate the ladder equation before substituting `x = 6`?", options:[
          { t:"“`x` is changing with time. Substituting 6 first turns `x` into a constant whose derivative is 0, which hides `dx/dt`. Differentiating first keeps every rate in the equation.”", ok:true, why:"It names the real reason: substituting first wipes out the rate `dx/dt`." },
          { t:"“Because substituting first gives the wrong value of `y`.”", why:"`y = 8` is correct either way; the rate is what goes wrong." },
          { t:"“It doesn’t matter; both orders give the same answer.”", why:M1 },
          { t:"“Because 6 is not a solution of the equation.”", why:"`x = 6`, `y = 8` does satisfy it." }] },
        b:{ prompt:"Which is the best explanation of why `r` must be written in terms of `h` before differentiating the cone’s volume?", options:[
          { t:"“Both `r` and `h` change as the tank fills. Replacing `r` by `h/2` leaves one variable, so the derivative gives `dV/dt` in terms of `dh/dt` only, the rate we want.”", ok:true, why:"One variable left means one unknown rate: `dh/dt`." },
          { t:"“Because the formula for a cone only works with `h`.”", why:"It works with both; we don’t know `dr/dt`." },
          { t:"“Because `r` is constant.”", why:"The surface radius grows as the water rises." },
          { t:"“It isn’t needed; differentiate `(1/3)πr^2h` with `r` fixed.”", why:"That treats `r` as constant, which is wrong." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"For a draining tank, `dV/dt = -3` m³/min when `h = 2` m. What does this mean?", options:[
          { t:"“At the moment the water is 2 m deep, the volume is decreasing at 3 m³ per minute.”", ok:true, why:"A rate is a change per unit of time at that moment, and the minus sign means decreasing." },
          { t:"“The volume is −3 m³.”", why:M6 },
          { t:"“The depth is falling at 3 m/min.”", why:"That would be `dh/dt`." },
          { t:"“After 2 minutes, 3 m³ has drained.”", why:"`h = 2` is a depth, not a time." }] },
        b:{ prompt:"For a filling tank, `dh/dt = 0.25` m/min when `V = 10` m³. What does this mean?", options:[
          { t:"“At the moment the tank holds 10 m³, the water level is rising at 0.25 m per minute.”", ok:true, why:"A rate is a change per unit of time at that moment, and the plus sign means rising." },
          { t:"“The level is 0.25 m.”", why:"`dh/dt = 0.25` m/min describes how fast the level changes, not the level itself." },
          { t:"“The volume grows at 0.25 m³/min.”", why:"That would be `dV/dt`." },
          { t:"“After 10 minutes, the level rises 0.25 m.”", why:"`V = 10` is a volume, not a time." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Two cyclists leave the same corner at the same time, one riding north at 45 km/h, the other east at 60 km/h. How fast is the distance between them growing?", options:[
          { t:"75 km/h", ok:true, why:"After `t` hours: `45t` and `60t`, so the distance is `75t`; `z dz/dt = x dx/dt + y dy/dt` gives 75 at every moment." },
          { t:"105 km/h", why:"Adding the speeds would be right only if they rode in opposite directions." },
          { t:"15 km/h", why:"Subtracting would be right only if they rode the same way." },
          { t:"52.5 km/h", why:"Averaging has no basis." }] },
        b:{ prompt:"Two trains leave the same station at the same time, one going north at 72 km/h, the other east at 96 km/h. How fast is the distance between them growing?", options:[
          { t:"120 km/h", ok:true, why:"After `t` hours: `72t` and `96t`, so the distance is `120t`; it grows at 120 km/h at every moment." },
          { t:"168 km/h", why:"Adding the speeds would be right only if they went in opposite directions." },
          { t:"24 km/h", why:"Subtracting would be right only if they went the same way." },
          { t:"84 km/h", why:"Averaging has no basis." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"Sand pours onto a cone-shaped pile at 9π m³/min. The pile’s height always equals its radius. How fast is the height growing when the pile is 3 m high?", options:[
          { t:"1 m/min", ok:true, why:"`V = (1/3)πh^3`, `dV/dt = πh^2 dh/dt`; `9π = 9π dh/dt`." },
          { t:"1/3 m/min", why:"That uses the cylinder formula `πr^2h`." },
          { t:"9 m/min", why:"That divides by π only; divide by `πh^2 = 9π`." },
          { t:"3 m/min", why:"That divides by `πh`, not `πh^2`." }] },
        b:{ prompt:"Sand pours onto a cone-shaped pile at 2π m³/min. The height is always twice the radius. How fast is the height growing when the pile is 4 m high?", options:[
          { t:"1/2 m/min", ok:true, why:"`r = h/2`, `V = πh^3/12`, `dV/dt = (πh^2/4) dh/dt`; `2π = 4π dh/dt`." },
          { t:"1/6 m/min", why:"Cylinder formula: a cone holds a third of that." },
          { t:"2 m/min", why:"Divide by `πh^2/4 = 4π`, not π." },
          { t:"1/32 m/min", why:"That uses `r = 2h`." }] } }
    ]
  },
  task:{
    title:"Design a ladder moment", summary:"Design a ladder moment",
    statement:"<p>Choose a ladder length, a foot distance and a speed for the foot. Meet every condition. Can you find all the answers?</p>" + COND +
      "<p class=\"tiny muted\">Ladder length `L`: whole metres from 5 to 15. Foot distance `x`: whole metres from 1 to `L - 1`. Foot speed `dx/dt`: 0.1 to 2.0 m/s in steps of 0.1. The top is `y` m up the wall.</p>",
    checks:["Top at a whole-number height", "Top faster than foot", "Top at 1.2 m/s", "Foot slower than 1 m/s"],
    tips:["A whole-number height needs a Pythagorean triple: 3-4-5, 6-8-10, 5-12-13, 9-12-15.",
      "The top is faster when `x/y > 1`: the foot must be farther out than the top is high.",
      "Speed of the top = (`x/y`) × speed of the foot, so the foot’s speed is 1.2 × `y/x`.",
      "With `x/y = 4/3` you need 0.9 m/s; with 12/5 you need 0.5 m/s."],
    explainPrompt:"Explain how the speed of the top depends on where the foot is, using your design.",
    vocab:"Use the words related rates, differentiate, ratio and moment.",
    more:"There’s more than one answer. Can you find them all?",
    afterAll:"Three of them are the same 3-4-5 shape scaled up, so they need the same foot speed. The 5-12-13 ladder has a steeper ratio, so a slower foot does the job."
  },
  cards:[
    ["Related rates", "Rates of quantities linked by an equation; differentiate the equation with respect to `t`."],
    ["`d/dt (y^2)`", "`2y dy/dt` (chain rule)."],
    ["The order", "Draw → relation → differentiate → substitute the moment → solve → interpret."],
    ["Substitute last", "Substituting a changing quantity first makes its rate 0."],
    ["Ladder", "`x^2 + y^2 = L^2` ⟶ `x dx/dt + y dy/dt = 0`."],
    ["Circle", "`dA/dt = 2πr dr/dt`."],
    ["Sphere", "`dV/dt = 4πr^2 dr/dt`."],
    ["Cone (point down)", "Use similar triangles (e.g. `r = h/2`) so `V` has one variable."],
    ["Shadow", "Similar triangles give `s` in terms of `x`; the tip is at `x + s`."],
    ["Decreasing quantity", "Negative rate: draining 5 L/min means `dV/dt = -5`."],
    ["Steady in, changing out", "A constant inflow makes the level in a cone rise more and more slowly."],
    ["Units of a rate", "(units of the quantity) per (unit of time), e.g. m³/min."]
  ]
};
