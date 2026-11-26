// HFA4U 25 Ethical Food Choices (course capstone). Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/25-ethical-food-choices.md
// Teacher notes: lines marked VERIFY carry the plan's "(verify)" / "verify before release" flags (students see the plan's
// wording without them) and every value or line this module had to supply. "module-written" marks text that isn't in the plan.
// Module rules (plan §1, §5, §6): value questions test the quality of reasoning, never which value a student holds; no moral
// labels for food; culture and religion are filters, never scores; the food philosophy may be written as a hypothetical self.
// VERIFY (plan §6.4, applies to the whole module): every emissions pattern, label standard and price comparison.
// VERIFY: the compass ratings are the plan's teaching summary, not measurements (plan §6.1).

// Misconception core sentences (plan §3); "(verify)" flags moved to these comments.
// VERIFY: M2 (production vs transport), M7 (label standards).
const M1 = "People weight values differently and face different constraints. The same evidence can support different reasonable choices.";
const M2 = "For most foods, how a food is produced matters more than how far it travels. A heated winter greenhouse can out-emit a field crop trucked in.";
const M3 = "Schools, hospitals, stores and governments shape what’s on offer. Institutional choices reach thousands of people.";
const M4 = "Choices are shaped by income, access, culture and time. Judge arguments and systems, not people’s plates.";
const M5 = "A fact can be tested with evidence; a value says what matters or what we should do.";
const M6 = "“Natural” is not a reason by itself. Ask what evidence shows about effects.";
const M7 = "A label certifies specific standards. Check what the certifier requires.";
const M8 = "Practices like halal, kosher or vegetarianism are constraints to respect. The compass filters options; it never scores a family’s faith against price.";

// Practice 1 sorter helper: plan feedback for the most likely wrong box; the other wrong box gets a module-written line.
const SORT_H1 = "Find any <em>should</em>, <em>ought</em>, <em>better</em> or <em>matters</em>.";
const SORT_H2 = "Is there also a checkable claim?";
const BOXN = { fact:"Factual claim", value:"Value judgement", both:"Both" };
function fv(id, t, answer, why, wrong){ return { id, t, answer, why, wrong, hints:[SORT_H1, SORT_H2, BOXN[answer] + ". " + why] }; }

export default {
  id:"25-ethical-food-choices",
  kind:"topic",
  title:"Ethical food choices",
  topic:"Ethical Food Choices",
  readyTopic:"ethical food choices",
  hero:{
    eq:"Same groceries, different values: <strong>what matters most to you, and why?</strong>", eqSize:"sm",
    eqLabel:"Same groceries, different values: what matters most to you, and why?",
    headline:"Eating is an ethical act, and a personal one",
    text:"Every food choice touches the <strong>environment</strong>, <strong>animals</strong>, the <strong>people who grow and pick</strong> our food, <strong>local economies</strong>, our <strong>health</strong>, our <strong>budget</strong> and our <strong>traditions</strong>. No single choice wins on everything. This module helps you <strong>weigh</strong> what matters, keep <strong>facts</strong> and <strong>values</strong> straight, respect the <strong>constraints</strong> other people live with, and build a food philosophy you can defend.",
    fig:{ html:'<div class="efc-hero" id="efc-hero"></div>', caption:"" },
    // module-written description of the plan's storyboard
    aria:"A grocery basket holds five protein options: beef, lentils, lake fish, tofu and eggs. A compass with eight labelled spokes appears beside it. When the Environment spoke lengthens, lentils rise to the top of the ranking. When the Convenience spoke lengthens instead, eggs rise to the top.",
    caption:"Change what matters, and the “best” choice changes."
  },
  goals:[
    "I can separate factual claims from value judgements in food debates.",
    "I can explain the main ethical dimensions of food choices and what common labels do and don’t certify.",
    "I can analyse trade-offs and show how weighting values differently changes the “best” choice.",
    "I can respect how culture, religion, income and access shape food choices, and I avoid moralizing individuals.",
    "I can build a claim–evidence–reasoning argument on a food-ethics question, including a counterargument.",
    "I can state and defend a personal food philosophy."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Facts vs values", goal:1,
          prompt:"Which statement is a <strong>value judgement</strong>?",
          options:[
            { t:"“Animals raised for food should be able to go outdoors.”", ok:true, why:"It says what <em>should</em> be: a value." },
            // VERIFY: life-cycle data on beef vs lentils.
            { t:"“Beef production usually emits more greenhouse gas per kilogram than lentils.”", why:"That can be tested with life-cycle data." },
            { t:"“Dried lentils usually cost less per serving than beef in Canadian stores.”", why:"Testable with price data." },
            // VERIFY: fair-trade minimum price.
            { t:"“Fair-trade certification includes a minimum price for producers.”", why:"Testable by reading the standard." }],
          hints:["Look for <em>should</em>, <em>ought</em>, <em>better</em>.", "Which one can’t be settled by data alone?", "“Animals raised for food should be able to go outdoors.”"] },
        { id:"w2", skill:"Facts vs values", goal:1,
          prompt:"Which statement is a <strong>testable factual claim</strong>?",
          options:[
            // VERIFY: farm stage dominates emissions.
            { t:"“Most of a typical food’s emissions come from the farm stage, not transport.”", ok:true, why:"Life-cycle studies can test it." },
            { t:"“Eating local is the right thing to do.”", why:"A value." },
            { t:"“Everyone should care about animal welfare.”", why:"A value." },
            { t:"“Food tastes better when it’s homemade.”", why:"A matter of taste, not testable as a general fact." }],
          hints:["Could a study check it?", "Which is about measurable emissions?", "“Most of a typical food’s emissions come from the farm stage, not transport.”"] },
        { id:"w3", skill:"Food and the environment", goal:2,
          prompt:"For most foods, which stage contributes the <strong>largest</strong> share of greenhouse-gas emissions?",
          options:[
            // VERIFY: production usually the largest share (module 22).
            { t:"Production on the farm, including land use", ok:true, why:"Usually the largest share (module 22)." },
            { t:"Transport", why:"Usually a small share, except for air-freighted foods." },
            { t:"Packaging", why:"Usually smaller than production." },
            { t:"The grocery store", why:"Small compared with production." }],
          hints:["Recall module 22’s chart.", "Where are land, animals and fertilizer?", "The farm."] },
        { id:"w4", skill:"Fair trade and labour", goal:2,
          prompt:"What does fair-trade certification mainly aim to provide producers?",
          options:[
            // VERIFY: the current fair-trade standard. Correct-answer line module-written.
            { t:"A minimum price and an extra premium for community or business projects", ok:true, why:"A floor price plus a premium is the core of the standard." },
            { t:"A guaranteed high wage for every worker on every farm", why:"It sets standards for certified producers and cooperatives; it doesn’t guarantee every wage everywhere." },
            { t:"Organic certification", why:"Different label." },
            { t:"Free shipping to Canada", why:"Not part of it." }],
          hints:["Think about what producers are paid.", "A floor price and a bonus.", "A minimum price and an extra premium for community or business projects."] },
        { id:"w5", skill:"Access and cost", goal:4,
          prompt:"A family in a remote northern community pays far more for fresh produce than a family in Toronto. Which food-security component is most affected?",
          options:[
            { t:"Accessibility", ok:true, why:"Cost and distance limit access (module 19)." },
            { t:"Acceptability", why:"Not about cultural fit." },
            { t:"Availability only", why:"Some produce is there; the cost is the main barrier." },
            { t:"Sustainability", why:"Not the main issue here." }],
          hints:["Is it there? Can they afford it?", "Price is the barrier.", "Accessibility."] },
        { id:"w6", skill:"Respecting practices", goal:4,
          prompt:"Your group is planning a class meal. One classmate keeps kosher. What’s the most respectful approach?",
          options:[
            { t:"Ask what works for them and plan options that fit their practice", ok:true, why:"Respect and include." },
            { t:"Suggest they make an exception just this once", why:"Practices aren’t up for negotiation." },
            { t:"Tell them their choice is less healthy", why:"Unfounded and disrespectful." },
            { t:"Let them bring their own food without discussing it", why:"Better to include them in planning." }],
          hints:["Who knows best what fits?", "Them.", "Ask, then plan together."] }
      ],
      refreshers:{
        "Facts vs values":"A fact can be checked with evidence. A value says what matters or what we should do. Most food arguments combine both.",
        // VERIFY: farm stage dominates emissions (module 22).
        "Food and the environment":"For most foods, the farm stage (land, animals, fertilizer) dominates emissions; transport is usually small unless food is flown (module 22).",
        "Fair trade and labour":"Certification standards set minimum prices and premiums for certified producers; check what each label covers.",
        "Access and cost":"Income and location shape what people can buy (module 19).",
        "Respecting practices":"Religious and cultural practices are constraints to plan around, not preferences to argue with."
      }
    }
  },
  explore:{
    heading:"Values compass",
    intro:"Set how much each value matters (0 to 5). The compass ranks five protein options for one week’s dinners. Switch families to see how their practices change which options are on the table.",
    modelTag:"Teaching summary, not measurements",
    modes:[{ id:"house", t:"Household" }, { id:"inst", t:"Institution (school board)" }],
    // Plan F12 values (rating order: Environment, Welfare, Labour, Local, Cost, Health, Convenience). s = short readout word.
    values:[
      { id:"env", t:"Environment", s:"environment" },
      { id:"welf", t:"Animal welfare", s:"welfare" },
      { id:"lab", t:"Fair labour", s:"labour" },
      { id:"loc", t:"Local economy (Ontario)", s:"local economy" },
      { id:"cost", t:"Cost and access", s:"cost" },
      { id:"hlth", t:"Health", s:"health" },
      { id:"conv", t:"Convenience and skills", s:"convenience" }
    ],
    // Plan ratings table, exact. Don't change without recounting P2–P4, TC1–TC3, H4, E3, T1 and the hero.
    // VERIFY: every rating (plan: "Real values vary by farm, season and source (verify before release)").
    // cost = "Who bears the cost?" note (Lentils from the plan; the other four module-written).
    options:[
      { id:"O1", t:"Canadian beef", short:"Beef", r:[1, 2, 3, 4, 2, 3, 4], cost:"the climate: the highest emissions of the five" },
      { id:"O2", t:"Dried lentils (Saskatchewan)", short:"Lentils", r:[5, 5, 4, 4, 5, 5, 2], cost:"more cooking time" },
      { id:"O3", t:"Local lake fish", short:"Fish", r:[4, 3, 4, 5, 2, 5, 3], cost:"the budget: it costs more per serving" },
      { id:"O4", t:"Tofu (imported soy)", short:"Tofu", r:[4, 5, 2, 1, 3, 4, 4], cost:"Ontario farms: the soy is imported" },
      { id:"O5", t:"Ontario free-range eggs", short:"Eggs", r:[3, 3, 3, 5, 3, 4, 5], cost:"some emissions from hen feed, and welfare that depends on the farm’s standard" }
    ],
    // "See the ratings": one-line reason per cell. Only Lentils/convenience is the plan's; the other 34 are module-written.
    // VERIFY: every reason below.
    reasons:{
      O1:["Cattle need a lot of land and feed, and they release methane: the highest emissions per serving of the five.",
        "Many beef cattle spend part of their lives in crowded feedlots; conditions vary by farm.",
        "Canadian labour rules apply, but meat-packing work is physically demanding and can be risky.",
        "Raised and processed in Canada, though much of it comes from the Prairies rather than Ontario.",
        "One of the more expensive proteins per serving.",
        "A good source of protein, iron and zinc; Canada’s Food Guide suggests choosing plant proteins more often.",
        "Quick to cook and familiar to many households."],
      O2:["Low emissions and land use, and lentil plants add nitrogen to the soil.",
        "No animals are raised.",
        "Grown on mechanized Canadian farms under Canadian labour rules.",
        "Grown in Canada (mostly Saskatchewan), so the money stays in Canada, though not in Ontario.",
        "Among the cheapest proteins per serving.",
        "Protein plus fibre, iron and folate, with little fat.",
        "Dried lentils need soaking or long cooking; canned are faster but cost more."],
      O3:["Wild lake fish need no farmland or feed; boat fuel and the health of fish stocks still matter.",
        "Wild fish live free, but how they are caught and handled affects welfare.",
        "Often caught and processed by small Ontario fishing businesses.",
        "Caught, processed and sold in Ontario.",
        "Fresh fish costs more per serving than most proteins.",
        "Protein plus healthy fats; Canada’s Food Guide includes fish among protein foods.",
        "Quick to cook, but fresh fish must be used within a day or two."],
      O4:["Soy has low emissions, but imported soy can be linked to land clearing in some regions.",
        "No animals are raised.",
        "Labour conditions on faraway soy farms are hard to trace.",
        "The soy is imported, so little of the money reaches Ontario farms.",
        "Moderately priced per serving.",
        "Protein with little saturated fat; many brands add calcium.",
        "Ready to eat or quick to cook."],
      O5:["Lower emissions than beef, higher than plant proteins, mostly from hen feed.",
        "Free-range hens have more space than caged hens; what the label requires depends on the certifier.",
        "Ontario farm work under provincial labour rules; conditions vary by farm.",
        "Produced and sold in Ontario.",
        "Costs more than regular eggs, but less per serving than beef or fish.",
        "High-quality protein with vitamins and minerals.",
        "Ready in minutes, with few skills needed."]
    },
    ratingsNote:"Ratings from 1 (weak) to 5 (strong) are a teaching summary of general evidence, not measurements. Real values vary by farm, season and source.",
    // VERIFY: references (APA 7) for the ratings panel; confirm details and add current price and label sources before release.
    refs:[
      { author:"Poore, J., & Nemecek, T.", year:2018, title:"Reducing food’s environmental impacts through producers and consumers", journal:"Science", volume:"360", issue:"6392", pages:"987-992" },
      { author:"Health Canada", year:2019, title:"Canada’s food guide", source:"Government of Canada" }
    ],
    personas:[
      { id:"okoro", t:"Okoro family (no restrictions)", out:[] },
      { id:"patel", t:"Patel family (lacto-vegetarian: no meat, fish or eggs)", out:["O1", "O3", "O5"] },
      { id:"haddad", t:"Haddad family (halal: beef shown is halal-certified)", out:[], beef:"Canadian beef (halal-certified)" }
    ],
    outLabel:"not part of this family’s practice",
    filterNote:"<strong>Culture and religion are filters, not scores.</strong> Each family’s practice removes the options that don’t fit it. The compass never weighs a family’s faith against price.",
    scoreRule:"Score = Σ (your weight × the option’s rating), over the seven values. Higher ranks first; ties are shown as ties.",
    board:{ cost:4, hlth:4, conv:5 },
    boardTitle:"The school board must choose <strong>one</strong> protein for a lunch program serving many students.",
    boardLine:"Institutional choices reach thousands of meals a week.",
    boardLock:"set by the board",
    rows:{ ranking:"Ranking", top:"Top choice", why:"Why it wins", trade:"Trade-off you accept", removed:"Removed by family practice", cost:"Who bears the cost?" },
    // P1 evidence card (plan). VERIFY: approximate pattern from life-cycle studies (farm and land use about 80%, transport about 6%).
    evidence:{ title:"Evidence card: where a typical food’s emissions come from",
      tag:"Model: approximate pattern from life-cycle studies",
      bars:[{ id:"farm", t:"Farm and land use", v:80 }, { id:"trans", t:"Transport", v:6 }, { id:"other", t:"Other stages", v:14 }],
      note:"Approximate shares for a typical food. Air-freighted foods are the exception: flying adds far more." },   // note module-written
    predictions:[
      { id:"p1", prompt:"Which usually matters more for a food’s greenhouse-gas emissions: how far it travelled, or how it was produced?",
        options:[{ t:"How it was produced", ok:true }, { t:"How far it travelled" }, { t:"Its packaging" }, { t:"Store refrigeration" }],
        explain:"Farm and land use about 80%, transport about 6%, other stages the rest. Transport is usually a small slice; production dominates, unless food is flown." },
      { id:"p2", prompt:"Set only <strong>Cost and access</strong> to 5. Which ranks first?",
        options:[{ t:"Lentils", ok:true }, { t:"Eggs" }, { t:"Tofu" }, { t:"Beef" }],
        // VERIFY: lentil prices per serving.
        explain:"Lentils 25 · Tofu 15 · Eggs 15 · Beef 10 · Fish 10. Dried lentils are among the cheapest proteins per serving." },
      { id:"p3", prompt:"Set only <strong>Local economy</strong> to 5. What happens?",
        options:[{ t:"Fish and eggs tie for first", ok:true }, { t:"Lentils first" }, { t:"Beef first" }, { t:"Tofu first" }],
        explain:"Fish 25 · Eggs 25 · Beef 20 · Lentils 20 · Tofu 5. Change the value, and the winner changes. Here it’s a tie." },
      { id:"p4", prompt:"Switch to the Patel family (lacto-vegetarian). How many options remain?",
        options:[{ t:"2", ok:true }, { t:"3" }, { t:"4" }, { t:"5" }],
        explain:"Beef, fish and eggs grey out: not part of this family’s practice. Lentils and tofu remain. Practices are constraints to respect; the compass filters, it doesn’t argue." }
    ],
    challenges:[
      { id:"tc1", goal:[3, 4],
        prompt:"Okoro family: set the weights so <strong>Ontario free-range eggs rank first</strong>, with no tie.",
        why:"For example, Local economy 5 and Convenience 5: Eggs 50 · Beef 40 · Fish 40 · Lentils 30 · Tofu 25.",
        msgs:{ lentils:"Lentils lead whenever environment, welfare, cost or health carry weight. Which values do eggs rate 5 on?",
          tie:"A tie isn’t first. Nudge one weight.",
          // module-written
          view:"Use Household mode with the Okoro family.",
          other:"Which values do eggs rate 5 on?" },
        hints:["Find eggs’ highest ratings.", "Local economy 5 and Convenience 5.", "Put weight only there: 5 and 5."] },
      { id:"tc2", goal:[3, 4],
        prompt:"Patel family (lacto-vegetarian): set weights so <strong>tofu ranks above lentils</strong>.",
        why:"Convenience is a legitimate value. Time and cooking skills are real constraints for many households.",
        msgs:{ lentilsWin:"On those, lentils rate equal or higher. Which value does tofu win on?",
          welfare:"They tie on welfare (5 and 5).",
          // module-written
          view:"Use Household mode with the Patel family.",
          zero:"All weights are 0, so tofu and lentils tie at 0. Which value does tofu win on?" },
        hints:["Compare the two rows.", "Tofu beats lentils only on convenience (4 vs 2).", "Weight convenience; leave the values lentils win on at 0."] },
      { id:"tc3", goal:[3, 4], stretch:true,
        prompt:"Institution mode: the board’s weights are Cost 4, Health 4, Convenience 5; every other value starts at 0. The board wants to give <strong>Environment</strong> some weight. What is the <strong>smallest</strong> Environment weight that makes lentils rank first? Enter it in the Environment box.",
        why:"A small change in what an institution values can flip a decision that feeds thousands. That’s why policy debates matter.",
        msgs:{ w1:"At 1, eggs lead 56 to 55.", big:"Lentils lead, but a smaller weight also works.", w0:"Eggs lead 53 to 50.",
          // module-written
          view:"Switch to Institution mode.",
          others:"Set Animal welfare, Fair labour and Local economy back to 0: only Environment changes in this challenge." },
        hints:["Write each score as a number plus Environment × rating.", "Lentils = 50 + 5<i>w</i>; eggs = 53 + 3<i>w</i>. You need 50 + 5<i>w</i> > 53 + 3<i>w</i>.", "2<i>w</i> > 3, so <i>w</i> = 2 is the smallest whole number."] }
    ],
    // the plan's "aha"
    blocks:[{ title:"What the compass shows", html:"<p>The “best” choice is not hidden in the food. It comes from the <strong>weights</strong> you bring, and from the <strong>constraints</strong> you respect.</p>" }]
  },
  part3:{
    slug:"case", name:"Make your case", heading:"Make your case",
    // module-written from the plan's rationale
    intro:"The compass ranks; this part <strong>argues</strong>. Choose a question, build a claim–evidence–reasoning argument with a fair counterargument, and check how strong your evidence is. Feedback checks the structure, never which side you take.",
    stations:[{ id:"q", t:"1. Choose a question" }, { id:"build", t:"2. Build the argument" }, { id:"data", t:"3. Check it with data" }],
    claims:[{ id:"yes", t:"Yes" }, { id:"no", t:"No" }, { id:"cond", t:"Yes, with conditions" }],
    // Reasoning chips: the seven compass values plus culture and religion (module-written list from plan §1 dimensions).
    linkValues:["the environment", "animal welfare", "fair labour", "the local economy", "cost and access", "health", "convenience", "culture and religion"],
    quality:{ strong:"Strong", moderate:"Moderate", weak:"Weak" },
    // Question (a) cards are the plan's; their quality tags and notes, and every card for (b) and (c), are module-written.
    // Counterargument chips are module-written except (a)'s first (plan Q3). "against" opposes yes / yes-with-conditions;
    // "for" opposes no. VERIFY: every card marked VERIFY.
    questions:[
      { id:"a", t:"Should our school cafeteria offer a meat-free main dish every day?",
        cards:[
          // VERIFY
          { id:"a1", t:"Life-cycle reviews: legume proteins have far lower emissions than beef per gram of protein", type:"Peer-reviewed review", q:"strong",
            note:"Pools many studies with stated methods. Check the date: newer reviews may refine the numbers." },
          { id:"a2", t:"Model survey: 40% of students would choose a meat-free main at least once a week", type:"Survey (model data)", q:"moderate",
            note:"A survey shows what students say, not what they’ll buy. Check how many were asked, and how." },
          // VERIFY
          { id:"a3", t:"Dried lentils cost less per serving than beef in most Canadian stores", type:"Price data", q:"strong",
            note:"Prices change. Check the date and where the prices were collected." },
          { id:"a4", t:"Some students’ religious practices limit which mains they can eat", type:"Fact", q:"strong",
            note:"A fact about your school community. Ask students and families rather than guessing which practices apply." },
          { id:"a5", t:"Ad from a meat-alternative brand: “Plants beat meat!”", type:"Advertisement", q:"weak",
            note:"An advertisement has a commercial interest; look for an independent source." }],
        counters:{ against:["Some students need options that fit religious practices and enough protein", "Some students may skip lunch if the main dish isn’t familiar"],
          for:["Legume mains have far lower emissions and cost less per serving", "A daily meat-free option adds a choice without removing any"] } },
      { id:"b", t:"Should Ontario school food programs buy from Ontario farms first?",
        cards:[
          // VERIFY
          { id:"b1", t:"Life-cycle studies: for most foods, how a food is produced matters more for emissions than how far it travels", type:"Peer-reviewed review", q:"strong",
            note:"Pools many studies with stated methods. It covers emissions only, not jobs or freshness." },
          // VERIFY
          { id:"b2", t:"Ontario farms grow many vegetables and fruits, but much fresh produce is in season only from summer to fall", type:"Government data", q:"strong",
            note:"Public agricultural data with stated methods. Check which crops and which years it covers." },
          { id:"b3", t:"Model survey: 55% of parents would support paying a little more for Ontario-grown school food", type:"Survey (model data)", q:"moderate",
            note:"A survey shows what people say they’d pay. Check who was asked and how the question was worded." },
          { id:"b4", t:"Farm organization report: buying from Ontario farms keeps money in rural communities", type:"Industry report", q:"moderate",
            note:"The group benefits from more local buying. Look for an independent source that agrees." },
          { id:"b5", t:"Opinion column: “Buying local is always the greener choice.”", type:"Opinion", q:"weak",
            note:"An opinion with no data, and its key claim conflicts with life-cycle evidence." }],
        counters:{ against:["Local isn’t always lower-emission: a heated winter greenhouse can out-emit a trucked field crop", "Ontario-first buying could cost more in winter and squeeze a tight food budget"],
          for:["Buying from Ontario farms supports local farm jobs and businesses", "Shorter supply chains can be less exposed to faraway disruptions"] } },
      { id:"c", t:"Should fair-trade coffee be the only coffee sold at school events?",
        cards:[
          // VERIFY
          { id:"c1", t:"Fair-trade standards include a minimum price and a premium for certified producer organizations", type:"Certifier’s standard", q:"strong",
            note:"The standard says what is required. It certifies those rules, not every outcome on every farm." },
          // VERIFY
          { id:"c2", t:"Research reviews: benefits of fair-trade certification vary, often clearer for cooperative members than for hired workers", type:"Peer-reviewed review", q:"strong",
            note:"Pools many studies with stated methods. Results differ by crop and country." },
          { id:"c3", t:"Model survey: 30% of students buy coffee at school events", type:"Survey (model data)", q:"moderate",
            note:"A survey of one school. Check how many students answered." },
          // VERIFY
          { id:"c4", t:"Fair-trade coffee usually costs a school more per kilogram than conventional coffee", type:"Price data", q:"strong",
            note:"Prices change. Check the date and the suppliers compared." },
          { id:"c5", t:"Coffee brand ad: “Every cup changes a life!”", type:"Advertisement", q:"weak",
            note:"An advertisement has a commercial interest and gives no data; look for an independent source." }],
        counters:{ against:["Fair-trade coffee costs more, which may raise prices at school events", "Certification covers certified producers; it doesn’t guarantee every worker’s wage"],
          for:["Fair-trade standards set a minimum price and a premium for producers", "A school’s buying choices show the values it teaches"] } }
    ],
    checks:["A claim chosen", "At least 2 evidence cards, with at least one rated “strong”", "Every evidence card linked to a value", "A counterargument chosen", "A response of at least 20 words"],
    // module-written
    msgs:{ allOk:"Every part of your argument is in place. The checks look at structure only; any side can pass.",
      dataAsk:"Every card shows its type, a quality tag and a note on possible bias. Your chosen cards are marked." },
    quickCheck:{
      title:"Make your case quick check", summary:"Make your case quick check",
      // Correct-choice lines are module-written ("Right." + the plan's feedback line).
      items:[
        { id:"q1", goal:5, prompt:"Which evidence card is weakest support for a claim?",
          choices:[{ t:"The brand’s ad", ok:true, fb:"Right. It has a commercial interest and gives no data." }, { t:"A peer-reviewed review", fb:"It has a commercial interest and gives no data." }, { t:"Government price data", fb:"It has a commercial interest and gives no data." }, { t:"A school survey with its method shown", fb:"It has a commercial interest and gives no data." }] },
        { id:"q2", goal:1, prompt:"“Lentils have lower emissions than beef, so we should serve more lentils.” Which part is the value?",
          choices:[{ t:"“we should serve more lentils”", ok:true, fb:"Right. The <em>should</em> depends on valuing lower emissions." }, { t:"“lentils have lower emissions”", fb:"The <em>should</em> depends on valuing lower emissions." }, { t:"“than beef”", fb:"The <em>should</em> depends on valuing lower emissions." }, { t:"There’s no value", fb:"The <em>should</em> depends on valuing lower emissions." }] },
        { id:"q3", goal:5, prompt:"The strongest counterargument to “meat-free mains every day” is…",
          choices:[{ t:"Some students need options that fit religious practices and enough protein", ok:true, fb:"Right. It raises a real constraint; the others are preferences." }, { t:"Meat tastes better", fb:"It raises a real constraint; the others are preferences." }, { t:"Change is uncomfortable", fb:"It raises a real constraint; the others are preferences." }, { t:"Vegetables are boring", fb:"It raises a real constraint; the others are preferences." }] },
        { id:"q4", goal:5, prompt:"“Organic food is natural, so it’s the most ethical.” What’s the flaw?",
          choices:[{ t:"It assumes “natural” means ethical", ok:true, fb:"Right. Appeal to nature: give evidence about effects instead." }, { t:"It uses a statistic", fb:"Appeal to nature: give evidence about effects instead." }, { t:"It cites a source", fb:"Appeal to nature: give evidence about effects instead." }, { t:"Nothing", fb:"Appeal to nature: give evidence about effects instead." }] }
      ]
    }
  },
  practice:{
    activities:[
      // Plan: tap-to-sort (N6 style), 10 items. Wrong-box lines marked "mw" and every correct-placement "why" are module-written.
      { id:"fv", type:"sorter", title:"Fact, value or both?", summary:"Fact, value or both?", goal:[1, 5], noun:"statement", txt:true,
        instruction:"Sort each statement: a factual claim you could test, a value judgement, or both (a value resting on a factual claim).",
        boxes:[{ id:"fact", label:"Factual claim", sub:"testable" }, { id:"value", label:"Value judgement" }, { id:"both", label:"Both", sub:"a value resting on a factual claim" }],
        items:[
          // VERIFY: item 1, 4, 6, 7, 9 facts.
          fv("i1", "“Air-freighted berries have higher transport emissions than berries shipped by sea.”", "fact", "It compares measurable emissions.",
            { value:"It can be tested.", both:"There’s no <em>should</em> or <em>better</em> here: it’s a testable comparison." /* mw */ }),
          fv("i2", "“Schools ought to buy local food.”", "value", "The <em>ought</em> says what schools should do.",
            { fact:"The <em>ought</em> makes it a value. " + M5, both:"There’s no checkable claim in it, only the <em>ought</em>." /* mw */ }),
          fv("i3", "“Because most emissions come from production, we should focus on what we eat more than where it’s from.”", "both", "A factual premise about emissions plus a <em>should</em>.",
            { fact:"The “should” adds a value to a factual premise.", value:"The first half (most emissions come from production) is a checkable claim." /* mw */ }),
          fv("i4", "“Fair-trade standards include a minimum price for certified producers.”", "fact", "You can check it in the standard.",
            { value:"Testable by reading the standard.", both:"Testable by reading the standard." }),
          fv("i5", "“Animal welfare matters as much as price.”", "value", "<em>Matters</em> weighs what’s important.",
            { fact:"It weighs two values.", both:"It weighs two values." }),
          fv("i6", "“Free-range certification standards differ between certifiers.”", "fact", "You can compare the standards. " + M7,
            { value:"Testable by comparing standards.", both:"Testable by comparing standards." }),
          fv("i7", "“Since food insecurity in Canada is tied to income, governments should raise incomes rather than rely on food banks.”", "both", "A research finding plus a <em>should</em>.",
            { value:"The first half is a research finding (module 19).", fact:"The “should” part is a value." /* mw */ }),
          fv("i8", "“Homemade meals are more meaningful.”", "value", "“Meaningful” says what matters.",
            { fact:"“Meaningful” is a value word.", both:"There’s no checkable claim, only a value word." /* mw */ }),
          fv("i9", "“Dried lentils usually cost less per serving than beef in Ontario stores.”", "fact", "Prices can be checked.",
            { value:"Testable with price data.", both:"Testable with price data." }),
          fv("i10", "“Because lake fish supports local jobs, it’s the better choice for our community.”", "both", "A checkable premise plus a value.",
            { fact:"A factual premise (local jobs) plus a value (better for us).", value:"A factual premise (local jobs) plus a value (better for us)." })
        ] },
      // ★ set (plan Activity 2). H2 and H4 use number entry (N4). Plan gives each answer and its feedback; the distractors, their
      // feedback, the correct-answer lines where missing and the hints (except H4's) are module-written.
      { id:"trade", type:"custom", title:"Hidden trade-offs", summary:"Hidden trade-offs", star:true, goal:[2, 3, 5],
        instruction:"Answer each question. All six are ★ non-routine; H5 is an inquiry item.",
        how:"Choose or type an answer, then press Check. Each item has three levels of help.",
        items:[
          // VERIFY: model values based on life-cycle patterns.
          { id:"h1", kind:"mc", goal:[2, 3], prompt:"Model data: Ontario tomatoes from a heated greenhouse in January, 2.0 kg CO₂e per kg; field tomatoes trucked from the south, 0.7 kg CO₂e per kg (model values based on life-cycle patterns). Which has lower emissions in this model?",
            options:[
              { t:"The trucked field tomatoes", ok:true, why:"Heating in winter outweighs the trucking." },
              { t:"The Ontario greenhouse tomatoes", why:M2 },
              { t:"They’re about equal", why:"2.0 is almost three times 0.7." },
              { t:"You can’t tell without the distance", why:"The totals already include transport." }],
            hints:["Compare the two totals.", "Each total already includes transport.", "0.7 < 2.0: the trucked field tomatoes."] },
          { id:"h2", kind:"num", goal:3, prompt:"A cooperative sells 10 000 kg of fair-trade coffee with a premium of $0.20 per kg (model). How much premium does it receive?",
            answer:2000, unit:"dollars", label:"Premium ($):", display:"$2000", why:"10 000 × 0.20 = 2000.",
            wrong:[{ match:200, fb:"Check the zeros: 10 000 × 0.20." }, { match:20000, fb:"0.20 is a fifth of a dollar: 10 000 × 0.20." }],
            hints:["Premium = mass × premium per kilogram.", "10 000 × 0.20.", "10 000 × 0.20 = 2000: $2000."] },
          { id:"h3", kind:"mc", goal:2, prompt:"A carton says “free-range”. What can you conclude for sure?",
            options:[
              // VERIFY: free-range standards vary.
              { t:"It meets that certifier’s free-range standard; check what that standard requires", ok:true, why:"Standards vary; the label doesn’t tell you everything." },
              { t:"The hens spent all their time outdoors", why:M7 },
              { t:"The eggs are organic", why:"Organic is a different certification." },
              { t:"The farm workers were paid fairly", why:"A welfare label certifies hen housing, not labour." }],
            hints:["What does a label certify?", "A specific standard, set by a certifier.", "It meets that certifier’s free-range standard; check what the standard requires."] },
          { id:"h4", kind:"num", goal:3, prompt:"Weights: Environment 4, Fair labour 3; others 0. Using the compass ratings, which ranks first, and by how much over second?",
            pick:{ label:"Ranks first:", options:["Lentils", "Fish", "Tofu", "Eggs"], answer:"Lentils", wrong:"Find each score: weight × rating, added." },
            answer:4, label:"Lead over second (points):", display:"Lentils (32), ahead of fish (28) by 4",
            why:"Lentils 4×5 + 3×4 = 32; fish 4×4 + 3×4 = 28; tofu 4×4 + 3×2 = 22.",
            wrong:[{ match:10, fb:"Second place is fish (28), not tofu (22)." }, { match:32, fb:"That’s lentils’ score. Subtract the second score." }],
            hints:["Multiply each weight by the rating.", "Lentils: 20 + 12. Fish: 16 + 12.", "32 vs 28: lentils by 4."] },
          { id:"h5", kind:"mc", goal:5, inquiry:true, prompt:"Which source best supports a claim about how much greenhouse gas different foods produce?",
            options:[
              { t:"A peer-reviewed meta-analysis of life-cycle studies", ok:true, why:"Stated methods and many studies. An industry ad, an influencer post or an opinion column each have a perspective and little data." },
              { t:"A food company’s advertisement", why:"An ad has a commercial interest and little data." },
              { t:"An influencer’s post about their diet", why:"A perspective, with no stated methods." },
              { t:"An opinion column", why:"An opinion, with little data." }],
            hints:["Which source states its methods?", "Many studies pooled beat one voice.", "A peer-reviewed meta-analysis of life-cycle studies."] },
          { id:"h6", kind:"mc", goal:4, prompt:"A family in a remote community can’t afford higher-welfare eggs at triple the southern price. What’s the most ethical response at the system level?",
            options:[
              // VERIFY: program details (module 19).
              { t:"Support policies that lower northern food costs or raise incomes, not blaming the family", ok:true, why:"Responsibility sits with systems as well as individuals (module 19)." },
              { t:"Tell the family to buy higher-welfare eggs anyway", why:M4 },
              { t:"Conclude the family doesn’t care about animals", why:M4 },
              { t:"Stop selling eggs in the North", why:"That removes food without fixing cost." }],
            hints:["Is the barrier the family’s values or the price?", "Price and income are system issues.", "Support policies that lower northern food costs or raise incomes."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Zoltan", goal:[2, 3, 4],
        instruction:"Zoltan made one mistake in each argument. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Write a recommendation about beef for a classmate’s family.",
            // VERIFY: step 1 (beef vs lentil emissions).
            steps:["“Beef usually has much higher greenhouse-gas emissions per serving than lentils.”", "“So families who eat beef are acting unethically.”", "“They should stop eating beef completely.”", "“That’s the only ethical choice.”"],
            answer:1, stepFb:["Step 1 is correct: a factual claim.", "", "Step 3 follows step 2. The mistake is earlier.", "The mistake is earlier."],
            fixes:[
              { t:"“For people who weigh the environment highly and can manage it, swapping some beef meals for legumes cuts emissions; each family’s choice also depends on cost, culture and access.”", ok:true, why:"It recommends options and respects each family’s constraints." },
              { t:"“So only rich families should eat beef.”", why:"Still judges people." },
              { t:"“So beef should be banned.”", why:"A policy leap with no other values weighed." },
              { t:"Step 2 is correct.", why:"It moralizes people instead of weighing values. " + M4 }],
            hints:["Does a fact about emissions tell us who is “unethical”?", "No: other values and constraints matter.", "Recommend options, don’t judge people."] },
          { id:"e2", goal:2, task:"Compare Ontario greenhouse tomatoes in January with imported field tomatoes.",
            steps:["“The Ontario tomatoes travelled 30 km; the imported ones 3500 km.”", "“Transport is the main source of a food’s emissions.”", "“So the Ontario tomatoes have lower emissions.”", "“So buying local is always greener.”"],
            answer:1, stepFb:["Step 1 is correct.", "", "Step 3 follows step 2. The mistake is earlier.", "The mistake is earlier."],
            fixes:[
              { t:"“Production usually matters more than transport; a heated winter greenhouse can emit more than field-growing plus trucking (model: 2.0 vs 0.7 kg CO₂e per kg).”", ok:true, why:"Production, including winter heating, usually outweighs transport." },
              { t:"“Transport is the only source of emissions.”", why:"Worse." },
              { t:"“Distance doesn’t matter at all.”", why:"It matters, especially for air freight, just usually less than production." },
              { t:"Step 2 is correct.", why:M2 }],
            hints:["Recall P1’s chart.", "Which stage is usually largest?", "Production: heating counts."] },
          { id:"e3", goal:3, task:"Weights: Environment 2, Cost and access 3. Score lentils (Environment 5, Cost 5) and beef (Environment 1, Cost 2).",
            steps:["“Lentils: 2 × 5 + 3 × 5 = 25.”", "“Beef: 2 × 2 + 3 × 1 = 7.”", "“So lentils lead by 18.”"],
            answer:1, stepFb:["Step 1 is correct.", "", "Step 3 follows step 2. The mistake is earlier."],
            fixes:[
              { t:"“Beef: 2 × 1 + 3 × 2 = 8, so lentils lead by 17.”", ok:true, why:"2 × 1 + 3 × 2 = 2 + 6 = 8, and 25 − 8 = 17." },
              { t:"“Beef: 2 × 1 + 3 × 1 = 5.”", why:"Cost is rated 2, not 1." },
              { t:"“Beef: 1 + 2 = 3.”", why:"Multiply by the weights." },
              { t:"Step 2 is correct.", why:"The ratings were swapped." }],
            hints:["Match each weight to the right rating.", "Environment weight 2 × environment rating 1.", "2 + 6 = 8."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the values compass: how much the “best” choice changed with the weights, or how often local wasn’t the lowest-emission choice?" },
      { id:"j2", q:"In your own words, explain the difference between a constraint (like a family’s religious practice or budget) and a trade-off." },
      { id:"j3", q:"Explain to a friend how to argue about food ethics without judging people’s plates." },
      { id:"j4", q:"Course capstone: state your personal food philosophy in a few sentences. What do you value most, what will you actually do, what trade-off do you accept, and how would you answer someone who disagrees?" }
    ]
  },
  final:{
    intro:"This shows what you’ve learned, so there are no hints here. Answer all 10 questions and say how sure you are. Then submit to see your results. Each question is labelled with its achievement chart category. Value questions test the quality of your reasoning, never which values you hold.",
    // Options without feedback in the plan use its misconception sentences (M1–M8); correct-option lines without plan text are module-written.
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"A shopper asks whether the workers who picked the strawberries were paid fairly. Which ethical dimension is this?", options:[
          { t:"Fair labour and trade", ok:true, why:"It’s about the people producing the food." },
          { t:"Animal welfare", why:"No animals involved." },
          { t:"Local economy", why:"Close, but the question is about workers’ pay and conditions." },
          { t:"Environment", why:"Not about emissions or land." }] },
        b:{ prompt:"A family chooses chicken from farms with more space and outdoor access for the birds. Which dimension is this?", options:[
          { t:"Animal welfare", ok:true, why:"Space and outdoor access are about the birds’ welfare." },
          { t:"Fair labour", why:"That’s about workers." },
          { t:"Health", why:"Not the stated reason." },
          { t:"Cost and access", why:"Usually costs more, but cost isn’t the reason." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What does fair-trade certification aim to provide certified producers?", options:[
          // VERIFY: the current fair-trade standard.
          { t:"A minimum price plus a premium for community or business projects", ok:true, why:"A floor price plus a premium is the core of the standard." },
          { t:"A guaranteed high wage for every worker everywhere", why:M7 },
          { t:"Organic status", why:"A separate certification." },
          { t:"Lower prices for shoppers", why:"Usually the opposite." }] },
        b:{ prompt:"What are “food miles”?", options:[
          { t:"The distance food travels from where it’s produced to where it’s eaten", ok:true, why:"Food miles measure distance only." },
          { t:"The total emissions of a food", why:"Food miles are only one part of emissions." },
          { t:"The distance a shopper drives to the store", why:"Not the usual meaning." },
          { t:"A rating of how local a farm is", why:"Not a rating." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"Which statement is a value judgement?", options:[
          { t:"“School programs should buy from Ontario farms first.”", ok:true, why:"“Should” signals a value." },
          { t:"“Ontario farms produce many vegetables in summer.”", why:"Factual." },
          { t:"“Imported produce is available year-round in most Ontario stores.”", why:"Factual." },
          // VERIFY: transport usually a small share.
          { t:"“Food transport is usually a small share of emissions.”", why:"Factual; testable." }] },
        b:{ prompt:"Which statement is a testable factual claim?", options:[
          { t:"“Heated greenhouses use more energy in winter than in summer.”", ok:true, why:"Energy use can be measured." },
          { t:"“Local food is better.”", why:"A value. " + M5 },
          { t:"“People ought to care about farm workers.”", why:"A value." },
          { t:"“Eating together is more meaningful.”", why:"A value." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Using the compass ratings (beef 1/2/3/4/2/3/4, lentils 5/5/4/4/5/5/2, fish 4/3/4/5/2/5/3, tofu 4/5/2/1/3/4/4, eggs 3/3/3/5/3/4/5, in the order Environment, Welfare, Labour, Local, Cost, Health, Convenience) and weights Environment 3, Cost 2, Health 1 (others 0), which ranks first?", options:[
          { t:"Lentils, with 30", ok:true, why:"15 + 10 + 5." },
          { t:"Tofu, with 22", why:"Second: 12 + 6 + 4." },
          { t:"Fish, with 21", why:"12 + 4 + 5." },
          { t:"Eggs, with 19", why:"9 + 6 + 4." }] },
        b:{ prompt:"Same ratings (beef 1/2/3/4/2/3/4, lentils 5/5/4/4/5/5/2, fish 4/3/4/5/2/5/3, tofu 4/5/2/1/3/4/4, eggs 3/3/3/5/3/4/5); weights Local 3, Convenience 2, Health 1 (others 0). Which ranks first?", options:[
          { t:"Eggs, with 29", ok:true, why:"15 + 10 + 4." },
          { t:"Fish, with 26", why:"15 + 6 + 5." },
          { t:"Beef, with 23", why:"12 + 8 + 3." },
          { t:"Lentils, with 21", why:"12 + 4 + 5." }] } },
      { id:"t2", cat:"T", goal:1,
        // VERIFY: model data based on life-cycle patterns.
        a:{ prompt:"Model data (based on life-cycle patterns): beef from a farm 50 km away, 30 kg CO₂e per kg; lentils shipped 2000 km, 1.5 kg CO₂e per kg. What’s the best conclusion?", options:[
          { t:"The lentils have far lower emissions even though they travelled much farther: production matters more than distance here", ok:true, why:"30 vs 1.5 kg CO₂e per kg: production outweighs distance." },
          { t:"The beef is greener because it’s local", why:M2 },
          { t:"They’re about equal because distance and production cancel out", why:"30 vs 1.5 isn’t close." },
          { t:"You can’t compare foods that travel different distances", why:"You can: the totals include transport." }] },
        b:{ prompt:"Model data: local cheese, 12 kg CO₂e per kg; tofu made from imported soy, 3 kg CO₂e per kg. What’s the best conclusion?", options:[
          { t:"In this model the tofu has lower emissions despite its imported ingredients", ok:true, why:"3 vs 12 kg CO₂e per kg in this model." },
          { t:"The cheese is lower because it’s local", why:M2 },
          { t:"They’re equal", why:"12 vs 3." },
          { t:"Emissions can’t be compared across food groups", why:"Per kilogram they can be compared, though per gram of protein is often fairer." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Argument: “Organic food is natural, so it’s the most ethical choice.” What’s its main weakness?", options:[
          { t:"It assumes “natural” means ethical and offers no evidence about effects on the environment, workers, animals or cost", ok:true, why:M6 },
          { t:"It uses too many statistics", why:"It uses none." },
          { t:"It’s too long", why:"Length isn’t the issue." },
          { t:"It has no weakness", why:"It skips evidence." }] },
        b:{ prompt:"Argument: “Buying local always helps the planet because transport causes most emissions.” What’s its main weakness?", options:[
          { t:"Its key premise is usually false: production, not transport, is typically the largest source", ok:true, why:M2 },
          { t:"It mentions the planet", why:"Not a flaw." },
          { t:"It ignores taste", why:"Not the main logical flaw." },
          { t:"It has no weakness", why:"Its premise fails." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"A classmate’s family relies on inexpensive frozen meals. Which comment is most respectful and useful?", options:[
          { t:"“Busy schedules and budgets are real. If you ever want ideas, adding frozen vegetables or a can of beans is a cheap way to boost those meals.”", ok:true, why:"It respects real constraints and offers a cheap, optional idea." },
          { t:"“Frozen meals are junk; your family should cook from scratch.”", why:"Moralizes and ignores constraints." },
          { t:"“You should only eat organic.”", why:"Ignores cost." },
          { t:"“That’s unethical.”", why:M4 }] },
        b:{ prompt:"Your group is planning a class potluck, and one classmate keeps kosher. Which plan is most respectful?", options:[
          { t:"“Let’s ask what works for you and make sure some dishes fit kosher practice.”", ok:true, why:"Ask, then plan together." },
          { t:"“Can you make an exception for one day?”", why:M8 },
          { t:"“Just bring your own food.”", why:"Excludes them from planning." },
          { t:"“Kosher food is healthier, so we’ll all eat it.”", why:"A claim without evidence, and not the point." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which is the best-structured argument?", options:[
          // VERIFY: emissions and price evidence in the correct option.
          { t:"“Claim: the cafeteria should offer a daily plant-based main. Evidence: life-cycle reviews show legumes have far lower emissions than beef, and lentils cost less per serving. Reasoning: because we value the environment and affordability, this supports a daily option. Counterargument: some students need options that fit religious practices; so keep culturally appropriate choices alongside it.”", ok:true, why:"Claim, evidence, reasoning and a counterargument, each linked." },
          { t:"“Plant-based food is better. Everyone knows that.”", why:"No evidence; appeal to common belief." },
          { t:"“An ad said plants beat meat, so we should switch.”", why:"Weak, commercially motivated evidence." },
          { t:"“Meat is unethical, so it should be banned.”", why:"No evidence or counterargument. " + M4 }] },
        b:{ prompt:"Which best links evidence to a value?", options:[
          // VERIFY: fair-trade minimum price.
          { t:"“Because we value fair labour, the evidence that fair-trade standards set a minimum price for producers supports choosing certified coffee for school events.”", ok:true, why:"It names the value and links it to evidence." },
          { t:"“Fair trade is good.”", why:"No evidence." },
          { t:"“Coffee tastes better fair-trade.”", why:"Taste isn’t the value in question." },
          { t:"“Everyone should buy fair trade or they’re bad people.”", why:M4 }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"A school board must pick one lunch protein. It values cost and health most, but also wants lower emissions. Which recommendation is best reasoned?", options:[
          { t:"“Choose lentils as the main option: they rate highly on cost, health and environment. Accept the trade-off of longer preparation by using canned lentils or batch cooking, and keep a culturally appropriate alternative.”", ok:true, why:"It weighs the board’s stated values, names the trade-off and respects constraints." },
          { t:"“Choose beef because it’s familiar.”", why:"Ignores the board’s stated values." },
          { t:"“Choose whatever is cheapest, and ignore health.”", why:"Ignores a stated value." },
          { t:"“Don’t decide; ethics is personal.”", why:"Institutions must choose. " + M3 }] },
        b:{ prompt:"A hospital cafeteria values health, local economy and convenience for busy staff. Which recommendation is best reasoned?", options:[
          { t:"“Feature Ontario eggs and local fish: they rate high on local economy and health, and eggs are quick to prepare. Note the trade-off: fish costs more, so offer it a few days a week.”", ok:true, why:"It matches the stated values and names the trade-off." },
          { t:"“Serve only tofu because it’s plant-based.”", why:"Tofu rates lowest on local economy." },
          { t:"“Serve beef every day for convenience.”", why:"Ignores health and local economy." },
          { t:"“Ask each patient to bring their own food.”", why:M3 }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"Someone claims, “There’s one ethical diet that everyone should follow.” What’s the best response?", options:[
          { t:"“People weight values differently and face different constraints, such as faith, income and location, so reasonable people can make different ethical choices from the same evidence.”", ok:true, why:M1 },
          { t:"“True: the most ethical diet is mine.”", why:"Self-referential." },
          { t:"“True: experts have decided.”", why:"Experts provide facts; values still differ." },
          { t:"“Ethics has nothing to do with food.”", why:"It does." }] },
        b:{ prompt:"Someone claims, “People who can’t afford fair-trade products are acting unethically.” What’s the best response?", options:[
          { t:"“That ignores cost and access. Responsibility also sits with systems: prices, incomes and policies.”", ok:true, why:M4 },
          { t:"“True: everyone can afford it if they try.”", why:"Ignores real budgets." },
          { t:"“True: fair trade is the only ethical option.”", why:M1 },
          { t:"“Ethics only applies to rich people.”", why:"Not the point." }] } }
    ]
  },
  task:{
    title:"My food philosophy", summary:"My food philosophy",
    statement:"<p>Build a food philosophy you can defend: your values, your commitments, the trade-offs you accept and the constraints you respect. There are as many good answers as there are students.</p>" +
      // module-written from plan §6.2–6.3 and the teacher note
      "<p class=\"tiny muted\">Write about your values, not your family’s actual diet, budget or health. You can write as a hypothetical student if you prefer. Your draft is saved only on this device.</p>" +
      "<p class=\"tiny muted\">This checklist makes sure the parts are there. Your teacher reads the reasoning, and a philosophy is never graded on which values you hold.</p>",
    checks:["Three values, ranked", "A commitment for each value", "A trade-off you accept", "A constraint you respect", "Counterargument answered", "Statement length", "Respectful language", "Uses the vocabulary"],
    tips:["Pick exactly three values and give each a different rank.", "Every value needs one realistic commitment.", "Every real philosophy gives something up. Which trade-off do you accept?",
      "What shapes your choices: budget, faith, location, time?", "Answer the strongest objection in at least 25 words.", "Aim for 120–220 words.",
      "Describe foods plainly. This course doesn’t use moral labels for food.", "Use the words of the course: trade-off, value, evidence, access."],
    explainPrompt:"Why did you rank your values in this order, and what evidence from this course shaped your commitments?",
    vocab:"Use the words value, evidence, trade-off and access.",
    checkLabel:"Check my philosophy",
    success:"Your food philosophy meets every line of the checklist.",   // module-written
    more:"There are as many good answers as there are students. Try ranking your values another way.",   // module-written
    // Commitment chips: Environment and Health lists are the plan's; the others are module-written, built around the model
    // responses' commitments ("buy dried or canned staples", "plan a weekly menu and buy staples in bulk", "buy from nearby
    // producers when affordable", "fair-trade coffee and chocolate", "choose certified higher-welfare options when affordable").
    values:[
      { id:"env", t:"Environment", commit:["plant-based dinners twice a week", "plan meals to waste less", "choose seasonal produce"] },
      { id:"welf", t:"Animal welfare", commit:["choose certified higher-welfare options when affordable", "check what a welfare label certifies", "ask where our eggs and meat come from"] },
      { id:"lab", t:"Fair labour and trade", commit:["fair-trade coffee and chocolate", "check what a fair-trade label covers", "learn how the workers who grow my food are treated"] },
      { id:"loc", t:"Local economy", commit:["buy from nearby producers when affordable", "visit a farmers’ market in season", "choose Ontario products when the price is close"] },
      { id:"cost", t:"Cost and access", commit:["buy dried or canned staples", "plan a weekly menu and buy staples in bulk", "compare unit prices"] },
      { id:"hlth", t:"Health", commit:["build meals on the Food Guide plate", "water as my usual drink", "cook more often"] },
      { id:"conv", t:"Convenience and skills", commit:["batch-cook on weekends", "keep quick staples like canned beans and frozen vegetables", "learn one new simple recipe a month"] }
    ],
    tradeoffs:["more cooking time", "local isn’t always lowest-emission", "fewer higher-welfare choices on a budget", "not cutting out meat"],
    constraints:["budget", "faith or cultural practice", "where I live and access", "time and skills", "a health need"],
    counters:["one person can’t make a difference", "local is just feel-good shopping", "higher-welfare food is too expensive to matter", "ethics is too personal to discuss"],
    banned:["junk food", "clean eating", "guilt", "cheat meal", "good food", "bad food", "disgusting"],
    vocabWords:["trade-off", "value", "evidence", "access", "sustainability"],
    responseLabel:"My response to the counterargument (at least 25 words)",
    statementLabel:"My statement (120–220 words)",
    modelsTitle:"Three model philosophies",   // module-written
    // Plan model responses. Plan error: Model 2's health commitment "half my plate vegetables and fruits" isn't on the plan's
    // Health list; shown here as the list's "build meals on the Food Guide plate" (half the plate is vegetables and fruits).
    models:[
      { title:"Model 1: environment first, on a student budget",
        values:"1 Environment, 2 Cost and access, 3 Health",
        commit:"“plant-based dinners twice a week”, “buy dried or canned staples”, “build meals on the Food Guide plate”",
        trade:"more cooking time", constraint:"budget; family traditions", counter:"one person can’t make a difference",
        response:"Some people say one person’s meals can’t change emissions. That’s partly true, but my choices add up over years, they influence my family and friends, and they cost me less, so the change is worth it even if it’s small.",
        statement:"My food philosophy starts with the environment, then cost and access, then health. I’m a student on a tight budget, so my commitments have to be realistic. I’ll make two or three dinners a week plant-based, using dried or canned lentils and beans, because they have a much smaller footprint than beef and cost less per serving. I’ll buy what’s in season and plan meals so I waste less. The trade-off I accept is convenience: cooking lentils takes more time and skill than heating a frozen meal, so I’ll batch-cook on Sundays. I respect that my family’s traditions include meat at celebrations, and I won’t turn those meals into a debate. The evidence I lean on is that how food is produced usually matters more for emissions than how far it travels. A value I’m still weighing is animal welfare; it matters to me, but it isn’t in my top three yet." },
      { title:"Model 2: local economy first, in a northern town",
        values:"1 Local economy, 2 Health, 3 Fair labour and trade",
        commit:"“buy from nearby producers when affordable”, “build meals on the Food Guide plate” (half my plate vegetables and fruits), “fair-trade coffee and chocolate”",
        trade:"local isn’t always lowest-emission", constraint:"budget; where I live", counter:"local is just feel-good shopping",
        response:"Someone might say buying local is just feel-good shopping. I’d answer that my reason is the local economy, not emissions; I know local isn’t always greener, so I’m choosing it for jobs and community, and I say so honestly.",
        statement:"My top value is supporting the local economy, then health, then fair labour. I live in a small northern Ontario town where the grocery store is far away and expensive, so access shapes everything I choose. My commitment for the local economy is to buy fish, eggs and vegetables from people nearby whenever I can afford it, because that money stays in my community. For health, I’ll keep vegetables and fruits at about half my plate, using frozen ones in winter. For fair labour, I’ll choose fair-trade coffee and chocolate when I buy gifts. The trade-off I accept is that local isn’t always the lowest-emission choice, and I’m honest about that. The constraint I respect is cost: some weeks the cheapest option wins, and that isn’t a moral failure. I’d rather build a food philosophy I can live with than one that only works on paper." },
      { title:"Model 3: health first, within a religious practice",
        values:"1 Health, 2 Cost and access, 3 Animal welfare",
        commit:"“build meals on the Food Guide plate”, “plan a weekly menu and buy staples in bulk”, “choose certified higher-welfare options when affordable”",
        trade:"not cutting out meat", constraint:"faith practice (halal); budget", counter:"higher-welfare food is too expensive to matter",
        response:"A classmate might argue that higher-welfare meat is too expensive to matter. I agree cost is real, which is why welfare is my third value, not my first; I’ll choose it when we can, and I won’t judge families who can’t.",
        statement:"I put health first, cost and access second, and animal welfare third. My family keeps halal, so every commitment I make has to fit that practice; it’s a constraint I respect, not something I weigh against price. For health, I’ll build meals around the Food Guide plate and drink water most of the time. For cost, I’ll plan a weekly menu, buy staples like rice, lentils and frozen vegetables in bulk, and cook more often. For animal welfare, when we can afford it I’ll look for halal chicken from a certified higher-welfare farm, and I’ll check what the label actually certifies. The trade-off I accept is the environment: I’m not cutting out meat, but I’ll waste less and eat more plant proteins during the week. Evidence matters to me, but so do values, and I know other people will weigh these differently for good reasons." }
    ]
  },
  cards:[
    ["Ethical dimensions of food", "Environment, animal welfare, fair labour and trade, local economy, health, cost and access, convenience, culture and religion."],
    ["Fact vs value", "A fact can be tested with evidence; a value says what matters or what we should do."],
    ["Trade-off", "Giving up some of one value to gain another, e.g. more cooking time for a lower-emission meal."],
    ["Constraint", "A limit to respect, not outweigh: a faith practice, a budget, where you live."],
    ["Weighting", "How much each value counts; change the weights and the “best” choice can change."],
    // VERIFY: food miles usually a small share.
    ["Food miles", "The distance food travels; usually a small share of emissions unless it’s flown."],
    ["Life-cycle assessment", "Measuring a food’s impacts from farm to plate, including land use, production and transport."],
    // VERIFY: the fair-trade standard.
    ["Fair trade", "Certification with a minimum price and a premium for certified producers."],
    // VERIFY: welfare label standards.
    ["Welfare labels", "Certify specific standards; check what each certifier requires."],
    ["Appeal to nature", "Treating “natural” as automatically good: a weak argument without evidence."],
    ["Systems, not plates", "Judge arguments, institutions and policies, not individuals’ meals."],
    ["Food philosophy", "Your ranked values, realistic commitments, accepted trade-offs and respected constraints."]
  ]
};
