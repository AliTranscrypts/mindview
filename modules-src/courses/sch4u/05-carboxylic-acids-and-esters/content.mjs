// SCH4U 05 Carboxylic Acids and Esters. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/05-carboxylic-acids-and-esters.md
// The reaction stage, the particle zoom, the H-bond pairs, the soap stepper and the task preview are drawn by app.js.
// The module data table (scents, boiling points) lives in app.js (course table additions, plan §6 risk 1).

// Misconception core sentences (plan §3), reused where the plan points to them.
const M1 = "The alcohol part comes first, as an alkyl group; the acid part keeps its chain and ends in -oate.";
const M2 = "The C=O side of the ester came from the acid; the O–alkyl side came from the alcohol.";
const M3 = "Condensation joins two molecules and releases H₂O.";
const M4 = "Only a small fraction of the molecules ionize in water: they’re weak acids.";
const M5 = "Esters have no O–H, so they boil far lower than acids of the same mass.";
const M6 = "The COOH carbon is C1 of the chain: CH₃CH₂COOH is propanoic acid.";
const M7 = "In base, the acid is neutralized: you get the carboxylate salt (soap) and the alcohol.";
const R5 = "Compare equal concentrations, so any difference in conductivity comes from how much each acid ionizes.";

// Ester ↔ parts (plan Activity 1): [ester, acid, alcohol, acid stem, alkyl]
const PAIRS = [
  ["methyl ethanoate", "ethanoic acid", "methanol", "ethanoate", "methyl"],
  ["ethyl methanoate", "methanoic acid", "ethanol", "methanoate", "ethyl"],
  ["propyl ethanoate", "ethanoic acid", "propan-1-ol", "ethanoate", "propyl"],
  ["ethyl propanoate", "propanoic acid", "ethanol", "propanoate", "ethyl"],
  ["methyl butanoate", "butanoic acid", "methanol", "butanoate", "methyl"],
  ["butyl methanoate", "methanoic acid", "butan-1-ol", "methanoate", "butyl"],
  ["pentyl ethanoate", "ethanoic acid", "pentan-1-ol", "ethanoate", "pentyl"],
  ["methyl benzoate", "benzoic acid", "methanol", "benzoate", "methyl"]
];
const MATCH_ANS = {}; PAIRS.forEach((p, i) => { MATCH_ANS["l" + (i + 1)] = "r" + (i + 1); });

export default {
  id:"05-carboxylic-acids-and-esters",
  kind:"topic",
  title:"Carboxylic acids and esters",
  topic:"Carboxylic Acids and Esters",
  readyTopic:"carboxylic acids and esters",
  hero:{
    eq:'<span class="nw">CH₃COOH + CH₃CH₂OH</span> <span class="nw">⇌ CH₃COOCH₂CH₃ + H₂O</span>', eqSize:"sm",
    eqLabel:"C H 3 C O O H plus C H 3 C H 2 O H, in equilibrium with C H 3 C O O C H 2 C H 3 plus H 2 O",
    headline:"An acid plus an alcohol makes a smell",
    text:"<strong>Carboxylic acids</strong> give vinegar its sharpness. Join one to an <strong>alcohol</strong> and you get an <strong>ester</strong>, the kind of molecule behind the smell of bananas, pineapples and pears. The reaction is a <strong>condensation</strong>: water is released as the two molecules join.",
    fig:{ html:'<div class="ce-hx"><svg class="ce-hx-svg" id="ce-hx-svg" viewBox="0 0 640 300" role="img" aria-label="Ethanoic acid and ethanol drift together. The acid’s O–H and the alcohol’s H glow and leave together as a water molecule. The two pieces join through the alcohol’s O to make ethyl ethanoate, which smells sweet and fruity. Its name is built from two halves: ethyl, from the alcohol, and ethanoate, from the acid."></svg><div class="ce-hx-name" id="ce-hx-name" aria-live="polite"></div><div class="ce-hx-row"><p class="ce-hx-cap" id="ce-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="ce-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can name and draw carboxylic acids, counting the COOH carbon as C1.",
    "I can name esters as alkyl alkanoates and identify the acid and alcohol parts.",
    "I can write equations for esterification and for acid and base hydrolysis.",
    "I can explain the boiling points and weak acidity of carboxylic acids, and why esters boil lower.",
    "I can apply acids and esters to flavours, fats, soaps and medicines."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Oxidation", goal:1,
          prompt:"Complete oxidation of ethanol gives…",
          options:[
            { t:"ethanoic acid", ok:true, why:"Primary alcohol → aldehyde → carboxylic acid." },
            { t:"ethanal", why:"That’s only the first step." },
            { t:"propanone", why:"Ethanol has 2 carbons." },
            { t:"ethene", why:"That’s dehydration." }],
          hints:["Primary alcohol, oxidized twice.", "Ethanal, then…", "ethanoic acid."] },
        { id:"w2", skill:"Oxidation", goal:1,
          prompt:"Which compound is oxidized to propanoic acid?",
          options:[
            { t:"propanal", ok:true, why:"Aldehyde → acid." },
            { t:"propanone", why:"Ketones resist oxidation." },
            { t:"propan-2-ol", why:"That gives propanone." },
            { t:"propane", why:"Alkanes only burn." }],
          hints:["Acids come from aldehydes.", "Which is the C₃ aldehyde?", "propanal."] },
        { id:"w3", skill:"Acids in water", goal:4,
          prompt:"A Brønsted–Lowry acid is a substance that…",
          options:[
            { t:"donates H⁺ (a proton)", ok:true, why:"Acids give a proton away: a Brønsted–Lowry acid is a proton donor." },
            { t:"accepts H⁺", why:"That’s a base." },
            { t:"releases OH⁻", why:"That’s an Arrhenius base." },
            { t:"contains oxygen", why:"Many acids do, but that’s not the definition." }],
          hints:["Acids give something away.", "A proton.", "Donates H⁺."] },
        { id:"w4", skill:"Acids in water", goal:4,
          prompt:"A strong acid in water is…",
          options:[
            { t:"completely ionized", ok:true, why:"Every molecule gives up its H⁺." },
            { t:"very concentrated", why:"Strength ≠ concentration." },
            { t:"only slightly ionized", why:"That’s a weak acid." },
            { t:"never dangerous", why:"Strength is about ionization, not safety." }],
          hints:["Strong vs weak is about ionization.", "Strong = all molecules ionize.", "Completely ionized."] },
        { id:"w5", skill:"Hydrogen bonding", goal:4,
          prompt:"Which group lets molecules hydrogen-bond to each other?",
          options:[
            { t:"O–H", ok:true, why:"An H on O, attracted to an O on the next molecule." },
            { t:"C=O alone", why:"It accepts H-bonds but can’t donate." },
            { t:"C–H", why:"Not polar enough." },
            { t:"C–O–C", why:"No H on O." }],
          hints:["An H on O, N or F.", "Which option has H on O?", "O–H."] },
        { id:"w6", skill:"Hydrogen bonding", goal:4,
          prompt:"Order by boiling point, lowest first: propane, propan-1-ol, propanal.",
          options:[
            { t:"propane < propanal < propan-1-ol", ok:true, why:"London < dipole–dipole < H-bonding." },
            { t:"propanal < propane < propan-1-ol", why:"The polar C=O raises propanal above propane." },
            { t:"propane < propan-1-ol < propanal", why:"Only the alcohol H-bonds." },
            { t:"all equal", why:"Different forces." }],
          hints:["Rank the forces.", "London < dipole–dipole < H-bonding.", "propane < propanal < propan-1-ol."] }
      ],
      refreshers:{
        "Oxidation":"Primary alcohol → aldehyde → carboxylic acid. The COOH carbon came from the CH₂OH carbon.",
        "Acids in water":"Acids donate H⁺ to water, forming H₃O⁺. Strong acids ionize completely; weak acids only partly.",
        "Hydrogen bonding":"Only molecules with O–H (or N–H, F–H) H-bond to each other; they boil highest."
      }
    }
  },
  explore:{
    heading:"Esterification station",
    intro:"Choose an acid and an alcohol, then join them. Watch water leave, read the ester’s name, and smell the result.",
    how:"Tap an acid and an alcohol (or find one on the shelf by its name), then press <strong>React</strong>. Reverse mode splits an ester with an acid catalyst or a base; Properties mode compares boiling points at the same molar mass.",
    modes:[{ id:"build", t:"Build" }, { id:"rev", t:"Reverse" }, { id:"prop", t:"Properties" }],
    predictions:[
      { id:"p1", prompt:"Ethanoic acid + ethanol. What is the ester called?",
        options:[{ t:"ethyl ethanoate", ok:true }, { t:"ethanoyl ethanoate" }, { t:"diethyl ester" }, { t:"ethyl ethanol" }],
        explain:"Alcohol part (ethyl) + acid part (ethanoate)." },
      { id:"p2", prompt:"Ethanoic acid + ethanol again, with the alcohol’s O marked as heavy oxygen (¹⁸O). After the reaction, where does the heavy O end up?",
        options:[{ t:"in the ester", ok:true }, { t:"in the water" }, { t:"split between them" }, { t:"it escapes as O₂" }],
        explain:"Isotope labelling shows the water’s O comes from the acid’s OH. The alcohol keeps its O." },
      { id:"p3", prompt:"Ethanoic acid (60 g/mol) boils at 118 °C. Methyl methanoate (also 60 g/mol) boils at…",
        options:[{ t:"32 °C", ok:true }, { t:"118 °C" }, { t:"140 °C" }, { t:"97 °C" }],
        explain:"No O–H in the ester, so no hydrogen bonds between its molecules." },
      { id:"p4", prompt:"Reverse mode: ethyl ethanoate with base (NaOH). What forms?",
        options:[{ t:"sodium ethanoate and ethanol", ok:true }, { t:"ethanoic acid and ethanol" }, { t:"ethanoic acid and sodium ethoxide" }, { t:"ethane and water" }],
        explain:"In base, the acid part ends up as a salt." }
    ],
    chalIntro:"Use the station to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"Make the banana-scented ester, <strong>3-methylbutyl ethanoate</strong>.",
        why:"Ethanoic acid + 3-methylbutan-1-ol → 3-methylbutyl ethanoate + water: the alcohol gives the 3-methylbutyl part and the acid gives the ethanoate part.",
        hints:["Which part of the name is the alcohol?", "3-methylbutyl → 3-methylbutan-1-ol.", "Ethanoate → ethanoic acid."] },
      { id:"tc2", goal:[2, 3], prompt:"Make an ester that is an <strong>isomer of butanoic acid</strong> (C₄H₈O₂).",
        why:"Acid carbons + alcohol carbons = 4, so the ester is C₄H₈O₂: the same formula as butanoic acid, with a different functional group.",
        hints:["Count carbons in the acid and the alcohol.", "They must add to 4.", "e.g. ethanoic acid + ethanol."] },
      { id:"tc3", goal:[2, 3], stretch:true, prompt:"An ester has 6 carbons. Hydrolysis gives an acid and an alcohol with the <strong>same number of carbons</strong>, both unbranched. Make it.",
        why:"Propyl propanoate: hydrolysis gives propanoic acid and propan-1-ol, 3 carbons each, both unbranched.",
        hints:["6 carbons split equally.", "3 and 3.", "propanoic acid + propan-1-ol → propyl propanoate."] }
    ]
  },
  part3:{
    slug:"acids", name:"Acids", heading:"Acids in the kitchen",
    intro:"Three stations link the COOH group to acidity, boiling point and soap. Soap-making is shown only as a reaction: no procedures or amounts.",
    s1:{ title:"Station 1: A weak acid",
      intro:"Two beakers at the same concentration, 0.10 mol/L: hydrochloric acid and ethanoic acid. Switch on the conductivity tester, then zoom to the particles: 100 acid molecules in each beaker.",
      vinegar:"Vinegar is about 5% ethanoic acid (by mass)." },
    s2:{ title:"Station 2: Why acids boil high",
      intro:"Pick a compound, then pair two of its molecules up. Ethanoic acid molecules pair up through <strong>two</strong> hydrogen bonds (a dimer, violet dotted lines). All three compounds have the same molar mass, 60 g/mol." },
    s3:{ title:"Station 3: Fats and soaps",
      intro:"A fat is an ester of glycerol (propane-1,2,3-triol) with three long-chain acids. Base hydrolysis (saponification) gives glycerol and three carboxylate salts, which are soap. The salt’s ionic end mixes with water; its long tail mixes with grease." },
    quickCheck:{
      title:"Quick check", summary:"Acids quick check",
      items:[
        { id:"q1", goal:4, prompt:"0.10 mol/L ethanoic acid conducts less than 0.10 mol/L HCl because…",
          choices:[
            { t:"it ionizes only slightly", ok:true, fb:"Right. Same concentration, but only a small fraction of its molecules ionize, so there are fewer ions to carry the current." },
            { t:"it is more dilute", fb:"Same concentration; fewer ions." },
            { t:"it has no H", fb:"Same concentration; fewer ions." },
            { t:"it is a base", fb:"Same concentration; fewer ions." }] },
        { id:"q2", goal:1, prompt:"Name CH₃CH₂CH₂COOH",
          choices:[
            { t:"butanoic acid", ok:true, fb:"Right. 4 carbons, counting the COOH carbon as C1." },
            { t:"propanoic acid", fb:"Count the COOH carbon: 4 carbons." },
            { t:"butanal", fb:"Count the COOH carbon: 4 carbons." },
            { t:"butan-1-ol", fb:"Count the COOH carbon: 4 carbons." }] },
        { id:"q3", goal:[3, 5], prompt:"Saponification of a fat gives…",
          choices:[
            { t:"glycerol and soap (carboxylate salts)", ok:true, fb:"Right. Base hydrolysis splits the three ester links: glycerol plus three carboxylate salts, which are soap." },
            { t:"glycerol and fatty acids only", fb:"In base, the acids end up as salts." },
            { t:"an alkene", fb:"In base, the acids end up as salts." },
            { t:"an alcohol and an aldehyde", fb:"In base, the acids end up as salts." }] },
        { id:"q4", goal:4, prompt:"Why does ethanoic acid boil higher than propan-1-ol (same mass)?",
          choices:[
            { t:"stronger H-bonding (pairs of molecules)", ok:true, fb:"Right. Acid molecules pair up through two H-bonds." },
            { t:"it is heavier", fb:"Acid molecules pair up through two H-bonds." },
            { t:"it is nonpolar", fb:"Acid molecules pair up through two H-bonds." },
            { t:"it has no O–H", fb:"Acid molecules pair up through two H-bonds." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"parts", type:"match", title:"Ester ↔ parts", summary:"Ester ↔ parts", goal:[2, 3],
        instruction:"Match each ester to the acid and alcohol it comes from.",
        leftTitle:"Ester", rightTitle:"Acid + alcohol",
        left:PAIRS.map((p, i) => ({ id:"l" + (i + 1), t:p[0],
          why:p[4] + " → " + p[2] + "; " + p[3] + " → " + p[1] + ".",
          hints:["The -yl word is the alcohol part.", p[4] + " → " + p[2] + ".", p[3] + " → " + p[1] + "."] })),
        right:PAIRS.map((p, i) => ({ id:"r" + (i + 1), t:p[1] + " + " + p[2] })),
        answer:MATCH_ANS,
        wrong:{ "l1|r2":"Methyl ethanoate: methyl from methanol, ethanoate from ethanoic acid.", "l2|r1":M1, "l3|r4":M1, "l4|r3":M1 },
        wrongDefault:"Alcohol part first (-yl), acid part second (-oate)." },
      { id:"reverse", type:"custom", title:"Predict and reverse", summary:"Predict and reverse", star:true, goal:[1, 2, 3, 4],
        instruction:"Six items. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Tap your answer, then press Check.",
        items:[
          { id:"r1", goal:[2, 3], prompt:"Products of propanoic acid + methanol (acid catalyst)",
            options:[
              { t:"methyl propanoate + water", ok:true, why:M1 + " " + M3 },
              { t:"propyl methanoate + water", why:M1 },
              { t:"methyl propanoate only", why:M3 },
              { t:"methyl propanoate + H₂", why:"The O must go somewhere too." }] },
          { id:"r2", goal:[2, 3], prompt:"Products of butyl ethanoate + water (acid catalyst)",
            options:[
              { t:"ethanoic acid + butan-1-ol", ok:true, why:"Hydrolysis splits the ester: ethanoate → ethanoic acid, butyl → butan-1-ol." },
              { t:"butanoic acid + ethanol", why:M2 },
              { t:"sodium ethanoate + butan-1-ol", why:"That’s base hydrolysis (saponification). With an acid catalyst you get the acid itself." },
              { t:"butyl ethanoate + water (no reaction)", why:"Hydrolysis splits the ester." }] },
          { id:"r3", star:true, goal:2, prompt:"How many esters have formula C₄H₈O₂?",
            options:[
              { t:"4", ok:true, why:"Ethyl ethanoate, methyl propanoate, propyl methanoate and 1-methylethyl methanoate: acid carbons + alcohol carbons = 4." },
              { t:"3", why:"Don’t forget 1-methylethyl methanoate (from propan-2-ol)." },
              { t:"2", why:"Split 4 carbons every way: 1 + 3, 2 + 2, 3 + 1, and the 3-carbon alcohol can be branched." },
              { t:"5", why:"Only 4: acid carbons + alcohol carbons = 4, with one branched 3-carbon alcohol." }] },
          { id:"r4", star:true, goal:4, prompt:"Order by boiling point, lowest first: ethyl methanoate, butan-1-ol, propanoic acid (all 74 g/mol)",
            options:[
              { t:"ethyl methanoate < butan-1-ol < propanoic acid", ok:true, why:"54 °C, 118 °C, 141 °C. " + M5 },
              { t:"butan-1-ol < ethyl methanoate < propanoic acid", why:M5 },
              { t:"propanoic acid < butan-1-ol < ethyl methanoate", why:M5 },
              { t:"ethyl methanoate < propanoic acid < butan-1-ol", why:"Acid molecules pair up through two H-bonds: the acid boils highest." }] },
          { id:"r5", star:true, goal:4, prompt:"<strong>Investigation:</strong> To show that ethanoic acid is weak, a student compares it with hydrochloric acid using a conductivity m&#101;ter. Which variable must be the same?",
            options:[
              { t:"concentration", ok:true, why:R5 },
              { t:"volume of the beaker", why:R5 },
              { t:"colour", why:R5 },
              { t:"temperature only", why:R5 }] },
          { id:"r6", star:true, goal:[2, 3], prompt:"An ester C₅H₁₀O₂ is hydrolyzed. The alcohol produced oxidizes to a <strong>ketone</strong>. Name the ester.",
            options:[
              { t:"1-methylethyl ethanoate", ok:true, why:"Ethanoic acid + propan-2-ol → 1-methylethyl ethanoate. Propan-2-ol is secondary, so it oxidizes to a ketone (propanone)." },
              { t:"propyl ethanoate", why:"Propan-1-ol oxidizes to an aldehyde." },
              { t:"ethyl propanoate", why:"Ethanol gives an aldehyde." },
              { t:"methyl butanoate", why:"Methanol gives an aldehyde." }],
            hints:["A ketone comes from a secondary alcohol.", "The smallest secondary alcohol is propan-2-ol (3 carbons), leaving 2 carbons for the acid.", "Ethanoic acid + propan-2-ol → 1-methylethyl ethanoate."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Bilal", how:"",
        instruction:"Bilal made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Name the ester made from propanoic acid and methanol.",
            steps:["Propanoic acid has 3 carbons; methanol has 1.", "Esterification joins them and releases water.", "The acid part is named first as an alkyl group: propyl.", "The alcohol part ends in -oate: methanoate.", "Name: propyl methanoate."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Follows from step 3.", "Follows from step 3."],
            fixes:[
              { t:"The alcohol part is named first (methyl) and the acid part ends in -oate (propanoate): methyl propanoate.", ok:true, why:M1 },
              { t:"propyl methanoate is correct.", why:M1 },
              { t:"Name it methyl propanol.", why:"-ol is an alcohol." },
              { t:"Name it propanoic methyl.", why:"Esters end in -oate." }],
            hints:["Which part becomes the -yl word?", "The alcohol.", "methyl propanoate."] },
          { id:"e2", goal:3, task:"Write the equation for making ethyl ethanoate.",
            steps:["Reactants: ethanoic acid and ethanol.", "CH₃COOH + CH₃CH₂OH", "→ CH₃COOCH₂CH₃", "Check: the equation is balanced."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "It isn’t: 2 H and 1 O are missing on the right."],
            fixes:[
              { t:"→ CH₃COOCH₂CH₃ + H₂O: condensation releases water.", ok:true, why:M3 },
              { t:"→ CH₃COOCH₂CH₃ + H₂.", why:"The O must go somewhere too." },
              { t:"→ CH₃CH₂COOCH₃ + H₂O.", why:"That’s methyl propanoate." },
              { t:"Step 3 is correct.", why:M3 }],
            hints:["Count H and O on both sides.", "2 H and 1 O are missing.", "Add H₂O."] },
          { id:"e3", goal:3, task:"Predict the products when methyl ethanoate is heated with NaOH(aq).",
            steps:["This is base hydrolysis (saponification).", "The ester splits into its acid and alcohol parts.", "Products: ethanoic acid and methanol.", "The solution ends up acidic."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Follows from step 3."],
            fixes:[
              { t:"In base, the acid part is neutralized: sodium ethanoate and methanol.", ok:true, why:M7 },
              { t:"Products: methanoic acid and ethanol.", why:M2 },
              { t:"No reaction: esters don’t react with bases.", why:"Base hydrolysis is fast." },
              { t:"Step 3 is correct.", why:M7 }],
            hints:["What happens to an acid in NaOH?", "It’s neutralized.", "sodium ethanoate + methanol."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you: the isotope result, or how low esters boil compared with acids?" },
      { id:"j2", q:"In your own words, explain why esters are named ‘alkyl alkanoate’." },
      { id:"j3", q:"Explain to a friend how to work out an ester’s name from the acid and alcohol." },
      { id:"j4", q:"Which reaction (esterification or hydrolysis) is still harder for you? What will you practise?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Name CH₃CH₂COOH.", options:[
          { t:"propanoic acid", ok:true, why:"3 carbons including the COOH carbon." },
          { t:"ethanoic acid", why:M6 },
          { t:"propanal", why:"That’s the aldehyde." },
          { t:"propanoate", why:"-oate names a salt or ester." }] },
        b:{ prompt:"Name HCOOH.", options:[
          { t:"methanoic acid", ok:true, why:"1 carbon: the COOH carbon itself. Methanoic (formic) acid." },
          { t:"ethanoic acid", why:"Only 1 carbon." },
          { t:"methanal", why:"That’s HCHO." },
          { t:"methanol", why:"That’s CH₃OH." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Name CH₃COOCH₂CH₂CH₃.", options:[
          { t:"propyl ethanoate", ok:true, why:"Alcohol part propyl; acid part ethanoate." },
          { t:"ethyl propanoate", why:M1 },
          { t:"propyl propanoate", why:"The acid part has 2 carbons." },
          { t:"propyl methanoate", why:"The acid part includes the C=O carbon and CH₃: 2 carbons." }] },
        b:{ prompt:"Name HCOOCH₂CH₃.", options:[
          { t:"ethyl methanoate", ok:true, why:"Alcohol part ethyl; acid part methanoate (1 carbon)." },
          { t:"methyl ethanoate", why:M1 },
          { t:"ethyl ethanoate", why:"The acid part has 1 carbon." },
          { t:"methyl propanoate", why:"Count each part separately." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"What are the products of ethanoic acid + methanol (acid catalyst)?", options:[
          { t:"methyl ethanoate and water", ok:true, why:"Alcohol part (methyl) + acid part (ethanoate), and the condensation releases water." },
          { t:"ethyl methanoate and water", why:M1 },
          { t:"methyl ethanoate only", why:M3 },
          { t:"ethanoate ions and methanol", why:"That’s not esterification." }] },
        b:{ prompt:"What are the products of hydrolyzing methyl propanoate (acid catalyst)?", options:[
          { t:"propanoic acid and methanol", ok:true, why:"Hydrolysis splits the ester: propanoate → propanoic acid, methyl → methanol." },
          { t:"methanoic acid and propan-1-ol", why:M2 },
          { t:"propanoic acid and methane", why:"The alcohol part becomes an alcohol." },
          { t:"methyl propanoate and water", why:"Hydrolysis splits the ester." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Order by boiling point, lowest first (all 60 g/mol): methyl methanoate, propan-1-ol, ethanoic acid.", options:[
          { t:"methyl methanoate < propan-1-ol < ethanoic acid", ok:true, why:"32, 97, 118 °C." },
          { t:"ethanoic acid < propan-1-ol < methyl methanoate", why:M5 },
          { t:"propan-1-ol < methyl methanoate < ethanoic acid", why:M5 },
          { t:"All equal", why:"Same mass, different forces." }] },
        b:{ prompt:"Order by boiling point, lowest first (all 74 g/mol): ethyl methanoate, butan-1-ol, propanoic acid.", options:[
          { t:"ethyl methanoate < butan-1-ol < propanoic acid", ok:true, why:"54, 118, 141 °C." },
          { t:"propanoic acid < butan-1-ol < ethyl methanoate", why:M5 },
          { t:"butan-1-ol < ethyl methanoate < propanoic acid", why:M5 },
          { t:"All equal", why:"Same mass, different forces." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"An ester hydrolyzes to butanoic acid and ethanol. What is it?", options:[
          { t:"ethyl butanoate, C₆H₁₂O₂", ok:true, why:"Ethanol gives the ethyl part and butanoic acid the butanoate part: 2 + 4 carbons, C₆H₁₂O₂." },
          { t:"butyl ethanoate, C₆H₁₂O₂", why:"Same formula, but the parts are swapped." },
          { t:"ethyl butanoate, C₆H₁₄O₂", why:"Count H: the ester has 12." },
          { t:"ethyl butanoate, C₆H₁₂O₃", why:"Esters have 2 O." }] },
        b:{ prompt:"An ester hydrolyzes to benzoic acid and methanol. What is it?", options:[
          { t:"methyl benzoate", ok:true, why:"Methanol gives the methyl part; benzoic acid gives the benzoate part." },
          { t:"benzyl methanoate", why:"Benzoic acid gives the -oate part." },
          { t:"phenyl methanoate", why:M2 },
          { t:"methyl benzoic acid", why:"Esters end in -oate." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"0.10 mol/L ethanoic acid lights a conductivity bulb dimly; 0.10 mol/L HCl lights it brightly. Best conclusion?", options:[
          { t:"Ethanoic acid ionizes only slightly, so it’s a weak acid", ok:true, why:"Same concentration, fewer ions. " + M4 },
          { t:"Ethanoic acid is more dilute", why:"Same concentration." },
          { t:"Ethanoic acid is a base", why:"It donates H⁺." },
          { t:"Ethanoic acid is a strong acid", why:M4 }] },
        b:{ prompt:"Vinegar reacts more slowly with a piece of limestone than hydrochloric acid of the same concentration. Best explanation?", options:[
          { t:"Ethanoic acid is weak, so there are far fewer H₃O⁺ ions to react at any moment", ok:true, why:"Same concentration, but only a small fraction of the ethanoic acid is ionized at any moment." },
          { t:"Vinegar contains no acid", why:"It’s about 5% ethanoic acid." },
          { t:"Limestone dissolves only in strong acids", why:"It dissolves in both, at different rates." },
          { t:"Ethanoic acid is a strong acid", why:M4 }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which best explains why the ester of ethanoic acid and propan-1-ol is called propyl ethanoate?", options:[
          { t:"“The alcohol part is named first as an alkyl group (propyl); the acid part keeps its chain and ends in -oate (ethanoate).”", ok:true, why:"The name follows the roles of the parts: alcohol part first, acid part second." },
          { t:"“The longer part always goes first.”", why:"Order follows the alcohol/acid roles, not length." },
          { t:"“The acid part is named first as an alkyl group.”", why:M1 },
          { t:"“Esters are named alphabetically.”", why:"No: alcohol part, then acid part." }] },
        b:{ prompt:"Which is the clearest description of esterification?", options:[
          { t:"“A condensation: the acid’s OH and the alcohol’s H leave as water, joining the two parts through an O.”", ok:true, why:"It names the reaction type, what leaves and how the two parts join." },
          { t:"“An addition across a C=C.”", why:"No multiple bond is involved." },
          { t:"“A substitution where the alcohol replaces a C–H.”", why:"The OH of the acid is lost." },
          { t:"“A combustion that forms CO₂.”", why:"No O₂ involved." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which equation correctly represents saponification of ethyl ethanoate?", options:[
          { t:"CH₃COOCH₂CH₃ + NaOH → CH₃COONa + CH₃CH₂OH", ok:true, why:"In base, the acid part ends up as its salt (sodium ethanoate) and the alcohol part as ethanol." },
          { t:"CH₃COOCH₂CH₃ + NaOH → CH₃COOH + CH₃CH₂ONa", why:M7 },
          { t:"CH₃COOCH₂CH₃ + NaOH → CH₃COONa + CH₃OH + CH₄", why:"Atoms aren’t conserved." },
          { t:"CH₃COOCH₂CH₃ + H₂O → CH₃COOCH₃ + CH₃OH", why:"That isn’t hydrolysis." }] },
        b:{ prompt:"Which statement about soap-making is correct?", options:[
          { t:"“A fat (an ester of glycerol) reacts with a strong base to give glycerol and carboxylate salts, which are soap.”", ok:true, why:"That’s saponification: base hydrolysis of the fat’s three ester links." },
          { t:"“A fat reacts with an acid to give soap.”", why:"Saponification uses a base." },
          { t:"“Soap is a free carboxylic acid.”", why:M7 },
          { t:"“Soap is an ester.”", why:"It’s a carboxylate salt." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A flavour chemist wants pentyl ethanoate (pear/banana). Which acid and alcohol?", options:[
          { t:"ethanoic acid + pentan-1-ol", ok:true, why:"Pentyl comes from pentan-1-ol; ethanoate comes from ethanoic acid." },
          { t:"pentanoic acid + ethanol", why:M1 },
          { t:"ethanol + pentanal", why:"An aldehyde doesn’t form esters." },
          { t:"ethanoic acid + pentane", why:"Pentane has no OH." }] },
        b:{ prompt:"Methyl butanoate gives an apple flavour. Which acid and alcohol?", options:[
          { t:"butanoic acid + methanol", ok:true, why:"Methyl comes from methanol; butanoate comes from butanoic acid." },
          { t:"methanoic acid + butan-1-ol", why:M1 },
          { t:"butanal + methanol", why:"An aldehyde doesn’t form esters." },
          { t:"methanoic acid + butane", why:"Butane has no OH." }] } },
      { id:"a2", cat:"A", goal:[4, 5],
        a:{ prompt:"ASA (acetylsalicylic acid), the active ingredient in some pain relievers, contains an ester group. Old, damp tablets smell of vinegar. Why?", options:[
          { t:"Moisture hydrolyzes the ester, releasing ethanoic acid", ok:true, why:"Water splits the ester link (hydrolysis). One product is ethanoic acid, the acid in vinegar." },
          { t:"The tablet ferments into ethanol", why:"No fermentation happens." },
          { t:"The ester oxidizes to a ketone", why:"Esters don’t oxidize to ketones." },
          { t:"Vinegar was added as a preservative", why:"The smell comes from the breakdown." }] },
        b:{ prompt:"Polyester fabric is held together by ester links. Repeated washing in very hot, strongly basic detergent weakens it. Why?", options:[
          { t:"Base hydrolyzes the ester links, breaking the polymer chains", ok:true, why:"Base hydrolysis splits ester links, as in saponification, so the long chains fall apart." },
          { t:"Heat turns the esters into alkanes", why:"Heat speeds hydrolysis; it doesn’t make alkanes." },
          { t:"The base adds across C=C bonds", why:"Ester links aren’t C=C." },
          { t:"Polyesters dissolve in water", why:"They’re broken by hydrolysis, not dissolved." }] } }
    ]
  },
  task:{
    title:"Balanced flavour", summary:"Balanced flavour",
    statement:"<p>Choose an acid and an alcohol to make an ester that meets every condition, then name it. Can you find every answer?</p><ol class=\"ce-conds\"><li>The ester has 6 carbons in total.</li><li>The acid part has at least as many carbons as the alcohol part.</li><li>You named the ester correctly.</li></ol>",
    checks:["6 carbons", "Acid part ≥ alcohol part", "Named correctly"],
    tips:["Add the carbons from both chips.", "Count the acid’s carbons, including the C=O carbon, and compare.", "Alcohol part first, ending -yl; acid part second, ending -oate."],
    explainPrompt:"Explain how you used the name to decide which acid and which alcohol to choose.",
    vocab:"Use the words ester, condensation, alkyl and -oate.",
    more:"There’s more than one answer. Can you find every one?",
    after3:"Butyl ethanoate and pentyl methanoate also have 6 carbons, but their alcohol parts are bigger. All five 6-carbon esters are isomers: C₆H₁₂O₂."
  },
  cards:[
    ["Carboxylic acid", "–COOH at the chain end; suffix -oic acid (propanoic acid)."],
    ["Counting carbons", "The COOH carbon is C1: CH₃COOH is ethanoic acid."],
    ["Common names", "Methanoic = formic acid; ethanoic = acetic acid (vinegar)."],
    ["Ester", "R–COO–R′; named alkyl alkanoate (ethyl ethanoate)."],
    ["Esterification", "Acid + alcohol ⇌ ester + water (acid catalyst); a condensation."],
    ["Which part is which", "The C=O side came from the acid; the O–alkyl side from the alcohol."],
    ["Hydrolysis", "Ester + water → acid + alcohol (acid catalyst)."],
    ["Saponification", "Ester + strong base → carboxylate salt + alcohol; makes soap from fats."],
    ["Weak acid", "Carboxylic acids ionize only slightly in water."],
    ["Acid boiling points", "High: strong H-bonding, molecules pair up."],
    ["Ester boiling points", "Low for their mass: no O–H."],
    ["Ester scents", "Ethyl butanoate (pineapple), 3-methylbutyl ethanoate (banana)."]
  ]
};
