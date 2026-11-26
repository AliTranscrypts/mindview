// HFA4U 24 Food Aid & the Sustainable Development Goals. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/24-food-aid-sdgs.md
// Teacher notes: lines marked VERIFY carry the plan's "verify before release" flags (students see the plan's wording without
// them) and every value or line this module had to supply. "module-written" marks text that isn't in the plan.
// Module rules (plan §6): Ruvara is fictional; every calculation uses the plan's model data (labelled on screen); real
// figures appear only in labelled information cards; the module names no charity for students to donate to.
// VERIFY (plan §1, §6.2): the current FAO figures on SDG 2 progress ("not on track"); this module shows no real hunger counts.
// VERIFY (plan §6.1): the aid designer's model table is a teaching model "built on widely reported findings about food aid".

// Misconception core sentences (plan §3); "(verify)" flags moved to these comments.
// VERIFY: M2 "studies of cash transfers find families mostly spend them on food and essentials"; M4 "global production is
// generally reported to be enough to feed everyone".
const M1 = "When local markets still have food, cash or vouchers reach families in days and keep money with local farmers. Shipped food can take months.";
const M2 = "Studies of cash transfers find families mostly spend them on food and essentials. Cash also lets them choose what they need.";
const M3 = "Dependency is a real risk when aid replaces local production for years. Good aid is timed, targeted and paired with recovery.";
const M4 = "Global production is generally reported to be enough to feed everyone. Hunger is mostly about access: poverty, conflict, prices and shocks.";
const M5 = "Young children and pregnant or breastfeeding people may need specialized nutrition, such as fortified foods or therapeutic foods for severe wasting.";
const M6 = "Check the numbers: a fall from 12% to 9% over 6 years is 0.5 points a year, not 3.";
const M7 = "In an acute emergency, people who are sick, elderly or caring for others can’t work. Unconditional help comes first.";

// ---------- the aid designer's teaching model (plan table, exact values) ----------
// mk/reach/nut/res are the plan's ratings; mkT/reachT are the plan's cell wording; why = the "See the model" one-line reason
// per row (module-written, except A3 in S2, which is the plan's example); warn = the readout warning (module-written, except
// A1 in S1, the plan's example).
function cell(w, mk, mkT, reach, reachT, nut, res, why, warn){ const c = { w, mk, mkT, reach, reachT, nut, res, why }; if (warn) c.warn = warn; return c; }
const A5WHY = "Fortified and therapeutic foods target young children and pregnant or breastfeeding people, so they reach only those groups.";
const OPTIONS = [
  { id:"A1", t:"Imported food shipment", sub:"in-kind, from abroad", short:"Imported food", icon:"ship",
    S1:cell(16, "hurts", "Hurts (lowers prices)", "partly", "Partly (late)", "some", "low", "Shipped food takes about 16 weeks, and free grain in a working market lowers what local farmers and shops can charge.", "shipped food may lower local prices"),
    S2:cell(16, "neutral", "Neutral (no market to undercut)", "partly", "Partly (late)", "some", "low", "With markets empty, food must be brought in, but shipping it from abroad is slow. There’s no local market to undercut."),
    S3:cell(16, "hurts", "Hurts (arrives at harvest)", "partly", "Partly", "some", "low", "Shipped grain lands at harvest time and pushes down the prices farmers get for their own crop.", "shipped food arrives at harvest and may lower farmers’ prices") },
  { id:"A2", t:"Food bought in the region", sub:"local or regional purchase", short:"Regional purchase", icon:"truck",
    S1:cell(4, "helps", "Helps", "yes", "Yes", "some", "low", "Buying in the region takes about 4 weeks and puts money in nearby farmers’ pockets."),
    S2:cell(6, "neutral", "Neutral", "yes", "Yes", "some", "low", "Food bought in the region is trucked in around the cut road in about 6 weeks: it brings food where there is none."),
    S3:cell(4, "helps", "Helps", "yes", "Yes", "some", "low", "Buying from nearby farmers at harvest supports the prices they earn.") },
  { id:"A3", t:"Cash transfers", sub:"by mobile phone", short:"Cash", icon:"phone",
    S1:cell(1, "helps", "Helps", "yes", "Yes", "some", "low", "Where markets work, cash moves in days and families buy what they need locally."),
    S2:cell(1, "hurts", "Hurts (prices rise; nothing to buy)", "no", "No", "little", "low", "With nothing to buy, extra money mostly drives prices up.", "cash with nothing to buy pushes prices up"),
    S3:cell(1, "helps", "Helps", "yes", "Yes", "some", "medium", "Cash spent in reopened markets supports traders, and families can put some toward replanting.") },
  { id:"A4", t:"Food vouchers", sub:"spent at local shops", short:"Vouchers", icon:"voucher",
    S1:cell(2, "helps", "Helps", "yes", "Yes", "some", "low", "Vouchers take about 2 weeks to set up and are spent on food at local shops."),
    S2:cell(2, "hurts", "Hurts (prices rise; nothing to buy)", "no", "No", "little", "low", "Vouchers can’t buy food the shops don’t have, so they mostly push prices up.", "vouchers with nothing to buy push prices up"),
    S3:cell(2, "helps", "Helps", "yes", "Yes", "some", "low", "Vouchers spent at local shops support traders as markets recover.") },
  { id:"A5", t:"Specialized nutrition", sub:"fortified foods, plus therapeutic food for children with severe wasting; for children under 5 and pregnant or breastfeeding people", short:"Specialized nutrition", icon:"bowl",
    S1:cell(3, "neutral", "Neutral", "partly", "Partly (targeted groups)", "strong", "low", A5WHY),
    S2:cell(3, "neutral", "Neutral", "partly", "Partly (targeted groups)", "strong", "low", A5WHY),
    S3:cell(3, "neutral", "Neutral", "partly", "Partly (targeted groups)", "strong", "low", A5WHY) },
  { id:"A6", t:"Food-for-assets", sub:"people are paid in food or cash to build water catchments", short:"Food-for-assets", icon:"water",
    S1:cell(6, "neutral", "Neutral", "partly", "Partly (those able to work)", "some", "high", "Paying people to build water catchments feeds those able to work and leaves an asset for the next dry season."),
    S2:cell(6, "neutral", "Neutral", "partly", "Partly", "little", "medium", "With roads cut, work projects are hard to supply, but the catchments still help later."),
    S3:cell(6, "neutral", "Neutral", "partly", "Partly (those able to work)", "some", "high", "Paying people to build water catchments feeds those able to work and leaves an asset for the next dry season.") },
  { id:"A7", t:"Seeds, tools and farmer training", sub:"for the next planting", short:"Seeds and tools", icon:"seed",
    S1:cell(8, "helps", "Helps", "no", "No (doesn’t feed people now)", "little", "high", "Seeds and training don’t feed anyone today, but they help farmers grow the next harvest, and buying them locally supports traders."),
    S2:cell(8, "neutral", "Neutral", "no", "No", "little", "high", "Seeds don’t feed people now, and with markets empty there’s no trade to support; they still pay off next season."),
    S3:cell(8, "helps", "Helps", "no", "No (doesn’t feed people now)", "little", "high", "Seeds and training don’t feed anyone today, but they help farmers grow the next harvest, and buying them locally supports traders.") }
];

// Practice 1 (Which aid fits?): best fit and the "most likely wrong choice" line are the plan's; the other mismatch lines,
// the correct-placement lines and hint 3's reason are module-written.
const FIT_H1 = "Are local markets working?";
const FIT_H2 = "Who is most at risk, and is this emergency or recovery?";
const BOXES = ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "meals"];
const BOXNAME = { a1:"Imported food", a2:"Regional purchase", a3:"Cash transfers", a4:"Vouchers", a5:"Specialized nutrition", a6:"Food-for-assets", a7:"Seeds and tools", meals:"School meals" };
function fit(id, t, ans, likely, likelyFb, miss, why, goal){
  const wrong = {};
  BOXES.filter(b => b !== ans).forEach(b => { wrong[b] = b === likely ? likelyFb : miss; });
  return { id, t, answer:ans, why, wrong, goal, hints:[FIT_H1, FIT_H2, BOXNAME[ans] + ". " + why] };
}

// Performance task inputs (plan): A1–A4 per place in phase 1, A1/A2/A3/A6/A7 in phase 2, two SDG 2 targets.
// VERIFY: the SDG 2 target wording (plan: "Verify the target wording before release").
const TARGETS = [
  { id:"2.1", t:"2.1 End hunger" },
  { id:"2.2", t:"2.2 End all forms of malnutrition" },
  { id:"2.3", t:"2.3 Small-scale producers’ productivity and incomes" },
  { id:"2.4", t:"2.4 Sustainable food production" },
  { id:"2.5", t:"2.5 Genetic diversity of seeds" }
];

export default {
  id:"24-food-aid-sdgs",
  kind:"topic",
  title:"Food aid and the Sustainable Development Goals",
  topic:"Food Aid & the Sustainable Development Goals",
  readyTopic:"food aid and the SDGs",
  hero:{
    eq:"Same drought, different needs: <strong>what does this place need, for whom, and when?</strong>", eqSize:"sm",
    eqLabel:"Same drought, different needs: what does this place need, for whom, and when?",
    headline:"Help that fits the situation",
    text:"When a drought or conflict hits, people need food, but <em>how</em> it arrives matters. <strong>Shipped food</strong>, <strong>locally bought food</strong>, <strong>cash</strong> and <strong>vouchers</strong> each help in different situations. Get it right and families eat sooner and local farmers keep their livelihoods. Get it wrong and help arrives late or pushes down the prices local farmers depend on. The world has a shared goal for this: <strong>SDG 2, Zero Hunger</strong>, by 2030.",
    fig:{ html:'<div class="fai-hero" id="fai-hero"></div>', caption:"" },
    // module-written description of the plan's storyboard
    aria:"A map of Ruvara, a fictional region. The town’s market is full of sacks; the remote villages’ markets are empty and the road to them is broken. A slow ship labelled 16 weeks and a phone labelled cash: 1 week both head for the people. The cash reaches the town market, where the sacks become families’ meals, but stops at the villages: no food to buy. A truck labelled bought in the region reaches the villages. Different places, different help.",
    caption:"Different places, different help."
  },
  goals:[
    "I can tell apart emergency, program and project food aid, and modern forms such as cash, vouchers and local or regional purchase.",
    "I can explain how food aid can help or harm local markets and farmers.",
    "I can match an aid response to the situation: whether markets are working, who is most at risk, and the season.",
    "I can describe SDG 2 (Zero Hunger) and its main targets, and judge progress claims using data.",
    "I can evaluate a food-aid response against criteria: speed, need, market effects, dignity, nutrition and resilience.",
    "I can describe effective ways Canadians, including students, can act on hunger."
  ],
  start:{
    // Plan §5 build notes (F11): the SDG 2 context card. VERIFY: SDG 2 wording, the 2015 adoption and 2030 date, the five
    // target summaries, and "not on track" against the current FAO report (State of Food Security and Nutrition in the World).
    // No real figures are shown (course rule: no invented statistics); a teacher may add the current FAO counts with source and year.
    blocks:[{ title:"SDG 2: Zero Hunger",
      html:"<p><strong>SDG 2 (Zero Hunger)</strong> is one of the 17 Sustainable Development Goals adopted by UN member states in 2015 for 2030. It covers ending hunger, ending all forms of malnutrition, raising small-scale farmers’ productivity and incomes, and sustainable food systems. Reports show the world is <strong>not on track</strong>. Judging progress means reading data carefully, not trusting slogans.</p>" +
        '<p class="tiny"><strong>Targets you’ll use in this module</strong></p><ul class="fai-tlist">' + TARGETS.map(t => "<li>" + t.t + "</li>").join("") + "</ul>" +
        '<p class="tiny muted">Source to check for current figures: the FAO’s annual <em>State of Food Security and Nutrition in the World</em> report. Every number you calculate in this module is model data.</p>' }],
    warmup:{
      questions:[
        { id:"w1", skill:"Food security components", goal:3,
          prompt:"A town’s stores have plenty of food, but after a poor harvest, prices have doubled and many families can’t afford it. Which component of food security is most affected?",
          options:[
            { t:"Accessibility", ok:true, why:"Food is there, but people can’t afford it: access is the problem." },
            { t:"Availability", why:"The stores are full, so food is available." },
            { t:"Sustainability", why:"Sustainability is about supply over time; the problem now is affordability." },
            { t:"Acceptability", why:"Nothing suggests the food is culturally unsuitable." }],
          hints:["Is there food in the stores?", "Yes, so what’s stopping families?", "Price, which is access."] },
        { id:"w2", skill:"Food security components", goal:3,
          prompt:"Floods cut the only road to a group of villages. Their small shops have run out of food. Which component is missing?",
          options:[
            { t:"Availability", ok:true, why:"There’s no food in the local market at all." },
            { t:"Accessibility only", why:"Even with money, there’s nothing to buy." },
            { t:"Adequacy", why:"Adequacy is about whether food meets nutritional needs; here there’s none." },
            { t:"Acceptability", why:"Not a cultural issue." }],
          hints:["Could money buy food there today?", "No, the shops are empty.", "Availability."] },
        { id:"w3", skill:"Forms of malnutrition", goal:4,
          prompt:"A five-year-old is much shorter than expected for their age after years of poor nutrition. This is called…",
          options:[
            { t:"Stunting", ok:true, why:"Low height for age, from long-term undernutrition (module 21)." },
            { t:"Wasting", why:"Wasting is low weight for height: it’s acute, recent and urgent." },
            { t:"Overweight", why:"The opposite end of the double burden." },
            { t:"Hidden hunger", why:"That means missing vitamins or minerals; it can come with stunting but isn’t the same thing." }],
          hints:["Height or weight?", "Height for age.", "Stunting."] },
        { id:"w4", skill:"Forms of malnutrition", goal:4,
          prompt:"A family eats enough calories, but their diet lacks iron and vitamin A. This is called…",
          options:[
            { t:"Hidden hunger (micronutrient deficiency)", ok:true, why:"Enough energy, not enough vitamins and minerals." },
            { t:"Wasting", why:"Wasting is a severe lack of energy and protein." },
            { t:"Stunting", why:"Stunting is a growth result, not the deficiency itself." },
            { t:"Food sovereignty", why:"Food sovereignty is about control over food systems." }],
          hints:["Calories are fine; what’s missing?", "Micronutrients.", "Hidden hunger."] },
        { id:"w5", skill:"Markets and prices", goal:2,
          prompt:"At harvest time, a large shipment of free grain is handed out in a market where local farmers are also selling grain. What usually happens to the price local farmers can get?",
          options:[
            { t:"It falls", ok:true, why:"More grain and less demand to buy it push prices down." },
            { t:"It rises", why:"Free grain reduces how much people need to buy." },
            { t:"It stays the same", why:"Supply and demand both shift." },
            { t:"It can’t change, because aid is separate from markets", why:"Free food changes what people buy." }],
          hints:["Do people still need to buy as much grain?", "No: demand falls while supply rises.", "Prices fall."] },
        // VERIFY: "The 2030 Agenda".
        { id:"w6", skill:"The SDGs", goal:4,
          prompt:"The Sustainable Development Goals were adopted by UN member states in 2015. Which year are most of their targets set for?",
          options:[
            { t:"2030", ok:true, why:"The 2030 Agenda." },
            { t:"2025", why:"Some nutrition sub-targets mention 2025, but the goals as a whole aim for 2030." },
            { t:"2050", why:"That’s a common climate-target year, not the SDGs’." },
            { t:"2015", why:"That’s when they were adopted." }],
          hints:["They’re often called the ‘20__ Agenda’.", "Fifteen years after 2015.", "2030."] }
      ],
      refreshers:{
        "Food security components":"Availability (is food there?), accessibility (can people get and afford it?), adequacy (does it meet nutritional needs?), acceptability (is it culturally and personally appropriate?), sustainability (will it last?). See module 19.",
        "Forms of malnutrition":"Stunting is low height for age (long-term); wasting is low weight for height (acute); hidden hunger is missing micronutrients; the double burden is undernutrition and overweight in the same community. See module 21.",
        "Markets and prices":"More supply, or less demand, lowers prices; less supply, or more demand, raises them.",
        // VERIFY: SDG 2 is Zero Hunger.
        "The SDGs":"17 goals adopted in 2015 for 2030. SDG 2 is Zero Hunger."
      }
    }
  },
  explore:{
    heading:"Aid designer",
    intro:"Ruvara (a fictional region) faces a drought. Choose up to three kinds of aid for the season you’re in and see how fast they reach people, what they do to local markets, and what they leave behind.",
    modelTag:"Teaching model",
    // VERIFY: plan note "(verify sources before release)".
    modelNote:"These ratings are a teaching model built on widely reported findings about food aid. They are not measurements.",
    modelFindings:["cash is fast where markets work;", "food must be brought in where markets have failed;", "shipped food is slow and can depress local prices;", "specialized nutrition protects young children;", "resilience projects pay off over time."],
    modes:[{ id:"design", t:"Design" }, { id:"compare", t:"Compare" }, { id:"model", t:"See the model" }],
    sits:[{ id:"S1", t:"Dry season, markets open" }, { id:"S2", t:"Roads cut, markets empty" }, { id:"S3", t:"Rains return (recovery)" }],
    // module-written one-line scene descriptions
    scenes:{ S1:"The town market is full, but prices are high.", S2:"Floods cut the roads; the shops have nothing to sell.", S3:"The rains are back and the harvest is coming." },
    options:OPTIONS,
    levels:{ reach:{ yes:"Yes", partly:"Partly", no:"No" }, mk:{ helps:"Helps", neutral:"Neutral", hurts:"Hurts" }, nut:{ little:"Little", some:"Some", strong:"Strong" }, res:{ low:"Low", medium:"Medium", high:"High" } },
    rows:{ fast:"Fastest arrival", reach:"Reaches the hungry now", mk:"Local farmers and shops", nut:"Young children’s nutrition", res:"Long-term resilience", dig:"Dignity and choice", warn:"Warning" },
    // module-written control text
    msgs:{ replaced:"Up to three kinds of aid: {old} was replaced by {new}.", empty:"Choose at least one kind of aid, then check the package.",
      nofeed:"Nobody is fed now by this package.", nutWeak:"Young children’s nutrition is only {nut}. Add specialized nutrition (A5) if children are at risk.",
      resLow:"Nothing here builds for next season: long-term resilience is Low.", allGood:"This package feeds people now, protects young children, builds resilience and doesn’t hurt local farmers or shops.",
      good:"Strengths: {list}." },
    // P2 reveal: model spending bar. VERIFY: "the pattern reflects research findings".
    spend:{ title:"How families spend the cash", tag:"Model data", parts:[{ t:"Food", v:70 }, { t:"Other essentials", v:25 }, { t:"Other", v:5 }] },
    predictions:[
      { id:"p1", prompt:"Markets in Ruvara’s town are full but prices are high. Which reaches families fastest?",
        options:[{ t:"Cash transfers", ok:true }, { t:"Imported food" }, { t:"Seeds and tools" }, { t:"Food-for-assets" }],
        explain:"Where markets work, cash moves in days and families buy what they need locally.",
        start:{ sit:"S1", pkg:[] }, add:["A3", "A1"] },
      { id:"p2", prompt:"What will families mostly spend the cash on?",
        options:[{ t:"Food and essentials", ok:true }, { t:"Mostly luxuries" }, { t:"Nothing (they’ll save it all)" }, { t:"Imported goods only" }],
        explain:"Families facing hunger mostly buy food and essentials.",
        start:{ sit:"S1", pkg:["A3"] }, add:[] },
      { id:"p3", prompt:"Roads are cut and the shops are empty. What happens if you send only cash?",
        options:[{ t:"Prices rise and families still can’t get food", ok:true }, { t:"Families buy food as usual" }, { t:"Prices fall" }, { t:"Nothing changes" }],
        explain:"Money can’t buy food that isn’t there. When markets fail, food must be brought in.",
        start:{ sit:"S2", pkg:[] }, add:["A3"] },
      { id:"p4", prompt:"Cash is reaching families. What else do young children most likely need?",
        options:[{ t:"Specialized nutrition (A5)", ok:true }, { t:"More cash only" }, { t:"Seeds and tools" }, { t:"Nothing more" }],
        explain:"Children under 5 and pregnant or breastfeeding people have higher nutrient needs; fortified and therapeutic foods target them.",
        start:{ sit:"S1", pkg:["A3"] }, add:["A5"] }
    ],
    challenges:[
      { id:"tc1", goal:[2, 3],
        prompt:"Situation S1 (markets open). Build a package that reaches families within 2 weeks <strong>without</strong> hurting local farmers or shops.",
        why:"Cash (1 week) or vouchers (2 weeks) reach families fast and are spent at local shops.",   // module-written
        msgs:{ a1:"Imported food takes 16 weeks and lowers local prices while markets are open.", a2:"Regional purchase helps farmers but takes 4 weeks.", a5:"Specialized nutrition reaches only targeted groups, in 3 weeks.",
          // module-written
          sit:"Set the situation to S1, Dry season, markets open.", none:"Choose at least one kind of aid.", other:"This package doesn’t reach families within 2 weeks. Check the Fastest arrival row." },
        hints:["Which options take 2 weeks or less?", "Cash (1) and vouchers (2).", "Choose A3 or A4, and leave out A1."] },
      { id:"tc2", goal:[2, 3],
        prompt:"Situation S2 (roads cut, markets empty). Build a package that <strong>reaches families now</strong> and gives <strong>strong</strong> nutrition for young children, <strong>without</strong> pushing prices up.",
        why:"Food bought in the region reaches families now, specialized nutrition protects young children, and no cash or vouchers push prices up.",   // module-written
        msgs:{ cash:"There’s nothing in the shops: cash and vouchers push prices up.", a5:"Children under 5 need specialized nutrition. Check the ‘Young children’s nutrition’ row.", a1:"Imported food takes 16 weeks; food bought in the region arrives in 6.",
          // module-written
          sit:"Set the situation to S2, Roads cut, markets empty.", none:"Choose at least one kind of aid.", other:"Nothing in this package reaches families now. Check the ‘Reaches the hungry now’ row." },
        hints:["Which option reaches families now in S2?", "Only regional purchase (A2) says Yes.", "A2 + A5, with no cash or vouchers."] },
      { id:"tc3", goal:[2, 3], stretch:true,
        prompt:"Situation S3 (rains return). Using <strong>exactly three</strong> options, build a package where: families are reached now; local farmers are helped (nothing hurts them); young children’s nutrition is <strong>Strong</strong>; and long-term resilience is <strong>High</strong>.",
        why:"There are 6 such packages. Each one feeds people now, protects children and builds for next year: the shape of good recovery aid.",
        msgs:{ nofeed:"Strong and High, but nobody is fed now.", a1:"Shipped food arriving at harvest lowers farmers’ prices.", nostrong:"No option gives Strong child nutrition.",
          // module-written
          sit:"Set the situation to S3, Rains return (recovery).", count:"Use exactly three options.", nores:"Long-term resilience isn’t High yet. Add food-for-assets (A6) or seeds and tools (A7)." },
        hints:["Each condition needs a different kind of option.", "Feed now (A2, A3 or A4), nutrition (A5), resilience (A6 or A7): one of each.", "For example A3 + A5 + A7."] }
    ],
    // the plan's "aha"
    blocks:[{ title:"What the designer shows", html:"<p><strong>No single kind of aid is best.</strong> The situation decides: are markets working, who is most at risk, and is this an emergency or a recovery?</p>" }]
  },
  part3:{
    slug:"evaluate", name:"Evaluate", heading:"Evaluate a response",
    // module-written from the plan's rationale
    intro:"The aid designer was about building. Now judge a response someone else made, against explicit criteria and with data, the way real evaluations work.",
    caseTag:"A case written for this module; based on common patterns in drought responses",
    caseTitle:"The 2031 drought response in Ruvara",
    timeline:[
      { id:"c1", when:"March", t:"Rains fail in March." },
      { id:"c2", when:"May", t:"In May, prices in town double and malnutrition screening finds rising wasting among young children." },
      { id:"c3", when:"June", t:"In June, a donor promises imported grain." },
      { id:"c4", when:"September", t:"The grain arrives in September, during the local harvest." },
      { id:"c5", when:"July", t:"A cash program starts in town in July." },
      { id:"c6", when:"Next spring", t:"A seeds program starts the following spring." }
    ],
    stations:[{ id:"timeline", t:"1. Read the timeline" }, { id:"rubric", t:"2. Score the response" }, { id:"data", t:"3. Check it with data" }],
    // Station 1 (plan: label each decision "fits the situation" or "doesn't fit", with one reason chip each).
    // The verdicts, reason chips and feedback are module-written from the plan's model table and case.
    verdicts:[{ id:"fit", t:"Fits the situation" }, { id:"nofit", t:"Doesn’t fit" }],
    decisions:[
      { id:"d3", card:"c3", answer:"nofit",
        reasons:[{ t:"Town markets had food: cash or food bought in the region would arrive sooner", ok:true }, { t:"Shipped food is always the safest help" }, { t:"The town needed seeds before food" }],
        fb:"Town markets were working. Imported grain takes about 16 weeks; cash or regional purchase reaches families sooner." },
      { id:"d4", card:"c4", answer:"nofit",
        reasons:[{ t:"It arrived at harvest and pushed down the prices farmers earn", ok:true }, { t:"It arrived too early, before prices rose" }, { t:"Families in town had no shops to use it in" }],
        fb:"It arrived during the harvest, adding free grain just as farmers needed to sell, so prices fell." },
      { id:"d5", card:"c5", answer:"fit",
        reasons:[{ t:"Town shops had food; families needed money to buy it", ok:true }, { t:"Cash is always the best help everywhere" }, { t:"Cash treats severe wasting in young children" }],
        fb:"Food was in the town’s shops, so cash let families buy it and kept money with local traders." },
      { id:"d6", card:"c6", answer:"fit",
        reasons:[{ t:"Recovery is the time to help farmers replant", ok:true }, { t:"Seeds feed people during the crisis" }, { t:"Seeds replace the need for any other aid" }],
        fb:"Once the rains return, seeds and tools help farmers grow the next harvest and give the aid an end point." }
    ],
    timelineMsgs:{ partial:"Label every decision and choose a reason for each first.", ok:"Every decision is labelled with a reason that fits.", off:"{n} not right yet (marked ✗). Check the case against the aid designer’s model." },   // module-written
    // Station 2: the six criteria (plan wording). Evidence chips and their criterion tags are module-written from the case.
    criteria:[
      { id:"speed", t:"Speed", q:"did help arrive when it was needed?" },
      { id:"need", t:"Need", q:"were those most at risk reached first?" },
      { id:"markets", t:"Markets", q:"did aid protect local farmers and shops?" },
      { id:"dignity", t:"Dignity and choice", q:"did families have a say?" },
      { id:"nutrition", t:"Nutrition", q:"were young children and pregnant people protected?" },
      { id:"resilience", t:"Resilience and exit", q:"does it leave Ruvara stronger, with a plan to end the aid?" }
    ],
    evidence:[
      { id:"ev1", t:"The imported grain arrived in September, four months after prices doubled.", crit:["speed"] },
      { id:"ev2", t:"The cash program reached town families in July.", crit:["speed"] },
      { id:"ev3", t:"Grain prices fell to 30 in September, below the normal 40.", crit:["markets"] },
      { id:"ev4", t:"Cash let town families choose what they bought.", crit:["dignity"] },
      { id:"ev5", t:"Screening in May found rising wasting, but nothing on the timeline targets young children.", crit:["need", "nutrition"] },
      { id:"ev6", t:"The seeds program starts the following spring, so farmers can replant.", crit:["resilience"] }
    ],
    rubricMsgs:{ partial:"Choose a score and a piece of evidence for every criterion first.", match:"That evidence fits {crit}.", off:"That chip is about {about}, not {crit}.",
      total:"Your total: {n} out of 24. There’s no single right total: what matters is that each score rests on evidence about that criterion." },   // module-written
    // Station 3 (plan): model data table and graph.
    prices:{ tag:"Model data", title:"Town grain price per month", normal:40,
      rows:[{ m:"Mar", v:40 }, { m:"May", v:80 }, { m:"Jul", v:76 }, { m:"Sep", v:30, note:"imported grain arrives with the harvest" }, { m:"Nov", v:34 }],
      ask:"What happened to farmers selling their harvest in September?",
      // the correct line is the plan's feedback (its internal "(M7-style market displacement)" tag is left out); distractors module-written
      choices:[
        { t:"They sold below the normal price, so they earned less", ok:true, fb:"Prices fell to 30, below the normal 40, just as farmers needed to sell." },
        { t:"They earned more, because the drought had ended", fb:"30 is below the normal 40: each sack earned less." },
        { t:"Prices were back to normal", fb:"The normal price is 40; September’s 30 is below it." },
        { t:"Prices were still at crisis levels", fb:"Prices fell from 76 in July to 30 in September." }] },
    quickCheck:{
      title:"Evaluate a response quick check", summary:"Evaluate a response quick check",
      // Correct-choice lines are module-written ("Right." + the plan's feedback line).
      items:[
        { id:"q1", goal:2, prompt:"Which decision in the case hurt local farmers most?",
          choices:[{ t:"Imported grain arriving in September", ok:true, fb:"Right. It arrived with the harvest and pushed prices below normal." }, { t:"Cash in July", fb:"It arrived with the harvest and pushed prices below normal." }, { t:"Screening in May", fb:"It arrived with the harvest and pushed prices below normal." }, { t:"Seeds in spring", fb:"It arrived with the harvest and pushed prices below normal." }] },
        { id:"q2", goal:5, prompt:"Which criterion asks whether families had a say in what they received?",
          choices:[{ t:"Dignity and choice", ok:true, fb:"Right. Cash and vouchers rate high on choice." }, { t:"Speed", fb:"Cash and vouchers rate high on choice." }, { t:"Resilience", fb:"Cash and vouchers rate high on choice." }, { t:"Markets", fb:"Cash and vouchers rate high on choice." }] },
        { id:"q3", goal:3, prompt:"Rising wasting in May called most urgently for…",
          choices:[{ t:"Specialized nutrition for young children", ok:true, fb:"Right. Wasting is acute and dangerous for young children." }, { t:"Seeds and tools", fb:"Wasting is acute and dangerous for young children." }, { t:"Food-for-assets", fb:"Wasting is acute and dangerous for young children." }, { t:"A new road", fb:"Wasting is acute and dangerous for young children." }] },
        { id:"q4", goal:2, prompt:"Grain price fell from 80 in May to 30 in September. By how much did it fall?",
          choices:[{ t:"50", ok:true, fb:"Right. 80 − 30 = 50 (a fall of more than half)." }, { t:"30", fb:"80 − 30 = 50 (a fall of more than half)." }, { t:"110", fb:"80 − 30 = 50 (a fall of more than half)." }, { t:"2.7", fb:"80 − 30 = 50 (a fall of more than half)." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"fits", type:"sorter", title:"Which aid fits?", summary:"Which aid fits?", goal:[1, 3], noun:"situation", txt:true,
        instruction:"Tap a situation, then the aid that fits it best under the module’s model.",
        boxes:[{ id:"a1", label:"A1 Imported food", sub:"shipped from abroad" }, { id:"a2", label:"A2 Regional purchase", sub:"bought in the region" }, { id:"a3", label:"A3 Cash transfers", sub:"by mobile phone" }, { id:"a4", label:"A4 Vouchers", sub:"spent at local shops" },
          { id:"a5", label:"A5 Specialized nutrition", sub:"fortified and therapeutic foods" }, { id:"a6", label:"A6 Food-for-assets", sub:"paid work building assets" }, { id:"a7", label:"A7 Seeds and tools", sub:"for the next planting" },
          { id:"meals", label:"School meals", sub:"a classic form of project aid" }],
        items:[
          fit("i1", "A city’s markets are full; a factory closed and 3000 families lost income.", "a3", "a1", "Markets work; cash is faster and supports shops.", "Markets are full: families need income to buy food there.", "Markets work, so cash reaches families in about a week and supports local shops.", 3),
          fit("i2", "A remote valley is cut off by landslides; shops are empty.", "a2", "a3", "Nothing to buy.", "The shops are empty and the valley is cut off: food has to be brought in, and soon.", "Food bought in the region can be trucked in; cash can’t buy what isn’t there.", 3),
          fit("i3", "Clinic screening finds many young children with severe wasting.", "a5", "a3", "Severe wasting needs therapeutic food under medical guidance.", "Severe wasting in young children needs targeted, specialized help.", "Therapeutic and fortified foods treat and prevent wasting in young children.", 3),
          fit("i4", "Rains have returned; farmers lost their seed stock.", "a7", "a1", "It would arrive at harvest and lower prices.", "The rains are back: what do farmers need to grow the next harvest?", "Seeds and tools let farmers replant now that the rains are back.", 3),
          fit("i5", "A donor worries families will ‘waste’ cash; markets are working and shops accept paper vouchers.", "a4", "a1", "Vouchers keep spending on food and still use local shops.", "Markets work, and the donor wants spending kept on food.", "Vouchers are spent on food at local shops, so spending stays on food and still supports traders.", 1),
          fit("i6", "A recovering district wants to build water catchments before next dry season.", "a6", "a7", "Water infrastructure is an asset-building project.", "This is about building something that lasts before the next dry season.", "Food-for-assets pays people to build water catchments: a recovery project.", 1),
          fit("i7", "Children’s school attendance has dropped because of hunger; markets work.", "meals", "a7", "School meals feed children and support attendance.", "Hunger is keeping children out of school.", "School meals feed children and support attendance: a classic form of project aid.", 1),
          fit("i8", "A war blocks all regional trade, and no nearby region has a surplus.", "a1", "a3", "When there’s no food anywhere nearby, it must be shipped in.", "There’s no food anywhere nearby: it has to come from farther away.", "When no nearby region has food to sell, it must be shipped in.", 3)
        ] },
      // ★ set (plan: model data table; D1–D4 ★ per the plan's goal line, D5 and D6 above Final Check level). D2, D4 and D6 are N4
      // number entries that accept ±0.05 (plan §5). D1, D3 and D5 are tap answers: the plan's answer and feedback, with
      // module-written distractors. Hints are module-written except D6's (plan).
      // VERIFY (plan): "model data, rounded for practice; real FAO figures differ, verify before release".
      { id:"sdg", type:"custom", title:"Reading progress on SDG 2", summary:"Reading progress on SDG 2", star:true, goal:[4, 5],
        instruction:"Use the table to answer each question. Items marked ★ are non-routine; D5 is an inquiry item.",
        how:"Tap an answer or type a number, then press Check. Each item has three levels of help.",
        tableTag:"Model data, rounded for practice; real FAO figures differ",
        tableCaption:"Prevalence of undernourishment (% of population)",
        head:["Region", "2015", "2019", "2023"],
        rows:[["Region North", "8", "7", "7"], ["Region Central", "20", "18", "22"], ["Region South", "12", "10", "9"]],
        items:[
          { id:"d1", goal:4, prompt:"Which region’s undernourishment was <strong>higher</strong> in 2023 than in 2015?",
            options:[
              { t:"Central", ok:true, why:"20 → 22: up 2 points." },
              { t:"North", why:"North went from 8 to 7: down 1 point." },
              { t:"South", why:"South went from 12 to 9: down 3 points." },
              { t:"None of them", why:"Compare each region’s 2015 and 2023 columns: one went up." }],
            hints:["Compare the 2015 and 2023 columns, one row at a time.", "North 8 → 7, South 12 → 9. What about Central?", "Central: 20 → 22, up 2 points."] },
          { id:"d2", goal:4, kind:"num", prompt:"South fell from 12% to 9% over 8 years. Average fall per year?",
            answer:0.375, tol:0.05, unit:"points a year", label:"Average fall:", display:"0.375 points a year (about 0.4)",
            why:"3 ÷ 8 = 0.375, not 3 per year.",
            wrong:[{ match:3, fb:"3 ÷ 8, not 3 per year." }, { match:0.5, fb:"2015 to 2023 is 8 years, not 6." }],
            hints:["How many points did it fall, and over how many years?", "3 points over 8 years.", "3 ÷ 8 = 0.375 points a year."] },
          { id:"d3", goal:[4, 5], star:true, prompt:"A headline says ‘Hunger is falling everywhere.’ Is it supported?",
            options:[
              { t:"No: Central rose after 2019", ok:true, why:"One region rising is enough to make ‘everywhere’ false." },
              { t:"Yes: two of the three regions fell", why:"‘Everywhere’ means every region, and Central rose." },
              { t:"Yes: the average of the three regions fell", why:"An average can hide a region that is getting worse." },
              { t:"No: every region rose", why:"North and South fell; only Central rose." }],
            hints:["‘Everywhere’ is a claim about every region.", "Look at Central from 2019 to 2023.", "18 → 22: Central rose, so ‘everywhere’ is false."] },
          { id:"d4", goal:4, star:true, kind:"num", prompt:"If South keeps falling at 0.375 points a year from 2023, about what will it be in 2030?",
            answer:6.375, tol:0.05, unit:"%", label:"South in 2030:", display:"about 6.4%",
            why:"9 − 7 × 0.375 = 6.375.",
            wrong:[{ match:5.5, fb:"That uses 0.5 points a year; South’s rate is 0.375." }, { match:2.625, fb:"That’s how much it falls (7 × 0.375). Subtract it from 9." }, { match:6, fb:"That uses 8 years; 2023 to 2030 is 7." }],
            hints:["How many years from 2023 to 2030?", "7 years × 0.375 points a year.", "9 − 7 × 0.375 = 6.375, about 6.4%."] },
          { id:"d5", goal:[4, 5], star:true, inquiry:true, prompt:"Which source would you trust most for global SDG 2 progress?",
            options:[
              { t:"The FAO’s annual <em>State of Food Security and Nutrition in the World</em> report", ok:true, why:"A UN agency report with stated methods and data, vs a blog or a fundraising ad." },
              { t:"A personal blog about world hunger", why:"A blog rarely states its methods or data sources." },
              { t:"A fundraising advertisement", why:"It’s written to raise money, not to report data with stated methods." },
              { t:"A social media post with a striking chart", why:"You can’t check where its numbers came from." }],
            hints:["Which source states its methods and data?", "Think about who publishes it and why.", "The FAO’s annual report: a UN agency with stated methods and data."] },
          { id:"d6", goal:[4, 5], star:true, kind:"num", prompt:"Central’s population grew from 50 million to 60 million over the period. Did the <strong>number</strong> of undernourished people rise more or less than the percentage suggests? Work out the 2023 number to decide.",
            answer:13.2, tol:0.05, unit:"million", label:"Undernourished people in Central, 2023:", display:"13.2 million",
            why:"More: from 10 million to 13.2 million. Percentages hide population growth: 20% of 50 M = 10 M; 22% of 60 M = 13.2 M.",
            wrong:[{ match:11, fb:"That uses the 2015 population. Central grew to 60 million." }, { match:10, fb:"That’s the 2015 number: 20% of 50 million." }, { match:2, fb:"That’s the change in percentage points. Convert the percentage to people." }],
            hints:["Convert each percentage to a number of people.", "20% of 50 million, then 22% of 60 million.", "10 M → 13.2 M: up 3.2 million."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Yvette", goal:[1, 3, 4], how:"",
        instruction:"Yvette made one mistake in each answer. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Ruvara’s town markets are full, but prices have doubled. Recommend aid.",
            steps:["“The problem is that families can’t afford food that is in the shops.”", "“So the best response is to ship grain from overseas.”", "“The grain will arrive in about four months.”", "“Families will then have enough food.”"],
            answer:1, stepFb:["Step 1 is correct: access, not availability.", "", "Step 3 follows step 2. The mistake is earlier.", "The mistake is earlier."],
            fixes:[
              { t:"“Give cash or vouchers so families can buy from local shops now; this also supports local traders.”", ok:true, why:M1 },
              { t:"“Ship more grain so it arrives faster.”", why:"It still takes months and lowers local prices." },
              { t:"“Give seeds instead.”", why:"Seeds don’t feed people now." },
              { t:"Step 2 is correct.", why:"Markets are working; the problem is affordability." }],
            hints:["Is there food in the shops?", "Yes, so what do families need?", "Money or vouchers to buy it."] },
          { id:"e2", goal:4, task:"Undernourishment fell from 12% (2017) to 9% (2023). Is the region on track to reach 0% by 2030?",
            steps:["“The fall is 12 − 9 = 3 percentage points.”", "“That’s 3 points per year.”", "“So it will reach 0% in 3 more years, by 2026.”", "“So the region is ahead of schedule.”"],
            answer:1, stepFb:["Step 1 is correct.", "", "Step 3 follows step 2. The mistake is earlier.", "The mistake is earlier."],
            fixes:[
              { t:"“The 3 points fell over 6 years, so 0.5 points per year. At that rate, 2030 is about 5.5%: not on track.”", ok:true, why:M6 },
              { t:"“It’s 3% of 12%, so 0.36 points.”", why:"Percentage points, not percent of a percent." },
              { t:"“Divide by 2030.”", why:"Divide by the number of years." },
              { t:"Step 2 is correct.", why:"2017 to 2023 is 6 years." }],
            hints:["Over how many years did it fall?", "6 years: 3 ÷ 6.", "0.5 per year → 9 − 7 × 0.5 = 5.5% in 2030."] },
          { id:"e3", goal:1, task:"Choose aid for the first weeks of an acute famine, with many sick and elderly people.",
            steps:["“People need food immediately.”", "“Food-for-work will feed people while building roads.”", "“Everyone who works gets a daily ration.”", "“So everyone will be fed.”"],
            answer:1, stepFb:["Step 1 is correct.", "", "Step 3 follows step 2. The mistake is earlier.", "The mistake is earlier."],
            fixes:[
              { t:"“In an acute emergency, give unconditional help first (food or cash, depending on markets) plus nutrition for young children. Food-for-assets can come in recovery.”", ok:true, why:M7 },
              { t:"“Make the work shorter.”", why:"Sick and elderly people, and caregivers, still can’t take part." },
              { t:"“Pay in cash instead of food.”", why:"It still excludes people who can’t work." },
              { t:"Step 2 is correct.", why:"It leaves out the people most at risk." }],
            hints:["Who can’t work in a famine?", "Sick and elderly people, young children, caregivers.", "Unconditional help first."] }
        ] }
    ]
  },
  reflect:{
    // Plan §5 build notes: "Canada's role" information card. VERIFY each line before release: Canada untied its food aid in
    // 2008; the Canadian Foodgrains Bank is a partnership of Canadian church-based agencies; the UN World Food Programme won
    // the 2020 Nobel Peace Prize. VERIFY the reference list (APA 7; authors, years and titles) against the current reports.
    blocks:[{ title:"Canada’s role",
      html:"<ul><li>Canada untied its food aid in 2008, allowing aid food to be bought outside Canada, often near the crisis.</li><li>The Canadian Foodgrains Bank is a partnership of Canadian church-based agencies.</li><li>The UN World Food Programme won the 2020 Nobel Peace Prize.</li></ul>" +
        '<p class="tiny">For your action plan, look for an <strong>established humanitarian organization with transparent reporting</strong>; this module doesn’t recommend any one charity.</p>' +
        // VERIFY: reference entries (module-supplied from the plan's named sources: the FAO report and the UN 2030 Agenda).
        '<p class="tiny"><strong>Sources to cite (APA 7)</strong></p><ul class="hfa-refs">' +
        "<li>FAO, IFAD, UNICEF, WFP, &amp; WHO. (2024). <i>The state of food security and nutrition in the world 2024</i>. Food and Agriculture Organization of the United Nations.</li>" +
        "<li>United Nations General Assembly. (2015). <i>Transforming our world: The 2030 Agenda for Sustainable Development</i> (A/RES/70/1). United Nations.</li></ul>" }],
    journal:[
      { id:"j1", q:"What surprised you in the aid designer: that cash can be faster than food, or that aid can hurt local farmers?" },
      { id:"j2", q:"In your own words, explain why ‘what does this situation need, for whom, and when?’ matters more than ‘what kind of aid is best?’" },
      { id:"j3", q:"Explain to a friend why a headline about SDG 2 progress might mislead, using one number from this module." },
      { id:"j4", q:"Action plan: choose one realistic action you could take: write to your MP about Canada’s food-aid policy, organize a fundraiser for an established humanitarian organization, volunteer locally, or share reliable information. What would you do first, and how would you know it helped?" }
    ]
  },
  final:{
    // Options without feedback in the plan use its misconception sentences (M1–M7) or a module-written line; correct-option
    // lines without plan text are module-written.
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Food given to children at school to support both nutrition and attendance is an example of…", options:[
          { t:"Project aid", ok:true, why:"Food for a specific program or project." },
          { t:"Emergency aid", why:"Emergency aid responds to a crisis; school meals are a longer-term project." },
          { t:"Program aid", why:"Program aid goes government to government, often sold for budget support." },
          { t:"Food sovereignty", why:"A different idea: control over food systems (module 20)." }] },
        b:{ prompt:"Food or cash given to people who build water catchments is called…", options:[
          { t:"Food-for-assets (food-for-work)", ok:true, why:"Aid linked to building community assets." },
          { t:"Program aid", why:"Program aid is government to government." },
          { t:"Specialized nutrition", why:"That targets young children and pregnant or breastfeeding people." },
          { t:"A voucher program", why:"Vouchers are spent at shops; they aren’t tied to work." }] } },
      // VERIFY: the official SDG 2 wording (a) and Target 2.3 (b).
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"SDG 2 is best summarized as…", options:[
          { t:"End hunger, achieve food security and improved nutrition, and promote sustainable agriculture", ok:true, why:"That’s SDG 2, Zero Hunger." },
          { t:"Ensure clean water and sanitation for all", why:"That’s SDG 6." },
          { t:"End poverty in all its forms", why:"That’s SDG 1; related, but a different goal." },
          { t:"Take urgent action on climate change", why:"That’s SDG 13." }] },
        b:{ prompt:"Which is a target under SDG 2?", options:[
          { t:"Double the agricultural productivity and incomes of small-scale food producers", ok:true, why:"That’s Target 2.3." },
          { t:"Ensure universal access to affordable electricity", why:"That’s SDG 7." },
          { t:"Achieve gender equality in leadership", why:"That’s SDG 5." },
          { t:"Reduce road traffic deaths", why:"That’s SDG 3." }] } },
      // VERIFY: K3a "studies of cash transfers" (plan "verify sources").
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"What do studies of cash transfers in food crises generally find families spend most of the money on?", options:[
          { t:"Food and other essentials", ok:true, why:"Families meet urgent needs first." },
          { t:"Mostly luxury items", why:"Not what the evidence shows." },
          { t:"Mostly savings", why:"Hungry families spend on immediate needs." },
          { t:"Mostly imported goods", why:"Spending is mostly local." }] },
        b:{ prompt:"Why do many agencies prefer cash or vouchers when local markets are working?", options:[
          { t:"They reach families faster, give choice, and support local shops and farmers", ok:true, why:"Speed, choice and local markets all point the same way when markets work." },
          { t:"Cash is always cheaper to print", why:"Cost of delivery and speed matter, not printing." },
          { t:"Families can’t be trusted with food", why:"Not the reason." },
          { t:"Shipping food is illegal", why:"It isn’t illegal; it’s slower and can hurt local markets." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Ruvara’s town has full markets but high prices; its remote villages have empty shops after a road washout. Which plan fits best?", options:[
          { t:"Cash or vouchers in town; food bought in the region and trucked to the villages", ok:true, why:"Markets work in town, not in the villages." },
          { t:"Cash everywhere", why:"The villages have nothing to buy." },
          { t:"Imported food everywhere", why:"Slow, and it undercuts the town market." },
          { t:"Seeds and tools everywhere", why:"Seeds don’t feed people now." }] },
        b:{ prompt:"A city has working markets but job losses; a camp nearby has no market access. Which plan fits best?", options:[
          { t:"Cash in the city; in-kind food plus specialized nutrition in the camp", ok:true, why:"Markets work in the city; the camp has none, so food must be brought in." },
          { t:"Vouchers everywhere", why:"The camp has no shops." },
          { t:"Imported food everywhere", why:"Slow in the city, where markets work." },
          { t:"Food-for-assets everywhere", why:"In an emergency, people who can’t work would miss out." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"Model data: a region’s grain price is 40 normally, 80 during a drought, and 30 the month imported grain arrives at harvest. What’s the best interpretation?", options:[
          { t:"The imported grain pushed prices below normal just as local farmers were selling their harvest", ok:true, why:"Market displacement." },
          { t:"The drought ended, so prices fell to normal", why:"30 is below the normal 40." },
          { t:"Farmers earned more because prices fell", why:"Lower prices mean lower earnings per sack." },
          { t:"The data shows imported aid always helps farmers", why:"It shows the opposite here." }] },
        b:{ prompt:"Model data: maize normally sells for 50; during a crisis 90; then 45 after a regional-purchase program buys from nearby farmers. What’s the best interpretation?", options:[
          { t:"Prices came back to about normal without collapsing below it; buying regionally supported farmers", ok:true, why:"45 is close to the normal 50." },
          { t:"The program caused a price crash", why:"45 is near normal, not a crash." },
          { t:"Prices stayed at crisis levels", why:"90 → 45." },
          { t:"Regional purchase always raises prices", why:"Not here." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"Model data: undernourishment fell from 20% in 2015 to 16% in 2023. At the same average rate, about where will it be in 2030?", options:[
          { t:"About 12.5%: not on track for near-zero", ok:true, why:"4 points in 8 years = 0.5/year; 16 − 7 × 0.5 = 12.5." },
          { t:"About 0%", why:"That assumes 4 points per year." },
          { t:"About 16%", why:"It’s still falling." },
          { t:"About 8%", why:"That would need 8 points in 7 years." }] },
        b:{ prompt:"Model data: wasting fell from 10% in 2016 to 7% in 2022. At the same rate, about where will it be in 2030?", options:[
          { t:"About 3%", ok:true, why:"3 points in 6 years = 0.5/year; 7 − 8 × 0.5 = 3." },
          { t:"About 0%", why:"That assumes 3 points a year, not 3 points in 6 years." },
          { t:"About 7%", why:"It’s still falling." },
          { t:"About 5.5%", why:"That uses 0.25/year." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the clearest explanation of why imported food can harm a farming region?", options:[
          { t:"“If shipped food arrives when local farmers are selling their harvest, it adds supply and reduces demand, so prices and farmers’ incomes fall.”", ok:true, why:"It names the timing, the supply and demand shift, and the effect on farmers." },
          { t:"“Imported food is always lower quality.”", why:"Quality isn’t the main issue." },
          { t:"“Farmers don’t like foreign food.”", why:"It’s about prices, not preference." },
          { t:"“It never harms anyone because it’s free.”", why:"Free food still changes what people buy: arriving at harvest, it pushes farmers’ prices down." }] },
        b:{ prompt:"Which is the clearest explanation of why cash doesn’t help when markets are empty?", options:[
          { t:"“With no food to buy, extra money doesn’t create food; it mostly drives prices up.”", ok:true, why:"Money can’t buy food that isn’t there." },
          { t:"“Families would waste the cash.”", why:M2 },
          { t:"“Cash is illegal in emergencies.”", why:"Not true." },
          { t:"“Cash always arrives too slowly.”", why:"Cash is fast; the problem is that there’s nothing to buy." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which evaluation statement is best supported and uses the criteria correctly?", options:[
          { t:"“The cash program scored well on speed and dignity, but the September grain shipment scored poorly on markets because it arrived at harvest and prices fell below normal.”", ok:true, why:"Each judgment names a criterion and the evidence for it." },
          { t:"“The response was bad because aid causes dependency.”", why:"Unsupported generalization." },
          { t:"“The response was perfect because people received food.”", why:"It ignores timing and market effects." },
          { t:"“The seeds program was too slow, so all aid failed.”", why:"One weakness doesn’t decide every criterion." }] },
        b:{ prompt:"Which statement best uses evidence to judge resilience?", options:[
          { t:"“The seeds program and water catchments leave the region better prepared for the next dry season, so resilience scores high, even though they don’t feed people right away.”", ok:true, why:"It ties the score to evidence about the next season." },
          { t:"“Resilience is high because lots of food was shipped.”", why:"Shipped food doesn’t build long-term capacity." },
          { t:"“Resilience doesn’t matter in emergencies.”", why:"It matters for the exit plan." },
          { t:"“Any aid builds resilience.”", why:"Not automatically." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A Grade 12 club wants to help people facing a food crisis abroad. Which plan is most likely to help?", options:[
          { t:"Raise money for an established humanitarian organization with transparent reporting, and write to their MP about food-aid policy", ok:true, why:"Cash donations let experienced agencies buy what fits (often locally); advocacy shapes policy." },
          { t:"Collect canned food in Canada and ship it overseas", why:"Slow and costly, and it may not fit local needs or markets." },
          { t:"Post on social media without checking the facts", why:"Unverified posts can spread misinformation." },
          { t:"Send seeds by mail", why:"Seeds must suit local conditions and rules." }] },
        b:{ prompt:"Which local action best addresses food insecurity in your own community?", options:[
          { t:"Volunteer with or fundraise for an established local program, and support policy changes that address income", ok:true, why:"Food insecurity in Canada is closely tied to income (module 19)." },
          { t:"Tell families to budget better", why:"Blames individuals; ignores income." },
          { t:"Collect only expensive specialty foods", why:"Food programs usually need staples and funds, not specialty items." },
          { t:"Do nothing, because it’s a global problem", why:"Local action matters." }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"In a refugee camp with no markets, screening finds many children with severe wasting. Which combination fits best?", options:[
          { t:"In-kind food rations plus specialized therapeutic nutrition for young children", ok:true, why:"No markets → in-kind; severe wasting → therapeutic food." },
          { t:"Cash only", why:"No market to spend it in." },
          { t:"Seeds and tools only", why:"Doesn’t feed people now." },
          { t:"Food rations only", why:"Children with severe wasting need specialized treatment." }] },
        b:{ prompt:"After a cyclone, a coastal town’s shops reopen within a week, but many pregnant people and young children are at risk. Which combination fits best?", options:[
          { t:"Cash or vouchers for households plus specialized nutrition for pregnant people and young children", ok:true, why:"Shops work again, so cash or vouchers fit; at-risk groups also need targeted nutrition." },
          { t:"Imported food only", why:"Shops have reopened; imported food is slow." },
          { t:"Cash only", why:"At-risk groups need targeted nutrition too." },
          { t:"Food-for-assets only", why:"Not in the first weeks." }] } }
    ]
  },
  task:{
    title:"Two places, one plan", summary:"Two places, one plan",
    statement:"<p>Ruvara’s drought response needs a plan for <strong>two places</strong> and <strong>two phases</strong>. Design one that meets every condition. There’s more than one good answer.</p>" +
      '<blockquote class="fai-sit"><p><strong>Situation:</strong> the town’s markets are working but prices are high; the remote villages’ shops are empty because the road is washed out; screening shows rising wasting among young children.</p></blockquote>',
    checks:["Town: help that uses working markets", "Villages: food that can arrive within 6 weeks without needing a market", "Young children and pregnant people protected", "Recovery builds resilience",
      "Targets: one for hunger or malnutrition, one for producers or sustainability", "Justification"],
    tips:["Town markets work: cash or vouchers reach families fastest and support shops.", "Village shops are empty: cash won’t help. Imported food takes 16 weeks. Food bought in the region arrives in 6.",
      "Rising wasting means young children need specialized nutrition.", "Recovery is the time for seeds, tools or water projects.",
      "Pick one target about people’s hunger or nutrition and one about farmers or sustainability.", "Explain your choices using the criteria words."],
    explainPrompt:"Explain why the town and the villages need different kinds of help, and how your recovery choice ends the need for aid.",
    vocab:"Use the words local market, targeting, resilience and dignity.",
    checkLabel:"Check my plan",
    success:"Your plan meets every line of the checklist.",   // module-written
    more:"There’s more than one good plan. Can you find another?",   // module-written
    town:["A1", "A2", "A3", "A4"], villages:["A1", "A2", "A3", "A4"], phase2:["A1", "A2", "A3", "A6", "A7"],
    targets:TARGETS,
    // plan line 6: at least two of these words (matching allows plurals and close forms; module-written patterns in app.js)
    words:["local market", "dignity", "resilience", "targeting", "dependency"],
    justLabel:"Justification (80–200 words)",   // module-written
    modelsTitle:"Three model plans and a sample justification",   // module-written
    models:[
      { title:"Plan 1", text:"Town A3 (cash); villages A2; nutrition yes; recovery A7 (seeds and tools); targets 2.2 and 2.3." },
      { title:"Plan 2", text:"Town A4 (vouchers); villages A2; nutrition yes; recovery A6 (water catchments); targets 2.1 and 2.4." },
      { title:"Plan 3", text:"Town A3; villages A2; nutrition yes; recovery A6; targets 2.2 and 2.4." },
      { title:"Sample justification (Plan 1)", text:"In town, food is in the shops but families can’t afford it, so cash transfers reach them in about a week and keep money in the local market. Villages have empty shops, so cash would only push prices up; food bought in the region can arrive within six weeks. Because screening shows rising wasting, specialized nutrition targets young children and pregnant people first. After the rains, seeds and tools help farmers replant, which builds resilience and gives the aid a clear end, reducing dependency. These choices serve SDG target 2.2 on malnutrition and target 2.3 on small-scale producers’ incomes." }
    ]
  },
  cards:[
    ["Emergency aid", "Food or cash in a crisis (drought, conflict, disaster) to save lives now."],
    ["Program aid", "Food given government to government, often sold to support the budget."],
    ["Project aid", "Food for a specific program: school meals, food-for-assets, nutrition programs."],
    ["Local or regional purchase", "Buying aid food near the crisis: faster, and it supports nearby farmers."],
    ["Cash transfers and vouchers", "Money or vouchers so families buy what they need: fast and dignified when markets work."],
    ["Market displacement", "Aid food that lowers the prices local farmers earn, e.g. arriving at harvest."],
    ["Specialized nutrition", "Fortified foods and therapeutic foods for young children, and pregnant or breastfeeding people."],
    ["Food-for-assets", "Aid tied to building community assets (water, soil); best in recovery, not acute crises."],
    ["Resilience", "A community’s ability to withstand the next shock: seeds, water, savings, markets."],
    ["SDG 2", "Zero Hunger: end hunger and malnutrition, raise small-scale farmers’ incomes, sustainable food systems, by 2030."],
    ["“On track?”", "Compare the average yearly change with what’s needed to reach the 2030 target."],
    ["The key question", "What does this place need, for whom, and when?"]
  ]
};
