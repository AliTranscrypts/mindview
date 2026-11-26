// SBI4U 45 Ecological Succession. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/45-ecological-succession.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M6 but gives no feedback of its own.
const M1 = "If soil is still there, it’s secondary succession: no rock has to be broken down first.";
const M2 = "Trees need deep soil. On bare rock, lichens and mosses come first and start making soil.";
const M3 = "Late-successional forests still change: fire, insects, storms and climate reset or reshape them.";
const M4 = "Richness often peaks mid-way, when early and late species overlap; shade then crowds out the sun-lovers.";
const M5 = "Some species need disturbance: jack pine cones open in the heat of a fire.";
const M6 = "Seasons repeat every year; succession is a one-way change over decades or centuries.";

// N5 ordering: the toolkit matches a named wrong order as a PREFIX of the student's order, so "step b placed before step a"
// is listed as every prefix that ends in b and doesn't contain a (first match wins).
function before(n, b, a, fb){
  const rest = [];
  for (let i = 0; i < n; i++) if (i !== a && i !== b) rest.push(i);
  const out = [];
  (function walk(pre){
    out.push({ order:pre.concat([b]), fb:fb });
    if (pre.length >= rest.length) return;
    rest.forEach(function(x){ if (pre.indexOf(x) < 0) walk(pre.concat([x])); });
  })([]);
  return out;
}

// Explore model (plan tables; "model values based on typical Ontario sites")
// rows: [year, stage, soil cm, plant species per 100 m², biomass t/ha, light % of full sun]
const ROCK = [
  [0, "Bare rock", 0, 0, 0, 100], [25, "Lichens", 0.5, 3, 0.5, 100], [50, "Lichens and mosses", 1, 6, 1, 100],
  [75, "Mosses and ferns", 1.5, 10, 2, 95], [100, "Grasses and herbs", 2, 18, 5, 90], [125, "Grasses and herbs", 3, 22, 7, 88],
  [150, "Grasses and herbs", 4, 25, 10, 85], [175, "Grasses with shrubs", 5, 29, 20, 70], [200, "Shrubs", 6, 32, 30, 60],
  [225, "Shrubs", 7.5, 35, 45, 50], [250, "Shrubs and pioneer trees", 9, 38, 60, 40],
  [275, "Pioneer trees (birch, aspen, jack pine)", 10.5, 40, 80, 30], [300, "Pioneer trees", 12, 40, 100, 25],
  [325, "Mixed forest", 14, 38, 125, 20], [350, "Mixed forest", 16, 36, 150, 15], [375, "Mixed forest", 18, 34, 175, 12],
  [400, "Mixed forest", 20, 32, 200, 10], [425, "Late-successional forest (sugar maple, eastern hemlock)", 21.5, 31, 220, 7],
  [450, "Late-successional forest", 23, 30, 240, 5], [475, "Late-successional forest", 24, 30, 245, 5], [500, "Late-successional forest", 25, 30, 250, 5]
];
const FIELD = [
  [0, "Ploughed field", 30, 2, 0.5, 100], [10, "Weeds and grasses", 30, 25, 5, 95], [20, "Shrubs (dogwood, sumac) among grasses", 31, 35, 20, 70],
  [30, "Shrubs and pioneer trees (white pine, trembling aspen)", 31, 42, 45, 45], [40, "Pioneer trees", 32, 45, 80, 30],
  [50, "Young mixed forest", 32, 44, 110, 20], [60, "Mixed forest", 33, 42, 140, 15], [70, "Mixed forest", 33, 40, 160, 12],
  [80, "Hardwoods moving in (sugar maple, beech)", 34, 38, 180, 10], [90, "Hardwoods moving in", 34, 36, 195, 8],
  [100, "Late-successional hardwood forest", 35, 35, 210, 6], [110, "Late-successional hardwood forest", 35, 34, 220, 5],
  [120, "Late-successional hardwood forest", 35, 33, 228, 5], [130, "Late-successional hardwood forest", 36, 33, 235, 5],
  [140, "Late-successional hardwood forest", 36, 32, 240, 5], [150, "Late-successional hardwood forest", 36, 32, 245, 5]
];

export default {
  id:"45-ecological-succession",
  kind:"topic",
  title:"Ecological succession",
  topic:"Ecological Succession",
  readyTopic:"ecological succession",
  hero:{
    eq:"bare rock → lichens and mosses → grasses → shrubs → forest",
    eqLabel:"bare rock, then lichens and mosses, then grasses, then shrubs, then forest",
    eqSize:"sm",
    headline:"From bare rock to forest, one step at a time",
    text:"When a glacier retreats or a fire sweeps through, life doesn’t return all at once. <strong>Pioneer species</strong> move in first and change the place, and each wave of species makes room for the next. This slow, directional change is <strong>succession</strong>. You’ll speed it up in a time-lapse, then see how fire and people reset it.",
    fig:{ html:'<div class="es-hero" id="es-hero" role="img" aria-label="A strip of five panels, left to right: bare grey rock, lichens and mosses, grasses, shrubs, then forest, with a brown soil layer underneath that thickens from left to right. A year counter runs from 0 to 500. At the end a fire icon flashes over the forest and the last panel jumps back to grasses, labelled secondary succession."></div>' }
  },
  goals:[
    "I can tell primary succession from secondary succession and give an example of each.",
    "I can explain how pioneer species change conditions so that later species can establish.",
    "I can predict how soil depth, biomass, light and species richness change during succession.",
    "I can explain how disturbances such as fire and clear-cutting reset succession, and how recovery can be helped.",
    "I can interpret data that show a community changing over time."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Plant needs", goal:2,
          prompt:"Which does a young sugar maple seedling need that bare rock can’t give it?",
          options:[
            { t:"Soil to hold its roots, water and nutrients", ok:true, why:"Rock has no soil." },
            { t:"Sunlight", why:"Bare rock gets plenty of sun." },
            { t:"Carbon dioxide", why:"Air is available everywhere." },
            { t:"Nothing; maples can grow on rock", why:"Maples need deep soil." }],
          hints:["What does a root grow into?", "Soil.", "Bare rock has none."] },
        { id:"w2", skill:"Plant needs", goal:3,
          prompt:"Shade-tolerant trees are best described as trees that…",
          options:[
            { t:"can grow slowly in the low light under a forest canopy", ok:true, why:"They can put up with shade." },
            { t:"need full sunlight to grow at all", why:"That’s shade-intolerant." },
            { t:"grow only in deserts", why:"Tolerance is about light, not dryness." },
            { t:"never grow tall", why:"Many become canopy giants." }],
          hints:["‘Tolerant’ means able to put up with something.", "With shade.", "They grow in low light."] },
        { id:"w3", skill:"Soil", goal:2,
          prompt:"Soil is mainly made of…",
          options:[
            { t:"weathered rock particles mixed with decaying organic matter, water and air", ok:true, why:"Two sources, rock and living things, plus water and air." },
            { t:"only sand", why:"Sand is just one particle size." },
            { t:"only dead leaves", why:"Organic matter is one part of soil." },
            { t:"melted rock", why:"That’s lava." }],
          hints:["Think about two sources: rock and living things.", "Rock breaks into particles; dead material decays.", "Both, plus water and air."] },
        { id:"w4", skill:"Soil", goal:2,
          prompt:"Lichens release weak acids onto rock. What does this do over time?",
          options:[
            { t:"Helps break the rock surface into small particles, the start of soil", ok:true, why:"The acids slowly dissolve and loosen the rock." },
            { t:"Makes the rock harder", why:"Acids weaken rock." },
            { t:"Kills all other plants", why:"The acids are weak and local." },
            { t:"Turns the rock into sand in one year", why:"It takes decades or centuries." }],
          hints:["What do acids do to rock?", "They slowly dissolve and loosen it.", "That starts soil."] },
        { id:"w5", skill:"Reading graphs", goal:5,
          prompt:"A graph of ‘soil depth’ against ‘years’ rises steadily. What does that tell you?",
          options:[
            { t:"Soil gets deeper over time", ok:true, why:"Years across, depth up: depth increases with time." },
            { t:"Soil gets thinner over time", why:"A rising line means increasing." },
            { t:"Years get shorter", why:"Time is the horizontal axis." },
            { t:"Nothing; the line just goes up", why:"Read the axis labels." }],
          hints:["What is on each axis?", "Years across, depth up.", "Depth increases with time."] },
        { id:"w6", skill:"Reading graphs", goal:3,
          prompt:"A curve rises to a high point at year 40, then slowly falls. At which year is the value highest?",
          options:[
            { t:"Year 40", ok:true, why:"The top of the curve is above year 40." },
            { t:"Year 0", why:"That’s the start." },
            { t:"The last year shown", why:"The curve falls after 40." },
            { t:"It’s equally high at every year", why:"A curve with a peak isn’t flat." }],
          hints:["Find the top of the curve.", "It’s above year 40.", "Year 40."] }
      ],
      refreshers:{
        "Plant needs":"Plants need light, water, carbon dioxide, nutrients and something to root into. Shade-tolerant species can grow in dim light; shade-intolerant (sun-loving) species can’t.",
        "Soil":"Soil forms as rock weathers into particles and dead organisms decay into organic matter. On bare rock it takes centuries to build even a few centimetres.",
        "Reading graphs":"Check the axes first. A rising line means the quantity increases with time; a peak is the highest point."
      }
    }
  },
  explore:{
    heading:"Succession time-lapse",
    intro:"Choose a starting point and drag the years. Watch which plants dominate, and watch the readouts change underneath them.",
    starts:[["rock", "Bare rock (primary)"], ["field", "Abandoned field (secondary)"], ["fire", "Fire cycle (boreal)"]],
    model:{ rock:ROCK, field:FIELD },
    graphs:[["Soil depth", "cm"], ["Plant species", "per 100 m²"], ["Biomass", "t/ha"], ["Light at ground", "% of full sun"]],
    fire:{
      rules:"Jack pine’s cones stay sealed with resin until a fire’s heat opens them. In the model, a stand needs about 20 years to store enough seed in its cones, and without fire shade-tolerant black spruce and balsam fir replace jack pine after about 90 years.",
      outcomes:{
        fail:"Pine fails: the fire returns before young trees have stored seed. Shrubs and grasses take over.",
        stay:"Jack pine regenerates after each fire and stays dominant.",
        fade:"Spruce and fir take over between fires; jack pine fades."
      },
      short:{ fail:"Pine fails; shrubs and grasses take over", stay:"Jack pine regenerates and stays dominant", fade:"Spruce and fir take over; jack pine fades" },
      bands:{ pine:"Jack pine", spruce:"Spruce and fir", shrub:"Shrubs and grasses" }
    },
    modelNote:"Model values based on typical Ontario sites. Real sites vary widely: soil depths, species counts and the jack pine rules are simplified.",
    aha:"Secondary succession is far faster because the soil is already there; pioneers make the place suitable for others; richness peaks mid-way; disturbance can keep a community in an early stage, and some species depend on it.",
    predIntro:"Make a prediction first. Then the time-lapse will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"rock", yr:0 }, both:true,
        prompt:"<span class=\"muted\">Both tables side by side.</span> Which reaches a forest of pioneer trees sooner: bare rock or an abandoned field?",
        reveal:"Pioneer trees: the field at year 30–40, the rock at year 275.",
        options:[{ t:"The abandoned field", ok:true }, { t:"The bare rock" }, { t:"Both take the same time" }, { t:"Neither ever becomes forest" }],
        explain:"The field starts with 30 cm of soil plus buried seeds and roots. On rock, soil takes centuries to form." },
      { id:"p2", start:{ mode:"rock", yr:0 }, to:25,
        prompt:"<span class=\"muted\">Bare rock, year 0.</span> What will grow first on the bare rock?",
        reveal:"Lichen patches appear at year 25.",
        options:[{ t:"Lichens", ok:true }, { t:"Grasses" }, { t:"Birch trees" }, { t:"Shrubs" }],
        explain:"Lichens need no soil. They cling to rock and start breaking it down." },
      { id:"p3", start:{ mode:"field", yr:0 }, to:150, glow:1,
        prompt:"<span class=\"muted\">Abandoned field.</span> How will the number of plant species change over 150 years?",
        reveal:"The species graph peaks at 45 at year 40, then settles at 32.",
        options:[{ t:"Rise quickly, peak, then fall a little", ok:true }, { t:"Rise steadily all the way" }, { t:"Fall from the start" }, { t:"Stay the same" }],
        explain:"At mid-succession, sun-lovers and shade-tolerant species overlap. Later, the shade crowds out the sun-lovers." },
      { id:"p4", start:{ mode:"field", yr:0 }, to:150, glow:3,
        prompt:"<span class=\"muted\">Abandoned field.</span> What happens to the light reaching the ground as the forest grows?",
        reveal:"Light drops from 100% to 5%.",
        options:[{ t:"It falls", ok:true }, { t:"It rises" }, { t:"It stays at 100%" }, { t:"It rises, then falls" }],
        explain:"A closing canopy intercepts most of the sunlight." }
    ],
    chalIntro:"Use the time-lapse to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3, 5], prompt:"Bare rock: set the year when the soil first reaches 2 cm, deep enough for grasses.",
        why:"Year 100: the soil passes 1.5 cm at year 75 and first reaches 2 cm at year 100.",
        wrong:{ mode:"Choose <strong>Bare rock (primary)</strong> first.", y75:"Not deep enough yet.", late:"Soil reached 2 cm earlier; find the first year." },
        hints:["Watch the soil readout.", "It passes 1.5 cm at year 75.", "Year 100."] },
      { id:"tc2", goal:[3, 5], prompt:"Abandoned field: set the year when the number of plant species is highest.",
        why:"Year 40, with 45 species: sun-lovers and shade-tolerant species overlap there.",
        wrong:{ mode:"Choose <strong>Abandoned field (secondary)</strong> first.", end:"Richness doesn’t keep rising; it peaks earlier.", near:"Close, but not the peak.", other:"That isn’t the highest species count yet. Drag and watch the species readout." },
        hints:["Watch the species readout as you drag.", "It rises fast, then starts to fall.", "Year 40, with 45 species."] },
      { id:"tc3", goal:4, stretch:true,
        prompt:"Fire cycle: choose a fire interval that keeps <strong>jack pine dominant</strong> and also lets each stand reach <strong>at least 60 years old</strong> for timber before it burns.",
        why:"Accepted answers: 60, 70, 80 or 90 years. Jack pine stays dominant from 20 to 90 years, and timber needs at least 60.",
        wrong:{ mode:"Choose <strong>Fire cycle (boreal)</strong> first.", i10:"The fire comes back before the young pines have stored seed.", young:"Jack pine survives, but the stands burn before they’re 60 years old.", old:"Spruce and fir take over before the fire returns." },
        hints:["Two rules: jack pine stays dominant between 20 and 90 years; timber needs at least 60.", "Which intervals pass both?", "60, 70, 80 or 90 years."] }
    ]
  },
  part3:{
    slug:"recovery", name:"Recovery",
    heading:"Disturbance and recovery",
    intro:"Succession on real Canadian land: how fire restarts a boreal forest, how people helped Sudbury’s damaged hills recover, and how a fire differs from a clear-cut. Each station has a <strong>Check it with data</strong> panel; its values are illustrative.",
    cone:{
      title:"Station 1: fire and jack pine",
      how:"A jack pine cone stays sealed with resin. Press <strong>Heat the cone</strong> to see what a fire does.",
      heat:"Heat the cone", reset:"Cool it again",
      closed:"Closed: resin seals the scales shut.",
      open:"Open: a fire’s heat (around 50 °C and above) melts the resin, the scales open and seeds fall onto the freshly burned, sunny ground.",
      panel:"Check it with data",
      head:["Stand", "Pine seedlings per hectare, 3 years later"],
      rows:[["3 years after a fire", "8000"], ["Unburned stand", "100"]],
      caption:"For jack pine, fire isn’t only a disaster; it’s how the next generation starts."
    },
    sudbury:{
      title:"Station 2: the regreening of Sudbury",
      tag:"STSE",
      damage:"<strong>The damage:</strong> a century of smelting released sulfur dioxide and metal dust. Plants died, acidic soils washed away, and hills of blackened bare rock remained.",
      // VERIFY: programme start ("late 1970s") and "millions of trees" against the City of Greater Sudbury regreening sources before release (plan §6.2).
      recovery:"<strong>The recovery:</strong> since the late 1970s, workers and volunteers have spread crushed limestone to neutralize the soil, then fertilizer and grass and legume seed, then planted millions of trees.",
      panel:"Check it with data",
      head:["Measurement", "Before treatment", "After treatment"],
      // VERIFY: illustrative pH and cover values (plan §6.2).
      rows:[["Soil pH", "4.0 (before liming)", "6.0 (after liming)"], ["Plant cover", "5%", "70% (after 10 years)"]],
      q:"Which kind of succession did the regreening speed up, and how?",
      show:"Show the answer",
      a:"Secondary-like succession: by fixing the soil, the treatment skipped centuries of soil building."
    },
    compare:{
      title:"Station 3: fire vs clear-cut",
      cols:[
        { h:"Fire", items:["Leaves standing dead trees and ash rich in nutrients.", "Opens jack pine cones.", "Burns some seeds and soil organic matter."] },
        { h:"Clear-cut", items:["Removes the trunks and their nutrients.", "Leaves no heat to open cones (so jack pine may need replanting).", "Machinery can compact soil."] }
      ],
      both:"<strong>Both</strong> start secondary succession."
    },
    quickCheck:{
      title:"Quick check", summary:"Disturbance and recovery quick check",
      items:[
        { id:"q1", goal:4, prompt:"Why is jack pine called fire-adapted?",
          choices:[
            { t:"Its cones open in fire’s heat", ok:true, fb:"Right. Fire releases the stored seed onto open, sunny ground." },
            { t:"It can’t burn", fb:"Fire releases the stored seed onto open, sunny ground." },
            { t:"It grows only after floods", fb:"Fire releases the stored seed onto open, sunny ground." },
            { t:"Its seeds need shade", fb:"Fire releases the stored seed onto open, sunny ground." }] },
        { id:"q2", goal:4, prompt:"What did crushed limestone do for Sudbury’s soils?",
          choices:[
            { t:"Raised the pH (less acidic)", ok:true, fb:"Right. Limestone neutralizes acid." },
            { t:"Added nitrogen", fb:"Limestone neutralizes acid." },
            { t:"Made the soil more acidic", fb:"Limestone neutralizes acid." },
            { t:"Removed all metals", fb:"Limestone neutralizes acid." }] },
        { id:"q3", goal:1, prompt:"After a clear-cut, which kind of succession begins?",
          choices:[
            { t:"Secondary", ok:true, fb:"Right. Soil remains, so it’s secondary." },
            { t:"Primary", fb:"Soil remains, so it’s secondary." },
            { t:"None", fb:"Soil remains, so it’s secondary." },
            { t:"Seasonal", fb:"Soil remains, so it’s secondary." }] },
        { id:"q4", goal:1, prompt:"Leaves turning colour every autumn is…",
          choices:[
            { t:"a seasonal change, not succession", ok:true, fb:"Right. Seasons repeat every year; succession is one-way over decades." },
            { t:"primary succession", fb:"Seasons repeat every year; succession is one-way over decades." },
            { t:"secondary succession", fb:"Seasons repeat every year; succession is one-way over decades." },
            { t:"a climax community", fb:"Seasons repeat every year; succession is one-way over decades." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"order", type:"order", title:"Put the stages in order", summary:"Stage ordering", goal:[1, 2],
        instruction:"Put each succession in order, from the first stage to the last.",
        sequences:[
          { id:"s1", goal:[1, 2], prompt:"On rock left by a retreating glacier",
            steps:["Bare rock", "Lichens", "Mosses", "Grasses and herbs", "Shrubs", "Trees"],
            wrong:before(6, 3, 1, "Grasses need soil, which lichens and mosses start."),
            general:"Ask what each stage needs: how much soil, and how much light.",
            why:"Each stage builds soil for the next: lichens start it, mosses add to it, and grasses, shrubs and trees need more and more." },
          { id:"s2", goal:[1, 2], prompt:"After a boreal forest fire",
            steps:["Burned ground with soil", "Fireweed and grasses", "Shrubs with aspen and birch seedlings", "Jack pine and aspen stand", "Spruce and fir forest"],
            wrong:before(5, 4, 3, "Spruce and fir are shade-tolerant; they grow up under the pioneers."),
            general:"Soil survives a fire, so the rock-breaking stage is skipped. Ask what can grow fastest on open ground.",
            why:"Soil and seeds survive the fire, so fast-growing plants come first, then pioneer trees, then shade-tolerant spruce and fir.",
            hints:["What is left after a fire?", "Soil and seeds, so fast-growing plants come first.", "Fireweed and grasses → shrubs and seedlings → pioneer trees → spruce and fir."] }
        ] },
      { id:"glacier", type:"custom", title:"Glacier data detective", summary:"Glacier data detective", star:true, goal:[3, 5],
        instruction:"Use the glacier sites to read change over time. D4 and D5 go beyond the Final Check.",
        how:"Tap a chip, or type a number and press Check.",
        context:"A glacier has been melting back for 300 years. Sites farther from the ice have been ice-free longer, so distance stands in for time (a <strong>space-for-time</strong> study).",
        head:["Site", "Years since the ice left", "Soil depth (cm)", "Plant species"],
        rows:[["A", "10", "0.2", "2"], ["B", "50", "1", "8"], ["C", "100", "3", "20"], ["D", "200", "8", "35"], ["E", "300", "14", "30"]],
        items:[
          { id:"d1", goal:5, kind:"chips", prompt:"Which site is closest to the glacier today?",
            chips:[
              { t:"A", ok:true, fb:"Site A has been ice-free for only 10 years, so the ice left it most recently." },
              { t:"B", fb:"B has been ice-free for 50 years. Find the site the ice left most recently." },
              { t:"C", fb:"C has been ice-free for 100 years. Find the site the ice left most recently." },
              { t:"D", fb:"D has been ice-free for 200 years. Find the site the ice left most recently." },
              { t:"E", fb:"E has been ice-free longest, so it’s farthest away." }] },
          { id:"d2", goal:5, kind:"chips", prompt:"<span class=\"tag\">Investigation</span> Why can these sites stand in for one place over 300 years?",
            chips:[
              { t:"They share climate and rock, and differ mainly in time since the ice left", ok:true, fb:"Space-for-time works only if the sites are alike except for their age." },
              { t:"They are all the same age", fb:"Space-for-time works only if the sites are alike except for their age." },
              { t:"They have the same plants", fb:"Space-for-time works only if the sites are alike except for their age." },
              { t:"Glaciers make soil", fb:"Space-for-time works only if the sites are alike except for their age." }] },
          { id:"d3", goal:[3, 5], kind:"num", prompt:"Average rate of soil building between sites C and D, in cm per year?",
            answer:0.05, unit:"cm per year", display:"0.05 cm per year",
            why:"(8 − 3) ÷ (200 − 100) = 5 ÷ 100 = 0.05 cm per year.",
            wrong:[{ match:5, fb:"That’s the total change; divide by 100 years." }],
            hints:["Change in soil ÷ change in time.", "(8 − 3) ÷ (200 − 100).", "0.05 cm per year."] },
          { id:"d4", goal:[3, 5], star:true, kind:"chips", prompt:"Which site has the most plant species, and what pattern does that show?",
            chips:[
              { t:"D; richness peaks mid-succession", ok:true, fb:"D has 35 species; E, older, has fewer. " + M4 },
              { t:"E; richness keeps rising", fb:"E has fewer species than D: shade is crowding out the sun-lovers." },
              { t:"A; pioneers are the most diverse", fb:"A has only 2 species. E has fewer species than D: shade is crowding out the sun-lovers." },
              { t:"C; richness peaks early", fb:"C has 20 species, D has 35. E has fewer species than D: shade is crowding out the sun-lovers." }] },
          { id:"d5", goal:[3, 5], star:true, kind:"chips", prompt:"Predict the species count at a 400-year site.",
            chips:[
              { t:"About 30 or slightly fewer", ok:true, fb:"The count is already falling from D to E; late-successional forests settle at a lower number." },
              { t:"About 45", fb:"The count is already falling from D to E; late-successional forests settle at a lower number." },
              { t:"0", fb:"The count is already falling from D to E; late-successional forests settle at a lower number." },
              { t:"About 100", fb:"The count is already falling from D to E; late-successional forests settle at a lower number." }],
            hints:["What happened between D and E?", "Richness fell from 35 to 30.", "It levels off near 30."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Bronwyn", goal:[1, 3], how:"",
        instruction:"Bronwyn made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"A farmer stops ploughing a field. Describe what happens next.",
            steps:["The field still has soil, buried seeds and roots.", "So this is primary succession.", "Lichens must first break the rock down to make soil.", "A forest may take 500 years to appear."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows from step 2. The first mistake is earlier.", "Step 4 follows from the earlier mistake."],
            fixes:[
              { t:"Soil remains, so this is secondary succession: weeds and grasses appear within a year or two, and trees within decades.", ok:true, why:M1 },
              { t:"This is a climax community already.", why:"A ploughed field is an early stage." },
              { t:"Nothing will grow until seeds blow in from far away.", why:"Buried seeds and roots sprout quickly." },
              { t:"Step 2 is correct.", why:M1 }],
            hints:["What does primary succession start from?", "No soil at all.", "This field has soil: secondary."] },
          { id:"e2", goal:3, task:"Describe a late-successional (climax) forest.",
            steps:["After centuries, shade-tolerant trees such as sugar maple dominate.", "Their seedlings can grow in the parents’ shade, so the forest replaces itself.", "So the community will never change again.", "Disturbances can’t affect a climax forest."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 repeats the mistake in step 3."],
            fixes:[
              { t:"It is fairly stable, but fire, insects, storms, logging and climate change can still reset or reshape it.", ok:true, why:M3 },
              { t:"It changes every autumn, so it isn’t a climax.", why:"Seasonal change isn’t succession." },
              { t:"It will soon return to grassland on its own.", why:"Without disturbance, it persists." },
              { t:"Step 3 is correct.", why:M3 }],
            hints:["What could knock down a mature forest?", "Fire, wind, insects, people.", "So it can change."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the time-lapse: how slow primary succession is, or that species richness drops near the end?" },
      { id:"j2", q:"In your own words, how do pioneer species make room for the species that replace them?" },
      { id:"j3", q:"Explain to a friend why some forests need fire." },
      { id:"j4", q:"What is still unclear about succession? What will you look at again?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which situation begins primary succession?", options:[
          { t:"Bare rock exposed by a retreating glacier", ok:true, why:"There’s no soil at all." },
          { t:"A forest after a fire", why:"Soil survives a fire." },
          { t:"An abandoned farm field", why:"The field keeps its soil." },
          { t:"A woodlot after logging", why:"Logging leaves soil behind." }] },
        b:{ prompt:"Which situation begins secondary succession?", options:[
          { t:"A boreal forest after a fire", ok:true, why:"Soil and some seeds remain." },
          { t:"New rock from a lava flow", why:"No soil: primary." },
          { t:"Rock left by a retreating glacier", why:"No soil: primary." },
          { t:"A newly formed volcanic island", why:"No soil: primary." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which organisms are usually the pioneer species on bare rock?", options:[
          { t:"Lichens", ok:true, why:"They need no soil and start breaking down rock." },
          { t:"Sugar maples", why:"Maples need deep soil and come last." },
          { t:"Grasses", why:"Grasses need some soil first." },
          { t:"Shrubs", why:"Shrubs need soil too." }] },
        b:{ prompt:"What is the main way pioneer species help later species?", options:[
          { t:"They build soil by breaking down rock and adding dead organic matter", ok:true, why:"That soil holds the water and nutrients later species need." },
          { t:"They provide shade for sun-loving plants", why:"Sun-lovers need light, not shade." },
          { t:"They eat the later species’ competitors", why:"Pioneers here are plants and lichens." },
          { t:"They prevent any other species from arriving", why:"They make arrival possible." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"As a field turns into forest, what happens to the light reaching the ground?", options:[
          { t:"It decreases", ok:true, why:"The canopy intercepts it." },
          { t:"It increases", why:"Taller plants block more light." },
          { t:"It stays the same", why:"The canopy changes it." },
          { t:"It increases, then decreases", why:"It only falls as plants grow taller." }] },
        b:{ prompt:"As a field turns into forest, what happens to the total biomass?", options:[
          { t:"It increases", ok:true, why:"Trees store far more living material than grasses." },
          { t:"It decreases", why:"Forests hold more biomass than fields." },
          { t:"It stays the same", why:"Woody growth adds a lot." },
          { t:"It drops to zero at the climax", why:"A mature forest has its greatest biomass." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"In a field’s succession, the number of plant species peaks at about year 40 and then falls a little. Which is the best explanation?", options:[
          { t:"Around year 40, sun-loving early species and shade-tolerant later species grow together; later, shade crowds out the sun-lovers", ok:true, why:M4 },
          { t:"The soil wears out after year 40", why:"Soil keeps deepening." },
          { t:"All species die at year 40 and only a few return", why:"The change is gradual, not a die-off." },
          { t:"Richness actually keeps rising; the drop is a measuring error", why:M4 }] },
        b:{ prompt:"In late succession, biomass keeps rising while the number of species slowly falls. Which is the best explanation?", options:[
          { t:"A few large, shade-tolerant tree species dominate and store more and more wood, while their shade excludes many small sun-loving species", ok:true, why:"Biomass and richness can move in opposite directions: light is the key." },
          { t:"More species means more biomass, so the data must be wrong", why:"Biomass and richness can move in opposite directions." },
          { t:"Animals eat the small plants once the forest is old", why:"Light is the main cause." },
          { t:"Trees stop growing at the climax", why:"Trees keep adding wood." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"In a model boreal forest, jack pine needs about 20 years to store seed in its cones, and without fire spruce and fir replace it after about 90 years. If fires came every 10 years, what would most likely happen?", options:[
          { t:"Jack pine would fail to regenerate, and shrubs and grasses would take over", ok:true, why:"The trees burn before they’ve stored seed." },
          { t:"Jack pine would thrive, because fire opens its cones", why:"Only if there are seeds stored in the cones." },
          { t:"Spruce and fir would take over", why:"They need even longer without fire." },
          { t:"Nothing would change", why:"Fire every 10 years is a big change." }] },
        b:{ prompt:"Same model. If fires came only every 150 years, what would most likely happen?", options:[
          { t:"Spruce and fir would take over between fires, and jack pine would fade", ok:true, why:"After about 90 years without fire, jack pine is replaced." },
          { t:"Jack pine would stay dominant", why:"After about 90 years without fire it’s replaced." },
          { t:"Grasses would take over", why:"There’s plenty of time for trees." },
          { t:"Every stand would be primary succession", why:"Soil remains after these fires." }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"On bare rock, soil forms at about 0.05 cm per year. Grasses need 2 cm of soil and shrubs need 6 cm. About how many years pass between the soil being ready for grasses and being ready for shrubs?", options:[
          { t:"80 years", ok:true, why:"(6 − 2) ÷ 0.05 = 80." },
          { t:"120 years", why:"That’s the time to reach 6 cm from bare rock." },
          { t:"40 years", why:"Divide by 0.05, which is the same as multiplying by 20." },
          { t:"4 years", why:"4 cm is the difference in depth, not in years." }] },
        b:{ prompt:"Soil forms at about 0.04 cm per year. Grasses need 2 cm and trees need 10 cm. About how many years pass between the soil being ready for grasses and ready for trees?", options:[
          { t:"200 years", ok:true, why:"(10 − 2) ÷ 0.04 = 200." },
          { t:"250 years", why:"That’s from bare rock to 10 cm." },
          { t:"32 years", why:"8 ÷ 0.04 is 200, not 32." },
          { t:"8 years", why:"8 cm is the depth difference." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why lichens can colonize bare rock but sugar maples can’t?", options:[
          { t:"“Lichens need no soil: they cling to rock and get water from rain and minerals from the rock surface. Maples need deep soil for roots, water and nutrients, which takes centuries to form.”", ok:true, why:M2 },
          { t:"“Maples are too big to reach the rock.”", why:"Size isn’t the reason; soil is." },
          { t:"“Lichens are stronger than maples.”", why:"Both are well adapted to their own conditions." },
          { t:"“Maple seeds can’t fly.”", why:"Maple seeds are wind-dispersed; the problem is what they land on." }] },
        b:{ prompt:"Which is the best explanation of how early species make it possible for later species to grow?", options:[
          { t:"“As early species live and die, they add organic matter and help build soil that holds water and nutrients, so species that need richer soil can establish.”", ok:true, why:"Pioneers change the conditions; the changed conditions let later species move in." },
          { t:"“Early species leave because they’re tired of the place.”", why:"Plants don’t choose to leave; they’re out-competed." },
          { t:"“Later species eat the early species.”", why:"These are mostly plants changing the soil and light." },
          { t:"“Early species plant the seeds of later species.”", why:"Seeds arrive by wind and animals." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"A student wants to show how the number of plant species changed over 150 years in one field. Which representation is best?", options:[
          { t:"A line graph of species count against years", ok:true, why:"It shows change over time, including the peak." },
          { t:"A pie chart of the species present in year 150", why:"That shows one moment, not change." },
          { t:"A bar graph of soil depth", why:"That’s a different variable." },
          { t:"A list of species names", why:"Hard to see any trend." }] },
        b:{ prompt:"A student wants to compare soil depth at five glacier sites of different ages. Which representation is best?", options:[
          { t:"A graph of soil depth against years since the ice left, with one point per site", ok:true, why:"Age across, depth up: the trend shows at a glance." },
          { t:"A pie chart of soil depth", why:"Pie charts show parts of a whole." },
          { t:"A photo of one site", why:"One site shows no trend." },
          { t:"A table of species names", why:"That leaves out soil depth." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"Why did restoration crews in Sudbury spread crushed limestone before seeding?", options:[
          { t:"It neutralized the acidic soil so plants could grow", ok:true, why:"Limestone raises the pH." },
          { t:"It added nitrogen for the plants", why:"Limestone raises pH; legumes and fertilizer add nitrogen." },
          { t:"It made the ground harder so it wouldn’t erode", why:"Its job was chemical: lowering acidity." },
          { t:"It killed weeds", why:"It’s not a herbicide." }] },
        b:{ prompt:"Why did the Sudbury crews sow grasses and legumes before planting trees?", options:[
          { t:"They quickly cover and hold the soil, add organic matter, and legumes add nitrogen", ok:true, why:"Ground cover first, just as in natural succession." },
          { t:"Trees can’t grow next to grass", why:"Grass cover helps young trees in this case." },
          { t:"Grasses are the climax community", why:"They’re an early stage." },
          { t:"Legumes make the soil more acidic", why:"They add nitrogen; limestone handles acidity." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"Snow avalanches sweep down the same mountain slope every few years, snapping any tall trees. What community will that avalanche track most likely hold?", options:[
          { t:"An early-successional community of shrubs, grasses and young flexible trees", ok:true, why:"Frequent disturbance keeps resetting it." },
          { t:"A late-successional forest, because time passes anyway", why:"The avalanches keep knocking it back." },
          { t:"Bare rock forever", why:"Soil and plants remain between avalanches." },
          { t:"The same forest as the slopes beside it", why:"The track is disturbed far more often." }] },
        b:{ prompt:"A power-line corridor through a forest is mowed every 3 years. What community will it hold?", options:[
          { t:"Grasses, herbs and low shrubs, kept at an early stage", ok:true, why:"Mowing every 3 years keeps resetting it." },
          { t:"A mature forest", why:"Mowing removes young trees." },
          { t:"Bare soil", why:"Plants regrow between mowings." },
          { t:"Lichens only", why:"There’s plenty of soil." }] } }
    ]
  },
  task:{
    title:"Plan a regreening", summary:"Plan a regreening",
    statement:"<p>Plan the first stage of restoring a patch of acid-damaged, bare land near a former smelter. Choose the soil treatment and the plants. Can you find all the plans that work?</p><ol class=\"es-tlist\"><li>The soil’s acidity is treated.</li><li>Ground cover is sown first.</li><li>At least two tree species are planted.</li><li>Only sun-loving pioneer trees are planted on the open ground.</li></ol>",
    checks:["Acidity treated", "Ground cover first", "Two or more tree species", "Pioneers only"],
    tips:[
      "Few plants survive in very acidic soil. What neutralizes acid?",
      "Bare soil washes away. What can cover it quickly and add nitrogen?",
      "A mix of species makes the new forest more resilient.",
      "Sugar maple and hemlock are shade-tolerant, late-successional trees; on open, poor ground they struggle. Choose sun-loving pioneers."
    ],
    trees:[["birch", "White birch", 1], ["aspen", "Trembling aspen", 1], ["jack", "Jack pine", 1], ["red", "Red pine", 1], ["maple", "Sugar maple", 0], ["hemlock", "Eastern hemlock", 0]],
    explainPrompt:"Explain how your plan copies the order of natural succession, and why it reaches forest faster.",
    vocab:"Use the words pioneer species, secondary succession, soil and shade-tolerant.",
    after3:"Every working plan fixes the soil first, covers it, then plants sun-loving pioneers, just as natural succession would, only faster. Shade-tolerant species can be added decades later under the young canopy."
  },
  cards:[
    ["Succession", "Gradual, directional change in a community’s species over time."],
    ["Primary succession", "Starts with no soil: bare rock after a glacier, new lava. Very slow."],
    ["Secondary succession", "Starts where soil remains: after fire, logging or abandoning a field. Much faster."],
    ["Pioneer species", "First colonists: lichens and mosses on rock; weeds and grasses on bare soil."],
    ["How pioneers help", "They build soil, add organic matter and hold water, so later species can establish."],
    ["Shade-tolerant", "Able to grow in low light under a canopy (sugar maple, hemlock). Dominant late in succession."],
    ["Climax community", "A late-stage community that replaces itself; still changed by fire, insects, storms and climate."],
    ["Species richness over succession", "Often peaks mid-way, when early and late species overlap."],
    ["Jack pine and fire", "Resin-sealed cones open in a fire’s heat, seeding the burned ground."],
    ["Space-for-time", "Using sites of different ages (such as distance from a glacier) to stand in for change at one site."],
    // VERIFY: Sudbury regreening figures (millions of trees) before release (plan card 11).
    ["Sudbury regreening", "Limestone, fertilizer and seed, then millions of trees, restored acid-damaged land."]
  ]
};
