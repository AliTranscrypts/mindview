// ENG4U 04 From Paraphrase to Analysis. Source: /Users/ali/Desktop/MV/Modules/eng4u/plan/modules/04-paraphrase-to-analysis.md
// Public-domain texts: Shelley, "Ozymandias" (the standard modern text, as in the plan; it differs from the 1818 Examiner printing,
// which has "Traveller", "No thing beside remains" and "desart"); Wordsworth, "I wandered lonely as a
// cloud" (1815 text, stanza 1); Mary Shelley, Frankenstein (opening of Chapter 5, 1831 text); Frost, "Nothing Gold Can Stay"
// (1923); Tennyson, "The Eagle" (1851; as in module 03); Shelley, A Defence of Poetry (written 1821). Model passages, the
// line-by-line word swaps, the Part 3 upgrade tools and the extra distractors are original to the course.

// Misconception core sentences (plan §3), used where the plan tags a wrong option with M1–M7 but gives no feedback text.
const M1 = "This retells <em>what</em> happens. Analysis explains <em>how</em> the words make it mean something, and <em>why</em> that matters.";
const M3 = "Every quotation needs a doorway in (a signal phrase) and a room after it (your explanation).";
const M4 = "Your response matters, but interpretation says what the <em>text</em> suggests, with evidence.";
const M5 = "Can you point to the words that prove this? If not, narrow the claim to what the text supports.";
const M6 = "Pick a verb that says <em>how</em>: undercuts, juxtaposes, reframes, intensifies, implies.";

const OZ = ["I met a traveller from an antique land,", "Who said—“Two vast and trunkless legs of stone", "Stand in the desert. . . . Near them, on the sand,",
  "Half sunk a shattered visage lies, whose frown,", "And wrinkled lip, and sneer of cold command,", "Tell that its sculptor well those passions read",
  "Which yet survive, stamped on these lifeless things,", "The hand that mocked them, and the heart that fed;", "And on the pedestal, these words appear:",
  "My name is Ozymandias, King of Kings;", "Look on my Works, ye Mighty, and despair!", "Nothing beside remains. Round the decay",
  "Of that colossal Wreck, boundless and bare", "The lone and level sands stretch far away.”"];
const WORDS = ["I wandered lonely as a cloud", "That floats on high o’er vales and hills,", "When all at once I saw a crowd,", "A host, of golden daffodils;",
  "Beside the lake, beneath the trees,", "Fluttering and dancing in the breeze."];
const FROST = ["Nature’s first green is gold,", "Her hardest hue to hold.", "Her early leaf’s a flower;", "But only so an hour.", "Then leaf subsides to leaf.",
  "So Eden sank to grief,", "So dawn goes down to day.", "Nothing gold can stay."];
const EAGLE = ["He clasps the crag with crooked hands;", "Close to the sun in lonely lands,", "Ring’d with the azure world, he stands.", "",
  "The wrinkled sea beneath him crawls;", "He watches from his mountain walls,", "And like a thunderbolt he falls."];

// Rung sort (Practice 1): the first two hints are shared; the third is the answer with its reason.
const RH = (h3) => ["Is there a quotation? Is there a claim?", "Is there a craft term <em>and</em> a significance?", h3];

export default {
  id:"04-paraphrase-to-analysis",
  kind:"topic",
  title:"From paraphrase to analysis",
  topic:"From Paraphrase to Analysis",
  readyTopic:"the ladder of reading",
  hero:{
    headline:"Every observation owes the reader a “so what”.",
    text:"Anyone can say what a poem is <em>about</em>. The craft is saying how it works and why it matters. In this module you’ll climb a <strong>ladder of reading</strong>: from <strong>paraphrase</strong> to <strong>observation</strong> to <strong>interpretation</strong> to <strong>analysis</strong>. You’ll learn to ask the question that turns notes into insight: <em>So what?</em>",
    fig:{ html:'<div class="lh" id="hero-lh" role="group" aria-label="The last three lines of Ozymandias on a field of sand, beside a four-rung ladder of reading"></div>', caption:"" },
    lines:[12, 13, 14],
    lastLine:"The lone and level sands stretch far away.",
    stop:"Nothing beside remains",
    glow:[{ w:"boundless", c:"b" }, { w:"bare", c:"b" }, { w:"lone", c:"l" }, { w:"level", c:"l" }],
    rungs:["What it says", "What I notice", "What it suggests", "How and why it matters"],
    cite:"(Shelley, lines 12–14)"
  },
  goals:[
    "I can paraphrase a passage accurately in plain modern words, keeping who is speaking.",
    "I can make specific observations about language and structure, using short quotations.",
    "I can interpret what an observation suggests, staying within the evidence.",
    "I can write analysis that explains how a craft choice creates meaning and why it matters (“so what?”).",
    "I can integrate and cite short quotations correctly (MLA 9).",
    "I can tell paraphrase, observation, interpretation, analysis and personal response apart, in my writing and in others’."
  ],
  start:{
    poem:{ title:"Ozymandias", lines:OZ, cite:"Percy Bysshe Shelley, “Ozymandias” (1818), in the standard modern text (spelling and punctuation modernized, as in most anthologies). Public domain. Cite by line: (Shelley, lines 13–14)." },
    blocks:[
      { title:"Word story: <em>analysis</em>", html:"<p><strong><em>Analysis</em></strong> comes from Greek <em>analusis</em>, “a loosening, an untying” (<em>ana-</em>, “up, back”, and <em>lyein</em>, “to loosen”). To analyse is to untie a knot carefully enough to see how it was tied.</p><p><strong><em>Paraphrase</em></strong> comes from Greek <em>para</em>, “beside”, and <em>phrazein</em>, “to tell”: it tells the text again, beside the original.</p><p class=\"wst-line\">Paraphrase walks beside the text; analysis unties it.</p><p class=\"tiny muted\">Word stories are short histories; see a dictionary’s etymology for more.</p>" }
    ],
    warmup:{
      questions:[
        { id:"w1", skill:"Paraphrase", goal:1,
          prompt:"Which is the most accurate paraphrase of “I met a traveller from an antique land, / Who said…”?",
          options:[
            { t:"“I met someone who had come from an ancient country, and he told me…”", ok:true, why:"<em>Antique</em> here means ancient, and the traveller is the one about to speak." },
            { t:"“I met an old traveller who collects antiques.”", why:"<em>Antique land</em> means an ancient country, not antiques." },
            { t:"“I travelled to an ancient land myself.”", why:"The speaker <em>met</em> a traveller; the speaker didn’t travel." },
            { t:"“Ozymandias told me…”", why:"The king doesn’t speak to the “I” directly; the traveller reports his words." }],
          hints:["Who travelled, and who is speaking?", "<em>Antique</em> can mean ancient.", "Someone from an ancient country told me…"] },
        { id:"w2", skill:"Paraphrase", goal:1,
          prompt:"Paraphrase “Half sunk a shattered visage lies.”",
          options:[
            { t:"“A broken stone face lies half buried.”", ok:true, why:"<em>Visage</em> means face; <em>sunk</em> means partly buried in the sand." },
            { t:"“Half the statue’s face is missing.”", why:"<em>Half sunk</em> means half buried, not half missing." },
            { t:"“The king lies dead in the sand.”", why:"It’s the statue’s face, not the king’s body." },
            { t:"“A sad face is sinking.”", why:"<em>Shattered</em> means broken, not sad." }],
          hints:["What does <em>visage</em> mean?", "Face. And <em>half sunk</em>?", "A broken stone face lies half buried."] },
        { id:"w3", skill:"Inference", goal:3,
          prompt:"A character slams a door, then quietly opens it again and sets a cup of tea outside. What can you infer?",
          options:[
            { t:"She was angry, but she still cares about the person outside.", ok:true, why:"Both actions count: the slam and the tea." },
            { t:"She hates the person outside.", why:"The tea suggests care; <em>hate</em> ignores half the evidence." },
            { t:"She’s thirsty.", why:"She leaves the tea for someone else." },
            { t:"Nothing; inferences are guesses.", why:"Inferences are reasoned conclusions from evidence." }],
          hints:["What do both actions tell you?", "Anger, and…", "…care: she’s angry but still cares."] },
        { id:"w4", skill:"Inference", goal:3,
          prompt:"In “Ozymandias”, the sculptor “well those passions read” on the king’s face. What does this suggest about the sculptor?",
          options:[
            { t:"The sculptor understood the king’s cruelty and recorded it accurately.", ok:true, why:"<em>Read … well</em> means understood clearly." },
            { t:"The sculptor couldn’t read.", why:"<em>Read</em> here means interpret a face." },
            { t:"The sculptor admired the king.", why:"Carving a “sneer of cold command” isn’t admiring." },
            { t:"The sculptor was the traveller.", why:"They’re different people; the traveller only describes the statue." }],
          hints:["What can it mean to <em>read</em> a face?", "To understand it.", "The sculptor understood the king’s passions."] },
        { id:"w5", skill:"Devices and their effects", goal:4,
          prompt:"“The lone and level sands stretch far away.” What is the most likely effect of the repeated <em>l</em> sounds?",
          options:[
            { t:"They slow and smooth the line, so the emptiness feels long and endless.", ok:true, why:"Liquid <em>l</em> sounds stretch the line out, like the sands." },
            { t:"They make the line sound harsh and violent.", why:"<em>L</em> is a soft, flowing consonant." },
            { t:"They show the poem is a sonnet.", why:"Sound devices don’t decide the form." },
            { t:"They have no effect; alliteration is decoration.", why:"Sound shapes how a line feels." }],
          hints:["Read it aloud slowly.", "Are <em>l</em> sounds hard or soft?", "Soft and long, like the sands."] },
        { id:"w6", skill:"Quoting poetry", goal:5,
          prompt:"Which correctly cites lines 13–14 of “Ozymandias” in MLA style after a quotation?",
          options:[
            { t:"(Shelley, lines 13–14)", ok:true, why:"Author, then “lines” and the numbers." },
            { t:"(Shelley 13–14)", why:"Without “lines”, the numbers read as page numbers on first use." },
            { t:"(Ozymandias, p. 14)", why:"Poems are cited by line, not page." },
            { t:"(lines 13 and 14, Shelley)", why:"Author first, then a range with an en dash." }],
          hints:["Poems use line numbers.", "Author first.", "(Shelley, lines 13–14)."] }
      ],
      refreshers:{
        "Paraphrase":"Say it in plain modern words, line by line. Keep who is speaking. Don’t add meanings that aren’t there.",
        "Inference":"Combine clues the text gives you into a conclusion it doesn’t state, and be ready to point to the clues.",
        "Devices and their effects":"Name the device, then say what it does: slows, binds, contrasts, echoes, makes you hear or see.",
        "Quoting poetry":"In running text: “boundless and bare / The lone and level sands” (Shelley, lines 13–14)."
      }
    }
  },
  explore:{
    heading:"Ladder of reading",
    intro:"Every sentence about a text sits on a rung. Sort sentences onto the ladder, then climb: start with what the poem says and finish with how and why it matters.",
    rungs:[{ id:"para", label:"Paraphrase", q:"What it says" }, { id:"obs", label:"Observation", q:"What I notice" },
      { id:"int", label:"Interpretation", q:"What it suggests" }, { id:"ana", label:"Analysis", q:"How and why it matters" }],
    tray:{ id:"resp", label:"Personal response", q:"Valued, but kept off the ladder" },
    voices:[{ id:"i", label:"the “I”", lines:[1, 1], note:"line 1" }, { id:"trav", label:"the traveller", lines:[2, 14], note:"lines 2–14, inside quotation marks" },
      { id:"insc", label:"the inscription", lines:[10, 11], note:"lines 10–11, inside the traveller’s report" }],
    // Sort mode: the 8 cards (answer = the keyed rung). craft / meaning / sw fill readout rows the rules can’t see.
    cards:[
      { id:"c1", t:"A traveller tells the speaker about a broken statue of a king in the desert.", answer:"para" },
      { id:"c2", t:"The inscription commands the “Mighty” to “despair”, but the next sentence is “Nothing beside remains.”", answer:"obs", craft:"placement (pointed to, not yet named)" },
      { id:"c3", t:"The poem suggests that even the greatest rulers are forgotten.", answer:"int", meaning:"Even the greatest rulers are forgotten" },
      { id:"c4", t:"By placing the king’s boast directly before “Nothing beside remains,” Shelley turns “despair” against its speaker, so the inscription now warns the powerful instead of threatening them.", answer:"ana",
        craft:"Irony; juxtaposition (placement)", meaning:"Power is temporary; the boast becomes a warning", sw:"so the inscription now warns the powerful instead of threatening them" },
      { id:"c5", t:"Lines 13–14 repeat <em>b</em> and <em>l</em> sounds: “boundless and bare / The lone and level sands.”", answer:"obs", craft:"sound repetition (described, not yet named)" },
      { id:"c6", t:"The sculptor’s skill outlives the king’s power.", answer:"int", meaning:"Art outlasts power" },
      { id:"c7", t:"Shelley nests the king’s words inside a traveller’s report inside the speaker’s memory, which distances the reader from Ozymandias and shrinks his voice to a rumour.", answer:"ana",
        craft:"frame (nested voices)", meaning:"The tyrant survives only as a rumour", sw:"which distances the reader from Ozymandias and shrinks his voice to a rumour" },
      { id:"c8", t:"I think the ending is creepy.", answer:"resp" }
    ],
    tc1:{ paraOnAna:"It retells the situation; it doesn’t explain how anything works.", respOnInt:"That’s your response. An interpretation says what the <em>text</em> suggests.",
      obsOnInt:"It points to the words but doesn’t yet say what they suggest.", general:"Ask of each card: does it retell, point, suggest, or explain how <em>and</em> why?" },
    nudge:{ para:M1, obs:"Good catch, now finish the thought: what do the words <em>do</em> to the line’s meaning?", int:"That says what it suggests. Now explain how the words create that meaning, and why it matters.",
      resp:M4, line:"A paraphrase retells; that’s its job. It’s the floor of the ladder. To answer “so what”, climb.", built:"Add the “so what”: which suggests… / so that…" },
    climb:{
      start:"A traveller describes a broken statue of a king in the desert.",
      rungs:[
        { id:"obs", answer:"o2", opts:[
          { id:"o1", t:"The statue is very big." },
          { id:"o2", t:"The face has a “sneer of cold command,” and the sculptor “well those passions read.”", craft:"diction (“sneer”, “cold”)" },
          { id:"o3", t:"The poem is a sonnet.", craft:"form (sonnet)" }],
          wrong:{ o3:"True, but which detail matters for meaning?", o1:"That’s a size, not a detail of the language. Which observation points to exact words?" } },
        { id:"int", answer:"i3", accept:{ i2:"I2 is true but thin; I3 sets up the analysis better." }, opts:[
          { id:"i1", t:"Ozymandias was a real pharaoh.", meaning:"none: a historical fact, not a reading of the words" },
          { id:"i2", t:"The king was cruel.", meaning:"The king was cruel" },
          { id:"i3", t:"The sculptor saw through the king, and his art preserved the king’s cruelty after the king’s power was gone.", meaning:"The sculptor judged the king; art outlived power" }],
          wrong:{ i1:"Historical fact, not interpretation of the poem’s words." } },
        { id:"ana", answer:"a1", opts:[
          { id:"a1", t:"By making the sculptor the one who “read” and “mocked” the king’s passions, Shelley reframes the statue as the artist’s judgment rather than the king’s monument, implying that art outlasts power.", craft:"the sculptor’s role (who “read” and “mocked”)", meaning:"Art outlasts power" },
          { id:"a2", t:"The poem has many images of stone and sand.", craft:"imagery (named loosely)" },
          { id:"a3", t:"Shelley shows that the king was bad.", meaning:"The king was bad" }],
          wrong:{ a3:"“Shows” plus a judgment: no craft, no “so what”.", a2:"That points to images, but says nothing about what they mean or why it matters." } }
      ],
      general:"Check each rung: an observation that quotes, an interpretation built on the sculptor, and an analysis that names a craft choice and says why it matters."
    },
    // Line by line: each line’s paraphrase, with word-swap slots. f: faithful | loses (detail) | adds (meaning). m: meaning claimed.
    lines:[
      { n:1, p:["I met a traveller from", { o:"an antique land", opts:[{ t:"an ancient country", f:"faithful" }, { t:"a foreign place", f:"loses", fb:"“Foreign” drops how <em>old</em> the land is." }, { t:"a land full of antiques", f:"adds", fb:"<em>Antique</em> means ancient here, not antiques." }] }, ","] },
      { n:2, p:["who told me, “Two", { o:"vast and trunkless", opts:[{ t:"huge stone legs with no body above them", f:"faithful" }, { t:"large stone legs", f:"loses", fb:"It drops <em>trunkless</em>: the body is gone." }, { t:"giant legs of a fallen god", f:"adds", fb:"Nothing says he was a god." }] }] },
      { n:3, p:[{ o:"Stand in the desert", opts:[{ t:"are standing in the desert", f:"faithful" }, { t:"are somewhere", f:"loses", fb:"Where? The desert matters to the ending." }, { t:"stand guard over the desert", f:"adds", fb:"“Guard” adds a purpose the line doesn’t give." }] }, ". Near them, on the sand,"] },
      { n:4, p:["half buried, a", { o:"shattered", opts:[{ t:"broken", f:"faithful" }, { t:"old", f:"loses", fb:"Old, but is it broken? <em>Shattered</em> says so." }, { t:"sad", f:"adds", fb:"<em>Shattered</em> means broken, not sad." }] }, "stone", { o:"visage", opts:[{ t:"face", f:"faithful" }, { t:"mask", f:"adds", fb:"A mask hides a face; the poem shows the face itself." }, { t:"vision", f:"adds", fb:"<em>Visage</em> means face, not a vision or a dream." }] }, "lies there; its frown,"] },
      { n:5, m:"cruel, contemptuous ruler", p:["its wrinkled lip, and", { o:"sneer of cold command", opts:[{ t:"a cold, scornful look of command", f:"faithful", m:"cruel, contemptuous ruler" }, { t:"an expression of authority", f:"loses", m:"a ruler", fb:"The cruelty and contempt are gone, and with them the sculptor’s judgment." }, { t:"the grin of a mass murderer", f:"adds", m:"a mass murderer (more than the words say)", fb:"The words show contempt, not murder." }] }, ","] },
      { n:6, p:["show that the sculptor", { o:"well those passions read", opts:[{ t:"understood those feelings well", f:"faithful" }, { t:"saw the face", f:"loses", fb:"He didn’t only see it; he <em>read</em> it: he understood." }, { t:"could read books about the king", f:"adds", fb:"<em>Read</em> here means interpret a face." }] }] },
      { n:7, p:["(feelings that still survive,", { o:"stamped on these lifeless things", opts:[{ t:"carved into the lifeless stone", f:"faithful" }, { t:"on the statue", f:"loses", fb:"<em>Stamped</em> and <em>lifeless</em> matter: the feelings outlive the man in dead stone." }, { t:"that still haunt the desert", f:"adds", fb:"Nothing in the line is haunted." }] }, ")"] },
      { n:8, p:["longer than the hand that", { o:"mocked", opts:[{ t:"copied and made fun of", f:"faithful" }, { t:"made", f:"loses", fb:"<em>Mocked</em> means imitated and ridiculed, not just made." }, { t:"hated", f:"adds", fb:"Mocking isn’t the same as hating." }] }, "them and the heart that fed them."] },
      { n:9, p:["And on the", { o:"pedestal", opts:[{ t:"base of the statue", f:"faithful" }, { t:"stone", f:"loses", fb:"Which stone? The base, where words are carved." }, { t:"altar", f:"adds", fb:"An altar is for worship; this is a statue’s base." }] }, "these words are written:"] },
      { n:10, p:["“My name is Ozymandias,", { o:"King of Kings", opts:[{ t:"the greatest king of all", f:"faithful" }, { t:"a king", f:"loses", fb:"“King of Kings” is a boast; “a king” loses it." }, { t:"a god", f:"adds", fb:"He boasts of being king of kings, not a god." }] }, ";"] },
      { n:11, p:["look at what I built,", { o:"ye Mighty", opts:[{ t:"you powerful people", f:"faithful" }, { t:"everyone", f:"loses", fb:"He speaks to the <em>mighty</em>, not to everyone." }, { t:"you weaklings", f:"adds", fb:"He addresses the mighty as rivals, not as weaklings." }] }, ", and despair!”"] },
      { n:12, p:[{ o:"Nothing beside remains", opts:[{ t:"Nothing else is left", f:"faithful" }, { t:"Not much is left", f:"loses", fb:"“Not much” softens <em>nothing</em>." }, { t:"Thieves took everything else", f:"adds", fb:"The line doesn’t say why nothing remains." }] }, ". Around the ruin"] },
      { n:13, p:["of that", { o:"colossal Wreck", opts:[{ t:"huge wreck", f:"faithful" }, { t:"wreck", f:"loses", fb:"<em>Colossal</em> matters: the bigger the ruin, the sharper the irony." }, { t:"shipwreck", f:"adds", fb:"A wrecked statue, not a ship." }] }, ", endless and empty,"] },
      { n:14, p:["the", { o:"lone and level", opts:[{ t:"empty, flat", f:"faithful" }, { t:"sandy", f:"loses", fb:"It drops how empty and flat the desert is." }, { t:"lonely, grieving", f:"adds", fb:"“Grieving” gives the sand feelings the line doesn’t give it." }] }, "sands stretch far into the distance.”"] }
    ],
    fid:{ faithful:"faithful", loses:"loses detail", adds:"adds meaning" },
    lists:{
      craft:["irony", "juxtaposition", "alliteration", "imagery", "diction", "frame", "enjambment", "caesura", "metaphor", "personification", "tone", "structure", "simile"],
      strong:["undercuts", "juxtaposes", "reframes", "intensifies", "implies", "exposes", "complicates", "foreshadows"],
      vague:["shows", "says", "is about", "talks about"]
    },
    build:{ qmin:2, qmax:8, wmin:25, wmax:60, sig:["which suggests", "which implies", "so that", "revealing", "suggesting", "implying"],
      tests:["A quotation of 2–8 words, in quotation marks, exactly as in the poem", "A craft term (irony, juxtaposition, alliteration, frame…)", "A strong verb from the bank (undercuts, reframes, intensifies…)",
        "A “so what” clause: which suggests… / which implies… / so that… / revealing… / suggesting… / implying…", "25–60 words"],
      examples:["Shelley’s juxtaposition of the boast “Look on my Works” with “Nothing beside remains” undercuts the king’s command, suggesting that power which depends on monuments is as fragile as stone.",
        "The alliteration in “lone and level sands” stretches the final line, so that the emptiness feels endless and the reader experiences how completely time has erased the king.",
        "The frame of a traveller’s report distances the reader from the “King of Kings,” which implies that tyrants survive only as rumours told by strangers."],
      wrongQuote:"That wording isn’t in the poem. Check it letter by letter.",
      wrongVerb:"Swap “shows” for a verb that says how.",
      wrongSig:"Add the “so what”: which suggests… / so that…",
      save:"That’s a full climb in one sentence. Save it to your commonplace book if you’re proud of it." },
    p4:{ before:"Lines 13–14 have alliteration.", after:"Lines 13–14 have alliteration: the long, soft <em>l</em> and <em>b</em> sounds stretch the line out, so that the emptiness feels endless." },
    aha:"Analysis isn’t a different subject from paraphrase; it’s the top of the same ladder. Each rung earns the next. And “so what?” is the question that lifts you.",
    predIntro:"Make a prediction first. Then the ladder and the poem will show you what happens.",
    predictions:[
      { id:"p1",
        prompt:"As the king meant it, “Look on my Works, ye Mighty, and despair!” means “despair, because you’ll never match me.” Now read it next to “Nothing beside remains.” What happens to its meaning?",
        options:[{ t:"It flips: now “despair” means despair, because even mighty works vanish", ok:true }, { t:"Nothing changes; the boast stays a boast" }, { t:"It becomes a joke the king intended" }, { t:"It becomes a question" }],
        explain:"This is irony: the words are the same, but their meaning has reversed. Shelley gets the reversal from <strong>placement</strong>, putting the boast right before the emptiness." },
      { id:"p2",
        prompt:"How many voices speak in the poem?",
        options:[{ t:"Three: the “I”, the traveller and the king’s carved words", ok:true }, { t:"One: Shelley" }, { t:"Two: the speaker and the king" }, { t:"Four: the speaker, the traveller, the sculptor and the king" }],
        explain:"The king never speaks to us directly. His words come third-hand: carved, then reported, then remembered. The frame itself shrinks him." },
      { id:"p3",
        prompt:"Swap “sneer of cold command” for “expression of authority”. What’s lost?",
        options:[{ t:"The cruelty and contempt, and with them the sculptor’s judgment of the king", ok:true }, { t:"Nothing important; they mean the same thing" }, { t:"Only the rhyme" }, { t:"The fact that he was a king" }],
        explain:"<em>Sneer</em> and <em>cold</em> carry judgment. Paraphrase can flatten diction; analysis notices exactly what the original words add." },
      { id:"p4",
        prompt:"A student writes: “Lines 13–14 have alliteration.” Press “So what?”. What’s missing?",
        options:[{ t:"What the sounds do: the long, soft <em>l</em> and <em>b</em> sounds stretch the line out, so the emptiness feels endless", ok:true }, { t:"A second device" }, { t:"The author’s name" }, { t:"Nothing; naming the device is analysis" }],
        explain:"Naming the device is an observation. Explaining its effect, and why that effect matters, is analysis." }
    ],
    chalIntro:"Use the ladder to meet each goal, then press <strong>Check challenge</strong>. <strong>Set it up</strong> opens the right mode. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 6],
        prompt:"<strong>Sort the cards.</strong> Sort all 8 cards onto the right rungs (or the response tray). <button type=\"button\" class=\"btn ghost sm lr-setup\" data-setup=\"tc1\">Set it up</button>",
        why:"Each card sits where its thinking stops: retell, point, suggest, or explain how and why.",
        hints:["Ask of each card: does it retell, point, suggest, or explain how <em>and</em> why?", "Cards with quotations and no claim are observations.", "Cards naming a craft choice <em>and</em> a meaning <em>and</em> a significance are analysis."] },
      { id:"tc2", goal:[2, 4, 6],
        prompt:"<strong>Climb.</strong> Climb from the paraphrase “A traveller describes a broken statue of a king in the desert” to analysis, choosing one sentence on each rung. <button type=\"button\" class=\"btn ghost sm lr-setup\" data-setup=\"tc2\">Set it up</button>",
        why:"Quotation, then what it suggests, then how the craft makes the meaning and why it matters.",
        hints:["Choose the observation with a quotation.", "Choose the interpretation that uses the sculptor.", "O2 → I3 → A1."] },
      { id:"tc3", goal:[2, 4], stretch:true,
        prompt:"<strong>Build your own.</strong> Build your own analysis sentence about “Ozymandias” in the builder. It must pass all five tests. <button type=\"button\" class=\"btn ghost sm lr-setup\" data-setup=\"tc3\">Set it up</button>",
        why:"That’s a full climb in one sentence. Save it to your commonplace book if you’re proud of it.",
        hints:["Start with the craft: “Shelley’s juxtaposition of…”", "Quote 2–8 exact words; then use a strong verb.", "Finish with “suggesting that…” and say why it matters."] }
    ],
    blocks:[{ title:"A note on the ladder", html:"<p>Real analysis often blends the rungs. The ladder is a training scaffold, not a rule that every paragraph must follow step by step. Use it to check where a sentence stops, then climb.</p><p class=\"tiny muted\">For teachers: the module treats the four rungs as a scaffold for drafting and revision, not as a required paragraph template.</p>" }]
  },
  part3:{
    slug:"upgrade", name:"Upgrade",
    heading:"Upgrade the sentence",
    intro:"In Explore you learned to recognize the rungs. Here you revise: turn six weak sentences into analysis with three tools. The verb dial swaps a vague verb for a stronger one, the “how” slot adds the craft, and the “so what” slot adds significance. The rung m&#101;ter climbs as you use each tool well.",
    upgrade:{
      tools:{ dial:"Verb dial", how:"“How” slot", sw:"“So what” slot" },
      sentences:[
        { id:"s1", weak:"The poem is about a statue.", start:"A topic, not a claim",
          dial:[{ t:"The poem is about a statue", fb:"“Is about” names a topic and hides how the poem works." },
            { t:"The poem describes a broken statue", fb:"Still retelling: what does the poem <em>do</em> with the statue?" },
            { t:"Shelley turns a ruined statue into an argument about how power fades", ok:true, fb:"“Turns … into” says what Shelley does with the statue." },
            { t:"Shelley reframes a ruined statue as an argument about how power fades", ok:true, fb:"<em>Reframes</em> says how: the statue becomes an argument." }],
          how:[{ t:"using the gap between the king’s boast and the empty desert", ok:true, fb:"That names the craft: the gap, a juxtaposition, between boast and desert." },
            { t:"using many literary devices", fb:"Which devices? Name one craft choice." },
            { t:"in fourteen lines", fb:"A fact about the form, not how the meaning is made." }],
          sw:[{ t:"suggesting that no monument can make power last", ok:true, fb:"That answers “so what?”: why the gap matters." },
            { t:"which is interesting", fb:"Interesting how? Say why it matters." },
            { t:"which proves that Shelley hated all kings", fb:M5 }],
          zoom:[[11, "Look on my Works, ye Mighty, and despair!"], [12, "Nothing beside remains."], [14, "The lone and level sands stretch far away."]] },
        { id:"s2", weak:"Shelley uses alliteration in the last line.", start:"An observation: a device named, no effect",
          dial:[{ t:"Shelley uses alliteration in the last line", fb:"“Uses” names the device but not what it does." },
            { t:"The last line shows alliteration", fb:"“Shows” is vague: it hides <em>how</em>." },
            { t:"The alliteration in “The lone and level sands” (line 14) is about sand", fb:"“Is about” turns a sound into a topic." },
            { t:"The alliteration in “The lone and level sands” (line 14) intensifies the emptiness", ok:true, fb:"<em>Intensifies</em> says what the sound does." }],
          how:[{ t:"stretching the line out with long, soft <em>l</em> sounds", ok:true, fb:"That’s the effect: what the sound does." },
            { t:"which is a sound device", fb:"That repeats the label. What does the sound do?" },
            { t:"and the line also rhymes", fb:"A second device isn’t an effect." }],
          sw:[{ t:"so that the desert feels endless and the king’s boast sounds hollow", ok:true, fb:"That says why the effect matters." },
            { t:"in line 14", fb:"That’s a location, not significance." },
            { t:"which is good writing", fb:"Praise isn’t significance: why does the effect matter?" }],
          zoom:[[13, "boundless and bare"], [14, "The lone and level sands stretch far away."]] },
        { id:"s3", weak:"The king says “Look on my Works, ye Mighty, and despair!”", start:"A plop quote",
          dial:[{ t:"The king says “Look on my Works, ye Mighty, and despair!”", fb:M3 },
            { t:"The king talks about his works", fb:"“Talks about” is vague, and the quotation is gone." },
            { t:"The king boasts, “Look on my Works, ye Mighty, and despair!” (Shelley, line 11)", fb:"Better: the quotation has a doorway in and a citation. Now pick a verb that shows the irony." },
            { t:"The king’s command to “Look on my Works, ye Mighty, and despair!” (Shelley, line 11) undercuts itself", ok:true, fb:"Integrated and cited, and <em>undercuts</em> names the irony." }],
          how:[{ t:"because Shelley places it directly before “Nothing beside remains” (line 12)", ok:true, fb:"That names the craft: placement, a juxtaposition." },
            { t:"because the king is shouting", fb:"Nothing says he shouts. What does the placement do?" },
            { t:"(line 11)", fb:"A citation alone doesn’t show the irony." }],
          sw:[{ t:"so the threat turns into a warning that even the mightiest works vanish", ok:true, fb:"That’s the irony, and why it matters." },
            { t:"which shows he was a king", fb:"Vague, and it tells us what we already know." },
            { t:"which proves that every ruler is evil", fb:M5 }],
          zoom:[[10, "My name is Ozymandias, King of Kings;"], [11, "Look on my Works, ye Mighty, and despair!"], [12, "Nothing beside remains."]] },
        { id:"s4", weak:"The poem shows that time destroys things.", start:"A vague interpretation",
          dial:[{ t:"The poem shows that time destroys things", fb:"“Shows” is vague: it hides <em>how</em>." },
            { t:"The poem is about time destroying things", fb:"“Is about” names a topic, not a claim." },
            { t:"The poem dramatizes how time erases even a king’s power", ok:true, fb:"<em>Dramatizes</em> says how: the poem acts it out." },
            { t:"The poem implies that time erases even a king’s power", ok:true, fb:"<em>Implies</em> is a precise analysis verb." }],
          how:[{ t:"through the closing image of “lone and level sands” that “stretch far away” (lines 13–14)", ok:true, fb:"That names the craft: the closing image, quoted and cited." },
            { t:"through many images", fb:"Which image? Name it and quote it." },
            { t:"in its last six lines", fb:"Naming a section isn’t naming the craft." }],
          sw:[{ t:"suggesting that the desert, not the king, has the last word", ok:true, fb:"That says why the image matters." },
            { t:"which is sad", fb:M4 },
            { t:"which proves that time destroys everything", fb:M5 }],
          zoom:[[13, "Of that colossal Wreck, boundless and bare"], [14, "The lone and level sands stretch far away."]] },
        { id:"s5", weak:"The sculptor is important.", start:"A vague claim",
          dial:[{ t:"The sculptor is important", fb:"Important how? “Is” hides the thinking." },
            { t:"The sculptor is mentioned in line 6", fb:"A location, not a claim." },
            { t:"The sculptor exposes the king’s cruelty", ok:true, fb:"<em>Exposes</em> says what the sculptor’s work does." },
            { t:"The sculptor reframes the statue as a judgment of the king", ok:true, fb:"<em>Reframes</em> says how the statue changes meaning." }],
          how:[{ t:"since the hand that “mocked” the king’s passions also “well those passions read” (lines 6–8)", ok:true, fb:"That quotes how: he read the passions, then mocked them in stone." },
            { t:"since he made the statue", fb:"True, but how does the poem show his judgment?" },
            { t:"since he is an artist", fb:"Which words show what he did?" }],
          sw:[{ t:"suggesting that art judges power, and outlasts it", ok:true, fb:"That’s the “so what”: art judges power." },
            { t:"which shows he was talented", fb:"That praises the sculptor; it doesn’t say why it matters for the poem." },
            { t:"which proves that the sculptor hated the king", fb:M5 }],
          zoom:[[6, "Tell that its sculptor well those passions read"], [7, "Which yet survive, stamped on these lifeless things,"], [8, "The hand that mocked them, and the heart that fed;"]] },
        { id:"s6", weak:"I like how it ends.", start:"A personal response",
          dial:[{ t:"I like how it ends", fb:M4 },
            { t:"The ending is good", fb:"Good how? A judgment with no evidence." },
            { t:"The ending leaves the reader with emptiness instead of the king’s glory", ok:true, fb:"Now it says what the <em>text</em> does." },
            { t:"The ending exposes how little of the king’s glory survives", ok:true, fb:"<em>Exposes</em> says what the ending does." }],
          how:[{ t:"through the “boundless and bare” sands of lines 13–14", ok:true, fb:"That’s the evidence: quoted and located." },
            { t:"because I found it eerie", fb:M4 },
            { t:"because it is the end", fb:"That’s circular. Which words make the ending work?" }],
          sw:[{ t:"implying that the king’s command to “despair” has come true for the king himself", ok:true, fb:"That says why it matters: the irony lands on him." },
            { t:"which I enjoyed", fb:M4 },
            { t:"which proves that Shelley visited Egypt", fb:"Unsupported biography. " + M5 }],
          zoom:[[11, "Look on my Works, ye Mighty, and despair!"], [13, "boundless and bare"], [14, "The lone and level sands stretch far away."]] }
      ]
    },
    quickCheck:{
      title:"Upgrade the sentence quick check", summary:"Upgrade the sentence quick check",
      items:[
        { id:"q1", goal:4, prompt:"Which verb best replaces “shows” in: “The empty desert shows the king’s boast is wrong”?",
          right:"Right. <em>Undercuts</em> says <em>how</em>: the desert works against the boast.", wrong:"<em>Undercuts</em> says <em>how</em>: the desert works against the boast.",
          choices:[{ t:"undercuts", ok:true }, { t:"says" }, { t:"is" }, { t:"talks about" }] },
        { id:"q2", goal:4, prompt:"Which addition supplies the “so what”?",
          right:"Right. Significance answers “why does this matter?”", wrong:"Significance answers “why does this matter?”",
          choices:[{ t:"“…suggesting that power built on monuments cannot last.”", ok:true }, { t:"“…in line 11.”" }, { t:"“…which is a quotation.”" }, { t:"“…and it rhymes.”" }] },
        { id:"q3", goal:3, prompt:"Which turns “I like how it ends” into interpretation?",
          right:"Right. Interpretation points to the text and says what it suggests.", wrong:"Interpretation points to the text and says what it suggests.",
          choices:[{ t:"“The ending’s ‘boundless and bare’ sands leave the reader with emptiness instead of the king’s glory.”", ok:true }, { t:"“I really, really like it.”" }, { t:"“The ending is good.”" }, { t:"“Shelley wrote the ending last.”" }] },
        { id:"q4", goal:3, prompt:"Which upgrade overreaches?",
          right:"Right. The poem’s words can’t prove the poet’s private feelings about every king.", wrong:"The poem’s words can’t prove the poet’s private feelings about every king.",
          choices:[{ t:"“This proves Shelley hated all kings.”", ok:true }, { t:"“The frame distances the reader from the king.”" }, { t:"“The sneer reveals cruelty.”" }, { t:"“The boast becomes a warning.”" }] }
      ]
    },
    blocksAfter:[{ type:"write", id:"steal", title:"Sentence to steal",
      html:"<p class=\"steal-line\">“Poets are the unacknowledged legislators of the world.”</p><p class=\"eng-cite\">Percy Bysshe Shelley, <em>A Defence of Poetry</em> (written 1821, published 1840)</p><p><strong>The shape:</strong> “[Group] are the unacknowledged [powerful role] of [domain]”: a surprising claim about hidden influence.</p><p><strong>Example:</strong> “Librarians are the unacknowledged architects of a town’s imagination.”</p><p>Keep the shape. Change the content. Your imitation saves here, and you can add it to your commonplace book.</p>",
      prompt:"Your imitation:" }]
  },
  practice:{
    activities:[
      { id:"rungs", type:"custom", title:"Rung sort: Wordsworth", summary:"Rung sort", noun:"sentence", txt:true, goal:6,
        instruction:"Read the stanza, then sort ten sentences about it: paraphrase, observation, interpretation, analysis, or personal response.",
        how:"Tap a sentence, then tap the box it belongs in.",
        passage:WORDS, cite:"William Wordsworth, “I wandered lonely as a cloud” (1815 text), stanza 1",
        boxes:[{ id:"para", label:"Paraphrase" }, { id:"obs", label:"Observation" }, { id:"int", label:"Interpretation" }, { id:"ana", label:"Analysis" }, { id:"resp", label:"Personal response" }],
        wrongDefault:"Ask: does it retell, point, suggest, or explain how and why? Try another box.",
        items:[
          { id:"i1", t:"The speaker was walking alone when he suddenly saw lots of daffodils by a lake.", answer:"para", why:"It retells what happens, in plain words.",
            wrong:{ ana:"It retells; there’s no how or why." }, hints:RH("Paraphrase: it retells what happens, in plain words.") },
          { id:"i2", t:"The speaker compares himself to “a cloud” in line 1.", answer:"obs", why:"It points to exact words, but makes no claim yet.", hints:RH("Observation: it points to exact words (“a cloud”) but makes no claim yet.") },
          { id:"i3", t:"The flowers are described as “a crowd” and “a host,” words usually used for people.", answer:"obs", why:"It points to specific words and their usual use, but doesn’t say what they suggest.",
            wrong:{ int:"It points to the words but doesn’t yet say what they suggest." }, hints:RH("Observation: it points to the words and their usual use, but doesn’t say what they suggest.") },
          { id:"i4", t:"The speaker’s loneliness is eased by the sight of the flowers.", answer:"int", why:"It says what the scene suggests about the speaker, without naming the craft.", hints:RH("Interpretation: it says what the scene suggests, without naming the craft.") },
          { id:"i5", t:"The shift from the single “cloud” to “a crowd” reframes the speaker’s isolation as sudden company, implying that nature can answer loneliness.", answer:"ana", why:"It names the craft (the shift from “cloud” to “crowd”), says what it does and why it matters.",
            wrong:{ int:"It names the craft, says what it does <em>and</em> why it matters: that’s analysis." }, hints:RH("Analysis: it names the craft, says what it does and why it matters.") },
          { id:"i6", t:"I love daffodils.", answer:"resp", why:"It’s about the reader’s feelings, not the poem.",
            wrong:{ int:"That’s about you, not the poem." }, hints:RH("Personal response: it’s about the reader, not the poem.") },
          { id:"i7", t:"The flowers seem almost alive and sociable.", answer:"int", why:"It says what the description suggests, without quoting or naming the craft.", hints:RH("Interpretation: it says what the description suggests.") },
          { id:"i8", t:"“Fluttering and dancing” personifies the flowers, so the scene feels like a celebration the speaker has stumbled into, which suggests joy arrives unplanned.", answer:"ana", why:"It names the craft (personification), says what it does and why it matters.", hints:RH("Analysis: personification, its effect, and why it matters.") },
          { id:"i9", t:"The daffodils are next to a lake and under some trees.", answer:"para", why:"It retells where the flowers are, in plain words.", hints:RH("Paraphrase: it retells where the flowers are.") },
          { id:"i10", t:"Lines 5 and 6 both begin with a preposition or a participle, and line 6 is the only line with extra syllables.", answer:"obs", why:"It points to a feature of the lines’ structure, but makes no claim.", hints:RH("Observation: it points to a feature of the structure, with no claim.") }
        ] },
      { id:"unseen", type:"custom", title:"Unseen prose: the climb", summary:"Unseen prose", star:true, goal:[1, 2, 3, 4, 5],
        instruction:"Read the passage from <em>Frankenstein</em>, then climb: paraphrase, observe, interpret, analyse. Questions 4–6 go beyond the Final Check.",
        how:"Pick an answer, then press Check answer. Wrong answers show why; try again.",
        passage:["It was on a dreary night of November that I beheld the accomplishment of my toils. With an anxiety that almost amounted to agony, I collected the instruments of life around me, that I might infuse a spark of being into the lifeless thing that lay at my feet."],
        cite:"Mary Shelley, <em>Frankenstein</em> (1818), the opening of Chapter 5 (1831 text). Public domain.",
        items:[
          { id:"u1", goal:1, prompt:"<strong>U1.</strong> Best paraphrase?",
            options:[
              { t:"On a gloomy November night, I saw my long work completed. Nervous almost to the point of pain, I gathered my tools to bring the body at my feet to life.", ok:true, why:"Accurate and plain: it keeps the speaker, the night, the anxiety and the purpose." },
              { t:"I finished my homework in November.", why:"<em>Toils</em> are his life’s labour here." },
              { t:"On a rainy night, I watched a monster come alive and run away.", why:"That adds events the passage doesn’t contain: the creature isn’t alive yet." },
              { t:"One November night, he calmly put his tools away.", why:"“An anxiety that almost amounted to agony” isn’t calm, he gathers his tools, and the speaker is “I”." }],
            hints:["Who is speaking, and what is he about to do?", "<em>Toils</em> means long, hard work; the <em>instruments</em> are his tools.", "On a gloomy November night, I saw my long work completed…"] },
          { id:"u2", goal:2, prompt:"<strong>U2.</strong> Which observation is most specific?",
            options:[
              { t:"The narrator calls his creation “the lifeless thing” in the same sentence as “the instruments of life.”", ok:true, why:"Specific and quotable: it points to exact words placed side by side." },
              { t:"The passage is gloomy.", why:"True, but which words make it gloomy?" },
              { t:"The narrator is a scientist.", why:"A fact about the story, not a feature of the language." },
              { t:"The passage uses some long words.", why:"Which words? An observation points to something specific." }],
            hints:["Which option points to exact words?", "Look for quotation marks.", "“the lifeless thing” in the same sentence as “the instruments of life”."] },
          { id:"u3", goal:3, prompt:"<strong>U3.</strong> Which interpretation does the text support?",
            options:[
              { t:"The narrator’s triumph is mixed with dread.", ok:true, why:"“The accomplishment of my toils” sits beside “dreary” and “an anxiety that almost amounted to agony”." },
              { t:"He’s a murderer.", why:"Nothing here supports that." },
              { t:"The narrator is calm and confident.", why:"“An anxiety that almost amounted to agony” says otherwise." },
              { t:"The narrator hates November.", why:"The month sets the mood; nothing says what he thinks of it." }],
            hints:["Which words show how he feels?", "“Accomplishment” beside “anxiety” and “agony”.", "Triumph mixed with dread."] },
          { id:"u4", goal:3, prompt:"<strong>U4.</strong> <span class=\"tag\">★</span> Which detail most undercuts the sense of triumph in “the accomplishment of my toils”?",
            options:[
              { t:"“a dreary night of November”", ok:true, why:"The dreary setting darkens the moment of success." },
              { t:"“instruments of life”", why:"That supports the scientific triumph." },
              { t:"“I collected”", why:"A plain action; it neither supports nor undercuts the triumph." },
              { t:"“around me”", why:"It only places the instruments; it doesn’t colour the triumph." }],
            hints:["Which detail makes the moment feel dark?", "Look at when it happens.", "“a dreary night of November”."] },
          { id:"u5", goal:4, prompt:"<strong>U5.</strong> <span class=\"tag\">★</span> Which analysis sentence is strongest?",
            options:[
              { t:"By setting “the accomplishment of my toils” on “a dreary night,” Mary Shelley juxtaposes success with gloom, implying that the creation is already shadowed by disaster.", ok:true, why:"It names the craft (juxtaposition), says what it does and why it matters." },
              { t:"The setting shows it’s November.", why:"A vague verb and no “so what”. " + M6 },
              { t:"Victor is excited.", why:"That’s paraphrase. " + M1 },
              { t:"Mary Shelley was 18 when she wrote it.", why:"Biography, not analysis of the words. " + M5 }],
            hints:["Which option names a craft choice?", "Which also says why it matters?", "The juxtaposition sentence."] }
        ],
        select:{ id:"u6", goal:[2, 4], prompt:"<strong>U6.</strong> <span class=\"tag\">★</span> Which phrase carries the irony of the passage? (Select 2.)",
          options:[
            { t:"“infuse a spark of being”", ok:true, why:"" },
            { t:"“the lifeless thing”", ok:true, why:"" },
            { t:"“a dreary night”", why:"That’s mood, not irony; the irony is giving life to a “thing”." },
            { t:"“my toils”", why:"That’s his labour, not an irony." }],
          why:"He means to “infuse a spark of being” into something he calls “the lifeless thing”: life for a thing defined by having none.",
          hints:["Irony: words whose meaning works against itself.", "What is he trying to give, and to what?", "“infuse a spark of being” and “the lifeless thing”."] } },
      { id:"spot", type:"custom", title:"Spot the error", summary:"Spot the error", student:"Esperanza", goal:[3, 4, 5],
        instruction:"Esperanza made one mistake in each paragraph about “Ozymandias”. Tap the sentence where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Write an analytical paragraph about the poem’s ending.",
            steps:["Shelley’s “Ozymandias” ends with an image of empty desert.", "In the last lines, the traveller says that around the broken statue there is only sand, and the sand goes on for a long way.",
              "This suggests that nothing of the king’s power survives.", "The ending is very effective."],
            answer:1,
            stepFb:["Sentence 1 is a fair opening.", "", "Sentence 3 interprets, but the paragraph stalled earlier.", "Sentence 4 is vague, but the first problem is earlier."],
            fixes:[
              { t:"The final image, “boundless and bare / The lone and level sands stretch far away” (lines 13–14), uses long, alliterative sounds to make the emptiness feel endless.", ok:true, why:"A quoted, cited observation with its effect: the paragraph climbs." },
              { t:"In the last lines, there is sand.", why:"Still paraphrase, and thinner." },
              { t:"The traveller is lying about the sand.", why:"Nothing suggests that." },
              { t:"Sentence 2 is correct.", why:"It’s accurate paraphrase, but a paragraph that’s meant to analyse needs observation and analysis here." }],
            hints:["Which sentence only retells?", "Sentence 2 paraphrases.", "Replace it with a quoted observation and an effect."] },
          { id:"e2", goal:5, task:"Use a quotation to support a claim about the sculptor.",
            steps:["The sculptor understood the king better than the king understood himself.", "“Tell that its sculptor well those passions read.”", "This proves the sculptor was a good artist."],
            answer:1,
            stepFb:["Sentence 1 makes a claim: fine.", "", "Sentence 3 is weak, but the first problem is the dropped quotation."],
            fixes:[
              { t:"The frown and sneer “Tell that its sculptor well those passions read” (Shelley, line 6), meaning the sculptor saw and recorded the king’s arrogance.", ok:true, why:"A lead-in, the quotation, a citation and an explanation." },
              { t:"“Tell that its sculptor well those passions read” (line 6).", why:"A citation alone doesn’t integrate the quotation." },
              { t:"The sculptor “read” things.", why:"Too short to support the claim." },
              { t:"Sentence 2 is correct.", why:"A quotation standing alone, without a lead-in or explanation, is a “plop quote”." }],
            hints:["Does the quotation have a doorway in?", "Who “tells”, and what?", "Lead in, quote, cite, explain."] },
          { id:"e3", goal:3, task:"Interpret the poem’s message.",
            steps:["The poem places the king’s boast just before “Nothing beside remains.”", "This irony suggests that the king’s power did not last.",
              "Therefore the poem proves that every leader in history was evil and that Shelley hated all governments.", "The ending’s empty sands drive the point home."],
            answer:2,
            stepFb:["Sentence 1 is a precise observation.", "Sentence 2 is a supported interpretation.", "", "Sentence 4 is fine; check sentence 3."],
            fixes:[
              { t:"Therefore the poem warns that power resting on fear and monuments cannot outlast time.", ok:true, why:"The claim stays within what the words support." },
              { t:"Therefore Shelley was a pharaoh.", why:"That’s nonsense, and unsupported." },
              { t:"Therefore the poem has no message.", why:"The irony clearly carries one." },
              { t:"Sentence 3 is correct.", why:"“Every leader” and “hated all governments” go far beyond what the words support." }],
            hints:["Can the poem’s words prove “every leader in history”?", "Narrow the claim to this king and this kind of power.", "Power resting on fear can’t last."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which rung of the ladder do you usually stop on when you write about literature? Why?" },
      { id:"j2", q:"In your own words, what’s the difference between interpreting a poem and responding to it? Why do both matter?" },
      { id:"j3", q:"Explain to a friend how to turn “The poem is about time” into an analytical sentence." },
      { id:"j4", q:"Which upgrade tool (the stronger verb, the “how” clause, the “so what” clause) do you most need to practise? How will you practise it?" }
    ],
    blocks:[
      { title:"Commonplace book", html:"<p>Save one line from this module that you’d like to remember, and add a sentence explaining what it unties for you.</p><div id=\"cp-app\"></div>" }
    ],
    art:{
      intro:"Write one principle about turning reading into analysis, in your own words. Give a master’s example: a line from “Ozymandias” or one of the module’s sentences that shows the principle at work. Then write your own sentence that uses it.",
      placeholder:"Your principle about turning reading into analysis",
      examples:["Look on my Works, ye Mighty, and despair! / Nothing beside remains. (Shelley, lines 11–12)",
        "Half sunk a shattered visage lies, whose frown, / And wrinkled lip, and sneer of cold command (Shelley, lines 4–5)",
        "The lone and level sands stretch far away. (Shelley, line 14)",
        "I met a traveller from an antique land, / Who said— (Shelley, lines 1–2)",
        "By placing the king’s boast directly before “Nothing beside remains,” Shelley turns “despair” against its speaker, so the inscription now warns the powerful instead of threatening them."]
    },
    artSamples:"<details class=\"alg art-samples\"><summary>Two sample principles (examples only; write your own)</summary><p class=\"an-note an-syntax\">“Placement can reverse a meaning: put a boast beside its ruin.” <span class=\"muted\">Master: “Look on my Works, ye Mighty, and despair! / Nothing beside remains.” Imitation: “The poster promised ‘Grand Opening.’ The windows were boarded.”</span></p><p class=\"an-note an-figure\">“A strong verb does the thinking for the sentence.” <span class=\"muted\">Master: “Shelley … undercuts the king’s command.” Imitation: “The silence after the question undercut every answer she gave.”</span></p></details>",
    commonplaceLines:["Nothing beside remains. (Shelley, line 12)", "The lone and level sands stretch far away. (Shelley, line 14)", "Look on my Works, ye Mighty, and despair! (Shelley, line 11)",
      "Tell that its sculptor well those passions read (Shelley, line 6)", "Poets are the unacknowledged legislators of the world. (Shelley, A Defence of Poetry)",
      "Fluttering and dancing in the breeze. (Wordsworth, line 6)", "Nothing gold can stay. (Frost, line 8)"],
    cpNote:"What it unties for you"
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which is the most accurate paraphrase of Frost’s “Nature’s first green is gold, / Her hardest hue to hold”?", options:[
          { t:"In spring, the earliest leaves look golden, and that colour is the hardest one for nature to keep.", ok:true, why:"Accurate and plain: the first buds have a golden tint that fades fast." },
          { t:"Nature loves gold more than green.", why:"The lines describe a colour, not a preference." },
          { t:"Gold is the hardest metal to find in nature.", why:"<em>Gold</em> is the colour of new leaves, not the metal." },
          { t:"Youth never lasts.", why:"That’s an interpretation, not a paraphrase." }] },
        b:{ prompt:"Which is the most accurate paraphrase of Keats’s “Season of mists and mellow fruitfulness”?", options:[
          { t:"Autumn is a time of mist, and of ripe, soft, plentiful fruit.", ok:true, why:"Accurate and plain: the line names two features of the season." },
          { t:"Autumn is sad because things die.", why:"That’s an interpretation." },
          { t:"Mist makes fruit grow.", why:"The line lists two features of the season; it doesn’t claim a cause." },
          { t:"Keats liked autumn best.", why:"The line doesn’t state a preference." }] } },
      { id:"k2", cat:"K", goal:6,
        a:{ prompt:"Which rung is this sentence on? “In line 4, the speaker calls the flowers ‘A host, of golden daffodils.’”", options:[
          { t:"Observation", ok:true, why:"It points to specific words, but makes no claim yet." },
          { t:"Paraphrase", why:"It quotes and points; it doesn’t retell." },
          { t:"Interpretation", why:"It doesn’t say what the words suggest." },
          { t:"Analysis", why:"There’s no craft-plus-meaning-plus-significance." }] },
        b:{ prompt:"Which rung is this sentence on? “Tennyson’s simile ‘like a thunderbolt’ turns the eagle’s dive into a strike from the heavens, implying that its power is godlike.”", options:[
          { t:"Analysis", ok:true, why:"It names the craft, says what it does and why it matters." },
          { t:"Observation", why:"It goes beyond pointing." },
          { t:"Paraphrase", why:"It doesn’t retell." },
          { t:"Personal response", why:"It’s about the text, not the reader’s feelings." }] } },
      { id:"k3", cat:"K", goal:6,
        a:{ prompt:"Choose the most precise verb: “The final image of endless sand ___ the king’s boast.”", options:[
          { t:"undercuts", ok:true, why:"It says how: the image works against the boast." },
          { t:"shows", why:"Vague: it hides <em>how</em>." },
          { t:"is about", why:"Vague, and it doesn’t fit the claim." },
          { t:"says", why:"Images don’t “say”; this hides the mechanism." }] },
        b:{ prompt:"Choose the most precise verb: “The cheerful wedding music ___ the bride’s private grief.”", options:[
          { t:"heightens, by contrast,", ok:true, why:"It says how: the contrast makes the grief sharper." },
          { t:"shows", why:"Vague: it hides <em>how</em>. " + M6 },
          { t:"talks about", why:"Vague: music doesn’t “talk about”. " + M6 },
          { t:"is", why:"This makes the music and the grief the same thing." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"An original passage: “When the moving truck finally pulled away, Nadia stood in the empty living room and noticed, for the first time, the pale rectangle on the wall where the family photo had hung for eleven years. She pressed her palm flat against it, as if checking for a pulse.” Which interpretation is best supported?", options:[
          { t:"The pale patch shows that absence leaves a mark; Nadia treats the house almost as something alive that she is leaving.", ok:true, why:"“Pale rectangle” (absence) and “checking for a pulse” (alive) both support it." },
          { t:"Nadia is checking whether the wall needs paint.", why:"Too literal: “as if checking for a pulse” is a simile about feeling." },
          { t:"Nadia hated her family and is glad to leave.", why:"Nothing in the passage suggests that." },
          { t:"The photo was stolen by the movers.", why:"There’s no evidence of theft." }] },
        b:{ prompt:"An original passage: “Grandpa kept fixing the old radio long after we’d bought him a new one. Every Sunday he’d take off the back, peer at the tubes, and tighten one screw a quarter turn. ‘Nearly there,’ he’d say.” Which interpretation is best supported?", options:[
          { t:"The repair is a ritual that keeps something of the past alive for him; finishing it may matter less than continuing it.", ok:true, why:"“Every Sunday”, one screw at a time, and “Nearly there” every week: the repair itself is the point." },
          { t:"He’s an expert electrician.", why:"Nothing shows expertise; “nearly there” every week suggests otherwise." },
          { t:"He dislikes the new radio because it’s broken.", why:"Nothing says it’s broken." },
          { t:"He wants to sell the radio.", why:"There’s no evidence." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Choose the strongest “so what” to complete: “By placing the king’s boast just before ‘Nothing beside remains,’ Shelley turns the inscription into a warning, ___”", options:[
          { t:"“…suggesting that art outlasts power, since the sculptor’s mocking record is all that survives of the king.”", ok:true, why:"It answers “why does this matter?”, with evidence from the poem." },
          { t:"“…which is in line 11.”", why:"That’s a location, not significance." },
          { t:"“…and the poem is a sonnet.”", why:"A form label, not significance." },
          { t:"“…which proves Shelley visited Egypt.”", why:"Unsupported biography." }] },
        b:{ prompt:"Choose the strongest “so what” to complete: “Wordsworth calls the daffodils ‘a crowd’ and ‘a host,’…”", options:[
          { t:"“…which reframes the speaker’s loneliness as sudden company, suggesting nature can answer isolation.”", ok:true, why:"It says what the words do and why it matters." },
          { t:"“…in lines 3 and 4.”", why:"That’s a location, not significance." },
          { t:"“…and daffodils are yellow.”", why:"An irrelevant detail." },
          { t:"“…which proves Wordsworth had no friends.”", why:"Unsupported biography. " + M5 }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"An original public-service poster reads: “Every year, Lake Huron returns what we throw in. Last summer it returned 4000 bottles.” Which sentence is analysis rather than paraphrase?", options:[
          { t:"“By making the lake the one who ‘returns’ our garbage, the poster personifies it as a patient neighbour handing back what we dropped, shaming readers into responsibility.”", ok:true, why:"It names the craft (personification), says what it does and why it matters." },
          { t:"“The poster says 4000 bottles washed up last summer.”", why:"That’s paraphrase." },
          { t:"“The poster is about pollution.”", why:"Vague, and a topic, not analysis." },
          { t:"“I think littering is bad.”", why:"A personal response." }] },
        b:{ prompt:"An original song lyric: “We built this town on Friday nights, / now Fridays build the town in me.” Which sentence is analysis?", options:[
          { t:"“The reversal in the second line (the town once built by Fridays now ‘build[s]’ the singer) uses chiasmus to show how a place we shape ends up shaping us.”", ok:true, why:"It names the craft (chiasmus, the reversed order), says what it does and why it matters." },
          { t:"“The singer used to go out on Fridays.”", why:"That’s paraphrase. " + M1 },
          { t:"“The song is about a town.”", why:"Vague, and a topic, not analysis." },
          { t:"“This song makes me nostalgic.”", why:"A personal response. " + M4 }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"Which is the best analytical thesis about “Ozymandias”?", options:[
          { t:"“In ‘Ozymandias,’ Shelley uses a nested frame and a final image of empty desert to undercut a tyrant’s boast, arguing that art and time judge power more lastingly than power judges itself.”", ok:true, why:"It names the text, the author, the craft and an arguable claim." },
          { t:"“‘Ozymandias’ is a poem by Shelley about a statue.”", why:"A topic, not a thesis." },
          { t:"“Shelley uses many literary devices in ‘Ozymandias.’”", why:"Which, and to what end?" },
          { t:"“‘Ozymandias’ proves that every king in history was cruel.”", why:"Overreach." }] },
        b:{ prompt:"Which is the best analytical thesis about “I wandered lonely as a cloud” (stanza 1)?", options:[
          { t:"“In the opening stanza, Wordsworth shifts from the image of a solitary cloud to a ‘crowd’ of dancing daffodils, transforming loneliness into communion and suggesting that attention to nature can renew the self.”", ok:true, why:"It names the text, the craft and an arguable claim about why it matters." },
          { t:"“Wordsworth’s poem is about daffodils.”", why:"A topic, not a thesis." },
          { t:"“Wordsworth uses personification and similes.”", why:"Which, and to what end?" },
          { t:"“Wordsworth was lonely because he lived in the country.”", why:"Overreach: unsupported biography." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which sentence integrates and cites a quotation from “Ozymandias” best?", options:[
          { t:"The sculptor captured the king’s “sneer of cold command” (Shelley, line 5), so the statue preserves cruelty rather than glory.", ok:true, why:"A smooth lead-in, an exact quotation, a correct citation and an explanation." },
          { t:"“Sneer of cold command.” This shows the king was cruel.", why:"A plop quote with no lead-in." },
          { t:"The sculptor captured the king’s sneer of cold command (Shelley, line 5).", why:"Quoted words need quotation marks." },
          { t:"The sculptor captured the king’s “sneer of cold command” (Shelley, page 5).", why:"Poems are cited by line, not page." }] },
        b:{ prompt:"Which sentence integrates and cites a quotation from Wordsworth best?", options:[
          { t:"The flowers seem to celebrate, “Fluttering and dancing in the breeze” (Wordsworth, line 6), as if the speaker has stumbled into a party.", ok:true, why:"A smooth lead-in, an exact quotation, a correct citation and an explanation." },
          { t:"“Fluttering and dancing in the breeze.” The flowers are happy.", why:"A plop quote with no lead-in. " + M3 },
          { t:"The flowers seem to celebrate, Fluttering and dancing in the breeze (Wordsworth, line 6).", why:"Missing quotation marks." },
          { t:"The flowers seem to celebrate, “Fluttering and dancing in the breeze” (Wordsworth 1807).", why:"Cite the line, not the year." }] } },
      { id:"a1", cat:"A", goal:2,
        a:{ prompt:"A described film scene (original): “The camera holds on a birthday cake for ten full seconds while, out of focus behind it, two parents argue silently.” Which is the most useful observation?", options:[
          { t:"“The cake stays in sharp focus while the arguing parents are blurred in the background.”", ok:true, why:"It’s specific and points to a craft choice (focus), ready to interpret." },
          { t:"“The scene is sad.”", why:"That’s an interpretation, and vague." },
          { t:"“Birthdays are stressful.”", why:"A generalization, not an observation." },
          { t:"“I didn’t like this scene.”", why:"A personal response. " + M4 }] },
        b:{ prompt:"A described school mural (original): “A huge sun fills the left side; on the right, tiny students carry lanterns into a dark forest.” Which is the most useful observation?", options:[
          { t:"“The sun is enormous and alone on the left, while the students are small and carry their own small lights on the right.”", ok:true, why:"It’s specific and points to craft choices (size and placement), ready to interpret." },
          { t:"“The mural is hopeful.”", why:"That’s interpretation." },
          { t:"“Art is important in schools.”", why:"A generalization, not an observation." },
          { t:"“I would have used more colours.”", why:"A personal response. " + M4 }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"An original ad slogan: “Fresh. Local. Yours.” Which sentence analyses it rather than paraphrasing it?", options:[
          { t:"“The three one-word sentences slow the reader down and end on ‘Yours,’ so the product feels already owned, nudging the reader toward buying it.”", ok:true, why:"It names the craft (three one-word sentences ending on “Yours”), says what it does and why it matters." },
          { t:"“The slogan says the food is fresh, local and for you.”", why:"That’s paraphrase. " + M1 },
          { t:"“The slogan is short.”", why:"That’s an observation without a claim." },
          { t:"“I would buy this.”", why:"A personal response. " + M4 }] },
        b:{ prompt:"A fictional headline: “City Hall Finally Admits Pothole Problem.” Which sentence analyses it?", options:[
          { t:"“The word ‘finally’ implies the city delayed and ‘admits’ frames the problem as a confession, so the headline nudges readers to see officials as evasive.”", ok:true, why:"It points to exact words, says what they imply and why it matters." },
          { t:"“The headline says City Hall talked about potholes.”", why:"That’s paraphrase. " + M1 },
          { t:"“The headline is about roads.”", why:"Vague, and a topic, not analysis. " + M6 },
          { t:"“I hate potholes.”", why:"A personal response. " + M4 }] } }
    ]
  },
  task:{
    title:"Climb the ladder", summary:"Climb the ladder",
    statement:"<p>Choose one unseen poem and write a four-rung mini-analysis (one sentence per rung) plus a “so what” sentence. Many good answers are possible; make yours precise.</p><p class=\"tiny muted\">This checklist makes sure the parts are there. Your teacher reads the writing.</p><details class=\"alg pt-rubric\"><summary>How your teacher reads it (levels 1–4)</summary><div class=\"tbl-wrap\"><table class=\"topic-tbl\"><thead><tr><th scope=\"col\">Criterion</th><th scope=\"col\">Level 1</th><th scope=\"col\">Level 2</th><th scope=\"col\">Level 3</th><th scope=\"col\">Level 4</th></tr></thead><tbody><tr><td>Knowledge: accurate paraphrase and terms</td><td>The paraphrase misreads; terms are misused</td><td>Mostly accurate; some term errors</td><td>Accurate paraphrase; terms used correctly</td><td>Precise paraphrase; terms used with nuance</td></tr><tr><td>Thinking: interpretation and analysis</td><td>Unsupported or summary</td><td>Supported but thin</td><td>Clear craft → meaning link</td><td>Insightful craft → meaning → significance</td></tr><tr><td>Communication: integration and clarity</td><td>Plop quotes; unclear</td><td>Some integration</td><td>Smooth integration, correct citation</td><td>Elegant, economical, precisely cited</td></tr><tr><td>Application: the “so what”</td><td>Missing or generic</td><td>Stated, but obvious</td><td>Explains significance</td><td>Opens a larger idea the poem earns</td></tr></tbody></table></div></details>",
    checks:["All five rungs written", "Your observation quotes the poem exactly", "Your analysis names a craft choice", "Your analysis uses a strong verb", "Your analysis is cited", "Your “so what” explains significance", "Length"],
    tips:["Fill every rung; each one earns the next.",
      "Copy 1–8 words exactly from the poem and put them in quotation marks.",
      "Name the craft: alliteration, juxtaposition, personification, simile, imagery, diction, structure…",
      "Swap “shows” for a verb that says how: undercuts, reframes, intensifies…",
      "Add a line citation, like (Frost, line 6).",
      "Say why it matters: “This suggests…” / “This matters because…”",
      "Aim for 80–180 words in total: concise, but complete."],
    explainPrompt:"Craft statement: Which rung was hardest to write, and what did you change to climb it? Quote one of your own sentences before and after.",
    explainLabel:"Craft statement",
    vocab:"Use paraphrase, observation, interpretation, analysis and significance.",
    checkLabel:"Check my climb",
    success:"Your climb has all its parts. Here are three model climbs, on different poems, taking different approaches.",
    slots:[{ id:"para", label:"Paraphrase", help:"What the poem says, in plain words." }, { id:"obs", label:"Observation", help:"A specific detail, with 1–8 words quoted exactly." },
      { id:"int", label:"Interpretation", help:"What that detail suggests." }, { id:"ana", label:"Analysis", help:"How a named craft choice creates the meaning (a strong verb), with a line citation." },
      { id:"sw", label:"So what?", help:"Why it matters: “This suggests…” / “This matters because…”" }],
    significance:["suggests", "implies", "reveals", "matters because", "which means", "so that", "warns", "argues"],
    poems:[
      { id:"frost", author:"Frost", title:"Nothing Gold Can Stay", full:"Robert Frost, “Nothing Gold Can Stay”", lines:FROST, cite:"Robert Frost, “Nothing Gold Can Stay” (1923). Public domain in Canada." },
      { id:"eagle", author:"Tennyson", title:"The Eagle", full:"Alfred, Lord Tennyson, “The Eagle”", lines:EAGLE, cite:"Alfred, Lord Tennyson, “The Eagle” (1851). Public domain." },
      { id:"words", author:"Wordsworth", title:"I wandered lonely as a cloud", full:"William Wordsworth, “I wandered lonely as a cloud” (stanza 1)", lines:WORDS, cite:"William Wordsworth, “I wandered lonely as a cloud” (1815 text), stanza 1. Public domain." }],
    models:[
      { title:"Model 1: Frost (focus: pattern and alliteration)", poem:"frost", parts:[
        "In spring the first buds look golden, but that colour fades quickly into green, just as the first light of dawn becomes ordinary day.",
        "Frost begins two lines in a row with “So”: “So Eden sank to grief, / So dawn goes down to day” (lines 6–7).",
        "The poem suggests that every perfect beginning, in nature or in human life, is brief.",
        "By setting the fall of Eden in the same short, alliterative pattern as a sunrise, Frost juxtaposes the cosmic and the everyday, implying that loss is built into the world rather than an accident (Frost, line 6).",
        "This matters because it turns a small nature poem into a quiet argument for treasuring beauty while it lasts."] },
      { title:"Model 2: Tennyson (focus: personification and structure)", poem:"eagle", parts:[
        "An eagle grips a cliff high above the sea, watches from its height, and then suddenly dives.",
        "Five lines show the bird almost still, and only the last word, “falls”, moves it.",
        "The poem presents the eagle as a lonely king whose power is both majestic and dangerous.",
        "Tennyson’s personification of the “crooked hands” and the “wrinkled sea” that crawls makes the bird godlike and the world small, so the final simile intensifies the dive into a strike from the heavens (lines 1–6).",
        "This suggests that true power is felt most in the instant it is released."] },
      { title:"Model 3: Wordsworth (focus: diction and reframing)", poem:"words", parts:[
        "Walking alone, the speaker suddenly sees a huge group of golden daffodils moving in the wind beside a lake.",
        "Wordsworth calls the flowers “A host, of golden daffodils” (line 4).",
        "The poem implies that nature can ease loneliness by offering company the speaker did not expect.",
        "The shift from the single “cloud” to “a crowd” and “a host” reframes isolation as belonging, and the personification in “dancing” gives the flowers a sociable energy (lines 1–6).",
        "This suggests the poem is less about flowers than about how attention can turn solitude into joy."] }]
  },
  cards:[
    ["Paraphrase", "What the text says, in plain words: “A broken stone face lies half buried” for “Half sunk a shattered visage lies” (Shelley)."],
    ["Observation", "A specific, quotable feature: the boast “Look on my Works” sits just before “Nothing beside remains.”"],
    ["Interpretation", "What a detail suggests: “The king’s power did not last.”"],
    ["Analysis", "How craft creates meaning, and why it matters: the placement of the boast turns it into a warning about power."],
    ["“So what?”", "The significance test every observation must pass."],
    ["Personal response", "Your reaction (“I found it eerie”): valuable, but not interpretation."],
    ["Irony", "Words whose meaning reverses in context: “Look on my Works, ye Mighty, and despair!”"],
    ["Juxtaposition", "Placing two things side by side for contrast: the boast beside “Nothing beside remains.”"],
    ["Frame narrative", "A story told inside another telling: “I met a traveller … Who said…” (Shelley)."],
    ["Strong analysis verb", "A verb that says how: undercuts, reframes, intensifies, juxtaposes, implies."],
    ["Plop quote", "A quotation dropped in without a lead-in or explanation. Fix it: lead in, quote, cite, explain."],
    ["Overreach", "A claim bigger than the evidence: “This proves Shelley hated all kings.”"]
  ]
};
