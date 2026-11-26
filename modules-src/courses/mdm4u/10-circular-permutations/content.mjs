// MDM4U 10 Circular Permutations. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/10-circular-permutations.md
// Core feedback sentences for the plan's misconceptions (§3), adapted to each item.
const M1 = "Rotate the table: everyone keeps the same neighbours. Divide by the `n` rotations.";
const M2 = "People facing inward can’t be flipped: reversing the order swaps everyone’s left and right.";
const M3 = "Numbered seats are different seats, so rotations are different: `n!`.";
const M4 = "A ring can be turned over, which makes mirror images the same: divide by 2 as well.";
const M5 = "With the block as one unit there are `m` units around the circle: `(m - 1)!` × (orders inside the block).";

// Numbers of five or more digits get a narrow no-break space as the thousands separator (40 320).
const NS = " ";
function thin(o){
  if (typeof o === "string") { let s = o, t; do { t = s; s = s.replace(/(\d) (?=\d{3}(?!\d))/g, "$1" + NS); } while (s !== t); return s; }
  if (Array.isArray(o)) return o.map(thin);
  if (o && typeof o === "object") { const r = {}; for (const k of Object.keys(o)) r[k] = k === "id" ? o[k] : thin(o[k]); return r; }
  return o;
}

// Which formula? hints: 1 and 2 are the same for every item; 3 is the answer with its reason.
const FH = (last) => ["Can you rotate it without changing it?", "Can you flip it over without changing it?", last];
const BOX = { r:"`(n - 1)!`", f:"`(n - 1)!/2`", l:"`n!`" };

export default thin({
  id:"10-circular-permutations",
  kind:"topic",
  title:"Circular permutations",
  topic:"Circular Permutations",
  readyTopic:"circular permutations",
  hero:{
    eq:'<span class="cir-heq"><span class="cir-heq-t">around a circle:</span> `(n - 1)!`</span>', eqLabel:"Around a circle: n minus 1, factorial", eqSize:"md",
    headline:"Turn the table: nothing changes",
    text:"Four friends sit at a round table. Spin the table a quarter turn and everyone still has the same neighbours, so it’s the <strong>same seating</strong>. Each seating appears 4 times among the `4! = 24` line-ups: 24 ÷ 4 = <strong>`3! = 6`</strong>. For a necklace that can also be <strong>flipped</strong>, divide by 2 more.",
    fig:{ html:'<div class="cir-h" role="img" aria-label="Four tokens, A, B, C and D, sit around a round table. The table turns a quarter turn three times. Each time, the line-up read clockwise from the top seat appears beside it: ABCD, BCDA, CDAB, DABC. The four line-ups slide into one stack labelled same circle, and a counter shows 24 ÷ 4 = 6.">' +
      '<div class="cir-h-tbl" id="cir-h-tbl" aria-hidden="true"></div><div class="cir-h-side" aria-hidden="true"><ol class="cir-h-ups" id="cir-h-ups"></ol><p class="cir-h-lab" id="cir-h-lab"></p></div>' +
      '<p class="cir-h-ctr" id="cir-h-ctr" aria-hidden="true"></p></div>' }
  },
  goals:[
    "I can explain why rotations of a circular arrangement count as the same and use `(n - 1)!`.",
    "I can decide whether a situation is a round table, a flippable ring, or a line with labelled seats.",
    "I can count flippable rings (necklaces, key rings) using `(n - 1)!/2`.",
    "I can count circular arrangements with “together”, “apart” or “between” restrictions.",
    "I can solve circular-arrangement problems in context."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Factorials", goal:1, prompt:"Evaluate `5!/5`.",
          options:[
            { t:"24", ok:true, why:"120 ÷ 5 = 24 = `4!`." },
            { t:"1", why:"`5!` doesn’t cancel with 5: `5! = 120`, and 120 ÷ 5 = 24." },
            { t:"120", why:"That ignores the ÷ 5." },
            { t:"4", why:"`5!/5 = 4!`, not 4." }],
          hints:["`5! = 120`.", "120 ÷ 5.", "24."] },
        { id:"w2", skill:"Factorials", goal:1, prompt:"Evaluate `(6 - 1)!`.",
          options:[
            { t:"120", ok:true, why:"`5! = 120`." },
            { t:"719", why:"That’s `6! - 1`. Work out the bracket first." },
            { t:"5", why:"Don’t drop the “!”." },
            { t:"720", why:"That’s `6!`." }],
          hints:["Work out the bracket first.", "`5!`.", "120."] },
        { id:"w3", skill:"Linear permutations", goal:2, prompt:"In how many ways can 4 people line up?",
          options:[
            { t:"24", ok:true, why:"4 × 3 × 2 × 1 = 24." },
            { t:"6", why:"That’s `3!`." },
            { t:"16", why:"That’s 4 × 4, which reuses people." },
            { t:"4", why:"4 is the number of people, not the number of line-ups." }],
          hints:["4 × 3 × 2 × 1.", "24.", "24."] },
        { id:"w4", skill:"Linear permutations", goal:2, prompt:"Evaluate `P(6, 6)` ÷ 6.",
          options:[
            { t:"120", ok:true, why:"720 ÷ 6." },
            { t:"720", why:"That’s `P(6, 6)` before dividing by 6." },
            { t:"1", why:"`P(6, 6) = 6! = 720`, not 6." },
            { t:"6", why:"`P(6, 6) = 6! = 720`, so 720 ÷ 6." }],
          hints:["`P(6, 6) = 6!`.", "720 ÷ 6.", "120."] },
        { id:"w5", skill:"Together and apart", goal:4, prompt:"5 people in a line, two particular people together. How many line-ups?",
          options:[
            { t:"48", ok:true, why:"`4! × 2!`." },
            { t:"24", why:"You forgot the order inside the block: × 2." },
            { t:"120", why:"That ignores the rule." },
            { t:"72", why:"That’s “apart”." }],
          hints:["Block the pair.", "4 items: `4!`.", "× `2!` = 48."] },
        { id:"w6", skill:"Together and apart", goal:4, prompt:"5 people in a line, two particular people apart. How many line-ups?",
          options:[
            { t:"72", ok:true, why:"120 − 48." },
            { t:"48", why:"That’s “together”." },
            { t:"96", why:"That’s 120 − 24: together is 48, not 24." },
            { t:"24", why:"Apart is total − together: 120 − 48." }],
          hints:["Total − together.", "120 − 48.", "72."] }
      ],
      refreshers:{
        "Factorials":"`n!/n = (n - 1)!`. For example, `5!/5 = 4! = 24`.",
        "Linear permutations":"`n` different objects in a line: `n!`.",
        "Together and apart":"Together: block × orders inside. Apart: total − together."
      }
    }
  },
  explore:{
    heading:"Round table",
    intro:"Seat people around a circle and rotate the table. Switch to a ring that can flip, or to numbered seats, and watch the count change.",
    predIntro:"Make a prediction first. Then the round table will show you what really happens.",
    predictions:[
      { id:"p1", start:{ setting:"table", n:4 },
        prompt:"How many different seatings of 4 friends?",
        options:[{ t:"6", ok:true }, { t:"24" }, { t:"3" }, { t:"4" }],
        explain:"24 line-ups in groups of 4 rotations: 6." },
      { id:"p2", start:{ setting:"ring", n:4 },
        prompt:"How many different bracelets?",
        options:[{ t:"3", ok:true }, { t:"6" }, { t:"24" }, { t:"12" }],
        explain:"Flipping makes mirror images the same: 6 ÷ 2 = 3." },
      { id:"p3", start:{ setting:"numbered", n:4 },
        prompt:"Seats are numbered 1–4 around the table. How many seatings?",
        options:[{ t:"24", ok:true }, { t:"6" }, { t:"3" }, { t:"4" }],
        explain:"Seat 1 is a particular seat, so a rotation puts people in different numbered seats: `4!`." },
      { id:"p4", start:{ setting:"table", n:6, chips:["tog"] },
        prompt:"How many seatings?",
        options:[{ t:"48", ok:true }, { t:"24" }, { t:"240" }, { t:"72" }],
        explain:"The block plus 4 others makes 5 units around the circle: `(5 - 1)! = 24`, × 2 orders inside the block = 48." }
    ],
    chalIntro:"Set up the round table, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Round table: set `n` so there are exactly 120 different seatings.",
        why:"`(6 - 1)! = 5! = 120`.",
        hints:["`(n - 1)! = 120`.", "`120 = 5!`.", "`n - 1 = 5`, so `n = 6`."] },
      { id:"tc2", goal:3, prompt:"Ring setting: set `n` so there are exactly 60 different necklaces.",
        why:"`(6 - 1)!/2 = 120/2 = 60`.",
        hints:["`(n - 1)!/2 = 60`.", "`(n - 1)! = 120`.", "`n = 6`."] },
      { id:"tc3", goal:4, stretch:true, prompt:"Round table, `n = 8`: Kai and Lee must <strong>not</strong> sit side by side, and Mo must sit <strong>directly opposite</strong> Kai. Lock Kai, then count. <span class=\"tiny muted\">(In the tool, Kai is A, Lee is B and Mo is C. Type your count in <strong>Your count</strong>, then press Check challenge.)</span>",
        why:"Kai locked: Mo has 1 seat, Lee 4, and the other 5 people fill 5 seats in `5! = 120` ways: 4 × 120 = 480. The tool agrees: with `n = 8`, “A and B apart” and “C directly opposite A”, listing every seating gives 480.",
        hints:["Lock Kai. Mo now has exactly 1 seat, opposite.", "Lee can’t sit in the 2 seats beside Kai or in Mo’s seat: 4 seats remain for Lee.", "The other 5 people fill 5 seats: `5! = 120`. 4 × 120 = 480."] }
    ],
    blocks:[
      { title:"About circles", html:"<p>Every problem in this module names its setting, because the setting decides what counts as “the same”.</p><ul>" +
        "<li><strong>Round table (people):</strong> only who sits beside whom matters, so rotations are the same: `(n - 1)!`. People face inward and can’t be flipped: clockwise and counterclockwise orders give everyone different left and right neighbours.</li>" +
        "<li><strong>Ring that can flip</strong> (bracelet, necklace, key ring): it can be turned over, so mirror images are the same too: `(n - 1)!/2` for `n ≥ 3`.</li>" +
        "<li><strong>Carousel:</strong> it turns but is only ever seen from one side, so it isn’t flipped: `(n - 1)!`.</li>" +
        "<li><strong>Numbered seats</strong> (or one special seat): rotations put people in different seats, so it’s a line again: `n!`.</li></ul>" }
    ]
  },
  part3:{
    slug:"restrictions", name:"Restrictions",
    heading:"Circular with restrictions",
    intro:"Fix a reference person first, then use 09’s strategies: a block for “together”, total − together for “apart”, and filling each type’s seats for alternating. Place the tokens on the table one at a time and watch the choices multiply. Then check a small case by listing every circle.",
    quickCheck:{
      title:"Quick check", summary:"Circular with restrictions quick check",
      items:[
        { id:"q1", goal:4, prompt:"5 people at a round table, 2 together?",
          choices:[
            { t:"12", ok:true, fb:"Right. 4 units around the circle: `3! × 2 = 12`." },
            { t:"24", fb:"4 units around the circle: `3! × 2 = 12`." },
            { t:"6", fb:"4 units around the circle: `3! × 2 = 12`." },
            { t:"48", fb:"4 units around the circle: `3! × 2 = 12`." }] },
        { id:"q2", goal:4, prompt:"6 people at a round table, 2 apart?",
          choices:[
            { t:"72", ok:true, fb:"Right. Total `5! = 120`, together 48: 120 − 48 = 72." },
            { t:"48", fb:"120 − 48 = 72." },
            { t:"120", fb:"120 − 48 = 72." },
            { t:"96", fb:"120 − 48 = 72." }] },
        { id:"q3", goal:3, prompt:"A key ring with 5 different keys?",
          choices:[
            { t:"12", ok:true, fb:"Right. `4!/2 = 12`: a key ring can be turned over." },
            { t:"24", fb:"`4!/2 = 12`." },
            { t:"120", fb:"`4!/2 = 12`." },
            { t:"60", fb:"`4!/2 = 12`." }] },
        { id:"q4", goal:2, prompt:"Which is <strong>not</strong> a circular arrangement in this module’s sense?",
          choices:[
            { t:"Runners in lanes 1–8", ok:true, fb:"Right. Lanes are numbered: that’s a line, `n!`." },
            { t:"Friends around a campfire", fb:"Lanes are numbered: that’s a line, `n!`." },
            { t:"Beads on a bracelet", fb:"Lanes are numbered: that’s a line, `n!`." },
            { t:"Keys on a ring", fb:"Lanes are numbered: that’s a line, `n!`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"formula", type:"sorter", title:"Which formula?", summary:"Which formula?", goal:2, noun:"arrangement", txt:true,
        instruction:"Decide which formula counts each arrangement.",
        how:"Tap an arrangement, then tap the formula that counts it.",
        boxes:[{ id:"r", label:BOX.r }, { id:"f", label:BOX.f }, { id:"l", label:BOX.l }],
        items:[
          { id:"i1", t:"6 friends at a round café table", answer:"r", why:"Rotations are the same, but people can’t be flipped.",
            wrong:{ f:"People at a table can’t be flipped: reversing the order swaps everyone’s left and right.", l:"No seat is special, so rotations are the same." },
            hints:FH("`(n - 1)!`: rotations are the same, and people facing inward can’t be flipped.") },
          { id:"i2", t:"6 different beads on a bracelet", answer:"f", why:"Rotate it or turn it over: it’s the same bracelet.",
            wrong:{ r:"Turn the bracelet over: it’s the same bracelet.", l:"A bracelet has no first bead: rotations are the same." },
            hints:FH("`(n - 1)!/2`: a bracelet can be rotated and turned over.") },
          { id:"i3", t:"6 people on chairs numbered 1–6 around a table", answer:"l", why:"Numbered chairs make every rotation a different seating.",
            wrong:{ r:"Numbered chairs make rotations different.", f:"Numbered chairs make rotations different, and people can’t be flipped." },
            hints:FH("`n!`: numbered chairs make it a line.") },
          { id:"i4", t:"5 different horses on a carousel (it only turns one way)", answer:"r", why:"A carousel turns, so rotations are the same, but it’s never turned over.",
            wrong:{ f:"A carousel can’t be flipped over: riders always see it from one side.", l:"A carousel has no first horse: turning it doesn’t change the order." },
            hints:FH("`(n - 1)!`: it rotates but can’t be flipped.") },
          { id:"i5", t:"7 different keys on a key ring", answer:"f", why:"Rotate the ring or turn it over: same key ring.",
            wrong:{ r:"A key ring can be turned over: divide by 2 as well.", l:"A key ring has no first key: rotations are the same." },
            hints:FH("`(n - 1)!/2`: a key ring can be rotated and turned over.") },
          { id:"i6", t:"8 runners in lanes 1–8", answer:"l", why:"Lanes are numbered: that’s a line.",
            wrong:{ r:"Lanes are numbered: that’s a line, `n!`.", f:"Lanes are numbered: that’s a line, `n!`." },
            hints:FH("`n!`: numbered lanes make it a line.") },
          { id:"i7", t:"5 dancers holding hands in a circle, facing in", answer:"r", why:"Rotations are the same; dancers facing in can’t be flipped.",
            wrong:{ f:"Dancers facing in can’t be flipped: reversing the order swaps everyone’s left and right.", l:"No place in the circle is special, so rotations are the same." },
            hints:FH("`(n - 1)!`: rotations are the same, and dancers facing in can’t be flipped.") },
          { id:"i8", t:"6 different charms on a necklace", answer:"f", why:"Rotate it or turn it over: same necklace.",
            wrong:{ r:"Turn the necklace over: it’s the same necklace.", l:"A necklace has no first charm: rotations are the same." },
            hints:FH("`(n - 1)!/2`: a necklace can be rotated and turned over.") }
        ] },
      { id:"counts", type:"numeric", title:"Circular counts", summary:"Circular counts", star:true, goal:[1, 3, 4, 5],
        instruction:"Fix one person first, then count. The ★ problems go beyond the usual questions; the last two are harder than the Final Check.",
        how:"Type a whole number, then press Check.",
        items:[
          { id:"c1", goal:1, prompt:"8 people at a round table", answer:5040, display:"5040",
            why:"`(8 - 1)! = 7! = 5040`.",
            wrong:[{ match:40320, fb:"Divide by the 8 rotations." }],
            hints:["Rotations of a round table are the same seating.", "`(n - 1)!` with `n = 8`.", "`7! = 5040`."] },
          { id:"c2", goal:4, prompt:"8 people at a round table; the host and the guest of honour sit together", answer:1440, display:"1440",
            why:"7 units around the circle: `(7 - 1)! = 720`, × 2 for their order = 1440.",
            wrong:[{ match:720, fb:"× 2 for their order." }],
            hints:["Glue the host and the guest of honour into one block.", "7 units around the circle: `(7 - 1)! = 720`.", "× 2 for their order: 1440."] },
          { id:"c3", goal:4, star:true, prompt:"8 people at a round table; two particular people sit apart", answer:3600, display:"3600",
            why:"Total − together: 5040 − 1440 = 3600.",
            general:"5040 − 1440.",
            hints:["Total − together.", "Total `7! = 5040`; together 1440.", "5040 − 1440 = 3600."] },
          { id:"c4", goal:[4, 5], star:true, prompt:"4 couples at a round table, each couple together", answer:96, display:"96",
            why:"4 blocks around the circle: `(4 - 1)! = 6`; each couple sits 2 ways: 6 × `2^4` = 96.",
            wrong:[{ match:6, fb:"Each couple can sit 2 ways: × `2^4` = 16." }],
            hints:["Each couple is a block: 4 blocks around the circle.", "`(4 - 1)! = 6` for the blocks.", "Each block has 2 orders: 6 × 2 × 2 × 2 × 2 = 96."] },
          { id:"c5", goal:[3, 4], star:true, prompt:"A bracelet with 7 different beads where the red and blue beads touch", answer:120, display:"120",
            why:"6 units: `(6 - 1)! × 2 = 240` on a table; a bracelet can flip, so 240 ÷ 2 = 120.",
            wrong:[{ match:240, fb:"A bracelet can flip: divide by 2." }],
            hints:["Glue the red and blue beads into one block: 6 units.", "On a table: `(6 - 1)! × 2 = 240`.", "A bracelet can flip: 240 ÷ 2 = 120."] },
          { id:"c6", goal:5, star:true, prompt:"5 teachers and 5 students around a table, alternating", answer:2880, display:"2880",
            why:"Fix one teacher: the other 4 teachers take every second seat in `4!` ways and the students fill the gaps in `5!`: 24 × 120 = 2880.",
            wrong:[{ match:14400, fb:"Fix one teacher first: `4! × 5!`." }],
            hints:["Fix one teacher.", "The other 4 teachers take every second seat: `4!`.", "The students fill the 5 gaps: `5!`. 24 × 120 = 2880."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Jude", how:"", goal:[1, 3, 4],
        instruction:"Jude made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Seat 6 friends at a round table.",
            steps:["In a line there are `6! = 720` orders.", "A round table has no first seat, so divide by 2.", "720 ÷ 2 = 360."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"Each seating appears 6 times (once per rotation), so divide by 6: 720 ÷ 6 = 120.", ok:true, why:"Rotating gives 6 line-ups with the same neighbours, so 720 ÷ 6 = 120 = `5!`." },
              { t:"Divide by 12.", why:"People at a table can’t be flipped." },
              { t:"Keep 720.", why:"Rotate the table: everyone keeps the same neighbours. Divide by the 6 rotations." },
              { t:"Step 2 is correct.", why:"Rotating gives 6 equivalent line-ups, not 2." }],
            hints:["How many rotations give the same seating?", "6.", "120."] },
          { id:"e2", goal:3, task:"How many necklaces with 6 different beads?",
            steps:["Fix one bead to remove rotations.", "Arrange the other 5: `5! = 120`.", "So there are 120 necklaces."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"A necklace can be flipped, so mirror images match: 120 ÷ 2 = 60.", ok:true, why:"Turning a necklace over gives the same necklace, so the 120 pair up: 60." },
              { t:"120 × 2 = 240.", why:"Flipping makes arrangements equal, so divide." },
              { t:"`6! = 720`.", why:"Fixing one bead already removed the rotations. " + M1.replace("`n`", "6") },
              { t:"Step 3 is correct.", why:"Turn the necklace over: same necklace." }],
            hints:["Can a necklace be turned over?", "Yes.", "60."] },
          { id:"e3", goal:4, task:"7 people at a round table; Ana and Bo sit together.",
            steps:["Glue Ana and Bo into one unit: 6 units.", "Arrange 6 units around the table: `6! = 720`.", "× 2 for Ana–Bo order: 1440."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"6 units around a circle: `(6 - 1)! = 120`; × 2 = 240.", ok:true, why:"Units around a circle: `(m - 1)!`, then × 2 for the order inside the block." },
              { t:"`(7 - 1)! = 720`.", why:"That ignores the block." },
              { t:"`5! = 120` with no × 2.", why:"Ana and Bo can switch." },
              { t:"Step 2 is correct.", why:"Circles divide out rotations: `(6 - 1)!`." }],
            hints:["How do you arrange `m` units in a circle?", "`(m - 1)!`.", "120 × 2 = 240."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you: that a table of people can’t be flipped, or that numbered seats make it a line again?" },
      { id:"j2", q:"In your own words, explain why a circle of `n` has `(n - 1)!` arrangements." },
      { id:"j3", q:"Explain to a friend how you’d seat 4 couples together at a round table." },
      { id:"j4", q:"Which setting (table, ring or numbered seats) do you still mix up? How will you decide next time?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"In how many ways can 7 people sit at a round table?", options:[
          { t:"720", ok:true, why:"`(7 - 1)! = 720`." },
          { t:"5040", why:"Rotations are the same seating." },
          { t:"360", why:"A table of people can’t be flipped." },
          { t:"6", why:"`(7 - 1)! = 6!`, not 6." }] },
        b:{ prompt:"In how many ways can 5 people sit at a round table?", options:[
          { t:"24", ok:true, why:"`4! = 24`." },
          { t:"120", why:M1.replace("`n`", "5") },
          { t:"12", why:M2 },
          { t:"4", why:"`(5 - 1)! = 4!`, not 4." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"How many different key rings can hold 6 different keys?", options:[
          { t:"60", ok:true, why:"`5!/2 = 60`." },
          { t:"120", why:"A key ring can be flipped." },
          { t:"720", why:"A key ring has no first key: rotations are the same, and it can be flipped too." },
          { t:"360", why:"`6!/2` still counts rotations." }] },
        b:{ prompt:"How many different bracelets can be made from 5 different beads?", options:[
          { t:"12", ok:true, why:"`4!/2 = 12`." },
          { t:"24", why:M4 },
          { t:"120", why:"A bracelet has no first bead: rotations are the same, and it can be flipped too." },
          { t:"60", why:"`5!/2` still counts rotations." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"Which situation is counted with `n!`, not `(n - 1)!`?", options:[
          { t:"8 guests at a round table with seats numbered 1 to 8", ok:true, why:"Numbered seats make rotations different." },
          { t:"8 children holding hands in a ring", why:"No place in the ring is numbered, so rotations are the same: `(n - 1)!`." },
          { t:"8 different beads on a bracelet", why:"That’s `(n - 1)!/2`." },
          { t:"8 people at a round table", why:"No seat is numbered, so rotations are the same: `(n - 1)!`." }] },
        b:{ prompt:"Which situation is counted with `(n - 1)!/2`?", options:[
          { t:"Charms on a bracelet", ok:true, why:"A bracelet can be rotated and turned over." },
          { t:"People at a round table", why:M2 },
          { t:"Chairs numbered around a table", why:"Numbered chairs make rotations different: `n!`." },
          { t:"Horses on a carousel", why:"A carousel isn’t flipped." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"8 people sit at a round table; Ana and Bo must sit together. How many seatings?", options:[
          { t:"1440", ok:true, why:"7 units: `(7 - 1)! × 2 = 1440`." },
          { t:"720", why:"× 2 for their order." },
          { t:"10 080", why:"`7! × 2` treats the circle as a line." },
          { t:"3600", why:"That’s “apart”." }] },
        b:{ prompt:"8 people sit at a round table; Ana and Bo must <strong>not</strong> sit together. How many seatings?", options:[
          { t:"3600", ok:true, why:"5040 − 1440." },
          { t:"1440", why:"That’s “together”." },
          { t:"4320", why:"Together is 1440, not 720." },
          { t:"5040", why:"That ignores the rule." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"6 people sit at a round table. Ana’s two neighbours must be Bo and Cy. How many seatings?", options:[
          { t:"12", ok:true, why:"Fix Ana; Bo and Cy sit on either side (2 ways); the other 3 fill 3 seats (`3!`). 2 × 6 = 12." },
          { t:"24", why:"Bo and Cy can swap sides, but the rest only fill 3 seats." },
          { t:"48", why:"That’s just Ana and Bo together." },
          { t:"6", why:"Bo and Cy can switch sides." }] },
        b:{ prompt:"7 people sit at a round table. Kai must sit between Lee and Mo. How many seatings?", options:[
          { t:"48", ok:true, why:"Fix Kai; Lee and Mo on either side (2); the other 4 in `4! = 24`. 2 × 24 = 48." },
          { t:"24", why:"Lee and Mo can switch." },
          { t:"96", why:"Kai is fixed as the reference, so don’t multiply by more." },
          { t:"120", why:"That ignores the rule." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"A charm bracelet has 6 different charms. The heart and the star must touch. How many bracelets?", options:[
          { t:"24", ok:true, why:"5 units: `(5 - 1)! × 2 = 48` seatings on a table; a bracelet flips, so 48 ÷ 2 = 24." },
          { t:"48", why:"A bracelet can flip." },
          { t:"240", why:"That’s a line." },
          { t:"12", why:"Keep the × 2 for the heart–star order." }] },
        b:{ prompt:"A bracelet has 7 different charms; the moon and the sun must touch. How many bracelets?", options:[
          { t:"120", ok:true, why:"6 units: `5! × 2 = 240`; ÷ 2 for flipping = 120." },
          { t:"240", why:"A bracelet can flip: divide by 2." },
          { t:"1440", why:"That’s a line." },
          { t:"60", why:"Keep the × 2 for the order." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why 5 people at a round table give `4!` seatings?", options:[
          { t:"Each seating can be rotated 5 ways without changing who sits beside whom, so the `5!` line-ups come in groups of 5: `5!/5 = 4!`.", ok:true, why:"It explains where the division by 5 comes from: the 5 rotations." },
          { t:"Because one person has to stand.", why:"Everyone sits." },
          { t:"Because a table has 4 sides.", why:"The table’s shape doesn’t decide it." },
          { t:"Because you divide by 2 for clockwise and counterclockwise.", why:M2 }] },
        b:{ prompt:"Which is the best explanation of why 5 different beads make `4!/2` necklaces?", options:[
          { t:"Rotating a necklace doesn’t change it (÷ 5 from `5!`), and turning it over doesn’t either (÷ 2).", ok:true, why:"It names both symmetries: rotations and flips." },
          { t:"Because necklaces have a clasp.", why:"The clasp isn’t part of the count." },
          { t:"Because there are 2 ends.", why:"A necklace has no ends." },
          { t:"Because the beads are identical.", why:"The beads are different." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which work is correct for 6 people on chairs numbered 1 to 6 around a table?", options:[
          { t:"The seats are different, so it’s like a line: `6! = 720`.", ok:true, why:"Numbered chairs make every rotation a different seating." },
          { t:"`(6 - 1)! = 120`.", why:"Numbered seats are different seats, so rotations are different: `6!`." },
          { t:"`(6 - 1)!/2 = 60`.", why:"Numbered chairs make rotations different, and people can’t be flipped." },
          { t:"`6!/2 = 360`.", why:"People can’t be flipped, so don’t divide by 2." }] },
        b:{ prompt:"Which work is correct for 6 friends at a café’s round table?", options:[
          { t:"`(6 - 1)! = 120`", ok:true, why:"Rotations are the same, and people can’t be flipped." },
          { t:"`6! = 720`.", why:M1.replace("`n`", "6") },
          { t:"120 ÷ 2 = 60.", why:M2 },
          { t:"`6!/6! = 1`.", why:"Only rotations are removed." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"7 children join hands in a circle, facing in, for a game. In how many different orders can they stand?", options:[
          { t:"720", ok:true, why:"`(7 - 1)! = 720`." },
          { t:"5040", why:M1.replace("`n`", "7").replace("table", "circle") },
          { t:"360", why:"Children facing in can’t be flipped." },
          { t:"7", why:"7 is the number of rotations, not the number of orders." }] },
        b:{ prompt:"A carousel has 6 different animals fixed in a ring. In how many orders could they be mounted?", options:[
          { t:"120", ok:true, why:"`(6 - 1)! = 120`." },
          { t:"720", why:"Turning the carousel doesn’t change the order. Divide by the 6 rotations." },
          { t:"60", why:"A carousel isn’t flipped." },
          { t:"6", why:"6 is the number of rotations, not the number of orders." }] } },
      { id:"a2", cat:"A", goal:[4, 5],
        a:{ prompt:"A planning committee of 5 students and 2 teachers sits at a round table. The teachers must <strong>not</strong> sit next to each other. How many seatings?", options:[
          { t:"480", ok:true, why:"Total `(7 - 1)! = 720`; together: 6 units, `5! × 2 = 240`; 720 − 240 = 480." },
          { t:"240", why:"That’s “together”." },
          { t:"3600", why:"`7! - 6! × 2` treats the table as a line." },
          { t:"600", why:"Together is 240, not 120." }] },
        b:{ prompt:"6 students and 2 teachers sit at a round table; the teachers <strong>must</strong> sit together. How many seatings?", options:[
          { t:"1440", ok:true, why:"7 units: `6! × 2 = 1440`." },
          { t:"720", why:M5.replace("`m`", "7").replace("`(m - 1)!`", "`(7 - 1)!`") },
          { t:"10 080", why:"`7! × 2` treats the circle as a line." },
          { t:"3600", why:"That’s “apart”." }] } }
    ]
  },
  task:{
    title:"Table planner", summary:"Table planner",
    statement:"<p>Plan a round-table seating. Choose how many guests (`n`) and which rules apply. Meet every condition. Can you find all the answers?</p>" +
      '<p class="cir-rmenu"><strong>Rule menu</strong></p><ul class="cir-rules"><li><strong>T:</strong> Ana and Bo together;</li><li><strong>P:</strong> Ana and Bo apart;</li><li><strong>O:</strong> Cy directly opposite Ana (`n` even only);</li><li><strong>W:</strong> Ana between Bo and Di.</li></ul>' +
      '<ol class="cir-conds"><li>At least 5 guests.</li><li>At least one rule, and every rule you choose changes the count (no rule is redundant).</li><li>The number of seatings is between 100 and 600.</li></ol>',
    checks:["At least 5 guests", "Every rule matters", "100 to 600 seatings"],
    tips:["Four guests is too small.",
      "W already makes Ana and Bo neighbours, so adding T changes nothing. Drop the redundant rule.",
      "With 7 guests the round table has 720 seatings; one rule brings that into range. With 8 guests you may need two rules."],
    explainPrompt:"Explain how fixing one person helped you count, and how each rule changed the number of seatings.",
    vocab:"Use the words rotation, block and (n − 1)!.",
    more:"There’s more than one answer. Can you find them all?",
    afterAll:"`n = 8` with T + W is also 240, but T adds nothing once W is chosen: that’s why line 2 checks for redundant rules."
  },
  cards:[
    ["Round table, `n` people", "`(n - 1)!`. Example: 6 people → 120."],
    ["Why `(n - 1)!`", "Fix one person; arrange the rest in a line."],
    ["Ring that can flip", "`(n - 1)!/2`. Example: 6 keys → 60."],
    ["People at a table: flip?", "No. Reversing swaps everyone’s left and right."],
    ["Numbered seats", "`n!`: it’s a line."],
    ["Together at a round table", "(units − 1)! × orders inside the block."],
    ["Apart at a round table", "Total − together."],
    ["Alternating around a table", "Fix one person; then fill each type’s seats."],
    ["Opposite seats", "Fix one person; the opposite seat is one specific seat."],
    ["Carousel", "Rotations only: `(n - 1)!`."]
  ]
});
