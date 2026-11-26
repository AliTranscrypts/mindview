// SCH4U 03 Alcohols and Ethers. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/03-alcohols-and-ethers.md
// Molecules, the switchboard, the particle box, the ladders and the builder are drawn by app.js. Boiling points and
// solubilities in the readouts come from app.js data (the plan's module table, course table additions).

// Misconception core sentences (plan §3), reused where the plan points to them.
const M1 = "An H-bond needs an H on O, N or F. Ethers have no O–H, so they can’t H-bond to each other.";
const M2 = "Count the carbons bonded to the carbon that holds the OH: 1 = primary, 2 = secondary, 3 = tertiary.";
const M3 = "A tertiary C–OH carbon has no H to lose, so mild oxidation doesn’t touch it.";
const M4 = "The O–H in an alcohol is covalent. Alcohols don’t release OH⁻ ions like NaOH does.";
const M5 = "One OH can’t carry a long nonpolar chain into water: solubility falls as the chain grows.";
const M6 = "Number from the end nearer the OH.";
const M7 = "Primary → aldehyde (then acid); secondary → ketone.";
const ETH = "No O–H: it’s an ether.";
const ALC = "It has an O–H, so it’s an alcohol, not an ether.";
const H1 = "Find the carbon holding the OH.", H2 = "Count its carbon neighbours.";

export default {
  id:"03-alcohols-and-ethers",
  kind:"topic",
  title:"Alcohols and ethers",
  topic:"Alcohols and Ethers",
  readyTopic:"alcohols and ethers",
  hero:{
    eq:'<span class="nw">CH₃CH₂OH and CH₃OCH₃:</span> <span class="nw">same formula, C₂H₆O</span>', eqSize:"sm",
    eqLabel:"C H 3 C H 2 O H and C H 3 O C H 3: same formula, C 2 H 6 O",
    headline:"Same atoms, a different place for the oxygen",
    text:"Put an –OH on a carbon chain and you have an <strong>alcohol</strong>; put the O between two carbons and you have an <strong>ether</strong>. Ethanol boils at 78 °C, methoxymethane at −24 °C. The difference is the <strong>hydrogen bond</strong>, which only the alcohol can form with its neighbours.",
    fig:{ html:'<div class="ao-hx"><svg class="ao-hx-svg" id="ao-hx-svg" viewBox="0 0 640 462" role="img" aria-label="Two flasks: ethanol on the left, methoxymethane on the right, each holding a swarm of molecules. Violet dotted hydrogen bonds flicker between ethanol molecules, from O–H to O; none appear between the ether molecules. A thermometer rises: the ether escapes as a gas at −24 °C, while ethanol stays liquid until 78 °C."></svg><div class="ao-hx-row"><p class="ao-hx-cap" id="ao-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="ao-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can name and draw alcohols and ethers.",
    "I can classify an alcohol as primary, secondary or tertiary.",
    "I can explain boiling points and solubility of alcohols, ethers and alkanes using hydrogen bonding and polarity.",
    "I can predict the products of oxidizing primary, secondary and tertiary alcohols.",
    "I can predict the alkene(s) formed when an alcohol is dehydrated.",
    "I can recognize alcohols and ethers as functional-group isomers with different properties."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Hydrogen bonding", goal:3,
          prompt:"Which molecule can hydrogen-bond to another molecule of itself?",
          options:[
            { t:"CH₃OH", ok:true, why:"H on O." },
            { t:"CH₃OCH₃", why:"No H on the O." },
            { t:"CH₄", why:"No O, N or F." },
            { t:"CH₃Cl", why:"H on C doesn’t H-bond." }],
          hints:["H-bonds need H on N, O or F.", "Which has an O–H?", "CH₃OH."] },
        { id:"w2", skill:"Hydrogen bonding", goal:3,
          prompt:"Water (18 g/mol) boils at 100 °C; methane (16 g/mol) at −162 °C. Main reason?",
          options:[
            { t:"Water molecules hydrogen-bond to each other", ok:true, why:"The masses are similar, so the forces between the molecules make the difference: water’s O–H forms hydrogen bonds." },
            { t:"Water is heavier", why:"Only 2 g/mol heavier: not enough to explain 262 °C." },
            { t:"Methane has stronger covalent bonds", why:"Boiling doesn’t break covalent bonds." },
            { t:"Methane is polar", why:"It’s nonpolar." }],
          hints:["Similar masses, huge difference.", "Which forces differ?", "Hydrogen bonding."] },
        { id:"w3", skill:"Naming chains", goal:1,
          prompt:"How many carbons does the root ‘prop-’ mean?",
          options:[
            { t:"3", ok:true, why:"meth 1, eth 2, prop 3." },
            { t:"4", why:"4 is but-." },
            { t:"2", why:"2 is eth-." },
            { t:"5", why:"5 is pent-." }],
          hints:["meth 1, eth 2, …", "prop comes next.", "3."] },
        { id:"w4", skill:"Naming chains", goal:1,
          prompt:"Name CH₃CH₂CH₂CH₃ with an OH replacing an H on C1.",
          options:[
            { t:"butan-1-ol", ok:true, why:"Butane with -ol, OH on C1." },
            { t:"butan-4-ol", why:"Number from the OH end." },
            { t:"butane", why:"The OH changes the suffix." },
            { t:"butanal", why:"-al is an aldehyde." }],
          hints:["Parent chain?", "Butane; replace -e with -ol.", "butan-1-ol."] },
        { id:"w5", skill:"Addition to alkenes", goal:5,
          prompt:"Propene + H₂O (acid catalyst) gives mainly…",
          options:[
            { t:"propan-2-ol", ok:true, why:"Markovnikov: OH on C2." },
            { t:"propan-1-ol", why:"That’s anti-Markovnikov." },
            { t:"propane", why:"That’s H₂ addition." },
            { t:"propanal", why:"Addition of water gives an alcohol." }],
          hints:["Which carbon gets the H?", "C1 (more H).", "OH on C2: propan-2-ol."] },
        { id:"w6", skill:"Polarity and solubility", goal:3,
          prompt:"‘Like dissolves like’ means…",
          options:[
            { t:"Polar substances dissolve in polar solvents; nonpolar in nonpolar", ok:true, why:"Substances with similar intermolecular forces mix." },
            { t:"Substances only dissolve in themselves", why:"Different substances can mix." },
            { t:"Heavier substances dissolve heavier ones", why:"Mass isn’t the rule." },
            { t:"Everything dissolves in water", why:"Oils don’t." }],
          hints:["Think oil and water.", "Similar forces mix.", "Polar with polar."] }
      ],
      refreshers:{
        "Hydrogen bonding":"An H on O, N or F attracted to a lone pair on another O, N or F. Much stronger than London forces between small molecules.",
        "Naming chains":"Root gives length; the suffix tells the family; the locant tells the position.",
        "Addition to alkenes":"Water adds across C=C with an acid catalyst; Markovnikov places the OH on the more substituted carbon.",
        "Polarity and solubility":"Similar intermolecular forces mix: water dissolves polar, H-bonding molecules."
      }
    }
  },
  explore:{
    heading:"Functional group switchboard",
    intro:"Place one oxygen on a carbon chain: as an –OH (alcohol) or between two carbons (ether). Watch boiling point, solubility and class change.",
    how:"Set the number of carbons. Tap a carbon (or Tab to it) to put the –OH there or to add the methyl branch; tap a C–C bond to put the O between its two carbons; tap the O to remove it. Choose a mode to compare properties, see the class or look at the molecules in a box.",
    modes:[{ id:"prop", t:"Properties" }, { id:"cls", t:"Classify" }, { id:"part", t:"Particle view" }],
    predictions:[
      { id:"p1", prompt:"Ethanol boils at 78 °C. Move the O between the two carbons to make methoxymethane. Its boiling point will be…",
        options:[{ t:"far lower (about −24 °C)", ok:true }, { t:"about the same" }, { t:"higher" }, { t:"it won’t change state" }],
        explain:"The H-bond lines vanish and the bar drops to −24 °C. No O–H, so no H-bonds between molecules." },
      { id:"p2", prompt:"Ethanol mixes with water in the water box. Swap to butan-1-ol. What happens to mixing with water?",
        options:[{ t:"it only partly dissolves", ok:true }, { t:"it mixes even better" }, { t:"it doesn’t dissolve at all" }, { t:"it reacts with water" }],
        explain:"About 8 g dissolves in 100 mL of water; the rest forms a separate layer on top. The longer nonpolar chain can’t H-bond with water." },
      { id:"p3", prompt:"Propan-2-ol meets [O] (a preview of the Oxidation part). Oxidizing propan-2-ol gives…",
        options:[{ t:"propanone (a ketone)", ok:true }, { t:"propanal" }, { t:"propanoic acid" }, { t:"no reaction" }],
        explain:"The C–OH carbon loses its H and the O–H loses its H; a C=O forms in the middle of the chain. Secondary alcohols oxidize to ketones." },
      { id:"p4", prompt:"2-methylpropan-2-ol meets [O]. What happens?",
        options:[{ t:"no reaction", ok:true }, { t:"a ketone forms" }, { t:"an aldehyde forms" }, { t:"a carboxylic acid forms" }],
        explain:"The C–OH carbon has no H. Tertiary: no H on the C–OH carbon to remove." }
    ],
    chalIntro:"Use the switchboard to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"Build a <strong>secondary</strong> alcohol with 4 carbons.",
        why:"Butan-2-ol, CH₃CH(OH)CH₂CH₃: the C–OH carbon (C2) is bonded to exactly two carbons.",
        hints:["The C–OH carbon needs exactly two carbon neighbours.", "Put the OH on an inner carbon of a straight chain.", "CH₃CH(OH)CH₂CH₃."] },
      { id:"tc2", goal:[3, 6], prompt:"Properties mode. Build the C₄H₁₀O isomer with the <strong>lowest</strong> boiling point.",
        why:"2-methoxypropane, CH₃OCH(CH₃)₂, boils at 32 °C: an ether (no H-bonds), and branched, so it’s compact.",
        hints:["No H-bonds means an ether.", "Branching lowers boiling point further.", "CH₃OCH(CH₃)₂."] },
      { id:"tc3", goal:[2, 4], stretch:true, prompt:"Build the 5-carbon alcohol that oxidizes to a <strong>ketone with a branched chain</strong>.",
        why:"3-methylbutan-2-ol, CH₃CH(OH)CH(CH₃)CH₃: secondary, so [O] gives a ketone (3-methylbutan-2-one), and the chain is branched.",
        hints:["A ketone needs a secondary alcohol.", "You need a branch and a secondary C–OH in 5 carbons.", "CH₃CH(OH)CH(CH₃)CH₃."] }
    ],
    blocks:[{ title:"What the switchboard shows", html:"<p>The O–H is what makes alcohols stick to each other and to water. The class of an alcohol is a carbon count, and it decides what oxidation does.</p>" }]
  },
  part3:{
    slug:"oxidation", name:"Oxidation", heading:"Oxidizing alcohols",
    intro:"Three stations: the oxidation ladder, dehydration, and alcohols in everyday life. Oxidizing agents are shown only as [O]: no reagents, amounts or procedures.",
    s1:{ title:"Station 1: The oxidation ladder",
      intro:"Pick an alcohol, then press [O] once or twice. Primary alcohols climb two rungs, secondary alcohols one, tertiary alcohols none.",
      alcohols:["methanol", "ethanol", "propan-1-ol", "propan-2-ol", "butan-1-ol", "butan-2-ol", "2-methylpropan-1-ol", "2-methylpropan-2-ol", "pentan-3-ol", "2-methylbutan-2-ol"],
      zoom:"Count the H atoms on the C–OH carbon (ringed). The first [O] removes the O–H hydrogen and one C–H hydrogen; they leave as H₂O. The second [O] turns the aldehyde’s last C–H into C–OH. No H on that carbon, no oxidation." },
    s2:{ title:"Station 2: Dehydration",
      intro:"Pick an alcohol, then apply an acid catalyst and heat. Water leaves: the OH from one carbon and an H from a neighbouring carbon. A C=C forms between them. This is an elimination.",
      alcohols:["ethanol", "propan-1-ol", "propan-2-ol", "butan-1-ol", "butan-2-ol", "2-methylpropan-2-ol", "pentan-2-ol", "pentan-3-ol", "2-methylbutan-2-ol"],
      reverse:"<strong>Hydration runs the other way.</strong> In <a href=\"02-alkenes-alkynes-aromatics.html#explore\">module 02</a>, water adds across a C=C (acid catalyst) to make an alcohol. Dehydration takes the water back out." },
    s3:{ title:"Station 3: Alcohols and you",
      intro:"Oxidation of alcohols happens outside the lab too. Pick a case.",
      cases:[
        { id:"breath", t:"Breath testers", alc:"ethanol", steps:1,
          html:"A breath tester detects ethanol by <strong>oxidizing</strong> it. Ethanol is a primary alcohol, so the first product is the aldehyde ethanal. The device measures how much oxidation happens." },
        { id:"wine", t:"Wine left open", alc:"ethanol", steps:2,
          html:"Wine left open slowly turns to vinegar: air <strong>oxidizes</strong> the ethanol, through ethanal, to ethanoic acid (acetic acid), the sour acid in vinegar." },
        { id:"meoh", t:"Methanol is toxic", alc:"methanol", steps:2,
          html:"Methanol is toxic because the body <strong>oxidizes</strong> it to methanal and then methanoic acid, which damage the body. In Canada, many windshield washer fluids contain methanol, which is why they’re labelled poisonous." }] },
    quickCheck:{
      title:"Quick check", summary:"Oxidation quick check",
      items:[
        { id:"q1", goal:4, prompt:"Butan-1-ol + [O], twice",
          choices:[
            { t:"butanoic acid", ok:true, fb:"Right. Primary → aldehyde → acid." },
            { t:"butanone", fb:"Primary → aldehyde → acid." },
            { t:"butanal", fb:"Primary → aldehyde → acid." },
            { t:"no reaction", fb:"Primary → aldehyde → acid." }] },
        { id:"q2", goal:[2, 4], prompt:"Which alcohol resists mild oxidation?",
          choices:[
            { t:"2-methylbutan-2-ol", ok:true, fb:"Right. Tertiary: no H on the C–OH carbon." },
            { t:"pentan-2-ol", fb:"Tertiary." },
            { t:"pentan-1-ol", fb:"Tertiary." },
            { t:"3-methylbutan-2-ol", fb:"Tertiary." }] },
        { id:"q3", goal:5, prompt:"Dehydration of propan-1-ol gives…",
          choices:[
            { t:"propene", ok:true, fb:"Right. Elimination of water makes a C=C." },
            { t:"propane", fb:"Elimination of water makes a C=C." },
            { t:"propanal", fb:"Elimination of water makes a C=C." },
            { t:"propan-2-ol", fb:"Elimination of water makes a C=C." }] },
        { id:"q4", goal:3, prompt:"Is ethanol a base like NaOH?",
          choices:[
            { t:"No: its O–H is covalent", ok:true, fb:"Right. " + M4 },
            { t:"Yes: it has OH", fb:"Alcohols don’t release OH⁻." },
            { t:"Only when hot", fb:"Alcohols don’t release OH⁻." },
            { t:"Only in water", fb:"Alcohols don’t release OH⁻." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"classify", type:"sorter", title:"Classify it", summary:"Classify it", goal:[2, 6], noun:"compound", txt:true,
        instruction:"Ten compounds. Sort each one: primary, secondary or tertiary alcohol, or ether.",
        boxes:[{ id:"p", label:"Primary alcohol" }, { id:"s", label:"Secondary alcohol" }, { id:"t", label:"Tertiary alcohol" }, { id:"e", label:"Ether" }],
        wrongDefault:M2,
        items:[
          { id:"i1", goal:2, t:'ethanol <span class="ao-tf">CH₃CH₂OH</span>', answer:"p", why:"C1 holds the OH and is bonded to one carbon: primary.",
            wrong:{ e:ALC }, hints:[H1, H2, "C1 holds the OH; it’s bonded to one carbon (C2): primary."] },
          { id:"i2", goal:2, t:'propan-2-ol <span class="ao-tf">CH₃CH(OH)CH₃</span>', answer:"s", why:"C2 holds the OH and is bonded to C1 and C3: secondary.",
            wrong:{ p:"The OH is on C2, which has two carbon neighbours.", e:ALC }, hints:[H1, H2, "C2 holds the OH; it’s bonded to C1 and C3: secondary."] },
          { id:"i3", goal:2, t:'2-methylpropan-2-ol <span class="ao-tf">(CH₃)₃COH</span>', answer:"t", why:"C2 holds the OH and is bonded to three carbons: tertiary.",
            wrong:{ e:ALC }, hints:[H1, H2, "C2 holds the OH; it’s bonded to C1, C3 and the methyl carbon: tertiary."] },
          { id:"i4", goal:6, t:'methoxyethane <span class="ao-tf">CH₃OCH₂CH₃</span>', answer:"e", why:"The O sits between two carbons and has no H: an ether, so it has no class.",
            wrong:{ p:ETH, s:ETH, t:ETH }, hints:[H1, H2, "There’s no OH: the O sits between two carbons, so it’s an ether."] },
          { id:"i5", goal:2, t:'2-methylpropan-1-ol <span class="ao-tf">(CH₃)₂CHCH₂OH</span>', answer:"p", why:"C1 holds the OH and is bonded only to C2: primary, even though the chain is branched.",
            wrong:{ s:"The branch is on C2, but the OH’s carbon (C1) has only one carbon neighbour.", e:ALC }, hints:[H1, H2, "C1 holds the OH; it’s bonded only to C2: primary. The branch doesn’t decide the class."] },
          { id:"i6", goal:2, t:'cyclohexanol <span class="ao-tf">C₆H₁₁OH (a ring)</span>', answer:"s", why:"The ring carbon holding the OH is bonded to two ring carbons: secondary.",
            wrong:{ p:"The ring carbon with the OH is bonded to two ring carbons.", e:ALC }, hints:[H1, H2, "The ring carbon with the OH is bonded to two ring carbons: secondary."] },
          { id:"i7", goal:2, t:'2-methylbutan-2-ol <span class="ao-tf">CH₃CH₂C(OH)(CH₃)CH₃</span>', answer:"t", why:"C2 holds the OH and is bonded to C1, C3 and the methyl carbon: tertiary.",
            wrong:{ e:ALC }, hints:[H1, H2, "C2 holds the OH; it’s bonded to C1, C3 and the methyl carbon: tertiary."] },
          { id:"i8", goal:6, t:'ethoxyethane <span class="ao-tf">CH₃CH₂OCH₂CH₃</span>', answer:"e", why:"The O sits between two carbons and has no H: an ether.",
            wrong:{ p:ETH, s:ETH, t:ETH }, hints:[H1, H2, "There’s no OH: the O sits between two ethyl groups, so it’s an ether."] },
          { id:"i9", goal:2, t:'pentan-3-ol <span class="ao-tf">CH₃CH₂CH(OH)CH₂CH₃</span>', answer:"s", why:"C3 holds the OH and is bonded to C2 and C4: secondary.",
            wrong:{ e:ALC }, hints:[H1, H2, "C3 holds the OH; it’s bonded to C2 and C4: secondary."] },
          { id:"i10", goal:2, t:'methanol <span class="ao-tf">CH₃OH</span>', answer:"p", why:"Treated as primary: the C–OH carbon has no carbon neighbours but three H, and it oxidizes like a primary alcohol.",
            wrong:{ e:ALC }, hints:[H1, H2, "No carbon neighbours, but three H on the C–OH carbon: methanol is treated as primary."] }
        ] },
      { id:"predict", type:"custom", title:"Predict and name", summary:"Predict and name", star:true, goal:[3, 4, 5, 6],
        instruction:"Six items. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Tap your answer (in item 2, tap every answer that fits), then press Check.",
        items:[
          { id:"r1", kind:"chips", goal:4, prompt:"Name the product: pentan-3-ol + [O]",
            options:[
              { t:"pentan-3-one", ok:true, why:"Secondary → ketone: the C=O forms where the OH was, on C3." },
              { t:"pentanal", why:"Secondary → ketone." },
              { t:"pentanoic acid", why:M7 },
              { t:"no reaction", why:"Only tertiary alcohols resist mild oxidation, and pentan-3-ol is secondary." }] },
          { id:"r2", kind:"all", goal:5, prompt:"Name the alkene(s) from dehydrating 2-methylbutan-2-ol. Select <strong>all</strong> that form.",
            options:[
              { t:"2-methylbut-1-ene", ok:true },
              { t:"2-methylbut-2-ene", ok:true },
              { t:"3-methylbut-1-ene", why:"The C=C forms between C2 (which held the OH) and a neighbouring carbon, so C2 must be in the double bond." },
              { t:"pent-2-ene", why:"Dehydration doesn’t change the carbon skeleton: the chain stays branched." }],
            missing:"H can leave from either neighbouring carbon type.",
            why:"H can leave from either neighbouring carbon type: from a CH₃ (2-methylbut-1-ene) or from the CH₂ (2-methylbut-2-ene)." },
          { id:"r3", kind:"chips", star:true, goal:3, prompt:"Order by solubility in water, least first: hexan-1-ol, ethanol, butan-1-ol",
            options:[
              { t:"hexan-1-ol < butan-1-ol < ethanol", ok:true, why:"Longer nonpolar chains dissolve less: ethanol mixes completely, butan-1-ol only partly, hexan-1-ol hardly at all." },
              { t:"ethanol < butan-1-ol < hexan-1-ol", why:M5 },
              { t:"butan-1-ol < hexan-1-ol < ethanol", why:"Hexanol’s longer chain makes it least soluble." },
              { t:"all about the same", why:"Solubility falls quickly as the chain grows. " + M5 }] },
          { id:"r4", kind:"chips", star:true, goal:[3, 6], prompt:"Which isomer of C₃H₈O boils lowest?",
            options:[
              { t:"propan-1-ol", why:"Any alcohol H-bonds; the ether can’t." },
              { t:"propan-2-ol", why:"Any alcohol H-bonds; the ether can’t." },
              { t:"methoxyethane", ok:true, why:"The ether has no O–H, so its molecules can’t H-bond to each other: it boils lowest." }] },
          { id:"r5", kind:"chips", star:true, goal:[4, 6], prompt:"<strong>Investigation:</strong> Unknown X is C₄H₁₀O. It doesn’t react with [O], and it boils at 82 °C. Ether or alcohol, and which one?",
            useBp:["butan-1-ol", "butan-2-ol", "2-methylpropan-1-ol", "2-methylpropan-2-ol", "ethoxyethane", "1-methoxypropane", "2-methoxypropane"],
            options:[
              { t:"an alcohol: 2-methylpropan-2-ol", ok:true, why:"Ethers don’t oxidize either, but no C₄ ether boils as high as 82 °C; the tertiary alcohol fits both clues." },
              { t:"an ether: ethoxyethane", why:"Ethers don’t oxidize either, but no C₄ ether boils as high as 82 °C; the tertiary alcohol fits both clues." },
              { t:"an ether: 2-methoxypropane", why:"Ethers don’t oxidize either, but no C₄ ether boils as high as 82 °C; the tertiary alcohol fits both clues." },
              { t:"an alcohol: butan-2-ol", why:"Butan-2-ol is secondary: it would oxidize to butanone." }],
            hints:["What doesn’t oxidize?", "Tertiary alcohols and ethers.", "The high boiling point needs H-bonding: 2-methylpropan-2-ol."] },
          { id:"r6", kind:"chips", star:true, goal:[4, 5], prompt:"An alcohol C₅H₁₂O gives a ketone on oxidation and only <strong>one</strong> alkene on dehydration. Which is it?",
            options:[
              { t:"pentan-3-ol", ok:true, why:"Secondary, so it gives a ketone (pentan-3-one). Both neighbouring carbons are CH₂ in identical ethyl groups, so only pent-2-ene forms." },
              { t:"pentan-2-ol", why:"Two alkenes (pent-1-ene and pent-2-ene)." },
              { t:"3-methylbutan-2-ol", why:"Two alkenes." },
              { t:"2-methylbutan-2-ol", why:"Tertiary: it doesn’t oxidize, so no ketone." }],
            hints:["Ketone → secondary alcohol.", "For one alkene, both neighbouring carbons must be equivalent.", "pentan-3-ol: both neighbours are CH₂ in identical ethyl groups."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Arash", how:"",
        instruction:"Arash made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Name CH₃CH₂CH₂CH(OH)CH₃.",
            steps:["The longest chain has 5 carbons: pentane.", "An OH makes it an alcohol: suffix -ol.", "Number from the left: the OH is on C4.", "Name: pentan-4-ol."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Follows from step 3."],
            fixes:[
              { t:"Number from the right, nearer the OH: pentan-2-ol.", ok:true, why:M6 + " From the right, the OH is on C2." },
              { t:"pentan-4-ol is correct.", why:M6 },
              { t:"Name it 2-hydroxypentane.", why:"OH is the main group here, so it’s the suffix -ol." },
              { t:"Name it pentanal.", why:"-al is an aldehyde." }],
            hints:["Which end is nearer the OH?", "The right.", "pentan-2-ol."] },
          { id:"e2", goal:2, task:"Classify 2-methylpropan-1-ol.",
            steps:["Structure: (CH₃)₂CHCH₂OH.", "The molecule has a branch at C2.", "Branched alcohols are secondary.", "So it’s a secondary alcohol."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Follows from step 3."],
            fixes:[
              { t:"Class depends on the C–OH carbon: C1 is bonded to one carbon, so it’s primary.", ok:true, why:M2 },
              { t:"It’s tertiary because of the branch.", why:M2 },
              { t:"It’s secondary because of the number 2 in the name.", why:M2 },
              { t:"Step 3 is correct.", why:"Branching elsewhere doesn’t decide the class." }],
            hints:["Which carbon holds the OH?", "C1.", "C1 has one carbon neighbour: primary."] },
          { id:"e3", goal:4, task:"Predict the product when 2-methylbutan-2-ol is treated with [O].",
            steps:["The OH is on C2, which is bonded to three carbons.", "So it’s a tertiary alcohol.", "Tertiary alcohols oxidize to ketones.", "Product: 2-methylbutan-2-one."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Follows from step 3. (That name can’t exist anyway: C2 would need five bonds.)"],
            fixes:[
              { t:"The C–OH carbon has no H to lose, so there’s no reaction with mild oxidation.", ok:true, why:M3 },
              { t:"It gives an aldehyde.", why:M7 },
              { t:"It gives a carboxylic acid.", why:M7 },
              { t:"Step 3 is correct.", why:M3 }],
            hints:["What does oxidation remove from the C–OH carbon?", "An H.", "None there: no reaction."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most: the ether’s boiling point, or how quickly solubility drops with chain length?" },
      { id:"j2", q:"In your own words, explain why an alcohol’s class decides what oxidation does." },
      { id:"j3", q:"Explain to a friend how to tell whether an alcohol is primary, secondary or tertiary." },
      { id:"j4", q:"Which reaction (oxidation or dehydration) is still harder to predict? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Name CH₃CH(OH)CH₂CH₃.", options:[
          { t:"butan-2-ol", ok:true, why:"OH on C2, numbering from the nearer end." },
          { t:"butan-3-ol", why:M6 },
          { t:"butan-1-ol", why:"The OH isn’t on an end carbon." },
          { t:"2-methylpropan-1-ol", why:"That’s a branched isomer, not this structure." }] },
        b:{ prompt:"Name CH₃OCH₂CH₂CH₃.", options:[
          { t:"1-methoxypropane", ok:true, why:"Longer chain is propane; the smaller group becomes methoxy." },
          { t:"propoxymethane", why:"Name the longer chain as the parent." },
          { t:"2-methoxypropane", why:"The O is on C1 of propane." },
          { t:"butan-1-ol", why:"Same formula, but this is an ether." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Classify 2-methylbutan-2-ol.", options:[
          { t:"tertiary", ok:true, why:"C2 is bonded to three carbons." },
          { t:"secondary", why:"The 2 is a locant, not the class." },
          { t:"primary", why:"C2 isn’t an end carbon." },
          { t:"it’s an ether", why:"It has an O–H." }] },
        b:{ prompt:"Classify 2-methylpropan-1-ol.", options:[
          { t:"primary", ok:true, why:"The C–OH carbon (C1) is bonded to one carbon." },
          { t:"secondary", why:"The branch is elsewhere." },
          { t:"tertiary", why:M2 },
          { t:"it’s an ether", why:"It has an O–H." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Oxidizing butan-2-ol gives…", options:[
          { t:"butanone", ok:true, why:"Secondary → ketone." },
          { t:"butanal", why:M7 },
          { t:"butanoic acid", why:M7 },
          { t:"no reaction", why:"Only tertiary alcohols resist." }] },
        b:{ prompt:"Complete oxidation of propan-1-ol gives…", options:[
          { t:"propanoic acid", ok:true, why:"Primary → aldehyde → acid." },
          { t:"propanone", why:M7 },
          { t:"propanal", why:"That’s the first step; complete oxidation goes on to the acid." },
          { t:"no reaction", why:"Primary alcohols oxidize." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Order by boiling point, lowest first: propane (44 g/mol), methoxyethane (60 g/mol), propan-1-ol (60 g/mol).", options:[
          { t:"propane < methoxyethane < propan-1-ol", ok:true, why:"London only; plus dipole–dipole; plus H-bonds." },
          { t:"methoxyethane < propane < propan-1-ol", why:"The polar ether boils above propane." },
          { t:"propane < propan-1-ol < methoxyethane", why:M1 },
          { t:"All about the same", why:"Forces differ a lot." }] },
        b:{ prompt:"Order by solubility in water, least first: ethanol, hexan-1-ol, butan-1-ol.", options:[
          { t:"hexan-1-ol < butan-1-ol < ethanol", ok:true, why:"Longer nonpolar chains dissolve less." },
          { t:"ethanol < butan-1-ol < hexan-1-ol", why:M5 },
          { t:"All mix completely", why:"Only small alcohols do." },
          { t:"butan-1-ol < hexan-1-ol < ethanol", why:"Hexanol’s longer chain makes it least soluble." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"An unknown alcohol, C₄H₁₀O, does <strong>not</strong> react with [O]. Which is it?", options:[
          { t:"2-methylpropan-2-ol", ok:true, why:"The only tertiary C₄ alcohol." },
          { t:"butan-2-ol", why:"Secondary: it would give butanone." },
          { t:"butan-1-ol", why:"Primary: it would oxidize." },
          { t:"2-methylpropan-1-ol", why:"Primary despite the branch." }] },
        b:{ prompt:"An alcohol C₅H₁₂O oxidizes to a ketone. Which could it be?", options:[
          { t:"pentan-3-ol", ok:true, why:"Secondary." },
          { t:"pentan-1-ol", why:"Primary: aldehyde." },
          { t:"2-methylbutan-2-ol", why:"Tertiary: no reaction." },
          { t:"3-methylbutan-1-ol", why:"Primary." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Dehydrating butan-2-ol (acid catalyst, heat) can give which alkene(s)?", options:[
          { t:"but-1-ene and but-2-ene", ok:true, why:"H can leave from C1 or C3." },
          { t:"only butane", why:"Dehydration makes a C=C, not an alkane." },
          { t:"butanone", why:"That’s oxidation." },
          { t:"but-1-yne", why:"Only one water leaves: a double bond, not a triple." }] },
        b:{ prompt:"Which alcohol gives only <strong>one</strong> alkene on dehydration?", options:[
          { t:"propan-2-ol", ok:true, why:"Losing H from C1 or C3 gives the same propene." },
          { t:"butan-2-ol", why:"Two alkenes." },
          { t:"pentan-2-ol", why:"Two alkenes." },
          { t:"2-methylbutan-2-ol", why:"Two alkenes." }] } },
      { id:"c1", cat:"C", goal:[3, 6],
        a:{ prompt:"Which is the best explanation of why ethanol boils at 78 °C but methoxymethane at −24 °C, though both are C₂H₆O?", options:[
          { t:"“Ethanol molecules hydrogen-bond to each other through O–H; methoxymethane has no O–H, so only dipole–dipole and London forces act between its molecules.”", ok:true, why:"Same formula and mass: the O–H, and the hydrogen bonds it allows, make the difference." },
          { t:"“Ethanol is heavier.”", why:"Same formula, same mass." },
          { t:"“Methoxymethane hydrogen-bonds more because its O is in the middle.”", why:M1 },
          { t:"“Ethanol has stronger covalent bonds.”", why:"Boiling doesn’t break covalent bonds." }] },
        b:{ prompt:"Which is the best explanation of why hexan-1-ol is much less soluble in water than ethanol?", options:[
          { t:"“Its long nonpolar chain can’t hydrogen-bond with water; one OH can’t make up for it.”", ok:true, why:M5 },
          { t:"“Hexan-1-ol has no O–H.”", why:"It does have one." },
          { t:"“Larger molecules always dissolve more.”", why:M5 },
          { t:"“Hexan-1-ol reacts with water.”", why:"No reaction occurs." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which statement correctly links an alcohol’s class to oxidation?", options:[
          { t:"“A tertiary alcohol has no H on the C–OH carbon, so mild oxidation doesn’t change it.”", ok:true, why:M3 },
          { t:"“A tertiary alcohol oxidizes to a ketone.”", why:M3 },
          { t:"“Primary alcohols oxidize to ketones.”", why:M7 },
          { t:"“All alcohols oxidize to carboxylic acids.”", why:"Only primary ones can." }] },
        b:{ prompt:"Which equation correctly shows oxidation of propan-2-ol?", options:[
          { t:"CH₃CH(OH)CH₃ + [O] → CH₃COCH₃ + H₂O", ok:true, why:"Secondary → ketone: the C=O forms on the middle carbon, and the two H atoms leave as water." },
          { t:"CH₃CH(OH)CH₃ + [O] → CH₃CH₂CHO + H₂O", why:"The C=O stays on the middle carbon." },
          { t:"CH₃CH(OH)CH₃ → CH₃CH=CH₂ + H₂O", why:"That’s dehydration, not oxidation." },
          { t:"CH₃CH(OH)CH₃ + NaOH → CH₃CH(ONa)CH₃ + H₂O", why:"Alcohols aren’t acids or bases like this in water. " + M4 }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"Breath testers detect ethanol by oxidizing it. Which product forms first?", options:[
          { t:"ethanal", ok:true, why:"Primary alcohol → aldehyde first." },
          { t:"ethene", why:"That’s dehydration." },
          { t:"propanone", why:"That would need a 3-carbon secondary alcohol." },
          { t:"ethane", why:"That’s not oxidation." }] },
        b:{ prompt:"An open bottle of wine slowly turns sour. Which change explains this?", options:[
          { t:"Ethanol is oxidized to ethanoic acid (the acid in vinegar)", ok:true, why:"Ethanol is a primary alcohol: aldehyde, then acid. Ethanoic acid is sour." },
          { t:"Ethanol is dehydrated to ethene", why:"Ethene is a gas, not sour." },
          { t:"Ethanol becomes methanol", why:"Carbon chains don’t shrink like that." },
          { t:"Ethanol is oxidized to propanone", why:"Ethanol has only 2 carbons." }] } },
      { id:"a2", cat:"A", goal:[1, 6],
        a:{ prompt:"Ethane-1,2-diol (car antifreeze) boils at 197 °C, far above ethanol (78 °C). Best reason?", options:[
          { t:"Two O–H groups per molecule: many more hydrogen bonds", ok:true, why:"Each O–H can hydrogen-bond, so the molecules hold each other much more tightly." },
          { t:"It has more carbons", why:"Both have 2 carbons." },
          { t:"It’s an ether", why:"It’s a diol: two OH groups." },
          { t:"Its molar mass is three times larger", why:"62 vs 46 g/mol: not enough to explain the difference." }] },
        b:{ prompt:"Propane-1,2,3-triol (glycerol) is thick, sweet and mixes with water. Which feature explains the mixing?", options:[
          { t:"Three O–H groups that hydrogen-bond with water", ok:true, why:"Three O–H groups on only three carbons: plenty of hydrogen bonding with water." },
          { t:"Its long nonpolar chain", why:"Only 3 carbons." },
          { t:"It’s an ether", why:"It has three OH groups." },
          { t:"It reacts with water", why:"It dissolves without reacting." }] } }
    ]
  },
  task:{
    title:"Branched and oxidizable", summary:"Branched and oxidizable",
    statement:"<p>Build an isomer of C₅H₁₂O that meets every condition. Can you find them all?</p><ol class=\"ao-conds\"><li>Its formula is C₅H₁₂O.</li><li>Its molecules can hydrogen-bond to each other.</li><li>It can be oxidized by [O].</li><li>Its carbon skeleton is branched.</li></ol><p class=\"tiny muted\">Tap an atom or a bond in the builder, then use the buttons under it: add a C or an O, remove an atom, put an O into a C–C bond, or change a bond to double. Hydrogen atoms fill in automatically, and the builder checks valence (C makes 4 bonds, O makes 2).</p>",
    checks:["C₅H₁₂O", "H-bonds to itself", "Oxidizable", "Branched"],
    tips:["Count atoms: C₅H₁₂O is saturated with one O.", "An ether can’t H-bond to itself; put the O on the end of a bond as –OH.", "Tertiary alcohols resist [O]: keep an H on the C–OH carbon.", "Add a methyl branch somewhere on a 4-carbon chain."],
    explainPrompt:"Explain how you made sure your molecule hydrogen-bonds and can still be oxidized.",
    vocab:"Use the words hydroxyl, primary, secondary, tertiary and branched.",
    more:"There’s more than one answer. Can you find them all?",
    allFound:"2-methylbutan-2-ol is branched and H-bonds, but it’s tertiary. The six ethers fail line 2."
  },
  cards:[
    ["Alcohol", "–OH on a saturated carbon; suffix -ol (propan-2-ol)."],
    ["Ether", "R–O–R′; named as alkoxy + longer chain (methoxyethane)."],
    ["Primary, secondary, tertiary", "The C–OH carbon is bonded to 1, 2 or 3 other carbons."],
    ["Functional-group isomers", "Same formula, different functional group: ethanol and methoxymethane."],
    ["Why alcohols boil high", "O–H allows hydrogen bonding between molecules."],
    ["Why ethers boil low", "No O–H, so no H-bonds between ether molecules."],
    ["Solubility trend", "Small alcohols mix with water; longer chains dissolve less."],
    ["Oxidizing a primary alcohol", "→ aldehyde → carboxylic acid."],
    ["Oxidizing a secondary alcohol", "→ ketone."],
    ["Tertiary alcohols", "Resist mild oxidation: no H on the C–OH carbon."],
    ["Dehydration", "Alcohol → alkene + H₂O (acid catalyst, heat); an elimination."],
    ["Diol", "Two OH groups: ethane-1,2-diol (antifreeze)."]
  ]
};
