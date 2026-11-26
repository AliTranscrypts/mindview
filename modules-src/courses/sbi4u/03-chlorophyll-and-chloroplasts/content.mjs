// SBI4U 03 Chlorophyll and Chloroplasts. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/03-chlorophyll-and-chloroplasts.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "Chlorophyll is held in protein complexes in the thylakoid membranes; its tail anchors it there.";
const M2 = "Antenna pigments pass <strong>energy</strong>. Only the reaction centre hands an electron to the acceptor.";
const M4 = "The lumen is <strong>inside</strong> each thylakoid; the stroma is <strong>outside</strong> the thylakoids.";
const M5 = "A reaction centre has a top speed; extra captured energy beyond it is wasted as heat and fluorescence, and can cause damage.";
const M6 = "Isolated chlorophyll absorbs light, but with no acceptor the energy comes back out as red light and heat.";
const M7 = "The ring, with magnesium at its centre, absorbs light; the tail anchors the molecule. Iron is in hemoglobin.";
const USE = "Light factors (photons captured per pigment per second): Low 0.25, Moderate 0.5, High 1.0. A reaction centre’s top speed: 100 electrons per second.";
const E1W = "Only the reaction centre hands over an electron.";
const E2W = "Chlorophyll’s oily tail holds it in a membrane.";
const E3W = "Engulfing wraps the bacterium in the host’s own membrane, which adds a second one.";

export default {
  id:"03-chlorophyll-and-chloroplasts",
  kind:"topic",
  title:"Chlorophyll and chloroplasts",
  topic:"Chlorophyll and Chloroplasts",
  readyTopic:"chlorophyll and chloroplasts",
  hero:{
    headline:"Hundreds of pigments, one electron",
    text:"Inside every chloroplast, stacks of <strong>thylakoids</strong> hold <strong>photosystems</strong>. Hundreds of <strong>antenna</strong> pigments catch light and funnel its energy to one <strong>reaction centre</strong>, where a chlorophyll <i>a</i> molecule finally sends an electron on its way. That single electron hop is where light becomes chemistry.",
    fig:{ html:'<div class="cz-hero" id="cz-hero" role="img" aria-label="A chloroplast cut open, labelled envelope, stroma and granum. A zoom bubble on one thylakoid membrane shows a photosystem: a ring of antenna pigments around a reaction centre. A photon lands on an outer antenna pigment; its energy hops from pigment to pigment toward the centre (dotted path), and the reaction centre sends one electron to the primary electron acceptor."></div>' }
  },
  goals:[
    "I can identify the parts of a chloroplast and say which processes happen in each.",
    "I can describe a chlorophyll molecule’s structure and relate it to its job.",
    "I can explain how an antenna passes energy to a reaction centre, and what the reaction centre does with it.",
    "I can predict what happens to absorbed energy when the acceptor is blocked or when the light is stronger than the reaction centre can use.",
    "I can explain the evidence that chloroplasts descended from bacteria."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Organelles", goal:5,
          prompt:"Besides the nucleus, which of these organelles contains its own DNA?",
          options:[
            { t:"Chloroplast", ok:true, why:"Chloroplasts (and mitochondria) carry small circular DNA molecules." },
            { t:"Golgi body", why:"The Golgi packages proteins; it has no DNA." },
            { t:"Ribosome", why:"Ribosomes read RNA; they don’t store DNA." },
            { t:"Lysosome", why:"Lysosomes hold digestive enzymes." }],
          hints:["Which organelles can divide on their own?", "The energy organelles.", "Chloroplasts."] },
        { id:"w2", skill:"Organelles", goal:1,
          prompt:"What does it mean that a chloroplast has a ‘double membrane’?",
          options:[
            { t:"It is surrounded by two separate membranes", ok:true, why:"An outer and an inner membrane, with a narrow space between." },
            { t:"Its membrane is made of two layers of phospholipids", why:"Every membrane is a bilayer; a double membrane is two bilayers." },
            { t:"It has two copies of each membrane protein", why:"‘Double’ refers to two whole membranes." },
            { t:"It has a membrane and a cell wall", why:"Organelles don’t have cell walls." }],
          hints:["Every membrane is already a phospholipid bilayer.", "So ‘double’ must mean two membranes.", "Outer and inner."] },
        { id:"w3", skill:"Membranes", goal:2,
          prompt:"The fatty-acid tails of membrane phospholipids are…",
          options:[
            { t:"hydrophobic: they avoid water", ok:true, why:"They face each other inside the bilayer." },
            { t:"hydrophilic: they attract water", why:"That’s the phosphate heads." },
            { t:"charged, like ions", why:"The tails are uncharged hydrocarbon chains." },
            { t:"made of protein", why:"Membrane proteins are separate molecules." }],
          hints:["Oil and water don’t mix.", "The tails are like oil.", "Hydrophobic."] },
        { id:"w4", skill:"Membranes", goal:2,
          prompt:"Which molecule would sit most comfortably in the middle of a membrane?",
          options:[
            { t:"One with a long hydrocarbon tail", ok:true, why:"Like dissolves like: the tail fits among the lipid tails." },
            { t:"A sodium ion", why:"Charged particles avoid the oily core." },
            { t:"Glucose", why:"Glucose is polar and stays in water." },
            { t:"Water", why:"Water is polar; few water molecules sit in the core." }],
          hints:["The membrane’s core is oily.", "Which option is oily?", "The long hydrocarbon tail."] },
        { id:"w5", skill:"Light and pigments", goal:3,
          prompt:"Which is the main photosynthetic pigment?",
          options:[
            { t:"Chlorophyll <i>a</i>", ok:true, why:"It’s in every reaction centre." },
            { t:"Chlorophyll <i>b</i>", why:"Chlorophyll <i>b</i> is an accessory pigment." },
            { t:"Carotene", why:"Carotenoids are accessory pigments." },
            { t:"Xanthophyll", why:"Also an accessory pigment." }],
          hints:["Which pigment did module 02 call the main one?", "The others pass energy to it.", "Chlorophyll <i>a</i>."] },
        { id:"w6", skill:"Light and pigments", goal:3,
          prompt:"When a pigment molecule absorbs a photon, what happens first?",
          options:[
            { t:"One of its electrons is raised to a higher energy level", ok:true, why:"The pigment becomes ‘excited’." },
            { t:"The pigment gets hot enough to glow", why:"Absorption excites an electron; any heat comes later." },
            { t:"The photon is stored inside the molecule as light", why:"The photon’s energy is transferred; it doesn’t stay as light." },
            { t:"The pigment changes colour permanently", why:"It returns to its normal state very quickly." }],
          hints:["Absorbed energy has to go somewhere in the molecule.", "Into an electron.", "The electron is boosted to a higher level."] }
      ],
      refreshers:{
        "Organelles":"Chloroplasts and mitochondria each have two membranes, their own small circular DNA and their own ribosomes.",
        "Membranes":"A membrane is a phospholipid bilayer: water-loving heads outside, oily tails inside. Molecules with long oily tails can sit inside it.",
        "Light and pigments":"Absorbing a photon excites one of the pigment’s electrons. Chlorophyll <i>a</i> is the main pigment; chlorophyll <i>b</i> and carotenoids are accessory pigments."
      }
    }
  },
  explore:{
    heading:"Chloroplast zoom",
    intro:"Dive from a leaf cell into a single photosystem. Then fire photons into the antenna and watch where the energy goes.",
    // Zoom levels and hotspot job lines (readout "Selected structure"); "where" names a spot without giving the answer (label quiz).
    levels:[["cell", "Palisade cell"], ["chloro", "Chloroplast (≈ 5 µm long)"], ["granum", "Granum"], ["mem", "Thylakoid membrane"], ["mol", "Chlorophyll molecule"]],
    hotspots:{
      chloro:{ name:"Chloroplast", job:"The organelle where photosynthesis happens, about 5 µm long. Choose the Chloroplast zoom level to look inside." },
      nucleus:{ name:"Nucleus", job:"Holds the cell’s own DNA, as linear chromosomes." },
      vacuole:{ name:"Vacuole", job:"Stores water and dissolved substances." },
      wall:{ name:"Cell wall", job:"A rigid cellulose layer outside the membrane that supports the cell." },
      outer:{ name:"Outer membrane", job:"The outer layer of the double envelope; it faces the cytoplasm.", where:"Outermost line around the chloroplast" },
      inner:{ name:"Inner membrane", job:"The inner layer of the envelope; it faces the stroma.", where:"Second line, just inside the outermost one" },
      stroma:{ name:"Stroma", job:"Fluid inside the chloroplast, around the thylakoids; sugar-making enzymes, DNA, ribosomes.", where:"Fluid filling the inside" },
      thylakoid:{ name:"Thylakoid", job:"A flattened membrane sac; its membrane holds the photosystems.", where:"End of one sac in the middle stack" },
      granum:{ name:"Granum", job:"A stack of thylakoids (plural: grana).", where:"A whole stack of thin sacs" },
      lumen:{ name:"Thylakoid lumen", job:"The space inside a thylakoid; H⁺ builds up here.", where:"Hollow centre of a sac in the middle stack" },
      lamella:{ name:"Stroma lamella", job:"An unstacked thylakoid that bridges two grana.", where:"Thin bridge between two stacks" },
      dna:{ name:"Chloroplast DNA", job:"Small circular DNA, like a bacterium’s; it carries some of the chloroplast’s own genes.", where:"Small looped strand" },
      ribosome:{ name:"Ribosome", job:"Small (70S) ribosomes, like a bacterium’s, that make some of the chloroplast’s own proteins." },
      starch:{ name:"Starch grain", job:"Stored sugar, made in the stroma.", where:"Large pale oval" },
      tmem:{ name:"Thylakoid membrane", job:"Holds the photosystems and electron carriers; light is absorbed here." },
      ps:{ name:"Photosystem", job:"An antenna of hundreds of pigments around a reaction centre. Choose Photosystem mode to fire photons at one." },
      chl:{ name:"Chlorophyll", job:"Held in the photosystem’s proteins; its oily tail anchors it in the membrane. Zoom to the Chlorophyll molecule level." },
      ring:{ name:"Ring", job:"The light-absorbing part of the molecule." },
      mg:{ name:"Magnesium atom", job:"Sits at the centre of the ring. Without magnesium, a plant can’t make chlorophyll." },
      tail:{ name:"Tail", job:"A long hydrocarbon chain that anchors the molecule in the thylakoid membrane. It doesn’t absorb light." },
      group:{ name:"Side group", job:"−CH₃ in chlorophyll <i>a</i>, −CHO in chlorophyll <i>b</i>: the one small group that differs between them. It shifts the colours each one absorbs." }
    },
    tubeNote:"Chlorophyll extracted from spinach, in a test tube in a dark room.",
    pathIntro:"Trace the photon (challenge 1): tap, in order, the parts it passes through or reaches.",
    pathParts:[["outer", "outer membrane"], ["inner", "inner membrane"], ["stroma", "stroma"], ["tmem", "thylakoid membrane"], ["stoma", "stoma"], ["lumen", "thylakoid lumen"]],
    modelNote:"Model values: photons captured per second = antenna size × light factor (Low 0.25, Moderate 0.5, High 1.0). A reaction centre’s top speed is 100 electrons per second. The numbers are illustrative: real antennas hold roughly 200–300 pigments per reaction centre.",
    predIntro:"Make a prediction first. Then the zoom or the photosystem will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"zoom", tube:true },
        prompt:"<span class=\"muted\">A test tube holds chlorophyll extracted from spinach.</span> The tube is lit with blue light in a dark room. What will you see?",
        options:[{ t:"A red glow", ok:true }, { t:"A green glow" }, { t:"Nothing at all" }, { t:"Bubbles of O₂" }],
        explain:"Isolated chlorophyll absorbs the light, but there’s no acceptor to take the excited electron. The energy comes back out as red light (fluorescence) and heat. No O₂: there’s no working photosystem." },
      { id:"p2", start:{ mode:"ps", nm:550 },
        prompt:"<span class=\"muted\">A single 550 nm photon is fired at the antenna.</span> What will most likely happen to this green photon?",
        options:[{ t:"It passes through or is reflected", ok:true }, { t:"It is absorbed by chlorophyll <i>a</i>" }, { t:"It sends two electrons" }, { t:"It turns into a red photon" }],
        explain:"The pigments absorb little green (module 02)." },
      { id:"p3", start:{ mode:"ps", nm:450, slow:true },
        prompt:"<span class=\"muted\">A single 450 nm photon, in slow motion.</span> As the energy moves from the first antenna pigment toward the centre, what is passed from pigment to pigment?",
        options:[{ t:"Energy", ok:true }, { t:"An electron" }, { t:"A proton" }, { t:"An ATP molecule" }],
        explain:"Energy hops between neighbouring pigments. Only the reaction centre hands an electron to the acceptor." },
      { id:"p4", start:{ mode:"rate", light:"low", ant:100, to:200 },
        prompt:"<span class=\"muted\">Rate view: Low light, and the antenna grows from 100 to 200 pigments.</span> What happens to the electrons sent per second?",
        options:[{ t:"They double, from 25 to 50", ok:true }, { t:"They stay at 25" }, { t:"They reach the maximum of 100" }, { t:"They halve" }],
        explain:"In dim light, the reaction centre is waiting for energy. A bigger antenna catches more." }
    ],
    chalIntro:"Use the zoom (challenge 1: the photon path under the diagram) or the photosystem (challenges 2 and 3), then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"A photon enters a chloroplast and is absorbed by chlorophyll. Tap, in order, the parts it passes through or reaches.",
        why:"Outer membrane → inner membrane → stroma → thylakoid membrane: through the envelope, across the fluid, to the chlorophyll held in a thylakoid’s membrane.",
        general:"Start at the envelope and end where the chlorophyll is. Use the photon path chips under the diagram in Zoom mode; press Clear to start again.",
        hints:["First get through the envelope.", "Then cross the fluid to a thylakoid.", "Outer → inner → stroma → thylakoid membrane."] },
      { id:"tc2", goal:[3, 4], prompt:"At moderate light, set the <strong>smallest</strong> antenna that keeps the reaction centre at its top speed.",
        why:"200 × 0.5 = 100 photons per second: exactly the reaction centre’s top speed, with nothing wasted.",
        hints:["Top speed is 100 electrons per second.", "Moderate light: each pigment catches 0.5 photons per second.", "100 ÷ 0.5 = 200 pigments."] },
      { id:"tc3", goal:4, stretch:true, prompt:"A maple has shade leaves on its low branches (low light) and sun leaves at the top (high light). Set and save an antenna for each, so both reaction centres run at top speed with <strong>no</strong> energy wasted.",
        why:"Shade: 400 × 0.25 = 100. Sun: 100 × 1.0 = 100. Both reaction centres run at top speed, and nothing is wasted.",
        hints:["Divide 100 by each light factor.", "Low: 100 ÷ 0.25; High: 100 ÷ 1.0.", "Shade 400, sun 100. Real shade leaves do build bigger antennas, with more chlorophyll <i>b</i>."] }
    ]
  },
  part3:{
    slug:"where", name:"Where",
    heading:"Which reactions happen where?",
    intro:"You’ve explored the chloroplast’s parts. Now map the processes of photosynthesis onto them, then weigh the evidence for where chloroplasts came from.",
    sorterTitle:"Station 1: the process sorter",
    sorterHow:"Tap a card, then tap the region of the chloroplast where it happens: <strong>Thylakoid membrane</strong>, <strong>Thylakoid lumen</strong> or <strong>Stroma</strong>. Each correct card gets a <strong>Zoom to the molecules</strong> button that plays a 3-second clip of the event.",
    regions:[{ id:"tm", t:"Thylakoid membrane" }, { id:"lu", t:"Thylakoid lumen" }, { id:"st", t:"Stroma" }],
    cards:[
      { id:"c1", t:"Light is absorbed by chlorophyll", answer:"tm", clip:"A photon’s energy is absorbed by a chlorophyll held in a photosystem, in the thylakoid membrane." },
      { id:"c2", t:"Photosystems and electron carriers are held in place", answer:"tm", clip:"The membrane holds the complexes in a fixed order, so an electron can pass from one to the next." },
      { id:"c3", t:"ATP synthase sits here", answer:"tm", clip:"ATP synthase spans the thylakoid membrane. H⁺ flows through it from the lumen to the stroma." },
      { id:"c4", t:"Water molecules are split and O₂ is released", answer:"lu", note:"On the membrane’s inner face.", clip:"At photosystem II, on the lumen side: 2H₂O → 4H⁺ + 4e⁻ + O₂. The H⁺ stays in the lumen." },
      { id:"c5", t:"H⁺ ions build up to a high concentration", answer:"lu", clip:"H⁺ ions pile up inside the thylakoid, far more than in the stroma (module 06)." },
      { id:"c6", t:"ATP is made (ATP synthase’s head faces this way)", answer:"st", wrong:{ tm:"ATP synthase is <strong>in</strong> the membrane, but the ATP is released into the stroma." }, clip:"In the head of ATP synthase, on the stroma side, ADP + Pᵢ → ATP." },
      { id:"c7", t:"NADPH is made", answer:"st", clip:"On the stroma side of photosystem I, electrons and H⁺ turn NADP⁺ into NADPH." },
      { id:"c8", t:"CO₂ is fixed by the enzyme rubisco", answer:"st", wrong:{ lu:"Rubisco works in the stroma." }, clip:"Rubisco joins CO₂ to a 5-carbon sugar; the product splits into two 3-carbon molecules (module 08)." },
      { id:"c9", t:"Sugar (G3P) is built", answer:"st", clip:"ATP and NADPH from the light reactions power the building of G3P, a 3-carbon sugar." },
      { id:"c10", t:"Chloroplast DNA and ribosomes are found", answer:"st", clip:"A 70S ribosome reads a message copied from the chloroplast’s own DNA and builds a protein, right in the stroma." }
    ],
    wrongDefault:"Check which side of the thylakoid membrane faces this space.",
    dataTitle:"Station 2: Check it with data — endosymbiosis",
    dataHow:"The table compares a cyanobacterium (a photosynthetic bacterium), a chloroplast, and the plant cell’s own nucleus and cytoplasm. Tap each row that supports endosymbiosis to see why.",
    table:{
      head:["Feature", "Cyanobacterium", "Chloroplast", "Plant cell (nucleus and cytoplasm)"],
      rows:[
        { id:"r1", cells:["DNA shape", "Circular", "Circular", "Linear chromosomes"], why:"The chloroplast’s DNA is circular, like the bacterium’s; the plant cell’s own chromosomes are linear." },
        { id:"r2", cells:["Ribosome size", "Small (70S)", "Small (70S)", "Large (80S)"], why:"The chloroplast’s ribosomes are the small 70S type found in bacteria, not the plant cell’s 80S type." },
        { id:"r3", cells:["Membranes around it", "Its own cell membrane", "Two (inner and outer)", "n/a"], why:"Two membranes: the inner from the bacterium’s own membrane, the outer from the host cell that engulfed it." },
        { id:"r4", cells:["How it divides", "Splits in two", "Splits in two, on its own", "Mitosis"], why:"A chloroplast splits in two on its own, as a bacterium does; the cell can’t build one from scratch." },
        { id:"r5", cells:["Photosynthesis genes", "Similar", "Similar", "n/a"], why:"The chloroplast’s photosynthesis genes are similar to the cyanobacterium’s, as you’d expect from a shared ancestor." }
      ]
    },
    closing:"Lynn Margulis argued for this idea in the 1960s; it’s now strongly supported. The inner membrane came from the bacterium, the outer from the host cell that engulfed it.",
    quickCheck:{
      title:"Quick check", summary:"Where quick check",
      items:[
        { id:"q1", goal:1, prompt:"Where are photosystems found?",
          choices:[{ t:"Thylakoid membrane", ok:true, fb:"Pigments are anchored in the thylakoid membranes." },
            { t:"Stroma", fb:"Pigments are anchored in the thylakoid membranes." },
            { t:"Lumen", fb:"Pigments are anchored in the thylakoid membranes." },
            { t:"Outer membrane", fb:"Pigments are anchored in the thylakoid membranes." }] },
        { id:"q2", goal:1, prompt:"Where do H⁺ ions build up?",
          choices:[{ t:"Thylakoid lumen", ok:true, fb:"Inside the thylakoids (module 06)." },
            { t:"Stroma", fb:"Inside the thylakoids (module 06)." },
            { t:"Cytoplasm", fb:"Inside the thylakoids (module 06)." },
            { t:"Between the envelope membranes", fb:"Inside the thylakoids (module 06)." }] },
        { id:"q3", goal:5, prompt:"Which evidence supports endosymbiosis?",
          choices:[{ t:"Chloroplasts have 70S ribosomes", ok:true, fb:"Bacteria-sized ribosomes point to a bacterial ancestor." },
            { t:"Chloroplasts are green", fb:"Bacteria-sized ribosomes point to a bacterial ancestor." },
            { t:"Chloroplasts contain starch", fb:"Bacteria-sized ribosomes point to a bacterial ancestor." },
            { t:"Chloroplasts are in leaves", fb:"Bacteria-sized ribosomes point to a bacterial ancestor." }] },
        { id:"q4", goal:5, prompt:"Why does a chloroplast have two membranes?",
          choices:[{ t:"The inner came from the bacterium, the outer from the engulfing host", ok:true, fb:"Engulfing wraps the bacterium in a piece of the host’s membrane." },
            { t:"Two membranes absorb more light", fb:"Engulfing wraps the bacterium in a piece of the host’s membrane." },
            { t:"One is for ATP, one for sugar", fb:"Engulfing wraps the bacterium in a piece of the host’s membrane." },
            { t:"It copied the nucleus", fb:"Engulfing wraps the bacterium in a piece of the host’s membrane." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"label", type:"custom", title:"Label the chloroplast", summary:"Label the chloroplast", goal:1,
        instruction:"Tap a label, then tap the structure it names.", how:"",
        labels:[
          { id:"outer", t:"outer membrane", hints:["Which membrane faces the cytoplasm?", "The envelope has two membranes; this is the outside one.", "Tap the outermost line around the chloroplast."] },
          { id:"inner", t:"inner membrane", hints:["Which membrane faces the stroma?", "It’s the second line of the envelope, just inside the outer one.", "Tap the line just inside the outermost one."] },
          { id:"stroma", t:"stroma", hints:["Which part is the chloroplast’s fluid?", "It surrounds the thylakoids.", "Tap the fluid-filled space between the stacks."] },
          { id:"thylakoid", t:"thylakoid", hints:["Which part is one flattened membrane sac?", "In the middle stack, each layer is one sac.", "Tap the end of one sac in the middle stack."] },
          { id:"granum", t:"granum", hints:["Which part is a stack of sacs?", "There are compact stacks on the left and the right.", "Tap a whole stack of thin sacs."] },
          { id:"lumen", t:"thylakoid lumen", hints:["Look inside a single thylakoid.", "It’s the space enclosed by the thylakoid membrane.", "Tap the hollow centre of a thylakoid."] },
          { id:"lamella", t:"stroma lamella", hints:["Which part links one stack to another?", "It’s an unstacked thylakoid.", "Tap a thin bridge between two stacks."] },
          { id:"dna", t:"chloroplast DNA", hints:["Where does the chloroplast keep its own genes?", "Its DNA is circular, like a bacterium’s.", "Tap the small looped strand."] },
          { id:"starch", t:"starch grain", hints:["Where is sugar stored in a chloroplast?", "It’s a large grain in the stroma.", "Tap the large pale oval."] }
        ],
        pairs:{
          "lumen|stroma":"Stroma surrounds the thylakoids; lumen is inside one.",
          "granum|thylakoid":"A thylakoid is one sac; a granum is a stack of them.",
          "lamella|thylakoid":"Stroma lamellae are the unstacked thylakoid bridges between grana.",
          "inner|outer":"The outer one faces the cytoplasm."
        },
        wrongDefault:"Read the hotspot’s job, then try again." },
      { id:"puzzles", type:"custom", title:"Photosystem puzzles", summary:"Photosystem puzzles", star:true, goal:[2, 3, 4, 5],
        instruction:"Six puzzles on the photosystem model and on real leaves. The last four are non-routine.",
        items:[
          { id:"y1", kind:"num", goal:[3, 4], use:USE, prompt:"Moderate light, antenna 300, acceptor working. Electrons sent per second?",
            answer:100, display:"100 electrons per second", unit:"per s",
            wrong:[{ match:150, fb:"That’s photons captured; the reaction centre tops out at 100." }],
            hints:["Photons captured = antenna × light factor.", "300 × 0.5 = 150 photons per second are captured.", "The reaction centre tops out at 100, so 100 electrons per second."] },
          { id:"y2", kind:"num", goal:4, use:USE, prompt:"Same settings. Energy lost as heat and fluorescence per second?",
            answer:50, display:"50 photons’ worth per second", unit:"per s",
            wrong:[{ match:0, fb:"150 captured − 100 used = 50 lost." }],
            hints:["Lost = captured − used.", "150 are captured; the reaction centre uses 100.", "150 − 100 = 50 per second lost as heat and fluorescence."] },
          { id:"y3", kind:"pair", goal:4, star:true, use:USE, prompt:"High light, antenna 50, acceptor <strong>blocked</strong>. Electrons sent and energy lost per second?",
            answer:[0, 50], labels:["Electrons sent per second", "Energy lost per second"], display:"0 sent, 50 lost",
            wrongFb:"Blocked acceptor: every captured photon’s energy is lost.",
            hints:["What happens when the acceptor is blocked?", "No electrons can leave the reaction centre.", "Captured = 50 × 1.0 = 50, and all of it is lost."] },
          { id:"y4", kind:"mc", goal:3, star:true, prompt:"Shade leaves have a <strong>lower</strong> chlorophyll <i>a</i> : <i>b</i> ratio than sun leaves. Which explanation fits?",
            options:[
              { t:"Shade leaves build bigger antennas, which are rich in chlorophyll <i>b</i>", ok:true, why:"Reaction centres use chlorophyll <i>a</i>; the extra antenna pigment in shade is largely chlorophyll <i>b</i>." },
              { t:"Shade leaves have no chlorophyll <i>a</i>", why:"Reaction centres use chlorophyll <i>a</i>; the extra antenna pigment in shade is largely chlorophyll <i>b</i>." },
              { t:"Chlorophyll <i>b</i> is the reaction centre in shade", why:"Reaction centres use chlorophyll <i>a</i>; the extra antenna pigment in shade is largely chlorophyll <i>b</i>." },
              { t:"Sun breaks down chlorophyll <i>b</i> only", why:"Reaction centres use chlorophyll <i>a</i>; the extra antenna pigment in shade is largely chlorophyll <i>b</i>." }],
            hints:["Which pigment is in every reaction centre?", "Chlorophyll <i>a</i>. The extra pigment in a bigger antenna is mostly chlorophyll <i>b</i>.", "Shade leaves build bigger antennas, rich in chlorophyll <i>b</i>, so their <i>a</i> : <i>b</i> ratio is lower."] },
          { id:"y5", kind:"mc", goal:4, star:true, prompt:"An investigation: chlorophyll extract glows red under blue light. A student adds a chemical that accepts excited electrons. Predict the glow.",
            options:[
              { t:"It dims, because the energy now leaves as electrons", ok:true, why:"Fluorescence is what’s left when no acceptor takes the electron." },
              { t:"It brightens", why:"Fluorescence is what’s left when no acceptor takes the electron." },
              { t:"It turns green", why:"Fluorescence is what’s left when no acceptor takes the electron." },
              { t:"It stays the same", why:"Fluorescence is what’s left when no acceptor takes the electron." }],
            hints:["Why does extracted chlorophyll glow?", "The excited electron has nowhere to go, so its energy comes back out as light.", "With an acceptor, the energy leaves as electrons, so the glow dims."] },
          { id:"y6", kind:"mc", goal:2, star:true, prompt:"Magnesium moves easily inside a plant, so in a magnesium-poor soil the plant moves it from old leaves to new ones. Which leaves turn yellow first, and why?",
            options:[
              { t:"Older leaves, because their magnesium is moved out and their chlorophyll can’t be replaced", ok:true, why:"Mobile nutrients leave old leaves first, so the symptoms show there." },
              { t:"Young leaves, because they grow fastest", why:"Mobile nutrients leave old leaves first, so the symptoms show there." },
              { t:"All leaves equally", why:"Mobile nutrients leave old leaves first, so the symptoms show there." },
              { t:"The veins only", why:"Mobile nutrients leave old leaves first, so the symptoms show there." }],
            hints:["Magnesium is at the centre of every chlorophyll.", "If the plant moves it to new leaves, the old leaves lose it.", "Old leaves turn yellow first."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Alejandro", how:"",
        instruction:"Alejandro made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Describe how light energy reaches the reaction centre.",
            steps:["A photon is absorbed by an antenna pigment, exciting one of its electrons.", "That pigment passes the excited electron to the next pigment, and so on toward the centre.", "The reaction centre’s chlorophyll <i>a</i> pair is excited.", "It sends an electron to the primary electron acceptor."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 is fine. The mistake is earlier.", "Step 4 is correct."],
            fixes:[
              { t:"The pigment passes the <strong>energy</strong> to the next pigment; its own electron drops back down.", ok:true, why:E1W },
              { t:"The pigment passes a proton along.", why:E1W },
              { t:"The pigment releases the energy as heat.", why:E1W },
              { t:"Step 2 is correct.", why:E1W }],
            hints:["What travels between antenna pigments?", "Not a particle.", "Energy."] },
          { id:"e2", goal:1, task:"Describe where the parts of photosynthesis are in a chloroplast.",
            steps:["A chloroplast is wrapped in two membranes.", "Inside is the stroma, a fluid full of enzymes.", "Chlorophyll molecules float in the stroma, where they catch light.", "Sugar is made in the stroma using the light reactions’ products."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 is correct."],
            fixes:[
              { t:"Chlorophyll is anchored in the thylakoid membranes, in photosystems.", ok:true, why:E2W },
              { t:"Chlorophyll floats in the lumen.", why:E2W },
              { t:"Chlorophyll sits in the outer membrane.", why:E2W },
              { t:"Step 3 is correct.", why:E2W }],
            hints:["What does chlorophyll’s tail do?", "It anchors the molecule in a membrane.", "Which membrane? The thylakoid’s."] },
          { id:"e3", goal:5, task:"Summarize the evidence that chloroplasts were once bacteria.",
            steps:["Chloroplasts have their own circular DNA, like bacteria.", "Their ribosomes are the small 70S type found in bacteria.", "They have a single membrane, as you’d expect for a bacterium swallowed whole.", "They divide by splitting in two."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 is correct."],
            fixes:[
              { t:"They have two membranes: the inner from the bacterium, the outer from the host cell that engulfed it.", ok:true, why:E3W },
              { t:"They have no membrane at all.", why:E3W },
              { t:"They have three membranes.", why:E3W },
              { t:"Step 3 is correct.", why:E3W }],
            hints:["How many membranes surround a chloroplast?", "Two.", "One from each partner."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you: the red glow of extracted chlorophyll, or the reaction centre’s speed limit?" },
      { id:"j2", q:"In your own words, what’s the difference between what antenna pigments do and what the reaction centre does?" },
      { id:"j3", q:"Explain to a friend where the stroma and the lumen are, and why the difference matters." },
      { id:"j4", q:"Which part of the chloroplast are you still unsure about? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Where are the photosystems found?", options:[
          { t:"In the thylakoid membranes", ok:true, why:"Photosystems are protein complexes held in the thylakoid membranes, where light is absorbed." },
          { t:"Dissolved in the stroma", why:M1 },
          { t:"In the outer membrane of the envelope", why:"The envelope just encloses the chloroplast." },
          { t:"In the thylakoid lumen", why:"The lumen is the space inside, not the membrane." }] },
        b:{ prompt:"Where are the enzymes that fix CO₂ found?", options:[
          { t:"In the stroma", ok:true, why:"Rubisco and the other sugar-making enzymes work in the stroma." },
          { t:"In the thylakoid membranes", why:"The membranes hold the light-capturing parts." },
          { t:"In the thylakoid lumen", why:M4 },
          { t:"In the stoma", why:"A stoma is a leaf pore." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which atom sits at the centre of a chlorophyll molecule’s ring?", options:[
          { t:"Magnesium", ok:true, why:"Magnesium sits at the centre of the light-absorbing ring." },
          { t:"Iron", why:"Iron is at the centre of heme in hemoglobin." },
          { t:"Nitrogen", why:"Nitrogen atoms surround the centre; they aren’t the centre." },
          { t:"Carbon", why:"The ring is mostly carbon, but its centre is a metal atom." }] },
        b:{ prompt:"What does chlorophyll’s long hydrocarbon tail do?", options:[
          { t:"Anchors the molecule in the thylakoid membrane", ok:true, why:"The oily tail sits among the membrane’s lipid tails and holds the molecule in place." },
          { t:"Absorbs red light", why:"The ring absorbs light." },
          { t:"Carries electrons to the acceptor", why:"The reaction centre ring sends the electron." },
          { t:"Stores sugar", why:"Sugar is stored as starch in the stroma." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"In a photosystem, what does the reaction centre do that antenna pigments don’t?", options:[
          { t:"It transfers an excited electron to the primary electron acceptor.", ok:true, why:"Antenna pigments absorb light and pass energy; only the reaction centre hands an electron to the acceptor." },
          { t:"It absorbs light.", why:"Antenna pigments absorb light too." },
          { t:"It reflects green light.", why:"All chlorophylls reflect green." },
          { t:"It makes ATP.", why:"ATP is made later, by ATP synthase." }] },
        b:{ prompt:"What do antenna pigments pass to the reaction centre?", options:[
          { t:"Energy", ok:true, why:"Energy hops from pigment to pigment; no particle moves until the reaction centre." },
          { t:"Electrons", why:M2 },
          { t:"Protons", why:"Protons come into it later, in module 06." },
          { t:"ATP", why:"ATP isn’t made in the antenna." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Chlorophyll extracted into a test tube glows red under blue light, but chlorophyll in a healthy leaf barely glows. Which explanation fits?", options:[
          { t:"In the leaf, the absorbed energy sends electrons to an acceptor; in the tube there’s no acceptor, so the energy is released as red light and heat.", ok:true, why:"With no acceptor, the excited electron falls back and its energy leaves as red light and heat." },
          { t:"Leaves reflect red light, hiding the glow.", why:"Leaves reflect green, not red." },
          { t:"The extracted chlorophyll was damaged by the solvent.", why:"The extract still absorbs light; it just can’t pass electrons on." },
          { t:"Only chlorophyll <i>b</i> glows, and leaves have little of it.", why:"Chlorophyll <i>a</i> fluoresces too." }] },
        b:{ prompt:"A herbicide blocks a photosystem’s primary electron acceptor. Predict what happens to the leaf’s red fluorescence.", options:[
          { t:"It increases, because absorbed energy can no longer leave as electrons.", ok:true, why:"With the acceptor blocked, more of the absorbed energy comes back out as red light and heat." },
          { t:"It decreases, because less light is absorbed.", why:"Absorption isn’t affected; only the electron’s exit is blocked." },
          { t:"It stays the same, because fluorescence doesn’t depend on the acceptor.", why:M6 },
          { t:"It stops, because the pigments are destroyed.", why:"The herbicide blocks the acceptor; the pigments still absorb." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"At moderate light each antenna pigment captures 0.5 photons per second, and a reaction centre’s top speed is 100 electrons per second. With 300 antenna pigments, how much energy is lost as heat and fluorescence each second?", options:[
          { t:"50 photons’ worth", ok:true, why:"150 captured − 100 used." },
          { t:"None", why:"A bigger antenna isn’t free." },
          { t:"100 photons’ worth", why:"That’s the amount used." },
          { t:"150 photons’ worth", why:"That’s the amount captured." }] },
        b:{ prompt:"In low light each pigment captures 0.25 photons per second. With 300 antenna pigments, how much energy is lost each second?", options:[
          { t:"None: 75 photons per second is below the reaction centre’s top speed", ok:true, why:"300 × 0.25 = 75 photons per second, below the top speed of 100, so the reaction centre uses all of it." },
          { t:"25 photons’ worth", why:"75 &lt; 100, so the reaction centre uses all of it." },
          { t:"75 photons’ worth", why:"That’s the amount captured, all of it used." },
          { t:"200 photons’ worth", why:"That’s 300 − 100, which mixes pigments with photons." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"An antibiotic that blocks bacterial 70S ribosomes stops protein-making inside chloroplasts but not in the rest of the plant cell. Which conclusion does this support?", options:[
          { t:"Chloroplast ribosomes resemble bacterial ribosomes: evidence that chloroplasts came from bacteria.", ok:true, why:"Only the chloroplasts’ protein-making stopped, so their ribosomes must be like bacterial 70S ribosomes." },
          { t:"The antibiotic kills the plant cell’s nucleus.", why:"Protein-making outside the chloroplast continued." },
          { t:"Chloroplasts make all the cell’s proteins.", why:"The rest of the cell kept making proteins." },
          { t:"Chloroplasts have no ribosomes.", why:"Then the antibiotic would have nothing to block there." }] },
        b:{ prompt:"A drug that blocks bacterial DNA copying stops chloroplasts from dividing but doesn’t stop the nucleus from dividing. Which conclusion does this support?", options:[
          { t:"Chloroplasts copy their own DNA in a bacteria-like way: evidence that they came from bacteria.", ok:true, why:"Only the chloroplasts were affected, so they copy their DNA the way bacteria do." },
          { t:"Chloroplasts have no DNA.", why:"Then there’d be nothing to copy." },
          { t:"The nucleus contains chloroplast DNA only.", why:"The nucleus kept dividing normally." },
          { t:"The drug destroys chlorophyll.", why:"Nothing here involves pigments." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why thylakoids are stacked into grana?", options:[
          { t:"“Stacking packs a huge area of membrane into a small space, so each chloroplast can hold many photosystems.”", ok:true, why:"More membrane means more photosystems in the same small chloroplast." },
          { t:"“Stacks hold the stroma’s enzymes in place.”", why:"The enzymes are in the fluid around the stacks." },
          { t:"“Stacking keeps light out of the stroma.”", why:"Light isn’t kept out; it’s absorbed in the membranes." },
          { t:"“Grana store the sugar the chloroplast makes.”", why:"Sugar is stored as starch grains in the stroma." }] },
        b:{ prompt:"Which is the best explanation of why photosystems are built into a membrane instead of floating in the stroma?", options:[
          { t:"“The membrane holds pigments and carriers in a fixed order, so energy and electrons pass along efficiently, and it separates the lumen from the stroma.”", ok:true, why:"A fixed order lets energy and electrons pass along quickly, and the membrane keeps the lumen and the stroma apart." },
          { t:"“Membranes absorb green light that pigments miss.”", why:M1 },
          { t:"“Floating pigments would dissolve in the stroma’s sugar.”", why:"That isn’t the reason." },
          { t:"“Membranes make ATP without any light.”", why:"ATP synthase needs a gradient powered by light." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which statement about chlorophyll <i>a</i> and chlorophyll <i>b</i> is correct?", options:[
          { t:"“They differ by one small group on the ring, which shifts the wavelengths each one absorbs.”", ok:true, why:"Chlorophyll <i>a</i> has −CH₃ where chlorophyll <i>b</i> has −CHO; that one change shifts the absorption peaks." },
          { t:"“They have different central atoms.”", why:M7 },
          { t:"“Chlorophyll <i>b</i> has no tail, so it floats in the stroma.”", why:M1 },
          { t:"“Chlorophyll <i>b</i> is found only in the reaction centre.”", why:"Reaction centres use chlorophyll <i>a</i>." }] },
        b:{ prompt:"Which best explains why magnesium-deficient leaves turn yellow?", options:[
          { t:"“Without magnesium, the plant can’t make chlorophyll, so the yellow carotenoids show through.”", ok:true, why:"Magnesium is part of every chlorophyll; with less chlorophyll, the carotenoids’ yellow shows." },
          { t:"“Magnesium is a yellow pigment that builds up.”", why:"Magnesium isn’t a pigment." },
          { t:"“Magnesium deficiency turns chlorophyll <i>a</i> into chlorophyll <i>b</i>.”", why:"Both need magnesium." },
          { t:"“The tail falls off chlorophyll without magnesium.”", why:"Magnesium sits in the ring, not the tail." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"Plants on a dim forest floor build larger antennas around each reaction centre than plants in open fields. How does this help them?", options:[
          { t:"A larger antenna catches enough of the scarce light to keep each reaction centre busy.", ok:true, why:"In dim light each pigment catches few photons, so more pigments are needed to keep the reaction centre supplied." },
          { t:"Larger antennas need less light to be absorbed.", why:"Each pigment still needs photons to arrive." },
          { t:"Larger antennas make more reaction centres.", why:"The number of reaction centres is separate." },
          { t:"Larger antennas reflect more green light.", why:M5 }] },
        b:{ prompt:"Plants in full sun build smaller antennas around each reaction centre. How does this help them?", options:[
          { t:"They avoid capturing more energy than the reaction centres can use, which would be wasted as heat and could cause damage.", ok:true, why:"In bright light a small antenna already captures enough to keep the reaction centre at top speed." },
          { t:"Smaller antennas absorb more light.", why:"They absorb less per reaction centre." },
          { t:"Smaller antennas move electrons faster.", why:"Speed is limited by the reaction centre." },
          { t:"Sun plants don’t need chlorophyll.", why:"They still need it in every photosystem." }] } },
      { id:"a2", cat:"A", goal:2,
        a:{ prompt:"An Ontario potato farmer sees yellowing between the veins of older leaves, and a soil test shows low magnesium. Which explanation and fix fit best?", options:[
          { t:"Magnesium is needed to make chlorophyll; add a magnesium-containing fertilizer.", ok:true, why:"Magnesium is the centre atom of every chlorophyll; adding it lets the plant make chlorophyll again." },
          { t:"Iron is missing from chlorophyll; add iron.", why:M7 },
          { t:"The leaves have too much chlorophyll; add less nitrogen.", why:"Yellowing means less chlorophyll, not more." },
          { t:"The plant needs more sunlight; prune nearby trees.", why:"The soil test points to magnesium." }] },
        b:{ prompt:"A hydroponic lettuce grower accidentally leaves magnesium out of the nutrient solution. What will happen over the next weeks?", options:[
          { t:"Leaves turn yellow, starting with older ones, and photosynthesis slows because less chlorophyll is made.", ok:true, why:"The plant moves its magnesium to new leaves, so old leaves lose chlorophyll first, and less chlorophyll captures less light." },
          { t:"Leaves turn darker green.", why:"There will be less chlorophyll, not more." },
          { t:"Nothing, because magnesium isn’t used in photosynthesis.", why:M7 },
          { t:"Only the roots are affected.", why:"Chlorophyll is made in the leaves." }] } }
    ]
  },
  task:{
    title:"Prove the chloroplasts did it", summary:"Prove the chloroplasts did it",
    statement:"<p>Isolated chloroplasts in light can pass electrons to a blue dye, DCPIP, which turns colourless when it gains electrons (Robert Hill showed this in 1937). Design a set of test tubes that shows the change needs <strong>working chloroplasts and light</strong>. Can you find all the designs?</p><p class=\"tiny muted\">Fill up to 5 tube slots. Each tube needs its chloroplasts, DCPIP and conditions. Press <strong>Run</strong> to see the predicted result.</p>",
    checks:[
      "<strong>The test tube:</strong> fresh chloroplasts + DCPIP + light",
      "<strong>Dark control:</strong> fresh chloroplasts + DCPIP + dark",
      "<strong>Chloroplast control:</strong> no chloroplasts or boiled chloroplasts, + DCPIP + light",
      "<strong>Every tube has DCPIP</strong>",
      "<strong>3 or 4 tubes</strong> (different ones)"
    ],
    tips:["You need a tube where everything is present.", "To show light is needed, change only the light.", "To show working chloroplasts are needed, remove or boil them but keep the light.", "A tube without dye can’t change colour, so it tells you nothing here.", "Keep it tight: 3 or 4 different tubes."],
    slots:5,
    inputs:[
      { id:"chl", label:"Chloroplasts", options:[["F", "fresh"], ["B", "boiled"], ["N", "none"]] },
      { id:"dye", label:"DCPIP", options:[["Y", "yes"], ["X", "no"]] },
      { id:"cond", label:"Conditions", options:[["L", "light"], ["D", "dark"]] }
    ],
    afterAll:"Each design changes one thing at a time. That’s what makes it a fair test.",
    explainPrompt:"Explain what each tube in your design proves.",
    vocab:"Use the words control, variable, electron acceptor and thylakoid.",
    more:"There’s more than one design. Can you find another?"
  },
  cards:[
    ["Chloroplast envelope", "Two membranes, outer and inner, around the chloroplast."],
    ["Stroma", "Fluid inside the chloroplast, around the thylakoids; sugar-making enzymes, DNA, ribosomes."],
    ["Thylakoid", "A flattened membrane sac; its membrane holds the photosystems."],
    ["Granum", "A stack of thylakoids (plural: grana)."],
    ["Thylakoid lumen", "The space inside a thylakoid; H⁺ builds up here."],
    ["Chlorophyll structure", "Light-absorbing ring with Mg at its centre, plus a hydrocarbon tail that anchors it in the membrane."],
    ["Photosystem", "An antenna of hundreds of pigments around a reaction centre."],
    ["Antenna pigments", "Absorb photons and pass the <strong>energy</strong> toward the reaction centre."],
    ["Reaction centre", "A special pair of chlorophyll <i>a</i> molecules that sends an excited <strong>electron</strong> to the primary acceptor."],
    ["Fluorescence", "Light given off when absorbed energy can’t be used; isolated chlorophyll glows red."],
    ["Endosymbiosis", "Chloroplasts descend from bacteria engulfed by another cell: circular DNA, 70S ribosomes, two membranes."],
    ["Stroma vs stoma", "Stroma: chloroplast fluid. Stoma: leaf pore."]
  ]
};
