// SBI4U 34 Homeostasis. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/34-homeostasis.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "Regulated variables move all the time. Homeostasis keeps them within a normal range around a set point.";
const M2 = "Negative means the response <strong>opposes</strong> the change, whichever direction it was in. It keeps you stable.";
const M3 = "Receptors detect the change; effectors (muscles and glands) act to change the variable.";
const M4 = "Positive feedback pushes a change further until an outside event ends it, as delivery ends labour.";
const M5 = "Hormones travel in the blood and act on any cell that has the matching receptor.";
const M6 = "With a delay in the loop, a strong response overshoots and swings back and forth.";
const M7 = "Many loops run through the hypothalamus or medulla, but the pancreas, for example, senses and controls blood glucose itself.";
const AR = '<span class="ho-ha" aria-hidden="true">→</span>';

export default {
  id:"34-homeostasis",
  kind:"topic",
  title:"Homeostasis",
  topic:"Homeostasis",
  readyTopic:"homeostasis",
  hero:{
    eq:'<span class="ho-heq"><span class="ho-hrow">Stimulus ' + AR + " Receptor " + AR + " Control centre " + AR + " Effector " + AR + ' Response</span><span class="ho-hret"><span aria-hidden="true">↺</span> <span class="ho-hsign">−</span> opposes the change</span></span>',
    eqLabel:"A loop: stimulus, then receptor, then control centre, then effector, then response. A return arrow from the response back to the stimulus is marked minus: it opposes the change.",
    eqSize:"sm",
    headline:"Stable doesn’t mean still",
    text:"Your blood pressure dips every time you stand up, and your blood CO₂ climbs every time you run for a bus. <strong>Homeostasis</strong> is the set of <strong>feedback loops</strong> that notice these changes and pull each variable back into its <strong>normal range</strong> around a <strong>set point</strong>. In this module you’ll build those loops, break them, and see why most of them run on <strong>negative feedback</strong>.",
    fig:{ html:'<div class="ho-hero" id="ho-hero" role="img" aria-label="A blood-pressure graph with a shaded normal band from 80 to 100 mmHg. A person stands up and the line dips to 70. Five loop boxes light in order: stimulus, receptor (baroreceptors), control centre (medulla), effector (heart) and response. The line climbs back into the band and settles: back in range in about 2 seconds."></div>' }
  },
  goals:[
    "I can explain homeostasis as keeping a variable within a normal range around a set point.",
    "I can identify the stimulus, receptor, control centre, effector and response in a feedback loop.",
    "I can tell negative feedback from positive feedback and give an example of each.",
    "I can predict what happens when part of a loop fails, or when a loop is slow or too strong.",
    "I can compare nervous and endocrine control and describe how the hypothalamus and pituitary link them.",
    "I can build a flow-chart model of a homeostatic mechanism and use it to explain data."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Body systems", goal:1,
          prompt:"A healthy person’s body temperature is measured every hour for a day. Which result is most likely?",
          options:[
            { t:"It varies a little, staying between about 36.5 °C and 37.5 °C", ok:true, why:"Regulated variables wobble within a narrow range." },
            { t:"It reads exactly 37.0 °C every hour.", why:"No real variable is held perfectly constant." },
            { t:"It follows the outdoor temperature.", why:"Humans regulate core temperature." },
            { t:"It rises steadily all day.", why:"A steady rise would be a fever or illness, not normal regulation." }],
          hints:["Is anything in the body perfectly constant?", "Think of a normal range.", "Small changes within a range: it varies a little, between about 36.5 °C and 37.5 °C."] },
        { id:"w2", skill:"Body systems", goal:5,
          prompt:"Which system carries signals in the blood?",
          options:[
            { t:"The endocrine system", ok:true, why:"Glands release hormones into the blood." },
            { t:"The nervous system", why:"Nerves carry electrical impulses along neurons, not through the blood." },
            { t:"The digestive system", why:"It absorbs nutrients; it doesn’t carry signals." },
            { t:"The skeletal system", why:"Bones support and protect; they don’t signal." }],
          hints:["What do glands make?", "Hormones travel in the blood.", "Endocrine."] },
        { id:"w3", skill:"Stimulus and response", goal:2,
          prompt:"You touch a hot pan and pull your hand away. Which part <strong>detected</strong> the heat?",
          options:[
            { t:"Receptors in the skin", ok:true, why:"Sensory receptors detect the stimulus." },
            { t:"The arm muscles", why:"Muscles carry out the response; they’re effectors." },
            { t:"The heat itself", why:"Heat is the stimulus, the change being detected." },
            { t:"Pulling the hand away", why:"That’s the response." }],
          hints:["Detecting ≠ acting.", "Which cells sense temperature?", "Skin receptors."] },
        { id:"w4", skill:"Stimulus and response", goal:2,
          prompt:"In the same reflex, which part is the <strong>effector</strong>?",
          options:[
            { t:"The arm muscles that contract", ok:true, why:"Effectors are muscles or glands that act." },
            { t:"The skin receptors", why:"They detect; they don’t act." },
            { t:"The spinal cord", why:"It’s the control centre here: it connects sensory and motor neurons." },
            { t:"The pain you feel", why:"That’s a sensation, not a part of the loop." }],
          hints:["Effectors carry out the response.", "What moves the hand?", "Muscles."] },
        { id:"w5", skill:"Reading a time graph", goal:6,
          prompt:"A graph shows heart rate (beats per minute) against time. At 2 min the line jumps from 70 to 110, then slowly falls back to 72 by 8 min. What happened at 2 min?",
          options:[
            { t:"A disturbance raised the heart rate, and it then recovered", ok:true, why:"The jump is the disturbance; the slow fall is the recovery." },
            { t:"The heart rate was steady the whole time.", why:"The line jumps by 40." },
            { t:"The heart rate fell at 2 min.", why:"It went from 70 up to 110." },
            { t:"The person’s set point changed permanently to 110.", why:"It returned to about 72." }],
          hints:["Read the values before and after 2 min.", "It goes up, then comes back.", "A disturbance, then recovery."] },
        { id:"w6", skill:"Reading a time graph", goal:6,
          prompt:"On the same graph, about how long did recovery take?",
          options:[
            { t:"About 6 minutes", ok:true, why:"From 2 min to 8 min." },
            { t:"About 8 minutes", why:"Recovery starts at 2 min, not 0." },
            { t:"About 2 minutes", why:"That’s when the jump happened." },
            { t:"About 40 minutes", why:"40 is the rise in beats per minute, not a time." }],
          hints:["When did it start falling, and when did it level off?", "8 − 2.", "6 minutes."] }
      ],
      refreshers:{
        "Body systems":"The nervous system sends fast electrical signals along neurons; the endocrine system sends hormones through the blood. Body variables stay within a normal range; they aren’t fixed at one value.",
        "Stimulus and response":"A stimulus is a change. Receptors detect it, a control centre (often in the brain or spinal cord) decides, and effectors (muscles or glands) respond. Example: hot pan → skin receptors → spinal cord → arm muscles → hand pulls away.",
        "Reading a time graph":"Read the axes first. A sudden jump marks a disturbance; the time to return is the later time minus the time of the jump."
      }
    }
  },
  explore:{
    heading:"Feedback loop builder",
    intro:"Build a loop, then put it to work. Stand the model person up, watch the blood pressure, and then change how strong and how slow the loop is.",
    chalIntro:"Use the loop builder to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    buildHow:"Tap a card, then tap a slot. Tap a filled slot to send its card back. Then set the return arrow.",
    modelNote:"Teaching model, not clinical data. One step = 1 s. Set point 90 mmHg, normal range 80–100 mmHg. Each second the loop corrects by a quarter (Weak), a half (Medium) or all (Strong) of the gap it senses, using a reading 0, 1 or 2 s old.",
    birthNote:"Teaching model: contraction strength starts at 2 units and is multiplied by 1.5 with each contraction. Oxytocin is shown as a relative level.",
    slots:[{ id:"stim", t:"Stimulus" }, { id:"rec", t:"Receptor" }, { id:"cc", t:"Control centre" }, { id:"eff", t:"Effector" }, { id:"resp", t:"Response" }],
    cards:[
      { id:"c1", t:"Fall in blood pressure", answer:"stim" },
      { id:"c2", t:"Baroreceptors in the aorta and carotid arteries", answer:"rec" },
      { id:"c3", t:"Cardiovascular centre in the medulla", answer:"cc" },
      { id:"c4", t:"Heart and arteriole muscles", answer:"eff" },
      { id:"c5", t:"Faster heart rate; arterioles narrow", answer:"resp" },
      { id:"d1", t:"Thermoreceptors in the skin", answer:"none" },
      { id:"d2", t:"Sweat glands", answer:"none" },
      { id:"d3", t:"Pancreas", answer:"none" },
      { id:"d4", t:"Slower breathing", answer:"none" }
    ],
    birthCards:["Baby’s head stretches the cervix", "Stretch receptors in the cervix", "Hypothalamus", "Posterior pituitary releases oxytocin; uterine muscle", "Stronger contractions"],
    cardFb:{
      "d1|rec":"They sense temperature, not pressure.",
      "c4|rec":"They act; they don’t detect. That’s the effector’s job.",
      "d3|cc":"The pancreas controls blood glucose. Blood pressure is managed by the cardiovascular centre in the medulla."
    },
    signFb:"A + arrow would push pressure further down. Try running it to see.",
    predictions:[
      { id:"p1", prompt:"<span class=\"ho-pst\">Start: the correct loop, Medium / 0 s, “Receptor damaged” on.</span> The person stands up. What happens to blood pressure?",
        options:[{ t:"It stays at 70 mmHg", ok:true }, { t:"It returns to 90 within a second" }, { t:"It rises above 100" }, { t:"It keeps falling below 70" }],
        explain:"With no receptor, the control centre is never told the pressure fell, so nothing corrects it. (This is one reason some people feel faint when they stand up.)",
        reveal:"The line stays flat at 70 mmHg; the receptor box is greyed out.",
        start:{ str:"medium", del:0, sign:"-", brkR:true, brkE:false } },
      { id:"p2", prompt:"<span class=\"ho-pst\">Start: Medium / 0 s, with the return arrow switched to +.</span> What happens now?",
        options:[{ t:"Pressure keeps falling", ok:true }, { t:"Pressure returns to 90 faster" }, { t:"Pressure swings around 90" }, { t:"Nothing changes" }],
        explain:"A + arrow amplifies the change. The farther pressure is from 90, the more it is pushed down. Positive feedback can’t hold a variable steady.",
        reveal:"70, 60, 45, 22.5 mmHg: the display stops at 40.",
        start:{ str:"medium", del:0, sign:"+", brkR:false, brkE:false } },
      { id:"p3", prompt:"<span class=\"ho-pst\">Start: Strong / 1 s.</span> A strong response sounds good. What will the pressure do?",
        options:[{ t:"Swing between 70 and 110 without settling", ok:true }, { t:"Return to 90 in 1 s and stay" }, { t:"Return slowly without passing 90" }, { t:"Stay at 70" }],
        explain:"The control centre is acting on old information. By the time it sees the pressure is back, it has already over-corrected.",
        reveal:"70, 70, 90, 110, 110, 90, 70, 70, … mmHg: it never settles.",
        start:{ str:"strong", del:1, sign:"-", brkR:false, brkE:false } },
      { id:"p4", prompt:"<span class=\"ho-pst\">Start: Childbirth, contraction 0.</span> Each contraction makes the next one stronger. What stops this loop?",
        options:[{ t:"Delivery removes the stretch stimulus", ok:true }, { t:"Oxytocin runs out" }, { t:"Negative feedback slowly takes over" }, { t:"Each contraction gets weaker" }],
        explain:"Positive feedback drives an event to completion. It ends when an outside event removes the stimulus.",
        reveal:"Strength climbed 2, 3, 4.5, … 22.8; “Delivery” appeared, the stimulus box went dark and oxytocin dropped to 0.",
        start:{ scn:"birth" } }
    ],
    challenges:[
      { id:"tc1", goal:[2, 4], prompt:"Build the blood-pressure loop: every card in the right slot, and the right sign.",
        why:"Fall in pressure → baroreceptors → cardiovascular centre → heart and arterioles → faster heart, narrower arterioles, with a − arrow: the response opposes the fall.",
        general:"Some cards aren’t in the right slots yet. Check the “Loop parts placed” readout.",
        named:{ scn:"Switch the scenario to <strong>Blood pressure</strong> first.", empty:"Fill all five slots first.",
          swap:"Baroreceptors detect; heart and arteriole muscles act.", plus:"Run it: a + loop makes the drop worse.",
          pancreas:M7 },
        hints:["Start with what changed: the stimulus.", "Which card can <em>sense</em> pressure?", "Fall in pressure → baroreceptors → cardiovascular centre → heart and arterioles → faster heart, narrower arterioles; sign −."] },
      { id:"tc2", goal:4, prompt:"Get the pressure back into the normal range within <strong>2 seconds</strong> of standing, and keep it there for the whole run.",
        why:"Medium / 0 s and Strong / 0 s are back in 1 s; Medium / 1 s is back in 2 s. Each corrects firmly without overshooting out of the range.",
        general:"The swings grow: it never settles.",
        named:{ scn:"Switch the scenario to <strong>Blood pressure</strong> first.", build:"Build the loop correctly first (challenge 1).",
          plus:"Set the return arrow to −: a + loop makes the drop worse.", broken:"Switch off “Receptor damaged” and “Effector blocked”: a broken loop can’t correct.",
          weak:"Too slow: 3 s or more.", s1:"It overshoots to 110 and never settles.", m2:"It overshoots to 105, outside the range." },
        hints:["A weak response is steady but slow.", "A strong response is fine only if the sensor has no delay.", "Try Medium / 0 s, Strong / 0 s or Medium / 1 s."] },
      { id:"tc3", goal:4, stretch:true, prompt:"A slow sensor: the delay is locked at 2 s. Choose the <strong>one</strong> strength that brings the pressure back into range and never lets it leave again. You get one Check, so reason first.",
        why:"Weak / 2 s is back in range at 4 s and peaks at about 92.8 mmHg: slow, but it never overshoots out of the range.",
        general:"Set the sensor delay to 2 s: this challenge’s sensor is slow.",
        named:{ scn:"Switch the scenario to <strong>Blood pressure</strong> first.", build:"Build the loop correctly first (challenge 1).",
          plus:"Set the return arrow to −: a + loop makes the drop worse.", broken:"Switch off “Receptor damaged” and “Effector blocked”: a broken loop can’t correct.",
          m2:"Reaches 105: the 2-second-old reading still says ‘too low’ when pressure is already at 90.", s2:"The swings grow: each correction is based on readings 2 s old." },
        hints:["With a delay, the control centre keeps correcting after the problem is fixed.", "The bigger each correction, the further it overshoots.", "Choose Weak: slow, but it never overshoots out of range."] }
    ]
  },
  part3:{
    slug:"systems", name:"Two systems", heading:"Nervous vs endocrine control",
    intro:"The nervous and endocrine systems both carry the signals in your feedback loops. Race them side by side, then trace the link between them: the place where a nerve signal becomes a hormone signal.",
    st1:{ title:"Station 1: The race",
      text:"Two lanes start together. Press <strong>Start the race</strong> and watch which signal arrives first, how it travels and how long its effect lasts.",
      lanes:[
        { id:"nerve", name:"Nerve: withdrawal reflex", by:"Neurons", time:"About 0.05 s", lasts:"Ends as soon as the impulse stops", cells:"Only those the neurons reach", end:"Hand pulls away" },
        { id:"epi", name:"Hormone: epinephrine (adrenaline)", by:"Blood", time:"A few seconds", lasts:"Minutes", cells:"Every cell with the receptor", end:"Heart speeds up" },
        { id:"thy", name:"Hormone: thyroid hormone", by:"Blood", time:"Hours to days", lasts:"Days", cells:"Every cell with the receptor", end:"Metabolic rate rises" }],
      rows:["Signal travels by", "Time to response", "How long it lasts", "Which cells respond"],
      addThy:"Add thyroid hormone",
      note:"Race times are typical values. The nerve impulse reaches the arm muscles in about 0.05 s; epinephrine from the adrenal glands spreads through the blood and the heart speeds up after a few seconds." },
    st2:{ title:"Station 2: The link",
      text:"The hypothalamus links the two systems through the pituitary gland. Trace each path, then tap a structure to see its job.",
      paths:[
        { id:"p1", t:"Trace path 1: ADH", steps:[
          "A neuron in the hypothalamus makes ADH.",
          "ADH travels down the neuron’s own axon to the <strong>posterior pituitary</strong>.",
          "It is released into the blood. A nerve cell that releases a hormone." ] },
        { id:"p2", t:"Trace path 2: releasing hormone", steps:[
          "The hypothalamus releases a <strong>releasing hormone</strong> into tiny blood vessels.",
          "The vessels lead to the <strong>anterior pituitary</strong>.",
          "The anterior pituitary releases its own hormone (for example TSH, FSH or LH) into the blood." ] }],
      parts:[
        { id:"hyp", t:"Hypothalamus", job:"Part of the brain that senses the body’s state (for example blood concentration and temperature) and controls the pituitary. Its neurons make ADH and oxytocin, and releasing hormones." },
        { id:"axon", t:"Neurosecretory axons", job:"Hypothalamus neurons whose axons run down the stalk. They carry ADH and oxytocin to the posterior pituitary." },
        { id:"post", t:"Posterior pituitary", job:"Stores and releases ADH and oxytocin, made by hypothalamus neurons, into the blood. It makes no hormones of its own." },
        { id:"portal", t:"Portal blood vessels", job:"Tiny blood vessels that carry releasing hormones straight from the hypothalamus to the anterior pituitary." },
        { id:"ant", t:"Anterior pituitary", job:"Gland tissue that makes its own hormones (TSH, FSH, LH, growth hormone) and releases them when releasing hormones arrive." },
        { id:"blood", t:"Bloodstream", job:"Carries pituitary hormones to every cell in the body; only cells with the matching receptor respond." }] },
    data:{ title:"Check it with data",
      head:["Response", "Signal", "Time to start", "Lasts"],
      rows:[
        ["Pupil narrows in bright light", "Nerve", "under 1 s", "while the light is bright"],
        ["Heart speeds up when startled", "Nerve, then epinephrine", "about 1 s, then seconds", "minutes"],
        ["Metabolic rate rises after thyroid hormone", "Hormone", "hours to days", "days"]],
      asks:[
        { id:"fast", t:"Tap the row that best fits “fast, brief, targeted”.", answer:0,
          fb:["✓ Right. A nerve signal: under a second to start, over as soon as the light dims, and only the iris muscles respond.",
            "It starts fast, but the epinephrine keeps it going for minutes and reaches many cells. Try another row.",
            "Hours to days to start and days to wear off: that’s the opposite. Try another row."] },
        { id:"slow", t:"Tap the row that best fits “slow, long-lasting, widespread”.", answer:2,
          fb:["That’s a quick, brief nerve response. Try another row.",
            "Part of it is a fast nerve signal, and the effect lasts minutes, not days. Try another row.",
            "✓ Right. A hormone that takes hours to days, lasts days and reaches almost every cell."] }] },
    quickCheck:{
      title:"Two systems quick check", summary:"Two systems quick check",
      items:[
        { id:"q1", goal:5, prompt:"Which signal reaches every cell that has the right receptor?",
          choices:[{ t:"A hormone", ok:true, fb:"Hormones travel in the blood; nerve impulses go only where neurons lead." },
            { t:"A nerve impulse", fb:"Hormones travel in the blood; nerve impulses go only where neurons lead." },
            { t:"A reflex", fb:"Hormones travel in the blood; nerve impulses go only where neurons lead." },
            { t:"A synapse", fb:"Hormones travel in the blood; nerve impulses go only where neurons lead." }] },
        { id:"q2", goal:5, prompt:"Which part of the pituitary releases ADH made in the hypothalamus?",
          choices:[{ t:"Posterior", ok:true, fb:"ADH is made by hypothalamus neurons and released from their endings in the posterior pituitary." },
            { t:"Anterior", fb:"ADH is made by hypothalamus neurons and released from their endings in the posterior pituitary." },
            { t:"Both", fb:"ADH is made by hypothalamus neurons and released from their endings in the posterior pituitary." },
            { t:"Neither", fb:"ADH is made by hypothalamus neurons and released from their endings in the posterior pituitary." }] },
        { id:"q3", goal:5, prompt:"Which control is fastest?",
          choices:[{ t:"Nervous", ok:true, fb:"Impulses take milliseconds; hormones take seconds to days." },
            { t:"Endocrine", fb:"Impulses take milliseconds; hormones take seconds to days." },
            { t:"They’re equal", fb:"Impulses take milliseconds; hormones take seconds to days." },
            { t:"Depends on the hormone only", fb:"Impulses take milliseconds; hormones take seconds to days." }] },
        { id:"q4", goal:3, prompt:"Blood pressure <strong>rises</strong> and the loop brings it <strong>down</strong>. What kind of feedback is that?",
          choices:[{ t:"Negative", ok:true, fb:"Negative means opposing the change, whether the change was up or down." },
            { t:"Positive", fb:"Negative means opposing the change, whether the change was up or down." },
            { t:"Neither", fb:"Negative means opposing the change, whether the change was up or down." },
            { t:"Both", fb:"Negative means opposing the change, whether the change was up or down." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"loops", type:"custom", title:"Build the loop", summary:"Build the loop", goal:[2, 6], noun:"card", txt:true,
        instruction:"Ten cards, two loops. Sort each card into its part of the loop: round 1 is blood CO₂; round 2 is body water.",
        how:"",
        boxes:[{ id:"stim", label:"Stimulus" }, { id:"rec", label:"Receptor" }, { id:"cc", label:"Control centre" }, { id:"eff", label:"Effector" }, { id:"resp", label:"Response" }],
        wrongDefault:"Ask: does this card detect, decide, act, or describe a change?",
        rounds:[
          { id:"r1", title:"Round 1: Blood CO₂", items:[
            { id:"i1", t:"Blood CO₂ rises during exercise", answer:"stim", why:"The rise in CO₂ is the change that sets the loop off." },
            { id:"i2", t:"Chemoreceptors in the medulla and in the carotid and aortic bodies", answer:"rec", why:"Chemoreceptors detect the rise in CO₂.",
              wrong:{ eff:"Receptors detect the change." } },
            { id:"i3", t:"Respiratory centre in the medulla", answer:"cc", why:"It receives the signal and decides how hard to breathe.",
              wrong:{ eff:"The respiratory centre decides; muscles carry it out." } },
            { id:"i4", t:"Diaphragm and rib (intercostal) muscles", answer:"eff", why:"These muscles act: they move air in and out.",
              wrong:{ rec:"Muscles and kidney ducts act; they don’t sense." } },
            { id:"i5", t:"Faster, deeper breathing; CO₂ falls", answer:"resp", why:"The response opposes the rise: negative feedback.",
              wrong:{ stim:"That’s the result of the loop, not what set it off." } }] },
          { id:"r2", title:"Round 2: Body water", items:[
            { id:"i6", t:"Blood becomes more concentrated (water lost by sweating)", answer:"stim", why:"The change in blood concentration sets the loop off." },
            { id:"i7", t:"Osmoreceptors in the hypothalamus", answer:"rec", why:"Osmoreceptors detect the more concentrated blood.",
              wrong:{ eff:"Receptors detect the change." } },
            { id:"i8", t:"Hypothalamus signals the posterior pituitary to release ADH", answer:"cc", why:"The hypothalamus decides, and the posterior pituitary releases the hormone.",
              hints:["Who decides to release the hormone?", "The hypothalamus controls the posterior pituitary.", "Control centre."] },
            { id:"i9", t:"Collecting ducts of the kidneys", answer:"eff", why:"ADH acts on the collecting ducts, which reabsorb more water.",
              wrong:{ rec:"Muscles and kidney ducts act; they don’t sense." },
              hints:["Where does ADH act?", "On the kidney’s collecting ducts.", "Effector."] },
            { id:"i10", t:"More water reabsorbed; less, more concentrated urine", answer:"resp", why:"Keeping water dilutes the blood again: negative feedback.",
              wrong:{ stim:"That’s the result of the loop, not what set it off." } }] }
        ] },
      { id:"next", type:"mc", title:"What happens next?", summary:"What happens next?", goal:[3, 4, 6], star:true,
        instruction:"Six scenarios. Predict what happens. Items 3–6 are non-routine (★); 5 and 6 go beyond the Final Check.",
        items:[
          { id:"s1", goal:4, prompt:"A drug blocks the effect of ADH on the kidneys. Predict the urine.",
            options:[
              { t:"Large volumes of dilute urine", ok:true, why:"Without ADH acting, the collecting ducts reabsorb less water, so more, weaker urine is made." },
              { t:"Small volumes of concentrated urine", why:"Without ADH acting, less water is reabsorbed." },
              { t:"No change in the urine", why:"ADH is the signal that tells the collecting ducts to keep water; blocking it changes the urine." },
              { t:"No urine at all", why:"The kidneys still filter the blood; they just reabsorb less water." }] },
          { id:"s2", goal:3, prompt:"During labour, a hospital gives extra oxytocin. Predict the contractions.",
            options:[
              { t:"They become stronger and more frequent", ok:true, why:"Oxytocin is the signal in the + loop; more of it strengthens contractions." },
              { t:"They become weaker", why:"Oxytocin is the signal in the + loop; more of it strengthens contractions." },
              { t:"They stop", why:"Oxytocin drives contractions; it doesn’t stop them. Delivery is what ends the loop." },
              { t:"No change, because oxytocin acts only on the brain", why:"Oxytocin travels in the blood to the uterine muscle." }] },
          { id:"s3", goal:3, prompt:"★ In severe heat stroke, a very high temperature stops the sweat glands working, so the body heats up even faster. What kind of feedback is this?",
            options:[
              { t:"Positive feedback, and harmful", ok:true, why:"The change makes itself worse: that’s positive feedback, and here it’s dangerous." },
              { t:"Negative feedback", why:"The change makes itself worse: that’s positive, even though nothing about it is helpful." },
              { t:"Positive feedback, and helpful", why:"It amplifies the change, so it’s positive, but a runaway temperature is harmful." },
              { t:"No feedback: the sweat glands are just tired", why:"The high temperature feeds back to push itself higher: that’s a loop." }] },
          { id:"s4", goal:4, prompt:"★ A graph of blood glucose after a meal rises, falls <strong>below</strong> the starting level, then climbs back. Which loop feature best explains the dip?",
            options:[
              { t:"A delay, so the response continued after glucose was back to normal", ok:true, why:"Insulin keeps acting after glucose is already back, so the loop over-corrects." },
              { t:"A damaged receptor", why:"Then glucose wouldn’t have come back down." },
              { t:"Positive feedback", why:"Positive feedback would push glucose further up, not bring it back." },
              { t:"A blocked effector", why:"Then glucose would have stayed high." }],
            hints:["The level went past the set point.", "What makes a loop over-correct?", "A delay: insulin keeps acting after glucose is already back."] },
          { id:"s5", goal:6, prompt:"★ A student wants to test whether standing up changes heart rate. Which design gives a fair test?",
            options:[
              { t:"The same people measured sitting, then 30 s after standing, at the same time of day, three times each", ok:true, why:"Only posture changes, and the repeats show whether the pattern is reliable." },
              { t:"Compare a group of athletes with a group of non-athletes", why:"That changes two things at once: posture and fitness." },
              { t:"Measure one person once sitting and once standing", why:"One reading each can’t show a reliable pattern." },
              { t:"Measure people sitting in the morning and standing in the evening", why:"Time of day changes too." }] },
          { id:"s6", goal:3, prompt:"★ Blood clotting is positive feedback. Name the event that ends it, and explain why a body needs an end event.",
            options:[
              { t:"The vessel is sealed, so no new damage signals are released; without an end, clots would keep spreading through the blood", ok:true, why:"Positive feedback stops only when its stimulus ends: here, the damage signal." },
              { t:"The platelets run out", why:"Platelets are plentiful; it’s the end of the damage signal that stops the loop." },
              { t:"Negative feedback takes over and dissolves the clot", why:"The loop ends because its stimulus ends, not because it switches type." },
              { t:"The heart pumps the platelets away from the cut", why:"Platelets stay at the damage while the signal lasts; it’s the end of the damage signal that stops the loop." }],
            hints:["What starts the loop?", "Chemicals released at the damaged vessel.", "Once the hole is sealed, the signal stops; otherwise clotting would spread."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Siddharth", how:"",
        instruction:"Siddharth made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Explain how the body cools down on a hot day.",
            steps:["The stimulus is a rise in body temperature.", "The sweat glands detect the rise.", "The hypothalamus sends signals out.", "Sweat evaporates and cools the skin."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 is fine on its own. The mistake is earlier.", "Step 4 is correct."],
            fixes:[
              { t:"Thermoreceptors in the skin and the hypothalamus detect the rise; sweat glands are the effectors.", ok:true, why:M3 },
              { t:"The skin muscles detect the rise.", why:"Muscles are effectors, not receptors." },
              { t:"The sweat itself detects the rise.", why:"Sweat is part of the response." },
              { t:"Step 2 is correct.", why:"Glands act; they don’t sense." }],
            hints:["Which parts detect, and which parts act?", "Sweat glands produce sweat.", "Thermoreceptors detect; glands respond."] },
          { id:"e2", goal:3, task:"Explain the feedback in childbirth.",
            steps:["The baby’s head stretches the cervix.", "Stretch receptors send signals to the hypothalamus.", "The posterior pituitary releases oxytocin.", "Oxytocin makes the contractions stronger, which reduces the stretch, so this is negative feedback.", "The loop stops when the baby is delivered."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 is correct."],
            fixes:[
              { t:"Stronger contractions push the baby further and <em>increase</em> the stretch, so oxytocin release rises: positive feedback.", ok:true, why:M4 },
              { t:"It’s negative feedback because the pain is negative.", why:M2 },
              { t:"It’s neither, because no hormone is involved.", why:"Oxytocin is a hormone." },
              { t:"Step 4 is correct.", why:"Each contraction makes the next stronger; that’s amplifying." }],
            hints:["Does the response reduce the stimulus or increase it?", "More pushing means more stretch.", "Positive feedback."] },
          { id:"e3", goal:1, task:"Interpret a graph: blood glucose was 5 mmol/L, rose to 8 after lunch, and was back to 5.5 two hours later.",
            steps:["Glucose rose after the meal because sugar was absorbed.", "Homeostasis failed, because the glucose level changed.", "Then insulin brought it back down."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 is true, but the mistake is earlier."],
            fixes:[
              { t:"Homeostasis worked: the level moved away from the set point, and negative feedback returned it to the normal range.", ok:true, why:M1 },
              { t:"Homeostasis failed because 5.5 isn’t exactly 5.", why:M1 },
              { t:"It’s positive feedback because glucose went up.", why:M2 },
              { t:"Step 2 is correct.", why:"Changing and then returning is exactly what homeostasis looks like." }],
            hints:["Did the level come back?", "Homeostasis is about returning to a range.", "It worked."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most in the loop builder: the swinging pressure, or the loop that made things worse?" },
      { id:"j2", q:"In your own words, why does almost every homeostatic loop use negative feedback?" },
      { id:"j3", q:"Explain to a friend how to find the receptor and the effector in any loop." },
      { id:"j4", q:"Which part of feedback still feels shaky to you? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which statement best describes homeostasis?", options:[
          { t:"Keeping internal conditions within a narrow range around a set point as conditions change", ok:true, why:"Regulated variables move, and feedback keeps them within a normal range." },
          { t:"Keeping every internal condition exactly constant", why:"Variables move and are pulled back." },
          { t:"Changing internal conditions to match the environment", why:"That describes a body that doesn’t regulate." },
          { t:"Using positive feedback to amplify every change", why:M4 }] },
        b:{ prompt:"Blood pressure dips when a person stands, then returns to normal within seconds. What does this show?", options:[
          { t:"Homeostasis: a change away from the set point is corrected by negative feedback", ok:true, why:"The dip is the change; the quick return is negative feedback at work." },
          { t:"Homeostasis failed, because the pressure changed", why:M1 },
          { t:"Positive feedback, because the pressure changed", why:M2 },
          { t:"The set point moved down when the person stood", why:"Pressure came back to the same normal range." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"In the loop that cools the body by sweating, what is the <strong>effector</strong>?", options:[
          { t:"Sweat glands", ok:true, why:"They act to change body temperature." },
          { t:"Thermoreceptors in the skin", why:"They detect the change." },
          { t:"The hypothalamus", why:"It’s the control centre." },
          { t:"Evaporation of sweat", why:"That’s the response, not a structure." }] },
        b:{ prompt:"In the loop that controls blood CO₂, what is the <strong>receptor</strong>?", options:[
          { t:"Chemoreceptors", ok:true, why:"They detect the rise in CO₂." },
          { t:"The respiratory centre in the medulla", why:"That’s the control centre." },
          { t:"The diaphragm", why:"It’s an effector." },
          { t:"Faster breathing", why:"That’s the response." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which is an example of <strong>positive</strong> feedback?", options:[
          { t:"Oxytocin strengthening uterine contractions during childbirth", ok:true, why:"Stronger contractions increase the stretch, which releases more oxytocin: the response amplifies the change." },
          { t:"Sweating when the body is hot", why:"That opposes the change: negative." },
          { t:"Shivering when the body is cold", why:"Negative: it raises a falling temperature." },
          { t:"Releasing ADH when the blood is too concentrated", why:"Negative: it restores water balance." }] },
        b:{ prompt:"Which is an example of <strong>positive</strong> feedback?", options:[
          { t:"Platelets at a cut releasing chemicals that attract more platelets", ok:true, why:"Each platelet that arrives brings more: the response amplifies the change until the cut is sealed." },
          { t:"Insulin release after a meal", why:"Negative: it lowers rising glucose." },
          { t:"Faster breathing when CO₂ rises", why:"Negative: it lowers the rising CO₂." },
          { t:"Arterioles narrowing when blood pressure falls", why:"Negative: it raises the falling pressure." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"A patient’s baroreceptors are damaged. They stand up quickly. Predict what happens and why.", options:[
          { t:"Blood pressure stays low longer, because the control centre isn’t told it fell", ok:true, why:"With no receptor signal, the cardiovascular centre doesn’t act, so nothing corrects the drop." },
          { t:"Pressure rises above normal because the heart works harder", why:"Nothing tells the heart to work harder." },
          { t:"Pressure recovers normally because the heart senses pressure itself", why:M3 },
          { t:"Pressure falls further because positive feedback takes over", why:"A missing receptor means no correction, not a + loop." }] },
        b:{ prompt:"The nerve from the respiratory centre to the diaphragm is damaged. The person exercises. Predict what happens to blood CO₂ and why.", options:[
          { t:"CO₂ rises and stays high, because the effector can’t respond even though the change is detected", ok:true, why:"The chemoreceptors detect the rise, but the diaphragm never gets the signal to act." },
          { t:"CO₂ stays normal because the chemoreceptors still work", why:"Detecting isn’t enough; something must act." },
          { t:"CO₂ falls because the receptors over-react", why:"The signal can’t reach the diaphragm." },
          { t:"CO₂ rises, then the receptors bring it down by themselves", why:M3 }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"After a disturbance, a variable returns toward its set point, passes it, and swings back and forth several times before settling. Which loop feature best explains this?", options:[
          { t:"A strong response combined with a delay", ok:true, why:M6 },
          { t:"A damaged receptor", why:"The variable wouldn’t return at all." },
          { t:"Positive feedback", why:"The variable would run away, not settle." },
          { t:"A very weak response", why:"A weak response is slow but doesn’t overshoot." }] },
        b:{ prompt:"After a disturbance, a variable creeps back to its normal range over a long time and never passes the set point. Which loop feature best explains this?", options:[
          { t:"A weak response with little delay", ok:true, why:"Each step corrects only a little of the gap, so it’s slow but never overshoots." },
          { t:"A strong response with a long delay", why:"That would overshoot." },
          { t:"Positive feedback", why:"The variable wouldn’t return." },
          { t:"A blocked effector", why:"The variable wouldn’t return at all." }] } },
      { id:"t3", cat:"T", goal:[2, 3],
        a:{ prompt:"When the centre of a honeybee hive rises above about 35 °C, workers fan their wings at the entrance and spread water droplets; when it cools, they stop. Which describes this?", options:[
          { t:"Negative feedback: the bees act as effectors that move the temperature back toward the set point", ok:true, why:"Fanning and evaporating water oppose the rise in temperature." },
          { t:"Positive feedback, because more bees fan as it gets hotter", why:"More effort is used, but its effect opposes the change." },
          { t:"Not feedback, because no hormone is involved", why:"Feedback can run on behaviour." },
          { t:"The fanning is the stimulus", why:"The rise in temperature is the stimulus." }] },
        b:{ prompt:"A desert lizard moves into shade when its body temperature rises above 38 °C and back into the sun when it drops below 32 °C. Which describes this?", options:[
          { t:"Negative feedback through behaviour; the lizard’s muscles carry out the response", ok:true, why:"Each move opposes the change, keeping the temperature between 32 °C and 38 °C." },
          { t:"Not homeostasis, because the lizard can’t make its own heat", why:"Behaviour still keeps the temperature in a range." },
          { t:"Positive feedback, because the lizard keeps moving", why:"Each move opposes the change." },
          { t:"The sun is the control centre", why:"The lizard’s brain is." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of why positive feedback can’t keep a variable stable?", options:[
          { t:"“It amplifies a change, pushing the variable further from where it started, so it needs an outside event to end it.”", ok:true, why:"It names the direction (amplifying) and why an end event is needed." },
          { t:"“It is slower than negative feedback.”", why:"Speed isn’t the issue; direction is." },
          { t:"“It only happens when you are ill.”", why:"Childbirth is healthy positive feedback." },
          { t:"“It has no receptor.”", why:"It has all five parts." }] },
        b:{ prompt:"Which is the best explanation of how negative feedback keeps blood pressure stable?", options:[
          { t:"“When pressure changes, receptors signal the control centre, which makes effectors change pressure the opposite way until it is back in range.”", ok:true, why:"It names the parts in order and says the change is reversed until pressure is back in range." },
          { t:"“Negative feedback stops pressure from ever changing.”", why:M1 },
          { t:"“The heart senses pressure and adjusts itself.”", why:M3 },
          { t:"“Negative feedback lowers pressure whenever it is measured.”", why:M2 }] } },
      { id:"c2", cat:"C", goal:[2, 6],
        a:{ prompt:"Which flow chart correctly shows the response to a rise in blood CO₂?", options:[
          { t:"↑ CO₂ → chemoreceptors → respiratory centre (medulla) → diaphragm and rib muscles → faster, deeper breathing → CO₂ falls", ok:true, why:"Detect, decide, act, and the response opposes the rise." },
          { t:"↑ CO₂ → diaphragm → respiratory centre → chemoreceptors → faster breathing → CO₂ falls", why:"The order of detect, decide, act is scrambled." },
          { t:"↑ CO₂ → chemoreceptors → respiratory centre → diaphragm → slower breathing → CO₂ rises further", why:"That would amplify the change." },
          { t:"↑ CO₂ → hormone in the blood → every cell → faster breathing → CO₂ falls", why:"This loop runs on nerves." }] },
        b:{ prompt:"Which flow chart correctly shows the response to a fall in blood pressure?", options:[
          { t:"↓ pressure → baroreceptors → cardiovascular centre (medulla) → heart and arterioles → faster heart rate, narrower arterioles → pressure rises", ok:true, why:"Detect, decide, act, and the response opposes the fall." },
          { t:"↓ pressure → heart → cardiovascular centre → baroreceptors → pressure rises", why:"The order of detect, decide, act is scrambled. " + M3 },
          { t:"↓ pressure → baroreceptors → cardiovascular centre → heart → slower heart rate → pressure falls further", why:"That would amplify the change." },
          { t:"↓ pressure → pancreas → insulin → pressure rises", why:M7 }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A patient takes a medicine that weakens the heart’s response to nerve signals. Why might they feel dizzy when standing up quickly?", options:[
          { t:"The effector can’t respond strongly, so pressure takes longer to recover and the brain briefly gets less blood", ok:true, why:"The receptors and control centre still work, but the weakened effector corrects slowly." },
          { t:"The medicine damages the baroreceptors", why:"It acts on the heart’s response, the effector." },
          { t:"Standing up makes pressure rise too high", why:"Standing makes it fall." },
          { t:"The control centre stops working", why:"It still sends signals; the heart responds weakly." }] },
        b:{ prompt:"A person loses a large amount of blood in an accident. Why does their heart rate rise?", options:[
          { t:"Pressure falls; baroreceptors signal the cardiovascular centre, which speeds the heart to raise pressure", ok:true, why:"The same negative-feedback loop that corrects standing up corrects blood loss." },
          { t:"Positive feedback: the damaged heart speeds itself up", why:M4 },
          { t:"The heart pumps faster to push the lost blood out", why:"That would make things worse; the loop corrects pressure." },
          { t:"The blood is warmer after an accident", why:"Temperature isn’t the stimulus here." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A student wants to test whether standing up changes blood pressure. Which plan is the fairest test?", options:[
          { t:"Measure the same people seated and then 30 s after standing, at the same time of day, several times each", ok:true, why:"Only posture changes, and repeats make the result reliable." },
          { t:"Measure one group seated and a different group standing", why:"Two groups differ in more than posture." },
          { t:"Measure one person once seated and once standing", why:"One reading each can’t show a reliable pattern." },
          { t:"Measure seated in the morning and standing at night", why:"Time of day changes too." }] },
        b:{ prompt:"A student wants to test whether slow breathing lowers heart rate. Which plan is the fairest test?", options:[
          { t:"Measure the same people before and after 2 min of slow breathing, seated, and compare with people who sit quietly for 2 min", ok:true, why:"Before-and-after readings plus a comparison group that only sits quietly isolate the slow breathing." },
          { t:"Measure heart rate only after slow breathing", why:"There’s nothing to compare it with." },
          { t:"Compare athletes who breathe slowly with non-athletes who don’t", why:"Fitness differs too." },
          { t:"Let each person choose whether to try slow breathing", why:"The groups may differ in many ways." }] } }
    ]
  },
  task:{
    title:"Steady breathing", summary:"Steady breathing",
    statement:"<p>Design a breathing-control loop that brings blood CO₂ back to normal after exercise without over-correcting. There’s more than one design that works. Can you find them all?</p>" +
      '<ol class="ho-conds"><li>The receptor can detect CO₂.</li><li>The control centre is the one that controls breathing.</li><li>The effector can change breathing.</li><li>The loop is negative feedback.</li><li>After the disturbance, CO₂ is back in the normal range (35–45 mmHg) within 4 s and stays there.</li><li>CO₂ never falls more than 2 mmHg below the set point (40 mmHg).</li></ol>',
    inputs:{ rec:"Receptor", cc:"Control centre", eff:"Effector", sign:"Sign", str:"Strength", del:"Delay" },
    recs:[{ id:"chemo", t:"Chemoreceptors" }, { id:"thermo", t:"Thermoreceptors" }, { id:"baro", t:"Baroreceptors" }],
    ccs:[{ id:"resp", t:"Respiratory centre (medulla)" }, { id:"hypo", t:"Hypothalamus" }, { id:"cardio", t:"Cardiovascular centre" }],
    effs:[{ id:"dia", t:"Diaphragm and rib muscles" }, { id:"sweat", t:"Sweat glands" }, { id:"heart", t:"Heart" }],
    modelNote:"Teaching model, not clinical data: C(t + 1) = C(t) − g × [C(t − d) − 40], starting at 55 mmHg at t = 0 and 40 before; g = 1/4, 1/2 or 1. A loop with a wrong part can’t correct, so CO₂ stays at 55.",
    checks:["Receptor detects CO₂", "Breathing control centre", "Effector changes breathing", "Negative feedback", "In range within 4 s, and stays", "No big over-correction"],
    tips:["Which receptors respond to chemicals in the blood?", "Breathing is controlled in the medulla.", "Which muscles move air?", "The response must oppose the rise.",
      "Too weak or too slow: try a stronger response or a shorter delay.", "It dips too low: a delay with a strong response over-corrects."],
    success:"Your loop holds CO₂ steady!",
    explainPrompt:"Explain why some strength and delay combinations failed, using what happened to the CO₂ line.",
    vocab:"Use the words receptor, effector, negative feedback, delay and overshoot.",
    after3:"Every design that works is either gentle or quick to sense. A delay forces a gentler response.",
    afterAt:4
  },
  cards:[
    ["Homeostasis", "Keeping internal conditions within a narrow range around a set point as conditions change."],
    ["Set point and normal range", "The target value and the band of acceptable values around it (e.g. blood pressure model: 90; 80–100 mmHg)."],
    ["Five parts of a loop", "Stimulus → receptor → control centre → effector → response."],
    ["Receptor", "Detects a change (e.g. baroreceptors, chemoreceptors, thermoreceptors)."],
    ["Effector", "A muscle or gland that acts to change the variable."],
    ["Negative feedback", "The response opposes the change. Example: faster breathing lowers rising CO₂."],
    ["Positive feedback", "The response amplifies the change until an outside event ends it. Example: oxytocin in childbirth."],
    ["Delay + strong response", "Overshoot and oscillation."],
    ["Nervous control", "Electrical impulses along neurons: fast, brief, targeted."],
    ["Endocrine control", "Hormones in the blood: slower, longer-lasting, reach all cells with the receptor."],
    ["Posterior pituitary", "Releases ADH and oxytocin, made by hypothalamus neurons."],
    ["Anterior pituitary", "Releases its own hormones (TSH, FSH, LH, growth hormone) when hypothalamus releasing hormones arrive."]
  ]
};
