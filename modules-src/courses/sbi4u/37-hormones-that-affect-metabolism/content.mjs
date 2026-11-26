// SBI4U 37 Hormones That Affect Metabolism. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/37-hormones-that-affect-metabolism.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "Low T₃/T₄ means less negative feedback, so TSH <strong>rises</strong>.";
const M2 = "A goitre is an enlarged gland. It can come with low hormone (iodine deficiency) or high hormone (Graves’).";
const M3 = "Extra hormone triggers negative feedback: the body’s own production falls first.";
const M4 = "The thyroid answers to TSH from the pituitary, which answers to TRH from the hypothalamus.";
const M5 = "Epinephrine is seconds-to-minutes fight or flight; cortisol is hours-long stress response.";
const M6 = "Even the body’s own hormones cause harm at unnatural levels: thick blood from EPO, shrunken testes from steroids.";
const M7 = "Linked results suggest a cause; a mechanism or controlled experiment is needed to support it.";

const MATCH_L = ["TRH", "TSH", "T₄ and T₃", "Growth hormone", "ACTH", "Cortisol", "Epinephrine", "EPO"];
const MATCH_R = [
  "Hypothalamus; tells the anterior pituitary to release TSH",
  "Anterior pituitary; tells the thyroid to release T₃/T₄",
  "Thyroid; raise metabolic rate, needed for growth and brain development",
  "Anterior pituitary; growth of bone and muscle, protein synthesis",
  "Anterior pituitary; tells the adrenal cortex to release cortisol",
  "Adrenal cortex; raises blood glucose in long-term stress, reduces inflammation",
  "Adrenal medulla; fight or flight in seconds",
  "Kidneys; tells bone marrow to make red blood cells"
];

export default {
  id:"37-hormones-that-affect-metabolism",
  kind:"topic",
  title:"Hormones that affect metabolism",
  topic:"Hormones That Affect Metabolism",
  readyTopic:"hormones that affect metabolism",
  hero:{
    eq:'<span class="hm-heq">TRH → <span class="hm-c-tsh">TSH</span> → <span class="hm-c-t">T₄, T₃</span> → metabolic rate ↑</span>',
    eqLabel:"TRH leads to TSH, which leads to T4 and T3, which raise the metabolic rate",
    eqSize:"sm",
    headline:"One gland sets your pace, and two others set the gland",
    text:"How fast your cells burn fuel depends on <strong>thyroid hormones</strong>, T₄ and T₃, which need <strong>iodine</strong> to be made. But the thyroid doesn’t decide alone: the <strong>hypothalamus</strong> and the <strong>anterior pituitary</strong> run it with <strong>negative feedback</strong>. In this module you’ll break the chain in different places and learn to read the clues. Then you’ll look at hormones athletes misuse, and why the same feedback makes them risky.",
    fig:{ html:'<div class="hm-hero" id="hm-hero" role="img" aria-label="A vertical chain: hypothalamus (TRH), anterior pituitary (TSH), thyroid (T4, T3), body cells (metabolic rate). TRH dots flow to the pituitary, TSH dots travel to the thyroid, which glows and releases violet T3 and T4 dots. The body cells’ metabolic-rate bar rises to normal. Two curved minus arrows from T3 and T4 back to the pituitary and hypothalamus pulse, and the TRH and TSH flows thin out. Caption: Enough hormone? The chain eases off."></div>' }
  },
  goals:[
    "I can trace the thyroid axis (TRH → TSH → T₃/T₄) and explain its negative feedback.",
    "I can explain why iodine deficiency and a damaged thyroid both cause low T₃/T₄ and high TSH, and how a goitre forms.",
    "I can use TSH and T₃/T₄ results to identify where a thyroid problem lies.",
    "I can compare epinephrine, cortisol and growth hormone by source, trigger, effect and time scale.",
    "I can evaluate the benefits and risks of using hormones to enhance performance, using feedback and physiology."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Feedback and the pituitary", goal:1,
          prompt:"Which part of the pituitary releases its own hormones when releasing hormones arrive from the hypothalamus?",
          options:[
            { t:"The anterior pituitary", ok:true, why:"Releasing hormones reach it through tiny blood vessels." },
            { t:"The posterior pituitary", why:"It releases hormones made by hypothalamus neurons (ADH, oxytocin)." },
            { t:"Both equally", why:"Only the anterior lobe responds to releasing hormones." },
            { t:"Neither; the hypothalamus releases everything itself", why:"The pituitary releases TSH, FSH and others." }],
          hints:["Recall module 34’s two pathways.", "One lobe is controlled by blood-borne releasing hormones.", "Anterior."] },
        { id:"w2", skill:"Feedback and the pituitary", goal:1,
          prompt:"A hormone’s level rises and this reduces the signal that released it. What is this?",
          options:[
            { t:"Negative feedback", ok:true, why:"The response turns down its own trigger." },
            { t:"Positive feedback", why:"That would increase the signal." },
            { t:"No feedback", why:"The output changes the input, so it’s feedback." },
            { t:"A reflex", why:"A reflex is a fast nerve pathway." }],
          hints:["Does the output boost or reduce its trigger?", "Reduce.", "Negative feedback."] },
        { id:"w3", skill:"Metabolism", goal:1,
          prompt:"If cells carry out more cellular respiration, what else increases?",
          options:[
            { t:"Heat production and oxygen use", ok:true, why:"Respiration uses O₂ and releases heat." },
            { t:"Glucose storage", why:"More respiration uses glucose up." },
            { t:"The amount of CO₂ in the air you breathe in", why:"You breathe <em>out</em> more CO₂." },
            { t:"Body temperature falls", why:"More respiration makes more heat." }],
          hints:["What are respiration’s inputs and outputs?", "O₂ in; CO₂, water, ATP and heat out.", "More heat, more O₂ used."] },
        { id:"w4", skill:"Metabolism", goal:4,
          prompt:"Which change would give muscles more fuel quickly during an emergency?",
          options:[
            { t:"Breaking down glycogen to release glucose into the blood", ok:true, why:"Stored glucose becomes available in seconds." },
            { t:"Building more glycogen", why:"That stores glucose away." },
            { t:"Slowing the heart", why:"Fuel and O₂ need faster delivery." },
            { t:"Making new muscle protein", why:"That’s slow, and builds rather than fuels." }],
          hints:["Where is glucose stored?", "As glycogen in the liver and muscle.", "Break it down."] },
        { id:"w5", skill:"Reading lab-style data", goal:3,
          prompt:"A lab report gives a patient’s value as ‘250% of the normal mean’. What does that mean?",
          options:[
            { t:"2.5 times the normal mean value", ok:true, why:"250% = 2.5 ×." },
            { t:"250 units above normal", why:"Percent compares; it isn’t units added." },
            { t:"Slightly above normal", why:"2.5 times is far above." },
            { t:"Below normal", why:"Above 100% is higher than normal." }],
          hints:["100% is normal.", "250 ÷ 100.", "2.5 times normal."] },
        { id:"w6", skill:"Reading lab-style data", goal:3,
          prompt:"Two people both have a fast heart rate. Person X has high thyroid hormone; person Y has normal thyroid hormone but has just had a scare. Which statement is best supported?",
          options:[
            { t:"The same symptom can have different causes, so a test is needed to tell them apart", ok:true, why:"Symptoms alone don’t identify a cause." },
            { t:"Both must have a thyroid problem", why:"Y’s thyroid hormone is normal." },
            { t:"Neither has a fast heart rate for a real reason", why:"Both have real causes." },
            { t:"Y must have a thyroid problem too", why:"Y’s tests are normal." }],
          hints:["Are their causes the same?", "One is thyroid, one is a scare.", "Same symptom, different causes."] }
      ],
      refreshers:{
        "Feedback and the pituitary":"The hypothalamus sends releasing hormones to the anterior pituitary, which releases hormones that act on other glands. A hormone that reduces its own trigger is negative feedback.",
        "Metabolism":"Metabolic rate is how fast cells use energy. Faster respiration uses more O₂ and glucose and releases more heat. Glycogen breakdown releases glucose quickly.",
        "Reading lab-style data":"Percent of normal: 100% is typical, 200% is double. The same symptom can have several causes, so test results guide the explanation."
      }
    }
  },
  explore:{
    heading:"Thyroid axis simulator",
    intro:"Change the iodine, the gland’s condition and any hormone pills. Watch TRH, TSH and T₃/T₄ settle, then read the results like a lab report.",
    modes:[["axis", "Thyroid axis"], ["time", "Stress and growth timeline"]],
    iodine:[["vlow", "Very low"], ["low", "Low"], ["adeq", "Adequate"]],
    conds:[["healthy", "Healthy"], ["dam", "Damaged"], ["graves", "Graves’"]],
    condNote:{ healthy:"Healthy gland.", dam:"Damaged: makes less hormone.", graves:"Graves’: antibodies stimulate the gland." },
    pills:[0, 25, 50, 60, 75, 100, 125, 150],
    symptoms:{
      low:"Low: tired, cold, weight gain, slow heart rate",
      normal:"Normal",
      high:"High: weight loss, heat intolerance, fast heart rate, restlessness"
    },
    feedback:{
      weak:"Weak: T₃/T₄ too low to switch TSH off",
      even:"Steady: T₃/T₄ at 100% hold TSH at the gland’s share",
      strong:"Strong: high T₃/T₄ switch TSH off"
    },
    events:[
      { id:"wake", t:"Morning wake-up 07:00", at:60 },
      { id:"scare", t:"Sudden scare 10:00", at:241 },
      { id:"exam", t:"Exam 13:00–16:00", at:510 },
      { id:"sleep", t:"Deep sleep 23:00–01:00", at:1080 }
    ],
    modelNote:"<strong>Model values</strong>, in % of normal (steady state). The pituitary aims for a total of 100% T₃/T₄; TSH can rise to at most 400%. Timeline values are relative to each hormone’s own baseline. Every pill setting is a model, not dosing advice.",
    aha:"TSH moves opposite to T₃/T₄ when the pituitary is working; the pattern of TSH, T₃/T₄ and goitre points to the cause; pills shut down your own gland before they push hormone levels up.",
    predIntro:"Make a prediction first. Then the simulator will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"axis", io:"adeq", cond:"healthy", pill:0 }, to:{ io:"vlow" },
        prompt:"<span class=\"muted\">Healthy gland, adequate iodine, no pill: everything at 100%. Change: iodine to Very low.</span> Predict TSH and T₃/T₄.",
        options:[{ t:"T₃/T₄ falls to 30% and TSH rises to its maximum", ok:true }, { t:"T₃/T₄ stays at 100% because TSH makes up for it" }, { t:"TSH falls with T₃/T₄" }, { t:"Both stay normal" }],
        reveal:"The TSH flow thickens, the gland swells, and the gauge drops to 30.",
        explain:"No iodine, no hormone. With almost no T₃/T₄ to switch it off, TSH climbs and the gland grows: a goitre." },
      { id:"p2", start:{ mode:"axis", io:"adeq", cond:"healthy", pill:0 }, to:{ pill:100 },
        prompt:"<span class=\"muted\">Healthy gland, adequate iodine. Change: pill from 0 to 100.</span> What happens to the person’s own thyroid output and the total?",
        options:[{ t:"Own output falls to 0; total stays at 100%", ok:true }, { t:"Total doubles to 200%" }, { t:"Own output stays at 100%" }, { t:"TSH rises" }],
        reveal:"The TSH flow fades to nothing and the gland stops; the gauge holds at 100.",
        explain:"The pill supplies the hormone, so negative feedback shuts TSH off and the gland rests." },
      { id:"p3", start:{ mode:"axis", io:"adeq", cond:"healthy", pill:0 }, to:{ cond:"graves" },
        prompt:"<span class=\"muted\">Graves’, adequate iodine, no pill.</span> Antibodies are driving the thyroid. Predict TSH.",
        options:[{ t:"Close to 0", ok:true }, { t:"Very high" }, { t:"Normal" }, { t:"It can’t be predicted" }],
        reveal:"The total climbs to 200, TSH drops to 0, and the gland enlarges.",
        explain:"High T₃/T₄ switches the pituitary off, but the antibodies keep the gland going anyway." },
      { id:"p4", start:{ mode:"time", tmin:239 }, sweep:true,
        prompt:"<span class=\"muted\">Timeline mode at 09:59.</span> A sudden scare at 10:00. Which hormone rises first and falls back fastest?",
        options:[{ t:"Epinephrine", ok:true }, { t:"Cortisol" }, { t:"Growth hormone" }, { t:"Thyroxine" }],
        reveal:"The epinephrine curve spikes and falls by 10:10; cortisol barely moves until the afternoon exam.",
        explain:"Epinephrine is released by nerve signals to the adrenal medulla within seconds. Cortisol works over hours." }
    ],
    chalIntro:"Use the simulator to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:2,
        prompt:"Using <strong>only</strong> the iodine setting (healthy gland, no pill), cause a goitre. What happens to TSH?",
        why:"With Low or Very low iodine the gland can’t make 100%, so feedback stays weak: TSH climbs to its 400% maximum and keeps stimulating the gland, which enlarges.",
        wrong:{ only:"Use the iodine setting only.", adeq:"With enough iodine the gland keeps up; TSH stays normal.", mode:"Switch to <strong>Thyroid axis</strong> mode first." },
        hints:["What does the thyroid need to make T₄?", "Less iodine, less hormone, weaker feedback.", "Low or Very low."] },
      { id:"tc2", goal:3,
        prompt:"A patient’s gland is Damaged (adequate iodine). Choose a pill dose that brings total T₃/T₄ to exactly 100% <strong>and</strong> keeps TSH below 100% (no goitre).",
        why:"The damaged gland makes at most 40%, so the pill must cover at least 60%. At 60, 75 or 100 the total is 100% and TSH settles at the gland’s share (40%, 25% or 0%).",
        wrong:{ p50:"Total 90% is in the normal range, but TSH is at maximum and the gland is enlarging.", p125:"Total 125%: too much; hyperthyroid symptoms, and TSH is shut off.",
          setup:"Set the gland to <strong>Damaged</strong> with <strong>Adequate</strong> iodine first.", mode:"Switch to <strong>Thyroid axis</strong> mode first." },
        hints:["The damaged gland can make at most 40%.", "The pill must cover at least 60%.", "60, 75 or 100."] },
      { id:"tc3", goal:[2, 3], stretch:true,
        prompt:"A lab report reads: <strong>TSH 0%, total T₃/T₄ 200%, gland enlarged</strong>. Set the model to match it. One Check only.",
        why:"Graves’ with adequate iodine and no pill: antibodies drive the gland to 200%, and the high hormone switches TSH off.",
        wrong:{ pill150:"TSH 0 and high hormone, but the total is 150% and the gland isn’t enlarged. Pills don’t cause a goitre.",
          lowio:"That gives <em>high</em> TSH.", graveslow:"Total only 60%: Graves’ needs iodine to make hormone.", mode:"Switch to <strong>Thyroid axis</strong> mode first.",
          other:"Compare your lab card with the report: TSH 0%, total 200%, enlarged." },
        hints:["TSH 0 means the pituitary is being switched off by high hormone.", "What can enlarge a gland while TSH is 0?", "Antibodies (Graves’) with enough iodine: 200%."] }
    ]
  },
  part3:{
    slug:"performance", name:"Performance",
    heading:"Hormones and performance",
    intro:"Some athletes take hormones to train harder or recover faster. Visit four evidence stations, then build an argument from the evidence, not from opinion.",
    steroid:{
      title:"Station 1: anabolic steroids", panel:"Check it with data",
      mech:"Synthetic testosterone-like molecules enter muscle cells, bind receptors and switch on genes that increase protein synthesis.",
      play:"Play the mechanism", replay:"Play it again",
      dataIntro:"An athlete’s blood and sperm tests before, during and after steroid use, as % of the athlete’s own pre-use levels.",
      head:["Measure", "Before", "Week 8 of use", "3 months after stopping"],
      rows:[["LH", 100, 15, 70], ["Own testosterone", 100, 20, 60], ["Sperm count", 100, 25, 55]],
      note:"Model values chosen to show negative feedback and partial recovery; real results vary from person to person.",
      askRow:"Tap the row that shows negative feedback.",
      askCol:"Tap the column that shows recovery taking time.",
      rowFb:[
        { ok:true, t:"Right. High steroid levels feed back on the hypothalamus and pituitary, so LH drops to 15%. The testes lose their signal." },
        { t:"Own testosterone falls, but only because its signal fell. Which row is the brain’s signal to the testes?" },
        { t:"Sperm count falls as a result, further down the chain. Which row is the brain’s signal to the testes?" }],
      colFb:[
        { t:"That’s the starting point: every value is 100%." },
        { t:"That shows the effect of use. Which column shows values still below 100 after the steroids stop?" },
        { ok:true, t:"Right. Three months after stopping, LH is back to only 70%, testosterone 60% and sperm count 55%: the axis takes months to recover." }],
      risksTitle:"Other risks",
      risks:["Heart disease (cholesterol changes)", "Liver damage", "Acne", "Mood changes", "In females, effects such as voice deepening that may not reverse"],
      link:"Module 38 follows the testosterone feedback loop in detail."
    },
    epo:{
      title:"Station 2: EPO",
      intro:"Erythropoietin (EPO) from the kidneys tells bone marrow to make red blood cells.",
      levels:[["none", "None", 45, "normal"], ["mod", "Moderate", 55, "↑"], ["high", "High", 60, "↑"]],
      label:"Extra EPO",
      zone:"clot risk",
      note:"Model values: the share of blood that is red cells."
    },
    gh:{
      title:"Station 3: growth hormone",
      claim:"Builds muscle in healthy adults.",
      evidence:"Mostly increases water retention and lean mass, with little proven strength gain.",
      risks:"Joint pain, enlarged hands and jaw (acromegaly-like), higher blood glucose."
    },
    rules:{
      title:"Station 4: rules and fairness",
      // VERIFY: current details of Canadian anti-doping arrangements (CCES, World Anti-Doping Code) before release.
      items:[
        "Anti-doping in Canada is run by the Canadian Centre for Ethics in Sport under world anti-doping rules.",
        "After the 1988 Seoul Olympics doping case, Canada held the Dubin Inquiry into drug use in sport.",
        "<strong>Therapeutic use exemptions:</strong> an athlete with type 1 diabetes may use insulin under medical care."
      ]
    },
    cer:{
      title:"Build the argument",
      prompt:"Should a 17-year-old cyclist use EPO to train harder?",
      how:"Choose one claim, then tap the evidence and reasoning chips that support it. Press <strong>Check my argument</strong>.",
      claims:[
        { id:"c1", t:"No: the cyclist shouldn’t use EPO.", good:true },
        { id:"c2", t:"Yes: it would let them train harder." },
        { id:"c3", t:"Yes, as long as nobody finds out." }],
      evidence:[
        { id:"e1", t:"EPO raises red cells from about 45% to 60% of the blood (Station 2).", kind:"plain" },
        { id:"e2", t:"Above 55% red cells, blood thickens into the clot-risk zone (Station 2).", kind:"risk" },
        { id:"e3", t:"EPO is banned in sport; an exemption needs a documented medical need (Station 4).", kind:"rule" },
        { id:"e4", t:"Steroid users’ LH fell to 15% of normal (Station 1).", kind:"off" },
        { id:"e5", t:"Everyone at the top level does it.", kind:"opinion" }],
      reasoning:[
        { id:"r1", t:"Thicker blood makes clots and strokes more likely, so the health risk outweighs the training gain.", kind:"risk" },
        { id:"r2", t:"Using a banned drug is unfair to other riders and can end a career with a ban.", kind:"rule" },
        { id:"r3", t:"EPO is natural to the body, so extra EPO is safe.", kind:"opinion" },
        { id:"r4", t:"If it helps you win, it’s worth it.", kind:"opinion" }],
      fb:{
        noClaim:"Choose a claim first.",
        noEv:"Add at least one evidence chip and one reasoning chip.",
        onlyOpinion:"Those chips are opinions, not evidence: ‘everyone does it’ doesn’t show what EPO does to the body. Use the stations.",
        opinion:"Your build includes an opinion chip. Opinions aren’t evidence: take it out and lean on the station data.",
        badClaim:"Your evidence points one way and your claim the other. Thick blood, clots and a ban are reasons <em>not</em> to use EPO.",
        off:"The steroid data are about a different hormone. Choose evidence about EPO.",
        noRisk:"Add a physiological risk: what does extra EPO do to the blood?",
        noRule:"Add a fairness or rule point: what do anti-doping rules say?",
        good:"✓ A strong argument: a clear claim, a physiological risk (clotting) and a fairness or rule point, with no opinion chips."
      }
    },
    quickCheck:{
      title:"Quick check", summary:"Performance quick check",
      items:[
        { id:"q1", goal:5, prompt:"Why can steroid use shrink the testes?",
          choices:[
            { t:"Negative feedback lowers LH and FSH", ok:true, fb:"Right. The brain senses high androgen levels and stops signalling the testes." },
            { t:"Steroids poison the testes directly", fb:"The brain senses high androgen levels and stops signalling the testes." },
            { t:"Steroids raise LH", fb:"The brain senses high androgen levels and stops signalling the testes." },
            { t:"The muscles use up testosterone", fb:"The brain senses high androgen levels and stops signalling the testes." }] },
        { id:"q2", goal:5, prompt:"EPO improves endurance because…",
          choices:[
            { t:"more red blood cells carry more O₂", ok:true, fb:"Right. EPO acts on bone marrow, so more red blood cells carry O₂ to muscles." },
            { t:"muscles get bigger", fb:"EPO acts on bone marrow." },
            { t:"it lowers heart rate", fb:"EPO acts on bone marrow." },
            { t:"it adds glucose to the blood", fb:"EPO acts on bone marrow." }] },
        { id:"q3", goal:5, prompt:"EPO’s main health risk is…",
          choices:[
            { t:"thicker blood and clots", ok:true, fb:"Right. More cells make blood more viscous." },
            { t:"low blood sugar", fb:"More cells make blood more viscous." },
            { t:"weak bones", fb:"More cells make blood more viscous." },
            { t:"fever", fb:"More cells make blood more viscous." }] },
        { id:"q4", goal:5, prompt:"Which is a fair reason an athlete may use a banned hormone?",
          choices:[
            { t:"A documented medical need, approved in advance", ok:true, fb:"Right. That’s a therapeutic use exemption." },
            { t:"They feel tired", fb:"A fair reason is a therapeutic use exemption: a documented medical need, approved in advance." },
            { t:"Others use it", fb:"A fair reason is a therapeutic use exemption: a documented medical need, approved in advance." },
            { t:"It’s natural to the body", fb:"A fair reason is a therapeutic use exemption: a documented medical need, approved in advance. " + M6 }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Hormone ↔ source and job", summary:"Hormone ↔ source and job", goal:[1, 4],
        instruction:"Match each hormone with its source and job.",
        leftTitle:"Hormone", rightTitle:"Source and job",
        left:MATCH_L.map(function(t, i){
          const it = { id:"l" + (i + 1), t:t };
          if (i === 4) it.hints = ["ACTH is ‘adreno-cortico-tropic’.", "It targets the adrenal cortex.", "Releases cortisol."];
          if (i === 7) it.hints = ["Which organ senses low oxygen in the blood?", "The kidneys.", "EPO → red blood cells."];
          return it;
        }),
        right:MATCH_R.map(function(t, i){ return { id:"r" + (i + 1), t:t }; }),
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{ "l2|r1":"TSH comes from the pituitary; TRH from the hypothalamus.", "l6|r7":"Cortisol is slow, long-term stress; epinephrine is the fast one.",
          "l3|r2":"The thyroid releases T₃/T₄; the pituitary releases TSH." },
        wrongDefault:"Match the gland first, then the job." },
      { id:"labs", type:"mc", title:"Read the lab results", summary:"Read the lab results", star:true, goal:[2, 3, 5],
        instruction:"Six sets of results. Choose the best explanation for each. Sets 3 to 6 are non-routine; the last two go beyond the Final Check.",
        items:[
          { id:"s1", goal:2, prompt:"Results: “TSH high, T₃/T₄ low, enlarged gland, low iodine in the diet.” What is the most likely cause?",
            options:[
              { t:"Iodine deficiency", ok:true, why:"High TSH with low hormone points to the thyroid, and the diet explains why: no iodine, no T₄. TSH keeps driving the gland, so it enlarges." },
              { t:"Graves’ disease", why:"Graves’ gives <em>high</em> T₃/T₄ and low TSH." },
              { t:"The pituitary isn’t making enough TSH", why:"Then TSH would be low, not high." },
              { t:"Too much thyroid hormone from pills", why:"Pills would raise T₃/T₄ and lower TSH." }] },
          { id:"s2", goal:3, prompt:"Results: “TSH very low, T₃/T₄ high, enlarged gland.” What is the most likely cause?",
            options:[
              { t:"Graves’ disease", ok:true, why:"Antibodies drive the gland: hormone is high, so feedback switches TSH off, and the gland enlarges anyway." },
              { t:"Iodine deficiency", why:"That raises TSH. " + M1 },
              { t:"Too much thyroid hormone from pills", why:"Pills suppress TSH without enlarging the gland." },
              { t:"The pituitary isn’t making enough TSH", why:"Then T₃/T₄ would be low too." }] },
          { id:"s3", goal:3, prompt:"Results: “TSH low, T₃/T₄ low, gland normal size.” What is the most likely cause?",
            options:[
              { t:"The pituitary isn’t making enough TSH", ok:true, why:"With a failing thyroid the pituitary would raise TSH. Low TSH with low hormone means the signal itself is missing." },
              { t:"The thyroid is damaged", why:"Then TSH would be high, trying to drive it." },
              { t:"Iodine deficiency", why:"That raises TSH. " + M1 },
              { t:"Graves’ disease", why:"That gives high T₃/T₄." }],
            hints:["If the thyroid were the problem, what would the pituitary do?", "Raise TSH.", "Low TSH with low hormone points to the pituitary."] },
          { id:"s4", goal:[3, 5], prompt:"Results: “TSH very low, T₃/T₄ high, gland normal size, and the person has been taking ‘metabolism-boosting’ pills bought online.” What is the most likely cause?",
            options:[
              { t:"Too much thyroid hormone from pills", ok:true, why:"The pills raise T₃/T₄, so feedback switches TSH off. With no TSH and no antibodies, nothing drives the gland to grow." },
              { t:"Graves’ disease", why:"Graves’ enlarges the gland; pills suppress TSH without a goitre." },
              { t:"Iodine deficiency", why:"That gives low T₃/T₄ and high TSH." },
              { t:"The pituitary is making too much TSH", why:"Then TSH would be high, not very low." }] },
          { id:"s5", goal:2, prompt:"A study of 12 regions finds that those with more iodized salt use have fewer goitres. Which conclusion is best?",
            options:[
              { t:"The link supports iodine preventing goitre, and with the known role of iodine in T₄ it justifies iodizing salt; the study alone doesn’t prove it", ok:true, why:"The correlation plus a known mechanism makes a strong case for action, while staying honest about what one study can show." },
              { t:"It proves salt cures all thyroid disease", why:"One correlation can’t prove a cause, and goitre isn’t the only thyroid disease. " + M7 },
              { t:"Salt causes goitre", why:"The link runs the other way: more iodized salt goes with fewer goitres." },
              { t:"The study shows nothing, because it’s only a correlation", why:"A link is evidence. With a known mechanism it supports action, even though it isn’t proof." }] },
          { id:"s6", goal:3, prompt:"<span class=\"tag\">Investigation</span> A tadpole experiment: group A gets thyroxine in its water, group B doesn’t; the same temperature, food and tank size. Group A becomes frogs in 20 days, group B in 45. What is the most valid conclusion?",
            options:[
              { t:"Thyroxine speeds up metamorphosis in these tadpoles", ok:true, why:"Thyroxine was the only difference, so it explains the faster change, but only for tadpoles like these." },
              { t:"Thyroxine is needed for growth in all animals", why:"The test was on tadpoles only; don’t over-generalize." },
              { t:"Temperature caused the difference", why:"Temperature was the same for both groups: it was controlled." },
              { t:"Thyroxine slows metamorphosis", why:"Group A, with thyroxine, changed sooner: 20 days vs 45." }],
            hints:["What was the one difference between groups?", "Thyroxine.", "So conclude only about tadpoles and thyroxine."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Vivian", goal:[2, 4, 5], how:"",
        instruction:"Vivian made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Explain how iodine deficiency causes a goitre.",
            steps:["Iodine is needed to make T₄ and T₃.", "Without iodine, T₃/T₄ levels fall.", "Low T₃/T₄ makes the pituitary release less TSH.", "So the thyroid grows."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 doesn’t follow from less TSH. The mistake is earlier."],
            fixes:[
              { t:"Low T₃/T₄ gives little negative feedback, so the pituitary releases <strong>more</strong> TSH, which keeps stimulating the thyroid to grow.", ok:true, why:M1 },
              { t:"Low T₃/T₄ makes the hypothalamus stop releasing TRH.", why:M1 },
              { t:"Low T₃/T₄ makes the thyroid store iodine.", why:"There’s no iodine to store." },
              { t:"Step 3 is correct.", why:"Less TSH would make the gland shrink, not grow. " + M1 }],
            hints:["What does low hormone do to negative feedback?", "It weakens it.", "TSH rises."] },
          { id:"e2", goal:5, task:"Explain what happens when a healthy person takes thyroid hormone pills to lose weight.",
            steps:["The pills add T₃/T₄ to the blood.", "The thyroid keeps making its usual amount, so the total is much higher.", "Metabolic rate rises a lot."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "This follows step 2. The mistake is earlier."],
            fixes:[
              { t:"Higher T₃/T₄ lowers TSH, so the person’s own thyroid makes less. Only doses above what the body normally makes push the total, and the symptoms, up.", ok:true, why:M3 },
              { t:"The thyroid makes more to keep up with the pills.", why:"Feedback works the other way. " + M3 },
              { t:"The pills have no effect because they’re digested.", why:"Thyroid hormone pills are absorbed and active." },
              { t:"Step 2 is correct.", why:"Negative feedback shuts the gland down. " + M3 }],
            hints:["What does extra hormone do to TSH?", "TSH falls.", "Own output falls."] },
          { id:"e3", goal:4, task:"Compare the body’s response to a near-miss on a bike and to a stressful exam week.",
            steps:["In the near-miss, nerve signals reach the adrenal glands.", "Cortisol is released within seconds, raising heart rate.", "During exam week, stress hormones stay raised for days.", "Long-term high cortisol can weaken immune responses."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 is correct.", "Step 4 is correct."],
            fixes:[
              { t:"<strong>Epinephrine</strong> from the adrenal medulla is released within seconds; cortisol from the adrenal cortex rises more slowly.", ok:true, why:M5 },
              { t:"Growth hormone is released within seconds.", why:"Growth hormone pulses mostly in deep sleep." },
              { t:"TSH is released within seconds.", why:"TSH isn’t the emergency hormone." },
              { t:"Step 2 is correct.", why:"Cortisol acts over hours, not seconds. " + M5 }],
            hints:["Which hormone is fight or flight?", "It comes from the adrenal medulla.", "Epinephrine."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the simulator: that pills shut the gland down, or that a goitre can come with low <em>or</em> high hormone?" },
      { id:"j2", q:"In your own words, why is TSH such a useful test result?" },
      { id:"j3", q:"Explain to a friend the difference between epinephrine and cortisol." },
      { id:"j4", q:"Which part of hormone feedback is still unclear to you? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which gland releases TSH?", options:[
          { t:"The anterior pituitary", ok:true, why:"TRH from the hypothalamus tells the anterior pituitary to release TSH." },
          { t:"The thyroid", why:"The thyroid responds to TSH. " + M4 },
          { t:"The hypothalamus", why:"It releases TRH." },
          { t:"The posterior pituitary", why:"It releases ADH and oxytocin." }] },
        b:{ prompt:"Which hormones raise the body’s metabolic rate?", options:[
          { t:"T₄ and T₃", ok:true, why:"The thyroid hormones raise cellular respiration in body cells." },
          { t:"TSH, acting on all body cells directly", why:"TSH acts on the thyroid. " + M4 },
          { t:"ADH", why:"ADH controls water reabsorption." },
          { t:"TRH", why:"TRH acts on the pituitary." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"Which hormone drives the body’s fast fight-or-flight response?", options:[
          { t:"Epinephrine", ok:true, why:"Nerve signals release it from the adrenal medulla within seconds." },
          { t:"Cortisol", why:"Cortisol is the slower, long-term stress hormone. " + M5 },
          { t:"Growth hormone", why:"It drives growth." },
          { t:"Thyroxine", why:"It sets the long-term metabolic rate." }] },
        b:{ prompt:"Which hormone helps the body through long-term stress by raising blood glucose from proteins and fats?", options:[
          { t:"Cortisol", ok:true, why:"Cortisol from the adrenal cortex (via ACTH) works over hours." },
          { t:"Epinephrine", why:"Epinephrine acts in seconds, mainly via glycogen. " + M5 },
          { t:"TSH", why:"It acts on the thyroid." },
          { t:"EPO", why:"It acts on bone marrow." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"Iodine is needed to make…", options:[
          { t:"T₄ and T₃", ok:true, why:"The numbers count iodine atoms: T₄ has four, T₃ three." },
          { t:"TSH", why:"TSH is a protein made in the pituitary." },
          { t:"TRH", why:"TRH is made in the hypothalamus." },
          { t:"Growth hormone", why:"Iodine is specific to thyroid hormones." }] },
        b:{ prompt:"In the thyroid axis, which hormones give negative feedback to the hypothalamus and pituitary?", options:[
          { t:"T₄ and T₃", ok:true, why:"High T₃/T₄ switch off TRH and TSH; low T₃/T₄ let them rise." },
          { t:"TSH", why:"TSH acts on the thyroid." },
          { t:"TRH", why:"TRH is the first signal." },
          { t:"Iodine", why:"Iodine is a raw material, not a hormone." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"A person’s diet has almost no iodine for months. Predict T₃/T₄, TSH and the gland.", options:[
          { t:"T₃/T₄ low; TSH high; the gland enlarges", ok:true, why:"No iodine, little hormone, weak feedback: TSH climbs and keeps stimulating the gland." },
          { t:"T₃/T₄ low; TSH low; the gland shrinks", why:M1 },
          { t:"T₃/T₄ normal; TSH high; no change", why:"Without iodine, the gland can’t keep up." },
          { t:"T₃/T₄ high; TSH low; the gland enlarges", why:"That’s the Graves’ pattern. " + M2 }] },
        b:{ prompt:"A person’s thyroid is removed by surgery and they take no pills. Predict T₃/T₄, TSH and metabolic rate.", options:[
          { t:"T₃/T₄ very low; TSH high; metabolic rate low", ok:true, why:"No gland, no hormone: feedback is lost, so TSH rises, and metabolism slows." },
          { t:"T₃/T₄ very low; TSH low; metabolic rate low", why:M1 },
          { t:"T₃/T₄ normal, because the pituitary makes it instead", why:M4 },
          { t:"T₃/T₄ low; TSH normal; metabolic rate high", why:"Low hormone means low metabolic rate." }] } },
      { id:"t2", cat:"T", goal:[3, 5],
        a:{ prompt:"A healthy person takes thyroid hormone pills, at more than the body normally makes, to lose weight. Predict their TSH and own thyroid activity, and one risk.", options:[
          { t:"TSH falls, their own thyroid makes less, and the high total brings hyperthyroid symptoms such as a fast heart rate", ok:true, why:M3 },
          { t:"TSH rises and their thyroid makes more", why:M3 },
          { t:"No change, because pills are destroyed by digestion", why:"They’re absorbed." },
          { t:"TSH falls, but their thyroid makes more to keep up", why:M3 }] },
        b:{ prompt:"A person with Graves’ disease has antibodies that stimulate the thyroid. Predict T₃/T₄, TSH and metabolic rate.", options:[
          { t:"T₃/T₄ high; TSH low; metabolic rate high", ok:true, why:"The antibodies drive the gland; the high hormone switches TSH off." },
          { t:"T₃/T₄ high; TSH high; metabolic rate high", why:"High hormone switches TSH off." },
          { t:"T₃/T₄ low; TSH high; metabolic rate low", why:"That’s the underactive pattern." },
          { t:"T₃/T₄ normal; TSH low; metabolic rate normal", why:"The antibodies drive the gland hard." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"Thyroid hormone triggers a tadpole’s change into a frog. Predict what happens to tadpoles raised in iodine-free water.", options:[
          { t:"Metamorphosis is delayed, because they can’t make enough thyroid hormone", ok:true, why:"No iodine, little thyroxine, so the change is slow." },
          { t:"They become frogs sooner", why:"Less hormone slows the change." },
          { t:"Nothing changes, because tadpoles don’t need iodine", why:"They need it to make thyroxine." },
          { t:"They become larger frogs sooner", why:"Less hormone delays the change." }] },
        b:{ prompt:"A patient’s results show <strong>low TSH and low T₃/T₄</strong> with a normal-sized gland. Where is the problem most likely?", options:[
          { t:"The pituitary: it isn’t making enough TSH", ok:true, why:"A working pituitary would raise TSH when hormone is low." },
          { t:"The thyroid", why:"A failing thyroid would make TSH rise." },
          { t:"Iodine deficiency", why:"That raises TSH. " + M1 },
          { t:"Graves’ disease", why:"That gives high T₃/T₄." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of how iodine deficiency causes a goitre?", options:[
          { t:"“With little iodine, little T₃/T₄ is made, so there’s little negative feedback. TSH stays high and keeps stimulating the thyroid, which grows.”", ok:true, why:"It links iodine, hormone, feedback, TSH and growth in order." },
          { t:"“Iodine deficiency makes the thyroid make too much hormone, so it swells.”", why:M2 },
          { t:"“The thyroid swells to store iodine.”", why:"There’s little iodine to store." },
          { t:"“Low iodine lowers TSH, so the gland grows.”", why:M1 }] },
        b:{ prompt:"Which is the best explanation of why anabolic steroid use can reduce sperm production?", options:[
          { t:"“High steroid levels feed back on the hypothalamus and pituitary, lowering LH and FSH, so the testes make less testosterone and sperm.”", ok:true, why:M3 },
          { t:"“Steroids directly destroy sperm in the blood.”", why:"The effect runs through hormones." },
          { t:"“Steroids raise LH and FSH, exhausting the testes.”", why:M3 },
          { t:"“Muscles use up the body’s testosterone.”", why:"Feedback, not consumption, is the cause." }] } },
      { id:"c2", cat:"C", goal:[1, 4],
        a:{ prompt:"Which flow chart correctly shows how the thyroid axis responds to low T₃/T₄?", options:[
          { t:"Low T₃/T₄ → hypothalamus releases more TRH → anterior pituitary releases more TSH → thyroid releases more T₃/T₄ → levels rise and feedback eases", ok:true, why:"Each gland answers to the one above it, and feedback eases as levels recover." },
          { t:"Low T₃/T₄ → thyroid releases TRH → hypothalamus releases TSH → levels rise", why:"The glands are in the wrong roles. " + M4 },
          { t:"Low T₃/T₄ → less TRH → less TSH → levels rise", why:M1 },
          { t:"Low T₃/T₄ → posterior pituitary releases TSH → thyroid → levels rise", why:"TSH is from the anterior lobe." }] },
        b:{ prompt:"Which flow chart correctly shows the body’s response to a sudden danger?", options:[
          { t:"Danger → nerve signals → adrenal medulla releases epinephrine → faster heart rate, glycogen broken down to glucose → body ready to act", ok:true, why:"Nerves trigger the adrenal medulla in seconds." },
          { t:"Danger → hypothalamus → TSH → thyroid → faster heart rate within seconds", why:"The thyroid axis is far too slow." },
          { t:"Danger → adrenal cortex releases cortisol within seconds → fight or flight", why:M5 },
          { t:"Danger → growth hormone → muscles grow → body ready to act", why:"Growth takes weeks." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"An endurance athlete injects EPO. What is the main benefit sought, and the main health risk?", options:[
          { t:"More red blood cells carry more O₂ to muscles; the blood becomes thicker, raising the risk of clots and stroke", ok:true, why:M6 },
          { t:"Bigger muscles; low blood sugar", why:"EPO acts on red blood cells." },
          { t:"A faster metabolic rate; weight loss", why:"That’s thyroid hormone." },
          { t:"No real benefit or risk, because EPO is natural to the body", why:M6 }] },
        b:{ prompt:"A weightlifter uses anabolic steroids. What is the main benefit sought, and a risk explained by feedback?", options:[
          { t:"More muscle protein synthesis; lower LH and FSH reduce the body’s own testosterone and sperm production", ok:true, why:M3 },
          { t:"More red blood cells; thicker blood", why:"That’s EPO." },
          { t:"More muscle; higher LH and FSH", why:M3 },
          { t:"No risk, because testosterone is natural", why:M6 }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"Regions where most homes use iodized salt have far fewer goitres than regions where few do. Which conclusion is best supported?", options:[
          { t:"Iodine intake is linked to fewer goitres; with iodine’s known role in making T₄, this supports iodizing salt", ok:true, why:"A link plus a known mechanism supports action. " + M7 },
          { t:"Iodized salt prevents every kind of thyroid disease", why:"Goitre is one condition, and one link can’t prove a cause." },
          { t:"Salt causes goitre", why:"The link is the other way: iodized salt goes with <em>fewer</em> goitres." },
          { t:"Goitre is only inherited, so salt doesn’t matter", why:"The data show an environmental link." }] },
        b:{ prompt:"A study gives one group of tadpoles thyroxine and another group none, with the same temperature, food and tank size. What is the <strong>dependent</strong> variable?", options:[
          { t:"The time until metamorphosis", ok:true, why:"It’s what’s measured, and it depends on the thyroxine." },
          { t:"Whether thyroxine is added", why:"That’s the independent variable." },
          { t:"The water temperature", why:"That’s controlled." },
          { t:"The amount of food", why:"That’s controlled." }] } }
    ]
  },
  task:{
    title:"Restore the balance", summary:"Restore the balance",
    statement:"<p>A model patient has a damaged thyroid. Choose their iodine intake and pill dose so their hormones and gland are healthy, while their own thyroid keeps working. There’s more than one plan that works. Can you find them all?</p><ol class=\"hm-tlist\"><li>Total T₃/T₄ is between 90% and 110%.</li><li>TSH is at most 100% (the gland isn’t being overdriven).</li><li>The patient’s own thyroid still makes some hormone (own output &gt; 0).</li><li>Iodine intake is not “Very low”.</li></ol>",
    checks:["Hormone in range", "Gland not overdriven", "Own thyroid still working", "Enough iodine"],
    tips:[
      "Too low: raise the pill dose. Too high: lower it.",
      "TSH is maxed: the pill doesn’t cover enough of the shortfall.",
      "The pill covers everything, so feedback has shut the gland off. Try a smaller dose.",
      "Very low iodine starves the gland."
    ],
    explainPrompt:"Explain why a dose of 50 failed and a dose of 100 also failed, using TSH and negative feedback.",
    vocab:"Use the words TSH, negative feedback, T₃/T₄ and goitre.",
    more:"There’s more than one plan that works. Can you find another?",
    after3:"The pill and the gland share the work. Feedback sets TSH to exactly the gland’s share.",
    afterAt:4
  },
  cards:[
    ["Thyroid axis", "Hypothalamus (TRH) → anterior pituitary (TSH) → thyroid (T₄, T₃)."],
    ["What T₃/T₄ do", "Raise metabolic rate; needed for growth and brain development."],
    ["Thyroid feedback", "High T₃/T₄ lowers TRH and TSH; low T₃/T₄ lets them rise."],
    // VERIFY: Canadian iodized-salt policy details before release.
    ["Iodine", "Needed to make T₄ and T₃; Canada adds it to table salt."],
    ["Goitre", "An enlarged thyroid: from high TSH (iodine deficiency) or antibodies (Graves’)."],
    ["Hypothyroidism", "Low T₃/T₄: tired, cold, slow heart rate, weight gain; TSH high if the gland is the cause."],
    ["Graves’ disease", "Antibodies drive the thyroid: T₃/T₄ high, TSH low, goitre."],
    ["Epinephrine", "Adrenal medulla; fight or flight within seconds."],
    ["Cortisol", "Adrenal cortex (via ACTH); long-term stress; raises blood glucose; reduces inflammation."],
    ["Growth hormone", "Anterior pituitary; growth and protein synthesis; pulses in deep sleep."],
    ["EPO", "Kidney hormone; more red blood cells; misuse thickens blood (clot risk)."],
    ["Anabolic steroids", "Build muscle protein; feedback lowers LH, FSH and the body’s own testosterone."]
  ]
};
