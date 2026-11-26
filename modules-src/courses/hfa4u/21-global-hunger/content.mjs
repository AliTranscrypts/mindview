// HFA4U 21 Global Hunger & Malnutrition. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/21-global-hunger.md
// Teacher notes: lines marked VERIFY carry the plan's "verify before release" flags (students see the plan's wording without
// them) and every value or line this module had to supply. "module-written" marks text that isn't in the plan.
// Module rules (plan §5–6): Explore, Practice and the Final Check use MODEL DATA built to match the pattern in FAO et al.
// (2024), labelled "Model data" on screen, so exact answers stay stable. Real figures appear only in the Explore "Check it
// with data" panel. Profiles are lettered A–D, never real countries. No photographs or images of people: maps, icons and
// bars only. Feedback rejects explanations that blame people (M6). The module never asks about a student's own household.
// VERIFY (plan §6.1, whole module): the FAO figures (713–757 million in 2023, about 1 in 11; regional rates of about 20%,
// 8%, 6% and 7%; about 2.8 billion unable to afford a healthy diet in 2022) must be checked, or updated to the newest
// report, before release. VERIFY (plan §6.2): the WHO/UNICEF prevalence thresholds and anemia bands used for the profile
// bands. The double-burden flag is the module's own stated rule, not an official definition.

// VERIFY: 211 before release (plan: support note under the hero and again in Reflect).
const SUPPORT = '<div class="hfa-support" role="note"><p>If you or your family sometimes don’t have enough food, you’re not alone, and it isn’t your fault. Talk to someone you trust at school, or call or text <span class="nw">211</span> to find local food programs.</p></div>';

// Misconception core sentences (plan §3)
const M1 = "The world grows enough food overall. Most hunger comes from people being unable to reach or afford food, especially during conflict, disasters and price shocks.";
const M2 = "Africa has the highest share; Asia has the most people. A percentage only becomes a number when you multiply it by the population.";
const M3 = "Malnutrition also includes missing vitamins and minerals and overweight, and both can happen in one country, even one household.";
const M5 = "The swelling is edema (fluid), a warning sign of severe malnutrition, not extra food.";

// Model profiles (plan, Explore "Model data (Country profiles)"). s stunting, w wasting, o overweight (children under 5),
// an anemia (women 15–49). Shared by Explore, Practice D4, the Final Check text and the task card.
const PROFILES = [
  { id:"A", s:32, w:11, o:3, an:42, stress:["two drought years", "low household incomes"] },
  { id:"B", s:22, w:5, o:12, an:30, stress:["fast-rising cheap processed foods", "low incomes"] },
  { id:"C", s:6, w:1, o:11, an:14, stress:["high-income", "long work hours"] },
  { id:"D", s:14, w:7, o:6, an:25, stress:["conflict nearby", "price spikes"] }
];

export default {
  id:"21-global-hunger",
  kind:"topic",
  title:"Global hunger and malnutrition",
  topic:"Global Hunger & Malnutrition",
  readyTopic:"global hunger and malnutrition",
  hero:{
    eq:'Enough food grown ≠ enough food eaten<span class="gh-eqsub">availability · accessibility · adequacy · acceptability · sustainability</span>',
    eqSize:"sm",
    eqLabel:"Enough food grown is not the same as enough food eaten. Availability, accessibility, adequacy, acceptability, sustainability.",
    headline:"A world that grows enough food, and still millions go hungry",
    text:"The world produces enough food to feed everyone, yet hundreds of millions of people face <strong>hunger</strong>, and many more live with <strong>malnutrition</strong>: children who are <strong>stunted</strong> or <strong>wasted</strong>, people missing key vitamins and minerals (<strong>hidden hunger</strong>), and, often in the same places, rising <strong>overweight</strong>. To understand why, you’ll read real-world patterns, tell rates from counts, and trace hunger back to its causes.",
    fig:{ html:'<div class="gh-hero" id="gh-hero"></div>', caption:"" },
    // module-written description of the plan's storyboard (model data)
    aria:"A world map draws in. A tall bar labelled Food produced per person rises past a dashed line labelled Enough for everyone. The regions shade by hunger rate, model data: Africa 20%, Asia 8%, Oceania 7%, Latin America and the Caribbean 6%, Northern America and Europe under 2.5%. The shading fades into circles sized by the number of people facing hunger: Asia’s circle, 384 million, is the largest, then Africa’s, 300 million. Final frame: both maps side by side, with the question: A share of what?",
    // module-written captions for the storyboard frames; the last one is the reduced-motion final frame
    caps:{ rate:"Share of people facing hunger", count:"Number of people", final:"A share of what?" },
    finalLegend:{ rate:"Share of people facing hunger", rateVals:"Africa 20% · Asia 8%", count:"Number of people", countVals:"Asia 384 million · Africa 300 million" }
  },
  goals:[
    "I can tell hunger (undernourishment) apart from the forms of malnutrition: stunting, wasting, underweight, hidden hunger and overweight.",
    "I can describe the signs and causes of severe malnutrition (marasmus, kwashiorkor) and common micronutrient deficiencies.",
    "I can read global hunger data, telling a rate from a count and model data from measured data.",
    "I can explain how geography, natural disasters, conflict and economic factors cause hunger, using the components of food security.",
    "I can explain the double burden of malnutrition.",
    "I can evaluate responses to malnutrition by matching them to the problem and its root causes."
  ],
  start:{
    blocks:[{ html:SUPPORT }],
    warmup:{
      questions:[
        { id:"w1", skill:"Micronutrient deficiencies", goal:2,
          prompt:"A long-term lack of which nutrient causes goitre (an enlarged thyroid)?",
          options:[
            { t:"Iodine", ok:true, why:"The thyroid needs iodine to make its hormones. Iodized salt prevents goitre." },
            { t:"Iron", why:"Too little iron causes anemia." },
            { t:"Vitamin C", why:"That’s scurvy: bleeding gums and slow healing." },
            { t:"Vitamin D", why:"That’s rickets: soft, bowed bones in children." }],
          hints:["Which mineral does the thyroid use?", "It’s added to table salt in Canada.", "Iodine."] },
        { id:"w2", skill:"Micronutrient deficiencies", goal:2,
          prompt:"Iron-deficiency anemia mainly causes…",
          options:[
            { t:"tiredness and weakness, because the blood carries less oxygen", ok:true, why:"Iron is part of hemoglobin, which carries oxygen." },
            { t:"bleeding gums", why:"That’s vitamin C (scurvy)." },
            { t:"night blindness", why:"That’s vitamin A." },
            { t:"soft, bowed bones", why:"That’s vitamin D (rickets)." }],
          hints:["What does iron do in red blood cells?", "It helps carry oxygen.", "Less oxygen → tired and weak."] },
        { id:"w3", skill:"Food security components", goal:4,
          prompt:"A grocery store is full of food, but a family can’t afford enough of it. Which component of food security is missing?",
          options:[
            { t:"Accessibility", ok:true, why:"The food is there, but the family can’t get it, here because of cost." },
            { t:"Availability", why:"The shelves are full, so food is available." },
            { t:"Acceptability", why:"That’s about whether food fits a person’s culture and preferences." },
            { t:"Sustainability", why:"That’s about the long term and the environment." }],
          hints:["Is the food present?", "Yes, so the problem is getting it.", "Accessibility."] },
        { id:"w4", skill:"Food security components", goal:4,
          prompt:"A community gets enough calories, mostly from one cheap staple, but very few vegetables, fruit or protein foods. Which component is weakest?",
          options:[
            { t:"Adequacy", ok:true, why:"Adequacy means enough <em>nutritious</em>, safe food, not just enough calories." },
            { t:"Availability", why:"Calories are available; the variety isn’t." },
            { t:"Acceptability", why:"Nothing suggests the food conflicts with culture." },
            { t:"Accessibility", why:"They can get food; it just isn’t varied enough." }],
          hints:["Enough food, or enough <em>nutrition</em>?", "Calories are covered; nutrients aren’t.", "Adequacy."] },
        { id:"w5", skill:"Percentages and rates", goal:3,
          prompt:"A region of 400 million people has 10% of its people facing hunger. How many people is that?",
          options:[
            { t:"40 million", ok:true, why:"10% of 400 million is 40 million." },
            { t:"4 million", why:"4 million is 1% of 400 million." },
            { t:"10 million", why:"10% isn’t 10 million; multiply by the population." },
            { t:"400 million", why:"That’s the whole population." }],
          hints:["10% means 10 out of every 100.", "One-tenth of 400 million.", "40 million."] },
        { id:"w6", skill:"Percentages and rates", goal:3,
          prompt:"Region P: 30% of 100 million people face hunger. Region Q: 10% of 500 million. Which has more people facing hunger?",
          options:[
            { t:"Q: 50 million vs 30 million", ok:true, why:"A lower rate in a bigger population can mean more people." },
            { t:"P, because its percentage is higher", why:"Rate isn’t count: 30% of 100 million is 30 million." },
            { t:"They’re equal", why:"30 million and 50 million aren’t equal." },
            { t:"You can’t tell without more data", why:"You have the rates and populations; multiply." }],
          hints:["Turn each rate into a number of people.", "P: 30 million. Q: 50 million.", "Q."] }
      ],
      refreshers:{
        "Micronutrient deficiencies":"Iodine → goitre; iron → anemia (tiredness); vitamin A → night blindness and weaker immunity; vitamin C → scurvy; vitamin D → rickets. Together these are called <em>hidden hunger</em>, because a person can eat enough calories and still be deficient.",
        "Food security components":"Availability (is the food there?), accessibility (can people get and afford it?), adequacy (is it nutritious and safe?), acceptability (does it fit their culture and needs?), sustainability (will it last, for people and the environment?).",
        "Percentages and rates":"A rate is a share of a population. Number of people = rate × population. Example: 20% of 1500 million = 300 million."
      }
    }
  },
  explore:{
    heading:"World hunger map",
    intro:"Explore hunger and malnutrition around the world using model data based on recent FAO reports. Switch between rates and counts, open country profiles, and turn on the causes overlay.",
    modes:[{ id:"world", t:"World view" }, { id:"profiles", t:"Country profiles" }, { id:"causes", t:"Causes overlay" }],
    measures:[{ id:"rate", t:"Rate (%)" }, { id:"count", t:"Count (millions)" }],
    // Model data (World view), plan table. count = people facing hunger (millions); Oceania 7% × 45 ≈ 3.
    regions:[
      { id:"af", t:"Africa", pop:1500, rate:20, count:300 },
      { id:"as", t:"Asia", pop:4800, rate:8, count:384 },
      { id:"la", t:"Latin America & the Caribbean", pop:650, rate:6, count:39 },
      { id:"oc", t:"Oceania", pop:45, rate:7, count:3, approx:true },
      { id:"ne", t:"Northern America & Europe", pop:1100, low:true }
    ],
    lowRate:"under 2.5%",
    lowCount:"not shown (FAO doesn’t report rates under 2.5%)",
    lowRank:"not ranked: the rate is under 2.5%",   // module-written
    dataLine:"Model data based on FAO et al. (2024)",
    // module-written captions under the map (storyboard 2: "Rate × population = count")
    keyRate:"Shading: the share of each region’s people facing hunger. Darker means a higher rate.",
    keyCount:"Circles: the number of people facing hunger (circle area = count). Rate × population = count.",
    slots:{ rate:"Highest hunger rate", count:"Most people facing hunger", rateHow:"tap a region with Rate on", countHow:"tap a region with Count on" },   // module-written labels
    // VERIFY: every figure in this panel (FAO et al., 2024), or update to the newest report.
    realData:'<p>FAO et al. (2024), <i>The State of Food Security and Nutrition in the World 2024</i>:</p><ul><li>about 713–757 million people faced hunger in 2023 (about 1 in 11);</li><li>the rate was about 20% in Africa, about 8% in Asia, about 6% in Latin America &amp; the Caribbean, and about 7% in Oceania;</li><li>about 2.8 billion people could not afford a healthy diet (2022).</li></ul>' +
      '<p class="tiny">The map uses model data built to match this pattern, so that answers stay exact.</p>' +
      '<p class="tiny"><strong>Reference (APA 7)</strong></p><ul class="hfa-refs"><li>FAO, IFAD, UNICEF, WFP, &amp; WHO. (2024). <i>The state of food security and nutrition in the world 2024</i>. FAO.</li></ul>',
    profiles:PROFILES,
    indicators:[
      { id:"s", t:"Stunting", sub:"children under 5", scale:"child" },
      { id:"w", t:"Wasting", sub:"children under 5", scale:"child" },
      { id:"o", t:"Overweight", sub:"children under 5", scale:"child" },
      { id:"an", t:"Anemia", sub:"women 15–49", scale:"anemia" }
    ],
    // Threshold labels (plan). lo = lower bound of each band, in %. VERIFY: WHO/UNICEF prevalence thresholds and anemia bands.
    bands:{
      s:[[0, "very low"], [2.5, "low"], [10, "medium"], [20, "high"], [30, "very high"]],
      w:[[0, "very low"], [2.5, "low"], [5, "medium"], [10, "high"], [15, "very high"]],
      o:[[0, "very low"], [2.5, "low"], [5, "medium"], [10, "high"], [15, "very high"]],
      an:[[5, "mild"], [20, "moderate"], [40, "severe"]]
    },
    bandsText:"<strong>Stunting:</strong> under 2.5 very low · 2.5–9 low · 10–19 medium · 20–29 high · 30+ very high.<br><strong>Wasting:</strong> under 2.5 very low · 2.5–4 low · 5–9 medium · 10–14 high · 15+ very high.<br><strong>Overweight:</strong> under 2.5 very low · 2.5–4 low · 5–9 medium · 10–14 high · 15+ very high.<br><strong>Anemia:</strong> 5–19 mild · 20–39 moderate · 40+ severe.",
    bandsNote:"Bands follow the WHO/UNICEF prevalence thresholds.",
    rule:"The module’s double-burden rule: flag a double burden when stunting is 20% or more <strong>and</strong> child overweight is 10% or more.",
    // P4 reveal note (plan)
    wastingNote:"too thin for height: can develop in weeks",
    // Causes overlay: the seven overlay causes (plan) in Part 3's key; ov is the overlay's label.
    overlay:["conflict", "drought", "flood", "spike", "jobs", "healthy", "water"],
    normalHarvest:"A region with a normal world harvest",   // P3 start state (plan)
    predictions:[
      { id:"p1", prompt:"Switch to Count. Which region will have the biggest circle?",
        options:[{ t:"Asia", ok:true }, { t:"Africa" }, { t:"Latin America & the Caribbean" }, { t:"Oceania" }],
        explain:"Africa’s rate is higher, but Asia’s population is more than three times larger, so it has more people facing hunger. Asia: 384 million; Africa: 300 million." },
      { id:"p2", prompt:"Profile B has 22% stunting. Will the double-burden flag light up?",
        options:[{ t:"Yes: stunting and child overweight are both high", ok:true }, { t:"No: a country can’t have both problems" }, { t:"No: stunting is too low" }, { t:"Only if wasting is high too" }],
        explain:"Cheap, energy-dense foods can sit alongside long-term undernutrition. That’s the double burden." },
      { id:"p3", prompt:"A drought cuts this region’s harvest, but world grain stocks are plentiful. What happens to local hunger?",
        options:[{ t:"It rises: there’s less local food and prices climb beyond what low-income families can pay", ok:true }, { t:"It stays the same, because the world has enough" }, { t:"It falls, because people buy imported food" }, { t:"It rises only if the whole world’s harvest fails" }],
        explain:"Global plenty doesn’t feed a family that can’t reach or afford food." },
      { id:"p4", prompt:"Which form of malnutrition shows a <em>recent</em>, severe shortage of food or illness, rather than a long-term one?",
        options:[{ t:"Wasting", ok:true }, { t:"Stunting" }, { t:"Overweight" }, { t:"Anemia" }],
        explain:"Stunting builds up over years; wasting can appear quickly in a crisis." }
    ],
    chalIntro:"Set the map, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:3, prompt:"Fill the two answer slots: the region with the <strong>highest hunger rate</strong>, and the region with the <strong>most people</strong> facing hunger.",
        why:"Africa has the highest rate (20%); Asia has the most people facing hunger (384 million). Rate × population = count.",   // module-written
        hints:["Rate first, with the Rate view on.", "Now switch to Count and compare circle sizes.", "Africa (20%) and Asia (384 million)."] },
      { id:"tc2", goal:[1, 3], prompt:"Find the profile where children face <strong>very high stunting and high wasting at the same time</strong>, and name its biggest problem.",
        why:"Profile A: stunting 32% (very high) and wasting 11% (high). Stunting is in the higher band, so it’s A’s biggest problem.",   // module-written
        hints:["Look for two bars past their ‘high’ lines.", "Only A has wasting at 10% or more.", "A, and stunting is its biggest problem."] },
      { id:"tc3", goal:5, stretch:true, prompt:"In What-if mode, change profile D so the double-burden flag lights up while wasting stays below the ‘high’ line. Use the smallest total change.",
        why:"Stunting 14% → 20% (+6) and overweight 6% → 10% (+4): the flag lights up after a total change of 10, and wasting stays at 7%.",   // module-written
        hints:["The rule needs stunting ≥ 20% and overweight ≥ 10%.", "D starts at 14% and 6%. How far is each from its line?", "+6 and +4: stunting 20, overweight 10."] }
    ],
    // Named wrong states (plan) and module-written fallbacks
    msgs:{
      tc1Empty:"Fill both slots: tap a region with Rate on, then tap a region with Count on.",   // module-written
      tc1AfBoth:"Africa has the highest rate, but count depends on population too. Switch to Count.",
      tc1AsBoth:"Asia has the most people, but its rate (8%) is lower than Africa’s (20%).",
      tc1Oc:"Oceania’s rate is 7%; look for a darker region.",
      tc1Swap:"Check which slot is which: the first is the highest rate, the second the most people.",   // module-written
      tc1Rate:"Compare the shading again: which region has the highest rate?",   // module-written
      tc1Count:"Compare the circles again: which region has the most people facing hunger?",   // module-written
      tc2B:"B’s stunting is high, but wasting is 5% (medium).",
      tc2Wasting:"Wasting is high (11%), but stunting is very high (32%), the higher band.",
      tc2Other:"Look for two bars past their ‘high’ lines.",   // module-written (hint 1)
      tc2Chip:"Now name its biggest problem with the chips.",   // module-written
      tc2Over:"Overweight is low (3%) in profile A.",   // module-written
      tc3Mode:"Turn on What-if mode and choose profile D.",   // module-written
      tc3Prof:"This challenge changes profile D.",   // module-written
      tc3OnlyS:"Stunting is high now, but child overweight must also reach 10%.",
      tc3Moved:"The flag is on, but you moved {n} points; it can be done in 10.",
      tc3Wasting:"Wasting isn’t part of the rule, and the goal keeps it below 10%.",
      tc3WastingDown:"Leave wasting at 7%: it isn’t part of the rule, and every point you move counts.",   // module-written
      tc3Rule:"The rule needs stunting ≥ 20% and overweight ≥ 10%."
    },
    readLabels:{ sel:"Selected", rate:"Hunger rate", count:"People facing hunger", rank:"Rank", big:"Biggest problem", db:"Double burden (module rule)", change:"Total change (What-if)", cause:"Cause → components", data:"Data" },
    blocks:[{ title:"The big idea", html:"<ul><li>A rate is not a count.</li><li>Malnutrition has many forms, including the double burden.</li><li>Hunger follows from shocks and access, not from a world without enough food.</li></ul>" }]
  },
  part3:{
    slug:"causes", name:"Causes", heading:"Why hunger persists",
    intro:"Build a cause map: connect each cause to the component of food security it hits, then to the outcome it leads to. Then test your map against data.",   // module-written
    frame:"These are systems problems. Farmers, community health workers and governments in affected regions lead most solutions.",
    how:"Tap a cause, then the component it hits first. Then tap an outcome to finish the path. Build at least one path for every cause.",   // module-written
    components:[{ id:"avail", t:"Availability" }, { id:"access", t:"Accessibility" }, { id:"adequ", t:"Adequacy" }, { id:"accept", t:"Acceptability" }, { id:"sustain", t:"Sustainability" }],
    outcomes:[{ id:"hunger", t:"Hunger" }, { id:"wasting", t:"Wasting" }, { id:"stunting", t:"Stunting" }, { id:"hidden", t:"Hidden hunger" }, { id:"over", t:"Overweight" }],
    // The key: answer = { component: [outcomes] }. Plan examples: drought, price spike, high cost of healthy diets, unsafe water,
    // conflict, gender inequality. VERIFY (module-written key): flood, job losses and low wages; the added hunger links for
    // conflict and drought (from P3, T3) and drought → stunting (long term) (Explore storyboard).
    // notes: label on the cause → component link; onotes: label on an outcome for this cause.
    causes:[
      { id:"conflict", t:"Conflict", short:"Conflict", ov:"Conflict", answer:{ avail:["hunger", "wasting"], access:["hunger", "wasting"] } },
      { id:"drought", t:"Drought", short:"Drought", ov:"Drought", answer:{ avail:["hunger", "wasting", "stunting"], access:["hunger"] }, notes:{ access:"prices ↑" }, onotes:{ stunting:"(long term)" } },
      { id:"flood", t:"Flood", short:"Flood", ov:"Flood", answer:{ avail:["hunger", "wasting"], access:["hunger", "wasting"] } },
      { id:"spike", t:"World price spike", short:"World price spike", ov:"Price spike", answer:{ access:["hunger"] } },
      { id:"jobs", t:"Job losses", short:"Job losses", ov:"Job losses", answer:{ access:["hunger"] } },
      { id:"wages", t:"Low wages", short:"Low wages", answer:{ access:["hunger", "stunting"] } },
      { id:"healthy", t:"High cost of healthy diets", short:"Cost of healthy diets", ov:"High cost of healthy diets", answer:{ adequ:["hidden", "over"] } },
      { id:"water", t:"Unsafe water and poor sanitation", short:"Unsafe water", ov:"Unsafe water and sanitation", answer:{ adequ:["wasting", "stunting"] }, notes:{ adequ:"nutrients aren’t absorbed when children are sick" } },
      { id:"gender", t:"Gender inequality in land and income", short:"Gender inequality", answer:{ access:["stunting"] }, onotes:{ stunting:"(through mothers’ and young children’s nutrition)" } }
    ],
    msgs:{
      wrongComp:"That link could happen, but it isn’t the main path. Try the component this cause hits first.",
      wrongOut:"That link could happen, but it isn’t the main path. Try the outcome this path leads to most directly.",   // module-written
      pickCause:"Tap a cause first.",   // module-written
      pickComp:"Tap one of this cause’s linked components first, then an outcome.",   // module-written
      compOk:"Linked: {c} → {k}.{n} Now tap an outcome.",   // module-written
      outOk:"Path built: {c} → {k} → {o}.",   // module-written
      done:"Every cause has at least one path. Your map shows hunger as a system with linked causes, not one simple cause."   // module-written
    },
    // Check it with data (model scenarios, plan). path: the map path each scenario tests (module-written).
    data:{
      scenarios:[
        { id:"x", t:"Region X", text:"A normal harvest, but world prices doubled.", measure:"Model hunger rate", from:9, to:13, quote:"Food was available; access fell.", path:{ cause:"spike", comp:["access"], out:"hunger" } },
        { id:"y", t:"Region Y", text:"Conflict closed the main market road for 6 months.", measure:"Model wasting", from:6, to:12, quote:"Both availability and accessibility fell.", path:{ cause:"conflict", comp:["avail", "access"], out:"wasting" } },
        { id:"z", t:"Household Z", text:"Enough calories from cheap staples and sweetened drinks, little variety. A child is stunted and a parent lives with obesity.", quote:"A double burden in one household.", path:{ cause:"healthy", comp:["adequ"], out:"over" } }
      ]
    },
    quickCheck:{
      title:"Quick check", summary:"Why hunger persists quick check",
      // Correct-choice lines are module-written ("Right." + the plan's feedback line).
      items:[
        { id:"q1", goal:4, prompt:"World harvests are normal, but local food prices double. Which component falls first?",
          choices:[{ t:"Accessibility", ok:true, fb:"Right. The food exists; people can’t afford it." },
            { t:"Availability", fb:"The food exists; people can’t afford it." },
            { t:"Acceptability", fb:"The food exists; people can’t afford it." },
            { t:"Sustainability", fb:"The food exists; people can’t afford it." }] },
        { id:"q2", goal:4, prompt:"Unsafe water most directly harms…",
          choices:[{ t:"Adequacy (children absorb fewer nutrients when sick)", ok:true, fb:"Right. Diarrheal illness stops the body absorbing nutrients." },
            { t:"Availability", fb:"Diarrheal illness stops the body absorbing nutrients." },
            { t:"Acceptability", fb:"Diarrheal illness stops the body absorbing nutrients." },
            { t:"Sustainability", fb:"Diarrheal illness stops the body absorbing nutrients." }] },
        { id:"q3", goal:4, prompt:"Which statement fits the data?",
          choices:[{ t:"Hunger rises when access falls, even with enough food in the world", ok:true, fb:"Right. Price shocks and conflict raise hunger without any world shortage." },
            { t:"Hunger only rises when world harvests fail", fb:"Price shocks and conflict raise hunger without any world shortage." },
            { t:"Hunger is caused by overpopulation alone", fb:"Price shocks and conflict raise hunger without any world shortage." },
            { t:"Hunger can’t change quickly", fb:"Price shocks and conflict raise hunger without any world shortage." }] },
        { id:"q4", goal:5, prompt:"Cheap staples, little variety: a stunted child and a parent living with obesity. This is…",
          choices:[{ t:"The double burden", ok:true, fb:"Right. Both forms can exist in one household." },
            { t:"Only undernutrition", fb:"Both forms can exist in one household." },
            { t:"Only overnutrition", fb:"Both forms can exist in one household." },
            { t:"Food insecurity can’t cause both", fb:"Both forms can exist in one household." }] }
      ]
    }
  },
  practice:{
    activities:[
      // Correct-placement lines (why) are module-written from the plan's mistake feedback.
      { id:"forms", type:"sorter", title:"Which form of malnutrition?", summary:"Which form of malnutrition?", goal:[1, 2, 5], noun:"description", txt:true,
        instruction:"Sort each description into the form of malnutrition it shows.",   // module-written
        boxes:[{ id:"stunting", label:"Stunting" }, { id:"wasting", label:"Wasting" }, { id:"hidden", label:"Hidden hunger" }, { id:"over", label:"Overweight" }],
        wrongDefault:"Ask: too short, too thin, missing a nutrient, or above a healthy weight? Try another box.",
        items:[
          { id:"i1", goal:1, t:"A 4-year-old is much shorter than expected for her age after years of poor diet and frequent illness.", answer:"stunting",
            why:"Short for age and built up over years: stunting.", wrong:{ wasting:"Short for age and built up over years: that’s stunting." } },
          { id:"i2", goal:1, t:"After a flood cut off food for six weeks, a toddler became very thin for his height.", answer:"wasting",
            why:"Thin for height after a recent crisis: wasting.", wrong:{ stunting:"Thin for height after a recent crisis: that’s wasting." } },
          { id:"i3", goal:[1, 2], t:"A teen eats enough calories but is tired and pale; a blood test shows low iron.", answer:"hidden",
            why:"Enough calories, missing a mineral: hidden hunger.", wrong:{ wasting:"Enough calories, missing a mineral: hidden hunger." } },
          { id:"i4", goal:[1, 5], t:"A child’s weight is well above the healthy range for his height, mostly from sweetened drinks and fried snacks.", answer:"over",
            why:"Weight above the healthy range for height: overweight." },
          { id:"i5", goal:[1, 2], t:"A community’s diet lacks iodine; many adults develop goitre.", answer:"hidden",
            why:"Missing iodine causes goitre: hidden hunger." },
          { id:"i6", goal:1, t:"Children in a region have low height-for-age, measured at age 5.", answer:"stunting",
            why:"Low height-for-age is stunting." },
          { id:"i7", goal:[1, 2], t:"A child has severe weight loss and very little body fat (marasmus).", answer:"wasting",
            why:"Marasmus is the most severe form of wasting: severe thinness for height.",
            hints:["Marasmus is the most severe form of which?", "Severe thinness for height.", "Wasting."] },
          { id:"i8", goal:[1, 2], t:"Children in a village can’t see well at dusk; their diet has almost no vitamin A.", answer:"hidden",
            why:"Missing vitamin A causes night blindness: hidden hunger." }
        ] },
      // Data detective: custom ★ set (number entry, chips, pick two, ranking). Correct lines (why) for D1, D2, D3 and D5 are
      // module-written from the plan's answers; wrongDefault lines are module-written.
      { id:"detective", type:"custom", title:"Data detective", summary:"Data detective", star:true, goal:[3, 4, 6],
        instruction:"Six data questions. The ★ items are non-routine; D5 and D6 go beyond the Final Check.",   // module-written
        how:"Type a number and press Check, or tap your choices. Units like % are optional.",   // module-written
        items:[
          { id:"d1", goal:3, prompt:"Model: 6% of 650 million people in Latin America &amp; the Caribbean face hunger. How many million?",
            nums:[{ id:"n", label:"People facing hunger", unit:"million", answer:39 }],
            wrong:[{ match:6.5, fb:"That’s 1% of 650 million. Multiply by 6." }], wrongDefault:"Number of people = rate × population.",
            why:"6% of 650 million = 39 million." },
          { id:"d2", goal:3, prompt:"Model: Africa has 300 million people facing hunger out of 1500 million. What rate is that?",
            nums:[{ id:"n", label:"Hunger rate", unit:"%", answer:20 }],
            wrong:[{ match:5, fb:"You divided 1500 by 300. Divide the part by the whole: 300 ÷ 1500." }], wrongDefault:"Divide the part by the whole, then write it as a percentage.",
            why:"300 ÷ 1500 = 0.2, so the rate is 20%." },
          { id:"d3", goal:3, star:true, prompt:"Model: in the next decade Asia’s rate falls to 6% while its population grows to 5000 million. Compared with Africa’s current 300 million, is the <em>number</em> facing hunger in Asia lower, exactly equal, or still higher?",
            groups:[{ id:"g", label:"Asia’s number is…", choices:[
              { t:"Lower", fb:"The rate fell, but the population grew: 6% of 5000 million = 300 million." },
              { t:"Exactly equal", ok:true },
              { t:"Still higher", fb:"Compute it: 6% × 5000 million = 300 million, the same as Africa’s." }] }],
            why:"6% of 5000 million = 300 million: exactly equal to Africa’s 300 million.",
            hints:["Multiply the new rate by the new population.", "6% of 5000 million.", "300 million: exactly equal."] },
          { id:"d4", goal:6, star:true, prompt:"Which two profiles both have stunting at ‘high’ or above, yet need different responses?",
            table:true,
            pick:{ n:2, label:"Choose two profiles", options:[{ id:"A", t:"Profile A" }, { id:"B", t:"Profile B" }, { id:"C", t:"Profile C" }, { id:"D", t:"Profile D" }], answer:["A", "B"],
              fb:{ C:"C’s stunting is 6%, low.", D:"D’s stunting is 14%, medium, not high." } },
            why:"A and B. A also has high wasting after drought (urgent treatment, income and water support); B has a double burden from cheap processed foods (better diet quality)." },
          { id:"d5", goal:3, star:true, prompt:"A model region’s hunger rate falls from 10% to 8% while its population rises from 400 to 500 million. Did the number of people facing hunger rise, fall or stay the same? By how much?",
            groups:[{ id:"g", label:"The number of people facing hunger…", choices:[
              { t:"Rose", fb:"Compute both: 10% of 400 = 40; 8% of 500 = 40." },
              { t:"Fell", fb:"Compute both: 10% of 400 = 40; 8% of 500 = 40." },   // module-written (the plan's "Rise" line)
              { t:"Stayed the same", ok:true }] }],
            nums:[{ id:"b", label:"Before", unit:"million", answer:40 }, { id:"a", label:"After", unit:"million", answer:40 }],
            numFb:"Compute both: 10% of 400 = 40; 8% of 500 = 40.",
            why:"Stayed the same: 40 million → 40 million.",
            hints:["Find the number of people both times.", "10% of 400 million, then 8% of 500 million.", "40 million both times: the same."] },
          { id:"d6", goal:3, star:true, inquiry:true, prompt:"You need the most reliable recent global hunger figure for a report. Rank these sources from most to least reliable.",
            steps:["(a) the FAO-led <i>State of Food Security and Nutrition in the World</i> report", "(d) a news article that cites the FAO report and links to it", "(c) a food company’s ad quoting ‘studies’", "(b) a viral post with a dramatic number and no source"],
            start:[0, 3, 2, 1],
            fb:"A news article that cites the report is useful, but the original report is the primary source. An ad has a commercial purpose, and an unsourced post can’t be checked.",
            why:"a, d, c, b. The original report is the primary source; a news article that cites it is next. An ad has a commercial purpose, and an unsourced post can’t be checked." }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Vasco", goal:[2, 3, 4], how:"",
        instruction:"Vasco made one mistake in each answer. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Which model region has the most people facing hunger?",
            steps:["“Africa’s hunger rate is 20%, the highest of the regions.”", "“Asia’s hunger rate is 8%.”", "“Since 20% is bigger than 8%, Africa has the most people facing hunger.”", "“So Africa has more than 384 million people facing hunger.”"],
            answer:2, stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"“Compare counts: 20% × 1500 million = 300 million and 8% × 4800 million = 384 million, so Asia has the most.”", ok:true, why:M2 },
              { t:"“Compare populations only: Asia is bigger, so Asia.”", why:"Population alone isn’t enough; you need rate × population." },
              { t:"“Add the rates: 28%.”", why:"Rates for different populations can’t be added." },
              { t:"Step 3 is correct.", why:"A higher rate doesn’t mean more people when the populations differ." }],
            hints:["Is a percentage a number of people?", "Multiply each rate by its population.", "300 million vs 384 million."] },
          { id:"e2", goal:2, task:"Describe a child with kwashiorkor.",
            steps:["“Kwashiorkor is a form of severe malnutrition in young children.”", "“It’s classically linked to diets low in protein after a child stops breastfeeding, though its causes are complex.”", "“The child’s swollen belly shows they’ve been getting plenty of food.”", "“So the child doesn’t need urgent care.”"],
            answer:2, stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3. Find the first mistake."],
            fixes:[
              { t:"“The swelling is edema, fluid under the skin, a warning sign of severe malnutrition; the child needs urgent medical care.”", ok:true, why:M5 },
              { t:"“The swelling comes from eating too much protein.”", why:"Kwashiorkor is linked to too little, not too much." },
              { t:"“The swelling shows marasmus.”", why:"Marasmus is severe thinness without edema." },
              { t:"Step 3 is correct.", why:"Swelling isn’t a sign of being well fed." }],
            hints:["What causes swelling in kwashiorkor?", "Fluid: edema.", "It signals severe malnutrition."] },
          { id:"e3", goal:4, task:"Explain why hunger rose in a model region with a normal harvest.",
            steps:["“The region’s harvest was normal this year.”", "“World food prices doubled, so food in local markets cost much more.”", "“Hunger can’t rise when there’s enough food, so the data must be wrong.”", "“We should ignore this region’s data.”"],
            answer:2, stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"“Hunger can rise when access falls: low-income families couldn’t afford food at double the price.”", ok:true, why:M1 },
              { t:"“Hunger rose because the region grew too little.”", why:"The harvest was normal." },
              { t:"“Hunger rose because people moved away.”", why:"Nothing in the data says that." },
              { t:"Step 3 is correct.", why:"Enough food in markets doesn’t mean everyone can afford it." }],
            hints:["Which component did the price rise affect?", "Accessibility.", "Families couldn’t afford food: hunger rose."] }
        ] }
    ]
  },
  reflect:{
    blocks:[{ html:SUPPORT }],
    journal:[
      { id:"j1", q:"What surprised you most on the world hunger map: the gap between rates and counts, or the double burden?" },
      { id:"j2", q:"In your own words, why can a world that grows enough food still have hunger?" },
      { id:"j3", q:"Explain to a friend the difference between stunting, wasting and hidden hunger, with one example of each." },
      { id:"j4", q:"What’s one question about global hunger you’d like to research? Which kind of source would you trust to answer it, and why?" }
    ]
  },
  final:{
    intro:"This shows what you’ve learned, so there are no hints here. Answer all 10 questions and say how sure you are. Then submit to see your results. Each question is labelled with its achievement chart category. Data in questions is model data unless a source is named.",
    // Options without feedback in the plan reuse the correct option's line (T1 B) or the M3 sentence (C2 B).
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Stunting describes a child who is…", options:[
          { t:"too short for their age, from long-term undernutrition", ok:true, why:"Stunting builds up over years." },
          { t:"too thin for their height, from a recent severe shortage", why:"That’s wasting." },
          { t:"above a healthy weight for their height", why:"That’s overweight." },
          { t:"missing a vitamin or mineral despite enough calories", why:"That’s hidden hunger." }] },
        b:{ prompt:"Wasting describes a child who is…", options:[
          { t:"too thin for their height, usually from a recent severe shortage of food or illness", ok:true, why:"Wasting can develop in weeks." },
          { t:"too short for their age, from long-term undernutrition", why:"That’s stunting." },
          { t:"above a healthy weight for their height", why:"That’s overweight." },
          { t:"missing iodine", why:"That’s hidden hunger (goitre)." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which sign points to <strong>kwashiorkor</strong> rather than marasmus?", options:[
          { t:"swelling (edema) in the feet, legs or belly", ok:true, why:"Edema is the hallmark of kwashiorkor." },
          { t:"extreme thinness with very little body fat", why:"That’s marasmus." },
          { t:"bleeding gums", why:"That’s scurvy (vitamin C)." },
          { t:"an enlarged thyroid", why:"That’s goitre (iodine)." }] },
        b:{ prompt:"<strong>Marasmus</strong> is best described as…", options:[
          { t:"severe wasting from a long-term lack of energy and nutrients", ok:true, why:"The body uses up its fat and muscle." },
          { t:"swelling from fluid with a round belly", why:"That’s kwashiorkor." },
          { t:"a vitamin C deficiency", why:"That’s scurvy." },
          { t:"overweight together with anemia", why:"That’s a double burden pattern, not marasmus." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"A conflict closes the roads to a region’s markets for months. Which component of food security is hit most directly?", options:[
          { t:"accessibility", ok:true, why:"People can’t reach food or afford its rising price." },
          { t:"acceptability", why:"Nothing changes about cultural fit." },
          { t:"sustainability", why:"The immediate problem is getting food." },
          { t:"adequacy only", why:"Adequacy may fall later; access falls first." }] },
        b:{ prompt:"A flood destroys a region’s crops in the fields. Which component is hit first?", options:[
          { t:"availability", ok:true, why:"There’s less food in the region." },
          { t:"acceptability", why:"The food’s cultural fit isn’t the issue." },
          { t:"adequacy only", why:"The first loss is the food itself." },
          { t:"none, because world harvests are fine", why:"Local supply still falls." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Model data. Region R: 200 million people, 15% facing hunger. Region S: 900 million, 5%. Which statement is correct?", options:[
          { t:"S has more people facing hunger (45 million vs 30 million), even though R’s rate is three times higher", ok:true, why:"Rate × population." },
          { t:"R has more people facing hunger because 15% > 5%", why:"Compute the counts: 30 vs 45 million." },
          { t:"They have the same number of people facing hunger", why:"30 million ≠ 45 million." },
          { t:"They can’t be compared without more data", why:"You have both rates and populations." }] },
        b:{ prompt:"Model data. Region U: 300 million people, 12%. Region V: 1200 million, 4%. Which statement is correct?", options:[
          { t:"V has more people facing hunger (48 million vs 36 million), even though U’s rate is three times higher", ok:true, why:"Rate × population." },
          { t:"U has more people facing hunger because 12% > 4%", why:"36 vs 48 million." },
          { t:"They have the same number", why:"36 ≠ 48." },
          { t:"They can’t be compared", why:"Multiply rate by population." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"A model country has 24% child stunting and 13% child overweight. Using the module’s rule, what does this show?", options:[
          { t:"a double burden: high undernutrition and high overweight at the same time", ok:true, why:"24 ≥ 20 and 13 ≥ 10." },
          { t:"only undernutrition, because stunting is the bigger number", why:"Overweight is also above its line." },
          { t:"only overnutrition, because overweight is high", why:"Stunting is high too." },
          { t:"an impossible result", why:"Both forms often exist together." }] },
        b:{ prompt:"In one household, the children are short for their age and a parent lives with obesity. This is an example of…", options:[
          { t:"the double burden of malnutrition within one household", ok:true, why:"Cheap, energy-dense foods can cause both." },
          { t:"undernutrition only", why:"The parent’s obesity is also a form of malnutrition." },
          { t:"overnutrition only", why:"The children’s stunting is undernutrition." },
          { t:"a situation that can’t happen", why:"It’s common worldwide." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"World grain prices double while local harvests are normal. Who is most likely to face more hunger?", options:[
          { t:"low-income households that spend a large share of their income on food", ok:true, why:"Their money buys much less food." },
          { t:"grain farmers who sell their harvest", why:"Higher prices may help them." },
          { t:"high-income households", why:"Food is a small share of their spending." },
          { t:"no one, because harvests are normal", why:"Access falls even when food is available." }] },
        b:{ prompt:"A region’s harvest is normal, but conflict blocks roads for months. What is the most likely result?", options:[
          { t:"rising hunger, as food can’t reach markets and prices rise", ok:true, why:"Availability and access both fall." },
          { t:"no change, because the food was grown", why:"Food that can’t be reached can’t be eaten." },
          { t:"falling prices", why:"Blocked supply pushes prices up." },
          { t:"hunger only among farm families", why:"City households lose access too." }] } },
      { id:"c1", cat:"C", goal:[1, 3],
        a:{ prompt:"Which sentence best explains why the world can grow enough food and still have hunger?", options:[
          { t:"“Hunger is mostly about access: people may be unable to afford or reach food, especially during conflict, disasters and price shocks.”", ok:true, why:M1 },
          { t:"“There simply isn’t enough food in the world.”", why:"Global production is enough overall." },
          { t:"“People in some regions don’t work hard enough.”", why:"Hunger comes from systems and shocks, not anyone’s effort." },
          { t:"“Hunger is caused by overpopulation alone.”", why:"Hunger has several linked causes." }] },
        b:{ prompt:"Which caption best describes a map shaded by hunger <em>rate</em>?", options:[
          { t:"“Darker regions have a larger share of their population facing hunger; the number of people also depends on population size.”", ok:true, why:M2 },
          { t:"“Darker regions have the most people facing hunger.”", why:"Shading shows share, not number." },
          { t:"“Darker regions grow less food.”", why:"The map shows hunger, not production." },
          { t:"“Darker regions have the highest overweight rates.”", why:"This map shows hunger." }] } },
      { id:"c2", cat:"C", goal:[2, 5],
        a:{ prompt:"Which phrase most accurately describes a person who eats enough calories but has iron-deficiency anemia?", options:[
          { t:"“They are experiencing hidden hunger: enough energy, but not enough of a key mineral.”", ok:true, why:"Iron is a key mineral; missing it despite enough calories is hidden hunger." },   // module-written why
          { t:"“They are experiencing wasting.”", why:"Wasting is about being too thin for height." },
          { t:"“They are well nourished because they eat enough.”", why:"Enough calories isn’t the same as enough nutrients." },
          { t:"“They have marasmus.”", why:"Marasmus is severe wasting." }] },
        b:{ prompt:"Which phrase most accurately describes children in a region whose diet has almost no vitamin A?", options:[
          { t:"“They face hidden hunger and are at risk of night blindness and weaker immunity.”", ok:true, why:"Vitamin A deficiency is a form of hidden hunger." },   // module-written why
          { t:"“They are stunted because of vitamin A alone.”", why:"Stunting has many causes." },
          { t:"“They are well fed if they get enough calories.”", why:M3 },
          { t:"“They have kwashiorkor.”", why:"That’s severe malnutrition with edema." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Profile A: stunting 32%, wasting 11%, anemia 42%, after two drought years with low household incomes. Which pair of responses fits best?", options:[
          { t:"treatment of severe acute malnutrition with ready-to-use therapeutic food, plus cash transfers to low-income households", ok:true, why:"One treats urgent wasting; the other tackles income, a root cause." },
          { t:"a tax on sugary drinks plus gym programs", why:"Overweight is low here; these miss the main problems." },
          { t:"shipping cheap grain to sell in local markets", why:"That can undercut local farmers and doesn’t target the youngest children." },
          { t:"doing nothing until the next harvest", why:"Wasting is urgent." }] },
        b:{ prompt:"Profile B has a double burden (stunting 22%, overweight 12%). Which response addresses both problems?", options:[
          { t:"making nutrient-dense foods more affordable while supporting infant and young-child feeding", ok:true, why:"It improves diet quality for both." },
          { t:"only high-calorie food aid", why:"That could worsen overweight." },
          { t:"only weight-loss campaigns", why:"They ignore stunting." },
          { t:"no action, because the two problems cancel out", why:"They don’t cancel; both harm health." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"In Nunavut, store food is very expensive and a shorter sea-ice season makes hunting harder. Which components of food security are most affected?", options:[
          { t:"accessibility (cost) and availability (harvesting country foods)", ok:true, why:"Both getting and finding food are harder." },
          { t:"acceptability only", why:"Country foods remain culturally central." },
          { t:"sustainability only, because it’s about the environment", why:"Cost and access are immediate." },
          { t:"none, because stores are open", why:"An open store doesn’t mean affordable food." }] },
        b:{ prompt:"A Prairie drought pushes world wheat prices up. Which group abroad is most affected?", options:[
          { t:"low-income households in countries that import much of their wheat", ok:true, why:"Higher prices cut what they can afford." },
          { t:"farmers in countries that export wheat", why:"They may earn more." },
          { t:"high-income households everywhere", why:"Food is a small share of their spending." },
          { t:"no one, because the world has other wheat", why:"Prices rise for everyone who buys it." }] } }
    ]
  },
  task:{
    title:"Design a nutrition response", summary:"Design a nutrition response",
    statement:"<p>Profile A needs a response. Choose exactly three interventions that together meet every condition. Can you find all the answers?</p>" +
      "<p><strong>Profile A</strong> <span class=\"hfa-model\">Model data</span>: stunting 32% (very high), wasting 11% (high), overweight 3% (low), anemia in women 42% (severe). Stresses: two drought years and low household incomes. Local farmers sell grain in local markets.</p>",
    profile:"A",
    interventions:[
      { id:"a", t:"Ready-to-use therapeutic food for children with severe acute malnutrition" },
      { id:"b", t:"Iron-fortified flour through local mills" },
      { id:"c", t:"Cash transfers to low-income households" },
      { id:"d", t:"Drought-tolerant seed and small-scale irrigation support" },
      { id:"e", t:"Breastfeeding and infant-feeding counselling in the first 1000 days" },
      { id:"f", t:"School meals made with local foods" },
      { id:"g", t:"Shipping surplus grain from abroad to sell cheaply in local markets" },
      { id:"h", t:"A tax on sugar-sweetened drinks" }
    ],
    checks:["Reaches children under 5", "Tackles a root cause (drought or low income)", "Fights hidden hunger", "Protects local farmers’ markets", "Exactly three interventions"],
    tips:["Under-5 problems here are wasting and stunting. Which choices reach young children directly?", "The stresses are drought and low incomes. Which choices address those?", "Anemia is 42%. Which choice adds iron?", "Cheap imported grain sold in local markets can push local farmers’ prices down.", "Three only: a budget limit."],
    explainPrompt:"Explain how your three interventions work together, and why you didn’t choose (g) or (h).",
    vocab:"Use the words wasting, stunting, hidden hunger, root cause and accessibility.",
    checkLabel:"Check my response",   // module-written
    success:"This response meets every condition.",   // module-written
    more:"There’s more than one answer. Can you find all four?",   // module-written (the plan: exactly 4 valid answers)
    afterAt:4,
    after3:"Every answer combines one direct-to-children action, one root-cause action and iron. Real responses do the same: treat, prevent and fix causes together.",
    validMsg:"Tap interventions to choose them. You need exactly three."   // module-written
  },
  cards:[
    ["Hunger (undernourishment)", "Not getting enough dietary energy over time."],
    ["Malnutrition", "Any unhealthy imbalance: undernutrition, micronutrient deficiencies or overweight."],
    ["Stunting", "Too short for age; long-term undernutrition (e.g. a 4-year-old far below expected height)."],
    ["Wasting", "Too thin for height; a recent severe shortage or illness; can develop in weeks."],
    ["Hidden hunger", "Missing vitamins or minerals (iron, iodine, vitamin A) despite enough calories."],
    ["Double burden", "Undernutrition and overweight in the same country, household or person."],
    ["Marasmus", "Severe wasting from a long-term lack of energy and nutrients."],
    ["Kwashiorkor", "Severe malnutrition with edema (swelling); causes are complex."],
    ["Rate vs count", "Count = rate × population. The highest rate isn’t always the most people."],
    ["Five components", "Availability, accessibility, adequacy, acceptability, sustainability."],
    ["Root causes of hunger", "Conflict, climate shocks, economic shocks, poverty and inequality, the cost of healthy diets."],
    ["Enough food, still hunger", "The world grows enough overall; hunger is mostly about access."]
  ]
};
