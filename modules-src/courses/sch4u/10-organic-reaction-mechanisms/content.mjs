// SCH4U 10 Organic Reaction Mechanisms. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/10-organic-reaction-mechanisms.md
// The mechanism frames, the Markovnikov lab, the roadmap map and the synthesis planner are drawn by app.js.
// Sort mode's 12 reaction cards are written for this module (the plan names 12 cards but doesn't list them).

// Misconception core sentences (plan §3), reused where the plan points to them.
const M1 = "Arrows start at electrons (a bond or lone pair) and point to where they go.";
const M2 = "H⁺ adds first to make the more stable carbocation; X⁻ or water then bonds to that more substituted carbon.";
const M3 = "Oxidation removes an H from the C–OH carbon. A tertiary C–OH carbon has none.";
const M4 = "Addition needs a C=C and makes one product; substitution swaps atoms and makes two products.";
const M5 = "The deciding step is forming the carbocation: the more stable intermediate forms faster.";
const M6 = "Esterification: the acid loses –OH, the alcohol loses H. Labelled O from the alcohol ends up in the ester.";
const M7 = "Addition puts every reactant atom into the product; substitution and elimination always make a by-product.";
const CH1 = "Count reactants and products.", CH2 = "Did a C=C appear or disappear? Did water appear or get used?";

export default {
  id:"10-organic-reaction-mechanisms",
  kind:"topic",
  title:"Organic reaction mechanisms",
  topic:"Organic Reaction Mechanisms",
  readyTopic:"organic reaction mechanisms",
  hero:{
    eq:'<span class="rm-heq"><svg class="rm-heq-arr" aria-hidden="true"></svg><span class="nw">CH₃CH<span class="rm-heq-db">=</span>CH₂ + <span class="rm-heq-h">H</span><span class="rm-heq-br">Br</span> →</span> <span class="nw">CH₃CHBrCH₃ <span class="rm-heq-maj">(major)</span></span></span>',
    eqSize:"sm",
    eqLabel:"C H 3 C H double bond C H 2, plus H B r, gives C H 3 C H B r C H 3, the major product. Two curved violet arrows sit above the first step: one from the C=C to the H of H B r, one from the H–Br bond to Br.",
    headline:"Follow the electrons",
    text:"Every organic reaction is electrons moving from where they are plentiful to where they’re wanted. A <strong>curved arrow</strong> shows one electron pair on the move. Learn a few <strong>reaction types</strong> and a few <strong>mechanisms</strong>, and you can predict products you’ve never seen, and plan how to make them.",
    fig:{ html:'<div class="rm-hx"><div class="rm-hx-box" id="rm-hx-box"><svg class="rm-hx-svg" id="rm-hx-svg" viewBox="0 0 640 400" role="img" aria-label="Propene and HBr approach. A violet curved arrow leaves the C=C and lands on the H of HBr; a second arrow moves the H–Br bond’s electrons onto Br, which leaves as Br⁻. The middle carbon turns positive: a secondary carbocation, and a stability bar fills to more stable. A third arrow from a Br⁻ lone pair lands on the positive carbon, and 2-bromopropane appears, labelled major. Beside it, faded: the primary carbocation and 1-bromopropane, labelled minor."></svg></div><div class="rm-hx-row"><p class="rm-hx-cap" id="rm-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="rm-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can classify organic reactions as addition, substitution, elimination, oxidation, reduction, esterification, hydrolysis, condensation or combustion.",
    "I can read and draw curved arrows that show electron-pair movement in simple mechanisms.",
    "I can explain Markovnikov’s rule using carbocation stability and predict major products.",
    "I can predict the products of oxidizing primary, secondary and tertiary alcohols.",
    "I can plan a two- or three-step route between families using a reaction roadmap.",
    "I can evaluate reactions using evidence (isotope labels) and atom economy."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Functional groups", goal:1,
          prompt:"Which family does CH₃CH₂CHO belong to?",
          options:[
            { t:"Aldehyde", ok:true, why:"–CHO at the chain end." },
            { t:"Ketone", why:"A ketone’s C=O is inside the chain." },
            { t:"Alcohol", why:"No –OH." },
            { t:"Carboxylic acid", why:"No –COOH." }],
          hints:["Where is the C=O?", "At the end, with an H.", "Aldehyde (propanal)."] },
        { id:"w2", skill:"Functional groups", goal:5,
          prompt:"An ester forms from…",
          options:[
            { t:"a carboxylic acid and an alcohol", ok:true, why:"Esterification: –COOH + –OH." },
            { t:"an aldehyde and an alcohol", why:"Needs –COOH." },
            { t:"an alkene and water", why:"That makes an alcohol." },
            { t:"an amine and an acid", why:"That makes an amide." }],
          hints:["Esterification.", "–COOH + –OH.", "Acid + alcohol."] },
        { id:"w3", skill:"Addition to alkenes", goal:3,
          prompt:"Ethene + H₂O (acid catalyst) → ?",
          options:[
            { t:"ethanol", ok:true, why:"H and OH add across the C=C." },
            { t:"ethanal", why:"No oxidation happens." },
            { t:"ethane + O₂", why:"Water adds whole." },
            { t:"ethene (no reaction)", why:"Hydration is a standard addition." }],
          hints:["What adds across the double bond?", "H on one carbon, OH on the other.", "Ethanol."] },
        { id:"w4", skill:"Alcohol classes", goal:4,
          prompt:"Which is a secondary alcohol?",
          options:[
            { t:"propan-2-ol, CH₃CH(OH)CH₃", ok:true, why:"The C–OH carbon has two carbons on it." },
            { t:"propan-1-ol", why:"Its C–OH carbon has one carbon: primary." },
            { t:"2-methylpropan-2-ol", why:"Three carbons: tertiary." },
            { t:"methanol", why:"No carbons on the C–OH carbon." }],
          hints:["Count carbons attached to the C–OH carbon.", "Two means secondary.", "Propan-2-ol."] },
        { id:"w5", skill:"Polarity and ions", goal:2,
          prompt:"In the H–Br bond, which atom carries the partial negative charge?",
          options:[
            { t:"Br", ok:true, why:"Br (2.96) is more electronegative than H (2.20)." },
            { t:"H", why:"That reverses electronegativity: Br (2.96) pulls the shared pair harder than H (2.20)." },
            { t:"Neither: the bond is nonpolar", why:"ΔEN = 0.76: polar." },
            { t:"Both equally", why:"One end pulls harder." }],
          hints:["Compare electronegativities.", "Br 2.96 vs H 2.20.", "Br is δ−."] },
        { id:"w6", skill:"Polarity and ions", goal:2,
          prompt:"Which species is electron-rich, able to donate an electron pair?",
          options:[
            { t:"OH⁻", ok:true, why:"Lone pairs and a negative charge." },
            { t:"H⁺", why:"H⁺ has no electrons; it accepts a pair." },
            { t:"A carbocation, CH₃⁺", why:"Positive and electron-poor." },
            { t:"Na⁺", why:"A positive ion doesn’t donate pairs." }],
          hints:["Look for lone pairs or negative charge.", "Positive species accept pairs.", "OH⁻."] }
      ],
      refreshers:{
        "Functional groups":"–OH alcohol, –CHO aldehyde, C=O inside the chain ketone, –COOH acid, –COO– ester.",
        "Addition to alkenes":"H₂, X₂, HX and H₂O add across C=C.",
        "Alcohol classes":"Count carbons on the C–OH carbon: 1 primary, 2 secondary, 3 tertiary.",
        "Polarity and ions":"Electron-rich species (lone pairs, negative charge) donate pairs; electron-poor ones (H⁺, C⁺) accept them."
      }
    }
  },
  explore:{
    heading:"Reaction sorter and mechanism stepper",
    intro:"Sort reactions by type, then step inside three of them to watch the electrons move.",
    how:"Choose a mode. <strong>Sort:</strong> read the card, then tap the type it belongs to. <strong>Mechanism:</strong> choose a mechanism and use Play, Step and Back; choose <strong>Draw it</strong> to place each arrow yourself (a tail, then a head). <strong>Markovnikov lab:</strong> choose an alkene and a reagent and compare the two possible carbocations.",
    modes:[{ id:"sort", t:"Sort" }, { id:"mech", t:"Mechanism" }, { id:"lab", t:"Markovnikov lab" }],
    bins:[{ id:"add", t:"addition" }, { id:"sub", t:"substitution" }, { id:"elim", t:"elimination" }, { id:"ox", t:"oxidation" }, { id:"red", t:"reduction" },
      { id:"ester", t:"esterification" }, { id:"hyd", t:"hydrolysis" }, { id:"cond", t:"condensation" }, { id:"comb", t:"combustion" }],
    // Sort mode cards (written for this module; each has one clearly best type). look = what to notice.
    cards:[
      { id:"c1", t:"CH₃CH=CH₂ + HBr → CH₃CHBrCH₃", type:"add", look:"Two molecules become one, across the C=C." },
      { id:"c2", t:"CH₃CH₂CH₂Br + OH⁻ → CH₃CH₂CH₂OH + Br⁻", type:"sub", look:"OH swaps in for Br; Br⁻ is the second product." },
      { id:"c3", t:"CH₃CH₂OH → CH₂=CH₂ + H₂O (acid, heat)", type:"elim", look:"Water leaves and a C=C forms." },
      { id:"c4", t:"CH₃CH(OH)CH₃ + [O] → CH₃COCH₃ + H₂O", type:"ox", look:"The alcohol loses two H atoms: a ketone forms." },
      { id:"c5", t:"CH₃CHO + H₂ → CH₃CH₂OH (catalyst)", type:"red", look:"The C=O gains H: an aldehyde becomes an alcohol." },
      { id:"c6", t:"HCOOH + CH₃CH₂OH → HCOOCH₂CH₃ + H₂O", type:"ester", look:"Acid + alcohol → ester + water." },
      { id:"c7", t:"CH₃COOCH₃ + H₂O → CH₃COOH + CH₃OH", type:"hyd", look:"Water splits an ester into its acid and alcohol." },
      { id:"c8", t:"CH₄ + 2O₂ → CO₂ + 2H₂O", type:"comb", look:"A fuel burns in O₂: CO₂ and H₂O." },
      { id:"c9", t:"CH₃COOH + NH₃ → CH₃CONH₂ + H₂O", type:"cond", look:"An acid and N join, losing water: an amide." },
      { id:"c10", t:"CH₂=CH₂ + H₂O → CH₃CH₂OH (acid catalyst)", type:"add", look:"Water adds across the C=C: one product." },
      { id:"c11", t:"CH₃CH₂CHO + [O] → CH₃CH₂COOH", type:"ox", look:"The aldehyde gains an O: an acid forms." },
      { id:"c12", t:"C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O", type:"comb", look:"Burned completely in O₂: only CO₂ and H₂O." }
    ],
    sig:{ add:M4, sub:"Substitution: one atom or group swaps for another, so there are two products.", elim:"Elimination: a small molecule leaves and a C=C forms.",
      ox:"Oxidation: the carbon gains O or loses H.", red:"Reduction: the carbon gains H or loses O.", ester:"Esterification: an acid and an alcohol join, and water is lost.",
      hyd:"Hydrolysis: water is used up to split a molecule.", cond:"Condensation: two molecules join and water is lost (an amide when N joins).", comb:"Combustion: burning in O₂ to CO₂ and H₂O." },
    predIntro:"Make a prediction first. Then the lab or the stepper shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"<strong>Markovnikov lab: propene + HBr.</strong> Which product is major?",
        options:[{ t:"2-bromopropane", ok:true }, { t:"1-bromopropane" }, { t:"1,2-dibromopropane" }, { t:"propane" }],
        explain:"The secondary carbocation’s bar beats the primary one, and the 2-bromo product grows. The more stable secondary carbocation forms; Br⁻ bonds there." },
      { id:"p2", prompt:"<strong>Mechanism 2.</strong> In bromoethane + OH⁻ → ethanol + Br⁻, which bond breaks?",
        options:[{ t:"C–Br", ok:true }, { t:"C–H" }, { t:"C–C" }, { t:"O–H" }],
        explain:"The C–Br electrons slide onto Br as OH⁻’s lone pair forms C–O. Substitution: OH swaps in for Br." },
      { id:"p3", prompt:"<strong>Markovnikov lab: but-2-ene + HBr.</strong> How many different products (structural isomers) can form?",
        options:[{ t:"1", ok:true }, { t:"2" }, { t:"3" }, { t:"0" }],
        explain:"Either carbon gives the same secondary carbocation and 2-bromobutane. Symmetric alkene: both ends are alike." },
      { id:"p4", prompt:"<strong>Mechanism 3.</strong> What does dehydrating propan-2-ol make?",
        options:[{ t:"propene and water", ok:true }, { t:"propanone and hydrogen" }, { t:"propan-1-ol" }, { t:"propane and oxygen" }],
        explain:"H₂O leaves, then H⁺ leaves to form the C=C. Elimination: a small molecule (water) leaves and a C=C forms." }
    ],
    chalIntro:"Use the stepper or the lab to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"<strong>Draw it</strong> sub-mode, mechanism 1, step 1: place the two arrows.",
        why:"Arrow 1 runs from the C=C bond to H; arrow 2 from the H–Br bond to Br. " + M1,
        hints:["Where are the electrons that will form the C–H bond?", "In the C=C π bond.", "C=C → H; H–Br bond → Br."] },
      { id:"tc2", goal:3, prompt:"<strong>Markovnikov lab:</strong> choose an alkene and reagent that give <strong>2-chloro-2-methylpropane</strong> as the major product.",
        why:"2-methylpropene + HCl: H⁺ adds to C1, the tertiary carbocation forms on C2, and Cl⁻ bonds there.",
        hints:["The product has 4 carbons with Cl on a carbon bonded to three others.", "The tertiary carbocation must form.", "2-methylpropene + HCl."] },
      { id:"tc3", goal:3, stretch:true, prompt:"Select <strong>every</strong> alkene from the chips whose addition of HBr gives 2-bromobutane as the major product. (In the lab, set <strong>Pick</strong> to <strong>Several alkenes</strong>.)",
        why:"But-1-ene (Markovnikov) and but-2-ene (either carbon) both make the secondary carbocation on C2 of an unbranched 4-carbon chain.",
        hints:["2-bromobutane: a 4-carbon chain, Br on C2.", "Which unbranched C₄ alkenes can put Br on C2 via a secondary carbocation?", "But-1-ene (Markovnikov) and but-2-ene (either carbon)."] }
    ],
    blocks:[{ title:"What the stepper shows", html:"<p>The type tells you what changes; the mechanism tells you why, and where the atoms end up.</p>" }]
  },
  part3:{
    slug:"roadmap", name:"Roadmap", heading:"Reaction roadmap",
    intro:"Three stations: fill the map, plan routes on it, then weigh the evidence and the efficiency. Reagents are named generically (“oxidizing agent [O]”, “acid catalyst, heat”): no quantities or procedures.",
    s1:{ title:"Station 1: Fill the map",
      intro:"Each arrow on the map is a reaction type. Tap a label chip, then tap the blank on the arrow it belongs to. Chips can be used more than once.",
      nodes:{ alkane:"alkane", halide:"alkyl halide", alkene:"alkene", p:"primary alcohol", s:"secondary alcohol", t:"tertiary alcohol", ald:"aldehyde", ket:"ketone", acid:"carboxylic acid", ester:"ester", amide:"amide" },
      chips:[{ id:"h2o", t:"add H₂O (acid catalyst)" }, { id:"hx", t:"add HX" }, { id:"h2", t:"add H₂ (catalyst)" }, { id:"oh", t:"substitute with OH⁻" },
        { id:"elim", t:"eliminate H₂O (acid, heat)" }, { id:"ox", t:"oxidize [O]" }, { id:"red", t:"reduce (add H₂)" }, { id:"est", t:"esterify (+ alcohol, acid catalyst)" },
        { id:"cond", t:"condense (+ amine)" }, { id:"hyd", t:"hydrolyse" }],
      m3:"Tertiary alcohol → ketone: tertiary alcohols don’t oxidize. " + M3,
      done:"Map complete. Every arrow is a reaction type you know: addition, substitution, elimination, oxidation, reduction, esterification, condensation and hydrolysis." },
    s2:{ title:"Station 2: Plan a route",
      intro:"Choose a target. Then tap the arrows on the map, in order, to follow your molecule from the start to the target. Each tap is one step.",
      targets:[
        { id:"r1", t:"ethene → ethanoic acid", start:"ethene", goal:"ethanoic acid", plan:"Hydrate, then oxidize twice: ethene → ethanol → ethanal → ethanoic acid." },
        { id:"r2", t:"propene → propanone", start:"propene", goal:"propanone", plan:"Hydrate (Markovnikov) to propan-2-ol, then oxidize: propene → propan-2-ol → propanone." },
        { id:"r3", t:"ethene → ethyl ethanoate", start:"ethene", goal:"ethyl ethanoate", plan:"Hydrate part of the ethene; oxidize part of the ethanol to ethanoic acid (through ethanal); esterify the acid with the rest of the ethanol." }] },
    s3:{ title:"Station 3: Evidence and efficiency",
      isoIntro:"<strong>Isotope labels.</strong> Ethanol is made with heavy oxygen, ¹⁸O, then esterified with ethanoic acid. Where does the label go?",
      isoAfter:"When the alcohol’s O is labelled, the label appears in the ester, not the water. This is evidence that the acid supplies the –OH that leaves. " + M6,
      aeIntro:"<strong>Atom economy.</strong> Two routes to ethanol: by addition (ethene + water) or by substitution (bromoethane + OH⁻). Each bar shows the percentage of reactant atoms (by mass) that end up in ethanol.",
      aeAfter:"Addition puts every reactant atom into the product: 100%. Substitution makes Br⁻ as waste, so its atom economy is well under 100%." },
    quickCheck:{
      title:"Quick check", summary:"Reaction roadmap quick check",
      items:[
        { id:"q1", goal:4, prompt:"Oxidizing a primary alcohol fully gives…",
          choices:[
            { t:"a carboxylic acid", ok:true, fb:"Right. Primary → aldehyde → acid." },
            { t:"a ketone", fb:"Primary → aldehyde → acid." },
            { t:"an alkene", fb:"Primary → aldehyde → acid." },
            { t:"nothing", fb:"Primary → aldehyde → acid." }] },
        { id:"q2", goal:4, prompt:"Which alcohol resists oxidation?",
          choices:[
            { t:"2-methylpropan-2-ol", ok:true, fb:"Right. Tertiary: no H on the C–OH carbon." },
            { t:"propan-2-ol", fb:"Tertiary: no H on the C–OH carbon." },
            { t:"ethanol", fb:"Tertiary: no H on the C–OH carbon." },
            { t:"propan-1-ol", fb:"Tertiary: no H on the C–OH carbon." }] },
        { id:"q3", goal:6, prompt:"Labelled O from the alcohol ends up in…",
          choices:[
            { t:"the ester", ok:true, fb:"Right. The acid’s –OH leaves in the water." },
            { t:"the water", fb:"The acid’s –OH leaves in the water." },
            { t:"both", fb:"The acid’s –OH leaves in the water." },
            { t:"neither", fb:"The acid’s –OH leaves in the water." }] },
        { id:"q4", goal:6, prompt:"Which reaction type has 100% atom economy?",
          choices:[
            { t:"addition", ok:true, fb:"Right. Only addition makes no by-product." },
            { t:"substitution", fb:"Only addition makes no by-product." },
            { t:"elimination", fb:"Only addition makes no by-product." },
            { t:"condensation", fb:"Only addition makes no by-product." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"classify", type:"sorter", title:"Classify the reaction", summary:"Classify the reaction", goal:1, noun:"reaction", txt:true,
        instruction:"Ten reactions, nine types. Sort each reaction into the type that fits it best.",
        boxes:[{ id:"add", label:"Addition" }, { id:"sub", label:"Substitution" }, { id:"elim", label:"Elimination" }, { id:"ox", label:"Oxidation" }, { id:"red", label:"Reduction" },
          { id:"ester", label:"Esterification" }, { id:"hyd", label:"Hydrolysis" }, { id:"cond", label:"Condensation" }, { id:"comb", label:"Combustion" }],
        wrongDefault:"Look at what changes: count reactants and products, and check whether a C=C or water appears or disappears.",
        items:[
          { id:"i1", t:"CH₂=CH₂ + Br₂ → CH₂BrCH₂Br", answer:"add", why:"Br₂ adds across the C=C, and two molecules become one.",
            hints:[CH1, CH2, "Addition: Br₂ adds across the C=C, and two molecules become one."] },
          { id:"i2", t:"CH₄ + Cl₂ → CH₃Cl + HCl (light)", answer:"sub", why:"A Cl swaps in for an H, and HCl is the second product.",
            wrong:{ add:M4 }, hints:[CH1, CH2, "Substitution: a Cl swaps in for an H, and HCl is the second product."] },
          { id:"i3", t:"CH₃CH(OH)CH₃ → CH₃CH=CH₂ + H₂O (acid, heat)", answer:"elim", why:"Water leaves and a C=C forms.",
            wrong:{ hyd:"Water is lost, not added: elimination." }, hints:[CH1, CH2, "Elimination: water leaves and a C=C forms."] },
          { id:"i4", t:"CH₃CH₂OH + [O] → CH₃CHO + H₂O", answer:"ox", why:"Ethanol loses two H atoms and becomes ethanal.",
            hints:[CH1, CH2, "Oxidation: ethanol loses two H atoms and becomes ethanal."] },
          { id:"i5", t:"CH₃COCH₃ + H₂ → CH₃CH(OH)CH₃", answer:"red", why:"The ketone gains H₂ and becomes an alcohol.",
            wrong:{ add:"Adding H₂ to a C=O is a reduction: the carbon gains H." }, hints:[CH1, CH2, "Reduction: the ketone gains H₂ and becomes an alcohol."] },
          { id:"i6", t:"CH₃COOH + CH₃OH → CH₃COOCH₃ + H₂O", answer:"ester", why:"Acid + alcohol → ester + water.",
            hints:[CH1, CH2, "Esterification: acid + alcohol → ester + water."] },
          { id:"i7", t:"CH₃COOCH₂CH₃ + H₂O → CH₃COOH + CH₃CH₂OH", answer:"hyd", why:"Water splits the ester into its acid and alcohol.",
            hints:[CH1, CH2, "Hydrolysis: water splits the ester into its acid and alcohol."] },
          { id:"i8", t:"C₃H₈ + 5O₂ → 3CO₂ + 4H₂O", answer:"comb", why:"A hydrocarbon burns in O₂ to CO₂ and H₂O.",
            hints:[CH1, CH2, "Combustion: a hydrocarbon burns in O₂ to CO₂ and H₂O."] },
          { id:"i9", t:"CH₃COOH + CH₃NH₂ → CH₃CONHCH₃ + H₂O", answer:"cond", why:"The acid and the amine join with water lost, making an amide.",
            wrong:{ ester:"N, not O, joins: an amide by condensation." }, hints:[CH1, CH2, "Condensation: the acid and the amine join with water lost, making an amide."] },
          { id:"i10", t:"CH₃CH₂Br + OH⁻ → CH₃CH₂OH + Br⁻", answer:"sub", why:"OH swaps in for Br, and Br⁻ is the second product.",
            hints:[CH1, CH2, "Substitution: OH swaps in for Br, and Br⁻ is the second product."] }
        ] },
      { id:"routes", type:"mc", title:"Predict products and routes", summary:"Predict products and routes", star:true, goal:[3, 4, 5, 6],
        instruction:"Six items. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        items:[
          { id:"r1", goal:3, prompt:"Major product of propene + H₂O (acid)?",
            options:[
              { t:"propan-2-ol", ok:true, why:"H⁺ adds to C1, the secondary carbocation forms on C2, and water bonds there." },
              { t:"propan-1-ol", why:M2 },
              { t:"propanal", why:"No oxidation happens: water adds across the C=C." },
              { t:"propane", why:"That needs H₂, not water." }] },
          { id:"r2", goal:4, prompt:"Product of oxidizing butan-2-ol?",
            options:[
              { t:"butanone", ok:true, why:"Secondary → ketone." },
              { t:"butanoic acid", why:"Secondary → ketone, and it stops there." },
              { t:"butanal", why:"An aldehyde comes from a primary alcohol (butan-1-ol)." },
              { t:"no reaction", why:"Only tertiary alcohols resist oxidation; butan-2-ol is secondary." }] },
          { id:"r3", goal:3, star:true, prompt:"Major product of 2-methylbut-2-ene + HCl?",
            options:[
              { t:"2-chloro-2-methylbutane", ok:true, why:"H⁺ adds to C3, and the tertiary carbocation forms at C2; Cl⁻ bonds there." },
              { t:"2-chloro-3-methylbutane", why:"The tertiary carbocation forms at C2." },
              { t:"1-chloro-2-methylbutane", why:"Cl bonds to a carbon of the C=C (C2 or C3), never to C1." },
              { t:"2-chloropentane", why:"The carbon skeleton doesn’t change: it stays branched." }] },
          { id:"r4", goal:5, star:true, prompt:"Which reagent sequence turns propan-1-ol into propan-2-ol?",
            options:[
              { t:"eliminate H₂O (acid, heat), then add H₂O (acid)", ok:true, why:"Dehydrate to propene, then Markovnikov hydration puts OH on C2." },
              { t:"oxidize [O], then reduce (add H₂)", why:"Oxidizing gives propanal; reducing it gives propan-1-ol back. The O never leaves C1." },
              { t:"add H₂O (acid), then eliminate H₂O", why:"Propan-1-ol has no C=C to add water to." },
              { t:"substitute with OH⁻", why:"There’s no halogen to swap, and an OH can’t move directly." }],
            hints:["Can you move an OH directly? No.", "Go through an alkene.", "Eliminate, then add water with Markovnikov’s rule."] },
          { id:"r5", goal:6, star:true, prompt:"<strong>Investigation:</strong> Methanol with labelled ¹⁸O reacts with ethanoic acid. Where is the label?",
            options:[
              { t:"in methyl ethanoate", ok:true, why:M6 },
              { t:"in water", why:M6 },
              { t:"split between the ester and the water", why:"The alcohol keeps its O; only its O–H hydrogen leaves." },
              { t:"in leftover ethanoic acid", why:"The label starts on the alcohol, and esterification doesn’t move it to the acid." }] },
          { id:"r6", goal:5, star:true, prompt:"Fewest steps from ethene to ethyl ethanoate, using only ethene and water as starting materials (plus catalysts and an oxidizing agent)?",
            options:[
              { t:"3: hydrate → ethanol; oxidize part → ethanoic acid; esterify", ok:true, why:"Both the alcohol and the acid come from ethanol." },
              { t:"2: hydrate, then esterify", why:"You need both the alcohol and the acid." },
              { t:"1: add ethanoic acid to ethene", why:"Only ethene and water are allowed, and an ester needs an alcohol’s –OH." },
              { t:"3: hydrate; oxidize; reduce", why:"Reducing undoes the oxidation, and no ester forms." }],
            hints:["An ester needs an acid and an alcohol.", "Both come from ethanol.", "Hydrate, oxidize some, esterify."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Colm", how:"", goal:[2, 3, 4],
        instruction:"Colm made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Predict the major product of but-1-ene + HBr.",
            steps:["H⁺ adds to one carbon of the C=C.", "Adding H⁺ to C2 gives a primary carbocation on C1.", "Br⁻ bonds to C1.", "Major product: 1-bromobutane."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Follows step 2.", "Follows step 2."],
            fixes:[
              { t:"H⁺ adds to C1 (the end CH₂), giving the more stable secondary carbocation on C2; major product 2-bromobutane.", ok:true, why:M2 },
              { t:"H⁺ adds to C3.", why:"C3 isn’t part of the double bond." },
              { t:"Both bromines add: 1,2-dibromobutane.", why:"HBr has one Br: H adds to one carbon and Br to the other." },
              { t:"Step 2 is correct.", why:M2 }],
            hints:["Which carbocation is more stable?", "Secondary beats primary.", "2-bromobutane."] },
          { id:"e2", goal:2, task:"Describe the arrows for OH⁻ + bromoethane → ethanol + Br⁻.",
            steps:["OH⁻ has lone pairs on O.", "Arrow 1 goes from the carbon to the O of OH⁻.", "Arrow 2 goes from the C–Br bond to Br.", "The C–O bond forms and Br⁻ leaves."],
            answer:1,
            stepFb:["Correct. Keep checking.", "", "Step 3 is a correct description, but the first mistake is earlier.", "Follows step 2."],
            fixes:[
              { t:"Arrow 1 starts at an O lone pair and points to the carbon.", ok:true, why:M1 },
              { t:"Arrow 1 goes from Br to O.", why:"Br’s electrons leave with Br; the electrons for the new C–O bond come from O." },
              { t:"Arrows show the OH⁻ ion moving; direction doesn’t matter.", why:M1 },
              { t:"Step 2 is correct.", why:M1 }],
            hints:["Where are the electrons that form the new C–O bond?", "On the oxygen.", "From an O lone pair to C."] },
          { id:"e3", goal:4, task:"Predict the product of oxidizing 2-methylpropan-2-ol.",
            steps:["The C–OH carbon is bonded to three carbons: tertiary.", "Oxidation turns the C–OH into C=O.", "So the product is 2-methylpropanone."],
            answer:1,
            stepFb:["Correct. Keep checking.", "", "Follows step 2."],
            fixes:[
              { t:"Making C=O requires removing an H from the C–OH carbon; a tertiary C–OH carbon has none, so there’s no reaction.", ok:true, why:M3 },
              { t:"The product is 2-methylpropanal.", why:M3 },
              { t:"The product is 2-methylpropanoic acid.", why:M3 },
              { t:"Step 2 is correct.", why:M3 }],
            hints:["What two atoms are removed when an alcohol is oxidized?", "The O–H hydrogen and an H on the C–OH carbon.", "None on a tertiary carbon: no reaction."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which surprised you more: that the arrows show electrons, not atoms, or that the more stable carbocation decides the product?" },
      { id:"j2", q:"In your own words, explain Markovnikov’s rule using carbocations." },
      { id:"j3", q:"Explain to a friend how to plan a route from an alkene to an ester." },
      { id:"j4", q:"Which reaction type do you still mix up with another? What will you do to tell them apart?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"CH₂=CH₂ + Br₂ → CH₂BrCH₂Br is which type of reaction?", options:[
          { t:"addition", ok:true, why:"Br₂ adds across the C=C: two molecules become one." },
          { t:"substitution", why:"No atom was swapped out; there’s one product." },
          { t:"elimination", why:"A C=C disappeared, not formed." },
          { t:"condensation", why:"Nothing small was released." }] },
        b:{ prompt:"CH₃CH₃ + Cl₂ → CH₃CH₂Cl + HCl (in light) is which type of reaction?", options:[
          { t:"substitution", ok:true, why:"A Cl swaps in for an H, and HCl is the second product." },
          { t:"addition", why:"Ethane has no C=C." },
          { t:"elimination", why:"No C=C forms." },
          { t:"combustion", why:"No O₂ is involved." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"In a mechanism, what does a curved arrow show?", options:[
          { t:"an electron pair moving", ok:true, why:M1 },
          { t:"an atom moving", why:M1 },
          { t:"a proton moving", why:M1 },
          { t:"the direction heat flows", why:"Arrows show electrons." }] },
        b:{ prompt:"Where should a curved arrow start?", options:[
          { t:"at a source of electrons: a lone pair or a bond", ok:true, why:M1 },
          { t:"at the atom that will gain electrons", why:M1 },
          { t:"at a positive charge", why:M1 },
          { t:"at the product", why:"Arrows show how reactants change." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"What does oxidizing propan-2-ol give?", options:[
          { t:"propanone", ok:true, why:"Secondary → ketone." },
          { t:"propanal", why:"That’s from a primary alcohol." },
          { t:"propanoic acid", why:"Secondary → ketone, and it stops there." },
          { t:"no reaction", why:"Secondary alcohols do oxidize, to ketones." }] },
        b:{ prompt:"What does oxidizing 2-methylpropan-2-ol give?", options:[
          { t:"no reaction", ok:true, why:"Tertiary." },
          { t:"2-methylpropanal", why:M3 },
          { t:"2-methylpropanone", why:"That can’t exist: the central carbon would need five bonds. " + M3 },
          { t:"2-methylpropanoic acid", why:M3 }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"What is the major product of 2-methylpropene + HCl?", options:[
          { t:"2-chloro-2-methylpropane", ok:true, why:"Tertiary carbocation." },
          { t:"1-chloro-2-methylpropane", why:M2 },
          { t:"2-chlorobutane", why:"The skeleton doesn’t change." },
          { t:"2-methylpropane", why:"HCl adds; H₂ wasn’t used." }] },
        b:{ prompt:"What is the major product of propene + H₂O (acid catalyst)?", options:[
          { t:"propan-2-ol", ok:true, why:"The secondary carbocation forms on C2, and water bonds there." },
          { t:"propan-1-ol", why:M2 },
          { t:"propanal", why:"No oxidation happens." },
          { t:"propane-1,2-diol", why:"One water adds." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"Which alkene gives only one structural product when it reacts with HCl?", options:[
          { t:"but-2-ene", ok:true, why:"Symmetric: both carbons of the C=C are alike." },
          { t:"propene", why:"Two possible products (one major)." },
          { t:"but-1-ene", why:"Two possible products." },
          { t:"2-methylpropene", why:"Two possible products (one major)." }] },
        b:{ prompt:"Which alkene + H₂O (acid) gives 2-methylbutan-2-ol as the major product?", options:[
          { t:"2-methylbut-2-ene", ok:true, why:"H⁺ adds to C3 to give the tertiary carbocation at C2." },
          { t:"pent-1-ene", why:"Gives pentan-2-ol." },
          { t:"pent-2-ene", why:"Gives pentan-2-ol and pentan-3-ol." },
          { t:"2-methylbutane", why:"No C=C: no reaction." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Which sequence turns propene into propanone?", options:[
          { t:"add H₂O (acid) to get propan-2-ol, then oxidize", ok:true, why:"Markovnikov hydration puts the OH on C2, and a secondary alcohol oxidizes to a ketone." },
          { t:"add H₂O to get propan-1-ol, then oxidize", why:"That would give propanal. " + M2 },
          { t:"oxidize propene directly", why:"Alkenes don’t oxidize to ketones this way." },
          { t:"add H₂ to get propane, then oxidize", why:"Alkanes don’t oxidize to ketones." }] },
        b:{ prompt:"Which sequence turns ethene into ethyl ethanoate?", options:[
          { t:"hydrate ethene to ethanol; oxidize part of it to ethanoic acid; esterify the acid with the rest of the ethanol", ok:true, why:"An ester needs an acid and an alcohol, and both come from ethanol." },
          { t:"hydrate ethene to ethanol; esterify ethanol with more ethanol", why:"An ester needs an acid." },
          { t:"oxidize ethene to ethanoic acid; add ethene", why:"Esters form from an acid and an alcohol." },
          { t:"add H₂ to make ethane; esterify the ethane with ethanoic acid", why:"Alkanes have no –OH, so they can’t form esters." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of why propene + HBr gives mainly 2-bromopropane?", options:[
          { t:"“H⁺ adds to the end carbon so the positive charge sits on the middle carbon, a more stable secondary carbocation; Br⁻ then bonds there.”", ok:true, why:M5 },
          { t:"“Br is attracted to the carbon with more hydrogens.”", why:M2 },
          { t:"“2-bromopropane is lighter, so it forms more.”", why:"The masses are equal." },
          { t:"“The product that’s most stable at the end always forms.”", why:"The intermediate decides. " + M5 }] },
        b:{ prompt:"Which is the best explanation of why a tertiary carbocation is more stable than a primary one?", options:[
          { t:"“Three alkyl groups push electron density toward the positive carbon, spreading out the charge.”", ok:true, why:"More alkyl groups spread the charge more: tertiary > secondary > primary." },
          { t:"“It has more hydrogens on the positive carbon.”", why:"It has none." },
          { t:"“It has a full octet.”", why:"Carbocations have only six valence electrons." },
          { t:"“It’s heavier.”", why:"Mass isn’t the reason." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which description of step 2 of HBr adding to propene is correct?", options:[
          { t:"“A lone pair on Br⁻ forms a bond to the positive carbon: the arrow goes from Br⁻ to C⁺.”", ok:true, why:M1 },
          { t:"“The arrow goes from C⁺ to Br⁻.”", why:M1 },
          { t:"“Br⁺ attacks the alkene.”", why:"Bromide is negative." },
          { t:"“A hydride ion leaves.”", why:"No H⁻ moves." }] },
        b:{ prompt:"Which description of OH⁻ substituting for Br in bromoethane is correct?", options:[
          { t:"“An O lone pair attacks the carbon as the C–Br bond’s electrons leave with Br, in one step.”", ok:true, why:"One step: OH⁻ attacks as Br⁻ leaves. " + M1 },
          { t:"“The carbon’s electrons move to OH⁻.”", why:M1 },
          { t:"“Br⁺ leaves and OH⁺ arrives.”", why:"Br leaves as Br⁻." },
          { t:"“OH⁻ adds and nothing leaves.”", why:"That would be addition." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Ethanol can be made by route 1, ethene + water (addition), or route 2, bromoethane + OH⁻ (substitution). Which wastes fewer atoms, and why?", options:[
          { t:"Route 1: every atom of ethene and water ends up in ethanol; route 2 also makes Br⁻ as waste", ok:true, why:M7 },
          { t:"Route 2: substitution always gives more product", why:M7 },
          { t:"Both waste the same: every reaction loses atoms", why:M7 },
          { t:"Route 1, because water is free", why:"Atom economy counts atoms, not cost." }] },
        b:{ prompt:"Propan-2-ol can be made by route 1, propene + water, or route 2, 2-bromopropane + OH⁻. Which has the better atom economy, and why?", options:[
          { t:"Route 1: addition puts all reactant atoms into the product", ok:true, why:M7 },
          { t:"Route 2: it starts from a halide", why:M7 },
          { t:"They’re equal", why:M7 },
          { t:"Route 2, because OH⁻ is cheap", why:"Atom economy is about atoms." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A flavour chemist wants methyl butanoate (fruity). Which reactants and reaction type are needed?", options:[
          { t:"butanoic acid + methanol, esterification (acid catalyst)", ok:true, why:"The methyl part comes from the alcohol and the butanoate part from the acid." },
          { t:"butan-1-ol + methanoic acid, esterification", why:"That gives butyl methanoate. " + M6 },
          { t:"butanoic acid + methane, addition", why:"Methane has no OH." },
          { t:"methyl butane + O₂, oxidation", why:"That’s not how esters form." }] },
        b:{ prompt:"Soap is made by heating fats (esters) with a base. What type of reaction breaks the fat?", options:[
          { t:"hydrolysis (saponification): the ester links split into carboxylate salts and glycerol", ok:true, why:"The base splits each ester link." },
          { t:"esterification", why:"That makes esters; soap-making breaks them." },
          { t:"addition", why:"No C=C is involved." },
          { t:"oxidation", why:"No oxygen is added to the carbon skeleton." }] } }
    ]
  },
  task:{
    title:"Plan a synthesis", summary:"Plan a synthesis",
    statement:"<p>Starting from one alkene, plan a route that makes a 4-carbon ketone. Can you find all the routes?</p><ol class=\"rm-conds\"><li>The final product is a ketone.</li><li>It has 4 carbons.</li><li>The route has at most 3 steps.</li><li>Every step uses a reaction from the roadmap and gives its major product.</li></ol>" +
      "<p class=\"tiny muted\"><strong>Model rules.</strong> Alkenes add H₂O or HBr with Markovnikov’s rule, and H₂ to give the alkane. An alkyl bromide + OH⁻ gives the alcohol on the same carbon. Oxidizing a primary alcohol gives an aldehyde (a second oxidation gives the acid); a secondary alcohol gives a ketone; a tertiary alcohol gives no reaction. As on the roadmap, H₂ also reduces an aldehyde or a ketone to the alcohol.</p>",
    checks:["Ends as a ketone", "4 carbons", "≤ 3 steps", "Every step works"],
    tips:["Ketones come from oxidizing a secondary alcohol.", "Which alkenes give a secondary C₄ alcohol by Markovnikov addition?", "2-methylpropene gives a tertiary alcohol, which won’t oxidize.", "HBr then OH⁻ reaches the same alcohol in two steps."],
    explainPrompt:"Explain why your route gives a ketone, naming the intermediate and the rule that decided each step.",
    vocab:"Use the words Markovnikov, carbocation, secondary alcohol and oxidation.",
    success:"Your route works!",
    more:"There’s more than one route. Can you find them all?",
    after4:"Every route goes through butan-2-ol. 2-methylpropene would make a tertiary alcohol, which can’t be oxidized."
  },
  cards:[
    ["Addition", "Two molecules → one, across a C=C."],
    ["Substitution", "One atom or group swaps for another; two products."],
    ["Elimination", "A small molecule leaves and a C=C forms."],
    ["Oxidation (organic)", "Gain of O or loss of H: 1° alcohol → aldehyde → acid; 2° → ketone."],
    ["Reduction (organic)", "Gain of H or loss of O: ketone + H₂ → 2° alcohol."],
    ["Esterification", "Acid + alcohol ⇌ ester + water (acid catalyst)."],
    ["Hydrolysis", "Water splits an ester or amide into its parts."],
    ["Curved arrow", "One electron pair moving: from a bond or lone pair to an atom."],
    ["Carbocation", "A carbon with a + charge and only six valence electrons."],
    ["Carbocation stability", "tertiary > secondary > primary."],
    ["Markovnikov’s rule", "H adds to the C=C carbon that already has more H’s (via the more stable carbocation)."],
    ["Atom economy", "The share of reactant atoms that end up in the wanted product; addition = 100%."]
  ]
};
