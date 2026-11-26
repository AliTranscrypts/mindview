// SBI4U 22 DNA Direction of Construction. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/22-dna-direction-of-construction.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "No strand is ever built 3′ → 5′. The lagging strand is built 5′ → 3′ too, in short pieces that point away from the fork.";
const M2 = "The new strand is antiparallel: if the template reads 3′ → 5′ left to right, the new strand reads 5′ → 3′ left to right.";
const M3 = "Leading: one primer per fork. Lagging: one primer per Okazaki fragment.";
const M4 = "At a bubble the same template strand is leading on one fork and lagging on the other.";
const M5 = "Polymerase proofreads as it goes; mismatch repair catches what slips past; excision repair fixes damage at any time.";
const M6 = "Telomeres are non-coding repeats. Telomerase is active in a few cell types (stem and germ cells) and most cancer cells.";
const M7 = "Each layer cuts the remaining errors by its factor, so the factors multiply.";
const NB = " ";   // narrow no-break space for thousands (4 000 000)
const sq = s => '<span class="dd-seq">' + s + "</span>";   // DNA sequences in monospace (course plan §2)

export default {
  id:"22-dna-direction-of-construction",
  kind:"topic",
  title:"DNA direction of construction",
  topic:"DNA Direction of Construction",
  readyTopic:"the direction of DNA construction",
  hero:{
    eq:'<span class="dd-heq"><span class="dd-hl">' + sq("3′-TACGTC-5′") + ' <span class="dd-hlab">template, read 3′ → 5′</span></span><span class="dd-hl dd-hn">' + sq("5′-ATGCAG-3′") + ' <span class="dd-hlab">new strand, built 5′ → 3′</span></span></span>',
    eqLabel:"Template 3′ T A C G T C 5′, read 3′ to 5′. New strand 5′ A T G C A G 3′, built 5′ to 3′.",
    eqSize:"sm",
    headline:"Always 5′ to 3′, even when that means going backwards",
    text:"DNA polymerase adds nucleotides only to a <strong>3′ end</strong>, so every new strand grows <strong>5′ → 3′</strong>. On one template, that’s toward the opening fork: the <strong>leading strand</strong>. On the other, it’s away from the fork, so that strand is built in short <strong>Okazaki fragments</strong> that are later joined: the <strong>lagging strand</strong>.",
    fig:{ html:'<div class="dd-hero" id="dd-hero" role="img" aria-label="A replication fork drawn sideways as a Y. The upper template, 3′ on the left to 5′ on the right, has one long blue new strand growing toward the fork. The lower template, 5′ to 3′, has short blue pieces, each starting from a magenta primer and pointing away from the fork. Every blue piece grows 5′ to 3′. The fork opens one step; the long strand follows it; a new primer appears near the fork and a fragment grows backwards until it meets the previous one; polymerase I swaps the old primer for DNA and ligase seals the nick."></div>' }
  },
  goals:[
    "I can explain why new DNA is always built 5′ → 3′ and the template read 3′ → 5′.",
    "I can describe how the lagging strand is made in Okazaki fragments, and the roles of primase, polymerase I and ligase.",
    "I can decide whether a new strand is leading or lagging from the template’s direction and the fork’s movement.",
    "I can count primers and forks for a stretch of DNA, a bubble or a chromosome with several origins.",
    "I can describe proofreading, mismatch repair and excision repair, and use error rates to show how they combine.",
    "I can explain the end-replication problem, telomeres and telomerase, and connect them to aging and cancer."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Strand ends", goal:1,
          prompt:"What is at the 3′ end of a DNA strand?",
          options:[
            { t:"A free –OH group on the sugar", ok:true, why:"Carbon 3′ of deoxyribose." },
            { t:"A free phosphate group", why:"That’s the 5′ end. The phosphate hangs off carbon 5′." },
            { t:"A base with no partner", why:"Ends are about the backbone, not the bases." },
            { t:"A hydrogen bond", why:"Hydrogen bonds join bases across strands." }],
          hints:["The numbers 3′ and 5′ name carbons on the sugar.", "The 5′ carbon carries the phosphate.", "The 3′ end has a free –OH."] },
        { id:"w2", skill:"Strand ends", goal:1,
          prompt:"A strand reads " + sq("5′-CATG-3′") + ". Its partner is written…",
          options:[
            { t:sq("3′-GTAC-5′"), ok:true, why:"Complementary and antiparallel." },
            { t:sq("5′-GTAC-3′"), why:"The partner runs the other way." },
            { t:sq("3′-CATG-5′"), why:"That copies instead of pairing." },
            { t:sq("3′-GUAC-5′"), why:"DNA uses T." }],
          hints:["Pair the bases.", "C–G, A–T, T–A, G–C.", sq("3′-GTAC-5′") + "."] },
        { id:"w3", skill:"The fork’s enzymes", goal:2,
          prompt:"Which enzyme lays down RNA primers?",
          options:[
            { t:"Primase", ok:true, why:"Polymerase needs a 3′ end to start from." },
            { t:"Helicase", why:"Helicase unwinds." },
            { t:"Ligase", why:"Ligase seals nicks." },
            { t:"DNA polymerase I", why:"Polymerase I <strong>removes</strong> primers." }],
          hints:["The name hints at ‘first’.", "It makes a short RNA start.", "Primase."] },
        { id:"w4", skill:"The fork’s enzymes", goal:2,
          prompt:"Which enzyme seals the nicks in the backbone between new pieces of DNA?",
          options:[
            { t:"DNA ligase", ok:true, why:"It forms the final phosphodiester bond." },
            { t:"Helicase", why:"Helicase breaks hydrogen bonds between strands." },
            { t:"Gyrase", why:"Gyrase relieves twisting." },
            { t:"Primase", why:"Primase starts pieces; it doesn’t join them." }],
          hints:["‘Ligate’ means to tie.", "It joins backbone to backbone.", "DNA ligase."] },
        { id:"w5", skill:"Base pairing", goal:3,
          prompt:"Which template base pairs with an incoming adenine nucleotide?",
          options:[
            { t:"Thymine", ok:true, why:"A–T." },
            { t:"Adenine", why:"Pairs are complementary, not identical." },
            { t:"Guanine", why:"G pairs with C." },
            { t:"Uracil", why:"Uracil is in RNA." }],
          hints:["A’s DNA partner?", "Two hydrogen bonds.", "T."] },
        { id:"w6", skill:"Base pairing", goal:5,
          prompt:"A new strand has G opposite a template T. What kind of error is this?",
          options:[
            { t:"A mismatch: G should pair with C, and T with A", ok:true, why:"G–T isn’t one of the two allowed pairs, so it’s a mismatch." },
            { t:"A correct pair", why:"G–T isn’t a Watson–Crick pair." },
            { t:"A thymine dimer", why:"Dimers are two neighbouring Ts on one strand, joined by UV." },
            { t:"A frameshift", why:"A frameshift is an insertion or deletion." }],
          hints:["What should pair with T?", "A.", "So G–T is a mismatch."] }
      ],
      refreshers:{
        "Strand ends":"The 5′ end has a free phosphate; the 3′ end has a free sugar –OH. Partners are antiparallel: " + sq("5′-CATG-3′") + " pairs with " + sq("3′-GTAC-5′") + ".",
        "The fork’s enzymes":"Helicase unwinds, primase primes, polymerase III builds, polymerase I swaps primers for DNA, ligase seals.",
        "Base pairing":"A–T and G–C. Any other pair is a mismatch."
      }
    }
  },
  explore:{
    heading:"Leading and lagging strands",
    intro:"Open the fork step by step. Place primers where polymerase can use them, and watch which new strand keeps up with the fork and which has to be built backwards in pieces.",
    howBoard:"Tap a template position (a circle on a template strand), then press <strong>Primase here</strong>. On a keyboard, the arrow keys move along a strand, up and down switch strands, and Enter places a primer.",
    modelNote:"Model rule: Okazaki fragments are 10 nucleotides long here. Real ones are about 1000–2000 nucleotides in bacteria and about 100–200 in eukaryotes. The model counts one primer per leading strand per fork, and polymerase I replaces every primer once its piece is built.",
    flagMsg:"Polymerase would have nothing to copy from here.",
    predictions:[
      { id:"p1", prompt:"One fork opened 20 nt, both strands complete; now open 10 more. What does the leading strand need?",
        options:[
          { t:"Nothing new: polymerase keeps extending its 3′ end toward the fork", ok:true },
          { t:"A new primer" },
          { t:"Ligase" },
          { t:"It waits until the lagging strand catches up" }],
        explain:"Its 3′ end faces the fork, so each newly opened base can be added straight on. " + M3,
        start:{ mode:"one", open:20, build:"done" }, act:"open" },
      { id:"p2", prompt:"The fork opens 40 nt with 10-nt fragments. How many primers will the <strong>lagging</strong> strand need?",
        options:[
          { t:"4", ok:true },
          { t:"1" },
          { t:"0" },
          { t:"40" }],
        explain:"Every fragment starts from its own primer. " + M3,
        start:{ mode:"one", open:40, build:"none" }, act:"primeLag" },
      { id:"p3", prompt:"Bubble mode, opened 20 nt each way. On the right fork, the top template carries the leading strand. On the left fork, the top template carries…",
        options:[
          { t:"the lagging strand", ok:true },
          { t:"the leading strand too" },
          { t:"no new strand" },
          { t:"both strands" }],
        explain:"The forks move in opposite directions, so the roles swap. " + M4,
        start:{ mode:"bub", open:20, build:"right" }, act:"leftTop" },
      { id:"p4", prompt:"Which direction is the lagging strand <strong>built</strong> in?",
        options:[
          { t:"5′ → 3′, in pieces pointing away from the fork", ok:true },
          { t:"3′ → 5′, continuously toward the fork" },
          { t:"3′ → 5′, in pieces" },
          { t:"Both directions at once" }],
        explain:"Polymerase only adds to 3′ ends, so nothing is ever built 3′ → 5′.",
        start:{ mode:"one", open:40, build:"lagPrimers" }, act:"extendLag" }
    ],
    challenges:[
      { id:"tc1", goal:2, prompt:"Fork opened 30 nt. Finish the lagging strand completely: no gaps, no RNA, no nicks.",
        why:"Three primers, polymerase III, polymerase I, then ligase: 30 nt of continuous DNA.",
        named:{ setup:"Use One fork mode with the fork opened 30 nt.", facing:"Its 3′ end must point away from the fork on this template.",
          gaps:"Each 10-nt stretch of the lagging template needs its own primer.", unbuilt:"Polymerase III hasn’t built the fragments yet.",
          rna:"RNA is still in the strand.", nicks:"The pieces aren’t joined." },
        hints:["One primer per 10-nt fragment.", "Extend with polymerase III, then replace the primers.", "Primers → pol III → pol I → ligase."] },
      { id:"tc2", goal:4, prompt:"Fork opened 40 nt. Copy <strong>both</strong> strands using as few primers as possible.",
        why:"1 leading primer + 4 lagging primers = 5. The leading strand’s 3′ end keeps up with the fork.",
        named:{ setup:"Use One fork mode with the fork opened 40 nt.", lead:"The leading strand needs only one; its 3′ end keeps up with the fork.",
          lag:"The lagging strand needs one per fragment.", finish:"Both strands must be complete: build them, replace the primers and seal the nicks.",
          extra:"Both strands are done, but a primer was wasted. Clear the strands and try with fewer." },
        hints:["How many does the leading strand need?", "One. The lagging strand: 40 ÷ 10.", "1 + 4 = 5."] },
      { id:"tc3", goal:[2, 4], stretch:true, prompt:"Bubble mode: the bubble has opened 30 nt <strong>each way</strong> from the origin. Build every new strand completely. Use exactly as many primers as the job needs, and enter that number.",
        why:"Two forks, each with 1 leading primer and 3 lagging primers: 2 × (1 + 3) = 8.",
        named:{ setup:"Use Replication bubble mode with the bubble opened 30 nt each way.", n2:"Each fork has its own lagging strand.", n4:"That counts one fork’s lagging strand.",
          n6:"Each fork’s leading strand needs a primer too: 2 + 6.", finish:"Build all four new strands completely: no gaps, no RNA, no nicks.",
          extra:"All four strands are done, but more primers were used than the job needs.", count:"Count the primers again: the readout shows how many you laid down.", enter:"Enter the number of primers the job needs in the ‘Primers this bubble needs’ box." },
        hints:["How many forks does one origin make?", "Two forks, each with 1 leading primer and 30 ÷ 10 = 3 lagging primers.", "2 × (1 + 3) = 8."] }
    ]
  },
  part3:{
    slug:"repair", name:"Repair", heading:"Proofreading and repair",
    intro:"Zoom in from the fork to single base pairs. Step through each station, then use the error-rate data to see how the layers of checking combine.",
    st1:{ title:"Station 1: proofreading",
      steps:["A polymerase adds a G opposite a T.", "A bump in the helix appears, and polymerase backs up one nucleotide.", "It cuts the G off: its 3′ → 5′ exonuclease activity.", "It adds the correct A and continues."],
      short:["wrong base added", "back up", "cut it off", "add A, carry on"],
      card:"Proofreading happens during copying." },
    st2:{ title:"Station 2: mismatch repair",
      steps:["A mismatch slipped through proofreading: G sits opposite T after copying.", "Repair proteins detect the distortion and identify the <strong>new</strong> strand (in <em>E. coli</em>, the parent strand carries chemical tags).", "They cut out a stretch of the new strand.", "A polymerase refills the gap, copying the parent strand.", "Ligase seals it."],
      short:["mismatch", "detect, tell strands apart", "cut out", "refill", "seal"],
      card:"Polymerases (including polymerase II) take part in repair." },
    // VERIFY: Canada first reported a public daily UV index in 1992 (Environment Canada); confirm before release.
    st3:{ title:"Station 3: excision repair",
      steps:["UV light joins two neighbouring thymines into a <strong>thymine dimer</strong> that kinks the strand.", "Enzymes cut out the damaged stretch.", "A polymerase refills it.", "Ligase seals it."],
      short:["UV makes a dimer", "cut out", "refill", "seal"],
      card:"Health link: people with xeroderma pigmentosum lack this repair and are extremely sensitive to sunlight. For everyone, sunscreen and the UV index help limit the UV that makes dimers. Canada was the first country to report a daily UV index, starting in 1992." },
    st4:{ title:"Station 4: error rates (data)",
      rows:[["Polymerase alone", "1 in 100" + NB + "000 (10⁵)"], ["After proofreading", "1 in 10 million (10⁷)"], ["After mismatch repair", "1 in a billion (10⁹)"]],
      head:["Stage", "Errors per base copied (approximate)"],
      how:"Compute how much each layer improves the error rate, then the overall improvement. Type a whole number, then press Check.",
      asks:[
        { id:"f1", t:"Proofreading improves the rate by", answer:100, wrong:[{ match:2, fb:"Compare the rates, not the exponents: 10⁷ ÷ 10⁵ = 100." }] },
        { id:"f2", t:"Mismatch repair improves it a further", answer:100, wrong:[{ match:2, fb:"Compare the rates, not the exponents: 10⁹ ÷ 10⁷ = 100." }] },
        { id:"f3", t:"Overall, the improvement is", answer:10000, wrong:[{ match:200, fb:M7 }, { match:4, fb:"Compare the rates, not the exponents: 10⁹ ÷ 10⁵." }] }],
      general:"Divide the later ‘1 in …’ number by the earlier one.",
      done:"✓ 100 × 100 = 10" + NB + "000: each layer cuts the remaining errors by its factor, so the factors multiply." },
    st5:{ title:"Station 5: the ends of the line",
      steps:["A linear chromosome end. The lagging strand’s last primer sits at the very tip.", "The last primer is removed, and no 3′ end is available to fill the gap.", "So the chromosome loses a little DNA each round. <strong>Telomeres</strong> (in humans, many repeats of " + sq("TTAGGG") + ") are the buffer.", "<strong>Telomerase</strong> carries its own RNA template and extends the 3′ end."],
      short:["last primer", "gap can’t be filled", "a little shorter", "telomerase extends"],
      card:"Telomerase is active in stem cells, germ-line cells and most cancer cells, but not in most body cells. Bacteria’s circular chromosomes have no ends, so no problem.",
      cells:[{ id:"body", t:"Most body cells", tel:false }, { id:"stem", t:"Stem or germ-line cell", tel:true }, { id:"cancer", t:"Most cancer cells", tel:true }],
      model:"In this model a telomere starts with 8 repeat blocks, a division without telomerase loses 1 block, and the cell stops dividing when 2 blocks are left. Real telomeres hold thousands of repeats." },
    quickCheck:{
      title:"Quick check", summary:"Proofreading and repair quick check",
      items:[
        { id:"q1", goal:5, prompt:"Which repair removes a thymine dimer?",
          choices:[{ t:"Excision repair", ok:true, fb:"UV damage is cut out and refilled." },
            { t:"Proofreading", fb:"UV damage is cut out and refilled." },
            { t:"Telomerase", fb:"UV damage is cut out and refilled." },
            { t:"Ligase alone", fb:"UV damage is cut out and refilled." }] },
        { id:"q2", goal:5, prompt:"Proofreading happens…",
          choices:[{ t:"During copying", ok:true, fb:"Polymerase checks each base as it adds it." },
            { t:"Only after copying", fb:"Polymerase checks each base as it adds it." },
            { t:"Only in sunlight", fb:"Polymerase checks each base as it adds it." },
            { t:"Only at telomeres", fb:"Polymerase checks each base as it adds it." }] },
        { id:"q3", goal:5, prompt:"Rate 1 in 10⁵, then a 100× improvement. New rate?",
          choices:[{ t:"1 in 10⁷", ok:true, fb:"10⁵ × 10² = 10⁷." },
            { t:"1 in 10⁵⁰⁰", fb:"10⁵ × 10² = 10⁷." },
            { t:"1 in 10³", fb:"10⁵ × 10² = 10⁷." },
            { t:"1 in 10⁶", fb:"10⁵ × 10² = 10⁷." }] },
        { id:"q4", goal:6, prompt:"Why don’t bacteria need telomerase?",
          choices:[{ t:"Their chromosome is circular", ok:true, fb:"No ends, no end-replication problem." },
            { t:"They have no DNA polymerase", fb:"No ends, no end-replication problem." },
            { t:"They don’t divide", fb:"No ends, no end-replication problem." },
            { t:"Their DNA has no primers", fb:"No ends, no end-replication problem." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"order", type:"custom", title:"Put the steps in order", summary:"Put the steps in order", goal:[2, 5],
        instruction:"Two sequences. Tap the steps in the order they happen. A step that doesn’t belong can be left out.",
        sequences:[
          { id:"s1", goal:2, prompt:"One Okazaki fragment, from start to finish.",
            tiles:["Helicase opens a new stretch of the fork.", "Primase lays down an RNA primer on the lagging template.", "Polymerase III adds DNA to the primer’s 3′ end, moving away from the fork.", "The fragment reaches the primer of the previous fragment.", "Polymerase I replaces the RNA primer with DNA.", "Ligase seals the nick between the fragments."],
            answer:[0, 1, 2, 3, 4, 5],
            wrongIf:[{ before:[4, 2], fb:"There’s nothing to replace yet; the fragment hasn’t been built." },
              { before:[5, 4], fb:"Ligase can’t join DNA to RNA; the primer must be replaced first." },
              { before:[2, 1], fb:"Polymerase needs the primer’s 3′ end. " + M3 }],
            why:"Open, prime, extend away from the fork, meet the previous fragment, swap its primer for DNA, seal.",
            hints:["What does polymerase need first?", "A primer, then extension.", "Replace the RNA, then seal."] },
          { id:"s2", goal:5, prompt:"Mismatch repair.",
            tiles:["Polymerase leaves a mismatched pair that proofreading missed.", "Repair proteins detect the distortion in the helix.", "The new strand is identified and a stretch of it is cut out.", "A polymerase refills the gap using the parent strand as template.", "Ligase seals the backbone.", "The parent strand is identified and a stretch of it is cut out."],
            answer:[0, 1, 2, 3, 4],
            bad:[{ tile:5, fb:"The parent strand holds the correct sequence." }],
            wrongIf:[{ before:[2, 1], fb:"Damage has to be found before it’s cut out." }],
            why:"Find the mismatch, tell the new strand from the parent, cut out the new stretch, refill from the parent, seal." }
        ] },
      { id:"puzzles", type:"custom", title:"Direction and counting puzzles", summary:"Direction and counting puzzles", star:true, goal:[1, 4, 5, 6],
        instruction:"Six puzzles. Items 3–6 are non-routine (★); items 4 and 5 go beyond the Final Check.",
        items:[
          { id:"d1", kind:"seq", goal:1, prompt:"Template " + sq("3′-TACGGA-5′") + ". Write the new strand with its ends.",
            template:"TACGGA", answer:["5", "ATGCCT"], display:sq("5′-ATGCCT-3′"),
            why:"Complementary and antiparallel: the new strand’s left end is 5′.",
            wrongEnds:"The new strand is antiparallel to the template.", wrongBases:"Pair each base with its partner: A–T and G–C.", wrongU:"DNA uses T, not U.",
            sameStrand:"That’s the same strand written from its other end. Lined up under the template, it reads " + sq("5′-ATGCCT-3′") + "." },
          { id:"d2", kind:"chips", goal:1, prompt:"To which end of a growing strand does polymerase add nucleotides?",
            options:[{ t:"3′", ok:true, why:"Only the 3′ –OH can form the next bond." }, { t:"5′", why:"Only the 3′ –OH can form the next bond. " + M1 },
              { t:"Either", why:"Only the 3′ –OH can form the next bond." }, { t:"Both at once", why:"Only the 3′ –OH can form the next bond." }] },
          { id:"d3", kind:"num", goal:4, star:true, prompt:"A bacterial lagging strand of 6000 nucleotides is made in 1000-nucleotide fragments. How many primers does it need?",
            answer:6, display:"6 primers", why:"6000 ÷ 1000 = 6 fragments, one primer each.",
            wrong:[{ match:1, fb:"That’s the leading strand’s count. " + M3 }], general:"One primer per fragment: how many fragments?" },
          { id:"d4", kind:"num", goal:5, star:true, prompt:"A bacterium copies a 4" + NB + "000" + NB + "000-bp chromosome with 1 error per billion bases copied. On average, how many divisions pass before one error is made?",
            answer:250, display:"250 divisions", why:"4 × 10⁶ ÷ 10⁹ = 0.004 errors per copy, so one error every 1 ÷ 0.004 = 250 copies.",
            wrong:[{ match:4000000, fb:"Expected errors per copy = 4" + NB + "000" + NB + "000 ÷ 1" + NB + "000" + NB + "000" + NB + "000 = 0.004, so 1 ÷ 0.004 = 250." },
              { match:0.004, fb:"That’s the errors per copy. How many copies pass before one error?" }],
            general:"Work out the errors per single copy first.",
            hints:["How many errors per single copy of the chromosome?", "4 × 10⁶ ÷ 10⁹ = 0.004.", "One error every 1 ÷ 0.004 = 250 copies."] },
          { id:"d5", kind:"num", goal:6, star:true, prompt:"In a model, a cell’s telomere is 8000 bp and shrinks by 50 bp per division. The cell stops dividing at 5000 bp. How many divisions can it make?",
            answer:60, display:"60 divisions", why:"Only 8000 − 5000 = 3000 bp can be lost: 3000 ÷ 50 = 60.",
            wrong:[{ match:160, fb:"Only the 3000 bp above the limit can be lost: 3000 ÷ 50." }, { match:100, fb:"That’s how far 5000 bp would last. Only the 3000 bp above the limit can be lost." }],
            general:"How much telomere can be lost before the limit?",
            hints:["How much telomere can be lost?", "8000 − 5000 = 3000 bp.", "3000 ÷ 50 = 60."] },
          { id:"d6", kind:"num", goal:4, star:true, prompt:"A linear chromosome has 3 origins. How many replication forks form?",
            answer:6, display:"6 forks", why:"Each origin opens a bubble with 2 forks: 3 × 2 = 6.",
            wrong:[{ match:3, fb:"Each origin opens a bubble with 2 forks. " + M4 }], general:"How many forks does one origin make?" }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Soren", how:"",
        instruction:"Soren made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Explain why the lagging strand is made in pieces.",
            steps:["Both template strands are exposed as the fork opens.", "DNA polymerase can add nucleotides only to a 3′ end.", "So on the lagging template, polymerase builds the new strand 3′ → 5′, toward the fork.", "Ligase then joins the pieces."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 is true; the mistake is earlier."],
            fixes:[
              { t:"So on the lagging template, polymerase builds 5′ → 3′ <strong>away</strong> from the fork, starting a new piece each time more template is exposed.", ok:true, why:"Every new strand grows 5′ → 3′; on the lagging side that’s away from the fork." },
              { t:"So both strands are built continuously.", why:"Then nothing would be made in pieces. " + M1 },
              { t:"So polymerase reads the lagging template 5′ → 3′ and builds 5′ → 3′ too.", why:"The template is always read 3′ → 5′." },
              { t:"Step 3 is correct.", why:"Nothing is ever built 3′ → 5′." }],
            hints:["Which direction are all new strands built in?", "5′ → 3′.", "On the lagging side, that’s away from the fork."] },
          { id:"e2", goal:1, task:"Write the new strand made on the template " + sq("5′-CGTAAG-3′") + ".",
            steps:["The template is " + sq("5′-CGTAAG-3′") + ".", "Pair each base: C–G, G–C, T–A, A–T, A–T, G–C.", "So the new strand is " + sq("5′-GCATTC-3′") + ".", "Polymerase built it from its 5′ end to its 3′ end."],
            answer:2,
            stepFb:["Step 1 restates it.", "Step 2 is correct.", "", "Step 4’s rule is right; the ends in step 3 are wrong."],
            fixes:[
              { t:"The new strand is " + sq("3′-GCATTC-5′") + ", which reads " + sq("5′-CTTACG-3′") + " the usual way.", ok:true, why:"Antiparallel: under a template written 5′ → 3′, the new strand’s left end is 3′." },
              { t:"The new strand is " + sq("5′-CGTAAG-3′") + ".", why:"That copies the template." },
              { t:"The new strand is " + sq("3′-GCAUUC-5′") + ".", why:"DNA uses T." },
              { t:"Step 3 is correct.", why:M2 }],
            hints:["Which way does the new strand run?", "Opposite to the template: its left end is 3′.", sq("5′-CTTACG-3′") + "."] },
          { id:"e3", goal:6, task:"Explain why chromosomes shorten and what telomerase does.",
            steps:["At the end of a linear chromosome, the last primer on the lagging strand is removed.", "No 3′ end is available to fill that gap with DNA.", "So the chromosome gets slightly shorter with each round of copying.", "Telomerase rebuilds the ends in all body cells, so normal cells never lose telomere length."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"Telomerase extends telomeres in a few cell types (stem and germ cells) and in most cancer cells; most body cells’ telomeres slowly shorten.", ok:true, why:M6 },
              { t:"Telomerase cuts telomeres shorter.", why:"Telomerase extends the ends; it doesn’t cut them." },
              { t:"Telomerase is a DNA polymerase that needs a primer.", why:"It carries its own RNA template." },
              { t:"Step 4 is correct.", why:M6 }],
            hints:["Do most of your body cells have active telomerase?", "No; it’s mostly in stem cells, germ cells and cancer cells.", "Most cells’ telomeres shorten."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you about the fork: that one strand runs ‘backwards’ in pieces, or that the roles swap across a bubble?" },
      { id:"j2", q:"In your own words, explain how the single rule ‘add only to a 3′ end’ creates leading and lagging strands." },
      { id:"j3", q:"Explain to a friend how proofreading, mismatch repair and excision repair work together, using the error-rate numbers." },
      { id:"j4", q:"Which counting question (primers, forks, telomeres) still trips you up? What’s your plan?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"DNA polymerase adds each new nucleotide to the…", options:[
          { t:"3′ end of the growing strand, so strands grow 5′ → 3′", ok:true, why:"Only the free 3′ –OH can form the next bond." },
          { t:"5′ end of the growing strand, so strands grow 3′ → 5′", why:M1 },
          { t:"3′ end on the leading strand, but the 5′ end on the lagging strand", why:"Both new strands grow at their 3′ ends." },
          { t:"Either end, whichever is closer to the fork", why:M1 }] },
        b:{ prompt:"In which direction does DNA polymerase read the template strand?", options:[
          { t:"3′ → 5′, while building the new strand 5′ → 3′", ok:true, why:"The template and the new strand are antiparallel." },
          { t:"5′ → 3′, while building the new strand 5′ → 3′", why:"The two strands are antiparallel." },
          { t:"3′ → 5′ on the leading template, 5′ → 3′ on the lagging template", why:"Every template is read 3′ → 5′." },
          { t:"It reads both directions at once", why:M1 }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What are Okazaki fragments?", options:[
          { t:"Short pieces of new DNA on the lagging strand, each started from its own RNA primer", ok:true, why:"The lagging strand is made in pieces, one primer per piece." },
          { t:"Short pieces of RNA that become the leading strand", why:"Primers are RNA, but the fragments are DNA." },
          { t:"Pieces of the old template cut out during repair", why:M5 },
          { t:"Fragments made on the leading strand", why:"The leading strand is continuous." }] },
        b:{ prompt:"On the lagging strand, which enzyme replaces each RNA primer with DNA?", options:[
          { t:"DNA polymerase I", ok:true, why:"Polymerase I swaps each primer for DNA." },
          { t:"DNA ligase", why:"Ligase seals nicks; it doesn’t swap RNA for DNA." },
          { t:"Primase", why:"Primase makes primers." },
          { t:"Helicase", why:"Helicase unwinds." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"Which repair fixes damage from UV light, such as a thymine dimer?", options:[
          { t:"Excision repair: the damaged stretch is cut out and refilled", ok:true, why:"Enzymes cut out the dimer; a polymerase refills and ligase seals." },
          { t:"Proofreading by DNA polymerase", why:"Proofreading checks bases as they’re added during copying." },
          { t:"Telomerase", why:"Telomerase extends chromosome ends." },
          { t:"Primase", why:"Primase makes primers." }] },
        b:{ prompt:"Which mechanism corrects a wrong base the moment it’s added?", options:[
          { t:"Proofreading by DNA polymerase", ok:true, why:"Polymerase backs up and removes the wrong base during copying." },
          { t:"Mismatch repair", why:"Mismatch repair works after copying, on what proofreading missed." },
          { t:"Excision repair", why:"That fixes damage, such as UV dimers." },
          { t:"Ligase", why:"Ligase seals nicks." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"A fork is moving to the right. The top template runs 3′ (on the left) to 5′ (on the right). Is the new strand made on the top template leading or lagging?", options:[
          { t:"Leading: the new strand runs 5′ → 3′ left to right, so its 3′ end faces the moving fork", ok:true, why:"Its 3′ end keeps up with the fork." },
          { t:"Lagging, because the template ends at 5′ on the right", why:"Work out which way the <strong>new</strong> strand grows." },
          { t:"Lagging, because the top strand is always the lagging template", why:M4 },
          { t:"Neither; the top strand isn’t copied", why:"Both strands are copied." }] },
        b:{ prompt:"A fork is moving to the right. The bottom template runs 5′ (on the left) to 3′ (on the right). Is the new strand made on the bottom template leading or lagging?", options:[
          { t:"Lagging: the new strand runs 3′ → 5′ left to right, so its 3′ end points away from the fork", ok:true, why:"It grows 5′ → 3′ leftward, away from the fork, in pieces." },
          { t:"Leading, because the template’s 3′ end faces the fork", why:"The template’s direction is opposite to the new strand’s." },
          { t:"Leading, because the bottom strand is always leading", why:M4 },
          { t:"Lagging, because it’s built 3′ → 5′", why:"Right answer, wrong reason: it’s built 5′ → 3′ away from the fork." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"A bacterial fork has opened 3000 nucleotides. The lagging strand is made in 1000-nucleotide fragments. How many primers has the lagging strand needed so far?", options:[
          { t:"3", ok:true, why:"3000 ÷ 1000." },
          { t:"1", why:"That’s the leading strand." },
          { t:"4", why:"That adds the leading strand’s primer; the question asks about the lagging strand." },
          { t:"3000", why:"One primer per fragment, not per nucleotide." }] },
        b:{ prompt:"A eukaryotic fork has opened 2000 nucleotides with 200-nucleotide fragments. How many primers has the lagging strand needed?", options:[
          { t:"10", ok:true, why:"2000 ÷ 200." },
          { t:"1", why:M3 },
          { t:"11", why:"That adds the leading primer." },
          { t:"200", why:"That’s the fragment length." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Polymerase alone makes about 1 error in 10⁵ bases. Proofreading improves this 100-fold, and mismatch repair a further 1000-fold. What’s the final error rate?", options:[
          { t:"About 1 in 10¹⁰", ok:true, why:"10⁵ × 10² × 10³." },
          { t:"About 1 in 1.1 × 10⁸", why:"That adds the improvements (100 + 1000 = 1100-fold); they multiply." },
          { t:"About 1 in 1100", why:"That ignores the starting rate." },
          { t:"About 1 in 10⁸", why:"That leaves out proofreading’s 100-fold improvement." }] },
        b:{ prompt:"Polymerase alone makes about 1 error in 10⁴ bases. Proofreading improves this 1000-fold, and mismatch repair a further 100-fold. What’s the final rate?", options:[
          { t:"About 1 in 10⁹", ok:true, why:"10⁴ × 10³ × 10²." },
          { t:"About 1 in 1.1 × 10⁷", why:"The improvements multiply, not add." },
          { t:"About 1 in 10⁷", why:"That leaves out mismatch repair." },
          { t:"About 1 in 10⁶", why:"That leaves out proofreading." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why one new strand is made in pieces?", options:[
          { t:"“Polymerase can only add to a 3′ end, so the new strands grow 5′ → 3′. On one template that means growing away from the opening fork, so polymerase must keep starting new pieces as more template is exposed.”", ok:true, why:"It starts from the 3′-end rule and links it to the fork’s direction." },
          { t:"“The lagging template is damaged, so it can only be copied in pieces.”", why:"Nothing is damaged; it’s about direction." },
          { t:"“There isn’t enough polymerase to copy both strands continuously.”", why:"It’s direction, not supply." },
          { t:"“The lagging strand is built 3′ → 5′, which is slower.”", why:M1 }] },
        b:{ prompt:"Which is the best explanation of why the leading strand needs only one primer?", options:[
          { t:"“Its 3′ end faces the fork, so as each new base pair is exposed, polymerase adds straight onto the same growing strand.”", ok:true, why:"One start, then continuous growth toward the fork." },
          { t:"“It’s built 3′ → 5′, which doesn’t need primers.”", why:M1 },
          { t:"“It uses ligase instead of primers.”", why:"Ligase joins pieces; it doesn’t start strands." },
          { t:"“Primers are only needed on the lagging strand’s template because it’s RNA.”", why:"Both templates are DNA." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"Which is the best description of the end-replication problem?", options:[
          { t:"“When the last RNA primer at a chromosome’s end is removed, there is no 3′ end to extend into the gap, so a little DNA is lost each round; telomeres are the expendable buffer.”", ok:true, why:"It names the cause (no 3′ end for the last gap) and the buffer." },
          { t:"“Helicase can’t open the DNA at chromosome ends.”", why:"Unwinding isn’t the problem." },
          { t:"“Genes at the ends are copied twice.”", why:"Nothing is copied twice." },
          { t:"“Telomerase removes DNA from the ends each round.”", why:M6 }] },
        b:{ prompt:"Which statement about telomeres is accurate?", options:[
          { t:"“They are repeated, non-coding sequences at chromosome ends that shorten with each division in most body cells.”", ok:true, why:M6 },
          { t:"“They contain the most important genes, which is why they’re protected.”", why:M6 },
          { t:"“They shorten only in cancer cells.”", why:"Cancer cells usually <strong>keep</strong> their length with telomerase." },
          { t:"“They are found in bacterial chromosomes.”", why:"Circular chromosomes have no ends." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Most cancer cells switch telomerase on. A drug that blocks telomerase is being tested. Which effect would it be expected to have on the cancer cells?", options:[
          { t:"Their telomeres would shorten each division, eventually limiting how many more times they can divide", ok:true, why:"Without telomerase, the end-replication problem returns." },
          { t:"They would stop copying DNA immediately", why:"Telomerase only affects the chromosome ends." },
          { t:"Their DNA would gain mutations everywhere", why:"Telomerase isn’t a repair enzyme." },
          { t:"It would lengthen their telomeres", why:"Blocking telomerase does the opposite." }] },
        b:{ prompt:"People with xeroderma pigmentosum can’t do excision repair. Which advice and explanation fit?", options:[
          { t:"Avoid UV exposure: thymine dimers can’t be removed, so mutations and skin cancers are far more likely", ok:true, why:"UV makes dimers that only excision repair removes." },
          { t:"Avoid sugar, because their polymerase can’t proofread", why:"The defect is in excision repair." },
          { t:"No precautions are needed, because proofreading fixes UV damage", why:M5 },
          { t:"Take telomerase supplements", why:M6 }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"<em>E. coli</em> has one circular chromosome with a single origin. How many replication forks form, and how many leading strands are made?", options:[
          { t:"2 forks and 2 leading strands", ok:true, why:"One bubble: two forks, each with a leading strand." },
          { t:"1 fork and 1 leading strand", why:"An origin opens in both directions." },
          { t:"2 forks and 1 leading strand", why:"Each fork has its own leading strand." },
          { t:"4 forks and 4 leading strands", why:"One origin makes one bubble with two forks." }] },
        b:{ prompt:"A linear eukaryotic chromosome uses 4 origins. How many replication forks form?", options:[
          { t:"8", ok:true, why:"Each origin opens a bubble with 2 forks." },
          { t:"4", why:M4 },
          { t:"5", why:"Origins don’t share forks." },
          { t:"2", why:"That’s one origin." }] } }
    ]
  },
  task:{
    title:"Origins on the map", summary:"Origins on the map",
    statement:"<p>A model chromosome is 120 nucleotides long. Choose where to put the origins of replication so that copying meets every condition. Can you find all the answers?</p><ol class=\"dd-conds\"><li>Copying finishes in at most 3 time steps.</li><li>It uses exactly 3 origins.</li><li>No two origins are closer than 40 nucleotides.</li><li>It uses at most 18 primers in total.</li></ol>",
    how:"Tap a position to place or remove an origin. Then press Run copying to watch the bubbles open.",
    model:"Each origin opens a bubble with two forks. Forks move 10 nt per step and stop at a chromosome end or when they meet a fork from the next bubble. Each fork’s leading strand needs 1 primer, and its lagging strand needs 1 primer for every 10 nt (or part of 10) the fork travels.",
    checks:["Finishes in ≤ 3 steps", "Exactly 3 origins", "Origins at least 40 nt apart", "At most 18 primers"],
    tips:["The forks at each end have to reach the chromosome’s end. Keep the outer origins within 30 nt of the ends.", "The task asks for exactly three origins.", "Spread them out.", "A fork that travels 15 nt needs 2 lagging primers; gaps that are multiples of 20 waste none."],
    explainPrompt:"Explain how you balanced speed (finishing quickly) against the number of primers.",
    vocab:"Use the words origin, replication fork, leading strand, lagging strand and primer.",
    afterAt:5,
    after3:"Only {20, 60, 100} finishes in 2 steps: every fork travels exactly 20 nt. The others take 3 steps but still use only 18 primers, because every gap is a multiple of 20."
  },
  cards:[
    ["The direction rule", "Polymerase adds only to a 3′ end: new strands grow 5′ → 3′; templates are read 3′ → 5′."],
    ["Leading strand", "Made continuously toward the fork from one primer."],
    ["Lagging strand", "Made away from the fork in Okazaki fragments, each with its own primer."],
    ["Okazaki fragment", "A short piece of lagging-strand DNA (about 1000–2000 nt in bacteria, about 100–200 in eukaryotes)."],
    ["DNA polymerase I", "Replaces RNA primers with DNA."],
    ["DNA ligase", "Seals the nicks between fragments."],
    ["Replication bubble", "One origin, two forks moving apart; each template is leading on one side, lagging on the other."],
    ["Proofreading", "Polymerase removes a wrong base right after adding it."],
    ["Mismatch repair", "After copying, cuts out a stretch of the new strand around a mismatch and refills it."],
    ["Excision repair", "Cuts out damage such as UV thymine dimers, then refills and seals."],
    ["End-replication problem", "The last primer’s gap at a chromosome end can’t be filled, so ends shorten."],
    ["Telomeres and telomerase", "Non-coding end repeats (" + sq("TTAGGG") + " in humans); telomerase extends them in stem, germ and most cancer cells."]
  ]
};
