// MDM4U 32 Measures of Spread. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/32-spread.md
// x̄ is written as HTML (the math typesetter has no bar notation).
const XB = '<span class="m"><i>x̄</i></span>';
const DEV = '<span class="m"><i>x</i> − <i>x̄</i></span>';
const SQ = '<span class="m">(<i>x</i> − <i>x̄</i>)<sup>2</sup></span>';
const SUMSQ = '<span class="m">Σ(<i>x</i> − <i>x̄</i>)<sup>2</sup></span>';
const MODEL = '<span class="mdm-model">model data</span> ';
// Core feedback sentences for the plan's misconceptions (§3).
const M1 = "With an odd count, the median sits between the halves. Leave it out, then take the median of each half.";
const M2 = "IQR = `Q_3 - Q_1`, the width of the box: the middle 50%.";
const M3 = "Fences are `Q_1` − 1.5 × IQR and `Q_3` + 1.5 × IQR. Start from the quartiles.";
const M4 = "Variance is in squared units. The standard deviation is its square root.";
const M5 = "A sample divides by `n - 1`; a whole population divides by `N`.";
const M6 = "Shifting every value moves the centre, not the distances between values.";
const M7 = "Spread is about distance from the centre. Squared distances make far values count a lot.";

export default {
  id:"32-spread",
  kind:"topic",
  title:"Measures of spread",
  topic:"Measures of Spread",
  readyTopic:"measures of spread",
  hero:{
    eq:'<span class="sp-nw">`IQR = Q_3 - Q_1`,</span> <span class="sp-nw"><span class="m"><i>s</i> = <span class="rad"><span class="rs">√</span><span class="rb"><span class="frac"><span class="fn">Σ(<i>x</i> − <i>x̄</i>)<sup>2</sup></span><span class="fd"><i>n</i> − 1</span></span></span></span></span></span>',
    eqLabel:"IQR equals Q3 minus Q1; s equals the square root of the sum of x minus x-bar squared, divided by n minus 1.",
    eqSize:"sm",
    headline:"Same centre, different story",
    text:"Two classes can have the same average and still be nothing alike. <strong>Range</strong>, <strong>interquartile range</strong> and <strong>standard deviation</strong> measure how spread out data are, and the <strong>box plot</strong> shows it at a glance, outliers included.",
    fig:{ aria:"Two dot plots of model data, one above the other, with a shared dashed line at 50 labelled mean 50. The top row is tightly clustered from 45 to 54; the bottom row is widely spread from 31 to 69. Each row has its box plot underneath. Captions: s ≈ 3 for the top row and s = 14 for the bottom row.", shape:"wide" }
  },
  goals:[
    "I can find the quartiles, IQR and range of a data set using the course’s quartile method.",
    "I can draw and read a box plot and identify outliers with the 1.5 × IQR rule.",
    "I can calculate a standard deviation step by step, choosing between sample (`n - 1`) and population (`N`).",
    "I can interpret standard deviation as the typical distance from the mean.",
    "I can compare two data sets using a matching pair of centre and spread.",
    "I can predict how adding a constant or multiplying by a factor changes the centre and spread."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Medians", goal:1, prompt:"What is the median of 3, 8, 10, 14, 21?",
          options:[
            { t:"10", ok:true, why:"The 3rd of 5 sorted values." },
            { t:"11.2", why:"56 ÷ 5 = 11.2 is the mean." },
            { t:"18", why:"21 − 3 = 18 is the range." },
            { t:"9", why:"With 5 values there is one middle value." }],
          hints:["The list is sorted. How many values?", "5 values: the middle is the 3rd.", "10."] },
        { id:"w2", skill:"Medians", goal:1, prompt:"What is the median of 4, 6, 9, 15?",
          options:[
            { t:"7.5", ok:true, why:"(6 + 9) ÷ 2." },
            { t:"6", why:"Average both middle values." },
            { t:"8.5", why:"34 ÷ 4 = 8.5 is the mean." },
            { t:"9.5", why:"(4 + 15) ÷ 2 is the midrange." }],
          hints:["Even count: two middle values.", "6 and 9.", "7.5."] },
        { id:"w3", skill:"Squares and square roots", goal:3, prompt:"What is `(-3)^2 + 2^2 + (-1)^2`?",
          options:[
            { t:"14", ok:true, why:"9 + 4 + 1." },
            { t:"−2", why:"Squaring makes every term positive." },
            { t:"2", why:"`(-3)^2 = 9`, not −9." },
            { t:"0", why:"Squares are never negative." }],
          hints:["Square each number first.", "9, 4, 1.", "14."] },
        { id:"w4", skill:"Squares and square roots", goal:3, prompt:"Use `√10 ≈ 3.16`. What is `√40`?",
          options:[
            { t:"≈ 6.32", ok:true, why:"`√40 = √4 × √10 = 2√10`." },
            { t:"20", why:"`√40` ≠ 40 ÷ 2." },
            { t:"≈ 12.64", why:"`√4 = 2`, not 4." },
            { t:"`6.32^2`", why:"That’s 40 itself, not its root." }],
          hints:["40 = 4 × 10.", "`√4 = 2`.", "2 × 3.16 = 6.32."] },
        { id:"w5", skill:"Mean and deviations", goal:4, prompt:"The mean of 5, 8, 11 is 8. What are the deviations from the mean?",
          options:[
            { t:"−3, 0, 3", ok:true, why:"Each value minus 8." },
            { t:"3, 0, 3", why:"Values below the mean have negative deviations." },
            { t:"3, 0, −3", why:"Deviation = value − mean." },
            { t:"5, 8, 11", why:"Subtract the mean." }],
          hints:["Deviation = value − mean.", "5 − 8 = −3.", "−3, 0, 3."] },
        { id:"w6", skill:"Mean and deviations", goal:4, prompt:"What do the deviations from the mean always add up to?",
          options:[
            { t:"0", ok:true, why:"The mean is the balance point." },
            { t:"The range", why:"Deviations cancel exactly." },
            { t:"The standard deviation", why:"That’s why we square them first." },
            { t:"`n`", why:"The sum doesn’t depend on the count." }],
          hints:["Think of the balance beam from module 31.", "Distances above and below match.", "0."] }
      ],
      refreshers:{
        "Medians":"Sort; with `n` values the median is at position `(n + 1)` ÷ 2. If that’s a half, average the two neighbours.",
        "Squares and square roots":"Square deviations so negatives don’t cancel. Use `√{ab} = √a × √b`: `√40 = 2√10`.",
        "Mean and deviations":"Deviation = value − mean. The deviations always total 0, which is why spread uses their squares."
      }
    }
  },
  explore:{
    heading:"Spread builder",
    intro:"Drag the data, and watch the box plot, the fences and the standard deviation respond. Step through the standard deviation one column at a time.",
    predIntro:"Make a prediction first. Then the spread builder will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"box", data:"home", pop:false },
        prompt:"Drag the 70 down to 40. Which measures change?",
        options:[{ t:"Range, mean and standard deviation drop; median and IQR stay the same", ok:true }, { t:"Everything drops" }, { t:"Only the range changes" }, { t:"Only the median and IQR change" }],
        explain:"Range 58 → 28, mean 28.64 → 25.91, `s` 15.84 → 9.19; `Q_1` 18, median 26 and `Q_3` 34 don’t move. Quartiles depend on positions; the 70 was already in the top spot." },
      { id:"p2", start:{ mode:"trans", data:"home", pop:false, c:0, k:1, to:5 },
        prompt:"Transform mode. Add 5 to every value. What happens to the standard deviation?",
        options:[{ t:"It stays the same", ok:true }, { t:"It increases by 5" }, { t:"It increases by 25" }, { t:"It decreases" }],
        explain:"Every dot slides right together, the box keeps its width, and `s` stays 15.84. Every distance from the mean is unchanged." },
      { id:"p3", start:{ mode:"box", data:"home", pop:true },
        prompt:"Switch from Population to Sample. The standard deviation will…",
        options:[{ t:"increase slightly", ok:true }, { t:"decrease slightly" }, { t:"stay the same" }, { t:"double" }],
        explain:"σ = 15.10 becomes `s` = 15.84. Dividing by 10 instead of 11 gives a slightly bigger result. A sample usually underestimates the spread, and `n - 1` corrects for that." },
      { id:"p4", start:{ mode:"compare", a:[6, 6, 12, 12], b:[4, 9, 9, 14], pop:false },
        prompt:"Compare mode: set A = 6, 6, 12, 12 and set B = 4, 9, 9, 14 (both have mean 9). Which has the larger standard deviation?",
        options:[{ t:"B", ok:true }, { t:"A" }, { t:"They’re equal" }, { t:"Can’t tell without a calculator" }],
        explain:"A totals 9 + 9 + 9 + 9 = 36, B totals 25 + 0 + 0 + 25 = 50. B’s two values that are 5 away count more than A’s four values that are 3 away, because the distances are squared." }
    ],
    chalIntro:"Use the spread builder to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 2], prompt:"Make a set of 7 whole numbers (0–30) with median 15 and IQR 10. <span class=\"tiny muted\">(Type them in the data box, or drag the dots.)</span>",
        why:"For `n` = 7 the median is the 4th value, `Q_1` is the 2nd and `Q_3` is the 6th: for example 5, 10, 12, 15, 17, 20, 25.",
        hints:["Put 15 in the middle (4th) position.", "`Q_1` is the 2nd value and `Q_3` is the 6th. Make them 10 apart.", "For example, 2nd = 10 and 6th = 20."] },
      { id:"tc2", goal:2, prompt:"Start: the homework data with the 70 changed to 40 (no outliers; choose <strong>Homework (70 → 40)</strong>). Drag <strong>one</strong> value so the box plot shows exactly one outlier, while the median stays 26.",
        why:"The upper fence is `Q_3` + 1.5 × IQR = 34 + 24 = 58 (or 68 if your move raises `Q_3` to 38), and your value is beyond it.",
        hints:["Where is the upper fence? `Q_3` + 1.5 × IQR.", "34 + 24 = 58.", "Move the largest value above 58."] },
      { id:"tc3", goal:3, stretch:true, prompt:"SD steps mode: make a <strong>sample</strong> of 4 whole numbers (0–20) with mean 10 and `s` exactly 2.",
        why:"The values total 40 and " + SUMSQ + " = 12, so `s^2` = 12 ÷ 3 = 4 and `s` = 2: 7, 11, 11, 11 or 9, 9, 9, 13.",
        hints:["`s` = 2 means `s^2` = 4, and for a sample `s^2` = " + SUMSQ + " ÷ 3.", "So the squared deviations must total 12, and the deviations must total 0.", "Deviations −3, 1, 1, 1: squares 9 + 1 + 1 + 1 = 12, giving 7, 11, 11, 11."] }
    ]
  },
  part3:{
    slug:"compare", name:"Compare",
    heading:"Compare two data sets",
    intro:"Each station puts two data sets side by side. Make a choice and back it with a matching pair of centre and spread; the “Check it with data” panels show the calculations.",
    stations:[
      { id:"s1", title:"Two goalies",
        text:MODEL + "Saves per game over 5 games. Which goalie is more consistent?",
        a:[26, 27, 28, 29, 30], b:[20, 24, 28, 32, 36],
        choices:[
          { id:"A", t:"Goalie A", ok:true, fb:"Right. Both average 28, but A’s games stay within 2 saves of it (`s` ≈ 1.58), while B’s swing from 20 to 36 (`s` ≈ 6.32)." },
          { id:"B", t:"Goalie B", fb:"B’s saves swing from 20 to 36. A larger spread means less consistent." },
          { id:"E", t:"Equally consistent", fb:"The means are equal (28), but the spreads aren’t. Look at the distances from 28." }],
        data:"The squared deviations total 10 for A and 160 for B, so `s_A = √{10 ÷ 4} = √2.5` ≈ 1.58 and `s_B = √{160 ÷ 4} = √40` ≈ 6.32." },
      { id:"s2", title:"Two classes",
        text:MODEL + "Final marks in two classes, shown as box plots (five-number summaries).",
        p:[52, 62, 70, 78, 94], q:[58, 66, 70, 74, 82],
        asks:[
          { id:"x1", t:"Whose middle half of marks is more spread out?", choices:["Class P", "Class Q", "Neither"], answer:"Class P",
            fb:{ "Class P":"Right. P’s box runs from 62 to 78 (IQR 16); Q’s from 66 to 74 (IQR 8).", "Class Q":"Q’s box is narrower: IQR 74 − 66 = 8, against P’s 78 − 62 = 16.", "Neither":"Compare the box widths: 16 for P and 8 for Q." } },
          { id:"x2", t:"Which class has the higher typical mark?", choices:["Class P", "Class Q", "Neither: the medians are equal"], answer:"Neither: the medians are equal",
            fb:{ "Class P":"P’s top mark is higher, but its median is 70, the same as Q’s.", "Class Q":"Q’s median is 70, the same as P’s.", "Neither: the medians are equal":"Right. Both medians are 70: the same centre, different spreads." } }],
        done:"Same median, but P’s IQR is 16 and Q’s is 8." },
      { id:"s3", title:"The right pair",
        text:"For each data set, pick the summary pair that suits it.",
        sets:[
          { id:"inc", name:"Household incomes", unit:"thousand dollars", x0:0, x1:120, step:20, vals:[24, 28, 30, 31, 33, 35, 36, 38, 41, 45, 52, 68, 110], answer:"med",
            fb:{ med:"Right. The incomes are skewed right with an outlier (110), and the median and IQR resist it.", mean:"The 110 pulls the mean and the standard deviation up. With skew or outliers, use the median and IQR." } },
          { id:"ht", name:"Student heights", unit:"cm", x0:150, x1:180, step:5, vals:[152, 156, 158, 160, 161, 162, 163, 164, 165, 166, 168, 170, 174], answer:"mean",
            fb:{ mean:"Right. The heights are roughly symmetric with no outliers, so the mean and standard deviation describe them well.", med:"That works, but for symmetric data without outliers the mean and standard deviation use every value." } }],
        pairs:[{ id:"med", t:"Median and IQR" }, { id:"mean", t:"Mean and standard deviation" }],
        done:"Use resistant measures together when outliers or skew are present." },
      { id:"s4", title:"How much did the spread change?",
        text:MODEL + "Test marks out of 50. A teacher adds 4 bonus marks to every test, then converts the marks to percentages by multiplying by 2. Predict each change before you tap Apply.",
        marks:[28, 32, 35, 36, 38, 41, 42],
        steps:[
          { id:"add", t:"Add 4 to every mark. The standard deviation will…", btn:"Apply +4", choices:["stay the same", "increase by 4", "double"], answer:"stay the same",
            fb:{ "stay the same":"Right. Every mark moves up 4, so every distance from the mean is unchanged.", "increase by 4":"Every mark moves up 4, so the distances between marks don’t change.", "double":"Adding doesn’t stretch anything; it slides every mark along." } },
          { id:"mul", t:"Now multiply every mark by 2. The standard deviation will…", btn:"Apply ×2", choices:["stay the same", "increase by 2", "double"], answer:"double",
            fb:{ "double":"Right. Every distance from the mean doubles, so `s` doubles.", "stay the same":"Multiplying stretches the data: every distance from the mean doubles.", "increase by 2":"Multiplying by 2 doubles every distance; it doesn’t add 2." } }],
        done:"Adding a constant shifts the mean and leaves `s` alone; multiplying by 2 doubles both." }
    ],
    quickCheck:{
      title:"Quick check", summary:"Compare quick check",
      items:[
        { id:"q1", goal:5, prompt:"Which summary pair suits skewed data?",
          choices:[
            { t:"Median & IQR", ok:true, fb:"Right. Both resist extreme values." },
            { t:"Mean & SD", fb:"Both resist extreme values: use the median and IQR." },
            { t:"Mean & IQR", fb:"Both resist extreme values: use the median and IQR." },
            { t:"Mode & range", fb:"Both resist extreme values: use the median and IQR." }] },
        { id:"q2", goal:4, prompt:"Same mean; `s` = 2 vs `s` = 9. Which is more consistent?",
          choices:[
            { t:"`s` = 2", ok:true, fb:"Right. A smaller SD means values sit closer to the mean." },
            { t:"`s` = 9", fb:"A smaller SD means values sit closer to the mean." },
            { t:"Same", fb:"A smaller SD means values sit closer to the mean." },
            { t:"Can’t tell", fb:"A smaller SD means values sit closer to the mean." }] },
        { id:"q3", goal:6, prompt:"Every value × 3. The IQR…",
          choices:[
            { t:"triples", ok:true, fb:"Right. Every gap triples." },
            { t:"stays the same", fb:"Every gap triples." },
            { t:"increases by 3", fb:"Every gap triples." },
            { t:"becomes 9 times", fb:"Every gap triples." }] },
        { id:"q4", goal:2, prompt:"Box A spans 40–60, box B spans 45–55. Which has the larger IQR?",
          choices:[
            { t:"A", ok:true, fb:"Right. IQR is the box width: 20 vs 10." },
            { t:"B", fb:"IQR is the box width: 20 vs 10." },
            { t:"Same", fb:"IQR is the box width: 20 vs 10." },
            { t:"Need the medians", fb:"IQR is the box width: 20 vs 10." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"five", type:"match", title:"Data ↔ five-number summary", summary:"Data ↔ five-number summary", goal:[1, 2],
        instruction:"Match each data set with its five-number summary (min, `Q_1`, median, `Q_3`, max). Some summaries are decoys.",
        how:"Tap a data set on the left, then tap its summary on the right.",
        leftTitle:"Data", rightTitle:"Five-number summary",
        left:[
          { id:"l1", t:"1, 3, 5, 7, 9", goal:1, why:"Median 5; lower half 1, 3 and upper half 7, 9 give `Q_1` = 2 and `Q_3` = 8." },
          { id:"l2", t:"2, 4, 6, 8, 10, 12", goal:1, why:"Median (6 + 8) ÷ 2 = 7; halves 2, 4, 6 and 8, 10, 12 give 4 and 10." },
          { id:"l3", t:"1, 2, 5, 7, 9", goal:1, why:"Median 5; `Q_1` = (1 + 2) ÷ 2 = 1.5 and `Q_3` = (7 + 9) ÷ 2 = 8." },
          { id:"l4", t:"3, 3, 4, 8, 9, 10, 15", goal:1, why:"Median 8, left out: halves 3, 3, 4 and 9, 10, 15 give 3 and 10." },
          { id:"l5", t:"5, 6, 6, 7, 20", goal:2, why:"Median 6; halves 5, 6 and 7, 20 give 5.5 and 13.5.",
            hints:["The median is the 3rd value: 6.", "Lower half 5, 6; upper half 7, 20.", "`Q_1` = 5.5, `Q_3` = 13.5."] },
          { id:"l6", t:"10, 12, 14, 16, 18, 20, 22, 24", goal:1, why:"Median (16 + 18) ÷ 2 = 17; halves 10, 12, 14, 16 and 18, 20, 22, 24 give 13 and 21." }
        ],
        right:[
          { id:"r1", t:"1, 2, 5, 8, 9" }, { id:"r2", t:"2, 4, 7, 10, 12" }, { id:"r3", t:"1, 1.5, 5, 8, 9" },
          { id:"r4", t:"3, 3, 8, 10, 15" }, { id:"r5", t:"5, 5.5, 6, 13.5, 20" }, { id:"r6", t:"10, 13, 17, 21, 24" },
          { id:"r7", t:"1, 3, 5, 7, 9" }, { id:"r8", t:"3, 3.5, 8, 9.5, 15" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6" },
        wrong:{
          "l1|r7":"That’s the data itself. With 5 values, `Q_1` is the median of 1 and 3, which is 2.",
          "l4|r8":"Leave the median (8) out: the lower half is 3, 3, 4, so `Q_1` = 3.",
          "l3|r1":"Look at the second value: 2, not 3. `Q_1` = (1 + 2) ÷ 2 = 1.5."
        },
        wrongDefault:"Find the median first, then split the halves." },
      { id:"spread", type:"numeric", title:"Spread it out", summary:"Spread it out", goal:[1, 2, 3, 4, 5, 6], star:true,
        instruction:"Find each measure. Items marked ★ are non-routine; the last two go beyond the Final Check.",
        how:"Type a number (2 decimals where an answer doesn’t end), then press Check.",
        items:[
          { id:"s1", goal:1, prompt:"IQR of 4, 9, 10, 12, 15, 18, 21, 30", answer:10, tol:0.001, display:"IQR = 10", keypad:"decimal",
            why:"`Q_1` = (9 + 10) ÷ 2 = 9.5 and `Q_3` = (18 + 21) ÷ 2 = 19.5, so IQR = 19.5 − 9.5 = 10.",
            wrong:[{ match:26, fb:"That’s the range." }, { match:9.5, fb:"Those are `Q_1` and `Q_3`. Subtract them." }, { match:19.5, fb:"Those are `Q_1` and `Q_3`. Subtract them." }] },
          { id:"s2", goal:3, prompt:"Sample standard deviation of 3, 7, 7, 7", answer:2, tol:0.005, display:"`s` = 2", keypad:"decimal",
            why:"Mean 6; squares 9, 1, 1, 1 total 12; 12 ÷ 3 = 4; `s = √4 = 2`.",
            wrong:[{ match:4, fb:"That’s `s^2`. " + M4 }, { match:1.73, fb:"That divides by 4. This is a sample. " + M5 }] },
          { id:"s3", goal:3, star:true, prompt:"Population standard deviation of 2, 4, 4, 4, 5, 5, 7, 9", answer:2, tol:0.005, display:"σ = 2", keypad:"decimal",
            why:"Mean 5; squares 9, 1, 1, 1, 0, 0, 4, 16 total 32; 32 ÷ 8 = 4; σ = 2.",
            wrong:[{ match:2.14, fb:"That divides by 7. This is the whole population. " + M5 }],
            hints:["The mean is 40 ÷ 8 = 5.", "The squares are 9, 1, 1, 1, 0, 0, 4, 16, totalling 32.", "32 ÷ 8 = 4, so σ = 2."] },
          { id:"s4", goal:2, star:true, prompt:"`Q_1` = 18 and `Q_3` = 30. Enter the upper fence.", answer:48, tol:0.001, display:"upper fence = 48", keypad:"decimal",
            why:"IQR = 12 and 1.5 × 12 = 18, so the upper fence is 30 + 18 = 48.",
            wrong:[{ match:42, fb:"You added the IQR (12). Add 1.5 × IQR = 18." }, { match:0, fb:"That’s the lower fence, 18 − 18. " + M3 }] },
          { id:"s5", goal:6, star:true, prompt:"A sample 7, 7, 10, 13, 13 has `s` = 3. Every value is multiplied by 3 and then 5 is added. New `s`?", answer:9, tol:0.005, display:"new `s` = 9", keypad:"decimal",
            why:"Multiplying by 3 triples every distance from the mean (`s` = 9); adding 5 moves every value but leaves the distances alone.",
            wrong:[{ match:14, fb:"Adding 5 doesn’t change the spread. " + M6 }, { match:3, fb:"Multiplying by 3 triples every distance." }] },
          { id:"s6", goal:[3, 4], star:true, prompt:"Five values are all 20 (σ = 0). A sixth value, 26, is added. New population σ?", answer:2.2360679775, tol:0.005, display:"σ = √5 ≈ 2.24", keypad:"decimal",
            use:"Use these values: `√5 ≈ 2.24`.",
            why:"The new mean is 126 ÷ 6 = 21. Deviations: five of −1 and one of +5, so the squares total 30; σ² = 30 ÷ 6 = 5 and σ = √5 ≈ 2.24.",
            wrong:[{ match:2.45, fb:"That divides by 5. All 6 values are the population: 30 ÷ 6 = 5, and `√5` ≈ 2.24." }, { match:6, fb:"The new mean is 21, not 20." }],
            hints:["The new mean is (100 + 26) ÷ 6 = 21.", "Deviations: five of −1 and one of +5. The squares total 5 + 25 = 30.", "σ² = 30 ÷ 6 = 5, so σ = `√5` ≈ 2.24."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Augustin", goal:[1, 2, 3],
        instruction:"Augustin made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Find the IQR of 2, 5, 6, 8, 11, 13, 20.",
            steps:["There are 7 values; the median is the 4th, 8.", "Lower half: 2, 5, 6, 8. Upper half: 8, 11, 13, 20.", "`Q_1` = 5.5 and `Q_3` = 12, so IQR = 6.5."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows from step 2. The mistake is earlier."],
            fixes:[
              { t:"Leave the median out: the lower half is 2, 5, 6 (`Q_1` = 5) and the upper half is 11, 13, 20 (`Q_3` = 13), so IQR = 8.", ok:true, why:M1 },
              { t:"IQR = 20 − 2 = 18.", why:"That’s the range. " + M2 },
              { t:"`Q_1` = 2 and `Q_3` = 20.", why:"Those are the extremes." },
              { t:"Step 2 is correct.", why:"The course method leaves the median out when `n` is odd." }],
            hints:["Does the median belong to either half?", "No: the halves are 2, 5, 6 and 11, 13, 20.", "13 − 5 = 8."] },
          { id:"e2", goal:3, task:"Find the sample standard deviation of 4, 6, 8, 10, 12.",
            steps:["The mean is 40 ÷ 5 = 8.", "The deviations are −4, −2, 0, 2, 4.", "The squares are 16, 4, 0, 4, 16, totalling 40.", "Divide by `n - 1`: 40 ÷ 4 = 10.", "So `s` = 10."],
            answer:4,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "Step 4 is correct for a sample.", ""],
            fixes:[
              { t:"`s = √10` ≈ 3.16.", ok:true, why:M4 },
              { t:"`s` = 10 ÷ 2 = 5.", why:"Halving isn’t a square root." },
              { t:"`s` = 40 ÷ 5 = 8.", why:"That’s a different (and wrong) division. " + M5 },
              { t:"Step 5 is correct.", why:"10 is the variance, in squared units." }],
            hints:["What does step 4 give: `s` or `s^2`?", "`s^2`.", "Take the square root: ≈ 3.16."] },
          { id:"e3", goal:2, task:"`Q_1` = 20, median = 24, `Q_3` = 28, maximum 38. Is 38 an outlier?",
            steps:["IQR = 28 − 20 = 8.", "1.5 × IQR = 12.", "Upper fence = median + 12 = 36.", "38 > 36, so 38 is an outlier."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 uses step 3’s fence. The mistake is earlier."],
            fixes:[
              { t:"Upper fence = `Q_3` + 12 = 40. 38 < 40, so it isn’t an outlier.", ok:true, why:M3 },
              { t:"Upper fence = max + 12 = 50.", why:"Fences come from the quartiles." },
              { t:"Upper fence = 1.5 × range.", why:"The rule uses the IQR." },
              { t:"Step 3 is correct.", why:"Fences start from `Q_1` and `Q_3`, not the median." }],
            hints:["Which number does the upper fence start from?", "`Q_3` = 28.", "28 + 12 = 40, and 38 is inside."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in Explore: which measures ignored the 70, and which didn’t?" },
      { id:"j2", q:"In your own words, what does a standard deviation of 3 mean for a set of test marks?" },
      { id:"j3", q:"Explain to a friend the steps for a sample standard deviation, and why it divides by `n - 1`." },
      { id:"j4", q:"Which part of finding quartiles or fences still trips you up? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What is the IQR of 3, 5, 7, 8, 9, 11, 14, 15, 20?", options:[
          { t:"8.5", ok:true, why:"`Q_1` = (5 + 7) ÷ 2 = 6; `Q_3` = (14 + 15) ÷ 2 = 14.5." },
          { t:"7", why:"Leave out the median, 9. " + M1 },
          { t:"17", why:"That’s the range. " + M2 },
          { t:"20.5", why:"Subtract, don’t add. " + M2 }] },
        b:{ prompt:"What is the IQR of 2, 4, 6, 9, 10, 12, 13, 17, 21?", options:[
          { t:"10", ok:true, why:"`Q_1` = 5, `Q_3` = 15." },
          { t:"7", why:"Leave out the median, 10. " + M1 },
          { t:"19", why:"That’s the range. " + M2 },
          { t:"20", why:"Subtract, don’t add. " + M2 }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"What is the sample standard deviation of 4, 6, 8, 10, 12?", use:"Use these values: `√8 ≈ 2.83`, `√10 ≈ 3.16`.", options:[
          { t:"3.16", ok:true, why:"40 ÷ 4 = 10; `√10`." },
          { t:"2.40", why:"That’s the mean distance, not the standard deviation." },
          { t:"2.83", why:"That divides by 5. " + M5 },
          { t:"10", why:"That’s the variance. " + M4 }] },
        b:{ prompt:"What is the sample standard deviation of 7, 7, 10, 13, 13?", use:"Use these values: `√7.2 ≈ 2.68`.", options:[
          { t:"3", ok:true, why:"36 ÷ 4 = 9; `√9`." },
          { t:"2.40", why:"That’s the mean distance, not the standard deviation." },
          { t:"2.68", why:"That divides by 5. " + M5 },
          { t:"9", why:"That’s the variance. " + M4 }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"`Q_1` = 20 and `Q_3` = 30. Which value is an outlier?", options:[
          { t:"46", ok:true, why:"30 + 15 = 45, and 46 > 45." },
          { t:"6", why:"The lower fence is 5; 6 is inside." },
          { t:"38", why:"Measured from the median? Use the quartiles. " + M3 },
          { t:"44", why:"The upper fence is 45; 44 is inside." }] },
        b:{ prompt:"`Q_1` = 12 and `Q_3` = 20. Which value is an outlier?", options:[
          { t:"33", ok:true, why:"20 + 12 = 32." },
          { t:"1", why:"The lower fence is 0." },
          { t:"25", why:"Measured from the median? Use the quartiles. " + M3 },
          { t:"31", why:"The upper fence is 32." }] } },
      { id:"t1", cat:"T", goal:6,
        a:{ prompt:"Every value in a data set is increased by 5. What happens to the mean and the standard deviation?", options:[
          { t:"The mean increases by 5; the standard deviation is unchanged", ok:true, why:"Every distance from the mean stays the same." },
          { t:"Both increase by 5", why:M6 },
          { t:"The mean is unchanged; the standard deviation increases by 5", why:"Shifting moves the centre." },
          { t:"Neither changes", why:"The centre moves with the data." }] },
        b:{ prompt:"Every value in a data set is doubled. What happens to the mean and the standard deviation?", options:[
          { t:"Both double", ok:true, why:"Every distance from the mean doubles." },
          { t:"The mean doubles; the standard deviation is unchanged", why:"Doubling stretches every distance from the mean. " + M6 },
          { t:"The mean doubles; the standard deviation is multiplied by 4", why:"The variance ×4; the SD ×2." },
          { t:"Neither changes", why:"Scaling changes both." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:MODEL + "class P has `Q_1` 62, median 70, `Q_3` 78; class Q has `Q_1` 66, median 70, `Q_3` 74. Which statement is true?", options:[
          { t:"P’s middle half of marks is twice as spread out as Q’s", ok:true, why:"IQRs of 16 and 8." },
          { t:"Q is more spread out", why:"Q’s box is narrower." },
          { t:"P did better, because its `Q_3` is higher", why:"The medians are equal; a higher `Q_3` comes with a lower `Q_1`." },
          { t:"They can’t be compared without means", why:"Medians and IQRs compare them." }] },
        b:{ prompt:MODEL + "team R has `Q_1` 50, median 60, `Q_3` 64; team S has `Q_1` 56, median 60, `Q_3` 62. Which statement is true?", options:[
          { t:"R’s middle half is more spread out (IQR 14 vs 6)", ok:true, why:"64 − 50 = 14 and 62 − 56 = 6." },
          { t:"S is more spread out", why:"S’s box is narrower: IQR 6." },
          { t:"R scored higher overall", why:"The medians are equal (60)." },
          { t:"They can’t be compared without means", why:"Medians and IQRs compare them." }] } },
      { id:"t3", cat:"T", goal:[4, 6],
        a:{ prompt:"Each set has mean 10. Which has the largest standard deviation?", options:[
          { t:"{5, 10, 10, 15}", ok:true, why:"The squares total 25 + 0 + 0 + 25 = 50." },
          { t:"{10, 10, 10, 10}", why:"No spread." },
          { t:"{8, 9, 11, 12}", why:"More different values isn’t more spread: the squares total only 10." },
          { t:"{7, 7, 13, 13}", why:"Four values 3 away give 36, less than two values 5 away." }] },
        b:{ prompt:"Each set has mean 20. Which has the largest standard deviation?", options:[
          { t:"{14, 20, 20, 26}", ok:true, why:"36 + 0 + 0 + 36 = 72." },
          { t:"{20, 20, 20, 20}", why:"No spread." },
          { t:"{16, 18, 22, 24}", why:"The squares total 40. " + M7 },
          { t:"{17, 17, 23, 23}", why:"The squares total 36. " + M7 }] } },
      { id:"c1", cat:"C", goal:[3, 4],
        a:{ prompt:"Which is the best description of standard deviation?", options:[
          { t:"“Roughly the typical distance of the values from the mean.”", ok:true, why:"Square the distances, average them, then take the root." },
          { t:"“The difference between the largest and smallest values.”", why:"That’s the range." },
          { t:"“The spread of the middle 50% of the data.”", why:"That’s the IQR." },
          { t:"“The average of the values.”", why:"That’s the mean." }] },
        b:{ prompt:"Why does a <strong>sample</strong> standard deviation divide by `n - 1`?", options:[
          { t:"“A sample’s values sit closer to their own mean than to the population mean, so dividing by `n - 1` corrects the underestimate.”", ok:true, why:"Dividing by a smaller number makes the result slightly bigger." },
          { t:"“Because one value is always an outlier and is left out.”", why:"No value is removed." },
          { t:"“Because it makes the arithmetic easier.”", why:"It’s about accuracy, not ease." },
          { t:"“It doesn’t matter: `n` and `n - 1` give the same result.”", why:"They differ, especially for small `n`. " + M5 }] } },
      { id:"c2", cat:"C", goal:[2, 5],
        a:{ prompt:"A box plot has minimum 30, `Q_1` 40, median 50, `Q_3` 70, maximum 90. Which statement is correct?", options:[
          { t:"“The upper part of the box is longer, so the third quarter of the data is more spread out than the second.”", ok:true, why:"50 to 70 is twice as wide as 40 to 50, and each holds 25% of the data." },
          { t:"“25% of the data lie between 40 and 70.”", why:"Between `Q_1` and `Q_3` is 50%." },
          { t:"“The mean is 50.”", why:"50 is the median; a box plot doesn’t show the mean." },
          { t:"“Half of the data lie above 70.”", why:"Only 25% lie above `Q_3`." }] },
        b:{ prompt:"A box plot has minimum 5, `Q_1` 20, median 35, `Q_3` 40, maximum 45. Which statement is correct?", options:[
          { t:"“The long lower whisker and lower box show the data are skewed left.”", ok:true, why:"The lower quarters stretch out much further than the upper ones." },
          { t:"“The IQR is 40.”", why:"40 is the range; the IQR is 20. " + M2 },
          { t:"“75% of the data are below 35.”", why:"50% are below the median." },
          { t:"“The data are skewed right.”", why:"The long tail is on the left." }] } },
      { id:"a1", cat:"A", goal:[4, 5],
        a:{ prompt:MODEL + "two goalies both average 28 saves per game. Goalie A has `s` = 2 and goalie B has `s` = 6. A coach wants a dependable starter. Which statement is best?", options:[
          { t:"“Goalie A: the same average with less variation, so the game-to-game performance is more predictable.”", ok:true, why:"A’s games typically land within about 2 saves of 28." },
          { t:"“Goalie B: a larger SD means more saves.”", why:"SD measures spread, not level." },
          { t:"“Either: the means are equal, so they’re the same.”", why:"Equal means can hide different consistency." },
          { t:"“Goalie B: big spread means great games are more likely, so B is more dependable.”", why:"B also has more poor games." }] },
        b:{ prompt:MODEL + "bakery P’s loaves have mean mass 500 g with `s` = 4 g; bakery Q’s have mean 505 g with `s` = 15 g. Which is more consistent?", options:[
          { t:"“P: its loaves vary much less around the mean.”", ok:true, why:"`s` = 4 g against 15 g." },
          { t:"“Q: its mean is higher.”", why:"A higher mean isn’t more consistency." },
          { t:"“They’re equally consistent.”", why:"`s` = 4 vs `s` = 15." },
          { t:"“Can’t tell without the medians.”", why:"SD alone answers “consistent”." }] } },
      { id:"a2", cat:"A", goal:2,
        a:{ prompt:MODEL + "daily snowfall (cm) over 11 days: 0, 1, 1, 2, 2, 3, 4, 4, 5, 6, 25. Is 25 an outlier?", options:[
          { t:"“Yes: `Q_1` = 1, `Q_3` = 5, IQR = 4, so the upper fence is 11 and 25 > 11.”", ok:true, why:"Leave out the median (3): the halves are 0, 1, 1, 2, 2 and 4, 4, 5, 6, 25." },
          { t:"“No: 25 is less than `Q_3` + 1.5 × range = 42.5.”", why:M3 },
          { t:"“No: outliers must be more than 10 times the median.”", why:"That isn’t the course rule." },
          { t:"“Yes, because it’s the largest value.”", why:"Being the largest isn’t enough; it must pass the fence." }] },
        b:{ prompt:MODEL + "ages of 9 club members: 15, 16, 16, 17, 17, 18, 19, 20, 29. Is 29 an outlier?", options:[
          { t:"“Yes: `Q_1` = 16, `Q_3` = 19.5, IQR = 3.5, so the fence is 24.75 and 29 > 24.75.”", ok:true, why:"Leave out the median (17): the halves are 15, 16, 16, 17 and 18, 19, 20, 29." },
          { t:"“No: 29 is less than `Q_3` + 1.5 × range = 40.5.”", why:M3 },
          { t:"“No: it’s within 12 years of the median.”", why:"That isn’t the rule." },
          { t:"“Yes, because it’s the largest value.”", why:"Largest isn’t enough." }] } }
    ]
  },
  task:{
    title:"Steady practice", summary:"Steady practice",
    statement:"<p>An athlete records five practice times (whole minutes, 0–20) as a <strong>sample</strong>. Design five times that meet every condition. Can you find all the answers?</p>" +
      '<ol class="sp-conds"><li>The mean is 10.</li><li>The sample standard deviation is exactly 3.</li><li>The range is at most 7.</li></ol>',
    checks:["Mean 10", "Sample SD exactly 3", "Range at most 7"],
    tips:["Mean 10 means the times total 50.", "`s` = 3 means `s^2` = 9, and for 5 values " + SUMSQ + " = 4 × 9 = 36.", "Look for deviations that total 0 and whose squares total 36, such as −3, −3, 0, 3, 3.", "The largest and smallest times can be at most 7 apart."],
    explainPrompt:"Explain how you turned “`s` = 3” into a target for the squared deviations, and how you kept the range small.",
    vocab:"Use the words deviation, squared, sample, `n - 1` and range.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Two more sets have mean 10 and `s` = 3 (5, 10, 11, 11, 13 and 7, 9, 9, 10, 15), but both have a range of 8."
  },
  cards:[
    ["Range", "max − min. Quick, but ruled by the extremes."],
    ["Quartiles (course method)", "The median of each half, leaving the median out when `n` is odd."],
    ["IQR", "`Q_3 - Q_1`: the spread of the middle 50%."],
    ["Five-number summary", "min, `Q_1`, median, `Q_3`, max: the box plot."],
    ["Outlier fences", "`Q_1` − 1.5 × IQR and `Q_3` + 1.5 × IQR."],
    ["Deviation", DEV + ". Deviations always total 0."],
    ["Sample SD", '<span class="m"><i>s</i> = √[Σ(<i>x</i> − <i>x̄</i>)<sup>2</sup> ÷ (<i>n</i> − 1)]</span>.'],
    ["Population SD", "`σ = √[Σ(x - μ)^2 ÷ N]`."],
    ["Variance", "The square of the SD, in squared units."],
    ["Add a constant", "Mean shifts; SD and IQR stay the same."],
    ["Multiply by `k`", "Mean, SD and IQR all multiply by `k` (for `k` > 0)."],
    ["Matching pairs", "Skewed: median + IQR. Symmetric: mean + SD."]
  ]
};
