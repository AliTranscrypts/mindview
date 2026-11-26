// SCH4U 35 Le Chatelier's Principle. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/35-le-chatelier.md
// The pictures (hero tube and scale, the Stress tester, the Part 3 stations, the graph-detective graphs, the task preview)
// are drawn by app.js. Formulas are plain Unicode here; app.js uses MV.chem.f where it builds its own.

const K = "<em>K</em>", Q = "<em>Q</em>", DH = "Δ<em>H</em>", EA = "<em>E</em><sub>a</sub>";

// Misconception core sentences (plan §3)
const M1 = "Concentration changes alter " + Q + ", not " + K + ". Only temperature changes " + K + ".";
const M2 = "A catalyst speeds up both directions equally: the same equilibrium, reached sooner.";
const M3 = "The partial pressures of the reacting gases don’t change, so " + Q + " still equals " + K + ".";
const M4 = "The shift uses up only part of the added substance; it ends higher than before.";
const M5 = "Exothermic: heat is a product. Raising the temperature shifts left and " + K + " falls.";
const M6 = "Pure solids and liquids aren’t in " + Q + " or " + K + ".";
const M7 = "Higher pressure favours the side with <strong>fewer</strong> gas moles; equal moles means no shift.";

const SO2 = "2SO₂(g) + O₂(g) ⇌ 2SO₃(g), " + DH + " &lt; 0";
const CACO3 = "CaCO₃(s) ⇌ CaO(s) + CO₂(g), " + DH + " &gt; 0";
const PH1 = "What changed: a concentration, the volume, the temperature, or nothing in " + Q + "?";
const PH2 = "Compare " + Q + " with " + K + ".";

// Practice 1 rows: [stress, shift, K, main wrong {pick, fb}, reason for hint 3]
const ROWS = [
  ["Add O₂", "right", "same", { k:"up", fb:M1 }, "Adding a reactant makes " + Q + " &lt; " + K + ": it shifts right, and " + K + " stays the same."],
  ["Remove SO₃", "right", "same", { s:"left", fb:"Removing product pulls it right." }, "Removing a product makes " + Q + " &lt; " + K + ": it shifts right; " + K + " stays the same."],
  ["Halve the volume", "right", "same", { s:"left", fb:M7 + " 3 mol gas → 2." }, "3 mol of gas → 2: higher pressure shifts it right. " + K + " stays the same."],
  ["Raise the temperature", "left", "down", { s:"right", fb:M5 }, "Exothermic: heat is a product, so heating shifts left and " + K + " decreases."],
  ["Add a catalyst", "none", "same", { s:"right", fb:M2 }, "No shift and " + K + " stays the same: " + M2],
  ["Add helium at constant volume", "none", "same", { s:"left", fb:M3 }, "No shift: " + M3],
  ["Add more CaCO₃(s)", "none", "same", { s:"right", fb:M6 + " Solids aren’t in " + K + "." }, "No shift: " + M6],
  ["Raise the temperature (CaCO₃ system)", "right", "up", { s:"left", fb:"Endothermic forward: heating shifts right." }, "Endothermic forward: heat is a reactant, so heating shifts right and " + K + " increases."]
];

export default {
  id:"35-le-chatelier",
  kind:"topic",
  title:"Le Chatelier’s principle",
  topic:"Le Chatelier’s Principle",
  readyTopic:"Le Chatelier’s principle",
  hero:{
    eq:'<span class="lc-heq"><span class="lc-sw lc-pink" aria-hidden="true"></span>[Co(H₂O)₆]²⁺(aq) <span class="lc-swl">(pink)</span> + 4Cl⁻(aq) ⇌ <span class="lc-sw lc-blue" aria-hidden="true"></span>[CoCl₄]²⁻(aq) <span class="lc-swl">(blue)</span> + 6H₂O(l), ' + DH + " &gt; 0</span>",
    eqSize:"sm",
    eqLabel:"Hexaaquacobalt(II) ion, pink, plus 4 chloride ions, in equilibrium with tetrachlorocobaltate(II) ion, blue, plus 6 water. Delta H is greater than 0.",
    headline:"Push it, and it pushes back",
    text:"Disturb a system at equilibrium and it <strong>shifts</strong> to partly undo the change: that’s <strong>Le Chatelier’s principle</strong>. Adding, removing, squeezing, heating: each stress has a predictable response. Only a temperature change alters the equilibrium constant <strong><em>K</em></strong>.",
    fig:{ html:'<div class="lc-hx"><svg class="lc-hx-svg" id="lc-hx-svg" viewBox="0 0 440 300" role="img" aria-label="A test tube of violet cobalt chloride solution sits beside a balance scale and a K dial. Chloride is added: the scale tips toward the reactant side, the solution turns blue, and the scale levels again. Then the tube goes into an ice bath: the solution turns pink and the K dial turns down."></svg><div class="lc-hx-row"><p class="lc-hx-ctr" id="lc-hx-ctr" aria-live="polite"></p><button type="button" class="btn ghost sm" id="lc-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can state Le Chatelier’s principle and predict shifts caused by changes in concentration.",
    "I can predict the effect of changes in volume or pressure on gas equilibria, including cases with no shift.",
    "I can predict the effect of temperature using " + DH + ", and explain that only temperature changes " + K + ".",
    "I can use " + Q + " vs " + K + " to justify the direction of a shift.",
    "I can identify a stress from a concentration–time graph.",
    "I can apply the principle to industrial and biological systems."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Dynamic equilibrium", goal:1,
          prompt:"At equilibrium, which is true?",
          options:[
            { t:"Forward and reverse rates are equal", ok:true, why:"Both directions keep going at the same rate, so the concentrations stay constant." },
            { t:"Reactant and product concentrations are equal.", why:"Rates are equal; amounts differ." },
            { t:"Both reactions have stopped.", why:"Both continue." },
            { t:"Only the forward reaction occurs.", why:"Both directions occur." }],
          hints:["What does ‘dynamic’ mean?", "Still moving.", "Equal rates."] },
        { id:"w2", skill:"Dynamic equilibrium", goal:4,
          prompt:"For A(g) ⇌ 2B(g), which is the equilibrium expression " + K + "?",
          options:[
            { t:"[B]² ÷ [A]", ok:true, why:"Products over reactants, with the coefficient 2 as an exponent." },
            { t:"[A] ÷ [B]²", why:"Products over reactants." },
            { t:"2[B] ÷ [A]", why:"Coefficients become exponents." },
            { t:"[B] ÷ [A]", why:"Square [B]." }],
          hints:["Products on top.", "Coefficient 2 becomes an exponent.", "[B]² ÷ [A]."] },
        { id:"w3", skill:"Gas moles and pressure", goal:2,
          prompt:"How many moles of gas are on each side of N₂(g) + 3H₂(g) ⇌ 2NH₃(g)?",
          options:[
            { t:"4 on the left, 2 on the right", ok:true, why:"1 + 3 = 4 on the left; 2 on the right." },
            { t:"2 on the left, 4 on the right", why:"Count again: 1 + 3." },
            { t:"3 on each side", why:"Use the coefficients." },
            { t:"1 on the left, 2 on the right", why:"Include the 3H₂." }],
          hints:["Add the coefficients of the gases.", "1 + 3 on the left.", "4 and 2."] },
        { id:"w4", skill:"Gas moles and pressure", goal:2,
          prompt:"Halving the volume of a gas mixture (same temperature) does what to every gas concentration?",
          options:[
            { t:"Doubles it", ok:true, why:"Same moles in half the space." },
            { t:"Halves it", why:"Less space means more crowded." },
            { t:"Leaves it the same", why:"Concentration = moles ÷ volume." },
            { t:"Quadruples it", why:"Volume halves once." }],
          hints:["Concentration = <em>n</em> ÷ <em>V</em>.", "<em>V</em> is halved.", "× 2."] },
        { id:"w5", skill:"Exothermic and endothermic", goal:3,
          prompt:"For an exothermic reaction, where can you write ‘heat’ in the equation?",
          options:[
            { t:"On the product side", ok:true, why:"Heat is released." },
            { t:"On the reactant side", why:"That’s endothermic." },
            { t:"On both sides", why:"Only one side." },
            { t:"Nowhere", why:"A heat term is allowed (D2.2)." }],
          hints:["Exothermic releases heat.", "Released = produced.", "Product side."] },
        { id:"w6", skill:"Exothermic and endothermic", goal:3,
          prompt:"A reaction has " + DH + " = +60 kJ. Which is true?",
          options:[
            { t:"It absorbs heat (endothermic)", ok:true, why:"A positive " + DH + " means the system gains enthalpy." },
            { t:"It releases heat.", why:"Positive " + DH + " means absorbed." },
            { t:"It has no energy change.", why:DH + " ≠ 0." },
            { t:"It must be fast.", why:DH + " says nothing about speed." }],
          hints:["What does a positive " + DH + " mean?", "The system gains enthalpy.", "Endothermic."] }
      ],
      refreshers:{
        "Dynamic equilibrium":"Equal rates, constant concentrations, both directions still going (module 34). " + K + " = products over reactants, with coefficients as exponents.",
        "Gas moles and pressure":"Count the gas coefficients on each side. Halving the volume doubles every gas concentration.",
        "Exothermic and endothermic":"Exothermic: heat is a product (" + DH + " &lt; 0). Endothermic: heat is a reactant (" + DH + " &gt; 0)."
      }
    }
  },
  explore:{
    heading:"Stress tester",
    intro:"Pick a system at equilibrium, apply one stress at a time, and watch it shift. Keep an eye on " + Q + ", " + K + " and the graph.",
    how:"Choose a system and a mode, then tap a stress button. <strong>Undo</strong> takes back the last stress; <strong>Reset</strong> returns the system to its starting equilibrium. All values are model values.",
    modes:[{ id:"one", t:"One stress" }, { id:"seq", t:"Sequence" }, { id:"pre", t:"Predict first" }],
    predictions:[
      { id:"p1", prompt:"S1 (N₂ + 3H₂ ⇌ 2NH₃): N₂ is added. Which way does it shift, and what happens to " + K + "?",
        options:[{ t:"right; " + K + " unchanged", ok:true }, { t:"right; " + K + " increases" }, { t:"left; " + K + " unchanged" }, { t:"no shift" }],
        explain:"Adding N₂ makes " + Q + " &lt; " + K + ", so the system shifts right until " + Q + " = " + K + " again. [N₂] ends higher than before, but lower than just after adding it." },
      { id:"p2", prompt:"S1 (N₂ + 3H₂ ⇌ 2NH₃): the volume is halved. Shift?",
        options:[{ t:"right, toward NH₃", ok:true }, { t:"left" }, { t:"none" }, { t:"it depends on the catalyst" }],
        explain:"4 mol of gas → 2 mol: the side with fewer gas moles relieves the pressure." },
      { id:"p3", prompt:"S3 (H₂ + I₂ ⇌ 2HI): the volume is halved. Shift?",
        options:[{ t:"right" }, { t:"left" }, { t:"none", ok:true }, { t:"it doubles " + K }],
        explain:"2 mol of gas ⇌ 2 mol: squeezing doesn’t favour either side." },
      { id:"p4", prompt:"S2 (the cobalt chloride system, " + DH + " &gt; 0): the temperature is raised by 20 °C. Colour?",
        options:[{ t:"blue", ok:true }, { t:"pink" }, { t:"no change" }, { t:"colourless" }],
        explain:"The forward reaction is endothermic: heat acts as a reactant, so heating shifts right and " + K + " increases." }
    ],
    chalIntro:"Use the Stress tester to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"S1: increase the equilibrium [NH₃] using <strong>one</strong> stress that does <strong>not</strong> change " + K + ".",
        why:"Adding N₂ or H₂, or halving the volume, makes " + Q + " &lt; " + K + " without touching " + K + ", so the system shifts right and makes more NH₃.",
        hints:["Which stresses leave " + K + " alone?", "Concentration and volume changes.", "Add N₂ or H₂, or halve the volume."] },
      { id:"tc2", goal:3, prompt:"S2: turn the solution blue <strong>without adding chloride</strong>.",
        why:"The forward reaction is endothermic, so heat acts as a reactant: heating shifts it right, toward blue [CoCl₄]²⁻, and " + K + " increases.",
        hints:["Is the forward reaction exothermic or endothermic?", "Endothermic: heat is a reactant.", "Heat it."] },
      { id:"tc3", goal:[1, 3], stretch:true, prompt:"S2 starts pink at 25 °C. Make it turn <strong>blue</strong>, then <strong>pink</strong> again, so that at the end <strong>" + K + " is smaller</strong> than at the start.",
        why:"Any route to blue works, but only cooling below 25 °C makes " + K + " smaller: for an endothermic forward reaction, " + K + " falls when you cool it.",
        hints:["Which stress is the only one that changes " + K + "?", "For an endothermic forward reaction, " + K + " falls when you cool it.", "Make it blue any way, then cool it below 25 °C."] }
    ]
  },
  part3:{
    slug:"industry", name:"Industry", heading:"Industry and the body",
    intro:"Real equilibria run in factories and in your blood. Visit each station: set the conditions, watch what shifts, and see why real conditions are compromises.",
    quickCheck:{
      title:"Quick check", summary:"Industry and the body quick check",
      items:[
        { id:"q1", goal:6, prompt:"Why is NH₃ cooled to a liquid and removed?",
          choices:[
            { t:"Removing product shifts right", ok:true, fb:"Right. Less product → " + Q + " &lt; " + K + " → right." },
            { t:"It makes the catalyst work", fb:"Less product → " + Q + " &lt; " + K + " → right. " + M1 },
            { t:"It raises " + K, fb:"Less product → " + Q + " &lt; " + K + " → right. " + M1 },
            { t:"It lowers the pressure", fb:"Less product → " + Q + " &lt; " + K + " → right. " + M1 }] },
        { id:"q2", goal:6, prompt:"Why use an iron catalyst?",
          choices:[
            { t:"Equilibrium is reached faster; no shift", ok:true, fb:"Right. " + M2 },
            { t:"It raises the yield", fb:M2 },
            { t:"It raises " + K, fb:M2 },
            { t:"It shifts left", fb:M2 }] },
        { id:"q3", goal:6, prompt:"At altitude, Hb + 4O₂ ⇌ Hb(O₂)₄ shifts…",
          choices:[
            { t:"left", ok:true, fb:"Right. Less O₂, so it shifts toward the side that makes O₂." },
            { t:"right", fb:"Less O₂, so it shifts toward the side that makes O₂." },
            { t:"not at all", fb:"Less O₂, so it shifts toward the side that makes O₂." },
            { t:"toward more O₂", fb:"Less O₂, so it shifts toward the side that makes O₂." }] },
        { id:"q4", goal:6, prompt:"Opening a soda: CO₂(g) ⇌ CO₂(aq) shifts…",
          choices:[
            { t:"left (CO₂ leaves solution)", ok:true, fb:"Right. Lower CO₂ pressure: the system makes more gas." },
            { t:"right", fb:"Lower CO₂ pressure: the system makes more gas." },
            { t:"not at all", fb:"Lower CO₂ pressure: the system makes more gas." },
            { t:"it freezes", fb:"Lower CO₂ pressure: the system makes more gas." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"shift", type:"custom", title:"Predict the shift", summary:"Predict the shift", goal:[1, 2, 3],
        instruction:"For each stress, choose the direction of the shift and what happens to " + K + ", then press Check.",
        how:"Tap one chip in each row, then press Check.",
        sysA:"Rows 1–6: " + SO2 + ".", sysB:"Rows 7 and 8: " + CACO3 + ".",
        items:ROWS.map((r, i) => ({ id:"r" + (i + 1), goal:i === 2 || i === 4 || i === 5 ? 2 : i === 3 || i === 7 ? 3 : 1, sys:i >= 6 ? "b" : "a",
          prompt:r[0], answer:r[1] + "|" + r[2], main:r[3],
          hints:[PH1, PH2, r[4]] })) },
      { id:"detect", type:"custom", title:"Graph detective", summary:"Graph detective", goal:[3, 4, 5],
        instruction:"Each graph is for S1 (N₂ + 3H₂ ⇌ 2NH₃, exothermic) with a stress at 10 min. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Tap a choice (and type a number where asked), then press Check.",
        items:[
          { id:"d1", goal:5, graph:"add", prompt:"[N₂] jumps up at 10 min, then falls slowly; [H₂] falls slowly; [NH₃] rises slowly. What was the stress?",
            options:[
              { t:"N₂ added", ok:true, why:"Only [N₂] jumps; the shift right then uses up part of it." },
              { t:"Volume halved", why:"Then all three would jump." },
              { t:"Temperature raised", why:"A temperature change gives no sudden jump." },
              { t:"Catalyst added", why:M2 }],
            hints:["Which line jumps?", "Only [N₂] jumps: one substance was added.", "N₂ added."] },
          { id:"d2", goal:5, graph:"vol", prompt:"All three concentrations jump up at 10 min; then [NH₃] rises while [N₂] and [H₂] fall. What was the stress?",
            options:[
              { t:"Volume decreased", ok:true, why:"Every gas concentration jumps at once, then it shifts toward fewer gas moles." },
              { t:"N₂ added", why:"Only one would jump." },
              { t:"Temperature raised", why:"A temperature change gives no sudden jump." },
              { t:"Catalyst added", why:M2 }],
            hints:["How many lines jump?", "All three jump together: the space changed.", "Volume decreased."] },
          { id:"d3", goal:3, star:true, graph:"heat", prompt:"No jumps; [NH₃] slowly falls while [N₂] and [H₂] slowly rise. What was the stress?",
            options:[
              { t:"Temperature raised", ok:true, why:"No jump, then a shift left: heating an exothermic reaction favours the reverse direction, and " + K + " falls." },
              { t:"Catalyst added", why:"A catalyst changes nothing at equilibrium. " + M2 },
              { t:"N₂ added", why:"That would show a sudden jump in [N₂]." },
              { t:"Volume halved", why:"Then all three would jump." }],
            hints:["No jump means no substance or volume change.", "Which stress shifts it gradually, and which way would heating push an exothermic reaction?", "Temperature raised: it shifts left."] },
          { id:"d4", goal:5, star:true, graph:"cat", prompt:"A stress is applied at 10 min, but no concentration changes at all afterwards. Which stress could it be?",
            options:[
              { t:"catalyst added", ok:true, why:"A catalyst can’t shift an equilibrium: " + M2 },
              { t:"N₂ added", why:"Those show sudden jumps." },
              { t:"temperature raised", why:"That would shift it gradually." },
              { t:"volume halved", why:"Those show sudden jumps." }],
            hints:["Which stress leaves " + Q + " and " + K + " both unchanged?", "Not a concentration, volume or temperature change.", "Catalyst added."] },
          { id:"d5", goal:3, star:true, inv:true, prompt:"<strong>Investigation:</strong> The cobalt system turns blue in a hot-water bath and pink in an ice bath. What does this tell you about " + DH + " for pink → blue?",
            options:[
              { t:DH + " &gt; 0 (endothermic)", ok:true, why:"Heating favours the endothermic direction, and heating makes it blue." },
              { t:DH + " &lt; 0 (exothermic)", why:M5 + " Heating favours the endothermic direction." },
              { t:DH + " = 0", why:"Then temperature wouldn’t shift it at all." },
              { t:"Nothing: colour can’t show " + DH, why:"The colour shows which way it shifts; heating favours the endothermic direction." }],
            hints:["Which direction does heating favour?", "Heating favours the endothermic direction.", "Heating gives blue, so pink → blue is endothermic: " + DH + " &gt; 0."] },
          { id:"d6", goal:4, star:true, kind:"q", prompt:"For A(g) ⇌ 2B(g), " + K + " = 4.0 (model). After a stress, [A] = 0.50 and [B] = 1.0 mol/L. Find " + Q + ", then decide: which way does it shift, and does [B] end above or below 1.0?",
            answer:2, qfb:Q + " = [B]² ÷ [A] = 1.0² ÷ 0.50.",
            options:[
              { t:"Right; [B] ends above 1.0", ok:true, why:Q + " = 2.0 &lt; 4.0, so it shifts right and [B] rises." },
              { t:"Left; [B] ends below 1.0", why:Q + " = 1.0² ÷ 0.50 = 2.0 &lt; 4.0." },
              { t:"Right; [B] ends below 1.0", why:"A shift right makes more B." },
              { t:"No shift; [B] stays at 1.0", why:Q + " = 2.0 ≠ " + K + "." }],
            hints:[Q + " = [B]² ÷ [A].", Q + " = 2.0.", Q + " &lt; " + K + ": right, so [B] rises."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Silas", how:"", goal:[1, 2, 3],
        instruction:"Silas made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"What happens when an iron catalyst is added to an ammonia equilibrium?",
            fig:'<figure class="lc-ea"><svg viewBox="0 0 300 150" role="img" aria-label="Energy profile: reactants on the left, products lower on the right. The uncatalysed path has a tall hump; the catalysed path, dashed, has a lower hump. The same lower hump is crossed in both directions."><line x1="20" y1="10" x2="20" y2="140" stroke="var(--ink-2)" stroke-width="1.4"/><text x="26" y="16" font-size="11" fill="var(--ink-2)">energy</text><path d="M30 95 H70 C110 95 120 22 150 22 C180 22 190 120 230 120 H285" fill="none" stroke="var(--ink)" stroke-width="2.6"/><path d="M30 95 H70 C110 95 125 60 150 60 C175 60 190 120 230 120 H285" fill="none" stroke="var(--en-cat)" stroke-width="2.6" stroke-dasharray="7 5"/><line x1="60" y1="95" x2="60" y2="62" stroke="var(--en-ea)" stroke-width="2"/><polygon points="60,58 56,66 64,66" fill="var(--en-ea)"/><line x1="245" y1="120" x2="245" y2="62" stroke="var(--en-ea)" stroke-width="2"/><polygon points="245,58 241,66 249,66" fill="var(--en-ea)"/><text x="36" y="110" font-size="11" fill="var(--ink)">N₂ + 3H₂</text><text x="232" y="136" font-size="11" fill="var(--ink)">2NH₃</text><text x="158" y="18" font-size="11" fill="var(--ink)">no catalyst</text><text x="158" y="74" font-size="11" fill="var(--en-cat)">catalyst</text></svg><figcaption class="tiny muted">The catalyst lowers the hump for the forward <em>and</em> the reverse direction (both ' + EA + ' arrows end at the dashed peak).</figcaption></figure>',
            steps:["The catalyst lowers the activation energy.", "So the forward reaction speeds up.", "The reverse reaction isn’t affected.", "So the equilibrium shifts right and more NH₃ forms."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"The reverse reaction speeds up by the same factor, so there’s no shift; equilibrium is just reached sooner.", ok:true, why:M2 },
              { t:"The reverse reaction slows down.", why:M2 },
              { t:"The catalyst is used up.", why:"A catalyst is not used up. " + M2 },
              { t:"Step 3 is correct.", why:M2 }],
            hints:["Does a lower " + EA + " help only one direction?", "The same hump is crossed both ways.", "Both speed up: no shift."] },
          { id:"e2", goal:3, task:"Effect of raising the temperature on N₂ + 3H₂ ⇌ 2NH₃ + heat.",
            steps:["The forward reaction is exothermic, so heat is a product.", "Raising the temperature is like adding a product.", "So the equilibrium shifts left.", K + " stays the same, because " + K + " is a constant."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:K + " decreases: changing the temperature changes " + K + ".", ok:true, why:"Shift left means fewer products, so " + K + " falls. " + M1 },
              { t:K + " increases.", why:M5 },
              { t:K + " doubles.", why:"Nothing here doubles. Shift left means fewer products: " + K + " falls." },
              { t:"Step 4 is correct.", why:M1 }],
            hints:["Which stress changes " + K + "?", "Temperature.", "Shift left means fewer products: " + K + " falls."] },
          { id:"e3", goal:2, task:"Effect of halving the volume on H₂(g) + I₂(g) ⇌ 2HI(g).",
            steps:["Halving the volume doubles every concentration.", "The system responds to reduce the pressure.", "So it shifts right, toward HI.", "More HI forms."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct as a general idea.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"Both sides have 2 mol of gas, so no shift reduces the pressure: there’s no shift (" + Q + " still equals " + K + ").", ok:true, why:M7 },
              { t:"It shifts left.", why:M7 },
              { t:"It shifts right because HI is a single substance.", why:"Count gas moles, not substances. " + M7 },
              { t:"Step 3 is correct.", why:M7 }],
            hints:["Count the gas moles on each side.", "2 and 2.", "No shift."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which stress surprised you most: a catalyst or argon doing nothing, or the added N₂ only partly disappearing?" },
      { id:"j2", q:"In your own words, explain why only temperature changes " + K + "." },
      { id:"j3", q:"Explain to a friend how to predict the effect of squeezing a gas mixture." },
      { id:"j4", q:"Which kind of stress do you still mix up? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"N₂(g) + 3H₂(g) ⇌ 2NH₃(g). H₂ is added. Which way does it shift?", options:[
          { t:"Right, toward NH₃", ok:true, why:"Adding a reactant makes " + Q + " &lt; " + K + "." },
          { t:"Left, toward N₂ and H₂", why:"Adding a reactant shifts right." },
          { t:"No shift", why:Q + " &lt; " + K + ", so it shifts." },
          { t:K + " increases instead", why:M1 }] },
        b:{ prompt:"Same system. NH₃ is removed. Which way does it shift?", options:[
          { t:"Right, toward NH₃", ok:true, why:"Removing a product makes " + Q + " &lt; " + K + "." },
          { t:"Left", why:"Removing a product shifts right." },
          { t:"No shift", why:Q + " &lt; " + K + "." },
          { t:K + " decreases instead", why:M1 }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Which change alters the value of " + K + "?", options:[
          { t:"Changing the temperature", ok:true, why:"Only temperature changes " + K + "." },
          { t:"Adding a reactant", why:M1 },
          { t:"Adding a catalyst", why:M2 },
          { t:"Halving the volume", why:"That changes " + Q + ", not " + K + "." }] },
        b:{ prompt:"A catalyst is added to a mixture at equilibrium. What happens?", options:[
          { t:"Nothing shifts; the equilibrium mixture stays the same", ok:true, why:M2 },
          { t:"It shifts right.", why:M2 },
          { t:K + " increases.", why:M2 },
          { t:"It shifts left.", why:M2 }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"H₂(g) + I₂(g) ⇌ 2HI(g). The volume is halved. Shift?", options:[
          { t:"None", ok:true, why:"2 mol of gas on each side." },
          { t:"Right", why:M7 },
          { t:"Left", why:M7 },
          { t:K + " doubles", why:M1 }] },
        b:{ prompt:"2SO₂(g) + O₂(g) ⇌ 2SO₃(g). The volume is halved. Shift?", options:[
          { t:"Right", ok:true, why:"3 mol of gas → 2." },
          { t:"Left", why:M7 },
          { t:"None", why:M7 },
          { t:K + " doubles", why:M1 }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"The forward reaction is exothermic. The temperature is raised. What happens to " + K + " and to the equilibrium amount of product?", options:[
          { t:K + " decreases; product decreases", ok:true, why:M5 },
          { t:K + " increases; product increases", why:M5 },
          { t:K + " stays the same; product decreases", why:M1 },
          { t:K + " stays the same; product increases", why:M1 + " " + M5 }] },
        b:{ prompt:"The forward reaction is endothermic. The temperature is lowered. What happens?", options:[
          { t:K + " decreases; the equilibrium shifts left", ok:true, why:"Endothermic: heat is a reactant. Cooling removes it, so it shifts left and " + K + " falls." },
          { t:K + " increases; it shifts right", why:"Endothermic: heat is a reactant. Cooling shifts left and " + K + " falls." },
          { t:K + " stays the same; it shifts left", why:M1 },
          { t:"No change", why:"Temperature always matters here." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"A(g) ⇌ 2B(g), " + K + " = 4.0 (model). A mixture has [A] = 1.0 and [B] = 1.0 mol/L. Which way does it shift?", options:[
          { t:"Right", ok:true, why:Q + " = 1.0² ÷ 1.0 = 1.0 &lt; 4.0." },
          { t:"Left", why:"That would need " + Q + " &gt; " + K + "." },
          { t:"None", why:Q + " ≠ " + K + "." },
          { t:"It can’t be predicted", why:"Compare " + Q + " with " + K + "." }] },
        b:{ prompt:K + " = 4.0. A mixture has [A] = 0.50 and [B] = 2.0 mol/L. Which way does it shift?", options:[
          { t:"Left", ok:true, why:Q + " = 4.0 ÷ 0.50 = 8.0 &gt; 4.0." },
          { t:"Right", why:Q + " = 2.0² ÷ 0.50 = 8.0 &gt; 4.0, so it shifts left." },
          { t:"None", why:Q + " = 8.0 ≠ " + K + "." },
          { t:"It can’t be predicted", why:"Compare " + Q + " with " + K + "." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"On a concentration–time graph for N₂ + 3H₂ ⇌ 2NH₃, at 10 min [NH₃] suddenly drops; then [N₂] and [H₂] slowly fall while [NH₃] slowly rises. What was the stress?", options:[
          { t:"NH₃ was removed", ok:true, why:"Only [NH₃] jumps (down); the shift right then replaces part of it." },
          { t:"The temperature was lowered", why:"A temperature change gives no sudden jump." },
          { t:"The volume was halved", why:"All three would jump up." },
          { t:"A catalyst was added", why:M2 }] },
        b:{ prompt:"At 10 min, all three concentrations jump up at once; then [NH₃] rises while [N₂] and [H₂] fall. What was the stress?", options:[
          { t:"The volume was decreased", ok:true, why:"Every gas concentration jumps at once, then it shifts toward fewer gas moles." },
          { t:"N₂ was added", why:"Only [N₂] would jump." },
          { t:"The temperature was raised", why:"No jump, and [NH₃] would fall." },
          { t:"A catalyst was added", why:M2 }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"After N₂ is added to the ammonia equilibrium, a student says, ‘[N₂] goes back to its original value.’ Which is the best correction?", options:[
          { t:"“The shift uses up only part of the added N₂; [N₂] ends higher than before, but lower than just after adding it.”", ok:true, why:M4 },
          { t:"“[N₂] stays at its new, higher value with no shift.”", why:"It does shift." },
          { t:"“[N₂] ends lower than its original value.”", why:"It can’t over-correct." },
          { t:"“" + K + " changes so [N₂] returns.”", why:M1 }] },
        b:{ prompt:"After NH₃ is removed, a student says, ‘[NH₃] returns to its original value.’ Which is the best correction?", options:[
          { t:"“The shift replaces only part of the NH₃; it ends lower than originally, but higher than just after removal.”", ok:true, why:"The shift only partly undoes the stress." },
          { t:"“[NH₃] stays at zero.”", why:"The shift makes more NH₃." },
          { t:"“[NH₃] ends higher than originally.”", why:"It can’t over-correct." },
          { t:"“" + K + " changes to restore it.”", why:M1 }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which best explains why adding argon at constant volume doesn’t shift N₂ + 3H₂ ⇌ 2NH₃?", options:[
          { t:"“The concentrations (partial pressures) of N₂, H₂ and NH₃ don’t change, so " + Q + " still equals " + K + ".”", ok:true, why:M3 },
          { t:"“Argon reacts with nitrogen.”", why:"Argon is unreactive." },
          { t:"“The total pressure doesn’t change.”", why:"It does rise, but that doesn’t matter here." },
          { t:"“Argon is a catalyst.”", why:M2 }] },
        b:{ prompt:"Which best explains why adding more solid CaCO₃ to CaCO₃(s) ⇌ CaO(s) + CO₂(g) causes no shift?", options:[
          { t:"“Pure solids don’t appear in " + Q + " or " + K + ", so " + Q + " is unchanged.”", ok:true, why:M6 },
          { t:"“More solid means more CO₂ immediately.”", why:M6 },
          { t:"“The solid is a catalyst.”", why:M2 },
          { t:"“" + K + " increases to match.”", why:M1 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Ammonia production is exothermic. Why don’t plants run at a low temperature for the best yield?", options:[
          { t:"“The rate would be too slow; a moderate temperature with a catalyst is a compromise between yield and rate.”", ok:true, why:"Low temperature favours yield but makes the reaction very slow." },
          { t:"“" + K + " is smaller at low temperature.”", why:M5 },
          { t:"“Low temperature shifts it left.”", why:M5 },
          { t:"“Catalysts don’t work at all at low temperature.”", why:"The main reason is the slow rate." }] },
        b:{ prompt:"Why do ammonia plants use high pressure?", options:[
          { t:"“4 mol of gas become 2, so higher pressure shifts the equilibrium right and also speeds the reaction.”", ok:true, why:"High pressure helps both yield and rate." },
          { t:"“High pressure raises " + K + ".”", why:M1 },
          { t:"“High pressure shifts it toward more gas.”", why:M7 },
          { t:"“High pressure cools the gases.”", why:"Pressure isn’t a cooling method." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"Simplified: Hb + 4O₂ ⇌ Hb(O₂)₄. At high altitude there is less O₂. What happens, and how does the body respond over weeks?", options:[
          { t:"“It shifts left (less oxygenated hemoglobin); the body makes more hemoglobin, which shifts it back right.”", ok:true, why:"Less O₂ shifts it left; adding a reactant (Hb) shifts it back right." },
          { t:"“It shifts right; the body makes less hemoglobin.”", why:"Less O₂ shifts left." },
          { t:"“No shift, because " + K + " is constant.”", why:M1 },
          { t:"“It shifts left; the body raises " + K + " by breathing faster.”", why:M1 }] },
        b:{ prompt:"A sealed soda: CO₂(g) ⇌ CO₂(aq). When the bottle is opened, the CO₂ pressure above the drink drops. What happens?", options:[
          { t:"“It shifts left: CO₂ comes out of solution as bubbles.”", ok:true, why:"Lower CO₂ pressure: the system makes more gas." },
          { t:"“It shifts right: more CO₂ dissolves.”", why:"Lower pressure favours the gas." },
          { t:"“No shift: " + K + " is constant.”", why:M1 },
          { t:"“" + K + " drops to zero.”", why:M1 }] } }
    ]
  },
  task:{
    title:"Run the ammonia plant", summary:"Run the ammonia plant",
    statement:"<p>Choose operating conditions for a model ammonia plant that meet all three targets. There’s more than one good plan.</p>",
    qT:"Temperature", qP:"Pressure", qC:"Iron catalyst", qR:"Remove NH₃ continuously (cool it to a liquid)",
    about:"<strong>About the model:</strong> the points are model values, not real data. Yield points: a lower temperature favours NH₃ (exothermic), high pressure favours the side with fewer gas moles (4 → 2), and removing NH₃ pulls the equilibrium right. Rate points: hotter is faster, higher pressure means more collisions, and a catalyst speeds both directions. Cost points: low temperature means slow runs and cooling, high temperature means heating fuel, high pressure needs strong equipment, and removing NH₃ needs refrigeration; the catalyst is reused.",
    checks:["Good yield (yield points ≥ 3)", "Usable rate (rate points ≥ 2)", "Affordable (cost points ≤ 2)"],
    tips:["Exothermic: lower temperatures give more NH₃, but slowly.", "High pressure helps both yield and rate.", "A catalyst speeds things up for free, but never raises the yield."],
    explainPrompt:"Explain your plan using Le Chatelier’s principle, and explain why yield and rate pull in different directions.",
    vocab:"Use the words exothermic, shift, catalyst, rate and yield.",
    more:"There’s more than one good plan. Can you find them all?",
    after3:"Every plan uses high pressure. Real plants combine high pressure, a moderate temperature, a catalyst and NH₃ removal."
  },
  cards:[
    ["Le Chatelier’s principle", "A system at equilibrium shifts to partly counteract a stress."],
    ["Add a reactant", "Shifts right; " + K + " unchanged."],
    ["Remove a product", "Shifts right; " + K + " unchanged."],
    ["Decrease the volume (gases)", "Shifts toward fewer moles of gas."],
    ["Equal gas moles", "Volume or pressure changes cause no shift."],
    ["Inert gas at constant volume", "No shift."],
    ["Catalyst", "No shift; equilibrium reached sooner."],
    ["Raise the temperature", "Shifts toward the endothermic side; " + K + " changes."],
    ["Only temperature changes " + K, "Concentration and volume changes alter " + Q + ", not " + K + "."],
    [Q + " vs " + K, Q + " &lt; " + K + " → right; " + Q + " &gt; " + K + " → left; " + Q + " = " + K + " → at equilibrium."],
    ["Partial undoing", "An added substance ends higher than before, but lower than just after adding it."],
    ["Pure solids and liquids", "Not in " + K + "; adding more doesn’t shift the equilibrium."]
  ]
};
