// MDM4U 27 Standardizing & z-Scores. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/27-z-scores.md
// Core feedback sentences for the plan's misconceptions (§3), used where the plan names only the code.
const M1 = "Subtract the mean <strong>from</strong> the value, then divide by σ, not σ². Values above the mean get positive `z`.";
const M2 = "The table gives the area to the <strong>left</strong>. For ‘more than’, subtract from 1.";
const M3 = "Between two values: larger left area <strong>minus</strong> smaller left area.";
const M4 = "Look up the area <strong>inside</strong> the table to find `z`. The bottom 20% has a negative `z` (−0.84).";
const M5 = "Compare `z`-scores: a 78 can beat an 85 if the 78’s class had a smaller spread.";
const M6 = "`z = 1.28` means 1.28 standard deviations, not 1.28%. Its percentile comes from the table: about the 90th.";
const M7 = "The rule only covers 1, 2 and 3σ. For `z = 1.5`, use the table: 0.9332.";
const ZT = '<button type="button" class="btn ghost sm zt-open" aria-expanded="false" data-k="zt-open-{k}">Open the <i>z</i>-table</button>';
const zt = (k) => ZT.replace("{k}", k);

export default {
  id:"27-z-scores",
  kind:"topic",
  title:"Standardizing & z-scores",
  topic:"Standardizing & z-Scores",
  readyTopic:"z-scores",
  hero:{
    eq:"`z = (x - @d{μ}) ÷ @k{σ}`",
    eqLabel:"z equals x minus mu, divided by sigma.",
    eqSize:"md",
    headline:"One table for every bell curve",
    text:"Every normal distribution has its own mean and spread, but they all have the same shape. A <strong>z-score</strong> measures a value in standard deviations from the mean, which turns any normal curve into the <strong>standard normal</strong> curve. One <strong>table</strong> of areas then answers every probability question, forwards and backwards.",
    fig:{ aria:"Two bell curves, heights N(170, 8 squared) and test marks N(65, 12 squared), each on its own axis, slide and squeeze until they land on a single curve labelled N(0, 1). A height of 182 cm and a mark of 83 travel along and both land at z = 1.5. The area to the left shades and the table cell 1.5 | 0.9332 lights up.", shape:"wide" }
  },
  goals:[
    "I can calculate a `z`-score and explain what it means.",
    "I can use the standard normal table to find areas to the left, to the right and between two values.",
    "I can work backwards from an area or percentile to find a value, or a missing mean.",
    "I can compare values from different normal distributions using `z`-scores.",
    "I can connect `z`-scores with percentiles and quartiles.",
    "I can solve real-world problems with normal distributions, including expected counts."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"The 68–95–99.7 rule", goal:2, prompt:"For `N(50, 5^2)`, what percent of values lie below 55?",
          options:[
            { t:"84%", ok:true, why:"50% below the mean + 34% between 50 and 55." },
            { t:"34%", why:"Below 55 includes everything below 50 too." },
            { t:"68%", why:"68% is between 45 and 55." },
            { t:"16%", why:"16% lies <strong>above</strong> 55." }],
          hints:["Where is 55 compared with the mean?", "One σ above.", "50% + 34% = 84%."] },
        { id:"w2", skill:"The 68–95–99.7 rule", goal:1, prompt:"For `N(μ, σ^2)`, which value is 2 standard deviations below the mean?",
          options:[
            { t:"`μ - 2σ`", ok:true, why:"Start at the mean and move down 2 standard deviations." },
            { t:"`μ ÷ 2σ`", why:"Distances add and subtract." },
            { t:"`2μ - σ`", why:"μ isn’t doubled." },
            { t:"`μ - σ^2`", why:"σ² is the variance; move 2σ." }],
          hints:["Start at μ.", "Each standard deviation is σ.", "`μ - 2σ`."] },
        { id:"w3", skill:"Solving for a variable", goal:3, prompt:"Solve `1.5 = (x - 60) ÷ 4`.",
          options:[
            { t:"`x = 66`", ok:true, why:"Multiply: `x - 60 = 6`." },
            { t:"`x = 61.5`", why:"Multiply both sides by 4 first." },
            { t:"`x = 64`", why:"1.5 × 4 = 6." },
            { t:"`x = 54`", why:"`x - 60 = +6`." }],
          hints:["Undo the division first.", "`x - 60 = 1.5 × 4 = 6`.", "`x = 66`."] },
        { id:"w4", skill:"Solving for a variable", goal:3, prompt:"Solve `-2 = (x - 100) ÷ 15`.",
          options:[
            { t:"`x = 70`", ok:true, why:"`x - 100 = -30`." },
            { t:"`x = 130`", why:"A negative `z` is below the mean." },
            { t:"`x = 98`", why:"Multiply by 15 first." },
            { t:"`x = 85`", why:"−2 × 15 = −30." }],
          hints:["Multiply both sides by 15.", "`x - 100 = -30`.", "`x = 70`."] },
        { id:"w5", skill:"Complements and differences of areas", goal:2, prompt:"If 0.9332 of the area lies to the left of a point, what area lies to the right?",
          options:[
            { t:"0.0668", ok:true, why:"1 − 0.9332." },
            { t:"0.9332", why:"That’s the left side." },
            { t:"0.4332", why:"The total is 1, not 0.5." },
            { t:"1.9332", why:"Areas can’t exceed 1." }],
          hints:["What is the total area?", "1.", "1 − 0.9332 = 0.0668."] },
        { id:"w6", skill:"Complements and differences of areas", goal:2, prompt:"The area left of `b` is 0.8413 and the area left of `a` is 0.1587. What is the area between `a` and `b`?",
          options:[
            { t:"0.6826", ok:true, why:"0.8413 − 0.1587." },
            { t:"1.0000", why:"Adding double-counts everything left of `a`." },
            { t:"0.4207", why:"Subtract, don’t average." },
            { t:"0.1587", why:"You need the region between." }],
          hints:["Sketch both left areas.", "The bigger one contains the smaller one.", "0.8413 − 0.1587 = 0.6826."] }
      ],
      refreshers:{
        "The 68–95–99.7 rule":"68% within 1σ, 95% within 2σ, 99.7% within 3σ; above `μ + σ` is 16%, above `μ + 2σ` is 2.5%.",
        "Solving for a variable":"From `z = (x - μ) ÷ σ`: multiply by σ, then add μ, so `x = μ + zσ`.",
        "Complements and differences of areas":"Right area = 1 − left area. Between = bigger left area − smaller left area."
      }
    }
  },
  explore:{
    heading:"z-converter",
    intro:"Drag a value along the raw scale and watch its `z`-score and areas update. Then work backwards from a percentile.",
    predIntro:"Make a prediction first. Then the converter will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mu:60, sg:5, x:70, mode:"left" },
        prompt:"`N(60, 5^2)`, `x = 70`. What is the `z`-score of 70?",
        options:[{ t:"2", ok:true }, { t:"10" }, { t:"−2" }, { t:"0.2" }],
        explain:"70 is 10 above the mean, which is 2 standard deviations; `z` counts standard deviations, not marks." },
      { id:"p2", start:{ mu:60, sg:5, x:50, mode:"left" },
        prompt:"Same distribution, `x` moved to 50, Left mode. What area lies to the left of 50?",
        options:[{ t:"0.0228", ok:true }, { t:"0.9772" }, { t:"0.5000" }, { t:"0.0456" }],
        explain:"The table gives the left area directly: 0.0228. 0.9772 is the area to the right." },
      { id:"p3", start:{ mu:0, sg:1, x:-1, x2:1, mode:"between" },
        prompt:"Standard normal, Between mode from `z = -1` to `z = 1`. What does the table give for the area between?",
        options:[{ t:"0.6826", ok:true }, { t:"0.8413" }, { t:"1.6826" }, { t:"0.3413" }],
        explain:"0.8413 − 0.1587 = 0.6826. The rule’s ‘68%’ is this table value, rounded." },
      { id:"p4", start:{ mu:60, sg:5, x:70, mode:"left", sgTo:10 },
        prompt:"μ = 60, `x = 70`; σ changes from 5 to 10. What happens to the `z`-score?",
        options:[{ t:"It halves, to 1", ok:true }, { t:"It doubles, to 4" }, { t:"It stays at 2" }, { t:"It becomes 0.5" }],
        explain:"The curve widens and the marker’s `z` slides from 2 to 1. The same 10 marks is now only one (larger) standard deviation." }
    ],
    chalIntro:"Use the converter to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"With μ = 60 and σ = 5, place `x` so that exactly 84.13% of values lie below it.",
        why:"`x = 65` gives `z = 1.00`, and the table gives 0.8413 to its left.",
        hints:["Find 0.8413 in the body of the table.", "It sits at `z = 1.00`.", "`x = 60 + 1.00 × 5 = 65`."] },
      { id:"tc2", goal:[2, 3], prompt:"For `N(100, 15^2)`, shade the middle 50% of values.",
        why:"Bounds at `z = -0.67` and `z = 0.67` (89.95 and 110.05) hold 0.7486 − 0.2514 = 0.4972, the table’s closest value to the middle 50%.",
        hints:["The middle 50% leaves 25% in each tail.", "Find 0.25 and 0.75 in the table: `z ≈ -0.67` and 0.67.", "100 ± 0.67 × 15 = 89.95 and 110.05."] },
      { id:"tc3", goal:[3, 6], stretch:true, prompt:"A machine fills bags with masses `N(μ, 4^2)` g. Set μ so that only 2.28% of bags weigh less than 500 g.",
        why:"With μ = 508, 500 g is 2 standard deviations below the mean: `z = -2.00`, and the table gives 0.0228.",
        hints:["Which `z` has 0.0228 to its left?", "`z = -2.00`, so 500 must be 2σ below the mean.", "500 = μ − 2 × 4, so μ = 508."] }
    ]
  },
  part3:{
    slug:"percentiles", name:"Percentiles",
    heading:"Percentiles and positions",
    intro:"Three ways to say where a value sits: its `z`-score, its percentile and its quartile. Then test the normal model against real-looking data. " + zt("p3"),
    stations:[
      { id:"s1", title:"Three ways to say where a value is",
        text:"Slide the `z`-score. Its percentile comes from the table, its quartile region from the key positions, and the sentence puts it in words." },
      { id:"s2", title:"Data vs model",
        text:"<strong>Model data:</strong> 20 test marks. The percentile of a mark here is the <strong>percent of marks below it</strong> (the course method).",
        marks:[54, 59, 61, 63, 64, 66, 67, 68, 69, 70, 70, 71, 72, 73, 74, 76, 77, 79, 81, 86],
        items:[
          { id:"s2a", goal:5, label:"Percentile of a mark of 79:", unit:"th percentile", answer:85,
            prompt:"Find the percentile of a mark of 79: (number of marks below 79 ÷ 20) × 100.",
            why:"17 marks are below 79: 17 ÷ 20 × 100 = the 85th percentile.",
            wrong:[{ match:90, fb:"Count only the marks <strong>below</strong> 79, not 79 itself." },
              { match:17, fb:"17 is the number of marks below 79. Divide by 20, then multiply by 100." },
              { match:87, fb:"That’s the normal model’s estimate. The data percentile counts the marks below 79." }] },
          { id:"s2b", goal:5, label:["Model `Q_1` ≈", "Model `Q_3` ≈"], answer:[64.8, 75.2], tol:0.1,
            prompt:"Compare the data quartiles (65, 75) with the model’s: 70 ± 0.67 × 7.8.",
            why:"70 − 0.67 × 7.8 ≈ 64.8 and 70 + 0.67 × 7.8 ≈ 75.2, close to the data’s 65 and 75.",
            wrong:[{ match:[65, 75], fb:"Those are the data quartiles. Use the model: 70 ± 0.67 × 7.8." },
              { match:[62.2, 77.8], fb:"That uses ±1σ. Quartiles sit at `z ≈ ±0.67`." }] }
        ],
        model:"The normal model gives `z = (79 - 70) ÷ 7.8 ≈ 1.15`, and the table gives 0.8749, about the 87th percentile. Close: these marks are roughly normal." },
      { id:"s3", title:"The same z, different worlds",
        text:"A height of 182 cm, from `N(170, 8^2)`, and a mark of 83, from `N(65, 12^2)`, both have `z = 1.5`. Tap the statement that holds.",
        choices:[
          { t:"Both are at the 93rd percentile of their own group.", ok:true, why:"`z = 1.5` in both: (182 − 170) ÷ 8 = 1.5 and (83 − 65) ÷ 12 = 1.5, and the table gives 0.9332 for each." },
          { t:"The height is better because 182 is the bigger number.", why:"Raw values in different units can’t be compared. Both are 1.5 standard deviations above their own mean." },
          { t:"The mark is better because it is 18 above its mean, not 12.", why:"18 marks is 1.5 of that class’s larger standard deviation (12): the same position as 12 cm when σ = 8." },
          { t:"A height and a mark can’t be compared at all.", why:"`z`-scores make the comparison possible: both are 1.5 standard deviations above their means." }] }
    ],
    quickCheck:{
      title:"Percentiles quick check", summary:"Percentiles quick check",
      items:[
        { id:"q1", goal:5, prompt:"A value has `z = 0`. Which percentile?",
          choices:[
            { t:"50th", ok:true, fb:"Right. `z = 0` is the mean, which is the median of a normal curve." },
            { t:"0th", fb:"`z = 0` is the mean, which is the median of a normal curve." },
            { t:"100th", fb:"`z = 0` is the mean, which is the median of a normal curve." },
            { t:"68th", fb:"`z = 0` is the mean, which is the median of a normal curve." }] },
        { id:"q2", goal:5, prompt:"About which `z` is the third quartile?",
          choices:[
            { t:"0.67", ok:true, fb:"Right. 0.7486 ≈ 0.75 lies to its left." },
            { t:"0.75", fb:"0.7486 ≈ 0.75 lies to its left. 0.75 is the area, not `z`." },
            { t:"0.25", fb:"0.7486 ≈ 0.75 lies to its left. 0.75 is the area, not `z`." },
            { t:"1.00", fb:"0.7486 ≈ 0.75 lies to its left. 0.75 is the area, not `z`." }] },
        { id:"q3", goal:5, prompt:"A mark is at the 16th percentile of a normal class. Its `z`-score is about…",
          choices:[
            { t:"−1", ok:true, fb:"Right. 0.1587 lies left of `z = -1`." },
            { t:"1", fb:"0.1587 lies left of `z = -1`." },
            { t:"−0.16", fb:"0.1587 lies left of `z = -1`." },
            { t:"0.16", fb:"0.1587 lies left of `z = -1`." }] },
        { id:"q4", goal:5, prompt:"In Station 2, a mark of 64 has how many marks below it?",
          choices:[
            { t:"4", ok:true, fb:"Right. 54, 59, 61, 63: four marks; that’s the 20th percentile." },
            { t:"5", fb:"54, 59, 61, 63: four marks; that’s the 20th percentile." },
            { t:"3", fb:"54, 59, 61, 63: four marks; that’s the 20th percentile." },
            { t:"6", fb:"54, 59, 61, 63: four marks; that’s the 20th percentile." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"areas", type:"numeric", title:"Area finder", summary:"Area finder", goal:[2, 6],
        instruction:"Heights of Grade 12 students are `N(170, 8^2)` cm (model data). Give areas to 4 decimals. " + zt("a1"),
        items:[
          { id:"a1", goal:2, prompt:"`P(X < 182)`", answer:0.9332, tol:0.0002, display:"0.9332", keypad:"decimal",
            why:"`z = (182 - 170) ÷ 8 = 1.50`; the table’s left area is 0.9332.",
            wrong:[{ match:0.0668, fb:"Less than: the table’s left area." }] },
          { id:"a2", goal:2, prompt:"`P(X > 158)`", answer:0.9332, tol:0.0002, display:"0.9332", keypad:"decimal",
            why:"`z = -1.50`, left area 0.0668, so the right area is 1 − 0.0668 = 0.9332.",
            wrong:[{ match:0.0668, fb:"More than: 1 − 0.0668." }] },
          { id:"a3", goal:2, prompt:"`P(162 < X < 178)`", answer:0.6826, tol:0.0002, display:"0.6826", keypad:"decimal",
            why:"`z = -1` and 1: 0.8413 − 0.1587 = 0.6826.",
            wrong:[{ match:1, fb:"Subtract the left areas." }] },
          { id:"a4", goal:2, prompt:"`P(X > 186)`", answer:0.0228, tol:0.0002, display:"0.0228", keypad:"decimal",
            why:"`z = 2.00`: 1 − 0.9772 = 0.0228.",
            wrong:[{ match:0.9772, fb:M2 }] },
          { id:"a5", goal:2, prompt:"`P(174 < X < 186)`", answer:0.2857, tol:0.0002, display:"0.2857", keypad:"decimal",
            why:"`z = 0.50` and 2.00: 0.9772 − 0.6915 = 0.2857.",
            wrong:[{ match:1.6687, fb:"0.9772 − 0.6915." }],
            hints:["Find both `z`-scores.", "`z = 0.50` and 2.00: left areas 0.6915 and 0.9772.", "0.9772 − 0.6915 = 0.2857."] },
          { id:"a6", goal:2, prompt:"`P(X < 166)`", answer:0.3085, tol:0.0002, display:"0.3085", keypad:"decimal",
            why:"`z = -0.50`: the table’s left area is 0.3085.",
            wrong:[{ match:0.6915, fb:"166 is below the mean, so `z = -0.50`." }] },
          { id:"a7", goal:2, prompt:"`P(X > 176)`", answer:0.2266, tol:0.0002, display:"0.2266", keypad:"decimal",
            why:"`z = 0.75`: 1 − 0.7734 = 0.2266.",
            wrong:[{ match:0.7734, fb:M2 }] },
          { id:"a8", goal:6, prompt:"In a group of 500 students, about how many are taller than 186 cm?", answer:11, tol:0, display:"about 11 students", keypad:"decimal",
            why:"`P(X > 186) = 0.0228`, and 0.0228 × 500 = 11.4 ≈ 11 students.",
            wrong:[{ match:0.0228, fb:"Multiply by 500: 11.4 ≈ 11 students." }, { match:11.4, fb:"Round to a whole number of students." }],
            hints:["Find `P(X > 186)`.", "`z = 2.00`, so 0.0228.", "0.0228 × 500 = 11.4, about 11."] }
        ] },
      { id:"backwards", type:"custom", title:"Backwards and across", summary:"Backwards and across", goal:[3, 4, 6], star:true,
        instruction:"Work backwards from areas and compare across distributions. Items marked ★ are non-routine; the last two go beyond the Final Check. " + zt("a2"),
        how:"Type a number (such as 180.2 or 9.18) or choose where asked, then press Check.",
        items:[
          { id:"i1", goal:3, prompt:"Heights `N(170, 8^2)`: the tallest 10% start at what height?", answer:180.2, tol:0.1, display:"180.2 cm (`z ≈ 1.28`)",
            label:"Height:", unit:"cm",
            why:"The tallest 10% leaves 0.90 to the left: `z ≈ 1.28`, so `x = 170 + 1.28 × 8 ≈ 180.2` cm.",
            wrong:[{ match:159.8, fb:"The top 10% has positive `z`." }] },
          { id:"i2", goal:3, prompt:"`N(100, 15^2)`: find `Q_1` and `Q_3`.", answer:[89.95, 110.05], tol:0.1, display:"89.95 and 110.05",
            label:["`Q_1` =", "`Q_3` ="],
            why:"Quartiles leave 0.25 and 0.75 to the left: `z ≈ ±0.67`, so 100 ± 0.67 × 15 = 89.95 and 110.05.",
            wrong:[{ match:[75, 125], fb:"Those are ±1.67σ; quartiles use `z ≈ ±0.67`." }, { match:[85, 115], fb:"That’s ±1σ, which holds about 68%. Quartiles use `z ≈ ±0.67`." }] },
          { id:"i3", goal:4, star:true, prompt:"Ava scored 78 in math (class `N(70, 5^2)`) and 85 in English (class `N(75, 8^2)`). In which subject did she do relatively better?",
            pickLabel:"Relatively better in:",
            pick:[
              { t:"Math", ok:true },
              { t:"English", why:"Compare `z`-scores, not raw marks." }],
            display:"Math (`z = 1.6` vs 1.25)",
            why:"Math: (78 − 70) ÷ 5 = 1.6. English: (85 − 75) ÷ 8 = 1.25. The math mark is further above its class mean." },
          { id:"i4", goal:3, star:true, prompt:"A cereal machine fills `N(μ, 6^2)` g boxes. Only 0.62% may weigh under 485 g. What must μ be?", answer:500, tol:0.1, display:"μ = 500 g",
            label:"μ =", unit:"g",
            why:"0.0062 lies left of `z = -2.50`, so 485 = μ − 2.5 × 6 and μ = 500 g.",
            wrong:[{ match:470, fb:"485 must sit 2.5σ <strong>below</strong> the mean." }],
            hints:["Which `z` has 0.0062 to its left?", "`z = -2.50`.", "485 = μ − 2.5 × 6, so μ = 500."] },
          { id:"i5", goal:6, star:true, prompt:"The middle 68.26% of resting heart rates lie between 61 and 79 beats per minute (normal model). What percent are above 82?", answer:9.18, tol:0.01, display:"9.18% (σ = 9, `z ≈ 1.33`)",
            label:"Percent above 82:", unit:"%",
            why:"68.26% is the ±1σ band, so μ = 70 and σ = 9. For 82, `z = 12 ÷ 9 ≈ 1.33`: 1 − 0.9082 = 0.0918 = 9.18%.",
            wrong:[{ match:16, fb:"82 isn’t μ + σ; σ = 9, so `z = 12 ÷ 9 ≈ 1.33`." }, { match:90.82, fb:M2 }],
            hints:["68.26% is the ±1σ band: find μ and σ.", "μ = 70, σ = 9; `z` for 82 is 12 ÷ 9 ≈ 1.33.", "1 − 0.9082 = 0.0918 = 9.18%."] },
          { id:"i6", goal:3, star:true, prompt:"Bulb lifetimes are `N(1200, σ^2)` hours, and 15.87% last over 1350 h. What fraction last under 1050 h?", answer:0.1587, tol:0.0002, display:"0.1587",
            label:"Fraction:",
            why:"15.87% above means 1350 = μ + σ, so σ = 150. Then 1050 = μ − σ: `z = -1`, left area 0.1587.",
            wrong:[{ match:0.8413, fb:"15.87% above means 1350 = μ + σ, so σ = 150; 1050 = μ − σ." }] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Clementine", how:"", goal:[1, 2, 3],
        instruction:"Clementine made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Test marks are `N(72, 6^2)`. What is `P(X < 81)`?",
            steps:["`z = (72 - 81) ÷ 6 = -1.50`.", "The table gives 0.0668.", "So 6.68% of marks are below 81."],
            answer:0,
            stepFb:["", "Step 2 reads the table correctly for `z = -1.50`; the mistake is earlier.", "This follows the earlier slip."],
            fixes:[
              { t:"`z = (81 - 72) ÷ 6 = 1.50`, so `P = 0.9332`.", ok:true, why:"81 is above the mean, so `z` is positive, and the table’s left area is 0.9332." },
              { t:"`z = (81 - 72) ÷ 36 = 0.25`.", why:M1 },
              { t:"Use the rule: 84%.", why:M7 },
              { t:"Step 1 is correct.", why:"81 is above the mean, so `z` must be positive." }],
            hints:["Is 81 above or below the mean?", "Above, so `z > 0`.", "`z = 1.50`: 0.9332."] },
          { id:"e2", goal:2, task:"Reaction times are `N(250, 20^2)` ms. What fraction are slower than 290 ms?",
            steps:["`z = (290 - 250) ÷ 20 = 2.00`.", "The table gives 0.9772.", "So 0.9772 of reaction times are slower than 290 ms."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is a correct table reading.", ""],
            fixes:[
              { t:"‘Slower than 290’ means more than 290: 1 − 0.9772 = 0.0228.", ok:true, why:"The table gives the times below 290; slower times are the right tail." },
              { t:"0.9772 ÷ 2 = 0.4886.", why:"Halving isn’t a rule. The table gives the left area; ‘slower’ means the right tail: 1 − 0.9772." },
              { t:"Use 95%.", why:"95% is the share within 2σ of the mean, not the share above 290. The table answers it: 1 − 0.9772." },
              { t:"Step 3 is correct.", why:M2 }],
            hints:["Which side does the table give?", "The left: times below 290.", "1 − 0.9772 = 0.0228."] },
          { id:"e3", goal:3, task:"`N(60, 10^2)`: what cutoff marks the bottom 20%?",
            steps:["The bottom 20% has 0.20 to its left.", "So `z = 0.20`.", "`x = 60 + 0.20 × 10 = 62`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows the earlier slip."],
            fixes:[
              { t:"Find 0.20 inside the table: `z ≈ -0.84`, so `x = 60 - 8.4 = 51.6`.", ok:true, why:"0.20 is an area. The table body has 0.2005 at `z = -0.84`." },
              { t:"`z = -0.20`, so `x = 58`.", why:M4 },
              { t:"`z = 0.84`, so `x = 68.4`.", why:"The bottom 20% is below the mean." },
              { t:"Step 2 is correct.", why:M4 }],
            hints:["Is 0.20 a `z`-score or an area?", "An area: look for 0.2005 in the table.", "`z ≈ -0.84`: 51.6."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the z-converter: that very different curves become one curve, or that changing σ changes a `z`-score?" },
      { id:"j2", q:"In your own words, what does a `z`-score tell you that a raw score doesn’t?" },
      { id:"j3", q:"Explain to a friend how to find the area <strong>between</strong> two values using the table." },
      { id:"j4", q:"Which kind of question still trips you up: right tails, between, or working backwards? What will you do about it?" }
    ]
  },
  final:{
    intro:"Ten questions: 3 K, 3 T, 2 C, 2 A. No hints; choose your confidence for each. The table is available throughout. " + zt("fc"),
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"For `N(80, 4^2)`, what is the `z`-score of 74?", options:[
          { t:"−1.5", ok:true, why:"(74 − 80) ÷ 4." },
          { t:"1.5", why:"74 is below the mean, so `z` is negative." },
          { t:"−6", why:"−6 is in marks; divide by σ." },
          { t:"−0.375", why:"That divides by the variance, 16." }] },
        b:{ prompt:"For `N(45, 6^2)`, what is the `z`-score of 57?", options:[
          { t:"2", ok:true, why:"(57 − 45) ÷ 6." },
          { t:"−2", why:M1 },
          { t:"12", why:"Divide by σ." },
          { t:"0.33", why:"That divides by 36." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Use the table: `P(Z < 1.25)` = ?", options:[
          { t:"0.8944", ok:true, why:"The table gives the area to the left of 1.25 directly." },
          { t:"0.1056", why:"That’s the right tail." },
          { t:"0.3944", why:"That’s the area from 0 to 1.25 only." },
          { t:"1.25", why:"`z` isn’t an area." }] },
        b:{ prompt:"Use the table: `P(Z > -0.80)` = ?", options:[
          { t:"0.7881", ok:true, why:"1 − 0.2119." },
          { t:"0.2119", why:M2 },
          { t:"0.2881", why:"Subtract from 1, not 0.5." },
          { t:"0.80", why:M6 }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"A value has `z = 0.67` in a normal distribution. About which percentile is it?", options:[
          { t:"75th", ok:true, why:"0.7486 lies to its left." },
          { t:"67th", why:"`z` isn’t a percent." },
          { t:"25th", why:"That’s `z = -0.67`." },
          { t:"33rd", why:"Look up the table." }] },
        b:{ prompt:"A value has `z = -1.28`. About which percentile is it?", options:[
          { t:"10th", ok:true, why:"0.1003 lies to its left." },
          { t:"90th", why:"That’s `z = +1.28`." },
          { t:"13th", why:"That reads 1.28 as a percent." },
          { t:"28th", why:M6 }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"Reaction times are `N(250, 20^2)` ms. Find `P(230 < X < 290)`.", options:[
          { t:"0.8185", ok:true, why:"`z = -1` and 2: 0.9772 − 0.1587." },
          { t:"1.1359", why:"Adding double-counts." },
          { t:"0.6826", why:"290 is 2σ above, not 1σ." },
          { t:"0.1587", why:"That’s only the part below 230." }] },
        b:{ prompt:"Reaction times are `N(250, 20^2)` ms. Find `P(260 < X < 300)`.", options:[
          { t:"0.3023", ok:true, why:"`z = 0.5` and 2.5: 0.9938 − 0.6915." },
          { t:"1.6853", why:M3 },
          { t:"0.6915", why:"That’s the area below 260." },
          { t:"0.3085", why:"That’s 1 − 0.6915, the area above 260 with no upper limit." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"Scores are `N(500, 100^2)`. The top 10% receive an award. What is the minimum score for an award?", options:[
          { t:"628", ok:true, why:"`z ≈ 1.28`: 500 + 128." },
          { t:"372", why:"The top 10% is above the mean." },
          { t:"600", why:"`z = 1` leaves about 16% above." },
          { t:"510", why:"0.10 is an area, not a `z`-score." }] },
        b:{ prompt:"Marks are `N(60, 10^2)`. Students in the bottom 20% get extra help. What is the cutoff?", options:[
          { t:"51.6", ok:true, why:"`z ≈ -0.84`: 60 − 8.4." },
          { t:"68.4", why:"The bottom 20% is below the mean." },
          { t:"58", why:"0.20 is an area." },
          { t:"50", why:"`z = -1` leaves about 16% below." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"Liam ran 5 km in 24 min (his club’s times are `N(28, 2^2)`). Mei swam 400 m in 7.75 min (her club’s times are `N(8.5, 0.5^2)`). Lower times are better. Who did relatively better?", options:[
          { t:"Liam: his `z = -2.0` is further below his club’s mean than Mei’s `z = -1.5`", ok:true, why:"Liam: (24 − 28) ÷ 2 = −2.0. Mei: (7.75 − 8.5) ÷ 0.5 = −1.5. For times, further below the mean is better." },
          { t:"Mei, because her time is smaller.", why:"Raw times from different events can’t be compared." },
          { t:"Mei, because −1.5 is greater than −2.0.", why:"For times, further below the mean is better." },
          { t:"They did equally well.", why:"The `z`-scores differ." }] },
        b:{ prompt:"Raj scored 82 in chemistry (class `N(74, 4^2)`) and 88 in physics (class `N(80, 6^2)`). In which subject did he do relatively better?", options:[
          { t:"Chemistry: `z = 2.0` vs about 1.33", ok:true, why:"Chemistry: (82 − 74) ÷ 4 = 2.0. Physics: (88 − 80) ÷ 6 ≈ 1.33." },
          { t:"Physics, because 88 > 82.", why:M5 },
          { t:"They’re equal, because both are 8 above the mean.", why:"8 marks is 2σ in one class and 1.33σ in the other." },
          { t:"Different tests can’t be compared.", why:"`z`-scores make the comparison possible." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which statement best explains what `z = -1.5` means for a test mark?", options:[
          { t:"“The mark is 1.5 standard deviations below the class mean.”", ok:true, why:"`z` counts standard deviations from the mean; the negative sign means below." },
          { t:"“The mark is at the 1.5th percentile.”", why:M6 },
          { t:"“The mark is 1.5 marks below the mean.”", why:"`z` is in standard deviations, not marks." },
          { t:"“The mark is 15% below average.”", why:M6 }] },
        b:{ prompt:"Which statement best explains what `z = 2.0` means for a person’s height?", options:[
          { t:"“The height is 2 standard deviations above the mean height of the group.”", ok:true, why:"`z` counts standard deviations from the mean; positive means above." },
          { t:"“The height is at the 2nd percentile.”", why:M6 },
          { t:"“The person is 2 cm taller than average.”", why:"`z` isn’t in centimetres." },
          { t:"“The person is twice the average height.”", why:"`z` measures distance from the mean, not a ratio." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which is a correct setup for `P(X > 130)` when `X ~ N(100, 15^2)`?", options:[
          { t:"“`z = (130 - 100) ÷ 15 = 2.00`; `P = 1 - 0.9772 = 0.0228`.”", ok:true, why:"Standardize, then take 1 − the left area for ‘more than’." },
          { t:"“`z = 2.00`; `P = 0.9772`.”", why:M2 },
          { t:"“`z = (130 - 100) ÷ 225 = 0.13`; `P = 1 - 0.5517`.”", why:M1 },
          { t:"“`P = 30 ÷ 100 = 0.30`.”", why:"Probabilities come from the normal table, not a ratio." }] },
        b:{ prompt:"Which is a correct setup for `P(X < 85)` when `X ~ N(100, 15^2)`?", options:[
          { t:"“`z = (85 - 100) ÷ 15 = -1.00`; `P = 0.1587`.”", ok:true, why:"Standardize, then read the left area for ‘less than’." },
          { t:"“`z = -1.00`; `P = 1 - 0.1587 = 0.8413`.”", why:"‘Less than’ is the left area." },
          { t:"“`z = (100 - 85) ÷ 15 = 1.00`; `P = 0.8413`.”", why:M1 },
          { t:"“`P = 85 ÷ 100 = 0.85`.”", why:"Use the table." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Tire life is `N(60 000, 5000^2)` km. A warranty replaces tires that last under 50 000 km. Out of 2000 tires sold, about how many will be replaced?", options:[
          { t:"46", ok:true, why:"`z = -2.00`: 0.0228 × 2000 = 45.6." },
          { t:"1954", why:"That counts the tires that last longer." },
          { t:"317", why:"That uses `z = -1` (0.1587)." },
          { t:"0.0228", why:"That’s the probability; multiply by 2000." }] },
        b:{ prompt:"Battery life is `N(800, 40^2)` hours. Batteries that last under 720 h are replaced. Out of 5000 batteries, about how many are replaced?", options:[
          { t:"114", ok:true, why:"`z = -2.00`: 0.0228 × 5000." },
          { t:"4886", why:M2 },
          { t:"793", why:"That uses 0.1587." },
          { t:"0.0228", why:"Multiply by 5000." }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"A bakery wants only 6.68% of its loaves to weigh under 680 g. Loaf masses have σ = 8 g. What mean mass should it set?", options:[
          { t:"692 g", ok:true, why:"`z = -1.50`: 680 = μ − 12." },
          { t:"668 g", why:"680 must be <strong>below</strong> the mean." },
          { t:"680 g", why:"Then half the loaves would be under." },
          { t:"686.68 g", why:"6.68 is a percent, not grams." }] },
        b:{ prompt:"A bottler wants only 2.28% of bottles under 495 mL. Fill volumes have σ = 2.5 mL. What mean volume should it set?", options:[
          { t:"500 mL", ok:true, why:"`z = -2.00`: 495 = μ − 5." },
          { t:"490 mL", why:M4 },
          { t:"495 mL", why:"Half would be under." },
          { t:"497.28 mL", why:M4 }] } }
    ]
  },
  task:{
    title:"Grade boundaries", summary:"Grade boundaries",
    statement:"<p>Exam marks are `N(68, 10^2)`. Choose the mark needed for an A and the pass mark so that every condition holds. Use the table. Can you find all the answers? <span class=\"mdm-model\">model data</span></p>" +
      '<ol class="zc-conds"><li>Between 5% and 15% of students earn an A.</li><li>Between 2% and 10% of students fail (score below the pass mark).</li><li>At least 85% of students land between the pass mark and the A cutoff.</li></ol>',
    checks:["5% to 15% earn an A", "2% to 10% fail", "At least 85% in between"],
    tips:["Find the A percent: 1 − (table area at the A cutoff’s `z`).", "The fail percent is the table area at the pass mark’s `z`.", "If too many students are in the two tails, move the cutoffs apart."],
    explainPrompt:"Explain how you used `z`-scores and the table to check each condition for one of your designs.",
    vocab:"Use the words `z`-score, table, left area and percentile.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Raising the A cutoff shrinks the A group, which leaves room for a higher pass mark."
  },
  cards:[
    ["`z`-score", "`z = (x - μ) ÷ σ`: the number of standard deviations from the mean."],
    ["Sign of `z`", "Positive above the mean, negative below, 0 at the mean."],
    ["Standard normal", "`N(0, 1)`: mean 0, standard deviation 1."],
    ["The table", "Gives the area to the <strong>left</strong> of `z`."],
    ["Right tail", "1 − left area."],
    ["Between", "Bigger left area − smaller left area."],
    ["Backwards", "Area → `z` (inside the table) → `x = μ + zσ`."],
    ["Quartiles", "`Q_1` at `z ≈ -0.67`, `Q_3` at `z ≈ 0.67`."],
    ["90th percentile", "`z ≈ 1.28`."],
    ["Comparing", "Use `z`-scores to compare values from different distributions."],
    ["Expected count", "Probability × group size (0.0228 × 500 ≈ 11)."],
    ["`z` isn’t a percent", "`z = 1.28` means 1.28 SDs, about the 90th percentile."]
  ]
};
