// SBI4U 25 Overview of Protein Synthesis. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/25-overview-of-protein-synthesis.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "The template strand is the <strong>complement</strong> of the mRNA. Only the coding strand matches the mRNA (with T for U).";
const M2 = "The ribosome scans to the first AUG. Bases before it aren’t translated.";
const M3 = "No tRNA matches a stop codon. A release factor binds there and frees the polypeptide.";
const M4 = "The new tRNA arrives in the <strong>A</strong>ccept site; the chain is held in the <strong>P</strong> site; the empty tRNA <strong>E</strong>xits.";
const M5 = "Each ribosome makes its own complete copy. Five ribosomes → five polypeptides.";
const M6 = "Amino acids = codons from AUG up to, but not including, the stop codon.";
const M7 = "Bacteria have no spliceosomes, so a human gene must go in without introns (as cDNA).";

export default {
  id:"25-overview-of-protein-synthesis",
  kind:"topic",
  title:"Overview of protein synthesis",
  topic:"Overview of Protein Synthesis",
  readyTopic:"protein synthesis",
  hero:{
    eq:'<span class="ps-heq"><span class="ps-hb"><b class="ps-hd">DNA</b></span><span class="ps-ha">→<small>transcription</small></span><span class="ps-hb"><b class="ps-hm">mRNA</b><small class="ps-hs">5′-AUG UUU GGA AAC UGG UAA-3′</small></span><span class="ps-ha">→<small>translation</small></span><span class="ps-hb"><b class="ps-hp">polypeptide</b><small class="ps-hs">Met–Phe–Gly–Asn–Trp</small></span></span>',
    eqLabel:"DNA, by transcription, gives mRNA 5′-AUG UUU GGA AAC UGG UAA-3′; by translation, the mRNA gives the polypeptide Met–Phe–Gly–Asn–Trp",
    eqSize:"sm",
    headline:"Read three, add one",
    text:"A <strong>ribosome</strong> moves along an <strong>mRNA</strong> three bases at a time. Each <strong>codon</strong> calls in a <strong>tRNA</strong> with a matching <strong>anticodon</strong>, and its amino acid is joined to the growing chain by a <strong>peptide bond</strong>. The ribosome starts at <strong>AUG</strong> and stops at a <strong>stop codon</strong>.",
    fig:{ html:'<div class="ps-hero" id="ps-hero" role="img" aria-label="A teal mRNA strip slides in. A small ribosomal subunit clamps on near the 5′ end and slides to AUG. A violet tRNA carrying Met docks, and the large subunit drops on top. More tRNAs come and go, and the brown chain grows to Met–Phe–Gly–Asn–Trp. At UAA a release factor enters, the chain floats away and the two subunits separate."></div>' }
  },
  goals:[
    "I can describe the roles of mRNA, tRNA, rRNA and the ribosome’s A, P and E sites.",
    "I can explain the three stages of translation: initiation, elongation and termination.",
    "I can decode an mRNA, coding strand or template strand into an amino acid sequence, starting at AUG.",
    "I can explain polyribosomes and compare protein synthesis in prokaryotes and eukaryotes.",
    "I can predict how blocking one part of translation affects protein production.",
    "I can apply protein synthesis to medicine and biotechnology (antibiotics, proteins made in bacteria)."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Transcription", goal:3,
          prompt:"The coding strand of a gene reads 5′-ATG GCA-3′. What is the mRNA?",
          options:[
            { t:"5′-AUG GCA-3′", ok:true, why:"The mRNA matches the coding strand, with U for T." },
            { t:"5′-UAC CGU-3′", why:"That’s the complement, made from the coding strand by mistake." },
            { t:"5′-ATG GCA-3′", why:"mRNA uses U." },
            { t:"3′-UAC CGU-5′", why:"That’s the template strand’s sequence (in RNA letters)." }],
          hints:["Which strand does the mRNA match?", "The coding strand, with U for T.", "5′-AUG GCA-3′."] },
        { id:"w2", skill:"Transcription", goal:3,
          prompt:"The template strand reads 3′-TAC GGA-5′. What is the mRNA?",
          options:[
            { t:"5′-AUG CCU-3′", ok:true, why:"Complement each base: T→A, A→U, C→G, G→C." },
            { t:"5′-UAC GGA-3′", why:"That just swaps T for U." },
            { t:"5′-ATG CCT-3′", why:"That’s the coding strand (DNA)." },
            { t:"3′-AUG CCU-5′", why:"The mRNA’s 5′ end pairs with the template’s 3′ end." }],
          hints:["The mRNA is complementary to the template.", "T→A, A→U, C→G, G→C.", "5′-AUG CCU-3′."] },
        { id:"w3", skill:"Codon table", goal:3,
          prompt:"Which amino acid does UGG code for?",
          options:[
            { t:"Tryptophan (Trp)", ok:true, why:"UGG is the only codon for Trp." },
            { t:"A stop", why:"UGA is a stop; UGG is Trp." },
            { t:"Glycine (Gly)", why:"Gly is GG_." },
            { t:"Cysteine (Cys)", why:"Cys is UGU and UGC." }],
          hints:["Row U, column G.", "The UG_ box: Cys, Cys, stop, Trp.", "Trp."] },
        { id:"w4", skill:"Codon table", goal:2,
          prompt:"Which codons are stop codons?",
          options:[
            { t:"UAA, UAG, UGA", ok:true, why:"Two in the UA_ box and one in the UG_ box." },
            { t:"AUG, UAA, UGA", why:"AUG is the start codon (Met)." },
            { t:"UAA only", why:"There are three." },
            { t:"UUU, UUA, UAG", why:"UUU is Phe and UUA is Leu." }],
          hints:["Look for ‘stop’ in the table.", "Two in the UA_ box, one in the UG_ box.", "UAA, UAG, UGA."] },
        { id:"w5", skill:"tRNA pairing", goal:1,
          prompt:"A tRNA has the anticodon 3′-AAG-5′. Which codon does it read?",
          options:[
            { t:"5′-UUC-3′", ok:true, why:"Complementary and antiparallel." },
            { t:"5′-AAG-3′", why:"That’s the same bases." },
            { t:"5′-CUU-3′", why:"Reversed: line up the 5′ end of the codon with the 3′ end of the anticodon." },
            { t:"5′-TTC-3′", why:"RNA uses U." }],
          hints:["Codon 5′ → 3′ pairs with anticodon 3′ → 5′.", "A–U, A–U, G–C.", "5′-UUC-3′."] },
        { id:"w6", skill:"tRNA pairing", goal:1,
          prompt:"What does an aminoacyl-tRNA synthetase do?",
          options:[
            { t:"Attaches the correct amino acid to a tRNA, using ATP", ok:true, why:"It ‘charges’ each tRNA with its own amino acid." },
            { t:"Joins amino acids into a chain", why:"That’s the ribosome." },
            { t:"Makes tRNA from DNA", why:"RNA polymerase does that." },
            { t:"Reads stop codons", why:"Release factors do." }],
          hints:["Think of the ‘charging station’ in module 24.", "It loads tRNAs.", "Attaches the amino acid, using ATP."] }
      ],
      refreshers:{
        "Transcription":"The mRNA is complementary to the <strong>template</strong> strand and has the same sequence as the <strong>coding</strong> strand (U for T). 3′-TAC-5′ on the template gives 5′-AUG-3′.",
        "Codon table":"Row = first base, column = second, then the third base within the box. AUG = Met and start; UAA, UAG, UGA = stop.",
        "tRNA pairing":"Anticodon pairs with codon, antiparallel. The synthetase, not the ribosome, chooses the amino acid."
      }
    }
  },
  explore:{
    heading:"Ribosome assembly line",
    intro:"Step the ribosome through a message. Watch which site each tRNA is in, and how the chain grows.",
    messages:[
      { id:"m1", t:"M1", seq:"CAGAUGUUUGGAAACUGGUAAGC", show:"5′-CAG AUG UUU GGA AAC UGG UAA GC-3′" },
      { id:"m2", t:"M2", seq:"AUGGCAUGUAAAUGA", show:"5′-AUG GCA UGU AAA UGA-3′" },
      { id:"m3", t:"M3 (eukaryotic)", seq:"CAUGGAUGAAUAGC", show:"5′-C AUG GAU GAA UAG C-3′", pick:true },
      { id:"own", t:"Build your own", pick:true }
    ],
    buildNote:"Up to 6 codons (18 bases). Tap a base to add it.",
    startNote:"Start position: tap a base to set where the small subunit begins, or scan from the 5′ end.",
    polyNote:"Each copy takes 30 s, set by the message length.",
    cellNote:"Same gene, two kinds of cell. Step through time.",
    gtpNote:"Not shown: initiation factors, and the GTP that elongation uses.",
    predIntro:"Make a prediction first. Then the assembly line will show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Start: M1, before initiation. Which amino acid will be first in the chain?",
        options:[{ t:"Met", ok:true }, { t:"Gln (from CAG)" }, { t:"Phe" }, { t:"Any amino acid" }],
        explain:"Translation starts at the first AUG, which codes Met. CAG is before the start and isn’t read." },
      { id:"p2", prompt:"Start: M1 with UAA in the A site. What enters the A site now?",
        options:[{ t:"A release factor (a protein)", ok:true }, { t:"A tRNA with anticodon 3′-AUU-5′" }, { t:"A tRNA carrying Met" }, { t:"Nothing; the chain stays attached" }],
        explain:"No tRNA has an anticodon for a stop codon. The replay with <strong>No release factor</strong> switched on shows the other case: the ribosome stalls with the chain still attached." },
      { id:"p3", prompt:"Start: polyribosome mode, 5 ribosomes on M1. When every ribosome has finished, how many polypeptides are there?",
        options:[{ t:"5", ok:true }, { t:"1" }, { t:"25" }, { t:"It depends on the mRNA length" }],
        explain:"Each ribosome reads the whole message and makes its own copy." },
      { id:"p4", prompt:"Start: bacterium vs eukaryote mode. In the bacterium, can ribosomes start on an mRNA before RNA polymerase has finished making it?",
        options:[{ t:"Yes", ok:true }, { t:"No: the mRNA must be finished first" }, { t:"No: it must leave the nucleus first" }, { t:"Only if there are no introns" }],
        explain:"Bacteria have no nucleus, so transcription and translation happen in the same place at the same time." }
    ],
    challenges:[
      { id:"tc1", goal:2, prompt:"Step M1 until the P site holds Met–Phe–Gly and the A site is empty, ready for the next tRNA.",
        why:"After the second translocation, the Gly-tRNA holds Met–Phe–Gly in the P site and the A site shows AAC, waiting for the next tRNA.",
        general:"Use the assembly line with M1, scanning from the 5′ end, and stop on a translocation step.",
        early:"The bond has formed, but the ribosome hasn’t moved yet: translocate.",
        late:"You’ve gone one step past.",
        hints:["Count elongation cycles: each adds one amino acid.", "Met is there from initiation; Phe and Gly take two cycles.", "Stop after the second translocation."] },
      { id:"tc2", goal:3, prompt:"Build a 4-codon message that makes Met–Trp–Lys and then stops.",
        why:"AUG · UGG · AAA or AAG · UAA, UAG or UGA: 2 Lys codons × 3 stops = 6 messages work.",
        general:"Choose Build your own and use exactly 4 codons (12 bases).",
        uga:"UGA is a stop codon; Trp is only UGG.",
        noAug:"The ribosome needs AUG to start.",
        hints:["Start with the start codon.", "Trp has only one codon.", "AUG UGG AAA UAA (or AAG, and any stop)."] },
      { id:"tc3", goal:[2, 3], stretch:true, prompt:"Message M3 (a eukaryotic mRNA) is 5′-CAUGGAUGAAUAGC-3′. Set the start where a real ribosome would, and run it. What is the polypeptide?",
        why:"A scanning ribosome starts at the first AUG (bases 2–4): AUG GAU GAA UAG gives Met–Asp–Glu, then stop.",
        general:"Choose M3, set the start, and step until the subunits separate.",
        base1:"His–Gly then a stop: translation doesn’t begin at the first base.",
        aug2:"Met–Asn–Ser and no stop in frame: a scanning ribosome stops at the <strong>first</strong> AUG from the 5′ end.",
        run:"Good start. Now run it to the end, until the subunits separate.",
        hints:["A eukaryotic ribosome scans from the 5′ end.", "Find the first AUG, then read in threes from there.", "AUG GAU GAA UAG: Met–Asp–Glu, then stop."] }
    ]
  },
  part3:{
    slug:"decode", name:"Decode", heading:"Decode it",
    intro:"The assembly line always started from mRNA. Here you start from either DNA strand, keep track of the 5′ and 3′ ends yourself, and look at data on how a drug can block translation.",
    s1:{
      title:"Station 1: Three starting points",
      text:"The same gene can be shown as the coding strand, the template strand or the mRNA. Choose which one you are given, fill in the other two, then translate.",
      coding:"ATGAAGTGGGCATAG",
      starts:[{ id:"coding", t:"Coding strand" }, { id:"template", t:"Template strand" }, { id:"mrna", t:"mRNA" }],
      pairFb:"DNA strands pair A–T and C–G, antiparallel.",
      transBad:"The template strand is the <strong>complement</strong> of the mRNA. Only the coding strand matches the mRNA (with T for U). RNA polymerase copies the <strong>template</strong> strand.",
      transGood:"RNA polymerase reads the template 3′ → 5′ and builds the mRNA 5′ → 3′: A→U, T→A, C→G, G→C.",
      needTemplate:"Fill in the template strand first: transcription copies the template.",
      fromMrna:"Pair the mRNA’s bases (U→A, A→T, C→G, G→C) to get the template strand.",
      q:"What polypeptide does this gene code for?",
      choices:[
        { t:"Met–Lys–Trp–Ala", ok:true, fb:"AUG AAG UGG GCA, then UAG stops." },
        { t:"Tyr–Phe–Thr–Arg", fb:"That reads the template as if it were mRNA. " + M1 },
        { t:"Met–Lys–Trp–Ala–stop", fb:M6 },
        { t:"Met–Lys–Trp", fb:"GCA (Ala) comes before the stop." }]
    },
    s2:{
      title:"Station 2: Find the frame",
      text:"This mRNA has some leading bases. Tap the base where translation starts. The codon dividers follow from your start, and the protein appears only when the frame is right.",
      seq:"UCCACAUGGCUAAUGACUAG",
      good:"The frame starts at the first AUG: AUG GCU AAU GAC UAG gives Met–Ala–Asn–Asp, then stop.",
      notAug:"That base doesn’t start an AUG. " + M2,
      laterAug:"That AUG is out of frame and later in the message. A scanning ribosome stops at the <strong>first</strong> AUG from the 5′ end.",
      first:"The first base isn’t a start. " + M2
    },
    s3:{
      title:"Station 3: Blocking bacterial ribosomes (investigation)",
      text:"A growth experiment measured how much protein cells made in 30 min, with and without the antibiotic streptomycin.",
      dataTitle:"Check it with data",
      head:["Row", "Culture", "Antibiotic added", "Protein made in 30 min (relative units)"],
      rows:[["1", "<i>E. coli</i>", "none", "100"], ["2", "<i>E. coli</i>", "streptomycin (binds the bacterial small subunit)", "8"],
        ["3", "Human cells grown in a dish", "none", "100"], ["4", "Human cells grown in a dish", "streptomycin", "97"]],
      caption:"Results of a model experiment.",
      claim:{ q:"Claim", options:[
        { t:"Streptomycin blocks bacterial ribosomes but hardly affects human ribosomes", ok:true },
        { t:"Streptomycin blocks protein synthesis in every kind of cell" },
        { t:"Streptomycin blocks human ribosomes more than bacterial ones" },
        { t:"Streptomycin has no effect on protein synthesis" }] },
      evQ:"Evidence: tap the rows that show the drug’s effect",
      answer:[2, 4],
      reason:{ q:"Reasoning", options:[
        { t:"Bacterial ribosomes (70S) differ in structure from human cytoplasmic ribosomes (80S)", ok:true },
        { t:"Human cells have no ribosomes" },
        { t:"Streptomycin can’t enter any cell" },
        { t:"Human cells make protein without mRNA" }] },
      claimFb:"Compare row 2 with row 1, and row 4 with row 3: the drug cuts bacterial protein synthesis but hardly changes human protein synthesis.",
      evFb:"Rows 2 and 4 show the drug’s effect on each kind of cell (rows 1 and 3 are the controls).",
      reasonFb:"Both kinds of cell have ribosomes; the drug can bind only the bacterial kind because their shapes differ.",
      done:"Claim, evidence and reasoning fit together: streptomycin cuts bacterial protein synthesis to 8 units (row 2) but leaves human cells at 97 (row 4), because bacterial (70S) and human cytoplasmic (80S) ribosomes differ in structure."
    },
    quickCheck:{
      title:"Quick check", summary:"Decode it quick check",
      items:[
        { id:"q1", goal:3, prompt:"Template 3′-TAC AAA-5′. The mRNA?",
          choices:[{ t:"5′-AUG UUU-3′", ok:true, fb:"Right. Each base is complemented: T→A, A→U." },
            { t:"5′-UAC AAA-3′", fb:"Complement the template; don’t just swap T for U." },
            { t:"5′-ATG TTT-3′", fb:"Complement the template; don’t just swap T for U." },
            { t:"3′-AUG UUU-5′", fb:"Complement the template; don’t just swap T for U." }] },
        { id:"q2", goal:3, prompt:"mRNA 5′-GG AUG CCA UAG-3′. How many amino acids?",
          choices:[{ t:"2", ok:true, fb:"Right. Met and Pro; then UAG stops." },
            { t:"3", fb:"Met and Pro; GG is before the start and UAG adds nothing." },
            { t:"4", fb:"Met and Pro; GG is before the start and UAG adds nothing." },
            { t:"5", fb:"Met and Pro; GG is before the start and UAG adds nothing." }] },
        { id:"q3", goal:1, prompt:"Which site does a new charged tRNA enter?",
          choices:[{ t:"A", ok:true, fb:"Right. A for ‘arrive’." },
            { t:"P", fb:"A for ‘arrive’." },
            { t:"E", fb:"A for ‘arrive’." },
            { t:"Any free site", fb:"A for ‘arrive’." }] },
        { id:"q4", goal:6, prompt:"In the data, why are human cells barely affected?",
          choices:[{ t:"Their ribosomes differ", ok:true, fb:"Right. Bacterial (70S) and human (80S) ribosomes have different shapes." },
            { t:"They have no ribosomes", fb:"Bacterial (70S) and human (80S) ribosomes have different shapes." },
            { t:"They have no mRNA", fb:"Bacterial (70S) and human (80S) ribosomes have different shapes." },
            { t:"Streptomycin can’t enter any cell", fb:"Bacterial (70S) and human (80S) ribosomes have different shapes." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"order", type:"order", title:"Translation in order", summary:"Translation in order", goal:[1, 2],
        instruction:"Put the steps of translation in order.",
        sequences:[
          { id:"s1", goal:[1, 2], prompt:"Initiation to the first peptide bond.",
            steps:["The small subunit binds the mRNA near its 5′ end.", "It moves along to the first AUG.", "The initiator tRNA carrying Met pairs with AUG.",
              "The large subunit joins; the Met-tRNA is in the P site.", "A charged tRNA matching the next codon enters the A site.", "A peptide bond joins Met to the new amino acid."],
            start:[3, 1, 5, 0, 4, 2],
            wrong:[{ order:[3], fb:"The small subunit finds the mRNA and AUG first." }, { order:[1, 0], fb:"The small subunit has to bind the mRNA before it can move along it." }],
            general:"The small subunit finds the mRNA and AUG first; the large subunit joins last in initiation.",
            why:"Small subunit, scan to AUG, Met-tRNA, large subunit; then the next tRNA arrives in the A site and the first peptide bond forms.",
            hints:["Which subunit finds the mRNA?", "The small subunit binds, finds AUG and the Met-tRNA pairs, all before the large subunit joins.", "Small subunit binds → moves to AUG → Met-tRNA pairs → large subunit joins → tRNA enters A → peptide bond."] },
          { id:"s2", goal:[1, 2], prompt:"One elongation cycle and the end.",
            steps:["A charged tRNA enters the A site.", "The chain moves from the P-site tRNA onto the A-site tRNA’s amino acid (a peptide bond forms).",
              "The ribosome moves one codon toward the 3′ end.", "The empty tRNA leaves from the E site.", "When a stop codon reaches the A site, a release factor frees the chain."],
            start:[2, 4, 0, 3, 1],
            wrong:[{ order:[0, 2], fb:"The bond forms first; then the ribosome moves." }, { order:[2], fb:"The bond forms first; then the ribosome moves." }],
            general:"Arrive, bond, move, exit: the bond forms before the ribosome moves.",
            why:"Arrive (A site), bond (chain onto the A-site amino acid), translocate, exit from E; at a stop codon, a release factor ends it.",
            hints:["What has to be in the A site before a bond can form?", "The bond forms before the ribosome moves; the empty tRNA can leave only after the move.", "tRNA enters A → bond → move one codon → empty tRNA leaves E → release factor at the stop."] }
        ] },
      { id:"decode", type:"custom", title:"Decode set", summary:"Decode set", star:true, goal:[3, 5],
        instruction:"Six decoding problems. Problems 3 to 6 are non-routine (★); the last two go beyond the Final Check.",
        items:[
          { id:"d1", kind:"chain", goal:3, prompt:"mRNA 5′-AUG CCU GAA UUC UAG-3′: polypeptide?",
            answer:["Met", "Pro", "Glu", "Phe"],
            wrong:[{ match:["Met", "Pro", "Glu", "Phe", "stop"], fb:M6 }],
            why:"AUG CCU GAA UUC = Met–Pro–Glu–Phe; UAG stops and adds nothing.",
            hints:["Read the codons in threes from AUG.", "AUG = Met, CCU = Pro, GAA = Glu, UUC = Phe.", "Met–Pro–Glu–Phe (UAG is the stop)."] },
          { id:"d2", kind:"chain", goal:3, prompt:"Coding strand 5′-ATG GCA TGT AAA TGA-3′: polypeptide?",
            answer:["Met", "Ala", "Cys", "Lys"],
            wrong:[{ starts:"Tyr", fb:M1 + " The coding strand already matches the mRNA." }, { match:["Met", "Ala", "Cys", "Lys", "stop"], fb:M6 }],
            why:"mRNA 5′-AUG GCA UGU AAA UGA-3′: Met–Ala–Cys–Lys, then stop.",
            hints:["Which strand does the mRNA match?", "The coding strand, with U for T: AUG GCA UGU AAA UGA.", "Met–Ala–Cys–Lys."] },
          { id:"d3", kind:"chain", goal:3, star:true, prompt:"Template strand 3′-TAC CGG TTT ATC-5′: polypeptide?",
            answer:["Met", "Ala", "Lys"],
            wrong:[{ starts:"Tyr", fb:M1 + " That reads the template as if it were mRNA." }, { match:["Met", "Ala", "Lys", "stop"], fb:M6 }],
            why:"mRNA 5′-AUG GCC AAA UAG-3′: Met–Ala–Lys, then stop.",
            hints:["Is the mRNA the same as the template or complementary to it?", "Complement each base: 5′-AUG GCC AAA UAG-3′.", "Met–Ala–Lys."] },
          { id:"d4", kind:"num", goal:3, star:true, prompt:"How many different mRNAs (start to stop codon included) could code for Met–Trp–Cys?",
            answer:6, unit:"mRNAs",
            wrong:[{ match:2, fb:"Cys has 2 codons, and there are 3 stop codons: 1 × 1 × 2 × 3 = 6." }, { match:3, fb:"Cys has 2 codons, and there are 3 stop codons: 1 × 1 × 2 × 3 = 6." }],
            why:"Met (1 codon) × Trp (1) × Cys (2) × stop (3) = 6.",
            hints:["How many codons does each amino acid have? Don’t forget the stop.", "Met 1, Trp 1, Cys 2, stop 3.", "1 × 1 × 2 × 3 = 6."] },
          { id:"d5", kind:"num", goal:[3, 5], star:true, prompt:"A 900-base mRNA has its AUG at bases 51–53 and its stop codon at bases 750–752. How many amino acids are in the polypeptide?",
            answer:233, unit:"amino acids",
            wrong:[{ match:300, fb:"Count only from AUG to the base before the stop: bases 51–749 = 699 bases = 233 codons." }, { match:234, fb:M6 }],
            why:"Bases 51–749 = 699 bases = 233 codons, each one amino acid.",
            hints:["Which bases are translated?", "From the A of AUG (base 51) to the base just before the stop (749).", "699 ÷ 3 = 233."] },
          { id:"d6", kind:"chain", goal:3, star:true, prompt:"Template strand 5′-TTA CTT GGC CAT-3′ (note the direction). Polypeptide?",
            answer:["Met", "Ala", "Lys"],
            wrongDefault:"Reading left to right gives nonsense: the template’s 3′ end is on the right, so the mRNA reads 5′-AUG GCC AAG UAA-3′.",
            why:"Read from the template’s 3′ end: 3′-TAC CGG TTC ATT-5′ → mRNA 5′-AUG GCC AAG UAA-3′: Met–Ala–Lys.",
            hints:["Find the template’s 3′ end.", "Read the template from its 3′ end: 3′-TAC CGG TTC ATT-5′.", "mRNA 5′-AUG GCC AAG UAA-3′: Met–Ala–Lys."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Olena", how:"",
        instruction:"Olena made one mistake in each answer. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"The template strand is 3′-TAC GGA CTT ACT-5′. Find the polypeptide.",
            steps:["The mRNA is copied from the template strand.", "So the mRNA is 5′-UAC GGA CUU ACU-3′.", "Codons: UAC, GGA, CUU, ACU.", "Polypeptide: Tyr–Gly–Leu–Thr."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "These follow from step 2.", "This follows from step 2."],
            fixes:[
              { t:"Complement each base: mRNA 5′-AUG CCU GAA UGA-3′, giving Met–Pro–Glu.", ok:true, why:M1 },
              { t:"Swap T for U only.", why:"That’s what she did. " + M1 },
              { t:"Read the template 5′ → 3′ instead.", why:"The direction isn’t the problem: each base must be complemented." },
              { t:"Step 2 is correct.", why:"Then the protein wouldn’t start with Met. " + M1 }],
            hints:["Is the mRNA the same as the template or complementary to it?", "Complementary.", "5′-AUG CCU GAA UGA-3′."] },
          { id:"e2", goal:2, task:"Describe one elongation cycle.",
            steps:["A charged tRNA matching the codon enters the A site.", "The new amino acid is moved onto the chain held in the A site.", "The ribosome moves one codon toward the 3′ end.", "The empty tRNA leaves from the E site."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 is correct, but there’s an earlier mistake.", "Step 4 is correct."],
            fixes:[
              { t:"The growing chain (held by the P-site tRNA) is joined onto the amino acid on the A-site tRNA by a peptide bond.", ok:true, why:M4 },
              { t:"The chain is held in the E site.", why:"The E site holds the empty tRNA on its way out. " + M4 },
              { t:"The amino acid is moved onto the mRNA.", why:"Amino acids never join the mRNA." },
              { t:"Step 2 is correct.", why:"The chain is in the P site, and it moves to the A-site tRNA, not the other way round." }],
            hints:["Where is the chain before the bond forms?", "In the P site.", "Chain moves onto the A-site amino acid."] },
          { id:"e3", goal:3, task:"How many amino acids does 5′-GC AUG AAA UUU UAA-3′ code for?",
            steps:["Translation starts at AUG.", "Codons from AUG: AUG, AAA, UUU, UAA.", "Each codon gives one amino acid, so there are 4.", "Met–Lys–Phe–stop."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "This follows from step 3."],
            fixes:[
              { t:"UAA is a stop and adds no amino acid: 3 amino acids, Met–Lys–Phe.", ok:true, why:M6 },
              { t:"Count the bases: 14 ÷ 3.", why:M6 },
              { t:"Include GC: 5 amino acids.", why:M2 },
              { t:"Step 3 is correct.", why:"A stop codon has no tRNA." }],
            hints:["What does UAA code for?", "Nothing: it’s a stop.", "3 amino acids."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the assembly line: that the chain moves onto the new tRNA, or that bacteria translate while still transcribing?" },
      { id:"j2", q:"In your own words, explain what the A, P and E sites each do." },
      { id:"j3", q:"Explain to a friend how to get from a template strand to a polypeptide without the usual mistake." },
      { id:"j4", q:"Which step of translation is still fuzzy? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which ribosome site holds the tRNA carrying the growing chain, just after translocation?", options:[
          { t:"The P site", ok:true, why:"After translocation, the tRNA holding the chain sits in the P site." },
          { t:"The A site", why:"The A site is where new tRNAs arrive." },
          { t:"The E site", why:"Empty tRNAs leave from E." },
          { t:"The small subunit’s mRNA groove", why:"That holds the mRNA, not a tRNA." }] },
        b:{ prompt:"Which ribosome site does a new charged tRNA enter?", options:[
          { t:"The A site", ok:true, why:"New charged tRNAs arrive in the A site." },
          { t:"The P site", why:M4 },
          { t:"The E site", why:"That’s the exit." },
          { t:"Any free site", why:"New tRNAs enter only at A." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What happens when a stop codon reaches the A site?", options:[
          { t:"A release factor binds and the polypeptide is released from the last tRNA", ok:true, why:M3 },
          { t:"A tRNA with a matching anticodon adds a final amino acid", why:M3 },
          { t:"The ribosome skips to the next AUG", why:"It ends; it doesn’t skip." },
          { t:"The mRNA is cut at the stop codon", why:"The chain is released; the mRNA isn’t cut." }] },
        b:{ prompt:"What happens during translocation?", options:[
          { t:"The ribosome moves one codon toward the mRNA’s 3′ end, shifting the tRNAs from A to P and from P to E", ok:true, why:"That frees the A site for the next tRNA." },
          { t:"The tRNA moves its amino acid to the mRNA", why:"Amino acids never join the mRNA." },
          { t:"The ribosome moves toward the 5′ end", why:"Reading is 5′ → 3′." },
          { t:"A peptide bond forms", why:"That happens just before translocation." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"mRNA: 5′-GA AUG GCA UGU AAA UGA-3′. What is the polypeptide?", options:[
          { t:"Met–Ala–Cys–Lys", ok:true, why:"Start at AUG; UGA stops." },
          { t:"Met–Ala–Cys–Lys–stop", why:"The stop adds no amino acid." },
          { t:"Glu–Trp–His–…", why:"Translation starts at AUG, not at the first base." },
          { t:"Met–Ala–Cys", why:"AAA (Lys) comes before the stop." }] },
        b:{ prompt:"mRNA: 5′-CC AUG CCU GAA UUC UAG-3′. What is the polypeptide?", options:[
          { t:"Met–Pro–Glu–Phe", ok:true, why:"Start at AUG; UAG stops." },
          { t:"Met–Pro–Glu–Phe–stop", why:M6 },
          { t:"Pro–Cys–Leu–…", why:"Translation starts at AUG, not at the first base." },
          { t:"Met–Pro–Glu", why:"UUC (Phe) comes before the stop." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"The template strand of a gene is 3′-TAC CGG TTT ATC-5′. What polypeptide does it code for?", options:[
          { t:"Met–Ala–Lys", ok:true, why:"mRNA 5′-AUG GCC AAA UAG-3′." },
          { t:"Tyr–Arg–Phe–Ile", why:"That reads the template as if it were mRNA." },
          { t:"Met–Ala–Lys–Ile", why:"ATC on the template becomes UAG, a stop." },
          { t:"Met–Gly–Phe", why:"Complement CGG to GCC (Ala) and TTT to AAA (Lys)." }] },
        b:{ prompt:"The template strand of a gene is 3′-TAC GGA CTT ACT-5′. What polypeptide does it code for?", options:[
          { t:"Met–Pro–Glu", ok:true, why:"mRNA 5′-AUG CCU GAA UGA-3′." },
          { t:"Tyr–Gly–Leu–Thr", why:M1 },
          { t:"Met–Pro–Glu–Thr", why:"ACT on the template becomes UGA, a stop." },
          { t:"Met–Gly–Leu", why:"Complement each base first." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Ribosomes load onto an mRNA every 5 s, and each one takes 30 s to make a complete polypeptide. The first loads at time 0. How many polypeptides are finished at 60 s?", options:[
          { t:"7", ok:true, why:"Ribosomes loading at 0, 5, …, 30 s finish by 60 s: 7 of them." },
          { t:"12", why:"12 ribosomes have loaded by 55 s, but most haven’t finished." },
          { t:"2", why:"Ribosomes work at the same time, not one after another." },
          { t:"1", why:"Each ribosome makes its own copy." }] },
        b:{ prompt:"Ribosomes load every 4 s, and each takes 40 s to make a polypeptide. The first loads at 0. How many are finished at 60 s?", options:[
          { t:"6", ok:true, why:"Those loading at 0, 4, …, 20 s finish by 60 s." },
          { t:"15", why:"15 have loaded by 56 s, but most aren’t done." },
          { t:"1", why:M5 },
          { t:"3", why:"Count loadings from 0 to 20 s in steps of 4." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"A bacterium has a mutant release factor that can’t bind UAG. A gene in this bacterium ends with UAG. What is the most likely result for that protein?", options:[
          { t:"The ribosome stalls at UAG and the polypeptide is not released", ok:true, why:"No tRNA reads UAG, and the release factor can’t." },
          { t:"The protein is released normally because UAG is a stop", why:"A stop codon works only when a release factor binds it." },
          { t:"A tyrosine is added at UAG", why:"UAU and UAC are Tyr; no tRNA reads UAG." },
          { t:"The ribosome jumps back to AUG and starts again", why:"Ribosomes don’t jump backward." }] },
        b:{ prompt:"A drug stops tRNAs from leaving the E site. What happens to translation?", options:[
          { t:"After a cycle or two, translocation is blocked and the ribosome stalls", ok:true, why:"The E site stays full, so the tRNAs can’t shift along." },
          { t:"Nothing: tRNAs aren’t needed after the bond forms", why:"They must leave to make room." },
          { t:"The ribosome reads the next codon twice", why:"It can’t move at all." },
          { t:"New tRNAs enter the E site instead", why:"New tRNAs enter only at A." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best description of one elongation cycle?", options:[
          { t:"“A charged tRNA pairs with the codon in the A site; the chain on the P-site tRNA joins its amino acid by a peptide bond; the ribosome moves one codon, so the empty tRNA leaves from E.”", ok:true, why:M4 },
          { t:"“A tRNA in the P site brings an amino acid, which joins the A-site chain, and the ribosome moves backward.”", why:M4 },
          { t:"“The ribosome reads the whole mRNA, then all the amino acids join at once.”", why:"The chain grows one amino acid per codon." },
          { t:"“The mRNA moves through the tRNA, which builds the chain.”", why:"The ribosome joins amino acids; tRNAs deliver them." }] },
        b:{ prompt:"Which is the best description of initiation?", options:[
          { t:"“The small subunit binds the mRNA and finds the first AUG; the Met-tRNA pairs with it in the P site; then the large subunit joins.”", ok:true, why:"Small subunit first, then the Met-tRNA in the P site, then the large subunit." },
          { t:"“The large subunit finds the AUG; the small subunit joins last.”", why:"The small subunit binds first." },
          { t:"“Initiation starts at the first base of the mRNA.”", why:M2 },
          { t:"“The Met-tRNA enters the A site first.”", why:M4 }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which flow chart is correct for a human cell making a protein that is secreted?", options:[
          { t:"DNA (nucleus) → mRNA (processed, leaves the nucleus) → ribosome on rough ER → protein into the ER → Golgi → secreted", ok:true, why:"Proteins for export are made on ribosomes bound to the rough ER." },
          { t:"DNA → protein → mRNA → secreted", why:"mRNA comes before protein." },
          { t:"DNA (cytoplasm) → mRNA → ribosome on smooth ER → secreted", why:"Human DNA is in the nucleus, and ribosomes stud the <strong>rough</strong> ER." },
          { t:"mRNA (nucleus) → DNA → protein", why:"Information flows DNA → RNA → protein." }] },
        b:{ prompt:"Which flow chart is correct for a bacterium?", options:[
          { t:"DNA (cytoplasm) → mRNA, with ribosomes translating it while it is still being made → protein", ok:true, why:"No nucleus, so translation can begin before transcription ends." },
          { t:"DNA (nucleus) → mRNA leaves the nucleus → ribosome → protein", why:"Bacteria have no nucleus." },
          { t:"DNA → protein, with no mRNA", why:"mRNA is always the go-between." },
          { t:"DNA → mRNA (introns spliced out) → protein", why:"Bacteria don’t splice." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Streptomycin binds the small subunit of bacterial ribosomes. Why can it treat a bacterial infection without stopping protein synthesis in the patient’s cells?", options:[
          { t:"Bacterial ribosomes (70S) differ in structure from human cytoplasmic ribosomes (80S), so the drug binds only the bacterial ones", ok:true, why:"Different shapes: the drug fits only the bacterial ribosome." },
          { t:"Human cells don’t make proteins while they’re infected", why:"They do." },
          { t:"Humans have no small ribosomal subunit", why:"Both kinds have two subunits." },
          { t:"Streptomycin only works on mRNA with introns", why:"It acts on ribosomes, not on introns." }] },
        b:{ prompt:"Erythromycin binds the large subunit of bacterial ribosomes. Why can it treat infections safely?", options:[
          { t:"The bacterial large subunit differs from the human one, so the drug blocks bacterial translation but not human cytoplasmic translation", ok:true, why:"Different shapes: the drug fits only the bacterial large subunit." },
          { t:"Human ribosomes have no large subunit", why:"They do; it’s a different shape." },
          { t:"Erythromycin destroys bacterial DNA", why:"It acts on ribosomes." },
          { t:"Bacteria don’t need ribosomes", why:"Every cell needs ribosomes to make proteins." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"To make human insulin in bacteria, scientists insert a copy of the insulin gene made from mRNA (cDNA), not the gene cut from human DNA. Why?", options:[
          { t:"The human gene has introns, and bacteria can’t splice them out; cDNA has no introns", ok:true, why:M7 },
          { t:"Bacteria can’t read DNA", why:"They read their own DNA all the time." },
          { t:"The human gene has no start codon", why:"It does." },
          { t:"mRNA can’t be turned into DNA", why:"Reverse transcriptase does exactly that." }] },
        b:{ prompt:"A human gene inserted into bacteria, introns included, produces a wrong, usually much shorter protein. What is the best explanation?", options:[
          { t:"Bacteria have no spliceosomes, so the introns are translated as if they were coding sequence, and they often contain early stop codons", ok:true, why:M7 },
          { t:"Bacteria use a different genetic code", why:"The code is nearly universal." },
          { t:"Bacterial ribosomes skip introns automatically", why:"They can’t recognise introns." },
          { t:"Introns are removed by bacterial ribosomes but the exons are too", why:"Ribosomes don’t cut RNA." }] } }
    ]
  },
  task:{
    title:"One message, two codes", summary:"One message, two codes",
    statement:"<p>Human mitochondria read a few codons differently: UGA means Trp, and AGA and AGG mean stop. Design a 4-codon mRNA that gives the same polypeptide, Met–Pro–Trp, in both the cytoplasm and a mitochondrion. Can you find all the answers?</p><ol class=\"ps-conds\"><li>The first codon is AUG.</li><li>In the standard code, the message makes Met–Pro–Trp and then stops.</li><li>In the mitochondrial code, the message makes Met–Pro–Trp and then stops.</li></ol>",
    checks:["Starts with AUG", "Standard code: Met–Pro–Trp, then stop", "Mitochondrial code: Met–Pro–Trp, then stop"],
    tips:["Translation needs a start.",
      "Which codons are Pro? Which single codon is Trp in the standard code?",
      "UGA is Trp in mitochondria but a stop in the cytoplasm. Which stop codons are stops in both?"],
    mito:"Human mitochondria: UGA = Trp; AGA, AGG = stop; AUA = Met.",
    explainPrompt:"Explain why some codons work in both codes and others don’t, and what this tells you about how universal the genetic code is.",
    vocab:"Use the words codon, stop codon, genetic code and mitochondria.",
    success:"Your message works in both codes!",
    more:"Can you find all the answers?",
    afterAt:8,
    after3:"Proline’s four codons all work, because the third base doesn’t matter for Pro. The stop must be UAA or UAG: UGA would be read as Trp in a mitochondrion."
  },
  cards:[
    ["Transcription", "DNA → mRNA; in the nucleus of a eukaryote."],
    ["Translation", "mRNA → polypeptide, at a ribosome; reads 5′ → 3′."],
    ["Start codon", "AUG (Met). Translation begins at the first AUG."],
    ["Stop codons", "UAA, UAG, UGA: no tRNA; a release factor frees the chain."],
    ["A site", "Where a new charged tRNA arrives."],
    ["P site", "Holds the tRNA carrying the growing chain."],
    ["E site", "Where empty tRNAs exit."],
    ["Peptide bond", "Joins the chain to the next amino acid; made by the ribosome’s rRNA."],
    ["Translocation", "The ribosome moves one codon toward the 3′ end."],
    ["Polyribosome", "Many ribosomes on one mRNA, each making its own copy."],
    ["Template vs coding strand", "mRNA is complementary to the template and matches the coding strand (U for T)."],
    ["70S vs 80S", "Bacterial vs human cytoplasmic ribosomes: different enough for antibiotics to target bacteria."]
  ]
};
