// SBI4U 38 Male Reproductive Hormones. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/38-male-reproductive-hormones.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "High testosterone is the brake signal. GnRH and LH fall, so the testes make <strong>less</strong> of their own.";
const M2 = "LH → interstitial cells → testosterone. FSH → Sertoli cells → sperm support and inhibin.";
const M3 = "LH and FSH come from the <strong>anterior</strong> pituitary. The posterior pituitary releases ADH and oxytocin.";
const M4 = "Inhibin’s target is the anterior pituitary, and it damps <strong>FSH</strong> in particular.";
const M5 = "Low testosterone with <strong>high</strong> LH means the pituitary is shouting and the testes aren’t answering.";

const MATCH_L = ["GnRH", "LH", "FSH", "Testosterone", "Inhibin", "Anterior pituitary", "Seminiferous tubules", "Puberty"];
const MATCH_R = [
  "Made by the hypothalamus; stimulates the anterior pituitary",
  "Stimulates the interstitial cells to make testosterone",
  "Stimulates the Sertoli cells to support sperm production",
  "Made by the interstitial cells; brakes GnRH and LH",
  "Made by the Sertoli cells; brakes FSH",
  "Releases LH and FSH",
  "Where sperm are made, lined by Sertoli cells",
  "Begins when GnRH pulses increase"
];

export default {
  id:"38-male-reproductive-hormones",
  kind:"topic",
  title:"Male reproductive hormones",
  topic:"Male Reproductive Hormones",
  readyTopic:"male reproductive hormones",
  hero:{
    eq:'<span class="mr-heq"><span class="mr-c-g">GnRH</span> → <span class="mr-c-lh">LH</span>, <span class="mr-c-fsh">FSH</span> → <span class="mr-c-t">testosterone</span>, <span class="mr-c-i">inhibin</span> ⊣</span>',
    eqLabel:"GnRH leads to LH and FSH, which lead to testosterone and inhibin, which brake the chain",
    eqSize:"sm",
    headline:"The bottom of the chain controls the top",
    text:"Testosterone isn’t made on demand by the testes alone. The <strong>hypothalamus</strong> and <strong>anterior pituitary</strong> set the pace with <strong>GnRH</strong>, <strong>LH</strong> and <strong>FSH</strong>, and the testes report back. When testosterone and <strong>inhibin</strong> rise, the brain eases off: <strong>negative feedback</strong> keeps the whole chain steady.",
    fig:{ html:'<div class="mr-hero" id="mr-hero" role="img" aria-label="A vertical chain of boxes. GnRH dots drip from the hypothalamus to the anterior pituitary. The pituitary releases violet LH dots to the interstitial cells and teal FSH dots to the Sertoli cells in the testes. The interstitial cells glow and release orange testosterone dots. As testosterone rises, curved brake arrows back to the hypothalamus and pituitary light up, the GnRH drip slows, and the levels settle into a steady state."></div>' }
  },
  goals:[
    "I can trace the chain GnRH → LH and FSH → testosterone and inhibin, naming where each hormone is made and what it acts on.",
    "I can explain how negative feedback from testosterone and inhibin keeps the hormone levels steady.",
    "I can predict how the whole chain changes when one part fails or when an external hormone is added.",
    "I can explain why anabolic steroids reduce the body’s own testosterone and sperm production.",
    "I can evaluate evidence that hormone-like chemicals in the environment affect animals."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Feedback loops", goal:2,
          prompt:"In negative feedback, what does a rise in the controlled variable cause?",
          options:[
            { t:"A response that brings the variable back down", ok:true, why:"Negative feedback opposes the change." },
            { t:"A response that pushes the variable higher", why:"That’s positive feedback, as in childbirth." },
            { t:"No response until the variable doubles", why:"Receptors respond within the normal range." },
            { t:"A permanent new set point", why:"The set point stays; the response returns the variable to it." }],
          hints:["Negative means ‘opposite’.", "Opposite to the change that happened.", "A rise leads to a fall."] },
        { id:"w2", skill:"Feedback loops", goal:2,
          prompt:"Body temperature rises during exercise and sweating begins. In this loop, sweat glands are the…",
          options:[
            { t:"effector", ok:true, why:"They carry out the response." },
            { t:"receptor", why:"Receptors detect the change: here, temperature sensors." },
            { t:"control centre", why:"The hypothalamus is the control centre." },
            { t:"stimulus", why:"The stimulus is the rise in temperature." }],
          hints:["Which part does something to fix the change?", "Sweating cools the body.", "Effector."] },
        { id:"w3", skill:"Hypothalamus–pituitary axis", goal:1,
          prompt:"In module 37, TRH from the hypothalamus acted on the anterior pituitary, which released TSH. What did TSH act on?",
          options:[
            { t:"The thyroid gland", ok:true, why:"TSH stimulates the thyroid to release T₃ and T₄." },
            { t:"The hypothalamus", why:"The hypothalamus starts the chain." },
            { t:"The posterior pituitary", why:"TSH comes from the anterior pituitary and acts on the thyroid." },
            { t:"Every cell, directly raising metabolism", why:"That’s what T₃ and T₄ do." }],
          hints:["The ‘T’ in TSH stands for…", "Thyroid-stimulating hormone.", "The thyroid."] },
        { id:"w4", skill:"Hypothalamus–pituitary axis", goal:2,
          prompt:"When T₃ and T₄ are high, what happens to TSH?",
          options:[
            { t:"It falls, because T₃ and T₄ inhibit the hypothalamus and pituitary", ok:true, why:"Negative feedback from the end product." },
            { t:"It rises to push T₃ and T₄ higher", why:"That would make levels climb without limit." },
            { t:"It stays the same; feedback acts only on the thyroid", why:"The brake acts on the levels above." },
            { t:"It falls, because the thyroid stops absorbing TSH", why:"The pituitary releases less TSH; the thyroid doesn’t control it." }],
          hints:["Which way does negative feedback push?", "T₃ and T₄ act on the hypothalamus and pituitary.", "TSH falls."] },
        { id:"w5", skill:"Hormone basics", goal:1,
          prompt:"How does a hormone reach its target cells?",
          options:[
            { t:"It travels in the blood and acts only on cells with matching receptors", ok:true, why:"Receptors decide which cells respond." },
            { t:"It travels along nerves to its target", why:"Nerves use action potentials and synapses." },
            { t:"It is pumped directly into the target cells", why:"Hormones are released into the blood, not pumped into cells." },
            { t:"It acts on every cell in the body equally", why:"Only cells with receptors respond." }],
          hints:["Endocrine glands have no ducts.", "They release hormones into the blood.", "Receptors pick the targets."] },
        { id:"w6", skill:"Hormone basics", goal:3,
          prompt:"A gland is removed. What happens to the hormone it made?",
          options:[
            { t:"Its level falls, because nothing else makes it", ok:true, why:"No source, no hormone." },
            { t:"Its level rises, because feedback calls for more", why:"Feedback can call for more, but with no gland nothing answers." },
            { t:"Nothing changes; other glands take over at once", why:"Each hormone has its own source." },
            { t:"It turns into a different hormone", why:"Hormones don’t change identity." }],
          hints:["Where does the hormone come from?", "That source is gone.", "The level falls."] }
      ],
      refreshers:{
        "Feedback loops":"Stimulus → receptor → control centre → effector → response. Negative feedback reverses a change; positive feedback amplifies it.",
        "Hypothalamus–pituitary axis":"Hypothalamus → releasing hormone → anterior pituitary → stimulating hormone → gland → final hormone, which feeds back to damp the first two.",
        "Hormone basics":"Hormones travel in the blood and act on cells that carry the matching receptor."
      }
    }
  },
  explore:{
    heading:"Testosterone feedback loop",
    intro:"Change one part of the chain and watch every hormone respond. Look for the brake arrows: they explain most of what you’ll see.",
    modes:[["adult", "Adult"], ["puberty", "Puberty"], ["steroid", "External steroid"], ["faults", "Faults"], ["wire", "Wire it"]],
    modeHelp:{
      adult:"Adult: a healthy steady state. Switch inhibin off to see what it brakes.",
      puberty:"Puberty: set how strongly the hypothalamus pulses GnRH.",
      steroid:"External steroid: add an anabolic steroid (a synthetic androgen) at a chosen dose.",
      faults:"Faults: make one gland fail and read the blood test.",
      wire:"Wire it: set each arrow to + (stimulates), − (inhibits) or empty, then press Run 30 days."
    },
    doses:[["0", "None"], ["1", "Low"], ["2", "Moderate"], ["3", "High"]],
    faults:[["none", "None"], ["hyp", "Hypothalamus makes little GnRH"], ["pit", "Pituitary makes little LH and FSH"], ["tes", "Testes don’t respond to LH and FSH"]],
    inhibinLabel:"Sertoli cells make inhibin",
    pulseLabel:"GnRH pulse level",
    // Model values (plan table): GnRH, LH, FSH, testosterone from the testes, external steroid, total androgen, inhibin, sperm %, testis size %
    table:{
      adult:[50, 50, 50, 50, 0, 50, 50, 100, 100],
      adultOff:[50, 50, 80, 50, 0, 50, 0, 100, 100],
      st1:[30, 30, 30, 30, 40, 70, 30, 60, 85],
      st2:[15, 15, 15, 15, 80, 95, 15, 30, 70],
      st3:[5, 5, 5, 5, 120, 125, 5, 10, 60],
      hyp:[10, 10, 10, 10, 0, 10, 10, 10, 70],
      pit:[90, 10, 10, 10, 0, 10, 10, 10, 70],
      tes:[90, 90, 90, 10, 0, 10, 10, 10, 70]
    },
    feedback:{
      adult:"Testosterone and inhibin are in the normal band, so the brakes hold GnRH, LH and FSH steady.",
      adultOff:"No inhibin: nothing brakes FSH, so it climbs to 80. Testosterone still keeps GnRH and LH in check.",
      st1:"Extra androgen tightens the brakes: GnRH, LH and FSH fall, so the testes make less of their own.",
      st2:"High androgen is braking the hypothalamus and pituitary: GnRH, LH and FSH are low.",
      st3:"Very high androgen clamps the brakes on: GnRH, LH and FSH are almost shut off, and the testes shrink.",
      hyp:"The hypothalamus makes little GnRH, so the pituitary and the testes get almost no signal: everything is low.",
      pit:"Testosterone is low, so the brakes are off and GnRH is high, but the pituitary can’t answer: LH and FSH stay low.",
      tes:"Low testosterone and inhibin release the brakes: the pituitary pours out LH and FSH, but the testes can’t answer.",
      pub0:"No GnRH pulses yet: the chain below is quiet.",
      pub:"GnRH pulses at {p}%: each gland responds to the one above it, so every level follows GnRH.",
      wireIdle:"Set the six arrows, then press Run 30 days.",
      wireEdit:"You changed the wiring. Press Run 30 days to test it."
    },
    body:[[10, "none"], [20, "beginning"], [40, "developing"], [50, "adult"]],
    slots:[
      { id:"s1", from:"GnRH", to:"anterior pituitary", fwd:true },
      { id:"s2", from:"LH", to:"interstitial cells", fwd:true },
      { id:"s3", from:"FSH", to:"Sertoli cells", fwd:true },
      { id:"s4", from:"Testosterone", to:"hypothalamus" },
      { id:"s5", from:"Testosterone", to:"anterior pituitary" },
      { id:"s6", from:"Inhibin", to:"anterior pituitary" }
    ],
    wireMsg:{
      ok:"Testosterone stays in the normal band for all 30 days: three forward arrows stimulate, three return arrows brake.",
      fwdNeg:"A releasing hormone stimulates the next gland.",
      fwdEmpty:"An empty forward arrow breaks the chain: the next gland gets no signal, so the hormones below it fall.",
      posT:"Positive feedback: testosterone keeps climbing with no brake.",
      posI:"Positive feedback: inhibin pushes FSH higher and higher.",
      noT:"Nothing brakes testosterone: GnRH, LH and testosterone climb above the normal band.",
      oneT:"One brake isn’t enough here: testosterone drifts above the band. Testosterone brakes both the hypothalamus and the pituitary.",
      noI:"FSH drifts high. What brakes FSH?"
    },
    readout:["GnRH", "LH / FSH", "Testosterone from the testes", "Total androgen activity", "Inhibin", "Sperm production", "Testis size", "Body changes", "Feedback now"],
    modelNote:"Model values in arbitrary units (AU); the normal band is 40–60 AU for every hormone, and the same settings always give the same numbers. In reality, testosterone also brakes FSH somewhat, and inhibin isn’t the only brake on FSH. This simulator uses the textbook model.",
    aha:"The testes respond to the pituitary, and the pituitary responds to the testes; adding hormone from outside turns the body’s own production <strong>down</strong>.",
    predIntro:"Make a prediction first. Then the loop will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"adult", inh:true }, to:{ mode:"steroid", dose:3 },
        prompt:"<span class=\"muted\">Start: Adult. Change: External steroid → High.</span> What happens to LH?",
        reveal:"The violet LH dots thin out: LH drops from 50 to 5.",
        options:[{ t:"It falls", ok:true }, { t:"It rises" }, { t:"It stays the same" }, { t:"It rises, then the testes shrink" }],
        explain:"Total androgen jumps to 125, so the brakes on the hypothalamus and pituitary tighten." },
      { id:"p2", start:{ mode:"adult", inh:true }, to:{ mode:"adult", inh:false },
        prompt:"<span class=\"muted\">Start: Adult. Change: switch inhibin off.</span> Which hormone changes most?",
        reveal:"FSH climbs to 80; the others hold.",
        options:[{ t:"FSH", ok:true }, { t:"LH" }, { t:"Testosterone" }, { t:"GnRH" }],
        explain:"Inhibin brakes FSH at the anterior pituitary. Without it, FSH rises, while testosterone still keeps LH in check." },
      { id:"p3", start:{ mode:"puberty", pulse:0 }, to:{ mode:"puberty", pulse:100 }, ramp:true,
        prompt:"<span class=\"muted\">Start: Puberty at 0%. Change: the pulse level rises to 100% over 6 seconds.</span> In what order do the levels rise?",
        reveal:"The dots light up level by level down the chain.",
        options:[{ t:"GnRH, then LH and FSH, then testosterone", ok:true }, { t:"Testosterone first, then LH" }, { t:"All at the same moment" }, { t:"LH and FSH first, then GnRH" }],
        explain:"Each gland responds to the one above it." },
      { id:"p4", start:{ mode:"faults", fault:"none" }, to:{ mode:"faults", fault:"tes" },
        prompt:"<span class=\"muted\">Start: Faults → None. Change: Faults → “Testes don’t respond”.</span> What happens to LH?",
        reveal:"Testosterone falls to 10, the brakes go slack, and LH climbs to 90.",
        options:[{ t:"It rises well above normal", ok:true }, { t:"It falls" }, { t:"It stays normal" }, { t:"It drops to zero" }],
        explain:"Low testosterone releases the brake, so the pituitary pours out LH, but the testes can’t answer." }
    ],
    chalIntro:"Use the loop to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:4, prompt:"External steroid mode: choose the lowest dose that cuts sperm production to 30% of normal or less.",
        why:"Moderate is the lowest dose that does it: total androgen 95 brakes LH and FSH to 15, and sperm production falls to 30%.",
        wrong:{ mode:"Switch the mode to <strong>External steroid</strong> first.", none:"With no steroid, sperm production is 100%.", low:"Sperm production is still 60%.", high:"That works, but it isn’t the lowest dose." },
        hints:["Watch the sperm production row.", "Each step up cuts LH and FSH further.", "Moderate gives 30%."] },
      { id:"tc2", goal:2, prompt:"Wire it mode: wire the six arrows so the loop holds testosterone in the normal band for 30 days.",
        why:"GnRH, LH and FSH each stimulate (+) the next level; testosterone brakes (−) the hypothalamus and the pituitary, and inhibin brakes (−) the pituitary.",
        wrong:{ mode:"Switch the mode to <strong>Wire it</strong> first." },
        hints:["Forward arrows (down the chain) stimulate.", "Return arrows (from the testes up) inhibit.", "Three +, three −."] },
      { id:"tc3", goal:3, stretch:true, prompt:"Faults mode. A patient’s blood test shows LH 90, FSH 90 and testosterone 10. Set the fault that matches.",
        why:"The testes aren’t answering: low testosterone and inhibin take the brakes off, so LH and FSH climb to 90.",
        wrong:{ mode:"Switch the mode to <strong>Faults</strong> first.", pit:"That gives LH 10. The pituitary here is working overtime.", hyp:"Everything is low in that case.", none:"Testosterone would be 50." },
        hints:["Is the pituitary making too little or too much?", "LH is high, so the pituitary is working; testosterone is still low.", "The testes aren’t answering the signal."] }
    ]
  },
  part3:{
    slug:"environment", name:"Environment",
    heading:"Hormones in the environment",
    intro:"The body’s own loop isn’t the only place hormones act. Hormone-like chemicals from human activity reach rivers and lakes, and fish carry the same kind of receptors. Work through the three stations, then answer the quick check.",
    s1:{
      title:"Station 1: why fish respond", panel:"Zoom to the molecules",
      how:"Choose a molecule and send it to the estrogen receptor in a fish liver cell.",
      mols:[["nat", "Natural estrogen"], ["syn", "Synthetic estrogen (ethinylestradiol)"]],
      send:"Send it to the receptor", reset:"Reset",
      result:{ nat:"Natural estrogen fits the receptor. The bound receptor switches on the vitellogenin gene, and the cell makes vitellogenin.", syn:"Ethinylestradiol, the synthetic estrogen from birth control pills, fits the receptor just as well. The vitellogenin gene switches on." },
      text:"<strong>Vitellogenin</strong> is an egg-yolk protein that only females normally make.",
      panelText:"A male fish making vitellogenin is a sign it has been exposed to estrogen-like chemicals."
    },
    s2:{
      title:"Station 2: the whole-lake experiment", panel:"Check it with data",
      // VERIFY: Experimental Lakes Area dates and estrogen concentrations before release.
      setting:"The setting: the <strong>Experimental Lakes Area</strong>, in northwestern Ontario. Scientists added synthetic estrogen at a few nanograms per litre to one lake for three summers; a nearby <strong>reference lake</strong> received none.",
      how:"Move through the years to read both lakes.",
      years:[1, 2, 3, 4, 5, 6, 7],
      added:[false, false, true, true, true, false, false],
      treated:[100, 105, 95, 40, 5, 10, 60],
      reference:[100, 98, 102, 97, 101, 99, 103],
      notes:["Before the additions: both lakes are similar.", "Before the additions: both lakes are similar.", "Male minnows begin making vitellogenin.", "Few young fish survive to breed.", "Few young fish survive to breed: the index is near zero.", "The additions have stopped. The population starts to recover.", "The population has recovered much of the way."],
      head:["Year", "Estrogen added?", "Treated lake", "Reference lake"],
      model:"Model data based on the published pattern.",
      yLabel:"Fathead minnow population index"
    },
    s3:{
      title:"Station 3: from the pill to the lake",
      flow:["Medication", "Body", "Wastewater", "Treatment plant (partial removal)", "River or lake"],
      how:"Rank the three actions by how much estrogen-like chemical they keep out of the water: the one that removes the most goes first. Use the arrows to move a card, then press Check ranking.",
      cards:[
        { id:"adv", t:"Advanced wastewater treatment", why:"It removes much of the hormone that passes through people’s bodies, which is most of what reaches the water." },
        { id:"take", t:"Returning unused medicines to a pharmacy take-back program", why:"It keeps unused pills out of the water, but it can’t remove the hormone that people taking the medicine excrete." },
        { id:"flush", t:"Flushing unused pills", why:"This adds to the problem: flushed pills go straight into wastewater." }
      ],
      answer:["adv", "take", "flush"],
      wrong:"Not quite. Ask which action deals with the most hormone, and whether any action adds hormone instead of removing it.",
      // VERIFY: Canada's bisphenol A decisions (listed as toxic; banned in baby bottles, 2010) before release.
      stse:"Canada listed <strong>bisphenol A</strong>, a plastic chemical that can mimic estrogen, as toxic and banned it in baby bottles (2010)."
    },
    quickCheck:{
      title:"Quick check", summary:"Hormones in the environment quick check",
      items:[
        { id:"q1", goal:5, prompt:"Why did male minnows make vitellogenin?",
          choices:[
            { t:"Synthetic estrogen bound their estrogen receptors", ok:true, fb:"Right. The synthetic hormone fits the same receptor as natural estrogen." },
            { t:"The water got warmer", fb:"The synthetic hormone fits the same receptor as natural estrogen." },
            { t:"They were female", fb:"The synthetic hormone fits the same receptor as natural estrogen." },
            { t:"Testosterone rose", fb:"The synthetic hormone fits the same receptor as natural estrogen." }] },
        { id:"q2", goal:5, prompt:"Why does the reference lake matter?",
          choices:[
            { t:"It shows what happens without the estrogen, all else equal", ok:true, fb:"Right. It’s the control: same region and weather, no added estrogen." },
            { t:"It had more fish", fb:"It’s the control: same region and weather, no added estrogen." },
            { t:"It was cleaner to swim in", fb:"It’s the control: same region and weather, no added estrogen." },
            { t:"It proves estrogen is safe", fb:"It’s the control: same region and weather, no added estrogen." }] },
        { id:"q3", goal:5, prompt:"The population fell mainly because…",
          choices:[
            { t:"few young fish survived to breed", ok:true, fb:"Right. Reproduction failed; the adults weren’t killed outright." },
            { t:"adults were poisoned at once", fb:"Reproduction failed; the adults weren’t killed outright." },
            { t:"the lake dried up", fb:"Reproduction failed; the adults weren’t killed outright." },
            { t:"predators moved in", fb:"Reproduction failed; the adults weren’t killed outright." }] },
        { id:"q4", goal:5, prompt:"Which action adds estrogen-like chemicals to water?",
          choices:[
            { t:"Flushing unused pills", ok:true, fb:"Right. Flushed pills go straight into wastewater." },
            { t:"Pharmacy take-back", fb:"Flushed pills go straight into wastewater." },
            { t:"Advanced treatment", fb:"Flushed pills go straight into wastewater." },
            { t:"Fewer plastic bottles", fb:"Flushed pills go straight into wastewater." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Hormone ↔ source ↔ job", summary:"Hormone ↔ source ↔ job", goal:[1, 2],
        instruction:"Match each hormone, gland or stage with its source or job.",
        leftTitle:"Hormone or part", rightTitle:"Source or job",
        left:MATCH_L.map(function(t, i){
          const it = { id:"l" + (i + 1), t:t };
          if (i === 4) it.hints = ["Which cell type makes inhibin?", "The one that FSH stimulates.", "Sertoli cells; inhibin brakes FSH."];
          return it;
        }),
        right:MATCH_R.map(function(t, i){ return { id:"r" + (i + 1), t:t }; }),
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{ "l2|r3":"Swap them: LH → interstitial cells, FSH → Sertoli cells.", "l3|r2":"Swap them: LH → interstitial cells, FSH → Sertoli cells.",
          "l5|r4":"Inhibin’s main brake is on FSH.", "l6|r1":"The hypothalamus makes GnRH; the pituitary responds." },
        wrongDefault:"Follow the chain from the top: hypothalamus, pituitary, testes." },
      { id:"blood", type:"custom", title:"Predict the blood test", summary:"Predict the blood test", star:true, goal:[3, 4],
        instruction:"For each scenario, predict whether each hormone rises (↑), falls (↓) or doesn’t change. Scenarios 3 to 6 are non-routine; the last two go beyond the Final Check.",
        how:"Choose a chip in every row, then press Check. All four rows must be right.",
        rows:["GnRH", "LH", "FSH", "Testosterone (from the testes)"],
        chips:[["up", "↑", "rises"], ["dn", "↓", "falls"], ["same", "no change", "no change"]],
        general:"Follow the brakes: work out what each gland now receives, from the top of the chain down.",
        items:[
          { id:"s1", goal:4, prompt:"Months of high-dose anabolic steroids", answer:["dn", "dn", "dn", "dn"],
            why:"The steroid brakes the hypothalamus and pituitary, so GnRH, LH and FSH fall, and the testes’ own testosterone falls with them.",
            wrong:[{ row:3, pick:"up", fb:"The blood level of <strong>total</strong> androgen rises, but the testes’ own output falls." }] },
          { id:"s2", goal:3, prompt:"The Sertoli cells stop making inhibin", answer:["same", "same", "up", "same"],
            why:"Only FSH loses its brake; testosterone still holds GnRH and LH.",
            wrong:[{ row:1, pick:"up", fb:"Inhibin brakes FSH, not LH." }] },
          { id:"s3", goal:3, star:true, prompt:"Both testes are removed (for example, in cancer treatment)", answer:["up", "up", "up", "dn"],
            why:"No testosterone and no inhibin means no brakes: GnRH, LH and FSH climb, and testosterone from the testes falls.",
            wrong:[{ row:1, pick:"dn", fb:"No testosterone and no inhibin means no brakes: LH and FSH climb." }],
            hints:["What do the testes send back up the chain?", "Testosterone and inhibin both disappear.", "No brakes: GnRH, LH and FSH rise; testosterone falls."] },
          { id:"s4", goal:[3, 4], star:true, prompt:"A medicine blocks GnRH receptors on the pituitary", answer:["same|up", "dn", "dn", "dn"],
            why:"The pituitary can’t hear GnRH, so LH and FSH fall and testosterone follows. GnRH itself stays the same or rises as the brake eases.",
            wrong:[{ row:3, pick:"same", fb:"Without GnRH’s signal, LH falls, so the interstitial cells slow down." }] },
          { id:"s5", goal:3, star:true, prompt:"A medicine blocks androgen receptors in the hypothalamus and pituitary only", answer:["up", "up", "same|up", "up"],
            why:"The brain can’t sense testosterone, so it releases more GnRH and LH, and the testes make more testosterone.",
            wrong:[{ all:"dn", fb:"The brain can’t sense testosterone, so it acts as if testosterone were low." }],
            hints:["What does the brain ‘see’ if it can’t detect testosterone?", "Low testosterone means the brakes come off.", "GnRH and LH rise, so the testes make more testosterone."] },
          { id:"s6", goal:3, star:true, prompt:"Sertoli cells are damaged, but the interstitial cells are fine", answer:["same", "same", "up", "same"],
            why:"Less inhibin takes the brake off FSH; the LH–testosterone branch is untouched.",
            wrong:[{ row:3, pick:"dn", fb:"The interstitial cells and LH are unaffected; only the FSH–inhibin branch changes." }] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Xavier", goal:[1, 4, 5], how:"",
        instruction:"Xavier made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Explain why anabolic steroids can reduce sperm production.",
            steps:["Anabolic steroids raise androgen activity in the blood.", "The hypothalamus and pituitary detect the high level.", "Positive feedback makes them release more GnRH, LH and FSH.", "So the testes make more sperm."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"Negative feedback makes them release less GnRH, LH and FSH, so the testes get less stimulation and make fewer sperm.", ok:true, why:M1 },
              { t:"Positive feedback makes them release more GnRH only.", why:"No: high androgen brakes the chain." },
              { t:"The steroids go straight to the Sertoli cells and switch them off.", why:"The main effect comes through the falling LH and FSH." },
              { t:"Step 3 is correct.", why:"Then sperm production would rise, but it falls." }],
            hints:["Is this a brake or an accelerator?", "High androgen is the brake signal.", "Less GnRH, LH and FSH."] },
          { id:"e2", goal:1, task:"Describe the start of puberty as a flow chart.",
            steps:["The hypothalamus releases more GnRH, in pulses.", "GnRH travels to the posterior pituitary.", "The pituitary releases LH and FSH into the blood.", "LH makes the interstitial cells release testosterone."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 is right in itself, but the gland in step 2 is wrong.", "Step 4 is correct."],
            fixes:[
              { t:"GnRH travels to the anterior pituitary.", ok:true, why:M3 },
              { t:"GnRH travels directly to the testes.", why:"GnRH acts on the pituitary." },
              { t:"GnRH travels to the thyroid.", why:"That’s TRH’s chain." },
              { t:"Step 2 is correct.", why:"The posterior pituitary releases ADH and oxytocin." }],
            hints:["Which part of the pituitary makes LH and FSH?", "The front part.", "Anterior."] },
          { id:"e3", goal:5, task:"Interpret the lake data from Part 3.",
            steps:["In the treated lake, the minnow index fell from about 100 to 5.", "In the reference lake, the index stayed near 100.", "So the estrogen poisoned and killed the adult fish.", "After the additions stopped, the population recovered."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 is correct."],
            fixes:[
              { t:"Because only the treated lake changed, the estrogen is the likely cause; the population fell because few young fish survived to breed.", ok:true, why:"The reference lake rules out weather and region; the data show reproduction failing." },
              { t:"So the reference lake must have been polluted too.", why:"Its index stayed steady." },
              { t:"So the fish left the treated lake.", why:"There’s no evidence of fish moving." },
              { t:"Step 3 is correct.", why:"The data show reproduction failing, not adults dying at once." }],
            hints:["What does the reference lake show?", "Only the treated lake changed.", "The cause is likely the estrogen; the mechanism is reproductive failure."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most in the feedback loop: the steroid result, or the testes-fault blood test?" },
      { id:"j2", q:"In your own words, why does adding a hormone from outside the body turn the body’s own production down?" },
      { id:"j3", q:"Explain to a friend how a doctor could use LH and testosterone levels to tell a pituitary problem from a testis problem." },
      { id:"j4", q:"Which part of the chain do you still mix up? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which cells in the testes release testosterone?", options:[
          { t:"Interstitial cells, stimulated by LH", ok:true, why:M2 },
          { t:"Sertoli cells, stimulated by FSH", why:"Sertoli cells support sperm production and make inhibin." },
          { t:"Sperm cells in the seminiferous tubules", why:"Sperm don’t make hormones." },
          { t:"Cells of the anterior pituitary", why:"The pituitary makes LH, not testosterone." }] },
        b:{ prompt:"Which cells respond to FSH to support sperm production?", options:[
          { t:"Sertoli cells", ok:true, why:M2 },
          { t:"Interstitial cells", why:"They respond to LH." },
          { t:"Cells of the hypothalamus", why:"The hypothalamus makes GnRH." },
          { t:"Red blood cells", why:"They have no FSH receptors." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"Where is GnRH made?", options:[
          { t:"The hypothalamus", ok:true, why:"GnRH is the hypothalamus’s releasing hormone." },
          { t:"The anterior pituitary", why:"The pituitary responds to GnRH." },
          { t:"The posterior pituitary", why:M3 },
          { t:"The testes", why:"The testes make testosterone and inhibin." }] },
        b:{ prompt:"Which gland releases LH and FSH?", options:[
          { t:"The anterior pituitary", ok:true, why:"GnRH stimulates it to release both." },
          { t:"The posterior pituitary", why:"It releases ADH and oxytocin." },
          { t:"The hypothalamus", why:"It releases GnRH." },
          { t:"The adrenal gland", why:"Not part of this chain." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"What does inhibin do?", options:[
          { t:"It reduces FSH release from the anterior pituitary", ok:true, why:M4 },
          { t:"It stimulates testosterone release", why:"That’s LH’s job." },
          { t:"It reduces LH release only", why:M4 },
          { t:"It stimulates GnRH release", why:"Inhibin is a brake, not an accelerator." }] },
        b:{ prompt:"Which hormone is the main negative-feedback signal that reduces LH?", options:[
          { t:"Testosterone", ok:true, why:"Testosterone brakes GnRH and LH." },
          { t:"Inhibin", why:"Inhibin mainly reduces FSH." },
          { t:"FSH", why:"FSH is a pituitary hormone, not the feedback signal." },
          { t:"GnRH", why:"GnRH stimulates LH." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"An athlete takes high doses of an anabolic steroid for several months. Which set of changes is expected?", options:[
          { t:"LH falls, the testes’ own testosterone falls, and sperm production falls", ok:true, why:M1 },
          { t:"LH rises, testosterone from the testes rises, and sperm production rises", why:M1 },
          { t:"LH falls but the testes’ own testosterone rises", why:"With less LH, the interstitial cells slow down." },
          { t:"No change, because the steroid isn’t the body’s own testosterone", why:"The hypothalamus and pituitary respond to androgen activity from any source." }] },
        b:{ prompt:"A patient receives regular testosterone injections. Which set of changes is expected?", options:[
          { t:"GnRH and FSH fall, and sperm production falls", ok:true, why:M1 },
          { t:"GnRH and FSH rise, and sperm production rises", why:M1 },
          { t:"Only testosterone changes; the pituitary is unaffected", why:"The extra testosterone brakes the pituitary." },
          { t:"FSH rises because inhibin falls", why:"The steroid’s brake on GnRH outweighs that; FSH falls overall." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"A blood test shows high LH, high FSH and low testosterone. Where is the problem most likely?", options:[
          { t:"The testes: they aren’t responding to LH and FSH", ok:true, why:M5 },
          { t:"The pituitary isn’t making enough LH", why:"LH is high, so the pituitary is working." },
          { t:"The hypothalamus is making too much GnRH", why:"Then testosterone would be high too." },
          { t:"Anabolic steroid use", why:"Steroids lower LH and FSH." }] },
        b:{ prompt:"A person who takes no medicines or supplements has low LH, low FSH and low testosterone, and GnRH is high. Where is the problem most likely?", options:[
          { t:"The anterior pituitary: it isn’t responding to GnRH", ok:true, why:"GnRH is high but LH and FSH are low, so the pituitary isn’t answering." },
          { t:"The testes aren’t responding to LH", why:"Then LH would be high." },
          { t:"The hypothalamus isn’t making GnRH", why:"GnRH is high." },
          { t:"Too much inhibin", why:"Inhibin wouldn’t lower LH." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"A medicine blocks androgen receptors in the hypothalamus and pituitary only. What happens to LH and testosterone from the testes?", options:[
          { t:"Both rise, because the brain senses too little testosterone", ok:true, why:"The brake can’t be felt, so the chain speeds up." },
          { t:"Both fall, because the drug is a brake", why:"It blocks the brake’s receptor." },
          { t:"LH rises but testosterone falls", why:"More LH stimulates the interstitial cells." },
          { t:"Neither changes; the testes have their own receptors", why:"The receptors that matter for feedback are blocked." }] },
        b:{ prompt:"Chemotherapy damages the Sertoli cells but not the interstitial cells. What happens to FSH and testosterone?", options:[
          { t:"FSH rises; testosterone stays about the same", ok:true, why:"Less inhibin takes the brake off FSH; the LH branch is unaffected." },
          { t:"Both fall", why:"The interstitial cells are fine." },
          { t:"FSH falls; testosterone rises", why:"Less inhibin means <strong>more</strong> FSH." },
          { t:"Both rise", why:"LH and testosterone aren’t braked by inhibin." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why long-term steroid use can shrink the testes?", options:[
          { t:"“High androgen levels brake the hypothalamus and pituitary. LH and FSH fall, so the testes get little stimulation and their tissue shrinks.”", ok:true, why:M1 },
          { t:"“Steroids are toxic to every organ, including the testes.”", why:"General toxicity isn’t the main mechanism here." },
          { t:"“The testes shrink because they make too much testosterone.”", why:M1 },
          { t:"“Steroids replace the testes, so the body removes them.”", why:"The body doesn’t remove organs." }] },
        b:{ prompt:"Which is the best explanation of why this hormone chain is called negative feedback?", options:[
          { t:"“A rise in testosterone or inhibin causes a fall in the signals above it, which brings the levels back toward normal.”", ok:true, why:"The response opposes the change." },
          { t:"“Because it makes the hormone levels negative.”", why:"The levels stay positive; the response opposes the change." },
          { t:"“Because testosterone has a negative effect on the body.”", why:"Negative describes the direction of the response." },
          { t:"“Because each gland stimulates the next one.”", why:"That’s the forward chain; feedback runs back up." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which flow chart is correct?", options:[
          { t:"Hypothalamus (GnRH) → anterior pituitary (LH) → interstitial cells (testosterone) ⊣ hypothalamus and pituitary", ok:true, why:"GnRH first, then LH, then testosterone, which brakes the two levels above." },
          { t:"Hypothalamus (LH) → anterior pituitary (GnRH) → testes (testosterone)", why:"GnRH comes first, from the hypothalamus." },
          { t:"Anterior pituitary (GnRH) → hypothalamus (LH) → testes", why:"The order is reversed." },
          { t:"Hypothalamus (GnRH) → posterior pituitary (LH) → Sertoli cells (testosterone)", why:M3 + " LH → interstitial cells → testosterone." }] },
        b:{ prompt:"Which flow chart is correct?", options:[
          { t:"Hypothalamus (GnRH) → anterior pituitary (FSH) → Sertoli cells (inhibin) ⊣ anterior pituitary", ok:true, why:"FSH acts on the Sertoli cells, whose inhibin brakes the pituitary." },
          { t:"Hypothalamus (GnRH) → anterior pituitary (FSH) → interstitial cells (inhibin)", why:M2 },
          { t:"Hypothalamus (FSH) → anterior pituitary (GnRH) → Sertoli cells", why:"GnRH comes first." },
          { t:"Anterior pituitary (inhibin) → Sertoli cells (FSH)", why:"Inhibin comes from the Sertoli cells." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"Some prostate cancers grow faster with testosterone. One treatment is a medicine that blocks GnRH receptors on the pituitary. Why does it lower testosterone?", options:[
          { t:"The pituitary releases less LH, so the interstitial cells make less testosterone", ok:true, why:"Without GnRH’s signal, LH falls." },
          { t:"It destroys the interstitial cells directly", why:"It acts on the pituitary." },
          { t:"It raises inhibin, which blocks testosterone", why:"Inhibin brakes FSH, not testosterone." },
          { t:"It doesn’t; it only lowers FSH", why:"Both LH and FSH depend on GnRH." }] },
        b:{ prompt:"Researchers have tested testosterone injections as a possible male contraceptive. Why could this lower sperm counts?", options:[
          { t:"Negative feedback lowers LH and FSH, so the testes get less signal to support sperm production", ok:true, why:M1 },
          { t:"Extra testosterone directly kills sperm cells", why:"The effect works through the pituitary." },
          { t:"It raises FSH, which stops sperm production", why:"FSH supports sperm production, and here it falls." },
          { t:"It wouldn’t: more testosterone always means more sperm", why:M1 }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"Male fish living downstream of a wastewater plant have vitellogenin in their blood; males upstream don’t. Which explanation fits best?", options:[
          { t:"Estrogen-like chemicals in the wastewater bind the males’ estrogen receptors", ok:true, why:"Hormone-like chemicals pass through wastewater into rivers and lakes, where fish respond to them too." },
          { t:"Downstream water is warmer, which makes all fish produce egg proteins", why:"Temperature doesn’t explain a female-specific protein in males." },
          { t:"Upstream fish are younger", why:"Age isn’t the variable that differs." },
          { t:"The downstream fish are actually females", why:"They were identified as males." }] },
        b:{ prompt:"Researchers want to test whether a plant’s wastewater causes vitellogenin in male fish. Which design is best?", options:[
          { t:"Keep groups of male fish in tanks of clean water and of diluted wastewater, with several tanks per group, and measure vitellogenin after a few weeks", ok:true, why:"It has a control, replication and the right measure." },
          { t:"Catch any fish downstream and measure vitellogenin", why:"There’s no comparison group." },
          { t:"Put one male fish in wastewater and one in clean water", why:"One fish per group can’t separate the effect from chance." },
          { t:"Measure the wastewater’s temperature", why:"That doesn’t test the fish’s response." }] } }
    ]
  },
  task:{
    title:"Is the effluent the cause?", summary:"Is the effluent the cause?",
    statement:"<p><span class=\"tag\">Investigation</span> Design an experiment to test whether a treatment plant’s wastewater (effluent) makes male fathead minnows produce vitellogenin. Meet every condition. Can you find more than one good design?</p><ol class=\"mr-tlist\"><li>There is a clean-water control group.</li><li>There are at least two different effluent strengths, so you can see whether more effluent means a bigger effect.</li><li>Each group has at least 3 tanks.</li><li>Only male fish are used.</li><li>The measured variable is vitellogenin in the fish’s blood.</li><li>The exposure lasts long enough for the fish to make the protein (3 weeks).</li></ol>",
    groups:[["clean", "Clean water"], ["e25", "25% effluent"], ["e50", "50% effluent"], ["e100", "100% effluent"], ["adv", "Effluent after advanced treatment"]],
    tanks:[1, 2, 3, 4],
    fish:[["male", "Males only"], ["mixed", "Mixed sexes"]],
    measures:[["vtg", "Vitellogenin in blood"], ["len", "Body length"], ["temp", "Water temperature"]],
    durations:[["day", "1 day"], ["wk3", "3 weeks"]],
    checks:["Control group", "Two or more effluent strengths", "Replication", "Males only", "Measures vitellogenin", "Long enough"],
    tips:[
      "Without clean water, what would you compare against?",
      "One strength shows an effect; two or more show whether it grows with dose.",
      "One or two tanks can’t separate the effect from chance differences between tanks.",
      "Females make vitellogenin normally, so they would hide the effect.",
      "Body length won’t change in 3 weeks; vitellogenin is the sign of estrogen exposure.",
      "A day is too short for the liver to make the protein."
    ],
    more:"There’s more than one good design. Can you find another?",
    after3:"Adding the ‘advanced treatment’ group asks a second question: does better treatment remove the effect?",
    explainPrompt:"Explain why your design can show that the effluent, and not something else, causes vitellogenin in male fish.",
    vocab:"Use the words control, independent variable, dependent variable and replication."
  },
  cards:[
    ["GnRH", "Gonadotropin-releasing hormone, made by the hypothalamus; stimulates the anterior pituitary to release LH and FSH."],
    ["LH (male)", "Luteinizing hormone: stimulates the interstitial cells to make testosterone."],
    ["FSH (male)", "Follicle-stimulating hormone: stimulates the Sertoli cells to support sperm production."],
    ["Interstitial cells", "Cells between the seminiferous tubules that make testosterone."],
    ["Sertoli cells", "Cells lining the seminiferous tubules that nourish developing sperm and make inhibin."],
    ["Inhibin", "Made by the Sertoli cells; brakes FSH release by the anterior pituitary."],
    ["Testosterone’s feedback", "High testosterone brakes GnRH and LH (negative feedback)."],
    ["Puberty", "GnRH pulses increase → LH and FSH rise → testosterone rises → body changes and sperm production."],
    ["Anabolic steroids", "Synthetic androgens. They brake GnRH, LH and FSH, so the testes’ own testosterone and sperm production fall."],
    ["High LH + low testosterone", "The testes aren’t responding; the pituitary is working hard."],
    ["Endocrine disruptor", "A chemical that mimics or blocks a hormone, e.g. synthetic estrogen in water."],
    ["Vitellogenin in male fish", "A sign of exposure to estrogen-like chemicals."]
  ]
};
