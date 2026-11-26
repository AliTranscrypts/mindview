// SBI4U 35 Thermoregulation. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/35-thermoregulation.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "In the cold, skin arterioles narrow so less warm blood reaches the surface and less heat is lost.";
const M2 = "Sweat cools only when it evaporates: evaporation takes heat from the skin.";
const M3 = "In a fever the hypothalamus raises the set point, and the loop works normally around the new target.";
const M4 = "Ectotherms get most of their heat from the surroundings, but they regulate by behaviour, and many run warm in the sun.";
const M5 = "Shivering is rapid muscle contraction; it releases heat.";
const M6 = "Dehydration limits sweating, and humid air slows evaporation, so cooling falls behind.";
const M7 = "Skin and core thermoreceptors report to the hypothalamus, which decides.";

export default {
  id:"35-thermoregulation",
  kind:"topic",
  title:"Thermoregulation",
  topic:"Thermoregulation",
  readyTopic:"thermoregulation",
  hero:{
    eq:"Core ≈ 37 °C",
    eqLabel:"Core temperature about 37 degrees Celsius",
    eqSize:"md",
    headline:"37 °C at −30 °C and at 40 °C",
    text:"From a February morning in Thunder Bay to a July heat wave in Windsor, your core stays close to <strong>37 °C</strong>. The <strong>hypothalamus</strong> compares readings from <strong>thermoreceptors</strong> with a <strong>set point</strong> and calls on <strong>effectors</strong>: skin blood vessels, sweat glands, muscles and, over weeks, the thyroid. In this module you’ll push the system to its limits and see what happens when it can’t keep up.",
    fig:{ html:'<div class="thr-hero" id="thr-hero" role="img" aria-label="An outdoor thermometer slides from −30 °C to 40 °C. Between two panels a core thermometer stays locked at 37 °C under a small hypothalamus icon. At the cold end, in the Too cold panel, the skin vessel narrows and a muscle shivers. In the middle the vessels relax. At the hot end, in the Too hot panel, the skin vessel widens and sweat droplets appear and evaporate, with wavy heat arrows leaving the skin. The core still reads 37 °C."></div>' }
  },
  goals:[
    "I can name the receptors, control centre and effectors that regulate body temperature.",
    "I can explain how vasodilation, sweating, vasoconstriction and shivering change heat gain or loss.",
    "I can predict core temperature when the heat load from the surroundings, exercise and clothing changes.",
    "I can explain a fever as a raised set point, including chills and the “break”.",
    "I can compare how endotherms and ectotherms regulate temperature and explain adaptations to cold.",
    "I can design a fair investigation of a temperature response."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Feedback loops", goal:1,
          prompt:"In temperature control, which structure compares body temperature with the set point?",
          options:[
            { t:"The hypothalamus", ok:true, why:"It’s the control centre." },
            { t:"The skin", why:"Skin has receptors; it doesn’t decide." },
            { t:"The sweat glands", why:"They’re effectors." },
            { t:"The heart", why:"It pumps blood; it doesn’t set temperature." }],
          hints:["Which part of the brain links nerves and hormones?", "It sits above the pituitary.", "Hypothalamus."] },
        { id:"w2", skill:"Feedback loops", goal:1,
          prompt:"Body temperature rises and the response brings it back down. What kind of feedback is this?",
          options:[
            { t:"Negative feedback", ok:true, why:"The response opposes the change." },
            { t:"Positive feedback", why:"That would push it higher still." },
            { t:"No feedback", why:"There’s a response to a change, so it’s a loop." },
            { t:"Negative, because the temperature went down", why:"It’s negative because it opposes the change; a fall back after a rise is just one example." }],
          hints:["Does the response oppose or amplify?", "It opposes.", "Negative."] },
        { id:"w3", skill:"Heat transfer", goal:2,
          prompt:"Which process releases the most heat when you’re cold?",
          options:[
            { t:"Rapid muscle contractions (shivering)", ok:true, why:"Muscle activity releases heat." },
            { t:"Sweating", why:"Sweating removes heat." },
            { t:"Widening skin blood vessels", why:"That increases heat loss." },
            { t:"Shivering, because it shows you’re losing heat", why:"Shivering <em>makes</em> heat; it isn’t a sign of heat loss." }],
          hints:["Where does body heat come from?", "Cellular respiration in active muscle.", "Shivering."] },
        { id:"w4", skill:"Heat transfer", goal:2,
          prompt:"Your hands look pale on a cold day. Why?",
          options:[
            { t:"Skin arterioles narrowed, so less warm blood reaches the skin", ok:true, why:"Vasoconstriction keeps heat in the core." },
            { t:"Skin arterioles widened to warm the skin", why:"Widening would make the skin red and lose more heat." },
            { t:"The blood itself turned cooler and paler", why:"The colour change comes from less blood, not cooler blood." },
            { t:"Sweat covered the skin", why:"You don’t sweat when cold." }],
          hints:["Less blood in the skin means paler skin.", "Why would the body send less blood there?", "To lose less heat: vasoconstriction."] },
        { id:"w5", skill:"Reading variables", goal:6,
          prompt:"A student measures skin temperature every minute after a hand is taken out of cold water. What is the <strong>dependent</strong> variable?",
          options:[
            { t:"Skin temperature", ok:true, why:"It’s what is measured." },
            { t:"Time", why:"Time is the independent variable here." },
            { t:"The water temperature", why:"It was set before the test, so it’s a controlled variable." },
            { t:"The student’s hand", why:"That’s what is studied, not a variable." }],
          hints:["What does the student record?", "The reading at each minute.", "Skin temperature."] },
        { id:"w6", skill:"Reading variables", goal:6,
          prompt:"Which variable should the student keep the same in every trial?",
          options:[
            { t:"How long the hand stays in the water", ok:true, why:"Controlled variables must be kept constant." },
            { t:"The skin temperature", why:"That’s measured, not kept constant." },
            { t:"The time after removal", why:"That’s the independent variable." },
            { t:"Nothing; variety makes it fairer", why:"Uncontrolled changes make the results hard to compare." }],
          hints:["Which variable could change the result if it differed?", "Think about the cold exposure.", "Time in the water."] }
      ],
      refreshers:{
        "Feedback loops":"Stimulus → receptor → control centre → effector → response. For temperature the control centre is the hypothalamus, and the loop is negative feedback.",
        "Heat transfer":"Active muscles release heat. Blood carries heat to the skin, where it is lost to cooler air; evaporating sweat takes heat with it.",
        "Reading variables":"Independent: what you change. Dependent: what you measure. Controlled: what you keep the same."
      }
    }
  },
  explore:{
    heading:"Body temperature control room",
    intro:"Set the weather, the clothing and the activity. Watch which responses the hypothalamus calls on, and whether the core stays at 37 °C.",
    modelNote:"Teaching model: heat load is counted in whole units, and each unit the body can’t handle moves the core 1 °C. Real bodies respond gradually.",
    predIntro:"Make a prediction first. Then the control room will show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Start: −30 °C, T-shirt, no hat, resting. Predict the core temperature.",
        options:[{ t:"34 °C", ok:true }, { t:"37 °C" }, { t:"36 °C" }, { t:"30 °C" }],
        explain:"The load is −6 but the body can handle only 3 units. Three units short means 3 °C below 37.",
        start:{ surr:-30, clo:"tee", hat:"off", act:"rest", water:"hyd", weeks:"off" }, mask:true, to:{} },
      { id:"p2", prompt:"Start: −10 °C, sweater, no hat, resting (shivering is on). The person starts running. What happens to shivering?",
        options:[{ t:"It stops", ok:true }, { t:"It gets stronger" }, { t:"It stays the same" }, { t:"It stops, and sweating starts" }],
        explain:"Running releases heat, so the hypothalamus no longer needs shivering to make it.",
        start:{ surr:-10, clo:"sweater", hat:"off", act:"rest", water:"hyd", weeks:"off" }, to:{ act:"run" } },
      { id:"p3", prompt:"Start: 40 °C, T-shirt, no hat, running, hydrated (core 38 °C). Now the runner is dehydrated. Predict the core.",
        options:[{ t:"40 °C", ok:true }, { t:"38 °C" }, { t:"37 °C" }, { t:"39 °C" }],
        explain:"The load is +5. Hydrated, the body can handle 4; dehydrated, only 2. Three units are left over.",
        start:{ surr:40, clo:"tee", hat:"off", act:"run", water:"hyd", weeks:"off" }, to:{ water:"dehyd" } },
      { id:"p4", prompt:"Start: Fever mode, hour 0, a 20 °C room. The set point jumps to 39 °C. What does the person feel and do first?",
        options:[{ t:"Feel cold and shiver, even in a warm room", ok:true }, { t:"Feel hot and sweat" }, { t:"Feel nothing until the temperature reaches 39" }, { t:"Feel cold, so the fever is making them cooler" }],
        explain:"The hypothalamus compares 37 with a target of 39: “too cold”. Chills are the loop doing its job.",
        fever:true }
    ],
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"At −10 °C, standing still, keep the core at 37 °C <strong>with no shivering at all</strong>.",
        why:"A parka adds 3: the load is −1 (or 0 with a hat), so vasoconstriction alone is enough.",
        general:"Set the surroundings to −10 °C and the activity to Resting, then change the clothing.",
        hints:["Shivering switches on at a load of −2.", "You need the load to be −1 or 0.", "A parka adds 3: −4 + 3 = −1."] },
      { id:"tc2", goal:3, prompt:"It’s 40 °C and the person is dehydrated, in a T-shirt and no hat. What is the hardest activity they can do and still stay at 37 °C?",
        why:"Resting keeps the load at +2: vasodilation 1 + sweating 1 is all a dehydrated body can handle.",
        general:"Set 40 °C, Dehydrated, T-shirt and no hat, then choose the activity.",
        hints:["Dehydrated capacity: vasodilation 1 + sweating 1.", "The heat already gives +2.", "Only resting keeps the load at 2."] },
      { id:"tc3", goal:4, stretch:true, prompt:"Fever mode. Before you press Play, mark which responses will be on during the <strong>chills</strong> (hours 1–2) and which during the <strong>break</strong> (hours 5–6).",
        why:"Chills: the core is below the raised target, so vasoconstriction and shivering warm the body. Break: the core is above the restored target, so vasodilation and sweating cool it.",
        general:"Mark every response that runs in each phase, and only those.",
        hints:["Compare the core with the set point at each time.", "Chills: core 37 or 38 with a target of 39 → too cold. Break: core 39 with a target of 37 → too hot.", "Chills: warming responses; break: cooling responses."] }
    ]
  },
  part3:{
    slug:"cold", name:"Animals in the cold", heading:"Animals in the cold",
    intro:"Other animals solve the same problem in different ways. Use the same principles (heat gain, heat loss and a set point) to read four Canadian solutions.",
    s1:{ title:"Station 1: endotherm or ectotherm? Check it with data",
      how:"Body temperature against the surrounding temperature for two animals. Tap the graph, or use the buttons under it.",
      steps:[
        { id:"endo", q:"Tap the line that shows an <strong>endotherm</strong>.", ok:"✓ Line A stays near 37 °C whatever the surroundings: the animal makes its own heat by metabolism." },
        { id:"ecto", q:"Tap the line that shows an <strong>ectotherm</strong>.", ok:"✓ Line B follows the surroundings: the animal gets most of its heat from outside." },
        { id:"beh", q:"Tap the stretch that shows <strong>behavioural regulation</strong>.", ok:"✓ Between about 24 °C and 34 °C line B levels off near 30 °C: the snake basks when it’s cool and moves into shade when it’s hot." }],
      wrong:{
        endo:"Line B follows the surroundings: that animal’s heat comes mostly from outside.",
        ectoA:"Line A stays near 37 °C whatever the surroundings: that animal makes its own heat.",
        behA:"Line A is flat because the mouse makes its own heat, not because of behaviour.",
        behB:"Most of line B follows the surroundings. Find where it levels off." },
      reveal:"Animal A is a mouse; animal B is a garter snake. Ectotherms get most of their heat from outside, but they still regulate." },
    s2:{ title:"Station 2: countercurrent exchange",
      how:"A duck stands on ice. Its leg has an artery (warm blood flowing down) and a vein (cold blood flowing up). Switch the vessels between side by side and apart.",
      on:"Heat passes from the artery to the vein all along the leg. The blood reaching the foot is already cool, so the foot loses little heat to the ice, and the blood returning to the body is rewarmed.",
      off:"With the vessels apart, warm blood reaches the foot and loses its heat to the ice, and cold blood returns to the body." },
    s3:{ title:"Station 3: brown fat (zoom to the molecules)",
      steps:[
        "A brown-fat cell: many small fat droplets and many mitochondria, which give the tissue its colour.",
        "Zoom in to one mitochondrion. Its electron transport chain pumps H⁺ out of the matrix, building a gradient across the inner membrane.",
        "A protein in the inner membrane, <strong>thermogenin</strong>, lets H⁺ flow back into the matrix <strong>without</strong> passing through ATP synthase, so the gradient’s energy is released as <strong>heat</strong> (module 17).",
        "Brown fat is found in newborns and in hibernating mammals: heat without shivering."] },
    s4:{ title:"Station 4: hibernation",
      how:"A Richardson’s ground squirrel’s year on the Prairies. Add the black bear for contrast.",
      text:"In winter torpor the squirrel’s body temperature falls to a few degrees above the burrow temperature, with brief rewarming bouts. The set point itself is lowered: this is regulation at a new target, not failure.",
      bear:"A black bear’s temperature drops only a few degrees during its winter sleep." },
    quickCheck:{
      title:"Quick check", summary:"Animals in the cold quick check",
      items:[
        { id:"q1", goal:5, prompt:"A lizard basks in the morning sun. What kind of regulation is this?",
          right:"Moving to warmth is behaviour; it regulates temperature.", wrong:"Moving to warmth is behaviour; it regulates temperature.",
          choices:[{ t:"Behavioural", ok:true }, { t:"Shivering" }, { t:"Sweating" }, { t:"None" }] },
        { id:"q2", goal:5, prompt:"Why do arteries and veins run side by side in a goose’s legs?",
          right:"The foot stays cool, so it loses little heat to the ice.", wrong:"The foot stays cool, so it loses little heat to the ice.",
          choices:[{ t:"So heat passes from outgoing to returning blood", ok:true }, { t:"So the feet stay warm" }, { t:"So blood flows faster" }, { t:"So the legs can shiver" }] },
        { id:"q3", goal:5, prompt:"Brown fat makes heat because its mitochondria…",
          right:"The gradient’s energy becomes heat instead of ATP.", wrong:"The gradient’s energy becomes heat instead of ATP.",
          choices:[{ t:"let H⁺ leak back without making ATP", ok:true }, { t:"make extra ATP" }, { t:"store more glucose" }, { t:"have no electron transport chain" }] },
        { id:"q4", goal:5, prompt:"During hibernation, a ground squirrel’s set point…",
          right:"Its temperature is still regulated, around a new, lower target.", wrong:"Its temperature is still regulated, around a new, lower target.",
          choices:[{ t:"is lowered", ok:true }, { t:"stays at 37 °C but the loop fails" }, { t:"rises" }, { t:"disappears" }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Warm, cool or neither?", summary:"Warm, cool or neither", goal:[1, 2], txt:true, noun:"response",
        instruction:"Sort each response by what it does to body temperature.",
        how:"Tap a response, then tap its box.",
        boxes:[{ id:"warm", label:"Warms the body" }, { id:"cool", label:"Cools the body" }, { id:"none", label:"Neither" }],
        wrongDefault:"Does it add heat, keep heat in, or get rid of heat?",
        items:[
          { id:"i1", t:"Shivering", answer:"warm", why:"Rapid muscle contractions release heat." },
          { id:"i2", t:"Skin arterioles narrow", answer:"warm", why:"Warms the body by keeping heat in: less warm blood reaches the skin.",
            wrong:{ cool:"Narrow vessels mean less heat reaching the skin, so heat is kept in." } },
          { id:"i3", t:"Sweating", answer:"cool", why:"Evaporating sweat takes heat from the skin." },
          { id:"i4", t:"Skin arterioles widen", answer:"cool", why:"More warm blood at the surface, where heat is lost.",
            wrong:{ warm:"Wide vessels send warm blood to the skin, where it’s lost." } },
          { id:"i5", t:"More thyroid hormone over several weeks", answer:"warm", why:"Thyroid hormone raises metabolic rate, so more heat is made.",
            hints:["What does thyroid hormone do to metabolism?", "It raises it.", "More metabolism, more heat: warms."] },
          { id:"i6", t:"A dog panting", answer:"cool", why:"Air over a wet tongue speeds evaporation, which removes heat.",
            hints:["Panting moves air over a wet tongue.", "Evaporation.", "Cools."] },
          { id:"i7", t:"Moving into shade", answer:"cool", why:"Behaviour: less heat is gained from the sun." },
          { id:"i8", t:"Putting on a hat", answer:"warm", why:"Behaviour: less heat is lost from the head." },
          { id:"i9", t:"Producing more urine", answer:"none", why:"Urine output is about water balance, not temperature.",
            wrong:{ warm:"Urine output is about water balance, not temperature.", cool:"Urine output is about water balance, not temperature." } },
          { id:"i10", t:"Skin thermoreceptors sending signals", answer:"none", why:"They detect; they don’t change temperature.",
            wrong:{ warm:"Receptors report; they don’t act.", cool:"Receptors report; they don’t act." } }
        ] },
      { id:"heat", type:"custom", title:"Heat scenarios", summary:"Heat scenarios", star:true, goal:[2, 3, 6],
        instruction:"Six problems on the control-room model, sweat and fair tests. S3 to S6 are non-routine (★); S5 and S6 go beyond the Final Check.",
        how:"",
        items:[
          { id:"s1", kind:"num", goal:3, prompt:"In the model, what is the core temperature at 20 °C, T-shirt, no hat, walking?",
            answer:37, display:"37 °C", unit:"°C",
            why:"Load −1 + 1 = 0: no responses needed.",
            general:"Load −1 + 1 = 0: no responses needed.",
            hints:["Add up the load: surroundings, clothing, hat and activity.", "20 °C gives −1; walking gives +1.", "Load 0, so the core stays at 37 °C."] },
          { id:"s2", kind:"num", goal:3, prompt:"In the model, a hydrated person runs at 30 °C in a T-shirt. How much sweat do they lose per hour?",
            answer:1, display:"1 L per hour", unit:"L/h",
            why:"Load +3: vasodilation handles 1 and sweating 2 units; 2 × 0.5 = 1 L/h.",
            general:"Load +3: vasodilation handles 1 and sweating 2 units; 2 × 0.5 = 1 L/h.",
            hints:["30 °C gives 0 and running gives +3.", "Vasodilation handles 1 unit; sweating handles the rest.", "2 sweating units × 0.5 L/h = 1 L/h."] },
          { id:"s3", kind:"num", goal:6, star:true, prompt:"A runner weighs 60.0 kg before a 1-hour run in the heat and 58.8 kg after. They drank 0.5 L during the run. About how much sweat did they lose? (1 L of water ≈ 1 kg)",
            answer:1.7, display:"1.7 L", unit:"L",
            why:"Mass lost 1.2 kg = 1.2 L, plus the 0.5 L drunk: 1.7 L.",
            wrong:[{ match:1.2, fb:"Add the water drunk: it was lost too." }],
            general:"Sweat = mass lost + water drunk.",
            hints:["Mass lost = sweat − water drunk.", "Sweat = mass lost + water drunk.", "1.2 + 0.5 = 1.7 L."] },
          { id:"s4", kind:"mc", goal:2, star:true, prompt:"Two days are both 32 °C, one dry and one very humid. On which day does the core rise more during the same run, and why?",
            options:[
              { t:"The humid day; sweat evaporates more slowly in humid air, so less heat is removed", ok:true, why:"Humid air slows evaporation, so sweating removes less heat." },
              { t:"The dry day; dry air pulls the sweat away before it can cool the skin", why:"Dry air speeds evaporation." },
              { t:"Neither; the air temperature is the same, so the core rises the same", why:"The temperature matches, but the evaporation doesn’t." },
              { t:"The humid day; humid air holds more heat at the same temperature", why:"The air temperature is the same; evaporation is what differs." }],
            hints:["How does sweat remove heat?", "By evaporating.", "Evaporation is slower in humid air: the humid day."] },
          { id:"s5", kind:"mc", goal:6, star:true, prompt:"Design check: a student tests whether a wool or a cotton glove keeps a hand warmer in ice water. Which plan is fair?",
            options:[
              { t:"The same hand, alternating gloves on different days, the same water temperature and time, skin temperature measured with the same probe", ok:true, why:"Only the glove changes; everything else is controlled." },
              { t:"Wool on one student, cotton on another, in the same ice water", why:"Two hands differ in more than the glove." },
              { t:"The same hand, wool in ice water and cotton in cool tap water", why:"Change only the glove: keep the water temperature the same." },
              { t:"The same hand, wool for 1 minute and cotton for 5 minutes", why:"Keep the time in the water the same." }],
            hints:["What is the independent variable?", "The glove material. Everything else must stay the same.", "Same hand, same water, same time, same probe."] },
          { id:"s6", kind:"mc", goal:3, star:true, fixedOrder:true, prompt:"In the model at −30 °C, resting, with weeks in the cold on, which is the least clothing that keeps the core at 37 °C?",
            options:[
              { t:"T-shirt, no hat", why:"Load −6 is two units beyond the 4 the body can handle." },
              { t:"T-shirt with a hat", why:"Load −5 is one unit beyond the 4 the body can handle." },
              { t:"Sweater, no hat", why:"Load −5 is one unit beyond the 4 the body can handle." },
              { t:"Sweater with a hat", ok:true, why:"Load −4, exactly the capacity of 4." },
              { t:"Parka, no hat", why:"That works, but it isn’t the least clothing." },
              { t:"Parka with a hat", why:"That works, but it isn’t the least clothing." }],
            hints:["Weeks in the cold raises warming capacity to 4.", "The load must be −4 or higher: −6 + clothing + hat ≥ −4.", "A sweater (+1) and hat (+1) give −4: sweater with a hat."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Talia", how:"",
        instruction:"Talia made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Explain how the body keeps warm on a cold day.",
            steps:["Thermoreceptors detect a fall in skin and core temperature.", "The hypothalamus sends signals to the effectors.", "Skin arterioles widen so warm blood heats the skin.", "Skeletal muscles shiver and release heat."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 is correct."],
            fixes:[
              { t:"Skin arterioles narrow so less warm blood reaches the skin and less heat is lost.", ok:true, why:M1 },
              { t:"Skin arterioles widen so the skin feels warmer.", why:M1 },
              { t:"Skin arterioles close completely forever.", why:"They narrow, and reopen as conditions change." },
              { t:"Step 3 is correct.", why:"Wider vessels would lose more heat." }],
            hints:["Where is heat lost: core or skin?", "Less blood at the surface means less heat lost.", "Vasoconstriction."] },
          { id:"e2", goal:4, task:"Explain why a person with a fever shivers.",
            steps:["Chemicals released during an infection reach the hypothalamus.", "The infection breaks the temperature control loop.", "So the body overheats.", "Shivering adds even more heat."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2, but the mistake is earlier.", "This follows the earlier mistake."],
            fixes:[
              { t:"The hypothalamus raises the set point, so a normal 37 °C is now “too cold” and warming responses switch on.", ok:true, why:M3 },
              { t:"The infection lowers the set point.", why:"Then the person would sweat, not shiver." },
              { t:"The muscles are infected and twitch.", why:"Shivering is controlled by the hypothalamus." },
              { t:"Step 2 is correct.", why:"The loop still works; the target moved." }],
            hints:["Is the loop broken, or is it aiming at something new?", "Shivering is a normal response to “too cold”.", "A raised set point."] },
          { id:"e3", goal:2, task:"Explain the result: a hiker shivers at −10 °C, then stops shivering after starting to jog.",
            steps:["At −10 °C the body loses heat faster than at rest indoors.", "Shivering showed that the hiker was cooling down because shivering removes heat.", "Jogging released heat from the leg muscles.", "So shivering was no longer needed."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 is correct.", "Step 4 is correct."],
            fixes:[
              { t:"Shivering is a heat-making response: muscles contract quickly and release heat.", ok:true, why:M5 },
              { t:"Shivering showed that the hiker was dehydrated.", why:"Dehydration affects sweating, not shivering." },
              { t:"Shivering cools the core to save energy.", why:M5 },
              { t:"Step 2 is correct.", why:"Shivering adds heat." }],
            hints:["What does muscle activity release?", "Heat.", "Shivering makes heat."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the control room: the fever chills, or how much water mattered in the heat?" },
      { id:"j2", q:"In your own words, why does a dry wind cool you faster than still, humid air?" },
      { id:"j3", q:"Explain to a friend the order in which the body calls on its warming responses." },
      { id:"j4", q:"What’s one part of thermoregulation you’re still unsure about? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which structure is the control centre for body temperature?", options:[
          { t:"The hypothalamus", ok:true, why:"It compares readings from the thermoreceptors with the set point and calls on the effectors." },
          { t:"The thyroid gland", why:"It’s an effector for long-term heat production." },
          { t:"Thermoreceptors in the skin", why:"They detect. " + M7 },
          { t:"The pituitary gland", why:"It isn’t the temperature control centre." }] },
        b:{ prompt:"Which structures act as <strong>effectors</strong> when the body is too warm?", options:[
          { t:"Sweat glands and skin arterioles", ok:true, why:"Sweating and vasodilation carry out the cooling." },
          { t:"Thermoreceptors in the skin", why:M7 },
          { t:"The hypothalamus", why:"It’s the control centre." },
          { t:"Skeletal muscles", why:"They shiver when you’re cold." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"When the body is too cold, what happens to arterioles in the skin?", options:[
          { t:"They narrow, reducing blood flow to the skin", ok:true, why:"Vasoconstriction keeps warm blood in the core, so less heat is lost." },
          { t:"They widen to warm the skin", why:M1 },
          { t:"They widen so the skin turns red", why:"Redness comes from widening in the heat. " + M1 },
          { t:"They stay the same; only shivering changes", why:"Vasoconstriction comes first." }] },
        b:{ prompt:"When the body is too warm, what happens to arterioles in the skin?", options:[
          { t:"They widen, sending more blood to the skin to lose heat", ok:true, why:"Vasodilation brings warm blood to the surface, where heat is lost." },
          { t:"They narrow to keep heat inside", why:"Narrowing is the cold response; in the heat they widen." },
          { t:"They narrow so sweat can form", why:"Sweat comes from glands, not from narrowing." },
          { t:"They stay the same; only sweating changes", why:"Vasodilation comes first." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"Which best describes an <strong>ectotherm</strong>?", options:[
          { t:"Its body temperature depends mostly on heat from the surroundings, and it regulates mainly by behaviour", ok:true, why:"Basking and seeking shade are how ectotherms regulate." },
          { t:"It is always colder than its surroundings", why:M4 },
          { t:"It makes most of its heat by metabolism", why:"That’s an endotherm." },
          { t:"It can’t regulate its temperature at all", why:M4 }] },
        b:{ prompt:"Which best describes an <strong>endotherm</strong>?", options:[
          { t:"It makes most of its body heat by metabolism and keeps a fairly constant core temperature", ok:true, why:"Mammals and birds make their own heat and hold a set point." },
          { t:"Its temperature follows the surroundings", why:"That’s an ectotherm." },
          { t:"It never needs to change its behaviour", why:"Endotherms use behaviour too." },
          { t:"It is always warmer than an ectotherm", why:"A basking lizard can be warmer than a cold mammal’s skin." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Two runners do the same run at 38 °C, one hydrated and one dehydrated. Why does the dehydrated runner’s core temperature rise more?", options:[
          { t:"Less water is available for sweat, so less heat is removed by evaporation", ok:true, why:M6 },
          { t:"Dehydration raises the set point", why:"The set point hasn’t changed." },
          { t:"Dehydrated muscles make less heat", why:"That would lower the core, not raise it." },
          { t:"Sweat from a dehydrated runner is warmer", why:"Cooling comes from evaporation, not sweat temperature." }] },
        b:{ prompt:"The same run is done on two 32 °C days, one dry and one humid. Why does the core rise more on the humid day?", options:[
          { t:"Sweat evaporates more slowly in humid air, so less heat is removed", ok:true, why:M6 },
          { t:"Humid air makes the body sweat less", why:"The body may sweat more, but it doesn’t evaporate." },
          { t:"Humid air contains more heat at the same temperature, which the body absorbs", why:"The air temperature is the same; evaporation is what differs." },
          { t:"Humidity lowers the set point", why:M3 }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"During a fever, why does a person shiver in a warm room?", options:[
          { t:"The set point is raised, so the hypothalamus treats normal body temperature as too cold", ok:true, why:M3 },
          { t:"Thermoregulation has failed", why:M3 },
          { t:"The infection makes the muscles twitch", why:"Shivering is ordered by the hypothalamus." },
          { t:"The room feels cold because the skin is wet", why:"Shivering starts before any sweating." }] },
        b:{ prompt:"When a fever breaks, why does a person sweat heavily?", options:[
          { t:"The set point returns to normal while the core is still high, so cooling responses switch on", ok:true, why:"A core of 39 °C against a target of 37 °C counts as too hot." },
          { t:"The infection releases water", why:"Sweat comes from sweat glands." },
          { t:"The set point rises even higher", why:"Then they’d shiver." },
          { t:"The loop stops working, so heat escapes", why:M3 }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"An Arctic fox’s feet stay near freezing while its core is 37 °C. In its legs, arteries and veins lie side by side. How does this help?", options:[
          { t:"Heat passes from warm arterial blood to cold venous blood, so little heat reaches the feet and is lost", ok:true, why:"Countercurrent exchange keeps the heat in the body." },
          { t:"The feet have no blood flow at all", why:"They need blood, just cooler blood." },
          { t:"Veins carry warm blood down to keep the feet warm", why:"Veins carry blood back toward the heart." },
          { t:"The feet make heat by shivering", why:"That wouldn’t keep them near freezing." }] },
        b:{ prompt:"A newborn has deposits of brown fat. How does brown fat keep the baby warm?", options:[
          { t:"Its mitochondria let H⁺ leak back across the inner membrane, so the energy is released as heat instead of making ATP", ok:true, why:"Thermogenin lets H⁺ bypass ATP synthase." },
          { t:"It insulates like a thick blanket", why:"All fat insulates; brown fat actively makes heat." },
          { t:"It stores extra glucose for shivering", why:"Newborns shiver very little." },
          { t:"It contains more blood, which is warm", why:"Its heat comes from the mitochondria." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of how sweating cools the body?", options:[
          { t:"“As sweat evaporates, it absorbs heat from the skin, cooling the blood flowing there.”", ok:true, why:M2 },
          { t:"“Sweat is cooler than the body, so it chills the skin.”", why:M2 },
          { t:"“Sweating removes hot water from the blood.”", why:"The cooling happens when it evaporates." },
          { t:"“Sweating slows heat production in the muscles.”", why:"It increases heat loss; it doesn’t change production." }] },
        b:{ prompt:"Which is the best explanation of why goosebumps barely warm a human?", options:[
          { t:"“Raised hairs trap a layer of air in furry mammals, but human body hair is too sparse to trap much.”", ok:true, why:"The response works by trapping air, and humans have too little hair for it." },
          { t:"“Goosebumps release heat from the skin.”", why:"They’re tiny muscle contractions with little heat." },
          { t:"“Goosebumps narrow the blood vessels.”", why:"That’s a separate response." },
          { t:"“Goosebumps only happen in fear, not cold.”", why:"They happen in both." }] } },
      { id:"c2", cat:"C", goal:[1, 2],
        a:{ prompt:"Which flow chart correctly shows the response to a fall in core temperature?", options:[
          { t:"↓ temperature → thermoreceptors → hypothalamus → skin arterioles and skeletal muscles → vasoconstriction and shivering → temperature rises", ok:true, why:"Detect, decide, act: the warming effectors bring the temperature back up." },
          { t:"↓ temperature → skeletal muscles → hypothalamus → thermoreceptors → shivering → temperature rises", why:"The detect, decide, act order is scrambled." },
          { t:"↓ temperature → thermoreceptors → hypothalamus → sweat glands → sweating → temperature rises", why:"Sweating cools." },
          { t:"↓ temperature → thermoreceptors → hypothalamus → skin arterioles → vasodilation → temperature rises", why:M1 }] },
        b:{ prompt:"Which flow chart correctly shows the response to a rise in core temperature?", options:[
          { t:"↑ temperature → thermoreceptors → hypothalamus → sweat glands and skin arterioles → sweating and vasodilation → temperature falls", ok:true, why:"Detect, decide, act: the cooling effectors bring the temperature back down." },
          { t:"↑ temperature → sweat glands → thermoreceptors → hypothalamus → temperature falls", why:"Order scrambled." },
          { t:"↑ temperature → thermoreceptors → hypothalamus → skeletal muscles → shivering → temperature falls", why:"Shivering warms." },
          { t:"↑ temperature → thermoreceptors → hypothalamus → skin arterioles → vasoconstriction → temperature falls", why:"Narrowing keeps heat in; in the heat the arterioles widen." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"During a heat warning, public health advice says to drink water often and rest in the shade during the hottest hours. Using thermoregulation, why?", options:[
          { t:"Water keeps sweating going, and shade and rest lower the heat load the body has to remove", ok:true, why:M6 },
          { t:"Water lowers the set point", why:M3 },
          { t:"Shade increases sweating", why:"Shade reduces heat gained from the sun." },
          { t:"Rest makes the skin’s vessels narrow", why:"Rest lowers heat production." }] },
        b:{ prompt:"Outdoor workers on a −25 °C day are advised to wear layers and take warm-up breaks. Using thermoregulation, why?", options:[
          { t:"Layers reduce heat loss, and breaks prevent the heat loss from exceeding what vasoconstriction and shivering can make up", ok:true, why:"Each warming response has a limit; layers and breaks keep the load within it." },
          { t:"Layers make the body sweat, which warms it", why:M2 },
          { t:"Breaks raise the set point", why:M3 },
          { t:"Layers stop shivering, which wastes energy", why:"Shivering is a useful heat source; layers reduce the need for it." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A student tests how long skin temperature takes to recover after a hand is held in 10 °C water. Which should be the <strong>controlled</strong> variables?", options:[
          { t:"The water temperature and how long the hand stays in the water", ok:true, why:"Both could change the result, so both stay the same." },
          { t:"The skin temperature and the recovery time", why:"Those are measured." },
          { t:"The time after removal", why:"That’s the independent variable for the graph." },
          { t:"Nothing; each trial should differ", why:"Uncontrolled differences make results unfair." }] },
        b:{ prompt:"A student tests whether a fan cools a wet arm faster than a dry arm. What is the <strong>independent</strong> variable?", options:[
          { t:"Whether the arm is wet or dry", ok:true, why:"It’s what the student changes." },
          { t:"The fan speed", why:"It should stay the same: controlled." },
          { t:"Skin temperature", why:"That’s measured: dependent." },
          { t:"The room temperature", why:"It should be controlled." }] } }
    ]
  },
  task:{
    title:"Winter hike", summary:"Winter hike",
    statement:"<p>Plan a hiker’s outfit and pace for a −10 °C morning so their body doesn’t have to work hard. There’s more than one plan that works. Can you find them all?</p><ol class=\"thr-conds\"><li>The core stays at 37 °C.</li><li>No shivering.</li><li>No sweating (sweat-soaked layers lose their insulation in the cold).</li><li>The hiker keeps moving: walking or running.</li><li>Arms are covered (no T-shirt alone).</li></ol><p class=\"tiny muted\">The surroundings are fixed at −10 °C and the hiker is hydrated.</p>",
    inputs:[
      { id:"clo", label:"Clothing", options:[["tee", "T-shirt"], ["sweater", "Sweater"], ["parka", "Parka"]] },
      { id:"hat", label:"Hat", options:[["off", "Off"], ["on", "On"]] },
      { id:"act", label:"Activity", options:[["rest", "Resting"], ["walk", "Walking"], ["run", "Running"]] }],
    checks:["Core at 37 °C", "No shivering", "No sweating", "Keeps moving", "Arms covered"],
    tips:["The load is beyond what the body can handle; add clothing or move faster.", "Shivering means the load is −2 or lower: add a layer, a hat or pace.", "Sweating means the load is +2 or higher: take something off or slow down.", "Resting isn’t hiking.", "Cover your arms."],
    explainPrompt:"Explain why adding a hat could turn a failing plan into a working one, and why too much clothing could also fail.",
    vocab:"Use the words heat load, shivering, sweating, vasoconstriction and set point.",
    more:"There’s more than one plan that works. Can you find them all?",
    afterAt:5,
    after3:"Every answer keeps the load between −1 and +1. More clothing calls for less pace."
  },
  cards:[
    ["Control centre for temperature", "The hypothalamus, comparing readings with a set point near 37 °C."],
    ["Vasoconstriction", "Skin arterioles narrow; less blood at the surface; heat kept in."],
    ["Vasodilation", "Skin arterioles widen; more blood at the surface; heat lost."],
    ["Shivering", "Rapid skeletal muscle contractions that release heat."],
    ["Sweating", "Evaporation of sweat removes heat. It needs water and dry enough air."],
    ["Long-term cold response", "More thyroid hormone raises metabolic rate over weeks."],
    ["Hypothermia", "Core temperature below about 35 °C."],
    ["Heat stroke", "Core temperature about 40 °C or higher; dangerous."],
    ["Fever", "A raised set point. Chills as it rises; sweating as it breaks."],
    ["Ectotherm vs endotherm", "Heat mainly from outside (regulates by behaviour) vs heat mainly from metabolism."],
    ["Countercurrent exchange", "Warm outgoing blood warms cold returning blood, so extremities lose little heat."],
    ["Brown fat", "Mitochondria leak H⁺ back without making ATP, releasing heat (thermogenin)."]
  ]
};
