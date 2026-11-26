// SCH4U 08 Condensation Polymers. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/08-condensation-polymers.md
// The chain stage, beaker, compare ledger, hydrolysis stations and task preview are drawn by app.js. Monomer masses in app.js
// are computed from MV.chem.data.M and rounded (plan §6 risk 4); the "Use these values" text below is the plan's.

// Misconception core sentences (plan §3), reused where the plan points to them.
const M1 = "Water forms at each <strong>link</strong>. `m` monomers make `m - 1` links.";
const M2 = "At each link the acid loses –OH and the partner loses –H: they leave as H₂O.";
const M3 = "One reactive group means one link; the chain can’t keep growing.";
const M4 = "Count the C=O carbons too: –CO–(CH₂)₆–CO– is 8 carbons, octanedioic acid.";
const M5 = "Amino acids and glucose have no C=C to open; they link by condensation, releasing water.";
const M6 = "Hydrolysis <strong>adds</strong> water across each ester or amide link, giving back the original monomers.";
const USE = "hexanedioic acid 146 · benzene-1,4-dicarboxylic acid 166 · butanedioic acid 118 · ethane-1,2-diol 62 · butane-1,4-diol 90 · hexane-1,6-diamine 116 · benzene-1,4-diamine 108 · glycine 75 · glucose 180 · water 18 g/mol";
const SH1 = "Does each monomer have a C=C, or two functional groups?", SH2 = "Which groups meet at the link?";

// Activity 1 (plan §4 Practice): [tile, box, reason]
const SORT = [
  ["Benzene-1,4-dicarboxylic acid + ethane-1,2-diol", "pe", "A diacid and a diol: their –COOH and –OH groups meet, making ester links. This is PET."],
  ["Hexanedioic acid + hexane-1,6-diamine", "pa", "A diacid and a diamine: –COOH meets –NH₂, making amide links. This is nylon-6,6."],
  ["Glucose units in cellulose", "ps", "Glucose –OH groups link through an O (C–O–C), releasing water."],
  ["Chloroethene", "ad", "One C=C and no other reactive group: its C=C opens. This is PVC."],
  ["Amino acids in a protein", "pa", "The –NH₂ of one amino acid meets the –COOH of the next: amide (peptide) links."],
  ["Lactic acid (one –OH and one –COOH)", "pe", "The –OH of one molecule meets the –COOH of the next: ester links. This is PLA."],
  ["Benzene-1,4-dicarboxylic acid + benzene-1,4-diamine (Kevlar)", "pa", "A diacid and a diamine: amide links."],
  ["Propene", "ad", "Its C=C opens and the molecules join with nothing lost: polypropene."],
  ["Glucose units in starch", "ps", "Glucose –OH groups link through an O (C–O–C), releasing water."],
  ["Butanedioic acid + butane-1,4-diol", "pe", "A diacid and a diol: ester links."]
];
const BOXN = { pe:"Polyester", pa:"Polyamide", ps:"Polysaccharide", ad:"Addition polymer" };
const SORT_WRONG = { i5:{ ad:M5 }, i6:{ pa:"Lactic acid has no N; –OH + –COOH make ester links." }, i4:{ pe:"Chloroethene has a C=C and no –COOH: addition." } };

export default {
  id:"08-condensation-polymers",
  kind:"topic",
  title:"Condensation polymers",
  topic:"Condensation Polymers",
  readyTopic:"condensation polymers",
  hero:{
    eq:'<span class="cp-eq"><span class="nw"><em>n</em> HOOC–R–COOH</span> <span class="nw">+ <em>n</em> H<sub>2</sub>N–R′–NH<sub>2</sub></span> <span class="nw">→ –[CO–R–CO–NH–R′–NH]–<sub><em>n</em></sub></span> <span class="nw">+ (2<em>n</em> − 1) H<sub>2</sub>O</span></span>', eqSize:"sm",
    eqLabel:"n H O O C, R, C O O H plus n H 2 N, R prime, N H 2 gives the chain, bracket C O, R, C O, N H, R prime, N H, close bracket, n times, plus 2 n minus 1 H 2 O",
    headline:"Two hands each, and a water at every handshake",
    text:"Give each monomer <strong>two</strong> reactive ends and it can link on both sides. Every link (an <strong>ester</strong> or an <strong>amide</strong>) releases a <strong>water molecule</strong>. That’s how polyester fleece, nylon rope, Kevlar vests, proteins and even cellulose are built.",
    fig:{ html:'<div class="cp-hx"><div class="cp-hx-box" id="cp-hx-box"><svg class="cp-svg" id="cp-hx-svg" role="img" aria-label="A diacid with two –COOH ends and a diamine with two –NH₂ ends drift together. At the touching ends, –OH and –H glow and leave together as a water molecule, and a new C–N bond forms. More monomers dock, one water leaving at each new link. After four links: four waters released, and a bracket marks one repeating unit."></svg></div><div class="cp-hx-row"><p class="cp-hx-cap" id="cp-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="cp-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can identify bifunctional monomers that form condensation polymers and the link each pair makes (ester, amide, glycosidic).",
    "I can draw the repeating unit of a polyester or polyamide from its monomers, and work back from a repeating unit to its monomers.",
    "I can count the water released and calculate the molar mass of a condensation chain or repeating unit.",
    "I can explain the difference between addition and condensation polymerization.",
    "I can predict the effect of monofunctional and trifunctional monomers on chain growth.",
    "I can explain hydrolysis of condensation polymers and evaluate biodegradability and recycling."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Esterification", goal:1,
          prompt:"Ethanoic acid + ethanol → ethyl ethanoate + ?",
          options:[
            { t:"Water", ok:true, why:"Condensation releases H₂O." },
            { t:"Hydrogen", why:"No H₂ forms." },
            { t:"Ethene", why:"No carbon compound is released." },
            { t:"Nothing", why:"A small molecule always leaves in condensation." }],
          hints:["What does condensation release?", "–OH from the acid, H from the alcohol.", "Water."] },
        { id:"w2", skill:"Esterification", goal:2,
          prompt:"Which link forms between an acid and an alcohol?",
          options:[
            { t:"–COO– (ester)", ok:true, why:"The acid keeps its C=O, and the alcohol’s O bonds to the C=O carbon: an ester link, –COO–." },
            { t:"–CO–NH– (amide)", why:"That needs an amine." },
            { t:"–O– (ether)", why:"The C=O stays: ester." },
            { t:"C=C", why:"No double bond forms." }],
          hints:["The acid keeps its C=O.", "The alcohol’s O bonds to the C=O carbon.", "Ester."] },
        { id:"w3", skill:"Amide formation", goal:1,
          prompt:"Which pair condenses to form an amide?",
          options:[
            { t:"Propanoic acid + methanamine", ok:true, why:"An acid and an amine condense: the C=O carbon bonds to the N, and water leaves." },
            { t:"Propanoic acid + methanol", why:"That gives an ester." },
            { t:"Propan-1-ol + methanamine", why:"No acid." },
            { t:"Propene + ammonia", why:"No C=O to form the amide." }],
          hints:["Amides need C=O and N.", "An acid and an amine.", "Propanoic acid + methanamine."] },
        { id:"w4", skill:"Repeating units", goal:2,
          prompt:"In an addition polymer, how many backbone carbons does one repeating unit from propene have?",
          options:[
            { t:"2", ok:true, why:"The C=C carbons." },
            { t:"3", why:"The CH₃ is a side group." },
            { t:"1", why:"Both C=C carbons join." },
            { t:"6", why:"That’s three units." }],
          hints:["Which carbons had the double bond?", "Two of them.", "2."] },
        { id:"w5", skill:"Molar mass", goal:3,
          prompt:"Use C = 12, H = 1, O = 16. What is the molar mass of ethane-1,2-diol, HOCH₂CH₂OH?",
          options:[
            { t:"62 g/mol", ok:true, why:"C₂H₆O₂: 24 + 6 + 32." },
            { t:"60 g/mol", why:"Count all six H." },
            { t:"46 g/mol", why:"That’s ethanol." },
            { t:"78 g/mol", why:"Only two O." }],
          hints:["Write the formula.", "C₂H₆O₂.", "62."] },
        { id:"w6", skill:"Molar mass", goal:3,
          prompt:"Two molecules of masses 146 and 116 g/mol join, releasing one water (18). Mass of the product?",
          options:[
            { t:"244 g/mol", ok:true, why:"146 + 116 − 18." },
            { t:"262 g/mol", why:M2 + " Subtract its 18 g/mol." },
            { t:"226 g/mol", why:"Only one link here." },
            { t:"280 g/mol", why:"Water leaves." }],
          hints:["Add the two masses.", "262 total.", "Minus 18: 244."] }
      ],
      refreshers:{
        "Esterification":"Acid + alcohol → ester + water; the link is –COO–.",
        "Amide formation":"Acid + amine → amide + water; the link is –CO–NH–.",
        "Repeating units":"The smallest piece that repeats along the chain.",
        "Molar mass":"Add atomic masses; subtract 18 for each water released."
      }
    }
  },
  explore:{
    heading:"Condensation chain builder",
    intro:"Choose two monomers, link them, and track every water molecule that leaves.",
    how:"Tap a <strong>Monomer A</strong> and a <strong>Monomer B</strong>, then press <strong>Link</strong> to add one molecule to the chain end, or set the length with the slider. <strong>Compare</strong> puts an addition chain of the same length beside yours; <strong>Cap and cross-link</strong> adds a one-ended cap or a three-ended branch point.",
    use:USE,
    modes:[{ id:"build", t:"Build" }, { id:"compare", t:"Compare" }, { id:"cap", t:"Cap and cross-link" }],
    predictions:[
      { id:"p1", prompt:"Build mode: hexanedioic acid + hexane-1,6-diamine, length 2. What forms besides the dimer?",
        options:[{ t:"one water molecule", ok:true }, { t:"two water molecules" }, { t:"ammonia" }, { t:"nothing" }],
        explain:"One link, one water." },
      { id:"p2", prompt:"Length 10. How many water molecules have been released?",
        options:[{ t:"9", ok:true }, { t:"10" }, { t:"5" }, { t:"20" }],
        explain:"Ten molecules in a row have nine links between them." },
      { id:"p3", prompt:"Cap and cross-link mode: add ethanoic acid to the amine end. What happens to that end?",
        options:[{ t:"it can’t grow any further", ok:true }, { t:"it grows faster" }, { t:"it makes a branch" }, { t:"nothing changes" }],
        explain:"Ethanoic acid has one –COOH; after it links, there’s no free group left on that end." },
      { id:"p4", prompt:"Compare mode, 8 monomers each. Which chain’s mass equals the total mass of its monomers?",
        options:[{ t:"the addition chain", ok:true }, { t:"the condensation chain" }, { t:"both" }, { t:"neither" }],
        explain:"Only condensation loses water." }
    ],
    chalIntro:"Use the chain builder to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Make a polyamide.",
        why:"Amide links (–CO–NH–) form when a diacid meets a diamine, or when amino acids join.",
        hints:["Amide = C=O bonded to N.", "You need an N–H on the partner.", "A diacid with a diamine (or amino acids)."] },
      { id:"tc2", goal:3, prompt:"Build a PET chain of exactly 6 molecules (benzene-1,4-dicarboxylic acid + ethane-1,2-diol) and enter its molar mass.",
        why:"3 × 166 + 3 × 62 − 5 × 18 = 594 g/mol: six molecules make five links.",
        hints:["Three of each monomer.", "498 + 186 = 684 before water.", "Five links: 684 − 90 = 594."] },
      { id:"tc3", goal:[2, 3], stretch:true, prompt:"Choose monomers so the repeating unit has molar mass 226 g/mol and contains amide links.",
        why:"Hexanedioic acid + hexane-1,6-diamine: 146 + 116 − 36 = 226 g/mol. That’s nylon-6,6.",
        hints:["Repeating unit = acid + partner − 2 × 18.", "So acid + partner = 262.", "146 + 116 = 262: hexanedioic acid and hexane-1,6-diamine (nylon-6,6)."] }
    ],
    blocks:[{ title:"Counting the water in a long chain", html:"<p>A chain of `m` monomer molecules in a row, with both ends still free, has `m - 1` links, so `m - 1` waters leave. Some books write 2<em>n</em> waters for a chain made from <em>n</em> diacid and <em>n</em> partner molecules: they ignore the ends. For a chain of thousands of molecules, the difference of one water is negligible.</p>" }]
  },
  part3:{
    slug:"hydrolysis", name:"Hydrolysis", heading:"Breaking them down",
    intro:"Hydrolysis is condensation run backwards: water is added across each ester or amide link. That’s why polyesters and polyamides can be broken back into their monomers, while addition polymers can’t.",
    s1:{ title:"Station 1: Run it backwards",
      intro:"A nylon-6,6 chain of 4 monomer units (hexanedioic acid and hexane-1,6-diamine, joined by three amide links). Tap <strong>Add water</strong> on a link: the H₂O splits, its –OH goes to the C=O carbon and its –H to the N, and the chain breaks there.",
      conds:[{ id:"water", t:"Water only", rate:"very slow", note:"In plain water at room temperature, amide links hydrolyse extremely slowly." },
        { id:"acid", t:"With acid (H₃O⁺)", rate:"much faster", note:"Acid speeds up hydrolysis (it catalyses the reaction)." },
        { id:"base", t:"With base (OH⁻)", rate:"much faster", note:"Base also speeds up hydrolysis; the acid part then ends up as its salt, as in soap-making (module 05)." }],
      zoom:"The C=O carbon carries a partial positive charge (δ+), so the O of a water molecule is attracted to it and bonds to it. The C–N bond breaks: the carbon keeps the new –OH, and the water’s other H ends up on the N." },
    s2:{ title:"Station 2: Who breaks down?",
      intro:"Four strips: polyethene, PET, PLA (poly(lactic acid), a polyester made from lactic acid) and cellulose. Move the slider to change the conditions.",
      conds:["cold lake water", "warm moist compost", "an industrial composter at about 60 °C"],
      note:"Model values, chosen to show the pattern; they are not real test results." },
    s3:{ title:"Station 3: Recycling a bottle",
      intro:"Two routes for a used PET bottle. Run each one, then choose the route that suits food bottles.",
      mech:"<strong>Mechanical:</strong> melt and remould; chains shorten a little each time, and contaminants stay.",
      chem:"<strong>Chemical:</strong> hydrolyse the PET back to benzene-1,4-dicarboxylic acid and ethane-1,2-diol; purify; repolymerize into PET as good as new.",
      ask:"Which route suits food bottles, and why?",
      choices:[
        { t:"Chemical: purified monomers rebuild clean PET", ok:true, fb:"Right. Hydrolysis gives back the monomers, which can be purified and repolymerized into PET as good as new, so it’s safe for food." },
        { t:"Mechanical: melting keeps the chains intact", fb:"Each melt shortens the chains a little, and contaminants stay." },
        { t:"Mechanical: melting removes contaminants", fb:"Melting keeps contaminants in the plastic." },
        { t:"Chemical: it turns PET into an addition polymer", fb:"Repolymerizing makes PET again: a condensation polymer." }],
      // VERIFY before release (plan §6 risk 3): keep this mention general; check the current state of Canadian projects.
      canada:"In Canada, companies and university research groups are developing this kind of chemical recycling (depolymerization), which turns used PET back into its monomers." },
    quickCheck:{
      title:"Quick check", summary:"Breaking them down quick check",
      items:[
        { id:"q1", goal:6, prompt:"Hydrolysis of a polyester gives…",
          choices:[
            { t:"a diacid and a diol", ok:true, fb:"Right. Water splits each ester link back into acid + alcohol: the diacid and the diol." },
            { t:"a diacid and a diamine", fb:"Water splits each ester link back into acid + alcohol." },
            { t:"alkenes", fb:"Water splits each ester link back into acid + alcohol." },
            { t:"CO₂ and water", fb:"Water splits each ester link back into acid + alcohol." }] },
        { id:"q2", goal:6, prompt:"Hydrolysis ___ water.",
          choices:[
            { t:"adds", ok:true, fb:"Right. " + M6 },
            { t:"releases", fb:"It’s the reverse of condensation. " + M6 },
            { t:"doesn’t involve", fb:"It’s the reverse of condensation. " + M6 },
            { t:"destroys", fb:"It’s the reverse of condensation. " + M6 }] },
        { id:"q3", goal:[4, 6], prompt:"Why doesn’t polyethene hydrolyse?",
          choices:[
            { t:"No ester or amide links", ok:true, fb:"Right. Its backbone is all C–C: there are no ester or amide links for water to split." },
            { t:"It has C=C bonds", fb:"Its backbone is all C–C." },
            { t:"It’s water-soluble", fb:"Its backbone is all C–C." },
            { t:"It’s too light", fb:"Its backbone is all C–C." }] },
        { id:"q4", goal:6, prompt:"PLA breaks down fast in an industrial composter but slowly in a lake. Main reason?",
          choices:[
            { t:"Higher temperature and moisture speed up hydrolysis", ok:true, fb:"Right. Rates rise with temperature (module 30), and the moist compost supplies the water." },
            { t:"Lakes have no water", fb:"Rates rise with temperature (module 30)." },
            { t:"PLA is an addition polymer", fb:"Rates rise with temperature (module 30)." },
            { t:"Composters add C=C bonds", fb:"Rates rise with temperature (module 30)." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Sort by polymer type", summary:"Sort by polymer type", goal:[1, 4], noun:"monomer", txt:true,
        instruction:"Ten polymers, named by their monomers. Sort each into the right box.",
        boxes:Object.keys(BOXN).map(k => ({ id:k, label:BOXN[k] })),
        items:SORT.map((s, i) => ({ id:"i" + (i + 1), t:s[0], answer:s[1], why:s[2], hints:[SH1, SH2, BOXN[s[1]] + ". " + s[2]], wrong:SORT_WRONG["i" + (i + 1)] })),
        wrongDefault:"Look at what meets at each link: two groups that release water (condensation), or a C=C that opens (addition)?" },
      { id:"calc", type:"custom", title:"Count, calculate, work back", summary:"Count, calculate, work back", star:true, goal:[2, 3, 5],
        instruction:"Six items. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type a number or tap an answer, then press Check.",
        use:USE,
        items:[
          { id:"c1", kind:"num", goal:3, prompt:"A protein chain has 120 amino acids. How many water molecules were released making it?",
            answer:119, display:"119", why:"120 amino acids make 119 links, and each link releases one water.",
            wrong:[{ match:120, fb:M1 }] },
          { id:"c2", kind:"num", goal:[2, 3], prompt:"Molar mass of the PET repeating unit?", unit:"g/mol",
            answer:192, display:"192 g/mol", why:"166 + 62 − 2 × 18 = 192: the repeating unit holds two links’ worth of water loss.",
            wrong:[{ match:210, fb:"Subtract <strong>two</strong> waters." }] },
          { id:"c3", kind:"mc", star:true, goal:2, prompt:"Which monomers give –O–CH₂CH₂CH₂CH₂–O–CO–CH₂CH₂–CO–?",
            options:[
              { t:"butane-1,4-diol + butanedioic acid", ok:true, why:"Split at the ester links: the O side has 4 C between two O (butane-1,4-diol); the C=O side has C + 2 CH₂ + C = 4 C (butanedioic acid)." },
              { t:"butan-1-ol + butanoic acid", why:M3 + " Each monomer needs two groups." },
              { t:"butane-1,4-diamine + butanedioic acid", why:"The links are ester (O), not amide (N)." },
              { t:"butane-1,4-diol + ethanedioic acid", why:"Count the C=O carbons too: –CO–CH₂CH₂–CO– has 4 carbons." }] },
          { id:"c4", kind:"mc", star:true, goal:2, prompt:"Which monomers give –NH–(CH₂)₄–NH–CO–(CH₂)₆–CO–?",
            options:[
              { t:"butane-1,4-diamine + octanedioic acid", ok:true, why:"N side: 4 CH₂ between two N, butane-1,4-diamine. C=O side: C + 6 CH₂ + C = 8 carbons, octanedioic acid." },
              { t:"butane-1,4-diamine + hexanedioic acid", why:M4 },
              { t:"octane-1,8-diamine + butanedioic acid", why:"Swapped: the N side has 4 carbons." },
              { t:"butane-1,4-diol + octanedioic acid", why:"N in the link means a diamine." }],
            hints:["Split at the amide links: add –H to N, –OH to C=O.", "N side: 4 CH₂ between two N: butane-1,4-diamine.", "C=O side: C + 6 CH₂ + C = 8 carbons: octanedioic acid."] },
          { id:"c5", kind:"num", star:true, goal:[3, 5], prompt:"A polyester sample has molar mass 19 218 g/mol and repeating unit 192 g/mol (PET), with one extra water’s worth of end groups. How many repeating units?",
            answer:100, display:"100", why:"(19 218 − 18) ÷ 192 = 100.", general:"Remove the end groups first: (19 218 − 18) ÷ 192.",
            hints:["Remove the end groups first.", "19 218 − 18 = 19 200.", "÷ 192 = 100."] },
          { id:"c6", kind:"iv", star:true, goal:6,
            prompt:"<strong>Investigation:</strong> Design a fair test of whether temperature affects how fast PLA strips hydrolyse. Choose the independent variable, the dependent variable and two controlled variables.",
            why:"Change only one thing at a time; measure the same outcome for every trial.",
            rows:[
              { id:"iv", label:"Independent variable (what you change)", pick:1, opts:[
                { t:"temperature", ok:true }, { t:"mass lost after a set time" }, { t:"strip size and mass" }, { t:"water volume and pH" }] },
              { id:"dv", label:"Dependent variable (what you measure)", pick:1, opts:[
                { t:"mass lost after a set time", ok:true }, { t:"temperature" }, { t:"strip size and mass" }, { t:"colour of the water" }] },
              { id:"cv", label:"Controlled variables (choose two)", pick:2, opts:[
                { t:"strip size and mass", ok:true }, { t:"water volume and pH", ok:true }, { t:"temperature" }, { t:"mass lost after a set time" }] }
            ] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Dalia", how:"",
        instruction:"Dalia made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Find the mass of a nylon-6,6 chain made from 4 hexanedioic acid (146) and 4 hexane-1,6-diamine (116) molecules.",
            steps:["Total monomer mass: 4 × 146 + 4 × 116 = 1048 g/mol.", "Each of the 8 molecules releases one water.", "Water lost: 8 × 18 = 144.", "Chain mass: 1048 − 144 = 904 g/mol."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Follows step 2.", "The mistake is earlier."],
            fixes:[
              { t:"8 molecules make 7 links: 7 × 18 = 126, so the chain is 922 g/mol.", ok:true, why:M1 },
              { t:"No water is lost: 1048 g/mol.", why:M2 },
              { t:"4 waters: 976 g/mol.", why:"One water per link, and 8 molecules in a row have 7 links." },
              { t:"Step 2 is correct.", why:M1 }],
            hints:["Where does water form?", "At each link.", "7 links: 922 g/mol."] },
          { id:"e2", goal:4, task:"Classify starch.",
            steps:["Starch is a polymer of glucose.", "Glucose molecules join by opening a double bond.", "So starch is an addition polymer."],
            answer:1,
            stepFb:["Correct.", "", "Follows from step 2."],
            fixes:[
              { t:"Glucose has –OH groups; neighbouring –OH groups link through an O, releasing water: starch is a condensation polymer.", ok:true, why:M5 },
              { t:"Glucose joins by ionic bonds.", why:"The links are covalent C–O–C bonds." },
              { t:"Starch isn’t a polymer.", why:"Starch is a long chain of glucose units." },
              { t:"Step 2 is correct.", why:M5 }],
            hints:["Does glucose have a C=C?", "No; it has many –OH groups.", "Condensation."] },
          { id:"e3", goal:6, task:"Give the products of fully hydrolysing PET.",
            steps:["PET has ester links.", "Hydrolysis removes water from each link.", "So the chain gets longer and more tightly linked."],
            answer:1,
            stepFb:["Correct.", "", "Follows from step 2."],
            fixes:[
              { t:"Hydrolysis adds water across each ester link, giving benzene-1,4-dicarboxylic acid and ethane-1,2-diol.", ok:true, why:M6 },
              { t:"It gives ethene and CO₂.", why:"Hydrolysis gives back the monomers." },
              { t:"It gives benzene and ethanol.", why:"Hydrolysis gives back the monomers." },
              { t:"Step 2 is correct.", why:M6 }],
            hints:["Hydro- = water, -lysis = splitting.", "Water is added.", "The two original monomers."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you more: that 10 monomers release 9 waters, not 10, or that one capping molecule stops a chain?" },
      { id:"j2", q:"In your own words, explain the difference between addition and condensation polymerization." },
      { id:"j3", q:"Explain to a friend how to find the monomers of a polyamide from its repeating unit." },
      { id:"j4", q:"Which calculation still trips you up? What will you do to fix it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which pair can form a condensation polymer?", options:[
          { t:"hexanedioic acid + ethane-1,2-diol", ok:true, why:"Each has two reactive groups." },
          { t:"ethanoic acid + ethanol", why:"One ester forms, then nothing." },
          { t:"ethene + propene", why:"That’s addition (copolymer)." },
          { t:"hexanedioic acid + ethanol", why:"Ethanol caps each end." }] },
        b:{ prompt:"Which single monomer can form a condensation polymer by itself?", options:[
          { t:"an amino acid, with –NH₂ and –COOH", ok:true, why:"Its two different groups let each molecule link at both ends: amide links, releasing water." },
          { t:"ethene", why:"That’s addition." },
          { t:"ethanol", why:M3 },
          { t:"ethanoic acid", why:M3 }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"What link joins the monomers in PET?", options:[
          { t:"ester (–COO–)", ok:true, why:"PET is made from a diacid and a diol: ester links." },
          { t:"amide (–CO–NH–)", why:"PET has no N." },
          { t:"ether (–O–)", why:"The C=O is kept." },
          { t:"C=C", why:"Condensation doesn’t make C=C." }] },
        b:{ prompt:"What link joins the monomers in nylon-6,6?", options:[
          { t:"amide (–CO–NH–)", ok:true, why:"Nylon-6,6 is made from a diacid and a diamine: amide links." },
          { t:"ester", why:"Nylon is made with a diamine." },
          { t:"glycosidic (C–O–C)", why:"That’s in starch." },
          { t:"C–C only", why:"That’s an addition polymer backbone." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"A chain forms from 50 monomer molecules by condensation. How many water molecules are released?", options:[
          { t:"49", ok:true, why:"50 molecules in a row have 49 links, one water each." },
          { t:"50", why:M1 },
          { t:"25", why:"One per link, not per pair." },
          { t:"100", why:"Each link releases one." }] },
        b:{ prompt:"A chain forms from 80 monomer molecules by condensation. How many water molecules are released?", options:[
          { t:"79", ok:true, why:"80 molecules in a row have 79 links, one water each." },
          { t:"80", why:M1 },
          { t:"40", why:"One per link, not per pair." },
          { t:"160", why:"Each link releases one." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"Which monomers make –O–CH₂CH₂–O–CO–CH₂CH₂–CO–?", options:[
          { t:"ethane-1,2-diol + butanedioic acid", ok:true, why:"Split at the ester links: –O–CH₂CH₂–O– comes from ethane-1,2-diol and –CO–CH₂CH₂–CO– (4 carbons) from butanedioic acid." },
          { t:"ethanol + butanoic acid", why:M3 },
          { t:"ethane-1,2-diamine + butanedioic acid", why:"The links are ester (O), not amide (N)." },
          { t:"ethane-1,2-diol + propanedioic acid", why:"–CO–CH₂CH₂–CO– has 4 carbons." }] },
        b:{ prompt:"Which monomers make –NH–(CH₂)₄–NH–CO–(CH₂)₆–CO–?", options:[
          { t:"butane-1,4-diamine + octanedioic acid", ok:true, why:"The N side has 4 carbons (butane-1,4-diamine); the C=O side has C + 6 CH₂ + C = 8 carbons (octanedioic acid)." },
          { t:"butane-1,4-diamine + hexanedioic acid", why:M4 },
          { t:"octane-1,8-diamine + butanedioic acid", why:"Swapped: the N side has 4 carbons." },
          { t:"butane-1,4-diol + octanedioic acid", why:"N in the link means a diamine." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"Use hexanedioic acid 146, hexane-1,6-diamine 116, water 18. What is the molar mass of a chain made from 3 acid and 3 diamine molecules?", options:[
          { t:"696 g/mol", ok:true, why:"438 + 348 − 5 × 18." },
          { t:"786 g/mol", why:"Water must be subtracted." },
          { t:"678 g/mol", why:"6 molecules make 5 links." },
          { t:"732 g/mol", why:"That subtracts only 3 waters." }] },
        b:{ prompt:"Use benzene-1,4-dicarboxylic acid 166, ethane-1,2-diol 62, water 18. What is the molar mass of a chain made from 2 acid and 2 diol molecules?", options:[
          { t:"402 g/mol", ok:true, why:"332 + 124 − 3 × 18." },
          { t:"456 g/mol", why:"Water must be subtracted." },
          { t:"384 g/mol", why:"4 molecules make 3 links." },
          { t:"420 g/mol", why:"That subtracts only 2 waters." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"A little ethanoic acid is added while a polyester forms. What happens to the chains?", options:[
          { t:"They end up shorter, because ethanoic acid caps chain ends with its single –COOH", ok:true, why:"Once ethanoic acid links to an end, that end has no free group left, so it stops growing." },
          { t:"They get longer.", why:M3 },
          { t:"Nothing changes.", why:"Each capped end stops growing." },
          { t:"They cross-link.", why:"Cross-links need three reactive groups." }] },
        b:{ prompt:"Some propane-1,2,3-triol replaces part of the ethane-1,2-diol in a polyester. What happens?", options:[
          { t:"A cross-linked network forms: each triol can link three chains", ok:true, why:"Three –OH groups let each triol join three chains, so the chains are tied into a network." },
          { t:"The chains get shorter.", why:"Three groups branch rather than cap." },
          { t:"No polymer forms.", why:"The other groups still link." },
          { t:"An addition polymer forms.", why:"No C=C is involved." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which is the best explanation of why proteins are condensation polymers?", options:[
          { t:"“Each amino acid has an amine and a carboxylic acid group; amide (peptide) links form between them and a water is released at each link.”", ok:true, why:"It names the two groups, the link they make and the water lost at every link." },
          { t:"“Amino acids contain C=C bonds that open.”", why:M5 },
          { t:"“Proteins form when water is added to amino acids.”", why:M6 },
          { t:"“Proteins are held together by ionic bonds.”", why:"The links are covalent amide bonds." }] },
        b:{ prompt:"Why can’t ethanol and ethanoic acid make a polymer?", options:[
          { t:"“Each has only one reactive group, so after one ester link there’s nothing left to continue the chain.”", ok:true, why:M3 },
          { t:"“They have no C=C.”", why:"Condensation doesn’t need C=C." },
          { t:"“They don’t react at all.”", why:"They form ethyl ethanoate." },
          { t:"“Ethanol is too small.”", why:"Size isn’t the issue; the number of groups is." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which correctly shows one repeating unit of nylon-6,6?", options:[
          { t:"–[NH–(CH₂)₆–NH–CO–(CH₂)₄–CO]–", ok:true, why:"–NH–(CH₂)₆–NH– from the diamine and –CO–(CH₂)₄–CO– from the acid, with no –OH or –H left at the links." },
          { t:"–[HOOC–(CH₂)₄–CO–NH–(CH₂)₆–NH₂]–", why:"The –OH and –H leave as water." },
          { t:"–[NH–(CH₂)₆–NH–CO–(CH₂)₆–CO]–", why:"The acid part has 6 carbons in total: (CH₂)₄ plus two C=O." },
          { t:"–[O–(CH₂)₆–O–CO–(CH₂)₄–CO]–", why:"That’s a polyester." }] },
        b:{ prompt:"Which correctly shows one repeating unit of PET?", options:[
          { t:"–[O–CH₂CH₂–O–CO–C₆H₄–CO]–", ok:true, why:"–O–CH₂CH₂–O– from the diol and –CO–C₆H₄–CO– from the acid, joined by ester links." },
          { t:"–[HO–CH₂CH₂–O–CO–C₆H₄–COOH]–", why:M2 },
          { t:"–[NH–CH₂CH₂–NH–CO–C₆H₄–CO]–", why:"That’s a polyamide." },
          { t:"–[CH₂–CH(C₆H₅)]–", why:"That’s polystyrene." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Polyester and nylon fabrics slowly weaken when soaked in strong acid, but polyethene bags don’t. Why?", options:[
          { t:"Acid speeds hydrolysis of ester and amide links; polyethene’s C–C backbone has no such links", ok:true, why:"Water splits ester and amide links, and acid speeds that up. Polyethene has only C–C and C–H bonds." },
          { t:"Acid adds across C=C bonds in the fabrics", why:"Condensation polymers have no C=C in the chain." },
          { t:"Polyethene is too dense for acid to enter", why:"Structure, not density, is the reason." },
          { t:"Acid removes water from the fabrics", why:M6 }] },
        b:{ prompt:"PLA cups compost in an industrial composter but last for years in a cold lake. Which is the best explanation?", options:[
          { t:"Hydrolysis of PLA’s ester links is much faster at high temperature and moisture", ok:true, why:"PLA is a polyester; its ester links hydrolyse much faster when it’s hot and moist." },
          { t:"PLA is an addition polymer", why:"It’s a polyester: condensation." },
          { t:"Lakes contain no water", why:"Cold water is the issue." },
          { t:"Composters add new links", why:M6 }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"Chemical recycling turns used PET back into its monomers. What reaction is this, and what’s added?", options:[
          { t:"Hydrolysis: water is added across each ester link", ok:true, why:"Adding water across each ester link gives back benzene-1,4-dicarboxylic acid and ethane-1,2-diol." },
          { t:"Condensation: water is removed", why:M6 },
          { t:"Addition polymerization: C=C bonds open", why:"That builds chains." },
          { t:"Combustion: oxygen is added", why:"That destroys the carbon skeleton." }] },
        b:{ prompt:"Why is turning used PET back into monomers better than melting and remoulding it for food bottles?", options:[
          { t:"The monomers can be purified and repolymerized into PET as good as new; remelting shortens chains and keeps contaminants", ok:true, why:"Purification removes contaminants, and new chains are full length, so the PET is safe for food." },
          { t:"Remoulding makes PET biodegradable", why:"It doesn’t." },
          { t:"Monomers are always cheaper", why:"Not the chemical reason." },
          { t:"Melting turns PET into an addition polymer", why:"Melting doesn’t change the polymer type." }] } }
    ]
  },
  task:{
    title:"Design a fibre", summary:"Design a fibre",
    statement:"<p>Pick a diacid and a partner monomer to make a strong fibre that meets every condition. Can you find all the answers?</p><ol class=\"cp-conds\"><li>It forms long linear chains.</li><li>It has amide links.</li><li>Its repeating unit is between 200 and 250 g/mol.</li><li>It contains a benzene ring (for stiffness).</li></ol>",
    checks:["Long linear chains", "Amide links", "200–250 g/mol", "Benzene ring"],
    tips:["Ethanol caps chains; the triol makes a network.", "Amide links need N: choose a diamine.", "Repeating unit = acid + partner − 2 × 18.", "Rings come from benzene-1,4-dicarboxylic acid or benzene-1,4-diamine."],
    explainPrompt:"Explain how you calculated the repeating-unit mass and why your fibre would be strong.",
    vocab:"Use the words condensation, amide link, repeating unit and hydrogen bonding.",
    more:"There’s more than one answer. Can you find all of them?",
    after3:"The all-ring version is Kevlar: rigid rings plus hydrogen bonds between amide links make it strong enough for protective vests."
  },
  cards:[
    ["Condensation polymer", "Bifunctional monomers link and release a small molecule (usually water) at each link."],
    ["Polyester", "Diacid + diol (or a hydroxy acid); ester links –COO–. Example: PET."],
    ["Polyamide", "Diacid + diamine (or amino acids); amide links –CO–NH–. Examples: nylon, Kevlar, proteins."],
    ["Polysaccharide", "Glucose units linked through O, releasing water: starch, cellulose."],
    ["Water released", "`m` monomer molecules → `m - 1` links → `m - 1` waters."],
    ["Repeating-unit mass", "Acid + partner − 2 × 18 g/mol."],
    ["Working back", "Split at each link; add –OH to the C=O and –H to the O or N."],
    ["Chain capper", "A monofunctional molecule ends a chain."],
    ["Cross-linker", "A trifunctional molecule (e.g. propane-1,2,3-triol) joins chains into a network."],
    ["Addition vs condensation", "C=C monomers, no loss vs two-group monomers, water lost."],
    ["Hydrolysis", "Water added across ester or amide links, giving back monomers."],
    ["Nylon-6,6", "Hexane-1,6-diamine (6 C) + hexanedioic acid (6 C)."]
  ]
};
