// SBI4U 24 tRNA. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/24-trna.md
// Teacher note (plan §6, risk 2): charging actually splits ATP to AMP + PPᵢ; the module just says "uses one ATP".
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "Pairing is antiparallel. The complement CGU runs 3′ → 5′, so written 5′ → 3′ the anticodon is UGC.";
const M1g = "Pairing is antiparallel: write the complement, then reverse it so it reads 5′ → 3′.";
const M2 = "The synthetase attaches the amino acid. The ribosome only checks codon–anticodon pairing, so a wrongly loaded tRNA delivers the wrong amino acid.";
const M3 = "Wobble happens at the codon’s <strong>third</strong> base, which pairs with the anticodon’s <strong>5′</strong> base.";
const M4 = "Stop codons have no tRNA; release factors read them. Wobble means fewer than 61 tRNAs are needed.";
const M5 = "The amino acid is attached at the 3′ end (…CCA), about 7 nm from the anticodon, at the other end of the L.";
const M6 = "tRNA is RNA: it uses U, never T.";
const M7 = "Each charging uses an ATP. The energy is stored in the bond between the amino acid and the tRNA, then used to make the peptide bond.";
// sequences in the monospace font (plan §5)
const sq = s => '<span class="tr-sq">' + s + "</span>";

// S6 codon table (static copy for the warm-up; app.js builds the same table for its dialog)
const B4 = "UCAG", CODE = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";
const AA3 = { A:"Ala", R:"Arg", N:"Asn", D:"Asp", C:"Cys", Q:"Gln", E:"Glu", G:"Gly", H:"His", I:"Ile", L:"Leu", K:"Lys", M:"Met", F:"Phe", P:"Pro", S:"Ser", T:"Thr", W:"Trp", Y:"Tyr", V:"Val", "*":"Stop" };
function codonTable(){
  let h = '<div class="tbl-wrap"><table class="tr-ct"><caption>The genetic code: codons written 5′ → 3′</caption><thead><tr><th scope="col">1st base</th>' +
    B4.split("").map(b => '<th scope="col">2nd base ' + b + "</th>").join("") + "</tr></thead><tbody>";
  for (let i = 0; i < 4; i++) {
    h += '<tr><th scope="row">' + B4[i] + "</th>";
    for (let j = 0; j < 4; j++) {
      h += "<td>";
      for (let k = 0; k < 4; k++) { const c = B4[i] + B4[j] + B4[k], a = AA3[CODE[16 * i + 4 * j + k]]; h += '<span class="tr-ctr"><span class="tr-sq">' + c + "</span> " + (a === "Stop" ? "<strong>Stop</strong>" : a) + "</span>"; }
      h += "</td>";
    }
    h += "</tr>";
  }
  return h + '</tbody></table></div><p class="tiny muted">AUG codes Met and is also the start codon. UAA, UAG and UGA are stop codons.</p>';
}
// Codon ↔ anticodon matching: why lines generated from the pair
const RC = { A:"U", U:"A", G:"C", C:"G" };
const compl = s => s.split("").map(b => RC[b]).join("");
const rev = s => s.split("").reverse().join("");
const PAIRS = [["AUG", "CAU"], ["UGG", "CCA"], ["GCA", "UGC"], ["UUC", "GAA"], ["CAG", "CUG"], ["AAU", "AUU"], ["GGC", "GCC"], ["UAC", "GUA"]];

export default {
  id:"24-trna",
  kind:"topic",
  title:"tRNA",
  topic:"tRNA",
  readyTopic:"tRNA",
  hero:{
    eq:'<span class="tr-heq"><span class="tr-sq tr-hac">3′-UAC-5′</span><span class="tr-hb" aria-hidden="true"><i></i><i></i><i></i></span><span class="tr-sq tr-hco">5′-AUG-3′</span></span>',
    eqLabel:"Anticodon 3′ U A C 5′ paired with the codon 5′ A U G 3′",
    eqSize:"sm",
    headline:"One end reads, the other end carries",
    text:"Ribosomes can’t read amino acids, and amino acids can’t read mRNA. <strong>Transfer RNA</strong> connects the two. Its <strong>anticodon</strong> pairs with a <strong>codon</strong>, and its <strong>3′ end</strong> carries the matching amino acid, loaded by an enzyme called an <strong>aminoacyl-tRNA synthetase</strong>.",
    fig:{ html:'<div class="tr-hero" id="tr-hero" role="img" aria-label="A flat cloverleaf tRNA appears with its arms labelled, then folds into an L shape. A synthetase grips the L, an ATP splits, and a methionine snaps onto the 3′ CCA end. The charged tRNA drifts down to an mRNA strip, and its anticodon 3′ U A C 5′ pairs with the codon 5′ A U G 3′, with three base-pair lines."></div>' }
  },
  goals:[
    "I can describe the structure of a tRNA: the anticodon loop, the 3′ CCA end that carries the amino acid, and its folded L shape.",
    "I can explain how aminoacyl-tRNA synthetases charge each tRNA with the correct amino acid, using ATP.",
    "I can write the anticodon that pairs with a codon, keeping track of 5′ and 3′ ends.",
    "I can use wobble rules to work out which codons a tRNA can read, and the fewest tRNAs needed for a set of codons.",
    "I can use evidence to explain why the ribosome reads the anticodon, not the amino acid."
  ],
  start:{
    blocks:[{ title:"The codon table", html:'<details class="alg"><summary>Open the codon table</summary>' + codonTable() + "</details>" }],
    warmup:{
      questions:[
        { id:"w1", skill:"Base pairing in RNA", goal:3,
          prompt:"In RNA, which base pairs with adenine (A)?",
          options:[
            { t:"Uracil (U)", ok:true, why:"RNA uses U in place of T, and U pairs with A." },
            { t:"Thymine (T)", why:"T is in DNA, not RNA." },
            { t:"Guanine (G)", why:"G pairs with C." },
            { t:"Adenine (A)", why:"A doesn’t pair with itself." }],
          hints:["Which base does RNA use instead of thymine?", "In DNA, A pairs with T.", "In RNA, A pairs with U."] },
        { id:"w2", skill:"RNA vs DNA", goal:1,
          prompt:"Which feature does tRNA share with mRNA but <strong>not</strong> with DNA?",
          options:[
            { t:"It contains ribose and uracil.", ok:true, why:"All RNA has ribose and U." },
            { t:"It is a double helix along its whole length.", why:"DNA is; tRNA has short paired stems only." },
            { t:"It contains thymine.", why:"Thymine is a DNA base." },
            { t:"It is made by DNA polymerase.", why:"RNA polymerase makes RNA." }],
          hints:["Think about the sugar and the bases.", "DNA: deoxyribose and T. RNA: …", "Ribose and U."] },
        { id:"w3", skill:"RNA vs DNA", goal:1,
          prompt:"A single RNA strand can fold back on itself and form short double-stranded stems. Why?",
          options:[
            { t:"Parts of the strand have complementary bases that pair with each other.", ok:true, why:"That’s how tRNA gets its cloverleaf." },
            { t:"RNA always has a partner strand.", why:"mRNA and tRNA are single strands." },
            { t:"Uracil pairs with uracil.", why:"U pairs with A (and, at wobble, with G)." },
            { t:"Ribose is sticky.", why:"Hydrogen bonds between bases hold the stems." }],
          hints:["What holds two DNA strands together?", "Hydrogen bonds between complementary bases.", "Complementary stretches in one strand pair with each other."] },
        { id:"w4", skill:"Reading the codon table", goal:4,
          prompt:"Using the codon table, which amino acid does " + sq("5′-GGA-3′") + " code for?",
          options:[
            { t:"Glycine (Gly)", ok:true, why:"Every GG_ codon is glycine." },
            { t:"Proline (Pro)", why:"Pro is CC_." },
            { t:"Arginine (Arg)", why:"Arg is CG_ (and AGA, AGG)." },
            { t:"A stop signal", why:"The stops are UAA, UAG and UGA." }],
          hints:["Find the first base (G) as the row.", "Then the second base (G) as the column.", "GGU, GGC, GGA, GGG: glycine."] },
        { id:"w5", skill:"Base pairing in RNA", goal:3,
          prompt:"Which RNA strand pairs with " + sq("5′-AUC-3′") + "?",
          options:[
            { t:sq("3′-UAG-5′"), ok:true, why:"Antiparallel and complementary: A–U, U–A, C–G." },
            { t:sq("5′-UAG-3′"), why:"Same direction: the ends don’t match up." },
            { t:sq("3′-TAG-5′"), why:"RNA uses U, not T." },
            { t:sq("3′-AUC-5′"), why:"That’s the same bases, not the complement." }],
          hints:["Strands pair antiparallel: one 5′ → 3′, the other 3′ → 5′.", "Complements: A–U, U–A, C–G.", sq("3′-UAG-5′") + "."] },
        { id:"w6", skill:"Reading the codon table", goal:4,
          prompt:"How many different codons code for leucine (Leu)?",
          options:[
            { t:"6", ok:true, why:"CUU, CUC, CUA, CUG, UUA and UUG." },
            { t:"4", why:"That counts only the CU_ box; UUA and UUG are Leu too." },
            { t:"1", why:"Most amino acids have more than one codon." },
            { t:"3", why:"Count all six." }],
          hints:["Look for every Leu in the table.", "One full box of four, plus two more.", "6."] }
      ],
      refreshers:{
        "Base pairing in RNA":"A pairs with U and G pairs with C. Paired strands run antiparallel: one 5′ → 3′, the other 3′ → 5′. Example: " + sq("5′-GAC-3′") + " pairs with " + sq("3′-CUG-5′") + ".",
        "RNA vs DNA":"RNA has ribose and uracil and is usually single-stranded, but one strand can fold so that complementary stretches pair into stems.",
        "Reading the codon table":"Find the first base (row), then the second (column), then the third (within the box). Most amino acids have 2–6 codons; AUG is both Met and “start”; UAA, UAG and UGA are stops."
      }
    }
  },
  explore:{
    heading:"tRNA anatomy and charging",
    intro:"Turn a tRNA to see its parts, load it at a synthetase, then try it against codons on an mRNA strip.",
    modes:[{ id:"anat", t:"Anatomy" }, { id:"charge", t:"Charging station" }, { id:"wob", t:"Wobble reader" }],
    // S1 hotspots (plan: acceptor stem with the 3′ CCA end, the 5′ end, the anticodon loop, D arm, T arm)
    parts:[
      { id:"acc", name:"Acceptor stem and 3′ end (CCA)", read:"3′ end (CCA): the amino acid attaches here", job:"The amino acid is attached to the last A of …CCA-3′, about 7 nm from the anticodon, at the other end of the L." },
      { id:"p5", name:"5′ end", read:"5′ end: part of the acceptor stem", job:"The 5′ end pairs with the strand next to the 3′ end in the acceptor stem. Nothing attaches here." },
      { id:"ac", name:"Anticodon loop", read:"Anticodon loop: three bases that pair with a codon", job:"Three bases in this loop pair with an mRNA codon, antiparallel." },
      { id:"d", name:"D arm", read:"D arm: a side loop", job:"A side loop that helps the tRNA fold and fit the ribosome." },
      { id:"t", name:"T arm", read:"T arm: a side loop", job:"A side loop that helps the tRNA fold and fit the ribosome." }
    ],
    trnas:["CAU", "CCA", "GAA", "IAG", "IGC", "GCU", "ICC", "CCC", "UCC", "GCC", "ACC"],
    wobbleCard:"<strong>Wobble rules (simplified)</strong>: anticodon 5′ base → codon 3′ base: G → C or U · U → A or G · I → U, C or A · C → G only · A → U only. (I is inosine.)",
    strips:[["AUG", "UGG", "UUC", "UAA"], ["UUU", "UUC", "UUA", "UUG"], ["CUU", "CUC", "CUA", "CUG"], ["GGU", "GGC", "GGA", "GGG"], ["GCU", "GCC", "GCA", "GCG"], ["AGU", "AGC", "AGA", "AGG"], ["UGU", "UGU", "UGU", "UGU"], ["UGG", "UAA"]],
    predIntro:"Make a prediction first. Then the model will show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Start: a tRNA with anticodon " + sq("5′-CAU-3′") + ". Which codon will this tRNA pair with?",
        options:[{ t:sq("5′-AUG-3′"), ok:true }, { t:sq("5′-GUA-3′") }, { t:sq("5′-CAU-3′") }, { t:sq("5′-UAC-3′") }],
        explain:"Turn the anticodon around: " + sq("3′-UAC-5′") + " pairs base by base with " + sq("5′-AUG-3′") + "." },
      { id:"p2", prompt:"Start: a charged Cys-tRNA (its anticodon reads UGU). A chemical treatment (the beaker) changes its cysteine into alanine; the anticodon is untouched. The mRNA has UGU. What will the ribosome add?",
        options:[{ t:"Alanine", ok:true }, { t:"Cysteine" }, { t:"Nothing: the ribosome rejects it" }, { t:"Both" }],
        explain:"The ribosome checks only codon–anticodon pairing. Whatever is on the tRNA gets added. A real experiment in 1962 showed exactly this." },
      { id:"p3", prompt:"Start: tRNA<sup>Phe</sup>, anticodon " + sq("5′-GAA-3′") + ", over the strip UUU · UUC · UUA · UUG. How many of these codons can it read?",
        options:[{ t:"2", ok:true }, { t:"1" }, { t:"3" }, { t:"4" }],
        explain:"G at the anticodon’s 5′ end pairs with C or U at the codon’s third position. It reads UUC (normal) and UUU (wobble G–U); UUA and UUG fail (they’re Leu anyway)." },
      { id:"p4", prompt:"Start: the strip shows UGG · UAA. Which tRNA reads UAA?",
        options:[{ t:"None: stop codons have no tRNA", ok:true }, { t:"One with anticodon " + sq("5′-UUA-3′") }, { t:"One carrying Met" }, { t:"Any tRNA by wobble" }],
        explain:"Only 61 codons have tRNAs. A protein called a release factor reads stop codons." }
    ],
    chalIntro:"Use the three modes to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"Charge the tRNA that reads " + sq("5′-UGG-3′") + " and place it on the strip.",
        why:"tRNA " + sq("5′-CCA-3′") + " pairs as " + sq("3′-ACC-5′") + " under UGG, and the tryptophan synthetase loaded its Trp using one ATP.",
        general:"Pick the tRNA at the charging station, load its amino acid, then choose a strip with UGG in Wobble reader and tap UGG to place it.",
        msgs:{ acc:"ACC is the complement written the same way round. Flip it: " + sq("5′-CCA-3′") + ".", wrongTrna:"The tryptophan synthetase rejects that tRNA: its anticodon doesn’t read a Trp codon.",
          uncharged:"Load the tRNA with its amino acid at the charging station first.", strip:"Choose a strip that has UGG on it in Wobble reader, then tap UGG to place the tRNA.", place:"Now tap UGG in Wobble reader to place the charged tRNA." },
        hints:["Write the complement of UGG, then turn it around.", "Complement: ACC, running 3′ → 5′.", sq("5′-CCA-3′") + ", loaded with Trp."] },
      { id:"tc2", goal:4, prompt:"Find one tRNA that reads all three codons CUU, CUC and CUA.",
        why:"Inosine at the wobble position pairs with U, C and A, so " + sq("5′-IAG-3′") + " (charged with Leu) reads CUU, CUC and CUA.",
        general:"The tRNA in hand must read CUU, CUC and CUA and carry the right amino acid. Use the wobble base chips in Wobble reader to try other 5′ bases.",
        msgs:{ gag:"G at the wobble position reads C and U, but not A.", uag:"U reads A and G, not U or C.", aa:"CU_ codons are leucine.", uncharged:"Charge it with its amino acid at the charging station." },
        hints:["The first two codon bases are the same, so the anticodon’s 3′ and middle bases are fixed: …AG-3′.", "You need a wobble base that pairs with U, C <strong>and</strong> A.", "Inosine: " + sq("5′-IAG-3′") + "."] },
      { id:"tc3", goal:4, stretch:true, prompt:"Use the fewest tRNAs to read all four glycine codons: GGU, GGC, GGA and GGG.",
        why:"Two Gly-tRNAs are enough: for example ICC (reads GGU, GGC, GGA) with CCC (reads GGG).",
        general:"Choose the strip GGU · GGC · GGA · GGG in Wobble reader, then place charged Gly-tRNAs on it.",
        msgs:{ ione:"I reads U, C and A, but not G: GGG is left over.", gc:"Nothing reads GGA.", many:"That works, but two can do it.", strip:"Choose the strip GGU · GGC · GGA · GGG in Wobble reader, then place Gly-tRNAs on it.",
          gly:"Each tRNA on the strip must carry glycine: load it at the charging station first.", none:"Place charged Gly-tRNAs on the strip first: a tRNA counts once it pairs 3 of 3 with a codon.", left:"Nothing reads " },
        hints:["Every anticodon ends …CC-3′. Only the wobble base changes.", "Which wobble base reads the most codons? Which codon does it miss?", "I covers U, C and A; add C (reads G) or U (reads A and G). Or pair G with U."] }
    ]
  },
  part3:{
    slug:"matching", name:"Matching", heading:"Codon–anticodon matching",
    intro:"Three stations: write anticodons both ways, read the evidence that tRNA is an adapter, and count how many tRNAs wobble saves.",
    s1:{ title:"Station 1: Write it both ways",
      text:"A codon appears (5′ → 3′). Build its anticodon in both boxes: tap a slot, then a base. The pairing lines draw only when both are right.",
      codons:["AUG", "GCA", "UUC", "CAG", "UGG", "AAU"],
      box1:"As it pairs (3′ → 5′)", box2:"Written 5′ → 3′",
      msgs:{ t:M6, box1:"Pair each base under the codon: A–U, U–A, G–C, C–G.", same:"Pairing is antiparallel. The complement runs 3′ → 5′, so written 5′ → 3′ it reads the other way round.", box2:"Read the top box backwards, starting from its 5′ end.", empty:"Fill all six slots first." },
      good:"Both ways are right." },
    s2:{ title:"Station 2: The adapter experiment",
      text:"In 1962, researchers loaded tRNA<sup>Cys</sup> with radioactive cysteine, then chemically changed the cysteine to alanine while it sat on the tRNA. They added it to a system translating an mRNA rich in UGU (a Cys codon) and measured which amino acid entered the protein.",
      head:["Amino acid on the tRNA", "Codon read", "Amino acid found in the protein"],
      rows:[["Cysteine (normal)", "UGU", "Cysteine"], ["Alanine (changed)", "UGU", "Alanine"]],
      ask:"Build the conclusion: tap a claim, the evidence and the reasoning, in an order that makes sense, then press Check.",
      // S12 chips: role c = claim, e = evidence, r = reasoning; good:true marks the three that belong
      chips:[
        { id:"c", role:"Claim", t:"The ribosome reads the anticodon, not the amino acid.", good:true },
        { id:"e", role:"Evidence", t:"Row 2: alanine on tRNA<sup>Cys</sup> went in at UGU, a cysteine codon.", good:true },
        { id:"r", role:"Reasoning", t:"The anticodon was unchanged, so pairing was unchanged.", good:true },
        { id:"xc", role:"Claim", t:"The ribosome checks the amino acid before adding it.", fb:M2 },
        { id:"xe", role:"Evidence", t:"Row 1: cysteine went in at UGU.", fb:"Row 1 is the normal result. Only row 2, with the changed amino acid, tests the idea." },
        { id:"xr", role:"Reasoning", t:"The synthetase changed the anticodon to match alanine.", fb:"The anticodon was untouched; only the amino acid was changed." }],
      need:"Use exactly three chips: one claim, one piece of evidence and one reason.",
      order:"Those are the right chips. Put the claim first or last, so the evidence and the reasoning lead to it or back it up.",
      good:"Claim, evidence and reasoning agree: the ribosome trusts the pairing, so whatever amino acid the tRNA carries goes in." },
    s3:{ title:"Station 3: Wobble counts",
      text:"Pick a four-codon family. Compare how many tRNAs a cell would need with no wobble and with wobble.",
      families:[
        { id:"gly", aa:"Gly", codons:["GGU", "GGC", "GGA", "GGG"], set:["ICC", "CCC"] },
        { id:"ala", aa:"Ala", codons:["GCU", "GCC", "GCA", "GCG"], set:["IGC", "CGC"] },
        { id:"val", aa:"Val", codons:["GUU", "GUC", "GUA", "GUG"], set:["IAC", "CAC"] },
        { id:"pro", aa:"Pro", codons:["CCU", "CCC", "CCA", "CCG"], set:["IGG", "CGG"] },
        { id:"thr", aa:"Thr", codons:["ACU", "ACC", "ACA", "ACG"], set:["IGU", "CGU"] }],
      all:"All 61 sense codons", allNo:"61 tRNAs", allYes:"fewer than 61",
      note:"The exact minimum depends on the organism, so no single number is given." },
    quickCheck:{
      title:"Quick check", summary:"Codon–anticodon matching quick check",
      items:[
        { id:"q1", goal:3, prompt:"Codon " + sq("5′-CAG-3′") + ". Anticodon written 5′ → 3′?",
          choices:[{ t:"CUG", ok:true, fb:"Right: the complement GUC runs 3′ → 5′; flipped, it’s " + sq("5′-CUG-3′") + "." },
            { t:"GUC", fb:"The complement GUC runs 3′ → 5′; flipped, it’s " + sq("5′-CUG-3′") + "." },
            { t:"CAG", fb:"The complement GUC runs 3′ → 5′; flipped, it’s " + sq("5′-CUG-3′") + "." },
            { t:"GTC", fb:"The complement GUC runs 3′ → 5′; flipped, it’s " + sq("5′-CUG-3′") + "." }] },
        { id:"q2", goal:5, prompt:"In the adapter experiment, why did alanine end up at a cysteine codon?",
          choices:[{ t:"The anticodon still paired with UGU", ok:true, fb:"Right: the ribosome trusts the pairing." },
            { t:"The ribosome changed it", fb:"The ribosome trusts the pairing." },
            { t:"UGU codes Ala", fb:"The ribosome trusts the pairing." },
            { t:"The synthetase fixed it", fb:"The ribosome trusts the pairing." }] },
        { id:"q3", goal:4, prompt:"Which anticodon base sits in the wobble position?",
          choices:[{ t:"Its 5′ base", ok:true, fb:"Right: it pairs with the codon’s third (3′) base." },
            { t:"Its 3′ base", fb:"It pairs with the codon’s third (3′) base." },
            { t:"Its middle base", fb:"It pairs with the codon’s third (3′) base." },
            { t:"Any base", fb:"It pairs with the codon’s third (3′) base." }] },
        { id:"q4", goal:4, prompt:"Anticodon " + sq("5′-IGC-3′") + " reads how many codons?",
          choices:[{ t:"3", ok:true, fb:"Right: I pairs with U, C and A: GCU, GCC and GCA (all Ala)." },
            { t:"4", fb:"I pairs with U, C and A: GCU, GCC and GCA (all Ala)." },
            { t:"1", fb:"I pairs with U, C and A: GCU, GCC and GCA (all Ala)." },
            { t:"2", fb:"I pairs with U, C and A: GCU, GCC and GCA (all Ala)." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Codon ↔ anticodon", summary:"Codon ↔ anticodon", goal:3,
        instruction:"Tap a codon, then tap the anticodon that pairs with it. Anticodons are written 5′ → 3′.",
        leftTitle:"Codon (5′ → 3′)", rightTitle:"Anticodon (5′ → 3′)",
        left:PAIRS.map((p, i) => Object.assign({ id:"l" + (i + 1), t:sq(p[0]),
          why:"The complement " + compl(p[0]) + " runs 3′ → 5′, so written 5′ → 3′ the anticodon is " + rev(compl(p[0])) + "." },
          i === 2 ? { hints:["Complement of GCA?", "CGU, running 3′ → 5′.", "Reverse it: " + sq("5′-UGC-3′") + "."] } :
          i === 7 ? { hints:["Complement of UAC?", "AUG, running 3′ → 5′.", sq("5′-GUA-3′") + "."] } : {})),
        right:PAIRS.map((p, i) => ({ id:"r" + (i + 1), t:sq(p[1]) })),
        answer:Object.fromEntries(PAIRS.map((p, i) => ["l" + (i + 1), "r" + (i + 1)])),
        wrongDefault:"Write the complement, then reverse it." },
      { id:"wobble", type:"custom", title:"Wobble puzzles", summary:"Wobble puzzles", star:true, goal:[4, 5], how:"",
        instruction:"Six puzzles. Puzzles 3 to 6 are non-routine (★); the last two go beyond the Final Check.",
        card:"<strong>Wobble rules (simplified)</strong>: anticodon 5′ base → codon 3′ base: G → C or U · U → A or G · I → U, C or A · C → G only · A → U only.",
        items:[
          { id:"w1", kind:"pick", goal:4, prompt:"Which codons does " + sq("5′-GAA-3′") + " read?", chips:["UUU", "UUC", "UUA", "UUG"],
            answer:["UUC", "UUU"], display:"UUC, UUU", why:"G at the wobble position pairs with C or U.",
            wrong:[{ match:["UUA", "UUC", "UUG", "UUU"], fb:"G reads C or U only." }] },
          { id:"w2", kind:"pick", goal:4, prompt:"Which codons does " + sq("5′-UCA-3′") + " read, and what goes wrong?", chips:["UGU", "UGC", "UGA", "UGG"],
            answer:["UGA", "UGG"], display:"UGA and UGG", why:"It would read a stop codon (UGA) as well as Trp.",
            also:{ q:"What goes wrong?", options:[{ t:"It would read a stop codon (UGA) as well as Trp (UGG).", ok:true }, { t:"Nothing: every codon it reads is Trp." }], fb:"UGA is a stop codon." },
            wrong:[{ match:["UGG"], fb:"U at the wobble position reads A <strong>and</strong> G. A real Trp tRNA uses C (" + sq("5′-CCA-3′") + ") so it never reads UGA." }] },
          { id:"w3", kind:"num", goal:4, star:true, prompt:"Fewest tRNAs to read the six serine codons UCU, UCC, UCA, UCG, AGU, AGC?",
            answer:3, unit:"tRNAs", display:"3", why:"IGA (UCU, UCC, UCA) + CGA (UCG) + GCU (AGU, AGC) = 3.",
            wrong:[{ match:2, fb:"The UC_ box needs two (I can’t read G); AGU/AGC need a third." }, { match:6, fb:"Use wobble." }],
            hints:["Split the six codons into the UC_ box and the AG_ pair.", "One tRNA can cover three of UC_, but not all four.", "IGA (UCU, UCC, UCA) + CGA (UCG) + GCU (AGU, AGC) = 3."] },
          { id:"w4", kind:"num", goal:4, star:true, prompt:"Fewest tRNAs to read all six leucine codons?",
            answer:3, unit:"tRNAs", display:"3", why:"Two for the CU_ box; one with U at the wobble position (" + sq("5′-UAA-3′") + ") for UUA and UUG.",
            general:"The CU_ box needs 2; UUA and UUG share one tRNA with U at the wobble position (" + sq("5′-UAA-3′") + ")." },
          { id:"w5", kind:"pick", goal:5, star:true, prompt:"A tRNA carries Ile and has anticodon " + sq("5′-IAU-3′") + ". List every codon it reads. Is that safe?", chips:["AUU", "AUC", "AUA", "AUG"],
            answer:["AUU", "AUC", "AUA"], display:"AUU, AUC, AUA", why:"All Ile, so safe.",
            also:{ q:"Is that safe?", options:[{ t:"Yes: every codon it reads is Ile.", ok:true }, { t:"No: it also reads the Met codon AUG." }], fb:"I doesn’t pair with G, which is good: AUG is Met." },
            wrong:[{ match:["AUA", "AUC", "AUG", "AUU"], fb:"I doesn’t pair with G, which is good: AUG is Met." }] },
          { id:"w6", kind:"pick", goal:4, star:true, prompt:"A bacterium lacks the tRNA " + sq("5′-CCG-3′") + " but has " + sq("5′-ICG-3′") + " for Arg. Which Arg codon can’t it read?", chips:["CGU", "CGC", "CGA", "CGG"],
            answer:["CGG"], display:"CGG", why:"I reads CGU, CGC and CGA. Only CGG needs a C at the wobble position.",
            wrong:[{ match:["CGA"], fb:"I reads CGU, CGC and CGA. Only CGG needs a C at the wobble position." }],
            hints:["Which codons does ICG pair with?", "Codon " + sq("5′-CG_-3′") + " with U, C or A at the end.", "CGG is left."] }
        ],
        general:"Line up the anticodon 3′ → 5′ under the codons, then use the wobble rules for the codon’s third base." },
      { id:"spot", type:"spot", title:"Spot the Error", student:"Marcel", how:"",
        instruction:"Marcel made one mistake in each answer. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Find the anticodon for the codon " + sq("5′-GCA-3′") + ", and the amino acid.",
            steps:["The codon reads G, C, A from 5′ to 3′.", "The complementary bases are C, G, U.", "So the anticodon is " + sq("5′-CGU-3′") + ".", "The tRNA carries alanine."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Alanine is right for GCA, but the anticodon in step 3 is written the wrong way round."],
            fixes:[
              { t:"The complement runs 3′ → 5′: " + sq("3′-CGU-5′") + ", which is " + sq("5′-UGC-3′") + ".", ok:true, why:M1 },
              { t:sq("5′-CGT-3′") + ".", why:M6 },
              { t:sq("5′-GCA-3′") + ".", why:"That’s the codon itself." },
              { t:"Step 3 is correct.", why:"Antiparallel strands can’t share the same 5′ end." }],
            hints:["Which way does the anticodon run when it pairs?", "3′ → 5′.", sq("5′-UGC-3′") + "."] },
          { id:"e2", goal:2, task:"Explain how a tRNA ends up carrying the right amino acid.",
            steps:["Each amino acid has its own aminoacyl-tRNA synthetase.", "The synthetase binds its amino acid and an ATP.", "It recognizes the matching tRNAs and attaches the amino acid to the 3′ end.", "At the ribosome, the amino acid is checked against the codon before it is added.", "So mistakes in charging are always caught."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "", "This follows from step 4, which is wrong."],
            fixes:[
              { t:"At the ribosome, only the anticodon is checked against the codon; the amino acid is added whatever it is.", ok:true, why:M2 },
              { t:"At the ribosome, the anticodon chooses the amino acid.", why:M2 },
              { t:"Charging happens at the ribosome.", why:"Charging happens before, at the synthetase." },
              { t:"Step 4 is correct.", why:"The 1962 alanine-on-tRNA<sup>Cys</sup> result shows otherwise." }],
            hints:["Which experiment tested this?", "Ala on a Cys tRNA was added at a Cys codon.", "Only pairing is checked."] },
          { id:"e3", goal:4, task:"How many codons can the tRNA with anticodon " + sq("5′-GCU-3′") + " read?",
            steps:["The wobble base is the anticodon’s 3′ base, U.", "U at the wobble position pairs with A or G.", "So it reads 2 codons."],
            answer:0,
            stepFb:["", "This would be right for U, but step 1 chose the wrong base.", "The count happens to be 2, but for the wrong reason, and the codons would be wrong."],
            fixes:[
              { t:"The wobble base is the anticodon’s 5′ base, G. G pairs with C or U, so it reads AGC and AGU (both Ser).", ok:true, why:M3 },
              { t:"The wobble base is the middle base, C.", why:M3 },
              { t:"There is no wobble; it reads only AGC.", why:"G at the wobble position pairs with U as well as C, so it reads AGU too." },
              { t:"Step 1 is correct.", why:"The codon’s third base pairs with the anticodon’s 5′ base." }],
            hints:["Line up codon 5′ → 3′ with anticodon 3′ → 5′.", "The codon’s third base faces the anticodon’s 5′ base.", "G: AGC and AGU."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in Explore: that the ribosome doesn’t check the amino acid, or that one tRNA can read three codons?" },
      { id:"j2", q:"In your own words, why is tRNA called an “adapter”?" },
      { id:"j3", q:"Explain to a friend how to write the anticodon for a codon without getting the direction wrong." },
      { id:"j4", q:"Which part still feels shaky (direction, wobble or charging)? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Where on a tRNA is the amino acid attached?", options:[
          { t:"At the 3′ end, which ends in CCA", ok:true, why:"The acceptor end." },
          { t:"At the anticodon loop", why:"The anticodon pairs with mRNA; the amino acid is at the other end." },
          { t:"At the 5′ end", why:"The 5′ end is next to the 3′ end in the acceptor stem, but the amino acid joins the 3′ A." },
          { t:"In the middle of a side loop", why:"Side loops help folding." }] },
        b:{ prompt:"Which part of a tRNA base-pairs with mRNA?", options:[
          { t:"The anticodon loop", ok:true, why:"Its three anticodon bases pair with a codon." },
          { t:"The 3′ CCA end", why:"That’s where the amino acid goes." },
          { t:"The 5′ end", why:"The 5′ end is in the acceptor stem." },
          { t:"The whole molecule, base by base", why:"Only three bases pair with a codon." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which molecule attaches the correct amino acid to a tRNA?", options:[
          { t:"An aminoacyl-tRNA synthetase", ok:true, why:"One synthetase for each amino acid loads it onto the matching tRNAs." },
          { t:"The ribosome", why:"The ribosome joins amino acids together; it doesn’t load tRNAs." },
          { t:"RNA polymerase", why:"That makes RNA from DNA." },
          { t:"The mRNA codon", why:"Codons pair with anticodons; they don’t load anything." }] },
        b:{ prompt:"What supplies the energy to charge a tRNA?", options:[
          { t:"ATP", ok:true, why:M7 },
          { t:"The peptide bond", why:"The peptide bond is made later, using the energy stored by charging." },
          { t:"The anticodon pairing", why:"Base pairing doesn’t power charging." },
          { t:"None is needed", why:M7 }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"The codon is " + sq("5′-UUC-3′") + ". What is the anticodon, written 5′ → 3′?", options:[
          { t:sq("5′-GAA-3′"), ok:true, why:"Complement AAG runs 3′ → 5′; flipped, GAA." },
          { t:sq("5′-AAG-3′"), why:M1g },
          { t:sq("5′-UUC-3′"), why:"That’s the codon." },
          { t:sq("5′-GTT-3′"), why:"RNA uses U, and this is also reversed wrongly." }] },
        b:{ prompt:"The codon is " + sq("5′-CAG-3′") + ". What is the anticodon, written 5′ → 3′?", options:[
          { t:sq("5′-CUG-3′"), ok:true, why:"Complement GUC runs 3′ → 5′; flipped, CUG." },
          { t:sq("5′-GUC-3′"), why:M1g },
          { t:sq("5′-CAG-3′"), why:"That’s the codon." },
          { t:sq("5′-CTG-3′"), why:M6 }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"A tRNA has the anticodon " + sq("5′-IGG-3′") + ". Which codons can it read?", options:[
          { t:"CCU, CCC and CCA", ok:true, why:"The codon starts CC; I pairs with U, C or A at the third base. All three are Pro." },
          { t:"CCU, CCC, CCA and CCG", why:"I doesn’t pair with G." },
          { t:"CCC only", why:"That ignores wobble." },
          { t:"UCC, CCC and ACC", why:"The variable base is the codon’s <strong>third</strong> base, not its first." }] },
        b:{ prompt:"A tRNA has the anticodon " + sq("5′-IAU-3′") + ". Which codons can it read?", options:[
          { t:"AUU, AUC and AUA", ok:true, why:"All three are Ile." },
          { t:"AUU, AUC, AUA and AUG", why:"I doesn’t pair with G, so AUG (Met) isn’t read." },
          { t:"AUA only", why:"That ignores wobble." },
          { t:"UUA, CUA and AUA", why:M3 }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"A faulty synthetase loads phenylalanine onto a tRNA whose anticodon reads the lysine codon AAA. The mRNA is " + sq("5′-AUG AAA UUU UAA-3′") + ". What polypeptide is made?", options:[
          { t:"Met–Phe–Phe", ok:true, why:"AAA receives the mis-loaded Phe; UUU is Phe anyway; UAA stops." },
          { t:"Met–Lys–Phe", why:"The ribosome can’t tell the amino acid is wrong." },
          { t:"Met–Phe", why:"UUU still adds a Phe before the stop." },
          { t:"Met–Lys–Lys", why:"UUU codes Phe." }] },
        b:{ prompt:"A faulty synthetase loads alanine onto a tRNA whose anticodon reads the glycine codon GGU. The mRNA is " + sq("5′-AUG GGU GCU UGA-3′") + ". What polypeptide is made?", options:[
          { t:"Met–Ala–Ala", ok:true, why:"GGU receives the mis-loaded Ala; GCU is Ala anyway." },
          { t:"Met–Gly–Ala", why:M2 },
          { t:"Met–Ala", why:"GCU still adds an Ala before the stop." },
          { t:"Met–Gly–Gly", why:"GCU codes Ala." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"Arginine has six codons: CGU, CGC, CGA, CGG, AGA and AGG. What is the fewest tRNAs that could read all six?", options:[
          { t:"3", ok:true, why:"The CG_ box needs two (for example ICG and CCG); AGA and AGG share one with U at the wobble position (UCU)." },
          { t:"6", why:"Wobble lets one tRNA read several codons." },
          { t:"2", why:"No single tRNA reads all four CG_ codons, so the box alone needs two, and AG_ needs another." },
          { t:"4", why:"AGA and AGG can share one tRNA." }] },
        b:{ prompt:"Leucine has six codons: CUU, CUC, CUA, CUG, UUA and UUG. What is the fewest tRNAs that could read all six?", options:[
          { t:"3", ok:true, why:"Two for the CU_ box; one with U at the wobble position for UUA and UUG." },
          { t:"6", why:M4 },
          { t:"2", why:"The CU_ box alone needs two." },
          { t:"4", why:"UUA and UUG can share one tRNA." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the best explanation of why tRNA is called an adapter molecule?", options:[
          { t:"“It connects two languages: its anticodon pairs with an mRNA codon, and its 3′ end carries the amino acid that codon stands for, loaded by a matching synthetase.”", ok:true, why:"One end reads, the other end carries." },
          { t:"“It adapts the mRNA so the ribosome can read it.”", why:"It doesn’t change the mRNA." },
          { t:"“Its anticodon turns into the amino acid at the ribosome.”", why:M2 },
          { t:"“It adapts to any codon by wobble.”", why:"Wobble works at one position only, and only within limits." }] },
        b:{ prompt:"Which is the best explanation of why charging errors are dangerous for a cell?", options:[
          { t:"“The ribosome checks only codon–anticodon pairing, so a wrong amino acid on a tRNA goes straight into the protein.”", ok:true, why:M2 },
          { t:"“The ribosome will stop translating.”", why:"It doesn’t notice the error." },
          { t:"“The mRNA will be changed.”", why:"Charging doesn’t touch the mRNA." },
          { t:"“The tRNA’s anticodon will change to match.”", why:M2 }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which labelled sketch is correct?", options:[
          { t:'<span class="tr-sk"><span>Codon ' + sq("5′-AUG-3′") + " (top) paired with anticodon " + sq("3′-UAC-5′") + " (bottom)</span><span>Met on the tRNA’s 3′ end, at the far end of the L from the anticodon</span></span>", ok:true, why:"Antiparallel pairing, U (not T), and the amino acid at the 3′ end." },
          { t:'<span class="tr-sk"><span>Codon ' + sq("5′-AUG-3′") + " paired with anticodon " + sq("5′-UAC-3′") + "</span></span>", why:M1g },
          { t:'<span class="tr-sk"><span>Codon ' + sq("5′-AUG-3′") + " paired with anticodon " + sq("3′-UAC-5′") + "</span><span>Met on the anticodon loop</span></span>", why:M5 },
          { t:'<span class="tr-sk"><span>Codon ' + sq("5′-ATG-3′") + " paired with anticodon " + sq("3′-TAC-5′") + "</span></span>", why:M6 }] },
        b:{ prompt:"Which labelled sketch is correct?", options:[
          { t:'<span class="tr-sk"><span>Codon ' + sq("5′-UGG-3′") + " paired with anticodon " + sq("3′-ACC-5′") + "</span><span>Trp on the tRNA’s 3′ end</span></span>", ok:true, why:"Antiparallel pairing, U (not T), and the amino acid at the 3′ end." },
          { t:'<span class="tr-sk"><span>Codon ' + sq("5′-UGG-3′") + " paired with anticodon " + sq("5′-ACC-3′") + "</span></span>", why:M1g },
          { t:'<span class="tr-sk"><span>Codon ' + sq("5′-UGG-3′") + " paired with anticodon " + sq("3′-ACC-5′") + "</span><span>Trp on the anticodon loop</span></span>", why:M5 },
          { t:'<span class="tr-sk"><span>Codon ' + sq("5′-TGG-3′") + " paired with anticodon " + sq("3′-ACC-5′") + "</span></span>", why:M6 }] } },
      { id:"a1", cat:"A", goal:2,
        a:{ prompt:"The antibiotic mupirocin, used in skin ointments, blocks the bacterial synthetase that loads isoleucine. Why does this stop bacterial growth?", options:[
          { t:"Without Ile-tRNAs, ribosomes stall at isoleucine codons, so the bacteria can’t finish their proteins.", ok:true, why:"No charged Ile-tRNAs arrive at Ile codons." },
          { t:"The bacteria’s mRNA can no longer be made.", why:"Transcription is untouched." },
          { t:"Ribosomes add a different amino acid instead, which the bacteria can’t detect.", why:"No other synthetase loads Ile-tRNAs, so nothing arrives." },
          { t:"The bacteria run out of ATP.", why:"Charging uses ATP, but blocking one synthetase doesn’t drain it." }] },
        b:{ prompt:"A new drug blocks the bacterial synthetase that loads threonine, but not the human version. Why could it be a useful antibiotic?", options:[
          { t:"Bacteria can’t charge Thr-tRNAs, so their ribosomes stall at Thr codons, while human cells keep translating.", ok:true, why:"Only the bacterial enzyme is blocked." },
          { t:"It changes the bacteria’s threonine codons.", why:"Drugs that block enzymes don’t edit DNA." },
          { t:"Human cells don’t use threonine.", why:"They do; the human enzyme is just different enough not to be blocked." },
          { t:"It makes bacterial ribosomes read Thr codons as stops.", why:"Stops need release factors; this just stalls." }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"Scientists add a new tRNA with the anticodon " + sq("5′-CUA-3′") + ", plus a synthetase that loads an unusual amino acid X onto it. Which codon in an mRNA will now receive X?", options:[
          { t:sq("5′-UAG-3′") + " (normally a stop codon)", ok:true, why:"Flip the anticodon: " + sq("3′-AUC-5′") + " pairs with " + sq("5′-UAG-3′") + "." },
          { t:sq("5′-GAU-3′"), why:"That’s the complement read in the same direction." },
          { t:sq("5′-CUA-3′"), why:"That’s the anticodon itself." },
          { t:sq("5′-AUC-3′"), why:"That’s the plain complement, not a codon read 5′ → 3′." }] },
        b:{ prompt:"Scientists add a new tRNA with the anticodon " + sq("5′-UCA-3′") + ", charged with an unusual amino acid X. Which stop codon will it read?", options:[
          { t:sq("5′-UGA-3′"), ok:true, why:sq("3′-ACU-5′") + " pairs with " + sq("5′-UGA-3′") + ". (With U at the wobble position it could also read UGG, which researchers would have to account for.)" },
          { t:sq("5′-AGU-3′"), why:M1g },
          { t:sq("5′-UCA-3′"), why:"That’s the anticodon itself." },
          { t:sq("5′-UAA-3′"), why:"UAA would need anticodon " + sq("5′-UUA-3′") + "." }] } }
    ]
  },
  task:{
    title:"One tRNA, three codons", summary:"One tRNA, three codons",
    statement:"<p>Design a tRNA, choosing its anticodon and the amino acid it carries, that meets every condition. Can you find all the answers?</p><ol class=\"tr-conds\"><li>Every codon it can read codes for the amino acid it carries (and none is a stop codon).</li><li>It reads at least three different codons.</li><li>Every codon it reads begins with G.</li></ol>",
    checks:["Reads only its own amino acid", "Reads at least three codons", "Codons begin with G"],
    tips:["List the codons your anticodon reads, using the wobble card. Do they all code your amino acid?",
      "Only one wobble base reads three codons.",
      "The codon’s first base pairs with the anticodon’s 3′ base. For G, that base must be C."],
    explainPrompt:"Explain how you chose the wobble base and why the other two anticodon bases had to be what they are.",
    vocab:"Use the words anticodon, codon, wobble, antiparallel and synthetase.",
    success:"Your tRNA meets every condition!",
    more:"Can you find all the answers?",
    after3:"Each is a four-codon family starting with G, read by inosine. GA_ fails: I would read GAA (Glu) along with GAU and GAC (Asp).",
    aas:["Ala", "Arg", "Asn", "Asp", "Cys", "Gln", "Glu", "Gly", "His", "Ile", "Leu", "Lys", "Met", "Phe", "Pro", "Ser", "Thr", "Trp", "Tyr", "Val"],
    slot1:"Slot 1: the wobble (5′) base", slot2:"Slot 2: middle base", slot3:"Slot 3: the 3′ base"
  },
  cards:[
    ["tRNA", "Transfer RNA: an adapter about 70–90 nucleotides long that brings one amino acid to the ribosome."],
    ["Anticodon", "Three bases on the tRNA’s loop that pair with an mRNA codon, antiparallel."],
    ["3′ CCA end", "Where the amino acid is attached, at the far end of the L from the anticodon."],
    ["Aminoacyl-tRNA synthetase", "The enzyme that loads the right amino acid onto its tRNAs; one for each amino acid; uses ATP."],
    ["Charging", "Attaching an amino acid to a tRNA. Energy from ATP is stored in that bond."],
    ["Writing an anticodon", "Complement the codon, then reverse it: codon " + sq("5′-GCA-3′") + " → anticodon " + sq("5′-UGC-3′") + "."],
    ["Wobble", "Relaxed pairing between the codon’s third base and the anticodon’s 5′ base."],
    ["Wobble rules", "G → C or U · U → A or G · I → U, C or A · C → G · A → U."],
    ["Stop codons", "UAA, UAG, UGA: no tRNA; release factors read them."],
    ["Adapter evidence", "Ala loaded on tRNA<sup>Cys</sup> was added at Cys codons: the ribosome reads only the anticodon."],
    ["Why fewer than 61 tRNAs", "Wobble lets one tRNA read up to three codons."]
  ]
};
