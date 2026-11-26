// MDM4U 34 Scatter Plots & Correlation. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/34-scatter-plots.md
// Core feedback sentences for the plan's misconceptions (§3), used where the plan names only the code.
const M1 = "Ask which variable responds to the other. The response goes on the <i>y</i>-axis.";
const M2 = "Strength is how closely the points hug the pattern, not how steep it is.";
const M3 = "A tight curve is a strong relationship; it just isn’t linear.";
const M4 = "Negative describes direction. It can be just as strong as positive.";
const M5 = "One point far from the pattern can weaken (or fake) a correlation. Name it.";
const M6 = "A scatter plot shows that two variables move together, not why.";
const M7 = "Each point is a separate individual. The order of the points means nothing.";
// a "Set up" button inside a challenge prompt (app.js listens for data-sp-setup)
const setup = (id, t) => ' <button type="button" class="btn ghost sm sp-setup" data-sp-setup="' + id + '">' + t + "</button>";

export default {
  id:"34-scatter-plots",
  kind:"topic",
  title:"Scatter plots and correlation",
  topic:"Scatter Plots & Correlation",
  readyTopic:"scatter plots",
  hero:{
    eq:"direction · form · strength · outliers",
    eqLabel:"Direction, form, strength and outliers.",
    eqSize:"sm",
    headline:"Do two things move together?",
    text:"Measure two things about each person and plot every pair as a point. The cloud of points shows the <strong>direction</strong>, the <strong>form</strong> and the <strong>strength</strong> of the relationship, and any <strong>outliers</strong> that don’t fit.",
    fig:{ aria:"A table of eight pairs of hours studied and test marks slides in. Each row flies to its point on a scatter plot, and eight blue dots rise from left to right. A strength m&#101;ter’s needle swings to strong, and a caption reads positive, linear, strong.", shape:"wide" }
  },
  goals:[
    "I can identify the independent and dependent variables and put each on the correct axis.",
    "I can describe the direction of a scatter plot.",
    "I can describe the form and strength of a scatter plot (linear or nonlinear; strong, moderate or weak).",
    "I can identify outliers in two-variable data and describe their effect on the pattern.",
    "I can match scatter plots to real contexts and describe the relationship in words without claiming cause."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Plotting points", goal:1, prompt:"Which point is 3 units right of the origin and 5 units up?",
          options:[
            { t:"(3, 5)", ok:true, why:"<i>x</i> first, then <i>y</i>." },
            { t:"(5, 3)", why:"That swaps the order. The first coordinate is horizontal." },
            { t:"(−3, 5)", why:"Check the sign: right is positive." },
            { t:"(3, −5)", why:"Check the sign: up is positive." }],
          hints:["Ordered pairs are (<i>x</i>, <i>y</i>).", "Right 3 is <i>x</i> = 3.", "(3, 5)."] },
        { id:"w2", skill:"Plotting points", goal:1, prompt:"A student studied 2 h and scored 64%. As a point (hours, mark), it is…",
          options:[
            { t:"(2, 64)", ok:true, why:"Hours on <i>x</i>, mark on <i>y</i>." },
            { t:"(64, 2)", why:"That reverses the pair. The order matches (hours, mark)." },
            { t:"(2, 0.64)", why:"Use the units given: percent." },
            { t:"(64, 64)", why:"Each coordinate is a different variable." }],
          hints:["The order matches (hours, mark).", "<i>x</i> = 2.", "(2, 64)."] },
        { id:"w3", skill:"Sign of a slope", goal:2, prompt:"A line falls from left to right. Its slope is…",
          options:[
            { t:"negative", ok:true, why:"<i>y</i> decreases as <i>x</i> increases." },
            { t:"positive", why:"That’s a line that rises." },
            { t:"zero", why:"That’s a horizontal line." },
            { t:"undefined", why:"That’s a vertical line." }],
          hints:["Read left to right.", "Going down means <i>y</i> decreases.", "Negative."] },
        { id:"w4", skill:"Sign of a slope", goal:2, prompt:"Which pair of points gives a positive slope?",
          options:[
            { t:"(1, 2) and (4, 8)", ok:true, why:"Both coordinates increase." },
            { t:"(1, 8) and (4, 2)", why:"<i>y</i> decreases." },
            { t:"(1, 5) and (4, 5)", why:"That’s a horizontal line." },
            { t:"(2, 1) and (2, 6)", why:"That’s a vertical line." }],
          hints:["Slope = rise ÷ run.", "Look for <i>y</i> increasing as <i>x</i> increases.", "(1, 2) and (4, 8)."] },
        { id:"w5", skill:"Variables in context", goal:1, prompt:"In “the amount of fertilizer and the height of tomato plants”, which variable responds to the other?",
          options:[
            { t:"Plant height", ok:true, why:"Height may depend on fertilizer." },
            { t:"Fertilizer amount", why:"The amount is chosen; it doesn’t respond." },
            { t:"Both equally", why:"One is chosen, the other measured." },
            { t:"Neither", why:"Height plausibly responds." }],
          hints:["Which is chosen and which is measured?", "Fertilizer is chosen.", "Height responds."] },
        { id:"w6", skill:"Variables in context", goal:5, prompt:"Which pair of variables could be shown on a scatter plot?",
          options:[
            { t:"Arm span (cm) and height (cm) of 20 students", ok:true, why:"Two numerical measurements on each student." },
            { t:"Favourite colour and eye colour", why:"Both are categorical." },
            { t:"Number of students in each grade", why:"That’s one variable." },
            { t:"Monthly rainfall for one city", why:"One variable over time: a line graph." }],
          hints:["A scatter plot needs two numerical variables measured on the same individuals.", "Look for “and” with two measurements.", "Arm span and height."] }
      ],
      refreshers:{
        "Plotting points":"(<i>x</i>, <i>y</i>): horizontal first, vertical second. In context, (independent, dependent).",
        "Sign of a slope":"Rising left to right means positive; falling means negative; level means zero.",
        "Variables in context":"The independent variable is chosen or comes first; the dependent variable responds. Both must be numerical for a scatter plot."
      }
    }
  },
  explore:{
    heading:"Pattern spotter",
    intro:"Pick a data set, check the axes, then describe the pattern. Drag points to see what changes the strength, and what doesn’t.",
    predIntro:"Make a prediction first. Then the scatter tool will show you what really happens.",
    predictions:[
      { id:"p1", start:{ ds:"d1", hide:["dir", "r", "form"] },
        prompt:"D1. What is the direction?",
        options:[{ t:"Positive", ok:true }, { t:"Negative" }, { t:"None" }, { t:"Can’t tell without a line" }],
        explain:"More hours go with higher marks." },
      { id:"p2", start:{ ds:"d1", hide:[] },
        prompt:"D1. Drag the point (4, 80) down to (4, 50). What happens to the strength m&#101;ter?",
        options:[{ t:"It drops from strong to moderate", ok:true }, { t:"It stays strong" }, { t:"It rises" }, { t:"It becomes negative" }],
        explain:"One point far from the pattern weakens the correlation." },
      { id:"p3", start:{ ds:"d2", hide:[] },
        prompt:"D2. Stretch the <i>y</i>-axis ×3 so the pattern looks much steeper. Does the strength change?",
        options:[{ t:"No", ok:true }, { t:"Yes, it gets stronger" }, { t:"Yes, it gets weaker" }, { t:"It flips direction" }],
        explain:"Stretching the axis changes the picture, not the data." },
      { id:"p4", start:{ ds:"d4", hide:["form"] },
        prompt:"D4. The m&#101;ter reads weak (<i>r</i> = 0.00). Is there a relationship between speed and fuel use?",
        options:[{ t:"Yes: a strong curved one", ok:true }, { t:"No relationship" }, { t:"A weak linear one" }, { t:"A strong negative one" }],
        explain:"The m&#101;ter only measures straight-line patterns. Fuel use is lowest around 70 km/h and rises on both sides." }
    ],
    chalIntro:"Use the scatter tool to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"D2: put the variables on the correct axes." + setup("tc1", "Start with the axes swapped"),
        why:"Temperature is on <i>x</i> and cups sold on <i>y</i>: sales respond to the temperature.",
        hints:["Which one could affect the other?", "The weather comes first.", "Temperature on <i>x</i>."] },
      { id:"tc2", goal:3, prompt:"D3 (no pattern): drag the points to make a <strong>strong negative</strong> pattern." + setup("tc2", "Load D3"),
        why:"All 8 points now hug a falling line, so <i>r</i> ≤ −0.67: strong and negative.",
        hints:["Higher shoe sizes need lower marks.", "Line the points up roughly along a falling line.", "Keep every point close to that line."] },
      { id:"tc3", goal:3, stretch:true, prompt:"Custom grid: place 6 points so the m&#101;ter reads <strong>weak</strong> (|<i>r</i>| < 0.33) but the points follow a clear curved pattern." + setup("tc3", "Open an empty Custom grid"),
        why:"A U (or an upside-down U) rises as much as it falls, so the straight-line measure cancels out, yet the points hug a curve: a strong relationship that isn’t linear.",
        hints:["<i>r</i> cancels out when the pattern rises as much as it falls.", "Make a U or an upside-down U.", "Mirror the points around the middle of the grid."] }
    ]
  },
  part3:{
    slug:"stories", name:"Stories",
    heading:"Match the story",
    intro:"Six stories, six scatter plots. Match each story to its plot, write two of the relationships in words, then decide what a pattern can and can’t tell you. Every plot shows model data.",
    quickCheck:{
      title:"Stories quick check", summary:"Stories quick check",
      items:[
        { id:"q1", goal:2, prompt:"Car age vs price: direction?",
          choices:[
            { t:"Negative", ok:true, fb:"Right. Older cars sell for less." },
            { t:"Positive", fb:"Older cars sell for less." },
            { t:"None", fb:"Older cars sell for less." },
            { t:"Curved", fb:"Older cars sell for less. (Curved is a form, not a direction.)" }] },
        { id:"q2", goal:3, prompt:"Birth month vs height: strength?",
          choices:[
            { t:"No correlation", ok:true, fb:"Right. There’s no reason height follows birth month." },
            { t:"Strong", fb:"There’s no reason height follows birth month." },
            { t:"Moderate", fb:"There’s no reason height follows birth month." },
            { t:"Perfect", fb:"There’s no reason height follows birth month." }] },
        { id:"q3", goal:3, prompt:"Daylight hours across the year: form?",
          choices:[
            { t:"Curved", ok:true, fb:"Right. Daylight rises then falls." },
            { t:"Linear", fb:"Daylight rises then falls." },
            { t:"None", fb:"Daylight rises then falls." },
            { t:"Random", fb:"Daylight rises then falls." }] },
        { id:"q4", goal:5, prompt:"Ice cream and sunburn rise together. This shows…",
          choices:[
            { t:"an association", ok:true, fb:"Right. Both rise in hot, sunny weather." },
            { t:"that ice cream causes sunburn", fb:"Both rise in hot, sunny weather. " + M6 },
            { t:"that sunburn causes ice cream sales", fb:"Both rise in hot, sunny weather. " + M6 },
            { t:"nothing", fb:"Both rise in hot, sunny weather: they move together." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"ctx", type:"match", title:"Context ↔ description", summary:"Context ↔ description", goal:[2, 3, 5],
        instruction:"Match each context (model data) with the description of its scatter plot.",
        leftTitle:"Context (model data)", rightTitle:"Description",
        left:[
          { id:"l1", t:"Outdoor temperature vs heating bill", goal:[2, 3], why:"Colder days mean bigger bills, and the bill follows the temperature closely." },
          { id:"l2", t:"Hours of sleep vs number of daydreams in class", goal:[2, 3], why:"More sleep tends to go with fewer daydreams, but loosely." },
          { id:"l3", t:"Distance driven vs fuel used", goal:[2, 3], why:"Fuel used rises steadily with distance: tight and straight." },
          { id:"l4", t:"Phone number’s last digit vs height", goal:5, why:"There’s no reason height follows a phone digit." },
          { id:"l5", t:"Age vs reaction time across ages 10–80", goal:3, why:"Reaction time is slower for children and seniors and fastest in between: a tight curve.",
            hints:["How do children, adults and seniors compare?", "Slower, faster, then slower again.", "A strong curved pattern."] },
          { id:"l6", t:"Years of experience vs salary at one company", goal:[2, 3], why:"More experience tends to mean a higher salary, with a fair amount of spread." }
        ],
        right:[
          { id:"r1", t:"Strong negative linear" },
          { id:"r2", t:"Weak negative" },
          { id:"r3", t:"Strong positive linear" },
          { id:"r4", t:"No correlation" },
          { id:"r5", t:"Strong curved (fast in the middle, slower at both ends)" },
          { id:"r6", t:"Moderate positive" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6" },
        wrong:{ "l1|r2":"Heating bills follow the temperature closely. The pattern is tight.", "l5|r4":"Reaction time changes a lot with age, just not in a straight line." },
        wrongDefault:"Decide the direction first, then how tight the pattern is." },
      { id:"read", type:"custom", title:"Read the plot", summary:"Read the plot", goal:[1, 3, 4], star:true,
        instruction:"Use the scatter plot of arm span vs height to answer each question. Items marked ★ are non-routine; the last one goes beyond the Final Check.",
        how:"Tap a choice, or tap a point on the plot where asked.",
        data:[[150, 152], [155, 154], [160, 161], [163, 160], [168, 170], [172, 171], [178, 158], [180, 182]],
        items:[
          { id:"r1", goal:1, prompt:"Which variable is on the <i>x</i>-axis if we predict height from arm span?",
            choices:[{ t:"Arm span", ok:true }, { t:"Height", why:"We use arm span to predict height, so arm span goes on <i>x</i>." }],
            why:"We predict height from arm span, so arm span is the explanatory variable." },
          { id:"r2", goal:3, prompt:"Describe the direction and form.",
            choices:[{ t:"Positive, linear", ok:true }, { t:"Negative, linear", why:"Most points rise left to right." }, { t:"Positive, curved", why:"Most points follow a straight rising trend, not a curve." }, { t:"No pattern", why:"Most points rise left to right." }],
            why:"Most points rise left to right along a straight-line trend." },
          { id:"r3", goal:4, star:true, tap:true, prompt:"Tap the point that doesn’t fit the pattern.", answer:6,
            wrongTap:"That one sits close to the line through the rest.",
            why:"(178, 158) sits about 15 cm below the pattern.",
            hints:["Look for a point far from the others’ line.", "Compare the heights near arm span 178.", "(178, 158) is about 15 cm below the pattern."] },
          { id:"r4", goal:4, star:true, prompt:"If (178, 158) is removed, the strength…",
            choices:[{ t:"increases", ok:true }, { t:"decreases", why:"Removing a point far from the pattern makes the rest look tighter." }, { t:"stays the same", why:"Removing a point far from the pattern makes the rest look tighter." }],
            why:"Removing a point far from the pattern makes the rest look tighter." },
          { id:"r5", goal:[3, 4], star:true, prompt:"A ninth student has arm span 165 cm. Using the pattern (excluding the outlier), the best estimate of their height is about…",
            choices:[{ t:"140" }, { t:"150" }, { t:"166", ok:true }, { t:"180" }],
            wrongBy:{ "140":"Too low: students near 165 cm are 160–170 cm tall.", "150":"Too low: students near 165 cm are 160–170 cm tall.", "180":"That’s far above the pattern near 165." },
            why:"Students near 165 cm have heights of 160–170 cm, and the pattern passes about 166 cm at 165 cm." }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Jasper", goal:[1, 3],
        instruction:"Jasper made one mistake in each description. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Describe plot X (points tightly along a gently rising line) and plot Y (points loosely scattered around a steeply rising line).",
            steps:["Both plots show a positive direction.", "Both look linear.", "Y is stronger because its pattern is steeper.", "So Y’s variables are more closely related."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 rests on step 3."],
            fixes:[
              { t:"X is stronger, because its points hug the line more tightly; steepness doesn’t measure strength.", ok:true, why:M2 },
              { t:"They’re equally strong, because both are positive.", why:"Direction and strength are different things." },
              { t:"Y is stronger, because it has more points.", why:"Count isn’t strength." },
              { t:"Step 3 is correct.", why:"Stretch the axis and steepness changes; strength doesn’t." }],
            hints:["What does strength measure?", "How tightly the points follow the pattern.", "X is tighter."] },
          { id:"e2", goal:1, task:"Make a scatter plot of 10 students’ hours of exercise and resting heart rate.",
            steps:["Hours of exercise goes on the <i>x</i>-axis; heart rate on the <i>y</i>-axis.", "Plot each student as one point.", "Join the points from left to right with line segments to show the trend.", "Describe the shape of the joined line."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 uses the joined line from step 3."],
            fixes:[
              { t:"Leave the points unjoined and describe the cloud: direction, form, strength and outliers.", ok:true, why:"Each point stands alone, so describe the cloud, not a joined line." },
              { t:"Join them in the order the data were collected.", why:"The order still means nothing." },
              { t:"Swap the axes before joining.", why:"The problem is the joining." },
              { t:"Step 3 is correct.", why:"Each point is a separate student, so joining them invents a sequence." }],
            hints:["Is there an order to the students?", "No: each point stands alone.", "Don’t join; describe the cloud."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in Explore: the stray point, the stretched axis or the U-shaped data?" },
      { id:"j2", q:"In your own words, what makes a correlation “strong”?" },
      { id:"j3", q:"Explain to a friend how to describe a scatter plot in four parts." },
      { id:"j4", q:"Which of the four parts is hardest for you to judge? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"A study looks at how study time affects test marks. Which variable goes on the <i>x</i>-axis?", options:[
          { t:"Study time", ok:true, why:"It’s the explanatory variable." },
          { t:"Test mark", why:"The mark responds to the study time." },
          { t:"Either; it doesn’t matter.", why:"Convention puts the explanatory variable on <i>x</i>." },
          { t:"Neither; use a line graph.", why:"A scatter plot fits two numerical variables." }] },
        b:{ prompt:"A study looks at how daily temperature affects ice cream sales. Which variable goes on the <i>x</i>-axis?", options:[
          { t:"Temperature", ok:true, why:"Sales respond to the temperature, so temperature is the explanatory variable." },
          { t:"Ice cream sales", why:M1 },
          { t:"Either; it doesn’t matter.", why:"Convention puts the explanatory variable on <i>x</i>." },
          { t:"Neither; use a bar graph.", why:"A scatter plot fits two numerical variables." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"As a car gets older, its resale value tends to drop. The direction of the relationship is…", options:[
          { t:"negative", ok:true, why:"One rises as the other falls." },
          { t:"positive", why:"Both would have to rise together." },
          { t:"none, because value drops.", why:"Falling together with age is a negative relationship, not no relationship." },
          { t:"weak.", why:"Weak is a strength, not a direction." }] },
        b:{ prompt:"Taller students tend to have longer arm spans. The direction is…", options:[
          { t:"positive", ok:true, why:"Both rise together." },
          { t:"negative", why:"Both rise together, so the direction is positive." },
          { t:"none.", why:"Arm span tends to rise with height: that’s a relationship." },
          { t:"strong.", why:"Strong is a strength, not a direction." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Points lie very close to a straight line that rises from left to right. Which description fits?", options:[
          { t:"Strong positive linear", ok:true, why:"Very close to a rising straight line: strong, positive and linear." },
          { t:"Weak positive linear", why:"Very close to a line means strong." },
          { t:"Strong negative linear", why:"It rises, so it’s positive." },
          { t:"Strong nonlinear", why:"It’s a straight line." }] },
        b:{ prompt:"Points are scattered across the grid with no visible trend. Which description fits?", options:[
          { t:"No correlation", ok:true, why:"No visible trend means no correlation." },
          { t:"Strong positive linear", why:"There’s no upward trend." },
          { t:"Strong curved", why:"There’s no curve either." },
          { t:"Weak negative linear", why:"There’s no downward trend." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"A strong positive pattern has one point far below it. If that point is removed, the correlation becomes…", options:[
          { t:"stronger", ok:true, why:"The remaining points hug the line more tightly." },
          { t:"weaker", why:"The far point was loosening the pattern, so removing it makes the rest tighter. " + M5 },
          { t:"negative", why:"Removing one low point doesn’t flip the direction." },
          { t:"unchanged", why:"One far point does affect the strength." }] },
        b:{ prompt:"A new point is added far from an otherwise strong negative pattern. The correlation becomes…", options:[
          { t:"weaker", ok:true, why:"One point far from the pattern loosens it." },
          { t:"stronger", why:"A point far from the pattern loosens it. " + M5 },
          { t:"positive", why:"One point doesn’t flip the direction of a strong pattern." },
          { t:"unchanged", why:"One far point does affect the strength." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"Plot X: points tightly along a gently rising line. Plot Y: points loosely scattered around a steeply rising line. Which shows the stronger correlation?", options:[
          { t:"X", ok:true, why:"The points cluster more tightly around the line." },
          { t:"Y", why:"Steepness isn’t strength." },
          { t:"They’re equal.", why:"The tightness differs." },
          { t:"We can’t compare positive plots.", why:"Strength compares across any plots." }] },
        b:{ prompt:"Plot P: points loosely scattered around a steeply falling line. Plot Q: points tightly along a gently falling line. Which shows the stronger correlation?", options:[
          { t:"Q", ok:true, why:"Q’s points cluster more tightly around the line." },
          { t:"P", why:"Steepness isn’t strength." },
          { t:"Equal", why:"The tightness differs." },
          { t:"Neither, because both are negative.", why:M4 }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"The data (1, 10), (2, 5), (3, 2), (4, 1), (5, 2), (6, 5), (7, 10) are plotted. Which description is best?", options:[
          { t:"A strong curved (U-shaped) relationship; a straight-line measure would be near 0", ok:true, why:"The points hug a U exactly, so the relationship is strong, but the rise cancels the fall in a straight-line measure." },
          { t:"No relationship, because the trend goes both ways.", why:M3 },
          { t:"Strong negative linear.", why:"Only the first half falls." },
          { t:"Weak positive linear.", why:"There’s a clear pattern, but it’s not a line." }] },
        b:{ prompt:"The data (0, 64), (1, 32), (2, 16), (3, 8), (4, 4), (5, 2) are plotted. Which description is best?", options:[
          { t:"A strong negative curved pattern that levels off", ok:true, why:"Each value halves." },
          { t:"Strong negative linear.", why:"The drops shrink, so it curves." },
          { t:"No relationship.", why:M3 },
          { t:"Strong positive curved.", why:"It falls." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the best description of a scatter plot of temperature (<i>x</i>) vs hot chocolate sales (<i>y</i>) whose points fall close to a straight line?", options:[
          { t:"“Strong negative linear: as the temperature rises, sales tend to fall steadily, with the points close to a line.”", ok:true, why:"It names the direction, form and strength, and describes the pattern without claiming a cause." },
          { t:"“Warm weather causes people to stop drinking hot chocolate.”", why:"A plot shows association; the cause is a separate claim." },
          { t:"“Negative, so there’s no relationship.”", why:M4 },
          { t:"“Steep, so it’s strong.”", why:M2 }] },
        b:{ prompt:"Which is the best description of a scatter plot of hours of practice (<i>x</i>) vs free-throw percentage (<i>y</i>) whose points rise loosely?", options:[
          { t:"“Moderate positive linear: more practice tends to go with a higher percentage, but the points are fairly spread.”", ok:true, why:"Loose but rising: moderate and positive, described without claiming a cause." },
          { t:"“Practice guarantees a higher percentage.”", why:M6 },
          { t:"“No relationship, because the points are spread out.”", why:"Loose isn’t the same as none." },
          { t:"“Strong, because it rises.”", why:"Rising is the direction. " + M2 }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Why shouldn’t you join the points of a scatter plot with line segments?", options:[
          { t:"“Each point is a separate individual; joining them suggests an order or sequence that doesn’t exist.”", ok:true, why:"The points are individuals, not a sequence." },
          { t:"“Because the line would be curved.”", why:"Shape isn’t the issue." },
          { t:"“Because only time-series data can have points.”", why:"Scatter plots also use points." },
          { t:"“You should join them, to show the trend.”", why:M7 }] },
        b:{ prompt:"Which graph best shows the relationship between two numerical variables measured on the same individuals?", options:[
          { t:"A scatter plot", ok:true, why:"Each point is one individual’s pair of measurements." },
          { t:"A histogram", why:"Histograms show one variable." },
          { t:"A line graph joining the points", why:M7 },
          { t:"A circle graph", why:"That shows parts of a whole." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"Model data from a beach town show a strong positive association between the daily high temperature and the number of beachgoers. Which conclusion is best supported by the scatter plot alone?", options:[
          { t:"“Warmer days tend to have more beachgoers.”", ok:true, why:"That states the association and nothing more." },
          { t:"“Heat causes beach crowds.”", why:"Likely, but a scatter plot alone doesn’t establish cause." },
          { t:"“Beach crowds raise the temperature.”", why:M6 },
          { t:"“There’s no relationship, because some warm days were quiet.”", why:"A strong pattern can have exceptions." }] },
        b:{ prompt:"Model data show ice cream sales and sunburn cases rising together over a summer. Which conclusion is best supported?", options:[
          { t:"“They’re positively associated; hot, sunny weather may drive both.”", ok:true, why:"They move together, and a third variable can explain both." },
          { t:"“Eating ice cream causes sunburn.”", why:M6 },
          { t:"“Sunburn makes people buy ice cream.”", why:M6 },
          { t:"“They’re unrelated.”", why:"They clearly move together." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"Model data: 10 students’ hours of practice vs free-throw percentage show a strong positive pattern, except for one student with 1 hour and 90%. Which description is best?", options:[
          { t:"“A strong positive association with one outlier: a student who shoots well despite little practice.”", ok:true, why:"Describe the pattern and name the outlier." },
          { t:"“No relationship, because of that student.”", why:"One student doesn’t erase a strong pattern. " + M5 },
          { t:"“A strong negative relationship.”", why:"The rest rise." },
          { t:"“Remove the student and don’t mention them.”", why:"Report an outlier; don’t hide it." }] },
        b:{ prompt:"Model data: 12 households’ size vs weekly grocery bill show a strong positive pattern, except one 2-person household spending $600. Which description is best?", options:[
          { t:"“A strong positive association with one outlier: a small household with a very high bill.”", ok:true, why:"Describe the pattern and name the outlier." },
          { t:"“No relationship, because of that household.”", why:"One household doesn’t erase a strong pattern. " + M5 },
          { t:"“A strong negative relationship.”", why:"The rest rise." },
          { t:"“Delete the household so the pattern looks cleaner.”", why:"Report outliers." }] } }
    ]
  },
  task:{
    title:"Practice makes fewer mistakes", summary:"Practice makes fewer mistakes",
    statement:"<p>Five students practised a piano piece for 1, 2, 3, 4 and 5 hours. Give each student one of the mistake counts 2, 4, 6, 8, 10 (each used once) so the scatter plot meets every condition. Can you find all the answers? <span class=\"mdm-model\">model data</span></p>" +
      '<ol class="sp-conds"><li>The direction is negative.</li><li>The strength m&#101;ter reads strong.</li><li>The pattern isn’t a perfect straight line.</li><li>The student who practised 5 hours made the fewest mistakes.</li></ol>' +
      '<p class="tiny muted">Choosing a count that another student already has swaps the two cards.</p>',
    checks:["Negative direction", "Strong", "Not a perfect line", "5 hours, fewest mistakes"],
    tips:["More practice should generally mean fewer mistakes.", "To be strong, the cards should mostly decrease from left to right.", "If every card decreases (10, 8, 6, 4, 2), the line is perfect. Swap a neighbouring pair.", "Put the 2 at 5 hours."],
    explainPrompt:"Explain how you kept the pattern strong and negative without making it perfect.",
    vocab:"Use the words direction, strength, linear and outlier.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Every answer is “mostly decreasing” with the 2 at the end. One swap keeps the pattern strong; too many swaps drop it to moderate.",
    afterAt:8
  },
  cards:[
    ["Independent variable", "The explanatory variable: on the <i>x</i>-axis."],
    ["Dependent variable", "The response variable: on the <i>y</i>-axis."],
    ["Describing a scatter plot", "Direction, form, strength, outliers."],
    ["Positive direction", "<i>y</i> tends to rise as <i>x</i> rises."],
    ["Negative direction", "<i>y</i> tends to fall as <i>x</i> rises. It can still be strong."],
    ["Strength", "How tightly the points follow the pattern, not the steepness."],
    ["Nonlinear form", "A curve. It can be a strong relationship even when the linear m&#101;ter reads weak."],
    ["Outlier", "A point far from the pattern; it can weaken or fake a correlation."],
    ["Don’t join the dots", "Each point is an individual; there is no order."],
    ["Association ≠ cause", "Variables moving together doesn’t show that one causes the other."]
  ]
};
