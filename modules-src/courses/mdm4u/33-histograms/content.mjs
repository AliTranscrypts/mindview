// MDM4U 33 Frequency Distributions & Histograms. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/33-histograms.md
// Core feedback sentences for the plan's misconceptions (§3), used where the plan names only the code.
const M1 = (a, b) => "Classes include their <strong>left</strong> endpoint: [" + a + ", " + b + ") starts at " + a + ", so " + a + " belongs there.";
const M2 = "Histograms are for numerical data on a number line, so the bars touch. Categories get a bar graph.";
const M3 = "Skew is named for the long tail. A tail to the right means skewed right.";
const M4 = "Relative frequency = class frequency ÷ <strong>total frequency</strong>.";
const M5 = "Cumulative frequency adds every class up to this one.";
const M6 = "Aim for about 5–12 classes: enough to show the shape without noise.";
const M7 = "Polygon points sit at class <strong>midpoints</strong>, above the middle of each bar.";

// a small histogram tile for the shape sort (bars --pen through app.css)
function mini(f, ctx){
  const mx = Math.max(...f), W = 120, H = 64, bw = W / f.length;
  const bars = f.map((v, i) => '<rect x="' + (i * bw).toFixed(1) + '" y="' + (H - v / mx * (H - 4)).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + (v / mx * (H - 4)).toFixed(1) + '"/>').join("");
  return '<span class="hg-tile"><svg class="hg-mini" viewBox="0 0 120 66" role="img" aria-label="Histogram with frequencies ' + f.join(", ") + '">' + bars + '<line x1="0" y1="64.5" x2="120" y2="64.5"/></svg>' +
    '<span class="hg-tl">' + f.join(", ") + '<span class="hg-ctx">' + ctx + "</span></span></span>";
}
const SORT = [
  [[1, 3, 8, 3, 1], "adult heights", "sym"],
  [[10, 6, 3, 2, 1], "time spent waiting for a bus", "right"],
  [[1, 1, 3, 6, 9], "marks on an easy quiz", "left"],
  [[4, 4, 4, 4, 4], "rolls of a fair die, grouped", "uni"],
  [[2, 8, 2, 8, 2], "sleep times of two age groups combined", "bi"],
  [[2, 6, 10, 6, 2], "lengths of a machine-cut part", "sym"],
  [[12, 9, 5, 3, 1], "household incomes", "right"],
  [[1, 2, 2, 5, 10], "ages at retirement from a sports league", "left"],
  [[3, 3, 3, 3, 3], "birth months, grouped", "uni"],
  [[1, 7, 2, 7, 1], "two-peaked commute times", "bi"]
];
const SORT_WHY = {
  sym:"The bars mirror each other around one central peak.",
  right:"Most values are low; the short bars trail off to the right, so the tail is on the right.",
  left:"Most values are high; the short bars trail off to the left, so the tail is on the left.",
  uni:"Every class has the same frequency.",
  bi:"Two separate peaks: bimodal is the more informative name."
};

export default {
  id:"33-histograms",
  kind:"topic",
  title:"Frequency distributions and histograms",
  topic:"Frequency Distributions & Histograms",
  readyTopic:"frequency distributions and histograms",
  hero:{
    headline:"Group it, then see its shape",
    text:"Thirty numbers in a list tell you very little. Sort them into <strong>classes</strong>, count each class’s <strong>frequency</strong>, and draw a <strong>histogram</strong>: suddenly you can see where the data pile up, how they spread, and whether they lean to one side.",
    fig:{ html:'<div class="hg-hero" id="hg-hero"></div>' }
  },
  goals:[
    "I can build a frequency table with equal-width, left-inclusive classes, including relative and cumulative frequencies.",
    "I can draw and read a histogram and a frequency polygon.",
    "I can describe a distribution’s shape (symmetric, skewed left or right, uniform, bimodal) from a histogram.",
    "I can use cumulative frequency to find the median class and answer “how many” and “what percent” questions.",
    "I can choose a sensible class width and the right graph for a given type of data."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Types of data", goal:5, prompt:"Which variable is categorical?",
          options:[
            { t:"Favourite season", ok:true, why:"Its values are names, not numbers." },
            { t:"Height in cm", why:"That’s quantitative and continuous." },
            { t:"Number of siblings", why:"That’s quantitative and discrete." },
            { t:"Time to run 100 m", why:"That’s quantitative and continuous." }],
          hints:["Can you do arithmetic with the values?", "Seasons are labels.", "Favourite season."] },
        { id:"w2", skill:"Types of data", goal:5, prompt:"Which variable is continuous?",
          options:[
            { t:"Mass of an apple", ok:true, why:"It can take any value in a range." },
            { t:"Number of goals", why:"Counts are discrete." },
            { t:"Shoe brand", why:"That’s categorical." },
            { t:"Jersey number", why:"A label, even though it uses digits." }],
          hints:["Is it measured or counted?", "Measured quantities are continuous.", "Mass."] },
        { id:"w3", skill:"Fractions and percents", goal:1, prompt:"What is 9 out of 30 as a decimal?",
          options:[
            { t:"0.3", ok:true, why:"9 ÷ 30 = 3 ÷ 10." },
            { t:"0.09", why:"Divide by the total, 30." },
            { t:"3.33", why:"30 ÷ 9 is upside down." },
            { t:"0.9", why:"9 ÷ 10, not 9 ÷ 30." }],
          hints:["Part ÷ whole.", "9 ÷ 30.", "0.3."] },
        { id:"w4", skill:"Fractions and percents", goal:4, prompt:"In a class of 25, 8 walk to school. What percent is that?",
          options:[
            { t:"32%", ok:true, why:"8 ÷ 25 = 0.32." },
            { t:"8%", why:"8 is the count, not the percent." },
            { t:"17%", why:"Divide, don’t subtract." },
            { t:"3.125%", why:"25 ÷ 8 is upside down." }],
          hints:["Part ÷ whole × 100.", "8 ÷ 25 = 32 ÷ 100.", "32%."] },
        { id:"w5", skill:"Reading intervals", goal:1, prompt:"Which numbers belong to the interval [10, 20)?",
          options:[
            { t:"10 and 19.9, but not 20", ok:true, why:"The square bracket includes 10; the round one excludes 20." },
            { t:"10 and 20", why:"The round bracket excludes 20." },
            { t:"11 to 19 only", why:"10 is included, and so are decimals such as 19.9." },
            { t:"20 but not 10", why:"That’s backwards." }],
          hints:["[ means included; ) means excluded.", "10 is in; 20 is out.", "10 up to, but not including, 20."] },
        { id:"w6", skill:"Reading intervals", goal:2, prompt:"What is the midpoint of the class [40, 50)?",
          options:[
            { t:"45", ok:true, why:"(40 + 50) ÷ 2." },
            { t:"40", why:"That’s the left endpoint." },
            { t:"50", why:"That’s the right endpoint." },
            { t:"10", why:"That’s the class width." }],
          hints:["Halfway between the endpoints.", "(40 + 50) ÷ 2.", "45."] }
      ],
      refreshers:{
        "Types of data":"Categorical data are labels; quantitative data are numbers. Counted numbers are discrete, and measured numbers are continuous.",
        "Fractions and percents":"Part ÷ whole gives a decimal; × 100 gives a percent.",
        "Reading intervals":"[<i>a</i>, <i>b</i>) includes <i>a</i> and excludes <i>b</i>. The class width is <i>b</i> − <i>a</i> and the midpoint is (<i>a</i> + <i>b</i>) ÷ 2."
      }
    }
  },
  explore:{
    heading:"Histogram studio",
    intro:"Choose a class width and a starting value; watch the table and the histogram rebuild. Then switch the vertical scale and test some famous shapes.",
    predictions:[
      { id:"p1", start:{ mode:"studio", st:20, w:10, sc:"freq" },
        prompt:"Switch the width to 20. What happens?",
        options:[{ t:"Only 3 bars; the shape becomes cruder and the details disappear", ok:true }, { t:"More bars and more detail" }, { t:"The same 5 bars, but taller" }, { t:"The data change" }],
        explain:"The bars merge into 10, 16, 4. Wider classes mean fewer, taller bars. Too few classes hide the shape." },
      { id:"p2", start:{ mode:"studio", st:20, w:10, sc:"freq" },
        prompt:"Add a new value of exactly 50. Which bar grows?",
        options:[{ t:"[50, 60)", ok:true }, { t:"[40, 50)" }, { t:"Both" }, { t:"Neither" }],
        explain:"The 50 chip drops into [50, 60), which goes from 6 to 7. [50, 60) includes its left endpoint, 50." },
      { id:"p3", start:{ mode:"studio", st:20, w:10, sc:"freq" },
        prompt:"Switch the vertical scale from Frequency to Relative frequency. What changes?",
        options:[{ t:"Only the numbers on the vertical axis", ok:true }, { t:"The shape flattens" }, { t:"The bars get wider" }, { t:"The tallest bar moves" }],
        explain:"The axis relabels from 0–10 to 0–0.33; the bars don’t move. Dividing every frequency by 30 rescales the axis but keeps the shape." },
      { id:"p4", start:{ mode:"gallery", card:"inc" },
        prompt:"Shape gallery, card “household incomes” (9, 7, 4, 2, 1). Which shape is this?",
        options:[{ t:"Skewed right", ok:true }, { t:"Skewed left" }, { t:"Symmetric" }, { t:"Uniform" }],
        explain:"A tail arrow points right along the short bars. Most incomes are low, with a long tail of high ones. Skew is named for the tail." }
    ],
    chalIntro:"Use the studio to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 5], prompt:"Choose a width and a start so there are exactly 5 classes and every value is counted.",
        why:"Width 10 from 20 gives [20, 30) … [60, 70): 5 classes holding all 30 values. It is the only combination that works.",
        hints:["The data run from 22 to 68, a span of about 50.", "Five classes of width 10 cover 50.", "Start at 20 so the first class is [20, 30)."] },
      { id:"tc2", goal:4, prompt:"Cumulative view (start 20, width 10). Tap the bar that holds the median.",
        why:"The cumulative totals are 3, 10, 20, …: the 15th and 16th values arrive in [40, 50), so it is the median class.",
        hints:["With 30 values, the median sits between the 15th and 16th.", "Cumulative: 3, 10, 20, …", "The 15th and 16th fall in [40, 50)."] },
      { id:"tc3", goal:[1, 3], stretch:true, prompt:"Add exactly 4 new values (from 20 to 69) so the width-10 histogram becomes <strong>symmetric</strong>: the first and last bars equal, and the second and fourth bars equal.",
        why:"Symmetric! There are exactly three ways: 4, 7, 12, 7, 4; 5, 7, 10, 7, 5; or 4, 8, 10, 8, 4.",
        hints:["<i>f</i>₁ is 1 behind <i>f</i>₅, and <i>f</i>₄ is 1 behind <i>f</i>₂.", "Fixing both uses 2 of your 4 values: one in [20, 30) and one in [50, 60).", "Spend the last 2 symmetrically: both in [40, 50), one at each end, or one in each of the 2nd and 4th classes."] }
    ]
  },
  part3:{
    slug:"right-graph", name:"Right graph",
    heading:"The right graph",
    intro:"Different data need different graphs. Match each data set to its graph, diagnose some broken graphs, and check a circle graph’s angles.",
    graphs:[{ id:"bar", t:"Bar graph" }, { id:"circle", t:"Circle graph" }, { id:"hist", t:"Histogram" }, { id:"stem", t:"Stem-and-leaf plot" }, { id:"box", t:"Side-by-side box plots" }],
    cards:[
      { id:"c1", goal:5, t:"Favourite streaming service of 40 students", kind:"cat", answer:["bar", "circle"],
        why:"Services are categories: a bar graph or a circle graph shows them.",
        wrong:{ hist:"Services are categories with no number line. " + M2, stem:"Stem-and-leaf plots need numbers; services are names.", box:"Categories have no quartiles." } },
      { id:"c2", goal:5, t:"Heights of 100 students (cm)", kind:"cont", answer:"hist",
        why:"Height is continuous: group it into classes and draw a histogram.",
        wrong:{ bar:"Nearly every height differs: about a hundred one-value bars. Group heights into classes.", circle:"Too many slices; height is numerical.", stem:"With 100 values the leaves pile up into long rows; grouping into classes shows the shape better.", box:"One box plot hides the shape of a single group; a histogram shows it." } },
      { id:"c3", goal:5, t:"Number of pets per household (0 to 4)", kind:"disc", answer:"bar",
        why:"Discrete data with only a few values: one bar per value.",
        wrong:{ hist:"With only the values 0 to 4, each value gets its own bar: there are no classes to group.", circle:"A circle graph shows parts of a whole, but it hides the order 0, 1, 2, 3, 4. Bars keep it.", stem:"With values 0 to 4, every stem would be 0.", box:"Five possible values: a box plot hides how many households have each." } },
      { id:"c4", goal:5, t:"20 test marks", kind:"small", answer:"stem",
        why:"A small numerical set: a stem-and-leaf plot shows the shape and keeps every mark.",
        wrong:{ hist:"A histogram works, but with only 20 marks a stem-and-leaf plot shows the shape <em>and</em> keeps every mark.", bar:"Marks are numerical; one bar per mark is noisy.", circle:"Marks aren’t parts of a whole.", box:"One set of 20 marks: a stem-and-leaf plot keeps every value." } },
      { id:"c5", goal:5, t:"Comparing two classes’ marks", kind:"two", answer:"box",
        why:"Side-by-side box plots line up the two medians and spreads on one scale.",
        wrong:{ hist:"Two histograms could work, but side-by-side box plots compare medians and spreads on one scale.", bar:"This compares two groups of numbers: side-by-side box plots line up their medians and quartiles.", circle:"Circle graphs show parts of a whole, not two sets of marks.", stem:"One stem-and-leaf plot shows one set; this compares two." } }
    ],
    problems:[{ id:"cat", t:"Categories drawn as a histogram" }, { id:"uneq", t:"Unequal class widths drawn as if equal" }, { id:"many", t:"Too many one-value bars: group into classes" }, { id:"order", t:"The bars should be sorted tallest to shortest" }],
    broken:[
      { id:"g1", goal:[2, 5], title:"Histogram of favourite colours", answer:"cat",
        why:"Colours are categories, so this is a bar graph: the gaps are right, the label “histogram” is wrong. " + M2,
        wrong:{ uneq:"The bars are all the same width, and colours have no class widths.", many:"There are only 5 bars.", order:"Order is a choice for categories; the real problem is the graph type." } },
      { id:"g2", goal:[1, 2], title:"Histogram of commute times (min)", answer:"uneq",
        why:"The classes [0, 10), [10, 20), [20, 40) and [40, 80) have widths 10, 10, 20 and 40, but the bars are drawn the same width, which distorts the shape.",
        wrong:{ cat:"Commute times are numerical, so a histogram is the right graph type.", many:"There are only 4 bars.", order:"Histogram bars follow the number line; never sort them." } },
      { id:"g3", goal:[2, 5], title:"Bar graph of 70 heights (cm)", answer:"many",
        why:"Seventy one-value bars hide the shape. " + M6,
        wrong:{ cat:"Heights are numbers, not categories.", uneq:"Every bar is one value wide: the problem is how many there are.", order:"Sorting won’t help: the values need grouping." } }
    ],
    circle:{ title:"Ways students get to school", unit:"model data",
      rows:[{ id:"a1", t:"Walk", rf:0.35, answer:126 }, { id:"a2", t:"Bus", rf:0.25, answer:90 }, { id:"a3", t:"Car", rf:0.2, answer:72 }, { id:"a4", t:"Bike", rf:0.2, answer:72 }],
      goal:[1, 5] },
    quickCheck:{
      title:"Right graph quick check", summary:"Right graph quick check",
      items:[
        { id:"q1", goal:5, prompt:"Best graph for the mass of 200 apples?",
          choices:[
            { t:"Histogram", ok:true, fb:"Right. Mass is continuous: group it into classes." },
            { t:"Bar graph", fb:"Mass is continuous: group it into classes." },
            { t:"Circle graph", fb:"Mass is continuous: group it into classes." },
            { t:"Scatter plot", fb:"Mass is continuous: group it into classes." }] },
        { id:"q2", goal:5, prompt:"Best graph for students’ favourite subject?",
          choices:[
            { t:"Bar graph", ok:true, fb:"Right. Subjects are categories." },
            { t:"Histogram", fb:"Subjects are categories. " + M2 },
            { t:"Box plot", fb:"Subjects are categories." },
            { t:"Frequency polygon", fb:"Subjects are categories." }] },
        { id:"q3", goal:2, prompt:"Why do histogram bars touch?",
          choices:[
            { t:"The classes cover the number line without gaps", ok:true, fb:"Right. Each class starts where the last one ends." },
            { t:"To save space", fb:"Each class starts where the last one ends." },
            { t:"The frequencies are equal", fb:"Each class starts where the last one ends." },
            { t:"Habit", fb:"Each class starts where the last one ends." }] },
        { id:"q4", goal:1, prompt:"A circle graph shows 25% for one category. What angle?",
          choices:[
            { t:"90°", ok:true, fb:"Right. 0.25 × 360° = 90°." },
            { t:"25°", fb:"0.25 × 360°." },
            { t:"45°", fb:"0.25 × 360°." },
            { t:"100°", fb:"0.25 × 360°." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"shapes", type:"sorter", title:"Shape sort", summary:"Shape sort", goal:3, noun:"histogram", txt:true,
        instruction:"Tap a histogram, then tap the box for its shape.",
        boxes:[{ id:"sym", label:"Symmetric" }, { id:"right", label:"Skewed right" }, { id:"left", label:"Skewed left" }, { id:"uni", label:"Uniform" }, { id:"bi", label:"Bimodal" }],
        items:SORT.map(([f, ctx, box], i) => {
          const it = { id:"s" + (i + 1), goal:3, t:mini(f, ctx), answer:box, why:SORT_WHY[box], wrong:{} };
          if (box === "left") it.wrong.right = "The tallest bars are on the right, but the tail of short bars is on the <strong>left</strong>.";
          if (box === "right") it.wrong.left = "The tail is on the right.";
          if (box === "bi") it.wrong.sym = "These are symmetric too, but two separate peaks make them bimodal; the more informative name wins.";
          if (i === 7) it.hints = ["Where are the short bars?", "On the left.", "The tail is on the left, so skewed left."];
          return it;
        }),
        wrongDefault:"Look for the long tail, then for the peaks." },
      { id:"table", type:"numeric", title:"Build the table", summary:"Build the table", goal:[1, 4, 5], star:true,
        instruction:'<span class="mdm-model">model data</span> Commute times in minutes for 20 students: 4, 7, 9, 10, 12, 12, 14, 15, 15, 16, 18, 19, 20, 20, 22, 25, 28, 30, 35, 41. Classes of width 10 from 0. Items marked ★ are non-routine; the last two go beyond the Final Check.',
        how:"Type a number, then press Check.",
        items:[
          { id:"b1", goal:1, prompt:"Frequency of [10, 20)", answer:9, display:"9",
            why:"10, 12, 12, 14, 15, 15, 16, 18, 19: nine values. 20 starts the next class.",
            wrong:[{ match:11, fb:"20 belongs to [20, 30)." }] },
          { id:"b2", goal:1, prompt:"Relative frequency of [20, 30)", answer:0.25, display:"0.25", keypad:"text",
            why:"20, 20, 22, 25, 28: 5 of 20 values, and 5 ÷ 20 = 0.25.",
            wrong:[{ match:1, fb:"Divide by the 20 values, not the 5 classes." }, { match:5, fb:"That’s the frequency." }] },
          { id:"b3", goal:4, star:true, prompt:"How many students commute <strong>less than</strong> 30 minutes?", answer:17, display:"17",
            why:"The cumulative frequency at the end of [20, 30): 3 + 9 + 5 = 17.",
            wrong:[{ match:5, fb:"That’s just [20, 30). Add the classes below it." }] },
          { id:"b4", goal:4, star:true, prompt:"What percent commute <strong>at least</strong> 20 minutes?", answer:40, unit:"%", display:"40%",
            why:"[20, 30), [30, 40) and [40, 50) hold 5 + 2 + 1 = 8 of 20, and 8 ÷ 20 = 40%.",
            wrong:[{ match:25, fb:"Include [30, 40) and [40, 50): 5 + 2 + 1 = 8 of 20." }],
            hints:["‘At least 20’ starts at 20.", "Count [20, 30), [30, 40) and [40, 50).", "8 ÷ 20 = 40%."] },
          { id:"b5", goal:5, star:true, prompt:"With width 5 starting at 0, enter the left endpoint of the modal class.", answer:15, display:"15",
            why:"[15, 20) holds 15, 15, 16, 18, 19: five values, more than any other class.",
            wrong:[{ match:10, fb:"[10, 15) has 4 values; [15, 20) has 5: 15, 15, 16, 18, 19." }] },
          { id:"b6", goal:1, star:true, prompt:"Five classes have relative frequencies 0.10, 0.25, 0.30, 0.20 and one missing value. The third class has 12 values. How many values are in the last class?", answer:6, display:"6",
            why:"The missing relative frequency is 1 − 0.85 = 0.15. The total is 12 ÷ 0.30 = 40, so the last class holds 0.15 × 40 = 6.",
            wrong:[{ match:0.15, fb:"That’s the relative frequency. The total is 12 ÷ 0.30 = 40, and 0.15 × 40 = 6." }],
            hints:["The relative frequencies total 1.", "The missing one is 0.15, and 12 values make up 30% of the total.", "The total is 40, so 0.15 × 40 = 6."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Imogen", goal:[1, 3],
        instruction:"Imogen made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Sort 18, 20, 25, 30, 33 into the classes [10, 20), [20, 30) and [30, 40).",
            steps:["18 goes in [10, 20).", "20 goes in [10, 20).", "25 goes in [20, 30).", "30 and 33 go in [30, 40), so the frequencies are 2, 1, 2."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 is correct.", "Step 4 uses step 2. The mistake is earlier."],
            fixes:[
              { t:"20 goes in [20, 30), which includes its left endpoint, so the frequencies are 1, 2, 2.", ok:true, why:M1(20, 30) },
              { t:"20 goes in both classes.", why:"Each value is counted once." },
              { t:"Leave 20 out.", why:"Every value must be counted." },
              { t:"Step 2 is correct.", why:"[10, 20) excludes 20." }],
            hints:["Which bracket does [10, 20) end with?", "A round bracket: 20 is excluded.", "20 starts [20, 30)."] },
          { id:"e2", goal:1, task:"Frequencies are 4, 6 and 10. Find the relative frequency of the first class.",
            steps:["The total frequency is 4 + 6 + 10 = 20.", "Relative frequency = 4 ÷ 3 classes ≈ 1.33.", "So the first class holds 133% of the data."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows from step 2; 133% is impossible, which is a clue."],
            fixes:[
              { t:"Relative frequency = 4 ÷ 20 = 0.20.", ok:true, why:M4 },
              { t:"4 ÷ 100 = 0.04.", why:"Divide by the total frequency." },
              { t:"20 ÷ 4 = 5.", why:"That’s upside down." },
              { t:"Step 2 is correct.", why:"Relative frequencies can’t exceed 1." }],
            hints:["Relative to what?", "To the total, 20.", "0.20."] },
          { id:"e3", goal:3, task:"Describe the shape of a histogram with frequencies 1, 2, 3, 6, 12.",
            steps:["The tallest bar is on the right.", "The short bars trail off to the left.", "So the data are skewed right.", "The mean is greater than the median."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3’s wrong shape."],
            fixes:[
              { t:"The tail is on the left, so the data are skewed left, and the mean is less than the median.", ok:true, why:M3.replace("A tail to the right means skewed right.", "A tail to the left means skewed left.") },
              { t:"Symmetric.", why:"The bars aren’t mirrored." },
              { t:"Uniform.", why:"The bars aren’t equal." },
              { t:"Step 3 is correct.", why:"Skew is named for the tail." }],
            hints:["Where is the long tail?", "On the left.", "Skewed left."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the studio: how much the picture changed with the class width?" },
      { id:"j2", q:"In your own words, why is skew named for the tail rather than the peak?" },
      { id:"j3", q:"Explain to a friend how to use a cumulative column to find the median class." },
      { id:"j4", q:"Which part of building a frequency table still slows you down? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"The classes are [10, 20), [20, 30) and [30, 40). Which class contains the value 30?", options:[
          { t:"[30, 40)", ok:true, why:"Left endpoints are included." },
          { t:"[10, 20)", why:"30 is outside it." },
          { t:"[20, 30)", why:M1(30, 40) },
          { t:"Both [20, 30) and [30, 40)", why:"Each value goes in exactly one class." }] },
        b:{ prompt:"The classes are [40, 50) and [50, 60). Which class contains the value 50?", options:[
          { t:"[50, 60)", ok:true, why:"Left endpoints are included." },
          { t:"[40, 50)", why:M1(50, 60) },
          { t:"Both", why:"Exactly one class." },
          { t:"Neither", why:"50 is the left endpoint of [50, 60)." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"A class has frequency 6 in a data set of 40 values. What is its relative frequency?", options:[
          { t:"0.15", ok:true, why:"6 ÷ 40." },
          { t:"0.06", why:"Divide by 40, not 100." },
          { t:"1.2", why:"Divide by the total, not the 5 classes." },
          { t:"6", why:"That’s the frequency." }] },
        b:{ prompt:"A class has frequency 12 in a data set of 60 values. What is its relative frequency?", options:[
          { t:"0.2", ok:true, why:"12 ÷ 60." },
          { t:"0.12", why:"Divide by 60, not 100. " + M4 },
          { t:"2.4", why:"Divide by the total, not the 5 classes. " + M4 },
          { t:"12", why:"That’s the frequency." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"A histogram has frequencies 1, 2, 4, 8, 12 from left to right. What is its shape?", options:[
          { t:"Skewed left", ok:true, why:"The tail of short bars is on the left." },
          { t:"Skewed right", why:"The tallest bar is on the right, but the tail of short bars is on the left. " + M3 },
          { t:"Symmetric", why:"The bars aren’t mirrored." },
          { t:"Uniform", why:"The bars aren’t equal." }] },
        b:{ prompt:"A histogram has frequencies 12, 8, 4, 2, 1 from left to right. What is its shape?", options:[
          { t:"Skewed right", ok:true, why:"The tail of short bars is on the right." },
          { t:"Skewed left", why:"The tallest bar is on the left, but the tail of short bars is on the right. " + M3 },
          { t:"Symmetric", why:"The bars aren’t mirrored." },
          { t:"Bimodal", why:"There is one peak." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"The classes [0, 10), [10, 20), [20, 30), [30, 40) and [40, 50) have frequencies 9, 8, 3, 6, 4. Which class contains the median?", options:[
          { t:"[10, 20)", ok:true, why:"30 values: the 15th and 16th; the cumulative totals are 9, then 17." },
          { t:"[0, 10)", why:"That’s the modal class." },
          { t:"[20, 30)", why:"That’s the middle class, not the middle value." },
          { t:"[30, 40)", why:M5 + " The totals 9, 17 already pass the 15th and 16th values." }] },
        b:{ prompt:"The classes [0, 5), [5, 10), [10, 15), [15, 20) and [20, 25) have frequencies 8, 6, 2, 4, 5. Which class contains the median?", options:[
          { t:"[5, 10)", ok:true, why:"25 values: the 13th; the cumulative totals are 8, then 14." },
          { t:"[0, 5)", why:"Modal class." },
          { t:"[10, 15)", why:"The middle class." },
          { t:"[15, 20)", why:M5 + " The totals 8, 14 already pass the 13th value." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"The classes [20, 30) to [60, 70) have frequencies 3, 7, 10, 6, 4. How many values are less than 50?", options:[
          { t:"20", ok:true, why:"3 + 7 + 10." },
          { t:"10", why:"That’s just [40, 50). " + M5 },
          { t:"26", why:"That adds [50, 60) too." },
          { t:"30", why:"That’s everything." }] },
        b:{ prompt:"The classes [20, 30) to [60, 70) have frequencies 3, 7, 10, 6, 4. What percent of the values are at least 50?", options:[
          { t:"33.3%", ok:true, why:"(6 + 4) ÷ 30." },
          { t:"13.3%", why:"Only [60, 70)." },
          { t:"20%", why:"Only [50, 60)." },
          { t:"66.7%", why:"That’s the percent below 50." }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"The class [40, 50) has frequency 10. Which point represents it on a frequency polygon?", options:[
          { t:"(45, 10)", ok:true, why:"Midpoint and frequency." },
          { t:"(40, 10)", why:M7 },
          { t:"(50, 10)", why:M7 },
          { t:"(45, 0.33)", why:"That’s a relative-frequency point on a frequency polygon." }] },
        b:{ prompt:"The class [15, 20) has frequency 6. Which point represents it?", options:[
          { t:"(17.5, 6)", ok:true, why:"Midpoint and frequency." },
          { t:"(15, 6)", why:M7 },
          { t:"(20, 6)", why:M7 },
          { t:"(17.5, 0.2)", why:"That’s a relative-frequency point on a frequency polygon." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Thirty students name their favourite sport. Which graph and reason are best?", options:[
          { t:"“A bar graph, because sport is categorical: each bar is a separate category.”", ok:true, why:"Categories get a bar graph, with gaps between the bars." },
          { t:"“A histogram, because the data have frequencies.”", why:"Every summary has frequencies; histograms need a number line." },
          { t:"“A box plot, because it shows the spread.”", why:"Categories have no quartiles." },
          { t:"“A scatter plot, because each student is a point.”", why:"Scatter plots need two numerical variables." }] },
        b:{ prompt:"The heights of 100 Grade 12 students are measured. Which graph and reason are best?", options:[
          { t:"“A histogram, because height is continuous and must be grouped into classes.”", ok:true, why:"Continuous data are grouped into classes on a number line." },
          { t:"“A bar graph with one bar per height.”", why:"Nearly every height differs: a hundred one-value bars." },
          { t:"“A circle graph, because it shows parts of the whole.”", why:"Too many slices; height is numerical." },
          { t:"“A scatter plot.”", why:"Only one variable is measured." }] } },
      { id:"c2", cat:"C", goal:[2, 3],
        a:{ prompt:"Why do the bars of a histogram touch, unlike a bar graph’s?", options:[
          { t:"“The variable is numerical, and the classes cover the number line without gaps.”", ok:true, why:"Each class starts where the last one ends." },
          { t:"“To save space on the page.”", why:"It isn’t about space." },
          { t:"“Because all the classes have equal frequencies.”", why:"They rarely do." },
          { t:"“Because the data are categorical.”", why:"That’s when bars <strong>don’t</strong> touch." }] },
        b:{ prompt:"Which describes a distribution skewed right?", options:[
          { t:"“Most values are low, with a long tail of high values; the mean is pulled above the median.”", ok:true, why:M3 },
          { t:"“Most values are high, with a tail of low values.”", why:"That’s skewed left. " + M3 },
          { t:"“The tallest bar is on the right.”", why:"That names the peak, not the tail. " + M3 },
          { t:"“The values are spread evenly.”", why:"That’s uniform." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:'<span class="mdm-model">model data</span> Clinic wait times (min) have the classes [0, 10), [10, 20), [20, 30) and [30, 40) with frequencies 12, 8, 4, 1. The clinic claims “most patients wait less than 20 minutes.” Is the claim supported?', options:[
          { t:"“Yes: 20 of 25 (80%) waited under 20 minutes.”", ok:true, why:"12 + 8 = 20 of 25 values are below 20." },
          { t:"“No: only 12 of 25 (48%) did.”", why:"Include [10, 20). " + M5 },
          { t:"“No: 8 of 25 is under a third.”", why:"That’s one class only." },
          { t:"“We can’t tell from a histogram.”", why:"The table gives exact counts." }] },
        b:{ prompt:'<span class="mdm-model">model data</span> Battery life (h) has the classes [4, 6), [6, 8), [8, 10) and [10, 12) with frequencies 2, 5, 10, 3. The claim is that “at least 60% last 8 hours or more.” Is it supported?', options:[
          { t:"“Yes: 13 of 20 (65%) last 8 hours or more.”", ok:true, why:"10 + 3 = 13 of 20 values are 8 or more." },
          { t:"“No: only 10 of 20 (50%) do.”", why:"Include [10, 12) too. " + M5 },
          { t:"“No: 3 of 20 is only 15%.”", why:"That’s [10, 12) only." },
          { t:"“Yes: 17 of 20 do.”", why:"That includes [6, 8), which is under 8 hours." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"Forty values range from 12 to 87. Which class setup is most sensible?", options:[
          { t:"Width 10, starting at 10: 8 classes", ok:true, why:"It covers 12–87 with a readable number of classes." },
          { t:"Width 1, starting at 12: 76 classes", why:M6 },
          { t:"Width 50, starting at 0: 2 classes", why:M6 },
          { t:"Width 10, starting at 20", why:"12 would fall outside the first class." }] },
        b:{ prompt:"Fifty reaction times range from 152 ms to 391 ms. Which class setup is most sensible?", options:[
          { t:"Width 25, starting at 150: 10 classes", ok:true, why:"It covers 152–391 with a readable number of classes." },
          { t:"Width 5, starting at 150: 49 classes", why:M6 },
          { t:"Width 200, starting at 100: 2 classes", why:M6 },
          { t:"Width 25, starting at 175", why:"152 would be left out." }] } }
    ]
  },
  task:{
    title:"Left-leaning histogram", summary:"Left-leaning histogram",
    statement:"<p>Design a frequency table for 20 values in the classes [0, 10), [10, 20), [20, 30), [30, 40), [40, 50) that meets every condition. Can you find all the answers?</p>" +
      "<ol><li>There are exactly 20 values.</li><li>Every class has at least one value.</li><li>The bars rise steadily to a single peak at [30, 40), then drop.</li><li>The median lies in [30, 40).</li><li>The class [40, 50) holds exactly 10% of the values.</li></ol>",
    checks:["20 values", "No empty class", "Rises to one peak at [30, 40)", "Median in [30, 40)", "[40, 50) holds 10%"],
    tips:["The frequencies must total 20.", "Every class needs at least one value.", "Each bar up to [30, 40) must be taller than the one before.", "The first three classes together can hold at most 9 values.", "10% of 20 is 2."],
    explainPrompt:"Explain how you used the cumulative totals to keep the median in [30, 40), and why the shape counts as skewed left.",
    vocab:"Use the words frequency, relative frequency, cumulative frequency, median class and tail.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"<i>f</i>₅ = 2 leaves 18 for the first four classes, with the first three holding at most 9, so <i>f</i>₄ is 9 or 10. Allowing an empty first class would add seven more tables.",
    afterAt:5
  },
  cards:[
    ["Class [40, 50)", "Includes 40, excludes 50. Width 10, midpoint 45."],
    ["Frequency", "How many values fall in a class."],
    ["Relative frequency", "Frequency ÷ total. They add to 1."],
    ["Cumulative frequency", "A running total: every class up to and including this one."],
    ["Median class", "The class holding the middle value(s); find it with the cumulative column."],
    ["Histogram", "Touching bars over a number line, for numerical data."],
    ["Frequency polygon", "Points at (midpoint, frequency), joined by segments."],
    ["Skewed right", "A long tail of high values; mean > median."],
    ["Skewed left", "A long tail of low values; mean < median."],
    ["Choosing a width", "Aim for about 5–12 classes that cover the data."],
    ["Bar graph vs histogram", "Bar graph: categories, with gaps. Histogram: numbers, with no gaps."]
  ]
};
