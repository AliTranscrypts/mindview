// HFA4U 20 Indigenous Food Sovereignty. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/20-indigenous-food-sovereignty.md
// Teacher notes: lines marked VERIFY carry the plan's "verify before release" flags (students see the plan's wording without
// them) and every value or line this module had to supply. "module-written" marks text that isn't in the plan.
// Module rules (plan §1, §5, §6; course plan §2): plan this module with the board's Indigenous education lead and, where
// possible, centre the Nations whose lands the school is on. Name Nations specifically (First Nations, Inuit and Métis are
// never lumped together), never use past-tense framing of living food systems, never ask Indigenous students to speak for
// their communities and never ask any student to write as an Indigenous person (the task is an analysis brief in the
// student's own voice). The residential-school card (timeline T-c) carries a content note, a short summary option and the
// support lines; the support lines also show in the header Support dialog, at the top of Start, in Reflect and above the footer.
// No figures are supplied here: Station 3 names its sources only, and every model illustration is labelled.
// VERIFY (plan §6.1, the whole module): the Working Group on Indigenous Food Sovereignty's principles and their wording, and
// Dawn Morrison's role; La Via Campesina and the 1996 World Food Summit; every timeline date (bison collapse; the 1889
// "peasant farming" policy; the 1942–1952 nutrition experiments and Mosby, 2013; UNDRIP, 2007; Canada's Act, 2021); the
// Grassy Narrows mercury history; the Harvesters Support Grant; nutrient claims about traditional foods; every statistic in
// Station 3; all support-line numbers.
// VERIFY (plan §1, §6.2): the Part 3 initiative cards I1–I5 are the plan's PLACEHOLDERS. Before release, replace each with a
// named initiative documented in the community's own materials (chosen with the Indigenous education lead, local where
// possible, used with permission), add its credited quotation, and keep its accepted-principle set (task checklist line 1).
// Generic placeholders must not ship (plan §6.2).

// VERIFY: all three numbers before release (plan §1 teacher note).
const LINES = '<ul class="ifs-lines">' +
  '<li><strong>Indian Residential Schools Crisis Line:</strong> <span class="nw">1-866-925-4419</span> (24 hours)</li>' +
  '<li><strong>Hope for Wellness Help Line:</strong> <span class="nw">1-855-242-3310</span>, support for Indigenous peoples across Canada, any time</li>' +
  '<li><strong>Kids Help Phone:</strong> <span class="nw">1-800-668-6868</span>, or text CONNECT to <span class="nw">686868</span></li></ul>';
// module-written lead-in (pattern from HFA4U 12's "Why higher rates" card)
const SUPPORT = '<div class="hfa-support ifs-sup" role="note"><p><strong>Support is available any time.</strong> If this history affects you or your family, talk to someone you trust, or contact:</p>' + LINES + "</div>";

// Misconception core sentences (plan §3)
const M1 = "There are many Nations, each with its own food systems. Name the Nation and the place.";
const M2 = "These food systems are living. Seed keepers, harvesters and fishers practise them today.";
const M3 = "Deliveries can help food security; sovereignty is about who decides how food is produced, harvested and governed.";
const M4 = "The causes are colonial policies, income, high remote costs, contamination and climate change, not a lack of knowledge or care.";
const M5 = "Communities lead. Allies support when invited, back rights and policy, and fund without controlling.";
const M6 = "Food also carries culture, spirituality, relationships, language and governance.";
const M7 = "Polluted water and thinning ice change what’s safe to eat and whether people can harvest at all.";
// plan Station 2 feedback example (M4, M5)
const TEACH = "Teaching people “how to eat” assumes they lack knowledge. The barriers are land, cost, contamination and policy.";

// Practice 2 hints (plan: the same first two hints for every item; hint 3 is the worked answer)
const VH = ["Who is speaking, from where, and when?", "Prefer the community’s own voice for its own experience."];
const vh = (a) => VH.concat(["The answer: " + a]);

// Station 2 statements (plan table); the task's ally-action chips reuse them. why = module-written except t2 (plan).
const ALLY = [
  { id:"a1", t:"Advocate for policies that recognize Indigenous harvesting rights", answer:"ally", why:"Backing rights and policy supports decisions the community makes itself." },
  { id:"a2", t:"Follow the community’s lead and offer support when invited", answer:"ally", why:"The community leads; allies help when they’re asked." },
  { id:"a3", t:"Fund community-led programs without changing their goals", answer:"ally", why:"Funding without strings keeps the decisions with the community." },
  { id:"a4", t:"Learn from materials created by the Nation itself", answer:"ally", why:"The Nation is the authority on its own food system." },
  { id:"a5", t:"Act locally to protect waters and lands from pollution", answer:"ally", why:"Protecting water and land where you live keeps harvests safe without taking any decision away from a community." },
  { id:"t1", t:"Design a new food program for the community without asking", answer:"takes", why:"Designing for a community without asking takes the decision away from it." },
  { id:"t2", t:"Teach community members how to eat healthily", answer:"takes", why:TEACH },
  { id:"t3", t:"Sell traditional foods or ceremonies as a brand", answer:"takes", why:"Turning a community’s foods or ceremonies into someone else’s brand takes control away from the community." },
  { id:"t4", t:"Speak on behalf of the community at a meeting", answer:"takes", why:"Communities speak for themselves. Allies can make room for them to be heard." }
];

export default {
  id:"20-indigenous-food-sovereignty",
  kind:"topic",
  title:"Indigenous food sovereignty",
  topic:"Indigenous Food Sovereignty",
  readyTopic:"Indigenous food sovereignty",
  hero:{
    headline:"Who decides what’s on the plate?",
    text:"<strong>Food security</strong> asks whether there is enough nutritious food. <strong>Food sovereignty</strong> asks who gets to decide: how food is grown, harvested, shared and governed. For many <strong>First Nations, Inuit and Métis</strong> communities, food is also relationship, ceremony, language and law. In this module you’ll learn principles that Indigenous organizations have set out, see how colonial policies disrupted <strong>Indigenous food systems</strong>, and study how communities are leading their renewal.",
    fig:{ html:'<div class="ifs-hero" id="ifs-hero"></div>', caption:"" },
    // module-written description of the plan's storyboard. The circle is drawn as a plain four-segment ring in the plan's
    // tints (no cross, no sacred or culturally specific design) around a neutral plant drawing (plan §5 "Images").
    aria:"A corn stalk rises from the soil, a bean vine climbs it and squash leaves spread across the ground. Around the plants, a ring in four parts is labelled Food is sacred, Participation, Self-determination and Supportive policy. Two lines appear in turn: Food security asks: is there enough? Food sovereignty asks: who decides?",
    caption:"Four principles of Indigenous food sovereignty around corn, beans and squash growing together.",   // module-written
    lines:["Food security asks: is there enough?", "Food sovereignty asks: who decides?"]
  },
  goals:[
    "I can explain the difference between food security and food sovereignty.",
    "I can describe the principles of Indigenous food sovereignty as articulated by Indigenous organizations.",
    "I can describe specific Indigenous food systems, naming the Nations and places they belong to.",
    "I can explain how colonial policies and environmental harm disrupted Indigenous food systems and contribute to food insecurity today.",
    "I can analyse how community-led initiatives strengthen food sovereignty, and how allies can support without taking over.",
    "I can evaluate sources about Indigenous food systems for voice, perspective and accuracy."
  ],
  // module-written: the support note shown in the header Support dialog and above the footer
  support:SUPPORT,
  start:{
    // module-written care note (plan §1 teacher notes, §6.3; course plan §2 "Indigenous food systems")
    blocks:[
      { title:"Before you start", html:"<p>This module looks at the food systems of <strong>First Nations, Inuit and Métis</strong> peoples, which differ from Nation to Nation and are practised today. It also covers <strong>colonial policies</strong> that caused hunger and harm, including <strong>residential schools</strong>. Read at your own pace. One card in Explore offers a short summary you can choose instead of the full card.</p><p>Nobody here is asked to speak for a community. The brief you write at the end is an analysis in your own voice.</p>" },
      { html:SUPPORT }
    ],
    warmup:{
      questions:[
        { id:"w1", skill:"Food security components", goal:1,
          prompt:"A family can afford groceries, but the store’s food doesn’t fit their religious diet. Which component of food security is strained?",
          options:[
            { t:"Acceptability", ok:true, why:"Food must fit culture, religion and dietary needs." },
            { t:"Availability", why:"The food is in the store." },
            { t:"Adequacy", why:"The issue is fit, not nutrition." },
            { t:"Sustainability", why:"Nothing here is about reliability over time." }],
          hints:["Recall module 19’s five components.", "Is it about fit or amount?", "Acceptability."] },
        { id:"w2", skill:"Food security components", goal:1,
          prompt:"Which component describes access that holds up over time and in a crisis?",
          options:[
            { t:"Sustainability", ok:true, why:"Reliability over time." },
            { t:"Availability", why:"That’s whether food is physically there." },
            { t:"Accessibility", why:"That’s affording and reaching food now." },
            { t:"Adequacy", why:"That’s nutritional quality." }],
          hints:["Which word suggests “lasting”?", "Over time and in a crisis.", "Sustainability."] },
        // VERIFY: W3 (fatty fish as food sources of omega-3s and vitamin D). Skill named as in the plan's refresher list.
        { id:"w3", skill:"Nutrients in traditional foods", goal:3,
          prompt:"Fatty fish such as Arctic char are especially rich in which nutrients?",
          options:[
            { t:"Omega-3 fats and vitamin D", ok:true, why:"Fatty fish are among the best food sources of both." },
            { t:"Fibre and vitamin C", why:"Those come mainly from plants." },
            { t:"Mostly carbohydrates", why:"Fish has almost no carbohydrate." },
            { t:"Calcium only", why:"Fish bones add calcium, but the main nutrients are fats, protein and vitamin D." }],
          hints:["Think of module 02’s fats.", "Fish fat is unsaturated and rich in omega-3s.", "Omega-3s and vitamin D."] },
        { id:"w4", skill:"Food chains", goal:4,
          prompt:"A pollutant that builds up in fat becomes more concentrated at each step up a food chain. This is called…",
          options:[
            { t:"Biomagnification", ok:true, why:"The concentration grows at each step up the chain." },   // module-written why
            { t:"Photosynthesis", why:"That’s how plants make sugar." },
            { t:"Decomposition", why:"That’s breakdown by decomposers." },
            { t:"Dilution", why:"Dilution would mean less concentrated, the opposite." }],
          hints:["“Magnify” means make bigger.", "It grows up the chain.", "Biomagnification."] },
        { id:"w5", skill:"Food chains", goal:4,
          prompt:"In a lake with mercury pollution, which usually has the highest mercury concentration?",
          options:[
            { t:"Large predatory fish such as walleye (pickerel)", ok:true, why:"Top predators accumulate the most." },
            { t:"Algae", why:"Algae are at the bottom of the chain." },
            { t:"Small insects", why:"They’re low in the chain." },
            { t:"The water itself", why:"Concentrations in water are lowest; they build up in living things." }],
          hints:["Who eats whom?", "Each step concentrates it.", "The top predator."] },
        { id:"w6", skill:"Evaluating sources", goal:6,
          prompt:"Which source would best describe a particular Nation’s harvesting practices?",
          options:[
            { t:"Materials published by that Nation or an Indigenous-led organization, or knowledge shared by its knowledge keepers", ok:true, why:"Go to the people who hold the knowledge." },   // module-written why (hint 2)
            { t:"A travel blog", why:"An outsider’s impressions." },
            { t:"A website describing one “Indigenous diet” for all Nations", why:"Generalizes across many Nations. " + M1 },
            { t:"A 1950s textbook", why:"Outdated and written from outside." }],
          hints:["Whose knowledge is it?", "Go to the people who hold it.", "The Nation’s own sources."] }
      ],
      refreshers:{
        "Food security components":"Availability, accessibility, adequacy, acceptability, sustainability (module 19).",
        // VERIFY: nutrient claims about traditional foods (plan)
        "Nutrients in traditional foods":"Many country and traditional foods are nutrient-dense: fatty fish and marine mammals for omega-3s and vitamin D; game for iron and protein; berries for vitamin C.",
        "Food chains":"Fat-soluble pollutants build up at each step, so top predators, and people who eat them often, take in the most.",
        "Evaluating sources":"Ask who is speaking, from what perspective, and whether the community itself is the source."
      }
    }
  },
  explore:{
    heading:"Food sovereignty circle",
    intro:"Place cards on the circle to see what strengthens or undermines each principle. Then follow the timeline, and finally test the difference between food security and food sovereignty.",
    modes:[{ id:"circle", t:"Principles" }, { id:"time", t:"Timeline" }, { id:"grid", t:"Security vs sovereignty" }],
    // The four principles (plan's on-screen wording). VERIFY: the Working Group's wording; Dawn Morrison's role (plan §1).
    // Tints (plan §5 Colours): cerulean, violet, orange, blue; labels in --ink; never colour alone.
    principles:[
      { id:"sac", t:"Food is sacred", long:"Food is sacred", d:"food is a gift that comes with responsibilities to land, water, plants and animals.", tint:"t" },
      { id:"part", t:"Participation", long:"Participation", d:"food sovereignty is lived through daily action: harvesting, growing, preparing and sharing.", tint:"v" },
      { id:"self", t:"Self-determination", long:"Self-determination", d:"communities decide how their food is produced, harvested and distributed.", tint:"o" },
      { id:"pol", t:"Supportive policy", long:"Supportive legislation and policy", d:"laws and policies respect Indigenous rights and support Indigenous food systems.", tint:"b" }
    ],
    // module-written (plan §1 overview; plan §6.4 "one organization's articulation")
    principlesIntro:"As set out by the Working Group on Indigenous Food Sovereignty, founded in British Columbia by Dawn Morrison (Secwepemc). They are one organization’s words: many Nations describe their food systems in their own ways.",
    rings:{ in:"Inner ring: strengthens", out:"Outer ring: undermines" },   // plan §5 Colours (✚ inner, − outer)
    // TC1 cards (plan). note = module-written "Card note" readout line (plan readout table: one sentence about the placed card).
    kcards:[
      { id:"k1", code:"K1", t:"Giving thanks before a harvest, as practised in many Nations.", note:"Many Nations · the key action is giving thanks for food before it is taken.", answer:{ q:"sac", ring:"in" } },
      { id:"k2", code:"K2", t:"Youth spend a week at a land-based camp learning to fish, then share the catch with Elders.", note:"A land-based camp · the key actions are learning to fish and sharing the catch.", answer:{ q:"part", ring:"in" } },
      { id:"k3", code:"K3", t:"A First Nation writes and enforces its own fisheries management plan.", note:"A First Nation · the key action is deciding: the Nation writes and enforces the plan itself.", answer:{ q:"self", ring:"in" } },
      // VERIFY: K4 (government programs that help pay harvesting costs in northern communities)
      { id:"k4", code:"K4", t:"A government program helps pay harvesting costs such as fuel and equipment in northern communities.", note:"Northern communities · the key action is a government program that pays part of the cost.", answer:{ q:"pol", ring:"in" } }
    ],
    // TC2 cards (plan). VERIFY: every date before release (plan). short / note = module-written (timeline slots, card note).
    tcards:[
      { id:"ta", code:"T-a", date:"1870s–1880s", t:"Bison herds on the Prairies are nearly destroyed (1870s–1880s).", short:"Bison herds nearly destroyed",
        // VERIFY: from the plan's Final Check T3 B
        note:"Plains Nations · the Prairies · 1870s–1880s. Bison were central to food, clothing, trade and culture.", answer:{ pos:1, mark:"und" } },
      { id:"tb", code:"T-b", date:"1889", t:"The “peasant farming” policy restricts First Nations farmers’ use of machinery and their sales (1889).", short:"“Peasant farming” policy",
        // VERIFY: from the plan's TC2 feedback
        note:"First Nations farmers · 1889. The policy limited farmers to small-scale methods and controlled their sales.", answer:{ pos:2, mark:"und" } },
      { id:"tc", code:"T-c", date:"1942–1952", t:"Nutrition experiments on First Nations children in residential schools and on adults in northern Manitoba communities (1942–1952), documented by historian Ian Mosby (2013).", short:"Nutrition experiments",
        // VERIFY: from the plan's overview (residential schools underfed children; Mosby, 2013)
        note:"First Nations children in residential schools and adults in northern Manitoba communities · 1942–1952. Residential schools separated children from family food teachings and underfed them.",
        // module-written short, non-detailed summary (plan §1, §5: "a short, non-detailed summary is offered instead")
        sum:"Government nutrition research harmed First Nations children in residential schools and adults in northern communities (1942–1952).", sumShort:"Nutrition research (summary)",
        sumNote:"1942–1952. You chose the short summary; it counts the same for the challenge.", answer:{ pos:3, mark:"und" } },
      { id:"td", code:"T-d", date:"2007", t:"The UN General Assembly adopts the Declaration on the Rights of Indigenous Peoples (2007).", short:"UN Declaration adopted",
        note:"United Nations General Assembly · 2007. The Declaration sets out the rights of Indigenous peoples.", answer:{ pos:4, mark:"str" } },
      { id:"te", code:"T-e", date:"2021", t:"Canada passes the United Nations Declaration on the Rights of Indigenous Peoples Act (2021).", short:"Canada’s UN Declaration Act",
        note:"Canada · 2021. The Act implements the UN Declaration in Canada.", answer:{ pos:5, mark:"str" } }
    ],
    marks:{ str:"Strengthens", und:"Undermines" },
    // plan's content note (shown before the timeline's 1940s card), then the support lines
    contentNote:{ text:"The next card is about hunger and harm to children in residential schools. You can read the full card, or a short summary without detail. Support is available any time.",
      lines:LINES, full:"Read the full card", sum:"Read the short summary", swapFull:"Show the full card", swapSum:"Show the short summary instead" },
    // TC3 scenarios (plan). short = module-written grid label.
    scards:[
      { id:"s1", code:"S1", t:"More subsidized southern groceries are flown to a northern store.", short:"Subsidized groceries flown north", answer:"sec" },
      { id:"s2", code:"S2", t:"A community-run harvesting program fills a community freezer that the community manages and shares from.", short:"Community-run freezer", answer:"both" },
      { id:"s3", code:"S3", t:"A court recognizes a Nation’s right to manage its fishery, but the fish are too contaminated to eat often.", short:"Fishery right, contaminated fish", answer:"sov" },
      { id:"s4", code:"S4", t:"A company opens a mine upstream without the community’s consent, and the river’s fish decline.", short:"Mine opened without consent", answer:"none" }
    ],
    sNote:"Ask two separate questions: does it bring more nutritious food? Does it give the community more control over its food system?",   // module-written (TC3 hint 1)
    cols:"Improves food security?", rows:"Improves food sovereignty?",
    cells:[{ id:"both", t:"Both", sec:1, sov:1 }, { id:"sov", t:"Sovereignty only", sec:0, sov:1 }, { id:"sec", t:"Security only", sec:1, sov:0 }, { id:"none", t:"Neither", sec:0, sov:0 }],
    predictions:[
      { id:"p1", prompt:"Why have many Nations grown corn, beans and squash together?",
        options:[
          { t:"Corn gives beans a pole to climb, beans add nitrogen to the soil, and squash leaves shade the ground and hold in moisture.", ok:true },
          { t:"They ripen at exactly the same time." },
          { t:"Each completely keeps insects away from the others." },
          { t:"They each need different soil, so they share the field." }],
        // VERIFY: the nutrition claim (corn's carbohydrates, beans' protein, squash's vitamins)
        explain:"The three plants help each other grow, and together they make a balanced diet: corn’s carbohydrates, beans’ protein, squash’s vitamins. They also carry stories and teachings in Haudenosaunee and other Nations. " + M6 },
      { id:"p2", prompt:"In a northern community where hunters share country food, fuel for snowmobiles and boats doubles in price. What happens first?",
        options:[
          { t:"Fewer hunting trips, so less country food is shared and families rely more on expensive store food.", ok:true },
          { t:"Store prices fall." },
          { t:"Nothing changes, because hunting is a hobby." },
          { t:"The community stops sharing food." }],
        scenario:"Fuel for snowmobiles and boats: the price doubles.",   // module-written scenario card
        flow:["Fuel cost ↑", "Hunting trips ↓", "Country food shared ↓", "Store food bought ↑", "Food costs ↑"],
        // VERIFY: the Harvesters Support Grant
        explain:"Harvesting has real costs. That’s why harvesting support programs exist (for example, the Harvesters Support Grant)." },
      { id:"p3", prompt:"Mercury enters a river system from industry. In which will mercury concentration be highest?",
        options:[{ t:"Large predatory fish such as walleye", ok:true }, { t:"Algae" }, { t:"Small fish" }, { t:"River water" }],
        ladder:["River water", "Algae", "Small fish", "Large predatory fish (walleye)"],
        // VERIFY: the Grassy Narrows mercury history
        explain:"Biomagnification. For communities whose diets and cultures centre on fishing, contamination means losing safe food and a way of life. Grassy Narrows First Nation has lived with this since the 1960s. " + M7 },
      { id:"p4", prompt:"Sea ice forms later and breaks up earlier. Which part of the Inuit food system is affected first?",
        options:[{ t:"Safe travel to hunting areas", ok:true }, { t:"Store prices" }, { t:"Cooking methods" }, { t:"Seed supply" }],
        explain:"Thin ice makes travel dangerous and seasons unpredictable, so harvesting becomes harder and riskier. " + M7 }
    ],
    challenges:[
      { id:"tc1", goal:2, prompt:"<strong>Principles</strong> mode. Place these four cards so each principle has one strengthening card.",
        why:"Thanks → sacred; learning and sharing → participation; deciding → self-determination; a government program → supportive policy.",   // module-written (from the hints)
        hints:["Look for the key word: thanks, doing, deciding, law or program.", "Thanks → sacred; learning and sharing → participation.", "K1 sacred, K2 participation, K3 self-determination, K4 policy."],
        msgs:{
          tray:"Place all four cards on the circle first ({n} still in the tray).",   // module-written
          k3pol:"The Nation made the plan itself. Who is deciding?",
          k4self:"A government program is policy. It supports, but the community isn’t the one deciding here.",
          outer:"Does this card help or harm the principle?",
          general:"Check {n} more: which key word does each card show?" } },   // module-written
      { id:"tc2", goal:4, prompt:"<strong>Timeline</strong> mode. Put the five cards in date order and mark each one as strengthening or undermining food sovereignty.",
        why:"Losing the bison, the 1889 policy and the nutrition experiments undermined food sovereignty; the UN Declaration (2007) and Canada’s Act (2021) strengthen it.",   // module-written
        hints:["Start with the 1800s cards.", "1870s–80s, 1889, 1940s–50s, 2007, 2021.", "The first three undermine; the last two strengthen."],
        msgs:{
          tray:"Place all five cards on the timeline first ({n} still to place).",   // module-written
          mark:"Mark every card as strengthening or undermining ({n} not marked yet).",   // module-written
          de:"Canada’s Act implements the UN Declaration, so the Declaration came first.",
          // VERIFY: the policy's effects
          bstr:"The policy limited farmers to small-scale methods and controlled their sales: it undermined self-determination.",
          order:"Card {n} is out of order. Read the dates again.",   // module-written (readout wording)
          general:"Check the marks: did each event help or harm food sovereignty?" } },   // module-written
      { id:"tc3", goal:1, stretch:true, prompt:"<strong>Security vs sovereignty</strong> mode. Place each scenario in the grid.",
        why:"Security and sovereignty can move separately. The strongest initiatives improve both.",
        banner:"Security and sovereignty can move separately. The strongest initiatives improve both.",
        hints:["Ask two separate questions for each card: more nutritious food? More control over the food system?", "S2 answers yes to both. S4 answers no to both.", "S1 is security only; S3 is sovereignty only."],
        msgs:{
          tray:"Place all four scenarios in the grid first ({n} still in the tray).",   // module-written
          s1both:"Cheaper groceries help access, but who decides what food is produced and how? " + M3,
          s3both:"The right is recognized, but people still can’t safely eat the fish, so security hasn’t improved yet.",
          s4sec:"Fewer fish means less food, and no consent means less control.",
          general:"Ask the two questions again for each card: more nutritious food? More control?" } }   // module-written (hint 1)
    ],
    blocks:[
      // module-written: the plan's "aha" and overview (definitions; La Via Campesina). VERIFY: La Via Campesina and the 1996 World Food Summit.
      { title:"What the circle shows", html:"<p><strong>Food security</strong> asks whether people have enough safe, nutritious, acceptable food. <strong>Food sovereignty</strong> asks <strong>who decides</strong> how food is produced, harvested, shared and governed. The term was brought to world attention by the peasant movement La Via Campesina at the 1996 World Food Summit.</p><p>Food sovereignty is about who decides. Colonial policies attacked exactly that, and community-led work rebuilds it.</p>" },
      // plan overview "Colonial policies disrupted these systems", with a content note first (module-written).
      // VERIFY: Mosby (2013); the Grassy Narrows mercury history; higher food insecurity rates among Indigenous households.
      { title:"How colonial policies disrupted food systems", html:'<p class="ifs-cn"><strong>Content note:</strong> this section mentions residential schools and hunger. The support lines are in the <strong>Support</strong> button at the top of the page.</p>' +
        "<p>Colonial policies disrupted Indigenous food systems. They include dispossession of land, the near-destruction of the bison, Indian Act–era restrictions on First Nations farming and selling produce, and residential schools that separated children from family food teachings and underfed them, including the nutrition experiments documented by historian Ian Mosby (2013).</p>" +
        "<p>Contamination (such as mercury in the English–Wabigoon River system affecting Grassy Narrows First Nation) and climate change add to the harm today. Together with lower incomes and high remote food costs, these help explain why food insecurity rates are higher among Indigenous households.</p>" }
    ]
  },
  part3:{
    slug:"action", name:"In action", heading:"Food sovereignty in action",
    // module-written intro (plan: "why this activity suits the topic")
    intro:"Move from principles and history to present-day, community-led work. Analyse five initiative cards, sort what allies do from what takes over, then check what the data can and can’t show.",
    stations:[{ id:"s1", t:"1. Initiative cards" }, { id:"s2", t:"2. Allies, not designers" }, { id:"s3", t:"3. Check it with data" }],
    // module-written: the visible note about the placeholder cards (plan §1, §6.2)
    cardNote:"These five cards describe kinds of initiatives that First Nations, Inuit, Métis and urban Indigenous communities lead. Your teacher may replace each with a named initiative from that community’s own materials.",
    s1ask:"Which principles does this initiative strengthen? Choose two or more, then check.",   // module-written
    quoteNote:"Find how the community describes this work in its own materials, and credit it (APA).",   // module-written (the plan's quotation slot)
    // Plan Station 1 table. who / does / supports = module-written, from the plan's card types, model briefs and supports list.
    // VERIFY: replace every card before release (see the header comment).
    initiatives:[
      { id:"i1", code:"I1", t:"Seed keeping and Three Sisters gardens", who:"A Haudenosaunee community", does:"Gardeners grow, save and share heritage seeds for corn, beans and squash, the Three Sisters.", supports:"Land access; funding without strings", answer:["sac", "part", "self"] },
      { id:"i2", code:"I2", t:"A land-based youth harvesting camp", who:"A First Nation", does:"Youth learn to harvest on the land with Elders and share what they harvest.", supports:"Land and water access; funding without strings", answer:["part", "sac", "self"] },
      { id:"i3", code:"I3", t:"A community freezer and country food sharing program", who:"An Inuit community", does:"Local hunters harvest country food such as caribou and Arctic char, and the community shares it from a freezer it runs.", supports:"Funding for harvesting costs such as fuel and equipment, without strings", answer:["part", "self", "sac"] },
      { id:"i4", code:"I4", t:"Manoomin stewardship and harvest", who:"An Anishinaabe community", does:"The community stewards manoomin (wild rice) beds, harvests by canoe, and defends its harvest rights.", supports:"Policy recognition of harvesting rights; protection of water levels and quality", answer:["sac", "part", "self", "pol"] },
      { id:"i5", code:"I5", t:"An urban Indigenous food hub and community kitchen", who:"An urban Indigenous organization", does:"People cook, share meals and learn together in a kitchen and food hub the organization runs.", supports:"Space and funding without strings", answer:["part", "self"] }
    ],
    // module-written Station 1 feedback
    s1fb:{ few:"Choose at least two principles.", ok:"Those principles fit this initiative.", also:"It also shows: {list}.",
      pol:"This card doesn’t describe a law or government policy.", other:"This card doesn’t describe that principle. Look at what the initiative does." },
    s2:{ ask:"Sort each statement: is it a respectful ally action, or does it take over?", cols:[{ id:"ally", t:"Respectful ally action" }, { id:"takes", t:"Takes over" }],   // module-written ask
      items:ALLY, done:"All sorted. " + M5, off:"{n} statements are in the wrong column. Ask: who decides here?" },   // module-written done / off
    // Station 3 (plan). No figures are supplied: each row names its source; the teacher adds the current figure and year.
    // VERIFY: every statistic, source and year before release; the survey's coverage (plan §6.5).
    s3:{ intro:"Each figure below comes from a named source. Your teacher adds the latest figure and its year; check each one against the source before you use it.",   // module-written
      rows:[
        { t:"Food insecurity rates among Indigenous households", src:"PROOF, from the Canadian Income Survey", cover:"This survey doesn’t cover First Nations reserves or the territories." },
        { t:"Food costs in fly-in communities compared with southern cities", src:"Nutrition North Canada reports", cover:"Reports on communities eligible for the program." },   // module-written coverage
        { t:"The number of long-term drinking water advisories", src:"Indigenous Services Canada", cover:"Counts advisories on public systems on First Nations reserves." }   // module-written coverage
      ],
      figure:"Figure and year: added by your teacher from the latest report",   // module-written
      q:"What does this survey leave out, and why does that matter?",
      // module-written options; the answer is the plan's coverage gap (plan Station 3, §6.5)
      options:[
        { t:"First Nations reserves and the territories, so national figures undercount food insecurity among Indigenous households", ok:true, why:"The survey misses many of the communities where food costs are highest, so national figures undercount." },
        { t:"Large cities", why:"Cities are covered. Look at the coverage line for the first source." },
        { t:"Households with children", why:"Families with children are covered. Look at the coverage line for the first source." },
        { t:"Nothing: it covers every household in Canada", why:"No survey covers everyone. Look at the coverage line for the first source." }] },
    blocks:[
      // plan overview "Indigenous food systems are many, specific and living". VERIFY: each example.
      { title:"Living food systems", html:"<p>Indigenous food systems are many, specific and living. They differ by Nation, land and water. For example:</p><ul><li>Haudenosaunee and other Eastern Woodlands Nations grow the <strong>Three Sisters</strong> (corn, beans, squash);</li><li>Anishinaabe communities harvest <strong>manoomin</strong> (wild rice);</li><li>Inuit communities rely on <strong>country food</strong> (such as caribou, seal and Arctic char) and its sharing networks;</li><li>Pacific Coast Nations steward salmon and clam gardens;</li><li>Métis harvesters hunt and gather.</li></ul><p>These are present-day practices, not only history.</p>" },
      { title:"Communities lead", html:"<p>Communities lead revitalization: seed keeping, harvesting programs, land-based learning, community freezers and the stewardship of waters. Allies support by respecting rights, backing policy change and following community leadership, never by designing solutions <em>for</em> communities.</p>" },
      // module-written source list. VERIFY: each reference (authors, titles, numbers).
      { title:"Sources named in this module (APA 7)", html:'<ul class="hfa-refs">' +
        "<li>Mosby, I. (2013). Administering colonial science: Nutrition research and human biomedical experimentation in Aboriginal communities and residential schools, 1942–1952. <i>Histoire sociale/Social History, 46</i>(91), 145–172.</li>" +
        "<li>United Nations General Assembly. (2007). <i>United Nations Declaration on the Rights of Indigenous Peoples</i> (A/RES/61/295). United Nations.</li>" +
        "<li><i>United Nations Declaration on the Rights of Indigenous Peoples Act</i>, S.C. 2021, c. 14.</li></ul>" }
    ],
    quickCheck:{
      title:"In action quick check", summary:"In action quick check",
      // Correct-choice lines are module-written ("Right." + the plan's feedback line).
      items:[
        { id:"q1", goal:5, prompt:"Who should lead a community’s food sovereignty initiative?",
          choices:[{ t:"The community or Nation", ok:true, fb:"Right. Self-determination means the community decides." },
                   { t:"An outside charity", fb:"Self-determination means the community decides." },
                   { t:"A food company", fb:"Self-determination means the community decides." },
                   { t:"A school club", fb:"Self-determination means the community decides." }] },
        { id:"q2", goal:5, prompt:"Which is a respectful ally action?",
          choices:[{ t:"Advocating for policies that recognize harvesting rights", ok:true, fb:"Right. Support rights and follow community leadership." },
                   { t:"Designing a program for them without asking", fb:"Support rights and follow community leadership." },
                   { t:"Teaching them how to eat healthily", fb:"Support rights and follow community leadership." },
                   { t:"Speaking for them", fb:"Support rights and follow community leadership." }] },
        { id:"q3", goal:2, prompt:"A seed-keeping network gives thanks before planting. Which principle does this show most directly?",
          choices:[{ t:"Food is sacred", ok:true, fb:"Right. Giving thanks shows food as a sacred gift." },
                   { t:"Supportive policy", fb:"Giving thanks shows food as a sacred gift." },
                   { t:"Self-determination", fb:"Giving thanks shows food as a sacred gift." },
                   { t:"Participation", fb:"Giving thanks shows food as a sacred gift." }] },
        { id:"q4", goal:2, prompt:"A Nation writing its own fishery plan shows…",
          choices:[{ t:"Self-determination", ok:true, fb:"Right. The community decides how its fishery is run." },
                   { t:"Supportive policy", fb:"The community decides how its fishery is run." },
                   { t:"Food is sacred", fb:"The community decides how its fishery is run." },
                   { t:"Availability", fb:"The community decides how its fishery is run." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"terms", type:"match", title:"Terms and meanings", summary:"Terms and meanings", goal:[1, 2, 3],
        instruction:"Tap a term, then tap its meaning. One meaning has no partner.", how:"",   // module-written
        leftTitle:"Term", rightTitle:"Meaning",
        // Hint 2 (a narrowing clue) and hint 3 (the pair) are module-written from the plan's pairs.
        left:[
          { id:"l1", t:"Food sovereignty", hints:["Look for the key idea in the term.", "It’s about the right to define a food system, not only about having enough food.", "Food sovereignty ↔ the right of peoples to define their own food systems."] },
          { id:"l2", t:"Country food", hints:["Look for the key idea in the term.", "Food harvested from the land and water, in the North.", "Country food ↔ food harvested from the land and water, such as caribou, seal and Arctic char."] },
          { id:"l3", t:"Three Sisters", hints:["Look for the key idea in the term.", "Three plants grown together.", "Three Sisters ↔ corn, beans and squash grown together."] },
          { id:"l4", t:"Manoomin", hints:["Look for the key idea in the term.", "It grows in lakes and rivers.", "Manoomin ↔ wild rice, harvested by Anishinaabe communities."] },
          { id:"l5", t:"Biomagnification", hints:["Look for the key idea in the term.", "“Magnify”: something gets more concentrated up a food chain.", "Biomagnification ↔ a pollutant’s concentration rising at each step up a food chain."] },
          { id:"l6", t:"Self-determination", hints:["Look for the key idea in the term.", "A people deciding for themselves.", "Self-determination ↔ a people deciding for themselves how they live and govern."] },
          { id:"l7", t:"UN Declaration on the Rights of Indigenous Peoples", hints:["Look for the key idea in the term.", "An international declaration, followed by a Canadian Act.", "UN Declaration ↔ adopted in 2007; Canada passed an Act to implement it in 2021."] },
          { id:"l8", t:"Traditional knowledge", hints:["Look for the key idea in the term.", "Knowledge passed on within communities.", "Traditional knowledge ↔ knowledge held and passed on within communities."] }
        ],
        right:[
          { id:"r1", t:"The right of peoples to define their own food systems, including healthy, culturally appropriate food produced in sustainable ways" },
          { id:"r2", t:"Food harvested from the land and water, such as caribou, seal and Arctic char in many Inuit communities" },
          { id:"r3", t:"Corn, beans and squash grown together by Haudenosaunee and other Nations" },
          { id:"r4", t:"Wild rice, harvested from lakes and rivers by Anishinaabe communities" },
          { id:"r5", t:"A pollutant’s concentration rising at each step up a food chain" },
          { id:"r6", t:"A people deciding for themselves how they live and govern, including their food systems" },
          // VERIFY: 2007 and 2021
          { id:"r7", t:"A UN declaration of Indigenous peoples’ rights, adopted in 2007; Canada passed an Act to implement it in 2021" },
          { id:"r8", t:"Knowledge held and passed on within communities about land, food and relationships" },
          // module-written distractor: the food security definition the plan's mismatch feedback refers to (plan overview wording)
          { id:"r9", t:"Having enough safe, nutritious, acceptable food" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{ "l1|r9":"That’s food security. Sovereignty is about who decides.", "l6|r9":"That’s food security. Self-determination is about who decides." },   // l6 line module-written
        wrongDefault:"Look for the key idea in the term." },
      { id:"sources", type:"mc", title:"Source and voice", summary:"Source and voice", star:true, goal:6,
        instruction:"Choose the best answer for each item. Items 3 to 6 are non-routine (★).",   // module-written
        // module-written: in each item, the correct answer's why and the two wrong answers the plan doesn't give.
        items:[
          { id:"v1", goal:6, prompt:"You want to learn about a particular Nation’s harvesting practices. Which source should come first?",
            options:[
              { t:"The Nation’s own publications or knowledge keepers", ok:true, why:"The Nation is the primary authority on its own practices." },
              { t:"An encyclopedia", why:"Useful background, but the Nation is the primary authority on its own practices." },
              { t:"A travel blog by a visitor", why:"An outsider’s impressions." },
              { t:"A social media post by someone outside the Nation", why:"An outside view, with no check on accuracy." }],
            hints:vh("the Nation’s own publications or knowledge keepers.") },
          { id:"v2", goal:6, prompt:"A website says “Native Americans ate mostly corn.” What’s the main problem?",
            options:[
              { t:"It generalizes across many different Nations and places (and uses the past tense)", ok:true, why:M1 + " " + M2 },
              { t:"It’s spelled wrong", why:"The problem is the generalization." },
              { t:"It should say wheat instead of corn", why:"Swapping one food for another keeps the problem: one diet for many Nations." },
              { t:"Nothing: some Nations grow corn", why:"Some Nations grow corn, but the sentence lumps all Nations together and puts them in the past." }],
            hints:vh("it generalizes across many different Nations and places, and uses the past tense.") },
          { id:"v3", goal:[6, 4], prompt:"★ A government report and a community-led report give different reasons why country food use has fallen. What’s the best research approach?",
            options:[
              { t:"Read both; note whose perspective each represents; give weight to the community’s account of its own experience; compare dates and methods", ok:true, why:"Each report shows a perspective. The community’s account carries weight for its own experience, and dates and methods show how each was made." },
              { t:"Use only the government report: it’s official", why:"Official doesn’t mean complete. Whose experience is it?" },
              { t:"Use whichever report is shorter", why:"Length doesn’t decide credibility. Compare perspective, dates and methods." },
              { t:"Average the two reports’ reasons", why:"Reasons can’t be averaged. Note whose perspective each represents." }],
            hints:vh("read both, note whose perspective each represents, give weight to the community’s account of its own experience, and compare dates and methods.") },
          { id:"v4", goal:6, prompt:"★ Which is the best research question (A1.3)?",
            options:[
              { t:"“How do community members describe the effects of harvesting supports on country food sharing in one Nunavut community?”", ok:true, why:"It names one community and lets its members describe their own experience." },
              { t:"“Why don’t Indigenous families eat healthy food?”", why:"That’s a deficit question that assumes the answer. " + M4 },
              { t:"“What is the Indigenous diet?”", why:M1 },
              { t:"“Is country food better than store food?”", why:"Too broad: better for what, for whom, and who decides? A good question names a community and lets its members speak." }],
            hints:vh("the question about how community members in one Nunavut community describe the effects of harvesting supports.") },
          { id:"v5", goal:6, prompt:"★ Two peer-reviewed articles study one First Nation’s food system. One was co-authored with the community; one had no community involvement. Which is stronger evidence for the community’s experience, and why?",
            options:[
              { t:"The co-authored article: it includes the community’s voice and consent", ok:true, why:"For the community’s own experience, its voice and consent matter." },
              { t:"Neither; peer review makes them equal", why:"Peer review checks methods, not whose voice is included." },
              { t:"The article with no community involvement: outsiders are more objective", why:"Outsiders can miss what matters most to the community. Whose experience is it?" },
              { t:"Whichever is newer", why:"Dates matter, but the question is whose voice and consent are included." }],
            hints:vh("the co-authored article, because it includes the community’s voice and consent.") },
          { id:"v6", goal:6, prompt:"★ An article from 1975 describes “Indigenous diets” in general. What’s its main limitation?",
            options:[
              { t:"It’s outdated, written from outside, and generalizes across Nations", ok:true, why:"Age, perspective and generalization all limit it. " + M1 },
              { t:"It’s too short", why:"Length isn’t the issue: age, perspective and generalization are." },
              { t:"It has no pictures", why:"Pictures aren’t the issue: age, perspective and generalization are." },
              { t:"It uses too many statistics", why:"Statistics aren’t the issue: age, perspective and generalization are." }],
            hints:vh("it’s outdated, written from outside, and generalizes across Nations.") }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Uchenna", goal:[1, 3, 4],
        instruction:"Uchenna made one mistake in each answer. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.", how:"",
        problems:[
          // VERIFY: E1 step 1 (higher food insecurity rates among Indigenous households)
          { id:"e1", goal:4, task:"Explain why food insecurity rates are higher among Indigenous households.",
            steps:["“Research shows higher food insecurity rates among Indigenous households.”", "“Colonial policies took many communities’ lands and restricted harvesting and farming.”", "“Residential schools separated children from family food teachings.”", "“So the main cause today is that Indigenous families don’t value healthy food.”"],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"“Today’s gaps reflect these histories plus lower incomes, high food costs in remote communities, and contamination and climate impacts on harvesting.”", ok:true, why:M4 },
              { t:"“So the cause today is genetics.”", why:"Unsupported; the causes are social and environmental." },
              { t:"“So the problem ended when the schools closed.”", why:"The effects continue, and new harms have been added." },
              { t:"“Step 4 is correct.”", why:M4 }],
            hints:["Does step 4 follow from steps 2 and 3?", "It blames people instead of the causes.", "Policies, income, cost, contamination, climate."] },
          { id:"e2", goal:3, task:"Describe the Three Sisters.",
            steps:["“The Three Sisters are corn, beans and squash grown together.”", "“Indigenous people all grew the Three Sisters.”", "“The beans add nitrogen to the soil for the corn.”"],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 is correct, but there’s an earlier mistake."],
            fixes:[
              { t:"“Haudenosaunee and other Eastern Woodlands Nations grow the Three Sisters. Food systems differ by Nation and land: other Nations centre salmon, manoomin, caribou or bison.”", ok:true, why:M1 },
              { t:"“Indigenous people used to grow the Three Sisters.”", why:"These gardens are grown today too. " + M2 },
              { t:"“Only the Haudenosaunee have ever grown corn.”", why:"Other Nations grow corn as well; the point is that systems differ." },
              { t:"“Step 2 is correct.”", why:M1 }],
            hints:["Is any food system shared by all Nations?", "No: food systems are specific to land and Nation.", "Name the Nations."] },
          { id:"e3", goal:1, task:"Is shipping more subsidized groceries north an example of food sovereignty?",
            steps:["“A subsidy can lower store prices.”", "“Lower prices can improve access to food.”", "“Because access improves, the community has more control over its food system, so this is food sovereignty.”"],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"“It may improve food security, but sovereignty is about who decides how food is produced, harvested and governed. A subsidy decided and run elsewhere doesn’t change that.”", ok:true, why:M3 },
              { t:"“It’s neither security nor sovereignty.”", why:"It can help access." },
              { t:"“Sovereignty only means growing all your own food.”", why:"It’s about control and decision-making, not total self-sufficiency." },
              { t:"“Step 3 is correct.”", why:M3 }],
            hints:["What does sovereignty ask?", "Who decides?", "Security yes; sovereignty not necessarily."] }
        ] }
    ]
  },
  reflect:{
    journalNote:"Your journal stays on this device. Write in your own voice.",
    blocks:[{ html:SUPPORT }],
    journal:[
      { id:"j1", q:"What changed in how you think about the difference between food security and food sovereignty?" },
      { id:"j2", q:"In your own words, why can’t more food deliveries alone repair what colonial policies disrupted?" },
      { id:"j3", q:"Explain to a friend one Indigenous food system you learned about, naming the Nation and the place." },
      { id:"j4", q:"What’s one action you could take as an ally that follows Indigenous leadership? What will you do next?" }
    ]
  },
  final:{
    // Correct-answer whys are module-written where the plan gives none; misconception tags use the plan's core sentences.
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which question does food sovereignty ask that food security doesn’t?",
          options:[
            { t:"“Who decides how food is produced, harvested and shared?”", ok:true, why:"That’s the sovereignty question: who decides." },
            { t:"“Is there enough food in the store?”", why:"That’s availability, a food security question. " + M3 },
            { t:"“Can people afford the food?”", why:"That’s accessibility." },
            { t:"“Is the food nutritious?”", why:"That’s adequacy." }] },
        b:{ prompt:"Which best defines food sovereignty?",
          options:[
            { t:"The right of peoples to define their own food systems, including healthy, culturally appropriate food produced in sustainable ways", ok:true, why:"Peoples define their own food systems: that’s who decides." },
            { t:"Having enough calories every day", why:M3 },
            { t:"Importing food from many countries", why:"That’s about trade, not control." },
            { t:"A charity’s program to deliver food", why:M3 }] } },
      { id:"k2", cat:"K", goal:2,
        // VERIFY: the Working Group's principles (K2 A)
        a:{ prompt:"Which is one of the principles of Indigenous food sovereignty described by the Working Group on Indigenous Food Sovereignty?",
          options:[
            { t:"Participation", ok:true, why:"Food sovereignty is lived through daily practice." },
            { t:"Profitability", why:"Not one of the principles." },
            { t:"Export growth", why:"Not one of the principles." },
            { t:"Calorie targets", why:"Not one of the principles." }] },
        b:{ prompt:"The principle that communities decide how their food is produced, harvested and distributed is…",
          options:[
            { t:"Self-determination", ok:true, why:"Communities deciding for themselves is self-determination." },
            { t:"Food is sacred", why:"That’s about food as a gift with responsibilities." },
            { t:"Supportive policy", why:"That’s about laws and policies that respect rights." },
            { t:"Participation", why:"That’s about daily action." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"The Three Sisters, grown by the Haudenosaunee and other Nations, are…",
          options:[
            { t:"corn, beans and squash", ok:true, why:"Corn, beans and squash grown together; each helps the others grow." },
            { t:"corn, wild rice and berries", why:"Wild rice (manoomin) is harvested from lakes and rivers." },
            { t:"squash, potatoes and beans", why:"Potatoes aren’t one of the Three Sisters." },
            { t:"beans, sunflowers and tobacco", why:"Not the Three Sisters." }] },
        b:{ prompt:"Manoomin, harvested by Anishinaabe communities, is…",
          options:[
            { t:"wild rice, harvested from lakes and rivers", ok:true, why:"Manoomin is wild rice, a grass seed." },
            { t:"a type of corn", why:"Corn is one of the Three Sisters." },
            { t:"a kind of fish", why:"Manoomin is a grain." },
            { t:"a berry", why:"It’s a grass seed (wild rice)." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Mercury enters a river system. Why are people who often eat walleye from it at the highest risk?",
          options:[
            { t:"Mercury concentrates at each step up the food chain, so predatory fish carry the most, and people who eat them often take in the most", ok:true, why:"Biomagnification: each step up the chain concentrates mercury." },
            { t:"Walleye produce mercury themselves", why:"The mercury comes from pollution." },
            { t:"Mercury evaporates from the water, so fish are safe", why:M7 },
            // VERIFY: cooking doesn't remove mercury
            { t:"Cooking removes mercury", why:"Cooking doesn’t remove mercury." }] },
        b:{ prompt:"Persistent pollutants carried north on air currents build up in the fat of Arctic marine mammals. Why does this matter for Inuit food systems?",
          options:[
            { t:"These fatty country foods are nutritionally and culturally important, so contamination forces harmful trade-offs", ok:true, why:"The foods where pollutants build up are the ones that matter most for nutrition and culture." },
            { t:"It doesn’t matter, because Arctic food is store-bought", why:"Country food remains central in many communities." },
            { t:"Pollutants only affect the animals, not people", why:M7 },
            { t:"Freezing removes the pollutants", why:"Freezing doesn’t remove them." }] } },
      { id:"t2", cat:"T", goal:1,
        a:{ prompt:"A charity in a southern city ships canned food to a northern community every winter. What does this change?",
          options:[
            { t:"It may improve food security in the short term, but not food sovereignty", ok:true, why:M3 },
            { t:"It improves food sovereignty, because more food arrives", why:M3 },
            { t:"It improves both, permanently", why:"It’s short-term and decided elsewhere." },
            { t:"It changes neither", why:"It can help access for a while." }] },
        b:{ prompt:"A Nation regains control of its fishery and runs a youth harvesting program, but fish stocks are low this year. What does this change?",
          options:[
            { t:"Food sovereignty is strengthened now; food security may improve as stocks recover", ok:true, why:"Control is regained now; more food depends on the fish stocks." },
            { t:"Neither, because there are few fish", why:"Control has been regained; that’s sovereignty." },
            { t:"Food security only", why:"The change in control is about sovereignty." },
            { t:"Both, immediately", why:"Low stocks limit food security this year." }] } },
      { id:"t3", cat:"T", goal:4,
        // VERIFY: higher food insecurity rates (T3 A); the bison history (T3 B)
        a:{ prompt:"Food insecurity rates are higher among Indigenous households in Canada. Which explanation is best supported?",
          options:[
            { t:"The combined effects of colonial policies (land dispossession, restrictions on farming and harvesting, residential schools), lower incomes, high food costs in remote communities, and contamination and climate impacts on harvesting", ok:true, why:M4 },
            { t:"A lack of interest in healthy food", why:M4 },
            { t:"Traditional foods are less nutritious", why:"Many are highly nutrient-dense." },
            { t:"Genetics alone", why:"Unsupported; the causes are social and environmental." }] },
        b:{ prompt:"Why did the near-destruction of the bison in the 1870s–80s cause such severe hunger among Plains Nations?",
          options:[
            { t:"Bison were central to food, clothing, trade and culture. With them gone, and Nations confined to reserves with inadequate rations, starvation and dependence followed", ok:true, why:"A central food source was lost while Nations were confined to reserves with inadequate rations." },
            { t:"Bison were a minor food source", why:"They were central." },
            { t:"The Nations chose to stop hunting", why:M4 },
            { t:"Crops immediately replaced the bison", why:"Farming was restricted and slow to establish (see T-b)." }] } },
      { id:"c1", cat:"C", goal:3,
        // VERIFY: the manoomin harvest season (C1 A)
        a:{ prompt:"Which sentence avoids generalizing across Indigenous peoples?",
          options:[
            { t:"“Many Anishinaabe communities harvest manoomin in late summer and early fall.”", ok:true, why:"It names the Nation, the food and the season, in the present tense." },
            { t:"“Indigenous people traditionally ate wild rice.”", why:"Which Nations, and where? " + M1 },
            { t:"“Native foods were simple.”", why:M1 + " " + M2 },
            { t:"“All Indigenous cultures share the same foods.”", why:M1 }] },
        b:{ prompt:"Which sentence avoids describing Indigenous food systems only in the past?",
          options:[
            { t:"“Haudenosaunee seed keepers continue to grow and share Three Sisters seeds today.”", ok:true, why:"A named Nation and a living practice, in the present tense." },
            { t:"“Indigenous people used to grow the Three Sisters.”", why:M2 },
            { t:"“Traditional foods were lost long ago.”", why:M2 },
            { t:"“Indigenous food was part of history.”", why:M2 }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which statement best describes an ally’s role in Indigenous food sovereignty?",
          options:[
            { t:"“Follow community leadership, support rights and policy change, and fund without controlling.”", ok:true, why:"That’s allyship: the community leads." },
            { t:"“Design better food programs for communities.”", why:M5 },
            { t:"“Teach communities about nutrition.”", why:TEACH },
            { t:"“Speak on behalf of communities at public meetings.”", why:M5 }] },
        b:{ prompt:"A student group wants to help a nearby First Nation’s food program. What’s the best first step?",
          options:[
            { t:"“Contact the community or its organization, ask what support (if any) is wanted, and follow their lead.”", ok:true, why:"Ask first, then follow the community’s lead." },
            { t:"“Start a food drive and deliver it to the community.”", why:"Ask first. " + M5 },
            { t:"“Write a nutrition guide for the community.”", why:TEACH },
            { t:"“Post about the community online to raise awareness.”", why:"Ask before speaking about a community." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A community freezer program shares country food harvested by local hunters, run by the community. Which two principles does it most directly strengthen?",
          options:[
            { t:"Participation and self-determination", ok:true, why:"Hunters and households take part, and the community runs it." },
            { t:"Supportive policy and food is sacred", why:"It’s community-run action, not a law." },
            { t:"Supportive policy only", why:"Nothing here is a law or government program." },
            { t:"None; it’s only about food security", why:"It’s community-run, which is about control. " + M3 }] },
        b:{ prompt:"A seed-keeping network saves and shares heritage seeds, with ceremonies of thanks at planting. Which two principles does it most directly strengthen?",
          options:[
            { t:"Food is sacred and participation", ok:true, why:"Thanks at planting shows food as sacred; saving and sharing seed is participation." },
            { t:"Supportive policy and self-determination", why:"No law is involved; the ceremony points to sacredness." },
            { t:"Supportive policy only", why:"Not a government action." },
            { t:"None", why:"Seed keeping is food sovereignty in action. " + M6 }] } },
      { id:"a2", cat:"A", goal:4,
        // VERIFY: long-term drinking water advisories (A2 A)
        a:{ prompt:"A First Nation has a long-term drinking water advisory. What is the most direct food-related effect?",
          options:[
            { t:"Safe water is needed to prepare food and infant formula and for cleaning; buying bottled water raises costs and adds to food insecurity", ok:true, why:"Without safe tap water, cooking, formula and cleaning depend on water families must buy." },
            { t:"None, because water isn’t food", why:"Water is a nutrient and essential for preparing food." },
            { t:"It only affects swimming", why:"Drinking and cooking water are affected." },
            { t:"It lowers food prices", why:"It raises household costs." }] },
        b:{ prompt:"Thinner sea ice makes travel to hunting areas less safe. What is the most direct food-system effect?",
          options:[
            { t:"Fewer safe hunting trips, so less country food and more reliance on expensive store food", ok:true, why:"Thin ice makes travel dangerous, so harvesting becomes harder and riskier." },
            { t:"Store food becomes cheaper", why:"Shipping costs don’t fall." },
            { t:"More hunting, because seasons are longer", why:"Unsafe ice reduces safe travel." },
            { t:"No effect on food", why:M7 }] } }
    ]
  },
  task:{
    title:"Strengthen the circle: an initiative brief",
    summary:"Strengthen the circle",
    statement:"<p>Write a short analysis brief about one community-led initiative. Explain which principles it strengthens, who leads it, and how allies can support it, in your own voice and with credible sources. There’s more than one good brief.</p>",
    checks:["Principles fit the initiative", "Community-led", "Ally, not designer", "Credible voices", "Right length", "Source cited", "Specific and present"],
    tips:["Check the card: which principles does this initiative actually show?", "Who is leading? Self-determination means the community.", "Swap any “takes over” action for one that follows the community’s lead.", "Add a source in the community’s or an Indigenous-led organization’s own voice.", "Keep it to 120–220 words.", "Cite in APA: (Author, Year) or (Author, n.d.).", "Name the Nation and write in the present tense: these food systems are living."],
    explainPrompt:"Explain how you chose the principles and ally actions, and why your sources are credible for this community’s experience.",
    vocab:"Use the words food sovereignty, self-determination, participation and ally.",
    success:"Your brief meets every line!",   // module-written
    checkLabel:"Check my brief",   // module-written
    // Task inputs (plan). ids are used by app.js; the community-led chip and the respectful actions are the plan's tests.
    leads:[{ id:"community", t:"Community or Nation" }, { id:"charity", t:"Outside charity" }, { id:"gov", t:"Government" }, { id:"company", t:"Company" }],
    evidence:[{ id:"own", t:"The Nation’s or community’s own materials" }, { id:"org", t:"A report from an Indigenous-led organization" }, { id:"peer", t:"Peer-reviewed research co-authored with the community" }, { id:"blog", t:"A general blog" }],
    blocked:["the Indigenous diet", "all Indigenous", "Indigenous people used to", "traditions were lost", "primitive"],
    // module-written control labels
    labels:{ init:"Initiative", princ:"Principles strengthened", princSub:"choose 2 or more", lead:"Who leads", ally:"Ally actions", allySub:"choose 2", ev:"Evidence", evSub:"choose 1 to 3", brief:"Your brief", briefSub:"120–220 words, saved on this device",
      words:"{n} words (120–220)", cites:"Citations found: {list}", noCite:"No APA citation found yet, e.g. (Author, 2023) or (Author, n.d.)", flagged:"Rewrite: {list}", pick:"Choose an initiative card first.", save:"Save the brief as a text file", saved:"Saved as a text file.", noSave:"Saving didn’t work in this browser." }
  },
  cards:[
    ["Food sovereignty", "Peoples’ right to define their own food systems: who decides how food is produced, harvested, shared and governed."],
    ["Food security vs sovereignty", "Security: is there enough nutritious food? Sovereignty: who decides?"],
    ["Food is sacred", "Food is a gift that comes with responsibilities to land, water, plants and animals."],
    ["Participation", "Food sovereignty lived through daily harvesting, growing, preparing and sharing."],
    ["Self-determination", "Communities decide how their food is produced, harvested and distributed."],
    // VERIFY: cards 6 and 11
    ["Supportive policy", "Laws and policies that respect Indigenous rights and support food systems, e.g. the UN Declaration on the Rights of Indigenous Peoples Act (2021)."],
    ["Three Sisters", "Corn, beans and squash grown together by Haudenosaunee and other Nations; each helps the others grow."],
    ["Manoomin", "Wild rice, harvested and stewarded by Anishinaabe communities."],
    ["Country food", "Food from the land and water, such as caribou, seal and Arctic char, shared through community networks."],
    ["Biomagnification", "Pollutants concentrate up the food chain, making predatory fish and marine mammals the most affected."],
    ["Colonial disruption", "Land loss, the bison’s destruction, farming restrictions, residential schools and nutrition experiments."],
    ["Respectful allyship", "Follow community leadership, support rights and policy, fund without controlling."]
  ]
};
