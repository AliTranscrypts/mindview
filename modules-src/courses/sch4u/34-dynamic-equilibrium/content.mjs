// SCH4U 34 Dynamic Equilibrium. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/34-dynamic-equilibrium.md
// Pictures (hero rooms, the C6 particle box, the C8 concentration–time and rate–time graphs, the Part 3 stations, the
// Graph detective graph and the task preview) are drawn by app.js. The model is A ⇌ B with first-order steps both ways.

const KF = "<i>k</i><sub>f</sub>", KR = "<i>k</i><sub>r</sub>";
const RU = "mol/(L·s)";

// Misconception core sentences (plan §3)
const M1 = "The <strong>rates</strong> are equal; the concentrations are constant but usually different.";
const M2 = "Both directions keep going at the same rate; a tracer proves it.";
const M3 = "The forward rate falls until it matches the reverse rate, then stays there.";
const M4 = "If a product escapes, the reverse process can’t keep up: no equilibrium.";
const M5 = "Same temperature, same totals: same equilibrium, from either side.";
const M6 = "Equilibrium can lie far to either side; it’s about equal rates.";

const SORT_HINTS = ["Is it closed?", "Have the amounts stopped changing?", "Both must be true."];

export default {
  id:"34-dynamic-equilibrium",
  kind:"topic",
  title:"Dynamic equilibrium",
  topic:"Dynamic Equilibrium",
  readyTopic:"dynamic equilibrium",
  hero:{
    headline:"Busy, but balanced",
    text:"In a <strong>closed system</strong>, a reversible change reaches <strong>dynamic equilibrium</strong>: the forward and reverse processes run at <strong>equal rates</strong>, so the amounts stop changing. Look closely and the particles are still swapping.",
    fig:{ html:'<div class="de-hx"><svg class="de-hx-svg" id="de-hx-svg" viewBox="0 0 480 300" role="img" aria-label="A ⇌ B, with a blue forward arrow and an orange reverse arrow of equal length. Below, two rooms, A and B, are joined by a door. People start in room A and walk to room B, and some walk back. The flow from A to B starts at 30 per minute and the flow from B to A at 0 per minute; the two flows move toward each other until both read 15 per minute. The head counts then stay at 25 in room A and 75 in room B while people keep walking both ways."></svg><div class="de-hx-row"><p class="de-hx-ctr" id="de-hx-ctr" aria-live="polite"></p><button type="button" class="btn ghost sm" id="de-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can describe dynamic equilibrium: equal forward and reverse rates, constant concentrations, both processes still happening.",
    "I can explain why equilibrium needs a closed system.",
    "I can recognize physical and chemical equilibria.",
    "I can show that the same equilibrium is reached from either direction.",
    "I can interpret concentration–time and rate–time graphs for a system reaching equilibrium."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Rates and concentration", goal:5,
          prompt:"For a reaction whose rate = <i>k</i>[A], what happens to the rate as A is used up?",
          options:[
            { t:"It decreases", ok:true, why:"Less A, fewer collisions, slower rate." },
            { t:"It increases", why:"Rate depends on how much A is left." },
            { t:"It stays the same", why:"That’s only for zero order." },
            { t:"It becomes negative", why:"Rates are positive." }],
          hints:["rate = <i>k</i>[A].", "[A] goes down.", "The rate goes down."] },
        { id:"w2", skill:"Rates and concentration", goal:5,
          prompt:"rate = <i>k</i>[B], with <i>k</i> = 0.10 s<sup>−1</sup> and [B] = 0.75 mol/L. Rate?",
          options:[
            { t:"0.075 " + RU, ok:true, why:"0.10 × 0.75 = 0.075 " + RU + "." },
            { t:"7.5 " + RU, why:"That divides 0.75 by 0.10." },
            { t:"0.85 " + RU, why:"That adds them." },
            { t:"0.75 " + RU, why:"Multiply by <i>k</i>." }],
          hints:["Multiply.", "0.10 × 0.75.", "0.075."] },
        { id:"w3", skill:"Reversible changes", goal:3,
          prompt:"Which change is easily reversible?",
          options:[
            { t:"Water evaporating and condensing", ok:true, why:"Vapour condenses back to liquid: the change runs both ways." },
            { t:"Paper burning", why:"Burning can’t be undone." },
            { t:"An egg cooking", why:"Proteins change permanently." },
            { t:"Wood rotting", why:"Decomposition isn’t reversed." }],
          hints:["Which can go back the other way?", "Think of a sealed jar with water.", "Evaporation and condensation."] },
        { id:"w4", skill:"Reversible changes", goal:3,
          prompt:"In a saturated salt solution with extra solid on the bottom, which is true?",
          options:[
            { t:"Salt dissolves and crystallizes at the same rate", ok:true, why:"Dissolving = crystallizing, so the amounts stay constant." },
            { t:"No salt dissolves any more", why:"Dissolving continues. " + M2 },
            { t:"All the solid will eventually dissolve", why:"Saturated means it’s full." },
            { t:"The solution keeps getting more concentrated", why:"It stays constant." }],
          hints:["What does saturated mean?", "It holds as much as it can.", "Dissolving = crystallizing."] },
        { id:"w5", skill:"Closed and open systems", goal:2,
          prompt:"Which is a closed system?",
          options:[
            { t:"A sealed bottle of soda", ok:true, why:"Matter can’t get in or out." },
            { t:"A pot of boiling soup with no lid", why:"Steam escapes." },
            { t:"A campfire", why:"Gases leave." },
            { t:"A puddle on a sidewalk", why:"Vapour escapes." }],
          hints:["Can matter leave?", "Look for a seal.", "The sealed bottle."] },
        { id:"w6", skill:"Closed and open systems", goal:2,
          prompt:"Why does an open glass of water slowly disappear?",
          options:[
            { t:"Vapour escapes, so condensation can’t balance evaporation", ok:true, why:"The vapour leaves the system, so it can’t come back." },
            { t:"Water breaks down into H₂ and O₂", why:"That needs electrolysis." },
            { t:"The glass absorbs it", why:"Glass isn’t porous." },
            { t:"Evaporation stops at night", why:"It slows, but continues." }],
          hints:["Where does the vapour go?", "Out of the system.", "So it can’t come back."] }
      ],
      refreshers:{
        "Rates and concentration":"rate = <i>k</i> × concentration (for one-step changes). As a reactant is used up, its rate falls.",
        "Reversible changes":"Some changes can run both ways: evaporation ⇌ condensation, dissolving ⇌ crystallizing, and many reactions.",
        "Closed and open systems":"Closed: no matter enters or leaves. Only closed systems can reach equilibrium."
      }
    }
  },
  explore:{
    heading:"Two-way traffic",
    intro:"Set the forward and reverse rate constants, choose where to start, and watch the rates meet.",
    how:"Choose a system, open <strong>Settings</strong> to set " + KF + ", " + KR + ", the starting amounts and the container, then press <strong>Play</strong> or <strong>Step</strong>. <strong>Add tracer</strong> tags 10 B particles so you can follow them.",
    modes:[{ id:"chem", t:"Chemical A ⇌ B" }, { id:"phys", t:"Physical" }],
    systems:[{ id:"jar", t:"Sealed jar of water" }, { id:"sol", t:"Saturated solution with solid" }],
    containers:[{ id:"closed", t:"Closed" }, { id:"open", t:"Open (B escapes)" }],
    names:{
      chem:{ A:"A", B:"B", Al:"A", Bl:"B", fwd:"forward (A → B)", rev:"reverse (B → A)" },
      jar:{ A:"liquid", B:"vapour", Al:"Liquid water", Bl:"Water vapour", fwd:"evaporation", rev:"condensation" },
      sol:{ A:"solid", B:"dissolved", Al:"Solid salt", Bl:"Dissolved salt", fwd:"dissolving", rev:"crystallizing" }
    },
    openNote:"Open container (model): B leaves the box at 0.50 s<sup>−1</sup> × [B], as a vapour drifts away.",
    solNote:"A saturated solution is shown closed. The open case is the jar with its lid off.",
    unitNote:"Model: amounts are in mol/L in every mode; each particle stands for 0.05 mol/L.",
    predictions:[
      { id:"p1", prompt:KF + " = 0.30, " + KR + " = 0.10, start [A] = 1.00. At equilibrium, how do [A] and [B] compare?",
        options:[{ t:"Equal" }, { t:"[B] is three times [A]", ok:true }, { t:"[A] is three times [B]" }, { t:"[B] = 1.00, [A] = 0" }],
        explain:KF + "[A] = " + KR + "[B], so [B] ÷ [A] = 0.30 ÷ 0.10 = 3. " + M1 },
      { id:"p2", prompt:"Same run. At equilibrium, what is the forward rate?",
        options:[{ t:"0" }, { t:"0.075 " + RU, ok:true }, { t:"0.30 " + RU }, { t:"0.75 " + RU }],
        explain:"Both directions continue at 0.075 " + RU + ". " + M3 },
      { id:"p3", prompt:"Same <i>k</i> values, start [B] = 1.00 instead. Final [B]?",
        options:[{ t:"1.00" }, { t:"0.75", ok:true }, { t:"0.25" }, { t:"0.50" }],
        explain:"The same equilibrium is reached from the other side. " + M5 },
      { id:"p4", prompt:"Physical mode, jar of water. The lid is removed. What happens?",
        options:[{ t:"A new equilibrium" }, { t:"The liquid keeps evaporating until it’s gone", ok:true }, { t:"Evaporation stops" }, { t:"The vapour condenses back" }],
        explain:"Open system: condensation can’t catch up. " + M4 }
    ],
    chalIntro:"Set up the box to meet each goal, then press <strong>Check challenge</strong>. You can test your setup with <strong>Play</strong> first. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 5], prompt:"Starting from [A] = 1.00 and [B] = 0, make [B] = 0.80 mol/L at equilibrium.",
        why:"[B] ÷ [A] = 0.80 ÷ 0.20 = 4 = " + KF + " ÷ " + KR + ": " + KF + " = 0.40, " + KR + " = 0.10.",
        general:"At equilibrium, [B] ÷ [A] = " + KF + " ÷ " + KR + ". Which ratio gives [B] = 0.80?",
        hints:["[B] ÷ [A] at equilibrium is 0.80 ÷ 0.20.", "That ratio is 4, which must equal " + KF + " ÷ " + KR + ".", KF + " = 0.40, " + KR + " = 0.10."] },
      { id:"tc2", goal:[1, 4], prompt:KF + " = 0.30, " + KR + " = 0.10. Choose a starting mixture (total 1.00 mol/L) for which <strong>nothing changes</strong>.",
        why:"0.30 × 0.25 = 0.10 × 0.75 = 0.075 " + RU + ": the rates are equal from the start, so the mixture is already at equilibrium.",
        hints:["Nothing changes when the rates are already equal.", "0.30[A] = 0.10[B] and [A] + [B] = 1.00.", "[A] = 0.25, [B] = 0.75."] },
      { id:"tc3", goal:[4, 5], stretch:true, prompt:"Start with [A] = [B] = 0.50 (locked). Choose " + KF + " and " + KR + " so that the net reaction runs <strong>backwards</strong> (B → A) and ends with [A] = 0.75.",
        why:"[A] ÷ [B] = 0.75 ÷ 0.25 = 3 = " + KR + " ÷ " + KF + ", and " + KR + " × 0.50 beats " + KF + " × 0.50 at the start, so B → A wins first. (0.10, 0.30) and (0.15, 0.45) both work.",
        hints:["For B → A to win at the start, " + KR + " × 0.50 must beat " + KF + " × 0.50.", "At equilibrium, [A] ÷ [B] = 0.75 ÷ 0.25 = 3 = " + KR + " ÷ " + KF + ".", KR + " = 3" + KF + ": (0.10, 0.30) or (0.15, 0.45)."] }
    ]
  },
  part3:{
    slug:"either-side", name:"Either side", heading:"Reach equilibrium from either side",
    intro:"Does the end point depend on where you start? Compare three runs, check real-style data, and see the evidence that equilibrium is still busy.",
    s1:{ title:"Station 1: Three starts, one destination",
      intro:"With " + KF + " = 0.30 s<sup>−1</sup> and " + KR + " = 0.10 s<sup>−1</sup>, three runs share one graph: all A, all B, and half-and-half. Turn runs on or off and drag the time slider to compare them.",
      runs:[{ id:"r1", t:"All A", a0:1.00 }, { id:"r2", t:"All B", a0:0 }, { id:"r3", t:"Half-and-half", a0:0.50 }],
      cap:"All three level off at [A] = 0.25 and [B] = 0.75: the same destination, from either side." },
    s2:{ title:"Station 2: Check it with data",
      intro:"Model data for H₂(g) + I₂(g) ⇌ 2HI(g) at one fixed temperature. Tap an equilibrium cell to compare it with the other experiment.",
      label:"Model data",
      zoom:"Zoom to the particles",
      zoomCap:"Each molecule stands for 0.10 mol/L. Both flasks hold 2.00 mol/L of H atoms and 2.00 mol/L of I atoms, so they end at the same place.",
      ratio:"[HI]² ÷ ([H₂][I₂]) = 1.56² ÷ 0.22² ≈ 50 for both. This constant ratio is the equilibrium constant you’ll meet in module 36." },
    s3:{ title:"Station 3: The tracer proof",
      intro:"A classic experiment, in concept: radioactive chloride ions are added to a saturated silver chloride solution that has solid on the bottom. Add the tracer, then let time pass.",
      cap:"Particles keep dissolving and crystallizing: the equilibrium is dynamic." },
    quickCheck:{
      title:"Quick check", summary:"Either side quick check",
      items:[
        { id:"q1", goal:4, prompt:"Experiment 2 starts with HI only. Equilibrium [HI]?",
          choices:[
            { t:"1.56", ok:true, fb:"Right. Same destination from either side." },
            { t:"2.00", fb:"Same destination from either side." },
            { t:"0.44", fb:"Same destination from either side." },
            { t:"1.00", fb:"Same destination from either side." }] },
        { id:"q2", goal:4, prompt:"At equilibrium in Station 1, [B] ÷ [A] is…",
          choices:[
            { t:"3.0 for every start", ok:true, fb:"Right. The ratio is set by " + KF + " ÷ " + KR + "." },
            { t:"different for each start", fb:"The ratio is set by " + KF + " ÷ " + KR + "." },
            { t:"always 1", fb:"The ratio is set by " + KF + " ÷ " + KR + "." },
            { t:"0", fb:"The ratio is set by " + KF + " ÷ " + KR + "." }] },
        { id:"q3", goal:1, prompt:"What does the tracer show?",
          choices:[
            { t:"Particles still swap at equilibrium", ok:true, fb:"Right. The amount stays constant while particles exchange." },
            { t:"More solid forms", fb:"The amount stays constant while particles exchange." },
            { t:"The solution is unsaturated", fb:"The amount stays constant while particles exchange." },
            { t:"The reaction stopped", fb:"The amount stays constant while particles exchange." }] },
        { id:"q4", goal:2, prompt:"Why must the container be closed?",
          choices:[
            { t:"So products can’t escape", ok:true, fb:"Right. Escaping products stop the reverse process." },
            { t:"To keep it warm", fb:"Escaping products stop the reverse process." },
            { t:"To speed it up", fb:"Escaping products stop the reverse process." },
            { t:"To keep the concentrations equal", fb:"Escaping products stop the reverse process." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Equilibrium or not?", summary:"Equilibrium or not?", noun:"situation", txt:true, goal:[1, 2, 3],
        instruction:"Tap a situation, then tap the box it belongs in.",
        boxes:[{ id:"eq", label:"At equilibrium" }, { id:"open", label:"Not at equilibrium: open system" }, { id:"chg", label:"Not at equilibrium: still changing" }],
        items:[
          { id:"i1", goal:2, t:"A sealed bottle of soda left for a week.", answer:"eq", why:"Closed, and the amount of dissolved CO₂ stopped changing long ago.", hints:SORT_HINTS },
          { id:"i2", goal:2, t:"An open can of soda going flat.", answer:"open", why:"CO₂ escapes into the room.", hints:SORT_HINTS,
            wrong:{ eq:"CO₂ escapes, so the reverse process can’t keep up." } },
          { id:"i3", goal:3, t:"A saturated sugar solution with crystals on the bottom, for a day.", answer:"eq", why:"Dissolving and crystallizing balance: a physical equilibrium.", hints:SORT_HINTS },
          { id:"i4", goal:3, t:"A sealed flask of N₂O₄ and NO₂ whose colour stopped changing an hour ago.", answer:"eq", why:"Closed, and the colour (the amounts) is constant: a chemical equilibrium.", hints:SORT_HINTS },
          { id:"i5", goal:1, t:"The same flask one second after it was filled.", answer:"chg", why:"Closed, but the colour is still changing.", hints:SORT_HINTS,
            wrong:{ eq:"The colour is still changing, so the rates aren’t equal yet." } },
          { id:"i6", goal:2, t:"A candle burning in a room.", answer:"open", why:"The gases it makes drift away.", hints:SORT_HINTS },
          { id:"i7", goal:3, t:"Water in a sealed jar whose level hasn’t changed for a week.", answer:"eq", why:"Evaporation and condensation balance in a closed jar.", hints:SORT_HINTS },
          { id:"i8", goal:1, t:"Salt being stirred into water, still dissolving.", answer:"chg", why:"The amount dissolved is still changing.", hints:SORT_HINTS }
        ],
        wrongDefault:"Check both: is it closed, and have the amounts stopped changing?" },
      { id:"graph", type:"custom", title:"Graph detective", summary:"Graph detective", star:true, goal:[1, 4, 5],
        instruction:"Six items about the graphs below: number entry and choices. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Read the graphs, type your answer or tap your choice, then press Check.",
        graphCap:"A ⇌ B with " + KF + " = 0.30 s<sup>−1</sup> and " + KR + " = 0.10 s<sup>−1</sup>, starting at [A] = 1.00 mol/L.",
        items:[
          { id:"d1", kind:"num", goal:5, prompt:"[B] at equilibrium?", answer:0.75, tol:0.005, unit:"mol/L", display:"0.75 mol/L",
            wrong:[{ match:0.50, fb:M1 }, { match:0.25, fb:"That’s [A]. Read the teal [B] curve." }],
            fb:"Read where the teal [B] curve levels off.",
            why:"[B] levels off at 0.75 mol/L, three times [A].",
            hints:["Find the teal [B] curve.", "Where does it level off?", "0.75 mol/L."] },
          { id:"d2", kind:"num", goal:5, prompt:"Forward rate at <i>t</i> = 0?", answer:0.30, tol:0.0005, unit:RU, display:"0.30 " + RU,
            wrong:[{ match:0, fb:"[A] = 1.00 at the start." }, { match:0.075, fb:"That’s the rate at equilibrium, not at the start." }],
            fb:"Forward rate = " + KF + "[A].",
            why:"0.30 × 1.00 = 0.30 " + RU + ": the blue rate line starts there.",
            hints:["Forward rate = " + KF + "[A].", "At <i>t</i> = 0, [A] = 1.00.", "0.30 × 1.00 = 0.30."] },
          { id:"d3", kind:"num", star:true, goal:1, prompt:"Reverse rate at equilibrium?", answer:0.075, tol:0.0005, unit:RU, display:"0.075 " + RU,
            wrong:[{ match:0, fb:M3 }],
            fb:"At equilibrium the reverse rate equals the forward rate.",
            why:"0.10 × 0.75 = 0.075 " + RU + ", the same as the forward rate.",
            hints:["Reverse rate = " + KR + "[B].", "[B] = 0.75 at equilibrium.", "0.10 × 0.75 = 0.075."] },
          { id:"d4", kind:"two", star:true, goal:4, prompt:"A second run starts at [A] = [B] = 0.50 with the same <i>k</i> values. Net direction at first, and final [A]?",
            options:[
              { t:"Toward B", ok:true },
              { t:"Toward A", why:"0.30 × 0.50 > 0.10 × 0.50." },
              { t:"No net change", why:"0.30 × 0.50 > 0.10 × 0.50, so the rates aren’t equal yet." }],
            answer:0.25, tol:0.005, unit:"mol/L", display:"toward B; [A] = 0.25 mol/L", label:"Final [A]:",
            wrong:[{ match:0.50, fb:M1 }, { match:0.75, fb:"That’s [B]. " + M5 }],
            fb:"Same <i>k</i> values and the same total: " + M5,
            why:"Forward 0.15 beats reverse 0.05, so the net change is toward B, and it ends at the same equilibrium: [A] = 0.25 mol/L.",
            hints:["Compare 0.30 × 0.50 with 0.10 × 0.50.", "Forward wins, so the net change is toward B.", "Same total, same equilibrium: [A] = 0.25 mol/L."] },
          { id:"d5", kind:"chips", star:true, goal:1, prompt:"<strong>Investigation:</strong> How could you show the reaction is still happening at equilibrium?",
            options:[
              { t:"Add tagged B and look for tags in A later", ok:true, why:"A tracer reveals the hidden swapping." },
              { t:"Wait longer", why:"A tracer reveals the hidden swapping. " + M2 },
              { t:"Heat it", why:"A tracer reveals the hidden swapping. " + M2 },
              { t:"Measure the total", why:"A tracer reveals the hidden swapping. " + M2 }],
            hints:["The amounts don’t change at equilibrium, so measuring them can’t show it.", "You need to follow individual particles.", "Add tagged B and look for tags in A later."] },
          { id:"d6", kind:"num", star:true, goal:4, prompt:KR + " is doubled to 0.20 (" + KF + " = 0.30). Starting from [A] = 1.00, the new equilibrium [A]?", answer:0.40, tol:0.005, unit:"mol/L", display:"0.40 mol/L",
            wrong:[{ match:0.25, fb:"The ratio is now 0.30 ÷ 0.20 = 1.5, so [B] ÷ [A] = 1.5." }, { match:0.60, fb:"That’s [B]." }],
            fb:"[B] ÷ [A] = " + KF + " ÷ " + KR + ", and [A] + [B] = 1.00.",
            why:"[B] ÷ [A] = 1.5 and [A] + [B] = 1.00, so [A] = 1.00 ÷ 2.5 = 0.40 mol/L.",
            hints:["[B] ÷ [A] = " + KF + " ÷ " + KR + " = 1.5.", "[A] + [B] = 1.00.", "[A] = 1.00 ÷ 2.5 = 0.40."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Shira", how:"", goal:[1, 2],
        instruction:"Shira made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Describe A ⇌ B at equilibrium, given " + KF + " = 0.30 and " + KR + " = 0.10.",
            steps:["At equilibrium the forward rate equals the reverse rate.", "So " + KF + "[A] = " + KR + "[B].", "So [A] = [B].", "Each is 0.50 mol/L if we start at [A] = 1.00."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"[B] ÷ [A] = " + KF + " ÷ " + KR + " = 3, so [A] = 0.25 and [B] = 0.75.", ok:true, why:"Equal rates, not equal concentrations." },
              { t:"[A] = 3[B].", why:"Upside down: the bigger constant is " + KF + ", so B ends up larger." },
              { t:"Both rates are 0, so any values work.", why:M3 },
              { t:"Step 3 is correct.", why:M1 }],
            hints:["Are " + KF + " and " + KR + " equal?", "No: 0.30 vs 0.10.", "[B] = 3[A]."] },
          { id:"e2", goal:2, task:"Explain what happens to a puddle on a warm day.",
            steps:["Water molecules escape from the surface as vapour.", "Some vapour molecules return to the liquid.", "Eventually evaporation and condensation balance, so the puddle reaches equilibrium.", "So the puddle stays the same size."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct, near the surface.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"The vapour drifts away (open system), so condensation never catches up; the puddle dries up.", ok:true, why:"An open system can’t reach equilibrium." },
              { t:"Evaporation stops when the puddle is half gone.", why:M6 },
              { t:"Condensation is faster outdoors.", why:"Outdoors the vapour drifts away, so condensation is slower." },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["Is the puddle a closed system?", "No: the vapour leaves.", "No equilibrium; it dries."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you more: that the rates meet but the concentrations don’t, or that the tracer keeps moving at equilibrium?" },
      { id:"j2", q:"In your own words, explain the difference between ‘equal rates’ and ‘equal concentrations’." },
      { id:"j3", q:"Explain to a friend why a sealed soda stays fizzy but an open one goes flat." },
      { id:"j4", q:"What are you still unsure about? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"At dynamic equilibrium…", options:[
          { t:"the forward and reverse rates are equal, and neither is zero", ok:true, why:"Both directions keep going at the same rate." },
          { t:"both rates are zero", why:M2 + " " + M3 },
          { t:"[reactants] = [products]", why:M1 },
          { t:"the reaction has stopped", why:M2 }] },
        b:{ prompt:"Which stays constant at dynamic equilibrium?", options:[
          { t:"The concentration of every species", ok:true, why:"Equal rates keep every concentration constant." },
          { t:"Nothing; the concentrations keep changing", why:"They level off." },
          { t:"The forward rate, which is zero", why:M3 },
          { t:"[reactants] = [products]", why:M1 }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which system can reach equilibrium?", options:[
          { t:"A sealed bottle of soda", ok:true, why:"It’s closed: CO₂ can’t escape." },
          { t:"An open pot of boiling water", why:M4 },
          { t:"A puddle in the sun", why:M4 },
          { t:"A burning candle", why:"Products escape and it isn’t reversible." }] },
        b:{ prompt:"Why can’t an open beaker of water reach liquid–vapour equilibrium?", options:[
          { t:"The vapour escapes, so condensation can’t keep up with evaporation", ok:true, why:"Open system: no equilibrium." },
          { t:"Evaporation stops in open air", why:M2 },
          { t:"Water can’t evaporate from glass", why:"It can." },
          { t:"The beaker is too small", why:"Size isn’t the issue." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which is a physical equilibrium?", options:[
          { t:"A saturated salt solution with undissolved salt", ok:true, why:"Dissolving ⇌ crystallizing: no new substances form." },
          { t:"H₂(g) + I₂(g) ⇌ 2HI(g) in a sealed flask", why:"That’s chemical." },
          { t:"N₂(g) + 3H₂(g) ⇌ 2NH₃(g)", why:"That’s chemical." },
          { t:"Wood burning in a stove", why:"Not an equilibrium." }] },
        b:{ prompt:"Which is a chemical equilibrium?", options:[
          { t:"N₂O₄(g) ⇌ 2NO₂(g) in a sealed tube", ok:true, why:"A reversible reaction in a closed container." },
          { t:"Water ⇌ water vapour in a sealed jar", why:"That’s physical." },
          { t:"Sugar dissolving to saturation", why:"That’s physical." },
          { t:"Ice and water at 0 °C in an insulated flask", why:"That’s physical." }] } },
      { id:"t1", cat:"T", goal:5,
        a:{ prompt:"A ⇌ B with " + KF + " = 0.30 s<sup>−1</sup> and " + KR + " = 0.10 s<sup>−1</sup>, starting from [A] = 1.00 mol/L and no B. What is [A] at equilibrium?", options:[
          { t:"0.25 mol/L", ok:true, why:"[B] = 3[A] and [A] + [B] = 1.00." },
          { t:"0.50 mol/L", why:M1 },
          { t:"0.75 mol/L", why:"That’s [B]." },
          { t:"0 mol/L", why:"It doesn’t go to completion." }] },
        b:{ prompt:KF + " = 0.10 s<sup>−1</sup>, " + KR + " = 0.40 s<sup>−1</sup>, starting from [A] = 1.00 mol/L. What is [A] at equilibrium?", options:[
          { t:"0.80 mol/L", ok:true, why:"[B] ÷ [A] = 0.25." },
          { t:"0.50 mol/L", why:M1 },
          { t:"0.20 mol/L", why:"That’s [B]." },
          { t:"1.00 mol/L", why:"Some B forms." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"H₂ + I₂ ⇌ 2HI at a fixed temperature. Starting with 1.00 mol/L each of H₂ and I₂ gives [HI] = 1.56 mol/L at equilibrium. A second flask (same volume and temperature) starts with 2.00 mol/L HI only. What is its equilibrium [HI]?", options:[
          { t:"1.56 mol/L", ok:true, why:M5 },
          { t:"2.00 mol/L", why:"Some HI breaks down. " + M2 },
          { t:"0.44 mol/L", why:"That’s how much HI breaks down." },
          { t:"1.00 mol/L", why:M6 }] },
        b:{ prompt:"In that second flask, what is the equilibrium [H₂]?", options:[
          { t:"0.22 mol/L", ok:true, why:"0.44 mol/L of HI breaks down into 0.22 mol/L of H₂." },
          { t:"1.00 mol/L", why:M5 },
          { t:"0.78 mol/L", why:"That’s how much H₂ reacts in the first flask." },
          { t:"0 mol/L", why:M2 }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"On a rate–time graph, the forward rate starts at 0.30 " + RU + " and falls; the reverse rate starts at 0 and rises; they meet at 0.075 " + RU + " at about 12 s. What is true after 12 s?", options:[
          { t:"The concentrations stay constant while both reactions continue at 0.075 " + RU, ok:true, why:"Equal rates: constant concentrations, both directions still going." },
          { t:"Both rates drop to zero", why:M3 },
          { t:"The forward reaction continues, but the reverse stops", why:"They’re equal." },
          { t:"The concentrations become equal", why:M1 }] },
        b:{ prompt:"On a concentration–time graph, [A] and [B] level off at 0.25 and 0.75 mol/L. What does the levelling off show?", options:[
          { t:"The forward and reverse rates have become equal", ok:true, why:"Equal rates mean no net change." },
          { t:"The reaction has stopped", why:M2 },
          { t:"[A] = [B]", why:M1 },
          { t:"The system is open", why:M4 }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best description of dynamic equilibrium in a sealed jar of water?", options:[
          { t:"“Water evaporates and vapour condenses at the same rate, so the amounts of liquid and vapour stay constant.”", ok:true, why:"Equal rates, constant amounts, both still happening." },
          { t:"“Evaporation has stopped because the air is full.”", why:M2 },
          { t:"“There are equal masses of liquid and vapour.”", why:M1 },
          { t:"“Water evaporates faster than it condenses, forever.”", why:"Then the liquid would run out." }] },
        b:{ prompt:"Which is the best description of a saturated salt solution with solid on the bottom?", options:[
          { t:"“Solid dissolves and ions crystallize at equal rates, so the concentration stays constant while particles keep swapping.”", ok:true, why:"Equal rates, constant concentration, particles still swapping." },
          { t:"“Nothing dissolves any more.”", why:M2 },
          { t:"“The concentration of ions equals the mass of solid.”", why:M1 },
          { t:"“The solid slowly disappears.”", why:"Its amount stays constant." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"A student says, ‘Starting with only products will give a different equilibrium mixture.’ Which is the best response?", options:[
          { t:"“At the same temperature with the same total amounts, the same equilibrium is reached from either direction.”", ok:true, why:M5 },
          { t:"“Correct: the mixture depends on the start.”", why:M5 },
          { t:"“Starting with products gives no reaction.”", why:M2 },
          { t:"“Only the reactants can reach equilibrium.”", why:M5 }] },
        b:{ prompt:"A student says, ‘At equilibrium, the reaction is half finished.’ Which is the best response?", options:[
          { t:"“Equilibrium can lie far toward reactants or products; it means the rates are equal, not that half has reacted.”", ok:true, why:M6 },
          { t:"“Correct: equilibrium is always 50%.”", why:M6 },
          { t:"“At equilibrium, the reaction is complete.”", why:M2 },
          { t:"“At equilibrium, no reactants remain.”", why:"Both are present." }] } },
      { id:"a1", cat:"A", goal:2,
        a:{ prompt:"Why does a sealed bottle of soda stay fizzy for months while an open one goes flat?", options:[
          { t:"“Sealed: CO₂ leaving and re-entering the solution reach equal rates. Open: CO₂ gas escapes, so the system can’t reach equilibrium.”", ok:true, why:"Closed system: equilibrium. Open system: CO₂ is lost." },
          { t:"“Sealing stops CO₂ from leaving the liquid at all.”", why:M2 },
          { t:"“Opening the bottle adds CO₂.”", why:"CO₂ leaves." },
          { t:"“Soda goes flat only when it warms up.”", why:"Even a cold open soda goes flat." }] },
        b:{ prompt:"Why does a closed perfume bottle keep the same amount of liquid while an open one dries out?", options:[
          { t:"“Closed: evaporation and condensation balance. Open: the vapour escapes, so no equilibrium forms.”", ok:true, why:"Only the closed bottle can reach equilibrium." },
          { t:"“Perfume only evaporates when it’s open.”", why:M2 },
          { t:"“The lid cools the perfume.”", why:"Temperature isn’t the reason." },
          { t:"“Closed bottles have equal amounts of liquid and vapour.”", why:M1 }] } },
      { id:"a2", cat:"A", goal:1,
        a:{ prompt:"Radioactive chloride ions are added to a saturated silver chloride solution with solid on the bottom. Later the solid is radioactive, though its mass hasn’t changed. What does this show?", options:[
          { t:"“Dissolving and crystallizing continue at equal rates: the equilibrium is dynamic.”", ok:true, why:"Tagged ions moved into the solid while its mass stayed the same." },
          { t:"“More solid formed.”", why:"The mass is unchanged." },
          { t:"“The reaction stopped.”", why:M2 },
          { t:"“Radioactivity makes salts less soluble.”", why:"That’s not what changed." }] },
        b:{ prompt:"Heavy water vapour (D₂O) is added to a sealed jar of ordinary water at equilibrium. Later, D₂O is found in the liquid, while the liquid level is unchanged. What does this show?", options:[
          { t:"“Evaporation and condensation keep going at equal rates.”", ok:true, why:"The tagged molecules moved while the level stayed the same." },
          { t:"“Condensation has stopped.”", why:M2 },
          { t:"“The jar was open.”", why:M4 },
          { t:"“The liquid and vapour now have equal amounts.”", why:M1 }] } }
    ]
  },
  task:{
    title:"Same destination", summary:"Same destination",
    statement:"<p>Set up A ⇌ B (total 1.00 mol/L) so it meets every condition. Can you find every setup?</p><ol class=\"de-conds\"><li>At equilibrium, [B] = 0.60 mol/L.</li><li>At the start, the net reaction runs <strong>backwards</strong> (B → A).</li><li>It approaches equilibrium slowly enough to watch: " + KF + " + " + KR + " ≤ 0.50 s<sup>−1</sup>.</li></ol>",
    checks:["[B] = 0.60 at equilibrium", "Runs backwards at first", "Slow enough to watch"],
    tips:["[B] ÷ [A] = 0.60 ÷ 0.40 = 1.5, so " + KF + " = 1.5 × " + KR + ".", "To run backwards, start with more B than the equilibrium amount.", "Keep the two rate constants small."],
    explainPrompt:"Explain how you chose the rate constants for [B] = 0.60, and why your starting mixture makes the reaction run backwards first.",
    vocab:"Use the words forward rate, reverse rate, equilibrium and closed system.",
    more:"There’s more than one setup. Can you find every one?",
    afterAt:4,
    after3:"Two pairs of constants give the 1.5 ratio within the speed limit; each works from any start with more than 0.60 mol/L of B."
  },
  cards:[
    ["Dynamic equilibrium", "Forward and reverse rates equal; concentrations constant; both still happening."],
    ["Closed system", "Matter can’t enter or leave; needed for equilibrium."],
    ["Equal rates, not equal amounts", "Concentrations are constant but usually different."],
    ["A ⇌ B balance", KF + "[A] = " + KR + "[B], so [B] ÷ [A] = " + KF + " ÷ " + KR + "."],
    ["Either direction", "Same temperature and totals give the same equilibrium."],
    ["Physical equilibrium", "Liquid ⇌ vapour in a sealed jar; saturated solution with solid."],
    ["Chemical equilibrium", "A reversible reaction in a closed container, e.g. N₂O₄ ⇌ 2NO₂."],
    ["Concentration–time graph", "Curves level off when equilibrium is reached."],
    ["Rate–time graph", "Forward falls, reverse rises; they meet and stay equal."],
    ["Tracer evidence", "Tagged particles keep swapping at equilibrium."],
    ["Open system", "Products escape; no equilibrium."]
  ]
};
