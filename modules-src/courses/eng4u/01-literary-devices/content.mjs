// ENG4U 01 Literary Devices & Figurative Language. Source: /Users/ali/Desktop/MV/Modules/eng4u/plan/modules/01-literary-devices.md
// Public-domain lines only (Tennyson, Sandburg 1916, Shakespeare, Wordsworth, Dickinson, McCrae, Poe, E. Pauline Johnson, Donne,
// Coleridge, Marvell); everything else is original to the course.

// Misconception core sentences (plan §3), reused where the plan tags a wrong option with M1–M7 but gives no feedback text.
const M1 = "You’ve named the tool. Now say what it builds: what does the reader see, hear or feel because of it?";
const M2 = "A simile signals the comparison with “like” or “as”. A metaphor says one thing <em>is</em> another.";
const M6 = "Swap the figure for a literal phrase and see what disappears. That loss is the figure’s meaning.";

// Device sort hints (Activity 1): the first two are shared, the third is the answer with its reason.
const SH = (h3) => ["Look for “like” or “as” first.", "Is something given human traits, or does one thing <em>become</em> another?", h3];

// Lens key (Explore). Token indices follow MV.eng.tokenize(lines, {breaks:true}): one token per word, a "/" token at each line break.
// span: the core spans a Hunt tag may match (accepted within one word either side); w: the words the lens highlights.
const CARDS = [
  { id:"L1", lines:["He clasps the crag with crooked hands;"], author:"Tennyson, “The Eagle”", cite:"Tennyson, “The Eagle”, line 1",
    parts:["the eagle", "human hands", "the crag", "the sun"],
    devices:[
      { id:"L1s", lens:"sound", w:[1, 3, 5], span:[[1, 5]], label:"clasps · crag · crooked", tag:"alliteration (/k/)", accept:["alliteration", "consonance"], note:"harsh, gripping sounds; a fierce hold" },
      { id:"L1f", lens:"figure", w:[5, 6], span:[[5, 6]], label:"crooked hands", tag:"personification", accept:["personification"], note:"the eagle given human hands: grasping, deliberate, almost kingly",
        tenor:"the eagle", vehicle:"human hands", ground:"grasping, deliberate, almost kingly" }
    ] },
  { id:"L2", lines:["The fog comes", "on little cat feet."], author:"Carl Sandburg, “Fog” (1916)", cite:"Sandburg, “Fog”, lines 1–2",
    parts:["the fog", "a cat", "the harbour", "silence"],
    swap:"The fog comes in slowly and quietly.", rate:[[5, 4, 4], [2, 1, 0]],
    devices:[
      { id:"L2f", lens:"figure", w:[1, 5, 6, 7], span:[[1, 7], [5, 7]], label:"fog … little cat feet", tag:"implied metaphor", accept:["implied metaphor", "metaphor"], note:"the fog is pictured as a cat: silent, padding, a little mysterious",
        tenor:"the fog", vehicle:"a cat", ground:"silent, padding, a little mysterious" },
      { id:"L2t", lens:"structure", w:[3], span:[[3, 3]], label:"line break after “comes”", tag:"enjambment", accept:["enjambment"], note:"a pause, as if the fog hesitates" }
    ] },
  { id:"L3", lines:["But, soft! what light through yonder window breaks?", "It is the east, and Juliet is the sun."], author:"Shakespeare, <i>Romeo and Juliet</i>", cite:"<i>Romeo and Juliet</i> 2.2.2–3",
    parts:["Juliet", "the sun", "the east", "the window"],
    swap:"Juliet is very beautiful.", rate:[[5, 5, 3], [1, 2, 0]],
    devices:[
      { id:"L3f", lens:"figure", w:[14, 15, 16, 17], span:[[14, 17]], label:"Juliet is the sun", tag:"metaphor", accept:["metaphor"], note:"Juliet as the centre of Romeo’s world: light, warmth, life",
        tenor:"Juliet", vehicle:"the sun", ground:"light, warmth, the centre everything turns toward", readEffect:"Juliet becomes the centre of Romeo’s world." },
      { id:"L3i", lens:"imagery", w:[3, 6, 7], span:[[3, 7]], label:"light … window breaks", tag:"visual imagery", accept:["visual imagery"], note:"dawn breaking; Juliet as a sunrise" }
    ],
    // P3: "What would change if Romeo said 'Juliet is like the sun'?" (the morph adds "like" as token 16)
    like:{ lines:["But, soft! what light through yonder window breaks?", "It is the east, and Juliet is like the sun."], fresh:[16],
      devices:[
        { id:"L3fl", lens:"figure", w:[14, 15, 16, 17, 18], span:[[14, 18]], label:"Juliet is like the sun", tag:"simile", accept:["simile"], note:"the claim hedges: Juliet only resembles the sun",
          tenor:"Juliet", vehicle:"the sun", ground:"light, warmth, the centre everything turns toward" },
        { id:"L3il", lens:"imagery", w:[3, 6, 7], span:[[3, 7]], label:"light … window breaks", tag:"visual imagery", accept:["visual imagery"], note:"dawn breaking; Juliet as a sunrise" }
      ] } },
  { id:"L4", lines:["I wandered lonely as a cloud", "That floats on high o’er vales and hills,"], author:"Wordsworth, “I Wandered Lonely as a Cloud”", cite:"Wordsworth, “I Wandered Lonely as a Cloud”, lines 1–2",
    parts:["the speaker", "a cloud", "the hills", "loneliness"],
    swap:"I walked around alone.", rate:[[4, 4, 3], [1, 2, 0]],
    devices:[
      { id:"L4f", lens:"figure", w:[2, 3, 4, 5], span:[[2, 5]], label:"lonely as a cloud", tag:"simile", accept:["simile"], note:"solitary, drifting, above the world",
        tenor:"the speaker", vehicle:"a cloud", ground:"solitary, drifting, above the world" },
      { id:"L4s", lens:"sound", w:[12, 13, 14], span:[[12, 14]], label:"vales and hills", tag:"assonance/consonance (l)", accept:["assonance", "consonance"], note:"soft, floating sounds" }
    ] },
  { id:"L5", lines:["“Hope” is the thing with feathers –", "That perches in the soul –"], author:"Emily Dickinson", cite:"Dickinson, “‘Hope’ is the thing with feathers”, lines 1–2",
    parts:["hope", "a bird", "the soul", "feathers"],
    swap:"Hope stays inside us.", rate:[[4, 4, 4], [1, 2, 0]],
    devices:[
      { id:"L5f", lens:"figure", w:[0, 1, 2, 3, 4, 5], span:[[0, 5], [3, 5]], label:"“Hope” is the thing with feathers", tag:"metaphor", accept:["metaphor"], note:"hope as a small bird: fragile, alive, singing",
        tenor:"hope", vehicle:"a bird", ground:"fragile, alive, singing" },
      { id:"L5t", lens:"structure", w:[6, 13], span:[[6, 6], [13, 13], [6, 13]], label:"dashes", tag:"punctuation", accept:["punctuation"], note:"breath-like pauses; thought in motion" }
    ] },
  { id:"L6", lines:["In Flanders fields the poppies blow", "Between the crosses, row on row,"], author:"John McCrae (1915)", cite:"McCrae, “In Flanders Fields”, lines 1–2",
    parts:null,
    devices:[
      { id:"L6s", lens:"sound", w:[1, 2], span:[[1, 2]], label:"Flanders fields", tag:"alliteration (/f/)", accept:["alliteration"], note:"soft, mournful opening" },
      { id:"L6t", lens:"structure", w:[10, 11, 12], span:[[10, 12]], label:"row on row", tag:"repetition", accept:["repetition"], note:"endless rows of graves made visible" },
      { id:"L6i", lens:"imagery", w:[4, 9], span:[[4, 9]], label:"poppies … crosses", tag:"visual imagery / contrast", accept:["visual imagery", "contrast"], note:"living colour against grave markers" }
    ] },
  { id:"L7", lines:["Once upon a midnight dreary, while I pondered, weak and weary,"], author:"Poe, “The Raven”", cite:"Poe, “The Raven”, line 1",
    parts:null,
    devices:[
      { id:"L7r", lens:"sound", w:[4, 10], span:[[4, 10]], label:"dreary · weary", tag:"internal rhyme", accept:["internal rhyme"], note:"a chiming, hypnotic rhythm" },
      { id:"L7w", lens:"sound", w:[0, 5, 8, 10], span:[[0, 10]], label:"Once · while · weak · weary", tag:"alliteration (/w/)", accept:["alliteration"], note:"a drowsy, sighing sound; “Once” begins with /w/" }
    ] },
  { id:"L8", lines:["West wind, blow from your prairie nest,", "Blow from the mountains, blow from the west."], author:"E. Pauline Johnson (Tekahionwake), “The Song My Paddle Sings”", cite:"Johnson, “The Song My Paddle Sings”, lines 1–2",
    parts:["the west wind", "a living being", "the prairie", "the mountains"],
    devices:[
      { id:"L8f", lens:"figure", w:[0, 1, 4, 5, 6], span:[[0, 6]], label:"West wind … your prairie nest", tag:"apostrophe and personification", accept:["apostrophe", "personification"], note:"the speaker calls to the wind as if it could hear and answer",
        tenor:"the west wind", vehicle:"a living being", ground:"it can hear, answer and come when called" },
      { id:"L8s", lens:"sound", w:[2, 8, 12], span:[[2, 12]], label:"blow … blow … blow", tag:"repetition", accept:["repetition"], note:"a chant, like a paddler’s rhythm" },
      { id:"L8d", lens:"diction", w:[5, 11, 15], span:[[5, 15]], label:"prairie, mountains, west", tag:"place words", accept:["place words"], note:"a Canadian landscape claimed in song" }
    ] }
];

const TODAY = ["He clasps the crag with crooked hands; (Tennyson, “The Eagle”)", "The fog comes / on little cat feet. (Sandburg, “Fog”)",
  "It is the east, and Juliet is the sun. (Shakespeare, Romeo and Juliet)", "I wandered lonely as a cloud (Wordsworth)",
  "“Hope” is the thing with feathers – / That perches in the soul – (Dickinson)", "In Flanders fields the poppies blow / Between the crosses, row on row, (McCrae)",
  "Once upon a midnight dreary, while I pondered, weak and weary, (Poe, “The Raven”)", "West wind, blow from your prairie nest, / Blow from the mountains, blow from the west. (Johnson, “The Song My Paddle Sings”)",
  "And like a thunderbolt he falls. (Tennyson, “The Eagle”)"];

export default {
  id:"01-literary-devices",
  kind:"topic",
  title:"Literary devices and figurative language",
  topic:"Literary Devices & Figurative Language",
  readyTopic:"literary devices and figurative language",
  hero:{
    headline:"Six lines, one eagle, and every word working.",
    text:"Writers choose <strong>devices</strong> the way a carpenter chooses tools: to make something happen. Tennyson’s eagle <em>clasps</em> with <em>hands</em>; the sea <em>crawls</em>; the bird falls <em>like a thunderbolt</em>. That’s <strong>figurative language</strong>: meaning carried across from one thing to another. Listen too: the hard /k/ sounds of “clasps the crag with crooked” grip like talons. That’s a <strong>sound device</strong>. In this module you’ll learn to hear these tools, name them precisely, and, most importantly, say what they <em>do</em>.",
    fig:{ html:'<div class="hp" id="hero-poem" aria-label="The poem The Eagle by Alfred, Lord Tennyson, with an animated reading"></div>', caption:"" },
    poem:["He clasps the crag with crooked hands;", "Close to the sun in lonely lands,", "Ring’d with the azure world, he stands.", "", "The wrinkled sea beneath him crawls;", "He watches from his mountain walls,", "And like a thunderbolt he falls."],
    cite:"Alfred, Lord Tennyson, “The Eagle” (1851)",
    sound:[1, 3, 5], figure:[6, 26], fall:38
  },
  goals:[
    "I can identify sound, figurative and structural devices in a line of poetry or prose.",
    "I can explain what a device <em>does</em> (its effect on meaning and feeling), not just name it.",
    "I can tell metaphor, simile, personification and symbol apart by how they work (tenor, vehicle, ground).",
    "I can hear sound devices when a line is read aloud, and judge them by sound, not spelling.",
    "I can create fresh figurative language that fits its purpose and avoids cliché.",
    "I can write an analysis sentence that links device → effect → meaning, using the precise term."
  ],
  start:{
    blocks:[{ title:"Word story", html:"<p><strong><em>Metaphor</em></strong>, from Greek <em>metapherein</em>, “to carry across” (<em>meta</em>, across, and <em>pherein</em>, to carry). In Greece today, removal vans can still carry the related word <em>metaphorés</em>: transport. A metaphor is a moving van for meaning: it picks up a quality from one place and sets it down in another.</p><p class=\"tiny muted\">Word stories are short histories; see a dictionary’s etymology for more.</p>" }],
    warmup:{
      questions:[
        { id:"w1", skill:"Figurative vs literal", goal:2,
          prompt:"Which sentence uses language <strong>figuratively</strong>?",
          options:[
            { t:"“The hallway swallowed the last of the students.”", ok:true, why:"A hallway can’t literally swallow; the figure makes the emptying feel sudden and complete." },
            { t:"“The hallway was empty after the bell.”", why:"Everything here is literally true." },
            { t:"“The students walked quickly down the long hallway.”", why:"<em>Quickly</em> and <em>long</em> describe; they don’t carry meaning across." },
            { t:"“The hallway is forty metres long.”", why:"Measurements are literal." }],
          hints:["Which sentence couldn’t be literally true?", "Can a hallway swallow?", "“The hallway swallowed the last of the students”: the hallway is pictured as a mouth."] },
        { id:"w2", skill:"Figurative vs literal", goal:6,
          prompt:"“My backpack weighs a ton.” What is this, and why might someone say it?",
          options:[
            { t:"Hyperbole: a deliberate exaggeration that conveys how heavy the bag <em>feels</em>", ok:true, why:"No backpack weighs a ton; the overstatement expresses the feeling." },
            { t:"A simile, because it compares the bag to a ton", why:"There’s no “like” or “as”, and it isn’t a comparison; it’s an exaggeration." },
            { t:"A literal measurement", why:"A tonne is 1000 kg." },
            { t:"Personification of the backpack", why:"The bag isn’t given human traits." }],
          hints:["Is it literally true?", "It’s an exaggeration on purpose.", "Hyperbole."] },
        { id:"w3", skill:"Simile and metaphor", goal:3,
          prompt:"Which line contains a <strong>simile</strong>?",
          options:[
            { t:"“I wandered lonely as a cloud” (Wordsworth, line 1)", ok:true, why:"“As” signals the comparison between the speaker and a cloud." },
            { t:"“It is the east, and Juliet is the sun.”", why:"This asserts that Juliet <em>is</em> the sun: a metaphor." },
            { t:"“The fog comes / on little cat feet.”", why:"No “like” or “as”; the fog is pictured as a cat: an implied metaphor." },
            { t:"“Death, be not proud.”", why:"That’s apostrophe: speaking directly to Death." }],
          hints:["Look for the signal words.", "“Like” or “as”.", "“lonely as a cloud”."] },
        { id:"w4", skill:"Simile and metaphor", goal:3,
          prompt:"In “Juliet is the sun,” what is being described, and what is it compared to?",
          options:[
            { t:"Juliet is described; the sun is what she’s compared to", ok:true, why:"Juliet is the subject (the tenor); the sun carries the qualities (the vehicle)." },
            { t:"The sun is described; Juliet is what it’s compared to", why:"Romeo is talking about Juliet, not astronomy." },
            { t:"Both are described literally", why:"Juliet isn’t literally a star." },
            { t:"Nothing is compared; it’s a symbol", why:"A symbol is a thing in the story that stands for more; here Romeo compares Juliet to the sun." }],
          hints:["Who is Romeo looking at?", "The sun lends its qualities to her.", "Juliet described; the sun the comparison."] },
        { id:"w5", skill:"Sound devices", goal:4,
          prompt:"Read aloud: “Hear the mellow wedding bells” (Poe). Which sound device is strongest?",
          options:[
            { t:"Assonance: the repeated short <em>e</em> vowel sound in “mellow”, “wedding” and “bells”", ok:true, why:"Repeated vowel sounds make the line ring, like the bells." },
            { t:"Alliteration on “h”", why:"Only one word starts with /h/." },
            { t:"Onomatopoeia", why:"No word here imitates a sound the way “ding” or “clang” would." },
            { t:"End rhyme", why:"Rhyme needs two line endings that sound alike; this is one line." }],
          hints:["Say the vowels in the middle of the words.", "mEllow, wEdding, bElls.", "Repeated vowel sounds: assonance."] },
        { id:"w6", skill:"Connotation", goal:2,
          prompt:"Three words for a thin person: <em>slender</em>, <em>skinny</em>, <em>scrawny</em>. Which statement is accurate?",
          options:[
            { t:"They share a dictionary meaning (denotation) but carry different feelings (connotations), from admiring to unkind", ok:true, why:"<em>Slender</em> flatters, <em>skinny</em> is neutral to negative, <em>scrawny</em> is harsh." },
            { t:"They mean exactly the same thing, so a writer can use any of them", why:"Readers feel the difference." },
            { t:"Only “scrawny” has a connotation", why:"Every word carries some feeling." },
            { t:"Connotation only matters in poetry", why:"It matters in every sentence, including ads and news." }],
          hints:["Which would you use as a compliment?", "Same meaning, different feeling.", "Denotation vs connotation."] }
      ],
      refreshers:{
        "Figurative vs literal":"Literal language means exactly what it says. Figurative language means more than it says, by comparing, exaggerating or giving human traits. Test: could this be literally true?",
        "Simile and metaphor":"A simile signals a comparison with “like” or “as” (“lonely as a cloud”). A metaphor says one thing <em>is</em> another (“Juliet is the sun”). Both have a tenor (the subject) and a vehicle (the comparison).",
        "Sound devices":"Alliteration repeats beginning consonant <em>sounds</em>; assonance repeats vowel sounds; consonance repeats consonant sounds anywhere; onomatopoeia imitates a sound. Always test by saying the line aloud.",
        "Connotation":"Denotation is the dictionary meaning; connotation is the feeling a word carries. Writers choose words for both."
      }
    }
  },
  explore:{
    heading:"Device lens",
    intro:"Eight lines from writers who knew their tools. Switch on a lens to see the devices, or switch them all off and hunt for them yourself.",
    lenses:[{ id:"sound", label:"Sound", role:"sound" }, { id:"imagery", label:"Imagery", role:"image" }, { id:"figure", label:"Figure", role:"figure" }, { id:"structure", label:"Structure", role:"syntax" }, { id:"diction", label:"Diction", role:"diction" }],
    menu:{ sound:["alliteration", "assonance", "consonance", "internal rhyme", "repetition", "onomatopoeia", "sibilance"], imagery:["visual imagery", "contrast"],
      figure:["metaphor", "implied metaphor", "simile", "personification", "apostrophe", "symbol"], structure:["enjambment", "repetition", "punctuation"], diction:["place words", "connotation"] },
    cards:CARDS,
    meterNote:"One careful reader’s ratings. Do you agree?",
    aha:"A device is a decision. When you remove it, meaning leaks out, and the loss tells you what the device was doing.",
    rebuild:{ literal:"The traffic moved slowly.",
      verbs:[{ t:"crawled", slow:true, viv:0 }, { t:"oozed", slow:true, viv:1 }, { t:"inched", slow:true, viv:1 }, { t:"raced", slow:false, viv:0 }],
      vehicles:[{ id:"snail", t:"a snail", noun:"snail", viv:2, fit:"cliche" }, { id:"glacier", t:"a glacier", noun:"glacier", viv:4, fit:"slow" }, { id:"honey", t:"honey", noun:"honey", viv:4, fit:"slow" },
        { id:"lightning", t:"lightning", noun:"lightning", viv:4, fit:"fast" }, { id:"river", t:"a river", noun:"river", viv:3, fit:"either" }],
      fitText:{ slow:"fits the scene", cliche:"fits, but it’s a cliché", fast:"fights the meaning", either:"unclear: a river can be slow or fast" } },
    predIntro:"Make a prediction first. Then the lens will show you what really happens.",
    predictions:[
      { id:"p1",
        prompt:"If “on little cat feet” became “slowly and quietly,” what would be lost?",
        options:[{ t:"The picture of silent, padding movement and the fog’s sly, cat-like personality", ok:true }, { t:"Nothing; the meaning is identical" }, { t:"The rhyme" }, { t:"The poem’s setting" }],
        explain:"The figure gives the fog a body and a temperament. “Slowly and quietly” keeps the facts but loses the creature." },
      { id:"p2",
        prompt:"Before you switch on Sound: which effect will it reveal in “He clasps the crag with crooked hands”?",
        options:[{ t:"Repeated hard /k/ sounds that make the grip sound tight and fierce", ok:true }, { t:"A rhyme inside the line" }, { t:"Onomatopoeia imitating an eagle’s cry" }, { t:"Soft <em>s</em> sounds that calm the line" }],
        explain:"Hard consonants are hard to say. The effort in your mouth becomes the effort in the talons." },
      { id:"p3",
        prompt:"What would change if Romeo said “Juliet is <em>like</em> the sun”?",
        options:[{ t:"The claim would weaken from an identity to a resemblance", ok:true }, { t:"It would get stronger" }, { t:"Nothing would change" }, { t:"It would become personification" }],
        explain:"A metaphor dares to say she <em>is</em> the sun. A simile hedges: she resembles it. Romeo isn’t in a hedging mood." },
      { id:"p4",
        prompt:"The Structure lens is about to mark “row on row”. Predict its effect.",
        options:[{ t:"The repetition shows the rows of graves going on and on, making the scale of loss visible", ok:true }, { t:"It tells us the poppies are growing quickly" }, { t:"It signals that a new speaker begins" }, { t:"It names the colour of the poppies" }],
        explain:"Repetition can enact what it describes: you read “row” and then another “row”, as the eye moves across a field of graves." }
    ],
    chalIntro:"Use the device lens to meet each goal, then press <strong>Check challenge</strong>. <strong>Set it up</strong> opens the right line and mode. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 3],
        prompt:"<strong>Name the parts.</strong> In Hunt mode, on L5: tag the metaphor in Dickinson’s line, then name its tenor and vehicle. <button type=\"button\" class=\"btn ghost sm dl-setup\" data-setup=\"tc1\">Set it up</button>",
        why:"Dickinson says hope <em>is</em> the thing with feathers: a metaphor. Hope is the tenor (what’s described); a bird is the vehicle (it carries the qualities).",
        hints:["What is the poem talking about?", "Hope is pictured as something with feathers.", "Metaphor; tenor = hope; vehicle = a bird."] },
      { id:"tc2", goal:5,
        prompt:"<strong>Make it fresh.</strong> In Effect m&#101;ter mode, start from the literal sentence “The traffic moved slowly.” Rebuild it with a figure so it’s vivid <em>and</em> fits. Use the chips: a verb (crawled · oozed · inched · raced) and a vehicle (a snail · a glacier · honey · lightning · a river). <button type=\"button\" class=\"btn ghost sm dl-setup\" data-setup=\"tc2\">Set it up</button>",
        why:"A slow verb with a vehicle that’s slow by nature, and not worn out: Vividness reads 4 or more and Fit reads “fits the scene”.",
        hints:["Which vehicles are slow by nature?", "Which of those haven’t you heard a hundred times?", "“The traffic oozed like honey” or “inched like a glacier”."] },
      { id:"tc3", goal:[1, 4], stretch:true,
        prompt:"<strong>Hear it, don’t read it.</strong> In Hunt mode, on L7: tag every word in Poe’s line that <strong>begins with a /w/ sound</strong> as Sound → alliteration. Spelling will try to trick you. <button type=\"button\" class=\"btn ghost sm dl-setup\" data-setup=\"tc3\">Set it up</button>",
        why:"Exactly. Alliteration lives in the mouth, not on the page. That drowsy run of /w/ sounds is part of why the line feels so weary.",
        hints:["Read the line aloud slowly. Press Slow.", "Four words begin with the same sound. One of them is spelled with O.", "Once (wunce), while, weak, weary."] }
    ]
  },
  part3:{
    slug:"make", name:"Make",
    heading:"Make the figure",
    intro:"Explore taught you to read figures. Now build your own with the same tools: tenor, vehicle and ground. A “Why it works” panel holds each figure to three tests: <strong>fit</strong>, <strong>freshness</strong> and <strong>extension</strong>.",
    make:{
      tenors:["grief", "the city at night", "a first job", "memory", "a winter morning in your town"],
      vehicles:["a tide", "a locked room", "a sleeping animal", "a heavy coat", "a ghost"],
      verbs:["whispers", "waits", "forgets", "keeps watch", "sighs"],
      forms:[
        { id:"metaphor", label:"Metaphor", note:"Identity: it says the tenor <em>is</em> the vehicle." },
        { id:"simile", label:"Simile", note:"Resemblance: it says the tenor is only <em>like</em> the vehicle." },
        { id:"personification", label:"Personification", note:"A lent human life: the tenor acts like a person." }],
      text:[
        { form:"Metaphor", card:"L3", line:"“It is the east, and Juliet is the sun.”", cite:"(<i>Romeo and Juliet</i> 2.2.3)", note:"She <em>is</em> the sun: an identity." },
        { form:"Simile", card:"L4", line:"“I wandered lonely as a cloud”", cite:"(Wordsworth, line 1)", note:"“As” signals a resemblance." },
        { form:"Personification", card:"L1", line:"“He clasps the crag with crooked hands;”", cite:"(Tennyson, line 1)", note:"The eagle is lent human hands." }],
      cliches:["heart of gold", "cold as ice", "time flies", "a sea of faces", "busy as a bee", "light as a feather", "quiet as a mouse", "snails pace", "packed like sardines",
        "white as snow", "black as night", "sharp as a tack", "fit as a fiddle", "pretty as a picture", "brave as a lion", "strong as an ox", "slow as molasses", "quick as a flash",
        "clear as crystal", "crystal clear", "dead as a doornail", "hard as nails", "sly as a fox", "busy as a beaver", "cool as a cucumber", "happy as a clam", "blind as a bat",
        "gentle as a lamb", "old as the hills", "plain as day", "smooth as silk", "sweet as honey", "raining cats and dogs", "calm before the storm", "blanket of snow",
        "heart of stone", "tip of the iceberg", "good as gold", "like a moth to a flame", "wise as an owl"],
      kill:[
        { id:"k1", cliche:"busy as a bee", scene:"a restaurant kitchen at the dinner rush", avoid:["bee", "bees"] },
        { id:"k2", cliche:"cold as ice", scene:"an outdoor rink in January", avoid:["ice", "icy"] },
        { id:"k3", cliche:"light as a feather", scene:"an empty backpack on the last day of school", avoid:["feather", "feathers"] },
        { id:"k4", cliche:"quiet as a mouse", scene:"a waiting room at 3 a.m.", avoid:["mouse", "mice"] },
        { id:"k5", cliche:"time flies", scene:"the last week of summer holidays", avoid:["fly", "flies", "flying", "flew", "flown"] }],
      clicheMsg:"Readers have seen this one too often to see it. Find a vehicle only you would think of that still fits.",
      extendEx:"If grief is a tide, what is the moon?"
    },
    quickCheck:{
      title:"Make the figure quick check", summary:"Make the figure quick check",
      items:[
        { id:"q1", goal:3, prompt:"In “Grief is a tide,” what is the vehicle?",
          choices:[{ t:"the tide", ok:true, fb:"Right. Grief is the tenor (what’s described); the tide is the vehicle that carries the meaning." },
            { t:"grief", fb:"The tenor is grief (what’s described); the tide carries the meaning." },
            { t:"the moon", fb:"The tenor is grief (what’s described); the tide carries the meaning." },
            { t:"the shore", fb:"The tenor is grief (what’s described); the tide carries the meaning." }] },
        { id:"q2", goal:5, prompt:"Which is the freshest figure for a crowded bus?",
          choices:[{ t:"“a jar of elbows and wet coats”", ok:true, fb:"Right. It’s fresh, and the elbows and wet coats make you feel the crush." },
            { t:"“a sardine can on wheels”", fb:"“Packed like sardines” is a cliché; “sardine can on wheels” leans on it; “very full” is literal." },
            { t:"“packed like sardines”", fb:"“Packed like sardines” is a cliché; “sardine can on wheels” leans on it; “very full” is literal." },
            { t:"“very full”", fb:"“Packed like sardines” is a cliché; “sardine can on wheels” leans on it; “very full” is literal." }] },
        { id:"q3", goal:3, prompt:"A green light at the end of a dock appears again and again in a novel and comes to stand for a character’s longing. This is a…",
          choices:[{ t:"symbol", ok:true, fb:"Right. It’s a real object in the story that also stands for more." },
            { t:"simile", fb:"It’s a real object in the story that also stands for more." },
            { t:"metaphor", fb:"It’s a real object in the story that also stands for more." },
            { t:"hyperbole", fb:"It’s a real object in the story that also stands for more." }] },
        { id:"q4", goal:3, prompt:"Turn “The city is a sleeping animal” into personification.",
          choices:[{ t:"“The city snores under its blanket of fog.”", ok:true, fb:"Right. Personification gives the city a human action (snoring) and human things (a blanket)." },
            { t:"“The city is like an animal.”", fb:"Personification gives the city a human action (snoring) and human things (a blanket)." },
            { t:"“The city is very quiet.”", fb:"Personification gives the city a human action (snoring) and human things (a blanket)." },
            { t:"“The city has many animals.”", fb:"Personification gives the city a human action (snoring) and human things (a blanket)." }] }
      ]
    },
    blocksAfter:[{ type:"write", id:"steal", title:"Sentence to steal",
      html:"<p class=\"steal-line\">“The fog comes / on little cat feet.”</p><p class=\"eng-cite\">Carl Sandburg, “Fog” (1916), lines 1–2</p><p><strong>Its shape:</strong> “The [natural or abstract thing] comes / on [small adjective] [animal] [body part].”</p><p><strong>Model imitation:</strong> “The rumour arrives / on narrow ferret paws.”</p><p>Keep the shape. Change the content. Notice what the shape does: a short line, a break, then a surprising body.</p>",
      prompt:"Your imitation:" }]
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Device sort", summary:"Device sort", noun:"line", txt:true, goal:[1, 3],
        instruction:"Sort ten lines by their main device.",
        how:"Tap a line, then tap the box it belongs in. Each line has one main device.",
        boxes:[{ id:"b1", label:"Simile" }, { id:"b2", label:"Metaphor" }, { id:"b3", label:"Personification" }, { id:"b4", label:"Sound device" }],
        wrongDefault:"Look for “like” or “as” first. Then ask: is something given human traits, does one thing <em>become</em> another, or is the line working on the ear?",
        items:[
          { id:"i1", t:"“I wandered lonely as a cloud” (Wordsworth)", answer:"b1", why:"“As” signals the comparison between the speaker and a cloud.", wrong:{ b2:"“As” signals a simile." }, hints:SH("Simile: “lonely as a cloud” uses “as”.") },
          { id:"i2", t:"“It is the east, and Juliet is the sun.” (Shakespeare)", answer:"b2", why:"No “like” or “as”: Juliet <em>is</em> the sun.", wrong:{ b1:"No “like” or “as”; she <em>is</em> the sun." }, hints:SH("Metaphor: Juliet <em>is</em> the sun, with no signal word.") },
          { id:"i3", t:"“The fog comes / on little cat feet.” (Sandburg)", answer:"b2", why:"The fog becomes a cat: an implied metaphor.", wrong:{ b3:"Personification lends <em>human</em> traits; here the fog becomes a cat: an implied metaphor." }, hints:SH("Metaphor: the fog becomes a cat (an implied metaphor), not a person.") },
          { id:"i4", t:"“Because I could not stop for Death – / He kindly stopped for me –” (Dickinson)", answer:"b3", why:"Death is given a human action and manners: he “kindly stopped”.", wrong:{ b2:"Death is given a human action and manners: he “kindly stopped”." }, hints:SH("Personification: Death “kindly stopped”, like a polite person.") },
          { id:"i5", t:"“Hear the mellow wedding bells” (Poe)", answer:"b4", why:"Nothing is compared; the repeated vowel in mellow, wedding, bells (assonance) works on the ear.", wrong:{ b2:"Nothing is compared; listen to the repeated vowel in mellow, wedding, bells." }, hints:SH("Sound device: the repeated short <em>e</em> in mellow, wedding, bells.") },
          { id:"i6", t:"“And like a thunderbolt he falls.” (Tennyson)", answer:"b1", why:"“Like” marks a comparison between the eagle and lightning.", wrong:{ b3:"“Like” marks a comparison between the eagle and lightning." }, hints:SH("Simile: “like a thunderbolt”.") },
          { id:"i7", t:"“the tintinnabulation that so musically wells” (Poe)", answer:"b4", why:"The long, ringing word imitates bells: a sound device.", wrong:{ b1:"The long, ringing word imitates bells: a sound device." }, hints:SH("Sound device: “tintinnabulation” imitates ringing bells.") },
          { id:"i8", t:"“The city’s windows were a thousand sleepless eyes.” (original)", answer:"b2", why:"The sentence says the windows <em>were</em> eyes: the main device is metaphor.", wrong:{ b3:"Accepted thinking. Eyes are human, but the sentence says the windows <em>were</em> eyes: the main device is metaphor." }, hints:SH("Metaphor: the windows <em>were</em> eyes.") },
          { id:"i9", t:"“The old fridge sighed and settled for the night.” (original)", answer:"b3", why:"The fridge is given human actions: sighing, settling for the night.", wrong:{ b4:"The fridge is given human actions: sighing, settling for the night." }, hints:SH("Personification: the fridge sighs and settles like a person.") },
          { id:"i10", t:"“Her laugh was like a door flung open.” (original)", answer:"b1", why:"“Like” signals a simile.", wrong:{ b2:"“Like” signals a simile." }, hints:SH("Simile: “like a door flung open”.") }
        ] },
      { id:"unseen", type:"custom", title:"Unseen passage", summary:"Unseen passage", star:true, goal:[1, 2, 6],
        instruction:"Read the passage, then choose the best answer to each question. Questions 5 and 6 go beyond the Final Check.",
        how:"Pick an answer, then press Check answer. Wrong answers show why; try again.",
        passage:["By February the valley had given up arguing with the cold. The river, which all autumn had chattered over its stones, now lay under a lid of ice, holding its breath. Snow settled on the roofs like dust on forgotten books. At dusk the streetlights came on one by one, small and stubborn, each a match struck against the dark. Nobody walked the main street after six; the wind owned it then, rattling the signs, testing every door. In the bakery window a single lamp burned all night, and the smell of bread leaked out under the door like a rumour of spring."],
        cite:"Original passage, written for this course.",
        items:[
          { id:"u1", goal:[1, 2], prompt:"“lay under a lid of ice, holding its breath”: device and effect?",
            options:[
              { t:"Personification: the frozen river seems tense and waiting, alive but suspended", ok:true, why:"Holding its breath is a human action, so the frozen river seems alive but suspended, waiting." },
              { t:"Simile: the river is compared to someone holding their breath", why:"No “like” or “as”." },
              { t:"Onomatopoeia: the words imitate the sound of ice", why:"No word here imitates a sound; “holding its breath” gives the river a human action." },
              { t:"Hyperbole: the cold is exaggerated", why:"Nothing is exaggerated in size or amount; the river is given a human action." }],
            hints:["Is there “like” or “as”? Is the river given something only people do?", "Holding your breath is a human action.", "Personification: the river seems alive but suspended, waiting."] },
          { id:"u2", goal:2, prompt:"“like dust on forgotten books”: what does the simile suggest about the valley?",
            options:[
              { t:"Neglect and stillness, as if the town has been left on a shelf and time has stopped", ok:true, why:"Dust gathers on what nobody touches; “forgotten” turns the snow into a sign of neglect and stopped time." },
              { t:"That the houses are dirty", why:"Read for feeling, not facts. “Forgotten” is the key word." },
              { t:"That the people of the valley read a lot", why:"That takes the books literally. The books belong to the vehicle, not to the scene." },
              { t:"That the snow is falling heavily", why:"Dust settles lightly and slowly; the simile is about stillness and neglect, not amount." }],
            hints:["What happens to books nobody opens?", "“Forgotten” is the key word.", "Neglect and stillness: the town left on a shelf, time stopped."] },
          { id:"u3", goal:2, prompt:"“each a match struck against the dark”: best reading?",
            options:[
              { t:"Small acts of resistance against an overwhelming darkness; “stubborn” supports it", ok:true, why:"A struck match is small and brief, but it pushes back the dark; “small and stubborn” makes the lights brave." },
              { t:"The lights are dangerous", why:"Matches here are small and brave, not a fire hazard. Stay with the passage’s tone." },
              { t:"The streetlights are lit by hand with matches", why:"That reads the metaphor literally. The match is the vehicle; the streetlights are the tenor." },
              { t:"The darkness is beautiful", why:"The lights are set <em>against</em> the dark; “stubborn” shows resistance, not admiration." }],
            hints:["Which word just before the figure describes the lights?", "“Small and stubborn”: what does a struck match do to the dark?", "Small acts of resistance against an overwhelming dark."] },
          { id:"u4", goal:1, prompt:"“the wind owned it then”: which device, and what does it show?",
            options:[
              { t:"Personification (ownership): the town has surrendered the street to nature after dark", ok:true, why:"Only people own things; giving the wind ownership shows the town handing the street over to nature." },
              { t:"Hyperbole: the wind is exaggerated to seem stronger than it is", why:"It isn’t an exaggeration of size or amount; the wind is given a human right to own." },
              { t:"Simile: the wind is compared to an owner", why:"No “like” or “as”; the wind simply owns the street." },
              { t:"Symbol: the wind stands for the town’s mayor", why:"Nothing in the passage supports that; the wind is given a human right to own." }],
            hints:["Who can own a street?", "The wind is given a human right.", "Personification: the town has surrendered the street to nature after dark."] },
          { id:"u5", goal:6, prompt:"<span class=\"tag\">★</span> Which sentence best analyses the passage as a whole?",
            options:[
              { t:"“The passage moves from images of surrender (the silent river, the abandoned street) to small images of resistance (stubborn lights, the bakery lamp), so that the final simile, ‘a rumour of spring’, turns the description toward hope.”", ok:true, why:"It traces how the figures change across the passage and says what the ending does with them." },
              { t:"“The passage has lots of devices like personification and simile.”", why:"That lists tools without saying what they build." },
              { t:"“The passage describes a cold valley in February.”", why:"That’s summary: it says what happens, not how the figures build meaning." },
              { t:"“The passage proves that the writer dislikes winter.”", why:"That guesses at the writer and ignores the turn toward hope at the end." }],
            hints:["Sort the images: which give up, and which resist?", "Where does the passage end up?", "Surrender → resistance → hope."] },
          { id:"u6", goal:2, prompt:"<span class=\"tag\">★</span> Which single change would most weaken the ending?",
            options:[
              { t:"Replacing “like a rumour of spring” with “and smelled nice”", ok:true, why:"The closing simile carries the turn to hope; “smelled nice” is literal and flat, so the ending loses its meaning." },
              { t:"Changing “single lamp” to “lamp”", why:"That’s a small loss; the closing simile carries the turn to hope." },
              { t:"Changing “after six” to “after seven”", why:"The hour doesn’t carry the passage’s meaning; the closing simile does." },
              { t:"Replacing “bakery” with “bread shop”", why:"A synonym for the place changes little; the closing simile carries the turn to hope." }],
            hints:["Which words carry the turn toward hope?", "Look at the last simile.", "Replacing “like a rumour of spring” with “and smelled nice” removes the turn to hope."] }
        ] },
      { id:"spot", type:"custom", title:"Spot the error", summary:"Spot the error", student:"Bastien", goal:[2, 3, 6],
        instruction:"Bastien made one mistake in each paragraph. Tap the sentence where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Analyse the opening of Wordsworth’s poem.",
            steps:["In the opening line of Wordsworth’s poem, the speaker compares himself to a cloud.", "This comparison is a metaphor.", "The cloud “floats on high o’er vales and hills” (Wordsworth, line 2), drifting above the world.", "The figure makes the speaker’s loneliness feel light and wandering rather than painful."],
            answer:1,
            stepFb:["Sentence 1 is accurate. Keep checking.", "", "Sentence 3 integrates the quotation well. The mistake is earlier.", "Sentence 4 explains the effect. The mistake is earlier."],
            fixes:[
              { t:"This comparison is a simile, signalled by “as” in “lonely as a cloud”.", ok:true, why:"“As” marks the comparison, so it’s a simile." },
              { t:"This comparison is personification.", why:"The speaker isn’t giving the cloud human traits; he compares himself to it." },
              { t:"This comparison is alliteration.", why:"Alliteration is a sound device; this is a comparison." },
              { t:"Sentence 2 is correct.", why:"“As” marks a simile." }],
            hints:["What word links “lonely” and “cloud”?", "“As”.", "Simile."] },
          { id:"e2", goal:2, task:"Analyse line 1 of “The Eagle”.",
            steps:["Tennyson opens “The Eagle” with the eagle’s grip on its perch.", "He writes, “He clasps the crag with crooked hands” (Tennyson, line 1).", "The alliteration in this line is used to make the poem more interesting.", "Tennyson also uses personification by giving the eagle hands."],
            answer:2,
            stepFb:["A fair opening claim. Keep checking.", "The quotation and citation are correct.", "", "Sentence 4 is accurate. The problem came before it."],
            fixes:[
              { t:"The repeated hard /k/ sounds in “clasps”, “crag” and “crooked” are harsh to say, so the grip sounds fierce and unyielding, establishing the eagle’s power before it moves.", ok:true, why:"It says what <em>this</em> alliteration does: device → effect → meaning." },
              { t:"The alliteration in this line is the letter c.", why:"That names the letter, not the effect." },
              { t:"The alliteration shows that Tennyson loved eagles.", why:"That guesses at the poet, not the effect on the reader." },
              { t:"Sentence 3 is fine.", why:"“More interesting” could describe any device. Say what <em>this</em> one does." }],
            hints:["Could “more interesting” describe any device at all?", "What do hard /k/ sounds feel like to say?", "Harsh → fierce grip → power."] },
          { id:"e3", goal:6, task:"Analyse McCrae’s opening.",
            steps:["McCrae’s “In Flanders Fields” opens on a battlefield cemetery.", "The soft /f/ alliteration of “Flanders fields” gives the opening a hushed, mournful sound.", "The repetition in “row on row” (McCrae, line 2) makes the rows of graves seem endless.", "This proves that McCrae believed war is beautiful, because poppies are beautiful flowers.", "Overall, the opening sets a tone of quiet grief."],
            answer:3,
            stepFb:["Accurate. Keep checking.", "Sound and effect are linked. Keep checking.", "Good: the device enacts the meaning.", "", "Sentence 5 is reasonable. The problem is earlier."],
            fixes:[
              { t:"Setting bright poppies among grave markers contrasts living colour with death, sharpening the sense of loss rather than celebrating war.", ok:true, why:"It reads the image for its effect and stays with what the poem supports." },
              { t:"This proves McCrae hated poppies.", why:"Unsupported in the other direction." },
              { t:"This shows the poem is about gardening.", why:"A literal misreading." },
              { t:"Sentence 4 is correct.", why:"“Proves” and “McCrae believed” leap past the evidence. In the poem it’s the dead who speak, not McCrae." }],
            hints:["Does beauty in an image mean the speaker approves of war?", "Look at what the poppies sit beside.", "Contrast of life and death."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which lens surprised you most, and on which line? What did you hear or see that you’d missed before?" },
      { id:"j2", q:"In your own words: why isn’t naming a device enough? Use one line from today as your example." },
      { id:"j3", q:"Explain to a friend the difference between a simile and a metaphor, using a sentence you write yourself." },
      { id:"j4", q:"Which device do you still find hard to hear or name? What will you do the next time you meet it?" }
    ],
    blocks:[{ title:"Commonplace book", html:"<p>Save one line from today that you’d like to remember, and add a note on why it stayed with you.</p><div id=\"cp-app\"></div>" }],
    art:{
      intro:"Write one craft principle about figures or sound that you believe now. Make it a rule a writer could follow. Then pair it with a master’s example from today and an imitation of your own.",
      placeholder:"Your principle, in one sentence",
      examples:TODAY
    },
    artSamples:"<p class=\"tiny muted\" style=\"margin:0 0 6px\">Two sample principles (examples only; write your own):</p><p class=\"an-note an-figure\">“A metaphor should surprise first and feel inevitable second.” <span class=\"muted\">Master: “The fog comes / on little cat feet.” Imitation: “The deadline arrives / on soft accountant shoes.”</span></p><p class=\"an-note an-sound\">“Let the sound of a line do what the line describes.” <span class=\"muted\">Master: “He clasps the crag with crooked hands.” Imitation: “The skates scraped, skidded, scratched across the pond.”</span></p>",
    commonplaceLines:TODAY
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"In “I wandered lonely as a cloud,” the main device is:", options:[
          { t:"a simile", ok:true, why:"“As” signals the comparison." },
          { t:"a metaphor", why:"There’s a signal word: “as”." },
          { t:"onomatopoeia", why:"No word imitates a sound." },
          { t:"an oxymoron", why:"No contradictory words are paired." }] },
        b:{ prompt:"In “Death, be not proud, though some have called thee / Mighty and dreadful” (Donne), the speaker addresses Death directly. This device is:", options:[
          { t:"apostrophe", ok:true, why:"Speaking to someone absent, or to a thing, as if it could hear." },
          { t:"a simile", why:"Nothing is compared with “like” or “as”." },
          { t:"onomatopoeia", why:"No word imitates a sound." },
          { t:"alliteration", why:"The device here is the direct address, not a sound pattern." }] } },
      { id:"k2", cat:"K", goal:[1, 4],
        a:{ prompt:"Read aloud: “He clasps the crag with crooked hands.” Which sound device is most prominent?", options:[
          { t:"alliteration of the /k/ sound", ok:true, why:"Clasps, crag, crooked." },
          { t:"onomatopoeia", why:"No word imitates a sound." },
          { t:"end rhyme", why:"Rhyme needs two line endings; this is one line." },
          { t:"an oxymoron", why:"That’s a pairing of opposites, not a sound." }] },
        b:{ prompt:"Which group of words alliterates on the same <strong>sound</strong>?", options:[
          { t:"“Once,” “while,” “weary”", ok:true, why:"All three begin with a /w/ sound, including “Once”." },
          { t:"“cat,” “city,” “cold”", why:"“City” begins with /s/, not /k/." },
          { t:"“phone,” “pony,” “pear”", why:"“Phone” begins with /f/." },
          { t:"“gentle,” “garden,” “gate”", why:"“Gentle” begins with /j/." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"In “The fog comes / on little cat feet,” what is the <strong>vehicle</strong>?", options:[
          { t:"a cat", ok:true, why:"The cat carries the qualities (silence, stealth) over to the fog." },
          { t:"the fog", why:"The fog is the tenor: what’s being described." },
          { t:"the harbour", why:"The harbour is part of the scene, not the comparison." },
          { t:"silence", why:"Silence is part of the ground (what they share), not the vehicle." }] },
        b:{ prompt:"In “It is the east, and Juliet is the sun,” what is the <strong>tenor</strong>?", options:[
          { t:"Juliet", ok:true, why:"She is what’s being described." },
          { t:"the sun", why:"The sun is the vehicle." },
          { t:"the east", why:"The east sets up the image; Juliet is its subject." },
          { t:"the window", why:"The window is part of the scene." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"“The classroom clock chewed through the afternoon, one slow bite at a time.” Which reading is best supported?", options:[
          { t:"The afternoon feels slow and draining, as if time were being eaten bit by bit", ok:true, why:"“Chewed” and “slow bite” make time a meal that drags on." },
          { t:"The clock is broken.", why:"That reads the figure literally." },
          { t:"The speaker is hungry and thinking about lunch.", why:"Nothing in the line supports it; “chewed” describes time, not the speaker." },
          { t:"The afternoon passes quickly.", why:"“Slow” says the opposite." }] },
        b:{ prompt:"“The highway unrolled ahead of us like a grey ribbon pulled from a spool.” Which reading is best supported?", options:[
          { t:"The road seems smooth, endless and effortless, pulled out ahead of the travellers", ok:true, why:"A ribbon unspooling suggests continuous, easy length." },
          { t:"Someone in the car is sewing.", why:"That takes the simile literally." },
          { t:"The road is damaged and dangerous.", why:"Nothing in the image suggests damage." },
          { t:"The trip is very short.", why:"A spool of ribbon suggests length." }] } },
      { id:"t2", cat:"T", goal:[2, 4],
        a:{ prompt:"Read aloud: “The surf slid and seethed against the sand.” What does the repeated /s/ sound do?", options:[
          { t:"It imitates the hiss of moving water, so the reader hears the scene", ok:true, why:"Sibilance mimics the sound of the surf." },
          { t:"It shows the speaker is angry.", why:"Nothing in the line points to the speaker’s mood." },
          { t:"It creates an end rhyme.", why:"Rhyme needs line endings that sound alike." },
          { t:"It tells us the scene is at night.", why:"Sound devices don’t indicate time of day." }] },
        b:{ prompt:"Read aloud: “The big bass drum boomed, bold and brash.” What does the repeated /b/ sound do?", options:[
          { t:"Its heavy, explosive beats imitate the drum’s pounding", ok:true, why:"Plosive /b/ sounds land like drumbeats." },
          { t:"It makes the line quiet and gentle.", why:"Plosives are loud and hard." },
          { t:"It reveals the drummer’s name.", why:"No name is given." },
          { t:"It is assonance.", why:"These are repeated consonant sounds at the start of words: alliteration." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"“My first job was a small country. It had its own language (prices, codes, ‘Have a nice day’), its own weather (the rush at noon), and its own border, the staff door, which I crossed each Saturday wearing a different face.” How does the figure work?", options:[
          { t:"It is an extended metaphor: each detail (language, weather, border) maps a feature of the job onto a country, showing how separate the work world felt and how the speaker became someone else there", ok:true, why:"Each part of the country matches a part of the job, so the figure keeps working across the whole passage." },
          { t:"It is a simile comparing a job to a country.", why:"There’s no “like” or “as”; it says the job <em>was</em> a country." },
          { t:"The speaker literally moved to another country.", why:"The “border” is the staff door." },
          { t:"It is decoration and adds nothing to meaning.", why:"Remove it and the sense of crossing into another identity disappears." }] },
        b:{ prompt:"“Grief is a house I keep finding new rooms in. Some days I open a door and there is only dust; some days, his coat still hangs on the hook.” How does the figure work?", options:[
          { t:"It is an extended metaphor: grief as a house whose rooms reveal unexpected memories, showing grief as something lived in and still being discovered", ok:true, why:"Rooms, doors, dust and a coat each extend the figure, so grief feels lived in and still unfolding." },
          { t:"It is a simile comparing grief to a house.", why:"There’s no “like” or “as”; it says grief <em>is</em> a house. " + M2 },
          { t:"The speaker is literally moving house.", why:"The house is the vehicle, not a real move. " + M6 },
          { t:"It is a symbol of the speaker’s wealth.", why:"Nothing suggests wealth; the house carries the grief." }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"Which is the best analysis sentence about “He clasps the crag with crooked hands”?", options:[
          { t:"“The harsh /k/ alliteration of ‘clasps the crag with crooked hands’ makes the eagle’s grip sound fierce and unyielding, establishing its power before it ever moves.”", ok:true, why:"It names the device precisely, says what it does (a fierce grip) and why it matters (the eagle’s power)." },
          { t:"“This line has alliteration.”", why:"It names the device without its effect." },
          { t:"“Tennyson uses alliteration to make the poem more interesting.”", why:"“More interesting” could describe any device." },
          { t:"“The eagle has hands, which is a simile.”", why:"Giving the eagle hands is personification." }] },
        b:{ prompt:"Which is the best analysis sentence about “The fog comes / on little cat feet”?", options:[
          { t:"“By picturing the fog as a cat, Sandburg gives it silent, padding movement and a hint of independence, so the weather feels alive and slightly mysterious.”", ok:true, why:"It links the device (the fog as a cat) to its effect (silent movement, independence) and to meaning (the weather feels alive)." },
          { t:"“This is a metaphor.”", why:M1 },
          { t:"“Sandburg uses a metaphor to make it better.”", why:"“Make it better” could describe any device. " + M1 },
          { t:"“The fog is like a cat, which is a simile.”", why:"There’s no “like” in the line." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"Which term most precisely names “O brawling love! O loving hate!” (<i>Romeo and Juliet</i> 1.1)?", options:[
          { t:"oxymoron", ok:true, why:"Opposites (love and hate, brawling and loving) are fused." },
          { t:"simile", why:"Nothing is compared with “like” or “as”." },
          { t:"personification", why:"Love isn’t given human actions here; it’s paired with its opposite." },
          { t:"onomatopoeia", why:"No word imitates a sound." }] },
        b:{ prompt:"“Water, water, every where, / Nor any drop to drink” (Coleridge). The sailors are surrounded by water they cannot drink. Which term best names this situation?", options:[
          { t:"situational irony", ok:true, why:"What happens is the opposite of what you’d expect: water everywhere, yet thirst." },
          { t:"simile", why:"Nothing is compared with “like” or “as”; the lines describe a situation." },
          { t:"onomatopoeia", why:"No word imitates a sound." },
          { t:"personification", why:"The water isn’t given human traits; the point is the gap between what you’d expect and what happens." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A student is writing a poem about the first snowfall of the year and wants a fresh figure for its silence. Which line best meets that goal?", options:[
          { t:"“The snow was a hush the sky had been saving all year.”", ok:true, why:"Fresh, and it fits: silence as something stored up and finally released." },
          { t:"“The snow was as white as snow.”", why:"Circular and flat." },
          { t:"“The snow fell softly and quietly.”", why:"Literal; no figure." },
          { t:"“The snow was a roaring lion.”", why:"Vivid, but it fights the silence." }] },
        b:{ prompt:"A student wants a fresh figure for a crowded subway at rush hour. Which line best meets that goal?", options:[
          { t:"“The subway car was a fist of strangers, clenched between stations.”", ok:true, why:"Fresh, and the fist captures pressure and tension." },
          { t:"“We were packed in like sardines.”", why:"A cliché." },
          { t:"“The subway was very crowded.”", why:"Literal." },
          { t:"“The subway car was a quiet library.”", why:"It fights the scene." }] } },
      { id:"a2", cat:"A", goal:2,
        a:{ prompt:"A (fictional) ad for Polaris Tea reads: “A sunrise in every cup.” What is the metaphor doing?", options:[
          { t:"Linking the tea with warmth, energy and a fresh start, so the ad sells a feeling, not just a drink", ok:true, why:"The sunrise lends its qualities (warmth, energy, a new day) to the tea." },
          { t:"Literally promising that the cup contains the sun", why:"Nobody expects the sun in a cup. " + M6 },
          { t:"Comparing tea to the sun with a simile", why:"There’s no “like” or “as”." },
          { t:"Nothing; slogans don’t use figurative language", why:"Ads are full of figures." }] },
        b:{ prompt:"A (fictional) ad for Bolt Runners shoes reads: “Lightning in a box.” What is the metaphor doing?", options:[
          { t:"Linking the shoes with speed, power and excitement, so buyers imagine themselves transformed", ok:true, why:"Lightning lends its speed and power to the shoes, and to whoever wears them." },
          { t:"Literally warning that the box contains electricity", why:"That reads the figure literally: lightning is the vehicle, carrying speed and power over to the shoes." },
          { t:"Comparing shoes to lightning with a simile", why:"There’s no “like” or “as”; the slogan says the box holds lightning." },
          { t:"Nothing; it’s just the brand’s name", why:"The brand is Bolt Runners; the slogan adds a figure. " + M6 }] } }
    ]
  },
  task:{
    title:"A figure that earns its place", summary:"A figure that earns its place",
    statement:"<p>Write a short piece (a poem or a prose snapshot of 3–6 lines) about a subject from your own life, built around at least one figure and one sound device. Then write its plain, literal “before” version, so a reader can see what your figures do.</p><p class=\"tiny muted\">This checklist makes sure the parts are there. Your teacher reads the writing.</p><details class=\"alg pt-rubric\"><summary>How your teacher reads it (levels 1–4)</summary><div class=\"tbl-wrap\"><table class=\"topic-tbl\"><thead><tr><th scope=\"col\">Level</th><th scope=\"col\">The piece and the craft statement</th></tr></thead><tbody><tr><td>4</td><td>Figures are fresh and precisely fitted; sound reinforces meaning; the before/after contrast shows clear insight; the craft statement uses terms accurately and explains effect convincingly</td></tr><tr><td>3</td><td>Figures fit and are mostly fresh; sound is purposeful; the craft statement explains effect clearly</td></tr><tr><td>2</td><td>Figures are present but partly clichéd or loosely fitted; sound devices are incidental; effect is explained generally</td></tr><tr><td>1</td><td>Figures are missing, mislabelled or clichéd; little sense of effect</td></tr></tbody></table></div></details>",
    checks:["The right length", "At least one figure, tagged", "Your simile really is a simile", "At least one sound device, tagged", "A literal “before” version", "Craft statement"],
    tips:["Poems: 3–6 lines. Prose snapshots: 30–90 words. Short pieces make every word count.",
      "Select your figure in the text and tag it: is it a metaphor, a simile, a personification or a symbol?",
      "A simile needs “like” or “as”. If yours doesn’t have one, it’s probably a metaphor; retag it.",
      "Tag a sound device. If it’s alliteration, select at least two words, and check by saying them aloud.",
      "Write the plain version. No figures, just the facts. It shows what your figures add.",
      "In 40 words or more, explain one choice. What’s your tenor, what’s your vehicle, and what effect did you want?"],
    explainPrompt:"Craft statement: what choices did you make, and why?",
    explainLabel:"Craft statement",
    vocab:"Use at least two of these words: tenor, vehicle, effect, sound, image, literal.",
    checkLabel:"Check my piece",
    success:"Your piece has all its parts. There are many ways to do this well. Here are three very different ones.",
    forms:[{ id:"poem", t:"poem" }, { id:"prose", t:"prose snapshot" }],
    subjects:["a place you know well", "an object you own", "a feeling", "a season in your town"],
    menu:{ figure:["metaphor", "simile", "personification", "symbol"], sound:["alliteration", "assonance", "consonance", "onomatopoeia", "sibilance", "repetition/rhythm"] },
    terms:["tenor", "vehicle", "effect", "sound", "image", "literal"],
    models:[
      { title:"Model response 1: poem, a place (urban, metaphor-led)",
        text:["The subway at seven is a sleeping animal.", "It breathes through iron lungs at every stop,", "shrugs off a coat of commuters,", "and dreams of the dark between stations."],
        tags:"“a sleeping animal” (metaphor); “breathes through iron lungs” (personification); “shrugs off a coat of commuters” (personification, plus alliteration on /k/: coat, commuters).",
        before:"The subway is quiet at seven in the morning. Doors open at each stop and people get off.",
        craft:"My tenor is the subway and my vehicle is a sleeping animal, because early in the morning the train feels alive but not awake. I used “shrugs off a coat of commuters” for the effect of people leaving all at once, and the /k/ sound makes it feel heavy." },
      { title:"Model response 2: prose snapshot, an object (domestic, sound-led)",
        text:["My grandmother’s kettle hisses, spits, then sings — a small brass choir of one. In winter it is the first voice in the house, louder than the radio, warmer than the furnace, and it never once forgot its part."],
        tags:"“hisses, spits, then sings” (sibilance and onomatopoeia); “a small brass choir of one” (metaphor); “never once forgot its part” (personification).",
        before:"My grandmother’s kettle is made of brass and makes noise when it boils. She uses it every morning in winter.",
        craft:"I wanted the sound of the kettle to do the work, so the hissing s sounds come first. The vehicle, a choir, turns the noise into music. That changes the literal fact (it’s loud) into a feeling (it’s comforting and faithful), which is the effect I wanted." },
      { title:"Model response 3: poem, a feeling (abstract, simile-led)",
        text:["Before the exam my worry is like a fly in a jar:", "small, loud, sure there’s a way out,", "hitting the same glass wall again, again."],
        tags:"“like a fly in a jar” (simile); “small, loud” (diction); “again, again” (repetition, a structure device; tagged as Sound: repetition/rhythm).",
        before:"Before the exam I feel worried and I keep thinking the same thoughts.",
        craft:"The tenor is worry and the vehicle is a fly trapped in a jar. The ground is being small but frantic and stuck in a loop. The repetition “again, again” makes the reader feel the same loop. The literal version says I’m worried; the figure makes you hear it buzzing." }
    ]
  },
  cards:[
    ["Figurative language", "Words that mean more than they literally say. “The fog comes / on little cat feet.” (Sandburg)"],
    ["Simile", "A comparison signalled by “like” or “as”. “I wandered lonely as a cloud.” (Wordsworth)"],
    ["Metaphor", "Says one thing <em>is</em> another. “Juliet is the sun.” (<i>Romeo and Juliet</i> 2.2.3)"],
    ["Tenor / vehicle / ground", "Tenor = what’s described (hope); vehicle = what carries the meaning (a bird); ground = what they share. “‘Hope’ is the thing with feathers.” (Dickinson)"],
    ["Personification", "Human qualities given to a non-human thing. “He kindly stopped for me.” (Dickinson, of Death)"],
    ["Apostrophe", "Speaking to something absent or non-human as if it could hear. “Death, be not proud.” (Donne)"],
    ["Alliteration", "Repeated beginning consonant <em>sounds</em>. “He clasps the crag with crooked hands.” (Tennyson)"],
    ["Assonance", "Repeated vowel sounds. “Hear the mellow wedding bells.” (Poe)"],
    ["Onomatopoeia", "A word that imitates a sound. “the tintinnabulation that so musically wells” (Poe)"],
    ["Hyperbole", "Deliberate exaggeration. “An hundred years should go to praise / Thine eyes” (Marvell)"],
    ["Oxymoron", "Contradictory terms fused. “O brawling love! O loving hate!” (<i>Romeo and Juliet</i> 1.1)"],
    ["Symbol", "A concrete thing in a text that also stands for something larger. “The poppies blow / Between the crosses” (McCrae): poppies as remembrance"]
  ]
};
