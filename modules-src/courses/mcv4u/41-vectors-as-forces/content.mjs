// MCV4U 41 Vectors as Forces. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/41-vectors-as-forces.md
// misconception core sentences (plan §3)
const M1 = "Magnitudes add only when the forces point the same way. At right angles, use Pythagoras.";
const M2 = "Drawn tip to tail, the angle opposite the resultant is 180° − θ. Use `|vec{R}|^2 = a^2 + b^2 + 2ab cos θ`, or components.";
const M3 = "The equilibrant cancels the resultant: same magnitude, opposite direction (add 180°).";
const M4 = "Many forces can act. Equilibrium means they add to `vec{0}`, so they close up tip to tail.";
const M5 = "The side next to the angle uses cosine: horizontal = `F cos θ` when `θ` is measured from the horizontal.";
const M6 = "The angle between the weight and the line <em>into</em> the slope is `θ`, so the part <em>along</em> the slope is opposite it: `W sin θ`.";

export default {
  id:"41-vectors-as-forces",
  kind:"topic",
  title:"Vectors as forces",
  topic:"Vectors as Forces",
  readyTopic:"vectors as forces",
  hero:{
    eq:"<span class=\"vf-hp\">`vec{F}_1`</span> + <span class=\"vf-ht\">`vec{F}_2`</span> + <span class=\"vf-ho\">`vec{F}_3`</span> = `vec{0}`",
    eqLabel:"vector F 1 plus vector F 2 plus vector F 3 equals the zero vector",
    eqSize:"md",
    headline:"Balanced doesn’t mean no forces",
    text:"Forces are <strong>vectors</strong>, so they add tip to tail. The single force with the same effect as all of them together is the <strong>resultant</strong>. When the forces cancel out completely, the object is in <strong>equilibrium</strong>, and the force that would cancel a resultant is called the <strong>equilibrant</strong>.",
    fig:{ aria:"A ring pulled by three ropes of 8 N each, 120° apart. The three forces slide tip to tail and close into an equilateral triangle: their sum is the zero vector. Then the orange rope is cut and the ring jerks toward the upper right: the resultant is 8 N at 60°.", shape:"wide" },
    cap:{ start:"Three 8 N ropes pull on a ring, 120° apart. The ring sits still.", end:"Tip to tail the three forces close up: net force `vec{0}`. Cut the orange rope and the other two leave a resultant of 8 N at 60°." }
  },
  goals:[
    "I can treat forces as vectors and find the resultant of two or more forces using diagrams or components.",
    "I can find the magnitude of the resultant of two forces using the angle between them and the cosine law.",
    "I can find the equilibrant of a set of forces and explain what equilibrium means.",
    "I can resolve a force into perpendicular components, including along and across a ramp.",
    "I can solve force problems in context, including three forces in equilibrium."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Adding vectors", goal:1, prompt:"Vectors `vec{u}` and `vec{v}` are perpendicular, with `|vec{u}| = 6` and `|vec{v}| = 8`. What is `|vec{u} + vec{v}|`?",
          options:[
            { t:"10", ok:true, why:"Tip to tail they make a right triangle: `√(36 + 64) = 10`." },
            { t:"14", why:"That only works if they point the same way." },
            { t:"2", why:"That’s for opposite directions." },
            { t:"100", why:"100 is `|vec{u} + vec{v}|^2`." }],
          hints:["Draw `vec{v}` starting at the tip of `vec{u}`.", "The sum is the hypotenuse of a right triangle.", "`√(6^2 + 8^2) = 10`."] },
        { id:"w2", skill:"Adding vectors", goal:3, prompt:"Three vectors drawn tip to tail form a closed triangle. What is their sum?",
          options:[
            { t:"The zero vector, `vec{0}`", ok:true, why:"You end where you started." },
            { t:"The longest side", why:"The longest side is only one of the three." },
            { t:"A vector along the perimeter", why:"Vectors add as arrows, not lengths." },
            { t:"It can’t be found without the lengths", why:"A closed path always sums to `vec{0}`." }],
          hints:["Where does the last arrow end?", "Back at the first tail.", "So the sum is `vec{0}`."] },
        { id:"w3", skill:"Cosine law", goal:2, prompt:"In a triangle, sides of length 3 and 5 enclose an angle of 120°. How long is the third side?",
          options:[
            { t:"7", ok:true, why:"`c^2 = 9 + 25 - 2(3)(5) cos 120° = 34 + 15 = 49`." },
            { t:"`√19`", why:"You took `cos 120° = +1/2`. `cos 120° = -1/2`, so you add 15." },
            { t:"8", why:"Sides add only along a straight line." },
            { t:"`√34`", why:"You dropped the angle term. That’s the right-angle case." }],
          hints:["`c^2 = a^2 + b^2 - 2ab cos C`.", "`cos 120° = -1/2`.", "`c^2 = 34 + 15 = 49`, so `c = 7`."] },
        { id:"w4", skill:"Cosine law", goal:2, prompt:"Sides of length 4 and 4 enclose an angle of 60°. How long is the third side?",
          options:[
            { t:"4", ok:true, why:"`16 + 16 - 32(1/2) = 16`. It’s equilateral." },
            { t:"`4√3`", why:"You took `cos 60° = -1/2`. `cos 60° = +1/2`." },
            { t:"8", why:"You added the sides. Sides add only along a straight line." },
            { t:"`4√2`", why:"You dropped the angle term. That’s for 90°." }],
          hints:["`cos 60° = 1/2`.", "`c^2 = 32 - 16`.", "`c = 4`."] },
        { id:"w5", skill:"Components", goal:4, prompt:"A vector of magnitude 10 points 30° counterclockwise from the positive `x`-axis. What are its components?",
          options:[
            { t:"`(5√3, 5)`", ok:true, why:"`(10 cos 30°, 10 sin 30°)`." },
            { t:"`(5, 5√3)`", why:"Sine and cosine are swapped. That vector is at 60°." },
            { t:"`(10, 30)`", why:"Those are the magnitude and the angle. Components are lengths along the axes." },
            { t:"`(5√2, 5√2)`", why:"Those are the components at 45°." }],
          hints:["`x = r cos θ`, `y = r sin θ`.", "`cos 30° = √3/2`, `sin 30° = 1/2`.", "`(5√3, 5)`."] },
        { id:"w6", skill:"Components", goal:4, prompt:"A rope pulls with 20 N at 60° above the horizontal. What is the vertical component of the pull?",
          options:[
            { t:"`10√3` N", ok:true, why:"`20 sin 60° = 20(√3/2)`." },
            { t:"10 N", why:"You used cosine. That’s the horizontal part." },
            { t:"`20√3` N", why:"Tangent compares the two components; it isn’t one of them." },
            { t:"20 N", why:"Only part of the pull is upward." }],
          hints:["Vertical is opposite the 60° angle.", "Use sine.", "`20 sin 60° = 10√3` N."] }
      ],
      refreshers:{
        "Adding vectors":"Put each arrow’s tail at the previous tip; the sum runs from the first tail to the last tip. A closed loop sums to `vec{0}`.",
        "Cosine law":"`c^2 = a^2 + b^2 - 2ab cos C`, where `C` is the angle <em>between</em> sides `a` and `b`. Remember `cos 120° = -1/2` and `cos 60° = 1/2`.",
        "Components":"A vector of length `r` at angle `θ` from the positive `x`-axis is `(r cos θ, r sin θ)`. Cosine goes with the side next to the angle."
      }
    }
  },
  explore:{
    heading:"Force table",
    intro:"Ropes pull on a ring with different forces. Set each force and see the single force that has the same effect, and the force that would hold the ring still.",
    modes:[{ id:"res", t:"Resultant" }, { id:"eq", t:"Equilibrant" }, { id:"comp", t:"Components" }],
    setups:[{ id:"free", t:"Free play" }, { id:"tc1", t:"Challenge 1" }, { id:"tc2", t:"Challenge 2" }, { id:"tc3", t:"Challenge 3" }],
    txt:{
      forces:["Force `vec{F}_1`", "Force `vec{F}_2`", "Force `vec{F}_3`"], tabs:"Choose a force to set", mag:"Magnitude", dir:"Direction",
      dirNote:"Counterclockwise from the positive `x`-axis.", angles:"Special angles", add3:"Add a third force", locked:"Locked for this challenge",
      mode:"Mode", setup:"Set up", setupNote:"Challenges 1 and 3 lock some forces; challenge 3 hides the resultant’s size.",
      pinOut:"Remove the pin", pinIn:"Put the pin back", attach:"Attach `vec{E}` as a rope", detach:"Take `vec{E}` off",
      measured:"Directions are measured counterclockwise from the positive `x`-axis.",
      rows:{ f1:"`vec{F}_1`", f2:"`vec{F}_2`", f3:"`vec{F}_3`", between:"Angle between `vec{F}_1` and `vec{F}_2`", res:"Resultant `vec{R}`", eq:"Equilibrant `vec{E}`", status:"Status" },
      off:"(off)", hidden:"hidden for challenge 3", noE:"none needed: the net force is already `vec{0}`",
      bal:"Equilibrium: the forces balance (net force `vec{0}`)", notBal:"Not in equilibrium: net force #1",
      held:"With `vec{E}` attached the net force is `vec{0}`: the ring stays put.",
      drift:"The ring would move toward #1.", driftMove:"Pin out: the ring moves toward #1.", stays:"Pin out: the net force is `vec{0}`, so the ring stays put.",
      keyRes:"`vec{F}_1` blue, `vec{F}_2` teal, `vec{F}_3` orange, drawn from the ring; faint copies continue tip to tail; the resultant `vec{R}` is the thick black arrow.",
      keyEq:"The equilibrant `vec{E} = -vec{R}` is the black dashed arrow; adding it closes the tip-to-tail chain.",
      keyComp:"Each force splits into a dashed `x`-part and `y`-part; the table adds the columns.",
      compHead:["Force", "`x`-part (N)", "`y`-part (N)"], sumRow:"Sum `vec{R}`"
    },
    predIntro:"Make a prediction first. Then the force table shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"`vec{F}_1 = 6` N at 0°, `vec{F}_2 = 8` N at 90°. What is the magnitude of the resultant?",
        options:[{ t:"10 N", ok:true }, { t:"14 N" }, { t:"2 N" }, { t:"7 N" }],
        explain:"Right angle between the forces: `√(36 + 64) = 10` N. Adding 6 + 8 assumes they point the same way." },
      { id:"p2", prompt:"Two 10 N forces both point at 0°. Then `vec{F}_2` rotates slowly from 0° to 180°. What happens to the magnitude of the resultant?",
        options:[{ t:"It shrinks from 20 N to 0 N", ok:true }, { t:"It stays 20 N" }, { t:"It grows" }, { t:"It shrinks to 10 N and stays there" }],
        explain:"The more the forces oppose each other, the more they cancel. On the way the resultant passes `10√2` N at 90° and reaches 0 at 180°." },
      { id:"p3", prompt:"Two 10 N forces have 120° between them. What is the magnitude of the resultant?",
        options:[{ t:"10 N", ok:true }, { t:"`10√3` N" }, { t:"20 N" }, { t:"0 N" }],
        explain:"Tip to tail, the angle opposite the resultant is 180° − 120° = 60°: `|vec{R}|^2 = 100 + 100 - 200 cos 60° = 100`. Using 120° in that triangle gives `10√3`, the angle mix-up." },
      { id:"p4", prompt:"`vec{F}_1 = 3` N at 0°, `vec{F}_2 = 4` N at 90°, Equilibrant mode. Which single force would hold the ring still?",
        options:[{ t:"5 N, opposite the resultant (down and to the left)", ok:true }, { t:"5 N, in the same direction as the resultant" }, { t:"7 N, down and to the left" }, { t:"No force: the ring is already balanced" }],
        explain:"The resultant is 5 N up and to the right; the equilibrant has the same size and points the opposite way." }
    ],
    chalIntro:"Choose <strong>Set up: Challenge 1, 2 or 3</strong> above the board (it locks the given forces), set the forces, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:3, prompt:"`vec{F}_1 = 8` N at 0° and `vec{F}_2 = 8` N at 120° are locked. Set `vec{F}_3` so the ring is in equilibrium.",
        why:"The resultant of `vec{F}_1` and `vec{F}_2` is `(4, 4√3)`: 8 N at 60°. Reversed, it’s 8 N at 240°.",
        hints:["Find the resultant of `vec{F}_1` and `vec{F}_2` first.", "`(8, 0) + (-4, 4√3) = (4, 4√3)`: 8 N at 60°.", "Reverse it: 8 N at 240°."],
        msgs:{ setup:"Choose <strong>Set up: Challenge 1</strong> first, so that `vec{F}_1 = 8` N at 0° and `vec{F}_2 = 8` N at 120°.", on3:"Add the third force and set it.",
          res:"That’s the resultant itself. It doubles the pull instead of cancelling it.", dbl:"Right direction, but the resultant of two 8 N forces at 120° is only 8 N.",
          close:"Close. Check the components: the resultant is `(4, 4√3)`.", general:"The ring isn’t balanced yet: the net force is #1. Make `vec{F}_3` cancel the resultant of the other two." } },
      { id:"tc2", goal:2, prompt:"Set `vec{F}_1` and `vec{F}_2` to 10 N each, at directions that make the resultant exactly 10 N.",
        why:"With 120° between them, `|vec{R}|^2 = 100 + 100 + 200 cos 120° = 100`.",
        hints:["As the angle opens, the resultant shrinks.", "`|vec{R}|^2 = 100 + 100 + 200 cos θ = 100`, so `cos θ = -1/2`.", "`θ = 120°`."],
        msgs:{ off3:"Turn the third force off for this challenge.", mags:"Set both magnitudes to 10 N.",
          a60:"The resultant is `10√3` N: at 60° the forces mostly help each other.", a90:"`10√2` N. Open the angle further.",
          general:"The resultant is #1, not 10 N. Change the angle between the forces." } },
      { id:"tc3", goal:[2, 3], stretch:true, prompt:"`vec{F}_1 = 4` N at 0° is locked. Choose `vec{F}_2` so the resultant points straight up (90°) with magnitude `4√3` N. (The resultant readout is hidden for this challenge; only the arrow shows.)",
        why:"`vec{F}_2 = vec{R} - vec{F}_1 = (0, 4√3) - (4, 0) = (-4, 4√3)`: 8 N at 120°.",
        hints:["`vec{F}_2 = vec{R} - vec{F}_1`.", "`(0, 4√3) - (4, 0) = (-4, 4√3)`.", "Magnitude `√(16 + 48) = 8`; the direction is in quadrant 2 with `tan θ = -√3`, so 120°."],
        msgs:{ setup:"Choose <strong>Set up: Challenge 3</strong> first, so that `vec{F}_1 = 4` N at 0°.", off3:"Turn the third force off for this challenge.",
          a90:"The resultant is `(4, 8)`: it leans right.", m4:"Resultant `(2, 2√3)` leans right.",
          m7:"Close, but the horizontal parts don’t cancel: you need −4 in the `x`-component.",
          general:"Not yet: the resultant must be `(0, 4√3)`. Work out `vec{R} - vec{F}_1`." } }
    ]
  },
  part3:{
    slug:"ramp", name:"Ramp",
    heading:"Forces on a ramp",
    intro:"Resolving a force is the move that makes most force problems solvable, and the ramp is the classic case where the angle sits in a surprising place. Split the weight on a ramp, then a rope’s pull on a sled. Then try the quick check.",
    txt:{
      stations:[{ id:"s1", t:"Station 1: the rotating split" }, { id:"s2", t:"Station 2: pulling at an angle" }],
      s1Intro:"A block rests on a frictionless ramp. Its weight (black, straight down) splits into a blue part <strong>along</strong> the slope and a teal part <strong>into</strong> the slope. The two parts form a rectangle with the weight as its diagonal.",
      s2Intro:"A sled is pulled by a rope at angle `α` above the horizontal. The tension splits into a horizontal part (it moves the sled) and a vertical part (it lifts it).",
      ramp:"Ramp angle `θ`", weight:"Weight `W`", alpha:"Rope angle `α`", tension:"Tension `T`",
      why:"Why is the angle `θ` here?", whyDone:"The ramp’s angle `θ` reappears between the weight and the line into the slope: both are 90° minus the same angle.",
      along:"Along the slope: ", into:"Into the slope: ", hold:"Force needed to hold the block: ", up:" up the slope",
      horiz:"Horizontal part: ", vert:"Vertical part: ", allLift:"All lift, no forward pull.", flatRamp:"A flat floor: no part of the weight acts along it.",
      alg:"Check it with algebra",
      algHTML:"<p>Take axes along the ramp (down the slope is negative) and across it (into the slope is negative). Then `vec{W} = (-W sin θ, -W cos θ)`.</p><p>Its length is right: `|vec{W}|^2 = W^2(sin^2 θ + cos^2 θ) = W^2`.</p>"
    },
    quickCheck:{
      title:"Quick check", summary:"Forces on a ramp quick check",
      items:[
        { id:"q1", goal:4, prompt:"A 40 N box rests on a 30° ramp. What is the component of its weight along the slope?",
          choices:[{ t:"20 N", ok:true, fb:"Right. `40 sin 30° = 20` N." }, { t:"`20√3` N", fb:"That’s the part into the slope." }, { t:"40 N", fb:"Only part of the weight acts along the slope." }, { t:"`40√3` N", fb:"Use `40 sin 30°`." }] },
        { id:"q2", goal:4, prompt:"As the ramp gets steeper, the component into the slope…",
          choices:[{ t:"decreases", ok:true, fb:"Right. `W cos θ` falls as `θ` grows." }, { t:"increases", fb:"`W cos θ` falls as `θ` grows." }, { t:"stays the same", fb:"`W cos θ` falls as `θ` grows." }, { t:"becomes negative", fb:"`W cos θ` falls as `θ` grows." }] },
        { id:"q3", goal:4, prompt:"At what ramp angle are the two components equal?",
          choices:[{ t:"45°", ok:true, fb:"Right. `sin θ = cos θ` only at 45°." }, { t:"30°", fb:"`sin θ = cos θ` only at 45°." }, { t:"60°", fb:"`sin θ = cos θ` only at 45°." }, { t:"90°", fb:"`sin θ = cos θ` only at 45°." }] },
        { id:"q4", goal:4, prompt:"A sled is pulled with 50 N along a rope at 60° above the horizontal. What is the horizontal component?",
          choices:[{ t:"25 N", ok:true, fb:"Right. `50 cos 60° = 25` N." }, { t:"`25√3` N", fb:"That’s the vertical part." }, { t:"50 N", fb:"Only part of the pull is horizontal: use `50 cos 60°`." }, { t:"100 N", fb:"A component can’t be bigger than the force: use `50 cos 60°`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"balance", type:"sorter", title:"Balanced or not?", summary:"Balanced or not?", goal:[3, 5], noun:"set of forces",
        instruction:"Decide whether each set of forces on a ring is in equilibrium.",
        how:"Tap a set of forces, then tap the box it belongs in. Directions are counterclockwise from the positive `x`-axis.",
        boxes:[{ id:"b1", label:"In equilibrium" }, { id:"b2", label:"Not in equilibrium" }],
        wrongDefault:"Add the `x`-components and the `y`-components: both sums must be 0 for equilibrium.",
        items:[
          { id:"i1", t:"`(3, 4)` N and `(-3, -4)` N", answer:"b1", why:"Opposite forces cancel.", wrong:{ b2:"Add them: each component cancels." } },
          { id:"i2", t:"5 N at 0°, 5 N at 120°, 5 N at 240°", answer:"b1", why:"Equal forces 120° apart close an equilateral triangle.", wrong:{ b2:"Draw them tip to tail: three equal sides with equal turns close up." } },
          { id:"i3", t:"10 N at 0°, 10 N at 90°, 10 N at 225°", answer:"b2", why:"The first two make `10√2` N at 45°; a 10 N force can’t cancel it.",
            wrong:{ b1:"The directions look balanced, but the magnitudes don’t: the first two give `10√2` N." } },
          { id:"i4", t:"10 N at 0°, 10 N at 90°, `10√2` N at 225°", answer:"b1", why:"`10√2` N at 225° is exactly the equilibrant.", wrong:{ b2:"Find the resultant of the first two forces, then compare it with the third." } },
          { id:"i5", t:"`(2, 5)` N, `(-6, 1)` N, `(4, -6)` N", answer:"b1", why:"`x`: 2 − 6 + 4 = 0; `y`: 5 + 1 − 6 = 0.", wrong:{ b2:"Add the `x`-components, then the `y`-components." } },
          { id:"i6", t:"`(2, 5)` N, `(-6, 1)` N, `(4, -5)` N", answer:"b2", why:"The `y`-components add to 1.",
            wrong:{ b1:"Add the `y`-components: 5 + 1 − 5 = 1." } },
          { id:"i7", t:"3 N, 4 N and 8 N, in any directions", answer:"b2", why:"Three balanced forces form a triangle, but 3 + 4 < 8: the sides can’t meet.",
            wrong:{ b1:"Try to draw the triangle: the 3 N and 4 N sides can’t reach across 8 N." },
            hints:["Balanced forces close up tip to tail.", "Three forces close into a triangle.", "3 + 4 < 8, so no triangle exists."] },
          { id:"i8", t:"6 N at 30°, 6 N at 150°, 6 N at 270°", answer:"b1", why:"`x`: `3√3 - 3√3 + 0 = 0`; `y`: 3 + 3 − 6 = 0.", wrong:{ b2:"Add the `x`-components, then the `y`-components." },
            hints:["Add the `x`-components, then the `y`-components.", "`6 cos 30° + 6 cos 150° + 6 cos 270° = 3√3 - 3√3 + 0`.", "Both sums are 0: equilibrium."] }
        ] },
      { id:"resnum", type:"numeric", title:"Resultants and equilibrants", summary:"Resultants and equilibrants", goal:[2, 3, 5], star:true,
        instruction:"Find each magnitude or angle. Items 5 to 7 are non-routine; 6 and 7 go beyond the Final Check.",
        how:"Type a number, then press Check. Exact forms such as `3√19` (type sqrt for √) are fine.",
        items:[
          { id:"r1", goal:2, prompt:"Forces of 9 N and 12 N act at right angles. Magnitude of the resultant?", answer:15, unit:"N", display:"15 N",
            why:"`√(81 + 144) = √225 = 15`.", wrong:[{ match:21, fb:M1 }],
            hints:["Tip to tail the forces make a right triangle.", "`|vec{R}|^2 = 9^2 + 12^2`.", "`√225 = 15` N."] },
          { id:"r2", goal:2, prompt:"Forces of 11 N and 24 N act with 60° between them. Magnitude of the resultant?", answer:31, unit:"N", display:"31 N",
            why:"`121 + 576 + 2(11)(24) cos 60° = 697 + 264 = 961`.", wrong:[{ match:Math.sqrt(433), fb:"You used `- 2ab cos 60°`; tip to tail the angle is 120°." }],
            hints:["Use `|vec{R}|^2 = a^2 + b^2 + 2ab cos θ` with the angle between the forces.", "`121 + 576 + 264`.", "`√961 = 31` N."] },
          { id:"r3", goal:2, prompt:"Forces of 7 N and 40 N act with 120° between them. Magnitude of the resultant?", answer:37, unit:"N", display:"37 N",
            why:"`49 + 1600 + 2(7)(40) cos 120° = 1649 - 280 = 1369`.", wrong:[{ match:Math.sqrt(1929), fb:M2 }],
            hints:["`cos 120° = -1/2`.", "`49 + 1600 - 280`.", "`√1369 = 37` N."] },
          { id:"r4", goal:3, prompt:"Forces of 6 N and 10 N act with 60° between them. Magnitude of the equilibrant?", answer:14, unit:"N", display:"14 N",
            why:"Same magnitude as the resultant: 36 + 100 + 60 = 196.", wrong:[{ match:Math.sqrt(76), fb:M2 }, { match:16, fb:M1 }],
            hints:["The equilibrant has the same magnitude as the resultant.", "`36 + 100 + 2(6)(10) cos 60°`.", "`√196 = 14` N."] },
          { id:"r5", goal:5, star:true, prompt:"Forces of 5 N and `F` N act with 120° between them, and their resultant is 19 N. Find `F`.", answer:21, unit:"N", display:"`F = 21`",
            why:"`25 + F^2 - 5F = 361`, so `F^2 - 5F - 336 = 0 = (F - 21)(F + 16)`.", wrong:[{ match:-16, fb:"A magnitude can’t be negative: reject −16." }],
            hints:["Use `|vec{R}|^2 = a^2 + b^2 + 2ab cos θ`.", "`361 = 25 + F^2 - 5F`.", "`F = 21` (reject −16)."] },
          { id:"r6", goal:5, star:true, prompt:"Three forces of 7 N, 15 N and 13 N hold a ring in equilibrium. Find the angle between the 7 N and 15 N forces, in degrees.", answer:120, unit:"°", display:"120°",
            why:"`169 = 49 + 225 + 210 cos θ`, so `cos θ = -1/2` and `θ = 120°`.", wrong:[{ match:60, fb:"That’s the angle inside the triangle; the angle between the forces is its supplement." }],
            hints:["The 7 N and 15 N forces must have a resultant equal in size to the third force.", "`169 = 49 + 225 + 210 cos θ`.", "`cos θ = -1/2`, so `θ = 120°`."] },
          { id:"r7", goal:5, star:true, prompt:"Forces of 10 N, 10 N and `10√2` N hold a ring in equilibrium. Find the angle between the two 10 N forces, in degrees.", answer:90, unit:"°", display:"90°",
            why:"`(10√2)^2 = 100 + 100 + 200 cos θ`, so `cos θ = 0`.", wrong:[{ match:45, fb:"The two 10 N forces must have a resultant of `10√2` N. Solve for `θ` with the cosine law." }],
            hints:["The two 10 N forces must have a resultant of `10√2` N.", "`200 = 100 + 100 + 200 cos θ`.", "`cos θ = 0`, so `θ = 90°`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Oliver", goal:[1, 2, 4],
        instruction:"Oliver made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Find the resultant of 6 N east and 8 N north.",
            steps:["Draw the 6 N force east, then the 8 N force north from its tip.", "The resultant goes from the first tail to the last tip.", "Its magnitude is 6 + 8 = 14 N.", "Its direction is N `θ` E with `tan θ = 6/8`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4’s method is fine; the mistake is earlier."],
            fixes:[
              { t:"The triangle has a right angle, so `|vec{R}| = √(6^2 + 8^2) = 10` N.", ok:true, why:"Forces at right angles add by Pythagoras, not like numbers." },
              { t:"`|vec{R}| = 8 - 6 = 2` N.", why:"That’s for opposite forces." },
              { t:"`|vec{R}| = √(6 + 8) = √14` N.", why:"Square the sides first." },
              { t:"Step 3 is correct.", why:"Forces at right angles don’t add like numbers." }],
            hints:["Do the forces point the same way?", "They form a right triangle.", "`√100 = 10` N."] },
          { id:"e2", goal:2, task:"Forces of 9 N and 15 N act on a ring with 60° between them. Find the magnitude of the resultant.",
            steps:["Draw the forces tail to tail and complete the parallelogram.", "The resultant is the diagonal from the common tail.", "In the triangle formed, the angle opposite the resultant is 60°.", "`|vec{R}|^2 = 81 + 225 - 2(9)(15) cos 60° = 171`, so `|vec{R}| = 3√19` N."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 uses step 3’s angle correctly. The mistake is earlier."],
            fixes:[
              { t:"The triangle’s angle is 180° − 60° = 120°, so `|vec{R}|^2 = 306 + 135 = 441` and `|vec{R}| = 21` N.", ok:true, why:"Neighbouring angles in a parallelogram add to 180°." },
              { t:"The angle is 30°.", why:"Half the angle isn’t in the triangle." },
              { t:"Use `|vec{R}|^2 = 306 + 270 cos 120°`.", why:"That mixes the two forms and gives 171 again." },
              { t:"Step 3 is correct.", why:M2 }],
            hints:["In a parallelogram, neighbouring angles add to 180°.", "The triangle’s angle is 120°.", "`cos 120° = -1/2`: 306 + 135 = 441."] },
          { id:"e3", goal:4, task:"A 60 N crate rests on a frictionless 30° ramp. What force along the ramp holds it still?",
            steps:["The weight, 60 N, points straight down.", "Split the weight into parts along and into the ramp.", "The angle between the weight and the line into the ramp is 30°.", "So the part along the ramp is `60 cos 30° = 30√3` N.", "A force of `30√3` N up the ramp holds the crate."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct: it matches the ramp’s angle.", "", "Step 5 follows step 4. The mistake is earlier."],
            fixes:[
              { t:"The part along the ramp is opposite the 30° angle: `60 sin 30° = 30` N.", ok:true, why:"The side next to the 30° angle is the part into the ramp; the part along it is opposite." },
              { t:"`60 tan 30° = 20√3` N.", why:"Tangent compares two parts; it isn’t one of them." },
              { t:"60 N, the full weight.", why:"Only part of the weight acts along the ramp." },
              { t:"Step 4 is correct.", why:M6 }],
            hints:["Which side of the rectangle is next to the 30° angle?", "The part into the ramp is next to it.", "Along = `60 sin 30° = 30` N."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the force table: how fast the resultant shrank as the angle opened, or that a ‘balanced’ ring can have three big forces on it?" },
      { id:"j2", q:"In your own words, what is the difference between the resultant and the equilibrant?" },
      { id:"j3", q:"Explain to a friend how to find the part of a weight that pulls a box down a ramp, and why it’s sine and not cosine." },
      { id:"j4", q:"Which step still trips you up: the angle in the cosine law, or choosing sine or cosine? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:3,
        a:{ prompt:"The resultant of a set of forces is 12 N at 40° (counterclockwise from the positive `x`-axis). What is the equilibrant?", options:[
          { t:"12 N at 220°", ok:true, why:"Same size, opposite direction: 40° + 180°." },
          { t:"12 N at 40°", why:"That’s the resultant. " + M3 },
          { t:"12 N at 140°", why:"180° − 40° reflects the direction; it doesn’t reverse it." },
          { t:"12 N at 130°", why:"Adding 90° gives a perpendicular force." }] },
        b:{ prompt:"The resultant is 9 N at 150° (counterclockwise from the positive `x`-axis). What is the equilibrant?", options:[
          { t:"9 N at 330°", ok:true, why:"Same size, opposite direction: 150° + 180°." },
          { t:"9 N at 150°", why:"That’s the resultant. " + M3 },
          { t:"9 N at 30°", why:"180° − 150° reflects the direction; it doesn’t reverse it." },
          { t:"9 N at 240°", why:"Adding 90° gives a perpendicular force." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"Forces of 20 N and 21 N act on an object at right angles. What is the magnitude of the resultant?", options:[
          { t:"29 N", ok:true, why:"`√(400 + 441) = √841`." },
          { t:"41 N", why:M1 },
          { t:"1 N", why:"That’s for opposite forces." },
          { t:"`√41` N", why:"Square each force before adding." }] },
        b:{ prompt:"Forces of 12 N and 35 N act at right angles. Magnitude of the resultant?", options:[
          { t:"37 N", ok:true, why:"`√(144 + 1225) = √1369`." },
          { t:"47 N", why:M1 },
          { t:"23 N", why:"That’s for opposite forces." },
          { t:"`√47` N", why:"Square each force before adding." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"A force of 30 N acts at 60° above the horizontal. What are its horizontal and vertical components?", options:[
          { t:"`(15, 15√3)` N", ok:true, why:"`(30 cos 60°, 30 sin 60°)`." },
          { t:"`(15√3, 15)` N", why:M5 },
          { t:"`(30, 60)`", why:"Those are the magnitude and angle, not components." },
          { t:"`(15, 15)` N", why:"The two parts are equal only at 45°, and even then they’d be `15√2`." }] },
        b:{ prompt:"A force of 16 N acts at 30° above the horizontal. What are its horizontal and vertical components?", options:[
          { t:"`(8√3, 8)` N", ok:true, why:"`(16 cos 30°, 16 sin 30°)`." },
          { t:"`(8, 8√3)` N", why:M5 },
          { t:"`(16, 30)`", why:"Those are the magnitude and angle, not components." },
          { t:"`(8√3, 8√3)` N", why:"The two parts are equal only at 45°." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"Forces of 8 N and 15 N act on a ring with 120° between them. What is the magnitude of the resultant?", options:[
          { t:"13 N", ok:true, why:"`64 + 225 + 2(8)(15) cos 120° = 289 - 120 = 169`." },
          { t:"`√409` N", why:"Using 120° inside the tip-to-tail triangle adds 120 instead of subtracting it." },
          { t:"23 N", why:M1 },
          { t:"17 N", why:"That’s the right-angle answer; the forces are at 120°." }] },
        b:{ prompt:"Forces of 3 N and 8 N act with 120° between them. Magnitude of the resultant?", options:[
          { t:"7 N", ok:true, why:"`9 + 64 - 24 = 49`." },
          { t:"`√97` N", why:"Using 120° inside the tip-to-tail triangle adds 24 instead of subtracting it." },
          { t:"11 N", why:M1 },
          { t:"`√73` N", why:"That’s the right-angle answer; the forces are at 120°." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"A ring is held in equilibrium by three forces. Two of them are 7 N and 8 N, with 60° between them. What is the magnitude of the third force?", options:[
          { t:"13 N", ok:true, why:"The third force balances the other two, so it matches their resultant: 49 + 64 + 56 = 169." },
          { t:"`√57` N", why:M2 },
          { t:"15 N", why:M1 },
          { t:"0 N", why:"Equilibrium means the forces cancel, not that the third force is zero." }] },
        b:{ prompt:"Two of three balanced forces are 5 N and 8 N with 120° between them. Magnitude of the third?", options:[
          { t:"7 N", ok:true, why:"`25 + 64 - 40 = 49`." },
          { t:"`√129` N", why:M2 },
          { t:"13 N", why:M1 },
          { t:"0 N", why:"Equilibrium means the forces cancel, not that the third force is zero." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Forces of 3 N, 5 N and 7 N hold a ring in equilibrium. What is the angle between the 3 N and 5 N forces?", options:[
          { t:"60°", ok:true, why:"Their resultant must be 7 N: `49 = 9 + 25 + 30 cos θ`, so `cos θ = 1/2`." },
          { t:"120°", why:"That’s the angle inside the force triangle." },
          { t:"90°", why:"`3^2 + 5^2 = 34`, not 49: it isn’t a right angle." },
          { t:"180°", why:"Opposite forces would give a 2 N resultant, not 7 N." }] },
        b:{ prompt:"Forces of 7 N, 8 N and 13 N hold a ring in equilibrium. Angle between the 7 N and 8 N forces?", options:[
          { t:"60°", ok:true, why:"`169 = 49 + 64 + 112 cos θ`, so `cos θ = 1/2`." },
          { t:"120°", why:"That’s the angle inside the force triangle." },
          { t:"90°", why:"49 + 64 = 113, not 169." },
          { t:"0°", why:"Forces in a line would give 15 N, not 13 N." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which statement best describes equilibrium?", options:[
          { t:"The vector sum of all the forces is `vec{0}`; drawn tip to tail, the forces form a closed polygon.", ok:true, why:"Forces still act; they just cancel." },
          { t:"No forces act on the object.", why:M4 },
          { t:"All the forces have the same magnitude.", why:"Unequal forces can balance (3, 4 and 5 N, for example)." },
          { t:"The forces come in opposite pairs.", why:"Three forces at 120° balance with no opposite pairs." }] },
        b:{ prompt:"Which statement best describes the equilibrant of two forces?", options:[
          { t:"The single force with the same magnitude as their resultant and the opposite direction; adding it makes the net force `vec{0}`.", ok:true, why:"It cancels the resultant exactly." },
          { t:"The resultant of the two forces.", why:M3 },
          { t:"The larger of the two forces, reversed.", why:"It has to balance both forces, not one." },
          { t:"A force perpendicular to the resultant.", why:"A perpendicular force can’t cancel it." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which correctly describes how a weight `W` splits on a ramp at angle `θ`?", options:[
          { t:"Along the slope: `W sin θ`. Into the slope: `W cos θ`, because the angle between the weight and the line into the slope equals `θ`.", ok:true, why:"The part next to `θ` (into the slope) uses cosine." },
          { t:"Along the slope: `W cos θ`. Into the slope: `W sin θ`.", why:M6 },
          { t:"Along the slope: `W`. Into the slope: 0.", why:"The ramp takes part of the weight." },
          { t:"Along the slope: `W tan θ`. Into the slope: `W`.", why:"The parts must form a rectangle whose diagonal is `W`." }] },
        b:{ prompt:"Which best explains why a box slides more easily on a steeper frictionless ramp?", options:[
          { t:"The component of the weight along the slope, `W sin θ`, grows as `θ` grows.", ok:true, why:"`sin θ` increases from 0° to 90°." },
          { t:"The weight itself grows on a steeper ramp.", why:"The weight doesn’t change." },
          { t:"`W cos θ` grows as the ramp gets steeper.", why:M6 },
          { t:"Gravity points along the ramp.", why:"Gravity points straight down; only part of it acts along the ramp." }] } },
      { id:"a1", cat:"A", goal:[2, 5],
        a:{ prompt:"Two tow trucks pull a stuck car with forces of 3 kN and 5 kN. The angle between the cables is 60°. What is the magnitude of the combined pull?", options:[
          { t:"7 kN", ok:true, why:"`9 + 25 + 2(3)(5)(1/2) = 49`." },
          { t:"`√19` kN", why:M2 },
          { t:"8 kN", why:M1 },
          { t:"`√34` kN", why:"That ignores the angle (it’s the 90° answer)." }] },
        b:{ prompt:"Two tugboats pull a barge with 5 kN and 16 kN; the angle between the lines is 60°. What is the combined pull?", options:[
          { t:"19 kN", ok:true, why:"`25 + 256 + 80 = 361`." },
          { t:"`√201` kN", why:M2 },
          { t:"21 kN", why:M1 },
          { t:"`√281` kN", why:"That ignores the angle (it’s the 90° answer)." }] } },
      { id:"a2", cat:"A", goal:[4, 5],
        a:{ prompt:"A 50 N toboggan is held still on a frictionless 30° hill by a rope parallel to the slope. What are the rope’s tension and the push of the snow (perpendicular to the slope)?", options:[
          { t:"Rope 25 N; snow `25√3` N", ok:true, why:"Rope = `50 sin 30°`; snow = `50 cos 30°`." },
          { t:"Rope `25√3` N; snow 25 N", why:M6 },
          { t:"Rope 50 N; snow 0 N", why:"The snow holds up part of the weight." },
          { t:"Rope 25 N; snow 25 N", why:"The two parts are equal only at 45°." }] },
        b:{ prompt:"An 80 N sled is held on a frictionless 60° slope by a rope parallel to the slope. What are the rope tension and the snow’s push?", options:[
          { t:"Rope `40√3` N; snow 40 N", ok:true, why:"Rope = `80 sin 60°`; snow = `80 cos 60°`." },
          { t:"Rope 40 N; snow `40√3` N", why:M6 },
          { t:"Rope 80 N; snow 0 N", why:"The snow holds up part of the weight." },
          { t:"Rope `40√3` N; snow `40√3` N", why:"The two parts are equal only at 45°." }] } }
    ]
  },
  task:{
    title:"Hang the weight", summary:"Hang the weight",
    statement:"<p>A weight hangs from a ring held by two ropes. Design the rope forces so that every condition is met. There’s more than one answer: can you find a lopsided one?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>The three forces balance (net force `vec{0}`).</li><li>Both ropes pull upward.</li><li>The ropes pull to opposite sides (neither hangs straight up).</li><li>Both rope tensions are whole numbers of newtons.</li><li>The weight is between 10 N and 20 N.</li></ol></div>" +
      "<p class=\"tiny muted\">Enter each rope’s components `(a, b)` in newtons (whole numbers from −20 to 20) and the weight `w` (a whole number from 1 to 20). The weight is `(0, -w)`.</p>",
    checks:["Net force is `vec{0}`", "Both ropes pull upward", "Ropes pull to opposite sides", "Whole-number tensions", "Weight from 10 N to 20 N"],
    tips:["Add the `x`-components and the `y`-components of all three forces: both sums must be 0.",
      "A rope can only pull, and here both must lift: make each `y`-component positive.",
      "If `a_1 = 0` both ropes hang vertically; spread them apart.",
      "Use Pythagorean triples for each rope: (6, 8) → 10, (5, 12) → 13, (8, 15) → 17.",
      "The weight equals `b_1 + b_2`."],
    explainPrompt:"Explain how you made the horizontal and vertical parts balance, and how you made the tensions whole numbers.",
    vocab:"Use the words component, equilibrium, resultant and tension.",
    more:"There’s more than one answer. Can you find a lopsided one?",
    after3:"The lopsided design works because 12 belongs to two triples: 5-12-13 and 9-12-15. The horizontal parts must match exactly, so both ropes need the same horizontal component.",
    labels:{ r1:"Rope 1", r2:"Rope 2", w:"Weight `w`", a:"`a`", b:"`b`", tension:"Tension", weightRow:"Weight", net:"Net force",
      range:"Use whole numbers: rope components from −20 to 20, and the weight from 1 to 20.", fill:"Fill in all five boxes." }
  },
  cards:[
    ["Force as a vector", "Magnitude in newtons (N) plus a direction. Forces add tip to tail."],
    ["Resultant", "The single force with the same effect as all the forces together: their vector sum."],
    ["Equilibrium", "Net force `vec{0}`: the forces close up tip to tail. Forces still act."],
    ["Equilibrant", "Same magnitude as the resultant, opposite direction (add 180°)."],
    ["Two forces, angle `θ` between them", "`|vec{R}|^2 = a^2 + b^2 + 2ab cos θ`"],
    ["The tip-to-tail triangle", "Its angle opposite the resultant is 180° − `θ`."],
    ["At right angles", "`|vec{R}| = √(a^2 + b^2)`; e.g. 9 N and 12 N give 15 N."],
    ["Components of a force", "`(F cos θ, F sin θ)` for `θ` measured from the positive `x`-axis."],
    ["Weight on a ramp at angle `θ`", "Along the slope `W sin θ`; into the slope `W cos θ`."],
    ["Three balanced forces", "They form a triangle, so each magnitude is less than the sum of the other two."],
    ["Equal forces in equilibrium", "Three equal forces balance when they’re 120° apart."],
    ["Balancing with components", "Σ(`x`-components) = 0 and Σ(`y`-components) = 0."]
  ]
};
