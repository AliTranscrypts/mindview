// SBI4U 30 PCR (Polymerase Chain Reaction). Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/30-pcr.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M8 but gives no feedback of its own.
const M1 = "95 °C breaks only the <strong>hydrogen bonds</strong> between base pairs. Each strand’s sugar–phosphate backbone stays whole.";
const M2 = "DNA polymerase can only <strong>add</strong> to an existing 3′ end. The primer supplies that end.";
const M3 = "Nucleotides join the <strong>3′ end</strong>, so every new strand grows 5′ → 3′.";
const M4 = "The reverse primer pairs with the top strand, so it’s complementary <strong>and</strong> antiparallel: the complement, read backwards, written 5′ → 3′.";
const M5 = "Copies made from the long original strands run past the target at one end. Exact-length molecules first appear in cycle 3.";
const M6 = "Each cycle <strong>doubles</strong> the copies: 1, 2, 4, 8, … 2ⁿ, not 2, 4, 6, 8.";
const M7 = "Most polymerases are destroyed by the first 95 °C step. <i>Taq</i> comes from a hot-spring bacterium and survives it.";
const M8 = "PCR copies only the region between the two primers.";
// sequences in a monospace font (plan build notes)
const sq = s => '<span class="pcr-sq">' + s + "</span>";
const n = "<i>n</i>";
const USE = "Use these values: 2¹⁰ = 1024.";

export default {
  id:"30-pcr",
  kind:"topic",
  title:"PCR (Polymerase Chain Reaction)",
  topic:"PCR (Polymerase Chain Reaction)",
  readyTopic:"PCR",
  hero:{
    eq:'<span class="pcr-heq"><span class="pcr-heq1">95 °C → 55 °C → 72 °C, repeat</span><span class="pcr-heq2">1 → 2 → 4 → 8 → … → 2<sup><i>n</i></sup></span></span>',
    eqLabel:"95 degrees, then 55 degrees, then 72 degrees, repeated. 1, 2, 4, 8, and so on up to 2 to the n.",
    eqSize:"sm",
    headline:"Three temperatures, repeated, turn one molecule into a billion",
    text:"The <strong>polymerase chain reaction (PCR)</strong> copies one chosen stretch of DNA. Heat separates the strands, cooling lets two short <strong>primers</strong> mark the ends of the stretch, and a heat-proof enzyme, <strong><i>Taq</i> polymerase</strong>, builds new strands from them. Every cycle <strong>doubles</strong> the copies, so about 30 cycles turn a few cells’ worth of DNA into enough to see and study.",
    fig:{ html:'<div class="pcr-hero" id="pcr-hero" role="img" aria-label="A double-stranded DNA molecule with its target region shaded. A temperature strip lights 95 °C and the strands drift apart; at 55 °C two magenta primers slide onto the ends of the target; at 72 °C blue new strands grow from the primers’ 3′ ends. Two molecules sit where there was one and the counter reads 2. The loop speeds up: 4, 8, 16, and the counter reaches about 1 000 000 000 after 30 cycles."></div>' }
  },
  goals:[
    "I can describe the three steps of a PCR cycle, their temperatures, and what happens to the DNA in each.",
    "I can explain why a heat-stable polymerase (<i>Taq</i>) makes PCR possible.",
    "I can explain what primers do and why the polymerase needs them.",
    "I can calculate copy numbers after <i>n</i> cycles and explain when exact-length copies appear.",
    "I can predict and troubleshoot the result of changing a PCR condition, using a fair test.",
    "I can design primers for a short sequence and explain how PCR is used in forensics, parentage testing and research."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Base pairing and direction", goal:6,
          prompt:"Which strand pairs with " + sq("5′-ATGC-3′") + "?",
          options:[
            { t:sq("3′-TACG-5′"), ok:true, why:"Complementary bases (A–T, G–C), running the opposite way." },
            { t:sq("5′-TACG-3′"), why:"Its 5′ end would sit opposite the other strand’s 5′ end." },
            { t:sq("3′-UACG-5′"), why:"DNA uses T." },
            { t:sq("3′-ATGC-5′"), why:"A pairs with T, not with A." }],
          hints:["Which base pairs with A? With G?", "Complements: T, A, C, G.", "Run it the opposite way: " + sq("3′-TACG-5′") + "."] },
        { id:"w2", skill:"Base pairing and direction", goal:6,
          prompt:"Written 5′ → 3′, which strand pairs with " + sq("5′-AAGTC-3′") + "?",
          options:[
            { t:sq("5′-GACTT-3′"), ok:true, why:"Complement TTCAG runs 3′ → 5′; read backwards it’s " + sq("5′-GACTT-3′") + "." },
            { t:sq("5′-TTCAG-3′"), why:"TTCAG is written 3′ → 5′ under the original." },
            { t:sq("5′-CTGAA-3′"), why:"C doesn’t pair with C." },
            { t:sq("5′-AAGTC-3′"), why:"Identical strands don’t pair." }],
          hints:["Write the complement under each base.", "That’s " + sq("3′-TTCAG-5′") + ".", "Read it from the 5′ end: " + sq("5′-GACTT-3′") + "."] },
        { id:"w3", skill:"Polymerase rules", goal:3,
          prompt:"DNA polymerase adds new nucleotides to which end of a growing strand?",
          options:[
            { t:"The 3′ end", ok:true, why:"So new DNA grows 5′ → 3′ (module 22)." },
            { t:"The 5′ end", why:"That would grow 3′ → 5′." },
            { t:"Either end", why:"Only the 3′ end has the free –OH it needs." },
            { t:"Whichever end is nearer the helicase", why:"Direction is fixed by chemistry, not position." }],
          hints:["Recall leading and lagging strands.", "Synthesis is 5′ → 3′.", "The 3′ end."] },
        { id:"w4", skill:"Polymerase rules", goal:3,
          prompt:"Why does DNA copying in a cell need a primer?",
          options:[
            { t:"Polymerase can only add to an existing 3′ end, and the primer supplies one", ok:true, why:"Polymerase can’t start a strand from nothing; it extends the primer’s 3′ end." },
            { t:"The primer unwinds the double helix", why:"That’s helicase’s job." },
            { t:"The primer joins the Okazaki fragments", why:"That’s ligase." },
            { t:"The primer marks where copying stops", why:"It marks where copying starts." }],
          hints:["What can’t polymerase do alone?", "It can’t start from nothing.", "A primer provides a 3′ end to build on."] },
        { id:"w5", skill:"Doubling", goal:4,
          prompt:"What is 2⁶?",
          options:[
            { t:"64", ok:true, why:"2 × 2 × 2 × 2 × 2 × 2." },
            { t:"12", why:"That’s 2 × 6. A power multiplies six 2s together." },
            { t:"36", why:"That’s 6², six squared." },
            { t:"32", why:"That’s 2⁵, one doubling short." }],
          hints:["Keep doubling from 2.", "2, 4, 8, 16, 32, …", "64."] },
        { id:"w6", skill:"Doubling", goal:4,
          prompt:"A culture of 3 cells doubles every hour. How many cells after 4 hours?",
          options:[
            { t:"48", ok:true, why:"3 × 2⁴ = 3 × 16." },
            { t:"12", why:"That adds 3 each hour. Doubling multiplies by 2 each hour." },
            { t:"81", why:"That’s 3⁴. The base is 2 (doubling), not 3." },
            { t:"24", why:"That’s 3 × 2³. 4 hours means 4 doublings." }],
          hints:["Double 3 four times.", "3, 6, 12, 24, …", "48."] }
      ],
      refreshers:{
        "Base pairing and direction":"A pairs with T and G with C, and paired strands run in opposite directions. To write the partner of a strand 5′ → 3′, complement every base, then read the result backwards.",
        "Polymerase rules":"DNA polymerase only adds nucleotides to an existing 3′ end, so it needs a primer to start, and new strands grow 5′ → 3′. Heat breaks the hydrogen bonds between strands, not the backbone.",
        "Doubling":"Doubling <i>n</i> times multiplies by 2ⁿ. Use these values: 2¹⁰ = 1024 ≈ 1000 and 2²⁰ ≈ 1 000 000."
      }
    }
  },
  explore:{
    heading:"Thermocycler",
    intro:"Run PCR one step at a time, then watch the copies pile up. Change a setting and see what breaks.",
    model:"Model values: strands separate at 90 °C or more; primers pair only at their sites from 50 to 60 °C; a band is visible at about 1 000 000 exact-length copies; the realistic ending levels off after 30 cycles. Real values depend on the primers and the lab.",
    extNote:"<i>Taq</i> works best here",
    // Troubleshoot mode's faulty run (TC3 start state)
    fault:{ den:95, ann:44, pol:"taq", pri:"both", n0:10, cyc:16 },
    faultCase:"Case file: a crime-lab run with 10 starting copies gave extra bands and no visible target band. Fix it by changing <strong>exactly two</strong> settings.",
    predIntro:"Make a prediction first. Then the thermocycler will show you what really happens.",
    predictions:[
      { id:"p1", prompt:"One molecule, before cycle 1. What does the first heating to 95 °C do to the DNA?",
        options:[{ t:"The two strands separate", ok:true }, { t:"The DNA breaks into single nucleotides" }, { t:"Nothing; heating only activates the primers" }, { t:"The DNA is cut at the primer sites" }],
        explain:"Only the hydrogen bonds between bases break. Each strand’s backbone is held by covalent bonds that 95 °C doesn’t break." },
      { id:"p2", prompt:"One starting molecule; step to cycle 3. After 3 cycles, how many molecules are <strong>exactly</strong> the target length?",
        options:[{ t:"2", ok:true }, { t:"8" }, { t:"0" }, { t:"6" }],
        explain:"Copies made from the two original strands run past the target. Exact-length molecules first appear in cycle 3: 2³ − 2(3) = 2." },
      { id:"p3", prompt:"The polymerase is switched to human DNA polymerase, and the machine runs 10 cycles. What happens to the copy count?",
        options:[{ t:"No new copies at all", ok:true }, { t:"Doubles as usual" }, { t:"Grows, but more slowly" }, { t:"Starts doubling once the machine cools" }],
        explain:"Most polymerases are destroyed by heat before the first extension. <i>Taq</i>, from a hot-spring bacterium, survives." },
      { id:"p4", prompt:"Primers set to “forward only”, one starting molecule, 10 cycles. How many new strands after 10 cycles?",
        options:[{ t:"10", ok:true }, { t:"1024" }, { t:"0" }, { t:"20" }],
        explain:"With one primer, only the original bottom strand can be copied, once per cycle. The new strands have the forward primer’s sequence, so the forward primer can’t pair with them. Doubling needs both primers." }
    ],
    chalIntro:"Set the thermocycler to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:[4, 5], prompt:"With 1 starting molecule and correct settings, get a visible band in as few cycles as possible.",
        why:"2²⁰ − 40 = 1 048 536 exact-length copies, just past 1 000 000. At 19 cycles there are only 524 250.",
        general:"Use 1 starting copy, both primers, <i>Taq</i>, denaturation at 90 °C or more and annealing from 50 to 60 °C, then find the fewest cycles.",
        msgs:{ more:"Visible, but not the fewest.", loose:"A band, plus extra bands. Raise the annealing temperature.", c19:"About 524 000 exact copies: one more doubling needed.", n0:"Set the starting copies to 1.", few:"Not visible yet: you need about 1 000 000 exact-length copies." },
        hints:["You need about a million exact-length copies.", "2²⁰ ≈ 1 000 000.", "20 cycles at 50–60 °C annealing with <i>Taq</i>."] },
      { id:"tc2", goal:[4, 5], prompt:"Now start with 100 copies. What’s the fewest number of cycles that gives a visible band?",
        why:"100 × (2¹⁴ − 28) = 100 × 16 356 = 1 635 600. At 13 cycles there are only 816 600.",
        general:"Keep the settings valid (both primers, <i>Taq</i>, at least 90 °C, 50–60 °C), start with 100 copies and find the fewest cycles.",
        msgs:{ c20:"Works, but 100 copies is a head start of between 6 and 7 doublings.", c13:"816 600: just short.", more:"Visible, but not the fewest.", n0:"Set the starting copies to 100.", few:"Not visible yet: you need about 1 000 000 exact-length copies." },
        hints:["You need about 1 000 000 ÷ 100 = 10 000 times more.", "2¹³ = 8192 and 2¹⁴ = 16 384.", "14 cycles."] },
      { id:"tc3", goal:5, stretch:true, prompt:"Troubleshoot mode. A crime-lab run with 10 starting copies gave extra bands and no visible target band. Fix it by changing <strong>exactly two</strong> settings.",
        why:"Annealing from 50 to 60 °C stops the extra bands, and at 17 cycles 10 × 131 038 = 1 310 380 exact copies make a visible band (16 cycles gives only 655 040).",
        general:"Change exactly two settings so that the extra bands go and the target band becomes visible.",
        msgs:{ mode:"Switch to Troubleshoot mode to load the crime-lab run.", annOnly:"Extra bands gone, but 16 cycles gives about 655 000 exact copies.", cycOnly:"More copies, but the extra bands remain.", sample:"In a real case you can’t add more evidence. Change the run, not the sample.", none:"Nothing has changed yet: change exactly two settings.", many:"That changes more than two settings. Change exactly two." },
        hints:["There are two problems: extra bands, and too few copies.", "Extra bands mean the primers pair loosely. Raise the annealing temperature into 50–60 °C.", "10 × (2ⁿ − 2" + n + ") must reach 1 000 000: 16 cycles is too few, 17 is enough."] }
    ]
  },
  part3:{
    slug:"primers", name:"Primers", heading:"Design the primers",
    intro:"Build the primers for a sequence yourself, then test a condition fairly and weigh a real use of PCR.",
    // Sequence P (invented for this module); target = top-strand bases 5–36
    seqP:"GATCATGCCAGTTCGAATGGCTAGCTTACGGATCTCAAGT", tgt:[5, 36],
    stations:[
      { id:"s1", n:1, t:"The forward primer",
        text:"The shaded region of Sequence P is the target. Tap the <strong>first 8 bases of the target</strong> on the top strand (tap the first base, then the last). Keyboard: arrows move, Shift + arrow extends the highlight, Enter confirms.",
        banner:"The forward primer has the top strand’s sequence, so it pairs with the bottom strand.",
        msgs:{ none:"Tap the first base you want, then the last.", len:"A primer here is 8 bases long. Choose 8 bases.", outside:"That starts outside the shaded target.", right:"Those are the last bases of the target: that end belongs to the reverse primer. Start at the left end of the target.", inside:"Start right at the left edge of the shaded target." } },
      { id:"s2", n:2, t:"Build the reverse primer",
        text:"Three steps: select the <strong>last 8 target bases</strong> of the top strand, press <strong>Complement</strong>, then press <strong>Write 5′ → 3′</strong>. Test your primer at any stage to see what it would do.",
        msgs:{ none:"Select the last 8 bases of the target first.", len:"Choose 8 bases.", outside:"That runs outside the shaded target.", left:"Those are the first bases of the target: that end belongs to the forward primer.", inside:"Select the last 8 bases of the target: the right edge of the shading." },
        good:"5′-GAGATCCG-3′ pairs with the top strand at the right end, and its 3′ end points left, into the target.",
        copy:"A copy of the top strand (5′-CGGATCTC-3′) pairs with the <strong>bottom</strong> strand at the right end, and its 3′ end points <strong>away</strong> from the target. Nothing between the primers would be copied.",
        unrev:"Written 5′ → 3′ without reversing, 5′-GCCTAGAG-3′ fails to pair: lined up antiparallel against the top strand, most of its bases are mismatched. " + M4 },
      { id:"s3", n:3, t:"A fair test",
        text:"A student wants the best annealing temperature for Sequence P’s primers. They set up five reactions at 45, 50, 55, 60 and 65 °C. Tap a card, then the box it belongs in.",
        cards:[
          { id:"v1", t:"Annealing temperature", answer:"iv" },
          { id:"v2", t:"Band brightness and extra bands", answer:"dv" },
          { id:"v3", t:"Starting DNA", answer:"cv" },
          { id:"v4", t:"Primers", answer:"cv" },
          { id:"v5", t:"Polymerase", answer:"cv" },
          { id:"v6", t:"Number of cycles", answer:"cv" },
          { id:"v7", t:"Denaturation and extension temperatures", answer:"cv" }],
        boxes:[{ id:"iv", t:"Independent variable", sub:"what the student changes" }, { id:"dv", t:"Dependent variable", sub:"what is measured" }, { id:"cv", t:"Controlled variables", sub:"kept the same" }],
        wrong:{ iv:"The independent variable is the one setting the student deliberately changes.", dv:"The dependent variable is what the student looks at to see the effect.", cv:"Controlled variables are kept the same in every tube." },
        control:"A sixth tube with <strong>no DNA added</strong> is the control. If it shows a band, something was contaminated with DNA.",
        tubes:[
          { id:"t45", t:"45 °C", res:"Target band plus extra bands", kind:"extra" },
          { id:"t50", t:"50 °C", res:"One clean band", kind:"clean" },
          { id:"t55", t:"55 °C", res:"One clean band", kind:"clean" },
          { id:"t60", t:"60 °C", res:"One clean band", kind:"clean" },
          { id:"t65", t:"65 °C", res:"Nothing", kind:"none" },
          { id:"tc", t:"No DNA (control)", res:"Nothing: no contamination", kind:"none" }],
        concl:"The primers work cleanly from 50 to 60 °C.", answer:{ lo:50, hi:60 },
        conclWrong:"Look at which tubes show one clean band, and nothing else." },
      { id:"s4", n:4, t:"Who gets to use DNA profiles?",
        // VERIFY: the National DNA Data Bank's scope (crime-scene profiles and people convicted of certain offences) and the
        // statement about police searches of consumer ancestry databases are time-sensitive (plan §6.4: verify before release).
        text:"Canada’s National DNA Data Bank, run by the RCMP, stores DNA profiles from crime scenes and from people convicted of certain offences. Some police investigations have also searched consumer ancestry databases for relatives of an unknown suspect.",
        sortHow:"Sort each card: is it a scientific fact or a value judgement?",
        cards:[
          { id:"c1", t:"PCR can make millions of copies from the DNA in a few cells", answer:"fact" },
          { id:"c2", t:"A DNA profile compares a set of short repeated regions, not the whole genome", answer:"fact" },
          { id:"c3", t:"Close relatives share more of these regions’ lengths than unrelated people do", answer:"fact" },
          { id:"c4", t:"Police should be able to search ancestry databases without asking customers", answer:"value" },
          { id:"c5", t:"Everyone’s DNA profile should be stored in a national databank", answer:"value" }],
        sortWrong:{ fact:"A fact can be checked with evidence or measurement. This card says what <strong>should</strong> happen.", value:"A value judgement says what should happen. This card can be checked with evidence." },
        question:"Should ancestry-test customers be asked before police can search their data?",
        claims:["Yes: customers should be asked first", "No: police shouldn’t need to ask", "It depends on the case"],
        checklist:["A claim: your position", "Evidence: at least one fact card", "Reasoning that links your evidence to your claim"],
        valueNote:"Value cards are opinions, so they can’t be evidence on their own. Pick at least one fact card.",
        saved:"Your answer is saved only in this browser." }
    ],
    quickCheck:{
      title:"Quick check", summary:"Design the primers quick check",
      items:[
        { id:"q1", goal:6, prompt:"Forward primer for Sequence P’s target?",
          choices:[
            { t:sq("5′-ATGCCAGT-3′"), ok:true, fb:"Right: the same sequence as the first 8 target bases of the top strand." },
            { t:sq("5′-TACGGTCA-3′"), fb:"That’s the complement; it would pair with the top strand." },
            { t:sq("5′-ACTGGCAT-3′"), fb:"That pairs with the top strand and points away from the target." },
            { t:sq("5′-GATCATGC-3′"), fb:"That starts outside the shaded target." }] },
        { id:"q2", goal:6, prompt:"Reverse primer for Sequence P’s target?",
          choices:[
            { t:sq("5′-GAGATCCG-3′"), ok:true, fb:"Right: the reverse complement of the last 8 target bases." },
            { t:sq("5′-CGGATCTC-3′"), fb:"A copy of the top strand pairs with the bottom strand." },
            { t:sq("5′-GCCTAGAG-3′"), fb:"Complemented but not reversed." },
            { t:sq("5′-CTCTAGGC-3′"), fb:"Reversed but not complemented." }] },
        { id:"q3", goal:5, prompt:"In the fair test, what is the independent variable?",
          choices:[
            { t:"Annealing temperature", ok:true, fb:"Right: it’s the one setting the student deliberately changed." },
            { t:"Band brightness", fb:"It’s the one setting the student deliberately changed." },
            { t:"Number of cycles", fb:"It’s the one setting the student deliberately changed." },
            { t:"The DNA sample", fb:"It’s the one setting the student deliberately changed." }] },
        { id:"q4", goal:5, prompt:"The no-DNA control tube shows a band. Most likely meaning?",
          choices:[
            { t:"Something was contaminated with DNA", ok:true, fb:"Right: PCR can only copy DNA that’s already there." },
            { t:"The primers made DNA from nothing", fb:"PCR can only copy DNA that’s already there. A band means stray DNA got in." },
            { t:"<i>Taq</i> is faulty", fb:"PCR can only copy DNA that’s already there. A band means stray DNA got in." },
            { t:"The annealing temperature was too high", fb:"PCR can only copy DNA that’s already there. A band means stray DNA got in." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"parts", type:"match", title:"PCR parts and steps", summary:"PCR parts and steps", goal:[1, 2, 3],
        instruction:"Tap a term, then the description that matches it.", how:"",
        leftTitle:"Term", rightTitle:"What it is or does",
        left:[
          { id:"l1", t:"Denaturation (≈ 95 °C)", goal:1, why:"Heat breaks only the hydrogen bonds; the backbones stay whole." },
          { id:"l2", t:"Annealing (≈ 55 °C)", goal:1, why:"Cooling lets the primers pair with their sites.",
            hints:["What needs to stick to the single strands before copying?", "Something short and complementary.", "Annealing: primers pair with their sites."] },
          { id:"l3", t:"Extension (72 °C)", goal:1, why:"New strands grow 5′ → 3′ from each primer." },
          { id:"l4", t:"<i>Taq</i> polymerase", goal:2, why:"It comes from a hot-spring bacterium." },
          { id:"l5", t:"Primer", goal:3, why:"Polymerase can only add to an existing 3′ end." },
          { id:"l6", t:"Free nucleotides", goal:1, why:"A, T, G and C units, joined into each new strand.",
            hints:["What does the polymerase join together?", "A, T, G and C units.", "Free nucleotides."] },
          { id:"l7", t:"Thermocycler", goal:1, why:"It runs the three temperatures again and again." },
          { id:"l8", t:"2ⁿ", goal:1, why:"Each ideal cycle doubles the copies." }],
        right:[
          { id:"r1", t:"Hydrogen bonds between base pairs break; the strands separate" },
          { id:"r2", t:"Primers form hydrogen bonds with their matching sites" },
          { id:"r3", t:"<i>Taq</i> adds nucleotides to each primer’s 3′ end" },
          { id:"r4", t:"A DNA polymerase that survives repeated heating" },
          { id:"r5", t:"A short single strand that gives the polymerase a 3′ end to start from" },
          { id:"r6", t:"The building blocks joined into each new strand" },
          { id:"r7", t:"The machine that changes the temperature automatically, cycle after cycle" },
          { id:"r8", t:"Copies of the target from one molecule after <i>n</i> ideal cycles" }],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l1|r3":"Nothing is built at 95 °C; that step only separates strands.",
          "l5|r4":"That’s the polymerase. A primer is a short strand of nucleotides, not an enzyme.",
          "l8|r6":"2ⁿ counts copies of the target, not of the whole genome."
        },
        wrongDefault:"Picture what’s happening to the DNA at that moment of the cycle." },
      { id:"copies", type:"numeric", title:"Count the copies", summary:"Count the copies", star:true, goal:[4, 5],
        instruction:"Six problems. Problems 3 to 6 are non-routine (★); problems 5 and 6 go beyond the Final Check. " + USE,
        items:[
          { id:"s1", goal:4, prompt:"From 1 molecule, how many copies of the target after 5 ideal cycles?",
            answer:32, display:"32", unit:"copies", why:"2⁵ = 32.",
            wrong:[{ match:10, fb:"That’s adding 2 each cycle. " + M6 }],
            hints:["Each cycle doubles the copies.", "1, 2, 4, 8, 16, …", "32."] },
          { id:"s2", goal:4, prompt:"From 3 molecules, how many copies after 4 cycles?",
            answer:48, display:"48", unit:"copies", why:"3 × 2⁴ = 3 × 16 = 48.",
            wrong:[{ match:12, fb:M6 + " 3 × 2⁴." }, { match:81, fb:M6 + " 3 × 2⁴." }],
            hints:["Double 3 four times.", "3 × 2⁴.", "48."] },
          { id:"s3", goal:4, star:true, prompt:"From 1 molecule, how many molecules are <strong>exactly</strong> the target length after 5 cycles?",
            answer:22, display:"22", unit:"molecules", why:"2⁵ − 2(5) = 32 − 10 = 22.",
            wrong:[{ match:32, fb:M5 }, { match:30, fb:"The longer molecules number 2" + n + " = 10, not 2." }],
            hints:["Exact-length = 2ⁿ − 2" + n + ".", "2⁵ = 32 and 2(5) = 10.", "22."] },
          { id:"s4", goal:4, star:true, prompt:"From 1 molecule, what’s the fewest number of cycles that gives more than 1000 copies?",
            answer:10, display:"10", unit:"cycles", why:"2⁹ = 512 is too few; 2¹⁰ = 1024 is more than 1000.",
            wrong:[{ match:9, fb:"2⁹ = 512." }],
            hints:["Find the first power of 2 above 1000.", "2⁹ = 512 and 2¹⁰ = 1024.", "10 cycles."] },
          { id:"s5", goal:4, star:true, prompt:"A sample starts with 25 copies and ends with 800. How many ideal cycles ran?",
            answer:5, display:"5", unit:"cycles", why:"800 ÷ 25 = 32 = 2⁵, so 5 doublings.",
            wrong:[{ match:32, fb:"That’s how many times bigger; 32 = 2⁵." }],
            hints:["How many times bigger is 800 than 25?", "800 ÷ 25 = 32.", "32 = 2⁵: 5 cycles."] },
          { id:"s6", goal:5, star:true, prompt:"Sample X shows a detectable amount after 18 cycles; sample Y, run alongside it, after 22 cycles. How many times more starting DNA did X have?",
            answer:16, display:"16", unit:"times", why:"Y needed 4 extra doublings to catch up: 2⁴ = 16.",
            wrong:[{ match:4, fb:"Each cycle doubles: 4 extra cycles means 2⁴ times." }],
            hints:["Y needed extra cycles to catch up.", "Each extra cycle doubles: 22 − 18 = 4 doublings.", "2⁴ = 16 times more."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Reza", goal:[1, 4, 6], how:"",
        instruction:"Reza made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:6, task:"Write the 8-base reverse primer for the target in Sequence P.",
            steps:["The target ends with the top-strand bases " + sq("5′-CGGATCTC-3′") + ".", "The reverse primer must pair with the top strand, so its bases are complementary.", "The complement of " + sq("CGGATCTC") + ", base by base, is " + sq("GCCTAGAG") + ".", "So the reverse primer is " + sq("5′-GCCTAGAG-3′") + ".", "Its 3′ end points into the target."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "Step 3 is correct: those are the paired bases.", "", "Step 5 follows step 4. The mistake is earlier."],
            fixes:[
              { t:"The complement runs 3′ → 5′, so reverse it: " + sq("5′-GAGATCCG-3′") + ".", ok:true, why:M4 },
              { t:"Use " + sq("5′-CGGATCTC-3′") + ", the top strand itself.", why:"That pairs with the bottom strand and points away." },
              { t:"Use the first 8 bases of the top strand instead.", why:"That’s the forward primer." },
              { t:"Step 4 is correct.", why:"Written 5′ → 3′, the complement must be read backwards." }],
            hints:["Which way does the complement run?", "Under a 5′ → 3′ strand, the complement is 3′ → 5′.", "Reverse it: " + sq("5′-GAGATCCG-3′") + "."] },
          { id:"e2", goal:4, task:"Starting from one DNA molecule, how many molecules are exactly the target length after 4 cycles?",
            steps:["Each cycle doubles the number of molecules.", "After 4 cycles there are 2⁴ = 16 molecules.", "Every new strand starts at a primer, so all 16 are exactly the target length.", "So the answer is 16."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"Strands copied from the long originals run past the target at one end. Only 2⁴ − 2(4) = 8 are exact.", ok:true, why:M5 },
              { t:"16 − 2 = 14: only the two original strands are longer.", why:"The first copies of the originals are longer too." },
              { t:"0: exact-length molecules appear only after cycle 5.", why:"They appear in cycle 3." },
              { t:"Step 3 is correct.", why:M5 }],
            hints:["Where does a copy of an original strand end?", "Where the original ends: past the target.", "16 − 8 = 8."] },
          { id:"e3", goal:1, task:"Describe one PCR cycle.",
            steps:["Heating to about 95 °C breaks the hydrogen bonds between base pairs, so the strands separate.", "Cooling to about 55 °C lets the primers pair with their matching sites.", "At 72 °C, <i>Taq</i> polymerase adds nucleotides to the 5′ end of each primer.", "So each new strand grows in the 3′ → 5′ direction."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"<i>Taq</i> adds to the 3′ end, so each new strand grows 5′ → 3′.", ok:true, why:M3 },
              { t:"At 72 °C the primers are removed.", why:"They become part of the new strands." },
              { t:"<i>Taq</i> adds to both ends of the primer.", why:"Only to the 3′ end." },
              { t:"Step 3 is correct.", why:M3 }],
            hints:["Which end does every DNA polymerase extend?", "Module 22: the 3′ end.", "So new strands grow 5′ → 3′."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the thermocycler: how fast the copies grew, or that exact-length copies take three cycles to appear?" },
      { id:"j2", q:"In your own words, why does PCR need a polymerase from a hot-spring bacterium?" },
      { id:"j3", q:"Explain to a friend how to write a reverse primer from a top-strand sequence, and why the direction matters." },
      { id:"j4", q:"Where would you draw the line on police use of DNA databases, and what fact from this module supports your view?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which step of a PCR cycle happens at about 55 °C?", options:[
          { t:"Annealing: primers pair with their matching sites", ok:true, why:"Cooling to about 55 °C lets the primers form hydrogen bonds with their sites." },
          { t:"Denaturation: the strands separate", why:"That needs about 95 °C." },
          { t:"Extension: <i>Taq</i> builds the new strands", why:"That’s at 72 °C." },
          { t:"Ligation: the fragments are joined", why:"Ligation isn’t a PCR step." }] },
        b:{ prompt:"What happens at about 95 °C in a PCR cycle?", options:[
          { t:"The hydrogen bonds between base pairs break, separating the strands", ok:true, why:"Denaturation: the backbones stay whole." },
          { t:"The DNA breaks into single nucleotides", why:M1 },
          { t:"Primers pair with the template", why:"That needs cooling to about 55 °C." },
          { t:"<i>Taq</i> adds nucleotides to the primers", why:"That’s at 72 °C." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Why is <i>Taq</i> polymerase used in PCR?", options:[
          { t:"It survives the repeated 95 °C steps, so it keeps working cycle after cycle", ok:true, why:"It comes from a hot-spring bacterium, so it’s heat-stable." },
          { t:"It can start new strands without primers", why:M2 },
          { t:"It works only at room temperature", why:"It works best at 72 °C." },
          { t:"Any polymerase would do; <i>Taq</i> is just cheaper", why:M7 }] },
        b:{ prompt:"Where does <i>Taq</i> polymerase come from, and why does that matter?", options:[
          { t:"A bacterium that lives in hot springs, so the enzyme stays intact at high temperatures", ok:true, why:"<i>Thermus aquaticus</i> lives in hot springs; its polymerase survives 95 °C." },
          { t:"Human cells, so it copies human DNA best", why:"Human polymerase is destroyed at 95 °C." },
          { t:"Baker’s yeast, so it works at warm temperatures", why:"Yeast’s polymerase isn’t heat-stable." },
          { t:"It’s built from free nucleotides in the tube", why:"Enzymes are proteins; nucleotides are its building blocks." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"What does a primer provide in PCR?", options:[
          { t:"A 3′ end that the polymerase can extend", ok:true, why:M2 },
          { t:"The energy for copying", why:"The energy comes from the nucleotides themselves." },
          { t:"The template strand", why:"The template is the original DNA." },
          { t:"The site where the DNA is cut", why:"PCR doesn’t cut DNA." }] },
        b:{ prompt:"To which end of a primer does <i>Taq</i> add nucleotides?", options:[
          { t:"The 3′ end", ok:true, why:"So each new strand grows 5′ → 3′." },
          { t:"The 5′ end", why:M3 },
          { t:"Both ends", why:"Only the 3′ end has the free –OH." },
          { t:"Whichever end is nearer the target", why:"The 3′ end always, which is why primers must point inward." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"A reaction starts with 4 copies. Assuming perfect doubling, how many copies after 6 cycles?", options:[
          { t:"256", ok:true, why:"4 × 2⁶ = 4 × 64." },
          { t:"24", why:"That’s 4 × 6. " + M6 },
          { t:"4096", why:"That’s 4⁶; the base is 2." },
          { t:"128", why:"That’s only 5 doublings." }] },
        b:{ prompt:"A reaction starts with 5 copies. Assuming perfect doubling, how many copies after 5 cycles?", options:[
          { t:"160", ok:true, why:"5 × 2⁵ = 5 × 32." },
          { t:"25", why:M6 },
          { t:"3125", why:"That’s 5⁵." },
          { t:"80", why:"That’s only 4 doublings." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"From one DNA molecule, how many molecules are exactly the target length after 4 cycles?", options:[
          { t:"8", ok:true, why:"2⁴ − 2(4) = 16 − 8." },
          { t:"16", why:M5 },
          { t:"14", why:"The first copies of the originals are long too, not just the originals." },
          { t:"0", why:"Exact-length molecules appear in cycle 3." }] },
        b:{ prompt:"From one DNA molecule, how many molecules are exactly the target length after 5 cycles?", options:[
          { t:"22", ok:true, why:"2⁵ − 2(5) = 32 − 10." },
          { t:"32", why:M5 },
          { t:"30", why:"The longer molecules number 2" + n + " = 10." },
          { t:"10", why:"That’s the number of longer molecules." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"A PCR run worked yesterday. Today exactly one thing is different. Which change would give <strong>no product at all</strong>?", options:[
          { t:"A human DNA polymerase replaced <i>Taq</i>", ok:true, why:"It’s destroyed by the first heating step." },
          { t:"Annealing at 52 °C instead of 55 °C", why:"Still in the primers’ working range." },
          { t:"25 cycles instead of 30", why:"Fewer copies, but still a product." },
          { t:"20 starting copies instead of 10", why:"That gives more product, not none." }] },
        b:{ prompt:"A PCR run worked yesterday. Today exactly one thing is different. Which change would give <strong>extra, unwanted bands</strong>?", options:[
          { t:"Annealing at 42 °C instead of 55 °C", ok:true, why:"Primers also pair at partly matching sites." },
          { t:"A human DNA polymerase replaced <i>Taq</i>", why:"That gives no product at all. " + M7 },
          { t:"25 cycles instead of 30", why:"Fewer copies of the same product." },
          { t:"Denaturation at 97 °C instead of 95 °C", why:"The strands still separate normally." }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"The target’s top strand ends " + sq("5′-…TGCAATCG-3′") + ". Which reverse primer is correct, with the best reason?", options:[
          { t:"“" + sq("5′-CGATTGCA-3′") + ": it is complementary to the top strand and antiparallel, so its 3′ end points into the target.”", ok:true, why:"Complement ACGTTAGC, read backwards: " + sq("5′-CGATTGCA-3′") + "." },
          { t:"“" + sq("5′-TGCAATCG-3′") + ": primers copy the end of the top strand exactly.”", why:"That pairs with the bottom strand. " + M4 },
          { t:"“" + sq("5′-ACGTTAGC-3′") + ": each base is the complement, in the same order.”", why:"That’s written 3′ → 5′. " + M4 },
          { t:"“" + sq("5′-GCTAACGT-3′") + ": primers are always written backwards.”", why:"Reversed, but not complemented." }] },
        b:{ prompt:"The target’s top strand ends " + sq("5′-…TAGCATTC-3′") + ". Which reverse primer is correct, with the best reason?", options:[
          { t:"“" + sq("5′-GAATGCTA-3′") + ": it is complementary to the top strand and antiparallel, so its 3′ end points into the target.”", ok:true, why:"Complement ATCGTAAG, read backwards: " + sq("5′-GAATGCTA-3′") + "." },
          { t:"“" + sq("5′-TAGCATTC-3′") + ": primers copy the end of the top strand exactly.”", why:"That pairs with the bottom strand. " + M4 },
          { t:"“" + sq("5′-ATCGTAAG-3′") + ": each base is the complement, in the same order.”", why:"That’s written 3′ → 5′. " + M4 },
          { t:"“" + sq("5′-CTTACGAT-3′") + ": primers are always written backwards.”", why:"Reversed, but not complemented." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which is the best description of one PCR cycle?", options:[
          { t:"“Heat to about 95 °C to separate the strands; cool to about 55 °C so primers pair; warm to 72 °C so <i>Taq</i> extends each primer’s 3′ end.”", ok:true, why:"Denaturation, annealing, extension, in that order." },
          { t:"“Cool so primers pair; heat to 95 °C so <i>Taq</i> copies; then 72 °C to separate the strands.”", why:"The order and the jobs are mixed up." },
          { t:"“Heat to 95 °C to break the DNA into nucleotides; cool so they rejoin as copies.”", why:M1 },
          { t:"“Heat to separate; cool so primers pair; warm so <i>Taq</i> adds to each primer’s 5′ end.”", why:M3 }] },
        b:{ prompt:"Which best describes the hydrogen bonds during one PCR cycle?", options:[
          { t:"“They break between the strands at 95 °C, form between primers and template at about 55 °C, and form as new bases pair during extension at 72 °C.”", ok:true, why:"Heat breaks them; cooling and extension let new ones form." },
          { t:"“They break at 95 °C and stay broken until the next cycle.”", why:"Primers and new bases pair by hydrogen bonds." },
          { t:"“Covalent bonds break at 95 °C; hydrogen bonds join new nucleotides into a strand.”", why:"The backbone bonds are covalent; base pairs are hydrogen-bonded." },
          { t:"“They form at 95 °C and break at 55 °C.”", why:"Heat breaks them; cooling lets them form." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A swab from a crime scene yields about 1000 copies of a DNA region. The lab needs about 1 000 000 copies to see a band. Assuming perfect doubling, what is the fewest number of cycles?", use:USE, options:[
          { t:"10", ok:true, why:"1000 × 2¹⁰ ≈ 1 000 000." },
          { t:"20", why:"That’s starting from one copy." },
          { t:"9", why:"1000 × 512 = 512 000: not enough." },
          { t:"1000", why:"That’s adding copies one at a time. " + M6 }] },
        b:{ prompt:"A hair root yields about 250 copies of a DNA region. The lab needs about 8000 copies to see a band. Assuming perfect doubling, what is the fewest number of cycles?", options:[
          { t:"5", ok:true, why:"250 × 2⁵ = 8000." },
          { t:"32", why:"That’s how many times bigger: 32 = 2⁵." },
          { t:"4", why:"250 × 16 = 4000: not enough." },
          { t:"6", why:"250 × 64 = 16 000: more than needed; 5 is the fewest." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"In a parentage test, short repeated regions are copied from cheek cells of a child, the mother and a possible father. Why is PCR needed before the regions are compared?", options:[
          { t:"A swab has too few copies to detect; PCR makes millions of copies of just those regions", ok:true, why:"PCR copies only the chosen regions, until there’s enough to detect." },
          { t:"PCR changes the regions so that relatives match", why:"PCR copies; it doesn’t change the sequence." },
          { t:"PCR cuts the DNA into fragments of different sizes", why:"That’s what restriction enzymes do (module 33)." },
          { t:"PCR copies the whole genome so everything can be compared", why:M8 }] },
        b:{ prompt:"A lab identifies remains using a few cells from a bone. Why is PCR the first step?", options:[
          { t:"The few cells hold too little DNA to analyse; PCR copies the chosen regions millions of times", ok:true, why:"PCR turns a trace of DNA into enough to study." },
          { t:"PCR repairs damaged DNA in old samples", why:"It copies what’s there; it doesn’t repair it." },
          { t:"PCR sorts DNA fragments by size", why:"That’s gel electrophoresis (module 32)." },
          { t:"PCR copies every gene in the bone cells", why:M8 }] } }
    ]
  },
  task:{
    title:"Design the run", summary:"Design the run",
    statement:"<p>A crime lab has 10 copies of a region from a tiny sample. Set up a PCR run for Sequence Q that meets every condition. Can you find all the answers?</p>" +
      '<p class="pcr-seqbox">' +
      sq("5′-TTA<mark>GCGACCTTGAGCATACGGTCAAGTCGATAGGCTCA</mark>TC-3′") + "<br>" + sq("3′-AAT<mark>CGCTGGAACTCGTATGCCAGTTCAGCTATCCGAGT</mark>AG-5′") +
      '</p><p class="tiny muted">Sequence Q is made up for this module. The target (shaded) is bases 4–38 of the top strand, 35 base pairs. Starting copies are fixed at 10.</p>' +
      '<ol class="pcr-conds"><li>The forward primer pairs at the left end and points into the target.</li><li>The reverse primer pairs at the right end and points into the target.</li><li>The polymerase survives 95 °C.</li><li>The primers pair only at their sites.</li><li>There are enough cycles for a visible band.</li><li>The run stays out of the plateau.</li></ol>',
    seqQ:"TTAGCGACCTTGAGCATACGGTCAAGTCGATAGGCTCATC", tgt:[4, 38],
    fwd:[{ id:"FA", t:"F-A", s:"GCGACCTT" }, { id:"FB", t:"F-B", s:"CGCTGGAA" }, { id:"FC", t:"F-C", s:"AAGGTCGC" }],
    rev:[{ id:"RA", t:"R-A", s:"TAGGCTCA" }, { id:"RB", t:"R-B", s:"TGAGCCTA" }, { id:"RC", t:"R-C", s:"ATCCGAGT" }],
    anns:[45, 50, 55, 60, 65], cycles:[10, 15, 20, 25, 30, 35, 40],
    checks:["Forward primer points in", "Reverse primer points in", "Polymerase survives 95 °C", "Primers pair only at their sites", "Enough cycles for a visible band", "Out of the plateau"],
    tips:["The forward primer has the same sequence as the top strand’s first target bases.",
      "The reverse primer is the reverse complement of the top strand’s last 8 target bases.",
      "Most polymerases are destroyed by the first heating.",
      "Too cool and the primers stick loosely; too hot and they can’t hold on.",
      "10 × 2¹⁵ is only about 330 000. Try more cycles.",
      "More isn’t always better: past 30 cycles the run plateaus."],
    explainPrompt:"Explain how you chose each primer and why your temperature and cycle count work.",
    vocab:"Use the words complementary, antiparallel, 3′ end, annealing and doubling.",
    success:"Your run meets every condition!",
    more:"Can you find all the answers?",
    afterAt:9,
    after3:"The primers and the polymerase have only one right answer each. The temperature and the cycle count each have a range that works, and that’s why labs can tune a run."
  },
  cards:[
    ["PCR", "Polymerase chain reaction: repeated cycles that copy one chosen region of DNA."],
    ["Denaturation (≈ 95 °C)", "Hydrogen bonds between base pairs break; the strands separate. The backbones stay whole."],
    ["Annealing (≈ 55 °C)", "Primers pair with their matching sites at the ends of the target."],
    ["Extension (72 °C)", "<i>Taq</i> adds nucleotides to each primer’s 3′ end; new strands grow 5′ → 3′."],
    ["<i>Taq</i> polymerase", "Heat-stable DNA polymerase from a hot-spring bacterium (<i>Thermus aquaticus</i>)."],
    ["Primer", "Short single strand that pairs at one end of the target and supplies a 3′ end."],
    ["Forward primer", "Same sequence as the top strand’s first target bases (5′ → 3′)."],
    ["Reverse primer", "Reverse complement of the top strand’s last target bases."],
    ["Copies after <i>n</i> cycles", "<i>N</i>₀ × 2ⁿ (ideal). 2¹⁰ ≈ 1000; 2²⁰ ≈ 1 000 000."],
    ["Exact-length copies", "First appear in cycle 3; 2ⁿ − 2<i>n</i> from one molecule."],
    ["No-DNA control", "A tube with no DNA added; a band there means contamination."],
    ["PCR’s inventor and a Canadian Nobel", "Kary Mullis (1983); he shared the 1993 Nobel Prize in Chemistry with Michael Smith of UBC."]
  ]
};
