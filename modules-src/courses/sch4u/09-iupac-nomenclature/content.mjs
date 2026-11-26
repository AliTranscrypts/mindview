// SCH4U 09 IUPAC Nomenclature. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/09-iupac-nomenclature.md
// Molecules are SMILES strings (smi) drawn and named by app.js (C1 view, C2 namer and name chips). Condensed formulas (cf)
// are the plan's text. Names the student must build are computed from the structure by app.js; "answer" marks targets.

// Misconception core sentences (plan §3)
const M1 = "Only the highest-priority group is a suffix. A ketone outranks an alcohol, so –OH becomes hydroxy-.";
const M2 = "Number so the <strong>principal group</strong> gets the lowest number first.";
const M3 = "Trace every path through the carbons: ‘2-ethylpropane’ is really 2-methylbutane.";
const M4 = "Prefixes go in alphabetical order of the group name; ignore di-, tri-.";
const M5 = "The alkyl group comes from the alcohol and is named first: CH₃CH₂COOCH₃ is methyl propanoate.";
const M6 = "–OH: -ol as suffix, hydroxy- as prefix. Ketone C=O: -one as suffix, oxo- as prefix.";
const M7 = "Each C=O replaces two C–H bonds: count H on each carbon from its bonds.";

export default {
  id:"09-iupac-nomenclature",
  kind:"topic",
  title:"IUPAC nomenclature",
  topic:"IUPAC Nomenclature",
  readyTopic:"IUPAC nomenclature",
  hero:{
    eq:'<span class="nm-eq">CH₃–C<span class="nm-o">O</span>–CH₂–CH₂–<span class="nm-o">O</span>H</span>', eqSize:"sm",
    eqLabel:"C H 3, C O, C H 2, C H 2, O H",
    headline:"One name, one structure",
    text:"An IUPAC name is a set of instructions. The <strong>suffix</strong> names the most important group, the <strong>parent</strong> says how long the chain is, and the <strong>prefixes</strong> list everything else in alphabetical order. Follow the rules and every chemist in the world draws the same molecule.",
    fig:{ html:'<div class="nm-hx"><div id="nm-hx-svg"></div><div class="nm-hx-row"><p class="nm-hx-cap" id="nm-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="nm-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can identify the principal group in a molecule with several functional groups using the priority order.",
    "I can use the correct suffix or prefix form of each group (-ol / hydroxy-, -one / oxo-, -amine / amino-).",
    "I can choose and number the parent chain so the principal group gets the lowest locant, then multiple bonds, then prefixes.",
    "I can draw a structure and write a molecular formula from an IUPAC name.",
    "I can find and fix errors in names (wrong parent chain, wrong numbering, wrong order).",
    "I can translate between IUPAC names and common names on real product labels."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Parent chains", goal:3,
          prompt:"How many carbons are in the longest chain of CH₃CH(CH₃)CH₂CH₃?",
          options:[
            { t:"4", ok:true, why:"Through the main line; the CH₃ in brackets is a branch." },
            { t:"5", why:"That counts the branch in the chain. The branch is off C2." },
            { t:"3", why:"That stops at the branch. Continue to the last CH₃." },
            { t:"2", why:"Count every carbon in the main path." }],
          hints:["Trace from one end to the other without lifting.", "C–C–C–C with a CH₃ on C2.", "4 (2-methylbutane)."] },
        { id:"w2", skill:"Parent chains", goal:3,
          prompt:"Which prefix means 5 carbons?",
          options:[
            { t:"pent-", ok:true, why:"Pent- means 5 carbons." },
            { t:"hex-", why:"Hex- is 6." },
            { t:"but-", why:"But- is 4." },
            { t:"prop-", why:"Prop- is 3." }],
          hints:["Meth, eth, prop, but, …", "Then pent, hex.", "pent-."] },
        { id:"w3", skill:"Suffixes by family", goal:2,
          prompt:"Which suffix shows an aldehyde?",
          options:[
            { t:"-al", ok:true, why:"Aldehyde → -al, as in ethanal." },
            { t:"-ol", why:"That’s an alcohol." },
            { t:"-one", why:"That’s a ketone." },
            { t:"-oic acid", why:"That’s a carboxylic acid." }],
          hints:["Aldehyde → al.", "Like ethanal.", "-al."] },
        { id:"w4", skill:"Suffixes by family", goal:2,
          prompt:"CH₃CH₂CH₂COOH is named…",
          options:[
            { t:"butanoic acid", ok:true, why:"Four carbons, counting the –COOH carbon as C1." },
            { t:"propanoic acid", why:"The C of –COOH is C1." },
            { t:"butanal", why:"–COOH is an acid, not an aldehyde." },
            { t:"butan-1-ol", why:"That’s an alcohol." }],
          hints:["Count all carbons, including the –COOH carbon.", "4 carbons.", "Butanoic acid."] },
        { id:"w5", skill:"Numbering", goal:3,
          prompt:"Name CH₃CH₂CH(OH)CH₃.",
          options:[
            { t:"butan-2-ol", ok:true, why:"Number from the end nearer the OH." },
            { t:"butan-3-ol", why:"That numbers from the wrong end. " + M2 },
            { t:"butanol", why:"The locant is needed: 1 or 2?" },
            { t:"2-hydroxybutane", why:"That uses the prefix form. " + M6 }],
          hints:["Which end is closer to the OH?", "The right end: OH on C2.", "Butan-2-ol."] },
        { id:"w6", skill:"Ester names", goal:6,
          prompt:"Name CH₃COOCH₂CH₃.",
          options:[
            { t:"ethyl ethanoate", ok:true, why:"Alkyl from the alcohol (ethyl), then the acid part (ethanoate)." },
            { t:"methyl propanoate", why:"That reads it left to right as one chain. " + M5 },
            { t:"ethanoyl ethyl", why:"Alkyl first, then alkanoate." },
            { t:"butanoate", why:"Two parts: alkyl + alkanoate." }],
          hints:["Split at the single-bonded O.", "Alcohol part: CH₂CH₃ (ethyl). Acid part: CH₃COO (ethanoate).", "Ethyl ethanoate."] }
      ],
      refreshers:{
        "Parent chains":"The parent is the longest continuous chain (containing the principal group). Branches are prefixes.",
        "Suffixes by family":"-oic acid, -oate, -amide, -al, -one, -ol, -amine; -ene and -yne go in the parent.",
        "Numbering":"Lowest locant to the principal group first; then to multiple bonds; then to prefixes.",
        "Ester names":"Alkyl (from the alcohol) + alkanoate (from the acid)."
      }
    }
  },
  explore:{
    heading:"Name machine",
    intro:"Feed the machine a structure and build its name from chips, or feed it a name and build the structure. It checks every rule as you go.",
    how:"Choose a mode. <strong>Structure → name:</strong> pick a structure, then tap chips to build its name (Backspace removes the last chip). <strong>Name → structure:</strong> pick a target name, tap an atom or a bond in the drawing, then use the builder buttons. <strong>Priority duel:</strong> pick a molecule, then choose the group that becomes the suffix.",
    modes:[{ id:"s2n", t:"Structure → name" }, { id:"n2s", t:"Name → structure" }, { id:"duel", t:"Priority duel" }],
    bank:[
      { id:"one", t:"One group", mols:[
        { id:"g1", cf:"CH₃CH(OH)CH₂CH₃", smi:"CC(O)CC" },
        { id:"g2", cf:"CH₃CH₂COCH₂CH₃", smi:"CCC(=O)CC" },
        { id:"g3", cf:"CH₃CH₂CH₂NH₂", smi:"CCCN" },
        { id:"g4", cf:"(CH₃)₂CHCH₂COOH", smi:"CC(C)CC(=O)O" },
        { id:"g5", cf:"CH₃CH=CHCH₂CH₃", smi:"CC=CCC" },
        { id:"g6", cf:"CH₃CHBrCH(CH₃)CH₃", smi:"CC(Br)C(C)C" },
        { id:"g7", cf:"(CH₃)₂CHCH₂COCH₃", smi:"CC(C)CC(=O)C" }] },
      { id:"two", t:"Two groups", mols:[
        { id:"t1", cf:"CH₃COCH₂CH₂OH", smi:"CC(=O)CCO" },
        { id:"t2", cf:"CH₂=CHCH(OH)CH₃", smi:"C=CC(O)C" },
        { id:"t3", cf:"CH₃COCH₂COOH", smi:"CC(=O)CC(=O)O" },
        { id:"t4", cf:"ClCH₂CH(OH)CH₃", smi:"ClCC(O)C" },
        { id:"t5", cf:"CH₃COCH=CHCH₃", smi:"CC(=O)C=CC" },
        { id:"t6", cf:"CH₃OCH₂CH₂COOH", smi:"COCCC(=O)O" },
        { id:"t7", cf:"CH₃CH₂CHBrCHO", smi:"CCC(Br)C=O" }] },
      { id:"ring", t:"Rings and benzene", mols:[
        { id:"r1", cf:"C₆H₁₁OH", smi:"OC1CCCCC1" },
        { id:"r2", cf:"C₅H₉CH₃", smi:"CC1CCCC1" },
        { id:"r3", cf:"CH₃C₆H₁₀OH", smi:"OC1CCCCC1C" },
        { id:"r4", cf:"C₆H₅CH₃", smi:"CC1=CC=CC=C1" },
        { id:"r5", cf:"BrC₆H₄Cl", smi:"BrC1=CC=C(Cl)C=C1" }] },
      { id:"ester", t:"Esters and amides", mols:[
        { id:"e1", cf:"(CH₃)₂CHCH₂COOCH₂CH₃", smi:"CC(C)CC(=O)OCC" },
        { id:"e2", cf:"CH₃COOCH₂CH₂CH₃", smi:"CC(=O)OCCC" },
        { id:"e3", cf:"CH₃CH₂CH₂COOCH₃", smi:"CCCC(=O)OC" },
        { id:"e4", cf:"CH₃CH₂CONHCH₃", smi:"CCC(=O)NC" },
        { id:"e5", cf:"CH₃CON(CH₂CH₃)₂", smi:"CC(=O)N(CC)CC" }] }
    ],
    targets:[
      { id:"tc2", t:"3-aminopropan-1-ol", answer:"NCCCO" },
      { id:"open", t:"Open: C₄H₈O₂ with hydroxy and -one", open:true },
      { id:"x1", t:"2-methylbutan-2-ol", answer:"CC(C)(O)CC" },
      { id:"x2", t:"3-chlorobutanal", answer:"CC(Cl)CC=O" },
      { id:"x3", t:"N-ethylethanamide", answer:"CC(=O)NCC" },
      { id:"x4", t:"but-3-en-2-one", answer:"C=CC(=O)C" }
    ],
    duels:[
      { id:"d1", cf:"CH₃COCH₂CH₂OH", smi:"CC(=O)CCO" },
      { id:"d2", cf:"HOCH₂CH₂CHO", smi:"OCCC=O" },
      { id:"d3", cf:"H₂NCH₂CH₂OH", smi:"NCCO" },
      { id:"d4", cf:"CH₃COCH₂CH₂NH₂", smi:"CC(=O)CCN" },
      { id:"d5", cf:"CH₂=CHCH₂OH", smi:"C=CCO" },
      { id:"d6", cf:"CH₃CH(NH₂)CHO", smi:"CC(N)C=O" }
    ],
    rules:{ m1:M1, m2:M2, m3:M3, m4:M4, m5:M5, m6:M6, m7:M7 },
    predictions:[
      { id:"p1", mol:"t1", prompt:"CH₃COCH₂CH₂OH. Which suffix will the name end in?",
        options:[{ t:"-one", ok:true }, { t:"-ol" }, { t:"-al" }, { t:"-ane" }],
        explain:"Ketone (rank 5) outranks alcohol (rank 6). " + M1 },
      { id:"p2", mol:"t2", prompt:"CH₂=CHCH(OH)CH₃. What locant does the –OH get?",
        options:[{ t:"2", ok:true }, { t:"3" }, { t:"1" }, { t:"4" }],
        explain:"The –OH is the principal group, so it gets priority over the C=C: but-3-en-2-ol. " + M2 },
      { id:"p3", mol:"e1", prompt:"(CH₃)₂CHCH₂COOCH₂CH₃. What is the first word of the name?",
        options:[{ t:"ethyl", ok:true }, { t:"methyl" }, { t:"butyl" }, { t:"pentyl" }],
        explain:"Ethyl 3-methylbutanoate: alcohol part first. " + M5 },
      { id:"p4", mol:"g6", prompt:"CH₃CHBrCH(CH₃)CH₃. Which name is correct?",
        options:[{ t:"2-bromo-3-methylbutane", ok:true }, { t:"3-bromo-2-methylbutane" }, { t:"2-methyl-3-bromobutane" }, { t:"3-methyl-2-bromobutane" }],
        explain:"B before m: bromo gets the lower number, and prefixes are listed alphabetically. " + M4 }
    ],
    chalIntro:"Use the name machine to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 2, 3], mol:"g7", prompt:"<strong>Structure → name:</strong> name (CH₃)₂CHCH₂COCH₃ with the chips.",
        why:"4-methylpentan-2-one (the older form 4-methyl-2-pentanone is accepted): the ketone is the principal group, the chain of 5 carbons includes the C=O, and numbering from the C=O end puts it at 2 and the methyl at 4.",
        wrong:[{ name:"2-methylpentan-4-one", fb:M2 }, { name:"4-methylhexan-2-one", fb:"Count again: 5 carbons in the chain." }],
        hints:["Principal group?", "Ketone: the chain of 5 carbons that includes the C=O.", "C=O at 2, methyl at 4."] },
      { id:"tc2", goal:4, target:"tc2", prompt:"<strong>Name → structure:</strong> draw 3-aminopropan-1-ol.",
        why:"H₂N–CH₂–CH₂–CH₂–OH: a 3-carbon chain with the –OH on C1 (suffix -ol) and the –NH₂ on C3.",
        sameC:"3 and 1 are different carbons.", onC2:"Amino on C3, at the far end from the OH.",
        hints:["Draw a 3-carbon chain.", "–OH on C1 (suffix -ol).", "–NH₂ on C3."] },
      { id:"tc3", goal:[1, 2, 3, 4], target:"open", stretch:true, prompt:"<strong>Name → structure, open:</strong> build any molecule with formula C₄H₈O₂ whose IUPAC name contains both ‘hydroxy’ and ‘-one’. Then name it.",
        why:"Three molecules work: 1-hydroxybutan-2-one (HOCH₂COCH₂CH₃), 3-hydroxybutan-2-one (CH₃CH(OH)COCH₃) and 4-hydroxybutan-2-one (HOCH₂CH₂COCH₃).",
        aldehyde:"That ends in -al: C=O at the chain end is an aldehyde.",
        acid:"C₄H₈O₂, but the two O’s are one group (-oic acid).",
        wrongNum:"Number so the principal group (C=O) is lowest: 4-hydroxybutan-2-one.",
        hints:["A ketone needs its C=O inside the chain: butan-2-one is the only C₄ ketone.", "Put the –OH on any carbon except the C=O carbon.", "Positions 1, 3 or 4; then renumber so the C=O is 2."] }
    ],
    blocks:[{ title:"The decision tree", html:"<p>Naming is a decision tree: <strong>principal group → parent → numbering → prefixes</strong>. Each decision has one rule.</p><ol><li><strong>Principal group:</strong> carboxylic acid &gt; ester &gt; amide &gt; aldehyde &gt; ketone &gt; alcohol &gt; amine &gt; alkene/alkyne. Only the winner is a suffix.</li><li><strong>Parent:</strong> the longest chain that contains the principal group; -en- or -yn- for multiple bonds.</li><li><strong>Numbering:</strong> lowest locant to the principal group, then to multiple bonds, then to prefixes; a tie goes to the prefix first in the alphabet.</li><li><strong>Prefixes:</strong> alphabetical (hydroxy-, amino-, oxo-, halo-, alkoxy-, alkyl-), ignoring di- and tri-.</li></ol>" }]
  },
  part3:{
    slug:"labels", name:"Labels", heading:"Common names and real labels",
    intro:"Real bottles, ingredient lists and safety data use common names. Translate them into IUPAC names, and check each name against a structure.",
    s1:{ title:"Station 1: Kitchen and bathroom",
      intro:"Each product card names one ingredient by its common name. Tap a card, then tap the matching IUPAC name and structure.",
      products:[
        { id:"vin", product:"Vinegar", common:"acetic acid", answer:"eth-acid" },
        { id:"rub", product:"Rubbing alcohol", common:"isopropyl alcohol", answer:"p2ol" },
        { id:"nail", product:"Nail polish remover", common:"acetone", answer:"prone" },
        { id:"anti", product:"Antifreeze", common:"ethylene glycol", answer:"diol" },
        { id:"hand", product:"Hand sanitizer", common:"ethyl alcohol", answer:"etol" }],
      names:[
        { id:"eth-acid", t:"ethanoic acid", smi:"CC(=O)O", tip:"Acetic acid is the acid in vinegar: a 2-carbon –COOH." },
        { id:"p2ol", t:"propan-2-ol", smi:"CC(O)C", tip:"‘Isopropyl’ means the –OH is on the middle carbon of three." },
        { id:"prone", t:"propanone", smi:"CC(=O)C", tip:"Acetone is the 3-carbon ketone." },
        { id:"diol", t:"ethane-1,2-diol", smi:"OCCO", tip:"‘Glycol’ means two –OH groups, one on each carbon." },
        { id:"etol", t:"ethanol", smi:"CCO", tip:"Ethyl alcohol: a 2-carbon chain with one –OH." }],
      done:"All five matched. Every common name hides an IUPAC name with a suffix you know: -oic acid, -ol, -one." },
    s2:{ title:"Station 2: Flavour chemistry",
      intro:"Artificial flavour labels give ester names. Split each name into its alcohol part and acid part, then pick the parent alcohol and acid.",
      labels:[
        { id:"ban", flavour:"Banana", name:"3-methylbutyl ethanoate", common:"isoamyl acetate", smi:"CC(=O)OCCC(C)C",
          alcohols:["3-methylbutan-1-ol", "ethanol", "butan-1-ol", "3-methylbutanoic acid"], acids:["ethanoic acid", "3-methylbutanoic acid", "methanoic acid", "ethanol"], answer:["3-methylbutan-1-ol", "ethanoic acid"] },
        { id:"pin", flavour:"Pineapple", name:"ethyl butanoate", smi:"CCCC(=O)OCC",
          alcohols:["ethanol", "butan-1-ol", "methanol", "propan-1-ol"], acids:["butanoic acid", "ethanoic acid", "propanoic acid", "butanal"], answer:["ethanol", "butanoic acid"] },
        { id:"win", flavour:"Wintergreen", name:"methyl 2-hydroxybenzoate", smi:"COC(=O)C1=C(O)C=CC=C1",
          alcohols:["methanol", "ethanol", "phenol", "methanal"], acids:["2-hydroxybenzoic acid", "benzoic acid", "methanoic acid", "ethanoic acid"], answer:["methanol", "2-hydroxybenzoic acid"] }],
      split:"Which word comes from the alcohol?",
      splitFb:"The first word (the -yl alkyl group) comes from the alcohol; the -oate word comes from the acid.",
      done:"Alkyl from the alcohol, -oate from the acid. " },
    s3:{ title:"Station 3: Sour and fresh",
      intro:"Count the groups from each name, then check your count against the structure.",
      acids:[
        { id:"lac", common:"Lactic acid (sour milk)", name:"2-hydroxypropanoic acid", smi:"CC(O)C(=O)O", answer:[1, 1],
          why:"‘-oic acid’ is one –COOH, and ‘2-hydroxy’ is one –OH." },
        { id:"cit", common:"Citric acid (citrus fruit)", name:"2-hydroxypropane-1,2,3-tricarboxylic acid", smi:"OC(=O)CC(O)(CC(=O)O)C(=O)O", answer:[3, 1],
          why:"‘Tricarboxylic acid’ is three –COOH groups, and ‘2-hydroxy’ is one –OH." }],
      data:"Check it with data: the structures" },
    quickCheck:{
      title:"Quick check", summary:"Common names and real labels quick check",
      items:[
        { id:"q1", goal:6, prompt:"Isopropyl alcohol is…",
          choices:[
            { t:"propan-2-ol", ok:true, fb:"Right. ‘Iso’ here means the OH is on the middle carbon." },
            { t:"propan-1-ol", fb:"‘Iso’ here means the OH is on the middle carbon." },
            { t:"propanone", fb:"‘Iso’ here means the OH is on the middle carbon." },
            { t:"propanal", fb:"‘Iso’ here means the OH is on the middle carbon." }] },
        { id:"q2", goal:6, prompt:"Acetone is…",
          choices:[
            { t:"propanone", ok:true, fb:"Right. A three-carbon ketone; ‘propan-2-one’ is also accepted." },
            { t:"ethanone", fb:"A three-carbon ketone; ‘propan-2-one’ is also accepted." },
            { t:"propanal", fb:"A three-carbon ketone; ‘propan-2-one’ is also accepted." },
            { t:"propan-2-ol", fb:"A three-carbon ketone; ‘propan-2-one’ is also accepted." }] },
        { id:"q3", goal:6, prompt:"Ethyl butanoate is made from…",
          choices:[
            { t:"ethanol + butanoic acid", ok:true, fb:"Right. Alkyl from the alcohol, -oate from the acid." },
            { t:"butanol + ethanoic acid", fb:"Alkyl from the alcohol, -oate from the acid. " + M5 },
            { t:"ethanol + butanal", fb:"Alkyl from the alcohol, -oate from the acid." },
            { t:"ethane + butanoic acid", fb:"Alkyl from the alcohol, -oate from the acid." }] },
        { id:"q4", goal:6, prompt:"How many –COOH groups in citric acid?",
          choices:[
            { t:"3", ok:true, fb:"Right. Tricarboxylic acid: three." },
            { t:"1", fb:"Tricarboxylic acid: three." },
            { t:"2", fb:"Tricarboxylic acid: three." },
            { t:"4", fb:"Tricarboxylic acid: three." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"nameit", type:"custom", title:"Name it", summary:"Name it", goal:[1, 2, 3],
        instruction:"Eight structures. Build each name with the chips, then press Check.",
        how:"Tap chips to build the name (Backspace removes the last chip). Use Next and Previous to move between structures.",
        items:[
          { id:"n1", cf:"CH₃CH(OH)CH(CH₃)CH₃", smi:"CC(O)C(C)C", answer:"3-methylbutan-2-ol",
            hints:["Principal group?", "–OH: number from the end nearer it, along the 4-carbon chain.", "OH at 2, CH₃ at 3: 3-methylbutan-2-ol."] },
          { id:"n2", cf:"(CH₃)₂CHCHO", smi:"CC(C)C=O", answer:"2-methylpropanal",
            hints:["Principal group?", "Aldehyde: the CHO carbon is C1, and no locant is needed for -al.", "CH₃ at 2: 2-methylpropanal."] },
          { id:"n3", cf:"CH₃COCH₂CH=CH₂", smi:"CC(=O)CC=C", answer:"pent-4-en-2-one",
            wrong:[{ name:"pent-1-en-4-one", fb:M2 + " The ketone is principal: number from its end." }],
            hints:["Principal group?", "Ketone: number from its end, then give the C=C its locant.", "C=O at 2, C=C at 4: pent-4-en-2-one."] },
          { id:"n4", cf:"ClCH₂CH(CH₃)CH₂OH", smi:"ClCC(C)CO", answer:"3-chloro-2-methylpropan-1-ol",
            wrong:[{ name:"1-chloro-2-methylpropan-3-ol", fb:M2 }],
            hints:["Principal group?", "–OH: number from its carbon.", "OH at 1, CH₃ at 2, Cl at 3; prefixes alphabetical: chloro, methyl."] },
          { id:"n5", cf:"CH₃CH(OH)CH₂COOH", smi:"CC(O)CC(=O)O", answer:"3-hydroxybutanoic acid",
            hints:["Principal group?", "The acid: its –COOH carbon is C1, so the –OH becomes a prefix.", "OH at 3: 3-hydroxybutanoic acid."] },
          { id:"n6", cf:"CH₃COCH₂CH₂COOH", smi:"CC(=O)CCC(=O)O", answer:"4-oxopentanoic acid",
            wrong:[{ name:"pentan-4-one-oic acid", fb:"Only one suffix: the acid; the ketone becomes oxo-. " + M1 }],
            hints:["Principal group?", "The acid is C1; the ketone C=O becomes the prefix oxo-.", "C=O at 4: 4-oxopentanoic acid."] },
          { id:"n7", cf:"CH₃CH₂OCH₂CH₂CH₃", smi:"CCOCCC", answer:"1-ethoxypropane",
            wrong:[{ name:"1-propoxyethane", fb:"The longer chain is the parent; the shorter side is the alkoxy prefix." }],
            hints:["Principal group?", "No suffix group: the longer chain (propane) is the parent; the shorter side is an alkoxy prefix.", "Ethoxy on C1: 1-ethoxypropane."] },
          { id:"n8", cf:"CH₃CH(NH₂)COOH", smi:"CC(N)C(=O)O", answer:"2-aminopropanoic acid", common:"alanine",
            hints:["Principal group?", "The acid is C1; the –NH₂ becomes the prefix amino-.", "NH₂ at 2: 2-aminopropanoic acid (alanine)."] }
        ] },
      { id:"fixit", type:"custom", title:"Name ↔ structure and fix-it", summary:"Name ↔ structure and fix-it", star:true, goal:[3, 4, 5],
        instruction:"Six items: draw from a name, or fix a name. F3 to F6 are non-routine; F5 and F6 go beyond the Final Check.",
        how:"To draw, tap an atom or a bond in the builder, then use the builder buttons. To fix a name, build the correct name with the chips. Then press Check.",
        items:[
          { id:"f1", kind:"draw", goal:4, prompt:"Draw butan-2-one; give its formula.", answer:"CCC(=O)C", formula:"C4H8O",
            wrongF:[{ f:"C4H10O", fb:M7 }],
            hints:["Draw a 4-carbon chain.", "Put a double-bonded O on C2.", "CH₃COCH₂CH₃; C₄H₈O."] },
          { id:"f2", kind:"draw", goal:4, prompt:"Draw N,N-dimethylethanamide; give its formula.", answer:"CC(=O)N(C)C", formula:"C4H9NO",
            wrongF:[{ f:"C2H5NO", fb:"Include the two N-methyls." }],
            hints:["Ethanamide: CH₃–C(=O)–NH₂.", "Replace both H’s on the N with CH₃.", "CH₃CON(CH₃)₂; C₄H₉NO."] },
          { id:"f3", kind:"fix", star:true, goal:5, prompt:"Fix the name ‘2-ethylbutane’.", given:"2-ethylbutane", smi:"CC(CC)CC", answer:"3-methylpentane",
            wrong:[{ name:"2-ethylbutane", fb:"The ethyl branch extends the chain to 5. " + M3 }],
            hints:["Trace the longest path through the carbons.", "Run the chain through the ethyl branch: 5 carbons.", "3-methylpentane."] },
          { id:"f4", kind:"fix", star:true, goal:5, prompt:"Fix the name ‘1-methylpropan-1-ol’.", given:"1-methylpropan-1-ol", smi:"CC(O)CC", answer:"butan-2-ol",
            wrong:[{ name:"1-methylpropan-1-ol", fb:"A methyl on C1 lengthens the chain. " + M3 }],
            hints:["A methyl on an end carbon is part of the chain.", "4 carbons, with the –OH on the second.", "Butan-2-ol."] },
          { id:"f5", kind:"fix", star:true, goal:5, prompt:"Fix the name ‘3-hydroxypropan-1-one’.", given:"3-hydroxypropan-1-one", smi:"OCCC=O", answer:"3-hydroxypropanal",
            wrong:[{ name:"3-hydroxypropan-1-one", fb:"A C=O at the end of a chain is an aldehyde: -al, and no locant is needed." }],
            hints:["Where is the C=O: inside the chain or at the end?", "At the end: an aldehyde, which outranks the alcohol.", "3-hydroxypropanal."] },
          { id:"f6", kind:"esters", star:true, goal:[4, 5], prompt:"Draw and name every ester with formula C₄H₈O₂.",
            answer:["methyl propanoate", "ethyl ethanoate", "propyl methanoate", "1-methylethyl methanoate"],
            alias:{ "isopropyl methanoate":"1-methylethyl methanoate" },
            fb:"Split 4 carbons between the alkyl part and the acid part: 1 + 3, 2 + 2, 3 + 1 (two ways).",
            hints:["Alkyl + alkanoate; the alkanoate includes the C=O carbon.", "Alcohol carbons + acid carbons = 4.", "Methyl + propanoate; ethyl + ethanoate; propyl or 1-methylethyl + methanoate."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Dante", how:"",
        instruction:"Dante made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Name HOCH₂CH₂CH₂CHO.",
            steps:["The groups are –OH and –CHO.", "The alcohol is the principal group, so the suffix is -ol.", "The chain has 4 carbons, numbered from the OH.", "Name: 4-oxobutan-1-ol."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Follows step 2.", "Follows step 2. The mistake is earlier."],
            fixes:[
              { t:"The aldehyde outranks the alcohol: suffix -al, C1 = CHO; name 4-hydroxybutanal.", ok:true, why:"Aldehyde (4) beats alcohol (6), so –OH becomes hydroxy-." },
              { t:"Both are suffixes: butan-1-ol-al.", why:"Only one suffix: the highest-priority group." },
              { t:"1-hydroxybutan-4-al.", why:"An aldehyde carbon is always C1." },
              { t:"Step 2 is correct.", why:M1.replace("A ketone outranks an alcohol", "An aldehyde outranks an alcohol") }],
            hints:["Check the priority list.", "Aldehyde (4) beats alcohol (6).", "4-hydroxybutanal."] },
          { id:"e2", goal:3, task:"Name CH₂=CHCH₂CH(OH)CH₃.",
            steps:["The principal group is –OH (suffix -ol).", "The chain has 5 carbons with one C=C.", "Number from the left so the C=C gets locant 1.", "Name: pent-1-en-4-ol."],
            answer:2,
            stepFb:["Correct.", "Correct.", "", "Follows step 3. The mistake is earlier."],
            fixes:[
              { t:"Number from the right so the –OH gets the lowest locant: pent-4-en-2-ol.", ok:true, why:M2 },
              { t:"Use 4-hydroxypent-1-ene.", why:"The –OH is the principal group, so it’s the suffix -ol, not a prefix. " + M6 },
              { t:"Pent-4-en-1-ol.", why:"The OH is on C2." },
              { t:"Step 3 is correct.", why:M2 }],
            hints:["Which group gets the lowest number first?", "The principal group, –OH.", "Pent-4-en-2-ol."] },
          { id:"e3", goal:5, task:"Name CH₃CH(Cl)CH(CH₃)CH₂CH₃.",
            steps:["No suffix group: the parent is an alkane.", "Longest chain: 5 carbons (pentane).", "From the left: Cl at 2, CH₃ at 3. From the right: CH₃ at 3, Cl at 4. Use the left.", "List prefixes in number order: 2-chloro first, then 3-methyl.", "Name: 2-chloro-3-methylpentane."],
            answer:3,
            stepFb:["Correct.", "Correct.", "Correct: lowest locants {2, 3}.", "", "The name is right, but the reason in step 4 is wrong."],
            fixes:[
              { t:"Prefixes go alphabetically; ‘chloro’ comes before ‘methyl’, so 2-chloro-3-methylpentane is right for that reason.", ok:true, why:"Here alphabetical and numerical order happen to agree. " + M4 },
              { t:"Write 3-methyl-2-chloropentane.", why:"Alphabetical order puts chloro first." },
              { t:"Write 2-chloro-3-methylbutane.", why:"The longest chain has 5 carbons: pentane." },
              { t:"Step 4 is correct.", why:M4 }],
            hints:["What decides the order of prefixes?", "The alphabet, not the numbers.", "The name is right, but step 4’s rule is wrong: here alphabetical and numerical order happen to agree."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which rule surprised you most: the priority list, or that the principal group outranks the double bond for numbering?" },
      { id:"j2", q:"In your own words, describe the decision steps the name machine follows." },
      { id:"j3", q:"Explain to a friend how to name an ester from its structure." },
      { id:"j4", q:"Which family’s names still trip you up? What will you practise?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"In HOCH₂CH₂COOH, which group gives the suffix?", options:[
          { t:"the carboxylic acid", ok:true, why:"Name: 3-hydroxypropanoic acid." },
          { t:"the alcohol", why:"The acid outranks the alcohol. Only the highest-priority group is a suffix, so –OH becomes hydroxy-." },
          { t:"both", why:"Only one suffix." },
          { t:"neither; it’s named as an alkane", why:"Groups with suffixes win over the parent." }] },
        b:{ prompt:"In H₂NCH₂CH₂OH, which group gives the suffix?", options:[
          { t:"the alcohol", ok:true, why:"Name: 2-aminoethan-1-ol." },
          { t:"the amine", why:"Alcohol (6) outranks amine (7). Only the highest-priority group is a suffix." },
          { t:"both", why:"Only one suffix: the alcohol, which outranks the amine." },
          { t:"neither", why:"Groups with suffixes win over the parent: the alcohol gives -ol." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What is the prefix form of –OH when it isn’t the principal group?", options:[
          { t:"hydroxy-", ok:true, why:"–OH as a prefix is hydroxy-." },
          { t:"-ol", why:M6 },
          { t:"oxo-", why:"That’s for a ketone C=O." },
          { t:"hydro-", why:"Hydro- means added hydrogen." }] },
        b:{ prompt:"What is the prefix form of a ketone C=O when it isn’t the principal group?", options:[
          { t:"oxo-", ok:true, why:"A ketone C=O as a prefix is oxo-." },
          { t:"-one", why:M6 },
          { t:"hydroxy-", why:"That’s –OH." },
          { t:"carbonyl-", why:"Not an IUPAC prefix." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Name CH₃CH(Cl)CH₂CH₂OH.", options:[
          { t:"3-chlorobutan-1-ol", ok:true, why:"The –OH is principal: C1; the Cl is on C3." },
          { t:"2-chlorobutan-4-ol", why:M2 },
          { t:"3-chlorobutanal", why:"There’s no C=O." },
          { t:"1-hydroxy-3-chlorobutane", why:"The –OH is the principal group, so it’s the suffix -ol. " + M1 }] },
        b:{ prompt:"Name CH₂=CHCH₂CH(OH)CH₃.", options:[
          { t:"pent-4-en-2-ol", ok:true, why:"The –OH is principal: number from its end, C2; the C=C starts at C4." },
          { t:"pent-1-en-4-ol", why:M2 },
          { t:"4-hydroxypent-1-ene", why:"The –OH outranks the C=C, so it’s the suffix -ol. " + M1 },
          { t:"pent-4-en-2-one", why:"–OH is -ol." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"What is the molecular formula of 4-hydroxy-3-methylbutan-2-one?", options:[
          { t:"C₅H₁₀O₂", ok:true, why:"CH₃–CO–CH(CH₃)–CH₂OH." },
          { t:"C₅H₁₂O₂", why:"The C=O carbon has no H. " + M7 },
          { t:"C₄H₈O₂", why:"Include the methyl." },
          { t:"C₅H₁₀O", why:"Count the OH oxygen." }] },
        b:{ prompt:"What is the molecular formula of 3-amino-2-methylpropanoic acid?", options:[
          { t:"C₄H₉NO₂", ok:true, why:"H₂N–CH₂–CH(CH₃)–COOH." },
          { t:"C₄H₁₁NO₂", why:"The –COOH carbon has no C–H. " + M7 },
          { t:"C₃H₇NO₂", why:"Include the methyl." },
          { t:"C₄H₉NO", why:"–COOH has two O." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"A student names a compound 2-ethylpropan-1-ol. What is the correct name?", options:[
          { t:"2-methylbutan-1-ol", ok:true, why:"HOCH₂–CH(CH₂CH₃)–CH₃: the longest chain with the C–OH has 4 carbons." },
          { t:"2-ethylpropan-1-ol is correct", why:M3 },
          { t:"3-methylbutan-1-ol", why:"The branch is on C2." },
          { t:"2-methylbutan-2-ol", why:"The OH stays on the end carbon." }] },
        b:{ prompt:"A student names a compound 4-methylbutanal. What is the correct name?", options:[
          { t:"pentanal", ok:true, why:"A methyl on the last carbon just extends the chain." },
          { t:"4-methylbutanal is correct", why:M3 },
          { t:"2-methylbutanal", why:"The methyl is at the far end." },
          { t:"pentan-1-one", why:"An end C=O is an aldehyde." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"Which pair are functional-group isomers with formula C₃H₆O?", options:[
          { t:"propanal and propanone", ok:true, why:"Both are C₃H₆O: an aldehyde and a ketone." },
          { t:"propanal and propan-1-ol", why:"Propan-1-ol is C₃H₈O." },
          { t:"propanone and propan-2-ol", why:"Propan-2-ol is C₃H₈O." },
          { t:"propanoic acid and methyl ethanoate", why:"Those are C₃H₆O₂." }] },
        b:{ prompt:"Which pair are functional-group isomers with formula C₃H₆O₂?", options:[
          { t:"propanoic acid and methyl ethanoate", ok:true, why:"Both are C₃H₆O₂: an acid and an ester." },
          { t:"propanoic acid and propanal", why:"Propanal is C₃H₆O." },
          { t:"methyl ethanoate and propan-1-ol", why:"Propan-1-ol is C₃H₈O." },
          { t:"ethyl methanoate and propanone", why:"Propanone is C₃H₆O." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Why is CH₂=CHCH(OH)CH₃ named but-3-en-2-ol, not but-1-en-3-ol?", options:[
          { t:"The principal group (–OH) gets the lowest locant before the double bond is considered.", ok:true, why:M2 },
          { t:"The double bond must always be at C3.", why:"Its locant follows from the numbering." },
          { t:"Numbers are chosen alphabetically.", why:"The alphabet only breaks ties between prefixes. " + M2 },
          { t:"So the locants add to the smallest total.", why:"The first point of difference, starting with the principal group, decides." }] },
        b:{ prompt:"Why is CH₃CH₂COOCH₂CH₃ named ethyl propanoate, not propyl ethanoate?", options:[
          { t:"The ethyl group comes from the alcohol and is named first; the acid part, with the C=O, has 3 carbons (propanoate).", ok:true, why:"Alkyl (from the alcohol) + alkanoate (from the acid)." },
          { t:"The longer chain is always named first.", why:M5 },
          { t:"Esters are named alphabetically.", why:"Order is alkyl, then alkanoate." },
          { t:"They’re two names for the same molecule.", why:"Propyl ethanoate is CH₃COOCH₂CH₂CH₃, a different molecule." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which condensed formula matches 2-methylpropan-2-ol?", options:[
          { t:"(CH₃)₃COH", ok:true, why:"A 3-carbon chain with the –OH and a methyl both on C2." },
          { t:"CH₃CH(CH₃)CH₂OH", why:"That’s 2-methylpropan-1-ol." },
          { t:"CH₃CH₂CH(OH)CH₃", why:"That’s butan-2-ol." },
          { t:"(CH₃)₂CHOCH₃", why:"That’s an ether." }] },
        b:{ prompt:"Which condensed formula matches N-ethyl-N-methylpropanamide?", options:[
          { t:"CH₃CH₂CON(CH₃)CH₂CH₃", ok:true, why:"Propanamide (3 carbons with the C=O) with an ethyl and a methyl on N." },
          { t:"CH₃CH₂CH₂N(CH₃)CH₂CH₃", why:"No C=O: that’s an amine." },
          { t:"CH₃CON(CH₃)CH₂CH₂CH₃", why:"That’s N-methyl-N-propylethanamide." },
          { t:"CH₃CH₂COOCH₂CH₃", why:"That’s an ester." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A banana flavouring is 3-methylbutyl ethanoate. Which alcohol and acid would make it by esterification?", options:[
          { t:"3-methylbutan-1-ol and ethanoic acid", ok:true, why:"Alkyl (3-methylbutyl) from the alcohol; ethanoate from the acid." },
          { t:"ethanol and 3-methylbutanoic acid", why:M5 },
          { t:"3-methylbutanal and ethanol", why:"An ester needs an alcohol and an acid." },
          { t:"3-methylbutane and ethanoic acid", why:"An alkane can’t form an ester." }] },
        b:{ prompt:"An apple flavouring is ethyl 2-methylbutanoate. Which alcohol and acid would make it?", options:[
          { t:"ethanol and 2-methylbutanoic acid", ok:true, why:"Ethyl from the alcohol; 2-methylbutanoate from the acid." },
          { t:"2-methylbutan-1-ol and ethanoic acid", why:M5 },
          { t:"ethanal and 2-methylbutanoic acid", why:"An ester needs an alcohol, not an aldehyde." },
          { t:"ethane and 2-methylbutanoic acid", why:"An alkane can’t form an ester." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"Sour milk contains 2-hydroxypropanoic acid. Which structure is it?", options:[
          { t:"CH₃CH(OH)COOH", ok:true, why:"–COOH is C1, and the –OH is on C2." },
          { t:"HOCH₂CH₂COOH", why:"That’s 3-hydroxypropanoic acid." },
          { t:"CH₃COCOOH", why:"That’s 2-oxopropanoic acid." },
          { t:"CH₃CH(OH)CHO", why:"That’s an aldehyde." }] },
        b:{ prompt:"Citric acid is 2-hydroxypropane-1,2,3-tricarboxylic acid. How many –COOH and –OH groups does it have?", options:[
          { t:"3 –COOH and 1 –OH", ok:true, why:"Tricarboxylic acid: three –COOH; 2-hydroxy: one –OH." },
          { t:"1 –COOH and 3 –OH", why:"Tricarboxylic = three acid groups." },
          { t:"3 –COOH and 2 –OH", why:"One hydroxy prefix." },
          { t:"2 –COOH and 1 –OH", why:"Count 1, 2, 3." }] } }
    ]
  },
  task:{
    title:"Name designer", summary:"Name designer",
    statement:"<p>Build a molecule that meets every condition, then name it. Can you find all the answers?</p><ol class=\"nm-conds\"><li>Its formula is C₅H₁₀O.</li><li>It is an aldehyde or a ketone.</li><li>Its parent chain has 4 carbons.</li><li>Your name for it is correct.</li></ol>",
    checks:["C₅H₁₀O", "Aldehyde or ketone", "Parent chain: 4 carbons", "Named correctly"],
    tips:["C₅H₁₀O with a C=O: one double bond, no rings.", "An aldehyde’s C=O is at a chain end; a ketone’s is inside.", "Five carbons with a 4-carbon parent means one methyl branch.", "Number so the C=O gets the lowest locant."],
    explainPrompt:"Explain how you chose where to put the C=O and the branch, and how you numbered the chain.",
    vocab:"Use the words principal group, parent chain, locant and prefix.",
    more:"There are three answers. Can you find them all?",
    after3:"The other C₅H₁₀O carbonyls fail line 3: pentanal, pentan-2-one and pentan-3-one have 5-carbon chains; 2,2-dimethylpropanal has a 3-carbon chain."
  },
  cards:[
    ["Name order", "prefixes (alphabetical) + parent + suffix"],
    ["Priority order", "acid &gt; ester &gt; amide &gt; aldehyde &gt; ketone &gt; alcohol &gt; amine &gt; alkene/alkyne"],
    ["Numbering rule", "Lowest locant to the principal group, then multiple bonds, then prefixes"],
    ["–OH forms", "-ol (suffix) · hydroxy- (prefix)"],
    ["Ketone C=O forms", "-one (suffix) · oxo- (prefix)"],
    ["–NH₂ forms", "-amine (suffix) · amino- (prefix)"],
    ["Ether naming", "Alkoxy + alkane: CH₃OCH₂CH₂CH₃ is 1-methoxypropane"],
    ["Ester naming", "Alkyl (from the alcohol) + alkanoate (from the acid)"],
    ["Prefix order", "Alphabetical, ignoring di-, tri-"],
    ["Aldehyde locant", "The –CHO carbon is always C1: no number needed"],
    ["Older forms", "2-propanol = propan-2-ol (both accepted; current IUPAC puts the locant before the suffix)"],
    ["Common names", "acetic acid (ethanoic acid), acetone (propanone), isopropyl alcohol (propan-2-ol)"]
  ]
};
