// SBI4U 41 Synapses. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/41-synapses.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "The cleft is crossed by a <strong>chemical</strong>: neurotransmitter diffusing to receptors.";
const M2 = "<strong>Ca²⁺</strong> entering the terminal triggers the vesicles to fuse.";
const M3 = "A single EPSP is small (+10 mV in the model). Several must add up to reach −55 mV.";
const M4 = "An EPSP fades over about 10 ms; add what’s <strong>left</strong> when the next one arrives.";
const M5 = "Agonist: fits <strong>and</strong> activates. Antagonist: fits but <strong>blocks</strong>.";
const M6 = "Less breakdown means ACh stays longer: the signal is <strong>stronger and longer</strong>.";
const M7 = "Blocking reuptake <strong>keeps</strong> the transmitter in the cleft.";

// Drug detective: the six chips (D1–D6), in the plan's order. why: { chipIndex: feedback }
const CHIPS = ["Agonist", "Antagonist", "Reuptake inhibitor", "Enzyme inhibitor", "Release blocker", "Ca²⁺ channel blocker"];
function chips(right, why){ return CHIPS.map(function(t, i){ const o = { t:t, why:why[i] }; if (i === right) o.ok = true; return o; }); }
const STAR = '<span class="tag">★</span> ';

// Neuromuscular junction: caption for each step (index 1–6) under each condition (plan §4 model table).
const CAP_N = [
  "Ready. Press <strong>Step</strong> or <strong>Play</strong> to send an action potential down the axon.",
  "The action potential arrives at the axon terminal.",
  "Voltage-gated Ca²⁺ channels open, and Ca²⁺ floods into the terminal.",
  "All 10 vesicles fuse with the membrane and release ACh into the cleft.",
  "ACh diffuses across the synaptic cleft: 100 AU at 1 ms.",
  "ACh binds 80% of the receptors; their channels open, Na⁺ rushes in and the muscle membrane reaches −40 mV: a single twitch.",
  "Acetylcholinesterase breaks ACh down within 2 ms (0 AU at 3 ms). The receptors empty and the membrane returns to −70 mV."
];
function caps(over){ return CAP_N.map(function(c, i){ return over[i] || c; }); }

export default {
  id:"41-synapses",
  kind:"topic",
  title:"Synapses",
  topic:"Synapses",
  readyTopic:"synapses",
  hero:{
    eq:'<span class="sy-heq">action potential → <span class="sy-c-ca">Ca²⁺</span> in → <span class="sy-c-nt">ACh</span> crosses the cleft → receptors → <span class="sy-c-na">Na⁺</span> in</span>',
    eqLabel:"Action potential, then Ca²⁺ in, then ACh crosses the cleft, then receptors, then Na⁺ in",
    eqSize:"sm",
    headline:"Electrical, then chemical, then electrical again",
    text:"An action potential can’t leap the <strong>synaptic cleft</strong>. Instead, <strong>Ca²⁺</strong> floods the axon terminal, <strong>vesicles</strong> release <strong>neurotransmitter</strong>, and the transmitter drifts across to <strong>receptors</strong> on the next cell. There it opens ion channels, which can start or stop the next signal. An enzyme then clears it away, ready for the next message.",
    fig:{ html:'<div class="sy-hero" id="sy-hero" role="img" aria-label="An axon terminal above a narrow synaptic cleft above a receiving cell. A pulse runs down the axon; cerulean Ca²⁺ dots enter through opening channels; three vesicles dock and burst, releasing magenta ACh dots; the dots drift across the cleft and lock into receptors, teal Na⁺ dots stream into the receiving cell and a small +10 mV bump appears on a trace; then acetylcholinesterase (scissors) snips the ACh and the receptors empty."></div>' }
  },
  goals:[
    "I can describe, in order, how an action potential at an axon terminal releases a neurotransmitter and changes the next cell.",
    "I can explain why transmission is one-way and why each signal is brief.",
    "I can distinguish EPSPs from IPSPs and explain which ions cause each.",
    "I can calculate whether summed EPSPs and IPSPs reach threshold (spatial and temporal summation).",
    "I can predict the effect of agonists, antagonists, reuptake inhibitors, enzyme inhibitors and release blockers."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Action potentials", goal:3,
          prompt:"In module 40, what is the threshold potential in the model?",
          options:[
            { t:"About −55 mV", ok:true, why:"Below it, no spike; at or above it, a full spike." },
            { t:"−70 mV", why:"That’s the resting potential." },
            { t:"+35 mV", why:"That’s the peak." },
            { t:"0 mV", why:"Threshold is still negative." }],
          hints:["It sits between rest and the peak.", "15 mV above rest.", "−55 mV."] },
        { id:"w2", skill:"Action potentials", goal:4,
          prompt:"What happens if a stimulus raises the membrane from −70 mV to only −62 mV?",
          options:[
            { t:"It fades with no action potential", ok:true, why:"Below threshold." },
            { t:"A small action potential fires", why:"All or none: there are no small spikes." },
            { t:"A full spike fires", why:"−62 is below −55." },
            { t:"The neuron stays at −62 mV permanently", why:"It returns to rest." }],
          hints:["Compare −62 with −55.", "It’s below threshold.", "It fades."] },
        { id:"w3", skill:"Membrane transport", goal:1,
          prompt:"How do vesicles release their contents outside a cell?",
          options:[
            { t:"By fusing with the cell membrane (exocytosis)", ok:true, why:"The vesicle membrane joins the cell membrane." },
            { t:"By pumping the contents through a channel", why:"Large amounts leave by fusion, not through channels." },
            { t:"By bursting inside the cell", why:"Then the contents would stay inside." },
            { t:"By diffusing through the membrane", why:"Most transmitters can’t cross the membrane directly." }],
          hints:["Exo- means ‘out’.", "The vesicle merges with the membrane.", "Exocytosis."] },
        { id:"w4", skill:"Membrane transport", goal:3,
          prompt:"If negative ions such as Cl⁻ enter a neuron, what happens to the inside’s voltage?",
          options:[
            { t:"It becomes more negative", ok:true, why:"Adding negative charge lowers the voltage." },
            { t:"It becomes more positive", why:"That’s what positive ions entering do." },
            { t:"It reaches threshold", why:"Moving away from threshold." },
            { t:"Nothing changes", why:"Moving charge changes voltage." }],
          hints:["Negative in means…", "…more negative inside.", "More negative."] },
        { id:"w5", skill:"Enzymes and receptors", goal:5,
          prompt:"A molecule fits a receptor’s binding site but doesn’t activate it. What effect does it have?",
          options:[
            { t:"It blocks the normal signal molecule from binding", ok:true, why:"It occupies the site." },
            { t:"It activates the receptor more strongly", why:"It doesn’t activate it at all." },
            { t:"None: it just floats away", why:"While bound, it blocks the site." },
            { t:"It destroys the receptor", why:"Binding isn’t destruction." }],
          hints:["Think of a key that fits a lock but won’t turn.", "The right key can’t get in.", "It blocks."] },
        { id:"w6", skill:"Enzymes and receptors", goal:2,
          prompt:"If the enzyme that breaks down a signal molecule is inhibited, the signal molecule…",
          options:[
            { t:"stays around longer", ok:true, why:"Less breakdown." },
            { t:"is broken down faster", why:"Inhibiting the enzyme slows breakdown." },
            { t:"disappears at once", why:"That would need more enzyme." },
            { t:"changes into a different molecule", why:"That’s what the enzyme normally does." }],
          hints:["What does the enzyme normally do?", "It breaks the molecule down.", "Inhibit it, and the molecule lasts longer."] }
      ],
      refreshers:{
        "Action potentials":"Rest −70 mV, threshold −55 mV, peak +35 mV. A depolarization below threshold fades; at threshold, a full spike fires.",
        "Membrane transport":"Vesicles release their contents by exocytosis. Positive ions entering make the inside more positive; negative ions entering make it more negative.",
        "Enzymes and receptors":"Receptors respond to the molecule that fits them. Blockers occupy the site without activating it. Enzyme inhibitors make their substrate last longer."
      }
    }
  },
  explore:{
    heading:"Synapse simulator",
    intro:"Step through a signal crossing a synapse, then add drugs and toxins. In Summation mode, combine inputs and see whether the next neuron fires.",
    modes:[["nmj", "Neuromuscular junction"], ["sum", "Summation"]],
    drugs:[["none", "No drug"], ["ca", "Ca²⁺ channel blocker"], ["rel", "Release blocker (botulinum-toxin-like)"], ["ant", "Receptor antagonist (curare-like)"], ["ago", "Receptor agonist, no nerve impulse (nicotine-like)"], ["ache", "Acetylcholinesterase inhibitor"]],
    drugTag:{ ca:"Ca²⁺ channel blocker on the Ca²⁺ channels", rel:"Release blocker (botulinum-toxin-like): vesicles can’t fuse", ant:"Curare-like antagonist sitting in the receptors", ago:"Nicotine-like agonist in the cleft", ache:"Acetylcholinesterase inhibitor on the enzyme" },
    steps:[
      "Action potential reaches the axon terminal",
      "Ca²⁺ channels open; Ca²⁺ enters",
      "Vesicles fuse and release ACh",
      "ACh diffuses across the cleft",
      "ACh binds receptors; Na⁺ channels open",
      "Acetylcholinesterase breaks ACh down"],
    // Model table (plan §4 Explore): readout values per condition. ach = value shown from step 4, ach6 from step 6; *6 = from step 6.
    nmj:{
      none:{ ca:"high", ves:"10 of 10", ach:"100 AU at 1 ms", ach6:"100 AU at 1 ms, 0 AU at 3 ms", rec:"80%", mem:"−40 mV (threshold reached)", res:"Single twitch", clr:"2 ms", caps:CAP_N },
      ca:{ ca:"low", ves:"0 of 10", ach:"0 AU at 1 ms", ach6:"0 AU at 1 ms, 0 AU at 3 ms", rec:"0%", mem:"−70 mV (stays at rest)", res:"None", clr:"—",
        caps:caps({ 2:"The Ca²⁺ channels are blocked: no Ca²⁺ enters the terminal (Ca²⁺ stays low).", 3:"With no Ca²⁺ trigger, the vesicles stay put: 0 of 10 released.", 4:"No ACh reaches the cleft (0 AU).", 5:"No receptors are bound, so the muscle membrane stays at −70 mV. No contraction.", 6:"There is no ACh for acetylcholinesterase to break down." }) },
      rel:{ ca:"high", ves:"0 of 10", ach:"0 AU at 1 ms", ach6:"0 AU at 1 ms, 0 AU at 3 ms", rec:"0%", mem:"−70 mV (stays at rest)", res:"None", clr:"—",
        caps:caps({ 3:"Ca²⁺ is in, but the release blocker stops the vesicles fusing: they dock and stay shut. 0 of 10 released.", 4:"No ACh reaches the cleft (0 AU).", 5:"No receptors are bound, so the muscle membrane stays at −70 mV. No contraction.", 6:"There is no ACh for acetylcholinesterase to break down." }) },
      ant:{ ca:"high", ves:"10 of 10", ach:"100 AU at 1 ms", ach6:"100 AU at 1 ms, 0 AU at 3 ms", rec:"0%", mem:"−70 mV (stays at rest)", res:"None (paralysis)", clr:"2 ms",
        caps:caps({ 0:"Ready. The antagonist already sits in the receptors. Press <strong>Step</strong> or <strong>Play</strong>.", 5:"ACh reaches the receptors, but the antagonist fills them: 0% bound by ACh. The membrane stays at −70 mV: paralysis.", 6:"Acetylcholinesterase clears the unused ACh within 2 ms. The antagonist stays in the receptors." }) },
      ago:{ ca:"low", ves:"0 of 10", ach:"0 AU at 1 ms (agonist present)", ach6:"0 AU at 1 ms, 0 AU at 3 ms (agonist present)", rec:"60%", mem:"−45 mV (threshold reached)", res:"Twitch without a nerve signal", clr:"—",
        caps:caps({ 0:"Ready. The agonist is in the cleft, and no nerve impulse will come. Press <strong>Step</strong> or <strong>Play</strong>.", 1:"No action potential arrives: the nerve is silent.", 2:"With no impulse, the Ca²⁺ channels stay shut (Ca²⁺ low).", 3:"No vesicles are released (0 of 10).", 4:"There is no ACh in the cleft, but the agonist is there.", 5:"The agonist binds 60% of the receptors and opens them: the membrane reaches −45 mV, a twitch without a nerve signal.", 6:"The agonist drifts off the receptors again, so the twitch ends. No ACh was involved, so there was nothing for acetylcholinesterase to clear." }) },
      ache:{ ca:"high", ves:"10 of 10", ach:"100 AU at 1 ms", ach6:"100 AU at 1 ms, 90 AU at 3 ms", rec:"80%", rec6:"80%, held", mem:"−40 mV (threshold reached)", mem6:"−40 mV, held", res5:"Contracting", res:"Sustained contraction (spasm)", clr:"> 20 ms",
        caps:caps({ 6:"The inhibited enzyme barely works: ACh is still 90 AU at 3 ms, the receptors stay bound and the membrane is held at −40 mV: sustained contraction (spasm)." }) }
    },
    sum:{ epsp:10, ipsp:-5, fade:10, rest:-70, thr:-55 },
    sumIdle:"Set the inputs, then press <strong>Play</strong> to watch the potentials add up at the axon hillock.",
    modelNote:"<strong>How the model works.</strong> Neuromuscular junction: the values come from one model table (muscle fibre rest −70 mV, threshold −55 mV; ACh in arbitrary units, AU). Summation: each excitatory firing adds an EPSP of +10 mV that fades evenly to 0 over 10 ms; I1 adds an IPSP of −5 mV that fades evenly over 10 ms. Hillock potential = −70 mV + what remains of each potential. The neuron fires if the hillock reaches −55 mV or higher at any moment (exactly −55 mV counts). Real EPSPs fade along a curve and vary in size; the straight-line fade and fixed sizes are a model.",
    predIntro:"Make a prediction first. Then the simulator will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"nmj", drug:"none" }, to:{ drug:"ca" },
        prompt:"<span class=\"muted\">Neuromuscular junction, no drug.</span> Now the Ca²⁺ channel blocker is turned on and the signal plays. What happens?",
        options:[
          { t:"No ACh is released, so no contraction", ok:true },
          { t:"Normal contraction, since Na⁺ still arrives" },
          { t:"A stronger contraction" },
          { t:"ACh is released but not cleared" }],
        explain:"The impulse arrives, no Ca²⁺ enters, and the vesicles stay put. Ca²⁺ entry is the trigger for vesicle fusion." },
      { id:"p2", start:{ mode:"nmj", drug:"none" }, to:{ drug:"ache" },
        prompt:"<span class=\"muted\">Neuromuscular junction, no drug.</span> Now the acetylcholinesterase inhibitor is turned on. What happens to the muscle?",
        options:[
          { t:"It stays contracted (spasm)", ok:true },
          { t:"It can’t contract at all" },
          { t:"It contracts normally" },
          { t:"It relaxes faster" }],
        explain:"ACh stays at 90 AU at 3 ms and the receptors stay bound. Without breakdown, ACh keeps stimulating the muscle." },
      { id:"p3", start:{ mode:"sum", g:-1, t2:-1, ti:-1 },
        prompt:"<span class=\"muted\">Summation: only E1 fires, at 0 ms.</span> When you press Play, does the neuron fire?",
        options:[
          { t:"No: the hillock reaches only −60 mV", ok:true },
          { t:"Yes, at −60 mV" },
          { t:"Yes, at +35 mV" },
          { t:"No, it drops to −75 mV" }],
        explain:"One triangle peaks at −60 mV. One EPSP is +10 mV; threshold needs +15." },
      { id:"p4", start:{ mode:"sum", g:-1, t2:-1, ti:-1 }, to:{ t2:2 },
        prompt:"<span class=\"muted\">E1 fires at 0 ms.</span> Now E2 also fires, at 2 ms. Does the neuron fire?",
        options:[
          { t:"Yes: at 2 ms the hillock is at −52 mV", ok:true },
          { t:"No: inputs must arrive at exactly the same time" },
          { t:"No: only one input counts at a time" },
          { t:"Yes, but only if I1 fires too" }],
        explain:"The sum peaks at −52 mV. E1 has faded to +8 by 2 ms; add E2’s +10 to get +18 above rest." }
    ],
    chalIntro:"Use the simulator to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:4, prompt:"Summation: fire E1 twice so the neuron fires, using the <strong>longest</strong> possible gap.",
        why:"At 5 ms the first EPSP still gives +5, and 5 + 10 = 15: exactly −55 mV, so the neuron fires.",
        wrong:{ mode:"Switch to <strong>Summation</strong> mode first.", others:"Use E1 only: switch E2 and I1 off.", off:"Make E1 fire a second time: set its gap.", g6:"E1 has faded to +4, so 4 + 10 = 14: −56 mV, just short.", short:"That fires, but a longer gap also works." },
        hints:["How much of the first EPSP is left after <i>g</i> ms?", "10 − <i>g</i> mV is left; add 10 for the second.", "You need a total of 15: <i>g</i> = 5."] },
      { id:"tc2", goal:5, prompt:"Neuromuscular junction: choose the one toggle that stops contraction even though ACh <strong>is</strong> released into the cleft.",
        why:"The antagonist sits in the receptors, so the released ACh can’t bind: no Na⁺ enters and the muscle stays at rest.",
        wrong:{ mode:"Switch to <strong>Neuromuscular junction</strong> mode first.", none:"With no drug, the muscle twitches normally. Choose a drug.", noRelease:"Then no ACh is released at all.", ache:"That makes contraction last longer.", ago:"That causes a twitch." },
        hints:["ACh must be in the cleft, yet do nothing.", "Something must stop it binding.", "The receptor antagonist."] },
      { id:"tc3", goal:4, stretch:true, prompt:"Summation: E1 fires at 0 ms; E2 and I1 fire together at <i>t</i> ms. Choose <i>t</i> so the neuron still fires.",
        why:"At <i>t</i> = 0: 10 + 10 − 5 = 15, exactly −55 mV. Any later and E1 has started to fade.",
        wrong:{ mode:"Switch to <strong>Summation</strong> mode first.", gap:"Switch off E1’s second firing: E1 fires only at 0 ms here.", e2:"E2 must fire too.", i1:"I1 must fire too.", apart:"E2 and I1 must fire together: give them the same time.", t5:"Without I1 that works (15), but I1 removes 5: −60 mV.", t1:"9 + 10 − 5 = 14: −56 mV." },
        hints:["I1 subtracts 5, so the excitatory total must reach 20.", "E2 gives 10; E1 must still be giving 10.", "E1 hasn’t faded at all only at <i>t</i> = 0."] }
    ]
  },
  part3:{
    slug:"drugs", name:"Drugs",
    heading:"Drugs at the synapse",
    intro:"Every drug and toxin here acts at one step of the synapse, so you can predict its effect instead of memorizing it. Zoom in on a receptor’s binding site, read some data, then meet the enzyme inhibitors and release blockers. Mechanisms only: no doses.",
    zoom:{
      title:"Station 1: the binding site",
      panel:"Zoom to the molecules: the binding site",
      how:"Choose a molecule from the list to place it in the receptor’s binding site (Enter works too). Try all three.",
      shapes:[
        { id:"tx", t:"The transmitter (ACh)", res:"ACh fits the binding site and switches the channel open: Na⁺ flows into the cell." },
        { id:"ag", t:"An agonist (a different shape)", res:"A different shape, but its key part fits too, and it also switches the channel open. An agonist <strong>mimics</strong> the transmitter." },
        { id:"an", t:"An antagonist", res:"It fits the binding site but leaves the channel shut. While it sits there, ACh can’t get in: an antagonist <strong>blocks</strong> the transmitter." }],
      empty:"The binding site is empty and the channel is shut.",
      all:"Agonist: fits <strong>and</strong> activates. Antagonist: fits but <strong>blocks</strong>.",
      cards:[
        { t:"Nicotine", d:"An <strong>agonist</strong> at one type of ACh receptor: it fits and opens the channel, as ACh does." },
        { t:"Curare", d:"An <strong>antagonist</strong> at the neuromuscular junction: it fits the ACh receptor but blocks it. Historically a hunting-dart poison; related medicines relax muscles during surgery." }]
    },
    data:{
      title:"Station 2: reuptake inhibitors",
      panel:"Check it with data",
      intro:"Some transmitters, such as serotonin, are cleared mainly by <strong>reuptake</strong> transporters that pull them back into the terminal.",
      caption:"Model data: serotonin in the cleft (AU)",
      times:[0, 2, 5, 10, 20],
      normal:[100, 50, 10, 0, 0],
      inhib:[100, 85, 70, 45, 15],
      rowN:"Normal", rowI:"With a reuptake inhibitor",
      describe:"Model data. Serotonin in the cleft over 20 ms after release, with a dashed line at 50 AU. Normal: 100, 50, 10, 0 and 0 AU at 0, 2, 5, 10 and 20 ms. With a reuptake inhibitor: 100, 85, 70, 45 and 15 AU. The normal curve crosses 50 AU at 2 ms; the inhibitor curve crosses it between 5 and 10 ms, at about 9 ms.",
      // VERIFY: the plan says "about 12 ms" for the inhibitor, but its own table (70 AU at 5 ms, 45 AU at 10 ms) crosses 50 AU at about 9 ms. The module uses about 9 ms.
      qs:[
        { id:"sa", prompt:"Normal: for how long does serotonin stay above 50 AU?",
          choices:[{ t:"0 ms", fb:"It starts at 100 AU." }, { t:"2 ms", ok:true, fb:"Right: it has fallen to 50 AU by 2 ms." }, { t:"5 ms", fb:"By 5 ms it is down to 10 AU." }, { t:"10 ms", fb:"By 10 ms it is gone." }] },
        { id:"sb", prompt:"With a reuptake inhibitor: about how long does it stay above 50 AU?",
          choices:[{ t:"about 2 ms", fb:"At 2 ms it is still 85 AU." }, { t:"about 5 ms", fb:"At 5 ms it is still 70 AU." }, { t:"about 9 ms", ok:true, fb:"Right: it is 70 AU at 5 ms and 45 AU at 10 ms, so it crosses 50 AU at about 9 ms, more than four times as long as normal." }, { t:"about 20 ms", fb:"At 10 ms it is already down to 45 AU." }] }],
      text:"SSRIs (selective serotonin reuptake inhibitors), used to treat depression, work this way. Some stimulant drugs, such as cocaine, block dopamine reuptake (mechanism only)."
    },
    more:{
      title:"Station 3: enzyme inhibitors and release blockers",
      cards:[
        { t:"Acetylcholinesterase inhibitors", step:"Step changed: ACh breakdown in the cleft (step 6).", d:"Some insecticides use them (insects’ nerves are overstimulated), and some medicines for Alzheimer disease use them in carefully chosen amounts to boost weak ACh signalling." },
        { t:"Botulinum toxin", step:"Step changed: vesicle release (step 3).", d:"It stops vesicles releasing ACh. Tiny medical doses relax overactive muscles." }]
    },
    quickCheck:{
      title:"Quick check", summary:"Drugs at the synapse quick check",
      items:[
        { id:"q1", goal:5, prompt:"A molecule binds the ACh receptor and opens its channel. It is…",
          choices:[
            { t:"an agonist", ok:true, fb:"Right. It fits <strong>and</strong> activates, like the transmitter." },
            { t:"an antagonist", fb:"Fits <strong>and</strong> activates." },
            { t:"a reuptake inhibitor", fb:"Fits <strong>and</strong> activates." },
            { t:"a release blocker", fb:"Fits <strong>and</strong> activates." }] },
        { id:"q2", goal:5, prompt:"Curare causes paralysis because…",
          choices:[
            { t:"it blocks ACh receptors on muscle", ok:true, fb:"Right. ACh is released but can’t bind." },
            { t:"it blocks Ca²⁺ entry", fb:"ACh is released but can’t bind." },
            { t:"it destroys ACh", fb:"ACh is released but can’t bind." },
            { t:"it inhibits acetylcholinesterase", fb:"ACh is released but can’t bind." }] },
        { id:"q3", goal:5, prompt:"An SSRI makes serotonin…",
          choices:[
            { t:"stay in the cleft longer", ok:true, fb:"Right. Blocking reuptake keeps it in the cleft." },
            { t:"break down faster", fb:"Blocking reuptake keeps it in the cleft." },
            { t:"release less", fb:"Blocking reuptake keeps it in the cleft." },
            { t:"bind fewer receptors", fb:"Blocking reuptake keeps it in the cleft." }] },
        { id:"q4", goal:5, prompt:"Botulinum toxin relaxes muscles because…",
          choices:[
            { t:"vesicles can’t release ACh", ok:true, fb:"Right. No release, no signal." },
            { t:"ACh is broken down faster", fb:"No release, no signal." },
            { t:"receptors are activated", fb:"No release, no signal." },
            { t:"Cl⁻ enters", fb:"No release, no signal." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"order", type:"order", title:"Put the steps in order", goal:[1, 3],
        instruction:"Put each sequence in order, from the action potential arriving to the effect on the next cell.",
        sequences:[
          { id:"s1", goal:1, prompt:"Excitatory (neuromuscular junction), 7 steps.",
            steps:[
              "The action potential reaches the axon terminal.",
              "Voltage-gated Ca²⁺ channels open and Ca²⁺ enters.",
              "Vesicles fuse with the membrane and release ACh.",
              "ACh diffuses across the synaptic cleft.",
              "ACh binds receptors; their Na⁺ channels open.",
              "Na⁺ enters and the muscle membrane depolarizes.",
              "Acetylcholinesterase breaks ACh down."],
            start:[2, 5, 0, 6, 3, 1, 4],
            wrong:[
              { order:[0, 2, 1, 3, 4, 5, 6], fb:"Ca²⁺ is the trigger, so it comes first." },
              { order:[2, 0, 1, 3, 4, 5, 6], fb:"Ca²⁺ is the trigger, so it comes first." },
              { order:[0, 1, 2, 3, 6, 4, 5], fb:"The transmitter must act before it is cleared." },
              { order:[0, 1, 2, 6, 3, 4, 5], fb:"The transmitter must act before it is cleared." },
              { order:[0, 1, 2, 3, 4, 6, 5], fb:"The transmitter must act before it is cleared." }],
            general:"Ask what has to happen before it can be done. Ca²⁺ is the trigger for release, and the transmitter must act before it is cleared.",
            why:"The electrical signal arrives, Ca²⁺ triggers release, ACh crosses and binds, Na⁺ enters, and the enzyme ends the signal.",
            hints:["Start with the electrical signal.", "What triggers vesicles?", "Ca²⁺ → release → diffusion → binding → Na⁺ in → breakdown."] },
          { id:"s2", goal:3, prompt:"Inhibitory, 5 steps.",
            steps:[
              "The action potential reaches the axon terminal.",
              "Ca²⁺ enters the terminal.",
              "GABA is released into the cleft.",
              "GABA binds receptors; their Cl⁻ channels open.",
              "Cl⁻ enters and the membrane hyperpolarizes (IPSP)."],
            start:[3, 0, 4, 2, 1],
            wrong:[
              { order:[0, 2, 1, 3, 4], fb:"Ca²⁺ is the trigger, so it comes first." },
              { order:[2, 0, 1, 3, 4], fb:"Ca²⁺ is the trigger, so it comes first." }],
            general:"Ask what has to happen before it can be done. The transmitter must be released before it can bind.",
            why:"Same start as an excitatory synapse, but GABA opens Cl⁻ channels. Cl⁻ entering makes the inside more negative, so the membrane hyperpolarizes rather than depolarizes.",
            hints:["The first two steps are the same as at any synapse.", "Release, then binding, then the ions move.", "Action potential → Ca²⁺ in → GABA released → GABA binds → Cl⁻ in."] }
        ] },
      { id:"detective", type:"mc", title:"Drug detective", star:true, goal:5,
        instruction:"Each row gives data from a synapse. Which drug or toxin is acting? Items 4 to 7 are non-routine; the last two go beyond the Final Check.", how:"",
        items:[
          { id:"d1", goal:5, prompt:"ACh released normally; receptors bound 0%; no EPSP.",
            options:chips(1, ["An agonist would bind and activate the receptors, but none are bound.", "ACh is in the cleft but can’t bind: something occupies the receptors without activating them.", "That would keep transmitter in the cleft longer, not leave the receptors empty.", "That would hold ACh on the receptors longer; here none are bound.", "ACh <strong>is</strong> in the cleft.", "ACh was released, so Ca²⁺ must have entered."]) },
          { id:"d2", goal:5, prompt:"Ca²⁺ enters normally, but no transmitter appears in the cleft.",
            options:chips(4, ["An agonist acts on receptors; it doesn’t stop release.", "An antagonist blocks receptors; transmitter would still appear in the cleft.", "That would leave more transmitter in the cleft, not none.", "That would leave more transmitter in the cleft, not none.", "Ca²⁺ arrived, yet nothing was released: the step after the Ca²⁺ trigger is blocked.", "Ca²⁺ entered normally."]) },
          { id:"d3", goal:5, prompt:"Serotonin stays in the cleft 6 times longer; enzyme activity normal; transporters blocked.",
            options:chips(2, ["An agonist mimics the transmitter; it doesn’t change how long serotonin stays.", "An antagonist blocks receptors; it doesn’t keep serotonin in the cleft.", "The transporters that pull serotonin back are blocked. " + M7, "The enzyme is working; the transporters aren’t.", "Serotonin was released; it just stays longer.", "Serotonin was released, so Ca²⁺ entered."]) },
          { id:"d4", goal:5, prompt:STAR + "Receptors 60% bound with no nerve impulse at all.",
            options:chips(0, ["Receptors are bound and active although no transmitter was released: a drug that fits and activates them.", "Antagonists block; these receptors are <strong>activated</strong>.", "With no impulse, no transmitter is released to keep in the cleft.", "With no impulse, there’s no ACh for the enzyme to act on.", "Nothing was being released anyway; something else is binding the receptors.", "That would stop release; it wouldn’t bind receptors."]) },
          { id:"d5", goal:5, prompt:STAR + "ACh stays at 90 AU at 3 ms; acetylcholinesterase activity 5%.",
            options:chips(3, ["ACh itself is lingering; nothing new is activating the receptors.", "That blocks receptors; it doesn’t keep ACh in the cleft.", "ACh is cleared mainly by the enzyme, and here the enzyme is barely working.", "Acetylcholinesterase is at 5%, so ACh isn’t broken down and stays in the cleft.", "ACh was released: it’s at 90 AU.", "ACh was released, so Ca²⁺ entered."]) },
          { id:"d6", goal:5, prompt:STAR + "After an action potential, Ca²⁺ in the terminal stays low and no vesicles fuse.",
            options:chips(5, ["That acts on receptors, after release.", "That acts on receptors, after release.", "That acts after release.", "That acts after release.", "Look at Ca²⁺: it never rose.", "The action potential arrived but Ca²⁺ never entered, so the trigger for release is missing."]),
            hints:["Which step comes first in the terminal?", "Ca²⁺ must enter before vesicles fuse.", "Ca²⁺ never rose: the channels are blocked."] },
          { id:"d7", goal:5, prompt:STAR + "<span class=\"tag\">Investigation</span> Drug Q stops muscle contraction. Is it an antagonist or a release blocker? Which <strong>single</strong> measurement tells you?",
            options:[
              { t:"ACh level in the cleft", ok:true, why:"With an antagonist ACh is present; with a release blocker it’s absent." },
              { t:"Muscle strength", why:"Both drugs stop contraction, so muscle strength can’t tell them apart." },
              { t:"Body temperature", why:"Neither drug changes temperature in a way that tells them apart." },
              { t:"Heart rate", why:"That doesn’t show which step at the junction is blocked." }] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Cora", goal:[1, 4, 5], how:"",
        instruction:"Cora made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Explain how a signal crosses a synapse.",
            steps:["An action potential reaches the axon terminal.", "Na⁺ entering the terminal makes the vesicles fuse.", "Neurotransmitter diffuses across the cleft.", "It binds receptors on the next cell, opening ion channels."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 is correct.", "Step 4 is correct."],
            fixes:[
              { t:"Voltage-gated Ca²⁺ channels open, and Ca²⁺ entering makes the vesicles fuse.", ok:true, why:M2 },
              { t:"The electrical impulse jumps the cleft directly.", why:M1 },
              { t:"K⁺ leaving the terminal makes the vesicles fuse.", why:"K⁺ is part of repolarization." },
              { t:"Step 2 is correct.", why:"Na⁺ drives the action potential; Ca²⁺ triggers release." }],
            hints:["Which ion triggers exocytosis here?", "It’s a 2+ ion.", "Ca²⁺."] },
          { id:"e2", goal:4, task:"E1 fires twice, 6 ms apart (EPSP +10 mV, fading to 0 over 10 ms). Does the neuron fire?",
            steps:["Rest is −70 mV and threshold is −55 mV, so I need +15 mV.", "The first EPSP is still +10 mV when the second arrives.", "So the total is +20 mV, giving −50 mV.", "The neuron fires."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows from step 2. The mistake is earlier.", "Check the earlier steps."],
            fixes:[
              { t:"After 6 ms the first EPSP has faded to +4 mV, so the total is +14 mV: −56 mV, and it doesn’t fire.", ok:true, why:M4 },
              { t:"The first EPSP has faded to 0, so the total is +10 mV.", why:"It fades over 10 ms, not 6." },
              { t:"EPSPs can’t add together.", why:"They do: that’s temporal summation." },
              { t:"Step 2 is correct.", why:"EPSPs fade with time." }],
            hints:["How much of an EPSP is left after 6 of its 10 ms?", "10 × (1 − 6/10) = 4 mV.", "4 + 10 = 14 < 15: no spike."] },
          { id:"e3", goal:5, task:"Explain how an SSRI affects serotonin signalling.",
            steps:["Serotonin is released into the cleft and binds receptors.", "Normally, transporters pull serotonin back into the terminal.", "An SSRI destroys serotonin faster, so less reaches the receptors.", "So the serotonin signal changes."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 is vague but true."],
            fixes:[
              { t:"An SSRI blocks the reuptake transporters, so serotonin stays in the cleft longer and keeps acting on receptors.", ok:true, why:M7 },
              { t:"An SSRI blocks serotonin receptors.", why:"That would be an antagonist." },
              { t:"An SSRI makes more vesicles fuse.", why:"It acts after release." },
              { t:"Step 3 is correct.", why:"Blocking reuptake keeps serotonin around; it doesn’t destroy it." }],
            hints:["What does ‘reuptake inhibitor’ mean?", "It inhibits the pulling back.", "Serotonin stays longer."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most: the spasm from the enzyme inhibitor, or how close the summation sums came to threshold?" },
      { id:"j2", q:"In your own words, why does a synapse turn an electrical signal into a chemical one and back?" },
      { id:"j3", q:"Explain to a friend how you’d tell an antagonist from a release blocker using one measurement." },
      { id:"j4", q:"Medicines that act at synapses help many people but can have side effects. What would you want to know before deciding a medicine’s benefits outweigh its risks?" }
    ]
  },
  final:{
    intro:"Model: rest −70 mV, threshold −55 mV (the neuron fires at −55 mV or above).",
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What directly triggers vesicles to release neurotransmitter?", options:[
          { t:"Ca²⁺ entering the axon terminal", ok:true, why:M2 },
          { t:"Na⁺ entering the axon terminal", why:M2 },
          { t:"K⁺ leaving the terminal", why:"That’s repolarization." },
          { t:"The transmitter binding receptors", why:"Binding happens after release." }] },
        b:{ prompt:"Which enzyme breaks down acetylcholine in the cleft?", options:[
          { t:"Acetylcholinesterase", ok:true, why:"It ends each signal by breaking ACh down." },
          { t:"ATP synthase", why:"That makes ATP." },
          { t:"Helicase", why:"That unwinds DNA." },
          { t:"Amylase", why:"That digests starch." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Which ion movement causes an IPSP at a GABA synapse?", options:[
          { t:"Cl⁻ entering the cell", ok:true, why:"Negative charge in makes the inside more negative, away from threshold." },
          { t:"Na⁺ entering the cell", why:"That causes an EPSP." },
          { t:"Ca²⁺ entering the cell", why:"Ca²⁺ triggers release in the terminal." },
          { t:"Cl⁻ leaving the cell", why:"Cl⁻ entering makes the inside more negative." }] },
        b:{ prompt:"An EPSP moves the membrane…", options:[
          { t:"toward threshold, by letting positive ions such as Na⁺ in", ok:true, why:"Positive charge in makes the inside less negative." },
          { t:"away from threshold, by letting Cl⁻ in", why:"That’s an IPSP." },
          { t:"all the way to +35 mV every time", why:"That’s an action potential." },
          { t:"to exactly −70 mV", why:"That’s rest." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"Why does transmission at a chemical synapse go only one way?", options:[
          { t:"Vesicles are only in the axon terminal and receptors only on the receiving cell", ok:true, why:"Transmitter is released on one side and detected only on the other." },
          { t:"The cleft has a one-way valve", why:"There’s no valve." },
          { t:"Ca²⁺ only moves one way", why:"That’s not what decides direction." },
          { t:"The transmitter is too heavy to diffuse back", why:"It diffuses freely; there are just no receptors behind it." }] },
        b:{ prompt:"What is temporal summation?", options:[
          { t:"Repeated EPSPs from one input arriving close together and adding up", ok:true, why:"The second arrives before the first has faded." },
          { t:"EPSPs from several inputs at the same moment adding up", why:"That’s spatial summation." },
          { t:"An EPSP that lasts forever", why:"EPSPs fade." },
          { t:"A single EPSP reaching +35 mV", why:M3 }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Three excitatory inputs of +8 mV each and one inhibitory input of −6 mV arrive at the same moment. Does the neuron fire?", options:[
          { t:"Yes: −70 + 24 − 6 = −52 mV, which is above threshold", ok:true, why:"−52 mV is at or above −55 mV, so it fires." },
          { t:"No: inhibition cancels everything", why:"−6 doesn’t cancel +24." },
          { t:"No: −70 + 24 = −46, minus 6 is −52, which is below threshold", why:"−52 is <strong>above</strong> −55." },
          { t:"Yes, but only because one input alone reaches threshold", why:"One input gives only −62." }] },
        b:{ prompt:"Two excitatory inputs of +8 mV each and one inhibitory input of −4 mV arrive at the same moment. Does the neuron fire?", options:[
          { t:"No: −70 + 16 − 4 = −58 mV, which is below threshold", ok:true, why:"The net is +12 mV, short of the +15 needed." },
          { t:"Yes: 8 + 8 = 16, which beats 15", why:"Don’t forget the −4: the net is +12." },
          { t:"Yes: any two inputs fire a neuron", why:M3 },
          { t:"No: inhibitory input always wins", why:"It depends on the totals." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"A drug inhibits acetylcholinesterase at a neuromuscular junction. What happens?", options:[
          { t:"ACh stays in the cleft, so the muscle stays contracted", ok:true, why:M6 },
          { t:"The muscle can’t contract, because ACh is destroyed", why:M6 },
          { t:"No ACh is released", why:"Release isn’t affected." },
          { t:"The muscle contracts normally", why:"Breakdown is slowed, so the signal lasts." }] },
        b:{ prompt:"A toxin blocks the voltage-gated Ca²⁺ channels in the axon terminal. What happens?", options:[
          { t:"No transmitter is released, so the next cell isn’t stimulated", ok:true, why:M2 },
          { t:"Transmitter is released continuously", why:"Ca²⁺ is needed for release." },
          { t:"Receptors are blocked", why:"Receptors are fine; nothing reaches them." },
          { t:"Transmitter stays in the cleft longer", why:"None is released." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"A medicine blocks the transporters that take dopamine back into the terminal. What happens to dopamine signalling?", options:[
          { t:"Dopamine stays in the cleft longer, so its signal is stronger or longer", ok:true, why:M7 },
          { t:"Dopamine is destroyed faster", why:M7 },
          { t:"No dopamine is released", why:"Release isn’t affected." },
          { t:"Dopamine receptors are blocked", why:M5 }] },
        b:{ prompt:"A toxin prevents vesicles from fusing with the terminal membrane. What happens at a neuromuscular junction?", options:[
          { t:"No ACh is released, so the muscle relaxes and can’t contract", ok:true, why:"No release, no signal." },
          { t:"ACh builds up in the cleft", why:"It never gets out of the vesicles." },
          { t:"The muscle stays contracted", why:"That’s what an enzyme inhibitor does." },
          { t:"The receptors are activated directly", why:"That’s an agonist." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best description of how a signal crosses a synapse?", options:[
          { t:"“The action potential opens Ca²⁺ channels in the terminal; Ca²⁺ makes vesicles release transmitter, which diffuses across the cleft and binds receptors that open ion channels in the next cell.”", ok:true, why:M1 },
          { t:"“The action potential jumps across the cleft to the next cell.”", why:M1 },
          { t:"“Na⁺ ions carry the impulse across the cleft.”", why:"Ions don’t carry the signal across; the transmitter does." },
          { t:"“The transmitter travels along the axon to the next neuron.”", why:"It’s released at the terminal and crosses the cleft." }] },
        b:{ prompt:"Which is the best explanation of why two EPSPs from one input sometimes fire a neuron and sometimes don’t?", options:[
          { t:"“Each EPSP fades over time. If the second arrives soon enough, enough of the first remains for the total to reach threshold.”", ok:true, why:M4 },
          { t:"“EPSPs only add when they come from different neurons.”", why:"Repeated EPSPs from one input add too: temporal summation." },
          { t:"“The second EPSP is always bigger.”", why:"Each is the same size." },
          { t:"“Neurons fire randomly.”", why:"The model is deterministic: it’s arithmetic." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which statement uses the terms correctly?", options:[
          { t:"“An agonist binds a receptor and activates it; an antagonist binds but blocks it.”", ok:true, why:M5 },
          { t:"“An agonist blocks a receptor; an antagonist activates it.”", why:M5 },
          { t:"“An antagonist destroys the transmitter.”", why:"That’s an enzyme’s job." },
          { t:"“An agonist stops transmitter release.”", why:"That’s a release blocker." }] },
        b:{ prompt:"Which statement uses the terms correctly?", options:[
          { t:"“A reuptake inhibitor keeps transmitter in the cleft by blocking the transporters that remove it.”", ok:true, why:M7 },
          { t:"“A reuptake inhibitor blocks the receptors.”", why:M5 },
          { t:"“A reuptake inhibitor breaks down the transmitter.”", why:M7 },
          { t:"“A reuptake inhibitor stops Ca²⁺ entering.”", why:"That’s a Ca²⁺ channel blocker." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"During surgery, a curare-like medicine is used to relax muscles. How does it work?", options:[
          { t:"It blocks ACh receptors on muscle, so ACh can’t trigger contraction", ok:true, why:"It’s an antagonist: it fits the receptor but blocks it." },
          { t:"It stops the brain from sending signals", why:"Signals still reach the junction." },
          { t:"It speeds up ACh breakdown", why:"It acts on the receptors." },
          { t:"It activates ACh receptors", why:M5 }] },
        b:{ prompt:"Nicotine binds to one type of ACh receptor and opens its channel. What kind of drug is it at that receptor?", options:[
          { t:"An agonist", ok:true, why:"It fits and activates the receptor." },
          { t:"An antagonist", why:M5 },
          { t:"A reuptake inhibitor", why:"It acts on the receptor." },
          { t:"An enzyme inhibitor", why:"It doesn’t affect acetylcholinesterase." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"Some insecticides inhibit acetylcholinesterase in insects. Why does this kill them?", options:[
          { t:"ACh builds up, so their nerves and muscles are overstimulated and can’t function normally", ok:true, why:M6 },
          { t:"ACh can’t be made at all", why:"It’s made; it just isn’t cleared." },
          { t:"Their receptors are blocked", why:M5 },
          { t:"Their nerves stop releasing ACh", why:"Release continues." }] },
        b:{ prompt:"Some medicines for Alzheimer disease, where ACh signalling is weak, inhibit acetylcholinesterase. What’s the intended effect?", options:[
          { t:"ACh lasts longer at synapses, boosting the weak signal", ok:true, why:M6 },
          { t:"ACh is broken down faster", why:M6 },
          { t:"More ACh receptors are blocked", why:"They want more signalling, not less." },
          { t:"Vesicles stop releasing ACh", why:"That would weaken the signal further." }] } }
    ]
  },
  task:{
    title:"Every input counts", summary:"Every input counts",
    statement:"<p>A neuron receives several excitatory inputs (+10 mV each) and several inhibitory inputs (−5 mV each), all arriving at the same moment. Choose how many of each fire so every condition is met. Can you find all the answers?</p><ol class=\"sy-tlist\"><li>The neuron fires (the hillock reaches −55 mV or higher).</li><li>At least one inhibitory input is active.</li><li>Every excitatory input is needed: silence any one of them and the neuron no longer fires.</li></ol><p class=\"tiny muted\"><span class=\"bio-model\">Model</span> Rest −70 mV, threshold −55 mV. All inputs arrive together, so their potentials simply add (spatial summation).</p>",
    checks:["Fires", "Inhibition present", "Every excitatory input counts"],
    tips:[
      "You need a net +15 mV above rest.",
      "Add at least one inhibitory input.",
      "If removing one excitatory input still leaves +15 mV or more, you have one to spare."
    ],
    explainPrompt:"Explain how inhibitory inputs change the number of excitatory inputs a neuron needs, using your design’s numbers.",
    vocab:"Use the words EPSP, IPSP, threshold and spatial summation.",
    more:"There’s more than one answer. Can you find another?",
    after3:"In each answer the net is between +15 and +24 mV, and removing one +10 drops it below +15. That’s a neuron poised right at its threshold."
  },
  cards:[
    ["Synaptic cleft", "The narrow gap between a neuron’s axon terminal and the next cell."],
    ["Ca²⁺ at the terminal", "An arriving action potential opens Ca²⁺ channels; Ca²⁺ entry makes vesicles release transmitter."],
    ["Acetylcholine (ACh)", "The transmitter at the neuromuscular junction (and many other synapses)."],
    ["Acetylcholinesterase", "The enzyme that breaks down ACh in the cleft, ending the signal."],
    ["EPSP", "Excitatory postsynaptic potential: positive ions (Na⁺) enter, moving the membrane toward threshold."],
    ["IPSP", "Inhibitory postsynaptic potential: Cl⁻ enters (e.g. at GABA synapses), moving the membrane away from threshold."],
    ["Spatial summation", "EPSPs and IPSPs from <strong>different</strong> inputs at the same time add up."],
    ["Temporal summation", "Repeated potentials from <strong>one</strong> input, close in time, add up."],
    ["Agonist", "Binds the receptor <strong>and</strong> activates it (e.g. nicotine at an ACh receptor)."],
    ["Antagonist", "Binds the receptor and <strong>blocks</strong> it (e.g. curare)."],
    ["Reuptake inhibitor", "Blocks transporters, so transmitter stays in the cleft longer (e.g. SSRIs)."],
    ["One-way transmission", "Vesicles are only presynaptic; receptors are only postsynaptic."]
  ]
};
