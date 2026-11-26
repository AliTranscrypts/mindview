// SCH4U 06 Amines and Amides. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/06-amines-and-amides.md
// Molecules, the Nitrogen family builder, the peptide joiner, the nylon preview, the group finder and the task builder are
// drawn by app.js. Boiling points come from app.js data (the plan's data table, course table additions).

// Misconception core sentences (plan §3), reused where the plan points to them.
const M1 = "For amines, count the carbon groups on the <strong>nitrogen</strong>. Propan-2-amine has one carbon on N, so it’s primary.";
const M2 = "Hydrogen bonding between molecules needs an H on N, O or F. A tertiary amine has no N–H.";
const M3 = "O (3.44) is more electronegative than N (3.04), so O–H···O bonds are stronger than N–H···N bonds.";
const M4 = "In an amide, the N’s lone pair is pulled toward the C=O, so it isn’t free to accept H⁺.";
const M5 = "Carbons on the N are N-prefixes. The parent chain is the one with the C=O (amide) or bonded to N (amine).";
const M6 = "Hydrolysis breaks the C–N bond: the C=O side becomes the acid, the N side becomes the amine.";
const M7 = "An acid + <strong>alcohol</strong> gives an ester; an acid + <strong>amine</strong> gives an amide. Both release water.";
// Activity 1 hints 1 and 2 (plan)
const H1 = "Is there a C=O bonded to the N’s carbon?", H2 = "Count carbon groups on N.";
const AMIDE = "There’s a C=O next to the N: that makes it an amide.";
const NOTAMIDE = "No C=O next to the N: it’s an amine.";

export default {
  id:"06-amines-and-amides",
  kind:"topic",
  title:"Amines and amides",
  topic:"Amines and Amides",
  readyTopic:"amines and amides",
  hero:{
    eq:'<span class="am-eq"><span class="nw"><span class="am-n">N</span>H₃ →</span> <span class="nw">CH₃<span class="am-n">N</span>H₂ →</span> <span class="nw">(CH₃)₂<span class="am-n">N</span>H →</span> <span class="nw">(CH₃)₃<span class="am-n">N</span>,</span> <span class="nw">then CH₃C<span class="am-o">O</span><span class="am-n">N</span>H₂</span></span>', eqSize:"sm",
    eqLabel:"N H 3, then C H 3 N H 2, then (C H 3) 2 N H, then (C H 3) 3 N; then C H 3 C O N H 2",
    headline:"Ammonia with carbon attached",
    text:"Swap the hydrogens of ammonia for carbon groups and you get <strong>amines</strong>: primary, secondary or tertiary. Put a C=O next to the nitrogen and you get an <strong>amide</strong>, the link that holds proteins and nylon together. One lone pair decides who is a base; one N–H decides who can <strong>hydrogen-bond</strong>.",
    fig:{ html:'<div class="am-hx"><div id="am-hx-mol"></div><div class="am-hx-row"><p class="am-hx-cap" id="am-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="am-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can classify amines as primary, secondary or tertiary by counting carbons on the nitrogen, and tell amines from amides.",
    "I can name and draw simple amines and amides using IUPAC rules (including N-substituents).",
    "I can explain and predict boiling points and solubility of amines and amides from hydrogen bonding and polarity.",
    "I can write the condensation that forms an amide and the hydrolysis that breaks one.",
    "I can explain why amines are basic and amides are not, and use this in everyday contexts.",
    "I can identify amine and amide groups in proteins, polymers and medicines."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Hydrogen bonding", goal:3,
          prompt:"Which pure substance has hydrogen bonds between its molecules?",
          options:[
            { t:"Ethanol, CH₃CH₂OH", ok:true, why:"An H on O lets molecules hydrogen-bond." },
            { t:"Methoxymethane, CH₃OCH₃", why:"No H is bonded to the O." },
            { t:"Propane, CH₃CH₂CH₃", why:"C–H bonds aren’t polar enough." },
            { t:"Chloromethane, CH₃Cl", why:"Polar, but no H on N, O or F." }],
          hints:["Look for H bonded directly to N, O or F.", "Only one choice has an O–H.", "Ethanol."] },
        { id:"w2", skill:"Hydrogen bonding", goal:3,
          prompt:"Using electronegativity (N 3.04, O 3.44, F 3.98), which bond makes the strongest hydrogen bonds?",
          options:[
            { t:"F–H", ok:true, why:"The largest difference from H (2.20) gives the most polar bond." },
            { t:"N–H", why:"N is the least electronegative of the three." },
            { t:"O–H", why:"O–H is common but F–H is more polar." },
            { t:"All three equally", why:"Polarity depends on the electronegativity difference." }],
          hints:["Which atom pulls electrons hardest?", "F has the highest value.", "F–H."] },
        { id:"w3", skill:"Functional groups", goal:1,
          prompt:"Which functional group is in CH₃COOCH₂CH₃?",
          options:[
            { t:"Ester", ok:true, why:"–COO– between two carbon groups." },
            { t:"Carboxylic acid", why:"An acid ends in –COOH, with an H on the O." },
            { t:"Ketone", why:"The C=O carbon is also bonded to an O." },
            { t:"Ether", why:"The C=O makes it an ester." }],
          hints:["Is there an H on the O?", "No: an alkyl group.", "Ester (ethyl ethanoate)."] },
        { id:"w4", skill:"Functional groups", goal:1,
          prompt:"Which formula shows a carboxylic acid?",
          options:[
            { t:"CH₃CH₂COOH", ok:true, why:"–COOH." },
            { t:"CH₃CH₂CHO", why:"That’s an aldehyde (–CHO)." },
            { t:"CH₃COCH₃", why:"That’s a ketone." },
            { t:"CH₃CH₂CH₂OH", why:"That’s an alcohol." }],
          hints:["Look for C=O and O–H on the same carbon.", "–COOH.", "Propanoic acid."] },
        { id:"w5", skill:"Condensation", goal:4,
          prompt:"Ethanoic acid reacts with methanol to make an ester. What else forms?",
          options:[
            { t:"Water", ok:true, why:"The –OH from the acid and H from the alcohol leave as H₂O." },
            { t:"Hydrogen gas", why:"No H₂ is released." },
            { t:"Carbon dioxide", why:"No carbon is lost." },
            { t:"Nothing", why:"Condensation always releases a small molecule." }],
          hints:["What does ‘condensation’ mean in organic chemistry?", "Two molecules join and a small one is lost.", "Water."] },
        { id:"w6", skill:"Brønsted–Lowry bases", goal:5,
          prompt:"In NH₃ + H₂O ⇌ NH₄⁺ + OH⁻, what does NH₃ do?",
          options:[
            { t:"Accepts H⁺ from water, so it acts as a base", ok:true, why:"Its lone pair bonds to H⁺." },
            { t:"Donates H⁺", why:"NH₃ gains an H to become NH₄⁺." },
            { t:"Donates OH⁻", why:"NH₃ has no OH; the OH⁻ comes from water." },
            { t:"Nothing; it only dissolves", why:"NH₄⁺ forms, so a proton moved." }],
          hints:["Compare NH₃ and NH₄⁺.", "It gained an H⁺.", "Base."] }
      ],
      refreshers:{
        "Hydrogen bonding":"Between molecules, an H bonded to N, O or F is attracted to a lone pair on N, O or F of a neighbour. The more electronegative the atom, the stronger the hydrogen bond.",
        "Functional groups":"–OH alcohol; –CHO aldehyde; C=O between carbons ketone; –COOH acid; –COO– ester.",
        "Condensation":"Two molecules join and release a small molecule, usually water.",
        "Brønsted–Lowry bases":"A base accepts H⁺, usually with a lone pair."
      }
    }
  },
  explore:{
    heading:"Nitrogen family builder",
    intro:"Put carbon groups on a nitrogen, or a C=O next to it. Watch the class, the name and the boiling point change.",
    how:"Choose a mode. <strong>Build:</strong> pick a group for each of the three places on the nitrogen (arrow keys move through the choices), and switch on the C=O to make an amide. <strong>Compare:</strong> tap up to 5 compounds to see their boiling points. <strong>Condense:</strong> choose an acid and an N-compound, then press Condense.",
    modes:[{ id:"build", t:"Build" }, { id:"compare", t:"Compare" }, { id:"condense", t:"Condense" }],
    condenseNote:"The module shows the overall condensation. In practice an acid and an amine first form a salt and need heating (or a more reactive form of the acid) to make the amide.",
    predictions:[
      { id:"p1", prompt:"Compare mode: propan-1-amine and N,N-dimethylmethanamine both have a molar mass of 59 g/mol. Which has the higher boiling point?",
        options:[{ t:"propan-1-amine", ok:true }, { t:"N,N-dimethylmethanamine" }, { t:"the same" }, { t:"can’t tell without more data" }],
        explain:"The bars rise to 48 °C and 3 °C. A tertiary amine has no N–H, so its molecules can’t hydrogen-bond to each other." },
      { id:"p2", prompt:"Ethanamine (45 g/mol) and ethanol (46 g/mol). Which boils higher?",
        options:[{ t:"ethanol", ok:true }, { t:"ethanamine" }, { t:"the same" }, { t:"ethanamine, because N has a lone pair" }],
        explain:"17 °C vs 78 °C. O–H is more polar than N–H, so ethanol’s hydrogen bonds are stronger." },
      { id:"p3", prompt:"Build mode: methanamine is in water with a pH m&#101;ter. Now the C=O is switched on, making methanamide. What happens to the pH when the C=O is added?",
        options:[{ t:"it drops from basic (above 7) to about 7", ok:true }, { t:"it rises" }, { t:"it stays basic" }, { t:"it becomes strongly acidic" }],
        explain:"The m&#101;ter swings from about 11.8 to about 7 (model reading). The amide’s lone pair is pulled toward the C=O, so it no longer accepts H⁺." },
      { id:"p4", prompt:"Ethanamide and propan-1-amine (both 59 g/mol). Which boils higher?",
        options:[{ t:"ethanamide, by about 170 °C", ok:true }, { t:"propan-1-amine" }, { t:"about the same" }, { t:"ethanamide, by about 5 °C" }],
        explain:"221 °C vs 48 °C. Two N–H bonds <strong>and</strong> a very polar C=O: amide molecules stick together strongly." }
    ],
    chalIntro:"Use the builder to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Build a <strong>secondary</strong> amine with molar mass 59 g/mol.",
        why:"N-methylethanamine, CH₃CH₂NHCH₃: two carbon groups on the N, and C₃H₉N is 59 g/mol. It’s the only secondary amine with this formula.",
        hints:["C₃H₉N: 3 carbons to share out.", "Secondary means exactly two carbon groups on N.", "A methyl and an ethyl: N-methylethanamine."] },
      { id:"tc2", goal:[2, 3], prompt:"Build an amide whose molecules <strong>can’t</strong> hydrogen-bond to each other, then name it with the name chips.",
        why:"A tertiary amide has no N–H, so its molecules can’t hydrogen-bond to each other. The carbons on the N are N-prefixes; the parent comes from the C=O side.",
        hints:["Which bond lets amides hydrogen-bond?", "Replace both H’s on N.", "e.g. CH₃CON(CH₃)₂: N,N-dimethylethanamide."] },
      { id:"tc3", goal:4, stretch:true, prompt:"Condense mode: choose an acid and an N-compound so the amide formed has molar mass 73 g/mol <strong>and</strong> can still hydrogen-bond to itself.",
        why:"C₃H₇NO with at least one N–H. Three pairs work: propanoic acid + ammonia → propanamide; ethanoic acid + methanamine → N-methylethanamide; methanoic acid + ethanamine → N-ethylmethanamide.",
        hints:["Amide formula C<i>n</i>H<sub>2<i>n</i>+1</sub>NO: 73 g/mol means 3 carbons in total.", "Share the 3 carbons between the acid and the N-compound.", "Keep at least one H on N: avoid the secondary amine as the N-compound."] }
    ],
    blocks:[{ title:"What the builder shows", html:"<p>The same molar mass can boil anywhere from 3 °C to 221 °C. What matters is the number of N–H bonds and whether there’s a C=O beside the nitrogen.</p>" }]
  },
  part3:{
    slug:"amides", name:"Amides", heading:"Amides everywhere",
    intro:"From single molecules to the big molecules of life and materials: the peptide bond in proteins, a preview of nylon, and the groups in real medicines and foods. Structures only: no procedures.",
    s1:{ title:"Station 1: The peptide bond",
      intro:"Glycine and alanine are amino acids: each has an amine end (H₂N–) and an acid end (–COOH). Press <strong>Join</strong>: the –OH of glycine’s acid and an H of alanine’s amine leave as H₂O, and a –CO–NH– link forms.",
      zoom:"The amide group is <strong>planar</strong>: the C, the O, the N and the atoms bonded to them lie in one plane. Chemists draw it as a resonance pair: C=O with a lone pair on N, and C–O⁻ with C=N⁺. The N’s lone pair is shared with the C=O, so it isn’t free to accept H⁺. That’s why amides are not basic." },
    s2:{ title:"Station 2: A nylon preview",
      intro:"A diacid and a diamine each have <strong>two</strong> reactive ends. Press <strong>Join</strong> again and again: each join makes one amide link and releases one water.",
      banner:"Two reactive ends → a chain. You’ll build these in module 08." },
    s3:{ title:"Station 3: Groups in real molecules",
      intro:"Structure only. Tap each part of the formula to find its functional group.",
      mols:[
        { id:"acet", name:"Acetaminophen", use:"a pain reliever",
          segs:[{ t:"HO–", g:"oh" }, { t:"C₆H₄", g:"ring" }, { t:"–NH–CO–", g:"amide" }, { t:"CH₃", g:"" }],
          done:"Found them all: an amide (–NH–CO–) and a hydroxyl group on a benzene ring." },
        { id:"asp", name:"Aspartame", use:"a sweetener",
          segs:[{ t:"HOOC–", g:"acid" }, { t:"CH₂–CH(", g:"" }, { t:"NH₂", g:"amine" }, { t:")–", g:"" }, { t:"CO–NH", g:"amide", n:"amide (peptide) link (–CO–NH–)" }, { t:"–CH(CH₂", g:"" }, { t:"C₆H₅", g:"ring" }, { t:")–", g:"" }, { t:"COOCH₃", g:"ester" }],
          done:"Found them all: an amine, a carboxylic acid, an amide (peptide) link, an ester and a benzene ring." }],
      groups:{ oh:"hydroxyl group (–OH)", ring:"benzene ring", amide:"amide group (–NH–CO–)", acid:"carboxylic acid (–COOH)", amine:"amine (–NH₂): primary, with a free lone pair", ester:"ester (–COO–CH₃)" },
      backbone:"Carbon backbone: not a functional group." },
    data:{ title:"Check it with data: acetaminophen",
      head:["Property", "Acetaminophen", "What the structure explains"],
      rows:[["State at 25 °C", "solid; melts at about 169 °C", "The amide N–H, the C=O and the O–H hydrogen-bond between molecules, holding them in a solid."],
        ["Cold water (25 °C)", "dissolves only a little: about 14 g/L", "The benzene ring is nonpolar, so it limits mixing with water."],
        ["Hot water", "dissolves noticeably more", "The O–H, N–H and C=O hydrogen-bond with water; heat helps break up the solid."]],
      note:"Data: rounded literature values (course table additions)." },
    quickCheck:{
      title:"Quick check", summary:"Amides everywhere quick check",
      items:[
        { id:"q1", goal:4, prompt:"Glycine + glycine → dipeptide. What else forms?",
          choices:[
            { t:"water", ok:true, fb:"Right. Condensation: one H₂O per amide link." },
            { t:"ammonia", fb:"Condensation: one H₂O per amide link." },
            { t:"nothing", fb:"Condensation: one H₂O per amide link." },
            { t:"CO₂", fb:"Condensation: one H₂O per amide link." }] },
        { id:"q2", goal:6, prompt:"How many amide links in a chain of 5 amino acids?",
          choices:[
            { t:"4", ok:true, fb:"Right. Links join neighbours: 5 units, 4 links." },
            { t:"5", fb:"Links join neighbours: 5 units, 4 links." },
            { t:"10", fb:"Links join neighbours: 5 units, 4 links." },
            { t:"3", fb:"Links join neighbours: 5 units, 4 links." }] },
        { id:"q3", goal:5, prompt:"Which group in acetaminophen is basic?",
          choices:[
            { t:"none", ok:true, fb:"Right. The amide N’s lone pair is tied up with the C=O, and the OH and the ring aren’t bases." },
            { t:"the amide N", fb:"The amide N’s lone pair is tied up with the C=O." },
            { t:"the OH", fb:"The amide N’s lone pair is tied up with the C=O, and an OH on a ring isn’t a base." },
            { t:"the ring", fb:"The amide N’s lone pair is tied up with the C=O, and rings aren’t bases here." }] },
        { id:"q4", goal:5, prompt:"A fishy smell comes from an amine. Lemon juice reduces it. Why?",
          choices:[
            { t:"The acid turns the amine into a non-volatile ammonium salt", ok:true, fb:"Right. The amine accepts H⁺ from the acid; ions don’t evaporate." },
            { t:"Lemon juice is a base", fb:"The amine accepts H⁺ from the acid; ions don’t evaporate." },
            { t:"The acid forms an amide at room temperature", fb:"The amine accepts H⁺ from the acid; ions don’t evaporate." },
            { t:"Lemon juice adds hydrogen bonds", fb:"The amine accepts H⁺ from the acid; ions don’t evaporate." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"classify", type:"custom", title:"Classify and name", summary:"Classify and name", goal:[1, 2],
        instruction:"Ten compounds. Sort each one into its box, then pick its name.",
        how:"Tap a compound, then tap the box it belongs in. When it’s in the right box, pick its name from the chips below the boxes.",
        boxes:[{ id:"p", label:"Primary amine" }, { id:"s", label:"Secondary amine" }, { id:"t", label:"Tertiary amine" }, { id:"a", label:"Amide" }],
        wrongDefault:"Count the carbon groups on the N, and check for a C=O next to it.",
        items:[
          { id:"i1", t:"CH₃CH₂CH₂NH₂", answer:"p", why:"One carbon group (propyl) on the N: primary.",
            wrong:{ a:NOTAMIDE },
            names:[{ t:"propan-1-amine", ok:true, why:"Three-carbon chain, NH₂ on C1." }, { t:"propan-2-amine", why:"The NH₂ is on the end carbon: C1." }, { t:"propanamide", why:"No C=O: -amine, not -amide." }],
            hints:[H1, H2, "Primary amine: one carbon group (propyl) on N. Name: propan-1-amine."] },
          { id:"i2", t:"CH₃CH(NH₂)CH₃", answer:"p", why:"The N has only one carbon on it: primary. The carbon it’s on doesn’t matter.",
            wrong:{ s:"The N has only one carbon on it: primary. The carbon it’s on doesn’t matter.", t:"The N has only one carbon on it: primary.", a:NOTAMIDE },
            names:[{ t:"propan-2-amine", ok:true, why:"NH₂ on the middle carbon, C2." }, { t:"propan-1-amine", why:"The NH₂ is on the middle carbon, C2." }, { t:"N-methylethanamine", why:"Only one carbon group is on N, so there’s no N-prefix." }],
            hints:[H1, H2, "Primary amine: one carbon on N (the middle carbon of the chain). Name: propan-2-amine."] },
          { id:"i3", t:"CH₃NHCH₂CH₂CH₃", answer:"s", why:"Two carbon groups (methyl and propyl) on the N: secondary.",
            wrong:{ a:NOTAMIDE },
            names:[{ t:"N-methylpropan-1-amine", ok:true, why:"Propyl is the parent; the methyl on N is an N-prefix." }, { t:"butan-1-amine", why:M5 }, { t:"N-propylmethanamine", why:"The parent is the longest carbon group on N: propyl." }],
            hints:[H1, H2, "Secondary amine: methyl and propyl on N. Name: N-methylpropan-1-amine."] },
          { id:"i4", t:"(CH₃CH₂)₂NH", answer:"s", why:"Two ethyl groups on the N: secondary.",
            wrong:{ a:NOTAMIDE },
            names:[{ t:"N-ethylethanamine", ok:true, why:"One ethyl is the parent; the other is an N-prefix." }, { t:"butan-1-amine", why:"The N isn’t part of a chain: each ethyl is on the N. " + M5 }, { t:"diethanamine", why:"Name one ethyl as the parent and the other as an N-prefix." }],
            hints:[H1, H2, "Secondary amine: two ethyls on N. Name: N-ethylethanamine."] },
          { id:"i5", t:"(CH₃)₂NCH₂CH₃", answer:"t", why:"Three carbon groups (two methyls and an ethyl) on the N: tertiary.",
            wrong:{ a:NOTAMIDE },
            names:[{ t:"N,N-dimethylethanamine", ok:true, why:"Ethyl is the parent; both methyls on N are N-prefixes." }, { t:"N-methylpropan-1-amine", why:"Count the groups on N: there are three, and none is a propyl." }, { t:"N,N-dimethylmethanamine", why:"The longest group on N is ethyl, so the parent is ethanamine." }],
            hints:[H1, H2, "Tertiary amine: two methyls and an ethyl on N. Name: N,N-dimethylethanamine."] },
          { id:"i6", t:"CH₃CH₂CONH₂", answer:"a", why:"A C=O is bonded to the N: an amide.",
            wrong:{ p:AMIDE, s:AMIDE, t:AMIDE },
            names:[{ t:"propanamide", ok:true, why:"Three carbons including the C=O carbon, -amide." }, { t:"propan-1-amine", why:"There’s a C=O on the N’s carbon: -amide." }, { t:"ethanamide", why:"Count the C=O carbon: three carbons in all." }],
            hints:[H1, H2, "Amide: C=O next to N. Name: propanamide."] },
          { id:"i7", t:"CH₃CONHCH₂CH₃", answer:"a", why:"A C=O is bonded to the N: an amide.",
            wrong:{ p:AMIDE, s:AMIDE, t:AMIDE },
            names:[{ t:"N-ethylethanamide", ok:true, why:"Ethanoyl parent (with the C=O); the ethyl on N is an N-prefix." }, { t:"butanamide", why:"The N-ethyl carbons aren’t in the chain." }, { t:"N-ethylethanamine", why:"There’s a C=O next to N: -amide." }],
            hints:[H1, H2, "Amide: C=O next to N, ethyl on N. Name: N-ethylethanamide."] },
          { id:"i8", t:"HCON(CH₃)₂", answer:"a", why:"A C=O is bonded to the N: an amide.",
            wrong:{ p:AMIDE, s:AMIDE, t:AMIDE },
            names:[{ t:"N,N-dimethylmethanamide", ok:true, why:"Methanoyl parent (HCO–); both methyls on N are N-prefixes." }, { t:"propanamide", why:"The methyls on N are N-prefixes, not part of the chain." }, { t:"N-methylethanamide", why:"Both methyls are on N: N,N-dimethyl, and the parent has only the C=O carbon." }],
            hints:[H1, H2, "Amide: HCO– on N with two methyls. Name: N,N-dimethylmethanamide."] },
          { id:"i9", t:"CH₃CH₂CH₂CH₂NH₂", answer:"p", why:"One carbon group (butyl) on the N: primary.",
            wrong:{ a:NOTAMIDE },
            names:[{ t:"butan-1-amine", ok:true, why:"Four-carbon chain, NH₂ on C1." }, { t:"butanamide", why:"No C=O: -amine." }, { t:"butan-2-amine", why:"The NH₂ is on the end carbon: C1." }],
            hints:[H1, H2, "Primary amine: one carbon group on N. Name: butan-1-amine."] },
          { id:"i10", t:"C₆H₅NH₂", answer:"p", why:"One carbon group (the benzene ring) on the N: primary.",
            wrong:{ a:NOTAMIDE },
            names:[{ t:"aniline (phenylamine; benzenamine)", ok:true, why:"An NH₂ on a benzene ring." }, { t:"benzamide", why:"No C=O: it’s an amine." }, { t:"cyclohexanamine", why:"A benzene ring (C₆H₅), not a cyclohexane ring (C₆H₁₁)." }],
            hints:[H1, H2, "Primary amine: one carbon group (a benzene ring) on N. Name: aniline (phenylamine; benzenamine)."] }
        ] },
      { id:"puzzles", type:"custom", title:"Property puzzles", summary:"Property puzzles", star:true, goal:[3, 5],
        instruction:"Six items: order four compounds or choose one of four. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"To order, tap the compounds from lowest to highest boiling point. To choose, tap an answer. Then press Check.",
        items:[
          { id:"r1", kind:"order", goal:3, prompt:"Order by boiling point, lowest first: butane, propan-1-amine, propan-1-ol, ethanamide.",
            tiles:["propan-1-ol", "ethanamide", "butane", "propan-1-amine"], answer:[2, 3, 0, 1],
            wrong:[{ before:[0, 3], fb:"Amine above alcohol: " + M3 }],
            general:"Rank by the forces between molecules: London only, then N–H hydrogen bonds, then stronger O–H hydrogen bonds, then an amide’s N–H and very polar C=O.",
            why:"butane (London forces only) < propan-1-amine (N–H) < propan-1-ol (O–H) < ethanamide (two N–H and a very polar C=O).",
            hints:["Which has no hydrogen bonding at all?", "N–H hydrogen bonds are weaker than O–H ones; amides boil highest.", "butane < propan-1-amine < propan-1-ol < ethanamide."] },
          { id:"r2", kind:"pick", goal:3, prompt:"Which dissolves best in water: N,N-dimethylmethanamine, hexane, octan-1-amine, decane?",
            options:[
              { t:"N,N-dimethylmethanamine", ok:true, why:"Small amines accept hydrogen bonds from water through the lone pair, even with no N–H." },
              { t:"octan-1-amine", why:"Small amines accept hydrogen bonds from water through the lone pair, even with no N–H. Octan-1-amine’s long nonpolar chain outweighs its NH₂." },
              { t:"hexane", why:"Nonpolar: it can’t hydrogen-bond with water." },
              { t:"decane", why:"Nonpolar: it can’t hydrogen-bond with water." }],
            hints:["Which molecules can hydrogen-bond with water?", "Water’s O–H can bond to an N lone pair, and a short chain helps.", "N,N-dimethylmethanamine."] },
          { id:"r3", kind:"pick", star:true, goal:3, prompt:"<strong>Investigation:</strong> A student wants to test whether N–H bonds raise boiling points. Which set is a fair test?",
            options:[
              { t:"propan-1-amine, N-methylethanamine, N,N-dimethylmethanamine (all 59 g/mol)", ok:true, why:"Same molar mass, so London forces are controlled; only the number of N–H bonds (2, 1, 0) changes." },
              { t:"methanamine (31 g/mol), N-methylmethanamine (45 g/mol), N,N-dimethylethanamine (73 g/mol)", why:"Molar mass changes London forces too; keep it the same." },
              { t:"propan-1-amine, propan-1-ol, butane (similar masses)", why:"That changes the kind of atom (N, O or none), not just the number of N–H bonds." },
              { t:"ethanamine and ethanamide", why:"The C=O is a second change, and the masses differ (45 and 59 g/mol)." }],
            hints:["What else affects boiling point besides hydrogen bonding?", "Molar mass changes London forces: keep it fixed.", "Three C₃H₉N isomers with 2, 1 and 0 N–H bonds."] },
          { id:"r4", kind:"order", star:true, goal:3, prompt:"Order by boiling point, lowest first: three amides of 73 g/mol, N,N-dimethylmethanamide, N-methylethanamide and propanamide.",
            tiles:["propanamide", "N,N-dimethylmethanamide", "N-methylethanamide"], answer:[1, 2, 0],
            general:"Fewer N–H bonds, fewer hydrogen bonds per molecule.",
            why:"N,N-dimethylmethanamide (153 °C, no N–H) < N-methylethanamide (206 °C, one N–H) < propanamide (213 °C, two N–H).",
            hints:["Count the N–H bonds in each amide.", "0, 1 and 2 N–H bonds.", "N,N-dimethylmethanamide < N-methylethanamide < propanamide."] },
          { id:"r5", kind:"pick", star:true, goal:3, prompt:"Two bottles are labelled only ‘C₃H₉N’. One boils at 3 °C, the other at 48 °C. Which is which, and could a third bottle with C₃H₉N boil at about 33–37 °C?",
            options:[
              { t:"3 °C: N,N-dimethylmethanamine; 48 °C: propan-1-amine. Yes: N-methylethanamine (36 °C), or propan-2-amine (32 °C)", ok:true, why:"The tertiary amine has no N–H; propan-1-amine has two. The secondary amine, and the branched primary amine, boil in between." },
              { t:"3 °C: propan-1-amine; 48 °C: N,N-dimethylmethanamine. No third isomer", why:"Isomers differ in N–H count and shape. The tertiary amine, with no N–H, boils lowest." },
              { t:"3 °C: N,N-dimethylmethanamine; 48 °C: propan-1-amine. No: there are only two C₃H₉N isomers", why:"Isomers differ in N–H count and shape. C₃H₉N has four amine isomers: two primary, one secondary, one tertiary." },
              { t:"Either bottle could be either compound: isomers boil at the same temperature", why:"Isomers differ in N–H count and shape." }],
            hints:["C₃H₉N isomers: primary, secondary, tertiary.", "Tertiary can’t hydrogen-bond; primary has two N–H.", "3 °C tertiary; 48 °C primary; the secondary is in between."] },
          { id:"r6", kind:"pick", star:true, goal:5, fixedOrder:true, prompt:"Which mixture’s smell fades most: an amine spill wiped with (a) water, (b) vinegar, (c) baking-soda solution, (d) oil?",
            options:[
              { t:"(a) water", why:"Some amine dissolves, but no salt forms, so the rest still evaporates." },
              { t:"(b) vinegar", ok:true, why:"Ethanoic acid protonates the amine to an ammonium salt; ions don’t evaporate." },
              { t:"(c) baking-soda solution", why:"Baking soda is basic and can’t." },
              { t:"(d) oil", why:"The amine stays a neutral molecule and still evaporates." }],
            hints:["Which household liquid is an acid?", "An amine + acid → ammonium salt.", "Vinegar."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Cameron", how:"",
        instruction:"Cameron made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Name CH₃CH₂CONHCH₃.",
            steps:["It has C=O next to N, so it’s an amide.", "The longest chain through N has 4 carbons, so the parent is butanamide.", "There are no other groups.", "Name: butanamide."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2. The mistake is earlier.", "The mistake is earlier."],
            fixes:[
              { t:"The parent chain contains the C=O carbon (3 carbons: propanamide); the CH₃ on N is a prefix: N-methylpropanamide.", ok:true, why:M5 },
              { t:"Methyl propanamide (no N).", why:"The N- shows where the methyl sits." },
              { t:"N-propylmethanamide.", why:"The C=O is on the 3-carbon side." },
              { t:"Step 2 is correct.", why:"The N’s carbons aren’t part of the parent chain. " + M5 }],
            hints:["Which carbons are attached to the C=O carbon’s side?", "Three: the propanoyl part.", "N-methylpropanamide."] },
          { id:"e2", goal:4, task:"Write the condensation of ethanoic acid with ethanamine.",
            steps:["CH₃COOH + CH₃CH₂NH₂ →", "The acid’s –OH and one H from the amine’s NH₂ leave.", "They form H₂O.", "The product is CH₃COOCH₂CH₃.", "So the products are ethyl ethanoate and water."],
            answer:3,
            stepFb:["Correct reactants.", "Step 2 is correct.", "Step 3 is correct.", "", "Follows step 4. The mistake is earlier."],
            fixes:[
              { t:"The new bond is C–N: CH₃CONHCH₂CH₃, N-ethylethanamide.", ok:true, why:"The amine’s N bonds to the acid’s carbon, so an amide forms. " + M7 },
              { t:"CH₃CH₂NHCH₃.", why:"The C=O must stay." },
              { t:"CH₃CONH₂ + CH₃CH₂OH.", why:"No alcohol forms; the ethyl stays on N." },
              { t:"Step 4 is correct.", why:"An ester would need an alcohol, not an amine. " + M7 }],
            hints:["Which atom bonds to the acid’s carbon?", "The amine’s N.", "CH₃CONHCH₂CH₃."] },
          { id:"e3", goal:5, task:"Predict which solution is more basic: 0.1 mol/L methanamine or 0.1 mol/L ethanamide.",
            steps:["Both compounds contain a nitrogen with a lone pair.", "A lone pair that’s free can accept H⁺.", "Both lone pairs are free, so both are bases of similar strength.", "The solutions will have about the same pH."],
            answer:2,
            stepFb:["True as written.", "Correct.", "", "Follows step 3."],
            fixes:[
              { t:"In ethanamide the lone pair is drawn toward the C=O, so it isn’t free; methanamine is basic and ethanamide is about neutral.", ok:true, why:M4 },
              { t:"Ethanamide is more basic because it’s heavier.", why:"Mass doesn’t make a base: a free lone pair does, and ethanamide’s isn’t free." },
              { t:"Neither is basic; only OH⁻ compounds are bases.", why:"That’s Arrhenius thinking. A Brønsted–Lowry base accepts H⁺, and methanamine’s free lone pair does." },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["What is next to the N in an amide?", "A C=O, which pulls electron density.", "Methanamine is the base."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which result in the builder surprised you most: the tertiary amine boiling at 3 °C, or ethanamide boiling at 221 °C? Why?" },
      { id:"j2", q:"In your own words, explain why amines are classified by the nitrogen, not by the carbon." },
      { id:"j3", q:"Explain to a friend how to tell an amine from an amide in a big molecule like aspartame." },
      { id:"j4", q:"Which part of naming amides still feels shaky? What will you practise?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which is a secondary amine?", options:[
          { t:"CH₃CH₂NHCH₃", ok:true, why:"Two carbon groups on N." },
          { t:"CH₃CH₂CH₂NH₂", why:"One carbon group on N: primary." },
          { t:"(CH₃)₃N", why:"Three carbon groups: tertiary." },
          { t:"CH₃CONHCH₃", why:"C=O next to N: an amide." }] },
        b:{ prompt:"Which is a tertiary amine?", options:[
          { t:"(CH₃)₂NCH₂CH₃", ok:true, why:"Three carbon groups on N." },
          { t:"CH₃NHCH₂CH₃", why:"Two: secondary." },
          { t:"(CH₃)₃CNH₂", why:"One carbon on N: primary, even though that carbon is tertiary." },
          { t:"CH₃CON(CH₃)₂", why:"An amide, not an amine." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What is the IUPAC name of CH₃CH₂CH₂NH₂?", options:[
          { t:"propan-1-amine", ok:true, why:"Three-carbon chain, NH₂ on C1." },
          { t:"propanamide", why:"No C=O: amine, not amide." },
          { t:"N-methylethanamine", why:"That’s CH₃CH₂NHCH₃." },
          { t:"propan-2-amine", why:"The NH₂ is on the end carbon." }] },
        b:{ prompt:"What is the IUPAC name of CH₃CONHCH₃?", options:[
          { t:"N-methylethanamide", ok:true, why:"Ethanoyl parent; methyl on N." },
          { t:"N-methylethanamine", why:"There’s a C=O: amide." },
          { t:"propanamide", why:"The N’s methyl isn’t part of the chain." },
          { t:"methyl ethanamide", why:"The locant N- is needed to show the methyl is on nitrogen." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Ethanoic acid condenses with methanamine. What are the products?", options:[
          { t:"N-methylethanamide and water", ok:true, why:"C–N bond forms; H₂O leaves." },
          { t:"methyl ethanoate and ammonia", why:"That would need methanol." },
          { t:"ethanamide and methanol", why:"The methyl stays on the N." },
          { t:"N-methylethanamine and oxygen", why:"The C=O stays; no O₂ forms." }] },
        b:{ prompt:"Propanoic acid condenses with ammonia. What are the products?", options:[
          { t:"propanamide and water", ok:true, why:"CH₃CH₂CONH₂ + H₂O." },
          { t:"propan-1-amine and water", why:"The C=O stays: an amide." },
          { t:"ethyl methanoate and ammonia", why:M7 },
          { t:"propanamide and hydrogen", why:"The small molecule is H₂O." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Rank from lowest to highest boiling point: propan-1-amine, ethanamide, N,N-dimethylmethanamine, N-methylethanamine (all 59 g/mol).", options:[
          { t:"N,N-dimethylmethanamine < N-methylethanamine < propan-1-amine < ethanamide", ok:true, why:"0, 1, 2 N–H, then the very polar amide." },
          { t:"propan-1-amine < N-methylethanamine < N,N-dimethylmethanamine < ethanamide", why:"More carbon groups don’t add London forces at equal mass; they remove N–H." },
          { t:"N,N-dimethylmethanamine < ethanamide < N-methylethanamine < propan-1-amine", why:"Amides boil far higher than amines." },
          { t:"They’re all about equal", why:"Same mass, very different forces." }] },
        b:{ prompt:"Rank from lowest to highest boiling point: ethanol, N-methylmethanamine, methanamide, ethanamine (about 45 g/mol).", options:[
          { t:"N-methylmethanamine < ethanamine < ethanol < methanamide", ok:true, why:"One N–H, then two N–H, then the stronger O–H, then the amide’s N–H and very polar C=O." },
          { t:"ethanamine < N-methylmethanamine < ethanol < methanamide", why:"Fewer N–H bonds mean fewer hydrogen bonds: N-methylmethanamine (one N–H) boils below ethanamine (two)." },
          { t:"N-methylmethanamine < ethanol < ethanamine < methanamide", why:"O–H beats N–H." },
          { t:"methanamide < ethanol < ethanamine < N-methylmethanamine", why:"Reversed." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"Fish smells fishy because of N,N-dimethylmethanamine. Why does squeezing lemon on fish reduce the smell?", options:[
          { t:"Citric acid gives H⁺ to the amine, forming an ammonium salt, which is ionic and doesn’t evaporate", ok:true, why:"The amine’s free lone pair accepts H⁺; the ions stay put." },
          { t:"Lemon juice is a base that neutralizes the amine", why:"Lemon juice is acidic." },
          { t:"The acid and amine form an amide at room temperature", why:"A tertiary amine has no N–H to lose, and amides need heating." },
          { t:"The lemon adds hydrogen bonds that trap the smell", why:"The key change is a proton transfer." }] },
        b:{ prompt:"Which 0.10 mol/L solution has the higher pH?", options:[
          { t:"Methanamine, because its free lone pair accepts H⁺ from water", ok:true, why:"Taking H⁺ from water leaves OH⁻, so the pH rises above 7." },
          { t:"Methanamide, because it contains N", why:M4 },
          { t:"Both are 7: neither has OH⁻", why:"Methanamine makes OH⁻ by taking H⁺ from water." },
          { t:"Both are acidic", why:"Amines are bases." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"N-ethylpropanamide is hydrolysed. What are the products?", options:[
          { t:"propanoic acid and ethanamine", ok:true, why:"C–N breaks: the C=O side becomes the acid." },
          { t:"propan-1-amine and ethanoic acid", why:"The C=O is on the 3-carbon side. " + M6 },
          { t:"ethyl propanoate and ammonia", why:"Hydrolysis adds water; it doesn’t make an ester." },
          { t:"propan-1-ol and ethanamide", why:"The C=O side becomes a carboxylic acid." }] },
        b:{ prompt:"N-methylbutanamide is hydrolysed. What are the products?", options:[
          { t:"butanoic acid and methanamine", ok:true, why:"C–N breaks: the 4-carbon C=O side becomes butanoic acid; the N side becomes methanamine." },
          { t:"butan-1-amine and methanoic acid", why:M6 },
          { t:"methyl butanoate and ammonia", why:"Hydrolysis adds water; it doesn’t make an ester." },
          { t:"butan-1-ol and methanamide", why:"The C=O side becomes a carboxylic acid." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Propan-1-amine (48 °C) boils higher than N,N-dimethylmethanamine (3 °C), though both are 59 g/mol. Which is the best explanation?", options:[
          { t:"“Propan-1-amine has N–H bonds, so its molecules hydrogen-bond to each other; the tertiary amine has no N–H, so only weaker dipole and London forces act.”", ok:true, why:"Same mass: the N–H, and the hydrogen bonds it allows, make the difference." },
          { t:"“The tertiary amine is branched, so it has more London forces.”", why:"Branching lowers London forces, and it’s not the main effect here." },
          { t:"“Propan-1-amine has more electrons.”", why:"Same formula, same electrons." },
          { t:"“The tertiary amine has no lone pair.”", why:"It does; it lacks an N–H." }] },
        b:{ prompt:"Ethanol (78 °C) boils higher than ethanamine (17 °C). Which is the best explanation?", options:[
          { t:"“O (3.44) is more electronegative than N (3.04), so ethanol’s O–H bonds are more polar and its hydrogen bonds are stronger.”", ok:true, why:"Both hydrogen-bond; the more polar O–H makes stronger hydrogen bonds." },
          { t:"“Ethanol is much heavier.”", why:"46 vs 45 g/mol." },
          { t:"“Ethanamine can’t hydrogen-bond.”", why:"It has N–H; its hydrogen bonds are weaker." },
          { t:"“N has two lone pairs, which repel.”", why:"N has one lone pair in an amine." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"Acetaminophen is HO–C₆H₄–NH–CO–CH₃. Which description of its functional groups is correct?", options:[
          { t:"An amide (–NH–CO–) and a hydroxyl group on a benzene ring", ok:true, why:"The N bonded to the C=O makes an amide; the OH sits on the ring." },
          { t:"An amine and a ketone", why:"The N and C=O are bonded: together they’re an amide." },
          { t:"An ester and an amine", why:"No –COO–." },
          { t:"A carboxylic acid and an amine", why:"No –COOH." }] },
        b:{ prompt:"Which describes the link between two amino acids in a dipeptide?", options:[
          { t:"An amide (peptide) bond made by condensation, releasing one water", ok:true, why:"The acid end of one amino acid and the amine end of the next join; one H₂O leaves." },
          { t:"An ester bond", why:"N, not O, bonds to the C=O." },
          { t:"An amine bond made by addition", why:"Water is lost: condensation." },
          { t:"An ionic bond between –NH₃⁺ and –COO⁻", why:"The link is covalent." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A small amine spills in a lab storeroom, leaving a fishy smell. Which household liquid would best reduce the smell, and why?", options:[
          { t:"Vinegar: ethanoic acid converts the amine to a non-volatile ammonium salt", ok:true, why:"The amine accepts H⁺ from the acid; ions don’t evaporate." },
          { t:"Baking-soda solution: it neutralizes the amine", why:"Baking soda is a base too." },
          { t:"Salt water: the ions trap the smell", why:"No proton transfer happens." },
          { t:"Cooking oil: it dissolves the amine", why:"The amine would still evaporate." }] },
        b:{ prompt:"An amine-based cleaning residue makes a surface slightly basic. Which rinse best neutralizes it, and why?", options:[
          { t:"Dilute ethanoic acid: it donates H⁺ to the amine, forming an ammonium salt", ok:true, why:"An acid neutralizes a base: the amine is protonated." },
          { t:"Dilute ammonia: it dilutes the residue", why:"Ammonia is also basic." },
          { t:"Ethanol: it hydrogen-bonds the amine", why:"No neutralization." },
          { t:"Hot water only: heat breaks the amine", why:"No proton transfer." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"Aspartame, a sweetener, is HOOC–CH₂–CH(NH₂)–CO–NH–CH(CH₂C₆H₅)–COOCH₃. Which list of groups is complete and correct?", options:[
          { t:"carboxylic acid, amine, amide, ester, benzene ring", ok:true, why:"–COOH, –NH₂, –CO–NH–, –COOCH₃ and C₆H₅: five groups." },
          { t:"carboxylic acid, amine, ketone, ether, benzene ring", why:"–CO–NH– is an amide; –COOCH₃ is an ester." },
          { t:"two carboxylic acids, amine, amide", why:"–COOCH₃ has no O–H: it’s an ester." },
          { t:"amine, amide, aldehyde, benzene ring", why:"There’s no –CHO." }] },
        b:{ prompt:"A local anaesthetic contains an amide group and a separate tertiary amine group (–N(CH₂CH₃)₂). Which part lets it accept H⁺?", options:[
          { t:"The tertiary amine nitrogen", ok:true, why:"Its lone pair is free." },
          { t:"The amide nitrogen", why:M4 },
          { t:"The amide C=O oxygen only", why:"The free amine lone pair is the basic site." },
          { t:"The benzene ring", why:"Rings aren’t bases here." }] } }
    ]
  },
  task:{
    title:"Design an amide", summary:"Design an amide",
    statement:"<p>Choose a carboxylic acid and an amine (or ammonia) to make an amide that meets every condition. Then name it. Can you find all the answers?</p><ol class=\"am-conds\"><li>Its molecules can hydrogen-bond to each other.</li><li>It has exactly 4 carbon atoms.</li><li>Its nitrogen carries at least one carbon group.</li><li>Its name is entered correctly.</li></ol>",
    checks:["Can hydrogen-bond to itself", "Exactly 4 carbons", "A carbon group on N", "Named correctly"],
    tips:["A secondary amine leaves no H on the amide’s N.", "Add the carbons of both reactants.", "Ammonia gives an unsubstituted amide (–CONH₂).", "Parent from the acid; N-prefix from the amine’s carbons."],
    explainPrompt:"Explain how you chose the two reactants and why your amide can hydrogen-bond.",
    vocab:"Use the words condensation, amide, N–H bond and hydrogen bonding.",
    more:"There are three answers. Can you find them all?",
    after3:"You’ve found all three. Each answer splits 4 carbons between the acid side and the N side. Butanoic acid + ammonia gives butanamide: 4 carbons and N–H, but no carbon on N."
  },
  cards:[
    ["Amine", "Ammonia with H’s replaced by carbon groups: R–NH₂, R₂NH, R₃N."],
    ["Primary / secondary / tertiary amine", "1, 2 or 3 carbon groups on the <strong>nitrogen</strong>."],
    ["Amide", "R–CO–NR′R″: a C=O bonded to N."],
    ["Naming amines", "Parent + -amine (propan-1-amine); extra N-groups as N- prefixes (N-methylethanamine)."],
    ["Naming amides", "Parent from the acid + -amide (ethanamide); N-groups as N- prefixes (N,N-dimethylethanamide)."],
    ["Amines as bases", "The N lone pair accepts H⁺: RNH₂ + H₂O ⇌ RNH₃⁺ + OH⁻."],
    ["Amides aren’t basic", "The N lone pair is pulled toward the C=O."],
    ["Hydrogen bonding in amines", "Needs an N–H: primary and secondary only."],
    ["Amine vs alcohol bp", "Amines lower: N–H is less polar than O–H."],
    ["Amide formation", "Acid + amine → amide + water (condensation)."],
    ["Amide hydrolysis", "Amide + water → acid + amine (C–N bond breaks)."],
    ["Peptide bond", "The amide link between amino acids in proteins."]
  ]
};
