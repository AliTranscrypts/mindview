// SBI4U 43 Population Ecology. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/43-population-ecology.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M8 but gives no feedback of its own.
const M1 = "At `K`, births equal deaths, so growth is 0. Growth is fastest at `K/2`, where there are many parents and still plenty of room.";
const M2 = "Density is size ÷ area: 900 salamanders in 2 ha is 450 per hectare.";
const M3 = "Change = (births + immigrants) − (deaths + emigrants). All four count.";
const M4 = "`r` is per individual. 0.05 of a bigger population is a bigger number, so the additions grow.";
const M5 = "`N = M × n ÷ m`. If marked animals are under-counted in the second sample, `m` is too small, so `N` comes out too big.";
const M6 = "Ask: would this hit harder if the population were more crowded? A blizzard doesn’t care; a disease does.";
const M7 = "At `K`, individuals are still born and still die, in equal numbers. It’s a balance, not a freeze.";
const M8 = "Type III: huge early losses, so few young survive (cod, maple seeds). Type I: most live to old age (humans, bears).";
// W3's graph: a small J-curve drawn inline (stroke colours come from app.css tokens).
const JGRAPH = '<svg class="po-wg" viewBox="0 0 180 110" role="img" aria-label="A population graph: population size against time. The curve rises slowly at first, then more and more steeply." focusable="false">' +
  '<path class="po-wg-ax" d="M24 8 L24 92 L172 92"/><path class="po-wg-c" d="M26 89 C80 88 118 80 140 60 C152 48 160 30 166 12"/>' +
  '<text class="po-wg-t" x="98" y="106" text-anchor="middle">time</text><text class="po-wg-t" x="14" y="52" text-anchor="middle" transform="rotate(-90 14 52)">population</text></svg>';

export default {
  id:"43-population-ecology",
  kind:"topic",
  title:"Population ecology",
  topic:"Population Ecology",
  readyTopic:"population ecology",
  hero:{
    eq:'<span class="po-heq">growth rate = <i>r</i><i class="po-n">N</i><span class="po-fac">(<i class="po-k">K</i> − <i class="po-n">N</i>)/<i class="po-k">K</i></span></span>',
    eqLabel:"Growth rate equals r times N, times K minus N, over K.",
    eqSize:"sm",
    headline:"Every population meets a ceiling",
    text:"Give a population food and space and it <strong>grows exponentially</strong>: the more individuals, the more young. But every habitat has a <strong>carrying capacity</strong>, `K`. As a population nears it, food, space and safety run short, and growth slows to a stop. You’ll model both kinds of growth, then estimate real populations the way field biologists do.",
    fig:{ html:'<div class="po-hero" id="po-hero" role="img" aria-label="A small herd of 10 deer dots on a map multiplies year by year while a population graph traces a steepening J-curve. A dashed line labelled K = 500 fades in; the curve bends, passes the halfway mark at its steepest, and levels off just under the line."></div>' }
  },
  goals:[
    "I can describe a population by its size, density, distribution pattern and survivorship.",
    "I can calculate a per-capita growth rate from births, deaths, immigration and emigration, and use it to predict the next size.",
    "I can use exponential and logistic models to predict population size and growth, and say where growth is fastest.",
    "I can explain carrying capacity and sort limiting factors into density-dependent and density-independent.",
    "I can estimate population size with quadrats and mark–recapture, and explain what makes an estimate biased.",
    "I can compare r-selected and K-selected strategies and the three survivorship curves."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Percentages", goal:2,
          prompt:"A population of 400 grows by 10% in one year. What is its size after that year?",
          options:[
            { t:"440", ok:true, why:"10% of 400 is 40, and 400 + 40 = 440." },
            { t:"410", why:"10% means 10 per 100, so 40 for 400." },
            { t:"4000", why:"That’s a 900% increase." },
            { t:"800", why:"Doubling is a 100% increase." }],
          hints:["Find 10% of 400 first.", "10% of 400 = 40.", "400 + 40 = 440."] },
        { id:"w2", skill:"Percentages", goal:2,
          prompt:"A population of 500 has 60 births and 35 deaths in a year, with no one arriving or leaving. What is the change in size?",
          options:[
            { t:"+25", ok:true, why:"60 − 35 = 25 more individuals." },
            { t:"+95", why:"Deaths remove individuals." },
            { t:"−25", why:"There were more births than deaths, so the population grew." },
            { t:"+60", why:"The 35 deaths count too." }],
          hints:["Births add; deaths remove.", "60 added, 35 removed.", "+25."] },
        { id:"w3", skill:"Reading graphs", goal:3,
          prompt:"A population graph rises slowly at first, then more and more steeply. Which description fits?" + JGRAPH,
          options:[
            { t:"Exponential (J-shaped) growth", ok:true, why:"The steepening curve means each year adds more than the last." },
            { t:"Logistic (S-shaped) growth", why:"An S-curve levels off; this one keeps getting steeper." },
            { t:"Linear growth", why:"A straight line adds the same amount each year." },
            { t:"Decline", why:"The curve rises, so the population is growing." }],
          hints:["Is the slope constant, increasing or decreasing?", "It keeps increasing.", "Exponential."] },
        { id:"w4", skill:"Reading graphs", goal:4,
          prompt:"A population graph levels off at 800 individuals and stays near there. What does 800 most likely represent?",
          options:[
            { t:"The largest population the habitat can support over time (its carrying capacity)", ok:true, why:"The resources limit it there." },
            { t:"The starting population", why:"The start is at the left of the graph." },
            { t:"The number born each year", why:"The `y`-axis shows population size, not births." },
            { t:"The year growth stopped", why:"800 is on the population axis, not the time axis." }],
          hints:["Which axis is 800 on?", "Population size, where the curve flattens.", "Carrying capacity."] },
        { id:"w5", skill:"Ecology terms", goal:1,
          prompt:"Which is a population?",
          options:[
            { t:"All the white-tailed deer in Algonquin Park", ok:true, why:"One species, one place, one time." },
            { t:"All the animals in Algonquin Park", why:"Many species together are a community." },
            { t:"The deer and the wolves that hunt them", why:"Two species interacting are part of a community." },
            { t:"The park’s living things and its soil, water and climate", why:"That’s an ecosystem." }],
          hints:["How many species are in a population?", "One.", "The deer."] },
        { id:"w6", skill:"Ecology terms", goal:4,
          prompt:"Which is an abiotic factor?",
          options:[
            { t:"A late spring frost", ok:true, why:"Weather is non-living." },
            { t:"A parasite", why:"Parasites are living: biotic." },
            { t:"A predator", why:"Predators are biotic." },
            { t:"Competition for food", why:"Competition happens between living things." }],
          hints:["Abiotic means non-living.", "Which choice isn’t an organism or an interaction between organisms?", "The frost."] }
      ],
      refreshers:{
        "Percentages":"To grow by `p`%, add `p`/100 of the current size. 10% of 400 is 40, so the new size is 440. Births add; deaths remove.",
        "Reading graphs":"A straight line means the same change each step. A curve getting steeper means faster and faster growth; one that flattens is levelling off at a limit.",
        "Ecology terms":"Population: one species in one area. Community: all the populations together. Ecosystem: the community plus the non-living (abiotic) factors such as weather, water and soil."
      }
    }
  },
  explore:{
    heading:"Population growth simulator",
    intro:"Choose a model, set the starting population and growth rate, and run the years. Watch how many individuals are added each year, not just the total.",
    chalIntro:"Set the simulator to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    modelNote:"One step per year. Exponential: `N_{t+1} = N_t(1 + r)`. Logistic: `N_{t+1} = N_t + rN_t(K - N_t)/K`. Cycle: `N = ` average + swing × sin(2π`t`/length). Values are shown rounded to whole individuals.",
    demoNote:"Logistic births per year = (`r` + 0.1)`N` − (`r`/2)`N`²/`K`; deaths per year = 0.1`N` + (`r`/2)`N`²/`K`. Their difference is the logistic gain.",
    predictions:[
      { id:"p1", prompt:"Exponential, `N_0` = 50, `r` = 1.0. The population doubles every year. How big is it after 4 years?",
        options:[{ t:"800", ok:true }, { t:"250" }, { t:"400" }, { t:"200" }],
        explain:"Each year doubles the <em>current</em> size, so the gains double too. 250 would be adding 50 every year.",
        reveal:"50 → 100 → 200 → 400 → 800. The gains (+50, +100, +200, +400) are stacked as bars under the curve.",
        start:{ model:"exp", n0:50, r10:10, year:0, view:"time" }, to:4 },
      { id:"p2", prompt:"Logistic, `N_0` = 20, `r` = 0.5, `K` = 500. When will the population add the most individuals in one year?",
        options:[{ t:"When it’s near 250, half of `K`", ok:true }, { t:"When it’s near 500" }, { t:"At the start, when it’s 20" }, { t:"The gain is the same every year" }],
        explain:"Near 250 there are many parents and still plenty of room. Near 500 the habitat is full.",
        reveal:"The “Growth vs population” view drew the hump. Its peak is at `N` = 250, half of `K`.",
        start:{ model:"log", n0:20, r10:5, K:500, year:0, view:"growth" }, to:20 },
      { id:"p3", prompt:"Logistic, `N_0` = 700, `r` = 0.5, `K` = 500. The population starts above carrying capacity. What happens?",
        options:[{ t:"It falls toward 500", ok:true }, { t:"It keeps rising" }, { t:"It crashes to 0" }, { t:"It stays at 700" }],
        explain:"Above `K`, (`K − N`) is negative, so the ‘growth’ is a loss until `N` returns to `K`.",
        reveal:"700 → 560 → 526 → 513 …: the deaths bar is taller than the births bar until `N` is back at 500. (The `N_0` slider runs to 700 for this prediction only.)",
        start:{ model:"log", n0:700, r10:5, K:500, year:0, view:"time" }, to:6 },
      { id:"p4", prompt:"Logistic, run to year 20, so `N` ≈ `K`. The population is at carrying capacity. Are individuals still being born?",
        options:[{ t:"Yes, and just as many die each year", ok:true }, { t:"No, births stop at `K`" }, { t:"No, nothing dies once the habitat is full" }, { t:"Yes, and more are born than die" }],
        explain:"Carrying capacity is a balance of births and deaths, not a freeze.",
        reveal:"At year 20 the bars read 175 born / 175 died (`r` = 0.5, `K` = 500).",
        start:{ model:"log", n0:50, r10:5, K:500, year:0, view:"time" }, to:20 }
    ],
    challenges:[
      { id:"tc1", goal:[3, 4], prompt:"Exponential mode: make the population <strong>exactly 640</strong> in year 3.",
        why:"80 × 2 × 2 × 2 = 640: with `r` = 1.0 the population doubles each year.",
        general:"Exponential growth multiplies; it doesn’t add the same amount.",
        named:{ mode:"Switch the model to <strong>Exponential</strong> first.",
          n160:"One doubling too many. Work backwards from 640: 320, 160, 80.",
          r05:"Growing by half each year is too slow; 640 ÷ 80 = 8 = 2 × 2 × 2." },
        hints:["Three years of growth: `N_0 × (1 + r) × (1 + r) × (1 + r) = 640`.", "If the population doubles each year (`r` = 1.0), then `N_0` × 8 = 640.", "`N_0` = 80, `r` = 1.0."] },
      { id:"tc2", goal:[3, 4], prompt:"Logistic mode: set `r` and `K` so the fastest possible yearly gain (at `N = K/2`) is <strong>exactly 50</strong>.",
        why:"The gain at `K/2` is `r × (K/2) × (1/2) = rK/4`, so `rK` = 200. The peak is at half of `K`, not at `K`, where the gain is 0.",
        general:"The fastest gain is `rK/4`. Change `r` or `K` until it is 50.",
        named:{ mode:"Switch the model to <strong>Logistic</strong> first.",
          rk100:"You used `r × K/2`. Don’t forget the crowding factor: at `K/2` it’s (`K − K/2`)/`K` = 1/2.",
          rk50:"`rK/4` must be 50, so `rK` = 200." },
        hints:["Gain = `rN(K - N)/K`. Put `N = K/2`.", "That gives `rK/4`.", "`rK/4` = 50, so `rK` = 200: for example `r` = 0.4, `K` = 500."] },
      { id:"tc3", goal:[3, 4], stretch:true, prompt:"Logistic mode: the population must gain <strong>exactly 90</strong> in its first year, and must start <strong>below half of `K`</strong>.",
        why:"`rN_0(K - N_0)/K` = 90 with `N_0 < K/2`. The plans that work: (100, 1.0, 1000), (150, 0.8, 600), (150, 0.9, 450) and (200, 0.6, 800).",
        general:"Find the first-year gain `rN_0(K - N_0)/K`. It must be exactly 90, with `N_0` below `K/2`.",
        named:{ mode:"Switch the model to <strong>Logistic</strong> first.",
          half:"That gains 90, but 200 is exactly half of 400, not below it.",
          halfAny:"That gains 90, but `N_0` isn’t below half of `K`.",
          crowd:"`rN_0` = 90 forgets (`K − N_0`)/`K`, which is always less than 1." },
        hints:["Choose `N_0` and `K` first, then solve for `r`.", "Try `K` = 1000 and `N_0` = 100: (`K − N_0`)/`K` = 0.9, so `r` × 100 × 0.9 = 90.", "`r` = 1.0. Others: (150, 0.8, 600), (150, 0.9, 450), (200, 0.6, 800)."] }
    ]
  },
  part3:{
    slug:"sampling", name:"Sampling", heading:"Measure a population",
    intro:"The models need real numbers. Ecologists estimate rather than count: quadrats for plants and slow animals, mark–recapture for animals that move. Work through the three stations, then try the quick check.",
    st1:{ title:"Station 1: Quadrats in a woodlot",
      text:"A 50 m × 40 m woodlot (2000 m²) of trilliums, which grow in clumps. Each quadrat is 1 m².",
      random:[[8, 11], [31, 5], [42, 32], [15, 31], [47, 15], [25, 18], [6, 24], [34, 25], [12, 5], [20, 25]],
      bias:"Random placement keeps your choices from steering the result.",
      steady:"With 10 quadrats the running estimate steadies: more samples help with a clumped distribution." },
    st2:{ title:"Station 2: Mark–recapture at a pond",
      text:"Painted turtles. First capture: `M` = 40 turtles get a dab of paint on the shell and are released. Second capture: `n` = 30 are caught, and `m` = 8 of them are marked.",
      M:40, n:30, m:8, mWorn:6,
      cards:[
        { id:"a1", t:"Marks don’t wear off", broke:"If paint wears off, marked turtles are counted as unmarked. `m` comes out too small, so `N` comes out too big." },
        { id:"a2", t:"Marked turtles mix back in", broke:"If marked turtles stay together near where they were released, the second sample’s fraction marked doesn’t match the pond’s, and the estimate can be off in either direction." },
        { id:"a3", t:"No births, deaths or migration between captures", broke:"New unmarked turtles arriving or hatching dilute the marks, so `m` is too small and `N` too big. Marked turtles dying or leaving does the same." },
        { id:"a4", t:"Being marked doesn’t change the chance of being caught", broke:"Trap-shy marked turtles make `m` too small and `N` too big. Trap-happy ones make `m` too big and `N` too small." }] },
    st3:{ title:"Station 3: Patterns and strategies",
      maps:[
        { id:"clumped", t:"Trilliums around moist hollows", fb:"Clumped: the plants gather where the soil stays moist." },
        { id:"uniform", t:"Nesting gannets", fb:"Uniform: each bird pecks at neighbours within reach, so nests end up evenly spaced." },
        { id:"random", t:"Dandelions in a lawn", fb:"Random: wind-blown seeds land anywhere, with no pattern." }],
      m8:M8,
      logNote:"The `y`-axis is a log scale: each grid line is 10 times the one below.",
      orgs:[
        { id:"o1", t:"Humans", type:"I" }, { id:"o2", t:"Black bears", type:"I" }, { id:"o3", t:"American robins", type:"II" },
        { id:"o4", t:"Atlantic cod", type:"III" }, { id:"o5", t:"Sugar maple seeds", type:"III" }],
      typeWhy:{ I:"Type I: most live to old age, then losses climb late in life.", II:"Type II: a roughly constant risk at every age.", III:"Type III: huge early losses; the few survivors can live long." },
      table:{ head:["", "r-selected", "K-selected"],
        rows:[["Offspring number", "Many", "Few"], ["Parental care", "Little or none", "Much"], ["Age at first reproduction", "Early", "Late"], ["Lifespan", "Short", "Long"], ["Typical survivorship", "Type III", "Type I"]] } },
    quickCheck:{
      title:"Measure a population quick check", summary:"Measure a population quick check",
      items:[
        { id:"q1", goal:5, prompt:"Five 1 m² quadrats hold 2, 4, 3, 5 and 1 plants. The field is 600 m². Estimate the population.",
          choices:[{ t:"1800", ok:true, fb:"Mean = 15 ÷ 5 = 3 per m²; 3 × 600 = 1800." },
            { t:"3000", fb:"Mean = 15 ÷ 5 = 3 per m²; 3 × 600 = 1800. 15 is only the plants in the quadrats." },
            { t:"9000", fb:"Mean = 15 ÷ 5 = 3 per m²; 3 × 600 = 1800. 15 is only the plants in the quadrats." },
            { t:"15", fb:"Mean = 15 ÷ 5 = 3 per m²; 3 × 600 = 1800. 15 is only the plants in the quadrats." }] },
        { id:"q2", goal:5, prompt:"`M` = 50 marked; a second sample of `n` = 40 has `m` = 10 marked. Estimate `N`.",
          choices:[{ t:"200", ok:true, fb:"`N = M × n ÷ m` = 50 × 40 ÷ 10 = 200." },
            { t:"12.5", fb:"`N = M × n ÷ m` = 50 × 40 ÷ 10. 12.5 flips the ratio." },
            { t:"100", fb:"`N = M × n ÷ m` = 50 × 40 ÷ 10. 12.5 flips the ratio." },
            { t:"2000", fb:"`N = M × n ÷ m` = 50 × 40 ÷ 10. 12.5 flips the ratio." }] },
        { id:"q3", goal:1, prompt:"Nesting seabirds peck at any neighbour within reach, so nests end up evenly spaced. Distribution?",
          choices:[{ t:"Uniform", ok:true, fb:"Even spacing from territorial behaviour is uniform." },
            { t:"Clumped", fb:"Even spacing from territorial behaviour is uniform." },
            { t:"Random", fb:"Even spacing from territorial behaviour is uniform." },
            { t:"Exponential", fb:"Even spacing from territorial behaviour is uniform." }] },
        { id:"q4", goal:6, prompt:"A tree makes thousands of seeds; almost all die as seedlings, but survivors live long. Survivorship type?",
          choices:[{ t:"III", ok:true, fb:"Huge early losses: type III." },
            { t:"I", fb:"Huge early losses: type III." },
            { t:"II", fb:"Huge early losses: type III." },
            { t:"Logistic", fb:"Huge early losses: type III." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sorter", type:"sorter", title:"Limiting factor sorter", summary:"Limiting factor sorter", goal:4, noun:"factor", txt:true,
        instruction:"Ten limiting factors. Sort each one: does it depend on how crowded the population is?",
        boxes:[{ id:"dd", label:"Density-dependent" }, { id:"di", label:"Density-independent" }],
        wrongDefault:"Ask: would this hit harder if the population were more crowded? Try the other box.",
        items:[
          { id:"i1", t:"A contagious disease spreads through a crowded deer yard", answer:"dd", why:"Crowding helps a disease spread.",
            wrong:{ di:"Crowding helps it spread or bite harder, so it depends on density." } },
          { id:"i2", t:"A late spring frost kills apple blossoms", answer:"di", why:"A frost kills the same fraction however crowded the trees are.",
            wrong:{ dd:"Would it hit harder if the population were more crowded? A frost kills the same fraction either way." } },
          { id:"i3", t:"Moose compete for scarce winter browse", answer:"dd", why:"More moose means less browse for each.",
            wrong:{ di:"Crowding helps it spread or bite harder, so it depends on density." } },
          { id:"i4", t:"A lightning-caused forest fire", answer:"di", why:"Fire burns crowded and sparse populations alike.",
            wrong:{ dd:"Would it hit harder if the population were more crowded? A frost kills the same fraction either way." } },
          { id:"i5", t:"Owls catch more voles in years when voles are abundant", answer:"dd", why:"More voles, more successful hunts.",
            wrong:{ di:"Crowding helps it spread or bite harder, so it depends on density." },
            hints:["Do owls eat a bigger share when voles are common?", "Yes: more voles, more successful hunts.", "Density-dependent."] },
          { id:"i6", t:"A spring flood washes out shoreline nests", answer:"di", why:"A flood doesn’t depend on how many nests there are.",
            wrong:{ dd:"Would it hit harder if the population were more crowded? A frost kills the same fraction either way." } },
          { id:"i7", t:"Tadpoles in a crowded pond each get less food", answer:"dd", why:"Competition for food grows with crowding.",
            wrong:{ di:"Crowding helps it spread or bite harder, so it depends on density." } },
          { id:"i8", t:"Acid rain lowers a lake’s pH", answer:"di", why:"Crowding doesn’t change the rain.",
            wrong:{ dd:"Would it hit harder if the population were more crowded? A frost kills the same fraction either way." },
            hints:["Does crowding change the rain?", "No.", "Density-independent."] },
          { id:"i9", t:"Parasites pass more easily between animals living close together", answer:"dd", why:"Close contact speeds transmission.",
            wrong:{ di:"Crowding helps it spread or bite harder, so it depends on density." } },
          { id:"i10", t:"Crowding stress lowers the number of young per female in a rodent colony", answer:"dd", why:"Crowding is the cause, so it depends on density.",
            wrong:{ di:"Crowding is the cause here, so it depends on density." } }
        ] },
      { id:"calc", type:"numeric", title:"Population calculations", summary:"Population calculations", goal:[1, 2, 3, 4, 5],
        instruction:"Eight problems. Problems 5–8 are non-routine (★); 7 and 8 go beyond the Final Check.",
        how:"Type a number, then press Check.",
        items:[
          { id:"c1", goal:1, prompt:"1200 trilliums grow in a 0.3 ha woodlot. Density in plants per hectare?", answer:4000, display:"4000 per hectare", unit:"per hectare",
            why:"1200 ÷ 0.3 = 4000.", wrong:[{ match:360, fb:"That multiplies; density divides by area." }] },
          { id:"c2", goal:2, prompt:"A population of 800 has 120 births, 40 deaths, 30 immigrants and 10 emigrants in a year. Find `r`.", answer:0.125, display:"`r` = 0.125 per year", unit:"per year",
            why:"(120 + 30 − 40 − 10) ÷ 800 = 100 ÷ 800 = 0.125.", wrong:[{ match:0.1, fb:"You left out migration: +30 − 10." }, { match:0.25, fb:"Deaths and emigrants subtract." }] },
          { id:"c3", goal:2, prompt:"With the same `r`, what is the population after one year?", answer:900, display:"900", unit:"individuals",
            why:"800 × 0.125 = 100, so 900.", wrong:[{ match:925, fb:"800 × 0.125 = 100, so 900." }] },
          { id:"c4", goal:3, prompt:"A population grows 5% per year. Doubling time by the rule of 70?", answer:14, display:"14 years", unit:"years",
            why:"70 ÷ 5 = 14.", wrong:[{ match:1400, fb:"Use the percentage, 5, not 0.05." }] },
          { id:"c5", goal:3, star:true, prompt:"Logistic: `r` = 0.4, `K` = 1000, `N` = 250. Gain this year?", answer:75, display:"75", unit:"individuals",
            why:"0.4 × 250 × 750/1000 = 100 × 0.75 = 75.", wrong:[{ match:100, fb:"That’s `rN`; multiply by (`K − N`)/`K` = 0.75." }],
            hints:["Gain = `rN(K - N)/K`.", "0.4 × 250 × 750/1000.", "100 × 0.75 = 75."] },
          { id:"c6", goal:[3, 4], star:true, prompt:"Same `r` and `K`: at what `N` is the gain largest, and what is it? Type `N`, then the gain, separated by a comma.", answer:[500, 100], display:"`N` = 500; gain 100",
            label:"`N`, gain:", why:"The gain is largest at `K/2` = 500: 0.4 × 500 × 500/1000 = 100.", wrong:[{ match:[1000, 400], fb:"At `K` the gain is 0." }] },
          { id:"c7", goal:5, star:true, prompt:"A study expects about 600 animals. If 60 are marked and a second sample of 50 is caught, how many marked animals should be in it?", answer:5, display:"5 marked", unit:"marked",
            why:"`m = Mn/N` = 60 × 50 ÷ 600 = 5.", wrong:[{ match:0.5, fb:"Rearrange `N = Mn/m`: `m = Mn/N` = 60 × 50 ÷ 600." }, { match:50, fb:"Rearrange `N = Mn/m`: `m = Mn/N` = 60 × 50 ÷ 600." }],
            hints:["Fraction marked in the sample = fraction marked in the population.", "`m`/50 = 60/600 = 1/10.", "`m` = 5."] },
          { id:"c8", goal:3, star:true, prompt:"400 animals grow exponentially at `r` = 0.25 per year (yearly steps). After how many whole years does the population first pass 900?", answer:4, display:"4 years", unit:"years",
            why:"500, 625, 781.25, 976.6: year 4 is the first past 900.",
            wrong:[{ match:5, fb:"Year 4 gives 976.6, already past 900." }, { match:3, fb:"Year 3 is 781.25." }, { match:6, fb:"That adds 100 every year; the gains grow." }],
            hints:["Multiply by 1.25 each year.", "500, 625, 781.25, …", "Year 4: 976.6."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Kenji", how:"",
        instruction:"Kenji made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:5, task:"30 turtles are marked. Later, 24 are caught and 6 of them are marked. Estimate the population.",
            steps:["Fraction marked in the second sample: 6/24 = 1/4.", "Assume the same fraction in the whole pond: 30/`N` = 1/4.", "So `N` = 30 × 1/4 = 7.5.", "About 8 turtles."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 rounds step 3 correctly. The mistake is earlier."],
            fixes:[
              { t:"30/`N` = 1/4 means `N` = 30 × 4 = 120 turtles.", ok:true, why:M5 },
              { t:"`N` = 30 + 24 = 54.", why:"Adding samples ignores the recaptures." },
              { t:"`N` = 24 × 4 = 96.", why:"That uses the second sample, not the 30 marked." },
              { t:"Step 3 is correct.", why:"Fewer turtles than were marked can’t be right." }],
            hints:["Could the pond hold fewer turtles than the 30 that were marked?", "Solve 30/`N` = 1/4 for `N`.", "`N` = 120."] },
          { id:"e2", goal:2, task:"A deer herd of 500 has 90 births, 50 deaths, 20 deer arriving and 10 leaving in one year. Find `r`.",
            steps:["Births − deaths = 90 − 50 = 40.", "Net migration = 20 − 10 = 10.", "Total change = 40 − 10 = 30.", "`r` = 30 ÷ 500 = 0.06 per year."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 divides correctly. The mistake is earlier."],
            fixes:[
              { t:"Net migration of +10 adds: 40 + 10 = 50, so `r` = 0.10 per year.", ok:true, why:M3 },
              { t:"Add everything: 90 + 50 + 20 + 10 = 170.", why:"Deaths and emigrants subtract." },
              { t:"Ignore migration: `r` = 40/500 = 0.08.", why:M3 },
              { t:"Step 3 is correct.", why:"10 more deer arrived than left, so migration adds 10." }],
            hints:["Is net migration a gain or a loss here?", "A gain of 10.", "50 ÷ 500 = 0.10."] },
          { id:"e3", goal:3, task:"Logistic growth, `r` = 0.6, `K` = 800. At what size is the population growing fastest, and by how much per year?",
            steps:["Gain = `rN(K - N)/K`.", "The gain is largest when `N` is largest, at `N = K` = 800.", "Gain = 0.6 × 800 = 480 per year."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2 (and also drops the crowding factor). The first mistake is earlier."],
            fixes:[
              { t:"The gain is largest at `N = K/2` = 400: 0.6 × 400 × 400/800 = 120 per year.", ok:true, why:M1 },
              { t:"Largest at the start, when `N` is smallest.", why:"Few parents means few young." },
              { t:"Largest at `N` = 800, but the gain is 0.6 × 800 × 800/800 = 480.", why:M1 },
              { t:"Step 2 is correct.", why:"At `N` = 800, (`K − N`) = 0: no growth at all." }],
            hints:["What is (`K − N`) when `N = K`?", "0, so the gain is 0 at `K`.", "The peak is halfway: `N` = 400, gain 120."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the simulator: how fast exponential growth runs away, or that a population at `K` still has births?" },
      { id:"j2", q:"In your own words, why does logistic growth slow down as `N` approaches `K`?" },
      { id:"j3", q:"Explain to a friend how mark–recapture works, and one way it can give the wrong answer." },
      { id:"j4", q:"Which calculation still trips you up? What will you practise before the next module?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"A 2 ha woodlot contains 900 red-backed salamanders. What is their population density?", options:[
          { t:"450 per hectare", ok:true, why:"900 ÷ 2." },
          { t:"1800 per hectare", why:"Density divides by area." },
          { t:"900 per hectare", why:"That ignores the area." },
          { t:"0.002 per hectare", why:"That’s area ÷ number, upside down." }] },
        b:{ prompt:"A 4 ha marsh holds 1000 leopard frogs. What is their population density?", options:[
          { t:"250 per hectare", ok:true, why:"1000 ÷ 4." },
          { t:"4000 per hectare", why:"Density divides by area. " + M2 },
          { t:"1000 per hectare", why:"That ignores the area. " + M2 },
          { t:"0.004 per hectare", why:"Upside down." }] } },
      { id:"k2", cat:"K", goal:6,
        a:{ prompt:"Which organism most likely has a type III survivorship curve?", options:[
          { t:"Atlantic cod, which releases millions of eggs and gives no care", ok:true, why:"Huge early losses." },
          { t:"Humans", why:"Most people survive to old age: type I." },
          { t:"Black bears", why:"Few cubs and long care: type I." },
          { t:"American robins", why:"A roughly constant risk at every age: type II." }] },
        b:{ prompt:"Which organism most likely has a type I survivorship curve?", options:[
          { t:"African elephants, which raise one calf at a time for years", ok:true, why:"Most survive to old age." },
          { t:"Sugar maple seeds", why:"Almost all die young: type III." },
          { t:"Oysters", why:"Type III. " + M8 },
          { t:"American robins", why:"Type II." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Which is a density-independent limiting factor?", options:[
          { t:"An early autumn blizzard", ok:true, why:"It kills the same fraction however crowded the population is." },
          { t:"A disease spreading through a crowded herd", why:M6 },
          { t:"Competition for nest sites", why:M6 },
          { t:"Predators catching more prey when prey are common", why:M6 }] },
        b:{ prompt:"Which is a density-dependent limiting factor?", options:[
          { t:"Parasites spreading faster in a crowded colony", ok:true, why:"Crowding helps transmission." },
          { t:"A summer drought", why:M6 },
          { t:"A forest fire", why:M6 },
          { t:"A volcanic eruption", why:M6 }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"A population grows logistically with `K` = 1200 and `r` = 0.5. At what size does it add the most individuals per year, and how many?", options:[
          { t:"`N` = 600; 150 per year", ok:true, why:"0.5 × 600 × 600/1200 = 150." },
          { t:"`N` = 1200; 600 per year", why:"At `K` the gain is 0." },
          { t:"`N` = 600; 300 per year", why:"That’s `rN`; it leaves out (`K − N`)/`K` = 1/2." },
          { t:"`N` = 300; 112.5 per year", why:"That’s the gain at 300; it’s larger at 600." }] },
        b:{ prompt:"`K` = 800, `r` = 0.4. At what size is the gain largest, and how many?", options:[
          { t:"`N` = 400; 80 per year", ok:true, why:"0.4 × 400 × 400/800 = 80." },
          { t:"`N` = 800; 320 per year", why:M1 },
          { t:"`N` = 400; 160 per year", why:"`rN` without the crowding factor." },
          { t:"`N` = 200; 60 per year", why:"Growth is smaller before the halfway point." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"A lake’s loon population is 200. In one year 30 chicks join it, 18 loons die, 6 arrive and 8 leave. Assuming `r` stays the same, what is `r`, and about how many loons will there be 2 years later?", options:[
          { t:"`r` = 0.05; about 221", ok:true, why:"(30 + 6 − 18 − 8)/200 = 0.05; 200 × 1.05 × 1.05 = 220.5." },
          { t:"`r` = 0.05; exactly 220", why:"That adds 10 each year; the second year adds 10.5." },
          { t:"`r` = 0.06; about 225", why:"That leaves out migration." },
          { t:"`r` = 0.31; about 343", why:"Deaths and departures subtract." }] },
        b:{ prompt:"A heron colony of 400 has 60 young join, 32 die, 4 arrive and 12 leave in a year. With the same `r`, what is `r`, and about how many herons will there be 2 years later?", options:[
          { t:"`r` = 0.05; about 441", ok:true, why:"(60 + 4 − 32 − 12)/400 = 0.05; 400 × 1.05² = 441." },
          { t:"`r` = 0.05; 440", why:M4 },
          { t:"`r` = 0.07; about 458", why:M3 },
          { t:"`r` = 0.27; about 645", why:"Deaths and departures subtract." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Biologists mark 60 bats with paint, but some paint wears off before the second capture. They catch 50 bats and see paint on 6, so they estimate 60 × 50 ÷ 6 = 500. How does the true population compare with 500?", options:[
          { t:"It’s smaller than 500: lost marks make `m` too small, so the estimate is too big", ok:true, why:M5 },
          { t:"It’s larger than 500, because fewer marks were seen", why:"Fewer recaptures inflate the estimate." },
          { t:"It’s exactly 500: the formula accounts for lost marks", why:"The formula assumes marks stay on." },
          { t:"It can’t be compared, because the formula no longer applies", why:"You can still say which way the error goes." }] },
        b:{ prompt:"40 hares are marked, but marked hares become trap-shy. A second sample of 30 includes 4 marked hares, giving 40 × 30 ÷ 4 = 300. How does the true population compare with 300?", options:[
          { t:"It’s smaller than 300: trap-shy hares make `m` too small, so the estimate is too big", ok:true, why:M5 },
          { t:"It’s larger than 300", why:M5 },
          { t:"It’s exactly 300", why:"Trap-shyness breaks an assumption." },
          { t:"It can’t be compared", why:"The direction of the error can be reasoned out." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which is the best explanation of why logistic growth levels off at carrying capacity?", options:[
          { t:"“As `N` nears `K`, each individual gets fewer resources, so births per individual fall and deaths rise until they’re equal; the population then stays near `K`.”", ok:true, why:"It names the cause (fewer resources each), what changes (births and deaths per individual) and the balance at `K`." },
          { t:"“Individuals stop reproducing once the population reaches `K`.”", why:M7 },
          { t:"“`K` is the most young a female can produce in her lifetime.”", why:"`K` is a property of the habitat, not of one animal." },
          { t:"“The growth rate `r` drops to zero because the animals get older.”", why:"Ageing isn’t the cause; crowding is." }] },
        b:{ prompt:"Which is the best explanation of why an exponentially growing population adds more individuals each year even though `r` stays the same?", options:[
          { t:"“Each year’s gain is a fixed fraction of the current size, and the new individuals also reproduce, so the same fraction of a bigger number is bigger.”", ok:true, why:"It ties the growing gain to the growing population, with `r` fixed." },
          { t:"“`r` increases every year.”", why:M4 },
          { t:"“The birth rate rises because the animals get more food each year.”", why:"`r` is constant in this model." },
          { t:"“Deaths stop when the population is growing.”", why:"Deaths still happen; `r` is a net rate." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Choose the words that best complete: ‘In winter, moose gather where willow browse is dense, leaving other areas empty. This is a ____ distribution, most likely caused by ____.’", options:[
          { t:"clumped; patchy food", ok:true, why:"The moose gather where the food is." },
          { t:"uniform; patchy food", why:"Uniform means evenly spaced." },
          { t:"random; patchy food", why:"Random means no pattern; this one follows the food." },
          { t:"clumped; animals spacing themselves apart", why:"Spacing apart produces a uniform pattern." }] },
        b:{ prompt:"‘Male red-winged blackbirds defend territories of similar size along a marsh edge. This is a ____ distribution, most likely caused by ____.’", options:[
          { t:"uniform; territorial behaviour", ok:true, why:"Defended territories of similar size space the birds evenly." },
          { t:"clumped; territorial behaviour", why:"Territories push birds apart, not together." },
          { t:"random; territorial behaviour", why:"Defending territories creates a pattern." },
          { t:"uniform; patchy food", why:"Patchy food would clump them." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"Zebra mussels in a lake grow about 35% per year. By the rule of 70, about how long does the population take to double, and about how many times larger is it after 8 years?", options:[
          { t:"About 2 years; about 16 times", ok:true, why:"70 ÷ 35 = 2; 8 years = 4 doublings = 2 × 2 × 2 × 2." },
          { t:"About 2 years; about 8 times", why:"4 doublings multiply by 2 four times." },
          { t:"About 200 years; barely larger", why:"Use 35, not 0.35." },
          { t:"About 2 years; about 4 times", why:"That counts the doublings instead of multiplying." }] },
        b:{ prompt:"An invasive fish grows about 10% per year. About how long does it take to double, and how many times larger is it after 21 years?", options:[
          { t:"About 7 years; about 8 times", ok:true, why:"70 ÷ 10 = 7; 21 years = 3 doublings = 2³." },
          { t:"About 7 years; about 6 times", why:"3 doublings multiply by 2 three times. " + M4 },
          { t:"About 700 years; barely larger", why:"Use 10, not 0.10." },
          { t:"About 7 years; about 3 times", why:"That counts doublings." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"A lake trout population grows logistically with `K` = 6000 and `r` = 0.4. Managers want the largest catch they can take every year forever, taking exactly what the population adds each year. At what population should they hold the stock, and how many fish per year can they take?", options:[
          { t:"3000 fish; 600 per year", ok:true, why:"The gain is largest at `K/2`: 0.4 × 3000 × 3000/6000 = 600." },
          { t:"6000 fish; 2400 per year", why:"At `K` the population adds nothing." },
          { t:"3000 fish; 1200 per year", why:"That’s `rN` without the crowding factor." },
          { t:"1500 fish; 450 per year", why:"A smaller stock adds less: 0.4 × 1500 × 4500/6000 = 450." }] },
        b:{ prompt:"A whitefish population has `K` = 9000 and `r` = 0.2. At what size should it be held for the largest sustainable catch, and how big is that catch?", options:[
          { t:"4500 fish; 450 per year", ok:true, why:"0.2 × 4500 × 4500/9000." },
          { t:"9000 fish; 1800 per year", why:M1 },
          { t:"4500 fish; 900 per year", why:"`rN` without crowding." },
          { t:"3000 fish; 400 per year", why:"0.2 × 3000 × 6000/9000 = 400: less than at 4500." }] } }
    ]
  },
  task:{
    title:"Plan a reintroduction", summary:"Plan a reintroduction",
    // VERIFY: the one-line note on the real swift fox reintroduction (Canadian prairies, releases from 1983) before release (plan §6 risk 2).
    statement:"<p>Swift foxes are being returned to a prairie reserve (model numbers). Choose how many to release, the support plan (which sets the growth rate) and the release site (which sets the carrying capacity) so the plan meets every condition. Can you find all the plans that work?</p>" +
      '<ol class="po-conds"><li>Release no more than 30 foxes (budget).</li><li>The population gains at least 15 foxes in year 1.</li><li>There are at least 200 foxes by year 5.</li><li>The site’s carrying capacity is 400 or less (larger sites overlap ranchland).</li></ol>' +
      '<p class="tiny muted">The growth rates and capacities here are invented. Real swift fox reintroductions on the Canadian prairies began in the 1980s.</p>',
    inputs:{ n0:"Foxes released", r:"Support plan", K:"Release site" },
    plans:["Plan 1", "Plan 2", "Plan 3", "Plan 4", "Plan 5"], sites:["Site A", "Site B", "Site C", "Site D", "Site E"],
    modelNote:"Logistic model, yearly steps: `N_{t+1} = N_t + rN_t(K - N_t)/K`.",
    checks:["Release at most 30", "Year-1 gain at least 15", "At least 200 by year 5", "Site `K` ≤ 400"],
    tips:["Your budget covers 30 foxes at most.", "The first-year gain is `rN_0(K - N_0)/K`. A faster growth rate or more founders raises it.", "`N` can never pass `K`, so a site with `K` = 200 can’t reach 200 by year 5. Pick a larger site or a faster rate.", "Sites with `K` above 400 aren’t available."],
    success:"Your plan works!",
    explainPrompt:"Explain how you balanced the number released against the growth rate, and why the site’s carrying capacity matters even in the first five years.",
    vocab:"Use the words carrying capacity, per-capita growth rate, logistic and founders.",
    after3:"Notice the trade-off: with fewer founders you need a faster growth rate. Every plan needs `K` of at least 300, because a population can’t pass its carrying capacity."
  },
  cards:[
    ["Population density", "Number of individuals ÷ area. 900 in 2 ha = 450 per ha."],
    ["Four ways a population changes", "Births and immigration add; deaths and emigration remove."],
    ["Per-capita growth rate `r`", "(births + immigrants − deaths − emigrants) ÷ `N`."],
    ["Exponential growth", "Constant `r`; each year adds more than the last; J-curve."],
    ["Logistic growth", "Gain = `rN(K - N)/K`; S-curve; fastest at `K/2`; zero at `K`."],
    ["Carrying capacity `K`", "The largest population a habitat can support over time; births = deaths there."],
    ["Rule of 70", "Doubling time ≈ 70 ÷ (growth rate in %). 7% per year → 10 years."],
    ["Density-dependent factors", "Hit harder when crowded: competition, predation, disease, parasites."],
    ["Density-independent factors", "Don’t depend on crowding: frost, flood, fire, drought."],
    ["Mark–recapture", "`N = (M × n) ÷ m`. Assumes marks stay, mixing is random, no births, deaths or migration in between."],
    ["Survivorship curves", "I: most reach old age (humans). II: constant risk (robins). III: huge early losses (cod)."],
    ["r- vs K-selected", "r: many young, little care, early breeding. K: few young, much care, late breeding, near `K`."]
  ]
};
