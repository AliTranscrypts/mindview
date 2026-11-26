// SBI4U 23 Transcription. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/23-transcription.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "Polymerase reads the <strong>template</strong> strand. The mRNA is complementary to it, so it matches the <strong>coding</strong> strand (with U for T).";
const M2 = "mRNA is built 5′ → 3′ and is antiparallel to the template.";
const M3 = "RNA uses U where DNA uses T.";
const M4 = "RNA polymerase unwinds the DNA itself and starts a new chain without a primer.";
const M5 = "<strong>In</strong>trons stay <strong>in</strong> the nucleus (they’re cut out); <strong>ex</strong>ons are <strong>ex</strong>pressed.";
const M6 = "Prokaryotes have no nucleus: ribosomes can start on mRNA while it’s still being made, and there’s usually no processing.";
const M7 = "The promoter sets the direction. A gene elsewhere can use the other strand.";
// sequences in the monospace font (course plan §2)
const sq = s => '<span class="tx-sq">' + s + "</span>";

export default {
  id:"23-transcription",
  kind:"topic",
  title:"Transcription",
  topic:"Transcription",
  readyTopic:"transcription",
  hero:{
    eq:'<span class="tx-heq"><span class="tx-sq tx-hc">5′-ATGAAACGC-3′</span><span class="tx-sq tx-ht">3′-TACTTTGCG-5′</span><span class="tx-sq tx-hm">5′-A<b>U</b>GAAACGC-3′</span></span>',
    eqLabel:"Coding strand 5′ A T G A A A C G C 3′; template strand 3′ T A C T T T G C G 5′; mRNA 5′ A U G A A A C G C 3′",
    eqSize:"sm",
    headline:"Read one strand, match the other",
    text:"To make a protein, a cell first copies a gene into <strong>messenger RNA</strong>. <strong>RNA polymerase</strong> reads the <strong>template strand</strong> and builds an mRNA that pairs with it, so the mRNA ends up with the same sequence as the <strong>coding strand</strong>, except that RNA uses <strong>U</strong> instead of T. In eukaryotes, the mRNA is then trimmed and finished before it leaves the nucleus.",
    fig:{ html:'<div class="tx-hero" id="tx-hero" role="img" aria-label="A DNA segment with a highlighted promoter. RNA polymerase lands on the promoter and opens a bubble in the DNA. A teal mRNA strand peels off behind the polymerase, growing at its 3′ end, while the DNA rewinds behind the bubble. At the terminator the polymerase falls off and the mRNA drifts away."></div>' }
  },
  goals:[
    "I can explain which strand RNA polymerase reads, in which direction, and how the mRNA relates to the template and coding strands.",
    "I can write the mRNA transcribed from a given template or coding strand, with 5′ and 3′ ends.",
    "I can describe initiation, elongation and termination, including the promoter, TATA box and terminator.",
    "I can describe pre-mRNA processing (cap, tail, splicing) and calculate mature mRNA lengths.",
    "I can compare DNA with RNA, and transcription in prokaryotes with eukaryotes.",
    "I can apply transcription and splicing to mutations, alternative splicing and biotechnology."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"DNA vs RNA", goal:5,
          prompt:"Which of these is true of RNA but <strong>not</strong> DNA?",
          options:[
            { t:"It contains uracil and the sugar ribose", ok:true, why:"RNA swaps one base (U for T) and one sugar (ribose for deoxyribose)." },
            { t:"It contains thymine.", why:"Thymine is DNA’s base." },
            { t:"It is always double-stranded.", why:"RNA is usually single-stranded." },
            { t:"It has a sugar–phosphate backbone.", why:"Both have one." }],
          hints:["Compare the sugars and the bases.", "RNA swaps one base and one sugar.", "Uracil and ribose."] },
        { id:"w2", skill:"DNA vs RNA", goal:5,
          prompt:"Which type of RNA carries a gene’s message to the ribosome?",
          options:[
            { t:"mRNA (messenger RNA)", ok:true, why:"Messenger RNA carries the copy of the gene." },
            { t:"tRNA", why:"tRNA carries amino acids." },
            { t:"rRNA", why:"rRNA is part of the ribosome itself." },
            { t:"DNA", why:"DNA stays in the nucleus." }],
          hints:["Which word means “message”?", "Messenger.", "mRNA."] },
        { id:"w3", skill:"Base pairing and direction", goal:2,
          prompt:"Which RNA base pairs with adenine on a DNA template?",
          options:[
            { t:"Uracil", ok:true, why:"In RNA, U takes T’s place." },
            { t:"Thymine", why:"RNA doesn’t contain T." },
            { t:"Adenine", why:"Pairs are complementary." },
            { t:"Guanine", why:"G pairs with C." }],
          hints:["In DNA, A pairs with T.", "What replaces T in RNA?", "U."] },
        { id:"w4", skill:"Base pairing and direction", goal:1,
          prompt:"Any polymerase builds a new nucleic acid strand in which direction?",
          options:[
            { t:"5′ → 3′", ok:true, why:"It adds to the 3′ end." },
            { t:"3′ → 5′", why:"Nothing is ever built 3′ → 5′." },
            { t:"Either, depending on the strand", why:"The rule is the same for DNA and RNA polymerase." },
            { t:"From the middle outward", why:"Each chain grows only at its 3′ end." }],
          hints:["Recall module 22.", "New nucleotides join the 3′ –OH.", "5′ → 3′."] },
        { id:"w5", skill:"Cell structures", goal:5,
          prompt:"Where does transcription happen in a eukaryotic cell?",
          options:[
            { t:"In the nucleus", ok:true, why:"The DNA is there." },
            { t:"At the ribosomes", why:"That’s translation." },
            { t:"In the cytoplasm", why:"Prokaryotes transcribe in the cytoplasm because they have no nucleus." },
            { t:"In the Golgi apparatus", why:"The Golgi packages proteins." }],
          hints:["Where is the DNA kept?", "Inside a membrane-bound compartment.", "The nucleus."] },
        { id:"w6", skill:"Cell structures", goal:5,
          prompt:"Why can’t a bacterium separate transcription from translation the way a eukaryotic cell does?",
          options:[
            { t:"It has no nucleus, so its ribosomes reach the mRNA as soon as it’s made", ok:true, why:"No nuclear envelope stands between its DNA and its ribosomes." },
            { t:"It has no ribosomes.", why:"Bacteria have ribosomes (smaller ones)." },
            { t:"It has no DNA.", why:"Bacteria have DNA (one circular chromosome)." },
            { t:"It makes no mRNA.", why:"Bacteria make mRNA." }],
          hints:["What wall separates DNA from ribosomes in your cells?", "The nuclear envelope.", "Bacteria don’t have one."] }
      ],
      refreshers:{
        "DNA vs RNA":"RNA has ribose and uracil and is usually single-stranded. mRNA carries the message, tRNA carries amino acids, rRNA builds ribosomes.",
        "Base pairing and direction":"DNA A pairs with RNA U; T with A; G with C. All chains grow 5′ → 3′.",
        "Cell structures":"Eukaryotes transcribe in the nucleus and translate in the cytoplasm. Prokaryotes do both in the cytoplasm, at the same time."
      }
    }
  },
  explore:{
    heading:"Transcription machine",
    intro:"Choose a gene, decide which strand is the template, then step RNA polymerase through the gene. In eukaryote mode, finish the message: cap it, tail it and splice it.",
    // genes as data (plan §5): coding strand 5′ → 3′. dir 1 = promoter on the left, pointing right (template = bottom strand);
    // dir −1 = promoter on the right, pointing left (template = top strand). Gene E's segments: e = exon, i = intron.
    genes:{
      P:{ name:"Gene P", coding:"ATGAAACGCTAA", dir:1 },
      Q:{ name:"Gene Q (further along)", coding:"ATGGGATAA", dir:-1 },
      E:{ name:"Gene E", dir:1, segs:[["e", "ATGGCAAAC"], ["i", "GTAAGCAG"], ["e", "TGGCAT"], ["i", "GTCCTTAG"], ["e", "GAATAA"]] }
    },
    model:"Model genes: Gene E’s introns are only 8 nucleotides so the screen stays readable. Real introns are usually hundreds to thousands of nucleotides long.",
    msgs:{
      refuse:"The promoter points the other way. RNA polymerase binds so that it reads this gene’s template 3′ → 5′.",
      notGene:"This isn’t the gene’s message.",
      choose:"Choose a template strand first.",
      readyExport:"Ready for export"
    },
    predIntro:"Make a prediction first. Then the machine will show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Gene P; the coding strand reads " + sq("5′-ATGAAACGC…-3′") + ". The mRNA will begin…",
        options:[{ t:sq("5′-AUGAAACGC…-3′"), ok:true }, { t:sq("5′-UACUUUGCG…-3′") }, { t:sq("5′-ATGAAACGC…-3′") }, { t:sq("3′-AUGAAACGC…-5′") }],
        explain:"Same as the coding strand, with U for T, and written 5′ → 3′.",
        reveal:"The mRNA grows letter by letter, matching the coding strand with U for T." },
      { id:"p2", prompt:"Initiation on Gene P. What does RNA polymerase need before it starts?",
        options:[{ t:"Only the promoter: it unwinds the DNA and starts without a primer", ok:true }, { t:"An RNA primer from primase" }, { t:"Helicase to open the DNA first" }, { t:"A DNA primer" }],
        explain:"Unlike DNA polymerase, RNA polymerase can start a chain from scratch.",
        reveal:"Polymerase binds the promoter, opens a bubble and begins: no primer, no helicase." },
      { id:"p3", prompt:"Gene E after transcription (37 nt). After both introns (8 nt each) are spliced out, how long is the coding part of the mature mRNA?",
        options:[{ t:"21 nt", ok:true }, { t:"29 nt" }, { t:"16 nt" }, { t:"37 nt" }],
        explain:"37 − 8 − 8 = 21; the exons (9 + 6 + 6) remain.",
        reveal:"The two grey introns are removed; the counter reads 21 nt." },
      { id:"p4", prompt:"A second gene, drawn further along the same DNA, has its promoter on the other strand, pointing left. Which strand is its template?",
        options:[{ t:"The other strand: its promoter makes polymerase read the top strand this time", ok:true }, { t:"The same bottom strand" }, { t:"Both strands at once" }, { t:"Neither" }],
        explain:"Each gene’s promoter sets the direction, so different genes can use different strands.",
        reveal:"Polymerase binds facing left and reads the top strand." }
    ],
    chalIntro:"Use the machine to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 2], prompt:"Transcribe Gene P so the mRNA reads " + sq("5′-AUGAAACGCUAA-3′") + ".",
        why:"The bottom strand is the template, so the mRNA " + sq("5′-AUGAAACGCUAA-3′") + " matches the top (coding) strand, with U for T.",
        general:"Choose Prokaryote mode and Gene P, pick a template strand, then step the polymerase to the terminator.",
        msgs:{ top:"That gives " + sq("5′-UUAGCGUUUCAU-3′") + ": the polymerase must read the template, not the coding strand.", unfinished:"The message isn’t finished.", gene:"Choose Prokaryote mode and Gene P." },
        hints:["Which strand pairs with the mRNA you want?", "The mRNA matches the top strand, so the bottom one is the template.", "Choose the bottom strand and run to the end."] },
      { id:"tc2", goal:4, prompt:"Make Gene E’s mature mRNA: 21 coding nucleotides, starting with AUG, capped and tailed.",
        why:"Both introns are out and all three exons are joined: " + sq("AUG GCA AAC UGG CAU GAA UAA") + " (Met–Ala–Asn–Trp–His–Glu–stop), with a cap and a tail.",
        general:"Choose Eukaryote mode, transcribe Gene E to the terminator, then use the processing controls.",
        msgs:{ intron:"An intron is still in; its bases would be read as codons.", exon:"That’s an exon. Exons stay; introns go.", capTail:"Without a cap and tail, the mRNA isn’t ready to leave the nucleus.", gene:"Choose Eukaryote mode (Gene E).", tpl:"Transcribe Gene E from its template (the bottom strand) first.", unfinished:"Transcribe Gene E to the terminator first." },
        hints:["Which segments are introns?", "The two grey segments that begin GU and end AG.", "Remove both introns, add the cap and tail."] },
      { id:"tc3", goal:[4, 6], stretch:true, prompt:"Alternative splicing: from Gene E, make a different finished mRNA that <strong>still starts at AUG and ends with a stop codon in the same reading frame</strong>, but codes for a <strong>shorter protein</strong> than TC2’s.",
        why:"Exon 2 is 6 nt, two whole codons, so skipping it keeps the frame: " + sq("AUG GCA AAC GAA UAA") + " (Met–Ala–Asn–Glu–stop).",
        general:"Transcribe Gene E, remove the introns, add the cap and tail, then choose which exons to keep.",
        msgs:{ e1:"No AUG start.", e3:"AUG GCA AAC UGG CAU has no stop codon.", intron:"The intron’s bases get read as codons.", full:"That’s the full-length one.", capTail:"Without a cap and tail, the mRNA isn’t ready to leave the nucleus." },
        hints:["Which exon could go without losing the start or the stop?", "Exon 2 (6 nt) is a whole number of codons, so skipping it keeps the frame.", "Exons 1 + 3: AUG GCA AAC GAA UAA."] }
    ]
  },
  part3:{
    slug:"processing", name:"Processing", heading:"Pre-mRNA to mRNA",
    intro:"In eukaryotes the first transcript is finished in the nucleus before it is exported. Work through the five stations: cap and tail, a splicing puzzle, one gene with many proteins, a comparison, and the experiment that revealed introns.",
    panel:"Zoom to the molecules",
    s1:{ title:"Station 1: cap and tail",
      text:"A modified guanine (the <strong>5′ cap</strong>) is attached to the front of the pre-mRNA. After a signal sequence (" + sq("AAUAAA") + "), 50–250 A’s (the <strong>poly-A tail</strong>) are added at the back. Switch each one off to see what happens in the model cytoplasm.",
      card:"<strong>Cap and tail:</strong> protection (enzymes in the cytoplasm can’t chew the ends), export from the nucleus, and ribosome binding (the ribosome loads at the cap)." },
    s2:{ title:"Station 2: splicing puzzle",
      text:"Each pre-mRNA has one intron hidden in it. Tap the nucleotide where the intron <strong>starts</strong>, then the one where it <strong>ends</strong>, and press Check. (Arrow keys move along the strand; Enter marks a boundary.)",
      rule:"<strong>Rule card:</strong> introns begin <strong>GU</strong> and end <strong>AG</strong>. The <strong>spliceosome</strong> (made of small RNA–protein particles) cuts them out and joins the exons. Cells also use the sequences around each boundary, so a GU on its own doesn’t always mark an intron. In these puzzles, the right choice is the only GU…AG that keeps the reading frame from AUG to a stop codon.",
      puzzles:[
        { id:"z1", pre:"AUGCCAAACGUACUCAUCCAGUUCGGAUGA", answer:[9, 20] },
        { id:"z2", pre:"AUGCGUAACGUCCUUCAUCAGGAAUUCUAA", answer:[9, 20], decoy:true }
      ] },
    s3:{ title:"Station 3: one gene, many proteins",
      text:"This gene has 4 exons. Exons 1 and 4 are always kept; exons 2 and 3 can each be included or skipped. Find all four mRNAs.",
      exons:["AUGUCC", "AAAGAU", "CCG", "UUUUGA"],
      card:"Humans have about 20 000 protein-coding genes but make many more kinds of protein, partly through <strong>alternative splicing</strong>." },
    s4:{ title:"Station 4: prokaryote vs eukaryote",
      head:["Feature", "Prokaryote", "Eukaryote"],
      rows:[["Where", "Cytoplasm", "Nucleus"], ["RNA polymerase", "One kind", "Several; RNA polymerase II makes mRNA"], ["Introns", "Usually none", "Common"],
        ["Cap and tail", "No", "Yes"], ["Translation starts", "While transcription continues", "After processing and export"], ["Genes per mRNA", "Often several (operons, module 26)", "Usually one"]] },
    s5:{ title:"Station 5: evidence for introns (Check it with data)",
      text:"A mature mRNA is mixed with single-stranded DNA from its gene, and the hybrid is viewed under a microscope. Where the mRNA pairs with the DNA, they form a double strand; where the DNA has no partner, it bulges out as single-stranded loops.",
      qs:[
        { id:"h1", q:"How many introns does this gene have?", chips:[{ t:"3", ok:true, fb:"Each loop is intron DNA with no mRNA partner." }, { t:"4", fb:"Count the loops: each one is an intron." }, { t:"2", fb:"Count every single-stranded loop." }, { t:"0", fb:"The loops are DNA with no partner in the mRNA: introns." }] },
        { id:"h2", q:"So how many exons?", chips:[{ t:"4", ok:true, fb:"3 introns separate 4 exons." }, { t:"3", fb:"There’s one more exon than introns between them." }, { t:"7", fb:"Count only the paired (double-stranded) stretches." }, { t:"2", fb:"Count the paired stretches between and around the loops." }] }
      ] },
    blocks:[
      { title:"Why it matters", html:"<p><strong>A Canadian connection.</strong> Insulin was discovered at the University of Toronto in 1921–22 by Frederick Banting, Charles Best, J. J. R. Macleod and James Collip. Today, most insulin for people with diabetes is made by microbes given a DNA copy of the human gene made <strong>from its mature mRNA</strong>, so it has no introns that a bacterium couldn’t splice out (Final Check A2; module 33).</p>" }
    ],
    quickCheck:{
      title:"Quick check", summary:"Pre-mRNA to mRNA quick check",
      items:[
        { id:"q1", goal:4, prompt:"Which part of pre-mRNA is removed by splicing?",
          choices:[{ t:"Introns", ok:true, fb:"Right: introns are cut out and the exons are joined." }, { t:"Exons", fb:"Exons are expressed; introns are cut out." },
            { t:"The cap", fb:"Exons are expressed; introns are cut out." }, { t:"The start codon", fb:"Exons are expressed; introns are cut out." }] },
        { id:"q2", goal:4, prompt:"An mRNA–DNA hybrid shows 2 single-stranded DNA loops. How many introns?",
          choices:[{ t:"2", ok:true, fb:"Right: each loop is unpaired intron DNA." }, { t:"3", fb:"Each loop is unpaired intron DNA." },
            { t:"1", fb:"Each loop is unpaired intron DNA." }, { t:"4", fb:"Each loop is unpaired intron DNA." }] },
        { id:"q3", goal:4, prompt:"Which is added to the 3′ end of eukaryotic pre-mRNA?",
          choices:[{ t:"A poly-A tail", ok:true, fb:"Right: the tail goes on the 3′ end." }, { t:"A 5′ cap", fb:"The cap goes on the 5′ end." },
            { t:"A primer", fb:"The cap goes on the 5′ end; the tail goes on the 3′ end. Transcription needs no primer." }, { t:"A promoter", fb:"The promoter is DNA where transcription starts; the tail goes on the 3′ end." }] },
        { id:"q4", goal:5, prompt:"Why can a bacterium translate an mRNA before it’s finished?",
          choices:[{ t:"No nucleus separates them", ok:true, fb:"Right: without a nuclear envelope, ribosomes reach the mRNA at once." }, { t:"It has no introns", fb:"Without a nuclear envelope, ribosomes reach the mRNA at once." },
            { t:"Its mRNA is DNA", fb:"Without a nuclear envelope, ribosomes reach the mRNA at once." }, { t:"Its ribosomes are in the nucleus", fb:"Without a nuclear envelope, ribosomes reach the mRNA at once." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"terms", type:"match", title:"Term ↔ job", summary:"Term ↔ job", goal:[3, 4, 5],
        instruction:"Tap a term, then tap the job it does.",
        leftTitle:"Term", rightTitle:"Job",
        left:[
          { id:"l1", t:"Promoter" },
          { id:"l2", t:"TATA box" },
          { id:"l3", t:"Template strand" },
          { id:"l4", t:"Coding strand", hints:["Which strand looks like the message?", "The one the mRNA is <strong>not</strong> paired with.", "The coding strand."] },
          { id:"l5", t:"Terminator" },
          { id:"l6", t:"5′ cap" },
          { id:"l7", t:"Spliceosome" },
          { id:"l8", t:"Exon" }],
        right:[
          { id:"r1", t:"DNA sequence where RNA polymerase binds to start a gene" },
          { id:"r2", t:"Part of many eukaryotic promoters, recognized by transcription factors" },
          { id:"r3", t:"The strand RNA polymerase reads, 3′ → 5′" },
          { id:"r4", t:"Has the same sequence as the mRNA (T instead of U)" },
          { id:"r5", t:"Signal where transcription stops (in prokaryotes)" },
          { id:"r6", t:"Modified G that protects the mRNA and helps the ribosome bind" },
          { id:"r7", t:"Complex that removes introns and joins exons" },
          { id:"r8", t:"Part of the pre-mRNA kept in the mature mRNA" }],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l3|r4":"Polymerase reads the template; the mRNA matches the coding strand.",
          "l4|r3":"Polymerase reads the template; the mRNA matches the coding strand.",
          "l8|r7":"Exons are expressed; introns are removed.",
          "l1|r5":"The promoter starts; the terminator stops.",
          "l5|r1":"The promoter starts; the terminator stops."
        },
        wrongDefault:"Think about where in the process this acts." },
      { id:"seqs", type:"custom", title:"Sequence tasks", summary:"Sequence tasks", star:true, goal:[2, 4, 6],
        instruction:"Six tasks. Type the bases (the 5′ and 3′ ends are written for you) or a number. Tasks 3 to 6 are non-routine (★); 4 to 6 go beyond the Final Check.",
        items:[
          { id:"s1", kind:"seq", goal:2, rna:true, prompt:"Template " + sq("3′-TACCGGATT-5′") + ". Write the mRNA, 5′ → 3′.",
            answer:"AUGGCCUAA", display:sq("5′-AUGGCCUAA-3′"),
            why:"Pair each template base (A–U, T–A, C–G, G–C); the mRNA runs 5′ → 3′, antiparallel to the template.",
            wrong:[{ match:"ATGGCCTAA", fb:"RNA uses U." }] },
          { id:"s2", kind:"seq", goal:2, rna:true, prompt:"Coding strand " + sq("5′-ATGTTTGGA-3′") + ". Write the mRNA.",
            answer:"AUGUUUGGA", display:sq("5′-AUGUUUGGA-3′"),
            why:"The mRNA matches the coding strand, with U for T.",
            wrong:[{ match:"UACAAACCU", fb:"That pairs with the coding strand; the mRNA <strong>matches</strong> it." }] },
          { id:"s3", kind:"seq", goal:2, star:true, rna:true, prompt:"Template written 5′ → 3′: " + sq("5′-TTAGCCCAT-3′") + ". Write the mRNA, 5′ → 3′.",
            answer:"AUGGGCUAA", display:sq("5′-AUGGGCUAA-3′"),
            why:"Read the template from its 3′ end (" + sq("TACCCGATT") + ") and pair each base.",
            wrong:[{ match:"AAUCGGGUA", fb:"Those bases pair correctly, but that’s written 3′ → 5′. Reverse it." }],
            hints:["Polymerase reads the template 3′ → 5′, so start from the template’s 3′ end.", "Read " + sq("5′-TTAGCCCAT-3′") + " backwards: " + sq("TACCCGATT") + ", and pair each base.", sq("5′-AUGGGCUAA-3′") + "."] },
          { id:"s4", kind:"seq", goal:2, star:true, rna:false, prompt:"An mRNA reads " + sq("5′-AUGCCAUGA-3′") + ". Write its <strong>template</strong> strand, 5′ → 3′.",
            answer:"TCATGGCAT", display:sq("5′-TCATGGCAT-3′"),
            why:"The coding strand is " + sq("5′-ATGCCATGA-3′") + "; its partner, written 5′ → 3′, is the template.",
            wrong:[{ match:"TACGGTACT", fb:"Those are the complements in the wrong order: reverse them." }],
            hints:["The mRNA matches the coding strand.", "Coding strand: " + sq("5′-ATGCCATGA-3′") + ".", "Its partner, written 5′ → 3′: " + sq("5′-TCATGGCAT-3′") + "."] },
          { id:"s5", kind:"num", goal:4, star:true, prompt:"A gene has exons of 120, 85 and 200 nt and introns of 1500 and 900 nt. How long is the mature mRNA, not counting the cap and tail?",
            answer:405, unit:"nt", display:"405 nt",
            why:"Only the exons stay: 120 + 85 + 200 = 405 nt.",
            wrong:[{ match:2805, fb:"That’s the pre-mRNA; the introns are removed." }, { match:2400, fb:"That’s the introns." }],
            general:"Add only the exons." },
          { id:"s6", kind:"num", goal:6, star:true, prompt:"A gene has 4 exons. Exons 1 and 4 are always kept; exons 2 and 3 can each be kept or skipped. How many different mature mRNAs are possible?",
            answer:4, unit:"mRNAs", display:"4",
            why:"Each of the two optional exons has 2 choices: 2 × 2 = 4.",
            wrong:[{ match:2, fb:"Each of the two optional exons has 2 choices: 2 × 2." }],
            general:"Each of the two optional exons has 2 choices." }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Mariam", how:"",
        instruction:"Mariam made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Describe how a gene is transcribed.",
            steps:["RNA polymerase binds to the promoter.", "It unwinds a short stretch of DNA.", "It reads the coding strand and builds an mRNA complementary to it.", "At the terminator, it releases the mRNA."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 is true; the mistake is earlier."],
            fixes:[
              { t:"It reads the template strand, building an mRNA complementary to the template, which therefore matches the coding strand.", ok:true, why:M1 },
              { t:"It reads both strands and builds two mRNAs.", why:"Only the template is read, and one mRNA is made." },
              { t:"It reads the coding strand and builds DNA.", why:"Transcription builds RNA, and it reads the template." },
              { t:"Step 3 is correct.", why:M1 }],
            hints:["Which strand does the mRNA look like?", "The coding strand, with U for T.", "So the polymerase reads the other one, the template."] },
          { id:"e2", goal:2, task:"Write the mRNA for template " + sq("3′-TACGTT-5′") + ".",
            steps:["The template is read from its 3′ end: T, A, C, G, T, T.", "Pair each base, using U opposite A: A, U, G, C, A, A.", "So the mRNA is " + sq("3′-AUGCAA-5′") + ".", "Its first codon is AUG, the start codon."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 would be right if the ends in step 3 were."],
            fixes:[
              { t:"The mRNA is " + sq("5′-AUGCAA-3′") + ", antiparallel to the template.", ok:true, why:M2 },
              { t:"The mRNA is " + sq("5′-ATGCAA-3′") + ".", why:"RNA uses U." },
              { t:"The mRNA is " + sq("5′-UACGUU-3′") + ".", why:"That copies the template." },
              { t:"Step 3 is correct.", why:M2 }],
            hints:["Which end of a new RNA is made first?", "The 5′ end, opposite the template’s 3′ end.", sq("5′-AUGCAA-3′") + "."] },
          { id:"e3", goal:4, task:"Describe how a eukaryotic pre-mRNA is processed.",
            steps:["A 5′ cap is added to the front of the pre-mRNA.", "A poly-A tail is added to the 3′ end.", "The spliceosome cuts out the exons and joins the introns together.", "The mature mRNA leaves the nucleus."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 is true; the mistake is earlier."],
            fixes:[
              { t:"The spliceosome cuts out the introns and joins the exons together.", ok:true, why:M5 },
              { t:"The spliceosome cuts out the cap.", why:"The cap stays on: it protects the mRNA and helps the ribosome bind." },
              { t:"The spliceosome adds introns.", why:"Introns are already in the pre-mRNA; the spliceosome removes them." },
              { t:"Step 3 is correct.", why:M5 }],
            hints:["Which segments are <strong>ex</strong>pressed?", "Exons.", "So introns are removed."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you: that the mRNA matches the strand the polymerase <strong>doesn’t</strong> read, or how much of a gene is cut out?" },
      { id:"j2", q:"In your own words, explain how the template strand, the coding strand and the mRNA are related." },
      { id:"j3", q:"Explain to a friend how to write the mRNA when the template is given 5′ → 3′." },
      { id:"j4", q:"Which part (direction, processing, prokaryote vs eukaryote) still feels uncertain? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"An mRNA has the same base sequence (with U for T) as which DNA strand?", options:[
          { t:"The coding strand", ok:true, why:M1 },
          { t:"The template strand", why:"The mRNA is complementary to the template." },
          { t:"Neither; it’s complementary to both", why:"The two DNA strands are complementary to each other, so it can’t be." },
          { t:"Both strands", why:"The two strands have different sequences." }] },
        b:{ prompt:"RNA polymerase reads the template strand in which direction?", options:[
          { t:"3′ → 5′, building the mRNA 5′ → 3′", ok:true, why:"Template and mRNA are antiparallel, and every chain is built 5′ → 3′." },
          { t:"5′ → 3′, building the mRNA 5′ → 3′", why:"Template and mRNA are antiparallel." },
          { t:"3′ → 5′, building the mRNA 3′ → 5′", why:"Every chain is built 5′ → 3′." },
          { t:"It reads the coding strand 5′ → 3′", why:M1 }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Which statement about starting transcription is correct?", options:[
          { t:"RNA polymerase binds a promoter (with transcription factors at a TATA box in eukaryotes) and starts without a primer", ok:true, why:M4 },
          { t:"Primase lays down a primer for RNA polymerase", why:M4 },
          { t:"Helicase must open the DNA before RNA polymerase can bind", why:"RNA polymerase opens the DNA itself." },
          { t:"RNA polymerase starts at the terminator and moves backwards", why:"It starts at the promoter." }] },
        b:{ prompt:"In prokaryotes, what tells RNA polymerase to stop?", options:[
          { t:"A terminator sequence at the end of the gene", ok:true, why:"The terminator is the stop signal for transcription." },
          { t:"The stop codon UAA in the DNA", why:"Stop codons end <strong>translation</strong>, not transcription." },
          { t:"The promoter of the next gene", why:"Promoters start genes." },
          { t:"Running out of nucleotides", why:"It stops at a signal, not from a shortage." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"Which comparison of DNA and RNA is correct?", options:[
          { t:"DNA: deoxyribose, thymine, double-stranded. RNA: ribose, uracil, usually single-stranded", ok:true, why:"Sugar, base and strands all differ." },
          { t:"DNA: ribose, uracil. RNA: deoxyribose, thymine", why:"Swapped." },
          { t:"Both use thymine; only RNA uses ribose", why:"RNA uses uracil." },
          { t:"DNA is single-stranded; RNA is double-stranded", why:"The reverse." }] },
        b:{ prompt:"Which RNA is a structural part of the ribosome?", options:[
          { t:"rRNA", ok:true, why:"Ribosomal RNA and proteins build the ribosome." },
          { t:"mRNA", why:"mRNA carries the message to the ribosome." },
          { t:"tRNA", why:"tRNA brings amino acids." },
          { t:"Pre-mRNA", why:"That’s unprocessed mRNA." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"A template strand reads " + sq("3′-TACGGCATT-5′") + ". What is the mRNA?", options:[
          { t:sq("5′-AUGCCGUAA-3′"), ok:true, why:"Pair each base; the mRNA runs 5′ → 3′, antiparallel to the template." },
          { t:sq("5′-ATGCCGTAA-3′"), why:"RNA uses U." },
          { t:sq("3′-AUGCCGUAA-5′"), why:"mRNA is written 5′ → 3′ when antiparallel to this template." },
          { t:sq("5′-UACGGCAUU-3′"), why:"That copies the template’s letters." }] },
        b:{ prompt:"A template strand is written 5′ → 3′ as " + sq("5′-TTAGTGCAT-3′") + ". What is the mRNA?", options:[
          { t:sq("5′-AUGCACUAA-3′"), ok:true, why:"Read the template from its 3′ end." },
          { t:sq("5′-AAUCACGUA-3′"), why:"Correct partners, but in the wrong order." },
          { t:sq("5′-UUAGUGCAU-3′"), why:"That copies the template." },
          { t:sq("5′-ATGCACTAA-3′"), why:M3 }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"A eukaryotic gene has exons of 150, 90 and 60 nucleotides, separated by introns of 400 and 500 nucleotides. How long is the mature mRNA’s processed region (not counting cap and tail)?", options:[
          { t:"300 nucleotides", ok:true, why:"Only the exons stay: 150 + 90 + 60 = 300." },
          { t:"1200 nucleotides", why:"That’s the whole pre-mRNA." },
          { t:"900 nucleotides", why:"That’s the introns, which are removed." },
          { t:"600 nucleotides", why:"Add only the exons: 150 + 90 + 60." }] },
        b:{ prompt:"Exons of 200, 120 and 80 nucleotides; introns of 300 and 700 nucleotides. Mature length?", options:[
          { t:"400 nucleotides", ok:true, why:"Only the exons stay: 200 + 120 + 80 = 400." },
          { t:"1400 nucleotides", why:"That’s the pre-mRNA." },
          { t:"1000 nucleotides", why:"That’s the introns. " + M5 },
          { t:"800 nucleotides", why:"Add only the exons." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"A mature mRNA is paired with single-stranded DNA from its gene. Under the microscope, the hybrid shows 2 single-stranded DNA loops. What can you conclude about the gene?", options:[
          { t:"It has 2 introns and 3 exons", ok:true, why:"Each loop is intron DNA with no mRNA partner." },
          { t:"It has 2 exons and 3 introns", why:"The loops are introns. " + M5 },
          { t:"It has 2 exons and no introns", why:"Loops show DNA with no partner: introns." },
          { t:"The mRNA was damaged in 2 places", why:"Damage wouldn’t make loops of DNA." }] },
        b:{ prompt:"The hybrid shows 4 single-stranded DNA loops. How many exons does the gene have?", options:[
          { t:"5", ok:true, why:"4 introns separate 5 exons." },
          { t:"4", why:"The loops are introns." },
          { t:"3", why:"There’s always one more exon than introns between them." },
          { t:"8", why:"Count introns, then add one." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why the mRNA matches the coding strand?", options:[
          { t:"“RNA polymerase pairs RNA bases with the template strand. The coding strand is also complementary to the template, so the mRNA and the coding strand carry the same sequence, with U in the mRNA where the coding strand has T.”", ok:true, why:"It names the pairing with the template and why that makes the mRNA match the coding strand." },
          { t:"“RNA polymerase copies the coding strand directly.”", why:M1 },
          { t:"“Both strands are read, and the coding strand’s copy is kept.”", why:"Only the template is read." },
          { t:"“The mRNA is made from the coding strand and then reversed.”", why:"It’s made on the template." }] },
        b:{ prompt:"Which is the clearest way to show how a template strand, the coding strand and the mRNA line up?", options:[
          { t:"“Coding " + sq("5′-ATGGAA-3′") + " / Template " + sq("3′-TACCTT-5′") + " / mRNA " + sq("5′-AUGGAA-3′") + "”", ok:true, why:"The template runs the other way, and the mRNA matches the coding strand with U for T." },
          { t:"“Coding " + sq("5′-ATGGAA-3′") + " / Template " + sq("5′-TACCTT-3′") + " / mRNA " + sq("5′-AUGGAA-3′") + "”", why:"The template runs the other way." },
          { t:"“Coding " + sq("5′-ATGGAA-3′") + " / Template " + sq("3′-TACCTT-5′") + " / mRNA " + sq("5′-UACCUU-3′") + "”", why:M1 },
          { t:"“Coding " + sq("5′-ATGGAA-3′") + " / Template " + sq("3′-TACCTT-5′") + " / mRNA " + sq("5′-ATGGAA-3′") + "”", why:M3 }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which statement best compares transcription in prokaryotes and eukaryotes?", options:[
          { t:"“Eukaryotes transcribe in the nucleus and process the pre-mRNA (cap, tail, splicing) before export; prokaryotes transcribe in the cytoplasm, usually with no introns, and ribosomes can start translating while transcription continues.”", ok:true, why:"It compares where, processing and timing." },
          { t:"“Both cap and splice their mRNA, but only eukaryotes have ribosomes.”", why:M6 },
          { t:"“Prokaryotes remove exons; eukaryotes remove introns.”", why:M5 },
          { t:"“Prokaryotes transcribe in the nucleus; eukaryotes in the cytoplasm.”", why:"Prokaryotes have no nucleus." }] },
        b:{ prompt:"Which is the best description of alternative splicing?", options:[
          { t:"“Different combinations of a gene’s exons are joined in different mRNAs, so one gene can code for several proteins.”", ok:true, why:"That’s alternative splicing: the exons vary." },
          { t:"“Introns are kept in some mRNAs to make longer proteins.”", why:"Introns are removed; exons vary." },
          { t:"“Different genes splice together into one mRNA.”", why:"Splicing happens within one pre-mRNA." },
          { t:"“Bacteria splice their mRNA in different ways.”", why:M6 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A mutation changes the AG at the end of an intron to AC. What is the most likely effect?", options:[
          { t:"The splice site isn’t recognized, so the intron may be kept or an exon skipped, changing the mRNA and the protein", ok:true, why:"The AG is part of the signal for where the intron ends." },
          { t:"No effect, because introns are removed anyway", why:"The AG is part of the signal for <strong>where</strong> to remove the intron." },
          { t:"The cap won’t be added", why:"The cap is added at the 5′ end, regardless of introns." },
          { t:"Transcription won’t start", why:"The promoter controls the start." }] },
        b:{ prompt:"A mutation changes the GU at the start of an intron to AU. What is the most likely effect?", options:[
          { t:"Splicing at that intron fails or shifts, so the mRNA may keep intron bases and code for an altered protein", ok:true, why:"The GU is part of the signal for where the intron starts." },
          { t:"No effect, because the intron is non-coding", why:"Its boundary signal matters." },
          { t:"The poly-A tail won’t be added", why:"The tail’s signal is elsewhere." },
          { t:"The mRNA will be read 3′ → 5′", why:"Direction doesn’t change." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"To make a human protein in bacteria, scientists insert a DNA copy made from the <strong>mature mRNA</strong>, not the gene from a chromosome. Why?", options:[
          { t:"Bacteria can’t splice out introns, so a copy without introns gives the right protein", ok:true, why:"A copy made from mature mRNA has no introns." },
          { t:"Bacteria can’t read DNA from human chromosomes because it’s double-stranded", why:"Bacterial DNA is double-stranded too." },
          { t:"Human genes use the opposite strand as template in bacteria", why:"The template is set by the promoter, not the species." },
          { t:"Mature mRNA has no start codon", why:"It has AUG." }] },
        b:{ prompt:"A whole human gene, introns included, is put into bacteria, and they make a much longer, non-working protein. Best explanation?", options:[
          { t:"The bacteria transcribed the introns but couldn’t remove them, so intron bases were translated", ok:true, why:"Bacteria have no spliceosome to remove introns." },
          { t:"The bacteria removed the exons", why:M5 },
          { t:"Bacteria add a cap that changes the protein", why:M6 },
          { t:"The bacteria read the coding strand", why:M1 }] } }
    ]
  },
  task:{
    title:"One gene, many messages", summary:"One gene, many messages",
    statement:"<p>Gene T has five exons separated by four introns. Use the splicing controls to build a finished mRNA that meets every condition. Can you find all the answers?</p><ol class=\"tx-conds\"><li>Every intron is removed.</li><li>The mRNA is capped and tailed (ready for export).</li><li>It starts at AUG and ends at the stop codon (E1 and E5 kept).</li><li>The protein has at least 5 amino acids.</li><li>The protein contains histidine.</li></ol>",
    // exon and intron mRNA sequences (plan: every exon is a whole number of codons; intron sequences are model GU…AG introns)
    segs:[["E1", "AUGGCA"], ["I1", "GUCAUUAG"], ["E2", "AACUGG"], ["I2", "GUAGCCAG"], ["E3", "CAU"], ["I3", "GUUCCUAG"], ["E4", "GGAUUC"], ["I4", "GUACGAAG"], ["E5", "GAAUAA"]],
    checks:["All introns removed", "Capped and tailed", "Start and stop", "At least 5 amino acids", "Contains histidine"],
    tips:["An intron left in would be read as codons.",
      "Without a cap and tail, the mRNA isn’t exported.",
      "E1 has the start codon; E5 has the stop.",
      "E1 and E5 give only 3 amino acids (Met, Ala, Glu). Add exons.",
      "Histidine’s codon, CAU, is in E3."],
    explainPrompt:"Explain how the same gene gave you different proteins, and why none of your choices shifted the reading frame.",
    vocab:"Use the words exon, intron, splicing, codon and reading frame.",
    success:"Your mRNA meets every condition!",
    more:"Can you find all the answers?",
    after3:"Three different proteins from one gene, all in frame, because every exon is a whole number of codons. That’s alternative splicing."
  },
  cards:[
    ["Transcription", "Copying a gene’s DNA into RNA; in eukaryotes, in the nucleus."],
    ["Template strand", "The strand RNA polymerase reads, 3′ → 5′."],
    ["Coding strand", "Same sequence as the mRNA, with T where the mRNA has U."],
    ["Promoter / TATA box", "Where RNA polymerase binds / a eukaryotic promoter sequence for transcription factors."],
    ["Terminator", "Signal where prokaryotic transcription stops."],
    ["RNA polymerase", "Unwinds DNA, needs no primer, builds RNA 5′ → 3′."],
    ["5′ cap", "Modified G on the front: protection, export, ribosome binding."],
    ["Poly-A tail", "50–250 A’s on the 3′ end: protection and export."],
    ["Introns and exons", "Introns are removed; exons are joined and expressed."],
    ["Spliceosome", "RNA–protein complex that cuts out introns (GU…AG) and joins exons."],
    ["Alternative splicing", "Different exon combinations: several proteins from one gene."],
    ["Prokaryote vs eukaryote", "Prokaryotes: cytoplasm, usually no introns, translation during transcription. Eukaryotes: nucleus, processing, export."]
  ]
};
