// SBI4U 36 The Urinary System. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/36-urinary-system.md
// Misconception core sentences (plan §3), reused where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "They’re too large to pass the glomerulus’s filter, so a healthy nephron never filters them.";
const M2 = "All the glucose in the plasma is filtered; the proximal tubule normally reabsorbs all of it.";
const M3 = "ADH (<em>anti</em>diuretic) makes the collecting duct <strong>more</strong> permeable to water: less, more concentrated urine.";
const M4 = "ADH moves water; aldosterone moves Na⁺, and water follows the Na⁺.";
const M6 = "Loop length sets how salty the medulla can get, which sets the most concentrated urine possible.";
const M7 = "Dialysis fluid matches normal blood levels of glucose and salts, but has no urea, so only the wastes diffuse out.";
const UA_WRONG = "Read that card’s numbers again: protein points to the filter, glucose to blood glucose, and a large, very dilute volume to ADH. Try another sample.";

export default {
  id:"36-urinary-system",
  kind:"topic",
  title:"The urinary system",
  topic:"The Urinary System",
  readyTopic:"the urinary system",
  hero:{
    headline:"Filter everything, keep almost all of it",
    text:"Your kidneys filter the liquid part of your blood about 60 times a day, then send almost all of it back. Each <strong>nephron</strong> <strong>filters</strong>, <strong>reabsorbs</strong> what the body needs and <strong>secretes</strong> what it doesn’t. Hormones such as <strong>ADH</strong> and <strong>aldosterone</strong> decide, minute by minute, how much water and salt you keep. In this module you’ll trace molecules through a nephron and use urine as evidence about the body.",
    fig:{ html:'<div class="ur-hero" id="ur-hero" role="img" aria-label="A single nephron beside its capillaries. Blood enters the glomerulus; water, glucose and urea are filtered into Bowman’s capsule, while proteins and blood cells stay in the blood. Along the proximal tubule all the glucose and most of the water return to the capillary. Around the loop of Henle water leaves the descending limb and salt leaves the ascending limb. A thin trickle reaches the collecting duct. Labelled arrows: Filtration (glomerulus to capsule), Reabsorption (tubule to blood), Secretion (blood to tubule). 180 L of filtrate a day at the capsule; about 1.5 L of urine at the collecting duct."></div>' }
  },
  goals:[
    "I can name the parts of the urinary system and the nephron and say what each does.",
    "I can explain filtration, reabsorption and secretion, and trace a substance through a nephron.",
    "I can explain how the loop of Henle and ADH produce concentrated or dilute urine.",
    "I can explain how ADH, aldosterone and renin–angiotensin keep water, Na⁺ and blood pressure in balance, and how the kidney helps control pH.",
    "I can predict and interpret what appears in urine when blood chemistry or the nephron changes.",
    "I can explain how dialysis works and weigh it against a transplant."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Membrane transport", goal:3,
          prompt:"Water moves by osmosis from a dilute solution to a more concentrated one through a membrane permeable to water. Which way does water move if a tube with filtrate at 300 mOsm/L passes through fluid at 900 mOsm/L?",
          options:[
            { t:"Out of the tube, into the fluid", ok:true, why:"Water moves toward the higher solute concentration." },
            { t:"Into the tube", why:"That’s toward the lower concentration: backwards." },
            { t:"Neither way", why:"The concentrations differ, so water moves if the membrane lets it." },
            { t:"Out of the tube, but only if salt moves too", why:"Water moves on its own by osmosis." }],
          hints:["Water moves toward more solute.", "Which side has more?", "The outside fluid: out of the tube."] },
        { id:"w2", skill:"Membrane transport", goal:2,
          prompt:"Cells take glucose <strong>from</strong> a low concentration <strong>into</strong> a higher one. What kind of transport is this?",
          options:[
            { t:"Active transport", ok:true, why:"Moving against a gradient needs energy." },
            { t:"Diffusion", why:"Diffusion goes from high to low." },
            { t:"Osmosis", why:"Osmosis is water, not glucose." },
            { t:"Filtration", why:"Filtration is pressure-driven, not against a gradient into cells." }],
          hints:["Is it with or against the gradient?", "Against needs energy (ATP).", "Active transport."] },
        { id:"w3", skill:"Feedback and hormones", goal:4,
          prompt:"Which gland releases ADH into the blood?",
          options:[
            { t:"The posterior pituitary", ok:true, why:"ADH is made in the hypothalamus and released there." },
            { t:"The anterior pituitary", why:"That releases TSH, FSH and LH; ADH comes from the posterior lobe." },
            { t:"The kidney", why:"The kidney is ADH’s target." },
            { t:"The adrenal gland", why:"It releases aldosterone and epinephrine." }],
          hints:["Recall module 34’s two pathways.", "Hypothalamus neurons end in one lobe.", "Posterior pituitary."] },
        { id:"w4", skill:"Feedback and hormones", goal:4,
          prompt:"After a long run without drinking, your blood becomes more concentrated. What should your body do?",
          options:[
            { t:"Keep more water, making less urine", ok:true, why:"Negative feedback restores the water balance." },
            { t:"Make more urine to remove salt", why:"That would lose water you need." },
            { t:"Stop all urine production", why:"Some urine is always needed to remove wastes." },
            { t:"Make more urine, because ADH increases urine output", why:"ADH does the opposite." }],
          hints:["Which way does the loop push?", "Toward more water in the blood.", "Keep water: less urine."] },
        { id:"w5", skill:"Percentages and rates", goal:2,
          prompt:"If 180 L of filtrate is made in a day and 1.8 L of urine leaves, what percentage of the filtrate’s water was reabsorbed?",
          options:[
            { t:"99%", ok:true, why:"1.8 is 1% of 180, so 99% returned." },
            { t:"1%", why:"1% is what <em>left</em> as urine." },
            { t:"90%", why:"That would leave 18 L of urine." },
            { t:"10%", why:"Far too little." }],
          hints:["What fraction of 180 is 1.8?", "1%.", "100 − 1 = 99%."] },
        { id:"w6", skill:"Percentages and rates", goal:2,
          prompt:"180 L a day is how many mL per minute? (A day has 1440 minutes.)",
          options:[
            { t:"125 mL/min", ok:true, why:"180 000 mL ÷ 1440 = 125." },
            { t:"12.5 mL/min", why:"Check the place value: 180 L = 180 000 mL." },
            { t:"1250 mL/min", why:"That’s 10 times too big." },
            { t:"8 mL/min", why:"That divides by 24 hours, not 1440 minutes: and it’s in the wrong units." }],
          hints:["Change litres to millilitres.", "180 000 mL ÷ 1440 min.", "125 mL/min."] }
      ],
      refreshers:{
        "Membrane transport":"Diffusion and osmosis go down a gradient and need no energy; active transport goes against a gradient and uses ATP. Water follows solutes by osmosis.",
        "Feedback and hormones":"The hypothalamus detects water balance and has the posterior pituitary release ADH. The response opposes the change: when water is short, keep more of it.",
        "Percentages and rates":"Percentage = part ÷ whole × 100. For rates, convert units first (L to mL, days to minutes)."
      }
    }
  },
  explore:{
    heading:"Nephron explorer",
    intro:"Follow a substance through a nephron, then change the conditions and read the urine.",
    modelNote:"Model values; real values vary.",
    // Readout text per segment (plan: the model table's rows; "Process here" is filtration, reabsorption or secretion)
    segments:{
      caps:{ name:"Bowman’s capsule", row:"Bowman’s capsule (filtered)", proc:"Filtration: blood pressure pushes water and small solutes out of the glomerulus" },
      pct:{ name:"Proximal tubule", row:"End of proximal tubule", proc:"Reabsorption (all the glucose, most water and Na⁺); some secretion (H⁺, wastes)" },
      loop:{ name:"Loop of Henle", row:"End of loop of Henle", proc:"Reabsorption (water in the descending limb; Na⁺ and Cl⁻ pumped out of the ascending limb)" },
      dct:{ name:"Distal tubule", row:"End of distal tubule", proc:"Reabsorption of Na⁺ (aldosterone); secretion of K⁺ and H⁺" },
      cd:{ name:"Collecting duct", row:"Urine (end of collecting duct)", proc:"Reabsorption of water by osmosis, when ADH is present" }
    },
    predictions:[
      { id:"p1", start:{ mode:"trace", sub:"glucose", bg:5 },
        prompt:"Where does glucose leave the filtrate?",
        options:[{ t:"All of it in the proximal tubule", ok:true }, { t:"In the loop of Henle" }, { t:"In the collecting duct" }, { t:"It isn’t filtered at all" }],
        explain:"Glucose <em>is</em> filtered; carriers in the proximal tubule actively reabsorb all of it." },
      { id:"p2", start:{ mode:"trace", sub:"glucose", bg:15 },
        prompt:"What changes?",
        options:[{ t:"Some glucose is left in the filtrate and reaches the urine", ok:true }, { t:"All glucose is still reabsorbed" }, { t:"Glucose is no longer filtered" }, { t:"Glucose is secreted into the tubule" }],
        explain:"Above about 10 mmol/L the carriers are saturated. Glucose in urine is a classic sign of untreated diabetes mellitus." },
      { id:"p3", start:{ mode:"cond", adh:"none" },
        prompt:"Predict the urine.",
        options:[{ t:"6 L a day, dilute (100 mOsm/L)", ok:true }, { t:"0.5 L a day, concentrated" }, { t:"1.5 L a day, unchanged" }, { t:"No urine at all" }],
        explain:"Without ADH the collecting duct holds its water, so the salty medulla can’t pull it out." },
      { id:"p4", start:{ mode:"trace", sub:"protein", glom:"intact" },
        prompt:"What happens to protein in each case?",
        options:[{ t:"Intact: never filtered; leaky: appears in urine", ok:true }, { t:"Both: filtered then reabsorbed" }, { t:"Intact: filtered and secreted" }, { t:"Both: broken down into urea" }],
        explain:"Protein in urine points to a damaged filter, not a reabsorption problem." }
    ],
    challenges:[
      { id:"tc1", goal:5, prompt:"Set the conditions so the urine contains glucose but <strong>no</strong> protein.",
        why:"Above 10 mmol/L the glucose carriers are saturated, so glucose reaches the urine; an intact filter keeps protein out.",
        general:"There’s no glucose in the urine yet. Read the Glucose in urine row.",
        hints:["When do the glucose carriers run out?", "Above 10 mmol/L.", "Pick 12 or more, and keep the filter intact."] },
      { id:"tc2", goal:[3, 5], prompt:"Match this sample: <strong>0.5 L/day, 1200 mOsm/L, no glucose, no protein</strong>.",
        why:"A medium (human) loop builds a 1200 mOsm/L gradient, and high ADH lets the urine reach it: 600 ÷ 1200 = 0.5 L/day.",
        general:"Compare the Urine row with the sample: 0.5 L/day at 1200 mOsm/L.",
        hints:["Which control sets how concentrated urine can get?", "A human (medium) loop maxes out at 1200.", "Medium loop, high ADH, glucose ≤ 10, filter intact."] },
      { id:"tc3", goal:3, stretch:true, prompt:"A desert rodent needs urine of <strong>at least 2000 mOsm/L</strong>. Choose a loop length and an ADH level that achieve it. One Check only, so reason first.",
        why:"A long loop builds a 3000 mOsm/L gradient, and high ADH opens the duct fully to use it.",
        general:"That urine is below 2000 mOsm/L.",
        hints:["Two things limit urine concentration: the medulla’s gradient and the duct’s water permeability.", "Only a long loop builds a gradient above 2000.", "Long loop and high ADH: 3000 mOsm/L."] }
    ]
  },
  part3:{
    slug:"hormones", name:"Hormones",
    heading:"Hormones that tune the kidney",
    intro:"Five stations. Follow each hormone from the brain or the kidney itself to the tubule, zoom in on pH control, then use urine data and a dialysis machine as evidence.",
    stations:[
      { id:"adh", t:"1. ADH" }, { id:"raas", t:"2. Renin–angiotensin" }, { id:"ph", t:"3. pH balance" }, { id:"ua", t:"4. Check it with data" }, { id:"dia", t:"5. Dialysis" }
    ],
    adh:{
      intro:"Step through the water-balance loop. Then switch on <strong>Alcohol</strong> and step through again.",
      loop:["↑ Blood concentration (water is short)", "Osmoreceptors in the hypothalamus detect it", "The posterior pituitary releases ADH", "Collecting ducts insert aquaporins", "More water is reabsorbed: less, more concentrated urine", "Blood concentration falls back to normal"],
      alcohol:["Alcohol reaches the brain", "Osmoreceptors in the hypothalamus", "Alcohol reduces ADH release from the posterior pituitary", "Fewer aquaporins in the collecting ducts", "Less water is reabsorbed: larger, more dilute urine", "The blood becomes more concentrated: thirst"],
      rows:{ off:[["ADH release", "Rises when blood is concentrated"], ["Urine", "Less, more concentrated"], ["Blood", "Concentration falls back to normal"]],
        on:[["ADH release", "Reduced by alcohol"], ["Urine", "Larger in volume, more dilute"], ["Blood", "More concentrated: thirst"]] }
    },
    raas:{
      intro:"Step through the response to low blood pressure.",
      steps:["↓ Blood pressure or volume", "Cells near the glomerulus release <strong>renin</strong>", "Angiotensinogen (from the blood) is converted to <strong>angiotensin II</strong>",
        "Angiotensin II acts three ways: (a) arterioles constrict · (b) the adrenal cortex releases <strong>aldosterone</strong> · (c) thirst",
        "More Na⁺ reabsorbed (and K⁺ secreted) in the distal tubule and collecting duct", "Water follows the Na⁺ by osmosis", "Blood volume and pressure rise"],
      cards:[
        { id:"adh", h:"ADH", from:"Posterior pituitary", trig:"Concentrated blood (osmoreceptors)", target:"Collecting duct", act:"Moves water: opens water channels (aquaporins)" },
        { id:"ald", h:"Aldosterone", from:"Adrenal cortex", trig:"Low blood pressure (renin–angiotensin)", target:"Distal tubule and collecting duct", act:"Moves Na⁺, and water follows" }]
    },
    ph:{
      intro:"Zoom to the molecules: one tubule cell between the filtrate and the blood. Move the blood pH and watch what the cell does.",
      normal:"Normal blood pH: 7.35–7.45."
    },
    ua:{
      intro:"Four urinalysis cards. Tap a clue, then tap the sample that fits it.",
      samples:[
        { id:"A", vol:"1.5", glu:"none", pro:"none", conc:"400" },
        { id:"B", vol:"3.0", glu:"present", pro:"none", conc:"500" },
        { id:"C", vol:"1.4", glu:"none", pro:"present", conc:"420" },
        { id:"D", vol:"8.0", glu:"none", pro:"none", conc:"80" }],
      clues:[
        { id:"filter", t:"Filter damaged", answer:"C", why:"Protein in urine means the glomerulus lets large molecules through." },
        { id:"glucose", t:"Blood glucose above threshold", answer:"B", why:"Glucose in urine: the carriers are saturated. Extra glucose in the filtrate holds water in by osmosis, which is why the volume is larger." },
        { id:"adh", t:"Little or no ADH", answer:"D", why:"A large volume of very dilute urine: the collecting duct is keeping its water." },
        { id:"typical", t:"Typical", answer:"A", why:"About 1.5 L a day, no glucose, no protein: a typical result." }],
      wrong:UA_WRONG
    },
    dia:{
      intro:"A hemodialysis schematic: blood on one side of a partially permeable membrane, dialysis fluid on the other. Change the flow direction and the fluid.",
      stse:[
        { h:"Dialysis", t:"Several sessions a week, each a few hours, for as long as the kidneys don’t work (or until a transplant)." },
        { h:"Transplant", t:"One operation, after a wait on a waiting list for a matching kidney, then lifelong anti-rejection medicine." }],
      // VERIFY: Canadian organ-donation and dialysis figures are not stated (plan §6.3). Add only with a checked source.
      // VERIFY: Ontario donor registration: age 16+, through ServiceOntario or beadonor.ca.
      canada:"In Canada, many more people need a kidney than receive one each year, so many wait on dialysis. In Ontario, people aged 16 and older can register their consent to donate organs and tissue through ServiceOntario or online at beadonor.ca."
    },
    quickCheck:{
      title:"Quick check", summary:"Hormones quick check",
      items:[
        { id:"q1", goal:4, prompt:"Which hormone mainly controls Na⁺ reabsorption?",
          choices:[{ t:"Aldosterone", ok:true, fb:"Right. Aldosterone increases Na⁺ reabsorption, and water follows." },
            { t:"ADH", fb:"ADH moves water; aldosterone moves Na⁺." },
            { t:"Insulin", fb:"ADH moves water; aldosterone moves Na⁺." },
            { t:"Renin", fb:"ADH moves water; aldosterone moves Na⁺." }] },
        { id:"q2", goal:[3, 4], prompt:"Alcohol lowers ADH release. The urine becomes…",
          choices:[{ t:"larger and more dilute", ok:true, fb:"Right. Less ADH: the collecting duct keeps its water." },
            { t:"smaller and more concentrated", fb:"Less ADH: the collecting duct keeps its water." },
            { t:"protein-rich", fb:"Less ADH: the collecting duct keeps its water." },
            { t:"unchanged", fb:"Less ADH: the collecting duct keeps its water." }] },
        { id:"q3", goal:4, prompt:"Blood is too acidic. The tubule cells…",
          choices:[{ t:"secrete more H⁺", ok:true, fb:"Right. Removing H⁺ and keeping bicarbonate raises blood pH." },
            { t:"secrete more HCO₃⁻ into urine", fb:"Removing H⁺ and keeping bicarbonate raises blood pH." },
            { t:"stop filtering", fb:"Removing H⁺ and keeping bicarbonate raises blood pH." },
            { t:"reabsorb more urea", fb:"Removing H⁺ and keeping bicarbonate raises blood pH." }] },
        { id:"q4", goal:6, prompt:"Why does dialysis fluid contain glucose?",
          choices:[{ t:"So glucose doesn’t diffuse out of the blood", ok:true, fb:"Right. Equal concentrations mean no net diffusion." },
            { t:"To feed the patient", fb:"Equal concentrations mean no net diffusion." },
            { t:"To remove urea faster", fb:"Equal concentrations mean no net diffusion." },
            { t:"To thin the blood", fb:"Equal concentrations mean no net diffusion." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"label", type:"custom", title:"Label the nephron", summary:"Label the nephron", goal:[1, 2],
        instruction:"Tap a label, then tap the structure it names. Its job appears when it’s right.", how:"",
        labels:[
          { id:"glom", t:"Glomerulus", job:"A knot of capillaries where blood is filtered",
            hints:["Where does blood get filtered?", "A knot of capillaries inside the cup.", "Tap the knot of capillaries inside Bowman’s capsule."] },
          { id:"caps", t:"Bowman’s capsule", job:"A cup that collects the filtrate",
            hints:["What collects the filtrate first?", "It’s a cup.", "Tap the cup around the knot of capillaries."] },
          { id:"pct", t:"Proximal convoluted tubule", job:"Reabsorbs all glucose and amino acids, and most water and Na⁺",
            hints:["Where does the filtrate go right after the cup?", "A twisted tube in the cortex, before the loop.", "Tap the twisted tube leaving the capsule."] },
          { id:"desc", t:"Descending limb of the loop", job:"Lets water out into the salty medulla",
            hints:["Which way does the filtrate flow first in the loop?", "Down into the medulla, before the bend.", "Tap the limb that runs down from the proximal tubule."] },
          { id:"asc", t:"Ascending limb of the loop", job:"Pumps Na⁺ and Cl⁻ out; holds water in",
            hints:["Which limb comes after the bend?", "It runs back up toward the cortex.", "Tap the limb that rises after the bend."] },
          { id:"dct", t:"Distal convoluted tubule", job:"Fine-tunes Na⁺ (aldosterone), K⁺ and H⁺",
            hints:["It comes after the loop.", "It’s twisted, in the cortex.", "The distal tubule."] },
          { id:"cd", t:"Collecting duct", job:"Reabsorbs water when ADH is present",
            hints:["Where do many nephrons drain?", "A straight tube that runs down through the medulla.", "Tap the long straight tube on the right."] },
          { id:"aff", t:"Afferent arteriole", job:"Brings blood to the glomerulus",
            hints:["Which vessel brings blood in?", "<em>Af</em>ferent <em>a</em>rrives.", "Tap the wider vessel entering the glomerulus from the left."] },
          { id:"eff", t:"Efferent arteriole", job:"Carries blood away from the glomerulus",
            hints:["Which vessel leaves the glomerulus?", "<em>Ef</em>ferent <em>e</em>xits.", "Tap the narrower vessel leaving the glomerulus, below the wider one."] },
          { id:"ptc", t:"Peritubular capillaries", job:"Take back reabsorbed substances; supply secreted ones",
            hints:["Blood leaving the glomerulus goes where?", "Around the tubules.", "Peritubular capillaries."] }
        ],
        // key "label>tapped" (or the sorted pair "a|b" for either way round)
        wrong:{
          "asc|desc":"The descending limb lets water out; the ascending limb pumps salt.",
          "aff|eff":"<em>Af</em>ferent <em>a</em>rrives; <em>ef</em>ferent <em>e</em>xits.",
          "caps>glom":"The capsule is the cup around it."
        },
        wrongDefault:"Follow the filtrate from the cup to the duct. Try another structure." },
      { id:"calc", type:"custom", title:"Kidney calculations and predictions", summary:"Kidney calculations and predictions", star:true, goal:[2, 3, 5],
        instruction:"Six items: two calculations from the model, then four predictions (★ non-routine; the last two go beyond the Final Check).",
        items:[
          { id:"s1", kind:"num", goal:2, prompt:"In the model with moderate ADH, 1.5 L of urine leaves from 180 L of filtrate. What percentage of the water was reabsorbed? (one decimal)",
            answer:99.2, tol:0.05, display:"99.2%", unit:"%",
            wrong:[{ match:0.8, fb:"That’s the part that left." }],
            hints:["Find the percentage that left first: 1.5 ÷ 180 × 100.", "About 0.8% left as urine.", "100 − 0.8 = 99.2% reabsorbed."] },
          { id:"s2", kind:"num", goal:3, prompt:"In the model with a medium loop, what volume of urine is made with ADH high?",
            answer:0.5, display:"0.5 L/day", unit:"L/day",
            wrong:[{ match:1.5, fb:"That’s with moderate ADH." }],
            hints:["With ADH high, the urine reaches the medulla’s maximum.", "A medium loop’s maximum is 1200 mOsm/L, and V = 600 ÷ U.", "600 ÷ 1200 = 0.5 L/day."] },
          { id:"s3", kind:"mc", goal:3, star:true, prompt:"A person drinks 1 L of water quickly. Predict ADH, urine volume and urine concentration over the next hour.",
            options:[
              { t:"ADH falls; more urine; more dilute", ok:true, why:"Extra water dilutes the blood, so less ADH is released and the collecting duct keeps its water." },
              { t:"ADH rises; less urine; more concentrated", why:"Extra water dilutes the blood, so less ADH is released." },
              { t:"ADH falls; less urine; more concentrated", why:"Less ADH means the collecting duct keeps its water: more urine, not less." },
              { t:"ADH stays the same; the urine doesn’t change", why:"Diluted blood is a change the hypothalamus responds to: negative feedback lowers ADH." }],
            hints:["Does drinking water make the blood more or less concentrated?", "Less concentrated, so the hypothalamus releases less ADH.", "ADH falls; more urine; more dilute."] },
          { id:"s4", kind:"mc", goal:3, star:true, prompt:"A drug blocks the Na⁺/Cl⁻ pumps in the ascending limb. Predict the medulla’s gradient and the urine.",
            options:[
              { t:"The gradient shrinks; less water leaves the collecting duct; large, dilute urine", ok:true, why:"No salt pumped out means no salty medulla, so water stays in the duct." },
              { t:"The gradient grows; small, more concentrated urine", why:"With no salty medulla, water has nowhere to go." },
              { t:"No change, because ADH is still present", why:"ADH needs the gradient to work." },
              { t:"Glucose appears in the urine", why:"Glucose is handled in the proximal tubule." }],
            hints:["What builds the medulla’s salt gradient?", "The ascending limb’s pumps.", "No gradient, so water stays in the duct: lots of dilute urine."] },
          { id:"s5", kind:"mc", goal:5, star:true, prompt:"Fair test: a student compares urine output after drinking 500 mL of water vs 500 mL of a salty sports drink. Which plan is best?",
            options:[
              { t:"The same people on two different mornings, the same time since breakfast, urine collected for the same 2 hours, the drink order swapped for half the group", ok:true, why:"Each person is their own comparison, and timing and order are controlled." },
              { t:"Two different groups, one drink each", why:"People differ in size and habits; use each person as their own comparison." },
              { t:"The same people, water in the morning and the sports drink that afternoon", why:"Urine output changes over a day; test at the same time since a meal, on different days." },
              { t:"The same people on two mornings, always water first", why:"A fixed order mixes up the drink with the day; swap the order for half the group." }],
            hints:["What could differ between the two tests besides the drink?", "The people, the time of day and the order.", "Same people, same timing and collection period, order swapped for half the group."] },
          { id:"s6", kind:"mc", goal:5, star:true, prompt:"A patient’s urine has protein and red blood cells but no glucose, and blood glucose is normal. Which part of the nephron is most likely damaged? Explain.",
            options:[
              { t:"The glomerulus (the filter): large proteins and cells are getting through", ok:true, why:"A healthy filter holds back proteins and cells; these are getting through." },
              { t:"The proximal tubule", why:"Its damage would show up as glucose in urine, not protein." },
              { t:"The collecting duct", why:"The collecting duct handles water; it can’t let proteins and cells into the filtrate." },
              { t:"The loop of Henle", why:"The loop builds the salt gradient; damage there changes urine concentration, not protein." }],
            hints:["What normally stops proteins and cells?", "The size of the glomerulus’s filter.", "The glomerulus."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Tomas", how:"",
        instruction:"Tomas made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Describe what happens to glucose in a healthy nephron.",
            steps:["Blood enters the glomerulus under pressure.", "Glucose stays in the blood because the body needs it.", "So there is no glucose in the filtrate.", "So there is no glucose in the urine."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2. The mistake is earlier.", "The conclusion is true, but for a different reason."],
            fixes:[
              { t:"Glucose is small, so it’s filtered into Bowman’s capsule; then the proximal tubule actively reabsorbs all of it.", ok:true, why:"All small solutes are filtered; the proximal tubule takes the glucose back." },
              { t:"Glucose is filtered and then reabsorbed in the collecting duct.", why:"It’s the proximal tubule." },
              { t:"Glucose is too large to be filtered.", why:"Glucose is a small molecule." },
              { t:"Step 2 is correct.", why:"All small solutes are filtered, useful or not." }],
            hints:["What decides what passes the filter: usefulness or size?", "Size.", "Filtered, then reabsorbed."] },
          { id:"e2", goal:3, task:"Explain the urine of someone who is dehydrated.",
            steps:["Osmoreceptors detect that the blood is too concentrated.", "The posterior pituitary releases more ADH.", "ADH makes the collecting duct less permeable to water.", "So the urine is small in volume and concentrated."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "The result is right, but step 3 gives the wrong reason."],
            fixes:[
              { t:"ADH makes the collecting duct <strong>more</strong> permeable, so water leaves into the salty medulla.", ok:true, why:"More aquaporins let water leave by osmosis, so the urine is small and concentrated." },
              { t:"ADH makes the loop of Henle longer.", why:"Loop length is fixed by anatomy. " + M6 },
              { t:"ADH increases Na⁺ reabsorption.", why:"That’s aldosterone." },
              { t:"Step 3 is correct.", why:"Less permeable would mean more, dilute urine." }],
            hints:["Antidiuretic means ‘against urine flow’.", "Keeping water needs a leakier duct.", "More permeable."] },
          { id:"e3", goal:6, task:"Explain how hemodialysis cleans the blood.",
            steps:["Blood flows past a partially permeable membrane.", "The dialysis fluid on the other side is pure water.", "Urea diffuses out of the blood.", "The fluid flows the opposite way to keep a gradient."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 is true.", "Step 4 is correct."],
            fixes:[
              { t:"The fluid has normal blood levels of glucose and salts but no urea, so only the wastes diffuse out.", ok:true, why:"Equal glucose and salt levels mean no net loss of them; urea still diffuses out." },
              { t:"The fluid has extra urea to push urea out.", why:"Urea would diffuse <em>in</em>." },
              { t:"The fluid has no glucose, to lower blood sugar.", why:"Glucose would be lost." },
              { t:"Step 2 is correct.", why:"Pure water would pull out glucose and salts too." }],
            hints:["Which substances should stay in the blood?", "Glucose and salts.", "Match them in the fluid; leave urea out."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the nephron explorer: how much is filtered, or how much comes back?" },
      { id:"j2", q:"In your own words, why can a longer loop of Henle make more concentrated urine?" },
      { id:"j3", q:"Explain to a friend the difference between what ADH does and what aldosterone does." },
      { id:"j4", q:"Which part of the nephron is still confusing? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which order does filtrate pass through?", options:[
          { t:"Bowman’s capsule → proximal tubule → loop of Henle → distal tubule → collecting duct", ok:true, why:"Capsule, proximal tubule, loop, distal tubule, then the collecting duct." },
          { t:"Bowman’s capsule → loop of Henle → proximal tubule → distal tubule → collecting duct", why:"The proximal tubule comes right after the capsule." },
          { t:"Collecting duct → distal tubule → loop of Henle → proximal tubule → Bowman’s capsule", why:"That’s backwards." },
          { t:"Bowman’s capsule → proximal tubule → distal tubule → loop of Henle → collecting duct", why:"The loop sits between the two tubules." }] },
        b:{ prompt:"Where does filtration happen?", options:[
          { t:"From the glomerulus into Bowman’s capsule", ok:true, why:"Blood pressure pushes water and small solutes out of the glomerulus into the capsule." },
          { t:"In the loop of Henle", why:"The loop reabsorbs; it doesn’t filter." },
          { t:"In the collecting duct", why:"That’s where ADH acts." },
          { t:"In the bladder", why:"The bladder only stores urine." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which substance is in the filtrate but <strong>not</strong> in the urine of a healthy person?", options:[
          { t:"Glucose", ok:true, why:"It’s filtered, then all reabsorbed." },
          { t:"Urea", why:"Much of it stays in the urine." },
          { t:"Plasma protein", why:"It isn’t in the filtrate either." },
          { t:"Water", why:"Water is in both." }] },
        b:{ prompt:"Which substance is <strong>not</strong> normally filtered at the glomerulus?", options:[
          { t:"Plasma proteins", ok:true, why:"They’re too large." },
          { t:"Glucose", why:"Glucose is filtered." },
          { t:"Urea", why:"Urea is filtered." },
          { t:"Na⁺", why:"Ions are filtered." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"What does ADH do in the kidney?", options:[
          { t:"Makes the collecting duct more permeable to water, so more water is reabsorbed", ok:true, why:"ADH opens water channels in the collecting duct." },
          { t:"Makes the collecting duct less permeable, so more urine is made", why:M3 },
          { t:"Increases Na⁺ reabsorption in the distal tubule", why:"That’s aldosterone." },
          { t:"Increases the rate of filtration", why:"ADH acts on the duct, not the filter." }] },
        b:{ prompt:"What does aldosterone do in the kidney?", options:[
          { t:"Increases Na⁺ reabsorption in the distal tubule and collecting duct, and water follows", ok:true, why:"Aldosterone moves Na⁺; water follows by osmosis." },
          { t:"Opens water channels in the collecting duct", why:"That’s ADH." },
          { t:"Stops all urine production", why:"It reduces Na⁺ loss, not all urine." },
          { t:"Increases glucose reabsorption", why:"Glucose is reabsorbed without hormones." }] } },
      { id:"t1", cat:"T", goal:5,
        a:{ prompt:"A person’s blood glucose is 15 mmol/L. Predict their urine and explain.", options:[
          { t:"Glucose appears in the urine, because the proximal tubule’s carriers are saturated above about 10 mmol/L", ok:true, why:"The carriers can’t take back all the extra glucose, so some stays in the filtrate." },
          { t:"No glucose, because glucose is never filtered", why:M2 },
          { t:"Glucose appears because the glomerulus is damaged", why:"Damage shows as protein." },
          { t:"No glucose, because the collecting duct reabsorbs the extra", why:"The collecting duct doesn’t reabsorb glucose." }] },
        b:{ prompt:"A medicine blocks the glucose carriers in the proximal tubule. Blood glucose is a normal 5 mmol/L. Predict the urine.", options:[
          { t:"Glucose appears in the urine even though blood glucose is normal", ok:true, why:"All the glucose is still filtered, but none can get back without its carriers." },
          { t:"No glucose, because blood glucose is normal", why:"Filtered glucose can’t get back without its carriers." },
          { t:"Protein appears instead", why:M1 },
          { t:"Less urine is made", why:"Glucose left in the filtrate holds water in: more urine, if anything." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"Alcohol reduces ADH release. Predict the urine and the blood.", options:[
          { t:"More, dilute urine; the blood becomes more concentrated, causing thirst", ok:true, why:"Less ADH: the collecting duct keeps its water, so the body loses water." },
          { t:"Less, concentrated urine; the blood becomes diluted", why:M3 },
          { t:"More urine, but just as concentrated as before", why:"Less water is reabsorbed, so the urine is diluted." },
          { t:"No change, because alcohol acts on the liver", why:"It also lowers ADH release." }] },
        b:{ prompt:"A medicine blocks the Na⁺/Cl⁻ pumps in the ascending limb. Predict the urine.", options:[
          { t:"More, dilute urine, because the medulla’s salt gradient shrinks and less water leaves the collecting duct", ok:true, why:"No salty medulla, so water stays in the duct." },
          { t:"Less, concentrated urine", why:"Without the gradient, water stays in the duct." },
          { t:"Glucose appears in the urine", why:"Glucose is handled in the proximal tubule." },
          { t:"No change, because ADH is still present", why:"ADH needs the gradient to work." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"A kangaroo rat lives in the desert and almost never drinks. Its loops of Henle are much longer than a human’s. Why?", options:[
          { t:"Long loops build a steeper salt gradient in the medulla, so very concentrated urine can be made and water saved", ok:true, why:M6 },
          { t:"Long loops filter more blood", why:"Filtering happens at the glomerulus." },
          { t:"Long loops secrete more urea", why:"The benefit is the gradient." },
          { t:"Long loops make more urine to cool the animal", why:"That would waste water." }] },
        b:{ prompt:"A beaver lives in fresh water and has short loops of Henle. Why is that enough?", options:[
          { t:"Water is plentiful, so it doesn’t need a steep gradient; it makes larger amounts of dilute urine", ok:true, why:"A shallow gradient is enough when water is easy to get." },
          { t:"Short loops filter more efficiently", why:M6 },
          { t:"Beavers don’t need ADH", why:"They still regulate water; they just rarely need very concentrated urine." },
          { t:"Short loops make more concentrated urine", why:"Shorter loops make shallower gradients." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why healthy urine has no protein?", options:[
          { t:"“Plasma proteins are too large to pass through the glomerulus’s filter, so they stay in the blood.”", ok:true, why:"Size decides what passes the filter, and proteins are too large." },
          { t:"“Proteins are filtered, then reabsorbed in the proximal tubule.”", why:M1 },
          { t:"“Proteins are broken down into urea before reaching the kidney.”", why:"Some protein breakdown makes urea, but that isn’t why urine lacks protein." },
          { t:"“The collecting duct pumps protein back.”", why:"It handles water, not protein." }] },
        b:{ prompt:"Which is the best explanation of how urine can be more concentrated than blood?", options:[
          { t:"“With ADH, the collecting duct lets water out by osmosis as it passes the salty medulla, leaving the solutes behind.”", ok:true, why:"Water leaves by osmosis into the salty medulla; the solutes stay in the urine." },
          { t:"“The kidney adds extra salt to the urine.”", why:"Water is removed; little extra solute is added." },
          { t:"“The glomerulus filters only solutes, not water.”", why:"Water is filtered too." },
          { t:"“ADH pumps solutes into the duct.”", why:"ADH moves water, not solutes: it makes the collecting duct more permeable to water." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which flow chart correctly shows the response to dehydration?", options:[
          { t:"↑ blood concentration → osmoreceptors (hypothalamus) → posterior pituitary releases ADH → collecting ducts reabsorb more water → blood concentration falls", ok:true, why:"Dehydration raises ADH, so more water is reabsorbed." },
          { t:"↑ blood concentration → adrenal cortex releases ADH → more urine → blood concentration falls", why:"ADH comes from the posterior pituitary. " + M4 },
          { t:"↑ blood concentration → osmoreceptors → less ADH → more water reabsorbed → blood concentration falls", why:"Dehydration raises ADH." },
          { t:"↑ blood concentration → kidney releases ADH → glomerulus filters less → blood concentration falls", why:"ADH comes from the posterior pituitary." }] },
        b:{ prompt:"Which flow chart correctly shows the response to low blood pressure?", options:[
          { t:"↓ blood pressure → kidney releases renin → angiotensin II → adrenal cortex releases aldosterone → more Na⁺ and water reabsorbed → blood pressure rises", ok:true, why:"Renin starts the chain; aldosterone keeps Na⁺, and water follows." },
          { t:"↓ blood pressure → posterior pituitary releases aldosterone → less Na⁺ reabsorbed → blood pressure rises", why:"Aldosterone comes from the adrenal cortex and increases Na⁺ reabsorption. " + M4 },
          { t:"↓ blood pressure → renin → angiotensin II → more urine → blood pressure rises", why:"More urine would lower volume." },
          { t:"↓ blood pressure → aldosterone → renin → angiotensin II → blood pressure falls", why:"Out of order, and the result is backwards." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"In hemodialysis, why does the dialysis fluid contain normal levels of glucose and salts but <strong>no</strong> urea?", options:[
          { t:"So urea diffuses out of the blood down its gradient while glucose and salts stay", ok:true, why:M7 },
          { t:"To add glucose to the patient’s blood", why:"Equal levels mean no net movement." },
          { t:"To stop urea from moving at all", why:"No urea in the fluid makes urea move out." },
          { t:"Because the fluid has to match normal urine", why:M7 }] },
        b:{ prompt:"In hemodialysis, why does the fluid flow in the <strong>opposite</strong> direction to the blood?", options:[
          { t:"It keeps a concentration gradient along the whole membrane, so more urea diffuses out", ok:true, why:"Fresh fluid meets the blood all along the membrane, so urea keeps diffusing out." },
          { t:"It makes the blood flow faster", why:"Flow direction changes the gradient, not the speed." },
          { t:"It keeps the blood warm", why:"Temperature isn’t the reason." },
          { t:"It stops proteins from crossing", why:"The membrane’s pore size does that." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"Four urinalysis results, given as volume (L/day), glucose, protein and concentration (mOsm/L):<br>P: 1.6, none, none, 380<br>Q: 1.5, none, present, 400<br>R: 7.5, none, none, 90<br>S: 2.8, present, none, 520<br>Which sample most suggests a <strong>damaged glomerulus</strong>?", options:[
          { t:"Q", ok:true, why:"Protein in urine means the filter lets large molecules through." },
          { t:"S", why:"Glucose suggests blood glucose above the threshold." },
          { t:"R", why:"Very dilute urine suggests low ADH." },
          { t:"P", why:"This is a typical result." }] },
        b:{ prompt:"Four urinalysis results, given as volume (L/day), glucose, protein and concentration (mOsm/L):<br>P: 1.6, none, none, 380<br>Q: 1.5, none, present, 400<br>R: 7.5, none, none, 90<br>S: 2.8, present, none, 520<br>Using the same four results, which sample most suggests <strong>little or no ADH</strong>?", options:[
          { t:"R", ok:true, why:"Large volume and very dilute." },
          { t:"S", why:"Glucose suggests diabetes mellitus." },
          { t:"Q", why:"Protein suggests filter damage." },
          { t:"P", why:"Typical." }] } }
    ]
  },
  task:{
    title:"Water-saving kidney", summary:"Water-saving kidney",
    statement:"<p>Set the model kidney so its urine fits a water-saving profile while still clearing wastes. There’s more than one setting that works. Can you find them all?</p>",
    checks:["Concentrated enough: urine concentration is at least 1000 mOsm/L", "Enough volume: urine volume is at least 0.5 L/day (enough to carry away wastes)", "No glucose in the urine", "No protein in the urine"],
    tips:["Raise ADH, or use a longer loop for a steeper gradient.", "Too concentrated: the volume is below 0.5 L. Ease off one setting.", "Blood glucose is above the 10 mmol/L threshold.", "A leaky filter lets protein through."],
    inputs:[
      { id:"loop", label:"Loop of Henle", options:[["short", "Short"], ["medium", "Medium (human)"], ["long", "Long"]] },
      { id:"adh", label:"ADH", options:[["none", "None"], ["moderate", "Moderate"], ["high", "High"]] },
      { id:"bg", label:"Blood glucose (mmol/L)", options:[["5", "5"], ["8", "8"], ["12", "12"]] },
      { id:"glom", label:"Glomerulus", options:[["intact", "Intact"], ["leaky", "Leaky"]] }
    ],
    model:"<strong>Model:</strong> urine concentration <em>U</em> = 100 mOsm/L with no ADH, one third of the medulla’s maximum with moderate ADH, and the maximum with high ADH (short 600, medium 1200, long 3000 mOsm/L). Urine volume <em>V</em> = 600 ÷ <em>U</em> L/day.",
    afterAll:"A steep gradient with a partly open duct, or a human gradient with a fully open duct: two routes to the same result.",
    explainPrompt:"Explain why both the loop length and ADH matter, using your working settings.",
    vocab:"Use the words loop of Henle, gradient, collecting duct, ADH and osmosis.",
    more:"There’s more than one answer. Can you find another?"
  },
  cards:[
    ["Nephron", "The kidney’s working unit: filters blood and makes urine (about a million per kidney)."],
    ["Filtration", "Blood pressure pushes water and small solutes from the glomerulus into Bowman’s capsule."],
    ["Reabsorption", "Useful substances return from the tubule to the blood (all glucose; most water and Na⁺)."],
    ["Secretion", "Extra wastes, H⁺ and K⁺ move from the blood into the tubule."],
    ["Loop of Henle", "Builds a salt gradient in the medulla; longer loops build steeper gradients."],
    ["ADH", "From the posterior pituitary; opens water channels in the collecting duct: less, concentrated urine."],
    ["Aldosterone", "From the adrenal cortex; more Na⁺ reabsorbed (K⁺ secreted); water follows."],
    ["Renin–angiotensin", "Low blood pressure → renin → angiotensin II → constriction, thirst, aldosterone."],
    ["Glucose threshold", "Above about 10 mmol/L, carriers are saturated and glucose appears in urine."],
    ["Protein in urine", "A sign of a damaged glomerulus."],
    ["Kidneys and pH", "Secrete H⁺ and reabsorb HCO₃⁻ to keep blood pH between 7.35 and 7.45."],
    ["Hemodialysis", "Blood and fluid flow in opposite directions past a membrane; the fluid has no urea but normal glucose and salts."]
  ]
};
