// SBI4U 46 Human Population Growth. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/46-human-population-growth.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "Birth rates stayed about the same at first. It was falling death rates that opened the gap.";
const M2 = "A young population has many future parents. Births stay high for decades: population momentum.";
const M3 = "Rates per 1000 ÷ 10 = %. Add net migration to (births − deaths).";
const M4 = "Use the percentage: 2% gives 70 ÷ 2 = 35 years, not 70 ÷ 0.02.";
const M5 = "A smaller percentage of a larger population can still be a big yearly increase. The population shrinks only when the rate is negative.";
const M6 = "About 90% of the crop’s energy is lost at the livestock step, so the same hectare feeds about a tenth as many people.";
const M7 = "A footprint counts the land and water needed for your food, goods, energy and housing, not just carbon from driving.";
const NB = " ";   // narrow no-break space for thousands (20 000)
const K = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NB);

// Model age pyramids for the matching activity (17 five-year bands, 0–4 … 80+; half-widths, males left, females right).
// Drawn as SVG in the tile; app.css styles .hp-pb (bars, --ink-2).
const PY = {
  s2:[100, 84, 71, 59, 50, 42, 35, 30, 25, 21, 18, 15, 12, 10, 8, 6, 5],
  s3:[88, 94, 96, 92, 86, 79, 71, 63, 55, 47, 40, 33, 26, 19, 13, 8, 6],
  s4:[70, 71, 72, 72, 73, 73, 72, 72, 71, 70, 68, 65, 60, 52, 42, 30, 24],
  s5:[50, 53, 57, 61, 65, 69, 72, 75, 76, 76, 74, 71, 66, 57, 46, 33, 30],
  boom:[58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 69, 72, 92, 90, 86, 34, 22],
  notchL:[80, 80, 79, 78, 40, 36, 44, 74, 72, 70, 67, 62, 55, 46, 35, 23, 16],
  notchR:[78, 78, 77, 77, 64, 60, 66, 73, 72, 70, 68, 64, 58, 50, 40, 28, 21]
};
function pyr(L, R, aria){
  const W = 120, H = 110, cx = 60, bh = 6, top = 4, n = L.length;
  let h = "";
  for (let i = 0; i < n; i++) {
    const y = top + (n - 1 - i) * bh, l = L[i] / 100 * 52, r = (R || L)[i] / 100 * 52;
    h += `<rect class="hp-pb" x="${(cx - 1 - l).toFixed(1)}" y="${y}" width="${l.toFixed(1)}" height="${bh - 1}"/><rect class="hp-pb" x="${cx + 1}" y="${y}" width="${r.toFixed(1)}" height="${bh - 1}"/>`;
  }
  h += `<line class="hp-pax" x1="${cx}" y1="${top}" x2="${cx}" y2="${top + n * bh}"/>`;
  return `<span class="hp-mpyr"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${aria}" focusable="false">${h}</svg></span>`;
}
const tile = (L, R, cap) => pyr(L, R, "Age pyramid: " + cap) + `<span class="hp-mcap">${cap}</span>`;

export default {
  id:"46-human-population-growth",
  kind:"topic",
  title:"Human population growth",
  topic:"Human Population Growth",
  readyTopic:"human population growth",
  hero:{
    eq:'<span class="hp-heq"><span class="hp-heq1">growth rate (%) = (birth rate − death rate + net migration rate) ÷ 10</span><span class="hp-heq1">doubling time ≈ 70 ÷ growth rate (%)</span><span class="hp-heq3">each rate per 1000 people per year</span></span>',
    eqLabel:"growth rate in percent equals birth rate minus death rate plus net migration rate, all divided by 10, where each rate is per 1000 people per year; doubling time is about 70 divided by the growth rate in percent",
    eqSize:"sm",
    headline:"From 1 billion to 8 billion in about two centuries",
    text:"For thousands of years, births barely outpaced deaths. Then <strong>death rates fell</strong>, and the human population shot upward in a <strong>J-curve</strong>. You’ll follow countries through the <strong>demographic transition</strong>, read their <strong>age pyramids</strong>, and then ask the big question: how many people can the land feed, and how?",
    fig:{ html:'<div class="hp-hero" id="hp-hero" role="img" aria-label="A timeline from 1700 to 2025 draws the world population curve: almost flat, then rising steeply in a J-curve. Milestone dots mark 1 billion around 1800, 2 billion around 1927, 4 billion around 1974 and 8 billion in 2022. The gaps between billions shrink from more than a century to about 12 years."></div>' }
  },
  goals:[
    "I can describe how the human population has grown and explain why growth sped up after 1800.",
    "I can explain the stages of the demographic transition using birth and death rates.",
    "I can read age pyramids and use them, including population momentum, to predict future growth.",
    "I can calculate growth rates from birth, death and migration rates, and doubling times with the rule of 70.",
    "I can explain ecological footprints and use the 10% energy rule to compare how many people a hectare can feed.",
    "I can weigh the benefits and risks of a Canadian food technology using evidence."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Rates per 1000", goal:4,
          prompt:`A town of 20${NB}000 people has 300 births in a year. What is its birth rate per 1000 people?`,
          options:[
            { t:"15 per 1000", ok:true, why:"300 ÷ 20 = 15 births for each 1000 people." },
            { t:"300 per 1000", why:"Divide by the number of thousands." },
            { t:"1.5 per 1000", why:`20${NB}000 is 20 thousands.` },
            { t:"66.7 per 1000", why:`That’s 20${NB}000 ÷ 300.` }],
          hints:[`How many groups of 1000 are in 20${NB}000?`, "20.", "300 ÷ 20 = 15."] },
        { id:"w2", skill:"Rates per 1000", goal:4,
          prompt:"Convert a growth rate of 12 per 1000 to a percentage.",
          options:[
            { t:"1.2%", ok:true, why:"Per 1000 ÷ 10 = per 100." },
            { t:"12%", why:"12 per 1000 is 1.2 per 100." },
            { t:"0.12%", why:"Divide by 10." },
            { t:"120%", why:"A percentage is per 100." }],
          hints:["Percent means per 100.", "12 per 1000 = 1.2 per 100.", "1.2%."] },
        { id:"w3", skill:"Exponential growth", goal:4,
          prompt:"From module 43: a population grows 7% per year. About how long does it take to double?",
          options:[
            { t:"About 10 years", ok:true, why:"70 ÷ 7." },
            { t:"About 1000 years", why:"Use 7, not 0.07." },
            { t:"About 490 years", why:"Divide 70 by the rate." },
            { t:"About 14 years", why:"That’s for 5%." }],
          hints:["Rule of 70.", "70 ÷ 7.", "10 years."] },
        { id:"w4", skill:"Exponential growth", goal:1,
          prompt:"A population doubles every 25 years. Starting at 1 million, how big is it after 75 years?",
          options:[
            { t:"8 million", ok:true, why:"Three doublings: 2, 4, 8." },
            { t:"3 million", why:"Doubling multiplies." },
            { t:"6 million", why:"1 × 2 × 3? Each doubling multiplies by 2." },
            { t:"75 million", why:"That’s 1 million per year." }],
          hints:["How many doublings in 75 years?", "Three.", "1 → 2 → 4 → 8."] },
        { id:"w5", skill:"Energy in food chains", goal:5,
          prompt:"From module 18: about what fraction of the energy at one trophic level passes to the next?",
          options:[
            { t:"About 10%", ok:true, why:"Most is lost as heat or isn’t eaten." },
            { t:"About 90%", why:"90% is lost." },
            { t:"100%", why:"Energy is lost at every step." },
            { t:"About 50%", why:"Far less than half passes on." }],
          hints:["Think of an energy pyramid’s shape.", "Each level is much narrower.", "About 10%."] },
        { id:"w6", skill:"Energy in food chains", goal:5,
          prompt:`Grass stores 10${NB}000 kJ. About how much of it ends up in a cow that eats the grass, and then in a person who eats the cow?`,
          options:[
            { t:"Cow 1000 kJ; person 100 kJ", ok:true, why:"10% at each step." },
            { t:"Cow 9000 kJ; person 8100 kJ", why:"Only about 10% is kept, not lost." },
            { t:"Cow 1000 kJ; person 1000 kJ", why:"Energy is lost at the second step too." },
            { t:`Cow 10${NB}000 kJ; person 1000 kJ`, why:"Loss happens at every step." }],
          hints:["About 10% passes each step.", `10% of 10${NB}000 = 1000.`, "10% of 1000 = 100."] }
      ],
      refreshers:{
        "Rates per 1000":"Rate per 1000 = count ÷ (population ÷ 1000). To convert to a percentage, divide the rate per 1000 by 10.",
        "Exponential growth":"Growth at a steady percentage doubles in about 70 ÷ (rate in %) years. Each doubling multiplies by 2, so three doublings multiply by 8.",
        "Energy in food chains":"About 10% of the energy at one level reaches the next. Each extra link loses about 90% of what’s left."
      }
    }
  },
  explore:{
    heading:"Demographic transition explorer",
    intro:"Move through time and watch birth rates, death rates and the age pyramid change together. Then run projections with the rule of 70.",
    // Transition model table (plan): rates per 1000 per year; model values. The single source for TC1 and TC2.
    table:[
      [0, 40, 38, 1], [10, 40, 36, 1], [20, 40, 33, 2], [30, 40, 30, 2], [40, 40, 26, 2], [50, 39, 22, 2], [60, 38, 18, 2],
      [70, 35, 16, 3], [80, 32, 14, 3], [90, 28, 12, 3], [100, 24, 11, 3], [110, 20, 10, 3], [120, 17, 10, 3], [130, 14, 10, 3],
      [140, 12, 10, 4], [150, 11, 10, 4], [160, 10, 10, 4], [170, 9, 10, 5], [180, 9, 11, 5]],
    stages:["", "high birth and death rates", "death rate falling, birth rate high", "birth rate falling", "both rates low", "births below deaths"],
    // VERIFY: world population milestones and the UN-style projection (UN World Population Prospects) before release.
    world:{
      pts:[[1700, 0.60], [1750, 0.79], [1804, 1.0], [1850, 1.26], [1900, 1.65], [1927, 2.0], [1950, 2.5], [1960, 3.0], [1974, 4.0], [1987, 5.0], [1999, 6.0], [2011, 7.0], [2022, 8.0], [2025, 8.2]],
      proj:[[2025, 8.2, 8.2, 8.2], [2030, 8.5, 8.4, 8.6], [2040, 9.1, 8.9, 9.3], [2050, 9.7, 9.4, 10.0], [2060, 10.0, 9.5, 10.5], [2070, 10.2, 9.6, 10.9], [2080, 10.3, 9.5, 11.4], [2090, 10.3, 9.2, 11.9], [2100, 10.2, 8.9, 12.4]],
      miles:[[1, 1804], [2, 1927], [3, 1960], [4, 1974], [5, 1987], [6, 1999], [7, 2011], [8, 2022]]
    },
    modelNote:"Transition rates, pyramid shapes and the momentum run are model values. World figures are rounded estimates; beyond 2025 the dashed curve is a UN-style projection with its likely range shaded.",
    predictions:[
      { id:"p1", prompt:"As a country begins to modernize, which changes first?",
        options:[
          { t:"The death rate falls", ok:true },
          { t:"The birth rate rises" },
          { t:"The birth rate falls" },
          { t:"Both stay the same" }],
        explain:"Clean water, food and medicine save lives quickly; family sizes change more slowly.",
        start:{ mode:"trans", year:0 }, act:"p1" },
      { id:"p2", prompt:"When is the population growing fastest?",
        options:[
          { t:"At the end of stage 2, when the gap between the curves is widest", ok:true },
          { t:"In stage 1" },
          { t:"In stage 4" },
          { t:"When the birth rate is highest" }],
        explain:"Growth depends on the gap, not on either rate alone.",
        start:{ mode:"trans", year:0 }, act:"p2" },
      { id:"p3", prompt:"Will the population stop growing right away?",
        options:[
          { t:"No, it keeps growing for decades", ok:true },
          { t:"Yes, immediately" },
          { t:"It starts shrinking immediately" },
          { t:"It grows faster than ever" }],
        explain:"Today’s many children become tomorrow’s many parents. That’s population momentum.",
        start:{ mode:"trans", year:120, fert:true }, act:"p3" },
      { id:"p4", prompt:"Which pyramid belongs to the fastest-growing population?",
        options:[
          { t:"Wide base, narrow top", ok:true },
          { t:"Straight sides" },
          { t:"Narrow base" },
          { t:"All grow equally" }],
        explain:"A wide base means many young people: high births now and many parents later.",
        start:{ mode:"trans", year:0, trio:true }, act:"p4" }
    ],
    challenges:[
      { id:"tc1", goal:[2, 4], prompt:"<strong>Transition:</strong> set the slider to the year of fastest natural increase.",
        why:"Year 60: 38 − 18 = 20 per 1000 = 2.0%, the widest gap.",
        named:{ mode:"Switch to the Transition mode first.", y50:"The death rate is still falling. Keep going.", y70:"The birth rate has started falling; the gap just passed its widest.",
          y0:"A high birth rate alone isn’t enough; look at the gap.", other:"Natural increase there is {r}%. Find where the shaded gap is widest." },
        hints:["Natural increase = (birth − death) ÷ 10.", "Find where the shaded gap is widest.", "Year 60: 38 − 18 = 20 per 1000 = 2.0%."] },
      { id:"tc2", goal:[2, 4], prompt:"<strong>Transition:</strong> find the first year when the doubling time is <strong>longer than 100 years</strong>.",
        why:"Year 130: 0.4% per year, so 70 ÷ 0.4 ≈ 175 years.",
        named:{ mode:"Switch to the Transition mode first.", y120:"70 ÷ 0.7 = exactly 100 years, not longer.", late:"Doubling time is already over 100 years at an earlier year.",
          early:"At year {y} the rate is {r}%: 70 ÷ {r} ≈ {d} years, under 100. Keep going." },
        hints:["Doubling time > 100 means rate < 0.7%.", "At year 120 the rate is exactly 0.7%.", "Year 130: 0.4%, about 175 years."] },
      { id:"tc3", goal:4, stretch:true, prompt:"<strong>Projection:</strong> a country of 20 million must reach <strong>80 million</strong>. Set a growth rate and a number of years that does it exactly.",
        why:"80 ÷ 20 = 4: two doublings, so years = 2 × (70 ÷ rate). On the slider steps that’s 2.0% for 70 years or 3.5% for 40 years.",
        named:{ mode:"Switch to the Projection mode first.", one:"That’s one doubling. 80 million is four times 20: two doublings.", four:"That’s 320 million.",
          other:"20 million → {p} million. 80 million needs exactly two doublings." },
        hints:["80 ÷ 20 = 4 = 2 × 2: two doublings.", "Years = 2 × doubling time = 2 × (70 ÷ rate).", "3.5% → 20-year doublings → 40 years; or 2.0% → 35-year doublings → 70 years."] }
    ]
  },
  part3:{
    slug:"footprint", name:"Footprints", heading:"Footprints and food",
    intro:"How many people can the Earth feed, and at what cost? Build a footprint, run a hectare’s crops through the energy pyramid, then weigh a Canadian food technology with evidence. Each station has a <strong>Check it with data</strong> panel.",
    st1:{
      title:"Station 1: footprint builder",
      text:"Choose a diet, a way of travelling and a home. A footprint counts the land and water needed for your food, goods, energy and housing, measured in global hectares (gha).",
      base:1.0, bio:1.6,
      groups:[
        { id:"diet", label:"Diet", opts:[{ id:"plants", t:"Mostly plants", v:0.8 }, { id:"mixed", t:"Mixed", v:1.4 }, { id:"meat", t:"High-meat", v:2.4 }] },
        { id:"travel", label:"Travel", opts:[{ id:"transit", t:"Transit and bike", v:0.3 }, { id:"some", t:"Some driving", v:1.2 }, { id:"lots", t:"Mostly driving and flights", v:2.6 }] },
        { id:"home", label:"Home", opts:[{ id:"apt", t:"Small apartment", v:0.5 }, { id:"avg", t:"Average house", v:1.2 }, { id:"big", t:"Large house", v:2.0 }] }],
      // VERIFY: Earth's biocapacity per person (≈ 1.6 gha) and Canada's average footprint (Global Footprint Network) before release.
      note:"Canada’s average footprint is among the world’s largest per person.",
      data:"Earths needed = footprint ÷ 1.6. The smallest choices give 1.0 + 0.8 + 0.3 + 0.5 = 2.6 gha ≈ 1.6 Earths; the largest give 8.0 gha = 5 Earths."
    },
    st2:{
      title:"Station 2: an energy pyramid on a hectare",
      text:`One hectare grows crops holding 40${NB}000${NB}000 kJ of food energy a year. A person needs about 4${NB}000${NB}000 kJ a year. Choose how much of the crop goes to livestock first.`,
      crop:40000000, need:4000000, shares:[0, 25, 50, 75, 100],
      data:`Eaten directly: 40${NB}000${NB}000 ÷ 4${NB}000${NB}000 = 10 people. Fed to livestock first, about 10% passes to meat: 4${NB}000${NB}000 kJ = 1 person. With a share <em>s</em> fed to livestock: people = 10 × (1 − <em>s</em>) + 1 × <em>s</em>.`
    },
    st3:{
      title:"Station 3: Canadian food technologies",
      how:"Choose a card. Build one benefit claim and one risk claim: choose a claim, then the evidence that supports it, and press Check.",
      cards:[
        // VERIFY: canola history (1970s breeding; herbicide-tolerant varieties in the 1990s) before release.
        { id:"canola", t:"Canola",
          blurb:"Bred from rapeseed by Canadian plant breeders in the 1970s, with low levels of erucic acid and glucosinolates, giving an edible oil and a protein-rich meal for livestock. Herbicide-tolerant varieties followed in the 1990s.",
          ev:[
            { id:"e1", t:"Breeders lowered erucic acid and glucosinolates, so the oil is edible." },
            { id:"e2", t:"Crushed seed gives an oil and a protein-rich meal for livestock." },
            { id:"e3", t:"Herbicide-tolerant varieties let farmers control weeds with one herbicide and till the soil less." },
            { id:"e4", t:"Spraying one herbicide year after year can select for herbicide-resistant weeds." },
            { id:"e5", t:"Canola fields turn bright yellow when they flower." }],
          ben:[
            { id:"b1", t:"Canola turns one crop into food for people and feed for livestock.", ev:["e1", "e2"], why:"An edible oil and a protein meal come from the same seed, so one hectare does two jobs." },
            { id:"b2", t:"Herbicide-tolerant canola can protect the soil.", ev:["e3"], why:"Less tillage leaves the soil covered, so less of it erodes." },
            { id:"b3", t:"Canola is better than every other crop.", bad:"No evidence here compares canola with every other crop." }],
          risk:[
            { id:"r1", t:"Relying on one herbicide can create weeds it no longer kills.", ev:["e3", "e4"], why:"Repeated spraying selects for resistant weeds, so farmers need to rotate herbicides and crops." },
            { id:"r2", t:"Canola oil is unsafe because breeders changed the plant.", bad:"The evidence says the opposite: breeding lowered erucic acid and made the oil edible." }] },
        { id:"green", t:"Greenhouse vegetables",
          blurb:"Greenhouses (for example, around Leamington, Ontario) grow vegetables year-round, with high yields per hectare, and water can be recycled, but heating them in winter uses a lot of energy.",
          ev:[
            { id:"g1", t:"Greenhouses give high yields per hectare, all year." },
            { id:"g2", t:"Water in a greenhouse can be collected and recycled." },
            { id:"g3", t:"Heating a greenhouse through a Canadian winter uses a lot of energy." },
            { id:"g4", t:"The plants grow under glass or plastic." }],
          ben:[
            { id:"b1", t:"Greenhouses grow more food on less land.", ev:["g1"], why:"More food per hectare means less land is needed to feed the same number of people." },
            { id:"b2", t:"Greenhouses can save water.", ev:["g2"], why:"Recycled water isn’t lost to the soil or the air." },
            { id:"b3", t:"Greenhouse food has no environmental cost.", bad:"No technology is free: the heating is a real cost." }],
          risk:[
            { id:"r1", t:"Winter heating gives greenhouse vegetables a large energy footprint.", ev:["g3"], why:"The energy for heating adds to the footprint of every vegetable grown in winter." },
            { id:"r2", t:"Greenhouse vegetables have no nutrients.", bad:"Unsupported: nothing in the evidence says so." }] },
        // VERIFY: the share of food wasted along the chain (no figure is shown to students) before release.
        { id:"waste", t:"Reducing food waste",
          blurb:"A large share of food is wasted along the chain, from farm to fridge. Cutting waste saves the land, water and energy already used to grow the food.",
          ev:[
            { id:"w1", t:"A large share of food is wasted between the farm and the fridge." },
            { id:"w2", t:"Wasted food also wastes the land, water and energy used to grow it." },
            { id:"w3", t:"Cutting waste needs changes by farms, stores and households, such as better storage and planning." },
            { id:"w4", t:"Food kept past its safe storage time can carry harmful microbes." },
            { id:"w5", t:"Some food scraps can be composted." }],
          ben:[
            { id:"b1", t:"Wasting less food feeds more people without new farmland.", ev:["w1", "w2"], why:"Food that is saved has already used its land, water and energy, so nothing extra is needed to grow it." },
            { id:"b2", t:"Reducing food waste ends hunger everywhere.", bad:"No single change does that; the evidence only shows savings." }],
          risk:[
            { id:"r1", t:"Results can be slow, because many people must change their habits.", ev:["w3"], why:"Waste happens at every step, so every step has to change." },
            { id:"r2", t:"Keeping food longer to avoid waste can make it unsafe to eat.", ev:["w4"], why:"Saving food must not go past safe storage times." },
            { id:"r3", t:"Composting makes food waste harmless, so cutting waste doesn’t matter.", bad:"Composting returns nutrients, but the land, water and energy used to grow the food are still lost." }] }
      ],
      evBad:"That evidence doesn’t support this claim. Choose the facts that back it up.",
      evNone:"Choose at least one piece of evidence."
    },
    quickCheck:{
      title:"Quick check", summary:"Footprints and food quick check",
      items:[
        { id:"q1", goal:5, prompt:"A footprint of 4.8 gha with a biocapacity of 1.6 gha per person means everyone living this way would need…",
          choices:[{ t:"3 Earths", ok:true, fb:"4.8 ÷ 1.6 = 3." },
            { t:"0.33 Earths", fb:"4.8 ÷ 1.6 = 3." },
            { t:"6.4 Earths", fb:"4.8 ÷ 1.6 = 3." },
            { t:"4.8 Earths", fb:"4.8 ÷ 1.6 = 3." }] },
        { id:"q2", goal:5, prompt:`Crops worth 20${NB}000${NB}000 kJ feed how many people (4${NB}000${NB}000 kJ each per year) if eaten directly?`,
          choices:[{ t:"5", ok:true, fb:`20${NB}000${NB}000 ÷ 4${NB}000${NB}000 = 5.` },
            { t:"0.5", fb:`20${NB}000${NB}000 ÷ 4${NB}000${NB}000 = 5.` },
            { t:"50", fb:`20${NB}000${NB}000 ÷ 4${NB}000${NB}000 = 5.` },
            { t:"2", fb:`20${NB}000${NB}000 ÷ 4${NB}000${NB}000 = 5.` }] },
        { id:"q3", goal:5, prompt:"The same crops are fed to cattle first. About how many people does the beef feed?",
          choices:[{ t:"0.5", ok:true, fb:`About 10% passes on: 2${NB}000${NB}000 kJ, half a person’s need.` },
            { t:"5", fb:`Only about 10% passes on: 2${NB}000${NB}000 kJ.` },
            { t:"4.5", fb:`Only about 10% passes on: 2${NB}000${NB}000 kJ.` },
            { t:"50", fb:`Only about 10% passes on: 2${NB}000${NB}000 kJ.` }] },
        { id:"q4", goal:6, prompt:"Which statement about canola is supported by evidence?",
          choices:[{ t:"It was bred in Canada from rapeseed to make an edible oil", ok:true, fb:"Canadian breeders developed it from rapeseed in the 1970s." },
            { t:"It is a wild plant never changed by people", fb:"Canadian breeders developed it from rapeseed in the 1970s." },
            { t:"It grows only in greenhouses", fb:"Canadian breeders developed it from rapeseed in the 1970s." },
            { t:"It is used only for fuel", fb:"Canadian breeders developed it from rapeseed in the 1970s." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pyr", type:"match", title:"Pyramid ↔ story", summary:"Pyramid ↔ story", goal:[2, 3],
        instruction:"Match each age pyramid (model shapes) with the story it tells.",
        leftTitle:"Pyramid", rightTitle:"Story",
        left:[
          { id:"l1", t:tile(PY.s2, null, "Very wide base, sides slope steeply inward"), why:"Many children and few older people: rapid growth." },
          { id:"l2", t:tile(PY.s3, null, "Wide base that is starting to narrow"), why:"The youngest bars are shrinking: the birth rate is falling." },
          { id:"l3", t:tile(PY.s4, null, "Nearly straight sides up to old age"), why:"Each age group is about the same size: stable." },
          { id:"l4", t:tile(PY.s5, null, "Base narrower than the middle"), why:"Fewer children than adults: fewer future parents, so decline.",
            hints:["Compare the bottom bars with the middle bars.", "Fewer children than adults.", "Fewer future parents: shrinking."] },
          { id:"l5", t:tile(PY.boom, null, "A bulge at ages 60–75"), why:"A large generation born after the war is now reaching retirement." },
          { id:"l6", t:tile(PY.notchL, PY.notchR, "A notch at ages 20–35, deepest on one side"), why:"Missing young adults, mostly of one sex: people leaving to work elsewhere, or wartime losses." }],
        right:[
          { id:"r1", t:"Rapid growth: high birth rate, falling death rate (stage 2)" },
          { id:"r2", t:"Growth slowing as the birth rate falls (stage 3)" },
          { id:"r3", t:"Stable: low birth and death rates (stage 4)" },
          { id:"r4", t:"Shrinking: births below deaths (stage 5)" },
          { id:"r5", t:"A large post-war baby boom now reaching retirement" },
          { id:"r6", t:"Young adults of one sex leaving to work elsewhere, or wartime losses" }],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6" },
        wrong:{ "l1|r4":"A wide base means many children: growth, not decline.", "l3|r2":"Straight sides mean each age group is about the same size.", "l5|r1":"The bulge is at the top end, among older people." },
        wrongDefault:"Compare the widths of the bottom, middle and top bars." },
      { id:"calc", type:"custom", title:"Population and food calculations", summary:"Population and food calculations", star:true, goal:[4, 5],
        instruction:"Seven calculations. Items 4–7 are non-routine (★); the last two go beyond the Final Check.",
        use:"Growth rate (%) = (births − deaths + net migration, per 1000) ÷ 10. Doubling time ≈ 70 ÷ growth rate (%). About 10% of food energy passes to the next level.",
        items:[
          { id:"h1", goal:4, prompt:"Birth rate 30 per 1000, death rate 10 per 1000, no migration. Growth rate (%)?",
            boxes:[{ label:"Growth rate", unit:"%", answer:2, wrong:[{ match:20, fb:"Per 1000 ÷ 10 = %." }] }],
            display:"2.0%", why:"(30 − 10) ÷ 10 = 2.0%.", general:"Subtract deaths from births, then divide by 10." },
          { id:"h2", goal:4, prompt:"Doubling time at that rate?",
            boxes:[{ label:"Doubling time", unit:"years", answer:35, wrong:[{ match:3500, fb:"Use 2, not 0.02." }] }],
            display:"35 years", why:"70 ÷ 2 = 35 years.", general:"Divide 70 by the growth rate in percent." },
          { id:"h3", goal:4, prompt:"Birth rate 12, death rate 8, net migration +6 (all per 1000). Growth rate, and doubling time?",
            boxes:[{ label:"Growth rate", unit:"%", answer:1, wrong:[{ match:0.4, fb:"Add net migration." }, { match:10, fb:"Per 1000 ÷ 10 = %." }] },
              { label:"Doubling time", unit:"years", answer:70, wrong:[{ match:175, fb:"Add net migration first: the rate is larger." }, { match:7000, fb:"Use the percentage, not the decimal." }] }],
            display:"1.0%; 70 years", why:"(12 − 8 + 6) ÷ 10 = 1.0%; 70 ÷ 1 = 70 years.", general:"Growth = births − deaths + net migration, per 1000, then ÷ 10." },
          { id:"h4", goal:4, star:true, prompt:"Birth rate 10, death rate 8, immigration 8 (all per 1000). What percentage of the growth comes from immigration?",
            boxes:[{ label:"Share from immigration", unit:"%", answer:80, wrong:[{ match:8, fb:"Growth = 10 − 8 + 8 = 10 per 1000; immigration is 8 of the 10." }, { match:0.8, fb:"That’s the fraction. Multiply by 100 for the percentage." }] }],
            display:"80%", why:"Growth = 10 − 8 + 8 = 10 per 1000; immigration is 8 of the 10: 80%.", general:"Find the total growth per 1000 first, then the immigration part of it.",
            hints:["Total growth per 1000 = births − deaths + immigrants.", "10 − 8 + 8 = 10.", "8 ÷ 10 = 80%."] },
          { id:"h5", goal:5, star:true, prompt:`A hectare’s crops hold 40${NB}000${NB}000 kJ; a person needs 4${NB}000${NB}000 kJ a year. People fed directly, and if the crops go to livestock first (10%)?`,
            boxes:[{ label:"Fed directly", unit:"people", answer:10 },
              { label:"Through livestock", unit:"people", answer:1, wrong:[{ match:9, fb:"Only 10% passes on; you subtracted 10%." }] }],
            display:"10; 1", why:`40${NB}000${NB}000 ÷ 4${NB}000${NB}000 = 10 directly; 10% of that is 4${NB}000${NB}000 kJ: 1 person.`, general:"Divide the crop energy by one person’s need; through livestock, only about 10% is left." },
          { id:"h6", goal:5, star:true, prompt:"Half the crops are eaten directly and half go to livestock. How many people can the hectare feed?",
            boxes:[{ label:"People fed", unit:"people", answer:5.5, wrong:[{ match:5, fb:"Don’t forget the 0.5 person fed by the meat." }, { match:10, fb:"Half the energy goes through livestock." }] }],
            display:"5.5 people", why:"Half eaten directly feeds 5; the other half through livestock feeds 0.5: 5.5 people.", general:"Work out each half separately, then add." },
          { id:"h7", goal:4, star:true, prompt:"A country of 30 million grows 2% per year. When does it reach 120 million, and what is it after 105 years at the same rate?",
            boxes:[{ label:"Reaches 120 million after", unit:"years", answer:70, wrong:[{ match:35, fb:"35 years is one doubling: 60 million. 120 million is two doublings." }] },
              { label:"Population after 105 years", unit:"million", answer:240, wrong:[{ match:60, fb:"105 ÷ 35 = 3 doublings: × 8." }, { match:90, fb:"105 ÷ 35 = 3 doublings: × 8." }] }],
            display:"70 years; 240 million", why:"Doubling time 35 years: 120 = 30 × 4 is two doublings (70 years); 105 years is three doublings: 30 × 8 = 240 million.", general:"Find the doubling time first, then count doublings.",
            hints:["Doubling time = 70 ÷ 2 = 35 years.", "120 = 30 × 4: two doublings = 70 years.", "105 years = 3 doublings: 30 × 8 = 240 million."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Rohan", how:"",
        instruction:"Rohan made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"A population grows 0.5% per year. Find its doubling time.",
            steps:["Rule of 70: doubling time ≈ 70 ÷ growth rate.", "Write the rate as a decimal: 70 ÷ 0.005.", `Doubling time ≈ 14${NB}000 years.`],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 divides correctly. The mistake is earlier."],
            fixes:[
              { t:"The rule uses the percentage: 70 ÷ 0.5 = 140 years.", ok:true, why:M4 },
              { t:"70 × 0.5 = 35 years.", why:"Divide, don’t multiply." },
              { t:"0.5 ÷ 70 years.", why:"That’s upside down." },
              { t:"Step 2 is correct.", why:M4 }],
            hints:["Try the rule at 7%: 70 ÷ 7 = 10 years. Which form of 7% did that use?", "The percentage number.", "70 ÷ 0.5 = 140 years."] },
          { id:"e2", goal:2, task:"Explain why a country’s population grew rapidly in stage 2.",
            steps:["In stage 1, birth and death rates are both high, so growth is slow.", "In stage 2, better food, clean water and medicine lower the death rate.", "At the same time, birth rates rise sharply.", "The rising birth rate is what causes the rapid growth."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 builds on step 3."],
            fixes:[
              { t:"Birth rates stay high for a while; the gap opened by the falling death rate causes the rapid growth.", ok:true, why:M1 },
              { t:"Both rates fall together in stage 2.", why:"Birth rates fall later, in stage 3." },
              { t:"Death rates rise in stage 2.", why:"They fall." },
              { t:"Step 3 is correct.", why:M1 }],
            hints:["Look at the transition graph: does the birth-rate curve go up in stage 2?", "It stays about level.", "The falling death rate creates the gap."] },
          { id:"e3", goal:3, task:"A country’s fertility has just fallen to replacement level (about 2.1 children per woman). Its pyramid has a wide base. Predict its growth.",
            steps:["Replacement fertility means each pair of parents is replaced by about two children.", "The wide base shows that many children and teens are alive now.", "So the population stops growing right away.", "Its total will stay the same from now on."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 repeats step 3’s idea."],
            fixes:[
              { t:"Those many young people will soon have children of their own, so births stay high for decades: the population keeps growing for a generation or two (momentum).", ok:true, why:M2 },
              { t:"It will start shrinking right away.", why:"Replacement fertility doesn’t shrink a young population." },
              { t:"Fertility will rise again.", why:"Nothing suggests that." },
              { t:"Step 3 is correct.", why:M2 }],
            hints:["What will the children at the base of the pyramid be doing in 20 years?", "Having children.", "So births stay high for a while: momentum."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most: how fast the last billions arrived, or that growth continues after fertility falls?" },
      { id:"j2", q:"In your own words, why did the human population boom after 1800?" },
      { id:"j3", q:"Explain to a friend why eating lower on the food chain can feed more people from the same land." },
      { id:"j4", q:"Which idea or calculation is still shaky for you? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"In which stage of the demographic transition does the death rate fall quickly while the birth rate stays high?", options:[
          { t:"Stage 2", ok:true, why:"Food, clean water and medicine lower the death rate first; the birth rate stays high." },
          { t:"Stage 1", why:"Both rates are high in stage 1." },
          { t:"Stage 3", why:"In stage 3 the birth rate falls." },
          { t:"Stage 4", why:"Both rates are low in stage 4." }] },
        b:{ prompt:"In which stage does the birth rate fall most quickly?", options:[
          { t:"Stage 3", ok:true, why:"Stage 3 is when family sizes shrink and the birth rate drops." },
          { t:"Stage 2", why:"The birth rate stays high in stage 2." },
          { t:"Stage 4", why:"Both rates are already low." },
          { t:"Stage 5", why:"Rates are low and births are below deaths." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"A population grows 1.4% per year. By the rule of 70, about how long does it take to double?", options:[
          { t:"50 years", ok:true, why:"70 ÷ 1.4." },
          { t:"5000 years", why:"Use 1.4, not 0.014." },
          { t:"98 years", why:"That’s 70 × 1.4; divide instead." },
          { t:"0.02 years", why:"That’s 1.4 ÷ 70, upside down." }] },
        b:{ prompt:"A population grows 3.5% per year. About how long does it take to double?", options:[
          { t:"20 years", ok:true, why:"70 ÷ 3.5 = 20." },
          { t:"2000 years", why:"Use 3.5, not 0.035." },
          { t:"245 years", why:"70 × 3.5; divide instead." },
          { t:"0.05 years", why:"Upside down: 3.5 ÷ 70." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"An age pyramid has a narrow base and a wide middle. What does it most likely show?", options:[
          { t:"A low birth rate; the population may soon shrink", ok:true, why:"Fewer children than adults means fewer future parents." },
          { t:"Rapid growth with many children", why:"Many children would make the base wide." },
          { t:"Mostly elderly people with no adults", why:"The middle is the widest part." },
          { t:"A high death rate among the young", why:"A narrow base reflects fewer births." }] },
        b:{ prompt:"An age pyramid has a very wide base and a narrow top. What does it most likely show?", options:[
          { t:"Rapid growth, with many young people", ok:true, why:"Many children now means many parents later." },
          { t:"An aging population", why:"The young groups are the largest." },
          { t:"A shrinking population", why:"A wide base means many future parents." },
          { t:"A stable population", why:"Stable pyramids have nearly straight sides." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"A country has a birth rate of 14 per 1000, a death rate of 9 per 1000 and net immigration of 5 per 1000. What is its growth rate, and its doubling time by the rule of 70?", options:[
          { t:"1.0%; about 70 years", ok:true, why:"(14 − 9 + 5) ÷ 10 = 1.0." },
          { t:"0.5%; about 140 years", why:"Immigration adds 5 per 1000." },
          { t:"2.8%; about 25 years", why:"Deaths subtract: 14 − 9 + 5, not 14 + 9 + 5." },
          { t:"10%; about 7 years", why:"10 per 1000 is 1%, not 10%." }] },
        b:{ prompt:"Birth rate 12 per 1000, death rate 9 per 1000, net immigration 11 per 1000. Growth rate and doubling time?", options:[
          { t:"1.4%; about 50 years", ok:true, why:"(12 − 9 + 11) ÷ 10 = 1.4; 70 ÷ 1.4 = 50." },
          { t:"0.3%; about 233 years", why:"Include immigration." },
          { t:"3.2%; about 22 years", why:"Deaths subtract." },
          { t:"14%; about 5 years", why:"Per 1000 ÷ 10." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"Country Y’s fertility fell to replacement level five years ago, but its age pyramid still has a wide base. Over the next 30 years, its population will most likely…", options:[
          { t:"keep growing for decades, then level off", ok:true, why:"Momentum: many young people are about to become parents." },
          { t:"stop growing immediately", why:M2 },
          { t:"start shrinking immediately", why:"Too many young people for that." },
          { t:"grow faster than ever", why:"Fertility per person is lower now; growth slows over time." }] },
        b:{ prompt:"Country Z’s fertility has been below replacement for 30 years. Its pyramid has a narrow base and a bulge at ages 50–65. With no immigration, over the next 30 years its population will most likely…", options:[
          { t:"shrink, as the large older group ages and few children are born", ok:true, why:"Few future parents and a large group reaching old age: deaths outnumber births." },
          { t:"grow quickly, because the bulge means many people", why:"The bulge is past child-bearing age." },
          { t:"stay exactly the same", why:"Deaths will soon outnumber births." },
          { t:"double by the rule of 70", why:"The growth rate is negative." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:`A hectare’s crops hold 30${NB}000${NB}000 kJ of food energy a year, and a person needs about 3${NB}000${NB}000 kJ a year. About 10% of the energy passes from crops to livestock. How many people can the hectare feed if the crops are eaten directly, and how many if they’re fed to livestock first?`, options:[
          { t:"10 directly; 1 through livestock", ok:true, why:`30${NB}000${NB}000 ÷ 3${NB}000${NB}000 = 10; about 10% of that passes to meat: 1.` },
          { t:"10 directly; 9 through livestock", why:"About 10% is kept, not lost." },
          { t:"1 directly; 10 through livestock", why:"The livestock step loses energy." },
          { t:"100 directly; 10 through livestock", why:`30${NB}000${NB}000 ÷ 3${NB}000${NB}000 = 10.` }] },
        b:{ prompt:`A hectare’s crops hold 60${NB}000${NB}000 kJ a year; a person needs 4${NB}000${NB}000 kJ. How many people can it feed directly, and through livestock?`, options:[
          { t:"15 directly; 1.5 through livestock", ok:true, why:`60${NB}000${NB}000 ÷ 4${NB}000${NB}000 = 15; about 10% of that: 1.5.` },
          { t:"15 directly; 13.5 through livestock", why:M6 },
          { t:"1.5 directly; 15 through livestock", why:M6 },
          { t:"150 directly; 15 through livestock", why:`60${NB}000${NB}000 ÷ 4${NB}000${NB}000 = 15.` }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of the steep rise in the world population since about 1800?", options:[
          { t:"“Death rates fell, thanks to a better food supply, clean water, sanitation, vaccines and medicine, while birth rates fell only later, so births outnumbered deaths by a growing margin.”", ok:true, why:"It names the cause (falling death rates) and the timing of the birth rate." },
          { t:"“Birth rates rose sharply after 1800.”", why:M1 },
          { t:"“People began living for hundreds of years.”", why:"Life expectancy rose, but not like that." },
          { t:"“The Earth’s carrying capacity doubled every year.”", why:"Carrying capacity doesn’t double each year." }] },
        b:{ prompt:"The world’s growth rate (%) has fallen since the 1960s, yet the population keeps rising. Which is the best explanation?", options:[
          { t:"“A smaller percentage of a much larger population still adds many people each year; the population shrinks only if the growth rate becomes negative.”", ok:true, why:M5 },
          { t:"“The data must be wrong: a falling rate means a falling population.”", why:M5 },
          { t:"“Death rates have risen.”", why:"Death rates have mostly fallen." },
          { t:"“Migration between countries adds people to the world.”", why:"Migration moves people; it doesn’t add to the world’s total." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"A student wants to show the age and sex structure of Canada’s population in one image. Which representation is best?", options:[
          { t:"An age pyramid", ok:true, why:"Bars for each age group, males on one side and females on the other." },
          { t:"A line graph of the total population over time", why:"That shows size, not structure." },
          { t:"A pie chart of the birth rate", why:"One number doesn’t need a pie chart." },
          { t:"A map of provinces", why:"That shows where, not what ages." }] },
        b:{ prompt:"A student wants to show how birth and death rates change through the demographic transition. Which representation is best?", options:[
          { t:"A line graph of both rates against time, with the gap between them shaded", ok:true, why:"It shows both rates changing and the gap that sets the growth rate." },
          { t:"An age pyramid for one year", why:"That shows structure at one moment." },
          { t:"A pie chart of today’s population", why:"It shows no change over time." },
          { t:"A single bar for the current growth rate", why:"It shows no stages." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Herbicide-tolerant canola lets farmers control weeds with one herbicide and till the soil less. Which statement best weighs a benefit against a risk using evidence?", options:[
          { t:"“Less tillage reduces soil erosion and fuel use, but relying on one herbicide can select for herbicide-resistant weeds, so farmers need to rotate herbicides and crops.”", ok:true, why:"It names a benefit and a risk, each backed by evidence." },
          { t:"“It’s dangerous because it isn’t natural.”", why:"No evidence is given." },
          { t:"“It has no risks because it’s approved.”", why:"Approval doesn’t mean zero risk." },
          { t:"“It makes canola oil unsafe to eat.”", why:"This claim isn’t supported by the evidence presented." }] },
        b:{ prompt:"Greenhouses near Leamington grow vegetables year-round. Which statement best weighs a benefit against a risk using evidence?", options:[
          { t:"“Greenhouses give high yields per hectare and can recycle water, but heating them through Canadian winters uses a lot of energy.”", ok:true, why:"It names benefits and a risk, each backed by evidence." },
          { t:"“Greenhouses are bad because the food isn’t grown outdoors.”", why:"No evidence is given." },
          { t:"“Greenhouses solve all food problems.”", why:"No technology does that." },
          { t:"“Greenhouse vegetables have no nutrients.”", why:"Unsupported." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A person’s footprint is 6.4 gha and Earth’s biocapacity is 1.6 gha per person (model values). How many Earths would we need if everyone lived this way, and how many after they switch from a high-meat diet (2.4 gha) to a mostly-plant diet (0.8 gha)?", options:[
          { t:"4 Earths, then 3 Earths", ok:true, why:"6.4 ÷ 1.6 = 4; (6.4 − 1.6) ÷ 1.6 = 3." },
          { t:"4 Earths, then still 4", why:"Diet is part of the footprint." },
          { t:"0.25 Earths, then 0.33", why:"That’s biocapacity ÷ footprint, upside down." },
          { t:"4 Earths, then 2.4", why:"Subtract the 1.6 gha saving first, then divide." }] },
        b:{ prompt:"A footprint of 8.0 gha, biocapacity 1.6 gha per person. Earths needed, and after the same diet switch (saving 1.6 gha)?", options:[
          { t:"5 Earths, then 4 Earths", ok:true, why:"8.0 ÷ 1.6 = 5; (8.0 − 1.6) ÷ 1.6 = 4." },
          { t:"5 Earths, then still 5", why:M7 },
          { t:"0.2 Earths, then 0.25", why:"Upside down." },
          { t:"5 Earths, then 3.4", why:"(8.0 − 1.6) ÷ 1.6 = 4." }] } }
    ]
  },
  task:{
    title:"Feed the family", summary:"Feed the family",
    statement:"<p>Plan a week of protein servings for one person that uses little land but still includes some meat. Can you find all the plans that work?</p><ol class=\"hp-conds\"><li>Exactly 14 protein servings in the week.</li><li>Total land used is 40 land units or less.</li><li>At least 4 servings of animal protein (chicken plus beef).</li><li>At least 1 serving of beef.</li></ol>",
    inputs:{ b:"Beans and lentils", c:"Chicken", f:"Beef" },
    land:{ b:1, c:3, f:10 },
    checks:["14 servings", "Land ≤ 40", "At least 4 animal servings", "Some beef"],
    tips:["Count all three kinds; they must add up to 14.", "Beef uses 10 times the land of beans. Swap a beef serving for chicken or beans to save land.", "Add chicken or beef until there are at least 4 animal servings.", "Include at least one beef serving."],
    previewNote:"Land per serving (model values): beans and lentils 1, chicken 3, beef 10 land units.",
    explainPrompt:"Explain how your plan keeps land use low, using the 10% energy rule to say why beef uses so much more land than beans.",
    vocab:"Use the words trophic level, energy transfer, ecological footprint and land use.",
    after3:"Every plan has at most 2 beef servings. Each beef serving ‘costs’ as much land as about three chicken servings or ten bean servings: the energy pyramid on your plate."
  },
  cards:[
    ["J-curve of human population", "Slow growth for millennia, then a steep rise since about 1800."],
    ["Why the boom?", "Death rates fell (food, clean water, sanitation, medicine) before birth rates did."],
    ["Demographic transition, stages 1–2", "1: high births, high deaths. 2: deaths fall, births stay high, so rapid growth."],
    ["Demographic transition, stages 3–5", "3: births fall. 4: both low. 5: births below deaths."],
    ["Growth rate (%)", "(birth rate − death rate + net migration rate, per 1000) ÷ 10."],
    ["Rule of 70", "Doubling time ≈ 70 ÷ growth rate (%). 2% → 35 years."],
    ["Expanding pyramid", "Wide base: many young people, rapid growth."],
    ["Contracting pyramid", "Narrow base: fewer births, possible decline."],
    ["Population momentum", "A young population keeps growing for decades after fertility falls to replacement."],
    ["Ecological footprint", "Land and water needed to supply a person’s food, goods, energy and housing, in global hectares."],
    ["10% rule and food", "Eating crops directly feeds about 10 times as many people as feeding them to livestock first."],
    ["Canola", "Bred in Canada from rapeseed in the 1970s for edible oil and protein meal."]
  ]
};
