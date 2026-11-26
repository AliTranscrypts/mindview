// ENG4U 12 Performance & Adaptation. Source: /Users/ali/Desktop/MV/Modules/eng4u/plan/modules/12-performance-and-adaptation.md
// Play text: Hamlet, Globe edition (W. G. Clark and W. Aldis Wright, 1864; public domain), quoted with Globe readings
// ("How now! a rat? Dead, for a ducat, dead!", "remember’d", "We are arrant knaves, all") and Globe act.scene.line
// numbers, read from scans of the Globe pages (Macmillan 1866 printing, margin line numbers) and cross-checked with Perseus.
// The plan’s 3.1 prose numbers (115, 119, 121–122, 129, 130, 131, 136–137), 2.2.243, 3.2.17–18, 3.4.106 and Macbeth 2.2.63
// are other editions’ numbers; they are aligned to the Globe here. Prose quotations can span two Globe lines (3.1.115–116).
// All Hamlet citations live in R (as module 08’s R table), so a class edition with other numbering changes here only.
// Macbeth 2.2 and Romeo and Juliet 2.2: Globe readings and numbers. Model director’s notes, setting arguments, readouts and
// the Part 3 feedback lines are written for the module (plan wording where the plan gives it).
// Teacher note (plan): 3.4 contains a killing and 3.1 shows Hamlet’s cruelty toward Ophelia; both are framed as choices to
// examine, never to admire.
// VERIFY: every production and adaptation description below (Olivier 1948; Branagh 1996; Almereyda 2000; RSC 2008, televised
//         2009; Bhardwaj’s Haider 2014; Stoppard 1966; Disney’s The Lion King 1994) is a general-knowledge summary from the plan.
//         None claims how a production blocked a particular moment. Check each before release.

const R = {
  speech:"3.2.1–2", suit:"3.2.19–20",
  nymph:"3.1.89–90", once:"3.1.115–116", not:"3.1.120", nunnery:"3.1.122–123", knaves:"3.1.131–132", father:"3.1.132–133", home:"3.1.134",
  plague:"3.1.139–140", arras3:"3.3.28",
  rat:"3.4.23", knowNot:"3.4.25–26", king:"3.4.26", ghost:"3.4.102", mad:"3.4.105", cruel:"3.4.178",
  prison:"2.2.249", seems:"1.2.76"
};
// Macbeth 2.2 and Romeo and Juliet 2.2 (Globe)
const MR = { daggers:"2.2.48", neptune:"2.2.60–61", colour:"2.2.64", water:"2.2.67", sleep:"2.2.36" };
const HC = (ref) => "(<i>Hamlet</i> " + ref + ")";
const MC = (ref) => "(<i>Macbeth</i> " + ref + ")";
const Q = (s) => "“" + s + "”";

// Key lines (Globe wording)
const L = {
  nymph:"Nymph, in thy orisons / Be all my sins remember’d.",
  once:"I did love you once.",
  not:"I loved you not.",
  nunnery:"Get thee to a nunnery: why wouldst thou be a breeder of sinners?",
  knaves:"We are arrant knaves, all; believe none of us.",
  father:"Where’s your father?",
  home:"At home, my lord.",
  plague:"If thou dost marry, I’ll give thee this plague for thy dowry",
  rat:"How now! a rat? Dead, for a ducat, dead!",
  knowNot:"Nay, I know not: / Is it the king?",
  mad:"Alas, he’s mad!",
  prison:"Denmark’s a prison.",
  speech:"Speak the speech, I pray you, as I pronounced it to you, trippingly on the tongue",
  suit:"suit the action to the word, the word to the action",
  cruel:"I must be cruel, only to be kind"
};

// Misconception core sentences (plan §3)
const M1 = "The text leaves gaps. Productions fill them differently. The question is which choices the words can support.";
const M2 = "Changing the setting isn’t failure. Ask what the change makes us see.";
const M3 = "Check the words first. If Hamlet asks “Is it the king?”, he can’t have known it was Polonius.";
const M4 = "Most of those directions were added by editors. The early texts give almost none.";
const M5 = "Say it again with the stress on another word. The meaning moves with the stress.";
const M6 = "A corporation, a surveillance state, a savannah: each setting makes an argument about power.";

const SET = (id) => " <button type='button' class='btn ghost sm pa-setup' data-setup='" + id + "'>Set it up</button>";

const RUBRIC = [
  ["Knowledge (scene and conventions)", "Misreads the scene", "Mostly accurate", "Accurate, with conventions used well", "Precise; notes textual gaps"],
  ["Thinking (interpretation and support)", "Choices unconnected to the text", "Some choices justified", "Choices consistently justified with text", "A coherent, original interpretation"],
  ["Communication (note: clarity, quotation, citation)", "Unclear; quotations missing", "Some integration; citation errors", "Clear note; correct citations", "Polished, persuasive note"],
  ["Application (audience effect, A2.5/A2.6 choices)", "Effect unstated or unrelated to choices", "Effect named; weak link to choices", "Effect follows from voice and body choices", "Choices build the effect moment by moment"]
];
const RUB = "<details class='alg pa-rubric'><summary>How your teacher reads it (levels 1–4)</summary><div class='tbl-wrap'><table class='topic-tbl'><thead><tr><th scope='col'>Category</th><th scope='col'>Level 1</th><th scope='col'>Level 2</th><th scope='col'>Level 3</th><th scope='col'>Level 4</th></tr></thead><tbody>" +
  RUBRIC.map((r) => "<tr>" + r.map((c) => "<td>" + c + "</td>").join("") + "</tr>").join("") + "</tbody></table></div></details>";

// Simulator choices. r = text-support rating (weak / possible / strong), why = the reason the meter shows.
const POSS = "A defensible acting choice.";
const SIM = {
  A:[
    { id:"spy", group:"Spies", label:"Spies’ position", r:"possible", why:"The text says they hide, not where.",
      options:[{ id:"screen", t:"behind a screen upstage" }, { id:"balcony", t:"on the balcony above" }, { id:"arras", t:"behind the arras at the side" }] },
    { id:"aware", group:"Hamlet", label:"Hamlet’s awareness",
      options:[{ id:"never", t:"never knows", r:"possible", why:"Nothing in his words proves he sees them." },
        { id:"notices", t:"notices at “Where’s your father?”", r:"possible", why:"The abrupt question can mark a discovery." },
        { id:"knows", t:"knows from his entrance", r:"weak", why:"He greets her gently, “" + L.nymph + "”, which is hard to square with knowing he’s watched." }] },
    { id:"oph", group:"Ophelia", label:"Ophelia at “At home, my lord.”", r:"possible", why:POSS,
      options:[{ id:"glance", t:"glances toward the hiding place" }, { id:"straight", t:"looks straight at Hamlet" }, { id:"down", t:"looks down" }] },
    { id:"vol", group:"Voice", label:"“Get thee to a nunnery”: volume", r:"possible", why:POSS, options:[{ id:"whisper", t:"whisper" }, { id:"shout", t:"shout" }] },
    { id:"pace", group:"Voice", label:"Pace", r:"possible", why:POSS, options:[{ id:"slow", t:"slow" }, { id:"urgent", t:"urgent" }] },
    { id:"stress", group:"Voice", label:"Stressed word", r:"possible", why:POSS, options:[{ id:"get", t:"Get" }, { id:"thee", t:"thee" }, { id:"nunnery", t:"nunnery" }] },
    { id:"contact", group:"Contact", label:"Physical contact", r:"possible", why:POSS,
      options:[{ id:"none", t:"none" }, { id:"grip", t:"Hamlet grips Ophelia’s wrist" }, { id:"embrace", t:"Hamlet embraces her, then pushes her away" }] }
  ],
  B:[
    // the plan rates no hiding place; the arras is the one the play names (3.3.28; Gertrude again at 4.1.9), so it can’t pull the meter below Strong (P3)
    { id:"hide", group:"Polonius", label:"Polonius’s hiding place",
      options:[{ id:"arras", t:"behind the arras, centre", r:"strong", why:"Polonius plans it: “Behind the arras I’ll convey myself” " + HC(R.arras3) + "." },
        { id:"screen", t:"behind a folding screen, side", r:"possible", why:"The play names an arras, but a screen can do the same work." }] },
    { id:"belief", group:"Hamlet", label:"Hamlet’s belief about who is hidden",
      options:[{ id:"hopes", t:"hopes it’s Claudius", r:"strong", why:"He asks, “Is it the king?” " + HC(R.king) + "." },
        { id:"care", t:"doesn’t care who", r:"possible", why:"Rash, but his question suggests hope." },
        { id:"knows", t:"knows it’s Polonius", r:"weak", why:"“" + L.knowNot + "” says otherwise." }] },
    { id:"thrust", group:"Hamlet", label:"The thrust",
      options:[{ id:"instant", t:"instant", r:"strong", why:"“" + L.rat + "” " + HC(R.rat) + " is quick and broken." },
        { id:"pause", t:"after a pause", r:"possible", why:"A pause adds thought the text doesn’t show." }] },
    { id:"ghost", group:"The Ghost", label:"The Ghost (at " + R.ghost + ")",
      options:[{ id:"aud", t:"visible to the audience only", r:"strong", why:"Gertrude sees nothing: “" + L.mad + "” " + HC(R.mad) + "." },
        { id:"all", t:"visible to everyone", r:"weak", why:"Then why can’t Gertrude see it?" },
        { id:"none", t:"invisible (a light and a sound only)", r:"possible", why:"It leaves open whether Hamlet imagines it." }] }
  ]
};

const TH = (cells) => "<tr>" + cells.map((c) => "<th scope='col'>" + c + "</th>").join("") + "</tr>";
const TR = (cells) => "<tr>" + cells.map((c) => "<td>" + c + "</td>").join("") + "</tr>";
const ATT_TABLE = "<h4 class='pa-th'>Hamlet’s attitude (Scene A)</h4><div class='tbl-wrap'><table class='topic-tbl'><thead>" + TH(["Awareness", "Volume", "Contact", "Attitude reads as"]) + "</thead><tbody>" +
  [["Notices", "Whisper", "None, or embrace then push", "<strong>Protective</strong>: urging her away from a corrupt court"], ["Notices", "Whisper", "Grips wrist", "<strong>Anguished</strong>"],
    ["Notices", "Shout", "None", "<strong>Testing</strong>: performing madness for the hidden audience"], ["Notices or never", "Shout", "Grips wrist, or embrace then push", "<strong>Cruel</strong>"],
    ["Never", "Whisper", "Any", "<strong>Anguished</strong>"], ["Never", "Shout", "None", "<strong>Anguished</strong>"], ["Knows from entrance", "Any", "Any", "<strong>Cold performance</strong>"]].map(TR).join("") + "</tbody></table></div>";
const RATE_W = { weak:"<strong>Weak</strong>", possible:"Possible", strong:"<strong>Strong</strong>" };
const SUPPORT_TABLE = "<h4 class='pa-th'>Text support ratings (the m&#101;ter shows the lowest)</h4><div class='tbl-wrap'><table class='topic-tbl'><thead>" + TH(["Choice", "Rating", "Reason shown"]) + "</thead><tbody>" +
  ["A", "B"].map((sc) => SIM[sc].map((c) => c.r ? TR([(sc === "B" ? "Scene B: " : "") + c.label + " (any)", RATE_W[c.r], c.why]) : c.options.map((o) => TR([(sc === "B" ? "Scene B: " : "") + c.label + ": " + o.t, RATE_W[o.r], o.why])).join("")).join("")).join("") + "</tbody></table></div>";

const EVID = [
  { id:"e1", t:L.not, ref:R.not },
  { id:"e2", t:L.plague, ref:R.plague },
  { id:"e3", t:L.nunnery, ref:R.nunnery },
  { id:"e4", t:L.knaves, ref:R.knaves },
  { id:"e5", t:L.once, ref:R.once },
  { id:"e6", t:L.father, ref:R.father }
];

export default {
  id:"12-performance-and-adaptation",
  kind:"topic",
  title:"Performance and adaptation",
  topic:"Performance & Adaptation",
  readyTopic:"staging <em>Hamlet</em>",
  hero:{
    headline:"The words are only half the play",
    text:"Hamlet coaches a troupe of actors: speak lightly, don’t overact, “suit the action to the word.” He knows a line can be ruined or made by its delivery. In this module you’ll <strong>block</strong> scenes (decide where everyone stands and moves), choose <strong>how lines are spoken</strong>, and test every choice against the words. Then you’ll see how films and retellings <strong>adapt</strong> <em>Hamlet</em>, and what each change argues.",
    muted:"Work through the six parts in order. Your answers save on this device as you go, so you can stop and come back later.</p><p class='muted pa-cnote' role='note'><strong>Content note:</strong> the closet scene (3.4) contains a killing, and the nunnery scene (3.1) shows Hamlet’s cruelty toward Ophelia. This module treats both as choices to examine, never as behaviour to admire.",
    fig:{ html:"<div class='pa-hero' id='pa-hero' role='group' aria-label='Hamlet’s line “Speak the speech, I pray you, as I pronounced it to you, trippingly on the tongue”, performed three ways. Under it, three waveform strips: quick and light, with the words “trippingly on the tongue” bouncing in small steps; slow and heavy, with the words dragging; and flat, with the words sitting still.'></div>", caption:"" },
    line:L.speech,
    cite:HC(R.speech),
    bounce:"trippingly on the tongue",
    ways:[
      { id:"light", t:"Quickly and lightly", rate:1.3, volume:0.9, pitch:1.15 },
      { id:"heavy", t:"Slowly and heavily", rate:0.62, volume:1, pitch:0.85 },
      { id:"flat", t:"Flatly", rate:1, volume:0.75, pitch:1 }
    ],
    caption:"Same words. Three performances. Which one sounds like the advice it gives?",
    listen:"Listen to all three", watch:"Watch again", play:"Play", noVoice:"No reading voice on this device. Read the line aloud yourself, three ways."
  },
  goals:[
    "I can explain how blocking, delivery and design turn a script into an interpretation.",
    "I can justify a staging choice with evidence from the text, and judge how well a choice is supported.",
    "I can use and analyse vocal strategies (stress, pace, pause, volume) and non-verbal cues to change a line’s meaning.",
    "I can compare productions and adaptations and evaluate what their changes reveal.",
    "I can tell Shakespeare’s few original stage directions from editors’ later additions.",
    "I can design and defend my own staging of a scene for a real audience."
  ],
  start:{
    blocks:[{ title:"Word story: hypocrite", html:"<p><strong><em>Hypocrite</em></strong> comes from Greek <em>hypokritēs</em>, “stage actor”, one who answers or interprets on stage. An actor’s skill at seeming became a word for pretending to be what you’re not.</p><p><em>Hamlet</em> lives inside that double meaning: a play about a court of pretenders, whose hero hires actors to catch a liar.</p>" }],
    warmup:{
      questions:[
        { id:"w1", skill:"Dramatic conventions", goal:1, prompt:"What is an <strong>aside</strong>?",
          options:[{ t:"A short remark a character makes to the audience (or one other character) that others on stage don’t hear", ok:true, why:"Asides let the audience in on a secret." },
            { t:"A long speech spoken alone on stage", why:"That’s a soliloquy." },
            { t:"A stage direction telling actors where to stand", why:"That describes blocking notes, not an aside." },
            { t:"A scene cut from performances", why:"“Aside” here doesn’t mean “set aside”." }],
          hints:["Who hears it?", "The other characters don’t.", "A brief remark the others can’t hear."] },
        { id:"w2", skill:"Dramatic conventions", goal:1, prompt:"<strong>Dramatic irony</strong> is when…",
          options:[{ t:"the audience knows something a character doesn’t", ok:true, why:"As when we know Polonius and Claudius are listening, but Hamlet may not." },
            { t:"a character says the opposite of what they mean", why:"That’s verbal irony." },
            { t:"the ending is sad", why:"That confuses irony with tragedy." },
            { t:"the play is set in the past", why:"That’s unrelated to irony." }],
          hints:["Who knows more, the audience or the character?", "The audience.", "Dramatic irony."] },
        { id:"w3", skill:"Iambic stress", goal:3, prompt:"In “" + L.once + "” " + HC(R.once) + ", the natural iambic rhythm stresses which words?",
          options:[{ t:"“did” and “you”", ok:true, why:"i-AMB: I DID love YOU once. (Actors often add weight to “once” too.)" },
            { t:"“I” and “love”", why:"That stresses every pronoun; say it aloud." },
            { t:"“love” only", why:"There’s more than one stress in the line." },
            { t:"No words; prose has no stress", why:"This line sits inside prose, but spoken English always has stress." }],
          hints:["Say it aloud: da-DUM da-DUM.", "I did / love you.", "DID and YOU."] },
        { id:"w4", skill:"<em>Hamlet</em>’s plot", goal:2, prompt:"Who is hiding to spy on Hamlet in the “nunnery” scene (3.1)?",
          options:[{ t:"Claudius and Polonius", ok:true, why:"They set Ophelia in Hamlet’s path and watch." },
            { t:"Gertrude and Horatio", why:"Wrong characters." },
            { t:"Rosencrantz and Guildenstern", why:"They spy on him elsewhere." },
            { t:"The Ghost", why:"The Ghost appears in 1.5 and 3.4." }],
          hints:["Ophelia’s father is one of them.", "The other is the king.", "Claudius and Polonius."] },
        { id:"w5", skill:"<em>Hamlet</em>’s plot", goal:2, prompt:"In the closet scene (3.4), whom does Hamlet kill behind the arras?",
          options:[{ t:"Polonius", ok:true, why:"He stabs through the tapestry." },
            { t:"Claudius", why:"Hamlet <em>hopes</em> it is Claudius (“Is it the king?”)." },
            { t:"Laertes", why:"Laertes returns later." },
            { t:"Rosencrantz", why:"Unrelated." }],
          hints:["He calls the hidden man a “rat”.", "It’s Ophelia’s father.", "Polonius."] },
        { id:"w6", skill:"MLA citation for drama", goal:2, prompt:"Cite line 23 of Act 3, scene 4 of <em>Hamlet</em>.",
          options:[{ t:"(<i>Hamlet</i> 3.4.23)", ok:true, why:"Title, then act.scene.line, with periods between the numbers." },
            { t:"(Shakespeare 23)", why:"That’s the format for prose." },
            { t:"(<i>Hamlet</i>, Act 3, line 23)", why:"It leaves out the scene, and writes it out." },
            { t:"(3, 4, 23)", why:"Commas instead of periods, and no title on first use." }],
          hints:["Title, then act.scene.line.", "Periods between the numbers.", "(<i>Hamlet</i> 3.4.23)."] }
      ],
      refreshers:{
        "Dramatic conventions":"Soliloquy: alone, thinking aloud. Aside: a brief remark others don’t hear. Dramatic irony: the audience knows more than a character.",
        "Iambic stress":"Iambic pentameter alternates unstressed and stressed: da-DUM ×5. Actors keep or break the pattern to shape meaning.",
        "<em>Hamlet</em>’s plot":"Act 3. 3.1: the nunnery scene, with Claudius and Polonius spying. 3.2: the Mousetrap play. 3.3: Claudius prays. 3.4: Hamlet kills Polonius and confronts Gertrude; the Ghost appears.",
        "MLA citation for drama":"(<i>Hamlet</i> 3.4.23): act.scene.line."
      }
    }
  },
  explore:{
    heading:"Stage simulator",
    intro:"You’re the director. Choose where the spies hide, what Hamlet knows, and how the lines sound. The audience panel tells you what your choices make people believe, and the support m&#101;ter tells you whether the words back you up.",
    modes:[{ id:"block", t:"Block" }, { id:"audience", t:"Audience" }, { id:"settings", t:"Settings" }],
    modeHow:{
      block:"Set the choices, then press <strong>Play the key lines</strong>: the lines play at your pace and stress, and the tokens move on the stage.",
      audience:"The readout and the support m&#101;ter are open, with one sentence on what the audience now believes.",
      settings:"Choose a setting drawn from a well-known production, described in words only. It changes the backdrop and adds a line to the readout. Settings never claim how a production staged a particular moment."
    },
    scenes:[{ id:"A", t:"Scene A (3.1, nunnery)" }, { id:"B", t:"Scene B (3.4, closet)" }],
    sceneNote:{
      A:"Ophelia returns Hamlet’s gifts while Claudius and Polonius secretly watch (<i>Hamlet</i> 3.1).",
      B:"Polonius hides behind the arras; Hamlet kills him; the Ghost appears to Hamlet alone (<i>Hamlet</i> 3.4)."
    },
    sim:SIM,
    defaults:{ A:{ spy:"screen", aware:"never", oph:"glance", vol:"whisper", pace:"slow", stress:"nunnery", contact:"none" }, B:{ hide:"arras", belief:"hopes", thrust:"instant", ghost:"aud" } },
    // key lines played by "Play the key lines"; who: H Hamlet, O Ophelia, Q Gertrude (the Queen); cue: what moves on stage
    play:{
      A:[{ who:"H", t:L.nymph, ref:R.nymph, cue:"enter" }, { who:"H", t:L.once, ref:R.once }, { who:"H", t:L.not, ref:R.not },
        { who:"H", t:L.nunnery, ref:R.nunnery, cue:"nunnery" }, { who:"H", t:L.knaves, ref:R.knaves },
        { who:"H", t:L.father, ref:R.father, cue:"father" }, { who:"O", t:L.home, ref:R.home, cue:"home" }],
      B:[{ who:"P", t:"(Polonius hides.)", cue:"hide", silent:true }, { who:"H", t:L.rat, ref:R.rat, cue:"thrust" }, { who:"H", t:L.knowNot, ref:R.knowNot, cue:"king" },
        { who:"G", t:"(The Ghost enters, " + R.ghost + ".)", cue:"ghost", silent:true }, { who:"Q", t:L.mad, ref:R.mad, cue:"mad" }]
    },
    names:{ H:"Hamlet", O:"Ophelia", C:"Claudius", P:"Polonius", G:"Ghost", Q:"Gertrude (the Queen)" },
    attitudes:{ protective:"Protective: urging her away from a corrupt court", anguished:"Anguished", testing:"Testing: performing madness for the hidden audience", cruel:"Cruel", cold:"Cold performance" },
    attShort:{ protective:"Protective", anguished:"Anguished", testing:"Testing", cruel:"Cruel", cold:"Cold performance" },
    ophelia:{ glance:"Torn between father and Hamlet", straight:"Loyal to Hamlet, or lying boldly", down:"Ashamed, obedient" },
    focus:{ get:"Command", thee:"Personal", nunnery:"Escape from the world" },
    killing:{ hopes:"aimed at the King he hopes is there", care:"aimed at whoever is there", knows:"aimed at Polonius", instant:"Rash", pause:"Considered" },
    ghostReads:{ aud:"Real, but seen by Hamlet alone", all:"Plainly real to everyone", none:"Perhaps in Hamlet’s mind" },
    gertrudeSees:{ aud:"Nothing: “" + L.mad + "”", all:"The Ghost (so why “" + L.mad + "”?)", none:"Nothing: “" + L.mad + "”" },
    believes:{
      A:{ knows:"Hamlet has known all along that he is watched, so everything he says to Ophelia is a performance for the hidden listeners.",
        notices:"Hamlet discovers the spies at “" + L.father + "”, so his anger after it answers a betrayal.",
        never:"Hamlet never knows he is watched; only we see the spies, so his words are meant for Ophelia alone." },
      B:{ hopes:"Hamlet strikes at the hiding place hoping to kill the King, and kills the wrong man.", care:"Hamlet strikes at whoever is hidden, without stopping to ask who.", knows:"Hamlet kills Polonius knowing who he is." },
      ghost:{ aud:"The Ghost is real, but only Hamlet (and we) can see it.", all:"The Ghost is plain to everyone, which makes Gertrude’s “" + L.mad + "” hard to explain.", none:"We can’t be sure the Ghost is there at all." },
      treat:"His treatment of Ophelia reads as ", she:"; Ophelia seems "
    },
    readout:{ spies:"Audience knows about the spies", hidden:"Audience knows about the hiding", att:"Hamlet’s attitude reads as", oph:"Ophelia reads as", focus:"Focus of “Get thee to a nunnery”",
      kill:"The killing reads as", ghost:"The Ghost reads as", gert:"What Gertrude sees", support:"Text support", tension:"Tension", setting:"This setting emphasizes", believes:"What the audience now believes" },
    yes:"Yes: they watch the spies hide", yesB:"Yes: they see Polonius hide",
    meter:{ title:"Support m&#101;ter", weak:"Weak", possible:"Possible", strong:"Strong", lowest:"Lowest choice", allStrong:"Every choice is rated Strong." },
    model:"A model of how audiences often read these choices, not a rule.",
    presets:[
      // VERIFY: production details in d (Olivier 1948, Branagh 1996, Almereyda 2000, RSC 2008 televised 2009).
      { id:"globe", t:"Elizabethan Globe", d:"A bare thrust stage in daylight, the audience on three sides", e:"Words and the actor’s body; the audience as witnesses" },
      { id:"olivier", t:"Postwar film, black and white", d:"Laurence Olivier’s 1948 film: shadowy castle stairways, some soliloquies heard as voice-over", e:"Hamlet’s inner mind and isolation" },
      { id:"palace", t:"Nineteenth-century palace", d:"Kenneth Branagh’s 1996 film: a full-text version in a glittering, mirrored palace", e:"Political spectacle and self-regard" },
      { id:"corporate", t:"Corporate tower", d:"Michael Almereyda’s 2000 film: contemporary New York; “Denmark” as a corporation", e:"Corporate power, screens and surveillance" },
      { id:"surveillance", t:"Surveillance state", d:"The Royal Shakespeare Company’s 2008 staging (televised 2009) with security cameras", e:"A court where everyone is watched" }
    ],
    presetNone:"No setting chosen: a bare rehearsal floor.",
    slots:{ title:"Two stagings (for challenge 3)", how:"Set up Scene A, then save it into a slot. For each saved staging, choose the line that best supports it.",
      s1:"Staging 1: Cruel", s2:"Staging 2: Protective", save:"Save the current Scene A staging here", load:"Load it onto the stage", empty:"Nothing saved yet.", evidence:"Line that best supports it" },
    evidence:EVID,
    aha:"The words limit some choices and leave others open. The art is finding the choices the words <em>permit</em> and the audience will <em>feel</em>.",
    noVoice:"No reading voice on this device: the delivery is shown in type (bold = stress, ‖ = pause). Read it aloud yourself.",
    predIntro:"Make a prediction first. Then the stage plays it out.",
    predictions:[
      { id:"p1", start:{ mode:"block", scene:"A", stress:"nunnery" },
        prompt:"Move the stress from “nunnery” to “thee” in “Get thee to a nunnery”. What changes?",
        options:[{ t:"It becomes personal: Hamlet singles Ophelia out, as if she in particular must be sent away", ok:true }, { t:"Nothing; stress doesn’t change meaning" }, { t:"The line now rhymes" }, { t:"It becomes a question" }],
        explain:"Stress tells the listener which word carries the weight. The Focus row moved from “escape from the world” to “personal”. " + M5 },
      { id:"p2", start:{ mode:"block", scene:"A", aware:"never" },
        prompt:"Switch Hamlet to notice the spies at “Where’s your father?”. What happens to Ophelia’s reply, “At home, my lord”?",
        options:[{ t:"It becomes a lie that Hamlet recognizes, so his anger afterward reads as a response to betrayal", ok:true }, { t:"It becomes true" }, { t:"It is cut from the scene" }, { t:"Ophelia becomes the play’s villain" }],
        explain:"One choice rewrites the meaning of the lines around it. Neither version is “correct”; both are possible. " + M1 },
      { id:"p3", start:{ mode:"block", scene:"B", thrust:"instant" },
        prompt:"Add a pause before “How now! a rat?”. What does the pause suggest?",
        options:[{ t:"That Hamlet thinks before he strikes, which softens the rashness the broken line suggests", ok:true }, { t:"That he knows it’s Polonius" }, { t:"That he’s afraid of rats" }, { t:"Nothing" }],
        explain:"The text’s rhythm is fast and broken. A pause is allowed, but it pulls against the words: the m&#101;ter dropped from Strong to Possible." },
      { id:"p4", start:{ mode:"settings", preset:"corporate" }, line:L.prison, ref:R.prison,
        prompt:"In a glass office tower, how might Hamlet’s “" + L.prison + "” " + HC(R.prison) + " land?",
        options:[{ t:"As a comment on corporate power and constant screens: the prison is the company", ok:true }, { t:"It must be cut; it no longer makes sense" }, { t:"It means Hamlet is literally in jail" }, { t:"Exactly as in a castle" }],
        explain:"A setting is an argument. The same line now points at a different kind of power. " + M6 }
    ],
    chalIntro:"Use the stage to meet each goal, then press <strong>Check challenge</strong>. <strong>Set it up</strong> opens the right scene. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 6], prompt:"Stage Scene A so the audience sees Hamlet <strong>discover</strong> that he is being watched, with no choice rated Weak." + SET("tc1"),
        msgs:{ knows:"Then why does he greet her so gently: “" + L.nymph + "”? The text doesn’t support it (Weak).", never:"Then there’s no discovery for the audience to see. Try the moment of his sudden question." },
        general:"Not yet. Set Hamlet’s awareness so the audience sees a discovery, and keep every choice Possible or better.",
        why:"The abrupt “" + L.father + "” " + HC(R.father) + " can mark a discovery, and nothing else in your staging pulls against the words.",
        hints:["Find the line where his tone changes suddenly.", "“Where’s your father?” comes out of nowhere.", "Set awareness to “notices at Where’s your father?”."] },
      { id:"tc2", goal:[2, 3], prompt:"Stage Scene B so the killing reads as <strong>rash action</strong> against the man Hamlet hopes is the King, with every choice rated Possible or Strong." + SET("tc2"),
        msgs:{ knows:"He asks “Is it the king?” " + HC(R.king) + ". He didn’t know.", pause:"A pause suggests deliberation. The task asks for rashness.", all:"Gertrude says “" + L.mad + "” " + HC(R.mad) + ", so she can’t see it." },
        general:"Not yet. The killing should be rash, and aimed at the man Hamlet hopes is the King.",
        why:"Hope (“Is it the king?”), speed (“" + L.rat + "”) and a Ghost Gertrude can’t see: every choice has the words behind it.",
        hints:["What does Hamlet ask right after the thrust?", "“Is it the king?” shows his hope.", "Hopes it’s Claudius, instant thrust, and a Ghost Gertrude can’t see."] },
      { id:"tc3", goal:[2, 6], stretch:true,
        prompt:"Make <strong>two</strong> stagings of Scene A with opposite readings of how Hamlet treats Ophelia: one that reads as <strong>Cruel</strong> and one that reads as <strong>Protective</strong>, with no choice rated Weak. For each, choose the line that best supports it. Use the <em>Two stagings</em> board under the stage." + SET("tc3"),
        answer:{ s1:["e1", "e2"], s2:["e3", "e4"] },
        msgs:{ empty:"Save two stagings first: a Cruel one in slot 1 and a Protective one in slot 2.",
          shout:"Shouting reads as Cruel or Testing in this simulator. Protective needs a whisper.",
          unaware:"If he doesn’t know they’re watched, the whisper reads as Anguished. Protective means he’s warning her away from the watchers.",
          knavesCruel:"That line condemns everyone, himself included. It supports protection more than cruelty.",
          once:"It’s tender and painful, which makes it ambiguous evidence. Choose a line that clearly leans one way.",
          weak:"One choice in that staging is rated Weak. Check the support m&#101;ter and the reason it gives.",
          noLine:"Choose a supporting line for each saved staging.",
          notCruel:"Staging 1 doesn’t read as Cruel yet. Check the attitude table under the stage.",
          notProt:"Staging 2 doesn’t read as Protective yet. Check the attitude table under the stage.",
          lineCruel:"That line doesn’t lean toward cruelty. Look for one where he takes back his love or curses her future.",
          lineProt:"That line doesn’t lean toward protection. Look for one where he warns her away from a corrupt world." },
        general:"Not yet. Check each slot’s reading, its m&#101;ter and its line.",
        banner:"Same words, opposite Hamlets, and both defensible. That’s why directors argue, and why the play survives them.",
        why:"Same words, opposite Hamlets, and both defensible. That’s why directors argue, and why the play survives them.",
        hints:["Check the attitude table: which combination gives Protective?", "Protective: notices + whisper + no wrist grip. Cruel: shout + a grip or a push.", "Cruel ↔ “" + L.not + "” Protective ↔ “" + L.knaves + "”"] }
    ],
    blocks:[{ title:"How the simulator reads your choices", html:"<p class='muted'>A model of how audiences often read these choices, not a rule. Where does it oversimplify? That’s a good argument to have.</p>" + ATT_TABLE + SUPPORT_TABLE }]
  },
  part3:{
    slug:"adaptation", name:"Adaptation", heading:"Adaptation as interpretation",
    intro:"Explore worked inside one production. Now step back and compare whole adaptations: where each sits between the text and a loose retelling, what its setting argues, and what a single cut changes.",
    stations:{
      s1:{ title:"Station 1: the fidelity spectrum", how:"Tap a card, then tap a place on the line from “close to the text” to “loose retelling”. Tap a placed card to move it. Press <strong>Check the order</strong> when all five are placed.",
        ends:["Close to the text", "Loose retelling"],
        // VERIFY: each card’s production details before release.
        cards:[
          { id:"full", t:"A full-text film", d:"Almost every line kept; nineteenth-century palace setting (Branagh, 1996)" },
          { id:"modern", t:"A modern-dress film", d:"Contemporary New York and a corporation called Denmark; the text heavily cut (Almereyda, 2000)" },
          { id:"relocated", t:"A relocated film", d:"A story drawn from <em>Hamlet</em> set during conflict in Kashmir, in a different language (Vishal Bhardwaj’s <em>Haider</em>, 2014)" },
          { id:"side", t:"A play from the side", d:"The story told by Rosencrantz and Guildenstern, two minor characters who don’t understand the play they’re in (Tom Stoppard’s <em>Rosencrantz and Guildenstern Are Dead</em>, 1966)" },
          { id:"animated", t:"An animated retelling", d:"A lion prince, a murdered king-father and a usurping uncle; no Shakespeare lines (Disney’s <em>The Lion King</em>, 1994; widely described as drawing on <em>Hamlet</em>)" }
        ],
        answer:[["full"], ["modern"], ["relocated"], ["side", "animated"], ["side", "animated"]],
        fb:{ full:"The full-text film keeps almost every line, so it sits closest to the text, whatever its setting.",
          modern:"The modern-dress film still speaks Shakespeare’s words, though heavily cut, so it sits next to the full-text film.",
          relocated:"The relocated film keeps a story drawn from <em>Hamlet</em> but tells it in another language: Shakespeare’s plot, not his words. It sits in the middle.",
          loose:"The play from the side and the animated retelling leave Shakespeare’s scenes behind, so they sit at the loose end.",
          place:"Place all five cards first." },
        done:"That order works. The play from the side and the animated retelling can sit in either order: both are loose retellings.",
        prompt:"Closer isn’t automatically better. Choose one loose card and write one sentence on what it reveals that a faithful version might hide.",
        loose:["relocated", "side", "animated"], sentence:"Your sentence", check:"Check the order", reset:"Start over" },
      s2:{ title:"Station 2: what does the setting argue?", how:"Tap a setting, then tap the argument it makes.",
        settings:[{ id:"corporate", t:"Corporate tower" }, { id:"surveillance", t:"Surveillance state" }, { id:"kashmir", t:"Kashmir in conflict" }, { id:"savannah", t:"Savannah kingdom" }, { id:"palace", t:"Glittering palace" }],
        args:[{ id:"a1", t:"Power is money and screens" }, { id:"a2", t:"Everyone is watched; privacy is gone" }, { id:"a3", t:"Political violence and loss as the ground of grief" }, { id:"a4", t:"Growing up and claiming your place" }, { id:"a5", t:"Power as public spectacle" }],
        answer:{ corporate:"a1", surveillance:"a2", kashmir:"a3", savannah:"a4", palace:"a5" },
        why:{ corporate:"A glass tower turns the throne into a company: power is ownership, and screens are everywhere.",
          surveillance:"Cameras turn the court’s spying (Polonius, Claudius, Rosencrantz and Guildenstern) into a system: no one is unwatched.",
          kashmir:"In a real conflict, a son’s grief grows from political violence and loss, not one family’s crime alone.",
          savannah:"A cub who must grow up and take back his father’s place: the story becomes a coming of age.",
          palace:"Gilt and mirrors make the court a show: power is something rulers perform in public." },
        wrong:"That setting points somewhere else. " + M6 + " Ask what this one makes us see first." },
      s3:{ title:"Station 3: cut or keep?", prompt:"Many productions cut Fortinbras, the Norwegian prince who arrives at the end and takes the throne. Predict what is lost.",
        options:[{ t:"The political frame: a foreign power inherits a Denmark that destroyed itself", ok:true, why:"He’s the outside power that inherits the wreck." },
          { t:"Nothing; he’s a minor character", why:"Minor in lines, not in meaning: he decides who rules Denmark at the end." },
          { t:"The poisoning plot", why:"The poisonings belong to Claudius and Laertes, not Fortinbras." },
          { t:"Ophelia’s story", why:"Fortinbras never meets Ophelia." }],
        then:"A production that cuts him tells a family tragedy; one that keeps him tells a national one." }
    },
    blocks:[{ title:"Craft → meaning", html:"<p>Every adaptation answers the question “What is <em>Hamlet</em> about?” Its cuts and changes are its answer. Reading an adaptation well means reading those choices as arguments.</p>" }],
    quickCheck:{ title:"Adaptation quick check", summary:"Adaptation quick check",
      items:[
        { id:"q1", goal:4, prompt:"A film keeps every line but moves the play to the 1800s. Where does it sit on the spectrum?",
          choices:[{ t:"Close to the text", ok:true, fb:"Right. The words stay, so it’s close, even with a new setting." }, { t:"Loose retelling", fb:"The words stay, so it’s close, even with a new setting." },
            { t:"Not an adaptation", fb:"The words stay, so it’s close, even with a new setting." }, { t:"A parody", fb:"The words stay, so it’s close, even with a new setting." }] },
        { id:"q2", goal:4, prompt:"Which question best evaluates an adaptation?",
          choices:[{ t:"What do its changes reveal?", ok:true, fb:"Right. Fidelity is one measure; insight is the better one." }, { t:"How many lines did it keep?", fb:"Fidelity is one measure; insight is the better one. " + M2 },
            { t:"Is it older or newer?", fb:"Fidelity is one measure; insight is the better one. " + M2 }, { t:"Is it in colour?", fb:"Fidelity is one measure; insight is the better one. " + M2 }] },
        { id:"q3", goal:4, prompt:"Cutting Fortinbras most changes…",
          choices:[{ t:"the political frame", ok:true, fb:"Right. He’s the outside power that inherits the wreck." }, { t:"the poison plot", fb:"He’s the outside power that inherits the wreck." },
            { t:"Ophelia’s songs", fb:"He’s the outside power that inherits the wreck." }, { t:"nothing", fb:"He’s the outside power that inherits the wreck." }] },
        { id:"q4", goal:4, prompt:"A surveillance-state setting emphasizes which thread in <em>Hamlet</em>?",
          choices:[{ t:"Spying and being watched", ok:true, fb:"Right. Polonius, Claudius, Rosencrantz and Guildenstern all watch Hamlet." }, { t:"Graveyards", fb:"Polonius, Claudius, Rosencrantz and Guildenstern all watch Hamlet." },
            { t:"Sea voyages", fb:"Polonius, Claudius, Rosencrantz and Guildenstern all watch Hamlet." }, { t:"Wedding feasts", fb:"Polonius, Claudius, Rosencrantz and Guildenstern all watch Hamlet." }] }
      ] },
    blocksAfter:[{ type:"write", id:"steal", title:"Sentence to steal",
      html:"<p class='steal-line'>“" + L.suit + "”</p><p class='eng-cite'>" + HC(R.suit) + "</p><p><strong>The shape:</strong> a chiasmus, A-to-B then B-to-A, so the two halves mirror each other.</p><p><strong>Frame:</strong> “______ the ______ to the ______, the ______ to the ______.”</p><p><strong>Model imitation:</strong> “Fit the story to the stage, the stage to the story.”</p>",
      prompt:"Your imitation" }],
    steal:{ master:L.suit, source:"Hamlet " + R.suit, save:"Save it to my Art of Language notebook" }
  },
  practice:{
    activities:[
      { id:"three", type:"custom", title:"Read it three ways", summary:"Read it three ways", goal:3,
        instruction:"Each card plays a line with one delivery: stress is shown in bold, and a pause is marked ‖. Match it to the meaning it produces.",
        leftTitle:"Delivery", rightTitle:"Meaning",
        left:[
          { id:"l1", t:"“<strong>Seems</strong>, madam! nay, it is”", say:[["Seems", 1], [", madam! nay, it is."]], ref:R.seems },
          { id:"l2", t:"“Seems, madam! nay, it <strong>is</strong>”", say:[["Seems, madam! nay, it"], ["is.", 1]], ref:R.seems },
          { id:"l3", t:"“I <strong>did</strong> love you once.”", say:[["I"], ["did", 1], ["love you once."]], ref:R.once },
          { id:"l4", t:"“I did love you <strong>once</strong>.”", say:[["I did love you"], ["once.", 1]], ref:R.once },
          { id:"l5", t:"“Where’s your father? ‖” <span class='pa-dnote'>(pause after)</span>", say:[["Where’s your father?"], ["‖"]], ref:R.father },
          { id:"l6", t:"“‖ Where’s your father?” <span class='pa-dnote'>(pause before)</span>", say:[["‖"], ["Where’s your father?"]], ref:R.father },
          { id:"l7", t:"“I must be <strong>cruel</strong>, only to be kind.” " + HC(R.cruel), say:[["I must be"], ["cruel,", 1], ["only to be kind."]], ref:R.cruel },
          { id:"l8", t:"“I must be cruel, only to be <strong>kind</strong>.”", say:[["I must be cruel, only to be"], ["kind.", 1]], ref:R.cruel }
        ],
        right:[
          { id:"r1", t:"Scornful of the very word: he refuses appearances" },
          { id:"r2", t:"Insisting on reality: his grief is real" },
          { id:"r3", t:"Defending a past love she doubts" },
          { id:"r4", t:"Pointing to an ending: the love is over" },
          { id:"r5", t:"A trap: waiting to see whether she’ll lie" },
          { id:"r6", t:"A sudden realization breaking through" },
          { id:"r7", t:"Owning the harshness" },
          { id:"r8", t:"Insisting on the good intention" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        why:{ l1:"Stress on “Seems” throws the word back at Gertrude: he refuses appearances.", l2:"Stress on “is” insists on what is real: his grief is not a show.",
          l3:"Stress on “did” defends a love she doubts.", l4:"Stress on “once” closes the door: the love is over.",
          l5:"The pause after the question waits for her answer: a trap.", l6:"The pause before it lets a thought break through: a sudden realization.",
          l7:"Weight on “cruel” owns the harshness.", l8:"Weight on “kind” insists on the good intention." },
        wrong:{ "l3|r4":"Stress “did” to defend; stress “once” to close the door.", "l4|r3":"Stress “did” to defend; stress “once” to close the door.",
          "l5|r6":"Where the pause falls changes who’s in control.", "l6|r5":"Where the pause falls changes who’s in control." },
        wrongDefault:"Say it aloud with the stress where it’s shown. Which word carries the weight?",
        hints:["Listen for the loudest word.", "What does that word make the line about?"],
        play:"Play", noVoice:"No reading voice on this device. Read each card aloud yourself, with the stress and pause shown." },
      { id:"macbeth", type:"mc", title:"Direct an unseen scene: <em>Macbeth</em> 2.2", summary:"Direct an unseen scene", star:true, goal:[2, 5],
        instruction:"<span class='pa-ctx'><strong>Context card:</strong> Macbeth has just killed King Duncan offstage. He returns to Lady Macbeth.</span> You’re the director. Choose the staging the words support best. The last two decisions sit above Final Check level.",
        items:[
          { id:"d1", goal:2, prompt:"What is Macbeth carrying when he enters?",
            options:[{ t:"The bloody daggers", ok:true, why:"Lady Macbeth asks, “Why did you bring these daggers from the place?” " + MC(MR.daggers) + ", so he still has them." },
              { t:"Nothing", why:"Someone asks him why he brought something. Find her question." }, { t:"A torch", why:"Nothing in the lines calls for light. Find her question about what he brought." }, { t:"The crown", why:"Duncan’s crown isn’t mentioned. Find her question about what he brought." }],
            hints:["Lady Macbeth asks him a question about something he brought.", "“Why did you bring these … from the place?”", "The bloody daggers: “Why did you bring these daggers from the place?” " + MC(MR.daggers) + "."] },
          { id:"d2", goal:2, prompt:"How should Macbeth deliver “Will all great Neptune’s ocean wash this blood / Clean from my hand?” " + MC(MR.neptune) + "?",
            options:[{ t:"Staring at his hands, slowly", ok:true, why:"The question is addressed to his own hands; horror, not argument." },
              { t:"Laughing", why:"Nothing in the line is light. Who, or what, is he talking to?" }, { t:"Shouting at Lady Macbeth", why:"He isn’t arguing with her here. Look at what the line is about." }, { t:"Running offstage", why:"He stays to ask the question. What is he looking at?" }],
            hints:["What is the line about?", "His own bloody hand.", "Staring at his hands, slowly: horror, not argument."] },
          { id:"d3", goal:2, prompt:"When Lady Macbeth returns, what should the audience see?",
            options:[{ t:"Blood on her hands too", ok:true, why:"“My hands are of your colour” " + MC(MR.colour) + "." },
              { t:"Clean hands", why:"She says her hands match his. Find the line." }, { t:"Gloves", why:"She says her hands match his. Find the line." }, { t:"Nothing in her hands", why:"She says her hands match his. Find the line." }],
            hints:["She says something about her hands.", "“My hands are of your …”", "Blood on her hands too: “My hands are of your colour” " + MC(MR.colour) + "."] },
          // VERIFY: the 1623 Folio’s wording of the knocking cue in Macbeth 2.2 (plan: “Knock within”; the Globe prints “Knocking within”).
          { id:"d4", goal:5, prompt:"The Folio prints “Knock within” during the scene. Is that Shakespeare’s direction or an editor’s?",
            options:[{ t:"One of the few directions in the early text", ok:true, why:"Early texts include sound cues like this. Most directions about feelings and movement were added later." },
              { t:"Added by a modern editor", why:M4 + " The ones they do give are entrances, exits and sounds." }, { t:"Added by a film director", why:"The Folio was printed in 1623, long before film." }, { t:"There is no knocking", why:"The knocking is in the early text, and the characters hear it." }],
            hints:["Which kind of direction appears in the early printed texts?", "Entrances, exits and sounds.", "Knocking is a sound cue: original."] },
          { id:"d5", goal:2, prompt:"A director wants Lady Macbeth calm and Macbeth falling apart. Which line best supports her calm?",
            options:[{ t:"“A little water clears us of this deed” " + MC(MR.water), ok:true, why:"Her confidence here sets up her collapse in Act 5." },
              { t:"“Will all great Neptune’s ocean wash this blood…”", why:"That’s Macbeth, and it’s horror, not calm." }, { t:"“Macbeth does murder sleep”", why:"That’s Macbeth falling apart, not her calm." }, { t:"None of these", why:"One of them is hers, and it sounds sure of itself." }],
            hints:["Which line is Lady Macbeth’s?", "Which line makes the deed sound small?", "“A little water clears us of this deed” " + MC(MR.water) + "."] },
          { id:"d6", goal:2, prompt:"Which staging is <em>least</em> supported by the text?",
            options:[{ t:"Macbeth calmly cleans the daggers and smiles", ok:true, why:"His words are full of horror. Calm smiling contradicts them. Check the words first." },
              { t:"Macbeth trembles holding the daggers", why:"Trembling fits his horror. Look for the choice his words contradict." }, { t:"Lady Macbeth takes the daggers from him", why:"She does take charge of them. Look for the choice his words contradict." }, { t:"Both freeze at the knocking", why:"The knocking does startle them. Look for the choice his words contradict." }],
            hints:["Read his lines in this scene: what mood are they in?", "Horror and guilt.", "Calm smiling contradicts his words: “Macbeth calmly cleans the daggers and smiles” is least supported."] }
        ] },
      { id:"spot", type:"custom", title:"Spot the Error", summary:"Spot the error", goal:[3, 4, 5], student:"Quincy",
        instruction:"Quincy made one mistake in each paragraph. Tap the sentence where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:5, task:"A director’s note on 3.1",
            steps:["In my staging, Hamlet discovers the spies at “" + L.father + "” " + HC(R.father) + ".",
              "Ophelia’s reply, “At home, my lord” " + HC(R.home) + ", then becomes a lie he recognizes.",
              "Shakespeare’s stage directions say Hamlet sees Polonius behind the curtain here, so this is the only correct staging.",
              "His fury afterward is a response to betrayal."],
            answer:2,
            stepFb:["A clear, cited choice. Keep checking.", "Follows from the choice. Keep checking.", "", "This sentence follows from an earlier mistake. Find where the reasoning first goes wrong."],
            fixes:[{ t:"“The text gives no direction here, so this is one defensible choice; the abrupt question makes it possible.”", ok:true, why:M4 + " " + M1 },
              { t:"“Shakespeare’s directions are unclear, so any staging is fine.”", why:"Not any staging: the words still limit choices." },
              { t:"“Most directors do it this way, so it’s correct.”", why:"Tradition isn’t evidence." },
              { t:"“Sentence 3 is fine.”", why:"There’s no such direction in the early texts." }],
            hints:["Did Shakespeare write that direction?", "The early texts have very few.", "Fix: “The text gives no direction here, so this is one defensible choice; the abrupt question makes it possible.”"] },
          { id:"e2", goal:4, task:"A review of a modern-dress film",
            steps:["This film moves Denmark into a modern corporation.",
              "Because it changes the setting, it is unfaithful, and therefore a weaker <em>Hamlet</em>.",
              "Hamlet’s “" + L.prison + "” becomes a line about office life.",
              "Viewers should watch a traditional version instead."],
            answer:1,
            stepFb:["An accurate description of the setting choice. Keep checking.", "", "This sentence follows from an earlier mistake. Find where the reasoning first goes wrong.", "This sentence follows from an earlier mistake. Find where the reasoning first goes wrong."],
            fixes:[{ t:"“The new setting argues that corporate power and screens are today’s prison; its value depends on what that change reveals.”", ok:true, why:M2 },
              { t:"“Because it changes the setting, it is better than older versions.”", why:"Novelty isn’t value either." },
              { t:"“It is unfaithful, but entertaining.”", why:"Still judging by fidelity alone." },
              { t:"“Sentence 2 is fine.”", why:"Unfaithful doesn’t automatically mean weaker." }],
            hints:["Is fidelity the only measure?", "Ask what the change makes us see.", "Fix: “The new setting argues that corporate power and screens are today’s prison; its value depends on what that change reveals.”"] },
          { id:"e3", goal:3, task:"Delivery analysis",
            steps:["Hamlet’s “" + L.once + "” " + HC(R.once) + " is the hinge of the scene.",
              "Whether the actor stresses “did” or “once” makes no difference, because the words are the same.",
              "Either way, Hamlet sounds sincere.",
              "So delivery is just a matter of style."],
            answer:1,
            stepFb:["A reasonable claim. Keep checking.", "", "This sentence follows from an earlier mistake. Find where the reasoning first goes wrong.", "This sentence follows from an earlier mistake. Find where the reasoning first goes wrong."],
            fixes:[{ t:"“Stressing ‘did’ defends a love Ophelia doubts; stressing ‘once’ declares it over, so the delivery decides the line’s meaning.”", ok:true, why:M5 },
              { t:"“Stressing ‘did’ makes the line louder.”", why:"Louder, yes, but what does it <em>mean</em>?" },
              { t:"“Stress only matters in poetry, not in this prose scene.”", why:"Stress shapes meaning in all speech." },
              { t:"“Sentence 2 is fine.”", why:"Try saying it both ways." }],
            hints:["Say the line twice, moving the stress.", "Do the two versions mean the same thing?", "Fix: “Stressing ‘did’ defends a love Ophelia doubts; stressing ‘once’ declares it over, so the delivery decides the line’s meaning.”"] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which choice in the stage simulator changed the scene most for you, and why did it surprise you?" },
      { id:"j2", q:"In your own words, why can two opposite stagings both be “right”? What makes a staging wrong?" },
      { id:"j3", q:"Explain to a friend how to test a staging choice against the text, using one example from 3.1 or 3.4." },
      { id:"j4", q:"Which adaptation would you most like to see, or make? What would your setting argue about <em>Hamlet</em>?" }
    ],
    blocks:[{ title:"Commonplace book", html:"<p>Save one line you’d love to perform, and note how you’d say it. (Optional.)</p><div id='cp-app'></div>" }],
    art:{
      intro:"Write a principle about performance and meaning: something you’d tell an actor, a director or yourself before speaking in public. Add a master’s example from today and your own imitation.",
      placeholder:"e.g. Stress is meaning: move the weight of a sentence and you move its sense.",
      examples:[L.suit + " " + HC(R.suit), L.once + " " + HC(R.once), L.rat + " " + HC(R.rat), L.speech + " " + HC(R.speech), L.cruel + " " + HC(R.cruel)]
    },
    artSamples:[
      { p:"Stress is meaning: move the weight of a sentence and you move its sense.", m:"“I <em>did</em> love you once” vs “I did love you <em>once</em>” " + HC(R.once) },
      { p:"A good choice is one the words permit and the audience can feel.", m:"the stage simulator’s support m&#101;ter" }
    ],
    principleMin:6,
    cpLines:[L.speech, L.suit, L.once, L.nunnery, L.knaves, L.rat, L.cruel]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:5,
        a:{ prompt:"Most stage directions in modern editions of <em>Hamlet</em> were…",
          options:[{ t:"added by later editors; the early printed texts have very few", ok:true, why:"The early texts give entrances, exits and a few actions." },
            { t:"written in detail by Shakespeare", why:M4 }, { t:"invented by film directors", why:"Editions predate film." }, { t:"translated from Danish", why:"The play was written in English." }] },
        b:{ prompt:"Which kind of stage direction appears in the early printed texts?",
          options:[{ t:"Brief entrances, exits and some actions or sounds, such as “Enter Ghost”", ok:true, why:"Few and brief." },
            { t:"Detailed descriptions of characters’ feelings", why:M4 }, { t:"Camera angles", why:"Film terms; no cameras existed." }, { t:"Notes telling the audience what to think", why:"Not in the early texts." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Which is a <strong>vocal</strong> strategy?",
          options:[{ t:"Pausing before a key word", ok:true, why:"Pause is part of the voice." }, { t:"Moving downstage", why:"Blocking, not voice." }, { t:"Choosing a modern setting", why:"An adaptation choice." }, { t:"Lighting the Ghost", why:"A design choice." }] },
        b:{ prompt:"Which is a <strong>non-verbal</strong> cue?",
          options:[{ t:"Turning away from Ophelia at “I loved you not.”", ok:true, why:"The body speaks without words." }, { t:"Stressing the word “not”", why:"Vocal." }, { t:"Cutting Fortinbras", why:"An adaptation choice." }, { t:"Speeding up the line", why:"Vocal (pace)." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"In theatre, “blocking” means…",
          options:[{ t:"planning where and how actors move on stage", ok:true, why:"Where people stand and move." }, { t:"stopping a scene early", why:"A literal guess." }, { t:"cutting lines from the script", why:"That’s editing or cutting." }, { t:"the background music", why:"Sound design." }] },
        b:{ prompt:"In 3.4, Polonius hides behind “the arras”, which is…",
          options:[{ t:"a wall tapestry", ok:true, why:"A hanging tapestry, and a good place to hide." }, { t:"a sword", why:"Hamlet’s weapon, not the hiding place." }, { t:"a trapdoor", why:"A Globe feature, but not this." }, { t:"a hired spy", why:"A person, not an object." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"Which staging of 3.4 is <strong>best</strong> supported by the text?",
          options:[{ t:"Hamlet thrusts instantly, hoping it’s the King: he asks “Is it the king?” " + HC(R.king), ok:true, why:"His question shows his hope." },
            { t:"Hamlet knows it’s Polonius and kills him deliberately", why:"His question contradicts this. " + M3 }, { t:"Gertrude stabs Polonius", why:"Unsupported." }, { t:"Polonius escapes unharmed", why:"Contradicted: he dies." }] },
        b:{ prompt:"Which staging of 3.1 is <em>least</em> supported by the text?",
          options:[{ t:"Hamlet knows about the spies from his first line, even though he greets Ophelia gently (“" + L.nymph + "”)", ok:true, why:"The gentle greeting pulls against it." },
            { t:"Hamlet notices the spies at “Where’s your father?”", why:"Possible." }, { t:"Hamlet never notices the spies", why:"Possible." }, { t:"Ophelia glances toward the hiding place before “At home, my lord.”", why:"Possible." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"Lady Macbeth says “A little water clears us of this deed” " + MC(MR.water) + ". Stressing “little” suggests…",
          options:[{ t:"how easy she believes guilt is to remove: a confidence the play later reverses when she cannot wash away the “spot”", ok:true, why:"The stress makes the deed sound small." },
            { t:"that water is scarce in the castle", why:"Literal." }, { t:"that she is terrified", why:"The line sounds confident, not afraid." }, { t:"nothing; stress is decoration", why:M5 }] },
        b:{ prompt:"Juliet asks, “wherefore art thou Romeo?” (<i>Romeo and Juliet</i> 2.2.33). An actor who stresses “Romeo” makes the line mean…",
          options:[{ t:"“Why must you be a Romeo, a Montague?” The name, not the person, is the problem", ok:true, why:"“Wherefore” means “why”." },
            { t:"“Where are you, Romeo?”", why:"A common misreading of “wherefore”." }, { t:"“Romeo is late.”", why:"Unsupported." }, { t:"“She’s calling loudly so he’ll hear.”", why:"Volume, not meaning; and she doesn’t know he’s there." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"A production cuts Fortinbras entirely. Which conclusion is best supported?",
          options:[{ t:"It narrows the play to a family tragedy, losing the political frame in which a foreign prince inherits a collapsed Denmark", ok:true, why:"Cuts are arguments too." },
            { t:"It is no longer <em>Hamlet</em>", why:"Overstated; most of the play remains. " + M2 }, { t:"It changes nothing important", why:"It changes the ending’s meaning." }, { t:"It makes Hamlet the villain", why:"Unsupported." }] },
        b:{ prompt:"A production sets <em>Hamlet</em> in a surveillance state full of security cameras. What does this choice emphasize?",
          options:[{ t:"The play’s many scenes of spying (Polonius, Claudius, Rosencrantz and Guildenstern) as a whole system of watching", ok:true, why:"The setting turns many scenes into one argument." },
            { t:"That Hamlet is a technology expert", why:"Unsupported." }, { t:"That the play is a comedy", why:"Cameras don’t make it comic." }, { t:"Nothing; settings are decoration", why:M6 }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best director’s justification?",
          options:[{ t:"“Hamlet should notice the spies at ‘Where’s your father?’ " + HC(R.father) + ": the question’s abruptness suggests a discovery, and Ophelia’s lie then explains his fury.”", ok:true, why:"A choice, a quotation, a citation and a reason from the text." },
            { t:"“Hamlet notices the spies because that’s how it’s usually done.”", why:"Tradition isn’t evidence." }, { t:"“I think it’s more exciting.”", why:"A preference, not a reason from the text." }, { t:"“Shakespeare’s stage direction says so.”", why:M4 }] },
        b:{ prompt:"Which is the best director’s justification for an instant thrust in 3.4?",
          options:[{ t:"“Hamlet should strike without pausing: ‘" + L.rat + "’ " + HC(R.rat) + " is quick and broken, which suggests impulse.”", ok:true, why:"The rhythm of the line is the evidence." },
            { t:"“An instant thrust is more dramatic.”", why:"No textual reason." }, { t:"“Every production does it fast.”", why:"Tradition, not evidence." }, { t:"“The stage direction says ‘stabs quickly’.”", why:M4 }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which sentence best <strong>evaluates</strong> an adaptation?",
          options:[{ t:"“By moving <em>Hamlet</em> into a corporate tower, the film turns ‘" + L.prison + "’ into a critique of corporate power, though it loses the play’s sense of a sacred order.”", ok:true, why:"It names the change, what it reveals and what it costs." },
            { t:"“The film is bad because it’s modern.”", why:M2 }, { t:"“The film is good because I liked it.”", why:"Taste, not evaluation." }, { t:"“The film changes the setting to New York.”", why:"A description, not an evaluation." }] },
        b:{ prompt:"Which sentence best <strong>evaluates</strong> an animated retelling?",
          options:[{ t:"“<em>The Lion King</em> keeps the plot of a murdered king and a returning son but drops Hamlet’s doubt, so it becomes a story of destiny rather than conscience.”", ok:true, why:"It names what’s kept, what’s changed and what that reveals." },
            { t:"“It isn’t <em>Hamlet</em> because it has lions.”", why:M2 }, { t:"“It is better than <em>Hamlet</em> because it’s shorter.”", why:"Length isn’t quality." }, { t:"“It is a cartoon about a lion.”", why:"A description." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Your school stage has no balcony and no curtain. How can you stage 3.1 so the audience sees the spies but Hamlet doesn’t?",
          options:[{ t:"Place Claudius and Polonius, frozen and dimly lit, at one side of the stage, and block Hamlet so he never faces them until the moment he notices", ok:true, why:"Light and blocking do the hiding." },
            { t:"Cut the spies", why:"That loses the scene’s dramatic irony." }, { t:"Have the spies stand beside Hamlet", why:"He would obviously see them." }, { t:"Explain the spies in a program note only", why:"Not staged; the audience must <em>see</em> it." }] },
        b:{ prompt:"Your production is an audio drama (sound only). How can you show Ophelia’s glance toward the hidden spies before “At home, my lord”?",
          options:[{ t:"A small pause and a held breath before she answers, so listeners hear her hesitate", ok:true, why:"Sound carries the glance." },
            { t:"Describe the glance in a program", why:"Listeners won’t have it." }, { t:"Cut the line", why:"It’s essential to the scene." }, { t:"Play it exactly like her other lines, since audio can’t show glances", why:M5 }] } },
      { id:"a2", cat:"A", goal:[4, 6],
        a:{ prompt:"A streaming service advertises a new <em>Hamlet</em> film with the tagline “Revenge is a family business.” What does the tagline signal about the adaptation’s focus?",
          options:[{ t:"A crime-family thriller focus on revenge and family power, more than Hamlet’s philosophical doubt", ok:true, why:"Marketing frames how audiences read a film." },
            { t:"A comedy", why:"Nothing comic signalled." }, { t:"A faithful, full-text version", why:"No evidence either way." }, { t:"Nothing; taglines don’t shape expectations", why:"Marketing frames how audiences read a film." }] },
        b:{ prompt:"Another poster’s tagline is “Who is watching you?” What does it signal?",
          options:[{ t:"A focus on spying and surveillance in the court", ok:true, why:"The tagline points at the play’s watchers." },
            { t:"A horror film about ghosts only", why:"The Ghost isn’t “watching you”." }, { t:"A documentary about cameras", why:"Unsupported." }, { t:"Nothing", why:"Taglines frame expectations." }] } }
    ]
  },
  task:{
    title:"Performance task: Director’s promptbook",
    summary:"Director’s promptbook",
    statement:"<p><strong>Stage one scene, 3.1 or 3.4, as your interpretation, and defend it in a director’s note.</strong></p><p>Choose the scene, then give each of its three key moments a blocking choice and a delivery choice. The support m&#101;ter rates your choices against the words. Choose the effect you want on the audience, then write your note (110–220 words), quoting the scene with (act.scene.line) citations.</p><p class='tiny muted'>This checklist makes sure the parts are there. Your teacher reads the writing.</p>" + RUB,
    checks:["Three moments staged", "No choice the text contradicts", "Your note quotes the scene", "Your note names the effect you want", "Length"],
    tips:["Set blocking and delivery for all three moments.", "One choice is rated Weak. Check the support m&#101;ter and the reason it gives.", "Quote the scene at least twice, with (act.scene.line).", "Tell your actors what the audience should feel, and use that word.", "Too short: justify each moment. Too long: cut the plot summary."],
    explainPrompt:"Craft statement: Which single choice in your staging matters most, and what would the scene lose without it?",
    explainLabel:"Craft statement",
    vocab:"Use the words blocking, delivery, text support and audience.",
    checkLabel:"Check my promptbook",
    success:"Your promptbook has every part.",
    more:"Try the other scene, or another effect.",
    min:110, max:220, quoteWin:40,
    scenes:[{ id:"3.1", t:"3.1 (nunnery)" }, { id:"3.4", t:"3.4 (closet)" }],
    hides:{
      "3.1":{ label:"Where the spies hide", options:[{ id:"screen", t:"behind a screen upstage" }, { id:"balcony", t:"on the balcony above" }, { id:"arras", t:"behind the arras at the side" }] }
    },
    moments:{
      "3.1":[
        { id:"m1", t:"The greeting “Nymph, in thy orisons”", line:L.nymph, ref:R.nymph,
          blocking:[{ id:"kneel", t:"Hamlet enters unaware and kneels by Ophelia", r:"possible", why:"Nothing in his words proves he sees them." },
            { id:"apart", t:"Hamlet keeps his distance, lost in thought", r:"possible", why:POSS },
            { id:"eye", t:"Hamlet enters already eyeing the hiding place (he knows he’s watched)", r:"weak", why:"He greets her gently, “" + L.nymph + "”, which is hard to square with knowing he’s watched." }] },
        { id:"m2", t:"“Where’s your father?”", line:L.father, ref:R.father,
          blocking:[{ id:"turn", t:"Hamlet turns toward the hiding place (he notices)", r:"possible", why:"The abrupt question can mark a discovery." },
            { id:"stay", t:"Hamlet keeps his eyes on Ophelia (he never notices)", r:"possible", why:"Nothing in his words proves he sees them." },
            { id:"circle", t:"Hamlet circles Ophelia slowly", r:"possible", why:POSS }] },
        { id:"m3", t:"“Get thee to a nunnery”", line:L.nunnery, ref:R.nunnery,
          blocking:[{ id:"none", t:"No contact", r:"possible", why:POSS }, { id:"grip", t:"Hamlet grips Ophelia’s wrist", r:"possible", why:POSS },
            { id:"embrace", t:"Hamlet embraces her, then pushes her away", r:"possible", why:POSS }] }
      ],
      "3.4":[
        { id:"m1", t:"Polonius hides", note:"Polonius hides before Hamlet enters.", noStress:true, deliveryLabel:"Delivery (Polonius’s words as he hides)",
          blocking:[{ id:"arras", t:"Behind the arras, centre; Hamlet doesn’t see him go", r:"strong", why:"Polonius plans it: “Behind the arras I’ll convey myself” " + HC(R.arras3) + "." },
            { id:"screen", t:"Behind a folding screen, side; Hamlet doesn’t see him go", r:"possible", why:"The play names an arras, but a screen can do the same work." },
            { id:"seen", t:"Hamlet watches Polonius hide (he knows who it is)", r:"weak", why:"“" + L.knowNot + "” says otherwise." }] },
        { id:"m2", t:"“How now! a rat?”", line:L.rat, ref:R.rat,
          blocking:[{ id:"instant", t:"Hamlet thrusts through the hiding place instantly", r:"strong", why:"“" + L.rat + "” " + HC(R.rat) + " is quick and broken." },
            { id:"pause", t:"Hamlet pauses, then thrusts", r:"possible", why:"A pause adds thought the text doesn’t show." }] },
        { id:"m3", t:"The Ghost’s entrance", line:L.mad, ref:R.mad,
          blocking:[{ id:"aud", t:"The Ghost is visible to Hamlet and the audience only", r:"strong", why:"Gertrude sees nothing: “" + L.mad + "” " + HC(R.mad) + "." },
            { id:"all", t:"The Ghost is visible to everyone", r:"weak", why:"Then why can’t Gertrude see it?" },
            { id:"none", t:"The Ghost is invisible: a light and a sound only", r:"possible", why:"It leaves open whether Hamlet imagines it." }] }
      ]
    },
    delivery:[{ id:"whisper", t:"Whisper" }, { id:"shout", t:"Shout" }, { id:"slow", t:"Slow" }, { id:"urgent", t:"Urgent" }, { id:"pauseB", t:"Pause before" }, { id:"pauseA", t:"Pause after" }, { id:"stress", t:"Stress a word" }],
    effects:[{ id:"symH", t:"sympathy for Hamlet", key:"sympathy" }, { id:"symO", t:"sympathy for Ophelia", key:"sympathy" }, { id:"susp", t:"suspicion of Hamlet", key:"suspicion" }, { id:"dread", t:"dread", key:"dread" }, { id:"irony", t:"dramatic irony", key:"irony" }],
    labels:{ scene:"Scene", effect:"Intended audience effect", blocking:"Blocking", delivery:"Delivery", stressWord:"Stressed word", note:"Director’s note", meter:"Support m&#101;ter", glance:"Your promptbook at a glance" },
    modelsLabel:"One way it can be done", modelsNote:"Three directors, three different stagings. Many answers are valid; yours should be your own.",
    models:[
      { title:"3.1, Hamlet discovers the spies (effect: sympathy for Ophelia)",
        text:"In my staging, Hamlet greets Ophelia gently, kneeling on “" + L.nymph + "” " + HC(R.nymph) + ", so the audience first sees real tenderness. The spies wait, dimly lit, behind a screen upstage. On “" + L.father + "” " + HC(R.father) + " Hamlet pauses, then turns slowly toward the screen: this is his discovery. Ophelia glances there too before she answers, “" + L.home + "” " + HC(R.home) + ", and her small lie lands like a door closing. From here Hamlet shouts and grips her wrist, so his “Get thee to a nunnery” becomes cruelty aimed at the watchers through her. I want the audience to feel sympathy for Ophelia, trapped between two men she loves and used by both, while Hamlet’s rage reaches the wrong target." },
      { title:"3.1, Hamlet never knows (effect: sympathy for Hamlet)",
        text:"My Hamlet never discovers the spies on the balcony, so the audience holds all the dramatic irony and Hamlet holds none. He speaks quietly throughout. “" + L.once + "” " + HC(R.once) + " is spoken with the stress on “did”, defending a love he believes she doubts. When he whispers “" + L.nunnery + "” " + HC(R.nunnery) + ", he isn’t cursing her; he is grieving a world he thinks is too corrupt for anyone to live in. He never touches her. I want sympathy for Hamlet: a man so wounded by his mother’s remarriage that he can no longer trust any love, even one sitting in front of him. The cruelty is real, but it is aimed at himself as much as at Ophelia." },
      { title:"3.4, rash action and an unseen Ghost (effect: dread)",
        text:"My closet scene is built on speed and darkness. Polonius hides behind the arras at centre, and the audience sees him slip in. When he cries out, Hamlet strikes instantly, with no pause: “" + L.rat + "” " + HC(R.rat) + ". The broken rhythm is the stage direction. Then he asks, hopefully, “Is it the king?” " + HC(R.king) + ", and the hope makes the mistake more terrible. Later the Ghost appears only to Hamlet and the audience, in cold light, while Gertrude stares at empty air and says “" + L.mad + "” " + HC(R.mad) + ". I want dread: the sense that Hamlet’s long delay has broken into reckless action, and that the dead still have a claim on the living that the living can’t see." }
    ],
    rubric:RUBRIC
  },
  cards:[
    ["Blocking", "Planning where and how actors move on stage."],
    ["Arras", "A wall tapestry; Polonius hides behind one in 3.4."],
    ["Early stage directions", "Few and brief (“Enter Ghost”, “Knock within”); most modern directions were added by editors."],
    ["Vocal strategies", "Stress, pace, pause, pitch and volume: “I <em>did</em> love you once” vs “I did love you <em>once</em>”."],
    ["Non-verbal cues", "Gesture, facial expression, eye contact, distance: turning away on “I loved you not”."],
    ["Dramatic irony", "The audience knows more than a character: we see the spies in 3.1."],
    ["Text support", "A staging choice the words permit (Possible), require (Strong) or contradict (Weak)."],
    ["Interpretation", "Every staging answers the question “What is this scene about?”"],
    ["Adaptation", "A new version in another form or setting; judged by what its changes reveal."],
    ["Transposition", "Moving a play to a new time or place: a corporate tower, a surveillance state."],
    ["Fortinbras", "The Norwegian prince who inherits Denmark at the end; cutting him removes the political frame."],
    ["“" + L.suit + "”", "Hamlet’s advice to the players " + HC(R.suit) + ", a chiasmus."]
  ]
};
