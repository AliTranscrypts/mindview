// SBI4U 44 Predation, Competition and Symbiosis. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/44-species-interactions.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "Predators need time to turn plentiful food into more young, so their peak comes after the prey’s.";
const M2 = "In the model, the prey’s balance depends on the predator’s death rate. Faster prey breeding feeds more predators instead.";
const M3 = "Mutualism means both gain. If one partner is unaffected, it’s commensalism.";
const M4 = "A parasite usually feeds on a living host for a long time; killing it quickly would end its food supply.";
const M5 = "With identical niches, the better competitor wins in the end, unless the two divide the resource.";
const M6 = "Batesian: a harmless species copies a harmful one. Müllerian: harmful species share one warning pattern.";
const M7 = "Follow the arrows: a change in one population passes along to what it eats and what eats it.";

const K1 = "<em>K</em>₁", K2 = "<em>K</em>₂", AL = "<em>α</em>";

// Interaction sorter: hints by box (the plan's own hints for items 7 and 9 replace these)
const BOXH = {
  pred:["Who gains and who loses?", "One animal kills and eats the other.", "+/−, the prey is eaten: predation."],
  comp:["Is either species eating the other?", "No: both need the same limited food or space.", "−/−: competition."],
  mut:["Does each partner get something?", "Yes: both gain.", "+/+: mutualism."],
  comm:["Is the second partner helped or harmed?", "Neither: it’s unaffected.", "+/0: commensalism."],
  para:["Who gains and who loses?", "One feeds on the other while it stays alive.", "+/−, living host: parasitism."]
};
const W_MUT_PLUS0 = "Does the second partner gain anything? If not, it’s commensalism.";
const W_PRED_PARA = "Predators kill and eat their prey; parasites feed on a living host over time.";
const W_COMM_BOTH = "Both partners gain here.";
function sortItem(id, t, answer, why, wrong, hints){ return { id, t, answer, why, wrong:wrong || {}, hints:hints || BOXH[answer] }; }

export default {
  id:"44-species-interactions",
  kind:"topic",
  title:"Predation, competition and symbiosis",
  topic:"Predation, Competition and Symbiosis",
  readyTopic:"predation, competition and symbiosis",
  hero:{
    eq:'<span class="si-heq">+/− · −/− · +/+ · +/0</span>',
    eqLabel:"plus minus, minus minus, plus plus, plus zero",
    eqSize:"sm",
    headline:"No species lives alone",
    text:"Lynx eat hares, warblers compete for caterpillars, fungi trade nutrients with tree roots. Every <strong>interaction</strong> helps or harms the partners, and the effects spread. You’ll watch <strong>predator–prey cycles</strong> and <strong>competition</strong> play out in a model, then trace how one change ripples through a whole food web.",
    fig:{ html:'<div class="si-hero" id="si-hero"><svg id="si-hsvg" viewBox="0 0 360 226" role="img" focusable="false" aria-label="A snowshoe hare in blue and a Canada lynx in orange sit above a graph. The blue hare curve rises and peaks first; the orange lynx curve peaks a little later. A bracket labels the lag between the two peaks."></svg>' +
      '<div class="si-hgrid" id="si-hgrid"><table class="si-grid"><caption>Effect on each species: gains (+), loses (−) or unaffected (0)</caption>' +
      '<thead><tr><th scope="col"><span class="vh">Species A, Species B</span><span aria-hidden="true">A ╲ B</span></th><th scope="col">B +</th><th scope="col">B −</th><th scope="col">B 0</th></tr></thead><tbody>' +
      '<tr><th scope="row">A +</th><td>mutualism</td><td class="si-hot">predation +/−<br>parasitism</td><td>commensalism</td></tr>' +
      '<tr><th scope="row">A −</th><td>predation, parasitism (B gains)</td><td>competition</td><td>—</td></tr>' +
      '<tr><th scope="row">A 0</th><td>commensalism</td><td>—</td><td>—</td></tr></tbody></table></div></div>' }
  },
  goals:[
    "I can classify interactions between species as predation, competition, mutualism, commensalism or parasitism, using +, − and 0.",
    "I can explain predator–prey cycles and read them from time series and cycle plots, including why the predator’s peak lags.",
    "I can explain competitive exclusion and resource partitioning, and predict whether two competitors will coexist.",
    "I can describe defence mechanisms, including Batesian and Müllerian mimicry.",
    "I can predict how a change in one population ripples through a food web, including keystone and invasive species."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Food chains", goal:5,
          prompt:"In the chain algae → zooplankton → yellow perch → walleye, what does the yellow perch eat?",
          options:[
            { t:"Zooplankton", ok:true, why:"Arrows point from food to eater." },
            { t:"Walleye", why:"You read the arrow backwards. Walleye eat perch." },
            { t:"Algae", why:"That skips a link. Algae are eaten by zooplankton." },
            { t:"Nothing; it’s a producer", why:"Producers are the algae at the start." }],
          hints:["Which way do the arrows point?", "From the food to the eater.", "Zooplankton → perch."] },
        { id:"w2", skill:"Food chains", goal:5,
          prompt:"In the same chain, which organism is a secondary consumer?",
          options:[
            { t:"Yellow perch", ok:true, why:"It eats a primary consumer (zooplankton)." },
            { t:"Zooplankton", why:"Zooplankton eat producers: primary consumers." },
            { t:"Walleye", why:"Walleye eat secondary consumers: tertiary." },
            { t:"Algae", why:"Algae are producers." }],
          hints:["Primary consumers eat producers.", "Secondary consumers eat primary consumers.", "Perch."] },
        { id:"w3", skill:"Reading time-series graphs", goal:2,
          prompt:"A graph shows a population rising from 100 in year 0 to a peak of 600 in year 5, then falling to 150 in year 9. When was it largest?",
          options:[
            { t:"Year 5", ok:true, why:"The peak is the highest point." },
            { t:"Year 9", why:"The last point isn’t the largest." },
            { t:"Year 0", why:"100 is the smallest value shown." },
            { t:"Year 600", why:"You read the wrong axis. 600 is the population, not the year." }],
          hints:["Find the highest point.", "It’s at 600 individuals.", "That’s at year 5."] },
        { id:"w4", skill:"Reading time-series graphs", goal:2,
          prompt:"Two curves are on one graph: species X peaks in year 3, species Y in year 5. Which statement is true?",
          options:[
            { t:"Y’s peak comes 2 years after X’s", ok:true, why:"5 − 3 = 2." },
            { t:"They peak together", why:"Year 3 and year 5 are different." },
            { t:"X’s peak comes after Y’s", why:"3 is earlier than 5." },
            { t:"Y’s peak is 2 times higher", why:"The years tell you when, not how high." }],
          hints:["Compare the years of the peaks.", "3 and 5.", "Y peaks 2 years later."] },
        { id:"w5", skill:"Population growth", goal:3,
          prompt:"From module 43, what is carrying capacity?",
          options:[
            { t:"The largest population a habitat can support over time", ok:true, why:"A logistic curve levels off at <em>K</em>." },
            { t:"The fastest a population can grow", why:"That’s the growth rate, at <em>K</em>/2 in logistic growth." },
            { t:"The number of young each female has", why:"That’s fecundity." },
            { t:"The starting population", why:"That’s <em>N</em>₀." }],
          hints:["Where does a logistic curve level off?", "At <em>K</em>.", "The largest supportable population."] },
        { id:"w6", skill:"Population growth", goal:3,
          prompt:"Which is a density-dependent limiting factor?",
          options:[
            { t:"Competition for food", ok:true, why:"It gets worse as the population gets crowded." },
            { t:"A spring flood", why:"Floods don’t depend on crowding." },
            { t:"A cold snap", why:"Weather is density-independent." },
            { t:"A forest fire", why:"Fire is density-independent." }],
          hints:["Would it hit harder in a crowded population?", "Only one choice depends on crowding.", "Competition."] }
      ],
      refreshers:{
        "Food chains":"Arrows point from the food to the eater. Producers make food; primary consumers eat producers; secondary consumers eat primary consumers.",
        "Reading time-series graphs":"Time runs along the bottom, numbers up the side. A peak is the highest point of a curve; compare when two curves peak to find the lag between them.",
        "Population growth":"Carrying capacity <em>K</em> is the largest population a habitat can support. Density-dependent factors such as competition and predation get stronger as a population grows."
      }
    }
  },
  explore:{
    heading:"Interaction simulator",
    intro:"Run a predator–prey model and a competition model. Change one setting at a time and watch both populations.",
    fixedNote:"Fixed in this model: hunting rate 0.01 and food-to-young conversion 0.1.",
    modelTitle:"How the model works",
    modelPP:"<p><strong>Predator–prey</strong> (model hares <em>H</em> and lynx <em>L</em>, drawn year by year):</p><p>prey change = <em>aH</em> − 0.01<em>HL</em><br>predator change = 0.1 × 0.01<em>HL</em> − <em>dL</em></p><p>Both changes are 0 at the balance point: prey balance = <em>d</em> ÷ 0.001; predator balance = <em>a</em> ÷ 0.01.</p>",
    modelComp:"<p><strong>Competition</strong> (two species sharing resources, starting at 50 each): each species grows logistically toward its carrying capacity, but every individual of the other species uses up <em>α</em> of a space. Both grow at <em>r</em> = 0.5 per year.</p><p>Species 2 survives only if " + K2 + " > " + AL + " × " + K1 + "; species 1 only if " + K1 + " > " + AL + " × " + K2 + ". When both survive, species 1’s balance = (" + K1 + " − " + AL + K2 + ") ÷ (1 − " + AL + "²), and the same for species 2.</p>",
    realNote:"Real hare–lynx fur-trade records cycle about every 10 years. This simple model shows the pattern, not the exact numbers.",
    // Symbiosis and defence card gallery (Canadian examples). kind: the animation; a/b: the two partners with their signs.
    cards:[
      { id:"lynx", set:"int", name:"Predation", pair:"+/−", a:{ n:"Canada lynx", s:"+" }, b:{ n:"Snowshoe hare", s:"−" }, kind:"eat",
        flow:"food", cap:"The lynx kills and eats the hare: the lynx gains (+), the hare loses (−)." },
      { id:"tick", set:"int", name:"Parasitism", pair:"+/−", a:{ n:"Winter ticks", s:"+" }, b:{ n:"Moose", s:"−" }, kind:"flow",
        flow:"blood", cap:"Thousands of ticks feed on one living moose for weeks. The ticks gain (+); the moose is weakened (−) but usually survives." },
      { id:"warbler", set:"int", name:"Competition", pair:"−/−", a:{ n:"Cape May warbler", s:"−" }, b:{ n:"Bay-breasted warbler", s:"−" }, kind:"share",
        flow:"caterpillars", cap:"Both warblers eat the same caterpillars in the same tree layer. Each leaves less for the other, so both lose (−/−)." },
      { id:"myco", set:"int", name:"Mutualism", pair:"+/+", a:{ n:"Mycorrhizal fungus", s:"+" }, b:{ n:"Sugar maple roots", s:"+" }, kind:"trade",
        flow:"sugars", back:"water, phosphorus", cap:"The fungus takes sugars from the roots and passes water and phosphorus back. Both gain (+/+)." },
      { id:"barn", set:"int", name:"Commensalism", pair:"+/0", a:{ n:"Barnacles", s:"+" }, b:{ n:"Grey whale", s:"0" }, kind:"ride",
        flow:"a ride", cap:"Barnacles ride on a grey whale to food-rich water. They gain (+); the whale is unaffected (0)." },
      { id:"camo", set:"def", name:"Camouflage", pair:"+/−", a:{ n:"Lynx (predator)", s:"+" }, b:{ n:"Snowshoe hare in winter", s:"−" }, kind:"hide",
        flow:"white coat on snow", cap:"The snowshoe hare’s white winter coat blends into the snow, so the lynx often passes it by." },
      { id:"monarch", set:"def", name:"Chemical defence", pair:"+/−", a:{ n:"Bird (predator)", s:"+" }, b:{ n:"Monarch caterpillar", s:"−" }, kind:"toxic",
        flow:"milkweed toxins", cap:"Monarch caterpillars store toxins from the milkweed they eat. A bird that tries one gets sick and learns to leave them alone." },
      { id:"hover", set:"def", name:"Batesian mimicry", pair:"+/−", a:{ n:"Bird (predator)", s:"+" }, b:{ n:"Hoverfly (harmless)", s:"−" }, kind:"bates",
        flow:"wasp look-alike", cap:"Harmless hoverflies have the black-and-yellow stripes of stinging wasps. Birds that have learned to avoid wasps avoid the hoverflies too." },
      { id:"bee", set:"def", name:"Müllerian mimicry", pair:"+/−", a:{ n:"Bird (predator)", s:"+" }, b:{ n:"Bumblebee and yellowjacket", s:"−" }, kind:"mull",
        flow:"one shared warning", cap:"Bumblebees and yellowjackets can both sting and share black-and-yellow warning colours. One bad experience teaches a bird to avoid both." }
    ],
    predIntro:"Make a prediction first. Then the simulator will show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Predator–prey, start 400 hares and 20 lynx. Which population will reach its first peak first?",
        options:[{ t:"The hares", ok:true }, { t:"The lynx" }, { t:"Both at the same time" }, { t:"Neither; they stay flat" }],
        explain:"Lynx increase only after there’s plenty to eat, and keep increasing until hares become scarce. " + M1,
        start:{ mode:"pp", view:"ts", a:0.5, d:0.4, h0:400, l0:20 }, to:16 },
      { id:"p2", prompt:"Predator–prey, with <em>L</em>₀ = 0. With no lynx at all, what will the hares do in this model?",
        options:[{ t:"Rise faster and faster", ok:true }, { t:"Rise, then cycle anyway" }, { t:"Level off right away" }, { t:"Die out" }],
        explain:"Nothing in this model limits hares except lynx. A real habitat would cap them at its carrying capacity, as in module 43.",
        start:{ mode:"pp", view:"ts", a:0.5, d:0.4, h0:400, l0:0 }, to:20 },
      { id:"p3", prompt:"Competition, " + K1 + " = 600, " + K2 + " = 400, overlap 1.0. The two species need exactly the same resources. What happens?",
        options:[{ t:"Species 2 dies out", ok:true }, { t:"Both settle at half their <em>K</em>" }, { t:"Species 1 dies out" }, { t:"They alternate in cycles" }],
        explain:"With identical niches, one species wins. Here species 1, which the habitat supports in larger numbers, excludes species 2.",
        start:{ mode:"comp", k1:600, k2:400, al:1 }, to:100 },
      { id:"p4", prompt:"Predator–prey, “Cycle plot” view. On a plot of lynx against hares, what shape will the path make?",
        options:[{ t:"A closed loop around the balance point", ok:true }, { t:"A straight line" }, { t:"A single point" }, { t:"A spiral out to infinity" }],
        explain:"The same sequence (hares up, lynx up, hares down, lynx down) repeats, so the path returns to where it started. It loops counterclockwise around the cross at (400, 50).",
        start:{ mode:"pp", view:"cy", a:0.5, d:0.4, h0:400, l0:20 }, to:16 }
    ],
    challenges:[
      { id:"tc1", goal:2, prompt:"Predator–prey, <em>a</em> = 0.5 and <em>d</em> = 0.4: choose starting numbers so that neither population changes.",
        why:"At 400 hares and 50 lynx, the lynx eat exactly as many hares as are born, and exactly as many lynx are born as die. Both curves stay flat.",
        general:"Both curves must stay flat. Start at the balance point shown in the readout.",
        hints:["At the balance point, both changes are 0.", "Hares: 0.5<em>H</em> = 0.01<em>HL</em>, so <em>L</em> = 50. Lynx: 0.001<em>HL</em> = 0.4<em>L</em>, so <em>H</em> = 400.", "Start at 400 hares and 50 lynx."] },
      { id:"tc2", goal:3, prompt:"Competition, " + K1 + " = 600, " + K2 + " = 400: choose an overlap that lets <strong>both</strong> species survive while they still compete (overlap above 0).",
        why:"Species 2 holds on because 400 is more than " + AL + " × 600, and species 1 easily passes its own test. The overlap is small enough to share.",
        general:"Check species 2: its " + K2 + " must be bigger than " + AL + " × " + K1 + ".",
        hints:["Species 2 survives only if its <em>K</em> is bigger than the crowding species 1 causes: " + K2 + " > " + AL + " × " + K1 + ".", "400 > " + AL + " × 600 means " + AL + " < 2/3.", "Any overlap from 0.1 to 0.6."] },
      { id:"tc3", goal:2, stretch:true, prompt:"Predator–prey: change the settings so the balance point has <strong>800 hares and still 50 lynx</strong>.",
        why:"Hare balance = <em>d</em> ÷ 0.001 = 0.8 ÷ 0.001 = 800, and the lynx balance stays at <em>a</em> ÷ 0.01 = 50. Only the lynx death rate moves the hare balance.",
        general:"Read the balance-point row as you move each slider.",
        hints:["Read the balance-point row as you move each slider. Which slider moves the hare balance?", "Hare balance = <em>d</em> ÷ 0.001: only the lynx death rate changes it.", "<em>d</em> = 0.8 with <em>a</em> = 0.5."] }
    ]
  },
  part3:{
    slug:"ripples", name:"Ripples", heading:"Ripple effects",
    intro:"One population changes. Tap every other population to predict what happens to it (↑, ↓ or little change), then press Check. Arrows point from the food to the eater; dashed arrows show other links.",
    panel:"Check it with data",
    illus:"Illustrative values",
    m7:M7,
    states:[["up", "↑ increase"], ["down", "↓ decrease"], ["same", "little change"]],
    stations:[
      { id:"s1", title:"Station 1: a keystone predator (British Columbia’s coast)",
        text:"Sea otters eat sea urchins; urchins graze kelp; kelp forests shelter young fish. <strong>Change: otters return.</strong>",
        h:250,
        nodes:[
          { id:"kelp", t:"Kelp", x:90, y:40 },
          { id:"fish", t:"Kelp-sheltering fish", x:270, y:125 },
          { id:"urch", t:"Sea urchins", x:90, y:125 },
          { id:"otter", t:"Sea otters", x:90, y:210, fixed:"up", note:"otters return" }],
        links:[
          { f:"kelp", to:"urch" }, { f:"urch", to:"otter" }, { f:"kelp", to:"fish", dash:true, lab:"shelter" }],
        answer:{ urch:"down", kelp:"up", fish:"up" },
        fb:{ urch:"Otters eat urchins: more otters means fewer urchins.",
          kelp:"You skipped the urchin → kelp link: fewer urchins graze less kelp, so kelp grows back.",
          fish:"You skipped the kelp → fish link: more kelp forest means more shelter for young fish." },
        data:{ head:["", "Without otters", "With otters"], rows:[["Sea urchins (per m²)", "60", "5"], ["Kelp cover", "5%", "60%"]] },
        note:"A <strong>keystone species</strong> has an effect far larger than its numbers suggest." },
      { id:"s2", title:"Station 2: an invasive filter feeder (the Great Lakes)",
        text:"Zebra mussels arrived in the late 1980s. They filter huge amounts of plankton from the water. <strong>Change: mussels ↑.</strong>",
        h:250,
        nodes:[
          { id:"plank", t:"Plankton", x:180, y:40 },
          { id:"mus", t:"Zebra mussels", x:75, y:125, fixed:"up", note:"invasive, spreading" },
          { id:"larv", t:"Plankton-eating larval fish", x:285, y:125 },
          { id:"clar", t:"Water clarity", x:75, y:210 },
          { id:"plant", t:"Rooted water plants", x:285, y:210 }],
        links:[
          { f:"plank", to:"mus" }, { f:"plank", to:"larv" }, { f:"mus", to:"clar", dash:true, lab:"filtering" }, { f:"clar", to:"plant", dash:true, lab:"light" }],
        answer:{ plank:"down", clar:"up", larv:"down", plant:"up" },
        fb:{ plank:"Mussels eat plankton: more mussels filter out more plankton.",
          clar:"You skipped the filtering link: with less plankton floating in it, the water gets clearer.",
          larv:"You skipped the plankton → larval fish link: less plankton means less food for young fish.",
          plant:"You skipped the clarity → plants link: clearer water lets more light reach the bottom, so rooted plants grow." },
        data:{ head:["", "Before mussels", "After mussels"], rows:[["Water clarity (how deep you can see)", "2 m", "5 m"], ["Plankton biomass", "100%", "50% (down by half)"]] },
        note:"Freed from the predators and parasites of its home range, an <strong>invasive species</strong> can spread fast and reshape a food web." },
      { id:"s3", title:"Station 3: an invasive insect (Ontario woodlots)",
        text:"The emerald ash borer was first found in Canada in 2002. Its larvae tunnel under the bark and kill ash trees. <strong>Change: ash trees ↓.</strong>",
        h:250,
        nodes:[
          { id:"ash", t:"Ash trees", x:180, y:40, fixed:"down", note:"killed by the borer" },
          { id:"eab", t:"Emerald ash borer larvae", x:60, y:125, fixed:"up", note:"plentiful in dying ash" },
          { id:"ins", t:"Insects that feed only on ash", x:180, y:125 },
          { id:"light", t:"Light at the forest floor", x:300, y:125 },
          { id:"wood", t:"Woodpeckers", x:60, y:210 },
          { id:"shrub", t:"Shrubs and young trees in the gaps", x:300, y:210 }],
        links:[
          { f:"ash", to:"eab" }, { f:"ash", to:"ins" }, { f:"ash", to:"light", dash:true, lab:"shade" }, { f:"eab", to:"wood" }, { f:"light", to:"shrub", dash:true, lab:"growth" }],
        answer:{ wood:"up", ins:"down", light:"up", shrub:"up" },
        fb:{ wood:"You skipped the borer → woodpecker link: dying ash trees are full of larvae to eat, so woodpeckers increase at first.",
          ins:"Insects that feed only on ash lose their only food.",
          light:"You skipped the shade link: dead ash trees lose their leaves and open the canopy.",
          shrub:"You skipped the light → shrubs link: more light at the forest floor lets shrubs and young trees fill the gaps (module 45)." },
        data:{ head:["", "Before the borer", "Ten years later"], rows:[["Ash canopy cover", "40%", "2%"]] },
        note:"Gaps in the canopy start a new round of community change, as you’ll see in module 45." }
    ],
    quickCheck:{
      title:"Quick check", summary:"Ripple effects quick check",
      items:[
        { id:"q1", goal:5, prompt:"In a lake, walleye eat perch and perch eat zooplankton. If walleye are overfished, zooplankton will most likely…",
          right:"Fewer walleye → more perch → more zooplankton eaten.", wrong:"Fewer walleye → more perch → more zooplankton eaten. " + M7,
          choices:[{ t:"decrease", ok:true }, { t:"increase" }, { t:"stay the same" }, { t:"disappear completely" }] },
        { id:"q2", goal:5, prompt:"What makes a species ‘keystone’?",
          right:"Its effect on the community is far larger than its numbers.", wrong:"Keystones can be predators, but the definition is about the size of their effect.",
          choices:[{ t:"Its effect on the community is far larger than its numbers", ok:true }, { t:"It’s the most numerous species" }, { t:"It’s always a top predator" }, { t:"It’s always a plant" }] },
        { id:"q3", goal:1, prompt:"A tapeworm living in a wolf’s gut for years is an example of…",
          right:"It feeds on a living host over a long time (+/−).", wrong:"It feeds on a living host over a long time (+/−). " + M4,
          choices:[{ t:"parasitism", ok:true }, { t:"predation" }, { t:"commensalism" }, { t:"mutualism" }] },
        { id:"q4", goal:5, prompt:"Why are invasive species often so successful in a new place?",
          right:"Released from their natural controls, they spread quickly.", wrong:"Released from their natural controls, they spread quickly.",
          choices:[{ t:"Their usual predators, parasites and competitors aren’t there", ok:true }, { t:"They are always larger" }, { t:"They reproduce asexually" }, { t:"They need no food" }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Interaction sorter", summary:"Interaction sorter", goal:1, noun:"interaction", txt:true,
        instruction:"Sort each interaction by who gains (+), who loses (−) and who is unaffected (0).",
        boxes:[
          { id:"pred", label:"Predation", sub:"+/−" },
          { id:"comp", label:"Competition", sub:"−/−" },
          { id:"mut", label:"Mutualism", sub:"+/+" },
          { id:"comm", label:"Commensalism", sub:"+/0" },
          { id:"para", label:"Parasitism", sub:"+/−" }],
        wrongDefault:"Ask who gains (+), who loses (−) and who is unaffected (0), then match the pair to a box.",
        items:[
          sortItem("i1", "A Canada lynx chases down and eats snowshoe hares", "pred", "The lynx gains and the hare is killed and eaten: +/−, predation.",
            { para:"The hare is killed and eaten, not fed on while it lives." }),
          sortItem("i2", "Mycorrhizal fungi trade nutrients for sugars with sugar maple roots", "mut", "The fungus gets sugars and the tree gets nutrients: +/+.",
            { comm:W_COMM_BOTH, para:"The fungus gives something back, so the tree gains too." }),
          sortItem("i3", "Winter ticks feed on a moose’s blood for weeks", "para", "The ticks feed on a living host for a long time: +/−, parasitism.",
            { pred:W_PRED_PARA }),
          sortItem("i4", "Barnacles ride on a grey whale, which is unaffected", "comm", "The barnacles gain a ride; the whale is unaffected: +/0.",
            { mut:W_MUT_PLUS0 }),
          sortItem("i5", "Two warbler species feed on the same caterpillars in the same tree layer", "comp", "Each warbler leaves less food for the other: −/−.",
            { pred:"Neither warbler eats the other; they’re after the same food." }),
          sortItem("i6", "In a lichen, an alga makes sugars and a fungus supplies water and shelter", "mut", "Each partner supplies what the other needs: +/+.",
            { comm:W_COMM_BOTH }),
          sortItem("i7", "A brown-headed cowbird lays its eggs in a warbler’s nest, and the warbler raises the chicks", "para", "The cowbird gains care; the warbler loses its effort and often its own chicks: brood parasitism (+/−).",
            { pred:W_PRED_PARA, comm:"The warbler loses its effort and often its own chicks, so it isn’t unaffected." },
            ["Who gains and who loses?", "The cowbird gains care; the warbler loses its effort and often its own chicks.", "+/−, living host: parasitism (brood parasitism)."]),
          sortItem("i8", "Wolves and coyotes both hunt white-tailed deer in the same area", "comp", "Both predators need the same deer, so each leaves less for the other: −/−.",
            { pred:"Wolves and coyotes aren’t eating each other; they’re after the same food." }),
          sortItem("i9", "Burdock seeds hook onto a fox’s fur and are carried away; the fox is unaffected", "comm", "The burdock gains a ride for its seeds; the fox is unaffected: +/0.",
            { mut:W_MUT_PLUS0 },
            ["Is the fox helped or harmed?", "Neither.", "+/0: commensalism."]),
          sortItem("i10", "Bees collect nectar from blueberry flowers and carry their pollen", "mut", "The bees get nectar and the blueberries get pollinated: +/+.",
            { comm:W_COMM_BOTH }),
          sortItem("i11", "A great horned owl catches and eats deer mice", "pred", "The owl kills and eats the mice: +/−, predation.",
            { para:"The mouse is killed and eaten, not fed on while it lives." })
        ] },
      { id:"model", type:"custom", title:"Model and ripple reasoning", summary:"Model and ripple reasoning", star:true, goal:[2, 3, 5],
        instruction:"Six problems on the simulator’s models and on food-web ripples. R3 to R6 are non-routine (★).",
        how:"",
        items:[
          { id:"r1", kind:"pair", goal:2, prompt:"Predator–prey model, <em>a</em> = 0.6, <em>d</em> = 0.3. Balance point? (hares, lynx)",
            fields:["Hares", "Lynx"], answer:[300, 60], display:"300 hares, 60 lynx",
            why:"Hare balance = <em>d</em> ÷ 0.001 = 300; lynx balance = <em>a</em> ÷ 0.01 = 60.",
            wrong:[{ match:[60, 300], fb:"Swapped. Hare balance = <em>d</em> ÷ 0.001." }],
            general:"Hare balance = <em>d</em> ÷ 0.001; lynx balance = <em>a</em> ÷ 0.01.",
            hints:["Which rate sets each balance?", "Hare balance = <em>d</em> ÷ 0.001; lynx balance = <em>a</em> ÷ 0.01.", "0.3 ÷ 0.001 = 300 hares; 0.6 ÷ 0.01 = 60 lynx."] },
          { id:"r2", kind:"pair", goal:2, prompt:"Now <em>d</em> rises to 0.6 (a lynx disease). New balance?",
            fields:["Hares", "Lynx"], answer:[600, 60], display:"600 hares, 60 lynx",
            why:"Only the hare balance uses <em>d</em>: 0.6 ÷ 0.001 = 600. The lynx balance stays at 0.6 ÷ 0.01 = 60.",
            wrong:[{ match:[300, 30], fb:"The lynx balance depends only on <em>a</em>; the hare balance doubles. " + M2 }, { match:[60, 600], fb:"Swapped. Hare balance = <em>d</em> ÷ 0.001." }],
            general:"Use the formulas again with <em>d</em> = 0.6 and <em>a</em> = 0.6.",
            hints:["Which rate appears in the hare balance?", "Hare balance = <em>d</em> ÷ 0.001 = 0.6 ÷ 0.001.", "600 hares; lynx stay at 0.6 ÷ 0.01 = 60."] },
          { id:"r3", kind:"pair", goal:2, star:true, prompt:"Time series: hares peak in years 3, 17 and 31; lynx in years 6, 20 and 34. Lag, and cycle length?",
            fields:["Lag (years)", "Cycle length (years)"], answer:[3, 14], display:"lag 3 years; cycle length 14 years",
            why:"Lag: 6 − 3 = 3 years between the two curves. Cycle length: 17 − 3 = 14 years between one curve’s peaks.",
            wrong:[{ match:[14, 3], fb:"The lag is between the two curves; the cycle length is between one curve’s peaks." }],
            general:"The lag is between the two curves; the cycle length is between one curve’s peaks.",
            hints:["Lag: compare a hare peak with the lynx peak after it.", "6 − 3 = 3. Cycle: compare two hare peaks.", "Lag 3 years; cycle 17 − 3 = 14 years."] },
          { id:"r4", kind:"num", goal:3, star:true, prompt:"Competition, " + K1 + " = " + K2 + " = 500, overlap 0.5. Each species’ balance? (Use <em>N</em> = (<em>K</em> − <em>αK</em><sub>other</sub>)/(1 − <em>α</em>²).)",
            answer:333.333, tol:0.5, display:"333 each", unit:"individuals",
            why:"(500 − 0.5 × 500)/(1 − 0.25) = 250 ÷ 0.75 = 333.3, so about 333 each.",
            wrong:[{ match:250, fb:"(500 − 250)/(1 − 0.25) = 333.3; don’t forget to divide by 0.75." }],
            general:"Work out the top, then divide by 1 − 0.5².",
            hints:["Top: 500 − 0.5 × 500.", "250 ÷ (1 − 0.25).", "250 ÷ 0.75 = 333.3: about 333."] },
          { id:"r5", kind:"chips", goal:5, star:true, prompt:"Bass eat perch, perch eat zooplankton, zooplankton eat algae. Anglers remove most bass. Predict perch, zooplankton and algae.",
            groups:[{ id:"perch", t:"Perch" }, { id:"zoo", t:"Zooplankton" }, { id:"alg", t:"Algae" }],
            choices:[["up", "↑"], ["down", "↓"], ["same", "little change"]],
            answer:{ perch:"up", zoo:"down", alg:"up" }, display:"perch ↑, zooplankton ↓, algae ↑",
            why:"Fewer bass → more perch → more zooplankton eaten → fewer zooplankton → less grazing → more algae.",
            wrong:{ alg:"Fewer zooplankton means less grazing, so algae increase. " + M7, zoo:"More perch eat more zooplankton.", perch:"Bass eat perch: fewer bass, more perch." },
            hints:["Start at the top: what happens to perch when bass are removed?", "Perch ↑, so they eat more zooplankton.", "Perch ↑, zooplankton ↓, algae ↑."] },
          { id:"r6", kind:"num", goal:3, star:true, prompt:"Competition, " + K1 + " = 800, " + K2 + " = 600. What is the largest overlap (in steps of 0.1) that still lets species 2 survive?",
            answer:0.7, tol:1e-6, display:"0.7", unit:"",
            why:"Species 2 survives if 600 > " + AL + " × 800, so " + AL + " < 0.75. The largest step of 0.1 below 0.75 is 0.7.",
            wrong:[{ match:0.8, fb:"0.8 × 800 = 640 > 600." }, { match:0.75, fb:"The slider moves in steps of 0.1." }],
            general:"Species 2 survives only if " + K2 + " > " + AL + " × " + K1 + ".",
            hints:["Species 2 survives if " + K2 + " > " + AL + " × " + K1 + ".", "600 > " + AL + " × 800 means " + AL + " < 0.75.", "Largest step below 0.75: 0.7."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Jonah", how:"",
        instruction:"Jonah made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Explain the hare–lynx cycle.",
            steps:["When hares are plentiful, lynx catch food easily.", "Well-fed lynx raise more kittens, so lynx numbers rise.", "So lynx numbers peak at the same time as hare numbers.", "Then both populations fall together."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows step 3. The first mistake is earlier."],
            fixes:[
              { t:"Lynx keep increasing while hares are still fairly common, so their peak comes after the hares’ peak; the hare decline then pulls lynx numbers down.", ok:true, why:M1 },
              { t:"Lynx peak before hares, because predators control prey.", why:"The predator can’t increase before its food does." },
              { t:"Lynx numbers never change; only hares cycle.", why:"Both curves cycle." },
              { t:"Step 3 is correct.", why:M1 }],
            hints:["Can lynx numbers rise without plenty of food?", "They keep rising while food lasts.", "So their peak lags behind the hares’."] },
          { id:"e2", goal:3, task:"Two diving duck species eat the same snails at the same depth in one lake. Predict the outcome.",
            steps:["They need the same resource in the same place: their niches overlap completely.", "Each snail one species eats is lost to the other.", "So competition lowers both populations.", "Both species will therefore survive indefinitely at lower numbers."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"With identical niches, the better competitor eventually excludes the other, unless the two come to divide the resource (different depths or times).", ok:true, why:M5 },
              { t:"Both will die out.", why:"The winner survives." },
              { t:"They will form a mutualism.", why:"Competition is −/−." },
              { t:"Step 4 is correct.", why:M5 }],
            hints:["What does competitive exclusion say about identical niches?", "One species wins in the long run.", "Coexistence needs partitioning."] },
          { id:"e3", goal:4, task:"Harmless hoverflies have yellow-and-black stripes like stinging wasps. Classify this defence.",
            steps:["Wasps can sting, so birds learn to avoid yellow-and-black stripes.", "Hoverflies look similar but can’t sting.", "Two harmful species sharing a warning pattern is Batesian mimicry.", "So hoverflies show Batesian mimicry."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "The label in step 4 happens to be right, but it rests on the wrong definition in step 3."],
            fixes:[
              { t:"A harmless species copying a harmful one is Batesian mimicry; harmful species sharing one pattern is Müllerian mimicry. Hoverflies are Batesian mimics.", ok:true, why:M6 },
              { t:"Two harmful species sharing a pattern is camouflage.", why:"Camouflage hides; warning colours advertise." },
              { t:"Hoverflies show Müllerian mimicry.", why:"Müllerian mimics are all harmful." },
              { t:"Step 3 is correct.", why:M6 }],
            hints:["Is the hoverfly harmful?", "No: it only looks harmful.", "Harmless copying harmful = Batesian."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the simulator: the lag, the loop, or the way the balance point responds?" },
      { id:"j2", q:"In your own words, why can’t two species with identical needs share them forever?" },
      { id:"j3", q:"Explain to a friend how removing one species from a lake can change the algae." },
      { id:"j4", q:"Which interaction or idea is still fuzzy? How will you check it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Mycorrhizal fungi take sugars from a sugar maple’s roots and help the tree absorb water and phosphorus. What kind of interaction is this?", options:[
          { t:"Mutualism", ok:true, why:"Both partners gain (+/+)." },
          { t:"Commensalism", why:"The tree gains too. " + M3 },
          { t:"Parasitism", why:"The fungus gives something back." },
          { t:"Competition", why:"They aren’t after the same resource." }] },
        b:{ prompt:"Burdock seed heads hook onto a fox’s fur and are carried to new places; the fox is unaffected. What kind of interaction is this?", options:[
          { t:"Commensalism", ok:true, why:"+/0." },
          { t:"Mutualism", why:"The fox gains nothing. " + M3 },
          { t:"Parasitism", why:"The fox isn’t harmed." },
          { t:"Predation", why:"Nothing is eaten." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"Harmless hoverflies have yellow-and-black stripes like stinging wasps. What is this called?", options:[
          { t:"Batesian mimicry", ok:true, why:"A harmless species resembles a harmful one." },
          { t:"Müllerian mimicry", why:"Müllerian mimics are all harmful. " + M6 },
          { t:"Camouflage", why:"Camouflage blends in; these stripes stand out." },
          { t:"Chemical defence", why:"Hoverflies have no sting or toxin." }] },
        b:{ prompt:"Bumblebees and yellowjackets, both able to sting, share black-and-yellow warning colours. What is this called?", options:[
          { t:"Müllerian mimicry", ok:true, why:"Harmful species share one warning signal." },
          { t:"Batesian mimicry", why:"Batesian mimics are harmless. " + M6 },
          { t:"Camouflage", why:"The colours advertise; they don’t hide." },
          { t:"Commensalism", why:"That’s a +/0 relationship, not a defence." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which statement is the competitive exclusion principle?", options:[
          { t:"Two species that need exactly the same resources in the same place can’t coexist indefinitely; one outcompetes the other", ok:true, why:"That’s competitive exclusion: identical niches end with one winner." },
          { t:"Competition always ends with both species dying out", why:"The winner survives." },
          { t:"Species with the same niche share resources equally forever", why:M5 },
          { t:"Predators exclude their prey from the best habitats", why:"That’s about predation, not competition." }] },
        b:{ prompt:"Two warbler species feed in the same spruce trees, but one feeds at the tips of upper branches and the other near the trunk lower down. What best describes this?", options:[
          { t:"Resource partitioning, which lets them coexist", ok:true, why:"Dividing the tree lowers the overlap, so both species persist." },
          { t:"Competitive exclusion", why:"Both species persist here." },
          { t:"Mutualism", why:"Neither helps the other." },
          { t:"Predation", why:"Neither eats the other." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"In a model hare–lynx cycle, hares peak in years 4, 14 and 24. In which years do lynx most likely peak?", options:[
          { t:"6, 16 and 26", ok:true, why:"A short lag after each hare peak." },
          { t:"4, 14 and 24", why:"Lynx need time to respond. " + M1 },
          { t:"2, 12 and 22", why:"Lynx can’t rise before their food does." },
          { t:"9, 19 and 29", why:"Halfway through the cycle hares are near their lowest; lynx would already be falling." }] },
        b:{ prompt:"Hares peak in years 3, 13 and 23. In which years do lynx most likely peak?", options:[
          { t:"5, 15 and 25", ok:true, why:"A short lag after each hare peak." },
          { t:"3, 13 and 23", why:"Lynx need time to respond. " + M1 },
          { t:"1, 11 and 21", why:"Predators can’t lead their food." },
          { t:"8, 18 and 28", why:"By then hares are near their lowest." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"In the module’s model, the prey balance = (predator death rate) ÷ 0.001 and the predator balance = (prey birth rate) ÷ 0.01. A disease raises the lynx death rate from 0.3 to 0.5; the hare birth rate stays 0.4. What happens to the balance point?", options:[
          { t:"Hares rise from 300 to 500; lynx stay at 40", ok:true, why:"Only the hare balance uses the death rate." },
          { t:"Lynx fall from 40 to 24; hares stay at 300", why:"Intuitive, but the lynx balance depends only on the hare birth rate." },
          { t:"Both fall", why:"Use the formulas: the hare balance goes up." },
          { t:"Hares fall from 300 to 180", why:"The death rate is in the numerator: 0.5 ÷ 0.001 = 500." }] },
        b:{ prompt:"In the module’s model, the prey balance = (predator death rate) ÷ 0.001 and the predator balance = (prey birth rate) ÷ 0.01. A mild winter raises the hare birth rate from 0.4 to 0.6; the lynx death rate stays 0.3. What happens to the balance point?", options:[
          { t:"Hares stay at 300; lynx rise from 40 to 60", ok:true, why:"Extra hare births feed more lynx." },
          { t:"Hares rise from 300 to 450; lynx stay at 40", why:M2 },
          { t:"Both rise by half", why:"Only the lynx balance uses the hare birth rate." },
          { t:"Hares fall; lynx rise", why:"The hare balance doesn’t change." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"In the competition model, species 2 survives only if " + K2 + " > overlap × " + K1 + ", and species 1 only if " + K1 + " > overlap × " + K2 + ". With " + K1 + " = 500, " + K2 + " = 400 and overlap 0.9, what happens?", options:[
          { t:"Species 1 survives and species 2 is excluded", ok:true, why:"400 < 0.9 × 500 = 450, but 500 > 0.9 × 400 = 360." },
          { t:"Both coexist at lower numbers", why:"Check species 2: 400 isn’t more than 450. " + M5 },
          { t:"Species 2 wins because its <em>K</em> is smaller", why:"A smaller <em>K</em> is a disadvantage here." },
          { t:"Both die out", why:"Species 1 passes its test." }] },
        b:{ prompt:"In the competition model, species 2 survives only if " + K2 + " > overlap × " + K1 + ", and species 1 only if " + K1 + " > overlap × " + K2 + ". With " + K1 + " = 600, " + K2 + " = 500 and overlap 0.8, what happens?", options:[
          { t:"Both survive", ok:true, why:"500 > 480 and 600 > 400." },
          { t:"Species 2 is excluded", why:"500 is just over 0.8 × 600 = 480." },
          { t:"Species 1 is excluded", why:"600 > 0.8 × 500 = 400." },
          { t:"Both die out", why:"Both pass their tests." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why the predator’s peak comes after the prey’s?", options:[
          { t:"“Predators need time to turn plentiful food into more young, so their numbers keep rising after prey start to fall; only when prey become scarce do predators decline.”", ok:true, why:"The timing of food explains the lag." },
          { t:"“Predators peak later because they’re bigger and grow more slowly.”", why:"Size isn’t the reason; the timing of food is." },
          { t:"“Predators wait until prey numbers are highest before they start hunting.”", why:"Predators hunt all the time." },
          { t:"“The peaks are actually at the same time; graphs just show them shifted.”", why:M1 }] },
        b:{ prompt:"Which is the best explanation of why prey start to recover after predators decline?", options:[
          { t:"“With fewer predators, fewer prey are eaten, so prey births outpace deaths and prey numbers rise again.”", ok:true, why:"Fewer predators means fewer prey deaths." },
          { t:"“Prey recover because they migrate in from elsewhere.”", why:"This model has no migration." },
          { t:"“Prey recover when predators reach their peak.”", why:"At the predator peak, prey are being eaten fastest." },
          { t:"“Prey numbers never fall in a cycle.”", why:"They fall after their own peak." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Brown-headed cowbirds lay eggs in warblers’ nests, and warblers raise the cowbird chicks, often losing their own. Which description is correct?", options:[
          { t:"Parasitism: cowbird +, warbler −", ok:true, why:"The cowbird exploits a living host that loses its effort and chicks." },
          { t:"Commensalism: cowbird +, warbler 0", why:"The warbler loses its effort and chicks. " + M3 },
          { t:"Mutualism: both +", why:"The warbler gains nothing." },
          { t:"Predation: cowbird +, warbler −, because the cowbird eats the warbler", why:"No one is eaten; the host is exploited." }] },
        b:{ prompt:"A remora rides on a shark and eats scraps from its meals; the shark is unaffected. Which description is correct?", options:[
          { t:"Commensalism: remora +, shark 0", ok:true, why:"One gains and the other is unaffected." },
          { t:"Mutualism: both +", why:M3 },
          { t:"Parasitism: remora +, shark −", why:"The shark isn’t harmed." },
          { t:"Competition: both −", why:"They aren’t competing." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"Zebra mussels spread through Lake Erie, filtering large amounts of plankton from the water. Which set of effects is most likely?", options:[
          { t:"Clearer water, less plankton, and fewer young fish that feed on plankton", ok:true, why:"Filtering removes plankton, so the water clears and plankton-eaters lose food." },
          { t:"Murkier water, more plankton and more young fish", why:"Filtering removes plankton." },
          { t:"No change, because mussels eat only bottom algae", why:"They filter the open water." },
          { t:"Clearer water and more young fish, because the water is cleaner", why:"Clear water here means less food for plankton-eaters. " + M7 }] },
        b:{ prompt:"Emerald ash borers kill most of the ash trees in an Ontario woodlot. Which set of effects is most likely in the next few years?", options:[
          { t:"More woodpeckers feeding on the larvae, fewer insects that eat only ash, and more light reaching the forest floor", ok:true, why:"The change passes to what eats the larvae, what eats the ash and what the ash shaded." },
          { t:"Fewer woodpeckers, because the trees are dying", why:"Dying ash trees are full of larvae to eat." },
          { t:"No change except to the ash trees", why:M7 },
          { t:"Less light at the forest floor, because dead trees shade it", why:"Dead trees lose their leaves and open the canopy." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"In a model park, elk have over-browsed streamside willows for years. Wolves are brought back and hunt the elk. Which chain of effects is most likely?", options:[
          { t:"Fewer elk browse near streams, so willows regrow, and beavers that use willow increase", ok:true, why:"The wolves’ effect passes through the elk to the willows and on to the beavers." },
          { t:"Elk increase because wolves eat their competitors", why:"Wolves prey on elk." },
          { t:"Willows decline further because wolves trample them", why:"The main link is through the elk. " + M7 },
          { t:"Only the elk are affected", why:M7 }] },
        b:{ prompt:"Sea otters return to a stretch of coast where urchins had grazed the kelp to bare rock. Which chain of effects is most likely?", options:[
          { t:"Urchins decline, kelp regrows, and fish that shelter in kelp increase", ok:true, why:"Otters eat urchins, so grazing drops and the kelp forest returns." },
          { t:"Urchins increase because otters scare off their predators", why:"Otters eat urchins." },
          { t:"Kelp declines further", why:"Fewer urchins means less grazing. " + M7 },
          { t:"Only urchins are affected", why:M7 }] } }
    ]
  },
  task:{
    title:"Make room for two", summary:"Make room for two",
    statement:"<p>Set up a competition between two species that compete strongly, where both still survive and the smaller one isn’t squeezed too hard. Can you find all the settings that work?</p><ol class=\"si-conds\"><li>Both species survive.</li><li>They compete strongly: overlap at least 0.6.</li><li>Species 1 has the larger habitat: " + K1 + " > " + K2 + ".</li><li>Species 2 keeps at least 150 individuals at the balance.</li></ol>",
    checks:["Both survive", "Strong competition", "Species 1’s habitat is larger", "Species 2 keeps at least 150"],
    tips:[
      "Species 2 survives only if " + K2 + " is bigger than " + AL + " × " + K1 + ". With strong overlap, " + K2 + " must be close to " + K1 + ".",
      "Raise the overlap to at least 0.6.",
      "Make species 1’s carrying capacity the larger one.",
      "Species 2’s balance is (" + K2 + " − " + AL + K1 + ")/(1 − " + AL + "²). Bring " + K2 + " closer to " + K1 + " or lower the overlap a little."],
    explainPrompt:"Explain why strong competitors can coexist only when their carrying capacities are close, using one of your designs.",
    vocab:"Use the words niche overlap, competitive exclusion, carrying capacity and balance.",
    more:"Can you find all the settings that work?",
    after3:"Strong competitors coexist only when their habitats are similar in size. The closer " + K2 + " is to " + K1 + ", the more overlap they can tolerate."
  },
  cards:[
    ["Predation", "+/−: one animal kills and eats another (lynx and hare)."],
    ["Parasitism", "+/−: the parasite feeds on a living host over time (winter ticks on moose)."],
    ["Competition", "−/−: both need the same limited resource."],
    ["Mutualism", "+/+: both partners gain (mycorrhizal fungi and tree roots)."],
    ["Commensalism", "+/0: one gains, the other is unaffected (barnacles on a whale)."],
    ["Predator–prey cycle", "Prey rise → predators rise → prey fall → predators fall → repeat. The predator’s peak lags."],
    ["Competitive exclusion", "Identical niches can’t coexist forever; one species wins."],
    ["Resource partitioning", "Dividing a resource (place, time, food size) so competitors can coexist."],
    ["Batesian mimicry", "A harmless species resembles a harmful one (hoverfly and wasp)."],
    ["Müllerian mimicry", "Harmful species share one warning pattern (bumblebee and yellowjacket)."],
    ["Keystone species", "Its effect on the community is far larger than its numbers (sea otters)."],
    ["Invasive species", "A non-native species that spreads and harms its new community, often freed from its natural controls (zebra mussel, emerald ash borer)."]
  ]
};
