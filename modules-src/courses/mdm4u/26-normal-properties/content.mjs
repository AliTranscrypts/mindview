// MDM4U 26 Properties of the Normal Distribution. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/26-normal-properties.md
// Core feedback sentences for the plan's misconceptions (§3).
const M1 = "The total area must stay 1. A wider curve has to be lower: doubling `σ` halves the peak.";
const M2 = "`μ` only slides the curve. The shape depends on `σ` alone.";
const M3 = "68% is the whole band from `μ - σ` to `μ + σ`: 34% on each side. Above `μ + σ` is only 16%.";
const M4 = "95% lies within `2σ`, so 5% is outside <strong>both</strong> tails together: 2.5% in each.";
const M5 = "Check shape, mean vs median, <strong>and</strong> the 1 SD and 2 SD percentages. A flat set or a skewed set isn’t normal.";
const M6 = "The tails never reach the axis. Beyond `3σ` there is still 0.3% of the area.";
const M7 = "Probability is <strong>area</strong> under the curve. A taller curve doesn’t hold more values.";

// Model-data histograms for the bell-shaped stations: bin counts from a normal model (generation only; the page gets numbers).
function erf(x){ const s = x < 0 ? -1 : 1; x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; }
function Phi(z){ return 0.5 * (1 + erf(z / Math.SQRT2)); }
function normalBins(mu, sd, n, x0, w, k){
  const c = [];
  for (let i = 0; i < k; i++) { const a = i === 0 ? -1e9 : (x0 + i * w - mu) / sd, b = i === k - 1 ? 1e9 : (x0 + (i + 1) * w - mu) / sd; c.push(Math.round(n * (Phi(b) - Phi(a)))); }
  let tot = c.reduce((s, v) => s + v, 0), big = c.indexOf(Math.max(...c)); c[big] += n - tot;
  return c;
}

const VERD = [{ id:"normal", t:"Approximately normal" }, { id:"right", t:"Skewed right" }, { id:"left", t:"Skewed left" }, { id:"uniform", t:"Uniform" }];
const REAS = [{ id:"bell", t:"mean ≈ median and bell-shaped" }, { id:"above", t:"mean well above median" }, { id:"flat", t:"flat histogram" }, { id:"rule", t:"rule percentages match" }];

export default {
  id:"26-normal-properties",
  kind:"topic",
  title:"Properties of the normal distribution",
  topic:"Properties of the Normal Distribution",
  readyTopic:"the normal distribution",
  hero:{
    eq:'`X ∼ N(@d{μ}, @k{σ}^2)`',
    eqLabel:"X follows a normal distribution with mean mu and variance sigma squared.",
    headline:"Two numbers draw the whole bell",
    text:"Heights, reaction times and test marks often pile up around an average and thin out on both sides. The <strong>normal distribution</strong> models this with a symmetric <strong>bell curve</strong>: the mean <strong>`@d{μ}`</strong> sets its centre and the standard deviation <strong>`@k{σ}`</strong> sets its spread. The <strong>68–95–99.7 rule</strong> tells you how much of the area lies within 1, 2 or 3 standard deviations of the mean.",
    fig:{ aria:"A histogram of 500 model heights builds bar by bar, its bars narrow and a smooth bell curve settles over them. A teal line at the peak is labelled mean = median = mode. Bands within 1, 2 and 3 standard deviations shade outward, showing 68%, 95% and 99.7%; the pieces are labelled 34%, 34%, 13.5%, 13.5%, 2.35% and 2.35%.", shape:"wide" }
  },
  goals:[
    "I can describe the properties of a normal distribution: symmetry, a central peak, mean = median = mode, total area 1, tails that never touch the axis.",
    "I can explain how changing `μ` and `σ` changes the normal curve.",
    "I can use the 68–95–99.7 rule to find the percent of values in an interval that starts and ends at whole numbers of standard deviations.",
    "I can work backwards from percentages to find `μ` and `σ`.",
    "I can judge whether a data set is approximately normal, using its shape, mean vs median and the rule’s percentages."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Area as probability", goal:1, prompt:"For a continuous random variable with a density curve, `P(10 < X < 20)` is…",
          options:[
            { t:"the area under the curve between 10 and 20", ok:true, why:"Probability for a continuous variable is area over an interval (module 25)." },
            { t:"the height of the curve at 15", why:"Height isn’t probability; area is." },
            { t:"the height at 20 minus the height at 10", why:"Differences of heights aren’t areas." },
            { t:"10 ÷ 20", why:"The curve’s shape matters, not just the endpoints." }],
          hints:["What represents probability for a density curve?", "Shade the region between 10 and 20.", "The shaded area is the probability."] },
        { id:"w2", skill:"Area as probability", goal:1, prompt:"Why is `P(X = 15) = 0` for a continuous random variable?",
          options:[
            { t:"A single value has no width, so the area above it is 0", ok:true, why:"Area needs an interval." },
            { t:"15 can’t happen", why:"Values near 15 happen all the time." },
            { t:"The curve is 0 at 15", why:"The curve can be high at 15; the area above one point is still 0." },
            { t:"Probabilities only exist for whole numbers", why:"That’s backwards: continuous variables use intervals." }],
          hints:["What is the area of a line segment?", "A rectangle of width 0 has area 0.", "So `P(X = 15) = 0`."] },
        { id:"w3", skill:"Standard deviation", goal:2, prompt:"Data set P: 48, 50, 52. Data set Q: 30, 50, 70. Which has the larger standard deviation?",
          options:[
            { t:"Q", ok:true, why:"Q’s values sit much farther from the mean of 50." },
            { t:"P", why:"P’s values are only 2 from the mean." },
            { t:"They’re equal, because both have mean 50", why:"Same centre, different spread." },
            { t:"You can’t tell without more values", why:"Three values are enough to compare spread." }],
          hints:["Standard deviation measures distance from the mean.", "Both means are 50.", "Q’s values are 20 away; P’s are 2 away."] },
        { id:"w4", skill:"Standard deviation", goal:3, prompt:"Marks have mean 72 and standard deviation 8. A mark of 88 is how many standard deviations above the mean?",
          options:[
            { t:"2", ok:true, why:"88 − 72 = 16, and 16 ÷ 8 = 2." },
            { t:"16", why:"16 is marks, not standard deviations." },
            { t:"11", why:"Measure from the mean first." },
            { t:"1.22", why:"Subtract, then divide by `σ`." }],
          hints:["How far is 88 from 72?", "16 marks.", "16 ÷ 8 = 2."] },
        { id:"w5", skill:"Symmetry arithmetic", goal:3, prompt:"A distribution is symmetric about 50, and 30% of values lie between 50 and 60. What percent lie between 40 and 60?",
          options:[
            { t:"60%", ok:true, why:"By symmetry, 30% also lies between 40 and 50." },
            { t:"30%", why:"40 to 50 mirrors 50 to 60." },
            { t:"80%", why:"Only the two 30% pieces." },
            { t:"15%", why:"The interval doubles, so the percent doubles." }],
          hints:["What is the mirror image of 60 across 50?", "40.", "30% + 30% = 60%."] },
        { id:"w6", skill:"Symmetry arithmetic", goal:3, prompt:"In a symmetric distribution, 95% of values lie between 40 and 60. What percent lie above 60?",
          options:[
            { t:"2.5%", ok:true, why:"5% is outside; half of it is above 60." },
            { t:"5%", why:"5% is both tails together." },
            { t:"47.5%", why:"That’s between the centre and 60." },
            { t:"95%", why:"95% is inside the interval." }],
          hints:["What percent is outside 40 to 60?", "100 − 95 = 5%.", "Split it evenly: 2.5% above 60."] }
      ],
      refreshers:{
        "Area as probability":"For a continuous variable, `P(a < X < b)` is the area under the density curve from `a` to `b`. The total area is 1, and a single value has probability 0.",
        "Standard deviation":"`σ` measures the typical distance of values from the mean. To count standard deviations, subtract the mean, then divide by `σ`: (88 − 72) ÷ 8 = 2.",
        "Symmetry arithmetic":"In a symmetric distribution, the area on one side of the centre mirrors the other. Split any ‘outside’ percent equally between the two tails."
      }
    }
  },
  explore:{
    heading:"Bell shaper",
    intro:"Change `μ` and `σ` and watch the curve respond. Then shade bands to see the 68–95–99.7 rule.",
    predIntro:"Make a prediction first. Then the bell shaper will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"compare", mu:100, sd:10 }, to:{ sd:20 },
        prompt:"Start `N(100, 10^2)`. `σ` changes from 10 to 20. What happens to the curve?",
        options:[{ t:"The peak drops to half its height and the curve gets twice as wide", ok:true }, { t:"The peak doubles in height" }, { t:"The curve moves 10 to the right" }, { t:"Nothing changes but the labels" }],
        explain:"The curve flattens and widens; the dashed ghost shows the old curve. The area must stay 1, so a curve twice as wide is half as tall." },
      { id:"p2", start:{ mode:"compare", mu:100, sd:15 }, to:{ mu:120 },
        prompt:"Start `N(100, 15^2)`. `μ` changes from 100 to 120. What happens to the shape?",
        options:[{ t:"Same shape, moved 20 to the right", ok:true }, { t:"It gets wider" }, { t:"It gets taller" }, { t:"It becomes skewed right" }],
        explain:"The curve slides; the ghost is identical apart from position. `μ` is a horizontal shift; only `σ` changes the shape." },
      { id:"p3", start:{ mode:"rule", mu:100, sd:15 }, shade:[-1, 0, 1],
        prompt:"Rule mode, `N(100, 15^2)`. What percent of values lie between 85 and 130?",
        options:[{ t:"81.5%", ok:true }, { t:"68%" }, { t:"95%" }, { t:"47.5%" }],
        explain:"The pieces 34%, 34% and 13.5% shade one by one. 85 is `μ - σ` and 130 is `μ + 2σ`: 34 + 34 + 13.5 = 81.5%." },
      { id:"p4", start:{ mode:"rule", mu:100, sd:15 }, shade:[2, 3],
        prompt:"Rule mode, `N(100, 15^2)`. What percent of values lie above 130?",
        options:[{ t:"2.5%", ok:true }, { t:"5%" }, { t:"13.5%" }, { t:"0.15%" }],
        explain:"The right tail beyond `μ + 2σ` shades (2.35% + 0.15%). 5% lies beyond `2σ` in both tails together, so 2.5% is on the right." }
    ],
    chalIntro:"Use the bell shaper to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 4], prompt:"Set the curve so that 95% of values lie between 60 and 100.",
        why:"60 and 100 are `μ ± 2σ`: the mean is the middle, 80, and `2σ = 20`, so `σ = 10`.",
        hints:["Which band holds 95%?", "`μ ± 2σ`; the mean is the middle of 60 and 100.", "`μ = 80` and `2σ = 20`, so `σ = 10`."] },
      { id:"tc2", goal:[2, 4], prompt:"Set the mean to 115 so that 16% of values lie above 130.",
        why:"16% lies above `μ + σ`, so 130 = 115 + `σ` and `σ = 15`.",
        hints:["What percent lies above `μ + σ`?", "50% − 34% = 16%.", "So 130 = 115 + `σ`: `σ = 15`."] },
      { id:"tc3", goal:[2, 4], stretch:true, prompt:"Find `μ` and `σ` so that 2.5% of values lie <strong>below 52</strong> and 16% lie <strong>above 82</strong>.",
        why:"52 = `μ - 2σ` and 82 = `μ + σ`. Subtract: `3σ = 30`, so `σ = 10` and `μ = 72`.",
        hints:["2.5% below means 52 = `μ - 2σ`.", "16% above means 82 = `μ + σ`.", "Subtract: `3σ = 30`, so `σ = 10` and `μ = 72`."] }
    ]
  },
  part3:{
    slug:"is-it-normal", name:"Is it normal?",
    heading:"Is it normal?",
    intro:"Real-looking data sets don’t come labelled. At each station, read the histogram and the <strong>Check it with data</strong> panel, which compares the set’s percentages with the 68–95–99.7 rule. Then choose a verdict and one reason.",
    verdicts:VERD, reasons:REAS,
    stations:[
      { id:"A", title:"Adult heights", data:"Heights of 200 adults (cm)", unit:"cm", n:200, x0:140, w:5, bins:normalBins(168.2, 9, 200, 140, 5, 12),
        mean:168.2, median:168.0, sd:9.0, w1:69, w2:96, dp:1,
        answer:{ v:"normal", r:["bell", "rule"] },
        right:"Bell-shaped, mean 168.2 ≈ median 168.0, and 69% and 96% are close to the rule’s 68% and 95%.",
        vfb:{ right:"Mean 168.2 and median 168.0 are almost equal, so there’s no long tail.", left:"Mean 168.2 and median 168.0 are almost equal, so there’s no long tail.", uniform:"The bars rise to a central peak; a uniform set would be flat." },
        rfb:{ above:"Here the mean (168.2) and median (168.0) are almost equal.", flat:"This histogram has a clear central peak." } },
      { id:"B", title:"Clinic wait times", data:"Clinic wait times (min)", unit:"min", n:200, x0:0, w:5, bins:[14, 30, 38, 30, 22, 16, 12, 9, 7, 6, 5, 4, 3, 2, 1, 1],
        mean:24, median:18, sd:15, w1:80, w2:94, dp:0,
        answer:{ v:"right", r:["above"] },
        right:"A long right tail: a few very long waits pull the mean (24) well above the median (18).",
        vfb:{ normal:"Mean well above median: a long right tail. " + M5, left:"The long tail is on the right (the mean is above the median), so it’s skewed right.", uniform:"The bars aren’t level: they peak early and trail off to the right." },
        rfb:{ bell:"Here the mean (24) is well above the median (18), and the bars aren’t bell-shaped.", flat:"The bars aren’t level.", rule:"80% within 1 SD is far above the rule’s 68%." } },
      { id:"C", title:"Rolling one die", data:"600 rolls of one die", unit:"", n:600, x0:0.5, w:1, bins:[98, 103, 101, 97, 104, 97],
        mean:3.5, median:3.5, sd:1.7, w1:67, w2:100, dp:1,
        answer:{ v:"uniform", r:["flat"] },
        right:"Symmetric, but flat: six equal bars, no central peak, and 100% within 2 SD instead of about 95%.",
        vfb:{ normal:"Symmetric, and 67% is close to 68%, but the histogram is flat and <strong>100%</strong> lies within 2 SD. A normal set has about 95%.", right:"Mean = median = 3.5; there’s no skew.", left:"Mean = median = 3.5; there’s no skew." },
        rfb:{ bell:"Mean = median, but the histogram is flat, not bell-shaped.", above:"Mean = median = 3.5.", rule:"67% is close to 68%, but 100% within 2 SD isn’t 95%: the percentages don’t match." } },
      { id:"D", title:"Final marks", data:"Final marks in a large course", unit:"", n:400, x0:40, w:5, bins:normalBins(71, 10, 400, 40, 5, 12),
        mean:71, median:72, sd:10, w1:67, w2:95, dp:0,
        answer:{ v:"normal", r:["bell", "rule"] },
        right:"Bell-shaped, mean 71 ≈ median 72, and 67% and 95% match the rule’s 68% and 95%.",
        vfb:{ right:"Mean 71 and median 72 are almost equal, so there’s no long tail.", left:"Mean 71 and median 72 are only 1 apart, and the bars fall off evenly on both sides.", uniform:"The bars rise to a central peak; a uniform set would be flat." },
        rfb:{ above:"Here the mean (71) and median (72) are almost equal.", flat:"This histogram has a clear central peak." } },
      { id:"E", title:"Household incomes", data:"Household incomes ($)", unit:"$", n:200, x0:0, w:20000, bins:[6, 30, 48, 38, 26, 18, 12, 8, 6, 4, 2, 1, 1],
        mean:82000, median:68000, sd:41000, w1:78, w2:95, dp:0, money:true,
        answer:{ v:"right", r:["above"] },
        right:"A long right tail: a few very high incomes pull the mean ($82 000) well above the median ($68 000).",
        vfb:{ normal:"95% within 2 SD looks normal, but the mean is well above the median and the right tail is long. " + M5, left:"The long tail is on the right (the mean is above the median), so it’s skewed right.", uniform:"The bars aren’t level: they peak early and trail off to the right." },
        rfb:{ bell:"Here the mean ($82 000) is well above the median ($68 000).", flat:"The bars aren’t level.", rule:"95% within 2 SD matches, but 78% within 1 SD is far above 68%, and one percentage can’t outweigh the shape." } }
    ],
    quickCheck:{
      title:"Quick check", summary:"Is it normal? quick check",
      items:[
        { id:"q1", goal:5, prompt:"A data set has mean 40 and median 31. Is a normal model likely to fit?",
          choices:[
            { t:"No, it’s skewed right", ok:true, fb:"Right. Mean well above median: a long right tail." },
            { t:"Yes, the mean is reasonable", fb:"Mean well above median: a long right tail." },
            { t:"No, it’s skewed left", fb:"Mean well above median: a long right tail." },
            { t:"Yes, if the SD is small", fb:"Mean well above median: a long right tail." }] },
        { id:"q2", goal:5, prompt:"A symmetric data set has 99% of values within 2 SD. Normal?",
          choices:[
            { t:"Probably not: normal has about 95%", ok:true, fb:"Right. Too much in the middle for a normal shape." },
            { t:"Yes: it’s symmetric", fb:"Too much in the middle for a normal shape. " + M5 },
            { t:"Yes: 99% is high", fb:"Too much in the middle for a normal shape. " + M5 },
            { t:"Can’t tell", fb:"Too much in the middle for a normal shape. " + M5 }] },
        { id:"q3", goal:5, prompt:"Which variable is most likely to be approximately normal?",
          choices:[
            { t:"Heights of adult women in a city", ok:true, fb:"Right. Heights cluster symmetrically around an average." },
            { t:"Salaries at a company", fb:"Heights cluster symmetrically around an average; salaries have a long right tail." },
            { t:"Results of rolling one die", fb:"Heights cluster symmetrically around an average; one die is flat (uniform)." },
            { t:"Time until a bus arrives", fb:"Heights cluster symmetrically around an average; waiting times aren’t bell-shaped." }] },
        { id:"q4", goal:1, prompt:"In a normal data set of 1000 values, about how many lie more than 3 SD from the mean?",
          choices:[
            { t:"3", ok:true, fb:"Right. 0.3% of 1000 = 3. The tails never quite end." },
            { t:"30", fb:"0.3% of 1000 = 3. The tails never quite end." },
            { t:"0", fb:"0.3% of 1000 = 3. The tails never quite end." },
            { t:"50", fb:"0.3% of 1000 = 3. The tails never quite end." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"rule", type:"custom", title:"Rule calculator", summary:"Rule calculator", goal:3,
        instruction:"Use the 68–95–99.7 rule to answer each question.",
        context:"Lengths of a fish species are normal with `μ` = 40 cm and `σ` = 4 cm (model data).",
        how:"Type a percent such as 16 or 16%, then press Check.",
        items:[
          { id:"r1", goal:3, prompt:"% between 36 and 44 cm", unit:"%", answer:68, display:"68%", why:"36 and 44 are `μ ± σ`.",
            wrong:[{ match:34, fb:"That’s one side only." }] },
          { id:"r2", goal:3, prompt:"% between 32 and 48 cm", unit:"%", answer:95, display:"95%", why:"32 and 48 are `μ ± 2σ`.",
            wrong:[{ match:47.5, fb:"That’s from the mean to one end." }] },
          { id:"r3", goal:3, prompt:"% longer than 44 cm", unit:"%", answer:16, display:"16%", why:"44 is `μ + σ`: 50 − 34 = 16.",
            wrong:[{ match:34, fb:"34% lies between 40 and 44; above 44 is 50 − 34 = 16." }] },
          { id:"r4", goal:3, prompt:"% shorter than 32 cm", unit:"%", answer:2.5, display:"2.5%", why:"32 is `μ - 2σ`: half of the 5% outside.",
            wrong:[{ match:5, fb:"5% is both tails together." }] },
          { id:"r5", goal:3, prompt:"% between 40 and 52 cm", unit:"%", answer:49.85, display:"49.85%", why:"52 is `3σ` above: 34 + 13.5 + 2.35 = 49.85.",
            wrong:[{ match:47.5, fb:"52 is `3σ` above: 34 + 13.5 + 2.35 = 49.85." }],
            hints:["How many `σ` above the mean is 52?", "`3σ`: from 40 to 52 is half of 99.7%.", "34 + 13.5 + 2.35 = 49.85."] },
          { id:"r6", goal:3, prompt:"% between 36 and 48 cm", unit:"%", answer:81.5, display:"81.5%", why:"34 + 34 + 13.5 = 81.5.",
            wrong:[{ match:68, fb:"36 is `1σ` below but 48 is `2σ` above." }] },
          { id:"r7", goal:3, prompt:"% shorter than 28 cm or longer than 52 cm", unit:"%", answer:0.3, display:"0.3%", why:"Outside `μ ± 3σ`: 100 − 99.7 = 0.3.",
            wrong:[{ match:0.15, fb:"That’s one tail; there are two." }] },
          { id:"r8", goal:3, prompt:"In a catch of 1000 fish, how many are longer than 48 cm?", unit:"fish", answer:25, display:"25 fish", why:"48 is `μ + 2σ`: 2.5% of 1000 = 25.",
            wrong:[{ match:50, fb:"Only the upper tail: 2.5% of 1000." }],
            hints:["Which band ends at 48?", "`μ + 2σ`: 2.5% lies above it.", "0.025 × 1000 = 25."] }
        ] },
      { id:"back", type:"custom", title:"Work backwards", summary:"Work backwards", goal:[3, 4], star:true,
        instruction:"Match each percent to a band edge, then solve for `μ` and `σ`. Items marked ★ are non-routine; the last two go beyond the Final Check.",
        how:"Type each number, then press Check.",
        items:[
          { id:"b1", goal:4, prompt:"95% of a normal variable lies between 120 and 180. Find `μ` and `σ`.", parts:["`μ` =", "`σ` ="], answer:[150, 15], display:"`μ = 150`, `σ = 15`",
            why:"120 and 180 are `μ ± 2σ`: `μ` is the midpoint, 150, and `4σ = 60`.",
            wrong:[{ part:1, match:30, fb:"120 to 180 is `±2σ`, not `±1σ`." }] },
          { id:"b2", goal:4, prompt:"16% of values lie above 66 and 16% lie below 54. Find `μ` and `σ`.", parts:["`μ` =", "`σ` ="], answer:[60, 6], display:"`μ = 60`, `σ = 6`",
            why:"16% beyond each end means 54 and 66 are `μ ± σ`.",
            wrong:[{ part:1, match:3, fb:"16% beyond each end means `±1σ`." }] },
          { id:"b3", goal:4, star:true, prompt:"2.5% of values lie above 230 and 50% lie above 200. Find `σ`.", label:"`σ` =", answer:15, display:"`σ = 15`",
            why:"50% above 200 means `μ = 200`; 2.5% above 230 means 230 = `μ + 2σ`, so `σ = 15`.",
            wrong:[{ match:30, fb:"50% above 200 means `μ = 200`; 230 is `μ + 2σ`." }] },
          { id:"b4", goal:3, star:true, prompt:"Bolts have diameters `N(10.0, 0.2^2)` mm. Bolts outside 9.6 to 10.4 mm are rejected. In a batch of 2000, about how many are rejected?", label:"Rejected bolts:", answer:100, display:"100 bolts",
            why:"9.6 and 10.4 are `μ ± 2σ`, so 5% lies outside: 0.05 × 2000 = 100.",
            wrong:[{ match:50, fb:"Both ends are rejected: 5% of 2000." }],
            hints:["How far from the mean are 9.6 and 10.4?", "Each is `2σ` away: 5% lies outside.", "0.05 × 2000 = 100."] },
          { id:"b5", goal:3, star:true, prompt:"Class A’s marks are `N(70, 5^2)`; class B’s are `N(70, 10^2)`. What percent of each class scores above 80?", parts:["Class A (%):", "Class B (%):"], answer:[2.5, 16], display:"A: 2.5%; B: 16%",
            why:"For A, 80 is `μ + 2σ` (2.5% above); for B, 80 is `μ + σ` (16% above).",
            wrong:[{ part:0, match:16, fb:"For A, 80 is `2σ` above, not `1σ`." }] },
          { id:"b6", goal:4, star:true, prompt:"84% of values lie below 75 and 97.5% lie below 85. Find `μ` and `σ`.", parts:["`μ` =", "`σ` ="], answer:[65, 10], display:"`μ = 65`, `σ = 10`",
            why:"`μ + σ = 75` and `μ + 2σ = 85`. Subtract: `σ = 10`, so `μ = 65`.",
            wrong:[{ part:0, match:75, fb:"84% below means 75 = `μ + σ`." }],
            hints:["84% below a value: which band edge?", "`μ + σ = 75` and `μ + 2σ = 85`.", "Subtract: `σ = 10`, so `μ = 65`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Bruno", how:"", goal:[3, 5],
        instruction:"Bruno made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Apple masses are `N(150, 10^2)` g. What percent weigh between 130 and 160 g?",
            steps:["130 is `2σ` below the mean; 160 is `1σ` above.", "Between 130 and 150 there is 95%.", "Between 150 and 160 there is 34%.", "95 + 34 = 129%, so all apples, 100%."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 is correct on its own; the mistake is earlier.", "This follows the earlier slip."],
            fixes:[
              { t:"From `μ - 2σ` to `μ` is half of 95%: 47.5%. The total is 47.5 + 34 = 81.5%.", ok:true, why:"95% is the whole band from 130 to 170, so 130 to 150 holds half of it." },
              { t:"Use 68% for the whole interval.", why:"130 is `2σ` below, not `1σ`." },
              { t:"130 is `3σ` below.", why:"150 − 130 = 20 = `2σ`." },
              { t:"Step 2 is correct.", why:"95% is the whole band from 130 to 170." }],
            hints:["What percent lies between `μ - 2σ` and `μ + 2σ`?", "95%; how much is on one side?", "47.5% + 34% = 81.5%."] },
          { id:"e2", goal:3, task:"Phone battery life is `N(20, 2^2)` hours. What percent of phones last more than 22 hours?",
            steps:["22 = `μ + σ`.", "68% of values lie within one SD of the mean.", "So 68% of phones last more than 22 hours."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"68% is inside 18 to 22, so 32% is outside, half of it above 22: 16%.", ok:true, why:M3 },
              { t:"34% last more than 22 hours.", why:"34% is between 20 and 22." },
              { t:"84% last more than 22 hours.", why:"84% last <strong>less</strong> than 22 hours." },
              { t:"Step 3 is correct.", why:"68% is the middle band, not the upper tail." }],
            hints:["Where is the 68% band?", "From 18 to 22.", "Above 22: (100 − 68) ÷ 2 = 16%."] },
          { id:"e3", goal:5, task:"Is the distribution of 600 rolls of a fair die approximately normal?",
            steps:["Mean = median = 3.5, so the data are symmetric.", "67% of rolls are within 1 SD, close to the rule’s 68%.", "So the distribution is approximately normal."],
            answer:2,
            stepFb:["Step 1 is fine.", "Step 2 is accurate.", ""],
            fixes:[
              { t:"Also check the shape and the 2 SD percent: the histogram is flat and 100% lies within 2 SD, not 95%. It’s uniform, not normal.", ok:true, why:M5 },
              { t:"It’s skewed right.", why:"Mean = median; it’s not skewed." },
              { t:"It’s normal because 600 rolls is a lot.", why:"More rolls make the histogram flatter, not bell-shaped." },
              { t:"Step 3 is correct.", why:M5 }],
            hints:["What does the histogram look like?", "Six equal bars.", "Flat, with 100% within 2 SD: uniform."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the Bell shaper: that a wider curve gets lower, or that the rule’s percentages never change?" },
      { id:"j2", q:"In your own words, why can’t `σ` change without the height changing too?" },
      { id:"j3", q:"Explain to a friend how to find the percent of values between `μ - σ` and `μ + 2σ`." },
      { id:"j4", q:"Which data set in ‘Is it normal?’ fooled you, or nearly did? What will you check first next time?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which statement is true of every normal distribution?", options:[
          { t:"Its mean, median and mode are equal, and it is symmetric about the mean", ok:true, why:"Every normal curve is symmetric with its peak at the mean." },
          { t:"Its curve touches the `x`-axis at `μ ± 3σ`", why:"The tails never touch the axis. " + M6 },
          { t:"Its mean is larger than its median", why:"That describes right skew." },
          { t:"Its total area depends on `σ`", why:"The total area is always 1." }] },
        b:{ prompt:"Where are the inflection points of `N(60, 5^2)`?", options:[
          { t:"55 and 65", ok:true, why:"At `μ ± σ`." },
          { t:"50 and 70", why:"That’s `μ ± 2σ`." },
          { t:"45 and 75", why:"That’s `μ ± 3σ`." },
          { t:"Only at 60", why:"The peak is at 60; the curve changes how it bends at `μ ± σ`." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"For `N(500, 100^2)`, what percent of values lie between 400 and 600?", options:[
          { t:"68%", ok:true, why:"`μ ± σ`." },
          { t:"95%", why:"That’s `μ ± 2σ`: 300 to 700." },
          { t:"34%", why:"That’s one side only." },
          { t:"50%", why:"Half lies above 500, but 400 to 600 is the middle band." }] },
        b:{ prompt:"For `N(50, 4^2)`, what percent of values lie between 42 and 58?", options:[
          { t:"95%", ok:true, why:"`μ ± 2σ`." },
          { t:"68%", why:"That’s 46 to 54." },
          { t:"47.5%", why:"That’s one side only." },
          { t:"99.7%", why:"That’s 38 to 62." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"A normal curve changes from `N(80, 6^2)` to `N(80, 12^2)`. Which describes the change?", options:[
          { t:"It becomes flatter and wider, with half the peak height; the centre stays at 80", ok:true, why:"`σ` doubled, so the curve is twice as wide and half as tall; `μ` didn’t change." },
          { t:"It becomes taller and narrower", why:M1 },
          { t:"It shifts 6 to the right", why:"`μ` didn’t change." },
          { t:"Its peak doubles in height", why:M1 }] },
        b:{ prompt:"A normal curve changes from `N(80, 6^2)` to `N(92, 6^2)`. Which describes the change?", options:[
          { t:"It shifts 12 to the right with the same shape", ok:true, why:"`μ` rose by 12 and `σ` didn’t change." },
          { t:"It becomes wider", why:"`σ` didn’t change." },
          { t:"It becomes taller", why:"`σ` didn’t change. " + M2 },
          { t:"It shifts 12 to the left", why:"A larger mean moves the curve right." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Commute times are `N(30, 5^2)` minutes. What percent of commutes take between 25 and 40 minutes?", options:[
          { t:"81.5%", ok:true, why:"25 is `μ - σ` and 40 is `μ + 2σ`: 34 + 34 + 13.5." },
          { t:"68%", why:"40 is `2σ` above, not `1σ`." },
          { t:"95%", why:"25 is only `1σ` below." },
          { t:"47.5%", why:"That’s only 30 to 40." }] },
        b:{ prompt:"Commute times are `N(30, 5^2)` minutes. What percent take between 20 and 35 minutes?", options:[
          { t:"81.5%", ok:true, why:"13.5 + 34 + 34." },
          { t:"68%", why:"20 is `2σ` below, not `1σ`." },
          { t:"95%", why:"35 is only `1σ` above." },
          { t:"47.5%", why:"That’s only 20 to 30." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"A normal variable has 2.5% of values below 40 and 2.5% above 100. Find `μ` and `σ`.", options:[
          { t:"`μ = 70`, `σ = 15`", ok:true, why:"40 and 100 are `μ ± 2σ`: `4σ = 60`." },
          { t:"`μ = 70`, `σ = 30`", why:"That treats 40 and 100 as `μ ± σ`." },
          { t:"`μ = 70`, `σ = 10`", why:"That treats them as `μ ± 3σ`." },
          { t:"`μ = 60`, `σ = 20`", why:"The mean is the midpoint of 40 and 100." }] },
        b:{ prompt:"A normal variable has 16% of values below 45 and 16% above 75. Find `μ` and `σ`.", options:[
          { t:"`μ = 60`, `σ = 15`", ok:true, why:"45 and 75 are `μ ± σ`." },
          { t:"`μ = 60`, `σ = 7.5`", why:"That treats them as `μ ± 2σ`." },
          { t:"`μ = 60`, `σ = 30`", why:"`μ ± σ` covers 45 to 75: `2σ = 30`." },
          { t:"`μ = 55`, `σ = 10`", why:"The mean is the midpoint, 60." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"In a large school, sleep times are normal. 84% of students sleep less than 9 h and 2.5% sleep less than 6 h. What is the mean?", options:[
          { t:"8 h", ok:true, why:"`μ + σ = 9` and `μ - 2σ = 6`, so `3σ = 3`: `σ = 1`, `μ = 8`." },
          { t:"7.5 h", why:"That’s the midpoint of 6 and 9, but they aren’t equally far from the mean." },
          { t:"9 h", why:"84% below 9 puts 9 above the mean." },
          { t:"7 h", why:"Check: 7 + 1 = 8, not 9." }] },
        b:{ prompt:"84% of values lie below 31 and 2.5% lie below 22. What is the mean?", options:[
          { t:"28", ok:true, why:"`μ + σ = 31` and `μ - 2σ = 22`: `σ = 3`." },
          { t:"26.5", why:"The midpoint assumes both are the same distance from the mean." },
          { t:"31", why:"31 is above the mean." },
          { t:"25", why:"Check: 25 + 3 = 28, not 31." }] } },
      { id:"c1", cat:"C", goal:[1, 5],
        a:{ prompt:"Which is the best explanation of why household incomes are not well modelled by a normal curve?", options:[
          { t:"“The data are skewed right: a few very high incomes stretch the right tail and pull the mean well above the median, so the shape isn’t symmetric.”", ok:true, why:"Shape is the test, and incomes have a long right tail." },
          { t:"“Incomes can’t be measured accurately.”", why:"Measurement isn’t the issue; shape is." },
          { t:"“Incomes are counted in whole dollars.”", why:"Many normal models use rounded data." },
          { t:"“There are too many incomes to graph.”", why:"Large data sets can still be normal." }] },
        b:{ prompt:"Which is the best explanation of why the results of rolling one fair die are not normal, even though they’re symmetric?", options:[
          { t:"“The distribution is flat: every value is equally likely, there’s no central peak, and 100% of rolls lie within 2 SD instead of about 95%.”", ok:true, why:"Symmetry alone isn’t enough; the shape must be a bell." },
          { t:"“It’s skewed right.”", why:"Mean = median = 3.5." },
          { t:"“The mean and median differ.”", why:"Both are 3.5." },
          { t:"“Six values is too few.”", why:"The count of values isn’t the test; the shape is." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Two normal curves have the same mean, and curve P is taller than curve Q. Which statement is correct?", options:[
          { t:"“P has the smaller standard deviation; each curve has a total area of 1.”", ok:true, why:"A taller curve must be narrower to keep its area at 1." },
          { t:"“P contains more data values than Q.”", why:"Height isn’t amount; both have area 1." },
          { t:"“P has the larger standard deviation.”", why:M1 },
          { t:"“P has the larger mean.”", why:"The means are equal." }] },
        b:{ prompt:"Curve R is twice as wide as curve S, and both have the same mean. Which statement is correct?", options:[
          { t:"“R’s standard deviation is twice S’s, and R’s peak is half as high; each has area 1.”", ok:true, why:"Twice as wide means twice the `σ`, so half the height." },
          { t:"“R contains twice as many values.”", why:M7 },
          { t:"“R’s peak is twice as high.”", why:M1 },
          { t:"“R’s mean is twice S’s.”", why:"Both have the same mean. " + M2 }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"Cereal boxes have masses `N(510, 5^2)` g, and the label says 500 g. In a shipment of 4000 boxes, about how many weigh less than 500 g?", options:[
          { t:"100", ok:true, why:"500 is `μ - 2σ`: 2.5% of 4000." },
          { t:"200", why:"5% is both tails; only light boxes count." },
          { t:"640", why:"16% is below `μ - σ` = 505." },
          { t:"0", why:"The tail beyond `2σ` still holds 2.5%." }] },
        b:{ prompt:"Juice bottles hold `N(355, 2^2)` mL and are labelled 351 mL. Of 8000 bottles, about how many hold less than 351 mL?", options:[
          { t:"200", ok:true, why:"351 is `μ - 2σ`: 2.5% of 8000." },
          { t:"400", why:"5% is both tails; only the low tail counts." },
          { t:"1280", why:"16% is below 353." },
          { t:"0", why:"The tail beyond `2σ` still holds 2.5%." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A model data set has mean 58, median 58 and SD 6. 66% of values lie within 1 SD and 99% within 2 SD; the histogram is mound-shaped with very short tails. What is the best conclusion?", options:[
          { t:"Roughly normal near the centre, but with thinner tails than normal (99% vs 95% within 2 SD), so use the normal model with caution", ok:true, why:"The centre fits, but the 2 SD percent is the warning sign." },
          { t:"Exactly normal, because the mean equals the median", why:M5 },
          { t:"Not usable at all, because 66 isn’t exactly 68", why:"Real data never match exactly; the 2 SD percent is the warning sign." },
          { t:"Skewed right", why:"Mean = median; there’s no skew." }] },
        b:{ prompt:"A model data set has mean 40, median 35 and SD 10. 75% of values lie within 1 SD and 93% within 2 SD; there is a long right tail. What is the best conclusion?", options:[
          { t:"Not normal: the mean above the median and the long right tail show right skew", ok:true, why:"Shape and mean vs median both point to right skew." },
          { t:"Normal, because 93% is close to 95%", why:"One percentage can’t outweigh the shape." },
          { t:"Normal, because 75% is more than 68%", why:M5 },
          { t:"Skewed left", why:"A long right tail means right skew." }] } }
    ]
  },
  task:{
    title:"A fair test", summary:"A fair test",
    statement:"<p>Marks on a big exam will be normal. Choose the mean and standard deviation the exam should be designed for so that every condition holds (use the 68–95–99.7 rule). Can you find all the answers?</p>" +
      '<ol class="np-conds"><li>At most 2.5% of students score above 100 (the maximum).</li><li>At least 84% of students pass (score 50 or more).</li><li>At least 16% of students earn 80 or more.</li><li>The marks are spread out enough to separate students: `σ ≥ 10`.</li></ol>',
    checks:["At most 2.5% above 100", "At least 84% pass", "At least 16% earn 80+", "Spread enough"],
    tips:["2.5% lies above `μ + 2σ`: keep `μ + 2σ` at 100 or lower.", "84% lies above `μ - σ`: keep `μ - σ` at 50 or higher.", "16% lies above `μ + σ`: you need `μ + σ` to reach 80.", "`σ = 5` crowds everyone together."],
    explainPrompt:"Explain how each condition limits `μ` and `σ`, and why no design works when `σ = 20`.",
    vocab:"Use the words mean, standard deviation, 68–95–99.7 rule and tail.",
    more:"There’s more than one answer. Can you find them all?",
    afterAt:5,
    after3:"Lines 1 and 2 squeeze `μ` between `50 + σ` and `100 - 2σ`. That window is `50 - 3σ` wide, so `σ = 20` leaves no room at all."
  },
  cards:[
    ["Normal distribution", "A symmetric, bell-shaped density curve: `X ∼ N(μ, σ^2)`."],
    ["Centre", "Mean = median = mode, at the peak."],
    ["Total area", "Always 1 (100% of values)."],
    ["Effect of `μ`", "Shifts the curve left or right; the shape is unchanged."],
    ["Effect of `σ`", "Larger `σ`: wider and flatter. Doubling `σ` halves the peak."],
    ["Inflection points", "At `μ - σ` and `μ + σ`."],
    ["68–95–99.7 rule", "68% within `1σ`, 95% within `2σ`, 99.7% within `3σ` of the mean."],
    ["Pieces of the rule", "34%, 13.5%, 2.35%, 0.15% on each side."],
    ["Above `μ + σ`", "16%. Above `μ + 2σ`: 2.5%. Above `μ + 3σ`: 0.15%."],
    ["Working backwards", "Match each percent to a band edge (`μ + σ`, `μ - 2σ`, …), then solve for `μ` and `σ`."],
    ["Tails", "Never touch the axis; 0.3% of values lie beyond `3σ`."],
    ["Is it normal?", "Bell-shaped, mean ≈ median, about 68% within 1 SD and 95% within 2 SD."]
  ]
};
