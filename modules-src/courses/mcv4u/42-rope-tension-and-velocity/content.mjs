// MCV4U 42 Rope Tension and Velocity. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/42-rope-tension-and-velocity.md
// Units stay outside backticks (m() would italicise m and s). Misconception core sentences (plan §3) are reused where the plan
// tags an option or wrong answer with M1–M8.
const M1 = "Each rope’s <strong>vertical component</strong> is half the weight (if symmetric), not its whole tension. The tension is bigger: `T = W/(2 sin θ)`.";
const M2 = "Horizontal parts cancel: `T_1 cos α = T_2 cos β`. The steeper rope has the smaller cosine, so it needs the bigger tension.";
const M3 = "The vertical part is opposite the angle measured from the horizontal: `T sin θ`.";
const M4 = "Winds are named for where they come <strong>from</strong>. A west wind blows toward the east.";
const M5 = "The wind or current pushes it sideways: track = air (or water) velocity + wind (or current).";
const M6 = "Speeds add as numbers only when the velocities point the same way. Otherwise add them as vectors.";
const M7 = "To land opposite, aim upstream so the upstream part cancels the current. That makes the crossing slower, not faster.";
const M8 = "Only the across component carries the boat across: time = width ÷ across speed.";
const COND = '<div class="refresh" style="margin:0 0 12px"><h4>The conditions</h4><ol style="margin:0;padding-left:1.3em">' +
  "<li>The ferry lands directly opposite its dock.</li><li>The crossing takes at most 15 s.</li><li>The plan works in a current of at least 2 m/s.</li></ol></div>";

export default {
  id:"42-rope-tension-and-velocity",
  kind:"topic",
  title:"Rope tension and velocity",
  topic:"Rope Tension and Velocity",
  readyTopic:"rope tension and velocity problems",
  hero:{
    eq:'<span class="rtv-heq"><span class="rtv-nw"><span class="rtv-cp">`vec{T}_1`</span> + <span class="rtv-cf">`vec{T}_2`</span> + `vec{W} = vec{0}`</span>' +
      '<span class="rtv-sep" aria-hidden="true">·</span><span class="rtv-nw">`vec{v}`<sub>ground</sub> = <span class="rtv-cp">`vec{v}`<sub>air</sub></span> + <span class="rtv-cf">`vec{v}`<sub>wind</sub></span></span></span>',
    eqLabel:"T1 vector plus T2 vector plus W vector equals the zero vector; v ground equals v air plus v wind",
    eqSize:"sm",
    headline:"Ropes and winds both add tip to tail",
    text:"When a weight hangs from two ropes, the <strong>tensions</strong> and the weight must add to zero. When a plane flies through moving air, its <strong>air velocity</strong> and the <strong>wind</strong> add to give its <strong>ground velocity</strong>. Same vector addition, two very different stories: and in both, the angles change everything.",
    fig:{ html:'<div class="rtv-hero" id="rtv-hero"></div>', caption:"" }
  },
  goals:[
    "I can find the tensions in two ropes holding a weight, using components or a triangle of forces.",
    "I can explain why tension grows as ropes flatten, and predict which rope carries more tension.",
    "I can add velocities: velocity through the air or water plus the wind or current gives the ground velocity.",
    "I can tell heading from track and “wind from” from “wind toward”, using bearings.",
    "I can choose a heading that gives a required track (such as straight across a river) and find the ground speed and time.",
    "I can solve multi-step tension and navigation problems and interpret the answers."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Equilibrium", goal:1, prompt:"Tensions `vec{T}_1` and `vec{T}_2` and a weight `vec{W}` hold a ring still. Which equation must be true?",
          options:[
            { t:"`vec{T}_1 + vec{T}_2 + vec{W} = vec{0}`", ok:true, why:"All the forces together cancel." },
            { t:"`vec{T}_1 + vec{T}_2 = vec{0}`", why:"That forgets the weight. Then nothing holds the weight up." },
            { t:"`|vec{T}_1| + |vec{T}_2| = |vec{W}|`", why:"That adds magnitudes. Magnitudes add only for forces in one line." },
            { t:"`vec{T}_1 = vec{T}_2 = vec{W}`", why:"Equal vectors would all point the same way and couldn’t cancel." }],
          hints:["What does equilibrium mean for the net force?", "The vector sum is `vec{0}`.", "Include every force: `vec{T}_1 + vec{T}_2 + vec{W} = vec{0}`."] },
        { id:"w2", skill:"Equilibrium", goal:1, prompt:"Forces of 10 N at 0° and 10 N at 90° act on a ring. What is the equilibrant?",
          options:[
            { t:"`10√2` N at 225°", ok:true, why:"The resultant is `10√2` N at 45°; reverse it." },
            { t:"`10√2` N at 45°", why:"That’s the resultant. The equilibrant points the opposite way." },
            { t:"20 N at 225°", why:"That adds magnitudes. At right angles, use `√{100 + 100}`." },
            { t:"10 N at 225°", why:"A 10 N force can’t cancel a `10√2` N resultant." }],
          hints:["Find the resultant first.", "(10, 10): `10√2` N at 45°.", "Reverse: 225°."] },
        { id:"w3", skill:"Components", goal:1, prompt:"A rope pulls with 40 N at 30° above the horizontal. What is its vertical component?",
          options:[
            { t:"20 N", ok:true, why:"`40 sin 30° = 20`." },
            { t:"`20√3` N", why:"That uses cosine: that’s the horizontal part." },
            { t:"40 N", why:"Only part of the pull is upward." },
            { t:"80 N", why:"That divides by `sin 30°`. Dividing makes the part bigger than the whole." }],
          hints:["Vertical is opposite the 30° angle.", "Use sine.", "40 × 1/2 = 20 N."] },
        { id:"w4", skill:"Components", goal:2, prompt:"A rope with tension `T` makes 45° with the horizontal. What is its vertical component?",
          options:[
            { t:"`(√2/2)T`", ok:true, why:"`T sin 45°`." },
            { t:"`T/2`", why:"That uses `sin 30°`. `sin 45° = √2/2`." },
            { t:"`T`", why:"The rope isn’t vertical." },
            { t:"`√2 T`", why:"That divides by `sin 45°`. A component can’t exceed the tension." }],
          hints:["Use sine for the part opposite the angle.", "`sin 45° = √2/2`.", "`(√2/2)T`."] },
        { id:"w5", skill:"Bearings", goal:4, prompt:"A true bearing of 240° is the same direction as:",
          options:[
            { t:"S 60° W", ok:true, why:"240° is 60° past south (180°), toward west." },
            { t:"S 30° W", why:"That measures from west. S 30° W is 210°." },
            { t:"N 60° W", why:"That’s 300°." },
            { t:"S 60° E", why:"That’s 120°." }],
          hints:["Bearings go clockwise from north.", "180° is south.", "240° − 180° = 60° toward west: S 60° W."] },
        { id:"w6", skill:"Bearings", goal:4, prompt:"A north wind (blowing from the north) pushes a balloon toward the:",
          options:[
            { t:"South", ok:true, why:"Winds are named for where they come from." },
            { t:"North", why:"A north wind comes <em>from</em> the north." },
            { t:"East", why:"That’s a quarter turn off." },
            { t:"West", why:"That’s a quarter turn the other way." }],
          hints:["Is the wind named for where it starts or where it goes?", "Where it starts.", "From the north, so toward the south."] }
      ],
      refreshers:{
        "Equilibrium":"Balanced forces add to `vec{0}`: the `x`-components cancel and the `y`-components cancel.",
        "Components":"A force `F` at angle `θ` above the horizontal has horizontal part `F cos θ` and vertical part `F sin θ`.",
        "Bearings":"True bearings are three digits clockwise from north (090° is east). A wind “from 270°” blows toward 090°."
      }
    }
  },
  explore:{
    heading:"Hanging mass and river crossing",
    intro:"Three scenes, one idea: vectors add tip to tail. Hang a weight from two ropes, then steer a boat and a plane through moving water and air.",
    ui:{
      modes:[{ id:"tension", t:"Tension" }, { id:"river", t:"River" }, { id:"air", t:"Air" }],
      modeLab:"Scene",
      views:[{ id:"ropes", t:"Ropes" }, { id:"tri", t:"Triangle of forces" }], viewLab:"View",
      sym:"Symmetric", go:"Go", reset:"Back to the start",
      lab:{ W:"Weight `W`", a:"Left rope angle `α`", b:"Right rope angle `β`",
        rw:"River width", rc:"Current `c` (flowing east)", rb:"Boat speed through the water `b`", rp:"Heading `φ` from straight across",
        as:"Airspeed", ah:"Heading (true bearing)", ws:"Wind speed", wf:"Wind “from” bearing" },
      how:{
        tension:"Drag the sliders (arrow keys move one step). Symmetric locks the right rope to the left rope’s angle.",
        river:"Set the river and the boat, then press Go to watch the crossing. Positive headings aim upstream (left, against the current).",
        air:"Set the plane and the wind. The heading line is dashed; the track the plane really flies is solid."
      },
      rows:{ t1:"Left rope `T_1`", t2:"Right rope `T_2`", check:"Check", between:"Angle between ropes",
        gv:"Ground velocity", time:"Crossing time", land:"Landing point", agv:"Ground velocity", drift:"Drift" },
      strain:"Rope near its limit (2`W`)",
      hidden:"Hidden for challenge 3: press <strong>Check challenge</strong> to see the track."
    },
    predIntro:"Make a prediction first. Then the scene and its readout show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Tension mode, symmetric, `W` = 100 N, `α = β = 60°`. As the ropes flatten from 60° to 30°, the tension in each rope…",
        options:[{ t:"rises, from about 58 N to 100 N", ok:true }, { t:"falls" }, { t:"stays at 50 N" }, { t:"rises to 200 N" }],
        explain:"`2T sin θ = 100`. At 60°, `T = 100/√3` ≈ 58 N; at 30°, `T` = 100 N. A rope always holds more than half the weight, because only its vertical part lifts. " + M1 },
      { id:"p2", prompt:"Tension mode, `W` = 100 N, `α` = 30° (left), `β` = 60° (right). Which rope carries more tension?",
        options:[{ t:"The steeper rope (60°)", ok:true }, { t:"The flatter rope (30°)" }, { t:"They’re equal" }, { t:"Each carries exactly 50 N" }],
        explain:"The horizontal parts must cancel: `T_1 cos 30° = T_2 cos 60°`, so `T_2 = √3 T_1`. The steeper rope also does more of the lifting: left 50 N, right `50√3` ≈ 87 N. " + M2 },
      { id:"p3", prompt:"River mode: width 80 m, current 3 m/s, boat 4 m/s, heading straight across (`φ = 0°`). How long does the crossing take?",
        options:[{ t:"20 s", ok:true }, { t:"16 s" }, { t:"about 11 s" }, { t:"40 s" }],
        explain:"Only the 4 m/s across part carries the boat to the far bank: 80 ÷ 4 = 20 s. Dividing by the ground speed (5 m/s) gives 16 s, but the boat travels 100 m, not 80 m. It lands 60 m downstream. " + M8 },
      { id:"p4", prompt:"Air mode: heading 000° at 300 km/h; wind from 270° at 100 km/h. Which way does the plane’s track lean?",
        options:[{ t:"East of north", ok:true }, { t:"West of north" }, { t:"Straight north" }, { t:"South of east" }],
        explain:"A wind from the west (270°) blows toward the east, pushing the plane east: the ground velocity (100, 300) leans right of the heading. " + M5 }
    ],
    chalIntro:"Use the scenes to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 2], prompt:"Tension mode, `W` = 120 N, symmetric. Set the rope angle so each tension is exactly 120 N.",
        why:"`2(120) sin 30° = 120`: at 30° each rope pulls with the whole weight, 120 N.",
        hints:["`2T sin θ = W`.", "`2(120) sin θ = 120`, so `sin θ = 1/2`.", "`θ = 30°`."],
        msgs:{ mode:"Switch to the <strong>Tension</strong> scene first.", w:"Set the weight to 120 N first.", sym:"Turn on <strong>Symmetric</strong> so both ropes share one angle.",
          a60:"`40√3` ≈ 69 N: steeper ropes need less tension.", a45:"`60√2` ≈ 85 N. Flatten further.", a15:"Too flat: about 232 N.",
          a90:"Hanging straight down, each rope holds 60 N. Flatten the ropes." } },
      { id:"tc2", goal:5, prompt:"River mode, current 3 m/s, boat 6 m/s. Choose the heading that lands the boat directly opposite its start.",
        why:"`6 sin 30° = 3`: the boat’s upstream part cancels the current, so it lands directly opposite.",
        hints:["The boat’s upstream part must cancel the 3 m/s current.", "`6 sin φ = 3`.", "`sin φ = 1/2`: `φ` = 30° upstream."],
        msgs:{ mode:"Switch to the <strong>River</strong> scene first.", set:"Set the current to 3 m/s and the boat to 6 m/s first.",
          dn30:"You’ll drift twice as far: the boat’s own push now adds to the current. " + M7,
          zero:"The current carries you 3 m downstream every second. " + M7,
          up:"Now the boat beats the current and lands upstream.",
          other:"With this heading the boat lands {d}. Make the upstream part, `6 sin φ`, equal 3." } },
      { id:"tc3", goal:[4, 5], stretch:true, prompt:"Air mode. Wind from 090° (blowing west) at 100 km/h; airspeed 200 km/h. Choose the heading that gives a track of exactly 000° (due north). (The track stays hidden until you press <strong>Check challenge</strong>.)",
        why:"`200 sin 30° = 100` cancels the wind’s westward push. The ground speed is `200 cos 30° = 100√3` ≈ 173 km/h, due north.",
        hints:["The plane’s east component must cancel the wind’s 100 km/h westward push.", "`200 sin φ = 100`, where `φ` is the angle east of north.", "`sin φ = 1/2`: heading 030°. The ground speed is `200 cos 30° = 100√3` ≈ 173 km/h."],
        msgs:{ mode:"Switch to the <strong>Air</strong> scene first.", set:"Set the wind to “from 090°” at 100 km/h and the airspeed to 200 km/h first.",
          h330:"That leans into a wind from the west. This wind blows toward the west, so lean east. " + M4,
          h000:"Pointing north isn’t enough: the wind pushes you west. " + M5,
          over:"Overcorrected: your east component now beats the wind.",
          other:"With heading {h} the track is {t}. Lean east just enough to cancel the 100 km/h westward push." } }
    ]
  },
  part3:{
    slug:"navigation", name:"Navigation",
    heading:"Wind and current",
    intro:"Navigation problems hinge on drawing the right velocity triangle and naming its sides. This is planning, not steering: build each triangle and read it.",
    st1:{ title:"Station 1: name the triangle",
      how:"Tap a label, then tap the side it names (or tap a side first, then a label). Enter works on every button.",
      chips:[{ id:"air", t:"air velocity (heading, airspeed)" }, { id:"wind", t:"wind" }, { id:"ground", t:"ground velocity (track, ground speed)" }],
      fb:{ air:"The air velocity points along the heading in the flight plan, and its length is the airspeed.",
        wind:"The wind arrow points where the wind blows <strong>toward</strong> (opposite its “from” bearing), and its length is the wind speed.",
        ground:"The ground velocity is the sum: it runs from the start of the first arrow to the tip of the last." },
      tris:[
        { id:"f1", tab:"Plan 1", brief:"Heading 000° at 300 km/h; wind from 270° at 100 km/h.", air:[0, 300], wind:[100, 0], first:"air", sides:{ a:"wind", b:"ground", c:"air" } },
        { id:"f2", tab:"Plan 2", brief:"Heading 090° at 400 km/h; wind from 000° at 150 km/h. (The wind arrow is drawn first.)", air:[400, 0], wind:[0, -150], first:"wind", sides:{ a:"ground", b:"wind", c:"air" } },
        { id:"f3", tab:"Plan 3", brief:"Heading 045° at 300 km/h; wind from 180° at 120 km/h.", air:[212.132, 212.132], wind:[0, 120], first:"air", sides:{ a:"air", b:"ground", c:"wind" } }
      ],
      both:"Both orders work: wind first or wind last, the arrows join tip to tail and the ground velocity closes the triangle." },
    st2:{ title:"Station 2: straight across",
      how:"Set the boat and the current. Turn on <strong>Land opposite</strong> to lock the heading to `sin φ = c/b`.",
      width:60, lock:"Land opposite",
      rows:{ phi:"Upstream angle `φ = sin^{-1}(c/b)`", across:"Across speed `√{b^2 - c^2}`", time:"Time = width ÷ across speed" },
      impossible:"Impossible: the current is at least as fast as the boat. You can’t land opposite.",
      alg:["Ground velocity = `(c - b sin φ, b cos φ)`.", "This is `(0, b cos φ)` exactly when `b sin φ = c`.", "Then the across speed is `b cos φ = √{b^2 - c^2}`, and the time is width ÷ `b cos φ`."] },
    st3:{ title:"Station 3: fastest vs shortest",
      how:"Two ghost boats cross the same river (current 3 m/s, boat 6 m/s, width 60 m). Press Race.",
      race:"Race",
      a:"Boat A heads straight across: 60 ÷ 6 = 10 s, and it lands 30 m downstream.",
      b:"Boat B aims 30° upstream: 60 ÷ `3√3 = 20/√3` ≈ 11.5 s, and it lands directly opposite.",
      verdict:"Straight across is the fastest crossing; aiming upstream gives the shortest path." },
    quickCheck:{
      title:"Quick check", summary:"Wind and current quick check",
      items:[
        { id:"q1", goal:3, prompt:"A plane heads 090° at 400 km/h. The wind blows from the south at 300 km/h. What is the ground speed?",
          choices:[
            { t:"500 km/h", ok:true, fb:"Right. The velocities are at right angles: `√{400^2 + 300^2} = 500`." },
            { t:"700 km/h", fb:M6 },
            { t:"100 km/h", fb:"That’s for opposite directions." },
            { t:"`100√7` km/h", fb:"The velocities are at right angles: add the squares." }] },
        { id:"q2", goal:4, prompt:"…and its track leans:",
          choices:[
            { t:"north of east", ok:true, fb:"Right. A south wind blows toward the north, so the track leans north of the 090° heading." },
            { t:"south of east", fb:"A south wind pushes north. " + M4 },
            { t:"due east", fb:M5 },
            { t:"due north", fb:"The plane still points east; the wind only leans its track toward the north." }] },
        { id:"q3", goal:5, prompt:"A boat moves 5 m/s through the water and aims to land directly opposite in a 3 m/s current. What is its speed across?",
          choices:[
            { t:"4 m/s", ok:true, fb:"Right. `√{25 - 9} = 4`: the boat’s 5 m/s is the hypotenuse." },
            { t:"8 m/s", fb:"`√{25 - 9} = 4`: the boat’s 5 m/s is the hypotenuse." },
            { t:"2 m/s", fb:"`√{25 - 9} = 4`: the boat’s 5 m/s is the hypotenuse." },
            { t:"`√34` m/s", fb:"`√{25 - 9} = 4`: the boat’s 5 m/s is the hypotenuse." }] },
        { id:"q4", goal:5, prompt:"A boat moves 2 m/s through the water; the current is 4 m/s. Can it land directly opposite?",
          choices:[
            { t:"No: the current is faster than the boat", ok:true, fb:"Right. It would need `sin φ = 4/2 = 2`, which is impossible." },
            { t:"Yes, aim 30° upstream", fb:"It would need `sin φ = 4/2 = 2`, which is impossible." },
            { t:"Yes, aim 60° upstream", fb:"It would need `sin φ = 4/2 = 2`, which is impossible." },
            { t:"Yes, aim straight across", fb:"It would need `sin φ = 4/2 = 2`, which is impossible." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"tension", type:"custom", title:"Tension builder", summary:"Tension builder", goal:[1, 2],
        general:"Split each rope into components: the horizontal parts cancel and the vertical parts add up to the weight.",
        instruction:"Find the tensions. Items 5 and 6 are multi-step.",
        how:"Type a whole number or an exact root (such as 80, `20√3` or 50√2), then press Check. Answers with a root must be exact.",
        items:[
          { id:"t1", goal:1, prompt:"An 80 N weight hangs from two ropes, each 30° above the horizontal. Tension in each rope?",
            boxes:[{ k:"v", label:"`T =`", unit:"N" }], answer:{ v:"80" }, display:"80 N",
            wrong:[{ v:"40", fb:M1 }, { v:"80/√3", fb:M3 }],
            hints:["Each rope’s vertical part is `T sin 30°`.", "`2T sin 30° = 80`.", "`2T(1/2) = 80`, so `T` = 80 N."],
            why:"`2T sin 30° = 80` gives `T` = 80 N." },
          { id:"t2", goal:1, prompt:"A 60 N weight hangs from two ropes, each 60° above the horizontal. Tension in each?",
            boxes:[{ k:"v", label:"`T =`", unit:"N" }], answer:{ v:"20√3" }, display:"`20√3` N (about 34.6 N)",
            wrong:[{ v:"30", fb:M1 }, { v:"60", fb:"You used `cos 60°`. " + M3 }],
            hints:["Each rope lifts with `T sin 60°`.", "`2T(√3/2) = 60`, so `T√3 = 60`.", "`T = 60/√3 = 20√3` N."],
            why:"`2T sin 60° = 60`, so `T√3 = 60` and `T = 20√3` N." },
          { id:"t3", goal:1, prompt:"A 100 N weight, two ropes each at 45°. Tension in each?",
            boxes:[{ k:"v", label:"`T =`", unit:"N" }], answer:{ v:"50√2" }, display:"`50√2` N (about 70.7 N)",
            wrong:[{ v:"50", fb:M1 }, { v:"100√2", fb:"Each rope only lifts half." }],
            hints:["Each rope lifts with `T sin 45°`.", "`2T(√2/2) = 100`, so `T√2 = 100`.", "`T = 100/√2 = 50√2` N."],
            why:"`2T sin 45° = 100`, so `T√2 = 100` and `T = 50√2` N." },
          { id:"t4", goal:2, prompt:"A 200 N weight hangs from a rope at 30° (left) and a rope at 60° (right). Find both tensions.",
            boxes:[{ k:"l", label:"Left `T_1 =`", unit:"N" }, { k:"r", label:"Right `T_2 =`", unit:"N" }], answer:{ l:"100", r:"100√3" }, display:"left 100 N, right `100√3` N",
            wrong:[{ vals:{ l:"100√3", r:"100" }, fb:"The steeper rope carries more. " + M2 }],
            hints:["Horizontal parts cancel: `T_1 cos 30° = T_2 cos 60°`.", "`T_2 = √3 T_1`; vertical: `T_1/2 + (√3 T_1)(√3/2) = 200`.", "`2T_1 = 200`: `T_1 = 100`, `T_2 = 100√3`."],
            why:"`T_2 = √3 T_1` from the horizontal parts; then `2T_1 = 200`, so the left rope has 100 N and the right rope `100√3` N." },
          { id:"t5", goal:[1, 2], prompt:"A 90 N sign hangs from a horizontal cable and a cable at 30° above the horizontal. Find both tensions.",
            boxes:[{ k:"a", label:"Angled cable", unit:"N" }, { k:"h", label:"Horizontal cable", unit:"N" }], answer:{ a:"180", h:"90√3" }, display:"angled 180 N, horizontal `90√3` N",
            general:"Only the angled cable lifts: `T sin 30° = 90`.",
            hints:["The horizontal cable has no vertical component.", "So the angled cable’s vertical part is the whole 90 N: `T sin 30° = 90`.", "`T` = 180 N; horizontal cable = `180 cos 30° = 90√3` N."],
            why:"`T sin 30° = 90` gives 180 N in the angled cable; its horizontal part, `180 cos 30° = 90√3` N, is what the horizontal cable balances." },
          { id:"t6", goal:2, prompt:"Two ropes, each rated for at most 100 N, will hang a 100 N weight symmetrically. What is the smallest angle above the horizontal they can make?",
            boxes:[{ k:"v", label:"`θ =`", unit:"°" }], answer:{ v:"30" }, display:"30°",
            wrong:[{ v:"60", fb:"That’s safe, but not the smallest: flatter means more tension." }, { v:"45", fb:"That’s safe, but not the smallest: flatter means more tension." }],
            hints:["`T = W/(2 sin θ)` must stay at most 100.", "`100/(2 sin θ) <= 100`, so `sin θ >= 1/2`.", "The smallest angle is 30°: there each rope holds exactly 100 N."],
            why:"`100/(2 sin θ) <= 100` needs `sin θ >= 1/2`, so the ropes can be as flat as 30° and no flatter." }
        ] },
      { id:"nav", type:"custom", title:"Navigation set", summary:"Navigation set", star:true, goal:[3, 4, 5, 6],
        general:"Add the velocities as vectors (east and north components). For crossing times, use only the across component.",
        instruction:"Add velocities tip to tail. Items 4 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type a whole number or an exact root (such as 250, `10√3` or 60√5), then press Check.",
        items:[
          { id:"n1", goal:3, prompt:"A plane heads 000° at 240 km/h with a wind from the west at 70 km/h. Ground speed?",
            boxes:[{ k:"v", label:"Ground speed", unit:"km/h" }], answer:{ v:"250" }, display:"250 km/h",
            wrong:[{ v:"310", fb:M6 }, { v:"170", fb:M6 }],
            hints:["A wind from the west blows toward the east: (70, 0).", "Ground velocity = (0, 240) + (70, 0) = (70, 240).", "`√{70^2 + 240^2} = √{62 500} = 250` km/h."],
            why:"(0, 240) + (70, 0) = (70, 240), and `√{4900 + 57 600} = 250` km/h." },
          { id:"n2", goal:5, prompt:"A boat aims straight across a 120 m river at 3 m/s; the current is 4 m/s. How far downstream does it land?",
            boxes:[{ k:"v", label:"Drift", unit:"m" }], answer:{ v:"160" }, display:"160 m downstream",
            wrong:[{ v:"90", fb:"That swaps the speeds." }, { v:"200", fb:"That’s the total distance travelled." }],
            hints:["Crossing time = width ÷ across speed.", "120 ÷ 3 = 40 s.", "Drift = 4 × 40 = 160 m."],
            why:"The crossing takes 120 ÷ 3 = 40 s, and the current carries the boat 4 × 40 = 160 m downstream." },
          { id:"n3", goal:5, prompt:"A boat moving 8 m/s through the water must land directly opposite on a 120 m river with a 4 m/s current. Upstream angle, and crossing time?",
            boxes:[{ k:"a", label:"Upstream angle `φ =`", unit:"°" }, { k:"t", label:"Time", unit:"s" }], answer:{ a:"30", t:"10√3" }, display:"30° upstream; `10√3` s (about 17.3 s)",
            wrong:[{ k:"t", v:"15", fb:"That’s the time if it aims straight across, but then it drifts. " + M7 }, { k:"t", v:"120/√80", fb:M8 }],
            hints:["`8 sin φ = 4`.", "`φ = 30°`; across speed `8 cos 30° = 4√3`.", "Time = `120/(4√3) = 10√3` s."],
            why:"`8 sin φ = 4` gives `φ = 30°`; the across speed is `8 cos 30° = 4√3` m/s, so the time is `120/(4√3) = 10√3` s." },
          { id:"n4", goal:6, star:true, prompt:"A plane must make good a track of 090° at a ground speed of 400 km/h. The wind blows from the north at 300 km/h. What airspeed must it fly?",
            boxes:[{ k:"v", label:"Airspeed", unit:"km/h" }], answer:{ v:"500" }, display:"500 km/h",
            wrong:[{ v:"100", fb:"Air velocity = ground velocity − wind: (400, 0) − (0, −300) = (400, 300)." }, { v:"700", fb:M6 }],
            hints:["Work backwards: air velocity = ground velocity − wind.", "A wind from the north is (0, −300); (400, 0) − (0, −300) = (400, 300).", "`√{400^2 + 300^2} = 500` km/h."],
            why:"Air velocity = (400, 0) − (0, −300) = (400, 300), so the airspeed is 500 km/h." },
          { id:"n5", goal:[5, 6], star:true, prompt:"A swimmer moves 1 m/s through the water and heads straight across a 60 m river with a 2 m/s current. How far does she travel over the ground?",
            boxes:[{ k:"v", label:"Distance", unit:"m" }], answer:{ v:"60√5" }, display:"`60√5` m (about 134.2 m)",
            wrong:[{ v:"120", fb:"That’s only the drift; combine it with the 60 m across." }, { v:"180", fb:M6 }],
            hints:["Time to cross: 60 ÷ 1.", "60 s; drift 2 × 60 = 120 m.", "`√{60^2 + 120^2} = 60√5` m."],
            why:"She crosses in 60 s and drifts 120 m, so she travels `√{60^2 + 120^2} = 60√5` m over the ground." },
          { id:"n6", goal:[4, 6], star:true, prompt:"A plane heads 060° at 200 km/h. The wind blows from 240° at 50 km/h. Ground speed?",
            boxes:[{ k:"v", label:"Ground speed", unit:"km/h" }], answer:{ v:"250" }, display:"250 km/h",
            wrong:[{ v:"150", fb:"From 240° means toward 060°: a tailwind. " + M4 }],
            hints:["Turn “from 240°” into “toward ___”.", "240° − 180° = 060°: the same direction as the heading.", "200 + 50 = 250 km/h."],
            why:"A wind from 240° blows toward 060°, the heading itself: a tailwind, so 200 + 50 = 250 km/h." }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Pooja", how:"", goal:[1, 4, 5],
        instruction:"Pooja made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"A 100 N lamp hangs from two ropes, each 30° above the horizontal. Find the tension in each rope.",
            steps:["By symmetry, both ropes have the same tension `T`.", "Each rope’s vertical component is `T cos 30°`.", "So `2T cos 30° = 100`, which gives `T√3 = 100`.", "`T = 100√3/3` ≈ 58 N."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2. The mistake is earlier.", "Step 4’s arithmetic is right for step 3."],
            fixes:[
              { t:"The vertical part is `T sin 30° = T/2`, so `2(T/2) = 100` and `T` = 100 N.", ok:true, why:"The 30° is measured from the horizontal, so the vertical part is opposite it: `T sin 30°`." },
              { t:"The vertical part is `T`, so `T` = 50 N.", why:M1 },
              { t:"The vertical part is `T tan 30°`.", why:"Tangent isn’t a component of the rope’s pull." },
              { t:"Step 2 is correct.", why:M3 }],
            hints:["Is 30° measured from the horizontal or the vertical?", "From the horizontal, so the vertical part is opposite it.", "`T sin 30°`; `T` = 100 N."] },
          { id:"e2", goal:5, task:"A boat moves 5 m/s through the water and aims straight across a 100 m river with a 3 m/s current. How long does the crossing take?",
            steps:["The boat’s velocity through the water is 5 m/s straight across.", "The current adds 3 m/s downstream.", "The ground speed is `√{5^2 + 3^2} = √34` m/s.", "Time = 100 ÷ `√34` ≈ 17 s."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct, but is the ground speed what you need?", ""],
            fixes:[
              { t:"Only the across component moves the boat across: time = 100 ÷ 5 = 20 s.", ok:true, why:"The current moves the boat sideways but not across; 5 m/s carries it the 100 m." },
              { t:"Time = 100 ÷ (5 + 3) = 12.5 s.", why:M6 },
              { t:"Time = 100 ÷ (5 − 3) = 50 s.", why:"The current doesn’t slow the across motion." },
              { t:"Step 4 is correct.", why:M8 }],
            hints:["Along the ground velocity, the boat travels more than 100 m.", "Across the river, it moves 5 m each second.", "100 ÷ 5 = 20 s."] },
          { id:"e3", goal:4, task:"A plane heads 000° at 300 km/h; the wind is from the east at 100 km/h. Which way does its track lean?",
            steps:["Air velocity: (0, 300) km/h, with east and north as positive.", "A wind from the east blows toward the east: (100, 0).", "Ground velocity = (100, 300).", "So the track leans east of north."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 adds steps 1 and 2 correctly.", "Step 4 reads step 3 correctly."],
            fixes:[
              { t:"A wind from the east blows toward the west: (−100, 0), so the ground velocity is (−100, 300) and the track leans west of north.", ok:true, why:"Winds are named for where they come from." },
              { t:"The wind adds to the speed: (0, 400).", why:M6 },
              { t:"A wind from the east is (0, −100).", why:"That’s a wind from the north." },
              { t:"Step 2 is correct.", why:M4 }],
            hints:["Winds are named for where they come from.", "From the east means moving west.", "(−100, 0): west of north."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you more: how fast the rope tension climbed as the ropes flattened, or how far the boat drifted in the river?" },
      { id:"j2", q:"In your own words, what’s the difference between a plane’s heading and its track?" },
      { id:"j3", q:"Explain to a friend how to choose a heading that lands a boat directly opposite, and why the crossing then takes longer." },
      { id:"j4", q:"Which part still trips you up: the rope angles, the wind directions, or which speed to divide by? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:4,
        a:{ prompt:"A wind from 270° blows toward which bearing?", options:[
          { t:"090°", ok:true, why:"From 270° (west), toward the east." },
          { t:"270°", why:M4 },
          { t:"180°", why:"That’s a quarter turn off." },
          { t:"360°", why:"That’s a quarter turn the other way." }] },
        b:{ prompt:"A current flows toward 135°. Which bearing does it come from?", options:[
          { t:"315°", ok:true, why:"135° + 180°." },
          { t:"135°", why:"A current named by its “from” bearing comes from the opposite way to where it flows. " + M4 },
          { t:"225°", why:"That’s a quarter turn off." },
          { t:"045°", why:"That’s a quarter turn the other way." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"Two ropes, each 60° above the horizontal, hold a 30 N weight. What is the tension in each rope?", options:[
          { t:"`10√3` N", ok:true, why:"`2T sin 60° = 30`, so `T√3 = 30`." },
          { t:"15 N", why:M1 },
          { t:"30 N", why:"That uses `cos 60°`. " + M3 },
          { t:"`20√3` N", why:"That forgets there are two ropes: `T sin 60° = 30`." }] },
        b:{ prompt:"Two ropes, each 45° above the horizontal, hold a 50 N weight. Tension in each?", options:[
          { t:"`25√2` N", ok:true, why:"`2T(√2/2) = 50`, so `T = 50/√2`." },
          { t:"25 N", why:M1 },
          { t:"`50√2` N", why:"That forgets there are two ropes." },
          { t:"50 N", why:"Each rope holds only part of the weight." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"A plane heads 090° at 480 km/h; the wind blows toward 000° at 140 km/h. What is the ground speed?", options:[
          { t:"500 km/h", ok:true, why:"`√{480^2 + 140^2} = √{250 000}`." },
          { t:"620 km/h", why:M6 },
          { t:"340 km/h", why:"That’s for opposite directions." },
          { t:"480 km/h", why:"The wind changes the ground speed. " + M5 }] },
        b:{ prompt:"A plane heads 180° at 300 km/h; the wind blows toward 270° at 160 km/h. Ground speed?", options:[
          { t:"340 km/h", ok:true, why:"`√{90 000 + 25 600} = √{115 600}`." },
          { t:"460 km/h", why:M6 },
          { t:"140 km/h", why:"That’s for opposite directions." },
          { t:"300 km/h", why:"The wind changes the ground speed. " + M5 }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"A 120 N weight hangs from a rope 30° above the horizontal (left) and a rope 60° above the horizontal (right). What are the tensions?", options:[
          { t:"Left 60 N, right `60√3` N", ok:true, why:"The ropes meet at 90°: left = `120 sin 30°`, right = `120 sin 60°`." },
          { t:"Left `60√3` N, right 60 N", why:M2 },
          { t:"60 N each", why:M1 },
          { t:"120 N each", why:"Neither rope holds the whole weight." }] },
        b:{ prompt:"An 80 N weight hangs from a rope at 60° (left) and a rope at 30° (right). Tensions?", options:[
          { t:"Left `40√3` N, right 40 N", ok:true, why:"The ropes meet at 90°: left = `80 sin 60°`, right = `80 sin 30°`." },
          { t:"Left 40 N, right `40√3` N", why:M2 },
          { t:"40 N each", why:M1 },
          { t:"80 N each", why:"Neither rope holds the whole weight." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"A boat moves 10 m/s through the water and must land directly opposite on a 150 m river with a 5 m/s current. How long does the crossing take?", options:[
          { t:"`10√3` s", ok:true, why:"Aim 30° upstream (`sin φ = 1/2`); across speed `10 cos 30° = 5√3`; `150 ÷ 5√3 = 10√3`." },
          { t:"15 s", why:"That’s the time aiming straight across, which lands downstream. " + M7 },
          { t:"`6√5` s", why:"That divides by the ground speed when aiming straight across. " + M8 },
          { t:"10 s", why:"150 ÷ (10 + 5) adds the speeds. " + M6 }] },
        b:{ prompt:"A boat moves 4 m/s and must land opposite on a 72 m river with a 2 m/s current. Crossing time?", options:[
          { t:"`12√3` s", ok:true, why:"Across speed `4 cos 30° = 2√3`; `72 ÷ 2√3 = 12√3`." },
          { t:"18 s", why:"That’s the time aiming straight across, which lands downstream. " + M7 },
          { t:"`36√5/5` s", why:"That divides by the ground speed when aiming straight across. " + M8 },
          { t:"12 s", why:"72 ÷ (4 + 2) adds the speeds. " + M6 }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"A plane needs a ground velocity of 400 km/h due north. The wind blows toward the east at 300 km/h. What airspeed must it fly?", options:[
          { t:"500 km/h", ok:true, why:"Air velocity = ground − wind = (0, 400) − (300, 0) = (−300, 400)." },
          { t:"700 km/h", why:M6 },
          { t:"100 km/h", why:"Subtracting speeds only works in one line." },
          { t:"400 km/h", why:"To fight the crosswind it must fly faster than 400. " + M5 }] },
        b:{ prompt:"A plane needs a ground velocity of 240 km/h due east. The wind blows toward the south at 70 km/h. Airspeed?", options:[
          { t:"250 km/h", ok:true, why:"(240, 0) − (0, −70) = (240, 70)." },
          { t:"310 km/h", why:M6 },
          { t:"170 km/h", why:"Subtracting speeds only works in one line." },
          { t:"240 km/h", why:"To fight the crosswind it must fly faster than 240. " + M5 }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which statement correctly distinguishes heading from track?", options:[
          { t:"“Heading is the direction the plane points (its air velocity); track is the direction it actually moves over the ground (air velocity + wind).”", ok:true, why:"Heading is where it points; track is where it goes." },
          { t:"“They’re always the same direction.”", why:M5 },
          { t:"“Track is the direction the wind blows.”", why:"The wind is only one of the two vectors." },
          { t:"“Heading is where the plane ends up; track is where it points.”", why:"That swaps them." }] },
        b:{ prompt:"Why must a boat aim upstream to land directly opposite?", options:[
          { t:"“Its upstream component must cancel the current, so its ground velocity points straight across.”", ok:true, why:"With no sideways part left, the boat goes straight across." },
          { t:"“Aiming upstream makes the boat go faster.”", why:M7 },
          { t:"“The current pushes upstream.”", why:"The current pushes downstream." },
          { t:"“Aiming upstream makes the river narrower.”", why:"The width doesn’t change." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which best explains why a heavy weight can’t hang from two perfectly horizontal ropes?", options:[
          { t:"“Only the vertical components lift the weight. A horizontal rope has none, so `T = W/(2 sin θ)` grows without bound as `θ -> 0°`.”", ok:true, why:"No vertical part means no lift, however hard the rope pulls." },
          { t:"“Horizontal ropes carry no tension.”", why:"They’d need enormous tension, not none." },
          { t:"“Each rope always holds half the weight.”", why:M1 },
          { t:"“Horizontal ropes stretch too much.”", why:"Stretch isn’t the reason: the vertical parts are zero." }] },
        b:{ prompt:"A weight hangs from ropes at 30° and 60° above the horizontal. Which best explains why the 60° rope has more tension?", options:[
          { t:"“The horizontal parts cancel: `T_{30} cos 30° = T_{60} cos 60°`, so `T_{60} = √3 T_{30}`.”", ok:true, why:"The steeper rope has the smaller cosine, so it needs the bigger tension." },
          { t:"“The flatter rope stretches more, so it holds more.”", why:M2 },
          { t:"“Both ropes share the weight equally.”", why:M1 },
          { t:"“The steeper rope is shorter.”", why:"Length doesn’t decide the tension; the angles do." }] } },
      { id:"a1", cat:"A", goal:[1, 6],
        a:{ prompt:"A crane hook lifts a 300 N bag with two chains, each 60° above the horizontal. What is the tension in each chain?", options:[
          { t:"`100√3` N", ok:true, why:"`2T sin 60° = 300`, so `T = 300/√3`." },
          { t:"150 N", why:M1 },
          { t:"300 N", why:"That uses `cos 60°`. " + M3 },
          { t:"`200√3` N", why:"That forgets there are two chains." }] },
        b:{ prompt:"A 500 N load hangs from two cables, each 30° above the horizontal. Tension in each?", options:[
          { t:"500 N", ok:true, why:"`2T(1/2) = 500`." },
          { t:"250 N", why:M1 },
          { t:"`500√3/3` N", why:"That uses `cos 30°`. " + M3 },
          { t:"1000 N", why:"That forgets there are two cables." }] } },
      { id:"a2", cat:"A", goal:[5, 6],
        a:{ prompt:"A canoeist paddles 3 m/s straight across a 90 m river with a 4 m/s current. Where does she land?", options:[
          { t:"120 m downstream", ok:true, why:"Time 90 ÷ 3 = 30 s; drift 4 × 30 = 120 m." },
          { t:"Directly opposite", why:M5 },
          { t:"67.5 m downstream", why:"That swaps the speeds: 90 × 3/4." },
          { t:"210 m downstream", why:"That uses 3 + 4 = 7 m/s for the drift. " + M6 }] },
        b:{ prompt:"A kayaker paddles 2 m/s straight across a 50 m river with a 3 m/s current. Where does he land?", options:[
          { t:"75 m downstream", ok:true, why:"25 s × 3 m/s." },
          { t:"Directly opposite", why:M5 },
          { t:"33⅓ m downstream", why:"That swaps the speeds." },
          { t:"125 m downstream", why:"That uses 2 + 3 = 5 m/s for the drift. " + M6 }] } }
    ]
  },
  task:{
    title:"Plan the crossing", summary:"Plan the crossing",
    statement:"<p>A ferry must cross a 60 m river and land directly opposite its dock. Choose the current it can handle, the ferry’s speed and its heading so that every condition is met. Find all the answers.</p>" + COND +
      "<p class=\"tiny muted\">Current `c`: whole number, 1 to 6 m/s. Ferry speed through the water `b`: whole number, 1 to 10 m/s. Heading `φ`: 75° downstream to 75° upstream, in steps of 15°.</p>",
    checks:["Lands directly opposite", "Crossing takes at most 15 s", "Current at least 2 m/s"],
    tips:["To land opposite, the ferry’s upstream part, `b sin φ`, must equal the current.",
      "Only the across part, `b cos φ`, moves the ferry across. You need 60 ÷ (`b cos φ`) ≤ 15.",
      "Pick a current of 2 m/s or more."],
    explainPrompt:"Explain how you made the ferry land opposite and how you checked the crossing time.",
    vocab:"Use the words heading, current, upstream component and across speed.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"With whole-number speeds and headings in 15° steps, only `sin φ = 1/2` gives an exact match, so the ferry is always twice as fast as the current. The 2 m/s current fails because the across speed would be only `2√3` ≈ 3.5 m/s."
  },
  cards:[
    ["Two ropes holding a weight", "`vec{T}_1 + vec{T}_2 + vec{W} = vec{0}`: horizontal parts cancel; vertical parts add to `W`."],
    ["Symmetric ropes at angle `θ`", "`T = W/(2 sin θ)`. At 30°, `T = W`."],
    ["Flatter ropes", "Bigger tension; a loaded rope can never be perfectly horizontal."],
    ["Unequal angles", "The steeper rope carries more tension."],
    ["Triangle of forces", "Balanced forces close tip to tail; solve with the sine or cosine law."],
    ["Ground velocity", "Air (or water) velocity + wind (or current)."],
    ["Heading vs track", "Heading: where it points. Track: where it actually goes."],
    ["“Wind from 270°”", "Blows toward 090° (east). Winds are named for where they come from."],
    ["Landing directly opposite", "Aim upstream with `b sin φ = c`."],
    ["Crossing time", "Width ÷ across speed (`b cos φ`), never ÷ ground speed."],
    ["Fastest crossing", "Head straight across: time = width ÷ `b`, but you drift."],
    ["Working backwards", "Air velocity = ground velocity − wind."]
  ]
};
