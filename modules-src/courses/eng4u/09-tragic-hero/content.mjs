// ENG4U 09 The Tragic Hero & Aristotelian Form. Source: /Users/ali/Desktop/MV/Modules/eng4u/plan/modules/09-tragic-hero.md
// Aristotle: Poetics, trans. S. H. Butcher (public domain; wording checked against Project Gutenberg #1974, chapters 6, 7, 11, 13).
// Hamlet: Globe edition (Clark and Wright, 1864; public domain), wording and act.scene.line checked against the Perseus Globe
// text; prose lines (2.2.306–307, 3.2.24–25) checked against Schmidt's Shakespeare Lexicon, which cites Globe lines. All Hamlet
// citations live in R, matching module 08's reference table. The plan's 2.2.295–296, 2.2.550, 3.2.22, 5.2.320 and 5.2.360 are
// other editions' numbers; they are aligned to the Globe here.
// VERIFY: critics' summaries and dates (Goethe 1795–96, Coleridge's lectures, Bradley 1904, Eliot 1919) before release.

const R = {
  antic:"1.5.172", lb4:"1.5.189–190", solid:"1.2.129", lb3:"2.2.306–307", lb8:"2.2.576", play:"2.2.633–634",
  lb1:"3.1.83–85", hue:"3.1.84–85", pale:"3.1.85", mirror:"3.2.24–25", lb6:"3.3.73", heaven:"3.3.74", spare:"3.3.74–78",
  words:"3.3.97", lb7:"3.4.23", king:"3.4.26", arras:"3.4.23–26", lb2:"3.4.27", lb5:"4.4.32–33", lb5a:"4.4.32",
  rashly:"5.2.6–7", blame:"5.2.331", night:"5.2.370"
};
const HC = (ref) => "(<i>Hamlet</i> " + ref + ")";
const BU = (ch) => "(Aristotle, <i>Poetics</i>, trans. S. H. Butcher, ch. " + ch + ")";
const SUPPORT = "This play deals with death and despair. If any of it weighs on you, talk to someone you trust, or contact Kids Help Phone: <span class='th-nw'>1-800-668-6868</span>, or text CONNECT to <span class='th-nw'>686868</span>.";
// VERIFY: Kids Help Phone numbers (1-800-668-6868; text CONNECT to 686868) before each release.
const M1 = "Aristotle’s hero falls “not by vice or depravity, but by some error or frailty”. If he were wicked, we couldn’t pity him.";
const M2 = "Aristotle’s word is <em>hamartia</em>. “Hubris” (violent arrogance) was attached to tragic heroes by later critics.";
// VERIFY: unities of time and place traced mostly to later critics (often Castelvetro, 1570); keep the wording hedged.
const M3 = "Aristotle insists on unity of <em>action</em>. The unities of time and place came mostly from later critics.";
const M4 = "Catharsis is what happens to <em>us</em>: pity and fear are aroused and purged or clarified, not soothed by justice.";
const M5 = "A reversal is the action turning into its opposite: the hunter becomes the hunted.";
const M6 = "The climax is the <em>turn</em>, usually mid-play. The end is the catastrophe.";
const SET = (m) => " <button type='button' class='btn ghost sm th-setup' data-setup='" + m + "'>Set it up</button>";
const RUB = "<details class='alg th-rubric'><summary>How your teacher reads it (levels 1–4)</summary><div class='tbl-wrap'><table class='topic-tbl'><thead><tr><th scope='col'>Category</th><th scope='col'>Level 1</th><th scope='col'>Level 2</th><th scope='col'>Level 3</th><th scope='col'>Level 4</th></tr></thead><tbody>" +
  "<tr><td>Knowledge (Aristotle’s terms)</td><td>Misused</td><td>Named, loosely used</td><td>Used accurately</td><td>Used precisely, with nuance</td></tr>" +
  "<tr><td>Thinking (argument and counter)</td><td>Assertion only</td><td>Evidence, no counter</td><td>Evidence with a counter answered</td><td>The counter sharpens the claim</td></tr>" +
  "<tr><td>Communication (integration and clarity)</td><td>Quotations dropped in</td><td>Quotations introduced</td><td>Quotations embedded and analysed</td><td>Elegant, economical analysis</td></tr>" +
  "<tr><td>Application (lens on text)</td><td>Lens absent</td><td>Lens applied mechanically</td><td>Lens illuminates the play</td><td>Lens and play test each other</td></tr></tbody></table></div></details>";

// The evidence bank (TC3, Part 3, the thesis forge and the task's quotation inserter all read it). s = supports, c = complicates.
const BANK = [
  { id:"LB1", t:"Thus conscience does make cowards of us all; / And thus the native hue of resolution / Is sicklied o’er with the pale cast of thought", ref:R.lb1, s:["R1"], c:["R4"] },
  { id:"LB2", t:"O, what a rash and bloody deed is this!", who:"Gertrude", ref:R.lb2, s:["R4"], c:["R1", "R2"] },   // R2 added: the plan's reading table (and its count of 19) has LB2 complicate R2
  { id:"LB3", t:"I have of late—but wherefore I know not—lost all my mirth", ref:R.lb3, s:["R2"], c:[] },
  { id:"LB4", t:"The time is out of joint: O cursed spite, / That ever I was born to set it right!", ref:R.lb4, s:["R3"], c:[] },
  { id:"LB5", t:"How all occasions do inform against me, / And spur my dull revenge!", ref:R.lb5, s:["R1", "R3"], c:["R4"] },
  { id:"LB6", t:"Now might I do it pat, now he is praying", ref:R.lb6, s:["R1"], c:["R3", "R4"] },
  { id:"LB7", t:"How now! a rat? Dead, for a ducat, dead!", ref:R.lb7, s:["R4"], c:["R1", "R2", "R3"] },
  { id:"LB8", t:"O, what a rogue and peasant slave am I!", ref:R.lb8, s:["R1", "R2"], c:[] }
];
// more lines the task's inserter offers (not part of the TC3 board)
const MORE = [
  { id:"X1", t:"Rashly, / And praised be rashness for it", ref:R.rashly },
  { id:"X2", t:"And so he goes to heaven", ref:R.heaven },
  { id:"X3", t:"My words fly up, my thoughts remain below", who:"Claudius", ref:R.words },
  { id:"X4", t:"Is it the king?", ref:R.king },
  { id:"X5", t:"the king, the king’s to blame", who:"Laertes", ref:R.blame },
  { id:"X6", t:"Good night, sweet prince", who:"Horatio", ref:R.night },
  { id:"X7", t:"to hold, as ’twere, the mirror up to nature", ref:R.mirror },
  { id:"X8", t:"O, that this too too solid flesh would melt", ref:R.solid }
];
const READ = [
  { id:"R1", t:"Thinking too much", sub:"after Coleridge", name:"thinking too much" },
  { id:"R2", t:"Melancholy", sub:"after Bradley", name:"melancholy" },
  { id:"R3", t:"A great duty laid on a soul unfit for it", sub:"after Goethe", name:"a great duty laid on a soul unfit for it" },
  { id:"R4", t:"Rash action", sub:"", name:"rash action" }
];

export default {
  id:"09-tragic-hero",
  kind:"topic",
  title:"The tragic hero and Aristotelian form",
  topic:"The Tragic Hero & Aristotelian Form",
  readyTopic:"the tragic hero",
  hero:{
    headline:"Aristotle saw a shape in suffering.",
    text:"Twenty-three centuries ago, Aristotle watched tragedies and asked what made them work. His answer gave us words we still use: <strong>hamartia</strong> (the hero’s error), <strong>peripeteia</strong> (the reversal), <strong>anagnorisis</strong> (the recognition) and <strong>catharsis</strong> (what pity and fear do to us). Hold <em>Hamlet</em> up to his lens and you’ll see the play’s shape, and the places where Shakespeare breaks the mould.",
    muted:"Work through the six parts in order. Your answers save on this device as you go, so you can stop and come back later.</p><p class='muted th-support' role='note'>" + SUPPORT,
    fig:{ html:"<div class='th-hero' id='th-hero' role='group' aria-label='Aristotle’s definition of tragedy. As it is read, it breaks into five labelled pieces in a column: imitation of an action; serious, complete, of a certain magnitude; action, not narrative; pity and fear; purgation. A rising-and-falling arc draws behind them, with a marker at the peak: the turn.'></div>", caption:"" },
    phrases:["Tragedy, then, is an imitation of an action that is serious, complete, and of a certain magnitude;",
      "in language embellished with each kind of artistic ornament, the several kinds being found in separate parts of the play;",
      "in the form of action, not of narrative;",
      "through pity and fear effecting the proper purgation of these emotions."],
    cite:BU(6),
    pieces:[{ t:"imitation of an action", p:0 }, { t:"serious, complete, of a certain magnitude", p:0 }, { t:"action, not narrative", p:2 }, { t:"pity and fear", p:3 }, { t:"purgation", p:3 }],
    turn:"the turn",
    caption:"A definition is a shape you can test.",
    listen:"Listen", watch:"Watch again", noVoice:"Read it yourself: say the definition aloud, pausing at each semicolon."
  },
  goals:[
    "I can explain Aristotle’s definition of tragedy and his key terms in my own words.",
    "I can map <em>Hamlet</em> onto a tragic arc and defend where its turning point falls.",
    "I can tell hamartia (an error or frailty) from vice, and from later ideas like hubris.",
    "I can evaluate competing readings of Hamlet’s flaw, using evidence that supports and evidence that complicates.",
    "I can write an arguable claim about the tragic hero, with evidence and an answer to a counterargument.",
    "I can apply Aristotle’s lens to a new story and judge where it fits and where it doesn’t."
  ],
  start:{
    blocks:[{ title:"Word story: tragedy", html:"<p><strong><em>Tragedy</em></strong> comes from the Greek <em>tragōidia</em>, probably “goat song” (<em>tragos</em>, goat + <em>ōidē</em>, song). No one is sure why: perhaps a goat was the prize, perhaps a sacrifice, perhaps the singers wore goatskins. A word we use for the deepest human suffering began, it seems, with a farm animal and a song.</p>" }],
    warmup:{
      questions:[
        { id:"w1", skill:"Plot structure", goal:2, prompt:"On Freytag’s pyramid, the <strong>climax</strong> is…",
          options:[{ t:"the turning point, where the hero’s fortunes change direction", ok:true, why:"It’s the peak and the turn, usually mid-play." },
            { t:"the last scene", why:"That’s the catastrophe or resolution." }, { t:"the first scene", why:"That’s the exposition." }, { t:"the moral of the story", why:"The climax is an event, not a lesson." }],
          hints:["A pyramid has a peak.", "What happens at the peak?", "The turn."] },
        { id:"w2", skill:"Plot structure", goal:2, prompt:"Which event in <em>Hamlet</em> is the <strong>inciting incident</strong>?",
          options:[{ t:"The Ghost commands Hamlet to revenge his murder (1.5)", ok:true, why:"It launches the central conflict." },
            { t:"Hamlet kills Polonius (3.4)", why:"That’s a turn, not the start." }, { t:"The final duel (5.2)", why:"That’s the catastrophe." }, { t:"Ophelia’s funeral (5.1)", why:"That’s falling action." }],
          hints:["What starts the revenge plot?", "Who gives the order?", "The Ghost, in 1.5."] },
        { id:"w3", skill:"Character analysis", goal:4, prompt:"What best distinguishes a <strong>round</strong> character from a <strong>flat</strong> one?",
          options:[{ t:"A round character is complex and can surprise us convincingly", ok:true, why:"Hamlet surprises even himself." },
            { t:"A round character appears more often", why:"Frequency isn’t complexity." }, { t:"A round character is good, a flat one evil", why:"Villains can be round too." }, { t:"A round character speaks in verse", why:"Verse isn’t depth." }],
          hints:["Think of Hamlet vs a messenger.", "Who can surprise you?", "Complexity."] },
        { id:"w4", skill:"Character analysis", goal:4, prompt:"Hamlet tells his friends he may “put an antic disposition on” " + HC(R.antic) + ". What does this tell us?",
          options:[{ t:"He plans to <em>act</em> mad", ok:true, why:"“Antic” means grotesque or clownish; he’ll put it on like a costume." },
            { t:"He is already mad", why:"“Put on” means a choice." }, { t:"He will wear a jester’s costume", why:"It’s a manner, not clothing." }, { t:"He will leave Denmark", why:"Nothing about travel." }],
          hints:["What do you “put on”?", "Something you choose.", "Feigned madness."] },
        { id:"w5", skill:"Arguable claims", goal:5, prompt:"Which is an <strong>arguable</strong> claim?",
          options:[{ t:"“Hamlet’s delay comes less from cowardice than from his fear that the Ghost is a devil.”", ok:true, why:"A reasonable reader could disagree, so it needs evidence." },
            { t:"“<em>Hamlet</em> is a play by Shakespeare.”", why:"A fact." }, { t:"“<em>Hamlet</em> has five acts.”", why:"A fact." }, { t:"“I like <em>Hamlet</em>.”", why:"A preference, not an argument." }],
          hints:["Could someone reasonably disagree?", "Only with one option.", "The claim about Hamlet’s delay and the devil."] },
        { id:"w6", skill:"Arguable claims", goal:4, prompt:"A critic says Hamlet thinks too much to act. Which evidence would best <strong>challenge</strong> this?",
          options:[{ t:"Hamlet stabs Polonius through the arras without a moment’s thought (3.4)", ok:true, why:"Here he acts instantly, and rashly." },
            { t:"Hamlet’s long soliloquies", why:"Those <em>support</em> the critic." }, { t:"Hamlet studied at Wittenberg", why:"Background, not evidence against." }, { t:"Hamlet is a prince", why:"Irrelevant to thinking vs acting." }],
          hints:["Look for a moment of action without thought.", "Act 3, behind a curtain.", "The stabbing through the arras (3.4)."] }
      ],
      refreshers:{
        "Plot structure":"Exposition → inciting incident → rising action → climax (the turn) → falling action → catastrophe. The climax is in the middle; the catastrophe is at the end.",
        "Character analysis":"Round characters are complex; judge them by words <em>and</em> actions, especially where the two disagree.",
        "Arguable claims":"A claim is arguable if a thoughtful reader could disagree. Test it: could the opposite be defended with evidence?"
      }
    }
  },
  explore:{
    heading:"Tragic arc builder",
    intro:"Build <em>Hamlet</em>’s shape, then name its parts in Aristotle’s language. Where does it turn? You decide, but you’ll have to be consistent.",
    modes:[{ id:"arc", t:"Arc" }, { id:"terms", t:"Aristotle’s terms" }, { id:"board", t:"Evidence board" }],
    how:{ arc:"Tap a scene card, then tap the stage where it belongs. Tap a placed card to pick it up again.", terms:"Tap a term, then tap the event it names. A term can be used more than once.", board:"Choose the reading you’d defend. Then mark two lines that <strong>support</strong> it and one line that <strong>complicates</strong> it." },
    stages:[{ id:"exp", t:"Exposition", h:0 }, { id:"inc", t:"Inciting incident", h:1 }, { id:"rise", t:"Rising action", h:2 }, { id:"climax", t:"Climax", h:3 }, { id:"fall", t:"Falling action", h:2 }, { id:"cat", t:"Catastrophe", h:0 }],
    cards:[
      { id:"S1", sc:"1.1–1.2", t:"The watch; the court; Hamlet’s grief", ten:1.5 },
      { id:"S2", sc:"1.5", t:"The Ghost’s command", ten:3 },
      { id:"S3", sc:"2.2", t:"The players arrive; “the play’s the thing”", ten:4, sol:true },
      { id:"S4", sc:"3.1", t:"“To be, or not to be”; the nunnery scene", ten:5, sol:true },
      { id:"S5", sc:"3.2", t:"<i>The Mousetrap</i>", ten:7, read:"the trap springs" },
      { id:"S6", sc:"3.3", t:"Hamlet spares Claudius at prayer", ten:8, read:"the moment not taken" },
      { id:"S7", sc:"3.4", t:"Polonius killed through the arras", ten:9, read:"the reversal" },
      { id:"S8", sc:"Act 4", t:"Exile; Ophelia’s madness; Laertes returns", ten:6, sol:true },
      { id:"S9", sc:"5.2", t:"The duel and the deaths", ten:4 }
    ],
    full:{ S1:"exp", S2:"inc", S3:"rise", S4:"rise", S5:"rise", S6:"rise", S7:"climax", S8:"fall", S9:"cat" },
    terms:[{ id:"peri", t:"peripeteia" }, { id:"anag", t:"anagnorisis" }, { id:"cath", t:"catharsis" }, { id:"ham", t:"hamartia" }, { id:"mim", t:"mimesis" }],
    events:[
      { id:"a", t:"Hamlet stabs the hidden Polonius, believing he’s the King " + HC("3.4") + "." },
      { id:"b", t:"The dying Laertes reveals “the king, the king’s to blame” " + HC(R.blame) + "." },
      { id:"c", t:"The audience’s pity and fear at the deaths, ending with Horatio’s “Good night, sweet prince” " + HC(R.night) + "." },
      { id:"d", t:"<i>The Mousetrap</i> re-enacts the murder, “to hold, as ’twere, the mirror up to nature” " + HC(R.mirror) + "." },
      { id:"e", t:"Hamlet spares the praying Claudius so as not to send him “to heaven” " + HC(R.spare) + "." }
    ],
    termKey:{ a:"peri", b:"anag", c:"cath", d:"mim", e:"ham" },
    says:{
      peri:"Peripeteia: the action veers round to its opposite. Hamlet the hunter becomes the hunted.",
      anag:"Anagnorisis: a change from ignorance to knowledge. Hamlet learns the whole plot as he dies.",
      cath:"Catharsis: pity and fear are aroused, then purged or clarified, in us.",
      mim:"Mimesis: the play imitates an action, and <i>The Mousetrap</i> imitates the murder inside it.",
      ham:"Hamartia: an error, not vice. Sparing Claudius is a misjudgment the play makes Hamlet pay for."
    },
    bothErrors:"Both are errors. Aristotle would add that the 3.4 killing is also the reversal. Can one event be both?",
    readings:READ,
    bank:BANK,
    readout:{ stage:"Stage filled", cons:"Consistency", ten:"Tension at the turn", says:"Aristotle would say…", fit:"Fit with Aristotle", reading:"Your reading", cas:"Your case" },
    aha:"A definition is a tool for seeing. <em>Hamlet</em> turns sharply where Aristotle says tragedies turn, but its middle is full of thought, and that’s where the debate about its hero lives.",
    opening:{ banner:"Where does it turn? Your call, but be consistent." },
    quotes:{
      p2:"“a man who is not eminently good and just,—yet whose misfortune is brought about not by vice or depravity, but by some error or frailty” " + BU(13),
      p2swap:"vice",
      p4:"“The Plot, then, is the first principle, and, as it were, the soul of a tragedy: Character holds the second place.” " + BU(6)
    },
    dir:{ before:"Hamlet hunts Claudius", after:"Claudius hunts Hamlet", notes:"Claudius sends Hamlet to England · Laertes comes home for revenge" },
    predictions:[
      { id:"p1", start:{ mode:"arc", full:true },
        prompt:"Imagine Hamlet kills Claudius at prayer in 3.3. Which part of the arc disappears?",
        options:[{ t:"The falling action and the catastrophe as we know them: the play would end in Act 3", ok:true }, { t:"The exposition" }, { t:"The inciting incident" }, { t:"Nothing changes" }],
        explain:"Act 4’s consequences grow from the moment he <em>doesn’t</em> strike. The delay builds the whole second half." },
      { id:"p2", start:{ mode:"terms", quote:"p2" },
        prompt:"Swap “error or frailty” for “vice”. What happens to our response?",
        options:[{ t:"We stop pitying him: his fall becomes deserved", ok:true }, { t:"We pity him more" }, { t:"Nothing changes" }, { t:"He becomes a comic character" }],
        explain:"Aristotle: pity is aroused by <em>unmerited</em> misfortune. A vicious hero earns his fall." },
      { id:"p3", start:{ mode:"arc", full:true, hi:"S7" },
        prompt:"Hamlet stabs through the arras and kills Polonius. What happens to the direction of the story?",
        options:[{ t:"It reverses: Hamlet the hunter becomes the hunted", ok:true }, { t:"It stays the same" }, { t:"It becomes a comedy" }, { t:"It ends" }],
        explain:"That’s peripeteia: the action “veers round to its opposite” " + BU(11) + "." },
      { id:"p4", start:{ mode:"terms", quote:"p4" },
        prompt:"If we cut every soliloquy but kept every event, what would Aristotle say is lost?",
        options:[{ t:"The “soul” (the plot) survives, but character, which he ranks second, grows thinner", ok:true }, { t:"The tragedy dies: the soliloquies are its soul" }, { t:"Nothing at all" }, { t:"Aristotle would ban soliloquies" }],
        explain:"Aristotle ranks plot first. Many modern readers disagree: for them Hamlet’s mind <em>is</em> the play. Hold both views." }
    ],
    chalIntro:"Use the arc, the terms and the evidence board to meet each goal, then press <strong>Check challenge</strong>. <strong>Set it up</strong> opens the right mode. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"<strong>Build the arc.</strong> Place all nine scene cards on the stages of the pyramid." + SET("arc"),
        msgs:{ unplaced:"Place all nine cards first.", s9:"That’s the catastrophe. The climax is the turn, mid-play.", two:"Choose one turn. Defend it in Part 3.", s8:"Act 4 follows the turn, whichever turn you chose." },
        general:"Not yet. Read the consistency row: everything before your climax should rise, and everything after it should fall.",
        why:"Three arcs are defensible. A climax at 3.2 says “the trap springs”; at 3.3, “the moment not taken”; at 3.4, “the reversal”. Whichever you chose, you’ll defend it in Part 3.",
        hints:["Start and end are fixed: 1.1–1.2, 1.5, 5.2.", "Choose your turn among the three Act 3 scenes.", "Everything before it rises; everything after it falls."] },
      { id:"tc2", goal:1, prompt:"<strong>Name the parts.</strong> Match the five term chips to the five events." + SET("terms"),
        msgs:{ unplaced:"Give each of the five events a term.", b:"Laertes’s words change what Hamlet <em>knows</em>. That’s recognition.", c:"Catharsis happens in the audience, not in the hero." },
        general:"Not yet. Ask of each event: does it change knowledge or direction, happen in the audience, show an error, or imitate an action?",
        why:"Killing Polonius reverses the action (peripeteia); Laertes’s words bring recognition (anagnorisis); our pity and fear are the catharsis; <i>The Mousetrap</i> is imitation (mimesis); sparing Claudius is the error (hamartia).",
        hints:["Which event changes <em>knowledge</em>? Which changes <em>direction</em>?", "Which one happens in the audience?", "a peripeteia, b anagnorisis, c catharsis, d mimesis, e hamartia."] },
      { id:"tc3", goal:4, stretch:true, prompt:"<strong>Make the strongest case.</strong> On the evidence board, choose <strong>one</strong> reading of Hamlet’s hamartia, <strong>two</strong> lines that support it and <strong>one</strong> line that complicates it (the counterevidence you’ll have to answer)." + SET("board"),
        msgs:{ count:"Choose a reading, exactly two supporting lines and one counter.", other:"That line supports {r}, not your reading.", helps:"That line helps your case. A counter should push back.", flat:"That line doesn’t push back on your reading. Find the line your opponent would quote against you." },
        general:"Not yet. Check each supporting line against your reading, and make sure your counter pushes back.",
        why:"That’s the shape of an argument: claim, evidence, and the evidence you’ll have to answer. Take it to Part 3.",
        hints:["Pick the reading you’d defend.", "Filter the bank: which lines show <em>that</em> trait in action?", "Now find the line your opponent would quote against you."] }
    ],
    blocks:[{ title:"Reading the arc", html:"<p>The graph plots Freytag’s shape: each scene card carries a fixed tension value, and the curve follows the order of your stages, so tension rises to the turn and falls toward the catastrophe. Aristotle himself names a beginning, a middle and an end; the pyramid is Gustav Freytag’s (1863).</p>" }]
  },
  part3:{
    slug:"flaw", name:"The flaw",
    heading:"Debating the flaw",
    intro:"For two centuries critics have argued about Hamlet’s hamartia. Sit at the table with four of them, check each one against the text, then join the conversation with a thesis of your own. The positions below are summaries in our words, not quotations.",
    critics:[
      { id:"goethe", n:"Goethe", src:"in <i>Wilhelm Meister’s Apprenticeship</i>, 1795–96", pos:"A great action laid on a soul unfit to perform it, pictured as an oak planted in a delicate vase that shatters as its roots grow.", lines:["LB4", "LB5"], short:"a soul unfit for a great deed" },
      { id:"coleridge", n:"Coleridge", src:"lectures, early 1800s", pos:"Hamlet’s habit of thought outweighs his impulse to act; reflection crowds out deed.", lines:["LB1", "LB6"], short:"too much thought" },
      { id:"bradley", n:"A. C. Bradley", src:"<i>Shakespearean Tragedy</i>, 1904", pos:"Not too much thought by nature, but a deep <strong>melancholy</strong>, triggered by moral shock at his mother’s remarriage, paralyses him.", lines:["LB3", "LB8"], short:"melancholy" },
      { id:"eliot", n:"T. S. Eliot", src:"“Hamlet and His Problems”, 1919", pos:"The play fails to find an “objective correlative” for Hamlet’s emotion: his feelings exceed their causes on stage.", lines:["X8", "LB3"], short:"emotion in excess of its causes" }
    ],
    checkLabel:"Check it with the text", checkHow:"Do these lines bear the critic out? Read them, then decide for yourself.",
    forge:{
      stances:[{ id:"agree", t:"agree with", lead:"Agreeing with" }, { id:"extend", t:"extend", lead:"Extending" }, { id:"push", t:"push back against", lead:"Pushing back against" }],
      own:{ id:"own", t:"My own" }, ownLabel:"My reading, in 2–6 words",
      whyLabel:"Why it matters (8–25 words)", whyPh:"e.g. because the play’s reversal grows from the moments he chooses not to act",
      vagueWords:["indecisive", "sad", "mad", "crazy", "weak", "depressed", "emotional", "lazy", "angry", "confused", "cowardly", "slow", "hesitant", "insane"],
      flags:{ fact:"Fact, not claim: choose a stance toward a critic, so a reader could disagree.", vague:"Vague: a single trait word (“indecisive”) isn’t a reading. Say how the trait works, in 2–6 words.", how:"No <em>how</em> yet: choose two lines from the bank.", why:"No <em>why</em> yet: say in 8–25 words why it matters.", ok:"No flags: it names the text and author, takes a stance, and gives a <em>how</em> and a <em>why</em>." },
      checks:["Names <em>Hamlet</em> and Shakespeare", "Takes a stance", "Gives a <em>how</em> (two lines)", "Gives a <em>why</em>"]
    },
    blocks:[],
    quickCheck:{ title:"The flaw: quick check", summary:"The flaw quick check",
      items:[
        { id:"q1", goal:4, prompt:"Which critic links Hamlet’s paralysis to melancholy after moral shock?",
          choices:[{ t:"Bradley", ok:true, fb:"Right. Bradley’s Hamlet isn’t a born over-thinker; he’s wounded." }, { t:"Goethe", fb:"Bradley’s Hamlet isn’t a born over-thinker; he’s wounded." }, { t:"Coleridge", fb:"Bradley’s Hamlet isn’t a born over-thinker; he’s wounded." }, { t:"Eliot", fb:"Bradley’s Hamlet isn’t a born over-thinker; he’s wounded." }] },
        { id:"q2", goal:4, prompt:"To “push back” against Coleridge, the best evidence is…",
          choices:[{ t:"“Dead, for a ducat, dead!” (" + R.lb7 + ")", ok:true, fb:"Right. He acts in an instant. The other three show thought or self-reproach, which <em>supports</em> Coleridge." },
            { t:"“pale cast of thought” (" + R.pale + ")", fb:"The other three show thought or self-reproach, which <em>supports</em> Coleridge." },
            { t:"“Now might I do it pat” (" + R.lb6 + ")", fb:"The other three show thought or self-reproach, which <em>supports</em> Coleridge." },
            { t:"“O, what a rogue and peasant slave am I!” (" + R.lb8 + ")", fb:"The other three show thought or self-reproach, which <em>supports</em> Coleridge." }] },
        { id:"q3", goal:4, prompt:"Why check critics against the text?",
          choices:[{ t:"Critics can be wrong; the text is the shared evidence", ok:true, fb:"Right. Authority isn’t evidence; the lines are." }, { t:"Critics are always right", fb:"Authority isn’t evidence; the lines are." },
            { t:"Texts are always ambiguous, so nothing can be checked", fb:"Authority isn’t evidence; the lines are." }, { t:"Older critics are better", fb:"Authority isn’t evidence; the lines are." }] },
        { id:"q4", goal:4, prompt:"Eliot’s “objective correlative” claim is that…",
          choices:[{ t:"Hamlet’s emotion exceeds its causes on stage", ok:true, fb:"Right. Eliot judges the <em>play</em>, not just the character." }, { t:"Hamlet has no emotions", fb:"Eliot judges the <em>play</em>, not just the character." },
            { t:"the play is too short", fb:"Eliot judges the <em>play</em>, not just the character." }, { t:"the Ghost isn’t real", fb:"Eliot judges the <em>play</em>, not just the character." }] }
      ] },
    blocksAfter:[{ type:"write", id:"steal", title:"Sentence to steal",
      html:"<p class='steal-line'>“A whole is that which has a beginning, a middle, and an end.”</p><p class='eng-cite'>" + BU(7) + "</p><p><strong>The pattern:</strong> “A [noun] is that which [has or does a, b, and c].” It’s a definition that sounds like a law.</p><p><strong>Your turn:</strong> imitate it for something you know well.</p><p><strong>Example:</strong> “A friendship is that which survives an argument, a silence, and a move.”</p>",
      prompt:"Your imitation" }]
  },
  practice:{
    activities:[
      { id:"sorter", type:"sorter", title:"Term sorter", summary:"Term sorter", goal:[1, 3], txt:true, noun:"description",
        instruction:"Sort each description into the Aristotelian term it names. Trivium: Grammar.",
        boxes:[{ id:"ham", label:"Hamartia" }, { id:"peri", label:"Peripeteia" }, { id:"anag", label:"Anagnorisis" }, { id:"cath", label:"Catharsis" }, { id:"mim", label:"Mimesis" }],
        wrongDefault:"Ask: hero, story or audience? Then: knowledge, direction, error, emotion or imitation?",
        items:[
          { id:"i1", t:"“A change from ignorance to knowledge”", answer:"anag", why:"Butcher’s own words for recognition.", hints:["Hero, story or audience?", "Knowledge, direction, error, emotion or imitation?", "Anagnorisis: it’s a change in what a character knows."] },
          { id:"i2", t:"“The action veers round to its opposite”", answer:"peri", why:"Butcher’s words for the reversal.", hints:["Hero, story or audience?", "Knowledge, direction, error, emotion or imitation?", "Peripeteia: the story changes direction."] },
          { id:"i3", t:"“An error or frailty, not vice”", answer:"ham", why:"The hero’s error, which lets us pity him.", wrong:{ cath:"Catharsis is the audience’s experience, not the hero’s error." }, hints:["Hero, story or audience?", "Knowledge, direction, error, emotion or imitation?", "Hamartia: it’s the hero’s error."] },
          { id:"i4", t:"“Pity and fear, aroused and purged”", answer:"cath", why:"What tragedy does to its audience.", hints:["Hero, story or audience?", "Knowledge, direction, error, emotion or imitation?", "Catharsis: it’s the audience’s emotion."] },
          { id:"i5", t:"“Art as an imitation of an action”", answer:"mim", why:"Aristotle’s starting point: tragedy imitates.", hints:["Hero, story or audience?", "Knowledge, direction, error, emotion or imitation?", "Mimesis: it’s imitation."] },
          { id:"i6", t:"Laertes: “the king, the king’s to blame” (" + R.blame + ")", answer:"anag", why:"Hamlet learns the truth: a change in knowledge.", wrong:{ peri:"It changes knowledge. That’s recognition." }, hints:["Hero, story or audience?", "Knowledge, direction, error, emotion or imitation?", "Anagnorisis: Hamlet learns who is to blame."] },
          { id:"i7", t:"Hamlet the hunter becomes the hunted after 3.4", answer:"peri", why:"The action turns into its opposite.", hints:["Hero, story or audience?", "Knowledge, direction, error, emotion or imitation?", "Peripeteia: the direction of the story flips."] },
          { id:"i8", t:"Hamlet’s advice to “hold, as ’twere, the mirror up to nature” (" + R.mirror + ")", answer:"mim", why:"Acting as imitation of life.", hints:["Hero, story or audience?", "Knowledge, direction, error, emotion or imitation?", "Mimesis: a mirror imitates."] },
          { id:"i9", t:"A misjudgment: sparing Claudius at prayer (3.3)", answer:"ham", why:"An error of judgment, not wickedness.", wrong:{ peri:"Sparing him is the <em>cause</em>; the reversal comes in 3.4." }, hints:["Hero, story or audience?", "Knowledge, direction, error, emotion or imitation?", "Hamartia: it’s an error of judgment."] },
          { id:"i10", t:"Leaving the theatre shaken but clearer", answer:"cath", why:"Pity and fear purged or clarified, in us.", hints:["Hero, story or audience?", "Knowledge, direction, error, emotion or imitation?", "Catharsis: it happens in the audience."] }
        ] },
      { id:"arist", type:"mc", title:"Is it Aristotelian?", summary:"Is it Aristotelian?", goal:[6, 2], star:true,
        instruction:"Five stories you haven’t seen. Hold each one up to Aristotle’s lens. Trivium: Logic.",
        items:[
          { id:"r1", goal:6, prompt:"<strong>Oedipus:</strong> a king hunts his city’s polluter and learns that he himself killed his father and married his mother. What is special about the recognition here?",
            options:[{ t:"It coincides with the reversal: learning the truth <em>is</em> his fall. Aristotle calls this the finest kind.", ok:true, why:"Butcher: “The best form of recognition is coincident with a Reversal of the Situation, as in the Oedipus” " + BU(11) + "." },
              { t:"The recognition and the reversal are unrelated.", why:"The moment he knows, he falls." },
              { t:"It happens to the audience, not to Oedipus.", why:"Recognition is a character’s change from ignorance to knowledge; the audience’s response is catharsis." },
              { t:"It shows that Oedipus is wicked.", why:"He acted in ignorance: error, not vice." }],
            hints:["When does Oedipus learn the truth?", "When does his fortune turn?", "At the same moment."] },
          { id:"r2", goal:6, prompt:"A ruthless smuggler betrays everyone and is finally caught. Would Aristotle call this an ideal tragedy?",
            options:[{ t:"No: a wicked man’s fall satisfies but doesn’t arouse pity.", ok:true, why:"Butcher: such a plot “would, doubtless, satisfy the moral sense, but it would inspire neither pity nor fear” " + BU(13) + "." },
              { t:"Yes: he falls from success to ruin.", why:"Falling isn’t enough; it must be unmerited, from error, not vice." },
              { t:"Yes: he is caught, so justice is done.", why:"Justice satisfies us, but tragedy needs pity and fear." },
              { t:"No: a tragedy can’t have a criminal in it.", why:"Aristotle objects to a deserved fall, not to crime in the story." }],
            hints:["Do we pity someone who gets what he deserves?", "Pity is aroused by <em>unmerited</em> misfortune.", "No: his fall is deserved, so it satisfies without arousing pity."] },
          { id:"r3", goal:6, prompt:"A gifted surgeon refuses help during a long operation out of confidence; the patient survives, but she realizes she nearly killed him and changes how she works. Which element is missing for a full tragedy?",
            options:[{ t:"The catastrophe. Recognition comes in time, so there’s no tragic fall.", ok:true, why:"Error and recognition are both there; the fall never comes." },
              { t:"Hamartia: she makes no error.", why:"Her confidence <em>is</em> the error." },
              { t:"Anagnorisis: she never realizes anything.", why:"She realizes she nearly killed him: that’s recognition." },
              { t:"Nothing: it’s a complete tragedy.", why:"No one falls. The recognition arrives in time to prevent it." }],
            hints:["Find the error, then the recognition.", "Does anyone suffer the fall?", "The catastrophe: she learns in time."] },
          { id:"r4", goal:2, prompt:"A detective story told in flashbacks over twenty years, in four cities. Does it break Aristotle’s rules?",
            options:[{ t:"Not necessarily: Aristotle insists on unity of <em>action</em>; unity of time and place came from later critics.", ok:true, why:"If the action is one connected whole, the years and the cities don’t trouble Aristotle." },
              { t:"Yes: it breaks the three unities of time, place and action.", why:M3 },
              { t:"Yes: Aristotle forbids flashbacks.", why:"There’s no such rule. He asks for one complete, connected action." },
              { t:"No: Aristotle had no views on plot.", why:"He calls the plot “the soul of a tragedy”." }],
            hints:["Which unity does Aristotle actually insist on?", "Action, not time or place.", "Not necessarily: only unity of action is his."] },
          { id:"r5", goal:6, prompt:"A hero’s town is destroyed by a flood unconnected to anything she did. Where is the hamartia?",
            options:[{ t:"There isn’t one: misfortune without the hero’s error is pitiable, but it isn’t Aristotle’s tragic pattern.", ok:true, why:"Her suffering moves us, but it doesn’t grow from her own error." },
              { t:"The flood is the hamartia.", why:"A flood isn’t an error <em>of the hero</em>." },
              { t:"Her choice to live in the town.", why:"Nothing in the story makes that an error that causes the fall." },
              { t:"Her grief after the flood.", why:"Grief is a response, not the error that causes a fall." }],
            hints:["Hamartia belongs to the hero.", "Did she misjudge anything?", "There isn’t one: the disaster isn’t caused by her error."] }
        ] },
      { id:"spot", type:"custom", title:"Spot the Error", summary:"Spot the error", student:"Josefina", goal:[3, 2, 1],
        instruction:"Josefina made one mistake in each paragraph. Tap the sentence where the <strong>first</strong> mistake happens, then choose the fix.", how:"",
        problems:[
          { id:"e1", goal:3, task:"Explain Aristotle’s tragic hero, using Hamlet.",
            steps:["Aristotle describes a hero who is “not eminently good and just”.", "His misfortune comes from “some error or frailty”.", "Aristotle calls this fault hubris, meaning excessive pride.", "Hamlet’s hubris is pride in his own intelligence."],
            answer:2, stepFb:["Accurate. Keep checking.", "Accurate.", "", "Sentence 4 builds on sentence 3. The problem is earlier."],
            fixes:[{ t:"Aristotle’s word is <em>hamartia</em>, an error or frailty; “hubris” is a later critics’ idea.", ok:true, why:"Right: the <em>Poetics</em> names an error, not pride." },
              { t:"Aristotle calls it vice.", why:"He says explicitly <em>not</em> vice." }, { t:"Delete sentence 2.", why:"Sentence 2 is the key quotation." }, { t:"Sentence 3 is correct.", why:M2 }],
            hints:["Which Greek word is Aristotle’s?", "Not hubris.", "The fix that names hamartia."] },
          { id:"e2", goal:2, task:"Describe <em>Hamlet</em>’s structure.",
            steps:["The inciting incident is the Ghost’s command in 1.5.", "The rising action builds through <em>The Mousetrap</em> in 3.2.", "The climax is the final duel in 5.2, where the most characters die.", "So the falling action is only a few lines long."],
            answer:2, stepFb:["Correct.", "Correct.", "", "This follows from sentence 3."],
            fixes:[{ t:"The climax is the turn in Act 3 (for example 3.4, where killing Polonius reverses Hamlet’s position); 5.2 is the catastrophe.", ok:true, why:"Right: the climax is the turn, not the most deaths." },
              { t:"The climax is 1.1.", why:"That’s the exposition." }, { t:"There is no climax.", why:"Every arc has a turn." }, { t:"Sentence 3 is correct.", why:M6 }],
            hints:["Climax = turn.", "Where does the direction change?", "The fix that puts the climax in Act 3."] },
          { id:"e3", goal:1, task:"Explain catharsis at the end of <em>Hamlet</em>.",
            steps:["Horatio’s “Good night, sweet prince” " + HC(R.night) + " gives the ending a moment of grace.", "Aristotle says tragedy works “through pity and fear”.", "Catharsis means the audience leaves happy because the villain is punished.", "So <em>Hamlet</em>’s catharsis comes from Claudius’s death."],
            answer:2, stepFb:["Good observation and citation.", "Accurate.", "", "Sentence 4 rests on sentence 3."],
            fixes:[{ t:"Catharsis is the purging or clarifying of the pity and fear the tragedy arouses: we feel them fully and are changed, not simply pleased.", ok:true, why:"Right: catharsis happens to the audience’s pity and fear." },
              { t:"Catharsis means the hero is punished.", why:M4 }, { t:"Catharsis means a surprise ending.", why:"A surprise ending isn’t catharsis, and not every surprise is even a reversal." }, { t:"Sentence 3 is correct.", why:M4 }],
            hints:["Whose emotions?", "Pity and fear, ours.", "The fix about purging pity and fear."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Where did you put <em>Hamlet</em>’s climax, and what does your choice say about what you think the play is <em>about</em>?" },
      { id:"j2", q:"In your own words, why does Aristotle insist the hero’s fall come from error, not wickedness?" },
      { id:"j3", q:"Explain to a friend the difference between a reversal and a recognition, with one example from <em>Hamlet</em> and one from a film or book you know." },
      { id:"j4", q:"Which critic’s view of Hamlet do you find most persuasive, and what line would you use to challenge it?" }
    ],
    blocks:[{ title:"Commonplace book", html:"<p>Save one line from the play or from Aristotle that you’d like to remember, and why.</p><div id='cp-app'></div>" }],
    art:{
      intro:"Write a principle about arguing for an interpretation. Add the line or passage that taught it, and one sentence of your own that follows it.",
      placeholder:"e.g. Name the evidence that hurts your case before your reader does.",
      examples:["the native hue of resolution / Is sicklied o’er with the pale cast of thought " + HC(R.hue),
        "How now! a rat? Dead, for a ducat, dead! " + HC(R.lb7),
        "The Plot, then, is the first principle, and, as it were, the soul of a tragedy " + BU(6),
        "A whole is that which has a beginning, a middle, and an end. " + BU(7),
        "Good night, sweet prince " + HC(R.night)]
    },
    artSamples:[
      { p:"A tragic flaw is a strength turned against itself.", m:"“the native hue of resolution / Is sicklied o’er with the pale cast of thought” (" + R.hue + ")" },
      { p:"Name the evidence that hurts your case before your reader does.", m:"TC3’s counter line" }
    ],
    principleMin:6
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"In Butcher’s translation, Aristotle says tragedy effects “the proper purgation” of which emotions?",
          options:[{ t:"Pity and fear", ok:true, why:"Through pity and fear, these emotions are purged." }, { t:"Joy and sorrow", why:"Aristotle names pity and fear." },
            { t:"Anger and pride", why:"Pride belongs to the later idea of hubris. Aristotle names pity and fear." }, { t:"Love and hate", why:"Those appear in his account of recognition, not purgation." }] },
        b:{ prompt:"What does Aristotle call “the soul of a tragedy”?",
          options:[{ t:"The plot", ok:true, why:"Character holds the second place." }, { t:"Character", why:"He ranks character second." }, { t:"Spectacle", why:"He ranks it least." }, { t:"The chorus", why:"Not his phrase." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Aristotle’s ideal tragic hero falls because of…",
          options:[{ t:"some error or frailty, not vice", ok:true, why:"So we can pity him." }, { t:"wickedness", why:M1 }, { t:"bad luck alone", why:"Misfortune with no error doesn’t fit his pattern." }, { t:"the gods’ anger", why:"Not his explanation." }] },
        b:{ prompt:"Which Greek term does the <em>Poetics</em> use for the hero’s error?",
          options:[{ t:"<em>Hamartia</em>", ok:true, why:"Aristotle’s word: an error or frailty." }, { t:"<em>Hubris</em>", why:"A later critics’ idea." }, { t:"<em>Peripeteia</em>", why:"That’s reversal." }, { t:"<em>Catharsis</em>", why:"That’s purgation." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"Peripeteia is…",
          options:[{ t:"a reversal, when the action veers round to its opposite", ok:true, why:"Butcher’s words for the reversal." }, { t:"any surprising event", why:M5 }, { t:"a change from ignorance to knowledge", why:"That’s recognition." }, { t:"the final scene", why:M6 }] },
        b:{ prompt:"Anagnorisis is…",
          options:[{ t:"a change from ignorance to knowledge", ok:true, why:"Butcher’s words for recognition." }, { t:"a reversal of fortune", why:"That’s peripeteia." }, { t:"the hero’s error", why:"That’s hamartia." }, { t:"the audience’s tears", why:"Feelings in the audience belong to catharsis." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"Which event is best described as <em>Hamlet</em>’s peripeteia?",
          options:[{ t:"Killing Polonius (3.4), which turns Hamlet from hunter into hunted", ok:true, why:"Exile, Ophelia’s madness and Laertes’s revenge follow." }, { t:"The Ghost’s appearance (1.1)", why:"That begins the action." },
            { t:"The gravediggers’ scene (5.1)", why:"It comes after the turn." }, { t:"The final duel (5.2)", why:"That’s the catastrophe." }] },
        b:{ prompt:"Where does anagnorisis most clearly occur?",
          options:[{ t:"In 5.2, when the dying Laertes reveals the plot: “the king, the king’s to blame”", ok:true, why:"Hamlet learns the whole truth at last " + HC(R.blame) + "." }, { t:"In 1.5, when the Ghost speaks", why:"Hamlet learns a claim, but must still test it." },
            { t:"In 3.4, when Polonius dies", why:"That’s the reversal." }, { t:"In 4.5, when Ophelia goes mad", why:"Ophelia’s madness isn’t Hamlet’s recognition." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Which line most <strong>complicates</strong> the reading that Hamlet’s flaw is thinking too much?",
          options:[{ t:"“How now! a rat? Dead, for a ducat, dead!” (" + R.lb7 + ")", ok:true, why:"He acts instantly, without thought." }, { t:"“the pale cast of thought” (" + R.pale + ")", why:"It <em>supports</em> the reading." },
            { t:"“Now might I do it pat, now he is praying” (" + R.lb6 + ")", why:"He reasons himself out of acting." }, { t:"“How all occasions do inform against me” (" + R.lb5a + ")", why:"He accuses himself of delay." }] },
        b:{ prompt:"Which line most <strong>complicates</strong> the reading that Hamlet is simply rash?",
          options:[{ t:"“Now might I do it pat, now he is praying” (" + R.lb6 + ")", ok:true, why:"He stops to reason at the decisive moment." }, { t:"“O, what a rash and bloody deed is this!” (" + R.lb2 + ")", why:"That supports the reading: Gertrude calls the deed rash." },
            { t:"“Dead, for a ducat, dead!” (" + R.lb7 + ")", why:"That supports it: he strikes without looking." }, { t:"“Rashly, / And praised be rashness for it” (" + R.rashly + ")", why:"That supports it: he praises his own rashness." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"A celebrated bridge engineer ignores a junior colleague’s warning because she trusts her own calculations. The bridge fails. At the inquiry, she realizes the colleague was right. Which reading is most Aristotelian?",
          options:[{ t:"Hamartia: an error born of confidence; peripeteia: the bridge’s failure; anagnorisis: her realization at the inquiry", ok:true, why:"Error, then the fall, then the knowing." },
            { t:"Hamartia: the bridge; peripeteia: the inquiry; anagnorisis: the warning", why:"The terms sit on the wrong events: the error is hers, the failure is the reversal, and the realization is the recognition." },
            { t:"There is no hamartia because she meant well", why:"Hamartia isn’t malice; it’s error." }, { t:"Catharsis: the bridge failing", why:"Catharsis happens in the audience." }] },
        b:{ prompt:"In the Oedipus story, the king learns he killed his father at the very moment his fortunes collapse. Why does Aristotle prize this?",
          options:[{ t:"Recognition coincides with reversal, making the moment of knowing the moment of falling", ok:true, why:"“The best form of recognition is coincident with a Reversal of the Situation” " + BU(11) + "." },
            { t:"Because the hero is wicked", why:M1 }, { t:"Because it happens offstage", why:"Irrelevant." }, { t:"Because it ends happily", why:"It doesn’t, and catharsis isn’t a happy ending." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the best thesis?",
          options:[{ t:"“Read through Aristotle, Hamlet’s hamartia is an error of timing: by sparing Claudius at prayer (3.3) and stabbing blindly in 3.4, he acts at the wrong moments, and the play’s reversal follows.”", ok:true, why:"Arguable, specific, and it uses the lens." },
            { t:"“<em>Hamlet</em> is a tragedy by Aristotle.”", why:"A factual error: Shakespeare wrote <em>Hamlet</em>; Aristotle wrote about tragedy." }, { t:"“Hamlet has a tragic flaw.”", why:"Vague. Which, and why does it matter?" },
            { t:"“Aristotle’s rules prove <em>Hamlet</em> is a bad play.”", why:"An overclaim: Aristotle’s terms are a lens, not a rulebook." }] },
        b:{ prompt:"Which is the best thesis about catharsis in <em>Hamlet</em>?",
          options:[{ t:"“<em>Hamlet</em> earns its catharsis not through Claudius’s punishment but through the waste of a mind we have come to know, so that Horatio’s ‘Good night, sweet prince’ (" + R.night + ") purges pity rather than satisfying revenge.”", ok:true, why:"Arguable, specific, and the citation is evidence." },
            { t:"“<em>Hamlet</em> has catharsis because the villain dies.”", why:M4 }, { t:"“Catharsis is in <em>Hamlet</em>.”", why:"Vague: what does it come from, and why does it matter?" },
            { t:"“Everyone cries at the end.”", why:"An unsupported generalization." }] } },
      { id:"c2", cat:"C", goal:[1, 3],
        a:{ prompt:"Which sentence explains catharsis most accurately?",
          options:[{ t:"“Catharsis is the purging or clarifying of the pity and fear a tragedy arouses: the audience feels them fully and is changed.”", ok:true, why:"Pity and fear, felt fully, then purged or clarified." },
            { t:"“Catharsis is a happy ending.”", why:M4 }, { t:"“Catharsis is the hero’s revenge being satisfied.”", why:M4 }, { t:"“Catharsis means the audience must cry.”", why:"Too literal: catharsis is a change in the audience, not a required reaction." }] },
        b:{ prompt:"Which sentence explains hamartia most accurately?",
          options:[{ t:"“Hamartia is an error or frailty, not wickedness, which is why we can pity the hero who falls by it.”", ok:true, why:"Error, not wickedness: that’s why we pity him." },
            { t:"“Hamartia is the hero’s evil nature.”", why:M1 }, { t:"“Hamartia is the same as hubris.”", why:M2 }, { t:"“Hamartia is the moment of reversal.”", why:"That’s peripeteia, the reversal." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"In a film, a team captain refuses to rest an injured knee before the final, sure that she can carry the team. She collapses in the second half, and the team loses. Which term best names her refusal?",
          options:[{ t:"Hamartia", ok:true, why:"An error born of strength (her determination)." }, { t:"Catharsis", why:"Catharsis happens in the audience, not in her choice." }, { t:"Anagnorisis", why:"That would be her realization." }, { t:"Mimesis", why:"That’s the film imitating life, not her choice." }] },
        b:{ prompt:"In the same film, which term names the moment in the locker room when she sees what her pride cost the team?",
          options:[{ t:"Anagnorisis", ok:true, why:"She moves from ignorance to knowledge." }, { t:"Peripeteia", why:"That’s the collapse." }, { t:"Hamartia", why:"That’s the refusal." }, { t:"Catharsis", why:"Catharsis is the audience’s response, not her realization." }] } },
      { id:"a2", cat:"A", goal:2,
        a:{ prompt:"A director wants to cut 3.3 (Hamlet sparing Claudius at prayer) to save time. Using Aristotle’s idea that events should follow by “probability or necessity”, what is the strongest objection?",
          options:[{ t:"The cut breaks the causal chain: without the choice to spare Claudius, the killing in 3.4 loses its cause and its irony", ok:true, why:"Hamlet strikes at the arras believing the King is there, the King he has just left." },
            { t:"Audiences like long plays", why:"Irrelevant to the chain of cause and effect." }, { t:"Aristotle forbids cutting any scene", why:"There’s no such rule; he asks whether events follow by probability or necessity." }, { t:"3.3 contains the climax by law", why:"There’s no such law; the objection is about cause and effect." }] },
        b:{ prompt:"Aristotle criticizes “episodic” plots (Butcher spells it “epeisodic”), where scenes follow without probable or necessary sequence. Which is the best defence of keeping the gravediggers’ scene (5.1)?",
          options:[{ t:"It isn’t merely episodic: Ophelia’s burial brings Hamlet and Laertes face to face and sets up the duel", ok:true, why:"Probable sequence: the burial leads to the quarrel, and the quarrel to the duel." },
            { t:"It’s funny, and audiences need jokes", why:"Partly true, but not an Aristotelian defence." }, { t:"Aristotle loved gravediggers", why:"Invented." }, { t:"It’s short", why:"Irrelevant." }] } }
    ]
  },
  task:{
    title:"Performance task: A claim about the flaw", summary:"A claim about the flaw",
    statement:"<p>Write a 180–300-word argument about Hamlet’s hamartia, using Aristotle’s lens. Take a position, use two pieces of evidence, and answer the strongest counterargument.</p><p class='tiny muted'>This checklist makes sure the parts are there. Your teacher reads the argument.</p>" + RUB,
    checks:["Names the text and author", "Takes a position", "Speaks Aristotle’s language", "Two pieces of evidence", "Faces the counterargument", "Answers it", "Length"],
    tips:["Your first sentence should name <em>Hamlet</em> and Shakespeare.", "Choose a reading, or name your own in a few words.", "Use at least one of Aristotle’s terms, precisely.",
      "Two quotations, cited, from two different scenes.", "Begin your counter with “It could be argued…” or “Some readers…”.", "Then answer it: “Yet…”.", "Aim for 180–300 words."],
    explainPrompt:"Craft statement: Which piece of counterevidence worried you most, and how did you answer it? What did answering it teach you about your own claim?",
    explainLabel:"Craft statement",
    vocab:"Name the counter line, then say what answering it changed in your claim.",
    checkLabel:"Check my argument",
    success:"Your argument has every part.",
    more:"Try another reading: each complete argument joins your list.",
    min:180, max:300,
    terms:["hamartia", "peripeteia", "reversal", "anagnorisis", "recognition", "catharsis", "error or frailty"],
    counterStarts:["Some readers", "It could be argued", "Although", "Admittedly", "Others", "Critics such as"],
    answerStarts:["Yet", "But", "However", "Still", "Even so"],
    readings:READ,
    bank:BANK.concat(MORE),
    labels:{ reading:"Reading", own:"My own", ownLabel:"My reading, in 2–6 words", ins:"Quotation inserter", insHow:"Tap a line to insert it, with its citation, where your cursor is. Or type your own quotation with a citation such as (Hamlet 3.1.56).",
      plan:"Plan it first (optional)", planHow:"Fill the parts, then add them to your draft as a starting paragraph.", planAdd:"Add my plan to the draft", thesis:"Insert my thesis from Part 3", noThesis:"Build a thesis in Part 3’s thesis forge first.",
      draft:"Your argument", tag:"Tag your sentences", tagHow:"Tag the sentence that states the counterargument as <strong>Counter</strong> and a later sentence that answers it as <strong>Answer</strong>.", counter:"Counter", reply:"Answer", noSent:"Write a few sentences first; they’ll appear here to tag." },
    plan:[{ id:"claim", t:"Claim", ph:"Hamlet’s hamartia is…" }, { id:"ev1", t:"Evidence 1", ph:"a quotation and citation" }, { id:"ev2", t:"Evidence 2", ph:"from a different scene" }, { id:"counter", t:"Counter", ph:"It could be argued that…" }, { id:"answer", t:"Answer", ph:"Yet…" }],
    modelsLabel:"Three model arguments (three different approaches)",
    modelsNote:"The Counter and Answer tags show where a writer’s tags would sit; they aren’t part of the text.",
    models:[
      { title:"Model 1 (thinking too much)", s:[
        ["Read through Aristotle’s lens, Hamlet’s hamartia in Shakespeare’s <i>Hamlet</i> is an excess of thought that turns every chance to act into another question."],
        ["In his most famous soliloquy, Hamlet diagnoses his own condition: “the native hue of resolution / Is sicklied o’er with the pale cast of thought” " + HC(R.hue) + "."],
        ["The image is medical; thinking is a disease that drains the colour from decision."], ["When the perfect chance arrives, he proves it."],
        ["“Now might I do it pat, now he is praying” (" + R.lb6 + "), he says, and then he reasons himself out of it, wanting Claudius damned rather than saved."],
        ["This is not vice, as Aristotle would insist, but the frailty of a brilliant mind."],
        ["Even alone on stage, he accuses himself of it: “How all occasions do inform against me, / And spur my dull revenge!” (" + R.lb5 + ")."],
        ["It could be argued that Hamlet is no over-thinker at all, since he stabs Polonius without a moment’s reflection: “Dead, for a ducat, dead!” (" + R.lb7 + ").", "counter"],
        ["Yet that rash blow is the other face of the same flaw: having thought too long, he finally acts at the worst possible moment, and the reversal of his fortunes begins.", "answer"]] },
      { title:"Model 2 (rashness)", s:[
        ["Aristotle’s tragic hero falls through “some error or frailty,” and in Shakespeare’s <i>Hamlet</i> that frailty is not hesitation but rashness: Hamlet’s sudden, unweighed actions drive the play’s reversal."],
        ["Gertrude names it the instant it happens: “O, what a rash and bloody deed is this!” " + HC(R.lb2) + "."],
        ["Hamlet has stabbed through the arras without looking, hoping to find the King, and his response is careless: “Dead, for a ducat, dead!” (" + R.lb7 + ")."],
        ["Even his escape at sea, he later tells Horatio, began with an impulse: “Rashly, / And praised be rashness for it” (" + R.rashly + ")."],
        ["In each case, the impulse comes first and the thinking only afterward."],
        ["Some readers argue that Hamlet’s real problem is thinking too much, pointing to the “pale cast of thought” that sickens his resolution (" + R.pale + ").", "counter"],
        ["But those soliloquies show how Hamlet sees himself, not how he acts.", "answer"],
        ["On stage, the killing of Polonius turns Hamlet from hunter into hunted, sending him to England and bringing Laertes home for revenge."],
        ["That is the peripeteia Aristotle describes, and rashness causes it."], ["Hamlet’s error is not that he cannot act, but that he acts before he looks."]] },
      { title:"Model 3 (my own: an error of timing)", s:[
        ["It is tempting to search Shakespeare’s <i>Hamlet</i> for one fatal trait, but the play suggests that Hamlet’s hamartia is an error of judgment about timing rather than a fixed flaw of character."],
        ["Twice, Hamlet misreads his moment."],
        ["Finding Claudius alone, he holds back, convinced that killing a praying man means “And so he goes to heaven” " + HC(R.heaven) + "; yet once Hamlet leaves, Claudius admits, “My words fly up, my thoughts remain below” (" + R.words + ")."],
        ["Minutes later, Hamlet strikes blindly at the arras, sure the King is there, and kills Polonius instead, asking, “Is it the king?” (" + R.king + ")."],
        ["It could be argued, with Bradley, that a deep melancholy explains everything Hamlet does.", "counter"],
        ["Melancholy may colour his mood, but it does not explain why he is decisive in one scene and frozen in the one before.", "answer"],
        ["Aristotle wants a hero whose misfortune comes “not by vice or depravity, but by some error or frailty,” and these two misjudged moments, one too cautious and one too quick, are exactly that error."],
        ["Together they form the hinge on which the whole tragedy reverses, from the prayer scene to the final duel."]] }
    ]
  },
  cards:[
    ["Aristotle’s definition of tragedy", "“An imitation of an action that is serious, complete, and of a certain magnitude… through pity and fear effecting the proper purgation of these emotions.” (Butcher)"],
    ["Plot, “the soul of a tragedy”", "Aristotle ranks plot first and character second. Many modern readers reverse this for <em>Hamlet</em>."],
    ["Mimesis", "Imitation of life. “to hold, as ’twere, the mirror up to nature” (" + R.mirror + ")."],
    ["Hamartia", "The hero’s “error or frailty”, not vice. Example: sparing Claudius at prayer (3.3)."],
    ["Hubris", "Violent arrogance; <em>not</em> Aristotle’s term for the hero’s fault in the <em>Poetics</em>."],
    ["Peripeteia", "Reversal: the action “veers round to its opposite”. Killing Polonius (3.4)."],
    ["Anagnorisis", "Recognition: “a change from ignorance to knowledge”. “the king, the king’s to blame” (" + R.blame + ")."],
    ["Catharsis", "The purging or clarifying of pity and fear in the audience."],
    ["Unity of action", "Aristotle’s one real unity: a complete, connected action. The unities of time and place are later critics’ rules."],
    ["Pity and fear", "Pity for <em>unmerited</em> misfortune; fear for someone “like ourselves”."],
    ["Climax vs catastrophe", "The climax is the mid-play turn; the catastrophe is the final disaster (5.2)."],
    ["Freytag’s pyramid", "Exposition → inciting incident → rising action → climax → falling action → catastrophe (Gustav Freytag, 1863)."]
  ]
};
