// SBI4U 39 Female Reproductive Hormones. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/39-female-reproductive-hormones.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "High, sustained estrogen flips to <strong>positive</strong> feedback on the pituitary: that’s the LH surge.";
const M2 = "The <strong>LH</strong> surge triggers ovulation; estrogen is what sets it off.";
const M3 = "Ovary: follicular, ovulation, luteal. Uterus: menstrual, proliferative, secretory.";
const M4 = "Menstruation follows a <strong>fall</strong> in progesterone when the corpus luteum breaks down.";
const M5 = "Home pregnancy tests detect <strong>hCG</strong>; ovulation predictor kits detect LH.";
const M6 = "FSH is high because low estrogen releases the brake: the pituitary is calling and the ovaries can’t answer.";
const M7 = "In the model, the luteal phase lasts 14 days, so ovulation ≈ cycle length − 14.";

const H = (c, t) => '<span class="fr-c fr-c-' + c + '">' + t + "</span>";

export default {
  id:"39-female-reproductive-hormones",
  kind:"topic",
  title:"Female reproductive hormones",
  topic:"Female Reproductive Hormones",
  readyTopic:"the hormones of the cycle",
  hero:{
    eq:"hypothalamus (GnRH) → pituitary (" + H("fsh", "FSH") + ", " + H("lh", "LH") + ") → ovary (" + H("est", "estrogen") + ", " + H("prog", "progesterone") + ")",
    eqLabel:"hypothalamus, GnRH, to pituitary, FSH and LH, to ovary, estrogen and progesterone",
    eqSize:"sm",
    headline:"One loop, two kinds of feedback",
    text:"Across about four weeks, <strong>FSH</strong> and <strong>LH</strong> from the pituitary grow a follicle, the follicle’s <strong>estrogen</strong> builds the uterine lining, and a sudden <strong>LH surge</strong> releases an egg. The <strong>corpus luteum</strong> left behind makes <strong>progesterone</strong>. Whether that progesterone keeps flowing decides what happens next.",
    muted:"Work through the six parts in order. Your answers save on this device as you go, so you can stop and come back later. This module uses a 28-day model cycle. Real cycles vary from person to person and month to month.",
    fig:{ html:'<div class="fr-hero" id="fr-hero" role="img" aria-label="A 28-day model cycle. Four hormone curves sit above two strips: the ovary and the uterine lining. A day marker sweeps from day 1 to day 28. Days 1 to 5: the lining is shed and FSH rises. Days 6 to 12: a follicle grows, estrogen climbs and the lining thickens. Day 13: LH surges. Day 14: the egg is released. Days 15 to 24: the corpus luteum makes progesterone and the lining thickens further. Days 25 to 28: the corpus luteum fades, progesterone drops and the lining starts to shed."></div>' }
  },
  goals:[
    "I can name where FSH, LH, estrogen, progesterone and hCG are made and what each does in the cycle.",
    "I can line up the ovarian and uterine phases and explain what drives each change.",
    "I can explain when estrogen’s feedback is negative and when it is positive, and how the LH surge causes ovulation.",
    "I can explain how the corpus luteum, progesterone and hCG decide between menstruation and pregnancy.",
    "I can explain how hormonal contraception, fertility treatment and menopause follow from the feedback loops.",
    "I can use hormone and temperature data to identify cycle events and timing."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"GnRH chain", goal:1,
          prompt:"In module 38, GnRH from the hypothalamus made the anterior pituitary release which two hormones?",
          options:[
            { t:"LH and FSH", ok:true, why:"The same two hormones act on the ovaries." },
            { t:"Testosterone and inhibin", why:"Those come from the testes." },
            { t:"ADH and oxytocin", why:"Those are released by the posterior pituitary." },
            { t:"TSH and TRH", why:"That’s the thyroid chain." }],
          hints:["Both names end in H for ‘hormone’.", "Luteinizing and follicle-stimulating.", "LH and FSH."] },
        { id:"w2", skill:"GnRH chain", goal:1,
          prompt:"If a gland at the end of a chain stops making its hormone, what usually happens to the pituitary hormones above it?",
          options:[
            { t:"They rise, because the negative feedback brake is gone", ok:true, why:"Low end-hormone means no brake." },
            { t:"They fall, because the chain is broken", why:"The pituitary still works; it just isn’t braked." },
            { t:"They stay the same", why:"Feedback responds to the change." },
            { t:"They turn into the missing hormone", why:"Hormones don’t convert into each other like that." }],
          hints:["What does the end hormone normally do to the pituitary?", "It brakes it.", "Brake removed: the levels rise."] },
        { id:"w3", skill:"Positive and negative feedback", goal:3,
          prompt:"During childbirth, contractions cause more oxytocin, which causes stronger contractions. This is…",
          options:[
            { t:"positive feedback", ok:true, why:"The response amplifies the change." },
            { t:"negative feedback", why:"Negative feedback would reduce the contractions." },
            { t:"a set point", why:"A set point is a target value, not a type of loop." },
            { t:"homeostasis", why:"Positive feedback moves the body away from its normal state, toward an endpoint." }],
          hints:["Does the response grow or shrink the change?", "Contractions get stronger.", "Positive."] },
        { id:"w4", skill:"Positive and negative feedback", goal:3,
          prompt:"Which statement about positive feedback is true?",
          options:[
            { t:"It drives a quick, large change that ends with an event", ok:true, why:"Like birth, or the LH surge you’ll meet today." },
            { t:"It keeps a variable steady near a set point", why:"That’s negative feedback." },
            { t:"It never happens in healthy bodies", why:"Birth and clotting are healthy examples." },
            { t:"It always lasts for months", why:"Positive loops are short bursts." }],
          hints:["Think of a snowball rolling downhill.", "It builds quickly to a finish.", "A quick, large change ending in an event."] },
        { id:"w5", skill:"Reading multi-line graphs", goal:6,
          prompt:"On a graph with four hormone curves sharing one time axis, how do you find each hormone’s level on day 10?",
          options:[
            { t:"Draw a vertical line at day 10 and read where it crosses each curve", ok:true, why:"One day, four readings." },
            { t:"Read the highest curve only", why:"Every curve has its own value on that day." },
            { t:"Find where each curve peaks", why:"The peak may not be on day 10." },
            { t:"Add all four values together", why:"The hormones are separate; adding them has no meaning." }],
          hints:["Same day for every curve.", "A vertical line.", "Read each crossing."] },
        { id:"w6", skill:"Reading multi-line graphs", goal:6,
          prompt:"A curve rises steeply to a sharp peak on one day and falls the next. Which word fits?",
          options:[
            { t:"A surge", ok:true, why:"A sudden, brief, large rise." },
            { t:"A plateau", why:"A plateau is flat." },
            { t:"A decline", why:"A decline goes down." },
            { t:"A baseline", why:"The baseline is the low resting level." }],
          hints:["Sudden and brief.", "It shoots up, then down.", "Surge."] }
      ],
      refreshers:{
        "GnRH chain":"Hypothalamus (GnRH) → anterior pituitary (FSH, LH) → gonad (ovary or testis) → end hormones, which feed back to the top.",
        "Positive and negative feedback":"Negative feedback opposes a change and keeps things steady; positive feedback amplifies a change until an event ends it.",
        "Reading multi-line graphs":"Pick the time, draw a vertical line, read each curve. Look for surges (sharp peaks) and crossovers (one hormone taking over from another)."
      }
    }
  },
  explore:{
    heading:"28-day cycle timeline",
    intro:"Scrub through the model cycle. Watch what each hormone does, then change the feedback and see what breaks.",
    modes:[["normal", "Normal cycle"], ["preg", "Pregnancy"], ["switch", "Feedback switches"], ["pill", "Pill"]],
    modeHelp:{
      normal:"Normal cycle: the 28-day model cycle. Drag the day slider or press Play.",
      preg:"Pregnancy: fertilization on day 15 and implantation on day 21. The scrubber runs to day 40.",
      switch:"Feedback switches: turn estrogen’s positive feedback off, remove the corpus luteum, or give an LH pulse.",
      pill:"Pill: synthetic estrogen and progestin taken days 1–21, then placebo days 22–28."
    },
    // model values (plan §4): arbitrary units (AU), endometrium in mm, linear between the listed days
    model:{
      days:[1, 3, 5, 7, 10, 12, 13, 14, 15, 17, 21, 24, 26, 28],
      fsh:[30, 38, 40, 35, 25, 22, 45, 40, 20, 15, 12, 15, 22, 30],
      lh:[15, 15, 15, 15, 18, 30, 95, 80, 25, 15, 12, 12, 13, 15],
      est:[10, 12, 15, 30, 55, 80, 70, 40, 30, 40, 55, 45, 25, 12],
      prog:[2, 2, 2, 2, 2, 3, 4, 6, 15, 40, 70, 55, 25, 5],
      endo:[4, 3, 2, 5, 8, 9, 10, 10, 10, 11, 13, 12, 9, 5],
      hcg:[[21, 2], [24, 10], [26, 25], [28, 60], [35, 200], [40, 300]],
      testAt:25
    },
    hormones:[["fsh", "FSH"], ["lh", "LH"], ["est", "Estrogen"], ["prog", "Progesterone"], ["hcg", "hCG"]],
    status:{
      dev:"Several follicles developing", dom:"One dominant follicle", mat:"Mature follicle", matS:"Mature follicle: LH surge",
      ovu:"Ovulation", cl:"Corpus luteum", clh:"Corpus luteum, kept going by hCG", brk:"Corpus luteum breaking down",
      wait:"Mature follicle, waiting for a surge", deg:"Follicle degenerating: no ovulation", rem:"Corpus luteum removed",
      small:"Follicles stay small: FSH is too low", next:"Several follicles developing (next cycle)"
    },
    feedback:{
      neg:"Estrogen and progesterone are low or moderate: <strong>negative</strong> feedback keeps FSH and LH modest.",
      flip:"Estrogen is at its peak and has stayed high: the feedback is flipping to <strong>positive</strong>, and LH starts to climb.",
      pos:"Estrogen has been high for two days: <strong>positive</strong> feedback on the pituitary, so LH surges.",
      ovu:"The LH surge peaked yesterday: the egg is released, and the empty follicle becomes the corpus luteum.",
      ovuP:"The LH pulse yesterday did the surge’s job: the egg is released, and the empty follicle becomes the corpus luteum.",
      pulseOk:" The follicle is mature, so ovulation follows tomorrow.",
      pulseEarly:" The follicle isn’t mature yet (before day 12), so nothing happens.",
      pulseLate:" The follicle has started to degenerate (after day 15), so nothing happens.",
      lut:"Progesterone and estrogen from the corpus luteum: <strong>negative</strong> feedback keeps FSH and LH low.",
      brk:"The corpus luteum is breaking down: progesterone and estrogen fall, the brake eases, and FSH starts to rise for the next cycle.",
      off:"Estrogen’s positive feedback is switched off: estrogen only brakes the pituitary (<strong>negative</strong>), so there’s no natural LH surge.",
      pulse:"An LH pulse is given today, like a fertility ‘trigger’ shot.",
      rem:"The corpus luteum is gone: progesterone falls, the brake comes off, and FSH starts to rise.",
      preg:"hCG from the implanted embryo keeps the corpus luteum making progesterone; progesterone and estrogen keep FSH and LH low (<strong>negative</strong> feedback).",
      pill:"Steady synthetic estrogen and progestin brake the pituitary (<strong>negative</strong> feedback): FSH stays low and there’s no LH surge.",
      pillE:"Synthetic estrogen keeps FSH below 15 (<strong>negative</strong> feedback), so no follicle matures and nothing sets off a surge.",
      pillFail:"The doses are too low: FSH is still 15 or more and there’s no progestin, so a follicle matures and the surge happens.",
      placebo:"Placebo week: the synthetic hormones are withdrawn, so the lining is shed (withdrawal bleed) and FSH starts to rise.",
      none:"No active doses: this is the natural cycle."
    },
    switches:{ title:"Feedback switches", pf:"Estrogen’s positive feedback", r:"Remove the corpus luteum", rDay:"on day <i>R</i>", d:"Give an LH pulse", dDay:"on day <i>D</i>" },
    pill:{ title:"Pill doses (days 1–21)", e:"Synthetic estrogen <i>E</i>", p:"Progestin <i>P</i>", note:"Model dose levels, not real medicine amounts." },
    modelNote:"<strong>Model values</strong> in arbitrary units (AU); the endometrium (uterine lining) in mm. Values are joined by straight lines between the listed days, and every rule is fixed, so the same settings always give the same curves. This is a 28-day model cycle: real cycles vary from person to person and month to month.",
    aha:"The same hormone (estrogen) can brake or trigger the pituitary depending on its level and timing, and the end of the cycle is caused by a hormone <strong>falling</strong>.",
    predIntro:"Make a prediction first. The days ahead stay hidden until the timeline plays.",
    predictions:[
      { id:"p1", start:{ mode:"normal", day:11 }, to:13,
        prompt:"<span class=\"muted\">Normal cycle, day 11.</span> Estrogen is high and still rising. What will LH do over the next two days?",
        options:[{ t:"Surge sharply", ok:true }, { t:"Fall, because estrogen brakes the pituitary" }, { t:"Stay flat" }, { t:"Fall to zero" }],
        reveal:"LH jumps from 30 to 95 on day 13.",
        explain:"High, sustained estrogen flips the pituitary’s response to positive feedback." },
      { id:"p2", start:{ mode:"switch", day:17 }, set:{ rOn:true, R:17 }, to:28,
        prompt:"<span class=\"muted\">Feedback switches, day 17.</span> The corpus luteum is removed on day 17. What happens next?",
        options:[{ t:"Progesterone falls and menstruation starts early, on day 21", ok:true }, { t:"Nothing until day 28" }, { t:"FSH falls" }, { t:"A second ovulation on day 18" }],
        reveal:"The progesterone curve (brown) drops; the lining sheds from day 21.",
        explain:"The lining depends on progesterone. Remove its source, and it’s shed about four days later." },
      { id:"p3", start:{ mode:"preg", day:21 }, to:28,
        prompt:"<span class=\"muted\">Pregnancy, day 21: implantation.</span> Play to day 28. What happens to progesterone?",
        options:[{ t:"It stays high", ok:true }, { t:"It falls as usual" }, { t:"It surges like LH" }, { t:"It falls to zero" }],
        reveal:"hCG rises, the corpus luteum stays, and progesterone holds at 70.",
        explain:"hCG from the implanted embryo keeps the corpus luteum working." },
      { id:"p4", start:{ mode:"pill", day:1, E:2, P:2 }, to:21,
        prompt:"<span class=\"muted\">Pill mode, <i>E</i> = 2, <i>P</i> = 2.</span> Play days 1–21. Does ovulation happen?",
        options:[{ t:"No", ok:true }, { t:"Yes, on day 14" }, { t:"Yes, twice" }, { t:"Only in the placebo week" }],
        reveal:"FSH stays at 10, LH stays flat, and no follicle matures.",
        explain:"Steady estrogen and progestin keep the brakes on: FSH is too low to grow a follicle, and there’s no surge." }
    ],
    chalIntro:"Use the timeline to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:3, prompt:"Normal cycle: scrub to the day when the LH surge peaks.",
        why:"Day 13: LH peaks at 95 AU, the day after estrogen’s peak.",
        wrong:{ mode:"Switch the mode to <strong>Normal cycle</strong> first.", d14:"That’s ovulation; LH is already falling (80).", d12:"That’s estrogen’s peak; the surge starts next." },
        hints:["Find the violet curve’s highest point.", "It comes just after estrogen’s peak.", "Day 13."] },
      { id:"tc2", goal:4, prompt:"Feedback switches: make menstruation start on day 21 instead of day 1 of the next cycle.",
        why:"Removing the corpus luteum on day 17 drops progesterone, and the lining is shed 4 days later, on day 21.",
        wrong:{ mode:"Switch the mode to <strong>Feedback switches</strong> first.", off:"Turn on <strong>Remove the corpus luteum</strong> and choose a day.", r21:"Menstruation starts 4 days after removal: that gives day 25.", late:"The corpus luteum is already breaking down.", nocl:"There’s no corpus luteum to remove on that day: it forms after ovulation." },
        hints:["What does the lining need to stay?", "Progesterone from the corpus luteum.", "Menstruation comes 4 days after removal: 21 − 4 = 17."] },
      { id:"tc3", goal:3, stretch:true, prompt:"Feedback switches: turn estrogen’s positive feedback off. Then use one LH pulse to make ovulation happen on day 14.",
        why:"A pulse on day 13 gives ovulation on day 14. This is how a fertility ‘trigger’ shot is timed.",
        wrong:{ mode:"Switch the mode to <strong>Feedback switches</strong> first.", pf:"The natural surge would do the job. Turn it off first.", off:"Turn on <strong>Give an LH pulse</strong> and choose a day.", d14:"Ovulation follows the pulse by a day: that gives day 15.", early:"The follicle isn’t mature until day 12: no ovulation.", late:"After day 15 the follicle has started to degenerate: no ovulation." },
        hints:["What does the natural surge do, and when?", "Ovulation comes one day after the LH peak, and the follicle must be mature (days 12–15).", "A pulse on day 13 gives ovulation on day 14. This is how a fertility ‘trigger’ shot is timed."] }
    ]
  },
  part3:{
    slug:"medicine", name:"Medicine",
    heading:"Hormones as medicine",
    intro:"<span class=\"tag\">STSE</span> Each treatment below is a deliberate change to the feedback loop you just explored. Check the pill against data, step through fertility treatment, then build an argument from evidence about menopause.",
    pill:{
      title:"Station 1: the pill", panel:"Check it with data",
      how:"Two model cycles of the pituitary hormones, FSH and LH: a natural cycle and a pill cycle (<i>E</i> = 2, <i>P</i> = 2). Tap the <strong>two</strong> places on the graphs where the two cycles differ most.",
      text:"In the pill cycle, FSH stays near 10, LH never surges, and the lining stays thin; in the placebo week the hormones fall and a withdrawal bleed occurs. Estrogen mainly keeps FSH low, so no follicle matures; progestin mainly prevents the LH surge and thickens cervical mucus.",
      zones:[
        { a:1, b:2, fb:"FSH is a little higher in the natural cycle here, but look for a bigger gap." },
        { a:3, b:7, ok:true, fb:"Natural FSH rises to about 40 AU to grow follicles; on the pill it stays at 10." },
        { a:8, b:11, fb:"The gap is smaller here: natural FSH is already falling." },
        { a:12, b:14, ok:true, fb:"The natural cycle’s LH surge (95 AU on day 13) is missing from the pill cycle." },
        { a:15, b:21, fb:"In the luteal phase the natural cycle’s FSH and LH are braked too, so the two cycles look alike." },
        { a:22, b:28, fb:"Placebo week: the pill cycle’s FSH starts to rise, so the cycles come closer." }
      ],
      done:"Both found: the pill removes the FSH rise that grows follicles and the LH surge that releases an egg."
    },
    ivf:{
      title:"Station 2: fertility treatment (IVF)",
      levelLabel:"FSH injection level",
      levels:[["none", "none (natural)", 1], ["low", "low", 4], ["medium", "medium", 8], ["high", "high", 12]],
      head:["FSH injection level", "Mature follicles (model)"],
      steps:[
        "FSH injections grow several follicles at once.",
        "A medicine that blocks GnRH’s action prevents an early, natural LH surge.",
        "An hCG ‘trigger’ injection (hCG acts on LH receptors) completes egg maturation and times the eggs’ release, so they can be collected about a day and a half later.",
        "After an embryo is placed in the uterus, progesterone keeps the lining ready."
      ],
      risk:"Too many follicles can over-stimulate the ovaries, which is why doses are adjusted."
    },
    cer:{
      title:"Station 3: menopause and hormone therapy", panel:"Claim–evidence–reasoning",
      intro:"Choose one claim, the evidence that supports it, and the reasoning that links them. Then press Check. There are two valid arguments to find.",
      head:["", "Age 30 (cycle average)", "Age 55"],
      rows:[["Estrogen", "40", "8"], ["FSH", "30", "90"], ["LH", "25", "60"]],
      claims:[
        { id:"c1", t:"FSH is high because the ovaries are overactive", fb:M6 },
        { id:"c2", t:"FSH is high because low estrogen no longer brakes the pituitary" },
        { id:"c3", t:"Hormone therapy is right for everyone", fb:"The evidence shows benefits and risks that differ from person to person, so no therapy is right for everyone." },
        { id:"c4", t:"Hormone therapy has benefits and risks that depend on the person" }
      ],
      evidence:[
        { id:"e1", t:"Estrogen: 40 AU at age 30, 8 AU at age 55" },
        { id:"e2", t:"FSH: 30 AU at age 30, 90 AU at age 55" },
        { id:"e3", t:"LH: 25 AU at age 30, 60 AU at age 55" },
        { id:"e4", t:"Estrogen therapy can reduce hot flashes and slow bone loss" },
        { id:"e5", t:"Some studies link certain therapies to higher risks of blood clots and some cancers, depending on type, dose, age and duration" }
      ],
      reasons:[
        { id:"r1", t:"Low estrogen no longer brakes the pituitary, so FSH and LH rise (the brake is removed)." },
        { id:"r2", t:"Decisions weigh each person’s individual benefits and risks." },
        { id:"r3", t:"High estrogen triggers an LH surge (positive feedback)." },
        { id:"r4", t:"The ovaries make FSH, so active ovaries raise it." }
      ],
      answer:{ a:{ claim:"c2", need:["e1", "e2"], allow:["e3"], reason:"r1" }, b:{ claim:"c4", need:["e4", "e5"], allow:[], reason:"r2" } },
      fbA:"Strong argument: estrogen fell from 40 to 8 AU while FSH rose from 30 to 90 AU, because low estrogen no longer brakes the pituitary.",
      fbB:"Strong argument: therapy can ease hot flashes and slow bone loss, but some therapies carry risks that depend on type, dose, age and duration, so the choice is individual.",
      evA:"For this claim, choose the estrogen and FSH values from the table (LH may be added), and no health studies.",
      evB:"For this claim, choose both health evidence chips: one about benefits, one about risks, and no table values.",
      reason:"That reasoning doesn’t link this evidence to this claim. Which statement explains why?",
      pick:"Choose one claim, at least one piece of evidence and one reasoning first.",
      more:"Now build the other valid argument.",
      done:"Both arguments built.",
      note:"Medical decisions are made with a health professional."
    },
    quickCheck:{
      title:"Quick check", summary:"Hormones as medicine quick check",
      items:[
        { id:"q1", goal:1, prompt:"Which hormone does a home pregnancy test detect?",
          choices:[
            { t:"hCG", ok:true, fb:"Right. hCG is made after implantation." },
            { t:"LH", fb:"Ovulation kits detect LH; pregnancy tests detect hCG." },
            { t:"progesterone", fb:"Ovulation kits detect LH; pregnancy tests detect hCG." },
            { t:"FSH", fb:"Ovulation kits detect LH; pregnancy tests detect hCG." }] },
        { id:"q2", goal:5, prompt:"Why does the combined pill prevent ovulation?",
          choices:[
            { t:"Steady hormones keep FSH low and block the LH surge", ok:true, fb:"Right. It works through negative feedback on the pituitary." },
            { t:"It destroys eggs", fb:"It works through negative feedback on the pituitary." },
            { t:"It raises LH", fb:"It works through negative feedback on the pituitary." },
            { t:"It removes the corpus luteum", fb:"It works through negative feedback on the pituitary." }] },
        { id:"q3", goal:5, prompt:"Why is hCG used as a fertility ‘trigger’?",
          choices:[
            { t:"It acts on LH receptors, like a surge", ok:true, fb:"Right. hCG mimics the LH surge to finish egg maturation." },
            { t:"It grows follicles like FSH", fb:"hCG mimics the LH surge to finish egg maturation." },
            { t:"It shrinks the lining", fb:"hCG mimics the LH surge to finish egg maturation." },
            { t:"It blocks estrogen", fb:"hCG mimics the LH surge to finish egg maturation." }] },
        { id:"q4", goal:5, prompt:"After menopause, FSH is high because…",
          choices:[
            { t:"low estrogen no longer brakes the pituitary", ok:true, fb:"Right. The brake is gone; the pituitary is calling." },
            { t:"the ovaries are overactive", fb:"The brake is gone; the pituitary is calling." },
            { t:"progesterone is high", fb:"The brake is gone; the pituitary is calling." },
            { t:"hCG is present", fb:"The brake is gone; the pituitary is calling." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Hormone or structure ↔ role", summary:"Hormone or structure ↔ role", goal:[1, 4],
        instruction:"Match each hormone or structure with its role in the cycle.",
        leftTitle:"Hormone or structure", rightTitle:"Role",
        left:[
          { id:"l1", t:"GnRH" },
          { id:"l2", t:"FSH" },
          { id:"l3", t:"LH surge" },
          { id:"l4", t:"Estrogen" },
          { id:"l5", t:"Progesterone" },
          { id:"l6", t:"Corpus luteum", hints:["What’s left in the ovary after the egg is released?", "Its name means ‘yellow body’.", "Corpus luteum."] },
          { id:"l7", t:"hCG" },
          { id:"l8", t:"Fall in progesterone" }
        ],
        right:[
          { id:"r1", t:"From the hypothalamus; drives FSH and LH release" },
          { id:"r2", t:"Grows follicles in the early follicular phase" },
          { id:"r3", t:"Triggers ovulation about a day later" },
          { id:"r4", t:"Made by the growing follicle; thickens the lining (proliferative phase)" },
          { id:"r5", t:"Made by the corpus luteum; keeps the lining ready (secretory phase)" },
          { id:"r6", t:"What the follicle becomes after ovulation" },
          { id:"r7", t:"Made after implantation; keeps the corpus luteum working" },
          { id:"r8", t:"Causes the lining to be shed" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{ "l2|r3":"The <strong>LH</strong> surge triggers ovulation.", "l4|r5":"Estrogen builds the lining; progesterone maintains it.",
          "l8|r3":"A fall in progesterone ends the cycle; it doesn’t start ovulation." },
        wrongDefault:"Place it on the timeline: early, middle or late in the cycle?" },
      { id:"read", type:"custom", title:"Read the cycle", summary:"Read the cycle", star:true, goal:[2, 3, 6],
        instruction:"Use the model cycle’s data to answer each item. Items 4 to 8 are non-routine; the last three go beyond the Final Check.",
        items:[
          { id:"r1", kind:"num", goal:6, prompt:"Snapshot: LH 95, estrogen 70, progesterone 4. Which day of the model cycle?", answer:13, display:"Day 13",
            why:"LH peaks at 95 on day 13, the surge.", wrong:[{ match:14, fb:"Ovulation day; LH has already dropped to 80." }], general:"Find the day when LH is 95 in Explore." },
          { id:"r2", kind:"chips", goal:2, prompt:"Snapshot: progesterone 70, estrogen 55, LH 12. Which ovarian phase?",
            chips:[
              { t:"Luteal", ok:true, fb:"Progesterone 70 comes from the corpus luteum, after ovulation." },
              { t:"Follicular", fb:"Progesterone only rises after ovulation." },
              { t:"Ovulation", fb:"On ovulation day LH is still high (80) and progesterone is low." }] },
          { id:"r3", kind:"chips", goal:2, prompt:"Snapshot: FSH 38, estrogen 12, endometrium being shed. Which uterine phase?",
            chips:[
              { t:"Menstrual", ok:true, fb:"Shedding of the lining is the menstrual phase (days 1–5)." },
              { t:"Secretory", fb:"Shedding is the menstrual phase. " + M3 },
              { t:"Proliferative", fb:"The proliferative phase builds the lining; here it’s being shed." }] },
          { id:"r4", kind:"num", goal:6, star:true, prompt:"A person’s cycles are regularly 32 days. Using the model (luteal phase 14 days), on which day is ovulation most likely?", answer:18, display:"Day 18",
            why:"32 − 14 = 18.", wrong:[{ match:14, fb:"The luteal phase is the steady part; the follicular phase changes length. " + M7 }], general:"Which phase stays 14 days long?",
            hints:["Which phase stays about 14 days long?", "The luteal phase, from ovulation to the end.", "32 − 14 = 18."] },
          { id:"r5", kind:"num", goal:6, star:true, prompt:"Cycles are regularly 26 days. On which day is ovulation most likely?", answer:12, display:"Day 12",
            why:"26 − 14 = 12.", wrong:[{ match:14, fb:M7 }], general:M7 },
          { id:"r6", kind:"chips", goal:6, star:true, prompt:"Implantation happened on day 21, but a test on day 22 is negative. Best explanation?",
            chips:[
              { t:"hCG is still below the test’s detection level", ok:true, fb:"hCG starts low and doubles every couple of days; in the model the test turns positive around day 26." },
              { t:"There is no pregnancy", fb:"hCG starts low and doubles every couple of days; in the model the test turns positive around day 26. " + M5 },
              { t:"The test detects progesterone", fb:M5 },
              { t:"hCG is made only after day 40", fb:"hCG starts low and doubles every couple of days; in the model the test turns positive around day 26." }] },
          { id:"r7", kind:"num", goal:[3, 6], star:true, prompt:"<span class=\"tag\">Investigation</span> A morning temperature chart is steady at 36.4 °C, then rises to about 36.7 °C on day 17 and stays up. Progesterone raises resting temperature. When did ovulation most likely happen?", answer:[15, 16], display:"Day 16 (day 15 is accepted too)",
            why:"The rise follows ovulation, once the corpus luteum makes progesterone: about the day before, day 16.",
            wrong:[{ match:17, fb:"The rise follows ovulation, once the corpus luteum makes progesterone." }, { match:14, fb:"That assumes a 28-day cycle; read this chart." }], general:"What makes the temperature rise, and when does it start?",
            hints:["What makes the temperature rise?", "Progesterone from the corpus luteum, after ovulation.", "The day before the rise: about day 16."] },
          { id:"r8", kind:"chips", goal:3, star:true, prompt:"An ovulation kit detects LH in urine. In the model cycle, on which day should it first turn positive, and why does that warn of ovulation?",
            chips:[
              { t:"Day 13: the LH surge comes about a day before ovulation", ok:true, fb:"The kit catches the surge, so ovulation is about a day away." },
              { t:"Day 14: ovulation day, when LH is highest", fb:"By ovulation day the surge has passed its peak." },
              { t:"Day 12: when estrogen peaks", fb:"Estrogen peaks on day 12, but the kit detects LH, which surges on day 13." },
              { t:"Day 21: when progesterone peaks", fb:"The kit detects LH, not progesterone; by day 21 ovulation is long past." }] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Yuki", goal:[2, 3, 4], how:"",
        instruction:"Yuki made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Explain why menstruation happens when there’s no pregnancy.",
            steps:["After ovulation, the follicle becomes the corpus luteum.", "The corpus luteum makes progesterone, which maintains the lining.", "With no hCG, the corpus luteum breaks down after about 10 days.", "Rising progesterone then makes the lining shed.", "FSH starts to rise for the next cycle."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 is correct."],
            fixes:[
              { t:"Falling progesterone means the lining is no longer maintained, so it is shed.", ok:true, why:M4 },
              { t:"Rising estrogen then makes the lining shed.", why:"Estrogen is also falling at this point." },
              { t:"Rising LH then makes the lining shed.", why:"LH doesn’t act on the lining." },
              { t:"Step 4 is correct.", why:"A breaking-down corpus luteum can’t raise progesterone." }],
            hints:["What happens to the corpus luteum’s output when it breaks down?", "Progesterone falls.", "Falling progesterone causes shedding."] },
          { id:"e2", goal:2, task:"Match the phases of the ovary and uterus.",
            steps:["Days 1–5: the uterus is in its menstrual phase.", "Days 6–14: the uterus is in its proliferative phase, as estrogen builds the lining.", "Days 15–28: the uterus is in its luteal phase.", "During days 15–28, progesterone keeps the lining ready."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 is correct."],
            fixes:[
              { t:"Days 15–28: the uterus is in its secretory phase (the ovary is in its luteal phase).", ok:true, why:M3 },
              { t:"Days 15–28: the uterus is in its follicular phase.", why:"Follicular is an ovarian phase before ovulation." },
              { t:"Days 15–28: the uterus is in its proliferative phase.", why:"Proliferative ends at ovulation." },
              { t:"Step 3 is correct.", why:"Luteal names the ovary’s phase, not the uterus’s." }],
            hints:["Which organ has a ‘luteal’ phase?", "The ovary, because of the corpus luteum.", "The uterus is secretory."] },
          { id:"e3", goal:3, task:"Explain what triggers ovulation.",
            steps:["FSH helps a follicle grow.", "The growing follicle makes more and more estrogen.", "High estrogen always brakes the pituitary, so LH falls.", "Ovulation happens about a day after the LH surge."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 is right, but it contradicts step 3."],
            fixes:[
              { t:"High, sustained estrogen switches to positive feedback, so the pituitary releases an LH surge.", ok:true, why:M1 },
              { t:"High estrogen makes FSH surge, which releases the egg.", why:M2 },
              { t:"High progesterone triggers the surge.", why:"Progesterone is low before ovulation." },
              { t:"Step 3 is correct.", why:"If LH fell, there would be no surge to trigger ovulation." }],
            hints:["Can estrogen’s feedback ever be positive?", "Yes, when it’s high for a couple of days.", "Positive feedback → LH surge."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most: that estrogen’s feedback can flip, or that the cycle ends because a hormone falls?" },
      { id:"j2", q:"In your own words, why does hCG decide between menstruation and pregnancy?" },
      { id:"j3", q:"Explain to a friend how the combined pill uses the body’s own feedback to prevent ovulation." },
      { id:"j4", q:"Which phase names or hormone roles do you still mix up? What will you do about it?" }
    ]
  },
  final:{
    intro:"Ten questions: 3 Knowledge, 3 Thinking, 2 Communication, 2 Application. No hints; choose your confidence for each. The 28-day model cycle applies unless a question says otherwise.",
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which structure makes most of the progesterone after ovulation?", options:[
          { t:"The corpus luteum", ok:true, why:"The empty follicle becomes the corpus luteum, which makes progesterone." },
          { t:"The growing follicle before ovulation", why:"Before ovulation the follicle mainly makes estrogen." },
          { t:"The anterior pituitary", why:"The pituitary makes FSH and LH." },
          { t:"The endometrium", why:"The lining responds to progesterone; it doesn’t make it." }] },
        b:{ prompt:"Which hormone’s surge triggers ovulation?", options:[
          { t:"LH", ok:true, why:"The LH surge triggers ovulation about a day later." },
          { t:"FSH", why:"FSH rises a little, but the LH surge triggers ovulation." },
          { t:"Estrogen", why:"Estrogen sets off the surge; it isn’t the surge." },
          { t:"Progesterone", why:"Progesterone is low until after ovulation." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"During which <strong>uterine</strong> phase does estrogen thicken the lining?", options:[
          { t:"Proliferative", ok:true, why:"Days 6–14: estrogen from the growing follicle builds the lining." },
          { t:"Secretory", why:"That comes after ovulation, under progesterone." },
          { t:"Menstrual", why:"The lining is shed then." },
          { t:"Luteal", why:"Luteal is an ovarian phase." }] },
        b:{ prompt:"Which <strong>ovarian</strong> phase is dominated by progesterone?", options:[
          { t:"Luteal", ok:true, why:"After ovulation, the corpus luteum makes progesterone." },
          { t:"Follicular", why:"Progesterone is low before ovulation." },
          { t:"Proliferative", why:"That’s a uterine phase." },
          { t:"Menstrual", why:M3 }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"What does hCG do in early pregnancy?", options:[
          { t:"It keeps the corpus luteum making progesterone", ok:true, why:"So the lining stays and there is no menstruation." },
          { t:"It triggers ovulation", why:"hCG appears after implantation, long after ovulation." },
          { t:"It causes menstruation", why:"It prevents menstruation." },
          { t:"It raises FSH to grow new follicles", why:"FSH stays low in pregnancy." }] },
        b:{ prompt:"Which hormone does a home pregnancy test detect?", options:[
          { t:"hCG", ok:true, why:M5 },
          { t:"Progesterone", why:M5 },
          { t:"LH", why:"Ovulation kits detect LH." },
          { t:"Estrogen", why:M5 }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"On day 12, estrogen is high and has been rising for two days. What happens next, and why?", options:[
          { t:"LH surges, because high sustained estrogen has positive feedback on the pituitary", ok:true, why:M1 },
          { t:"LH falls, because estrogen has negative feedback on the pituitary", why:M1 },
          { t:"Progesterone surges, because the follicle switches hormones", why:"Progesterone rises after ovulation." },
          { t:"Menstruation begins, because estrogen peaks", why:"Menstruation follows the fall in progesterone." }] },
        b:{ prompt:"On day 21, progesterone and estrogen are both high. What are FSH and LH doing, and why?", options:[
          { t:"Staying low, because progesterone and estrogen brake the pituitary", ok:true, why:"In the luteal phase the feedback is negative." },
          { t:"Surging, because estrogen is high", why:"In the luteal phase, progesterone keeps the feedback negative." },
          { t:"Rising, to start a new follicle", why:"That happens after progesterone falls." },
          { t:"Falling to zero", why:"They stay low, not zero." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"The corpus luteum is removed on day 18 (model rule: menstruation starts 4 days after it is lost). What happens?", options:[
          { t:"Progesterone falls, and menstruation starts around day 22", ok:true, why:"18 + 4 = 22: without progesterone the lining isn’t maintained." },
          { t:"Nothing changes until day 28", why:"The lining depends on progesterone now." },
          { t:"Progesterone rises and the lining thickens", why:M4 },
          { t:"Ovulation happens again on day 19", why:"A new follicle hasn’t matured." }] },
        b:{ prompt:"An egg is fertilized, but the embryo fails to implant. What happens to the corpus luteum, and why?", options:[
          { t:"It breaks down on schedule, because no hCG is made to maintain it", ok:true, why:"hCG comes only from an implanted embryo." },
          { t:"It keeps going, because fertilization happened", why:"hCG comes from the implanted embryo." },
          { t:"It grows larger, because LH rises", why:"LH stays low in the luteal phase." },
          { t:"It releases a second egg", why:"The corpus luteum doesn’t release eggs." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"After menopause, blood tests show high FSH, high LH and low estrogen. Why are FSH and LH high?", options:[
          { t:"The ovaries make little estrogen, so the pituitary is no longer braked", ok:true, why:M6 },
          { t:"The ovaries are overactive, making FSH", why:"FSH comes from the pituitary." },
          { t:"Progesterone is high, stimulating the pituitary", why:"Progesterone is low." },
          { t:"The hypothalamus has stopped working", why:"Then FSH and LH would be low." }] },
        b:{ prompt:"Both ovaries are surgically removed. What happens to FSH and LH?", options:[
          { t:"They rise, because estrogen and progesterone no longer brake the pituitary", ok:true, why:"No ovaries, no end hormones, no brake." },
          { t:"They fall, because their target is gone", why:"The pituitary still works; it isn’t braked." },
          { t:"They stay the same", why:"Feedback responds to the loss." },
          { t:"Only LH rises; FSH falls", why:"Both lose their brake." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of how the combined pill prevents ovulation?", options:[
          { t:"“Steady synthetic estrogen and progestin brake the pituitary: FSH stays too low for a follicle to mature, and there is no LH surge to release an egg.”", ok:true, why:"It uses negative feedback on the pituitary." },
          { t:"“The pill kills eggs in the ovary.”", why:"It works through hormones, not by destroying eggs." },
          { t:"“The pill raises LH so high that ovulation can’t happen.”", why:"It keeps LH low and flat." },
          { t:"“The pill makes the lining shed every day.”", why:"The lining stays thin; shedding happens in the placebo week." }] },
        b:{ prompt:"Which is the best explanation of why menstruation begins at the end of a cycle without pregnancy?", options:[
          { t:"“With no hCG, the corpus luteum breaks down, progesterone falls, and the lining is no longer maintained, so it is shed.”", ok:true, why:M4 },
          { t:"“Estrogen surges and breaks down the lining.”", why:"Estrogen is falling too." },
          { t:"“LH surges and releases the lining.”", why:M2 },
          { t:"“The lining grows too thick and falls off.”", why:"It’s hormone withdrawal, not thickness." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which sequence of events is correct?", options:[
          { t:"FSH rises → follicle grows and makes estrogen → LH surge → ovulation → corpus luteum makes progesterone", ok:true, why:"Each step sets up the next." },
          { t:"LH surge → FSH rises → ovulation → follicle grows", why:"The follicle must grow before the surge." },
          { t:"Progesterone rises → ovulation → estrogen rises → LH surge", why:"Progesterone comes after ovulation." },
          { t:"FSH rises → corpus luteum forms → follicle grows → ovulation", why:"The corpus luteum forms after ovulation." }] },
        b:{ prompt:"Which pairing of ovarian and uterine phases is correct?", options:[
          { t:"Follicular phase ↔ menstrual then proliferative phases; luteal phase ↔ secretory phase", ok:true, why:M3 },
          { t:"Follicular ↔ secretory; luteal ↔ proliferative", why:"Swapped. " + M3 },
          { t:"Luteal ↔ menstrual only", why:M3 },
          { t:"Ovulation ↔ menstrual", why:"Menstruation is at the start of the cycle." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"Why are FSH injections given at the start of IVF treatment?", options:[
          { t:"To make several follicles mature at once, so more eggs can be collected", ok:true, why:"More FSH, more follicles (model: up to 12)." },
          { t:"To trigger ovulation immediately", why:"That’s the job of the LH-like trigger." },
          { t:"To keep the lining ready after transfer", why:"That’s progesterone’s job." },
          { t:"To lower estrogen", why:"Growing follicles raise estrogen." }] },
        b:{ prompt:"Why is an hCG ‘trigger’ injection given near the end of the follicle-growing phase?", options:[
          { t:"hCG acts on LH receptors, so it mimics the LH surge and times the final egg maturation", ok:true, why:"It stands in for the natural surge." },
          { t:"hCG grows more follicles, like FSH", why:"It acts like LH, not FSH." },
          { t:"hCG prevents the corpus luteum from forming", why:"It does the opposite: it supports it." },
          { t:"hCG lowers progesterone", why:"hCG keeps progesterone up." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"Cycles are regularly 30 days. Using the model’s 14-day luteal phase, on which day is ovulation most likely?", options:[
          { t:"Day 16", ok:true, why:"30 − 14 = 16." },
          { t:"Day 14", why:M7 },
          { t:"Day 15", why:"30 − 14 = 16, not 15." },
          { t:"Day 30", why:"That’s the last day of the cycle." }] },
        b:{ prompt:"Cycles are regularly 27 days. Using the model’s 14-day luteal phase, on which day is ovulation most likely?", options:[
          { t:"Day 13", ok:true, why:"27 − 14 = 13." },
          { t:"Day 14", why:M7 },
          { t:"Day 12", why:"27 − 14 = 13." },
          { t:"Day 27", why:"That’s the last day of the cycle." }] } }
    ]
  },
  task:{
    title:"Design a model hormone schedule", summary:"Design a model hormone schedule",
    statement:"<p>Using the Pill-mode model, set the synthetic estrogen (<i>E</i>) and progestin (<i>P</i>) levels for each week of a 4-week pack so that every condition is met. These are model levels, not real medicine amounts. Can you find more than one schedule?</p><ol class=\"fr-tlist\"><li>No LH surge in weeks 1–3.</li><li>FSH stays below 15 in weeks 1–3, so no follicle matures.</li><li>A withdrawal bleed happens in week 4.</li><li>The estrogen level never goes above 2 (in the model, higher estrogen adds clot risk).</li></ol><p class=\"tiny muted\">Model: FSH in week <i>w</i> = 40 − 10<i>E</i><sub><i>w</i></sub> − 5<i>P</i><sub><i>w</i></sub> (never below 5); an LH surge is possible in week <i>w</i> if <i>P</i><sub><i>w</i></sub> = 0; a withdrawal bleed happens in week 4 when <i>E</i><sub>4</sub> = <i>P</i><sub>4</sub> = 0 after active weeks.</p>",
    checks:["No surge in weeks 1–3", "FSH below 15 in weeks 1–3", "Withdrawal bleed in week 4", "Estrogen never above 2"],
    tips:[
      "Progestin is what blocks the surge in this model.",
      "Each estrogen level lowers FSH by 10 and each progestin level by 5. You need FSH below 15.",
      "The bleed comes when the hormones are withdrawn.",
      "With estrogen capped at 2, how much progestin do you need to keep FSH below 15?"
    ],
    explainPrompt:"Explain how your schedule uses negative feedback to prevent ovulation, and why week 4 is hormone-free.",
    vocab:"Use the words negative feedback, FSH, LH surge and withdrawal.",
    after3:"Every answer uses estrogen 2 and progestin 2 or 3. With estrogen capped, progestin does part of the work of keeping FSH down: 40 − 20 − 10 = 10."
  },
  cards:[
    ["Ovarian cycle", "Follicular phase → ovulation → luteal phase."],
    ["Uterine cycle", "Menstrual → proliferative → secretory phase."],
    ["FSH (female)", "From the anterior pituitary; grows follicles early in the cycle."],
    ["LH surge", "A sharp LH peak (about day 13 in the model) that triggers ovulation about a day later."],
    ["Estrogen’s two feedbacks", "Low or moderate: negative (brakes FSH and LH). High and sustained: positive (triggers the LH surge)."],
    ["Corpus luteum", "The follicle after ovulation; makes progesterone (and estrogen)."],
    ["Progesterone", "Keeps the lining ready (secretory phase); brakes FSH and LH; raises resting temperature slightly."],
    ["Why menstruation starts", "The corpus luteum breaks down, progesterone falls, and the lining is shed."],
    ["hCG", "Made after implantation; keeps the corpus luteum working; detected by pregnancy tests."],
    ["Combined pill", "Steady estrogen and progestin keep FSH low and prevent the LH surge, so there’s no ovulation."],
    ["Menopause hormones", "Low estrogen → no brake → high FSH and LH."],
    ["Ovulation day estimate (model)", "Cycle length − 14 (the luteal phase is the steady part)."]
  ]
};
