// MDM4U 25 Continuous Random Variables & Density. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/25-continuous-density.md
// Core feedback sentences for the plan's misconceptions (§3), used where the plan names only the code.
const M1 = "A single value has zero width, so the area above it is 0. Only intervals have probability.";
const M2 = "Height is a density (per cm, per minute). Probability = height × width for a rectangle; in general it’s the area.";
const M3 = "Only the total area must be 1. A narrow curve can be tall.";
const M4 = "Time recorded to the nearest second is still time: continuous. The number of goals is a count: discrete.";
const M5 = "Divide the relative frequency by the class width to get the density.";
const M6 = "A density’s total area is exactly 1. Add areas (height × width), not heights.";
const SORT_DEF = "Counted → discrete; measured → continuous.";

const sortItem = (id, t, box, why) => ({ id, t, answer:box, why,
  hints:["Can it take any value in between?", "Counted or measured?", (box === "disc" ? "Discrete: " : "Continuous: ") + why] });

export default {
  id:"25-continuous-density",
  kind:"topic",
  title:"Continuous random variables and density",
  topic:"Continuous Random Variables & Density",
  readyTopic:"continuous random variables and density",
  hero:{
    eq:"`P(a <= X <= b)` = area under the density curve from `a` to `b`",
    eqLabel:"P of a less than or equal to X less than or equal to b equals the area under the density curve from a to b.",
    eqSize:"sm",
    headline:"For continuous data, probability is area",
    text:"Heights, times and masses can take <strong>any value</strong> in an interval, so they’re <strong>continuous</strong>. We group them into classes to draw <strong>histograms</strong>. As the classes get narrower, the histogram becomes a smooth <strong>density curve</strong>, and the probability of landing in an interval is the <strong>area</strong> under that curve.",
    fig:{ aria:"A density histogram of 200 heights (model data) with 10-centimetre classes splits into 5-centimetre and then 2-centimetre classes; the outline keeps its shape while the bars multiply. A smooth curve traces the tops and the bars fade. The region from 160 to 170 cm is shaded, labelled area about 0.35, which is 35% of students. Caption: total area = 1.", shape:"wide" }
  },
  goals:[
    "I can tell whether a random variable is discrete or continuous.",
    "I can organize continuous data into intervals and draw a frequency histogram and frequency polygon.",
    "I can explain that probability for a continuous variable is the area under a density curve, and why `P(X = a) = 0`.",
    "I can find probabilities from simple density curves (rectangles, triangles, pieces) using area.",
    "I can describe the challenges of measuring continuous data: rounding, sampling and class boundaries.",
    "I can connect relative-frequency histograms to density curves as the class width shrinks."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Discrete vs continuous", goal:1, prompt:"Which variable is continuous?",
          options:[
            { t:"The time a student takes to run 100 m", ok:true, why:"Time can take any value in an interval." },
            { t:"The number of goals in a game", why:"Goals are counted: 0, 1, 2, …" },
            { t:"The number of heads in 5 tosses", why:"That’s a count." },
            { t:"The number of people on a bus", why:"That’s a count." }],
          hints:["Is it counted or measured?", "Measured quantities are continuous.", "Time."] },
        { id:"w2", skill:"Discrete vs continuous", goal:1, prompt:"Which variable is discrete?",
          options:[
            { t:"The number of text messages sent today", ok:true, why:"Counted." },
            { t:"The mass of an apple", why:"Measured: continuous." },
            { t:"The temperature at noon", why:"Measured: continuous." },
            { t:"The length of a song", why:"Measured: continuous." }],
          hints:["Counted or measured?", "Counts are discrete.", "Text messages."] },
        { id:"w3", skill:"Areas", goal:4, prompt:"A rectangle has width 5 and height 0.04. What is its area?",
          options:[
            { t:"0.2", ok:true, why:"5 × 0.04." },
            { t:"5.04", why:"Area multiplies." },
            { t:"0.04", why:"That’s the height." },
            { t:"1.25", why:"That’s 5 ÷ 4." }],
          hints:["Area = width × height.", "5 × 0.04.", "0.2."] },
        { id:"w4", skill:"Areas", goal:4, prompt:"A triangle has base 4 and height 0.08. What is its area?",
          options:[
            { t:"0.16", ok:true, why:"½ × 4 × 0.08." },
            { t:"0.32", why:"Include the ½ for a triangle." },
            { t:"0.08", why:"That’s the height." },
            { t:"4.08", why:"Area multiplies; don’t add." }],
          hints:["½ × base × height.", "½ × 4 × 0.08.", "0.16."] },
        { id:"w5", skill:"Relative frequency", goal:6, prompt:"In a sample of 200 students, 70 are between 160 and 170 cm tall. What is the relative frequency?",
          options:[
            { t:"0.35", ok:true, why:"70 ÷ 200." },
            { t:"70", why:"That’s the frequency." },
            { t:"0.70", why:"Divide by 200, not 100." },
            { t:"2.86", why:"That’s 200 ÷ 70." }],
          hints:["Relative frequency = frequency ÷ total.", "70 ÷ 200.", "0.35."] },
        { id:"w6", skill:"Reading histograms", goal:2, prompt:"A histogram has classes 150–160, 160–170 and 170–180 with frequencies 34, 70 and 62. How many values are at least 160?",
          options:[
            { t:"132", ok:true, why:"70 + 62." },
            { t:"70", why:"Include the 170–180 class." },
            { t:"166", why:"That’s everyone in these classes." },
            { t:"96", why:"That’s 34 + 62." }],
          hints:["Which classes start at 160 or more?", "160–170 and 170–180.", "132."] }
      ],
      refreshers:{
        "Discrete vs continuous":"Counted values are discrete; measured values (time, mass, length) are continuous, even when they’re rounded.",
        "Areas":"Rectangle: width × height. Triangle: ½ × base × height.",
        "Relative frequency":"Frequency ÷ total. Relative frequencies add to 1.",
        "Reading histograms":"Add the frequencies of the classes that fit the condition. Classes include their left endpoint."
      }
    }
  },
  explore:{
    heading:"From bars to curves",
    intro:"Group 200 measurements into classes, then make the classes narrower. Switch the vertical axis to density and watch a curve appear. Then explore model densities whose areas you can find exactly.",
    predIntro:"Make a prediction first. Then the histogram builder will show you what really happens.",
    predictions:[
      { id:"p1", start:{ view:"data", ds:"h", axis:"rf", w:10 },
        prompt:"What happens to the bar heights when the classes get 5 times narrower?",
        options:[{ t:"They get shorter, because each class holds fewer students", ok:true }, { t:"They stay the same" }, { t:"They get taller" }, { t:"They become equal" }],
        explain:"Relative-frequency heights depend on the class width. That’s why we switch to density. The bars dropped to about a fifth of their height." },
      { id:"p2", start:{ view:"data", ds:"h", axis:"d", w:10 },
        prompt:"Now what happens to the outline?",
        options:[{ t:"It keeps about the same shape and gets smoother", ok:true }, { t:"It shrinks to a fifth" }, { t:"It becomes flat" }, { t:"It doubles" }],
        explain:"Density = relative frequency ÷ width, so the scale stays put. The outline held, and the smooth curve appeared." },
      { id:"p3", start:{ view:"model", shape:"bus", pt:7 },
        prompt:"What is the probability of waiting <strong>exactly</strong> 7 minutes?",
        options:[{ t:"0", ok:true }, { t:"`1/20`" }, { t:"`1/7`" }, { t:"`7/20`" }],
        explain:"`1/20` is the height (the density), not the area. An interval of width 0 has area 0." },
      { id:"p4", start:{ view:"model", shape:"unif", c:0.5 },
        prompt:"This density is 2 units tall. Is it a valid density?",
        options:[{ t:"Yes: the area is 2 × 0.5 = 1", ok:true }, { t:"No: heights can’t exceed 1" }, { t:"No: the area is 2" }, { t:"Only if `c = 1`" }],
        explain:"Only the total area must be 1. The total-area readout shows 1." }
    ],
    chalIntro:"Use <strong>Model densities</strong> to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3, 4], prompt:"On the bus-wait model (uniform on [0, 20] minutes), select an interval whose probability is `1/4`.",
        why:"Area = width × `1/20`, so any interval 5 minutes long has probability `5/20 = 1/4`.",
        hints:["Area = width × `1/20`.", "You need width × `1/20 = 1/4`.", "Any interval 5 minutes long."] },
      { id:"tc2", goal:[3, 4], prompt:"On the triangle model `f(x) = x ÷ 50` on [0, 10], select [0, `b`] with probability 0.36.",
        why:"The area from 0 to `b` is ½ × `b` × (`b` ÷ 50) = `b^2` ÷ 100, and `6^2` ÷ 100 = 0.36.",
        hints:["Area of the triangle from 0 to `b`: ½ × `b` × (`b` ÷ 50) = `b^2` ÷ 100.", "`b^2` ÷ 100 = 0.36.", "`b = 6`."] },
      { id:"tc3", goal:[3, 4], stretch:true, prompt:"Set the uniform density on [0, `c`] so that `P(2 <= X <= 5) = 1/2`. There are <strong>two</strong> answers. Find both. (Check each one as you find it.)",
        why:"If `c ≥ 5`, the whole interval fits: 3 ÷ `c` = `1/2`, so `c = 6`. If `c < 5`, only 2 to `c` counts: (`c` − 2) ÷ `c` = `1/2`, so `c = 4`.",
        hints:["If `c ≥ 5`, the whole interval fits: 3 ÷ `c` = `1/2`.", "If `c < 5`, only 2 to `c` counts: (`c` − 2) ÷ `c` = `1/2`.", "`c = 6` and `c = 4`."] }
    ]
  },
  part3:{
    slug:"measurement", name:"Measurement",
    heading:"Measurement challenges",
    intro:"Why is a continuous distribution hard to pin down? Visit four measuring stations. Each one ends with a <strong>Check it with data</strong> panel.",
    stations:[
      { id:"s1", title:"Rounding hides an interval",
        text:"A height was recorded as 172 cm (to the nearest centimetre). Zoom in on the ruler: any true height in the shaded band rounds to 172.",
        match:"Match each recording to its true interval.",
        fb:"Rounding to the nearest unit covers half a unit each side." },
      { id:"s2", title:"Boundaries",
        text:"Some heights land exactly on a class boundary. The rule <strong>“the left endpoint is included”</strong> decides where they go: [160, 170) holds 160 but not 170.",
        fb:"The left endpoint is included." },
      { id:"s3", title:"You can’t measure everyone",
        text:"We want the heights of every Grade 12 student in Ontario, but we measured a sample of 200.",
        q:"Why sample?",
        right:"All of these. Measuring everyone takes time and money, and some measurements destroy the item (testing a light bulb’s life burns it out). You’ll meet sampling again in module 29.",
        wrong:"That’s one reason. Look for the choice that covers every reason." },
      { id:"s4", title:"Measurement uncertainty",
        text:"Two students measure the same 10 objects with a ruler marked in centimetres. Their recordings differ slightly, so their histograms differ a little.",
        after:"Variability comes from measurement as well as from the things being measured." }
    ],
    quickCheck:{
      title:"Quick check", summary:"Measurement challenges quick check",
      items:[
        { id:"q1", goal:5, prompt:"A height recorded to the nearest cm as 172 cm means…",
          choices:[
            { t:"171.5 ≤ `h` < 172.5", ok:true, fb:"Right. Rounding to the nearest cm covers half a cm each side." },
            { t:"exactly 172", fb:"Rounding to the nearest cm covers half a cm each side." },
            { t:"172 ≤ `h` < 173", fb:"Rounding to the nearest cm covers half a cm each side." },
            { t:"171 ≤ `h` < 172", fb:"Rounding to the nearest cm covers half a cm each side." }] },
        { id:"q2", goal:5, prompt:"With classes [150, 160) and [160, 170), where does 160.0 cm go?",
          choices:[
            { t:"[160, 170)", ok:true, fb:"Right. The left endpoint is included." },
            { t:"[150, 160)", fb:"The left endpoint is included." },
            { t:"both", fb:"The left endpoint is included." },
            { t:"neither", fb:"The left endpoint is included." }] },
        { id:"q3", goal:1, prompt:"A bus wait recorded to the nearest minute is…",
          choices:[
            { t:"continuous", ok:true, fb:"Right. Rounding the record doesn’t change what’s measured." },
            { t:"discrete", fb:"Rounding the record doesn’t change what’s measured." },
            { t:"neither", fb:"Rounding the record doesn’t change what’s measured." },
            { t:"both", fb:"Rounding the record doesn’t change what’s measured." }] },
        { id:"q4", goal:5, prompt:"Why do statisticians usually sample?",
          choices:[
            { t:"Time, cost, or destructive testing", ok:true, fb:"Right. A census is often impossible or too expensive." },
            { t:"Samples are always more accurate", fb:"A census is often impossible or too expensive." },
            { t:"Populations have no variability", fb:"A census is often impossible or too expensive." },
            { t:"Samples need no grouping", fb:"A census is often impossible or too expensive." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Discrete or continuous?", summary:"Discrete or continuous?", goal:[1, 5], noun:"variable", txt:true,
        instruction:"Tap a variable, then tap the box it belongs in.",
        boxes:[{ id:"disc", label:"Discrete" }, { id:"cont", label:"Continuous" }],
        items:[
          sortItem("v1", "Number of siblings", "disc", "siblings are counted."),
          { ...sortItem("v2", "Time to run 100 m", "cont", "time is measured."), wrong:{ disc:"Times are rounded when recorded, but time itself is continuous." } },
          sortItem("v3", "Number of goals in a hockey game", "disc", "goals are counted."),
          sortItem("v4", "Mass of a backpack", "cont", "mass is measured."),
          { ...sortItem("v5", "Shoe size (in half sizes)", "disc", "shoe sizes come in fixed half-size steps."), wrong:{ cont:"Foot length is continuous, but shoe sizes come in fixed half-size steps, so the recorded variable is discrete." } },
          sortItem("v6", "Temperature at noon", "cont", "temperature is measured."),
          sortItem("v7", "Number of pets", "disc", "pets are counted."),
          sortItem("v8", "Height of a tree", "cont", "height is measured."),
          sortItem("v9", "Volume of water in a bottle", "cont", "volume is measured."),
          sortItem("v10", "Number of correct answers on a quiz", "disc", "correct answers are counted.")
        ],
        wrongDefault:SORT_DEF },
      { id:"areas", type:"custom", title:"Areas and densities", summary:"Areas and densities", goal:[3, 4, 6], star:true,
        instruction:"Find each probability or density. Items marked ★ are non-routine; D5 and D6 go beyond the Final Check.",
        how:"Type a fraction such as 3/8, a decimal such as 0.375, or a root such as 5√2, then press Check.",
        items:[
          { id:"d1", goal:4, prompt:"`X` is uniform on [0, 8]. Find `P(2 <= X <= 5)`.", answer:3 / 8, display:"`3/8`",
            why:"Width 3 × height `1/8` = `3/8`.",
            wrong:[{ match:5 / 8, fb:"Only the stretch from 2 to 5 counts." }] },
          { id:"d2", goal:3, prompt:"`X` is uniform on [0, 8]. What is the density’s height?", answer:1 / 8, display:"`1/8`", label:"Height:",
            why:"Height × 8 = 1, so the height is `1/8`.",
            wrong:[{ match:8, fb:"Height × 8 must equal 1." }] },
          { id:"d3", goal:6, prompt:"A class 5 cm wide has relative frequency 0.15. What is its density?", answer:0.03, display:"0.03 per cm", label:"Density (per cm):",
            why:"0.15 ÷ 5 = 0.03 per cm.",
            wrong:[{ match:0.15, fb:"Divide by the width." }] },
          { id:"d4", goal:4, prompt:"`f(x) = x ÷ 50` on [0, 10]. Find `P(X <= 5)`.", answer:0.25, display:"0.25",
            why:"½ × 5 × 0.1 = 0.25, or `5^2` ÷ 100.",
            wrong:[{ match:0.5, fb:"Area grows like `b^2`: 25 ÷ 100." }] },
          { id:"d5", goal:4, star:true, prompt:"A density is `c` on [0, 4) and `2c` on [4, 6]. Find `c`, then `P(X >= 4)`.", answer:[1 / 8, 1 / 2], display:"`c = 1/8`; `P(X >= 4) = 1/2`",
            parts:["`c` =", "`P(X >= 4)` ="],
            why:"4`c` + 2(2`c`) = 8`c` = 1, so `c = 1/8`; `P(X >= 4)` = 2 × `2/8` = `1/2`.",
            wrong:[{ part:0, match:1 / 3, fb:"Add <strong>areas</strong>: 4`c` + 2(2`c`) = 1, not `c` + 2`c` = 1." }],
            hints:["Total area = 1.", "4`c` + 2 × 2`c` = 8`c`.", "`c = 1/8`; `P(X >= 4)` = 2 × `2/8` = `1/2`."] },
          { id:"d6", goal:4, star:true, prompt:"`f(x) = x ÷ 50` on [0, 10]. Find the median `m`. Use √2 ≈ 1.414.", answer:7.0710678, tol:2e-4, display:"`m = 5√2 ≈ 7.07`", label:"`m` =",
            why:"`m^2` ÷ 100 = `1/2`, so `m = √50 = 5√2 ≈ 7.07`.",
            wrong:[{ match:5, fb:"The area to the left of 5 is only 0.25." }],
            hints:["The median splits the area in half.", "`m^2` ÷ 100 = `1/2`.", "`m = √50 = 5√2 ≈ 7.07`."] },
          { id:"d7", goal:4, star:true, prompt:"`X` is uniform on [0, `c`] with `P(X <= 3) = 0.6`. Find `c`.", answer:5, display:"`c = 5`", label:"`c` =",
            why:"3 ÷ `c` = 0.6, so `c = 5`.",
            wrong:[{ match:1.8, fb:"3 ÷ `c` = 0.6." }] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Akira", how:"", goal:[3, 4],
        instruction:"Akira made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"`X` is uniform on [0, 6]. Find `P(X = 3)`.",
            steps:["The density is `1/6` on [0, 6].", "So `P(X = 3) = 1/6`."],
            answer:1,
            stepFb:["Step 1 is correct.", ""],
            fixes:[
              { t:"A single value has width 0, so `P(X = 3) = 0`.", ok:true, why:M1 },
              { t:"`P(X = 3) = 3/6`.", why:"That’s `P(X <= 3)`." },
              { t:"`P(X = 3) = 1`.", why:"Probability 1 means certainty." },
              { t:"Step 2 is correct.", why:"`1/6` is the height, not an area." }],
            hints:["What’s the width of the ‘interval’ at exactly 3?", "0.", "Area = 0."] },
          { id:"e2", goal:4, task:"Model heights have density 0.035 per cm on [160, 170). Find `P(160 <= h < 165)`.",
            steps:["The density is 0.035 per cm on this class.", "So `P(160 <= h < 165) = 0.035`.", "About 3.5% of students are in this range."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"`P` = 0.035 × 5 = 0.175: about 17.5%.", ok:true, why:"A density times a width gives probability." },
              { t:"`P` = 0.035 × 10 = 0.35.", why:"That’s the whole class, 160 to 170." },
              { t:"`P` = 0.035 ÷ 5.", why:"Multiply height by width." },
              { t:"Step 2 is correct.", why:"A density times a width gives probability." }],
            hints:["How wide is the interval?", "5 cm.", "0.035 × 5."] },
          { id:"e3", goal:3, task:"Is `f(x) = 1.5` on [0, `2/3`] a valid density?",
            steps:["A density can’t be negative, and 1.5 ≥ 0.", "A density’s height can never be more than 1.", "So `f` is not a valid density."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"Only the total area must be 1: 1.5 × `2/3` = 1, so `f` is valid.", ok:true, why:M3 },
              { t:"It’s valid because 1.5 + `2/3` > 1.", why:"Add areas, not numbers like this." },
              { t:"It’s invalid because `2/3` < 1.", why:"The width can be anything." },
              { t:"Step 2 is correct.", why:"Tall, narrow densities are fine." }],
            hints:["What must a density’s total area be?", "1.", "1.5 × `2/3` = 1: valid."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in ‘From bars to curves’: the shrinking relative-frequency bars, or `P(X = a) = 0`?" },
      { id:"j2", q:"In your own words, explain the difference between a density and a probability." },
      { id:"j3", q:"Explain to a friend why a time recorded to the nearest second is still a continuous variable." },
      { id:"j4", q:"Which still feels strange: probability as area, or heights above 1? What will you try to make it click?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which is a continuous random variable?", options:[
          { t:"The time a student takes to run 100 m", ok:true, why:"Time can take any value in an interval." },
          { t:"The number of goals in a game", why:"Counted." },
          { t:"The number of heads in 10 tosses", why:"Counted." },
          { t:"Shoe size, in half sizes", why:"Recorded in fixed steps: discrete." }] },
        b:{ prompt:"Which is a discrete random variable?", options:[
          { t:"The number of cars passing in an hour", ok:true, why:"Cars are counted: 0, 1, 2, …" },
          { t:"The mass of an apple", why:"Measured." },
          { t:"The temperature at noon", why:"Measured." },
          { t:"The time to finish a test, recorded to the nearest minute", why:"Still time: continuous." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"`X` is continuous. What is `P(X = 4.5)`?", options:[
          { t:"0", ok:true, why:"A single point has no width, so no area." },
          { t:"The density’s height at 4.5", why:M1 },
          { t:"1 divided by the number of possible values", why:"There are infinitely many." },
          { t:"It can’t be found without data", why:"It’s always 0." }] },
        b:{ prompt:"`X` is uniform on [0, 10]. What is `P(X = 3)`?", options:[
          { t:"0", ok:true, why:M1 },
          { t:"`1/10`", why:"That’s the height. " + M1 },
          { t:"`3/10`", why:"That’s `P(X <= 3)`." },
          { t:"`1/3`", why:"Not a probability for this model." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"A wait `X` is uniform on [0, 20] minutes. Find `P(5 <= X <= 12)`.", options:[
          { t:"`7/20`", ok:true, why:"Width 7 × height `1/20`." },
          { t:"`12/20`", why:"Start the interval at 5, not 0." },
          { t:"`1/20`", why:"That’s the height. " + M2 },
          { t:"`7/12`", why:"Divide by the full width, 20." }] },
        b:{ prompt:"`X` is uniform on [10, 30]. Find `P(15 <= X <= 25)`.", options:[
          { t:"`1/2`", ok:true, why:"10 × `1/20`." },
          { t:"`25/30`", why:"Use the interval, not 25 ÷ 30." },
          { t:"`1/20`", why:"That’s the height. " + M2 },
          { t:"`1/3`", why:"That’s `10/30`, but the width of the support is 20." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"A density is `f(x) = x ÷ 50` on [0, 10]. Find `P(X <= 4)`.", options:[
          { t:"0.16", ok:true, why:"½ × 4 × 0.08." },
          { t:"0.4", why:"Area isn’t proportional to `b`." },
          { t:"0.08", why:"That’s the height at 4. " + M2 },
          { t:"0.32", why:"Include the ½ for a triangle." }] },
        b:{ prompt:"Same density, `f(x) = x ÷ 50` on [0, 10]. Find `P(X >= 6)`.", options:[
          { t:"0.64", ok:true, why:"1 − `36/100`." },
          { t:"0.36", why:"That’s `P(X <= 6)`." },
          { t:"0.4", why:"Use areas, not widths." },
          { t:"0.12", why:"That’s the height at 6. " + M2 }] } },
      { id:"t2", cat:"T", goal:6,
        a:{ prompt:"A relative-frequency histogram with 5-cm classes has a bar of height 0.20 for 160 ≤ `h` < 165. What is the density for that class?", options:[
          { t:"0.04 per cm", ok:true, why:"0.20 ÷ 5." },
          { t:"0.20 per cm", why:"Divide by the width." },
          { t:"1.00 per cm", why:"That’s 0.20 × 5." },
          { t:"0.25 per cm", why:"That’s 1 ÷ 4." }] },
        b:{ prompt:"A class 2 kg wide has relative frequency 0.10. What is its density?", options:[
          { t:"0.05 per kg", ok:true, why:"0.10 ÷ 2." },
          { t:"0.10 per kg", why:M5 },
          { t:"0.20 per kg", why:"That multiplies by the width." },
          { t:"0.5 per kg", why:"That’s 1 ÷ 2." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"A density is 0.25 on [0, 2) and 0.125 on [2, 6]. Is it valid, and what is `P(1 <= X <= 3)`?", options:[
          { t:"Valid; 0.375", ok:true, why:"Areas 0.5 + 0.5 = 1; then 0.25 × 1 + 0.125 × 1." },
          { t:"Not valid, because 0.25 + 0.125 ≠ 1", why:"Add areas, not heights." },
          { t:"Valid; 0.25", why:"Include the part from 2 to 3." },
          { t:"Valid; 0.5", why:"Use the heights on each piece." }] },
        b:{ prompt:"A density is 0.3 on [0, 2) and 0.1 on [2, 6]. Is it valid, and what is `P(1 <= X <= 4)`?", options:[
          { t:"Valid; 0.5", ok:true, why:"0.6 + 0.4 = 1; then 0.3 × 1 + 0.1 × 2." },
          { t:"Not valid, because 0.3 + 0.1 ≠ 1", why:M6 },
          { t:"Valid; 0.3", why:"Include 2 to 4." },
          { t:"Valid; 0.4", why:"From 1 to 2 the height is 0.3." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of why `P(X = a) = 0` for a continuous variable?", options:[
          { t:"“Probability is area under the density curve. The region above a single point has zero width, so its area is 0. Only intervals have positive probability.”", ok:true, why:"Area needs width; a single point has none." },
          { t:"“Continuous values never actually happen.”", why:"Values happen; each exact one just has area 0." },
          { t:"“The density is 0 at every point.”", why:"The density can be positive." },
          { t:"“There are too many values to list.”", why:"Countability isn’t the reason; width is." }] },
        b:{ prompt:"Which is the best explanation of how a density curve can be taller than 1?", options:[
          { t:"“Height is a density, not a probability. Only the total area must be 1, so a narrow curve can be tall.”", ok:true, why:M3 },
          { t:"“It can’t; a density is always at most 1.”", why:M3 },
          { t:"“Heights above 1 mean the probability is over 100%.”", why:"Height isn’t probability." },
          { t:"“Only discrete distributions can exceed 1.”", why:"Discrete probabilities never exceed 1." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"A survey records heights to the nearest centimetre. A recorded height of 172 cm stands for…", options:[
          { t:"any height from 171.5 cm up to (but not including) 172.5 cm", ok:true, why:"Rounding to the nearest cm covers half a cm each side." },
          { t:"exactly 172 cm", why:"A recorded value stands for an interval. " + M4 },
          { t:"172 cm up to 173 cm", why:"Rounding goes half a centimetre each way." },
          { t:"171 cm up to 172 cm", why:"Rounding goes both ways." }] },
        b:{ prompt:"Times are recorded to the nearest 0.1 s. A recorded 12.3 s stands for…", options:[
          { t:"12.25 ≤ `t` < 12.35", ok:true, why:"Rounding to the nearest 0.1 s covers 0.05 s each side." },
          { t:"exactly 12.3 s", why:"A recorded value stands for an interval. " + M4 },
          { t:"12.3 ≤ `t` < 12.4", why:"Rounding goes 0.05 s each way." },
          { t:"12.2 ≤ `t` < 12.3", why:"Rounding goes both ways." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A bus comes every 15 minutes, so your wait is uniform on [0, 15]. You ride twice this week, and the waits are independent. Find <i>P</i>(both waits are longer than 10 minutes).", options:[
          { t:"`1/9`", ok:true, why:"Each wait: `5/15 = 1/3`; both: `(1/3)^2`." },
          { t:"`2/3`", why:"That adds the two." },
          { t:"`1/3`", why:"That’s one wait." },
          { t:"`4/9`", why:"That’s `(2/3)^2`, the chance that both are 10 minutes or less." }] },
        b:{ prompt:"A traffic light’s red phase makes your wait uniform on [0, 60] seconds. On two independent days, find <i>P</i>(both waits are under 45 s).", options:[
          { t:"`9/16`", ok:true, why:"`(45/60)^2 = (3/4)^2`." },
          { t:"`3/2`", why:"Probabilities can’t exceed 1." },
          { t:"`3/4`", why:"That’s one day." },
          { t:"`1/16`", why:"That’s both waits 45 s or more." }] } },
      { id:"a2", cat:"A", goal:2,
        a:{ prompt:"Use the heights table (200 students; 160–170: 70; 170–180: 62). Assuming heights are spread evenly within each class, estimate `P(165 <= h < 175)`.", options:[
          { t:"0.33", ok:true, why:"Half of 70 plus half of 62 = 66; 66 ÷ 200." },
          { t:"0.66", why:"Only half of each class lies in the range." },
          { t:"0.35", why:"That’s the 160–170 class alone." },
          { t:"0.31", why:"That’s the 170–180 class alone." }] },
        b:{ prompt:"Use the heights table (200 students; 150–160: 34; 160–170: 70). Estimate `P(155 <= h < 165)`.", options:[
          { t:"0.26", ok:true, why:"17 + 35 = 52; 52 ÷ 200." },
          { t:"0.52", why:"Half of each class: 17 + 35 = 52, then divide by 200." },
          { t:"0.17", why:"Include the 160–165 half too." },
          { t:"0.35", why:"That’s one whole class." }] } }
    ]
  },
  task:{
    title:"Design a waiting-time density", summary:"Design a waiting-time density",
    statement:"<p>Design the waiting time `X` (in minutes, from 0 to 10) at a help desk as a three-piece density: height `h_1` on [0, 2), `h_2` on [2, 6) and `h_3` on [6, 10]. It must meet every condition. Can you find all the answers?</p>" +
      '<ol class="cd-conds"><li>It’s a valid density: the total area is 1.</li><li>At least 20% of people wait less than 2 minutes.</li><li>The middle stretch, 2 to 6 minutes, is the most likely of the three.</li><li>At least 20% of people wait 6 minutes or more.</li></ol>',
    checks:["Total area = 1", "≥ 20% under 2 min", "Middle is most likely", "≥ 20% wait 6 min or more"],
    tips:["Each piece’s area is height × width; the widths are 2, 4 and 4.", "`h_1` must be at least 0.1.", "Compare <strong>areas</strong>, not heights: the middle piece is twice as wide as the first.", "`h_3` must be at least 0.05."],
    explainPrompt:"Explain how you made the areas add to 1 and why the tallest bar isn’t always the most likely stretch.",
    vocab:"Use the words density, area, interval and probability.",
    more:"There’s more than one answer. Can you find them all?",
    afterAt:4,
    after3:"In (0.15, 0.10, 0.075), the middle piece is the <strong>shortest</strong> bar but has the largest area. Area, not height, decides probability."
  },
  cards:[
    ["Continuous random variable", "Can take any value in an interval: time, mass, height."],
    ["Discrete random variable", "Takes separate, countable values: goals, siblings."],
    ["Density histogram", "Bar height = relative frequency ÷ class width."],
    ["Density curve", "A smooth curve with total area 1, modelling a continuous variable."],
    ["Probability for continuous `X`", "The area under the density curve over an interval."],
    ["`P(X = a)`", "0: a single point has no width."],
    ["Uniform density on [0, `c`]", "Height `1/c`; `P(a <= X <= b)` = (`b` − `a`) ÷ `c`."],
    ["Can a density exceed 1?", "Yes. Only the total area must be 1."],
    ["Frequency polygon", "Joins the midpoints of the histogram bars’ tops; a model of the distribution’s shape."],
    ["Rounded data", "172 cm (nearest cm) means 171.5 ≤ `h` < 172.5."],
    ["Class boundaries", "Left endpoint included: [160, 170)."],
    ["Why sample?", "Time, cost, or tests that destroy the item."]
  ]
};
