// SBI4U 01 Leaf Structure. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/01-leaf-structure.md
// Misconception core sentences (plan §3), reused where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "The cuticle is waxy and almost gas-tight. CO₂ enters through the stomata and spreads through the air spaces.";
const M2 = "Epidermis cells are clear, with no chloroplasts (except guard cells), so light passes through to the mesophyll.";
const M3 = "Xylem brings water and minerals up from the roots; phloem carries sugars away from the leaf.";
const M4 = "On most horizontal leaves, stomata are mainly underneath, away from the hot sun. Floating leaves are the exception.";
const M5 = "Gases diffuse from higher to lower concentration. Photosynthesis and respiration keep the concentrations different.";
const M6 = "The cuticle is a clear, waxy waterproof layer. Most water vapour leaves through the stomata.";
const M7 = "Closed stomata cut the CO₂ supply, so photosynthesis slows as the CO₂ inside is used up.";
const EPI = "One layer of clear cells (no chloroplasts, except guard cells) that protects the leaf.";
const AB = "The same tree builds different leaves. Strong light can be used by two palisade layers. In shade, a thin, wide leaf catches more of the little light there is.";

export default {
  id:"01-leaf-structure",
  kind:"topic",
  title:"Leaf structure",
  topic:"Leaf Structure",
  readyTopic:"leaf structure",
  hero:{
    headline:"A leaf is a solar panel that breathes",
    text:"Every layer of a leaf has a job. The <strong>palisade mesophyll</strong> catches light, the <strong>spongy mesophyll</strong> lets gases spread, <strong>veins</strong> bring water and carry sugar away, and <strong>stomata</strong> let CO₂ in. But every open stoma also lets water out, so a leaf is always balancing the two.",
    fig:{ html:'<div class="lf-hero" id="lf-hero" role="img" aria-label="A maple leaf is sliced and the cut face turns toward you as a cross-section, labelled top to bottom: cuticle, upper epidermis, palisade mesophyll, spongy mesophyll, lower epidermis with a stoma. Sunlight enters from the top and fades in the palisade layer. CO₂ drifts in through the stoma and spreads through the air spaces; O₂ and water vapour drift out."></div>' }
  },
  goals:[
    "I can identify the tissues in a leaf cross-section and state each one’s job.",
    "I can explain how the palisade and spongy mesophyll are built for catching light and exchanging gases.",
    "I can trace the paths of CO₂, O₂ and water through a leaf, and explain why each gas moves the way it does.",
    "I can explain how stomata, guard cells and the cuticle balance gas exchange against water loss.",
    "I can link leaf features to the habitat a plant lives in."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Plant cells", goal:1,
          prompt:"Which organelle carries out photosynthesis?",
          options:[
            { t:"Chloroplast", ok:true, why:"Chloroplasts hold chlorophyll and the enzymes that make sugar." },
            { t:"Mitochondrion", why:"Mitochondria release energy from sugar." },
            { t:"Vacuole", why:"The vacuole stores water and dissolved substances." },
            { t:"Nucleus", why:"The nucleus holds DNA; it controls the cell but doesn’t make sugar." }],
          hints:["Which organelle is green?", "It contains chlorophyll.", "The chloroplast."] },
        { id:"w2", skill:"Plant cells", goal:1,
          prompt:"Which structure do plant cells have that animal cells don’t?",
          options:[
            { t:"A cellulose cell wall", ok:true, why:"Plant cells have a cell wall outside the membrane." },
            { t:"A cell membrane", why:"All cells have a membrane." },
            { t:"Mitochondria", why:"Plant cells have mitochondria too; they respire all the time." },
            { t:"Ribosomes", why:"Every cell makes proteins on ribosomes." }],
          hints:["Which structure is rigid and lies outside the membrane?", "It’s made of cellulose.", "The cell wall."] },
        { id:"w3", skill:"Diffusion", goal:3,
          prompt:"In diffusion, particles move overall…",
          options:[
            { t:"from higher concentration to lower concentration", ok:true, why:"Random motion spreads particles out until they’re even." },
            { t:"from lower to higher concentration", why:"Moving against a gradient needs energy and a pump." },
            { t:"only when the cell spends ATP", why:"Diffusion is passive: no energy needed." },
            { t:"only through water, never through air", why:"Gases diffuse through air, even faster than through water." }],
          hints:["Think of a smell spreading across a room.", "Where there are many particles, more move away.", "High to low concentration."] },
        { id:"w4", skill:"Diffusion", goal:3,
          prompt:"In bright light, the air outside a leaf has more CO₂ than the air spaces inside it. Which way does CO₂ move through an open stoma?",
          options:[
            { t:"Into the leaf", ok:true, why:"From higher (outside) to lower (inside)." },
            { t:"Out of the leaf", why:"Out would be from lower to higher." },
            { t:"Neither way, because CO₂ is a small part of air", why:"Even a small difference drives diffusion." },
            { t:"Into the leaf, but only if the guard cells pump it", why:"Guard cells open the pore; diffusion does the moving." }],
          hints:["Where is the CO₂ concentration higher?", "Outside.", "So it diffuses in."] },
        { id:"w5", skill:"Photosynthesis basics", goal:3,
          prompt:"Which word equation describes photosynthesis?",
          options:[
            { t:"carbon dioxide + water → glucose + oxygen", ok:true, why:"Light energy, captured by chlorophyll, drives it." },
            { t:"glucose + oxygen → carbon dioxide + water", why:"That’s cellular respiration. It’s the reverse." },
            { t:"carbon dioxide + oxygen → glucose + water", why:"Oxygen is a product, not a reactant." },
            { t:"water + oxygen → glucose + carbon dioxide", why:"CO₂ is taken in, not given off." }],
          hints:["What does a plant take in from the air?", "CO₂ in; O₂ out.", "CO₂ + water → glucose + oxygen."] },
        { id:"w6", skill:"Photosynthesis basics", goal:3,
          prompt:"Where does the water used in photosynthesis come from?",
          options:[
            { t:"The soil, through the roots and up the xylem", ok:true, why:"Water is pulled up from the roots." },
            { t:"The air, through the stomata", why:"Stomata let water vapour <strong>out</strong>; almost none comes in." },
            { t:"The phloem", why:"Phloem carries sugar." },
            { t:"Respiration inside the leaf", why:"Respiration makes a little water, far too little to supply photosynthesis." }],
          hints:["Which tissue carries water up a plant?", "Xylem, from the roots.", "Soil → roots → xylem."] }
      ],
      refreshers:{
        "Plant cells":"Plant cells have a cell wall, a large central vacuole and (in green parts) chloroplasts, as well as everything an animal cell has, including mitochondria.",
        "Diffusion":"Particles spread from higher to lower concentration without any energy input. Example: CO₂ moves into a leaf because photosynthesis keeps the inside concentration low.",
        "Photosynthesis basics":"carbon dioxide + water → glucose + oxygen, powered by light absorbed by chlorophyll. Water comes from the roots; CO₂ comes from the air."
      }
    }
  },
  explore:{
    heading:"Leaf cross-section explorer",
    intro:"Zoom into a leaf and tap each layer to see its job. Then switch on the gas and light views to watch what moves where.",
    darkNote:"In this model the stomata can stay open in the dark “for the experiment”. Most real plants close them at night (module 07 explains why).",
    lightNote:"Model values: of 100 units of light reaching the leaf, 8 are reflected, 62 are absorbed in the palisade, 22 in the spongy mesophyll, and 8 pass through.",
    // Hotspot job lines (plan §5: from the flashcards; air space has its own line). "where" names the spot without giving the answer (label quiz, screen readers).
    hotspots:{
      vein:{ name:"Vein", job:"Veins bring water in (xylem) and carry sugar away (phloem).", chl:"None", where:"Lines running through the leaf" },
      cuticle:{ name:"Cuticle", job:"Clear, waxy, waterproof coating on the epidermis; cuts water loss.", chl:"None", where:"Thin coat on the very top surface" },
      upper:{ name:"Upper epidermis", job:EPI, chl:"None", where:"Top row of clear cells" },
      palisade:{ name:"Palisade mesophyll", job:"Tall, tightly packed cells under the upper epidermis; most chloroplasts; absorbs most light.", chl:"Many", where:"Tall, tightly packed green cells" },
      spongy:{ name:"Spongy mesophyll", job:"Loosely packed cells with air spaces: gases spread to every cell.", chl:"Some", where:"Loose, rounded green cells" },
      air:{ name:"Air space", job:"Gas-filled space where CO₂, O₂ and water vapour diffuse.", chl:"None", where:"Large gap just above the pore" },
      xylem:{ name:"Xylem", job:"Carries water and minerals up from the roots.", chl:"None", where:"Large thick-walled tubes, upper side of the vein" },
      phloem:{ name:"Phloem", job:"Carries sugars from the leaf to the rest of the plant.", chl:"None", where:"Small cells, lower side of the vein" },
      lower:{ name:"Lower epidermis", job:EPI, chl:"None", where:"Bottom row of clear cells" },
      stoma:{ name:"Stoma", job:"A pore, mostly in the lower epidermis, for CO₂ in and O₂ and water vapour out.", chl:"None", where:"Gap in the bottom surface" },
      guard:{ name:"Guard cell", job:"The pair of cells around a stoma; they open and close it (module 07).", chl:"Yes", where:"Curved green cell beside the gap" },
      wall:{ name:"Cell wall", job:"A rigid cellulose layer outside the membrane that supports the cell.", chl:"Not in the wall (this palisade cell has many)", where:"Outer edge of the cell" },
      chloro:{ name:"Chloroplast", job:"Holds chlorophyll and the enzymes that make sugar.", chl:"This is one (this palisade cell has many)", where:"Small green bodies along the cell wall" },
      vacuole:{ name:"Vacuole", job:"Stores water and dissolved substances.", chl:"Not in the vacuole (this palisade cell has many)", where:"Large space in the middle of the cell" },
      nucleus:{ name:"Nucleus", job:"Holds DNA; it controls the cell but doesn’t make sugar.", chl:"Not in the nucleus (this palisade cell has many)", where:"Round body near the side of the cell" }
    },
    predictions:[
      { id:"p1", start:{ mode:"gas", gas:"o2", light:"on", open:50 },
        prompt:"Which way will O₂ move through the stoma?",
        options:[{ t:"Out of the leaf", ok:true }, { t:"Into the leaf" }, { t:"It won’t move" }, { t:"In and out equally" }],
        explain:"Photosynthesis makes O₂ inside, so the concentration inside is higher than outside." },
      { id:"p2", start:{ mode:"gas", gas:"co2", light:"off", open:50 },
        prompt:"In the dark with the stomata open, which way will CO₂ move?",
        options:[{ t:"Out of the leaf", ok:true }, { t:"Into the leaf" }, { t:"It won’t move" }, { t:"Into the leaf, then it’s stored" }],
        explain:"Cells respire day and night. With no photosynthesis to use the CO₂, it builds up inside and diffuses out." },
      { id:"p3", start:{ mode:"gas", gas:"co2", light:"on", open:0 },
        prompt:"What happens to the CO₂ level in the air spaces over the next minute?",
        options:[{ t:"It falls, and photosynthesis slows", ok:true }, { t:"It rises" }, { t:"It stays the same" }, { t:"CO₂ starts entering through the cuticle" }],
        explain:"Photosynthesis keeps using CO₂, and none can get in." },
      { id:"p4", start:{ mode:"light", intensity:100 },
        prompt:"Which layer absorbs the most light?",
        options:[{ t:"Palisade mesophyll", ok:true }, { t:"Upper epidermis" }, { t:"Spongy mesophyll" }, { t:"Cuticle" }],
        explain:"The cuticle and epidermis are clear. The palisade cells, packed with chloroplasts, are the first green layer the light meets." }
    ],
    chalIntro:"Use the explorer to meet each goal, then press <strong>Check challenge</strong>. Your taps on the diagram are listed under it; use <strong>Clear taps</strong> to start again. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 2], prompt:"Tap every structure whose cells contain chloroplasts, then press Check.",
        why:"Palisade cells, spongy cells and guard cells contain chloroplasts. The cuticle, the other epidermis cells and the vein cells don’t.",
        general:"Check each structure you tapped against the “Chloroplasts?” row in the readout.",
        hints:["Which layers look green in the cross-section?", "Both mesophyll layers, plus one kind of epidermis cell.", "Palisade, spongy and guard cells."] },
      { id:"tc2", goal:3, prompt:"Trace a CO₂ molecule from the outside air to a chloroplast in a palisade cell. Tap the structures in order.",
        why:"Stoma → air space → palisade cell → chloroplast: CO₂ diffuses in through the pore, spreads through the air spaces and is used in the chloroplasts.",
        general:"Start where CO₂ gets into the leaf, then follow it to where it’s used. Press Clear taps to start again.",
        hints:["Where are the pores?", "After the pore, the CO₂ is in a large gas-filled space.", "Stoma → air space → palisade cell → chloroplast."] },
      { id:"tc3", goal:4, stretch:true, prompt:"Make the leaf release O₂ to the air while losing as little water as possible.",
        why:"Light on and stomata at 25%: O₂ is made and diffuses out, and water loss stays Low.",
        hints:["O₂ and water vapour leave through the same pores.", "You need the pores open a little and O₂ being made.", "Light on, stomata at the smallest opening above 0%: 25%."] }
    ]
  },
  part3:{
    slug:"adaptations", name:"Habitats",
    heading:"Leaves built for their habitat",
    intro:"Six leaves from six habitats. Tap a leaf card, then tap the habitat it fits. Open <strong>Check it with data</strong> on any card to read its numbers.",
    cards:[
      { id:"A", answer:"sun", why:AB, rows:[["Leaf thickness", "0.25 mm"], ["Palisade layers", "2"], ["Stomata per mm² (upper / lower)", "0 / 250"], ["Cuticle", "Medium"], ["Other features", "—"]],
        draw:{ t:0.25, pal:2, up:0, low:250, cut:2 } },
      { id:"B", answer:"shade", why:AB, rows:[["Leaf thickness", "0.12 mm"], ["Palisade layers", "1"], ["Stomata per mm² (upper / lower)", "0 / 150"], ["Cuticle", "Thin"], ["Other features", "Larger, thinner blade"]],
        draw:{ t:0.12, pal:1, up:0, low:150, cut:1 } },
      { id:"C", answer:"desert", why:"A thick cuticle, sunken stomata and hairs trap still, humid air near the pores, so less water escapes.", rows:[["Leaf thickness", "0.50 mm"], ["Palisade layers", "3"], ["Stomata per mm² (upper / lower)", "0 / 120"], ["Cuticle", "Thick"], ["Other features", "Stomata sunk in pits; hairs"]],
        draw:{ t:0.5, pal:3, up:0, low:120, cut:4, pits:true, hairs:true } },
      { id:"D", answer:"lily", why:"The underside touches water, so stomata are on top, facing the air. Large air spaces keep the leaf afloat.", rows:[["Leaf thickness", "0.30 mm"], ["Palisade layers", "1"], ["Stomata per mm² (upper / lower)", "400 / 0"], ["Cuticle", "Thin"], ["Other features", "Very large air spaces"]],
        draw:{ t:0.3, pal:1, up:400, low:0, cut:1, bigAir:true } },
      { id:"E", answer:"spruce", why:"In winter, the ground is frozen, so roots can’t replace lost water. Wax and a small surface area save water.", rows:[["Leaf thickness", "Needle, 1 mm across"], ["Palisade layers", "—"], ["Stomata per mm² (upper / lower)", "Rows of sunken stomata"], ["Cuticle", "Very thick wax"], ["Other features", "Small surface area"]],
        draw:{ needle:true } },
      { id:"F", answer:"corn", why:"Corn concentrates CO₂ in those vein cells. Module 09 explains why that helps in heat.", rows:[["Leaf thickness", "0.20 mm"], ["Palisade layers", "1"], ["Stomata per mm² (upper / lower)", "0 / 200"], ["Cuticle", "Medium"], ["Other features", "A ring of chloroplast-packed cells around each vein"]],
        draw:{ t:0.2, pal:1, up:0, low:200, cut:2, kranz:true } }
    ],
    habitats:[
      { id:"sun", t:"Sunny top of a sugar maple" },
      { id:"shade", t:"Shaded lower branch of the same maple" },
      { id:"desert", t:"Hot desert shrub" },
      { id:"lily", t:"Water lily floating on a pond" },
      { id:"spruce", t:"White spruce in the boreal forest" },
      { id:"corn", t:"Corn in an Ontario field (a C4 plant: more in module 09)" }
    ],
    modelNote:"Rounded model values, not measurements from one real leaf.",
    wrong:"Compare the card’s data with what that habitat demands: how much light, how much water, and whether the leaf touches air or water. Try another habitat.",
    quickCheck:{
      title:"Quick check", summary:"Habitats quick check",
      items:[
        { id:"q1", goal:5, prompt:"Why do floating leaves have stomata on the upper surface?",
          choices:[{ t:"The lower surface is against the water", ok:true, fb:"Gas exchange needs air; the underside touches water." },
            { t:"Light enters from below", fb:"Gas exchange needs air; the underside touches water." },
            { t:"Water lilies don’t need CO₂", fb:"Gas exchange needs air; the underside touches water." },
            { t:"The upper surface is cooler", fb:"Gas exchange needs air; the underside touches water." }] },
        { id:"q2", goal:5, prompt:"A thin leaf with one palisade layer most likely grew…",
          choices:[{ t:"in shade", ok:true, fb:"Little light: a thin, wide leaf is cheaper to build and catches what light there is." },
            { t:"in full sun", fb:"Little light: a thin, wide leaf is cheaper to build and catches what light there is." },
            { t:"in a desert", fb:"Little light: a thin, wide leaf is cheaper to build and catches what light there is." },
            { t:"underwater", fb:"Little light: a thin, wide leaf is cheaper to build and catches what light there is." }] },
        { id:"q3", goal:[4, 5], prompt:"Which feature saves water in a desert leaf?",
          choices:[{ t:"Stomata sunk in pits", ok:true, fb:"Pits hold still, humid air over the pore, so less water vapour diffuses out." },
            { t:"More stomata on top", fb:"Pits hold still, humid air over the pore, so less water vapour diffuses out." },
            { t:"A thinner cuticle", fb:"Pits hold still, humid air over the pore, so less water vapour diffuses out." },
            { t:"Larger air spaces", fb:"Pits hold still, humid air over the pore, so less water vapour diffuses out." }] },
        { id:"q4", goal:5, prompt:"Why do spruce needles need to save water in winter?",
          choices:[{ t:"The soil water is frozen", ok:true, fb:"Roots can’t take up frozen water, so lost water can’t be replaced." },
            { t:"Winter air is too humid", fb:"Roots can’t take up frozen water, so lost water can’t be replaced." },
            { t:"Snow blocks the stomata", fb:"Roots can’t take up frozen water, so lost water can’t be replaced." },
            { t:"They photosynthesize faster in winter", fb:"Roots can’t take up frozen water, so lost water can’t be replaced." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"label", type:"custom", title:"Label the leaf", summary:"Label the leaf", goal:[1, 3],
        instruction:"Tap a label, then tap the structure it names.", how:"",
        labels:[
          { id:"cuticle", t:"cuticle", hints:["Which layer is waxy and waterproof?", "It coats the outside of the epidermis.", "Tap the thin coat on the very top surface."] },
          { id:"upper", t:"upper epidermis", hints:["Which layer is one row of clear cells?", "It sits just under the waxy coat on top.", "Tap the top row of clear cells."] },
          { id:"palisade", t:"palisade mesophyll", hints:["Which cells catch most of the light?", "Tall, tightly packed, near the top.", "Tap the tall green cells under the upper epidermis."] },
          { id:"spongy", t:"spongy mesophyll", hints:["Which cells let gases spread to every cell?", "Loose, with air spaces between them.", "Tap the loose, rounded green cells below the palisade."] },
          { id:"air", t:"air space", hints:["Where do the gases spread inside the leaf?", "Look for the large gas-filled gap just inside the pore.", "Tap the gap just above the stoma."] },
          { id:"xylem", t:"xylem", hints:["Which tissue carries water?", "The wider tubes in the vein.", "Tap the large tubes on the upper side of the vein."] },
          { id:"phloem", t:"phloem", hints:["Which tissue carries sugar?", "The smaller cells in the vein.", "Tap the small cells on the lower side of the vein."] },
          { id:"lower", t:"lower epidermis", hints:["Which row of clear cells has the pores in it?", "It’s the bottom surface of the leaf.", "Tap the bottom row of clear cells."] },
          { id:"stoma", t:"stoma", hints:["Where do gases get in and out?", "It’s a gap, not a cell.", "Tap the gap between the two curved cells in the bottom surface."] },
          { id:"guard", t:"guard cell", hints:["Which cells open and close the pore?", "There are two of them, one on each side of the pore.", "Tap one of the curved green cells beside the stoma."] }
        ],
        pairs:{
          "phloem|xylem":"Xylem (larger, thick-walled tubes, upper side of the vein) carries water; phloem (smaller cells, lower side) carries sugar.",
          "guard|stoma":"The stoma is the pore; the guard cells are the pair of cells around it.",
          "cuticle|upper":"The cuticle is the waxy coat on top of the epidermis cells.",
          "palisade|spongy":"Palisade: tall, tightly packed, near the top. Spongy: loose, with air spaces."
        },
        wrongDefault:"Read the job of each layer, then try again." },
      { id:"investigations", type:"custom", title:"Leaf investigations", summary:"Leaf investigations", star:true, goal:[2, 4, 5],
        instruction:"Six questions from real-style leaf investigations: counting stomata, planning a fair test and reading results.",
        items:[
          { id:"l1", kind:"num", goal:4, prompt:"A student counts 30 stomata in a field of view with area 0.12 mm² on the lower surface. What is the stomatal density, in stomata per mm²?",
            answer:250, display:"250 stomata per mm²", unit:"stomata per mm²",
            wrong:[{ match:3.6, fb:"Divide the count by the area, don’t multiply." }],
            hints:["Stomatal density is the number of stomata in each mm².", "Divide the count by the area: 30 ÷ 0.12.", "30 ÷ 0.12 = 250 stomata per mm²."] },
          { id:"l2", kind:"num", goal:4, prompt:"In the same-sized field of view on the upper surface she counts 6. How many times denser are the stomata underneath?",
            answer:5, display:"5 times", unit:"times",
            wrong:[{ match:24, fb:"That’s the difference in counts; the question asks for the ratio, 30 ÷ 6." }],
            hints:["“How many times” asks for a ratio.", "The fields of view are the same size, so compare the counts.", "30 ÷ 6 = 5 times denser underneath."] },
          { id:"l3", kind:"num", goal:4, star:true, prompt:"A leaf’s lower surface has area 4000 mm² and 250 stomata per mm². How many stomata are on it?",
            answer:1000000, display:"1 000 000 stomata", unit:"stomata",
            wrong:[{ match:16, fb:"Multiply density by area: 250 × 4000." }],
            hints:["Density tells you how many stomata are in each mm².", "There are 4000 mm², each with 250 stomata.", "250 × 4000 = 1 000 000 stomata."] },
          { id:"l4", kind:"sel", goal:5, star:true, prompt:"Comparing stomatal density in sun leaves and shade leaves of one tree: which must be kept the same? Select all.",
            options:[
              { t:"same tree species", ok:true, why:"" },
              { t:"same leaf surface (lower)", ok:true, why:"" },
              { t:"same field-of-view area", ok:true, why:"" },
              { t:"same number of leaves sampled", ok:true, why:"" },
              { t:"same position on the tree", why:"Position on the tree <strong>is</strong> the independent variable (sun vs shade)." },
              { t:"same number of stomata counted", why:"The number of stomata counted is the result you’re measuring." }],
            why:"Keep everything the same except the variable you’re testing (sun vs shade) and the result you’re measuring (the stomata count).",
            hints:["Which variable are you changing on purpose, and which are you measuring?", "Sun vs shade is the independent variable; the stomata count is the result. Everything else stays the same.", "Keep the same: tree species, leaf surface (lower), field-of-view area and number of leaves sampled."] },
          { id:"l5", kind:"num", goal:4, star:true, prompt:"Four identical leaves were sealed with petroleum jelly and hung for 3 days. Mass lost: no jelly 2.4 g; upper surface coated 2.0 g; lower surface coated 0.6 g; both surfaces coated 0.2 g. About how much water left through the lower surface’s stomata?",
            answer:1.8, tol:0.001, display:"1.8 g", unit:"g",
            wrong:[{ match:2, fb:"That leaf still lost water through its open lower surface. Compare uncoated (2.4 g) with lower-coated (0.6 g)." },
              { match:0.4, fb:"That’s the upper surface’s share." }],
            hints:["Coating a surface blocks its stomata.", "The lower-coated leaf lost water only through the upper surface and the cuticle.", "2.4 − 0.6 = 1.8 g through the lower surface."] },
          { id:"l6", kind:"mc", goal:[2, 4], star:true, prompt:"Ground-level ozone damages mesophyll cells, and it enters through stomata. On which afternoon would a bean crop take in the most ozone, if the ozone level is the same?",
            options:[
              { t:"humid and bright, stomata wide open", ok:true, why:"Ozone uses the same doors as CO₂. Wider stomata let more in, which is why air quality matters to farmers." },
              { t:"hot and dry, stomata half-closed", why:"Ozone uses the same doors as CO₂. Wider stomata let more in, which is why air quality matters to farmers." },
              { t:"cloudy after a drought, stomata nearly shut", why:"Ozone uses the same doors as CO₂. Wider stomata let more in, which is why air quality matters to farmers." },
              { t:"dark, stomata closed", why:"Ozone uses the same doors as CO₂. Wider stomata let more in, which is why air quality matters to farmers." }],
            hints:["How does ozone get inside the leaf?", "Through open stomata.", "Most open stomata: most ozone."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Abigail", how:"",
        instruction:"Abigail made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Explain how CO₂ reaches a palisade cell.",
            steps:["CO₂ enters the leaf through stomata on the lower surface.", "Guard cells pump it through the air spaces of the spongy mesophyll.", "It dissolves in the moist cell walls of the palisade cells.", "It diffuses into the chloroplasts."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 is fine. The mistake is earlier.", "Step 4 is fine."],
            fixes:[
              { t:"It diffuses through the air spaces, from higher to lower concentration.", ok:true, why:"Diffusion carries the CO₂ through the air spaces." },
              { t:"It travels up through the xylem.", why:"Veins carry liquids, not CO₂ from the air." },
              { t:"It’s carried in the phloem.", why:M3 },
              { t:"Step 2 is correct.", why:"Guard cells only open and close the pore; diffusion moves the gas." }],
            hints:["Do guard cells move gas?", "They change the size of the pore.", "Diffusion carries the CO₂ through the air spaces."] },
          { id:"e2", goal:4, task:"Explain why most tree leaves have more stomata on the lower surface.",
            steps:["Stomata let gases in and out, but water vapour escapes through them too.", "The upper surface faces the sun, so it gets warmer.", "Water evaporates faster from warmer surfaces, so stomata on top would lose more water.", "So the lower surface has more stomata, which is why the lower epidermis does most of the photosynthesis."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"So the lower surface has more stomata; photosynthesis still happens mainly in the palisade mesophyll.", ok:true, why:"The chloroplasts are in the mesophyll, not the epidermis." },
              { t:"So the upper surface has more stomata after all.", why:M4 },
              { t:"So the cuticle does most of the gas exchange.", why:"The cuticle is a clear, waxy waterproof layer and almost gas-tight. Gases go through the stomata." },
              { t:"Step 4 is correct.", why:"Epidermis cells have no chloroplasts." }],
            hints:["Which cells actually photosynthesize?", "Where are the chloroplasts?", "In the mesophyll, not the epidermis."] },
          { id:"e3", goal:3, task:"Trace water from the roots out of a leaf.",
            steps:["Water enters the root and moves up the stem in the phloem.", "In the leaf, it leaves the vein and moves into mesophyll cells.", "It evaporates from the cell surfaces into the air spaces.", "Water vapour diffuses out through the stomata."],
            answer:0,
            stepFb:["", "Step 2 is fine once step 1 is fixed.", "Step 3 is fine.", "Step 4 is fine."],
            fixes:[
              { t:"…moves up the stem in the xylem.", ok:true, why:"Xylem carries water and minerals up from the roots." },
              { t:"…moves up the stem through the air spaces.", why:"Air spaces hold gases inside the leaf; liquid water travels up the stem in the xylem." },
              { t:"…is absorbed by the leaf from the air.", why:"Stomata let water vapour out; almost none comes in." },
              { t:"Step 1 is correct.", why:"Phloem carries sugar, not water from the roots." }],
            hints:["Which tissue carries water up?", "Not the sugar-carrying tissue.", "Xylem."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you when you watched the gases at night?" },
      { id:"j2", q:"In your own words, why is a stoma a ‘shared door’, and what does that cost the plant?" },
      { id:"j3", q:"Explain to a friend how the palisade and spongy layers divide up the work." },
      { id:"j4", q:"Which leaf tissue are you still unsure about? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which leaf tissue contains the most chloroplasts?", options:[
          { t:"Palisade mesophyll", ok:true, why:"Tall cells packed with chloroplasts, just under the upper epidermis." },
          { t:"Spongy mesophyll", why:"It has chloroplasts, but fewer; its job is gas spreading." },
          { t:"Upper epidermis", why:"Clear cells with no chloroplasts." },
          { t:"Xylem", why:"Xylem tubes carry water; they’re not even living when mature." }] },
        b:{ prompt:"Which leaf tissue is made of loosely packed cells with large air spaces?", options:[
          { t:"Spongy mesophyll", ok:true, why:"The air spaces let gases reach every cell." },
          { t:"Palisade mesophyll", why:"Palisade cells are tightly packed." },
          { t:"Lower epidermis", why:"A single tight layer of clear cells." },
          { t:"Phloem", why:"Phloem carries sugar in the vein." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"What changes the size of a stomatal opening?", options:[
          { t:"The guard cells", ok:true, why:"The pair of cells around the pore changes shape to open or close it." },
          { t:"The cuticle", why:"The cuticle is a fixed waxy coat." },
          { t:"The spongy mesophyll", why:"Its air spaces sit behind the stomata." },
          { t:"The xylem", why:"Xylem brings water to the leaf." }] },
        b:{ prompt:"Through which structures does most water vapour leave a leaf?", options:[
          { t:"Stomata", ok:true, why:"Water evaporates into the air spaces and diffuses out through open stomata." },
          { t:"The cuticle", why:"Only a little escapes through the waxy cuticle." },
          { t:"The xylem", why:"Xylem brings water in." },
          { t:"The guard cells themselves", why:"They surround the pore; the vapour leaves through the pore." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which tissue carries sugars made in the leaf to the roots?", options:[
          { t:"Phloem", ok:true, why:"Phloem carries sugars from the leaf to the rest of the plant." },
          { t:"Xylem", why:"Xylem carries water and minerals up from the roots." },
          { t:"Spongy mesophyll", why:"It makes some sugar but doesn’t transport it." },
          { t:"Stomata", why:"Stomata are pores for gases." }] },
        b:{ prompt:"Which tissue brings water into a leaf?", options:[
          { t:"Xylem", ok:true, why:"Xylem carries water and minerals up from the roots into the leaf." },
          { t:"Phloem", why:"Phloem carries sugars away." },
          { t:"Stomata", why:"Stomata let water vapour <strong>out</strong>; water comes from the roots." },
          { t:"Guard cells", why:"They control the pores." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"On a sunny afternoon, the CO₂ concentration in a leaf’s air spaces stays lower than outside. Which explanation fits?", options:[
          { t:"Photosynthesis uses CO₂ as fast as it arrives, keeping the inside level low, so CO₂ keeps diffusing in.", ok:true, why:"Photosynthesis keeps the inside level low, and diffusion moves CO₂ from higher (outside) to lower (inside)." },
          { t:"Respiration makes extra CO₂ in daylight.", why:"That would raise the inside level, not lower it." },
          { t:"Guard cells pump CO₂ back out.", why:"Guard cells don’t pump gases." },
          { t:"The cuticle absorbs CO₂.", why:"The cuticle is a waxy barrier." }] },
        b:{ prompt:"At night, the O₂ concentration in a leaf’s air spaces stays lower than outside. Which explanation fits?", options:[
          { t:"Cells respire, using O₂, and there’s no photosynthesis to make more, so O₂ diffuses in.", ok:true, why:"Respiration keeps the inside level low, and diffusion moves O₂ from higher (outside) to lower (inside)." },
          { t:"Photosynthesis uses O₂ at night.", why:"Photosynthesis makes O₂ and needs light." },
          { t:"Guard cells pump O₂ out at night.", why:M5 },
          { t:"O₂ leaks out through the cuticle.", why:"The cuticle is a clear, waxy waterproof layer and almost gas-tight. Gases go through the stomata." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"A plant’s stomata close on a hot, dry afternoon. Which pair of effects follows?", options:[
          { t:"Water loss falls, and photosynthesis slows as the CO₂ inside is used up.", ok:true, why:"Closed stomata cut the CO₂ supply, so photosynthesis slows as the CO₂ inside is used up, and less water vapour escapes." },
          { t:"Water loss falls, and photosynthesis speeds up because the leaf keeps more water.", why:"Water isn’t the limit here; CO₂ is." },
          { t:"Water loss rises, because the leaf heats up.", why:"Closed stomata cut water loss." },
          { t:"Nothing changes, because CO₂ can still enter through the cuticle.", why:M1 }] },
        b:{ prompt:"On a cool, humid morning after rain, a plant’s stomata open wide. Which pair of effects follows?", options:[
          { t:"CO₂ can enter faster, so photosynthesis can speed up; water loss rises, but humid air keeps it modest.", ok:true, why:"Open stomata let more CO₂ in and more water vapour out; humid air outside keeps the difference in water vapour small." },
          { t:"Photosynthesis slows because water floods the air spaces.", why:"The air spaces don’t flood." },
          { t:"Water loss falls because the stomata are open.", why:"Open stomata let more vapour out." },
          { t:"O₂ starts entering the leaf in daylight.", why:"In light, O₂ is made inside and leaves." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Leaf X: 3 palisade layers, 0.4 mm thick. Leaf Y: 1 palisade layer, 0.1 mm thick, twice the area. Both are from one tree species. Which statement is best supported?", options:[
          { t:"Y grew in shade: a thin, wide leaf catches scarce light cheaply, while X’s extra palisade layers suit bright sun.", ok:true, why:"Same species, different structure: X is built like a sun leaf and Y like a shade leaf." },
          { t:"X grew in shade, because it needs more layers to catch dim light.", why:"Extra layers only help if there’s enough light to reach them." },
          { t:"Y grew in a desert, because it is thin.", why:"Desert leaves are usually thick with a heavy cuticle." },
          { t:"They grew in the same spot; thickness is random.", why:"Same species, different structure: the habitat is the likely cause." }] },
        b:{ prompt:"Leaf P: 350 stomata/mm² on top, none underneath, huge air spaces. Leaf Q: 200/mm² underneath, none on top, thick cuticle. Which statement is best supported?", options:[
          { t:"P floats on water: its stomata face the air and the air spaces keep it afloat.", ok:true, why:"Stomata on top face the air, and large air spaces keep a floating leaf up." },
          { t:"P grew in a desert, because it has many stomata.", why:"Many stomata facing the sun would lose water fast." },
          { t:"Q floats on water, because its stomata are underneath.", why:"Underneath would be against the water." },
          { t:"Both are underwater leaves.", why:"Fully underwater leaves usually have few or no stomata." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why the spongy mesophyll has large air spaces?", options:[
          { t:"“They let CO₂, O₂ and water vapour diffuse quickly between the stomata and every photosynthesizing cell.”", ok:true, why:"The air spaces link the stomata to every cell, so gases reach them quickly by diffusion." },
          { t:"“They store sugar until the phloem can take it.”", why:"Sugar is stored in cells, not air spaces." },
          { t:"“They hold water for dry periods.”", why:"They hold air, not water." },
          { t:"“They let light reach the lower epidermis, where most photosynthesis happens.”", why:M2 }] },
        b:{ prompt:"Which is the best explanation of why palisade cells are tall and tightly packed just under the upper surface?", options:[
          { t:"“They are the first green layer the light reaches, and packing many chloroplast-filled cells there absorbs most of it.”", ok:true, why:"The palisade sits where the light arrives, so its chloroplasts absorb most of it." },
          { t:"“They form a waterproof layer that stops water loss.”", why:"That’s the cuticle’s job." },
          { t:"“They leave room for air spaces.”", why:"Tight packing leaves few air spaces; that’s the spongy layer." },
          { t:"“They carry sugar to the veins.”", why:"That’s the phloem." }] } },
      { id:"c2", cat:"C", goal:[1, 3],
        a:{ prompt:"Which flow chart correctly shows the path of a CO₂ molecule to the place where it’s used?", options:[
          { t:"Air → stoma → air space → palisade cell → chloroplast", ok:true, why:"CO₂ enters through a stoma, spreads through the air spaces, and is used in the chloroplasts of the palisade cells." },
          { t:"Air → cuticle → epidermis → palisade cell → chloroplast", why:M1 },
          { t:"Air → stoma → xylem → palisade cell → chloroplast", why:"Veins carry liquids, not CO₂ from the air." },
          { t:"Air → stoma → guard cell → nucleus", why:"CO₂ is used in chloroplasts, not the nucleus." }] },
        b:{ prompt:"Which flow chart correctly shows the path of water from a vein to the outside air?", options:[
          { t:"Xylem → mesophyll cell → evaporates into an air space → stoma → air", ok:true, why:"Water leaves the xylem, evaporates from mesophyll cells into the air spaces, then diffuses out through a stoma." },
          { t:"Phloem → mesophyll cell → air space → stoma → air", why:M3 },
          { t:"Xylem → cuticle → air", why:"Most water leaves through stomata." },
          { t:"Xylem → stoma → mesophyll cell → air", why:"The order is backwards in the middle." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"White spruce needles in the boreal forest have a thick waxy cuticle and stomata sunk in pits. Why does this help in winter?", options:[
          { t:"The ground is frozen, so roots can’t replace lost water; these features cut water loss.", ok:true, why:"Wax and sunken stomata cut water loss when frozen soil means lost water can’t be replaced." },
          { t:"They let the needles absorb snow for water.", why:"Leaves don’t absorb snow." },
          { t:"They trap heat so photosynthesis runs faster.", why:"The wax is for water, not heat." },
          { t:"They let more CO₂ in through the cuticle.", why:M1 }] },
        b:{ prompt:"American beachgrass on Great Lakes sand dunes rolls its leaves into tubes in dry, windy weather, with its stomata on the inside of the roll. Why does this help?", options:[
          { t:"Still, humid air trapped inside the roll means less water vapour diffuses out of the stomata.", ok:true, why:"Humid air over the pores makes the water-vapour difference smaller, so less diffuses out." },
          { t:"Rolling lets more light reach the stomata.", why:"Stomata don’t need light to be absorbed." },
          { t:"Rolling pumps CO₂ into the leaf.", why:M5 },
          { t:"Rolling moves the stomata to the cuticle.", why:M6 }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"Four identical maple leaves are coated with petroleum jelly (a waterproof seal): one uncoated, one coated on top, one coated underneath, one coated on both sides. Apart from the uncoated leaf, which loses the most mass over 3 days?", options:[
          { t:"The leaf coated on top", ok:true, why:"Its lower surface, where most stomata are, is still open." },
          { t:"The leaf coated underneath", why:"Coating the underside blocks most stomata." },
          { t:"The leaf coated on both sides", why:"Both surfaces are sealed." },
          { t:"All three lose the same", why:"The surfaces don’t have the same number of stomata." }] },
        b:{ prompt:"The same test is done with four water lily leaves. Apart from the uncoated leaf, which loses the most mass?", options:[
          { t:"The leaf coated underneath", ok:true, why:"Water lilies have their stomata on top, which is still open." },
          { t:"The leaf coated on top", why:"On a water lily, coating the top blocks the stomata." },
          { t:"The leaf coated on both sides", why:"Both surfaces are sealed." },
          { t:"All three lose the same", why:"The surfaces don’t have the same number of stomata." }] } }
    ]
  },
  task:{
    title:"Design a desert leaf", summary:"Design a desert leaf",
    statement:"<p>Design a leaf for a hot, dry, sunny habitat that still does plenty of photosynthesis. Can you find all the answers?</p>",
    checks:["Low water loss: water-loss score of 2 or less", "Plenty of photosynthesis: photosynthesis score of 5 or more", "Stomata shaded from the midday sun", "Waxy enough for the desert"],
    tips:["Every stoma and every bit of surface area loses water. Hairs trap humid air and help.", "Light is plentiful here, so more palisade layers pay off.", "Put the pores where the sun doesn’t strike.", "Desert plants need their thickest wax."],
    inputs:[
      { id:"cut", label:"Cuticle", options:[["thin", "thin"], ["medium", "medium"], ["thick", "thick"]] },
      { id:"on", label:"Stomata on", options:[["upper", "upper only"], ["lower", "lower only"], ["both", "both"]] },
      { id:"dens", label:"Stomatal density", options:[["low", "low"], ["medium", "medium"], ["high", "high"]] },
      { id:"pal", label:"Palisade layers", options:[["1", "1"], ["2", "2"], ["3", "3"]] },
      { id:"size", label:"Leaf size", options:[["small", "small"], ["medium", "medium"], ["large", "large"]] },
      { id:"hairs", label:"Hairs", options:[["no", "no"], ["yes", "yes"]] }
    ],
    models:[
      "<strong>Water-loss score</strong> = cuticle (thin 2, medium 1, thick 0) + stomata on (upper only 1, lower only 0, both 1) + density (low 0, medium 1, high 2) + size (small 0, medium 1, large 3) − hairs (yes 1, no 0). Never below 0.",
      "<strong>Photosynthesis score</strong> = palisade layers (1, 2, 3) + density (low 0, medium 1, high 2) + size (small 0, medium 1, large 2)."
    ],
    afterAll:"Each answer trades something: more pores need a smaller leaf or hairs. That’s the leaf’s balancing act.",
    explainPrompt:"Explain how your leaf balances getting CO₂ against losing water.",
    vocab:"Use the words stomata, cuticle, palisade, diffusion and trade-off.",
    more:"There’s more than one answer. Can you find another?"
  },
  cards:[
    ["Cuticle", "Clear, waxy, waterproof coating on the epidermis; cuts water loss."],
    ["Epidermis", "One layer of clear cells (no chloroplasts, except guard cells) that protects the leaf."],
    ["Palisade mesophyll", "Tall, tightly packed cells under the upper epidermis; most chloroplasts; absorbs most light."],
    ["Spongy mesophyll", "Loose cells with large air spaces; gases diffuse to every cell."],
    ["Stoma (plural: stomata)", "A pore, mostly in the lower epidermis, for CO₂ in and O₂ and water vapour out."],
    ["Guard cells", "The pair of cells around a stoma; they open and close it (module 07)."],
    ["Xylem", "Carries water and minerals up from the roots."],
    ["Phloem", "Carries sugars from the leaf to the rest of the plant."],
    ["Diffusion of gases", "High → low concentration. In light, CO₂ in and O₂ out; in the dark, the reverse."],
    ["The trade-off", "Open stomata let CO₂ in but water out."],
    ["Sun vs shade leaf", "Sun: thicker, more palisade layers. Shade: thinner, wider."]
  ]
};
