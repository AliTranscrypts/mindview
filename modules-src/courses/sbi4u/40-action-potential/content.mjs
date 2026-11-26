// SBI4U 40 Action Potential. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/40-action-potential.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "Every action potential peaks at about +35 mV. Strength shows up as <strong>more</strong> action potentials per second.";
const M2 = "Depolarization: Na⁺ rushes <strong>in</strong>. Repolarization: K⁺ flows <strong>out</strong>.";
const M3 = "The pump sets up the gradients over time. The action potential is driven by <strong>voltage-gated channels</strong>.";
const M4 = "Below threshold, the depolarization fades and nothing fires.";
const M5 = "Myelin <strong>insulates</strong>. The impulse jumps between the gaps, the nodes of Ranvier.";
const M6 = "The patch just behind the impulse is refractory, so it can’t fire again right away.";
const M7 = "Block Na⁺ channels: no action potential. Block K⁺ channels: an action potential that’s slow to end.";

export default {
  id:"40-action-potential",
  kind:"topic",
  title:"Action potential",
  topic:"Action Potential",
  readyTopic:"the action potential",
  hero:{
    eq:'<span class="ap-heq">rest −70 mV <span aria-hidden="true">→</span> threshold −55 mV <span aria-hidden="true">→</span> peak +35 mV <span aria-hidden="true">→</span> −80 mV <span aria-hidden="true">→</span> rest</span>',
    eqLabel:"rest at minus 70 millivolts, threshold at minus 55, peak at plus 35, a dip to minus 80, then back to rest",
    eqSize:"sm",
    headline:"Two gates, one spike",
    text:"A neuron at rest holds its inside at <strong>−70 mV</strong>. Push it past <strong>threshold</strong> and <strong>voltage-gated Na⁺ channels</strong> fling open: Na⁺ rushes in and the inside turns positive. A moment later <strong>K⁺ channels</strong> open, K⁺ flows out, and the membrane resets. The spike is always the same size: <strong>all or none</strong>.",
    fig:{ html:'<div class="ap-hero" id="ap-hero" role="img" aria-label="Top: a voltage–time trace over about 4 ms. It sits flat at −70 mV, a stimulus nudges it to the −55 mV threshold, it shoots up to +35 mV, falls past −70 to −80 mV, and settles back at −70 mV. Bottom: a strip of axon membrane with a teal Na⁺ channel, a violet K⁺ channel and a pump with an orange ATP badge. Teal Na⁺ dots stream in through the open Na⁺ channel on the way up; the Na⁺ channel then locks (inactivated), the K⁺ channel opens and violet K⁺ dots stream out on the way down; the pump restores the dots at rest."></div>' }
  },
  goals:[
    "I can explain how the Na⁺/K⁺ pump and leak channels create the −70 mV resting potential.",
    "I can describe each phase of an action potential in terms of which channels open or close and which ions move.",
    "I can explain threshold and the all-or-none response.",
    "I can explain the refractory period and how it limits frequency and keeps impulses moving one way.",
    "I can explain how myelin and axon diameter affect conduction speed, and calculate travel time.",
    "I can predict how drugs, toxins or disease that affect channels or myelin change nerve signals."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Neuron structure", goal:5,
          prompt:"Which part of a neuron carries impulses away from the cell body?",
          options:[
            { t:"The axon", ok:true, why:"Axons carry signals away; dendrites bring them in." },
            { t:"The dendrites", why:"Dendrites receive signals." },
            { t:"The myelin sheath", why:"Myelin wraps the axon; it isn’t the pathway itself." },
            { t:"The nucleus", why:"The nucleus holds DNA." }],
          hints:["Think of the long ‘cable’.", "It ends at the axon terminals.", "The axon."] },
        { id:"w2", skill:"Neuron structure", goal:5,
          prompt:"What is the myelin sheath made of?",
          options:[
            { t:"Layers of cell membrane from glial cells wrapped around the axon", ok:true, why:"Schwann cells (in nerves) or oligodendrocytes (in the brain and spinal cord)." },
            { t:"Metal ions that conduct current", why:"Myelin is fatty and insulating." },
            { t:"Protein fibres that pull the axon", why:"That describes muscle." },
            { t:"A layer of bone", why:"Bone protects the spinal cord, but myelin is membrane." }],
          hints:["It’s mostly lipid.", "Glial cells wrap around the axon many times.", "Layers of glial cell membrane."] },
        { id:"w3", skill:"Diffusion and gradients", goal:1,
          prompt:"If a channel for an ion opens, which way does the ion move by diffusion?",
          options:[
            { t:"From higher concentration to lower concentration", ok:true, why:"Down its gradient." },
            { t:"From lower to higher concentration", why:"That needs a pump and energy." },
            { t:"Always into the cell", why:"It depends on which side is higher." },
            { t:"It doesn’t move unless ATP is used", why:"Diffusion through a channel needs no ATP." }],
          hints:["Diffusion goes downhill.", "High to low.", "Down the gradient."] },
        { id:"w4", skill:"Diffusion and gradients", goal:1,
          prompt:"A pump moves ions against their gradient. What does it use?",
          options:[
            { t:"Energy from ATP", ok:true, why:"Active transport." },
            { t:"Nothing; ions move by themselves", why:"Moving against a gradient takes energy." },
            { t:"Water pressure", why:"Pumps in membranes run on ATP." },
            { t:"Light energy", why:"That’s photosynthesis." }],
          hints:["Is it uphill or downhill?", "Uphill needs energy.", "ATP."] },
        { id:"w5", skill:"Ions and charge", goal:2,
          prompt:"If positive ions flow <strong>into</strong> a cell, what happens to the inside’s charge?",
          options:[
            { t:"It becomes less negative (more positive)", ok:true, why:"Adding positive charge raises the voltage." },
            { t:"It becomes more negative", why:"That happens when positive ions leave." },
            { t:"It doesn’t change", why:"Moving charge changes voltage." },
            { t:"It becomes neutral at exactly 0 mV", why:"It can overshoot 0." }],
          hints:["Positive in means…", "…more positive inside.", "Less negative."] },
        { id:"w6", skill:"Ions and charge", goal:2,
          prompt:"Which pair of ions matters most for nerve impulses?",
          options:[
            { t:"Na⁺ and K⁺", ok:true, why:"Sodium and potassium." },
            { t:"Ca²⁺ and Fe²⁺", why:"Ca²⁺ matters at synapses (module 41); iron doesn’t." },
            { t:"H⁺ and OH⁻", why:"Those are acid–base ions." },
            { t:"Na⁺ and Cl⁻ only", why:"Cl⁻ matters for inhibition; K⁺ is essential here." }],
          hints:["Bananas are known for one of them.", "Table salt has the other.", "Na⁺ and K⁺."] }
      ],
      refreshers:{
        "Neuron structure":"Dendrites → cell body → axon → axon terminals. Myelin is insulating membrane wrapped around the axon, with gaps called nodes of Ranvier.",
        "Diffusion and gradients":"Through open channels, ions diffuse down their gradients (no ATP). Pumps use ATP to move ions up their gradients.",
        "Ions and charge":"Positive ions entering make the inside more positive; positive ions leaving make it more negative."
      }
    }
  },
  explore:{
    heading:"Neuron membrane lab",
    intro:"Stimulate the membrane and watch the trace. Open the channel view to see which gates are open at each moment.",
    modelNote:"Model values: rest −70 mV, threshold −55 mV, peak +35 mV. Same settings, same numbers.",
    predIntro:"Make a prediction first. Then the membrane lab will show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Single spike, stimulus 10 mV. You press Play. What will the trace do?",
        options:[
          { t:"Rise to −60 mV and fade, with no spike", ok:true },
          { t:"Spike to +35 mV" },
          { t:"Spike to a smaller peak, about 0 mV" },
          { t:"Drop to −80 mV" }],
        explain:"−60 mV is below the −55 mV threshold, so the Na⁺ gates never fling open.",
        start:{ mode:"single", stim:10, t:0 } },
      { id:"p2", prompt:"Single spike at 15 mV. The stimulus goes up to 30 mV. How does the new spike compare?",
        options:[
          { t:"Same peak, +35 mV", ok:true },
          { t:"Twice as tall" },
          { t:"Slightly taller" },
          { t:"Shorter" }],
        explain:"All or none: once threshold is passed, the channels set the size.",
        start:{ mode:"single", stim:15, t:5 }, to:{ stim:30 } },
      { id:"p3", prompt:"Single spike, 30 mV. Now voltage-gated Na⁺ channels are blocked. What happens?",
        options:[
          { t:"No spike: only a local depolarization", ok:true },
          { t:"A normal spike, because the pump still works" },
          { t:"A bigger spike" },
          { t:"A spike that never ends" }],
        explain:"No Na⁺ rush, no depolarization phase. This is how local anaesthetics stop pain signals.",
        start:{ mode:"single", stim:30, t:5 }, to:{ blockNa:true } },
      { id:"p4", prompt:"Propagation, 1.0 m, unmyelinated thin axon. You switch to a myelinated thick axon. How long does the trip take now?",
        options:[
          { t:"10 ms instead of 1000 ms", ok:true },
          { t:"100 ms" },
          { t:"The same time" },
          { t:"500 ms" }],
        explain:"1.0 m ÷ 100 m/s = 0.01 s. Myelin plus a thick axon is 100 times faster here.",
        start:{ mode:"prop", my:"u", dia:"thin", dist:1 }, to:{ my:"m", dia:"thick" } }
    ],
    challenges:[
      { id:"tc1", goal:3, prompt:"Single spike: find the weakest stimulus that fires an action potential.",
        why:"−70 + 15 = −55 mV: exactly threshold, so the voltage-gated Na⁺ channels fling open and the spike runs.",
        general:"Use Single spike mode with no blockers, and watch whether the trace passes −55 mV.",
        hints:["Threshold is −55 mV.", "How far is −70 from −55?", "15 mV."] },
      { id:"tc2", goal:2, prompt:"Scrub to the first moment the membrane is falling while the Na⁺ channels are still inactivated.",
        why:"At 1.5 ms the membrane has fallen to −20 mV: K⁺ is leaving while the Na⁺ channels are still inactivated.",
        general:"Use Single spike mode with a stimulus that fires and no blockers, then move the time slider.",
        hints:["Find the peak first.", "Just after the peak, K⁺ is leaving.", "1.5 ms."] },
      { id:"tc3", goal:5, stretch:true, prompt:"Propagation: a reflex signal must travel 0.5 m in <strong>at most</strong> 10 ms. Choose the <strong>thinnest</strong> axon that does it.",
        why:"0.5 m ÷ 50 m/s = 10 ms: the thin myelinated axon just makes it.",
        general:"Use Propagation mode with the distance at 0.5 m and healthy myelin.",
        hints:["Travel time = distance ÷ speed.", "10 ms = 0.01 s, so you need at least 0.5 ÷ 0.01 = 50 m/s.", "The thin myelinated axon is exactly 50 m/s."] }
    ]
  },
  part3:{
    slug:"coding", name:"Coding", heading:"How a signal codes strength",
    intro:"Every spike is the same size. So how does a neuron report a firm touch, what limits it, and what happens when myelin or channels fail? Work through the three stations, then try the quick check.",
    s1:{ title:"Station 1: pressure on a fingertip",
      intro:"Model recordings from one touch-sensitive neuron. Check it with data: tap the column where the firing rate stops rising.",
      cols:[
        { id:"none", t:"none", rate:0, peak:"—" },
        { id:"light", t:"light", rate:10, peak:"+35" },
        { id:"medium", t:"medium", rate:40, peak:"+35" },
        { id:"firm", t:"firm", rate:80, peak:"+35" },
        { id:"vfirm", t:"very firm", rate:80, peak:"+35" }],
      answer:["firm", "vfirm"],
      colGood:"From firm to very firm the rate stays at 80 per second, while every spike still peaks at +35 mV. The rate has levelled off.",
      colBad:{ none:"No pressure, no spikes. Look further right, where the numbers stop climbing.", light:"The rate still rises after light (10 → 40). Look further right.", medium:"The rate still rises after medium (40 → 80). Look further right." },
      whyPrompt:"Why does the rate stop rising?",
      options:[
        { t:"The refractory period sets a maximum firing rate; this neuron can’t fire faster.", ok:true, why:"Each spike is followed by a refractory period, so there is a top speed." },
        { t:"The spikes get smaller, so they can’t be counted.", why:M1 },
        { t:"The pressure receptor wears out.", why:"The rate holds steady at 80; it doesn’t drop. Each spike needs time to reset." },
        { t:"The pump runs out of ATP.", why:M3 }] },
    s2:{ title:"Station 2: why one way?",
      steps:[
        "The impulse is at patch 3.",
        "Patch 2, behind it, is in its absolute refractory period.",
        "Patch 4, ahead, is depolarized to threshold and fires."],
      text:"The refractory patch behind the spike can’t fire, so the impulse always moves forward." },
    s3:{ title:"Station 3: when myelin or channels fail",
      intro:"Model data for conduction along a 0.5 m pathway. Choose a condition and send an impulse.",
      conds:[
        { id:"h", t:"Healthy myelinated", ms:10 },
        { id:"p", t:"Partly demyelinated", ms:20 },
        { id:"s", t:"Severely demyelinated", ms:null }],
      // VERIFY: plan marks the MS statistic "verify before release" (Canada has one of the highest rates of MS in the world).
      ms:"In multiple sclerosis, the immune system damages myelin in the brain and spinal cord, slowing or blocking signals. Canada has one of the highest rates of MS in the world.",
      blockers:"<strong>Channel blockers (mechanism only).</strong> A local anaesthetic blocks voltage-gated Na⁺ channels in pain-sensing neurons, so they can’t fire. Tetrodotoxin, from pufferfish, blocks the same channels throughout the body, which is why it is so dangerous." },
    quickCheck:{
      title:"Quick check", summary:"How a signal codes strength quick check",
      items:[
        { id:"q1", goal:3, prompt:"A firmer touch gives…",
          choices:[{ t:"more action potentials per second", ok:true, fb:"Spike size is fixed; frequency rises." },
            { t:"taller action potentials", fb:"Spike size is fixed; frequency rises." },
            { t:"slower action potentials", fb:"Spike size is fixed; frequency rises." },
            { t:"longer action potentials", fb:"Spike size is fixed; frequency rises." }] },
        { id:"q2", goal:4, prompt:"Why does the firing rate level off?",
          choices:[{ t:"The refractory period sets a maximum rate", ok:true, fb:"Each spike needs time to reset." },
            { t:"The neuron runs out of Na⁺", fb:"Each spike needs time to reset." },
            { t:"Spikes get smaller", fb:"Each spike needs time to reset." },
            { t:"The pump stops", fb:"Each spike needs time to reset." }] },
        { id:"q3", goal:4, prompt:"Why can’t the impulse turn back?",
          choices:[{ t:"The patch behind it is refractory", ok:true, fb:M6 },
            { t:"Myelin blocks backward flow", fb:M6 },
            { t:"Na⁺ only moves forward", fb:M6 },
            { t:"The axon is one-way tubing", fb:M6 }] },
        { id:"q4", goal:6, prompt:"Why does demyelination slow signals?",
          choices:[{ t:"The impulse can no longer jump between nodes", ok:true, fb:"Myelin insulates; without it, conduction is slow and can fail." },
            { t:"Myelin makes the electricity", fb:"Myelin insulates; without it, conduction is slow and can fail." },
            { t:"Axons shrink", fb:"Myelin insulates; without it, conduction is slow and can fail." },
            { t:"Na⁺ channels multiply", fb:"Myelin insulates; without it, conduction is slow and can fail." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"trace", type:"custom", title:"Label the trace", summary:"Label the trace", goal:[2, 3, 4], how:"",
        instruction:"Tap the point or stretch of the trace that each prompt asks for. Keyboard: Tab to the graph, move along the trace with the arrow keys, then press Enter.",
        items:[
          { id:"l1", goal:2, prompt:"Tap the resting potential.", answer:[-1, -0.1], name:"rest",
            done:"The flat line at −70 mV before the stimulus." },
          { id:"l2", goal:3, prompt:"Tap the threshold.", answer:[0.4, 0.6], name:"threshold",
            done:"At −55 mV the steep rise begins." },
          { id:"l3", goal:2, prompt:"Tap where Na⁺ rushes in fastest.", answer:[0.6, 0.9], name:"Na⁺ in",
            done:"The steep rising stretch, −55 to +35 mV.",
            wrong:[{ range:[1.1, 2.0], fb:"Falling means K⁺ is leaving. Na⁺ rushes in on the way up." }] },
          { id:"l4", goal:2, prompt:"Tap the peak.", answer:[0.9, 1.1], name:"peak",
            done:"+35 mV." },
          { id:"l5", goal:2, prompt:"Tap where K⁺ is flowing out and the voltage is falling.", answer:[1.1, 2.0], name:"K⁺ out",
            done:"The falling stretch, +35 down to −70 mV." },
          { id:"l6", goal:2, prompt:"Tap the hyperpolarization.", answer:[2.1, 3.9], name:"hyperpolarization",
            done:"The dip below −70 mV, down to −80 mV." },
          { id:"l7", goal:4, prompt:"Tap a moment in the absolute refractory period.", answer:[1.0, 1.5], name:"absolute",
            done:"1.0–1.5 ms: the Na⁺ channels are inactivated, so nothing can fire.",
            wrong:[{ range:[2.0, 3.0], fb:"Na⁺ channels have reset by then; that’s the relative period." }] },
          { id:"l8", goal:4, prompt:"Tap a moment when a stronger-than-usual stimulus could start a new spike.", answer:[2.0, 3.0], name:"relative",
            done:"The relative refractory period, 2.0–3.0 ms.",
            hints:["When have the Na⁺ channels reset but the membrane isn’t back to normal?", "During the undershoot.", "2.0–3.0 ms."] }
        ],
        wrongDefault:"Read the voltage at the point you tapped and compare it with the prompt." },
      { id:"whatif", type:"custom", title:"What if…?", summary:"What if…?", star:true, goal:[1, 6], how:"",
        instruction:"Predict what each change does to the neuron. Items marked ★ are non-routine.",
        items:[
          { id:"wi1", goal:6, prompt:"Voltage-gated K⁺ channels are blocked. What happens?",
            options:[
              { t:"Longer spike that’s slow to end", ok:true, why:M7 },
              { t:"No spike", why:"“No spike” is what a Na⁺ blocker does." },
              { t:"Bigger spike", why:M7 },
              { t:"No change", why:M7 }] },
          { id:"wi2", goal:6, prompt:"A second stimulus arrives at 1.0 ms. What happens?",
            options:[
              { t:"No new spike", ok:true, why:"At 1.0 ms the Na⁺ channels are inactivated: the absolute refractory period." },
              { t:"A second spike", why:"At 1.0 ms the Na⁺ channels are inactivated: the absolute refractory period." },
              { t:"A double-height spike", why:"At 1.0 ms the Na⁺ channels are inactivated: the absolute refractory period." },
              { t:"A smaller spike", why:"At 1.0 ms the Na⁺ channels are inactivated: the absolute refractory period." }] },
          { id:"wi3", goal:6, star:true, prompt:"A strong second stimulus arrives at 2.5 ms. What happens?",
            options:[
              { t:"A spike is possible", ok:true, why:"2.5 ms is the relative refractory period: a strong enough stimulus can fire." },
              { t:"Impossible: absolute refractory", why:"2.5 ms is the relative refractory period: a strong enough stimulus can fire." },
              { t:"Bigger spike", why:"2.5 ms is the relative refractory period: a strong enough stimulus can fire." },
              { t:"Spike in reverse", why:"2.5 ms is the relative refractory period: a strong enough stimulus can fire." }] },
          { id:"wi4", goal:1, star:true, prompt:"The Na⁺/K⁺ pump is stopped by a poison. What happens?",
            options:[
              { t:"Spikes continue at first, then fade as the gradients run down", ok:true, why:"Each spike moves only a tiny fraction of the ions. The pump maintains the gradients over time." },
              { t:"Spikes stop instantly", why:"Each spike moves only a tiny fraction of the ions. The pump maintains the gradients over time." },
              { t:"Spikes get bigger", why:"Each spike moves only a tiny fraction of the ions. The pump maintains the gradients over time." },
              { t:"No effect ever", why:"Each spike moves only a tiny fraction of the ions. The pump maintains the gradients over time." }] },
          { id:"wi5", goal:1, star:true, prompt:"The K⁺ concentration <strong>outside</strong> the neuron rises. What happens?",
            options:[
              { t:"Resting potential becomes less negative", ok:true, why:"With less K⁺ difference across the membrane, less K⁺ leaks out, so the inside stays less negative." },
              { t:"More negative", why:"With less K⁺ difference across the membrane, less K⁺ leaks out, so the inside stays less negative." },
              { t:"No change", why:"With less K⁺ difference across the membrane, less K⁺ leaks out, so the inside stays less negative." },
              { t:"Spikes get taller", why:"With less K⁺ difference across the membrane, less K⁺ leaks out, so the inside stays less negative." }],
            hints:["Why does K⁺ leak out at rest?", "Its concentration is much higher inside.", "Shrink the difference and less K⁺ leaves: the inside is less negative."] },
          { id:"wi6", goal:6, star:true, prompt:"The Na⁺ concentration <strong>outside</strong> falls. What happens?",
            options:[
              { t:"Spike peak is lower", ok:true, why:"A smaller Na⁺ gradient means less Na⁺ rushes in, so the peak is lower." },
              { t:"Spike peak is higher", why:"A smaller Na⁺ gradient means less Na⁺ rushes in, so the peak is lower." },
              { t:"Resting potential becomes +35", why:"A smaller Na⁺ gradient means less Na⁺ rushes in, so the peak is lower." },
              { t:"No change", why:"A smaller Na⁺ gradient means less Na⁺ rushes in, so the peak is lower." }] }
        ],
        // Investigation follow-up (plan: shown with W4; not counted in the x/6 line)
        followUp:{ after:"wi4", id:"wi4x", title:"Investigation follow-up",
          prompt:"To test whether a poison stops the pump, which measurement over 30 minutes would you make?",
          options:[
            { t:"Resting potential, which should drift toward 0 mV", ok:true, why:"As the gradients run down, less K⁺ is left to leak out, so the resting potential creeps toward 0 mV." },
            { t:"Peak of one spike right away", why:"One spike right away will look normal: the gradients run down slowly." },
            { t:"Axon length", why:"The poison doesn’t change the axon’s length." },
            { t:"Room temperature", why:"Room temperature is a variable to control, not the evidence." }] } },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Amir", how:"",
        instruction:"Amir made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Describe the ion movements in an action potential.",
            steps:["At rest, the inside is about −70 mV.", "A stimulus brings the membrane to threshold, about −55 mV.", "Voltage-gated Na⁺ channels open and Na⁺ flows out.", "The inside becomes positive, about +35 mV.", "K⁺ channels open and K⁺ flows out, restoring a negative inside."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 is the right result, but it can’t follow from step 3.", "Step 5 is correct."],
            fixes:[
              { t:"Voltage-gated Na⁺ channels open and Na⁺ rushes <strong>in</strong>, down its gradient.", ok:true, why:M2 },
              { t:"Voltage-gated K⁺ channels open and K⁺ rushes in.", why:"K⁺ leaves; it doesn’t enter." },
              { t:"The pump moves Na⁺ in.", why:"The pump moves Na⁺ out." },
              { t:"Step 3 is correct.", why:"Positive ions leaving would make the inside more negative." }],
            hints:["Where is Na⁺ more concentrated?", "Outside.", "So it rushes in."] },
          { id:"e2", goal:1, task:"Explain the resting potential.",
            steps:["The Na⁺/K⁺ pump moves 3 Na⁺ out and 2 K⁺ in for each ATP.", "So Na⁺ is high outside and K⁺ is high inside.", "Na⁺ leak channels are the most numerous, so Na⁺ leaks in and makes the inside negative.", "The resting potential is about −70 mV."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 is correct."],
            fixes:[
              { t:"K⁺ leak channels are the most numerous, so K⁺ leaks out, leaving the inside negative.", ok:true, why:"K⁺ out leaves negative charge behind." },
              { t:"Cl⁻ is pumped in by ATP.", why:"The pump in this model moves Na⁺ and K⁺." },
              { t:"The inside is negative because the cell has no ions.", why:"There are plenty of ions inside." },
              { t:"Step 3 is correct.", why:"Positive Na⁺ leaking in would make the inside less negative." }],
            hints:["Which ion leaks most at rest?", "K⁺, through leak channels.", "K⁺ out leaves negative charge behind."] },
          { id:"e3", goal:5, task:"Explain why myelinated axons are faster.",
            steps:["Myelin is made of glial cell membranes wrapped around the axon.", "Myelin conducts the impulse like a copper wire.", "The impulse jumps from node to node.", "So myelinated axons conduct much faster."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 is correct, but it doesn’t fit step 2.", "Step 4 is correct."],
            fixes:[
              { t:"Myelin insulates the axon, so action potentials only happen at the gaps (nodes of Ranvier).", ok:true, why:M5 },
              { t:"Myelin pumps Na⁺ into the axon.", why:"Myelin has no pumps." },
              { t:"Myelin makes each spike bigger.", why:M1 },
              { t:"Step 2 is correct.", why:"Myelin is an insulator, not a conductor." }],
            hints:["Is fat a conductor or an insulator?", "An insulator.", "It forces the spikes to the nodes."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most: that every spike is the same size, or how much faster myelinated axons are?" },
      { id:"j2", q:"In your own words, why does a neuron need both Na⁺ channels and K⁺ channels to make one action potential?" },
      { id:"j3", q:"Explain to a friend how your brain can tell a light touch from a firm one if every spike is identical." },
      { id:"j4", q:"Which phase or channel state do you still mix up? What will you do about it?" }
    ]
  },
  final:{
    intro:"Model values: rest −70 mV, threshold −55 mV, peak +35 mV.",
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What mainly keeps the resting potential at about −70 mV?", options:[
          { t:"K⁺ leaking out through leak channels, with the Na⁺/K⁺ pump maintaining the gradients", ok:true, why:"K⁺ drifting out leaves the inside negative, and the pump keeps the gradients in place." },
          { t:"Na⁺ leaking in through leak channels", why:"That would make the inside less negative." },
          { t:"Voltage-gated Na⁺ channels staying open", why:"They’re closed at rest." },
          { t:"The pump firing action potentials", why:M3 }] },
        b:{ prompt:"Which ion rushes into the axon during depolarization?", options:[
          { t:"Na⁺", ok:true, why:"Na⁺ is high outside, so it rushes in when the voltage-gated Na⁺ channels open." },
          { t:"K⁺", why:"K⁺ leaves, during repolarization." },
          { t:"Cl⁻", why:"Cl⁻ entering would make the inside more negative." },
          { t:"Ca²⁺", why:"Ca²⁺ matters at the axon terminal (module 41)." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What happens during repolarization?", options:[
          { t:"Voltage-gated K⁺ channels open and K⁺ flows out", ok:true, why:"K⁺ leaving brings the inside back down." },
          { t:"Na⁺ channels open and Na⁺ flows in", why:"That’s depolarization." },
          { t:"K⁺ flows in", why:M2 },
          { t:"The pump moves 3 K⁺ out", why:"The pump moves K⁺ in." }] },
        b:{ prompt:"Why does the membrane briefly drop below −70 mV after a spike?", options:[
          { t:"K⁺ channels close slowly, so extra K⁺ leaves", ok:true, why:"The extra K⁺ exit overshoots rest: hyperpolarization." },
          { t:"Na⁺ keeps rushing in", why:"That would raise the voltage." },
          { t:"The pump stops", why:"The pump keeps running." },
          { t:"Cl⁻ is pumped out", why:"Not part of this model." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"What are the nodes of Ranvier, and why do they matter?", options:[
          { t:"Gaps in the myelin where action potentials occur, so the impulse jumps from node to node", ok:true, why:"That jumping (saltatory conduction) makes myelinated axons fast." },
          { t:"Points where myelin conducts the current", why:M5 },
          { t:"The axon terminals that release neurotransmitter", why:"Those are at the end of the axon." },
          { t:"Places where the axon has no Na⁺ channels", why:"Nodes are packed with Na⁺ channels." }] },
        b:{ prompt:"What is the absolute refractory period?", options:[
          { t:"A brief time when no new action potential can start, because the Na⁺ channels are inactivated", ok:true, why:"Inactivated Na⁺ channels can’t open, whatever the stimulus." },
          { t:"A time when a weaker stimulus than usual can fire", why:"The opposite: no stimulus can." },
          { t:"The resting state before a stimulus", why:"Rest isn’t refractory." },
          { t:"The time the pump takes to fill the cell with Na⁺", why:"The pump moves Na⁺ out." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"A stimulus brings the membrane from −70 mV to −60 mV. What happens?", options:[
          { t:"A small local depolarization that fades; no action potential", ok:true, why:M4 },
          { t:"A full spike to +35 mV", why:"−60 is below threshold." },
          { t:"A half-size spike", why:"All or none: no partial spikes." },
          { t:"The neuron is permanently depolarized", why:"It returns to rest." }] },
        b:{ prompt:"Stimulus X depolarizes by 20 mV and stimulus Y by 30 mV. How do their spikes compare?", options:[
          { t:"Both peak at about +35 mV", ok:true, why:"Both pass threshold, and the channels set the size." },
          { t:"Y’s spike is 1.5 times taller", why:M1 },
          { t:"Only Y fires", why:"−70 + 20 = −50 is past threshold too." },
          { t:"X’s spike is taller because it’s quicker", why:"Spike height is fixed." }] } },
      { id:"t2", cat:"T", goal:6,
        a:{ prompt:"A drug blocks voltage-gated Na⁺ channels. A strong stimulus is applied. What is recorded?", options:[
          { t:"A local depolarization that fades, with no action potential", ok:true, why:"No Na⁺ rush, no upstroke." },
          { t:"A normal action potential", why:"Without Na⁺ rushing in, there’s no upstroke." },
          { t:"An action potential that doesn’t repolarize", why:"That’s a K⁺ blocker." },
          { t:"A spike to +70 mV", why:"There’s no spike at all." }] },
        b:{ prompt:"A drug blocks voltage-gated K⁺ channels. A stimulus above threshold is applied. What is recorded?", options:[
          { t:"A normal upstroke to the peak, then a slow, prolonged return", ok:true, why:M7 },
          { t:"No action potential", why:"The Na⁺ channels still work." },
          { t:"A taller peak", why:"The peak is set by Na⁺ entry." },
          { t:"A faster return to rest", why:"The K⁺ exit is what speeds the return." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"The K⁺ concentration in the fluid outside the neurons rises. What happens to the resting potential, and why?", options:[
          { t:"It becomes less negative, because a smaller K⁺ difference means less K⁺ leaks out", ok:true, why:"Less K⁺ leaves, so less negative charge is left behind." },
          { t:"It becomes more negative, because more K⁺ is outside", why:"Less leaves; the inside is less negative." },
          { t:"No change, because the pump fixes it at once", why:"The leak depends on the gradient." },
          { t:"It becomes +35 mV", why:"That’s the spike peak, not rest." }] },
        b:{ prompt:"The Na⁺ concentration outside a neuron falls. What happens to the spike’s peak, and why?", options:[
          { t:"It is lower, because less Na⁺ rushes in", ok:true, why:"A smaller Na⁺ gradient drives less Na⁺ in." },
          { t:"It is higher, because Na⁺ leaves faster", why:"Na⁺ enters during the upstroke." },
          { t:"No change; spikes are all-or-none", why:"All-or-none means fixed for given conditions; changing the gradient changes the peak." },
          { t:"There is no spike, ever", why:"A smaller gradient still allows a spike." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of ‘all-or-none’?", options:[
          { t:"“Once threshold is reached, voltage-gated Na⁺ channels open fully and the spike always reaches the same peak; below threshold, there is no spike.”", ok:true, why:"Threshold decides <em>whether</em> it fires; the channels decide the size." },
          { t:"“Stronger stimuli give bigger spikes, up to a maximum.”", why:M1 },
          { t:"“A neuron either fires all its axons or none of them.”", why:"It’s about the size of each spike." },
          { t:"“All the ions leave the cell, or none do.”", why:"Only a tiny fraction of ions move." }] },
        b:{ prompt:"Which is the best explanation of why an impulse travels in only one direction along an axon?", options:[
          { t:"“The patch just behind the impulse is in its refractory period, so only the patch ahead can be triggered.”", ok:true, why:"The refractory patch behind can’t fire, so the impulse moves forward." },
          { t:"“Myelin blocks backward flow.”", why:M6 },
          { t:"“Na⁺ can only move toward the axon terminal.”", why:"Na⁺ moves across the membrane, not along it." },
          { t:"“The axon is narrower at one end.”", why:"Diameter affects speed, not direction." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which sequence is correct?", options:[
          { t:"Threshold → Na⁺ channels open → Na⁺ in → Na⁺ channels inactivate, K⁺ channels open → K⁺ out → undershoot → rest", ok:true, why:"Na⁺ in on the way up, K⁺ out on the way down, a brief undershoot, then rest." },
          { t:"Threshold → K⁺ channels open → K⁺ in → Na⁺ out → rest", why:M2 },
          { t:"Pump starts → Na⁺ in → K⁺ in → threshold", why:M3 },
          { t:"Na⁺ in → threshold → K⁺ in → peak", why:"Threshold comes first; K⁺ leaves." }] },
        b:{ prompt:"Which sentence uses the terms correctly?", options:[
          { t:"“Depolarization is caused by Na⁺ entering; repolarization by K⁺ leaving; hyperpolarization is the dip below the resting potential.”", ok:true, why:"Each term matches its ion movement." },
          { t:"“Depolarization is caused by K⁺ leaving; repolarization by Na⁺ entering.”", why:M2 },
          { t:"“Hyperpolarization is the peak at +35 mV.”", why:"That’s the overshoot of the spike, not hyperpolarization." },
          { t:"“Repolarization is when the pump makes the spike.”", why:M3 }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A signal travels 0.8 m along a myelinated axon at 80 m/s. How long does it take?", options:[
          { t:"10 ms", ok:true, why:"0.8 ÷ 80 = 0.01 s." },
          { t:"100 ms", why:"0.8 ÷ 80 = 0.01 s, which is 10 ms." },
          { t:"64 ms", why:"Divide distance by speed; don’t multiply." },
          { t:"1 ms", why:"0.01 s is 10 ms." }] },
        b:{ prompt:"The same 0.8 m pathway on an unmyelinated axon conducts at 2 m/s. How long does it take?", options:[
          { t:"400 ms", ok:true, why:"0.8 ÷ 2 = 0.4 s." },
          { t:"40 ms", why:"0.4 s = 400 ms." },
          { t:"1.6 ms", why:"Divide, don’t multiply." },
          { t:"4 ms", why:"0.4 s = 400 ms." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A dentist injects a local anaesthetic near a tooth. Why does the area go numb?", options:[
          { t:"It blocks Na⁺ channels in the sensory neurons there, so they can’t fire action potentials to the brain", ok:true, why:"No Na⁺ rush, no action potential, no pain signal." },
          { t:"It destroys the pain receptors permanently", why:"The effect wears off as the drug is cleared." },
          { t:"It makes action potentials bigger, so the brain ignores them", why:M1 },
          { t:"It blocks K⁺ channels so the neurons never reset", why:M7 }] },
        b:{ prompt:"In multiple sclerosis, why can movement or vision be affected?", options:[
          { t:"Damaged myelin slows or blocks impulses in the brain and spinal cord", ok:true, why:"Without insulation, the impulse can’t jump node to node, so it slows or fails." },
          { t:"The neurons make spikes that are too large", why:M1 },
          { t:"The Na⁺/K⁺ pump stops working in every cell", why:"MS targets myelin." },
          { t:"Myelin grows too thick and conducts too much current", why:M5 }] } }
    ]
  },
  task:{
    title:"Design a fast, thin pathway", summary:"Design a fast, thin pathway",
    statement:"<p>Choose an axon, a pathway and a stimulus so the signal meets every condition. Can you find all the answers?</p><ol class=\"ap-conds\"><li>The stimulus reaches threshold.</li><li>The signal reports a strong stimulus: at least 3 action potentials in 20 ms.</li><li>The first action potential arrives within 10 ms.</li><li>The axon is thin (to save space in a crowded nerve).</li></ol>",
    stims:[10, 15, 20, 25, 30],
    paths:{ arm:0.5, leg:1.0 },
    checks:["Reaches threshold", "Strong signal", "Arrives within 10 ms", "Thin axon"],
    tips:["Rest is −70 mV and threshold −55 mV.", "Stronger stimuli give more spikes, not bigger ones.", "Time = distance ÷ speed. Which axon types are fast enough?", "A thin axon needs help to go fast. What could provide it?"],
    explainPrompt:"Explain how your design shows that the stimulus is strong, and why your axon is fast enough.",
    vocab:"Use the words threshold, frequency, myelin and saltatory conduction.",
    more:"Can you find all the answers?",
    after3:"The leg pathway would take 1.0 ÷ 50 = 20 ms on a thin myelinated axon. Long, fast pathways need thick myelinated axons."
  },
  cards:[
    ["Resting potential", "About −70 mV inside; set up by the Na⁺/K⁺ pump and K⁺ leak channels."],
    ["Na⁺/K⁺ pump", "Uses ATP to move 3 Na⁺ out and 2 K⁺ in."],
    ["Threshold", "About −55 mV; past it, voltage-gated Na⁺ channels open."],
    ["Depolarization", "Na⁺ rushes in; the inside rises to about +35 mV."],
    ["Repolarization", "Na⁺ channels inactivate; K⁺ channels open and K⁺ flows out."],
    ["Hyperpolarization", "A brief dip to about −80 mV as K⁺ channels close slowly."],
    ["All-or-none", "Every action potential has the same size once threshold is reached."],
    ["Absolute refractory period", "No new spike possible (Na⁺ channels inactivated)."],
    ["Relative refractory period", "A stronger-than-usual stimulus can fire a new spike."],
    ["Frequency coding", "Stronger stimulus → more spikes per second, not bigger spikes."],
    ["Saltatory conduction", "Spikes jump between nodes of Ranvier on myelinated axons: much faster."],
    ["Na⁺ channel blockers", "Local anaesthetics (and tetrodotoxin) stop action potentials."]
  ]
};
