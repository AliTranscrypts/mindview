// MDM4U 31 Measures of Central Tendency. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/31-central-tendency.md
// Core feedback sentences for the plan's misconceptions (§3), used where the plan names only the code.
const M1 = "The median is the middle of the <strong>sorted</strong> data. Put the values in order first.";
const M2 = "With an even count there are two middle values. The median is their average.";
const M3 = "The mean uses the size of every value, so one extreme value drags it. The median only cares about position.";
const M4 = "A weighted mean multiplies each value by its weight. A simple average treats every part as equally important.";
const M5 = "Use each class’s midpoint, and divide by the total frequency, not the number of classes.";
const M7 = "Means don’t average like that. Work with totals: total = mean × number of values.";

export default {
  id:"31-central-tendency",
  kind:"topic",
  title:"Measures of central tendency",
  topic:"Measures of Central Tendency",
  readyTopic:"measures of central tendency",
  hero:{
    eq:"mean · median · mode",
    eqLabel:"mean, median and mode",
    eqSize:"md",
    headline:"Three ways to say ‘typical’",
    text:"The <strong>mean</strong> balances the data, the <strong>median</strong> sits in the middle, and the <strong>mode</strong> is the most common value. They often agree, but when one value is extreme they pull apart, and choosing the right one becomes a judgement call.",
    fig:{ aria:"Seven dots on a number line from 0 to 20 at 2, 4, 4, 5, 7, 9 and 11 sit on a seesaw beam. The fulcrum is at the mean, 6, and the beam is level. The dot at 11 slides to 20: the beam tips right, then the fulcrum slides to about 7.29 and the beam levels. A bracket over the median stays on 5: it didn’t move.", shape:"wide" }
  },
  goals:[
    "I can calculate the mean, median and mode of a data set, including sets with an even number of values.",
    "I can explain the mean as a balance point and the median as the middle, and predict how an outlier affects each.",
    "I can calculate and interpret a weighted mean.",
    "I can estimate the mean of grouped data using class midpoints.",
    "I can choose and justify the most appropriate measure of centre for a data set and its context.",
    "I can work backwards from a mean to find a missing value or a needed score."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Ordering data", goal:1, prompt:"What is the median of 7, 3, 9, 3, 5?",
          options:[
            { t:"5", ok:true, why:"Sorted: 3, 3, 5, 7, 9. The third value is 5." },
            { t:"9", why:"9 is the middle of the unsorted list. Sort first." },
            { t:"3", why:"3 is the most frequent value, not the middle." },
            { t:"5.4", why:"27 ÷ 5 = 5.4 is the mean." }],
          hints:["Put the values in order.", "3, 3, 5, 7, 9.", "The middle one is 5."] },
        { id:"w2", skill:"Ordering data", goal:1, prompt:"What is the median of 12, 2, 10, 6?",
          options:[
            { t:"8", ok:true, why:"Sorted: 2, 6, 10, 12. The middle two are 6 and 10, and their average is 8." },
            { t:"6", why:"That averages the middle of the unsorted list (2 and 10). Sort first." },
            { t:"10", why:"That picks one middle value. Average the two middle values." },
            { t:"7.5", why:"30 ÷ 4 = 7.5 is the mean." }],
          hints:["Sort, then count: there are 4 values.", "The middle two are 6 and 10.", "(6 + 10) ÷ 2 = 8."] },
        { id:"w3", skill:"Computing a mean", goal:1, prompt:"What is the mean of 4, 8, 9, 11?",
          options:[
            { t:"8", ok:true, why:"32 ÷ 4 = 8." },
            { t:"8.5", why:"(8 + 9) ÷ 2 is the median." },
            { t:"10.67", why:"That divides by 3. There are 4 values." },
            { t:"32", why:"32 is the total. Divide by the count." }],
          hints:["Add, then divide by the count.", "The total is 32.", "32 ÷ 4 = 8."] },
        { id:"w4", skill:"Computing a mean", goal:6, prompt:"Four test marks have a mean of 70. What is their total?",
          options:[
            { t:"280", ok:true, why:"Total = mean × count = 70 × 4." },
            { t:"70", why:"70 is the mean." },
            { t:"74", why:"That adds the count. Multiply, don’t add." },
            { t:"17.5", why:"70 ÷ 4 undoes nothing; total = 70 × 4." }],
          hints:["Mean = total ÷ count.", "So total = mean × count.", "70 × 4 = 280."] },
        { id:"w5", skill:"Reading frequency tables", goal:4, prompt:"A table lists scores 1, 2 and 3 with frequencies 4, 1 and 5. How many data values are there?",
          options:[
            { t:"10", ok:true, why:"4 + 1 + 5 = 10." },
            { t:"3", why:"That counts the rows. Each row stands for several values." },
            { t:"6", why:"1 + 2 + 3 adds the scores, not how many there are." },
            { t:"21", why:"That adds score × frequency: that’s the total of all the values." }],
          hints:["Frequency means ‘how many’.", "Add the frequency column.", "10."] },
        { id:"w6", skill:"Reading frequency tables", goal:5, prompt:"Same table (scores 1, 2, 3 with frequencies 4, 1, 5). What is the mode?",
          options:[
            { t:"3", ok:true, why:"Score 3 appears 5 times, more than any other." },
            { t:"5", why:"5 is how often; the mode is the score. The mode is the <strong>value</strong> that appears most often, not how many times it appears." },
            { t:"1", why:"Score 1 appears only 4 times." },
            { t:"2", why:"Middle isn’t the same as most frequent." }],
          hints:["Which score appears most often?", "Compare the frequencies 4, 1, 5.", "Score 3."] }
      ],
      refreshers:{
        "Ordering data":"Sort the data before finding a median. With <i>n</i> values, the median is in position (<i>n</i> + 1) ÷ 2. If that’s a half, average the two neighbours.",
        "Computing a mean":"Mean = total ÷ count, so total = mean × count. Working with totals makes ‘missing value’ problems easy.",
        "Reading frequency tables":"The frequency says how many times a value appears. <i>n</i> = Σ<i>f</i>, and the total of all values = Σ(value × <i>f</i>)."
      }
    }
  },
  explore:{
    heading:"Balance and middle",
    intro:"Drag the dots, add new ones, and watch the three centres. The beam tips until the fulcrum reaches the mean; the bracket always marks the middle of the sorted dots.",
    predIntro:"Make a prediction first. Then the dot plot will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"bal" },
        prompt:"Drag the 11 to 20. What happens?",
        options:[{ t:"The mean rises and the median stays at 5", ok:true }, { t:"Both rise" }, { t:"The median rises and the mean stays" }, { t:"Neither changes" }],
        explain:"The total grew by 9, so the mean grew. The middle value is still the 4th of 7. " + M3 },
      { id:"p2", start:{ mode:"mid" },
        prompt:"Add an eighth value, 6. What is the new median?",
        options:[{ t:"5.5", ok:true }, { t:"5" }, { t:"6" }, { t:"6.5" }],
        explain:"Eight values give two middle values: (5 + 6) ÷ 2 = 5.5." },
      { id:"p3", start:{ mode:"wt" },
        prompt:"Weighted mode: a test mark of 70 weighted 25% and an exam mark of 90 weighted 75%. What is the final mark?",
        options:[{ t:"85", ok:true }, { t:"80" }, { t:"75" }, { t:"90" }],
        explain:"The exam counts three times as much, so the final mark sits closer to 90. A simple average, 80, ignores the weights." },
      { id:"p4", start:{ mode:"grp" },
        prompt:"Grouped mode: classes [0, 10) with frequency 2, [10, 20) with 5, [20, 30) with 3. What is the estimated mean?",
        options:[{ t:"16", ok:true }, { t:"11" }, { t:"15" }, { t:"53.3" }],
        explain:"Use the midpoints and divide by the 10 values. Lower ends give 11, an underestimate; dividing by the 3 classes gives 53.3." }
    ],
    chalIntro:"Use the dot plot or the weighted panel to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 6], prompt:"Make a set of 5 whole numbers (0–20) with mean 8 and median 6.",
        why:"Five values with mean 8 total 40, and the 3rd sorted value is 6. For example, 2, 4, 6, 12, 16 or 6, 6, 6, 10, 12.",
        hints:["Mean 8 with five values means a total of 40.", "Put 6 in the middle, two values ≤ 6 below it and two values ≥ 6 above it.", "For example, 2, 4, 6, 12, 16: the total is 40 and the middle is 6."] },
      { id:"tc2", goal:[3, 6], prompt:"Weighted mode: your term mark is 72 and counts 70%. Set the exam mark (counts 30%) so your final mark is exactly 75.",
        why:"0.7 × 72 + 0.3 × 82 = 50.4 + 24.6 = 75.",
        hints:["Final = 0.7 × term + 0.3 × exam.", "0.7 × 72 = 50.4, so 0.3 × exam must be 24.6.", "Exam = 24.6 ÷ 0.3 = 82."] },
      { id:"tc3", goal:[1, 6], stretch:true, prompt:"Build a set of 6 whole numbers (0–20) whose mean, median and mode are all 10, with a range of exactly 12.",
        why:"The total is 60, the 3rd and 4th sorted values average 10, 10 appears more often than any other value, and the ends are 12 apart (e.g. 4, 8, 10, 10, 12, 16 or 4, 10, 10, 10, 10, 16).",
        hints:["The total must be 60, and the ends must be 12 apart.", "Put 10 in both middle positions, then balance the ends around 10 (one 6 below, one 6 above).", "4, 8, 10, 10, 12, 16 works: the 8 and 12 also balance."] }
    ]
  },
  part3:{
    slug:"which-centre", name:"Which centre?",
    heading:"Which centre?",
    intro:"Each station is a real decision. Choose the centre that best describes the data in its context, then open <strong>Check it with data</strong> to see the numbers behind the choice.",
    stations:[
      { id:"s1", title:"The paycheque",
        text:"Weekly pay at a small shop (in $100s) for 9 people: 3.8, 4.0, 4.2, 4.5, 4.5, 4.8, 5.2, 5.5, 25.0 (the owner). Which centre should you report as ‘typical pay’?",
        data:[3.8, 4.0, 4.2, 4.5, 4.5, 4.8, 5.2, 5.5, 25.0], x0:0, x1:26, unit:"pay ($100s)",
        choices:[
          { id:"mean", t:"Mean ($683)", fb:"Eight of nine people earn less than the mean. The owner’s $2500 drags it up. " + M3 },
          { id:"median", t:"Median ($450)", ok:true, fb:"Eight of nine people earn less than the mean. The median describes a typical worker." },
          { id:"mode", t:"Mode ($450)", fb:"The mode matches the median here, but only two people earn exactly $450, so it says little. The median describes the middle worker." }],
        check:"Total 61.5, so the mean is 61.5 ÷ 9 ≈ 6.83 ($683). Sorted, the median is the 5th value, 4.5 ($450)." },
      { id:"s2", title:"The shoe order",
        text:"A store sold sizes 6, 7, 7, 8, 8, 8, 8, 9, 9, 10 last week. Which centre tells the store what to reorder most?",
        data:[6, 7, 7, 8, 8, 8, 8, 9, 9, 10], x0:5, x1:11, unit:"shoe size",
        choices:[
          { id:"mean", t:"Mean", fb:"The store needs the size sold most often. The mean 8.0 happens to be a size here, but means are often impossible sizes such as 8.4." },
          { id:"median", t:"Median", fb:"Half above isn’t ‘most popular’. The store needs the size sold most often." },
          { id:"mode", t:"Mode", ok:true, fb:"The mode (size 8) is the size sold most often, exactly what the store reorders most." }],
        check:"Size 8 sold 4 times, more than any other: the mode is 8. The mean 80 ÷ 10 = 8.0 happens to be a size here, but means are often impossible sizes such as 8.4." },
      { id:"s3", title:"The test",
        text:"Marks 58, 64, 70, 72, 74, 76, 82, 90, with no extreme values. Which centre should you report to compare with last year’s class mean?",
        data:[58, 64, 70, 72, 74, 76, 82, 90], x0:50, x1:100, unit:"mark",
        choices:[
          { id:"mean", t:"Mean", ok:true, fb:"Report the mean (73.25): with no extreme marks it uses every mark, and it compares directly with last year’s class mean." },
          { id:"median", t:"Median", fb:"The median (73) is close, but last year reported a mean, and with no extreme marks the mean uses every mark." },
          { id:"mode", t:"Mode", fb:"No mark repeats, so there is no mode." }],
        check:"The mean is 586 ÷ 8 = 73.25 and the median is (72 + 74) ÷ 2 = 73: close, and the mean uses every mark." },
      { id:"s4", title:"Which way is it skewed?",
        text:"Each dot plot shows its mean (the fulcrum) and its median (the bracket). Tap the shape of each data set.",
        plots:[
          { id:"pa", label:"Plot A", data:[1, 4, 7, 8, 8, 9, 9, 9, 10, 10], answer:"left" },
          { id:"pb", label:"Plot B", data:[1, 1, 2, 2, 2, 3, 3, 4, 6, 9], answer:"right" },
          { id:"pc", label:"Plot C", data:[2, 3, 4, 4, 5, 5, 5, 6, 6, 7, 8], answer:"sym" }],
        shapes:[{ id:"right", t:"skewed right" }, { id:"sym", t:"symmetric" }, { id:"left", t:"skewed left" }],
        rule:"The rule: the mean is pulled toward the tail. Mean above median: skewed right. Mean below median: skewed left. Mean ≈ median: roughly symmetric." }
    ],
    quickCheck:{
      title:"Which centre? quick check", summary:"Which centre? quick check",
      items:[
        { id:"q1", goal:5, prompt:"Best centre for the typical price of homes on a street with two mansions?",
          choices:[
            { t:"Median", ok:true, fb:"Right. The median stays with the typical home." },
            { t:"Mean", fb:"The two mansions pull the mean up." },
            { t:"Mode", fb:"The two mansions pull the mean up; prices rarely repeat, so the mode says little. Use the median." },
            { t:"Range", fb:"Range measures spread, not centre. The two mansions pull the mean up." }] },
        { id:"q2", goal:5, prompt:"Best centre for the most popular pizza topping?",
          choices:[
            { t:"Mode", ok:true, fb:"Right. Toppings are categories, so only the mode works." },
            { t:"Median", fb:"Toppings are categories. Only the mode works." },
            { t:"Mean", fb:"Toppings are categories. Only the mode works." },
            { t:"Midpoint", fb:"Toppings are categories. Only the mode works." }] },
        { id:"q3", goal:2, prompt:"The mean is 52 and the median is 45. The data are probably…",
          choices:[
            { t:"skewed right", ok:true, fb:"Right. High values pull the mean above the median." },
            { t:"skewed left", fb:"High values pull the mean above the median." },
            { t:"symmetric", fb:"High values pull the mean above the median." },
            { t:"bimodal", fb:"High values pull the mean above the median." }] },
        { id:"q4", goal:2, prompt:"Which centre changes most if the largest value doubles?",
          choices:[
            { t:"Mean", ok:true, fb:"Right. Only the mean uses the size of the largest value." },
            { t:"Median", fb:"Only the mean uses the size of the largest value." },
            { t:"Mode", fb:"Only the mean uses the size of the largest value." },
            { t:"None", fb:"Only the mean uses the size of the largest value." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"fits", type:"sorter", title:"Which centre fits?", summary:"Which centre fits?", goal:[5, 2], noun:"situation", txt:true,
        instruction:"Sort each situation by the centre that describes it best.",
        how:"Tap a situation, then tap the box it belongs in.",
        boxes:[{ id:"mean", label:"Mean", sub:"symmetric, no extremes" }, { id:"median", label:"Median", sub:"skewed or with outliers" }, { id:"mode", label:"Mode", sub:"categories or most popular" }],
        wrongDefault:"Ask: is the data categorical, skewed or symmetric?",
        items:[
          { id:"i1", goal:5, t:"The T-shirt size a club should order most of", answer:"mode", why:"The club needs the size wanted most often: the mode." },
          { id:"i2", goal:[5, 2], t:"A typical house price in a city with some very expensive homes", answer:"median", why:"A few very expensive homes pull the mean up; the median stays with the typical home.",
            wrong:{ mean:"A few very large values pull the mean up. The median resists them." } },
          { id:"i3", goal:5, t:"A class’s test performance with no extreme marks, to compare with last year", answer:"mean", why:"No extreme marks, so the mean uses every mark and compares fairly." },
          { id:"i4", goal:5, t:"The favourite type of music in a school survey", answer:"mode", why:"Music types are categories: only the mode works.",
            wrong:{ median:"Music types can’t be put in numerical order; only the mode works." } },
          { id:"i5", goal:[5, 2], t:"A typical commute when a few people travel over two hours", answer:"median", why:"The two-hour commutes pull the mean up but not the middle.",
            hints:["What do the two-hour commutes do to each centre?", "They pull the mean up but not the middle.", "Median."] },
          { id:"i6", goal:5, t:"The average daily high temperature in July (no extremes)", answer:"mean", why:"With no extremes, the mean uses every day’s high." },
          { id:"i7", goal:[5, 2], t:"A typical family income in a town", answer:"median", why:"A few high incomes pull the mean up; the median describes a typical family.",
            wrong:{ mean:"A few very large values pull the mean up. The median resists them." } },
          { id:"i8", goal:5, t:"The bus route used most often", answer:"mode", why:"Routes are categories: the mode is the route used most often." },
          { id:"i9", goal:5, t:"A hockey player’s goals per game over a full season, used to compute season totals", answer:"mean", why:"Season totals come from mean × games, so the mean is the useful centre here.",
            wrong:{ median:"Season totals come from mean × games, so the mean is the useful centre here." } }
        ] },
      { id:"find", type:"custom", title:"Find it", summary:"Find it", goal:[1, 3, 4, 6], star:true,
        instruction:"Find each centre. Items marked ★ are non-routine; the last two go beyond the Final Check.",
        how:"Type a number such as 7.5, then press Check.",
        items:[
          { id:"f1", goal:1, prompt:"Median of 3, 7, 7, 2, 9, 12, 5, 10", answer:7, display:"median 7",
            why:"Sorted: 2, 3, 5, 7, 7, 9, 10, 12. The middle two are 7 and 7, so the median is 7.",
            wrong:[{ match:9, fb:"Sort: 2, 3, 5, 7, 7, 9, 10, 12. The middle two are 7 and 7." }, { match:7.5, fb:"Sort: 2, 3, 5, 7, 7, 9, 10, 12. The middle two are 7 and 7." }],
            fb:M1 },
          { id:"f2", goal:3, prompt:"Tests count 40%, assignments 20% and the exam 40%. The marks are 75, 90 and 60. Final mark?", answer:72, display:"72",
            why:"0.4 × 75 + 0.2 × 90 + 0.4 × 60 = 30 + 18 + 24 = 72.",
            wrong:[{ match:75, fb:"That’s the simple average. " + M4 }], fb:M4 },
          { id:"f3", goal:4, star:true, prompt:"Ages: [10, 20) has frequency 6, [20, 30) has 10 and [30, 40) has 4. Estimate the mean age.", answer:24, display:"about 24",
            why:"Midpoints 15, 25 and 35: (90 + 250 + 140) ÷ 20 = 480 ÷ 20 = 24.",
            wrong:[{ match:19, fb:"Use midpoints, not lower ends." }, { match:160, fb:"Divide by 20 values, not 3 classes." }], fb:M5 },
          { id:"f4", goal:6, star:true, prompt:"Six numbers have a mean of 15. One is removed and the other five have a mean of 14. What was removed?", answer:20, display:"20",
            why:"Totals: 6 × 15 = 90 and 5 × 14 = 70, so the removed number is 90 − 70 = 20.",
            wrong:[{ match:1, fb:"Use totals: 90 − 70 = 20." }, { match:14.5, fb:"Use totals: 90 − 70 = 20." }], fb:M7 },
          { id:"f5", goal:6, star:true, prompt:"Class A has 20 students with mean 70; class B has 30 students with mean 80. What is the combined mean?", answer:76, display:"76",
            why:"(1400 + 2400) ÷ 50 = 3800 ÷ 50 = 76.",
            wrong:[{ match:75, fb:"The classes are different sizes: (1400 + 2400) ÷ 50." }], fb:M7,
            hints:["Find each class’s total.", "20 × 70 = 1400 and 30 × 80 = 2400.", "3800 ÷ 50 = 76."] },
          { id:"f6", goal:[1, 6], star:true, prompt:"Seven numbers have median 10 and mean 12. Every value is doubled, then 3 is added. Enter the new median, then the new mean.",
            parts:["New median =", "New mean ="], answer:[23, 27], display:"median 23, mean 27",
            why:"Doubling then adding 3 does the same thing to every value, in order: median 2 × 10 + 3 = 23 and mean 2 × 12 + 3 = 27.",
            wrong:[{ part:0, match:20, fb:"You doubled but forgot to add 3." }, { part:1, match:24, fb:"You doubled but forgot to add 3." },
              { part:0, match:13, fb:"You added 3 but forgot to double." }, { part:1, match:15, fb:"You added 3 but forgot to double." }],
            hints:["Doubling then adding 3 does the same thing to every value, in order.", "The middle value is still the middle: 2 × 10 + 3.", "Median 23; mean 2 × 12 + 3 = 27."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Gemma", goal:[1, 3, 4],
        instruction:"Gemma made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Find the median of 9, 4, 15, 6, 11, 8.",
            steps:["There are 6 values, so the median is the average of the 3rd and 4th values.", "The 3rd and 4th values are 15 and 6.", "(15 + 6) ÷ 2 = 10.5."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 does the arithmetic right. The mistake is earlier."],
            fixes:[
              { t:"Sort first: 4, 6, 8, 9, 11, 15. The 3rd and 4th values are 8 and 9, so the median is 8.5.", ok:true, why:"Positions only make sense after sorting: (8 + 9) ÷ 2 = 8.5." },
              { t:"Use the 3rd value only: 15.", why:"With an even count, average two values." },
              { t:"Find the mean instead: 53 ÷ 6.", why:"That’s a different measure." },
              { t:"Step 2 is correct.", why:"Positions only make sense after sorting. " + M1 }],
            hints:["Were the values sorted?", "Sort: 4, 6, 8, 9, 11, 15.", "(8 + 9) ÷ 2 = 8.5."] },
          { id:"e2", goal:3, task:"The term mark of 80 counts 60% and the exam mark of 70 counts 40%. Find the final mark.",
            steps:["Write the weights as decimals: 0.6 and 0.4.", "Final = 0.6 × 70 + 0.4 × 80", "= 42 + 32 = 74."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "The arithmetic in step 3 is fine."],
            fixes:[
              { t:"Match each weight to its own mark: 0.6 × 80 + 0.4 × 70 = 48 + 28 = 76.", ok:true, why:"The 60% belongs to the term mark of 80." },
              { t:"(80 + 70) ÷ 2 = 75.", why:"That ignores the weights. " + M4 },
              { t:"0.6 + 0.4 = 1, so final = 80.", why:"The weights must multiply the marks." },
              { t:"Step 2 is correct.", why:"The 60% belongs to the term mark of 80." }],
            hints:["Which mark is worth 60%?", "The term mark, 80.", "48 + 28 = 76."] },
          { id:"e3", goal:4, task:"Estimate the mean: class [0, 10) has frequency 4 and [10, 20) has 6.",
            steps:["The midpoints are 5 and 15.", "Multiply: 5 × 4 = 20 and 15 × 6 = 90.", "Add: 20 + 90 = 110.", "Divide by the number of classes: 110 ÷ 2 = 55."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"Divide by the total frequency: 110 ÷ 10 = 11.", ok:true, why:"There are 4 + 6 = 10 values, so the estimate is 110 ÷ 10 = 11." },
              { t:"Divide by 20, the top of the last class.", why:"The divisor is the number of values." },
              { t:"Use lower ends instead: (0 + 60) ÷ 10.", why:"Midpoints give the better estimate. " + M5 },
              { t:"Step 4 is correct.", why:"55 is bigger than every value in the data." }],
            hints:["How many values are in the table?", "4 + 6 = 10.", "110 ÷ 10 = 11."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in Explore: how far the mean moved, or how still the median stayed?" },
      { id:"j2", q:"In your own words, explain why the mean is called a balance point." },
      { id:"j3", q:"Explain to a friend how to estimate the mean from a grouped frequency table." },
      { id:"j4", q:"When choosing between mean and median, what do you still find tricky? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What is the median of 15, 9, 22, 9, 18, 12?", options:[
          { t:"13.5", ok:true, why:"Sorted: 9, 9, 12, 15, 18, 22. (12 + 15) ÷ 2 = 13.5." },
          { t:"12", why:"Average the two middle values: 12 and 15." },
          { t:"14.17", why:"85 ÷ 6 is the mean." },
          { t:"15.5", why:"Sort first. " + M1 }] },
        b:{ prompt:"What is the median of 31, 14, 25, 11, 20, 17?", options:[
          { t:"18.5", ok:true, why:"Sorted: 11, 14, 17, 20, 25, 31. (17 + 20) ÷ 2 = 18.5." },
          { t:"17", why:M2 },
          { t:"18", why:"Sort first. " + M1 },
          { t:"19.67", why:"118 ÷ 6 is the mean." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Assignments (80) count 40% and the final exam (65) counts 60%. What is the final mark?", options:[
          { t:"71", ok:true, why:"0.4 × 80 + 0.6 × 65 = 32 + 39." },
          { t:"72.5", why:"That’s the simple average. " + M4 },
          { t:"74", why:"That swaps the weights." },
          { t:"145", why:"That’s the sum, not a mark." }] },
        b:{ prompt:"Labs (90) count 30% and tests (70) count 70%. What is the final mark?", options:[
          { t:"76", ok:true, why:"27 + 49." },
          { t:"80", why:"That’s the simple average. " + M4 },
          { t:"84", why:"Weights swapped." },
          { t:"160", why:"Sum, not a mark." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"Data: 4, 5, 5, 6, 30. If the 30 is removed, what happens to the mean and median?", options:[
          { t:"The mean goes from 10 to 5; the median stays at 5", ok:true, why:"Without 30: 4, 5, 5, 6 has mean 5 and median 5." },
          { t:"The mean stays at 10; the median stays at 5.", why:"The mean used the 30, so it must change." },
          { t:"The mean goes from 10 to 5; the median goes from 5 to 4.5.", why:"The median of 4, 5, 5, 6 is (5 + 5) ÷ 2 = 5." },
          { t:"The mean goes from 10 to 6; the median goes from 5 to 6.", why:"20 ÷ 4 = 5, not 6." }] },
        b:{ prompt:"Data: 2, 20, 22, 23, 23. If the 2 is removed, what happens?", options:[
          { t:"The mean goes from 18 to 22; the median goes from 22 to 22.5", ok:true, why:"20, 22, 23, 23 has mean 22 and median 22.5." },
          { t:"The mean stays at 18; the median goes to 22.5.", why:M3 },
          { t:"The mean goes from 18 to 22; the median stays exactly 22.", why:"With four values, the median is (22 + 23) ÷ 2." },
          { t:"The mean goes from 18 to 22.5; the median stays at 22.", why:"Mean and median are swapped." }] } },
      { id:"t1", cat:"T", goal:6,
        a:{ prompt:"The mean of 4 tests is 76. What mark on a 5th test raises the mean to exactly 80?", options:[
          { t:"96", ok:true, why:"Totals: 5 × 80 − 4 × 76 = 400 − 304." },
          { t:"80", why:"A mark of 80 keeps the mean below 80." },
          { t:"84", why:"Averaging 76 with the new mark doesn’t work. " + M7 },
          { t:"100", why:"Too much: the mean would be 80.8." }] },
        b:{ prompt:"The mean of 5 tests is 70. What mark on a 6th test makes the mean exactly 72?", options:[
          { t:"82", ok:true, why:"6 × 72 − 5 × 70 = 432 − 350." },
          { t:"72", why:"A mark of 72 keeps the mean below 72." },
          { t:"74", why:"Averaging 70 with the new mark doesn’t work. " + M7 },
          { t:"77", why:"Adding the count doesn’t work." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Classes: [0, 4) frequency 3, [4, 8) frequency 5, [8, 12) frequency 2. Estimate the mean.", options:[
          { t:"5.6", ok:true, why:"(2 × 3 + 6 × 5 + 10 × 2) ÷ 10 = 56 ÷ 10." },
          { t:"3.6", why:"That uses the lower ends. " + M5 },
          { t:"6", why:"That’s just the modal class’s midpoint." },
          { t:"18.7", why:"Divide by 10 values, not 3 classes." }] },
        b:{ prompt:"Classes: [10, 20) frequency 4, [20, 30) frequency 4, [30, 40) frequency 2. Estimate the mean.", options:[
          { t:"23", ok:true, why:"(60 + 100 + 70) ÷ 10." },
          { t:"18", why:"That uses the lower ends. " + M5 },
          { t:"25", why:"Middle class midpoint only." },
          { t:"76.7", why:"Divide by 10 values, not 3 classes." }] } },
      { id:"t3", cat:"T", goal:[1, 6],
        a:{ prompt:"Five whole numbers have mean 8, median 9 and only one mode, 10. The smallest is 3. What is the second smallest?", options:[
          { t:"8", ok:true, why:"Sorted: 3, ?, 9, 10, 10 (the mode needs two 10s). Total 40, so ? = 40 − 32 = 8." },
          { t:"9", why:"That copies the median; then 9 would tie 10 as a mode." },
          { t:"13", why:"That uses 5 × 9 = 45 as the total; the total comes from the mean." },
          { t:"18", why:"Only one 10 is used; the mode needs at least two, and 18 can’t sit below the median." }] },
        b:{ prompt:"Five whole numbers have mean 12, median 13 and only one mode, 15. The smallest is 5. What is the second smallest?", options:[
          { t:"12", ok:true, why:"5, ?, 13, 15, 15 with total 60: ? = 12." },
          { t:"13", why:"That would tie 13 with 15 as a mode." },
          { t:"17", why:"5 × 13 = 65 uses the median." },
          { t:"27", why:"One 15 isn’t enough for a mode." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the best explanation for reporting the median house price in a town where a few mansions sold?", options:[
          { t:"“The few very high prices pull the mean up, but the median stays with the typical home.”", ok:true, why:"The median resists the few extreme prices." },
          { t:"“The mean is always wrong for money.”", why:"Means of money are fine when the data aren’t skewed." },
          { t:"“The median uses every price, so it’s more accurate.”", why:"That describes the mean, not the median." },
          { t:"“The mode is best, because prices repeat.”", why:"House prices rarely repeat exactly." }] },
        b:{ prompt:"Which is the best explanation for using the mode to decide which shoe size to stock most?", options:[
          { t:"“The store needs the size sold most often, and the mode is exactly that.”", ok:true, why:"The mode is the most frequent value." },
          { t:"“The mean is best, because it uses every sale.”", why:"A mean such as 8.4 isn’t a size you can stock." },
          { t:"“The median is best, because half the sales are above it.”", why:"Half above isn’t ‘most popular’." },
          { t:"“Use the range, because it shows all sizes.”", why:"Range measures spread, not popularity." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which statement correctly describes the mean?", options:[
          { t:"“It’s the balance point: the total distance of values above it equals the total distance below it.”", ok:true, why:"The mean is where the data balance." },
          { t:"“It’s the middle value when the data are sorted.”", why:"That’s the median." },
          { t:"“It’s the most frequent value.”", why:"That’s the mode." },
          { t:"“It’s halfway between the largest and smallest values.”", why:"That’s the midrange." }] },
        b:{ prompt:"A data set’s mean is greater than its median. Which is the best description?", options:[
          { t:"“A few large values (a right tail) pull the mean up; the data are skewed right.”", ok:true, why:"The mean is pulled toward the tail." },
          { t:"“The data are skewed left.”", why:"The mean is pulled toward the tail, which here is on the right." },
          { t:"“The data must be symmetric.”", why:"In symmetric data the mean and median are close." },
          { t:"“The median was calculated wrongly.”", why:"Both can be correct; the gap tells you about the shape." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"A café sold 40 small coffees at $2, 50 medium at $3 and 10 large at $4. What was the mean price per coffee sold?", options:[
          { t:"$2.70", ok:true, why:"(80 + 150 + 40) ÷ 100 = 270 ÷ 100." },
          { t:"$2.30", why:"The large sizes are missing." },
          { t:"$3.00", why:"Average of the three prices. " + M4 },
          { t:"$90.00", why:"Divide by 100 coffees, not 3 sizes." }] },
        b:{ prompt:"A theatre sold 60 student tickets at $10, 30 adult tickets at $15 and 10 senior tickets at $12. What was the mean price per ticket?", options:[
          { t:"$11.70", ok:true, why:"(600 + 450 + 120) ÷ 100." },
          { t:"$10.50", why:"Seniors missing." },
          { t:"$12.33", why:"Average of the three prices. " + M4 },
          { t:"$390.00", why:"Divide by 100 tickets, not 3 ticket types." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"Model data: weekly earnings of 10 store workers: $120, $150, $150, $160, $180, $190, $200, $210, $240, $1200 (the manager). The store advertises ‘average weekly pay: $280’. Which statement is best?", options:[
          { t:"“$280 is the mean, pulled up by the manager’s $1200; the median of $185 better describes a typical worker.”", ok:true, why:"Nine of ten workers earn less than $280." },
          { t:"“The ad is false: the mean is really $185.”", why:"Total 2800 ÷ 10 = 280; $185 is the median." },
          { t:"“The ad is fair, because a mean uses everyone’s pay.”", why:"Nine of ten workers earn less than $280." },
          { t:"“The mode, $150, is the fairest figure.”", why:"Only two workers earn $150; the mode says little here." }] },
        b:{ prompt:"Model data: ages at a family reunion: 2, 4, 5, 6, 7, 8, 9, 10, 40, 70. An organizer says the ‘average age’ is about 16. Which statement is best?", options:[
          { t:"“16.1 is the mean, pulled up by two adults; the median of 7.5 better describes the typical person there.”", ok:true, why:"Eight of the ten people are 10 or younger." },
          { t:"“The average is wrong: it’s 7.5.”", why:"161 ÷ 10 = 16.1 is the mean." },
          { t:"“16 is typical, because the mean uses everyone.”", why:M3 },
          { t:"“There’s no typical age, because there is no mode.”", why:"Median still works without a mode." }] } }
    ]
  },
  task:{
    title:"Five quiz scores", summary:"Five quiz scores",
    statement:"<p>Design five quiz scores (whole numbers out of 10) that meet every condition. Can you find all the answers?</p>" +
      '<ol class="ct-conds"><li>The mean is 6.</li><li>The median is 7.</li><li>The only mode is 8.</li><li>The range is at most 7.</li></ol>',
    checks:["Mean 6", "Median 7", "Only mode 8", "Range at most 7"],
    tips:["Mean 6 with five scores means a total of 30.", "The middle score must be 7.", "For 8 to be the only mode, it must appear at least twice, and no other score may appear as often.", "The highest score is 8 or more, so the lowest must be at least 1."],
    explainPrompt:"Explain how you used totals, the middle position and the mode to build your scores.",
    vocab:"Use the words mean, total, median, mode and range.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"The two 8s and the 7 take 23 of the 30 points, so the two lowest scores add to 7. They must differ (or they’d tie the 8s as a mode) and be at least 1: 1 + 6, 2 + 5 or 3 + 4."
  },
  cards:[
    ["Mean", "Total ÷ count. The balance point of the data."],
    ["Median", "The middle of the <strong>sorted</strong> data; with an even count, the average of the two middle values."],
    ["Mode", "The most frequent <strong>value</strong>. The only centre for categorical data."],
    ["Median position", "(<i>n</i> + 1) ÷ 2 in the sorted list."],
    ["Outlier effect", "It drags the mean; the median barely moves."],
    ["Skewed right", "A long tail of high values: mean > median."],
    ["Weighted mean", "Σ<i>wx</i> ÷ Σ<i>w</i>. Example: 0.25 × 70 + 0.75 × 90 = 85."],
    ["Grouped mean (estimate)", "Σ(<i>f</i> × midpoint) ÷ Σ<i>f</i>."],
    ["Working backwards", "Total = mean × <i>n</i>. Compare totals, not means."],
    ["Combining groups", "Combined mean = (total₁ + total₂) ÷ (<i>n</i>₁ + <i>n</i>₂)."],
    ["Best centre: skewed data", "Median (incomes, house prices, commute times)."],
    ["Best centre: symmetric data", "Mean (it uses every value)."]
  ]
};
