// HFA4U 17 Conventional, Organic, GMO & Sustainable Agriculture. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/17-agriculture-methods.md
// Teacher notes: lines marked VERIFY carry the plan's "verify before release" flags (students see the plan's wording without
// them) and every value or line this module had to supply. "module-written" marks text that isn't in the plan.
// Module rules (plan §6): the Four fields indices are teaching values that show only the direction of each effect (labelled
// "model data" on screen); the tone stays neutral and evidence-based; no shopper is shamed for buying organic or conventional food.
// VERIFY (plan §6.1, applies to the whole module): the Canada Organic Regime details; which GM crops are grown in Canada and the
// regulators' roles; the voluntary GM labelling rules; the scientific-consensus statements on GM safety; the evidence summaries
// on organic nutrition; the residue monitoring results; the antibiotic-use rules and their dates; the status of BC open-net
// salmon farming; herbicide-resistant weeds on the Prairies. VERIFY: the direction of every model effect (plan: "verify before release").

// Misconception core sentences (plan §3); "(verify)" flags moved to these comments.
// VERIFY: M1 (approved pesticides in organic), M2 (scientific bodies on GM safety), M5 (organic nutrient differences and residues).
const M1 = "Certified organic farms may use certain approved pesticides, mostly from natural sources; synthetic pesticides are prohibited.";
const M2 = "Major scientific bodies have concluded that approved GM foods are as safe to eat as their conventional counterparts. The live debates are environmental, economic and social.";
const M3 = "Every system wins on some readouts and loses on others. “Best” depends on which goal you’re optimizing.";
const M4 = "Repeating one herbicide selects for weeds that survive it. Rotating crops and methods slows resistance.";
const M5 = "Studies find small or inconsistent nutrient differences. Organic produce does tend to carry fewer pesticide residues.";
const M6 = "No-till protects soil and stores carbon, but it can increase reliance on herbicides to control weeds.";
const M7 = "Those labels describe how the food was produced, not its nutrition. Check the Nutrition Facts table.";

// VERIFY: every reference below (authors, years, titles, volume and page numbers; web-page titles). Health Canada n.d.-a/-b/-c
// are ordered by title, as APA 7 asks.
const REFS = '<ul class="hfa-refs">' +
  "<li>Barański, M., Średnicka-Tober, D., Volakakis, N., Seal, C., Sanderson, R., Stewart, G. B., Benbrook, C., Biavati, B., Markellou, E., Giotis, C., Gromadzka-Ostrowska, J., Rembiałkowska, E., Skwarło-Sońta, K., Tahvonen, R., Janovská, D., Niggli, U., Nicot, P., &amp; Leifert, C. (2014). Higher antioxidant and lower cadmium concentrations and lower incidence of pesticide residues in organically grown crops: A systematic literature review and meta-analyses. <i>British Journal of Nutrition, 112</i>(5), 794–811.</li>" +
  "<li>Canadian Food Inspection Agency. (n.d.). <i>National Chemical Residue Monitoring Program</i>. Government of Canada.</li>" +
  "<li>Canadian General Standards Board. (2020). <i>Organic production systems: Permitted substances lists</i> (CAN/CGSB-32.311-2020). Government of Canada.</li>" +
  "<li>Fisheries and Oceans Canada. (n.d.). <i>Salmon aquaculture in British Columbia</i>. Government of Canada.</li>" +
  "<li>Health Canada. (n.d.-a). <i>Genetically modified (GM) foods and other novel foods</i>. Government of Canada.</li>" +
  "<li>Health Canada. (n.d.-b). <i>Maximum residue limits for pesticides</i>. Government of Canada.</li>" +
  "<li>Health Canada. (n.d.-c). <i>Responsible use of medically important antimicrobials in animals</i>. Government of Canada.</li>" +
  "<li>National Academies of Sciences, Engineering, and Medicine. (2016). <i>Genetically engineered crops: Experiences and prospects</i>. The National Academies Press.</li>" +
  "<li>Smith-Spangler, C., Brandeau, M. L., Hunter, G. E., Bavinger, J. C., Pearson, M., Eschbach, P. J., Sundaram, V., Liu, H., Schirmer, P., Stave, C., Olkin, I., &amp; Bravata, D. M. (2012). Are organic foods safer or healthier than conventional alternatives? A systematic review. <i>Annals of Internal Medicine, 157</i>(5), 348–366.</li>" +
  "</ul>";

// Four fields model (plan §4 Explore "Model rules"; relative indices 0–100, simplified teaching values)
const BASE = {
  conv:{ y:80, inp:70, soil:50, bio:40, cost:60 },
  gm:{ y:85, inp:65, soil:55, bio:40, cost:65 },
  org:{ y:65, inp:0, soil:65, bio:60, cost:55 }
};
const EFFECTS = {
  R:{ y:5, inp:-5, soil:10, bio:5, cost:0 },
  IPM:{ y:0, inp:-15, soil:0, bio:5, cost:-5 },
  NT:{ y:0, inp:5, soil:10, bio:0, cost:-5 },          // no-till, conventional or GM
  NTorg:{ y:-5, inp:0, soil:10, bio:0, cost:0 },        // no-till, organic
  CC:{ y:0, inp:0, soil:10, bio:5, cost:5 },
  IC:{ y:-5, inp:-5, soil:5, bio:10, cost:5 }
};

export default {
  id:"17-agriculture-methods",
  kind:"topic",
  title:"Conventional, organic, GMO and sustainable agriculture",
  topic:"Conventional, Organic, GMO & Sustainable Agriculture",
  readyTopic:"comparing ways to farm",
  hero:{
    headline:"No field wins at everything",
    text:"<strong>Conventional</strong>, <strong>organic</strong> and <strong>genetically modified</strong> farming each make different trade-offs. <strong>Sustainable practices</strong> like crop rotation and cover crops can be added to any of them. To judge them, you need to know what each one does, and how strong the evidence is behind the claims you hear.",
    fig:{ html:'<div class="ag-hero" id="ag-hero"></div>', caption:"" },
    // module-written: the storyboard as a description; the fourth field is conventional + rotation + cover crops (the plan's
    // readout example), since the plan doesn't name its base system
    aria:"Four canola fields side by side: Conventional, Organic, GM (herbicide-tolerant canola), and Conventional plus sustainable practices (crop rotation and cover crops). Each has four small gauges, model index from 0 to 100. Conventional: yield 80, soil 50, inputs 70, biodiversity 40. Organic: yield 65, soil 65, inputs 0, biodiversity 60. GM: yield 85, soil 55, inputs 65, biodiversity 40. Plus sustainable practices: yield 85, soil 70, inputs 65, biodiversity 50. No field is highest on every gauge.",
    banner:"Higher yield here, healthier soil there, fewer inputs over there.",
    fields:[
      { sys:"conv", t:"Conventional", pr:[] },
      { sys:"org", t:"Organic", pr:[] },
      { sys:"gm", t:"GM", sub:"herbicide-tolerant canola", pr:[] },
      { sys:"conv", t:"+ sustainable practices", sub:"rotation + cover crops", pr:["R", "CC"] }
    ]
  },
  goals:[
    "I can describe conventional, organic and GM farming and the sustainable practices any of them can use.",
    "I can explain how crop rotation, IPM, no-till, cover crops, intercropping and fallow fields affect yields, soil and the environment.",
    "I can predict long-term effects of farming choices, such as herbicide-resistant weeds.",
    "I can evaluate claims about organic, GM and conventional food using the strength of the evidence.",
    "I can explain how Canada regulates organic claims, GM foods, pesticides and antibiotics in livestock.",
    "I can design a farm plan that balances yield, soil health, inputs and cost, and explain the trade-offs."
  ],
  start:{
    // module-written from the plan's overview (choices depend on values and budget) and §6.3 (neutral tone)
    blocks:[{ title:"Before you start", html:"<p>Food choices are personal and depend on values and budget. No farming system makes food “good” or “bad”. This module asks you to <strong>weigh the evidence</strong> and your own values, not to judge anyone’s groceries.</p>" }],
    warmup:{
      questions:[
        { id:"w1", skill:"Plant and soil basics", goal:1,
          prompt:"What do fertilizers mainly supply to crops?",
          options:[
            { t:"Nutrients such as nitrogen, phosphorus and potassium", ok:true, why:"Plants take these from soil; fertilizers replace them." },
            { t:"Sunlight", why:"Sunlight comes from the sky." },
            { t:"Pest protection", why:"That’s a pesticide’s job." },
            { t:"Water only", why:"Water comes from rain or irrigation." }],
          hints:["What do plants pull out of soil?", "Nitrogen is the big one.", "N, P and K."] },
        { id:"w2", skill:"Plant and soil basics", goal:2,
          prompt:"Why do farmers worry about soil erosion?",
          options:[
            { t:"Wind and water carry away fertile topsoil, lowering future yields", ok:true, why:"Topsoil takes centuries to form." },
            { t:"Erosion adds nutrients", why:"It removes them." },
            { t:"Erosion only matters in deserts", why:"Prairie dust storms in the 1930s showed otherwise." },
            { t:"Erosion makes crops grow faster", why:"It thins the soil roots need." }],
          hints:["Which layer of soil is most fertile?", "The top layer.", "Losing it lowers yields."] },
        { id:"w3", skill:"Pests and evolution", goal:3,
          prompt:"A farmer sprays the same herbicide every year. A few weeds survive because of a natural trait. What happens over many years?",
          options:[
            { t:"The resistant weeds survive and spread, so the herbicide stops working well", ok:true, why:"Natural selection: the spray removes the competition." },
            { t:"The weeds disappear forever", why:"Survivors reproduce. " + M4 },
            { t:"The herbicide gets stronger", why:"The chemical doesn’t change; the weeds do." },
            { t:"All weeds become resistant in one season", why:"It builds up over seasons." }],
          hints:["Which weeds make seeds?", "The survivors.", "Resistance spreads."] },
        { id:"w4", skill:"Pests and evolution", goal:2,
          prompt:"Why does growing the same crop in the same field every year often increase pest problems?",
          options:[
            { t:"Pests that feed on that crop build up in the field year after year", ok:true, why:"Their food is always there." },
            { t:"Pests prefer new fields", why:"They stay where their food is." },
            { t:"It reduces pests", why:"It feeds them." },
            { t:"Pests only come from neighbouring farms", why:"Many overwinter in the same field." }],
          hints:["What do crop pests need?", "Their host crop.", "Same crop, same field → pests build up."] },
        { id:"w5", skill:"Evidence types", goal:4,
          prompt:"Which kind of evidence is strongest for judging a broad claim like “organic food is more nutritious”?",
          options:[
            { t:"A systematic review that combines many well-designed studies", ok:true, why:"It weighs the whole body of evidence." },
            { t:"One farmer’s testimonial", why:"Personal stories aren’t systematic." },
            { t:"A company’s advertisement", why:"It has a financial interest." },
            { t:"A viral social media post", why:"Popularity isn’t evidence." }],
          hints:["Which source looks at the most studies?", "Reviews combine studies.", "A systematic review."] },
        // VERIFY: W6 (Health Canada's PMRA sets maximum residue limits)
        { id:"w6", skill:"Evidence types", goal:5,
          prompt:"In Canada, who sets the maximum pesticide residue limits allowed on food?",
          options:[
            { t:"Health Canada (its Pest Management Regulatory Agency)", ok:true, why:"Health Canada’s Pest Management Regulatory Agency sets the limits for the whole country." },   // module-written why
            { t:"Grocery stores", why:"Stores follow federal rules." },
            { t:"Each farmer decides", why:"Limits are set nationally." },
            { t:"No one; there are no limits", why:"Maximum residue limits exist." }],
          hints:["Which federal department handles health risks?", "Health Canada.", "Its Pest Management Regulatory Agency."] }
      ],
      refreshers:{
        "Plant and soil basics":"Crops need nutrients (N, P, K), water, light and healthy soil. Topsoil is precious and slow to form.",
        "Pests and evolution":"Repeating one control method selects for pests or weeds that survive it. Variety slows resistance.",
        "Evidence types":"Systematic reviews and expert scientific bodies outweigh single studies, testimonials and ads. Check who funded or wrote a claim."
      }
    }
  },
  explore:{
    heading:"Four fields",
    intro:"Pick a farming system, switch sustainable practices on and off, and watch the readouts. Then run five seasons and see what builds up over time.",
    modes:[{ id:"compare", t:"Compare" }, { id:"builder", t:"Practice builder" }, { id:"seasons", t:"Seasons" }],
    systems:[
      { id:"conv", t:"Conventional", short:"Conventional" },
      { id:"gm", t:"GM herbicide-tolerant", short:"GM" },
      { id:"org", t:"Organic (certified)", short:"Organic" }],
    practices:[
      { id:"R", t:"Crop rotation", abbr:"R" },
      { id:"IPM", t:"IPM", long:"Integrated pest management", abbr:"IPM" },
      { id:"NT", t:"No-till", abbr:"NT" },
      { id:"CC", t:"Cover crops", abbr:"CC" },
      { id:"IC", t:"Intercropping", abbr:"IC" }],
    crop:"Canola",
    cropNote:"The model is tuned for canola. Other crops: coming soon.",
    readouts:[
      { id:"y", t:"Yield" }, { id:"inp", t:"Synthetic inputs" }, { id:"soil", t:"Soil health" }, { id:"bio", t:"Biodiversity" }, { id:"cost", t:"Cost" }],
    base:BASE,
    effects:EFFECTS,
    // resistant-weed index: +15 a season; 6 with rotation; IPM and cover crops each take off 3 (minimum 0); organic stays 0
    weeds:{ inc:15, rot:6, ipm:3, cc:3, seasons:5 },
    modelTag:"Model data",
    modelNote:"Model index from 0 to 100: simplified teaching values that show the direction of each effect, not measurements. Real results vary by crop, region and year.",
    orgInputs:"approved non-synthetic inputs only",
    orgWeeds:"Weeds are managed mechanically and by rotation, so no herbicide selects for resistance.",
    // VERIFY: certification wording (plan P4 reveal)
    cert:{ conv:"Not organic", gm:"Not eligible: GMOs are prohibited in organic production", org:"Eligible for organic certification" },
    // module-written from the plan's overview. VERIFY: the Canada Organic Regime details; GM crops grown in Canada; regulators;
    // voluntary labelling.
    info:{
      conv:"Uses approved synthetic fertilizers and pesticides.",
      gm:"Herbicide-tolerant canola survives a specific herbicide, which makes weed control simpler. In Canada, GM crops are mainly canola, corn, soybeans and sugar beets. Health Canada and the Canadian Food Inspection Agency (CFIA) assess them, and GM labelling is voluntary.",
      org:"Certified under the Canada Organic Regime and the Canadian Organic Standards: synthetic pesticides, synthetic fertilizers and genetically modified organisms (GMOs) are prohibited. Certain approved non-synthetic pesticides may be used."
    },
    // module-written control text
    seasonsNote:"Changing the system or a practice starts the seasons again.",
    predictions:[
      { id:"p1", prompt:"Switch canola from conventional to organic. What happens to the model’s yield?",
        options:[{ t:"It goes down", ok:true }, { t:"It goes up" }, { t:"It stays the same" }, { t:"It drops to zero" }],
        // VERIFY: organic yield gap (plan). "by crop and by practice": the plan says "by crop and practice" (check.mjs reads that as the verb)
        explain:"Reviews find organic yields are lower on average, but the gap varies a lot by crop and by practice. In exchange, organic uses no synthetic inputs and often supports more biodiversity." },
      { id:"p2", prompt:"Run 5 seasons with the same herbicide every year. What happens to the resistant-weed index?",
        options:[{ t:"It rises steadily", ok:true }, { t:"It stays at 0" }, { t:"It falls" }, { t:"It jumps to 100 in season 1" }],
        // VERIFY: herbicide-resistant weeds on Prairie farms
        explain:"Each spray removes the susceptible weeds, leaving the resistant ones to spread. Herbicide-resistant weeds are a real problem on Prairie farms." },
      { id:"p3", prompt:"Turn on no-till. Which two readouts change in the same direction as each other?",
        options:[{ t:"Soil health and synthetic inputs both go up", ok:true }, { t:"Yield and cost both go up" }, { t:"Biodiversity and soil both go down" }, { t:"Nothing changes" }],
        explain:"No-till protects soil, but weeds that tillage would have buried are controlled with more herbicide." },
      { id:"p4", prompt:"Can GM canola be certified organic in Canada?",
        options:[{ t:"No", ok:true }, { t:"Yes, if no pesticides are sprayed" }, { t:"Yes, after one year" }, { t:"Only for export" }],
        explain:"Organic standards prohibit GMOs. GM and organic are separate paths, though both can use sustainable practices." }
    ],
    challenges:[
      { id:"tc1", goal:[2, 6], prompt:"On the <strong>conventional</strong> field, raise soil health to <strong>at least 80</strong> without letting yield drop below 80.",
        why:"Rotation, no-till and cover crops each add 10 soil health, and rotation also adds 5 yield.",   // module-written (from the hints)
        hints:["Soil needs +30. Which practices add soil health?", "Rotation, no-till and cover crops each add 10.", "Rotation + no-till + cover crops: soil 80, yield 85."],
        msgs:{
          sys:"Switch the system to <strong>Conventional</strong> first.",   // module-written
          close:"Close. Which practice adds both soil health and yield?",
          noR:"Soil health is {soil}. Without crop rotation, the most soil health this field can reach is 75.",   // module-written from the plan's note
          soil:"Soil health is {soil}; it needs to reach 80.",   // module-written
          yield:"Yield is {y}; keep it at 80 or more." } },   // module-written
      { id:"tc2", goal:[2, 6], prompt:"On the <strong>organic</strong> field, keep synthetic inputs at 0 and raise yield to <strong>at least 70</strong>.",
        why:"Rotation is the only practice that adds yield. Organic no-till and intercropping each cost 5 yield in this model.",   // module-written (from the plan's feedback and task tip 1)
        hints:["Which practice adds yield?", "Only rotation, +5.", "Rotation, without intercropping or no-till."],
        msgs:{
          sys:"Switch the system to <strong>Organic (certified)</strong> first.",   // module-written
          ic:"Intercropping costs 5 yield in this model.",
          nt:"Organic no-till is hard without herbicides: −5 yield.",
          noR:"Yield is {y}. Which practice adds yield?" } },   // module-written (hint 1)
      { id:"tc3", goal:[3], stretch:true, prompt:"Seasons mode on the <strong>GM</strong> field: run 5 seasons and keep the resistant-weed index <strong>below 40</strong>.",
        // VERIFY: the agronomy summary (plan)
        why:"Rotation works because different crops use different herbicides and break pest cycles. Real farms combine several tactics.",
        hints:["Each season adds 15 unless you change something.", "Rotation cuts the yearly increase to 6; IPM and cover crops each take off 3 more.", "Rotation alone: 6 × 5 = 30. With IPM and cover crops: 0."],
        msgs:{
          sys:"Switch the system to <strong>GM herbicide-tolerant</strong> first.",   // module-written
          run:"Switch to <strong>Seasons</strong> mode and run all 5 seasons first.",   // module-written
          close:"Close. IPM and cover crops slow resistance, but without rotation the same herbicide keeps selecting resistant weeds.",
          other:"The index reached {v} after 5 seasons. " + M4 } }   // module-written lead-in
    ],
    // module-written: the plan's "aha" as a closing sheet
    blocks:[{ title:"What the four fields show", html:"<ul><li><strong>No system maximizes everything.</strong> " + M3 + "</li><li><strong>Sustainable practices shift several readouts at once</strong>, on any system.</li><li><strong>Crop rotation is the single most powerful lever against weed resistance</strong> in this model.</li></ul><p class=\"tiny muted\">The indices are teaching values, tuned only to show the direction of each effect. Real results vary by crop, region and year.</p>" }]
  },
  part3:{
    slug:"evidence", name:"Evidence", heading:"What does the evidence say?",
    // module-written intro from the plan's "How each station works"
    intro:"Each station shows a claim you might meet online or in a store. Decide what kind of source it comes from, how strong its evidence is, and your verdict. Then open <strong>Check it with data</strong> to see what the evidence says.",
    tag:"Practice model (fictional)",
    teacherNote:"Your teacher may add real, credited posts or headlines to check with the same steps.",   // module-written (plan §5)
    sources:[{ id:"review", t:"Scientific review" }, { id:"study", t:"Single study" }, { id:"reg", t:"Government regulator" }, { id:"ad", t:"Company ad" }, { id:"post", t:"Influencer post" }],
    strengths:[{ id:"strong", t:"Strong" }, { id:"moderate", t:"Moderate" }, { id:"weak", t:"Weak" }, { id:"none", t:"None" }],
    verdicts:[{ id:"sup", t:"Supported" }, { id:"not", t:"Not supported" }, { id:"mixed", t:"Mixed" }, { id:"dep", t:"Depends" }],
    // module-written feedback for the three choices
    fbSrc:"Look again at where the claim appeared: who wrote it, and why?",
    fbOk:"All three are right.",
    stations:[
      // Station claims and verdicts: plan. Sources, "evidence it gives" lines and strength keys: module-written practice models.
      // VERIFY: every summary (plan: "verify before release").
      { id:"s1", t:"1. Organic nutrition", claim:"Organic food is more nutritious.",
        seen:"A flyer from FreshRoots, an organic produce-box company (fictional).", gives:"None named: “Everyone knows organic is better for you.”",
        answer:{ src:"ad", str:["none", "weak"], v:"mixed" },
        strFb:"It names no evidence at all, so its evidence can’t be strong or moderate.",
        vFb:"Read the evidence summary: the reviews don’t point clearly one way.",
        data:"Systematic reviews find small or inconsistent differences in most nutrients. Some find more antioxidants and fewer pesticide residues in organic crops. Overall diet matters far more than farming method.",
        from:"Systematic reviews (scientific review)", cite:"(Barański et al., 2014; Smith-Spangler et al., 2012)",
        follow:{ claim:"Organic farms use no pesticides at all.", answer:"not",
          fb:"Approved non-synthetic pesticides are allowed.", cite:"(Canadian General Standards Board, 2020)" } },
      { id:"s2", t:"2. GM food safety", claim:"GM foods are unsafe to eat.",
        seen:"A video from a wellness influencer (fictional).", gives:"A personal story: “I felt better after I cut out GMOs.”",
        answer:{ src:"post", str:["none", "weak"], v:"not" },
        strFb:"A personal story isn’t systematic evidence, so it can’t be strong or moderate.",
        vFb:M2,
        data:"Major scientific bodies (e.g. a 2016 US National Academies report) conclude approved GM foods are as safe to eat as conventional ones. Canada assesses each GM food before sale.",
        from:"A national science academy report (scientific review) · Health Canada (government regulator)", cite:"(Health Canada, n.d.-a; National Academies of Sciences, Engineering, and Medicine, 2016)",
        // plan: sort the real debates into a "still debated" column (M2). The two settled cards are the station claim and a
        // myth from the plan's quick check. module-written: column names and the "why" lines.
        sort:{ title:"What’s still debated?", ask:"Sort each statement: is it still debated, or does the evidence settle it?",
          cols:[{ id:"deb", t:"Still debated" }, { id:"set", t:"Settled by the evidence" }],
          items:[
            { id:"d1", t:"Herbicide-resistant weeds", answer:"deb", why:"An evidence-backed concern about how GM crops are used." },
            { id:"d2", t:"Seed patents and farmer costs", answer:"deb", why:"An economic and social debate." },
            { id:"d3", t:"Corporate concentration", answer:"deb", why:"An economic and social debate." },
            { id:"d4", t:"Effects on non-GM and organic neighbours", answer:"deb", why:"An environmental and economic debate." },
            { id:"d5", t:"Approved GM foods are unsafe to eat", answer:"set", why:"Major scientific bodies conclude approved GM foods are as safe to eat as conventional ones." },
            { id:"d6", t:"GM food changes your DNA", answer:"set", why:"A myth: eating GM food doesn’t change your DNA." }
          ],
          done:"Right. " + M2,
          off:"{n} not sorted yet, or in the wrong column. Ask: is it about eating safety, or about the environment, money and power?" } },
      { id:"s3", t:"3. Pesticide residues", claim:"Pesticide residues on produce are dangerous.",
        seen:"A news story about one small study of strawberry samples (fictional).", gives:"One small study that found residues on some samples.",
        answer:{ src:"study", str:["weak"], v:"dep" },
        strFb:"One small study is weak evidence on its own; reviews and monitoring weigh many samples.",
        vFb:"Read the evidence summary: the answer is different for eaters and for farmworkers.",
        data:"Health Canada sets maximum residue limits with safety margins, and monitoring finds most samples within them. Washing produce removes some residue. Farmworkers face higher exposure than eaters, which is an occupational-safety issue.",
        from:"Health Canada and the CFIA (government regulators)", cite:"(Canadian Food Inspection Agency, n.d.; Health Canada, n.d.-b)" },
      { id:"s4", t:"4. Antibiotics", claim:"Antibiotics in livestock are only an animal issue.",
        seen:"A brochure from a livestock-feed company (fictional).", gives:"None named.",
        answer:{ src:"ad", str:["none", "weak"], v:"not" },
        strFb:"It names no evidence at all, so its evidence can’t be strong or moderate.",
        vFb:"Resistant bacteria can spread between animals, people and the environment.",
        data:"Overusing antibiotics in animals can contribute to antibiotic-resistant bacteria that affect people. Canada has restricted the use of medically important antibiotics in animals, e.g. no growth-promotion claims.",
        from:"Health Canada (government regulator)", cite:"(Health Canada, n.d.-c)" },
      // Station 5 (optional aquaculture extension). VERIFY: the current status of BC open-net salmon farming.
      { id:"s5", t:"5. Salmon farms (optional)", optional:true, claim:"Salmon farming in open-net pens in BC",
        text:"In British Columbia, some salmon are raised in open-net pens in the ocean. The issues to weigh are feed, escapes of farmed fish, sea lice, and government policy, which has been changing.",
        data:"Open nets cost less, but farmed fish can escape and sea lice can spread to wild salmon. Land-based systems contain the fish but use more energy and cost more. Rules for open-net pens in BC have been changing, so check the current status.",
        from:"Fisheries and Oceans Canada (government regulator)", cite:"(Fisheries and Oceans Canada, n.d.)",
        ask:"List one benefit and one concern.", benefit:"One benefit", concern:"One concern" }
    ],
    blocks:[{ title:"Sources (APA 7)", html:REFS }],
    quickCheck:{
      title:"Evidence quick check", summary:"Evidence quick check",
      items:[
        { id:"q1", goal:4, prompt:"Which source is strongest for “GM foods are safe to eat”?",
          choices:[{ t:"National science academy review", ok:true, fb:"Right. Reviews by independent scientific bodies weigh all the evidence." },
                   { t:"A farmer’s video", fb:"Reviews by independent scientific bodies weigh all the evidence." },
                   { t:"A seed company ad", fb:"Reviews by independent scientific bodies weigh all the evidence." },
                   { t:"A viral meme", fb:"Reviews by independent scientific bodies weigh all the evidence." }] },
        // VERIFY: Q2 (approved non-synthetic pesticides)
        { id:"q2", goal:4, prompt:"“Organic means no pesticides.” Verdict?",
          choices:[{ t:"Not supported", ok:true, fb:"Right. Approved non-synthetic pesticides are allowed." },
                   { t:"Supported", fb:"Approved non-synthetic pesticides are allowed." },
                   { t:"Strong evidence for", fb:"Approved non-synthetic pesticides are allowed." },
                   { t:"No evidence either way", fb:"Approved non-synthetic pesticides are allowed." }] },
        { id:"q3", goal:4, prompt:"Which is a genuine, ongoing debate about GM crops?",
          choices:[{ t:"Herbicide-resistant weeds", ok:true, fb:"Right. That’s an evidence-backed concern; the others are myths." },
                   { t:"GM food changes your DNA", fb:"That’s an evidence-backed concern; the others are myths." },
                   { t:"GM canola is radioactive", fb:"That’s an evidence-backed concern; the others are myths." },
                   { t:"GM food has no nutrients", fb:"That’s an evidence-backed concern; the others are myths." }] },
        { id:"q4", goal:4, prompt:"Who faces the highest pesticide exposure?",
          choices:[{ t:"Farmworkers applying pesticides", ok:true, fb:"Right. Occupational exposure is far higher than dietary exposure." },
                   { t:"People eating washed produce", fb:"Occupational exposure is far higher than dietary exposure." },
                   { t:"Grocery cashiers", fb:"Occupational exposure is far higher than dietary exposure." },
                   { t:"People who eat only organic", fb:"Occupational exposure is far higher than dietary exposure." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Practice ↔ effect", summary:"Practice ↔ effect", goal:[1, 2],
        instruction:"Tap a practice, then tap the effect and trade-off that goes with it.", how:"",   // module-written (replaces the toolkit's default controls line)
        leftTitle:"Practice", rightTitle:"Effect and trade-off",
        left:[
          { id:"l1", t:"Crop rotation" },
          { id:"l2", t:"Integrated pest management" },
          { id:"l3", t:"No-till" },
          { id:"l4", t:"Cover crops" },
          { id:"l5", t:"Intercropping" },
          { id:"l6", t:"Fallow field", hints:["Which practice earns nothing that season?", "The field rests.", "Fallow."] },
          { id:"l7", t:"Organic certification" },
          { id:"l8", t:"Herbicide-tolerant GM crop" }
        ],
        // VERIFY: r7 (organic price premium)
        right:[
          { id:"r1", t:"Breaks pest and disease cycles and can add nitrogen (with legumes); needs planning and markets for several crops" },
          { id:"r2", t:"Monitors pests and sprays only above a threshold; takes time and expertise" },
          { id:"r3", t:"Protects soil and stores carbon; can increase herbicide use" },
          { id:"r4", t:"Protect soil between cash crops; cost seed and labour" },
          { id:"r5", t:"Two crops in one field raise biodiversity; harder to harvest" },
          { id:"r6", t:"Rests a field to restore moisture and nutrients; no income that season" },
          { id:"r7", t:"Prohibits synthetic pesticides, synthetic fertilizers and GMOs; usually earns a price premium" },
          { id:"r8", t:"Survives a specific herbicide, making weed control simpler; risks resistant weeds if overused" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l3|r4":"Cover crops are planted plants; no-till is about not ploughing.",
          "l4|r3":"Cover crops are planted plants; no-till is about not ploughing.",
          "l2|r7":"IPM can be used in conventional or organic systems; certification is a separate standard.",
          "l7|r2":"IPM can be used in conventional or organic systems; certification is a separate standard."
        },
        wrongDefault:"Read the trade-off half carefully." },
      { id:"cases", type:"mc", title:"Trade-off cases", summary:"Trade-off cases", star:true, goal:[3, 4, 5],
        instruction:"Choose the best answer for each case. Cases 3 to 6 are non-routine (★).",   // module-written
        // module-written: the question stems after each case and two of the three wrong answers in each item (the plan gives
        // the best answer and the most tempting wrong one).
        items:[
          { id:"t1", goal:4, prompt:"A shopper buys “GMO-free” potato chips believing they’re healthier. What should the shopper know?",
            options:[
              { t:"The label describes production, not nutrition; check the Nutrition Facts table", ok:true, why:M7 },
              { t:"They’re healthier", why:"GMO status says nothing about fat or sodium." },
              { t:"“GMO-free” chips are lower in calories", why:M7 },
              { t:"“GMO-free” means the chips are organic", why:"Separate claims: “GMO-free” and organic are different labels." }] },
          // VERIFY: T2 (organic transition period)
          { id:"t2", goal:5, prompt:"A farm switches to organic. Which change is required?",
            options:[
              { t:"Stop using synthetic pesticides and fertilizers, and follow a transition period before certification", ok:true, why:"Organic standards prohibit synthetic pesticides and fertilizers, and a farm must follow a transition period before it can be certified." },
              { t:"Stop using all pesticides", why:M1 },
              { t:"Switch to GM seed", why:"GMOs are prohibited in organic production." },
              { t:"Plant the same crop every year", why:"Nothing requires that, and growing the same crop every year builds pests up." }] },
          { id:"t3", goal:3, prompt:"A Prairie farm grows herbicide-tolerant canola every year with one herbicide. Weed control is failing. What’s the best plan?",
            options:[
              { t:"Rotate crops and herbicide modes of action, and add other tactics (IPM, cover crops)", ok:true, why:M4 },
              { t:"Spray twice as much", why:"That speeds up resistance. " + M4 },
              { t:"Keep the same herbicide; it will start working again", why:M4 },
              { t:"Switch to another brand of the same herbicide", why:"Same herbicide, same selection: the weeds that survive it keep spreading." }] },
          { id:"t4", goal:[3, 4], prompt:"A greenhouse grows tomatoes year-round, through the winter. Which summary of the trade-offs is most accurate?",
            options:[
              { t:"Local supply in winter and less pesticide drift, but high energy use for heat and light", ok:true, why:"Greenhouses keep local tomatoes coming in winter, with less pesticide drift, but heating and lighting use a lot of energy." },
              { t:"No downsides", why:"Heating and lighting use a lot of energy (see module 16, prediction 4)." },
              { t:"Greenhouses can’t grow food in a Canadian winter", why:"They can: heat and light make winter growing possible, at an energy cost." },
              { t:"Greenhouse tomatoes are always organic", why:"How a crop is grown and whether it’s certified organic are separate questions." }] },
          // VERIFY: T5 (open-net and land-based salmon farms)
          { id:"t5", goal:[3, 4], prompt:"A salmon farm in open-net pens versus a land-based farm. Which comparison is most accurate?",
            options:[
              { t:"Open nets cost less but risk escapes and sea lice spread; land-based systems contain fish but use more energy and cost more", ok:true, why:"Each system trades cost and energy against escapes and sea lice." },
              { t:"Land-based has no trade-offs", why:"Energy and cost are real trade-offs." },
              { t:"Open nets have no effect on wild fish", why:"Escapes and sea lice can reach wild salmon." },
              { t:"The two systems are the same", why:"Where the fish live changes the risks and the costs." }] },
          { id:"t6", goal:4, prompt:"You want to test whether cover crops improve soil on your school garden beds. Which design is fairest?",
            options:[
              { t:"Several matched beds: half with cover crops, half without, same soil, crop and watering; measure soil organic matter before and after", ok:true, why:"Only the cover crop differs, and both groups are measured at the same time." },
              { t:"One bed with cover crops, compared with last year", why:"Weather and other changes are confounded; you need a control group at the same time." },
              { t:"Cover crops on the sunniest beds, none on the shady ones", why:"Sun is a second difference between the groups; keep everything else the same." },
              { t:"Ask gardeners whether cover crops help", why:"Opinions aren’t measurements; compare matched beds." }],
            hints:["What’s the one thing you change?", "Keep everything else the same, and compare at the same time.", "Matched beds, with and without cover crops."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Ronit", goal:[1, 2, 4],
        instruction:"Ronit made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.", how:"",
        problems:[
          // VERIFY: E1 step 1 (the regime's details) and the fix (approved non-synthetic pesticides)
          { id:"e1", goal:1, task:"Explain what certified organic means in Canada.",
            steps:["“Organic farms are certified under national standards.”", "“Organic farms use no pesticides of any kind.”", "“They don’t use synthetic fertilizers or GMOs.”"],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 is correct, but an earlier step isn’t."],
            fixes:[
              { t:"“Synthetic pesticides are prohibited; certain approved non-synthetic pesticides may be used.”", ok:true, why:M1 },
              { t:"“Organic farms use more pesticides than conventional farms.”", why:"That doesn’t fix step 2. " + M1 },   // module-written lead-in
              { t:"“Organic farms may use GMOs.”", why:"GMOs are prohibited in organic production." },   // module-written (from P4)
              { t:"“Step 2 is correct.”", why:M1 }],
            hints:["Are all pesticides synthetic?", "Some come from natural sources.", "The fix: synthetic pesticides are prohibited; certain approved non-synthetic pesticides may be used."] },
          { id:"e2", goal:2, task:"Evaluate switching a conventional field to no-till.",
            steps:["“No-till leaves crop residue on the surface.”", "“This reduces soil erosion and can store more carbon.”", "“Since nothing else changes, no-till has no downsides.”", "“Every farm should switch immediately.”"],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"“Without tillage, weeds are often controlled with more herbicide, so no-till has trade-offs.”", ok:true, why:M6 },
              { t:"“No-till increases erosion.”", why:"Step 2 is right: no-till reduces erosion. " + M6 },   // module-written lead-in
              { t:"“No-till is banned in Canada.”", why:"It isn’t banned. The problem is the claim that it has no downsides." },   // module-written
              { t:"“Step 3 is correct.”", why:M6 }],
            hints:["What did tillage do to weeds?", "It buried them.", "The fix: without tillage, weeds are often controlled with more herbicide, so no-till has trade-offs."] },
          // VERIFY: E3 step 1 (Health Canada assesses GM canola) and the fix (scientific bodies' conclusion)
          { id:"e3", goal:4, task:"Decide whether GM canola oil is safe to eat.",
            steps:["“GM canola is assessed by Health Canada before sale.”", "“I found one blog saying GM oil is dangerous.”", "“So the evidence is split 50-50.”", "“So no one can say whether it’s safe.”"],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 reports a source; the question is how much weight it deserves.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"“One blog doesn’t balance reviews by major scientific bodies, which conclude approved GM foods are as safe as conventional ones.”", ok:true, why:M2 },
              { t:"“Blogs are always wrong.”", why:"Weigh evidence by quality, not by count. A blog isn’t always wrong, but one blog can’t outweigh major reviews." },   // module-written (from hint 2)
              { t:"“Health Canada never reviews food.”", why:"Step 1 is right: GM foods are assessed before sale." },   // module-written
              { t:"“Step 3 is correct.”", why:M2 }],
            hints:["Should one blog count the same as a national science review?", "Weigh evidence by quality, not by count.", "The fix: one blog doesn’t balance reviews by major scientific bodies, which conclude approved GM foods are as safe as conventional ones."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which readout in the Four fields surprised you most, and why?" },
      { id:"j2", q:"In your own words, explain why using the same herbicide every year leads to resistant weeds." },
      { id:"j3", q:"Explain to a friend the difference between “GM foods are unsafe” and “there are real debates about GM crops”." },
      { id:"j4", q:"When you buy food, which of today’s trade-offs matters most to you, and what would help you decide?" }
    ]
  },
  final:{
    // Every factual statement here is a plan "verify before release" item (VERIFY on each line marked below).
    questions:[
      { id:"k1", cat:"K", goal:1,
        // VERIFY: K1 A (GM acreage; no commercial GM wheat) and K1 B (approved non-synthetic pesticides)
        a:{ prompt:"Which crops make up most of Canada’s GM acreage?",
          options:[
            { t:"Canola, corn, soybeans and sugar beets", ok:true, why:"In Canada, GM crops are mainly canola, corn, soybeans and sugar beets." },   // module-written why (plan overview)
            { t:"Wheat, oats and barley", why:"No GM wheat is grown commercially in Canada." },
            { t:"Apples, potatoes and tomatoes only", why:"A few exist, but they aren’t most of the acreage." },
            { t:"Blueberries and maple", why:"Not GM crops." }] },
        b:{ prompt:"Which is allowed on a certified organic farm in Canada?",
          options:[
            { t:"Certain approved non-synthetic pesticides", ok:true, why:M1 },
            { t:"Synthetic nitrogen fertilizer", why:"Prohibited." },
            { t:"GM seed", why:"Prohibited." },
            { t:"Any pesticide used before sunrise", why:"No such rule." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which practice involves monitoring pests and acting only when they pass a threshold?",
          options:[
            { t:"Integrated pest management", ok:true, why:"IPM monitors pests and acts only above a threshold, combining methods." },   // module-written why (flashcard 6)
            { t:"No-till", why:"That’s about not ploughing." },
            { t:"Fallow", why:"That’s resting a field." },
            { t:"Intercropping", why:"That’s growing two crops together." }] },
        b:{ prompt:"Which practice rests a field for a season to restore moisture and nutrients?",
          options:[
            { t:"Fallow", ok:true, why:"A fallow field is left unplanted for a season to recover." },   // module-written why (flashcard 10)
            { t:"Crop rotation", why:"Rotation changes the crop; fallow plants nothing." },
            { t:"Cover crops", why:"Cover crops are planted plants." },
            { t:"Integrated pest management", why:"That’s about pests." }] } },
      { id:"k3", cat:"K", goal:5,
        // VERIFY: K3 A (Health Canada and the CFIA's roles) and K3 B (voluntary GM labelling)
        a:{ prompt:"In Canada, who assesses a new GM food before it can be sold?",
          options:[
            { t:"Health Canada, with the CFIA for environmental and feed aspects", ok:true, why:"Canada assesses each GM food before sale: Health Canada for food safety, the CFIA for environmental and feed aspects." },   // module-written why
            { t:"Grocery chains", why:"They follow federal rules." },
            { t:"Provincial school boards", why:"Not their role." },
            { t:"No one; GM foods are unregulated", why:M2 }] },
        b:{ prompt:"Is labelling GM foods mandatory in Canada?",
          options:[
            { t:"No; GM labelling is voluntary, but it must be truthful and not misleading", ok:true, why:"In Canada, GM labelling is voluntary, and any GM claim must be truthful and not misleading." },   // module-written why
            { t:"Yes, every GM ingredient must be listed", why:"Labelling is voluntary." },
            { t:"Only for imported foods", why:"There’s no such rule." },
            { t:"GM foods are banned, so labels aren’t needed", why:"GM foods are approved and sold." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Two farms grow herbicide-tolerant canola. Farm X uses one herbicide every year. Farm Y rotates crops and herbicides. After 5 years, which is most likely?",
          options:[
            { t:"Farm X has more herbicide-resistant weeds", ok:true, why:"Repeated selection favours resistant weeds." },
            { t:"Farm Y has more resistance", why:"Rotation slows resistance." },
            { t:"Neither has resistance; GM crops prevent it", why:M4 },
            { t:"Both have identical weeds", why:"Practices change outcomes." }] },
        b:{ prompt:"In the model, a GM field with IPM and cover crops but no rotation reaches an index of 45. What single change best brings it below 40?",
          options:[
            { t:"Add crop rotation", ok:true, why:"The increment drops from 9 to 0: index 0." },
            { t:"Remove cover crops", why:"That raises the index." },
            { t:"Switch the herbicide brand but keep everything else", why:"The model treats rotation as the main lever; one swap doesn’t break the pattern." },
            { t:"Run more seasons", why:"The index keeps climbing." }] } },
      { id:"t2", cat:"T", goal:4,
        // VERIFY: T2 A (systematic reviews on organic nutrition) and T2 B (scientific bodies on GM safety)
        a:{ prompt:"A website says organic apples are “far more nutritious” and cites one small study. How should you judge this claim?",
          options:[
            { t:"Weak: one small study, while systematic reviews find small or inconsistent differences", ok:true, why:M5 },
            { t:"Strong, because it cites a study", why:"One study doesn’t outweigh reviews." },
            { t:"Proven, because organic means healthier", why:M7 },
            { t:"Impossible to judge", why:"You can compare it with reviews." }] },
        b:{ prompt:"A friend says, “Scientists are split on whether GM food is safe to eat.” Which response is most accurate?",
          options:[
            { t:"“Major scientific bodies agree approved GM foods are safe to eat; the debates are about environmental and economic issues.”", ok:true, why:M2 },
            { t:"“Yes, it’s 50-50.”", why:M2 },
            { t:"“No GM food has ever been tested.”", why:"Approved GM foods are assessed." },
            { t:"“GM foods are banned in Canada.”", why:"They’re approved and sold." }] } },
      { id:"t3", cat:"T", goal:5,
        // VERIFY: T3 B (Canadian rules on medically important antibiotics)
        a:{ prompt:"Why does reducing antibiotic use in livestock matter for people?",
          options:[
            { t:"Overuse can help antibiotic-resistant bacteria develop, which can make human infections harder to treat", ok:true, why:"Overusing antibiotics in animals can contribute to antibiotic-resistant bacteria that affect people." },   // module-written why (Station 4)
            { t:"Antibiotics make meat taste different", why:"Not the issue." },
            { t:"Animals become allergic to antibiotics", why:"Not the main concern." },
            { t:"It doesn’t matter for people", why:"Resistance can spread between animals, people and the environment." }] },
        b:{ prompt:"Which policy best addresses antibiotic resistance from farming?",
          options:[
            { t:"Allowing medically important antibiotics only under veterinary oversight, with no growth-promotion use", ok:true, why:"Sick animals still get treatment, and overuse that drives resistance is cut." },   // module-written why
            { t:"Banning all veterinary medicine", why:"Sick animals need treatment." },
            { t:"Adding antibiotics to all feed", why:"That increases resistance." },
            { t:"Labelling meat as “natural”", why:"Labels don’t change practice." }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"Which sentence best explains why no farming system is “best”?",
          options:[
            { t:"“Each system performs well on some goals (yield, soil, inputs, biodiversity, cost) and less well on others, so the best choice depends on which goals matter most.”", ok:true, why:M3 },
            { t:"“Organic is best at everything.”", why:M3 },
            { t:"“Conventional is best at everything.”", why:M3 },
            { t:"“All systems are identical.”", why:"The readouts differ." }] },
        b:{ prompt:"Which sentence best describes crop rotation’s effect in the model?",
          options:[
            { t:"“Rotation raises yield and soil health a little and strongly slows herbicide resistance.”", ok:true, why:"In the model, rotation adds 5 yield and 10 soil health, and cuts the yearly resistance increase from 15 to 6." },   // module-written why (model rules)
            { t:"“Rotation lowers every readout.”", why:"It improves several." },
            { t:"“Rotation only affects cost.”", why:"It changes yield, soil, inputs and resistance." },
            { t:"“Rotation makes a farm organic.”", why:"Certification is separate." }] } },
      { id:"c2", cat:"C", goal:4,
        // VERIFY: C2 B (residue monitoring; farmworker exposure)
        a:{ prompt:"Which is the clearest way to describe the “GMO-free” label?",
          options:[
            { t:"“It tells you the food wasn’t made with genetically modified ingredients; it doesn’t tell you whether the food is nutritious.”", ok:true, why:M7 },
            { t:"“It means the food is organic.”", why:"Separate claims." },
            { t:"“It means the food is healthier.”", why:M7 },
            { t:"“It means the food is from Canada.”", why:"Origin is a separate claim." }] },
        b:{ prompt:"Which statement about pesticide residues is best supported?",
          options:[
            { t:"“Most monitored Canadian produce has residues below Health Canada’s limits; farmworkers face higher exposure than eaters.”", ok:true, why:"Monitoring finds most samples within the limits, and occupational exposure is far higher than dietary exposure." },   // module-written why (Station 3, Q4)
            { t:"“All produce is contaminated to dangerous levels.”", why:"Monitoring doesn’t show that." },
            { t:"“Residues never exist on conventional produce.”", why:"Some do, mostly below limits." },
            { t:"“Washing makes residues more dangerous.”", why:"Washing removes some residue." }] } },
      { id:"a1", cat:"A", goal:2,
        a:{ prompt:"A farmer’s field is losing topsoil to wind every spring. Which pair of practices helps most?",
          options:[
            { t:"No-till and cover crops", ok:true, why:"Both keep the soil covered." },
            { t:"Ploughing twice and leaving the field bare", why:"That increases erosion." },
            { t:"Switching to GM seed only", why:"Seed type alone doesn’t cover the soil." },
            { t:"Fallow with bare soil", why:"Bare fallow can increase erosion." }] },
        b:{ prompt:"A vegetable farm faces rising pest damage but wants to cut pesticide use. Which plan fits?",
          options:[
            { t:"IPM with monitoring and thresholds, plus crop rotation", ok:true, why:"IPM sprays only when pests pass a threshold, and rotation breaks pest cycles." },   // module-written why (practice pairs 1 and 2)
            { t:"Spraying on a fixed weekly schedule", why:"That ignores whether the pests are there." },
            { t:"Growing the same crop every year", why:"That builds pests up." },
            { t:"Stopping all pest control", why:"Losses could be severe." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A canola farm must keep yield at least 75 and keep the resistant-weed index below 40 (model). Which plan works?",
          options:[
            { t:"GM with rotation, IPM and cover crops", ok:true, why:"Yield 90, index 0." },
            { t:"GM with no practices", why:"Index 75." },
            { t:"Organic with intercropping and cover crops", why:"Yield 60." },
            { t:"Conventional with IPM, cover crops and no-till", why:"Index 45." }] },
        b:{ prompt:"A farm wants soil health of at least 70 and synthetic inputs of 50 or less, using conventional canola (model). Which plan works?",
          options:[
            { t:"Rotation, IPM and cover crops", ok:true, why:"Soil 70, inputs 50." },
            { t:"Rotation only", why:"Soil 60, inputs 65." },
            { t:"No-till and cover crops", why:"Inputs 75." },
            { t:"Cover crops only", why:"Soil 60, inputs 70." }] } }
    ]
  },
  task:{
    title:"Farm plan",
    summary:"Farm plan",
    statement:"<p>You manage a model canola farm. Choose a system and practices that meet every condition below. More than one plan works.</p><ol class=\"ag-goals\"><li>Yield at least 75.</li><li>Soil health at least 70.</li><li>Synthetic inputs 50 or less.</li><li>Resistant-weed index below 40 after 5 seasons.</li><li>Cost 65 or less.</li></ol>" +
      // module-written (plan §6.4: yield is a hard requirement here)
      "<p class=\"tiny muted\">This task counts only these five readouts. Real farms also weigh other things, such as the price premium organic food can earn. All values are model data.</p>",
    checks:["Yield ≥ 75", "Soil health ≥ 70", "Synthetic inputs ≤ 50", "Resistance under control", "Affordable"],
    tips:["Rotation is the only practice that adds yield.", "Soil climbs with rotation, no-till, cover crops and intercropping.", "IPM cuts synthetic inputs the most.", "Without rotation, the index stays at 45 or higher.", "Cover crops and intercropping each add 5 to cost; IPM and no-till save 5."],
    after3:"Every plan uses rotation and IPM. No organic plan meets this yield target in the model, though organic earns a price premium this task doesn’t count. Change the goals and the best plan changes.",
    explainPrompt:"Explain why your plan meets all five goals, and name one trade-off you accepted.",
    vocab:"Use the words rotation, resistance, soil health and trade-off.",
    success:"Your plan meets all five goals!"   // module-written
  },
  cards:[
    ["Conventional farming", "Uses approved synthetic fertilizers and pesticides; often higher yields."],
    // VERIFY: cards 2 and 11
    ["Certified organic (Canada)", "Follows the Canadian Organic Standards: no synthetic pesticides or fertilizers, no GMOs."],
    ["Genetically modified (GM) crop", "A crop whose DNA was changed using genetic engineering, e.g. herbicide-tolerant canola."],
    ["Herbicide-resistant weeds", "Weeds that survive a herbicide after repeated use selects for them."],
    ["Crop rotation", "Changing crops in a field over seasons to break pest cycles and build soil."],
    ["Integrated pest management (IPM)", "Monitor pests and act only above a threshold, combining methods."],
    ["No-till", "Planting without ploughing; protects soil, but may increase herbicide use."],
    ["Cover crop", "A crop grown to protect and improve soil between cash crops."],
    ["Intercropping", "Growing two or more crops together in one field."],
    ["Fallow", "Leaving a field unplanted for a season to recover."],
    ["Maximum residue limit", "The highest legal pesticide residue on a food, set by Health Canada."],
    ["Antibiotic resistance", "Bacteria that survive antibiotics; overuse in people or animals speeds it up."]
  ]
};
