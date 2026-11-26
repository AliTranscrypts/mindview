// HFA4U 19 Food Security in Canada. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/19-food-security-canada.md
// Teacher notes: lines marked VERIFY carry the plan's "verify before release" flags (students see the plan's wording without
// them) and every value or line this module had to supply. "module-written" marks text that isn't in the plan.
// Module rules (plan §1 and §6): the module never asks about a student's own household; all analysis uses five fictional
// persona households (model data, labelled on screen); food insecurity is framed as income compared with costs, never as
// skills or choices; the support note shows on the hero, in Explore, in Part 3 and on the performance task.
// VERIFY (plan §6.1, applies to the whole module): every research statement (PROOF / Canadian Income Survey patterns, food
// bank use, the post-65 drop, child benefits, the National School Food Program announced in 2024, northern food prices,
// Nutrition North Canada) must be checked and dated before release. The explorer and Practice 2 use labelled model data.
// VERIFY (plan §6.4): each level-of-government pairing in Part 3 Station 3 (and the task key that reuses it).
// Teacher note (plan §6.2): avoid any classroom activity that invites students to share their own family's food situation.

// VERIFY: 211 and Kids Help Phone numbers before release (plan §1 support note).
const SUPPORT = '<div class="hfa-support" role="note"><p>If you or your family are having a hard time getting enough food, you’re not alone and it isn’t your fault. You can talk to someone you trust at school, call or text <span class="nw">211</span> to find local food programs and supports, or contact Kids Help Phone (<span class="nw">1-800-668-6868</span>, text CONNECT to <span class="nw">686868</span>).</p></div>';

// Misconception core sentences (plan §3); "(verify)" flags moved to these comments.
// VERIFY: M1 "similar food skills"; M2 most don't use food banks; M4 main income from jobs; M7 children's health.
const M1 = "The gap comes from income compared with costs. Research finds food-insecure households have food skills similar to everyone else’s.";
const M2 = "Most food-insecure households don’t use food banks, and a hamper covers a few days, not a monthly gap.";
const M3 = "Food security also needs adequacy (nutritious food) and acceptability (food that fits culture, religion and dignity).";
const M4 = "Most food-insecure households in the provinces get their main income from jobs: wages too low for the costs.";
const M5 = "What matters is income compared with costs. Walter earns less than Celine but has lower costs; northern families face much higher food prices.";
const M6 = "Each policy has a home: the Canada Child Benefit is federal (your MP); Ontario Works rates are provincial (your MPP).";
const M7 = "Children in food-insecure households have poorer health on average, even when parents go without to protect them.";

// Policies (Part 3 Station 3 table = the performance task key). answer = the desk(s) that decide it in Ontario.
// sup/hh: the explorer support each policy maps to and the households it applies to (task checklist line 3).
// names: what counts as naming the policy in the letter (line 4; module-written short forms such as ODSP and OAS).
// why: module-written reason shown in Station 3. VERIFY: every pairing (plan §6.4), especially school food.
const ALL = ["H1", "H2", "H3", "H4", "H5"];
const POLICIES = [
  { id:"ccb", t:"Canada Child Benefit", answer:["mp"], desk:"Federal: your MP", sup:"P1", hh:["H1", "H2", "H5"], names:["Canada Child Benefit"],
    why:"The Canada Child Benefit is a federal program." },
  { id:"oas", t:"Old Age Security and the Guaranteed Income Supplement", answer:["mp"], desk:"Federal: your MP", sup:"P1", hh:ALL, names:["Old Age Security", "Guaranteed Income Supplement", "OAS", "GIS"],
    why:"Old Age Security and the Guaranteed Income Supplement are federal pensions." },
  { id:"nnc", t:"Nutrition North Canada", answer:["mp"], desk:"Federal: your MP", sup:"P5", hh:["H5"], names:["Nutrition North"],
    why:"Nutrition North Canada is a federal program." },
  { id:"sfp", t:"National School Food Program funding", answer:["mp", "mpp"], desk:"Federal (your MP); provinces deliver it, so your MPP is also accepted", sup:"P3", hh:ALL, names:["School Food Program", "school food", "school meal"],
    why:"The funding is federal (your MP), and provinces deliver it, so your MPP is also accepted." },
  { id:"ow", t:"Ontario Works and ODSP rates", answer:["mpp"], desk:"Provincial: your MPP", sup:"P1", hh:ALL, names:["Ontario Works", "ODSP", "Ontario Disability Support Program"],
    why:"Ontario Works and ODSP are provincial programs." },
  { id:"mw", t:"Minimum wage (most workers)", answer:["mpp"], desk:"Provincial: your MPP", sup:"P1", hh:["H1", "H2", "H4"], names:["minimum wage"],
    why:"Ontario sets the minimum wage for most workers." },
  { id:"rent", t:"Rent rules and rent supplements", answer:["mpp"], desk:"Provincial: your MPP", sup:"P2", hh:ALL, names:["rent supplement", "rent rule", "rent control"],
    why:"Rent rules and rent supplements are set by the province." },
  { id:"local", t:"Local transit routes and community garden space", answer:["cc"], desk:"Municipal: your city councillor", sup:null, hh:[], names:["transit", "community garden"],
    why:"Cities decide local transit routes and community garden space." }
];

// Practice 1 (Which component?): one module-written mismatch line per item; the plan's line for item 2 → Availability.
const SORT_HINT1 = "Is the food there? Can they get it? Is it nutritious? Does it fit? Will it last?";
const BOXES = ["avail", "access", "adequacy", "accept", "sustain"];
const BOXNAME = { avail:"Availability", access:"Accessibility", adequacy:"Adequacy", accept:"Acceptability", sustain:"Sustainability" };
function comp(id, t, ans, key, miss, why, special){
  const wrong = {};
  BOXES.filter(b => b !== ans).forEach(b => { wrong[b] = (special && special[b]) || miss; });
  return { id, t, answer:ans, why, wrong, hints:[SORT_HINT1, key, BOXNAME[ans] + "."] };
}

export default {
  id:"19-food-security-canada",
  kind:"topic",
  title:"Food security in Canada",
  topic:"Food Security in Canada",
  readyTopic:"food security in Canada",
  hero:{
    headline:"Food insecurity is a money problem before it’s a food problem.",
    text:"In Canada, most people who struggle to get enough nutritious food live near full grocery stores. The problem is <strong>access</strong>: income that can’t cover rent, essentials <em>and</em> a <strong>nutritious food basket</strong>. In this module you’ll test <strong>five components of food security</strong>, see what really closes the gap, and take your findings to the people who decide.",
    fig:{ html:'<div class="fsc-hero" id="fsc-hero"></div>', caption:"" },
    // module-written description of the plan's storyboard
    aria:"A budget bar fills with $3,400 of monthly income. Rent and utilities, $1,850, slide in and cover part of it; other essentials, $650, cover more. $900 is left for food, beside a nutritious food basket bar of $1,000. The $100 gap glows: 10% short every month.",
    caption:"Model data: one household’s month. $900 is left for food after rent and essentials; a nutritious food basket costs $1,000."   // module-written
  },
  goals:[
    "I can define food security and explain its five components: availability, accessibility, adequacy, acceptability and sustainability.",
    "I can explain why household food insecurity in Canada is mainly about income compared with costs.",
    "I can analyse how social, cultural and economic factors make some groups more likely to experience food insecurity.",
    "I can explain the links among poverty, food insecurity, poor nutrition and poor health.",
    "I can evaluate responses to food insecurity: food banks, school food programs, income supports and community programs.",
    "I can take informed action, such as writing to the level of government that decides a policy."
  ],
  start:{
    blocks:[{ html:SUPPORT }],
    warmup:{
      questions:[
        { id:"w1", skill:"Canada’s Food Guide", goal:1,
          prompt:"According to Canada’s Food Guide (2019), what should fill about half of a plate?",
          options:[
            { t:"Vegetables and fruits", ok:true, why:"Half the plate is vegetables and fruits." },
            { t:"Whole grain foods", why:"Whole grains are about a quarter." },
            { t:"Protein foods", why:"Protein foods are about a quarter." },
            { t:"Milk and alternatives", why:"The 2019 guide has no separate milk group." }],
          hints:["Picture the plate.", "Two quarters are grains and protein.", "Vegetables and fruits."] },
        { id:"w2", skill:"Canada’s Food Guide", goal:1,
          prompt:"A meal gives enough calories but almost no vegetables, fruit or protein. What is missing?",
          options:[
            { t:"Nutritional adequacy", ok:true, why:"Enough energy isn’t the same as enough nutrients." },
            { t:"Nothing: calories are what count", why:"Nutrients matter too." },
            { t:"Food availability", why:"The food was available; the mix wasn’t nutritious." },
            { t:"Food safety", why:"Nothing here is unsafe." }],
          hints:["What does a nutritious diet need besides energy?", "Vitamins, minerals, fibre, protein.", "Adequacy."] },
        { id:"w3", skill:"Influences on food choice", goal:3,
          prompt:"Which influence on food choice most often limits what a low-income household can buy?",
          options:[
            { t:"Cost of food compared with income", ok:true, why:"Money left after rent sets the limit." },
            { t:"Taste preferences", why:"Preferences matter, but money limits choice first." },
            { t:"Food advertising", why:"Ads influence, but can’t make food affordable." },
            { t:"Lack of interest in health", why:"Low-income households care about health as much as anyone." }],
          hints:["Module 01’s influences: which one is a hard limit?", "Think of a budget.", "Cost compared with income."] },
        { id:"w4", skill:"Influences on food choice", goal:3,
          prompt:"A family’s nearest full grocery store is 8 km away and there’s no bus. Which influence is this?",
          options:[
            { t:"Physical access", ok:true, why:"Distance and transport limit access." },
            { t:"Cultural influence", why:"Culture shapes <em>what</em> you choose, not whether you can reach a store." },
            { t:"Psychological influence", why:"Mood and stress are different." },
            { t:"Media influence", why:"Ads aren’t involved." }],
          hints:["Can they get to the store?", "It’s about reaching food.", "Physical access."] },
        { id:"w5", skill:"Percentages", goal:2,
          prompt:"A food basket costs $800 and a household has $600 for food. The gap is what percentage of the basket?",
          options:[
            { t:"25%", ok:true, why:"$200 ÷ $800 = 0.25." },
            { t:"33%", why:"$200 ÷ $600 compares with the wrong amount." },
            { t:"75%", why:"That’s the share that <em>is</em> covered." },
            { t:"20%", why:"$200 ÷ $800 is 25%, not 20%." }],
          hints:["Gap = basket − money for food.", "$200.", "200 ÷ 800 = 25%."] },
        { id:"w6", skill:"Percentages", goal:2,
          prompt:"Food prices rise 10%. A $1,200 basket now costs…",
          options:[
            { t:"$1,320", ok:true, why:"$1,200 × 1.10." },
            { t:"$1,210", why:"10% of $1,200 is $120." },
            { t:"$1,080", why:"That’s a 10% drop." },
            { t:"$1,300", why:"10% of $1,200 is $120, not $100." }],
          hints:["Find 10% of $1,200.", "$120.", "$1,320."] }
      ],
      refreshers:{
        "Canada’s Food Guide":"Half the plate vegetables and fruits, a quarter whole grains, a quarter protein foods; water as the drink of choice. A nutritious diet needs this mix, not just enough energy.",
        "Influences on food choice":"Cost compared with income, physical access, time and skills, culture and religion, family and peers, mood, and marketing. Cost and access set the outer limits.",
        "Percentages":"Gap % = gap ÷ basket × 100. A 10% price rise multiplies by 1.10."
      }
    }
  },
  explore:{
    heading:"Household food security explorer",
    intro:"Five households (fictional, built from patterns in Canadian research) each balance income against housing, essentials and food. Switch on supports and shocks and watch what closes the gap.",
    modelTag:"Model data based on patterns in Canadian research; not real people",
    modes:[{ id:"house", t:"Household view" }, { id:"policy", t:"Policy view" }],
    // Plan model data (F10). Don't change these without recounting TC1–TC3, P1–P4, the Final Check and task line 3.
    // kids = school-age children (P3); H2 also has a toddler. short/chip/name are module-written display forms.
    households:[
      { id:"H1", t:"Celine and two children (7, 12), Hamilton, renter, part-time health-care aide", name:"Celine and two children, Hamilton", chip:"Celine", short:"Celine", inc:3400, hou:1850, ess:650, basket:1000, renter:true, kids:2 },
      { id:"H2", t:"the Mahmoud family, two adults and three children, Mississauga, renter, one income", name:"The Mahmoud family, Mississauga", chip:"Mahmoud family", short:"the Mahmoud family", inc:4800, hou:2600, ess:1000, basket:1600, renter:true, kids:2 },
      { id:"H3", t:"Walter, 68, Thunder Bay, owns his home, public pensions", name:"Walter, 68, Thunder Bay", chip:"Walter", short:"Walter", inc:2100, hou:700, ess:700, basket:400, renter:false, kids:0 },
      { id:"H4", t:"Kiara, 24, Kingston, student renting a room, part-time job", name:"Kiara, 24, Kingston", chip:"Kiara", short:"Kiara", inc:1600, hou:900, ess:500, basket:450, renter:true, kids:0 },
      { id:"H5", t:"a family of four in a fly-in community in Nunavut", name:"A family of four, fly-in community in Nunavut", chip:"Nunavut family", short:"the Nunavut family", inc:5600, hou:900, ess:2100, basket:2900, renter:false, kids:2, north:true }
    ],
    supports:[
      { id:"P1", t:"Income top-up", eff:"+$300 a month for every household (models a stronger income floor: benefits, wages or pensions)", amt:300 },
      { id:"P2", t:"Rent subsidy", eff:"−$400 rent; renters only (H1, H2, H4)", amt:400, who:"renters only" },
      { id:"P3", t:"School meals", eff:"−$80 a month from the food basket per school-age child (H1 has 2; H2 has 2, plus a toddler; H5 has 2)", amt:80, who:"no school-age children" },
      { id:"P4", t:"Food bank hamper", eff:"−$60 a month from the food basket, for every household", amt:60 },
      { id:"P5", t:"Nutrition North subsidy", eff:"−$400 from the food basket; H5 only", amt:400, who:"H5 only" }
    ],
    shocks:[
      { id:"S1", t:"Food prices +10%", eff:"basket × 1.10", factor:1.1 },
      { id:"S2", t:"Rent +$150", eff:"renters only", amt:150, who:"renters only" },
      { id:"S3", t:"Winter flight delay", eff:"H5 basket +$300", amt:300, who:"H5 only" }
    ],
    rows:{ household:"Household", left:"Money left for food", basket:"Nutritious food basket", gap:"Gap", status:"Status (model)", comps:"Components strained", changed:"What changed it",
      policies:"Policies on", secure:"Households food secure" },
    status:{ secure:"Food secure", marginal:"Marginal", moderate:"Moderate", severe:"Severe" },
    // Component rules (plan, exact) live in app.js; messages for availability, accessibility and adequacy are module-written.
    comps:[
      { id:"avail", t:"Availability", msg:"Flights are delayed: fresh food isn’t on the shelves." },
      { id:"access", t:"Accessibility", msg:"The money left can’t cover the basket." },
      { id:"adequacy", t:"Adequacy", msg:"The shortfall is too big to buy a nutritious diet." },
      { id:"accept", t:"Acceptability", msg:"Hampers may not fit dietary, religious or cultural needs." },
      { id:"sustain", t:"Sustainability", msg:"No buffer: one more price rise tips this household." }
    ],
    about:{ title:"About this model",
      rules:[
        "Left for food = income (+ P1) − housing (− P2, + S2) − essentials.",
        "Basket = base basket × (1.10 if S1) + (300 if S3, H5 only) − P3 − P4 − P5.",
        "Gap = basket − left for food. Gap % = gap ÷ basket × 100.",
        "Status (teaching model): <strong>food secure</strong> if gap ≤ 0; <strong>marginal</strong> if 0 < gap % ≤ 15; <strong>moderate</strong> if 15 < gap % ≤ 40; <strong>severe</strong> if gap % > 40."
      ],
      compTitle:"When a component is strained",
      compRules:[
        "<strong>Accessibility:</strong> the gap is above 0.",
        "<strong>Adequacy:</strong> the gap % is above 15.",
        "<strong>Availability:</strong> H5, when the winter flight delay is on.",
        "<strong>Acceptability:</strong> the household is food secure only because of the food bank hamper (the gap without P4 is above 0).",
        // reading: applied only to households that are food secure (matches the plan's H1 readout example)
        "<strong>Sustainability:</strong> the household is food secure, but money left for food is less than 1.10 × the current basket (no buffer)."
      ],
      tableTitle:"The five households",
      // VERIFY: the 18-question survey module (Household Food Security Survey Module) note.
      note:"Real surveys classify households with an 18-question survey, not a budget rule."
    },
    predictions:[
      { id:"p1", prompt:"Walter’s income ($2,100) is lower than Celine’s ($3,400). Who is food insecure?",
        options:[{ t:"Celine", ok:true }, { t:"Walter" }, { t:"Both" }, { t:"Neither" }],
        // VERIFY: the post-65 drop with public pensions (PROOF).
        explain:"Walter has $300 spare; Celine is $100 short. What matters is income compared with costs. Walter owns his home and feeds one person. In research, food insecurity drops sharply after 65, when public pensions provide a steady income floor." },
      { id:"p2", prompt:"Switch on the food bank hamper for Kiara. Where does she end up?",
        options:[{ t:"still severe", ok:true }, { t:"moderate" }, { t:"marginal" }, { t:"food secure" }],
        explain:"The basket drops $60 to $390; the gap is $190 (48.7%). A hamper helps for a few days. Kiara’s $250 monthly gap comes from rent and low pay." },
      { id:"p3", prompt:"Switch on food prices +10%. Whose gap grows the most in dollars?",
        options:[{ t:"the Nunavut family (H5)", ok:true }, { t:"the Mahmoud family" }, { t:"Celine" }, { t:"Kiara" }],
        // VERIFY: northern food prices far higher than southern ones.
        explain:"The gaps grow by $100 (Celine), $160 (the Mahmoud family), $40 (Walter), $45 (Kiara) and $290 (the Nunavut family). A 10% rise costs most where baskets cost most. Northern food prices are far higher than southern ones." },
      { id:"p4", prompt:"Switch on school meals only. How many of the five households change status?",
        options:[{ t:"1", ok:true }, { t:"3" }, { t:"0" }, { t:"2" }],
        explain:"Celine becomes food secure (gap −$60). The Mahmouds stay moderate ($240 short, 16.7%). The Nunavut family stays marginal ($140 short, 5.1%). School meals help children, but they rarely close a household’s whole income gap." }
    ],
    challenges:[
      { id:"tc1", goal:[2, 5],
        prompt:"Household view, H1, no shocks. Switch on <strong>exactly one</strong> support so Celine’s household is food secure.",
        why:"Celine’s $100 gap closes with the income top-up (gap −$200), the rent subsidy (gap −$300) or school meals (gap −$60).",   // module-written
        msgs:{ hamper:"A hamper narrows the gap but doesn’t close it. Try a support that raises income or lowers costs.",
          // module-written
          view:"Use Household view with Celine (H1) chosen.",
          shocks:"Switch the shocks off: this challenge has none.",
          none:"Switch on one support.",
          many:"Use exactly one support.",
          north:"Nutrition North applies only to the Nunavut family, so Celine is still $100 short." },
        hints:["The gap is $100. Which supports are worth at least $100?", "Income +$300, rent −$400, school meals −$160.", "Any one of those three works."] },
      { id:"tc2", goal:[2, 5],
        prompt:"Household view, H2, with <strong>food prices +10%</strong> on. Make the Mahmoud family food secure with the <strong>fewest</strong> supports.",
        why:"With prices up, the gap is $560. The rent subsidy plus the income top-up (gap −$140), or the rent subsidy plus school meals (gap $0), closes it.",   // module-written
        msgs:{ p1p3:"Still ${gap} short. Which support is worth the most to a renter?", three:"That works, but can you do it with two?",
          // module-written
          view:"Use Household view with the Mahmoud family (H2) chosen.",
          s1:"Switch on food prices +10% first.",
          one:"One support isn’t enough to close this gap. Try two.",
          short:"Still ${gap} short." },
        hints:["With prices up, the basket is $1,760 and $1,200 is left: a $560 gap.", "No single support is worth $560. The rent subsidy ($400) is the biggest.", "Rent subsidy plus the income top-up, or rent subsidy plus school meals ($160)."] },
      { id:"tc3", goal:[2, 5], stretch:true,
        prompt:"Policy view. Turn on <strong>both</strong> shocks S1 (prices +10%) and S2 (rent +$150). Find the <strong>smallest set of policies</strong> that makes <strong>all five</strong> households food secure.",
        why:"Two sets work: {P1, P2, P3, P5} and {P1, P2, P4, P5}.",   // module-written
        banner:"Four policies, five households secure. Notice that the essential ones (P1, P2, P5) raise income or lower costs.",
        msgs:{ p125:"The Mahmoud family is still $10 short (marginal).", p1234:"The Nunavut family is still $70 short. Northern food costs need a northern policy.", all:"That works, but one policy isn’t needed. Which?",
          // module-written
          view:"Switch to Policy view.",
          shocks:"Turn on both shocks S1 and S2, and leave S3 off.",
          short:"Still short: {list}." },
        hints:["Check the hardest households first. With both shocks, the Mahmouds are $710 short and the Nunavut family is $590 short.", "The Nunavut family needs P5 (no other mix reaches $590 without it), and the Mahmouds need both P1 and P2 plus one more.", "P1 + P2 + P5, plus either P3 or P4."] }
    ],
    // the plan's "aha"
    blocks:[{ title:"What the model shows", html:"<p>The gap closes when <strong>income rises or costs fall</strong>. A hamper rarely closes it, and it brings acceptability and sustainability problems of its own.</p>" }]
  },
  part3:{
    slug:"policy", name:"Policy or charity?", heading:"Policy or charity?",
    // module-written from the plan's rationale
    intro:"Move from one household’s budget to the whole system: what research says works, how each response fits, and who decides.",
    stations:[{ id:"research", t:"1. What the research says" }, { id:"sort", t:"2. Sort the responses" }, { id:"desk", t:"3. Who decides?" }],
    research:{ title:"What the research says",
      ask:"Read each finding, then open <strong>Check it with data</strong> to see the same pattern in the explorer’s model households.",   // module-written
      // VERIFY: every statement before release (plan: "every figure verify before release").
      // cmp: the model comparison app.js builds for the panel; take: module-written one-line reading of it.
      cards:[
        { id:"r1", t:"Household food insecurity rises as income falls, and is much more common among renters than owners (PROOF, using Statistics Canada’s Canadian Income Survey).",
          cmp:{ hh:["H1", "H2", "H4", "H3"], tenure:true, cols:[{ t:"No supports", on:{} }] },
          take:"In the model, all three renter households are short. Walter, who owns his home, has $300 spare." },
        { id:"r2", t:"Most food-insecure households don’t use food banks. Food banks began in Canada in the early 1980s as a temporary emergency response.",
          cmp:{ hh:["H1", "H2", "H4", "H5"], cols:[{ t:"No supports", on:{} }, { t:"With a hamper (P4)", on:{ P4:true } }] },
          take:"In the model, a $60 hamper doesn’t close any of the four gaps." },
        { id:"r3", t:"Food insecurity drops sharply after age 65, when public pensions (Old Age Security and the Guaranteed Income Supplement) begin.",
          cmp:{ hh:["H3", "H1", "H4"], cols:[{ t:"No supports", on:{} }] },
          take:"In the model, Walter (68) lives on public pensions and is the one household with money to spare." },
        { id:"r4", t:"Child benefits are linked to lower severe food insecurity among families with children.",
          cmp:{ hh:["H1", "H2", "H5"], cols:[{ t:"No supports", on:{} }, { t:"With the income top-up (P1)", on:{ P1:true } }] },
          take:"In the model, $300 more a month moves every family with children up at least one level." },
        { id:"r5", t:"School food programs improve what children eat at school, but don’t change household income. Canada announced a National School Food Program in 2024.",
          cmp:{ hh:["H1", "H2", "H5"], cols:[{ t:"No supports", on:{} }, { t:"With school meals (P3)", on:{ P3:true } }] },
          take:"In the model, school meals close Celine’s gap, but the Mahmoud family stays $240 short and the Nunavut family $140 short." }
      ] },
    sort:{ id:"p3sort", type:"sorter", title:"Sort the responses", noun:"response", txt:true,
      ask:"Tap each response into one of four boxes. The feedback names what each response does and doesn’t fix.",   // module-written
      boxes:[{ id:"inc", label:"Income-based" }, { id:"char", label:"Charitable food-based" }, { id:"pub", label:"Public food program" }, { id:"comm", label:"Community-building" }],
      // module-written feedback (plan: "Feedback names what each response does and doesn't fix")
      items:[
        { id:"s1", t:"Higher social assistance rates", answer:"inc", why:"It raises income for households relying on social assistance, closing the gap at its source. It doesn’t reach low-wage workers.", wrong:{ char:"It isn’t donated food: it changes how much money people have.", pub:"It isn’t a food program: it changes how much money people have.", comm:"It isn’t a community project: it changes how much money people have." } },
        { id:"s2", t:"A larger Canada Child Benefit", answer:"inc", why:"It raises income for families with children. It doesn’t help adults without children, like Kiara.", wrong:{ char:"It’s a payment, not donated food.", pub:"It’s a payment to families, not a food program.", comm:"It’s a payment to families, not a community project." } },
        { id:"s3", t:"A higher minimum wage", answer:"inc", why:"It raises pay for low-wage workers. It doesn’t help people who can’t work or are retired.", wrong:{ char:"It changes pay, not donated food.", pub:"It changes pay, not a food program.", comm:"It changes pay, not a community project." } },
        { id:"s4", t:"Food bank hamper", answer:"char", why:"Emergency food for a few days. It doesn’t close a monthly income gap, and it may not fit dietary, religious or cultural needs.", wrong:{ inc:"A hamper is donated food; income doesn’t change.", pub:"Food banks are mostly charities that run on donations.", comm:"A hamper is emergency relief, not a group building skills or connection." } },
        { id:"s5", t:"Community fridge", answer:"char", why:"Free donated food, open to anyone. Supplies depend on donations, and income doesn’t change.", wrong:{ inc:"The fridge holds donated food; income doesn’t change.", pub:"It runs on donations, not a public program.", comm:"It hands out donated food rather than building skills together." } },
        { id:"s6", t:"School meal program", answer:"pub", why:"Children eat well at school. Household income doesn’t change.", wrong:{ inc:"It gives food at school; household income doesn’t change.", char:"It’s a public program, not a donation drive.", comm:"It’s a public program run through schools." } },
        { id:"s7", t:"Nutrition North retail subsidy", answer:"pub", why:"It lowers food prices in northern communities. It helps only where it applies, and only if the savings reach shoppers.", wrong:{ inc:"It lowers prices in stores; it doesn’t pay people.", char:"It’s a government subsidy, not a donation.", comm:"It’s a government subsidy, not a community project." } },
        { id:"s8", t:"Community garden", answer:"comm", why:"It builds skills, connection and some fresh food. It doesn’t close an income gap.", wrong:{ inc:"It doesn’t change income.", char:"People grow food together; it isn’t donated relief.", pub:"It’s run by and for the community, not a public food program." } },
        { id:"s9", t:"Collective kitchen", answer:"comm", why:"People cook together and share costs and skills. It doesn’t change income.", wrong:{ inc:"It doesn’t change income.", char:"People cook together; it isn’t donated relief.", pub:"It’s run by and for the community, not a public food program." } }
      ] },
    desk:{ title:"Who decides?",
      ask:"Match each policy to the level of government that decides it in Ontario. This table is also the key for the performance task.",
      reps:[{ id:"mp", t:"Federal: your MP" }, { id:"mpp", t:"Provincial: your MPP" }, { id:"cc", t:"Municipal: your city councillor" }],
      policies:POLICIES,
      keyTitle:"Who decides? (the key)",
      // module-written
      msgs:{ partial:"Choose a desk for every policy first.", ok:"Every policy is at the right desk.", off:"{n} at the wrong desk (marked ✗). " + M6 } },
    quickCheck:{
      title:"Policy or charity? quick check", summary:"Policy or charity? quick check",
      // Correct-choice lines are module-written ("Right." + the plan's feedback line).
      items:[
        { id:"q1", goal:5, prompt:"Which response targets the main cause of household food insecurity in Canada?",
          choices:[{ t:"Raising low incomes", ok:true, fb:"Right. The gap is income compared with costs." }, { t:"More cooking classes", fb:"The gap is income compared with costs." }, { t:"More food drives", fb:"The gap is income compared with costs." }, { t:"Bigger nutrition labels", fb:"The gap is income compared with costs." }] },
        { id:"q2", goal:1, prompt:"A hamper doesn’t include halal meat. Which component is strained?",
          choices:[{ t:"Acceptability", ok:true, fb:"Right. Food must fit religious and cultural needs." }, { t:"Availability", fb:"Food must fit religious and cultural needs." }, { t:"Adequacy", fb:"Food must fit religious and cultural needs." }, { t:"Sustainability", fb:"Food must fit religious and cultural needs." }] },
        { id:"q3", goal:6, prompt:"To ask for higher ODSP rates, write to your…",
          choices:[{ t:"MPP", ok:true, fb:"Right. ODSP is a provincial program." }, { t:"MP", fb:"ODSP is a provincial program." }, { t:"City councillor", fb:"ODSP is a provincial program." }, { t:"School trustee", fb:"ODSP is a provincial program." }] },
        // VERIFY: the post-65 drop.
        { id:"q4", goal:5, prompt:"Food insecurity drops after 65. The most likely reason?",
          choices:[{ t:"A guaranteed pension income floor", ok:true, fb:"Right. A steady income floor protects access to food." }, { t:"Seniors cook more", fb:"A steady income floor protects access to food." }, { t:"Seniors eat less", fb:"A steady income floor protects access to food." }, { t:"Seniors live near farms", fb:"A steady income floor protects access to food." }] }
      ]
    },
    blocksAfter:[{ html:SUPPORT }]
  },
  practice:{
    activities:[
      // Plan: tap-to-sort (N6 style), 10 items, five boxes. Hint 2 (the key question) and the mismatch lines are
      // module-written, except item 2 → Availability (plan). Correct-placement "why" lines are module-written.
      { id:"comp", type:"sorter", title:"Which component?", summary:"Which component?", goal:[1, 3], noun:"situation", txt:true,
        instruction:"Sort each situation into the component of food security it strains most.",
        boxes:[{ id:"avail", label:"Availability", sub:"Is the food there?" }, { id:"access", label:"Accessibility", sub:"Can they get it?" }, { id:"adequacy", label:"Adequacy", sub:"Is it nutritious and safe?" }, { id:"accept", label:"Acceptability", sub:"Does it fit?" }, { id:"sustain", label:"Sustainability", sub:"Will it last?" }],
        items:[
          comp("i1", "The only store in a fly-in community runs out of fresh produce when flights are cancelled.", "avail", "Is the food physically on the shelves?", "The food isn’t on the shelves at all: supply is the problem.", "No flights, no fresh produce on the shelves: the food isn’t physically there."),
          comp("i2", "A family can afford enough rice and pasta, but not enough vegetables, fruit or protein foods.", "adequacy", "Is the food they can afford nutritious?", "They can get enough food; the problem is its nutritional quality.", "Enough energy, not enough nutrients: the diet isn’t adequate.",
            { avail:"The food is there and affordable in quantity; the problem is nutritional quality." }),
          comp("i3", "The nearest full grocery store is 8 km away and there’s no bus.", "access", "Can they reach the food?", "The food exists; the problem is getting to it.", "Distance and no transport limit their access."),
          comp("i4", "A food bank’s hampers don’t include halal or kosher options.", "accept", "Does the food fit their religion and culture?", "There is food; it doesn’t fit religious dietary needs.", "Food must fit religious needs to be acceptable."),
          comp("i5", "A worker’s food budget disappears whenever shifts are cut.", "sustain", "Does their access hold up over time?", "Some weeks are fine; the problem is that access doesn’t last.", "Access that collapses with every cut in shifts isn’t sustainable."),
          comp("i6", "Rent rises $200, leaving too little for groceries.", "access", "Can they afford the food?", "The food is in the store; the problem is money to buy it.", "Higher rent leaves too little money: they can’t afford the food."),
          comp("i7", "A newcomer family can’t find familiar staple foods it can afford.", "accept", "Does the food fit their culture?", "Food is in the store; it doesn’t fit the family’s culture.", "Familiar, culturally fitting staples are part of acceptability."),
          comp("i8", "A drought cuts a region’s harvest and shelves empty.", "avail", "Is the food physically there?", "Empty shelves: there’s no food to buy.", "When the harvest fails, the food isn’t physically there."),
          comp("i9", "Food from a donation drive is mostly expired or unsafe.", "adequacy", "Is the food safe and nutritious?", "There’s food, but it isn’t safe: adequacy covers safety.", "Adequate food meets nutritional needs and is safe."),
          comp("i10", "A family relies on a food bank every month with no other plan.", "sustain", "Will their access last?", "They get food now; the problem is that it can’t be counted on.", "Relying on charity every month isn’t access that holds up over time.")
        ] },
      // ★ set (plan: data table with tap answers; D3–D6 ★, D3 and D6 above Final Check level). Each item uses the plan's answer
      // and the plan's feedback for the likely wrong answer; the other two options, their feedback and the correct-answer lines
      // are module-written. Hints 1–2 are the plan's shared hints; hint 3 is the worked answer (module-written).
      // VERIFY (plan): the label's "compare with PROOF reports before release".
      { id:"data", type:"custom", title:"Reading the data", summary:"Reading the data", star:true, goal:[2, 3, 4],
        instruction:"Use the table to answer each question. Items marked ★ are non-routine; D5 is an inquiry item.",
        how:"Choose an answer, then press Check answer. Each item has three levels of help.",
        tableTag:"Model data shaped like published Canadian patterns",
        head:["Household group", "% food insecure (model)", "Share of all households (model)"],
        rows:[["Owners", "10%", "65%"], ["Renters", "30%", "35%"], ["Main income: employment", "15%", "80%"], ["Main income: social assistance", "60%", "5%"], ["Main income: public pensions", "7%", "15%"]],
        items:[
          { id:"d1", goal:3, prompt:"Which income group has the highest <strong>rate</strong>?",
            options:[
              { t:"Social assistance (60%)", ok:true, why:"60% is the highest rate of the three income groups." },
              { t:"Employment", why:"That group is the largest, not the highest rate." },
              { t:"Public pensions", why:"Pension households have the lowest rate in the table (7%)." },
              { t:"All three are about the same", why:"The rates range from 7% to 60%." }],
            hints:["Rate = how likely within a group; share = how big the group is.", "Multiply the rate by the share to compare counts.", "Read the rate column for the three income groups: social assistance 60%, employment 15%, public pensions 7%."] },
          { id:"d2", goal:3, prompt:"Renters’ rate is how many times owners’ rate?",
            options:[
              { t:"3 times", ok:true, why:"30 ÷ 10 = 3." },
              { t:"20 times", why:"Divide: 30 ÷ 10." },
              { t:"2 times", why:"Divide: 30 ÷ 10." },
              { t:"30 times", why:"30% is renters’ rate itself. Divide it by owners’ rate: 30 ÷ 10." }],
            hints:["Rate = how likely within a group; share = how big the group is.", "Multiply the rate by the share to compare counts.", "30 ÷ 10 = 3: renters are 3 times as likely to be food insecure."] },
          { id:"d3", goal:[2, 3], star:true, prompt:"Most food-insecure households get their main income from…",
            options:[
              { t:"Employment", ok:true, why:"80% × 15% = 12 of every 100 households, vs 5% × 60% = 3 for social assistance." },
              { t:"Social assistance", why:"Highest rate isn’t the same as largest share." },
              { t:"Public pensions", why:"15% × 7% is about 1 of every 100 households: the smallest count." },
              { t:"The three groups equally", why:"Multiply each rate by its share: about 12, 3 and 1 of every 100 households." }],
            hints:["Rate = how likely within a group; share = how big the group is.", "Multiply the rate by the share to compare counts.", "Employment: 0.80 × 15 = 12 of every 100 households. Social assistance: 0.05 × 60 = 3. Pensions: 0.15 × 7 ≈ 1. Employment wins."] },
          { id:"d4", goal:3, star:true, prompt:"Renters have higher rates. Does renting <em>cause</em> food insecurity?",
            options:[
              { t:"Not by itself: renting goes with lower incomes and a higher share of income spent on housing", ok:true, why:"The link runs through income and housing costs, not renting itself." },
              { t:"Yes", why:"Correlation isn’t causation; look for what renters share." },
              { t:"No: renting and food insecurity aren’t linked", why:"They are linked (30% vs 10%). The question is what explains the link." },
              { t:"Yes, because renters spend more on food", why:"The table doesn’t show food spending. Look for what renters share." }],
            hints:["Rate = how likely within a group; share = how big the group is.", "Multiply the rate by the share to compare counts.", "A link isn’t a cause. Renting goes with lower incomes and a higher share of income spent on housing, and those explain the link."] },
          { id:"d5", goal:3, star:true, inquiry:true, prompt:"Which is the best research question?",
            options:[
              { t:"“How does the share of income spent on rent relate to food insecurity among Ontario renters?”", ok:true, why:"It’s focused and measurable, and it doesn’t assume the answer." },
              { t:"“Why are poor people bad with money?”", why:"That assumes the answer and blames people." },
              { t:"“Is food insecurity bad?”", why:"It’s too broad, and data can’t answer it." },
              { t:"“How many grocery stores are in Ontario?”", why:"It’s measurable, but it doesn’t connect to food insecurity or its causes." }],
            hints:["Rate = how likely within a group; share = how big the group is.", "Multiply the rate by the share to compare counts.", "A good research question is focused and measurable and doesn’t assume the answer: the question about the share of income spent on rent."] },
          // VERIFY: public pensions indexed to prices.
          { id:"d6", goal:[2, 4], star:true, prompt:"Pension households have a 7% rate; employment households 15%. Which explanation is best supported?",
            options:[
              { t:"A guaranteed, indexed income floor", ok:true, why:"Public pensions give a steady income that rises with prices, so access to food holds up." },
              { t:"Seniors need less food", why:"Their basket is smaller, but the rate gap is about income stability." },
              { t:"Seniors are better at budgeting", why:M1 },
              { t:"Seniors grow their own food", why:"Nothing in the data points to that; the difference is a steady income floor." }],
            hints:["Rate = how likely within a group; share = how big the group is.", "Multiply the rate by the share to compare counts.", "Public pensions (Old Age Security and the Guaranteed Income Supplement) give a guaranteed income floor that rises with prices, so access holds up."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Torin", goal:[2, 5], how:"",
        instruction:"Torin made one mistake in each answer. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Explain why Celine’s household is food insecure.",
            steps:["“Celine’s income after tax, including benefits, is $3,400.”", "“Housing and essentials take $2,500, leaving $900 for food.”", "“A nutritious food basket for her family costs $1,000.”", "“So the family is $100 short each month.”", "“The solution is for Celine to learn to budget better.”"],
            answer:4, stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "Step 3 is correct.", "Step 4 is correct.", ""],
            fixes:[
              { t:"“The gap comes from costs higher than income. A support that raises income or lowers costs (child benefit, rent help or school meals) closes it.”", ok:true, why:M1 },
              { t:"“The solution is cooking classes.”", why:"Skills don’t create $100." },
              { t:"“The solution is a food bank visit.”", why:"That covers $60 at most." },
              // VERIFY: research on budgeting skills.
              { t:"Step 5 is correct.", why:"Research doesn’t support blaming budgeting." }],
            hints:["Where does the $100 gap come from?", "Income compared with costs.", "A fix must raise income or lower costs."] },
          { id:"e2", goal:2, task:"Find the Mahmoud family’s gap when food prices rise 10%.",
            steps:["“Left for food: $4,800 − $2,600 − $1,000 = $1,200.”", "“Basket with prices up: $1,600 + $10 = $1,610.”", "“Gap: $1,610 − $1,200 = $410.”"],
            answer:1, stepFb:["Step 1 is correct.", "", "Step 3 follows step 2 correctly. The mistake is earlier."],
            fixes:[
              { t:"“$1,600 × 1.10 = $1,760, so the gap is $560.”", ok:true, why:"10% of $1,600 is $160, so the basket is $1,760 and the gap is $1,760 − $1,200 = $560." },
              { t:"“$1,600 × 0.10 = $160 is the new basket.”", why:"That’s the increase, not the new basket." },
              { t:"“$1,200 × 1.10 = $1,320.”", why:"The price rise applies to the basket, not the money left." },
              { t:"Step 2 is correct.", why:"10% of $1,600 is $160." }],
            hints:["What is 10% of $1,600?", "$160.", "$1,760 and a $560 gap."] },
          { id:"e3", goal:5, task:"Evaluate food banks as a response to food insecurity.",
            steps:["“Food banks give emergency food to people in crisis.”", "“They depend on donations and volunteers, so supplies vary.”", "“Since most food-insecure households use food banks, expanding them will end food insecurity.”", "“So governments should fund more food banks instead of income programs.”"],
            answer:2, stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows the mistake in step 3."],
            fixes:[
              // VERIFY: most food-insecure households don't use food banks.
              { t:"“Most food-insecure households don’t use food banks, and hampers can’t close a monthly income gap. Food banks are emergency relief; income-based policies address the cause.”", ok:true, why:"Relief, not a cure: income-based policies address the cause." },
              { t:"“Food banks should only give fresh food.”", why:"That improves adequacy but not the gap." },
              { t:"“Food banks should close.”", why:"They still help in emergencies." },
              { t:"Step 3 is correct.", why:M2 }],
            // VERIFY: hint 2.
            hints:["Do most food-insecure households use food banks?", "No.", "Relief, not a cure."] }
        ] }
    ]
  },
  reflect:{
    blocks:[{ html:'<div class="hfa-support" role="note"><p>Write about the households in the module. You don’t need to write about your own family.</p></div>' }],
    journal:[
      { id:"j1", q:"Which prediction surprised you most in the explorer, and why?" },
      { id:"j2", q:"In your own words, why is household food insecurity in Canada mainly an income problem?" },
      { id:"j3", q:"Explain to a friend the difference between a food bank and an income-based policy, using one household from the explorer." },
      { id:"j4", q:"What is one thing you’re still unsure about (data, causes or solutions)? How could you find out?" }
    ]
  },
  final:{
    // Options without feedback in the plan use its misconception sentences (M1–M7); correct-option lines without plan
    // text are module-written. Calculation questions use the module's model status rule (shown in the intro).
    intro:"This shows what you’ve learned, so there are no hints here. Answer all 10 questions and say how sure you are. Then submit to see your results. Each question is labelled with its achievement chart category. Calculation questions use the module’s model status rule: <strong>food secure</strong> if gap ≤ 0; <strong>marginal</strong> if 0 < gap % ≤ 15; <strong>moderate</strong> if 15 < gap % ≤ 40; <strong>severe</strong> if gap % > 40.",
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"A family can afford enough calories, but not enough vegetables, fruit and protein foods. Which component of food security is strained?", options:[
          { t:"Adequacy", ok:true, why:"Enough energy isn’t enough nutrition." },
          { t:"Availability", why:"The food is in the store." },
          { t:"Acceptability", why:"Nothing here conflicts with culture or dignity." },
          { t:"Sustainability", why:"This is about quality, not reliability over time." }] },
        b:{ prompt:"The only store in a fly-in community runs out of fresh food after flights are cancelled. Which component is strained?", options:[
          { t:"Availability", ok:true, why:"The food isn’t physically there." },
          { t:"Adequacy", why:"The problem starts before quality: there’s no food on the shelves." },
          { t:"Acceptability", why:"Nothing here conflicts with culture." },
          { t:"Accessibility", why:"Money and distance aren’t the issue; supply is." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"In Canadian research, household food insecurity is defined as…", options:[
          { t:"inadequate or insecure access to food because of financial constraints", ok:true, why:"The definition is about access limited by money." },
          { t:"not knowing how to cook healthy meals", why:M1 },
          { t:"living far from a farm", why:"Distance from farms isn’t the definition." },
          { t:"choosing less healthy foods", why:"It’s about constraints, not preferences." }] },
        b:{ prompt:"Which factor is most strongly linked to household food insecurity in Canada?", options:[
          { t:"Low income compared with living costs", ok:true, why:"Food insecurity tracks income measured against housing and other costs." },
          { t:"Lack of cooking skills", why:M1 },
          { t:"Living far from farms", why:"Most food-insecure people live near stores." },
          { t:"Household size alone", why:"Size matters only through costs and income." }] } },
      { id:"k3", cat:"K", goal:6,
        a:{ prompt:"To ask for higher Ontario Works rates, which representative is responsible?", options:[
          { t:"Your MPP (provincial)", ok:true, why:"Ontario Works is a provincial program, so its rates are set at Queen’s Park." },
          { t:"Your MP (federal)", why:"Ontario Works is a provincial program." },
          { t:"Your city councillor", why:M6 },
          { t:"Your school trustee", why:"Trustees oversee school boards." }] },
        b:{ prompt:"To ask for a larger Canada Child Benefit, which representative is responsible?", options:[
          { t:"Your MP (federal)", ok:true, why:"The Canada Child Benefit is a federal program, so Parliament can change it." },
          { t:"Your MPP (provincial)", why:"The Canada Child Benefit is federal." },
          { t:"Your city councillor", why:M6 },
          { t:"Your school principal", why:"Principals don’t set benefits." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"A household has $2,900 income after tax, $1,500 housing and $600 other essentials. Its nutritious food basket costs $1,000. Using the module’s model rule, what is its status?", options:[
          { t:"Moderate", ok:true, why:"$800 left; gap $200 = 20% of the basket." },
          { t:"Marginal", why:"20% is above the 15% marginal limit." },
          { t:"Severe", why:"Severe starts above 40%." },
          { t:"Food secure", why:"$800 doesn’t cover a $1,000 basket." }] },
        b:{ prompt:"A household has $3,800 income after tax, $1,900 housing and $900 other essentials. Its basket costs $1,100. Using the module’s model rule, what is its status?", options:[
          { t:"Marginal", ok:true, why:"$1,000 left; gap $100 ≈ 9.1%." },
          { t:"Moderate", why:"9.1% is below 15%." },
          { t:"Food secure", why:"$1,000 doesn’t cover $1,100." },
          { t:"Severe", why:"Severe starts above 40%." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"A town has funding for one response. Its data: 70% of food-insecure households have jobs that don’t pay enough to cover rent and food, and few use the food bank. Which response best fits the evidence?", options:[
          { t:"A rent supplement or income support program for low-wage households", ok:true, why:"It targets the gap the data shows." },
          { t:"A bigger food bank warehouse", why:"Few use the food bank, and hampers don’t close monthly gaps." },
          { t:"Free cooking classes", why:"Skills aren’t what the data points to." },
          { t:"A new grocery store downtown", why:"Availability isn’t the problem in the data." }] },
        b:{ prompt:"In a northern community, food prices are about 2.5 times southern prices (model), while incomes are similar to the south’s. Which response best fits?", options:[
          { t:"Lower food costs (a stronger retail subsidy) and support for harvesting country food", ok:true, why:"With similar incomes, the gap comes from prices, so lowering food costs targets it." },
          { t:"A nutrition label awareness campaign", why:M1 },
          { t:"A one-time food drive in a southern city", why:"Short-term, and it doesn’t touch prices." },
          { t:"Cooking classes", why:M1 }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"Renters have a food insecurity rate of 30%; owners 10%. Renters are 35% of households. Which statement is supported?", options:[
          { t:"Renters are three times as likely to be food insecure, and they make up most food-insecure households", ok:true, why:"0.35 × 30 = 10.5 vs 0.65 × 10 = 6.5." },
          { t:"Most food-insecure households are owners", why:"Compare counts: 10.5 vs 6.5." },
          { t:"Renting causes food insecurity", why:"Correlation isn’t causation: income and housing costs explain it." },
          { t:"Owners are never food insecure", why:"Their rate is 10%, not 0%." }] },
        b:{ prompt:"Households on social assistance have a 60% rate and are 5% of households. Households relying on employment have a 15% rate and are 80% of households. Which statement is supported?", options:[
          { t:"More food-insecure households rely on employment income than on social assistance", ok:true, why:"0.80 × 15 = 12 vs 0.05 × 60 = 3." },
          { t:"Most food-insecure households are on social assistance", why:"That confuses the rate with the share." },
          { t:"Jobs prevent food insecurity", why:"15% of employment households are still food insecure." },
          { t:"Social assistance causes food insecurity", why:"The data shows a link, not a cause; low benefit rates are the issue." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which best explains the links among poverty, food insecurity and poor health?", options:[
          { t:"“Low income forces trade-offs, like cheaper, less nutritious food or skipped meals. Over time these raise the risk of chronic disease and stress, and poor health can in turn lower income.”", ok:true, why:"It names the trade-offs and shows that the links run both ways." },
          { t:"“Food-insecure people choose unhealthy food, which makes them sick.”", why:M1 },
          { t:"“Poor health comes only from genetics, so food doesn’t matter.”", why:"Diet and stress matter." },
          { t:"“Food insecurity only affects body weight.”", why:"It affects nutrients, stress and chronic disease." }] },
        // VERIFY: children's health in food-insecure households.
        b:{ prompt:"Which sentence best describes how food insecurity affects children?", options:[
          { t:"“Children in food-insecure households have poorer health on average, even when parents go without food first to protect them.”", ok:true, why:"Food insecurity affects the whole household, even when parents try to shield their children." },
          { t:"“Children are never affected because parents always protect them.”", why:M7 },
          { t:"“Only children who skip breakfast are affected.”", why:"The effects go beyond one meal." },
          { t:"“School lunches fully prevent any effect.”", why:"School food helps, but doesn’t change household income." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which statement best describes the role of food banks?", options:[
          { t:"“Food banks give emergency relief, but they can’t close the income gap that causes most food insecurity.”", ok:true, why:"Relief helps in a crisis; income-based policies address the cause." },
          { t:"“Food banks are the main solution to food insecurity in Canada.”", why:M2 },
          { t:"“Food banks are a government program that guarantees food.”", why:"They’re mostly charitable." },
          { t:"“Food banks are unnecessary.”", why:"They help in emergencies." }] },
        b:{ prompt:"Which statement best describes school food programs?", options:[
          { t:"“They improve children’s access to nutritious food at school, but don’t change household income.”", ok:true, why:"School food helps children at school; the household budget stays the same." },
          { t:"“They end food insecurity for the whole family.”", why:"They help children, not the household budget." },
          { t:"“They replace the need for income supports.”", why:"They don’t change household income, so the gap that causes food insecurity stays." },
          { t:"“They only help children who are food insecure.”", why:"Universal programs reach all students." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A student renting a room has $250 left for food each month, and a nutritious basket costs $450. A community fridge provides about $50 of food a month. With the fridge, what is the model status?", options:[
          { t:"Moderate", ok:true, why:"Basket $400, gap $150 = 37.5%." },
          { t:"Severe", why:"Before the fridge it was 44.4% (severe); now it’s 37.5%." },
          { t:"Marginal", why:"37.5% is above 15%." },
          { t:"Food secure", why:"$250 still doesn’t cover $400." }] },
        b:{ prompt:"A family has $1,300 left for food and a $1,600 basket. A school meal program saves $80 a month per school-age child, and they have 3. What is the model status?", options:[
          { t:"Marginal", ok:true, why:"Basket $1,360; gap $60 ≈ 4.4%." },
          { t:"Moderate", why:"4.4% is below 15%." },
          { t:"Food secure", why:"$1,300 is still $60 short." },
          { t:"Severe", why:"Severe starts above 40%." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"You’re writing to your MP about food insecurity rates. Which source is most credible for current national figures?", options:[
          { t:"Statistics Canada’s Canadian Income Survey, as analysed by university researchers (PROOF)", ok:true, why:"A large national survey, analysed by researchers whose methods you can check." },
          { t:"A social media post with no source", why:"No way to check it." },
          { t:"A grocery chain’s advertisement", why:"It has a commercial interest." },
          { t:"An opinion blog", why:"Opinion, not data." }] },
        b:{ prompt:"Which evidence would best support a letter asking your MPP for higher ODSP rates?", options:[
          { t:"Research data from a credible source on food insecurity among households relying on social assistance", ok:true, why:"Credible data about the people the policy affects backs up the ask." },
          { t:"A personal attack on the government", why:"Attacks don’t persuade decision-makers." },
          { t:"An unnamed story from a comment thread", why:"It can’t be checked." },
          { t:"A grocery flyer showing sale prices", why:"Sale prices don’t show what households can afford." }] } }
    ]
  },
  task:{
    title:"Write to the right desk", summary:"Write to the right desk",
    statement:"<p>Write a short letter to the elected representative who can change a policy that would reduce food insecurity. Use one household from the explorer as an example, and back it with evidence. There’s more than one good letter.</p>" +
      // module-written from plan §6.5 (advocacy) and §6.2 (model households only)
      "<p class=\"tiny muted\">Write about a model household, not your own. Your letter is a draft saved on this device; sending it is your choice.</p>" +
      "<details class=\"alg fsc-rubric\"><summary>How your teacher may assess the letter (levels 1–4)</summary><ul>" +
        "<li><strong>Level 1:</strong> the ask is unclear; little evidence.</li>" +
        "<li><strong>Level 2:</strong> a clear ask, with evidence loosely connected.</li>" +
        "<li><strong>Level 3:</strong> a clear, respectful ask with relevant evidence and the right level of government.</li>" +
        "<li><strong>Level 4:</strong> all of level 3, plus anticipating a counterargument or proposing a measurable change.</li></ul></details>" + SUPPORT,
    checks:["Right desk", "Research-backed", "My example shows the policy working", "A clear ask", "Right length", "Source cited", "Respectful framing"],
    tips:["Check Station 3: who decides this policy?", "Add a research chip. A post you saw online isn’t evidence on its own.",
      "Pick a household this policy actually helps. Try it in the explorer first. (OAS/GIS won’t change Walter’s status: he’s already secure.)",
      "Name the policy in your letter so the ask is clear.", "Keep it to 120–220 words.", "Cite a source in APA style: (Author, Year).",
      "Describe the problem as income and costs, not people’s choices."],
    // module-written: line 3 can't pass for a policy with no explorer support (the plan's mapping has none for the municipal one)
    noModelTip:"The explorer doesn’t model this policy, so your example can’t show it working. Choose a policy the explorer models.",
    explainPrompt:"Explain why you chose this representative and this evidence, and what your example household shows.",
    vocab:"Use the words food insecurity, income, accessibility and policy.",
    checkLabel:"Check my letter",
    success:"Your letter meets every line of the checklist.",   // module-written
    more:"There’s more than one good letter. Can you write another?",   // module-written
    policies:POLICIES,
    reps:[{ id:"mp", t:"MP" }, { id:"mpp", t:"MPP" }, { id:"cc", t:"City councillor" }],
    // VERIFY: E1, E3 and E4 research claims (plan "(verify)" flags).
    evidence:[
      { id:"E1", t:"Research: food insecurity tracks income; most food-insecure households have wages (PROOF)", research:true },
      { id:"E2", t:"Explorer result for my household" },
      { id:"E3", t:"Research: school food programs improve children’s diets", research:true },
      { id:"E4", t:"Research: food insecurity drops after 65 with public pensions", research:true },
      { id:"E5", t:"A post I saw online" }
    ],
    banned:["lazy", "bad choices", "should budget", "don't know how to cook"],
    letterLabel:"Your letter (saved on this device)",   // module-written
    // VERIFY: the citation years and authors in the models are placeholders (plan); update them to the current reports.
    models:[
      { title:"Model 1: minimum wage, MPP, Kiara (H4), evidence E1 + E2",
        text:"Dear [MPP name],\nI am a Grade 12 student in your riding, writing about food insecurity among young workers. Research using Statistics Canada’s Canadian Income Survey shows that most food-insecure households in the provinces rely mainly on wages, not social assistance (PROOF, 2023). In our class model, a 24-year-old student working part-time in Kingston has $200 a month left for food after rent and essentials, while a nutritious food basket costs $450. When her income rises by $300 a month, she can afford that basket. A higher minimum wage, set by the province, would raise incomes like hers directly. I am asking you to support raising Ontario’s minimum wage so that it keeps pace with rent and food costs. Food insecurity is about income compared with costs. Thank you for considering this request.\nSincerely,\n[Name]" },
      { title:"Model 2: Canada Child Benefit, MP, Celine (H1), evidence E1 + E2",
        text:"Dear [MP name],\nI am writing as a student in your riding to ask you to strengthen the Canada Child Benefit. Household food insecurity in Canada is closely tied to income, and families with children are among those affected (PROOF, 2023). In our class model, a lone parent with two children in Hamilton has $900 a month left for food after housing and essentials, but a nutritious food basket for her family costs $1,000. A $300 monthly increase in support would close that gap and let her buy the vegetables, fruit and protein foods her children need. Because the Canada Child Benefit is a federal program, Parliament can change it. Please support increasing the benefit for low-income families and protecting its value as food prices rise. Thank you for your time and your work for our community.\nSincerely,\n[Name]" },
      { title:"Model 3: Nutrition North Canada, MP, the Nunavut family (H5), evidence E1 + E2",
        text:"Dear [MP name],\nI am a Grade 12 student writing about the cost of food in fly-in northern communities. Food costs in many northern communities are far higher than in southern Canada, and food insecurity rates there are among the highest in the country (Statistics Canada, 2024). In our class model, a family of four in a fly-in community in Nunavut has $2,600 a month for food, while a nutritious food basket costs $2,900. A stronger retail subsidy would bring that basket within reach. Nutrition North Canada is a federal program, so I am asking you to support reviewing it with northern and Inuit organizations so that savings reach families at the checkout. Thank you for listening to students on this issue.\nSincerely,\n[Name]" }
    ],
    modelsTitle:"Three model letters"   // module-written
  },
  cards:[
    ["Food security", "Everyone, at all times, can get enough safe, nutritious, culturally acceptable food."],
    ["Household food insecurity (Canada)", "Inadequate or insecure access to food because of financial constraints."],
    ["Availability", "Enough food is physically there, e.g. on store shelves after the flight arrives."],
    ["Accessibility", "People can afford food and reach it."],
    ["Adequacy", "Food meets nutritional needs and is safe."],
    ["Acceptability", "Food fits culture, religion and dietary needs, and is obtained with dignity."],
    ["Sustainability", "Access that holds up over time and in a crisis."],
    ["Nutritious food basket", "The cost of a healthy diet for a household, used by public health units to compare with incomes."],
    // VERIFY: most food-insecure households don't use food banks.
    ["Food banks", "Emergency, charitable relief; most food-insecure households don’t use them."],
    ["Income-based policy", "Raises or protects income (benefits, wages, pensions) to close the gap at its source."],
    ["Rate vs share", "Rate = how likely within a group; share = that group’s portion of all cases."],
    ["Who decides?", "The Canada Child Benefit is federal (MP); Ontario Works, ODSP and the minimum wage are provincial (MPP); local transit is municipal (councillor)."]
  ]
};
